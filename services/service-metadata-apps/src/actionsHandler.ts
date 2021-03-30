import { getServiceAppConfig, METADATA_TYPE, refreshApp } from ".";
import _ = require("lodash");

function cacherKey(appApiName: string): string{
    return `$steedos.#${METADATA_TYPE}.${appApiName}`
}

async function registerApp(ctx, appApiName, data, meta){
    return await ctx.broker.call('metadata.add', {key: cacherKey(appApiName), data: data}, {meta: meta});
}

export const ActionHandlers = {
    async get(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.get', {key: cacherKey(ctx.params.appApiName)}, {meta: ctx.meta})
    },
    async getAll(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.filter', {key: cacherKey("*")}, {meta: ctx.meta})
    },
    async add(ctx: any): Promise<boolean>{
        let config = ctx.params.data;
        const serviceName = ctx.meta.metadataServiceName
        const metadataApiName = ctx.params.appApiName;
        const metadataConfig = await getServiceAppConfig(ctx, serviceName, metadataApiName)
        if(metadataConfig && metadataConfig.metadata){
            config = _.defaultsDeep(metadataConfig.metadata, config);
        }
        await ctx.broker.call('metadata.addServiceMetadata', {key: cacherKey(metadataApiName), data: config}, {meta: Object.assign({}, ctx.meta, {metadataType: METADATA_TYPE, metadataApiName: metadataApiName})})
        const appConfig = await refreshApp(ctx, metadataApiName);
        return await registerApp(ctx, metadataApiName, appConfig, ctx.meta)
    },
    async delete(ctx: any): Promise<boolean>{
        return await ctx.broker.call('metadata.delete', {key: cacherKey(ctx.params.appApiName)}, {meta: ctx.meta})
    },
    async verify(ctx: any): Promise<boolean>{
        console.log("verify");
        return true;
    },
    async refresh(ctx){
        const { isClear, metadataApiNames } = ctx.params
        if(isClear){
            for await (const metadataApiName of metadataApiNames) {
                const appConfig = await refreshApp(ctx, metadataApiName);
                if(!appConfig){
                    await ctx.broker.call('metadata.delete', {key: cacherKey(metadataApiName)})
                }else{
                    await registerApp(ctx, metadataApiName, appConfig, {});
                }
            }
        }
    }
}