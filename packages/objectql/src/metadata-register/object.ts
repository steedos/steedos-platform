// import { createObjectService } from './objectServiceManager';
// import { getObjectServiceName } from '../services/index';
const clone = require('clone');
export async function registerObject(broker, serviceName, objectConfig) {
    // const serviceName = getObjectServiceName(objectConfig.name);
    const metadata = clone(objectConfig);
    delete metadata.triggers
    const res = await broker.call("objects.add", {data: metadata}, {meta: {
        caller: {
            nodeID: broker.nodeID,
            service: {
                name: serviceName,
                // version: broker.service.version, TODO
                // fullName: broker.service.fullName, TODO
            }
        }
    }});
    // if (res) { //TODO  && objectConfig.hidden != true
    //    await createObjectService(broker, serviceName, objectConfig)
    // }
    return res;
}

export async function removeObject(broker, objectApiName) {
    // const serviceName = getObjectServiceName(objectConfig.name);
    const res = await broker.call("objects.delete", {objectApiName: objectApiName}, {meta: {
        caller: {
            nodeID: broker.nodeID,
        }
    }});
    return res;
}
