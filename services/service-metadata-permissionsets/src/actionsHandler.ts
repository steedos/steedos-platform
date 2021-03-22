
function cacherKey(permissionsetApiName: string): string{
    return `$steedos.#permissionsets.${permissionsetApiName}`
}


function profileCacherKey(profileApiName: string): string{
    return `$steedos.#profiles.${profileApiName}`
}

export const ActionHandlers = {
    async get(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.get', {key: cacherKey(ctx.params.permissionsetApiName)}, {meta: ctx.meta})
    },
    async getAll(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.filter', {key: cacherKey("*")}, {meta: ctx.meta})
    },
    async add(ctx: any): Promise<boolean>{
        return await ctx.broker.call('metadata.add', {key: cacherKey(ctx.params.permissionsetApiName), data: ctx.params.data}, {meta: ctx.meta})
    },
    async delete(ctx: any): Promise<boolean>{
        return await ctx.broker.call('metadata.delete', {key: cacherKey(ctx.params.permissionsetApiName)}, {meta: ctx.meta})
    },
    async verify(ctx: any): Promise<boolean>{
        console.log("verify");
        return true;
    },
    async addProfile(ctx: any): Promise<boolean>{
        return await ctx.broker.call('metadata.add', {key: profileCacherKey(ctx.params.profileApiName), data: ctx.params.data}, {meta: ctx.meta})
    },
    async getProfiles(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.filter', {key: profileCacherKey("*")}, {meta: ctx.meta})
    },
    async getProfile(ctx: any): Promise<boolean>{
        return await ctx.broker.call('metadata.get', {key: profileCacherKey(ctx.params.profileApiName)}, {meta: ctx.meta})
    },
}