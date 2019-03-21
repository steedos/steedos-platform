import { Dictionary } from '@salesforce/ts-types';

export class SteedosDataSourceType implements Dictionary {
    name: string
}

export class SteedosTriggerType implements Dictionary {
    name: string
}

export class SteedosActionType implements Dictionary {
    name: string
}

export { SteedosObjectType } from "./object";
export { SteedosFieldType } from "./field";
export { SteedosSchema } from "./schema";