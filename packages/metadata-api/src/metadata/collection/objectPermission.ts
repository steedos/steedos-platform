import {getPermissionsetById, getPermissionsetIdByName} from './permissionset'
import {deleteCommonAttribute, sortAttribute} from '../../util/attributeUtil'
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getFullName } from '@steedos/metadata-core';
import { permissionSetsToDb, isSystemProfile } from './permissionset';
import { getObjectFieldPermissions, saveOrUpdateFieldPermissions } from './fieldPermission';

const collection_name = 'permission_objects'
const collection_metadata_name = TypeInfoKeys.Permission;
const internalPermissionSet = ['admin', 'user', 'supplier', 'customer'];

export async function objectPermissionsFromDb(dbManager, permissionList, objects){

    var permissions_final = {}
    
    for(var i=0; i<permissionList.length; i++){

        var reqStr = permissionList[i];
        var objectName = reqStr.substring(0, reqStr.indexOf('.'));
        var permissionsetName = reqStr.substring(reqStr.indexOf('.')+1);

        if(permissionsetName == '*'){
            var permissions = await getPermissionsByObjectName(dbManager, objectName);

            for(var j=0; j<permissions.length; j++){
                var permission = permissions[j];
                var permissionSet = await getPermissionsetById(dbManager, permission.permission_set_id);
                
                if(permissionSet != null){
                    permission.permission_set_id = permissionSet.name;
                }
    
                var permissionName = getFullName(collection_metadata_name, permission)
                delete permission.object_name;

                permission.field_permissions = await getObjectFieldPermissions(dbManager, objectName, permission.permission_set_id)
                permissions_final[permissionName] = permission;
    
            }           
            
        }else{
            var parsedPermissionSetId = await getPermissionsetIdByName(dbManager, permissionsetName);
            var dbPermissionSetId = parsedPermissionSetId
            if(parsedPermissionSetId == null){
                if(internalPermissionSet.indexOf(permissionsetName) == -1 ){
                    throw new Error('can not find permissionset:'+permissionsetName);
                }
                dbPermissionSetId = permissionsetName
            }
    
            var permission = await getPermissionByPermissionSetId(dbManager, objectName, dbPermissionSetId);
            permission.permission_set_id = permissionsetName
           
            var permissionName = getFullName(collection_metadata_name, permission);
            delete permission.object_name;

            permission.field_permissions = await getObjectFieldPermissions(dbManager, objectName, permission.permission_set_id)
            permissions_final[permissionName] = permission;
        }

        if(typeof objects[objectName] == 'undefined'){
            objects[objectName] = {name: objectName, _fake: true}
        }
       
        
    }
    objects[objectName][collection_metadata_name] = permissions_final;
}

export async function getPermissionByPermissionSetId(dbManager, objectName, permissionSetId) {

    var permission = await dbManager.findOne(collection_name, {object_name: objectName, permission_set_id: permissionSetId});
    deleteCommonAttribute(permission);
    sortAttribute(permission);
    return permission;
}

export async function getPermissionsByObjectName(dbManager, objectName) {

    var permissions = await dbManager.find(collection_name, {object_name: objectName});
    for(var i=0; i<permissions.length; i++){
        deleteCommonAttribute(permissions[i]);
        sortAttribute(permissions[i]);
    }
    return permissions;
}

export async function getPermissionsByName(dbManager, name) {

    var permissions = await dbManager.find(collection_name, {name: name});
    for(var i=0; i<permissions.length; i++){
        deleteCommonAttribute(permissions[i]);
        sortAttribute(permissions[i]);
    }
    return permissions;
}

export async function objectPermissionsToDb(dbManager, permissions, permissionsets, objectName){
    for(const permissionName in permissions){

        var permission = permissions[permissionName];
        permission.object_name = objectName;

        var permissionSetId = await getPermissionsetIdByName(dbManager, permissionName);
        
        if(permissionSetId != null){
            permission.permission_set_id = permissionSetId;
        }else{
            var foundPermissionset = false;
            for(var i=0; i<permissionsets.length;i++){
                if(permission.permission_set_id == permissionsets[i].name){
                    if(permissionsets[i]._id) {
                        permission.permission_set_id = permissionsets[i]._id;
                    }
                    foundPermissionset = true;
                    break;
                }
            }
            if(!foundPermissionset){
                if(!isSystemProfile(permissionName)){
                    throw new Error('can not find permissionset:'+permissionName);
                }
                var permissionSet = {}
                permissionSet[permissionName] = { name: permissionName}
                await permissionSetsToDb(dbManager, permissionSet, true);
            }
        }
        await saveOrUpdateFieldPermissions(dbManager, permissionName, objectName, permission);
        delete permission.field_permissions;
        await saveOrUpdatePermission(dbManager, permission);
    }
  }
  
async function saveOrUpdatePermission(dbManager, permission) {

    var filter = {permission_set_id: permission.permission_set_id, object_name: permission.object_name};
    var dbField = await dbManager.findOne(collection_name, filter);

    if(dbField == null){
        return await dbManager.insert(collection_name, permission);
    }else{
        return await dbManager.update(collection_name, filter, permission);
    }
}
  