/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-27 11:38:13
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-30 09:25:47
 * @Description: 
 */
import * as _ from 'underscore';
import { objectToJson, jsonToObject } from '../utils/convert';
const clone = require('clone');

export async function registerObject(broker, serviceName, objectConfig) {
    // const serviceName = getObjectServiceName(objectConfig.name);
    const metadata = clone(objectConfig);
    delete metadata.triggers
    const res = await broker.call("objects.add", {data: metadata}, {meta: {
        caller: {
            nodeID: broker.nodeID,
            service: {
                name: serviceName,
                // version: broker.service.version, TODO
                // fullName: broker.service.fullName, TODO
            }
        }
    }});
    // if (res) { //TODO  && objectConfig.hidden != true
    //    await createObjectService(broker, serviceName, objectConfig)
    // }
    return res;
}

export async function addObjectConfig(broker, serviceName, objectConfig) {
    let metadata = clone(objectConfig);
    delete metadata.triggers;
    delete metadata.listeners;
    delete metadata.methods;
    objectToJson(metadata);
    const res = await broker.call("objects.addConfig", {data: metadata}, {meta: {
        metadataServiceName: serviceName,
        caller: {
            nodeID: broker.nodeID
        }
    }});
    return res;
}

export async function getObjectsConfig(broker, datasourceName){
    const objectsConfig = await broker.call('objects.getAll', {datasource: datasourceName})
    _.map(objectsConfig, (metadataConfig)=>{
        if(metadataConfig && metadataConfig.metadata){
            jsonToObject(metadataConfig.metadata)
        }
    })
    return objectsConfig;
}

export async function getObjectConfig(broker, objectApiName){
    const objectsConfig = await broker.call('objects.get', {objectApiName: objectApiName})
    _.map(objectsConfig, (metadataConfig)=>{
        if(metadataConfig && metadataConfig.metadata){
            jsonToObject(metadataConfig.metadata)
        }
    })
    return objectsConfig;
}

export async function removeObject(broker, objectApiName) {
    // const serviceName = getObjectServiceName(objectConfig.name);
    const res = await broker.call("objects.delete", {objectApiName: objectApiName}, {meta: {
        caller: {
            nodeID: broker.nodeID,
        }
    }});
    return res;
}