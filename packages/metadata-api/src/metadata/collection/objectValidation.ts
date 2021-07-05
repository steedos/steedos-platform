import {deleteCommonAttribute, sortAttribute} from '../../util/attributeUtil'
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getFullName } from '@steedos/metadata-core';

const collection_name = "object_validation_rules";
const collection_metadata_name = TypeInfoKeys.ValidationRule;

export async function validationsFromDb(dbManager, validationList, objects){

  for(var i=0; i<validationList.length; i++){

    var reqStr = validationList[i];
    var objectName = reqStr.substring(0, reqStr.indexOf('.'));
    var validationName = reqStr.substring(reqStr.indexOf('.')+1);

    if(validationName == '*'){
      var validations = await getAllValidation(dbManager, objectName);

      for(var j=0; j<validations.length; j++){
        var validation = validations[j];
        addValidationsToObejcts(validation, objects, objectName);
      }
    }else{

      var validation = await getValidationByName(dbManager, validationName, objectName);
      addValidationsToObejcts(validation, objects, objectName);
    }
  }
}

async function addValidationsToObejcts(validation, objects, objectName){
  var validationName = getFullName(collection_metadata_name, validation)
  deleteCommonAttribute(validation);
  delete validation.object_name;
  sortAttribute(validation);
  
  if(typeof objects[objectName] == 'undefined'){
    objects[objectName] = {name: objectName, _fake: true}
  }
    
  var objValidations = objects[objectName][collection_metadata_name];

  if(typeof objValidations == 'undefined'){

    objects[objectName][collection_metadata_name] = {};
    objValidations = objects[objectName][collection_metadata_name];
  }
  
  objValidations[validationName] = validation;

}

async function getAllValidation(dbManager, objectName) {

  var validation = await dbManager.find(collection_name, {object_name: objectName});
  return validation;
}

async function getValidationByName(dbManager, validationName, objectName) {

    var validation = await dbManager.findOne(collection_name, {name: validationName, object_name: objectName});
    return validation;
}

export async function validationsToDb(dbManager, validations, objectName){
  for(const validationName in validations){
    var validation = validations[validationName];
    validation.object_name = objectName;
    await saveOrUpdateValidation(dbManager, validation);
  }
}

async function saveOrUpdateValidation(dbManager, validation) {

  var filter = {name: validation.name, object_name: validation.object_name};
  var dbValidation = await dbManager.findOne(collection_name, filter);

  if(dbValidation == null){
    return await dbManager.insert(collection_name, validation);
  }else{
    return await dbManager.update(collection_name, filter, validation);
  }
}