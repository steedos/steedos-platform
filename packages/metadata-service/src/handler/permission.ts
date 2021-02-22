import { Permission, MetadataPermission } from '../types/permission';
export interface IPermission{
    add(config: Permission): boolean,
    change(newConfig: Permission, oldConfig: Permission): boolean,
    delete(config: Permission): boolean,
    getPermissions(objectAPIName): Promise<Array<MetadataPermission>>
}