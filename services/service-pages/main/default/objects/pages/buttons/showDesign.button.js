module.exports = {
    showDesign: function (object_name, record_id) {
        Steedos.openWindow(Steedos.absoluteUrl(`/api/pageDesign?pageId=${record_id}`));
    },
    showDesignVisible: function (object_name, record_id, record_permissions) {
        var perms, record;
        perms = {};
        if (record_permissions) {
            perms = record_permissions;
        } else {
            record = Creator.getObjectRecord(object_name, record_id);
            record_permissions = Creator.getRecordPermissions(object_name, record, Meteor.userId());
            if (record_permissions) {
                perms = record_permissions;
            }
        }
        return perms["allowEdit"];
    }
}