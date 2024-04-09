module.exports = { 
showDesign:function (object_name, record_id) {
    document.location = Steedos.absoluteUrl(`/api/amisListviewDesign?id=${record_id}&object=${this.record.object_name}&assetUrls=${Builder.settings.assetUrls}&locale=${Builder.settings.locale}`);
  },
showDesignVisible:function (object_name, record_id, record_permissions) {
      var perms= {};
      var record = Creator.getObjectRecord(object_name, record_id);
      if(!record){
        return false;
      }
      if(!record.enable_amis_schema){
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