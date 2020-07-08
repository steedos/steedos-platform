var _ = require("underscore");

function _syncToObject(doc) {
  var relatedList = Creator.getCollection("object_related_list").find({
    space: doc.space,
    object_name: doc.object_name
  }, {
    sort: {sort_no: -1},
    fields: {
      _id: 0,
      space: 0,
      object_name: 0,
      created: 0,
      modified: 0,
      owner: 0,
      created_by: 0,
      modified_by: 0
    }
  }).fetch();
  return Creator.getCollection("objects").update({
    space: doc.space,
    name: doc.object_name
  }, {
    $set: {
      relatedList: relatedList
    }
  });
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

Creator.Objects.object_related_list.triggers = {
  "before.insert.server.check": {
    on: 'server',
    when: 'before.insert',
    todo: function(userId, doc){
      check(doc.object_name, doc.objectName)
    }
  },
  "before.update.server.check": {
    on: 'server',
    when: 'before.update',
    todo: function(userId, doc, fieldNames, modifier, options){
      modifier.$set = modifier.$set || {}
      if(_.has(modifier.$set, 'object_name') || _.has(modifier.$set, 'objectName')){
        check(doc.object_name || modifier.$set.object_name, doc.objectName || modifier.$set.objectName, doc._id)
      }
    }
  },
  "after.insert.server.object_related_list": {
    on: "server",
    when: "after.insert",
    todo: function (userId, doc) {
      _syncToObject(doc);
    }
  },
  "after.update.server.object_related_list": {
    on: "server",
    when: "after.update",
    todo: function (userId, doc, fieldNames, modifier, options) {
      _syncToObject(doc);
    }
  },
  "after.remove.server.object_related_list": {
    on: "server",
    when: "after.remove",
    todo: function (userId, doc) {
      return _syncToObject(doc);
    }
  }
}
