import { SteedosObjectType } from ".";
import _ = require('underscore')

export type SteedosObjectPermissionSetTypeConfig = {
    name?: string
    allowRead?: boolean
    allowCreate?: boolean
    allowEdit?: boolean
    allowDelete?: boolean
    viewAllRecords?: boolean
    modifyAllRecords?: boolean
    viewCompanyRecords?: boolean
    modifyCompanyRecords?: boolean
    disabled_list_views?: []
    disabled_actions?: []
    unreadable_fields?: []
    uneditable_fields?: []
    unrelated_objects?: []
}

export class SteedosObjectPermissionSetType{
    private _name: string;
    
    private _object: SteedosObjectType;

    private properties: string[] = ['name']
    
    constructor(name: string, object: SteedosObjectType, config: SteedosObjectPermissionSetTypeConfig){
        
        this.object = object
        
        _.each(config, (value: any, key: string)=>{
            this[key] = value
            this.properties.push(key)
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

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get object(): SteedosObjectType {
        return this._object;
    }
    public set object(value: SteedosObjectType) {
        this._object = value;
    }
}