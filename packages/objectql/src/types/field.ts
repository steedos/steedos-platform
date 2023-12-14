import { Dictionary, JsonMap } from '@salesforce/ts-types';
import { SteedosObjectType } from '.';
import _ = require('underscore')
import { SteedosFieldDBType } from '../driver';
import { SteedosDataSourceType } from './datasource';
import { SteedosQueryFilters } from './query';

//TODO 整理字段类型
const FIELDTYPES = [
    "text",
    "textarea",
    "html",
    "select",
    "color",
    "boolean",
    "toggle",
    "date",
    "datetime",
    "time",
    "number",
    "currency",
    "password",
    "lookup",  // "id": 一对一, ["id0","id1"]: 一对多， 需要新增关系表（p, m）, {o:'object_name', ids: ['', '']}：新增关系表(p, o, m)
    "master_detail",
    "grid", // [{},{}] ： 一对多
    "table", // [{},{}] ： 一对多
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
    "Object",
    "autonumber",
    "markdown",
    "formula",
    "summary",
    "percent"
]

abstract class SteedosFieldProperties{
    _id?: string
    object_name?: string
    name?: string
    column_name?: string
    abstract type?: string
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
    reference_to_field?: string
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
    is_company_limited?: boolean
    system?: string;
    abstract fieldDBType: SteedosFieldDBType | string
    formula?: string
    data_type?: string
    formula_blank_value?: string
    summary_object?: string
    summary_type?: string
    summary_field?: string
    summary_filters?: SteedosQueryFilters
    filters?: SteedosQueryFilters
}

export interface SteedosFieldTypeConfig extends SteedosFieldProperties{

}


export class SteedosFieldType extends SteedosFieldProperties implements Dictionary {
    [key: string]: unknown;
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

        if(this.type === "formula" && !this.data_type){
            throw new Error(`${this._object.name}.${this.name} invalid field type formula, miss data_type property`)
        }

        this.setDBType()

        if(this.generated){
            this.omit = true
            this.properties.push('omit')
        }
    }

    getIndexInfo = ()=>{
        let indexName = this.getIndexName();
        const defaultIndexFieldTypes = ['lookup', 'master_detail', 'autonumber', 'location']
        if(this.index || this.unique || defaultIndexFieldTypes.includes(this.type)){
            let index = {}; 
            let indexValue: any =  null;
            let sparse = false;
            let partialFilterExpression: object;
            if (this.index) {
                indexValue = this.index;
                if (indexValue === true){
                    indexValue = 1;
                }
            } else {
                indexValue = 1;
            }
            var idxFieldName = this.name.replace(/\.\$\./g, ".");
            if ('location' === this.type) {
                indexValue = '2dsphere';
                idxFieldName = `${idxFieldName}.wgs84`
                indexName = `${indexName}_wgs84`
            }
            index[idxFieldName] = indexValue;
            let unique = !!this.unique && (indexValue === 1 || indexValue === -1);
            if (unique && 'space' != idxFieldName) {
                index['space'] = 1; // 工作区唯一
                partialFilterExpression = { [idxFieldName]: { $exists: true } }; // 创建部分索引
            }
            return {
                key: index, 
                name: indexName,
                unique: unique,
                sparse: sparse,
                background: true, //兼容4.2之前的数据库版本
                partialFilterExpression
            }
        }
    }

    getIndexName = ()=>{
        return 'c2_' + this.name;
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
            if(datasource.name != 'meteor'){
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

    private getDBType(type: any): SteedosFieldDBType{
        switch (type) {
            case 'text':
               return SteedosFieldDBType.varchar
           case 'textarea':
               return SteedosFieldDBType.text
           case 'html':
               return SteedosFieldDBType.text
           case 'select':
               if(this.multiple){
                   return SteedosFieldDBType.varchar
               }else{
                   return SteedosFieldDBType.varchar
               }
           case 'color':
               return SteedosFieldDBType.text
           case 'boolean':
               return SteedosFieldDBType.boolean
           case 'toggle':
               return SteedosFieldDBType.boolean
           case 'date':
               return SteedosFieldDBType.date
           case 'datetime':
               return SteedosFieldDBType.dateTime
           case 'time':
               return SteedosFieldDBType.dateTime
           case 'number':
               return SteedosFieldDBType.number
           case 'currency':
               if(!this.scale && this.scale != 0){
                   this.scale = 2
               }
               return SteedosFieldDBType.number
           case 'password':
               return SteedosFieldDBType.varchar
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
               return SteedosFieldDBType.varchar
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
               return SteedosFieldDBType.varchar
           case 'grid':
               return SteedosFieldDBType.array
           case 'table':
               return SteedosFieldDBType.array
           case 'url':
               return SteedosFieldDBType.varchar
           case 'email':
               return SteedosFieldDBType.varchar
           case 'avatar':
               return SteedosFieldDBType.varchar
           case 'location':
               return SteedosFieldDBType.json
           case 'image':
               return SteedosFieldDBType.varchar
           case 'object':
               return SteedosFieldDBType.json
               case 'url':
               return SteedosFieldDBType.varchar
           case '[object]':
               return SteedosFieldDBType.array
           case '[Object]':
               return SteedosFieldDBType.array
           case '[grid]':
               return SteedosFieldDBType.array
           case '[text]':
               return SteedosFieldDBType.array
           case 'selectCity':
               return SteedosFieldDBType.json
           case 'audio':
               return SteedosFieldDBType.varchar
           case 'filesize':
               return SteedosFieldDBType.number
           case 'file':
               return SteedosFieldDBType.varchar
           case 'string':
               return SteedosFieldDBType.varchar
           case 'code':
               return SteedosFieldDBType.varchar
           case 'function Object() { [native code] }':
               return SteedosFieldDBType.json
           case Object:
               return SteedosFieldDBType.json
           case 'function String() { [native code] }':
               return SteedosFieldDBType.varchar
           case String:
               return SteedosFieldDBType.varchar
           case 'Object':
               return SteedosFieldDBType.json
           case 'autonumber':
               return SteedosFieldDBType.varchar
           case 'markdown':
               return SteedosFieldDBType.varchar
           case 'formula':
               return this.getDBType(this.data_type);
           case 'summary':
                //汇总不需要check类型
                return SteedosFieldDBType.varchar;
           case 'percent':
                //百分比字段按数值类型处理
                return this.getDBType("number");
           default:
               throw new Error(`${this._object.name}.${this.name} invalid field type ${type}`)
        }
    }

    private setDBType(){
        if(this.fieldDBType){
            return;
        }
        this._fieldDBType = this.getDBType(this.type);
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
