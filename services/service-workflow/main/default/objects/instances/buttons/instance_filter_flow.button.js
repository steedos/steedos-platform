/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-01-18 13:29:34
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-03-01 23:31:21
 * @Description: 
 */

module.exports = {
    instance_filter_flowVisible: function (object_name, record_id, permission, data) {
        return false;
        // return !!window.Creator
    }
}