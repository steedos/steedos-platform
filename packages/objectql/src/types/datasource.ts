import { Dictionary } from '@salesforce/ts-types';
// import { initObjectFieldsSummarys } from '../summary';
import { getObjectServiceName } from '../services/index';
import {
    SteedosDriver,
    SteedosMongoDriver,
    SteedosMeteorMongoDriver,
    SteedosSqlite3Driver,
    SteedosSqlServerDriver,
    SteedosPostgresDriver,
    SteedosOracleDriver,
    SteedosMySqlDriver
} from '../driver';

import _ = require('lodash');
import { SteedosQueryOptions, SteedosQueryFilters } from './query';
import {
    SteedosIDType,
    SteedosObjectType,
    SteedosObjectTypeConfig,
    SteedosSchema,
    SteedosObjectPermissionTypeConfig,
    SteedosObjectPermissionType,
    getAppConfigs,
    getDashboardConfigs,
    getSteedosSchema,
} from '.';
import { SteedosDriverConfig } from '../driver';
import { createDataSourceService } from '../services/index';
import path = require('path');
import { getObjectConfig, registerMetadataConfigs } from '@steedos/metadata-registrar';
const clone = require('clone')
const cachers = require('@steedos/cachers');
let Fiber = require('fibers');
const defaultDatasourceName = 'default';
// const meteorDatasourceName = 'meteor';
declare var Creator: any;
export enum SteedosDatabaseDriverType {
    Mongo = 'mongo',
    MeteorMongo = 'meteor-mongo',
    Sqlite = 'sqlite',
    SqlServer = 'sqlserver',
    Postgres = 'postgres',
    Oracle = 'oracle',
    MySql = 'mysql'
}

export type SteedosDataSourceTypeConfig = {
    name?: string
    driver: SteedosDatabaseDriverType | string | SteedosDriver
    logging?: boolean | Array<any>
    url?: string
    host?: string,
    port?: number,
    username?: string
    password?: string,
    database?: string,
    connectString?: string,
    timezone?: string,
    options?: any
    objects?: Dictionary<SteedosObjectTypeConfig>
    objectFiles?: string[]
    objectsRolesPermission?: Dictionary<Dictionary<SteedosObjectPermissionTypeConfig>>
    getRoles?: Function //TODO 尚未开放此功能
    enable_space?: boolean
    locale?: string //指定新建数据库表的默认语言，如zh，可用于字段的默认排序
}

export class SteedosDataSourceType implements Dictionary {
    [key: string]: unknown;
    private _name: string;
    public get name(): string {
        return this._name;
    }
    private _adapter: SteedosDriver;
    public get adapter(): SteedosDriver {
        return this._adapter;
    }
    private _getRoles: Function;
    private _url: string;
    private _host: string;
    private _port: number;
    private _username?: string;
    private _password?: string;
    private _database?: string;
    private _connectString?: string;
    private _timezone?: string;
    private _options?: any;
    private _locale?: string;
    private _schema: SteedosSchema;
    private _objects: Dictionary<SteedosObjectType> = {};
    private _cacheObjects?: Array<SteedosObjectType> = [];
    public get cacheObjects(): any {
        return this._cacheObjects;
    }
    public set cacheObjects(value: any) {
        this._cacheObjects = value;
    }
    private _service?: any;
    public get service(): any {
        return this._service;
    }
    public set service(value: any) {
        this._service = value;
    }

    private _objectsConfig: Dictionary<SteedosObjectTypeConfig> = {};
    private _objectsRolesPermission: Dictionary<Dictionary<SteedosObjectPermissionType>> = {};
    private _objectsSpaceRolesPermission: Dictionary<Dictionary<Dictionary<SteedosObjectPermissionType>>> = {};
    private _driver: SteedosDatabaseDriverType | string | SteedosDriver;
    private _logging: boolean | Array<any>;
    private _config: SteedosDataSourceTypeConfig;
    private _enable_space: boolean;
    public get enable_space(): boolean {
        return this._enable_space;
    }

    public get config(): SteedosDataSourceTypeConfig {
        return this._config;
    }
    public set config(value: SteedosDataSourceTypeConfig) {
        this._config = value;
    }

