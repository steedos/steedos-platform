module.exports = {

    show_object: function(object_name, record_id, item_element) {
        var record = this.record;
        if (record && record.record) {
            record = record.record;
        }
        if (!record) {
            return toastr.error("未找到记录");
        }

        if (record.is_enable === false) {
            return toastr.warning("请先启动对象");
        }

        window.open(Steedos.getRelativeUrl("/app/admin/" + (record.name || this.record.name)));
    },
    show_objectVisible: function(object_name, record_id, record_permissions, data) {
        var record = data && data.record;
        if (!Steedos.isSpaceAdmin()) {
            return false
        }
        if (!record) {
            return false;
        }

        if (record && !record.is_deleted && record.name != 'users') {
            return true;
        }
    }

}