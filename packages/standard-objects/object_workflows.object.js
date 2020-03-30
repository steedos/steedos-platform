Creator.Objects.object_workflows.triggers = {
  "before.insert.server.default": {
    on: "server",
    when: "before.insert",
    todo: function (userId, doc) {
      if (doc.object_name) {
        var object = Creator.getObject(doc.object_name);
        if (!object.enable_workflow) {
          throw new Meteor.Error(400, `只有启用开关(enable_workflow)的业务对象，才能配置对象流程。`);
        }
      }
    }
  },
  "before.update.server.default": {
    on: "server",
    when: "before.update",
    todo: function (userId, doc, fieldNames, modifier, options) {
      modifier.$set = modifier.$set || {};
      if (modifier.$set.object_name) {
        var object = Creator.getObject(modifier.$set.object_name);
        if (!object.enable_workflow) {
          throw new Meteor.Error(400, `只有启用开关(enable_workflow)的业务对象，才能配置对象流程。`);
        }
      }
    }
  },
};