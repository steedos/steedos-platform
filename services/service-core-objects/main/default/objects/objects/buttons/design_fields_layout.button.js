/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-08-29 09:36:15
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-09-05 16:26:51
 * @Description: 
 */
module.exports = {

    design_fields_layout: function(object_name, record_id, item_element) {
        var record = this.record || Creator.getObjectById(record_id);
        if (record && record.record) {
            record = record.record;
        }
        if (!record) {
            return toastr.error("未找到记录");
        }

        window.open(Creator.getRelativeUrl("/api/amisObjectFieldsDesign?oid=" + record_id+`&assetUrls=${Builder.settings.assetUrls}`));
    },
    design_fields_layoutVisible: function(object_name, record_id, record_permissions, data) {
        var record = data && data.record;
        if (!Steedos.isSpaceAdmin()) {
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