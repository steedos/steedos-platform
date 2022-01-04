const clone = require('clone');
export async function registerPermissionset(broker, serviceName, permissionsetConfig) {
    const metadata = clone(permissionsetConfig);
    delete metadata.triggers
    const res = await broker.call("permissionsets.add", {permissionsetApiName: metadata._id || metadata.name ,data: metadata}, {meta: {
        metadataServiceName: serviceName,
        caller: {
            nodeID: broker.nodeID,
            service: {
                name: serviceName,
            }
        }
    }});
    return res;
}

export async function getPermissionset(broker, permissionsetApiName) {
    const res = await broker.call("permissionsets.get", {permissionsetApiName: permissionsetApiName});
    return res;
}

export async function getPermissionsets(broker) {
    const res = await broker.call("permissionsets.getAll");
    return res;
}