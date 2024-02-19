/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-30 14:26:40
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-30 14:26:44
 * @Description: 
 */
import { Dictionary } from '@salesforce/ts-types';
import { overrideOriginalObject } from './originalObject';
import _ = require('lodash');
import { MetadataRegister } from '../metadata-register';
import { getObjectConfig } from './core';
import { extend, loadListViews } from '../utils';
import { DEFAULT_LISTVIEW } from '@steedos/metadata-core';
var clone = require('clone');

const _lazyLoadListViews: Dictionary<any> = {};

const addLazyLoadListViews = function(objectName: string, json: any){
    if(!_lazyLoadListViews[objectName]){
        _lazyLoadListViews[objectName] = []
    }
    _lazyLoadListViews[objectName].push(json)
}

const getLazyLoadListViews = function(objectName: string){
    return _lazyLoadListViews[objectName]
}

export const loadObjectLazyListViews = function(objectName: string){
    let listViews = getLazyLoadListViews(objectName);
    _.each(listViews, function(listView){
        addObjectListViewConfig(objectName, clone(listView));
    })
}

export const addObjectListViewConfig = (objectName: string, json: any) => {
    _.each(DEFAULT_LISTVIEW, (value, key) => {
        if (!_.has(json, key)) {
            json[key] = value;
        }
    });
    if (!json.name) {
        throw new Error('missing attribute name: ' + (json as any)?.__filename)
    }

    let object = getObjectConfig(objectName);
    if (object) {
        if(!object.list_views){
            object.list_views = {}
        }
        extend(object.list_views, {[json.name]: json});
        overrideOriginalObject(objectName, {list_views: {[json.name]: json}});
    } else {
        addLazyLoadListViews(objectName, json);
    }
}

export const loadObjectListViews = async function (filePath: string, serviceName: string){
    let listViewJsons = loadListViews(filePath);
    listViewJsons.forEach(element => {
        addObjectListViewConfig(element.object_name, element);
    });
    if(serviceName)
        for await (const listViewJson of listViewJsons) {
            await MetadataRegister.addObjectConfig(serviceName, Object.assign({extend: listViewJson.object_name}, {list_views: {
                [listViewJson.name]: listViewJson
            }}));
        }
}