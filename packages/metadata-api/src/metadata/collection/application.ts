
import {deleteCommonAttribute, sortAttribute} from '../../util/attributeUtil'
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getFullName } from '@steedos/metadata-core';
const collection_name = 'apps'
const collection_metadata_name = TypeInfoKeys.Application;
export async function applicationsFromDb(dbManager, applicationList, steedosPackage){

    
    if(applicationList.length == 1 && applicationList[0] == '*'){
        
        var dbApps = await getAllApplications(dbManager);
        for(var i=0; i<dbApps.length; i++){
            var dbApp = dbApps[i]
            var appCode = getFullName(collection_metadata_name, dbApp)
            sortAttribute(dbApp)
            if(!steedosPackage[collection_metadata_name]){
                steedosPackage[collection_metadata_name] = {}
            }
            steedosPackage[collection_metadata_name][appCode] = dbApp
        }
        
    }else{
        var packageApplications = steedosPackage[collection_metadata_name]
        if(!packageApplications){
            steedosPackage[collection_metadata_name] = {}
            packageApplications = steedosPackage[collection_metadata_name]
        }

        for(var i=0; i<applicationList.length; i++){

            var applicationName = applicationList[i];
            
            var application = await getApplicationByName(dbManager, applicationName);
            var appCode = getFullName(collection_metadata_name, application)
            sortAttribute(application)
            packageApplications[appCode] = application;
            
        }
    }
}




async function getAllApplications(dbManager) {

    var applications = await dbManager.find(collection_name, {});

    for(var i=0; i<applications.length; i++){
        let application = applications[i]

        delete application.members
        delete application.from_code_id
        deleteCommonAttribute(application);
    }

    return applications
}

async function getApplicationByName(dbManager, applicationName) {

    var application = await dbManager.findOne(collection_name, {code: applicationName});
    delete application.members
    delete application.from_code_id
    deleteCommonAttribute(application);
    return application;
}

export async function applicationsToDb(dbManager, applications){
    for(var appName in applications){
        var application = applications[appName];
        application.code = appName
        delete application._id
        await saveOrUpdateApplication(dbManager, application);
    }
  }
  
async function saveOrUpdateApplication(dbManager, application) {

    var filter = {code: application.code};
    var dbApp = await dbManager.findOne(collection_name, filter);

    if(dbApp == null){
        return await dbManager.insert(collection_name, application);
    }else{
        return await dbManager.update(collection_name, filter, application);
    }
}
