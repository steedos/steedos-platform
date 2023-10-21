module.exports = {
    design_field_layout: function (object_name, record_id, item_element) {
        var record = this.record || Creator.getObjectById(record_id);
        if (record && record.record) {
            record = record.record;
        }
        if (!record) {
            return toastr.error("未找到记录");
        }

        if (record.is_enable === false) {
            return toastr.warning("请先启动对象");
        }

        if (record.datasource && record.datasource != 'default' && record.datasource != 'meteor') {
            var datasource = Creator.odata.get('datasources', record.datasource, 'is_enable');
            if (!datasource) {
                return toastr.error("未找到数据源");
            }
            if (!datasource.is_enable) {
                return toastr.warning("请先启动数据源");
            }
        }

        window.open(Creator.getRelativeUrl("/app/-/page/design_field_layout?designObjectName=" + record.name));
    },
    design_field_layoutVisible: function (object_name, record_id, record_permissions, data) {
        var record = data && data.record;
        if (!Creator.isSpaceAdmin()) {
            return false
        }
        if (!record) {
            record = Creator.odata.get("objects", record_id, "is_deleted");
        }

        if (record && !record.is_deleted && record.name != 'users' && !record.is_system) {
            return true;
        }
    },
  show_object: function (object_name, record_id, item_element) {
    var record = this.record || Creator.getObjectById(record_id);
    if(record && record.record){
        record = record.record;
    }
    if(!record){
        return toastr.error("未找到记录");
    }

    if(record.is_enable === false){
        return toastr.warning("请先启动对象");
    }

    if(record.datasource && record.datasource != 'default' && record.datasource != 'meteor'){
        var datasource = Creator.odata.get('datasources', record.datasource, 'is_enable');
        if(!datasource){
            return toastr.error("未找到数据源");
        }
        if(!datasource.is_enable){
            return toastr.warning("请先启动数据源");
        }
    }

    window.open(Creator.getRelativeUrl("/app/admin/" + record.name));
    // SteedosUI.Object.getUISchema(record.name).then((res)=>{
    //     if(res.idFieldName){
    //         window.open(Creator.getRelativeUrl("/app/-/" + record.name));
    //     }else{
    //         return toastr.error("请配置主键字段");
    //     }
    // }).catch(function(err){
    //     return window.toastr.error(err.message);
    // })

    

    // var allViews = Creator.odata.query('object_listviews', { $select: '_id', $filter: `((object_name eq '${record.name}') and (name eq 'all'))` }, true);
    // if(allViews && allViews.length > 0){
    //     Steedos.openWindow(Creator.getRelativeUrl("/app/-/" + record.name + "/grid/" + allViews[0]._id))
    // }else{
    //     Steedos.openWindow(Creator.getRelativeUrl("/app/-/" + record.name + "/grid/all"))
    // }
  },
  show_objectVisible: function(object_name, record_id, record_permissions, data){
    var record = data && data.record;
    if(!Creator.isSpaceAdmin()){
        return false
    }
    if(!record){
        record = Creator.odata.get("objects", record_id, "is_deleted");
    }
    
    if(record && !record.is_deleted && record.name != 'users'){
        return true;
    }
  },
  copy_odata: function (object_name, record_id, item_element) {
    var clipboard, o_name, path, record;
    record = this.record || Creator.getObjectById(record_id);
    //enable_api 属性未开放
    if ((record != null ? record.enable_api : void 0) || true) {
        o_name = record != null ? record.name : void 0;
        path = SteedosOData.getODataPath(Session.get("spaceId"), o_name);
        item_element.attr('data-clipboard-text', path);
        if (!item_element.attr('data-clipboard-new')) {
            clipboard = new Clipboard(item_element[0]);
            item_element.attr('data-clipboard-new', true);
            clipboard.on('success', function (e) {
                return toastr.success('复制成功');
            });
            clipboard.on('error', function (e) {
                toastr.error('复制失败');
                return console.error("e");
            });
            if (item_element[0].tagName === 'LI' || item_element.hasClass('view-action')) {
                return item_element.trigger("click");
            }
        }
    } else {
        return toastr.error('复制失败: 未启用API');
    }
  },
  copy_odataVisible: function(object_name, record_id, record_permissions, data){
    var record = data && data.record;
    if(!Creator.isSpaceAdmin()){
        return false
    }
    if(!record){
        record = Creator.odata.get("objects", record_id, "is_deleted");
    }
    if(record && !record.is_deleted){
        return true;
    }
  },
//   delete_object: function (object_name, record_id, fields) {
//     var record = Creator.getObjectRecord(object_name, record_id, 'name');
//     SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
//       name: "remove-object",
//       title: '删除对象',
//       width: '540px',
//       layout: 'horizontal',
//       modalProps: {
//           width: "540px",
//               style: {
//                   width: "540px",
//                   maxWidth: "540px",
//                   minWidth: "480px"
//               }
//       },
//       initialValues:{
//           md: "删除一个自定义对象进行以下操作：\n\n* 删除对象的字段和按钮\n* 删除对象的选项卡和列表视图\n* 删除对象的页面布局\n* 删除对象的权限\n* 删除对象的验证规则\n* 删除对象的限制规则\n* 删除对象的共享规则\n* 删除使用该对象的流程映射\n* 删除使用该对象的开放流程\n* 删除使用该对象的页面。\n\n\\\n"
//       },
//       objectSchema: {
//           fields: {
//               md: {
//                   type: 'html',
//                   label: ' ',
//                   is_wide: true,
//                   readonly: true,
//               }
//           }
//       },
//       onFinish: async (values = {}) => {
//           return new Promise((resolve, reject) => {
//               window.$("body").addClass("loading");
//               Creator.odata.delete(object_name, record_id, function() {
//                   var info= t('creator_record_remove_swal_suc');
//                   window.toastr.success(info);
//                   resolve(true)
//                   if(FlowRouter.current().route.path.endsWith("/:record_id")){
//                       var app_id = Session.get("app_id")
//                       var object_name = Session.get("object_name")
//                       FlowRouter.go(Creator.getListViewUrl(object_name, app_id, 'all'));
//                   }else{
//                       FlowRouter.reload();
//                   }
//                   window.$("body").removeClass("loading");
                  
//               }, function(error) {
//                   toastr.error(error.message);
//                   window.$("body").removeClass("loading");
//                   reject(false);
//               });
//           })
//       }
//   }, null, { iconPath: '/assets/icons' })
//   },
  delete_objectVisible: function(object_name, record_id, record_permissions, data){
    var record = data && data.record;
    if(!Creator.isSpaceAdmin()){
        return false
    }
    if(!record){
        record = Creator.odata.get("objects", record_id, "is_deleted");
    }
    if(record && !record.is_deleted){
        return Creator.baseObject.actions.standard_delete.visible.apply(this, arguments);
    }
  }
  // export: function(object_name, record_id, fields){
  //   return window.open(Steedos.absoluteUrl("/api/v4/objects/" + record_id + "/export_yml"), '_blank');
  // }
}