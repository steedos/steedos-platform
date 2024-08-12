import { pick, omit, isString, merge } from 'lodash';
import * as jwt from 'jsonwebtoken';
import * as Emittery from 'emittery';
import {
  User,
  LoginResult,
  Tokens,
  Session,
  ImpersonationResult,
  HookListener,
  DatabaseInterface,
  AuthenticationService,
  ConnectionInformations,
} from '../types';

import { generateAccessToken, generateRefreshToken, generateRandomToken } from './utils/tokens';

import { emailTemplates, sendMail } from './utils/email';
import { ServerHooks } from './utils/server-hooks';
import { AccountsServerOptions } from './types/accounts-server-options';
import { JwtData } from './types/jwt-data';
import { EmailTemplateType } from './types/email-template-type';

import { removeUserSessionsCacheByUserId } from '@steedos/auth';

import isMobile from "ismobilejs";

const defaultOptions = {
  ambiguousErrorMessages: true,
  tokenSecret: generateRandomToken(),
  tokenConfigs: {
    accessToken: {
      expiresIn: "90m",
    },
    refreshToken: {
      expiresIn: "7d",
    },
  },
  emailTemplates,
  userObjectSanitizer: (user: User) => user,
  sendMail,
  siteUrl: "http://localhost:3000",
};

export class AccountsServer {
  public options: AccountsServerOptions & typeof defaultOptions;
  private services: { [key: string]: AuthenticationService };
  public db: DatabaseInterface;
  private hooks: Emittery;

  constructor(
    options: AccountsServerOptions,
    services: { [key: string]: AuthenticationService }
  ) {
    this.options = merge({ ...defaultOptions }, options);
    if (!this.options.db) {
      throw new Error("A database driver is required");
    }
    //     if (this.options.tokenSecret === defaultOptions.tokenSecret) {
    //       // tslint:disable-next-line no-console
    //       console.log(`
    // You are using the default secret "${this.options.tokenSecret}" which is not secure.
    // Please change it with a strong random token.`);
    //     }

    this.services = services || {};
    this.db = this.options.db;

    // Set the db to all services
    // tslint:disable-next-line
    for (const service in this.services) {
      this.services[service].setStore(this.db);
      this.services[service].server = this;
    }

    // Initialize hooks
    this.hooks = new Emittery();
  }

  public getServices(): { [key: string]: AuthenticationService } {
    return this.services;
  }

  public getOptions(): AccountsServerOptions {
    return this.options;
  }

  public getHooks(): Emittery {
    return this.hooks;
  }

  public on(eventName: string, callback: HookListener): () => void {
    this.hooks.on(eventName, callback);

    return () => this.hooks.off(eventName, callback);
  }

  public async getUserProfile(userId, serviceName = 'password'){
    const service = this.services[serviceName];
    if(!service){
      throw new Error(`Service ${serviceName} not found`);
    }
    return await service.getUserProfile(userId);
  }

  public async loginWithService(
    serviceName: string,
    params: any,
    infos: ConnectionInformations
  ): Promise<LoginResult> {
    const hooksInfo: any = {
      // The service name, such as “password” or “twitter”.
      service: serviceName,
      // The connection informations <ConnectionInformations>
      connection: infos,
      // Params received
      params,
    };
    try {
      if (!this.services[serviceName]) {
        throw new Error(
          `No service with the name ${serviceName} was registered.`
        );
      }

      const user: User | null = await this.services[serviceName].authenticate(
        params
      );
      hooksInfo.user = user;
      if (!user) {
        throw new Error(
          `Service ${serviceName} was not able to authenticate user`
        );
      }
      if (user.deactivated) {
        throw new Error("Your account has been deactivated");
      }

      // Let the user validate the login attempt
      await this.hooks.emitSerial(ServerHooks.ValidateLogin, hooksInfo);

      let enable_MFA = false;
      let logout_other_clients = false;
      let login_expiration_in_days = null;
      let phone_logout_other_clients = false;
      let phone_login_expiration_in_days = null;
      let space = null;
      // 获取用户简档
      const userProfile = await this.services[serviceName].getUserProfile(
        user.id
      );
      if (userProfile) {
        enable_MFA = userProfile.enable_MFA || false;
        logout_other_clients = userProfile.logout_other_clients || false;
        login_expiration_in_days = userProfile.login_expiration_in_days;
        phone_logout_other_clients =
          userProfile.phone_logout_other_clients || false;
        phone_login_expiration_in_days =
          userProfile.phone_login_expiration_in_days;
        space = userProfile.space;
      }
      //启用了多重验证
      if (enable_MFA) {
        //不是验证码登录
        if (!(params.user && params.token)) {
          let _next = "TO_MOBILE_CODE_LOGIN";
          // if(!user.mobile_verified){
          //   _next = 'TO_VERIFY_MOBILE';
          // }
          return { _next, mobile: user.mobile, mobile_verified: user.mobile_verified } as any;
        }
      }

      const loginResult = await this.loginWithUser(
        user,
        Object.assign({}, infos, {
          logout_other_clients,
          login_expiration_in_days,
          phone_logout_other_clients,
          phone_login_expiration_in_days,
          space,
        })
      );
      this.hooks.emit(ServerHooks.LoginSuccess, hooksInfo);
      return loginResult;
    } catch (err) {
      this.hooks.emit(ServerHooks.LoginError, { ...hooksInfo, error: err });
      throw err;
    }
  }

