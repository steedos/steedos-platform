/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-12 13:41:49
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-11-25 10:34:08
 * @Description: 
 */
module.exports = {
    standard_editVisible: function (object_name, record_id, record_permissions, data) {
        var organization = Session.get("organization");
        var allowEdit = Creator.baseObject.actions.standard_edit.visible.apply(this, arguments);
        if (!allowEdit) {
            // permissions配置没有权限则不给权限
            return false
        }

        var record = data && data.record;
        if(record.invite_state == 'refused' || record.invite_state == 'pending'){
            return false;
        }

        if (Session.get("app_id") === 'admin') {
            var space_userId = db.space_users.findOne({ user: Steedos.userId(), space: Steedos.spaceId() })._id
            if (space_userId === record_id) {
                return true
            }
        }
        

        // 组织管理员要单独判断，只给到有对应分部的组织管理员权限
        if (Steedos.isSpaceAdmin()) {
            return true;
        }
        else {
            return SpaceUsersCore.isCompanyAdmin(record_id, organization);
        }
    },
}