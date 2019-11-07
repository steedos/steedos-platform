import { Dictionary } from '@salesforce/ts-types';
import { SteedosDataSourceType, SteedosDataSourceTypeConfig} from ".";
import _ = require("underscore");
const util = require('../util')

const defaultDatasourceName = 'default';

declare var Meteor:any;

export type SteedosSchemaConfig = {
    datasources?: Dictionary<SteedosDataSourceTypeConfig>
}

export function isMeteor() {
    return (typeof Meteor != "undefined")            
}

export class SteedosSchema {
    private _datasources: Dictionary<SteedosDataSourceType> = {};
    private _objectsMap: Dictionary<{datasourceName: string, filePath?: string}> = {}
    
    setObjectMap(objectName:string, options){
        let objectMap = this.getObjectMap(objectName);
        if(objectMap){
            if(objectName != 'base' && objectName != 'core' && objectMap.datasourceName != options.datasourceName){
                throw new Error(`object name ${objectName} is unique, you can set table_name. see: https://developer.steedos.com/docs/en/object/#%E8%A1%A8%E5%90%8D-table_name`)
            }
        }
        this._objectsMap[objectName] = options
    }

    getObjectMap(objectName: string){
        return this._objectsMap[objectName]
    }

    loadConfig(){
        let config: any = util.getSteedosConfig();
        if(config && config.datasources){
            _.each(config.datasources, (datasource: any, datasource_name)=>{
                _.extend(datasource, datasource.connection)
            })
            
            if (isMeteor())
                config.datasources.default.driver = "meteor-mongo"
            else
                config.datasources.default.driver = "mongo"
        }
        return config;
    }
    
    constructor(config?: SteedosSchemaConfig) {
        if(!config){
            config = this.loadConfig()
        }

        if(config){
            _.each(config.datasources, (datasourceConfig, datasource_name) => {
                this.addDataSource(datasource_name, datasourceConfig)
            })
            // if(!this.getDataSource(defaultDatasourceName)){
            //     throw new Error('missing default database');
            // }
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
            object_name = name
            let objectMap = this.getObjectMap(name);
            if(!objectMap){
                throw new Error(`not find object ${name}`);
            }
            datasource_name = objectMap.datasourceName
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
        if(this._datasources[datasource_name]){
            throw new Error(`datasource ${datasource_name} existed`);
        }
        let datasource = new SteedosDataSourceType(datasource_name, datasourceConfig, this)
        this._datasources[datasource_name] = datasource
    }

    /**
     * 转换对象的引用
     * 包括：app.objects 及 object 的字段有 reference_to 属性的
     * @private
     * @param {SteedosDataSourceType} datasource
     * @memberof SteedosSchema
     * TODO 处理reference_to 为function的情况
     */
    transformReferenceOfObject(datasource: SteedosDataSourceType): void{
        let objects = datasource.getObjects();
        _.each(objects, (object, object_name) => {
            _.each(object.fields, (field, field_name)=>{
                field.transformReferenceOfObject()
            })
        })

        let apps = datasource.getApps()

        _.each(apps, (app, app_name)=>{
            app.transformReferenceOfObject()
        })
    }

    getDataSource(datasource_name: string = defaultDatasourceName) {
        return this._datasources[datasource_name]
    }

    getDataSources(){
        return this._datasources
    }
}
