const SERVICE_METADATA_PREFIX = '$METADATA';
const PACKAGE_SERVICES_KEY = '$PACKAGE-SERVICES';
const PACKAGE_SERVICE_PREFIX = '~packages-';
const METADATA_SERVICES_PERFIX = '$METADATA-SERVICES';
import * as _ from 'underscore';

function transformMetadata(ctx){
     return {
        ...ctx.meta.caller, 
        metadata: ctx.params.data
     }
}

function getKey(key , keyPrefix){
    return key.replace(keyPrefix, '');
}

function getServiceMetadataCacherKey(serviceName: string, metadataType: string, metadataApiName: string){
    return `${SERVICE_METADATA_PREFIX}.${serviceName}.${metadataType}.${metadataApiName}`;
}

async function addServiceMetadata(ctx){
    const { nodeID } = ctx.meta.caller || {}
    const { metadataType, metadataApiName, metadataServiceName } = ctx.meta || {}
    // if(metadataType){
    //     console.log('saveServiceMetadataMap', metadataType, metadataApiName, metadataServiceName )
    // }
    if(!metadataServiceName){
        return;
    }
    const key = getServiceMetadataCacherKey(metadataServiceName, metadataType, metadataApiName)
    let data = await ctx.broker.cacher.get(key);
    let nodeIds = [];
    if(data){
        if(data.nodeIds){
            nodeIds = data.nodeIds
        }
    }
    nodeIds.push(nodeID);
    await ctx.broker.cacher.set(key, {
        nodeIds: nodeIds,
        metadataType, 
        metadataApiName,
        metadata: ctx.params.data
    });
}

async function query(ctx, queryKey){
    const keyPrefix = ctx.broker.cacher.prefix
    const keys = await ctx.broker.cacher.client.keys(`${keyPrefix}${queryKey}`) //TODO 此功能仅支持redis cache
    const values = [];
    for (const key of keys) {
        values.push(await ctx.broker.cacher.get(getKey(key, keyPrefix)))
    }
    return values;
}

function getPackageServiceCacherKey(serviceName){
    return `${PACKAGE_SERVICES_KEY}.${serviceName}`;
}

async function setPackageServices(ctx, packageServicesName){
    for await (const packageServiceName of packageServicesName) {
        await ctx.broker.cacher.set(getPackageServiceCacherKey(packageServiceName), {service: packageServiceName});
    }
}

async function clearPackageServices(ctx, packageServicesName){
    for await (const packageServiceName of packageServicesName) {
        await ctx.broker.cacher.del(getPackageServiceCacherKey(packageServiceName));
    }
}

async function getLastPackageServices(ctx){
    const packageServices = await query(ctx, getPackageServiceCacherKey("*"));
    const servicesName = [];
    packageServices.forEach(element => {
        if(element){
            servicesName.push(element.service)
        }
    });
    return servicesName;
}

async function getPackageServices(ctx){
    const servicesName =  _.pluck(ctx.broker.registry.getServiceList({ withActions: true }), 'name');
    let packageServicesName = _.filter(servicesName, (serviceName)=>{
        return serviceName.startsWith(PACKAGE_SERVICE_PREFIX);
    })
    packageServicesName = _.uniq(packageServicesName);
    return packageServicesName;
}

async function clearPackageServiceMetadatas(ctx, packageServiceName){
    const key = getServiceMetadataCacherKey(packageServiceName, "*", "*");
    const clearMetadatas = await query(ctx, key); 
    await ctx.broker.cacher.clean(key);
    return clearMetadatas;
}

async function clearPackageServicesMetadatas(ctx, offlinePackageServices){
    let clearMetadatas = [];
    for await (const packageServiceName of offlinePackageServices) {
        const clearPackageMetadatas = await clearPackageServiceMetadatas(ctx, packageServiceName)
        clearMetadatas = clearMetadatas.concat(clearPackageMetadatas);
    }
    _.each(_.groupBy(clearMetadatas, 'metadataType'), function( data: any , metadataType){
        ctx.broker.emit(`${SERVICE_METADATA_PREFIX}.${metadataType}.clear`, {metadataType, metadataApiNames: _.pluck(data, 'metadataApiName'), isClear: true})
    })
}

