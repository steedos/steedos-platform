import { Dictionary } from '@salesforce/ts-types';

export class SteedosTriggerType implements Dictionary {
    name: string
}

export class SteedosActionType implements Dictionary {
    name: string
}

export { SteedosDataSourceType } from "./datasource";
export { SteedosObjectType } from "./object";
export { SteedosFieldType } from "./field";
export { SteedosSchema } from "./schema";