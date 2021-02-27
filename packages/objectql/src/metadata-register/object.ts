import { CreateObjectService } from './objectServiceManager';
const clone = require('clone');
// let count = 0;
export async function registerObject(broker, objectConfig) {
    // if(count > 10){
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
        //如果此处用await ，则会导致控制台抛错  objects.add 超时
       CreateObjectService(broker, serviceName, objectConfig).then((res)=>{
        console.log('CreateObjectService---', serviceName);
       })
    }
    return res;
}