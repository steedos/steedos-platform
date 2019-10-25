import { JsonMap } from '@salesforce/ts-types';
import { SteedosDataSourceType } from '.';
import _ = require('underscore');
export type SteedosAppTypeConfig = {
    _id: string,
    name: string,
    description: string,
    icon_slds: string,
    objects: string[],
    mobile_objects?: string[]
}

export class SteedosAppType{
    private _datasource: SteedosDataSourceType;
    public get datasource(): SteedosDataSourceType {
        return this._datasource;
    }
    private __id: string;
    public get _id(): string {
        return this.__id;
    }
    public set _id(value: string) {
        this.__id = value;
    }
    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    private _description: string;
    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
        this._description = value;
    }
    private _icon_slds: string;
    public get icon_slds(): string {
        return this._icon_slds;
    }
    public set icon_slds(value: string) {
        this._icon_slds = value;
    }
    private _objects: string[];
    public get objects(): string[] {
        return this._objects;
    }
    public set objects(value: string[]) {
        this._objects = value;
    }

    private _is_creator: boolean;
    public get is_creator(): boolean {
        return this._is_creator;
    }

    private _mobile_objects: string[];
    public get mobile_objects(): string[] {
        return this._mobile_objects;
    }
    public set mobile_objects(value: string[]) {
        this._mobile_objects = value;
    }

    private properties: string[] = []
    
    constructor(config: SteedosAppTypeConfig, datasource: SteedosDataSourceType){
        this._datasource = datasource
        this._is_creator = true
        this._id = config._id
        _.each(config, (value: any, key: string)=>{
            this[key] = value
            this.properties.push(key)
        })
        // this.name = config.name
        // this.description = config.description
        // this.icon_slds = config.icon_slds
        // this.objects = config.objects
        // this.mobile_objects = config.mobile_objects
    }

    toConfig(){
        let config = {}
        this.properties.forEach((property)=>{
            config[property] = this[property]
        })
        return config
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
        let datasource = this._datasource;
        if(datasource.name != 'default'){
            if(_.isArray(this.objects)){
                let objects: string[] = []
                _.each(this.objects, (object_name)=>{
                    objects.push(this.transformReferenceTo(object_name, datasource))
                })
                this.objects = objects;
            }
        }
    }
}