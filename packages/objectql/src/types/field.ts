import { Dictionary, JsonMap } from '@salesforce/ts-types';
import { SteedosObjectType } from '.';
import _ = require('underscore')
import { SteedosFieldDBType } from '../driver';
import { SteedosDataSourceType } from './datasource';

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
    generated?: true
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
    reference_to?: string | string[] | Function
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
    fieldDBType?: SteedosFieldDBType | string
}

export interface SteedosFieldTypeConfig extends SteedosFieldProperties{

}


export class SteedosFieldType extends SteedosFieldProperties implements Dictionary {
    private _object: SteedosObjectType;
    private _type: any;
    private _fieldDBType: SteedosFieldDBType;
    public get fieldDBType(): SteedosFieldDBType {
        return this._fieldDBType;
    }
    public set fieldDBType(value: SteedosFieldDBType) {
        this._fieldDBType = value;
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

        this.setDBType()

        if(this.generated){
            this.omit = true
            this.properties.push('omit')
        }
    }

    private transformReferenceTo(reference_to: string, datasource: SteedosDataSourceType): string{
        if(_.isString(reference_to)){
            if(reference_to.split('.').length = 1){
                if(datasource.getObject(reference_to)){
                    return `${datasource.name}.${reference_to}`
                }
            }
        }
        return reference_to
    }

    transformReferenceOfObject(){
        if(this.reference_to){
            let datasource = this._object.datasource
            if(datasource.name != 'default'){
                if(_.isString(this.reference_to)){
                    this.reference_to = this.transformReferenceTo(this.reference_to, datasource)
                }else if(_.isArray(this.reference_to)){
                    let reference_to: string[] = []
                    _.each(this.reference_to, (_reference_to)=>{
                        reference_to.push(this.transformReferenceTo(_reference_to, datasource))
                    })
                    this.reference_to = reference_to
                }else if(_.isFunction(this.reference_to)){
                    //TODO
                }
            }
        }
    }

    toConfig(){
        let config = {}
        this.properties.forEach((property)=>{
            config[property] = this[property]
        })
        return config
    }

    private setDBType(){
        if(this.fieldDBType){
            return;
        }
         switch (this.type) {
             case 'text':
                this._fieldDBType = SteedosFieldDBType.varchar
                break;
            case 'textarea':
                this._fieldDBType = SteedosFieldDBType.text
                break;
            case 'select':
                if(this.multiple){
                    this._fieldDBType = SteedosFieldDBType.array
                }else{
                    this._fieldDBType = SteedosFieldDBType.varchar
                }
                break;
            case 'boolean':
                this._fieldDBType = SteedosFieldDBType.boolean
                break;
            case 'date':
                this._fieldDBType = SteedosFieldDBType.date
                break;
            case 'datetime':
                this._fieldDBType = SteedosFieldDBType.dateTime
                break;
            case 'number':
                this._fieldDBType = SteedosFieldDBType.number
                break;
            case 'currency':
                if(!this.scale && this.scale != 0){
                    this.scale = 2 
                }
                this._fieldDBType = SteedosFieldDBType.number
                break;
            case 'password':
                this._fieldDBType = SteedosFieldDBType.varchar
                break;
            case 'lookup':
                // let reference_to = this.reference_to
                // if(_.isFunction(this.reference_to)){
                //     reference_to = this.reference_to()
                // }

                // if(_.isArray(reference_to)){
                //     this._columnType = SteedosColumnType.manyToMany
                // }else{
                //     if(this.multiple){
                //         this._columnType = SteedosColumnType.oneToMany
                //     }else{
                //         this._columnType = SteedosColumnType.oneToOne
                //     }
                // }
                this._fieldDBType = SteedosFieldDBType.varchar
                break;
            case 'master_detail':
                // let reference_to2 = this.reference_to
                // if(_.isFunction(this.reference_to)){
                //     reference_to2 = this.reference_to()
                // }

                // if(_.isArray(reference_to2)){
                //     this._columnType = SteedosColumnType.manyToMany
                // }else{
                //     if(this.multiple){
                //         this._columnType = SteedosColumnType.manyToOne //TODO
                //     }else{
                //         this._columnType = SteedosColumnType.oneToOne
                //     }
                // }
                this._fieldDBType = SteedosFieldDBType.varchar
                break;
            case 'grid':
                this._fieldDBType = SteedosFieldDBType.array
                break;
            case 'url':
                this._fieldDBType = SteedosFieldDBType.varchar
                break;
            case 'email':
                this._fieldDBType = SteedosFieldDBType.varchar
                break;
            case 'avatar':
                this._fieldDBType = SteedosFieldDBType.varchar
                break;
            case 'location':
                this._fieldDBType = SteedosFieldDBType.json
                break;
            case 'image':
                this._fieldDBType = SteedosFieldDBType.varchar
                break;
            case 'object':
                this._fieldDBType = SteedosFieldDBType.json
                break;
                case 'url':
                this._fieldDBType = SteedosFieldDBType.varchar
                break;
            case '[object]':
                this._fieldDBType = SteedosFieldDBType.array
                break;
            case '[Object]':
                this._fieldDBType = SteedosFieldDBType.array
                break;
            case '[grid]':
                this._fieldDBType = SteedosFieldDBType.array
                break;
            case '[text]':
                this._fieldDBType = SteedosFieldDBType.array
                break;
            case 'selectCity':
                this._fieldDBType = SteedosFieldDBType.json
                break;
            case 'audio':
                this._fieldDBType = SteedosFieldDBType.varchar
                break;
            case 'filesize':
                this._fieldDBType = SteedosFieldDBType.number
                break;
            case 'file':
                this._fieldDBType = SteedosFieldDBType.varchar
                break;
            case 'string':
                this._fieldDBType = SteedosFieldDBType.varchar
                break;
            case 'code':
                this._fieldDBType = SteedosFieldDBType.varchar
                break;
            case 'function Object() { [native code] }':
                this._fieldDBType = SteedosFieldDBType.json
                break;
            case Object:
                this._fieldDBType = SteedosFieldDBType.json
                break;
            case 'function String() { [native code] }':
                this._fieldDBType = SteedosFieldDBType.varchar
                break;
            case String:
                this._fieldDBType = SteedosFieldDBType.varchar
                break;
            case 'Object':
                this._fieldDBType = SteedosFieldDBType.json
                break;
            default:
                throw new Error(`${this._object.name}.${this.name} invalid field type ${this.type}`)
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
