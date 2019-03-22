import { Dictionary } from '@salesforce/ts-types';

export class SteedosTriggerType implements Dictionary {
    name: string
}

export class SteedosActionType implements Dictionary {
    name: string
}

export { SteedosDataSourceType, SteedosDataSourceTypeConfig } from "./datasource";
export { SteedosObjectType, SteedosObjectTypeConfig } from "./object";
export { SteedosFieldType, SteedosFieldTypeConfig } from "./field";
export { SteedosSchema } from "./schema";

export { SteedosIDType } from  "./field_types";