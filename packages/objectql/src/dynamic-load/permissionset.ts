import { SteedosPermissionsetTypeConfig } from '../ts-types';
import { addConfig, getConfig, getConfigs } from '../types';
var util = require('../util');
var clone = require('clone');
var _ = require('underscore');
const PERMISSIONS = {
  allowEdit: false,
  allowDelete: false,
  allowRead: true,
};

const BASERECORD = {
  is_system: true,
  type: "permission_set",
  record_permissions: PERMISSIONS
};


const PERMISSION_SET_KEY = 'STANDARD_PERMISSION_SETS';

const addPermissionset = function(json: SteedosPermissionsetTypeConfig){
    if(!json.name){
        throw new Error('missing attribute name');
    }
    addConfig(PERMISSION_SET_KEY, Object.assign({}, json, clone(BASERECORD)));
}

export const loadSourcePermissionset = function (filePath: string){
    let permissionsets = util.loadPermissionsets(filePath)
    _.each(permissionsets, (json: SteedosPermissionsetTypeConfig) => {
        addPermissionset(json);
    })
}

export const getSourcePermissionset = function(name){
    return getConfig(PERMISSION_SET_KEY, name);
}

export const getSourcePermissionsetKeys = function(){
    return _.pluck(getSourcePermissionsets(), 'name');
}

export const getSourcePermissionsets = function(){
    return getConfigs(PERMISSION_SET_KEY) || [];
}