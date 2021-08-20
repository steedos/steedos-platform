const clone = require('clone');
export class RegisterBase{
    serviceName;
    constructor(serviceName){
        this.serviceName = serviceName;
    }

    async register(broker, packageServiceName, config){
        const metadata = clone(config);
        const res = await broker.call(`${this.serviceName}.add`, {apiName: metadata._id || metadata.name ,data: metadata}, {meta: {
            metadataServiceName: packageServiceName,
            caller: {
                nodeID: broker.nodeID,
                service: {
                    name: packageServiceName,
                }
            }
        }});
        return res;
    }

    async remove(broker, metadataApiName){
        const res = await broker.call(`${this.serviceName}.delete`, {fullName: metadataApiName});
        return res;
    }

    async get(broker, metadataApiName){
        const res = await broker.call(`${this.serviceName}.get`, {metadataApiName: metadataApiName});
        return res;
    }

    async getAll(broker){
        const res = await broker.call(`${this.serviceName}.getAll`);
        return res;
    }

    async find(broker, params){
        const res = await broker.call(`${this.serviceName}.filter`, params);
        return res;
    }
}