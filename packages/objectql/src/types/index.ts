import { SteedosSchema } from "..";
import { getFromContainer } from "typeorm";

export { SteedosSchema } from "./schema";
export { SteedosDatabaseDriverType, SteedosDataSourceType, SteedosDataSourceTypeConfig } from "./datasource";
export { SteedosObjectType, SteedosObjectTypeConfig } from "./object";
export { SteedosFieldType, SteedosFieldTypeConfig } from "./field";
export { SteedosListenerConfig } from './listeners'
export { SteedosTriggerType } from './trigger'
export { SteedosObjectListViewTypeConfig, SteedosObjectListViewType } from "./list_view";
export { SteedosIDType } from  "./field_types";
export { SteedosQueryOptions } from "./query";
export { SteedosObjectPermissionType, SteedosObjectPermissionTypeConfig } from "./object_permission";
export { SteedosActionType, SteedosActionTypeConfig} from './action'
export { SteedosAppType, SteedosAppTypeConfig} from './app'
export { SteedosUserSession} from './userSession';
export { SteedosQueryFilters } from './query';
export { SteedosReportType, SteedosReportTypeConfig } from './report';

export function getSteedosSchema(): SteedosSchema {
    return getFromContainer(SteedosSchema);
}