function _syncToObject(doc) {
  var actions, object_actions;
  object_actions = Creator.getCollection("object_actions").find({
    object: doc.object,
    space: doc.space,
    is_enable: true
  }, {
    fields: {
      created: 0,
      modified: 0,
      owner: 0,
      created_by: 0,
      modified_by: 0
    }
  }).fetch();
  actions = {};
  _.forEach(object_actions, function (f) {
    return actions[f.name] = f;
  });
  return Creator.getCollection("objects").update({
    space: doc.space,
    name: doc.object
  }, {
    $set: {
      actions: actions
    }
  });
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

Creator.Objects.object_actions.triggers = {
  "after.insert.server.object_actions": {
    on: "server",
    when: "after.insert",
    todo: function (userId, doc) {
      return _syncToObject(doc);
    }
  },
  "after.update.server.object_actions": {
    on: "server",
    when: "after.update",
    todo: function (userId, doc) {
      return _syncToObject(doc);
    }
  },
  "after.remove.server.object_actions": {
    on: "server",
    when: "after.remove",
    todo: function (userId, doc) {
      return _syncToObject(doc);
    }
  },
  "before.update.server.object_actions": {
    on: "server",
    when: "before.update",
    todo: function (userId, doc, fieldNames, modifier, options) {
      modifier.$set = modifier.$set || {}

      if(_.has(modifier.$set, "object") && modifier.$set.object != doc.object){
        throw new Error("不能修改所属对象");
      }

      var ref;
      if ((modifier != null ? (ref = modifier.$set) != null ? ref.name : void 0 : void 0) && isRepeatedName(doc, modifier.$set.name)) {
        console.log(`update actions对象名称不能重复${doc.name}`);
        throw new Meteor.Error(500, "对象名称不能重复");
      }
    }
  },
  "before.insert.server.object_actions": {
    on: "server",
    when: "before.insert",
    todo: function (userId, doc) {
      doc.visible = true;
      if (isRepeatedName(doc)) {
        console.log(`insert actions对象名称不能重复${doc.name}`);
        throw new Meteor.Error(500, `对象名称不能重复${doc.name}`);
      }
    }
  }
}