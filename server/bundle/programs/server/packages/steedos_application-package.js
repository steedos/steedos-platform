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
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcHBsaWNhdGlvbi1wYWNrYWdlL21vZGVscy9hcHBsaWNhdGlvbl9wYWNrYWdlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbW9kZWxzL2FwcGxpY2F0aW9uX3BhY2thZ2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwcGxpY2F0aW9uLXBhY2thZ2Uvc2VydmVyL3JvdXRlcy9leHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2V4cG9ydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBwbGljYXRpb24tcGFja2FnZS9zZXJ2ZXIvcm91dGVzL2ltcG9ydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9yb3V0ZXMvaW1wb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcHBsaWNhdGlvbi1wYWNrYWdlL3NlcnZlci9tZXRob2RzL2xpc3R2aWV3c19vcHRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvbGlzdHZpZXdzX29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwcGxpY2F0aW9uLXBhY2thZ2Uvc2VydmVyL21ldGhvZHMvaW5pdF9leHBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2luaXRfZXhwb3J0X2RhdGEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwcGxpY2F0aW9uLXBhY2thZ2UvbGliL3RyYW5zZm9ybS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi90cmFuc2Zvcm0uY29mZmVlIl0sIm5hbWVzIjpbIkNyZWF0b3IiLCJPYmplY3RzIiwiYXBwbGljYXRpb25fcGFja2FnZSIsIm5hbWUiLCJpY29uIiwibGFiZWwiLCJoaWRkZW4iLCJmaWVsZHMiLCJ0eXBlIiwiYXBwcyIsInJlZmVyZW5jZV90byIsIm11bHRpcGxlIiwib3B0aW9uc0Z1bmN0aW9uIiwiX29wdGlvbnMiLCJfIiwiZm9yRWFjaCIsIkFwcHMiLCJvIiwiayIsInB1c2giLCJ2YWx1ZSIsImljb25fc2xkcyIsIm9iamVjdHMiLCJvYmplY3RzQnlOYW1lIiwibGlzdF92aWV3cyIsIm9wdGlvbnNNZXRob2QiLCJwZXJtaXNzaW9uX3NldCIsInBlcm1pc3Npb25fb2JqZWN0cyIsInJlcG9ydHMiLCJhbGwiLCJjb2x1bW5zIiwiZmlsdGVyX3Njb3BlIiwiYWN0aW9ucyIsImluaXRfZGF0YSIsInZpc2libGUiLCJvbiIsInRvZG8iLCJvYmplY3RfbmFtZSIsInJlY29yZF9pZCIsImNvbnNvbGUiLCJsb2ciLCJNZXRlb3IiLCJjYWxsIiwiU2Vzc2lvbiIsImdldCIsImVycm9yIiwicmVzdWx0IiwidG9hc3RyIiwicmVhc29uIiwic3VjY2VzcyIsInVybCIsIlN0ZWVkb3MiLCJhYnNvbHV0ZVVybCIsIndpbmRvdyIsIm9wZW4iLCJNb2RhbCIsInNob3ciLCJKc29uUm91dGVzIiwiYWRkIiwicmVxIiwicmVzIiwibmV4dCIsImRhdGEiLCJlIiwiZmlsZU5hbWUiLCJyZWNvcmQiLCJzcGFjZV9pZCIsInNwYWNlX3VzZXIiLCJ1c2VySWQiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwic2VuZFJlc3VsdCIsImNvZGUiLCJlcnJvcnMiLCJwYXJhbXMiLCJpc1NwYWNlQWRtaW4iLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsIl9pZCIsInVzZXIiLCJzcGFjZSIsIkFQVHJhbnNmb3JtIiwiZGF0YVNvdXJjZSIsInNldEhlYWRlciIsImVuY29kZVVSSSIsImVuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzdGFjayIsIm1lc3NhZ2UiLCJ0cmFuc2Zvcm1GaWVsZE9wdGlvbnMiLCJ0cmFuc2Zvcm1GaWx0ZXJzIiwiZmlsdGVycyIsIl9maWx0ZXJzIiwiZWFjaCIsImYiLCJpc0FycmF5IiwibGVuZ3RoIiwiZmllbGQiLCJvcGVyYXRpb24iLCJvcHRpb25zIiwiaGFzIiwiam9pbiIsImltcG9ydE9iamVjdCIsIm9iamVjdCIsImxpc3Rfdmlld3NfaWRfbWFwcyIsIl9maWVsZG5hbWVzIiwiaGFzUmVjZW50VmlldyIsImludGVybmFsX2xpc3RfdmlldyIsIm9ial9saXN0X3ZpZXdzIiwidHJpZ2dlcnMiLCJwZXJtaXNzaW9ucyIsIm93bmVyIiwiaW5zZXJ0IiwibGlzdF92aWV3IiwibmV3X2lkIiwib2xkX2lkIiwiaXNSZWNlbnRWaWV3IiwiaXNBbGxWaWV3IiwiJHNldCIsIiR1bnNldCIsInVwZGF0ZSIsInJlbW92ZSIsImNvbnRhaW5zIiwiZGlyZWN0IiwidHJpZ2dlciIsInJlcGxhY2UiLCJSZWdFeHAiLCJpc19lbmFibGUiLCJhY3Rpb24iLCJpbXBvcnRfYXBwX3BhY2thZ2UiLCJpbXBfZGF0YSIsImZyb21fdGVtcGxhdGUiLCJhcHBzX2lkX21hcHMiLCJpbXBfYXBwX2lkcyIsImltcF9vYmplY3RfbmFtZXMiLCJvYmplY3RfbmFtZXMiLCJwZXJtaXNzaW9uX3NldF9pZF9tYXBzIiwicGVybWlzc2lvbl9zZXRfaWRzIiwiRXJyb3IiLCJjaGVjayIsIk9iamVjdCIsInBsdWNrIiwiYXBwIiwiaW5jbHVkZSIsImtleXMiLCJpc0xlZ2FsVmVyc2lvbiIsImlzU3RyaW5nIiwiYXNzaWduZWRfYXBwcyIsImFwcF9pZCIsInBlcm1pc3Npb25fb2JqZWN0IiwicGVybWlzc2lvbl9zZXRfaWQiLCJyZXBvcnQiLCJpc19jcmVhdG9yIiwiX2xpc3RfdmlldyIsInBlcm1pc3Npb25fc2V0X3VzZXJzIiwidXNlcnMiLCJ1c2VyX2lkIiwiZGlzYWJsZWRfbGlzdF92aWV3cyIsImxpc3Rfdmlld19pZCIsIm5ld192aWV3X2lkIiwibWV0aG9kcyIsImNvbGxlY3Rpb24iLCJuYW1lX2ZpZWxkX2tleSIsInF1ZXJ5IiwicXVlcnlfb3B0aW9ucyIsInJlY29yZHMiLCJyZWYiLCJyZWYxIiwicmVzdWx0cyIsInNlYXJjaFRleHRRdWVyeSIsInNlbGVjdGVkIiwic29ydCIsImdldE9iamVjdCIsIk5BTUVfRklFTERfS0VZIiwic2VhcmNoVGV4dCIsIiRyZWdleCIsInZhbHVlcyIsIiRvciIsIiRpbiIsImV4dGVuZCIsIiRuaW4iLCJkYiIsImZpbHRlclF1ZXJ5IiwibGltaXQiLCJpc09iamVjdCIsImZpbmQiLCJmZXRjaCIsInJlZjIiLCJpc0VtcHR5IiwiZ2V0QXBwT2JqZWN0cyIsImdldE9iamVjdHNMaXN0Vmlld3MiLCJnZXRPYmplY3RzUGVybWlzc2lvbk9iamVjdHMiLCJnZXRPYmplY3RzUGVybWlzc2lvblNldCIsImdldE9iamVjdHNSZXBvcnRzIiwiYXBwT2JqZWN0cyIsIm9iamVjdHNfbmFtZSIsIm9iamVjdHNMaXN0Vmlld3MiLCJzaGFyZWQiLCJvYmplY3RzUmVwb3J0cyIsIm9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cyIsIm9iamVjdHNQZXJtaXNzaW9uU2V0IiwiX29iamVjdHMiLCJfb2JqZWN0c19saXN0X3ZpZXdzIiwiX29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzIiwiX29iamVjdHNfcGVybWlzc2lvbl9zZXQiLCJfb2JqZWN0c19yZXBvcnRzIiwiYXBwSWQiLCJjb25jYXQiLCJ1bmlxIiwiaWdub3JlX2ZpZWxkcyIsImNyZWF0ZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWQiLCJtb2RpZmllZF9ieSIsImlzX2RlbGV0ZWQiLCJpbnN0YW5jZXMiLCJzaGFyaW5nIiwiZXhwb3J0T2JqZWN0IiwiX29iaiIsInYiLCJrZXkiLCJfdHJpZ2dlciIsImlzRnVuY3Rpb24iLCJ0b1N0cmluZyIsIl90b2RvIiwiX2FjdGlvbiIsIl9maWVsZCIsIl9mbyIsIl9vMSIsInJlZ0V4IiwiX3JlZ0V4IiwiX29wdGlvbnNGdW5jdGlvbiIsIl9yZWZlcmVuY2VfdG8iLCJjcmVhdGVGdW5jdGlvbiIsIl9jcmVhdGVGdW5jdGlvbiIsImRlZmF1bHRWYWx1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QUErQixDQUF0RTtBQUNDNkksZ0JBQVluTixjQUFaLEdBQTZCMUIsUUFBUTJFLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDOEcsSUFBeEMsQ0FBNkM7QUFBQzVHLFdBQUs7QUFBQ3FHLGFBQUtqSCxPQUFPdkM7QUFBYjtBQUFOLEtBQTdDLEVBQWtGO0FBQUNuQixjQUFRME07QUFBVCxLQUFsRixFQUEyR3ZCLEtBQTNHLEVBQTdCO0FDK0JDOztBRDdCRixNQUFHNUssRUFBRWlGLE9BQUYsQ0FBVTlCLE9BQU90QyxrQkFBakIsS0FBd0NzQyxPQUFPdEMsa0JBQVAsQ0FBMEJxRSxNQUExQixHQUFtQyxDQUE5RTtBQUNDNkksZ0JBQVlsTixrQkFBWixHQUFpQzNCLFFBQVEyRSxhQUFSLENBQXNCLG9CQUF0QixFQUE0QzhHLElBQTVDLENBQWlEO0FBQUM1RyxXQUFLO0FBQUNxRyxhQUFLakgsT0FBT3RDO0FBQWI7QUFBTixLQUFqRCxFQUEwRjtBQUFDcEIsY0FBUTBNO0FBQVQsS0FBMUYsRUFBbUh2QixLQUFuSCxFQUFqQztBQ3FDQzs7QURuQ0YsTUFBRzVLLEVBQUVpRixPQUFGLENBQVU5QixPQUFPckMsT0FBakIsS0FBNkJxQyxPQUFPckMsT0FBUCxDQUFlb0UsTUFBZixHQUF3QixDQUF4RDtBQUNDNkksZ0JBQVlqTixPQUFaLEdBQXNCNUIsUUFBUTJFLGFBQVIsQ0FBc0IsU0FBdEIsRUFBaUM4RyxJQUFqQyxDQUFzQztBQUFDNUcsV0FBSztBQUFDcUcsYUFBS2pILE9BQU9yQztBQUFiO0FBQU4sS0FBdEMsRUFBb0U7QUFBQ3JCLGNBQVEwTTtBQUFULEtBQXBFLEVBQTZGdkIsS0FBN0YsRUFBdEI7QUMyQ0M7O0FEekNGLFNBQU9tRCxXQUFQO0FBbkNvQixDQUFyQixDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2FwcGxpY2F0aW9uLXBhY2thZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJDcmVhdG9yLk9iamVjdHMuYXBwbGljYXRpb25fcGFja2FnZSA9XG5cdG5hbWU6IFwiYXBwbGljYXRpb25fcGFja2FnZVwiXG5cdGljb246IFwiY3VzdG9tLmN1c3RvbTQyXCJcblx0bGFiZWw6IFwi6L2v5Lu25YyFXCJcblx0aGlkZGVuOiB0cnVlXG5cdGZpZWxkczpcblx0XHRuYW1lOlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblx0XHRcdGxhYmVsOiBcIuWQjeensFwiXG5cdFx0YXBwczpcblx0XHRcdHR5cGU6IFwibG9va3VwXCJcblx0XHRcdGxhYmVsOiBcIuW6lOeUqFwiXG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXG5cdFx0XHRyZWZlcmVuY2VfdG86IFwiYXBwc1wiXG5cdFx0XHRtdWx0aXBsZTogdHJ1ZVxuXHRcdFx0b3B0aW9uc0Z1bmN0aW9uOiAoKS0+XG5cdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0Xy5mb3JFYWNoIENyZWF0b3IuQXBwcywgKG8sIGspLT5cblx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogby5uYW1lLCB2YWx1ZTogaywgaWNvbjogby5pY29uX3NsZHN9XG5cdFx0XHRcdHJldHVybiBfb3B0aW9uc1xuXHRcdG9iamVjdHM6XG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXG5cdFx0XHRsYWJlbDogXCLlr7nosaFcIlxuXHRcdFx0cmVmZXJlbmNlX3RvOiBcIm9iamVjdHNcIlxuXHRcdFx0bXVsdGlwbGU6IHRydWVcblx0XHRcdG9wdGlvbnNGdW5jdGlvbjogKCktPlxuXHRcdFx0XHRfb3B0aW9ucyA9IFtdXG5cdFx0XHRcdF8uZm9yRWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvLCBrKS0+XG5cdFx0XHRcdFx0aWYgIW8uaGlkZGVuXG5cdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHsgbGFiZWw6IG8ubGFiZWwsIHZhbHVlOiBrLCBpY29uOiBvLmljb24gfVxuXHRcdFx0XHRyZXR1cm4gX29wdGlvbnNcblxuXHRcdGxpc3Rfdmlld3M6XG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXG5cdFx0XHRsYWJlbDogXCLliJfooajop4blm75cIlxuXHRcdFx0bXVsdGlwbGU6IHRydWVcblx0XHRcdHJlZmVyZW5jZV90bzogXCJvYmplY3RfbGlzdHZpZXdzXCJcblx0XHRcdG9wdGlvbnNNZXRob2Q6IFwiY3JlYXRvci5saXN0dmlld3Nfb3B0aW9uc1wiXG5cdFx0cGVybWlzc2lvbl9zZXQ6XG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXG5cdFx0XHRsYWJlbDogXCLmnYPpmZDpm4ZcIlxuXHRcdFx0bXVsdGlwbGU6IHRydWVcblx0XHRcdHJlZmVyZW5jZV90bzogXCJwZXJtaXNzaW9uX3NldFwiXG5cdFx0cGVybWlzc2lvbl9vYmplY3RzOlxuXHRcdFx0dHlwZTogXCJsb29rdXBcIlxuXHRcdFx0bGFiZWw6IFwi5p2D6ZmQ6ZuGXCJcblx0XHRcdG11bHRpcGxlOiB0cnVlXG5cdFx0XHRyZWZlcmVuY2VfdG86IFwicGVybWlzc2lvbl9vYmplY3RzXCJcblx0XHRyZXBvcnRzOlxuXHRcdFx0dHlwZTogXCJsb29rdXBcIlxuXHRcdFx0bGFiZWw6IFwi5oql6KGoXCJcblx0XHRcdG11bHRpcGxlOiB0cnVlXG5cdFx0XHRyZWZlcmVuY2VfdG86IFwicmVwb3J0c1wiXG5cdGxpc3Rfdmlld3M6XG5cdFx0YWxsOlxuXHRcdFx0bGFiZWw6IFwi5omA5pyJXCJcblx0XHRcdGNvbHVtbnM6IFtcIm5hbWVcIl1cblx0XHRcdGZpbHRlcl9zY29wZTogXCJzcGFjZVwiXG5cdGFjdGlvbnM6XG5cdFx0aW5pdF9kYXRhOlxuXHRcdFx0bGFiZWw6IFwi5Yid5aeL5YyWXCJcblx0XHRcdHZpc2libGU6IHRydWVcblx0XHRcdG9uOiBcInJlY29yZFwiXG5cdFx0XHR0b2RvOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XG5cdFx0XHRcdGNvbnNvbGUubG9nKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcylcblx0XHRcdFx0TWV0ZW9yLmNhbGwgXCJhcHBQYWNrYWdlLmluaXRfZXhwb3J0X2RhdGFcIiwgU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLCByZWNvcmRfaWQsKGVycm9yLCByZXN1bHQpLT5cblx0XHRcdFx0XHRpZiBlcnJvclxuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKGVycm9yLnJlYXNvbilcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyhcIuWIneWni+WMluWujOaIkFwiKVxuXHRcdGV4cG9ydDpcblx0XHRcdGxhYmVsOiBcIuWvvOWHulwiXG5cdFx0XHR2aXNpYmxlOiB0cnVlXG5cdFx0XHRvbjogXCJyZWNvcmRcIlxuXHRcdFx0dG9kbzogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIuWvvOWHuiN7b2JqZWN0X25hbWV9LT4je3JlY29yZF9pZH1cIilcblx0XHRcdFx0dXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCBcIi9hcGkvY3JlYXRvci9hcHBfcGFja2FnZS9leHBvcnQvI3tTZXNzaW9uLmdldChcInNwYWNlSWRcIil9LyN7cmVjb3JkX2lkfVwiXG5cdFx0XHRcdHdpbmRvdy5vcGVuKHVybClcbiNcdFx0XHRcdCQuYWpheFxuI1x0XHRcdFx0XHR0eXBlOiBcInBvc3RcIlxuI1x0XHRcdFx0XHR1cmw6IHVybFxuI1x0XHRcdFx0XHRkYXRhVHlwZTogXCJqc29uXCJcbiNcdFx0XHRcdFx0YmVmb3JlU2VuZDogKHJlcXVlc3QpIC0+XG4jXHRcdFx0XHRcdFx0cmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLVVzZXItSWQnLCBNZXRlb3IudXNlcklkKCkpXG4jXHRcdFx0XHRcdFx0cmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLUF1dGgtVG9rZW4nLCBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpKVxuI1x0XHRcdFx0XHRlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgLT5cbiNcdFx0XHRcdFx0XHRlcnJvciA9IGpxWEhSLnJlc3BvbnNlSlNPTlxuI1x0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyb3JcbiNcdFx0XHRcdFx0XHRpZiBlcnJvcj8ucmVhc29uXG4jXHRcdFx0XHRcdFx0XHR0b2FzdHI/LmVycm9yPyhUQVBpMThuLl9fKGVycm9yLnJlYXNvbikpXG4jXHRcdFx0XHRcdFx0ZWxzZSBpZiBlcnJvcj8ubWVzc2FnZVxuI1x0XHRcdFx0XHRcdFx0dG9hc3RyPy5lcnJvcj8oVEFQaTE4bi5fXyhlcnJvci5tZXNzYWdlKSlcbiNcdFx0XHRcdFx0XHRlbHNlXG4jXHRcdFx0XHRcdFx0XHR0b2FzdHI/LmVycm9yPyhlcnJvcilcbiNcdFx0XHRcdFx0c3VjY2VzczogKHJlc3VsdCkgLT5cbiNcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcInJlc3VsdC4uLi4uLi4uLi4uLi4uLi4uLi4je3Jlc3VsdH1cIilcblxuXHRcdGltcG9ydDpcblx0XHRcdGxhYmVsOiBcIuWvvOWFpVwiXG5cdFx0XHR2aXNpYmxlOiB0cnVlXG5cdFx0XHRvbjogXCJsaXN0XCJcblx0XHRcdHRvZG86IChvYmplY3RfbmFtZSktPlxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIm9iamVjdF9uYW1lXCIsIG9iamVjdF9uYW1lKVxuXHRcdFx0XHRNb2RhbC5zaG93KFwiQVBQYWNrYWdlSW1wb3J0TW9kYWxcIilcbiIsIkNyZWF0b3IuT2JqZWN0cy5hcHBsaWNhdGlvbl9wYWNrYWdlID0ge1xuICBuYW1lOiBcImFwcGxpY2F0aW9uX3BhY2thZ2VcIixcbiAgaWNvbjogXCJjdXN0b20uY3VzdG9tNDJcIixcbiAgbGFiZWw6IFwi6L2v5Lu25YyFXCIsXG4gIGhpZGRlbjogdHJ1ZSxcbiAgZmllbGRzOiB7XG4gICAgbmFtZToge1xuICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICBsYWJlbDogXCLlkI3np7BcIlxuICAgIH0sXG4gICAgYXBwczoge1xuICAgICAgdHlwZTogXCJsb29rdXBcIixcbiAgICAgIGxhYmVsOiBcIuW6lOeUqFwiLFxuICAgICAgdHlwZTogXCJsb29rdXBcIixcbiAgICAgIHJlZmVyZW5jZV90bzogXCJhcHBzXCIsXG4gICAgICBtdWx0aXBsZTogdHJ1ZSxcbiAgICAgIG9wdGlvbnNGdW5jdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfb3B0aW9ucztcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKENyZWF0b3IuQXBwcywgZnVuY3Rpb24obywgaykge1xuICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgIGxhYmVsOiBvLm5hbWUsXG4gICAgICAgICAgICB2YWx1ZTogayxcbiAgICAgICAgICAgIGljb246IG8uaWNvbl9zbGRzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gX29wdGlvbnM7XG4gICAgICB9XG4gICAgfSxcbiAgICBvYmplY3RzOiB7XG4gICAgICB0eXBlOiBcImxvb2t1cFwiLFxuICAgICAgbGFiZWw6IFwi5a+56LGhXCIsXG4gICAgICByZWZlcmVuY2VfdG86IFwib2JqZWN0c1wiLFxuICAgICAgbXVsdGlwbGU6IHRydWUsXG4gICAgICBvcHRpb25zRnVuY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX29wdGlvbnM7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKG8sIGspIHtcbiAgICAgICAgICBpZiAoIW8uaGlkZGVuKSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiBvLmxhYmVsLFxuICAgICAgICAgICAgICB2YWx1ZTogayxcbiAgICAgICAgICAgICAgaWNvbjogby5pY29uXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gX29wdGlvbnM7XG4gICAgICB9XG4gICAgfSxcbiAgICBsaXN0X3ZpZXdzOiB7XG4gICAgICB0eXBlOiBcImxvb2t1cFwiLFxuICAgICAgbGFiZWw6IFwi5YiX6KGo6KeG5Zu+XCIsXG4gICAgICBtdWx0aXBsZTogdHJ1ZSxcbiAgICAgIHJlZmVyZW5jZV90bzogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICBvcHRpb25zTWV0aG9kOiBcImNyZWF0b3IubGlzdHZpZXdzX29wdGlvbnNcIlxuICAgIH0sXG4gICAgcGVybWlzc2lvbl9zZXQ6IHtcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICBsYWJlbDogXCLmnYPpmZDpm4ZcIixcbiAgICAgIG11bHRpcGxlOiB0cnVlLFxuICAgICAgcmVmZXJlbmNlX3RvOiBcInBlcm1pc3Npb25fc2V0XCJcbiAgICB9LFxuICAgIHBlcm1pc3Npb25fb2JqZWN0czoge1xuICAgICAgdHlwZTogXCJsb29rdXBcIixcbiAgICAgIGxhYmVsOiBcIuadg+mZkOmbhlwiLFxuICAgICAgbXVsdGlwbGU6IHRydWUsXG4gICAgICByZWZlcmVuY2VfdG86IFwicGVybWlzc2lvbl9vYmplY3RzXCJcbiAgICB9LFxuICAgIHJlcG9ydHM6IHtcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICBsYWJlbDogXCLmiqXooahcIixcbiAgICAgIG11bHRpcGxlOiB0cnVlLFxuICAgICAgcmVmZXJlbmNlX3RvOiBcInJlcG9ydHNcIlxuICAgIH1cbiAgfSxcbiAgbGlzdF92aWV3czoge1xuICAgIGFsbDoge1xuICAgICAgbGFiZWw6IFwi5omA5pyJXCIsXG4gICAgICBjb2x1bW5zOiBbXCJuYW1lXCJdLFxuICAgICAgZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcbiAgICB9XG4gIH0sXG4gIGFjdGlvbnM6IHtcbiAgICBpbml0X2RhdGE6IHtcbiAgICAgIGxhYmVsOiBcIuWIneWni+WMllwiLFxuICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgIG9uOiBcInJlY29yZFwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyk7XG4gICAgICAgIHJldHVybiBNZXRlb3IuY2FsbChcImFwcFBhY2thZ2UuaW5pdF9leHBvcnRfZGF0YVwiLCBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksIHJlY29yZF9pZCwgZnVuY3Rpb24oZXJyb3IsIHJlc3VsdCkge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcihlcnJvci5yZWFzb24pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdG9hc3RyLnN1Y2Nlc3MoXCLliJ3lp4vljJblrozmiJBcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiZXhwb3J0XCI6IHtcbiAgICAgIGxhYmVsOiBcIuWvvOWHulwiLFxuICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgIG9uOiBcInJlY29yZFwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICAgIHZhciB1cmw7XG4gICAgICAgIGNvbnNvbGUubG9nKFwi5a+85Ye6XCIgKyBvYmplY3RfbmFtZSArIFwiLT5cIiArIHJlY29yZF9pZCk7XG4gICAgICAgIHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBpL2NyZWF0b3IvYXBwX3BhY2thZ2UvZXhwb3J0L1wiICsgKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkgKyBcIi9cIiArIHJlY29yZF9pZCk7XG4gICAgICAgIHJldHVybiB3aW5kb3cub3Blbih1cmwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJpbXBvcnRcIjoge1xuICAgICAgbGFiZWw6IFwi5a+85YWlXCIsXG4gICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgb246IFwibGlzdFwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJvYmplY3RfbmFtZVwiLCBvYmplY3RfbmFtZSk7XG4gICAgICAgIHJldHVybiBNb2RhbC5zaG93KFwiQVBQYWNrYWdlSW1wb3J0TW9kYWxcIik7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIiwiSnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXBpL2NyZWF0b3IvYXBwX3BhY2thZ2UvZXhwb3J0LzpzcGFjZV9pZC86cmVjb3JkX2lkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblxuXHRcdHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcyk7XG5cblx0XHRpZiAhdXNlcklkXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRcdGNvZGU6IDQwMVxuXHRcdFx0XHRkYXRhOiB7ZXJyb3JzOiBcIkF1dGhlbnRpY2F0aW9uIGlzIHJlcXVpcmVkIGFuZCBoYXMgbm90IGJlZW4gcHJvdmlkZWQuXCJ9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm5cblxuXHRcdHJlY29yZF9pZCA9IHJlcS5wYXJhbXMucmVjb3JkX2lkXG5cdFx0c3BhY2VfaWQgPSByZXEucGFyYW1zLnNwYWNlX2lkXG5cblx0XHRpZiAhQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIHVzZXJJZClcblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdFx0Y29kZTogNDAxXG5cdFx0XHRcdGRhdGE6IHtlcnJvcnM6IFwiUGVybWlzc2lvbiBkZW5pZWRcIn1cblx0XHRcdH1cblx0XHRcdHJldHVyblxuXG5cdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwbGljYXRpb25fcGFja2FnZVwiKS5maW5kT25lKHtfaWQ6IHJlY29yZF9pZH0pXG5cblx0XHRpZiAhcmVjb3JkXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRcdGNvZGU6IDQwNFxuXHRcdFx0XHRkYXRhOiB7ZXJyb3JzOiBcIkNvbGxlY3Rpb24gbm90IGZvdW5kIGZvciB0aGUgc2VnbWVudCAje3JlY29yZF9pZH1cIn1cblx0XHRcdH1cblx0XHRcdHJldHVyblxuXG5cdFx0c3BhY2VfdXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCwgc3BhY2U6IHJlY29yZC5zcGFjZX0pXG5cblx0XHRpZiAhc3BhY2VfdXNlclxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0XHRjb2RlOiA0MDFcblx0XHRcdFx0ZGF0YToge2Vycm9yczogXCJVc2VyIGRvZXMgbm90IGhhdmUgcHJpdmlsZWdlcyB0byBhY2Nlc3MgdGhlIGVudGl0eVwifVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuXG5cblx0XHRkYXRhID0gQVBUcmFuc2Zvcm0uZXhwb3J0IHJlY29yZFxuXG5cdFx0ZGF0YS5kYXRhU291cmNlID0gTWV0ZW9yLmFic29sdXRlVXJsKFwiYXBpL2NyZWF0b3IvYXBwX3BhY2thZ2UvZXhwb3J0LyN7c3BhY2VfaWR9LyN7cmVjb3JkX2lkfVwiKVxuXG5cdFx0ZmlsZU5hbWUgPSByZWNvcmQubmFtZSB8fCBcImFwcGxpY2F0aW9uX3BhY2thZ2VcIlxuXG5cdFx0cmVzLnNldEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtbXNkb3dubG9hZCcpO1xuXHRcdHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnYXR0YWNobWVudDtmaWxlbmFtZT0nK2VuY29kZVVSSShmaWxlTmFtZSkrJy5qc29uJyk7XG5cdFx0cmVzLmVuZChKU09OLnN0cmluZ2lmeShkYXRhLCBudWxsLCA0KSlcblx0Y2F0Y2ggZVxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdGNvZGU6IDIwMFxuXHRcdFx0ZGF0YTogeyBlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XG5cdFx0fVxuXG4iLCJKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvY3JlYXRvci9hcHBfcGFja2FnZS9leHBvcnQvOnNwYWNlX2lkLzpyZWNvcmRfaWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgZGF0YSwgZSwgZmlsZU5hbWUsIHJlY29yZCwgcmVjb3JkX2lkLCBzcGFjZV9pZCwgc3BhY2VfdXNlciwgdXNlcklkO1xuICB0cnkge1xuICAgIHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcyk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXJyb3JzOiBcIkF1dGhlbnRpY2F0aW9uIGlzIHJlcXVpcmVkIGFuZCBoYXMgbm90IGJlZW4gcHJvdmlkZWQuXCJcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlY29yZF9pZCA9IHJlcS5wYXJhbXMucmVjb3JkX2lkO1xuICAgIHNwYWNlX2lkID0gcmVxLnBhcmFtcy5zcGFjZV9pZDtcbiAgICBpZiAoIUNyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCB1c2VySWQpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGVycm9yczogXCJQZXJtaXNzaW9uIGRlbmllZFwiXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBsaWNhdGlvbl9wYWNrYWdlXCIpLmZpbmRPbmUoe1xuICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICB9KTtcbiAgICBpZiAoIXJlY29yZCkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDQsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBlcnJvcnM6IFwiQ29sbGVjdGlvbiBub3QgZm91bmQgZm9yIHRoZSBzZWdtZW50IFwiICsgcmVjb3JkX2lkXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzcGFjZV91c2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogcmVjb3JkLnNwYWNlXG4gICAgfSk7XG4gICAgaWYgKCFzcGFjZV91c2VyKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGVycm9yczogXCJVc2VyIGRvZXMgbm90IGhhdmUgcHJpdmlsZWdlcyB0byBhY2Nlc3MgdGhlIGVudGl0eVwiXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkYXRhID0gQVBUcmFuc2Zvcm1bXCJleHBvcnRcIl0ocmVjb3JkKTtcbiAgICBkYXRhLmRhdGFTb3VyY2UgPSBNZXRlb3IuYWJzb2x1dGVVcmwoXCJhcGkvY3JlYXRvci9hcHBfcGFja2FnZS9leHBvcnQvXCIgKyBzcGFjZV9pZCArIFwiL1wiICsgcmVjb3JkX2lkKTtcbiAgICBmaWxlTmFtZSA9IHJlY29yZC5uYW1lIHx8IFwiYXBwbGljYXRpb25fcGFja2FnZVwiO1xuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LW1zZG93bmxvYWQnKTtcbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2F0dGFjaG1lbnQ7ZmlsZW5hbWU9JyArIGVuY29kZVVSSShmaWxlTmFtZSkgKyAnLmpzb24nKTtcbiAgICByZXR1cm4gcmVzLmVuZChKU09OLnN0cmluZ2lmeShkYXRhLCBudWxsLCA0KSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJ0cmFuc2Zvcm1GaWx0ZXJzID0gKGZpbHRlcnMpLT5cblx0X2ZpbHRlcnMgPSBbXVxuXHRfLmVhY2ggZmlsdGVycywgKGYpLT5cblx0XHRpZiBfLmlzQXJyYXkoZikgJiYgZi5sZW5ndGggPT0gM1xuXHRcdFx0X2ZpbHRlcnMucHVzaCB7ZmllbGQ6IGZbMF0sIG9wZXJhdGlvbjogZlsxXSwgdmFsdWU6IGZbMl19XG5cdFx0ZWxzZVxuXHRcdFx0X2ZpbHRlcnMucHVzaCBmXG5cdHJldHVybiBfZmlsdGVyc1xuXG50cmFuc2Zvcm1GaWVsZE9wdGlvbnMgPSAob3B0aW9ucyktPlxuXHRpZiAhXy5pc0FycmF5KG9wdGlvbnMpXG5cdFx0cmV0dXJuIG9wdGlvbnNcblxuXHRfb3B0aW9ucyA9IFtdXG5cblx0Xy5lYWNoIG9wdGlvbnMsIChvKS0+XG5cdFx0aWYgbyAmJiBfLmhhcyhvLCAnbGFiZWwnKSAmJiBfLmhhcyhvLCAndmFsdWUnKVxuXHRcdFx0X29wdGlvbnMucHVzaCBcIiN7by5sYWJlbH06I3tvLnZhbHVlfVwiXG5cblx0cmV0dXJuIF9vcHRpb25zLmpvaW4oJywnKVxuXG5cbkNyZWF0b3IuaW1wb3J0T2JqZWN0ID0gKHVzZXJJZCwgc3BhY2VfaWQsIG9iamVjdCwgbGlzdF92aWV3c19pZF9tYXBzKSAtPlxuXHRjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0taW1wb3J0T2JqZWN0LS0tLS0tLS0tLS0tLS0tLS0tJywgb2JqZWN0Lm5hbWUpXG5cdGZpZWxkcyA9IG9iamVjdC5maWVsZHNcblx0dHJpZ2dlcnMgPSBvYmplY3QudHJpZ2dlcnNcblx0YWN0aW9ucyA9IG9iamVjdC5hY3Rpb25zXG5cdG9ial9saXN0X3ZpZXdzID0gb2JqZWN0Lmxpc3Rfdmlld3NcblxuXHRkZWxldGUgb2JqZWN0Ll9pZFxuXHRkZWxldGUgb2JqZWN0LmZpZWxkc1xuXHRkZWxldGUgb2JqZWN0LnRyaWdnZXJzXG5cdGRlbGV0ZSBvYmplY3QuYWN0aW9uc1xuXHRkZWxldGUgb2JqZWN0LnBlcm1pc3Npb25zICPliKDpmaRwZXJtaXNzaW9uc+WKqOaAgeWxnuaAp1xuXHRkZWxldGUgb2JqZWN0Lmxpc3Rfdmlld3NcblxuXHRvYmplY3Quc3BhY2UgPSBzcGFjZV9pZFxuXHRvYmplY3Qub3duZXIgPSB1c2VySWRcblxuXHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLmluc2VydChvYmplY3QpXG5cblx0IyAyLjEg5oyB5LmF5YyW5a+56LGhbGlzdF92aWV3c1xuXHRpbnRlcm5hbF9saXN0X3ZpZXcgPSB7fVxuXG5cdGhhc1JlY2VudFZpZXcgPSBmYWxzZVxuXHRjb25zb2xlLmxvZygn5oyB5LmF5YyW5a+56LGhbGlzdF92aWV3cycpO1xuXHRfLmVhY2ggb2JqX2xpc3Rfdmlld3MsIChsaXN0X3ZpZXcpLT5cblx0XHRvbGRfaWQgPSBsaXN0X3ZpZXcuX2lkXG5cdFx0ZGVsZXRlIGxpc3Rfdmlldy5faWRcblx0XHRsaXN0X3ZpZXcuc3BhY2UgPSBzcGFjZV9pZFxuXHRcdGxpc3Rfdmlldy5vd25lciA9IHVzZXJJZFxuXHRcdGxpc3Rfdmlldy5vYmplY3RfbmFtZSA9IG9iamVjdC5uYW1lXG5cdFx0aWYgQ3JlYXRvci5pc1JlY2VudFZpZXcobGlzdF92aWV3KVxuXHRcdFx0aGFzUmVjZW50VmlldyA9IHRydWVcblxuXHRcdGlmIGxpc3Rfdmlldy5maWx0ZXJzXG5cdFx0XHRsaXN0X3ZpZXcuZmlsdGVycyA9IHRyYW5zZm9ybUZpbHRlcnMobGlzdF92aWV3LmZpbHRlcnMpXG5cblx0XHRpZiBDcmVhdG9yLmlzQWxsVmlldyhsaXN0X3ZpZXcpIHx8IENyZWF0b3IuaXNSZWNlbnRWaWV3KGxpc3Rfdmlldylcblx0IyDliJvlu7pvYmplY3Tml7bvvIzkvJroh6rliqjmt7vliqBhbGwgdmlld+OAgXJlY2VudCB2aWV3XG5cblx0XHRcdG9wdGlvbnMgPSB7JHNldDogbGlzdF92aWV3fVxuXG5cdFx0XHRpZiAhbGlzdF92aWV3LmNvbHVtbnNcblx0XHRcdFx0b3B0aW9ucy4kdW5zZXQgPSB7Y29sdW1uczogJyd9XG5cblx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikudXBkYXRlKHtvYmplY3RfbmFtZTogb2JqZWN0Lm5hbWUsIG5hbWU6IGxpc3Rfdmlldy5uYW1lLCBzcGFjZTogc3BhY2VfaWR9LCBvcHRpb25zKVxuXHRcdGVsc2Vcblx0XHRcdG5ld19pZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuaW5zZXJ0KGxpc3Rfdmlldylcblx0XHRcdGxpc3Rfdmlld3NfaWRfbWFwc1tvYmplY3QubmFtZSArIFwiX1wiICsgb2xkX2lkXSA9IG5ld19pZFxuXG5cdGlmICFoYXNSZWNlbnRWaWV3XG5cdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5yZW1vdmUoe25hbWU6IFwicmVjZW50XCIsIHNwYWNlOiBzcGFjZV9pZCwgb2JqZWN0X25hbWU6IG9iamVjdC5uYW1lLCBvd25lcjogdXNlcklkfSlcblx0Y29uc29sZS5sb2coJ+aMgeS5heWMluWvueixoeWtl+autScpO1xuXHQjIDIuMiDmjIHkuYXljJblr7nosaHlrZfmrrVcblxuXHRfZmllbGRuYW1lcyA9IFtdXG5cblx0Xy5lYWNoIGZpZWxkcywgKGZpZWxkLCBrKS0+XG5cdFx0ZGVsZXRlIGZpZWxkLl9pZFxuXHRcdGZpZWxkLnNwYWNlID0gc3BhY2VfaWRcblx0XHRmaWVsZC5vd25lciA9IHVzZXJJZFxuXHRcdGZpZWxkLm9iamVjdCA9IG9iamVjdC5uYW1lXG5cblx0XHRpZiBmaWVsZC5vcHRpb25zXG5cdFx0XHRmaWVsZC5vcHRpb25zID0gdHJhbnNmb3JtRmllbGRPcHRpb25zKGZpZWxkLm9wdGlvbnMpXG5cblx0XHRpZiAhXy5oYXMoZmllbGQsIFwibmFtZVwiKVxuXHRcdFx0ZmllbGQubmFtZSA9IGtcblxuXHRcdF9maWVsZG5hbWVzLnB1c2ggZmllbGQubmFtZVxuXG5cdFx0aWYgZmllbGQubmFtZSA9PSBcIm5hbWVcIlxuXHRcdFx0IyDliJvlu7pvYmplY3Tml7bvvIzkvJroh6rliqjmt7vliqBuYW1l5a2X5q6177yM5Zug5q2k5Zyo5q2k5aSE5a+5bmFtZeWtl+autei/m+ihjOabtOaWsFxuXHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS51cGRhdGUoe29iamVjdDogb2JqZWN0Lm5hbWUsIG5hbWU6IFwibmFtZVwiLCBzcGFjZTogc3BhY2VfaWR9LCB7JHNldDogZmllbGR9KVxuXHRcdGVsc2Vcblx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9maWVsZHNcIikuaW5zZXJ0KGZpZWxkKVxuXG5cdFx0aWYgIV8uY29udGFpbnMoX2ZpZWxkbmFtZXMsICduYW1lJylcblx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9maWVsZHNcIikuZGlyZWN0LnJlbW92ZSh7b2JqZWN0OiBvYmplY3QubmFtZSwgbmFtZTogXCJuYW1lXCIsIHNwYWNlOiBzcGFjZV9pZH0pXG5cblx0Y29uc29sZS5sb2coJ+aMgeS5heWMluinpuWPkeWZqCcpO1xuXHQjIDIuMyDmjIHkuYXljJbop6blj5Hlmahcblx0Xy5lYWNoIHRyaWdnZXJzLCAodHJpZ2dlciwgayktPlxuXHRcdGRlbGV0ZSB0cmlnZ2Vycy5faWRcblx0XHR0cmlnZ2VyLnNwYWNlID0gc3BhY2VfaWRcblx0XHR0cmlnZ2VyLm93bmVyID0gdXNlcklkXG5cdFx0dHJpZ2dlci5vYmplY3QgPSBvYmplY3QubmFtZVxuXHRcdGlmICFfLmhhcyh0cmlnZ2VyLCBcIm5hbWVcIilcblx0XHRcdHRyaWdnZXIubmFtZSA9IGsucmVwbGFjZShuZXcgUmVnRXhwKFwiXFxcXC5cIiwgXCJnXCIpLCBcIl9cIilcblxuXHRcdGlmICFfLmhhcyh0cmlnZ2VyLCBcImlzX2VuYWJsZVwiKVxuXHRcdFx0dHJpZ2dlci5pc19lbmFibGUgPSB0cnVlXG5cblx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfdHJpZ2dlcnNcIikuaW5zZXJ0KHRyaWdnZXIpXG5cdGNvbnNvbGUubG9nKCfmjIHkuYXljJbmk43kvZwnKTtcblx0IyAyLjQg5oyB5LmF5YyW5pON5L2cXG5cdF8uZWFjaCBhY3Rpb25zLCAoYWN0aW9uLCBrKS0+XG5cdFx0ZGVsZXRlIGFjdGlvbi5faWRcblx0XHRhY3Rpb24uc3BhY2UgPSBzcGFjZV9pZFxuXHRcdGFjdGlvbi5vd25lciA9IHVzZXJJZFxuXHRcdGFjdGlvbi5vYmplY3QgPSBvYmplY3QubmFtZVxuXHRcdGlmICFfLmhhcyhhY3Rpb24sIFwibmFtZVwiKVxuXHRcdFx0YWN0aW9uLm5hbWUgPSBrLnJlcGxhY2UobmV3IFJlZ0V4cChcIlxcXFwuXCIsIFwiZ1wiKSwgXCJfXCIpXG5cdFx0aWYgIV8uaGFzKGFjdGlvbiwgXCJpc19lbmFibGVcIilcblx0XHRcdGFjdGlvbi5pc19lbmFibGUgPSB0cnVlXG5cdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2FjdGlvbnNcIikuaW5zZXJ0KGFjdGlvbilcblxuXHRjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0taW1wb3J0T2JqZWN0IGVuZC0tLS0tLS0tLS0tLS0tLS0tLScsIG9iamVjdC5uYW1lKVxuXG5DcmVhdG9yLmltcG9ydF9hcHBfcGFja2FnZSA9ICh1c2VySWQsIHNwYWNlX2lkLCBpbXBfZGF0YSwgZnJvbV90ZW1wbGF0ZSktPlxuXHRpZiAhdXNlcklkXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjQwMVwiLCBcIkF1dGhlbnRpY2F0aW9uIGlzIHJlcXVpcmVkIGFuZCBoYXMgbm90IGJlZW4gcHJvdmlkZWQuXCIpXG5cblx0aWYgIUNyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCB1c2VySWQpXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjQwMVwiLCBcIlBlcm1pc3Npb24gZGVuaWVkLlwiKVxuXG5cdCMjI+aVsOaNruagoemqjCDlvIDlp4sjIyNcblx0Y2hlY2soaW1wX2RhdGEsIE9iamVjdClcblx0aWYgIWZyb21fdGVtcGxhdGVcblx0XHQjIDEgYXBwc+agoemqjO+8muagueaNrl9pZOWIpOaWreW6lOeUqOaYr+WQpuW3suWtmOWcqFxuXHRcdGltcF9hcHBfaWRzID0gXy5wbHVjayhpbXBfZGF0YS5hcHBzLCBcIl9pZFwiKVxuXHRcdGlmIF8uaXNBcnJheShpbXBfZGF0YS5hcHBzKSAmJiBpbXBfZGF0YS5hcHBzLmxlbmd0aCA+IDBcblx0XHRcdF8uZWFjaCBpbXBfZGF0YS5hcHBzLCAoYXBwKS0+XG5cdFx0XHRcdGlmIF8uaW5jbHVkZShfLmtleXMoQ3JlYXRvci5BcHBzKSwgYXBwLl9pZClcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5bqU55SoJyN7YXBwLm5hbWV9J+W3suWtmOWcqFwiKVxuXG5cdFx0IyAyIG9iamVjdHPmoKHpqozvvJrmoLnmja5vYmplY3QubmFtZeWIpOaWreWvueixoeaYr+WQpuW3suWtmOWcqDsg5qCh6aqMdHJpZ2dlcnNcblx0XHRpZiBfLmlzQXJyYXkoaW1wX2RhdGEub2JqZWN0cykgJiYgaW1wX2RhdGEub2JqZWN0cy5sZW5ndGggPiAwXG5cdFx0XHRfLmVhY2ggaW1wX2RhdGEub2JqZWN0cywgKG9iamVjdCktPlxuXHRcdFx0XHRpZiBfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuT2JqZWN0cyksIG9iamVjdC5uYW1lKVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLlr7nosaEnI3tvYmplY3QubmFtZX0n5bey5a2Y5ZyoXCIpXG5cdFx0XHRcdF8uZWFjaCBvYmplY3QudHJpZ2dlcnMsICh0cmlnZ2VyKS0+XG5cdFx0XHRcdFx0aWYgdHJpZ2dlci5vbiA9PSAnc2VydmVyJyAmJiAhU3RlZWRvcy5pc0xlZ2FsVmVyc2lvbihzcGFjZV9pZCxcIndvcmtmbG93LmVudGVycHJpc2VcIilcblx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuWPquacieS8geS4mueJiOaUr+aMgemFjee9ruacjeWKoeerr+eahOinpuWPkeWZqFwiXG5cblx0XHRpbXBfb2JqZWN0X25hbWVzID0gXy5wbHVjayhpbXBfZGF0YS5vYmplY3RzLCBcIm5hbWVcIilcblx0XHRvYmplY3RfbmFtZXMgPSBfLmtleXMoQ3JlYXRvci5PYmplY3RzKVxuXG5cdFx0IyAzIOWIpOaWrWFwcHPnmoTlr7nosaHmmK/lkKbpg73lrZjlnKhcblx0XHRpZiBfLmlzQXJyYXkoaW1wX2RhdGEuYXBwcykgJiYgaW1wX2RhdGEuYXBwcy5sZW5ndGggPiAwXG5cdFx0XHRfLmVhY2ggaW1wX2RhdGEuYXBwcywgKGFwcCktPlxuXHRcdFx0XHRfLmVhY2ggYXBwLm9iamVjdHMsIChvYmplY3RfbmFtZSktPlxuXHRcdFx0XHRcdGlmICFfLmluY2x1ZGUob2JqZWN0X25hbWVzLCBvYmplY3RfbmFtZSkgJiYgIV8uaW5jbHVkZShpbXBfb2JqZWN0X25hbWVzLCBvYmplY3RfbmFtZSlcblx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLlupTnlKgnI3thcHAubmFtZX0n5Lit5oyH5a6a55qE5a+56LGhJyN7b2JqZWN0X25hbWV9J+S4jeWtmOWcqFwiKVxuXG5cdFx0IyA0IGxpc3Rfdmlld3PmoKHpqozvvJrliKTmlq1saXN0X3ZpZXdz5a+55bqU55qEb2JqZWN05piv5ZCm5a2Y5ZyoXG5cdFx0aWYgXy5pc0FycmF5KGltcF9kYXRhLmxpc3Rfdmlld3MpICYmIGltcF9kYXRhLmxpc3Rfdmlld3MubGVuZ3RoID4gMFxuXHRcdFx0Xy5lYWNoIGltcF9kYXRhLmxpc3Rfdmlld3MsIChsaXN0X3ZpZXcpLT5cblx0XHRcdFx0aWYgIWxpc3Rfdmlldy5vYmplY3RfbmFtZSB8fCAhXy5pc1N0cmluZyhsaXN0X3ZpZXcub2JqZWN0X25hbWUpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuWIl+ihqOinhuWbvicje2xpc3Rfdmlldy5uYW1lfSfnmoRvYmplY3RfbmFtZeWxnuaAp+aXoOaViFwiKVxuXHRcdFx0XHRpZiAhXy5pbmNsdWRlKG9iamVjdF9uYW1lcywgbGlzdF92aWV3Lm9iamVjdF9uYW1lKSAmJiAhXy5pbmNsdWRlKGltcF9vYmplY3RfbmFtZXMsIGxpc3Rfdmlldy5vYmplY3RfbmFtZSlcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5YiX6KGo6KeG5Zu+JyN7bGlzdF92aWV3Lm5hbWV9J+S4reaMh+WumueahOWvueixoScje2xpc3Rfdmlldy5vYmplY3RfbmFtZX0n5LiN5a2Y5ZyoXCIpXG5cblx0XHQjIDUgcGVybWlzc2lvbl9zZXTmoKHpqozvvJrliKTmlq3mnYPpmZDpm4bkuK3nmoTmjojmnYPlupTnlKhhc3NpZ25lZF9hcHBzOyDmnYPpmZDpm4bnmoTlkI3np7DkuI3lhYHorrjph43lpI1cblx0XHRwZXJtaXNzaW9uX3NldF9pZHMgPSBfLnBsdWNrKGltcF9kYXRhLnBlcm1pc3Npb25fc2V0LCBcIl9pZFwiKVxuXHRcdGlmIF8uaXNBcnJheShpbXBfZGF0YS5wZXJtaXNzaW9uX3NldCkgJiYgaW1wX2RhdGEucGVybWlzc2lvbl9zZXQubGVuZ3RoID4gMFxuXHRcdFx0Xy5lYWNoIGltcF9kYXRhLnBlcm1pc3Npb25fc2V0LCAocGVybWlzc2lvbl9zZXQpLT5cblx0XHRcdFx0aWYgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCBuYW1lOiBwZXJtaXNzaW9uX3NldC5uYW1lfSx7ZmllbGRzOntfaWQ6MX19KVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuadg+mZkOmbhuWQjeensCcje3Blcm1pc3Npb25fc2V0Lm5hbWV9J+S4jeiDvemHjeWkjVwiXG5cdFx0XHRcdF8uZWFjaCBwZXJtaXNzaW9uX3NldC5hc3NpZ25lZF9hcHBzLCAoYXBwX2lkKS0+XG5cdFx0XHRcdFx0aWYgIV8uaW5jbHVkZShfLmtleXMoQ3JlYXRvci5BcHBzKSwgYXBwX2lkKSAmJiAhXy5pbmNsdWRlKGltcF9hcHBfaWRzLCBhcHBfaWQpXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5p2D6ZmQ6ZuGJyN7cGVybWlzc2lvbl9zZXQubmFtZX0n55qE5o6I5p2D5bqU55SoJyN7YXBwX2lkfSfkuI3lrZjlnKhcIilcblxuXHRcdCMgNiBwZXJtaXNzaW9uX29iamVjdHPmoKHpqozvvJrliKTmlq3mnYPpmZDpm4bkuK3mjIflrprnmoRvYmplY3TmmK/lkKblrZjlnKjvvJvliKTmlq3mnYPpmZDpm4bmoIfor4bmmK/mmK/lkKbmnInmlYhcblx0XHRpZiBfLmlzQXJyYXkoaW1wX2RhdGEucGVybWlzc2lvbl9vYmplY3RzKSAmJiBpbXBfZGF0YS5wZXJtaXNzaW9uX29iamVjdHMubGVuZ3RoID4gMFxuXHRcdFx0Xy5lYWNoIGltcF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cywgKHBlcm1pc3Npb25fb2JqZWN0KS0+XG5cdFx0XHRcdGlmICFwZXJtaXNzaW9uX29iamVjdC5vYmplY3RfbmFtZSB8fCAhXy5pc1N0cmluZyhwZXJtaXNzaW9uX29iamVjdC5vYmplY3RfbmFtZSlcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5p2D6ZmQ6ZuGJyN7cGVybWlzc2lvbl9vYmplY3QubmFtZX0n55qEb2JqZWN0X25hbWXlsZ7mgKfml6DmlYhcIilcblx0XHRcdFx0aWYgIV8uaW5jbHVkZShvYmplY3RfbmFtZXMsIHBlcm1pc3Npb25fb2JqZWN0Lm9iamVjdF9uYW1lKSAmJiAhXy5pbmNsdWRlKGltcF9vYmplY3RfbmFtZXMsIHBlcm1pc3Npb25fb2JqZWN0Lm9iamVjdF9uYW1lKVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLmnYPpmZDpm4YnI3tsaXN0X3ZpZXcubmFtZX0n5Lit5oyH5a6a55qE5a+56LGhJyN7cGVybWlzc2lvbl9vYmplY3Qub2JqZWN0X25hbWV9J+S4jeWtmOWcqFwiKVxuXG5cdFx0XHRcdGlmICFfLmhhcyhwZXJtaXNzaW9uX29iamVjdCwgXCJwZXJtaXNzaW9uX3NldF9pZFwiKSB8fCAhXy5pc1N0cmluZyhwZXJtaXNzaW9uX29iamVjdC5wZXJtaXNzaW9uX3NldF9pZClcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5p2D6ZmQ6ZuGJyN7cGVybWlzc2lvbl9vYmplY3QubmFtZX0n55qEcGVybWlzc2lvbl9zZXRfaWTlsZ7mgKfml6DmlYhcIilcblx0XHRcdFx0ZWxzZSBpZiAhXy5pbmNsdWRlKHBlcm1pc3Npb25fc2V0X2lkcywgcGVybWlzc2lvbl9vYmplY3QucGVybWlzc2lvbl9zZXRfaWQpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuadg+mZkOmbhicje3Blcm1pc3Npb25fb2JqZWN0Lm5hbWV9J+aMh+WumueahOadg+mZkOmbhicje3Blcm1pc3Npb25fb2JqZWN0LnBlcm1pc3Npb25fc2V0X2lkfSflgLzkuI3lnKjlr7zlhaXnmoRwZXJtaXNzaW9uX3NldOS4rVwiKVxuXG5cdFx0IyA3IHJlcG9ydHPmoKHpqozvvJrliKTmlq3miqXooajkuK3mjIflrprnmoRvYmplY3TmmK/lkKblrZjlnKhcblx0XHRpZiBfLmlzQXJyYXkoaW1wX2RhdGEucmVwb3J0cykgJiYgaW1wX2RhdGEucmVwb3J0cy5sZW5ndGggPiAwXG5cdFx0XHRfLmVhY2ggaW1wX2RhdGEucmVwb3J0cywgKHJlcG9ydCktPlxuXHRcdFx0XHRpZiAhcmVwb3J0Lm9iamVjdF9uYW1lIHx8ICFfLmlzU3RyaW5nKHJlcG9ydC5vYmplY3RfbmFtZSlcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5oql6KGoJyN7cmVwb3J0Lm5hbWV9J+eahG9iamVjdF9uYW1l5bGe5oCn5peg5pWIXCIpXG5cdFx0XHRcdGlmICFfLmluY2x1ZGUob2JqZWN0X25hbWVzLCByZXBvcnQub2JqZWN0X25hbWUpICYmICFfLmluY2x1ZGUoaW1wX29iamVjdF9uYW1lcywgcmVwb3J0Lm9iamVjdF9uYW1lKVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLmiqXooagnI3tyZXBvcnQubmFtZX0n5Lit5oyH5a6a55qE5a+56LGhJyN7cmVwb3J0Lm9iamVjdF9uYW1lfSfkuI3lrZjlnKhcIilcblxuXHQjIyPmlbDmja7moKHpqowg57uT5p2fIyMjXG5cblx0IyMj5pWw5o2u5oyB5LmF5YyWIOW8gOWniyMjI1xuXG5cdCMg5a6a5LmJ5paw5pen5pWw5o2u5a+55bqU5YWz57O76ZuG5ZCIXG5cdGFwcHNfaWRfbWFwcyA9IHt9XG5cdGxpc3Rfdmlld3NfaWRfbWFwcyA9IHt9XG5cdHBlcm1pc3Npb25fc2V0X2lkX21hcHMgPSB7fVxuXG5cdCMgMSDmjIHkuYXljJZBcHBzXG5cdGlmIF8uaXNBcnJheShpbXBfZGF0YS5hcHBzKSAmJiBpbXBfZGF0YS5hcHBzLmxlbmd0aCA+IDBcblx0XHRfLmVhY2ggaW1wX2RhdGEuYXBwcywgKGFwcCktPlxuXHRcdFx0b2xkX2lkID0gYXBwLl9pZFxuXHRcdFx0ZGVsZXRlIGFwcC5faWRcblx0XHRcdGFwcC5zcGFjZSA9IHNwYWNlX2lkXG5cdFx0XHRhcHAub3duZXIgPSB1c2VySWRcblx0XHRcdGFwcC5pc19jcmVhdG9yID0gdHJ1ZVxuXHRcdFx0bmV3X2lkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwc1wiKS5pbnNlcnQoYXBwKVxuXHRcdFx0YXBwc19pZF9tYXBzW29sZF9pZF0gPSBuZXdfaWRcblxuXHQjIDIg5oyB5LmF5YyWb2JqZWN0c1xuXHRpZiBfLmlzQXJyYXkoaW1wX2RhdGEub2JqZWN0cykgJiYgaW1wX2RhdGEub2JqZWN0cy5sZW5ndGggPiAwXG5cdFx0Xy5lYWNoIGltcF9kYXRhLm9iamVjdHMsIChvYmplY3QpLT5cblx0XHRcdENyZWF0b3IuaW1wb3J0T2JqZWN0KHVzZXJJZCwgc3BhY2VfaWQsIG9iamVjdCwgbGlzdF92aWV3c19pZF9tYXBzKVxuXG5cdCMgMyDmjIHkuYXljJZsaXN0X3ZpZXdzXG5cdGlmIF8uaXNBcnJheShpbXBfZGF0YS5saXN0X3ZpZXdzKSAmJiBpbXBfZGF0YS5saXN0X3ZpZXdzLmxlbmd0aCA+IDBcblx0XHRfLmVhY2ggaW1wX2RhdGEubGlzdF92aWV3cywgKGxpc3RfdmlldyktPlxuXHRcdFx0b2xkX2lkID0gbGlzdF92aWV3Ll9pZFxuXHRcdFx0ZGVsZXRlIGxpc3Rfdmlldy5faWRcblxuXHRcdFx0bGlzdF92aWV3LnNwYWNlID0gc3BhY2VfaWRcblx0XHRcdGxpc3Rfdmlldy5vd25lciA9IHVzZXJJZFxuXHRcdFx0aWYgQ3JlYXRvci5pc0FsbFZpZXcobGlzdF92aWV3KSB8fCBDcmVhdG9yLmlzUmVjZW50VmlldyhsaXN0X3ZpZXcpXG5cdFx0XHRcdCMg5Yib5bu6b2JqZWN05pe277yM5Lya6Ieq5Yqo5re75YqgYWxsIHZpZXfjgIFyZWNlbnQgdmlld1xuXHRcdFx0XHRfbGlzdF92aWV3ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kT25lKHtvYmplY3RfbmFtZTogbGlzdF92aWV3Lm9iamVjdF9uYW1lLCBuYW1lOiBsaXN0X3ZpZXcubmFtZSwgc3BhY2U6IHNwYWNlX2lkfSx7ZmllbGRzOiB7X2lkOiAxfX0pXG5cdFx0XHRcdGlmIF9saXN0X3ZpZXdcblx0XHRcdFx0XHRuZXdfaWQgPSBfbGlzdF92aWV3Ll9pZFxuXHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLnVwZGF0ZSh7b2JqZWN0X25hbWU6IGxpc3Rfdmlldy5vYmplY3RfbmFtZSwgbmFtZTogbGlzdF92aWV3Lm5hbWUsIHNwYWNlOiBzcGFjZV9pZH0sIHskc2V0OiBsaXN0X3ZpZXd9KVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRuZXdfaWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmluc2VydChsaXN0X3ZpZXcpXG5cblx0XHRcdGxpc3Rfdmlld3NfaWRfbWFwc1tsaXN0X3ZpZXcub2JqZWN0X25hbWUgKyBcIl9cIiArIG9sZF9pZF0gPSBuZXdfaWRcblxuXHQjIDQg5oyB5LmF5YyWcGVybWlzc2lvbl9zZXRcblx0aWYgXy5pc0FycmF5KGltcF9kYXRhLnBlcm1pc3Npb25fc2V0KSAmJiBpbXBfZGF0YS5wZXJtaXNzaW9uX3NldC5sZW5ndGggPiAwXG5cdFx0Xy5lYWNoIGltcF9kYXRhLnBlcm1pc3Npb25fc2V0LCAocGVybWlzc2lvbl9zZXQpLT5cblx0XHRcdG9sZF9pZCA9IHBlcm1pc3Npb25fc2V0Ll9pZFxuXHRcdFx0ZGVsZXRlIHBlcm1pc3Npb25fc2V0Ll9pZFxuXG5cdFx0XHRwZXJtaXNzaW9uX3NldC5zcGFjZSA9IHNwYWNlX2lkXG5cdFx0XHRwZXJtaXNzaW9uX3NldC5vd25lciA9IHVzZXJJZFxuXG5cdFx0XHRwZXJtaXNzaW9uX3NldF91c2VycyA9IFtdXG5cdFx0XHRfLmVhY2ggcGVybWlzc2lvbl9zZXQudXNlcnMsICh1c2VyX2lkKS0+XG5cdFx0XHRcdHNwYWNlX3VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJfaWR9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXG5cdFx0XHRcdGlmIHNwYWNlX3VzZXJcblx0XHRcdFx0XHRwZXJtaXNzaW9uX3NldF91c2Vycy5wdXNoIHVzZXJfaWRcblxuXHRcdFx0YXNzaWduZWRfYXBwcyA9IFtdXG5cdFx0XHRfLmVhY2ggcGVybWlzc2lvbl9zZXQuYXNzaWduZWRfYXBwcywgKGFwcF9pZCktPlxuXHRcdFx0XHRpZiBfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuQXBwcyksIGFwcF9pZClcblx0XHRcdFx0XHRhc3NpZ25lZF9hcHBzLnB1c2ggYXBwX2lkXG5cdFx0XHRcdGVsc2UgaWYgYXBwc19pZF9tYXBzW2FwcF9pZF1cblx0XHRcdFx0XHRhc3NpZ25lZF9hcHBzLnB1c2ggYXBwc19pZF9tYXBzW2FwcF9pZF1cblxuXG5cdFx0XHRuZXdfaWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5pbnNlcnQocGVybWlzc2lvbl9zZXQpXG5cblx0XHRcdHBlcm1pc3Npb25fc2V0X2lkX21hcHNbb2xkX2lkXSA9IG5ld19pZFxuXG5cdCMgNSAg5oyB5LmF5YyWcGVybWlzc2lvbl9vYmplY3RzXG5cdGlmIF8uaXNBcnJheShpbXBfZGF0YS5wZXJtaXNzaW9uX29iamVjdHMpICYmIGltcF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cy5sZW5ndGggPiAwXG5cdFx0Xy5lYWNoIGltcF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cywgKHBlcm1pc3Npb25fb2JqZWN0KS0+XG5cdFx0XHRkZWxldGUgcGVybWlzc2lvbl9vYmplY3QuX2lkXG5cblx0XHRcdHBlcm1pc3Npb25fb2JqZWN0LnNwYWNlID0gc3BhY2VfaWRcblx0XHRcdHBlcm1pc3Npb25fb2JqZWN0Lm93bmVyID0gdXNlcklkXG5cblx0XHRcdHBlcm1pc3Npb25fb2JqZWN0LnBlcm1pc3Npb25fc2V0X2lkID0gcGVybWlzc2lvbl9zZXRfaWRfbWFwc1twZXJtaXNzaW9uX29iamVjdC5wZXJtaXNzaW9uX3NldF9pZF1cblxuXHRcdFx0ZGlzYWJsZWRfbGlzdF92aWV3cyA9IFtdXG5cdFx0XHRfLmVhY2ggcGVybWlzc2lvbl9vYmplY3QuZGlzYWJsZWRfbGlzdF92aWV3cywgKGxpc3Rfdmlld19pZCktPlxuXHRcdFx0XHRuZXdfdmlld19pZCA9IGxpc3Rfdmlld3NfaWRfbWFwc1twZXJtaXNzaW9uX29iamVjdC5vYmplY3RfbmFtZSArIFwiX1wiICsgbGlzdF92aWV3X2lkXVxuXHRcdFx0XHRpZiBuZXdfdmlld19pZFxuXHRcdFx0XHRcdGRpc2FibGVkX2xpc3Rfdmlld3MucHVzaCBuZXdfdmlld19pZFxuXG5cdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuaW5zZXJ0KHBlcm1pc3Npb25fb2JqZWN0KVxuXG5cdCMgNiDmjIHkuYXljJZyZXBvcnRzXG5cdGlmIF8uaXNBcnJheShpbXBfZGF0YS5yZXBvcnRzKSAmJiBpbXBfZGF0YS5yZXBvcnRzLmxlbmd0aCA+IDBcblx0XHRfLmVhY2ggaW1wX2RhdGEucmVwb3J0cywgKHJlcG9ydCktPlxuXHRcdFx0ZGVsZXRlIHJlcG9ydC5faWRcblxuXHRcdFx0cmVwb3J0LnNwYWNlID0gc3BhY2VfaWRcblx0XHRcdHJlcG9ydC5vd25lciA9IHVzZXJJZFxuXG5cdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJyZXBvcnRzXCIpLmluc2VydChyZXBvcnQpXG5cdCMjI+aVsOaNruaMgeS5heWMliDnu5PmnZ8jIyNcblxuIyMj55Sx5LqO5L2/55So5o6l5Y+j5pa55byP5Lya5a+86Ie0Y29sbGVjdGlvbueahGFmdGVy44CBYmVmb3Jl5Lit6I635Y+W5LiN5YiwdXNlcklk77yM5YaN5q2k6Zeu6aKY5pyq6Kej5Yaz5LmL5YmN77yM6L+Y5piv5L2/55SoTWV0aG9kXG5Kc29uUm91dGVzLmFkZCAncG9zdCcsICcvYXBpL2NyZWF0b3IvYXBwX3BhY2thZ2UvaW1wb3J0LzpzcGFjZV9pZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0dHJ5XG5cdFx0dXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcblx0XHRzcGFjZV9pZCA9IHJlcS5wYXJhbXMuc3BhY2VfaWRcblx0XHRpbXBfZGF0YSA9IHJlcS5ib2R5XG5cdFx0aW1wb3J0X2FwcF9wYWNrYWdlKHVzZXJJZCwgc3BhY2VfaWQsIGltcF9kYXRhKVxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdGNvZGU6IDIwMFxuXHRcdFx0ZGF0YToge31cblx0XHR9XG5cdGNhdGNoIGVcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRjb2RlOiBlLmVycm9yXG5cdFx0XHRkYXRhOiB7IGVycm9yczogZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfVxuXHRcdH1cbiMjI1xuXG5NZXRlb3IubWV0aG9kc1xuXHQnaW1wb3J0X2FwcF9wYWNrYWdlJzogKHNwYWNlX2lkLCBpbXBfZGF0YSktPlxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXG5cdFx0Q3JlYXRvci5pbXBvcnRfYXBwX3BhY2thZ2UodXNlcklkLCBzcGFjZV9pZCwgaW1wX2RhdGEpXG4iLCJ2YXIgdHJhbnNmb3JtRmllbGRPcHRpb25zLCB0cmFuc2Zvcm1GaWx0ZXJzO1xuXG50cmFuc2Zvcm1GaWx0ZXJzID0gZnVuY3Rpb24oZmlsdGVycykge1xuICB2YXIgX2ZpbHRlcnM7XG4gIF9maWx0ZXJzID0gW107XG4gIF8uZWFjaChmaWx0ZXJzLCBmdW5jdGlvbihmKSB7XG4gICAgaWYgKF8uaXNBcnJheShmKSAmJiBmLmxlbmd0aCA9PT0gMykge1xuICAgICAgcmV0dXJuIF9maWx0ZXJzLnB1c2goe1xuICAgICAgICBmaWVsZDogZlswXSxcbiAgICAgICAgb3BlcmF0aW9uOiBmWzFdLFxuICAgICAgICB2YWx1ZTogZlsyXVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBfZmlsdGVycy5wdXNoKGYpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBfZmlsdGVycztcbn07XG5cbnRyYW5zZm9ybUZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgdmFyIF9vcHRpb25zO1xuICBpZiAoIV8uaXNBcnJheShvcHRpb25zKSkge1xuICAgIHJldHVybiBvcHRpb25zO1xuICB9XG4gIF9vcHRpb25zID0gW107XG4gIF8uZWFjaChvcHRpb25zLCBmdW5jdGlvbihvKSB7XG4gICAgaWYgKG8gJiYgXy5oYXMobywgJ2xhYmVsJykgJiYgXy5oYXMobywgJ3ZhbHVlJykpIHtcbiAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKG8ubGFiZWwgKyBcIjpcIiArIG8udmFsdWUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBfb3B0aW9ucy5qb2luKCcsJyk7XG59O1xuXG5DcmVhdG9yLmltcG9ydE9iamVjdCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VfaWQsIG9iamVjdCwgbGlzdF92aWV3c19pZF9tYXBzKSB7XG4gIHZhciBfZmllbGRuYW1lcywgYWN0aW9ucywgZmllbGRzLCBoYXNSZWNlbnRWaWV3LCBpbnRlcm5hbF9saXN0X3ZpZXcsIG9ial9saXN0X3ZpZXdzLCB0cmlnZ2VycztcbiAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLWltcG9ydE9iamVjdC0tLS0tLS0tLS0tLS0tLS0tLScsIG9iamVjdC5uYW1lKTtcbiAgZmllbGRzID0gb2JqZWN0LmZpZWxkcztcbiAgdHJpZ2dlcnMgPSBvYmplY3QudHJpZ2dlcnM7XG4gIGFjdGlvbnMgPSBvYmplY3QuYWN0aW9ucztcbiAgb2JqX2xpc3Rfdmlld3MgPSBvYmplY3QubGlzdF92aWV3cztcbiAgZGVsZXRlIG9iamVjdC5faWQ7XG4gIGRlbGV0ZSBvYmplY3QuZmllbGRzO1xuICBkZWxldGUgb2JqZWN0LnRyaWdnZXJzO1xuICBkZWxldGUgb2JqZWN0LmFjdGlvbnM7XG4gIGRlbGV0ZSBvYmplY3QucGVybWlzc2lvbnM7XG4gIGRlbGV0ZSBvYmplY3QubGlzdF92aWV3cztcbiAgb2JqZWN0LnNwYWNlID0gc3BhY2VfaWQ7XG4gIG9iamVjdC5vd25lciA9IHVzZXJJZDtcbiAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS5pbnNlcnQob2JqZWN0KTtcbiAgaW50ZXJuYWxfbGlzdF92aWV3ID0ge307XG4gIGhhc1JlY2VudFZpZXcgPSBmYWxzZTtcbiAgY29uc29sZS5sb2coJ+aMgeS5heWMluWvueixoWxpc3Rfdmlld3MnKTtcbiAgXy5lYWNoKG9ial9saXN0X3ZpZXdzLCBmdW5jdGlvbihsaXN0X3ZpZXcpIHtcbiAgICB2YXIgbmV3X2lkLCBvbGRfaWQsIG9wdGlvbnM7XG4gICAgb2xkX2lkID0gbGlzdF92aWV3Ll9pZDtcbiAgICBkZWxldGUgbGlzdF92aWV3Ll9pZDtcbiAgICBsaXN0X3ZpZXcuc3BhY2UgPSBzcGFjZV9pZDtcbiAgICBsaXN0X3ZpZXcub3duZXIgPSB1c2VySWQ7XG4gICAgbGlzdF92aWV3Lm9iamVjdF9uYW1lID0gb2JqZWN0Lm5hbWU7XG4gICAgaWYgKENyZWF0b3IuaXNSZWNlbnRWaWV3KGxpc3RfdmlldykpIHtcbiAgICAgIGhhc1JlY2VudFZpZXcgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAobGlzdF92aWV3LmZpbHRlcnMpIHtcbiAgICAgIGxpc3Rfdmlldy5maWx0ZXJzID0gdHJhbnNmb3JtRmlsdGVycyhsaXN0X3ZpZXcuZmlsdGVycyk7XG4gICAgfVxuICAgIGlmIChDcmVhdG9yLmlzQWxsVmlldyhsaXN0X3ZpZXcpIHx8IENyZWF0b3IuaXNSZWNlbnRWaWV3KGxpc3RfdmlldykpIHtcbiAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICRzZXQ6IGxpc3Rfdmlld1xuICAgICAgfTtcbiAgICAgIGlmICghbGlzdF92aWV3LmNvbHVtbnMpIHtcbiAgICAgICAgb3B0aW9ucy4kdW5zZXQgPSB7XG4gICAgICAgICAgY29sdW1uczogJydcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLnVwZGF0ZSh7XG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3QubmFtZSxcbiAgICAgICAgbmFtZTogbGlzdF92aWV3Lm5hbWUsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgfSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld19pZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuaW5zZXJ0KGxpc3Rfdmlldyk7XG4gICAgICByZXR1cm4gbGlzdF92aWV3c19pZF9tYXBzW29iamVjdC5uYW1lICsgXCJfXCIgKyBvbGRfaWRdID0gbmV3X2lkO1xuICAgIH1cbiAgfSk7XG4gIGlmICghaGFzUmVjZW50Vmlldykge1xuICAgIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikucmVtb3ZlKHtcbiAgICAgIG5hbWU6IFwicmVjZW50XCIsXG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0Lm5hbWUsXG4gICAgICBvd25lcjogdXNlcklkXG4gICAgfSk7XG4gIH1cbiAgY29uc29sZS5sb2coJ+aMgeS5heWMluWvueixoeWtl+autScpO1xuICBfZmllbGRuYW1lcyA9IFtdO1xuICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgaykge1xuICAgIGRlbGV0ZSBmaWVsZC5faWQ7XG4gICAgZmllbGQuc3BhY2UgPSBzcGFjZV9pZDtcbiAgICBmaWVsZC5vd25lciA9IHVzZXJJZDtcbiAgICBmaWVsZC5vYmplY3QgPSBvYmplY3QubmFtZTtcbiAgICBpZiAoZmllbGQub3B0aW9ucykge1xuICAgICAgZmllbGQub3B0aW9ucyA9IHRyYW5zZm9ybUZpZWxkT3B0aW9ucyhmaWVsZC5vcHRpb25zKTtcbiAgICB9XG4gICAgaWYgKCFfLmhhcyhmaWVsZCwgXCJuYW1lXCIpKSB7XG4gICAgICBmaWVsZC5uYW1lID0gaztcbiAgICB9XG4gICAgX2ZpZWxkbmFtZXMucHVzaChmaWVsZC5uYW1lKTtcbiAgICBpZiAoZmllbGQubmFtZSA9PT0gXCJuYW1lXCIpIHtcbiAgICAgIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9maWVsZHNcIikudXBkYXRlKHtcbiAgICAgICAgb2JqZWN0OiBvYmplY3QubmFtZSxcbiAgICAgICAgbmFtZTogXCJuYW1lXCIsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiBmaWVsZFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9maWVsZHNcIikuaW5zZXJ0KGZpZWxkKTtcbiAgICB9XG4gICAgaWYgKCFfLmNvbnRhaW5zKF9maWVsZG5hbWVzLCAnbmFtZScpKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS5kaXJlY3QucmVtb3ZlKHtcbiAgICAgICAgb2JqZWN0OiBvYmplY3QubmFtZSxcbiAgICAgICAgbmFtZTogXCJuYW1lXCIsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgY29uc29sZS5sb2coJ+aMgeS5heWMluinpuWPkeWZqCcpO1xuICBfLmVhY2godHJpZ2dlcnMsIGZ1bmN0aW9uKHRyaWdnZXIsIGspIHtcbiAgICBkZWxldGUgdHJpZ2dlcnMuX2lkO1xuICAgIHRyaWdnZXIuc3BhY2UgPSBzcGFjZV9pZDtcbiAgICB0cmlnZ2VyLm93bmVyID0gdXNlcklkO1xuICAgIHRyaWdnZXIub2JqZWN0ID0gb2JqZWN0Lm5hbWU7XG4gICAgaWYgKCFfLmhhcyh0cmlnZ2VyLCBcIm5hbWVcIikpIHtcbiAgICAgIHRyaWdnZXIubmFtZSA9IGsucmVwbGFjZShuZXcgUmVnRXhwKFwiXFxcXC5cIiwgXCJnXCIpLCBcIl9cIik7XG4gICAgfVxuICAgIGlmICghXy5oYXModHJpZ2dlciwgXCJpc19lbmFibGVcIikpIHtcbiAgICAgIHRyaWdnZXIuaXNfZW5hYmxlID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF90cmlnZ2Vyc1wiKS5pbnNlcnQodHJpZ2dlcik7XG4gIH0pO1xuICBjb25zb2xlLmxvZygn5oyB5LmF5YyW5pON5L2cJyk7XG4gIF8uZWFjaChhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24sIGspIHtcbiAgICBkZWxldGUgYWN0aW9uLl9pZDtcbiAgICBhY3Rpb24uc3BhY2UgPSBzcGFjZV9pZDtcbiAgICBhY3Rpb24ub3duZXIgPSB1c2VySWQ7XG4gICAgYWN0aW9uLm9iamVjdCA9IG9iamVjdC5uYW1lO1xuICAgIGlmICghXy5oYXMoYWN0aW9uLCBcIm5hbWVcIikpIHtcbiAgICAgIGFjdGlvbi5uYW1lID0gay5yZXBsYWNlKG5ldyBSZWdFeHAoXCJcXFxcLlwiLCBcImdcIiksIFwiX1wiKTtcbiAgICB9XG4gICAgaWYgKCFfLmhhcyhhY3Rpb24sIFwiaXNfZW5hYmxlXCIpKSB7XG4gICAgICBhY3Rpb24uaXNfZW5hYmxlID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9hY3Rpb25zXCIpLmluc2VydChhY3Rpb24pO1xuICB9KTtcbiAgcmV0dXJuIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS1pbXBvcnRPYmplY3QgZW5kLS0tLS0tLS0tLS0tLS0tLS0tJywgb2JqZWN0Lm5hbWUpO1xufTtcblxuQ3JlYXRvci5pbXBvcnRfYXBwX3BhY2thZ2UgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlX2lkLCBpbXBfZGF0YSwgZnJvbV90ZW1wbGF0ZSkge1xuICB2YXIgYXBwc19pZF9tYXBzLCBpbXBfYXBwX2lkcywgaW1wX29iamVjdF9uYW1lcywgbGlzdF92aWV3c19pZF9tYXBzLCBvYmplY3RfbmFtZXMsIHBlcm1pc3Npb25fc2V0X2lkX21hcHMsIHBlcm1pc3Npb25fc2V0X2lkcztcbiAgaWYgKCF1c2VySWQpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNDAxXCIsIFwiQXV0aGVudGljYXRpb24gaXMgcmVxdWlyZWQgYW5kIGhhcyBub3QgYmVlbiBwcm92aWRlZC5cIik7XG4gIH1cbiAgaWYgKCFDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgdXNlcklkKSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI0MDFcIiwgXCJQZXJtaXNzaW9uIGRlbmllZC5cIik7XG4gIH1cblxuICAvKuaVsOaNruagoemqjCDlvIDlp4sgKi9cbiAgY2hlY2soaW1wX2RhdGEsIE9iamVjdCk7XG4gIGlmICghZnJvbV90ZW1wbGF0ZSkge1xuICAgIGltcF9hcHBfaWRzID0gXy5wbHVjayhpbXBfZGF0YS5hcHBzLCBcIl9pZFwiKTtcbiAgICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLmFwcHMpICYmIGltcF9kYXRhLmFwcHMubGVuZ3RoID4gMCkge1xuICAgICAgXy5lYWNoKGltcF9kYXRhLmFwcHMsIGZ1bmN0aW9uKGFwcCkge1xuICAgICAgICBpZiAoXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLkFwcHMpLCBhcHAuX2lkKSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLlupTnlKgnXCIgKyBhcHAubmFtZSArIFwiJ+W3suWtmOWcqFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkoaW1wX2RhdGEub2JqZWN0cykgJiYgaW1wX2RhdGEub2JqZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICBfLmVhY2goaW1wX2RhdGEub2JqZWN0cywgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgIGlmIChfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuT2JqZWN0cyksIG9iamVjdC5uYW1lKSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLlr7nosaEnXCIgKyBvYmplY3QubmFtZSArIFwiJ+W3suWtmOWcqFwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXy5lYWNoKG9iamVjdC50cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlcikge1xuICAgICAgICAgIGlmICh0cmlnZ2VyLm9uID09PSAnc2VydmVyJyAmJiAhU3RlZWRvcy5pc0xlZ2FsVmVyc2lvbihzcGFjZV9pZCwgXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLlj6rmnInkvIHkuJrniYjmlK/mjIHphY3nva7mnI3liqHnq6/nmoTop6blj5HlmahcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpbXBfb2JqZWN0X25hbWVzID0gXy5wbHVjayhpbXBfZGF0YS5vYmplY3RzLCBcIm5hbWVcIik7XG4gICAgb2JqZWN0X25hbWVzID0gXy5rZXlzKENyZWF0b3IuT2JqZWN0cyk7XG4gICAgaWYgKF8uaXNBcnJheShpbXBfZGF0YS5hcHBzKSAmJiBpbXBfZGF0YS5hcHBzLmxlbmd0aCA+IDApIHtcbiAgICAgIF8uZWFjaChpbXBfZGF0YS5hcHBzLCBmdW5jdGlvbihhcHApIHtcbiAgICAgICAgcmV0dXJuIF8uZWFjaChhcHAub2JqZWN0cywgZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICAgICAgICBpZiAoIV8uaW5jbHVkZShvYmplY3RfbmFtZXMsIG9iamVjdF9uYW1lKSAmJiAhXy5pbmNsdWRlKGltcF9vYmplY3RfbmFtZXMsIG9iamVjdF9uYW1lKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuW6lOeUqCdcIiArIGFwcC5uYW1lICsgXCIn5Lit5oyH5a6a55qE5a+56LGhJ1wiICsgb2JqZWN0X25hbWUgKyBcIifkuI3lrZjlnKhcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLmxpc3Rfdmlld3MpICYmIGltcF9kYXRhLmxpc3Rfdmlld3MubGVuZ3RoID4gMCkge1xuICAgICAgXy5lYWNoKGltcF9kYXRhLmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGxpc3Rfdmlldykge1xuICAgICAgICBpZiAoIWxpc3Rfdmlldy5vYmplY3RfbmFtZSB8fCAhXy5pc1N0cmluZyhsaXN0X3ZpZXcub2JqZWN0X25hbWUpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuWIl+ihqOinhuWbvidcIiArIGxpc3Rfdmlldy5uYW1lICsgXCIn55qEb2JqZWN0X25hbWXlsZ7mgKfml6DmlYhcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFfLmluY2x1ZGUob2JqZWN0X25hbWVzLCBsaXN0X3ZpZXcub2JqZWN0X25hbWUpICYmICFfLmluY2x1ZGUoaW1wX29iamVjdF9uYW1lcywgbGlzdF92aWV3Lm9iamVjdF9uYW1lKSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLliJfooajop4blm74nXCIgKyBsaXN0X3ZpZXcubmFtZSArIFwiJ+S4reaMh+WumueahOWvueixoSdcIiArIGxpc3Rfdmlldy5vYmplY3RfbmFtZSArIFwiJ+S4jeWtmOWcqFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHBlcm1pc3Npb25fc2V0X2lkcyA9IF8ucGx1Y2soaW1wX2RhdGEucGVybWlzc2lvbl9zZXQsIFwiX2lkXCIpO1xuICAgIGlmIChfLmlzQXJyYXkoaW1wX2RhdGEucGVybWlzc2lvbl9zZXQpICYmIGltcF9kYXRhLnBlcm1pc3Npb25fc2V0Lmxlbmd0aCA+IDApIHtcbiAgICAgIF8uZWFjaChpbXBfZGF0YS5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24ocGVybWlzc2lvbl9zZXQpIHtcbiAgICAgICAgaWYgKENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICBuYW1lOiBwZXJtaXNzaW9uX3NldC5uYW1lXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLmnYPpmZDpm4blkI3np7AnXCIgKyBwZXJtaXNzaW9uX3NldC5uYW1lICsgXCIn5LiN6IO96YeN5aSNXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfLmVhY2gocGVybWlzc2lvbl9zZXQuYXNzaWduZWRfYXBwcywgZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgICAgICAgaWYgKCFfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuQXBwcyksIGFwcF9pZCkgJiYgIV8uaW5jbHVkZShpbXBfYXBwX2lkcywgYXBwX2lkKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuadg+mZkOmbhidcIiArIHBlcm1pc3Npb25fc2V0Lm5hbWUgKyBcIifnmoTmjojmnYPlupTnlKgnXCIgKyBhcHBfaWQgKyBcIifkuI3lrZjlnKhcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cykgJiYgaW1wX2RhdGEucGVybWlzc2lvbl9vYmplY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgIF8uZWFjaChpbXBfZGF0YS5wZXJtaXNzaW9uX29iamVjdHMsIGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0KSB7XG4gICAgICAgIGlmICghcGVybWlzc2lvbl9vYmplY3Qub2JqZWN0X25hbWUgfHwgIV8uaXNTdHJpbmcocGVybWlzc2lvbl9vYmplY3Qub2JqZWN0X25hbWUpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuadg+mZkOmbhidcIiArIHBlcm1pc3Npb25fb2JqZWN0Lm5hbWUgKyBcIifnmoRvYmplY3RfbmFtZeWxnuaAp+aXoOaViFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIV8uaW5jbHVkZShvYmplY3RfbmFtZXMsIHBlcm1pc3Npb25fb2JqZWN0Lm9iamVjdF9uYW1lKSAmJiAhXy5pbmNsdWRlKGltcF9vYmplY3RfbmFtZXMsIHBlcm1pc3Npb25fb2JqZWN0Lm9iamVjdF9uYW1lKSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLmnYPpmZDpm4YnXCIgKyBsaXN0X3ZpZXcubmFtZSArIFwiJ+S4reaMh+WumueahOWvueixoSdcIiArIHBlcm1pc3Npb25fb2JqZWN0Lm9iamVjdF9uYW1lICsgXCIn5LiN5a2Y5ZyoXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghXy5oYXMocGVybWlzc2lvbl9vYmplY3QsIFwicGVybWlzc2lvbl9zZXRfaWRcIikgfHwgIV8uaXNTdHJpbmcocGVybWlzc2lvbl9vYmplY3QucGVybWlzc2lvbl9zZXRfaWQpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuadg+mZkOmbhidcIiArIHBlcm1pc3Npb25fb2JqZWN0Lm5hbWUgKyBcIifnmoRwZXJtaXNzaW9uX3NldF9pZOWxnuaAp+aXoOaViFwiKTtcbiAgICAgICAgfSBlbHNlIGlmICghXy5pbmNsdWRlKHBlcm1pc3Npb25fc2V0X2lkcywgcGVybWlzc2lvbl9vYmplY3QucGVybWlzc2lvbl9zZXRfaWQpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuadg+mZkOmbhidcIiArIHBlcm1pc3Npb25fb2JqZWN0Lm5hbWUgKyBcIifmjIflrprnmoTmnYPpmZDpm4YnXCIgKyBwZXJtaXNzaW9uX29iamVjdC5wZXJtaXNzaW9uX3NldF9pZCArIFwiJ+WAvOS4jeWcqOWvvOWFpeeahHBlcm1pc3Npb25fc2V05LitXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShpbXBfZGF0YS5yZXBvcnRzKSAmJiBpbXBfZGF0YS5yZXBvcnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIF8uZWFjaChpbXBfZGF0YS5yZXBvcnRzLCBmdW5jdGlvbihyZXBvcnQpIHtcbiAgICAgICAgaWYgKCFyZXBvcnQub2JqZWN0X25hbWUgfHwgIV8uaXNTdHJpbmcocmVwb3J0Lm9iamVjdF9uYW1lKSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLmiqXooagnXCIgKyByZXBvcnQubmFtZSArIFwiJ+eahG9iamVjdF9uYW1l5bGe5oCn5peg5pWIXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghXy5pbmNsdWRlKG9iamVjdF9uYW1lcywgcmVwb3J0Lm9iamVjdF9uYW1lKSAmJiAhXy5pbmNsdWRlKGltcF9vYmplY3RfbmFtZXMsIHJlcG9ydC5vYmplY3RfbmFtZSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5oql6KGoJ1wiICsgcmVwb3J0Lm5hbWUgKyBcIifkuK3mjIflrprnmoTlr7nosaEnXCIgKyByZXBvcnQub2JqZWN0X25hbWUgKyBcIifkuI3lrZjlnKhcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8q5pWw5o2u5qCh6aqMIOe7k+adnyAqL1xuXG4gIC8q5pWw5o2u5oyB5LmF5YyWIOW8gOWniyAqL1xuICBhcHBzX2lkX21hcHMgPSB7fTtcbiAgbGlzdF92aWV3c19pZF9tYXBzID0ge307XG4gIHBlcm1pc3Npb25fc2V0X2lkX21hcHMgPSB7fTtcbiAgaWYgKF8uaXNBcnJheShpbXBfZGF0YS5hcHBzKSAmJiBpbXBfZGF0YS5hcHBzLmxlbmd0aCA+IDApIHtcbiAgICBfLmVhY2goaW1wX2RhdGEuYXBwcywgZnVuY3Rpb24oYXBwKSB7XG4gICAgICB2YXIgbmV3X2lkLCBvbGRfaWQ7XG4gICAgICBvbGRfaWQgPSBhcHAuX2lkO1xuICAgICAgZGVsZXRlIGFwcC5faWQ7XG4gICAgICBhcHAuc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIGFwcC5vd25lciA9IHVzZXJJZDtcbiAgICAgIGFwcC5pc19jcmVhdG9yID0gdHJ1ZTtcbiAgICAgIG5ld19pZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImFwcHNcIikuaW5zZXJ0KGFwcCk7XG4gICAgICByZXR1cm4gYXBwc19pZF9tYXBzW29sZF9pZF0gPSBuZXdfaWQ7XG4gICAgfSk7XG4gIH1cbiAgaWYgKF8uaXNBcnJheShpbXBfZGF0YS5vYmplY3RzKSAmJiBpbXBfZGF0YS5vYmplY3RzLmxlbmd0aCA+IDApIHtcbiAgICBfLmVhY2goaW1wX2RhdGEub2JqZWN0cywgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5pbXBvcnRPYmplY3QodXNlcklkLCBzcGFjZV9pZCwgb2JqZWN0LCBsaXN0X3ZpZXdzX2lkX21hcHMpO1xuICAgIH0pO1xuICB9XG4gIGlmIChfLmlzQXJyYXkoaW1wX2RhdGEubGlzdF92aWV3cykgJiYgaW1wX2RhdGEubGlzdF92aWV3cy5sZW5ndGggPiAwKSB7XG4gICAgXy5lYWNoKGltcF9kYXRhLmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGxpc3Rfdmlldykge1xuICAgICAgdmFyIF9saXN0X3ZpZXcsIG5ld19pZCwgb2xkX2lkO1xuICAgICAgb2xkX2lkID0gbGlzdF92aWV3Ll9pZDtcbiAgICAgIGRlbGV0ZSBsaXN0X3ZpZXcuX2lkO1xuICAgICAgbGlzdF92aWV3LnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICBsaXN0X3ZpZXcub3duZXIgPSB1c2VySWQ7XG4gICAgICBpZiAoQ3JlYXRvci5pc0FsbFZpZXcobGlzdF92aWV3KSB8fCBDcmVhdG9yLmlzUmVjZW50VmlldyhsaXN0X3ZpZXcpKSB7XG4gICAgICAgIF9saXN0X3ZpZXcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmRPbmUoe1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBsaXN0X3ZpZXcub2JqZWN0X25hbWUsXG4gICAgICAgICAgbmFtZTogbGlzdF92aWV3Lm5hbWUsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChfbGlzdF92aWV3KSB7XG4gICAgICAgICAgbmV3X2lkID0gX2xpc3Rfdmlldy5faWQ7XG4gICAgICAgIH1cbiAgICAgICAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS51cGRhdGUoe1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBsaXN0X3ZpZXcub2JqZWN0X25hbWUsXG4gICAgICAgICAgbmFtZTogbGlzdF92aWV3Lm5hbWUsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiBsaXN0X3ZpZXdcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdfaWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmluc2VydChsaXN0X3ZpZXcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxpc3Rfdmlld3NfaWRfbWFwc1tsaXN0X3ZpZXcub2JqZWN0X25hbWUgKyBcIl9cIiArIG9sZF9pZF0gPSBuZXdfaWQ7XG4gICAgfSk7XG4gIH1cbiAgaWYgKF8uaXNBcnJheShpbXBfZGF0YS5wZXJtaXNzaW9uX3NldCkgJiYgaW1wX2RhdGEucGVybWlzc2lvbl9zZXQubGVuZ3RoID4gMCkge1xuICAgIF8uZWFjaChpbXBfZGF0YS5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24ocGVybWlzc2lvbl9zZXQpIHtcbiAgICAgIHZhciBhc3NpZ25lZF9hcHBzLCBuZXdfaWQsIG9sZF9pZCwgcGVybWlzc2lvbl9zZXRfdXNlcnM7XG4gICAgICBvbGRfaWQgPSBwZXJtaXNzaW9uX3NldC5faWQ7XG4gICAgICBkZWxldGUgcGVybWlzc2lvbl9zZXQuX2lkO1xuICAgICAgcGVybWlzc2lvbl9zZXQuc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIHBlcm1pc3Npb25fc2V0Lm93bmVyID0gdXNlcklkO1xuICAgICAgcGVybWlzc2lvbl9zZXRfdXNlcnMgPSBbXTtcbiAgICAgIF8uZWFjaChwZXJtaXNzaW9uX3NldC51c2VycywgZnVuY3Rpb24odXNlcl9pZCkge1xuICAgICAgICB2YXIgc3BhY2VfdXNlcjtcbiAgICAgICAgc3BhY2VfdXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICB1c2VyOiB1c2VyX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChzcGFjZV91c2VyKSB7XG4gICAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25fc2V0X3VzZXJzLnB1c2godXNlcl9pZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzaWduZWRfYXBwcyA9IFtdO1xuICAgICAgXy5lYWNoKHBlcm1pc3Npb25fc2V0LmFzc2lnbmVkX2FwcHMsIGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgICAgICBpZiAoXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLkFwcHMpLCBhcHBfaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIGFzc2lnbmVkX2FwcHMucHVzaChhcHBfaWQpO1xuICAgICAgICB9IGVsc2UgaWYgKGFwcHNfaWRfbWFwc1thcHBfaWRdKSB7XG4gICAgICAgICAgcmV0dXJuIGFzc2lnbmVkX2FwcHMucHVzaChhcHBzX2lkX21hcHNbYXBwX2lkXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbmV3X2lkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuaW5zZXJ0KHBlcm1pc3Npb25fc2V0KTtcbiAgICAgIHJldHVybiBwZXJtaXNzaW9uX3NldF9pZF9tYXBzW29sZF9pZF0gPSBuZXdfaWQ7XG4gICAgfSk7XG4gIH1cbiAgaWYgKF8uaXNBcnJheShpbXBfZGF0YS5wZXJtaXNzaW9uX29iamVjdHMpICYmIGltcF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgXy5lYWNoKGltcF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cywgZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3QpIHtcbiAgICAgIHZhciBkaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgZGVsZXRlIHBlcm1pc3Npb25fb2JqZWN0Ll9pZDtcbiAgICAgIHBlcm1pc3Npb25fb2JqZWN0LnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICBwZXJtaXNzaW9uX29iamVjdC5vd25lciA9IHVzZXJJZDtcbiAgICAgIHBlcm1pc3Npb25fb2JqZWN0LnBlcm1pc3Npb25fc2V0X2lkID0gcGVybWlzc2lvbl9zZXRfaWRfbWFwc1twZXJtaXNzaW9uX29iamVjdC5wZXJtaXNzaW9uX3NldF9pZF07XG4gICAgICBkaXNhYmxlZF9saXN0X3ZpZXdzID0gW107XG4gICAgICBfLmVhY2gocGVybWlzc2lvbl9vYmplY3QuZGlzYWJsZWRfbGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3X2lkKSB7XG4gICAgICAgIHZhciBuZXdfdmlld19pZDtcbiAgICAgICAgbmV3X3ZpZXdfaWQgPSBsaXN0X3ZpZXdzX2lkX21hcHNbcGVybWlzc2lvbl9vYmplY3Qub2JqZWN0X25hbWUgKyBcIl9cIiArIGxpc3Rfdmlld19pZF07XG4gICAgICAgIGlmIChuZXdfdmlld19pZCkge1xuICAgICAgICAgIHJldHVybiBkaXNhYmxlZF9saXN0X3ZpZXdzLnB1c2gobmV3X3ZpZXdfaWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuaW5zZXJ0KHBlcm1pc3Npb25fb2JqZWN0KTtcbiAgICB9KTtcbiAgfVxuICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLnJlcG9ydHMpICYmIGltcF9kYXRhLnJlcG9ydHMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBfLmVhY2goaW1wX2RhdGEucmVwb3J0cywgZnVuY3Rpb24ocmVwb3J0KSB7XG4gICAgICBkZWxldGUgcmVwb3J0Ll9pZDtcbiAgICAgIHJlcG9ydC5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgcmVwb3J0Lm93bmVyID0gdXNlcklkO1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInJlcG9ydHNcIikuaW5zZXJ0KHJlcG9ydCk7XG4gICAgfSk7XG4gIH1cblxuICAvKuaVsOaNruaMgeS5heWMliDnu5PmnZ8gKi9cbn07XG5cblxuLyrnlLHkuo7kvb/nlKjmjqXlj6PmlrnlvI/kvJrlr7zoh7Rjb2xsZWN0aW9u55qEYWZ0ZXLjgIFiZWZvcmXkuK3ojrflj5bkuI3liLB1c2VySWTvvIzlho3mraTpl67popjmnKrop6PlhrPkuYvliY3vvIzov5jmmK/kvb/nlKhNZXRob2Rcbkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvY3JlYXRvci9hcHBfcGFja2FnZS9pbXBvcnQvOnNwYWNlX2lkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xuXHRcdHNwYWNlX2lkID0gcmVxLnBhcmFtcy5zcGFjZV9pZFxuXHRcdGltcF9kYXRhID0gcmVxLmJvZHlcblx0XHRpbXBvcnRfYXBwX3BhY2thZ2UodXNlcklkLCBzcGFjZV9pZCwgaW1wX2RhdGEpXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7fVxuXHRcdH1cblx0Y2F0Y2ggZVxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdGNvZGU6IGUuZXJyb3Jcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XG5cdFx0fVxuICovXG5cbk1ldGVvci5tZXRob2RzKHtcbiAgJ2ltcG9ydF9hcHBfcGFja2FnZSc6IGZ1bmN0aW9uKHNwYWNlX2lkLCBpbXBfZGF0YSkge1xuICAgIHZhciB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgcmV0dXJuIENyZWF0b3IuaW1wb3J0X2FwcF9wYWNrYWdlKHVzZXJJZCwgc3BhY2VfaWQsIGltcF9kYXRhKTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRcImNyZWF0b3IubGlzdHZpZXdzX29wdGlvbnNcIjogKG9wdGlvbnMpLT5cblx0XHRpZiBvcHRpb25zPy5wYXJhbXM/LnJlZmVyZW5jZV90b1xuXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvcHRpb25zLnBhcmFtcy5yZWZlcmVuY2VfdG8pXG5cblx0XHRcdG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZXG5cblx0XHRcdHF1ZXJ5ID0ge31cblx0XHRcdGlmIG9wdGlvbnMucGFyYW1zLnNwYWNlXG5cdFx0XHRcdHF1ZXJ5LnNwYWNlID0gb3B0aW9ucy5wYXJhbXMuc3BhY2VcblxuXHRcdFx0XHRzb3J0ID0gb3B0aW9ucz8uc29ydFxuXG5cdFx0XHRcdHNlbGVjdGVkID0gb3B0aW9ucz8uc2VsZWN0ZWQgfHwgW11cblxuXHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRzZWFyY2hUZXh0UXVlcnkgPSB7fVxuXHRcdFx0XHRcdHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7JHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHR9XG5cblx0XHRcdFx0aWYgb3B0aW9ucz8udmFsdWVzPy5sZW5ndGhcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRcdHF1ZXJ5LiRvciA9IFt7X2lkOiB7JGluOiBvcHRpb25zLnZhbHVlc319LCBzZWFyY2hUZXh0UXVlcnksIHtvYmplY3RfbmFtZTogeyRyZWdleDogb3B0aW9ucy5zZWFyY2hUZXh0fX1dXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cXVlcnkuJG9yID0gW3tfaWQ6IHskaW46IG9wdGlvbnMudmFsdWVzfX1dXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRcdF8uZXh0ZW5kKHF1ZXJ5LCB7JG9yOiBbc2VhcmNoVGV4dFF1ZXJ5LCAge29iamVjdF9uYW1lOiB7JHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHR9fV19KVxuXHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHskbmluOiBzZWxlY3RlZH1cblxuXHRcdFx0XHRjb2xsZWN0aW9uID0gb2JqZWN0LmRiXG5cblx0XHRcdFx0aWYgb3B0aW9ucy5maWx0ZXJRdWVyeVxuXHRcdFx0XHRcdF8uZXh0ZW5kIHF1ZXJ5LCBvcHRpb25zLmZpbHRlclF1ZXJ5XG5cblx0XHRcdFx0cXVlcnlfb3B0aW9ucyA9IHtsaW1pdDogMTB9XG5cblx0XHRcdFx0aWYgc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpXG5cdFx0XHRcdFx0cXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydFxuXG5cdFx0XHRcdGlmIGNvbGxlY3Rpb25cblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdHJlY29yZHMgPSBjb2xsZWN0aW9uLmZpbmQocXVlcnksIHF1ZXJ5X29wdGlvbnMpLmZldGNoKClcblx0XHRcdFx0XHRcdHJlc3VsdHMgPSBbXVxuXHRcdFx0XHRcdFx0Xy5lYWNoIHJlY29yZHMsIChyZWNvcmQpLT5cblx0XHRcdFx0XHRcdFx0b2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldE9iamVjdChyZWNvcmQub2JqZWN0X25hbWUpPy5uYW1lIHx8IFwiXCJcblx0XHRcdFx0XHRcdFx0aWYgIV8uaXNFbXB0eShvYmplY3RfbmFtZSlcblx0XHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZSA9IFwiICgje29iamVjdF9uYW1lfSlcIlxuXG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaFxuXHRcdFx0XHRcdFx0XHRcdGxhYmVsOiByZWNvcmRbbmFtZV9maWVsZF9rZXldICsgb2JqZWN0X25hbWVcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogcmVjb3JkLl9pZFxuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHNcblx0XHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgZS5tZXNzYWdlICsgXCItLT5cIiArIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpXG5cdFx0cmV0dXJuIFtdICIsIk1ldGVvci5tZXRob2RzKHtcbiAgXCJjcmVhdG9yLmxpc3R2aWV3c19vcHRpb25zXCI6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZSwgbmFtZV9maWVsZF9rZXksIG9iamVjdCwgcXVlcnksIHF1ZXJ5X29wdGlvbnMsIHJlY29yZHMsIHJlZiwgcmVmMSwgcmVzdWx0cywgc2VhcmNoVGV4dFF1ZXJ5LCBzZWxlY3RlZCwgc29ydDtcbiAgICBpZiAob3B0aW9ucyAhPSBudWxsID8gKHJlZiA9IG9wdGlvbnMucGFyYW1zKSAhPSBudWxsID8gcmVmLnJlZmVyZW5jZV90byA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob3B0aW9ucy5wYXJhbXMucmVmZXJlbmNlX3RvKTtcbiAgICAgIG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICAgICAgcXVlcnkgPSB7fTtcbiAgICAgIGlmIChvcHRpb25zLnBhcmFtcy5zcGFjZSkge1xuICAgICAgICBxdWVyeS5zcGFjZSA9IG9wdGlvbnMucGFyYW1zLnNwYWNlO1xuICAgICAgICBzb3J0ID0gb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zb3J0IDogdm9pZCAwO1xuICAgICAgICBzZWxlY3RlZCA9IChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNlbGVjdGVkIDogdm9pZCAwKSB8fCBbXTtcbiAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7XG4gICAgICAgICAgICAkcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYxID0gb3B0aW9ucy52YWx1ZXMpICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIHF1ZXJ5LiRvciA9IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgJGluOiBvcHRpb25zLnZhbHVlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSwgc2VhcmNoVGV4dFF1ZXJ5LCB7XG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IHtcbiAgICAgICAgICAgICAgICAgICRyZWdleDogb3B0aW9ucy5zZWFyY2hUZXh0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKHF1ZXJ5LCB7XG4gICAgICAgICAgICAgICRvcjogW1xuICAgICAgICAgICAgICAgIHNlYXJjaFRleHRRdWVyeSwge1xuICAgICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IHtcbiAgICAgICAgICAgICAgICAgICAgJHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHRcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxdWVyeS5faWQgPSB7XG4gICAgICAgICAgICAkbmluOiBzZWxlY3RlZFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY29sbGVjdGlvbiA9IG9iamVjdC5kYjtcbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsdGVyUXVlcnkpIHtcbiAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeSk7XG4gICAgICAgIH1cbiAgICAgICAgcXVlcnlfb3B0aW9ucyA9IHtcbiAgICAgICAgICBsaW1pdDogMTBcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHNvcnQgJiYgXy5pc09iamVjdChzb3J0KSkge1xuICAgICAgICAgIHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVjb3JkcyA9IGNvbGxlY3Rpb24uZmluZChxdWVyeSwgcXVlcnlfb3B0aW9ucykuZmV0Y2goKTtcbiAgICAgICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgIF8uZWFjaChyZWNvcmRzLCBmdW5jdGlvbihyZWNvcmQpIHtcbiAgICAgICAgICAgICAgdmFyIG9iamVjdF9uYW1lLCByZWYyO1xuICAgICAgICAgICAgICBvYmplY3RfbmFtZSA9ICgocmVmMiA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlY29yZC5vYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYyLm5hbWUgOiB2b2lkIDApIHx8IFwiXCI7XG4gICAgICAgICAgICAgIGlmICghXy5pc0VtcHR5KG9iamVjdF9uYW1lKSkge1xuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lID0gXCIgKFwiICsgb2JqZWN0X25hbWUgKyBcIilcIjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBsYWJlbDogcmVjb3JkW25hbWVfZmllbGRfa2V5XSArIG9iamVjdF9uYW1lLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuX2lkXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIGUubWVzc2FnZSArIFwiLS0+XCIgKyBKU09OLnN0cmluZ2lmeShvcHRpb25zKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxufSk7XG4iLCIj6I635Y+W5bqU55So5LiL55qE5a+56LGhXG5nZXRBcHBPYmplY3RzID0gKGFwcCktPlxuXHRhcHBPYmplY3RzID0gW11cblx0aWYgYXBwICYmIF8uaXNBcnJheShhcHAub2JqZWN0cykgJiYgYXBwLm9iamVjdHMubGVuZ3RoID4gMFxuXHRcdF8uZWFjaCBhcHAub2JqZWN0cywgKG9iamVjdF9uYW1lKS0+XG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRcdGlmIG9iamVjdFxuXHRcdFx0XHRhcHBPYmplY3RzLnB1c2ggb2JqZWN0X25hbWVcblx0cmV0dXJuIGFwcE9iamVjdHNcblxuI+iOt+WPluWvueixoeS4i+eahOWIl+ihqOinhuWbvlxuZ2V0T2JqZWN0c0xpc3RWaWV3cyA9IChzcGFjZV9pZCwgb2JqZWN0c19uYW1lKS0+XG5cdG9iamVjdHNMaXN0Vmlld3MgPSBbXVxuXHRpZiBvYmplY3RzX25hbWUgJiYgXy5pc0FycmF5KG9iamVjdHNfbmFtZSkgJiYgb2JqZWN0c19uYW1lLmxlbmd0aCA+IDBcblx0XHRfLmVhY2ggb2JqZWN0c19uYW1lLCAob2JqZWN0X25hbWUpLT5cblx0XHRcdCPojrflj5blr7nosaHnmoTlhbHkuqvliJfooajop4blm75saXN0X3ZpZXdzXG5cdFx0XHRsaXN0X3ZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNwYWNlOiBzcGFjZV9pZCwgc2hhcmVkOiB0cnVlfSwge2ZpZWxkczoge19pZDogMX19KVxuXHRcdFx0bGlzdF92aWV3cy5mb3JFYWNoIChsaXN0X3ZpZXcpLT5cblx0XHRcdFx0b2JqZWN0c0xpc3RWaWV3cy5wdXNoIGxpc3Rfdmlldy5faWRcblx0cmV0dXJuIG9iamVjdHNMaXN0Vmlld3NcblxuI+iOt+WPluWvueixoeS4i+eahOaKpeihqFxuZ2V0T2JqZWN0c1JlcG9ydHMgPSAoc3BhY2VfaWQsIG9iamVjdHNfbmFtZSktPlxuXHRvYmplY3RzUmVwb3J0cyA9IFtdXG5cdGlmIG9iamVjdHNfbmFtZSAmJiBfLmlzQXJyYXkob2JqZWN0c19uYW1lKSAmJiBvYmplY3RzX25hbWUubGVuZ3RoID4gMFxuXHRcdF8uZWFjaCBvYmplY3RzX25hbWUsIChvYmplY3RfbmFtZSktPlxuXHRcdFx0I+iOt+WPluWvueixoeeahOaKpeihqHJlcG9ydHNcblx0XHRcdHJlcG9ydHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJyZXBvcnRzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc3BhY2U6IHNwYWNlX2lkfSwge2ZpZWxkczoge19pZDogMX19KVxuXHRcdFx0cmVwb3J0cy5mb3JFYWNoIChyZXBvcnQpLT5cblx0XHRcdFx0b2JqZWN0c1JlcG9ydHMucHVzaCByZXBvcnQuX2lkXG5cdHJldHVybiBvYmplY3RzUmVwb3J0c1xuXG4j6I635Y+W5a+56LGh5LiL55qE5p2D6ZmQ6ZuGXG5nZXRPYmplY3RzUGVybWlzc2lvbk9iamVjdHMgPSAoc3BhY2VfaWQsIG9iamVjdHNfbmFtZSktPlxuXHRvYmplY3RzUGVybWlzc2lvbk9iamVjdHMgPSBbXVxuXHRpZiBvYmplY3RzX25hbWUgJiYgXy5pc0FycmF5KG9iamVjdHNfbmFtZSkgJiYgb2JqZWN0c19uYW1lLmxlbmd0aCA+IDBcblx0XHRfLmVhY2ggb2JqZWN0c19uYW1lLCAob2JqZWN0X25hbWUpLT5cblx0XHRcdHBlcm1pc3Npb25fb2JqZWN0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNwYWNlOiBzcGFjZV9pZH0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcblx0XHRcdHBlcm1pc3Npb25fb2JqZWN0cy5mb3JFYWNoIChwZXJtaXNzaW9uX29iamVjdCktPlxuXHRcdFx0XHRvYmplY3RzUGVybWlzc2lvbk9iamVjdHMucHVzaCBwZXJtaXNzaW9uX29iamVjdC5faWRcblx0cmV0dXJuIG9iamVjdHNQZXJtaXNzaW9uT2JqZWN0c1xuXG4j6I635Y+W5a+56LGh5LiL5p2D6ZmQ6ZuG5a+55bqU55qE5p2D6ZmQ6ZuGXG5nZXRPYmplY3RzUGVybWlzc2lvblNldCA9IChzcGFjZV9pZCwgb2JqZWN0c19uYW1lKS0+XG5cdG9iamVjdHNQZXJtaXNzaW9uU2V0ID0gW11cblx0aWYgb2JqZWN0c19uYW1lICYmIF8uaXNBcnJheShvYmplY3RzX25hbWUpICYmIG9iamVjdHNfbmFtZS5sZW5ndGggPiAwXG5cdFx0Xy5lYWNoIG9iamVjdHNfbmFtZSwgKG9iamVjdF9uYW1lKS0+XG5cdFx0XHRwZXJtaXNzaW9uX29iamVjdHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBzcGFjZTogc3BhY2VfaWR9LCB7ZmllbGRzOiB7cGVybWlzc2lvbl9zZXRfaWQ6IDF9fSlcblx0XHRcdHBlcm1pc3Npb25fb2JqZWN0cy5mb3JFYWNoIChwZXJtaXNzaW9uX29iamVjdCktPlxuXHRcdFx0XHRwZXJtaXNzaW9uX3NldCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe19pZDogcGVybWlzc2lvbl9vYmplY3QucGVybWlzc2lvbl9zZXRfaWR9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXG5cdFx0XHRcdG9iamVjdHNQZXJtaXNzaW9uU2V0LnB1c2ggcGVybWlzc2lvbl9zZXQuX2lkXG5cdHJldHVybiBvYmplY3RzUGVybWlzc2lvblNldFxuXG5cbk1ldGVvci5tZXRob2RzXG5cdFwiYXBwUGFja2FnZS5pbml0X2V4cG9ydF9kYXRhXCI6IChzcGFjZV9pZCwgcmVjb3JkX2lkKS0+XG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNDAxXCIsIFwiQXV0aGVudGljYXRpb24gaXMgcmVxdWlyZWQgYW5kIGhhcyBub3QgYmVlbiBwcm92aWRlZC5cIilcblxuXHRcdGlmICFDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgdXNlcklkKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjQwMVwiLCBcIlBlcm1pc3Npb24gZGVuaWVkLlwiKVxuXG5cdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwbGljYXRpb25fcGFja2FnZVwiKS5maW5kT25lKHtfaWQ6IHJlY29yZF9pZH0pXG5cblx0XHRpZiAoIV8uaXNBcnJheShyZWNvcmQ/LmFwcHMpIHx8IHJlY29yZD8uYXBwcz8ubGVuZ3RoIDwgMSkgJiYgKCFfLmlzQXJyYXkocmVjb3JkPy5vYmplY3RzKSB8fCByZWNvcmQ/Lm9iamVjdHM/Lmxlbmd0aCA8IDEpXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi6K+35YWI6YCJ5oup5bqU55So5oiW6ICF5a+56LGhXCIpXG5cblx0XHRkYXRhID0ge31cblx0XHRfb2JqZWN0cyA9IHJlY29yZC5vYmplY3RzIHx8IFtdXG5cdFx0X29iamVjdHNfbGlzdF92aWV3cyA9IHJlY29yZC5saXN0X3ZpZXdzIHx8IFtdXG5cdFx0X29iamVjdHNfcmVwb3J0cyA9IHJlY29yZC5yZXBvcnRzIHx8IFtdXG5cdFx0X29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzID0gcmVjb3JkLnBlcm1pc3Npb25fb2JqZWN0cyB8fCBbXVxuXHRcdF9vYmplY3RzX3Blcm1pc3Npb25fc2V0ID0gcmVjb3JkLnBlcm1pc3Npb25fc2V0IHx8IFtdXG5cblx0XHR0cnlcblx0XHRcdGlmIF8uaXNBcnJheShyZWNvcmQ/LmFwcHMpICYmIHJlY29yZC5hcHBzLmxlbmd0aCA+IDBcblx0XHRcdFx0Xy5lYWNoIHJlY29yZC5hcHBzLCAoYXBwSWQpLT5cblx0XHRcdFx0XHRpZiAhYXBwXG5cdFx0XHRcdFx0XHQj5aaC5p6c5LuO5Luj56CB5Lit5a6a5LmJ55qEYXBwc+S4reayoeacieaJvuWIsO+8jOWImeS7juaVsOaNruW6k+S4reiOt+WPllxuXHRcdFx0XHRcdFx0YXBwID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwc1wiKS5maW5kT25lKHtfaWQ6IGFwcElkLCBpc19jcmVhdG9yOiB0cnVlfSwge2ZpZWxkczoge29iamVjdHM6IDF9fSlcblx0XHRcdFx0XHRfb2JqZWN0cyA9IF9vYmplY3RzLmNvbmNhdChnZXRBcHBPYmplY3RzKGFwcCkpXG5cblx0XHRcdGlmIF8uaXNBcnJheShfb2JqZWN0cykgJiYgX29iamVjdHMubGVuZ3RoID4gMFxuXHRcdFx0XHRfb2JqZWN0c19saXN0X3ZpZXdzID0gX29iamVjdHNfbGlzdF92aWV3cy5jb25jYXQoZ2V0T2JqZWN0c0xpc3RWaWV3cyhzcGFjZV9pZCwgX29iamVjdHMpKVxuXHRcdFx0XHRfb2JqZWN0c19yZXBvcnRzID0gX29iamVjdHNfcmVwb3J0cy5jb25jYXQoZ2V0T2JqZWN0c1JlcG9ydHMoc3BhY2VfaWQsIF9vYmplY3RzKSlcblx0XHRcdFx0X29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzID0gX29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzLmNvbmNhdChnZXRPYmplY3RzUGVybWlzc2lvbk9iamVjdHMoc3BhY2VfaWQsIF9vYmplY3RzKSlcblx0XHRcdFx0X29iamVjdHNfcGVybWlzc2lvbl9zZXQgPSBfb2JqZWN0c19wZXJtaXNzaW9uX3NldC5jb25jYXQoZ2V0T2JqZWN0c1Blcm1pc3Npb25TZXQoc3BhY2VfaWQsIF9vYmplY3RzKSlcblxuXHRcdFx0XHRkYXRhLm9iamVjdHMgPSBfLnVuaXEgX29iamVjdHNcblx0XHRcdFx0ZGF0YS5saXN0X3ZpZXdzID0gXy51bmlxIF9vYmplY3RzX2xpc3Rfdmlld3Ncblx0XHRcdFx0ZGF0YS5wZXJtaXNzaW9uX3NldCA9IF8udW5pcSBfb2JqZWN0c19wZXJtaXNzaW9uX3NldFxuXHRcdFx0XHRkYXRhLnBlcm1pc3Npb25fb2JqZWN0cyA9IF8udW5pcSBfb2JqZWN0c19wZXJtaXNzaW9uX29iamVjdHNcblx0XHRcdFx0ZGF0YS5yZXBvcnRzID0gXy51bmlxIF9vYmplY3RzX3JlcG9ydHNcblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwbGljYXRpb25fcGFja2FnZVwiKS51cGRhdGUoe19pZDogcmVjb3JkLl9pZH0seyRzZXQ6IGRhdGF9KVxuXHRcdGNhdGNoIGVcblx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgKSIsInZhciBnZXRBcHBPYmplY3RzLCBnZXRPYmplY3RzTGlzdFZpZXdzLCBnZXRPYmplY3RzUGVybWlzc2lvbk9iamVjdHMsIGdldE9iamVjdHNQZXJtaXNzaW9uU2V0LCBnZXRPYmplY3RzUmVwb3J0cztcblxuZ2V0QXBwT2JqZWN0cyA9IGZ1bmN0aW9uKGFwcCkge1xuICB2YXIgYXBwT2JqZWN0cztcbiAgYXBwT2JqZWN0cyA9IFtdO1xuICBpZiAoYXBwICYmIF8uaXNBcnJheShhcHAub2JqZWN0cykgJiYgYXBwLm9iamVjdHMubGVuZ3RoID4gMCkge1xuICAgIF8uZWFjaChhcHAub2JqZWN0cywgZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICAgIHZhciBvYmplY3Q7XG4gICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBhcHBPYmplY3RzLnB1c2gob2JqZWN0X25hbWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBhcHBPYmplY3RzO1xufTtcblxuZ2V0T2JqZWN0c0xpc3RWaWV3cyA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBvYmplY3RzX25hbWUpIHtcbiAgdmFyIG9iamVjdHNMaXN0Vmlld3M7XG4gIG9iamVjdHNMaXN0Vmlld3MgPSBbXTtcbiAgaWYgKG9iamVjdHNfbmFtZSAmJiBfLmlzQXJyYXkob2JqZWN0c19uYW1lKSAmJiBvYmplY3RzX25hbWUubGVuZ3RoID4gMCkge1xuICAgIF8uZWFjaChvYmplY3RzX25hbWUsIGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgICB2YXIgbGlzdF92aWV3cztcbiAgICAgIGxpc3Rfdmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgc2hhcmVkOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBsaXN0X3ZpZXdzLmZvckVhY2goZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gICAgICAgIHJldHVybiBvYmplY3RzTGlzdFZpZXdzLnB1c2gobGlzdF92aWV3Ll9pZCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb2JqZWN0c0xpc3RWaWV3cztcbn07XG5cbmdldE9iamVjdHNSZXBvcnRzID0gZnVuY3Rpb24oc3BhY2VfaWQsIG9iamVjdHNfbmFtZSkge1xuICB2YXIgb2JqZWN0c1JlcG9ydHM7XG4gIG9iamVjdHNSZXBvcnRzID0gW107XG4gIGlmIChvYmplY3RzX25hbWUgJiYgXy5pc0FycmF5KG9iamVjdHNfbmFtZSkgJiYgb2JqZWN0c19uYW1lLmxlbmd0aCA+IDApIHtcbiAgICBfLmVhY2gob2JqZWN0c19uYW1lLCBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgICAgdmFyIHJlcG9ydHM7XG4gICAgICByZXBvcnRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicmVwb3J0c1wiKS5maW5kKHtcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcG9ydHMuZm9yRWFjaChmdW5jdGlvbihyZXBvcnQpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdHNSZXBvcnRzLnB1c2gocmVwb3J0Ll9pZCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb2JqZWN0c1JlcG9ydHM7XG59O1xuXG5nZXRPYmplY3RzUGVybWlzc2lvbk9iamVjdHMgPSBmdW5jdGlvbihzcGFjZV9pZCwgb2JqZWN0c19uYW1lKSB7XG4gIHZhciBvYmplY3RzUGVybWlzc2lvbk9iamVjdHM7XG4gIG9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cyA9IFtdO1xuICBpZiAob2JqZWN0c19uYW1lICYmIF8uaXNBcnJheShvYmplY3RzX25hbWUpICYmIG9iamVjdHNfbmFtZS5sZW5ndGggPiAwKSB7XG4gICAgXy5lYWNoKG9iamVjdHNfbmFtZSwgZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICAgIHZhciBwZXJtaXNzaW9uX29iamVjdHM7XG4gICAgICBwZXJtaXNzaW9uX29iamVjdHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwZXJtaXNzaW9uX29iamVjdHMuZm9yRWFjaChmdW5jdGlvbihwZXJtaXNzaW9uX29iamVjdCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0c1Blcm1pc3Npb25PYmplY3RzLnB1c2gocGVybWlzc2lvbl9vYmplY3QuX2lkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3RzUGVybWlzc2lvbk9iamVjdHM7XG59O1xuXG5nZXRPYmplY3RzUGVybWlzc2lvblNldCA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBvYmplY3RzX25hbWUpIHtcbiAgdmFyIG9iamVjdHNQZXJtaXNzaW9uU2V0O1xuICBvYmplY3RzUGVybWlzc2lvblNldCA9IFtdO1xuICBpZiAob2JqZWN0c19uYW1lICYmIF8uaXNBcnJheShvYmplY3RzX25hbWUpICYmIG9iamVjdHNfbmFtZS5sZW5ndGggPiAwKSB7XG4gICAgXy5lYWNoKG9iamVjdHNfbmFtZSwgZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICAgIHZhciBwZXJtaXNzaW9uX29iamVjdHM7XG4gICAgICBwZXJtaXNzaW9uX29iamVjdHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHBlcm1pc3Npb25fb2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0KSB7XG4gICAgICAgIHZhciBwZXJtaXNzaW9uX3NldDtcbiAgICAgICAgcGVybWlzc2lvbl9zZXQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgICAgICBfaWQ6IHBlcm1pc3Npb25fb2JqZWN0LnBlcm1pc3Npb25fc2V0X2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvYmplY3RzUGVybWlzc2lvblNldC5wdXNoKHBlcm1pc3Npb25fc2V0Ll9pZCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb2JqZWN0c1Blcm1pc3Npb25TZXQ7XG59O1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gIFwiYXBwUGFja2FnZS5pbml0X2V4cG9ydF9kYXRhXCI6IGZ1bmN0aW9uKHNwYWNlX2lkLCByZWNvcmRfaWQpIHtcbiAgICB2YXIgX29iamVjdHMsIF9vYmplY3RzX2xpc3Rfdmlld3MsIF9vYmplY3RzX3Blcm1pc3Npb25fb2JqZWN0cywgX29iamVjdHNfcGVybWlzc2lvbl9zZXQsIF9vYmplY3RzX3JlcG9ydHMsIGRhdGEsIGUsIHJlY29yZCwgcmVmLCByZWYxLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI0MDFcIiwgXCJBdXRoZW50aWNhdGlvbiBpcyByZXF1aXJlZCBhbmQgaGFzIG5vdCBiZWVuIHByb3ZpZGVkLlwiKTtcbiAgICB9XG4gICAgaWYgKCFDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgdXNlcklkKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjQwMVwiLCBcIlBlcm1pc3Npb24gZGVuaWVkLlwiKTtcbiAgICB9XG4gICAgcmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwbGljYXRpb25fcGFja2FnZVwiKS5maW5kT25lKHtcbiAgICAgIF9pZDogcmVjb3JkX2lkXG4gICAgfSk7XG4gICAgaWYgKCghXy5pc0FycmF5KHJlY29yZCAhPSBudWxsID8gcmVjb3JkLmFwcHMgOiB2b2lkIDApIHx8IChyZWNvcmQgIT0gbnVsbCA/IChyZWYgPSByZWNvcmQuYXBwcykgIT0gbnVsbCA/IHJlZi5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIDwgMSkgJiYgKCFfLmlzQXJyYXkocmVjb3JkICE9IG51bGwgPyByZWNvcmQub2JqZWN0cyA6IHZvaWQgMCkgfHwgKHJlY29yZCAhPSBudWxsID8gKHJlZjEgPSByZWNvcmQub2JqZWN0cykgIT0gbnVsbCA/IHJlZjEubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSA8IDEpKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi6K+35YWI6YCJ5oup5bqU55So5oiW6ICF5a+56LGhXCIpO1xuICAgIH1cbiAgICBkYXRhID0ge307XG4gICAgX29iamVjdHMgPSByZWNvcmQub2JqZWN0cyB8fCBbXTtcbiAgICBfb2JqZWN0c19saXN0X3ZpZXdzID0gcmVjb3JkLmxpc3Rfdmlld3MgfHwgW107XG4gICAgX29iamVjdHNfcmVwb3J0cyA9IHJlY29yZC5yZXBvcnRzIHx8IFtdO1xuICAgIF9vYmplY3RzX3Blcm1pc3Npb25fb2JqZWN0cyA9IHJlY29yZC5wZXJtaXNzaW9uX29iamVjdHMgfHwgW107XG4gICAgX29iamVjdHNfcGVybWlzc2lvbl9zZXQgPSByZWNvcmQucGVybWlzc2lvbl9zZXQgfHwgW107XG4gICAgdHJ5IHtcbiAgICAgIGlmIChfLmlzQXJyYXkocmVjb3JkICE9IG51bGwgPyByZWNvcmQuYXBwcyA6IHZvaWQgMCkgJiYgcmVjb3JkLmFwcHMubGVuZ3RoID4gMCkge1xuICAgICAgICBfLmVhY2gocmVjb3JkLmFwcHMsIGZ1bmN0aW9uKGFwcElkKSB7XG4gICAgICAgICAgdmFyIGFwcDtcbiAgICAgICAgICBpZiAoIWFwcCkge1xuICAgICAgICAgICAgYXBwID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwc1wiKS5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiBhcHBJZCxcbiAgICAgICAgICAgICAgaXNfY3JlYXRvcjogdHJ1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBvYmplY3RzOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX29iamVjdHMgPSBfb2JqZWN0cy5jb25jYXQoZ2V0QXBwT2JqZWN0cyhhcHApKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoXy5pc0FycmF5KF9vYmplY3RzKSAmJiBfb2JqZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIF9vYmplY3RzX2xpc3Rfdmlld3MgPSBfb2JqZWN0c19saXN0X3ZpZXdzLmNvbmNhdChnZXRPYmplY3RzTGlzdFZpZXdzKHNwYWNlX2lkLCBfb2JqZWN0cykpO1xuICAgICAgICBfb2JqZWN0c19yZXBvcnRzID0gX29iamVjdHNfcmVwb3J0cy5jb25jYXQoZ2V0T2JqZWN0c1JlcG9ydHMoc3BhY2VfaWQsIF9vYmplY3RzKSk7XG4gICAgICAgIF9vYmplY3RzX3Blcm1pc3Npb25fb2JqZWN0cyA9IF9vYmplY3RzX3Blcm1pc3Npb25fb2JqZWN0cy5jb25jYXQoZ2V0T2JqZWN0c1Blcm1pc3Npb25PYmplY3RzKHNwYWNlX2lkLCBfb2JqZWN0cykpO1xuICAgICAgICBfb2JqZWN0c19wZXJtaXNzaW9uX3NldCA9IF9vYmplY3RzX3Blcm1pc3Npb25fc2V0LmNvbmNhdChnZXRPYmplY3RzUGVybWlzc2lvblNldChzcGFjZV9pZCwgX29iamVjdHMpKTtcbiAgICAgICAgZGF0YS5vYmplY3RzID0gXy51bmlxKF9vYmplY3RzKTtcbiAgICAgICAgZGF0YS5saXN0X3ZpZXdzID0gXy51bmlxKF9vYmplY3RzX2xpc3Rfdmlld3MpO1xuICAgICAgICBkYXRhLnBlcm1pc3Npb25fc2V0ID0gXy51bmlxKF9vYmplY3RzX3Blcm1pc3Npb25fc2V0KTtcbiAgICAgICAgZGF0YS5wZXJtaXNzaW9uX29iamVjdHMgPSBfLnVuaXEoX29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzKTtcbiAgICAgICAgZGF0YS5yZXBvcnRzID0gXy51bmlxKF9vYmplY3RzX3JlcG9ydHMpO1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwbGljYXRpb25fcGFja2FnZVwiKS51cGRhdGUoe1xuICAgICAgICAgIF9pZDogcmVjb3JkLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDogZGF0YVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgZS5yZWFzb24gfHwgZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiQEFQVHJhbnNmb3JtID0ge31cblxuaWdub3JlX2ZpZWxkcyA9IHtcblx0b3duZXI6IDAsXG5cdHNwYWNlOiAwLFxuXHRjcmVhdGVkOiAwLFxuXHRjcmVhdGVkX2J5OiAwLFxuXHRtb2RpZmllZDogMCxcblx0bW9kaWZpZWRfYnk6IDAsXG5cdGlzX2RlbGV0ZWQ6IDAsXG5cdGluc3RhbmNlczogMCxcblx0c2hhcmluZzogMFxufVxuXG5BUFRyYW5zZm9ybS5leHBvcnRPYmplY3QgPSAob2JqZWN0KS0+XG5cdF9vYmogPSB7fVxuXG5cdF8uZXh0ZW5kKF9vYmogLCBvYmplY3QpXG5cblx0b2JqX2xpc3Rfdmlld3MgPSB7fVxuXG5cdF8uZXh0ZW5kKG9ial9saXN0X3ZpZXdzLCBfb2JqLmxpc3Rfdmlld3MgfHwge30pXG5cblx0Xy5lYWNoIG9ial9saXN0X3ZpZXdzLCAodiwgayktPlxuXHRcdGlmICFfLmhhcyh2LCBcIl9pZFwiKVxuXHRcdFx0di5faWQgPSBrXG5cdFx0aWYgIV8uaGFzKHYsIFwibmFtZVwiKVxuXHRcdFx0di5uYW1lID0ga1xuXHRfb2JqLmxpc3Rfdmlld3MgPSBvYmpfbGlzdF92aWV3c1xuXG5cblx0I+WPquS/ruaUuV9vYmrlsZ7mgKfljp9vYmplY3TlsZ7mgKfkv53mjIHkuI3lj5hcblx0dHJpZ2dlcnMgPSB7fVxuXHRfLmZvckVhY2ggX29iai50cmlnZ2VycywgKHRyaWdnZXIsIGtleSktPlxuXHRcdF90cmlnZ2VyID0ge31cblx0XHRfLmV4dGVuZChfdHJpZ2dlciwgdHJpZ2dlcilcblx0XHRpZiBfLmlzRnVuY3Rpb24oX3RyaWdnZXIudG9kbylcblx0XHRcdF90cmlnZ2VyLnRvZG8gPSBfdHJpZ2dlci50b2RvLnRvU3RyaW5nKClcblx0XHRkZWxldGUgX3RyaWdnZXIuX3RvZG9cblx0XHR0cmlnZ2Vyc1trZXldID0gX3RyaWdnZXJcblx0X29iai50cmlnZ2VycyA9IHRyaWdnZXJzXG5cblx0YWN0aW9ucyA9IHt9XG5cdF8uZm9yRWFjaCBfb2JqLmFjdGlvbnMsIChhY3Rpb24sIGtleSktPlxuXHRcdF9hY3Rpb24gPSB7fVxuXHRcdF8uZXh0ZW5kKF9hY3Rpb24sIGFjdGlvbilcblx0XHRpZiBfLmlzRnVuY3Rpb24oX2FjdGlvbi50b2RvKVxuXHRcdFx0X2FjdGlvbi50b2RvID0gX2FjdGlvbi50b2RvLnRvU3RyaW5nKClcblx0XHRkZWxldGUgX2FjdGlvbi5fdG9kb1xuXHRcdGFjdGlvbnNba2V5XSA9IF9hY3Rpb25cblxuXHRfb2JqLmFjdGlvbnMgPSBhY3Rpb25zXG5cblx0ZmllbGRzID0ge31cblx0Xy5mb3JFYWNoIF9vYmouZmllbGRzLCAoZmllbGQsIGtleSktPlxuXHRcdF9maWVsZCA9IHt9XG5cdFx0Xy5leHRlbmQoX2ZpZWxkLCBmaWVsZClcblx0XHRpZiBfLmlzRnVuY3Rpb24oX2ZpZWxkLm9wdGlvbnMpXG5cdFx0XHRfZmllbGQub3B0aW9ucyA9IF9maWVsZC5vcHRpb25zLnRvU3RyaW5nKClcblx0XHRcdGRlbGV0ZSBfZmllbGQuX29wdGlvbnNcblxuXHRcdGlmIF8uaXNBcnJheShfZmllbGQub3B0aW9ucylcblx0XHRcdF9mbyA9IFtdXG5cdFx0XHRfLmZvckVhY2ggX2ZpZWxkLm9wdGlvbnMsIChfbzEpLT5cblx0XHRcdFx0X2ZvLnB1c2goXCIje19vMS5sYWJlbH06I3tfbzEudmFsdWV9XCIpXG5cdFx0XHRfZmllbGQub3B0aW9ucyA9IF9mby5qb2luKFwiLFwiKVxuXHRcdFx0ZGVsZXRlIF9maWVsZC5fb3B0aW9uc1xuXG5cdFx0aWYgX2ZpZWxkLnJlZ0V4XG5cdFx0XHRfZmllbGQucmVnRXggPSBfZmllbGQucmVnRXgudG9TdHJpbmcoKVxuXHRcdFx0ZGVsZXRlIF9maWVsZC5fcmVnRXhcblxuXHRcdGlmIF8uaXNGdW5jdGlvbihfZmllbGQub3B0aW9uc0Z1bmN0aW9uKVxuXHRcdFx0X2ZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IF9maWVsZC5vcHRpb25zRnVuY3Rpb24udG9TdHJpbmcoKVxuXHRcdFx0ZGVsZXRlIF9maWVsZC5fb3B0aW9uc0Z1bmN0aW9uXG5cblx0XHRpZiBfLmlzRnVuY3Rpb24oX2ZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdF9maWVsZC5yZWZlcmVuY2VfdG8gPSBfZmllbGQucmVmZXJlbmNlX3RvLnRvU3RyaW5nKClcblx0XHRcdGRlbGV0ZSBfZmllbGQuX3JlZmVyZW5jZV90b1xuXG5cdFx0aWYgXy5pc0Z1bmN0aW9uKF9maWVsZC5jcmVhdGVGdW5jdGlvbilcblx0XHRcdF9maWVsZC5jcmVhdGVGdW5jdGlvbiA9IF9maWVsZC5jcmVhdGVGdW5jdGlvbi50b1N0cmluZygpXG5cdFx0XHRkZWxldGUgX2ZpZWxkLl9jcmVhdGVGdW5jdGlvblxuXG5cdFx0aWYgXy5pc0Z1bmN0aW9uKF9maWVsZC5kZWZhdWx0VmFsdWUpXG5cdFx0XHRfZmllbGQuZGVmYXVsdFZhbHVlID0gX2ZpZWxkLmRlZmF1bHRWYWx1ZS50b1N0cmluZygpXG5cdFx0XHRkZWxldGUgX2ZpZWxkLl9kZWZhdWx0VmFsdWVcblx0XHQjVE9ETyDovazmjaJmaWVsZC5hdXRvZm9ybS50eXBl77yM5bey5ZKM5pyx5oCd5ZiJ56Gu6K6k77yM55uu5YmN5LiN5pSv5oyBYXV0b2Zvcm0udHlwZSDkuLpmdW5jdGlvbuexu+Wei1xuXHRcdGZpZWxkc1trZXldID0gX2ZpZWxkXG5cblx0X29iai5maWVsZHMgPSBmaWVsZHNcblxuXHRyZXR1cm4gX29ialxuXG4jIyNcbuWvvOWHuuaVsOaNrjpcbntcblx0YXBwczpbe31dLCDova/ku7bljIXpgInkuK3nmoRhcHBzXG5cdG9iamVjdHM6W3t9XSwg6YCJ5Lit55qEb2JqZWN05Y+K5YW2ZmllbGRzLCBsaXN0X3ZpZXdzLCB0cmlnZ2VycywgYWN0aW9ucywgcGVybWlzc2lvbl9zZXTnrYlcbiAgICBsaXN0X3ZpZXdzOlt7fV0sIOi9r+S7tuWMhemAieS4reeahGxpc3Rfdmlld3NcbiAgICBwZXJtaXNzaW9uczpbe31dLCDova/ku7bljIXpgInkuK3nmoTmnYPpmZDpm4ZcbiAgICBwZXJtaXNzaW9uX29iamVjdHM6W3t9XSwg6L2v5Lu25YyF6YCJ5Lit55qE5p2D6ZmQ5a+56LGhXG4gICAgcmVwb3J0czpbe31dIOi9r+S7tuWMhemAieS4reeahOaKpeihqFxufVxuIyMjXG5BUFRyYW5zZm9ybS5leHBvcnQgPSAocmVjb3JkKS0+XG5cdGV4cG9ydF9kYXRhID0ge31cblx0aWYgXy5pc0FycmF5KHJlY29yZC5hcHBzKSAmJiByZWNvcmQuYXBwcy5sZW5ndGggPiAwXG5cdFx0ZXhwb3J0X2RhdGEuYXBwcyA9IFtdXG5cblx0XHRfLmVhY2ggcmVjb3JkLmFwcHMsIChhcHBLZXkpLT5cblx0XHRcdGFwcCA9IHt9XG5cdFx0XHRfLmV4dGVuZChhcHAsIENyZWF0b3IuQXBwc1thcHBLZXldKVxuXHRcdFx0aWYgIWFwcCB8fCBfLmlzRW1wdHkoYXBwKVxuXHRcdFx0XHRhcHAgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBzXCIpLmZpbmRPbmUoe19pZDogYXBwS2V5fSwge2ZpZWxkczogaWdub3JlX2ZpZWxkc30pXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmICFfLmhhcyhhcHAsIFwiX2lkXCIpXG5cdFx0XHRcdFx0YXBwLl9pZCA9IGFwcEtleVxuXHRcdFx0aWYgYXBwXG5cdFx0XHRcdGV4cG9ydF9kYXRhLmFwcHMucHVzaCBhcHBcblxuXHRpZiBfLmlzQXJyYXkocmVjb3JkLm9iamVjdHMpICYmIHJlY29yZC5vYmplY3RzLmxlbmd0aCA+IDBcblx0XHRleHBvcnRfZGF0YS5vYmplY3RzID0gW11cblx0XHRfLmVhY2ggcmVjb3JkLm9iamVjdHMsIChvYmplY3RfbmFtZSktPlxuXHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxuXHRcdFx0aWYgb2JqZWN0XG5cdFx0XHRcdGV4cG9ydF9kYXRhLm9iamVjdHMucHVzaCBBUFRyYW5zZm9ybS5leHBvcnRPYmplY3Qob2JqZWN0KVxuXG5cdGlmIF8uaXNBcnJheShyZWNvcmQubGlzdF92aWV3cykgJiYgcmVjb3JkLmxpc3Rfdmlld3MubGVuZ3RoID4gMFxuXHRcdGV4cG9ydF9kYXRhLmxpc3Rfdmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe19pZDogeyRpbjogcmVjb3JkLmxpc3Rfdmlld3N9fSwge2ZpZWxkczogaWdub3JlX2ZpZWxkc30pLmZldGNoKClcblxuXHRpZiBfLmlzQXJyYXkocmVjb3JkLnBlcm1pc3Npb25fc2V0KSAmJiByZWNvcmQucGVybWlzc2lvbl9zZXQubGVuZ3RoID4gMFxuXHRcdGV4cG9ydF9kYXRhLnBlcm1pc3Npb25fc2V0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7X2lkOiB7JGluOiByZWNvcmQucGVybWlzc2lvbl9zZXR9fSwge2ZpZWxkczogaWdub3JlX2ZpZWxkc30pLmZldGNoKClcblxuXHRpZiBfLmlzQXJyYXkocmVjb3JkLnBlcm1pc3Npb25fb2JqZWN0cykgJiYgcmVjb3JkLnBlcm1pc3Npb25fb2JqZWN0cy5sZW5ndGggPiAwXG5cdFx0ZXhwb3J0X2RhdGEucGVybWlzc2lvbl9vYmplY3RzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe19pZDogeyRpbjogcmVjb3JkLnBlcm1pc3Npb25fb2JqZWN0c319LCB7ZmllbGRzOiBpZ25vcmVfZmllbGRzfSkuZmV0Y2goKVxuXG5cdGlmIF8uaXNBcnJheShyZWNvcmQucmVwb3J0cykgJiYgcmVjb3JkLnJlcG9ydHMubGVuZ3RoID4gMFxuXHRcdGV4cG9ydF9kYXRhLnJlcG9ydHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJyZXBvcnRzXCIpLmZpbmQoe19pZDogeyRpbjogcmVjb3JkLnJlcG9ydHN9fSwge2ZpZWxkczogaWdub3JlX2ZpZWxkc30pLmZldGNoKClcblxuXHRyZXR1cm4gZXhwb3J0X2RhdGFcbiIsInZhciBpZ25vcmVfZmllbGRzO1xuXG50aGlzLkFQVHJhbnNmb3JtID0ge307XG5cbmlnbm9yZV9maWVsZHMgPSB7XG4gIG93bmVyOiAwLFxuICBzcGFjZTogMCxcbiAgY3JlYXRlZDogMCxcbiAgY3JlYXRlZF9ieTogMCxcbiAgbW9kaWZpZWQ6IDAsXG4gIG1vZGlmaWVkX2J5OiAwLFxuICBpc19kZWxldGVkOiAwLFxuICBpbnN0YW5jZXM6IDAsXG4gIHNoYXJpbmc6IDBcbn07XG5cbkFQVHJhbnNmb3JtLmV4cG9ydE9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgX29iaiwgYWN0aW9ucywgZmllbGRzLCBvYmpfbGlzdF92aWV3cywgdHJpZ2dlcnM7XG4gIF9vYmogPSB7fTtcbiAgXy5leHRlbmQoX29iaiwgb2JqZWN0KTtcbiAgb2JqX2xpc3Rfdmlld3MgPSB7fTtcbiAgXy5leHRlbmQob2JqX2xpc3Rfdmlld3MsIF9vYmoubGlzdF92aWV3cyB8fCB7fSk7XG4gIF8uZWFjaChvYmpfbGlzdF92aWV3cywgZnVuY3Rpb24odiwgaykge1xuICAgIGlmICghXy5oYXModiwgXCJfaWRcIikpIHtcbiAgICAgIHYuX2lkID0gaztcbiAgICB9XG4gICAgaWYgKCFfLmhhcyh2LCBcIm5hbWVcIikpIHtcbiAgICAgIHJldHVybiB2Lm5hbWUgPSBrO1xuICAgIH1cbiAgfSk7XG4gIF9vYmoubGlzdF92aWV3cyA9IG9ial9saXN0X3ZpZXdzO1xuICB0cmlnZ2VycyA9IHt9O1xuICBfLmZvckVhY2goX29iai50cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlciwga2V5KSB7XG4gICAgdmFyIF90cmlnZ2VyO1xuICAgIF90cmlnZ2VyID0ge307XG4gICAgXy5leHRlbmQoX3RyaWdnZXIsIHRyaWdnZXIpO1xuICAgIGlmIChfLmlzRnVuY3Rpb24oX3RyaWdnZXIudG9kbykpIHtcbiAgICAgIF90cmlnZ2VyLnRvZG8gPSBfdHJpZ2dlci50b2RvLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGRlbGV0ZSBfdHJpZ2dlci5fdG9kbztcbiAgICByZXR1cm4gdHJpZ2dlcnNba2V5XSA9IF90cmlnZ2VyO1xuICB9KTtcbiAgX29iai50cmlnZ2VycyA9IHRyaWdnZXJzO1xuICBhY3Rpb25zID0ge307XG4gIF8uZm9yRWFjaChfb2JqLmFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbiwga2V5KSB7XG4gICAgdmFyIF9hY3Rpb247XG4gICAgX2FjdGlvbiA9IHt9O1xuICAgIF8uZXh0ZW5kKF9hY3Rpb24sIGFjdGlvbik7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihfYWN0aW9uLnRvZG8pKSB7XG4gICAgICBfYWN0aW9uLnRvZG8gPSBfYWN0aW9uLnRvZG8udG9TdHJpbmcoKTtcbiAgICB9XG4gICAgZGVsZXRlIF9hY3Rpb24uX3RvZG87XG4gICAgcmV0dXJuIGFjdGlvbnNba2V5XSA9IF9hY3Rpb247XG4gIH0pO1xuICBfb2JqLmFjdGlvbnMgPSBhY3Rpb25zO1xuICBmaWVsZHMgPSB7fTtcbiAgXy5mb3JFYWNoKF9vYmouZmllbGRzLCBmdW5jdGlvbihmaWVsZCwga2V5KSB7XG4gICAgdmFyIF9maWVsZCwgX2ZvO1xuICAgIF9maWVsZCA9IHt9O1xuICAgIF8uZXh0ZW5kKF9maWVsZCwgZmllbGQpO1xuICAgIGlmIChfLmlzRnVuY3Rpb24oX2ZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICBfZmllbGQub3B0aW9ucyA9IF9maWVsZC5vcHRpb25zLnRvU3RyaW5nKCk7XG4gICAgICBkZWxldGUgX2ZpZWxkLl9vcHRpb25zO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KF9maWVsZC5vcHRpb25zKSkge1xuICAgICAgX2ZvID0gW107XG4gICAgICBfLmZvckVhY2goX2ZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKF9vMSkge1xuICAgICAgICByZXR1cm4gX2ZvLnB1c2goX28xLmxhYmVsICsgXCI6XCIgKyBfbzEudmFsdWUpO1xuICAgICAgfSk7XG4gICAgICBfZmllbGQub3B0aW9ucyA9IF9mby5qb2luKFwiLFwiKTtcbiAgICAgIGRlbGV0ZSBfZmllbGQuX29wdGlvbnM7XG4gICAgfVxuICAgIGlmIChfZmllbGQucmVnRXgpIHtcbiAgICAgIF9maWVsZC5yZWdFeCA9IF9maWVsZC5yZWdFeC50b1N0cmluZygpO1xuICAgICAgZGVsZXRlIF9maWVsZC5fcmVnRXg7XG4gICAgfVxuICAgIGlmIChfLmlzRnVuY3Rpb24oX2ZpZWxkLm9wdGlvbnNGdW5jdGlvbikpIHtcbiAgICAgIF9maWVsZC5vcHRpb25zRnVuY3Rpb24gPSBfZmllbGQub3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICBkZWxldGUgX2ZpZWxkLl9vcHRpb25zRnVuY3Rpb247XG4gICAgfVxuICAgIGlmIChfLmlzRnVuY3Rpb24oX2ZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgIF9maWVsZC5yZWZlcmVuY2VfdG8gPSBfZmllbGQucmVmZXJlbmNlX3RvLnRvU3RyaW5nKCk7XG4gICAgICBkZWxldGUgX2ZpZWxkLl9yZWZlcmVuY2VfdG87XG4gICAgfVxuICAgIGlmIChfLmlzRnVuY3Rpb24oX2ZpZWxkLmNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgX2ZpZWxkLmNyZWF0ZUZ1bmN0aW9uID0gX2ZpZWxkLmNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICBkZWxldGUgX2ZpZWxkLl9jcmVhdGVGdW5jdGlvbjtcbiAgICB9XG4gICAgaWYgKF8uaXNGdW5jdGlvbihfZmllbGQuZGVmYXVsdFZhbHVlKSkge1xuICAgICAgX2ZpZWxkLmRlZmF1bHRWYWx1ZSA9IF9maWVsZC5kZWZhdWx0VmFsdWUudG9TdHJpbmcoKTtcbiAgICAgIGRlbGV0ZSBfZmllbGQuX2RlZmF1bHRWYWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkc1trZXldID0gX2ZpZWxkO1xuICB9KTtcbiAgX29iai5maWVsZHMgPSBmaWVsZHM7XG4gIHJldHVybiBfb2JqO1xufTtcblxuXG4vKlxu5a+85Ye65pWw5o2uOlxue1xuXHRhcHBzOlt7fV0sIOi9r+S7tuWMhemAieS4reeahGFwcHNcblx0b2JqZWN0czpbe31dLCDpgInkuK3nmoRvYmplY3Tlj4rlhbZmaWVsZHMsIGxpc3Rfdmlld3MsIHRyaWdnZXJzLCBhY3Rpb25zLCBwZXJtaXNzaW9uX3NldOetiVxuICAgIGxpc3Rfdmlld3M6W3t9XSwg6L2v5Lu25YyF6YCJ5Lit55qEbGlzdF92aWV3c1xuICAgIHBlcm1pc3Npb25zOlt7fV0sIOi9r+S7tuWMhemAieS4reeahOadg+mZkOmbhlxuICAgIHBlcm1pc3Npb25fb2JqZWN0czpbe31dLCDova/ku7bljIXpgInkuK3nmoTmnYPpmZDlr7nosaFcbiAgICByZXBvcnRzOlt7fV0g6L2v5Lu25YyF6YCJ5Lit55qE5oql6KGoXG59XG4gKi9cblxuQVBUcmFuc2Zvcm1bXCJleHBvcnRcIl0gPSBmdW5jdGlvbihyZWNvcmQpIHtcbiAgdmFyIGV4cG9ydF9kYXRhO1xuICBleHBvcnRfZGF0YSA9IHt9O1xuICBpZiAoXy5pc0FycmF5KHJlY29yZC5hcHBzKSAmJiByZWNvcmQuYXBwcy5sZW5ndGggPiAwKSB7XG4gICAgZXhwb3J0X2RhdGEuYXBwcyA9IFtdO1xuICAgIF8uZWFjaChyZWNvcmQuYXBwcywgZnVuY3Rpb24oYXBwS2V5KSB7XG4gICAgICB2YXIgYXBwO1xuICAgICAgYXBwID0ge307XG4gICAgICBfLmV4dGVuZChhcHAsIENyZWF0b3IuQXBwc1thcHBLZXldKTtcbiAgICAgIGlmICghYXBwIHx8IF8uaXNFbXB0eShhcHApKSB7XG4gICAgICAgIGFwcCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImFwcHNcIikuZmluZE9uZSh7XG4gICAgICAgICAgX2lkOiBhcHBLZXlcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogaWdub3JlX2ZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghXy5oYXMoYXBwLCBcIl9pZFwiKSkge1xuICAgICAgICAgIGFwcC5faWQgPSBhcHBLZXk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChhcHApIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydF9kYXRhLmFwcHMucHVzaChhcHApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChfLmlzQXJyYXkocmVjb3JkLm9iamVjdHMpICYmIHJlY29yZC5vYmplY3RzLmxlbmd0aCA+IDApIHtcbiAgICBleHBvcnRfZGF0YS5vYmplY3RzID0gW107XG4gICAgXy5lYWNoKHJlY29yZC5vYmplY3RzLCBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgICAgdmFyIG9iamVjdDtcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBleHBvcnRfZGF0YS5vYmplY3RzLnB1c2goQVBUcmFuc2Zvcm0uZXhwb3J0T2JqZWN0KG9iamVjdCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChfLmlzQXJyYXkocmVjb3JkLmxpc3Rfdmlld3MpICYmIHJlY29yZC5saXN0X3ZpZXdzLmxlbmd0aCA+IDApIHtcbiAgICBleHBvcnRfZGF0YS5saXN0X3ZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IHJlY29yZC5saXN0X3ZpZXdzXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiBpZ25vcmVfZmllbGRzXG4gICAgfSkuZmV0Y2goKTtcbiAgfVxuICBpZiAoXy5pc0FycmF5KHJlY29yZC5wZXJtaXNzaW9uX3NldCkgJiYgcmVjb3JkLnBlcm1pc3Npb25fc2V0Lmxlbmd0aCA+IDApIHtcbiAgICBleHBvcnRfZGF0YS5wZXJtaXNzaW9uX3NldCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogcmVjb3JkLnBlcm1pc3Npb25fc2V0XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiBpZ25vcmVfZmllbGRzXG4gICAgfSkuZmV0Y2goKTtcbiAgfVxuICBpZiAoXy5pc0FycmF5KHJlY29yZC5wZXJtaXNzaW9uX29iamVjdHMpICYmIHJlY29yZC5wZXJtaXNzaW9uX29iamVjdHMubGVuZ3RoID4gMCkge1xuICAgIGV4cG9ydF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IHJlY29yZC5wZXJtaXNzaW9uX29iamVjdHNcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IGlnbm9yZV9maWVsZHNcbiAgICB9KS5mZXRjaCgpO1xuICB9XG4gIGlmIChfLmlzQXJyYXkocmVjb3JkLnJlcG9ydHMpICYmIHJlY29yZC5yZXBvcnRzLmxlbmd0aCA+IDApIHtcbiAgICBleHBvcnRfZGF0YS5yZXBvcnRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicmVwb3J0c1wiKS5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IHJlY29yZC5yZXBvcnRzXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiBpZ25vcmVfZmllbGRzXG4gICAgfSkuZmV0Y2goKTtcbiAgfVxuICByZXR1cm4gZXhwb3J0X2RhdGE7XG59O1xuIl19
