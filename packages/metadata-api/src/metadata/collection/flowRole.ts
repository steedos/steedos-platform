import {deleteCommonAttribute, sortAttribute} from '../../util/attributeUtil'
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getFullName } from '@steedos/metadata-core';

const collection_name = 'flow_roles'
const collection_metadata_name = TypeInfoKeys.FlowRole;

export async function flowRolesFromDb(dbManager, flowRoleList, steedosPackage){
    
    steedosPackage[collection_metadata_name] = {}
    var packageFlowRoles = steedosPackage[collection_metadata_name]

    if(flowRoleList.length == 1 && flowRoleList[0] == '*'){

        var dbFlowRoles = await getAllFlowRoles(dbManager);
        for(var i=0; i<dbFlowRoles.length; i++){
            var dbFlowRole = dbFlowRoles[i]
            var dbFlowRoleName = getFullName(collection_metadata_name, dbFlowRole)
            packageFlowRoles[dbFlowRoleName] = dbFlowRole
        }

    }else{

        for(var i=0; i<flowRoleList.length; i++){

            var flowRoleName = flowRoleList[i];
            
            var dbFlowRole = await getFlowRoleByName(dbManager, flowRoleName);
            var dbFlowRoleName = getFullName(collection_metadata_name, dbFlowRole)
            packageFlowRoles[dbFlowRoleName] = dbFlowRole;
            
        }
    }
}




async function getAllFlowRoles(dbManager) {

    var flowRoles = await dbManager.find(collection_name, {});

    for(var i=0; i<flowRoles.length; i++){
        let flowRole = flowRoles[i]
        deleteCommonAttribute(flowRole);
        sortAttribute(flowRole);
    }

    return flowRoles
}

async function getFlowRoleByName(dbManager, flowRoleName) {

    var flowRole = await dbManager.findOne(collection_name, {api_name: flowRoleName});
    deleteCommonAttribute(flowRole);
    sortAttribute(flowRole);
    return flowRole;
}

export async function flowRolesToDb(dbManager, flowRoles){
    for(var flowRoleName in flowRoles){
        var flowRole = flowRoles[flowRoleName];
        flowRole.api_name = flowRoleName
        await saveOrUpdateFlowRole(dbManager, flowRole);
    }
  }
  
async function saveOrUpdateFlowRole(dbManager, flowRole) {

    var filter = {api_name: flowRole.api_name};
    var dbFlowRole = await dbManager.findOne(collection_name, filter);

    if(dbFlowRole == null){
        return await dbManager.insert(collection_name, flowRole);
    }else{
        return await dbManager.update(collection_name, filter, flowRole);
    }
}
