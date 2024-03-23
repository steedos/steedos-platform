/*
 * @Author: baozhoutaon@hotoa.com
 * @Date: 2022-03-29 20:33:44
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-21 10:45:57
 * @Description: 
 */
module.exports = {
    resetVisible: function (object_name, record_id, permission, data) {
        if(Meteor.settings.public.enable_saas){
            return false;
        }
        var record = data && data.record;
        return record && record.is_system && record.is_customize && record.created;
    }
}