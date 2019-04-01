import { Dictionary, JsonMap } from '@salesforce/ts-types';
import { SteedosDriver, SteedosMongoDriver, SteedosMeteorMongoDriver } from '../driver';

import _ = require('underscore');
import { SteedosQueryOptions } from './query';
import { SteedosIDType, SteedosObjectType, SteedosObjectTypeConfig, SteedosSchema, SteedosFieldTypeConfig, SteedosListenerConfig, SteedosObjectPermissionTypeConfig, SteedosObjectPermissionType } from '.';
import { SteedosDriverConfig } from '../driver';

var util = require('../util')

export type SteedosDataSourceTypeConfig = {
    driver: string | SteedosDriver
    url: string
    username?: string
    pasword?: string
    options?: any
    objects?: Dictionary<SteedosObjectTypeConfig>
    objectFiles?: string[]
    objectsRolesPermission?: Dictionary<Dictionary<SteedosObjectPermissionTypeConfig>>
}

export class SteedosDataSourceType implements Dictionary {
    private _adapter: SteedosDriver;

    private _url: string;
    private _username?: string;
    private _pasword?: string;
    private _options?: any;
    private _isConnected: boolean;
    private _schema: SteedosSchema;
    private _objects: Dictionary<SteedosObjectType> = {};
    private _objectsConfig: Dictionary<SteedosObjectTypeConfig> = {};
    private _objectsRolesPermission: Dictionary<Dictionary<SteedosObjectPermissionType>> = {}

    getObjects(){
        return this._objects
    }

    getObject(name: string) {
        return this._objects[name]
    }

    getObjectsConfig(){
        return this._objectsConfig;
    }

    setObject(object_name: string, objectConfig: SteedosObjectTypeConfig) {
        objectConfig.name = object_name
        let object = new SteedosObjectType(object_name, this, objectConfig)
        this._objectsConfig[object_name] = objectConfig;
        this._objects[object_name] = object;
        this._schema.setObject(object_name, object)
    }

    constructor(config: SteedosDataSourceTypeConfig, schema: SteedosSchema) {
        this._isConnected = false;
        this._url = config.url
        this._username = config.username
        this._pasword = config.pasword
        this._options = config.options
        this._schema = schema

        let driverConfig: SteedosDriverConfig = {
            url: this._url,
            username: this._username,
            pasword: this._pasword,
            options: this._options
        }

        if(_.isString(config.driver)){
            if(config.driver == 'mongo'){
                this._adapter = new SteedosMongoDriver(driverConfig);
            } else if (config.driver == 'meteor-mongo') {
                this._adapter = new SteedosMeteorMongoDriver(driverConfig);
            }
        }else{
            this._adapter = config.driver
        }

        _.each(config.objects, (object, object_name) => {
            this.setObject(object_name, object)
        })

        _.each(config.objectFiles, (objectFiles)=>{
            this.use(objectFiles)
        })

        _.each(config.objectsRolesPermission, (objectRolesPermission, object_name) => {
            _.each(objectRolesPermission, (objectRolePermission, role_name)=>{
                objectRolePermission.name = role_name
                this.setObjectPermission(object_name, objectRolePermission)
            })
        })
    }

    setObjectPermission(object_name: string, objectRolePermission: SteedosObjectPermissionTypeConfig) {
        let objectPermissions = this._objectsRolesPermission[object_name]
        if (!objectPermissions) {
            this._objectsRolesPermission[object_name] = {}
        }
        this._objectsRolesPermission[object_name][objectRolePermission.name] = new SteedosObjectPermissionType(object_name, objectRolePermission)
    }

    getObjectRolesPermission(object_name: string){
        return this._objectsRolesPermission[object_name]
    }

    async connect(){
        if (this._isConnected)
            return
        await this._adapter.connect()
        this._isConnected = true;
    }

    async find(tableName: string, query: SteedosQueryOptions){
        await this.connect();
        return await this._adapter.find(tableName, query)
    }

    async findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions){
        await this.connect();
        return await this._adapter.findOne(tableName, id, query)
    }

    async insert(tableName: string, doc: JsonMap){
        await this.connect();
        return await this._adapter.insert(tableName, doc)
    }

    async update(tableName: string, id: SteedosIDType, doc: JsonMap){
        await this.connect();
        return await this._adapter.update(tableName, id, doc)
    }

    async delete(tableName: string, id: SteedosIDType){
        await this.connect();
        return await this._adapter.delete(tableName, id)
    }

    async count(tableName: string, query: SteedosQueryOptions){
        await this.connect();
        return await this._adapter.count(tableName, query)
    }

    public get schema(): SteedosSchema {
        return this._schema;
    }

    async use(filePath) {
        console.log('use', filePath);
        let objectJsons = util.loadObjects(filePath)
        _.each(objectJsons, (json: SteedosObjectTypeConfig) => {
            this.setObject(json.name, json)
        })

        let fieldJsons = util.loadFields(filePath)
        _.each(fieldJsons, (json: SteedosFieldTypeConfig) => {
            if (!json.object_name) {
                throw new Error('missing attribute object_name')
            }
            let object = this.getObject(json.object_name);
            if (object) {
                object.setField(json.name, json)
            } else {
                throw new Error(`not find object: ${json.object_name}`);
            }
        })

        let triggerJsons = util.loadTriggers(filePath)
        _.each(triggerJsons, (json: SteedosListenerConfig) => {
            if (!json.listenTo) {
                throw new Error('missing attribute listenTo')
            }

            if(!_.isString(json.listenTo) && !_.isFunction(json.listenTo)){
                throw new Error('listenTo must be a function or string')
            }

            let object_name = '';

            if(_.isString(json.listenTo)){
                object_name = json.listenTo
            }else if(_.isFunction(json.listenTo)){
                object_name = json.listenTo()
            }

            let object = this.getObject(object_name);
            if (object) {
                object.setListener(json.name || '', json)
            } else {
                throw new Error(`not find object: ${object_name}`);
            }
        })

        //TODO load reports

        //TODO load actions
    }

}
