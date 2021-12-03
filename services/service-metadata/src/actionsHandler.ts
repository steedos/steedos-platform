const SERVICE_METADATA_PREFIX = '$METADATA';
const PACKAGE_SERVICES_KEY = '$PACKAGE-SERVICES';
const PACKAGE_SERVICE_PREFIX = '~packages-';
const METADATA_SERVICES_PERFIX = '$METADATA-SERVICES';
import * as _ from 'underscore';

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

function getKey(key, keyPrefix) {
    return key.replace(keyPrefix, "");
}

function getServiceMetadataCacherKey(serviceName: string, metadataType: string, metadataApiName: string) {
    return `${SERVICE_METADATA_PREFIX}.${serviceName}.${metadataType}.${metadataApiName}`;
}

async function addServiceMetadata(ctx) {
    const { nodeID } = ctx.meta.caller || { nodeID: undefined };
    const { metadataType, metadataApiName, metadataServiceName } = ctx.meta || { metadataType: undefined, metadataApiName: undefined, metadataServiceName: undefined };
    // if(metadataType){
    //     console.log('saveServiceMetadataMap', metadataType, metadataApiName, metadataServiceName )
    // }
    if (!metadataServiceName) {
        return;
    }
    const key = getServiceMetadataCacherKey(metadataServiceName, metadataType, metadataApiName);
    let data = await ctx.broker.cacher.get(key);// REPLACE: await mockCacherGet(ctx, key); 
    let nodeIds = [];
    if (data) {
        if (data.nodeIds) {
            nodeIds = data.nodeIds;
        }
    }
    nodeIds.push(nodeID);

    await ctx.broker.cacher.set(key, {
        nodeIds: nodeIds,
        metadataType,
        metadataApiName,
        metadata: ctx.params.data,
    });
    // REPLACE:
    // await mockCacherSet(ctx, key, {
    //     nodeIds: nodeIds,
    //     metadataType,
    //     metadataApiName,
    //     metadata: ctx.params.data,
    // });
}

// 这里需要更改
async function query(ctx, queryKey) {
    const keyPrefix = ctx.broker.cacher?.prefix || "";
    const keys = await ctx.broker.cacher.client.keys(`${keyPrefix}${queryKey}`); //TODO 此功能仅支持redis cache
    // REPLACE: const keys = await mockCacherKeys(ctx, `${keyPrefix}${queryKey}`) //TODO 此功能仅支持redis cache
    const values = [];
    for (const key of keys) {
        values.push(await ctx.broker.cacher.get(getKey(key, keyPrefix)));
        // REPLACE: values.push(await mockCacherGet(ctx, getKey(key, keyPrefix)));
    }
    return values;
}

function getPackageServiceCacherKey(serviceName) {
    return `${PACKAGE_SERVICES_KEY}.${serviceName}`;
}

async function setPackageServices(ctx, packageServicesName) {
    for await (const packageServiceName of packageServicesName) {
        ctx.broker.cacher.set(getPackageServiceCacherKey(packageServiceName), { service: packageServiceName });
        // REPLACE: await await mockCacherSet(ctx, getPackageServiceCacherKey(packageServiceName), { service: packageServiceName });
    }
}

async function clearPackageServices(ctx, packageServicesName) {
    for await (const packageServiceName of packageServicesName) {
        await ctx.broker.cacher.del(getPackageServiceCacherKey(packageServiceName));
        // REPLACE: await mockCacherDel(ctx, getPackageServiceCacherKey(packageServiceName));
    }
}

async function getLastPackageServices(ctx) {
    const packageServices = await query(ctx, getPackageServiceCacherKey("*"));
    const servicesName = [];
    packageServices.forEach((element) => {
        if (element) {
            servicesName.push(element.service);
        }
    });
    return servicesName;
}

async function getPackageServices(ctx) {
    const servicesName = _.pluck(ctx.broker.registry.getServiceList({ withActions: true }), "name");
    let packageServicesName = _.filter(servicesName, (serviceName) => {
        return serviceName.startsWith(PACKAGE_SERVICE_PREFIX);
    });
    packageServicesName = _.uniq(packageServicesName);
    return packageServicesName;
}

