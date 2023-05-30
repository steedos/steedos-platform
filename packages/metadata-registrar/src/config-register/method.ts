/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-29 15:08:36
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-29 15:14:05
 * @Description: 
 */
import { loadFile, syncMatchFiles } from '@steedos/metadata-core';
import _ = require('lodash');
import { getObjectConfig } from '../utils';
var path = require('path');
var clone = require('clone');

const _lazyLoadMethods: any = {};

const addLazyLoadMethods = function(objectName: string, json: any){
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

export const addObjectMethodConfig = (json: any)=>{
    if (!json.listenTo) {
        throw new Error('missing attribute listenTo')
    }

    if (!_.isString(json.listenTo) && !_.isFunction(json.listenTo)) {
        throw new Error('listenTo must be a function or string')
    }

    let object_name = '';

    if (typeof json.listenTo == 'string') {
        object_name = json.listenTo
    } else if (_.isFunction(json.listenTo)) {
        object_name = (json.listenTo as any)()
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
    let methods = loadMethods(filePath)
    _.each(methods, (json: any) => {
        addObjectMethodConfig(json);
    })
}

const loadMethods = (filePath: string) => {
    let results = [];
    const filePatten = [
      path.join(filePath, "*.function.js"),
      "!" + path.join(filePath, "node_modules"),
    ];
    const matchedPaths: [string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath: string) => {
      delete require.cache[require.resolve(matchedPath)];
      let json: any = loadFile(matchedPath);
      if (!_.has(json, "listenTo")) {
        json.listenTo = path.basename(matchedPath).split(".")[0];
      }
      results.push(json);
    });
    return results;
  };