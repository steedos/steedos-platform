import { Dictionary, JsonMap } from "@salesforce/ts-types";
import { SteedosActionType, SteedosTriggerType, SteedosFieldType, SteedosFieldTypeConfig, SteedosSchema, SteedosListenerConfig, SteedosObjectListViewTypeConfig, SteedosObjectListViewType, SteedosIDType, SteedosObjectPermissionTypeConfig } from ".";
import _ = require("underscore");
import { SteedosTriggerTypeConfig } from "./trigger";
import { SteedosQueryOptions } from "./query";
import { SteedosDataSourceType } from "./datasource";


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
    private _datasource: SteedosDataSourceType;
    private _name: string;
    private _fields: Dictionary<SteedosFieldType> = {};
    private _actions: Dictionary<SteedosActionType> = {};
    private _listeners: Dictionary<SteedosListenerConfig> = {};
    private _triggers: Dictionary<SteedosTriggerType> = {};
    private _list_views: Dictionary<SteedosObjectListViewType> = {};

    constructor(object_name: string, datasource: SteedosDataSourceType, config: SteedosObjectTypeConfig) {
        super();
        this._name = object_name
        this._datasource = datasource
        this._schema = datasource.schema

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

        _.each(config.permissions, (permission, name) => {
            permission.name =name
            this.setPermission(permission)
        })

        //TODO remove ; 目前为了兼容现有object的定义保留
        _.each(config.permission_set, (permission, name) => {
            permission.name =name
            this.setPermission(permission)
        })
    }

    setPermission(config: SteedosObjectPermissionTypeConfig){
        this._schema.setObjectPermission(this._name, config)
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
    
    getObjectRolesPermission(){
        return this._schema.getObjectPermissions(this._name)
    }

    async getUserObjectPermission(userId: SteedosIDType){
        let roles = await this.schema.getRoles(userId)
        let objectRolesPermission = this.getObjectRolesPermission()

        let userObjectPermission = {
            allowRead: false,
            allowCreate: false,
            allowEdit: false,
            allowDelete: false,
            viewAllRecords: false,
            modifyAllRecords: false,
            viewCompanyRecords: false,
            modifyCompanyRecords: false,
            disabled_list_views: [],
            disabled_actions: [],
            unreadable_fields: [],
            uneditable_fields: [],
            unrelated_objects: []
          }
      
          if(_.isEmpty(roles)){
            throw new Error('not find user permission');
          }
          
          roles.forEach((role)=>{
            let rolePermission = objectRolesPermission[role]
            if(rolePermission){
                _.each(userObjectPermission, (v, k)=>{
                    let _v = rolePermission[k]
                    if(_.isBoolean(v)){
                      if(v === false && _v === true){
                        userObjectPermission[k] = _v
                      }
                    }else if(_.isArray(v) && _.isArray(_v)){
                      userObjectPermission[k] = _.union(v, _v)
                    }
                  })
            }
          })
          return userObjectPermission;
    }

    private async allowFind(userId: SteedosIDType){
        if(!userId)
            return true
        let userObjectPermission = await this.getUserObjectPermission(userId)
        if(userObjectPermission.allowRead){
            return true
        }else{
            return false
        }
    }

    private async allowInsert(userId: SteedosIDType){
        if(!userId)
            return true
        let userObjectPermission = await this.getUserObjectPermission(userId)
        if(userObjectPermission.allowCreate){
            return true
        }else{
            return false
        }
    }

    private async allowUpdate(userId: SteedosIDType){
        if(!userId)
            return true
        let userObjectPermission = await this.getUserObjectPermission(userId)
        if(userObjectPermission.allowEdit){
            return true
        }else{
            return false
        }
    }

    private async allowDelete(userId: SteedosIDType){
        if(!userId)
            return true
        let userObjectPermission = await this.getUserObjectPermission(userId)
        if(userObjectPermission.allowDelete){
            return true
        }else{
            return false
        }
    }

    async find(query: SteedosQueryOptions, userId?: SteedosIDType){
        let allowFind = await this.allowFind(userId)
        if(!allowFind){
            throw new Error('not find permission')
        }
        return await this._datasource.find(this.name, query)
    }

    async findOne(id: SteedosIDType, query: SteedosQueryOptions, userId?: SteedosIDType){
        let allowFind = await this.allowFind(userId)
        if(!allowFind){
            throw new Error('not find permission')
        }
        return await this._datasource.findOne(this.name,  id, query)
    }

    async insert(doc: JsonMap, userId?: SteedosIDType){
        let allowInsert = await this.allowInsert(userId)
        if(!allowInsert){
            throw new Error('not find permission')
        }
        return await this._datasource.insert(this.name, doc)
    }

    async update(id: SteedosIDType, doc: JsonMap, userId?: SteedosIDType){
        let allowUpdate = await this.allowUpdate(userId)
        if(!allowUpdate){
            throw new Error('not find permission')
        }
        return await this._datasource.update(this.name,  id, doc)
    }

    async delete(id: SteedosIDType, userId?: SteedosIDType){
        let allowDelete = await this.allowDelete(userId)
        if(!allowDelete){
            throw new Error('not find permission')
        }
        return await this._datasource.delete(this.name,  id)
    }

    async count(query: SteedosQueryOptions, userId?: SteedosIDType){
        let allowFind = await this.allowFind(userId)
        if(!allowFind){
            throw new Error('not find permission')
        }
        return await this._datasource.count(this.name, query)
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
