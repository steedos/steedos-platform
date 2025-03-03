/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-12 13:42:25
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-03 14:03:34
 * @Description: 
 */
module.exports = {
    standard_newVisible: function (object_name, record_id, record_permissions, data) {
        var allowCreate = Steedos.Object.base.actions.standard_new.visible.apply(this, arguments);
        if (!allowCreate) {
            // permissions配置没有权限则不给权限
            return false
        }
        // 组织管理员要单独判断，只给到有对应分部的组织管理员权限
        if (Steedos.isSpaceAdmin()) {
            return true;
        }
        else {
            var record = Steedos.User.get();
            return Steedos.isCompanyAdmin(record.company_ids);
        }
    },
}