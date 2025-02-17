module.exports = { 
customize:function (object_name, record_id, fields) {
      let doc = Creator.odata.get(object_name, record_id);
      if(!doc.columns || !doc.columns.length){
        const objectName_label = record_id.split('.');
        let columns = Creator.getListView(objectName_label[0], objectName_label[1], true).columns;
        doc.columns = columns || [];
      }
      doc.columns = doc.columns.map((item)=>{
        if(typeof item === 'string'){
          return { field: item }
        }
        return item;
      })
      var newRecord = _.pick(doc, Creator.getObjectFieldsName(object_name));
      delete newRecord.is_system;
      delete newRecord._id;
      delete newRecord.record_permissions;
      newRecord.from_code_id = record_id;
      Creator.odata.insert(object_name, newRecord, function(result, error){
          if(result){
              FlowRouter.go(`/app/-/${object_name}/view/${result._id}`)
          }
      });
          
  },
customizeVisible:function(object_name, record_id, record_permissions, data){
    var record = data && data.record;
    return Steedos.Object.base.actions.standard_new.visible(object_name) && record.is_system;
  }
 }