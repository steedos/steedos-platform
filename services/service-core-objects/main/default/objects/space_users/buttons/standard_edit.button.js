/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-12 13:41:49
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-03 14:07:12
 * @Description: 
 */
module.exports = {
    standard_editVisible: function (object_name, record_id, record_permissions, data) {
        console.log('standard_editVisible===>')
        var allowEdit = Steedos.Object.base.actions.standard_edit.visible.apply(this, arguments);
        if (!allowEdit) {
            // permissions配置没有权限则不给权限
            return false
        }

        if (data.appId === 'admin') {
            var space_userId = Steedos.User.get().spaceUserId
            if (space_userId === record_id) {
                return true
            }
        }

        // 组织管理员要单独判断，只给到有对应分部的组织管理员权限
        if (Steedos.isSpaceAdmin()) {
            return true;
        }
        else {
            var record = data && data.record;
            return Steedos.isCompanyAdmin(record.company_ids);
        }
    },
}