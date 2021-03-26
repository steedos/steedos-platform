export const METADATA_TYPE = 'apps';

function cacherKey(appApiName: string): string{
    return `$steedos.#${METADATA_TYPE}.${appApiName}`
}

export const ActionHandlers = {
    async get(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.get', {key: cacherKey(ctx.params.appApiName)}, {meta: ctx.meta})
    },
    async getAll(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.filter', {key: cacherKey("*")}, {meta: ctx.meta})
    },
    async add(ctx: any): Promise<boolean>{
        return await ctx.broker.call('metadata.add', {key: cacherKey(ctx.params.appApiName), data: ctx.params.data}, {meta: Object.assign({}, ctx.meta, {metadataType: METADATA_TYPE, metadataApiName: ctx.params.appApiName})})
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
                try {
                    await ctx.broker.call('metadata.delete', {key: cacherKey(metadataApiName)}, {meta: ctx.meta})
                } catch (error) {
                    ctx.broker.logger.info(error.message)
                }
            }
        }
    }
}