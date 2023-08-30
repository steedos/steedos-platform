/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-27 15:17:27
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-18 13:30:25
 * @Description: 
 */
import { getAccountsServer, setAuthCookies } from '@steedos/accounts';

import * as requestIp from 'request-ip';

import { getSteedosSchema } from '@steedos/objectql';

const getUserAgent = (req: any) => {
    let userAgent: string = (req.headers['user-agent'] as string) || '';
    if (req.headers['x-ucbrowser-ua']) {
      // special case of UC Browser
      userAgent = req.headers['x-ucbrowser-ua'] as string;
    }
    return userAgent;
  };

export class Account {
    static async ssoLogin(req, res, options = { user: null, err: null, redirect: true, accessToken: null }) {
        let { user , err } = options;
        //TODO
        if (err || !user) { 
            getSteedosSchema().broker.logger.error(`oidc sso login error: ${err}`);
            return res.redirect("/api/global/auth/oidc/error-callback");
        }
        let userAgent = getUserAgent(req) || '';
        const ip = requestIp.getClientIp(req);
        let logout_other_clients = false;
        let login_expiration_in_days = null;
        let phone_logout_other_clients = false;
        let phone_login_expiration_in_days = null;
        let space = null;
        // 获取用户简档
        const accountsServer = await getAccountsServer();
        const userProfile = await accountsServer.getUserProfile(
            user.id
        );
        if (userProfile) {
            logout_other_clients = userProfile.logout_other_clients || false;
            login_expiration_in_days = userProfile.login_expiration_in_days;
            phone_logout_other_clients =
                userProfile.phone_logout_other_clients || false;
            phone_login_expiration_in_days =
                userProfile.phone_login_expiration_in_days;
            space = userProfile.space;
        }

        // 更新user_providers
        const loginResult = await accountsServer.loginWithUser(
            user,
            Object.assign({}, {
                ip,
                userAgent
            }, {
                logout_other_clients,
                login_expiration_in_days,
                phone_logout_other_clients,
                phone_login_expiration_in_days,
                space,
                provider: 'jwt',
                // jwtToken: options.accessToken  // 如果使用jwt token 会导致cookie太大
            })
        );
        setAuthCookies(req, res, loginResult.user._id, loginResult.token, loginResult.tokens.accessToken);
        if(options.redirect){
            res.redirect(`/accounts/a/?uid=${loginResult.user._id}`);
        }else{
            return Object.assign({}, loginResult, { space: space});
        }
    }
}