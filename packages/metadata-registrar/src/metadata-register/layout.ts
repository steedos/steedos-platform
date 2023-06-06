const clone = require('clone');
const SERVICE_NAME = 'layouts';
export async function registerLayout(broker, serviceName, config) {
    const metadata = clone(config);
    delete metadata.triggers
    const res = await broker.call(`${SERVICE_NAME}.add`, {layoutApiName: metadata._id || metadata.name ,data: metadata}, {meta: {
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

export async function removeLayout(broker, objectLayoutFullName) {
    const res = await broker.call(`${SERVICE_NAME}.delete`, {objectLayoutFullName: objectLayoutFullName});
    return res;
}

export async function getLayout(broker, objectLayoutFullName) {
    const res = await broker.call(`${SERVICE_NAME}.get`, {objectLayoutFullName: objectLayoutFullName});
    return res;
}

export async function getLayouts(broker) {
    const res = await broker.call(`${SERVICE_NAME}.getAll`);
    return res;
}

export async function filterLayouts(broker, profileApiName, spaceId?, objectApiName?){
    const res = await broker.call(`${SERVICE_NAME}.filter`, {
        objectApiName, spaceId, profileApiName
    });
    return res;
}