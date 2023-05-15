module.exports = {
  recallVisible: function (object_name, record_id, record_permissions, props) {
    return Steedos.ProcessManager.allowRecall(props.record.target_object.o, props.record.target_object.ids[0])
  },
}