const clone = require('clone');
export async function registerProfile(broker, serviceName, profileConfig) {
    const metadata = clone(profileConfig);
    delete metadata.triggers
    const res = await broker.call("permissionsets.addProfile", {profileApiName: metadata._id || metadata.name ,data: metadata}, {meta: {
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

export async function getProfile(broker, profileApiName) {
    const res = await broker.call("permissionsets.getProfile", {profileApiName: profileApiName});
    return res;
}

export async function getProfiles(broker) {
    const res = await broker.call("permissionsets.getProfiles");
    return res;
}