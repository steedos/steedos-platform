import { JsonMap } from "@salesforce/ts-types"
import * as _ from 'lodash';
const clone = require('clone');
export class RegisterBase{
    serviceName;
    constructor(serviceName){
        this.serviceName = serviceName;
    }

    getApiName(metadata) {
        return metadata._id || metadata.name;
    }

    async register(broker, packageServiceName, config){
        const metadata = clone(config);
        const res = await broker.call(`${this.serviceName}.add`, { apiName: this.getApiName(metadata), data: metadata }, {
            meta: {
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

    async remove(broker, metadataApiNameOrConfig: string | JsonMap) {
        let metadataApiName = metadataApiNameOrConfig;
        if (_.isObject(metadataApiName)) {
            metadataApiName = this.getApiName(metadataApiNameOrConfig);
        }
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