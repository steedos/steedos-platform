import { MetadataRegister } from "../metadata-register";
import { loadLayouts } from "../utils";

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-29 14:57:54
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-30 11:50:15
 * @Description: 
 */
const _ = require('underscore');

const _Layouts: any = {};

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
    let layoutJsons = loadLayouts(filePath);
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
        await MetadataRegister.addLayout(serviceName, layoutJson);
    }
}
