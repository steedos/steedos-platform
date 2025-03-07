/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-09 18:23:36
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-07 11:59:52
 * @Description: 
 */
module.exports = {
    upgradePackageVisible: function (object_name, record_id, permission, data) {
        if(Steedos.settings.public.enable_saas){
            return false;
        }
        const record = data?.record;
        if (record.status === 'enable' && !record.local && !record.static) {
            return true;
        }
        return false
    }
}