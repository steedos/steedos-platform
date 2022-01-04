var objectql = require('@steedos/objectql');
  
async function insertParentAndChildrenFieldForTreeObject(doc){
    const baseProps = {
        object: doc.name,
        reference_to: doc.name,
        type: 'lookup',
        owner: doc.owner,
        space: doc.space,
        created_by: doc.created_by,
        modified_by: doc.modified_by,
        company_id: doc.company_id,
        company_ids: doc.company_ids
    }
    const fields = await objectql.getObject(doc.name).toConfig().fields;
    let docs = [];
    if(!_.has(fields,'parent')){
      docs.push(
        {
          _name: 'parent',
          label: '父' + doc.label,
          ...baseProps
        }
      )
    }
    if(!_.has(fields,'children')){
      docs.push(
        {
          _name: 'children',
          label: '子' + doc.label,
          multiple: true, 
          omit: true,
          hidden: true,
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