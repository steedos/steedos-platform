import { Dictionary, JsonMap } from '@salesforce/ts-types';
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
    SteedosAppTypeConfig,
    SteedosAppType,
    SteedosReportTypeConfig,
    SteedosReportType
} from '.';
import { SteedosDriverConfig } from '../driver';
import { buildGraphQLSchema } from '../graphql';
import { GraphQLSchema } from 'graphql';
import { getObjectConfigs, addObjectConfig, addObjectConfigFiles } from './object_dynamic_load';

var util = require('../util')
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
    apps?: Dictionary<SteedosAppTypeConfig>
    appFiles?: string[]
    reports?: Dictionary<SteedosReportTypeConfig>
    reportFiles?: string[]
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
    private _schema: SteedosSchema;
    private _objects: Dictionary<SteedosObjectType> = {};
    private _objectsConfig: Dictionary<SteedosObjectTypeConfig> = {};
    private _objectsRolesPermission: Dictionary<Dictionary<SteedosObjectPermissionType>> = {};
    private _driver: SteedosDatabaseDriverType | string | SteedosDriver;
    private _logging: boolean | Array<any>;
    private _graphQLSchema: GraphQLSchema;
    private _config: SteedosDataSourceTypeConfig;
    public get config(): SteedosDataSourceTypeConfig {
        return this._config;
    }
    public set config(value: SteedosDataSourceTypeConfig) {
        this._config = value;
    }

    public get driver(): SteedosDatabaseDriverType | string | SteedosDriver {
        return this._driver;
    }

    private _apps: Dictionary<SteedosAppType> = {}
    private _reports: Dictionary<SteedosReportType> = {}

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
            logging: this._logging
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

    initApps(){
        _.each(this.config.apps, (appConfig, app_id) => {
            this.addApp(app_id, appConfig)
        })

        _.each(this.config.appFiles, (appFile) => {
            this.useAppFile(appFile)
        })
    }

    initReports() {
        _.each(this.config.reports, (reportConfig, report_id) => {
            this.addReport(report_id, reportConfig)
        })

        _.each(this.config.reportFiles, (reportFile) => {
            this.useReportFile(reportFile)
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

        this.initDriver();

        // 添加对象到缓存
        _.each(this.config.objects, (object, object_name) => {
            object.name = object_name
            addObjectConfig(object, this._name);
        })

        // 添加对象到缓存
        _.each(this.config.objectFiles, (objectPath) => {
            addObjectConfigFiles(path.join(process.cwd(), objectPath), this._name)
        })

        if (config.getRoles && !_.isFunction(config.getRoles)) {
            throw new Error('getRoles must be a function')
        }
        this._getRoles = config.getRoles
    }


    /**apps */
    addApp(app_id: string, config: SteedosAppTypeConfig) {
        config._id = app_id
        this._apps[config._id] = new SteedosAppType(config, this)
    }

    useAppFiles(appFiles: string[]) {
        _.each(appFiles, (appFile) => {
            this.useAppFile(appFile)
        })

    }

    useAppFile(filePath: string) {
        let appJsons = util.loadApps(filePath)
        _.each(appJsons, (json: SteedosAppTypeConfig) => {
            this.addApp(json._id, json)
        })
    }

    getApp(app_id: string) {
        return this._apps[app_id]
    }

    getApps() {
        return this._apps
    }

    getAppsConfig() {
        let appsConfig: JsonMap = {}
        _.each(this._apps, (app: SteedosAppType, _id: string) => {
            appsConfig[_id] = app.toConfig()
        })
        return appsConfig
    }

    /**reports */
    addReport(report_id: string, config: SteedosReportTypeConfig) {
        config._id = report_id
        this._reports[config._id] = new SteedosReportType(config, this)
    }

    useReportFiles(reportFiles: string[]) {
        _.each(reportFiles, (reportFile) => {
            this.useReportFile(reportFile)
        })

    }

    useReportFile(filePath: string) {
        let reportJsons = util.loadReports(filePath)
        _.each(reportJsons, (json: SteedosReportTypeConfig) => {
            json.mrt_file = path.join(filePath, `${json._id}.mrt`)
            this.addReport(json._id, json)
        })
    }

    getReport(report_id: string) {
        return this._reports[report_id]
    }

    getReports() {
        return this._reports
    }

    getReportsConfig() {
        let reportsConfig: JsonMap = {}
        _.each(this._reports, (report: SteedosReportType, _id: string) => {
            reportsConfig[_id] = report.toConfig()
        })
        return reportsConfig
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
        this.initApps();
        this.initReports();
        // this.schema.transformReferenceOfObject(this);
    }

    async initTypeORM() {
        if (this._adapter.init) {
            return await this._adapter.init(this._objects);
        }
    }
}
