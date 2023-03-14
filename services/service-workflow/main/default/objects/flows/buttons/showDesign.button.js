/*
 * @Author: 李海龙 220 lihailong@steedos.com
 * @Date: 2023-03-13 06:22:57
 * @LastEditors: 李海龙 220 lihailong@steedos.com
 * @LastEditTime: 2023-03-13 10:25:51
 */
module.exports = {
    showDesign: function (object_name, record_id) {
        //这里/api/amisFormDesign?PagId 改为 id
        document.location = Steedos.absoluteUrl(`/api/amisFormDesign?id=${record_id}`);
    },
    showDesignVisible: function (object_name, record_id, record_permissions) {
        const record = Creator.getObjectRecord(object_name, record_id);
        return !(record.object_name);
    }
    
}