    public get driver(): SteedosDatabaseDriverType | string | SteedosDriver {
        return this._driver;
    }

    async getObjects(useCache = true) {
        // if(!this.schema.metadataRegister){
        //     return this._objects
        // }
        // return await this.schema.metadataRegister.getObjectsConfig(this.name);
        if(useCache === false){
            await this.flushCacheObjects();
        }
        return this.getCacheObjects();
    }

    getCacheObjects() {
        return clone(this.cacheObjects);
    }

    getCacheObject(objectName){
        return clone(_.find(this.cacheObjects, (item)=>{
            return item?.metadata.name === objectName
        }))
    }

    async flushCacheObjects() {
        this.cacheObjects = await this.schema.metadataRegister.getObjectsConfig(this.name);
    }

    getLocalObjects() {
        return this._objects
    }

    setLocalObject(objectApiName, object){
        this._objects[objectApiName] = object;
    }

    getObject(objectApiName: string): any{
        return this.getLocalObject(objectApiName);
    }

    getLocalObject(objectApiName: string) {
        return this._objects[objectApiName]
    }

    getObjectsConfig() {
        return this._objectsConfig;
    }

    getObjectConfig(objectName) {
        return this._objectsConfig[objectName];
    }

    async setObject(objectApiName: string, objectConfig: SteedosObjectTypeConfig) {
        const serviceName = getObjectServiceName(objectApiName)
        let object = new SteedosObjectType(objectApiName, this, objectConfig)

        this._objectsConfig[objectApiName] = objectConfig;

        const findIndex = _.findIndex(this.cacheObjects, (item: any) => { return item?.metadata?.name === objectApiName });

        if (findIndex != -1) {
            this.cacheObjects[findIndex] = Object.assign({ service: { name: serviceName } }, { metadata: objectConfig });
        } else {
            this.cacheObjects.push(Object.assign({ service: { name: serviceName } }, { metadata: objectConfig }));
        }

        this._objects[objectApiName] = object;
        return object;
    }

    removeLocalObject(objectApiName: string) {
        delete this._objectsConfig[objectApiName];
        delete this._objects[objectApiName];
        this.schema.removeObjectMap(objectApiName);
    }

    removeObject(object_name: string){
        this.removeLocalObject(object_name);
        this.schema.metadataRegister.removeObject(object_name)
    }

    initDriver() {
        let driverConfig: SteedosDriverConfig = {
            url: this._url,
            host: this._host,
            port: this._port,
            username: this._username,
            password: this._password,
            database: this._database,
            connectString: this._connectString,
            timezone: this._timezone,
            options: this._options,
            logging: this._logging,
            locale: this._locale
        }

        if (_.isString(this.config.driver)) {
            switch (this.config.driver) {
                case SteedosDatabaseDriverType.Mongo:
                    this._adapter = new SteedosMongoDriver(driverConfig);
                    break;
                case SteedosDatabaseDriverType.MeteorMongo:
                    this._adapter = new SteedosMeteorMongoDriver(driverConfig);
                    break;
                case SteedosDatabaseDriverType.Sqlite:
                    this._adapter = new SteedosSqlite3Driver(driverConfig);
                    break;
                case SteedosDatabaseDriverType.SqlServer:
                    this._adapter = new SteedosSqlServerDriver(driverConfig);
                    break;
                case SteedosDatabaseDriverType.Postgres:
                    this._adapter = new SteedosPostgresDriver(driverConfig);
                    break;
                case SteedosDatabaseDriverType.Oracle:
                    this._adapter = new SteedosOracleDriver(driverConfig);
                    break;
                case SteedosDatabaseDriverType.MySql:
                    this._adapter = new SteedosMySqlDriver(driverConfig);
                    break;
                default:
                    throw new Error(`the driver ${this.config.driver} is not supported`)
            }
        } else {
            this._adapter = this.config.driver as any
        }
    }

