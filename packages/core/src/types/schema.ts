import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType, SteedosDataSourceType, SteedosObjectTypeConfig, SteedosDataSourceTypeConfig } from ".";
import { Project, AppManager, TriggerManager, ReportManager } from '../index'
import _ = require("underscore");
import path = require("path")
import fs = require('fs');
import { SteedosFieldTypeConfig } from "./field";
var util = require('../util')

export type SteedosSchemaConfig = {
    objects: Dictionary<SteedosObjectTypeConfig>
    datasource: SteedosDataSourceTypeConfig
}

/**
 * schema = new SteedosSchema({datasource: {}})
 * schema.use('xxxx/src')
 * schema.use('xxxx/meeting.object.js')
 */
export class SteedosSchema {
    private _objects: Dictionary<SteedosObjectType> = {};
    private _datasource: SteedosDataSourceType;

    constructor(config: SteedosSchemaConfig) {
        this.setDataSource(config.datasource)

        _.each(config.objects, (object, object_name) => {
            this.setObject(object_name, object)
        })
    }

    private useFile(filePath: string){
        if(!path.isAbsolute(filePath)){
            filePath = path.resolve(filePath)
        }
    
        if(!fs.existsSync(filePath)){
            throw new Error(`${filePath} not exist`);
        }
    
        if(fs.statSync(filePath).isDirectory()){
            Project.load(filePath, this)
        }
    
        if(util.isAppFile(filePath)){
            AppManager.loadFile(filePath)
        }else if(util.isObjectFile(filePath)){
            let objectConfig:SteedosObjectTypeConfig = util.loadFile(filePath);
            this.setObject(objectConfig.name, objectConfig)
        }else if(util.isTriggerFile(filePath)){
            TriggerManager.loadFile(filePath)
        }else if(util.isFieldFile(filePath)){
            let fieldConfig: SteedosFieldTypeConfig = util.loadFile(filePath);
            
            if(!fieldConfig.name){
                throw new Error('Missing name attribute');
            }
            
            if(!fieldConfig.object_name){
                throw new Error('Missing object_name attribute');
            }
            
            let object = this.getObject(fieldConfig.object_name);
            
            if(!object){
                throw new Error(`not find object ${fieldConfig.object_name}`);
            }
            
            object.setField(fieldConfig.name, fieldConfig)

        }else if(util.isReportFile(filePath)){
            ReportManager.loadFile(filePath)
        }
    }

    //TODO
    use(filePath: string | []){
        if(_.isArray(filePath)){
            filePath.forEach((element) => {
                this.useFile(element)
            });
            return
        }else if(_.isString(filePath)){
            this.useFile(filePath)
            return
        }
        throw new Error('filePath can only be a string or array')
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
