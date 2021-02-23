import { SObject as SObjectType, MetadataObject } from '../types/object';

export interface ISObject{
    add(broker: any, config: SObjectType): boolean,
    change(broker: any, newConfig: SObjectType, oldConfig: SObjectType): boolean,
    delete(broker: any, config: SObjectType): boolean,
    get(broker: any, objectAPIName): Promise<MetadataObject>
}


export class SObject implements ISObject{
    add(broker: any, config: SObjectType): boolean {
        console.log('set object', config.name);
        broker.cacher.set(`$steedos.#objects.${config.name}`, config);
        return true;
    }
    change(broker: any, newConfig: SObjectType, oldConfig: SObjectType): boolean {
        if(oldConfig.name != newConfig.name){
            broker.cacher.del(`$steedos.#objects.${oldConfig.name}`)
        }
        broker.cacher.set(`$steedos.#objects.${newConfig.name}`, newConfig)
        return true;
    }
    delete(broker: any, config: SObjectType): boolean {
        broker.cacher.del(`$steedos.#objects.${config.name}`)
        return true;
    }
    get(broker: any, objectAPIName: any): Promise<MetadataObject> {
        console.log('get object', objectAPIName);
        return broker.cacher.get(`$steedos.#objects.${objectAPIName}`)
    }

}