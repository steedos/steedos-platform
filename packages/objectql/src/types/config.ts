import path = require('path')
import _ = require('lodash')
import {loadJsonFiles} from '../util'
import { addAppConfigFiles } from './app';
import { addObjectConfigFiles, addClientScriptFiles, addServerScriptFiles, addObjectI18nFiles, addObjectDataFiles, addRouterFiles } from '.';

export const LOADED_OBJECT_RECORDS = {}


export function addConfigDataFiles(filePath: string){
    if(!path.isAbsolute(filePath)){
        throw new Error(`${filePath} must be an absolute path`);
    }

    const filePatten = [
        path.join(filePath, "*.data.yml"),
        path.join(filePath, "*.data.js"),
        path.join(filePath, "*.data.json")
    ]

    let jsons = loadJsonFiles(filePatten);
    _.each(jsons, (json: any) => {
        let objectName = path.basename(json.file).split(".data.")[0]
        _.each(json.data, (record) => {
            addConfig(objectName, record);
        })
    })
}

export function addConfigFiles(objectName: string, filePath: string){
    if(!path.isAbsolute(filePath)){
        throw new Error(`${filePath} must be an absolute path`);
    }

    const filePatten = [
        path.join(filePath, `*.${objectName}.yml`),
        path.join(filePath, `*.${objectName}.js`),
        path.join(filePath, `*.${objectName}.json`)
    ]

    let jsons = loadJsonFiles(filePatten);
    _.each(jsons, (json: any) => {
        let recordId = path.basename(json.file).split(`.${objectName}.`)[0]
        if (typeof json.data._id === "undefined")
            json.data._id = recordId
        addConfig(objectName, json.data);
    })
}

export const addConfig = (objectName: string, record: any) => {
    if(!record._id){
        console.log("addConfig", objectName, record);
        throw new Error(`Error adding record to ${objectName}, record._id required`);
    }
    let records = getConfigs(objectName);
    _.remove(records, {_id: record._id});
    records.push(record)
}

export const removeConfig = (objectName: string, record: any) => {
    if(!record._id){
        throw new Error(`Error removing record of ${objectName}, record._id required`);
    }
    let records = getConfigs(objectName);
    _.remove(records, {_id: record._id});
}

export const removeManyConfigs = (objectName: string, query?: object) => {
    let records = getConfigs(objectName);
    if(query ){
        if(typeof query !== "object"){
            throw new Error(`Error removing config of ${objectName}, query should be an object as {properyName: properyValue} just like {type:'abc'}`);
        }
        _.remove(records, query);
    }
    else{
        // 移除objectName关联的所有数据
        _.remove(records);
    }
}

export const getConfigDatabase = (objectName: string) => {
    return LOADED_OBJECT_RECORDS
}

export const getConfigs = (objectName: string) => {
    if (!LOADED_OBJECT_RECORDS.hasOwnProperty(objectName))
        LOADED_OBJECT_RECORDS[objectName] = []
    return LOADED_OBJECT_RECORDS[objectName]
}

export const getConfig = (objectName: string, _id: string) => {
    let records = getConfigs(objectName);
    return _.find(records, {_id: _id})
}

export const addAllConfigFiles = (filePath, datasource) => {
    addObjectConfigFiles(filePath, datasource);
    addAppConfigFiles(filePath);
    addClientScriptFiles(filePath);
    addServerScriptFiles(filePath);
    addObjectI18nFiles(filePath);
    addRouterFiles(filePath);
    // addConfigDataFiles(filePath);
    addConfigFiles('report', filePath);
    addConfigFiles('flow', filePath);
    addConfigFiles('form', filePath);
    addConfigFiles('dashboard', filePath);
    addObjectDataFiles(filePath);
}

