import * as _ from 'underscore';
import { InsertOneWriteOpResult, WithId } from 'mongodb';
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getFullName } from '@steedos/metadata-core';
import {deleteCommonAttribute, sortAttribute} from '../../util/attributeUtil'

import { MetadataBaseCollection } from './_base'

const collection_name = "process";
const collection_metadata_name = TypeInfoKeys.Process; 

const process_versions_collection_name = "process_versions"

export class ProcessCollection extends MetadataBaseCollection {
  constructor(){
    super(collection_metadata_name, [collection_name, process_versions_collection_name]);
  }

  async retrieve(dbManager, metadataApiNames, steedosPackage) {
    steedosPackage[collection_metadata_name] = {}
    var processes = steedosPackage[collection_metadata_name];
  
    if(metadataApiNames.length == 1 && metadataApiNames[0] == '*') {
      var metadataList = await this.findAll(dbManager);
      for(var i=0; i<metadataList.length; i++) {
        const process = metadataList[i];
        await this.makeProcess(dbManager, process, processes)
      }
    } else {
      for(var i=0; i<metadataApiNames.length; i++){
        const process = await this.findOne(dbManager, metadataApiNames[i]);
        await this.makeProcess(dbManager, process, processes)      
      }
    }
  }

  async deploy(dbManager, processes){
    for(const metadataName in processes) {
      const metadata = processes[metadataName]
      const process = {
        ...metadata
      };
  
      delete process.schema;
      const _id = await this.saveOrInsertOne(dbManager, process);
  
      const processVersion = {
          process: _id,
          description: metadata.description,
          schema: metadata.schema,
          entry_criteria: metadata.entry_criteria,
          when: metadata.when,
      };
      await this.saveOrInsertProcessVersion(dbManager, processVersion);
    }
  }

  async findOne(dbManager, name) {
    var process = await dbManager.findOne(collection_name, {name});
  
    deleteCommonAttribute(process);
    sortAttribute(process);
    return process;
  }

  async findAll(dbManager) {
      var records = await this.find(dbManager);
      for(var i=0; i<records.length; i++){
          let record = records[i]
          deleteCommonAttribute(record);
          sortAttribute(record);
      }
      return records;
  }

  async makeProcess(dbManager, process, steedosPackage) {  
    let processName;
    try {
      processName = getFullName(collection_metadata_name, process)

      const processVersion  = await this.getProcessVersionByProcess(dbManager, process._id.toString());

      const processSchema = processVersion[0]

      steedosPackage[processName] = {
        name: process.name,
        label: process.label,
        object_name: process.object_name,
        engine: process.engine,
        is_active: process.is_active || false,
        ext: process.ext || '',
        description: processSchema.description || '',
        entry_criteria: processSchema.entry_criteria || '',
        when: processSchema.when || '',
        schema: processSchema.schema || ''
      }

    } catch (error) {
        console.log(`metadata error`, error)
        steedosPackage[processName] = { _fake: true}; 
    }   
  }

  async saveOrInsertOne(dbManager, process){
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
      return dbObject._id.toString();
    }
  }

  // TODO: order by version and limit 1
  async getProcessVersionByProcess(dbManager, processId) {
  
    var processVersions = await dbManager.find(process_versions_collection_name, {
      process: processId
    });
  
    processVersions.forEach(processVersion => {
      deleteCommonAttribute(processVersion);
      sortAttribute(processVersion);
    })
   
    // order by version desc, eg: 3, 2, 1
    return processVersions.sort((pre, next) => {
      return next.version - pre.version;
    });
  }

  async saveOrInsertProcessVersion(dbManager, processVersion) {
    const processId = processVersion.process
    var [dbData]= await this.getProcessVersionByProcess(dbManager, processId);
  
    const filter = {
      process: processId
    }
  
    if (dbData && !dbData.is_active) {
      dbManager.update(process_versions_collection_name, filter, processVersion);
    } else  {
       processVersion.version = dbData ? dbData.version + 1 : 1;
       processVersion.is_active = false
       dbManager.insert(process_versions_collection_name, processVersion)
    }
  }
  
}