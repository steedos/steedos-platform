/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-26 16:31:46
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-27 15:11:18
 * @Description: 
 */
import { getSteedosConfig } from '@steedos/objectql';
import { getMergedTenant } from '@steedos/accounts';
import env from './environment';

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