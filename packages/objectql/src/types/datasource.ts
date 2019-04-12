import { Dictionary, JsonMap } from '@salesforce/ts-types';
import { SteedosDriver, SteedosMongoDriver, SteedosMeteorMongoDriver, SteedosSqlite3Driver } from '../driver';

import _ = require('underscore');
import { SteedosQueryOptions } from './query';
import { SteedosIDType, SteedosObjectType, SteedosObjectTypeConfig, SteedosSchema, SteedosListenerConfig, SteedosObjectPermissionTypeConfig, SteedosObjectPermissionType } from '.';
import { SteedosDriverConfig } from '../driver';
import { buildGraphQLSchema } from '../graphql';

var util = require('../util')
var path = require('path')

export enum SteedosDatabaseDriverType {
    Mongo = 'mongo',
    MeteorMongo = 'meteor-mongo',
    Sqlite = 'sqlite'
}

export type SteedosDataSourceTypeConfig = {
    driver: SteedosDatabaseDriverType | string | SteedosDriver
    url: string
    username?: string
    password?: string
    options?: any
    objects?: Dictionary<SteedosObjectTypeConfig>
    objectFiles?: string[]
    objectsRolesPermission?: Dictionary<Dictionary<SteedosObjectPermissionTypeConfig>>
}

export class SteedosDataSourceType implements Dictionary {
    private _adapter: SteedosDriver;
    public get adapter(): SteedosDriver {
        return this._adapter;
    }

    private _url: string;
    private _username?: string;
    private _password?: string;
    private _options?: any;
    private _schema: SteedosSchema;
    private _objects: Dictionary<SteedosObjectType> = {};
    private _objectsConfig: Dictionary<SteedosObjectTypeConfig> = {};
    private _objectsRolesPermission: Dictionary<Dictionary<SteedosObjectPermissionType>> = {};
    private _driver: SteedosDatabaseDriverType | string | SteedosDriver;
    public get driver(): SteedosDatabaseDriverType | string | SteedosDriver {
        return this._driver;
    }
   
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
        let config: SteedosObjectTypeConfig = {fields: {}}
        let baseObject = this.getObject('base');
        if(this.driver === SteedosDatabaseDriverType.MeteorMongo && baseObject){
            let {triggers: baseTriggers, fields: basefields, permission_set} = baseObject.toConfig()
            config = util.extend(config, {triggers: baseTriggers}, {permission_set: permission_set},objectConfig, {fields: basefields}, objectConfig)
        }else{
            config = objectConfig
        }
        let object = new SteedosObjectType(object_name, this, config)
        this._objectsConfig[object_name] = config;
        this._objects[object_name] = object;
    }

    constructor(config: SteedosDataSourceTypeConfig, schema: SteedosSchema) {
        this._url = config.url
        this._username = config.username
        this._password = config.password
        this._options = config.options
        this._schema = schema
        this._driver = config.driver

        let driverConfig: SteedosDriverConfig = {
            url: this._url,
            username: this._username,
            password: this._password,
            options: this._options
        }

        if(_.isString(config.driver)){
            switch (config.driver) {
                case SteedosDatabaseDriverType.Mongo:
                    this._adapter = new SteedosMongoDriver(driverConfig);
                    break;
                case SteedosDatabaseDriverType.MeteorMongo:
                    this._adapter = new SteedosMeteorMongoDriver(driverConfig);
                    break;
                case SteedosDatabaseDriverType.Sqlite:
                    this._adapter = new SteedosSqlite3Driver(driverConfig);
                    break;
                default:
                    break;
            }
        }else{
            this._adapter = config.driver
        }

        if(config.driver === SteedosDatabaseDriverType.MeteorMongo){
            let standardObjectsDir = path.dirname(require.resolve("@steedos/standard-objects"))
            if(standardObjectsDir){
                let baseObject = util.loadFile(path.join(standardObjectsDir, "base.object.yml"))
                this.setObject(baseObject.name, baseObject)
                let baseObjectTrigger = util.loadFile(path.join(standardObjectsDir, "base.trigger.js"))
                this.setObjectListener(baseObjectTrigger)
            }
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

    async find(tableName: string, query: SteedosQueryOptions, userId?: SteedosIDType){
        return await this._adapter.find(tableName, query, userId)
    }

    async findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions, userId?: SteedosIDType){
        return await this._adapter.findOne(tableName, id, query, userId)
    }

    async insert(tableName: string, doc: JsonMap, userId?: SteedosIDType){
        return await this._adapter.insert(tableName, doc, userId)
    }

    async update(tableName: string, id: SteedosIDType, doc: JsonMap, userId?: SteedosIDType){
        return await this._adapter.update(tableName, id, doc, userId)
    }

    async delete(tableName: string, id: SteedosIDType, userId?: SteedosIDType){
        return await this._adapter.delete(tableName, id, userId)
    }

    async count(tableName: string, query: SteedosQueryOptions, userId?: SteedosIDType){
        return await this._adapter.count(tableName, query, userId)
    }

    public get schema(): SteedosSchema {
        return this._schema;
    }

    async use(filePath) {
        let objectJsons = util.loadObjects(filePath)
        let fieldJsons = util.loadFields(filePath)
        _.each(objectJsons, (json: SteedosObjectTypeConfig) => {
            let objectFieldsJson = fieldJsons.filter(fieldJson => fieldJson.object_name === json.name)
            let objectJson: SteedosObjectTypeConfig = {fields: {}}
            if(objectFieldsJson.length > 0){
                let objectFields = objectFieldsJson.map(fj =>{ 
                    delete fj.object_name
                    let f = {fields: {}}
                    f.fields[fj.name] = fj
                    return f
                })
                objectJson = util.extend({}, json, ...objectFields)
            }else{
                objectJson = json
            }
            this.setObject(objectJson.name, objectJson)
        })

        // let fieldJsons = util.loadFields(filePath)
        // _.each(fieldJsons, (json: SteedosFieldTypeConfig) => {
        //     if (!json.object_name) {
        //         throw new Error('missing attribute object_name')
        //     }
        //     let object = this.getObject(json.object_name);
        //     if (object) {
        //         object.setField(json.name, json)
        //     } else {
        //         throw new Error(`not find object: ${json.object_name}`);
        //     }
        // })

        let triggerJsons = util.loadTriggers(filePath)
        _.each(triggerJsons, (json: SteedosListenerConfig) => {
            this.setObjectListener(json);
        })

        //TODO load reports

        //TODO load actions
    }

    private setObjectListener(json: SteedosListenerConfig){
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
    }

    buildGraphQLSchema() {
        return buildGraphQLSchema(this._schema, this);
    }

    async createTable(object: SteedosObjectType) {
        if (this._adapter.createTable) {
            return await this._adapter.createTable(object);
        }
    }

    async createTables(objects?: Dictionary<SteedosObjectType>) {
        if (this._adapter.createTables) {
            return await this._adapter.createTables(objects ? objects: this._objects);
        }
    }

    async dropTable(tableName: string) {
        if (this._adapter.dropTable) {
            return await this._adapter.dropTable(tableName);
        }
    }

    async dropTables(objects?: Dictionary<SteedosObjectType>) {
        if (this._adapter.dropTables) {
            return await this._adapter.dropTables(objects ? objects : this._objects);
        }
    }
}
