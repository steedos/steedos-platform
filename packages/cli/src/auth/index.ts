const request = require('request');
const _ = require('underscore');
import {getMetaDataSpaceId, getMetaDataAuthToken, getMetaDataUrl, loadENV, getMetaDataSpaceToken, getAuthorization, getAPIAuthorization} from '@steedos/metadata-core';
loadENV();

export function authRequest(url: string, requestOptions, requestCallback){

    var metadataURL = getMetaDataUrl();

    requestOptions.url = `${metadataURL}${url}`
    
    // requestOptions.form.space = getMetaDataSpaceId();

    if(!_.has(requestOptions, 'headers')){
        requestOptions.headers = {};
    }

    if(!_.has(requestOptions.headers, 'Authorization')){
        requestOptions.headers["Authorization"] = getAPIAuthorization();
    }
    return request(requestOptions, requestCallback);
}