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

function cacherKey(APIName: string): string{
    return `$steedos.#objects.${APIName}`
}

export const ActionHandlers = {
    get(ctx: any): Promise<MetadataObject> {
        return ctx.broker.call('metadata.get', {key: cacherKey(ctx.params.objectAPIName)})
    },
    add(ctx: any): boolean{
        return ctx.broker.call('metadata.add', {key: cacherKey(ctx.params.data.name), data: ctx.params.data})
    },
    change(ctx: any): boolean {
        const {data, oldData} = ctx.params;
        if(oldData.name != data.name){
            ctx.broker.call('metadata.delete', {key: cacherKey(oldData.name)})
        }
        return ctx.broker.call('metadata.add', {key: cacherKey(data.name), data: data})
    },
    delete: (ctx: any)=>{
        return ctx.broker.call('metadata.delete', {key: cacherKey(ctx.params.objectAPIName)})
    },
    verify: (ctx: any)=>{
        console.log("verify");
        return true;
    }
}