const fs = require('fs')
const path = require('path')
const ini = require('ini')

import { SteedosClient } from '@steedos/client';
import { resolveProjectPathSync } from '../project/index'
import { getLocalEnv, saveLocalEnv } from '../packages/index'

export function loadENV(workspace?: string){
    const options: any = {silent: true};
    try {
        options.path = resolveProjectPathSync(workspace);
    } catch (error) {
        console.error(error.message);
    }finally{
        require('dotenv-flow').config(options);
    }
}

export function getRootUrl(workspace?: string){
    var localEnv = getLocalEnv(workspace);
    var rootUrl = localEnv['ROOT_URL'];
    return rootUrl;
}

export function getMetaDataUrl(workspace?: string){
    const metadataURL = getMetadataConfig(workspace).METADATA_SERVER;
    if(!metadataURL){
        throw new Error('Please run command, steedos source:config');
    }
    return metadataURL;
}

export function getMetaDataSpaceId(){
    var spaceId = process.env.METADATA_SPACE_ID;
    // var spaceId = getUserProfile().METADATA_SPACE_ID;
    if(!spaceId){
        throw new Error("METADATA_SPACE_ID not found");
    }
    return spaceId
}

export function getMetaDataAuthToken(){
    // var authToken = process.env.METADATA_AUTH_TOKEN;
    var authToken = getUserProfile().METADATA_AUTH_TOKEN;
    if(!authToken){
        // throw new Error('Please Set Environment Variables: METADATA_AUTH_TOKEN');
        throw new Error('Please run command, steedos auth:login');
    }
    return authToken
}

export function getMetaDataSpaceToken(){
    return `${getMetaDataSpaceId()},${getMetaDataAuthToken()}`
}

export function getAuthorization(){
    return `Bearer ${getMetaDataSpaceToken()}`
}

export function getAPIAuthorization(workspace?: string){
    return `Bearer ${getAPIToken(workspace)}`
}

export function getAPIToken(workspace?: string){
    var apiToken = getMetadataConfig(workspace).METADATA_APIKEY;
    if(!apiToken){
        throw new Error('Please config with steedos source:config');
    }
    return `apikey,${apiToken}`
}


export async function doLogin(username, password){
    const client = new SteedosClient();
    //设置服务地址
    client.setUrl(getMetaDataUrl());
    let userProfile: any = await client.login(username, password);
    
    var profile = {METADATA_USERNAME: username, METADATA_AUTH_TOKEN: userProfile.token, METADATA_SPACE_ID: getMetaDataSpaceId()};
    saveUserProfile(profile);
}

export function saveSourceConfig(config){
    var localEnv = getLocalEnv();
    if(!localEnv){
        localEnv = {}
    }
    localEnv['METADATA_SERVER'] = config.server
    localEnv['METADATA_APIKEY'] = config.apikey
    saveLocalEnv(localEnv);
}

export function saveUserProfile(profile){

    var localEnv = getLocalEnv();
    if(!localEnv){
        localEnv = {}
    }

    for(const key in profile){
        localEnv[key] = profile[key]
    }
    saveLocalEnv(localEnv);
}

export function getUserProfile(){

    var metadata = getMetadataConfig();
    var profile = {
        METADATA_USERNAME: metadata['METADATA_USERNAME'],
        METADATA_AUTH_TOKEN: metadata['METADATA_AUTH_TOKEN'],
        METADATA_SPACE_ID: metadata['METADATA_SPACE_ID'],
    }
    return profile;

}

export function getMetadataConfig(workspace?: string){
    var localEnv = getLocalEnv(workspace);
    var metadata = localEnv;
    if(metadata){
        return Object.assign({}, metadata, localEnv['metadata']);
    }else{
        return {
            METADATA_SERVER: process.env.METADATA_SERVER,
            METADATA_APIKEY: process.env.METADATA_APIKEY
        }
    }

}

