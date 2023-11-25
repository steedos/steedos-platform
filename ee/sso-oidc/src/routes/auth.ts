/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-24 18:15:05
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-11-24 15:51:01
 * @Description: 
 */
const core = require("./core")
const { oidc } = require("./middleware")

import { getOidcConfig, getScopedConfig, getTenantId, isMultiTenant } from "../context";

import { User } from "../collections/users";
import { Account } from "./account";
import { getEmail } from "./middleware/passport/oidc";

const { passport } = core.auth;

let oidcStrategy: any = null;

const ssoCallbackUrl = (config: any, type: any) => {
  // incase there is a callback URL from before
  if (config && config.callbackURL) {
    return config.callbackURL
  }

  const publicConfig = getScopedConfig()

  let callbackUrl = `/api/global/auth`
  if (isMultiTenant()) {
    callbackUrl += `/${getTenantId()}`
  }
  callbackUrl += `/${type}/callback`

  return `${publicConfig.platformUrl}${callbackUrl}`
}

export const oidcCallbackUrl = (config: any) => {
  return ssoCallbackUrl(config, "oidc")
}

export async function oidcStrategyFactory() {
  const chosenConfig = getOidcConfig()
  let callbackUrl = oidcCallbackUrl(chosenConfig)
  oidcStrategy = await oidc.strategyFactory(chosenConfig, callbackUrl, User.save);
  return oidcStrategy.strategy;
}


export const oidcAuth = async (req: any, res: any, next: any) => {
  return passport.authenticate('oidc', async (err, user) => {
    return await Account.ssoLogin(req, res, { err, user, redirect: true, accessToken: user?.thirdPartyUser?.oauth2?.accessToken })
  }
  )(req, res, next)
}

export const oidcPreAuth = async (req: any, res: any, next: any) => {
  return passport.authenticate('oidc', {
    scope: ["profile", "email"],
  })(req, res, next)
}

export const oidcLogin = async (req: any, res: any, next: any) => {
  const { accessToken } = req.body;
  const oauth2 = oidcStrategy.strategy._getOAuth2Client(oidcStrategy.config);
  const userInfoURL = oidcStrategy.config.userInfoURL;
  oauth2._request(
    "GET",
    userInfoURL,
    {
      Authorization: "Bearer " + accessToken,
      Accept: "application/json"
    },
    null,
    null,
    function (err, body, _res) {
      if (err) {
        console.error(err)
        return res.status(err.statusCode || 500).send(err.data || `failed to obtain access token`);
      }

      var profile: any = {};

      try {
        var json = JSON.parse(body);

        profile.id = json.sub;
        // Prior to OpenID Connect Basic Client Profile 1.0 - draft 22, the
        // "sub" key was named "user_id".  Many providers still use the old
        // key, so fallback to that.
        if (!profile.id) {
          profile.id = json.user_id;
        }

        profile.displayName = json.name;
        profile.name = {
          familyName: json.family_name,
          givenName: json.given_name,
          middleName: json.middle_name
        };

        profile._raw = body;
        profile._json = json;


        const thirdPartyUser = {
          // store the issuer info to enable sync in future
          idToken: null,
          params: null,
          sub: json.sub,
          provider: oidcStrategy.config.issuer,
          providerType: "oidc",
          userId: profile.id,
          profile: profile,
          email: getEmail(profile, {}),
          oauth2: {
            accessToken: accessToken,
            refreshToken: null,
          },
        }

        User.findByEmail(thirdPartyUser.email).then((user) => {
          if (user) {
            Account.ssoLogin(req, res, { err: null, user: Object.assign({}, user, {id: user._id, thirdPartyUser: thirdPartyUser}), redirect: false, accessToken: accessToken }).then((loginResult) => {
              delete loginResult.user.services;
              delete loginResult.user.thirdPartyUser;
              return res.status(200).send(loginResult)
            }).catch((err) => {
              console.log(`err`, err)
              return res.status(500).send(err.message);
            })
          } else {
            return res.status(500).send(`user not found`);
          }
        })
      } catch (ex) {
        console.log(ex)
        return res.status(500).send(ex);
      }
    }
  );
}


const logoutUrl = function (redirectUrl, idTokenHint?) {
  const { endSessionEndpoint } = oidcStrategy.config;
  const url = new URL(endSessionEndpoint)

  if (redirectUrl) {
    url.searchParams.set('post_logout_redirect_uri', redirectUrl)
  }

  if (idTokenHint) {
    url.searchParams.set('id_token_hint', idTokenHint)
  }

  return url.toString()
}

export const oidcLogout = async (req: any, res: any, next: any) =>{
  return res.redirect(302, logoutUrl(process.env.ROOT_URL));
}