  /**
   * @description Server use only.
   * This method creates a session without authenticating any user identity.
   * Any authentication should happen before calling this function.
   * @param {User} userId - The user object.
   * @param {string} ip - User's ip.
   * @param {string} userAgent - User's client agent.
   * @returns {Promise<LoginResult>} - Session tokens and user object.
   */
  public async loginWithUser(
    user: User,
    infos: ConnectionInformations
  ): Promise<LoginResult> {
    const {
      ip,
      userAgent,
      logout_other_clients,
      login_expiration_in_days,
      phone_logout_other_clients,
      phone_login_expiration_in_days,
      space,
      provider,
      jwtToken,
    } = infos;

    let is_phone = false;
    let is_tablet = false;
    if (infos.userAgent) {
      try {
        const { phone, tablet } = isMobile(infos.userAgent);
        is_phone = phone;
        is_tablet = tablet;
      } catch (Exception) {
        console.log(`Exception`, Exception);
      }
    }

    if (logout_other_clients || phone_logout_other_clients) {
      let query = null;
      if (is_phone) {
        query = { is_phone: true };
      } else {
        query = { is_phone: { $ne: true } };
      }
      //1 将当前user的所有 token 清空
      await this.db.updateUser(user.id, {
        $pull: {
          "services.resume.loginTokens": query,
        },
      });
      //2 将当前user的所有有效 session 下线
      const userSessions = await this.db.findValidSessionsByUserId(
        user.id,
        is_phone
      );
      if (userSessions) {
        for (const userSession of userSessions) {
          await this.db.invalidateSession(userSession.id);
        }
      }
      //3 清理用户所有session 缓存
      removeUserSessionsCacheByUserId(user.id, is_phone);
    }
    const token = jwtToken || generateRandomToken();
    const sessionId = await this.db.createSession(user.id, token, {
      ip,
      userAgent,
      login_expiration_in_days,
      phone_login_expiration_in_days,
      is_phone,
      is_tablet,
      space,
      provider
    });

    const { accessToken, refreshToken } = this.createTokens({
      token,
      userId: user.id,
      name: "",
      email: ""
    });
    const spaces = await this.db.getMySpaces(user.id);
    return {
      sessionId,
      token,
      tokens: {
        refreshToken,
        accessToken,
      },
      space,
      spaces,
      user,
    };
  }

  /**
   * @description Impersonate to another user.
   * @param {string} accessToken - User access token.
   * @param {object} impersonated - impersonated user.
   * @param {string} ip - The user ip.
   * @param {string} userAgent - User user agent.
   * @returns {Promise<Object>} - ImpersonationResult
   */
  public async impersonate(
    accessToken: string,
    impersonated: {
      userId?: string;
      username?: string;
      email?: string;
    },
    ip: string,
    userAgent: string
  ): Promise<ImpersonationResult> {
    try {
      if (!isString(accessToken)) {
        throw new Error("An access token is required");
      }

      try {
        jwt.verify(accessToken, this.options.tokenSecret);
      } catch (err) {
        throw new Error("Access token is not valid");
      }

      const session = await this.findSessionByAccessToken(accessToken);

      if (!session.valid) {
        throw new Error("Session is not valid for user");
      }

      const user = await this.db.findUserById(session.userId);

      if (!user) {
        throw new Error("User not found");
      }

      let impersonatedUser;
      if (impersonated.userId) {
        impersonatedUser = await this.db.findUserById(impersonated.userId);
      } else if (impersonated.username) {
        impersonatedUser = await this.db.findUserByUsername(
          impersonated.username
        );
      } else if (impersonated.email) {
        impersonatedUser = await this.db.findUserByEmail(impersonated.email);
      }

      if (!impersonatedUser) {
        if (this.options.ambiguousErrorMessages) {
          return { authorized: false };
        }
        throw new Error(`Impersonated user not found`);
      }

      if (!this.options.impersonationAuthorize) {
        return { authorized: false };
      }

      const isAuthorized = await this.options.impersonationAuthorize(
        user,
        impersonatedUser
      );

      if (!isAuthorized) {
        return { authorized: false };
      }

      const token = generateRandomToken();
      const newSessionId = await this.db.createSession(
        impersonatedUser.id,
        token,
        {
          ip,
          userAgent,
        },
        { impersonatorUserId: user.id }
      );

      const impersonationTokens = this.createTokens({
        token: newSessionId,
        isImpersonated: true,
        userId: user.id,
        name: user.name,
        email: user.email,
      });
      const impersonationResult = {
        authorized: true,
        tokens: impersonationTokens,
        user: this.sanitizeUser(impersonatedUser),
      };

      this.hooks.emit(ServerHooks.ImpersonationSuccess, {
        user,
        impersonationResult,
      });

      return impersonationResult;
    } catch (e) {
      this.hooks.emit(ServerHooks.ImpersonationError, e);

      throw e;
    }
  }

