import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType, SteedosDataSourceType } from ".";
import { SteedosDataSourceTypeConfig } from "./datasource";
import { SteedosObjectTypeConfig } from "./object";
import _ = require("underscore");

export type SteedosSchemaConfig = {
    objects: Dictionary<SteedosObjectTypeConfig>
    datasource: SteedosDataSourceTypeConfig
}

export class SteedosSchema {
    _objects: Dictionary<SteedosObjectType> = {}
    _datasource: SteedosDataSourceType

    constructor(config: SteedosSchemaConfig) {
        _.each(config.objects, (object, object_name) =>{
            this.setObject(object_name, object)
        }) 
    }

    setObject(object_name: string, objectConfig: SteedosObjectTypeConfig) {
        let object = new SteedosObjectType(object_name, this, objectConfig)
        this._objects[object_name] = object;
    }

    getObject(name: string) {
        return this._objects[name]
    }
    
    removeObject(name: string) {
        delete this._objects[name]
    }

    getDataSource() {
        return this._datasource
    }
}
