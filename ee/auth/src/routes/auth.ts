const core = require("./core")
const { oidc } = require("./middleware")


import { getScopedConfig, getTenantId, isMultiTenant } from "../context";

import { User } from "../collections/users";
import { Account } from "./account";

const { passport } = core.auth;

const ssoCallbackUrl = (config: any, type: any) => {
  // incase there is a callback URL from before
  if (config && config.callbackURL) {
    return config.callbackURL
  }

  const publicConfig =  getScopedConfig()

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

export function oidcStrategyFactory() {

  const chosenConfig = {
    clientID: process.env.SSO_KEYCLOAK_CLIENT_ID, 
    clientSecret: process.env.SSO_KEYCLOAK_CLIENT_SECRET, 
    configUrl: process.env.SSO_KEYCLOAK_CONFIG_URL, 
  }
  let callbackUrl = oidcCallbackUrl(chosenConfig)

  return oidc.strategyFactory(chosenConfig, callbackUrl, User.save)
}


export const oidcAuth = async (req: any, res: any, next: any) => {
  return passport.authenticate('oidc', async (err, user) => {
    return await Account.ssoLogin(req, res, {err, user})
  }
    )(req, res, next)
}

export const oidcPreAuth = async (req: any, res: any, next: any) => {
  return passport.authenticate('oidc', {
    scope: ["profile", "email"],
  })(req, res, next)
}