  /**
   * @description Refresh a user token.
   * @param {string} accessToken - User access token.
   * @param {string} refreshToken - User refresh token.
   * @param {string} ip - User ip.
   * @param {string} userAgent - User user agent.
   * @returns {Promise<Object>} - LoginResult.
   */
  public async refreshTokens(
    accessToken: string,
    refreshToken: string,
    ip: string,
    userAgent: string
  ): Promise<LoginResult> {
    try {
      if (!isString(accessToken) || !isString(refreshToken)) {
        throw new Error("An accessToken and refreshToken are required");
      }

      let sessionToken: string;
      try {
        jwt.verify(refreshToken, this.options.tokenSecret);
        const decodedAccessToken = jwt.verify(
          accessToken,
          this.options.tokenSecret,
          {
            ignoreExpiration: true,
          }
        ) as { data: JwtData };
        sessionToken = decodedAccessToken.data.token;
      } catch (err) {
        throw new Error("Tokens are not valid");
      }

      const session: Session | null = await this.db.findSessionByToken(
        sessionToken
      );
      if (!session) {
        throw new Error("Session not found");
      }

      if (session.valid) {
        const user = await this.db.findUserById(session.userId);
        if (!user) {
          throw new Error("User not found");
        }
        const tokens = this.createTokens({
          token: sessionToken,
          userId: user.id,
          name: user.name,
          email: user.email
        });
        await this.db.updateSession(session.id, { ip, userAgent });

        const result = {
          sessionId: session.id,
          user: this.sanitizeUser(user),
          token: sessionToken,
          tokens,
        };

        this.hooks.emit(ServerHooks.RefreshTokensSuccess, result);

        return result;
      } else {
        throw new Error("Session is no longer valid");
      }
    } catch (err) {
      this.hooks.emit(ServerHooks.RefreshTokensError, err);

      throw err;
    }
  }

  /**
   * @description Refresh a user token.
   * @param {string} token - User session token.
   * @param {boolean} isImpersonated - Should be true if impersonating another user.
   * @returns {Promise<Object>} - Return a new accessToken and refreshToken.
   */
  public createTokens({
    token,
    isImpersonated = false,
    userId,
    name,
    email
  }: {
    token: string;
    isImpersonated?: boolean;
    userId: string;
    name: string,
    email: string
  }): Tokens {
    const { tokenSecret, tokenConfigs } = this.options;
    const jwtData: JwtData = {
      // token,
      isImpersonated,
      userId,
      // name,
      // email
    };
    const accessToken = generateAccessToken({
      data: jwtData,
      secret: tokenSecret,
      config: tokenConfigs.accessToken,
    });
    const refreshToken = generateRefreshToken({
      secret: tokenSecret,
      config: tokenConfigs.refreshToken,
    });
    return { accessToken, refreshToken };
  }

  /**
   * @description Logout a user and invalidate his session.
   * @param {string} accessToken - User access token.
   * @returns {Promise<void>} - Return a promise.
   */
  public async logout(token: string): Promise<Session> {
    try {
      const session: Session = await this.db.findSessionByToken(token);

      if (session && session.valid) {
        await this.db.invalidateSession(session.id);
        this.hooks.emit(ServerHooks.LogoutSuccess, {
          session,
          token,
        });
      } else {
        throw new Error("Session is no longer valid");
      }
      return session;
    } catch (error) {
      this.hooks.emit(ServerHooks.LogoutError, error);

      throw error;
    }
  }

  /**
   * @description Logout a user and invalidate his session.
   * @param {string} accessToken - User access token.
   * @returns {Promise<void>} - Return a promise.
   */
  public async logoutByAccessToken(accessToken: string): Promise<void> {
    try {
      const session: Session = await this.findSessionByAccessToken(accessToken);

      if (session.valid) {
        await this.db.invalidateSession(session.id);
        this.hooks.emit(ServerHooks.LogoutSuccess, {
          session,
          accessToken,
        });
      } else {
        throw new Error("Session is no longer valid");
      }
    } catch (error) {
      this.hooks.emit(ServerHooks.LogoutError, error);

      throw error;
    }
  }

