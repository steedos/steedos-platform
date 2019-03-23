import { Dictionary, JsonMap } from "@salesforce/ts-types";
import { SteedosActionType, SteedosTriggerType, SteedosFieldType, SteedosFieldTypeConfig, SteedosSchema, SteedosListenerConfig } from ".";
import _ = require("underscore");
import { SteedosTriggerTypeConfig } from "./trigger";


export type SteedosObjectTypeConfig = {
    name?: string
    fields: Dictionary<SteedosFieldTypeConfig>
    actions?: Dictionary<SteedosActionType>
    listeners?: Dictionary<SteedosListenerConfig>
}

const _TRIGGERKEYS = ['beforeInsert','beforeUpdate','beforeDelete','afterInsert','afterUpdate','afterDelete']

export class SteedosObjectType {

    private _schema: SteedosSchema;
    private _name: string;
    private _fields: Dictionary<SteedosFieldType> = {};
    private _actions: Dictionary<SteedosActionType> = {};
    private _listeners: Dictionary<SteedosListenerConfig> = {};
    private _triggers: Dictionary<SteedosTriggerType> = {};
    

    constructor(object_name: string, schema: SteedosSchema, config: SteedosObjectTypeConfig) {
        this._name = object_name
        this._schema = schema

        _.each(config.fields, (field, field_name) => {
            this.setField(field_name, field)
        })

        
        this._actions = config.actions

        _.each(config.listeners, (listener, listener_name) => {
            this.setListener(listener_name, listener)
        })
    }

    setListener(listener_name: string, config: SteedosListenerConfig){
        this.listeners[listener_name] = config
        let object_name = this.name
        _TRIGGERKEYS.forEach((key)=>{
            let event = config[key];
            if(_.isFunction(event)){
                let todoWrapper = function(){
                    this.object_name = object_name
                    Object.setPrototypeOf(this, Object.getPrototypeOf(config))
                    return event.apply(this, arguments)
                }
                this.setTrigger(`${listener_name}_${event.name}`, event.name ,todoWrapper);
            }
        })
    }

    private setTrigger(name: string, when: string , todo: Function,on= 'server'){
        let triggerConfig: SteedosTriggerTypeConfig = {
            name: name,
            on: on,
            when: when,
            todo: todo
        }
        let trigger = new SteedosTriggerType(triggerConfig)
        this.triggers[name] = trigger
    }

    toConfig(){
        let config: JsonMap = {
            name: this.name,
            fields: {}
        }
        if(this.fields){
            config.fields = {}
            _.each(this.fields, (field: SteedosFieldType, key: string)=>{
                config.fields[key] = field.toConfig();
            })
        }

        // if(this.triggers){
        //     config.triggers = {}
        //     _.each(this.fields, (field: SteedosFieldType, key: string)=>{
        //         config.fields[key] = field.toConfig();
        //     })
        // }

        return config
    }

    setField(field_name: string, fieldConfig: SteedosFieldTypeConfig) {
        let field = new SteedosFieldType(field_name, this, fieldConfig)
        this.fields[field_name] = field
    }

    getField(field_name: string) {
        return this.fields[field_name]
    }

    extend(config: SteedosObjectTypeConfig) {
        if (this.name != config.name)
            throw new Error("You can not extend on different object");

        // override each fields
        _.each(config.fields, (field, field_name) => {
            this.setField(field_name, field)
        })

        // override each actions
        if (config.actions) {
            _.each(config.actions, (action) => {
                this.actions[action.name] = action
            })
        }

        // override each triggers
        // if (config.triggers) {
        //     _.each(config.triggers, (trigger) => {
        //         this.triggers[trigger.name] = trigger
        //     })
        // }
    }

    getRepository() {

    }

    /***** get/set *****/
    public get schema(): SteedosSchema {
        return this._schema;
    }

    public get name(): string {
        return this._name;
    }
    

    public get fields(): Dictionary<SteedosFieldType> {
        return this._fields;
    }
    
    public get actions(): Dictionary<SteedosActionType> {
        return this._actions;
    }
    
    public get triggers(): Dictionary<SteedosTriggerType> {
        return this._triggers;
    }

    public get listeners(): Dictionary<SteedosListenerConfig> {
        return this._listeners;
    }
    public set listeners(value: Dictionary<SteedosListenerConfig>) {
        this._listeners = value;
    }
}
