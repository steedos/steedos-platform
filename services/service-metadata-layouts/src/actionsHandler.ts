import { getServiceConfig, METADATA_TYPE, refresh } from ".";
import _ = require("lodash");

function cacherKey(objectApiName: string, apiName: string): string{
    return `$steedos.#${METADATA_TYPE}.${objectApiName}.${apiName}`
}

function getMatadataCacherKey(metadataApiName: string): string{
    return `$steedos.#${METADATA_TYPE}.${metadataApiName}`
}

async function register(ctx, apiName, data, meta){
    return await ctx.broker.call('metadata.add', {key: cacherKey(data.object_name, apiName), data: data}, {meta: meta});
}

function defaultsDeep(obj, sources) {
    let output = {};
    _.toArray(arguments).reverse().forEach(item=> {
        _.mergeWith(output, item, (objectValue, sourceValue) => {
            if(_.isArray(sourceValue)){
                if(_.isArray(objectValue)){
                    return _.uniqBy(_.compact(_.concat(objectValue, sourceValue)), 'name')
                }else{
                    return sourceValue
                }
            }else{
                return undefined;
            }
        });
    });
    return output;
};

export const ActionHandlers = {
    async get(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.get', {key: getMatadataCacherKey(ctx.params.objectLayoutFullName)}, {meta: ctx.meta})
    },
    async getAll(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.filter', {key: cacherKey("*", "*")}, {meta: ctx.meta})
    },
    async add(ctx: any): Promise<boolean>{
        let config = ctx.params.data;
        const serviceName = ctx.meta.metadataServiceName
        const metadataApiName = ctx.params.layoutApiName;
        const metadataConfig = await getServiceConfig(ctx, serviceName, `${config.object_name}.${metadataApiName}`)
        if(metadataConfig && metadataConfig.metadata){
            config = defaultsDeep(config, metadataConfig.metadata);
        }
        await ctx.broker.call('metadata.addServiceMetadata', {key: cacherKey(config.object_name, metadataApiName), data: config}, {meta: Object.assign({}, ctx.meta, {metadataType: METADATA_TYPE, metadataApiName: metadataApiName})})
        const layoutConfig = await refresh(ctx, metadataApiName);
        return await register(ctx, metadataApiName, layoutConfig, ctx.meta)
    },
    async filter(ctx: any): Promise<any>{
        let {objectApiName, spaceId, profileApiName} = ctx.params;
        const layouts = await ctx.broker.call('metadata.filter', {key: cacherKey("*", "*")}, {meta: ctx.meta});

        const configs = _.filter(_.sortBy(layouts, function(item) { return _.startsWith(item?.service?.name, '~database-') ? 0 : 1}), function(item){
            const layout = item.metadata;
            let rev = true;
            if(objectApiName){
                rev = layout.object_name === objectApiName;
            }
            if(rev && spaceId){
                rev = (layout.space === spaceId || !_.has(layout, 'space'));
            }
            if(rev && profileApiName){
                rev = _.includes(layout.profiles, profileApiName);
            }
            return rev;
        })
        return configs;
    },
    async delete(ctx: any): Promise<boolean>{
        return await ctx.broker.call('metadata.delete', {key: getMatadataCacherKey(ctx.params.objectLayoutFullName)}, {meta: ctx.meta})
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
                    await ctx.broker.call('metadata.delete', {key: getMatadataCacherKey(metadataApiName)})
                }else{
                    await register(ctx, metadataApiName, config, {});
                }
            }
        }
    }
}