  public async resumeSession(token: string): Promise<User> {
    try {
      const session: Session = await this.db.findSessionByToken(token);

      if (session && session.valid) {
        const user = await this.db.findUserById(session.userId);

        if (!user) {
          throw new Error("User not found");
        }

        if (this.options.resumeSessionValidator) {
          try {
            await this.options.resumeSessionValidator(user, session);
          } catch (e) {
            throw new Error(e);
          }
        }

        this.hooks.emit(ServerHooks.ResumeSessionSuccess, { user, token });

        return this.sanitizeUser(user);
      }

      this.hooks.emit(
        ServerHooks.ResumeSessionError,
        new Error("Invalid Session")
      );

      throw new Error("Invalid Session");
    } catch (e) {
      this.hooks.emit(ServerHooks.ResumeSessionError, e);

      throw e;
    }
  }

  public async resumeSessionByAccessToken(accessToken: string): Promise<User> {
    try {
      const session: Session = await this.findSessionByAccessToken(accessToken);

      if (session.valid) {
        const user = await this.db.findUserById(session.userId);

        if (!user) {
          throw new Error("User not found");
        }

        if (this.options.resumeSessionValidator) {
          try {
            await this.options.resumeSessionValidator(user, session);
          } catch (e) {
            throw new Error(e);
          }
        }

        this.hooks.emit(ServerHooks.ResumeSessionSuccess, {
          user,
          accessToken,
        });

        return this.sanitizeUser(user);
      }

      this.hooks.emit(
        ServerHooks.ResumeSessionError,
        new Error("Invalid Session")
      );

      throw new Error("Invalid Session");
    } catch (e) {
      this.hooks.emit(ServerHooks.ResumeSessionError, e);

      throw e;
    }
  }

  /**
   * @description Find a session by his token.
   * @param {string} accessToken
   * @returns {Promise<Session>} - Return a session.
   */
  public async findSessionByAccessToken(accessToken: string): Promise<Session> {
    if (!isString(accessToken)) {
      throw new Error("An accessToken is required");
    }

    let sessionToken: string;
    try {
      const decodedAccessToken = jwt.verify(
        accessToken,
        this.options.tokenSecret
      ) as {
        data: JwtData;
      };
      sessionToken = decodedAccessToken.data.token;
    } catch (err) {
      throw new Error("Tokens are not valid");
    }

    const session: Session | null = await this.db.findSessionByToken(
      sessionToken
    );
    if (!session) {
      throw new Error("Session not found");
    }

    return session;
  }

  /**
   * @description Find a user by his id.
   * @param {string} userId - User id.
   * @returns {Promise<Object>} - Return a user or null if not found.
   */
  public findUserById(userId: string): Promise<User | null> {
    return this.db.findUserById(userId);
  }

  /**
   * @description Deactivate a user, the user will not be able to login until his account is reactivated.
   * @param {string} userId - User id.
   * @returns {Promise<void>} - Return a Promise.
   */
  public async deactivateUser(userId: string): Promise<void> {
    return this.db.setUserDeactivated(userId, true);
  }

  /**
   * @description Activate a user.
   * @param {string} userId - User id.
   * @returns {Promise<void>} - Return a Promise.
   */
  public async activateUser(userId: string): Promise<void> {
    return this.db.setUserDeactivated(userId, false);
  }

  public prepareMail(
    to: string,
    token: string,
    user: User,
    pathFragment: string,
    emailTemplate: EmailTemplateType,
    from: string
  ): any {
    if (this.options.prepareMail) {
      return this.options.prepareMail(
        to,
        token,
        user,
        pathFragment,
        emailTemplate,
        from
      );
    }
    return this.defaultPrepareEmail(
      to,
      token,
      user,
      pathFragment,
      emailTemplate,
      from
    );
  }

  public sanitizeUser(user: User): User {
    const { userObjectSanitizer } = this.options;

    return userObjectSanitizer(
      this.internalUserSanitizer(user),
      omit as any,
      pick as any
    );
  }

  private internalUserSanitizer(user: User): User {
    return omit(user, ["services"]) as any;
  }

  private defaultPrepareEmail(
    to: string,
    token: string,
    user: User,
    pathFragment: string,
    emailTemplate: EmailTemplateType,
    from: string
  ): object {
    const tokenizedUrl = this.defaultCreateTokenizedUrl(pathFragment, token);
    return {
      from: emailTemplate.from || from,
      to,
      subject: emailTemplate.subject(user, token),
      text: emailTemplate.text(user, tokenizedUrl, token),
      html: emailTemplate.html && emailTemplate.html(user, tokenizedUrl, token),
    };
  }

  private defaultCreateTokenizedUrl(
    pathFragment: string,
    token: string
  ): string {
    const siteUrl = this.options.siteUrl;
    return `${siteUrl}/${pathFragment}/${token}`;
  }
}

export default AccountsServer;
