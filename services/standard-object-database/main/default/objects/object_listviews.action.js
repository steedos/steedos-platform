/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: liaodaxue
 * @LastEditTime: 2024-02-18 14:56:30
 * @Description: 
 */
module.exports = {
  customize: function (object_name, record_id, fields) {
      let doc = Creator.odata.get(object_name, record_id);
      if(!doc.columns || !doc.columns.length){
        const objectName_label = record_id.split('.');
        let columns = Creator.getListView(objectName_label[0], objectName_label[1], true).columns;
        doc.columns = columns || [];
      }
      doc.columns = doc.columns.map((item)=>{
        if(typeof item === 'string'){
          return { field: item }
        }
        return item;
      })
      var newRecord = _.pick(doc, Creator.getObjectFieldsName(object_name));
      delete newRecord.is_system;
      delete newRecord._id;
      delete newRecord.record_permissions;
      newRecord.from_code_id = record_id;
      Creator.odata.insert(object_name, newRecord, function(result, error){
          if(result){
              FlowRouter.go(`/app/-/${object_name}/view/${result._id}`)
          }
      });
          
  },
  customizeVisible: function(object_name, record_id, record_permissions, data){
    var record = data && data.record;
    return Creator.baseObject.actions.standard_new.visible() && record.is_system;
  },
  copy: function(object_name, record_id){
    let newRecord = null; // _.clone(Creator.getListView(Session.get("object_name"), record_id));
    if(!newRecord){
      let doc = Creator.odata.get(object_name, record_id);
      if(!doc.columns || !doc.columns.length){
        const objectName_label = record_id.split('.');
        let columns = Creator.getListView(objectName_label[0], objectName_label[1], true).columns;
        doc.columns = columns || [];
      }
      doc.columns = doc.columns.map((item)=>{
        if(typeof item === 'string'){
          return { field: item }
        }
        return item;
      })
      newRecord = _.pick(doc, Creator.getObjectFieldsName(object_name));
    }
    delete newRecord.is_system;
    delete newRecord._id;
    delete newRecord.name;
    delete newRecord.from_code_id;
    delete newRecord.label;
    delete newRecord.owner;

    var data = newRecord || { _filters_type_controller: 'conditions' };
    //数据格式转换
    if (data) {
        data.sort = lodash.map(data.sort, (item) => {
            return `${item.field_name}:${item.order || 'asc'}`
        });

        data.searchable_fields = lodash.map(data.searchable_fields, 'field');

        if (data.filters && lodash.isString(data.filters)) {
            try {
                data.filters = JSON.parse(data.filters);
            }catch(e){}
        }

        if (data.filters && lodash.isString(data.filters)) {
            data._filters_type_controller = 'function';
        } else {
            data._filters_type_controller = 'conditions'
        }

        if (data._filters_type_controller === 'conditions') {
            data._filters_conditions = window.amisConvert.filtersToConditions(data.filters || []);
        } else {
            data._filters_function = data.filters;
        }
    }
    Steedos.Page.Form.StandardNew.render(Session.get("app_id"), 'object_listviews', t("creator_list_copy_list_view"), { defaultData:data }, {});
  },
  copyVisible: function(object_name, record_id, record_permissions, data){
    return true;
  },
  showDesign: function (object_name, record_id) {
    document.location = Steedos.absoluteUrl(`/api/amisListviewDesign?id=${record_id}&object=${this.record.object_name}&assetUrls=${Builder.settings.assetUrls}&locale=${Builder.settings.locale}`);
  },
  showDesignVisible: function (object_name, record_id, record_permissions) {
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