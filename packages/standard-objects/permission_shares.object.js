Creator.Objects.permission_shares = {
  name: "permission_shares",
  label: "共享规则",
  icon: "assigned_resource",
  fields: {
    name: {
      label: "名称",
      type: "text",
      required: true,
      searchable: true,
      index: true
    },
    object_name: {
      label: "对象",
      type: "lookup",
      optionsFunction: function () {
        var _options;
        _options = [];
        _.forEach(Creator.objectsByName, function (o, k) {
          var enable_share;
          enable_share = o.enable_share === void 0 ? true : o.enable_share;
          if (enable_share && !o.hidden) {
            return _options.push({
              label: o.label,
              value: k,
              icon: o.icon
            });
          }
        });
        return _options;
      },
      required: true
    },
    filters: {
      label: "过滤条件",
      type: "grid"
    },
    "filters.$.field": {
      label: "字段名",
      type: "text"
    },
    "filters.$.operation": {
      label: "操作符",
      type: "select",
      defaultValue: "=",
      options: function () {
        return Creator.getFieldOperation();
      }
    },
    "filters.$.value": {
      label: "字段值",
      blackbox: true
    },
    organizations: {
      label: "授权组织",
      type: "lookup",
      reference_to: "organizations",
      multiple: true,
      defaultValue: []
    },
    users: {
      label: "授权用户",
      type: "lookup",
      reference_to: "users",
      multiple: true,
      defaultValue: []
    }
  },
  list_views: {
    all: {
      label: "全部",
      filter_scope: "space",
      columns: ["name"]
    }
  },
  permission_set: {
    user: {
      allowCreate: true,
      allowDelete: true,
      allowEdit: true,
      allowRead: true,
      modifyAllRecords: false,
      viewAllRecords: false
    },
    admin: {
      allowCreate: true,
      allowDelete: true,
      allowEdit: true,
      allowRead: true,
      modifyAllRecords: true,
      viewAllRecords: true
    }
  },
  triggers: {
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
};