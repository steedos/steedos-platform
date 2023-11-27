// tslint:disable variable-name _id
import {
  ConnectionInformations,
  CreateUser,
  DatabaseInterface,
  Session,
  User,
} from '../types';
import { get, merge, trim, map, find } from 'lodash';
import { Collection, Db, ObjectId } from 'mongodb';

import { AccountsMongoOptions, MongoUser } from './types';
import { getSessionByUserId, hashStampedToken } from '@steedos/auth';
import { isNumber } from "lodash";

import { getDataSource } from '@steedos/objectql';

const moment = require("moment");

const toMongoID = (objectId: string | ObjectId) => {
  if (typeof objectId === "string") {
    return new ObjectId(objectId);
  }
  return objectId;
};

const defaultOptions = {
  collectionName: "users",
  sessionCollectionName: "sessions",
  codeCollectionName: "users_verify_code",
  inviteCollectionName: "space_users_invite",
  spaceUserCollectionName: "space_users",
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
  convertUserIdToMongoObjectId: false,
  convertSessionIdToMongoObjectId: false,
  caseSensitiveUserName: true,
  dateProvider: (date?: Date) => (date ? date.getTime() : Date.now()),
};

export class Mongo implements DatabaseInterface {
  // Options of Mongo class
  private options: AccountsMongoOptions & typeof defaultOptions;
  // Db object
  private db: Db;
  // Account collection
  private collection: Collection;
  // Session collection
  private sessionCollection: Collection;
  // Code collection
  private codeCollection: Collection;

  private inviteCollection: Collection;

  private spaceUserCollection: Collection;

  constructor(db: any, options?: AccountsMongoOptions) {
    this.options = merge({ ...defaultOptions }, options);
    if (!db) {
      throw new Error("A database connection is required");
    }
    this.db = db;
    this.collection = this.db.collection(this.options.collectionName);
    this.sessionCollection = this.db.collection(
      this.options.sessionCollectionName
    );
    this.codeCollection = this.db.collection(this.options.codeCollectionName);
    this.inviteCollection = this.db.collection(
      this.options.inviteCollectionName
    );
    this.spaceUserCollection = this.db.collection(
      this.options.spaceUserCollectionName
    );
  }
  public async findValidSessionsByUserId(
    userId: string,
    is_phone: boolean
  ): Promise<Array<Session>> {
    let query: any = {
      userId,
      valid: true,
    };
    if (is_phone) {
      query.is_phone = true;
    } else {
      query.is_phone = { $ne: true };
    }
    const sessions: any = await this.sessionCollection
      .find(query)
      .project({ _id: 1 })
      .toArray();
    if (sessions) {
      sessions.forEach(function(session) {
        session.id = session._id.toString();
      });
    }
    return sessions;
  }

  public async setupIndexes(): Promise<void> {
    await this.sessionCollection.createIndex("token", {
      unique: true,
      sparse: true,
    });
    await this.collection.createIndex("username", {
      unique: true,
      sparse: true,
    });
    await this.collection.createIndex("emails.address", {
      unique: true,
      sparse: true,
    });
  }

  public async createUser({
    password,
    username,
    email,
    email_verified,
    mobile,
    mobile_verified,
    ...cleanUser
  }: CreateUser): Promise<string> {
    const user: MongoUser = {
      ...cleanUser,
      services: {},
      [this.options.timestamps.createdAt]: this.options.dateProvider(),
      [this.options.timestamps.updatedAt]: this.options.dateProvider(),
    };
    if (password) {
      user.services.password = { bcrypt: password };
    }
    if (username) {
      user.username = username;
    }
    if (email) {
      user.email = email.toLowerCase();
      user.email_verified = email_verified;
      user.emails = [
        { address: email.toLowerCase(), verified: email_verified },
      ];
    }

    if (mobile) {
      user.mobile = mobile;
      const encryptedMobile = await this.getEncryptedSpaceUserFieldValue(mobile, 'mobile');
      if (encryptedMobile) {
        user.mobile = encryptedMobile;
      }
      user.mobile_verified = mobile_verified;
    }

    if (user.name) {
      const encryptedName = await this.getEncryptedSpaceUserFieldValue(user.name, 'name');
      if (encryptedName) {
        user.name = encryptedName;
      }
    }

    if (this.options.idProvider) {
      user._id = this.options.idProvider();
    }

    user.steedos_id = user._id;
    const ret = await this.collection.insertOne(user as any);
    return user._id as string;
  }

