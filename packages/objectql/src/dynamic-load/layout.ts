import { Dictionary } from '@salesforce/ts-types';
const _ = require('underscore');
var util = require('../util');

const _Layouts: Dictionary<any> = {};

const addLayouts = function(objectName: string, json: any){
    if(!_Layouts[objectName]){
        _Layouts[objectName] = []
    }
    _Layouts[objectName].push(json)
}

export const getLayouts = function(objectName: string){
    return _Layouts[objectName]
}

export const getLayout = function(objectName: string, layoutName: string){
    const objectLayouts = getLayouts(objectName);
    if(objectLayouts){
        return _.find(objectLayouts, function(layout){
            return layout.name === layoutName
        })
    }
}

export const addObjectLayoutConfig = (objectName: string, json: any) => {
    if (!json.name) {
        throw new Error('missing attribute name')
    }
    addLayouts(objectName, json);
}

export const loadObjectLayouts = function (filePath: string){
    let layoutJsons = util.loadLayouts(filePath);
    layoutJsons.forEach(element => {
        addObjectLayoutConfig(element.object_name, element);
    });
}