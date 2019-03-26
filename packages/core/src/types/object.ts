import { Dictionary, JsonMap } from "@salesforce/ts-types";
import { SteedosActionType, SteedosTriggerType, SteedosFieldType, SteedosFieldTypeConfig, SteedosSchema, SteedosListenerConfig, SteedosObjectListViewTypeConfig, SteedosObjectListViewType, SteedosObjectPermissionTypeConfig, SteedosObjectPermissionType, SteedosIDType } from ".";
import _ = require("underscore");
import { SteedosTriggerTypeConfig } from "./trigger";
import { SteedosQueryOptions } from "./query";


abstract class SteedosObjectProperties{
    name?: string
    // extend?: string
    label?: string
    icon?: string
    enable_search?: boolean
    is_enable?: boolean
    enable_files?: boolean
    enable_tasks?: boolean
    enable_notes?: boolean
    enable_events?: boolean
    enable_api?: boolean
    enable_share?: boolean
    enable_instances?: boolean
    enable_chatter?: boolean
    enable_audit?: boolean
    enable_trash?: boolean
    enable_space_global?: boolean
    enable_tree?: boolean
    is_view?: boolean
    hidden?: boolean
    description?: string
    custom?: boolean
    owner?: string
    // triggers?: object
    sidebar?: object //TODO
    calendar?: object //TODO
    actions?: Dictionary<SteedosActionType> //TODO
    fields?: Dictionary<SteedosFieldTypeConfig>
    listeners?: Dictionary<SteedosListenerConfig>
    list_views?: Dictionary<SteedosObjectListViewTypeConfig>
    permissions?: Dictionary<SteedosObjectPermissionTypeConfig>
}


export interface SteedosObjectTypeConfig extends SteedosObjectProperties {
    name?: string
    fields: Dictionary<SteedosFieldTypeConfig>
    actions?: Dictionary<SteedosActionType>
    listeners?: Dictionary<SteedosListenerConfig>
    permission_set?: Dictionary<SteedosObjectPermissionTypeConfig> //TODO remove ; 目前为了兼容现有object的定义保留
}

const _TRIGGERKEYS = ['beforeInsert','beforeUpdate','beforeDelete','afterInsert','afterUpdate','afterDelete']

export class SteedosObjectType extends SteedosObjectProperties {

    private _schema: SteedosSchema;
    private _name: string;
    private _fields: Dictionary<SteedosFieldType> = {};
    private _actions: Dictionary<SteedosActionType> = {};
    private _listeners: Dictionary<SteedosListenerConfig> = {};
    private _triggers: Dictionary<SteedosTriggerType> = {};
    private _list_views: Dictionary<SteedosObjectListViewType> = {};
    private _permissions: Dictionary<SteedosObjectPermissionType> = {};

    constructor(object_name: string, schema: SteedosSchema, config: SteedosObjectTypeConfig) {
        super();
        this._name = object_name
        this._schema = schema

        _.each(config.fields, (field, field_name) => {
            this.setField(field_name, field)
        })
        
        this._actions = config.actions

        _.each(config.listeners, (listener, listener_name) => {
            this.setListener(listener_name, listener)
        })

        _.each(config.list_views, (list_view, name) => {
            this.setListView(name, list_view)
        })

        _.each(config.permissions, (permission_set, name) => {
            this.setPermissionSet(name, permission_set)
        })

        //TODO remove ; 目前为了兼容现有object的定义保留
        _.each(config.permission_set, (permission_set, name) => {
            this.setPermissionSet(name, permission_set)
        })
    }

    getPermission(permission_name: string): SteedosObjectPermissionType{
        return this._permissions[permission_name]
    }
    
    getPermissions(): Dictionary<SteedosObjectPermissionType> {
        return this._permissions;
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

    setListView(list_view_name: string, config: SteedosObjectListViewTypeConfig){
        this.list_views[list_view_name] = new SteedosObjectListViewType(list_view_name, this, config)
    }

    setPermissionSet(permission_set_name: string, config: SteedosObjectPermissionTypeConfig){
        this._permissions[permission_set_name] = new SteedosObjectPermissionType(permission_set_name, this, config)
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

    async find(query: SteedosQueryOptions){
        return await this.schema.getDataSource().find(this.name, query)
    }

    async findOne(id: SteedosIDType, query: SteedosQueryOptions){
        return await this.schema.getDataSource().findOne(this.name,  id, query)
    }

    async insert(doc: JsonMap){
        return await this.schema.getDataSource().insert(this.name, doc)
    }

    async update(id: SteedosIDType, doc: JsonMap){
        return await this.schema.getDataSource().update(this.name,  id, doc)
    }

    async delete(id: SteedosIDType){
        return await this.schema.getDataSource().delete(this.name,  id)
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

    public get list_views(): Dictionary<SteedosObjectListViewType> {
        return this._list_views;
    }
}
