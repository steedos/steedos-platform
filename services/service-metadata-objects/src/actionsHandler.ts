import _ = require("lodash");
import { Register } from '@steedos/metadata-registrar';
import { METADATA_TYPE } from ".";
import { getObjectServiceName, getOriginalObject, refreshObject, MONGO_BASE_OBJECT, SQL_BASE_OBJECT } from "./objects";
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
    onDestroy: any = null;
    onRegistered: any = null;
	registerObjectMemEntry: Map<string, any>;

    constructor(onRegister, onDestroy, onRegistered){
        this.onRegister = onRegister;
        this.onDestroy = onDestroy;
        this.onRegistered = onRegistered;
		this.registerObjectMemEntry = new Map<string, number>();
    }

	async registerObject(ctx, objectApiName, data, meta) {
        if (objectApiName != MONGO_BASE_OBJECT &&
            objectApiName != SQL_BASE_OBJECT && this.onRegister && _.isFunction(this.onRegister)) {
            await this.onRegister(data)
        }
        // await ctx.broker.call('metadata.add', {key: cacherKey(objectApiName), data: data}, {meta: meta});
        await Register.add(ctx.broker, {key: cacherKey(objectApiName), data: data}, meta)
        if (objectApiName != MONGO_BASE_OBJECT &&
            objectApiName != SQL_BASE_OBJECT && this.onRegistered && _.isFunction(this.onRegistered)) {
            await this.onRegistered(data)
        }
		// 为每个对象 setTimeout 延时执行
		const registerObjectMemEntry = this.registerObjectMemEntry;
		let timeoutId = registerObjectMemEntry.get(objectApiName);
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(function(){
			ctx.broker.emit("metadata.objects.inserted", {objectApiName: objectApiName, isInsert: true});
            ctx.broker.broadcast(`${data.datasource}.@${objectApiName}.metadata.objects.inserted`, { objectApiName: objectApiName, isInsert: true, data: data });
			registerObjectMemEntry.delete(objectApiName);
		}, DELAY_MESSAGE_OF_OBJECT_CHANGED);
		registerObjectMemEntry.set(objectApiName, timeoutId);
        return true;
	}

    async get(ctx: any): Promise<MetadataObject> {
        return await Register.get(ctx.broker, cacherKey(ctx.params.objectApiName))
    }

    async getAll(ctx: any): Promise<Array<MetadataObject>> {
        const datasource = ctx.params.datasource;
        // const objects =  await ctx.broker.call('metadata.filter', {key: cacherKey("*")}, {meta: ctx.meta});
        const objects = await Register.filter(ctx.broker, cacherKey("*"));
        if(datasource){
            return _.filter(objects, (object)=>{
                return object?.metadata?.datasource == datasource;
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
        if(!config.isMain){
            // const metadataConfig = await ctx.broker.call('metadata.getServiceMetadata', {
            //     serviceName: ctx.meta.metadataServiceName,
            //     metadataType: METADATA_TYPE,
            //     metadataApiName: metadataApiName,
            // }, {meta: ctx.meta});
            
            const metadataConfig = await Register.getServiceMetadata(ctx.broker, {
                serviceName: ctx.meta.metadataServiceName,
                metadataType: METADATA_TYPE,
                metadataApiName: metadataApiName,
            }, ctx.meta)

            if (metadataConfig && metadataConfig.metadata) {
                config.list_views = _.defaultsDeep(metadataConfig.metadata.list_views || {}, config.list_views || {});
                config = _.defaultsDeep(config, metadataConfig.metadata);
            }
        }

        // await ctx.broker.call('metadata.addServiceMetadata', { key: cacherKey(metadataApiName), data: config }, { meta: Object.assign({}, ctx.meta, { metadataType: METADATA_TYPE, metadataApiName: metadataApiName }) })

        await Register.addServiceMetadata(ctx.broker, { key: cacherKey(metadataApiName), data: config }, Object.assign({}, ctx.meta, { metadataType: METADATA_TYPE, metadataApiName: metadataApiName }));

        const objectConfig = await refreshObject(ctx, metadataApiName);

        if (!objectConfig) {
            return;
        }

        const objectServiceName = getObjectServiceName(metadataApiName);

        const result = await this.registerObject(ctx, metadataApiName, objectConfig, {
            caller: {
                // nodeID: broker.nodeID,
                service: {
                    name: objectServiceName,
                    // version: broker.service.version, TODO
                    // fullName: broker.service.fullName, TODO
                }
            }
        });
        return result;
    }

    async addConfigs(ctx: any): Promise<boolean> {
        let configs = ctx.params.data;
        for (let config of configs) {
            if (config.extend) {
                config.name = config.extend
            }
            const metadataApiName = config.name;
            if (!config.isMain) {
                // const metadataConfig = await ctx.broker.call('metadata.getServiceMetadata', {
                //     serviceName: ctx.meta.metadataServiceName,
                //     metadataType: METADATA_TYPE,
                //     metadataApiName: metadataApiName,
                // }, { meta: ctx.meta });

                const metadataConfig = await Register.getServiceMetadata(ctx.broker, {
                    serviceName: ctx.meta.metadataServiceName,
                    metadataType: METADATA_TYPE,
                    metadataApiName: metadataApiName,
                }, ctx.meta);

                if (metadataConfig && metadataConfig.metadata) {
                    config.list_views = _.defaultsDeep(metadataConfig.metadata.list_views || {}, config.list_views || {});
                    config = _.defaultsDeep(config, metadataConfig.metadata);
                }
            }
            // await ctx.broker.call('metadata.addServiceMetadata', { key: cacherKey(metadataApiName), data: config }, { meta: Object.assign({}, ctx.meta, { metadataType: METADATA_TYPE, metadataApiName: metadataApiName }) })

            await Register.addServiceMetadata(ctx.broker, {
                key: cacherKey(metadataApiName),
                data: config
            }, Object.assign({}, ctx.meta, { metadataType: METADATA_TYPE, metadataApiName: metadataApiName }));

            const objectConfig = await refreshObject(ctx, metadataApiName);
            if (!objectConfig) {
                ctx.broker.logger.error(`not find extend object ${metadataApiName}, Please check 「${ctx.meta.metadataServiceName}」 package.service.js for dependencies`);
                break;
            }
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
        return true;
    }

    async change(ctx: any): Promise<boolean> {
        const {data, oldData} = ctx.params;
        if(oldData.name != data.name){
            // console.log(`change==================`, oldData.name, data.name);
            await this.deleteObject(ctx, oldData.name)
        }
        // await ctx.broker.call('metadata.add', {key: cacherKey(data.name), data: data}, {meta: ctx.meta})
        await Register.add(ctx.broker, {key: cacherKey(data.name), data: data}, ctx.meta);
        ctx.broker.emit("metadata.objects.updated", {objectApiName: data.name, oldObjectApiName: oldData.name, isUpdate: true});
        return true;
    }

    async removeConfig(ctx: any): Promise<boolean>{
        const { serviceName = '~database-objects', objectName } = ctx.params;
        await Register.deleteServiceMetadata(ctx.broker, {
            nodeID: ctx.broker.nodeID, 
            serviceName: serviceName, 
            metadataType: METADATA_TYPE, 
            metadataApiName: objectName
        });
        const objectConfig = await refreshObject(ctx, objectName);

        if (!objectConfig) {
            return;
        }
        const objectServiceName = getObjectServiceName(objectName);
        await this.registerObject(ctx, objectName, objectConfig, {
            caller: {
                // nodeID: broker.nodeID,
                service: {
                    name: objectServiceName,
                }
            }
        });
        return true;
    }   

    async delete(ctx: any): Promise<boolean>{
        // console.log(`delete==================`, ctx.params.objectApiName);
        return await this.deleteObject(ctx, ctx.params.objectApiName)
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
                    // console.log(`refresh deleteObject==================`, metadataApiName);
                    await this.deleteObject(ctx, metadataApiName)
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
    async deleteObject(ctx, objectApiName): Promise<boolean>{
        await ctx.broker.broadcast(`delete.metadata.${METADATA_TYPE}`, {objectApiName: objectApiName});
        return true;
    }
    async handleDeleteObject(ctx, objectApiName): Promise<boolean>{
        // const { metadata } = (await ctx.broker.call("metadata.get", { key: cacherKey(objectApiName) }, { meta: ctx.meta })) || {};
        const { metadata } = (await Register.get(ctx.broker, cacherKey(objectApiName))) || {};
        // await ctx.broker.call('metadata.delete', {key: cacherKey(objectApiName)}, {meta: ctx.meta})
        await Register.delete(ctx.broker, cacherKey(objectApiName));
        try {
            // await ctx.broker.call('metadata.deleteServiceMetadata', {
            //     nodeID: ctx.broker.nodeID, 
            //     serviceName: '~database-objects', 
            //     metadataType: METADATA_TYPE, 
            //     metadataApiName: objectApiName
            // }, {meta: ctx.meta})

            await Register.deleteServiceMetadata(ctx.broker, {
                nodeID: ctx.broker.nodeID, 
                serviceName: '~database-objects', 
                metadataType: METADATA_TYPE, 
                metadataApiName: objectApiName
            });

        } catch (error) {
            console.log(error)
        }
        if(this.onDestroy && _.isFunction(this.onDestroy)){
            await this.onDestroy(metadata)
        }
        await ctx.broker.broadcast("metadata.objects.deleted", {objectApiName: objectApiName, isDelete: true, objectConfig: metadata});
        if(metadata){
            await ctx.broker.broadcast(`${metadata.datasource}.@${objectApiName}.metadata.objects.deleted`, { objectApiName: objectApiName, data: metadata });
        }
        return true;
    }
}
