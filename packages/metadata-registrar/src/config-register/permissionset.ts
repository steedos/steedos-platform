import { loadFile, syncMatchFiles } from "@steedos/metadata-core";
import { MetadataRegister } from "../metadata-register";

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-29 15:46:51
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-29 15:49:05
 * @Description: 
 */
var clone = require('clone');
var path = require('path');
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

const getStandardPermissionset = function(name){
    return getStandardPermissionsets()[name];
}

const getStandardPermissionsets = function(){
    return clone(STANDARD_PERMISSIONSETS);
}

// const PERMISSION_SET_KEY = 'STANDARD_PERMISSION_SETS';

const addPermissionset = async function(json: any, serviceName: string){
    if(!json.name){
        throw new Error('missing attribute name: ' + (json as any)?.__filename)
    }
    let permissionsetConfig = null;

    if(_.include(_.keys(STANDARD_PERMISSIONSETS), json.name)){
        permissionsetConfig = Object.assign({}, getStandardPermissionset(json.name), json, clone(BASERECORD))
    }else{
        permissionsetConfig = Object.assign({}, json, clone(BASERECORD))
    }
    await MetadataRegister.addPermissionset(serviceName, permissionsetConfig);
}

export const loadStandardPermissionsets = async function(serviceName: string){
    const keys = _.keys(STANDARD_PERMISSIONSETS);
    for (const key of keys) {
        const standardPermissionset = STANDARD_PERMISSIONSETS[key];
        await MetadataRegister.addPermissionset(serviceName, standardPermissionset);
    }
}

const loadPermissionsets = (filePath: string)=>{
    let results = []
    const filePatten = [
        path.join(filePath, "*.permissionset.yml"),
        "!" + path.join(filePath, "node_modules"),
    ]
    const matchedPaths:[string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath:string)=>{
        let json: any = loadFile(matchedPath);
        json.name = path.basename(matchedPath).split('.')[0];
        json._id = json.name;
        json.type = 'permission_set';
        results.push(json)
    })
    return results
}

export const loadSourcePermissionset = async function (filePath: string, serviceName: string){
    let permissionsets = loadPermissionsets(filePath)
    for (const permissionset of permissionsets) {
        await addPermissionset(permissionset, serviceName);
     }
}

export const getSourcePermissionset = async function(name){
    const permissionset = await MetadataRegister.getPermissionset(name);
    return permissionset?.metadata
}

export const getSourcePermissionsetKeys = async function(){
    const permissionsets = await getSourcePermissionsets();
    return _.pluck(permissionsets, 'name');
}

export const getSourcePermissionsets = async function(){
    const permissionsets = await MetadataRegister.getPermissionsets();
    return  permissionsets ? _.pluck(permissionsets, 'metadata') : [];
}