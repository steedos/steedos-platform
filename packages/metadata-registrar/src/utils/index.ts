/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-29 10:53:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-30 09:46:25
 * @Description: 
 */
import { isJsonMap, JsonMap, has, getJsonMap } from '@salesforce/ts-types';
import { loadFile, syncMatchFiles } from '@steedos/metadata-core';
import path = require('path');
const _ = require('underscore');
var clone = require('clone');

export function wrapAsync(fn, context){
    try {
        const Future  = require('fibers/future');
        let proxyFn = async function(_cb){
            let value = null;
            let error = null;
            try {
                value = await fn.call(context)
            } catch (err) {
                error = err
            }
            _cb(error, value)
        }
        let fut = new Future();
        let callback = fut.resolver();
        let result = proxyFn.apply(this, [callback]);
        return fut ? fut.wait() : result;
    } catch (Exception) {
        
    }
}

export function getObjectConfig(objectName: string){
    try {
        const objectql = require('@steedos/objectql');
        return objectql.getObjectConfig(objectName);
    } catch (error) {
        
    }
}


export function JSONStringify(data) {
    return JSON.stringify(data, function (key, val) {
        if (typeof val === 'function') {
            return val + '';
        }
        return val;
    })
}

export function extend(destination: JsonMap, ...sources: JsonMap[]){
    _.each(sources, (source: JsonMap)=>{
        _.each(source, (v:never, k: string)=>{
            if(!has(destination, k)){
                destination[k] = v
            }else if(isJsonMap(v)){
                let _d = getJsonMap(destination, k);
                if(isJsonMap(_d)){
                    destination[k] = extend(clone(_d), v)
                }else{
                    destination[k] = v
                }
            }else{
                destination[k] = v
            }
        })
    })
    return destination
}

export const loadProcessTriggers = (filePath: string) => {
    let results = [];
    const filePatten = [
        path.join(filePath, "*.processTrigger.js"),
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