/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-09 18:23:36
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-11-02 09:25:00
 * @Description: 
 */
module.exports = {
    upgradePackageVisible: function (object_name, record_id) {
        if(Meteor.settings.public.enable_saas){
            return false;
        }
        const record = Creator.odata.get(object_name, record_id);
        if (record.status === 'enable' && !record.local && !record.static) {
            return true;
        }
        return false
    }
}