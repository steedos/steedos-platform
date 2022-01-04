// import { createObjectService } from './objectServiceManager';
// import { getObjectServiceName } from '../services/index';
import * as _ from 'underscore';
import { objectToJson } from '../util';
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

function funEval (funStr){
	try{
		return eval(funStr)
	}catch (e){
		console.error(e, funStr);
	}
};

export function jsonToObject(objectMetadata){
    _.forEach(objectMetadata.fields, (field, key)=>{
        const _reference_to = field._reference_to;
        if(_reference_to && _.isString(_reference_to)){
            field.reference_to = funEval(`(${_reference_to})`);
        }
    })
}