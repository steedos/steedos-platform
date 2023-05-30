/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-29 10:34:27
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-29 10:55:36
 * @Description: 
 */
import { getObjectConfig } from './core'
import _ = require('lodash');
import { overrideOriginalObject } from './originalObject';
import { MetadataRegister } from '../metadata-register';
var util = require('../util');
var clone = require('clone');

const _lazyLoadButtons: any = {};

export const addLazyLoadButtons = function(objectName: string, json: any){
    if(!_lazyLoadButtons[objectName]){
        _lazyLoadButtons[objectName] = []
    }
    _lazyLoadButtons[objectName].push(json)
}

export const getLazyLoadButtons = function(objectName: string){
    return _lazyLoadButtons[objectName]
}

export const loadObjectLazyButtons = function(objectName: string){
    let buttons = getLazyLoadButtons(objectName);
    _.each(buttons, function(button){
        addObjectButtonsConfig(objectName, clone(button));
    })
}


export const addObjectButtonsConfig = (objectName: string, json: any) => {
    if (!json.name) {
        throw new Error('missing attribute name: ' + (json as any)?.__filename)
    }

    let object = getObjectConfig(objectName);
    if (object) {
        if(!object.actions){
            object.actions = {}
        }
        util.extend(object.actions, {[json.name]: json});
        overrideOriginalObject(objectName, {actions: {[json.name]: json}});
    } else {
        addLazyLoadButtons(objectName, json);
    }
}

export const removeObjectButtonsConfig = (objectName: string, json: any)=>{
    if (!json.name) {
        throw new Error('missing attribute name: ' + (json as any)?.__filename)
    }
    let object = getObjectConfig(objectName);
    if(object.actions){
        delete object.actions[json.name]

    }
}

export const loadObjectButtons = async function (filePath: string, serviceName: string){
    let buttonJsons = util.loadButtons(filePath);
    buttonJsons.forEach(element => {
        addObjectButtonsConfig(element.object_name, element);
    });
    if(serviceName)
        for await (const buttonJson of buttonJsons) {
            await MetadataRegister.addObjectConfig(serviceName, Object.assign({extend: buttonJson.object_name}, {actions: {[buttonJson.name]: buttonJson}}));
        }
}

export const removeLazyLoadButton = function (objectName: string, json: any) {
    let objectButtons = _lazyLoadButtons[objectName];
    if(objectButtons){
        let btnIndex = _.findIndex(objectButtons, { name: json.name});
        objectButtons.splice(btnIndex, 1);
    }
}