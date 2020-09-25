import { Dictionary } from '@salesforce/ts-types';
import { initObjectFieldsFormulas } from '../formula';
import { initObjectFieldsSummarys } from '../summary';
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
    getSteedosSchema
} from '.';
import { SteedosDriverConfig } from '../driver';
import { buildGraphQLSchema } from '../graphql';
import { GraphQLSchema } from 'graphql';
import { getObjectConfigs, addObjectConfig, addAllConfigFiles } from '.';
let Fiber = require('fibers');
var path = require('path')

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
    private _objectsConfig: Dictionary<SteedosObjectTypeConfig> = {};
    private _objectsRolesPermission: Dictionary<Dictionary<SteedosObjectPermissionType>> = {};
    private _objectsSpaceRolesPermission: Dictionary<Dictionary<Dictionary<SteedosObjectPermissionType>>> = {};
    private _driver: SteedosDatabaseDriverType | string | SteedosDriver;
    private _logging: boolean | Array<any>;
    private _graphQLSchema: GraphQLSchema;
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

    getObjects() {
        return this._objects
    }

    getObject(name: string) {
        return this._objects[name]
    }

    getObjectsConfig() {
        return this._objectsConfig;
    }

    setObject(object_name: string, objectConfig: SteedosObjectTypeConfig) {
        let object = new SteedosObjectType(object_name, this, objectConfig)
        this._objectsConfig[object_name] = objectConfig;
        this._objects[object_name] = object;
    }

    removeObject(object_name: string){
        delete this._objectsConfig[object_name];
        delete this._objects[object_name];
        this.schema.removeObjectMap(object_name);
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
            this._adapter = this.config.driver
        }
    }

    initObjects(){
        // 从缓存中加载所有本数据源对象到datasource中
        let objects: Array<SteedosObjectTypeConfig> = getObjectConfigs(this._name);
        _.each(objects, (object) => {
            this.setObject(object.name, object);
        });

        _.each(this.config.objectsRolesPermission, (objectRolesPermission, object_name) => {
            _.each(objectRolesPermission, (objectRolePermission, role_name) => {
                objectRolePermission.name = role_name
                this.setObjectPermission(object_name, objectRolePermission)
            })
        })
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

        if(_.has(config, 'enable_space')){
            this._enable_space = config.enable_space
        }else{
            if(this._driver == SteedosDatabaseDriverType.MeteorMongo || this._driver == SteedosDatabaseDriverType.Mongo){
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

    loadFiles(){
        // 添加对象到缓存
        _.each(this.config.objects, (object, object_name) => {
            object.name = object_name
            addObjectConfig(object, this._name);
        })
        // 添加对象到缓存
        _.each(this.config.objectFiles, (objectPath) => {
            let filePath = objectPath;
            if(!path.isAbsolute(objectPath)){
                filePath = path.join(process.cwd(), objectPath)
            }
            addAllConfigFiles(filePath, this._name)
        })
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
        if(this._objectsSpaceRolesPermission[object_name]){
            return this._objectsSpaceRolesPermission[object_name][spaceId]
        }
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

    async count(tableName: string, query: SteedosQueryOptions, userId?: SteedosIDType) {
        return await this._adapter.count(tableName, query, userId)
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

    public get schema(): SteedosSchema {
        return this._schema;
    }

    buildGraphQLSchema() {
        this._graphQLSchema = buildGraphQLSchema(this._schema, this);
        return this._graphQLSchema;
    }

    getGraphQLSchema() {
        if (this._graphQLSchema) {
            return this._graphQLSchema;
        }
        return buildGraphQLSchema(this._schema, this);
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

    init() {
        this.initObjects();
        this.initTypeORM();
        initObjectFieldsFormulas(this.name);
        initObjectFieldsSummarys(this.name);
        // this.schema.transformReferenceOfObject(this);
    }

    initTypeORM() {
        if (this._adapter.init) {
            let self = this;
            Fiber(function(){
                let fiber = Fiber.current;
                self._adapter.init(self._objects).then(result => {
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
        this.initObjects();
        // init typeorm
        if (this._adapter.connect) 
            await this._adapter.connect()
        // init typeorm
        if (this._adapter.init) 
            await this._adapter.init(this._objects)
    }

    async close() {
        if (this._adapter.close) 
            this._adapter.close()
    }
}

export function getDataSource(datasourceName: string, schema?: SteedosSchema) {
    return (schema ? schema : getSteedosSchema()).getDataSource(datasourceName);
}