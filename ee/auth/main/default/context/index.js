"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMultiTenant = exports.getScopedConfig = exports.getTenantConfig = exports.getTenantId = void 0;
const tslib_1 = require("tslib");
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-26 16:31:46
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-27 15:11:18
 * @Description:
 */
const objectql_1 = require("@steedos/objectql");
const accounts_1 = require("@steedos/accounts");
const environment_1 = require("./environment");
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
