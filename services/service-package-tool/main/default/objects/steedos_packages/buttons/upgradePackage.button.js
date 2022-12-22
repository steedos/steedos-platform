/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-09 18:23:36
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-20 16:49:39
 * @Description: 
 */
module.exports = {
    upgradePackageVisible: function (object_name, record_id) {
        const record = Creator.odata.get(object_name, record_id);
        if (record.status === 'enable' && !record.local) {
            return true;
        }
        return false
    }
}