import { Dictionary, JsonMap } from '@salesforce/ts-types';
import { SteedosObjectType } from '.';
import _ = require('underscore')
import { SteedosColumnType } from '../driver';

//TODO 整理字段类型
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
    "lookup",  // "id": 一对一, ["id0","id1"]: 一对多， 需要新增关系表（p, m）, {o:'object_name', ids: ['', '']}：新增关系表(p, o, m)
    "master_detail",
    "grid", // [{},{}] ： 一对多
    "url",
    "email",
    "avatar", //TODO
    "location", //TODO
    "image", //TODO
    "object", // {}：一对一
    "[object]", 
    "[Object]",
    "[grid]", //TODO
    "[text]", // ['string','sring1']
    "selectCity", //TODO
    "audio", //TODO
    "filesize", //TODO
    "file", //TODO
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
    primary?: boolean
    generated?: true | "increment" | "uuid" | "rowid";
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
    reference_to?: string | [] | Function
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
    private _columnType: SteedosColumnType;
    public get columnType(): SteedosColumnType {
        return this._columnType;
    }

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

        if(!this.type && this.blackbox){
            this.type = 'object'
        }

        this.name = name

        this.setColumnType()

    }

    toConfig(){
        let config = {}
        this.properties.forEach((property)=>{
            config[property] = this[property]
        })
        return config
    }

    private setColumnType(){
         switch (this.type) {
             case 'text':
                this._columnType = SteedosColumnType.varchar
                break;
            case 'textarea':
                this._columnType = SteedosColumnType.text
                break;
            case 'select':
                if(this.multiple){
                    this._columnType = SteedosColumnType.array
                }else{
                    this._columnType = SteedosColumnType.varchar
                }
                break;
            case 'boolean':
                this._columnType = SteedosColumnType.boolean
                break;
            case 'date':
                this._columnType = SteedosColumnType.date
                break;
            case 'datetime':
                this._columnType = SteedosColumnType.dateTime
                break;
            case 'number':
                this._columnType = SteedosColumnType.number
                break;
            case 'currency':
                this._columnType = SteedosColumnType.number
                break;
            case 'password':
                this._columnType = SteedosColumnType.varchar
                break;
            case 'lookup':
                let reference_to = this.reference_to
                if(_.isFunction(this.reference_to)){
                    reference_to = this.reference_to()
                }

                if(_.isArray(reference_to)){
                    this._columnType = SteedosColumnType.manyToMany
                }else{
                    if(this.multiple){
                        this._columnType = SteedosColumnType.oneToMany
                    }else{
                        this._columnType = SteedosColumnType.oneToOne
                    }
                }
                break;
            case 'master_detail':
                let reference_to2 = this.reference_to
                if(_.isFunction(this.reference_to)){
                    reference_to2 = this.reference_to()
                }

                if(_.isArray(reference_to2)){
                    this._columnType = SteedosColumnType.manyToMany
                }else{
                    if(this.multiple){
                        this._columnType = SteedosColumnType.manyToOne //TODO
                    }else{
                        this._columnType = SteedosColumnType.oneToOne
                    }
                }
                break;
            case 'grid':
                this._columnType = SteedosColumnType.array
                break;
            case 'url':
                this._columnType = SteedosColumnType.varchar
                break;
            case 'email':
                this._columnType = SteedosColumnType.varchar
                break;
            case 'avatar':
                this._columnType = SteedosColumnType.oneToOne
                break;
            case 'location':
                this._columnType = SteedosColumnType.json
                break;
            case 'image':
                this._columnType = SteedosColumnType.oneToOne
                break;
            case 'object':
                this._columnType = SteedosColumnType.json
                break;
                case 'url':
                this._columnType = SteedosColumnType.varchar
                break;
            case '[object]':
                this._columnType = SteedosColumnType.array
                break;
            case '[Object]':
                this._columnType = SteedosColumnType.array
                break;
            case '[grid]':
                this._columnType = SteedosColumnType.array
                break;
            case '[text]':
                this._columnType = SteedosColumnType.array
                break;
            case 'selectCity':
                this._columnType = SteedosColumnType.json
                break;
            case 'audio':
                this._columnType = SteedosColumnType.oneToOne
                break;
            case 'filesize':
                this._columnType = SteedosColumnType.number
                break;
            case 'file':
                this._columnType = SteedosColumnType.oneToOne
                break;
            case 'string':
                this._columnType = SteedosColumnType.varchar
                break;
            case 'code':
                this._columnType = SteedosColumnType.varchar
                break;
            case 'function Object() { [native code] }':
                this._columnType = SteedosColumnType.json
                break;
            case Object:
                this._columnType = SteedosColumnType.json
                break;
            case 'function String() { [native code] }':
                this._columnType = SteedosColumnType.varchar
                break;
            case String:
                this._columnType = SteedosColumnType.varchar
                break;
            case 'Object':
                this._columnType = SteedosColumnType.json
                break;
            default:
                console.log('this', this)
                throw new Error(`${this.name} invalid field type ${this.type}`)
                break;
         }
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