  public async findUserById(userId: string): Promise<User | null> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    const user:any = await this.collection.findOne({ _id: id });
    if (user) {
      user.id = user._id.toString();
    }
    return user;
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    const user:any = await this.collection.findOne({
      email: email.toLowerCase(),
    });
    if (user) {
      user.id = user._id.toString();
    }
    return user;
  }

  public async findUserByMobile(mobile: string): Promise<User | null> {
    const selector = {
      mobile,
    }
    const encryptedMobile = await this.getEncryptedSpaceUserFieldValue(mobile, 'mobile');
    if (encryptedMobile) {
      selector.mobile = encryptedMobile;
    }
    const user:any = await this.collection.findOne(selector);
    if (user) {
      user.id = user._id.toString();
    }
    return user;
  }

  public async findUserByUsername(username: string): Promise<User | null> {
    const filter = this.options.caseSensitiveUserName
      ? { username }
      : {
          $where: `obj.username && (obj.username.toLowerCase() === "${username.toLowerCase()}")`,
        };
    const user:any = await this.collection.findOne(filter);
    if (user) {
      user.id = user._id.toString();
    }
    return user;
  }

  public async findPasswordHash(userId: string): Promise<string | null> {
    const user = await this.findUserById(userId);
    if (user) {
      return get(user, "services.password.bcrypt");
    }
    return null;
  }

  public async findUserByEmailVerificationToken(
    token: string
  ): Promise<User | null> {
    const user:any = await this.collection.findOne({
      "services.email.verificationTokens.token": token,
    });
    if (user) {
      user.id = user._id.toString();
    }
    return user;
  }

  public async findUserByResetPasswordToken(
    token: string
  ): Promise<User | null> {
    const user:any = await this.collection.findOne({
      "services.password.reset.token": token,
    });
    if (user) {
      user.id = user._id.toString();
    }
    return user;
  }

  public async findUserByServiceId(
    serviceName: string,
    serviceId: string
  ): Promise<User | null> {
    const user:any = await this.collection.findOne({
      [`services.${serviceName}.id`]: serviceId,
    });
    if (user) {
      user.id = user._id.toString();
    }
    return user;
  }

  // public async findUserByMobile(mobile: string): Promise<User | null>{

  //   if(!/^\+\d+/g.test(mobile)){
  //     mobile = "+86" + mobile;
  //   }

  //   const user = await this.collection.findOne({
  //     'phone.number': mobile,
  //   });
  //   if (user) {
  //     user.id = user._id.toString();
  //   }
  //   return user;
  // }

  public async addEmail(
    userId: string,
    newEmail: string,
    verified: boolean
  ): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    const ret = await this.collection.updateOne(
      { _id: id },
      {
        $addToSet: {
          emails: {
            address: newEmail.toLowerCase(),
            verified,
          },
        },
        $set: {
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
      }
    );
    if (ret.matchedCount === 0) {
      throw new Error("User not found");
    }
  }

  public async removeEmail(userId: string, email: string): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    const ret = await this.collection.updateOne(
      { _id: id },
      {
        $pull: { emails: { address: email.toLowerCase() } },
        $set: {
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
      }
    );
    if (ret.matchedCount === 0) {
      throw new Error("User not found");
    }
  }

  public async verifyEmail(userId: string, email: string): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    const ret = await this.collection.updateOne(
      { _id: id, email: email },
      {
        $set: {
          email_verified: true,
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
        $pull: {
          "services.email.verificationTokens": { address: email },
        },
      }
    );
    await this.spaceUserCollection.updateMany(
      { user: id },
      {
        $set: {
          email_verified: true,
          modified: this.options.dateProvider(),
          modified_by: id,
        },
      }
    );
    if (ret.matchedCount === 0) {
      throw new Error("User not found");
    }
  }

  // 如果开启了加密功能，则获取加密后的字段值
  public async getEncryptedSpaceUserFieldValue(value: string, fieldName: string): Promise<any | null> {
    const objectql = require('@steedos/objectql');
    const objFields = await objectql.getObject('space_users').getFields();
    if (objFields[fieldName].enable_encryption) {
      const datasource = getDataSource('default');
      const encryptedValue = await datasource.adapter.encryptValue(value)
      if (encryptedValue) {
        return encryptedValue
      }
    }
  }

  public async verifyMobile(userId: string, mobile: string): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    const encryptedMobile = await this.getEncryptedSpaceUserFieldValue(mobile, 'mobile');
    const ret = await this.collection.updateOne(
      { _id: id, mobile: encryptedMobile || mobile },
      {
        $set: {
          mobile_verified: true,
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
        $pull: {
          "services.mobile.verificationTokens": { mobile: encryptedMobile || mobile },
        },
      }
    );
    await this.spaceUserCollection.updateMany(
      { user: id },
      {
        $set: {
          mobile_verified: true,
          modified: this.options.dateProvider(),
          modified_by: id,
        },
      }
    );
    if (ret.matchedCount === 0) {
      throw new Error("User not found");
    }
  }

  public async setMobile(userId: string, newMobile: string): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    const encryptedMobile = (await this.getEncryptedSpaceUserFieldValue(newMobile, 'mobile')) || newMobile;
    let existed = await this.collection
      .find({ _id: { $ne: id }, mobile: encryptedMobile })
      .count();
    if (existed > 0) {
      throw new Error("该手机号已被其他用户注册");
    }
    let user:any = await this.collection.findOne(
      { _id: id },
      { projection: { mobile: 1 } }
    );
    if (user && user.mobile != newMobile) {
      const ret = await this.collection.updateOne(
        { _id: id },
        {
          $set: {
            mobile: encryptedMobile,
            [this.options.timestamps.updatedAt]: this.options.dateProvider(),
          },
          $pull: {
            "services.mobile.verificationTokens": { mobile: encryptedMobile },
          },
        }
      );
      await this.spaceUserCollection.updateMany(
        { user: id },
        {
          $set: {
            mobile: encryptedMobile,
            modified: this.options.dateProvider(),
            modified_by: id,
          },
        }
      );
    }
    if (!user) {
      throw new Error("User not found");
    }
  }

  public async setEmail(userId: string, newEmail: string): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    let existed = await this.collection
      .find({ _id: { $ne: id }, email: newEmail })
      .count();
    if (existed > 0) {
      throw new Error("该邮箱已被其他用户注册");
    }
    let user = await this.collection.findOne(
      { _id: id },
      { projection: { email: 1 } }
    );
    if (user && user.email != newEmail) {
      const ret = await this.collection.updateOne(
        { _id: id },
        {
          $set: {
            email: newEmail,
            [this.options.timestamps.updatedAt]: this.options.dateProvider(),
          },
          $pull: {
            "services.email.verificationTokens": { address: newEmail },
          },
        }
      );
      await this.spaceUserCollection.updateMany(
        { user: id },
        {
          $set: {
            email: newEmail,
            modified: this.options.dateProvider(),
            modified_by: id,
          },
        }
      );
    }
    if (!user) {
      throw new Error("User not found");
    }
  }

  public async setUsername(userId: string, newUsername: string): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    const ret = await this.collection.updateOne(
      { _id: id },
      {
        $set: {
          username: newUsername,
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
      }
    );
    if (ret.matchedCount === 0) {
      throw new Error("User not found");
    }
  }

  public async setPassword(userId: string, newPassword: string): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    const ret = await this.collection.updateOne(
      { _id: id },
      {
        $set: {
          "services.password.bcrypt": newPassword,
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
        $push: {
          "services.password_history": newPassword,
        },
        $unset: {
          "services.password.reset": "",
        },
      }
    );
    if (ret.matchedCount === 0) {
      throw new Error("User not found");
    }
  }

  public async setService(
    userId: string,
    serviceName: string,
    service: object
  ): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    await this.collection.updateOne(
      { _id: id },
      {
        $set: {
          [`services.${serviceName}`]: service,
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
      }
    );
  }

  public async unsetService(
    userId: string,
    serviceName: string
  ): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    await this.collection.updateOne(
      { _id: id },
      {
        $set: {
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
        $unset: {
          [`services.${serviceName}`]: "",
        },
      }
    );
  }

  public async setUserDeactivated(
    userId: string,
    deactivated: boolean
  ): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    await this.collection.updateOne(
      { _id: id },
      {
        $set: {
          deactivated,
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
      }
    );
  }

  private resolveInfo(connection: ConnectionInformations = {}) {
    let ip = connection.ip;
    let userAgent = connection.userAgent;
    let login_expiration_in_days = connection.login_expiration_in_days;
    let phone_login_expiration_in_days =
      connection.phone_login_expiration_in_days;
    let is_phone = connection.is_phone;
    let is_tablet = connection.is_tablet;
    let space = connection.space;
    let provider = connection.provider;
    if (userAgent) {
      const foo = userAgent.split(" Space/");
      if (foo.length > 1) {
        userAgent = foo[0];
        space = foo[1];
      }
    }

    if (is_phone) {
      login_expiration_in_days = phone_login_expiration_in_days;
    }

    if (space) {
      return {
        ip,
        userAgent,
        space,
        is_phone,
        is_tablet,
        login_expiration_in_days,
        user_provider: provider
      };
    }

    return {
      ip,
      userAgent,
      is_phone,
      is_tablet,
      login_expiration_in_days,
      user_provider: provider
    };
  }

  public async createSession(
    userId: string,
    token: string,
    connection: ConnectionInformations = {},
    extraData?: object
  ): Promise<string> {
    const infos = this.resolveInfo(connection);
    const session: any = {
      userId,
      token,
      ...infos,
      extraData,
      valid: true,
      [this.options.timestamps.createdAt]: this.options.dateProvider(),
      [this.options.timestamps.updatedAt]: this.options.dateProvider(),
    };

    if (this.options.idProvider) {
      session._id = this.options.idProvider();
    }

    const ret = await this.sessionCollection.insertOne(session);
    await this.updateMeteorSession(userId, token, infos);
    return ret.insertedId.toString();
  }

  public async updateSession(
    sessionId: string,
    connection: ConnectionInformations
  ): Promise<void> {
    const _id = this.options.convertSessionIdToMongoObjectId
      ? toMongoID(sessionId)
      : sessionId;
    const infos = this.resolveInfo(connection);
    let _set = {
      userAgent: infos.userAgent,
      ip: infos.ip,
      [this.options.timestamps.updatedAt]: this.options.dateProvider(),
    };
    if (infos.space) {
      _set.space = infos.space;
    }

    await this.sessionCollection.updateOne(
      { _id },
      {
        $set: _set,
      }
    );
  }

  public async invalidateSession(sessionId: string): Promise<void> {
    const _id = this.options.convertSessionIdToMongoObjectId
      ? toMongoID(sessionId)
      : sessionId;
    await this.sessionCollection.updateOne(
      { _id },
      {
        $set: {
          valid: false,
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
      }
    );
    const session: any = await this.sessionCollection.findOne({
      _id: _id,
    });
    await this.destroyMeteorToken(session.userId, session.token);
  }

  public async invalidateAllSessions(userId: string): Promise<void> {
    await this.sessionCollection.updateMany(
      { userId },
      {
        $set: {
          valid: false,
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
      }
    );
  }

  public async findSessionByToken(token: string): Promise<Session | null> {
    const session:any = await this.sessionCollection.findOne({ token });
    if (session) {
      session.id = session._id.toString();
    }
    return session;
  }

  public async findSessionById(sessionId: string): Promise<Session | null> {
    const _id = this.options.convertSessionIdToMongoObjectId
      ? toMongoID(sessionId)
      : sessionId;
    const session:any = await this.sessionCollection.findOne({ _id });
    if (session) {
      session.id = session._id.toString();
    }
    return session;
  }

  public async addEmailVerificationToken(
    userId: string,
    email: string,
    token: string
  ): Promise<void> {
    const _id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    await this.collection.updateOne(
      { _id },
      {
        $push: {
          "services.email.verificationTokens": {
            token,
            address: email.toLowerCase(),
            when: this.options.dateProvider(),
          },
        },
      }
    );
  }

  public async addResetPasswordToken(
    userId: string,
    email: string,
    token: string,
    reason: string
  ): Promise<void> {
    const _id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    await this.collection.updateOne(
      { _id },
      {
        $push: {
          "services.password.reset": {
            token,
            address: email.toLowerCase(),
            when: this.options.dateProvider(),
            reason,
          },
        },
      }
    );
  }

  public async setResetPassword(
    userId: string,
    email: string,
    newPassword: string
  ): Promise<void> {
    await this.setPassword(userId, newPassword);
  }

  private async applyCode(
    name,
    owner,
    nextCode,
    MAX_FAILURE_COUNT,
    EFFECTIVE_TIME
  ) {
    const now: any = new Date();
    const query: any = {
      name: name,
      verifiedAt: null,
      expiredAt: { $gt: now },
    };
    if (owner) {
      query.owner = owner;
    }
    let record:any = await this.codeCollection.findOne(query);
    if (record) {
      // if(record.failureCount >= MAX_FAILURE_COUNT){
      //   throw new Error('accounts.tooManyFailures');
      // }
      // await this.codeCollection.updateOne({_id: record._id}, {$set: {expiredAt: new Date(moment().add(EFFECTIVE_TIME, 'm'))}});
    } else {
      let doc: any = {
        name,
        owner,
        code: nextCode,
        expiredAt: new Date(moment().add(EFFECTIVE_TIME, "m")),
        [this.options.timestamps.createdAt]: this.options.dateProvider(),
      };
      if (this.options.idProvider) {
        doc._id = this.options.idProvider();
      }

      let result = await this.codeCollection.insertOne(doc);
      record = result.ops[0];;
    }
    return record;
  }

  public async addVerificationCode(
    user: any,
    code: string,
    options: any
  ): Promise<void> {
    let foundedUser = null;
    if (user.email) foundedUser = await this.findUserByEmail(user.email);
    else if (user.mobile)
      foundedUser = await this.findUserByMobile(user.mobile);

    const owner = foundedUser ? foundedUser.id : null;
    const ret = await this.applyCode(
      user.email ? user.email : user.mobile,
      owner,
      code,
      options.MAX_FAILURE_COUNT,
      options.EFFECTIVE_TIME
    );
    return ret;
  }

  private async verifyCodeByName(name, code) {
    const now: any = new Date();
    let query = {
      name: name,
      code: code,
      verifiedAt: null,
      expiredAt: { $gt: now },
    };
    let result = await this.codeCollection.findOne(query);
    if (result) {
      await this.codeCollection.updateOne(
        { _id: result._id },
        { $set: { verifiedAt: now } }
      );
      return result;
    } else {
      throw new Error("accounts.invalidCode");
    }
  }

  private async verifyCodeByOwner(owner, code) {
    const now: any = new Date();
    let query = {
      owner: owner,
      code: code,
      verifiedAt: null,
      expiredAt: { $gt: now },
    };

    let result = await this.codeCollection.findOne(query);
    if (result) {
      await this.codeCollection.updateOne(
        { _id: result._id },
        { $set: { verifiedAt: now } }
      );
      return result;
    } else {
      console.log("verifyCodeByOwner throw new Error accounts.invalidCode");
      throw new Error("accounts.invalidCode");
    }
  }

  public async checkVerificationCode(
    user: any,
    code: string
  ): Promise<boolean> {
    let name = null;
    if (user.email) name = user.email;
    else if (user.mobile) name = user.mobile;

    if (!name) return false;

    const record = await this.verifyCodeByName(name, code);
    if (!record) return false;

    return true;
  }

  public async findUserByVerificationCode(
    user: any,
    code: string
  ): Promise<User | null> {
    let foundedUser = null;
    if (user.email) foundedUser = await this.findUserByEmail(user.email);
    else if (user.mobile)
      foundedUser = await this.findUserByMobile(user.mobile);

    if (!foundedUser) return null;

    const owner = foundedUser.id;
    const record = await this.verifyCodeByOwner(owner, code);
    if (!record) return null;

    if (user.email && foundedUser.email_verified != true) {
      await this.verifyEmail(owner, user.email);
      foundedUser = await this.findUserById(owner);
    } else if (user.mobile && foundedUser.mobile_verified != true) {
      await this.verifyMobile(owner, user.mobile);
      foundedUser = await this.findUserById(owner);
    }

    return foundedUser;
  }

  public async getMySpaces(userId: string): Promise<any | null> {
    const userSpaces: any = await this.db
      .collection("space_users")
      .find({ user: userId, invite_state: {$ne: "refused"} })
      .project({ space: 1, user_accepted: 1, invite_state: 1 })
      .toArray();
    const spaceIds = map(userSpaces, "space");
    const spaces = await this.db
      .collection("spaces")
      .find({ _id: { $in: spaceIds } })
      .project({ name: 1 })
      .toArray();

    return map(spaces, function(space) {
      const spaceUser = find(userSpaces, (item)=>{
        return item.space == space._id;
      });
      return {
        ...space,
        user_accepted: spaceUser.user_accepted,
        invite_state: spaceUser.invite_state
      }
    });
  }


  public async getFirstSpace(): Promise<any | null> {
    const space = await this.db
      .collection("spaces")
      .findOne()
    return space;
  }

  public async updateMeteorSession(
    userId: string,
    token: string,
    infos: ConnectionInformations
  ): Promise<boolean | null> {
    let when = new Date();
    const { login_expiration_in_days, is_phone, is_tablet } = infos;
    if (
      login_expiration_in_days &&
      isNumber(login_expiration_in_days) &&
      login_expiration_in_days > 0
    ) {
      when = moment()
        .subtract((90 - login_expiration_in_days) * 24 * 60, "minute")
        .toDate();
    }

    //创建Meteor token
    let stampedAuthToken = {
      token: token,
      when: when,
    };
    let hashedToken: any = hashStampedToken(stampedAuthToken);
    hashedToken.created = new Date();
    hashedToken.is_phone = is_phone;
    hashedToken.is_tablet = is_tablet;
    await this.collection.updateOne({ _id: userId }, { $push: {
      "services.resume.loginTokens": hashedToken
    } });
    return true;
  }

  public async destroyMeteorToken(
    userId: string,
    token: string
  ): Promise<boolean | null> {
    let stampedAuthToken = {
      token: token,
      when: new Date(),
    };
    let hashedTokenDoc = hashStampedToken(stampedAuthToken);
    let loginToken = hashedTokenDoc.hashedToken;
    await this.collection.updateOne(
      { _id: userId },
      {
        $pull: {
          "services.resume.loginTokens": {
            $or: [{ hashedToken: loginToken }, { token: loginToken }],
          },
        },
      }
    );
    return true;
  }

  public async getInviteInfo(id: string): Promise<any> {
    return await this.inviteCollection.findOne({ _id: id });
  }

  public async updateUser(userId, options) {
    return this.collection.updateOne({ _id: userId }, options);
  }
}
