import { SteedosActionTypeConfig } from './action'
import _ = require('lodash')
import path = require('path')
import { getRandomString } from '../util'
import { SteedosObjectTypeConfig, SteedosListenerConfig, SteedosAppTypeConfig, SteedosReportTypeConfig } from '.'
var util = require('../util')
var clone = require('clone')

const MONGO_BASE_OBJECT = '__MONGO_BASE_OBJECT';
const SQL_BASE_OBJECT = '__SQL_BASE_OBJECT';
const _objectConfigs: Array<SteedosObjectTypeConfig> = [];
const _appConfigs: Array<SteedosAppTypeConfig> = [];
const _reportConfigs: Array<any> = [];
const _routerConfigs: Array<any> = [];

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

}
export const addObjectConfig = (objectConfig: SteedosObjectTypeConfig, datasource: string) => {
    let object_name = objectConfig.name;
    let config:SteedosObjectTypeConfig = {
        name: object_name,
        datasource: datasource,
        fields: {}
    }
    if (object_name === MONGO_BASE_OBJECT || object_name === SQL_BASE_OBJECT) {
        config = clone(objectConfig);
    }
    else if (objectConfig.extend){
        let parentObjectConfig = getObjectConfig(object_name);
        if(_.isEmpty(parentObjectConfig)){
            throw new Error(`Extended failed, object not exist: ${objectConfig.extend}`);
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

export const loadBaseObject = () => {
    let standardObjectsDir = path.dirname(require.resolve("@steedos/standard-objects"))
    let baseObject = util.loadFile(path.join(standardObjectsDir, "base.object.yml"))
    baseObject.name = MONGO_BASE_OBJECT;
    addObjectConfig(baseObject, 'default');
    console.log(baseObject)
    let baseObjectTrigger = util.loadFile(path.join(standardObjectsDir, "base.trigger.js"))
    baseObjectTrigger.listenTo = MONGO_BASE_OBJECT
    addObjectListenerConfig(baseObjectTrigger)

    let coreObject = util.loadFile(path.join(standardObjectsDir, "core.object.yml"))
    coreObject.name = SQL_BASE_OBJECT;
    addObjectConfig(coreObject, 'default');
    let coreObjectTrigger = util.loadFile(path.join(standardObjectsDir, "core.objectwebhooks.trigger.js"))
    coreObjectTrigger.listenTo = SQL_BASE_OBJECT
    addObjectListenerConfig(coreObjectTrigger)
}

export const addAppConfig = (appConfig: SteedosAppTypeConfig, datasource: string) => {
    if (!appConfig.name) 
        throw new Error(`Error add app, name undefined`);
    _.remove(_appConfigs, {name: appConfig.name});
    _appConfigs.push(appConfig)
}

export const getAppConfigs = () => {
    return _appConfigs
}

export const getAppConfig = (appName: string):SteedosAppTypeConfig => {
    return _.find(_appConfigs, {name: appName})
}

export const addReportConfig = (config: SteedosReportTypeConfig, datasource: string) => {
    if (!config.name) 
        throw new Error(`Error add app, name undefined`);
    _.remove(_reportConfigs, {name: config.name});
    _reportConfigs.push(config)
}

export const getReportConfigs = () => {
    return _reportConfigs
}

export const getReportConfig = (name: string):SteedosAppTypeConfig => {
    return _.find(_reportConfigs, {name: name})
}

export const addRouterConfig = (config: SteedosReportTypeConfig, datasource: string) => {
    if (!config.name) 
        throw new Error(`Error add app, name undefined`);
    _.remove(_routerConfigs, {name: config.name});
    _routerConfigs.push(config)
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
        throw new Error(`Error add action, name undefined`);

    let object = getObjectConfig(objectName);
    if (!object) 
        throw new Error(`Error add action ${actionConfig.name}, object not found: ${objectName}`);

    if(!object.actions){
        object.actions = {}
    }
    object.actions[actionConfig.name] = actionConfig;
}

loadBaseObject();