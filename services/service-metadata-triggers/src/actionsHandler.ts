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

function getDelKey(metadataType, metadataApiName: string){
    return `$steedos.#${metadataType}.${metadataApiName}`;
}

function getPatternTriggerKey( when: string, name: string): string{
    if(!when){
        when = '*'
    }
    if(!name){
        name = '*'
    }
    let key = `$steedos.#${METADATA_TYPE}-pattern.${when}.${name}`;
    return key
}

export function isPatternTrigger(data){
    const {listenTo} = data;
    if(listenTo === '*'){
        return true;
    }else if(_.isArray(listenTo)){
        return true;
    }else if(_.isRegExp(listenTo)){
        return true;
    }else if(_.isString(listenTo) && listenTo.startsWith("/")){
        try {
            if(_.isRegExp(eval(listenTo))){
                return true;
            }
        } catch (error) {
            return false
        }
        return false;
    }
    return false;
}

async function registerPatternTrigger(broker, data, meta, item){
    await broker.call('metadata.addServiceMetadata', {data: data}, {meta: Object.assign({}, meta, {metadataType: `${METADATA_TYPE}-pattern`, metadataApiName: `${item}.${data.name}`})})
    await broker.call('metadata.add', {key: getPatternTriggerKey(item, data.name), data: data}, {meta: meta});
}

async function getPatternTriggers(ctx){
    const patternTriggers = [];
    const {objectApiName, when , name } = ctx.params;
    const result = await ctx.broker.call('metadata.filter', {key: getPatternTriggerKey(when, name)}, {meta: ctx.meta});
    
    _.each(result, (item)=>{
        if(item && item.metadata){
            const { metadata } = item
            try {
                if(metadata.listenTo === '*'){
                    patternTriggers.push(item);
                }else if(_.isArray(metadata.listenTo) && _.include(metadata.listenTo, objectApiName)){
                    patternTriggers.push(item);
                }else if(_.isRegExp(metadata.listenTo) && metadata.listenTo.test(objectApiName)){
                    patternTriggers.push(item);
                }else if(_.isString(metadata.listenTo) && metadata.listenTo.startsWith("/")){
                    try {
                        if(_.isRegExp(eval(metadata.listenTo)) && eval(metadata.listenTo).test(objectApiName)){
                            patternTriggers.push(item);
                        }
                    } catch (error) {
                    }
                }
            } catch (error) {
                console.log(`error`, error);
            }
        }
    })
    return patternTriggers;
}

async function registerTrigger(broker, data, meta){
    let when = []
    if(_.isString(data.when)){
        when.push(data.when);
    }else{
        when = data.when;
    }
    for (const item of when) {
        if(isPatternTrigger(data)){
            await registerPatternTrigger(broker, Object.assign({isPattern: true}, data), meta, item)
        }else{
            await broker.call('metadata.addServiceMetadata', {data: data}, {meta: Object.assign({}, meta, {metadataType: METADATA_TYPE, metadataApiName: `${data.listenTo}.${item}.${data.name}`})})
            await broker.call('metadata.add', {key: cacherKey(data.listenTo, item, data.name), data: data}, {meta: meta});
        }
    }
    broker.emit(`${METADATA_TYPE}.change`, data);
    return true
}

export const ActionHandlers = {
    async get(ctx: any): Promise<MetadataObject> {
        return ctx.broker.call('metadata.get', {key: cacherKey(ctx.params.objectApiName, ctx.params.when, ctx.params.name)}, {meta: ctx.meta})
    },

    async getAll(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.filter', { key: cacherKey('*', '*', '*') });
    },

    async filter(ctx: any): Promise<Array<MetadataObject>> {
        const result = await ctx.broker.call('metadata.filter', {key: cacherKey(ctx.params.objectApiName, ctx.params.when, ctx.params.name)}, {meta: ctx.meta});
        //get Pattern Triggers
        const patternTriggers = await getPatternTriggers(ctx);
        return result.concat(patternTriggers);
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
        await ctx.broker.call('metadata.delete', {key: cacherKey(data.listenTo, data.when, data.name)}, {meta: ctx.meta})
        await ctx.broker.emit(`${METADATA_TYPE}.change`, data);
        return true
    },
    async verify(ctx: any): Promise<boolean> {
        console.log("verify");
        return true;
    },
    async refresh(ctx){
        const { isClear, metadataApiNames, metadataType } = ctx.params
        if(isClear){
            for await (const metadataApiName of metadataApiNames) {
                try {
                    await ctx.broker.call('metadata.delete', {key: getDelKey(metadataType, metadataApiName)}, {meta: ctx.meta})
                } catch (error) {
                    ctx.broker.logger.info(error.message)
                }
            }
            await ctx.broker.emit(`${METADATA_TYPE}.change`, {});
        }
    }
}