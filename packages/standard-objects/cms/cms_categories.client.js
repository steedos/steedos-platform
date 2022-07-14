Meteor.autorun(function(){
  if (Creator.bootstrapLoaded.get()) {
    var object = Creator.getObject("cms_categories");
    if (!object){
      return;
    }
    var actions = object.actions;

    // standard_new、standard_edit等baseObject中的actions用`Object.assign(actions`写法不会生效，只能单独拿出来写
    actions.standard_new.visible = function (object_name, record_id, record_permissions) {
      var allowCreate = Creator.baseObject.actions.standard_new.visible.apply(this, arguments);
      if(!allowCreate){
          // permissions配置没有权限则不给权限
          return false
      }
      // 管理员要单独判断，只给到有对应站点成员的权限
      if(Steedos.isSpaceAdmin()){
          return true;
      }
      else{
        var userId = Steedos.userId();
        var options, queryFilters;
        options = {
          $select: '_id'
        };
        queryFilters = ["admins", "=", userId];
        var siteObjectName = "cms_sites";
        var odataFilter = SteedosFilters.formatFiltersToODataQuery(queryFilters);
        options.$filter = odataFilter;
        var sites = Creator.odata.query(siteObjectName, options, true);
        return sites && sites.length;
      }
    }

    actions.standard_edit.visible = function (object_name, record_id, record_permissions) {
      var allowEdit = Creator.baseObject.actions.standard_edit.visible.apply(this, arguments);
      if(!allowEdit){
          // permissions配置没有权限则不给权限
          return false
      }
      // 管理员要单独判断，只给到有对应站点成员的权限
      if(Steedos.isSpaceAdmin()){
          return true;
      }
      else{
        var userId = Steedos.userId();
        // 请求记录本身所属站点的信息来判断权限
        var record = Creator.getObjectRecord(object_name, record_id, "site");
        if(record && record.site){
          var siteId = typeof record.site === "string" ? record.site : record.site._id;
          site = Creator.odata.get("cms_sites", siteId, "admins");
        }
        var isSiteAdmin = site && site.admins && site.admins.indexOf(userId) > -1;
        return isSiteAdmin;
      }
    }

    actions.standard_delete.visible = function (object_name, record_id, record_permissions) {
      var allowDelete = Creator.baseObject.actions.standard_delete.visible.apply(this, arguments);
      if(!allowDelete){
          // permissions配置没有权限则不给权限
          return false
      }
      // 管理员要单独判断，只给到有对应站点成员的权限
      if(Steedos.isSpaceAdmin()){
          return true;
      }
      else{
        var userId = Steedos.userId();
        // 请求记录本身所属站点的信息来判断权限
        var record = Creator.getObjectRecord(object_name, record_id, "site");
        if(record && record.site){
          var siteId = typeof record.site === "string" ? record.site : record.site._id;
          site = Creator.odata.get("cms_sites", siteId, "admins");
        }
        var isSiteAdmin = site && site.admins && site.admins.indexOf(userId) > -1;
        return isSiteAdmin;
      }
    }
  }
});