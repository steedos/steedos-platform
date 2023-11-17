/*
 * @Author: yinlianghui@steedos.com
 * @Date: 2022-04-13 10:31:03
 * @LastEditors: liaodaxue
 * @LastEditTime: 2023-11-17 15:48:30
 * @Description: 
 */
var objectql = require('@steedos/objectql');
  
async function insertParentAndChildrenFieldForTreeObject(doc, needToCheckExists){
    const baseProps = {
        object: doc.name,
        reference_to: doc.name,
        deleted_lookup_record_behavior: "clear",
        type: 'lookup',
        owner: doc.owner,
        space: doc.space,
        created_by: doc.created_by,
        modified_by: doc.modified_by,
        company_id: doc.company_id,
        company_ids: doc.company_ids
    }
    let isParentFieldExists = false;
    let isChildrenFieldExists = false;
    if(needToCheckExists){
      const object = await objectql.getObject(doc.name);
      const fields = object.toConfig().fields;
      isParentFieldExists = _.has(fields,'parent');
      isChildrenFieldExists = _.has(fields,'children');
    }
    let docs = [];
    if(!isParentFieldExists){
      docs.push(
        {
          _name: 'parent',
          label: '父' + doc.label,
          ...baseProps
        }
      )
    }
    if(!isChildrenFieldExists){
      docs.push(
        {
          _name: 'children',
          label: '子' + doc.label,
          multiple: true, 
          visible_on: "{{false}}",
          ...baseProps
        }
      )
    }
    _.each(docs, async (item)=>{
        await objectql.getObject('object_fields').insert(item);
    })
}

module.exports = {
    insertParentAndChildrenFieldForTreeObject
}