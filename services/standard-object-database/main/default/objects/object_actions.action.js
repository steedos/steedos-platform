/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-21 18:19:06
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-01 10:15:14
 * @Description: 
 */
module.exports = {
  showDesign: function (object_name, record_id) {
    document.location = Steedos.absoluteUrl(`/api/amisButtonDesign?id=${record_id}&object=${this.record.record.object}&assetUrls=${Builder.settings.assetUrls}&locale=${Builder.settings.locale}`);
  },
  showDesignVisible: function (object_name, record_id, record_permissions) {
      var perms;
      var record = Creator.getObjectRecord(object_name, record_id);
      if(record.type === 'amis_button'){
        perms = {};
        if (record_permissions) {
            perms = record_permissions;
        } else {
            record_permissions = Creator.getRecordPermissions(object_name, record, Meteor.userId());
            if (record_permissions) {
                perms = record_permissions;
            }
        }
        return perms["allowEdit"];
      }
      return false;
  }
}