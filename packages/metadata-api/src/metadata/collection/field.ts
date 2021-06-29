const _ = require('underscore');

import { sortAttribute, deleteNullAttribute } from '../../util/attributeUtil'
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getFullName} from '@steedos/metadata-core';

const collection_name = "object_fields";
const object_layouts = "object_layouts";
const collection_metadata_name = TypeInfoKeys.Field;

export async function fieldsFromDb(dbManager, fieldList, objects){
  for(var i=0; i<fieldList.length; i++){
    
    var reqStr = fieldList[i];
    var objectName = reqStr.substring(0, reqStr.indexOf('.'));
    var fieldName = reqStr.substring(reqStr.indexOf('.')+1);
        
    if(fieldName == '*'){
      var fields = await getAllField(dbManager, objectName);

      for(var j=0; j<fields.length; j++){
        var field = fields[j];
        addFieldToObejcts(field, objects, objectName);
      }
    }else{

      var field = await getFieldByName(dbManager, fieldName, objectName);
      addFieldToObejcts(field, objects, objectName);
    }
    
  }
}

async function addFieldToObejcts(field, objects, objectName){

  var fieldName = getFullName(collection_metadata_name, field);
  
  removeAttributeForField(field); 
  delete field.object;
  delete field._name;
  if(fieldName == 'owner'){
    delete field.type;
    delete field.reference_to;
    delete field.defaultValue;
  }
  deleteNullAttribute(field);
  sortAttribute(field);

  if(typeof objects[objectName] == 'undefined'){

    objects[objectName] = {name: objectName, _fake: true}
  }

  var objFields = objects[objectName][collection_metadata_name];

  if(typeof objFields == 'undefined'){

    objects[objectName][collection_metadata_name] = {};
    objFields = objects[objectName][collection_metadata_name];
  }

  objFields[fieldName] = field;
}

async function getAllField(dbManager, objectName) {
    var field = await dbManager.find(collection_name, {object: objectName});
    return field;
}

async function getFieldByName(dbManager, fieldName, objectName) {
  var field = await dbManager.findOne(collection_name, {name: fieldName, object: objectName}); 
  return field;
}

function removeAttributeForField(field){
  
  var showFields = _.pluck(getFieldsByType(field, field.type, field.data_type), 'name');

  var allFields = _.keys(field);

  var noUseFields = _.difference(allFields, showFields);

  noUseFields.forEach(function (noUseField){
    delete field[noUseField]
  });
}

export async function fieldsToDb(dbManager, fields, objectName){
  for(const fieldName in fields){
    var field = fields[fieldName];
    
    field.name = fieldName;
    field._name = fieldName.replace(/__c$/, "");
    field.object = objectName;

    var requiredFields = _.pluck(_.where(getFieldsByType(field, field.type, field.data_type), {required: true}), 'name');
    var allFields = _.keys(field);
    var missingFields = _.difference(requiredFields, allFields);
    
    if(missingFields.length > 0){
      var errMsg = missingFields.join(',')
      // console.log('Field[ ' + field._name + ' ](' + field.object + ')中，下列字段未填写:'+errMsg)
      throw new Error('Field[ ' + field._name + ' ](' + field.object + ')中，下列字段未填写:'+errMsg)
    }
    await saveOrUpdateField(dbManager, field);
    if(field.required){
      await addFieldToLayouts(dbManager, fieldName, objectName);
    }
  }
}

async function addFieldToLayouts(dbManager, fieldName, objectName) {
  var filter = {object_name: objectName};
  var dbLayouts = await dbManager.find(object_layouts, filter);

  for(let dbLayout of dbLayouts){

    let layoutFieldNames = _.pluck(dbLayout.fields, "field_name");
    if(!_.contains(layoutFieldNames, fieldName)){
      const field = {
        field_name: fieldName,
        is_readonly: false,
        is_required: false
      }
      if(!dbLayout.fields){
        dbLayout.fields = []
      }
      dbLayout.fields.push(field);
      await dbManager.update(object_layouts, {_id: dbLayout._id}, dbLayout);
    }

  }
}

async function saveOrUpdateField(dbManager, field) {

  var filter = {_name: field._name, object: field.object};
  var dbField = await dbManager.findOne(collection_name, filter);

  if(dbField == null){
      return await dbManager.insert(collection_name, field);
  }else{
      return await dbManager.update(collection_name, filter, field);
  }
}


const baseFieldsName = [{ "name": "object", "required": true }, { "name": "label", "required": true }, 
{ name: '_name', required: true}, { "name": "type", "required": false }, { "name": "defaultValue" }, 
{ "name": "group" }, { "name": "sort_no" }, { "name": "is_name" }, { "name": "required" }, 
{ "name": "is_wide" }, { "name": "readonly" }, { "name": "hidden" }, { "name": "omit" }, 
{ "name": "index" }, { "name": "sortable" }, { "name": "searchable" }, { "name": "filterable" },
{ "name":"inlineHelpText"}, {"name":"description"} , {"name":"name"}, {"name":"_id"}];
 
 function getFieldsByType (doc, type, dataType?) {
    let fields:any[] = [];
    if(dataType){
      fields = fields.concat(getFieldsByType(doc, dataType))
    }
    switch (type) {
      case 'textarea':{
        fields.push({ name: 'rows', required: false });
        break;
      }
      case 'select':{
        fields.push({ name: 'options', required: true });
        fields.push({ name: 'options.$', required: false });
        fields.push({ name: 'options.$.label', required: false });
        fields.push({ name: 'options.$.value', required: false });
        fields.push({ name: 'options.$.color', required: false });
        fields.push({ name: 'multiple'});
        break;
      }
      case 'number':{
        fields.push({ name: 'precision', required: false });
        fields.push({ name: 'scale', required: false });
        break;
      }
      case 'currency':{
        fields.push({ name: 'precision', required: false });
        fields.push({ name: 'scale', required: false });
        break;
      }
      case 'lookup': {
        fields.push({ name: 'reference_to'});
        fields.push({ name: 'filtersFunction'});
        fields.push({ name: 'optionsFunction'});
        fields.push({ name: 'multiple'});
        break;
      }
      case 'master_detail': {
        fields.push({ name: 'reference_to'});
        fields.push({ name: 'filtersFunction'});
        fields.push({ name: 'optionsFunction'});
        fields.push({ name: 'write_requires_master_read'});
        break;
      }
      case 'autonumber': {
        fields.push({ name: 'formula', required: true });
        break;
      }
      case 'formula': {
        fields.push({ name: 'formula', required: true });
        fields.push({ name: 'data_type', required: true });
        fields.push({ name: 'formula_blank_value', required: false });
        break;
      }
      case 'summary': {
        fields.push({ name: 'formula_blank_value', required: false });
        fields.push({ name: 'summary_object', required: true });
        fields.push({ name: 'summary_type', required: true });
        fields.push({ name: 'summary_filters', required: true });
        if(doc.summary_type != 'count'){
          fields.push({ name: 'summary_field', required: true });
        }
        fields.push({ name: 'data_type', required: true });
        fields.push({ name: 'precision', required: false });
        fields.push({ name: 'scale', required: false });
        fields.push({ name: 'filters' });
        fields.push({ name: 'filters.$' });
        fields.push({ name: 'filters.$.field' });
        fields.push({ name: 'filters.$.operation' });
        fields.push({ name: 'filters.$.value' });
        break;
      }
      default:
        break;
    }
    
    return baseFieldsName.concat(fields);
  }




