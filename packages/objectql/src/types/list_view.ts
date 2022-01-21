import { SteedosObjectType } from ".";
import _ = require('underscore')

abstract class SteedosObjectListViewTypeProperties{
    abstract name?: string
    label?: string
    type?: string
    filter_scope?: string
    columns?: []
    filters?: []
    filter_fields?: []
    sort?: []
}

export interface SteedosObjectListViewTypeConfig extends SteedosObjectListViewTypeProperties{}

export class SteedosObjectListViewType extends SteedosObjectListViewTypeProperties{
    private _name: string;
    
    private _object: SteedosObjectType;

    private properties: string[] = ['name']

    constructor(name: string, object: SteedosObjectType, config: SteedosObjectListViewTypeConfig){
        super()
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

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get object(): SteedosObjectType {
        return this._object;
    }
}