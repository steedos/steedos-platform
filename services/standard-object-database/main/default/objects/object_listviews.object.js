/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-02-05 13:35:32
 * @Description: 
 */
const _ = require("underscore");

function transformFilters(filters){
  if(_.isString(filters)){
    return filters;
  }
  let _filters = [];
  _.each(filters, function(filter){
    if(_.isObject(filter)){
      if(filter.operation && filter.operation.startsWith("between_time_")){
        filter.value = filter.operation.split("between_time_")[1];
        filter.operation = 'between';
      }
    }
    _filters.push(filter);
  })
  return _filters;
}

function checkName(name){
  var reg = new RegExp('^[a-z]([a-z0-9]|_(?!_))*[a-z0-9]$');
  if(!reg.test(name)){
      throw new Error("object_listviews__error_name_invalid_format");
  }
  if(name.length > 50){
      throw new Error("API 名称长度不能大于50个字符");
  }
  return true
}

Creator.Objects['object_listviews'].triggers = Object.assign(Creator.Objects['object_listviews'].triggers || {}, {
  "before.insert.cilent.object_listviews": {
    on: "client",
    when: "before.insert",
    todo: function (userId, doc) {
      var columns, filter_scope, list_view, object_name, ref;
      object_name = Session.get("object_name");
      list_view = Creator.getObjectDefaultView(object_name);
      filter_scope = (list_view != null ? list_view.filter_scope : void 0) || "space";
      columns = list_view != null ? list_view.columns : void 0;
      if (filter_scope === "spacex") {
        filter_scope = "space";
      }
      if (!doc.object_name) {
        doc.object_name = object_name;
      }
      doc.filter_scope = filter_scope;
      if (!doc.columns) {
        doc.columns = columns;
      }
      // doc.filters = ((ref = Session.get("cmDoc")) != null ? ref.filters : void 0) || [];
    }
  },
  "before.insert.server.object_listviews": {
    on: "server",
    when: "before.insert",
    todo: function (userId, doc) {
      checkName(doc.name);
      if (!Steedos.isSpaceAdmin(doc.space, userId)) {
        doc.shared = false;
        delete doc.shared_to;
        delete doc.shared_to_organizations;
      }
      if(doc.shared_to === "mine" || doc.shared_to === "organizations"){
        doc.shared = false;
      }
      else if(doc.shared_to === "space"){
        doc.shared = true;
      }
      if(doc.shared_to !== "organizations"){
        delete doc.shared_to_organizations;
      }
      doc.filters = transformFilters(doc.filters);
    }
  },
  "before.update.server.object_listviews": {
    on: "server",
    when: "before.update",
    todo: function (userId, doc, fieldNames, modifier, options) {
      modifier.$set = modifier.$set || {}

      if(_.has(modifier.$set, "name") && modifier.$set.name != doc.name){
        checkName(modifier.$set.name);
      }

      if (!Steedos.isSpaceAdmin(doc.space, userId)) {
        modifier.$set.shared = false;
        delete modifier.$set.shared_to;
        delete modifier.$set.shared_to_organizations;
        if (!modifier.$unset) {
          modifier.$unset = {};
        }
        modifier.$unset.shared_to = 1;
        modifier.$unset.shared_to_organizations = 1;
      }
      if(modifier.$set.shared_to === "mine" || modifier.$set.shared_to === "organizations"){
        modifier.$set.shared = false;
      }
      else if(modifier.$set.shared_to === "space"){
        modifier.$set.shared = true;
      }
      if(modifier.$set.shared_to && modifier.$set.shared_to !== "organizations"){
        delete modifier.$set.shared_to_organizations;
        if (!modifier.$unset) {
          modifier.$unset = {};
        }
        modifier.$unset.shared_to_organizations = 1;
      }
      if(modifier.$set.filters){
        modifier.$set.filters = transformFilters(modifier.$set.filters);
      }
    }
  },
  "before.remove.server.object_listviews": {
    on: "server",
    when: "before.remove",
    todo: function (userId, doc) {
      // console.log("before.remove");
      if (doc.owner !== userId) {
        throw new Meteor.Error(403, "can only remove own list view");
      }
    }
  }
})