    async initObject(objectConfig) {
        //从本地对象配置中读取触发器配置
        const localObjectConfig = getObjectConfig(objectConfig.name);
        if (localObjectConfig) {
            objectConfig.listeners = localObjectConfig.listeners;
            objectConfig.methods = localObjectConfig.methods;
        }
        // else {
        //     if (this.name === "meteor" || this.name === "default") {
        //         let baseObjectConfig = getObjectConfig(MONGO_BASE_OBJECT);
        //         let _baseObjectConfig = clone(baseObjectConfig);
        //         delete _baseObjectConfig.hidden;
        //         if(this.name === 'meteor'){
        //             _.each(_baseObjectConfig.listeners, function(license){
        //                 const triggers = transformListenersToTriggers(objectConfig, license)
        //                 extend(objectConfig, {triggers, _baseTriggers: triggers})
        //             })
        //         }
        //         objectConfig = extend(objectConfig, _baseObjectConfig, clone(objectConfig));
        //     } else {
        //         let coreObjectConfig = getObjectConfig(SQL_BASE_OBJECT);
        //         let _coreObjectConfig = clone(coreObjectConfig)
        //         delete _coreObjectConfig.hidden;
        //         objectConfig = extend(objectConfig, _coreObjectConfig, clone(objectConfig));
        //     }
        // }
        if (this.name === "meteor") {
            try {
                const _db = Creator.createCollection(objectConfig)
                Creator.Collections[_db._name] = _db
            } catch (error) {
                // console.log(`error`, error) //此处无需打印日志，@steedos/core 在init Creator 时，会兼容此部分的异常逻辑。
            }
        }
        await this.setObject(objectConfig.name, objectConfig);
    }

    async initObjects() {
        // 从缓存中加载所有本数据源对象到datasource中
        let objects: Array<any> = this.cacheObjects;
        let self = this;
        for await (const object of _.values(objects)) {
            const objectConfig = object.metadata;
            await self.initObject(objectConfig)
        }
        return true;
    }

    constructor(datasource_name: string, config: SteedosDataSourceTypeConfig, schema: SteedosSchema) {
        this._name = datasource_name
        this.config = config
        this._url = config.url
        this._host = config.host
        this._port = config.port
        this._username = config.username
        this._password = config.password
        this._database = config.database
        this._connectString = config.connectString
        this._timezone = config.timezone
        this._options = config.options
        this._schema = schema
        this._driver = config.driver
        this._logging = config.logging
        this._locale = config.locale
        // TODO 非默认数据源开启enable_space:true，功能有问题，暂时关闭
        if(_.has(config, 'enable_space')){
            this._enable_space = config.enable_space
        }else{
            if(this._driver == SteedosDatabaseDriverType.MeteorMongo || (this._driver == SteedosDatabaseDriverType.Mongo && this.name === defaultDatasourceName)){
                this._enable_space = true
            }else{
                this._enable_space = false
            }
        }

        this.initDriver();

        if (config.getRoles && !_.isFunction(config.getRoles)) {
            throw new Error('getRoles must be a function')
        }
        this._getRoles = config.getRoles
    }

    async loadFiles(){
        // 不再支持从steedos-config中配置对象定义。
        // _.each(this.config.objects, (object, object_name) => {
        //     object.name = object_name
        //     addObjectConfig(object, this._name);
        // })
        // 添加对象到缓存
        for (const objectPath of this.config.objectFiles) {
            let filePath = objectPath;
            if(!path.isAbsolute(objectPath)){
                filePath = path.join(process.cwd(), objectPath)
            }
            await registerMetadataConfigs(filePath, this._name, null)
        }
    }

    setObjectPermission(object_name: string, objectRolePermission: SteedosObjectPermissionTypeConfig) {
        let objectPermissions = this._objectsRolesPermission[object_name]
        if (!objectPermissions) {
            this._objectsRolesPermission[object_name] = {}
        }
        this._objectsRolesPermission[object_name][objectRolePermission.name] = new SteedosObjectPermissionType(object_name, objectRolePermission)
    }

    getObjectRolesPermission(object_name: string) {
        return this._objectsRolesPermission[object_name]
    }

