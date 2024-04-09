module.exports = {

    delete_objectVisible: function(object_name, record_id, record_permissions, data) {
        var record = data && data.record;
        if (!Creator.isSpaceAdmin()) {
            return false
        }
        if (!record) {
            record = Creator.odata.get("objects", record_id, "is_deleted");
        }
        if (record.is_system) {
            return false;
        }
        if (record && !record.is_deleted) {
            return Creator.baseObject.actions.standard_delete.visible.apply(this, arguments);
        }
    }

}