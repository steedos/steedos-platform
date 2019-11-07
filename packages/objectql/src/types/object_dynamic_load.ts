import { SteedosActionTypeConfig } from './action'
import _ = require('lodash')
import path = require('path')
import crypto = require('crypto')
import { transformTrigger, getRandomString } from '../util'
import { SteedosObjectTypeConfig, SteedosListenerConfig } from '.'
var util = require('../util')
var clone = require('clone')

function makeTriggerName(trigger){
    var md5 = crypto.createHash('md5');
    return md5.update(trigger.toString()).digest('hex') + _.random(0, 1000000);
}

const SYSTEM_DATASOURCE = '__SYSTEM__';
const MONGO_BASE_OBJECT = '__MONGO_BASE_OBJECT';
const SQL_BASE_OBJECT = '__SQL_BASE_OBJECT';
const _objectConfigs: Array<SteedosObjectTypeConfig> = [];

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
        throw new Error(`Error setting listener, object not found: ${object_name}`);
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
loadBaseObject();
export class objectDynamicLoad {
    static objectPathList = [];
    static appList = [];
    static methodList = [];
    static triggerList = [];
    static actionList = [];
    static routerList = [];
    // static reportList = [];

    static getObjectFiles(datasourceName: string){
        return _.filter(this.objectPathList, (item)=>{
            return item.datasourceName === datasourceName
        })
    }

    static getApps(){
        return this.appList
    }

    static getMethods(objectName: string){
        return _.filter(this.methodList, (item)=>{
            return item.objectName === objectName
        })
    }

    static getTriggers(objectName: string){
        return _.filter(this.triggerList, (item)=>{
            return item.objectName === objectName
        })
    }

    static getActions(objectName: string){
        return _.filter(this.actionList, (item)=>{
            return item.objectName === objectName
        })
    }

    static getRouters(){
        return this.routerList
    }
}


export function addApps(filePath: string){
    if(!path.isAbsolute(filePath)){
        throw new Error(`${filePath} must be an absolute path`);
    }
    
    objectDynamicLoad.appList.push({filePath})
}

// export function addReports(filePath: string){
//     if(!path.isAbsolute(filePath)){
//         throw new Error(`${filePath} must be an absolute path`);
//     }
    
//     objectDynamicLoad.reportList.push({filePath})
// }

export function addMethod(objectName: string, methodName: string, method: Function){
    objectDynamicLoad.methodList.push({objectName, methodName, method})
}

export function addTrigger(objectName: string, when: string, trigger: Function){
    // switch (when) {
    //     case 'beforeInsert':
    //         when = 'before.insert'
    //         break;
    //     case 'beforeUpdate':
    //         when = 'before.update'
    //         break;
    //     case 'beforeDelete':
    //         when = 'before.delete'
    //         break;
    //     case 'afterInsert':
    //         when = 'after.insert'
    //         break;
    //     case 'afterUpdate':
    //         when = 'after.update'
    //         break;
    //     case 'afterDelete':
    //         when = 'after.delete'
    //         break;
    //     default:
    //         break;
    // }
    let on = 'server';

    let triggerName = `${objectName}_${when}_${on}_${makeTriggerName(trigger)}`;


    trigger = transformTrigger(when, trigger);

    objectDynamicLoad.triggerList.push({objectName, triggerName, trigger: {on, when, todo: trigger}})
}

export function addAction(objectName: string, actionName: string, action: SteedosActionTypeConfig){
    objectDynamicLoad.actionList.push({objectName, actionName, action})
}

export function addRouter(routerPath: string, router: any){
    objectDynamicLoad.routerList.push({routerPath, router})
}