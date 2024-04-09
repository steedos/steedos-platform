/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-21 18:19:06
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-10-16 13:58:08
 * @Description: 
 */
module.exports = {
  showDesign: function (object_name, record_id) {
    document.location = Steedos.absoluteUrl(`/api/amisButtonDesign?id=${record_id}&object=${this.record.record.object}&assetUrls=${Builder.settings.assetUrls}&locale=${Builder.settings.locale}`);
  },
  showDesignVisible: function (object_name, record_id, record_permissions, data) {
      var perms;
      var record = (data && data.record) || Creator.getObjectRecord(object_name, record_id);
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
  },
  customize: function (object_name, record_id, fields) {
    var doc = Creator.odata.get(object_name, record_id);
    var newDoc = {}
    _.each(Creator.getObject(object_name).fields, function(v, k){
        if(_.has(doc, k)){
            newDoc[k] = doc[k]
        }
    })
    delete newDoc.is_system;

    let docName = doc.name
    let docObjectName = doc.object
    
    Creator.odata.insert(object_name, Object.assign(newDoc, {name: docName, object: docObjectName}), function(result, error){
        if(result){
            if(Session.get("object_name") === 'object_actions'){
                FlowRouter.go(`/app/-/${object_name}/view/${result._id}`)
            }else{
                href = Creator.getObjectUrl(object_name, result._id);
                window.open(href,'_blank','width=800, height=600, left=50, top= 50, toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes')
            }
        }
    });
  },
  customizeVisible: function(object_name, record_id, record_permissions, data){
      var record = data && data.record;
      if(!record){
          record = {}
      }
      return Creator.baseObject.actions.standard_new.visible() && record.is_system && record.type == 'amis_button';
  }
}