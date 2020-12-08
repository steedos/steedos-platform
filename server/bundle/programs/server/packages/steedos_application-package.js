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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcHBsaWNhdGlvbi1wYWNrYWdlL21vZGVscy9hcHBsaWNhdGlvbl9wYWNrYWdlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbW9kZWxzL2FwcGxpY2F0aW9uX3BhY2thZ2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwcGxpY2F0aW9uLXBhY2thZ2Uvc2VydmVyL3JvdXRlcy9leHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2V4cG9ydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBwbGljYXRpb24tcGFja2FnZS9zZXJ2ZXIvcm91dGVzL2ltcG9ydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9yb3V0ZXMvaW1wb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcHBsaWNhdGlvbi1wYWNrYWdlL3NlcnZlci9tZXRob2RzL2xpc3R2aWV3c19vcHRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvbGlzdHZpZXdzX29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwcGxpY2F0aW9uLXBhY2thZ2Uvc2VydmVyL21ldGhvZHMvaW5pdF9leHBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2luaXRfZXhwb3J0X2RhdGEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwcGxpY2F0aW9uLXBhY2thZ2UvbGliL3RyYW5zZm9ybS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi90cmFuc2Zvcm0uY29mZmVlIl0sIm5hbWVzIjpbIkNyZWF0b3IiLCJPYmplY3RzIiwiYXBwbGljYXRpb25fcGFja2FnZSIsIm5hbWUiLCJpY29uIiwibGFiZWwiLCJoaWRkZW4iLCJmaWVsZHMiLCJ0eXBlIiwiYXBwcyIsInJlZmVyZW5jZV90byIsIm11bHRpcGxlIiwib3B0aW9uc0Z1bmN0aW9uIiwiX29wdGlvbnMiLCJfIiwiZm9yRWFjaCIsIkFwcHMiLCJvIiwiayIsInB1c2giLCJ2YWx1ZSIsImljb25fc2xkcyIsIm9iamVjdHMiLCJvYmplY3RzQnlOYW1lIiwibGlzdF92aWV3cyIsIm9wdGlvbnNNZXRob2QiLCJwZXJtaXNzaW9uX3NldCIsInBlcm1pc3Npb25fb2JqZWN0cyIsInJlcG9ydHMiLCJhbGwiLCJjb2x1bW5zIiwiZmlsdGVyX3Njb3BlIiwiYWN0aW9ucyIsImluaXRfZGF0YSIsInZpc2libGUiLCJvbiIsInRvZG8iLCJvYmplY3RfbmFtZSIsInJlY29yZF9pZCIsImNvbnNvbGUiLCJsb2ciLCJNZXRlb3IiLCJjYWxsIiwiU2Vzc2lvbiIsImdldCIsImVycm9yIiwicmVzdWx0IiwidG9hc3RyIiwicmVhc29uIiwic3VjY2VzcyIsInVybCIsIlN0ZWVkb3MiLCJhYnNvbHV0ZVVybCIsIndpbmRvdyIsIm9wZW4iLCJNb2RhbCIsInNob3ciLCJKc29uUm91dGVzIiwiYWRkIiwicmVxIiwicmVzIiwibmV4dCIsImRhdGEiLCJlIiwiZmlsZU5hbWUiLCJyZWNvcmQiLCJzcGFjZV9pZCIsInNwYWNlX3VzZXIiLCJ1c2VySWQiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwic2VuZFJlc3VsdCIsImNvZGUiLCJlcnJvcnMiLCJwYXJhbXMiLCJpc1NwYWNlQWRtaW4iLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsIl9pZCIsInVzZXIiLCJzcGFjZSIsIkFQVHJhbnNmb3JtIiwiZGF0YVNvdXJjZSIsInNldEhlYWRlciIsImVuY29kZVVSSSIsImVuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzdGFjayIsIm1lc3NhZ2UiLCJ0cmFuc2Zvcm1GaWVsZE9wdGlvbnMiLCJ0cmFuc2Zvcm1GaWx0ZXJzIiwiZmlsdGVycyIsIl9maWx0ZXJzIiwiZWFjaCIsImYiLCJpc0FycmF5IiwibGVuZ3RoIiwiZmllbGQiLCJvcGVyYXRpb24iLCJvcHRpb25zIiwiaGFzIiwiam9pbiIsImltcG9ydE9iamVjdCIsIm9iamVjdCIsImxpc3Rfdmlld3NfaWRfbWFwcyIsIl9maWVsZG5hbWVzIiwiaGFzUmVjZW50VmlldyIsImludGVybmFsX2xpc3RfdmlldyIsIm9ial9saXN0X3ZpZXdzIiwidHJpZ2dlcnMiLCJwZXJtaXNzaW9ucyIsIm93bmVyIiwiaW5zZXJ0IiwibGlzdF92aWV3IiwibmV3X2lkIiwib2xkX2lkIiwiaXNSZWNlbnRWaWV3IiwiaXNBbGxWaWV3IiwiJHNldCIsIiR1bnNldCIsInVwZGF0ZSIsInJlbW92ZSIsImNvbnRhaW5zIiwiZGlyZWN0IiwidHJpZ2dlciIsInJlcGxhY2UiLCJSZWdFeHAiLCJpc19lbmFibGUiLCJhY3Rpb24iLCJpbXBvcnRfYXBwX3BhY2thZ2UiLCJpbXBfZGF0YSIsImZyb21fdGVtcGxhdGUiLCJhcHBzX2lkX21hcHMiLCJpbXBfYXBwX2lkcyIsImltcF9vYmplY3RfbmFtZXMiLCJvYmplY3RfbmFtZXMiLCJwZXJtaXNzaW9uX3NldF9pZF9tYXBzIiwicGVybWlzc2lvbl9zZXRfaWRzIiwiRXJyb3IiLCJjaGVjayIsIk9iamVjdCIsInBsdWNrIiwiYXBwIiwiaW5jbHVkZSIsImtleXMiLCJpc0xlZ2FsVmVyc2lvbiIsImlzU3RyaW5nIiwiYXNzaWduZWRfYXBwcyIsImFwcF9pZCIsInBlcm1pc3Npb25fb2JqZWN0IiwicGVybWlzc2lvbl9zZXRfaWQiLCJyZXBvcnQiLCJpc19jcmVhdG9yIiwiX2xpc3RfdmlldyIsInBlcm1pc3Npb25fc2V0X3VzZXJzIiwidXNlcnMiLCJ1c2VyX2lkIiwiZGlzYWJsZWRfbGlzdF92aWV3cyIsImxpc3Rfdmlld19pZCIsIm5ld192aWV3X2lkIiwibWV0aG9kcyIsImNvbGxlY3Rpb24iLCJuYW1lX2ZpZWxkX2tleSIsInF1ZXJ5IiwicXVlcnlfb3B0aW9ucyIsInJlY29yZHMiLCJyZWYiLCJyZWYxIiwicmVzdWx0cyIsInNlYXJjaFRleHRRdWVyeSIsInNlbGVjdGVkIiwic29ydCIsImdldE9iamVjdCIsIk5BTUVfRklFTERfS0VZIiwic2VhcmNoVGV4dCIsIiRyZWdleCIsInZhbHVlcyIsIiRvciIsIiRpbiIsImV4dGVuZCIsIiRuaW4iLCJkYiIsImZpbHRlclF1ZXJ5IiwibGltaXQiLCJpc09iamVjdCIsImZpbmQiLCJmZXRjaCIsInJlZjIiLCJpc0VtcHR5IiwiZ2V0QXBwT2JqZWN0cyIsImdldE9iamVjdHNMaXN0Vmlld3MiLCJnZXRPYmplY3RzUGVybWlzc2lvbk9iamVjdHMiLCJnZXRPYmplY3RzUGVybWlzc2lvblNldCIsImdldE9iamVjdHNSZXBvcnRzIiwiYXBwT2JqZWN0cyIsIm9iamVjdHNfbmFtZSIsIm9iamVjdHNMaXN0Vmlld3MiLCJzaGFyZWQiLCJvYmplY3RzUmVwb3J0cyIsIm9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cyIsIm9iamVjdHNQZXJtaXNzaW9uU2V0IiwiX29iamVjdHMiLCJfb2JqZWN0c19saXN0X3ZpZXdzIiwiX29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzIiwiX29iamVjdHNfcGVybWlzc2lvbl9zZXQiLCJfb2JqZWN0c19yZXBvcnRzIiwiYXBwSWQiLCJjb25jYXQiLCJ1bmlxIiwiaWdub3JlX2ZpZWxkcyIsImNyZWF0ZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWQiLCJtb2RpZmllZF9ieSIsImlzX2RlbGV0ZWQiLCJpbnN0YW5jZXMiLCJzaGFyaW5nIiwiZXhwb3J0T2JqZWN0IiwiX29iaiIsInYiLCJrZXkiLCJfdHJpZ2dlciIsImlzRnVuY3Rpb24iLCJ0b1N0cmluZyIsIl90b2RvIiwiX2FjdGlvbiIsIl9maWVsZCIsIl9mbyIsIl9vMSIsInJlZ0V4IiwiX3JlZ0V4IiwiX29wdGlvbnNGdW5jdGlvbiIsIl9yZWZlcmVuY2VfdG8iLCJjcmVhdGVGdW5jdGlvbiIsIl9jcmVhdGVGdW5jdGlvbiIsImRlZmF1bHRWYWx1ZSIsIl9kZWZhdWx0VmFsdWUiLCJleHBvcnRfZGF0YSIsImFwcEtleSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxRQUFRQyxPQUFSLENBQWdCQyxtQkFBaEIsR0FDQztBQUFBQyxRQUFNLHFCQUFOO0FBQ0FDLFFBQU0saUJBRE47QUFFQUMsU0FBTyxLQUZQO0FBR0FDLFVBQVEsSUFIUjtBQUlBQyxVQUNDO0FBQUFKLFVBQ0M7QUFBQUssWUFBTSxNQUFOO0FBQ0FILGFBQU87QUFEUCxLQUREO0FBR0FJLFVBQ0M7QUFBQUQsWUFBTSxRQUFOO0FBQ0FILGFBQU8sSUFEUDtBQUVBRyxZQUFNLFFBRk47QUFHQUUsb0JBQWMsTUFIZDtBQUlBQyxnQkFBVSxJQUpWO0FBS0FDLHVCQUFpQjtBQUNoQixZQUFBQyxRQUFBOztBQUFBQSxtQkFBVyxFQUFYOztBQUNBQyxVQUFFQyxPQUFGLENBQVVmLFFBQVFnQixJQUFsQixFQUF3QixVQUFDQyxDQUFELEVBQUlDLENBQUo7QUNHbEIsaUJERkxMLFNBQVNNLElBQVQsQ0FBYztBQUFDZCxtQkFBT1ksRUFBRWQsSUFBVjtBQUFnQmlCLG1CQUFPRixDQUF2QjtBQUEwQmQsa0JBQU1hLEVBQUVJO0FBQWxDLFdBQWQsQ0NFSztBREhOOztBQUVBLGVBQU9SLFFBQVA7QUFURDtBQUFBLEtBSkQ7QUFjQVMsYUFDQztBQUFBZCxZQUFNLFFBQU47QUFDQUgsYUFBTyxJQURQO0FBRUFLLG9CQUFjLFNBRmQ7QUFHQUMsZ0JBQVUsSUFIVjtBQUlBQyx1QkFBaUI7QUFDaEIsWUFBQUMsUUFBQTs7QUFBQUEsbUJBQVcsRUFBWDs7QUFDQUMsVUFBRUMsT0FBRixDQUFVZixRQUFRdUIsYUFBbEIsRUFBaUMsVUFBQ04sQ0FBRCxFQUFJQyxDQUFKO0FBQ2hDLGNBQUcsQ0FBQ0QsRUFBRVgsTUFBTjtBQ1dPLG1CRFZOTyxTQUFTTSxJQUFULENBQWM7QUFBRWQscUJBQU9ZLEVBQUVaLEtBQVg7QUFBa0JlLHFCQUFPRixDQUF6QjtBQUE0QmQsb0JBQU1hLEVBQUViO0FBQXBDLGFBQWQsQ0NVTTtBQUtEO0FEakJQOztBQUdBLGVBQU9TLFFBQVA7QUFURDtBQUFBLEtBZkQ7QUEwQkFXLGdCQUNDO0FBQUFoQixZQUFNLFFBQU47QUFDQUgsYUFBTyxNQURQO0FBRUFNLGdCQUFVLElBRlY7QUFHQUQsb0JBQWMsa0JBSGQ7QUFJQWUscUJBQWU7QUFKZixLQTNCRDtBQWdDQUMsb0JBQ0M7QUFBQWxCLFlBQU0sUUFBTjtBQUNBSCxhQUFPLEtBRFA7QUFFQU0sZ0JBQVUsSUFGVjtBQUdBRCxvQkFBYztBQUhkLEtBakNEO0FBcUNBaUIsd0JBQ0M7QUFBQW5CLFlBQU0sUUFBTjtBQUNBSCxhQUFPLEtBRFA7QUFFQU0sZ0JBQVUsSUFGVjtBQUdBRCxvQkFBYztBQUhkLEtBdENEO0FBMENBa0IsYUFDQztBQUFBcEIsWUFBTSxRQUFOO0FBQ0FILGFBQU8sSUFEUDtBQUVBTSxnQkFBVSxJQUZWO0FBR0FELG9CQUFjO0FBSGQ7QUEzQ0QsR0FMRDtBQW9EQWMsY0FDQztBQUFBSyxTQUNDO0FBQUF4QixhQUFPLElBQVA7QUFDQXlCLGVBQVMsQ0FBQyxNQUFELENBRFQ7QUFFQUMsb0JBQWM7QUFGZDtBQURELEdBckREO0FBeURBQyxXQUNDO0FBQUFDLGVBQ0M7QUFBQTVCLGFBQU8sS0FBUDtBQUNBNkIsZUFBUyxJQURUO0FBRUFDLFVBQUksUUFGSjtBQUdBQyxZQUFNLFVBQUNDLFdBQUQsRUFBY0MsU0FBZCxFQUF5Qi9CLE1BQXpCO0FBQ0xnQyxnQkFBUUMsR0FBUixDQUFZSCxXQUFaLEVBQXlCQyxTQUF6QixFQUFvQy9CLE1BQXBDO0FDeUJJLGVEeEJKa0MsT0FBT0MsSUFBUCxDQUFZLDZCQUFaLEVBQTJDQyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUEzQyxFQUFtRU4sU0FBbkUsRUFBNkUsVUFBQ08sS0FBRCxFQUFRQyxNQUFSO0FBQzVFLGNBQUdELEtBQUg7QUN5Qk8sbUJEeEJORSxPQUFPRixLQUFQLENBQWFBLE1BQU1HLE1BQW5CLENDd0JNO0FEekJQO0FDMkJPLG1CRHhCTkQsT0FBT0UsT0FBUCxDQUFlLE9BQWYsQ0N3Qk07QUFDRDtBRDdCUCxVQ3dCSTtBRDdCTDtBQUFBLEtBREQ7QUFXQSxjQUNDO0FBQUE1QyxhQUFPLElBQVA7QUFDQTZCLGVBQVMsSUFEVDtBQUVBQyxVQUFJLFFBRko7QUFHQUMsWUFBTSxVQUFDQyxXQUFELEVBQWNDLFNBQWQsRUFBeUIvQixNQUF6QjtBQUNMLFlBQUEyQyxHQUFBO0FBQUFYLGdCQUFRQyxHQUFSLENBQVksT0FBS0gsV0FBTCxHQUFpQixJQUFqQixHQUFxQkMsU0FBakM7QUFDQVksY0FBTUMsUUFBUUMsV0FBUixDQUFvQixxQ0FBbUNULFFBQVFDLEdBQVIsQ0FBWSxTQUFaLENBQW5DLEdBQTBELEdBQTFELEdBQTZETixTQUFqRixDQUFOO0FDOEJJLGVEN0JKZSxPQUFPQyxJQUFQLENBQVlKLEdBQVosQ0M2Qkk7QURuQ0w7QUFBQSxLQVpEO0FBc0NBLGNBQ0M7QUFBQTdDLGFBQU8sSUFBUDtBQUNBNkIsZUFBUyxJQURUO0FBRUFDLFVBQUksTUFGSjtBQUdBQyxZQUFNLFVBQUNDLFdBQUQ7QUFDTEUsZ0JBQVFDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCSCxXQUEzQjtBQ2FJLGVEWkprQixNQUFNQyxJQUFOLENBQVcsc0JBQVgsQ0NZSTtBRGpCTDtBQUFBO0FBdkNEO0FBMURELENBREQsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUFBQyxXQUFXQyxHQUFYLENBQWUsS0FBZixFQUFzQixzREFBdEIsRUFBOEUsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVg7QUFDN0UsTUFBQUMsSUFBQSxFQUFBQyxDQUFBLEVBQUFDLFFBQUEsRUFBQUMsTUFBQSxFQUFBM0IsU0FBQSxFQUFBNEIsUUFBQSxFQUFBQyxVQUFBLEVBQUFDLE1BQUE7O0FBQUE7QUFFQ0EsYUFBU2pCLFFBQVFrQixzQkFBUixDQUErQlYsR0FBL0IsRUFBb0NDLEdBQXBDLENBQVQ7O0FBRUEsUUFBRyxDQUFDUSxNQUFKO0FBQ0NYLGlCQUFXYSxVQUFYLENBQXNCVixHQUF0QixFQUEyQjtBQUMxQlcsY0FBTSxHQURvQjtBQUUxQlQsY0FBTTtBQUFDVSxrQkFBUTtBQUFUO0FBRm9CLE9BQTNCO0FBSUE7QUNFRTs7QURBSGxDLGdCQUFZcUIsSUFBSWMsTUFBSixDQUFXbkMsU0FBdkI7QUFDQTRCLGVBQVdQLElBQUljLE1BQUosQ0FBV1AsUUFBdEI7O0FBRUEsUUFBRyxDQUFDbEUsUUFBUTBFLFlBQVIsQ0FBcUJSLFFBQXJCLEVBQStCRSxNQUEvQixDQUFKO0FBQ0NYLGlCQUFXYSxVQUFYLENBQXNCVixHQUF0QixFQUEyQjtBQUMxQlcsY0FBTSxHQURvQjtBQUUxQlQsY0FBTTtBQUFDVSxrQkFBUTtBQUFUO0FBRm9CLE9BQTNCO0FBSUE7QUNHRTs7QURESFAsYUFBU2pFLFFBQVEyRSxhQUFSLENBQXNCLHFCQUF0QixFQUE2Q0MsT0FBN0MsQ0FBcUQ7QUFBQ0MsV0FBS3ZDO0FBQU4sS0FBckQsQ0FBVDs7QUFFQSxRQUFHLENBQUMyQixNQUFKO0FBQ0NSLGlCQUFXYSxVQUFYLENBQXNCVixHQUF0QixFQUEyQjtBQUMxQlcsY0FBTSxHQURvQjtBQUUxQlQsY0FBTTtBQUFDVSxrQkFBUSwwQ0FBd0NsQztBQUFqRDtBQUZvQixPQUEzQjtBQUlBO0FDTUU7O0FESkg2QixpQkFBYW5FLFFBQVEyRSxhQUFSLENBQXNCLGFBQXRCLEVBQXFDQyxPQUFyQyxDQUE2QztBQUFDRSxZQUFNVixNQUFQO0FBQWVXLGFBQU9kLE9BQU9jO0FBQTdCLEtBQTdDLENBQWI7O0FBRUEsUUFBRyxDQUFDWixVQUFKO0FBQ0NWLGlCQUFXYSxVQUFYLENBQXNCVixHQUF0QixFQUEyQjtBQUMxQlcsY0FBTSxHQURvQjtBQUUxQlQsY0FBTTtBQUFDVSxrQkFBUTtBQUFUO0FBRm9CLE9BQTNCO0FBSUE7QUNVRTs7QURSSFYsV0FBT2tCLFlBQVcsUUFBWCxFQUFtQmYsTUFBbkIsQ0FBUDtBQUVBSCxTQUFLbUIsVUFBTCxHQUFrQnhDLE9BQU9XLFdBQVAsQ0FBbUIsb0NBQWtDYyxRQUFsQyxHQUEyQyxHQUEzQyxHQUE4QzVCLFNBQWpFLENBQWxCO0FBRUEwQixlQUFXQyxPQUFPOUQsSUFBUCxJQUFlLHFCQUExQjtBQUVBeUQsUUFBSXNCLFNBQUosQ0FBYyxjQUFkLEVBQThCLDBCQUE5QjtBQUNBdEIsUUFBSXNCLFNBQUosQ0FBYyxxQkFBZCxFQUFxQyx5QkFBdUJDLFVBQVVuQixRQUFWLENBQXZCLEdBQTJDLE9BQWhGO0FDT0UsV0RORkosSUFBSXdCLEdBQUosQ0FBUUMsS0FBS0MsU0FBTCxDQUFleEIsSUFBZixFQUFxQixJQUFyQixFQUEyQixDQUEzQixDQUFSLENDTUU7QURyREgsV0FBQWpCLEtBQUE7QUFnRE1rQixRQUFBbEIsS0FBQTtBQUNMTixZQUFRTSxLQUFSLENBQWNrQixFQUFFd0IsS0FBaEI7QUNRRSxXRFBGOUIsV0FBV2EsVUFBWCxDQUFzQlYsR0FBdEIsRUFBMkI7QUFDMUJXLFlBQU0sR0FEb0I7QUFFMUJULFlBQU07QUFBRVUsZ0JBQVFULEVBQUVmLE1BQUYsSUFBWWUsRUFBRXlCO0FBQXhCO0FBRm9CLEtBQTNCLENDT0U7QUFNRDtBRGhFSCxHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFQUEsSUFBQUMscUJBQUEsRUFBQUMsZ0JBQUE7O0FBQUFBLG1CQUFtQixVQUFDQyxPQUFEO0FBQ2xCLE1BQUFDLFFBQUE7O0FBQUFBLGFBQVcsRUFBWDs7QUFDQTlFLElBQUUrRSxJQUFGLENBQU9GLE9BQVAsRUFBZ0IsVUFBQ0csQ0FBRDtBQUNmLFFBQUdoRixFQUFFaUYsT0FBRixDQUFVRCxDQUFWLEtBQWdCQSxFQUFFRSxNQUFGLEtBQVksQ0FBL0I7QUNJSSxhREhISixTQUFTekUsSUFBVCxDQUFjO0FBQUM4RSxlQUFPSCxFQUFFLENBQUYsQ0FBUjtBQUFjSSxtQkFBV0osRUFBRSxDQUFGLENBQXpCO0FBQStCMUUsZUFBTzBFLEVBQUUsQ0FBRjtBQUF0QyxPQUFkLENDR0c7QURKSjtBQ1VJLGFEUEhGLFNBQVN6RSxJQUFULENBQWMyRSxDQUFkLENDT0c7QUFDRDtBRFpKOztBQUtBLFNBQU9GLFFBQVA7QUFQa0IsQ0FBbkI7O0FBU0FILHdCQUF3QixVQUFDVSxPQUFEO0FBQ3ZCLE1BQUF0RixRQUFBOztBQUFBLE1BQUcsQ0FBQ0MsRUFBRWlGLE9BQUYsQ0FBVUksT0FBVixDQUFKO0FBQ0MsV0FBT0EsT0FBUDtBQ1lDOztBRFZGdEYsYUFBVyxFQUFYOztBQUVBQyxJQUFFK0UsSUFBRixDQUFPTSxPQUFQLEVBQWdCLFVBQUNsRixDQUFEO0FBQ2YsUUFBR0EsS0FBS0gsRUFBRXNGLEdBQUYsQ0FBTW5GLENBQU4sRUFBUyxPQUFULENBQUwsSUFBMEJILEVBQUVzRixHQUFGLENBQU1uRixDQUFOLEVBQVMsT0FBVCxDQUE3QjtBQ1dJLGFEVkhKLFNBQVNNLElBQVQsQ0FBaUJGLEVBQUVaLEtBQUYsR0FBUSxHQUFSLEdBQVdZLEVBQUVHLEtBQTlCLENDVUc7QUFDRDtBRGJKOztBQUlBLFNBQU9QLFNBQVN3RixJQUFULENBQWMsR0FBZCxDQUFQO0FBVnVCLENBQXhCOztBQWFBckcsUUFBUXNHLFlBQVIsR0FBdUIsVUFBQ2xDLE1BQUQsRUFBU0YsUUFBVCxFQUFtQnFDLE1BQW5CLEVBQTJCQyxrQkFBM0I7QUFDdEIsTUFBQUMsV0FBQSxFQUFBekUsT0FBQSxFQUFBekIsTUFBQSxFQUFBbUcsYUFBQSxFQUFBQyxrQkFBQSxFQUFBQyxjQUFBLEVBQUFDLFFBQUE7O0FBQUF0RSxVQUFRQyxHQUFSLENBQVksa0RBQVosRUFBZ0UrRCxPQUFPcEcsSUFBdkU7QUFDQUksV0FBU2dHLE9BQU9oRyxNQUFoQjtBQUNBc0csYUFBV04sT0FBT00sUUFBbEI7QUFDQTdFLFlBQVV1RSxPQUFPdkUsT0FBakI7QUFDQTRFLG1CQUFpQkwsT0FBTy9FLFVBQXhCO0FBRUEsU0FBTytFLE9BQU8xQixHQUFkO0FBQ0EsU0FBTzBCLE9BQU9oRyxNQUFkO0FBQ0EsU0FBT2dHLE9BQU9NLFFBQWQ7QUFDQSxTQUFPTixPQUFPdkUsT0FBZDtBQUNBLFNBQU91RSxPQUFPTyxXQUFkO0FBQ0EsU0FBT1AsT0FBTy9FLFVBQWQ7QUFFQStFLFNBQU94QixLQUFQLEdBQWViLFFBQWY7QUFDQXFDLFNBQU9RLEtBQVAsR0FBZTNDLE1BQWY7QUFFQXBFLFVBQVEyRSxhQUFSLENBQXNCLFNBQXRCLEVBQWlDcUMsTUFBakMsQ0FBd0NULE1BQXhDO0FBR0FJLHVCQUFxQixFQUFyQjtBQUVBRCxrQkFBZ0IsS0FBaEI7QUFDQW5FLFVBQVFDLEdBQVIsQ0FBWSxpQkFBWjs7QUFDQTFCLElBQUUrRSxJQUFGLENBQU9lLGNBQVAsRUFBdUIsVUFBQ0ssU0FBRDtBQUN0QixRQUFBQyxNQUFBLEVBQUFDLE1BQUEsRUFBQWhCLE9BQUE7QUFBQWdCLGFBQVNGLFVBQVVwQyxHQUFuQjtBQUNBLFdBQU9vQyxVQUFVcEMsR0FBakI7QUFDQW9DLGNBQVVsQyxLQUFWLEdBQWtCYixRQUFsQjtBQUNBK0MsY0FBVUYsS0FBVixHQUFrQjNDLE1BQWxCO0FBQ0E2QyxjQUFVNUUsV0FBVixHQUF3QmtFLE9BQU9wRyxJQUEvQjs7QUFDQSxRQUFHSCxRQUFRb0gsWUFBUixDQUFxQkgsU0FBckIsQ0FBSDtBQUNDUCxzQkFBZ0IsSUFBaEI7QUNRRTs7QUROSCxRQUFHTyxVQUFVdEIsT0FBYjtBQUNDc0IsZ0JBQVV0QixPQUFWLEdBQW9CRCxpQkFBaUJ1QixVQUFVdEIsT0FBM0IsQ0FBcEI7QUNRRTs7QUROSCxRQUFHM0YsUUFBUXFILFNBQVIsQ0FBa0JKLFNBQWxCLEtBQWdDakgsUUFBUW9ILFlBQVIsQ0FBcUJILFNBQXJCLENBQW5DO0FBR0NkLGdCQUFVO0FBQUNtQixjQUFNTDtBQUFQLE9BQVY7O0FBRUEsVUFBRyxDQUFDQSxVQUFVbkYsT0FBZDtBQUNDcUUsZ0JBQVFvQixNQUFSLEdBQWlCO0FBQUN6RixtQkFBUztBQUFWLFNBQWpCO0FDU0c7O0FBQ0QsYURSSDlCLFFBQVEyRSxhQUFSLENBQXNCLGtCQUF0QixFQUEwQzZDLE1BQTFDLENBQWlEO0FBQUNuRixxQkFBYWtFLE9BQU9wRyxJQUFyQjtBQUEyQkEsY0FBTThHLFVBQVU5RyxJQUEzQztBQUFpRDRFLGVBQU9iO0FBQXhELE9BQWpELEVBQW9IaUMsT0FBcEgsQ0NRRztBRGhCSjtBQVVDZSxlQUFTbEgsUUFBUTJFLGFBQVIsQ0FBc0Isa0JBQXRCLEVBQTBDcUMsTUFBMUMsQ0FBaURDLFNBQWpELENBQVQ7QUNhRyxhRFpIVCxtQkFBbUJELE9BQU9wRyxJQUFQLEdBQWMsR0FBZCxHQUFvQmdILE1BQXZDLElBQWlERCxNQ1k5QztBQUNEO0FEcENKOztBQXlCQSxNQUFHLENBQUNSLGFBQUo7QUFDQzFHLFlBQVEyRSxhQUFSLENBQXNCLGtCQUF0QixFQUEwQzhDLE1BQTFDLENBQWlEO0FBQUN0SCxZQUFNLFFBQVA7QUFBaUI0RSxhQUFPYixRQUF4QjtBQUFrQzdCLG1CQUFha0UsT0FBT3BHLElBQXREO0FBQTRENEcsYUFBTzNDO0FBQW5FLEtBQWpEO0FDbUJDOztBRGxCRjdCLFVBQVFDLEdBQVIsQ0FBWSxTQUFaO0FBR0FpRSxnQkFBYyxFQUFkOztBQUVBM0YsSUFBRStFLElBQUYsQ0FBT3RGLE1BQVAsRUFBZSxVQUFDMEYsS0FBRCxFQUFRL0UsQ0FBUjtBQUNkLFdBQU8rRSxNQUFNcEIsR0FBYjtBQUNBb0IsVUFBTWxCLEtBQU4sR0FBY2IsUUFBZDtBQUNBK0IsVUFBTWMsS0FBTixHQUFjM0MsTUFBZDtBQUNBNkIsVUFBTU0sTUFBTixHQUFlQSxPQUFPcEcsSUFBdEI7O0FBRUEsUUFBRzhGLE1BQU1FLE9BQVQ7QUFDQ0YsWUFBTUUsT0FBTixHQUFnQlYsc0JBQXNCUSxNQUFNRSxPQUE1QixDQUFoQjtBQ2dCRTs7QURkSCxRQUFHLENBQUNyRixFQUFFc0YsR0FBRixDQUFNSCxLQUFOLEVBQWEsTUFBYixDQUFKO0FBQ0NBLFlBQU05RixJQUFOLEdBQWFlLENBQWI7QUNnQkU7O0FEZEh1RixnQkFBWXRGLElBQVosQ0FBaUI4RSxNQUFNOUYsSUFBdkI7O0FBRUEsUUFBRzhGLE1BQU05RixJQUFOLEtBQWMsTUFBakI7QUFFQ0gsY0FBUTJFLGFBQVIsQ0FBc0IsZUFBdEIsRUFBdUM2QyxNQUF2QyxDQUE4QztBQUFDakIsZ0JBQVFBLE9BQU9wRyxJQUFoQjtBQUFzQkEsY0FBTSxNQUE1QjtBQUFvQzRFLGVBQU9iO0FBQTNDLE9BQTlDLEVBQW9HO0FBQUNvRCxjQUFNckI7QUFBUCxPQUFwRztBQUZEO0FBSUNqRyxjQUFRMkUsYUFBUixDQUFzQixlQUF0QixFQUF1Q3FDLE1BQXZDLENBQThDZixLQUE5QztBQ29CRTs7QURsQkgsUUFBRyxDQUFDbkYsRUFBRTRHLFFBQUYsQ0FBV2pCLFdBQVgsRUFBd0IsTUFBeEIsQ0FBSjtBQ29CSSxhRG5CSHpHLFFBQVEyRSxhQUFSLENBQXNCLGVBQXRCLEVBQXVDZ0QsTUFBdkMsQ0FBOENGLE1BQTlDLENBQXFEO0FBQUNsQixnQkFBUUEsT0FBT3BHLElBQWhCO0FBQXNCQSxjQUFNLE1BQTVCO0FBQW9DNEUsZUFBT2I7QUFBM0MsT0FBckQsQ0NtQkc7QUFLRDtBRDdDSjs7QUF1QkEzQixVQUFRQyxHQUFSLENBQVksUUFBWjs7QUFFQTFCLElBQUUrRSxJQUFGLENBQU9nQixRQUFQLEVBQWlCLFVBQUNlLE9BQUQsRUFBVTFHLENBQVY7QUFDaEIsV0FBTzJGLFNBQVNoQyxHQUFoQjtBQUNBK0MsWUFBUTdDLEtBQVIsR0FBZ0JiLFFBQWhCO0FBQ0EwRCxZQUFRYixLQUFSLEdBQWdCM0MsTUFBaEI7QUFDQXdELFlBQVFyQixNQUFSLEdBQWlCQSxPQUFPcEcsSUFBeEI7O0FBQ0EsUUFBRyxDQUFDVyxFQUFFc0YsR0FBRixDQUFNd0IsT0FBTixFQUFlLE1BQWYsQ0FBSjtBQUNDQSxjQUFRekgsSUFBUixHQUFlZSxFQUFFMkcsT0FBRixDQUFVLElBQUlDLE1BQUosQ0FBVyxLQUFYLEVBQWtCLEdBQWxCLENBQVYsRUFBa0MsR0FBbEMsQ0FBZjtBQ3dCRTs7QUR0QkgsUUFBRyxDQUFDaEgsRUFBRXNGLEdBQUYsQ0FBTXdCLE9BQU4sRUFBZSxXQUFmLENBQUo7QUFDQ0EsY0FBUUcsU0FBUixHQUFvQixJQUFwQjtBQ3dCRTs7QUFDRCxXRHZCRi9ILFFBQVEyRSxhQUFSLENBQXNCLGlCQUF0QixFQUF5Q3FDLE1BQXpDLENBQWdEWSxPQUFoRCxDQ3VCRTtBRGxDSDs7QUFZQXJGLFVBQVFDLEdBQVIsQ0FBWSxPQUFaOztBQUVBMUIsSUFBRStFLElBQUYsQ0FBTzdELE9BQVAsRUFBZ0IsVUFBQ2dHLE1BQUQsRUFBUzlHLENBQVQ7QUFDZixXQUFPOEcsT0FBT25ELEdBQWQ7QUFDQW1ELFdBQU9qRCxLQUFQLEdBQWViLFFBQWY7QUFDQThELFdBQU9qQixLQUFQLEdBQWUzQyxNQUFmO0FBQ0E0RCxXQUFPekIsTUFBUCxHQUFnQkEsT0FBT3BHLElBQXZCOztBQUNBLFFBQUcsQ0FBQ1csRUFBRXNGLEdBQUYsQ0FBTTRCLE1BQU4sRUFBYyxNQUFkLENBQUo7QUFDQ0EsYUFBTzdILElBQVAsR0FBY2UsRUFBRTJHLE9BQUYsQ0FBVSxJQUFJQyxNQUFKLENBQVcsS0FBWCxFQUFrQixHQUFsQixDQUFWLEVBQWtDLEdBQWxDLENBQWQ7QUN3QkU7O0FEdkJILFFBQUcsQ0FBQ2hILEVBQUVzRixHQUFGLENBQU00QixNQUFOLEVBQWMsV0FBZCxDQUFKO0FBQ0NBLGFBQU9ELFNBQVAsR0FBbUIsSUFBbkI7QUN5QkU7O0FBQ0QsV0R6QkYvSCxRQUFRMkUsYUFBUixDQUFzQixnQkFBdEIsRUFBd0NxQyxNQUF4QyxDQUErQ2dCLE1BQS9DLENDeUJFO0FEbENIOztBQ29DQyxTRHpCRHpGLFFBQVFDLEdBQVIsQ0FBWSxzREFBWixFQUFvRStELE9BQU9wRyxJQUEzRSxDQ3lCQztBRG5JcUIsQ0FBdkI7O0FBNEdBSCxRQUFRaUksa0JBQVIsR0FBNkIsVUFBQzdELE1BQUQsRUFBU0YsUUFBVCxFQUFtQmdFLFFBQW5CLEVBQTZCQyxhQUE3QjtBQUM1QixNQUFBQyxZQUFBLEVBQUFDLFdBQUEsRUFBQUMsZ0JBQUEsRUFBQTlCLGtCQUFBLEVBQUErQixZQUFBLEVBQUFDLHNCQUFBLEVBQUFDLGtCQUFBOztBQUFBLE1BQUcsQ0FBQ3JFLE1BQUo7QUFDQyxVQUFNLElBQUkzQixPQUFPaUcsS0FBWCxDQUFpQixLQUFqQixFQUF3Qix1REFBeEIsQ0FBTjtBQzRCQzs7QUQxQkYsTUFBRyxDQUFDMUksUUFBUTBFLFlBQVIsQ0FBcUJSLFFBQXJCLEVBQStCRSxNQUEvQixDQUFKO0FBQ0MsVUFBTSxJQUFJM0IsT0FBT2lHLEtBQVgsQ0FBaUIsS0FBakIsRUFBd0Isb0JBQXhCLENBQU47QUM0QkMsR0RqQzBCLENBTzVCOztBQUNBQyxRQUFNVCxRQUFOLEVBQWdCVSxNQUFoQjs7QUFDQSxNQUFHLENBQUNULGFBQUo7QUFFQ0Usa0JBQWN2SCxFQUFFK0gsS0FBRixDQUFRWCxTQUFTekgsSUFBakIsRUFBdUIsS0FBdkIsQ0FBZDs7QUFDQSxRQUFHSyxFQUFFaUYsT0FBRixDQUFVbUMsU0FBU3pILElBQW5CLEtBQTRCeUgsU0FBU3pILElBQVQsQ0FBY3VGLE1BQWQsR0FBdUIsQ0FBdEQ7QUFDQ2xGLFFBQUUrRSxJQUFGLENBQU9xQyxTQUFTekgsSUFBaEIsRUFBc0IsVUFBQ3FJLEdBQUQ7QUFDckIsWUFBR2hJLEVBQUVpSSxPQUFGLENBQVVqSSxFQUFFa0ksSUFBRixDQUFPaEosUUFBUWdCLElBQWYsQ0FBVixFQUFnQzhILElBQUlqRSxHQUFwQyxDQUFIO0FBQ0MsZ0JBQU0sSUFBSXBDLE9BQU9pRyxLQUFYLENBQWlCLEtBQWpCLEVBQXdCLFFBQU1JLElBQUkzSSxJQUFWLEdBQWUsTUFBdkMsQ0FBTjtBQzRCSTtBRDlCTjtBQ2dDRTs7QUQzQkgsUUFBR1csRUFBRWlGLE9BQUYsQ0FBVW1DLFNBQVM1RyxPQUFuQixLQUErQjRHLFNBQVM1RyxPQUFULENBQWlCMEUsTUFBakIsR0FBMEIsQ0FBNUQ7QUFDQ2xGLFFBQUUrRSxJQUFGLENBQU9xQyxTQUFTNUcsT0FBaEIsRUFBeUIsVUFBQ2lGLE1BQUQ7QUFDeEIsWUFBR3pGLEVBQUVpSSxPQUFGLENBQVVqSSxFQUFFa0ksSUFBRixDQUFPaEosUUFBUUMsT0FBZixDQUFWLEVBQW1Dc0csT0FBT3BHLElBQTFDLENBQUg7QUFDQyxnQkFBTSxJQUFJc0MsT0FBT2lHLEtBQVgsQ0FBaUIsS0FBakIsRUFBd0IsUUFBTW5DLE9BQU9wRyxJQUFiLEdBQWtCLE1BQTFDLENBQU47QUM2Qkk7O0FBQ0QsZUQ3QkpXLEVBQUUrRSxJQUFGLENBQU9VLE9BQU9NLFFBQWQsRUFBd0IsVUFBQ2UsT0FBRDtBQUN2QixjQUFHQSxRQUFRekYsRUFBUixLQUFjLFFBQWQsSUFBMEIsQ0FBQ2dCLFFBQVE4RixjQUFSLENBQXVCL0UsUUFBdkIsRUFBZ0MscUJBQWhDLENBQTlCO0FBQ0Msa0JBQU0sSUFBSXpCLE9BQU9pRyxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGtCQUF0QixDQUFOO0FDOEJLO0FEaENQLFVDNkJJO0FEaENMO0FDc0NFOztBRC9CSEosdUJBQW1CeEgsRUFBRStILEtBQUYsQ0FBUVgsU0FBUzVHLE9BQWpCLEVBQTBCLE1BQTFCLENBQW5CO0FBQ0FpSCxtQkFBZXpILEVBQUVrSSxJQUFGLENBQU9oSixRQUFRQyxPQUFmLENBQWY7O0FBR0EsUUFBR2EsRUFBRWlGLE9BQUYsQ0FBVW1DLFNBQVN6SCxJQUFuQixLQUE0QnlILFNBQVN6SCxJQUFULENBQWN1RixNQUFkLEdBQXVCLENBQXREO0FBQ0NsRixRQUFFK0UsSUFBRixDQUFPcUMsU0FBU3pILElBQWhCLEVBQXNCLFVBQUNxSSxHQUFEO0FDK0JqQixlRDlCSmhJLEVBQUUrRSxJQUFGLENBQU9pRCxJQUFJeEgsT0FBWCxFQUFvQixVQUFDZSxXQUFEO0FBQ25CLGNBQUcsQ0FBQ3ZCLEVBQUVpSSxPQUFGLENBQVVSLFlBQVYsRUFBd0JsRyxXQUF4QixDQUFELElBQXlDLENBQUN2QixFQUFFaUksT0FBRixDQUFVVCxnQkFBVixFQUE0QmpHLFdBQTVCLENBQTdDO0FBQ0Msa0JBQU0sSUFBSUksT0FBT2lHLEtBQVgsQ0FBaUIsS0FBakIsRUFBd0IsUUFBTUksSUFBSTNJLElBQVYsR0FBZSxVQUFmLEdBQXlCa0MsV0FBekIsR0FBcUMsTUFBN0QsQ0FBTjtBQytCSztBRGpDUCxVQzhCSTtBRC9CTDtBQ3FDRTs7QUQvQkgsUUFBR3ZCLEVBQUVpRixPQUFGLENBQVVtQyxTQUFTMUcsVUFBbkIsS0FBa0MwRyxTQUFTMUcsVUFBVCxDQUFvQndFLE1BQXBCLEdBQTZCLENBQWxFO0FBQ0NsRixRQUFFK0UsSUFBRixDQUFPcUMsU0FBUzFHLFVBQWhCLEVBQTRCLFVBQUN5RixTQUFEO0FBQzNCLFlBQUcsQ0FBQ0EsVUFBVTVFLFdBQVgsSUFBMEIsQ0FBQ3ZCLEVBQUVvSSxRQUFGLENBQVdqQyxVQUFVNUUsV0FBckIsQ0FBOUI7QUFDQyxnQkFBTSxJQUFJSSxPQUFPaUcsS0FBWCxDQUFpQixLQUFqQixFQUF3QixVQUFRekIsVUFBVTlHLElBQWxCLEdBQXVCLG1CQUEvQyxDQUFOO0FDaUNJOztBRGhDTCxZQUFHLENBQUNXLEVBQUVpSSxPQUFGLENBQVVSLFlBQVYsRUFBd0J0QixVQUFVNUUsV0FBbEMsQ0FBRCxJQUFtRCxDQUFDdkIsRUFBRWlJLE9BQUYsQ0FBVVQsZ0JBQVYsRUFBNEJyQixVQUFVNUUsV0FBdEMsQ0FBdkQ7QUFDQyxnQkFBTSxJQUFJSSxPQUFPaUcsS0FBWCxDQUFpQixLQUFqQixFQUF3QixVQUFRekIsVUFBVTlHLElBQWxCLEdBQXVCLFVBQXZCLEdBQWlDOEcsVUFBVTVFLFdBQTNDLEdBQXVELE1BQS9FLENBQU47QUNrQ0k7QUR0Q047QUN3Q0U7O0FEakNIb0cseUJBQXFCM0gsRUFBRStILEtBQUYsQ0FBUVgsU0FBU3hHLGNBQWpCLEVBQWlDLEtBQWpDLENBQXJCOztBQUNBLFFBQUdaLEVBQUVpRixPQUFGLENBQVVtQyxTQUFTeEcsY0FBbkIsS0FBc0N3RyxTQUFTeEcsY0FBVCxDQUF3QnNFLE1BQXhCLEdBQWlDLENBQTFFO0FBQ0NsRixRQUFFK0UsSUFBRixDQUFPcUMsU0FBU3hHLGNBQWhCLEVBQWdDLFVBQUNBLGNBQUQ7QUFDL0IsWUFBRzFCLFFBQVEyRSxhQUFSLENBQXNCLGdCQUF0QixFQUF3Q0MsT0FBeEMsQ0FBZ0Q7QUFBQ0csaUJBQU9iLFFBQVI7QUFBa0IvRCxnQkFBTXVCLGVBQWV2QjtBQUF2QyxTQUFoRCxFQUE2RjtBQUFDSSxrQkFBTztBQUFDc0UsaUJBQUk7QUFBTDtBQUFSLFNBQTdGLENBQUg7QUFDQyxnQkFBTSxJQUFJcEMsT0FBT2lHLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsV0FBU2hILGVBQWV2QixJQUF4QixHQUE2QixPQUFuRCxDQUFOO0FDMENJOztBQUNELGVEMUNKVyxFQUFFK0UsSUFBRixDQUFPbkUsZUFBZXlILGFBQXRCLEVBQXFDLFVBQUNDLE1BQUQ7QUFDcEMsY0FBRyxDQUFDdEksRUFBRWlJLE9BQUYsQ0FBVWpJLEVBQUVrSSxJQUFGLENBQU9oSixRQUFRZ0IsSUFBZixDQUFWLEVBQWdDb0ksTUFBaEMsQ0FBRCxJQUE0QyxDQUFDdEksRUFBRWlJLE9BQUYsQ0FBVVYsV0FBVixFQUF1QmUsTUFBdkIsQ0FBaEQ7QUFDQyxrQkFBTSxJQUFJM0csT0FBT2lHLEtBQVgsQ0FBaUIsS0FBakIsRUFBd0IsU0FBT2hILGVBQWV2QixJQUF0QixHQUEyQixTQUEzQixHQUFvQ2lKLE1BQXBDLEdBQTJDLE1BQW5FLENBQU47QUMyQ0s7QUQ3Q1AsVUMwQ0k7QUQ3Q0w7QUNtREU7O0FEM0NILFFBQUd0SSxFQUFFaUYsT0FBRixDQUFVbUMsU0FBU3ZHLGtCQUFuQixLQUEwQ3VHLFNBQVN2RyxrQkFBVCxDQUE0QnFFLE1BQTVCLEdBQXFDLENBQWxGO0FBQ0NsRixRQUFFK0UsSUFBRixDQUFPcUMsU0FBU3ZHLGtCQUFoQixFQUFvQyxVQUFDMEgsaUJBQUQ7QUFDbkMsWUFBRyxDQUFDQSxrQkFBa0JoSCxXQUFuQixJQUFrQyxDQUFDdkIsRUFBRW9JLFFBQUYsQ0FBV0csa0JBQWtCaEgsV0FBN0IsQ0FBdEM7QUFDQyxnQkFBTSxJQUFJSSxPQUFPaUcsS0FBWCxDQUFpQixLQUFqQixFQUF3QixTQUFPVyxrQkFBa0JsSixJQUF6QixHQUE4QixtQkFBdEQsQ0FBTjtBQzZDSTs7QUQ1Q0wsWUFBRyxDQUFDVyxFQUFFaUksT0FBRixDQUFVUixZQUFWLEVBQXdCYyxrQkFBa0JoSCxXQUExQyxDQUFELElBQTJELENBQUN2QixFQUFFaUksT0FBRixDQUFVVCxnQkFBVixFQUE0QmUsa0JBQWtCaEgsV0FBOUMsQ0FBL0Q7QUFDQyxnQkFBTSxJQUFJSSxPQUFPaUcsS0FBWCxDQUFpQixLQUFqQixFQUF3QixTQUFPekIsVUFBVTlHLElBQWpCLEdBQXNCLFVBQXRCLEdBQWdDa0osa0JBQWtCaEgsV0FBbEQsR0FBOEQsTUFBdEYsQ0FBTjtBQzhDSTs7QUQ1Q0wsWUFBRyxDQUFDdkIsRUFBRXNGLEdBQUYsQ0FBTWlELGlCQUFOLEVBQXlCLG1CQUF6QixDQUFELElBQWtELENBQUN2SSxFQUFFb0ksUUFBRixDQUFXRyxrQkFBa0JDLGlCQUE3QixDQUF0RDtBQUNDLGdCQUFNLElBQUk3RyxPQUFPaUcsS0FBWCxDQUFpQixLQUFqQixFQUF3QixTQUFPVyxrQkFBa0JsSixJQUF6QixHQUE4Qix5QkFBdEQsQ0FBTjtBQURELGVBRUssSUFBRyxDQUFDVyxFQUFFaUksT0FBRixDQUFVTixrQkFBVixFQUE4Qlksa0JBQWtCQyxpQkFBaEQsQ0FBSjtBQUNKLGdCQUFNLElBQUk3RyxPQUFPaUcsS0FBWCxDQUFpQixLQUFqQixFQUF3QixTQUFPVyxrQkFBa0JsSixJQUF6QixHQUE4QixVQUE5QixHQUF3Q2tKLGtCQUFrQkMsaUJBQTFELEdBQTRFLHdCQUFwRyxDQUFOO0FDOENJO0FEdkROO0FDeURFOztBRDdDSCxRQUFHeEksRUFBRWlGLE9BQUYsQ0FBVW1DLFNBQVN0RyxPQUFuQixLQUErQnNHLFNBQVN0RyxPQUFULENBQWlCb0UsTUFBakIsR0FBMEIsQ0FBNUQ7QUFDQ2xGLFFBQUUrRSxJQUFGLENBQU9xQyxTQUFTdEcsT0FBaEIsRUFBeUIsVUFBQzJILE1BQUQ7QUFDeEIsWUFBRyxDQUFDQSxPQUFPbEgsV0FBUixJQUF1QixDQUFDdkIsRUFBRW9JLFFBQUYsQ0FBV0ssT0FBT2xILFdBQWxCLENBQTNCO0FBQ0MsZ0JBQU0sSUFBSUksT0FBT2lHLEtBQVgsQ0FBaUIsS0FBakIsRUFBd0IsUUFBTWEsT0FBT3BKLElBQWIsR0FBa0IsbUJBQTFDLENBQU47QUMrQ0k7O0FEOUNMLFlBQUcsQ0FBQ1csRUFBRWlJLE9BQUYsQ0FBVVIsWUFBVixFQUF3QmdCLE9BQU9sSCxXQUEvQixDQUFELElBQWdELENBQUN2QixFQUFFaUksT0FBRixDQUFVVCxnQkFBVixFQUE0QmlCLE9BQU9sSCxXQUFuQyxDQUFwRDtBQUNDLGdCQUFNLElBQUlJLE9BQU9pRyxLQUFYLENBQWlCLEtBQWpCLEVBQXdCLFFBQU1hLE9BQU9wSixJQUFiLEdBQWtCLFVBQWxCLEdBQTRCb0osT0FBT2xILFdBQW5DLEdBQStDLE1BQXZFLENBQU47QUNnREk7QURwRE47QUE1REY7QUNtSEUsR0Q1SDBCLENBMkU1QixZQTNFNEIsQ0E2RTVCOztBQUdBK0YsaUJBQWUsRUFBZjtBQUNBNUIsdUJBQXFCLEVBQXJCO0FBQ0FnQywyQkFBeUIsRUFBekI7O0FBR0EsTUFBRzFILEVBQUVpRixPQUFGLENBQVVtQyxTQUFTekgsSUFBbkIsS0FBNEJ5SCxTQUFTekgsSUFBVCxDQUFjdUYsTUFBZCxHQUF1QixDQUF0RDtBQUNDbEYsTUFBRStFLElBQUYsQ0FBT3FDLFNBQVN6SCxJQUFoQixFQUFzQixVQUFDcUksR0FBRDtBQUNyQixVQUFBNUIsTUFBQSxFQUFBQyxNQUFBO0FBQUFBLGVBQVMyQixJQUFJakUsR0FBYjtBQUNBLGFBQU9pRSxJQUFJakUsR0FBWDtBQUNBaUUsVUFBSS9ELEtBQUosR0FBWWIsUUFBWjtBQUNBNEUsVUFBSS9CLEtBQUosR0FBWTNDLE1BQVo7QUFDQTBFLFVBQUlVLFVBQUosR0FBaUIsSUFBakI7QUFDQXRDLGVBQVNsSCxRQUFRMkUsYUFBUixDQUFzQixNQUF0QixFQUE4QnFDLE1BQTlCLENBQXFDOEIsR0FBckMsQ0FBVDtBQ2lERyxhRGhESFYsYUFBYWpCLE1BQWIsSUFBdUJELE1DZ0RwQjtBRHZESjtBQ3lEQzs7QUQvQ0YsTUFBR3BHLEVBQUVpRixPQUFGLENBQVVtQyxTQUFTNUcsT0FBbkIsS0FBK0I0RyxTQUFTNUcsT0FBVCxDQUFpQjBFLE1BQWpCLEdBQTBCLENBQTVEO0FBQ0NsRixNQUFFK0UsSUFBRixDQUFPcUMsU0FBUzVHLE9BQWhCLEVBQXlCLFVBQUNpRixNQUFEO0FDaURyQixhRGhESHZHLFFBQVFzRyxZQUFSLENBQXFCbEMsTUFBckIsRUFBNkJGLFFBQTdCLEVBQXVDcUMsTUFBdkMsRUFBK0NDLGtCQUEvQyxDQ2dERztBRGpESjtBQ21EQzs7QUQvQ0YsTUFBRzFGLEVBQUVpRixPQUFGLENBQVVtQyxTQUFTMUcsVUFBbkIsS0FBa0MwRyxTQUFTMUcsVUFBVCxDQUFvQndFLE1BQXBCLEdBQTZCLENBQWxFO0FBQ0NsRixNQUFFK0UsSUFBRixDQUFPcUMsU0FBUzFHLFVBQWhCLEVBQTRCLFVBQUN5RixTQUFEO0FBQzNCLFVBQUF3QyxVQUFBLEVBQUF2QyxNQUFBLEVBQUFDLE1BQUE7O0FBQUFBLGVBQVNGLFVBQVVwQyxHQUFuQjtBQUNBLGFBQU9vQyxVQUFVcEMsR0FBakI7QUFFQW9DLGdCQUFVbEMsS0FBVixHQUFrQmIsUUFBbEI7QUFDQStDLGdCQUFVRixLQUFWLEdBQWtCM0MsTUFBbEI7O0FBQ0EsVUFBR3BFLFFBQVFxSCxTQUFSLENBQWtCSixTQUFsQixLQUFnQ2pILFFBQVFvSCxZQUFSLENBQXFCSCxTQUFyQixDQUFuQztBQUVDd0MscUJBQWF6SixRQUFRMkUsYUFBUixDQUFzQixrQkFBdEIsRUFBMENDLE9BQTFDLENBQWtEO0FBQUN2Qyx1QkFBYTRFLFVBQVU1RSxXQUF4QjtBQUFxQ2xDLGdCQUFNOEcsVUFBVTlHLElBQXJEO0FBQTJENEUsaUJBQU9iO0FBQWxFLFNBQWxELEVBQThIO0FBQUMzRCxrQkFBUTtBQUFDc0UsaUJBQUs7QUFBTjtBQUFULFNBQTlILENBQWI7O0FBQ0EsWUFBRzRFLFVBQUg7QUFDQ3ZDLG1CQUFTdUMsV0FBVzVFLEdBQXBCO0FDd0RJOztBRHZETDdFLGdCQUFRMkUsYUFBUixDQUFzQixrQkFBdEIsRUFBMEM2QyxNQUExQyxDQUFpRDtBQUFDbkYsdUJBQWE0RSxVQUFVNUUsV0FBeEI7QUFBcUNsQyxnQkFBTThHLFVBQVU5RyxJQUFyRDtBQUEyRDRFLGlCQUFPYjtBQUFsRSxTQUFqRCxFQUE4SDtBQUFDb0QsZ0JBQU1MO0FBQVAsU0FBOUg7QUFMRDtBQU9DQyxpQkFBU2xILFFBQVEyRSxhQUFSLENBQXNCLGtCQUF0QixFQUEwQ3FDLE1BQTFDLENBQWlEQyxTQUFqRCxDQUFUO0FDK0RHOztBQUNELGFEOURIVCxtQkFBbUJTLFVBQVU1RSxXQUFWLEdBQXdCLEdBQXhCLEdBQThCOEUsTUFBakQsSUFBMkRELE1DOER4RDtBRDdFSjtBQytFQzs7QUQ3REYsTUFBR3BHLEVBQUVpRixPQUFGLENBQVVtQyxTQUFTeEcsY0FBbkIsS0FBc0N3RyxTQUFTeEcsY0FBVCxDQUF3QnNFLE1BQXhCLEdBQWlDLENBQTFFO0FBQ0NsRixNQUFFK0UsSUFBRixDQUFPcUMsU0FBU3hHLGNBQWhCLEVBQWdDLFVBQUNBLGNBQUQ7QUFDL0IsVUFBQXlILGFBQUEsRUFBQWpDLE1BQUEsRUFBQUMsTUFBQSxFQUFBdUMsb0JBQUE7QUFBQXZDLGVBQVN6RixlQUFlbUQsR0FBeEI7QUFDQSxhQUFPbkQsZUFBZW1ELEdBQXRCO0FBRUFuRCxxQkFBZXFELEtBQWYsR0FBdUJiLFFBQXZCO0FBQ0F4QyxxQkFBZXFGLEtBQWYsR0FBdUIzQyxNQUF2QjtBQUVBc0YsNkJBQXVCLEVBQXZCOztBQUNBNUksUUFBRStFLElBQUYsQ0FBT25FLGVBQWVpSSxLQUF0QixFQUE2QixVQUFDQyxPQUFEO0FBQzVCLFlBQUF6RixVQUFBO0FBQUFBLHFCQUFhbkUsUUFBUTJFLGFBQVIsQ0FBc0IsYUFBdEIsRUFBcUNDLE9BQXJDLENBQTZDO0FBQUNHLGlCQUFPYixRQUFSO0FBQWtCWSxnQkFBTThFO0FBQXhCLFNBQTdDLEVBQStFO0FBQUNySixrQkFBUTtBQUFDc0UsaUJBQUs7QUFBTjtBQUFULFNBQS9FLENBQWI7O0FBQ0EsWUFBR1YsVUFBSDtBQ3NFTSxpQkRyRUx1RixxQkFBcUJ2SSxJQUFyQixDQUEwQnlJLE9BQTFCLENDcUVLO0FBQ0Q7QUR6RU47O0FBS0FULHNCQUFnQixFQUFoQjs7QUFDQXJJLFFBQUUrRSxJQUFGLENBQU9uRSxlQUFleUgsYUFBdEIsRUFBcUMsVUFBQ0MsTUFBRDtBQUNwQyxZQUFHdEksRUFBRWlJLE9BQUYsQ0FBVWpJLEVBQUVrSSxJQUFGLENBQU9oSixRQUFRZ0IsSUFBZixDQUFWLEVBQWdDb0ksTUFBaEMsQ0FBSDtBQ3VFTSxpQkR0RUxELGNBQWNoSSxJQUFkLENBQW1CaUksTUFBbkIsQ0NzRUs7QUR2RU4sZUFFSyxJQUFHaEIsYUFBYWdCLE1BQWIsQ0FBSDtBQ3VFQyxpQkR0RUxELGNBQWNoSSxJQUFkLENBQW1CaUgsYUFBYWdCLE1BQWIsQ0FBbkIsQ0NzRUs7QUFDRDtBRDNFTjs7QUFPQWxDLGVBQVNsSCxRQUFRMkUsYUFBUixDQUFzQixnQkFBdEIsRUFBd0NxQyxNQUF4QyxDQUErQ3RGLGNBQS9DLENBQVQ7QUN1RUcsYURyRUg4Ryx1QkFBdUJyQixNQUF2QixJQUFpQ0QsTUNxRTlCO0FENUZKO0FDOEZDOztBRHBFRixNQUFHcEcsRUFBRWlGLE9BQUYsQ0FBVW1DLFNBQVN2RyxrQkFBbkIsS0FBMEN1RyxTQUFTdkcsa0JBQVQsQ0FBNEJxRSxNQUE1QixHQUFxQyxDQUFsRjtBQUNDbEYsTUFBRStFLElBQUYsQ0FBT3FDLFNBQVN2RyxrQkFBaEIsRUFBb0MsVUFBQzBILGlCQUFEO0FBQ25DLFVBQUFRLG1CQUFBO0FBQUEsYUFBT1Isa0JBQWtCeEUsR0FBekI7QUFFQXdFLHdCQUFrQnRFLEtBQWxCLEdBQTBCYixRQUExQjtBQUNBbUYsd0JBQWtCdEMsS0FBbEIsR0FBMEIzQyxNQUExQjtBQUVBaUYsd0JBQWtCQyxpQkFBbEIsR0FBc0NkLHVCQUF1QmEsa0JBQWtCQyxpQkFBekMsQ0FBdEM7QUFFQU8sNEJBQXNCLEVBQXRCOztBQUNBL0ksUUFBRStFLElBQUYsQ0FBT3dELGtCQUFrQlEsbUJBQXpCLEVBQThDLFVBQUNDLFlBQUQ7QUFDN0MsWUFBQUMsV0FBQTtBQUFBQSxzQkFBY3ZELG1CQUFtQjZDLGtCQUFrQmhILFdBQWxCLEdBQWdDLEdBQWhDLEdBQXNDeUgsWUFBekQsQ0FBZDs7QUFDQSxZQUFHQyxXQUFIO0FDcUVNLGlCRHBFTEYsb0JBQW9CMUksSUFBcEIsQ0FBeUI0SSxXQUF6QixDQ29FSztBQUNEO0FEeEVOOztBQzBFRyxhRHJFSC9KLFFBQVEyRSxhQUFSLENBQXNCLG9CQUF0QixFQUE0Q3FDLE1BQTVDLENBQW1EcUMsaUJBQW5ELENDcUVHO0FEbkZKO0FDcUZDOztBRHBFRixNQUFHdkksRUFBRWlGLE9BQUYsQ0FBVW1DLFNBQVN0RyxPQUFuQixLQUErQnNHLFNBQVN0RyxPQUFULENBQWlCb0UsTUFBakIsR0FBMEIsQ0FBNUQ7QUNzRUcsV0RyRUZsRixFQUFFK0UsSUFBRixDQUFPcUMsU0FBU3RHLE9BQWhCLEVBQXlCLFVBQUMySCxNQUFEO0FBQ3hCLGFBQU9BLE9BQU8xRSxHQUFkO0FBRUEwRSxhQUFPeEUsS0FBUCxHQUFlYixRQUFmO0FBQ0FxRixhQUFPeEMsS0FBUCxHQUFlM0MsTUFBZjtBQ3FFRyxhRG5FSHBFLFFBQVEyRSxhQUFSLENBQXNCLFNBQXRCLEVBQWlDcUMsTUFBakMsQ0FBd0N1QyxNQUF4QyxDQ21FRztBRHpFSixNQ3FFRTtBQU1ELEdEalAwQixDQTZLNUI7QUE3SzRCLENBQTdCLEMsQ0ErS0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkE5RyxPQUFPdUgsT0FBUCxDQUNDO0FBQUEsd0JBQXNCLFVBQUM5RixRQUFELEVBQVdnRSxRQUFYO0FBQ3JCLFFBQUE5RCxNQUFBO0FBQUFBLGFBQVMsS0FBS0EsTUFBZDtBQzBFRSxXRHpFRnBFLFFBQVFpSSxrQkFBUixDQUEyQjdELE1BQTNCLEVBQW1DRixRQUFuQyxFQUE2Q2dFLFFBQTdDLENDeUVFO0FEM0VIO0FBQUEsQ0FERCxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFcFVBekYsT0FBT3VILE9BQVAsQ0FDQztBQUFBLCtCQUE2QixVQUFDN0QsT0FBRDtBQUM1QixRQUFBOEQsVUFBQSxFQUFBbEcsQ0FBQSxFQUFBbUcsY0FBQSxFQUFBM0QsTUFBQSxFQUFBNEQsS0FBQSxFQUFBQyxhQUFBLEVBQUFDLE9BQUEsRUFBQUMsR0FBQSxFQUFBQyxJQUFBLEVBQUFDLE9BQUEsRUFBQUMsZUFBQSxFQUFBQyxRQUFBLEVBQUFDLElBQUE7O0FBQUEsUUFBQXhFLFdBQUEsUUFBQW1FLE1BQUFuRSxRQUFBMUIsTUFBQSxZQUFBNkYsSUFBb0I1SixZQUFwQixHQUFvQixNQUFwQixHQUFvQixNQUFwQjtBQUVDNkYsZUFBU3ZHLFFBQVE0SyxTQUFSLENBQWtCekUsUUFBUTFCLE1BQVIsQ0FBZS9ELFlBQWpDLENBQVQ7QUFFQXdKLHVCQUFpQjNELE9BQU9zRSxjQUF4QjtBQUVBVixjQUFRLEVBQVI7O0FBQ0EsVUFBR2hFLFFBQVExQixNQUFSLENBQWVNLEtBQWxCO0FBQ0NvRixjQUFNcEYsS0FBTixHQUFjb0IsUUFBUTFCLE1BQVIsQ0FBZU0sS0FBN0I7QUFFQTRGLGVBQUF4RSxXQUFBLE9BQU9BLFFBQVN3RSxJQUFoQixHQUFnQixNQUFoQjtBQUVBRCxtQkFBQSxDQUFBdkUsV0FBQSxPQUFXQSxRQUFTdUUsUUFBcEIsR0FBb0IsTUFBcEIsS0FBZ0MsRUFBaEM7O0FBRUEsWUFBR3ZFLFFBQVEyRSxVQUFYO0FBQ0NMLDRCQUFrQixFQUFsQjtBQUNBQSwwQkFBZ0JQLGNBQWhCLElBQWtDO0FBQUNhLG9CQUFRNUUsUUFBUTJFO0FBQWpCLFdBQWxDO0FDRkk7O0FESUwsWUFBQTNFLFdBQUEsUUFBQW9FLE9BQUFwRSxRQUFBNkUsTUFBQSxZQUFBVCxLQUFvQnZFLE1BQXBCLEdBQW9CLE1BQXBCLEdBQW9CLE1BQXBCO0FBQ0MsY0FBR0csUUFBUTJFLFVBQVg7QUFDQ1gsa0JBQU1jLEdBQU4sR0FBWSxDQUFDO0FBQUNwRyxtQkFBSztBQUFDcUcscUJBQUsvRSxRQUFRNkU7QUFBZDtBQUFOLGFBQUQsRUFBK0JQLGVBQS9CLEVBQWdEO0FBQUNwSSwyQkFBYTtBQUFDMEksd0JBQVE1RSxRQUFRMkU7QUFBakI7QUFBZCxhQUFoRCxDQUFaO0FBREQ7QUFHQ1gsa0JBQU1jLEdBQU4sR0FBWSxDQUFDO0FBQUNwRyxtQkFBSztBQUFDcUcscUJBQUsvRSxRQUFRNkU7QUFBZDtBQUFOLGFBQUQsQ0FBWjtBQUpGO0FBQUE7QUFNQyxjQUFHN0UsUUFBUTJFLFVBQVg7QUFDQ2hLLGNBQUVxSyxNQUFGLENBQVNoQixLQUFULEVBQWdCO0FBQUNjLG1CQUFLLENBQUNSLGVBQUQsRUFBbUI7QUFBQ3BJLDZCQUFhO0FBQUMwSSwwQkFBUTVFLFFBQVEyRTtBQUFqQjtBQUFkLGVBQW5CO0FBQU4sYUFBaEI7QUN1Qks7O0FEdEJOWCxnQkFBTXRGLEdBQU4sR0FBWTtBQUFDdUcsa0JBQU1WO0FBQVAsV0FBWjtBQzBCSTs7QUR4QkxULHFCQUFhMUQsT0FBTzhFLEVBQXBCOztBQUVBLFlBQUdsRixRQUFRbUYsV0FBWDtBQUNDeEssWUFBRXFLLE1BQUYsQ0FBU2hCLEtBQVQsRUFBZ0JoRSxRQUFRbUYsV0FBeEI7QUN5Qkk7O0FEdkJMbEIsd0JBQWdCO0FBQUNtQixpQkFBTztBQUFSLFNBQWhCOztBQUVBLFlBQUdaLFFBQVE3SixFQUFFMEssUUFBRixDQUFXYixJQUFYLENBQVg7QUFDQ1Asd0JBQWNPLElBQWQsR0FBcUJBLElBQXJCO0FDMEJJOztBRHhCTCxZQUFHVixVQUFIO0FBQ0M7QUFDQ0ksc0JBQVVKLFdBQVd3QixJQUFYLENBQWdCdEIsS0FBaEIsRUFBdUJDLGFBQXZCLEVBQXNDc0IsS0FBdEMsRUFBVjtBQUNBbEIsc0JBQVUsRUFBVjs7QUFDQTFKLGNBQUUrRSxJQUFGLENBQU93RSxPQUFQLEVBQWdCLFVBQUNwRyxNQUFEO0FBQ2Ysa0JBQUE1QixXQUFBLEVBQUFzSixJQUFBO0FBQUF0Siw0QkFBQSxFQUFBc0osT0FBQTNMLFFBQUE0SyxTQUFBLENBQUEzRyxPQUFBNUIsV0FBQSxhQUFBc0osS0FBcUR4TCxJQUFyRCxHQUFxRCxNQUFyRCxLQUE2RCxFQUE3RDs7QUFDQSxrQkFBRyxDQUFDVyxFQUFFOEssT0FBRixDQUFVdkosV0FBVixDQUFKO0FBQ0NBLDhCQUFjLE9BQUtBLFdBQUwsR0FBaUIsR0FBL0I7QUMyQk87O0FBQ0QscUJEMUJQbUksUUFBUXJKLElBQVIsQ0FDQztBQUFBZCx1QkFBTzRELE9BQU9pRyxjQUFQLElBQXlCN0gsV0FBaEM7QUFDQWpCLHVCQUFPNkMsT0FBT1k7QUFEZCxlQURELENDMEJPO0FEL0JSOztBQVFBLG1CQUFPMkYsT0FBUDtBQVhELG1CQUFBM0gsS0FBQTtBQVlNa0IsZ0JBQUFsQixLQUFBO0FBQ0wsa0JBQU0sSUFBSUosT0FBT2lHLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IzRSxFQUFFeUIsT0FBRixHQUFZLEtBQVosR0FBb0JILEtBQUtDLFNBQUwsQ0FBZWEsT0FBZixDQUExQyxDQUFOO0FBZEY7QUEvQkQ7QUFQRDtBQ3FGRzs7QURoQ0gsV0FBTyxFQUFQO0FBdEREO0FBQUEsQ0FERCxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFQ0EsSUFBQTBGLGFBQUEsRUFBQUMsbUJBQUEsRUFBQUMsMkJBQUEsRUFBQUMsdUJBQUEsRUFBQUMsaUJBQUE7O0FBQUFKLGdCQUFnQixVQUFDL0MsR0FBRDtBQUNmLE1BQUFvRCxVQUFBO0FBQUFBLGVBQWEsRUFBYjs7QUFDQSxNQUFHcEQsT0FBT2hJLEVBQUVpRixPQUFGLENBQVUrQyxJQUFJeEgsT0FBZCxDQUFQLElBQWlDd0gsSUFBSXhILE9BQUosQ0FBWTBFLE1BQVosR0FBcUIsQ0FBekQ7QUFDQ2xGLE1BQUUrRSxJQUFGLENBQU9pRCxJQUFJeEgsT0FBWCxFQUFvQixVQUFDZSxXQUFEO0FBQ25CLFVBQUFrRSxNQUFBO0FBQUFBLGVBQVN2RyxRQUFRNEssU0FBUixDQUFrQnZJLFdBQWxCLENBQVQ7O0FBQ0EsVUFBR2tFLE1BQUg7QUNJSyxlREhKMkYsV0FBVy9LLElBQVgsQ0FBZ0JrQixXQUFoQixDQ0dJO0FBQ0Q7QURQTDtBQ1NDOztBRExGLFNBQU82SixVQUFQO0FBUGUsQ0FBaEI7O0FBVUFKLHNCQUFzQixVQUFDNUgsUUFBRCxFQUFXaUksWUFBWDtBQUNyQixNQUFBQyxnQkFBQTtBQUFBQSxxQkFBbUIsRUFBbkI7O0FBQ0EsTUFBR0QsZ0JBQWdCckwsRUFBRWlGLE9BQUYsQ0FBVW9HLFlBQVYsQ0FBaEIsSUFBMkNBLGFBQWFuRyxNQUFiLEdBQXNCLENBQXBFO0FBQ0NsRixNQUFFK0UsSUFBRixDQUFPc0csWUFBUCxFQUFxQixVQUFDOUosV0FBRDtBQUVwQixVQUFBYixVQUFBO0FBQUFBLG1CQUFheEIsUUFBUTJFLGFBQVIsQ0FBc0Isa0JBQXRCLEVBQTBDOEcsSUFBMUMsQ0FBK0M7QUFBQ3BKLHFCQUFhQSxXQUFkO0FBQTJCMEMsZUFBT2IsUUFBbEM7QUFBNENtSSxnQkFBUTtBQUFwRCxPQUEvQyxFQUEwRztBQUFDOUwsZ0JBQVE7QUFBQ3NFLGVBQUs7QUFBTjtBQUFULE9BQTFHLENBQWI7QUNnQkcsYURmSHJELFdBQVdULE9BQVgsQ0FBbUIsVUFBQ2tHLFNBQUQ7QUNnQmQsZURmSm1GLGlCQUFpQmpMLElBQWpCLENBQXNCOEYsVUFBVXBDLEdBQWhDLENDZUk7QURoQkwsUUNlRztBRGxCSjtBQ3NCQzs7QURqQkYsU0FBT3VILGdCQUFQO0FBUnFCLENBQXRCOztBQVdBSCxvQkFBb0IsVUFBQy9ILFFBQUQsRUFBV2lJLFlBQVg7QUFDbkIsTUFBQUcsY0FBQTtBQUFBQSxtQkFBaUIsRUFBakI7O0FBQ0EsTUFBR0gsZ0JBQWdCckwsRUFBRWlGLE9BQUYsQ0FBVW9HLFlBQVYsQ0FBaEIsSUFBMkNBLGFBQWFuRyxNQUFiLEdBQXNCLENBQXBFO0FBQ0NsRixNQUFFK0UsSUFBRixDQUFPc0csWUFBUCxFQUFxQixVQUFDOUosV0FBRDtBQUVwQixVQUFBVCxPQUFBO0FBQUFBLGdCQUFVNUIsUUFBUTJFLGFBQVIsQ0FBc0IsU0FBdEIsRUFBaUM4RyxJQUFqQyxDQUFzQztBQUFDcEoscUJBQWFBLFdBQWQ7QUFBMkIwQyxlQUFPYjtBQUFsQyxPQUF0QyxFQUFtRjtBQUFDM0QsZ0JBQVE7QUFBQ3NFLGVBQUs7QUFBTjtBQUFULE9BQW5GLENBQVY7QUMyQkcsYUQxQkhqRCxRQUFRYixPQUFSLENBQWdCLFVBQUN3SSxNQUFEO0FDMkJYLGVEMUJKK0MsZUFBZW5MLElBQWYsQ0FBb0JvSSxPQUFPMUUsR0FBM0IsQ0MwQkk7QUQzQkwsUUMwQkc7QUQ3Qko7QUNpQ0M7O0FENUJGLFNBQU95SCxjQUFQO0FBUm1CLENBQXBCOztBQVdBUCw4QkFBOEIsVUFBQzdILFFBQUQsRUFBV2lJLFlBQVg7QUFDN0IsTUFBQUksd0JBQUE7QUFBQUEsNkJBQTJCLEVBQTNCOztBQUNBLE1BQUdKLGdCQUFnQnJMLEVBQUVpRixPQUFGLENBQVVvRyxZQUFWLENBQWhCLElBQTJDQSxhQUFhbkcsTUFBYixHQUFzQixDQUFwRTtBQUNDbEYsTUFBRStFLElBQUYsQ0FBT3NHLFlBQVAsRUFBcUIsVUFBQzlKLFdBQUQ7QUFDcEIsVUFBQVYsa0JBQUE7QUFBQUEsMkJBQXFCM0IsUUFBUTJFLGFBQVIsQ0FBc0Isb0JBQXRCLEVBQTRDOEcsSUFBNUMsQ0FBaUQ7QUFBQ3BKLHFCQUFhQSxXQUFkO0FBQTJCMEMsZUFBT2I7QUFBbEMsT0FBakQsRUFBOEY7QUFBQzNELGdCQUFRO0FBQUNzRSxlQUFLO0FBQU47QUFBVCxPQUE5RixDQUFyQjtBQ3VDRyxhRHRDSGxELG1CQUFtQlosT0FBbkIsQ0FBMkIsVUFBQ3NJLGlCQUFEO0FDdUN0QixlRHRDSmtELHlCQUF5QnBMLElBQXpCLENBQThCa0ksa0JBQWtCeEUsR0FBaEQsQ0NzQ0k7QUR2Q0wsUUNzQ0c7QUR4Q0o7QUM0Q0M7O0FEeENGLFNBQU8wSCx3QkFBUDtBQVA2QixDQUE5Qjs7QUFVQVAsMEJBQTBCLFVBQUM5SCxRQUFELEVBQVdpSSxZQUFYO0FBQ3pCLE1BQUFLLG9CQUFBO0FBQUFBLHlCQUF1QixFQUF2Qjs7QUFDQSxNQUFHTCxnQkFBZ0JyTCxFQUFFaUYsT0FBRixDQUFVb0csWUFBVixDQUFoQixJQUEyQ0EsYUFBYW5HLE1BQWIsR0FBc0IsQ0FBcEU7QUFDQ2xGLE1BQUUrRSxJQUFGLENBQU9zRyxZQUFQLEVBQXFCLFVBQUM5SixXQUFEO0FBQ3BCLFVBQUFWLGtCQUFBO0FBQUFBLDJCQUFxQjNCLFFBQVEyRSxhQUFSLENBQXNCLG9CQUF0QixFQUE0QzhHLElBQTVDLENBQWlEO0FBQUNwSixxQkFBYUEsV0FBZDtBQUEyQjBDLGVBQU9iO0FBQWxDLE9BQWpELEVBQThGO0FBQUMzRCxnQkFBUTtBQUFDK0ksNkJBQW1CO0FBQXBCO0FBQVQsT0FBOUYsQ0FBckI7QUNtREcsYURsREgzSCxtQkFBbUJaLE9BQW5CLENBQTJCLFVBQUNzSSxpQkFBRDtBQUMxQixZQUFBM0gsY0FBQTtBQUFBQSx5QkFBaUIxQixRQUFRMkUsYUFBUixDQUFzQixnQkFBdEIsRUFBd0NDLE9BQXhDLENBQWdEO0FBQUNDLGVBQUt3RSxrQkFBa0JDO0FBQXhCLFNBQWhELEVBQTRGO0FBQUMvSSxrQkFBUTtBQUFDc0UsaUJBQUs7QUFBTjtBQUFULFNBQTVGLENBQWpCO0FDMERJLGVEekRKMkgscUJBQXFCckwsSUFBckIsQ0FBMEJPLGVBQWVtRCxHQUF6QyxDQ3lESTtBRDNETCxRQ2tERztBRHBESjtBQ2dFQzs7QUQzREYsU0FBTzJILG9CQUFQO0FBUnlCLENBQTFCOztBQVdBL0osT0FBT3VILE9BQVAsQ0FDQztBQUFBLGlDQUErQixVQUFDOUYsUUFBRCxFQUFXNUIsU0FBWDtBQUM5QixRQUFBbUssUUFBQSxFQUFBQyxtQkFBQSxFQUFBQywyQkFBQSxFQUFBQyx1QkFBQSxFQUFBQyxnQkFBQSxFQUFBL0ksSUFBQSxFQUFBQyxDQUFBLEVBQUFFLE1BQUEsRUFBQXFHLEdBQUEsRUFBQUMsSUFBQSxFQUFBbkcsTUFBQTs7QUFBQUEsYUFBUyxLQUFLQSxNQUFkOztBQUNBLFFBQUcsQ0FBQ0EsTUFBSjtBQUNDLFlBQU0sSUFBSTNCLE9BQU9pRyxLQUFYLENBQWlCLEtBQWpCLEVBQXdCLHVEQUF4QixDQUFOO0FDOERFOztBRDVESCxRQUFHLENBQUMxSSxRQUFRMEUsWUFBUixDQUFxQlIsUUFBckIsRUFBK0JFLE1BQS9CLENBQUo7QUFDQyxZQUFNLElBQUkzQixPQUFPaUcsS0FBWCxDQUFpQixLQUFqQixFQUF3QixvQkFBeEIsQ0FBTjtBQzhERTs7QUQ1REh6RSxhQUFTakUsUUFBUTJFLGFBQVIsQ0FBc0IscUJBQXRCLEVBQTZDQyxPQUE3QyxDQUFxRDtBQUFDQyxXQUFLdkM7QUFBTixLQUFyRCxDQUFUOztBQUVBLFFBQUcsQ0FBQyxDQUFDeEIsRUFBRWlGLE9BQUYsQ0FBQTlCLFVBQUEsT0FBVUEsT0FBUXhELElBQWxCLEdBQWtCLE1BQWxCLENBQUQsS0FBQXdELFVBQUEsUUFBQXFHLE1BQUFyRyxPQUFBeEQsSUFBQSxZQUFBNkosSUFBMEN0RSxNQUExQyxHQUEwQyxNQUExQyxHQUEwQyxNQUExQyxJQUFtRCxDQUFwRCxNQUEyRCxDQUFDbEYsRUFBRWlGLE9BQUYsQ0FBQTlCLFVBQUEsT0FBVUEsT0FBUTNDLE9BQWxCLEdBQWtCLE1BQWxCLENBQUQsS0FBQTJDLFVBQUEsUUFBQXNHLE9BQUF0RyxPQUFBM0MsT0FBQSxZQUFBaUosS0FBZ0R2RSxNQUFoRCxHQUFnRCxNQUFoRCxHQUFnRCxNQUFoRCxJQUF5RCxDQUFwSCxDQUFIO0FBQ0MsWUFBTSxJQUFJdkQsT0FBT2lHLEtBQVgsQ0FBaUIsS0FBakIsRUFBd0IsWUFBeEIsQ0FBTjtBQytERTs7QUQ3REg1RSxXQUFPLEVBQVA7QUFDQTJJLGVBQVd4SSxPQUFPM0MsT0FBUCxJQUFrQixFQUE3QjtBQUNBb0wsMEJBQXNCekksT0FBT3pDLFVBQVAsSUFBcUIsRUFBM0M7QUFDQXFMLHVCQUFtQjVJLE9BQU9yQyxPQUFQLElBQWtCLEVBQXJDO0FBQ0ErSyxrQ0FBOEIxSSxPQUFPdEMsa0JBQVAsSUFBNkIsRUFBM0Q7QUFDQWlMLDhCQUEwQjNJLE9BQU92QyxjQUFQLElBQXlCLEVBQW5EOztBQUVBO0FBQ0MsVUFBR1osRUFBRWlGLE9BQUYsQ0FBQTlCLFVBQUEsT0FBVUEsT0FBUXhELElBQWxCLEdBQWtCLE1BQWxCLEtBQTJCd0QsT0FBT3hELElBQVAsQ0FBWXVGLE1BQVosR0FBcUIsQ0FBbkQ7QUFDQ2xGLFVBQUUrRSxJQUFGLENBQU81QixPQUFPeEQsSUFBZCxFQUFvQixVQUFDcU0sS0FBRDtBQUNuQixjQUFBaEUsR0FBQTs7QUFBQSxjQUFHLENBQUNBLEdBQUo7QUFFQ0Esa0JBQU05SSxRQUFRMkUsYUFBUixDQUFzQixNQUF0QixFQUE4QkMsT0FBOUIsQ0FBc0M7QUFBQ0MsbUJBQUtpSSxLQUFOO0FBQWF0RCwwQkFBWTtBQUF6QixhQUF0QyxFQUFzRTtBQUFDakosc0JBQVE7QUFBQ2UseUJBQVM7QUFBVjtBQUFULGFBQXRFLENBQU47QUNxRUs7O0FBQ0QsaUJEckVMbUwsV0FBV0EsU0FBU00sTUFBVCxDQUFnQmxCLGNBQWMvQyxHQUFkLENBQWhCLENDcUVOO0FEekVOO0FDMkVHOztBRHJFSixVQUFHaEksRUFBRWlGLE9BQUYsQ0FBVTBHLFFBQVYsS0FBdUJBLFNBQVN6RyxNQUFULEdBQWtCLENBQTVDO0FBQ0MwRyw4QkFBc0JBLG9CQUFvQkssTUFBcEIsQ0FBMkJqQixvQkFBb0I1SCxRQUFwQixFQUE4QnVJLFFBQTlCLENBQTNCLENBQXRCO0FBQ0FJLDJCQUFtQkEsaUJBQWlCRSxNQUFqQixDQUF3QmQsa0JBQWtCL0gsUUFBbEIsRUFBNEJ1SSxRQUE1QixDQUF4QixDQUFuQjtBQUNBRSxzQ0FBOEJBLDRCQUE0QkksTUFBNUIsQ0FBbUNoQiw0QkFBNEI3SCxRQUE1QixFQUFzQ3VJLFFBQXRDLENBQW5DLENBQTlCO0FBQ0FHLGtDQUEwQkEsd0JBQXdCRyxNQUF4QixDQUErQmYsd0JBQXdCOUgsUUFBeEIsRUFBa0N1SSxRQUFsQyxDQUEvQixDQUExQjtBQUVBM0ksYUFBS3hDLE9BQUwsR0FBZVIsRUFBRWtNLElBQUYsQ0FBT1AsUUFBUCxDQUFmO0FBQ0EzSSxhQUFLdEMsVUFBTCxHQUFrQlYsRUFBRWtNLElBQUYsQ0FBT04sbUJBQVAsQ0FBbEI7QUFDQTVJLGFBQUtwQyxjQUFMLEdBQXNCWixFQUFFa00sSUFBRixDQUFPSix1QkFBUCxDQUF0QjtBQUNBOUksYUFBS25DLGtCQUFMLEdBQTBCYixFQUFFa00sSUFBRixDQUFPTCwyQkFBUCxDQUExQjtBQUNBN0ksYUFBS2xDLE9BQUwsR0FBZWQsRUFBRWtNLElBQUYsQ0FBT0gsZ0JBQVAsQ0FBZjtBQ3NFSSxlRHJFSjdNLFFBQVEyRSxhQUFSLENBQXNCLHFCQUF0QixFQUE2QzZDLE1BQTdDLENBQW9EO0FBQUMzQyxlQUFLWixPQUFPWTtBQUFiLFNBQXBELEVBQXNFO0FBQUN5QyxnQkFBTXhEO0FBQVAsU0FBdEUsQ0NxRUk7QUR4Rk47QUFBQSxhQUFBakIsS0FBQTtBQW9CTWtCLFVBQUFsQixLQUFBO0FBQ0xOLGNBQVFNLEtBQVIsQ0FBY2tCLEVBQUV3QixLQUFoQjtBQUNBLFlBQU0sSUFBSTlDLE9BQU9pRyxLQUFYLENBQWlCLEtBQWpCLEVBQXdCM0UsRUFBRWYsTUFBRixJQUFZZSxFQUFFeUIsT0FBdEMsQ0FBTjtBQzRFRTtBRHRISjtBQUFBLENBREQsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRXREQSxJQUFBeUgsYUFBQTtBQUFBLEtBQUNqSSxXQUFELEdBQWUsRUFBZjtBQUVBaUksZ0JBQWdCO0FBQ2ZsRyxTQUFPLENBRFE7QUFFZmhDLFNBQU8sQ0FGUTtBQUdmbUksV0FBUyxDQUhNO0FBSWZDLGNBQVksQ0FKRztBQUtmQyxZQUFVLENBTEs7QUFNZkMsZUFBYSxDQU5FO0FBT2ZDLGNBQVksQ0FQRztBQVFmQyxhQUFXLENBUkk7QUFTZkMsV0FBUztBQVRNLENBQWhCOztBQVlBeEksWUFBWXlJLFlBQVosR0FBMkIsVUFBQ2xILE1BQUQ7QUFDMUIsTUFBQW1ILElBQUEsRUFBQTFMLE9BQUEsRUFBQXpCLE1BQUEsRUFBQXFHLGNBQUEsRUFBQUMsUUFBQTs7QUFBQTZHLFNBQU8sRUFBUDs7QUFFQTVNLElBQUVxSyxNQUFGLENBQVN1QyxJQUFULEVBQWdCbkgsTUFBaEI7O0FBRUFLLG1CQUFpQixFQUFqQjs7QUFFQTlGLElBQUVxSyxNQUFGLENBQVN2RSxjQUFULEVBQXlCOEcsS0FBS2xNLFVBQUwsSUFBbUIsRUFBNUM7O0FBRUFWLElBQUUrRSxJQUFGLENBQU9lLGNBQVAsRUFBdUIsVUFBQytHLENBQUQsRUFBSXpNLENBQUo7QUFDdEIsUUFBRyxDQUFDSixFQUFFc0YsR0FBRixDQUFNdUgsQ0FBTixFQUFTLEtBQVQsQ0FBSjtBQUNDQSxRQUFFOUksR0FBRixHQUFRM0QsQ0FBUjtBQ0FFOztBRENILFFBQUcsQ0FBQ0osRUFBRXNGLEdBQUYsQ0FBTXVILENBQU4sRUFBUyxNQUFULENBQUo7QUNDSSxhREFIQSxFQUFFeE4sSUFBRixHQUFTZSxDQ0FOO0FBQ0Q7QURMSjs7QUFLQXdNLE9BQUtsTSxVQUFMLEdBQWtCb0YsY0FBbEI7QUFJQUMsYUFBVyxFQUFYOztBQUNBL0YsSUFBRUMsT0FBRixDQUFVMk0sS0FBSzdHLFFBQWYsRUFBeUIsVUFBQ2UsT0FBRCxFQUFVZ0csR0FBVjtBQUN4QixRQUFBQyxRQUFBOztBQUFBQSxlQUFXLEVBQVg7O0FBQ0EvTSxNQUFFcUssTUFBRixDQUFTMEMsUUFBVCxFQUFtQmpHLE9BQW5COztBQUNBLFFBQUc5RyxFQUFFZ04sVUFBRixDQUFhRCxTQUFTekwsSUFBdEIsQ0FBSDtBQUNDeUwsZUFBU3pMLElBQVQsR0FBZ0J5TCxTQUFTekwsSUFBVCxDQUFjMkwsUUFBZCxFQUFoQjtBQ0NFOztBREFILFdBQU9GLFNBQVNHLEtBQWhCO0FDRUUsV0RERm5ILFNBQVMrRyxHQUFULElBQWdCQyxRQ0NkO0FEUEg7O0FBT0FILE9BQUs3RyxRQUFMLEdBQWdCQSxRQUFoQjtBQUVBN0UsWUFBVSxFQUFWOztBQUNBbEIsSUFBRUMsT0FBRixDQUFVMk0sS0FBSzFMLE9BQWYsRUFBd0IsVUFBQ2dHLE1BQUQsRUFBUzRGLEdBQVQ7QUFDdkIsUUFBQUssT0FBQTs7QUFBQUEsY0FBVSxFQUFWOztBQUNBbk4sTUFBRXFLLE1BQUYsQ0FBUzhDLE9BQVQsRUFBa0JqRyxNQUFsQjs7QUFDQSxRQUFHbEgsRUFBRWdOLFVBQUYsQ0FBYUcsUUFBUTdMLElBQXJCLENBQUg7QUFDQzZMLGNBQVE3TCxJQUFSLEdBQWU2TCxRQUFRN0wsSUFBUixDQUFhMkwsUUFBYixFQUFmO0FDR0U7O0FERkgsV0FBT0UsUUFBUUQsS0FBZjtBQ0lFLFdESEZoTSxRQUFRNEwsR0FBUixJQUFlSyxPQ0diO0FEVEg7O0FBUUFQLE9BQUsxTCxPQUFMLEdBQWVBLE9BQWY7QUFFQXpCLFdBQVMsRUFBVDs7QUFDQU8sSUFBRUMsT0FBRixDQUFVMk0sS0FBS25OLE1BQWYsRUFBdUIsVUFBQzBGLEtBQUQsRUFBUTJILEdBQVI7QUFDdEIsUUFBQU0sTUFBQSxFQUFBQyxHQUFBOztBQUFBRCxhQUFTLEVBQVQ7O0FBQ0FwTixNQUFFcUssTUFBRixDQUFTK0MsTUFBVCxFQUFpQmpJLEtBQWpCOztBQUNBLFFBQUduRixFQUFFZ04sVUFBRixDQUFhSSxPQUFPL0gsT0FBcEIsQ0FBSDtBQUNDK0gsYUFBTy9ILE9BQVAsR0FBaUIrSCxPQUFPL0gsT0FBUCxDQUFlNEgsUUFBZixFQUFqQjtBQUNBLGFBQU9HLE9BQU9yTixRQUFkO0FDSUU7O0FERkgsUUFBR0MsRUFBRWlGLE9BQUYsQ0FBVW1JLE9BQU8vSCxPQUFqQixDQUFIO0FBQ0NnSSxZQUFNLEVBQU47O0FBQ0FyTixRQUFFQyxPQUFGLENBQVVtTixPQUFPL0gsT0FBakIsRUFBMEIsVUFBQ2lJLEdBQUQ7QUNJckIsZURISkQsSUFBSWhOLElBQUosQ0FBWWlOLElBQUkvTixLQUFKLEdBQVUsR0FBVixHQUFhK04sSUFBSWhOLEtBQTdCLENDR0k7QURKTDs7QUFFQThNLGFBQU8vSCxPQUFQLEdBQWlCZ0ksSUFBSTlILElBQUosQ0FBUyxHQUFULENBQWpCO0FBQ0EsYUFBTzZILE9BQU9yTixRQUFkO0FDS0U7O0FESEgsUUFBR3FOLE9BQU9HLEtBQVY7QUFDQ0gsYUFBT0csS0FBUCxHQUFlSCxPQUFPRyxLQUFQLENBQWFOLFFBQWIsRUFBZjtBQUNBLGFBQU9HLE9BQU9JLE1BQWQ7QUNLRTs7QURISCxRQUFHeE4sRUFBRWdOLFVBQUYsQ0FBYUksT0FBT3ROLGVBQXBCLENBQUg7QUFDQ3NOLGFBQU90TixlQUFQLEdBQXlCc04sT0FBT3ROLGVBQVAsQ0FBdUJtTixRQUF2QixFQUF6QjtBQUNBLGFBQU9HLE9BQU9LLGdCQUFkO0FDS0U7O0FESEgsUUFBR3pOLEVBQUVnTixVQUFGLENBQWFJLE9BQU94TixZQUFwQixDQUFIO0FBQ0N3TixhQUFPeE4sWUFBUCxHQUFzQndOLE9BQU94TixZQUFQLENBQW9CcU4sUUFBcEIsRUFBdEI7QUFDQSxhQUFPRyxPQUFPTSxhQUFkO0FDS0U7O0FESEgsUUFBRzFOLEVBQUVnTixVQUFGLENBQWFJLE9BQU9PLGNBQXBCLENBQUg7QUFDQ1AsYUFBT08sY0FBUCxHQUF3QlAsT0FBT08sY0FBUCxDQUFzQlYsUUFBdEIsRUFBeEI7QUFDQSxhQUFPRyxPQUFPUSxlQUFkO0FDS0U7O0FESEgsUUFBRzVOLEVBQUVnTixVQUFGLENBQWFJLE9BQU9TLFlBQXBCLENBQUg7QUFDQ1QsYUFBT1MsWUFBUCxHQUFzQlQsT0FBT1MsWUFBUCxDQUFvQlosUUFBcEIsRUFBdEI7QUFDQSxhQUFPRyxPQUFPVSxhQUFkO0FDS0U7O0FBQ0QsV0RKRnJPLE9BQU9xTixHQUFQLElBQWNNLE1DSVo7QUR0Q0g7O0FBb0NBUixPQUFLbk4sTUFBTCxHQUFjQSxNQUFkO0FBRUEsU0FBT21OLElBQVA7QUE5RTBCLENBQTNCLEMsQ0FnRkE7Ozs7Ozs7Ozs7OztBQVdBMUksWUFBVyxRQUFYLElBQXFCLFVBQUNmLE1BQUQ7QUFDcEIsTUFBQTRLLFdBQUE7QUFBQUEsZ0JBQWMsRUFBZDs7QUFDQSxNQUFHL04sRUFBRWlGLE9BQUYsQ0FBVTlCLE9BQU94RCxJQUFqQixLQUEwQndELE9BQU94RCxJQUFQLENBQVl1RixNQUFaLEdBQXFCLENBQWxEO0FBQ0M2SSxnQkFBWXBPLElBQVosR0FBbUIsRUFBbkI7O0FBRUFLLE1BQUUrRSxJQUFGLENBQU81QixPQUFPeEQsSUFBZCxFQUFvQixVQUFDcU8sTUFBRDtBQUNuQixVQUFBaEcsR0FBQTtBQUFBQSxZQUFNLEVBQU47O0FBQ0FoSSxRQUFFcUssTUFBRixDQUFTckMsR0FBVCxFQUFjOUksUUFBUWdCLElBQVIsQ0FBYThOLE1BQWIsQ0FBZDs7QUFDQSxVQUFHLENBQUNoRyxHQUFELElBQVFoSSxFQUFFOEssT0FBRixDQUFVOUMsR0FBVixDQUFYO0FBQ0NBLGNBQU05SSxRQUFRMkUsYUFBUixDQUFzQixNQUF0QixFQUE4QkMsT0FBOUIsQ0FBc0M7QUFBQ0MsZUFBS2lLO0FBQU4sU0FBdEMsRUFBcUQ7QUFBQ3ZPLGtCQUFRME07QUFBVCxTQUFyRCxDQUFOO0FBREQ7QUFHQyxZQUFHLENBQUNuTSxFQUFFc0YsR0FBRixDQUFNMEMsR0FBTixFQUFXLEtBQVgsQ0FBSjtBQUNDQSxjQUFJakUsR0FBSixHQUFVaUssTUFBVjtBQUpGO0FDaUJJOztBRFpKLFVBQUdoRyxHQUFIO0FDY0ssZURiSitGLFlBQVlwTyxJQUFaLENBQWlCVSxJQUFqQixDQUFzQjJILEdBQXRCLENDYUk7QUFDRDtBRHZCTDtBQ3lCQzs7QURkRixNQUFHaEksRUFBRWlGLE9BQUYsQ0FBVTlCLE9BQU8zQyxPQUFqQixLQUE2QjJDLE9BQU8zQyxPQUFQLENBQWUwRSxNQUFmLEdBQXdCLENBQXhEO0FBQ0M2SSxnQkFBWXZOLE9BQVosR0FBc0IsRUFBdEI7O0FBQ0FSLE1BQUUrRSxJQUFGLENBQU81QixPQUFPM0MsT0FBZCxFQUF1QixVQUFDZSxXQUFEO0FBQ3RCLFVBQUFrRSxNQUFBO0FBQUFBLGVBQVN2RyxRQUFRQyxPQUFSLENBQWdCb0MsV0FBaEIsQ0FBVDs7QUFDQSxVQUFHa0UsTUFBSDtBQ2lCSyxlRGhCSnNJLFlBQVl2TixPQUFaLENBQW9CSCxJQUFwQixDQUF5QjZELFlBQVl5SSxZQUFaLENBQXlCbEgsTUFBekIsQ0FBekIsQ0NnQkk7QUFDRDtBRHBCTDtBQ3NCQzs7QURqQkYsTUFBR3pGLEVBQUVpRixPQUFGLENBQVU5QixPQUFPekMsVUFBakIsS0FBZ0N5QyxPQUFPekMsVUFBUCxDQUFrQndFLE1BQWxCLEdBQTJCLENBQTlEO0FBQ0M2SSxnQkFBWXJOLFVBQVosR0FBeUJ4QixRQUFRMkUsYUFBUixDQUFzQixrQkFBdEIsRUFBMEM4RyxJQUExQyxDQUErQztBQUFDNUcsV0FBSztBQUFDcUcsYUFBS2pILE9BQU96QztBQUFiO0FBQU4sS0FBL0MsRUFBZ0Y7QUFBQ2pCLGNBQVEwTTtBQUFULEtBQWhGLEVBQXlHdkIsS0FBekcsRUFBekI7QUN5QkM7O0FEdkJGLE1BQUc1SyxFQUFFaUYsT0FBRixDQUFVOUIsT0FBT3ZDLGNBQWpCLEtBQW9DdUMsT0FBT3ZDLGNBQVAsQ0FBc0JzRSxNQUF0QixHQUErQixDQUF0RTtBQUNDNkksZ0JBQVluTixjQUFaLEdBQTZCMUIsUUFBUTJFLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDOEcsSUFBeEMsQ0FBNkM7QUFBQzVHLFdBQUs7QUFBQ3FHLGFBQUtqSCxPQUFPdkM7QUFBYjtBQUFOLEtBQTdDLEVBQWtGO0FBQUNuQixjQUFRME07QUFBVCxLQUFsRixFQUEyR3ZCLEtBQTNHLEVBQTdCO0FDK0JDOztBRDdCRixNQUFHNUssRUFBRWlGLE9BQUYsQ0FBVTlCLE9BQU90QyxrQkFBakIsS0FBd0NzQyxPQUFPdEMsa0JBQVAsQ0FBMEJxRSxNQUExQixHQUFtQyxDQUE5RTtBQUNDNkksZ0JBQVlsTixrQkFBWixHQUFpQzNCLFFBQVEyRSxhQUFSLENBQXNCLG9CQUF0QixFQUE0QzhHLElBQTVDLENBQWlEO0FBQUM1RyxXQUFLO0FBQUNxRyxhQUFLakgsT0FBT3RDO0FBQWI7QUFBTixLQUFqRCxFQUEwRjtBQUFDcEIsY0FBUTBNO0FBQVQsS0FBMUYsRUFBbUh2QixLQUFuSCxFQUFqQztBQ3FDQzs7QURuQ0YsTUFBRzVLLEVBQUVpRixPQUFGLENBQVU5QixPQUFPckMsT0FBakIsS0FBNkJxQyxPQUFPckMsT0FBUCxDQUFlb0UsTUFBZixHQUF3QixDQUF4RDtBQUNDNkksZ0JBQVlqTixPQUFaLEdBQXNCNUIsUUFBUTJFLGFBQVIsQ0FBc0IsU0FBdEIsRUFBaUM4RyxJQUFqQyxDQUFzQztBQUFDNUcsV0FBSztBQUFDcUcsYUFBS2pILE9BQU9yQztBQUFiO0FBQU4sS0FBdEMsRUFBb0U7QUFBQ3JCLGNBQVEwTTtBQUFULEtBQXBFLEVBQTZGdkIsS0FBN0YsRUFBdEI7QUMyQ0M7O0FEekNGLFNBQU9tRCxXQUFQO0FBbkNvQixDQUFyQixDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2FwcGxpY2F0aW9uLXBhY2thZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJDcmVhdG9yLk9iamVjdHMuYXBwbGljYXRpb25fcGFja2FnZSA9XHJcblx0bmFtZTogXCJhcHBsaWNhdGlvbl9wYWNrYWdlXCJcclxuXHRpY29uOiBcImN1c3RvbS5jdXN0b200MlwiXHJcblx0bGFiZWw6IFwi6L2v5Lu25YyFXCJcclxuXHRoaWRkZW46IHRydWVcclxuXHRmaWVsZHM6XHJcblx0XHRuYW1lOlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cdFx0XHRsYWJlbDogXCLlkI3np7BcIlxyXG5cdFx0YXBwczpcclxuXHRcdFx0dHlwZTogXCJsb29rdXBcIlxyXG5cdFx0XHRsYWJlbDogXCLlupTnlKhcIlxyXG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXHJcblx0XHRcdHJlZmVyZW5jZV90bzogXCJhcHBzXCJcclxuXHRcdFx0bXVsdGlwbGU6IHRydWVcclxuXHRcdFx0b3B0aW9uc0Z1bmN0aW9uOiAoKS0+XHJcblx0XHRcdFx0X29wdGlvbnMgPSBbXVxyXG5cdFx0XHRcdF8uZm9yRWFjaCBDcmVhdG9yLkFwcHMsIChvLCBrKS0+XHJcblx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogby5uYW1lLCB2YWx1ZTogaywgaWNvbjogby5pY29uX3NsZHN9XHJcblx0XHRcdFx0cmV0dXJuIF9vcHRpb25zXHJcblx0XHRvYmplY3RzOlxyXG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXHJcblx0XHRcdGxhYmVsOiBcIuWvueixoVwiXHJcblx0XHRcdHJlZmVyZW5jZV90bzogXCJvYmplY3RzXCJcclxuXHRcdFx0bXVsdGlwbGU6IHRydWVcclxuXHRcdFx0b3B0aW9uc0Z1bmN0aW9uOiAoKS0+XHJcblx0XHRcdFx0X29wdGlvbnMgPSBbXVxyXG5cdFx0XHRcdF8uZm9yRWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvLCBrKS0+XHJcblx0XHRcdFx0XHRpZiAhby5oaWRkZW5cclxuXHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7IGxhYmVsOiBvLmxhYmVsLCB2YWx1ZTogaywgaWNvbjogby5pY29uIH1cclxuXHRcdFx0XHRyZXR1cm4gX29wdGlvbnNcclxuXHJcblx0XHRsaXN0X3ZpZXdzOlxyXG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXHJcblx0XHRcdGxhYmVsOiBcIuWIl+ihqOinhuWbvlwiXHJcblx0XHRcdG11bHRpcGxlOiB0cnVlXHJcblx0XHRcdHJlZmVyZW5jZV90bzogXCJvYmplY3RfbGlzdHZpZXdzXCJcclxuXHRcdFx0b3B0aW9uc01ldGhvZDogXCJjcmVhdG9yLmxpc3R2aWV3c19vcHRpb25zXCJcclxuXHRcdHBlcm1pc3Npb25fc2V0OlxyXG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXHJcblx0XHRcdGxhYmVsOiBcIuadg+mZkOmbhlwiXHJcblx0XHRcdG11bHRpcGxlOiB0cnVlXHJcblx0XHRcdHJlZmVyZW5jZV90bzogXCJwZXJtaXNzaW9uX3NldFwiXHJcblx0XHRwZXJtaXNzaW9uX29iamVjdHM6XHJcblx0XHRcdHR5cGU6IFwibG9va3VwXCJcclxuXHRcdFx0bGFiZWw6IFwi5p2D6ZmQ6ZuGXCJcclxuXHRcdFx0bXVsdGlwbGU6IHRydWVcclxuXHRcdFx0cmVmZXJlbmNlX3RvOiBcInBlcm1pc3Npb25fb2JqZWN0c1wiXHJcblx0XHRyZXBvcnRzOlxyXG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXHJcblx0XHRcdGxhYmVsOiBcIuaKpeihqFwiXHJcblx0XHRcdG11bHRpcGxlOiB0cnVlXHJcblx0XHRcdHJlZmVyZW5jZV90bzogXCJyZXBvcnRzXCJcclxuXHRsaXN0X3ZpZXdzOlxyXG5cdFx0YWxsOlxyXG5cdFx0XHRsYWJlbDogXCLmiYDmnIlcIlxyXG5cdFx0XHRjb2x1bW5zOiBbXCJuYW1lXCJdXHJcblx0XHRcdGZpbHRlcl9zY29wZTogXCJzcGFjZVwiXHJcblx0YWN0aW9uczpcclxuXHRcdGluaXRfZGF0YTpcclxuXHRcdFx0bGFiZWw6IFwi5Yid5aeL5YyWXCJcclxuXHRcdFx0dmlzaWJsZTogdHJ1ZVxyXG5cdFx0XHRvbjogXCJyZWNvcmRcIlxyXG5cdFx0XHR0b2RvOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XHJcblx0XHRcdFx0Y29uc29sZS5sb2cob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKVxyXG5cdFx0XHRcdE1ldGVvci5jYWxsIFwiYXBwUGFja2FnZS5pbml0X2V4cG9ydF9kYXRhXCIsIFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSwgcmVjb3JkX2lkLChlcnJvciwgcmVzdWx0KS0+XHJcblx0XHRcdFx0XHRpZiBlcnJvclxyXG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoZXJyb3IucmVhc29uKVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyhcIuWIneWni+WMluWujOaIkFwiKVxyXG5cdFx0ZXhwb3J0OlxyXG5cdFx0XHRsYWJlbDogXCLlr7zlh7pcIlxyXG5cdFx0XHR2aXNpYmxlOiB0cnVlXHJcblx0XHRcdG9uOiBcInJlY29yZFwiXHJcblx0XHRcdHRvZG86IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIuWvvOWHuiN7b2JqZWN0X25hbWV9LT4je3JlY29yZF9pZH1cIilcclxuXHRcdFx0XHR1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsIFwiL2FwaS9jcmVhdG9yL2FwcF9wYWNrYWdlL2V4cG9ydC8je1Nlc3Npb24uZ2V0KFwic3BhY2VJZFwiKX0vI3tyZWNvcmRfaWR9XCJcclxuXHRcdFx0XHR3aW5kb3cub3Blbih1cmwpXHJcbiNcdFx0XHRcdCQuYWpheFxyXG4jXHRcdFx0XHRcdHR5cGU6IFwicG9zdFwiXHJcbiNcdFx0XHRcdFx0dXJsOiB1cmxcclxuI1x0XHRcdFx0XHRkYXRhVHlwZTogXCJqc29uXCJcclxuI1x0XHRcdFx0XHRiZWZvcmVTZW5kOiAocmVxdWVzdCkgLT5cclxuI1x0XHRcdFx0XHRcdHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignWC1Vc2VyLUlkJywgTWV0ZW9yLnVzZXJJZCgpKVxyXG4jXHRcdFx0XHRcdFx0cmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLUF1dGgtVG9rZW4nLCBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpKVxyXG4jXHRcdFx0XHRcdGVycm9yOiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSAtPlxyXG4jXHRcdFx0XHRcdFx0ZXJyb3IgPSBqcVhIUi5yZXNwb25zZUpTT05cclxuI1x0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyb3JcclxuI1x0XHRcdFx0XHRcdGlmIGVycm9yPy5yZWFzb25cclxuI1x0XHRcdFx0XHRcdFx0dG9hc3RyPy5lcnJvcj8oVEFQaTE4bi5fXyhlcnJvci5yZWFzb24pKVxyXG4jXHRcdFx0XHRcdFx0ZWxzZSBpZiBlcnJvcj8ubWVzc2FnZVxyXG4jXHRcdFx0XHRcdFx0XHR0b2FzdHI/LmVycm9yPyhUQVBpMThuLl9fKGVycm9yLm1lc3NhZ2UpKVxyXG4jXHRcdFx0XHRcdFx0ZWxzZVxyXG4jXHRcdFx0XHRcdFx0XHR0b2FzdHI/LmVycm9yPyhlcnJvcilcclxuI1x0XHRcdFx0XHRzdWNjZXNzOiAocmVzdWx0KSAtPlxyXG4jXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJyZXN1bHQuLi4uLi4uLi4uLi4uLi4uLi4uI3tyZXN1bHR9XCIpXHJcblxyXG5cdFx0aW1wb3J0OlxyXG5cdFx0XHRsYWJlbDogXCLlr7zlhaVcIlxyXG5cdFx0XHR2aXNpYmxlOiB0cnVlXHJcblx0XHRcdG9uOiBcImxpc3RcIlxyXG5cdFx0XHR0b2RvOiAob2JqZWN0X25hbWUpLT5cclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIm9iamVjdF9uYW1lXCIsIG9iamVjdF9uYW1lKVxyXG5cdFx0XHRcdE1vZGFsLnNob3coXCJBUFBhY2thZ2VJbXBvcnRNb2RhbFwiKVxyXG4iLCJDcmVhdG9yLk9iamVjdHMuYXBwbGljYXRpb25fcGFja2FnZSA9IHtcbiAgbmFtZTogXCJhcHBsaWNhdGlvbl9wYWNrYWdlXCIsXG4gIGljb246IFwiY3VzdG9tLmN1c3RvbTQyXCIsXG4gIGxhYmVsOiBcIui9r+S7tuWMhVwiLFxuICBoaWRkZW46IHRydWUsXG4gIGZpZWxkczoge1xuICAgIG5hbWU6IHtcbiAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgbGFiZWw6IFwi5ZCN56ewXCJcbiAgICB9LFxuICAgIGFwcHM6IHtcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICBsYWJlbDogXCLlupTnlKhcIixcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICByZWZlcmVuY2VfdG86IFwiYXBwc1wiLFxuICAgICAgbXVsdGlwbGU6IHRydWUsXG4gICAgICBvcHRpb25zRnVuY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX29wdGlvbnM7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChDcmVhdG9yLkFwcHMsIGZ1bmN0aW9uKG8sIGspIHtcbiAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICBsYWJlbDogby5uYW1lLFxuICAgICAgICAgICAgdmFsdWU6IGssXG4gICAgICAgICAgICBpY29uOiBvLmljb25fc2xkc1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zO1xuICAgICAgfVxuICAgIH0sXG4gICAgb2JqZWN0czoge1xuICAgICAgdHlwZTogXCJsb29rdXBcIixcbiAgICAgIGxhYmVsOiBcIuWvueixoVwiLFxuICAgICAgcmVmZXJlbmNlX3RvOiBcIm9iamVjdHNcIixcbiAgICAgIG11bHRpcGxlOiB0cnVlLFxuICAgICAgb3B0aW9uc0Z1bmN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9vcHRpb25zO1xuICAgICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goQ3JlYXRvci5vYmplY3RzQnlOYW1lLCBmdW5jdGlvbihvLCBrKSB7XG4gICAgICAgICAgaWYgKCFvLmhpZGRlbikge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgICBsYWJlbDogby5sYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWU6IGssXG4gICAgICAgICAgICAgIGljb246IG8uaWNvblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zO1xuICAgICAgfVxuICAgIH0sXG4gICAgbGlzdF92aWV3czoge1xuICAgICAgdHlwZTogXCJsb29rdXBcIixcbiAgICAgIGxhYmVsOiBcIuWIl+ihqOinhuWbvlwiLFxuICAgICAgbXVsdGlwbGU6IHRydWUsXG4gICAgICByZWZlcmVuY2VfdG86IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgb3B0aW9uc01ldGhvZDogXCJjcmVhdG9yLmxpc3R2aWV3c19vcHRpb25zXCJcbiAgICB9LFxuICAgIHBlcm1pc3Npb25fc2V0OiB7XG4gICAgICB0eXBlOiBcImxvb2t1cFwiLFxuICAgICAgbGFiZWw6IFwi5p2D6ZmQ6ZuGXCIsXG4gICAgICBtdWx0aXBsZTogdHJ1ZSxcbiAgICAgIHJlZmVyZW5jZV90bzogXCJwZXJtaXNzaW9uX3NldFwiXG4gICAgfSxcbiAgICBwZXJtaXNzaW9uX29iamVjdHM6IHtcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICBsYWJlbDogXCLmnYPpmZDpm4ZcIixcbiAgICAgIG11bHRpcGxlOiB0cnVlLFxuICAgICAgcmVmZXJlbmNlX3RvOiBcInBlcm1pc3Npb25fb2JqZWN0c1wiXG4gICAgfSxcbiAgICByZXBvcnRzOiB7XG4gICAgICB0eXBlOiBcImxvb2t1cFwiLFxuICAgICAgbGFiZWw6IFwi5oql6KGoXCIsXG4gICAgICBtdWx0aXBsZTogdHJ1ZSxcbiAgICAgIHJlZmVyZW5jZV90bzogXCJyZXBvcnRzXCJcbiAgICB9XG4gIH0sXG4gIGxpc3Rfdmlld3M6IHtcbiAgICBhbGw6IHtcbiAgICAgIGxhYmVsOiBcIuaJgOaciVwiLFxuICAgICAgY29sdW1uczogW1wibmFtZVwiXSxcbiAgICAgIGZpbHRlcl9zY29wZTogXCJzcGFjZVwiXG4gICAgfVxuICB9LFxuICBhY3Rpb25zOiB7XG4gICAgaW5pdF9kYXRhOiB7XG4gICAgICBsYWJlbDogXCLliJ3lp4vljJZcIixcbiAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICBvbjogXCJyZWNvcmRcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgICBjb25zb2xlLmxvZyhvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpO1xuICAgICAgICByZXR1cm4gTWV0ZW9yLmNhbGwoXCJhcHBQYWNrYWdlLmluaXRfZXhwb3J0X2RhdGFcIiwgU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLCByZWNvcmRfaWQsIGZ1bmN0aW9uKGVycm9yLCByZXN1bHQpIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiB0b2FzdHIuZXJyb3IoZXJyb3IucmVhc29uKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRvYXN0ci5zdWNjZXNzKFwi5Yid5aeL5YyW5a6M5oiQXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcImV4cG9ydFwiOiB7XG4gICAgICBsYWJlbDogXCLlr7zlh7pcIixcbiAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICBvbjogXCJyZWNvcmRcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgICB2YXIgdXJsO1xuICAgICAgICBjb25zb2xlLmxvZyhcIuWvvOWHulwiICsgb2JqZWN0X25hbWUgKyBcIi0+XCIgKyByZWNvcmRfaWQpO1xuICAgICAgICB1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwaS9jcmVhdG9yL2FwcF9wYWNrYWdlL2V4cG9ydC9cIiArIChTZXNzaW9uLmdldChcInNwYWNlSWRcIikpICsgXCIvXCIgKyByZWNvcmRfaWQpO1xuICAgICAgICByZXR1cm4gd2luZG93Lm9wZW4odXJsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiaW1wb3J0XCI6IHtcbiAgICAgIGxhYmVsOiBcIuWvvOWFpVwiLFxuICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgIG9uOiBcImxpc3RcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwib2JqZWN0X25hbWVcIiwgb2JqZWN0X25hbWUpO1xuICAgICAgICByZXR1cm4gTW9kYWwuc2hvdyhcIkFQUGFja2FnZUltcG9ydE1vZGFsXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2FwaS9jcmVhdG9yL2FwcF9wYWNrYWdlL2V4cG9ydC86c3BhY2VfaWQvOnJlY29yZF9pZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHR0cnlcclxuXHJcblx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xyXG5cclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRcdGNvZGU6IDQwMVxyXG5cdFx0XHRcdGRhdGE6IHtlcnJvcnM6IFwiQXV0aGVudGljYXRpb24gaXMgcmVxdWlyZWQgYW5kIGhhcyBub3QgYmVlbiBwcm92aWRlZC5cIn1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRyZWNvcmRfaWQgPSByZXEucGFyYW1zLnJlY29yZF9pZFxyXG5cdFx0c3BhY2VfaWQgPSByZXEucGFyYW1zLnNwYWNlX2lkXHJcblxyXG5cdFx0aWYgIUNyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCB1c2VySWQpXHJcblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0XHRjb2RlOiA0MDFcclxuXHRcdFx0XHRkYXRhOiB7ZXJyb3JzOiBcIlBlcm1pc3Npb24gZGVuaWVkXCJ9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwbGljYXRpb25fcGFja2FnZVwiKS5maW5kT25lKHtfaWQ6IHJlY29yZF9pZH0pXHJcblxyXG5cdFx0aWYgIXJlY29yZFxyXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdFx0Y29kZTogNDA0XHJcblx0XHRcdFx0ZGF0YToge2Vycm9yczogXCJDb2xsZWN0aW9uIG5vdCBmb3VuZCBmb3IgdGhlIHNlZ21lbnQgI3tyZWNvcmRfaWR9XCJ9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0c3BhY2VfdXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCwgc3BhY2U6IHJlY29yZC5zcGFjZX0pXHJcblxyXG5cdFx0aWYgIXNwYWNlX3VzZXJcclxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRcdGNvZGU6IDQwMVxyXG5cdFx0XHRcdGRhdGE6IHtlcnJvcnM6IFwiVXNlciBkb2VzIG5vdCBoYXZlIHByaXZpbGVnZXMgdG8gYWNjZXNzIHRoZSBlbnRpdHlcIn1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRkYXRhID0gQVBUcmFuc2Zvcm0uZXhwb3J0IHJlY29yZFxyXG5cclxuXHRcdGRhdGEuZGF0YVNvdXJjZSA9IE1ldGVvci5hYnNvbHV0ZVVybChcImFwaS9jcmVhdG9yL2FwcF9wYWNrYWdlL2V4cG9ydC8je3NwYWNlX2lkfS8je3JlY29yZF9pZH1cIilcclxuXHJcblx0XHRmaWxlTmFtZSA9IHJlY29yZC5uYW1lIHx8IFwiYXBwbGljYXRpb25fcGFja2FnZVwiXHJcblxyXG5cdFx0cmVzLnNldEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtbXNkb3dubG9hZCcpO1xyXG5cdFx0cmVzLnNldEhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicsICdhdHRhY2htZW50O2ZpbGVuYW1lPScrZW5jb2RlVVJJKGZpbGVOYW1lKSsnLmpzb24nKTtcclxuXHRcdHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgNCkpXHJcblx0Y2F0Y2ggZVxyXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRkYXRhOiB7IGVycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlIH1cclxuXHRcdH1cclxuXHJcbiIsIkpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS9jcmVhdG9yL2FwcF9wYWNrYWdlL2V4cG9ydC86c3BhY2VfaWQvOnJlY29yZF9pZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBkYXRhLCBlLCBmaWxlTmFtZSwgcmVjb3JkLCByZWNvcmRfaWQsIHNwYWNlX2lkLCBzcGFjZV91c2VyLCB1c2VySWQ7XG4gIHRyeSB7XG4gICAgdXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBlcnJvcnM6IFwiQXV0aGVudGljYXRpb24gaXMgcmVxdWlyZWQgYW5kIGhhcyBub3QgYmVlbiBwcm92aWRlZC5cIlxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVjb3JkX2lkID0gcmVxLnBhcmFtcy5yZWNvcmRfaWQ7XG4gICAgc3BhY2VfaWQgPSByZXEucGFyYW1zLnNwYWNlX2lkO1xuICAgIGlmICghQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIHVzZXJJZCkpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXJyb3JzOiBcIlBlcm1pc3Npb24gZGVuaWVkXCJcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImFwcGxpY2F0aW9uX3BhY2thZ2VcIikuZmluZE9uZSh7XG4gICAgICBfaWQ6IHJlY29yZF9pZFxuICAgIH0pO1xuICAgIGlmICghcmVjb3JkKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwNCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGVycm9yczogXCJDb2xsZWN0aW9uIG5vdCBmb3VuZCBmb3IgdGhlIHNlZ21lbnQgXCIgKyByZWNvcmRfaWRcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNwYWNlX3VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiByZWNvcmQuc3BhY2VcbiAgICB9KTtcbiAgICBpZiAoIXNwYWNlX3VzZXIpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXJyb3JzOiBcIlVzZXIgZG9lcyBub3QgaGF2ZSBwcml2aWxlZ2VzIHRvIGFjY2VzcyB0aGUgZW50aXR5XCJcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRhdGEgPSBBUFRyYW5zZm9ybVtcImV4cG9ydFwiXShyZWNvcmQpO1xuICAgIGRhdGEuZGF0YVNvdXJjZSA9IE1ldGVvci5hYnNvbHV0ZVVybChcImFwaS9jcmVhdG9yL2FwcF9wYWNrYWdlL2V4cG9ydC9cIiArIHNwYWNlX2lkICsgXCIvXCIgKyByZWNvcmRfaWQpO1xuICAgIGZpbGVOYW1lID0gcmVjb3JkLm5hbWUgfHwgXCJhcHBsaWNhdGlvbl9wYWNrYWdlXCI7XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtbXNkb3dubG9hZCcpO1xuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnYXR0YWNobWVudDtmaWxlbmFtZT0nICsgZW5jb2RlVVJJKGZpbGVOYW1lKSArICcuanNvbicpO1xuICAgIHJldHVybiByZXMuZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsIDQpKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsInRyYW5zZm9ybUZpbHRlcnMgPSAoZmlsdGVycyktPlxyXG5cdF9maWx0ZXJzID0gW11cclxuXHRfLmVhY2ggZmlsdGVycywgKGYpLT5cclxuXHRcdGlmIF8uaXNBcnJheShmKSAmJiBmLmxlbmd0aCA9PSAzXHJcblx0XHRcdF9maWx0ZXJzLnB1c2gge2ZpZWxkOiBmWzBdLCBvcGVyYXRpb246IGZbMV0sIHZhbHVlOiBmWzJdfVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRfZmlsdGVycy5wdXNoIGZcclxuXHRyZXR1cm4gX2ZpbHRlcnNcclxuXHJcbnRyYW5zZm9ybUZpZWxkT3B0aW9ucyA9IChvcHRpb25zKS0+XHJcblx0aWYgIV8uaXNBcnJheShvcHRpb25zKVxyXG5cdFx0cmV0dXJuIG9wdGlvbnNcclxuXHJcblx0X29wdGlvbnMgPSBbXVxyXG5cclxuXHRfLmVhY2ggb3B0aW9ucywgKG8pLT5cclxuXHRcdGlmIG8gJiYgXy5oYXMobywgJ2xhYmVsJykgJiYgXy5oYXMobywgJ3ZhbHVlJylcclxuXHRcdFx0X29wdGlvbnMucHVzaCBcIiN7by5sYWJlbH06I3tvLnZhbHVlfVwiXHJcblxyXG5cdHJldHVybiBfb3B0aW9ucy5qb2luKCcsJylcclxuXHJcblxyXG5DcmVhdG9yLmltcG9ydE9iamVjdCA9ICh1c2VySWQsIHNwYWNlX2lkLCBvYmplY3QsIGxpc3Rfdmlld3NfaWRfbWFwcykgLT5cclxuXHRjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0taW1wb3J0T2JqZWN0LS0tLS0tLS0tLS0tLS0tLS0tJywgb2JqZWN0Lm5hbWUpXHJcblx0ZmllbGRzID0gb2JqZWN0LmZpZWxkc1xyXG5cdHRyaWdnZXJzID0gb2JqZWN0LnRyaWdnZXJzXHJcblx0YWN0aW9ucyA9IG9iamVjdC5hY3Rpb25zXHJcblx0b2JqX2xpc3Rfdmlld3MgPSBvYmplY3QubGlzdF92aWV3c1xyXG5cclxuXHRkZWxldGUgb2JqZWN0Ll9pZFxyXG5cdGRlbGV0ZSBvYmplY3QuZmllbGRzXHJcblx0ZGVsZXRlIG9iamVjdC50cmlnZ2Vyc1xyXG5cdGRlbGV0ZSBvYmplY3QuYWN0aW9uc1xyXG5cdGRlbGV0ZSBvYmplY3QucGVybWlzc2lvbnMgI+WIoOmZpHBlcm1pc3Npb25z5Yqo5oCB5bGe5oCnXHJcblx0ZGVsZXRlIG9iamVjdC5saXN0X3ZpZXdzXHJcblxyXG5cdG9iamVjdC5zcGFjZSA9IHNwYWNlX2lkXHJcblx0b2JqZWN0Lm93bmVyID0gdXNlcklkXHJcblxyXG5cdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikuaW5zZXJ0KG9iamVjdClcclxuXHJcblx0IyAyLjEg5oyB5LmF5YyW5a+56LGhbGlzdF92aWV3c1xyXG5cdGludGVybmFsX2xpc3RfdmlldyA9IHt9XHJcblxyXG5cdGhhc1JlY2VudFZpZXcgPSBmYWxzZVxyXG5cdGNvbnNvbGUubG9nKCfmjIHkuYXljJblr7nosaFsaXN0X3ZpZXdzJyk7XHJcblx0Xy5lYWNoIG9ial9saXN0X3ZpZXdzLCAobGlzdF92aWV3KS0+XHJcblx0XHRvbGRfaWQgPSBsaXN0X3ZpZXcuX2lkXHJcblx0XHRkZWxldGUgbGlzdF92aWV3Ll9pZFxyXG5cdFx0bGlzdF92aWV3LnNwYWNlID0gc3BhY2VfaWRcclxuXHRcdGxpc3Rfdmlldy5vd25lciA9IHVzZXJJZFxyXG5cdFx0bGlzdF92aWV3Lm9iamVjdF9uYW1lID0gb2JqZWN0Lm5hbWVcclxuXHRcdGlmIENyZWF0b3IuaXNSZWNlbnRWaWV3KGxpc3RfdmlldylcclxuXHRcdFx0aGFzUmVjZW50VmlldyA9IHRydWVcclxuXHJcblx0XHRpZiBsaXN0X3ZpZXcuZmlsdGVyc1xyXG5cdFx0XHRsaXN0X3ZpZXcuZmlsdGVycyA9IHRyYW5zZm9ybUZpbHRlcnMobGlzdF92aWV3LmZpbHRlcnMpXHJcblxyXG5cdFx0aWYgQ3JlYXRvci5pc0FsbFZpZXcobGlzdF92aWV3KSB8fCBDcmVhdG9yLmlzUmVjZW50VmlldyhsaXN0X3ZpZXcpXHJcblx0IyDliJvlu7pvYmplY3Tml7bvvIzkvJroh6rliqjmt7vliqBhbGwgdmlld+OAgXJlY2VudCB2aWV3XHJcblxyXG5cdFx0XHRvcHRpb25zID0geyRzZXQ6IGxpc3Rfdmlld31cclxuXHJcblx0XHRcdGlmICFsaXN0X3ZpZXcuY29sdW1uc1xyXG5cdFx0XHRcdG9wdGlvbnMuJHVuc2V0ID0ge2NvbHVtbnM6ICcnfVxyXG5cclxuXHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS51cGRhdGUoe29iamVjdF9uYW1lOiBvYmplY3QubmFtZSwgbmFtZTogbGlzdF92aWV3Lm5hbWUsIHNwYWNlOiBzcGFjZV9pZH0sIG9wdGlvbnMpXHJcblx0XHRlbHNlXHJcblx0XHRcdG5ld19pZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuaW5zZXJ0KGxpc3RfdmlldylcclxuXHRcdFx0bGlzdF92aWV3c19pZF9tYXBzW29iamVjdC5uYW1lICsgXCJfXCIgKyBvbGRfaWRdID0gbmV3X2lkXHJcblxyXG5cdGlmICFoYXNSZWNlbnRWaWV3XHJcblx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLnJlbW92ZSh7bmFtZTogXCJyZWNlbnRcIiwgc3BhY2U6IHNwYWNlX2lkLCBvYmplY3RfbmFtZTogb2JqZWN0Lm5hbWUsIG93bmVyOiB1c2VySWR9KVxyXG5cdGNvbnNvbGUubG9nKCfmjIHkuYXljJblr7nosaHlrZfmrrUnKTtcclxuXHQjIDIuMiDmjIHkuYXljJblr7nosaHlrZfmrrVcclxuXHJcblx0X2ZpZWxkbmFtZXMgPSBbXVxyXG5cclxuXHRfLmVhY2ggZmllbGRzLCAoZmllbGQsIGspLT5cclxuXHRcdGRlbGV0ZSBmaWVsZC5faWRcclxuXHRcdGZpZWxkLnNwYWNlID0gc3BhY2VfaWRcclxuXHRcdGZpZWxkLm93bmVyID0gdXNlcklkXHJcblx0XHRmaWVsZC5vYmplY3QgPSBvYmplY3QubmFtZVxyXG5cclxuXHRcdGlmIGZpZWxkLm9wdGlvbnNcclxuXHRcdFx0ZmllbGQub3B0aW9ucyA9IHRyYW5zZm9ybUZpZWxkT3B0aW9ucyhmaWVsZC5vcHRpb25zKVxyXG5cclxuXHRcdGlmICFfLmhhcyhmaWVsZCwgXCJuYW1lXCIpXHJcblx0XHRcdGZpZWxkLm5hbWUgPSBrXHJcblxyXG5cdFx0X2ZpZWxkbmFtZXMucHVzaCBmaWVsZC5uYW1lXHJcblxyXG5cdFx0aWYgZmllbGQubmFtZSA9PSBcIm5hbWVcIlxyXG5cdFx0XHQjIOWIm+W7um9iamVjdOaXtu+8jOS8muiHquWKqOa3u+WKoG5hbWXlrZfmrrXvvIzlm6DmraTlnKjmraTlpITlr7luYW1l5a2X5q616L+b6KGM5pu05pawXHJcblx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9maWVsZHNcIikudXBkYXRlKHtvYmplY3Q6IG9iamVjdC5uYW1lLCBuYW1lOiBcIm5hbWVcIiwgc3BhY2U6IHNwYWNlX2lkfSwgeyRzZXQ6IGZpZWxkfSlcclxuXHRcdGVsc2VcclxuXHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS5pbnNlcnQoZmllbGQpXHJcblxyXG5cdFx0aWYgIV8uY29udGFpbnMoX2ZpZWxkbmFtZXMsICduYW1lJylcclxuXHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS5kaXJlY3QucmVtb3ZlKHtvYmplY3Q6IG9iamVjdC5uYW1lLCBuYW1lOiBcIm5hbWVcIiwgc3BhY2U6IHNwYWNlX2lkfSlcclxuXHJcblx0Y29uc29sZS5sb2coJ+aMgeS5heWMluinpuWPkeWZqCcpO1xyXG5cdCMgMi4zIOaMgeS5heWMluinpuWPkeWZqFxyXG5cdF8uZWFjaCB0cmlnZ2VycywgKHRyaWdnZXIsIGspLT5cclxuXHRcdGRlbGV0ZSB0cmlnZ2Vycy5faWRcclxuXHRcdHRyaWdnZXIuc3BhY2UgPSBzcGFjZV9pZFxyXG5cdFx0dHJpZ2dlci5vd25lciA9IHVzZXJJZFxyXG5cdFx0dHJpZ2dlci5vYmplY3QgPSBvYmplY3QubmFtZVxyXG5cdFx0aWYgIV8uaGFzKHRyaWdnZXIsIFwibmFtZVwiKVxyXG5cdFx0XHR0cmlnZ2VyLm5hbWUgPSBrLnJlcGxhY2UobmV3IFJlZ0V4cChcIlxcXFwuXCIsIFwiZ1wiKSwgXCJfXCIpXHJcblxyXG5cdFx0aWYgIV8uaGFzKHRyaWdnZXIsIFwiaXNfZW5hYmxlXCIpXHJcblx0XHRcdHRyaWdnZXIuaXNfZW5hYmxlID0gdHJ1ZVxyXG5cclxuXHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF90cmlnZ2Vyc1wiKS5pbnNlcnQodHJpZ2dlcilcclxuXHRjb25zb2xlLmxvZygn5oyB5LmF5YyW5pON5L2cJyk7XHJcblx0IyAyLjQg5oyB5LmF5YyW5pON5L2cXHJcblx0Xy5lYWNoIGFjdGlvbnMsIChhY3Rpb24sIGspLT5cclxuXHRcdGRlbGV0ZSBhY3Rpb24uX2lkXHJcblx0XHRhY3Rpb24uc3BhY2UgPSBzcGFjZV9pZFxyXG5cdFx0YWN0aW9uLm93bmVyID0gdXNlcklkXHJcblx0XHRhY3Rpb24ub2JqZWN0ID0gb2JqZWN0Lm5hbWVcclxuXHRcdGlmICFfLmhhcyhhY3Rpb24sIFwibmFtZVwiKVxyXG5cdFx0XHRhY3Rpb24ubmFtZSA9IGsucmVwbGFjZShuZXcgUmVnRXhwKFwiXFxcXC5cIiwgXCJnXCIpLCBcIl9cIilcclxuXHRcdGlmICFfLmhhcyhhY3Rpb24sIFwiaXNfZW5hYmxlXCIpXHJcblx0XHRcdGFjdGlvbi5pc19lbmFibGUgPSB0cnVlXHJcblx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfYWN0aW9uc1wiKS5pbnNlcnQoYWN0aW9uKVxyXG5cclxuXHRjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0taW1wb3J0T2JqZWN0IGVuZC0tLS0tLS0tLS0tLS0tLS0tLScsIG9iamVjdC5uYW1lKVxyXG5cclxuQ3JlYXRvci5pbXBvcnRfYXBwX3BhY2thZ2UgPSAodXNlcklkLCBzcGFjZV9pZCwgaW1wX2RhdGEsIGZyb21fdGVtcGxhdGUpLT5cclxuXHRpZiAhdXNlcklkXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNDAxXCIsIFwiQXV0aGVudGljYXRpb24gaXMgcmVxdWlyZWQgYW5kIGhhcyBub3QgYmVlbiBwcm92aWRlZC5cIilcclxuXHJcblx0aWYgIUNyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCB1c2VySWQpXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNDAxXCIsIFwiUGVybWlzc2lvbiBkZW5pZWQuXCIpXHJcblxyXG5cdCMjI+aVsOaNruagoemqjCDlvIDlp4sjIyNcclxuXHRjaGVjayhpbXBfZGF0YSwgT2JqZWN0KVxyXG5cdGlmICFmcm9tX3RlbXBsYXRlXHJcblx0XHQjIDEgYXBwc+agoemqjO+8muagueaNrl9pZOWIpOaWreW6lOeUqOaYr+WQpuW3suWtmOWcqFxyXG5cdFx0aW1wX2FwcF9pZHMgPSBfLnBsdWNrKGltcF9kYXRhLmFwcHMsIFwiX2lkXCIpXHJcblx0XHRpZiBfLmlzQXJyYXkoaW1wX2RhdGEuYXBwcykgJiYgaW1wX2RhdGEuYXBwcy5sZW5ndGggPiAwXHJcblx0XHRcdF8uZWFjaCBpbXBfZGF0YS5hcHBzLCAoYXBwKS0+XHJcblx0XHRcdFx0aWYgXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLkFwcHMpLCBhcHAuX2lkKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuW6lOeUqCcje2FwcC5uYW1lfSflt7LlrZjlnKhcIilcclxuXHJcblx0XHQjIDIgb2JqZWN0c+agoemqjO+8muagueaNrm9iamVjdC5uYW1l5Yik5pat5a+56LGh5piv5ZCm5bey5a2Y5ZyoOyDmoKHpqox0cmlnZ2Vyc1xyXG5cdFx0aWYgXy5pc0FycmF5KGltcF9kYXRhLm9iamVjdHMpICYmIGltcF9kYXRhLm9iamVjdHMubGVuZ3RoID4gMFxyXG5cdFx0XHRfLmVhY2ggaW1wX2RhdGEub2JqZWN0cywgKG9iamVjdCktPlxyXG5cdFx0XHRcdGlmIF8uaW5jbHVkZShfLmtleXMoQ3JlYXRvci5PYmplY3RzKSwgb2JqZWN0Lm5hbWUpXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5a+56LGhJyN7b2JqZWN0Lm5hbWV9J+W3suWtmOWcqFwiKVxyXG5cdFx0XHRcdF8uZWFjaCBvYmplY3QudHJpZ2dlcnMsICh0cmlnZ2VyKS0+XHJcblx0XHRcdFx0XHRpZiB0cmlnZ2VyLm9uID09ICdzZXJ2ZXInICYmICFTdGVlZG9zLmlzTGVnYWxWZXJzaW9uKHNwYWNlX2lkLFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiKVxyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCLlj6rmnInkvIHkuJrniYjmlK/mjIHphY3nva7mnI3liqHnq6/nmoTop6blj5HlmahcIlxyXG5cclxuXHRcdGltcF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKGltcF9kYXRhLm9iamVjdHMsIFwibmFtZVwiKVxyXG5cdFx0b2JqZWN0X25hbWVzID0gXy5rZXlzKENyZWF0b3IuT2JqZWN0cylcclxuXHJcblx0XHQjIDMg5Yik5patYXBwc+eahOWvueixoeaYr+WQpumDveWtmOWcqFxyXG5cdFx0aWYgXy5pc0FycmF5KGltcF9kYXRhLmFwcHMpICYmIGltcF9kYXRhLmFwcHMubGVuZ3RoID4gMFxyXG5cdFx0XHRfLmVhY2ggaW1wX2RhdGEuYXBwcywgKGFwcCktPlxyXG5cdFx0XHRcdF8uZWFjaCBhcHAub2JqZWN0cywgKG9iamVjdF9uYW1lKS0+XHJcblx0XHRcdFx0XHRpZiAhXy5pbmNsdWRlKG9iamVjdF9uYW1lcywgb2JqZWN0X25hbWUpICYmICFfLmluY2x1ZGUoaW1wX29iamVjdF9uYW1lcywgb2JqZWN0X25hbWUpXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLlupTnlKgnI3thcHAubmFtZX0n5Lit5oyH5a6a55qE5a+56LGhJyN7b2JqZWN0X25hbWV9J+S4jeWtmOWcqFwiKVxyXG5cclxuXHRcdCMgNCBsaXN0X3ZpZXdz5qCh6aqM77ya5Yik5patbGlzdF92aWV3c+WvueW6lOeahG9iamVjdOaYr+WQpuWtmOWcqFxyXG5cdFx0aWYgXy5pc0FycmF5KGltcF9kYXRhLmxpc3Rfdmlld3MpICYmIGltcF9kYXRhLmxpc3Rfdmlld3MubGVuZ3RoID4gMFxyXG5cdFx0XHRfLmVhY2ggaW1wX2RhdGEubGlzdF92aWV3cywgKGxpc3RfdmlldyktPlxyXG5cdFx0XHRcdGlmICFsaXN0X3ZpZXcub2JqZWN0X25hbWUgfHwgIV8uaXNTdHJpbmcobGlzdF92aWV3Lm9iamVjdF9uYW1lKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuWIl+ihqOinhuWbvicje2xpc3Rfdmlldy5uYW1lfSfnmoRvYmplY3RfbmFtZeWxnuaAp+aXoOaViFwiKVxyXG5cdFx0XHRcdGlmICFfLmluY2x1ZGUob2JqZWN0X25hbWVzLCBsaXN0X3ZpZXcub2JqZWN0X25hbWUpICYmICFfLmluY2x1ZGUoaW1wX29iamVjdF9uYW1lcywgbGlzdF92aWV3Lm9iamVjdF9uYW1lKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuWIl+ihqOinhuWbvicje2xpc3Rfdmlldy5uYW1lfSfkuK3mjIflrprnmoTlr7nosaEnI3tsaXN0X3ZpZXcub2JqZWN0X25hbWV9J+S4jeWtmOWcqFwiKVxyXG5cclxuXHRcdCMgNSBwZXJtaXNzaW9uX3NldOagoemqjO+8muWIpOaWreadg+mZkOmbhuS4reeahOaOiOadg+W6lOeUqGFzc2lnbmVkX2FwcHM7IOadg+mZkOmbhueahOWQjeensOS4jeWFgeiuuOmHjeWkjVxyXG5cdFx0cGVybWlzc2lvbl9zZXRfaWRzID0gXy5wbHVjayhpbXBfZGF0YS5wZXJtaXNzaW9uX3NldCwgXCJfaWRcIilcclxuXHRcdGlmIF8uaXNBcnJheShpbXBfZGF0YS5wZXJtaXNzaW9uX3NldCkgJiYgaW1wX2RhdGEucGVybWlzc2lvbl9zZXQubGVuZ3RoID4gMFxyXG5cdFx0XHRfLmVhY2ggaW1wX2RhdGEucGVybWlzc2lvbl9zZXQsIChwZXJtaXNzaW9uX3NldCktPlxyXG5cdFx0XHRcdGlmIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgbmFtZTogcGVybWlzc2lvbl9zZXQubmFtZX0se2ZpZWxkczp7X2lkOjF9fSlcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuadg+mZkOmbhuWQjeensCcje3Blcm1pc3Npb25fc2V0Lm5hbWV9J+S4jeiDvemHjeWkjVwiXHJcblx0XHRcdFx0Xy5lYWNoIHBlcm1pc3Npb25fc2V0LmFzc2lnbmVkX2FwcHMsIChhcHBfaWQpLT5cclxuXHRcdFx0XHRcdGlmICFfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuQXBwcyksIGFwcF9pZCkgJiYgIV8uaW5jbHVkZShpbXBfYXBwX2lkcywgYXBwX2lkKVxyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5p2D6ZmQ6ZuGJyN7cGVybWlzc2lvbl9zZXQubmFtZX0n55qE5o6I5p2D5bqU55SoJyN7YXBwX2lkfSfkuI3lrZjlnKhcIilcclxuXHJcblx0XHQjIDYgcGVybWlzc2lvbl9vYmplY3Rz5qCh6aqM77ya5Yik5pat5p2D6ZmQ6ZuG5Lit5oyH5a6a55qEb2JqZWN05piv5ZCm5a2Y5Zyo77yb5Yik5pat5p2D6ZmQ6ZuG5qCH6K+G5piv5piv5ZCm5pyJ5pWIXHJcblx0XHRpZiBfLmlzQXJyYXkoaW1wX2RhdGEucGVybWlzc2lvbl9vYmplY3RzKSAmJiBpbXBfZGF0YS5wZXJtaXNzaW9uX29iamVjdHMubGVuZ3RoID4gMFxyXG5cdFx0XHRfLmVhY2ggaW1wX2RhdGEucGVybWlzc2lvbl9vYmplY3RzLCAocGVybWlzc2lvbl9vYmplY3QpLT5cclxuXHRcdFx0XHRpZiAhcGVybWlzc2lvbl9vYmplY3Qub2JqZWN0X25hbWUgfHwgIV8uaXNTdHJpbmcocGVybWlzc2lvbl9vYmplY3Qub2JqZWN0X25hbWUpXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5p2D6ZmQ6ZuGJyN7cGVybWlzc2lvbl9vYmplY3QubmFtZX0n55qEb2JqZWN0X25hbWXlsZ7mgKfml6DmlYhcIilcclxuXHRcdFx0XHRpZiAhXy5pbmNsdWRlKG9iamVjdF9uYW1lcywgcGVybWlzc2lvbl9vYmplY3Qub2JqZWN0X25hbWUpICYmICFfLmluY2x1ZGUoaW1wX29iamVjdF9uYW1lcywgcGVybWlzc2lvbl9vYmplY3Qub2JqZWN0X25hbWUpXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5p2D6ZmQ6ZuGJyN7bGlzdF92aWV3Lm5hbWV9J+S4reaMh+WumueahOWvueixoScje3Blcm1pc3Npb25fb2JqZWN0Lm9iamVjdF9uYW1lfSfkuI3lrZjlnKhcIilcclxuXHJcblx0XHRcdFx0aWYgIV8uaGFzKHBlcm1pc3Npb25fb2JqZWN0LCBcInBlcm1pc3Npb25fc2V0X2lkXCIpIHx8ICFfLmlzU3RyaW5nKHBlcm1pc3Npb25fb2JqZWN0LnBlcm1pc3Npb25fc2V0X2lkKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuadg+mZkOmbhicje3Blcm1pc3Npb25fb2JqZWN0Lm5hbWV9J+eahHBlcm1pc3Npb25fc2V0X2lk5bGe5oCn5peg5pWIXCIpXHJcblx0XHRcdFx0ZWxzZSBpZiAhXy5pbmNsdWRlKHBlcm1pc3Npb25fc2V0X2lkcywgcGVybWlzc2lvbl9vYmplY3QucGVybWlzc2lvbl9zZXRfaWQpXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5p2D6ZmQ6ZuGJyN7cGVybWlzc2lvbl9vYmplY3QubmFtZX0n5oyH5a6a55qE5p2D6ZmQ6ZuGJyN7cGVybWlzc2lvbl9vYmplY3QucGVybWlzc2lvbl9zZXRfaWR9J+WAvOS4jeWcqOWvvOWFpeeahHBlcm1pc3Npb25fc2V05LitXCIpXHJcblxyXG5cdFx0IyA3IHJlcG9ydHPmoKHpqozvvJrliKTmlq3miqXooajkuK3mjIflrprnmoRvYmplY3TmmK/lkKblrZjlnKhcclxuXHRcdGlmIF8uaXNBcnJheShpbXBfZGF0YS5yZXBvcnRzKSAmJiBpbXBfZGF0YS5yZXBvcnRzLmxlbmd0aCA+IDBcclxuXHRcdFx0Xy5lYWNoIGltcF9kYXRhLnJlcG9ydHMsIChyZXBvcnQpLT5cclxuXHRcdFx0XHRpZiAhcmVwb3J0Lm9iamVjdF9uYW1lIHx8ICFfLmlzU3RyaW5nKHJlcG9ydC5vYmplY3RfbmFtZSlcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLmiqXooagnI3tyZXBvcnQubmFtZX0n55qEb2JqZWN0X25hbWXlsZ7mgKfml6DmlYhcIilcclxuXHRcdFx0XHRpZiAhXy5pbmNsdWRlKG9iamVjdF9uYW1lcywgcmVwb3J0Lm9iamVjdF9uYW1lKSAmJiAhXy5pbmNsdWRlKGltcF9vYmplY3RfbmFtZXMsIHJlcG9ydC5vYmplY3RfbmFtZSlcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLmiqXooagnI3tyZXBvcnQubmFtZX0n5Lit5oyH5a6a55qE5a+56LGhJyN7cmVwb3J0Lm9iamVjdF9uYW1lfSfkuI3lrZjlnKhcIilcclxuXHJcblx0IyMj5pWw5o2u5qCh6aqMIOe7k+adnyMjI1xyXG5cclxuXHQjIyPmlbDmja7mjIHkuYXljJYg5byA5aeLIyMjXHJcblxyXG5cdCMg5a6a5LmJ5paw5pen5pWw5o2u5a+55bqU5YWz57O76ZuG5ZCIXHJcblx0YXBwc19pZF9tYXBzID0ge31cclxuXHRsaXN0X3ZpZXdzX2lkX21hcHMgPSB7fVxyXG5cdHBlcm1pc3Npb25fc2V0X2lkX21hcHMgPSB7fVxyXG5cclxuXHQjIDEg5oyB5LmF5YyWQXBwc1xyXG5cdGlmIF8uaXNBcnJheShpbXBfZGF0YS5hcHBzKSAmJiBpbXBfZGF0YS5hcHBzLmxlbmd0aCA+IDBcclxuXHRcdF8uZWFjaCBpbXBfZGF0YS5hcHBzLCAoYXBwKS0+XHJcblx0XHRcdG9sZF9pZCA9IGFwcC5faWRcclxuXHRcdFx0ZGVsZXRlIGFwcC5faWRcclxuXHRcdFx0YXBwLnNwYWNlID0gc3BhY2VfaWRcclxuXHRcdFx0YXBwLm93bmVyID0gdXNlcklkXHJcblx0XHRcdGFwcC5pc19jcmVhdG9yID0gdHJ1ZVxyXG5cdFx0XHRuZXdfaWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBzXCIpLmluc2VydChhcHApXHJcblx0XHRcdGFwcHNfaWRfbWFwc1tvbGRfaWRdID0gbmV3X2lkXHJcblxyXG5cdCMgMiDmjIHkuYXljJZvYmplY3RzXHJcblx0aWYgXy5pc0FycmF5KGltcF9kYXRhLm9iamVjdHMpICYmIGltcF9kYXRhLm9iamVjdHMubGVuZ3RoID4gMFxyXG5cdFx0Xy5lYWNoIGltcF9kYXRhLm9iamVjdHMsIChvYmplY3QpLT5cclxuXHRcdFx0Q3JlYXRvci5pbXBvcnRPYmplY3QodXNlcklkLCBzcGFjZV9pZCwgb2JqZWN0LCBsaXN0X3ZpZXdzX2lkX21hcHMpXHJcblxyXG5cdCMgMyDmjIHkuYXljJZsaXN0X3ZpZXdzXHJcblx0aWYgXy5pc0FycmF5KGltcF9kYXRhLmxpc3Rfdmlld3MpICYmIGltcF9kYXRhLmxpc3Rfdmlld3MubGVuZ3RoID4gMFxyXG5cdFx0Xy5lYWNoIGltcF9kYXRhLmxpc3Rfdmlld3MsIChsaXN0X3ZpZXcpLT5cclxuXHRcdFx0b2xkX2lkID0gbGlzdF92aWV3Ll9pZFxyXG5cdFx0XHRkZWxldGUgbGlzdF92aWV3Ll9pZFxyXG5cclxuXHRcdFx0bGlzdF92aWV3LnNwYWNlID0gc3BhY2VfaWRcclxuXHRcdFx0bGlzdF92aWV3Lm93bmVyID0gdXNlcklkXHJcblx0XHRcdGlmIENyZWF0b3IuaXNBbGxWaWV3KGxpc3RfdmlldykgfHwgQ3JlYXRvci5pc1JlY2VudFZpZXcobGlzdF92aWV3KVxyXG5cdFx0XHRcdCMg5Yib5bu6b2JqZWN05pe277yM5Lya6Ieq5Yqo5re75YqgYWxsIHZpZXfjgIFyZWNlbnQgdmlld1xyXG5cdFx0XHRcdF9saXN0X3ZpZXcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmRPbmUoe29iamVjdF9uYW1lOiBsaXN0X3ZpZXcub2JqZWN0X25hbWUsIG5hbWU6IGxpc3Rfdmlldy5uYW1lLCBzcGFjZTogc3BhY2VfaWR9LHtmaWVsZHM6IHtfaWQ6IDF9fSlcclxuXHRcdFx0XHRpZiBfbGlzdF92aWV3XHJcblx0XHRcdFx0XHRuZXdfaWQgPSBfbGlzdF92aWV3Ll9pZFxyXG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikudXBkYXRlKHtvYmplY3RfbmFtZTogbGlzdF92aWV3Lm9iamVjdF9uYW1lLCBuYW1lOiBsaXN0X3ZpZXcubmFtZSwgc3BhY2U6IHNwYWNlX2lkfSwgeyRzZXQ6IGxpc3Rfdmlld30pXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRuZXdfaWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmluc2VydChsaXN0X3ZpZXcpXHJcblxyXG5cdFx0XHRsaXN0X3ZpZXdzX2lkX21hcHNbbGlzdF92aWV3Lm9iamVjdF9uYW1lICsgXCJfXCIgKyBvbGRfaWRdID0gbmV3X2lkXHJcblxyXG5cdCMgNCDmjIHkuYXljJZwZXJtaXNzaW9uX3NldFxyXG5cdGlmIF8uaXNBcnJheShpbXBfZGF0YS5wZXJtaXNzaW9uX3NldCkgJiYgaW1wX2RhdGEucGVybWlzc2lvbl9zZXQubGVuZ3RoID4gMFxyXG5cdFx0Xy5lYWNoIGltcF9kYXRhLnBlcm1pc3Npb25fc2V0LCAocGVybWlzc2lvbl9zZXQpLT5cclxuXHRcdFx0b2xkX2lkID0gcGVybWlzc2lvbl9zZXQuX2lkXHJcblx0XHRcdGRlbGV0ZSBwZXJtaXNzaW9uX3NldC5faWRcclxuXHJcblx0XHRcdHBlcm1pc3Npb25fc2V0LnNwYWNlID0gc3BhY2VfaWRcclxuXHRcdFx0cGVybWlzc2lvbl9zZXQub3duZXIgPSB1c2VySWRcclxuXHJcblx0XHRcdHBlcm1pc3Npb25fc2V0X3VzZXJzID0gW11cclxuXHRcdFx0Xy5lYWNoIHBlcm1pc3Npb25fc2V0LnVzZXJzLCAodXNlcl9pZCktPlxyXG5cdFx0XHRcdHNwYWNlX3VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJfaWR9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXHJcblx0XHRcdFx0aWYgc3BhY2VfdXNlclxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbl9zZXRfdXNlcnMucHVzaCB1c2VyX2lkXHJcblxyXG5cdFx0XHRhc3NpZ25lZF9hcHBzID0gW11cclxuXHRcdFx0Xy5lYWNoIHBlcm1pc3Npb25fc2V0LmFzc2lnbmVkX2FwcHMsIChhcHBfaWQpLT5cclxuXHRcdFx0XHRpZiBfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuQXBwcyksIGFwcF9pZClcclxuXHRcdFx0XHRcdGFzc2lnbmVkX2FwcHMucHVzaCBhcHBfaWRcclxuXHRcdFx0XHRlbHNlIGlmIGFwcHNfaWRfbWFwc1thcHBfaWRdXHJcblx0XHRcdFx0XHRhc3NpZ25lZF9hcHBzLnB1c2ggYXBwc19pZF9tYXBzW2FwcF9pZF1cclxuXHJcblxyXG5cdFx0XHRuZXdfaWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5pbnNlcnQocGVybWlzc2lvbl9zZXQpXHJcblxyXG5cdFx0XHRwZXJtaXNzaW9uX3NldF9pZF9tYXBzW29sZF9pZF0gPSBuZXdfaWRcclxuXHJcblx0IyA1ICDmjIHkuYXljJZwZXJtaXNzaW9uX29iamVjdHNcclxuXHRpZiBfLmlzQXJyYXkoaW1wX2RhdGEucGVybWlzc2lvbl9vYmplY3RzKSAmJiBpbXBfZGF0YS5wZXJtaXNzaW9uX29iamVjdHMubGVuZ3RoID4gMFxyXG5cdFx0Xy5lYWNoIGltcF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cywgKHBlcm1pc3Npb25fb2JqZWN0KS0+XHJcblx0XHRcdGRlbGV0ZSBwZXJtaXNzaW9uX29iamVjdC5faWRcclxuXHJcblx0XHRcdHBlcm1pc3Npb25fb2JqZWN0LnNwYWNlID0gc3BhY2VfaWRcclxuXHRcdFx0cGVybWlzc2lvbl9vYmplY3Qub3duZXIgPSB1c2VySWRcclxuXHJcblx0XHRcdHBlcm1pc3Npb25fb2JqZWN0LnBlcm1pc3Npb25fc2V0X2lkID0gcGVybWlzc2lvbl9zZXRfaWRfbWFwc1twZXJtaXNzaW9uX29iamVjdC5wZXJtaXNzaW9uX3NldF9pZF1cclxuXHJcblx0XHRcdGRpc2FibGVkX2xpc3Rfdmlld3MgPSBbXVxyXG5cdFx0XHRfLmVhY2ggcGVybWlzc2lvbl9vYmplY3QuZGlzYWJsZWRfbGlzdF92aWV3cywgKGxpc3Rfdmlld19pZCktPlxyXG5cdFx0XHRcdG5ld192aWV3X2lkID0gbGlzdF92aWV3c19pZF9tYXBzW3Blcm1pc3Npb25fb2JqZWN0Lm9iamVjdF9uYW1lICsgXCJfXCIgKyBsaXN0X3ZpZXdfaWRdXHJcblx0XHRcdFx0aWYgbmV3X3ZpZXdfaWRcclxuXHRcdFx0XHRcdGRpc2FibGVkX2xpc3Rfdmlld3MucHVzaCBuZXdfdmlld19pZFxyXG5cclxuXHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmluc2VydChwZXJtaXNzaW9uX29iamVjdClcclxuXHJcblx0IyA2IOaMgeS5heWMlnJlcG9ydHNcclxuXHRpZiBfLmlzQXJyYXkoaW1wX2RhdGEucmVwb3J0cykgJiYgaW1wX2RhdGEucmVwb3J0cy5sZW5ndGggPiAwXHJcblx0XHRfLmVhY2ggaW1wX2RhdGEucmVwb3J0cywgKHJlcG9ydCktPlxyXG5cdFx0XHRkZWxldGUgcmVwb3J0Ll9pZFxyXG5cclxuXHRcdFx0cmVwb3J0LnNwYWNlID0gc3BhY2VfaWRcclxuXHRcdFx0cmVwb3J0Lm93bmVyID0gdXNlcklkXHJcblxyXG5cdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJyZXBvcnRzXCIpLmluc2VydChyZXBvcnQpXHJcblx0IyMj5pWw5o2u5oyB5LmF5YyWIOe7k+adnyMjI1xyXG5cclxuIyMj55Sx5LqO5L2/55So5o6l5Y+j5pa55byP5Lya5a+86Ie0Y29sbGVjdGlvbueahGFmdGVy44CBYmVmb3Jl5Lit6I635Y+W5LiN5YiwdXNlcklk77yM5YaN5q2k6Zeu6aKY5pyq6Kej5Yaz5LmL5YmN77yM6L+Y5piv5L2/55SoTWV0aG9kXHJcbkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvY3JlYXRvci9hcHBfcGFja2FnZS9pbXBvcnQvOnNwYWNlX2lkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0dXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcclxuXHRcdHNwYWNlX2lkID0gcmVxLnBhcmFtcy5zcGFjZV9pZFxyXG5cdFx0aW1wX2RhdGEgPSByZXEuYm9keVxyXG5cdFx0aW1wb3J0X2FwcF9wYWNrYWdlKHVzZXJJZCwgc3BhY2VfaWQsIGltcF9kYXRhKVxyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0ZGF0YToge31cclxuXHRcdH1cclxuXHRjYXRjaCBlXHJcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0Y29kZTogZS5lcnJvclxyXG5cdFx0XHRkYXRhOiB7IGVycm9yczogZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfVxyXG5cdFx0fVxyXG4jIyNcclxuXHJcbk1ldGVvci5tZXRob2RzXHJcblx0J2ltcG9ydF9hcHBfcGFja2FnZSc6IChzcGFjZV9pZCwgaW1wX2RhdGEpLT5cclxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXHJcblx0XHRDcmVhdG9yLmltcG9ydF9hcHBfcGFja2FnZSh1c2VySWQsIHNwYWNlX2lkLCBpbXBfZGF0YSlcclxuIiwidmFyIHRyYW5zZm9ybUZpZWxkT3B0aW9ucywgdHJhbnNmb3JtRmlsdGVycztcblxudHJhbnNmb3JtRmlsdGVycyA9IGZ1bmN0aW9uKGZpbHRlcnMpIHtcbiAgdmFyIF9maWx0ZXJzO1xuICBfZmlsdGVycyA9IFtdO1xuICBfLmVhY2goZmlsdGVycywgZnVuY3Rpb24oZikge1xuICAgIGlmIChfLmlzQXJyYXkoZikgJiYgZi5sZW5ndGggPT09IDMpIHtcbiAgICAgIHJldHVybiBfZmlsdGVycy5wdXNoKHtcbiAgICAgICAgZmllbGQ6IGZbMF0sXG4gICAgICAgIG9wZXJhdGlvbjogZlsxXSxcbiAgICAgICAgdmFsdWU6IGZbMl1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gX2ZpbHRlcnMucHVzaChmKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gX2ZpbHRlcnM7XG59O1xuXG50cmFuc2Zvcm1GaWVsZE9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIHZhciBfb3B0aW9ucztcbiAgaWYgKCFfLmlzQXJyYXkob3B0aW9ucykpIHtcbiAgICByZXR1cm4gb3B0aW9ucztcbiAgfVxuICBfb3B0aW9ucyA9IFtdO1xuICBfLmVhY2gob3B0aW9ucywgZnVuY3Rpb24obykge1xuICAgIGlmIChvICYmIF8uaGFzKG8sICdsYWJlbCcpICYmIF8uaGFzKG8sICd2YWx1ZScpKSB7XG4gICAgICByZXR1cm4gX29wdGlvbnMucHVzaChvLmxhYmVsICsgXCI6XCIgKyBvLnZhbHVlKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gX29wdGlvbnMuam9pbignLCcpO1xufTtcblxuQ3JlYXRvci5pbXBvcnRPYmplY3QgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlX2lkLCBvYmplY3QsIGxpc3Rfdmlld3NfaWRfbWFwcykge1xuICB2YXIgX2ZpZWxkbmFtZXMsIGFjdGlvbnMsIGZpZWxkcywgaGFzUmVjZW50VmlldywgaW50ZXJuYWxfbGlzdF92aWV3LCBvYmpfbGlzdF92aWV3cywgdHJpZ2dlcnM7XG4gIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS1pbXBvcnRPYmplY3QtLS0tLS0tLS0tLS0tLS0tLS0nLCBvYmplY3QubmFtZSk7XG4gIGZpZWxkcyA9IG9iamVjdC5maWVsZHM7XG4gIHRyaWdnZXJzID0gb2JqZWN0LnRyaWdnZXJzO1xuICBhY3Rpb25zID0gb2JqZWN0LmFjdGlvbnM7XG4gIG9ial9saXN0X3ZpZXdzID0gb2JqZWN0Lmxpc3Rfdmlld3M7XG4gIGRlbGV0ZSBvYmplY3QuX2lkO1xuICBkZWxldGUgb2JqZWN0LmZpZWxkcztcbiAgZGVsZXRlIG9iamVjdC50cmlnZ2VycztcbiAgZGVsZXRlIG9iamVjdC5hY3Rpb25zO1xuICBkZWxldGUgb2JqZWN0LnBlcm1pc3Npb25zO1xuICBkZWxldGUgb2JqZWN0Lmxpc3Rfdmlld3M7XG4gIG9iamVjdC5zcGFjZSA9IHNwYWNlX2lkO1xuICBvYmplY3Qub3duZXIgPSB1c2VySWQ7XG4gIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikuaW5zZXJ0KG9iamVjdCk7XG4gIGludGVybmFsX2xpc3RfdmlldyA9IHt9O1xuICBoYXNSZWNlbnRWaWV3ID0gZmFsc2U7XG4gIGNvbnNvbGUubG9nKCfmjIHkuYXljJblr7nosaFsaXN0X3ZpZXdzJyk7XG4gIF8uZWFjaChvYmpfbGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gICAgdmFyIG5ld19pZCwgb2xkX2lkLCBvcHRpb25zO1xuICAgIG9sZF9pZCA9IGxpc3Rfdmlldy5faWQ7XG4gICAgZGVsZXRlIGxpc3Rfdmlldy5faWQ7XG4gICAgbGlzdF92aWV3LnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgbGlzdF92aWV3Lm93bmVyID0gdXNlcklkO1xuICAgIGxpc3Rfdmlldy5vYmplY3RfbmFtZSA9IG9iamVjdC5uYW1lO1xuICAgIGlmIChDcmVhdG9yLmlzUmVjZW50VmlldyhsaXN0X3ZpZXcpKSB7XG4gICAgICBoYXNSZWNlbnRWaWV3ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGxpc3Rfdmlldy5maWx0ZXJzKSB7XG4gICAgICBsaXN0X3ZpZXcuZmlsdGVycyA9IHRyYW5zZm9ybUZpbHRlcnMobGlzdF92aWV3LmZpbHRlcnMpO1xuICAgIH1cbiAgICBpZiAoQ3JlYXRvci5pc0FsbFZpZXcobGlzdF92aWV3KSB8fCBDcmVhdG9yLmlzUmVjZW50VmlldyhsaXN0X3ZpZXcpKSB7XG4gICAgICBvcHRpb25zID0ge1xuICAgICAgICAkc2V0OiBsaXN0X3ZpZXdcbiAgICAgIH07XG4gICAgICBpZiAoIWxpc3Rfdmlldy5jb2x1bW5zKSB7XG4gICAgICAgIG9wdGlvbnMuJHVuc2V0ID0ge1xuICAgICAgICAgIGNvbHVtbnM6ICcnXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS51cGRhdGUoe1xuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0Lm5hbWUsXG4gICAgICAgIG5hbWU6IGxpc3Rfdmlldy5uYW1lLFxuICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgIH0sIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdfaWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmluc2VydChsaXN0X3ZpZXcpO1xuICAgICAgcmV0dXJuIGxpc3Rfdmlld3NfaWRfbWFwc1tvYmplY3QubmFtZSArIFwiX1wiICsgb2xkX2lkXSA9IG5ld19pZDtcbiAgICB9XG4gIH0pO1xuICBpZiAoIWhhc1JlY2VudFZpZXcpIHtcbiAgICBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLnJlbW92ZSh7XG4gICAgICBuYW1lOiBcInJlY2VudFwiLFxuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdC5uYW1lLFxuICAgICAgb3duZXI6IHVzZXJJZFxuICAgIH0pO1xuICB9XG4gIGNvbnNvbGUubG9nKCfmjIHkuYXljJblr7nosaHlrZfmrrUnKTtcbiAgX2ZpZWxkbmFtZXMgPSBbXTtcbiAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGspIHtcbiAgICBkZWxldGUgZmllbGQuX2lkO1xuICAgIGZpZWxkLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgZmllbGQub3duZXIgPSB1c2VySWQ7XG4gICAgZmllbGQub2JqZWN0ID0gb2JqZWN0Lm5hbWU7XG4gICAgaWYgKGZpZWxkLm9wdGlvbnMpIHtcbiAgICAgIGZpZWxkLm9wdGlvbnMgPSB0cmFuc2Zvcm1GaWVsZE9wdGlvbnMoZmllbGQub3B0aW9ucyk7XG4gICAgfVxuICAgIGlmICghXy5oYXMoZmllbGQsIFwibmFtZVwiKSkge1xuICAgICAgZmllbGQubmFtZSA9IGs7XG4gICAgfVxuICAgIF9maWVsZG5hbWVzLnB1c2goZmllbGQubmFtZSk7XG4gICAgaWYgKGZpZWxkLm5hbWUgPT09IFwibmFtZVwiKSB7XG4gICAgICBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfZmllbGRzXCIpLnVwZGF0ZSh7XG4gICAgICAgIG9iamVjdDogb2JqZWN0Lm5hbWUsXG4gICAgICAgIG5hbWU6IFwibmFtZVwiLFxuICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDogZmllbGRcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfZmllbGRzXCIpLmluc2VydChmaWVsZCk7XG4gICAgfVxuICAgIGlmICghXy5jb250YWlucyhfZmllbGRuYW1lcywgJ25hbWUnKSkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9maWVsZHNcIikuZGlyZWN0LnJlbW92ZSh7XG4gICAgICAgIG9iamVjdDogb2JqZWN0Lm5hbWUsXG4gICAgICAgIG5hbWU6IFwibmFtZVwiLFxuICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIGNvbnNvbGUubG9nKCfmjIHkuYXljJbop6blj5HlmagnKTtcbiAgXy5lYWNoKHRyaWdnZXJzLCBmdW5jdGlvbih0cmlnZ2VyLCBrKSB7XG4gICAgZGVsZXRlIHRyaWdnZXJzLl9pZDtcbiAgICB0cmlnZ2VyLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgdHJpZ2dlci5vd25lciA9IHVzZXJJZDtcbiAgICB0cmlnZ2VyLm9iamVjdCA9IG9iamVjdC5uYW1lO1xuICAgIGlmICghXy5oYXModHJpZ2dlciwgXCJuYW1lXCIpKSB7XG4gICAgICB0cmlnZ2VyLm5hbWUgPSBrLnJlcGxhY2UobmV3IFJlZ0V4cChcIlxcXFwuXCIsIFwiZ1wiKSwgXCJfXCIpO1xuICAgIH1cbiAgICBpZiAoIV8uaGFzKHRyaWdnZXIsIFwiaXNfZW5hYmxlXCIpKSB7XG4gICAgICB0cmlnZ2VyLmlzX2VuYWJsZSA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfdHJpZ2dlcnNcIikuaW5zZXJ0KHRyaWdnZXIpO1xuICB9KTtcbiAgY29uc29sZS5sb2coJ+aMgeS5heWMluaTjeS9nCcpO1xuICBfLmVhY2goYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBrKSB7XG4gICAgZGVsZXRlIGFjdGlvbi5faWQ7XG4gICAgYWN0aW9uLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgYWN0aW9uLm93bmVyID0gdXNlcklkO1xuICAgIGFjdGlvbi5vYmplY3QgPSBvYmplY3QubmFtZTtcbiAgICBpZiAoIV8uaGFzKGFjdGlvbiwgXCJuYW1lXCIpKSB7XG4gICAgICBhY3Rpb24ubmFtZSA9IGsucmVwbGFjZShuZXcgUmVnRXhwKFwiXFxcXC5cIiwgXCJnXCIpLCBcIl9cIik7XG4gICAgfVxuICAgIGlmICghXy5oYXMoYWN0aW9uLCBcImlzX2VuYWJsZVwiKSkge1xuICAgICAgYWN0aW9uLmlzX2VuYWJsZSA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfYWN0aW9uc1wiKS5pbnNlcnQoYWN0aW9uKTtcbiAgfSk7XG4gIHJldHVybiBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0taW1wb3J0T2JqZWN0IGVuZC0tLS0tLS0tLS0tLS0tLS0tLScsIG9iamVjdC5uYW1lKTtcbn07XG5cbkNyZWF0b3IuaW1wb3J0X2FwcF9wYWNrYWdlID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZV9pZCwgaW1wX2RhdGEsIGZyb21fdGVtcGxhdGUpIHtcbiAgdmFyIGFwcHNfaWRfbWFwcywgaW1wX2FwcF9pZHMsIGltcF9vYmplY3RfbmFtZXMsIGxpc3Rfdmlld3NfaWRfbWFwcywgb2JqZWN0X25hbWVzLCBwZXJtaXNzaW9uX3NldF9pZF9tYXBzLCBwZXJtaXNzaW9uX3NldF9pZHM7XG4gIGlmICghdXNlcklkKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjQwMVwiLCBcIkF1dGhlbnRpY2F0aW9uIGlzIHJlcXVpcmVkIGFuZCBoYXMgbm90IGJlZW4gcHJvdmlkZWQuXCIpO1xuICB9XG4gIGlmICghQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIHVzZXJJZCkpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNDAxXCIsIFwiUGVybWlzc2lvbiBkZW5pZWQuXCIpO1xuICB9XG5cbiAgLyrmlbDmja7moKHpqowg5byA5aeLICovXG4gIGNoZWNrKGltcF9kYXRhLCBPYmplY3QpO1xuICBpZiAoIWZyb21fdGVtcGxhdGUpIHtcbiAgICBpbXBfYXBwX2lkcyA9IF8ucGx1Y2soaW1wX2RhdGEuYXBwcywgXCJfaWRcIik7XG4gICAgaWYgKF8uaXNBcnJheShpbXBfZGF0YS5hcHBzKSAmJiBpbXBfZGF0YS5hcHBzLmxlbmd0aCA+IDApIHtcbiAgICAgIF8uZWFjaChpbXBfZGF0YS5hcHBzLCBmdW5jdGlvbihhcHApIHtcbiAgICAgICAgaWYgKF8uaW5jbHVkZShfLmtleXMoQ3JlYXRvci5BcHBzKSwgYXBwLl9pZCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5bqU55SoJ1wiICsgYXBwLm5hbWUgKyBcIiflt7LlrZjlnKhcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLm9iamVjdHMpICYmIGltcF9kYXRhLm9iamVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgXy5lYWNoKGltcF9kYXRhLm9iamVjdHMsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICBpZiAoXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLk9iamVjdHMpLCBvYmplY3QubmFtZSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5a+56LGhJ1wiICsgb2JqZWN0Lm5hbWUgKyBcIiflt7LlrZjlnKhcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF8uZWFjaChvYmplY3QudHJpZ2dlcnMsIGZ1bmN0aW9uKHRyaWdnZXIpIHtcbiAgICAgICAgICBpZiAodHJpZ2dlci5vbiA9PT0gJ3NlcnZlcicgJiYgIVN0ZWVkb3MuaXNMZWdhbFZlcnNpb24oc3BhY2VfaWQsIFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5Y+q5pyJ5LyB5Lia54mI5pSv5oyB6YWN572u5pyN5Yqh56uv55qE6Kem5Y+R5ZmoXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaW1wX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soaW1wX2RhdGEub2JqZWN0cywgXCJuYW1lXCIpO1xuICAgIG9iamVjdF9uYW1lcyA9IF8ua2V5cyhDcmVhdG9yLk9iamVjdHMpO1xuICAgIGlmIChfLmlzQXJyYXkoaW1wX2RhdGEuYXBwcykgJiYgaW1wX2RhdGEuYXBwcy5sZW5ndGggPiAwKSB7XG4gICAgICBfLmVhY2goaW1wX2RhdGEuYXBwcywgZnVuY3Rpb24oYXBwKSB7XG4gICAgICAgIHJldHVybiBfLmVhY2goYXBwLm9iamVjdHMsIGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgICAgICAgaWYgKCFfLmluY2x1ZGUob2JqZWN0X25hbWVzLCBvYmplY3RfbmFtZSkgJiYgIV8uaW5jbHVkZShpbXBfb2JqZWN0X25hbWVzLCBvYmplY3RfbmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLlupTnlKgnXCIgKyBhcHAubmFtZSArIFwiJ+S4reaMh+WumueahOWvueixoSdcIiArIG9iamVjdF9uYW1lICsgXCIn5LiN5a2Y5ZyoXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShpbXBfZGF0YS5saXN0X3ZpZXdzKSAmJiBpbXBfZGF0YS5saXN0X3ZpZXdzLmxlbmd0aCA+IDApIHtcbiAgICAgIF8uZWFjaChpbXBfZGF0YS5saXN0X3ZpZXdzLCBmdW5jdGlvbihsaXN0X3ZpZXcpIHtcbiAgICAgICAgaWYgKCFsaXN0X3ZpZXcub2JqZWN0X25hbWUgfHwgIV8uaXNTdHJpbmcobGlzdF92aWV3Lm9iamVjdF9uYW1lKSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLliJfooajop4blm74nXCIgKyBsaXN0X3ZpZXcubmFtZSArIFwiJ+eahG9iamVjdF9uYW1l5bGe5oCn5peg5pWIXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghXy5pbmNsdWRlKG9iamVjdF9uYW1lcywgbGlzdF92aWV3Lm9iamVjdF9uYW1lKSAmJiAhXy5pbmNsdWRlKGltcF9vYmplY3RfbmFtZXMsIGxpc3Rfdmlldy5vYmplY3RfbmFtZSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5YiX6KGo6KeG5Zu+J1wiICsgbGlzdF92aWV3Lm5hbWUgKyBcIifkuK3mjIflrprnmoTlr7nosaEnXCIgKyBsaXN0X3ZpZXcub2JqZWN0X25hbWUgKyBcIifkuI3lrZjlnKhcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBwZXJtaXNzaW9uX3NldF9pZHMgPSBfLnBsdWNrKGltcF9kYXRhLnBlcm1pc3Npb25fc2V0LCBcIl9pZFwiKTtcbiAgICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLnBlcm1pc3Npb25fc2V0KSAmJiBpbXBfZGF0YS5wZXJtaXNzaW9uX3NldC5sZW5ndGggPiAwKSB7XG4gICAgICBfLmVhY2goaW1wX2RhdGEucGVybWlzc2lvbl9zZXQsIGZ1bmN0aW9uKHBlcm1pc3Npb25fc2V0KSB7XG4gICAgICAgIGlmIChDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgbmFtZTogcGVybWlzc2lvbl9zZXQubmFtZVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5p2D6ZmQ6ZuG5ZCN56ewJ1wiICsgcGVybWlzc2lvbl9zZXQubmFtZSArIFwiJ+S4jeiDvemHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXy5lYWNoKHBlcm1pc3Npb25fc2V0LmFzc2lnbmVkX2FwcHMsIGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgICAgICAgIGlmICghXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLkFwcHMpLCBhcHBfaWQpICYmICFfLmluY2x1ZGUoaW1wX2FwcF9pZHMsIGFwcF9pZCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLmnYPpmZDpm4YnXCIgKyBwZXJtaXNzaW9uX3NldC5uYW1lICsgXCIn55qE5o6I5p2D5bqU55SoJ1wiICsgYXBwX2lkICsgXCIn5LiN5a2Y5ZyoXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShpbXBfZGF0YS5wZXJtaXNzaW9uX29iamVjdHMpICYmIGltcF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICBfLmVhY2goaW1wX2RhdGEucGVybWlzc2lvbl9vYmplY3RzLCBmdW5jdGlvbihwZXJtaXNzaW9uX29iamVjdCkge1xuICAgICAgICBpZiAoIXBlcm1pc3Npb25fb2JqZWN0Lm9iamVjdF9uYW1lIHx8ICFfLmlzU3RyaW5nKHBlcm1pc3Npb25fb2JqZWN0Lm9iamVjdF9uYW1lKSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLmnYPpmZDpm4YnXCIgKyBwZXJtaXNzaW9uX29iamVjdC5uYW1lICsgXCIn55qEb2JqZWN0X25hbWXlsZ7mgKfml6DmlYhcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFfLmluY2x1ZGUob2JqZWN0X25hbWVzLCBwZXJtaXNzaW9uX29iamVjdC5vYmplY3RfbmFtZSkgJiYgIV8uaW5jbHVkZShpbXBfb2JqZWN0X25hbWVzLCBwZXJtaXNzaW9uX29iamVjdC5vYmplY3RfbmFtZSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5p2D6ZmQ6ZuGJ1wiICsgbGlzdF92aWV3Lm5hbWUgKyBcIifkuK3mjIflrprnmoTlr7nosaEnXCIgKyBwZXJtaXNzaW9uX29iamVjdC5vYmplY3RfbmFtZSArIFwiJ+S4jeWtmOWcqFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIV8uaGFzKHBlcm1pc3Npb25fb2JqZWN0LCBcInBlcm1pc3Npb25fc2V0X2lkXCIpIHx8ICFfLmlzU3RyaW5nKHBlcm1pc3Npb25fb2JqZWN0LnBlcm1pc3Npb25fc2V0X2lkKSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLmnYPpmZDpm4YnXCIgKyBwZXJtaXNzaW9uX29iamVjdC5uYW1lICsgXCIn55qEcGVybWlzc2lvbl9zZXRfaWTlsZ7mgKfml6DmlYhcIik7XG4gICAgICAgIH0gZWxzZSBpZiAoIV8uaW5jbHVkZShwZXJtaXNzaW9uX3NldF9pZHMsIHBlcm1pc3Npb25fb2JqZWN0LnBlcm1pc3Npb25fc2V0X2lkKSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLmnYPpmZDpm4YnXCIgKyBwZXJtaXNzaW9uX29iamVjdC5uYW1lICsgXCIn5oyH5a6a55qE5p2D6ZmQ6ZuGJ1wiICsgcGVybWlzc2lvbl9vYmplY3QucGVybWlzc2lvbl9zZXRfaWQgKyBcIiflgLzkuI3lnKjlr7zlhaXnmoRwZXJtaXNzaW9uX3NldOS4rVwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkoaW1wX2RhdGEucmVwb3J0cykgJiYgaW1wX2RhdGEucmVwb3J0cy5sZW5ndGggPiAwKSB7XG4gICAgICBfLmVhY2goaW1wX2RhdGEucmVwb3J0cywgZnVuY3Rpb24ocmVwb3J0KSB7XG4gICAgICAgIGlmICghcmVwb3J0Lm9iamVjdF9uYW1lIHx8ICFfLmlzU3RyaW5nKHJlcG9ydC5vYmplY3RfbmFtZSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5oql6KGoJ1wiICsgcmVwb3J0Lm5hbWUgKyBcIifnmoRvYmplY3RfbmFtZeWxnuaAp+aXoOaViFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIV8uaW5jbHVkZShvYmplY3RfbmFtZXMsIHJlcG9ydC5vYmplY3RfbmFtZSkgJiYgIV8uaW5jbHVkZShpbXBfb2JqZWN0X25hbWVzLCByZXBvcnQub2JqZWN0X25hbWUpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuaKpeihqCdcIiArIHJlcG9ydC5uYW1lICsgXCIn5Lit5oyH5a6a55qE5a+56LGhJ1wiICsgcmVwb3J0Lm9iamVjdF9uYW1lICsgXCIn5LiN5a2Y5ZyoXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKuaVsOaNruagoemqjCDnu5PmnZ8gKi9cblxuICAvKuaVsOaNruaMgeS5heWMliDlvIDlp4sgKi9cbiAgYXBwc19pZF9tYXBzID0ge307XG4gIGxpc3Rfdmlld3NfaWRfbWFwcyA9IHt9O1xuICBwZXJtaXNzaW9uX3NldF9pZF9tYXBzID0ge307XG4gIGlmIChfLmlzQXJyYXkoaW1wX2RhdGEuYXBwcykgJiYgaW1wX2RhdGEuYXBwcy5sZW5ndGggPiAwKSB7XG4gICAgXy5lYWNoKGltcF9kYXRhLmFwcHMsIGZ1bmN0aW9uKGFwcCkge1xuICAgICAgdmFyIG5ld19pZCwgb2xkX2lkO1xuICAgICAgb2xkX2lkID0gYXBwLl9pZDtcbiAgICAgIGRlbGV0ZSBhcHAuX2lkO1xuICAgICAgYXBwLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICBhcHAub3duZXIgPSB1c2VySWQ7XG4gICAgICBhcHAuaXNfY3JlYXRvciA9IHRydWU7XG4gICAgICBuZXdfaWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBzXCIpLmluc2VydChhcHApO1xuICAgICAgcmV0dXJuIGFwcHNfaWRfbWFwc1tvbGRfaWRdID0gbmV3X2lkO1xuICAgIH0pO1xuICB9XG4gIGlmIChfLmlzQXJyYXkoaW1wX2RhdGEub2JqZWN0cykgJiYgaW1wX2RhdGEub2JqZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgXy5lYWNoKGltcF9kYXRhLm9iamVjdHMsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuaW1wb3J0T2JqZWN0KHVzZXJJZCwgc3BhY2VfaWQsIG9iamVjdCwgbGlzdF92aWV3c19pZF9tYXBzKTtcbiAgICB9KTtcbiAgfVxuICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLmxpc3Rfdmlld3MpICYmIGltcF9kYXRhLmxpc3Rfdmlld3MubGVuZ3RoID4gMCkge1xuICAgIF8uZWFjaChpbXBfZGF0YS5saXN0X3ZpZXdzLCBmdW5jdGlvbihsaXN0X3ZpZXcpIHtcbiAgICAgIHZhciBfbGlzdF92aWV3LCBuZXdfaWQsIG9sZF9pZDtcbiAgICAgIG9sZF9pZCA9IGxpc3Rfdmlldy5faWQ7XG4gICAgICBkZWxldGUgbGlzdF92aWV3Ll9pZDtcbiAgICAgIGxpc3Rfdmlldy5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgbGlzdF92aWV3Lm93bmVyID0gdXNlcklkO1xuICAgICAgaWYgKENyZWF0b3IuaXNBbGxWaWV3KGxpc3RfdmlldykgfHwgQ3JlYXRvci5pc1JlY2VudFZpZXcobGlzdF92aWV3KSkge1xuICAgICAgICBfbGlzdF92aWV3ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kT25lKHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogbGlzdF92aWV3Lm9iamVjdF9uYW1lLFxuICAgICAgICAgIG5hbWU6IGxpc3Rfdmlldy5uYW1lLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoX2xpc3Rfdmlldykge1xuICAgICAgICAgIG5ld19pZCA9IF9saXN0X3ZpZXcuX2lkO1xuICAgICAgICB9XG4gICAgICAgIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikudXBkYXRlKHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogbGlzdF92aWV3Lm9iamVjdF9uYW1lLFxuICAgICAgICAgIG5hbWU6IGxpc3Rfdmlldy5uYW1lLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDogbGlzdF92aWV3XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3X2lkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5pbnNlcnQobGlzdF92aWV3KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsaXN0X3ZpZXdzX2lkX21hcHNbbGlzdF92aWV3Lm9iamVjdF9uYW1lICsgXCJfXCIgKyBvbGRfaWRdID0gbmV3X2lkO1xuICAgIH0pO1xuICB9XG4gIGlmIChfLmlzQXJyYXkoaW1wX2RhdGEucGVybWlzc2lvbl9zZXQpICYmIGltcF9kYXRhLnBlcm1pc3Npb25fc2V0Lmxlbmd0aCA+IDApIHtcbiAgICBfLmVhY2goaW1wX2RhdGEucGVybWlzc2lvbl9zZXQsIGZ1bmN0aW9uKHBlcm1pc3Npb25fc2V0KSB7XG4gICAgICB2YXIgYXNzaWduZWRfYXBwcywgbmV3X2lkLCBvbGRfaWQsIHBlcm1pc3Npb25fc2V0X3VzZXJzO1xuICAgICAgb2xkX2lkID0gcGVybWlzc2lvbl9zZXQuX2lkO1xuICAgICAgZGVsZXRlIHBlcm1pc3Npb25fc2V0Ll9pZDtcbiAgICAgIHBlcm1pc3Npb25fc2V0LnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICBwZXJtaXNzaW9uX3NldC5vd25lciA9IHVzZXJJZDtcbiAgICAgIHBlcm1pc3Npb25fc2V0X3VzZXJzID0gW107XG4gICAgICBfLmVhY2gocGVybWlzc2lvbl9zZXQudXNlcnMsIGZ1bmN0aW9uKHVzZXJfaWQpIHtcbiAgICAgICAgdmFyIHNwYWNlX3VzZXI7XG4gICAgICAgIHNwYWNlX3VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgdXNlcjogdXNlcl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc3BhY2VfdXNlcikge1xuICAgICAgICAgIHJldHVybiBwZXJtaXNzaW9uX3NldF91c2Vycy5wdXNoKHVzZXJfaWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGFzc2lnbmVkX2FwcHMgPSBbXTtcbiAgICAgIF8uZWFjaChwZXJtaXNzaW9uX3NldC5hc3NpZ25lZF9hcHBzLCBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICAgICAgaWYgKF8uaW5jbHVkZShfLmtleXMoQ3JlYXRvci5BcHBzKSwgYXBwX2lkKSkge1xuICAgICAgICAgIHJldHVybiBhc3NpZ25lZF9hcHBzLnB1c2goYXBwX2lkKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcHBzX2lkX21hcHNbYXBwX2lkXSkge1xuICAgICAgICAgIHJldHVybiBhc3NpZ25lZF9hcHBzLnB1c2goYXBwc19pZF9tYXBzW2FwcF9pZF0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG5ld19pZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmluc2VydChwZXJtaXNzaW9uX3NldCk7XG4gICAgICByZXR1cm4gcGVybWlzc2lvbl9zZXRfaWRfbWFwc1tvbGRfaWRdID0gbmV3X2lkO1xuICAgIH0pO1xuICB9XG4gIGlmIChfLmlzQXJyYXkoaW1wX2RhdGEucGVybWlzc2lvbl9vYmplY3RzKSAmJiBpbXBfZGF0YS5wZXJtaXNzaW9uX29iamVjdHMubGVuZ3RoID4gMCkge1xuICAgIF8uZWFjaChpbXBfZGF0YS5wZXJtaXNzaW9uX29iamVjdHMsIGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0KSB7XG4gICAgICB2YXIgZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgIGRlbGV0ZSBwZXJtaXNzaW9uX29iamVjdC5faWQ7XG4gICAgICBwZXJtaXNzaW9uX29iamVjdC5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgcGVybWlzc2lvbl9vYmplY3Qub3duZXIgPSB1c2VySWQ7XG4gICAgICBwZXJtaXNzaW9uX29iamVjdC5wZXJtaXNzaW9uX3NldF9pZCA9IHBlcm1pc3Npb25fc2V0X2lkX21hcHNbcGVybWlzc2lvbl9vYmplY3QucGVybWlzc2lvbl9zZXRfaWRdO1xuICAgICAgZGlzYWJsZWRfbGlzdF92aWV3cyA9IFtdO1xuICAgICAgXy5lYWNoKHBlcm1pc3Npb25fb2JqZWN0LmRpc2FibGVkX2xpc3Rfdmlld3MsIGZ1bmN0aW9uKGxpc3Rfdmlld19pZCkge1xuICAgICAgICB2YXIgbmV3X3ZpZXdfaWQ7XG4gICAgICAgIG5ld192aWV3X2lkID0gbGlzdF92aWV3c19pZF9tYXBzW3Blcm1pc3Npb25fb2JqZWN0Lm9iamVjdF9uYW1lICsgXCJfXCIgKyBsaXN0X3ZpZXdfaWRdO1xuICAgICAgICBpZiAobmV3X3ZpZXdfaWQpIHtcbiAgICAgICAgICByZXR1cm4gZGlzYWJsZWRfbGlzdF92aWV3cy5wdXNoKG5ld192aWV3X2lkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmluc2VydChwZXJtaXNzaW9uX29iamVjdCk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKF8uaXNBcnJheShpbXBfZGF0YS5yZXBvcnRzKSAmJiBpbXBfZGF0YS5yZXBvcnRzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gXy5lYWNoKGltcF9kYXRhLnJlcG9ydHMsIGZ1bmN0aW9uKHJlcG9ydCkge1xuICAgICAgZGVsZXRlIHJlcG9ydC5faWQ7XG4gICAgICByZXBvcnQuc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIHJlcG9ydC5vd25lciA9IHVzZXJJZDtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJyZXBvcnRzXCIpLmluc2VydChyZXBvcnQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyrmlbDmja7mjIHkuYXljJYg57uT5p2fICovXG59O1xuXG5cbi8q55Sx5LqO5L2/55So5o6l5Y+j5pa55byP5Lya5a+86Ie0Y29sbGVjdGlvbueahGFmdGVy44CBYmVmb3Jl5Lit6I635Y+W5LiN5YiwdXNlcklk77yM5YaN5q2k6Zeu6aKY5pyq6Kej5Yaz5LmL5YmN77yM6L+Y5piv5L2/55SoTWV0aG9kXG5Kc29uUm91dGVzLmFkZCAncG9zdCcsICcvYXBpL2NyZWF0b3IvYXBwX3BhY2thZ2UvaW1wb3J0LzpzcGFjZV9pZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0dHJ5XG5cdFx0dXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcblx0XHRzcGFjZV9pZCA9IHJlcS5wYXJhbXMuc3BhY2VfaWRcblx0XHRpbXBfZGF0YSA9IHJlcS5ib2R5XG5cdFx0aW1wb3J0X2FwcF9wYWNrYWdlKHVzZXJJZCwgc3BhY2VfaWQsIGltcF9kYXRhKVxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdGNvZGU6IDIwMFxuXHRcdFx0ZGF0YToge31cblx0XHR9XG5cdGNhdGNoIGVcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRjb2RlOiBlLmVycm9yXG5cdFx0XHRkYXRhOiB7IGVycm9yczogZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfVxuXHRcdH1cbiAqL1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gICdpbXBvcnRfYXBwX3BhY2thZ2UnOiBmdW5jdGlvbihzcGFjZV9pZCwgaW1wX2RhdGEpIHtcbiAgICB2YXIgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHJldHVybiBDcmVhdG9yLmltcG9ydF9hcHBfcGFja2FnZSh1c2VySWQsIHNwYWNlX2lkLCBpbXBfZGF0YSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRcImNyZWF0b3IubGlzdHZpZXdzX29wdGlvbnNcIjogKG9wdGlvbnMpLT5cclxuXHRcdGlmIG9wdGlvbnM/LnBhcmFtcz8ucmVmZXJlbmNlX3RvXHJcblxyXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvcHRpb25zLnBhcmFtcy5yZWZlcmVuY2VfdG8pXHJcblxyXG5cdFx0XHRuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWVxyXG5cclxuXHRcdFx0cXVlcnkgPSB7fVxyXG5cdFx0XHRpZiBvcHRpb25zLnBhcmFtcy5zcGFjZVxyXG5cdFx0XHRcdHF1ZXJ5LnNwYWNlID0gb3B0aW9ucy5wYXJhbXMuc3BhY2VcclxuXHJcblx0XHRcdFx0c29ydCA9IG9wdGlvbnM/LnNvcnRcclxuXHJcblx0XHRcdFx0c2VsZWN0ZWQgPSBvcHRpb25zPy5zZWxlY3RlZCB8fCBbXVxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcclxuXHRcdFx0XHRcdHNlYXJjaFRleHRRdWVyeSA9IHt9XHJcblx0XHRcdFx0XHRzZWFyY2hUZXh0UXVlcnlbbmFtZV9maWVsZF9rZXldID0geyRyZWdleDogb3B0aW9ucy5zZWFyY2hUZXh0fVxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zPy52YWx1ZXM/Lmxlbmd0aFxyXG5cdFx0XHRcdFx0aWYgb3B0aW9ucy5zZWFyY2hUZXh0XHJcblx0XHRcdFx0XHRcdHF1ZXJ5LiRvciA9IFt7X2lkOiB7JGluOiBvcHRpb25zLnZhbHVlc319LCBzZWFyY2hUZXh0UXVlcnksIHtvYmplY3RfbmFtZTogeyRyZWdleDogb3B0aW9ucy5zZWFyY2hUZXh0fX1dXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHF1ZXJ5LiRvciA9IFt7X2lkOiB7JGluOiBvcHRpb25zLnZhbHVlc319XVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxyXG5cdFx0XHRcdFx0XHRfLmV4dGVuZChxdWVyeSwgeyRvcjogW3NlYXJjaFRleHRRdWVyeSwgIHtvYmplY3RfbmFtZTogeyRyZWdleDogb3B0aW9ucy5zZWFyY2hUZXh0fX1dfSlcclxuXHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHskbmluOiBzZWxlY3RlZH1cclxuXHJcblx0XHRcdFx0Y29sbGVjdGlvbiA9IG9iamVjdC5kYlxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zLmZpbHRlclF1ZXJ5XHJcblx0XHRcdFx0XHRfLmV4dGVuZCBxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeVxyXG5cclxuXHRcdFx0XHRxdWVyeV9vcHRpb25zID0ge2xpbWl0OiAxMH1cclxuXHJcblx0XHRcdFx0aWYgc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpXHJcblx0XHRcdFx0XHRxdWVyeV9vcHRpb25zLnNvcnQgPSBzb3J0XHJcblxyXG5cdFx0XHRcdGlmIGNvbGxlY3Rpb25cclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRyZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpXHJcblx0XHRcdFx0XHRcdHJlc3VsdHMgPSBbXVxyXG5cdFx0XHRcdFx0XHRfLmVhY2ggcmVjb3JkcywgKHJlY29yZCktPlxyXG5cdFx0XHRcdFx0XHRcdG9iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRPYmplY3QocmVjb3JkLm9iamVjdF9uYW1lKT8ubmFtZSB8fCBcIlwiXHJcblx0XHRcdFx0XHRcdFx0aWYgIV8uaXNFbXB0eShvYmplY3RfbmFtZSlcclxuXHRcdFx0XHRcdFx0XHRcdG9iamVjdF9uYW1lID0gXCIgKCN7b2JqZWN0X25hbWV9KVwiXHJcblxyXG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaFxyXG5cdFx0XHRcdFx0XHRcdFx0bGFiZWw6IHJlY29yZFtuYW1lX2ZpZWxkX2tleV0gKyBvYmplY3RfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHJlY29yZC5faWRcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHNcclxuXHRcdFx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIGUubWVzc2FnZSArIFwiLS0+XCIgKyBKU09OLnN0cmluZ2lmeShvcHRpb25zKVxyXG5cdFx0cmV0dXJuIFtdICIsIk1ldGVvci5tZXRob2RzKHtcbiAgXCJjcmVhdG9yLmxpc3R2aWV3c19vcHRpb25zXCI6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZSwgbmFtZV9maWVsZF9rZXksIG9iamVjdCwgcXVlcnksIHF1ZXJ5X29wdGlvbnMsIHJlY29yZHMsIHJlZiwgcmVmMSwgcmVzdWx0cywgc2VhcmNoVGV4dFF1ZXJ5LCBzZWxlY3RlZCwgc29ydDtcbiAgICBpZiAob3B0aW9ucyAhPSBudWxsID8gKHJlZiA9IG9wdGlvbnMucGFyYW1zKSAhPSBudWxsID8gcmVmLnJlZmVyZW5jZV90byA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob3B0aW9ucy5wYXJhbXMucmVmZXJlbmNlX3RvKTtcbiAgICAgIG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICAgICAgcXVlcnkgPSB7fTtcbiAgICAgIGlmIChvcHRpb25zLnBhcmFtcy5zcGFjZSkge1xuICAgICAgICBxdWVyeS5zcGFjZSA9IG9wdGlvbnMucGFyYW1zLnNwYWNlO1xuICAgICAgICBzb3J0ID0gb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zb3J0IDogdm9pZCAwO1xuICAgICAgICBzZWxlY3RlZCA9IChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNlbGVjdGVkIDogdm9pZCAwKSB8fCBbXTtcbiAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7XG4gICAgICAgICAgICAkcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYxID0gb3B0aW9ucy52YWx1ZXMpICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIHF1ZXJ5LiRvciA9IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgJGluOiBvcHRpb25zLnZhbHVlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSwgc2VhcmNoVGV4dFF1ZXJ5LCB7XG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IHtcbiAgICAgICAgICAgICAgICAgICRyZWdleDogb3B0aW9ucy5zZWFyY2hUZXh0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKHF1ZXJ5LCB7XG4gICAgICAgICAgICAgICRvcjogW1xuICAgICAgICAgICAgICAgIHNlYXJjaFRleHRRdWVyeSwge1xuICAgICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IHtcbiAgICAgICAgICAgICAgICAgICAgJHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHRcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxdWVyeS5faWQgPSB7XG4gICAgICAgICAgICAkbmluOiBzZWxlY3RlZFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY29sbGVjdGlvbiA9IG9iamVjdC5kYjtcbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsdGVyUXVlcnkpIHtcbiAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeSk7XG4gICAgICAgIH1cbiAgICAgICAgcXVlcnlfb3B0aW9ucyA9IHtcbiAgICAgICAgICBsaW1pdDogMTBcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHNvcnQgJiYgXy5pc09iamVjdChzb3J0KSkge1xuICAgICAgICAgIHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVjb3JkcyA9IGNvbGxlY3Rpb24uZmluZChxdWVyeSwgcXVlcnlfb3B0aW9ucykuZmV0Y2goKTtcbiAgICAgICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgIF8uZWFjaChyZWNvcmRzLCBmdW5jdGlvbihyZWNvcmQpIHtcbiAgICAgICAgICAgICAgdmFyIG9iamVjdF9uYW1lLCByZWYyO1xuICAgICAgICAgICAgICBvYmplY3RfbmFtZSA9ICgocmVmMiA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlY29yZC5vYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYyLm5hbWUgOiB2b2lkIDApIHx8IFwiXCI7XG4gICAgICAgICAgICAgIGlmICghXy5pc0VtcHR5KG9iamVjdF9uYW1lKSkge1xuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lID0gXCIgKFwiICsgb2JqZWN0X25hbWUgKyBcIilcIjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBsYWJlbDogcmVjb3JkW25hbWVfZmllbGRfa2V5XSArIG9iamVjdF9uYW1lLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuX2lkXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIGUubWVzc2FnZSArIFwiLS0+XCIgKyBKU09OLnN0cmluZ2lmeShvcHRpb25zKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxufSk7XG4iLCIj6I635Y+W5bqU55So5LiL55qE5a+56LGhXHJcbmdldEFwcE9iamVjdHMgPSAoYXBwKS0+XHJcblx0YXBwT2JqZWN0cyA9IFtdXHJcblx0aWYgYXBwICYmIF8uaXNBcnJheShhcHAub2JqZWN0cykgJiYgYXBwLm9iamVjdHMubGVuZ3RoID4gMFxyXG5cdFx0Xy5lYWNoIGFwcC5vYmplY3RzLCAob2JqZWN0X25hbWUpLT5cclxuXHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0XHRcdGlmIG9iamVjdFxyXG5cdFx0XHRcdGFwcE9iamVjdHMucHVzaCBvYmplY3RfbmFtZVxyXG5cdHJldHVybiBhcHBPYmplY3RzXHJcblxyXG4j6I635Y+W5a+56LGh5LiL55qE5YiX6KGo6KeG5Zu+XHJcbmdldE9iamVjdHNMaXN0Vmlld3MgPSAoc3BhY2VfaWQsIG9iamVjdHNfbmFtZSktPlxyXG5cdG9iamVjdHNMaXN0Vmlld3MgPSBbXVxyXG5cdGlmIG9iamVjdHNfbmFtZSAmJiBfLmlzQXJyYXkob2JqZWN0c19uYW1lKSAmJiBvYmplY3RzX25hbWUubGVuZ3RoID4gMFxyXG5cdFx0Xy5lYWNoIG9iamVjdHNfbmFtZSwgKG9iamVjdF9uYW1lKS0+XHJcblx0XHRcdCPojrflj5blr7nosaHnmoTlhbHkuqvliJfooajop4blm75saXN0X3ZpZXdzXHJcblx0XHRcdGxpc3Rfdmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc3BhY2U6IHNwYWNlX2lkLCBzaGFyZWQ6IHRydWV9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXHJcblx0XHRcdGxpc3Rfdmlld3MuZm9yRWFjaCAobGlzdF92aWV3KS0+XHJcblx0XHRcdFx0b2JqZWN0c0xpc3RWaWV3cy5wdXNoIGxpc3Rfdmlldy5faWRcclxuXHRyZXR1cm4gb2JqZWN0c0xpc3RWaWV3c1xyXG5cclxuI+iOt+WPluWvueixoeS4i+eahOaKpeihqFxyXG5nZXRPYmplY3RzUmVwb3J0cyA9IChzcGFjZV9pZCwgb2JqZWN0c19uYW1lKS0+XHJcblx0b2JqZWN0c1JlcG9ydHMgPSBbXVxyXG5cdGlmIG9iamVjdHNfbmFtZSAmJiBfLmlzQXJyYXkob2JqZWN0c19uYW1lKSAmJiBvYmplY3RzX25hbWUubGVuZ3RoID4gMFxyXG5cdFx0Xy5lYWNoIG9iamVjdHNfbmFtZSwgKG9iamVjdF9uYW1lKS0+XHJcblx0XHRcdCPojrflj5blr7nosaHnmoTmiqXooahyZXBvcnRzXHJcblx0XHRcdHJlcG9ydHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJyZXBvcnRzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc3BhY2U6IHNwYWNlX2lkfSwge2ZpZWxkczoge19pZDogMX19KVxyXG5cdFx0XHRyZXBvcnRzLmZvckVhY2ggKHJlcG9ydCktPlxyXG5cdFx0XHRcdG9iamVjdHNSZXBvcnRzLnB1c2ggcmVwb3J0Ll9pZFxyXG5cdHJldHVybiBvYmplY3RzUmVwb3J0c1xyXG5cclxuI+iOt+WPluWvueixoeS4i+eahOadg+mZkOmbhlxyXG5nZXRPYmplY3RzUGVybWlzc2lvbk9iamVjdHMgPSAoc3BhY2VfaWQsIG9iamVjdHNfbmFtZSktPlxyXG5cdG9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cyA9IFtdXHJcblx0aWYgb2JqZWN0c19uYW1lICYmIF8uaXNBcnJheShvYmplY3RzX25hbWUpICYmIG9iamVjdHNfbmFtZS5sZW5ndGggPiAwXHJcblx0XHRfLmVhY2ggb2JqZWN0c19uYW1lLCAob2JqZWN0X25hbWUpLT5cclxuXHRcdFx0cGVybWlzc2lvbl9vYmplY3RzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc3BhY2U6IHNwYWNlX2lkfSwge2ZpZWxkczoge19pZDogMX19KVxyXG5cdFx0XHRwZXJtaXNzaW9uX29iamVjdHMuZm9yRWFjaCAocGVybWlzc2lvbl9vYmplY3QpLT5cclxuXHRcdFx0XHRvYmplY3RzUGVybWlzc2lvbk9iamVjdHMucHVzaCBwZXJtaXNzaW9uX29iamVjdC5faWRcclxuXHRyZXR1cm4gb2JqZWN0c1Blcm1pc3Npb25PYmplY3RzXHJcblxyXG4j6I635Y+W5a+56LGh5LiL5p2D6ZmQ6ZuG5a+55bqU55qE5p2D6ZmQ6ZuGXHJcbmdldE9iamVjdHNQZXJtaXNzaW9uU2V0ID0gKHNwYWNlX2lkLCBvYmplY3RzX25hbWUpLT5cclxuXHRvYmplY3RzUGVybWlzc2lvblNldCA9IFtdXHJcblx0aWYgb2JqZWN0c19uYW1lICYmIF8uaXNBcnJheShvYmplY3RzX25hbWUpICYmIG9iamVjdHNfbmFtZS5sZW5ndGggPiAwXHJcblx0XHRfLmVhY2ggb2JqZWN0c19uYW1lLCAob2JqZWN0X25hbWUpLT5cclxuXHRcdFx0cGVybWlzc2lvbl9vYmplY3RzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc3BhY2U6IHNwYWNlX2lkfSwge2ZpZWxkczoge3Blcm1pc3Npb25fc2V0X2lkOiAxfX0pXHJcblx0XHRcdHBlcm1pc3Npb25fb2JqZWN0cy5mb3JFYWNoIChwZXJtaXNzaW9uX29iamVjdCktPlxyXG5cdFx0XHRcdHBlcm1pc3Npb25fc2V0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7X2lkOiBwZXJtaXNzaW9uX29iamVjdC5wZXJtaXNzaW9uX3NldF9pZH0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcclxuXHRcdFx0XHRvYmplY3RzUGVybWlzc2lvblNldC5wdXNoIHBlcm1pc3Npb25fc2V0Ll9pZFxyXG5cdHJldHVybiBvYmplY3RzUGVybWlzc2lvblNldFxyXG5cclxuXHJcbk1ldGVvci5tZXRob2RzXHJcblx0XCJhcHBQYWNrYWdlLmluaXRfZXhwb3J0X2RhdGFcIjogKHNwYWNlX2lkLCByZWNvcmRfaWQpLT5cclxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI0MDFcIiwgXCJBdXRoZW50aWNhdGlvbiBpcyByZXF1aXJlZCBhbmQgaGFzIG5vdCBiZWVuIHByb3ZpZGVkLlwiKVxyXG5cclxuXHRcdGlmICFDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgdXNlcklkKVxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNDAxXCIsIFwiUGVybWlzc2lvbiBkZW5pZWQuXCIpXHJcblxyXG5cdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwbGljYXRpb25fcGFja2FnZVwiKS5maW5kT25lKHtfaWQ6IHJlY29yZF9pZH0pXHJcblxyXG5cdFx0aWYgKCFfLmlzQXJyYXkocmVjb3JkPy5hcHBzKSB8fCByZWNvcmQ/LmFwcHM/Lmxlbmd0aCA8IDEpICYmICghXy5pc0FycmF5KHJlY29yZD8ub2JqZWN0cykgfHwgcmVjb3JkPy5vYmplY3RzPy5sZW5ndGggPCAxKVxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi6K+35YWI6YCJ5oup5bqU55So5oiW6ICF5a+56LGhXCIpXHJcblxyXG5cdFx0ZGF0YSA9IHt9XHJcblx0XHRfb2JqZWN0cyA9IHJlY29yZC5vYmplY3RzIHx8IFtdXHJcblx0XHRfb2JqZWN0c19saXN0X3ZpZXdzID0gcmVjb3JkLmxpc3Rfdmlld3MgfHwgW11cclxuXHRcdF9vYmplY3RzX3JlcG9ydHMgPSByZWNvcmQucmVwb3J0cyB8fCBbXVxyXG5cdFx0X29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzID0gcmVjb3JkLnBlcm1pc3Npb25fb2JqZWN0cyB8fCBbXVxyXG5cdFx0X29iamVjdHNfcGVybWlzc2lvbl9zZXQgPSByZWNvcmQucGVybWlzc2lvbl9zZXQgfHwgW11cclxuXHJcblx0XHR0cnlcclxuXHRcdFx0aWYgXy5pc0FycmF5KHJlY29yZD8uYXBwcykgJiYgcmVjb3JkLmFwcHMubGVuZ3RoID4gMFxyXG5cdFx0XHRcdF8uZWFjaCByZWNvcmQuYXBwcywgKGFwcElkKS0+XHJcblx0XHRcdFx0XHRpZiAhYXBwXHJcblx0XHRcdFx0XHRcdCPlpoLmnpzku47ku6PnoIHkuK3lrprkuYnnmoRhcHBz5Lit5rKh5pyJ5om+5Yiw77yM5YiZ5LuO5pWw5o2u5bqT5Lit6I635Y+WXHJcblx0XHRcdFx0XHRcdGFwcCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImFwcHNcIikuZmluZE9uZSh7X2lkOiBhcHBJZCwgaXNfY3JlYXRvcjogdHJ1ZX0sIHtmaWVsZHM6IHtvYmplY3RzOiAxfX0pXHJcblx0XHRcdFx0XHRfb2JqZWN0cyA9IF9vYmplY3RzLmNvbmNhdChnZXRBcHBPYmplY3RzKGFwcCkpXHJcblxyXG5cdFx0XHRpZiBfLmlzQXJyYXkoX29iamVjdHMpICYmIF9vYmplY3RzLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRfb2JqZWN0c19saXN0X3ZpZXdzID0gX29iamVjdHNfbGlzdF92aWV3cy5jb25jYXQoZ2V0T2JqZWN0c0xpc3RWaWV3cyhzcGFjZV9pZCwgX29iamVjdHMpKVxyXG5cdFx0XHRcdF9vYmplY3RzX3JlcG9ydHMgPSBfb2JqZWN0c19yZXBvcnRzLmNvbmNhdChnZXRPYmplY3RzUmVwb3J0cyhzcGFjZV9pZCwgX29iamVjdHMpKVxyXG5cdFx0XHRcdF9vYmplY3RzX3Blcm1pc3Npb25fb2JqZWN0cyA9IF9vYmplY3RzX3Blcm1pc3Npb25fb2JqZWN0cy5jb25jYXQoZ2V0T2JqZWN0c1Blcm1pc3Npb25PYmplY3RzKHNwYWNlX2lkLCBfb2JqZWN0cykpXHJcblx0XHRcdFx0X29iamVjdHNfcGVybWlzc2lvbl9zZXQgPSBfb2JqZWN0c19wZXJtaXNzaW9uX3NldC5jb25jYXQoZ2V0T2JqZWN0c1Blcm1pc3Npb25TZXQoc3BhY2VfaWQsIF9vYmplY3RzKSlcclxuXHJcblx0XHRcdFx0ZGF0YS5vYmplY3RzID0gXy51bmlxIF9vYmplY3RzXHJcblx0XHRcdFx0ZGF0YS5saXN0X3ZpZXdzID0gXy51bmlxIF9vYmplY3RzX2xpc3Rfdmlld3NcclxuXHRcdFx0XHRkYXRhLnBlcm1pc3Npb25fc2V0ID0gXy51bmlxIF9vYmplY3RzX3Blcm1pc3Npb25fc2V0XHJcblx0XHRcdFx0ZGF0YS5wZXJtaXNzaW9uX29iamVjdHMgPSBfLnVuaXEgX29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzXHJcblx0XHRcdFx0ZGF0YS5yZXBvcnRzID0gXy51bmlxIF9vYmplY3RzX3JlcG9ydHNcclxuXHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBsaWNhdGlvbl9wYWNrYWdlXCIpLnVwZGF0ZSh7X2lkOiByZWNvcmQuX2lkfSx7JHNldDogZGF0YX0pXHJcblx0XHRjYXRjaCBlXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIGUucmVhc29uIHx8IGUubWVzc2FnZSApIiwidmFyIGdldEFwcE9iamVjdHMsIGdldE9iamVjdHNMaXN0Vmlld3MsIGdldE9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cywgZ2V0T2JqZWN0c1Blcm1pc3Npb25TZXQsIGdldE9iamVjdHNSZXBvcnRzO1xuXG5nZXRBcHBPYmplY3RzID0gZnVuY3Rpb24oYXBwKSB7XG4gIHZhciBhcHBPYmplY3RzO1xuICBhcHBPYmplY3RzID0gW107XG4gIGlmIChhcHAgJiYgXy5pc0FycmF5KGFwcC5vYmplY3RzKSAmJiBhcHAub2JqZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgXy5lYWNoKGFwcC5vYmplY3RzLCBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgICAgdmFyIG9iamVjdDtcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICAgIGlmIChvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGFwcE9iamVjdHMucHVzaChvYmplY3RfbmFtZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGFwcE9iamVjdHM7XG59O1xuXG5nZXRPYmplY3RzTGlzdFZpZXdzID0gZnVuY3Rpb24oc3BhY2VfaWQsIG9iamVjdHNfbmFtZSkge1xuICB2YXIgb2JqZWN0c0xpc3RWaWV3cztcbiAgb2JqZWN0c0xpc3RWaWV3cyA9IFtdO1xuICBpZiAob2JqZWN0c19uYW1lICYmIF8uaXNBcnJheShvYmplY3RzX25hbWUpICYmIG9iamVjdHNfbmFtZS5sZW5ndGggPiAwKSB7XG4gICAgXy5lYWNoKG9iamVjdHNfbmFtZSwgZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICAgIHZhciBsaXN0X3ZpZXdzO1xuICAgICAgbGlzdF92aWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICBzaGFyZWQ6IHRydWVcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGxpc3Rfdmlld3MuZm9yRWFjaChmdW5jdGlvbihsaXN0X3ZpZXcpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdHNMaXN0Vmlld3MucHVzaChsaXN0X3ZpZXcuX2lkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3RzTGlzdFZpZXdzO1xufTtcblxuZ2V0T2JqZWN0c1JlcG9ydHMgPSBmdW5jdGlvbihzcGFjZV9pZCwgb2JqZWN0c19uYW1lKSB7XG4gIHZhciBvYmplY3RzUmVwb3J0cztcbiAgb2JqZWN0c1JlcG9ydHMgPSBbXTtcbiAgaWYgKG9iamVjdHNfbmFtZSAmJiBfLmlzQXJyYXkob2JqZWN0c19uYW1lKSAmJiBvYmplY3RzX25hbWUubGVuZ3RoID4gMCkge1xuICAgIF8uZWFjaChvYmplY3RzX25hbWUsIGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgICB2YXIgcmVwb3J0cztcbiAgICAgIHJlcG9ydHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJyZXBvcnRzXCIpLmZpbmQoe1xuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVwb3J0cy5mb3JFYWNoKGZ1bmN0aW9uKHJlcG9ydCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0c1JlcG9ydHMucHVzaChyZXBvcnQuX2lkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3RzUmVwb3J0cztcbn07XG5cbmdldE9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cyA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBvYmplY3RzX25hbWUpIHtcbiAgdmFyIG9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cztcbiAgb2JqZWN0c1Blcm1pc3Npb25PYmplY3RzID0gW107XG4gIGlmIChvYmplY3RzX25hbWUgJiYgXy5pc0FycmF5KG9iamVjdHNfbmFtZSkgJiYgb2JqZWN0c19uYW1lLmxlbmd0aCA+IDApIHtcbiAgICBfLmVhY2gob2JqZWN0c19uYW1lLCBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgICAgdmFyIHBlcm1pc3Npb25fb2JqZWN0cztcbiAgICAgIHBlcm1pc3Npb25fb2JqZWN0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHBlcm1pc3Npb25fb2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBvYmplY3RzUGVybWlzc2lvbk9iamVjdHMucHVzaChwZXJtaXNzaW9uX29iamVjdC5faWQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cztcbn07XG5cbmdldE9iamVjdHNQZXJtaXNzaW9uU2V0ID0gZnVuY3Rpb24oc3BhY2VfaWQsIG9iamVjdHNfbmFtZSkge1xuICB2YXIgb2JqZWN0c1Blcm1pc3Npb25TZXQ7XG4gIG9iamVjdHNQZXJtaXNzaW9uU2V0ID0gW107XG4gIGlmIChvYmplY3RzX25hbWUgJiYgXy5pc0FycmF5KG9iamVjdHNfbmFtZSkgJiYgb2JqZWN0c19uYW1lLmxlbmd0aCA+IDApIHtcbiAgICBfLmVhY2gob2JqZWN0c19uYW1lLCBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgICAgdmFyIHBlcm1pc3Npb25fb2JqZWN0cztcbiAgICAgIHBlcm1pc3Npb25fb2JqZWN0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcGVybWlzc2lvbl9vYmplY3RzLmZvckVhY2goZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3QpIHtcbiAgICAgICAgdmFyIHBlcm1pc3Npb25fc2V0O1xuICAgICAgICBwZXJtaXNzaW9uX3NldCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgICAgIF9pZDogcGVybWlzc2lvbl9vYmplY3QucGVybWlzc2lvbl9zZXRfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9iamVjdHNQZXJtaXNzaW9uU2V0LnB1c2gocGVybWlzc2lvbl9zZXQuX2lkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3RzUGVybWlzc2lvblNldDtcbn07XG5cbk1ldGVvci5tZXRob2RzKHtcbiAgXCJhcHBQYWNrYWdlLmluaXRfZXhwb3J0X2RhdGFcIjogZnVuY3Rpb24oc3BhY2VfaWQsIHJlY29yZF9pZCkge1xuICAgIHZhciBfb2JqZWN0cywgX29iamVjdHNfbGlzdF92aWV3cywgX29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzLCBfb2JqZWN0c19wZXJtaXNzaW9uX3NldCwgX29iamVjdHNfcmVwb3J0cywgZGF0YSwgZSwgcmVjb3JkLCByZWYsIHJlZjEsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjQwMVwiLCBcIkF1dGhlbnRpY2F0aW9uIGlzIHJlcXVpcmVkIGFuZCBoYXMgbm90IGJlZW4gcHJvdmlkZWQuXCIpO1xuICAgIH1cbiAgICBpZiAoIUNyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCB1c2VySWQpKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNDAxXCIsIFwiUGVybWlzc2lvbiBkZW5pZWQuXCIpO1xuICAgIH1cbiAgICByZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBsaWNhdGlvbl9wYWNrYWdlXCIpLmZpbmRPbmUoe1xuICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICB9KTtcbiAgICBpZiAoKCFfLmlzQXJyYXkocmVjb3JkICE9IG51bGwgPyByZWNvcmQuYXBwcyA6IHZvaWQgMCkgfHwgKHJlY29yZCAhPSBudWxsID8gKHJlZiA9IHJlY29yZC5hcHBzKSAhPSBudWxsID8gcmVmLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkgPCAxKSAmJiAoIV8uaXNBcnJheShyZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5vYmplY3RzIDogdm9pZCAwKSB8fCAocmVjb3JkICE9IG51bGwgPyAocmVmMSA9IHJlY29yZC5vYmplY3RzKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIDwgMSkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLor7flhYjpgInmi6nlupTnlKjmiJbogIXlr7nosaFcIik7XG4gICAgfVxuICAgIGRhdGEgPSB7fTtcbiAgICBfb2JqZWN0cyA9IHJlY29yZC5vYmplY3RzIHx8IFtdO1xuICAgIF9vYmplY3RzX2xpc3Rfdmlld3MgPSByZWNvcmQubGlzdF92aWV3cyB8fCBbXTtcbiAgICBfb2JqZWN0c19yZXBvcnRzID0gcmVjb3JkLnJlcG9ydHMgfHwgW107XG4gICAgX29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzID0gcmVjb3JkLnBlcm1pc3Npb25fb2JqZWN0cyB8fCBbXTtcbiAgICBfb2JqZWN0c19wZXJtaXNzaW9uX3NldCA9IHJlY29yZC5wZXJtaXNzaW9uX3NldCB8fCBbXTtcbiAgICB0cnkge1xuICAgICAgaWYgKF8uaXNBcnJheShyZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5hcHBzIDogdm9pZCAwKSAmJiByZWNvcmQuYXBwcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIF8uZWFjaChyZWNvcmQuYXBwcywgZnVuY3Rpb24oYXBwSWQpIHtcbiAgICAgICAgICB2YXIgYXBwO1xuICAgICAgICAgIGlmICghYXBwKSB7XG4gICAgICAgICAgICBhcHAgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBzXCIpLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IGFwcElkLFxuICAgICAgICAgICAgICBpc19jcmVhdG9yOiB0cnVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIG9iamVjdHM6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfb2JqZWN0cyA9IF9vYmplY3RzLmNvbmNhdChnZXRBcHBPYmplY3RzKGFwcCkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChfLmlzQXJyYXkoX29iamVjdHMpICYmIF9vYmplY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgX29iamVjdHNfbGlzdF92aWV3cyA9IF9vYmplY3RzX2xpc3Rfdmlld3MuY29uY2F0KGdldE9iamVjdHNMaXN0Vmlld3Moc3BhY2VfaWQsIF9vYmplY3RzKSk7XG4gICAgICAgIF9vYmplY3RzX3JlcG9ydHMgPSBfb2JqZWN0c19yZXBvcnRzLmNvbmNhdChnZXRPYmplY3RzUmVwb3J0cyhzcGFjZV9pZCwgX29iamVjdHMpKTtcbiAgICAgICAgX29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzID0gX29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzLmNvbmNhdChnZXRPYmplY3RzUGVybWlzc2lvbk9iamVjdHMoc3BhY2VfaWQsIF9vYmplY3RzKSk7XG4gICAgICAgIF9vYmplY3RzX3Blcm1pc3Npb25fc2V0ID0gX29iamVjdHNfcGVybWlzc2lvbl9zZXQuY29uY2F0KGdldE9iamVjdHNQZXJtaXNzaW9uU2V0KHNwYWNlX2lkLCBfb2JqZWN0cykpO1xuICAgICAgICBkYXRhLm9iamVjdHMgPSBfLnVuaXEoX29iamVjdHMpO1xuICAgICAgICBkYXRhLmxpc3Rfdmlld3MgPSBfLnVuaXEoX29iamVjdHNfbGlzdF92aWV3cyk7XG4gICAgICAgIGRhdGEucGVybWlzc2lvbl9zZXQgPSBfLnVuaXEoX29iamVjdHNfcGVybWlzc2lvbl9zZXQpO1xuICAgICAgICBkYXRhLnBlcm1pc3Npb25fb2JqZWN0cyA9IF8udW5pcShfb2JqZWN0c19wZXJtaXNzaW9uX29iamVjdHMpO1xuICAgICAgICBkYXRhLnJlcG9ydHMgPSBfLnVuaXEoX29iamVjdHNfcmVwb3J0cyk7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBsaWNhdGlvbl9wYWNrYWdlXCIpLnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiByZWNvcmQuX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiBkYXRhXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlID0gZXJyb3I7XG4gICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufSk7XG4iLCJAQVBUcmFuc2Zvcm0gPSB7fVxyXG5cclxuaWdub3JlX2ZpZWxkcyA9IHtcclxuXHRvd25lcjogMCxcclxuXHRzcGFjZTogMCxcclxuXHRjcmVhdGVkOiAwLFxyXG5cdGNyZWF0ZWRfYnk6IDAsXHJcblx0bW9kaWZpZWQ6IDAsXHJcblx0bW9kaWZpZWRfYnk6IDAsXHJcblx0aXNfZGVsZXRlZDogMCxcclxuXHRpbnN0YW5jZXM6IDAsXHJcblx0c2hhcmluZzogMFxyXG59XHJcblxyXG5BUFRyYW5zZm9ybS5leHBvcnRPYmplY3QgPSAob2JqZWN0KS0+XHJcblx0X29iaiA9IHt9XHJcblxyXG5cdF8uZXh0ZW5kKF9vYmogLCBvYmplY3QpXHJcblxyXG5cdG9ial9saXN0X3ZpZXdzID0ge31cclxuXHJcblx0Xy5leHRlbmQob2JqX2xpc3Rfdmlld3MsIF9vYmoubGlzdF92aWV3cyB8fCB7fSlcclxuXHJcblx0Xy5lYWNoIG9ial9saXN0X3ZpZXdzLCAodiwgayktPlxyXG5cdFx0aWYgIV8uaGFzKHYsIFwiX2lkXCIpXHJcblx0XHRcdHYuX2lkID0ga1xyXG5cdFx0aWYgIV8uaGFzKHYsIFwibmFtZVwiKVxyXG5cdFx0XHR2Lm5hbWUgPSBrXHJcblx0X29iai5saXN0X3ZpZXdzID0gb2JqX2xpc3Rfdmlld3NcclxuXHJcblxyXG5cdCPlj6rkv67mlLlfb2Jq5bGe5oCn5Y6fb2JqZWN05bGe5oCn5L+d5oyB5LiN5Y+YXHJcblx0dHJpZ2dlcnMgPSB7fVxyXG5cdF8uZm9yRWFjaCBfb2JqLnRyaWdnZXJzLCAodHJpZ2dlciwga2V5KS0+XHJcblx0XHRfdHJpZ2dlciA9IHt9XHJcblx0XHRfLmV4dGVuZChfdHJpZ2dlciwgdHJpZ2dlcilcclxuXHRcdGlmIF8uaXNGdW5jdGlvbihfdHJpZ2dlci50b2RvKVxyXG5cdFx0XHRfdHJpZ2dlci50b2RvID0gX3RyaWdnZXIudG9kby50b1N0cmluZygpXHJcblx0XHRkZWxldGUgX3RyaWdnZXIuX3RvZG9cclxuXHRcdHRyaWdnZXJzW2tleV0gPSBfdHJpZ2dlclxyXG5cdF9vYmoudHJpZ2dlcnMgPSB0cmlnZ2Vyc1xyXG5cclxuXHRhY3Rpb25zID0ge31cclxuXHRfLmZvckVhY2ggX29iai5hY3Rpb25zLCAoYWN0aW9uLCBrZXkpLT5cclxuXHRcdF9hY3Rpb24gPSB7fVxyXG5cdFx0Xy5leHRlbmQoX2FjdGlvbiwgYWN0aW9uKVxyXG5cdFx0aWYgXy5pc0Z1bmN0aW9uKF9hY3Rpb24udG9kbylcclxuXHRcdFx0X2FjdGlvbi50b2RvID0gX2FjdGlvbi50b2RvLnRvU3RyaW5nKClcclxuXHRcdGRlbGV0ZSBfYWN0aW9uLl90b2RvXHJcblx0XHRhY3Rpb25zW2tleV0gPSBfYWN0aW9uXHJcblxyXG5cdF9vYmouYWN0aW9ucyA9IGFjdGlvbnNcclxuXHJcblx0ZmllbGRzID0ge31cclxuXHRfLmZvckVhY2ggX29iai5maWVsZHMsIChmaWVsZCwga2V5KS0+XHJcblx0XHRfZmllbGQgPSB7fVxyXG5cdFx0Xy5leHRlbmQoX2ZpZWxkLCBmaWVsZClcclxuXHRcdGlmIF8uaXNGdW5jdGlvbihfZmllbGQub3B0aW9ucylcclxuXHRcdFx0X2ZpZWxkLm9wdGlvbnMgPSBfZmllbGQub3B0aW9ucy50b1N0cmluZygpXHJcblx0XHRcdGRlbGV0ZSBfZmllbGQuX29wdGlvbnNcclxuXHJcblx0XHRpZiBfLmlzQXJyYXkoX2ZpZWxkLm9wdGlvbnMpXHJcblx0XHRcdF9mbyA9IFtdXHJcblx0XHRcdF8uZm9yRWFjaCBfZmllbGQub3B0aW9ucywgKF9vMSktPlxyXG5cdFx0XHRcdF9mby5wdXNoKFwiI3tfbzEubGFiZWx9OiN7X28xLnZhbHVlfVwiKVxyXG5cdFx0XHRfZmllbGQub3B0aW9ucyA9IF9mby5qb2luKFwiLFwiKVxyXG5cdFx0XHRkZWxldGUgX2ZpZWxkLl9vcHRpb25zXHJcblxyXG5cdFx0aWYgX2ZpZWxkLnJlZ0V4XHJcblx0XHRcdF9maWVsZC5yZWdFeCA9IF9maWVsZC5yZWdFeC50b1N0cmluZygpXHJcblx0XHRcdGRlbGV0ZSBfZmllbGQuX3JlZ0V4XHJcblxyXG5cdFx0aWYgXy5pc0Z1bmN0aW9uKF9maWVsZC5vcHRpb25zRnVuY3Rpb24pXHJcblx0XHRcdF9maWVsZC5vcHRpb25zRnVuY3Rpb24gPSBfZmllbGQub3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKClcclxuXHRcdFx0ZGVsZXRlIF9maWVsZC5fb3B0aW9uc0Z1bmN0aW9uXHJcblxyXG5cdFx0aWYgXy5pc0Z1bmN0aW9uKF9maWVsZC5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdF9maWVsZC5yZWZlcmVuY2VfdG8gPSBfZmllbGQucmVmZXJlbmNlX3RvLnRvU3RyaW5nKClcclxuXHRcdFx0ZGVsZXRlIF9maWVsZC5fcmVmZXJlbmNlX3RvXHJcblxyXG5cdFx0aWYgXy5pc0Z1bmN0aW9uKF9maWVsZC5jcmVhdGVGdW5jdGlvbilcclxuXHRcdFx0X2ZpZWxkLmNyZWF0ZUZ1bmN0aW9uID0gX2ZpZWxkLmNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKClcclxuXHRcdFx0ZGVsZXRlIF9maWVsZC5fY3JlYXRlRnVuY3Rpb25cclxuXHJcblx0XHRpZiBfLmlzRnVuY3Rpb24oX2ZpZWxkLmRlZmF1bHRWYWx1ZSlcclxuXHRcdFx0X2ZpZWxkLmRlZmF1bHRWYWx1ZSA9IF9maWVsZC5kZWZhdWx0VmFsdWUudG9TdHJpbmcoKVxyXG5cdFx0XHRkZWxldGUgX2ZpZWxkLl9kZWZhdWx0VmFsdWVcclxuXHRcdCNUT0RPIOi9rOaNomZpZWxkLmF1dG9mb3JtLnR5cGXvvIzlt7LlkozmnLHmgJ3lmInnoa7orqTvvIznm67liY3kuI3mlK/mjIFhdXRvZm9ybS50eXBlIOS4umZ1bmN0aW9u57G75Z6LXHJcblx0XHRmaWVsZHNba2V5XSA9IF9maWVsZFxyXG5cclxuXHRfb2JqLmZpZWxkcyA9IGZpZWxkc1xyXG5cclxuXHRyZXR1cm4gX29ialxyXG5cclxuIyMjXHJcbuWvvOWHuuaVsOaNrjpcclxue1xyXG5cdGFwcHM6W3t9XSwg6L2v5Lu25YyF6YCJ5Lit55qEYXBwc1xyXG5cdG9iamVjdHM6W3t9XSwg6YCJ5Lit55qEb2JqZWN05Y+K5YW2ZmllbGRzLCBsaXN0X3ZpZXdzLCB0cmlnZ2VycywgYWN0aW9ucywgcGVybWlzc2lvbl9zZXTnrYlcclxuICAgIGxpc3Rfdmlld3M6W3t9XSwg6L2v5Lu25YyF6YCJ5Lit55qEbGlzdF92aWV3c1xyXG4gICAgcGVybWlzc2lvbnM6W3t9XSwg6L2v5Lu25YyF6YCJ5Lit55qE5p2D6ZmQ6ZuGXHJcbiAgICBwZXJtaXNzaW9uX29iamVjdHM6W3t9XSwg6L2v5Lu25YyF6YCJ5Lit55qE5p2D6ZmQ5a+56LGhXHJcbiAgICByZXBvcnRzOlt7fV0g6L2v5Lu25YyF6YCJ5Lit55qE5oql6KGoXHJcbn1cclxuIyMjXHJcbkFQVHJhbnNmb3JtLmV4cG9ydCA9IChyZWNvcmQpLT5cclxuXHRleHBvcnRfZGF0YSA9IHt9XHJcblx0aWYgXy5pc0FycmF5KHJlY29yZC5hcHBzKSAmJiByZWNvcmQuYXBwcy5sZW5ndGggPiAwXHJcblx0XHRleHBvcnRfZGF0YS5hcHBzID0gW11cclxuXHJcblx0XHRfLmVhY2ggcmVjb3JkLmFwcHMsIChhcHBLZXkpLT5cclxuXHRcdFx0YXBwID0ge31cclxuXHRcdFx0Xy5leHRlbmQoYXBwLCBDcmVhdG9yLkFwcHNbYXBwS2V5XSlcclxuXHRcdFx0aWYgIWFwcCB8fCBfLmlzRW1wdHkoYXBwKVxyXG5cdFx0XHRcdGFwcCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImFwcHNcIikuZmluZE9uZSh7X2lkOiBhcHBLZXl9LCB7ZmllbGRzOiBpZ25vcmVfZmllbGRzfSlcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlmICFfLmhhcyhhcHAsIFwiX2lkXCIpXHJcblx0XHRcdFx0XHRhcHAuX2lkID0gYXBwS2V5XHJcblx0XHRcdGlmIGFwcFxyXG5cdFx0XHRcdGV4cG9ydF9kYXRhLmFwcHMucHVzaCBhcHBcclxuXHJcblx0aWYgXy5pc0FycmF5KHJlY29yZC5vYmplY3RzKSAmJiByZWNvcmQub2JqZWN0cy5sZW5ndGggPiAwXHJcblx0XHRleHBvcnRfZGF0YS5vYmplY3RzID0gW11cclxuXHRcdF8uZWFjaCByZWNvcmQub2JqZWN0cywgKG9iamVjdF9uYW1lKS0+XHJcblx0XHRcdG9iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cclxuXHRcdFx0aWYgb2JqZWN0XHJcblx0XHRcdFx0ZXhwb3J0X2RhdGEub2JqZWN0cy5wdXNoIEFQVHJhbnNmb3JtLmV4cG9ydE9iamVjdChvYmplY3QpXHJcblxyXG5cdGlmIF8uaXNBcnJheShyZWNvcmQubGlzdF92aWV3cykgJiYgcmVjb3JkLmxpc3Rfdmlld3MubGVuZ3RoID4gMFxyXG5cdFx0ZXhwb3J0X2RhdGEubGlzdF92aWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7X2lkOiB7JGluOiByZWNvcmQubGlzdF92aWV3c319LCB7ZmllbGRzOiBpZ25vcmVfZmllbGRzfSkuZmV0Y2goKVxyXG5cclxuXHRpZiBfLmlzQXJyYXkocmVjb3JkLnBlcm1pc3Npb25fc2V0KSAmJiByZWNvcmQucGVybWlzc2lvbl9zZXQubGVuZ3RoID4gMFxyXG5cdFx0ZXhwb3J0X2RhdGEucGVybWlzc2lvbl9zZXQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtfaWQ6IHskaW46IHJlY29yZC5wZXJtaXNzaW9uX3NldH19LCB7ZmllbGRzOiBpZ25vcmVfZmllbGRzfSkuZmV0Y2goKVxyXG5cclxuXHRpZiBfLmlzQXJyYXkocmVjb3JkLnBlcm1pc3Npb25fb2JqZWN0cykgJiYgcmVjb3JkLnBlcm1pc3Npb25fb2JqZWN0cy5sZW5ndGggPiAwXHJcblx0XHRleHBvcnRfZGF0YS5wZXJtaXNzaW9uX29iamVjdHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7X2lkOiB7JGluOiByZWNvcmQucGVybWlzc2lvbl9vYmplY3RzfX0sIHtmaWVsZHM6IGlnbm9yZV9maWVsZHN9KS5mZXRjaCgpXHJcblxyXG5cdGlmIF8uaXNBcnJheShyZWNvcmQucmVwb3J0cykgJiYgcmVjb3JkLnJlcG9ydHMubGVuZ3RoID4gMFxyXG5cdFx0ZXhwb3J0X2RhdGEucmVwb3J0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInJlcG9ydHNcIikuZmluZCh7X2lkOiB7JGluOiByZWNvcmQucmVwb3J0c319LCB7ZmllbGRzOiBpZ25vcmVfZmllbGRzfSkuZmV0Y2goKVxyXG5cclxuXHRyZXR1cm4gZXhwb3J0X2RhdGFcclxuIiwidmFyIGlnbm9yZV9maWVsZHM7XG5cbnRoaXMuQVBUcmFuc2Zvcm0gPSB7fTtcblxuaWdub3JlX2ZpZWxkcyA9IHtcbiAgb3duZXI6IDAsXG4gIHNwYWNlOiAwLFxuICBjcmVhdGVkOiAwLFxuICBjcmVhdGVkX2J5OiAwLFxuICBtb2RpZmllZDogMCxcbiAgbW9kaWZpZWRfYnk6IDAsXG4gIGlzX2RlbGV0ZWQ6IDAsXG4gIGluc3RhbmNlczogMCxcbiAgc2hhcmluZzogMFxufTtcblxuQVBUcmFuc2Zvcm0uZXhwb3J0T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBfb2JqLCBhY3Rpb25zLCBmaWVsZHMsIG9ial9saXN0X3ZpZXdzLCB0cmlnZ2VycztcbiAgX29iaiA9IHt9O1xuICBfLmV4dGVuZChfb2JqLCBvYmplY3QpO1xuICBvYmpfbGlzdF92aWV3cyA9IHt9O1xuICBfLmV4dGVuZChvYmpfbGlzdF92aWV3cywgX29iai5saXN0X3ZpZXdzIHx8IHt9KTtcbiAgXy5lYWNoKG9ial9saXN0X3ZpZXdzLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgaWYgKCFfLmhhcyh2LCBcIl9pZFwiKSkge1xuICAgICAgdi5faWQgPSBrO1xuICAgIH1cbiAgICBpZiAoIV8uaGFzKHYsIFwibmFtZVwiKSkge1xuICAgICAgcmV0dXJuIHYubmFtZSA9IGs7XG4gICAgfVxuICB9KTtcbiAgX29iai5saXN0X3ZpZXdzID0gb2JqX2xpc3Rfdmlld3M7XG4gIHRyaWdnZXJzID0ge307XG4gIF8uZm9yRWFjaChfb2JqLnRyaWdnZXJzLCBmdW5jdGlvbih0cmlnZ2VyLCBrZXkpIHtcbiAgICB2YXIgX3RyaWdnZXI7XG4gICAgX3RyaWdnZXIgPSB7fTtcbiAgICBfLmV4dGVuZChfdHJpZ2dlciwgdHJpZ2dlcik7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihfdHJpZ2dlci50b2RvKSkge1xuICAgICAgX3RyaWdnZXIudG9kbyA9IF90cmlnZ2VyLnRvZG8udG9TdHJpbmcoKTtcbiAgICB9XG4gICAgZGVsZXRlIF90cmlnZ2VyLl90b2RvO1xuICAgIHJldHVybiB0cmlnZ2Vyc1trZXldID0gX3RyaWdnZXI7XG4gIH0pO1xuICBfb2JqLnRyaWdnZXJzID0gdHJpZ2dlcnM7XG4gIGFjdGlvbnMgPSB7fTtcbiAgXy5mb3JFYWNoKF9vYmouYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBrZXkpIHtcbiAgICB2YXIgX2FjdGlvbjtcbiAgICBfYWN0aW9uID0ge307XG4gICAgXy5leHRlbmQoX2FjdGlvbiwgYWN0aW9uKTtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKF9hY3Rpb24udG9kbykpIHtcbiAgICAgIF9hY3Rpb24udG9kbyA9IF9hY3Rpb24udG9kby50b1N0cmluZygpO1xuICAgIH1cbiAgICBkZWxldGUgX2FjdGlvbi5fdG9kbztcbiAgICByZXR1cm4gYWN0aW9uc1trZXldID0gX2FjdGlvbjtcbiAgfSk7XG4gIF9vYmouYWN0aW9ucyA9IGFjdGlvbnM7XG4gIGZpZWxkcyA9IHt9O1xuICBfLmZvckVhY2goX29iai5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICB2YXIgX2ZpZWxkLCBfZm87XG4gICAgX2ZpZWxkID0ge307XG4gICAgXy5leHRlbmQoX2ZpZWxkLCBmaWVsZCk7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihfZmllbGQub3B0aW9ucykpIHtcbiAgICAgIF9maWVsZC5vcHRpb25zID0gX2ZpZWxkLm9wdGlvbnMudG9TdHJpbmcoKTtcbiAgICAgIGRlbGV0ZSBfZmllbGQuX29wdGlvbnM7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkoX2ZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICBfZm8gPSBbXTtcbiAgICAgIF8uZm9yRWFjaChfZmllbGQub3B0aW9ucywgZnVuY3Rpb24oX28xKSB7XG4gICAgICAgIHJldHVybiBfZm8ucHVzaChfbzEubGFiZWwgKyBcIjpcIiArIF9vMS52YWx1ZSk7XG4gICAgICB9KTtcbiAgICAgIF9maWVsZC5vcHRpb25zID0gX2ZvLmpvaW4oXCIsXCIpO1xuICAgICAgZGVsZXRlIF9maWVsZC5fb3B0aW9ucztcbiAgICB9XG4gICAgaWYgKF9maWVsZC5yZWdFeCkge1xuICAgICAgX2ZpZWxkLnJlZ0V4ID0gX2ZpZWxkLnJlZ0V4LnRvU3RyaW5nKCk7XG4gICAgICBkZWxldGUgX2ZpZWxkLl9yZWdFeDtcbiAgICB9XG4gICAgaWYgKF8uaXNGdW5jdGlvbihfZmllbGQub3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgX2ZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IF9maWVsZC5vcHRpb25zRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIGRlbGV0ZSBfZmllbGQuX29wdGlvbnNGdW5jdGlvbjtcbiAgICB9XG4gICAgaWYgKF8uaXNGdW5jdGlvbihfZmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgX2ZpZWxkLnJlZmVyZW5jZV90byA9IF9maWVsZC5yZWZlcmVuY2VfdG8udG9TdHJpbmcoKTtcbiAgICAgIGRlbGV0ZSBfZmllbGQuX3JlZmVyZW5jZV90bztcbiAgICB9XG4gICAgaWYgKF8uaXNGdW5jdGlvbihfZmllbGQuY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICBfZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBfZmllbGQuY3JlYXRlRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIGRlbGV0ZSBfZmllbGQuX2NyZWF0ZUZ1bmN0aW9uO1xuICAgIH1cbiAgICBpZiAoXy5pc0Z1bmN0aW9uKF9maWVsZC5kZWZhdWx0VmFsdWUpKSB7XG4gICAgICBfZmllbGQuZGVmYXVsdFZhbHVlID0gX2ZpZWxkLmRlZmF1bHRWYWx1ZS50b1N0cmluZygpO1xuICAgICAgZGVsZXRlIF9maWVsZC5fZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzW2tleV0gPSBfZmllbGQ7XG4gIH0pO1xuICBfb2JqLmZpZWxkcyA9IGZpZWxkcztcbiAgcmV0dXJuIF9vYmo7XG59O1xuXG5cbi8qXG7lr7zlh7rmlbDmja46XG57XG5cdGFwcHM6W3t9XSwg6L2v5Lu25YyF6YCJ5Lit55qEYXBwc1xuXHRvYmplY3RzOlt7fV0sIOmAieS4reeahG9iamVjdOWPiuWFtmZpZWxkcywgbGlzdF92aWV3cywgdHJpZ2dlcnMsIGFjdGlvbnMsIHBlcm1pc3Npb25fc2V0562JXG4gICAgbGlzdF92aWV3czpbe31dLCDova/ku7bljIXpgInkuK3nmoRsaXN0X3ZpZXdzXG4gICAgcGVybWlzc2lvbnM6W3t9XSwg6L2v5Lu25YyF6YCJ5Lit55qE5p2D6ZmQ6ZuGXG4gICAgcGVybWlzc2lvbl9vYmplY3RzOlt7fV0sIOi9r+S7tuWMhemAieS4reeahOadg+mZkOWvueixoVxuICAgIHJlcG9ydHM6W3t9XSDova/ku7bljIXpgInkuK3nmoTmiqXooahcbn1cbiAqL1xuXG5BUFRyYW5zZm9ybVtcImV4cG9ydFwiXSA9IGZ1bmN0aW9uKHJlY29yZCkge1xuICB2YXIgZXhwb3J0X2RhdGE7XG4gIGV4cG9ydF9kYXRhID0ge307XG4gIGlmIChfLmlzQXJyYXkocmVjb3JkLmFwcHMpICYmIHJlY29yZC5hcHBzLmxlbmd0aCA+IDApIHtcbiAgICBleHBvcnRfZGF0YS5hcHBzID0gW107XG4gICAgXy5lYWNoKHJlY29yZC5hcHBzLCBmdW5jdGlvbihhcHBLZXkpIHtcbiAgICAgIHZhciBhcHA7XG4gICAgICBhcHAgPSB7fTtcbiAgICAgIF8uZXh0ZW5kKGFwcCwgQ3JlYXRvci5BcHBzW2FwcEtleV0pO1xuICAgICAgaWYgKCFhcHAgfHwgXy5pc0VtcHR5KGFwcCkpIHtcbiAgICAgICAgYXBwID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwc1wiKS5maW5kT25lKHtcbiAgICAgICAgICBfaWQ6IGFwcEtleVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBpZ25vcmVfZmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFfLmhhcyhhcHAsIFwiX2lkXCIpKSB7XG4gICAgICAgICAgYXBwLl9pZCA9IGFwcEtleTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGFwcCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0X2RhdGEuYXBwcy5wdXNoKGFwcCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaWYgKF8uaXNBcnJheShyZWNvcmQub2JqZWN0cykgJiYgcmVjb3JkLm9iamVjdHMubGVuZ3RoID4gMCkge1xuICAgIGV4cG9ydF9kYXRhLm9iamVjdHMgPSBbXTtcbiAgICBfLmVhY2gocmVjb3JkLm9iamVjdHMsIGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgICB2YXIgb2JqZWN0O1xuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgICAgIGlmIChvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydF9kYXRhLm9iamVjdHMucHVzaChBUFRyYW5zZm9ybS5leHBvcnRPYmplY3Qob2JqZWN0KSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaWYgKF8uaXNBcnJheShyZWNvcmQubGlzdF92aWV3cykgJiYgcmVjb3JkLmxpc3Rfdmlld3MubGVuZ3RoID4gMCkge1xuICAgIGV4cG9ydF9kYXRhLmxpc3Rfdmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogcmVjb3JkLmxpc3Rfdmlld3NcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IGlnbm9yZV9maWVsZHNcbiAgICB9KS5mZXRjaCgpO1xuICB9XG4gIGlmIChfLmlzQXJyYXkocmVjb3JkLnBlcm1pc3Npb25fc2V0KSAmJiByZWNvcmQucGVybWlzc2lvbl9zZXQubGVuZ3RoID4gMCkge1xuICAgIGV4cG9ydF9kYXRhLnBlcm1pc3Npb25fc2V0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiByZWNvcmQucGVybWlzc2lvbl9zZXRcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IGlnbm9yZV9maWVsZHNcbiAgICB9KS5mZXRjaCgpO1xuICB9XG4gIGlmIChfLmlzQXJyYXkocmVjb3JkLnBlcm1pc3Npb25fb2JqZWN0cykgJiYgcmVjb3JkLnBlcm1pc3Npb25fb2JqZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgZXhwb3J0X2RhdGEucGVybWlzc2lvbl9vYmplY3RzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogcmVjb3JkLnBlcm1pc3Npb25fb2JqZWN0c1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczogaWdub3JlX2ZpZWxkc1xuICAgIH0pLmZldGNoKCk7XG4gIH1cbiAgaWYgKF8uaXNBcnJheShyZWNvcmQucmVwb3J0cykgJiYgcmVjb3JkLnJlcG9ydHMubGVuZ3RoID4gMCkge1xuICAgIGV4cG9ydF9kYXRhLnJlcG9ydHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJyZXBvcnRzXCIpLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogcmVjb3JkLnJlcG9ydHNcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IGlnbm9yZV9maWVsZHNcbiAgICB9KS5mZXRjaCgpO1xuICB9XG4gIHJldHVybiBleHBvcnRfZGF0YTtcbn07XG4iXX0=
