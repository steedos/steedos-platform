import { Dictionary, JsonMap } from '@salesforce/ts-types';
import { SteedosDataSourceType, SteedosDataSourceTypeConfig, SteedosAppTypeConfig, SteedosAppType } from ".";
import _ = require("underscore");
var util = require('../util')

const defaultDatasourceName = 'default';

export type SteedosSchemaConfig = {
    datasources?: Dictionary<SteedosDataSourceTypeConfig>
    apps?: Dictionary<SteedosAppTypeConfig>
    appFiles?: string[]
}

export class SteedosSchema {
    private _datasources: Dictionary<SteedosDataSourceType> = {};
    private _apps: Dictionary<SteedosAppType> = {}

    constructor(config?: SteedosSchemaConfig) {
        if(config){
            _.each(config.datasources, (datasourceConfig, datasource_name) => {
                this.addDataSource(datasource_name, datasourceConfig)
            })

            if(!this.getDataSource(defaultDatasourceName)){
                throw new Error('missing default database');
            }

            _.each(config.apps, (appConfig, app_id)=>{
                this.addApp(app_id, appConfig)
            })

            _.each(config.appFiles, (appFile)=>{
                this.useAppFile(appFile)
            })
        }
    }

    /**
     * 获取对象
     * @param {string} name : {datacource_name}.{object_name} ，如果没有${datacource_name}部分，则默认为default
     * @returns
     * @memberof SteedosSchema
     */
    getObject(name: string) {
        let datasource_name: string, object_name: string;
        let args = name.split('.')
        if(args.length == 1){
            datasource_name = defaultDatasourceName
            object_name = args[0]
        }
        if(args.length > 1){
            datasource_name = args[0]
            object_name = _.rest(args).join('.')
        }

        let datasource = this.getDataSource(datasource_name)

        if(!datasource){
            throw new Error(`not find datasource ${datasource_name}`);
        }

        return datasource.getObject(object_name)
    }

    addDataSource(datasource_name: string, datasourceConfig: SteedosDataSourceTypeConfig) {
        this._datasources[datasource_name] = new SteedosDataSourceType(datasource_name, datasourceConfig, this)
    }

    getDataSource(datasource_name: string) {
        return this._datasources[datasource_name]
    }

    getDataSources(){
        return this._datasources
    }

    addApp(app_id: string, config: SteedosAppTypeConfig){
        config._id = app_id
        this._apps[config._id] = new SteedosAppType(config, this)
    }

    useAppFiles(appFiles: string[]){
        _.each(appFiles, (appFile)=>{
            this.useAppFile(appFile)
        })
        
    }

    useAppFile(filePath: string){
        let appJsons = util.loadApps(filePath)
        _.each(appJsons, (json: SteedosAppTypeConfig) => {
            this.addApp(json._id, json)
        })
    }

    getApp(app_id: string){
        return this._apps[app_id]
    }

    getApps(){
        return this._apps
    }

    getAppsConfig(){
        let appsConfig:JsonMap = {}
        _.each(this._apps, (app: SteedosAppType, _id: string)=>{
            appsConfig[_id] = app.toConfig()
        })
        return appsConfig
    }
}
