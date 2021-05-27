import { addConfig, getConfig, getConfigs } from '../types';
const _ = require('underscore');
const clone = require('clone');
var util = require('../util');

const PERMISSIONS = {
    allowEdit: false,
    allowDelete: false,
    allowRead: true,
};

const BASERECORD = {
    is_system: true,
    type: "flowRole",
    record_permissions: PERMISSIONS
};

const FLOWROLES_KEY = 'FLOWROLES';

const addFlowRole = function(json){
    if(!json.name){
        throw new Error('missing attribute name');
    }
    addConfig(FLOWROLES_KEY, Object.assign({}, json, clone(BASERECORD), {_id: json.name}));
}
export const getSourceFlowRolesKeys = function(){
    return _.pluck(getSourceFlowRoles(), 'name');
}

export const getSourceFlowRole = function(name){
    return getConfig(FLOWROLES_KEY, name);
}

export const getSourceFlowRoles = function(){
    return clone(getConfigs(FLOWROLES_KEY)) || [];
}

export const loadSourceFlowRoles = function (filePath: string){
    let flowRoles = util.loadFlowRoles(filePath);
    flowRoles.forEach(element => {
        addFlowRole(element);
    });
}