    setObjectSpacePermission(object_name: string, spaceId: string, objectRolePermission: SteedosObjectPermissionTypeConfig) {
        let objectPermissions = this._objectsSpaceRolesPermission[object_name]
        if (!objectPermissions) {
            this._objectsSpaceRolesPermission[object_name] = {}
        }
        let objectSpacePermissions = this._objectsSpaceRolesPermission[object_name][spaceId]
        if (!objectSpacePermissions) {
            this._objectsSpaceRolesPermission[object_name][spaceId] = {}
        }
        this._objectsSpaceRolesPermission[object_name][spaceId][objectRolePermission.name] = new SteedosObjectPermissionType(object_name, objectRolePermission)
    }

    getObjectSpaceRolesPermission(object_name: string, spaceId: string) {
        // if(this._objectsSpaceRolesPermission[object_name]){
        //     return this._objectsSpaceRolesPermission[object_name][spaceId]
        // }
        const cacherPermissionObjects = cachers.getCacher('permission_objects').get('permission_objects')
        if (_.isEmpty(cacherPermissionObjects)){
            return;
        }
        const permission = {};
        
        _.each(_.filter(cacherPermissionObjects[spaceId], function(objectPermission){
            return objectPermission.object_name === object_name
        }), (item)=>{
            permission[item.name] = new SteedosObjectPermissionType(object_name, item)
        })

        return permission;
    }

    removeObjectSpacePermission(object_name: string, spaceId: string, objectRolePermissionName: string){
        if(this._objectsSpaceRolesPermission[object_name] && this._objectsSpaceRolesPermission[object_name][spaceId]){
            delete this._objectsSpaceRolesPermission[object_name][spaceId][objectRolePermissionName];
        }
    }

    async getRoles(userId: SteedosIDType) {
        if (this._getRoles) {
            return await this._getRoles(userId)
        } else {
            return ['admin']
        }
    }

    async find(tableName: string, query: SteedosQueryOptions, userId?: SteedosIDType) {
        return await this._adapter.find(tableName, query, userId)
    }

    async aggregate(tableName: string, query: SteedosQueryOptions, externalPipeline, userId?: SteedosIDType) {
        return await this._adapter.aggregate(tableName, query, externalPipeline, userId)
    }

