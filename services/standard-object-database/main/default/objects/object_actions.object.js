var objectql = require('@steedos/objectql');
var objectCore = require('./objects.core.js');
function _syncToObject(doc, event) {
  objectCore.triggerReloadObject(doc.object, 'action', doc, event);
  // var actions, object_actions;
  // object_actions = Creator.getCollection("object_actions").find({
  //   object: doc.object,
  //   space: doc.space,
  //   is_enable: true
  // }, {
  //   fields: {
  //     created: 0,
  //     modified: 0,
  //     owner: 0,
  //     created_by: 0,
  //     modified_by: 0
  //   }
  // }).fetch();
  // actions = {};
  // _.forEach(object_actions, function (f) {
  //   return actions[f.name] = f;
  // });
  // return Creator.getCollection("objects").update({
  //   space: doc.space,
  //   name: doc.object
  // }, {
  //   $set: {
  //     actions: actions
  //   }
  // });
};

function isRepeatedName(doc, name) {
  var other;
  other = Creator.getCollection("object_actions").find({
    object: doc.object,
    space: doc.space,
    _id: {
      $ne: doc._id
    },
    name: name || doc.name
  }, {
    fields: {
      _id: 1
    }
  });
  if (other.count() > 0) {
    return true;
  }
  return false;
};

function checkName(name){
  var reg = new RegExp('^[a-z]([a-z0-9]|_(?!_))*[a-z0-9]$');
  if(!reg.test(name)){
      throw new Error("object_actions__error_name_invalid_format");
  }
  if(name.length > 50){
      throw new Error("API 名称长度不能大于50个字符");
  }
  return true
}

function checkScript(script){
  if(script && !script.startsWith("function")){
      throw new Error("执行的脚本必须是以function包裹的函数，比如：function(object_name, record_id){// 在这里补充按钮点击事件业务需求脚本。}");
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

const triggers = {
  // "after.insert.server.object_actions": {
  //   on: "server",
  //   when: "after.insert",
  //   todo: function (userId, doc) {
  //     return _syncToObject(doc, 'insert');
  //   }
  // },
  // "after.update.server.object_actions": {
  //   on: "server",
  //   when: "after.update",
  //   todo: function (userId, doc) {
  //     doc._previousName = this.previous.name
  //     return _syncToObject(doc, 'update');
  //   }
  // },
  // "after.remove.server.object_actions": {
  //   on: "server",
  //   when: "after.remove",
  //   todo: function (userId, doc) {
  //     return _syncToObject(doc, 'remove');
  //   }
  // },
  "before.update.server.object_actions": {
    on: "server",
    when: "before.update",
    todo: function (userId, doc, fieldNames, modifier, options) {

      if(!allowChangeObject()){
        throw new Meteor.Error(500, "华炎云服务不包含自定义业务对象的功能，请部署私有云版本");
      }

      modifier.$set = modifier.$set || {}

      // if(_.has(modifier.$set, "object") && modifier.$set.object != doc.object){
      //   throw new Error("不能修改所属对象");
      // }
      if(_.has(modifier.$set, "name") && modifier.$set.name != doc.name){
        checkName(modifier.$set.name);
      }
      
      checkScript(modifier.$set.todo);

      var ref;
      if ((modifier != null ? (ref = modifier.$set) != null ? ref.name : void 0 : void 0) && isRepeatedName(doc, modifier.$set.name)) {
        throw new Meteor.Error(500, "名称不能重复");
      }
    }
  },
  "before.insert.server.object_actions": {
    on: "server",
    when: "before.insert",
    todo: function (userId, doc) {
      if(!allowChangeObject()){
        throw new Meteor.Error(500, "华炎云服务不包含自定义业务对象的功能，请部署私有云版本");
      }
      doc.visible = true;
      checkName(doc.name);
      checkScript(doc.todo);
      if (isRepeatedName(doc)) {
        throw new Meteor.Error(500, `名称不能重复${doc.name}`);
      }
    }
  },
  "before.remove.server.object_actions": {
    on: "server",
    when: "before.remove",
    todo: function (userId, doc) {
      if(!allowChangeObject()){
        throw new Meteor.Error(500, "华炎云服务不包含自定义业务对象的功能，请部署私有云版本");
      }
    }
  }
}

Creator.Objects.object_actions.triggers = Object.assign(Creator.Objects.object_actions.triggers || {}, triggers);