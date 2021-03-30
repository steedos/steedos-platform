import * as _ from 'underscore';

export const METADATA_TYPE = 'triggers';

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

function cacherKey(apiName: string, when: string, name: string): string{
    if(!when){
        when = '*'
    }
    if(!name){
        name = '*'
    }
    let key = `$steedos.#${METADATA_TYPE}.${apiName}.${when}.${name}`;
    return key
}

function getDelKey(metadataApiName: string){
    return `$steedos.#${METADATA_TYPE}.${metadataApiName}`;
}

async function registerTrigger(broker, data, meta){
    let when = []
    if(_.isString(data.when)){
        when.push(data.when);
    }else{
        when = data.when;
    }
    for (const item of when) {
        await broker.call('metadata.addServiceMetadata', {data: data}, {meta: Object.assign({}, meta, {metadataType: METADATA_TYPE, metadataApiName: `${data.listenTo}.${item}.${data.name}`})})
        await broker.call('metadata.add', {key: cacherKey(data.listenTo, item, data.name), data: data}, {meta: meta});
    }
    return true
}

export const ActionHandlers = {
    async get(ctx: any): Promise<MetadataObject> {
        return ctx.broker.call('metadata.get', {key: cacherKey(ctx.params.objectApiName, ctx.params.when, ctx.params.name)}, {meta: ctx.meta})
    },
    async filter(ctx: any): Promise<Array<MetadataObject>> {
        return ctx.broker.call('metadata.filter', {key: cacherKey(ctx.params.objectApiName, ctx.params.when, ctx.params.name)}, {meta: ctx.meta})
    },
    async add(ctx: any): Promise<boolean>{
        return await registerTrigger(ctx.broker, ctx.params.data, ctx.meta)
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
        return await registerTrigger(ctx.broker, ctx.params.data, ctx.meta)
    },
    async delete(ctx: any): Promise<boolean> {
        const data = ctx.params.data;
        return await ctx.broker.call('metadata.delete', {key: cacherKey(data.listenTo, data.when, data.name)}, {meta: ctx.meta})
    },
    async verify(ctx: any): Promise<boolean> {
        console.log("verify");
        return true;
    },
    async refresh(ctx){
        const { isClear, metadataApiNames } = ctx.params
        if(isClear){
            for await (const metadataApiName of metadataApiNames) {
                try {
                    await ctx.broker.call('metadata.delete', {key: getDelKey(metadataApiName)}, {meta: ctx.meta})
                } catch (error) {
                    ctx.broker.logger.info(error.message)
                }
            }
        }
    }
}