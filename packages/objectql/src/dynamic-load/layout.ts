import { Dictionary } from '@salesforce/ts-types';
import { getSteedosSchema } from '..';
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
        throw new Error('missing attribute name: ' + (json as any)?.__filename)
    }
    addLayouts(objectName, json);
}

export const loadObjectLayouts = async function (filePath: string, serviceName: string){
    let layoutJsons = util.loadLayouts(filePath);
    layoutJsons.forEach(element => {
        addObjectLayoutConfig(element.object_name, element);
    });

    if(serviceName){
        for await (const layoutJson of layoutJsons) {
            await loadObjectLayoutMetadata(layoutJson, serviceName);
        }
    }
}

export const loadObjectLayoutMetadata = async function(layoutJson, serviceName?){
    if(serviceName){
        const schema = getSteedosSchema();
        await schema.metadataRegister?.addLayout(serviceName, layoutJson);
    }
}
