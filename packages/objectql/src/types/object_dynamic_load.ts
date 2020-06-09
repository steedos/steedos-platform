import { SteedosActionTypeConfig } from './action'
import _ = require('lodash')
import path = require('path')
import { getMD5, JSONStringify } from '../util'
import { SteedosObjectTypeConfig, SteedosListenerConfig, SteedosObjectPermissionTypeConfig, addAllConfigFiles } from '.'
import { isMeteor, transformListenersToTriggers } from '../util'

var util = require('../util')
var clone = require('clone')
var globby = require('globby');

export const SYSTEM_DATASOURCE = '__SYSTEM_DATASOURCE';
export const MONGO_BASE_OBJECT = '__MONGO_BASE_OBJECT';
export const SQL_BASE_OBJECT = '__SQL_BASE_OBJECT';
const _original_objectConfigs: Array<SteedosObjectTypeConfig> = []; //不包括继承部分
const _objectConfigs: Array<SteedosObjectTypeConfig> = [];
const _routerConfigs: Array<any> = [];
const _clientScripts: Array<string> = [];
const _serverScripts: Array<string> = [];
const _objectsI18n: Array<any> = [];

let standardObjectsLoaded: boolean = false;

const addOriginalObjectConfigs = function(objectName: string, datasource: string, config: SteedosObjectTypeConfig){
    if(objectName === MONGO_BASE_OBJECT || objectName === SQL_BASE_OBJECT){
        return ;
    }
    config.datasource = datasource;
    _.remove(_original_objectConfigs, {name: objectName, datasource: datasource});
    _original_objectConfigs.push(config)
}

const extendOriginalObjectConfig = function(objectName: string, datasource: string, objectConfig: SteedosObjectTypeConfig){
    if(objectName === MONGO_BASE_OBJECT || objectName === SQL_BASE_OBJECT){
        return ;
    }
    let parentOriginalObjectConfig = getOriginalObjectConfig(objectName);
    let originalObjectConfig = util.extend({
        name: objectName,
        fields: {}
    }, clone(parentOriginalObjectConfig), objectConfig);
    addOriginalObjectConfigs(objectName, datasource, clone(originalObjectConfig));
}

export const getOriginalObjectConfig = (object_name: string):SteedosObjectTypeConfig => {
    return _.find(_original_objectConfigs, {name: object_name})
}

export const getOriginalObjectConfigs = (datasource: string) => {
    if (datasource) {
        return _.filter(_original_objectConfigs, {datasource: datasource})
    } else {
        return _original_objectConfigs
    }
}

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

export const addObjectConfigFiles = (filePath: string, datasource: string) => {
    if(!path.isAbsolute(filePath)){
        throw new Error(`${filePath} must be an absolute path`);
    }

    if (!datasource)
      datasource = 'default'

    let objectJsons = util.loadObjects(filePath)
    objectJsons.forEach(element => {
        addObjectConfig(element, datasource);
    });

    let triggerJsons = util.loadTriggers(filePath)
    _.each(triggerJsons, (json: SteedosListenerConfig) => {
        addObjectListenerConfig(json);
    })

    let actions = util.loadActions(filePath)

    _.each(actions, (json: SteedosActionTypeConfig) => {
        addObjectActionConfig(json);
    })
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

export const addObjectI18nFiles = (filePath: string)=>{
    if(!path.isAbsolute(filePath)){
        throw new Error(`${filePath} must be an absolute path`);
    }

    let i18nData = util.loadI18n(filePath)
    i18nData.forEach(element => {
        _objectsI18n.push(element)
    });
}

export const getObjectsI18n = ()=>{
    return _objectsI18n;
}

export const  addClientScriptFiles = (filePath: string) => {
    const filePatten = [
        path.join(filePath, "*.client.js")
    ]
    let matchedPaths: Array<string> = globby.sync(filePatten);
    matchedPaths = _.sortBy(matchedPaths)
    _.each(matchedPaths, (matchedPath) => {
        _clientScripts.push(matchedPath)
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
        extendOriginalObjectConfig(object_name, datasource, clone(objectConfig));
    } else {
        addOriginalObjectConfigs(object_name, datasource, clone(objectConfig));
        if (isMeteor() && (datasource === 'default')) {
            let baseObjectConfig = getObjectConfig(MONGO_BASE_OBJECT);
            // 确保字段顺序正确，避免base中的字段跑到前面
            config.fields = _.clone(objectConfig.fields);
            config = util.extend(config, clone(baseObjectConfig), clone(objectConfig));
        } else {
            let coreObjectConfig = getObjectConfig(SQL_BASE_OBJECT);
            // 确保字段顺序正确，避免base中的字段跑到前面
            config.fields = _.clone(objectConfig.fields);
            config = util.extend(config, clone(coreObjectConfig), clone(objectConfig));
        }
    }
    config.datasource = datasource;
    _.remove(_objectConfigs, {name: object_name, datasource: datasource});
    delete config.__filename
    _objectConfigs.push(config)
}

export const removeObjectConfig = (object_name: string, datasource: string)=>{
    _.remove(_objectConfigs, {name: object_name, datasource: datasource});
    _.remove(_original_objectConfigs, {name: object_name, datasource: datasource});
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
        json.name = json._id || getMD5(JSONStringify(json));
        object.listeners[json.name] = json
        if(object.datasource === 'default'){
            util.extend(object, {triggers: transformListenersToTriggers(object, json)})
        }
    } else {
        throw new Error(`Error add listener, object not found: ${object_name}`);
    }
}

export const addObjectActionConfig = (json: SteedosActionTypeConfig)=>{
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
        _.each(object.actions, function(action, key){
            if(json[key]){
                action.todo = json[key]
            }
            if(json[`${key}Visible`]){
                action.visible = json[`${key}Visible`]
            }
        })
    } else {
        throw new Error(`Error add action, object not found: ${object_name}`);
    }
}

export const removeObjectListenerConfig = (_id, listenTo, when)=>{
    if(!_id){
        throw new Error('[config._id] Can not be empty. can not remove object listener.');
    }
    if (!listenTo) {
        throw new Error('missing attribute listenTo')
    }

    if (!_.isString(listenTo) ) {
        throw new Error('listenTo must be a string')
    }

    let object_name = '';

    if (_.isString(listenTo)) {
        object_name = listenTo
    }

    let object:any = getObjectConfig(object_name);
    if (object) {
        if(object.listeners){
            delete object.listeners[_id]
        }

        if(object.triggers){
            delete object.triggers[`${_id}_${when}`]
        }

    } else {
        throw new Error(`Error remove listener, object not found: ${object_name}`);
    }
}

export const loadStandardObjects = () => {
    
    if (standardObjectsLoaded)
        return;

    standardObjectsLoaded = true;

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

    addAllConfigFiles(path.join(standardObjectsDir, "**"), 'default');
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

//TODO 写入到addOriginalObjectConfigs
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

