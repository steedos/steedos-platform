import { SteedosActionTypeConfig } from './action'
import _ = require('lodash')
import path = require('path')
import fs = require('fs')
import { getRandomString } from '../util'
import { ValidatorManager } from '../validators';
import { SteedosObjectTypeConfig, SteedosListenerConfig, SteedosObjectPermissionTypeConfig } from '.'
var util = require('../util')
var clone = require('clone')
var globby = require('globby');

export const SYSTEM_DATASOURCE = '__SYSTEM_DATASOURCE';
export const MONGO_BASE_OBJECT = '__MONGO_BASE_OBJECT';
export const SQL_BASE_OBJECT = '__SQL_BASE_OBJECT';
const _objectConfigs: Array<SteedosObjectTypeConfig> = [];
const _routerConfigs: Array<any> = [];
const _permissionSets: Array<any> = [];
const _clientScripts: Array<string> = [];
const _serverScripts: Array<string> = [];

export const getObjectConfigs = (datasource: string) => {
    if (datasource) {
        return _.filter(_objectConfigs, {datasource: datasource})
    } else {
        return _objectConfigs
    }
}

export const getObjectConfig = (object_name: string):SteedosObjectTypeConfig => {
    return _.find(_objectConfigs, {name: object_name})
}

export function addObjectConfigFiles(filePath: string, datasource: string){
    if(!path.isAbsolute(filePath)){
        throw new Error(`${filePath} must be an absolute path`);
    }

    if (!datasource)
      datasource = 'default'

    let objectJsons = util.loadObjects(filePath)
    _.each(objectJsons, (json: SteedosObjectTypeConfig) => {
        addObjectConfig(json, datasource);
    })

    let triggerJsons = util.loadTriggers(filePath)
    _.each(triggerJsons, (json: SteedosListenerConfig) => {
        addObjectListenerConfig(json);
    })
    
    addClientScriptFiles(filePath);
    addServerScriptFiles(filePath);
}

export const addServerScriptFiles = (filePath: string) => {
    const filePatten = [
        path.join(filePath, "*.object.js"),
    ]
    const matchedPaths:[string] = globby.sync(filePatten);
    _.each(matchedPaths, (matchedPath:string)=>{
        _serverScripts.push(matchedPath)
    })
}

export const getServerScripts = () => {
    return _serverScripts;
}

export const  addClientScriptFiles = (filePath: string) => {
    const filePatten = [
        path.join(filePath, "*.client.js")
    ]
    let matchedPaths: Array<string> = globby.sync(filePatten);
    matchedPaths = _.sortBy(matchedPaths)
    _.each(matchedPaths, (matchedPath) => {
        let code = fs.readFileSync(matchedPath, 'utf8');
        _clientScripts.push(code)
    })
}

export const getClientScripts = () => {
    return _clientScripts;
}


export const addObjectConfig = (objectConfig: SteedosObjectTypeConfig, datasource: string) => {
    let object_name = objectConfig.name;
    let config:SteedosObjectTypeConfig = {
        name: object_name,
        fields: {}
    }
    if (object_name === MONGO_BASE_OBJECT || object_name === SQL_BASE_OBJECT) {
        config = clone(objectConfig);
    }
    else if (objectConfig.extend){
        object_name = objectConfig.extend
        let parentObjectConfig = getObjectConfig(object_name);
        if(_.isEmpty(parentObjectConfig)){
            throw new Error(`Object extend failed, object not exist: ${objectConfig.extend}`);
        }
        config = util.extend(config, clone(parentObjectConfig), clone(objectConfig));
        delete config.extend
    } else {
        if (datasource === 'default') {
            let baseObjectConfig = getObjectConfig(MONGO_BASE_OBJECT);
            config = util.extend(config, clone(baseObjectConfig), clone(objectConfig));
        } else {
            let coreObjectConfig = getObjectConfig(SQL_BASE_OBJECT);
            config = util.extend(config, clone(coreObjectConfig), clone(objectConfig));
        }
    }
    config.datasource = datasource;
    _.remove(_objectConfigs, {name: object_name});
    _objectConfigs.push(config)
}

