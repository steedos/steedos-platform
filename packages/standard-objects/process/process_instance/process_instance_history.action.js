module.exports = {
    approve: function(object_name, record_id, fields){
      Steedos.authRequest(`/api/v4/process/approve/${object_name}/${record_id}`, {type: 'post', data: JSON.stringify({comments: `同意 -- ${new Date().getTime()}`})});
      FlowRouter.reload();
    },
    reject: function(object_name, record_id, fields){
        
    },
    reassign: function(object_name, record_id, fields){
        
    },
    remove: function(object_name, record_id, fields){
        
    }
  }