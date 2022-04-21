import { getDataSource, SteedosListenerConfig } from '../types'
import { Dictionary } from '@salesforce/ts-types';
import { getObjectConfig } from '../types'
import { getMD5, JSONStringify, transformListenersToTriggers } from '../util'
import _ = require('lodash');
var util = require('../util');
var clone = require('clone');

const _lazyLoadListeners: Dictionary<any> = {};

const addLazyLoadListeners = function(objectName: string, json: SteedosListenerConfig){
    if(!_lazyLoadListeners[objectName]){
        _lazyLoadListeners[objectName] = []
    }
    _lazyLoadListeners[objectName].push(json)
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

export const addObjectListenerConfig = (json: SteedosListenerConfig) => {
    if (!json.listenTo) {
        throw new Error('missing attribute listenTo')
    }

    if (!_.isString(json.listenTo) && !_.isFunction(json.listenTo) && !_.isArray(json.listenTo) && !_.isRegExp(json.listenTo)) {
        throw new Error('listenTo must be a function or string or array or regExp')
    }

    let object_name = '';

    if (_.isString(json.listenTo)) {
        object_name = json.listenTo
    } else if (_.isFunction(json.listenTo)) {
        object_name = json.listenTo()
    }
    if(object_name){
        let object = getObjectConfig(object_name);
        if (object) {
            if(!object.listeners){
                object.listeners = {}
            }
            delete json.listenTo
            const listener = clone(json);
            listener.name = json._id || getMD5(JSONStringify(json));
            object.listeners[listener.name] = listener
            if(object.datasource === 'meteor'){
                util.extend(object, {triggers: transformListenersToTriggers(object, listener)})
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
}

export const loadObjectTriggers = function (filePath: string, serviceName: string){
    if(!serviceName){
        throw new Error("serviceName is null");
    }
    let triggerJsons = util.loadTriggers(filePath)
    let triggers = [];
    _.each(triggerJsons, (json: SteedosListenerConfig) => {
        triggers.push(addObjectListenerConfig(Object.assign(json, {metadataServiceName: serviceName})));
    })
    return triggers;
}