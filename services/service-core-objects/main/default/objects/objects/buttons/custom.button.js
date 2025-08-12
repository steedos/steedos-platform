/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-08-12 17:48:56
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-08-12 17:50:22
 */
module.exports = {
    customVisible: function(object_name, record_id, permission, data) {
        if (Steedos.settings.public.enable_saas) {
            return false;
        }
        var record = data && data.record;
        return record && record.is_system && !record.created;
    }

}