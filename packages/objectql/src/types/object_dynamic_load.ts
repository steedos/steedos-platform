import _ = require('lodash')
import path = require('path')
import { SteedosObjectTypeConfig, SteedosObjectPermissionTypeConfig, SteedosActionTypeConfig, getDataSource } from '.'
// import { isMeteor } from '../util'
import { Dictionary } from '@salesforce/ts-types';
import { addObjectListenerConfig, loadObjectLayouts, loadSourceProfiles, loadSourcePermissionset, loadObjectValidationRules, loadSourceRoles, loadSourceFlowRoles, loadSourceApprovalProcesses, loadSourceWorkflows, loadStandardProfiles, loadStandardPermissionsets, preloadDBObjectFields, preloadDBObjectButtons, preloadDBApps, preloadDBObjectLayouts, preloadDBTabs, preloadDBShareRules, preloadDBRestrictionRules, preloadDBPermissionFields, loadPackageMetadatas } from '../dynamic-load'
import { transformListenersToTriggers } from '..';
import { getSteedosSchema } from './schema';
import { syncMatchFiles } from '@steedos/metadata-core';
var util = require('../util')
var clone = require('clone')

export const SYSTEM_DATASOURCE = '__SYSTEM_DATASOURCE';
export const MONGO_BASE_OBJECT = '__MONGO_BASE_OBJECT';
export const SQL_BASE_OBJECT = '__SQL_BASE_OBJECT';
const _original_objectConfigs: Array<SteedosObjectTypeConfig> = []; //不包括继承部分
const _objectConfigs: Array<SteedosObjectTypeConfig> = [];
const _routerConfigs: Array<any> = [];
const _clientScripts: Array<string> = [];
const _serverScripts: Array<string> = [];
const _objectsI18n: Array<any> = [];
const _routers: Array<any> = [];
const _objectsData: Dictionary<any> = {};
const delayLoadExtendObjectConfigQueue: Dictionary<any> = {};
let standardObjectsLoaded: boolean = false;
let dbMetadataLoaing: boolean = false;

const addDelayLoadExtendObjectConfig = function (extend: string, config: SteedosObjectTypeConfig){
    if(!delayLoadExtendObjectConfigQueue[extend]){
        delayLoadExtendObjectConfigQueue[extend] = [];
    }
    delayLoadExtendObjectConfigQueue[extend].push(config);
}

