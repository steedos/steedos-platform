/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-12 11:32:06
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-13 10:16:32
 * @Description: 
 */
module.exports = {
    verify_email: function (object_name, record_id) {
        Steedos.openWindow('/accounts/a/#/verify/email')
    },

    verify_emailVisible: function (object_name, record_id, record_permissions, data) {
        var space_userId = db.space_users.findOne({ user: Steedos.userId(), space: Steedos.spaceId() })._id
        if (space_userId === record_id) {
            return true;
        }else{
            return false;
        }
    },
}