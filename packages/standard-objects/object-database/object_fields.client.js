Steedos.ObjectFieldManager = {};

const baseFieldsName = [{ "name": "object", "required": true }, { "name": "label", "required": true }, { "name": "name" }, { "name": "_name", "required": true }, { "name": "type", "required": true }, { "name": "defaultValue" }, { "name": "group" }, { "name": "sort_no" }, { "name": "is_name" }, { "name": "required" }, { "name": "is_wide" }, { "name": "readonly" }, { "name": "hidden" }, { "name": "omit" }, { "name": "index" }, { "name": "sortable" }, { "name": "searchable" }, { "name": "filterable" }, {"name":"inlineHelpText"},{"name":"description"}];

function getFieldsByType(type, dataType) {
  let fields = [];
  if(dataType){
    fields = fields.concat(getFieldsByType(dataType))
  }
  switch (type) {
    case 'textarea':{
      fields.push({ name: 'rows', required: true });
      break;
    }
    case 'select':{
      fields.push({ name: 'options', required: true });
      fields.push({ name: 'options.$', required: true });
      fields.push({ name: 'options.$.label', required: true });
      fields.push({ name: 'options.$.value', required: true });
      fields.push({ name: 'options.$.color', required: false });
      break;
    }
    case 'number':{
      fields.push({ name: 'precision', required: true });
      fields.push({ name: 'scale', required: true });
      break;
    }
    case 'currency':{
      fields.push({ name: 'precision', required: true });
      fields.push({ name: 'scale', required: true });
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
      break;
    }
    case 'autonumber': {
      fields.push({ name: 'formula', required: true });
      break;
    }
    case 'formula': {
      fields.push({ name: 'formula', required: true });
      fields.push({ name: 'data_type', required: true });
      fields.push({ name: 'formula_blank_value', required: true });
      break;
    }
    case 'summary': {
      fields.push({ name: 'summary_object', required: true });
      fields.push({ name: 'summary_type', required: true });
      fields.push({ name: 'summary_field', required: true });
      // fields.push({ name: 'data_type', required: true });
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
  return fields;
}


Steedos.ObjectFieldManager.changeSchema = function (doc, schema) {
  var clone = require('clone');
  var fields = clone(Creator.getObject("object_fields").fields);
  var showFields = baseFieldsName.concat(getFieldsByType(doc.type, doc.data_type));
  var objectName = doc.object;
  if(_.isObject(objectName)){
    objectName = objectName.name
  }
  if(Creator.getObject(objectName).database_name){
    showFields.push({"name":"column_name"})
    showFields.push({"name":"primary"})
    showFields.push({"name":"generated"})
  }
  _.map(fields, function(field, fname){
    var showField = _.find(showFields, function(item){
      return item && item.name === fname;
    })
    if(showField){
      Object.assign(field, showField)
    }else{
      console.log('hidden', field);
      Object.assign(field, {omit: true, hidden: true})
    }
  })

  var objectSchema = Creator.getObjectSchema({fields: fields});

  Object.assign(schema, new SimpleSchema(objectSchema)) 
}