import * as _ from 'underscore';
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getFullName, getChilds, getChildMetadataNames, stringToFunction, functionToString } from '@steedos/metadata-core';
import {deleteCommonAttribute, sortAttribute} from '../../util/attributeUtil'

import { dbToJson } from '../../metadata/retrieve/dbToJson'
import { getProcessVersionByProcess, saveOrInsertProcessVersion } from "./processVersion"
import { InsertOneWriteOpResult, WithId } from 'mongodb';

const collection_name = "process";
const collection_metadata_name = TypeInfoKeys.Process; 

export async function processFromDb(dbManager, processList, steedosPackage) {

  steedosPackage[collection_metadata_name] = {}
  var processes = steedosPackage[collection_metadata_name];

  // TODO: glob * get

  for(var i=0; i<processList.length; i++){
    var processName;
    try {
      const process = await getProcessByName(dbManager, processList[i]);
      processName = getFullName(collection_metadata_name, process)

      const processVersion  = await getProcessVersionByProcess(dbManager, process._id.toString());

      const processSchema = processVersion[0]

      processes[processName] = {
        name: process.name,
        label: process.label,
        object_name: process.object_name,
        engine: process.engine,
        is_active: process.is_active,
        ext: process.ext,
        description: processSchema.description,
        entry_criteria: processSchema.entry_criteria,
        when: processSchema.when,
        schema: processSchema.schema
      }

    } catch (error) {
        console.log('[error]', error)
        processName = processList[i]
        processes[processName] = { _fake: true}; 
    }  
  }

}

async function getChildProperty(steedosPackage, dbManager, objectName){
  var propertyStr =  objectName

  const childMetadataNames = getChilds(collection_metadata_name);
  
  var reqYml = {};
  for(const childMetadataName of childMetadataNames){
      reqYml[childMetadataName] = [propertyStr]
  }

  await dbToJson(reqYml, steedosPackage, dbManager);
}

async function getProcessByName(dbManager, name) {
  var process = await dbManager.findOne(collection_name, {name});

  deleteCommonAttribute(process);
  // removeAttributeForObject(object);
  sortAttribute(process);
  return process;
}

export async function processToDb(dbManager, processes) {
  for(const metadataName in processes) {
    const metadata = processes[metadataName]
    const process = {
      ...metadata
    };

    delete process.schema;
    const _id = await saveOrInsertOne(dbManager, process);

    const processVersion = {
        process: _id,
        description: metadata.description,
        schema: metadata.schema,
        entry_criteria: metadata.entry_criteria,
        when: metadata.when,
    };
    await saveOrInsertProcessVersion(dbManager, processVersion);
  }
}

async function saveOrInsertOne(dbManager, process){
  var filter = {name: process.name};
  var dbObject = await dbManager.findOne(collection_name, filter);
  if(dbObject == null) {
    dbObject = await dbManager.findOne(collection_name, filter, false)
    if(dbObject) {
      throw new Error(`process api_name already exists: ${process.name}`); 
    }
    const { insertedId } = await dbManager.insert(collection_name, process) as InsertOneWriteOpResult<WithId<any>>
    return insertedId;
  } else {
    await dbManager.update(collection_name, filter, process);
    return  dbObject._id.toString();
  }
}
