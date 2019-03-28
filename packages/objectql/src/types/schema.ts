import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType, SteedosDataSourceType, SteedosObjectTypeConfig, SteedosDataSourceTypeConfig, SteedosObjectPermissionTypeConfig, SteedosObjectPermissionType } from ".";
import { buildGraphQLSchema } from "../graphql"
import _ = require("underscore");
import { SteedosIDType } from "./field_types";


var util = require('../util')

export type SteedosSchemaConfig = {
    objects: Dictionary<SteedosObjectTypeConfig>
    datasource: SteedosDataSourceTypeConfig,
    roles?: string[],
    object_permissions?: Dictionary<SteedosObjectPermissionTypeConfig>,
    getRoles?: Function
}

export class SteedosSchema {
    private _objects: Dictionary<SteedosObjectType> = {};
    private _datasource: SteedosDataSourceType;
    private _object_permissions: Dictionary<Dictionary<SteedosObjectPermissionType>> = {}
    private _getRoles: Function;

    constructor(config: SteedosSchemaConfig) {
        this.setDataSource(config.datasource)

        _.each(config.objects, (object, object_name) => {
            this.setObject(object_name, object)
        })
    }

    getRoles(userId: SteedosIDType){
        if(this._getRoles){
            return this._getRoles()
        }else{
            return ['admin']
        }
    }

    setObjectPermission(object_permission: SteedosObjectPermissionTypeConfig){
        let objectPermissions = this._object_permissions[object_permission.object_name]
        if(!objectPermissions){
            this._object_permissions[object_permission.object_name] = {}
        }
        this._object_permissions[object_permission.object_name][object_permission.name] = new SteedosObjectPermissionType(object_permission)
    }

    async connect(){
        await this.getDataSource().connect()
    }

    async use(filePath){
       let jsons = util.loadObjects(filePath)
       _.each(jsons, (json:SteedosObjectTypeConfig)=>{
            this.setObject(json.name, json)
       })
    }

    setObject(object_name: string, objectConfig: SteedosObjectTypeConfig) {
        let object = new SteedosObjectType(object_name, this, objectConfig)
        this._objects[object_name] = object;
    }

    getObject(name: string) {
        return this._objects[name]
    }

    getObjects(){
        return this._objects;
    }

    removeObject(name: string) {
        delete this._objects[name]
    }

    setDataSource(datasourceConfig: SteedosDataSourceTypeConfig) {
        this._datasource = new SteedosDataSourceType(datasourceConfig)
    }

    getDataSource() {
        return this._datasource
    }

    buildGraphQLSchema(){
        return buildGraphQLSchema(this);
    }
}
