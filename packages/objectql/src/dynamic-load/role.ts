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
    addConfig(ROLES_KEY, Object.assign({}, json, clone(BASERECORD), {_id: json.name}));
}
export const getSourceRolesKeys = function(){
    return _.pluck(getSourceRoles(), 'name');
}

export const getSourceRole = function(name){
    return getConfig(ROLES_KEY, name);
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