async function getMetadataServices(broker){
    const queryKey = `${METADATA_SERVICES_PERFIX}.*`
    const keyPrefix = broker.cacher.prefix
    const keys = await broker.cacher.client.keys(`${keyPrefix}${queryKey}`) //TODO 此功能仅支持redis cache
    const values = [];
    for (const key of keys) {
        values.push(await broker.cacher.get(getKey(key, keyPrefix)))
    }
    return values;
}

export async function started(broker){
    await broker.cacher.set(`${METADATA_SERVICES_PERFIX}.${broker.nodeID}`, {});
}

export async function stopped(broker){
    await broker.cacher.del(`${METADATA_SERVICES_PERFIX}.${broker.nodeID}`);
    const services = await getMetadataServices(broker);
    if(!services || services.length === 0){
        await broker.cacher.clean(`**`);
    }
}

export const ActionHandlers = {
    async get(ctx: any): Promise<any>{
        return await ctx.broker.cacher.get(ctx.params.key)
    },
    async filter(ctx: any): Promise<Array<any>> {
        return await query(ctx, ctx.params.key);
        // const keyPrefix = ctx.broker.cacher.prefix
        // const keys = await ctx.broker.cacher.client.keys(`${keyPrefix}${ctx.params.key}`) //TODO 此功能仅支持redis cache
        // const values = [];
        // for (const key of keys) {
        //     values.push(await ctx.broker.cacher.get(getKey(key, keyPrefix)))
        // }
        // return values;
    },
    async add(ctx: any){
        return await ctx.broker.cacher.set(ctx.params.key, transformMetadata(ctx));
    },
    async addServiceMetadata(ctx: any){
       return await addServiceMetadata(ctx);
    },
    async delete(ctx: any){
        try {
            await ctx.broker.cacher.del(ctx.params.key);
        } catch (error) {
            ctx.broker.logger.info(error.message)
        }
        return true;
    },
    async getServiceMetadatas(ctx: any){
        let { serviceName, metadataType, metadataApiName } = ctx.params;
        if(!serviceName){
            serviceName = '*';
        }
        if(!metadataType){
            metadataType = '*';
        }
        if(!metadataApiName){
            metadataApiName = '*';
        }
        const key = getServiceMetadataCacherKey(serviceName, metadataType, metadataApiName)
        return await query(ctx, key);
    },
    async getServiceMetadata(ctx: any){
        let { serviceName, metadataType, metadataApiName } = ctx.params;
        const key = getServiceMetadataCacherKey(serviceName, metadataType, metadataApiName)
        return await ctx.broker.cacher.get(key)
    },
    async refreshServiceMetadatas(ctx: any){
        const { offlinePackageServices: _offlinePackageServices } = ctx.params || {};
        if(_offlinePackageServices && _offlinePackageServices.length > 0){
            await clearPackageServices(ctx, _offlinePackageServices);
        }
        let packageServices = await getPackageServices(ctx);
        const lastPackageServices = await getLastPackageServices(ctx);
        let offlinePackageServices =_.difference(lastPackageServices, packageServices);
        if(_offlinePackageServices && _offlinePackageServices.length > 0){
            offlinePackageServices = offlinePackageServices.concat(_offlinePackageServices);
            packageServices = _.difference(lastPackageServices, _offlinePackageServices)
        }
        if(offlinePackageServices.length > 0){
            await clearPackageServices(ctx, offlinePackageServices);
            await clearPackageServicesMetadatas(ctx, offlinePackageServices);
        }
        await setPackageServices(ctx, packageServices);
    }
}