    async findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions, userId?: SteedosIDType) {
        return await this._adapter.findOne(tableName, id, query, userId)
    }

    async insert(tableName: string, doc: Dictionary<any>, userId?: SteedosIDType) {
        return await this._adapter.insert(tableName, doc, userId)
    }

    async update(tableName: string, id: SteedosIDType | SteedosQueryOptions, doc: Dictionary<any>, userId?: SteedosIDType) {
        return await this._adapter.update(tableName, id, doc, userId)
    }

    async updateOne(tableName: string, id: SteedosIDType | SteedosQueryOptions, doc: Dictionary<any>, userId?: SteedosIDType) {
        return await this._adapter.updateOne(tableName, id, doc, userId)
    }

    async updateMany(tableName: string, queryFilters: SteedosQueryFilters, doc: Dictionary<any>, userId?: SteedosIDType) {
        return await this._adapter.updateMany(tableName, queryFilters, doc, userId)
    }

    async delete(tableName: string, id: SteedosIDType | SteedosQueryOptions, userId?: SteedosIDType) {
        return await this._adapter.delete(tableName, id, userId)
    }

    formatRecord(doc: Dictionary<any>, objectConfig: SteedosObjectType) {
        const formatRecord = this._adapter.formatRecord
        if (typeof formatRecord === 'function') {
            return formatRecord(doc, objectConfig) 
        }
        return doc
    }

    async count(tableName: string, query: SteedosQueryOptions, userId?: SteedosIDType) {
        return await this._adapter.count(tableName, query, userId)
    }

    async directFind(tableName: string, query: SteedosQueryOptions, userId?: SteedosIDType) {
        return await this._adapter.find(tableName, query, userId)
    }

    async directInsert(tableName: string, doc: Dictionary<any>, userId?: SteedosIDType) {
        return await this._adapter.directInsert(tableName, doc, userId)
    }

    async directUpdate(tableName: string, id: SteedosIDType | SteedosQueryOptions, doc: Dictionary<any>, userId?: SteedosIDType) {
        return await this._adapter.directUpdate(tableName, id, doc, userId)
    }

    async directDelete(tableName: string, id: SteedosIDType | SteedosQueryOptions, userId?: SteedosIDType) {
        return await this._adapter.directDelete(tableName, id, userId)
    }

    async directAggregate(tableName: string, query: SteedosQueryOptions, externalPipeline: any[], userId?: SteedosIDType) {
        return await this._adapter.directAggregate(tableName, query, externalPipeline, userId)
    }

    async directAggregatePrefixalPipeline(tableName: string, query: SteedosQueryOptions, prefixalPipeline: any[], userId?: SteedosIDType) {
        return await this._adapter.directAggregatePrefixalPipeline(tableName, query, prefixalPipeline, userId)
    }

    async _makeNewID(tableName: string){
        return await this._adapter._makeNewID(tableName)
    }

    public get schema(): SteedosSchema {
        return this._schema;
    }

    async dropEntities() {
        if (this._adapter.dropEntities) {
            return await this._adapter.dropEntities();
        }
    }

    registerEntities() {
        if (this._adapter.registerEntities) {
            return this._adapter.registerEntities(this._objects);
        }
    }

    async dropTables() {
        if (this._adapter.dropEntities) {
            return await this._adapter.dropEntities();
        }
    }

    async createTables() {
        if (this._adapter.createTables) {
            return await this._adapter.createTables(this._objects);
        }
    }

    async init() {
        // await this.flushCacheObjects();
        // await this.initObjects();
        this.initObjectPermissions();
        if (!this.service) {
            const broker = this._schema.metadataBroker
            this.service = await createDataSourceService(broker, this)
        }
    }

    /**
     * 初始化数据源上配置的对象权限。
     */
    initObjectPermissions() {
        _.each(this.config.objectsRolesPermission, (objectRolesPermission, object_name) => {
            _.each(objectRolesPermission, (objectRolePermission, role_name) => {
                objectRolePermission.name = role_name
                this.setObjectPermission(object_name, objectRolePermission)
            })
        })
    }

    initTypeORM() {
        const _objects = {};
        _.map(this.cacheObjects, (item) => {
            if(item && item.metadata){
                _objects[item.metadata.name] = item.metadata
            }
        })
        
        if (this._adapter.init) {
            let self = this;
            Fiber(function(){
                let fiber = Fiber.current;
                self._adapter.init(_objects).then(result => {
                    fiber.run();
                }).catch(result => {
                    console.error(result)
                    fiber.run();
                })
                Fiber.yield();
            }).run();
        }
    }

    // 暂时保留，兼容creator bootstrap接口
    getAppsConfig() {
        return getAppConfigs()
    }

    getDashboardsConfig() {
        return getDashboardConfigs()
    }

    async connect() {
        // this.initObjects();
        // init typeorm
        if (this._adapter.connect) 
            await this._adapter.connect()
        // init typeorm
        if (this._adapter.init) 
            await this._adapter.init(this._objects)
    }

    async close() {
        if (this._adapter?.close) 
            this._adapter.close()
    }

    // 重命名库中表名
    async renameCollection(newObjectApiName: string, oldObjectApiName: string){
        if(this.driver === SteedosDatabaseDriverType.Mongo){
            const adapter = this.adapter;
            await adapter.connect();
            const collection = (adapter as any).collection(oldObjectApiName);
            const newCollection = (adapter as any).collection(newObjectApiName);
            let dropTarget = false;
            let count = await newCollection.count({});
            if (count == 0) {
                dropTarget = true;
            }
            return await collection.rename(newObjectApiName, { dropTarget: dropTarget });
        }
    }

    // 校验表在库中是否已存在记录
    async isCollectionExitsRecords(objectApiName: string) {
        if(this.driver === SteedosDatabaseDriverType.Mongo){
            const adapter = this.adapter;
            await adapter.connect();
            const collection = (adapter as any).collection(objectApiName);
            let count = await collection.count({});
            return !!count;
        }
    }
}

export function getDataSource(datasourceName: string, schema?: SteedosSchema) {
    return (schema ? schema : getSteedosSchema()).getDataSource(datasourceName);
}