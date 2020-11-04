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

const getLazyLoadListeners = function(objectName: string){
    return _lazyLoadListeners[objectName]
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
        addLazyLoadListeners(object_name, json);
        // throw new Error(`Error add listener, object not found: ${object_name}`);
    }
}

export const loadObjectTriggers = function (filePath: string){
    let triggerJsons = util.loadTriggers(filePath)
    _.each(triggerJsons, (json: SteedosListenerConfig) => {
        addObjectListenerConfig(json);
    })
}