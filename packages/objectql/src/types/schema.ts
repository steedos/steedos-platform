import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType, SteedosDataSourceType, SteedosDataSourceTypeConfig, SteedosObjectPermissionTypeConfig, SteedosObjectPermissionType } from ".";
import { buildGraphQLSchema } from "../graphql"
import _ = require("underscore");
import { SteedosIDType } from ".";

export type SteedosSchemaConfig = {
    datasources: Dictionary<SteedosDataSourceTypeConfig>,
    roles?: string[],
    object_permissions?: Dictionary<Dictionary<SteedosObjectPermissionTypeConfig>>,
    getRoles?: Function
}

export class SteedosSchema {
    private _objects: Dictionary<SteedosObjectType> = {};
    private _datasources: Dictionary<SteedosDataSourceType> = {};
    private _object_permissions: Dictionary<Dictionary<SteedosObjectPermissionType>> = {}
    private _getRoles: Function;

    constructor(config: SteedosSchemaConfig) {

        if (config.getRoles && !_.isFunction(config.getRoles)) {
            throw new Error('getRoles must be a function')
        }

        this._getRoles = config.getRoles
        _.each(config.datasources, (datasource, datasource_name) => {
            this.setDataSource(datasource_name, datasource)
        })

        _.each(config.object_permissions, (object_permissions, object_name) => {
            _.each(object_permissions, (object_permission, object_permission_name)=>{
                object_permission.name = object_permission_name
                this.setObjectPermission(object_name, object_permission)
            })
        })
    }

    async getRoles(userId: SteedosIDType) {
        if (this._getRoles) {
            return await this._getRoles(userId)
        } else {
            return ['admin']
        }
    }

    setObjectPermission(object_name: string, object_permission: SteedosObjectPermissionTypeConfig) {
        let objectPermissions = this._object_permissions[object_name]
        if (!objectPermissions) {
            this._object_permissions[object_name] = {}
        }
        this._object_permissions[object_name][object_permission.name] = new SteedosObjectPermissionType(object_name, object_permission)
    }

    getObjectPermissions(object_name: string): Dictionary<SteedosObjectPermissionType> {
        return this._object_permissions[object_name]
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
