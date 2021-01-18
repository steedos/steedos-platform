import { Dictionary } from '@salesforce/ts-types';
import { SteedosDataSourceType, SteedosDataSourceTypeConfig } from ".";
import { isMeteor, getSteedosConfig } from "../util";
import _ = require("underscore");
import { getFromContainer } from 'typeorm';
import { loadCoreValidators } from '../validators';
import { loadStandardObjects } from './object_dynamic_load';

const defaultDatasourceName = 'default';

export type SteedosSchemaConfig = {
    datasources?: Dictionary<SteedosDataSourceTypeConfig>
}

export class SteedosSchema {
    private _datasources: Dictionary<SteedosDataSourceType> = {};
    private _objectsMap: Dictionary<{datasourceName: string, filePath?: string}> = {}
    
    setObjectMap(objectName:string, options){
        let objectMap = this.getObjectMap(objectName);
        if(objectMap){
            if(objectName != 'base' && objectName != 'core' && objectMap.datasourceName != options.datasourceName){
                throw new Error(`object name ${objectName} is unique, you can set table_name; see: https://developer.steedos.com/developer/object#%E5%AF%B9%E8%B1%A1%E5%90%8D-name`)
            }
        }
        this._objectsMap[objectName] = options
    }

    getObjectMap(objectName: string){
        return this._objectsMap[objectName]
    }

    removeObjectMap(objectName: string){
        delete this._objectsMap[objectName]
    }

    addDataSourceFromSteedosConfig() {
        let config: any = getSteedosConfig();
        if(config && config.datasources){
            _.each(config.datasources, (datasource: any, datasource_name: string)=>{
                datasource = _.extend(datasource, datasource.connection)
                if (datasource_name === 'default') {
                    if (isMeteor())
                        datasource.driver = "meteor-mongo"
                    else
                        datasource.driver = "mongo"
                }
                this.addDataSource(datasource_name, datasource);
            })
        }
    }

    constructor(config?: SteedosSchemaConfig) {
        
        loadCoreValidators();    
        if (isMeteor())
            loadStandardObjects();
            
        if(config){
            _.each(config.datasources, (datasourceConfig, datasource_name) => {
                this.addDataSource(datasource_name, datasourceConfig)
            })
        }
        this.addDataSourceFromSteedosConfig();
    }

    /**
     * 获取对象
     * @param {string} name : {datacource_name}.{object_name} ，如果没有${datacource_name}部分，则默认为default
     * @returns
     * @memberof SteedosSchema
     */
    getObject(name: string) {
        let datasource_name: string, object_name: string;
        if(!name){
            throw new Error('Object name is required');
        }
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

    addDataSource(datasource_name: string, datasourceConfig: SteedosDataSourceTypeConfig, readd?: boolean) {
        if(this._datasources[datasource_name] && !readd){
            throw new Error(`datasource ${datasource_name} existed`);
        }
        let datasource = new SteedosDataSourceType(datasource_name, datasourceConfig, this)
        this._datasources[datasource_name] = datasource
        return datasource;
    }

    async removeDataSource(datasource_name){
        if(datasource_name != defaultDatasourceName){
            let datasource = this._datasources[datasource_name];
            if(datasource){
                delete this._datasources[datasource_name];
                let self = this;
                _.each(this._objectsMap, function(map, key){
                    if(map && map.datasourceName === datasource_name){
                        self.removeObjectMap(key);
                    }
                })
                await datasource.close();
            }
        }else{
            throw new Error('Can not remove default datasource');
        }
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
    }

    getDataSource(datasource_name: string = defaultDatasourceName) {
        return this._datasources[datasource_name]
    }

    getDataSources(){
        return this._datasources
    }
}

export function getSteedosSchema(): SteedosSchema {
    const schema = getFromContainer(SteedosSchema);
    return schema;
}

(function loadRun(){
})();
