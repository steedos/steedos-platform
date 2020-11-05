import { Dictionary } from '@salesforce/ts-types';
import { getObjectConfig } from '../types'
import _ = require('lodash');
var util = require('../util');
var clone = require('clone');
//TODO
const _lazyLoadLayouts: Dictionary<any> = {};

const addLazyLoadLayouts = function(objectName: string, json: any){
    if(!_lazyLoadLayouts[objectName]){
        _lazyLoadLayouts[objectName] = []
    }
    _lazyLoadLayouts[objectName].push(json)
}

const getLazyLoadLayouts = function(objectName: string){
    return _lazyLoadLayouts[objectName]
}

export const loadObjectLazyLayouts = function(objectName: string){
    let actions = getLazyLoadLayouts(objectName);
    _.each(actions, function(action){
        addObjectLayoutConfig(objectName, clone(action));
    })
}

export const addObjectLayoutConfig = (objectName: string, json: any) => {
    if (!json.name) {
        throw new Error('missing attribute name')
    }
    let object = getObjectConfig(objectName);
    if (object) {
        if(!object.fields){
            object.fields = {}
        }
        util.extend(object.fields, {[json.name]: json})
    } else {
        addLazyLoadLayouts(objectName, json);
    }
}

export const loadObjectFields = function (filePath: string){
    let fieldJsons = util.loadFields(filePath);
    fieldJsons.forEach(element => {
        addObjectLayoutConfig(element.object_name, element);
    });
}