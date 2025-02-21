

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-12 13:42:25
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-02-23 14:49:10
 * @Description: 
 */
module.exports = {
    standard_newVisible: function (object_name, record_id, record_permissions, data) {
        if(Steedos.settings.public.enable_saas){
            return false;
        }
        return Steedos.Object.base.actions.standard_new.visible.apply(this, arguments);
    },
}