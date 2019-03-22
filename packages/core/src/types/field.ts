import { Dictionary, JsonMap } from '@salesforce/ts-types';
import { SteedosObjectType } from '.';

var _ = require('underscore')

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
    "audio"
]

abstract class SteedosFieldProperty{
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

export interface SteedosFieldTypeConfig extends SteedosFieldProperty{

}


export class SteedosFieldType extends SteedosFieldProperty implements Dictionary {
    private _object: SteedosObjectType;
    private _type: string;

    constructor(name: string, object: SteedosObjectType, config: SteedosFieldTypeConfig){
        super();
        this._object = object
        _.each(config, (v, k)=>{
            this[k] = v
        })
        this.name = name
    }

    public get object(): SteedosObjectType {
        return this._object;
    }

    public get type(): string {
        return this._type;
    }

    public set type(value: string) {
        if(!_.contains(FIELDTYPES, value)){
            throw new Error(`not find field type ${value}`)
        }
        this._type = value;
    }
}
