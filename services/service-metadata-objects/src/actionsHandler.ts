import _ = require("lodash");
import { METADATA_TYPE } from ".";
import { getObjectServiceName, getOriginalObject, refreshObject } from "./objects";
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
    return `$steedos.#${METADATA_TYPE}.${objectApiName}`
}

const DELAY_MESSAGE_OF_OBJECT_CHANGED  = 10; // 延迟通知对象事件的时间，单位：毫秒

export class ActionHandlers {
    onRegister: any = null;
	registerObjectMemEntry: Map<string, number>;

    constructor(onRegister){
        this.onRegister = onRegister;
		this.registerObjectMemEntry = new Map<string, number>();
    }

	async registerObject(ctx, objectApiName, data, meta) {
        if(this.onRegister && _.isFunction(this.onRegister)){
            await this.onRegister(data)
        }
        await ctx.broker.call('metadata.add', {key: cacherKey(objectApiName), data: data}, {meta: meta});

		// 为每个对象 setTimeout 延时执行
		const registerObjectMemEntry = this.registerObjectMemEntry;
		let timeoutId = registerObjectMemEntry.get(objectApiName);
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(function(){
			ctx.broker.emit("metadata.objects.inserted", {objectApiName: objectApiName, isInsert: true});
			ctx.broker.emit(`@${objectApiName}.metadata.objects.inserted`, {objectApiName: objectApiName, isInsert: true, data: data});
			registerObjectMemEntry.delete(objectApiName);
		}, DELAY_MESSAGE_OF_OBJECT_CHANGED);
		registerObjectMemEntry.set(objectApiName, timeoutId);
        return true;
	}

    async get(ctx: any): Promise<MetadataObject> {
        return await ctx.broker.call('metadata.get', {key: cacherKey(ctx.params.objectApiName)}, {meta: ctx.meta})
    }

    async getAll(ctx: any): Promise<Array<MetadataObject>> {
        const datasource = ctx.params.datasource;
        const objects =  await ctx.broker.call('metadata.filter', {key: cacherKey("*")}, {meta: ctx.meta});
        if(datasource){
            return _.filter(objects, (object)=>{
                return object.metadata?.datasource == datasource;
            });
        }
        return objects
    }

    async add(ctx: any): Promise<boolean>{
        if(true){
            return true;
        }
        const objectApiName = ctx.params.data.name;
        const data = ctx.params.data;
        const meta = ctx.meta;
        return await this.registerObject(ctx, objectApiName, data, meta);
    }

    async addConfig(ctx: any): Promise<boolean>{
        let config = ctx.params.data;
        if(config.extend){
            config.name = config.extend
        }
        const metadataApiName = config.name;

        const metadataConfig = await ctx.broker.call('metadata.getServiceMetadata', {
            serviceName: ctx.meta.metadataServiceName,
            metadataType: METADATA_TYPE,
            metadataApiName: metadataApiName,
        });

        if(metadataConfig && metadataConfig.metadata){
            config = _.defaultsDeep(config, metadataConfig.metadata);
        }

        await ctx.broker.call('metadata.addServiceMetadata', {key: cacherKey(metadataApiName), data: config}, {meta: Object.assign({}, ctx.meta, {metadataType: METADATA_TYPE, metadataApiName: metadataApiName})})
        const objectConfig = await refreshObject(ctx, metadataApiName);
        if(!objectConfig){
            return ;
        }
        const objectServiceName = getObjectServiceName(metadataApiName);
        return await this.registerObject(ctx, metadataApiName, objectConfig, {
            caller: {
                // nodeID: broker.nodeID,
                service: {
                    name: objectServiceName,
                    // version: broker.service.version, TODO
                    // fullName: broker.service.fullName, TODO
                }
            }
        });
    }

    async change(ctx: any): Promise<boolean> {
        const {data, oldData} = ctx.params;
        if(oldData.name != data.name){
            await ctx.broker.call('metadata.delete', {key: cacherKey(oldData.name)})
            ctx.broker.emit("metadata.objects.deleted", {objectApiName: oldData.name, isDelete: true});
        }
        await ctx.broker.call('metadata.add', {key: cacherKey(data.name), data: data}, {meta: ctx.meta})
        ctx.broker.emit("metadata.objects.updated", {objectApiName: data.name, oldObjectApiName: oldData.name, isUpdate: true});
        return true;
    }

    async delete(ctx: any): Promise<boolean>{
        await ctx.broker.call('metadata.delete', {key: cacherKey(ctx.params.objectApiName)}, {meta: ctx.meta})
        ctx.broker.emit("metadata.objects.deleted", {objectApiName: ctx.params.objectApiName, isDelete: true});
        return true;
    }

    async verify(ctx: any): Promise<boolean>{
        console.log("verify");
        return true;
    }

    async getOriginalObject(ctx: any): Promise<boolean>{
        return await getOriginalObject(ctx, ctx.params.objectApiName);
    }

    async refresh(ctx){
        const { isClear, metadataApiNames } = ctx.params
        if(isClear){
            for await (const metadataApiName of metadataApiNames) {
                const objectConfig = await refreshObject(ctx, metadataApiName);
                if(!objectConfig){
                    await ctx.broker.call('metadata.delete', {key: cacherKey(metadataApiName)})
                    ctx.broker.emit("metadata.objects.deleted", {objectApiName: metadataApiName, isDelete: true});
                }else{
                    const objectServiceName = getObjectServiceName(metadataApiName);
                    await this.registerObject(ctx, metadataApiName, objectConfig, {
                        caller: {
                            // nodeID: broker.nodeID,
                            service: {
                                name: objectServiceName,
                                // version: broker.service.version, TODO
                                // fullName: broker.service.fullName, TODO
                            }
                        }
                    });
                }
            }
        }
    }
}
