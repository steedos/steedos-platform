import { SteedosMetadataTypeInfoKeys as TypeInfoKeys} from '@steedos/metadata-core';
import {deleteCommonAttribute, sortAttribute} from '../../util/attributeUtil'

const collection_name = "process_versions";
const collection_metadata_name = TypeInfoKeys.ProcessVersion;

export async function processVersionFromDb(dbManager, processList, steedosPackage) {

  for(var i=0; i<processList.length; i++){
    
    var processName = processList[i]
    var processId = steedosPackage[processName]._id;

    var processVersions = await getProcessVersionByProcess(dbManager, processId);

    var lastestProcessVersion = processVersions[0] ?? {}

    addProcessVersionToProcess(lastestProcessVersion, steedosPackage, processName);
  }
}


export async function getProcessVersionByProcess(dbManager, processId) {
  
  var processVersions = await dbManager.find(collection_name, {
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

function addProcessVersionToProcess(processVersion, process, processName) {
  process[processName][collection_metadata_name] = {
    processVersion: processVersion
  };
}