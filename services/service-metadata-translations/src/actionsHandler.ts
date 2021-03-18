const crypto = require('crypto');

function getMD5(data){
    let md5 = crypto.createHash('md5');
    return md5.update(data).digest('hex');
}

function getObjectCacherKey(objectApiName: string, data?): string{
    let suffix = "*";
    if(data){
        suffix = getMD5(JSON.stringify(data));    
    }
    return `$steedos.#translations-object.${objectApiName}.${suffix}`
}

export const ActionHandlers = {
    async getObjectTranslations(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.filter', {key: getObjectCacherKey("*")}, {meta: ctx.meta})
    },
    async addObjectTranslation(ctx: any): Promise<boolean>{
        const { objectApiName, data } = ctx.params;
        return await ctx.broker.call('metadata.add', {key: getObjectCacherKey(objectApiName, data), data: data}, {meta: ctx.meta})
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

console.log(`actionsHandler end...`)