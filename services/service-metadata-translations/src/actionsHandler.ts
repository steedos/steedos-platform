/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-17 11:36:55
 * @Description: 
 */
import { Register } from '@steedos/metadata-registrar';

const crypto = require('crypto');

function getMD5(data){
    let md5 = crypto.createHash('md5');
    return md5.update(data).digest('hex');
}

function getObjectCacherKey(objectApiName: string): string {
    return `$steedos.#translations-object.${objectApiName}`
}

function getObjectTemplateCacherKey(objectApiName: string): string {
    return `$steedos.#translations-object-template.${objectApiName}`
}

function getCacherKey(key: string, data?): string{
    let suffix = "*";
    if(data){
        suffix = getMD5(JSON.stringify(data));    
    }
    return `$steedos.#translations.${key}.${suffix}`
}

export const ActionHandlers = {
    async getTranslations(ctx: any): Promise<any> {
        return await Register.filter(ctx.broker, getCacherKey("*"))
        // return await ctx.broker.call('metadata.filter', {key: getCacherKey("*")}, {meta: ctx.meta})
    },
    async addTranslation(ctx: any): Promise<boolean>{
        const { key, data } = ctx.params;
        return await Register.add(ctx.broker, {key: getCacherKey(key, data), data: data}, ctx.meta)
        // return await ctx.broker.call('metadata.add', {key: getCacherKey(key, data), data: data}, {meta: ctx.meta})
    },
    async getObjectTranslations(ctx: any): Promise<any> {
        return await Register.filterList(ctx.broker, { key: getObjectCacherKey("*") })
        // return await ctx.broker.call('metadata.filterList', { key: getObjectCacherKey("*") }, { meta: ctx.meta })
    },
    async getObjectTranslationTemplates(ctx: any): Promise<any> {
        return await Register.filterList(ctx.broker, { key: getObjectTemplateCacherKey("*") })
        // return await ctx.broker.call('metadata.filterList', { key: getObjectCacherKey("*") }, { meta: ctx.meta })
    },
    async addObjectTranslationTemplates(ctx: any): Promise<any>{
        const { data } = ctx.params;
        for (const item of data) {
            await Register.rpush(ctx.broker, { key: getObjectTemplateCacherKey(item.objectApiName), data: [item] })
        }
    },
    async addObjectTranslation(ctx: any): Promise<boolean>{
        const { objectApiName, data } = ctx.params;
        return await Register.rpush(ctx.broker, { key: getObjectCacherKey(objectApiName), data: [data] })
        // return await ctx.broker.call('metadata.rpush', { key: getObjectCacherKey(objectApiName), data: [data] }, { meta: ctx.meta })
    },
    async addObjectTranslations(ctx: any): Promise<any> {
        const { data } = ctx.params;
        for (const item of data) {
            await Register.rpush(ctx.broker, { key: getObjectCacherKey(item.objectApiName), data: [item] })
            // await ctx.broker.call('metadata.rpush', { key: getObjectCacherKey(item.objectApiName), data: [item] }, { meta: ctx.meta })
        }
    },
    // async getTranslations(ctx: any): Promise<any> {
    //     return await ctx.broker.call('metadata.filter', {key: cacherKey("*")}, {meta: ctx.meta})
    // },
    // async addTranslation(ctx: any): Promise<boolean>{
    //     return await ctx.broker.call('metadata.add', {key: cacherKey(ctx.params.data.name), data: ctx.params.data}, {meta: ctx.meta})
    // },
    // async change(ctx: any): Promise<boolean> {
    //     const {data, oldData} = ctx.params;
    //     if(oldData.name != data.name){
    //         await ctx.broker.call('metadata.delete', {key: cacherKey(oldData.name)})
    //     }
    //     return await ctx.broker.call('metadata.add', {key: cacherKey(data.name), data: data}, {meta: ctx.meta})
    // },
    // async delete(ctx: any): Promise<boolean>{
    //     return await ctx.broker.call('metadata.delete', {key: cacherKey(ctx.params.objectApiName)}, {meta: ctx.meta})
    // }
}
