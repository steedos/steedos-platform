import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType, SteedosDataSourceType, SteedosObjectTypeConfig, SteedosDataSourceTypeConfig, SteedosUserType } from ".";
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

    async connect(){
        await this.getDataSource().connect()
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

    private useFile(filePath: string){
        if(!path.isAbsolute(filePath)){
            filePath = path.resolve(filePath)
        }
    
        if(!fs.existsSync(filePath)){
            throw new Error(`${filePath} not exist`);
        }
    
        if(util.isObjectFile(filePath)){
            let objectConfig:SteedosObjectTypeConfig = util.loadFile(filePath);
            this.setObject(objectConfig.name, objectConfig)
        }
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
