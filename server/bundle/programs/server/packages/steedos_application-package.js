(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Random = Package.random.Random;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var check = Package.check.check;
var Match = Package.check.Match;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var Restivus = Package['nimble:restivus'].Restivus;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var Tabular = Package['aldeed:tabular'].Tabular;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var SubsManager = Package['meteorhacks:subs-manager'].SubsManager;
var Promise = Package.promise.Promise;
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_application-package/models/application_package.coffee                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Creator.Objects.application_package = {
  name: "application_package",
  icon: "custom.custom42",
  label: "软件包",
  hidden: true,
  fields: {
    name: {
      type: "text",
      label: "名称"
    },
    apps: {
      type: "lookup",
      label: "应用",
      type: "lookup",
      reference_to: "apps",
      multiple: true,
      optionsFunction: function () {
        var _options;

        _options = [];

        _.forEach(Creator.Apps, function (o, k) {
          return _options.push({
            label: o.name,
            value: k,
            icon: o.icon_slds
          });
        });

        return _options;
      }
    },
    objects: {
      type: "lookup",
      label: "对象",
      reference_to: "objects",
      multiple: true,
      optionsFunction: function () {
        var _options;

        _options = [];

        _.forEach(Creator.objectsByName, function (o, k) {
          if (!o.hidden) {
            return _options.push({
              label: o.label,
              value: k,
              icon: o.icon
            });
          }
        });

        return _options;
      }
    },
    list_views: {
      type: "lookup",
      label: "列表视图",
      multiple: true,
      reference_to: "object_listviews",
      optionsMethod: "creator.listviews_options"
    },
    permission_set: {
      type: "lookup",
      label: "权限集",
      multiple: true,
      reference_to: "permission_set"
    },
    permission_objects: {
      type: "lookup",
      label: "权限集",
      multiple: true,
      reference_to: "permission_objects"
    },
    reports: {
      type: "lookup",
      label: "报表",
      multiple: true,
      reference_to: "reports"
    }
  },
  list_views: {
    all: {
      label: "所有",
      columns: ["name"],
      filter_scope: "space"
    }
  },
  actions: {
    init_data: {
      label: "初始化",
      visible: true,
      on: "record",
      todo: function (object_name, record_id, fields) {
        console.log(object_name, record_id, fields);
        return Meteor.call("appPackage.init_export_data", Session.get("spaceId"), record_id, function (error, result) {
          if (error) {
            return toastr.error(error.reason);
          } else {
            return toastr.success("初始化完成");
          }
        });
      }
    },
    "export": {
      label: "导出",
      visible: true,
      on: "record",
      todo: function (object_name, record_id, fields) {
        var url;
        console.log("导出" + object_name + "->" + record_id);
        url = Steedos.absoluteUrl("/api/creator/app_package/export/" + Session.get("spaceId") + "/" + record_id);
        return window.open(url);
      }
    },
    "import": {
      label: "导入",
      visible: true,
      on: "list",
      todo: function (object_name) {
        console.log("object_name", object_name);
        return Modal.show("APPackageImportModal");
      }
    }
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_application-package/server/routes/export.coffee                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
JsonRoutes.add('get', '/api/creator/app_package/export/:space_id/:record_id', function (req, res, next) {
  var data, e, fileName, record, record_id, space_id, space_user, userId;

  try {
    userId = Steedos.getUserIdFromAuthToken(req, res);

    if (!userId) {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          errors: "Authentication is required and has not been provided."
        }
      });
      return;
    }

    record_id = req.params.record_id;
    space_id = req.params.space_id;

    if (!Creator.isSpaceAdmin(space_id, userId)) {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          errors: "Permission denied"
        }
      });
      return;
    }

    record = Creator.getCollection("application_package").findOne({
      _id: record_id
    });

    if (!record) {
      JsonRoutes.sendResult(res, {
        code: 404,
        data: {
          errors: "Collection not found for the segment " + record_id
        }
      });
      return;
    }

    space_user = Creator.getCollection("space_users").findOne({
      user: userId,
      space: record.space
    });

    if (!space_user) {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          errors: "User does not have privileges to access the entity"
        }
      });
      return;
    }

    data = APTransform["export"](record);
    data.dataSource = Meteor.absoluteUrl("api/creator/app_package/export/" + space_id + "/" + record_id);
    fileName = record.name || "application_package";
    res.setHeader('Content-type', 'application/x-msdownload');
    res.setHeader('Content-Disposition', 'attachment;filename=' + encodeURI(fileName) + '.json');
    return res.end(JSON.stringify(data, null, 4));
  } catch (error) {
    e = error;
    console.error(e.stack);
    return JsonRoutes.sendResult(res, {
      code: 200,
      data: {
        errors: e.reason || e.message
      }
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_application-package/server/routes/import.coffee                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var transformFieldOptions, transformFilters;

transformFilters = function (filters) {
  var _filters;

  _filters = [];

  _.each(filters, function (f) {
    if (_.isArray(f) && f.length === 3) {
      return _filters.push({
        field: f[0],
        operation: f[1],
        value: f[2]
      });
    } else {
      return _filters.push(f);
    }
  });

  return _filters;
};

transformFieldOptions = function (options) {
  var _options;

  if (!_.isArray(options)) {
    return options;
  }

  _options = [];

  _.each(options, function (o) {
    if (o && _.has(o, 'label') && _.has(o, 'value')) {
      return _options.push(o.label + ":" + o.value);
    }
  });

  return _options.join(',');
};

Creator.importObject = function (userId, space_id, object, list_views_id_maps) {
  var _fieldnames, actions, fields, hasRecentView, internal_list_view, obj_list_views, triggers;

  console.log('------------------importObject------------------', object.name);
  fields = object.fields;
  triggers = object.triggers;
  actions = object.actions;
  obj_list_views = object.list_views;
  delete object._id;
  delete object.fields;
  delete object.triggers;
  delete object.actions;
  delete object.permissions;
  delete object.list_views;
  object.space = space_id;
  object.owner = userId;
  Creator.getCollection("objects").insert(object);
  internal_list_view = {};
  hasRecentView = false;
  console.log('持久化对象list_views');

  _.each(obj_list_views, function (list_view) {
    var new_id, old_id, options;
    old_id = list_view._id;
    delete list_view._id;
    list_view.space = space_id;
    list_view.owner = userId;
    list_view.object_name = object.name;

    if (Creator.isRecentView(list_view)) {
      hasRecentView = true;
    }

    if (list_view.filters) {
      list_view.filters = transformFilters(list_view.filters);
    }

    if (Creator.isAllView(list_view) || Creator.isRecentView(list_view)) {
      options = {
        $set: list_view
      };

      if (!list_view.columns) {
        options.$unset = {
          columns: ''
        };
      }

      return Creator.getCollection("object_listviews").update({
        object_name: object.name,
        name: list_view.name,
        space: space_id
      }, options);
    } else {
      new_id = Creator.getCollection("object_listviews").insert(list_view);
      return list_views_id_maps[object.name + "_" + old_id] = new_id;
    }
  });

  if (!hasRecentView) {
    Creator.getCollection("object_listviews").remove({
      name: "recent",
      space: space_id,
      object_name: object.name,
      owner: userId
    });
  }

  console.log('持久化对象字段');
  _fieldnames = [];

  _.each(fields, function (field, k) {
    delete field._id;
    field.space = space_id;
    field.owner = userId;
    field.object = object.name;

    if (field.options) {
      field.options = transformFieldOptions(field.options);
    }

    if (!_.has(field, "name")) {
      field.name = k;
    }

    _fieldnames.push(field.name);

    if (field.name === "name") {
      Creator.getCollection("object_fields").update({
        object: object.name,
        name: "name",
        space: space_id
      }, {
        $set: field
      });
    } else {
      Creator.getCollection("object_fields").insert(field);
    }

    if (!_.contains(_fieldnames, 'name')) {
      return Creator.getCollection("object_fields").direct.remove({
        object: object.name,
        name: "name",
        space: space_id
      });
    }
  });

  console.log('持久化触发器');

  _.each(triggers, function (trigger, k) {
    delete triggers._id;
    trigger.space = space_id;
    trigger.owner = userId;
    trigger.object = object.name;

    if (!_.has(trigger, "name")) {
      trigger.name = k.replace(new RegExp("\\.", "g"), "_");
    }

    if (!_.has(trigger, "is_enable")) {
      trigger.is_enable = true;
    }

    return Creator.getCollection("object_triggers").insert(trigger);
  });

  console.log('持久化操作');

  _.each(actions, function (action, k) {
    delete action._id;
    action.space = space_id;
    action.owner = userId;
    action.object = object.name;

    if (!_.has(action, "name")) {
      action.name = k.replace(new RegExp("\\.", "g"), "_");
    }

    if (!_.has(action, "is_enable")) {
      action.is_enable = true;
    }

    return Creator.getCollection("object_actions").insert(action);
  });

  return console.log('------------------importObject end------------------', object.name);
};

Creator.import_app_package = function (userId, space_id, imp_data, from_template) {
  var apps_id_maps, imp_app_ids, imp_object_names, list_views_id_maps, object_names, permission_set_id_maps, permission_set_ids;

  if (!userId) {
    throw new Meteor.Error("401", "Authentication is required and has not been provided.");
  }

  if (!Creator.isSpaceAdmin(space_id, userId)) {
    throw new Meteor.Error("401", "Permission denied.");
  } /*数据校验 开始 */

  check(imp_data, Object);

  if (!from_template) {
    imp_app_ids = _.pluck(imp_data.apps, "_id");

    if (_.isArray(imp_data.apps) && imp_data.apps.length > 0) {
      _.each(imp_data.apps, function (app) {
        if (_.include(_.keys(Creator.Apps), app._id)) {
          throw new Meteor.Error("500", "应用'" + app.name + "'已存在");
        }
      });
    }

    if (_.isArray(imp_data.objects) && imp_data.objects.length > 0) {
      _.each(imp_data.objects, function (object) {
        if (_.include(_.keys(Creator.Objects), object.name)) {
          throw new Meteor.Error("500", "对象'" + object.name + "'已存在");
        }

        return _.each(object.triggers, function (trigger) {
          if (trigger.on === 'server' && !Steedos.isLegalVersion(space_id, "workflow.enterprise")) {
            throw new Meteor.Error(500, "只有企业版支持配置服务端的触发器");
          }
        });
      });
    }

    imp_object_names = _.pluck(imp_data.objects, "name");
    object_names = _.keys(Creator.Objects);

    if (_.isArray(imp_data.apps) && imp_data.apps.length > 0) {
      _.each(imp_data.apps, function (app) {
        return _.each(app.objects, function (object_name) {
          if (!_.include(object_names, object_name) && !_.include(imp_object_names, object_name)) {
            throw new Meteor.Error("500", "应用'" + app.name + "'中指定的对象'" + object_name + "'不存在");
          }
        });
      });
    }

    if (_.isArray(imp_data.list_views) && imp_data.list_views.length > 0) {
      _.each(imp_data.list_views, function (list_view) {
        if (!list_view.object_name || !_.isString(list_view.object_name)) {
          throw new Meteor.Error("500", "列表视图'" + list_view.name + "'的object_name属性无效");
        }

        if (!_.include(object_names, list_view.object_name) && !_.include(imp_object_names, list_view.object_name)) {
          throw new Meteor.Error("500", "列表视图'" + list_view.name + "'中指定的对象'" + list_view.object_name + "'不存在");
        }
      });
    }

    permission_set_ids = _.pluck(imp_data.permission_set, "_id");

    if (_.isArray(imp_data.permission_set) && imp_data.permission_set.length > 0) {
      _.each(imp_data.permission_set, function (permission_set) {
        if (Creator.getCollection("permission_set").findOne({
          space: space_id,
          name: permission_set.name
        }, {
          fields: {
            _id: 1
          }
        })) {
          throw new Meteor.Error(500, "权限集名称'" + permission_set.name + "'不能重复");
        }

        return _.each(permission_set.assigned_apps, function (app_id) {
          if (!_.include(_.keys(Creator.Apps), app_id) && !_.include(imp_app_ids, app_id)) {
            throw new Meteor.Error("500", "权限集'" + permission_set.name + "'的授权应用'" + app_id + "'不存在");
          }
        });
      });
    }

    if (_.isArray(imp_data.permission_objects) && imp_data.permission_objects.length > 0) {
      _.each(imp_data.permission_objects, function (permission_object) {
        if (!permission_object.object_name || !_.isString(permission_object.object_name)) {
          throw new Meteor.Error("500", "权限集'" + permission_object.name + "'的object_name属性无效");
        }

        if (!_.include(object_names, permission_object.object_name) && !_.include(imp_object_names, permission_object.object_name)) {
          throw new Meteor.Error("500", "权限集'" + list_view.name + "'中指定的对象'" + permission_object.object_name + "'不存在");
        }

        if (!_.has(permission_object, "permission_set_id") || !_.isString(permission_object.permission_set_id)) {
          throw new Meteor.Error("500", "权限集'" + permission_object.name + "'的permission_set_id属性无效");
        } else if (!_.include(permission_set_ids, permission_object.permission_set_id)) {
          throw new Meteor.Error("500", "权限集'" + permission_object.name + "'指定的权限集'" + permission_object.permission_set_id + "'值不在导入的permission_set中");
        }
      });
    }

    if (_.isArray(imp_data.reports) && imp_data.reports.length > 0) {
      _.each(imp_data.reports, function (report) {
        if (!report.object_name || !_.isString(report.object_name)) {
          throw new Meteor.Error("500", "报表'" + report.name + "'的object_name属性无效");
        }

        if (!_.include(object_names, report.object_name) && !_.include(imp_object_names, report.object_name)) {
          throw new Meteor.Error("500", "报表'" + report.name + "'中指定的对象'" + report.object_name + "'不存在");
        }
      });
    }
  } /*数据校验 结束 */ /*数据持久化 开始 */

  apps_id_maps = {};
  list_views_id_maps = {};
  permission_set_id_maps = {};

  if (_.isArray(imp_data.apps) && imp_data.apps.length > 0) {
    _.each(imp_data.apps, function (app) {
      var new_id, old_id;
      old_id = app._id;
      delete app._id;
      app.space = space_id;
      app.owner = userId;
      app.is_creator = true;
      new_id = Creator.getCollection("apps").insert(app);
      return apps_id_maps[old_id] = new_id;
    });
  }

  if (_.isArray(imp_data.objects) && imp_data.objects.length > 0) {
    _.each(imp_data.objects, function (object) {
      return Creator.importObject(userId, space_id, object, list_views_id_maps);
    });
  }

  if (_.isArray(imp_data.list_views) && imp_data.list_views.length > 0) {
    _.each(imp_data.list_views, function (list_view) {
      var _list_view, new_id, old_id;

      old_id = list_view._id;
      delete list_view._id;
      list_view.space = space_id;
      list_view.owner = userId;

      if (Creator.isAllView(list_view) || Creator.isRecentView(list_view)) {
        _list_view = Creator.getCollection("object_listviews").findOne({
          object_name: list_view.object_name,
          name: list_view.name,
          space: space_id
        }, {
          fields: {
            _id: 1
          }
        });

        if (_list_view) {
          new_id = _list_view._id;
        }

        Creator.getCollection("object_listviews").update({
          object_name: list_view.object_name,
          name: list_view.name,
          space: space_id
        }, {
          $set: list_view
        });
      } else {
        new_id = Creator.getCollection("object_listviews").insert(list_view);
      }

      return list_views_id_maps[list_view.object_name + "_" + old_id] = new_id;
    });
  }

  if (_.isArray(imp_data.permission_set) && imp_data.permission_set.length > 0) {
    _.each(imp_data.permission_set, function (permission_set) {
      var assigned_apps, new_id, old_id, permission_set_users;
      old_id = permission_set._id;
      delete permission_set._id;
      permission_set.space = space_id;
      permission_set.owner = userId;
      permission_set_users = [];

      _.each(permission_set.users, function (user_id) {
        var space_user;
        space_user = Creator.getCollection("space_users").findOne({
          space: space_id,
          user: user_id
        }, {
          fields: {
            _id: 1
          }
        });

        if (space_user) {
          return permission_set_users.push(user_id);
        }
      });

      assigned_apps = [];

      _.each(permission_set.assigned_apps, function (app_id) {
        if (_.include(_.keys(Creator.Apps), app_id)) {
          return assigned_apps.push(app_id);
        } else if (apps_id_maps[app_id]) {
          return assigned_apps.push(apps_id_maps[app_id]);
        }
      });

      new_id = Creator.getCollection("permission_set").insert(permission_set);
      return permission_set_id_maps[old_id] = new_id;
    });
  }

  if (_.isArray(imp_data.permission_objects) && imp_data.permission_objects.length > 0) {
    _.each(imp_data.permission_objects, function (permission_object) {
      var disabled_list_views;
      delete permission_object._id;
      permission_object.space = space_id;
      permission_object.owner = userId;
      permission_object.permission_set_id = permission_set_id_maps[permission_object.permission_set_id];
      disabled_list_views = [];

      _.each(permission_object.disabled_list_views, function (list_view_id) {
        var new_view_id;
        new_view_id = list_views_id_maps[permission_object.object_name + "_" + list_view_id];

        if (new_view_id) {
          return disabled_list_views.push(new_view_id);
        }
      });

      return Creator.getCollection("permission_objects").insert(permission_object);
    });
  }

  if (_.isArray(imp_data.reports) && imp_data.reports.length > 0) {
    return _.each(imp_data.reports, function (report) {
      delete report._id;
      report.space = space_id;
      report.owner = userId;
      return Creator.getCollection("reports").insert(report);
    });
  } /*数据持久化 结束 */
}; /*由于使用接口方式会导致collection的after、before中获取不到userId，再此问题未解决之前，还是使用Method
   JsonRoutes.add 'post', '/api/creator/app_package/import/:space_id', (req, res, next) ->
   	try
   		userId = Steedos.getUserIdFromAuthToken(req, res);
   		space_id = req.params.space_id
   		imp_data = req.body
   		import_app_package(userId, space_id, imp_data)
   		JsonRoutes.sendResult res, {
   			code: 200
   			data: {}
   		}
   	catch e
   		console.error e.stack
   		JsonRoutes.sendResult res, {
   			code: e.error
   			data: { errors: errorMessage: e.reason || e.message }
   		}
    */

Meteor.methods({
  'import_app_package': function (space_id, imp_data) {
    var userId;
    userId = this.userId;
    return Creator.import_app_package(userId, space_id, imp_data);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_application-package/server/methods/listviews_options.coffee                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  "creator.listviews_options": function (options) {
    var collection, e, name_field_key, object, query, query_options, records, ref, ref1, results, searchTextQuery, selected, sort;

    if (options != null ? (ref = options.params) != null ? ref.reference_to : void 0 : void 0) {
      object = Creator.getObject(options.params.reference_to);
      name_field_key = object.NAME_FIELD_KEY;
      query = {};

      if (options.params.space) {
        query.space = options.params.space;
        sort = options != null ? options.sort : void 0;
        selected = (options != null ? options.selected : void 0) || [];

        if (options.searchText) {
          searchTextQuery = {};
          searchTextQuery[name_field_key] = {
            $regex: options.searchText
          };
        }

        if (options != null ? (ref1 = options.values) != null ? ref1.length : void 0 : void 0) {
          if (options.searchText) {
            query.$or = [{
              _id: {
                $in: options.values
              }
            }, searchTextQuery, {
              object_name: {
                $regex: options.searchText
              }
            }];
          } else {
            query.$or = [{
              _id: {
                $in: options.values
              }
            }];
          }
        } else {
          if (options.searchText) {
            _.extend(query, {
              $or: [searchTextQuery, {
                object_name: {
                  $regex: options.searchText
                }
              }]
            });
          }

          query._id = {
            $nin: selected
          };
        }

        collection = object.db;

        if (options.filterQuery) {
          _.extend(query, options.filterQuery);
        }

        query_options = {
          limit: 10
        };

        if (sort && _.isObject(sort)) {
          query_options.sort = sort;
        }

        if (collection) {
          try {
            records = collection.find(query, query_options).fetch();
            results = [];

            _.each(records, function (record) {
              var object_name, ref2;
              object_name = ((ref2 = Creator.getObject(record.object_name)) != null ? ref2.name : void 0) || "";

              if (!_.isEmpty(object_name)) {
                object_name = " (" + object_name + ")";
              }

              return results.push({
                label: record[name_field_key] + object_name,
                value: record._id
              });
            });

            return results;
          } catch (error) {
            e = error;
            throw new Meteor.Error(500, e.message + "-->" + JSON.stringify(options));
          }
        }
      }
    }

    return [];
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_application-package/server/methods/init_export_data.coffee                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var getAppObjects, getObjectsListViews, getObjectsPermissionObjects, getObjectsPermissionSet, getObjectsReports;

getAppObjects = function (app) {
  var appObjects;
  appObjects = [];

  if (app && _.isArray(app.objects) && app.objects.length > 0) {
    _.each(app.objects, function (object_name) {
      var object;
      object = Creator.getObject(object_name);

      if (object) {
        return appObjects.push(object_name);
      }
    });
  }

  return appObjects;
};

getObjectsListViews = function (space_id, objects_name) {
  var objectsListViews;
  objectsListViews = [];

  if (objects_name && _.isArray(objects_name) && objects_name.length > 0) {
    _.each(objects_name, function (object_name) {
      var list_views;
      list_views = Creator.getCollection("object_listviews").find({
        object_name: object_name,
        space: space_id,
        shared: true
      }, {
        fields: {
          _id: 1
        }
      });
      return list_views.forEach(function (list_view) {
        return objectsListViews.push(list_view._id);
      });
    });
  }

  return objectsListViews;
};

getObjectsReports = function (space_id, objects_name) {
  var objectsReports;
  objectsReports = [];

  if (objects_name && _.isArray(objects_name) && objects_name.length > 0) {
    _.each(objects_name, function (object_name) {
      var reports;
      reports = Creator.getCollection("reports").find({
        object_name: object_name,
        space: space_id
      }, {
        fields: {
          _id: 1
        }
      });
      return reports.forEach(function (report) {
        return objectsReports.push(report._id);
      });
    });
  }

  return objectsReports;
};

getObjectsPermissionObjects = function (space_id, objects_name) {
  var objectsPermissionObjects;
  objectsPermissionObjects = [];

  if (objects_name && _.isArray(objects_name) && objects_name.length > 0) {
    _.each(objects_name, function (object_name) {
      var permission_objects;
      permission_objects = Creator.getCollection("permission_objects").find({
        object_name: object_name,
        space: space_id
      }, {
        fields: {
          _id: 1
        }
      });
      return permission_objects.forEach(function (permission_object) {
        return objectsPermissionObjects.push(permission_object._id);
      });
    });
  }

  return objectsPermissionObjects;
};

getObjectsPermissionSet = function (space_id, objects_name) {
  var objectsPermissionSet;
  objectsPermissionSet = [];

  if (objects_name && _.isArray(objects_name) && objects_name.length > 0) {
    _.each(objects_name, function (object_name) {
      var permission_objects;
      permission_objects = Creator.getCollection("permission_objects").find({
        object_name: object_name,
        space: space_id
      }, {
        fields: {
          permission_set_id: 1
        }
      });
      return permission_objects.forEach(function (permission_object) {
        var permission_set;
        permission_set = Creator.getCollection("permission_set").findOne({
          _id: permission_object.permission_set_id
        }, {
          fields: {
            _id: 1
          }
        });
        return objectsPermissionSet.push(permission_set._id);
      });
    });
  }

  return objectsPermissionSet;
};

Meteor.methods({
  "appPackage.init_export_data": function (space_id, record_id) {
    var _objects, _objects_list_views, _objects_permission_objects, _objects_permission_set, _objects_reports, data, e, record, ref, ref1, userId;

    userId = this.userId;

    if (!userId) {
      throw new Meteor.Error("401", "Authentication is required and has not been provided.");
    }

    if (!Creator.isSpaceAdmin(space_id, userId)) {
      throw new Meteor.Error("401", "Permission denied.");
    }

    record = Creator.getCollection("application_package").findOne({
      _id: record_id
    });

    if ((!_.isArray(record != null ? record.apps : void 0) || (record != null ? (ref = record.apps) != null ? ref.length : void 0 : void 0) < 1) && (!_.isArray(record != null ? record.objects : void 0) || (record != null ? (ref1 = record.objects) != null ? ref1.length : void 0 : void 0) < 1)) {
      throw new Meteor.Error("500", "请先选择应用或者对象");
    }

    data = {};
    _objects = record.objects || [];
    _objects_list_views = record.list_views || [];
    _objects_reports = record.reports || [];
    _objects_permission_objects = record.permission_objects || [];
    _objects_permission_set = record.permission_set || [];

    try {
      if (_.isArray(record != null ? record.apps : void 0) && record.apps.length > 0) {
        _.each(record.apps, function (appId) {
          var app;

          if (!app) {
            app = Creator.getCollection("apps").findOne({
              _id: appId,
              is_creator: true
            }, {
              fields: {
                objects: 1
              }
            });
          }

          return _objects = _objects.concat(getAppObjects(app));
        });
      }

      if (_.isArray(_objects) && _objects.length > 0) {
        _objects_list_views = _objects_list_views.concat(getObjectsListViews(space_id, _objects));
        _objects_reports = _objects_reports.concat(getObjectsReports(space_id, _objects));
        _objects_permission_objects = _objects_permission_objects.concat(getObjectsPermissionObjects(space_id, _objects));
        _objects_permission_set = _objects_permission_set.concat(getObjectsPermissionSet(space_id, _objects));
        data.objects = _.uniq(_objects);
        data.list_views = _.uniq(_objects_list_views);
        data.permission_set = _.uniq(_objects_permission_set);
        data.permission_objects = _.uniq(_objects_permission_objects);
        data.reports = _.uniq(_objects_reports);
        return Creator.getCollection("application_package").update({
          _id: record._id
        }, {
          $set: data
        });
      }
    } catch (error) {
      e = error;
      console.error(e.stack);
      throw new Meteor.Error("500", e.reason || e.message);
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_application-package/lib/transform.coffee                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ignore_fields;
this.APTransform = {};
ignore_fields = {
  owner: 0,
  space: 0,
  created: 0,
  created_by: 0,
  modified: 0,
  modified_by: 0,
  is_deleted: 0,
  instances: 0,
  sharing: 0
};

APTransform.exportObject = function (object) {
  var _obj, actions, fields, obj_list_views, triggers;

  _obj = {};

  _.extend(_obj, object);

  obj_list_views = {};

  _.extend(obj_list_views, _obj.list_views || {});

  _.each(obj_list_views, function (v, k) {
    if (!_.has(v, "_id")) {
      v._id = k;
    }

    if (!_.has(v, "name")) {
      return v.name = k;
    }
  });

  _obj.list_views = obj_list_views;
  triggers = {};

  _.forEach(_obj.triggers, function (trigger, key) {
    var _trigger;

    _trigger = {};

    _.extend(_trigger, trigger);

    if (_.isFunction(_trigger.todo)) {
      _trigger.todo = _trigger.todo.toString();
    }

    delete _trigger._todo;
    return triggers[key] = _trigger;
  });

  _obj.triggers = triggers;
  actions = {};

  _.forEach(_obj.actions, function (action, key) {
    var _action;

    _action = {};

    _.extend(_action, action);

    if (_.isFunction(_action.todo)) {
      _action.todo = _action.todo.toString();
    }

    delete _action._todo;
    return actions[key] = _action;
  });

  _obj.actions = actions;
  fields = {};

  _.forEach(_obj.fields, function (field, key) {
    var _field, _fo;

    _field = {};

    _.extend(_field, field);

    if (_.isFunction(_field.options)) {
      _field.options = _field.options.toString();
      delete _field._options;
    }

    if (_.isArray(_field.options)) {
      _fo = [];

      _.forEach(_field.options, function (_o1) {
        return _fo.push(_o1.label + ":" + _o1.value);
      });

      _field.options = _fo.join(",");
      delete _field._options;
    }

    if (_field.regEx) {
      _field.regEx = _field.regEx.toString();
      delete _field._regEx;
    }

    if (_.isFunction(_field.optionsFunction)) {
      _field.optionsFunction = _field.optionsFunction.toString();
      delete _field._optionsFunction;
    }

    if (_.isFunction(_field.reference_to)) {
      _field.reference_to = _field.reference_to.toString();
      delete _field._reference_to;
    }

    if (_.isFunction(_field.createFunction)) {
      _field.createFunction = _field.createFunction.toString();
      delete _field._createFunction;
    }

    if (_.isFunction(_field.defaultValue)) {
      _field.defaultValue = _field.defaultValue.toString();
      delete _field._defaultValue;
    }

    return fields[key] = _field;
  });

  _obj.fields = fields;
  return _obj;
}; /*
   导出数据:
   {
   	apps:[{}], 软件包选中的apps
   	objects:[{}], 选中的object及其fields, list_views, triggers, actions, permission_set等
       list_views:[{}], 软件包选中的list_views
       permissions:[{}], 软件包选中的权限集
       permission_objects:[{}], 软件包选中的权限对象
       reports:[{}] 软件包选中的报表
   }
    */

APTransform["export"] = function (record) {
  var export_data;
  export_data = {};

  if (_.isArray(record.apps) && record.apps.length > 0) {
    export_data.apps = [];

    _.each(record.apps, function (appKey) {
      var app;
      app = {};

      _.extend(app, Creator.Apps[appKey]);

      if (!app || _.isEmpty(app)) {
        app = Creator.getCollection("apps").findOne({
          _id: appKey
        }, {
          fields: ignore_fields
        });
      } else {
        if (!_.has(app, "_id")) {
          app._id = appKey;
        }
      }

      if (app) {
        return export_data.apps.push(app);
      }
    });
  }

  if (_.isArray(record.objects) && record.objects.length > 0) {
    export_data.objects = [];

    _.each(record.objects, function (object_name) {
      var object;
      object = Creator.Objects[object_name];

      if (object) {
        return export_data.objects.push(APTransform.exportObject(object));
      }
    });
  }

  if (_.isArray(record.list_views) && record.list_views.length > 0) {
    export_data.list_views = Creator.getCollection("object_listviews").find({
      _id: {
        $in: record.list_views
      }
    }, {
      fields: ignore_fields
    }).fetch();
  }

  if (_.isArray(record.permission_set) && record.permission_set.length > 0) {
    export_data.permission_set = Creator.getCollection("permission_set").find({
      _id: {
        $in: record.permission_set
      }
    }, {
      fields: ignore_fields
    }).fetch();
  }

  if (_.isArray(record.permission_objects) && record.permission_objects.length > 0) {
    export_data.permission_objects = Creator.getCollection("permission_objects").find({
      _id: {
        $in: record.permission_objects
      }
    }, {
      fields: ignore_fields
    }).fetch();
  }

  if (_.isArray(record.reports) && record.reports.length > 0) {
    export_data.reports = Creator.getCollection("reports").find({
      _id: {
        $in: record.reports
      }
    }, {
      fields: ignore_fields
    }).fetch();
  }

  return export_data;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("steedos:application-package");

})();

//# sourceURL=meteor://💻app/packages/steedos_application-package.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcHBsaWNhdGlvbi1wYWNrYWdlL21vZGVscy9hcHBsaWNhdGlvbl9wYWNrYWdlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbW9kZWxzL2FwcGxpY2F0aW9uX3BhY2thZ2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwcGxpY2F0aW9uLXBhY2thZ2Uvc2VydmVyL3JvdXRlcy9leHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2V4cG9ydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBwbGljYXRpb24tcGFja2FnZS9zZXJ2ZXIvcm91dGVzL2ltcG9ydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9yb3V0ZXMvaW1wb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcHBsaWNhdGlvbi1wYWNrYWdlL3NlcnZlci9tZXRob2RzL2xpc3R2aWV3c19vcHRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvbGlzdHZpZXdzX29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwcGxpY2F0aW9uLXBhY2thZ2Uvc2VydmVyL21ldGhvZHMvaW5pdF9leHBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2luaXRfZXhwb3J0X2RhdGEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwcGxpY2F0aW9uLXBhY2thZ2UvbGliL3RyYW5zZm9ybS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi90cmFuc2Zvcm0uY29mZmVlIl0sIm5hbWVzIjpbIkNyZWF0b3IiLCJPYmplY3RzIiwiYXBwbGljYXRpb25fcGFja2FnZSIsIm5hbWUiLCJpY29uIiwibGFiZWwiLCJoaWRkZW4iLCJmaWVsZHMiLCJ0eXBlIiwiYXBwcyIsInJlZmVyZW5jZV90byIsIm11bHRpcGxlIiwib3B0aW9uc0Z1bmN0aW9uIiwiX29wdGlvbnMiLCJfIiwiZm9yRWFjaCIsIkFwcHMiLCJvIiwiayIsInB1c2giLCJ2YWx1ZSIsImljb25fc2xkcyIsIm9iamVjdHMiLCJvYmplY3RzQnlOYW1lIiwibGlzdF92aWV3cyIsIm9wdGlvbnNNZXRob2QiLCJwZXJtaXNzaW9uX3NldCIsInBlcm1pc3Npb25fb2JqZWN0cyIsInJlcG9ydHMiLCJhbGwiLCJjb2x1bW5zIiwiZmlsdGVyX3Njb3BlIiwiYWN0aW9ucyIsImluaXRfZGF0YSIsInZpc2libGUiLCJvbiIsInRvZG8iLCJvYmplY3RfbmFtZSIsInJlY29yZF9pZCIsImNvbnNvbGUiLCJsb2ciLCJNZXRlb3IiLCJjYWxsIiwiU2Vzc2lvbiIsImdldCIsImVycm9yIiwicmVzdWx0IiwidG9hc3RyIiwicmVhc29uIiwic3VjY2VzcyIsInVybCIsIlN0ZWVkb3MiLCJhYnNvbHV0ZVVybCIsIndpbmRvdyIsIm9wZW4iLCJNb2RhbCIsInNob3ciLCJKc29uUm91dGVzIiwiYWRkIiwicmVxIiwicmVzIiwibmV4dCIsImRhdGEiLCJlIiwiZmlsZU5hbWUiLCJyZWNvcmQiLCJzcGFjZV9pZCIsInNwYWNlX3VzZXIiLCJ1c2VySWQiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwic2VuZFJlc3VsdCIsImNvZGUiLCJlcnJvcnMiLCJwYXJhbXMiLCJpc1NwYWNlQWRtaW4iLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsIl9pZCIsInVzZXIiLCJzcGFjZSIsIkFQVHJhbnNmb3JtIiwiZGF0YVNvdXJjZSIsInNldEhlYWRlciIsImVuY29kZVVSSSIsImVuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzdGFjayIsIm1lc3NhZ2UiLCJ0cmFuc2Zvcm1GaWVsZE9wdGlvbnMiLCJ0cmFuc2Zvcm1GaWx0ZXJzIiwiZmlsdGVycyIsIl9maWx0ZXJzIiwiZWFjaCIsImYiLCJpc0FycmF5IiwibGVuZ3RoIiwiZmllbGQiLCJvcGVyYXRpb24iLCJvcHRpb25zIiwiaGFzIiwiam9pbiIsImltcG9ydE9iamVjdCIsIm9iamVjdCIsImxpc3Rfdmlld3NfaWRfbWFwcyIsIl9maWVsZG5hbWVzIiwiaGFzUmVjZW50VmlldyIsImludGVybmFsX2xpc3RfdmlldyIsIm9ial9saXN0X3ZpZXdzIiwidHJpZ2dlcnMiLCJwZXJtaXNzaW9ucyIsIm93bmVyIiwiaW5zZXJ0IiwibGlzdF92aWV3IiwibmV3X2lkIiwib2xkX2lkIiwiaXNSZWNlbnRWaWV3IiwiaXNBbGxWaWV3IiwiJHNldCIsIiR1bnNldCIsInVwZGF0ZSIsInJlbW92ZSIsImNvbnRhaW5zIiwiZGlyZWN0IiwidHJpZ2dlciIsInJlcGxhY2UiLCJSZWdFeHAiLCJpc19lbmFibGUiLCJhY3Rpb24iLCJpbXBvcnRfYXBwX3BhY2thZ2UiLCJpbXBfZGF0YSIsImZyb21fdGVtcGxhdGUiLCJhcHBzX2lkX21hcHMiLCJpbXBfYXBwX2lkcyIsImltcF9vYmplY3RfbmFtZXMiLCJvYmplY3RfbmFtZXMiLCJwZXJtaXNzaW9uX3NldF9pZF9tYXBzIiwicGVybWlzc2lvbl9zZXRfaWRzIiwiRXJyb3IiLCJjaGVjayIsIk9iamVjdCIsInBsdWNrIiwiYXBwIiwiaW5jbHVkZSIsImtleXMiLCJpc0xlZ2FsVmVyc2lvbiIsImlzU3RyaW5nIiwiYXNzaWduZWRfYXBwcyIsImFwcF9pZCIsInBlcm1pc3Npb25fb2JqZWN0IiwicGVybWlzc2lvbl9zZXRfaWQiLCJyZXBvcnQiLCJpc19jcmVhdG9yIiwiX2xpc3RfdmlldyIsInBlcm1pc3Npb25fc2V0X3VzZXJzIiwidXNlcnMiLCJ1c2VyX2lkIiwiZGlzYWJsZWRfbGlzdF92aWV3cyIsImxpc3Rfdmlld19pZCIsIm5ld192aWV3X2lkIiwibWV0aG9kcyIsImNvbGxlY3Rpb24iLCJuYW1lX2ZpZWxkX2tleSIsInF1ZXJ5IiwicXVlcnlfb3B0aW9ucyIsInJlY29yZHMiLCJyZWYiLCJyZWYxIiwicmVzdWx0cyIsInNlYXJjaFRleHRRdWVyeSIsInNlbGVjdGVkIiwic29ydCIsImdldE9iamVjdCIsIk5BTUVfRklFTERfS0VZIiwic2VhcmNoVGV4dCIsIiRyZWdleCIsInZhbHVlcyIsIiRvciIsIiRpbiIsImV4dGVuZCIsIiRuaW4iLCJkYiIsImZpbHRlclF1ZXJ5IiwibGltaXQiLCJpc09iamVjdCIsImZpbmQiLCJmZXRjaCIsInJlZjIiLCJpc0VtcHR5IiwiZ2V0QXBwT2JqZWN0cyIsImdldE9iamVjdHNMaXN0Vmlld3MiLCJnZXRPYmplY3RzUGVybWlzc2lvbk9iamVjdHMiLCJnZXRPYmplY3RzUGVybWlzc2lvblNldCIsImdldE9iamVjdHNSZXBvcnRzIiwiYXBwT2JqZWN0cyIsIm9iamVjdHNfbmFtZSIsIm9iamVjdHNMaXN0Vmlld3MiLCJzaGFyZWQiLCJvYmplY3RzUmVwb3J0cyIsIm9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cyIsIm9iamVjdHNQZXJtaXNzaW9uU2V0IiwiX29iamVjdHMiLCJfb2JqZWN0c19saXN0X3ZpZXdzIiwiX29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzIiwiX29iamVjdHNfcGVybWlzc2lvbl9zZXQiLCJfb2JqZWN0c19yZXBvcnRzIiwiYXBwSWQiLCJjb25jYXQiLCJ1bmlxIiwiaWdub3JlX2ZpZWxkcyIsImNyZWF0ZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWQiLCJtb2RpZmllZF9ieSIsImlzX2RlbGV0ZWQiLCJpbnN0YW5jZXMiLCJzaGFyaW5nIiwiZXhwb3J0T2JqZWN0IiwiX29iaiIsInYiLCJrZXkiLCJfdHJpZ2dlciIsImlzRnVuY3Rpb24iLCJ0b1N0cmluZyIsIl90b2RvIiwiX2FjdGlvbiIsIl9maWVsZCIsIl9mbyIsIl9vMSIsInJlZ0V4IiwiX3JlZ0V4IiwiX29wdGlvbnNGdW5jdGlvbiIsIl9yZWZlcmVuY2VfdG8iLCJjcmVhdGVGdW5jdGlvbiIsIl9jcmVhdGVGdW5jdGlvbiIsImRlZmF1bHRWYWx1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QStCLENBQXRFO0FBQ0M2SSxnQkFBWW5OLGNBQVosR0FBNkIxQixRQUFRMkUsYUFBUixDQUFzQixnQkFBdEIsRUFBd0M4RyxJQUF4QyxDQUE2QztBQUFDNUcsV0FBSztBQUFDcUcsYUFBS2pILE9BQU92QztBQUFiO0FBQU4sS0FBN0MsRUFBa0Y7QUFBQ25CLGNBQVEwTTtBQUFULEtBQWxGLEVBQTJHdkIsS0FBM0csRUFBN0I7QUMrQkM7O0FEN0JGLE1BQUc1SyxFQUFFaUYsT0FBRixDQUFVOUIsT0FBT3RDLGtCQUFqQixLQUF3Q3NDLE9BQU90QyxrQkFBUCxDQUEwQnFFLE1BQTFCLEdBQW1DLENBQTlFO0FBQ0M2SSxnQkFBWWxOLGtCQUFaLEdBQWlDM0IsUUFBUTJFLGFBQVIsQ0FBc0Isb0JBQXRCLEVBQTRDOEcsSUFBNUMsQ0FBaUQ7QUFBQzVHLFdBQUs7QUFBQ3FHLGFBQUtqSCxPQUFPdEM7QUFBYjtBQUFOLEtBQWpELEVBQTBGO0FBQUNwQixjQUFRME07QUFBVCxLQUExRixFQUFtSHZCLEtBQW5ILEVBQWpDO0FDcUNDOztBRG5DRixNQUFHNUssRUFBRWlGLE9BQUYsQ0FBVTlCLE9BQU9yQyxPQUFqQixLQUE2QnFDLE9BQU9yQyxPQUFQLENBQWVvRSxNQUFmLEdBQXdCLENBQXhEO0FBQ0M2SSxnQkFBWWpOLE9BQVosR0FBc0I1QixRQUFRMkUsYUFBUixDQUFzQixTQUF0QixFQUFpQzhHLElBQWpDLENBQXNDO0FBQUM1RyxXQUFLO0FBQUNxRyxhQUFLakgsT0FBT3JDO0FBQWI7QUFBTixLQUF0QyxFQUFvRTtBQUFDckIsY0FBUTBNO0FBQVQsS0FBcEUsRUFBNkZ2QixLQUE3RixFQUF0QjtBQzJDQzs7QUR6Q0YsU0FBT21ELFdBQVA7QUFuQ29CLENBQXJCLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYXBwbGljYXRpb24tcGFja2FnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIkNyZWF0b3IuT2JqZWN0cy5hcHBsaWNhdGlvbl9wYWNrYWdlID1cblx0bmFtZTogXCJhcHBsaWNhdGlvbl9wYWNrYWdlXCJcblx0aWNvbjogXCJjdXN0b20uY3VzdG9tNDJcIlxuXHRsYWJlbDogXCLova/ku7bljIVcIlxuXHRoaWRkZW46IHRydWVcblx0ZmllbGRzOlxuXHRcdG5hbWU6XG5cdFx0XHR0eXBlOiBcInRleHRcIlxuXHRcdFx0bGFiZWw6IFwi5ZCN56ewXCJcblx0XHRhcHBzOlxuXHRcdFx0dHlwZTogXCJsb29rdXBcIlxuXHRcdFx0bGFiZWw6IFwi5bqU55SoXCJcblx0XHRcdHR5cGU6IFwibG9va3VwXCJcblx0XHRcdHJlZmVyZW5jZV90bzogXCJhcHBzXCJcblx0XHRcdG11bHRpcGxlOiB0cnVlXG5cdFx0XHRvcHRpb25zRnVuY3Rpb246ICgpLT5cblx0XHRcdFx0X29wdGlvbnMgPSBbXVxuXHRcdFx0XHRfLmZvckVhY2ggQ3JlYXRvci5BcHBzLCAobywgayktPlxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBvLm5hbWUsIHZhbHVlOiBrLCBpY29uOiBvLmljb25fc2xkc31cblx0XHRcdFx0cmV0dXJuIF9vcHRpb25zXG5cdFx0b2JqZWN0czpcblx0XHRcdHR5cGU6IFwibG9va3VwXCJcblx0XHRcdGxhYmVsOiBcIuWvueixoVwiXG5cdFx0XHRyZWZlcmVuY2VfdG86IFwib2JqZWN0c1wiXG5cdFx0XHRtdWx0aXBsZTogdHJ1ZVxuXHRcdFx0b3B0aW9uc0Z1bmN0aW9uOiAoKS0+XG5cdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0Xy5mb3JFYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG8sIGspLT5cblx0XHRcdFx0XHRpZiAhby5oaWRkZW5cblx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2ggeyBsYWJlbDogby5sYWJlbCwgdmFsdWU6IGssIGljb246IG8uaWNvbiB9XG5cdFx0XHRcdHJldHVybiBfb3B0aW9uc1xuXG5cdFx0bGlzdF92aWV3czpcblx0XHRcdHR5cGU6IFwibG9va3VwXCJcblx0XHRcdGxhYmVsOiBcIuWIl+ihqOinhuWbvlwiXG5cdFx0XHRtdWx0aXBsZTogdHJ1ZVxuXHRcdFx0cmVmZXJlbmNlX3RvOiBcIm9iamVjdF9saXN0dmlld3NcIlxuXHRcdFx0b3B0aW9uc01ldGhvZDogXCJjcmVhdG9yLmxpc3R2aWV3c19vcHRpb25zXCJcblx0XHRwZXJtaXNzaW9uX3NldDpcblx0XHRcdHR5cGU6IFwibG9va3VwXCJcblx0XHRcdGxhYmVsOiBcIuadg+mZkOmbhlwiXG5cdFx0XHRtdWx0aXBsZTogdHJ1ZVxuXHRcdFx0cmVmZXJlbmNlX3RvOiBcInBlcm1pc3Npb25fc2V0XCJcblx0XHRwZXJtaXNzaW9uX29iamVjdHM6XG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXG5cdFx0XHRsYWJlbDogXCLmnYPpmZDpm4ZcIlxuXHRcdFx0bXVsdGlwbGU6IHRydWVcblx0XHRcdHJlZmVyZW5jZV90bzogXCJwZXJtaXNzaW9uX29iamVjdHNcIlxuXHRcdHJlcG9ydHM6XG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXG5cdFx0XHRsYWJlbDogXCLmiqXooahcIlxuXHRcdFx0bXVsdGlwbGU6IHRydWVcblx0XHRcdHJlZmVyZW5jZV90bzogXCJyZXBvcnRzXCJcblx0bGlzdF92aWV3czpcblx0XHRhbGw6XG5cdFx0XHRsYWJlbDogXCLmiYDmnIlcIlxuXHRcdFx0Y29sdW1uczogW1wibmFtZVwiXVxuXHRcdFx0ZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcblx0YWN0aW9uczpcblx0XHRpbml0X2RhdGE6XG5cdFx0XHRsYWJlbDogXCLliJ3lp4vljJZcIlxuXHRcdFx0dmlzaWJsZTogdHJ1ZVxuXHRcdFx0b246IFwicmVjb3JkXCJcblx0XHRcdHRvZG86IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cblx0XHRcdFx0Y29uc29sZS5sb2cob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKVxuXHRcdFx0XHRNZXRlb3IuY2FsbCBcImFwcFBhY2thZ2UuaW5pdF9leHBvcnRfZGF0YVwiLCBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksIHJlY29yZF9pZCwoZXJyb3IsIHJlc3VsdCktPlxuXHRcdFx0XHRcdGlmIGVycm9yXG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoZXJyb3IucmVhc29uKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzKFwi5Yid5aeL5YyW5a6M5oiQXCIpXG5cdFx0ZXhwb3J0OlxuXHRcdFx0bGFiZWw6IFwi5a+85Ye6XCJcblx0XHRcdHZpc2libGU6IHRydWVcblx0XHRcdG9uOiBcInJlY29yZFwiXG5cdFx0XHR0b2RvOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwi5a+85Ye6I3tvYmplY3RfbmFtZX0tPiN7cmVjb3JkX2lkfVwiKVxuXHRcdFx0XHR1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsIFwiL2FwaS9jcmVhdG9yL2FwcF9wYWNrYWdlL2V4cG9ydC8je1Nlc3Npb24uZ2V0KFwic3BhY2VJZFwiKX0vI3tyZWNvcmRfaWR9XCJcblx0XHRcdFx0d2luZG93Lm9wZW4odXJsKVxuI1x0XHRcdFx0JC5hamF4XG4jXHRcdFx0XHRcdHR5cGU6IFwicG9zdFwiXG4jXHRcdFx0XHRcdHVybDogdXJsXG4jXHRcdFx0XHRcdGRhdGFUeXBlOiBcImpzb25cIlxuI1x0XHRcdFx0XHRiZWZvcmVTZW5kOiAocmVxdWVzdCkgLT5cbiNcdFx0XHRcdFx0XHRyZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ1gtVXNlci1JZCcsIE1ldGVvci51c2VySWQoKSlcbiNcdFx0XHRcdFx0XHRyZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ1gtQXV0aC1Ub2tlbicsIEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCkpXG4jXHRcdFx0XHRcdGVycm9yOiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSAtPlxuI1x0XHRcdFx0XHRcdGVycm9yID0ganFYSFIucmVzcG9uc2VKU09OXG4jXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlcnJvclxuI1x0XHRcdFx0XHRcdGlmIGVycm9yPy5yZWFzb25cbiNcdFx0XHRcdFx0XHRcdHRvYXN0cj8uZXJyb3I/KFRBUGkxOG4uX18oZXJyb3IucmVhc29uKSlcbiNcdFx0XHRcdFx0XHRlbHNlIGlmIGVycm9yPy5tZXNzYWdlXG4jXHRcdFx0XHRcdFx0XHR0b2FzdHI/LmVycm9yPyhUQVBpMThuLl9fKGVycm9yLm1lc3NhZ2UpKVxuI1x0XHRcdFx0XHRcdGVsc2VcbiNcdFx0XHRcdFx0XHRcdHRvYXN0cj8uZXJyb3I/KGVycm9yKVxuI1x0XHRcdFx0XHRzdWNjZXNzOiAocmVzdWx0KSAtPlxuI1x0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwicmVzdWx0Li4uLi4uLi4uLi4uLi4uLi4uLiN7cmVzdWx0fVwiKVxuXG5cdFx0aW1wb3J0OlxuXHRcdFx0bGFiZWw6IFwi5a+85YWlXCJcblx0XHRcdHZpc2libGU6IHRydWVcblx0XHRcdG9uOiBcImxpc3RcIlxuXHRcdFx0dG9kbzogKG9iamVjdF9uYW1lKS0+XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwib2JqZWN0X25hbWVcIiwgb2JqZWN0X25hbWUpXG5cdFx0XHRcdE1vZGFsLnNob3coXCJBUFBhY2thZ2VJbXBvcnRNb2RhbFwiKVxuIiwiQ3JlYXRvci5PYmplY3RzLmFwcGxpY2F0aW9uX3BhY2thZ2UgPSB7XG4gIG5hbWU6IFwiYXBwbGljYXRpb25fcGFja2FnZVwiLFxuICBpY29uOiBcImN1c3RvbS5jdXN0b200MlwiLFxuICBsYWJlbDogXCLova/ku7bljIVcIixcbiAgaGlkZGVuOiB0cnVlLFxuICBmaWVsZHM6IHtcbiAgICBuYW1lOiB7XG4gICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgIGxhYmVsOiBcIuWQjeensFwiXG4gICAgfSxcbiAgICBhcHBzOiB7XG4gICAgICB0eXBlOiBcImxvb2t1cFwiLFxuICAgICAgbGFiZWw6IFwi5bqU55SoXCIsXG4gICAgICB0eXBlOiBcImxvb2t1cFwiLFxuICAgICAgcmVmZXJlbmNlX3RvOiBcImFwcHNcIixcbiAgICAgIG11bHRpcGxlOiB0cnVlLFxuICAgICAgb3B0aW9uc0Z1bmN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9vcHRpb25zO1xuICAgICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goQ3JlYXRvci5BcHBzLCBmdW5jdGlvbihvLCBrKSB7XG4gICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgbGFiZWw6IG8ubmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgICAgaWNvbjogby5pY29uX3NsZHNcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucztcbiAgICAgIH1cbiAgICB9LFxuICAgIG9iamVjdHM6IHtcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICBsYWJlbDogXCLlr7nosaFcIixcbiAgICAgIHJlZmVyZW5jZV90bzogXCJvYmplY3RzXCIsXG4gICAgICBtdWx0aXBsZTogdHJ1ZSxcbiAgICAgIG9wdGlvbnNGdW5jdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfb3B0aW9ucztcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgZnVuY3Rpb24obywgaykge1xuICAgICAgICAgIGlmICghby5oaWRkZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgbGFiZWw6IG8ubGFiZWwsXG4gICAgICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgICAgICBpY29uOiBvLmljb25cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucztcbiAgICAgIH1cbiAgICB9LFxuICAgIGxpc3Rfdmlld3M6IHtcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICBsYWJlbDogXCLliJfooajop4blm75cIixcbiAgICAgIG11bHRpcGxlOiB0cnVlLFxuICAgICAgcmVmZXJlbmNlX3RvOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgIG9wdGlvbnNNZXRob2Q6IFwiY3JlYXRvci5saXN0dmlld3Nfb3B0aW9uc1wiXG4gICAgfSxcbiAgICBwZXJtaXNzaW9uX3NldDoge1xuICAgICAgdHlwZTogXCJsb29rdXBcIixcbiAgICAgIGxhYmVsOiBcIuadg+mZkOmbhlwiLFxuICAgICAgbXVsdGlwbGU6IHRydWUsXG4gICAgICByZWZlcmVuY2VfdG86IFwicGVybWlzc2lvbl9zZXRcIlxuICAgIH0sXG4gICAgcGVybWlzc2lvbl9vYmplY3RzOiB7XG4gICAgICB0eXBlOiBcImxvb2t1cFwiLFxuICAgICAgbGFiZWw6IFwi5p2D6ZmQ6ZuGXCIsXG4gICAgICBtdWx0aXBsZTogdHJ1ZSxcbiAgICAgIHJlZmVyZW5jZV90bzogXCJwZXJtaXNzaW9uX29iamVjdHNcIlxuICAgIH0sXG4gICAgcmVwb3J0czoge1xuICAgICAgdHlwZTogXCJsb29rdXBcIixcbiAgICAgIGxhYmVsOiBcIuaKpeihqFwiLFxuICAgICAgbXVsdGlwbGU6IHRydWUsXG4gICAgICByZWZlcmVuY2VfdG86IFwicmVwb3J0c1wiXG4gICAgfVxuICB9LFxuICBsaXN0X3ZpZXdzOiB7XG4gICAgYWxsOiB7XG4gICAgICBsYWJlbDogXCLmiYDmnIlcIixcbiAgICAgIGNvbHVtbnM6IFtcIm5hbWVcIl0sXG4gICAgICBmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxuICAgIH1cbiAgfSxcbiAgYWN0aW9uczoge1xuICAgIGluaXRfZGF0YToge1xuICAgICAgbGFiZWw6IFwi5Yid5aeL5YyWXCIsXG4gICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgb246IFwicmVjb3JkXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpIHtcbiAgICAgICAgY29uc29sZS5sb2cob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKTtcbiAgICAgICAgcmV0dXJuIE1ldGVvci5jYWxsKFwiYXBwUGFja2FnZS5pbml0X2V4cG9ydF9kYXRhXCIsIFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSwgcmVjb3JkX2lkLCBmdW5jdGlvbihlcnJvciwgcmVzdWx0KSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gdG9hc3RyLmVycm9yKGVycm9yLnJlYXNvbik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0b2FzdHIuc3VjY2VzcyhcIuWIneWni+WMluWujOaIkFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJleHBvcnRcIjoge1xuICAgICAgbGFiZWw6IFwi5a+85Ye6XCIsXG4gICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgb246IFwicmVjb3JkXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpIHtcbiAgICAgICAgdmFyIHVybDtcbiAgICAgICAgY29uc29sZS5sb2coXCLlr7zlh7pcIiArIG9iamVjdF9uYW1lICsgXCItPlwiICsgcmVjb3JkX2lkKTtcbiAgICAgICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcGkvY3JlYXRvci9hcHBfcGFja2FnZS9leHBvcnQvXCIgKyAoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSArIFwiL1wiICsgcmVjb3JkX2lkKTtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5vcGVuKHVybCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcImltcG9ydFwiOiB7XG4gICAgICBsYWJlbDogXCLlr7zlhaVcIixcbiAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICBvbjogXCJsaXN0XCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIm9iamVjdF9uYW1lXCIsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgcmV0dXJuIE1vZGFsLnNob3coXCJBUFBhY2thZ2VJbXBvcnRNb2RhbFwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iLCJKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvY3JlYXRvci9hcHBfcGFja2FnZS9leHBvcnQvOnNwYWNlX2lkLzpyZWNvcmRfaWQnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdHRyeVxuXG5cdFx0dXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcblxuXHRcdGlmICF1c2VySWRcblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdFx0Y29kZTogNDAxXG5cdFx0XHRcdGRhdGE6IHtlcnJvcnM6IFwiQXV0aGVudGljYXRpb24gaXMgcmVxdWlyZWQgYW5kIGhhcyBub3QgYmVlbiBwcm92aWRlZC5cIn1cblx0XHRcdH1cblx0XHRcdHJldHVyblxuXG5cdFx0cmVjb3JkX2lkID0gcmVxLnBhcmFtcy5yZWNvcmRfaWRcblx0XHRzcGFjZV9pZCA9IHJlcS5wYXJhbXMuc3BhY2VfaWRcblxuXHRcdGlmICFDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgdXNlcklkKVxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0XHRjb2RlOiA0MDFcblx0XHRcdFx0ZGF0YToge2Vycm9yczogXCJQZXJtaXNzaW9uIGRlbmllZFwifVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuXG5cblx0XHRyZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBsaWNhdGlvbl9wYWNrYWdlXCIpLmZpbmRPbmUoe19pZDogcmVjb3JkX2lkfSlcblxuXHRcdGlmICFyZWNvcmRcblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdFx0Y29kZTogNDA0XG5cdFx0XHRcdGRhdGE6IHtlcnJvcnM6IFwiQ29sbGVjdGlvbiBub3QgZm91bmQgZm9yIHRoZSBzZWdtZW50ICN7cmVjb3JkX2lkfVwifVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuXG5cblx0XHRzcGFjZV91c2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7dXNlcjogdXNlcklkLCBzcGFjZTogcmVjb3JkLnNwYWNlfSlcblxuXHRcdGlmICFzcGFjZV91c2VyXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRcdGNvZGU6IDQwMVxuXHRcdFx0XHRkYXRhOiB7ZXJyb3JzOiBcIlVzZXIgZG9lcyBub3QgaGF2ZSBwcml2aWxlZ2VzIHRvIGFjY2VzcyB0aGUgZW50aXR5XCJ9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm5cblxuXHRcdGRhdGEgPSBBUFRyYW5zZm9ybS5leHBvcnQgcmVjb3JkXG5cblx0XHRkYXRhLmRhdGFTb3VyY2UgPSBNZXRlb3IuYWJzb2x1dGVVcmwoXCJhcGkvY3JlYXRvci9hcHBfcGFja2FnZS9leHBvcnQvI3tzcGFjZV9pZH0vI3tyZWNvcmRfaWR9XCIpXG5cblx0XHRmaWxlTmFtZSA9IHJlY29yZC5uYW1lIHx8IFwiYXBwbGljYXRpb25fcGFja2FnZVwiXG5cblx0XHRyZXMuc2V0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC1tc2Rvd25sb2FkJyk7XG5cdFx0cmVzLnNldEhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicsICdhdHRhY2htZW50O2ZpbGVuYW1lPScrZW5jb2RlVVJJKGZpbGVOYW1lKSsnLmpzb24nKTtcblx0XHRyZXMuZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsIDQpKVxuXHRjYXRjaCBlXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGVycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlIH1cblx0XHR9XG5cbiIsIkpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS9jcmVhdG9yL2FwcF9wYWNrYWdlL2V4cG9ydC86c3BhY2VfaWQvOnJlY29yZF9pZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBkYXRhLCBlLCBmaWxlTmFtZSwgcmVjb3JkLCByZWNvcmRfaWQsIHNwYWNlX2lkLCBzcGFjZV91c2VyLCB1c2VySWQ7XG4gIHRyeSB7XG4gICAgdXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBlcnJvcnM6IFwiQXV0aGVudGljYXRpb24gaXMgcmVxdWlyZWQgYW5kIGhhcyBub3QgYmVlbiBwcm92aWRlZC5cIlxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVjb3JkX2lkID0gcmVxLnBhcmFtcy5yZWNvcmRfaWQ7XG4gICAgc3BhY2VfaWQgPSByZXEucGFyYW1zLnNwYWNlX2lkO1xuICAgIGlmICghQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIHVzZXJJZCkpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXJyb3JzOiBcIlBlcm1pc3Npb24gZGVuaWVkXCJcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImFwcGxpY2F0aW9uX3BhY2thZ2VcIikuZmluZE9uZSh7XG4gICAgICBfaWQ6IHJlY29yZF9pZFxuICAgIH0pO1xuICAgIGlmICghcmVjb3JkKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwNCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGVycm9yczogXCJDb2xsZWN0aW9uIG5vdCBmb3VuZCBmb3IgdGhlIHNlZ21lbnQgXCIgKyByZWNvcmRfaWRcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNwYWNlX3VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiByZWNvcmQuc3BhY2VcbiAgICB9KTtcbiAgICBpZiAoIXNwYWNlX3VzZXIpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXJyb3JzOiBcIlVzZXIgZG9lcyBub3QgaGF2ZSBwcml2aWxlZ2VzIHRvIGFjY2VzcyB0aGUgZW50aXR5XCJcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRhdGEgPSBBUFRyYW5zZm9ybVtcImV4cG9ydFwiXShyZWNvcmQpO1xuICAgIGRhdGEuZGF0YVNvdXJjZSA9IE1ldGVvci5hYnNvbHV0ZVVybChcImFwaS9jcmVhdG9yL2FwcF9wYWNrYWdlL2V4cG9ydC9cIiArIHNwYWNlX2lkICsgXCIvXCIgKyByZWNvcmRfaWQpO1xuICAgIGZpbGVOYW1lID0gcmVjb3JkLm5hbWUgfHwgXCJhcHBsaWNhdGlvbl9wYWNrYWdlXCI7XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtbXNkb3dubG9hZCcpO1xuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnYXR0YWNobWVudDtmaWxlbmFtZT0nICsgZW5jb2RlVVJJKGZpbGVOYW1lKSArICcuanNvbicpO1xuICAgIHJldHVybiByZXMuZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsIDQpKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsInRyYW5zZm9ybUZpbHRlcnMgPSAoZmlsdGVycyktPlxuXHRfZmlsdGVycyA9IFtdXG5cdF8uZWFjaCBmaWx0ZXJzLCAoZiktPlxuXHRcdGlmIF8uaXNBcnJheShmKSAmJiBmLmxlbmd0aCA9PSAzXG5cdFx0XHRfZmlsdGVycy5wdXNoIHtmaWVsZDogZlswXSwgb3BlcmF0aW9uOiBmWzFdLCB2YWx1ZTogZlsyXX1cblx0XHRlbHNlXG5cdFx0XHRfZmlsdGVycy5wdXNoIGZcblx0cmV0dXJuIF9maWx0ZXJzXG5cbnRyYW5zZm9ybUZpZWxkT3B0aW9ucyA9IChvcHRpb25zKS0+XG5cdGlmICFfLmlzQXJyYXkob3B0aW9ucylcblx0XHRyZXR1cm4gb3B0aW9uc1xuXG5cdF9vcHRpb25zID0gW11cblxuXHRfLmVhY2ggb3B0aW9ucywgKG8pLT5cblx0XHRpZiBvICYmIF8uaGFzKG8sICdsYWJlbCcpICYmIF8uaGFzKG8sICd2YWx1ZScpXG5cdFx0XHRfb3B0aW9ucy5wdXNoIFwiI3tvLmxhYmVsfToje28udmFsdWV9XCJcblxuXHRyZXR1cm4gX29wdGlvbnMuam9pbignLCcpXG5cblxuQ3JlYXRvci5pbXBvcnRPYmplY3QgPSAodXNlcklkLCBzcGFjZV9pZCwgb2JqZWN0LCBsaXN0X3ZpZXdzX2lkX21hcHMpIC0+XG5cdGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS1pbXBvcnRPYmplY3QtLS0tLS0tLS0tLS0tLS0tLS0nLCBvYmplY3QubmFtZSlcblx0ZmllbGRzID0gb2JqZWN0LmZpZWxkc1xuXHR0cmlnZ2VycyA9IG9iamVjdC50cmlnZ2Vyc1xuXHRhY3Rpb25zID0gb2JqZWN0LmFjdGlvbnNcblx0b2JqX2xpc3Rfdmlld3MgPSBvYmplY3QubGlzdF92aWV3c1xuXG5cdGRlbGV0ZSBvYmplY3QuX2lkXG5cdGRlbGV0ZSBvYmplY3QuZmllbGRzXG5cdGRlbGV0ZSBvYmplY3QudHJpZ2dlcnNcblx0ZGVsZXRlIG9iamVjdC5hY3Rpb25zXG5cdGRlbGV0ZSBvYmplY3QucGVybWlzc2lvbnMgI+WIoOmZpHBlcm1pc3Npb25z5Yqo5oCB5bGe5oCnXG5cdGRlbGV0ZSBvYmplY3QubGlzdF92aWV3c1xuXG5cdG9iamVjdC5zcGFjZSA9IHNwYWNlX2lkXG5cdG9iamVjdC5vd25lciA9IHVzZXJJZFxuXG5cdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikuaW5zZXJ0KG9iamVjdClcblxuXHQjIDIuMSDmjIHkuYXljJblr7nosaFsaXN0X3ZpZXdzXG5cdGludGVybmFsX2xpc3RfdmlldyA9IHt9XG5cblx0aGFzUmVjZW50VmlldyA9IGZhbHNlXG5cdGNvbnNvbGUubG9nKCfmjIHkuYXljJblr7nosaFsaXN0X3ZpZXdzJyk7XG5cdF8uZWFjaCBvYmpfbGlzdF92aWV3cywgKGxpc3RfdmlldyktPlxuXHRcdG9sZF9pZCA9IGxpc3Rfdmlldy5faWRcblx0XHRkZWxldGUgbGlzdF92aWV3Ll9pZFxuXHRcdGxpc3Rfdmlldy5zcGFjZSA9IHNwYWNlX2lkXG5cdFx0bGlzdF92aWV3Lm93bmVyID0gdXNlcklkXG5cdFx0bGlzdF92aWV3Lm9iamVjdF9uYW1lID0gb2JqZWN0Lm5hbWVcblx0XHRpZiBDcmVhdG9yLmlzUmVjZW50VmlldyhsaXN0X3ZpZXcpXG5cdFx0XHRoYXNSZWNlbnRWaWV3ID0gdHJ1ZVxuXG5cdFx0aWYgbGlzdF92aWV3LmZpbHRlcnNcblx0XHRcdGxpc3Rfdmlldy5maWx0ZXJzID0gdHJhbnNmb3JtRmlsdGVycyhsaXN0X3ZpZXcuZmlsdGVycylcblxuXHRcdGlmIENyZWF0b3IuaXNBbGxWaWV3KGxpc3RfdmlldykgfHwgQ3JlYXRvci5pc1JlY2VudFZpZXcobGlzdF92aWV3KVxuXHQjIOWIm+W7um9iamVjdOaXtu+8jOS8muiHquWKqOa3u+WKoGFsbCB2aWV344CBcmVjZW50IHZpZXdcblxuXHRcdFx0b3B0aW9ucyA9IHskc2V0OiBsaXN0X3ZpZXd9XG5cblx0XHRcdGlmICFsaXN0X3ZpZXcuY29sdW1uc1xuXHRcdFx0XHRvcHRpb25zLiR1bnNldCA9IHtjb2x1bW5zOiAnJ31cblxuXHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS51cGRhdGUoe29iamVjdF9uYW1lOiBvYmplY3QubmFtZSwgbmFtZTogbGlzdF92aWV3Lm5hbWUsIHNwYWNlOiBzcGFjZV9pZH0sIG9wdGlvbnMpXG5cdFx0ZWxzZVxuXHRcdFx0bmV3X2lkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5pbnNlcnQobGlzdF92aWV3KVxuXHRcdFx0bGlzdF92aWV3c19pZF9tYXBzW29iamVjdC5uYW1lICsgXCJfXCIgKyBvbGRfaWRdID0gbmV3X2lkXG5cblx0aWYgIWhhc1JlY2VudFZpZXdcblx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLnJlbW92ZSh7bmFtZTogXCJyZWNlbnRcIiwgc3BhY2U6IHNwYWNlX2lkLCBvYmplY3RfbmFtZTogb2JqZWN0Lm5hbWUsIG93bmVyOiB1c2VySWR9KVxuXHRjb25zb2xlLmxvZygn5oyB5LmF5YyW5a+56LGh5a2X5q61Jyk7XG5cdCMgMi4yIOaMgeS5heWMluWvueixoeWtl+autVxuXG5cdF9maWVsZG5hbWVzID0gW11cblxuXHRfLmVhY2ggZmllbGRzLCAoZmllbGQsIGspLT5cblx0XHRkZWxldGUgZmllbGQuX2lkXG5cdFx0ZmllbGQuc3BhY2UgPSBzcGFjZV9pZFxuXHRcdGZpZWxkLm93bmVyID0gdXNlcklkXG5cdFx0ZmllbGQub2JqZWN0ID0gb2JqZWN0Lm5hbWVcblxuXHRcdGlmIGZpZWxkLm9wdGlvbnNcblx0XHRcdGZpZWxkLm9wdGlvbnMgPSB0cmFuc2Zvcm1GaWVsZE9wdGlvbnMoZmllbGQub3B0aW9ucylcblxuXHRcdGlmICFfLmhhcyhmaWVsZCwgXCJuYW1lXCIpXG5cdFx0XHRmaWVsZC5uYW1lID0ga1xuXG5cdFx0X2ZpZWxkbmFtZXMucHVzaCBmaWVsZC5uYW1lXG5cblx0XHRpZiBmaWVsZC5uYW1lID09IFwibmFtZVwiXG5cdFx0XHQjIOWIm+W7um9iamVjdOaXtu+8jOS8muiHquWKqOa3u+WKoG5hbWXlrZfmrrXvvIzlm6DmraTlnKjmraTlpITlr7luYW1l5a2X5q616L+b6KGM5pu05pawXG5cdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfZmllbGRzXCIpLnVwZGF0ZSh7b2JqZWN0OiBvYmplY3QubmFtZSwgbmFtZTogXCJuYW1lXCIsIHNwYWNlOiBzcGFjZV9pZH0sIHskc2V0OiBmaWVsZH0pXG5cdFx0ZWxzZVxuXHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS5pbnNlcnQoZmllbGQpXG5cblx0XHRpZiAhXy5jb250YWlucyhfZmllbGRuYW1lcywgJ25hbWUnKVxuXHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS5kaXJlY3QucmVtb3ZlKHtvYmplY3Q6IG9iamVjdC5uYW1lLCBuYW1lOiBcIm5hbWVcIiwgc3BhY2U6IHNwYWNlX2lkfSlcblxuXHRjb25zb2xlLmxvZygn5oyB5LmF5YyW6Kem5Y+R5ZmoJyk7XG5cdCMgMi4zIOaMgeS5heWMluinpuWPkeWZqFxuXHRfLmVhY2ggdHJpZ2dlcnMsICh0cmlnZ2VyLCBrKS0+XG5cdFx0ZGVsZXRlIHRyaWdnZXJzLl9pZFxuXHRcdHRyaWdnZXIuc3BhY2UgPSBzcGFjZV9pZFxuXHRcdHRyaWdnZXIub3duZXIgPSB1c2VySWRcblx0XHR0cmlnZ2VyLm9iamVjdCA9IG9iamVjdC5uYW1lXG5cdFx0aWYgIV8uaGFzKHRyaWdnZXIsIFwibmFtZVwiKVxuXHRcdFx0dHJpZ2dlci5uYW1lID0gay5yZXBsYWNlKG5ldyBSZWdFeHAoXCJcXFxcLlwiLCBcImdcIiksIFwiX1wiKVxuXG5cdFx0aWYgIV8uaGFzKHRyaWdnZXIsIFwiaXNfZW5hYmxlXCIpXG5cdFx0XHR0cmlnZ2VyLmlzX2VuYWJsZSA9IHRydWVcblxuXHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF90cmlnZ2Vyc1wiKS5pbnNlcnQodHJpZ2dlcilcblx0Y29uc29sZS5sb2coJ+aMgeS5heWMluaTjeS9nCcpO1xuXHQjIDIuNCDmjIHkuYXljJbmk43kvZxcblx0Xy5lYWNoIGFjdGlvbnMsIChhY3Rpb24sIGspLT5cblx0XHRkZWxldGUgYWN0aW9uLl9pZFxuXHRcdGFjdGlvbi5zcGFjZSA9IHNwYWNlX2lkXG5cdFx0YWN0aW9uLm93bmVyID0gdXNlcklkXG5cdFx0YWN0aW9uLm9iamVjdCA9IG9iamVjdC5uYW1lXG5cdFx0aWYgIV8uaGFzKGFjdGlvbiwgXCJuYW1lXCIpXG5cdFx0XHRhY3Rpb24ubmFtZSA9IGsucmVwbGFjZShuZXcgUmVnRXhwKFwiXFxcXC5cIiwgXCJnXCIpLCBcIl9cIilcblx0XHRpZiAhXy5oYXMoYWN0aW9uLCBcImlzX2VuYWJsZVwiKVxuXHRcdFx0YWN0aW9uLmlzX2VuYWJsZSA9IHRydWVcblx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfYWN0aW9uc1wiKS5pbnNlcnQoYWN0aW9uKVxuXG5cdGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS1pbXBvcnRPYmplY3QgZW5kLS0tLS0tLS0tLS0tLS0tLS0tJywgb2JqZWN0Lm5hbWUpXG5cbkNyZWF0b3IuaW1wb3J0X2FwcF9wYWNrYWdlID0gKHVzZXJJZCwgc3BhY2VfaWQsIGltcF9kYXRhLCBmcm9tX3RlbXBsYXRlKS0+XG5cdGlmICF1c2VySWRcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNDAxXCIsIFwiQXV0aGVudGljYXRpb24gaXMgcmVxdWlyZWQgYW5kIGhhcyBub3QgYmVlbiBwcm92aWRlZC5cIilcblxuXHRpZiAhQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIHVzZXJJZClcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNDAxXCIsIFwiUGVybWlzc2lvbiBkZW5pZWQuXCIpXG5cblx0IyMj5pWw5o2u5qCh6aqMIOW8gOWniyMjI1xuXHRjaGVjayhpbXBfZGF0YSwgT2JqZWN0KVxuXHRpZiAhZnJvbV90ZW1wbGF0ZVxuXHRcdCMgMSBhcHBz5qCh6aqM77ya5qC55o2uX2lk5Yik5pat5bqU55So5piv5ZCm5bey5a2Y5ZyoXG5cdFx0aW1wX2FwcF9pZHMgPSBfLnBsdWNrKGltcF9kYXRhLmFwcHMsIFwiX2lkXCIpXG5cdFx0aWYgXy5pc0FycmF5KGltcF9kYXRhLmFwcHMpICYmIGltcF9kYXRhLmFwcHMubGVuZ3RoID4gMFxuXHRcdFx0Xy5lYWNoIGltcF9kYXRhLmFwcHMsIChhcHApLT5cblx0XHRcdFx0aWYgXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLkFwcHMpLCBhcHAuX2lkKVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLlupTnlKgnI3thcHAubmFtZX0n5bey5a2Y5ZyoXCIpXG5cblx0XHQjIDIgb2JqZWN0c+agoemqjO+8muagueaNrm9iamVjdC5uYW1l5Yik5pat5a+56LGh5piv5ZCm5bey5a2Y5ZyoOyDmoKHpqox0cmlnZ2Vyc1xuXHRcdGlmIF8uaXNBcnJheShpbXBfZGF0YS5vYmplY3RzKSAmJiBpbXBfZGF0YS5vYmplY3RzLmxlbmd0aCA+IDBcblx0XHRcdF8uZWFjaCBpbXBfZGF0YS5vYmplY3RzLCAob2JqZWN0KS0+XG5cdFx0XHRcdGlmIF8uaW5jbHVkZShfLmtleXMoQ3JlYXRvci5PYmplY3RzKSwgb2JqZWN0Lm5hbWUpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuWvueixoScje29iamVjdC5uYW1lfSflt7LlrZjlnKhcIilcblx0XHRcdFx0Xy5lYWNoIG9iamVjdC50cmlnZ2VycywgKHRyaWdnZXIpLT5cblx0XHRcdFx0XHRpZiB0cmlnZ2VyLm9uID09ICdzZXJ2ZXInICYmICFTdGVlZG9zLmlzTGVnYWxWZXJzaW9uKHNwYWNlX2lkLFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiKVxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5Y+q5pyJ5LyB5Lia54mI5pSv5oyB6YWN572u5pyN5Yqh56uv55qE6Kem5Y+R5ZmoXCJcblxuXHRcdGltcF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKGltcF9kYXRhLm9iamVjdHMsIFwibmFtZVwiKVxuXHRcdG9iamVjdF9uYW1lcyA9IF8ua2V5cyhDcmVhdG9yLk9iamVjdHMpXG5cblx0XHQjIDMg5Yik5patYXBwc+eahOWvueixoeaYr+WQpumDveWtmOWcqFxuXHRcdGlmIF8uaXNBcnJheShpbXBfZGF0YS5hcHBzKSAmJiBpbXBfZGF0YS5hcHBzLmxlbmd0aCA+IDBcblx0XHRcdF8uZWFjaCBpbXBfZGF0YS5hcHBzLCAoYXBwKS0+XG5cdFx0XHRcdF8uZWFjaCBhcHAub2JqZWN0cywgKG9iamVjdF9uYW1lKS0+XG5cdFx0XHRcdFx0aWYgIV8uaW5jbHVkZShvYmplY3RfbmFtZXMsIG9iamVjdF9uYW1lKSAmJiAhXy5pbmNsdWRlKGltcF9vYmplY3RfbmFtZXMsIG9iamVjdF9uYW1lKVxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuW6lOeUqCcje2FwcC5uYW1lfSfkuK3mjIflrprnmoTlr7nosaEnI3tvYmplY3RfbmFtZX0n5LiN5a2Y5ZyoXCIpXG5cblx0XHQjIDQgbGlzdF92aWV3c+agoemqjO+8muWIpOaWrWxpc3Rfdmlld3Plr7nlupTnmoRvYmplY3TmmK/lkKblrZjlnKhcblx0XHRpZiBfLmlzQXJyYXkoaW1wX2RhdGEubGlzdF92aWV3cykgJiYgaW1wX2RhdGEubGlzdF92aWV3cy5sZW5ndGggPiAwXG5cdFx0XHRfLmVhY2ggaW1wX2RhdGEubGlzdF92aWV3cywgKGxpc3RfdmlldyktPlxuXHRcdFx0XHRpZiAhbGlzdF92aWV3Lm9iamVjdF9uYW1lIHx8ICFfLmlzU3RyaW5nKGxpc3Rfdmlldy5vYmplY3RfbmFtZSlcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5YiX6KGo6KeG5Zu+JyN7bGlzdF92aWV3Lm5hbWV9J+eahG9iamVjdF9uYW1l5bGe5oCn5peg5pWIXCIpXG5cdFx0XHRcdGlmICFfLmluY2x1ZGUob2JqZWN0X25hbWVzLCBsaXN0X3ZpZXcub2JqZWN0X25hbWUpICYmICFfLmluY2x1ZGUoaW1wX29iamVjdF9uYW1lcywgbGlzdF92aWV3Lm9iamVjdF9uYW1lKVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLliJfooajop4blm74nI3tsaXN0X3ZpZXcubmFtZX0n5Lit5oyH5a6a55qE5a+56LGhJyN7bGlzdF92aWV3Lm9iamVjdF9uYW1lfSfkuI3lrZjlnKhcIilcblxuXHRcdCMgNSBwZXJtaXNzaW9uX3NldOagoemqjO+8muWIpOaWreadg+mZkOmbhuS4reeahOaOiOadg+W6lOeUqGFzc2lnbmVkX2FwcHM7IOadg+mZkOmbhueahOWQjeensOS4jeWFgeiuuOmHjeWkjVxuXHRcdHBlcm1pc3Npb25fc2V0X2lkcyA9IF8ucGx1Y2soaW1wX2RhdGEucGVybWlzc2lvbl9zZXQsIFwiX2lkXCIpXG5cdFx0aWYgXy5pc0FycmF5KGltcF9kYXRhLnBlcm1pc3Npb25fc2V0KSAmJiBpbXBfZGF0YS5wZXJtaXNzaW9uX3NldC5sZW5ndGggPiAwXG5cdFx0XHRfLmVhY2ggaW1wX2RhdGEucGVybWlzc2lvbl9zZXQsIChwZXJtaXNzaW9uX3NldCktPlxuXHRcdFx0XHRpZiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIG5hbWU6IHBlcm1pc3Npb25fc2V0Lm5hbWV9LHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5p2D6ZmQ6ZuG5ZCN56ewJyN7cGVybWlzc2lvbl9zZXQubmFtZX0n5LiN6IO96YeN5aSNXCJcblx0XHRcdFx0Xy5lYWNoIHBlcm1pc3Npb25fc2V0LmFzc2lnbmVkX2FwcHMsIChhcHBfaWQpLT5cblx0XHRcdFx0XHRpZiAhXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLkFwcHMpLCBhcHBfaWQpICYmICFfLmluY2x1ZGUoaW1wX2FwcF9pZHMsIGFwcF9pZClcblx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLmnYPpmZDpm4YnI3twZXJtaXNzaW9uX3NldC5uYW1lfSfnmoTmjojmnYPlupTnlKgnI3thcHBfaWR9J+S4jeWtmOWcqFwiKVxuXG5cdFx0IyA2IHBlcm1pc3Npb25fb2JqZWN0c+agoemqjO+8muWIpOaWreadg+mZkOmbhuS4reaMh+WumueahG9iamVjdOaYr+WQpuWtmOWcqO+8m+WIpOaWreadg+mZkOmbhuagh+ivhuaYr+aYr+WQpuacieaViFxuXHRcdGlmIF8uaXNBcnJheShpbXBfZGF0YS5wZXJtaXNzaW9uX29iamVjdHMpICYmIGltcF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cy5sZW5ndGggPiAwXG5cdFx0XHRfLmVhY2ggaW1wX2RhdGEucGVybWlzc2lvbl9vYmplY3RzLCAocGVybWlzc2lvbl9vYmplY3QpLT5cblx0XHRcdFx0aWYgIXBlcm1pc3Npb25fb2JqZWN0Lm9iamVjdF9uYW1lIHx8ICFfLmlzU3RyaW5nKHBlcm1pc3Npb25fb2JqZWN0Lm9iamVjdF9uYW1lKVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLmnYPpmZDpm4YnI3twZXJtaXNzaW9uX29iamVjdC5uYW1lfSfnmoRvYmplY3RfbmFtZeWxnuaAp+aXoOaViFwiKVxuXHRcdFx0XHRpZiAhXy5pbmNsdWRlKG9iamVjdF9uYW1lcywgcGVybWlzc2lvbl9vYmplY3Qub2JqZWN0X25hbWUpICYmICFfLmluY2x1ZGUoaW1wX29iamVjdF9uYW1lcywgcGVybWlzc2lvbl9vYmplY3Qub2JqZWN0X25hbWUpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuadg+mZkOmbhicje2xpc3Rfdmlldy5uYW1lfSfkuK3mjIflrprnmoTlr7nosaEnI3twZXJtaXNzaW9uX29iamVjdC5vYmplY3RfbmFtZX0n5LiN5a2Y5ZyoXCIpXG5cblx0XHRcdFx0aWYgIV8uaGFzKHBlcm1pc3Npb25fb2JqZWN0LCBcInBlcm1pc3Npb25fc2V0X2lkXCIpIHx8ICFfLmlzU3RyaW5nKHBlcm1pc3Npb25fb2JqZWN0LnBlcm1pc3Npb25fc2V0X2lkKVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLmnYPpmZDpm4YnI3twZXJtaXNzaW9uX29iamVjdC5uYW1lfSfnmoRwZXJtaXNzaW9uX3NldF9pZOWxnuaAp+aXoOaViFwiKVxuXHRcdFx0XHRlbHNlIGlmICFfLmluY2x1ZGUocGVybWlzc2lvbl9zZXRfaWRzLCBwZXJtaXNzaW9uX29iamVjdC5wZXJtaXNzaW9uX3NldF9pZClcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5p2D6ZmQ6ZuGJyN7cGVybWlzc2lvbl9vYmplY3QubmFtZX0n5oyH5a6a55qE5p2D6ZmQ6ZuGJyN7cGVybWlzc2lvbl9vYmplY3QucGVybWlzc2lvbl9zZXRfaWR9J+WAvOS4jeWcqOWvvOWFpeeahHBlcm1pc3Npb25fc2V05LitXCIpXG5cblx0XHQjIDcgcmVwb3J0c+agoemqjO+8muWIpOaWreaKpeihqOS4reaMh+WumueahG9iamVjdOaYr+WQpuWtmOWcqFxuXHRcdGlmIF8uaXNBcnJheShpbXBfZGF0YS5yZXBvcnRzKSAmJiBpbXBfZGF0YS5yZXBvcnRzLmxlbmd0aCA+IDBcblx0XHRcdF8uZWFjaCBpbXBfZGF0YS5yZXBvcnRzLCAocmVwb3J0KS0+XG5cdFx0XHRcdGlmICFyZXBvcnQub2JqZWN0X25hbWUgfHwgIV8uaXNTdHJpbmcocmVwb3J0Lm9iamVjdF9uYW1lKVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLmiqXooagnI3tyZXBvcnQubmFtZX0n55qEb2JqZWN0X25hbWXlsZ7mgKfml6DmlYhcIilcblx0XHRcdFx0aWYgIV8uaW5jbHVkZShvYmplY3RfbmFtZXMsIHJlcG9ydC5vYmplY3RfbmFtZSkgJiYgIV8uaW5jbHVkZShpbXBfb2JqZWN0X25hbWVzLCByZXBvcnQub2JqZWN0X25hbWUpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuaKpeihqCcje3JlcG9ydC5uYW1lfSfkuK3mjIflrprnmoTlr7nosaEnI3tyZXBvcnQub2JqZWN0X25hbWV9J+S4jeWtmOWcqFwiKVxuXG5cdCMjI+aVsOaNruagoemqjCDnu5PmnZ8jIyNcblxuXHQjIyPmlbDmja7mjIHkuYXljJYg5byA5aeLIyMjXG5cblx0IyDlrprkuYnmlrDml6fmlbDmja7lr7nlupTlhbPns7vpm4blkIhcblx0YXBwc19pZF9tYXBzID0ge31cblx0bGlzdF92aWV3c19pZF9tYXBzID0ge31cblx0cGVybWlzc2lvbl9zZXRfaWRfbWFwcyA9IHt9XG5cblx0IyAxIOaMgeS5heWMlkFwcHNcblx0aWYgXy5pc0FycmF5KGltcF9kYXRhLmFwcHMpICYmIGltcF9kYXRhLmFwcHMubGVuZ3RoID4gMFxuXHRcdF8uZWFjaCBpbXBfZGF0YS5hcHBzLCAoYXBwKS0+XG5cdFx0XHRvbGRfaWQgPSBhcHAuX2lkXG5cdFx0XHRkZWxldGUgYXBwLl9pZFxuXHRcdFx0YXBwLnNwYWNlID0gc3BhY2VfaWRcblx0XHRcdGFwcC5vd25lciA9IHVzZXJJZFxuXHRcdFx0YXBwLmlzX2NyZWF0b3IgPSB0cnVlXG5cdFx0XHRuZXdfaWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBzXCIpLmluc2VydChhcHApXG5cdFx0XHRhcHBzX2lkX21hcHNbb2xkX2lkXSA9IG5ld19pZFxuXG5cdCMgMiDmjIHkuYXljJZvYmplY3RzXG5cdGlmIF8uaXNBcnJheShpbXBfZGF0YS5vYmplY3RzKSAmJiBpbXBfZGF0YS5vYmplY3RzLmxlbmd0aCA+IDBcblx0XHRfLmVhY2ggaW1wX2RhdGEub2JqZWN0cywgKG9iamVjdCktPlxuXHRcdFx0Q3JlYXRvci5pbXBvcnRPYmplY3QodXNlcklkLCBzcGFjZV9pZCwgb2JqZWN0LCBsaXN0X3ZpZXdzX2lkX21hcHMpXG5cblx0IyAzIOaMgeS5heWMlmxpc3Rfdmlld3Ncblx0aWYgXy5pc0FycmF5KGltcF9kYXRhLmxpc3Rfdmlld3MpICYmIGltcF9kYXRhLmxpc3Rfdmlld3MubGVuZ3RoID4gMFxuXHRcdF8uZWFjaCBpbXBfZGF0YS5saXN0X3ZpZXdzLCAobGlzdF92aWV3KS0+XG5cdFx0XHRvbGRfaWQgPSBsaXN0X3ZpZXcuX2lkXG5cdFx0XHRkZWxldGUgbGlzdF92aWV3Ll9pZFxuXG5cdFx0XHRsaXN0X3ZpZXcuc3BhY2UgPSBzcGFjZV9pZFxuXHRcdFx0bGlzdF92aWV3Lm93bmVyID0gdXNlcklkXG5cdFx0XHRpZiBDcmVhdG9yLmlzQWxsVmlldyhsaXN0X3ZpZXcpIHx8IENyZWF0b3IuaXNSZWNlbnRWaWV3KGxpc3Rfdmlldylcblx0XHRcdFx0IyDliJvlu7pvYmplY3Tml7bvvIzkvJroh6rliqjmt7vliqBhbGwgdmlld+OAgXJlY2VudCB2aWV3XG5cdFx0XHRcdF9saXN0X3ZpZXcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmRPbmUoe29iamVjdF9uYW1lOiBsaXN0X3ZpZXcub2JqZWN0X25hbWUsIG5hbWU6IGxpc3Rfdmlldy5uYW1lLCBzcGFjZTogc3BhY2VfaWR9LHtmaWVsZHM6IHtfaWQ6IDF9fSlcblx0XHRcdFx0aWYgX2xpc3Rfdmlld1xuXHRcdFx0XHRcdG5ld19pZCA9IF9saXN0X3ZpZXcuX2lkXG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikudXBkYXRlKHtvYmplY3RfbmFtZTogbGlzdF92aWV3Lm9iamVjdF9uYW1lLCBuYW1lOiBsaXN0X3ZpZXcubmFtZSwgc3BhY2U6IHNwYWNlX2lkfSwgeyRzZXQ6IGxpc3Rfdmlld30pXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG5ld19pZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuaW5zZXJ0KGxpc3RfdmlldylcblxuXHRcdFx0bGlzdF92aWV3c19pZF9tYXBzW2xpc3Rfdmlldy5vYmplY3RfbmFtZSArIFwiX1wiICsgb2xkX2lkXSA9IG5ld19pZFxuXG5cdCMgNCDmjIHkuYXljJZwZXJtaXNzaW9uX3NldFxuXHRpZiBfLmlzQXJyYXkoaW1wX2RhdGEucGVybWlzc2lvbl9zZXQpICYmIGltcF9kYXRhLnBlcm1pc3Npb25fc2V0Lmxlbmd0aCA+IDBcblx0XHRfLmVhY2ggaW1wX2RhdGEucGVybWlzc2lvbl9zZXQsIChwZXJtaXNzaW9uX3NldCktPlxuXHRcdFx0b2xkX2lkID0gcGVybWlzc2lvbl9zZXQuX2lkXG5cdFx0XHRkZWxldGUgcGVybWlzc2lvbl9zZXQuX2lkXG5cblx0XHRcdHBlcm1pc3Npb25fc2V0LnNwYWNlID0gc3BhY2VfaWRcblx0XHRcdHBlcm1pc3Npb25fc2V0Lm93bmVyID0gdXNlcklkXG5cblx0XHRcdHBlcm1pc3Npb25fc2V0X3VzZXJzID0gW11cblx0XHRcdF8uZWFjaCBwZXJtaXNzaW9uX3NldC51c2VycywgKHVzZXJfaWQpLT5cblx0XHRcdFx0c3BhY2VfdXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcjogdXNlcl9pZH0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcblx0XHRcdFx0aWYgc3BhY2VfdXNlclxuXHRcdFx0XHRcdHBlcm1pc3Npb25fc2V0X3VzZXJzLnB1c2ggdXNlcl9pZFxuXG5cdFx0XHRhc3NpZ25lZF9hcHBzID0gW11cblx0XHRcdF8uZWFjaCBwZXJtaXNzaW9uX3NldC5hc3NpZ25lZF9hcHBzLCAoYXBwX2lkKS0+XG5cdFx0XHRcdGlmIF8uaW5jbHVkZShfLmtleXMoQ3JlYXRvci5BcHBzKSwgYXBwX2lkKVxuXHRcdFx0XHRcdGFzc2lnbmVkX2FwcHMucHVzaCBhcHBfaWRcblx0XHRcdFx0ZWxzZSBpZiBhcHBzX2lkX21hcHNbYXBwX2lkXVxuXHRcdFx0XHRcdGFzc2lnbmVkX2FwcHMucHVzaCBhcHBzX2lkX21hcHNbYXBwX2lkXVxuXG5cblx0XHRcdG5ld19pZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmluc2VydChwZXJtaXNzaW9uX3NldClcblxuXHRcdFx0cGVybWlzc2lvbl9zZXRfaWRfbWFwc1tvbGRfaWRdID0gbmV3X2lkXG5cblx0IyA1ICDmjIHkuYXljJZwZXJtaXNzaW9uX29iamVjdHNcblx0aWYgXy5pc0FycmF5KGltcF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cykgJiYgaW1wX2RhdGEucGVybWlzc2lvbl9vYmplY3RzLmxlbmd0aCA+IDBcblx0XHRfLmVhY2ggaW1wX2RhdGEucGVybWlzc2lvbl9vYmplY3RzLCAocGVybWlzc2lvbl9vYmplY3QpLT5cblx0XHRcdGRlbGV0ZSBwZXJtaXNzaW9uX29iamVjdC5faWRcblxuXHRcdFx0cGVybWlzc2lvbl9vYmplY3Quc3BhY2UgPSBzcGFjZV9pZFxuXHRcdFx0cGVybWlzc2lvbl9vYmplY3Qub3duZXIgPSB1c2VySWRcblxuXHRcdFx0cGVybWlzc2lvbl9vYmplY3QucGVybWlzc2lvbl9zZXRfaWQgPSBwZXJtaXNzaW9uX3NldF9pZF9tYXBzW3Blcm1pc3Npb25fb2JqZWN0LnBlcm1pc3Npb25fc2V0X2lkXVxuXG5cdFx0XHRkaXNhYmxlZF9saXN0X3ZpZXdzID0gW11cblx0XHRcdF8uZWFjaCBwZXJtaXNzaW9uX29iamVjdC5kaXNhYmxlZF9saXN0X3ZpZXdzLCAobGlzdF92aWV3X2lkKS0+XG5cdFx0XHRcdG5ld192aWV3X2lkID0gbGlzdF92aWV3c19pZF9tYXBzW3Blcm1pc3Npb25fb2JqZWN0Lm9iamVjdF9uYW1lICsgXCJfXCIgKyBsaXN0X3ZpZXdfaWRdXG5cdFx0XHRcdGlmIG5ld192aWV3X2lkXG5cdFx0XHRcdFx0ZGlzYWJsZWRfbGlzdF92aWV3cy5wdXNoIG5ld192aWV3X2lkXG5cblx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5pbnNlcnQocGVybWlzc2lvbl9vYmplY3QpXG5cblx0IyA2IOaMgeS5heWMlnJlcG9ydHNcblx0aWYgXy5pc0FycmF5KGltcF9kYXRhLnJlcG9ydHMpICYmIGltcF9kYXRhLnJlcG9ydHMubGVuZ3RoID4gMFxuXHRcdF8uZWFjaCBpbXBfZGF0YS5yZXBvcnRzLCAocmVwb3J0KS0+XG5cdFx0XHRkZWxldGUgcmVwb3J0Ll9pZFxuXG5cdFx0XHRyZXBvcnQuc3BhY2UgPSBzcGFjZV9pZFxuXHRcdFx0cmVwb3J0Lm93bmVyID0gdXNlcklkXG5cblx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInJlcG9ydHNcIikuaW5zZXJ0KHJlcG9ydClcblx0IyMj5pWw5o2u5oyB5LmF5YyWIOe7k+adnyMjI1xuXG4jIyPnlLHkuo7kvb/nlKjmjqXlj6PmlrnlvI/kvJrlr7zoh7Rjb2xsZWN0aW9u55qEYWZ0ZXLjgIFiZWZvcmXkuK3ojrflj5bkuI3liLB1c2VySWTvvIzlho3mraTpl67popjmnKrop6PlhrPkuYvliY3vvIzov5jmmK/kvb/nlKhNZXRob2Rcbkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvY3JlYXRvci9hcHBfcGFja2FnZS9pbXBvcnQvOnNwYWNlX2lkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xuXHRcdHNwYWNlX2lkID0gcmVxLnBhcmFtcy5zcGFjZV9pZFxuXHRcdGltcF9kYXRhID0gcmVxLmJvZHlcblx0XHRpbXBvcnRfYXBwX3BhY2thZ2UodXNlcklkLCBzcGFjZV9pZCwgaW1wX2RhdGEpXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7fVxuXHRcdH1cblx0Y2F0Y2ggZVxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdGNvZGU6IGUuZXJyb3Jcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XG5cdFx0fVxuIyMjXG5cbk1ldGVvci5tZXRob2RzXG5cdCdpbXBvcnRfYXBwX3BhY2thZ2UnOiAoc3BhY2VfaWQsIGltcF9kYXRhKS0+XG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcblx0XHRDcmVhdG9yLmltcG9ydF9hcHBfcGFja2FnZSh1c2VySWQsIHNwYWNlX2lkLCBpbXBfZGF0YSlcbiIsInZhciB0cmFuc2Zvcm1GaWVsZE9wdGlvbnMsIHRyYW5zZm9ybUZpbHRlcnM7XG5cbnRyYW5zZm9ybUZpbHRlcnMgPSBmdW5jdGlvbihmaWx0ZXJzKSB7XG4gIHZhciBfZmlsdGVycztcbiAgX2ZpbHRlcnMgPSBbXTtcbiAgXy5lYWNoKGZpbHRlcnMsIGZ1bmN0aW9uKGYpIHtcbiAgICBpZiAoXy5pc0FycmF5KGYpICYmIGYubGVuZ3RoID09PSAzKSB7XG4gICAgICByZXR1cm4gX2ZpbHRlcnMucHVzaCh7XG4gICAgICAgIGZpZWxkOiBmWzBdLFxuICAgICAgICBvcGVyYXRpb246IGZbMV0sXG4gICAgICAgIHZhbHVlOiBmWzJdXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIF9maWx0ZXJzLnB1c2goZik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIF9maWx0ZXJzO1xufTtcblxudHJhbnNmb3JtRmllbGRPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICB2YXIgX29wdGlvbnM7XG4gIGlmICghXy5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgcmV0dXJuIG9wdGlvbnM7XG4gIH1cbiAgX29wdGlvbnMgPSBbXTtcbiAgXy5lYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKG8pIHtcbiAgICBpZiAobyAmJiBfLmhhcyhvLCAnbGFiZWwnKSAmJiBfLmhhcyhvLCAndmFsdWUnKSkge1xuICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goby5sYWJlbCArIFwiOlwiICsgby52YWx1ZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIF9vcHRpb25zLmpvaW4oJywnKTtcbn07XG5cbkNyZWF0b3IuaW1wb3J0T2JqZWN0ID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZV9pZCwgb2JqZWN0LCBsaXN0X3ZpZXdzX2lkX21hcHMpIHtcbiAgdmFyIF9maWVsZG5hbWVzLCBhY3Rpb25zLCBmaWVsZHMsIGhhc1JlY2VudFZpZXcsIGludGVybmFsX2xpc3Rfdmlldywgb2JqX2xpc3Rfdmlld3MsIHRyaWdnZXJzO1xuICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0taW1wb3J0T2JqZWN0LS0tLS0tLS0tLS0tLS0tLS0tJywgb2JqZWN0Lm5hbWUpO1xuICBmaWVsZHMgPSBvYmplY3QuZmllbGRzO1xuICB0cmlnZ2VycyA9IG9iamVjdC50cmlnZ2VycztcbiAgYWN0aW9ucyA9IG9iamVjdC5hY3Rpb25zO1xuICBvYmpfbGlzdF92aWV3cyA9IG9iamVjdC5saXN0X3ZpZXdzO1xuICBkZWxldGUgb2JqZWN0Ll9pZDtcbiAgZGVsZXRlIG9iamVjdC5maWVsZHM7XG4gIGRlbGV0ZSBvYmplY3QudHJpZ2dlcnM7XG4gIGRlbGV0ZSBvYmplY3QuYWN0aW9ucztcbiAgZGVsZXRlIG9iamVjdC5wZXJtaXNzaW9ucztcbiAgZGVsZXRlIG9iamVjdC5saXN0X3ZpZXdzO1xuICBvYmplY3Quc3BhY2UgPSBzcGFjZV9pZDtcbiAgb2JqZWN0Lm93bmVyID0gdXNlcklkO1xuICBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLmluc2VydChvYmplY3QpO1xuICBpbnRlcm5hbF9saXN0X3ZpZXcgPSB7fTtcbiAgaGFzUmVjZW50VmlldyA9IGZhbHNlO1xuICBjb25zb2xlLmxvZygn5oyB5LmF5YyW5a+56LGhbGlzdF92aWV3cycpO1xuICBfLmVhY2gob2JqX2xpc3Rfdmlld3MsIGZ1bmN0aW9uKGxpc3Rfdmlldykge1xuICAgIHZhciBuZXdfaWQsIG9sZF9pZCwgb3B0aW9ucztcbiAgICBvbGRfaWQgPSBsaXN0X3ZpZXcuX2lkO1xuICAgIGRlbGV0ZSBsaXN0X3ZpZXcuX2lkO1xuICAgIGxpc3Rfdmlldy5zcGFjZSA9IHNwYWNlX2lkO1xuICAgIGxpc3Rfdmlldy5vd25lciA9IHVzZXJJZDtcbiAgICBsaXN0X3ZpZXcub2JqZWN0X25hbWUgPSBvYmplY3QubmFtZTtcbiAgICBpZiAoQ3JlYXRvci5pc1JlY2VudFZpZXcobGlzdF92aWV3KSkge1xuICAgICAgaGFzUmVjZW50VmlldyA9IHRydWU7XG4gICAgfVxuICAgIGlmIChsaXN0X3ZpZXcuZmlsdGVycykge1xuICAgICAgbGlzdF92aWV3LmZpbHRlcnMgPSB0cmFuc2Zvcm1GaWx0ZXJzKGxpc3Rfdmlldy5maWx0ZXJzKTtcbiAgICB9XG4gICAgaWYgKENyZWF0b3IuaXNBbGxWaWV3KGxpc3RfdmlldykgfHwgQ3JlYXRvci5pc1JlY2VudFZpZXcobGlzdF92aWV3KSkge1xuICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgJHNldDogbGlzdF92aWV3XG4gICAgICB9O1xuICAgICAgaWYgKCFsaXN0X3ZpZXcuY29sdW1ucykge1xuICAgICAgICBvcHRpb25zLiR1bnNldCA9IHtcbiAgICAgICAgICBjb2x1bW5zOiAnJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikudXBkYXRlKHtcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdC5uYW1lLFxuICAgICAgICBuYW1lOiBsaXN0X3ZpZXcubmFtZSxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICB9LCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3X2lkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5pbnNlcnQobGlzdF92aWV3KTtcbiAgICAgIHJldHVybiBsaXN0X3ZpZXdzX2lkX21hcHNbb2JqZWN0Lm5hbWUgKyBcIl9cIiArIG9sZF9pZF0gPSBuZXdfaWQ7XG4gICAgfVxuICB9KTtcbiAgaWYgKCFoYXNSZWNlbnRWaWV3KSB7XG4gICAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5yZW1vdmUoe1xuICAgICAgbmFtZTogXCJyZWNlbnRcIixcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3QubmFtZSxcbiAgICAgIG93bmVyOiB1c2VySWRcbiAgICB9KTtcbiAgfVxuICBjb25zb2xlLmxvZygn5oyB5LmF5YyW5a+56LGh5a2X5q61Jyk7XG4gIF9maWVsZG5hbWVzID0gW107XG4gIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrKSB7XG4gICAgZGVsZXRlIGZpZWxkLl9pZDtcbiAgICBmaWVsZC5zcGFjZSA9IHNwYWNlX2lkO1xuICAgIGZpZWxkLm93bmVyID0gdXNlcklkO1xuICAgIGZpZWxkLm9iamVjdCA9IG9iamVjdC5uYW1lO1xuICAgIGlmIChmaWVsZC5vcHRpb25zKSB7XG4gICAgICBmaWVsZC5vcHRpb25zID0gdHJhbnNmb3JtRmllbGRPcHRpb25zKGZpZWxkLm9wdGlvbnMpO1xuICAgIH1cbiAgICBpZiAoIV8uaGFzKGZpZWxkLCBcIm5hbWVcIikpIHtcbiAgICAgIGZpZWxkLm5hbWUgPSBrO1xuICAgIH1cbiAgICBfZmllbGRuYW1lcy5wdXNoKGZpZWxkLm5hbWUpO1xuICAgIGlmIChmaWVsZC5uYW1lID09PSBcIm5hbWVcIikge1xuICAgICAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS51cGRhdGUoe1xuICAgICAgICBvYmplY3Q6IG9iamVjdC5uYW1lLFxuICAgICAgICBuYW1lOiBcIm5hbWVcIixcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IGZpZWxkXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS5pbnNlcnQoZmllbGQpO1xuICAgIH1cbiAgICBpZiAoIV8uY29udGFpbnMoX2ZpZWxkbmFtZXMsICduYW1lJykpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfZmllbGRzXCIpLmRpcmVjdC5yZW1vdmUoe1xuICAgICAgICBvYmplY3Q6IG9iamVjdC5uYW1lLFxuICAgICAgICBuYW1lOiBcIm5hbWVcIixcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBjb25zb2xlLmxvZygn5oyB5LmF5YyW6Kem5Y+R5ZmoJyk7XG4gIF8uZWFjaCh0cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlciwgaykge1xuICAgIGRlbGV0ZSB0cmlnZ2Vycy5faWQ7XG4gICAgdHJpZ2dlci5zcGFjZSA9IHNwYWNlX2lkO1xuICAgIHRyaWdnZXIub3duZXIgPSB1c2VySWQ7XG4gICAgdHJpZ2dlci5vYmplY3QgPSBvYmplY3QubmFtZTtcbiAgICBpZiAoIV8uaGFzKHRyaWdnZXIsIFwibmFtZVwiKSkge1xuICAgICAgdHJpZ2dlci5uYW1lID0gay5yZXBsYWNlKG5ldyBSZWdFeHAoXCJcXFxcLlwiLCBcImdcIiksIFwiX1wiKTtcbiAgICB9XG4gICAgaWYgKCFfLmhhcyh0cmlnZ2VyLCBcImlzX2VuYWJsZVwiKSkge1xuICAgICAgdHJpZ2dlci5pc19lbmFibGUgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3RyaWdnZXJzXCIpLmluc2VydCh0cmlnZ2VyKTtcbiAgfSk7XG4gIGNvbnNvbGUubG9nKCfmjIHkuYXljJbmk43kvZwnKTtcbiAgXy5lYWNoKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbiwgaykge1xuICAgIGRlbGV0ZSBhY3Rpb24uX2lkO1xuICAgIGFjdGlvbi5zcGFjZSA9IHNwYWNlX2lkO1xuICAgIGFjdGlvbi5vd25lciA9IHVzZXJJZDtcbiAgICBhY3Rpb24ub2JqZWN0ID0gb2JqZWN0Lm5hbWU7XG4gICAgaWYgKCFfLmhhcyhhY3Rpb24sIFwibmFtZVwiKSkge1xuICAgICAgYWN0aW9uLm5hbWUgPSBrLnJlcGxhY2UobmV3IFJlZ0V4cChcIlxcXFwuXCIsIFwiZ1wiKSwgXCJfXCIpO1xuICAgIH1cbiAgICBpZiAoIV8uaGFzKGFjdGlvbiwgXCJpc19lbmFibGVcIikpIHtcbiAgICAgIGFjdGlvbi5pc19lbmFibGUgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2FjdGlvbnNcIikuaW5zZXJ0KGFjdGlvbik7XG4gIH0pO1xuICByZXR1cm4gY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLWltcG9ydE9iamVjdCBlbmQtLS0tLS0tLS0tLS0tLS0tLS0nLCBvYmplY3QubmFtZSk7XG59O1xuXG5DcmVhdG9yLmltcG9ydF9hcHBfcGFja2FnZSA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VfaWQsIGltcF9kYXRhLCBmcm9tX3RlbXBsYXRlKSB7XG4gIHZhciBhcHBzX2lkX21hcHMsIGltcF9hcHBfaWRzLCBpbXBfb2JqZWN0X25hbWVzLCBsaXN0X3ZpZXdzX2lkX21hcHMsIG9iamVjdF9uYW1lcywgcGVybWlzc2lvbl9zZXRfaWRfbWFwcywgcGVybWlzc2lvbl9zZXRfaWRzO1xuICBpZiAoIXVzZXJJZCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI0MDFcIiwgXCJBdXRoZW50aWNhdGlvbiBpcyByZXF1aXJlZCBhbmQgaGFzIG5vdCBiZWVuIHByb3ZpZGVkLlwiKTtcbiAgfVxuICBpZiAoIUNyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCB1c2VySWQpKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjQwMVwiLCBcIlBlcm1pc3Npb24gZGVuaWVkLlwiKTtcbiAgfVxuXG4gIC8q5pWw5o2u5qCh6aqMIOW8gOWniyAqL1xuICBjaGVjayhpbXBfZGF0YSwgT2JqZWN0KTtcbiAgaWYgKCFmcm9tX3RlbXBsYXRlKSB7XG4gICAgaW1wX2FwcF9pZHMgPSBfLnBsdWNrKGltcF9kYXRhLmFwcHMsIFwiX2lkXCIpO1xuICAgIGlmIChfLmlzQXJyYXkoaW1wX2RhdGEuYXBwcykgJiYgaW1wX2RhdGEuYXBwcy5sZW5ndGggPiAwKSB7XG4gICAgICBfLmVhY2goaW1wX2RhdGEuYXBwcywgZnVuY3Rpb24oYXBwKSB7XG4gICAgICAgIGlmIChfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuQXBwcyksIGFwcC5faWQpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuW6lOeUqCdcIiArIGFwcC5uYW1lICsgXCIn5bey5a2Y5ZyoXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShpbXBfZGF0YS5vYmplY3RzKSAmJiBpbXBfZGF0YS5vYmplY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgIF8uZWFjaChpbXBfZGF0YS5vYmplY3RzLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgaWYgKF8uaW5jbHVkZShfLmtleXMoQ3JlYXRvci5PYmplY3RzKSwgb2JqZWN0Lm5hbWUpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuWvueixoSdcIiArIG9iamVjdC5uYW1lICsgXCIn5bey5a2Y5ZyoXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfLmVhY2gob2JqZWN0LnRyaWdnZXJzLCBmdW5jdGlvbih0cmlnZ2VyKSB7XG4gICAgICAgICAgaWYgKHRyaWdnZXIub24gPT09ICdzZXJ2ZXInICYmICFTdGVlZG9zLmlzTGVnYWxWZXJzaW9uKHNwYWNlX2lkLCBcIndvcmtmbG93LmVudGVycHJpc2VcIikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuWPquacieS8geS4mueJiOaUr+aMgemFjee9ruacjeWKoeerr+eahOinpuWPkeWZqFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGltcF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKGltcF9kYXRhLm9iamVjdHMsIFwibmFtZVwiKTtcbiAgICBvYmplY3RfbmFtZXMgPSBfLmtleXMoQ3JlYXRvci5PYmplY3RzKTtcbiAgICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLmFwcHMpICYmIGltcF9kYXRhLmFwcHMubGVuZ3RoID4gMCkge1xuICAgICAgXy5lYWNoKGltcF9kYXRhLmFwcHMsIGZ1bmN0aW9uKGFwcCkge1xuICAgICAgICByZXR1cm4gXy5lYWNoKGFwcC5vYmplY3RzLCBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgICAgICAgIGlmICghXy5pbmNsdWRlKG9iamVjdF9uYW1lcywgb2JqZWN0X25hbWUpICYmICFfLmluY2x1ZGUoaW1wX29iamVjdF9uYW1lcywgb2JqZWN0X25hbWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5bqU55SoJ1wiICsgYXBwLm5hbWUgKyBcIifkuK3mjIflrprnmoTlr7nosaEnXCIgKyBvYmplY3RfbmFtZSArIFwiJ+S4jeWtmOWcqFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkoaW1wX2RhdGEubGlzdF92aWV3cykgJiYgaW1wX2RhdGEubGlzdF92aWV3cy5sZW5ndGggPiAwKSB7XG4gICAgICBfLmVhY2goaW1wX2RhdGEubGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gICAgICAgIGlmICghbGlzdF92aWV3Lm9iamVjdF9uYW1lIHx8ICFfLmlzU3RyaW5nKGxpc3Rfdmlldy5vYmplY3RfbmFtZSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5YiX6KGo6KeG5Zu+J1wiICsgbGlzdF92aWV3Lm5hbWUgKyBcIifnmoRvYmplY3RfbmFtZeWxnuaAp+aXoOaViFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIV8uaW5jbHVkZShvYmplY3RfbmFtZXMsIGxpc3Rfdmlldy5vYmplY3RfbmFtZSkgJiYgIV8uaW5jbHVkZShpbXBfb2JqZWN0X25hbWVzLCBsaXN0X3ZpZXcub2JqZWN0X25hbWUpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuWIl+ihqOinhuWbvidcIiArIGxpc3Rfdmlldy5uYW1lICsgXCIn5Lit5oyH5a6a55qE5a+56LGhJ1wiICsgbGlzdF92aWV3Lm9iamVjdF9uYW1lICsgXCIn5LiN5a2Y5ZyoXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcGVybWlzc2lvbl9zZXRfaWRzID0gXy5wbHVjayhpbXBfZGF0YS5wZXJtaXNzaW9uX3NldCwgXCJfaWRcIik7XG4gICAgaWYgKF8uaXNBcnJheShpbXBfZGF0YS5wZXJtaXNzaW9uX3NldCkgJiYgaW1wX2RhdGEucGVybWlzc2lvbl9zZXQubGVuZ3RoID4gMCkge1xuICAgICAgXy5lYWNoKGltcF9kYXRhLnBlcm1pc3Npb25fc2V0LCBmdW5jdGlvbihwZXJtaXNzaW9uX3NldCkge1xuICAgICAgICBpZiAoQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIG5hbWU6IHBlcm1pc3Npb25fc2V0Lm5hbWVcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuadg+mZkOmbhuWQjeensCdcIiArIHBlcm1pc3Npb25fc2V0Lm5hbWUgKyBcIifkuI3og73ph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF8uZWFjaChwZXJtaXNzaW9uX3NldC5hc3NpZ25lZF9hcHBzLCBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICAgICAgICBpZiAoIV8uaW5jbHVkZShfLmtleXMoQ3JlYXRvci5BcHBzKSwgYXBwX2lkKSAmJiAhXy5pbmNsdWRlKGltcF9hcHBfaWRzLCBhcHBfaWQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5p2D6ZmQ6ZuGJ1wiICsgcGVybWlzc2lvbl9zZXQubmFtZSArIFwiJ+eahOaOiOadg+W6lOeUqCdcIiArIGFwcF9pZCArIFwiJ+S4jeWtmOWcqFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkoaW1wX2RhdGEucGVybWlzc2lvbl9vYmplY3RzKSAmJiBpbXBfZGF0YS5wZXJtaXNzaW9uX29iamVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgXy5lYWNoKGltcF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cywgZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3QpIHtcbiAgICAgICAgaWYgKCFwZXJtaXNzaW9uX29iamVjdC5vYmplY3RfbmFtZSB8fCAhXy5pc1N0cmluZyhwZXJtaXNzaW9uX29iamVjdC5vYmplY3RfbmFtZSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5p2D6ZmQ6ZuGJ1wiICsgcGVybWlzc2lvbl9vYmplY3QubmFtZSArIFwiJ+eahG9iamVjdF9uYW1l5bGe5oCn5peg5pWIXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghXy5pbmNsdWRlKG9iamVjdF9uYW1lcywgcGVybWlzc2lvbl9vYmplY3Qub2JqZWN0X25hbWUpICYmICFfLmluY2x1ZGUoaW1wX29iamVjdF9uYW1lcywgcGVybWlzc2lvbl9vYmplY3Qub2JqZWN0X25hbWUpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuadg+mZkOmbhidcIiArIGxpc3Rfdmlldy5uYW1lICsgXCIn5Lit5oyH5a6a55qE5a+56LGhJ1wiICsgcGVybWlzc2lvbl9vYmplY3Qub2JqZWN0X25hbWUgKyBcIifkuI3lrZjlnKhcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFfLmhhcyhwZXJtaXNzaW9uX29iamVjdCwgXCJwZXJtaXNzaW9uX3NldF9pZFwiKSB8fCAhXy5pc1N0cmluZyhwZXJtaXNzaW9uX29iamVjdC5wZXJtaXNzaW9uX3NldF9pZCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5p2D6ZmQ6ZuGJ1wiICsgcGVybWlzc2lvbl9vYmplY3QubmFtZSArIFwiJ+eahHBlcm1pc3Npb25fc2V0X2lk5bGe5oCn5peg5pWIXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKCFfLmluY2x1ZGUocGVybWlzc2lvbl9zZXRfaWRzLCBwZXJtaXNzaW9uX29iamVjdC5wZXJtaXNzaW9uX3NldF9pZCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5p2D6ZmQ6ZuGJ1wiICsgcGVybWlzc2lvbl9vYmplY3QubmFtZSArIFwiJ+aMh+WumueahOadg+mZkOmbhidcIiArIHBlcm1pc3Npb25fb2JqZWN0LnBlcm1pc3Npb25fc2V0X2lkICsgXCIn5YC85LiN5Zyo5a+85YWl55qEcGVybWlzc2lvbl9zZXTkuK1cIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLnJlcG9ydHMpICYmIGltcF9kYXRhLnJlcG9ydHMubGVuZ3RoID4gMCkge1xuICAgICAgXy5lYWNoKGltcF9kYXRhLnJlcG9ydHMsIGZ1bmN0aW9uKHJlcG9ydCkge1xuICAgICAgICBpZiAoIXJlcG9ydC5vYmplY3RfbmFtZSB8fCAhXy5pc1N0cmluZyhyZXBvcnQub2JqZWN0X25hbWUpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuaKpeihqCdcIiArIHJlcG9ydC5uYW1lICsgXCIn55qEb2JqZWN0X25hbWXlsZ7mgKfml6DmlYhcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFfLmluY2x1ZGUob2JqZWN0X25hbWVzLCByZXBvcnQub2JqZWN0X25hbWUpICYmICFfLmluY2x1ZGUoaW1wX29iamVjdF9uYW1lcywgcmVwb3J0Lm9iamVjdF9uYW1lKSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLmiqXooagnXCIgKyByZXBvcnQubmFtZSArIFwiJ+S4reaMh+WumueahOWvueixoSdcIiArIHJlcG9ydC5vYmplY3RfbmFtZSArIFwiJ+S4jeWtmOWcqFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyrmlbDmja7moKHpqowg57uT5p2fICovXG5cbiAgLyrmlbDmja7mjIHkuYXljJYg5byA5aeLICovXG4gIGFwcHNfaWRfbWFwcyA9IHt9O1xuICBsaXN0X3ZpZXdzX2lkX21hcHMgPSB7fTtcbiAgcGVybWlzc2lvbl9zZXRfaWRfbWFwcyA9IHt9O1xuICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLmFwcHMpICYmIGltcF9kYXRhLmFwcHMubGVuZ3RoID4gMCkge1xuICAgIF8uZWFjaChpbXBfZGF0YS5hcHBzLCBmdW5jdGlvbihhcHApIHtcbiAgICAgIHZhciBuZXdfaWQsIG9sZF9pZDtcbiAgICAgIG9sZF9pZCA9IGFwcC5faWQ7XG4gICAgICBkZWxldGUgYXBwLl9pZDtcbiAgICAgIGFwcC5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgYXBwLm93bmVyID0gdXNlcklkO1xuICAgICAgYXBwLmlzX2NyZWF0b3IgPSB0cnVlO1xuICAgICAgbmV3X2lkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwc1wiKS5pbnNlcnQoYXBwKTtcbiAgICAgIHJldHVybiBhcHBzX2lkX21hcHNbb2xkX2lkXSA9IG5ld19pZDtcbiAgICB9KTtcbiAgfVxuICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLm9iamVjdHMpICYmIGltcF9kYXRhLm9iamVjdHMubGVuZ3RoID4gMCkge1xuICAgIF8uZWFjaChpbXBfZGF0YS5vYmplY3RzLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmltcG9ydE9iamVjdCh1c2VySWQsIHNwYWNlX2lkLCBvYmplY3QsIGxpc3Rfdmlld3NfaWRfbWFwcyk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKF8uaXNBcnJheShpbXBfZGF0YS5saXN0X3ZpZXdzKSAmJiBpbXBfZGF0YS5saXN0X3ZpZXdzLmxlbmd0aCA+IDApIHtcbiAgICBfLmVhY2goaW1wX2RhdGEubGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gICAgICB2YXIgX2xpc3RfdmlldywgbmV3X2lkLCBvbGRfaWQ7XG4gICAgICBvbGRfaWQgPSBsaXN0X3ZpZXcuX2lkO1xuICAgICAgZGVsZXRlIGxpc3Rfdmlldy5faWQ7XG4gICAgICBsaXN0X3ZpZXcuc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIGxpc3Rfdmlldy5vd25lciA9IHVzZXJJZDtcbiAgICAgIGlmIChDcmVhdG9yLmlzQWxsVmlldyhsaXN0X3ZpZXcpIHx8IENyZWF0b3IuaXNSZWNlbnRWaWV3KGxpc3RfdmlldykpIHtcbiAgICAgICAgX2xpc3RfdmlldyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZE9uZSh7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IGxpc3Rfdmlldy5vYmplY3RfbmFtZSxcbiAgICAgICAgICBuYW1lOiBsaXN0X3ZpZXcubmFtZSxcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKF9saXN0X3ZpZXcpIHtcbiAgICAgICAgICBuZXdfaWQgPSBfbGlzdF92aWV3Ll9pZDtcbiAgICAgICAgfVxuICAgICAgICBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLnVwZGF0ZSh7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IGxpc3Rfdmlldy5vYmplY3RfbmFtZSxcbiAgICAgICAgICBuYW1lOiBsaXN0X3ZpZXcubmFtZSxcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IGxpc3Rfdmlld1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld19pZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuaW5zZXJ0KGxpc3Rfdmlldyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGlzdF92aWV3c19pZF9tYXBzW2xpc3Rfdmlldy5vYmplY3RfbmFtZSArIFwiX1wiICsgb2xkX2lkXSA9IG5ld19pZDtcbiAgICB9KTtcbiAgfVxuICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLnBlcm1pc3Npb25fc2V0KSAmJiBpbXBfZGF0YS5wZXJtaXNzaW9uX3NldC5sZW5ndGggPiAwKSB7XG4gICAgXy5lYWNoKGltcF9kYXRhLnBlcm1pc3Npb25fc2V0LCBmdW5jdGlvbihwZXJtaXNzaW9uX3NldCkge1xuICAgICAgdmFyIGFzc2lnbmVkX2FwcHMsIG5ld19pZCwgb2xkX2lkLCBwZXJtaXNzaW9uX3NldF91c2VycztcbiAgICAgIG9sZF9pZCA9IHBlcm1pc3Npb25fc2V0Ll9pZDtcbiAgICAgIGRlbGV0ZSBwZXJtaXNzaW9uX3NldC5faWQ7XG4gICAgICBwZXJtaXNzaW9uX3NldC5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgcGVybWlzc2lvbl9zZXQub3duZXIgPSB1c2VySWQ7XG4gICAgICBwZXJtaXNzaW9uX3NldF91c2VycyA9IFtdO1xuICAgICAgXy5lYWNoKHBlcm1pc3Npb25fc2V0LnVzZXJzLCBmdW5jdGlvbih1c2VyX2lkKSB7XG4gICAgICAgIHZhciBzcGFjZV91c2VyO1xuICAgICAgICBzcGFjZV91c2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIHVzZXI6IHVzZXJfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHNwYWNlX3VzZXIpIHtcbiAgICAgICAgICByZXR1cm4gcGVybWlzc2lvbl9zZXRfdXNlcnMucHVzaCh1c2VyX2lkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NpZ25lZF9hcHBzID0gW107XG4gICAgICBfLmVhY2gocGVybWlzc2lvbl9zZXQuYXNzaWduZWRfYXBwcywgZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgICAgIGlmIChfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuQXBwcyksIGFwcF9pZCkpIHtcbiAgICAgICAgICByZXR1cm4gYXNzaWduZWRfYXBwcy5wdXNoKGFwcF9pZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXBwc19pZF9tYXBzW2FwcF9pZF0pIHtcbiAgICAgICAgICByZXR1cm4gYXNzaWduZWRfYXBwcy5wdXNoKGFwcHNfaWRfbWFwc1thcHBfaWRdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBuZXdfaWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5pbnNlcnQocGVybWlzc2lvbl9zZXQpO1xuICAgICAgcmV0dXJuIHBlcm1pc3Npb25fc2V0X2lkX21hcHNbb2xkX2lkXSA9IG5ld19pZDtcbiAgICB9KTtcbiAgfVxuICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cykgJiYgaW1wX2RhdGEucGVybWlzc2lvbl9vYmplY3RzLmxlbmd0aCA+IDApIHtcbiAgICBfLmVhY2goaW1wX2RhdGEucGVybWlzc2lvbl9vYmplY3RzLCBmdW5jdGlvbihwZXJtaXNzaW9uX29iamVjdCkge1xuICAgICAgdmFyIGRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICBkZWxldGUgcGVybWlzc2lvbl9vYmplY3QuX2lkO1xuICAgICAgcGVybWlzc2lvbl9vYmplY3Quc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIHBlcm1pc3Npb25fb2JqZWN0Lm93bmVyID0gdXNlcklkO1xuICAgICAgcGVybWlzc2lvbl9vYmplY3QucGVybWlzc2lvbl9zZXRfaWQgPSBwZXJtaXNzaW9uX3NldF9pZF9tYXBzW3Blcm1pc3Npb25fb2JqZWN0LnBlcm1pc3Npb25fc2V0X2lkXTtcbiAgICAgIGRpc2FibGVkX2xpc3Rfdmlld3MgPSBbXTtcbiAgICAgIF8uZWFjaChwZXJtaXNzaW9uX29iamVjdC5kaXNhYmxlZF9saXN0X3ZpZXdzLCBmdW5jdGlvbihsaXN0X3ZpZXdfaWQpIHtcbiAgICAgICAgdmFyIG5ld192aWV3X2lkO1xuICAgICAgICBuZXdfdmlld19pZCA9IGxpc3Rfdmlld3NfaWRfbWFwc1twZXJtaXNzaW9uX29iamVjdC5vYmplY3RfbmFtZSArIFwiX1wiICsgbGlzdF92aWV3X2lkXTtcbiAgICAgICAgaWYgKG5ld192aWV3X2lkKSB7XG4gICAgICAgICAgcmV0dXJuIGRpc2FibGVkX2xpc3Rfdmlld3MucHVzaChuZXdfdmlld19pZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5pbnNlcnQocGVybWlzc2lvbl9vYmplY3QpO1xuICAgIH0pO1xuICB9XG4gIGlmIChfLmlzQXJyYXkoaW1wX2RhdGEucmVwb3J0cykgJiYgaW1wX2RhdGEucmVwb3J0cy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIF8uZWFjaChpbXBfZGF0YS5yZXBvcnRzLCBmdW5jdGlvbihyZXBvcnQpIHtcbiAgICAgIGRlbGV0ZSByZXBvcnQuX2lkO1xuICAgICAgcmVwb3J0LnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICByZXBvcnQub3duZXIgPSB1c2VySWQ7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicmVwb3J0c1wiKS5pbnNlcnQocmVwb3J0KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8q5pWw5o2u5oyB5LmF5YyWIOe7k+adnyAqL1xufTtcblxuXG4vKueUseS6juS9v+eUqOaOpeWPo+aWueW8j+S8muWvvOiHtGNvbGxlY3Rpb27nmoRhZnRlcuOAgWJlZm9yZeS4reiOt+WPluS4jeWIsHVzZXJJZO+8jOWGjeatpOmXrumimOacquino+WGs+S5i+WJje+8jOi/mOaYr+S9v+eUqE1ldGhvZFxuSnNvblJvdXRlcy5hZGQgJ3Bvc3QnLCAnL2FwaS9jcmVhdG9yL2FwcF9wYWNrYWdlL2ltcG9ydC86c3BhY2VfaWQnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdHRyeVxuXHRcdHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcyk7XG5cdFx0c3BhY2VfaWQgPSByZXEucGFyYW1zLnNwYWNlX2lkXG5cdFx0aW1wX2RhdGEgPSByZXEuYm9keVxuXHRcdGltcG9ydF9hcHBfcGFja2FnZSh1c2VySWQsIHNwYWNlX2lkLCBpbXBfZGF0YSlcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRjb2RlOiAyMDBcblx0XHRcdGRhdGE6IHt9XG5cdFx0fVxuXHRjYXRjaCBlXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogZS5lcnJvclxuXHRcdFx0ZGF0YTogeyBlcnJvcnM6IGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlIH1cblx0XHR9XG4gKi9cblxuTWV0ZW9yLm1ldGhvZHMoe1xuICAnaW1wb3J0X2FwcF9wYWNrYWdlJzogZnVuY3Rpb24oc3BhY2VfaWQsIGltcF9kYXRhKSB7XG4gICAgdmFyIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICByZXR1cm4gQ3JlYXRvci5pbXBvcnRfYXBwX3BhY2thZ2UodXNlcklkLCBzcGFjZV9pZCwgaW1wX2RhdGEpO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdFwiY3JlYXRvci5saXN0dmlld3Nfb3B0aW9uc1wiOiAob3B0aW9ucyktPlxuXHRcdGlmIG9wdGlvbnM/LnBhcmFtcz8ucmVmZXJlbmNlX3RvXG5cblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9wdGlvbnMucGFyYW1zLnJlZmVyZW5jZV90bylcblxuXHRcdFx0bmFtZV9maWVsZF9rZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVlcblxuXHRcdFx0cXVlcnkgPSB7fVxuXHRcdFx0aWYgb3B0aW9ucy5wYXJhbXMuc3BhY2Vcblx0XHRcdFx0cXVlcnkuc3BhY2UgPSBvcHRpb25zLnBhcmFtcy5zcGFjZVxuXG5cdFx0XHRcdHNvcnQgPSBvcHRpb25zPy5zb3J0XG5cblx0XHRcdFx0c2VsZWN0ZWQgPSBvcHRpb25zPy5zZWxlY3RlZCB8fCBbXVxuXG5cdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdFx0XHRcdHNlYXJjaFRleHRRdWVyeSA9IHt9XG5cdFx0XHRcdFx0c2VhcmNoVGV4dFF1ZXJ5W25hbWVfZmllbGRfa2V5XSA9IHskcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dH1cblxuXHRcdFx0XHRpZiBvcHRpb25zPy52YWx1ZXM/Lmxlbmd0aFxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdFx0XHRcdFx0cXVlcnkuJG9yID0gW3tfaWQ6IHskaW46IG9wdGlvbnMudmFsdWVzfX0sIHNlYXJjaFRleHRRdWVyeSwge29iamVjdF9uYW1lOiB7JHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHR9fV1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRxdWVyeS4kb3IgPSBbe19pZDogeyRpbjogb3B0aW9ucy52YWx1ZXN9fV1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdFx0XHRcdFx0Xy5leHRlbmQocXVlcnksIHskb3I6IFtzZWFyY2hUZXh0UXVlcnksICB7b2JqZWN0X25hbWU6IHskcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dH19XX0pXG5cdFx0XHRcdFx0cXVlcnkuX2lkID0geyRuaW46IHNlbGVjdGVkfVxuXG5cdFx0XHRcdGNvbGxlY3Rpb24gPSBvYmplY3QuZGJcblxuXHRcdFx0XHRpZiBvcHRpb25zLmZpbHRlclF1ZXJ5XG5cdFx0XHRcdFx0Xy5leHRlbmQgcXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnlcblxuXHRcdFx0XHRxdWVyeV9vcHRpb25zID0ge2xpbWl0OiAxMH1cblxuXHRcdFx0XHRpZiBzb3J0ICYmIF8uaXNPYmplY3Qoc29ydClcblx0XHRcdFx0XHRxdWVyeV9vcHRpb25zLnNvcnQgPSBzb3J0XG5cblx0XHRcdFx0aWYgY29sbGVjdGlvblxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0cmVjb3JkcyA9IGNvbGxlY3Rpb24uZmluZChxdWVyeSwgcXVlcnlfb3B0aW9ucykuZmV0Y2goKVxuXHRcdFx0XHRcdFx0cmVzdWx0cyA9IFtdXG5cdFx0XHRcdFx0XHRfLmVhY2ggcmVjb3JkcywgKHJlY29yZCktPlxuXHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlY29yZC5vYmplY3RfbmFtZSk/Lm5hbWUgfHwgXCJcIlxuXHRcdFx0XHRcdFx0XHRpZiAhXy5pc0VtcHR5KG9iamVjdF9uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdG9iamVjdF9uYW1lID0gXCIgKCN7b2JqZWN0X25hbWV9KVwiXG5cblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoXG5cdFx0XHRcdFx0XHRcdFx0bGFiZWw6IHJlY29yZFtuYW1lX2ZpZWxkX2tleV0gKyBvYmplY3RfbmFtZVxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlOiByZWNvcmQuX2lkXG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0c1xuXHRcdFx0XHRcdGNhdGNoIGVcblx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBlLm1lc3NhZ2UgKyBcIi0tPlwiICsgSlNPTi5zdHJpbmdpZnkob3B0aW9ucylcblx0XHRyZXR1cm4gW10gIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBcImNyZWF0b3IubGlzdHZpZXdzX29wdGlvbnNcIjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBjb2xsZWN0aW9uLCBlLCBuYW1lX2ZpZWxkX2tleSwgb2JqZWN0LCBxdWVyeSwgcXVlcnlfb3B0aW9ucywgcmVjb3JkcywgcmVmLCByZWYxLCByZXN1bHRzLCBzZWFyY2hUZXh0UXVlcnksIHNlbGVjdGVkLCBzb3J0O1xuICAgIGlmIChvcHRpb25zICE9IG51bGwgPyAocmVmID0gb3B0aW9ucy5wYXJhbXMpICE9IG51bGwgPyByZWYucmVmZXJlbmNlX3RvIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvcHRpb25zLnBhcmFtcy5yZWZlcmVuY2VfdG8pO1xuICAgICAgbmFtZV9maWVsZF9rZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVk7XG4gICAgICBxdWVyeSA9IHt9O1xuICAgICAgaWYgKG9wdGlvbnMucGFyYW1zLnNwYWNlKSB7XG4gICAgICAgIHF1ZXJ5LnNwYWNlID0gb3B0aW9ucy5wYXJhbXMuc3BhY2U7XG4gICAgICAgIHNvcnQgPSBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNvcnQgOiB2b2lkIDA7XG4gICAgICAgIHNlbGVjdGVkID0gKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc2VsZWN0ZWQgOiB2b2lkIDApIHx8IFtdO1xuICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgc2VhcmNoVGV4dFF1ZXJ5ID0ge307XG4gICAgICAgICAgc2VhcmNoVGV4dFF1ZXJ5W25hbWVfZmllbGRfa2V5XSA9IHtcbiAgICAgICAgICAgICRyZWdleDogb3B0aW9ucy5zZWFyY2hUZXh0XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucyAhPSBudWxsID8gKHJlZjEgPSBvcHRpb25zLnZhbHVlcykgIT0gbnVsbCA/IHJlZjEubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgcXVlcnkuJG9yID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAkaW46IG9wdGlvbnMudmFsdWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LCBzZWFyY2hUZXh0UXVlcnksIHtcbiAgICAgICAgICAgICAgICBvYmplY3RfbmFtZToge1xuICAgICAgICAgICAgICAgICAgJHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHF1ZXJ5LiRvciA9IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgJGluOiBvcHRpb25zLnZhbHVlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgXy5leHRlbmQocXVlcnksIHtcbiAgICAgICAgICAgICAgJG9yOiBbXG4gICAgICAgICAgICAgICAgc2VhcmNoVGV4dFF1ZXJ5LCB7XG4gICAgICAgICAgICAgICAgICBvYmplY3RfbmFtZToge1xuICAgICAgICAgICAgICAgICAgICAkcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHF1ZXJ5Ll9pZCA9IHtcbiAgICAgICAgICAgICRuaW46IHNlbGVjdGVkXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBjb2xsZWN0aW9uID0gb2JqZWN0LmRiO1xuICAgICAgICBpZiAob3B0aW9ucy5maWx0ZXJRdWVyeSkge1xuICAgICAgICAgIF8uZXh0ZW5kKHF1ZXJ5LCBvcHRpb25zLmZpbHRlclF1ZXJ5KTtcbiAgICAgICAgfVxuICAgICAgICBxdWVyeV9vcHRpb25zID0ge1xuICAgICAgICAgIGxpbWl0OiAxMFxuICAgICAgICB9O1xuICAgICAgICBpZiAoc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpKSB7XG4gICAgICAgICAgcXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpO1xuICAgICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgXy5lYWNoKHJlY29yZHMsIGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICAgICAgICB2YXIgb2JqZWN0X25hbWUsIHJlZjI7XG4gICAgICAgICAgICAgIG9iamVjdF9uYW1lID0gKChyZWYyID0gQ3JlYXRvci5nZXRPYmplY3QocmVjb3JkLm9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZjIubmFtZSA6IHZvaWQgMCkgfHwgXCJcIjtcbiAgICAgICAgICAgICAgaWYgKCFfLmlzRW1wdHkob2JqZWN0X25hbWUpKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWUgPSBcIiAoXCIgKyBvYmplY3RfbmFtZSArIFwiKVwiO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgICAgIGxhYmVsOiByZWNvcmRbbmFtZV9maWVsZF9rZXldICsgb2JqZWN0X25hbWUsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5faWRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgZS5tZXNzYWdlICsgXCItLT5cIiArIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG59KTtcbiIsIiPojrflj5blupTnlKjkuIvnmoTlr7nosaFcbmdldEFwcE9iamVjdHMgPSAoYXBwKS0+XG5cdGFwcE9iamVjdHMgPSBbXVxuXHRpZiBhcHAgJiYgXy5pc0FycmF5KGFwcC5vYmplY3RzKSAmJiBhcHAub2JqZWN0cy5sZW5ndGggPiAwXG5cdFx0Xy5lYWNoIGFwcC5vYmplY3RzLCAob2JqZWN0X25hbWUpLT5cblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdFx0aWYgb2JqZWN0XG5cdFx0XHRcdGFwcE9iamVjdHMucHVzaCBvYmplY3RfbmFtZVxuXHRyZXR1cm4gYXBwT2JqZWN0c1xuXG4j6I635Y+W5a+56LGh5LiL55qE5YiX6KGo6KeG5Zu+XG5nZXRPYmplY3RzTGlzdFZpZXdzID0gKHNwYWNlX2lkLCBvYmplY3RzX25hbWUpLT5cblx0b2JqZWN0c0xpc3RWaWV3cyA9IFtdXG5cdGlmIG9iamVjdHNfbmFtZSAmJiBfLmlzQXJyYXkob2JqZWN0c19uYW1lKSAmJiBvYmplY3RzX25hbWUubGVuZ3RoID4gMFxuXHRcdF8uZWFjaCBvYmplY3RzX25hbWUsIChvYmplY3RfbmFtZSktPlxuXHRcdFx0I+iOt+WPluWvueixoeeahOWFseS6q+WIl+ihqOinhuWbvmxpc3Rfdmlld3Ncblx0XHRcdGxpc3Rfdmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc3BhY2U6IHNwYWNlX2lkLCBzaGFyZWQ6IHRydWV9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXG5cdFx0XHRsaXN0X3ZpZXdzLmZvckVhY2ggKGxpc3RfdmlldyktPlxuXHRcdFx0XHRvYmplY3RzTGlzdFZpZXdzLnB1c2ggbGlzdF92aWV3Ll9pZFxuXHRyZXR1cm4gb2JqZWN0c0xpc3RWaWV3c1xuXG4j6I635Y+W5a+56LGh5LiL55qE5oql6KGoXG5nZXRPYmplY3RzUmVwb3J0cyA9IChzcGFjZV9pZCwgb2JqZWN0c19uYW1lKS0+XG5cdG9iamVjdHNSZXBvcnRzID0gW11cblx0aWYgb2JqZWN0c19uYW1lICYmIF8uaXNBcnJheShvYmplY3RzX25hbWUpICYmIG9iamVjdHNfbmFtZS5sZW5ndGggPiAwXG5cdFx0Xy5lYWNoIG9iamVjdHNfbmFtZSwgKG9iamVjdF9uYW1lKS0+XG5cdFx0XHQj6I635Y+W5a+56LGh55qE5oql6KGocmVwb3J0c1xuXHRcdFx0cmVwb3J0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInJlcG9ydHNcIikuZmluZCh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBzcGFjZTogc3BhY2VfaWR9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXG5cdFx0XHRyZXBvcnRzLmZvckVhY2ggKHJlcG9ydCktPlxuXHRcdFx0XHRvYmplY3RzUmVwb3J0cy5wdXNoIHJlcG9ydC5faWRcblx0cmV0dXJuIG9iamVjdHNSZXBvcnRzXG5cbiPojrflj5blr7nosaHkuIvnmoTmnYPpmZDpm4ZcbmdldE9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cyA9IChzcGFjZV9pZCwgb2JqZWN0c19uYW1lKS0+XG5cdG9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cyA9IFtdXG5cdGlmIG9iamVjdHNfbmFtZSAmJiBfLmlzQXJyYXkob2JqZWN0c19uYW1lKSAmJiBvYmplY3RzX25hbWUubGVuZ3RoID4gMFxuXHRcdF8uZWFjaCBvYmplY3RzX25hbWUsIChvYmplY3RfbmFtZSktPlxuXHRcdFx0cGVybWlzc2lvbl9vYmplY3RzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc3BhY2U6IHNwYWNlX2lkfSwge2ZpZWxkczoge19pZDogMX19KVxuXHRcdFx0cGVybWlzc2lvbl9vYmplY3RzLmZvckVhY2ggKHBlcm1pc3Npb25fb2JqZWN0KS0+XG5cdFx0XHRcdG9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cy5wdXNoIHBlcm1pc3Npb25fb2JqZWN0Ll9pZFxuXHRyZXR1cm4gb2JqZWN0c1Blcm1pc3Npb25PYmplY3RzXG5cbiPojrflj5blr7nosaHkuIvmnYPpmZDpm4blr7nlupTnmoTmnYPpmZDpm4ZcbmdldE9iamVjdHNQZXJtaXNzaW9uU2V0ID0gKHNwYWNlX2lkLCBvYmplY3RzX25hbWUpLT5cblx0b2JqZWN0c1Blcm1pc3Npb25TZXQgPSBbXVxuXHRpZiBvYmplY3RzX25hbWUgJiYgXy5pc0FycmF5KG9iamVjdHNfbmFtZSkgJiYgb2JqZWN0c19uYW1lLmxlbmd0aCA+IDBcblx0XHRfLmVhY2ggb2JqZWN0c19uYW1lLCAob2JqZWN0X25hbWUpLT5cblx0XHRcdHBlcm1pc3Npb25fb2JqZWN0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNwYWNlOiBzcGFjZV9pZH0sIHtmaWVsZHM6IHtwZXJtaXNzaW9uX3NldF9pZDogMX19KVxuXHRcdFx0cGVybWlzc2lvbl9vYmplY3RzLmZvckVhY2ggKHBlcm1pc3Npb25fb2JqZWN0KS0+XG5cdFx0XHRcdHBlcm1pc3Npb25fc2V0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7X2lkOiBwZXJtaXNzaW9uX29iamVjdC5wZXJtaXNzaW9uX3NldF9pZH0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcblx0XHRcdFx0b2JqZWN0c1Blcm1pc3Npb25TZXQucHVzaCBwZXJtaXNzaW9uX3NldC5faWRcblx0cmV0dXJuIG9iamVjdHNQZXJtaXNzaW9uU2V0XG5cblxuTWV0ZW9yLm1ldGhvZHNcblx0XCJhcHBQYWNrYWdlLmluaXRfZXhwb3J0X2RhdGFcIjogKHNwYWNlX2lkLCByZWNvcmRfaWQpLT5cblx0XHR1c2VySWQgPSB0aGlzLnVzZXJJZFxuXHRcdGlmICF1c2VySWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI0MDFcIiwgXCJBdXRoZW50aWNhdGlvbiBpcyByZXF1aXJlZCBhbmQgaGFzIG5vdCBiZWVuIHByb3ZpZGVkLlwiKVxuXG5cdFx0aWYgIUNyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCB1c2VySWQpXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNDAxXCIsIFwiUGVybWlzc2lvbiBkZW5pZWQuXCIpXG5cblx0XHRyZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBsaWNhdGlvbl9wYWNrYWdlXCIpLmZpbmRPbmUoe19pZDogcmVjb3JkX2lkfSlcblxuXHRcdGlmICghXy5pc0FycmF5KHJlY29yZD8uYXBwcykgfHwgcmVjb3JkPy5hcHBzPy5sZW5ndGggPCAxKSAmJiAoIV8uaXNBcnJheShyZWNvcmQ/Lm9iamVjdHMpIHx8IHJlY29yZD8ub2JqZWN0cz8ubGVuZ3RoIDwgMSlcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLor7flhYjpgInmi6nlupTnlKjmiJbogIXlr7nosaFcIilcblxuXHRcdGRhdGEgPSB7fVxuXHRcdF9vYmplY3RzID0gcmVjb3JkLm9iamVjdHMgfHwgW11cblx0XHRfb2JqZWN0c19saXN0X3ZpZXdzID0gcmVjb3JkLmxpc3Rfdmlld3MgfHwgW11cblx0XHRfb2JqZWN0c19yZXBvcnRzID0gcmVjb3JkLnJlcG9ydHMgfHwgW11cblx0XHRfb2JqZWN0c19wZXJtaXNzaW9uX29iamVjdHMgPSByZWNvcmQucGVybWlzc2lvbl9vYmplY3RzIHx8IFtdXG5cdFx0X29iamVjdHNfcGVybWlzc2lvbl9zZXQgPSByZWNvcmQucGVybWlzc2lvbl9zZXQgfHwgW11cblxuXHRcdHRyeVxuXHRcdFx0aWYgXy5pc0FycmF5KHJlY29yZD8uYXBwcykgJiYgcmVjb3JkLmFwcHMubGVuZ3RoID4gMFxuXHRcdFx0XHRfLmVhY2ggcmVjb3JkLmFwcHMsIChhcHBJZCktPlxuXHRcdFx0XHRcdGlmICFhcHBcblx0XHRcdFx0XHRcdCPlpoLmnpzku47ku6PnoIHkuK3lrprkuYnnmoRhcHBz5Lit5rKh5pyJ5om+5Yiw77yM5YiZ5LuO5pWw5o2u5bqT5Lit6I635Y+WXG5cdFx0XHRcdFx0XHRhcHAgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBzXCIpLmZpbmRPbmUoe19pZDogYXBwSWQsIGlzX2NyZWF0b3I6IHRydWV9LCB7ZmllbGRzOiB7b2JqZWN0czogMX19KVxuXHRcdFx0XHRcdF9vYmplY3RzID0gX29iamVjdHMuY29uY2F0KGdldEFwcE9iamVjdHMoYXBwKSlcblxuXHRcdFx0aWYgXy5pc0FycmF5KF9vYmplY3RzKSAmJiBfb2JqZWN0cy5sZW5ndGggPiAwXG5cdFx0XHRcdF9vYmplY3RzX2xpc3Rfdmlld3MgPSBfb2JqZWN0c19saXN0X3ZpZXdzLmNvbmNhdChnZXRPYmplY3RzTGlzdFZpZXdzKHNwYWNlX2lkLCBfb2JqZWN0cykpXG5cdFx0XHRcdF9vYmplY3RzX3JlcG9ydHMgPSBfb2JqZWN0c19yZXBvcnRzLmNvbmNhdChnZXRPYmplY3RzUmVwb3J0cyhzcGFjZV9pZCwgX29iamVjdHMpKVxuXHRcdFx0XHRfb2JqZWN0c19wZXJtaXNzaW9uX29iamVjdHMgPSBfb2JqZWN0c19wZXJtaXNzaW9uX29iamVjdHMuY29uY2F0KGdldE9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cyhzcGFjZV9pZCwgX29iamVjdHMpKVxuXHRcdFx0XHRfb2JqZWN0c19wZXJtaXNzaW9uX3NldCA9IF9vYmplY3RzX3Blcm1pc3Npb25fc2V0LmNvbmNhdChnZXRPYmplY3RzUGVybWlzc2lvblNldChzcGFjZV9pZCwgX29iamVjdHMpKVxuXG5cdFx0XHRcdGRhdGEub2JqZWN0cyA9IF8udW5pcSBfb2JqZWN0c1xuXHRcdFx0XHRkYXRhLmxpc3Rfdmlld3MgPSBfLnVuaXEgX29iamVjdHNfbGlzdF92aWV3c1xuXHRcdFx0XHRkYXRhLnBlcm1pc3Npb25fc2V0ID0gXy51bmlxIF9vYmplY3RzX3Blcm1pc3Npb25fc2V0XG5cdFx0XHRcdGRhdGEucGVybWlzc2lvbl9vYmplY3RzID0gXy51bmlxIF9vYmplY3RzX3Blcm1pc3Npb25fb2JqZWN0c1xuXHRcdFx0XHRkYXRhLnJlcG9ydHMgPSBfLnVuaXEgX29iamVjdHNfcmVwb3J0c1xuXHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBsaWNhdGlvbl9wYWNrYWdlXCIpLnVwZGF0ZSh7X2lkOiByZWNvcmQuX2lkfSx7JHNldDogZGF0YX0pXG5cdFx0Y2F0Y2ggZVxuXHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIGUucmVhc29uIHx8IGUubWVzc2FnZSApIiwidmFyIGdldEFwcE9iamVjdHMsIGdldE9iamVjdHNMaXN0Vmlld3MsIGdldE9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cywgZ2V0T2JqZWN0c1Blcm1pc3Npb25TZXQsIGdldE9iamVjdHNSZXBvcnRzO1xuXG5nZXRBcHBPYmplY3RzID0gZnVuY3Rpb24oYXBwKSB7XG4gIHZhciBhcHBPYmplY3RzO1xuICBhcHBPYmplY3RzID0gW107XG4gIGlmIChhcHAgJiYgXy5pc0FycmF5KGFwcC5vYmplY3RzKSAmJiBhcHAub2JqZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgXy5lYWNoKGFwcC5vYmplY3RzLCBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgICAgdmFyIG9iamVjdDtcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICAgIGlmIChvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGFwcE9iamVjdHMucHVzaChvYmplY3RfbmFtZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGFwcE9iamVjdHM7XG59O1xuXG5nZXRPYmplY3RzTGlzdFZpZXdzID0gZnVuY3Rpb24oc3BhY2VfaWQsIG9iamVjdHNfbmFtZSkge1xuICB2YXIgb2JqZWN0c0xpc3RWaWV3cztcbiAgb2JqZWN0c0xpc3RWaWV3cyA9IFtdO1xuICBpZiAob2JqZWN0c19uYW1lICYmIF8uaXNBcnJheShvYmplY3RzX25hbWUpICYmIG9iamVjdHNfbmFtZS5sZW5ndGggPiAwKSB7XG4gICAgXy5lYWNoKG9iamVjdHNfbmFtZSwgZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICAgIHZhciBsaXN0X3ZpZXdzO1xuICAgICAgbGlzdF92aWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICBzaGFyZWQ6IHRydWVcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGxpc3Rfdmlld3MuZm9yRWFjaChmdW5jdGlvbihsaXN0X3ZpZXcpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdHNMaXN0Vmlld3MucHVzaChsaXN0X3ZpZXcuX2lkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3RzTGlzdFZpZXdzO1xufTtcblxuZ2V0T2JqZWN0c1JlcG9ydHMgPSBmdW5jdGlvbihzcGFjZV9pZCwgb2JqZWN0c19uYW1lKSB7XG4gIHZhciBvYmplY3RzUmVwb3J0cztcbiAgb2JqZWN0c1JlcG9ydHMgPSBbXTtcbiAgaWYgKG9iamVjdHNfbmFtZSAmJiBfLmlzQXJyYXkob2JqZWN0c19uYW1lKSAmJiBvYmplY3RzX25hbWUubGVuZ3RoID4gMCkge1xuICAgIF8uZWFjaChvYmplY3RzX25hbWUsIGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgICB2YXIgcmVwb3J0cztcbiAgICAgIHJlcG9ydHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJyZXBvcnRzXCIpLmZpbmQoe1xuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVwb3J0cy5mb3JFYWNoKGZ1bmN0aW9uKHJlcG9ydCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0c1JlcG9ydHMucHVzaChyZXBvcnQuX2lkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3RzUmVwb3J0cztcbn07XG5cbmdldE9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cyA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBvYmplY3RzX25hbWUpIHtcbiAgdmFyIG9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cztcbiAgb2JqZWN0c1Blcm1pc3Npb25PYmplY3RzID0gW107XG4gIGlmIChvYmplY3RzX25hbWUgJiYgXy5pc0FycmF5KG9iamVjdHNfbmFtZSkgJiYgb2JqZWN0c19uYW1lLmxlbmd0aCA+IDApIHtcbiAgICBfLmVhY2gob2JqZWN0c19uYW1lLCBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgICAgdmFyIHBlcm1pc3Npb25fb2JqZWN0cztcbiAgICAgIHBlcm1pc3Npb25fb2JqZWN0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHBlcm1pc3Npb25fb2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBvYmplY3RzUGVybWlzc2lvbk9iamVjdHMucHVzaChwZXJtaXNzaW9uX29iamVjdC5faWQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cztcbn07XG5cbmdldE9iamVjdHNQZXJtaXNzaW9uU2V0ID0gZnVuY3Rpb24oc3BhY2VfaWQsIG9iamVjdHNfbmFtZSkge1xuICB2YXIgb2JqZWN0c1Blcm1pc3Npb25TZXQ7XG4gIG9iamVjdHNQZXJtaXNzaW9uU2V0ID0gW107XG4gIGlmIChvYmplY3RzX25hbWUgJiYgXy5pc0FycmF5KG9iamVjdHNfbmFtZSkgJiYgb2JqZWN0c19uYW1lLmxlbmd0aCA+IDApIHtcbiAgICBfLmVhY2gob2JqZWN0c19uYW1lLCBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgICAgdmFyIHBlcm1pc3Npb25fb2JqZWN0cztcbiAgICAgIHBlcm1pc3Npb25fb2JqZWN0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcGVybWlzc2lvbl9vYmplY3RzLmZvckVhY2goZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3QpIHtcbiAgICAgICAgdmFyIHBlcm1pc3Npb25fc2V0O1xuICAgICAgICBwZXJtaXNzaW9uX3NldCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgICAgIF9pZDogcGVybWlzc2lvbl9vYmplY3QucGVybWlzc2lvbl9zZXRfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9iamVjdHNQZXJtaXNzaW9uU2V0LnB1c2gocGVybWlzc2lvbl9zZXQuX2lkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3RzUGVybWlzc2lvblNldDtcbn07XG5cbk1ldGVvci5tZXRob2RzKHtcbiAgXCJhcHBQYWNrYWdlLmluaXRfZXhwb3J0X2RhdGFcIjogZnVuY3Rpb24oc3BhY2VfaWQsIHJlY29yZF9pZCkge1xuICAgIHZhciBfb2JqZWN0cywgX29iamVjdHNfbGlzdF92aWV3cywgX29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzLCBfb2JqZWN0c19wZXJtaXNzaW9uX3NldCwgX29iamVjdHNfcmVwb3J0cywgZGF0YSwgZSwgcmVjb3JkLCByZWYsIHJlZjEsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjQwMVwiLCBcIkF1dGhlbnRpY2F0aW9uIGlzIHJlcXVpcmVkIGFuZCBoYXMgbm90IGJlZW4gcHJvdmlkZWQuXCIpO1xuICAgIH1cbiAgICBpZiAoIUNyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCB1c2VySWQpKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNDAxXCIsIFwiUGVybWlzc2lvbiBkZW5pZWQuXCIpO1xuICAgIH1cbiAgICByZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBsaWNhdGlvbl9wYWNrYWdlXCIpLmZpbmRPbmUoe1xuICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICB9KTtcbiAgICBpZiAoKCFfLmlzQXJyYXkocmVjb3JkICE9IG51bGwgPyByZWNvcmQuYXBwcyA6IHZvaWQgMCkgfHwgKHJlY29yZCAhPSBudWxsID8gKHJlZiA9IHJlY29yZC5hcHBzKSAhPSBudWxsID8gcmVmLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkgPCAxKSAmJiAoIV8uaXNBcnJheShyZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5vYmplY3RzIDogdm9pZCAwKSB8fCAocmVjb3JkICE9IG51bGwgPyAocmVmMSA9IHJlY29yZC5vYmplY3RzKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIDwgMSkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLor7flhYjpgInmi6nlupTnlKjmiJbogIXlr7nosaFcIik7XG4gICAgfVxuICAgIGRhdGEgPSB7fTtcbiAgICBfb2JqZWN0cyA9IHJlY29yZC5vYmplY3RzIHx8IFtdO1xuICAgIF9vYmplY3RzX2xpc3Rfdmlld3MgPSByZWNvcmQubGlzdF92aWV3cyB8fCBbXTtcbiAgICBfb2JqZWN0c19yZXBvcnRzID0gcmVjb3JkLnJlcG9ydHMgfHwgW107XG4gICAgX29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzID0gcmVjb3JkLnBlcm1pc3Npb25fb2JqZWN0cyB8fCBbXTtcbiAgICBfb2JqZWN0c19wZXJtaXNzaW9uX3NldCA9IHJlY29yZC5wZXJtaXNzaW9uX3NldCB8fCBbXTtcbiAgICB0cnkge1xuICAgICAgaWYgKF8uaXNBcnJheShyZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5hcHBzIDogdm9pZCAwKSAmJiByZWNvcmQuYXBwcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIF8uZWFjaChyZWNvcmQuYXBwcywgZnVuY3Rpb24oYXBwSWQpIHtcbiAgICAgICAgICB2YXIgYXBwO1xuICAgICAgICAgIGlmICghYXBwKSB7XG4gICAgICAgICAgICBhcHAgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBzXCIpLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IGFwcElkLFxuICAgICAgICAgICAgICBpc19jcmVhdG9yOiB0cnVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIG9iamVjdHM6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfb2JqZWN0cyA9IF9vYmplY3RzLmNvbmNhdChnZXRBcHBPYmplY3RzKGFwcCkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChfLmlzQXJyYXkoX29iamVjdHMpICYmIF9vYmplY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgX29iamVjdHNfbGlzdF92aWV3cyA9IF9vYmplY3RzX2xpc3Rfdmlld3MuY29uY2F0KGdldE9iamVjdHNMaXN0Vmlld3Moc3BhY2VfaWQsIF9vYmplY3RzKSk7XG4gICAgICAgIF9vYmplY3RzX3JlcG9ydHMgPSBfb2JqZWN0c19yZXBvcnRzLmNvbmNhdChnZXRPYmplY3RzUmVwb3J0cyhzcGFjZV9pZCwgX29iamVjdHMpKTtcbiAgICAgICAgX29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzID0gX29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzLmNvbmNhdChnZXRPYmplY3RzUGVybWlzc2lvbk9iamVjdHMoc3BhY2VfaWQsIF9vYmplY3RzKSk7XG4gICAgICAgIF9vYmplY3RzX3Blcm1pc3Npb25fc2V0ID0gX29iamVjdHNfcGVybWlzc2lvbl9zZXQuY29uY2F0KGdldE9iamVjdHNQZXJtaXNzaW9uU2V0KHNwYWNlX2lkLCBfb2JqZWN0cykpO1xuICAgICAgICBkYXRhLm9iamVjdHMgPSBfLnVuaXEoX29iamVjdHMpO1xuICAgICAgICBkYXRhLmxpc3Rfdmlld3MgPSBfLnVuaXEoX29iamVjdHNfbGlzdF92aWV3cyk7XG4gICAgICAgIGRhdGEucGVybWlzc2lvbl9zZXQgPSBfLnVuaXEoX29iamVjdHNfcGVybWlzc2lvbl9zZXQpO1xuICAgICAgICBkYXRhLnBlcm1pc3Npb25fb2JqZWN0cyA9IF8udW5pcShfb2JqZWN0c19wZXJtaXNzaW9uX29iamVjdHMpO1xuICAgICAgICBkYXRhLnJlcG9ydHMgPSBfLnVuaXEoX29iamVjdHNfcmVwb3J0cyk7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBsaWNhdGlvbl9wYWNrYWdlXCIpLnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiByZWNvcmQuX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiBkYXRhXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlID0gZXJyb3I7XG4gICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufSk7XG4iLCJAQVBUcmFuc2Zvcm0gPSB7fVxuXG5pZ25vcmVfZmllbGRzID0ge1xuXHRvd25lcjogMCxcblx0c3BhY2U6IDAsXG5cdGNyZWF0ZWQ6IDAsXG5cdGNyZWF0ZWRfYnk6IDAsXG5cdG1vZGlmaWVkOiAwLFxuXHRtb2RpZmllZF9ieTogMCxcblx0aXNfZGVsZXRlZDogMCxcblx0aW5zdGFuY2VzOiAwLFxuXHRzaGFyaW5nOiAwXG59XG5cbkFQVHJhbnNmb3JtLmV4cG9ydE9iamVjdCA9IChvYmplY3QpLT5cblx0X29iaiA9IHt9XG5cblx0Xy5leHRlbmQoX29iaiAsIG9iamVjdClcblxuXHRvYmpfbGlzdF92aWV3cyA9IHt9XG5cblx0Xy5leHRlbmQob2JqX2xpc3Rfdmlld3MsIF9vYmoubGlzdF92aWV3cyB8fCB7fSlcblxuXHRfLmVhY2ggb2JqX2xpc3Rfdmlld3MsICh2LCBrKS0+XG5cdFx0aWYgIV8uaGFzKHYsIFwiX2lkXCIpXG5cdFx0XHR2Ll9pZCA9IGtcblx0XHRpZiAhXy5oYXModiwgXCJuYW1lXCIpXG5cdFx0XHR2Lm5hbWUgPSBrXG5cdF9vYmoubGlzdF92aWV3cyA9IG9ial9saXN0X3ZpZXdzXG5cblxuXHQj5Y+q5L+u5pS5X29iauWxnuaAp+WOn29iamVjdOWxnuaAp+S/neaMgeS4jeWPmFxuXHR0cmlnZ2VycyA9IHt9XG5cdF8uZm9yRWFjaCBfb2JqLnRyaWdnZXJzLCAodHJpZ2dlciwga2V5KS0+XG5cdFx0X3RyaWdnZXIgPSB7fVxuXHRcdF8uZXh0ZW5kKF90cmlnZ2VyLCB0cmlnZ2VyKVxuXHRcdGlmIF8uaXNGdW5jdGlvbihfdHJpZ2dlci50b2RvKVxuXHRcdFx0X3RyaWdnZXIudG9kbyA9IF90cmlnZ2VyLnRvZG8udG9TdHJpbmcoKVxuXHRcdGRlbGV0ZSBfdHJpZ2dlci5fdG9kb1xuXHRcdHRyaWdnZXJzW2tleV0gPSBfdHJpZ2dlclxuXHRfb2JqLnRyaWdnZXJzID0gdHJpZ2dlcnNcblxuXHRhY3Rpb25zID0ge31cblx0Xy5mb3JFYWNoIF9vYmouYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XG5cdFx0X2FjdGlvbiA9IHt9XG5cdFx0Xy5leHRlbmQoX2FjdGlvbiwgYWN0aW9uKVxuXHRcdGlmIF8uaXNGdW5jdGlvbihfYWN0aW9uLnRvZG8pXG5cdFx0XHRfYWN0aW9uLnRvZG8gPSBfYWN0aW9uLnRvZG8udG9TdHJpbmcoKVxuXHRcdGRlbGV0ZSBfYWN0aW9uLl90b2RvXG5cdFx0YWN0aW9uc1trZXldID0gX2FjdGlvblxuXG5cdF9vYmouYWN0aW9ucyA9IGFjdGlvbnNcblxuXHRmaWVsZHMgPSB7fVxuXHRfLmZvckVhY2ggX29iai5maWVsZHMsIChmaWVsZCwga2V5KS0+XG5cdFx0X2ZpZWxkID0ge31cblx0XHRfLmV4dGVuZChfZmllbGQsIGZpZWxkKVxuXHRcdGlmIF8uaXNGdW5jdGlvbihfZmllbGQub3B0aW9ucylcblx0XHRcdF9maWVsZC5vcHRpb25zID0gX2ZpZWxkLm9wdGlvbnMudG9TdHJpbmcoKVxuXHRcdFx0ZGVsZXRlIF9maWVsZC5fb3B0aW9uc1xuXG5cdFx0aWYgXy5pc0FycmF5KF9maWVsZC5vcHRpb25zKVxuXHRcdFx0X2ZvID0gW11cblx0XHRcdF8uZm9yRWFjaCBfZmllbGQub3B0aW9ucywgKF9vMSktPlxuXHRcdFx0XHRfZm8ucHVzaChcIiN7X28xLmxhYmVsfToje19vMS52YWx1ZX1cIilcblx0XHRcdF9maWVsZC5vcHRpb25zID0gX2ZvLmpvaW4oXCIsXCIpXG5cdFx0XHRkZWxldGUgX2ZpZWxkLl9vcHRpb25zXG5cblx0XHRpZiBfZmllbGQucmVnRXhcblx0XHRcdF9maWVsZC5yZWdFeCA9IF9maWVsZC5yZWdFeC50b1N0cmluZygpXG5cdFx0XHRkZWxldGUgX2ZpZWxkLl9yZWdFeFxuXG5cdFx0aWYgXy5pc0Z1bmN0aW9uKF9maWVsZC5vcHRpb25zRnVuY3Rpb24pXG5cdFx0XHRfZmllbGQub3B0aW9uc0Z1bmN0aW9uID0gX2ZpZWxkLm9wdGlvbnNGdW5jdGlvbi50b1N0cmluZygpXG5cdFx0XHRkZWxldGUgX2ZpZWxkLl9vcHRpb25zRnVuY3Rpb25cblxuXHRcdGlmIF8uaXNGdW5jdGlvbihfZmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0X2ZpZWxkLnJlZmVyZW5jZV90byA9IF9maWVsZC5yZWZlcmVuY2VfdG8udG9TdHJpbmcoKVxuXHRcdFx0ZGVsZXRlIF9maWVsZC5fcmVmZXJlbmNlX3RvXG5cblx0XHRpZiBfLmlzRnVuY3Rpb24oX2ZpZWxkLmNyZWF0ZUZ1bmN0aW9uKVxuXHRcdFx0X2ZpZWxkLmNyZWF0ZUZ1bmN0aW9uID0gX2ZpZWxkLmNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKClcblx0XHRcdGRlbGV0ZSBfZmllbGQuX2NyZWF0ZUZ1bmN0aW9uXG5cblx0XHRpZiBfLmlzRnVuY3Rpb24oX2ZpZWxkLmRlZmF1bHRWYWx1ZSlcblx0XHRcdF9maWVsZC5kZWZhdWx0VmFsdWUgPSBfZmllbGQuZGVmYXVsdFZhbHVlLnRvU3RyaW5nKClcblx0XHRcdGRlbGV0ZSBfZmllbGQuX2RlZmF1bHRWYWx1ZVxuXHRcdCNUT0RPIOi9rOaNomZpZWxkLmF1dG9mb3JtLnR5cGXvvIzlt7LlkozmnLHmgJ3lmInnoa7orqTvvIznm67liY3kuI3mlK/mjIFhdXRvZm9ybS50eXBlIOS4umZ1bmN0aW9u57G75Z6LXG5cdFx0ZmllbGRzW2tleV0gPSBfZmllbGRcblxuXHRfb2JqLmZpZWxkcyA9IGZpZWxkc1xuXG5cdHJldHVybiBfb2JqXG5cbiMjI1xu5a+85Ye65pWw5o2uOlxue1xuXHRhcHBzOlt7fV0sIOi9r+S7tuWMhemAieS4reeahGFwcHNcblx0b2JqZWN0czpbe31dLCDpgInkuK3nmoRvYmplY3Tlj4rlhbZmaWVsZHMsIGxpc3Rfdmlld3MsIHRyaWdnZXJzLCBhY3Rpb25zLCBwZXJtaXNzaW9uX3NldOetiVxuICAgIGxpc3Rfdmlld3M6W3t9XSwg6L2v5Lu25YyF6YCJ5Lit55qEbGlzdF92aWV3c1xuICAgIHBlcm1pc3Npb25zOlt7fV0sIOi9r+S7tuWMhemAieS4reeahOadg+mZkOmbhlxuICAgIHBlcm1pc3Npb25fb2JqZWN0czpbe31dLCDova/ku7bljIXpgInkuK3nmoTmnYPpmZDlr7nosaFcbiAgICByZXBvcnRzOlt7fV0g6L2v5Lu25YyF6YCJ5Lit55qE5oql6KGoXG59XG4jIyNcbkFQVHJhbnNmb3JtLmV4cG9ydCA9IChyZWNvcmQpLT5cblx0ZXhwb3J0X2RhdGEgPSB7fVxuXHRpZiBfLmlzQXJyYXkocmVjb3JkLmFwcHMpICYmIHJlY29yZC5hcHBzLmxlbmd0aCA+IDBcblx0XHRleHBvcnRfZGF0YS5hcHBzID0gW11cblxuXHRcdF8uZWFjaCByZWNvcmQuYXBwcywgKGFwcEtleSktPlxuXHRcdFx0YXBwID0ge31cblx0XHRcdF8uZXh0ZW5kKGFwcCwgQ3JlYXRvci5BcHBzW2FwcEtleV0pXG5cdFx0XHRpZiAhYXBwIHx8IF8uaXNFbXB0eShhcHApXG5cdFx0XHRcdGFwcCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImFwcHNcIikuZmluZE9uZSh7X2lkOiBhcHBLZXl9LCB7ZmllbGRzOiBpZ25vcmVfZmllbGRzfSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgIV8uaGFzKGFwcCwgXCJfaWRcIilcblx0XHRcdFx0XHRhcHAuX2lkID0gYXBwS2V5XG5cdFx0XHRpZiBhcHBcblx0XHRcdFx0ZXhwb3J0X2RhdGEuYXBwcy5wdXNoIGFwcFxuXG5cdGlmIF8uaXNBcnJheShyZWNvcmQub2JqZWN0cykgJiYgcmVjb3JkLm9iamVjdHMubGVuZ3RoID4gMFxuXHRcdGV4cG9ydF9kYXRhLm9iamVjdHMgPSBbXVxuXHRcdF8uZWFjaCByZWNvcmQub2JqZWN0cywgKG9iamVjdF9uYW1lKS0+XG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXG5cdFx0XHRpZiBvYmplY3Rcblx0XHRcdFx0ZXhwb3J0X2RhdGEub2JqZWN0cy5wdXNoIEFQVHJhbnNmb3JtLmV4cG9ydE9iamVjdChvYmplY3QpXG5cblx0aWYgXy5pc0FycmF5KHJlY29yZC5saXN0X3ZpZXdzKSAmJiByZWNvcmQubGlzdF92aWV3cy5sZW5ndGggPiAwXG5cdFx0ZXhwb3J0X2RhdGEubGlzdF92aWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7X2lkOiB7JGluOiByZWNvcmQubGlzdF92aWV3c319LCB7ZmllbGRzOiBpZ25vcmVfZmllbGRzfSkuZmV0Y2goKVxuXG5cdGlmIF8uaXNBcnJheShyZWNvcmQucGVybWlzc2lvbl9zZXQpICYmIHJlY29yZC5wZXJtaXNzaW9uX3NldC5sZW5ndGggPiAwXG5cdFx0ZXhwb3J0X2RhdGEucGVybWlzc2lvbl9zZXQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtfaWQ6IHskaW46IHJlY29yZC5wZXJtaXNzaW9uX3NldH19LCB7ZmllbGRzOiBpZ25vcmVfZmllbGRzfSkuZmV0Y2goKVxuXG5cdGlmIF8uaXNBcnJheShyZWNvcmQucGVybWlzc2lvbl9vYmplY3RzKSAmJiByZWNvcmQucGVybWlzc2lvbl9vYmplY3RzLmxlbmd0aCA+IDBcblx0XHRleHBvcnRfZGF0YS5wZXJtaXNzaW9uX29iamVjdHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7X2lkOiB7JGluOiByZWNvcmQucGVybWlzc2lvbl9vYmplY3RzfX0sIHtmaWVsZHM6IGlnbm9yZV9maWVsZHN9KS5mZXRjaCgpXG5cblx0aWYgXy5pc0FycmF5KHJlY29yZC5yZXBvcnRzKSAmJiByZWNvcmQucmVwb3J0cy5sZW5ndGggPiAwXG5cdFx0ZXhwb3J0X2RhdGEucmVwb3J0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInJlcG9ydHNcIikuZmluZCh7X2lkOiB7JGluOiByZWNvcmQucmVwb3J0c319LCB7ZmllbGRzOiBpZ25vcmVfZmllbGRzfSkuZmV0Y2goKVxuXG5cdHJldHVybiBleHBvcnRfZGF0YVxuIiwidmFyIGlnbm9yZV9maWVsZHM7XG5cbnRoaXMuQVBUcmFuc2Zvcm0gPSB7fTtcblxuaWdub3JlX2ZpZWxkcyA9IHtcbiAgb3duZXI6IDAsXG4gIHNwYWNlOiAwLFxuICBjcmVhdGVkOiAwLFxuICBjcmVhdGVkX2J5OiAwLFxuICBtb2RpZmllZDogMCxcbiAgbW9kaWZpZWRfYnk6IDAsXG4gIGlzX2RlbGV0ZWQ6IDAsXG4gIGluc3RhbmNlczogMCxcbiAgc2hhcmluZzogMFxufTtcblxuQVBUcmFuc2Zvcm0uZXhwb3J0T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBfb2JqLCBhY3Rpb25zLCBmaWVsZHMsIG9ial9saXN0X3ZpZXdzLCB0cmlnZ2VycztcbiAgX29iaiA9IHt9O1xuICBfLmV4dGVuZChfb2JqLCBvYmplY3QpO1xuICBvYmpfbGlzdF92aWV3cyA9IHt9O1xuICBfLmV4dGVuZChvYmpfbGlzdF92aWV3cywgX29iai5saXN0X3ZpZXdzIHx8IHt9KTtcbiAgXy5lYWNoKG9ial9saXN0X3ZpZXdzLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgaWYgKCFfLmhhcyh2LCBcIl9pZFwiKSkge1xuICAgICAgdi5faWQgPSBrO1xuICAgIH1cbiAgICBpZiAoIV8uaGFzKHYsIFwibmFtZVwiKSkge1xuICAgICAgcmV0dXJuIHYubmFtZSA9IGs7XG4gICAgfVxuICB9KTtcbiAgX29iai5saXN0X3ZpZXdzID0gb2JqX2xpc3Rfdmlld3M7XG4gIHRyaWdnZXJzID0ge307XG4gIF8uZm9yRWFjaChfb2JqLnRyaWdnZXJzLCBmdW5jdGlvbih0cmlnZ2VyLCBrZXkpIHtcbiAgICB2YXIgX3RyaWdnZXI7XG4gICAgX3RyaWdnZXIgPSB7fTtcbiAgICBfLmV4dGVuZChfdHJpZ2dlciwgdHJpZ2dlcik7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihfdHJpZ2dlci50b2RvKSkge1xuICAgICAgX3RyaWdnZXIudG9kbyA9IF90cmlnZ2VyLnRvZG8udG9TdHJpbmcoKTtcbiAgICB9XG4gICAgZGVsZXRlIF90cmlnZ2VyLl90b2RvO1xuICAgIHJldHVybiB0cmlnZ2Vyc1trZXldID0gX3RyaWdnZXI7XG4gIH0pO1xuICBfb2JqLnRyaWdnZXJzID0gdHJpZ2dlcnM7XG4gIGFjdGlvbnMgPSB7fTtcbiAgXy5mb3JFYWNoKF9vYmouYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBrZXkpIHtcbiAgICB2YXIgX2FjdGlvbjtcbiAgICBfYWN0aW9uID0ge307XG4gICAgXy5leHRlbmQoX2FjdGlvbiwgYWN0aW9uKTtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKF9hY3Rpb24udG9kbykpIHtcbiAgICAgIF9hY3Rpb24udG9kbyA9IF9hY3Rpb24udG9kby50b1N0cmluZygpO1xuICAgIH1cbiAgICBkZWxldGUgX2FjdGlvbi5fdG9kbztcbiAgICByZXR1cm4gYWN0aW9uc1trZXldID0gX2FjdGlvbjtcbiAgfSk7XG4gIF9vYmouYWN0aW9ucyA9IGFjdGlvbnM7XG4gIGZpZWxkcyA9IHt9O1xuICBfLmZvckVhY2goX29iai5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICB2YXIgX2ZpZWxkLCBfZm87XG4gICAgX2ZpZWxkID0ge307XG4gICAgXy5leHRlbmQoX2ZpZWxkLCBmaWVsZCk7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihfZmllbGQub3B0aW9ucykpIHtcbiAgICAgIF9maWVsZC5vcHRpb25zID0gX2ZpZWxkLm9wdGlvbnMudG9TdHJpbmcoKTtcbiAgICAgIGRlbGV0ZSBfZmllbGQuX29wdGlvbnM7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkoX2ZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICBfZm8gPSBbXTtcbiAgICAgIF8uZm9yRWFjaChfZmllbGQub3B0aW9ucywgZnVuY3Rpb24oX28xKSB7XG4gICAgICAgIHJldHVybiBfZm8ucHVzaChfbzEubGFiZWwgKyBcIjpcIiArIF9vMS52YWx1ZSk7XG4gICAgICB9KTtcbiAgICAgIF9maWVsZC5vcHRpb25zID0gX2ZvLmpvaW4oXCIsXCIpO1xuICAgICAgZGVsZXRlIF9maWVsZC5fb3B0aW9ucztcbiAgICB9XG4gICAgaWYgKF9maWVsZC5yZWdFeCkge1xuICAgICAgX2ZpZWxkLnJlZ0V4ID0gX2ZpZWxkLnJlZ0V4LnRvU3RyaW5nKCk7XG4gICAgICBkZWxldGUgX2ZpZWxkLl9yZWdFeDtcbiAgICB9XG4gICAgaWYgKF8uaXNGdW5jdGlvbihfZmllbGQub3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgX2ZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IF9maWVsZC5vcHRpb25zRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIGRlbGV0ZSBfZmllbGQuX29wdGlvbnNGdW5jdGlvbjtcbiAgICB9XG4gICAgaWYgKF8uaXNGdW5jdGlvbihfZmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgX2ZpZWxkLnJlZmVyZW5jZV90byA9IF9maWVsZC5yZWZlcmVuY2VfdG8udG9TdHJpbmcoKTtcbiAgICAgIGRlbGV0ZSBfZmllbGQuX3JlZmVyZW5jZV90bztcbiAgICB9XG4gICAgaWYgKF8uaXNGdW5jdGlvbihfZmllbGQuY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICBfZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBfZmllbGQuY3JlYXRlRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIGRlbGV0ZSBfZmllbGQuX2NyZWF0ZUZ1bmN0aW9uO1xuICAgIH1cbiAgICBpZiAoXy5pc0Z1bmN0aW9uKF9maWVsZC5kZWZhdWx0VmFsdWUpKSB7XG4gICAgICBfZmllbGQuZGVmYXVsdFZhbHVlID0gX2ZpZWxkLmRlZmF1bHRWYWx1ZS50b1N0cmluZygpO1xuICAgICAgZGVsZXRlIF9maWVsZC5fZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzW2tleV0gPSBfZmllbGQ7XG4gIH0pO1xuICBfb2JqLmZpZWxkcyA9IGZpZWxkcztcbiAgcmV0dXJuIF9vYmo7XG59O1xuXG5cbi8qXG7lr7zlh7rmlbDmja46XG57XG5cdGFwcHM6W3t9XSwg6L2v5Lu25YyF6YCJ5Lit55qEYXBwc1xuXHRvYmplY3RzOlt7fV0sIOmAieS4reeahG9iamVjdOWPiuWFtmZpZWxkcywgbGlzdF92aWV3cywgdHJpZ2dlcnMsIGFjdGlvbnMsIHBlcm1pc3Npb25fc2V0562JXG4gICAgbGlzdF92aWV3czpbe31dLCDova/ku7bljIXpgInkuK3nmoRsaXN0X3ZpZXdzXG4gICAgcGVybWlzc2lvbnM6W3t9XSwg6L2v5Lu25YyF6YCJ5Lit55qE5p2D6ZmQ6ZuGXG4gICAgcGVybWlzc2lvbl9vYmplY3RzOlt7fV0sIOi9r+S7tuWMhemAieS4reeahOadg+mZkOWvueixoVxuICAgIHJlcG9ydHM6W3t9XSDova/ku7bljIXpgInkuK3nmoTmiqXooahcbn1cbiAqL1xuXG5BUFRyYW5zZm9ybVtcImV4cG9ydFwiXSA9IGZ1bmN0aW9uKHJlY29yZCkge1xuICB2YXIgZXhwb3J0X2RhdGE7XG4gIGV4cG9ydF9kYXRhID0ge307XG4gIGlmIChfLmlzQXJyYXkocmVjb3JkLmFwcHMpICYmIHJlY29yZC5hcHBzLmxlbmd0aCA+IDApIHtcbiAgICBleHBvcnRfZGF0YS5hcHBzID0gW107XG4gICAgXy5lYWNoKHJlY29yZC5hcHBzLCBmdW5jdGlvbihhcHBLZXkpIHtcbiAgICAgIHZhciBhcHA7XG4gICAgICBhcHAgPSB7fTtcbiAgICAgIF8uZXh0ZW5kKGFwcCwgQ3JlYXRvci5BcHBzW2FwcEtleV0pO1xuICAgICAgaWYgKCFhcHAgfHwgXy5pc0VtcHR5KGFwcCkpIHtcbiAgICAgICAgYXBwID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwc1wiKS5maW5kT25lKHtcbiAgICAgICAgICBfaWQ6IGFwcEtleVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBpZ25vcmVfZmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFfLmhhcyhhcHAsIFwiX2lkXCIpKSB7XG4gICAgICAgICAgYXBwLl9pZCA9IGFwcEtleTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGFwcCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0X2RhdGEuYXBwcy5wdXNoKGFwcCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaWYgKF8uaXNBcnJheShyZWNvcmQub2JqZWN0cykgJiYgcmVjb3JkLm9iamVjdHMubGVuZ3RoID4gMCkge1xuICAgIGV4cG9ydF9kYXRhLm9iamVjdHMgPSBbXTtcbiAgICBfLmVhY2gocmVjb3JkLm9iamVjdHMsIGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgICB2YXIgb2JqZWN0O1xuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgICAgIGlmIChvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydF9kYXRhLm9iamVjdHMucHVzaChBUFRyYW5zZm9ybS5leHBvcnRPYmplY3Qob2JqZWN0KSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaWYgKF8uaXNBcnJheShyZWNvcmQubGlzdF92aWV3cykgJiYgcmVjb3JkLmxpc3Rfdmlld3MubGVuZ3RoID4gMCkge1xuICAgIGV4cG9ydF9kYXRhLmxpc3Rfdmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogcmVjb3JkLmxpc3Rfdmlld3NcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IGlnbm9yZV9maWVsZHNcbiAgICB9KS5mZXRjaCgpO1xuICB9XG4gIGlmIChfLmlzQXJyYXkocmVjb3JkLnBlcm1pc3Npb25fc2V0KSAmJiByZWNvcmQucGVybWlzc2lvbl9zZXQubGVuZ3RoID4gMCkge1xuICAgIGV4cG9ydF9kYXRhLnBlcm1pc3Npb25fc2V0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiByZWNvcmQucGVybWlzc2lvbl9zZXRcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IGlnbm9yZV9maWVsZHNcbiAgICB9KS5mZXRjaCgpO1xuICB9XG4gIGlmIChfLmlzQXJyYXkocmVjb3JkLnBlcm1pc3Npb25fb2JqZWN0cykgJiYgcmVjb3JkLnBlcm1pc3Npb25fb2JqZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgZXhwb3J0X2RhdGEucGVybWlzc2lvbl9vYmplY3RzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogcmVjb3JkLnBlcm1pc3Npb25fb2JqZWN0c1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczogaWdub3JlX2ZpZWxkc1xuICAgIH0pLmZldGNoKCk7XG4gIH1cbiAgaWYgKF8uaXNBcnJheShyZWNvcmQucmVwb3J0cykgJiYgcmVjb3JkLnJlcG9ydHMubGVuZ3RoID4gMCkge1xuICAgIGV4cG9ydF9kYXRhLnJlcG9ydHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJyZXBvcnRzXCIpLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogcmVjb3JkLnJlcG9ydHNcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IGlnbm9yZV9maWVsZHNcbiAgICB9KS5mZXRjaCgpO1xuICB9XG4gIHJldHVybiBleHBvcnRfZGF0YTtcbn07XG4iXX0=
