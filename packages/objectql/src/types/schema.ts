import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType, SteedosDataSourceType, SteedosDataSourceTypeConfig } from ".";
import { buildGraphQLSchema } from "../graphql"
import _ = require("underscore");
import { SteedosIDType } from ".";

export type SteedosSchemaConfig = {
    datasources: Dictionary<SteedosDataSourceTypeConfig>,
    getRoles?: Function
}

export class SteedosSchema {
    private _objects: Dictionary<SteedosObjectType> = {};
    private _datasources: Dictionary<SteedosDataSourceType> = {};
    private _getRoles: Function;

    constructor(config: SteedosSchemaConfig) {

        if (config.getRoles && !_.isFunction(config.getRoles)) {
            throw new Error('getRoles must be a function')
        }

        this._getRoles = config.getRoles
        _.each(config.datasources, (datasource, datasource_name) => {
            this.setDataSource(datasource_name, datasource)
        })
    }

    async getRoles(userId: SteedosIDType) {
        if (this._getRoles) {
            return await this._getRoles(userId)
        } else {
            return ['admin']
        }
    }

    setObject(name: string , object: SteedosObjectType){
        this._objects[name] = object
    }

    getObject(name: string) {
        return this._objects[name]
    }

    getObjects() {
        return this._objects;
    }

    removeObject(name: string) {
        delete this._objects[name]
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

    buildGraphQLSchema() {
        return buildGraphQLSchema(this);
    }
}
