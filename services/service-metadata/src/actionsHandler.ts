const SERVICE_METADATA_PREFIX = '$METADATA';
const PACKAGE_SERVICES_KEY = '$PACKAGE-SERVICES';
const PACKAGE_SERVICE_PREFIX = '~packages-';
const METADATA_SERVICES_PERFIX = '$METADATA-SERVICES';
import * as _ from 'underscore';
import { map } from 'lodash';

let savePackageServicesTimeoutID = null;

const useScan = true;

async function redisScanKeys(redisClient, match, count = 10000): Promise<Array<string>> {
    if (!useScan) {
        return await redisClient.keys(match);
    } else {
        return await new Promise((resolve, reject) => {
            if (_.isFunction(redisClient.scanStream)) {
                var stream = redisClient.scanStream({
                    // only returns keys following the pattern of `user:*`
                    match: match,
                    // returns approximately 100 elements per call
                    count: count
                });

                var keys = [];
                stream.on('data', function (resultKeys) {
                    for (var i = 0; i < resultKeys.length; i++) {
                        keys.push(resultKeys[i]);
                    }
                });
                stream.on('end', function () {
                    resolve(keys)
                });
            } else {

                let nodes = redisClient.nodes('master');
                let allPromises = [];
                for (let index = 0; index < nodes.length; index++) {
                    const node = nodes[index];
                    allPromises.push(new Promise((res, reject) => {
                        var keys = [];
                        node.scanStream({
                            // only returns keys following the pattern of `user:*`
                            match: match,
                            // returns approximately 100 elements per call
                            count: count
                        }).on('data', resultKeys => {
                            for (var i = 0; i < resultKeys.length; i++) {
                                keys.push(resultKeys[i]);
                            }
                        }).on('end', () => {
                            // console.info("scan end, node %s:%d", node.options.host, node.options.port);
                            res(keys)
                        });
                    }));

                }
                Promise.all(allPromises).then((values) => {
                    let joinedKeys = [];
                    for (const keys of values) {
                        joinedKeys = joinedKeys.concat(keys);
                    }
                    resolve(joinedKeys)
                })

            }
        })
    }
}

//////////////// mock for redis cacher ////////////////
// let mockCacherData: string[] = [];
// let mock_prefix = "";

// async function mockCacherGet(ctx: any, key: string): Promise<any> { // cacher.get
// 	return await ctx.broker.cacher.get(key);
// }

// // 支持 * 通配符
// async function mockCacherKeys(ctx: any, key: string): Promise<string[]> { // cacher.client.keys
// 	// // 原来是：
// 	// const broker_res = await ctx.broker.cacher.client.keys(key);

// 	const regex_key = "^"+ key.split(".").join("\\.").split("*").join(".+").split("$").join("\\$") + "$";
// 	const reg = new RegExp(regex_key);
// 	const keys = mockCacherData.filter(item => reg.test(item));

// 	// const diff_d = _.difference(broker_res, keys); // 差错 diff 代码
// 	// if (diff_d.length > 0) {
// 	// 	console.log("diff is",key, diff_d);
// 	// 	console.log("* is", key,await ctx.broker.cacher.client.keys("*"));
// 	// 	console.log("my is",key, mockCacherData);
// 	// 	process.exit();
// 	// }

// 	return keys;
// }

// async function mockCacherSet(ctx: any, key: string, data: any): Promise<any> {
//     // cacher.set
//     const finalKey = mock_prefix + key;
//     // const item = mockCacherData.find(item => item === finalKey);
//     // if (!item) {
//     // 	mockCacherData.push(finalKey);
//     // }

//     await ctx.broker.cacher.set(key, data);
// }

