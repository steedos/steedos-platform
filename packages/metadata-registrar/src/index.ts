const SERVICE_METADATA_PREFIX = '$METADATA';
const PACKAGE_SERVICES_KEY = '$PACKAGE-SERVICES';
const PACKAGE_SERVICE_PREFIX = '~packages-';
const METADATA_SERVICES_PREFIX = '$METADATA-SERVICES';
import * as _ from 'underscore';
import { map, filter, replace } from 'lodash';
import { caching } from 'cache-manager';


let savePackageServicesTimeoutID: any = null;

const useScan = true;

async function redisScanKeys(broker, match, count = 10000): Promise<Array<string>> {

    const keys = await (await Register.getCacher(broker)).store.keys();

    let filterReg = match;
    filterReg = replace(filterReg, /\$/g, '\\$')
    filterReg = replace(filterReg, /\#/g, '\\#')
    filterReg = replace(filterReg, /\*/g, '[0-9a-zA-Z\\_\\-\\~\\.\\$\\#\\@\\/]+')
    // console.log(filterReg)
    const filterdKeys = filter(keys, (item)=>{ return item && item.match(filterReg)});
    return filterdKeys
}

function transformMetadata(params, meta) {
    return {
        ...meta.caller,
        metadata: params.data,
    };
}

function transformMetadatas(params, meta) {
    const data = {};
    map(params.data, (value, key) => {
        data[key] = {
            ...meta.caller,
            metadata: value,
        }
    })
    return data;
}

function getKey(key, keyPrefix) {
    return key.replace(keyPrefix, "");
}

function getServiceMetadataCacherKey(nodeID: string, serviceName: string, metadataType: string, metadataApiName: string) {
    return `$${nodeID}.${SERVICE_METADATA_PREFIX}.${serviceName}.${metadataType}.${metadataApiName}`;
}

async function addServiceMetadata(broker, params, meta) {
    const { nodeID } = meta.caller || { nodeID: undefined };
    if (!nodeID) {
        console.log(`addServiceMetadata meta`, meta);
    }

    const { metadataType, metadataApiName, metadataServiceName } = meta || { metadataType: undefined, metadataApiName: undefined, metadataServiceName: undefined };

    if (!metadataServiceName) {
        return;
    }
    const key = getServiceMetadataCacherKey(nodeID, metadataServiceName, metadataType, metadataApiName);
    await (await Register.getCacher(broker)).set(key, {
        nodeIds: [nodeID],
        metadataType,
        metadataApiName,
        metadataServiceName,
        metadata: params.data,
    });
}

async function maddServiceMetadata(broker, params, meta) {
    const { nodeID } = meta.caller || { nodeID: undefined };
    if (!nodeID) {
        console.log(`addServiceMetadata meta`, meta);
    }

    const { metadataType, metadataServiceName } = meta || { metadataType: undefined, metadataServiceName: undefined };

    //data: {k1:v1, k2:v2}
    const { data } = params

    if (!metadataServiceName || !data) {
        return;
    }

    const mdata = {};

    map(data, (value, metadataApiName) => {
        mdata[getServiceMetadataCacherKey(nodeID, metadataServiceName, metadataType, metadataApiName)] = {
            nodeIds: [nodeID],
            metadataType,
            metadataApiName,
            metadataServiceName,
            metadata: value,
        }
    })

    await mset(broker, mdata);
}

async function mget(broker, keys) {
    if (!keys || keys.length == 0) {
        return [];
    }

    const keyPrefix = (await Register.getCacher(broker))?.prefix || "";

    const values = await (await Register.getCacher(broker)).store.mget(...map(keys, (key) => {
        if (key && !key.startsWith(keyPrefix)) {
            return `${keyPrefix}${key}`
        } else {
            return key
        }
    }));
    const results: any = [];
    _.map(values, (item) => {
        try {
            if (item) {
                results.push(JSON.parse(item));
            } else {
                results.push(item);
            }
        } catch (error) {
            results.push(item);
        }
    })
    return results;
}

async function mset(broker, data) {
    if (_.isEmpty(data)) {
        return;
    }
    const keyPrefix = (await Register.getCacher(broker))?.prefix || "";
    const mdata = {};
    _.map(data, async (v, k) => {
        mdata[`${keyPrefix}${k}`] = v
        // console.log(`=== mset: ${keyPrefix}${k} => ${v}`)
        await (await Register.getCacher(broker)).set(`${keyPrefix}${k}`, JSON.stringify(v));
    })

    return true;
}

// 这里需要更改
async function query(broker, queryKey) {
    try {
        const keyPrefix = (await Register.getCacher(broker))?.prefix || "";
        const keys = await redisScanKeys((await Register.getCacher(broker)), `${keyPrefix}${queryKey}`) //(await Register.getCacher(broker)).store.keys(`${keyPrefix}${queryKey}`); //TODO 此功能仅支持redis cache
        
        const values = _.compact(await mget(broker, keys));
        return values;
    } catch (error) {
        console.error(`error`, error)
    }
    return []
}

function getPackageServiceCacherKey(nodeID, serviceName) {
    return `$${nodeID}.${PACKAGE_SERVICES_KEY}.${serviceName}`;
}

async function setPackageServices(broker, packageServices) {
    for await (const packageService of packageServices) {
        (await Register.getCacher(broker)).set(getPackageServiceCacherKey(packageService.nodeID, packageService.name), { service: packageService });
    }
}

async function clearPackageServices(broker, packageServices) {
    for await (const packageService of packageServices) {
        let nodeID: any = null;
        let name: any = null;
        if (_.isString(packageService)) {
            let foo = packageService.split('.');
            nodeID = foo.splice(0, foo.length -1).join('.');
            name = foo.join('.');
        } else if (_.isObject(packageService)) {
            nodeID = packageService.nodeID;
            name = packageService.name;
        }
        // console.log(`clearPackageServices del ===== `, getPackageServiceCacherKey(nodeID, name))
        await (await Register.getCacher(broker)).del(getPackageServiceCacherKey(nodeID, name));
    }
}

async function getLastPackageServices(broker) {
    const packageServices = await query(broker, getPackageServiceCacherKey("*", "*"));
    const services: any = [];
    packageServices.forEach((element) => {
        if (element) {
            services.push(element.service);
        }
    });
    return services;
}

async function getPackageServices(broker) {
    const packageServices: any = [];
    const services = broker.registry.getServiceList({ withActions: true });
    _.each(services, (serviceItem) => {
        const { name, nodeID } = serviceItem; //, version, fullName, settings, local, available, nodeID
        if (name.startsWith(PACKAGE_SERVICE_PREFIX)) {
            // console.log(`serviceItem`, serviceItem)
            packageServices.push(Object.assign({}, serviceItem, { apiName: `${nodeID}.${name}` }))
        }
    })
    return packageServices;
}

async function clearPackageServiceMetadatas(broker, nodeID, packageServiceName) {
    const key = getServiceMetadataCacherKey(nodeID, packageServiceName, "*", "*");
    const clearMetadatas = await query(broker, key);
    await (await Register.getCacher(broker)).clean(key);
    return clearMetadatas;
}

async function clearPackageServicesMetadatas(broker, offlinePackageServices) {
    let clearMetadatas = [];
    for await (const packageService of offlinePackageServices) {
        let nodeID: any = null;
        let name: any = null;
        if (_.isString(packageService)) {
            let foo = packageService.split('.');
            nodeID = foo.splice(0, foo.length -1).join('.');
            name = foo.join('.');
        } else if (_.isObject(packageService)) {
            nodeID = packageService.nodeID;
            name = packageService.name;
        }
        const clearPackageMetadatas: any = await clearPackageServiceMetadatas(broker, nodeID, name);
        clearMetadatas = clearMetadatas.concat(clearPackageMetadatas);
    }
    _.each(_.groupBy(clearMetadatas, "metadataType"), function (data: any, metadataType) {
        broker.emit(`${SERVICE_METADATA_PREFIX}.${metadataType}.clear`, { metadataType, metadataApiNames: _.pluck(data, "metadataApiName"), isClear: true });
    });
}

async function getMetadataServices(broker) {
    const queryKey = `${METADATA_SERVICES_PREFIX}.*`;
    const keyPrefix = (await Register.getCacher(broker))?.prefix || "";
    const keys = await redisScanKeys((await Register.getCacher(broker)), `${keyPrefix}${queryKey}`)
    const values: any = [];
    for (const key of keys) {
        values.push(await (await Register.getCacher(broker)).get(getKey(key, keyPrefix)));
    }
    return values;
}

async function lrange(broker, key, start = 0, end = -1) {
    return await (await Register.getCacher(broker)).store.lrange(key, start, end);
}

export async function started(broker) {
    return await (await Register.getCacher(broker)).set(`${METADATA_SERVICES_PREFIX}.${broker.nodeID}`, {});
}

export async function stopped(broker) {
    await (await Register.getCacher(broker)).del(`${METADATA_SERVICES_PREFIX}.${broker.nodeID}`);
    const services = await getMetadataServices(broker);
    if (!services || services.length === 0) {
        await (await Register.getCacher(broker)).clean(`**`);
    }
}

export const Register = {
    clearPackageServices,
    clearPackageServicesMetadatas,
    CACHER: null, 
    async getCacher(broker?: any) {
        if (Register.CACHER == null)
            Register.CACHER = await caching('memory', {
                max: 1000000,
            });
        return Register.CACHER
    },
    async get(broker: any, key: string): Promise<any> {
        try {
            const value = await (await Register.getCacher(broker)).get(key);
            // console.log(`=== get: ${key},${value}`)
            return value
        } catch (error) {

        }
    },
    async mget(broker: any, keys: Array<string>): Promise<any> {
        try {
            return await mget(broker, keys);
        } catch (error) {

        }
    },
    async filter(broker: any, key: string): Promise<Array<any>> {
        return await query(broker, key);
    },
    async mfilter(broker: any, keys: Array<string>): Promise<Array<any>> {
        const values: any = [];
        for (const key of keys) {
            values.push(await query(broker, key))
        }
        return values
    },
    async add(broker: any, params: any, meta: any): Promise<any> {
        const { key } = params;
        // console.log(`=== add: ${key} => ${params}`)
        return await (await Register.getCacher(broker)).set(key, transformMetadata(params, meta));
    },
    async madd(broker: any, params: any, meta: any): Promise<any> {
        // console.log(`=== madd: ${params.key} => ${params}`)
        return await mset(broker, transformMetadatas(params, meta));
    },
    async addServiceMetadata(broker: any, params: any, meta: any) {
        return await addServiceMetadata(broker, params, meta);
    },
    async maddServiceMetadata(broker: any, params: any, meta: any) {
        return await maddServiceMetadata(broker, params, meta);
    },
    async fuzzyDelete(broker: any, key: string) {
        const keyPrefix = (await Register.getCacher(broker))?.prefix || "";
        const keys = await redisScanKeys((await Register.getCacher(broker)), `${keyPrefix}${key}`) // await (await Register.getCacher(broker)).store.keys(`${keyPrefix}${key}`);
        for (const _key of keys) {
            await (await Register.getCacher(broker)).del(getKey(_key, keyPrefix));
        }
    },
    async delete(broker: any, key: string) {
        try {
            await (await Register.getCacher(broker)).del(key);
        } catch (error) {
            broker.logger.info(error.message);
        }
        return true;
    },
    async deleteServiceMetadata(broker: any, params: any) {
        try {
            let { nodeID, serviceName, metadataType, metadataApiName } = params;
            if (!nodeID) {
                throw new Error('nodeID is null');
            }
            if (!serviceName) {
                throw new Error('serviceName is null');
            }
            if (!metadataType) {
                throw new Error('metadataType is null');
            }
            if (!metadataApiName) {
                throw new Error('metadataApiName is null');
            }
            const key = getServiceMetadataCacherKey(nodeID, serviceName, metadataType, metadataApiName);
            await (await Register.getCacher(broker)).del(key);
        } catch (error) {
            broker.logger.info(error.message);
        }
        return true;
    },

    async getServiceMetadatas(broker: any, params: any) {
        let { nodeID, serviceName, metadataType, metadataApiName } = params;
        if (!nodeID) {
            nodeID = "*";
        }
        if (!serviceName) {
            serviceName = "*";
        }
        if (!metadataType) {
            metadataType = "*";
        }
        if (!metadataApiName) {
            metadataApiName = "*";
        }
        const key = getServiceMetadataCacherKey(nodeID, serviceName, metadataType, metadataApiName);
        const result = await query(broker, key);
        // console.log(`=== getServiceMetadatas: ${key} => ${result}`)
        return result ? filter(result, (item)=>{ return item && item.metadataType === metadataType}) : result;
    },
    async getServiceMetadata(broker: any, params: any, meta: any) {
        let { serviceName, metadataType, metadataApiName } = params;
        const { nodeID } = meta.caller || { nodeID: undefined };
        if (!nodeID) {
            console.log(`getServiceMetadata meta`, meta);
        }
        const key = getServiceMetadataCacherKey(nodeID, serviceName, metadataType, metadataApiName);
        const result = await (await Register.getCacher(broker)).get(key)
        // console.log(`=== getServiceMetadata: ${key} => ${result}`)
        return result
    },
    async removeServiceMetadata(broker: any, params: any, meta: any) {
        let { serviceName, metadataType, metadataApiName } = params;
        const { nodeID } = meta.caller || { nodeID: undefined };
        if (!nodeID) {
            console.log(`getServiceMetadata meta`, meta);
        }
        const key = getServiceMetadataCacherKey(nodeID, serviceName, metadataType, metadataApiName);
        return await (await Register.getCacher(broker)).del(key)
    },
    async refreshServiceMetadatas(broker: any, params: any) {
        const { offlinePackageServices: _offlinePackageServices } = params || { offlinePackageServices: undefined };
        const offlinePackageServicesListString: any = [];
        if (_offlinePackageServices && _offlinePackageServices.length > 0) {
            // 检查 offlinePackageServices 中的每一项必须包含nodeID、name
            _.each(_offlinePackageServices, (item)=>{
                if(!item){
                    throw new Error('offlinePackageInfo is null')
                }
                if(_.isString(item)){
                    throw new Error('offlinePackageInfo cannot be string')
                }
                if(_.isObject(item)){
                    const { nodeID, name } = item; //, instanceID
                    if(!_.isString(nodeID)){
                        throw new Error('offlinePackageInfo.nodeID must be string')
                    }
                    if(!_.isString(name)){
                        throw new Error('offlinePackageInfo.name must be string')
                    }
                    offlinePackageServicesListString.push(`${nodeID}.${name}`)
                }
            })
            await broker.call('metadata.clearPackageServices', { offlinePackageServicesName: _offlinePackageServices })
            // ctx.broker.broadcast(`$metadata.clearPackageServices`, { offlinePackageServicesName: _offlinePackageServices });
        }
        
        let packageServices = await getPackageServices(broker);
        const packageServicesName = _.pluck(packageServices, "apiName");

        const lastPackageServices = await getLastPackageServices(broker);
        const lastPackageServicesNames = _.pluck(lastPackageServices, "apiName");

        let offlinePackageServicesName = _.difference(lastPackageServicesNames, packageServicesName);

        let timeoutOfflinePackageServices = _.filter(lastPackageServices, (lastPackageService) => {
            return lastPackageService && _.include(offlinePackageServicesName, lastPackageService.apiName)
        })
        
        if (_offlinePackageServices && _offlinePackageServices.length > 0) {
            timeoutOfflinePackageServices = timeoutOfflinePackageServices.concat(_offlinePackageServices);
            const onlinePackageServicesName = _.difference(lastPackageServices, offlinePackageServicesListString);
            packageServices = _.filter(packageServices, (packageService) => {
                return packageService && _.include(onlinePackageServicesName, packageService.apiName)
            })
        }
        
        // if (timeoutOfflinePackageServices.length > 0) {
        //     ctx.broker.broadcast(`$metadata.clearPackageServices`, { offlinePackageServicesName: timeoutOfflinePackageServices });
        // }

        //使用延时方式存储软件包记录， 防止多服务之间服务发现延时导致数据清理异常。延时来自moleculer内部的服务发现机制(broker.registry.getServiceList)
        //清理数据无需做到实时，延时30秒
        if (savePackageServicesTimeoutID) {
            clearTimeout(savePackageServicesTimeoutID);
            savePackageServicesTimeoutID = null;
        }
        if (!savePackageServicesTimeoutID) {
            savePackageServicesTimeoutID = setTimeout(() => {
                setPackageServices(broker, packageServices);
            }, 30 * 1000)
        }

    },

    async lpush(broker: any, params: any) {
        const keyPrefix = (await Register.getCacher(broker))?.prefix || "";
        const key = params.key;
        const data = params.data;
        if (!_.isArray(data)) {
            throw new Error('data must be an array.');
        }
        const _data: any = [];
        _.each(data, (item) => {
            _data.push(JSON.stringify(item))
        })
        return await (await Register.getCacher(broker)).store.lpush(`${keyPrefix}${key}`, ..._data);
    },

    async rpush(broker: any, params: any) {
        const keyPrefix = (await Register.getCacher(broker))?.prefix || "";
        const key = params.key;
        const data = params.data;
        if (!_.isArray(data)) {
            throw new Error('data must be an array.');
        }
        const _data: any = await (await Register.getCacher(broker)).store.get(`${keyPrefix}${key}`) || [];
        _.each(data, (item) => {
            _data.push(JSON.stringify(item))
        })
        return await (await Register.getCacher(broker)).store.set(`${keyPrefix}${key}`, _data);
    },

    async lrange(broker: any, params: any) {
        const keyPrefix = (await Register.getCacher(broker))?.prefix || "";
        const { key, start = 0, end = -1 } = params.key;
        return await lrange(broker, `${keyPrefix}${key}`, start, end);
    },

    async filterList(broker: any, params: any) {
        const keyPrefix = (await Register.getCacher(broker))?.prefix || "";
        const { key } = params;
        const keys = await redisScanKeys((await Register.getCacher(broker)), `${keyPrefix}${key}`);
        if (!keys || keys.length == 0) {
            return [];
        }
        const results = await mget(broker, keys)
        return results;
        // const results: any = [];
        // for (const itemKey of keys) {
        //     try {
        //         if (itemKey) {
        //             console.log(itemKey)
        //             const itemList = await (lrange)(broker, itemKey);
        //             if (itemList && _.isArray(itemList)) {
        //                 _.each(itemList, (item) => {
        //                     results.push(JSON.parse(item));
        //                 })
        //             }
        //         }
        //     } catch (error) {
        //         console.error(`error`, error);
        //     }
        // }
        // return results;
    }
};
