Meteor.autorun(function(){
  if (Creator.bootstrapLoaded.get()) {
    var object = Creator.getObject("cms_categories");
    if (!object){
      return;
    }
    var actions = object.actions;

    // standard_new、standard_edit等baseObject中的actions用`Object.assign(actions`写法不会生效，只能单独拿出来写
    actions.standard_new.visible = function (object_name, record_id, record_permissions) {
      var site = Session.get("site");
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
        if(!site){
          // 没有选中站点，请求接口判断是否至少属于一个站点成员
          var options, queryFilters;
          options = {
            $select: '_id'
          };
          queryFilters = ["admins", "=", userId];
          var siteObjectName = "cms_sites";
          var steedosFilters = require("@steedos/filters");
          var odataFilter = steedosFilters.formatFiltersToODataQuery(queryFilters);
          options.$filter = odataFilter;
          var sites = Creator.odata.query(siteObjectName, options, true);
          return sites && sites.length;
        }
        else{
          var isSiteAdmin = site && site.admins && site.admins.indexOf(userId) > -1;
          return isSiteAdmin;
        }
      }
    }

    actions.standard_edit.visible = function (object_name, record_id, record_permissions) {
      var site = Session.get("site");
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
        if(!site){
          // 栏目详细界面拿不到当前选中站点时，只能请求记录本身所属站点的信息来判断
          var record = Creator.getObjectRecord();
          if(record && record.site){
            var siteId = typeof record.site === "string" ? record.site : record.site._id;
            site = Creator.odata.get("cms_sites", siteId, "admins");
          }
        }
        var isSiteAdmin = site && site.admins && site.admins.indexOf(userId) > -1;
        return isSiteAdmin;
      }
    }

    actions.standard_delete.visible = function (object_name, record_id, record_permissions) {
      var site = Session.get("site");
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
        if(!site){
          // 栏目详细界面拿不到当前选中站点时，只能请求记录本身所属站点的信息来判断
          var record = Creator.getObjectRecord();
          if(record && record.site){
            var siteId = typeof record.site === "string" ? record.site : record.site._id;
            site = Creator.odata.get("cms_sites", siteId, "admins");
          }
        }
        var isSiteAdmin = site && site.admins && site.admins.indexOf(userId) > -1;
        return isSiteAdmin;
      }
    }
  }
});