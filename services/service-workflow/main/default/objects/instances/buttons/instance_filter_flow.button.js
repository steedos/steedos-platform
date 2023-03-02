/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-01-18 13:29:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-01-18 13:31:04
 * @Description: 
 */

module.exports = {
    instance_filter_flowVisible: function (object_name, record_id, permission, data) {
        return !!window.Creator
    }
}