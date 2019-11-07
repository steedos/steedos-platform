import { SteedosSchema } from "..";
import { getFromContainer } from "typeorm";


export * from "./schema";
export { SteedosDatabaseDriverType, SteedosDataSourceType, SteedosDataSourceTypeConfig } from "./datasource";
export { SteedosObjectType, SteedosObjectTypeConfig } from "./object";
export { SteedosFieldType, SteedosFieldTypeConfig } from "./field";
export { SteedosListenerConfig } from './listeners'
export { SteedosTriggerType } from './trigger'
export { SteedosObjectListViewTypeConfig, SteedosObjectListViewType } from "./list_view";
export { SteedosIDType } from "./field_types";
export { SteedosQueryOptions } from "./query";
export { SteedosObjectPermissionType, SteedosObjectPermissionTypeConfig } from "./object_permission";
export { SteedosActionType, SteedosActionTypeConfig } from './action'
export { SteedosAppType, SteedosAppTypeConfig } from './app'
export { SteedosUserSession, SteedosUserSessionSpace, SteedosUserSessionCompany, SteedosUserSessionOrganization } from './userSession';
export { SteedosQueryFilters } from './query';
export { SteedosReportType, SteedosReportTypeConfig } from './report';
export * from './object_dynamic_load'

export function getSteedosSchema(): SteedosSchema {
    return getFromContainer(SteedosSchema);
}

export function getObject(objectName: string, schema?: SteedosSchema){
    return (schema ? schema : getSteedosSchema()).getObject(objectName);
}

export function getDataSource(datasourceName: string, schema?: SteedosSchema) {
    return (schema ? schema : getSteedosSchema()).getDataSource(datasourceName);
}