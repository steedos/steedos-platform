/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-18 16:32:30
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-19 18:02:00
 * @Description: 
 */
module.exports = {
    installPackageFromUrlVisible: function (object_name, record_id) {
        return Steedos.isSpaceAdmin();
    }
}