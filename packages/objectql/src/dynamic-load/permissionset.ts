import { SteedosPermissionsetTypeConfig } from '../ts-types';
import { getSteedosSchema } from '../types/schema';
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

const STANDARD_PERMISSIONSETS = {
    none: {_id: 'none', name: 'none', label: 'none', license: '', ...BASERECORD}
}

const getStandardpPermissionset = function(name){
    return getStandardpPermissionsets()[name];
}

const getStandardpPermissionsets = function(){
    return clone(STANDARD_PERMISSIONSETS);
}

// const PERMISSION_SET_KEY = 'STANDARD_PERMISSION_SETS';

const addPermissionset = async function(json: SteedosPermissionsetTypeConfig, serviceName: string){
    if(!json.name){
        throw new Error('missing attribute name: ' + (json as any)?.__filename)
    }
    let permissionsetConfig = null;

    if(_.include(_.keys(STANDARD_PERMISSIONSETS), json.name)){
        permissionsetConfig = Object.assign({}, getStandardpPermissionset(json.name), json, clone(BASERECORD))
    }else{
        permissionsetConfig = Object.assign({}, json, clone(BASERECORD))
    }
    const schema = getSteedosSchema();
    await schema.metadataRegister?.addPermissionset(serviceName, permissionsetConfig);
}

export const loadStandardPermissionsets = async function(serviceName: string){
    const schema = getSteedosSchema();
    const keys = _.keys(STANDARD_PERMISSIONSETS);
    for (const key of keys) {
        const standardPermissionset = STANDARD_PERMISSIONSETS[key];
        await schema.metadataRegister.addPermissionset(serviceName, standardPermissionset);
    }
}

export const loadSourcePermissionset = async function (filePath: string, serviceName: string){
    let permissionsets = util.loadPermissionsets(filePath)
    for (const permissionset of permissionsets) {
        await addPermissionset(permissionset, serviceName);
     }
}

export const getSourcePermissionset = async function(name){
    const schema = getSteedosSchema();
    const permissionset = await schema.metadataRegister.getPermissionset(name);
    return permissionset?.metadata
}

export const getSourcePermissionsetKeys = async function(){
    const permissionsets = await getSourcePermissionsets();
    return _.pluck(permissionsets, 'name');
}

export const getSourcePermissionsets = async function(){
    const schema = getSteedosSchema();
    const permissionsets = await schema.metadataRegister.getPermissionsets();
    return  permissionsets ? _.pluck(permissionsets, 'metadata') : [];
}