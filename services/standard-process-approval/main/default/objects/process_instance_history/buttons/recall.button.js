module.exports = {
    recallVisible: function(object_name, record_id, record_permissions, props){
      console.error("recallVisible3333", props)
      return Steedos.ProcessManager.allowRecall(props.record.target_object.o, props.record.target_object.ids[0])
    },
  }