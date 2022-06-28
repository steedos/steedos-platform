"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oidcPreAuth = exports.oidcAuth = exports.oidcStrategyFactory = exports.oidcCallbackUrl = void 0;
const tslib_1 = require("tslib");
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-24 18:15:05
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-28 10:48:46
 * @Description:
 */
const core = require("./core");
const { oidc } = require("./middleware");
const context_1 = require("../context");
const users_1 = require("../collections/users");
const account_1 = require("./account");
const { passport } = core.auth;
const ssoCallbackUrl = (config, type) => {
    // incase there is a callback URL from before
    if (config && config.callbackURL) {
        return config.callbackURL;
    }
    const publicConfig = (0, context_1.getScopedConfig)();
    let callbackUrl = `/api/global/auth`;
    if ((0, context_1.isMultiTenant)()) {
        callbackUrl += `/${(0, context_1.getTenantId)()}`;
    }
    callbackUrl += `/${type}/callback`;
    return `${publicConfig.platformUrl}${callbackUrl}`;
};
const oidcCallbackUrl = (config) => {
    return ssoCallbackUrl(config, "oidc");
};
exports.oidcCallbackUrl = oidcCallbackUrl;
function oidcStrategyFactory() {
    const chosenConfig = (0, context_1.getOidcConfig)();
    let callbackUrl = (0, exports.oidcCallbackUrl)(chosenConfig);
    return oidc.strategyFactory(chosenConfig, callbackUrl, users_1.User.save);
}
exports.oidcStrategyFactory = oidcStrategyFactory;
const oidcAuth = (req, res, next) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    return passport.authenticate('oidc', (err, user) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        return yield account_1.Account.ssoLogin(req, res, { err, user });
    }))(req, res, next);
});
exports.oidcAuth = oidcAuth;
const oidcPreAuth = (req, res, next) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    return passport.authenticate('oidc', {
        scope: ["profile", "email"],
    })(req, res, next);
});
exports.oidcPreAuth = oidcPreAuth;
