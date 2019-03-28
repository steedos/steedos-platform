import { Dictionary } from '@salesforce/ts-types';

export class SteedosActionType implements Dictionary {
    name: string
}

export { SteedosSchema } from "./schema";
export { SteedosDataSourceType, SteedosDataSourceTypeConfig } from "./datasource";
export { SteedosObjectType, SteedosObjectTypeConfig } from "./object";
export { SteedosFieldType, SteedosFieldTypeConfig } from "./field";
export { SteedosListenerConfig } from './listeners'
export { SteedosTriggerType } from './trigger'
export { SteedosObjectListViewTypeConfig, SteedosObjectListViewType } from "./list_view";
export { SteedosIDType } from  "./field_types";
export { SteedosQueryOptions } from "./query";
export { SteedosObjectPermissionType, SteedosObjectPermissionTypeConfig } from "./object_permission";
