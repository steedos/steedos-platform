import { SteedosFieldTypeConfig } from '../types'
import { Dictionary } from '@salesforce/ts-types';
import { getObjectConfig } from '../types'
import _ = require('lodash');
var util = require('../util');
var clone = require('clone');

var Fiber = require('fibers');

declare var Creator: any;
declare var DDP: any;
declare var DDPCommon: any;

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
        throw new Error('missing attribute name')
    }
    let object = getObjectConfig(objectName);
    if (object) {
        if(!object.fields){
            object.fields = {}
        }
        util.extend(object.fields, {[json.name]: json})
    } else {
        addLazyLoadFields(objectName, json);
    }
}

export const removeObjectFieldConfig = (objectName: string, json: SteedosFieldTypeConfig)=>{
    if (!json.name) {
        throw new Error('missing attribute name')
    }
    let object = getObjectConfig(objectName);
    if (object) {
        if(object.fields){
            delete object.fields[json.name]
        }
    }
}

export const loadObjectFields = function (filePath: string){
    let fieldJsons = util.loadFields(filePath);
    fieldJsons.forEach(element => {
        addObjectFieldConfig(element.object_name, element);
    });
}

async function meteorFind(name, query?, options?){
    Creator.Collections[name] = Creator.createCollection({name: name});
    return await new Promise((resolve, reject) => {
        Fiber(function () {
            try {
                let invocation = new DDPCommon.MethodInvocation({
                    isSimulation: true,
                    connection: null,
                    randomSeed: DDPCommon.makeRpcSeed()
                })
                let result = DDP._CurrentInvocation.withValue(invocation, function () {
                    return Creator.Collections[name].find(query, options).fetch();
                })
                resolve(result);
            } catch (error) {
                reject(error)
            }
        }).run()
    });
}

export const loadDBObjectFields = async function(){
    let fields: any = await meteorFind("object_fields", {});
    fields.forEach(element => {
        // delete element.sort_no
        addObjectFieldConfig(element.object, element);
    });
}