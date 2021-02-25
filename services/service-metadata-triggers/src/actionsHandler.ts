import * as _ from 'underscore';

export type Trigger = {
    name: string,
    listenTo: string,
    when: string | Array<string>,
    Action: string 
}
export type MetadataObject = {
    nodeID: [string],
    service: {
        name: string,
        version: string | undefined,
        fullName: string
    }, 
    metadata: Trigger
}

function cacherKey(APIName: string, when?: string): string{
    let key = `$steedos.#triggers.${APIName}`;
    if(when){
        key = `${key}.${when}`
    }
    return key
}

async function add(broker, data, meta){
    let when = []
    if(_.isString(data.when)){
        when.push(data.when);
    }else{
        when = data.when;
    }
    for (const item of when) {
        await broker.call('metadata.add', {key: cacherKey(data.name, item), data: data}, {meta: meta});
    }
    return true
}

export const ActionHandlers = {
    get(ctx: any): Promise<MetadataObject> {
        return ctx.broker.call('metadata.get', {key: cacherKey(ctx.params.objectAPIName)}, {meta: ctx.meta})
    },
    async add(ctx: any): Promise<boolean>{
        return await add(ctx.broker, ctx.params.data, ctx.meta)
    },
    async change(ctx: any): Promise<boolean> {
        const {data, oldData} = ctx.params;
        if(oldData.name != data.name){
            let when = []
            if(_.isString(data.when)){
                when.push(data.when);
            }else{
                when = data.when;
            }
            for (const item of when) {
                await ctx.broker.call('metadata.delete', {key: cacherKey(data.name, item)}, {meta: ctx.meta});
            }
        }
        return await add(ctx.broker, ctx.params.data, ctx.meta)
    },
    delete: (ctx: any)=>{
        return ctx.broker.call('metadata.delete', {key: cacherKey(ctx.params.name)}, {meta: ctx.meta})
    },
    verify: (ctx: any)=>{
        console.log("verify");
        return true;
    }
}