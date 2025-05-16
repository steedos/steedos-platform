module.exports = {
    showDesign: function (object_name, record_id) {
        // Steedos.openWindow();
        document.location = Steedos.absoluteUrl(`/api/pageDesign?pageId=${record_id}&assetUrls=${Builder.settings.assetUrls}&locale=${Builder.settings.locale}`);
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