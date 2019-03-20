import { JsonMap } from '@salesforce/ts-types';
export interface Field extends JsonMap {
    name: string;
    object_name: string;
}