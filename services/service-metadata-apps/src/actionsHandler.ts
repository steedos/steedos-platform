
function cacherKey(appApiName: string): string{
    return `$steedos.#apps.${appApiName}`
}

export const ActionHandlers = {
    async get(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.get', {key: cacherKey(ctx.params.appApiName)}, {meta: ctx.meta})
    },
    async getAll(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.filter', {key: cacherKey("*")}, {meta: ctx.meta})
    },
    async add(ctx: any): Promise<boolean>{
        return await ctx.broker.call('metadata.add', {key: cacherKey(ctx.params.appApiName), data: ctx.params.data}, {meta: ctx.meta})
    },
    async delete(ctx: any): Promise<boolean>{
        return await ctx.broker.call('metadata.delete', {key: cacherKey(ctx.params.appApiName)}, {meta: ctx.meta})
    },
    async verify(ctx: any): Promise<boolean>{
        console.log("verify");
        return true;
    }
}