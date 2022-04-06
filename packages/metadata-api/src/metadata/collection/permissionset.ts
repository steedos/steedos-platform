import {DbManager} from '../../util/dbManager'
import {deleteCommonAttribute, sortAttribute} from '../../util/attributeUtil'
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getFullName } from '@steedos/metadata-core';
const _ = require('underscore');

const collection_name = "permission_set";
const profile_metadata_name = TypeInfoKeys.Profile;
const permissionset_metadata_name = TypeInfoKeys.Permissionset;

export async function permissionsetsFromDb(dbManager, permissionSetList, steedosPackage, is_profile=false){

    // todo 
    // CustomPermissionset:
    //     '*'
    //     'accounts.user'
    //     'accounts.admin'

    if(permissionSetList.length == 1 && permissionSetList[0] == '*'){

        var dbPermissionSets = await getAllPermissionSet(dbManager, is_profile);
        for(var i=0; i<dbPermissionSets.length; i++){
            var dbPermissionSet = dbPermissionSets[i]
            delete dbPermissionSet._id
            var propertyKey;
            if(is_profile == true){
                propertyKey = profile_metadata_name
            }else{
                propertyKey = permissionset_metadata_name
                delete dbPermissionSet.lockout_interval
                delete dbPermissionSet.max_login_attempts
                delete dbPermissionSet.password_history
            }
            steedosPackage[propertyKey] = {}
            steedosPackage[propertyKey][getFullName(propertyKey, dbPermissionSet)] = dbPermissionSet;
        }

    }else{
        var permissionsets
        if(is_profile == true){
            steedosPackage[profile_metadata_name] = {};
            permissionsets = steedosPackage[profile_metadata_name];
        }else{
            steedosPackage[permissionset_metadata_name] = {};
            permissionsets = steedosPackage[permissionset_metadata_name];
        }

        for(var i=0; i<permissionSetList.length; i++){
    
            var permissionset = await getPermissionsetByName(dbManager, permissionSetList[i], is_profile);
            if(is_profile == false){
                delete permissionset.lockout_interval
                delete permissionset.max_login_attempts
                delete permissionset.password_history
            }
            delete permissionset._id
            permissionsets[permissionset.name] = permissionset;
    
        }
    }

}

export async function getAllPermissionSet(dbManager, is_profile) {
    var filter
    if(is_profile == true){
        filter = {type: 'profile'}
    }else{
        filter = {type: {$ne: 'profile'}}
    }
    var permissionsets = await dbManager.find(collection_name, filter);

    for(var i=0; i<permissionsets.length; i++){
        let permissionset = permissionsets[i]
        sortAttribute(permissionset);
        deleteCommonAttribute(permissionset);
        delete permissionset.type
        delete permissionset.users
    }
    return permissionsets;
}

export async function getPermissionsetById(dbManager, permissionSetId) {

    var permissionset = await dbManager.findOne(collection_name, {_id: permissionSetId});
    if(permissionset != null){
        sortAttribute(permissionset);
        deleteCommonAttribute(permissionset);
        delete permissionset.type
    }
    return permissionset;
}

export async function getPermissionsetIdByName(dbManager, permissionSetName) {
    
    var filter = {name: permissionSetName}
    var permissionset = await dbManager.findOne(collection_name, filter);

    if(permissionset){
        return permissionset._id;
    }else{
        return null;
    }
}

export async function getPermissionsetByName(dbManager, permissionSetName, is_profile) {

    var filter
    if(is_profile == true){
        filter = {name: permissionSetName, type: 'profile'}
    }else{
        filter = {name: permissionSetName, type: {$ne: 'profile'}};
    }

    var permissionset = await dbManager.findOne(collection_name, filter);
    if(permissionset != null){
        deleteCommonAttribute(permissionset);
        sortAttribute(permissionset);
        delete permissionset.users;
    }
    return permissionset;
}

const baseRecord = {
    type: 'profile',
    password_history: '3',
    max_login_attempts: '10',
    lockout_interval: '15'
}

const internalPermissionSet = [
    {_id: 'admin', name: 'admin',label: 'admin', ...baseRecord},
    {_id: 'user', name: 'user',label: 'user', ...baseRecord},
    {_id: 'supplier', name: 'supplier',label: 'supplier', ...baseRecord},
    {_id: 'customer', name: 'customer', label: 'customer',...baseRecord}
];

export function isSystemProfile(profileName){
    var system_profile_names = _.pluck(internalPermissionSet, 'name')
    var is_system_profile = _.contains(system_profile_names, profileName)
    return is_system_profile;
}
export async function permissionSetsToDb(dbManager, permissionSets, is_profie?:boolean){
    for(const permissionSetName in permissionSets){
      var permissionSet = permissionSets[permissionSetName];
      permissionSet['name'] = permissionSetName;

      if(is_profie == true){
        permissionSet['type'] = 'profile';
    }else{
        permissionSet['type'] = 'permission_set';
      }
      if(permissionSetName === 'admin' 
            || permissionSetName === 'user' 
            || permissionSetName === 'supplier'
            || permissionSetName === 'customer'){
                
            let permissionSet_base = _.find(internalPermissionSet, function(item){
                return item._id == permissionSetName;
            })
            
            permissionSet = Object.assign({}, permissionSet_base, permissionSet );
            delete permissionSet._id; 
        }
     
    
      await saveOrUpdatePermissionSet(dbManager, permissionSet);
    }
  }
  
async function saveOrUpdatePermissionSet(dbManager, permissionSet) {
    var filter = {name: permissionSet.name};
    var dbPermissionSet = await dbManager.findOne(collection_name, filter);

    if(dbPermissionSet == null){
        return await dbManager.insert(collection_name, permissionSet);
    }else{

        if(dbPermissionSet.license != permissionSet.license){
            throw new Error('Edit on the license of permission set is forbidden.')
        }
        return await dbManager.update(collection_name, filter, permissionSet);
    }
}