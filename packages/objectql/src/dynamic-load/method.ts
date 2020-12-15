import { SteedosActionTypeConfig } from '../types'
import { Dictionary, JsonMap } from '@salesforce/ts-types';
import { getObjectConfig } from '../types'
import _ = require('lodash');
var util = require('../util');
var clone = require('clone');

const _lazyLoadMethods: Dictionary<any> = {};

const addLazyLoadMethods = function(objectName: string, json: SteedosActionTypeConfig){
    if(!_lazyLoadMethods[objectName]){
        _lazyLoadMethods[objectName] = []
    }
    _lazyLoadMethods[objectName].push(json)
}

const getLazyLoadMethods = function(objectName: string){
    return _lazyLoadMethods[objectName]
}

export const loadObjectLazyMethods = function(objectName: string){
    let methods = getLazyLoadMethods(objectName);
    _.each(methods, function(methods){
        addObjectMethodConfig(clone(methods));
    })
}

export const addObjectMethodConfig = (json: JsonMap)=>{
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
        if(!object.methods){
            object.methods = {}
        }
        delete json.listenTo

        Object.assign(object.methods, json);

    }
    addLazyLoadMethods(object_name, Object.assign({}, json, {listenTo: object_name}));
}

export const loadObjectMethods = function (filePath: string){
    let methods = util.loadMethods(filePath)
    _.each(methods, (json: JsonMap) => {
        addObjectMethodConfig(json);
    })
}