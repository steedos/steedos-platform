import { Dictionary } from '@salesforce/ts-types';
const _ = require('underscore');
const lodash = require('lodash');
const clone = require('clone');
var util = require('../util');

const _ValidationRules: Dictionary<any> = {};

const PERMISSIONS = {
    allowEdit: false,
    allowDelete: false,
    allowRead: true,
};
  
const BASERECORD = {
    is_system: true,
    type: "validation_rule",
    record_permissions: PERMISSIONS
  };

const addObjectValidationRule = function(objectName: string, json: any){
    if(!_ValidationRules[objectName]){
        _ValidationRules[objectName] = []
    }
    _ValidationRules[objectName].push(Object.assign({}, json, clone(BASERECORD), {_id: `${objectName}.${json.name}`}))
}

export const getObjectValidationRules = function(objectName: string){

    return clone(_ValidationRules[objectName])
}

export const getAllObjectValidationRules = function(){

    let result = [];

    for(let objectName in _ValidationRules){
        let objectValidationRules = _ValidationRules[objectName]
        result = result.concat(clone(objectValidationRules));
    }
    
    return result;
}

export const getObjectValidationRule = function(objectName: string, validationRuleName: string){
    const objectValidationRules = getObjectValidationRules(objectName);
    if(objectValidationRules){
        return _.find(objectValidationRules, function(validationRule){
            return validationRule.name === validationRuleName
        })
    }
}

export const addObjectValidationRuleConfig = (objectName: string, json: any) => {
    if (!json.name) {
        throw new Error('missing attribute name')
    }
    addObjectValidationRule(objectName, json);
}

export const removePackageValidationRules = (serviceName: string)=>{
    _.each(_ValidationRules, (roles, objectName)=>{
        _ValidationRules[objectName] = lodash.dropWhile(roles, function(role) { return role.metadataServiceName === serviceName; });
    })
}

export const loadObjectValidationRules = function (filePath: string, serviceName: string){
    let validationRuleJsons = util.loadValidationRules(filePath);
    validationRuleJsons.forEach(element => {
        addObjectValidationRuleConfig(element.object_name, Object.assign(element, {metadataServiceName: serviceName}));
    });
}