export const addOriginalObjectConfigs = function(objectName: string, datasource: string, config: SteedosObjectTypeConfig){
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

const perfectObjectConfig = (objectConfig: SteedosObjectTypeConfig)=>{
    _.each(objectConfig.fields, (field: SteedosObjectTypeConfig, key: string)=>{
        if(!field.name){
            field.name = key;
        }
    })
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

export const getObjectConfigs = (datasource?: string) => {
    if (datasource) {
        return _.filter(_objectConfigs, {datasource: datasource})
    } else {
        return _objectConfigs
    }
}

export const getObjectConfig = (object_name: string):SteedosObjectTypeConfig => {
    return _.find(_objectConfigs, {name: object_name})
}

export const addObjectConfigFiles = async (filePath: string, datasource: string, serviceName?: string) => {
    if(!path.isAbsolute(filePath)){
        throw new Error(`${filePath} must be an absolute path`);
    }

    if (!datasource)
      datasource = 'meteor'

    await loadPackageMetadatas(filePath, datasource, serviceName)

    await loadObjectLayouts(filePath, serviceName);
    // await loadObjectPermissions(filePath, serviceName);
    await loadSourceProfiles(filePath, serviceName);
    await loadSourcePermissionset(filePath, serviceName);
    
    loadObjectValidationRules(filePath, serviceName);

    loadSourceRoles(filePath);

    loadSourceFlowRoles(filePath);

    loadSourceApprovalProcesses(filePath);

    loadSourceWorkflows(filePath);
}

export const addServerScriptFiles = (filePath: string) => {
  const filePatten = [
    path.join(filePath, "*.object.js"),
    "!" + path.join(filePath, "node_modules"),
  ];
  const matchedPaths: [string] = syncMatchFiles(filePatten);
  _.each(matchedPaths, (matchedPath: string) => {
    _serverScripts.push(matchedPath);
  });
};

export const getServerScripts = () => {
  return _serverScripts;
};

export const addObjectI18nFiles = (filePath: string) => {
  if (!path.isAbsolute(filePath)) {
    throw new Error(`${filePath} must be an absolute path`);
  }

  let i18nData = util.loadI18n(filePath);
  i18nData.forEach((element) => {
    _objectsI18n.push(element);
  });
};

export const getObjectsI18n = () => {
  return _objectsI18n;
};

export const addRouterFiles = (filePath: string) => {
  if (!path.isAbsolute(filePath)) {
    throw new Error(`${filePath} must be an absolute path`);
  }
  let routersData = util.loadRouters(filePath);
  routersData.forEach((element) => {
    _routers.push(element);
  });
};

export const getRouters = () => {
  return _routers;
};

export const addClientScriptFiles = (filePath: string) => {
  const filePatten = [
    path.join(filePath, "*.client.js"),
    "!" + path.join(filePath, "node_modules"),
  ];
  let matchedPaths: Array<string> = syncMatchFiles(filePatten);
  matchedPaths = _.sortBy(matchedPaths);
  _.each(matchedPaths, (matchedPath) => {
    _clientScripts.push(matchedPath);
  });
};

export const getClientScriptsFiles = () => {
    return _.uniq(_clientScripts);
}


export const addObjectConfig = async (objectConfig: SteedosObjectTypeConfig, datasource: string, serviceName?: string) => {
    let object_name = objectConfig.name;
    if(serviceName && getSteedosSchema().metadataRegister){
        if(datasource){
            objectConfig.datasource = datasource
        }
        if(!objectConfig.extend){
            objectConfig.isMain = true;
        }
        await getSteedosSchema().metadataRegister.addObjectConfig(serviceName, objectConfig);
    }
    // if(true){return;}
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
            return addDelayLoadExtendObjectConfig(objectConfig.extend, objectConfig);
            throw new Error(`Object extend failed, object not exist: ${objectConfig.extend}`);
        }
        config = util.extend(config, clone(parentObjectConfig), clone(objectConfig));
        config.name = object_name;
        delete config.extend
        datasource = parentObjectConfig.datasource
        extendOriginalObjectConfig(object_name, datasource, clone(objectConfig));
    } else {
        addOriginalObjectConfigs(object_name, datasource, clone(objectConfig));
        if (datasource === 'default' || datasource === 'meteor') { // isMeteor() && (datasource === 'default')
            let baseObjectConfig = getObjectConfig(MONGO_BASE_OBJECT);
            // 确保字段顺序正确，避免base中的字段跑到前面
            config.fields = _.clone(objectConfig.fields);
            let _baseObjectConfig = clone(baseObjectConfig);
            delete _baseObjectConfig.hidden;
            if(datasource === 'meteor'){
                _.each(_baseObjectConfig.listeners, function(license){
                    const triggers = transformListenersToTriggers(config, license)
                    util.extend(config, {triggers, _baseTriggers: triggers})
                })
            }
            config = util.extend(config, _baseObjectConfig, clone(objectConfig));
        } else {
            let coreObjectConfig = getObjectConfig(SQL_BASE_OBJECT);
            // 确保字段顺序正确，避免base中的字段跑到前面
            config.fields = _.clone(objectConfig.fields);
            let _coreObjectConfig = clone(coreObjectConfig)
            delete _coreObjectConfig.hidden;
            config = util.extend(config, _coreObjectConfig, clone(objectConfig));
        }
    }
    config.datasource = datasource;
    _.remove(_objectConfigs, {name: object_name, datasource: datasource});
    delete config.__filename
    perfectObjectConfig(config)
    _objectConfigs.push(config);
    const delayLoadQueue = clone(delayLoadExtendObjectConfigQueue[object_name]);
    if(delayLoadQueue && delayLoadQueue.length > 0){
        delayLoadExtendObjectConfigQueue[object_name] = [];
        for (const index in delayLoadQueue) {
            const delayLoadConfig = delayLoadQueue[index]
            await addObjectConfig(delayLoadConfig, delayLoadConfig.datasource, null)
        }
    }

}

