module.exports = { 
design_field_layout:function (object_name, record_id, item_element) {
        var record = this.record || Creator.getObjectById(record_id);
        if (record && record.record) {
            record = record.record;
        }
        if (!record) {
            return toastr.error("未找到记录");
        }

        window.open(Creator.getRelativeUrl("/api/page/view/design_field_layout?designObjectName=" + record.name));
    },
design_field_layoutVisible:function (object_name, record_id, record_permissions, data) {
        var record = data && data.record;
        if (!Creator.isSpaceAdmin()) {
            return false
        }
        if (!record) {
            record = Creator.odata.get("objects", record_id, "is_deleted");
        }

        if (record && !record.is_deleted && record.name != 'users' && record.created) {
            return true;
        }
    }
 }