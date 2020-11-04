import { SteedosActionTypeConfig } from '../types'
import { Dictionary } from '@salesforce/ts-types';
import { getObjectConfig } from '../types'
import _ = require('lodash');
var util = require('../util');
var clone = require('clone');

const _lazyLoadActions: Dictionary<any> = {};

const addLazyLoadActions = function(objectName: string, json: SteedosActionTypeConfig){
    if(!_lazyLoadActions[objectName]){
        _lazyLoadActions[objectName] = []
    }
    _lazyLoadActions[objectName].push(json)
}

const getLazyLoadActions = function(objectName: string){
    return _lazyLoadActions[objectName]
}

export const loadObjectLazyActions = function(objectName: string){
    let actions = getLazyLoadActions(objectName);
    _.each(actions, function(action){
        addObjectActionConfig(clone(action));
    })
}

export const addObjectActionConfig = (json: SteedosActionTypeConfig)=>{
    if (!json.listenTo) {
        console.log('json', json);
        throw new Error('missing attribute listenTo');
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
        // throw new Error(`Error add action, object not found: ${object_name}`);
        addLazyLoadActions(object_name, json)
    }
}

export const loadObjectActions = function (filePath: string){
    let actions = util.loadActions(filePath)
    _.each(actions, (json: SteedosActionTypeConfig) => {
        addObjectActionConfig(json);
    })
    let buttonScripts = util.loadButtonScripts(filePath)
    _.each(buttonScripts, (json: SteedosActionTypeConfig) => {
        addObjectActionConfig(json);
    })
}