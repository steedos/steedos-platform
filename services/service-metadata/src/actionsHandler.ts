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
    console.log('ctx', ctx);
     return {
        ...ctx.meta?.caller, 
        metadata: ctx.params.data
     }
}

export const ActionHandlers = {
    get(ctx: any): Promise<MetadataObject> {
        return ctx.broker.cacher.get(ctx.params.key)
    },
    add: (ctx: any)=>{
        ctx.broker.cacher.set(ctx.params.key, transformMetadata(ctx));
        return true;
    },
    delete: (ctx: any)=>{
        ctx.broker.cacher.del(ctx.params.key);
        return true;
    },
}