import { getMD5, syncMatchFiles } from '@steedos/metadata-core';
import { loadFile } from '../utils';
import { transformListenersToTriggers } from '../utils/transform'
import _ = require('lodash');
import { JSONStringify } from '../utils';
import { getObjectConfig } from './core';

var clone = require('clone');
var path = require('path');

const _TRIGGERKEYS = ['beforeFind', 'beforeInsert', 'beforeUpdate', 'beforeDelete', 'afterFind', 'afterCount', 'afterFindOne', 'afterInsert', 'afterUpdate', 'afterDelete', 'beforeAggregate', 'afterAggregate']


const _lazyLoadListeners: any = {};

// 用于存放通配触发器，即listenTo的值是通配符
const _patternListerners: any = {}; 

const addLazyLoadListeners = function(objectName: string, json: any){
    if(!_lazyLoadListeners[objectName]){
        _lazyLoadListeners[objectName] = []
    }
    _lazyLoadListeners[objectName].push(json)

    if (isPatternListener(json)) {
        if(!_patternListerners[objectName]){
            _patternListerners[objectName] = []
        }
        _patternListerners[objectName].push(json)
    }
}

function getDataSource(datasourceApiName){
    try {
        const objectql = require('@steedos/objectql');
        return objectql.getDataSource(datasourceApiName);
    } catch (error) {
        
    }
}

export const getLazyLoadListeners = function(objectName?: string){
    if (objectName) {
        return _lazyLoadListeners[objectName]
    } else {
        return _lazyLoadListeners;
    }
}

export const loadObjectLazyListenners = function(objectName: string){
    let listenners = getLazyLoadListeners(objectName);
    _.each(listenners, function(listenner){
        addObjectListenerConfig(clone(listenner));
    })
}

export const addObjectListenerConfig = (json: any) => {
    if (!json.listenTo) {
        throw new Error('missing attribute listenTo')
    }

    if (!_.isString(json.listenTo) && !_.isFunction(json.listenTo) && !_.isArray(json.listenTo) && !_.isRegExp(json.listenTo)) {
        throw new Error('listenTo must be a function or string or array or regExp')
    }

    let object_name = '';

    if (typeof json.listenTo == 'string') {
        object_name = json.listenTo
    } else if (_.isFunction(json.listenTo)) {
        object_name = (json.listenTo as any)()
    }
    if(object_name){
        let object = getObjectConfig(object_name);
        if (object) {
            if(!object.listeners){
                object.listeners = {}
            }
            delete json.listenTo
            delete json.name
            const listener = clone(json);
            listener.name = json._id || getMD5(JSONStringify(json));
            object.listeners[listener.name] = listener
            if(object.datasource === 'meteor'){
                _.defaultsDeep(object, {triggers: transformListenersToTriggers(object, listener)})
            }

            try {
                const localObject = getDataSource(object.datasource).getLocalObject(object_name);
                if(localObject){
                    localObject.setListener(listener.name, listener);
                }
            } catch (error) {
                // console.error(error)
            }
            
        }
        addLazyLoadListeners(object_name, Object.assign({}, json, {listenTo: object_name, name: json._id || getMD5(JSONStringify(json))}));
        return Object.assign({}, json, {listenTo: object_name}); 
    }else{
        if(_.isRegExp(json.listenTo)){
            return Object.assign({}, json, {listenTo: json.listenTo.toString()}); 
        }else{
            return json; 
        }
    }
}

