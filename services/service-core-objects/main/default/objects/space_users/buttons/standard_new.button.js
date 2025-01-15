/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-12 13:42:25
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-13 10:22:30
 * @Description: 
 */
module.exports = {
    standard_newVisible: function (object_name, record_id, record_permissions, data) {
        var organization = Session.get("organization");
        var allowCreate = Creator.baseObject.actions.standard_new.visible.apply(this, arguments);
        if (!allowCreate) {
            // permissions配置没有权限则不给权限
            return false
        }
        // 组织管理员要单独判断，只给到有对应分部的组织管理员权限
        if (Steedos.isSpaceAdmin()) {
            return true;
        }
        else {
            var userId = Steedos.userId();
            //当前选中组织所属分部的管理员才有权限
            if (organization && organization.company_id && organization.company_id.admins) {
                return organization.company_id.admins.indexOf(userId) > -1;
            }
        }
    },
}