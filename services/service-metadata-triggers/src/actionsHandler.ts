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

function cacherKey(APIName: string, when: string, name: string): string{
    if(!when){
        when = '*'
    }
    if(!name){
        name = '*'
    }
    let key = `$steedos.#triggers.${APIName}.${when}.${name}`;
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
        await broker.call('metadata.add', {key: cacherKey(data.listenTo, item, data.name), data: data}, {meta: meta});
    }
    return true
}

export const ActionHandlers = {
    async get(ctx: any): Promise<MetadataObject> {
        return ctx.broker.call('metadata.get', {key: cacherKey(ctx.params.objectAPIName, ctx.params.when, ctx.params.name)}, {meta: ctx.meta})
    },
    async filter(ctx: any): Promise<Array<MetadataObject>> {
        return ctx.broker.call('metadata.filter', {key: cacherKey(ctx.params.objectAPIName, ctx.params.when, ctx.params.name)}, {meta: ctx.meta})
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
                await ctx.broker.call('metadata.delete', {key: cacherKey(oldData.listenTo, item, oldData.name)}, {meta: ctx.meta});
            }
        }
        return await add(ctx.broker, ctx.params.data, ctx.meta)
    },
    delete: (ctx: any)=>{
        const data = ctx.params.data;
        return ctx.broker.call('metadata.delete', {key: cacherKey(data.listenTo, data.when, data.name)}, {meta: ctx.meta})
    },
    verify: (ctx: any)=>{
        console.log("verify");
        return true;
    }
}