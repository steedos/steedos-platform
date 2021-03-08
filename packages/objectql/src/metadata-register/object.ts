import { CreateObjectService } from './objectServiceManager';
import { getObjectServiceName } from '../services/index';
const clone = require('clone');
export async function registerObject(broker, objectConfig) {
    const serviceName = getObjectServiceName(objectConfig.name);
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
    if (res) { //TODO  && objectConfig.hidden != true
       await CreateObjectService(broker, serviceName, objectConfig)
    }
    return res;
}