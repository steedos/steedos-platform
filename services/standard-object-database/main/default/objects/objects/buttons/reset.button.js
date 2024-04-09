module.exports = {

    resetVisible: function(object_name, record_id, permission, data) {
        if (Meteor.settings.public.enable_saas) {
            return false;
        }
        var record = data && data.record;
        return record && record.is_system && record.is_customize && record.created;
    }

}