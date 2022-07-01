/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-26 16:31:46
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-28 11:58:21
 * @Description: 
 */
import { getSteedosConfig } from '@steedos/objectql';
import { getMergedTenant } from '@steedos/accounts';
import env from './environment';

const validator = require('validator');

export const getTenantId = () => {
    return getSteedosConfig().tenant._id;
}

export const getTenantConfig = async (tenantId) => {
    return await getMergedTenant(tenantId);
}

export const getScopedConfig = () => { 
    return {
        platformUrl: process.env.ROOT_URL,
    }
}

export const isMultiTenant = () => {
    return env.MULTI_TENANCY
}

export const getOidcConfig = () => {
    const config = getSteedosConfig();
    return {
        configUrl: config.sso?.oidc?.config_url || process.env.SSO_OIDC_CONFIG_URL,
        clientID: config.sso?.oidc?.client_id || process.env.SSO_OIDC_CLIENT_ID,
        clientSecret: config.sso?.oidc?.client_secret || process.env.SSO_OIDC_CLIENT_SECRET,
        requireLocalAccount: config.sso?.oidc?.require_local_account || validator.toBoolean(process.env.SSO_OIDC_REQUIRE_LOCAL_ACCOUNT || 'false', true) || false,
    }
}