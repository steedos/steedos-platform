Creator.Objects['permission_shares'].triggers = {
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
  },
  "after.insert.server.sharing": {
    on: "server",
    when: "after.insert",
    todo: function (userId, doc) {
      var bulk, collection, filters, object_name, push, selector;
      object_name = doc.object_name;
      collection = Creator.getCollection(object_name);
      bulk = collection.rawCollection().initializeUnorderedBulkOp();
      selector = {
        space: doc.space
      };
      if (doc.filters) {
        filters = Creator.formatFiltersToMongo(doc.filters, {
          extend: false
        });
        selector["$and"] = filters;
      }
      push = {
        sharing: {
          "u": doc.users,
          "o": doc.organizations,
          "r": doc._id
        }
      };
      bulk.find(selector).update({
        $push: push
      });
      return bulk.execute();
    }
  },
  "after.update.server.sharing": {
    on: "server",
    when: "after.update",
    todo: function (userId, doc, fieldNames, modifier, options) {
      var bulk, collection, filters, object_name, preBulk, preCollection, preObjectName, pull, push, selector;
      object_name = doc.object_name;
      collection = Creator.getCollection(object_name);
      preObjectName = this.previous.object_name;
      if (preObjectName !== object_name) {
        preCollection = Creator.getCollection(preObjectName);
      } else {
        preCollection = collection;
      }
      preBulk = preCollection.rawCollection().initializeUnorderedBulkOp();
      bulk = collection.rawCollection().initializeUnorderedBulkOp();
      selector = {
        space: doc.space,
        "sharing": {
          $elemMatch: {
            r: doc._id
          }
        }
      };
      pull = {
        sharing: {
          r: doc._id
        }
      };
      preBulk.find(selector).update({
        $pull: pull
      });
      preBulk.execute();
      selector = {
        space: doc.space
      };
      if (doc.filters) {
        filters = Creator.formatFiltersToMongo(doc.filters, {
          extend: false
        });
        selector["$and"] = filters;
      }
      push = {
        sharing: {
          "u": doc.users,
          "o": doc.organizations,
          "r": doc._id
        }
      };
      bulk.find(selector).update({
        $push: push
      });
      return bulk.execute();
    }
  },
  "after.remove.server.sharing": {
    on: "server",
    when: "after.remove",
    todo: function (userId, doc) {
      var bulk, collection, object_name, pull, selector;
      object_name = doc.object_name;
      collection = Creator.getCollection(object_name);
      bulk = collection.rawCollection().initializeUnorderedBulkOp();
      selector = {
        space: doc.space,
        "sharing": {
          $elemMatch: {
            r: doc._id
          }
        }
      };
      pull = {
        sharing: {
          r: doc._id
        }
      };
      bulk.find(selector).update({
        $pull: pull
      });
      return bulk.execute();
    }
  }
}