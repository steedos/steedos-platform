import { Dictionary, JsonMap } from '@salesforce/ts-types';
import { SteedosObjectType } from '.';


export interface SteedosFieldTypeConfig extends JsonMap {
    name?: string
    type?: string
}


export class SteedosFieldType implements Dictionary {
    _object: SteedosObjectType
    name: string
    type: string

    constructor(name: string, object: SteedosObjectType, config: SteedosFieldTypeConfig){
        this._object = object
        this.name = name
        this.type = config.type
    }

    getObject() {
        return this._object
    }
}
