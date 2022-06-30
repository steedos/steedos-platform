"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOidcConfig = exports.isMultiTenant = exports.getScopedConfig = exports.getTenantConfig = exports.getTenantId = void 0;
const tslib_1 = require("tslib");
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-26 16:31:46
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-28 11:58:21
 * @Description:
 */
const objectql_1 = require("@steedos/objectql");
const accounts_1 = require("@steedos/accounts");
const environment_1 = require("./environment");
const validator = require('validator');
const getTenantId = () => {
    return (0, objectql_1.getSteedosConfig)().tenant._id;
};
exports.getTenantId = getTenantId;
const getTenantConfig = (tenantId) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    return yield (0, accounts_1.getMergedTenant)(tenantId);
});
exports.getTenantConfig = getTenantConfig;
const getScopedConfig = () => {
    return {
        platformUrl: process.env.ROOT_URL,
    };
};
exports.getScopedConfig = getScopedConfig;
const isMultiTenant = () => {
    return environment_1.default.MULTI_TENANCY;
};
exports.isMultiTenant = isMultiTenant;
const getOidcConfig = () => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const config = (0, objectql_1.getSteedosConfig)();
    return {
        configUrl: ((_b = (_a = config.sso) === null || _a === void 0 ? void 0 : _a.oidc) === null || _b === void 0 ? void 0 : _b.config_url) || process.env.SSO_OIDC_CONFIG_URL,
        clientID: ((_d = (_c = config.sso) === null || _c === void 0 ? void 0 : _c.oidc) === null || _d === void 0 ? void 0 : _d.client_id) || process.env.SSO_OIDC_CLIENT_ID,
        clientSecret: ((_f = (_e = config.sso) === null || _e === void 0 ? void 0 : _e.oidc) === null || _f === void 0 ? void 0 : _f.client_secret) || process.env.SSO_OIDC_CLIENT_SECRET,
        requireLocalAccount: ((_h = (_g = config.sso) === null || _g === void 0 ? void 0 : _g.oidc) === null || _h === void 0 ? void 0 : _h.require_local_account) || validator.toBoolean(process.env.SSO_OIDC_REQUIRE_LOCAL_ACCOUNT || 'false', true) || false,
    };
};
exports.getOidcConfig = getOidcConfig;
