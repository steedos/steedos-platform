import {deleteCommonAttribute, sortAttribute} from '../../util/attributeUtil'
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getFullName } from '@steedos/metadata-core';

const collection_name = 'roles'
const collection_metadata_name = TypeInfoKeys.Role;

export async function rolesFromDb(dbManager, roleList, steedosPackage){
    
    steedosPackage[collection_metadata_name] = {}
    var packageRoles = steedosPackage[collection_metadata_name]

    if(roleList.length == 1 && roleList[0] == '*'){

        var dbRoles = await getAllRoles(dbManager);
        for(var i=0; i<dbRoles.length; i++){
            var dbRole = dbRoles[i]
            var dbRoleName = getFullName(collection_metadata_name, dbRole)
            packageRoles[dbRoleName] = dbRole
        }

    }else{

        for(var i=0; i<roleList.length; i++){

            var roleName = roleList[i];
            
            var dbRole = await getRoleByName(dbManager, roleName);
            var dbRoleName = getFullName(collection_metadata_name, dbRole)
            packageRoles[dbRoleName] = dbRole;
            
        }
    }
}




async function getAllRoles(dbManager) {

    var roles = await dbManager.find(collection_name, {});

    for(var i=0; i<roles.length; i++){
        let role = roles[i]
        delete role.users;
        // if(role.parent){
        //     var parent = await dbManager.findOne(collection_name, {_id: role.parent});
        //     role.parent = parent.name;
        // }
        deleteCommonAttribute(role);
        sortAttribute(role);
    }

    return roles
}

async function getRoleByName(dbManager, roleName) {

    var role = await dbManager.findOne(collection_name, {api_name: roleName});
    delete role.users;
    // if(role.parent){       
    //     var parent = await dbManager.findOne(collection_name, {_id: role.parent});
    //     role.parent = parent.api_name;
    // }
    deleteCommonAttribute(role);
    sortAttribute(role);
    return role;
}

export async function rolesToDb(dbManager, roles){
    for(var roleName in roles){
        var role = roles[roleName];
        role.api_name = roleName
        await saveOrUpdateRole(dbManager, role);
    }
    for(var roleName in roles){
        var role = roles[roleName];
        role.api_name = roleName
        if(role.parent){
            var parent = await dbManager.findOne(collection_name, {api_name: role.parent});
            if(!parent){
                throw new Error(`The role[${roleName}] has an invalid Parent: ${role.parent}`);
            }
            role.parent = parent.api_name;
        }
        await saveOrUpdateRole(dbManager, role);
    }
  }
  
async function saveOrUpdateRole(dbManager, role) {

    var filter = {api_name: role.api_name};
    var dbRole = await dbManager.findOne(collection_name, filter);

    if(dbRole == null){
        return await dbManager.insert(collection_name, role);
    }else{
        return await dbManager.update(collection_name, filter, role);
    }
}
