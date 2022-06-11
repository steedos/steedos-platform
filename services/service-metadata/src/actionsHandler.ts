/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-10 18:35:07
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-10 23:50:45
 * @Description: 
 */

import { Register } from '@steedos/metadata-registrar';

export const ActionHandlers = {
    clearPackageServices: Register.clearPackageServices,
    clearPackageServicesMetadatas: Register.clearPackageServicesMetadatas,
    async get(ctx: any): Promise<any> {
        try {
            return await Register.get(ctx.broker, ctx.params.key);
        } catch (error) {

        }
    },
    async mget(ctx: any): Promise<any> {
        try {
            return await Register.mget(ctx.broker, ctx.params.keys);
        } catch (error) {

        }
    },
    async filter(ctx: any): Promise<Array<any>> {
        return await Register.filter(ctx.broker, ctx.params.key);
    },
    async mfilter(ctx: any): Promise<Array<any>> {
        return await Register.mfilter(ctx.broker, ctx.params.keys);
    },
    async add(ctx: any) {
        return await Register.add(ctx.broker, ctx.params, ctx.meta);
    },
    async madd(ctx) {
        return await Register.madd(ctx.broker, ctx.params, ctx.meta);
    },
    async addServiceMetadata(ctx: any) {
        return await Register.addServiceMetadata(ctx.broker, ctx.params, ctx.meta);
    },
    async maddServiceMetadata(ctx: any) {
        return await Register.maddServiceMetadata(ctx.broker, ctx.params, ctx.meta);
    },
    async fuzzyDelete(ctx: any) {
        const { key } = ctx.params;
        return await Register.fuzzyDelete(ctx.broker, key);
    },
    async delete(ctx: any) {
        return await Register.delete(ctx.broker, ctx.params.key);
    },
    async deleteServiceMetadata(ctx: any) {
        return await Register.deleteServiceMetadata(ctx.broker, ctx.params);
    },

    async getServiceMetadatas(ctx: any) {
        return await Register.getServiceMetadatas(ctx.broker, ctx.params);
    },
    async getServiceMetadata(ctx: any) {
        return await Register.getServiceMetadata(ctx.broker, ctx.params, ctx.meta);
    },
    async removeServiceMetadata(ctx: any) {
        return await Register.removeServiceMetadata(ctx.broker, ctx.params, ctx.meta);
    },
    async refreshServiceMetadatas(ctx: any) {
        return await Register.refreshServiceMetadatas(ctx.broker, ctx.params);
    },

    async lpush(ctx: any) {
        return await Register.lpush(ctx.broker, ctx.params);
    },

    async rpush(ctx: any) {
        return await Register.rpush(ctx.broker, ctx.params);
    },

    async lrange(ctx: any) {
       return await Register.lrange(ctx.broker, ctx.params);
    },

    async filterList(ctx: any) {
        return await Register.filterList(ctx.broker, ctx.params);
    }
};
