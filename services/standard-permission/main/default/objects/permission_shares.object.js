const objectql = require('@steedos/objectql');

Creator.Objects['permission_shares'].triggers = Object.assign({}, Creator.Objects['permission_shares'].triggers, {
  "before.insert.server.sharing": {
    on: "server",
    when: "before.insert",
    todo: function (userId, doc) {
      if (_.isEmpty(doc.organizations) && _.isEmpty(doc.users)) {
        throw new Meteor.Error(500, "请在授权组织或授权用户中至少填写一个值");
      }
    }
  },
  "before.update.server.sharing": {
    on: "server",
    when: "before.update",
    todo: function (userId, doc, fieldNames, modifier, options) {
      var errMsg;
      errMsg = t("creator_permission_share_miss");
      if (fieldNames.length === 1) {
        if (fieldNames.indexOf("organizations") > -1) {
          if (_.isEmpty(modifier.$set.organizations) && _.isEmpty(doc.users)) {
            throw new Meteor.Error(500, errMsg);
          }
        } else if (fieldNames.indexOf("users") > -1) {
          if (_.isEmpty(doc.organizations) && _.isEmpty(modifier.$set.users)) {
            throw new Meteor.Error(500, errMsg);
          }
        }
      } else if (_.isEmpty(modifier.$set.organizations) && _.isEmpty(modifier.$set.users)) {
        throw new Meteor.Error(500, errMsg);
      }
    }
  }
})

if(Meteor.isServer){
  Meteor.startup(function() {
    let objectName = 'permission_shares';
    Creator.getCollection(objectName).find({}, {
      fields: {
        _id: 1,
        object_name: 1,
        filters: 1
      }
    }).observe({
      added: function(doc){
        objectql.addConfig(objectName, doc)
      },
      changed: function(doc){
        objectql.addConfig(objectName, doc)
      },
      removed: function(doc){
        objectql.removeConfig(objectName, doc)
      }
    })
  });
}