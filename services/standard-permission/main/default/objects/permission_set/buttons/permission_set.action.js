module.exports = {
    customize: function (object_name, record_id, fields) {
        var doc = Creator.odata.get(object_name, record_id)
        Creator.odata.insert(object_name, {name: doc.name, label: doc.label, type: doc.type, license: doc.license, lockout_interval: doc.lockout_interval, max_login_attempts: doc.max_login_attempts, password_history: doc.password_history, 
            default_standard_buttons: doc.default_standard_buttons
        }, function(result, error){
            if(result){
                FlowRouter.go(`/app/-/${object_name}/view/${result._id}`)
            }
        });
            
    },
    customizeVisible: function(object_name, record_id, record_permissions, data){
        var record = data && data.record;
        if(!record){
            record = {}
        }
        return Steedos.Object.base.actions.standard_new.visible() && record.is_system;
    }
}