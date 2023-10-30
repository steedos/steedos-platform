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

    async mregister(broker, packageServiceName, configs) {
        const metadatas = clone(configs);

        const mdata = {};

        _.map(metadatas, (metadata) => {
            mdata[this.getApiName(metadata)] = metadata
        })

        const res = await broker.call(`${this.serviceName}.madd`, { data: mdata }, {
            meta: {
                metadataServiceName: packageServiceName,
                caller: {
                    nodeID: broker.nodeID,
                    service: {
                        name: packageServiceName,
                    }
                }
            }
        });
        return res;
    }

    async remove(broker, packageServiceName, metadataApiNameOrConfig: string | JsonMap) {
        let metadataApiName = metadataApiNameOrConfig;
        if (_.isObject(metadataApiName)) {
            metadataApiName = this.getApiName(metadataApiNameOrConfig);
        }
        const res = await broker.call(`${this.serviceName}.delete`, { apiName: metadataApiName }, {
            meta: {
                metadataServiceName: packageServiceName,
                caller: {
                    nodeID: broker.nodeID,
                    service: {
                        name: packageServiceName,
                    }
                }
            }
        });
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