import { SObject as SObjectType, MetadataObject } from '../types/object';

export interface ISObject{
    add(ctx: any, config: SObjectType): boolean,
    change(ctx: any, newConfig: SObjectType, oldConfig: SObjectType): boolean,
    delete(ctx: any, config: SObjectType): boolean,
    get(ctx: any, objectAPIName): Promise<MetadataObject>
}

function cacherKey(APIName: string): string{
    return `$steedos.#objects.${APIName}`
}

export class SObject implements ISObject{

    add(ctx: any, config: SObjectType): boolean {
        console.log('set object', config.name);
        ctx.broker.cacher.set(cacherKey(config.name), config);
        return true;
    }
    change(ctx: any, newConfig: SObjectType, oldConfig: SObjectType): boolean {
        if(oldConfig.name != newConfig.name){
            ctx.broker.cacher.del(cacherKey(oldConfig.name))
        }
        ctx.broker.cacher.set(cacherKey(newConfig.name), newConfig)
        return true;
    }
    delete(ctx: any, config: SObjectType): boolean {
        ctx.broker.cacher.del(cacherKey(config.name))
        return true;
    }
    get(ctx: any, objectAPIName: any): Promise<MetadataObject> {
        return ctx.broker.cacher.get(cacherKey(objectAPIName))
    }

}