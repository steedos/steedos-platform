module.exports = {
    approveVisible: function(object_name, record_id, record_permissions){
      return Steedos.ProcessManager.allowApprover(object_name, record_id)
    },
    approve: function(object_name, record_id, fields){
      Steedos.ProcessManager.approve(object_name, record_id);
    },
    rejectVisible: function(object_name, record_id, record_permissions){
      return Steedos.ProcessManager.allowApprover(object_name, record_id)
    },
    reject: function(object_name, record_id, fields){
      Steedos.ProcessManager.reject(object_name, record_id);
    },
    reassignVisible: function(object_name, record_id, record_permissions){
      return Steedos.ProcessManager.allowApprover(object_name, record_id)
    },
    reassign: function(object_name, record_id, fields){
      Steedos.ProcessManager.reassign(object_name, record_id);
    },
    recallVisible: function(){
      return Steedos.ProcessManager.allowRecall(Session.get("object_name"), Session.get("record_id"))
    },
    recall: function(object_name, record_id, fields){
      Steedos.ProcessManager.recall(object_name, record_id);
    }
  }