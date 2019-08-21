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

import _ = require('underscore');
import { SteedosQueryOptions } from './query';
import {
    SteedosIDType,
    SteedosObjectType,
    SteedosObjectTypeConfig,
    SteedosSchema,
    SteedosListenerConfig,
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

var util = require('../util')
var path = require('path')
var clone = require('clone')

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
    private _extendObjectsConfig: Array<SteedosObjectTypeConfig> = [];
    public get extendObjectsConfig(): Array<SteedosObjectTypeConfig> {
        return this._extendObjectsConfig;
    }
    public set extendObjectsConfig(value: Array<SteedosObjectTypeConfig>) {
        this._extendObjectsConfig = value;
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
        let config:SteedosObjectTypeConfig;
        if(objectConfig.extend){
            let parentObjectConfig = clone(this._objectsConfig[object_name]);
            if(_.isEmpty(parentObjectConfig)){
                throw new Error(`not find extend object: ${objectConfig.extend}`);
            }
            config = util.extend(parentObjectConfig, objectConfig);
            delete config.extend
        }else{
            objectConfig.name = object_name
            config = { fields: {} }
            let baseObject = this.getObject('base');
            let coreObject = this.getObject('core');
            if (this.driver === SteedosDatabaseDriverType.MeteorMongo && baseObject) {
                let { triggers: baseTriggers, fields: basefields, permission_set, actions: baseActions, list_views: baseListViews } = clone(baseObject.toConfig())
                config = util.extend(config, { triggers: baseTriggers }, { actions: baseActions }, { actions: baseListViews }, { permission_set: permission_set }, objectConfig, { fields: basefields }, objectConfig)
            } else if (this.driver != SteedosDatabaseDriverType.MeteorMongo && coreObject) {
                let { fields: basefields, permission_set, actions: baseActions, list_views: baseListViews } = clone(coreObject.toConfig())
                let coreListeners = clone(coreObject.listeners);
                _.each(coreListeners, function (v: SteedosListenerConfig, k) {
                    v.listenTo = object_name;
                })
                config = util.extend(config, { listeners: coreListeners }, { actions: baseActions }, { actions: baseListViews }, { permission_set: permission_set }, objectConfig, { fields: basefields }, objectConfig)
            } else {
                config = objectConfig
            }
        }

        let object = new SteedosObjectType(object_name, this, config)
        this._objectsConfig[object_name] = config;
        this._objects[object_name] = object;
    }

    initDriver(){
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

    initBaseObject(){
        let standardObjectsDir = path.dirname(require.resolve("@steedos/standard-objects"))
        if (this.config.driver === SteedosDatabaseDriverType.MeteorMongo) {
            if (standardObjectsDir) {
                let baseObject = util.loadFile(path.join(standardObjectsDir, "base.object.yml"))
                this.setObject(baseObject.name, baseObject)
                let baseObjectTrigger = util.loadFile(path.join(standardObjectsDir, "base.trigger.js"))
                this.setObjectListener(baseObjectTrigger)
            }
        } else {
            if (standardObjectsDir) {
                let coreObject = util.loadFile(path.join(standardObjectsDir, "core.object.yml"))
                this.setObject(coreObject.name, coreObject)
                let coreObjectTrigger = util.loadFile(path.join(standardObjectsDir, "core.objectwebhooks.trigger.js"))
                this.setObjectListener(coreObjectTrigger)
            }
        }
    }

    initObjects(){
        _.each(this.config.objects, (object, object_name) => {
            if (object.extend){
                this._extendObjectsConfig.push(object)
            }else{
                this.setObject(object_name, object)
            }
        })

        _.each(this.config.objectFiles, (objectFiles) => {
            this.use(objectFiles)
        })

        _.each(this.config.objectsRolesPermission, (objectRolesPermission, object_name) => {
            _.each(objectRolesPermission, (objectRolePermission, role_name) => {
                objectRolePermission.name = role_name
                this.setObjectPermission(object_name, objectRolePermission)
            })
        })
    }

    initExtendObject(){
        _.each(this._extendObjectsConfig, (objectConfig)=>{
            this.setObject(objectConfig.extend, objectConfig)
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

    initReports(){
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
        this.initBaseObject()

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

    async update(tableName: string, id: SteedosIDType, doc: Dictionary<any>, userId?: SteedosIDType) {
        return await this._adapter.update(tableName, id, doc, userId)
    }

    async delete(tableName: string, id: SteedosIDType, userId?: SteedosIDType) {
        return await this._adapter.delete(tableName, id, userId)
    }

    async count(tableName: string, query: SteedosQueryOptions, userId?: SteedosIDType) {
        return await this._adapter.count(tableName, query, userId)
    }

    public get schema(): SteedosSchema {
        return this._schema;
    }

    use(filePath) {
        let objectJsons = util.loadObjects(filePath)
        let fieldJsons = util.loadFields(filePath)
        _.each(objectJsons, (json: SteedosObjectTypeConfig) => {
            if (json.extend){
                this._extendObjectsConfig.push(json)
            }else{
                let objectFieldsJson = fieldJsons.filter(fieldJson => fieldJson.object_name === json.name)
                let objectJson: SteedosObjectTypeConfig = { fields: {} }
                if (objectFieldsJson.length > 0) {
                    let objectFields = objectFieldsJson.map(fj => {
                        delete fj.object_name
                        let f = { fields: {} }
                        f.fields[fj.name] = fj
                        return f
                    })
                    objectJson = util.extend({}, json, ...objectFields)
                } else {
                    objectJson = json
                }
                this.setObject(objectJson.name, objectJson)
            }
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

    private setObjectListener(json: SteedosListenerConfig) {
        if (!json.listenTo) {
            throw new Error('missing attribute listenTo')
        }

        if (!_.isString(json.listenTo) && !_.isFunction(json.listenTo)) {
            throw new Error('listenTo must be a function or string')
        }

        let object_name = '';

        if (_.isString(json.listenTo)) {
            object_name = json.listenTo
        } else if (_.isFunction(json.listenTo)) {
            object_name = json.listenTo()
        }

        let object = this.getObject(object_name);
        if (object) {
            //TODO 处理listener 继承
            //console.log('setObjectListener object_name', object_name, this._objectsConfig[object_name]);
            let objectListener = this._objectsConfig[object_name].listeners;
            if(!objectListener){
                this._objectsConfig[object_name].listeners = {}
            }
            this._objectsConfig[object_name].listeners[json.name] = json
            object.setListener(json.name || '', json)
        } else {
            throw new Error(`not find object: ${object_name}`);
        }
    }

    buildGraphQLSchema() {
        this._graphQLSchema = buildGraphQLSchema(this._schema, this);
        return this._graphQLSchema;
    }

    getGraphQLSchema() {
        if (this._graphQLSchema){
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

    async init() {
        this.initObjects();
        this.initExtendObject();
        this.initApps();
        this.initReports();
        // this.schema.transformReferenceOfObject(this);
        if (this._adapter.init) {
            return await this._adapter.init(this._objects);
        }
    }
}
