var _ = require("underscore");
var objectql = require('@steedos/objectql');
var objectCore = require('./objects.core.js');
function _syncToObject(doc, event) {
  objectCore.triggerReloadObject(doc.object_name, 'related_list', doc, event);
  // var relatedList = Creator.getCollection("object_related_list").find({
  //   space: doc.space,
  //   object_name: doc.object_name
  // }, {
  //   sort: {sort_no: -1},
  //   fields: {
  //     _id: 0,
  //     space: 0,
  //     object_name: 0,
  //     created: 0,
  //     modified: 0,
  //     owner: 0,
  //     created_by: 0,
  //     modified_by: 0
  //   }
  // }).fetch();
  // return Creator.getCollection("objects").update({
  //   space: doc.space,
  //   name: doc.object_name
  // }, {
  //   $set: {
  //     relatedList: relatedList
  //   }
  // });
};

function check(object_name, objectName, _id){
  let query = {
    object_name: object_name,
    objectName: objectName
  }
  if(_id){
    query._id = {$ne: _id}
  }
  let count = Creator.getCollection("object_related_list").find(query).count();

  if(count > 0){
    throw new Error("object_related_list_error_unique");
  }
}

function allowChangeObject(){
  var config = objectql.getSteedosConfig();
  if(config.tenant && config.tenant.saas){
      return false
  }else{
      return true;
  }
}

Creator.Objects.object_related_list.triggers = {
  "before.insert.server.object_related_list.check": {
    on: 'server',
    when: 'before.insert',
    todo: function(userId, doc){
      if(!allowChangeObject()){
        throw new Meteor.Error(500, "华炎云服务不包含自定义业务对象的功能，请部署私有云版本");
      }
      check(doc.object_name, doc.objectName)
    }
  },
  "before.update.server.object_related_list.check": {
    on: 'server',
    when: 'before.update',
    todo: function(userId, doc, fieldNames, modifier, options){
      if(!allowChangeObject()){
        throw new Meteor.Error(500, "华炎云服务不包含自定义业务对象的功能，请部署私有云版本");
      }
      modifier.$set = modifier.$set || {}
      if(_.has(modifier.$set, 'object_name') || _.has(modifier.$set, 'objectName')){
        check(doc.object_name || modifier.$set.object_name, doc.objectName || modifier.$set.objectName, doc._id)
      }
    }
  },
  "before.remove.server.object_related_list.check": {
    on: "server",
    when: "before.remove",
    todo: function (userId, doc) {
      if(!allowChangeObject()){
        throw new Meteor.Error(500, "华炎云服务不包含自定义业务对象的功能，请部署私有云版本");
      }
    }
  },
  "after.insert.server.object_related_list": {
    on: "server",
    when: "after.insert",
    todo: function (userId, doc) {
      _syncToObject(doc, 'insert');
    }
  },
  "after.update.server.object_related_list": {
    on: "server",
    when: "after.update",
    todo: function (userId, doc, fieldNames, modifier, options) {
      _syncToObject(doc, 'update');
    }
  },
  "after.remove.server.object_related_list": {
    on: "server",
    when: "after.remove",
    todo: function (userId, doc) {
      return _syncToObject(doc, 'remove');
    }
  }
}
