import { Dictionary, JsonMap } from '@salesforce/ts-types';
import { SteedosObjectType } from '.';
import _ = require('underscore')

const FIELDTYPES = [
    "text",
    "textarea",
    "html",
    "select",
    "boolean",
    "date",
    "datetime",
    "number",
    "currency",
    "password",
    "lookup",
    "master_detail",
    "grid",
    "url",
    "email",
    "avatar",
    "location",
    "image",
    "object",
    "[object]",
    "[Object]",
    "[grid]",
    "[text]",
    "selectCity",
    "audio",
    "filesize",
    "file",
    "string",
    "function Object() { [native code] }",
    "function String() { [native code] }",
    "code",
    "Object"
]

abstract class SteedosFieldProperties{
    object_name?: string
    name?: string
    type?: string
    label?: string
    is_name?: boolean
    sort_no?: number
    group?: string
    defaultValue?: string | boolean | [] | number
    allowedValues?: string | boolean | []
    multiple?: boolean
    required?: boolean
    is_wide?: boolean
    readonly?: boolean
    hidden?: boolean
    omit?: boolean
    index?: boolean
    searchable?: boolean
    sortable?: boolean
    precision?: number
    scale?: number
    reference_to?: string | []
    rows?: number
    options?: string | []
    description?: string
    filterable?: boolean
    inlineHelpText?: string
    unique?: boolean
    optionsFunction?: any
    min?: number
    max?: number
    blackbox?: boolean
    reference_sort?: JsonMap
    reference_limit?: number
    is_company_only?: boolean
    system?: string;
}

export interface SteedosFieldTypeConfig extends SteedosFieldProperties{

}


export class SteedosFieldType extends SteedosFieldProperties implements Dictionary {
    private _object: SteedosObjectType;
    private _type: any;

    private properties: string[] = ['name']

    constructor(name: string, object: SteedosObjectType, config: SteedosFieldTypeConfig){
        super();
        this._object = object
        _.each(config, (value: any, key: string)=>{
            if(key != 'object'){
                this[key] = value
                this.properties.push(key)
            }
        })
        this.name = name
    }

    toConfig(){
        let config = {}
        this.properties.forEach((property)=>{
            config[property] = this[property]
        })
        return config
    }

    public get object(): SteedosObjectType {
        return this._object;
    }

    public get type(): any {
        return this._type;
    }

    public set type(value: any) {
        let valueStr = String(value)
        if(!_.contains(FIELDTYPES, valueStr)){
            throw new Error(`not find field type ${valueStr}`)
        }
        this._type = value;
    }
}
