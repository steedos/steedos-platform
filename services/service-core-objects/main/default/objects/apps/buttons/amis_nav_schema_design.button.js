/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-04-11 14:05:42
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-10-09 15:44:47
 * @Description: 
 */
module.exports = {
  amis_nav_schema_design: function (object_name, record_id) {
    document.location = Steedos.absoluteUrl(`/api/amisAppNavSchemaDesign?id=${record_id}&object=${this.record.object_name}&assetUrls=${Builder.settings.assetUrls}&locale=${Builder.settings.locale}`);
  },
  amis_nav_schema_designVisible: function (object_name, record_id, record_permissions, data) {
    var perms = {};
    var record = data.record;
    if (!record) {
      return false;
    }
    if (!record.enable_nav_schema) {
      return false;
    }
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
}