export const removeObjectConfig = (object_name: string, datasource: string)=>{
    _.remove(_objectConfigs, {name: object_name, datasource: datasource});
    _.remove(_original_objectConfigs, {name: object_name, datasource: datasource});
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

export const loadStandardMetadata = async (serviceName: string, datasourceApiName: string) => {
    await loadStandardBaseObjects(serviceName);
    if (dbMetadataLoaing != true) {
        await loadStandardProfiles(serviceName);
        await loadStandardPermissionsets(serviceName);
        await loadDbMetadatas(datasourceApiName);
        dbMetadataLoaing = true;
    }
}

export const loadDbMetadatas = async (datasourceApiName: string) => {
    if(datasourceApiName === 'default' || datasourceApiName === 'meteor'){
        const datasource = getDataSource(datasourceApiName)
        if(datasource && datasourceApiName === 'default'){
            await datasource.initTypeORM();
        }
        if(datasource){
            await preloadDBApps(datasource);
            await preloadDBTabs(datasource);
            await preloadDBObjectLayouts(datasource);
            await preloadDBObjectFields(datasource);
            await preloadDBObjectButtons(datasource);
            await preloadDBShareRules(datasource);
            await preloadDBRestrictionRules(datasource);
            await preloadDBPermissionFields(datasource);
        }
    }
}

export const loadStandardBaseObjects = async (serviceName: string) => {
    
    if (standardObjectsLoaded)
        return;

    standardObjectsLoaded = true;

    let standardObjectsDir = path.dirname(require.resolve("@steedos/standard-objects"))
    let baseObject = util.loadFile(path.join(standardObjectsDir, "base.object.yml"))
    baseObject.name = MONGO_BASE_OBJECT;
    await addObjectConfig(baseObject, SYSTEM_DATASOURCE, serviceName);
    let baseObjectJs = util.loadFile(path.join(standardObjectsDir, "base.object.js"))
    baseObjectJs.extend = MONGO_BASE_OBJECT;
    await addObjectConfig(baseObjectJs, SYSTEM_DATASOURCE, serviceName);
    const baseTriggers = ['base.trigger.js', 'base.autonumber.trigger.js','base.masterDetail.trigger.js','base.objectwebhooks.trigger.js','base.recordFieldAudit.trigger.js','base.recordRecentView.trigger.js','base.tree.trigger.js','base.calendar.trigger.js','base.defaultValue.trigger.js'];
    _.forEach(baseTriggers, function(triggerFileName){
        let baseObjectTrigger = util.loadFile(path.join(standardObjectsDir, triggerFileName))
        baseObjectTrigger.listenTo = MONGO_BASE_OBJECT
        addObjectListenerConfig(baseObjectTrigger)
    })

    let coreObject = util.loadFile(path.join(standardObjectsDir, "core.object.yml"))
    coreObject.name = SQL_BASE_OBJECT;
    await addObjectConfig(coreObject, SYSTEM_DATASOURCE, serviceName);

    const coreTriggers = ['core.objectwebhooks.trigger.js','core.defaultValue.trigger.js','core.autonumber.trigger.js'];
    _.forEach(coreTriggers, function(triggerFileName){
        let coreObjectTrigger = util.loadFile(path.join(standardObjectsDir, triggerFileName))
        coreObjectTrigger.listenTo = SQL_BASE_OBJECT
        addObjectListenerConfig(coreObjectTrigger)
    })

    // addAllConfigFiles(path.join(standardObjectsDir, "**"), 'default');
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

export function getAllObjectData(){
    return _objectsData
}

export function getObjectData(objectName){
    return _objectsData[objectName]
}

export function setObjectData(objectName, records){
    if(_objectsData[objectName]){
        _objectsData[objectName].concat(records)
    }else{
        _objectsData[objectName] = records
    }
}

export function addObjectDataFiles(filePath: string){
    let result = util.loadObjectDataFiles(filePath);
    _.each(result, function(item){
        if(item.objectName){
            setObjectData(item.objectName, item.records);
        }
    })
}