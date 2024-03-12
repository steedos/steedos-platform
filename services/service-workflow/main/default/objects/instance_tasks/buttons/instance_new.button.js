/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-02-08 21:24:47
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-02-08 21:42:56
 */
module.exports = {
    instance_newVisible: function (object_name, record_id, record_permissions, data) {
        if (data && data._isRelated) {
            return false;
        }
        return true;
    }
}