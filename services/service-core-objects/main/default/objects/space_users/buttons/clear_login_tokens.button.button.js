/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-12 13:41:49
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-11-25 10:37:07
 * @Description: 
 */
module.exports = {
    clear_login_tokensVisible: function (object_name, record_id, record_permissions, data) {
        return Meteor.settings.public.enable_saas != true;
    },
}