/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-07-07 16:57:38
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-08-25 11:24:10
 */
module.exports = {
    showDesign: function (object_name, record_id) {
        // Steedos.openWindow();
        var locale = Builder.settings.context?.user?.language || window.navigator.language;
        if(locale === 'en' || locale.startsWith('en-')){
            locale = 'en-US'
        }
        document.location = Steedos.absoluteUrl(`/api/pageDesign?pageId=${record_id}&assetUrls=${Builder.settings.assetUrls}&locale=${locale}`);
    },
    showDesignVisible: function (object_name, record_id, record_permissions) {
        var perms, record;
        perms = {};
        if (record_permissions) {
            perms = record_permissions;
        }
        return perms["allowEdit"];
    }
}