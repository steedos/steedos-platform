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
          var site = Session.get("site");
          var isSitePublic = site && site.visibility === "public";
          return isSitePublic;
        },
        on: "list",
        todo: function (object_name, record_id, fields) {
          var site = Session.get("site");
          if(!site){
            toastr.warning("请先在左侧列表选中一个站点！");
            return;
          }
          var isSitePublic = site.visibility === "public";
          if(!isSitePublic){
            toastr.warning("该站点未公开发布到互联网");
            return;
          }
          var siteId = site._id;
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
          var site = Session.get("site");
          var isSitePublic = false;
          if(site){
            // 在列表界面可以直接从左侧拿到当前选中站点
            isSitePublic = site && site.visibility === "public";
          }
          else{
            //否则需要请求文章所属站点是否为Public
            var record = Creator.getObjectRecord();
            if(record && record.site){
              var siteId = typeof record.site === "string" ? record.site : record.site._id;
              var site = Creator.odata.get("cms_sites", siteId, "visibility");
              isSitePublic = site ? site.visibility === "public" : false;
            }
          }
          return isSitePublic;
        },
        on: "record",
        todo: function (object_name, record_id, fields) {
          var site = Session.get("site");
          var siteId;
          if(site){
            // 在列表界面可以直接从左侧拿到当前选中站点
            var isSitePublic = site.visibility === "public";
            if(!isSitePublic){
              toastr.warning("该站点未公开发布到互联网");
              return;
            }
            siteId = site._id;
          }
          if(!siteId){
            //否则需要从详细记录中取出所属站点Id
            var record = Creator.getObjectRecord();
            if(record && record.site){
              siteId = typeof record.site === "string" ? record.site : record.site._id;
            }
          }
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