async function clearPackageServiceMetadatas(ctx, packageServiceName) {
    const key = getServiceMetadataCacherKey(packageServiceName, "*", "*");
    const clearMetadatas = await query(ctx, key);
    await ctx.broker.cacher.clean(key);
    // REPLACE: await mockCacherClean(ctx, key);
    return clearMetadatas;
}

async function clearPackageServicesMetadatas(ctx, offlinePackageServices) {
    let clearMetadatas = [];
    for await (const packageServiceName of offlinePackageServices) {
        const clearPackageMetadatas = await clearPackageServiceMetadatas(ctx, packageServiceName);
        clearMetadatas = clearMetadatas.concat(clearPackageMetadatas);
    }
    _.each(_.groupBy(clearMetadatas, "metadataType"), function(data: any, metadataType) {
        ctx.broker.emit(`${SERVICE_METADATA_PREFIX}.${metadataType}.clear`, { metadataType, metadataApiNames: _.pluck(data, "metadataApiName"), isClear: true });
    });
}

async function getMetadataServices(broker) {
    const queryKey = `${METADATA_SERVICES_PERFIX}.*`;
    const keyPrefix = broker.cacher?.prefix || "";
    const keys = await broker.cacher.client.keys(`${keyPrefix}${queryKey}`); //TODO 此功能仅支持redis cache
    // REPLACE: const keys = await mockCacherKeys({broker,}, `${keyPrefix}${queryKey}`) //TODO 此功能仅支持redis cache
    const values = [];
    for (const key of keys) {
        values.push(await broker.cacher.get(getKey(key, keyPrefix)));
        // REPLACE: values.push(await mockCacherGet({ broker }, getKey(key, keyPrefix)));
    }
    return values;
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
    async get(ctx: any): Promise<any> {
        return await ctx.broker.cacher.get(ctx.params.key);
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
    async add(ctx: any) {
        return await ctx.broker.cacher.set(ctx.params.key, transformMetadata(ctx));
        // REPLACE: return await mockCacherSet(ctx, ctx.params.key, transformMetadata(ctx));
    },
    async addServiceMetadata(ctx: any) {
        return await addServiceMetadata(ctx);
    },
    async delete(ctx: any) {
        try {
            await ctx.broker.cacher.del(ctx.params.key);
            // REPLACE: await mockCacherDel(ctx, ctx.params.key);
        } catch (error) {
            ctx.broker.logger.info(error.message);
        }
        return true;
    },
    async getServiceMetadatas(ctx: any) {
        let { serviceName, metadataType, metadataApiName } = ctx.params;
        if (!serviceName) {
            serviceName = "*";
        }
        if (!metadataType) {
            metadataType = "*";
        }
        if (!metadataApiName) {
            metadataApiName = "*";
        }
        const key = getServiceMetadataCacherKey(serviceName, metadataType, metadataApiName);
        return await query(ctx, key);
    },
    async getServiceMetadata(ctx: any) {
        let { serviceName, metadataType, metadataApiName } = ctx.params;
        const key = getServiceMetadataCacherKey(serviceName, metadataType, metadataApiName);
        return await ctx.broker.cacher.get(key)
        // REPLACE: return await mockCacherGet(ctx, key);
    },
    async refreshServiceMetadatas(ctx: any) {
        const { offlinePackageServices: _offlinePackageServices } = ctx.params || { offlinePackageServices: undefined };
        if (_offlinePackageServices && _offlinePackageServices.length > 0) {
            await clearPackageServices(ctx, _offlinePackageServices);
        }
        let packageServices = await getPackageServices(ctx);
        const lastPackageServices = await getLastPackageServices(ctx);
        let offlinePackageServices = _.difference(lastPackageServices, packageServices);
        if (_offlinePackageServices && _offlinePackageServices.length > 0) {
            offlinePackageServices = offlinePackageServices.concat(_offlinePackageServices);
            packageServices = _.difference(lastPackageServices, _offlinePackageServices);
        }
        if (offlinePackageServices.length > 0) {
            await clearPackageServices(ctx, offlinePackageServices);
            await clearPackageServicesMetadatas(ctx, offlinePackageServices);
        }
        await setPackageServices(ctx, packageServices);
    },
};
