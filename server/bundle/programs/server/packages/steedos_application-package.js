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
  icon: "folder",
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcHBsaWNhdGlvbi1wYWNrYWdlL21vZGVscy9hcHBsaWNhdGlvbl9wYWNrYWdlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbW9kZWxzL2FwcGxpY2F0aW9uX3BhY2thZ2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwcGxpY2F0aW9uLXBhY2thZ2Uvc2VydmVyL3JvdXRlcy9leHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2V4cG9ydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBwbGljYXRpb24tcGFja2FnZS9zZXJ2ZXIvcm91dGVzL2ltcG9ydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9yb3V0ZXMvaW1wb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcHBsaWNhdGlvbi1wYWNrYWdlL3NlcnZlci9tZXRob2RzL2xpc3R2aWV3c19vcHRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvbGlzdHZpZXdzX29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwcGxpY2F0aW9uLXBhY2thZ2Uvc2VydmVyL21ldGhvZHMvaW5pdF9leHBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2luaXRfZXhwb3J0X2RhdGEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwcGxpY2F0aW9uLXBhY2thZ2UvbGliL3RyYW5zZm9ybS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi90cmFuc2Zvcm0uY29mZmVlIl0sIm5hbWVzIjpbIkNyZWF0b3IiLCJPYmplY3RzIiwiYXBwbGljYXRpb25fcGFja2FnZSIsIm5hbWUiLCJpY29uIiwibGFiZWwiLCJoaWRkZW4iLCJmaWVsZHMiLCJ0eXBlIiwiYXBwcyIsInJlZmVyZW5jZV90byIsIm11bHRpcGxlIiwib3B0aW9uc0Z1bmN0aW9uIiwiX29wdGlvbnMiLCJfIiwiZm9yRWFjaCIsIkFwcHMiLCJvIiwiayIsInB1c2giLCJ2YWx1ZSIsImljb25fc2xkcyIsIm9iamVjdHMiLCJvYmplY3RzQnlOYW1lIiwibGlzdF92aWV3cyIsIm9wdGlvbnNNZXRob2QiLCJwZXJtaXNzaW9uX3NldCIsInBlcm1pc3Npb25fb2JqZWN0cyIsInJlcG9ydHMiLCJhbGwiLCJjb2x1bW5zIiwiZmlsdGVyX3Njb3BlIiwiYWN0aW9ucyIsImluaXRfZGF0YSIsInZpc2libGUiLCJvbiIsInRvZG8iLCJvYmplY3RfbmFtZSIsInJlY29yZF9pZCIsImNvbnNvbGUiLCJsb2ciLCJNZXRlb3IiLCJjYWxsIiwiU2Vzc2lvbiIsImdldCIsImVycm9yIiwicmVzdWx0IiwidG9hc3RyIiwicmVhc29uIiwic3VjY2VzcyIsInVybCIsIlN0ZWVkb3MiLCJhYnNvbHV0ZVVybCIsIndpbmRvdyIsIm9wZW4iLCJNb2RhbCIsInNob3ciLCJKc29uUm91dGVzIiwiYWRkIiwicmVxIiwicmVzIiwibmV4dCIsImRhdGEiLCJlIiwiZmlsZU5hbWUiLCJyZWNvcmQiLCJzcGFjZV9pZCIsInNwYWNlX3VzZXIiLCJ1c2VySWQiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwic2VuZFJlc3VsdCIsImNvZGUiLCJlcnJvcnMiLCJwYXJhbXMiLCJpc1NwYWNlQWRtaW4iLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsIl9pZCIsInVzZXIiLCJzcGFjZSIsIkFQVHJhbnNmb3JtIiwiZGF0YVNvdXJjZSIsInNldEhlYWRlciIsImVuY29kZVVSSSIsImVuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzdGFjayIsIm1lc3NhZ2UiLCJ0cmFuc2Zvcm1GaWVsZE9wdGlvbnMiLCJ0cmFuc2Zvcm1GaWx0ZXJzIiwiZmlsdGVycyIsIl9maWx0ZXJzIiwiZWFjaCIsImYiLCJpc0FycmF5IiwibGVuZ3RoIiwiZmllbGQiLCJvcGVyYXRpb24iLCJvcHRpb25zIiwiaGFzIiwiam9pbiIsImltcG9ydE9iamVjdCIsIm9iamVjdCIsImxpc3Rfdmlld3NfaWRfbWFwcyIsIl9maWVsZG5hbWVzIiwiaGFzUmVjZW50VmlldyIsImludGVybmFsX2xpc3RfdmlldyIsIm9ial9saXN0X3ZpZXdzIiwidHJpZ2dlcnMiLCJwZXJtaXNzaW9ucyIsIm93bmVyIiwiaW5zZXJ0IiwibGlzdF92aWV3IiwibmV3X2lkIiwib2xkX2lkIiwiaXNSZWNlbnRWaWV3IiwiaXNBbGxWaWV3IiwiJHNldCIsIiR1bnNldCIsInVwZGF0ZSIsInJlbW92ZSIsImNvbnRhaW5zIiwiZGlyZWN0IiwidHJpZ2dlciIsInJlcGxhY2UiLCJSZWdFeHAiLCJpc19lbmFibGUiLCJhY3Rpb24iLCJpbXBvcnRfYXBwX3BhY2thZ2UiLCJpbXBfZGF0YSIsImZyb21fdGVtcGxhdGUiLCJhcHBzX2lkX21hcHMiLCJpbXBfYXBwX2lkcyIsImltcF9vYmplY3RfbmFtZXMiLCJvYmplY3RfbmFtZXMiLCJwZXJtaXNzaW9uX3NldF9pZF9tYXBzIiwicGVybWlzc2lvbl9zZXRfaWRzIiwiRXJyb3IiLCJjaGVjayIsIk9iamVjdCIsInBsdWNrIiwiYXBwIiwiaW5jbHVkZSIsImtleXMiLCJpc0xlZ2FsVmVyc2lvbiIsImlzU3RyaW5nIiwiYXNzaWduZWRfYXBwcyIsImFwcF9pZCIsInBlcm1pc3Npb25fb2JqZWN0IiwicGVybWlzc2lvbl9zZXRfaWQiLCJyZXBvcnQiLCJpc19jcmVhdG9yIiwiX2xpc3RfdmlldyIsInBlcm1pc3Npb25fc2V0X3VzZXJzIiwidXNlcnMiLCJ1c2VyX2lkIiwiZGlzYWJsZWRfbGlzdF92aWV3cyIsImxpc3Rfdmlld19pZCIsIm5ld192aWV3X2lkIiwibWV0aG9kcyIsImNvbGxlY3Rpb24iLCJuYW1lX2ZpZWxkX2tleSIsInF1ZXJ5IiwicXVlcnlfb3B0aW9ucyIsInJlY29yZHMiLCJyZWYiLCJyZWYxIiwicmVzdWx0cyIsInNlYXJjaFRleHRRdWVyeSIsInNlbGVjdGVkIiwic29ydCIsImdldE9iamVjdCIsIk5BTUVfRklFTERfS0VZIiwic2VhcmNoVGV4dCIsIiRyZWdleCIsInZhbHVlcyIsIiRvciIsIiRpbiIsImV4dGVuZCIsIiRuaW4iLCJkYiIsImZpbHRlclF1ZXJ5IiwibGltaXQiLCJpc09iamVjdCIsImZpbmQiLCJmZXRjaCIsInJlZjIiLCJpc0VtcHR5IiwiZ2V0QXBwT2JqZWN0cyIsImdldE9iamVjdHNMaXN0Vmlld3MiLCJnZXRPYmplY3RzUGVybWlzc2lvbk9iamVjdHMiLCJnZXRPYmplY3RzUGVybWlzc2lvblNldCIsImdldE9iamVjdHNSZXBvcnRzIiwiYXBwT2JqZWN0cyIsIm9iamVjdHNfbmFtZSIsIm9iamVjdHNMaXN0Vmlld3MiLCJzaGFyZWQiLCJvYmplY3RzUmVwb3J0cyIsIm9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cyIsIm9iamVjdHNQZXJtaXNzaW9uU2V0IiwiX29iamVjdHMiLCJfb2JqZWN0c19saXN0X3ZpZXdzIiwiX29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzIiwiX29iamVjdHNfcGVybWlzc2lvbl9zZXQiLCJfb2JqZWN0c19yZXBvcnRzIiwiYXBwSWQiLCJjb25jYXQiLCJ1bmlxIiwiaWdub3JlX2ZpZWxkcyIsImNyZWF0ZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWQiLCJtb2RpZmllZF9ieSIsImlzX2RlbGV0ZWQiLCJpbnN0YW5jZXMiLCJzaGFyaW5nIiwiZXhwb3J0T2JqZWN0IiwiX29iaiIsInYiLCJrZXkiLCJfdHJpZ2dlciIsImlzRnVuY3Rpb24iLCJ0b1N0cmluZyIsIl90b2RvIiwiX2FjdGlvbiIsIl9maWVsZCIsIl9mbyIsIl9vMSIsInJlZ0V4IiwiX3JlZ0V4IiwiX29wdGlvbnNGdW5jdGlvbiIsIl9yZWZlcmVuY2VfdG8iLCJjcmVhdGVGdW5jdGlvbiIsIl9jcmVhdGVGdW5jdGlvbiIsImRlZmF1bHRWYWx1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K0IsQ0FBdEU7QUFDQzZJLGdCQUFZbk4sY0FBWixHQUE2QjFCLFFBQVEyRSxhQUFSLENBQXNCLGdCQUF0QixFQUF3QzhHLElBQXhDLENBQTZDO0FBQUM1RyxXQUFLO0FBQUNxRyxhQUFLakgsT0FBT3ZDO0FBQWI7QUFBTixLQUE3QyxFQUFrRjtBQUFDbkIsY0FBUTBNO0FBQVQsS0FBbEYsRUFBMkd2QixLQUEzRyxFQUE3QjtBQytCQzs7QUQ3QkYsTUFBRzVLLEVBQUVpRixPQUFGLENBQVU5QixPQUFPdEMsa0JBQWpCLEtBQXdDc0MsT0FBT3RDLGtCQUFQLENBQTBCcUUsTUFBMUIsR0FBbUMsQ0FBOUU7QUFDQzZJLGdCQUFZbE4sa0JBQVosR0FBaUMzQixRQUFRMkUsYUFBUixDQUFzQixvQkFBdEIsRUFBNEM4RyxJQUE1QyxDQUFpRDtBQUFDNUcsV0FBSztBQUFDcUcsYUFBS2pILE9BQU90QztBQUFiO0FBQU4sS0FBakQsRUFBMEY7QUFBQ3BCLGNBQVEwTTtBQUFULEtBQTFGLEVBQW1IdkIsS0FBbkgsRUFBakM7QUNxQ0M7O0FEbkNGLE1BQUc1SyxFQUFFaUYsT0FBRixDQUFVOUIsT0FBT3JDLE9BQWpCLEtBQTZCcUMsT0FBT3JDLE9BQVAsQ0FBZW9FLE1BQWYsR0FBd0IsQ0FBeEQ7QUFDQzZJLGdCQUFZak4sT0FBWixHQUFzQjVCLFFBQVEyRSxhQUFSLENBQXNCLFNBQXRCLEVBQWlDOEcsSUFBakMsQ0FBc0M7QUFBQzVHLFdBQUs7QUFBQ3FHLGFBQUtqSCxPQUFPckM7QUFBYjtBQUFOLEtBQXRDLEVBQW9FO0FBQUNyQixjQUFRME07QUFBVCxLQUFwRSxFQUE2RnZCLEtBQTdGLEVBQXRCO0FDMkNDOztBRHpDRixTQUFPbUQsV0FBUDtBQW5Db0IsQ0FBckIsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19hcHBsaWNhdGlvbi1wYWNrYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiQ3JlYXRvci5PYmplY3RzLmFwcGxpY2F0aW9uX3BhY2thZ2UgPVxyXG5cdG5hbWU6IFwiYXBwbGljYXRpb25fcGFja2FnZVwiXHJcblx0aWNvbjogXCJmb2xkZXJcIlxyXG5cdGxhYmVsOiBcIui9r+S7tuWMhVwiXHJcblx0aGlkZGVuOiB0cnVlXHJcblx0ZmllbGRzOlxyXG5cdFx0bmFtZTpcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHRcdFx0bGFiZWw6IFwi5ZCN56ewXCJcclxuXHRcdGFwcHM6XHJcblx0XHRcdHR5cGU6IFwibG9va3VwXCJcclxuXHRcdFx0bGFiZWw6IFwi5bqU55SoXCJcclxuXHRcdFx0dHlwZTogXCJsb29rdXBcIlxyXG5cdFx0XHRyZWZlcmVuY2VfdG86IFwiYXBwc1wiXHJcblx0XHRcdG11bHRpcGxlOiB0cnVlXHJcblx0XHRcdG9wdGlvbnNGdW5jdGlvbjogKCktPlxyXG5cdFx0XHRcdF9vcHRpb25zID0gW11cclxuXHRcdFx0XHRfLmZvckVhY2ggQ3JlYXRvci5BcHBzLCAobywgayktPlxyXG5cdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IG8ubmFtZSwgdmFsdWU6IGssIGljb246IG8uaWNvbl9zbGRzfVxyXG5cdFx0XHRcdHJldHVybiBfb3B0aW9uc1xyXG5cdFx0b2JqZWN0czpcclxuXHRcdFx0dHlwZTogXCJsb29rdXBcIlxyXG5cdFx0XHRsYWJlbDogXCLlr7nosaFcIlxyXG5cdFx0XHRyZWZlcmVuY2VfdG86IFwib2JqZWN0c1wiXHJcblx0XHRcdG11bHRpcGxlOiB0cnVlXHJcblx0XHRcdG9wdGlvbnNGdW5jdGlvbjogKCktPlxyXG5cdFx0XHRcdF9vcHRpb25zID0gW11cclxuXHRcdFx0XHRfLmZvckVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAobywgayktPlxyXG5cdFx0XHRcdFx0aWYgIW8uaGlkZGVuXHJcblx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2ggeyBsYWJlbDogby5sYWJlbCwgdmFsdWU6IGssIGljb246IG8uaWNvbiB9XHJcblx0XHRcdFx0cmV0dXJuIF9vcHRpb25zXHJcblxyXG5cdFx0bGlzdF92aWV3czpcclxuXHRcdFx0dHlwZTogXCJsb29rdXBcIlxyXG5cdFx0XHRsYWJlbDogXCLliJfooajop4blm75cIlxyXG5cdFx0XHRtdWx0aXBsZTogdHJ1ZVxyXG5cdFx0XHRyZWZlcmVuY2VfdG86IFwib2JqZWN0X2xpc3R2aWV3c1wiXHJcblx0XHRcdG9wdGlvbnNNZXRob2Q6IFwiY3JlYXRvci5saXN0dmlld3Nfb3B0aW9uc1wiXHJcblx0XHRwZXJtaXNzaW9uX3NldDpcclxuXHRcdFx0dHlwZTogXCJsb29rdXBcIlxyXG5cdFx0XHRsYWJlbDogXCLmnYPpmZDpm4ZcIlxyXG5cdFx0XHRtdWx0aXBsZTogdHJ1ZVxyXG5cdFx0XHRyZWZlcmVuY2VfdG86IFwicGVybWlzc2lvbl9zZXRcIlxyXG5cdFx0cGVybWlzc2lvbl9vYmplY3RzOlxyXG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXHJcblx0XHRcdGxhYmVsOiBcIuadg+mZkOmbhlwiXHJcblx0XHRcdG11bHRpcGxlOiB0cnVlXHJcblx0XHRcdHJlZmVyZW5jZV90bzogXCJwZXJtaXNzaW9uX29iamVjdHNcIlxyXG5cdFx0cmVwb3J0czpcclxuXHRcdFx0dHlwZTogXCJsb29rdXBcIlxyXG5cdFx0XHRsYWJlbDogXCLmiqXooahcIlxyXG5cdFx0XHRtdWx0aXBsZTogdHJ1ZVxyXG5cdFx0XHRyZWZlcmVuY2VfdG86IFwicmVwb3J0c1wiXHJcblx0bGlzdF92aWV3czpcclxuXHRcdGFsbDpcclxuXHRcdFx0bGFiZWw6IFwi5omA5pyJXCJcclxuXHRcdFx0Y29sdW1uczogW1wibmFtZVwiXVxyXG5cdFx0XHRmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxyXG5cdGFjdGlvbnM6XHJcblx0XHRpbml0X2RhdGE6XHJcblx0XHRcdGxhYmVsOiBcIuWIneWni+WMllwiXHJcblx0XHRcdHZpc2libGU6IHRydWVcclxuXHRcdFx0b246IFwicmVjb3JkXCJcclxuXHRcdFx0dG9kbzogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcylcclxuXHRcdFx0XHRNZXRlb3IuY2FsbCBcImFwcFBhY2thZ2UuaW5pdF9leHBvcnRfZGF0YVwiLCBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksIHJlY29yZF9pZCwoZXJyb3IsIHJlc3VsdCktPlxyXG5cdFx0XHRcdFx0aWYgZXJyb3JcclxuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKGVycm9yLnJlYXNvbilcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoXCLliJ3lp4vljJblrozmiJBcIilcclxuXHRcdGV4cG9ydDpcclxuXHRcdFx0bGFiZWw6IFwi5a+85Ye6XCJcclxuXHRcdFx0dmlzaWJsZTogdHJ1ZVxyXG5cdFx0XHRvbjogXCJyZWNvcmRcIlxyXG5cdFx0XHR0b2RvOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCLlr7zlh7oje29iamVjdF9uYW1lfS0+I3tyZWNvcmRfaWR9XCIpXHJcblx0XHRcdFx0dXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCBcIi9hcGkvY3JlYXRvci9hcHBfcGFja2FnZS9leHBvcnQvI3tTZXNzaW9uLmdldChcInNwYWNlSWRcIil9LyN7cmVjb3JkX2lkfVwiXHJcblx0XHRcdFx0d2luZG93Lm9wZW4odXJsKVxyXG4jXHRcdFx0XHQkLmFqYXhcclxuI1x0XHRcdFx0XHR0eXBlOiBcInBvc3RcIlxyXG4jXHRcdFx0XHRcdHVybDogdXJsXHJcbiNcdFx0XHRcdFx0ZGF0YVR5cGU6IFwianNvblwiXHJcbiNcdFx0XHRcdFx0YmVmb3JlU2VuZDogKHJlcXVlc3QpIC0+XHJcbiNcdFx0XHRcdFx0XHRyZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ1gtVXNlci1JZCcsIE1ldGVvci51c2VySWQoKSlcclxuI1x0XHRcdFx0XHRcdHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignWC1BdXRoLVRva2VuJywgQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKSlcclxuI1x0XHRcdFx0XHRlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgLT5cclxuI1x0XHRcdFx0XHRcdGVycm9yID0ganFYSFIucmVzcG9uc2VKU09OXHJcbiNcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIGVycm9yXHJcbiNcdFx0XHRcdFx0XHRpZiBlcnJvcj8ucmVhc29uXHJcbiNcdFx0XHRcdFx0XHRcdHRvYXN0cj8uZXJyb3I/KFRBUGkxOG4uX18oZXJyb3IucmVhc29uKSlcclxuI1x0XHRcdFx0XHRcdGVsc2UgaWYgZXJyb3I/Lm1lc3NhZ2VcclxuI1x0XHRcdFx0XHRcdFx0dG9hc3RyPy5lcnJvcj8oVEFQaTE4bi5fXyhlcnJvci5tZXNzYWdlKSlcclxuI1x0XHRcdFx0XHRcdGVsc2VcclxuI1x0XHRcdFx0XHRcdFx0dG9hc3RyPy5lcnJvcj8oZXJyb3IpXHJcbiNcdFx0XHRcdFx0c3VjY2VzczogKHJlc3VsdCkgLT5cclxuI1x0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwicmVzdWx0Li4uLi4uLi4uLi4uLi4uLi4uLiN7cmVzdWx0fVwiKVxyXG5cclxuXHRcdGltcG9ydDpcclxuXHRcdFx0bGFiZWw6IFwi5a+85YWlXCJcclxuXHRcdFx0dmlzaWJsZTogdHJ1ZVxyXG5cdFx0XHRvbjogXCJsaXN0XCJcclxuXHRcdFx0dG9kbzogKG9iamVjdF9uYW1lKS0+XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJvYmplY3RfbmFtZVwiLCBvYmplY3RfbmFtZSlcclxuXHRcdFx0XHRNb2RhbC5zaG93KFwiQVBQYWNrYWdlSW1wb3J0TW9kYWxcIilcclxuIiwiQ3JlYXRvci5PYmplY3RzLmFwcGxpY2F0aW9uX3BhY2thZ2UgPSB7XG4gIG5hbWU6IFwiYXBwbGljYXRpb25fcGFja2FnZVwiLFxuICBpY29uOiBcImZvbGRlclwiLFxuICBsYWJlbDogXCLova/ku7bljIVcIixcbiAgaGlkZGVuOiB0cnVlLFxuICBmaWVsZHM6IHtcbiAgICBuYW1lOiB7XG4gICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgIGxhYmVsOiBcIuWQjeensFwiXG4gICAgfSxcbiAgICBhcHBzOiB7XG4gICAgICB0eXBlOiBcImxvb2t1cFwiLFxuICAgICAgbGFiZWw6IFwi5bqU55SoXCIsXG4gICAgICB0eXBlOiBcImxvb2t1cFwiLFxuICAgICAgcmVmZXJlbmNlX3RvOiBcImFwcHNcIixcbiAgICAgIG11bHRpcGxlOiB0cnVlLFxuICAgICAgb3B0aW9uc0Z1bmN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9vcHRpb25zO1xuICAgICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goQ3JlYXRvci5BcHBzLCBmdW5jdGlvbihvLCBrKSB7XG4gICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgbGFiZWw6IG8ubmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgICAgaWNvbjogby5pY29uX3NsZHNcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucztcbiAgICAgIH1cbiAgICB9LFxuICAgIG9iamVjdHM6IHtcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICBsYWJlbDogXCLlr7nosaFcIixcbiAgICAgIHJlZmVyZW5jZV90bzogXCJvYmplY3RzXCIsXG4gICAgICBtdWx0aXBsZTogdHJ1ZSxcbiAgICAgIG9wdGlvbnNGdW5jdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfb3B0aW9ucztcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgZnVuY3Rpb24obywgaykge1xuICAgICAgICAgIGlmICghby5oaWRkZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgbGFiZWw6IG8ubGFiZWwsXG4gICAgICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgICAgICBpY29uOiBvLmljb25cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucztcbiAgICAgIH1cbiAgICB9LFxuICAgIGxpc3Rfdmlld3M6IHtcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICBsYWJlbDogXCLliJfooajop4blm75cIixcbiAgICAgIG11bHRpcGxlOiB0cnVlLFxuICAgICAgcmVmZXJlbmNlX3RvOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgIG9wdGlvbnNNZXRob2Q6IFwiY3JlYXRvci5saXN0dmlld3Nfb3B0aW9uc1wiXG4gICAgfSxcbiAgICBwZXJtaXNzaW9uX3NldDoge1xuICAgICAgdHlwZTogXCJsb29rdXBcIixcbiAgICAgIGxhYmVsOiBcIuadg+mZkOmbhlwiLFxuICAgICAgbXVsdGlwbGU6IHRydWUsXG4gICAgICByZWZlcmVuY2VfdG86IFwicGVybWlzc2lvbl9zZXRcIlxuICAgIH0sXG4gICAgcGVybWlzc2lvbl9vYmplY3RzOiB7XG4gICAgICB0eXBlOiBcImxvb2t1cFwiLFxuICAgICAgbGFiZWw6IFwi5p2D6ZmQ6ZuGXCIsXG4gICAgICBtdWx0aXBsZTogdHJ1ZSxcbiAgICAgIHJlZmVyZW5jZV90bzogXCJwZXJtaXNzaW9uX29iamVjdHNcIlxuICAgIH0sXG4gICAgcmVwb3J0czoge1xuICAgICAgdHlwZTogXCJsb29rdXBcIixcbiAgICAgIGxhYmVsOiBcIuaKpeihqFwiLFxuICAgICAgbXVsdGlwbGU6IHRydWUsXG4gICAgICByZWZlcmVuY2VfdG86IFwicmVwb3J0c1wiXG4gICAgfVxuICB9LFxuICBsaXN0X3ZpZXdzOiB7XG4gICAgYWxsOiB7XG4gICAgICBsYWJlbDogXCLmiYDmnIlcIixcbiAgICAgIGNvbHVtbnM6IFtcIm5hbWVcIl0sXG4gICAgICBmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxuICAgIH1cbiAgfSxcbiAgYWN0aW9uczoge1xuICAgIGluaXRfZGF0YToge1xuICAgICAgbGFiZWw6IFwi5Yid5aeL5YyWXCIsXG4gICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgb246IFwicmVjb3JkXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpIHtcbiAgICAgICAgY29uc29sZS5sb2cob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKTtcbiAgICAgICAgcmV0dXJuIE1ldGVvci5jYWxsKFwiYXBwUGFja2FnZS5pbml0X2V4cG9ydF9kYXRhXCIsIFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSwgcmVjb3JkX2lkLCBmdW5jdGlvbihlcnJvciwgcmVzdWx0KSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gdG9hc3RyLmVycm9yKGVycm9yLnJlYXNvbik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0b2FzdHIuc3VjY2VzcyhcIuWIneWni+WMluWujOaIkFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJleHBvcnRcIjoge1xuICAgICAgbGFiZWw6IFwi5a+85Ye6XCIsXG4gICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgb246IFwicmVjb3JkXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpIHtcbiAgICAgICAgdmFyIHVybDtcbiAgICAgICAgY29uc29sZS5sb2coXCLlr7zlh7pcIiArIG9iamVjdF9uYW1lICsgXCItPlwiICsgcmVjb3JkX2lkKTtcbiAgICAgICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcGkvY3JlYXRvci9hcHBfcGFja2FnZS9leHBvcnQvXCIgKyAoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSArIFwiL1wiICsgcmVjb3JkX2lkKTtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5vcGVuKHVybCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcImltcG9ydFwiOiB7XG4gICAgICBsYWJlbDogXCLlr7zlhaVcIixcbiAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICBvbjogXCJsaXN0XCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIm9iamVjdF9uYW1lXCIsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgcmV0dXJuIE1vZGFsLnNob3coXCJBUFBhY2thZ2VJbXBvcnRNb2RhbFwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iLCJKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvY3JlYXRvci9hcHBfcGFja2FnZS9leHBvcnQvOnNwYWNlX2lkLzpyZWNvcmRfaWQnLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0dHJ5XHJcblxyXG5cdFx0dXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcclxuXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0XHRjb2RlOiA0MDFcclxuXHRcdFx0XHRkYXRhOiB7ZXJyb3JzOiBcIkF1dGhlbnRpY2F0aW9uIGlzIHJlcXVpcmVkIGFuZCBoYXMgbm90IGJlZW4gcHJvdmlkZWQuXCJ9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0cmVjb3JkX2lkID0gcmVxLnBhcmFtcy5yZWNvcmRfaWRcclxuXHRcdHNwYWNlX2lkID0gcmVxLnBhcmFtcy5zcGFjZV9pZFxyXG5cclxuXHRcdGlmICFDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgdXNlcklkKVxyXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdFx0Y29kZTogNDAxXHJcblx0XHRcdFx0ZGF0YToge2Vycm9yczogXCJQZXJtaXNzaW9uIGRlbmllZFwifVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImFwcGxpY2F0aW9uX3BhY2thZ2VcIikuZmluZE9uZSh7X2lkOiByZWNvcmRfaWR9KVxyXG5cclxuXHRcdGlmICFyZWNvcmRcclxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRcdGNvZGU6IDQwNFxyXG5cdFx0XHRcdGRhdGE6IHtlcnJvcnM6IFwiQ29sbGVjdGlvbiBub3QgZm91bmQgZm9yIHRoZSBzZWdtZW50ICN7cmVjb3JkX2lkfVwifVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdHNwYWNlX3VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHt1c2VyOiB1c2VySWQsIHNwYWNlOiByZWNvcmQuc3BhY2V9KVxyXG5cclxuXHRcdGlmICFzcGFjZV91c2VyXHJcblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0XHRjb2RlOiA0MDFcclxuXHRcdFx0XHRkYXRhOiB7ZXJyb3JzOiBcIlVzZXIgZG9lcyBub3QgaGF2ZSBwcml2aWxlZ2VzIHRvIGFjY2VzcyB0aGUgZW50aXR5XCJ9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0ZGF0YSA9IEFQVHJhbnNmb3JtLmV4cG9ydCByZWNvcmRcclxuXHJcblx0XHRkYXRhLmRhdGFTb3VyY2UgPSBNZXRlb3IuYWJzb2x1dGVVcmwoXCJhcGkvY3JlYXRvci9hcHBfcGFja2FnZS9leHBvcnQvI3tzcGFjZV9pZH0vI3tyZWNvcmRfaWR9XCIpXHJcblxyXG5cdFx0ZmlsZU5hbWUgPSByZWNvcmQubmFtZSB8fCBcImFwcGxpY2F0aW9uX3BhY2thZ2VcIlxyXG5cclxuXHRcdHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LW1zZG93bmxvYWQnKTtcclxuXHRcdHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnYXR0YWNobWVudDtmaWxlbmFtZT0nK2VuY29kZVVSSShmaWxlTmFtZSkrJy5qc29uJyk7XHJcblx0XHRyZXMuZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsIDQpKVxyXG5cdGNhdGNoIGVcclxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0ZGF0YTogeyBlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XHJcblx0XHR9XHJcblxyXG4iLCJKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvY3JlYXRvci9hcHBfcGFja2FnZS9leHBvcnQvOnNwYWNlX2lkLzpyZWNvcmRfaWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgZGF0YSwgZSwgZmlsZU5hbWUsIHJlY29yZCwgcmVjb3JkX2lkLCBzcGFjZV9pZCwgc3BhY2VfdXNlciwgdXNlcklkO1xuICB0cnkge1xuICAgIHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcyk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXJyb3JzOiBcIkF1dGhlbnRpY2F0aW9uIGlzIHJlcXVpcmVkIGFuZCBoYXMgbm90IGJlZW4gcHJvdmlkZWQuXCJcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlY29yZF9pZCA9IHJlcS5wYXJhbXMucmVjb3JkX2lkO1xuICAgIHNwYWNlX2lkID0gcmVxLnBhcmFtcy5zcGFjZV9pZDtcbiAgICBpZiAoIUNyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCB1c2VySWQpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGVycm9yczogXCJQZXJtaXNzaW9uIGRlbmllZFwiXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBsaWNhdGlvbl9wYWNrYWdlXCIpLmZpbmRPbmUoe1xuICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICB9KTtcbiAgICBpZiAoIXJlY29yZCkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDQsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBlcnJvcnM6IFwiQ29sbGVjdGlvbiBub3QgZm91bmQgZm9yIHRoZSBzZWdtZW50IFwiICsgcmVjb3JkX2lkXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzcGFjZV91c2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogcmVjb3JkLnNwYWNlXG4gICAgfSk7XG4gICAgaWYgKCFzcGFjZV91c2VyKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGVycm9yczogXCJVc2VyIGRvZXMgbm90IGhhdmUgcHJpdmlsZWdlcyB0byBhY2Nlc3MgdGhlIGVudGl0eVwiXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkYXRhID0gQVBUcmFuc2Zvcm1bXCJleHBvcnRcIl0ocmVjb3JkKTtcbiAgICBkYXRhLmRhdGFTb3VyY2UgPSBNZXRlb3IuYWJzb2x1dGVVcmwoXCJhcGkvY3JlYXRvci9hcHBfcGFja2FnZS9leHBvcnQvXCIgKyBzcGFjZV9pZCArIFwiL1wiICsgcmVjb3JkX2lkKTtcbiAgICBmaWxlTmFtZSA9IHJlY29yZC5uYW1lIHx8IFwiYXBwbGljYXRpb25fcGFja2FnZVwiO1xuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LW1zZG93bmxvYWQnKTtcbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2F0dGFjaG1lbnQ7ZmlsZW5hbWU9JyArIGVuY29kZVVSSShmaWxlTmFtZSkgKyAnLmpzb24nKTtcbiAgICByZXR1cm4gcmVzLmVuZChKU09OLnN0cmluZ2lmeShkYXRhLCBudWxsLCA0KSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJ0cmFuc2Zvcm1GaWx0ZXJzID0gKGZpbHRlcnMpLT5cclxuXHRfZmlsdGVycyA9IFtdXHJcblx0Xy5lYWNoIGZpbHRlcnMsIChmKS0+XHJcblx0XHRpZiBfLmlzQXJyYXkoZikgJiYgZi5sZW5ndGggPT0gM1xyXG5cdFx0XHRfZmlsdGVycy5wdXNoIHtmaWVsZDogZlswXSwgb3BlcmF0aW9uOiBmWzFdLCB2YWx1ZTogZlsyXX1cclxuXHRcdGVsc2VcclxuXHRcdFx0X2ZpbHRlcnMucHVzaCBmXHJcblx0cmV0dXJuIF9maWx0ZXJzXHJcblxyXG50cmFuc2Zvcm1GaWVsZE9wdGlvbnMgPSAob3B0aW9ucyktPlxyXG5cdGlmICFfLmlzQXJyYXkob3B0aW9ucylcclxuXHRcdHJldHVybiBvcHRpb25zXHJcblxyXG5cdF9vcHRpb25zID0gW11cclxuXHJcblx0Xy5lYWNoIG9wdGlvbnMsIChvKS0+XHJcblx0XHRpZiBvICYmIF8uaGFzKG8sICdsYWJlbCcpICYmIF8uaGFzKG8sICd2YWx1ZScpXHJcblx0XHRcdF9vcHRpb25zLnB1c2ggXCIje28ubGFiZWx9OiN7by52YWx1ZX1cIlxyXG5cclxuXHRyZXR1cm4gX29wdGlvbnMuam9pbignLCcpXHJcblxyXG5cclxuQ3JlYXRvci5pbXBvcnRPYmplY3QgPSAodXNlcklkLCBzcGFjZV9pZCwgb2JqZWN0LCBsaXN0X3ZpZXdzX2lkX21hcHMpIC0+XHJcblx0Y29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLWltcG9ydE9iamVjdC0tLS0tLS0tLS0tLS0tLS0tLScsIG9iamVjdC5uYW1lKVxyXG5cdGZpZWxkcyA9IG9iamVjdC5maWVsZHNcclxuXHR0cmlnZ2VycyA9IG9iamVjdC50cmlnZ2Vyc1xyXG5cdGFjdGlvbnMgPSBvYmplY3QuYWN0aW9uc1xyXG5cdG9ial9saXN0X3ZpZXdzID0gb2JqZWN0Lmxpc3Rfdmlld3NcclxuXHJcblx0ZGVsZXRlIG9iamVjdC5faWRcclxuXHRkZWxldGUgb2JqZWN0LmZpZWxkc1xyXG5cdGRlbGV0ZSBvYmplY3QudHJpZ2dlcnNcclxuXHRkZWxldGUgb2JqZWN0LmFjdGlvbnNcclxuXHRkZWxldGUgb2JqZWN0LnBlcm1pc3Npb25zICPliKDpmaRwZXJtaXNzaW9uc+WKqOaAgeWxnuaAp1xyXG5cdGRlbGV0ZSBvYmplY3QubGlzdF92aWV3c1xyXG5cclxuXHRvYmplY3Quc3BhY2UgPSBzcGFjZV9pZFxyXG5cdG9iamVjdC5vd25lciA9IHVzZXJJZFxyXG5cclxuXHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLmluc2VydChvYmplY3QpXHJcblxyXG5cdCMgMi4xIOaMgeS5heWMluWvueixoWxpc3Rfdmlld3NcclxuXHRpbnRlcm5hbF9saXN0X3ZpZXcgPSB7fVxyXG5cclxuXHRoYXNSZWNlbnRWaWV3ID0gZmFsc2VcclxuXHRjb25zb2xlLmxvZygn5oyB5LmF5YyW5a+56LGhbGlzdF92aWV3cycpO1xyXG5cdF8uZWFjaCBvYmpfbGlzdF92aWV3cywgKGxpc3RfdmlldyktPlxyXG5cdFx0b2xkX2lkID0gbGlzdF92aWV3Ll9pZFxyXG5cdFx0ZGVsZXRlIGxpc3Rfdmlldy5faWRcclxuXHRcdGxpc3Rfdmlldy5zcGFjZSA9IHNwYWNlX2lkXHJcblx0XHRsaXN0X3ZpZXcub3duZXIgPSB1c2VySWRcclxuXHRcdGxpc3Rfdmlldy5vYmplY3RfbmFtZSA9IG9iamVjdC5uYW1lXHJcblx0XHRpZiBDcmVhdG9yLmlzUmVjZW50VmlldyhsaXN0X3ZpZXcpXHJcblx0XHRcdGhhc1JlY2VudFZpZXcgPSB0cnVlXHJcblxyXG5cdFx0aWYgbGlzdF92aWV3LmZpbHRlcnNcclxuXHRcdFx0bGlzdF92aWV3LmZpbHRlcnMgPSB0cmFuc2Zvcm1GaWx0ZXJzKGxpc3Rfdmlldy5maWx0ZXJzKVxyXG5cclxuXHRcdGlmIENyZWF0b3IuaXNBbGxWaWV3KGxpc3RfdmlldykgfHwgQ3JlYXRvci5pc1JlY2VudFZpZXcobGlzdF92aWV3KVxyXG5cdCMg5Yib5bu6b2JqZWN05pe277yM5Lya6Ieq5Yqo5re75YqgYWxsIHZpZXfjgIFyZWNlbnQgdmlld1xyXG5cclxuXHRcdFx0b3B0aW9ucyA9IHskc2V0OiBsaXN0X3ZpZXd9XHJcblxyXG5cdFx0XHRpZiAhbGlzdF92aWV3LmNvbHVtbnNcclxuXHRcdFx0XHRvcHRpb25zLiR1bnNldCA9IHtjb2x1bW5zOiAnJ31cclxuXHJcblx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikudXBkYXRlKHtvYmplY3RfbmFtZTogb2JqZWN0Lm5hbWUsIG5hbWU6IGxpc3Rfdmlldy5uYW1lLCBzcGFjZTogc3BhY2VfaWR9LCBvcHRpb25zKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRuZXdfaWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmluc2VydChsaXN0X3ZpZXcpXHJcblx0XHRcdGxpc3Rfdmlld3NfaWRfbWFwc1tvYmplY3QubmFtZSArIFwiX1wiICsgb2xkX2lkXSA9IG5ld19pZFxyXG5cclxuXHRpZiAhaGFzUmVjZW50Vmlld1xyXG5cdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5yZW1vdmUoe25hbWU6IFwicmVjZW50XCIsIHNwYWNlOiBzcGFjZV9pZCwgb2JqZWN0X25hbWU6IG9iamVjdC5uYW1lLCBvd25lcjogdXNlcklkfSlcclxuXHRjb25zb2xlLmxvZygn5oyB5LmF5YyW5a+56LGh5a2X5q61Jyk7XHJcblx0IyAyLjIg5oyB5LmF5YyW5a+56LGh5a2X5q61XHJcblxyXG5cdF9maWVsZG5hbWVzID0gW11cclxuXHJcblx0Xy5lYWNoIGZpZWxkcywgKGZpZWxkLCBrKS0+XHJcblx0XHRkZWxldGUgZmllbGQuX2lkXHJcblx0XHRmaWVsZC5zcGFjZSA9IHNwYWNlX2lkXHJcblx0XHRmaWVsZC5vd25lciA9IHVzZXJJZFxyXG5cdFx0ZmllbGQub2JqZWN0ID0gb2JqZWN0Lm5hbWVcclxuXHJcblx0XHRpZiBmaWVsZC5vcHRpb25zXHJcblx0XHRcdGZpZWxkLm9wdGlvbnMgPSB0cmFuc2Zvcm1GaWVsZE9wdGlvbnMoZmllbGQub3B0aW9ucylcclxuXHJcblx0XHRpZiAhXy5oYXMoZmllbGQsIFwibmFtZVwiKVxyXG5cdFx0XHRmaWVsZC5uYW1lID0ga1xyXG5cclxuXHRcdF9maWVsZG5hbWVzLnB1c2ggZmllbGQubmFtZVxyXG5cclxuXHRcdGlmIGZpZWxkLm5hbWUgPT0gXCJuYW1lXCJcclxuXHRcdFx0IyDliJvlu7pvYmplY3Tml7bvvIzkvJroh6rliqjmt7vliqBuYW1l5a2X5q6177yM5Zug5q2k5Zyo5q2k5aSE5a+5bmFtZeWtl+autei/m+ihjOabtOaWsFxyXG5cdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfZmllbGRzXCIpLnVwZGF0ZSh7b2JqZWN0OiBvYmplY3QubmFtZSwgbmFtZTogXCJuYW1lXCIsIHNwYWNlOiBzcGFjZV9pZH0sIHskc2V0OiBmaWVsZH0pXHJcblx0XHRlbHNlXHJcblx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9maWVsZHNcIikuaW5zZXJ0KGZpZWxkKVxyXG5cclxuXHRcdGlmICFfLmNvbnRhaW5zKF9maWVsZG5hbWVzLCAnbmFtZScpXHJcblx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9maWVsZHNcIikuZGlyZWN0LnJlbW92ZSh7b2JqZWN0OiBvYmplY3QubmFtZSwgbmFtZTogXCJuYW1lXCIsIHNwYWNlOiBzcGFjZV9pZH0pXHJcblxyXG5cdGNvbnNvbGUubG9nKCfmjIHkuYXljJbop6blj5HlmagnKTtcclxuXHQjIDIuMyDmjIHkuYXljJbop6blj5HlmahcclxuXHRfLmVhY2ggdHJpZ2dlcnMsICh0cmlnZ2VyLCBrKS0+XHJcblx0XHRkZWxldGUgdHJpZ2dlcnMuX2lkXHJcblx0XHR0cmlnZ2VyLnNwYWNlID0gc3BhY2VfaWRcclxuXHRcdHRyaWdnZXIub3duZXIgPSB1c2VySWRcclxuXHRcdHRyaWdnZXIub2JqZWN0ID0gb2JqZWN0Lm5hbWVcclxuXHRcdGlmICFfLmhhcyh0cmlnZ2VyLCBcIm5hbWVcIilcclxuXHRcdFx0dHJpZ2dlci5uYW1lID0gay5yZXBsYWNlKG5ldyBSZWdFeHAoXCJcXFxcLlwiLCBcImdcIiksIFwiX1wiKVxyXG5cclxuXHRcdGlmICFfLmhhcyh0cmlnZ2VyLCBcImlzX2VuYWJsZVwiKVxyXG5cdFx0XHR0cmlnZ2VyLmlzX2VuYWJsZSA9IHRydWVcclxuXHJcblx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfdHJpZ2dlcnNcIikuaW5zZXJ0KHRyaWdnZXIpXHJcblx0Y29uc29sZS5sb2coJ+aMgeS5heWMluaTjeS9nCcpO1xyXG5cdCMgMi40IOaMgeS5heWMluaTjeS9nFxyXG5cdF8uZWFjaCBhY3Rpb25zLCAoYWN0aW9uLCBrKS0+XHJcblx0XHRkZWxldGUgYWN0aW9uLl9pZFxyXG5cdFx0YWN0aW9uLnNwYWNlID0gc3BhY2VfaWRcclxuXHRcdGFjdGlvbi5vd25lciA9IHVzZXJJZFxyXG5cdFx0YWN0aW9uLm9iamVjdCA9IG9iamVjdC5uYW1lXHJcblx0XHRpZiAhXy5oYXMoYWN0aW9uLCBcIm5hbWVcIilcclxuXHRcdFx0YWN0aW9uLm5hbWUgPSBrLnJlcGxhY2UobmV3IFJlZ0V4cChcIlxcXFwuXCIsIFwiZ1wiKSwgXCJfXCIpXHJcblx0XHRpZiAhXy5oYXMoYWN0aW9uLCBcImlzX2VuYWJsZVwiKVxyXG5cdFx0XHRhY3Rpb24uaXNfZW5hYmxlID0gdHJ1ZVxyXG5cdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2FjdGlvbnNcIikuaW5zZXJ0KGFjdGlvbilcclxuXHJcblx0Y29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLWltcG9ydE9iamVjdCBlbmQtLS0tLS0tLS0tLS0tLS0tLS0nLCBvYmplY3QubmFtZSlcclxuXHJcbkNyZWF0b3IuaW1wb3J0X2FwcF9wYWNrYWdlID0gKHVzZXJJZCwgc3BhY2VfaWQsIGltcF9kYXRhLCBmcm9tX3RlbXBsYXRlKS0+XHJcblx0aWYgIXVzZXJJZFxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjQwMVwiLCBcIkF1dGhlbnRpY2F0aW9uIGlzIHJlcXVpcmVkIGFuZCBoYXMgbm90IGJlZW4gcHJvdmlkZWQuXCIpXHJcblxyXG5cdGlmICFDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgdXNlcklkKVxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjQwMVwiLCBcIlBlcm1pc3Npb24gZGVuaWVkLlwiKVxyXG5cclxuXHQjIyPmlbDmja7moKHpqowg5byA5aeLIyMjXHJcblx0Y2hlY2soaW1wX2RhdGEsIE9iamVjdClcclxuXHRpZiAhZnJvbV90ZW1wbGF0ZVxyXG5cdFx0IyAxIGFwcHPmoKHpqozvvJrmoLnmja5faWTliKTmlq3lupTnlKjmmK/lkKblt7LlrZjlnKhcclxuXHRcdGltcF9hcHBfaWRzID0gXy5wbHVjayhpbXBfZGF0YS5hcHBzLCBcIl9pZFwiKVxyXG5cdFx0aWYgXy5pc0FycmF5KGltcF9kYXRhLmFwcHMpICYmIGltcF9kYXRhLmFwcHMubGVuZ3RoID4gMFxyXG5cdFx0XHRfLmVhY2ggaW1wX2RhdGEuYXBwcywgKGFwcCktPlxyXG5cdFx0XHRcdGlmIF8uaW5jbHVkZShfLmtleXMoQ3JlYXRvci5BcHBzKSwgYXBwLl9pZClcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLlupTnlKgnI3thcHAubmFtZX0n5bey5a2Y5ZyoXCIpXHJcblxyXG5cdFx0IyAyIG9iamVjdHPmoKHpqozvvJrmoLnmja5vYmplY3QubmFtZeWIpOaWreWvueixoeaYr+WQpuW3suWtmOWcqDsg5qCh6aqMdHJpZ2dlcnNcclxuXHRcdGlmIF8uaXNBcnJheShpbXBfZGF0YS5vYmplY3RzKSAmJiBpbXBfZGF0YS5vYmplY3RzLmxlbmd0aCA+IDBcclxuXHRcdFx0Xy5lYWNoIGltcF9kYXRhLm9iamVjdHMsIChvYmplY3QpLT5cclxuXHRcdFx0XHRpZiBfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuT2JqZWN0cyksIG9iamVjdC5uYW1lKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuWvueixoScje29iamVjdC5uYW1lfSflt7LlrZjlnKhcIilcclxuXHRcdFx0XHRfLmVhY2ggb2JqZWN0LnRyaWdnZXJzLCAodHJpZ2dlciktPlxyXG5cdFx0XHRcdFx0aWYgdHJpZ2dlci5vbiA9PSAnc2VydmVyJyAmJiAhU3RlZWRvcy5pc0xlZ2FsVmVyc2lvbihzcGFjZV9pZCxcIndvcmtmbG93LmVudGVycHJpc2VcIilcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5Y+q5pyJ5LyB5Lia54mI5pSv5oyB6YWN572u5pyN5Yqh56uv55qE6Kem5Y+R5ZmoXCJcclxuXHJcblx0XHRpbXBfb2JqZWN0X25hbWVzID0gXy5wbHVjayhpbXBfZGF0YS5vYmplY3RzLCBcIm5hbWVcIilcclxuXHRcdG9iamVjdF9uYW1lcyA9IF8ua2V5cyhDcmVhdG9yLk9iamVjdHMpXHJcblxyXG5cdFx0IyAzIOWIpOaWrWFwcHPnmoTlr7nosaHmmK/lkKbpg73lrZjlnKhcclxuXHRcdGlmIF8uaXNBcnJheShpbXBfZGF0YS5hcHBzKSAmJiBpbXBfZGF0YS5hcHBzLmxlbmd0aCA+IDBcclxuXHRcdFx0Xy5lYWNoIGltcF9kYXRhLmFwcHMsIChhcHApLT5cclxuXHRcdFx0XHRfLmVhY2ggYXBwLm9iamVjdHMsIChvYmplY3RfbmFtZSktPlxyXG5cdFx0XHRcdFx0aWYgIV8uaW5jbHVkZShvYmplY3RfbmFtZXMsIG9iamVjdF9uYW1lKSAmJiAhXy5pbmNsdWRlKGltcF9vYmplY3RfbmFtZXMsIG9iamVjdF9uYW1lKVxyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5bqU55SoJyN7YXBwLm5hbWV9J+S4reaMh+WumueahOWvueixoScje29iamVjdF9uYW1lfSfkuI3lrZjlnKhcIilcclxuXHJcblx0XHQjIDQgbGlzdF92aWV3c+agoemqjO+8muWIpOaWrWxpc3Rfdmlld3Plr7nlupTnmoRvYmplY3TmmK/lkKblrZjlnKhcclxuXHRcdGlmIF8uaXNBcnJheShpbXBfZGF0YS5saXN0X3ZpZXdzKSAmJiBpbXBfZGF0YS5saXN0X3ZpZXdzLmxlbmd0aCA+IDBcclxuXHRcdFx0Xy5lYWNoIGltcF9kYXRhLmxpc3Rfdmlld3MsIChsaXN0X3ZpZXcpLT5cclxuXHRcdFx0XHRpZiAhbGlzdF92aWV3Lm9iamVjdF9uYW1lIHx8ICFfLmlzU3RyaW5nKGxpc3Rfdmlldy5vYmplY3RfbmFtZSlcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLliJfooajop4blm74nI3tsaXN0X3ZpZXcubmFtZX0n55qEb2JqZWN0X25hbWXlsZ7mgKfml6DmlYhcIilcclxuXHRcdFx0XHRpZiAhXy5pbmNsdWRlKG9iamVjdF9uYW1lcywgbGlzdF92aWV3Lm9iamVjdF9uYW1lKSAmJiAhXy5pbmNsdWRlKGltcF9vYmplY3RfbmFtZXMsIGxpc3Rfdmlldy5vYmplY3RfbmFtZSlcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLliJfooajop4blm74nI3tsaXN0X3ZpZXcubmFtZX0n5Lit5oyH5a6a55qE5a+56LGhJyN7bGlzdF92aWV3Lm9iamVjdF9uYW1lfSfkuI3lrZjlnKhcIilcclxuXHJcblx0XHQjIDUgcGVybWlzc2lvbl9zZXTmoKHpqozvvJrliKTmlq3mnYPpmZDpm4bkuK3nmoTmjojmnYPlupTnlKhhc3NpZ25lZF9hcHBzOyDmnYPpmZDpm4bnmoTlkI3np7DkuI3lhYHorrjph43lpI1cclxuXHRcdHBlcm1pc3Npb25fc2V0X2lkcyA9IF8ucGx1Y2soaW1wX2RhdGEucGVybWlzc2lvbl9zZXQsIFwiX2lkXCIpXHJcblx0XHRpZiBfLmlzQXJyYXkoaW1wX2RhdGEucGVybWlzc2lvbl9zZXQpICYmIGltcF9kYXRhLnBlcm1pc3Npb25fc2V0Lmxlbmd0aCA+IDBcclxuXHRcdFx0Xy5lYWNoIGltcF9kYXRhLnBlcm1pc3Npb25fc2V0LCAocGVybWlzc2lvbl9zZXQpLT5cclxuXHRcdFx0XHRpZiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIG5hbWU6IHBlcm1pc3Npb25fc2V0Lm5hbWV9LHtmaWVsZHM6e19pZDoxfX0pXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCLmnYPpmZDpm4blkI3np7AnI3twZXJtaXNzaW9uX3NldC5uYW1lfSfkuI3og73ph43lpI1cIlxyXG5cdFx0XHRcdF8uZWFjaCBwZXJtaXNzaW9uX3NldC5hc3NpZ25lZF9hcHBzLCAoYXBwX2lkKS0+XHJcblx0XHRcdFx0XHRpZiAhXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLkFwcHMpLCBhcHBfaWQpICYmICFfLmluY2x1ZGUoaW1wX2FwcF9pZHMsIGFwcF9pZClcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuadg+mZkOmbhicje3Blcm1pc3Npb25fc2V0Lm5hbWV9J+eahOaOiOadg+W6lOeUqCcje2FwcF9pZH0n5LiN5a2Y5ZyoXCIpXHJcblxyXG5cdFx0IyA2IHBlcm1pc3Npb25fb2JqZWN0c+agoemqjO+8muWIpOaWreadg+mZkOmbhuS4reaMh+WumueahG9iamVjdOaYr+WQpuWtmOWcqO+8m+WIpOaWreadg+mZkOmbhuagh+ivhuaYr+aYr+WQpuacieaViFxyXG5cdFx0aWYgXy5pc0FycmF5KGltcF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cykgJiYgaW1wX2RhdGEucGVybWlzc2lvbl9vYmplY3RzLmxlbmd0aCA+IDBcclxuXHRcdFx0Xy5lYWNoIGltcF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cywgKHBlcm1pc3Npb25fb2JqZWN0KS0+XHJcblx0XHRcdFx0aWYgIXBlcm1pc3Npb25fb2JqZWN0Lm9iamVjdF9uYW1lIHx8ICFfLmlzU3RyaW5nKHBlcm1pc3Npb25fb2JqZWN0Lm9iamVjdF9uYW1lKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuadg+mZkOmbhicje3Blcm1pc3Npb25fb2JqZWN0Lm5hbWV9J+eahG9iamVjdF9uYW1l5bGe5oCn5peg5pWIXCIpXHJcblx0XHRcdFx0aWYgIV8uaW5jbHVkZShvYmplY3RfbmFtZXMsIHBlcm1pc3Npb25fb2JqZWN0Lm9iamVjdF9uYW1lKSAmJiAhXy5pbmNsdWRlKGltcF9vYmplY3RfbmFtZXMsIHBlcm1pc3Npb25fb2JqZWN0Lm9iamVjdF9uYW1lKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuadg+mZkOmbhicje2xpc3Rfdmlldy5uYW1lfSfkuK3mjIflrprnmoTlr7nosaEnI3twZXJtaXNzaW9uX29iamVjdC5vYmplY3RfbmFtZX0n5LiN5a2Y5ZyoXCIpXHJcblxyXG5cdFx0XHRcdGlmICFfLmhhcyhwZXJtaXNzaW9uX29iamVjdCwgXCJwZXJtaXNzaW9uX3NldF9pZFwiKSB8fCAhXy5pc1N0cmluZyhwZXJtaXNzaW9uX29iamVjdC5wZXJtaXNzaW9uX3NldF9pZClcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLmnYPpmZDpm4YnI3twZXJtaXNzaW9uX29iamVjdC5uYW1lfSfnmoRwZXJtaXNzaW9uX3NldF9pZOWxnuaAp+aXoOaViFwiKVxyXG5cdFx0XHRcdGVsc2UgaWYgIV8uaW5jbHVkZShwZXJtaXNzaW9uX3NldF9pZHMsIHBlcm1pc3Npb25fb2JqZWN0LnBlcm1pc3Npb25fc2V0X2lkKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuadg+mZkOmbhicje3Blcm1pc3Npb25fb2JqZWN0Lm5hbWV9J+aMh+WumueahOadg+mZkOmbhicje3Blcm1pc3Npb25fb2JqZWN0LnBlcm1pc3Npb25fc2V0X2lkfSflgLzkuI3lnKjlr7zlhaXnmoRwZXJtaXNzaW9uX3NldOS4rVwiKVxyXG5cclxuXHRcdCMgNyByZXBvcnRz5qCh6aqM77ya5Yik5pat5oql6KGo5Lit5oyH5a6a55qEb2JqZWN05piv5ZCm5a2Y5ZyoXHJcblx0XHRpZiBfLmlzQXJyYXkoaW1wX2RhdGEucmVwb3J0cykgJiYgaW1wX2RhdGEucmVwb3J0cy5sZW5ndGggPiAwXHJcblx0XHRcdF8uZWFjaCBpbXBfZGF0YS5yZXBvcnRzLCAocmVwb3J0KS0+XHJcblx0XHRcdFx0aWYgIXJlcG9ydC5vYmplY3RfbmFtZSB8fCAhXy5pc1N0cmluZyhyZXBvcnQub2JqZWN0X25hbWUpXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5oql6KGoJyN7cmVwb3J0Lm5hbWV9J+eahG9iamVjdF9uYW1l5bGe5oCn5peg5pWIXCIpXHJcblx0XHRcdFx0aWYgIV8uaW5jbHVkZShvYmplY3RfbmFtZXMsIHJlcG9ydC5vYmplY3RfbmFtZSkgJiYgIV8uaW5jbHVkZShpbXBfb2JqZWN0X25hbWVzLCByZXBvcnQub2JqZWN0X25hbWUpXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5oql6KGoJyN7cmVwb3J0Lm5hbWV9J+S4reaMh+WumueahOWvueixoScje3JlcG9ydC5vYmplY3RfbmFtZX0n5LiN5a2Y5ZyoXCIpXHJcblxyXG5cdCMjI+aVsOaNruagoemqjCDnu5PmnZ8jIyNcclxuXHJcblx0IyMj5pWw5o2u5oyB5LmF5YyWIOW8gOWniyMjI1xyXG5cclxuXHQjIOWumuS5ieaWsOaXp+aVsOaNruWvueW6lOWFs+ezu+mbhuWQiFxyXG5cdGFwcHNfaWRfbWFwcyA9IHt9XHJcblx0bGlzdF92aWV3c19pZF9tYXBzID0ge31cclxuXHRwZXJtaXNzaW9uX3NldF9pZF9tYXBzID0ge31cclxuXHJcblx0IyAxIOaMgeS5heWMlkFwcHNcclxuXHRpZiBfLmlzQXJyYXkoaW1wX2RhdGEuYXBwcykgJiYgaW1wX2RhdGEuYXBwcy5sZW5ndGggPiAwXHJcblx0XHRfLmVhY2ggaW1wX2RhdGEuYXBwcywgKGFwcCktPlxyXG5cdFx0XHRvbGRfaWQgPSBhcHAuX2lkXHJcblx0XHRcdGRlbGV0ZSBhcHAuX2lkXHJcblx0XHRcdGFwcC5zcGFjZSA9IHNwYWNlX2lkXHJcblx0XHRcdGFwcC5vd25lciA9IHVzZXJJZFxyXG5cdFx0XHRhcHAuaXNfY3JlYXRvciA9IHRydWVcclxuXHRcdFx0bmV3X2lkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwc1wiKS5pbnNlcnQoYXBwKVxyXG5cdFx0XHRhcHBzX2lkX21hcHNbb2xkX2lkXSA9IG5ld19pZFxyXG5cclxuXHQjIDIg5oyB5LmF5YyWb2JqZWN0c1xyXG5cdGlmIF8uaXNBcnJheShpbXBfZGF0YS5vYmplY3RzKSAmJiBpbXBfZGF0YS5vYmplY3RzLmxlbmd0aCA+IDBcclxuXHRcdF8uZWFjaCBpbXBfZGF0YS5vYmplY3RzLCAob2JqZWN0KS0+XHJcblx0XHRcdENyZWF0b3IuaW1wb3J0T2JqZWN0KHVzZXJJZCwgc3BhY2VfaWQsIG9iamVjdCwgbGlzdF92aWV3c19pZF9tYXBzKVxyXG5cclxuXHQjIDMg5oyB5LmF5YyWbGlzdF92aWV3c1xyXG5cdGlmIF8uaXNBcnJheShpbXBfZGF0YS5saXN0X3ZpZXdzKSAmJiBpbXBfZGF0YS5saXN0X3ZpZXdzLmxlbmd0aCA+IDBcclxuXHRcdF8uZWFjaCBpbXBfZGF0YS5saXN0X3ZpZXdzLCAobGlzdF92aWV3KS0+XHJcblx0XHRcdG9sZF9pZCA9IGxpc3Rfdmlldy5faWRcclxuXHRcdFx0ZGVsZXRlIGxpc3Rfdmlldy5faWRcclxuXHJcblx0XHRcdGxpc3Rfdmlldy5zcGFjZSA9IHNwYWNlX2lkXHJcblx0XHRcdGxpc3Rfdmlldy5vd25lciA9IHVzZXJJZFxyXG5cdFx0XHRpZiBDcmVhdG9yLmlzQWxsVmlldyhsaXN0X3ZpZXcpIHx8IENyZWF0b3IuaXNSZWNlbnRWaWV3KGxpc3RfdmlldylcclxuXHRcdFx0XHQjIOWIm+W7um9iamVjdOaXtu+8jOS8muiHquWKqOa3u+WKoGFsbCB2aWV344CBcmVjZW50IHZpZXdcclxuXHRcdFx0XHRfbGlzdF92aWV3ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kT25lKHtvYmplY3RfbmFtZTogbGlzdF92aWV3Lm9iamVjdF9uYW1lLCBuYW1lOiBsaXN0X3ZpZXcubmFtZSwgc3BhY2U6IHNwYWNlX2lkfSx7ZmllbGRzOiB7X2lkOiAxfX0pXHJcblx0XHRcdFx0aWYgX2xpc3Rfdmlld1xyXG5cdFx0XHRcdFx0bmV3X2lkID0gX2xpc3Rfdmlldy5faWRcclxuXHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLnVwZGF0ZSh7b2JqZWN0X25hbWU6IGxpc3Rfdmlldy5vYmplY3RfbmFtZSwgbmFtZTogbGlzdF92aWV3Lm5hbWUsIHNwYWNlOiBzcGFjZV9pZH0sIHskc2V0OiBsaXN0X3ZpZXd9KVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0bmV3X2lkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5pbnNlcnQobGlzdF92aWV3KVxyXG5cclxuXHRcdFx0bGlzdF92aWV3c19pZF9tYXBzW2xpc3Rfdmlldy5vYmplY3RfbmFtZSArIFwiX1wiICsgb2xkX2lkXSA9IG5ld19pZFxyXG5cclxuXHQjIDQg5oyB5LmF5YyWcGVybWlzc2lvbl9zZXRcclxuXHRpZiBfLmlzQXJyYXkoaW1wX2RhdGEucGVybWlzc2lvbl9zZXQpICYmIGltcF9kYXRhLnBlcm1pc3Npb25fc2V0Lmxlbmd0aCA+IDBcclxuXHRcdF8uZWFjaCBpbXBfZGF0YS5wZXJtaXNzaW9uX3NldCwgKHBlcm1pc3Npb25fc2V0KS0+XHJcblx0XHRcdG9sZF9pZCA9IHBlcm1pc3Npb25fc2V0Ll9pZFxyXG5cdFx0XHRkZWxldGUgcGVybWlzc2lvbl9zZXQuX2lkXHJcblxyXG5cdFx0XHRwZXJtaXNzaW9uX3NldC5zcGFjZSA9IHNwYWNlX2lkXHJcblx0XHRcdHBlcm1pc3Npb25fc2V0Lm93bmVyID0gdXNlcklkXHJcblxyXG5cdFx0XHRwZXJtaXNzaW9uX3NldF91c2VycyA9IFtdXHJcblx0XHRcdF8uZWFjaCBwZXJtaXNzaW9uX3NldC51c2VycywgKHVzZXJfaWQpLT5cclxuXHRcdFx0XHRzcGFjZV91c2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyOiB1c2VyX2lkfSwge2ZpZWxkczoge19pZDogMX19KVxyXG5cdFx0XHRcdGlmIHNwYWNlX3VzZXJcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25fc2V0X3VzZXJzLnB1c2ggdXNlcl9pZFxyXG5cclxuXHRcdFx0YXNzaWduZWRfYXBwcyA9IFtdXHJcblx0XHRcdF8uZWFjaCBwZXJtaXNzaW9uX3NldC5hc3NpZ25lZF9hcHBzLCAoYXBwX2lkKS0+XHJcblx0XHRcdFx0aWYgXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLkFwcHMpLCBhcHBfaWQpXHJcblx0XHRcdFx0XHRhc3NpZ25lZF9hcHBzLnB1c2ggYXBwX2lkXHJcblx0XHRcdFx0ZWxzZSBpZiBhcHBzX2lkX21hcHNbYXBwX2lkXVxyXG5cdFx0XHRcdFx0YXNzaWduZWRfYXBwcy5wdXNoIGFwcHNfaWRfbWFwc1thcHBfaWRdXHJcblxyXG5cclxuXHRcdFx0bmV3X2lkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuaW5zZXJ0KHBlcm1pc3Npb25fc2V0KVxyXG5cclxuXHRcdFx0cGVybWlzc2lvbl9zZXRfaWRfbWFwc1tvbGRfaWRdID0gbmV3X2lkXHJcblxyXG5cdCMgNSAg5oyB5LmF5YyWcGVybWlzc2lvbl9vYmplY3RzXHJcblx0aWYgXy5pc0FycmF5KGltcF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cykgJiYgaW1wX2RhdGEucGVybWlzc2lvbl9vYmplY3RzLmxlbmd0aCA+IDBcclxuXHRcdF8uZWFjaCBpbXBfZGF0YS5wZXJtaXNzaW9uX29iamVjdHMsIChwZXJtaXNzaW9uX29iamVjdCktPlxyXG5cdFx0XHRkZWxldGUgcGVybWlzc2lvbl9vYmplY3QuX2lkXHJcblxyXG5cdFx0XHRwZXJtaXNzaW9uX29iamVjdC5zcGFjZSA9IHNwYWNlX2lkXHJcblx0XHRcdHBlcm1pc3Npb25fb2JqZWN0Lm93bmVyID0gdXNlcklkXHJcblxyXG5cdFx0XHRwZXJtaXNzaW9uX29iamVjdC5wZXJtaXNzaW9uX3NldF9pZCA9IHBlcm1pc3Npb25fc2V0X2lkX21hcHNbcGVybWlzc2lvbl9vYmplY3QucGVybWlzc2lvbl9zZXRfaWRdXHJcblxyXG5cdFx0XHRkaXNhYmxlZF9saXN0X3ZpZXdzID0gW11cclxuXHRcdFx0Xy5lYWNoIHBlcm1pc3Npb25fb2JqZWN0LmRpc2FibGVkX2xpc3Rfdmlld3MsIChsaXN0X3ZpZXdfaWQpLT5cclxuXHRcdFx0XHRuZXdfdmlld19pZCA9IGxpc3Rfdmlld3NfaWRfbWFwc1twZXJtaXNzaW9uX29iamVjdC5vYmplY3RfbmFtZSArIFwiX1wiICsgbGlzdF92aWV3X2lkXVxyXG5cdFx0XHRcdGlmIG5ld192aWV3X2lkXHJcblx0XHRcdFx0XHRkaXNhYmxlZF9saXN0X3ZpZXdzLnB1c2ggbmV3X3ZpZXdfaWRcclxuXHJcblx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5pbnNlcnQocGVybWlzc2lvbl9vYmplY3QpXHJcblxyXG5cdCMgNiDmjIHkuYXljJZyZXBvcnRzXHJcblx0aWYgXy5pc0FycmF5KGltcF9kYXRhLnJlcG9ydHMpICYmIGltcF9kYXRhLnJlcG9ydHMubGVuZ3RoID4gMFxyXG5cdFx0Xy5lYWNoIGltcF9kYXRhLnJlcG9ydHMsIChyZXBvcnQpLT5cclxuXHRcdFx0ZGVsZXRlIHJlcG9ydC5faWRcclxuXHJcblx0XHRcdHJlcG9ydC5zcGFjZSA9IHNwYWNlX2lkXHJcblx0XHRcdHJlcG9ydC5vd25lciA9IHVzZXJJZFxyXG5cclxuXHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicmVwb3J0c1wiKS5pbnNlcnQocmVwb3J0KVxyXG5cdCMjI+aVsOaNruaMgeS5heWMliDnu5PmnZ8jIyNcclxuXHJcbiMjI+eUseS6juS9v+eUqOaOpeWPo+aWueW8j+S8muWvvOiHtGNvbGxlY3Rpb27nmoRhZnRlcuOAgWJlZm9yZeS4reiOt+WPluS4jeWIsHVzZXJJZO+8jOWGjeatpOmXrumimOacquino+WGs+S5i+WJje+8jOi/mOaYr+S9v+eUqE1ldGhvZFxyXG5Kc29uUm91dGVzLmFkZCAncG9zdCcsICcvYXBpL2NyZWF0b3IvYXBwX3BhY2thZ2UvaW1wb3J0LzpzcGFjZV9pZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHR0cnlcclxuXHRcdHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcyk7XHJcblx0XHRzcGFjZV9pZCA9IHJlcS5wYXJhbXMuc3BhY2VfaWRcclxuXHRcdGltcF9kYXRhID0gcmVxLmJvZHlcclxuXHRcdGltcG9ydF9hcHBfcGFja2FnZSh1c2VySWQsIHNwYWNlX2lkLCBpbXBfZGF0YSlcclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdGRhdGE6IHt9XHJcblx0XHR9XHJcblx0Y2F0Y2ggZVxyXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdGNvZGU6IGUuZXJyb3JcclxuXHRcdFx0ZGF0YTogeyBlcnJvcnM6IGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlIH1cclxuXHRcdH1cclxuIyMjXHJcblxyXG5NZXRlb3IubWV0aG9kc1xyXG5cdCdpbXBvcnRfYXBwX3BhY2thZ2UnOiAoc3BhY2VfaWQsIGltcF9kYXRhKS0+XHJcblx0XHR1c2VySWQgPSB0aGlzLnVzZXJJZFxyXG5cdFx0Q3JlYXRvci5pbXBvcnRfYXBwX3BhY2thZ2UodXNlcklkLCBzcGFjZV9pZCwgaW1wX2RhdGEpXHJcbiIsInZhciB0cmFuc2Zvcm1GaWVsZE9wdGlvbnMsIHRyYW5zZm9ybUZpbHRlcnM7XG5cbnRyYW5zZm9ybUZpbHRlcnMgPSBmdW5jdGlvbihmaWx0ZXJzKSB7XG4gIHZhciBfZmlsdGVycztcbiAgX2ZpbHRlcnMgPSBbXTtcbiAgXy5lYWNoKGZpbHRlcnMsIGZ1bmN0aW9uKGYpIHtcbiAgICBpZiAoXy5pc0FycmF5KGYpICYmIGYubGVuZ3RoID09PSAzKSB7XG4gICAgICByZXR1cm4gX2ZpbHRlcnMucHVzaCh7XG4gICAgICAgIGZpZWxkOiBmWzBdLFxuICAgICAgICBvcGVyYXRpb246IGZbMV0sXG4gICAgICAgIHZhbHVlOiBmWzJdXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIF9maWx0ZXJzLnB1c2goZik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIF9maWx0ZXJzO1xufTtcblxudHJhbnNmb3JtRmllbGRPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICB2YXIgX29wdGlvbnM7XG4gIGlmICghXy5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgcmV0dXJuIG9wdGlvbnM7XG4gIH1cbiAgX29wdGlvbnMgPSBbXTtcbiAgXy5lYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKG8pIHtcbiAgICBpZiAobyAmJiBfLmhhcyhvLCAnbGFiZWwnKSAmJiBfLmhhcyhvLCAndmFsdWUnKSkge1xuICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goby5sYWJlbCArIFwiOlwiICsgby52YWx1ZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIF9vcHRpb25zLmpvaW4oJywnKTtcbn07XG5cbkNyZWF0b3IuaW1wb3J0T2JqZWN0ID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZV9pZCwgb2JqZWN0LCBsaXN0X3ZpZXdzX2lkX21hcHMpIHtcbiAgdmFyIF9maWVsZG5hbWVzLCBhY3Rpb25zLCBmaWVsZHMsIGhhc1JlY2VudFZpZXcsIGludGVybmFsX2xpc3Rfdmlldywgb2JqX2xpc3Rfdmlld3MsIHRyaWdnZXJzO1xuICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0taW1wb3J0T2JqZWN0LS0tLS0tLS0tLS0tLS0tLS0tJywgb2JqZWN0Lm5hbWUpO1xuICBmaWVsZHMgPSBvYmplY3QuZmllbGRzO1xuICB0cmlnZ2VycyA9IG9iamVjdC50cmlnZ2VycztcbiAgYWN0aW9ucyA9IG9iamVjdC5hY3Rpb25zO1xuICBvYmpfbGlzdF92aWV3cyA9IG9iamVjdC5saXN0X3ZpZXdzO1xuICBkZWxldGUgb2JqZWN0Ll9pZDtcbiAgZGVsZXRlIG9iamVjdC5maWVsZHM7XG4gIGRlbGV0ZSBvYmplY3QudHJpZ2dlcnM7XG4gIGRlbGV0ZSBvYmplY3QuYWN0aW9ucztcbiAgZGVsZXRlIG9iamVjdC5wZXJtaXNzaW9ucztcbiAgZGVsZXRlIG9iamVjdC5saXN0X3ZpZXdzO1xuICBvYmplY3Quc3BhY2UgPSBzcGFjZV9pZDtcbiAgb2JqZWN0Lm93bmVyID0gdXNlcklkO1xuICBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLmluc2VydChvYmplY3QpO1xuICBpbnRlcm5hbF9saXN0X3ZpZXcgPSB7fTtcbiAgaGFzUmVjZW50VmlldyA9IGZhbHNlO1xuICBjb25zb2xlLmxvZygn5oyB5LmF5YyW5a+56LGhbGlzdF92aWV3cycpO1xuICBfLmVhY2gob2JqX2xpc3Rfdmlld3MsIGZ1bmN0aW9uKGxpc3Rfdmlldykge1xuICAgIHZhciBuZXdfaWQsIG9sZF9pZCwgb3B0aW9ucztcbiAgICBvbGRfaWQgPSBsaXN0X3ZpZXcuX2lkO1xuICAgIGRlbGV0ZSBsaXN0X3ZpZXcuX2lkO1xuICAgIGxpc3Rfdmlldy5zcGFjZSA9IHNwYWNlX2lkO1xuICAgIGxpc3Rfdmlldy5vd25lciA9IHVzZXJJZDtcbiAgICBsaXN0X3ZpZXcub2JqZWN0X25hbWUgPSBvYmplY3QubmFtZTtcbiAgICBpZiAoQ3JlYXRvci5pc1JlY2VudFZpZXcobGlzdF92aWV3KSkge1xuICAgICAgaGFzUmVjZW50VmlldyA9IHRydWU7XG4gICAgfVxuICAgIGlmIChsaXN0X3ZpZXcuZmlsdGVycykge1xuICAgICAgbGlzdF92aWV3LmZpbHRlcnMgPSB0cmFuc2Zvcm1GaWx0ZXJzKGxpc3Rfdmlldy5maWx0ZXJzKTtcbiAgICB9XG4gICAgaWYgKENyZWF0b3IuaXNBbGxWaWV3KGxpc3RfdmlldykgfHwgQ3JlYXRvci5pc1JlY2VudFZpZXcobGlzdF92aWV3KSkge1xuICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgJHNldDogbGlzdF92aWV3XG4gICAgICB9O1xuICAgICAgaWYgKCFsaXN0X3ZpZXcuY29sdW1ucykge1xuICAgICAgICBvcHRpb25zLiR1bnNldCA9IHtcbiAgICAgICAgICBjb2x1bW5zOiAnJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikudXBkYXRlKHtcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdC5uYW1lLFxuICAgICAgICBuYW1lOiBsaXN0X3ZpZXcubmFtZSxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICB9LCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3X2lkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5pbnNlcnQobGlzdF92aWV3KTtcbiAgICAgIHJldHVybiBsaXN0X3ZpZXdzX2lkX21hcHNbb2JqZWN0Lm5hbWUgKyBcIl9cIiArIG9sZF9pZF0gPSBuZXdfaWQ7XG4gICAgfVxuICB9KTtcbiAgaWYgKCFoYXNSZWNlbnRWaWV3KSB7XG4gICAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5yZW1vdmUoe1xuICAgICAgbmFtZTogXCJyZWNlbnRcIixcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3QubmFtZSxcbiAgICAgIG93bmVyOiB1c2VySWRcbiAgICB9KTtcbiAgfVxuICBjb25zb2xlLmxvZygn5oyB5LmF5YyW5a+56LGh5a2X5q61Jyk7XG4gIF9maWVsZG5hbWVzID0gW107XG4gIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrKSB7XG4gICAgZGVsZXRlIGZpZWxkLl9pZDtcbiAgICBmaWVsZC5zcGFjZSA9IHNwYWNlX2lkO1xuICAgIGZpZWxkLm93bmVyID0gdXNlcklkO1xuICAgIGZpZWxkLm9iamVjdCA9IG9iamVjdC5uYW1lO1xuICAgIGlmIChmaWVsZC5vcHRpb25zKSB7XG4gICAgICBmaWVsZC5vcHRpb25zID0gdHJhbnNmb3JtRmllbGRPcHRpb25zKGZpZWxkLm9wdGlvbnMpO1xuICAgIH1cbiAgICBpZiAoIV8uaGFzKGZpZWxkLCBcIm5hbWVcIikpIHtcbiAgICAgIGZpZWxkLm5hbWUgPSBrO1xuICAgIH1cbiAgICBfZmllbGRuYW1lcy5wdXNoKGZpZWxkLm5hbWUpO1xuICAgIGlmIChmaWVsZC5uYW1lID09PSBcIm5hbWVcIikge1xuICAgICAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS51cGRhdGUoe1xuICAgICAgICBvYmplY3Q6IG9iamVjdC5uYW1lLFxuICAgICAgICBuYW1lOiBcIm5hbWVcIixcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IGZpZWxkXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS5pbnNlcnQoZmllbGQpO1xuICAgIH1cbiAgICBpZiAoIV8uY29udGFpbnMoX2ZpZWxkbmFtZXMsICduYW1lJykpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfZmllbGRzXCIpLmRpcmVjdC5yZW1vdmUoe1xuICAgICAgICBvYmplY3Q6IG9iamVjdC5uYW1lLFxuICAgICAgICBuYW1lOiBcIm5hbWVcIixcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBjb25zb2xlLmxvZygn5oyB5LmF5YyW6Kem5Y+R5ZmoJyk7XG4gIF8uZWFjaCh0cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlciwgaykge1xuICAgIGRlbGV0ZSB0cmlnZ2Vycy5faWQ7XG4gICAgdHJpZ2dlci5zcGFjZSA9IHNwYWNlX2lkO1xuICAgIHRyaWdnZXIub3duZXIgPSB1c2VySWQ7XG4gICAgdHJpZ2dlci5vYmplY3QgPSBvYmplY3QubmFtZTtcbiAgICBpZiAoIV8uaGFzKHRyaWdnZXIsIFwibmFtZVwiKSkge1xuICAgICAgdHJpZ2dlci5uYW1lID0gay5yZXBsYWNlKG5ldyBSZWdFeHAoXCJcXFxcLlwiLCBcImdcIiksIFwiX1wiKTtcbiAgICB9XG4gICAgaWYgKCFfLmhhcyh0cmlnZ2VyLCBcImlzX2VuYWJsZVwiKSkge1xuICAgICAgdHJpZ2dlci5pc19lbmFibGUgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3RyaWdnZXJzXCIpLmluc2VydCh0cmlnZ2VyKTtcbiAgfSk7XG4gIGNvbnNvbGUubG9nKCfmjIHkuYXljJbmk43kvZwnKTtcbiAgXy5lYWNoKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbiwgaykge1xuICAgIGRlbGV0ZSBhY3Rpb24uX2lkO1xuICAgIGFjdGlvbi5zcGFjZSA9IHNwYWNlX2lkO1xuICAgIGFjdGlvbi5vd25lciA9IHVzZXJJZDtcbiAgICBhY3Rpb24ub2JqZWN0ID0gb2JqZWN0Lm5hbWU7XG4gICAgaWYgKCFfLmhhcyhhY3Rpb24sIFwibmFtZVwiKSkge1xuICAgICAgYWN0aW9uLm5hbWUgPSBrLnJlcGxhY2UobmV3IFJlZ0V4cChcIlxcXFwuXCIsIFwiZ1wiKSwgXCJfXCIpO1xuICAgIH1cbiAgICBpZiAoIV8uaGFzKGFjdGlvbiwgXCJpc19lbmFibGVcIikpIHtcbiAgICAgIGFjdGlvbi5pc19lbmFibGUgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2FjdGlvbnNcIikuaW5zZXJ0KGFjdGlvbik7XG4gIH0pO1xuICByZXR1cm4gY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLWltcG9ydE9iamVjdCBlbmQtLS0tLS0tLS0tLS0tLS0tLS0nLCBvYmplY3QubmFtZSk7XG59O1xuXG5DcmVhdG9yLmltcG9ydF9hcHBfcGFja2FnZSA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VfaWQsIGltcF9kYXRhLCBmcm9tX3RlbXBsYXRlKSB7XG4gIHZhciBhcHBzX2lkX21hcHMsIGltcF9hcHBfaWRzLCBpbXBfb2JqZWN0X25hbWVzLCBsaXN0X3ZpZXdzX2lkX21hcHMsIG9iamVjdF9uYW1lcywgcGVybWlzc2lvbl9zZXRfaWRfbWFwcywgcGVybWlzc2lvbl9zZXRfaWRzO1xuICBpZiAoIXVzZXJJZCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI0MDFcIiwgXCJBdXRoZW50aWNhdGlvbiBpcyByZXF1aXJlZCBhbmQgaGFzIG5vdCBiZWVuIHByb3ZpZGVkLlwiKTtcbiAgfVxuICBpZiAoIUNyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCB1c2VySWQpKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjQwMVwiLCBcIlBlcm1pc3Npb24gZGVuaWVkLlwiKTtcbiAgfVxuXG4gIC8q5pWw5o2u5qCh6aqMIOW8gOWniyAqL1xuICBjaGVjayhpbXBfZGF0YSwgT2JqZWN0KTtcbiAgaWYgKCFmcm9tX3RlbXBsYXRlKSB7XG4gICAgaW1wX2FwcF9pZHMgPSBfLnBsdWNrKGltcF9kYXRhLmFwcHMsIFwiX2lkXCIpO1xuICAgIGlmIChfLmlzQXJyYXkoaW1wX2RhdGEuYXBwcykgJiYgaW1wX2RhdGEuYXBwcy5sZW5ndGggPiAwKSB7XG4gICAgICBfLmVhY2goaW1wX2RhdGEuYXBwcywgZnVuY3Rpb24oYXBwKSB7XG4gICAgICAgIGlmIChfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuQXBwcyksIGFwcC5faWQpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuW6lOeUqCdcIiArIGFwcC5uYW1lICsgXCIn5bey5a2Y5ZyoXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShpbXBfZGF0YS5vYmplY3RzKSAmJiBpbXBfZGF0YS5vYmplY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgIF8uZWFjaChpbXBfZGF0YS5vYmplY3RzLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgaWYgKF8uaW5jbHVkZShfLmtleXMoQ3JlYXRvci5PYmplY3RzKSwgb2JqZWN0Lm5hbWUpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuWvueixoSdcIiArIG9iamVjdC5uYW1lICsgXCIn5bey5a2Y5ZyoXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfLmVhY2gob2JqZWN0LnRyaWdnZXJzLCBmdW5jdGlvbih0cmlnZ2VyKSB7XG4gICAgICAgICAgaWYgKHRyaWdnZXIub24gPT09ICdzZXJ2ZXInICYmICFTdGVlZG9zLmlzTGVnYWxWZXJzaW9uKHNwYWNlX2lkLCBcIndvcmtmbG93LmVudGVycHJpc2VcIikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuWPquacieS8geS4mueJiOaUr+aMgemFjee9ruacjeWKoeerr+eahOinpuWPkeWZqFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGltcF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKGltcF9kYXRhLm9iamVjdHMsIFwibmFtZVwiKTtcbiAgICBvYmplY3RfbmFtZXMgPSBfLmtleXMoQ3JlYXRvci5PYmplY3RzKTtcbiAgICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLmFwcHMpICYmIGltcF9kYXRhLmFwcHMubGVuZ3RoID4gMCkge1xuICAgICAgXy5lYWNoKGltcF9kYXRhLmFwcHMsIGZ1bmN0aW9uKGFwcCkge1xuICAgICAgICByZXR1cm4gXy5lYWNoKGFwcC5vYmplY3RzLCBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgICAgICAgIGlmICghXy5pbmNsdWRlKG9iamVjdF9uYW1lcywgb2JqZWN0X25hbWUpICYmICFfLmluY2x1ZGUoaW1wX29iamVjdF9uYW1lcywgb2JqZWN0X25hbWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5bqU55SoJ1wiICsgYXBwLm5hbWUgKyBcIifkuK3mjIflrprnmoTlr7nosaEnXCIgKyBvYmplY3RfbmFtZSArIFwiJ+S4jeWtmOWcqFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkoaW1wX2RhdGEubGlzdF92aWV3cykgJiYgaW1wX2RhdGEubGlzdF92aWV3cy5sZW5ndGggPiAwKSB7XG4gICAgICBfLmVhY2goaW1wX2RhdGEubGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gICAgICAgIGlmICghbGlzdF92aWV3Lm9iamVjdF9uYW1lIHx8ICFfLmlzU3RyaW5nKGxpc3Rfdmlldy5vYmplY3RfbmFtZSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5YiX6KGo6KeG5Zu+J1wiICsgbGlzdF92aWV3Lm5hbWUgKyBcIifnmoRvYmplY3RfbmFtZeWxnuaAp+aXoOaViFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIV8uaW5jbHVkZShvYmplY3RfbmFtZXMsIGxpc3Rfdmlldy5vYmplY3RfbmFtZSkgJiYgIV8uaW5jbHVkZShpbXBfb2JqZWN0X25hbWVzLCBsaXN0X3ZpZXcub2JqZWN0X25hbWUpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuWIl+ihqOinhuWbvidcIiArIGxpc3Rfdmlldy5uYW1lICsgXCIn5Lit5oyH5a6a55qE5a+56LGhJ1wiICsgbGlzdF92aWV3Lm9iamVjdF9uYW1lICsgXCIn5LiN5a2Y5ZyoXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcGVybWlzc2lvbl9zZXRfaWRzID0gXy5wbHVjayhpbXBfZGF0YS5wZXJtaXNzaW9uX3NldCwgXCJfaWRcIik7XG4gICAgaWYgKF8uaXNBcnJheShpbXBfZGF0YS5wZXJtaXNzaW9uX3NldCkgJiYgaW1wX2RhdGEucGVybWlzc2lvbl9zZXQubGVuZ3RoID4gMCkge1xuICAgICAgXy5lYWNoKGltcF9kYXRhLnBlcm1pc3Npb25fc2V0LCBmdW5jdGlvbihwZXJtaXNzaW9uX3NldCkge1xuICAgICAgICBpZiAoQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIG5hbWU6IHBlcm1pc3Npb25fc2V0Lm5hbWVcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuadg+mZkOmbhuWQjeensCdcIiArIHBlcm1pc3Npb25fc2V0Lm5hbWUgKyBcIifkuI3og73ph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF8uZWFjaChwZXJtaXNzaW9uX3NldC5hc3NpZ25lZF9hcHBzLCBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICAgICAgICBpZiAoIV8uaW5jbHVkZShfLmtleXMoQ3JlYXRvci5BcHBzKSwgYXBwX2lkKSAmJiAhXy5pbmNsdWRlKGltcF9hcHBfaWRzLCBhcHBfaWQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5p2D6ZmQ6ZuGJ1wiICsgcGVybWlzc2lvbl9zZXQubmFtZSArIFwiJ+eahOaOiOadg+W6lOeUqCdcIiArIGFwcF9pZCArIFwiJ+S4jeWtmOWcqFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkoaW1wX2RhdGEucGVybWlzc2lvbl9vYmplY3RzKSAmJiBpbXBfZGF0YS5wZXJtaXNzaW9uX29iamVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgXy5lYWNoKGltcF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cywgZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3QpIHtcbiAgICAgICAgaWYgKCFwZXJtaXNzaW9uX29iamVjdC5vYmplY3RfbmFtZSB8fCAhXy5pc1N0cmluZyhwZXJtaXNzaW9uX29iamVjdC5vYmplY3RfbmFtZSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5p2D6ZmQ6ZuGJ1wiICsgcGVybWlzc2lvbl9vYmplY3QubmFtZSArIFwiJ+eahG9iamVjdF9uYW1l5bGe5oCn5peg5pWIXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghXy5pbmNsdWRlKG9iamVjdF9uYW1lcywgcGVybWlzc2lvbl9vYmplY3Qub2JqZWN0X25hbWUpICYmICFfLmluY2x1ZGUoaW1wX29iamVjdF9uYW1lcywgcGVybWlzc2lvbl9vYmplY3Qub2JqZWN0X25hbWUpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuadg+mZkOmbhidcIiArIGxpc3Rfdmlldy5uYW1lICsgXCIn5Lit5oyH5a6a55qE5a+56LGhJ1wiICsgcGVybWlzc2lvbl9vYmplY3Qub2JqZWN0X25hbWUgKyBcIifkuI3lrZjlnKhcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFfLmhhcyhwZXJtaXNzaW9uX29iamVjdCwgXCJwZXJtaXNzaW9uX3NldF9pZFwiKSB8fCAhXy5pc1N0cmluZyhwZXJtaXNzaW9uX29iamVjdC5wZXJtaXNzaW9uX3NldF9pZCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5p2D6ZmQ6ZuGJ1wiICsgcGVybWlzc2lvbl9vYmplY3QubmFtZSArIFwiJ+eahHBlcm1pc3Npb25fc2V0X2lk5bGe5oCn5peg5pWIXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKCFfLmluY2x1ZGUocGVybWlzc2lvbl9zZXRfaWRzLCBwZXJtaXNzaW9uX29iamVjdC5wZXJtaXNzaW9uX3NldF9pZCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi5p2D6ZmQ6ZuGJ1wiICsgcGVybWlzc2lvbl9vYmplY3QubmFtZSArIFwiJ+aMh+WumueahOadg+mZkOmbhidcIiArIHBlcm1pc3Npb25fb2JqZWN0LnBlcm1pc3Npb25fc2V0X2lkICsgXCIn5YC85LiN5Zyo5a+85YWl55qEcGVybWlzc2lvbl9zZXTkuK1cIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLnJlcG9ydHMpICYmIGltcF9kYXRhLnJlcG9ydHMubGVuZ3RoID4gMCkge1xuICAgICAgXy5lYWNoKGltcF9kYXRhLnJlcG9ydHMsIGZ1bmN0aW9uKHJlcG9ydCkge1xuICAgICAgICBpZiAoIXJlcG9ydC5vYmplY3RfbmFtZSB8fCAhXy5pc1N0cmluZyhyZXBvcnQub2JqZWN0X25hbWUpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuaKpeihqCdcIiArIHJlcG9ydC5uYW1lICsgXCIn55qEb2JqZWN0X25hbWXlsZ7mgKfml6DmlYhcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFfLmluY2x1ZGUob2JqZWN0X25hbWVzLCByZXBvcnQub2JqZWN0X25hbWUpICYmICFfLmluY2x1ZGUoaW1wX29iamVjdF9uYW1lcywgcmVwb3J0Lm9iamVjdF9uYW1lKSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgXCLmiqXooagnXCIgKyByZXBvcnQubmFtZSArIFwiJ+S4reaMh+WumueahOWvueixoSdcIiArIHJlcG9ydC5vYmplY3RfbmFtZSArIFwiJ+S4jeWtmOWcqFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyrmlbDmja7moKHpqowg57uT5p2fICovXG5cbiAgLyrmlbDmja7mjIHkuYXljJYg5byA5aeLICovXG4gIGFwcHNfaWRfbWFwcyA9IHt9O1xuICBsaXN0X3ZpZXdzX2lkX21hcHMgPSB7fTtcbiAgcGVybWlzc2lvbl9zZXRfaWRfbWFwcyA9IHt9O1xuICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLmFwcHMpICYmIGltcF9kYXRhLmFwcHMubGVuZ3RoID4gMCkge1xuICAgIF8uZWFjaChpbXBfZGF0YS5hcHBzLCBmdW5jdGlvbihhcHApIHtcbiAgICAgIHZhciBuZXdfaWQsIG9sZF9pZDtcbiAgICAgIG9sZF9pZCA9IGFwcC5faWQ7XG4gICAgICBkZWxldGUgYXBwLl9pZDtcbiAgICAgIGFwcC5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgYXBwLm93bmVyID0gdXNlcklkO1xuICAgICAgYXBwLmlzX2NyZWF0b3IgPSB0cnVlO1xuICAgICAgbmV3X2lkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwc1wiKS5pbnNlcnQoYXBwKTtcbiAgICAgIHJldHVybiBhcHBzX2lkX21hcHNbb2xkX2lkXSA9IG5ld19pZDtcbiAgICB9KTtcbiAgfVxuICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLm9iamVjdHMpICYmIGltcF9kYXRhLm9iamVjdHMubGVuZ3RoID4gMCkge1xuICAgIF8uZWFjaChpbXBfZGF0YS5vYmplY3RzLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmltcG9ydE9iamVjdCh1c2VySWQsIHNwYWNlX2lkLCBvYmplY3QsIGxpc3Rfdmlld3NfaWRfbWFwcyk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKF8uaXNBcnJheShpbXBfZGF0YS5saXN0X3ZpZXdzKSAmJiBpbXBfZGF0YS5saXN0X3ZpZXdzLmxlbmd0aCA+IDApIHtcbiAgICBfLmVhY2goaW1wX2RhdGEubGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gICAgICB2YXIgX2xpc3RfdmlldywgbmV3X2lkLCBvbGRfaWQ7XG4gICAgICBvbGRfaWQgPSBsaXN0X3ZpZXcuX2lkO1xuICAgICAgZGVsZXRlIGxpc3Rfdmlldy5faWQ7XG4gICAgICBsaXN0X3ZpZXcuc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIGxpc3Rfdmlldy5vd25lciA9IHVzZXJJZDtcbiAgICAgIGlmIChDcmVhdG9yLmlzQWxsVmlldyhsaXN0X3ZpZXcpIHx8IENyZWF0b3IuaXNSZWNlbnRWaWV3KGxpc3RfdmlldykpIHtcbiAgICAgICAgX2xpc3RfdmlldyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZE9uZSh7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IGxpc3Rfdmlldy5vYmplY3RfbmFtZSxcbiAgICAgICAgICBuYW1lOiBsaXN0X3ZpZXcubmFtZSxcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKF9saXN0X3ZpZXcpIHtcbiAgICAgICAgICBuZXdfaWQgPSBfbGlzdF92aWV3Ll9pZDtcbiAgICAgICAgfVxuICAgICAgICBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLnVwZGF0ZSh7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IGxpc3Rfdmlldy5vYmplY3RfbmFtZSxcbiAgICAgICAgICBuYW1lOiBsaXN0X3ZpZXcubmFtZSxcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IGxpc3Rfdmlld1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld19pZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuaW5zZXJ0KGxpc3Rfdmlldyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGlzdF92aWV3c19pZF9tYXBzW2xpc3Rfdmlldy5vYmplY3RfbmFtZSArIFwiX1wiICsgb2xkX2lkXSA9IG5ld19pZDtcbiAgICB9KTtcbiAgfVxuICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLnBlcm1pc3Npb25fc2V0KSAmJiBpbXBfZGF0YS5wZXJtaXNzaW9uX3NldC5sZW5ndGggPiAwKSB7XG4gICAgXy5lYWNoKGltcF9kYXRhLnBlcm1pc3Npb25fc2V0LCBmdW5jdGlvbihwZXJtaXNzaW9uX3NldCkge1xuICAgICAgdmFyIGFzc2lnbmVkX2FwcHMsIG5ld19pZCwgb2xkX2lkLCBwZXJtaXNzaW9uX3NldF91c2VycztcbiAgICAgIG9sZF9pZCA9IHBlcm1pc3Npb25fc2V0Ll9pZDtcbiAgICAgIGRlbGV0ZSBwZXJtaXNzaW9uX3NldC5faWQ7XG4gICAgICBwZXJtaXNzaW9uX3NldC5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgcGVybWlzc2lvbl9zZXQub3duZXIgPSB1c2VySWQ7XG4gICAgICBwZXJtaXNzaW9uX3NldF91c2VycyA9IFtdO1xuICAgICAgXy5lYWNoKHBlcm1pc3Npb25fc2V0LnVzZXJzLCBmdW5jdGlvbih1c2VyX2lkKSB7XG4gICAgICAgIHZhciBzcGFjZV91c2VyO1xuICAgICAgICBzcGFjZV91c2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIHVzZXI6IHVzZXJfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHNwYWNlX3VzZXIpIHtcbiAgICAgICAgICByZXR1cm4gcGVybWlzc2lvbl9zZXRfdXNlcnMucHVzaCh1c2VyX2lkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NpZ25lZF9hcHBzID0gW107XG4gICAgICBfLmVhY2gocGVybWlzc2lvbl9zZXQuYXNzaWduZWRfYXBwcywgZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgICAgIGlmIChfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuQXBwcyksIGFwcF9pZCkpIHtcbiAgICAgICAgICByZXR1cm4gYXNzaWduZWRfYXBwcy5wdXNoKGFwcF9pZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXBwc19pZF9tYXBzW2FwcF9pZF0pIHtcbiAgICAgICAgICByZXR1cm4gYXNzaWduZWRfYXBwcy5wdXNoKGFwcHNfaWRfbWFwc1thcHBfaWRdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBuZXdfaWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5pbnNlcnQocGVybWlzc2lvbl9zZXQpO1xuICAgICAgcmV0dXJuIHBlcm1pc3Npb25fc2V0X2lkX21hcHNbb2xkX2lkXSA9IG5ld19pZDtcbiAgICB9KTtcbiAgfVxuICBpZiAoXy5pc0FycmF5KGltcF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cykgJiYgaW1wX2RhdGEucGVybWlzc2lvbl9vYmplY3RzLmxlbmd0aCA+IDApIHtcbiAgICBfLmVhY2goaW1wX2RhdGEucGVybWlzc2lvbl9vYmplY3RzLCBmdW5jdGlvbihwZXJtaXNzaW9uX29iamVjdCkge1xuICAgICAgdmFyIGRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICBkZWxldGUgcGVybWlzc2lvbl9vYmplY3QuX2lkO1xuICAgICAgcGVybWlzc2lvbl9vYmplY3Quc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIHBlcm1pc3Npb25fb2JqZWN0Lm93bmVyID0gdXNlcklkO1xuICAgICAgcGVybWlzc2lvbl9vYmplY3QucGVybWlzc2lvbl9zZXRfaWQgPSBwZXJtaXNzaW9uX3NldF9pZF9tYXBzW3Blcm1pc3Npb25fb2JqZWN0LnBlcm1pc3Npb25fc2V0X2lkXTtcbiAgICAgIGRpc2FibGVkX2xpc3Rfdmlld3MgPSBbXTtcbiAgICAgIF8uZWFjaChwZXJtaXNzaW9uX29iamVjdC5kaXNhYmxlZF9saXN0X3ZpZXdzLCBmdW5jdGlvbihsaXN0X3ZpZXdfaWQpIHtcbiAgICAgICAgdmFyIG5ld192aWV3X2lkO1xuICAgICAgICBuZXdfdmlld19pZCA9IGxpc3Rfdmlld3NfaWRfbWFwc1twZXJtaXNzaW9uX29iamVjdC5vYmplY3RfbmFtZSArIFwiX1wiICsgbGlzdF92aWV3X2lkXTtcbiAgICAgICAgaWYgKG5ld192aWV3X2lkKSB7XG4gICAgICAgICAgcmV0dXJuIGRpc2FibGVkX2xpc3Rfdmlld3MucHVzaChuZXdfdmlld19pZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5pbnNlcnQocGVybWlzc2lvbl9vYmplY3QpO1xuICAgIH0pO1xuICB9XG4gIGlmIChfLmlzQXJyYXkoaW1wX2RhdGEucmVwb3J0cykgJiYgaW1wX2RhdGEucmVwb3J0cy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIF8uZWFjaChpbXBfZGF0YS5yZXBvcnRzLCBmdW5jdGlvbihyZXBvcnQpIHtcbiAgICAgIGRlbGV0ZSByZXBvcnQuX2lkO1xuICAgICAgcmVwb3J0LnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICByZXBvcnQub3duZXIgPSB1c2VySWQ7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicmVwb3J0c1wiKS5pbnNlcnQocmVwb3J0KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8q5pWw5o2u5oyB5LmF5YyWIOe7k+adnyAqL1xufTtcblxuXG4vKueUseS6juS9v+eUqOaOpeWPo+aWueW8j+S8muWvvOiHtGNvbGxlY3Rpb27nmoRhZnRlcuOAgWJlZm9yZeS4reiOt+WPluS4jeWIsHVzZXJJZO+8jOWGjeatpOmXrumimOacquino+WGs+S5i+WJje+8jOi/mOaYr+S9v+eUqE1ldGhvZFxuSnNvblJvdXRlcy5hZGQgJ3Bvc3QnLCAnL2FwaS9jcmVhdG9yL2FwcF9wYWNrYWdlL2ltcG9ydC86c3BhY2VfaWQnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdHRyeVxuXHRcdHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcyk7XG5cdFx0c3BhY2VfaWQgPSByZXEucGFyYW1zLnNwYWNlX2lkXG5cdFx0aW1wX2RhdGEgPSByZXEuYm9keVxuXHRcdGltcG9ydF9hcHBfcGFja2FnZSh1c2VySWQsIHNwYWNlX2lkLCBpbXBfZGF0YSlcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRjb2RlOiAyMDBcblx0XHRcdGRhdGE6IHt9XG5cdFx0fVxuXHRjYXRjaCBlXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogZS5lcnJvclxuXHRcdFx0ZGF0YTogeyBlcnJvcnM6IGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlIH1cblx0XHR9XG4gKi9cblxuTWV0ZW9yLm1ldGhvZHMoe1xuICAnaW1wb3J0X2FwcF9wYWNrYWdlJzogZnVuY3Rpb24oc3BhY2VfaWQsIGltcF9kYXRhKSB7XG4gICAgdmFyIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICByZXR1cm4gQ3JlYXRvci5pbXBvcnRfYXBwX3BhY2thZ2UodXNlcklkLCBzcGFjZV9pZCwgaW1wX2RhdGEpO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0XCJjcmVhdG9yLmxpc3R2aWV3c19vcHRpb25zXCI6IChvcHRpb25zKS0+XHJcblx0XHRpZiBvcHRpb25zPy5wYXJhbXM/LnJlZmVyZW5jZV90b1xyXG5cclxuXHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob3B0aW9ucy5wYXJhbXMucmVmZXJlbmNlX3RvKVxyXG5cclxuXHRcdFx0bmFtZV9maWVsZF9rZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVlcclxuXHJcblx0XHRcdHF1ZXJ5ID0ge31cclxuXHRcdFx0aWYgb3B0aW9ucy5wYXJhbXMuc3BhY2VcclxuXHRcdFx0XHRxdWVyeS5zcGFjZSA9IG9wdGlvbnMucGFyYW1zLnNwYWNlXHJcblxyXG5cdFx0XHRcdHNvcnQgPSBvcHRpb25zPy5zb3J0XHJcblxyXG5cdFx0XHRcdHNlbGVjdGVkID0gb3B0aW9ucz8uc2VsZWN0ZWQgfHwgW11cclxuXHJcblx0XHRcdFx0aWYgb3B0aW9ucy5zZWFyY2hUZXh0XHJcblx0XHRcdFx0XHRzZWFyY2hUZXh0UXVlcnkgPSB7fVxyXG5cdFx0XHRcdFx0c2VhcmNoVGV4dFF1ZXJ5W25hbWVfZmllbGRfa2V5XSA9IHskcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dH1cclxuXHJcblx0XHRcdFx0aWYgb3B0aW9ucz8udmFsdWVzPy5sZW5ndGhcclxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxyXG5cdFx0XHRcdFx0XHRxdWVyeS4kb3IgPSBbe19pZDogeyRpbjogb3B0aW9ucy52YWx1ZXN9fSwgc2VhcmNoVGV4dFF1ZXJ5LCB7b2JqZWN0X25hbWU6IHskcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dH19XVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRxdWVyeS4kb3IgPSBbe19pZDogeyRpbjogb3B0aW9ucy52YWx1ZXN9fV1cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcclxuXHRcdFx0XHRcdFx0Xy5leHRlbmQocXVlcnksIHskb3I6IFtzZWFyY2hUZXh0UXVlcnksICB7b2JqZWN0X25hbWU6IHskcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dH19XX0pXHJcblx0XHRcdFx0XHRxdWVyeS5faWQgPSB7JG5pbjogc2VsZWN0ZWR9XHJcblxyXG5cdFx0XHRcdGNvbGxlY3Rpb24gPSBvYmplY3QuZGJcclxuXHJcblx0XHRcdFx0aWYgb3B0aW9ucy5maWx0ZXJRdWVyeVxyXG5cdFx0XHRcdFx0Xy5leHRlbmQgcXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnlcclxuXHJcblx0XHRcdFx0cXVlcnlfb3B0aW9ucyA9IHtsaW1pdDogMTB9XHJcblxyXG5cdFx0XHRcdGlmIHNvcnQgJiYgXy5pc09iamVjdChzb3J0KVxyXG5cdFx0XHRcdFx0cXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydFxyXG5cclxuXHRcdFx0XHRpZiBjb2xsZWN0aW9uXHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0cmVjb3JkcyA9IGNvbGxlY3Rpb24uZmluZChxdWVyeSwgcXVlcnlfb3B0aW9ucykuZmV0Y2goKVxyXG5cdFx0XHRcdFx0XHRyZXN1bHRzID0gW11cclxuXHRcdFx0XHRcdFx0Xy5lYWNoIHJlY29yZHMsIChyZWNvcmQpLT5cclxuXHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlY29yZC5vYmplY3RfbmFtZSk/Lm5hbWUgfHwgXCJcIlxyXG5cdFx0XHRcdFx0XHRcdGlmICFfLmlzRW1wdHkob2JqZWN0X25hbWUpXHJcblx0XHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZSA9IFwiICgje29iamVjdF9uYW1lfSlcIlxyXG5cclxuXHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2hcclxuXHRcdFx0XHRcdFx0XHRcdGxhYmVsOiByZWNvcmRbbmFtZV9maWVsZF9rZXldICsgb2JqZWN0X25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlOiByZWNvcmQuX2lkXHJcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzXHJcblx0XHRcdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBlLm1lc3NhZ2UgKyBcIi0tPlwiICsgSlNPTi5zdHJpbmdpZnkob3B0aW9ucylcclxuXHRcdHJldHVybiBbXSAiLCJNZXRlb3IubWV0aG9kcyh7XG4gIFwiY3JlYXRvci5saXN0dmlld3Nfb3B0aW9uc1wiOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGUsIG5hbWVfZmllbGRfa2V5LCBvYmplY3QsIHF1ZXJ5LCBxdWVyeV9vcHRpb25zLCByZWNvcmRzLCByZWYsIHJlZjEsIHJlc3VsdHMsIHNlYXJjaFRleHRRdWVyeSwgc2VsZWN0ZWQsIHNvcnQ7XG4gICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYgPSBvcHRpb25zLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5yZWZlcmVuY2VfdG8gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9wdGlvbnMucGFyYW1zLnJlZmVyZW5jZV90byk7XG4gICAgICBuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgICAgIHF1ZXJ5ID0ge307XG4gICAgICBpZiAob3B0aW9ucy5wYXJhbXMuc3BhY2UpIHtcbiAgICAgICAgcXVlcnkuc3BhY2UgPSBvcHRpb25zLnBhcmFtcy5zcGFjZTtcbiAgICAgICAgc29ydCA9IG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc29ydCA6IHZvaWQgMDtcbiAgICAgICAgc2VsZWN0ZWQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zZWxlY3RlZCA6IHZvaWQgMCkgfHwgW107XG4gICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICBzZWFyY2hUZXh0UXVlcnkgPSB7fTtcbiAgICAgICAgICBzZWFyY2hUZXh0UXVlcnlbbmFtZV9maWVsZF9rZXldID0ge1xuICAgICAgICAgICAgJHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zICE9IG51bGwgPyAocmVmMSA9IG9wdGlvbnMudmFsdWVzKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sIHNlYXJjaFRleHRRdWVyeSwge1xuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiB7XG4gICAgICAgICAgICAgICAgICAkcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcXVlcnkuJG9yID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAkaW46IG9wdGlvbnMudmFsdWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBfLmV4dGVuZChxdWVyeSwge1xuICAgICAgICAgICAgICAkb3I6IFtcbiAgICAgICAgICAgICAgICBzZWFyY2hUZXh0UXVlcnksIHtcbiAgICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiB7XG4gICAgICAgICAgICAgICAgICAgICRyZWdleDogb3B0aW9ucy5zZWFyY2hUZXh0XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcXVlcnkuX2lkID0ge1xuICAgICAgICAgICAgJG5pbjogc2VsZWN0ZWRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbGxlY3Rpb24gPSBvYmplY3QuZGI7XG4gICAgICAgIGlmIChvcHRpb25zLmZpbHRlclF1ZXJ5KSB7XG4gICAgICAgICAgXy5leHRlbmQocXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnkpO1xuICAgICAgICB9XG4gICAgICAgIHF1ZXJ5X29wdGlvbnMgPSB7XG4gICAgICAgICAgbGltaXQ6IDEwXG4gICAgICAgIH07XG4gICAgICAgIGlmIChzb3J0ICYmIF8uaXNPYmplY3Qoc29ydCkpIHtcbiAgICAgICAgICBxdWVyeV9vcHRpb25zLnNvcnQgPSBzb3J0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlY29yZHMgPSBjb2xsZWN0aW9uLmZpbmQocXVlcnksIHF1ZXJ5X29wdGlvbnMpLmZldGNoKCk7XG4gICAgICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgICAgICBfLmVhY2gocmVjb3JkcywgZnVuY3Rpb24ocmVjb3JkKSB7XG4gICAgICAgICAgICAgIHZhciBvYmplY3RfbmFtZSwgcmVmMjtcbiAgICAgICAgICAgICAgb2JqZWN0X25hbWUgPSAoKHJlZjIgPSBDcmVhdG9yLmdldE9iamVjdChyZWNvcmQub2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmMi5uYW1lIDogdm9pZCAwKSB8fCBcIlwiO1xuICAgICAgICAgICAgICBpZiAoIV8uaXNFbXB0eShvYmplY3RfbmFtZSkpIHtcbiAgICAgICAgICAgICAgICBvYmplY3RfbmFtZSA9IFwiIChcIiArIG9iamVjdF9uYW1lICsgXCIpXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICAgICAgbGFiZWw6IHJlY29yZFtuYW1lX2ZpZWxkX2tleV0gKyBvYmplY3RfbmFtZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVjb3JkLl9pZFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlLm1lc3NhZ2UgKyBcIi0tPlwiICsgSlNPTi5zdHJpbmdpZnkob3B0aW9ucykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cbn0pO1xuIiwiI+iOt+WPluW6lOeUqOS4i+eahOWvueixoVxyXG5nZXRBcHBPYmplY3RzID0gKGFwcCktPlxyXG5cdGFwcE9iamVjdHMgPSBbXVxyXG5cdGlmIGFwcCAmJiBfLmlzQXJyYXkoYXBwLm9iamVjdHMpICYmIGFwcC5vYmplY3RzLmxlbmd0aCA+IDBcclxuXHRcdF8uZWFjaCBhcHAub2JqZWN0cywgKG9iamVjdF9uYW1lKS0+XHJcblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdFx0XHRpZiBvYmplY3RcclxuXHRcdFx0XHRhcHBPYmplY3RzLnB1c2ggb2JqZWN0X25hbWVcclxuXHRyZXR1cm4gYXBwT2JqZWN0c1xyXG5cclxuI+iOt+WPluWvueixoeS4i+eahOWIl+ihqOinhuWbvlxyXG5nZXRPYmplY3RzTGlzdFZpZXdzID0gKHNwYWNlX2lkLCBvYmplY3RzX25hbWUpLT5cclxuXHRvYmplY3RzTGlzdFZpZXdzID0gW11cclxuXHRpZiBvYmplY3RzX25hbWUgJiYgXy5pc0FycmF5KG9iamVjdHNfbmFtZSkgJiYgb2JqZWN0c19uYW1lLmxlbmd0aCA+IDBcclxuXHRcdF8uZWFjaCBvYmplY3RzX25hbWUsIChvYmplY3RfbmFtZSktPlxyXG5cdFx0XHQj6I635Y+W5a+56LGh55qE5YWx5Lqr5YiX6KGo6KeG5Zu+bGlzdF92aWV3c1xyXG5cdFx0XHRsaXN0X3ZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNwYWNlOiBzcGFjZV9pZCwgc2hhcmVkOiB0cnVlfSwge2ZpZWxkczoge19pZDogMX19KVxyXG5cdFx0XHRsaXN0X3ZpZXdzLmZvckVhY2ggKGxpc3RfdmlldyktPlxyXG5cdFx0XHRcdG9iamVjdHNMaXN0Vmlld3MucHVzaCBsaXN0X3ZpZXcuX2lkXHJcblx0cmV0dXJuIG9iamVjdHNMaXN0Vmlld3NcclxuXHJcbiPojrflj5blr7nosaHkuIvnmoTmiqXooahcclxuZ2V0T2JqZWN0c1JlcG9ydHMgPSAoc3BhY2VfaWQsIG9iamVjdHNfbmFtZSktPlxyXG5cdG9iamVjdHNSZXBvcnRzID0gW11cclxuXHRpZiBvYmplY3RzX25hbWUgJiYgXy5pc0FycmF5KG9iamVjdHNfbmFtZSkgJiYgb2JqZWN0c19uYW1lLmxlbmd0aCA+IDBcclxuXHRcdF8uZWFjaCBvYmplY3RzX25hbWUsIChvYmplY3RfbmFtZSktPlxyXG5cdFx0XHQj6I635Y+W5a+56LGh55qE5oql6KGocmVwb3J0c1xyXG5cdFx0XHRyZXBvcnRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicmVwb3J0c1wiKS5maW5kKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNwYWNlOiBzcGFjZV9pZH0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcclxuXHRcdFx0cmVwb3J0cy5mb3JFYWNoIChyZXBvcnQpLT5cclxuXHRcdFx0XHRvYmplY3RzUmVwb3J0cy5wdXNoIHJlcG9ydC5faWRcclxuXHRyZXR1cm4gb2JqZWN0c1JlcG9ydHNcclxuXHJcbiPojrflj5blr7nosaHkuIvnmoTmnYPpmZDpm4ZcclxuZ2V0T2JqZWN0c1Blcm1pc3Npb25PYmplY3RzID0gKHNwYWNlX2lkLCBvYmplY3RzX25hbWUpLT5cclxuXHRvYmplY3RzUGVybWlzc2lvbk9iamVjdHMgPSBbXVxyXG5cdGlmIG9iamVjdHNfbmFtZSAmJiBfLmlzQXJyYXkob2JqZWN0c19uYW1lKSAmJiBvYmplY3RzX25hbWUubGVuZ3RoID4gMFxyXG5cdFx0Xy5lYWNoIG9iamVjdHNfbmFtZSwgKG9iamVjdF9uYW1lKS0+XHJcblx0XHRcdHBlcm1pc3Npb25fb2JqZWN0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNwYWNlOiBzcGFjZV9pZH0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcclxuXHRcdFx0cGVybWlzc2lvbl9vYmplY3RzLmZvckVhY2ggKHBlcm1pc3Npb25fb2JqZWN0KS0+XHJcblx0XHRcdFx0b2JqZWN0c1Blcm1pc3Npb25PYmplY3RzLnB1c2ggcGVybWlzc2lvbl9vYmplY3QuX2lkXHJcblx0cmV0dXJuIG9iamVjdHNQZXJtaXNzaW9uT2JqZWN0c1xyXG5cclxuI+iOt+WPluWvueixoeS4i+adg+mZkOmbhuWvueW6lOeahOadg+mZkOmbhlxyXG5nZXRPYmplY3RzUGVybWlzc2lvblNldCA9IChzcGFjZV9pZCwgb2JqZWN0c19uYW1lKS0+XHJcblx0b2JqZWN0c1Blcm1pc3Npb25TZXQgPSBbXVxyXG5cdGlmIG9iamVjdHNfbmFtZSAmJiBfLmlzQXJyYXkob2JqZWN0c19uYW1lKSAmJiBvYmplY3RzX25hbWUubGVuZ3RoID4gMFxyXG5cdFx0Xy5lYWNoIG9iamVjdHNfbmFtZSwgKG9iamVjdF9uYW1lKS0+XHJcblx0XHRcdHBlcm1pc3Npb25fb2JqZWN0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNwYWNlOiBzcGFjZV9pZH0sIHtmaWVsZHM6IHtwZXJtaXNzaW9uX3NldF9pZDogMX19KVxyXG5cdFx0XHRwZXJtaXNzaW9uX29iamVjdHMuZm9yRWFjaCAocGVybWlzc2lvbl9vYmplY3QpLT5cclxuXHRcdFx0XHRwZXJtaXNzaW9uX3NldCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe19pZDogcGVybWlzc2lvbl9vYmplY3QucGVybWlzc2lvbl9zZXRfaWR9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXHJcblx0XHRcdFx0b2JqZWN0c1Blcm1pc3Npb25TZXQucHVzaCBwZXJtaXNzaW9uX3NldC5faWRcclxuXHRyZXR1cm4gb2JqZWN0c1Blcm1pc3Npb25TZXRcclxuXHJcblxyXG5NZXRlb3IubWV0aG9kc1xyXG5cdFwiYXBwUGFja2FnZS5pbml0X2V4cG9ydF9kYXRhXCI6IChzcGFjZV9pZCwgcmVjb3JkX2lkKS0+XHJcblx0XHR1c2VySWQgPSB0aGlzLnVzZXJJZFxyXG5cdFx0aWYgIXVzZXJJZFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNDAxXCIsIFwiQXV0aGVudGljYXRpb24gaXMgcmVxdWlyZWQgYW5kIGhhcyBub3QgYmVlbiBwcm92aWRlZC5cIilcclxuXHJcblx0XHRpZiAhQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIHVzZXJJZClcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjQwMVwiLCBcIlBlcm1pc3Npb24gZGVuaWVkLlwiKVxyXG5cclxuXHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImFwcGxpY2F0aW9uX3BhY2thZ2VcIikuZmluZE9uZSh7X2lkOiByZWNvcmRfaWR9KVxyXG5cclxuXHRcdGlmICghXy5pc0FycmF5KHJlY29yZD8uYXBwcykgfHwgcmVjb3JkPy5hcHBzPy5sZW5ndGggPCAxKSAmJiAoIV8uaXNBcnJheShyZWNvcmQ/Lm9iamVjdHMpIHx8IHJlY29yZD8ub2JqZWN0cz8ubGVuZ3RoIDwgMSlcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBcIuivt+WFiOmAieaLqeW6lOeUqOaIluiAheWvueixoVwiKVxyXG5cclxuXHRcdGRhdGEgPSB7fVxyXG5cdFx0X29iamVjdHMgPSByZWNvcmQub2JqZWN0cyB8fCBbXVxyXG5cdFx0X29iamVjdHNfbGlzdF92aWV3cyA9IHJlY29yZC5saXN0X3ZpZXdzIHx8IFtdXHJcblx0XHRfb2JqZWN0c19yZXBvcnRzID0gcmVjb3JkLnJlcG9ydHMgfHwgW11cclxuXHRcdF9vYmplY3RzX3Blcm1pc3Npb25fb2JqZWN0cyA9IHJlY29yZC5wZXJtaXNzaW9uX29iamVjdHMgfHwgW11cclxuXHRcdF9vYmplY3RzX3Blcm1pc3Npb25fc2V0ID0gcmVjb3JkLnBlcm1pc3Npb25fc2V0IHx8IFtdXHJcblxyXG5cdFx0dHJ5XHJcblx0XHRcdGlmIF8uaXNBcnJheShyZWNvcmQ/LmFwcHMpICYmIHJlY29yZC5hcHBzLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRfLmVhY2ggcmVjb3JkLmFwcHMsIChhcHBJZCktPlxyXG5cdFx0XHRcdFx0aWYgIWFwcFxyXG5cdFx0XHRcdFx0XHQj5aaC5p6c5LuO5Luj56CB5Lit5a6a5LmJ55qEYXBwc+S4reayoeacieaJvuWIsO+8jOWImeS7juaVsOaNruW6k+S4reiOt+WPllxyXG5cdFx0XHRcdFx0XHRhcHAgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBzXCIpLmZpbmRPbmUoe19pZDogYXBwSWQsIGlzX2NyZWF0b3I6IHRydWV9LCB7ZmllbGRzOiB7b2JqZWN0czogMX19KVxyXG5cdFx0XHRcdFx0X29iamVjdHMgPSBfb2JqZWN0cy5jb25jYXQoZ2V0QXBwT2JqZWN0cyhhcHApKVxyXG5cclxuXHRcdFx0aWYgXy5pc0FycmF5KF9vYmplY3RzKSAmJiBfb2JqZWN0cy5sZW5ndGggPiAwXHJcblx0XHRcdFx0X29iamVjdHNfbGlzdF92aWV3cyA9IF9vYmplY3RzX2xpc3Rfdmlld3MuY29uY2F0KGdldE9iamVjdHNMaXN0Vmlld3Moc3BhY2VfaWQsIF9vYmplY3RzKSlcclxuXHRcdFx0XHRfb2JqZWN0c19yZXBvcnRzID0gX29iamVjdHNfcmVwb3J0cy5jb25jYXQoZ2V0T2JqZWN0c1JlcG9ydHMoc3BhY2VfaWQsIF9vYmplY3RzKSlcclxuXHRcdFx0XHRfb2JqZWN0c19wZXJtaXNzaW9uX29iamVjdHMgPSBfb2JqZWN0c19wZXJtaXNzaW9uX29iamVjdHMuY29uY2F0KGdldE9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cyhzcGFjZV9pZCwgX29iamVjdHMpKVxyXG5cdFx0XHRcdF9vYmplY3RzX3Blcm1pc3Npb25fc2V0ID0gX29iamVjdHNfcGVybWlzc2lvbl9zZXQuY29uY2F0KGdldE9iamVjdHNQZXJtaXNzaW9uU2V0KHNwYWNlX2lkLCBfb2JqZWN0cykpXHJcblxyXG5cdFx0XHRcdGRhdGEub2JqZWN0cyA9IF8udW5pcSBfb2JqZWN0c1xyXG5cdFx0XHRcdGRhdGEubGlzdF92aWV3cyA9IF8udW5pcSBfb2JqZWN0c19saXN0X3ZpZXdzXHJcblx0XHRcdFx0ZGF0YS5wZXJtaXNzaW9uX3NldCA9IF8udW5pcSBfb2JqZWN0c19wZXJtaXNzaW9uX3NldFxyXG5cdFx0XHRcdGRhdGEucGVybWlzc2lvbl9vYmplY3RzID0gXy51bmlxIF9vYmplY3RzX3Blcm1pc3Npb25fb2JqZWN0c1xyXG5cdFx0XHRcdGRhdGEucmVwb3J0cyA9IF8udW5pcSBfb2JqZWN0c19yZXBvcnRzXHJcblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwbGljYXRpb25fcGFja2FnZVwiKS51cGRhdGUoe19pZDogcmVjb3JkLl9pZH0seyRzZXQ6IGRhdGF9KVxyXG5cdFx0Y2F0Y2ggZVxyXG5cdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjUwMFwiLCBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgKSIsInZhciBnZXRBcHBPYmplY3RzLCBnZXRPYmplY3RzTGlzdFZpZXdzLCBnZXRPYmplY3RzUGVybWlzc2lvbk9iamVjdHMsIGdldE9iamVjdHNQZXJtaXNzaW9uU2V0LCBnZXRPYmplY3RzUmVwb3J0cztcblxuZ2V0QXBwT2JqZWN0cyA9IGZ1bmN0aW9uKGFwcCkge1xuICB2YXIgYXBwT2JqZWN0cztcbiAgYXBwT2JqZWN0cyA9IFtdO1xuICBpZiAoYXBwICYmIF8uaXNBcnJheShhcHAub2JqZWN0cykgJiYgYXBwLm9iamVjdHMubGVuZ3RoID4gMCkge1xuICAgIF8uZWFjaChhcHAub2JqZWN0cywgZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICAgIHZhciBvYmplY3Q7XG4gICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBhcHBPYmplY3RzLnB1c2gob2JqZWN0X25hbWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBhcHBPYmplY3RzO1xufTtcblxuZ2V0T2JqZWN0c0xpc3RWaWV3cyA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBvYmplY3RzX25hbWUpIHtcbiAgdmFyIG9iamVjdHNMaXN0Vmlld3M7XG4gIG9iamVjdHNMaXN0Vmlld3MgPSBbXTtcbiAgaWYgKG9iamVjdHNfbmFtZSAmJiBfLmlzQXJyYXkob2JqZWN0c19uYW1lKSAmJiBvYmplY3RzX25hbWUubGVuZ3RoID4gMCkge1xuICAgIF8uZWFjaChvYmplY3RzX25hbWUsIGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgICB2YXIgbGlzdF92aWV3cztcbiAgICAgIGxpc3Rfdmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgc2hhcmVkOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBsaXN0X3ZpZXdzLmZvckVhY2goZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gICAgICAgIHJldHVybiBvYmplY3RzTGlzdFZpZXdzLnB1c2gobGlzdF92aWV3Ll9pZCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb2JqZWN0c0xpc3RWaWV3cztcbn07XG5cbmdldE9iamVjdHNSZXBvcnRzID0gZnVuY3Rpb24oc3BhY2VfaWQsIG9iamVjdHNfbmFtZSkge1xuICB2YXIgb2JqZWN0c1JlcG9ydHM7XG4gIG9iamVjdHNSZXBvcnRzID0gW107XG4gIGlmIChvYmplY3RzX25hbWUgJiYgXy5pc0FycmF5KG9iamVjdHNfbmFtZSkgJiYgb2JqZWN0c19uYW1lLmxlbmd0aCA+IDApIHtcbiAgICBfLmVhY2gob2JqZWN0c19uYW1lLCBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgICAgdmFyIHJlcG9ydHM7XG4gICAgICByZXBvcnRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicmVwb3J0c1wiKS5maW5kKHtcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcG9ydHMuZm9yRWFjaChmdW5jdGlvbihyZXBvcnQpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdHNSZXBvcnRzLnB1c2gocmVwb3J0Ll9pZCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb2JqZWN0c1JlcG9ydHM7XG59O1xuXG5nZXRPYmplY3RzUGVybWlzc2lvbk9iamVjdHMgPSBmdW5jdGlvbihzcGFjZV9pZCwgb2JqZWN0c19uYW1lKSB7XG4gIHZhciBvYmplY3RzUGVybWlzc2lvbk9iamVjdHM7XG4gIG9iamVjdHNQZXJtaXNzaW9uT2JqZWN0cyA9IFtdO1xuICBpZiAob2JqZWN0c19uYW1lICYmIF8uaXNBcnJheShvYmplY3RzX25hbWUpICYmIG9iamVjdHNfbmFtZS5sZW5ndGggPiAwKSB7XG4gICAgXy5lYWNoKG9iamVjdHNfbmFtZSwgZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICAgIHZhciBwZXJtaXNzaW9uX29iamVjdHM7XG4gICAgICBwZXJtaXNzaW9uX29iamVjdHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwZXJtaXNzaW9uX29iamVjdHMuZm9yRWFjaChmdW5jdGlvbihwZXJtaXNzaW9uX29iamVjdCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0c1Blcm1pc3Npb25PYmplY3RzLnB1c2gocGVybWlzc2lvbl9vYmplY3QuX2lkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3RzUGVybWlzc2lvbk9iamVjdHM7XG59O1xuXG5nZXRPYmplY3RzUGVybWlzc2lvblNldCA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBvYmplY3RzX25hbWUpIHtcbiAgdmFyIG9iamVjdHNQZXJtaXNzaW9uU2V0O1xuICBvYmplY3RzUGVybWlzc2lvblNldCA9IFtdO1xuICBpZiAob2JqZWN0c19uYW1lICYmIF8uaXNBcnJheShvYmplY3RzX25hbWUpICYmIG9iamVjdHNfbmFtZS5sZW5ndGggPiAwKSB7XG4gICAgXy5lYWNoKG9iamVjdHNfbmFtZSwgZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICAgIHZhciBwZXJtaXNzaW9uX29iamVjdHM7XG4gICAgICBwZXJtaXNzaW9uX29iamVjdHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHBlcm1pc3Npb25fb2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0KSB7XG4gICAgICAgIHZhciBwZXJtaXNzaW9uX3NldDtcbiAgICAgICAgcGVybWlzc2lvbl9zZXQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgICAgICBfaWQ6IHBlcm1pc3Npb25fb2JqZWN0LnBlcm1pc3Npb25fc2V0X2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvYmplY3RzUGVybWlzc2lvblNldC5wdXNoKHBlcm1pc3Npb25fc2V0Ll9pZCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb2JqZWN0c1Blcm1pc3Npb25TZXQ7XG59O1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gIFwiYXBwUGFja2FnZS5pbml0X2V4cG9ydF9kYXRhXCI6IGZ1bmN0aW9uKHNwYWNlX2lkLCByZWNvcmRfaWQpIHtcbiAgICB2YXIgX29iamVjdHMsIF9vYmplY3RzX2xpc3Rfdmlld3MsIF9vYmplY3RzX3Blcm1pc3Npb25fb2JqZWN0cywgX29iamVjdHNfcGVybWlzc2lvbl9zZXQsIF9vYmplY3RzX3JlcG9ydHMsIGRhdGEsIGUsIHJlY29yZCwgcmVmLCByZWYxLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI0MDFcIiwgXCJBdXRoZW50aWNhdGlvbiBpcyByZXF1aXJlZCBhbmQgaGFzIG5vdCBiZWVuIHByb3ZpZGVkLlwiKTtcbiAgICB9XG4gICAgaWYgKCFDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgdXNlcklkKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIjQwMVwiLCBcIlBlcm1pc3Npb24gZGVuaWVkLlwiKTtcbiAgICB9XG4gICAgcmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwbGljYXRpb25fcGFja2FnZVwiKS5maW5kT25lKHtcbiAgICAgIF9pZDogcmVjb3JkX2lkXG4gICAgfSk7XG4gICAgaWYgKCghXy5pc0FycmF5KHJlY29yZCAhPSBudWxsID8gcmVjb3JkLmFwcHMgOiB2b2lkIDApIHx8IChyZWNvcmQgIT0gbnVsbCA/IChyZWYgPSByZWNvcmQuYXBwcykgIT0gbnVsbCA/IHJlZi5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIDwgMSkgJiYgKCFfLmlzQXJyYXkocmVjb3JkICE9IG51bGwgPyByZWNvcmQub2JqZWN0cyA6IHZvaWQgMCkgfHwgKHJlY29yZCAhPSBudWxsID8gKHJlZjEgPSByZWNvcmQub2JqZWN0cykgIT0gbnVsbCA/IHJlZjEubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSA8IDEpKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiNTAwXCIsIFwi6K+35YWI6YCJ5oup5bqU55So5oiW6ICF5a+56LGhXCIpO1xuICAgIH1cbiAgICBkYXRhID0ge307XG4gICAgX29iamVjdHMgPSByZWNvcmQub2JqZWN0cyB8fCBbXTtcbiAgICBfb2JqZWN0c19saXN0X3ZpZXdzID0gcmVjb3JkLmxpc3Rfdmlld3MgfHwgW107XG4gICAgX29iamVjdHNfcmVwb3J0cyA9IHJlY29yZC5yZXBvcnRzIHx8IFtdO1xuICAgIF9vYmplY3RzX3Blcm1pc3Npb25fb2JqZWN0cyA9IHJlY29yZC5wZXJtaXNzaW9uX29iamVjdHMgfHwgW107XG4gICAgX29iamVjdHNfcGVybWlzc2lvbl9zZXQgPSByZWNvcmQucGVybWlzc2lvbl9zZXQgfHwgW107XG4gICAgdHJ5IHtcbiAgICAgIGlmIChfLmlzQXJyYXkocmVjb3JkICE9IG51bGwgPyByZWNvcmQuYXBwcyA6IHZvaWQgMCkgJiYgcmVjb3JkLmFwcHMubGVuZ3RoID4gMCkge1xuICAgICAgICBfLmVhY2gocmVjb3JkLmFwcHMsIGZ1bmN0aW9uKGFwcElkKSB7XG4gICAgICAgICAgdmFyIGFwcDtcbiAgICAgICAgICBpZiAoIWFwcCkge1xuICAgICAgICAgICAgYXBwID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwc1wiKS5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiBhcHBJZCxcbiAgICAgICAgICAgICAgaXNfY3JlYXRvcjogdHJ1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBvYmplY3RzOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX29iamVjdHMgPSBfb2JqZWN0cy5jb25jYXQoZ2V0QXBwT2JqZWN0cyhhcHApKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoXy5pc0FycmF5KF9vYmplY3RzKSAmJiBfb2JqZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIF9vYmplY3RzX2xpc3Rfdmlld3MgPSBfb2JqZWN0c19saXN0X3ZpZXdzLmNvbmNhdChnZXRPYmplY3RzTGlzdFZpZXdzKHNwYWNlX2lkLCBfb2JqZWN0cykpO1xuICAgICAgICBfb2JqZWN0c19yZXBvcnRzID0gX29iamVjdHNfcmVwb3J0cy5jb25jYXQoZ2V0T2JqZWN0c1JlcG9ydHMoc3BhY2VfaWQsIF9vYmplY3RzKSk7XG4gICAgICAgIF9vYmplY3RzX3Blcm1pc3Npb25fb2JqZWN0cyA9IF9vYmplY3RzX3Blcm1pc3Npb25fb2JqZWN0cy5jb25jYXQoZ2V0T2JqZWN0c1Blcm1pc3Npb25PYmplY3RzKHNwYWNlX2lkLCBfb2JqZWN0cykpO1xuICAgICAgICBfb2JqZWN0c19wZXJtaXNzaW9uX3NldCA9IF9vYmplY3RzX3Blcm1pc3Npb25fc2V0LmNvbmNhdChnZXRPYmplY3RzUGVybWlzc2lvblNldChzcGFjZV9pZCwgX29iamVjdHMpKTtcbiAgICAgICAgZGF0YS5vYmplY3RzID0gXy51bmlxKF9vYmplY3RzKTtcbiAgICAgICAgZGF0YS5saXN0X3ZpZXdzID0gXy51bmlxKF9vYmplY3RzX2xpc3Rfdmlld3MpO1xuICAgICAgICBkYXRhLnBlcm1pc3Npb25fc2V0ID0gXy51bmlxKF9vYmplY3RzX3Blcm1pc3Npb25fc2V0KTtcbiAgICAgICAgZGF0YS5wZXJtaXNzaW9uX29iamVjdHMgPSBfLnVuaXEoX29iamVjdHNfcGVybWlzc2lvbl9vYmplY3RzKTtcbiAgICAgICAgZGF0YS5yZXBvcnRzID0gXy51bmlxKF9vYmplY3RzX3JlcG9ydHMpO1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXBwbGljYXRpb25fcGFja2FnZVwiKS51cGRhdGUoe1xuICAgICAgICAgIF9pZDogcmVjb3JkLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDogZGF0YVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCI1MDBcIiwgZS5yZWFzb24gfHwgZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiQEFQVHJhbnNmb3JtID0ge31cclxuXHJcbmlnbm9yZV9maWVsZHMgPSB7XHJcblx0b3duZXI6IDAsXHJcblx0c3BhY2U6IDAsXHJcblx0Y3JlYXRlZDogMCxcclxuXHRjcmVhdGVkX2J5OiAwLFxyXG5cdG1vZGlmaWVkOiAwLFxyXG5cdG1vZGlmaWVkX2J5OiAwLFxyXG5cdGlzX2RlbGV0ZWQ6IDAsXHJcblx0aW5zdGFuY2VzOiAwLFxyXG5cdHNoYXJpbmc6IDBcclxufVxyXG5cclxuQVBUcmFuc2Zvcm0uZXhwb3J0T2JqZWN0ID0gKG9iamVjdCktPlxyXG5cdF9vYmogPSB7fVxyXG5cclxuXHRfLmV4dGVuZChfb2JqICwgb2JqZWN0KVxyXG5cclxuXHRvYmpfbGlzdF92aWV3cyA9IHt9XHJcblxyXG5cdF8uZXh0ZW5kKG9ial9saXN0X3ZpZXdzLCBfb2JqLmxpc3Rfdmlld3MgfHwge30pXHJcblxyXG5cdF8uZWFjaCBvYmpfbGlzdF92aWV3cywgKHYsIGspLT5cclxuXHRcdGlmICFfLmhhcyh2LCBcIl9pZFwiKVxyXG5cdFx0XHR2Ll9pZCA9IGtcclxuXHRcdGlmICFfLmhhcyh2LCBcIm5hbWVcIilcclxuXHRcdFx0di5uYW1lID0ga1xyXG5cdF9vYmoubGlzdF92aWV3cyA9IG9ial9saXN0X3ZpZXdzXHJcblxyXG5cclxuXHQj5Y+q5L+u5pS5X29iauWxnuaAp+WOn29iamVjdOWxnuaAp+S/neaMgeS4jeWPmFxyXG5cdHRyaWdnZXJzID0ge31cclxuXHRfLmZvckVhY2ggX29iai50cmlnZ2VycywgKHRyaWdnZXIsIGtleSktPlxyXG5cdFx0X3RyaWdnZXIgPSB7fVxyXG5cdFx0Xy5leHRlbmQoX3RyaWdnZXIsIHRyaWdnZXIpXHJcblx0XHRpZiBfLmlzRnVuY3Rpb24oX3RyaWdnZXIudG9kbylcclxuXHRcdFx0X3RyaWdnZXIudG9kbyA9IF90cmlnZ2VyLnRvZG8udG9TdHJpbmcoKVxyXG5cdFx0ZGVsZXRlIF90cmlnZ2VyLl90b2RvXHJcblx0XHR0cmlnZ2Vyc1trZXldID0gX3RyaWdnZXJcclxuXHRfb2JqLnRyaWdnZXJzID0gdHJpZ2dlcnNcclxuXHJcblx0YWN0aW9ucyA9IHt9XHJcblx0Xy5mb3JFYWNoIF9vYmouYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XHJcblx0XHRfYWN0aW9uID0ge31cclxuXHRcdF8uZXh0ZW5kKF9hY3Rpb24sIGFjdGlvbilcclxuXHRcdGlmIF8uaXNGdW5jdGlvbihfYWN0aW9uLnRvZG8pXHJcblx0XHRcdF9hY3Rpb24udG9kbyA9IF9hY3Rpb24udG9kby50b1N0cmluZygpXHJcblx0XHRkZWxldGUgX2FjdGlvbi5fdG9kb1xyXG5cdFx0YWN0aW9uc1trZXldID0gX2FjdGlvblxyXG5cclxuXHRfb2JqLmFjdGlvbnMgPSBhY3Rpb25zXHJcblxyXG5cdGZpZWxkcyA9IHt9XHJcblx0Xy5mb3JFYWNoIF9vYmouZmllbGRzLCAoZmllbGQsIGtleSktPlxyXG5cdFx0X2ZpZWxkID0ge31cclxuXHRcdF8uZXh0ZW5kKF9maWVsZCwgZmllbGQpXHJcblx0XHRpZiBfLmlzRnVuY3Rpb24oX2ZpZWxkLm9wdGlvbnMpXHJcblx0XHRcdF9maWVsZC5vcHRpb25zID0gX2ZpZWxkLm9wdGlvbnMudG9TdHJpbmcoKVxyXG5cdFx0XHRkZWxldGUgX2ZpZWxkLl9vcHRpb25zXHJcblxyXG5cdFx0aWYgXy5pc0FycmF5KF9maWVsZC5vcHRpb25zKVxyXG5cdFx0XHRfZm8gPSBbXVxyXG5cdFx0XHRfLmZvckVhY2ggX2ZpZWxkLm9wdGlvbnMsIChfbzEpLT5cclxuXHRcdFx0XHRfZm8ucHVzaChcIiN7X28xLmxhYmVsfToje19vMS52YWx1ZX1cIilcclxuXHRcdFx0X2ZpZWxkLm9wdGlvbnMgPSBfZm8uam9pbihcIixcIilcclxuXHRcdFx0ZGVsZXRlIF9maWVsZC5fb3B0aW9uc1xyXG5cclxuXHRcdGlmIF9maWVsZC5yZWdFeFxyXG5cdFx0XHRfZmllbGQucmVnRXggPSBfZmllbGQucmVnRXgudG9TdHJpbmcoKVxyXG5cdFx0XHRkZWxldGUgX2ZpZWxkLl9yZWdFeFxyXG5cclxuXHRcdGlmIF8uaXNGdW5jdGlvbihfZmllbGQub3B0aW9uc0Z1bmN0aW9uKVxyXG5cdFx0XHRfZmllbGQub3B0aW9uc0Z1bmN0aW9uID0gX2ZpZWxkLm9wdGlvbnNGdW5jdGlvbi50b1N0cmluZygpXHJcblx0XHRcdGRlbGV0ZSBfZmllbGQuX29wdGlvbnNGdW5jdGlvblxyXG5cclxuXHRcdGlmIF8uaXNGdW5jdGlvbihfZmllbGQucmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRfZmllbGQucmVmZXJlbmNlX3RvID0gX2ZpZWxkLnJlZmVyZW5jZV90by50b1N0cmluZygpXHJcblx0XHRcdGRlbGV0ZSBfZmllbGQuX3JlZmVyZW5jZV90b1xyXG5cclxuXHRcdGlmIF8uaXNGdW5jdGlvbihfZmllbGQuY3JlYXRlRnVuY3Rpb24pXHJcblx0XHRcdF9maWVsZC5jcmVhdGVGdW5jdGlvbiA9IF9maWVsZC5jcmVhdGVGdW5jdGlvbi50b1N0cmluZygpXHJcblx0XHRcdGRlbGV0ZSBfZmllbGQuX2NyZWF0ZUZ1bmN0aW9uXHJcblxyXG5cdFx0aWYgXy5pc0Z1bmN0aW9uKF9maWVsZC5kZWZhdWx0VmFsdWUpXHJcblx0XHRcdF9maWVsZC5kZWZhdWx0VmFsdWUgPSBfZmllbGQuZGVmYXVsdFZhbHVlLnRvU3RyaW5nKClcclxuXHRcdFx0ZGVsZXRlIF9maWVsZC5fZGVmYXVsdFZhbHVlXHJcblx0XHQjVE9ETyDovazmjaJmaWVsZC5hdXRvZm9ybS50eXBl77yM5bey5ZKM5pyx5oCd5ZiJ56Gu6K6k77yM55uu5YmN5LiN5pSv5oyBYXV0b2Zvcm0udHlwZSDkuLpmdW5jdGlvbuexu+Wei1xyXG5cdFx0ZmllbGRzW2tleV0gPSBfZmllbGRcclxuXHJcblx0X29iai5maWVsZHMgPSBmaWVsZHNcclxuXHJcblx0cmV0dXJuIF9vYmpcclxuXHJcbiMjI1xyXG7lr7zlh7rmlbDmja46XHJcbntcclxuXHRhcHBzOlt7fV0sIOi9r+S7tuWMhemAieS4reeahGFwcHNcclxuXHRvYmplY3RzOlt7fV0sIOmAieS4reeahG9iamVjdOWPiuWFtmZpZWxkcywgbGlzdF92aWV3cywgdHJpZ2dlcnMsIGFjdGlvbnMsIHBlcm1pc3Npb25fc2V0562JXHJcbiAgICBsaXN0X3ZpZXdzOlt7fV0sIOi9r+S7tuWMhemAieS4reeahGxpc3Rfdmlld3NcclxuICAgIHBlcm1pc3Npb25zOlt7fV0sIOi9r+S7tuWMhemAieS4reeahOadg+mZkOmbhlxyXG4gICAgcGVybWlzc2lvbl9vYmplY3RzOlt7fV0sIOi9r+S7tuWMhemAieS4reeahOadg+mZkOWvueixoVxyXG4gICAgcmVwb3J0czpbe31dIOi9r+S7tuWMhemAieS4reeahOaKpeihqFxyXG59XHJcbiMjI1xyXG5BUFRyYW5zZm9ybS5leHBvcnQgPSAocmVjb3JkKS0+XHJcblx0ZXhwb3J0X2RhdGEgPSB7fVxyXG5cdGlmIF8uaXNBcnJheShyZWNvcmQuYXBwcykgJiYgcmVjb3JkLmFwcHMubGVuZ3RoID4gMFxyXG5cdFx0ZXhwb3J0X2RhdGEuYXBwcyA9IFtdXHJcblxyXG5cdFx0Xy5lYWNoIHJlY29yZC5hcHBzLCAoYXBwS2V5KS0+XHJcblx0XHRcdGFwcCA9IHt9XHJcblx0XHRcdF8uZXh0ZW5kKGFwcCwgQ3JlYXRvci5BcHBzW2FwcEtleV0pXHJcblx0XHRcdGlmICFhcHAgfHwgXy5pc0VtcHR5KGFwcClcclxuXHRcdFx0XHRhcHAgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhcHBzXCIpLmZpbmRPbmUoe19pZDogYXBwS2V5fSwge2ZpZWxkczogaWdub3JlX2ZpZWxkc30pXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiAhXy5oYXMoYXBwLCBcIl9pZFwiKVxyXG5cdFx0XHRcdFx0YXBwLl9pZCA9IGFwcEtleVxyXG5cdFx0XHRpZiBhcHBcclxuXHRcdFx0XHRleHBvcnRfZGF0YS5hcHBzLnB1c2ggYXBwXHJcblxyXG5cdGlmIF8uaXNBcnJheShyZWNvcmQub2JqZWN0cykgJiYgcmVjb3JkLm9iamVjdHMubGVuZ3RoID4gMFxyXG5cdFx0ZXhwb3J0X2RhdGEub2JqZWN0cyA9IFtdXHJcblx0XHRfLmVhY2ggcmVjb3JkLm9iamVjdHMsIChvYmplY3RfbmFtZSktPlxyXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXHJcblx0XHRcdGlmIG9iamVjdFxyXG5cdFx0XHRcdGV4cG9ydF9kYXRhLm9iamVjdHMucHVzaCBBUFRyYW5zZm9ybS5leHBvcnRPYmplY3Qob2JqZWN0KVxyXG5cclxuXHRpZiBfLmlzQXJyYXkocmVjb3JkLmxpc3Rfdmlld3MpICYmIHJlY29yZC5saXN0X3ZpZXdzLmxlbmd0aCA+IDBcclxuXHRcdGV4cG9ydF9kYXRhLmxpc3Rfdmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe19pZDogeyRpbjogcmVjb3JkLmxpc3Rfdmlld3N9fSwge2ZpZWxkczogaWdub3JlX2ZpZWxkc30pLmZldGNoKClcclxuXHJcblx0aWYgXy5pc0FycmF5KHJlY29yZC5wZXJtaXNzaW9uX3NldCkgJiYgcmVjb3JkLnBlcm1pc3Npb25fc2V0Lmxlbmd0aCA+IDBcclxuXHRcdGV4cG9ydF9kYXRhLnBlcm1pc3Npb25fc2V0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7X2lkOiB7JGluOiByZWNvcmQucGVybWlzc2lvbl9zZXR9fSwge2ZpZWxkczogaWdub3JlX2ZpZWxkc30pLmZldGNoKClcclxuXHJcblx0aWYgXy5pc0FycmF5KHJlY29yZC5wZXJtaXNzaW9uX29iamVjdHMpICYmIHJlY29yZC5wZXJtaXNzaW9uX29iamVjdHMubGVuZ3RoID4gMFxyXG5cdFx0ZXhwb3J0X2RhdGEucGVybWlzc2lvbl9vYmplY3RzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe19pZDogeyRpbjogcmVjb3JkLnBlcm1pc3Npb25fb2JqZWN0c319LCB7ZmllbGRzOiBpZ25vcmVfZmllbGRzfSkuZmV0Y2goKVxyXG5cclxuXHRpZiBfLmlzQXJyYXkocmVjb3JkLnJlcG9ydHMpICYmIHJlY29yZC5yZXBvcnRzLmxlbmd0aCA+IDBcclxuXHRcdGV4cG9ydF9kYXRhLnJlcG9ydHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJyZXBvcnRzXCIpLmZpbmQoe19pZDogeyRpbjogcmVjb3JkLnJlcG9ydHN9fSwge2ZpZWxkczogaWdub3JlX2ZpZWxkc30pLmZldGNoKClcclxuXHJcblx0cmV0dXJuIGV4cG9ydF9kYXRhXHJcbiIsInZhciBpZ25vcmVfZmllbGRzO1xuXG50aGlzLkFQVHJhbnNmb3JtID0ge307XG5cbmlnbm9yZV9maWVsZHMgPSB7XG4gIG93bmVyOiAwLFxuICBzcGFjZTogMCxcbiAgY3JlYXRlZDogMCxcbiAgY3JlYXRlZF9ieTogMCxcbiAgbW9kaWZpZWQ6IDAsXG4gIG1vZGlmaWVkX2J5OiAwLFxuICBpc19kZWxldGVkOiAwLFxuICBpbnN0YW5jZXM6IDAsXG4gIHNoYXJpbmc6IDBcbn07XG5cbkFQVHJhbnNmb3JtLmV4cG9ydE9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgX29iaiwgYWN0aW9ucywgZmllbGRzLCBvYmpfbGlzdF92aWV3cywgdHJpZ2dlcnM7XG4gIF9vYmogPSB7fTtcbiAgXy5leHRlbmQoX29iaiwgb2JqZWN0KTtcbiAgb2JqX2xpc3Rfdmlld3MgPSB7fTtcbiAgXy5leHRlbmQob2JqX2xpc3Rfdmlld3MsIF9vYmoubGlzdF92aWV3cyB8fCB7fSk7XG4gIF8uZWFjaChvYmpfbGlzdF92aWV3cywgZnVuY3Rpb24odiwgaykge1xuICAgIGlmICghXy5oYXModiwgXCJfaWRcIikpIHtcbiAgICAgIHYuX2lkID0gaztcbiAgICB9XG4gICAgaWYgKCFfLmhhcyh2LCBcIm5hbWVcIikpIHtcbiAgICAgIHJldHVybiB2Lm5hbWUgPSBrO1xuICAgIH1cbiAgfSk7XG4gIF9vYmoubGlzdF92aWV3cyA9IG9ial9saXN0X3ZpZXdzO1xuICB0cmlnZ2VycyA9IHt9O1xuICBfLmZvckVhY2goX29iai50cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlciwga2V5KSB7XG4gICAgdmFyIF90cmlnZ2VyO1xuICAgIF90cmlnZ2VyID0ge307XG4gICAgXy5leHRlbmQoX3RyaWdnZXIsIHRyaWdnZXIpO1xuICAgIGlmIChfLmlzRnVuY3Rpb24oX3RyaWdnZXIudG9kbykpIHtcbiAgICAgIF90cmlnZ2VyLnRvZG8gPSBfdHJpZ2dlci50b2RvLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGRlbGV0ZSBfdHJpZ2dlci5fdG9kbztcbiAgICByZXR1cm4gdHJpZ2dlcnNba2V5XSA9IF90cmlnZ2VyO1xuICB9KTtcbiAgX29iai50cmlnZ2VycyA9IHRyaWdnZXJzO1xuICBhY3Rpb25zID0ge307XG4gIF8uZm9yRWFjaChfb2JqLmFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbiwga2V5KSB7XG4gICAgdmFyIF9hY3Rpb247XG4gICAgX2FjdGlvbiA9IHt9O1xuICAgIF8uZXh0ZW5kKF9hY3Rpb24sIGFjdGlvbik7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihfYWN0aW9uLnRvZG8pKSB7XG4gICAgICBfYWN0aW9uLnRvZG8gPSBfYWN0aW9uLnRvZG8udG9TdHJpbmcoKTtcbiAgICB9XG4gICAgZGVsZXRlIF9hY3Rpb24uX3RvZG87XG4gICAgcmV0dXJuIGFjdGlvbnNba2V5XSA9IF9hY3Rpb247XG4gIH0pO1xuICBfb2JqLmFjdGlvbnMgPSBhY3Rpb25zO1xuICBmaWVsZHMgPSB7fTtcbiAgXy5mb3JFYWNoKF9vYmouZmllbGRzLCBmdW5jdGlvbihmaWVsZCwga2V5KSB7XG4gICAgdmFyIF9maWVsZCwgX2ZvO1xuICAgIF9maWVsZCA9IHt9O1xuICAgIF8uZXh0ZW5kKF9maWVsZCwgZmllbGQpO1xuICAgIGlmIChfLmlzRnVuY3Rpb24oX2ZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICBfZmllbGQub3B0aW9ucyA9IF9maWVsZC5vcHRpb25zLnRvU3RyaW5nKCk7XG4gICAgICBkZWxldGUgX2ZpZWxkLl9vcHRpb25zO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KF9maWVsZC5vcHRpb25zKSkge1xuICAgICAgX2ZvID0gW107XG4gICAgICBfLmZvckVhY2goX2ZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKF9vMSkge1xuICAgICAgICByZXR1cm4gX2ZvLnB1c2goX28xLmxhYmVsICsgXCI6XCIgKyBfbzEudmFsdWUpO1xuICAgICAgfSk7XG4gICAgICBfZmllbGQub3B0aW9ucyA9IF9mby5qb2luKFwiLFwiKTtcbiAgICAgIGRlbGV0ZSBfZmllbGQuX29wdGlvbnM7XG4gICAgfVxuICAgIGlmIChfZmllbGQucmVnRXgpIHtcbiAgICAgIF9maWVsZC5yZWdFeCA9IF9maWVsZC5yZWdFeC50b1N0cmluZygpO1xuICAgICAgZGVsZXRlIF9maWVsZC5fcmVnRXg7XG4gICAgfVxuICAgIGlmIChfLmlzRnVuY3Rpb24oX2ZpZWxkLm9wdGlvbnNGdW5jdGlvbikpIHtcbiAgICAgIF9maWVsZC5vcHRpb25zRnVuY3Rpb24gPSBfZmllbGQub3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICBkZWxldGUgX2ZpZWxkLl9vcHRpb25zRnVuY3Rpb247XG4gICAgfVxuICAgIGlmIChfLmlzRnVuY3Rpb24oX2ZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgIF9maWVsZC5yZWZlcmVuY2VfdG8gPSBfZmllbGQucmVmZXJlbmNlX3RvLnRvU3RyaW5nKCk7XG4gICAgICBkZWxldGUgX2ZpZWxkLl9yZWZlcmVuY2VfdG87XG4gICAgfVxuICAgIGlmIChfLmlzRnVuY3Rpb24oX2ZpZWxkLmNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgX2ZpZWxkLmNyZWF0ZUZ1bmN0aW9uID0gX2ZpZWxkLmNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICBkZWxldGUgX2ZpZWxkLl9jcmVhdGVGdW5jdGlvbjtcbiAgICB9XG4gICAgaWYgKF8uaXNGdW5jdGlvbihfZmllbGQuZGVmYXVsdFZhbHVlKSkge1xuICAgICAgX2ZpZWxkLmRlZmF1bHRWYWx1ZSA9IF9maWVsZC5kZWZhdWx0VmFsdWUudG9TdHJpbmcoKTtcbiAgICAgIGRlbGV0ZSBfZmllbGQuX2RlZmF1bHRWYWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkc1trZXldID0gX2ZpZWxkO1xuICB9KTtcbiAgX29iai5maWVsZHMgPSBmaWVsZHM7XG4gIHJldHVybiBfb2JqO1xufTtcblxuXG4vKlxu5a+85Ye65pWw5o2uOlxue1xuXHRhcHBzOlt7fV0sIOi9r+S7tuWMhemAieS4reeahGFwcHNcblx0b2JqZWN0czpbe31dLCDpgInkuK3nmoRvYmplY3Tlj4rlhbZmaWVsZHMsIGxpc3Rfdmlld3MsIHRyaWdnZXJzLCBhY3Rpb25zLCBwZXJtaXNzaW9uX3NldOetiVxuICAgIGxpc3Rfdmlld3M6W3t9XSwg6L2v5Lu25YyF6YCJ5Lit55qEbGlzdF92aWV3c1xuICAgIHBlcm1pc3Npb25zOlt7fV0sIOi9r+S7tuWMhemAieS4reeahOadg+mZkOmbhlxuICAgIHBlcm1pc3Npb25fb2JqZWN0czpbe31dLCDova/ku7bljIXpgInkuK3nmoTmnYPpmZDlr7nosaFcbiAgICByZXBvcnRzOlt7fV0g6L2v5Lu25YyF6YCJ5Lit55qE5oql6KGoXG59XG4gKi9cblxuQVBUcmFuc2Zvcm1bXCJleHBvcnRcIl0gPSBmdW5jdGlvbihyZWNvcmQpIHtcbiAgdmFyIGV4cG9ydF9kYXRhO1xuICBleHBvcnRfZGF0YSA9IHt9O1xuICBpZiAoXy5pc0FycmF5KHJlY29yZC5hcHBzKSAmJiByZWNvcmQuYXBwcy5sZW5ndGggPiAwKSB7XG4gICAgZXhwb3J0X2RhdGEuYXBwcyA9IFtdO1xuICAgIF8uZWFjaChyZWNvcmQuYXBwcywgZnVuY3Rpb24oYXBwS2V5KSB7XG4gICAgICB2YXIgYXBwO1xuICAgICAgYXBwID0ge307XG4gICAgICBfLmV4dGVuZChhcHAsIENyZWF0b3IuQXBwc1thcHBLZXldKTtcbiAgICAgIGlmICghYXBwIHx8IF8uaXNFbXB0eShhcHApKSB7XG4gICAgICAgIGFwcCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImFwcHNcIikuZmluZE9uZSh7XG4gICAgICAgICAgX2lkOiBhcHBLZXlcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogaWdub3JlX2ZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghXy5oYXMoYXBwLCBcIl9pZFwiKSkge1xuICAgICAgICAgIGFwcC5faWQgPSBhcHBLZXk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChhcHApIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydF9kYXRhLmFwcHMucHVzaChhcHApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChfLmlzQXJyYXkocmVjb3JkLm9iamVjdHMpICYmIHJlY29yZC5vYmplY3RzLmxlbmd0aCA+IDApIHtcbiAgICBleHBvcnRfZGF0YS5vYmplY3RzID0gW107XG4gICAgXy5lYWNoKHJlY29yZC5vYmplY3RzLCBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgICAgdmFyIG9iamVjdDtcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBleHBvcnRfZGF0YS5vYmplY3RzLnB1c2goQVBUcmFuc2Zvcm0uZXhwb3J0T2JqZWN0KG9iamVjdCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChfLmlzQXJyYXkocmVjb3JkLmxpc3Rfdmlld3MpICYmIHJlY29yZC5saXN0X3ZpZXdzLmxlbmd0aCA+IDApIHtcbiAgICBleHBvcnRfZGF0YS5saXN0X3ZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IHJlY29yZC5saXN0X3ZpZXdzXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiBpZ25vcmVfZmllbGRzXG4gICAgfSkuZmV0Y2goKTtcbiAgfVxuICBpZiAoXy5pc0FycmF5KHJlY29yZC5wZXJtaXNzaW9uX3NldCkgJiYgcmVjb3JkLnBlcm1pc3Npb25fc2V0Lmxlbmd0aCA+IDApIHtcbiAgICBleHBvcnRfZGF0YS5wZXJtaXNzaW9uX3NldCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogcmVjb3JkLnBlcm1pc3Npb25fc2V0XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiBpZ25vcmVfZmllbGRzXG4gICAgfSkuZmV0Y2goKTtcbiAgfVxuICBpZiAoXy5pc0FycmF5KHJlY29yZC5wZXJtaXNzaW9uX29iamVjdHMpICYmIHJlY29yZC5wZXJtaXNzaW9uX29iamVjdHMubGVuZ3RoID4gMCkge1xuICAgIGV4cG9ydF9kYXRhLnBlcm1pc3Npb25fb2JqZWN0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IHJlY29yZC5wZXJtaXNzaW9uX29iamVjdHNcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IGlnbm9yZV9maWVsZHNcbiAgICB9KS5mZXRjaCgpO1xuICB9XG4gIGlmIChfLmlzQXJyYXkocmVjb3JkLnJlcG9ydHMpICYmIHJlY29yZC5yZXBvcnRzLmxlbmd0aCA+IDApIHtcbiAgICBleHBvcnRfZGF0YS5yZXBvcnRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicmVwb3J0c1wiKS5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IHJlY29yZC5yZXBvcnRzXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiBpZ25vcmVfZmllbGRzXG4gICAgfSkuZmV0Y2goKTtcbiAgfVxuICByZXR1cm4gZXhwb3J0X2RhdGE7XG59O1xuIl19
