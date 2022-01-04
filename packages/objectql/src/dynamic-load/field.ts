import { getSteedosSchema, SteedosFieldTypeConfig } from '../types'
import { Dictionary } from '@salesforce/ts-types';
import { getObjectConfig, getOriginalObjectConfig } from '../types'
import _ = require('lodash');
var util = require('../util');
var clone = require('clone');

const _lazyLoadFields: Dictionary<any> = {};

const addLazyLoadFields = function(objectName: string, json: SteedosFieldTypeConfig){
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

export const addObjectFieldConfig = (objectName: string, json: SteedosFieldTypeConfig) => {
    if (!json.name) {
        throw new Error('missing attribute name: ' + (json as any)?.__filename)
    }
    let object = getObjectConfig(objectName);
    let originalObject = getOriginalObjectConfig(objectName);
    if (object) {
        if(!object.fields){
            object.fields = {}
        }
        util.extend(object.fields, {[json.name]: json})
        util.extend(originalObject.fields, {[json.name]: json})
        
        let _mf =  _.maxBy(_.values(object.fields), function (field) { return field.sort_no; });
        if(_mf && object.name){
            object.fields_serial_number = _mf.sort_no + 10;
        }

    } else {
        addLazyLoadFields(objectName, json);
    }
}

export const removeObjectFieldConfig = (objectName: string, json: SteedosFieldTypeConfig)=>{
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
    let fieldJsons = util.loadFields(filePath);
    fieldJsons.forEach(element => {
        addObjectFieldConfig(element.object_name, element);
    });
    if(serviceName)
        for await (const fieldJson of fieldJsons) {
            await getSteedosSchema().metadataRegister.addObjectConfig(serviceName, Object.assign({extend: fieldJson.object_name}, {fields: {
                [fieldJson.name]: fieldJson
            }}));
    }
    
}