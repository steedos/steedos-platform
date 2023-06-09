/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-07-30 09:20:04
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-06-09 10:18:09
 * @Description: 
 */
import _ = require("lodash");
import { METADATA_TYPE, PROFILE_METADATA_TYPE } from ".";
import { getServicePermissionsetConfig, refreshPermissionset } from "./permissionsets";
import { getServiceProfileConfig, refreshProfile } from "./profiles";

function cacherKey(permissionsetApiName: string): string{
    return `$steedos.#permissionsets.${permissionsetApiName}`
}


function profileCacherKey(profileApiName: string): string{
    return `$steedos.#profiles.${profileApiName}`
}

async function registerPermissionset(ctx, permissionsetApiName, data, meta){
    return await ctx.broker.call('metadata.add', {key: cacherKey(permissionsetApiName), data: data}, {meta: meta});
}

async function registerProfile(ctx, profileApiName, data, meta){
    return await ctx.broker.call('metadata.add', {key: profileCacherKey(profileApiName), data: data}, {meta: meta});
}

export const ActionHandlers = {
    async get(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.get', {key: cacherKey(ctx.params.permissionsetApiName)}, {meta: ctx.meta})
    },
    async getAll(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.filter', {key: cacherKey("*")}, {meta: ctx.meta})
    },
    async add(ctx: any): Promise<boolean>{
        let config = ctx.params.data;
        const serviceName = ctx.meta.metadataServiceName
        const metadataApiName = ctx.params.permissionsetApiName;
        const metadataConfig = await getServicePermissionsetConfig(ctx, serviceName, metadataApiName)
        if(metadataConfig && metadataConfig.metadata){
            config = _.defaultsDeep(config, metadataConfig.metadata);
        }
        await ctx.broker.call('metadata.addServiceMetadata', {key: cacherKey(metadataApiName), data: config}, {meta: Object.assign({}, ctx.meta, {metadataType: METADATA_TYPE, metadataApiName: metadataApiName})})
        const permissionsetConfig = await refreshPermissionset(ctx, metadataApiName);
        return await registerPermissionset(ctx, metadataApiName, permissionsetConfig, ctx.meta)
    },
    async delete(ctx: any): Promise<boolean>{
        return await ctx.broker.call('metadata.delete', {key: cacherKey(ctx.params.permissionsetApiName)}, {meta: ctx.meta})
    },
    async verify(ctx: any): Promise<boolean>{
        console.log("verify");
        return true;
    },
    async addProfile(ctx: any): Promise<boolean>{
        let config = ctx.params.data;
        const serviceName = ctx.meta.metadataServiceName
        const metadataApiName = ctx.params.profileApiName;
        const metadataConfig = await getServiceProfileConfig(ctx, serviceName, metadataApiName)
        if(metadataConfig && metadataConfig.metadata){
            config = _.defaultsDeep(config, metadataConfig.metadata);
        }
        await ctx.broker.call('metadata.addServiceMetadata', {key: cacherKey(metadataApiName), data: config}, {meta: Object.assign({}, ctx.meta, {metadataType: PROFILE_METADATA_TYPE, metadataApiName: metadataApiName})})
        const profileConfig = await refreshProfile(ctx, metadataApiName);
        const result = await registerProfile(ctx, ctx.params.profileApiName, profileConfig, ctx.meta)
        // 触发加载简档事件
        await ctx.broker.emit(`$METADATA.${PROFILE_METADATA_TYPE}.add`, { metadataApiName })
        return result
    },
    async getProfiles(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.filter', {key: profileCacherKey("*")}, {meta: ctx.meta})
    },
    async getProfile(ctx: any): Promise<boolean>{
        return await ctx.broker.call('metadata.get', {key: profileCacherKey(ctx.params.profileApiName)}, {meta: ctx.meta})
    },
    async refresh(ctx){
        const { isClear, metadataApiNames } = ctx.params
        if(isClear){
            for await (const metadataApiName of metadataApiNames) {
                const permissionsetConfig = await refreshPermissionset(ctx, metadataApiName);
                if(!permissionsetConfig){
                    await ctx.broker.call('metadata.delete', {key: cacherKey(metadataApiName)})
                }else{
                    await registerPermissionset(ctx, metadataApiName, permissionsetConfig, {});
                }
            }
        }
    },
    async refreshProfiles(ctx){
        const { isClear, metadataApiNames } = ctx.params
        if(isClear){
            for await (const metadataApiName of metadataApiNames) {
                const profileConfig = await refreshProfile(ctx, metadataApiName);
                if(!profileConfig){
                    await ctx.broker.call('metadata.delete', {key: profileCacherKey(metadataApiName)})
                }else{
                    await registerProfile(ctx, metadataApiName, profileConfig, {});
                }
            }
        }
    }
}