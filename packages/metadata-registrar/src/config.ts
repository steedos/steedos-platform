import path = require('path')
import _ = require('lodash')
import { loadFile, syncMatchFiles } from '@steedos/metadata-core'

export const LOADED_OBJECT_RECORDS = {}

const loadJsonFiles = (filePatten: Array<string>)=>{
  let results = []
  const matchedPaths:[string] = syncMatchFiles(filePatten);
  _.each(matchedPaths, (matchedPath:string)=>{
      let json: any = loadFile(matchedPath);
      if(json){
          json.__filename = matchedPath
      }
      results.push({file: matchedPath, data: json})
  })
  return results
}

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

