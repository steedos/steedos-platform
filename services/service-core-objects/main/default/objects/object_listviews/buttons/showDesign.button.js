module.exports = { 
showDesign:function (object_name, record_id) {
    document.location = Steedos.absoluteUrl(`/api/amisListviewDesign?id=${record_id}&object=${this.record.object_name}&assetUrls=${Builder.settings.assetUrls}&locale=${Builder.settings.locale}`);
  },
showDesignVisible:function (object_name, record_id, record_permissions, data) {
      var perms= {};
      var record = data && data.record;
       if (!Steedos.isSpaceAdmin()) {
            return false
        }
      if(!record){
        return false;
      }
      if(!record.enable_amis_schema){
        return false;
      }
      if (record_permissions) {
        perms = record_permissions;
      } else {
          return false
      }
      return perms["allowEdit"];
  }
 }