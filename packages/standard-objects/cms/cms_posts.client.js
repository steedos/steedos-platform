Meteor.autorun(function(){
  if (Creator.bootstrapLoaded.get()) {
    var object = Creator.getObject("cms_posts");
    if (!object){
      return;
    }
    var actions = object.actions;
    Object.assign(actions, {
      previewSite: {
        label: "预览",
        visible: function (object_name, record_id, record_permissions) {
          var gridSidebarSelected = Session.get("grid_sidebar_selected");
          var isSitePublic = gridSidebarSelected && gridSidebarSelected.is_site_public;
          return isSitePublic;
        },
        on: "list",
        todo: function (object_name, record_id, fields) {
          var gridSidebarSelected = Session.get("grid_sidebar_selected");
          if(!gridSidebarSelected){
            toastr.warning("请先在左侧列表选中一个站点！")
          }
          var isSitePublic = gridSidebarSelected.is_site_public;
          if(!isSitePublic){
            toastr.warning("该站点未公开发布到互联网")
          }
          var siteId = gridSidebarSelected.site_id;
          // site/awqTrDfQt3uQtGtKi
          var url = '/site/' + siteId;
          url = Steedos.absoluteUrl(url);
          var options = "width=800, height=600, left=50, top= 50, toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes";
          window.open(url, '_blank', options);
        }
      },
      previewPost: {
        label: "预览",
        visible: function (object_name, record_id, record_permissions) {
          var gridSidebarSelected = Session.get("grid_sidebar_selected");
          var isSitePublic = gridSidebarSelected && gridSidebarSelected.is_site_public;
          return isSitePublic;
        },
        on: "record",
        todo: function (object_name, record_id, fields) {
          var gridSidebarSelected = Session.get("grid_sidebar_selected");
          if(!gridSidebarSelected){
            toastr.warning("请先在左侧列表选中一个站点！")
          }
          var isSitePublic = gridSidebarSelected.is_site_public;
          if(!isSitePublic){
            toastr.warning("该站点未公开发布到互联网")
          }
          var siteId = gridSidebarSelected.site_id;
          // site/awqTrDfQt3uQtGtKi/p/BjSLK6TTpX49bsQ7r
          var url = '/site/' + siteId + '/p/' + record_id;
          url = Steedos.absoluteUrl(url);
          var options = "width=800, height=600, left=50, top= 50, toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes";
          window.open(url, '_blank', options);
        }
      }
    });
  }
});