/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-26 16:02:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-08 10:04:00
 * @Description: 
 */
const Fields = require('../fields');
const lodash = require('lodash');

const getFieldSchemaArray = (mergedSchema)=>{
  let fieldSchemaArray = [];
  fieldSchemaArray.length = 0

  const fieldsArr = [];
  lodash.forEach(mergedSchema.fields, (field, fieldName)=>{
    if(!lodash.has(field, "name")){
      field.name = fieldName
    }
        fieldsArr.push(field)
  })

  lodash.forEach(lodash.sortBy(mergedSchema.fields, "sort_no"), (field) => {
    if (!field.group || field.group == 'null' || field.group == '-')
      field.group = '通用'
    const fieldName = field.name;
    let isObjectField = /\w+\.\w+/.test(fieldName)
    if (field.type == 'grid' || field.type == 'object') {
      // field.group = field.label
      field.is_wide = true;
    }
    
    if (!isObjectField){
      if(!field.hidden){
          fieldSchemaArray.push(Object.assign({name: fieldName}, field, {permission: {allowEdit: true}}))
      }
    }
  })
  return fieldSchemaArray;
}

const getSection = (permissionFields, fieldSchemaArray, sectionName) => {
  const sectionFields = lodash.filter(fieldSchemaArray, { 'group': sectionName });
  if(sectionFields.length == lodash.filter(sectionFields, ['hidden', true]).length){
    return ;
  }

  const fieldSetBody = [];

  _.each(sectionFields, (perField)=>{
      let field = perField;
      if(perField.type === 'grid'){
          field = Fields.getGridFieldSubFields(perField, permissionFields);
      }else if(perField.type === 'object'){
          field = Fields.getObjectFieldSubFields(perField, permissionFields);
      }
      if(field.name.indexOf(".") < 0){
          const amisField = Fields.convertSFieldToAmisField(field, field.readonly);
          if(amisField){
              fieldSetBody.push(amisField)
          }
      }
  });

  return {
      "type": "fieldSet",
      "title": sectionName,
      "collapsable": true,
      "body": fieldSetBody
  }
}

export const getSections = (permissionFields, mergedSchema) => {
  const fieldSchemaArray = getFieldSchemaArray(mergedSchema)
  const _sections = lodash.groupBy(fieldSchemaArray, 'group');
  const sections = [];
  lodash.forEach(_sections, (value, key) => {
    const section = getSection(permissionFields, fieldSchemaArray, key);
    if(section.body.length > 0){
      sections.push(section)
    }
  })
  return sections;
}