module.exports = {
  listenTo: 'object_layouts',

  customize: function (object_name, record_id, fields) {
    let doc = Creator.odata.get(object_name, record_id);
    var newRecord = _.pick(doc, Creator.getObjectFieldsName(object_name));
    delete newRecord.is_system;
    delete newRecord._id;
    newRecord.from_code_id = record_id;
    Creator.odata.insert(object_name, newRecord, function(result, error){
        if(result){
            FlowRouter.go(`/app/-/${object_name}/view/${result._id}`)
        }
    });
  },
  customizeVisible: function(object_name, record_id, record_permissions, record){
      return Creator.baseObject.actions.standard_new.visible() && record.is_system;
  }
}