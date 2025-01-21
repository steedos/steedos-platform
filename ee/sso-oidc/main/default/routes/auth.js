"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oidcLogout = exports.oidcLogin = exports.oidcPreAuth = exports.oidcAuth = exports.oidcCallbackUrl = void 0;
exports.oidcStrategyFactory = oidcStrategyFactory;
const tslib_1 = require("tslib");
const core = require("./core");
const { oidc } = require("./middleware");
const context_1 = require("../context");
const users_1 = require("../collections/users");
const account_1 = require("./account");
const oidc_1 = require("./middleware/passport/oidc");
const { passport } = core.auth;
let oidcStrategy = null;
const ssoCallbackUrl = (config, type) => {
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const chosenConfig = (0, context_1.getOidcConfig)();
        let callbackUrl = (0, exports.oidcCallbackUrl)(chosenConfig);
        oidcStrategy = yield oidc.strategyFactory(chosenConfig, callbackUrl, users_1.User.save);
        return oidcStrategy.strategy;
    });
}
const oidcAuth = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return passport.authenticate('oidc', (err, user) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        return yield account_1.Account.ssoLogin(req, res, { err, user, redirect: true, accessToken: (_b = (_a = user === null || user === void 0 ? void 0 : user.thirdPartyUser) === null || _a === void 0 ? void 0 : _a.oauth2) === null || _b === void 0 ? void 0 : _b.accessToken });
    }))(req, res, next);
});
exports.oidcAuth = oidcAuth;
const oidcPreAuth = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return passport.authenticate('oidc', {
        scope: ["profile", "email"],
    })(req, res, next);
});
exports.oidcPreAuth = oidcPreAuth;
const oidcLogin = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { accessToken } = req.body;
    const oauth2 = oidcStrategy.strategy._getOAuth2Client(oidcStrategy.config);
    const userInfoURL = oidcStrategy.config.userInfoURL;
    oauth2._request("GET", userInfoURL, {
        Authorization: "Bearer " + accessToken,
        Accept: "application/json"
    }, null, null, function (err, body, _res) {
        if (err) {
            console.error(err);
            return res.status(err.statusCode || 500).send(err.data || `failed to obtain access token`);
        }
        var profile = {};
        try {
            var json = JSON.parse(body);
            profile.id = json.sub;
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
                idToken: null,
                params: null,
                sub: json.sub,
                provider: oidcStrategy.config.issuer,
                providerType: "oidc",
                userId: profile.id,
                profile: profile,
                email: (0, oidc_1.getEmail)(profile, {}),
                oauth2: {
                    accessToken: accessToken,
                    refreshToken: null,
                },
            };
            users_1.User.findByEmail(thirdPartyUser.email).then((user) => {
                if (user) {
                    account_1.Account.ssoLogin(req, res, { err: null, user: Object.assign({}, user, { id: user._id, thirdPartyUser: thirdPartyUser }), redirect: false, accessToken: accessToken }).then((loginResult) => {
                        delete loginResult.user.services;
                        delete loginResult.user.thirdPartyUser;
                        return res.status(200).send(loginResult);
                    }).catch((err) => {
                        console.log(`err`, err);
                        return res.status(500).send(err.message);
                    });
                }
                else {
                    return res.status(500).send(`user not found`);
                }
            });
        }
        catch (ex) {
            console.log(ex);
            return res.status(500).send(ex);
        }
    });
});
exports.oidcLogin = oidcLogin;
const logoutUrl = function (redirectUrl, idTokenHint) {
    const { endSessionEndpoint } = oidcStrategy.config;
    const url = new URL(endSessionEndpoint);
    if (redirectUrl) {
        url.searchParams.set('post_logout_redirect_uri', redirectUrl);
    }
    if (idTokenHint) {
        url.searchParams.set('id_token_hint', idTokenHint);
    }
    return url.toString();
};
const oidcLogout = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return res.redirect(302, logoutUrl(process.env.ROOT_URL));
});
exports.oidcLogout = oidcLogout;
