import { Dictionary, JsonMap } from '@salesforce/ts-types';
import { SteedosObjectType } from '.';


export interface SteedosFieldTypeConfig extends JsonMap {
    name?: string
    type?: string
}


export class SteedosFieldType implements Dictionary {
    _object: SteedosObjectType
    _name: string

    constructor(name: string, object: SteedosObjectType, config: SteedosFieldTypeConfig){
        this._object = object
        this._name = name
    }
}
