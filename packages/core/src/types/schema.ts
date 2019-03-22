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
    private _objects: Dictionary<SteedosObjectType> = {};
    private _datasource: SteedosDataSourceType;

    constructor(config: SteedosSchemaConfig) {
        _.each(config.objects, (object, object_name) => {
            this.setObject(object_name, object)
        })
        this.setDataSource(config.datasource)
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

    setDataSource(datasourceConfig: SteedosDataSourceTypeConfig) {
        this._datasource = new SteedosDataSourceType(datasourceConfig)
    }

    getDataSource() {
        return this._datasource
    }

    public get objects(): Dictionary<SteedosObjectType> {
        return this._objects;
    }
    public set objects(value: Dictionary<SteedosObjectType>) {
        this._objects = value;
    }

    public get datasource(): SteedosDataSourceType {
        return this._datasource;
    }
    public set datasource(value: SteedosDataSourceType) {
        this._datasource = value;
    }
}
