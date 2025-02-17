/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2024-05-14 17:04:31
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-05-14 17:04:36
 * @FilePath: /steedos-platform-2.3/services/standard-object-database/main/default/objects/object_functions/buttons/standard_new.button.js
 * @Description: 
 */
module.exports = {
    standard_newVisible: function (object_name, record_id, record_permissions, data) {
        if(Meteor.settings.public.enable_saas){
            return false;
        }
        return Steedos.Object.base.actions.standard_new.visible.apply(this, arguments);
    },
}