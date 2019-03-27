import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType, SteedosDataSourceType, SteedosObjectTypeConfig, SteedosDataSourceTypeConfig, SteedosFieldTypeConfig, SteedosUserType } from ".";
import { Project, AppManager, TriggerManager, ReportManager } from '../index'
import { buildGraphQLSchema } from "../graphql"
import _ = require("underscore");
import path = require("path")
import fs = require('fs');
import { SteedosUserObjectType } from "./user_object";

// import async = require('async')

var util = require('../util')

export type SteedosSchemaConfig = {
    objects: Dictionary<SteedosObjectTypeConfig>
    datasource: SteedosDataSourceTypeConfig
    permission_sets: string[]
    //object_permissions: 
}

export class SteedosSchema {
    private _objects: Dictionary<SteedosObjectType> = {};
    private _datasource: SteedosDataSourceType;
    private _users: Dictionary<SteedosUserType> = {};

    constructor(config: SteedosSchemaConfig) {
        this.setDataSource(config.datasource)

        // async.waterfall([async ()=>{
        //     await this.connect();
        // }], function(err){
        //     if(err){
        //         throw new Error(err)
        //     }
        // })

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

    async connect(){
        await this.getDataSource().connect()
    }

    async loadObjectsPermissionsFromDB(){
        var permissions = await this.getObject("permission_objects").find({fields:['_id', 'permission_set_id', 'object_name', 'name', "allowRead", "allowCreate", "allowEdit", "allowDelete", "viewAllRecords", "modifyAllRecords", "viewCompanyRecords", "modifyCompanyRecords", "disabled_list_views", "disabled_actions", "unreadable_fields", "uneditable_fields", "unrelated_objects"]})
        _.each(permissions, (permission: any)=>{
            if(permission && permission.object_name){
                let object = this.getObject(permission.object_name)
                if(object){
                    object.setPermission(permission.permission_set_id, permission)
                }
            }
        })
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

    buildGraphQLSchema(){
        return buildGraphQLSchema(this);
    }

    getUser(userId: string){
        if(_.isUndefined(this._users[userId])){
            this._users[userId] = new SteedosUserType(userId, this)
        }
        return this._users[userId]
    }

    getUserObject(userId: string, objectName: string){
        return new SteedosUserObjectType(this.getUser(userId), this.getObject(objectName))
    }
}
