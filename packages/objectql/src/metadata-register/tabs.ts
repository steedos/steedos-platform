const clone = require('clone');
const SERVICE_NAME = 'tabs';

/***
 * 此文件内容不再维护，迁移到tab.ts
 */

export async function registerTab(broker, serviceName, config) {
    const metadata = clone(config);
    delete metadata.triggers
    const res = await broker.call(`${SERVICE_NAME}.add`, {tabApiName: metadata.name ,data: metadata}, {meta: {
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

export async function removeTab(broker, tabApiName) {
    const res = await broker.call(`${SERVICE_NAME}.delete`, {tabApiName: tabApiName});
    return res;
}

export async function getTab(broker, tabApiName) {
    const res = await broker.call(`${SERVICE_NAME}.get`, {tabApiName: tabApiName});
    return res;
}

export async function getTabs(broker) {
    const res = await broker.call(`${SERVICE_NAME}.getAll`);
    return res;
}

export async function filterTabs(broker, tabApiName, spaceId?, objectApiName?){
    const res = await broker.call(`${SERVICE_NAME}.filter`, {
        objectApiName, spaceId, tabApiName
    });
    return res;
}