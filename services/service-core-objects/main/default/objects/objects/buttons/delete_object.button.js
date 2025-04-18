module.exports = {

    delete_objectVisible: function(object_name, record_id, record_permissions, data) {
        var record = data && data.record;
        if (!Steedos.isSpaceAdmin()) {
            return false
        }
        if (!record) {
            return false;
        }
        if (record.is_system) {
            return false;
        }
        if (record && !record.is_deleted) {
            return Steedos.Object.base.actions.standard_delete.visible.apply(this, arguments);
        }
    }

}