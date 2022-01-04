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
    type: "role",
    record_permissions: PERMISSIONS
};

const ROLES_KEY = 'ROLES';

const addRole = function(json){
    if(!json.name){
        throw new Error('missing attribute name');
    }
    if(!json.api_name){
        throw new Error('missing attribute api_name');
    }
    addConfig(ROLES_KEY, Object.assign({}, json, clone(BASERECORD), {_id: json.api_name}));
}
export const getSourceRolesKeys = function(){
    return _.pluck(getSourceRoles(), 'api_name');
}

export const getSourceRole = function(api_name){
    return clone(getConfig(ROLES_KEY, api_name));
}

export const getSourceRoles = function(){
    return clone(getConfigs(ROLES_KEY)) || [];
}

export const loadSourceRoles = function (filePath: string){
    let roles = util.loadRoles(filePath);
    roles.forEach(element => {
        addRole(element);
    });
}
