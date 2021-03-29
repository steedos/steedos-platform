import _ = require("lodash");
import { METADATA_TYPE } from ".";
import { getObjectServiceName, refreshObject } from "./objects";
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

async function registerObject(ctx, objectApiName, data, meta){
    await ctx.broker.call('metadata.add', {key: cacherKey(objectApiName), data: data}, {meta: meta});
    ctx.broker.emit("metadata.objects.inserted", {objectApiName: objectApiName, isInsert: true});
    ctx.broker.emit(`@${objectApiName}.metadata.objects.inserted`, {objectApiName: objectApiName, isInsert: true, data: data});
    return true;
}




export const ActionHandlers = {
    async get(ctx: any): Promise<MetadataObject> {
        return await ctx.broker.call('metadata.get', {key: cacherKey(ctx.params.objectApiName)}, {meta: ctx.meta})
    },
    async getAll(ctx: any): Promise<Array<MetadataObject>> {
        const datasource = ctx.params.datasource;
        const objects =  await ctx.broker.call('metadata.filter', {key: cacherKey("*")}, {meta: ctx.meta});
        if(datasource){
            return _.filter(objects, (object)=>{
                return object.metadata.datasource == datasource
            })
        }
        return objects
    },
    async add(ctx: any): Promise<boolean>{
        if(true){
            return true;
        }
        const objectApiName = ctx.params.data.name;
        const data = ctx.params.data;
        const meta = ctx.meta;
        return await registerObject(ctx, objectApiName, data, meta)
    },
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
            config = _.defaultsDeep(metadataConfig.metadata, config);
        }

        await ctx.broker.call('metadata.add', {key: cacherKey(metadataApiName), data: config}, {meta: Object.assign({}, ctx.meta, {metadataType: METADATA_TYPE, metadataApiName: metadataApiName})})
        const objectConfig = await refreshObject(ctx, metadataApiName);
        const objectServiceName = getObjectServiceName(metadataApiName);
        return await registerObject(ctx, metadataApiName, objectConfig, {
            caller: {
                // nodeID: broker.nodeID,
                service: {
                    name: objectServiceName,
                    // version: broker.service.version, TODO
                    // fullName: broker.service.fullName, TODO
                }
            }
        });
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
    },
    async refresh(ctx){
        const { isClear, metadataApiNames } = ctx.params
        if(isClear){
            for await (const metadataApiName of metadataApiNames) {
                console.log(`${METADATA_TYPE} refresh --> clear`, metadataApiName)
                const objectConfig = await refreshObject(ctx, metadataApiName);
                if(!objectConfig){
                    await ctx.broker.call('metadata.delete', {key: cacherKey(metadataApiName)})
                }else{
                    const objectServiceName = getObjectServiceName(metadataApiName);
                    await registerObject(ctx, metadataApiName, objectConfig, {
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