// // 支持 * 通配符
// async function mockCacherClean(ctx: any, key: string): Promise<any> {
//     // cacher.clean
//     if (key == "**") {
//         mockCacherData = [];
//     } else {
//         const regex_key =
//             "^" +
//             key
//                 .split(".")
//                 .join("\\.")
//                 .split("*")
//                 .join(".+")
//                 .split("$")
//                 .join("\\$") +
//             "$";
//         const reg = new RegExp(regex_key);
//         mockCacherData = mockCacherData.filter((item) => !reg.test(item));
//     }

//     await ctx.broker.cacher.clean(key);
// }
// async function mockCacherDel(ctx: any, key: string): Promise<any> {
//     // cacher.del
//     const finalKey = mock_prefix + key;
//     mockCacherData = mockCacherData.filter((item) => item !== finalKey);

//     await ctx.broker.cacher.del(key);
// }

////////////////////////////////////////////////

function transformMetadata(ctx) {
    return {
        ...ctx.meta.caller,
        metadata: ctx.params.data,
    };
}

function transformMetadatas(ctx) {
    const data = {};
    map(ctx.params.data, (value, key) => {
        data[key] = {
            ...ctx.meta.caller,
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

async function addServiceMetadata(ctx) {
    const { nodeID } = ctx.meta.caller || { nodeID: undefined };
    if (!nodeID) {
        console.log(`addServiceMetadata ctx.meta`, ctx.meta);
    }

    const { metadataType, metadataApiName, metadataServiceName } = ctx.meta || { metadataType: undefined, metadataApiName: undefined, metadataServiceName: undefined };

    if (!metadataServiceName) {
        return;
    }
    const key = getServiceMetadataCacherKey(nodeID, metadataServiceName, metadataType, metadataApiName);
    await ctx.broker.cacher.set(key, {
        nodeIds: [nodeID],
        metadataType,
        metadataApiName,
        metadataServiceName,
        metadata: ctx.params.data,
    });
}

async function maddServiceMetadata(ctx) {
    const { nodeID } = ctx.meta.caller || { nodeID: undefined };
    if (!nodeID) {
        console.log(`addServiceMetadata ctx.meta`, ctx.meta);
    }

    const { metadataType, metadataServiceName } = ctx.meta || { metadataType: undefined, metadataServiceName: undefined };

    //data: {k1:v1, k2:v2}
    const { data } = ctx.params

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

    await mset(ctx, mdata);
}

async function mget(ctx, keys) {
    if (!keys || keys.length == 0) {
        return [];
    }

    const keyPrefix = ctx.broker.cacher?.prefix || "";

    const values = await ctx.broker.cacher.client.mget(...map(keys, (key) => {
        if (key && !key.startsWith(keyPrefix)) {
            return `${keyPrefix}${key}`
        } else {
            return key
        }
    }));
    const results = [];
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

async function mset(ctx, data) {
    if (_.isEmpty(data)) {
        return;
    }
    const keyPrefix = ctx.broker.cacher?.prefix || "";
    const mdata = {};
    _.map(data, (v, k) => {
        mdata[`${keyPrefix}${k}`] = JSON.stringify(v)
    })
    return await ctx.broker.cacher.client.mset(mdata);
}

// 这里需要更改
async function query(ctx, queryKey) {
    try {
        // const s = new Date().getTime();
        const keyPrefix = ctx.broker.cacher?.prefix || "";
        // const sk = new Date().getTime();
        const keys = await redisScanKeys(ctx.broker.cacher.client, `${keyPrefix}${queryKey}`) //ctx.broker.cacher.client.keys(`${keyPrefix}${queryKey}`); //TODO 此功能仅支持redis cache
        // const dk = new Date().getTime() - sk;
        // const sv = new Date().getTime();
        // REPLACE: const keys = await mockCacherKeys(ctx, `${keyPrefix}${queryKey}`) //TODO 此功能仅支持redis cache
        const values = _.compact(await mget(ctx, keys));
        // const dv = new Date().getTime() - sv;
        // const d = new Date().getTime() - s;
        // if (d > Number(process.env.STEEDOS_DURATION)) {
        // console.log(`query`, d, dk, dv, `${keyPrefix}${queryKey}`);
        // }
        return values;
    } catch (error) {
        // console.error(`error`, error)
    }
    return []
}

function getPackageServiceCacherKey(nodeID, serviceName) {
    return `$${nodeID}.${PACKAGE_SERVICES_KEY}.${serviceName}`;
}

async function setPackageServices(ctx, packageServices) {
    for await (const packageService of packageServices) {
        ctx.broker.cacher.set(getPackageServiceCacherKey(packageService.nodeID, packageService.name), { service: packageService });
        // REPLACE: await await mockCacherSet(ctx, getPackageServiceCacherKey(packageServiceName), { service: packageServiceName });
    }
}

async function clearPackageServices(ctx, packageServices) {
    for await (const packageService of packageServices) {
        let nodeID = null;
        let name = null;
        if (_.isString(packageService)) {
            let foo = packageService.split('.');
            nodeID = foo.splice(0, foo.length -1).join('.');
            name = foo.join('.');
        } else if (_.isObject(packageService)) {
            nodeID = packageService.nodeID;
            name = packageService.name;
        }
        // console.log(`clearPackageServices del ===== `, getPackageServiceCacherKey(nodeID, name))
        await ctx.broker.cacher.del(getPackageServiceCacherKey(nodeID, name));
        // REPLACE: await mockCacherDel(ctx, getPackageServiceCacherKey(packageServiceName));
    }
}

async function getLastPackageServices(ctx) {
    const packageServices = await query(ctx, getPackageServiceCacherKey("*", "*"));
    const services = [];
    packageServices.forEach((element) => {
        if (element) {
            services.push(element.service);
        }
    });
    return services;
}

async function getPackageServices(ctx) {
    const packageServices = [];
    const services = ctx.broker.registry.getServiceList({ withActions: true });
    _.each(services, (serviceItem) => {
        const { name, nodeID } = serviceItem; //, version, fullName, settings, local, available, nodeID
        if (name.startsWith(PACKAGE_SERVICE_PREFIX)) {
            // console.log(`serviceItem`, serviceItem)
            packageServices.push(Object.assign({}, serviceItem, { apiName: `${nodeID}.${name}` }))
        }
    })
    return packageServices;
    // const servicesName = _.pluck(services, "name");
    // let packageServicesName = _.filter(servicesName, (serviceName) => {
    //     return serviceName.startsWith(PACKAGE_SERVICE_PREFIX);
    // });
    // packageServicesName = _.uniq(packageServicesName);
    // return packageServicesName;
}

async function clearPackageServiceMetadatas(ctx, nodeID, packageServiceName) {
    const key = getServiceMetadataCacherKey(nodeID, packageServiceName, "*", "*");
    const clearMetadatas = await query(ctx, key);
    await ctx.broker.cacher.clean(key);
    // REPLACE: await mockCacherClean(ctx, key);
    return clearMetadatas;
}

async function clearPackageServicesMetadatas(ctx, offlinePackageServices) {
    let clearMetadatas = [];
    for await (const packageService of offlinePackageServices) {
        let nodeID = null;
        let name = null;
        if (_.isString(packageService)) {
            let foo = packageService.split('.');
            nodeID = foo.splice(0, foo.length -1).join('.');
            name = foo.join('.');
        } else if (_.isObject(packageService)) {
            nodeID = packageService.nodeID;
            name = packageService.name;
        }
        const clearPackageMetadatas = await clearPackageServiceMetadatas(ctx, nodeID, name);
        clearMetadatas = clearMetadatas.concat(clearPackageMetadatas);
    }
    _.each(_.groupBy(clearMetadatas, "metadataType"), function (data: any, metadataType) {
        ctx.broker.emit(`${SERVICE_METADATA_PREFIX}.${metadataType}.clear`, { metadataType, metadataApiNames: _.pluck(data, "metadataApiName"), isClear: true });
    });
}

async function getMetadataServices(broker) {
    const queryKey = `${METADATA_SERVICES_PERFIX}.*`;
    const keyPrefix = broker.cacher?.prefix || "";
    const keys = await redisScanKeys(broker.cacher.client, `${keyPrefix}${queryKey}`)  // broker.cacher.client.keys(`${keyPrefix}${queryKey}`); //TODO 此功能仅支持redis cache
    // REPLACE: const keys = await mockCacherKeys({broker,}, `${keyPrefix}${queryKey}`) //TODO 此功能仅支持redis cache
    const values = [];
    for (const key of keys) {
        values.push(await broker.cacher.get(getKey(key, keyPrefix)));
        // REPLACE: values.push(await mockCacherGet({ broker }, getKey(key, keyPrefix)));
    }
    return values;
}

async function lrange(ctx, key, start = 0, end = -1) {
    return await ctx.broker.cacher.client.lrange(key, start, end);
}

export async function started(broker) {
    // mock_prefix = broker.cacher?.prefix || "";
    await broker.cacher.set(`${METADATA_SERVICES_PERFIX}.${broker.nodeID}`, {});
    // REPLACE: await mockCacherSet({broker, }, `${METADATA_SERVICES_PERFIX}.${broker.nodeID}`, {});
}

export async function stopped(broker) {
    await broker.cacher.del(`${METADATA_SERVICES_PERFIX}.${broker.nodeID}`);
    // REPLACE: await mockCacherDel({broker}, `${METADATA_SERVICES_PERFIX}.${broker.nodeID}`);
    const services = await getMetadataServices(broker);
    if (!services || services.length === 0) {
        await broker.cacher.clean(`**`);
        //REPLACE:  await mockCacherClean({broker}, `**`);
    }
}

export const ActionHandlers = {
    clearPackageServices,
    clearPackageServicesMetadatas,
    async get(ctx: any): Promise<any> {
        try {
            return await ctx.broker.cacher.get(ctx.params.key);
        } catch (error) {

        }
        // REPLACE: return await mockCacherGet(ctx, ctx.params.key)
    },
    async mget(ctx: any): Promise<any> {
        try {
            return await mget(ctx, ctx.params.keys);
        } catch (error) {

        }
        // REPLACE: return await mockCacherGet(ctx, ctx.params.key)
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
    async mfilter(ctx: any): Promise<Array<any>> {
        const values = [];
        for (const key of ctx.params.keys) {
            values.push(await query(ctx, key))
        }
        return values
    },
    async add(ctx: any) {
        return await ctx.broker.cacher.set(ctx.params.key, transformMetadata(ctx));
        // REPLACE: return await mockCacherSet(ctx, ctx.params.key, transformMetadata(ctx));
    },
    async madd(ctx) {
        return await mset(ctx, transformMetadatas(ctx));
    },
    async addServiceMetadata(ctx: any) {
        return await addServiceMetadata(ctx);
    },
    async maddServiceMetadata(ctx: any) {
        return await maddServiceMetadata(ctx);
    },
    async fuzzyDelete(ctx: any) {
        const { key } = ctx.params
        const keyPrefix = ctx.broker.cacher?.prefix || "";
        const keys = await redisScanKeys(ctx.broker.cacher.client, `${keyPrefix}${key}`) // await ctx.broker.cacher.client.keys(`${keyPrefix}${key}`);
        for (const _key of keys) {
            await ctx.broker.cacher.del(getKey(_key, keyPrefix));
        }
    },
    async delete(ctx: any) {
        try {
            await ctx.broker.cacher.del(ctx.params.key);
        } catch (error) {
            ctx.broker.logger.info(error.message);
        }
        return true;
    },
    async deleteServiceMetadata(ctx: any) {
        try {
            let { nodeID, serviceName, metadataType, metadataApiName } = ctx.params;
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
            await ctx.broker.cacher.del(key);
        } catch (error) {
            ctx.broker.logger.info(error.message);
        }
        return true;
    },

    async getServiceMetadatas(ctx: any) {
        let { nodeID, serviceName, metadataType, metadataApiName } = ctx.params;
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
        return await query(ctx, key);
    },
    async getServiceMetadata(ctx: any) {
        let { serviceName, metadataType, metadataApiName } = ctx.params;
        const { nodeID } = ctx.meta.caller || { nodeID: undefined };
        if (!nodeID) {
            console.log(`getServiceMetadata ctx.meta`, ctx.meta);
        }
        const key = getServiceMetadataCacherKey(nodeID, serviceName, metadataType, metadataApiName);
        return await ctx.broker.cacher.get(key)
        // REPLACE: return await mockCacherGet(ctx, key);
    },
    async removeServiceMetadata(ctx: any) {
        let { serviceName, metadataType, metadataApiName } = ctx.params;
        const { nodeID } = ctx.meta.caller || { nodeID: undefined };
        if (!nodeID) {
            console.log(`getServiceMetadata ctx.meta`, ctx.meta);
        }
        const key = getServiceMetadataCacherKey(nodeID, serviceName, metadataType, metadataApiName);
        return await ctx.broker.cacher.del(key)
    },
    async refreshServiceMetadatas(ctx: any) {
        const { offlinePackageServices: _offlinePackageServices } = ctx.params || { offlinePackageServices: undefined };
        const offlinePackageServicesListString=[];
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
            await ctx.broker.call('metadata.clearPackageServices', { offlinePackageServicesName: _offlinePackageServices })
            // ctx.broker.broadcast(`$metadata.clearPackageServices`, { offlinePackageServicesName: _offlinePackageServices });
        }
        
        let packageServices = await getPackageServices(ctx);
        const packageServicesName = _.pluck(packageServices, "apiName");

        const lastPackageServices = await getLastPackageServices(ctx);
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
                setPackageServices(ctx, packageServices);
            }, 30 * 1000)
        }

    },

    async lpush(ctx: any) {
        const keyPrefix = ctx.broker.cacher?.prefix || "";
        const key = ctx.params.key;
        const data = ctx.params.data;
        if (!_.isArray(data)) {
            throw new Error('data must be an array.');
        }
        const _data = [];
        _.each(data, (item) => {
            _data.push(JSON.stringify(item))
        })
        return await ctx.broker.cacher.client.lpush(`${keyPrefix}${key}`, ..._data);
    },

    async rpush(ctx: any) {
        const keyPrefix = ctx.broker.cacher?.prefix || "";
        const key = ctx.params.key;
        const data = ctx.params.data;
        if (!_.isArray(data)) {
            throw new Error('data must be an array.');
        }
        const _data = [];
        _.each(data, (item) => {
            _data.push(JSON.stringify(item))
        })
        return await ctx.broker.cacher.client.rpush(`${keyPrefix}${key}`, ..._data);
    },

    async lrange(ctx: any) {
        const keyPrefix = ctx.broker.cacher?.prefix || "";
        const { key, start = 0, end = -1 } = ctx.params.key;
        return await lrange(ctx, `${keyPrefix}${key}`, start, end);
    },

    async filterList(ctx: any) {
        const keyPrefix = ctx.broker.cacher?.prefix || "";
        const { key } = ctx.params;
        const keys = await redisScanKeys(ctx.broker.cacher.client, `${keyPrefix}${key}`);
        if (!keys || keys.length == 0) {
            return [];
        }
        const results = [];
        for (const itemKey of keys) {
            try {
                if (itemKey) {
                    const itemList = await lrange(ctx, itemKey);
                    if (itemList && _.isArray(itemList)) {
                        _.each(itemList, (item) => {
                            results.push(JSON.parse(item));
                        })
                    }
                }
            } catch (error) {
                console.error(`error`, error);
            }
        }
        return results;
    }
};
