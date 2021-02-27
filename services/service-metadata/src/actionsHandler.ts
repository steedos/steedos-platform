export type MetadataObject = {
    nodeID: [string],
    service: {
        name: string,
        version: string | undefined,
        fullName: string
    }, 
    metadata: any
}

function transformMetadata(ctx){
     return {
        ...ctx.meta.caller, 
        metadata: ctx.params.data
     }
}

function getKey(key , keyPrefix){
    return key.replace(keyPrefix, '');
}

export const ActionHandlers = {
    async get(ctx: any): Promise<MetadataObject>{
        return await ctx.broker.cacher.get(ctx.params.key)
    },
    async filter(ctx: any): Promise<Array<MetadataObject>> {
        const keyPrefix = ctx.broker.cacher.prefix
        const keys = await ctx.broker.cacher.client.keys(`${keyPrefix}${ctx.params.key}`) //TODO 此功能仅支持redis cache
        const values = [];
        for (const key of keys) {
            values.push(await ctx.broker.cacher.get(getKey(key, keyPrefix)))
        }
        return values;
    },
    async add(ctx: any){
        await ctx.broker.cacher.set(ctx.params.key, transformMetadata(ctx));
        return true;
    },
    async delete(ctx: any){
        await await ctx.broker.cacher.del(ctx.params.key);
        return true;
    },
}