export const addObjectListenerConfig = (json: SteedosListenerConfig) => {
    if (!json.listenTo) {
        throw new Error('missing attribute listenTo')
    }

    if (!_.isString(json.listenTo) && !_.isFunction(json.listenTo)) {
        throw new Error('listenTo must be a function or string')
    }

    let object_name = '';

    if (_.isString(json.listenTo)) {
        object_name = json.listenTo
    } else if (_.isFunction(json.listenTo)) {
        object_name = json.listenTo()
    }

    let object = getObjectConfig(object_name);
    if (object) {
        if(!object.listeners){
            object.listeners = {}
        }
        delete json.listenTo
        json.name = getRandomString(10);
        object.listeners[json.name] = json
    } else {
        throw new Error(`Error add listener, object not found: ${object_name}`);
    }
}

export const loadStandardObjects = () => {

    ValidatorManager.loadCoreValidators();

    let standardObjectsDir = path.dirname(require.resolve("@steedos/standard-objects"))
    let baseObject = util.loadFile(path.join(standardObjectsDir, "base.object.yml"))
    baseObject.name = MONGO_BASE_OBJECT;
    addObjectConfig(baseObject, SYSTEM_DATASOURCE);
    let baseObjectJs = util.loadFile(path.join(standardObjectsDir, "base.object.js"))
    baseObjectJs.extend = MONGO_BASE_OBJECT;
    addObjectConfig(baseObjectJs, SYSTEM_DATASOURCE);
    let baseObjectTrigger = util.loadFile(path.join(standardObjectsDir, "base.trigger.js"))
    baseObjectTrigger.listenTo = MONGO_BASE_OBJECT
    addObjectListenerConfig(baseObjectTrigger)

    let coreObject = util.loadFile(path.join(standardObjectsDir, "core.object.yml"))
    coreObject.name = SQL_BASE_OBJECT;
    addObjectConfig(coreObject, SYSTEM_DATASOURCE);
    let coreObjectTrigger = util.loadFile(path.join(standardObjectsDir, "core.objectwebhooks.trigger.js"))
    coreObjectTrigger.listenTo = SQL_BASE_OBJECT
    addObjectListenerConfig(coreObjectTrigger)

    addObjectConfigFiles(path.join(standardObjectsDir, "**"), 'default');
}

export const addRouterConfig = (prefix: string, router: any) => {
    if (!prefix) 
        throw new Error(`Error add router, prefix required`);
    _.remove(_routerConfigs, {prefix: prefix});
    _routerConfigs.push({prefix: prefix, router: router})
}

export const getRouterConfigs = () => {
    return _routerConfigs
}

export function addObjectMethod(objectName: string, methodName: string, method: Function){
    
    let object = getObjectConfig(objectName);
    if (!object) 
        throw new Error(`Error add method ${methodName}, object not found: ${objectName}`);

    if(!object.methods){
        object.methods = {}
    }
    object.methods[methodName] = method
}

export function addObjectAction(objectName: string, actionConfig: SteedosActionTypeConfig){
    
    if (!actionConfig.name) 
        throw new Error(`Error add action, name required`);

    let object = getObjectConfig(objectName);
    if (!object) 
        throw new Error(`Error add action ${actionConfig.name}, object not found: ${objectName}`);

    if(!object.actions){
        object.actions = {}
    }
    object.actions[actionConfig.name] = actionConfig;
}

export function addObjectPermission(objectName: string, permissionConfig: SteedosObjectPermissionTypeConfig){
    
    if (!permissionConfig.name) 
        throw new Error(`Error add permission, name required`);

    let object = getObjectConfig(objectName);
    if (!object) 
        throw new Error(`Error add permission ${permissionConfig.name}, object not found: ${objectName}`);

    if(!object.permissions){
        object.permissions = {}
    }
    object.permissions[permissionConfig.name] = permissionConfig;
}

export function addPermissionSet(_id: string, name: string) {
    if (getPermissionSet(_id))
        _.remove(_permissionSets, {_id: _id});
    _permissionSets.push({_id: _id, name: name})
}

export function getPermissionSet(_id: string){    
    return _.find(_permissionSets, {_id: _id})
}


