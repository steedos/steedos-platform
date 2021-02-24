import { CreateObjectService } from './objectServiceManager';
const clone = require('clone');
// let count = 1;
export async function registerObject(broker, objectConfig) {
    // if(count > 1){
    //     return 
    // }
    // count ++;
	await broker.waitForServices(["steedos-server"]);
    const serviceName = `#${objectConfig.name}`;
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
        CreateObjectService(broker, serviceName, objectConfig);
    }
    return res;
}