export const removePackageObjectTriggers = (serviceName: string)=>{
    _.each(_lazyLoadListeners, (listeners, objectName)=>{
        let objectConfig = getObjectConfig(objectName);
        _lazyLoadListeners[objectName] = _.filter(listeners, function(listener: any) { 
            const drop = listener.metadataServiceName === serviceName; 
            if(drop){
                try {
                    if(objectConfig && objectConfig.listeners){
                        delete objectConfig.listeners[listener.name]
                    }
                } catch (error) {
                    
                }
                try {
                    const object = getDataSource(objectConfig.datasource).getLocalObject(objectName);
                    if(object){
                        object.removeListener(listener.name ,listener)
                    }
                } catch (error) {
                    
                }
            }
            return drop != true;
        });

        // try {
        //     let object = getObjectConfig(objectName);
        //     if(object && object.datasource === 'meteor'){
        //         (object as any).triggers = _.dropWhile(triggers, function(trigger: any) { 
        //             return  trigger.metadataServiceName === serviceName; 
        //         });

        //         try {
        //             Creator.Objects[object.name] = object;
        //             Creator.loadObjects(object, object.name);
        //         } catch (error) {
        //             console.log(error)
        //         }
        //     }
        // } catch (error) {
        //     console.log(error)
        // }
    })

    _.each(_patternListerners, (listeners, objectName)=>{
        let objectConfig = getObjectConfig(objectName);
        _patternListerners[objectName] = _.filter(listeners, function(listener: any) { 
            const drop = listener.metadataServiceName === serviceName; 
            if(drop){
                try {
                    if(objectConfig && objectConfig.listeners){
                        delete objectConfig.listeners[listener.name]
                    }
                } catch (error) {
                    
                }
            }
            return drop != true;
        });
    })
}

const loadTriggers = (filePath: string) => {
    let results = [];
    const filePatten = [
        path.join(filePath, "*.trigger.js"),
        "!" + path.join(filePath, "node_modules"),
    ];
    const matchedPaths: [string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath: string) => {
        delete require.cache[require.resolve(matchedPath)];
        interface ListenerConfig {
            listenTo?: string;
            [key: string]: any; // Allow other properties
        }

        let json: ListenerConfig = loadFile(matchedPath);
        if (!_.has(json, "listenTo")) {
            json.listenTo = path.basename(matchedPath).split(".")[0];
        }
        results.push(json);
    });
    return results;
};

export const loadObjectTriggers = function (filePath: string, serviceName: string){
    if(!serviceName){
        throw new Error("serviceName is null");
    }
    let triggerJsons = loadTriggers(filePath)
    let triggers = [];
    _.each(triggerJsons, (json: any) => {
        triggers.push(addObjectListenerConfig(Object.assign(json, {metadataServiceName: serviceName})));
    })
    return triggers;
}

/**
 * 判断是否通配触发器
 * @param data 
 * @returns 
 */
function isPatternListener(data){
    const {listenTo} = data;
    if(listenTo === '*'){
        return true;
    }else if(_.isRegExp(listenTo)){
        return true;
    }else if(_.isString(listenTo) && listenTo.startsWith("/")){
        try {
            if(_.isRegExp(eval(listenTo))){
                return true;
            }
        } catch (error) {
            return false
        }
        return false;
    }
    return false;
}

/**
 * 获取旧版触发器中写了通配符的触发器
 * @param objectApiName 
 * @returns 
 */
export function getPatternListeners(objectApiName: string) {
    let patternListeners = {};

    const pushTrigger = (listeners: [any]) => {
        for (const listener of listeners) {
            _TRIGGERKEYS.forEach((key) => {
                let event = listener[key];
                if (_.isFunction(event)) {
                    patternListeners[listener.name] = listener;
                }
            })
        }
    }

    _.each(_patternListerners, (listeners, objectName) => {
        try {
            if (objectName === '*') {
                pushTrigger(listeners);
            } 
            else if (_.isRegExp(objectName) && objectName.test(objectApiName)) {
                pushTrigger(listeners);
            } 
            else if (_.isString(objectName) && objectName.startsWith("/")) {
                try {
                    if (_.isRegExp(eval(objectName)) && eval(objectName).test(objectApiName)) {
                        pushTrigger(listeners);
                    }
                } catch (error) {
                    // DO NOTHING
                }
            }
        } catch (error) {
            console.log(`[getPatternListeners] `, error);
        }
    })

    return patternListeners;
}