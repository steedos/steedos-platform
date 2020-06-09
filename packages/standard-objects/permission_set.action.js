module.exports = {
    customize: function (object_name, record_id, fields) {
        var doc = Creator.odata.get(object_name, record_id)
        Session.set('cmDoc', doc);
        Session.set('cmShowAgainDuplicated', true);
        Meteor.defer(function(){
            $(".creator-add").click()
        })
    },
    customizeVisible: function(object_name, record_id, record_permissions, record){
        return Creator.baseObject.actions.standard_new.visible() && record.is_system;
    }
}