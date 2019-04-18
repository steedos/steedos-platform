import { Dictionary } from "@salesforce/ts-types";
import { SteedosDataSourceType, SteedosDataSourceTypeConfig } from ".";
import _ = require("underscore");

const defaultDatasourceName = 'default';

export type SteedosSchemaConfig = {
    datasources: Dictionary<SteedosDataSourceTypeConfig>
}

export class SteedosSchema {
    private _datasources: Dictionary<SteedosDataSourceType> = {};
    

    constructor(config: SteedosSchemaConfig) {
        _.each(config.datasources, (datasource, datasource_name) => {
            this.setDataSource(datasource_name, datasource)
        })

        if(!this.getDataSource(defaultDatasourceName)){
            throw new Error('missing default database');
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

    setDataSource(datasource_name: string, datasourceConfig: SteedosDataSourceTypeConfig) {
        this._datasources[datasource_name] = new SteedosDataSourceType(datasourceConfig, this)
    }

    getDataSource(datasource_name: string) {
        return this._datasources[datasource_name]
    }

    getDataSources(){
        return this._datasources
    }
}
