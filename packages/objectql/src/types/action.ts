import { SteedosObjectType } from "./object";
import _ = require('underscore')

export type SteedosActionTypeConfig = {
    _id?: string,
    listenTo?: string | Function,
    name?: string
    label?: string,
    visible?: boolean | Function
    on?: 'list' | 'record' | 'record_more'
    todo?: string | Function
}


export class SteedosActionType {
    private properties: string[] = ['name']
    private _name: string;
    
    private _object: SteedosObjectType;
    
    constructor(name: string, object: SteedosObjectType, config: SteedosActionTypeConfig){
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