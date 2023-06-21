import { getServiceConfig, METADATA_TYPE, refresh } from ".";
import _ = require("lodash");

function cacherKey(apiName: string): string{
    return `$steedos.#${METADATA_TYPE}.${apiName}`
}

function childCacherKey(apiName: string, childApiName): string{
    return `$steedos.#${METADATA_TYPE}.${apiName}.child.${childApiName}`
}

async function addChildMap(ctx, apiName, data, meta){
    if(data.parent){
        return await ctx.broker.call('metadata.add', {key: childCacherKey(data.parent, apiName), data: {apiName}}, {meta: meta});
    }
}

async function deleteChildMap(ctx, tabApiName, childTabApiName){
    if(tabApiName && childTabApiName){
        const result =  await ctx.broker.call('metadata.delete', {key: childCacherKey(tabApiName, childTabApiName)});
        ctx.broker.broadcast(`tabs.change`);
        return result;
    }
}

async function getChildren(ctx, tabApiName){
    return await ctx.broker.call('metadata.filter', {key: childCacherKey(tabApiName, "*")}, {meta: ctx.meta});
}

async function register(ctx, tabApiName, data, meta){
    await addChildMap(ctx, tabApiName, data, meta);
    const result = await ctx.broker.call('metadata.add', {key: cacherKey(tabApiName), data: data}, {meta: meta});
    ctx.broker.broadcast(`tabs.change`);
    return result;
}

export const ActionHandlers = {
    async get(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.get', {key: cacherKey(ctx.params.tabApiName || ctx.params.metadataApiName)}, {meta: ctx.meta})
    },
    async getChildren(ctx: any): Promise<any> {
        return await getChildren(ctx, ctx.params.tabApiName || ctx.params.metadataApiName);
    },
    async getAll(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.filter', {key: cacherKey("*")}, {meta: ctx.meta})
    },
    async add(ctx: any): Promise<boolean>{
        let config = ctx.params.data;
        const serviceName = ctx.meta.metadataServiceName
        const metadataApiName = ctx.params.tabApiName || ctx.params.apiName;
        const metadataConfig = await getServiceConfig(ctx, serviceName, `${config.object_name}.${metadataApiName}`)
        if(metadataConfig && metadataConfig.metadata){
            config = _.defaultsDeep(config, metadataConfig.metadata);
        }
        await ctx.broker.call('metadata.addServiceMetadata', {key: cacherKey(metadataApiName), data: config}, {meta: Object.assign({}, ctx.meta, {metadataType: METADATA_TYPE, metadataApiName: metadataApiName})})
        const tabConfig = await refresh(ctx, metadataApiName);
        return await register(ctx, metadataApiName, tabConfig, ctx.meta)
    },
    async filter(ctx: any): Promise<any>{
        let {objectApiName, spaceId, tabApiName} = ctx.params;
        const tabs = await ctx.broker.call('metadata.filter', {key: cacherKey("*")}, {meta: ctx.meta});
        const configs = _.filter(tabs, function(item){
            const tab = item.metadata;
            let rev = true;
            if(objectApiName){
                rev = tab.object === objectApiName;
            }
            if(rev && spaceId){
                rev = (tab.space === spaceId || !_.has(tab, 'space'));
            }
            if(rev && tabApiName){
                rev = _.includes(tab.profiles, tabApiName);
            }
            return rev;
        })
        return configs;
    },
    async delete(ctx: any): Promise<boolean>{
        const metadataConfig = await ctx.broker.call('metadata.get', {key: cacherKey(ctx.params.tabApiName || ctx.params.metadataApiName)}, {meta: ctx.meta});
        if(metadataConfig.metadata && metadataConfig.metadata.parent){
            await deleteChildMap(ctx, metadataConfig.metadata.parent, ctx.params.tabApiName || ctx.params.metadataApiName)
        }
        // const chidren = await getChildren(ctx, ctx.params.tabApiName || ctx.params.metadataApiName);
        // if(chidren && _.isArray(chidren)){
        //     for await (const child of chidren) {
        //         await deleteChildMap(ctx, ctx.params.tabApiName || ctx.params.metadataApiName, child.apiName)
        //     }
        // }
        return await ctx.broker.call('metadata.delete', {key: cacherKey(ctx.params.tabApiName || ctx.params.metadataApiName)}, {meta: ctx.meta})
    },
    async verify(ctx: any): Promise<boolean>{
        console.log("verify");
        return true;
    },
    async refresh(ctx){
        const { isClear, metadataApiNames } = ctx.params
        if(isClear){
            for await (const metadataApiName of metadataApiNames) {
                const config = await refresh(ctx, metadataApiName);
                if(!config){
                    await ctx.broker.call('metadata.delete', {key: cacherKey(metadataApiName)})
                    ctx.broker.broadcast(`tabs.change`);
                }else{
                    await register(ctx, metadataApiName, config, {});
                }
            }
        }
    }
}