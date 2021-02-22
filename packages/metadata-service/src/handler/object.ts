import { Object, MetadataObject } from '../types/object';

export interface IObject{
    add(config: Object): boolean,
    change(newConfig: Object, oldConfig: Object): boolean,
    delete(config: Object): boolean,
    get(objectAPIName): Promise<MetadataObject>
}