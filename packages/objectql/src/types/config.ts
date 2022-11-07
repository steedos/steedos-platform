import path = require('path')
import _ = require('lodash')
import {loadJsonFiles} from '../util'
import { addAppConfigFiles } from './app';
import { addObjectConfigFiles, addServerScriptFiles, addObjectDataFiles, addRouterFiles } from '.';
import { loadPackageClientScripts } from '../dynamic-load/client_script';
import { addTranslationsFiles, addObjectTranslationsFiles } from '../dynamic-load'
import { registerPackageCharts } from '../dynamic-load/chart';
import { registerPackageQueries } from '../dynamic-load/query';
import { registerPackagePages } from '../dynamic-load/page';
import { registerPackageTabs } from '../dynamic-load/tab';

import { registerPackageShareRules } from '../dynamic-load/shareRules';
import { registerPackageRestrictionRules } from '../dynamic-load/restrictionRules';

const debugAddAllConfig = require('debug')('steedos:package:load-metadata:addAllConfigFiles');

export const LOADED_OBJECT_RECORDS = {}


export function addConfigDataFiles(filePath: string) {
  if (!path.isAbsolute(filePath)) {
    throw new Error(`${filePath} must be an absolute path`);
  }

  const filePatten = [
    path.join(filePath, "*.data.yml"),
    path.join(filePath, "*.data.js"),
    path.join(filePath, "*.data.json"),
    "!" + path.join(filePath, "node_modules"),
  ];

  let jsons = loadJsonFiles(filePatten);
  _.each(jsons, (json: any) => {
    let objectName = path.basename(json.file).split(".data.")[0];
    _.each(json.data, (record) => {
      addConfig(objectName, record);
    });
  });
}

export function getConfigsFormFiles(objectName: string, filePath: string) {
  if (!path.isAbsolute(filePath)) {
    throw new Error(`${filePath} must be an absolute path`);
  }

  const filePatten = [
    path.join(filePath, `*.${objectName}.yml`),
    path.join(filePath, `*.${objectName}.js`),
    path.join(filePath, `*.${objectName}.json`),
    "!" + path.join(filePath, "node_modules"),
  ];

  let jsons = loadJsonFiles(filePatten);
  const configs = [];
  _.each(jsons, (json: any) => {
    let recordId = path.basename(json.file).split(`.${objectName}.`)[0];
    if (typeof json.data._id === "undefined") json.data._id = recordId;
    configs.push(json.data);
  });
  return configs;
}

export function addConfigFiles(objectName: string, filePath: string){
    if(!path.isAbsolute(filePath)){
        throw new Error(`${filePath} must be an absolute path`);
    }

    const filePatten = [
        path.join(filePath, `*.${objectName}.yml`),
        path.join(filePath, `*.${objectName}.js`),
        path.join(filePath, `*.${objectName}.json`),
        "!" + path.join(filePath, "node_modules"),
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

export const addAllConfigFiles = async (filePath, datasourceApiName, serviceName) => {
    debugAddAllConfig("%o addAllConfigFiles:start", serviceName)
    addRouterFiles(filePath);
    debugAddAllConfig("%o addAllConfigFiles:addRouterFiles", serviceName)
    await addObjectConfigFiles(filePath, datasourceApiName, serviceName);
    debugAddAllConfig("%o addAllConfigFiles:addObjectConfigFiles", serviceName)
    await addAppConfigFiles(filePath, serviceName);
    debugAddAllConfig("%o addAllConfigFiles:addAppConfigFiles", serviceName)
    await registerPackageQueries(filePath, serviceName);
    debugAddAllConfig("%o addAllConfigFiles:registerPackageQueries", serviceName)
    await registerPackageCharts(filePath, serviceName);
    debugAddAllConfig("%o addAllConfigFiles:registerPackageCharts", serviceName)
    await registerPackagePages(filePath, serviceName);
    debugAddAllConfig("%o addAllConfigFiles:registerPackagePages", serviceName)
    await registerPackageTabs(filePath, serviceName);
    debugAddAllConfig("%o addAllConfigFiles:registerPackageTabs", serviceName)
    await registerPackageShareRules(filePath, serviceName);
    debugAddAllConfig("%o addAllConfigFiles:registerPackageShareRules", serviceName)
    await registerPackageRestrictionRules(filePath, serviceName);
    debugAddAllConfig("%o addAllConfigFiles:registerPackageRestrictionRules", serviceName)
    
    loadPackageClientScripts(serviceName, filePath);
    addServerScriptFiles(filePath);
    // addObjectI18nFiles(filePath);
    await addTranslationsFiles(filePath);
    await addObjectTranslationsFiles(filePath);
    // addConfigDataFiles(filePath);
    addConfigFiles('report', filePath);
    addConfigFiles('flow', filePath);
    addConfigFiles('form', filePath);
    addConfigFiles('dashboard', filePath);
    addObjectDataFiles(filePath);
}

