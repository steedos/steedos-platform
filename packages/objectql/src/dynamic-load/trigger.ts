import { SteedosListenerConfig } from '../types'
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
            const license = clone(json);
            license.name = json._id || getMD5(JSONStringify(json));
            object.listeners[license.name] = license
            if(object.datasource === 'meteor'){
                util.extend(object, {triggers: transformListenersToTriggers(object, license)})
            }
        }
        addLazyLoadListeners(object_name, Object.assign({}, json, {listenTo: object_name}));
        return Object.assign({}, json, {listenTo: object_name}); 
    }else{
        if(_.isRegExp(json.listenTo)){
            return Object.assign({}, json, {listenTo: json.listenTo.toString()}); 
        }else{
            return json; 
        }
    }
}

export const loadObjectTriggers = function (filePath: string){
    let triggerJsons = util.loadTriggers(filePath)
    let triggers = [];
    _.each(triggerJsons, (json: SteedosListenerConfig) => {
        triggers.push(addObjectListenerConfig(json));
    })
    return triggers;
}