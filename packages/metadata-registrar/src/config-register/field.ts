/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-29 10:34:27
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-21 16:34:58
 * @Description: 
 */
import { getObjectConfig, getOriginalObjectConfig } from './core'
import _ = require('lodash');
import { MetadataRegister } from '../metadata-register';
import { DEFAULT_FIELD } from '@steedos/metadata-core';
import { extend, loadFields } from '../utils';
var clone = require('clone');

const _lazyLoadFields: any = {};

const addLazyLoadFields = function(objectName: string, json: any){
    if(!_lazyLoadFields[objectName]){
        _lazyLoadFields[objectName] = []
    }
    _lazyLoadFields[objectName].push(json)
}

export const getLazyLoadFields = function(objectName: string){
    return _lazyLoadFields[objectName]
}

export const loadObjectLazyFields = function(objectName: string){
    let fields = getLazyLoadFields(objectName);
    _.each(fields, function(field){
        addObjectFieldConfig(objectName, clone(field));
    })
}

export const addObjectFieldConfig = (objectName: string, json: any) => {
    _.each(DEFAULT_FIELD, (value, key) => {
        if (!_.has(json, key)) {
            (json as { [key: string]: any })[key] = value;
        }
    });
    if (!json.name) {
        throw new Error('missing attribute name: ' + (json as any)?.__filename)
    }
    if(json._id && json._id != json.name){
        json.override = {
            label: json.label
        }
    }

    let object = getObjectConfig(objectName);
    let originalObject = getOriginalObjectConfig(objectName);
    if (object) {
        if(!object.fields){
            object.fields = {}
        }
        extend(object.fields, {[json.name]: json})
        extend(originalObject.fields, {[json.name]: json})
        
        let _mf =  _.maxBy(_.values(object.fields), function (field) { return field.sort_no; });
        if(_mf && object.name){
            object.fields_serial_number = _mf.sort_no + 10;
        }

    } else {
        addLazyLoadFields(objectName, json);
    }
}

export const removeObjectFieldConfig = (objectName: string, json: any)=>{
    if (!json.name) {
        throw new Error('missing attribute name: ' + (json as any)?.__filename)
    }
    let object = getObjectConfig(objectName);
    let originalObject = getOriginalObjectConfig(objectName);
    if (object) {
        if(object.fields){
            delete object.fields[json.name]
            delete originalObject.fields[json.name]
        }
    }
}

export const loadObjectFields = async function (filePath: string, serviceName?: string){
    let fieldJsons = loadFields(filePath);
    fieldJsons.forEach(element => {
        addObjectFieldConfig(element.object_name, element);
    });
    if(serviceName)
        for await (const fieldJson of fieldJsons) {
            await MetadataRegister.addObjectConfig(serviceName, Object.assign({extend: fieldJson.object_name}, {fields: {
                [fieldJson.name]: fieldJson
            }}));
    }
    
}