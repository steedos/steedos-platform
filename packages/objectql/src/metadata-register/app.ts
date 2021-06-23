const clone = require('clone');
export async function registerApp(broker, serviceName, appConfig) {
    const metadata = clone(appConfig);
    delete metadata.triggers
    const res = await broker.call("apps.add", {appApiName: metadata._id || metadata.name ,data: metadata}, {meta: {
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

export async function removeApp(broker, appApiName) {
    const res = await broker.call("apps.delete", {appApiName: appApiName});
    return res;
}

export async function getApp(broker, appApiName) {
    const res = await broker.call("apps.get", {appApiName: appApiName});
    return res;
}

export async function getApps(broker) {
    const res = await broker.call("apps.getAll");
    return res;
}