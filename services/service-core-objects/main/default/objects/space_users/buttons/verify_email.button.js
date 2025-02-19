/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-12 11:32:06
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2025-02-19 14:44:24
 * @Description: 
 */
module.exports = {
    verify_email: function (object_name, record_id) {
        Steedos.openWindow(Steedos.absoluteUrl('/accounts/a/#/verify/email'))
    },

    verify_emailVisible: function (object_name, record_id, record_permissions, data) {
        var space_userId = db.space_users.findOne({ user: Steedos.User.get().userId, space: Steedos.spaceId() })._id
        if (space_userId === record_id) {
            return true;
        }else{
            return false;
        }
    },
}