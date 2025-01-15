/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-12 13:41:49
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-11-25 11:11:27
 * @Description: 
 */
module.exports = {
    invite_userVisible: function (object_name, record_id, record_permissions, data) {
        var record = data && data.record;
        if(record.invite_state != 'refused'){
            return false;
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