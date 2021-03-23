export type SObject = {
    name: string,
    [x: string]: any
}

export type MetadataObject = {
    nodeID: [string],
    service: {
        name: string,
        version: string | undefined,
        fullName: string
    }, 
    metadata: SObject
}

function cacherKey(objectApiName: string): string{
    return `$steedos.#objects.${objectApiName}`
}

export const ActionHandlers = {
    async get(ctx: any): Promise<MetadataObject> {
        return await ctx.broker.call('metadata.get', {key: cacherKey(ctx.params.objectApiName)}, {meta: ctx.meta})
    },
    async getAll(ctx: any): Promise<MetadataObject> {
        return await ctx.broker.call('metadata.filter', {key: cacherKey("*")}, {meta: ctx.meta})
    },
    async add(ctx: any): Promise<boolean>{
        await ctx.broker.call('metadata.add', {key: cacherKey(ctx.params.data.name), data: ctx.params.data}, {meta: ctx.meta})
        ctx.broker.emit("metadata.objects.inserted", {objectApiName: ctx.params.data.name, isInsert: true});
        return true;
    },
    async change(ctx: any): Promise<boolean> {
        const {data, oldData} = ctx.params;
        if(oldData.name != data.name){
            await ctx.broker.call('metadata.delete', {key: cacherKey(oldData.name)})
        }
        await ctx.broker.call('metadata.add', {key: cacherKey(data.name), data: data}, {meta: ctx.meta})
        ctx.broker.emit("metadata.objects.updated", {objectApiName: data.name, oldObjectApiName: oldData.name, isUpdate: true});
        return true;
    },
    async delete(ctx: any): Promise<boolean>{
        await ctx.broker.call('metadata.delete', {key: cacherKey(ctx.params.objectApiName)}, {meta: ctx.meta})
        ctx.broker.emit("metadata.objects.deleted", {objectApiName: ctx.params.objectApiName, isDelete: true});
        return true;
    },
    async verify(ctx: any): Promise<boolean>{
        console.log("verify");
        return true;
    }
}