import { dbToJson } from '../../metadata/retrieve/dbToJson'
import { deleteCommonAttribute, sortAttribute } from '../../util/attributeUtil';

import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getFullName, getChilds, getChildMetadataNames, stringToFunction, functionToString } from '@steedos/metadata-core';
import * as _ from 'underscore';
const collection_name = "objects";
const collection_metadata_name = TypeInfoKeys.Object;

export async function objectsFromDb(dbManager, objectList, steedosPackage){
 
    steedosPackage[collection_metadata_name] = {}
    var objects = steedosPackage[collection_metadata_name];

    if(objectList.length == 1 && objectList[0] == '*'){
        var dbObjs = await getAllObject(dbManager);
        for(var i=0; i<dbObjs.length; i++){
            var dbObj = dbObjs[i]
            var dbObjName = getFullName(collection_metadata_name, dbObj)
            steedosPackage[collection_metadata_name][dbObjName] = dbObj;
            await getChildProperty(steedosPackage, dbManager, dbObjName);
        }
    }else{

        for(var i=0; i<objectList.length; i++){
            var objectName;
            try {     
                var object = await getObjectByName(dbManager, objectList[i]);
                objectName = getFullName(collection_metadata_name, object)
                objects[objectName] = object;  
            } catch (error) {
                objectName = objectList[i]
                objects[objectName] = { _fake: true}; 
            }  
            await getChildProperty(steedosPackage, dbManager, objectName)
        }
    }
    
}

async function getChildProperty(steedosPackage, dbManager, objectName){
    var propertyStr =  objectName + ".*"

    const childMetadataNames = getChilds(collection_metadata_name);
    
    var reqYml = {};
    for(const childMetadataName of childMetadataNames){
        reqYml[childMetadataName] = [propertyStr]
    }

    await dbToJson(reqYml, steedosPackage, dbManager);
}

export async function getAllObject(dbManager) {

    var objects = await dbManager.find(collection_name, {is_deleted: {$ne: true}});

    for(var i=0; i<objects.length; i++){
        let object = objects[i]

        deleteCommonAttribute(object);
        removeAttributeForObject(object);
        sortAttribute(object);

        if(_.has(object, 'form')){
            object.form = JSON.parse(JSON.stringify(object.form), function(key, val){
                return stringToFunction(val);
            })
        }

    }
    return objects;
}

async function getObjectByName(dbManager, objectName) {
    var object = await dbManager.findOne(collection_name, {name: objectName});
    deleteCommonAttribute(object);
    removeAttributeForObject(object);
    sortAttribute(object);
    if(_.has(object, 'form')){
        object.form = JSON.parse(JSON.stringify(object.form), function(key, val){
            return stringToFunction(val);
        })
    }
    return object;
}

function removeAttributeForObject(object){
    // delete object.custom;
    delete object.fields;
    delete object.actions;
    delete object.listviews;
    delete object.permissions;
    delete object.validationRules;
    
    delete object.datasource;
    delete object.in_development;
    delete object.is_deleted;
    delete object.fields_serial_number;
    delete object.reload_time;

    delete object.app_unique_id;
    delete object.app_version;
    delete object.deleted;
    delete object.deleted_by;


    _.each(_.keys(object), function(key){
        if(_.isNull(object[key])){
            delete object[key]
        }
    })

}

export async function objectsToDb(dbManager, objects){
    for(const objectName in objects){
        var object = objects[objectName];
        object.actions = object.buttons
        delete object.buttons;
        delete object.listviews;
        delete object.permissions;
        if(!object.is_deleted){
            object.is_deleted = false;
        }
        for(const actionName in object.actions){
            object.actions[actionName]['_id'] = actionName;  // todo:待action从内存中加载数据,不再依赖_id后删除此行代码.
        }

        if(_.has(object, 'form')){
            object.form = JSON.parse(JSON.stringify(object.form, function(key, val){
                return functionToString(val);
            }))
        }
        
        await saveOrUpdateObject(dbManager, object);
    }
}

async function saveOrUpdateObject(dbManager, object) {

    if(typeof object.name == 'undefined'){
        return;
    }
    var filter = {name: object.name};
    var dbObject = await dbManager.findOne(collection_name, filter);
    
    if(dbObject == null){
        dbObject = await dbManager.findOne(collection_name, {name: object.name}, false)
        if(dbObject){
            throw new Error(`object api_name already exists: ${object.name}`); 
        }

        if (!_.has(object, 'in_development')) {
            object.in_development = '1';
        }

        return await dbManager.insert(collection_name, object);
    }else{
        return await dbManager.update(collection_name, filter, object);
    }
}