/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-29 16:21:22
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-29 16:23:11
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
    type: "flowRole",
    record_permissions: PERMISSIONS
};

const FLOWROLES_KEY = 'FLOWROLES';

const addFlowRole = function(json){
    if(!json.name){
        throw new Error('missing attribute name');
    }
    if(!json.api_name){
        throw new Error('missing attribute api_name');
    }
    addConfig(FLOWROLES_KEY, Object.assign({}, json, clone(BASERECORD), {_id: json.api_name}));
}
export const getSourceFlowRolesKeys = function(){
    return _.pluck(getSourceFlowRoles(), 'api_name');
}

export const getSourceFlowRole = function(api_name){
    return clone(getConfig(FLOWROLES_KEY, api_name));
}

export const getSourceFlowRoles = function(){
    return clone(getConfigs(FLOWROLES_KEY)) || [];
}

export const loadSourceFlowRoles = function (filePath: string){
    let flowRoles = loadFlowRoles(filePath);
    flowRoles.forEach(element => {
        addFlowRole(element);
    });
}

const loadFlowRoles = (filePath: string)=>{
    let results = []
    const filePatten = [
        path.join(filePath, "*.flowRole.yml"),
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