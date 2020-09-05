module.exports = {
    approveVisible: function(object_name, record_id, record_permissions){
      return Steedos.ProcessManager.showApproveButs(object_name, record_id)
    },
    approve: function(object_name, record_id, fields){
      Steedos.authRequest(`/api/v4/process/approve/${object_name}/${record_id}`, {type: 'post', data: JSON.stringify({comments: `同意 -- ${new Date().getTime()}`})});
      FlowRouter.reload();
    },
    rejectVisible: function(object_name, record_id, record_permissions){
      return Steedos.ProcessManager.showApproveButs(object_name, record_id)
    },
    reject: function(object_name, record_id, fields){
      Steedos.authRequest(`/api/v4/process/reject/${object_name}/${record_id}`, {type: 'post', data: JSON.stringify({comments: `同意 -- ${new Date().getTime()}`})});
      FlowRouter.reload();
    },
    reassignVisible: function(object_name, record_id, record_permissions){
      return Steedos.ProcessManager.showApproveButs(object_name, record_id)
    },
    reassign: function(object_name, record_id, fields){
      Steedos.ProcessManager.Reassign(object_name, record_id);
    },
    recallVisible: function(object_name, record_id, record_permissions){
      return Steedos.ProcessManager.showApproveButs(object_name, record_id)
    },
    recall: function(object_name, record_id, fields){
      Steedos.ProcessManager.Recall(object_name, record_id);
    }
  }