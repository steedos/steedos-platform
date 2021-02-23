import { CreateObjectService } from './objectServiceManager';
// let count = 1;
export async function registerObject(broker, objectConfig) {
    // if(count > 1){
    //     return 
    // }
    // count ++;
	await broker.waitForServices(["steedos-server"]);
    console.log('call objects.add', `#${objectConfig.name}`);
    const res = await broker.call("objects.add", objectConfig);
    if (res && objectConfig.hidden != true) {
        CreateObjectService(broker, objectConfig);
    }
    return res;
}