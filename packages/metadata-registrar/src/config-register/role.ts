/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-29 15:51:51
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-29 16:05:44
 * @Description: 
 */
import { loadFile, syncMatchFiles } from '@steedos/metadata-core';
import { addConfig, getConfig, getConfigs } from '../config';
const _ = require('underscore');
const clone = require('clone');
const path = require('path');

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
    let roles = loadRoles(filePath);
    roles.forEach(element => {
        addRole(element);
    });
}

const loadRoles = (filePath: string)=>{
    let results = []
    const filePatten = [
        path.join(filePath, "*.role.yml"),
        "!" + path.join(filePath, "node_modules"),
    ]
    const matchedPaths:[string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath:string)=>{
        let json: any = loadFile(matchedPath);
        let names = path.basename(matchedPath).split('.');

        if(!json.name){
            json.name = names[1]
        }
        results.push(json)
    })
    return results
}