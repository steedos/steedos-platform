(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var ECMAScript = Package.ecmascript.ECMAScript;
var Random = Package.random.Random;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var check = Package.check.check;
var Match = Package.check.Match;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Blaze = Package.ui.Blaze;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var Restivus = Package['nimble:restivus'].Restivus;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var Tabular = Package['aldeed:tabular'].Tabular;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var BlazeLayout = Package['kadira:blaze-layout'].BlazeLayout;
var FlowRouter = Package['kadira:flow-router'].FlowRouter;
var Template = Package['meteorhacks:ssr'].Template;
var SSR = Package['meteorhacks:ssr'].SSR;
var SubsManager = Package['meteorhacks:subs-manager'].SubsManager;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var Accounts = Package['accounts-base'].Accounts;
var Selector = Package['steedos:base'].Selector;
var Steedos = Package['steedos:base'].Steedos;
var AjaxCollection = Package['steedos:base'].AjaxCollection;
var SteedosDataManager = Package['steedos:base'].SteedosDataManager;
var SteedosOffice = Package['steedos:base'].SteedosOffice;
var billingManager = Package['steedos:base'].billingManager;
var CFDataManager = Package['steedos:autoform'].CFDataManager;
var Push = Package['raix:push'].Push;
var Logger = Package['steedos:logger'].Logger;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;
var HTML = Package.htmljs.HTML;
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var FS = Package['steedos:cfs-base-package'].FS;
var Spacebars = Package.spacebars.Spacebars;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var __coffeescriptShare, permissionManagerForInitApproval, uuflowManagerForInitApproval;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:creator":{"checkNpm.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/checkNpm.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);
checkNpmVersions({
  busboy: "^0.2.13",
  "xml2js": "^0.4.19"
}, 'steedos:creator');

if (Meteor.settings && Meteor.settings.cfs && Meteor.settings.cfs.aliyun) {
  checkNpmVersions({
    "aliyun-sdk": "^1.11.12"
  }, 'steedos:creator');
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"core.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/core.coffee                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Creator.getSchema = function (object_name) {
  var ref;
  return (ref = Creator.getObject(object_name)) != null ? ref.schema : void 0;
};

Creator.getObjectHomeComponent = function (object_name) {
  return false;
};

Creator.getObjectUrl = function (object_name, record_id, app_id) {
  var list_view, list_view_id;

  if (!app_id) {
    app_id = Session.get("app_id");
  }

  if (!object_name) {
    object_name = Session.get("object_name");
  }

  list_view = Creator.getListView(object_name, null);
  list_view_id = list_view != null ? list_view._id : void 0;

  if (record_id) {
    return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name + "/view/" + record_id);
  } else {
    if (Creator.getObjectHomeComponent(object_name)) {
      return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name);
    } else {
      if (list_view_id) {
        return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name + "/grid/" + list_view_id);
      } else {
        return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name);
      }
    }
  }
};

Creator.getObjectAbsoluteUrl = function (object_name, record_id, app_id) {
  var list_view, list_view_id;

  if (!app_id) {
    app_id = Session.get("app_id");
  }

  if (!object_name) {
    object_name = Session.get("object_name");
  }

  list_view = Creator.getListView(object_name, null);
  list_view_id = list_view != null ? list_view._id : void 0;

  if (record_id) {
    return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/view/" + record_id, true);
  } else {
    return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/grid/" + list_view_id, true);
  }
};

Creator.getObjectRouterUrl = function (object_name, record_id, app_id) {
  var list_view, list_view_id;

  if (!app_id) {
    app_id = Session.get("app_id");
  }

  if (!object_name) {
    object_name = Session.get("object_name");
  }

  list_view = Creator.getListView(object_name, null);
  list_view_id = list_view != null ? list_view._id : void 0;

  if (record_id) {
    return "/app/" + app_id + "/" + object_name + "/view/" + record_id;
  } else {
    return "/app/" + app_id + "/" + object_name + "/grid/" + list_view_id;
  }
};

Creator.getListViewUrl = function (object_name, app_id, list_view_id) {
  var url;
  url = Creator.getListViewRelativeUrl(object_name, app_id, list_view_id);
  return Creator.getRelativeUrl(url);
};

Creator.getListViewRelativeUrl = function (object_name, app_id, list_view_id) {
  return "/app/" + app_id + "/" + object_name + "/grid/" + list_view_id;
};

Creator.getSwitchListUrl = function (object_name, app_id, list_view_id) {
  if (list_view_id) {
    return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name + "/" + list_view_id + "/list");
  } else {
    return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name + "/list/switch");
  }
};

Creator.getRelatedObjectUrl = function (object_name, app_id, record_id, related_object_name, related_field_name) {
  if (related_field_name) {
    return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name + "/" + record_id + "/" + related_object_name + "/grid?related_field_name=" + related_field_name);
  } else {
    return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name + "/" + record_id + "/" + related_object_name + "/grid");
  }
};

Creator.getObjectLookupFieldOptions = function (object_name, is_deep, is_skip_hide, is_related) {
  var _object, _options, fields, icon, relatedObjects;

  _options = [];

  if (!object_name) {
    return _options;
  }

  _object = Creator.getObject(object_name);
  fields = _object != null ? _object.fields : void 0;
  icon = _object != null ? _object.icon : void 0;

  _.forEach(fields, function (f, k) {
    if (is_skip_hide && f.hidden) {
      return;
    }

    if (f.type === "select") {
      return _options.push({
        label: "" + (f.label || k),
        value: "" + k,
        icon: icon
      });
    } else {
      return _options.push({
        label: f.label || k,
        value: k,
        icon: icon
      });
    }
  });

  if (is_deep) {
    _.forEach(fields, function (f, k) {
      var r_object;

      if (is_skip_hide && f.hidden) {
        return;
      }

      if ((f.type === "lookup" || f.type === "master_detail") && f.reference_to && _.isString(f.reference_to)) {
        r_object = Creator.getObject(f.reference_to);

        if (r_object) {
          return _.forEach(r_object.fields, function (f2, k2) {
            return _options.push({
              label: (f.label || k) + "=>" + (f2.label || k2),
              value: k + "." + k2,
              icon: r_object != null ? r_object.icon : void 0
            });
          });
        }
      }
    });
  }

  if (is_related) {
    relatedObjects = Creator.getRelatedObjects(object_name);

    _.each(relatedObjects, function (_this) {
      return function (_relatedObject) {
        var relatedObject, relatedOptions;
        relatedOptions = Creator.getObjectLookupFieldOptions(_relatedObject.object_name, false, false, false);
        relatedObject = Creator.getObject(_relatedObject.object_name);
        return _.each(relatedOptions, function (relatedOption) {
          if (_relatedObject.foreign_key !== relatedOption.value) {
            return _options.push({
              label: (relatedObject.label || relatedObject.name) + "=>" + relatedOption.label,
              value: relatedObject.name + "." + relatedOption.value,
              icon: relatedObject != null ? relatedObject.icon : void 0
            });
          }
        });
      };
    }(this));
  }

  return _options;
};

Creator.getObjectFilterFieldOptions = function (object_name) {
  var _object, _options, fields, icon, permission_fields;

  _options = [];

  if (!object_name) {
    return _options;
  }

  _object = Creator.getObject(object_name);
  fields = _object != null ? _object.fields : void 0;
  permission_fields = Creator.getFields(object_name);
  icon = _object != null ? _object.icon : void 0;

  _.forEach(fields, function (f, k) {
    if (!_.include(["grid", "object", "[Object]", "[object]", "Object", "avatar", "image", "markdown", "html"], f.type) && !f.hidden) {
      if (!/\w+\./.test(k) && _.indexOf(permission_fields, k) > -1) {
        return _options.push({
          label: f.label || k,
          value: k,
          icon: icon
        });
      }
    }
  });

  return _options;
};

Creator.getObjectFieldOptions = function (object_name) {
  var _object, _options, fields, icon, permission_fields;

  _options = [];

  if (!object_name) {
    return _options;
  }

  _object = Creator.getObject(object_name);
  fields = _object != null ? _object.fields : void 0;
  permission_fields = Creator.getFields(object_name);
  icon = _object != null ? _object.icon : void 0;

  _.forEach(fields, function (f, k) {
    if (!_.include(["grid", "object", "[Object]", "[object]", "Object", "markdown", "html"], f.type)) {
      if (!/\w+\./.test(k) && _.indexOf(permission_fields, k) > -1) {
        return _options.push({
          label: f.label || k,
          value: k,
          icon: icon
        });
      }
    }
  });

  return _options;
}; /*
   filters: 要转换的filters
   fields: 对象字段
   filter_fields: 默认过滤字段，支持字符串数组和对象数组两种格式，如:['filed_name1','filed_name2'],[{field:'filed_name1',required:true}]
   处理逻辑: 把filters中存在于filter_fields的过滤条件增加每项的is_default、is_required属性，不存在于filter_fields的过滤条件对应的移除每项的相关属性
   返回结果: 处理后的filters
    */

Creator.getFiltersWithFilterFields = function (filters, fields, filter_fields) {
  if (!filters) {
    filters = [];
  }

  if (!filter_fields) {
    filter_fields = [];
  }

  if (filter_fields != null ? filter_fields.length : void 0) {
    filter_fields.forEach(function (n) {
      if (_.isString(n)) {
        n = {
          field: n,
          required: false
        };
      }

      if (fields[n.field] && !_.findWhere(filters, {
        field: n.field
      })) {
        return filters.push({
          field: n.field,
          is_default: true,
          is_required: n.required
        });
      }
    });
  }

  filters.forEach(function (filterItem) {
    var matchField;
    matchField = filter_fields.find(function (n) {
      return n === filterItem.field || n.field === filterItem.field;
    });

    if (_.isString(matchField)) {
      matchField = {
        field: matchField,
        required: false
      };
    }

    if (matchField) {
      filterItem.is_default = true;
      return filterItem.is_required = matchField.required;
    } else {
      delete filterItem.is_default;
      return delete filterItem.is_required;
    }
  });
  return filters;
};

Creator.getObjectRecord = function (object_name, record_id, select_fields, expand) {
  var collection, obj, record, ref, ref1, ref2;

  if (!object_name) {
    object_name = Session.get("object_name");
  }

  if (!record_id) {
    record_id = Session.get("record_id");
  }

  if (Meteor.isClient) {
    if (object_name === Session.get("object_name") && record_id === Session.get("record_id")) {
      if ((ref = Template.instance()) != null ? ref.record : void 0) {
        return (ref1 = Template.instance()) != null ? (ref2 = ref1.record) != null ? ref2.get() : void 0 : void 0;
      }
    } else {
      return Creator.odata.get(object_name, record_id, select_fields, expand);
    }
  }

  obj = Creator.getObject(object_name);

  if (obj.database_name === "meteor" || !obj.database_name) {
    collection = Creator.getCollection(object_name);

    if (collection) {
      record = collection.findOne(record_id);
      return record;
    }
  } else if (object_name && record_id) {
    return Creator.odata.get(object_name, record_id, select_fields, expand);
  }
};

Creator.getObjectRecordName = function (record, object_name) {
  var name_field_key, ref;

  if (!record) {
    record = Creator.getObjectRecord();
  }

  if (record) {
    name_field_key = object_name === "organizations" ? "name" : (ref = Creator.getObject(object_name)) != null ? ref.NAME_FIELD_KEY : void 0;

    if (record && name_field_key) {
      return record.label || record[name_field_key];
    }
  }
};

Creator.getApp = function (app_id) {
  var app, ref, ref1;

  if (!app_id) {
    app_id = Session.get("app_id");
  }

  app = Creator.Apps[app_id];

  if ((ref = Creator.deps) != null) {
    if ((ref1 = ref.app) != null) {
      ref1.depend();
    }
  }

  return app;
};

Creator.getAppDashboard = function (app_id) {
  var app, dashboard;
  app = Creator.getApp(app_id);

  if (!app) {
    return;
  }

  dashboard = null;

  _.each(Creator.Dashboards, function (v, k) {
    var ref;

    if (((ref = v.apps) != null ? ref.indexOf(app._id) : void 0) > -1) {
      return dashboard = v;
    }
  });

  return dashboard;
};

Creator.getAppDashboardComponent = function (app_id) {
  var app;
  app = Creator.getApp(app_id);

  if (!app || true) {}
};

Creator.getAppObjectNames = function (app_id) {
  var app, appObjects, isMobile, objects;
  app = Creator.getApp(app_id);

  if (!app) {
    return;
  }

  isMobile = Steedos.isMobile();
  appObjects = isMobile ? app.mobile_objects : app.objects;
  objects = [];

  if (app) {
    _.each(appObjects, function (v) {
      var obj;
      obj = Creator.getObject(v);

      if (obj != null ? obj.permissions.get().allowRead : void 0) {
        return objects.push(v);
      }
    });
  }

  return objects;
};

Creator.getUrlWithToken = function (url, expressionFormData) {
  var hasQuerySymbol, linkStr, params;
  params = {};
  params["X-Space-Id"] = Steedos.spaceId();
  params["X-User-Id"] = Steedos.userId();
  params["X-Company-Ids"] = Steedos.getUserCompanyIds();
  params["X-Auth-Token"] = Accounts._storedLoginToken();

  if (Steedos.isExpression(url)) {
    url = Steedos.parseSingleExpression(url, expressionFormData, "#", Creator.USER_CONTEXT);
  }

  hasQuerySymbol = /(\#.+\?)|(\?[^#]*$)/g.test(url);
  linkStr = hasQuerySymbol ? "&" : "?";
  return "" + url + linkStr + $.param(params);
};

Creator.getAppMenu = function (app_id, menu_id) {
  var menus;
  menus = Creator.getAppMenus(app_id);
  return menus && menus.find(function (menu) {
    return menu.id === menu_id;
  });
};

Creator.getAppMenuUrlForInternet = function (menu) {
  return Creator.getUrlWithToken(menu.path, menu);
};

Creator.getAppMenuUrl = function (menu) {
  var url;
  url = menu.path;

  if (menu.type === "url") {
    if (menu.target) {
      return Creator.getAppMenuUrlForInternet(menu);
    } else {
      return "/app/-/tab_iframe/" + menu.id;
    }
  } else {
    return menu.path;
  }
};

Creator.getAppMenus = function (app_id) {
  var app, appMenus, curentAppMenus;
  app = Creator.getApp(app_id);

  if (!app) {
    return [];
  }

  appMenus = Session.get("app_menus");

  if (!appMenus) {
    return [];
  }

  curentAppMenus = appMenus.find(function (menuItem) {
    return menuItem.id === app._id;
  });

  if (curentAppMenus) {
    return curentAppMenus.children;
  }
};

Creator.loadAppsMenus = function () {
  var data, isMobile, options;
  isMobile = Steedos.isMobile();
  data = {};

  if (isMobile) {
    data.mobile = isMobile;
  }

  options = {
    type: 'get',
    data: data,
    success: function (data) {
      return Session.set("app_menus", data);
    }
  };
  return Steedos.authRequest("/service/api/apps/menus", options);
};

Creator.creatorAppsSelector = function (apps, assigned_apps) {
  var adminApp, creatorApps, sortedApps;
  adminApp = void 0;
  sortedApps = void 0;

  _.each(apps, function (app, key) {
    if (!app._id) {
      app._id = key;
    }

    if (app.is_creator) {} else {
      app.visible = false;
    }
  });

  sortedApps = _.sortBy(_.values(apps), 'sort');
  creatorApps = {};
  adminApp = {};

  _.each(sortedApps, function (n) {
    if (n._id === 'admin') {
      return adminApp = n;
    } else {
      return creatorApps[n._id] = n;
    }
  });

  creatorApps.admin = adminApp;

  if (assigned_apps.length) {
    _.each(creatorApps, function (app, key) {
      if (assigned_apps.indexOf(key) > -1) {
        app.visible = app.is_creator;
      } else {
        app.visible = false;
      }
    });
  }

  return creatorApps;
};

Creator.visibleAppsSelector = function (creatorApps, includeAdmin) {
  var apps;

  if (includeAdmin == null) {
    includeAdmin = true;
  }

  apps = [];

  _.each(creatorApps, function (v, k) {
    if (v.visible !== false && v._id !== 'admin' || includeAdmin && v._id === 'admin') {
      apps.push(v);
    }
  });

  return apps;
};

Creator.getVisibleApps = function (includeAdmin) {
  var changeApp, creatorApps;
  changeApp = Creator._subApp.get();
  creatorApps = Object.assign({}, Creator.Apps, {
    apps: changeApp
  });
  return Creator.visibleAppsSelector(creatorApps, includeAdmin);
};

Creator.getVisibleAppsObjects = function () {
  var apps, objects, visibleObjectNames;
  apps = Creator.getVisibleApps();
  visibleObjectNames = _.flatten(_.pluck(apps, 'objects'));
  objects = _.filter(Creator.Objects, function (obj) {
    if (visibleObjectNames.indexOf(obj.name) < 0) {
      return false;
    } else {
      return true;
    }
  });
  objects = objects.sort(Creator.sortingMethod.bind({
    key: "label"
  }));
  objects = _.pluck(objects, 'name');
  return _.uniq(objects);
};

Creator.getAppsObjects = function () {
  var objects, tempObjects;
  objects = [];
  tempObjects = [];

  _.forEach(Creator.Apps, function (app) {
    tempObjects = _.filter(app.objects, function (obj) {
      return !obj.hidden;
    });
    return objects = objects.concat(tempObjects);
  });

  return _.uniq(objects);
};

Creator.validateFilters = function (filters, logic) {
  var e, errorMsg, filter_items, filter_length, flag, index, word;
  filter_items = _.map(filters, function (obj) {
    if (_.isEmpty(obj)) {
      return false;
    } else {
      return obj;
    }
  });
  filter_items = _.compact(filter_items);
  errorMsg = "";
  filter_length = filter_items.length;

  if (logic) {
    logic = logic.replace(/\n/g, "").replace(/\s+/g, " ");

    if (/[._\-!+]+/ig.test(logic)) {
      errorMsg = "含有特殊字符。";
    }

    if (!errorMsg) {
      index = logic.match(/\d+/ig);

      if (!index) {
        errorMsg = "有些筛选条件进行了定义，但未在高级筛选条件中被引用。";
      } else {
        index.forEach(function (i) {
          if (i < 1 || i > filter_length) {
            return errorMsg = "您的筛选条件引用了未定义的筛选器：" + i + "。";
          }
        });
        flag = 1;

        while (flag <= filter_length) {
          if (!index.includes("" + flag)) {
            errorMsg = "有些筛选条件进行了定义，但未在高级筛选条件中被引用。";
          }

          flag++;
        }
      }
    }

    if (!errorMsg) {
      word = logic.match(/[a-zA-Z]+/ig);

      if (word) {
        word.forEach(function (w) {
          if (!/^(and|or)$/ig.test(w)) {
            return errorMsg = "检查您的高级筛选条件中的拼写。";
          }
        });
      }
    }

    if (!errorMsg) {
      try {
        Creator["eval"](logic.replace(/and/ig, "&&").replace(/or/ig, "||"));
      } catch (error) {
        e = error;
        errorMsg = "您的筛选器中含有特殊字符";
      }

      if (/(AND)[^()]+(OR)/ig.test(logic) || /(OR)[^()]+(AND)/ig.test(logic)) {
        errorMsg = "您的筛选器必须在连续性的 AND 和 OR 表达式前后使用括号。";
      }
    }
  }

  if (errorMsg) {
    console.log("error", errorMsg);

    if (Meteor.isClient) {
      toastr.error(errorMsg);
    }

    return false;
  } else {
    return true;
  }
}; /*
   options参数：
   	extend-- 是否需要把当前用户基本信息加入公式，即让公式支持Creator.USER_CONTEXT中的值，默认为true
   	userId-- 当前登录用户
   	spaceId-- 当前所在工作区
   extend为true时，后端需要额外传入userId及spaceId用于抓取Creator.USER_CONTEXT对应的值
    */

Creator.formatFiltersToMongo = function (filters, options) {
  var selector;

  if (!(filters != null ? filters.length : void 0)) {
    return;
  }

  if (!(filters[0] instanceof Array)) {
    filters = _.map(filters, function (obj) {
      return [obj.field, obj.operation, obj.value];
    });
  }

  selector = [];

  _.each(filters, function (filter) {
    var field, option, reg, sub_selector, value;
    field = filter[0];
    option = filter[1];

    if (Meteor.isClient) {
      value = Creator.evaluateFormula(filter[2]);
    } else {
      value = Creator.evaluateFormula(filter[2], null, options);
    }

    sub_selector = {};
    sub_selector[field] = {};

    if (option === "=") {
      sub_selector[field]["$eq"] = value;
    } else if (option === "<>") {
      sub_selector[field]["$ne"] = value;
    } else if (option === ">") {
      sub_selector[field]["$gt"] = value;
    } else if (option === ">=") {
      sub_selector[field]["$gte"] = value;
    } else if (option === "<") {
      sub_selector[field]["$lt"] = value;
    } else if (option === "<=") {
      sub_selector[field]["$lte"] = value;
    } else if (option === "startswith") {
      reg = new RegExp("^" + value, "i");
      sub_selector[field]["$regex"] = reg;
    } else if (option === "contains") {
      reg = new RegExp(value, "i");
      sub_selector[field]["$regex"] = reg;
    } else if (option === "notcontains") {
      reg = new RegExp("^((?!" + value + ").)*$", "i");
      sub_selector[field]["$regex"] = reg;
    }

    return selector.push(sub_selector);
  });

  return selector;
};

Creator.isBetweenFilterOperation = function (operation) {
  var ref;
  return operation === "between" || !!((ref = Creator.getBetweenTimeBuiltinValues(true)) != null ? ref[operation] : void 0);
}; /*
   options参数：
   	extend-- 是否需要把当前用户基本信息加入公式，即让公式支持Creator.USER_CONTEXT中的值，默认为true
   	userId-- 当前登录用户
   	spaceId-- 当前所在工作区
   	extend为true时，后端需要额外传入userId及spaceId用于抓取Creator.USER_CONTEXT对应的值
    */

Creator.formatFiltersToDev = function (filters, object_name, options) {
  var logicTempFilters, selector;

  if (!filters.length) {
    return;
  }

  if (options != null ? options.is_logic_or : void 0) {
    logicTempFilters = [];
    filters.forEach(function (n) {
      logicTempFilters.push(n);
      return logicTempFilters.push("or");
    });
    logicTempFilters.pop();
    filters = logicTempFilters;
  }

  selector = SteedosFilters.formatFiltersToDev(filters, Creator.USER_CONTEXT);
  return selector;
}; /*
   options参数：
   	extend-- 是否需要把当前用户基本信息加入公式，即让公式支持Creator.USER_CONTEXT中的值，默认为true
   	userId-- 当前登录用户
   	spaceId-- 当前所在工作区
   extend为true时，后端需要额外传入userId及spaceId用于抓取Creator.USER_CONTEXT对应的值
    */

Creator.formatLogicFiltersToDev = function (filters, filter_logic, options) {
  var format_logic;
  format_logic = filter_logic.replace(/\(\s+/ig, "(").replace(/\s+\)/ig, ")").replace(/\(/g, "[").replace(/\)/g, "]").replace(/\s+/g, ",").replace(/(and|or)/ig, "'$1'");
  format_logic = format_logic.replace(/(\d)+/ig, function (x) {
    var _f, field, option, sub_selector, value;

    _f = filters[x - 1];
    field = _f.field;
    option = _f.operation;

    if (Meteor.isClient) {
      value = Creator.evaluateFormula(_f.value);
    } else {
      value = Creator.evaluateFormula(_f.value, null, options);
    }

    sub_selector = [];

    if (_.isArray(value) === true) {
      if (option === "=") {
        _.each(value, function (v) {
          return sub_selector.push([field, option, v], "or");
        });
      } else if (option === "<>") {
        _.each(value, function (v) {
          return sub_selector.push([field, option, v], "and");
        });
      } else {
        _.each(value, function (v) {
          return sub_selector.push([field, option, v], "or");
        });
      }

      if (sub_selector[sub_selector.length - 1] === "and" || sub_selector[sub_selector.length - 1] === "or") {
        sub_selector.pop();
      }
    } else {
      sub_selector = [field, option, value];
    }

    console.log("sub_selector", sub_selector);
    return JSON.stringify(sub_selector);
  });
  format_logic = "[" + format_logic + "]";
  return Creator["eval"](format_logic);
};

Creator.getRelatedObjects = function (object_name, spaceId, userId) {
  var _object, permissions, related_object_names, related_objects, unrelated_objects;

  if (Meteor.isClient) {
    if (!object_name) {
      object_name = Session.get("object_name");
    }

    if (!spaceId) {
      spaceId = Session.get("spaceId");
    }

    if (!userId) {
      userId = Meteor.userId();
    }
  }

  related_object_names = [];
  _object = Creator.getObject(object_name);

  if (!_object) {
    return related_object_names;
  }

  related_objects = Creator.getObjectRelateds(_object._collection_name);
  related_object_names = _.pluck(related_objects, "object_name");

  if ((related_object_names != null ? related_object_names.length : void 0) === 0) {
    return related_object_names;
  }

  permissions = Creator.getPermissions(object_name, spaceId, userId);
  unrelated_objects = permissions.unrelated_objects;
  related_object_names = _.difference(related_object_names, unrelated_objects);
  return _.filter(related_objects, function (related_object) {
    var allowRead, isActive, ref, related_object_name;
    related_object_name = related_object.object_name;
    isActive = related_object_names.indexOf(related_object_name) > -1;
    allowRead = (ref = Creator.getPermissions(related_object_name, spaceId, userId)) != null ? ref.allowRead : void 0;

    if (related_object_name === "cms_files") {
      allowRead = allowRead && permissions.allowReadFiles;
    }

    return isActive && allowRead;
  });
};

Creator.getRelatedObjectNames = function (object_name, spaceId, userId) {
  var related_objects;
  related_objects = Creator.getRelatedObjects(object_name, spaceId, userId);
  return _.pluck(related_objects, "object_name");
};

Creator.getRelatedObjectListActions = function (relatedObjectName, spaceId, userId) {
  var actions;
  actions = Creator.getActions(relatedObjectName, spaceId, userId);
  actions = _.filter(actions, function (action) {
    if (action.name === "standard_follow") {
      return false;
    }

    if (action.name === "standard_query") {
      return false;
    }

    if (action.on === "list") {
      if (typeof action.visible === "function") {
        return action.visible();
      } else {
        return action.visible;
      }
    } else {
      return false;
    }
  });
  return actions;
};

Creator.getActions = function (object_name, spaceId, userId) {
  var actions, disabled_actions, obj, permissions, ref, ref1;

  if (Meteor.isClient) {
    if (!object_name) {
      object_name = Session.get("object_name");
    }

    if (!spaceId) {
      spaceId = Session.get("spaceId");
    }

    if (!userId) {
      userId = Meteor.userId();
    }
  }

  obj = Creator.getObject(object_name);

  if (!obj) {
    return;
  }

  permissions = Creator.getPermissions(object_name, spaceId, userId);
  disabled_actions = permissions.disabled_actions;
  actions = _.sortBy(_.values(obj.actions), 'sort');

  if (_.has(obj, 'allow_customActions')) {
    actions = _.filter(actions, function (action) {
      return _.include(obj.allow_customActions, action.name) || _.include(_.keys(Creator.getObject('base').actions) || {}, action.name);
    });
  }

  if (_.has(obj, 'exclude_actions')) {
    actions = _.filter(actions, function (action) {
      return !_.include(obj.exclude_actions, action.name);
    });
  }

  _.each(actions, function (action) {
    if (Steedos.isMobile() && ["record", "record_only"].indexOf(action.on) > -1 && action.name !== 'standard_edit') {
      if (action.on === "record_only") {
        return action.on = 'record_only_more';
      } else {
        return action.on = 'record_more';
      }
    }
  });

  if (Steedos.isMobile() && ["cms_files", "cfs.files.filerecord"].indexOf(object_name) > -1) {
    if ((ref = actions.find(function (n) {
      return n.name === "standard_edit";
    })) != null) {
      ref.on = "record_more";
    }

    if ((ref1 = actions.find(function (n) {
      return n.name === "download";
    })) != null) {
      ref1.on = "record";
    }
  }

  actions = _.filter(actions, function (action) {
    return _.indexOf(disabled_actions, action.name) < 0;
  });
  return actions;
};

/返回当前用户有权限访问的所有list_view，包括分享的，用户自定义非分享的（除非owner变了），以及默认的其他视图注意Creator.getPermissions函数中是不会有用户自定义非分享的视图的，所以Creator.getPermissions函数中拿到的结果不全，并不是当前用户能看到所有视图/;

Creator.getListViews = function (object_name, spaceId, userId) {
  var disabled_list_views, isMobile, listViews, list_views, object, ref;

  if (Meteor.isClient) {
    if (!object_name) {
      object_name = Session.get("object_name");
    }

    if (!spaceId) {
      spaceId = Session.get("spaceId");
    }

    if (!userId) {
      userId = Meteor.userId();
    }
  }

  if (!object_name) {
    return;
  }

  object = Creator.getObject(object_name);

  if (!object) {
    return;
  }

  disabled_list_views = ((ref = Creator.getPermissions(object_name, spaceId, userId)) != null ? ref.disabled_list_views : void 0) || [];
  list_views = [];
  isMobile = Steedos.isMobile();

  _.each(object.list_views, function (item, item_name) {
    return item.name = item_name;
  });

  listViews = _.sortBy(_.values(object.list_views), 'sort_no');

  _.each(listViews, function (item) {
    var isDisabled;

    if (isMobile && item.type === "calendar") {
      return;
    }

    if (item.name !== "default") {
      isDisabled = _.indexOf(disabled_list_views, item.name) > -1 || item._id && _.indexOf(disabled_list_views, item._id) > -1;

      if (!isDisabled || item.owner === userId) {
        return list_views.push(item);
      }
    }
  });

  return list_views;
};

Creator.getFields = function (object_name, spaceId, userId) {
  var fieldsName, ref, unreadable_fields;

  if (Meteor.isClient) {
    if (!object_name) {
      object_name = Session.get("object_name");
    }

    if (!spaceId) {
      spaceId = Session.get("spaceId");
    }

    if (!userId) {
      userId = Meteor.userId();
    }
  }

  fieldsName = Creator.getObjectFieldsName(object_name);
  unreadable_fields = (ref = Creator.getPermissions(object_name, spaceId, userId)) != null ? ref.unreadable_fields : void 0;
  return _.difference(fieldsName, unreadable_fields);
};

Creator.isloading = function () {
  return !Creator.bootstrapLoaded.get();
};

Creator.convertSpecialCharacter = function (str) {
  return str.replace(/([\^\$\(\)\*\+\?\.\\\|\[\]\{\}])/g, "\\$1");
};

Creator.getDisabledFields = function (schema) {
  var fields;
  fields = _.map(schema, function (field, fieldName) {
    return field.autoform && field.autoform.disabled && !field.autoform.omit && fieldName;
  });
  fields = _.compact(fields);
  return fields;
};

Creator.getHiddenFields = function (schema) {
  var fields;
  fields = _.map(schema, function (field, fieldName) {
    return field.autoform && field.autoform.type === "hidden" && !field.autoform.omit && fieldName;
  });
  fields = _.compact(fields);
  return fields;
};

Creator.getFieldsWithNoGroup = function (schema) {
  var fields;
  fields = _.map(schema, function (field, fieldName) {
    return (!field.autoform || !field.autoform.group || field.autoform.group === "-") && (!field.autoform || field.autoform.type !== "hidden") && fieldName;
  });
  fields = _.compact(fields);
  return fields;
};

Creator.getSortedFieldGroupNames = function (schema) {
  var names;
  names = _.map(schema, function (field) {
    return field.autoform && field.autoform.group !== "-" && field.autoform.group;
  });
  names = _.compact(names);
  names = _.unique(names);
  return names;
};

Creator.getFieldsForGroup = function (schema, groupName) {
  var fields;
  fields = _.map(schema, function (field, fieldName) {
    return field.autoform && field.autoform.group === groupName && field.autoform.type !== "hidden" && fieldName;
  });
  fields = _.compact(fields);
  return fields;
};

Creator.getSystemBaseFields = function () {
  return ["created", "created_by", "modified", "modified_by"];
};

Creator.getFieldsWithoutSystemBase = function (keys) {
  return _.difference(keys, Creator.getSystemBaseFields());
};

Creator.getFieldsWithoutOmit = function (schema, keys) {
  keys = _.map(keys, function (key) {
    var field, ref;
    field = _.pick(schema, key);

    if ((ref = field[key].autoform) != null ? ref.omit : void 0) {
      return false;
    } else {
      return key;
    }
  });
  keys = _.compact(keys);
  return keys;
};

Creator.getFieldsInFirstLevel = function (firstLevelKeys, keys) {
  keys = _.map(keys, function (key) {
    if (_.indexOf(firstLevelKeys, key) > -1) {
      return key;
    } else {
      return false;
    }
  });
  keys = _.compact(keys);
  return keys;
};

Creator.getFieldsForReorder = function (schema, keys, isSingle) {
  var _keys, childKeys, fields, i, is_wide_1, is_wide_2, sc_1, sc_2;

  fields = [];
  i = 0;
  _keys = _.filter(keys, function (key) {
    return !key.endsWith('_endLine');
  });

  while (i < _keys.length) {
    sc_1 = _.pick(schema, _keys[i]);
    sc_2 = _.pick(schema, _keys[i + 1]);
    is_wide_1 = false;
    is_wide_2 = false;

    _.each(sc_1, function (value) {
      var ref, ref1;

      if (((ref = value.autoform) != null ? ref.is_wide : void 0) || ((ref1 = value.autoform) != null ? ref1.type : void 0) === "table") {
        return is_wide_1 = true;
      }
    });

    _.each(sc_2, function (value) {
      var ref, ref1;

      if (((ref = value.autoform) != null ? ref.is_wide : void 0) || ((ref1 = value.autoform) != null ? ref1.type : void 0) === "table") {
        return is_wide_2 = true;
      }
    });

    if (Steedos.isMobile()) {
      is_wide_1 = true;
      is_wide_2 = true;
    }

    if (isSingle) {
      fields.push(_keys.slice(i, i + 1));
      i += 1;
    } else {
      if (is_wide_1) {
        fields.push(_keys.slice(i, i + 1));
        i += 1;
      } else if (!is_wide_1 && is_wide_2) {
        childKeys = _keys.slice(i, i + 1);
        childKeys.push(void 0);
        fields.push(childKeys);
        i += 1;
      } else if (!is_wide_1 && !is_wide_2) {
        childKeys = _keys.slice(i, i + 1);

        if (_keys[i + 1]) {
          childKeys.push(_keys[i + 1]);
        } else {
          childKeys.push(void 0);
        }

        fields.push(childKeys);
        i += 2;
      }
    }
  }

  return fields;
};

Creator.isFilterValueEmpty = function (v) {
  return typeof v === "undefined" || v === null || Number.isNaN(v) || v.length === 0;
};

Creator.getFieldDataType = function (objectFields, key) {
  var ref, result;

  if (objectFields && key) {
    result = (ref = objectFields[key]) != null ? ref.type : void 0;

    if (["formula", "summary"].indexOf(result) > -1) {
      result = objectFields[key].data_type;
    }

    return result;
  } else {
    return "text";
  }
};

if (Meteor.isServer) {
  Creator.getAllRelatedObjects = function (object_name) {
    var related_object_names;
    related_object_names = [];

    _.each(Creator.Objects, function (related_object, related_object_name) {
      return _.each(related_object.fields, function (related_field, related_field_name) {
        if (related_field.type === "master_detail" && related_field.reference_to && related_field.reference_to === object_name) {
          return related_object_names.push(related_object_name);
        }
      });
    });

    if (Creator.getObject(object_name).enable_files) {
      related_object_names.push("cms_files");
    }

    return related_object_names;
  };
}

if (Meteor.isServer) {
  Steedos.formatIndex = function (array) {
    var indexName, isdocumentDB, object, ref, ref1, ref2;
    object = {
      background: true
    };
    isdocumentDB = ((ref = Meteor.settings) != null ? (ref1 = ref.datasources) != null ? (ref2 = ref1["default"]) != null ? ref2.documentDB : void 0 : void 0 : void 0) || false;

    if (isdocumentDB) {
      if (array.length > 0) {
        indexName = array.join(".");
        object.name = indexName;

        if (indexName.length > 52) {
          object.name = indexName.substring(0, 52);
        }
      }
    }

    return object;
  };
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"apps.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/lib/apps.coffee                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Creator.appsByName = {};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"methods":{"object_recent_viewed.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/methods/object_recent_viewed.coffee                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  "object_recent_viewed": function (object_name, record_id, space_id) {
    var collection_recent_viewed, current_recent_viewed, doc, filters;

    if (!this.userId) {
      return null;
    }

    if (object_name === "object_recent_viewed") {
      return;
    }

    if (object_name && record_id) {
      if (!space_id) {
        doc = Creator.getCollection(object_name).findOne({
          _id: record_id
        }, {
          fields: {
            space: 1
          }
        });
        space_id = doc != null ? doc.space : void 0;
      }

      collection_recent_viewed = Creator.getCollection("object_recent_viewed");
      filters = {
        owner: this.userId,
        space: space_id,
        'record.o': object_name,
        'record.ids': [record_id]
      };
      current_recent_viewed = collection_recent_viewed.findOne(filters);

      if (current_recent_viewed) {
        collection_recent_viewed.update(current_recent_viewed._id, {
          $inc: {
            count: 1
          },
          $set: {
            modified: new Date(),
            modified_by: this.userId
          }
        });
      } else {
        collection_recent_viewed.insert({
          _id: collection_recent_viewed._makeNewID(),
          owner: this.userId,
          space: space_id,
          record: {
            o: object_name,
            ids: [record_id]
          },
          count: 1,
          created: new Date(),
          created_by: this.userId,
          modified: new Date(),
          modified_by: this.userId
        });
      }
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"object_recent_record.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/methods/object_recent_record.coffee                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var async_recent_aggregate, recent_aggregate, search_object;

recent_aggregate = function (created_by, spaceId, _records, callback) {
  return Creator.Collections.object_recent_viewed.rawCollection().aggregate([{
    $match: {
      created_by: created_by,
      space: spaceId
    }
  }, {
    $group: {
      _id: {
        object_name: "$record.o",
        record_id: "$record.ids",
        space: "$space"
      },
      maxCreated: {
        $max: "$created"
      }
    }
  }, {
    $sort: {
      maxCreated: -1
    }
  }, {
    $limit: 10
  }]).toArray(function (err, data) {
    if (err) {
      throw new Error(err);
    }

    data.forEach(function (doc) {
      return _records.push(doc._id);
    });

    if (callback && _.isFunction(callback)) {
      callback();
    }
  });
};

async_recent_aggregate = Meteor.wrapAsync(recent_aggregate);

search_object = function (space, object_name, userId, searchText) {
  var _object, _object_collection, _object_name_key, data, fields, query, query_and, records, search_Keywords;

  data = new Array();

  if (searchText) {
    _object = Creator.getObject(object_name);
    _object_collection = Creator.getCollection(object_name);
    _object_name_key = _object != null ? _object.NAME_FIELD_KEY : void 0;

    if (_object && _object_collection && _object_name_key) {
      query = {};
      search_Keywords = searchText.split(" ");
      query_and = [];
      search_Keywords.forEach(function (keyword) {
        var subquery;
        subquery = {};
        subquery[_object_name_key] = {
          $regex: keyword.trim()
        };
        return query_and.push(subquery);
      });
      query.$and = query_and;
      query.space = {
        $in: [space]
      };
      fields = {
        _id: 1
      };
      fields[_object_name_key] = 1;
      records = _object_collection.find(query, {
        fields: fields,
        sort: {
          modified: 1
        },
        limit: 5
      });
      records.forEach(function (record) {
        return data.push({
          _id: record._id,
          _name: record[_object_name_key],
          _object_name: object_name
        });
      });
    }
  }

  return data;
};

Meteor.methods({
  'object_recent_record': function (spaceId) {
    var data, records;
    data = new Array();
    records = new Array();
    async_recent_aggregate(this.userId, spaceId, records);
    records.forEach(function (item) {
      var fields, record, record_object, record_object_collection;
      record_object = Creator.getObject(item.object_name, item.space);

      if (!record_object) {
        return;
      }

      record_object_collection = Creator.getCollection(item.object_name, item.space);

      if (record_object && record_object_collection) {
        fields = {
          _id: 1
        };
        fields[record_object.NAME_FIELD_KEY] = 1;
        record = record_object_collection.findOne(item.record_id[0], {
          fields: fields
        });

        if (record) {
          return data.push({
            _id: record._id,
            _name: record[record_object.NAME_FIELD_KEY],
            _object_name: item.object_name
          });
        }
      }
    });
    return data;
  },
  'object_record_search': function (options) {
    var data, searchText, self, space;
    self = this;
    data = new Array();
    searchText = options.searchText;
    space = options.space;

    _.forEach(Creator.objectsByName, function (_object, name) {
      var object_record;

      if (_object.enable_search) {
        object_record = search_object(space, _object.name, self.userId, searchText);
        return data = data.concat(object_record);
      }
    });

    return data;
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"object_listviews_options.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/methods/object_listviews_options.coffee                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  update_filters: function (listview_id, filters, filter_scope, filter_logic) {
    return Creator.Collections.object_listviews.direct.update({
      _id: listview_id
    }, {
      $set: {
        filters: filters,
        filter_scope: filter_scope,
        filter_logic: filter_logic
      }
    });
  },
  update_columns: function (listview_id, columns) {
    check(columns, Array);

    if (columns.length < 1) {
      throw new Meteor.Error(400, "Select at least one field to display");
    }

    return Creator.Collections.object_listviews.update({
      _id: listview_id
    }, {
      $set: {
        columns: columns
      }
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"report_data.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/methods/report_data.coffee                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  'report_data': function (options) {
    var compoundFields, cursor, fields, filterFields, filter_scope, filters, objectFields, object_name, ref, result, selector, space, userId;
    check(options, Object);
    space = options.space;
    fields = options.fields;
    object_name = options.object_name;
    filter_scope = options.filter_scope;
    filters = options.filters;
    filterFields = {};
    compoundFields = [];
    objectFields = (ref = Creator.getObject(object_name)) != null ? ref.fields : void 0;

    _.each(fields, function (item, index) {
      var childKey, name, objectField, splits;
      splits = item.split(".");
      name = splits[0];
      objectField = objectFields[name];

      if (splits.length > 1 && objectField) {
        childKey = item.replace(name + ".", "");
        compoundFields.push({
          name: name,
          childKey: childKey,
          field: objectField
        });
      }

      return filterFields[name] = 1;
    });

    selector = {};
    userId = this.userId;
    selector.space = space;

    if (filter_scope === "spacex") {
      selector.space = {
        $in: [null, space]
      };
    } else if (filter_scope === "mine") {
      selector.owner = userId;
    }

    if (Creator.isCommonSpace(space) && Creator.isSpaceAdmin(space, this.userId)) {
      delete selector.space;
    }

    if (filters && filters.length > 0) {
      selector["$and"] = filters;
    }

    cursor = Creator.getCollection(object_name).find(selector, {
      fields: filterFields,
      skip: 0,
      limit: 10000
    });
    result = cursor.fetch();

    if (compoundFields.length) {
      result = result.map(function (item, index) {
        _.each(compoundFields, function (compoundFieldItem, index) {
          var compoundFilterFields, itemKey, itemValue, ref1, referenceItem, reference_to, type;
          itemKey = compoundFieldItem.name + "*%*" + compoundFieldItem.childKey.replace(/\./g, "*%*");
          itemValue = item[compoundFieldItem.name];
          type = compoundFieldItem.field.type;

          if (["lookup", "master_detail"].indexOf(type) > -1) {
            reference_to = compoundFieldItem.field.reference_to;
            compoundFilterFields = {};
            compoundFilterFields[compoundFieldItem.childKey] = 1;
            referenceItem = Creator.getCollection(reference_to).findOne({
              _id: itemValue
            }, {
              fields: compoundFilterFields
            });

            if (referenceItem) {
              item[itemKey] = referenceItem[compoundFieldItem.childKey];
            }
          } else if (type === "select") {
            options = compoundFieldItem.field.options;
            item[itemKey] = ((ref1 = _.findWhere(options, {
              value: itemValue
            })) != null ? ref1.label : void 0) || itemValue;
          } else {
            item[itemKey] = itemValue;
          }

          if (!item[itemKey]) {
            return item[itemKey] = "--";
          }
        });

        return item;
      });
      return result;
    } else {
      return result;
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"user_tabular_settings.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/methods/user_tabular_settings.coffee                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
/*
    type: "user"
    object_name: "object_listviews"
    record_id: "{object_name},{listview_id}"
    settings:
        column_width: { field_a: 100, field_2: 150 }
        sort: [["field_a", "desc"]]
    owner: {userId}
 */Meteor.methods({
  "tabular_sort_settings": function (object_name, list_view_id, sort) {
    var doc, obj, setting, userId;
    userId = this.userId;
    setting = Creator.Collections.settings.findOne({
      object_name: object_name,
      record_id: "object_listviews",
      owner: userId
    });

    if (setting) {
      return Creator.Collections.settings.update({
        _id: setting._id
      }, {
        $set: (obj = {}, obj["settings." + list_view_id + ".sort"] = sort, obj)
      });
    } else {
      doc = {
        type: "user",
        object_name: object_name,
        record_id: "object_listviews",
        settings: {},
        owner: userId
      };
      doc.settings[list_view_id] = {};
      doc.settings[list_view_id].sort = sort;
      return Creator.Collections.settings.insert(doc);
    }
  },
  "tabular_column_width_settings": function (object_name, list_view_id, column_width) {
    var doc, obj, setting, userId;
    userId = this.userId;
    setting = Creator.Collections.settings.findOne({
      object_name: object_name,
      record_id: "object_listviews",
      owner: userId
    });

    if (setting) {
      return Creator.Collections.settings.update({
        _id: setting._id
      }, {
        $set: (obj = {}, obj["settings." + list_view_id + ".column_width"] = column_width, obj)
      });
    } else {
      doc = {
        type: "user",
        object_name: object_name,
        record_id: "object_listviews",
        settings: {},
        owner: userId
      };
      doc.settings[list_view_id] = {};
      doc.settings[list_view_id].column_width = column_width;
      return Creator.Collections.settings.insert(doc);
    }
  },
  "grid_settings": function (object_name, list_view_id, column_width, sort) {
    var doc, obj, obj1, ref, ref1, setting, userId;
    userId = this.userId;
    setting = Creator.Collections.settings.findOne({
      object_name: object_name,
      record_id: "object_gridviews",
      owner: userId
    });

    if (setting) {
      column_width._id_actions = ((ref = setting.settings["" + list_view_id]) != null ? (ref1 = ref.column_width) != null ? ref1._id_actions : void 0 : void 0) === 46 ? 47 : 46;

      if (sort) {
        return Creator.Collections.settings.update({
          _id: setting._id
        }, {
          $set: (obj = {}, obj["settings." + list_view_id + ".sort"] = sort, obj["settings." + list_view_id + ".column_width"] = column_width, obj)
        });
      } else {
        return Creator.Collections.settings.update({
          _id: setting._id
        }, {
          $set: (obj1 = {}, obj1["settings." + list_view_id + ".column_width"] = column_width, obj1)
        });
      }
    } else {
      doc = {
        type: "user",
        object_name: object_name,
        record_id: "object_gridviews",
        settings: {},
        owner: userId
      };
      doc.settings[list_view_id] = {};
      doc.settings[list_view_id].column_width = column_width;
      doc.settings[list_view_id].sort = sort;
      return Creator.Collections.settings.insert(doc);
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"object_export2xml.coffee":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/methods/object_export2xml.coffee                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _mixFieldsData, _mixRelatedData, _writeXmlFile, fs, logger, mkdirp, path, xml2js;

xml2js = require('xml2js');
fs = require('fs');
path = require('path');
mkdirp = require('mkdirp');
logger = new Logger('Export_TO_XML');

_writeXmlFile = function (jsonObj, objName) {
  var builder, day, fileAddress, fileName, filePath, month, now, stream, xml, year;
  builder = new xml2js.Builder();
  xml = builder.buildObject(jsonObj);
  stream = new Buffer(xml);
  now = new Date();
  year = now.getFullYear();
  month = now.getMonth() + 1;
  day = now.getDate();
  filePath = path.join(__meteor_bootstrap__.serverDir, '../../../export/' + year + '/' + month + '/' + day + '/' + objName);
  fileName = (jsonObj != null ? jsonObj._id : void 0) + ".xml";
  fileAddress = path.join(filePath, fileName);

  if (!fs.existsSync(filePath)) {
    mkdirp.sync(filePath);
  }

  fs.writeFile(fileAddress, stream, function (err) {
    if (err) {
      return logger.error(jsonObj._id + "写入xml文件失败", err);
    }
  });
  return filePath;
};

_mixFieldsData = function (obj, objName) {
  var jsonObj, mixBool, mixDate, mixDefault, objFields, ref;
  jsonObj = {};
  objFields = typeof Creator !== "undefined" && Creator !== null ? (ref = Creator.getObject(objName)) != null ? ref.fields : void 0 : void 0;

  mixDefault = function (field_name) {
    return jsonObj[field_name] = obj[field_name] || "";
  };

  mixDate = function (field_name, type) {
    var date, dateStr, format;
    date = obj[field_name];

    if (type === "date") {
      format = "YYYY-MM-DD";
    } else {
      format = "YYYY-MM-DD HH:mm:ss";
    }

    if (date != null && format != null) {
      dateStr = moment(date).format(format);
    }

    return jsonObj[field_name] = dateStr || "";
  };

  mixBool = function (field_name) {
    if (obj[field_name] === true) {
      return jsonObj[field_name] = "是";
    } else if (obj[field_name] === false) {
      return jsonObj[field_name] = "否";
    } else {
      return jsonObj[field_name] = "";
    }
  };

  _.each(objFields, function (field, field_name) {
    switch (field != null ? field.type : void 0) {
      case "date":
      case "datetime":
        return mixDate(field_name, field.type);

      case "boolean":
        return mixBool(field_name);

      default:
        return mixDefault(field_name);
    }
  });

  return jsonObj;
};

_mixRelatedData = function (obj, objName) {
  var relatedObjNames, related_objects;
  related_objects = {};
  relatedObjNames = typeof Creator !== "undefined" && Creator !== null ? Creator.getAllRelatedObjects(objName) : void 0;
  relatedObjNames.forEach(function (relatedObjName) {
    var fields, obj1, ref, relatedCollection, relatedRecordList, relatedTableData, related_field_name;
    relatedTableData = [];

    if (relatedObjName === "cms_files") {
      related_field_name = "parent.ids";
    } else {
      fields = typeof Creator !== "undefined" && Creator !== null ? (ref = Creator.Objects[relatedObjName]) != null ? ref.fields : void 0 : void 0;
      related_field_name = "";

      _.each(fields, function (field, field_name) {
        if ((field != null ? field.reference_to : void 0) === objName) {
          return related_field_name = field_name;
        }
      });
    }

    if (related_field_name) {
      relatedCollection = Creator.getCollection(relatedObjName);
      relatedRecordList = relatedCollection.find((obj1 = {}, obj1["" + related_field_name] = obj._id, obj1)).fetch();
      relatedRecordList.forEach(function (relatedObj) {
        var fieldsData;
        fieldsData = _mixFieldsData(relatedObj, relatedObjName);
        return relatedTableData.push(fieldsData);
      });
    }

    return related_objects[relatedObjName] = relatedTableData;
  });
  return related_objects;
};

Creator.Export2xml = function (objName, recordList) {
  var collection;
  logger.info("Run Creator.Export2xml");
  console.time("Creator.Export2xml");
  collection = Creator.getCollection(objName);
  recordList = collection.find({}).fetch();
  recordList.forEach(function (recordObj) {
    var fieldsData, filePath, jsonObj, related_objects;
    jsonObj = {};
    jsonObj._id = recordObj._id;
    fieldsData = _mixFieldsData(recordObj, objName);
    jsonObj[objName] = fieldsData;
    related_objects = _mixRelatedData(recordObj, objName);
    jsonObj["related_objects"] = related_objects;
    return filePath = _writeXmlFile(jsonObj, objName);
  });
  console.timeEnd("Creator.Export2xml");
  return filePath;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"related_objects_records.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/methods/related_objects_records.coffee                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  related_objects_records: function (object_name, related_object_name, related_field_name, record_id, spaceId) {
    var permissions, related_records, selector, userId;
    userId = this.userId;

    if (related_object_name === "cfs.files.filerecord") {
      selector = {
        "metadata.space": spaceId
      };
    } else {
      selector = {
        space: spaceId
      };
    }

    if (related_object_name === "cms_files") {
      selector["parent.o"] = object_name;
      selector["parent.ids"] = [record_id];
    } else {
      selector[related_field_name] = record_id;
    }

    permissions = Creator.getPermissions(related_object_name, spaceId, userId);

    if (!permissions.viewAllRecords && permissions.allowRead) {
      selector.owner = userId;
    }

    related_records = Creator.getCollection(related_object_name).find(selector);
    return related_records.count();
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"pending_space.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/methods/pending_space.coffee                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  getPendingSpaceInfo: function (inviterId, spaceId) {
    var inviterName, spaceName;
    inviterName = db.users.findOne({
      _id: inviterId
    }).name;
    spaceName = db.spaces.findOne({
      _id: spaceId
    }).name;
    return {
      inviter: inviterName,
      space: spaceName
    };
  },
  refuseJoinSpace: function (_id) {
    return db.space_users.direct.update({
      _id: _id
    }, {
      $set: {
        invite_state: "refused"
      }
    });
  },
  acceptJoinSpace: function (_id) {
    return db.space_users.direct.update({
      _id: _id
    }, {
      $set: {
        invite_state: "accepted",
        user_accepted: true
      }
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"publications":{"object.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/publications/object.coffee                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish("creator_object_record", function (object_name, id, space_id) {
  var collection;
  collection = Creator.getCollection(object_name, space_id);

  if (collection) {
    return collection.find({
      _id: id
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"object_tabular.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/publications/object_tabular.coffee                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publishComposite("steedos_object_tabular", function (tableName, ids, fields, spaceId) {
  var _fields, _keys, _object, _object_name, data, keys, object_colleciton, reference_fields, self;

  if (!this.userId) {
    return this.ready();
  }

  check(tableName, String);
  check(ids, Array);
  check(fields, Match.Optional(Object));
  _object_name = tableName.replace("creator_", "");
  _object = Creator.getObject(_object_name, spaceId);

  if (spaceId) {
    _object_name = Creator.getObjectName(_object);
  }

  object_colleciton = Creator.getCollection(_object_name);
  _fields = _object != null ? _object.fields : void 0;

  if (!_fields || !object_colleciton) {
    return this.ready();
  }

  reference_fields = _.filter(_fields, function (f) {
    return _.isFunction(f.reference_to) || !_.isEmpty(f.reference_to);
  });
  self = this;
  self.unblock();

  if (reference_fields.length > 0) {
    data = {
      find: function () {
        var field_keys;
        self.unblock();
        field_keys = {};

        _.each(_.keys(fields), function (f) {
          if (!/\w+(\.\$){1}\w?/.test(f)) {
            return field_keys[f] = 1;
          }
        });

        return object_colleciton.find({
          _id: {
            $in: ids
          }
        }, {
          fields: field_keys
        });
      }
    };
    data.children = [];
    keys = _.keys(fields);

    if (keys.length < 1) {
      keys = _.keys(_fields);
    }

    _keys = [];
    keys.forEach(function (key) {
      if (_object.schema._objectKeys[key + '.']) {
        _keys = _keys.concat(_.map(_object.schema._objectKeys[key + '.'], function (k) {
          return key + '.' + k;
        }));
      }

      return _keys.push(key);
    });

    _keys.forEach(function (key) {
      var reference_field;
      reference_field = _fields[key];

      if (reference_field && (_.isFunction(reference_field.reference_to) || !_.isEmpty(reference_field.reference_to))) {
        return data.children.push({
          find: function (parent) {
            var children_fields, e, name_field_key, p_k, query, reference_ids, reference_to, reference_to_object, s_k;

            try {
              self.unblock();
              query = {};

              if (/\w+(\.\$\.){1}\w+/.test(key)) {
                p_k = key.replace(/(\w+)\.\$\.\w+/ig, "$1");
                s_k = key.replace(/\w+\.\$\.(\w+)/ig, "$1");
                reference_ids = parent[p_k].getProperty(s_k);
              } else {
                reference_ids = key.split('.').reduce(function (o, x) {
                  return o != null ? o[x] : void 0;
                }, parent);
              }

              reference_to = reference_field.reference_to;

              if (_.isFunction(reference_to)) {
                reference_to = reference_to();
              }

              if (_.isArray(reference_to)) {
                if (_.isObject(reference_ids) && !_.isArray(reference_ids)) {
                  reference_to = reference_ids.o;
                  reference_ids = reference_ids.ids || [];
                } else {
                  return [];
                }
              }

              if (_.isArray(reference_ids)) {
                query._id = {
                  $in: reference_ids
                };
              } else {
                query._id = reference_ids;
              }

              reference_to_object = Creator.getObject(reference_to, spaceId);
              name_field_key = reference_to_object.NAME_FIELD_KEY;
              children_fields = {
                _id: 1,
                space: 1
              };

              if (name_field_key) {
                children_fields[name_field_key] = 1;
              }

              return Creator.getCollection(reference_to, spaceId).find(query, {
                fields: children_fields
              });
            } catch (error) {
              e = error;
              console.log(reference_to, parent, e);
              return [];
            }
          }
        });
      }
    });

    return data;
  } else {
    return {
      find: function () {
        self.unblock();
        return object_colleciton.find({
          _id: {
            $in: ids
          }
        }, {
          fields: fields
        });
      }
    };
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"object_listviews.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/publications/object_listviews.coffee                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish("object_listviews", function (object_name, spaceId) {
  var userId;
  userId = this.userId;
  return Creator.getCollection("object_listviews").find({
    object_name: object_name,
    space: spaceId,
    "$or": [{
      owner: userId
    }, {
      shared: true
    }]
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"user_tabular_settings.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/publications/user_tabular_settings.coffee                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish("user_tabular_settings", function (object_name) {
  var userId;
  userId = this.userId;
  return Creator.Collections.settings.find({
    object_name: {
      $in: object_name
    },
    record_id: {
      $in: ["object_listviews", "object_gridviews"]
    },
    owner: userId
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"related_objects_records.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/publications/related_objects_records.coffee                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish("related_objects_records", function (object_name, related_object_name, related_field_name, record_id, spaceId) {
  var permissions, selector, userId;
  userId = this.userId;

  if (related_object_name === "cfs.files.filerecord") {
    selector = {
      "metadata.space": spaceId
    };
  } else {
    selector = {
      space: spaceId
    };
  }

  if (related_object_name === "cms_files") {
    selector["parent.o"] = object_name;
    selector["parent.ids"] = [record_id];
  } else {
    selector[related_field_name] = record_id;
  }

  permissions = Creator.getPermissions(related_object_name, spaceId, userId);

  if (!permissions.viewAllRecords && permissions.allowRead) {
    selector.owner = userId;
  }

  return Creator.getCollection(related_object_name).find(selector);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"space_user_info.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/publications/space_user_info.coffee                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('space_user_info', function (spaceId, userId) {
  return Creator.getCollection("space_users").find({
    space: spaceId,
    user: userId
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"contacts_view_limits.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/publications/contacts_view_limits.coffee                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
if (Meteor.isServer) {
  Meteor.publish('contacts_view_limits', function (spaceId) {
    var selector;

    if (!this.userId) {
      return this.ready();
    }

    if (!spaceId) {
      return this.ready();
    }

    selector = {
      space: spaceId,
      key: 'contacts_view_limits'
    };
    return db.space_settings.find(selector);
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"contacts_no_force_phone_users.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/publications/contacts_no_force_phone_users.coffee                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
if (Meteor.isServer) {
  Meteor.publish('contacts_no_force_phone_users', function (spaceId) {
    var selector;

    if (!this.userId) {
      return this.ready();
    }

    if (!spaceId) {
      return this.ready();
    }

    selector = {
      space: spaceId,
      key: 'contacts_no_force_phone_users'
    };
    return db.space_settings.find(selector);
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"space_need_to_confirm.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/publications/space_need_to_confirm.coffee                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
if (Meteor.isServer) {
  Meteor.publish('space_need_to_confirm', function () {
    var userId;
    userId = this.userId;
    return db.space_users.find({
      user: userId,
      invite_state: "pending"
    });
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"lib":{"permission_manager.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/lib/permission_manager.coffee                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
permissionManagerForInitApproval = {};

permissionManagerForInitApproval.getFlowPermissions = function (flow_id, user_id) {
  var flow, my_permissions, org_ids, organizations, orgs_can_add, orgs_can_admin, orgs_can_monitor, space_id, users_can_add, users_can_admin, users_can_monitor;
  flow = uuflowManagerForInitApproval.getFlow(flow_id);
  space_id = flow.space;
  org_ids = new Array();
  organizations = db.organizations.find({
    space: space_id,
    users: user_id
  }, {
    fields: {
      parents: 1
    }
  }).fetch();

  _.each(organizations, function (org) {
    org_ids.push(org._id);

    if (org.parents) {
      return _.each(org.parents, function (parent_id) {
        return org_ids.push(parent_id);
      });
    }
  });

  org_ids = _.uniq(org_ids);
  my_permissions = new Array();

  if (flow.perms) {
    if (flow.perms.users_can_add) {
      users_can_add = flow.perms.users_can_add;

      if (users_can_add.includes(user_id)) {
        my_permissions.push("add");
      }
    }

    if (flow.perms.orgs_can_add) {
      orgs_can_add = flow.perms.orgs_can_add;

      _.each(org_ids, function (org_id) {
        if (orgs_can_add.includes(org_id)) {
          return my_permissions.push("add");
        }
      });
    }

    if (flow.perms.users_can_monitor) {
      users_can_monitor = flow.perms.users_can_monitor;

      if (users_can_monitor.includes(user_id)) {
        my_permissions.push("monitor");
      }
    }

    if (flow.perms.orgs_can_monitor) {
      orgs_can_monitor = flow.perms.orgs_can_monitor;

      _.each(org_ids, function (org_id) {
        if (orgs_can_monitor.includes(org_id)) {
          return my_permissions.push("monitor");
        }
      });
    }

    if (flow.perms.users_can_admin) {
      users_can_admin = flow.perms.users_can_admin;

      if (users_can_admin.includes(user_id)) {
        my_permissions.push("admin");
      }
    }

    if (flow.perms.orgs_can_admin) {
      orgs_can_admin = flow.perms.orgs_can_admin;

      _.each(org_ids, function (org_id) {
        if (orgs_can_admin.includes(org_id)) {
          return my_permissions.push("admin");
        }
      });
    }
  }

  my_permissions = _.uniq(my_permissions);
  return my_permissions;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"uuflowManagerForInitApproval.coffee":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/lib/uuflowManagerForInitApproval.coffee                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _eval, getObjectConfig, getObjectNameFieldKey, getRelateds, objectFind, objectFindOne, objectUpdate, objectql;

_eval = require('eval');
objectql = require('@steedos/objectql');

getObjectConfig = function (objectApiName) {
  return objectql.getObject(objectApiName).toConfig();
};

getObjectNameFieldKey = function (objectApiName) {
  return objectql.getObject(objectApiName).NAME_FIELD_KEY;
};

getRelateds = function (objectApiName) {
  return Meteor.wrapAsync(function (objectApiName, cb) {
    return objectql.getObject(objectApiName).getRelateds().then(function (resolve, reject) {
      return cb(reject, resolve);
    });
  })(objectApiName);
};

objectFindOne = function (objectApiName, query) {
  return Meteor.wrapAsync(function (objectApiName, query, cb) {
    return objectql.getObject(objectApiName).find(query).then(function (resolve, reject) {
      if (resolve && resolve.length > 0) {
        return cb(reject, resolve[0]);
      } else {
        return cb(reject, null);
      }
    });
  })(objectApiName, query);
};

objectFind = function (objectApiName, query) {
  return Meteor.wrapAsync(function (objectApiName, query, cb) {
    return objectql.getObject(objectApiName).find(query).then(function (resolve, reject) {
      return cb(reject, resolve);
    });
  })(objectApiName, query);
};

objectUpdate = function (objectApiName, id, data) {
  return Meteor.wrapAsync(function (objectApiName, id, data, cb) {
    return objectql.getObject(objectApiName).update(id, data).then(function (resolve, reject) {
      return cb(reject, resolve);
    });
  })(objectApiName, id, data);
};

uuflowManagerForInitApproval = {};

uuflowManagerForInitApproval.check_authorization = function (req) {
  var authToken, hashedToken, query, user, userId;
  query = req.query;
  userId = query["X-User-Id"];
  authToken = query["X-Auth-Token"];

  if (!userId || !authToken) {
    throw new Meteor.Error(401, 'Unauthorized');
  }

  hashedToken = Accounts._hashLoginToken(authToken);
  user = Meteor.users.findOne({
    _id: userId,
    "services.resume.loginTokens.hashedToken": hashedToken
  });

  if (!user) {
    throw new Meteor.Error(401, 'Unauthorized');
  }

  return user;
};

uuflowManagerForInitApproval.getSpace = function (space_id) {
  var space;
  space = Creator.Collections.spaces.findOne(space_id);

  if (!space) {
    throw new Meteor.Error('error!', "space_id有误或此space已经被删除");
  }

  return space;
};

uuflowManagerForInitApproval.getFlow = function (flow_id) {
  var flow;
  flow = Creator.Collections.flows.findOne(flow_id);

  if (!flow) {
    throw new Meteor.Error('error!', "id有误或此流程已经被删除");
  }

  return flow;
};

uuflowManagerForInitApproval.getSpaceUser = function (space_id, user_id) {
  var space_user;
  space_user = Creator.Collections.space_users.findOne({
    space: space_id,
    user: user_id
  });

  if (!space_user) {
    throw new Meteor.Error('error!', "user_id对应的用户不属于当前space");
  }

  return space_user;
};

uuflowManagerForInitApproval.getSpaceUserOrgInfo = function (space_user) {
  var info, org;
  info = new Object();
  info.organization = space_user.organization;
  org = Creator.Collections.organizations.findOne(space_user.organization, {
    fields: {
      name: 1,
      fullname: 1
    }
  });
  info.organization_name = org.name;
  info.organization_fullname = org.fullname;
  return info;
};

uuflowManagerForInitApproval.isFlowEnabled = function (flow) {
  if (flow.state !== "enabled") {
    throw new Meteor.Error('error!', "流程未启用,操作失败");
  }
};

uuflowManagerForInitApproval.isFlowSpaceMatched = function (flow, space_id) {
  if (flow.space !== space_id) {
    throw new Meteor.Error('error!', "流程和工作区ID不匹配");
  }
};

uuflowManagerForInitApproval.getForm = function (form_id) {
  var form;
  form = Creator.Collections.forms.findOne(form_id);

  if (!form) {
    throw new Meteor.Error('error!', '表单ID有误或此表单已经被删除');
  }

  return form;
};

uuflowManagerForInitApproval.getCategory = function (category_id) {
  return Creator.Collections.categories.findOne(category_id);
};

uuflowManagerForInitApproval.checkSyncDirection = function (object_name, flow_id) {
  var ow, syncDirection;
  ow = Creator.Collections.object_workflows.findOne({
    object_name: object_name,
    flow_id: flow_id
  });

  if (!ow) {
    throw new Meteor.Error('error!', '未找到对象流程映射记录。');
  }

  syncDirection = ow.sync_direction || 'both';

  if (!['both', 'obj_to_ins'].includes(syncDirection)) {
    throw new Meteor.Error('error!', '不支持的同步方向。');
  }
};

uuflowManagerForInitApproval.create_instance = function (instance_from_client, user_info) {
  var appr_obj, approve_from_client, category, flow, flow_id, form, ins_obj, new_ins_id, now, permissions, relatedTablesInfo, space, space_id, space_user, space_user_org_info, start_step, trace_from_client, trace_obj, user_id;
  check(instance_from_client["applicant"], String);
  check(instance_from_client["space"], String);
  check(instance_from_client["flow"], String);
  check(instance_from_client["record_ids"], [{
    o: String,
    ids: [String]
  }]);
  uuflowManagerForInitApproval.checkSyncDirection(instance_from_client["record_ids"][0].o, instance_from_client["flow"]);
  uuflowManagerForInitApproval.checkIsInApproval(instance_from_client["record_ids"][0], instance_from_client["space"]);
  space_id = instance_from_client["space"];
  flow_id = instance_from_client["flow"];
  user_id = user_info._id;
  trace_from_client = null;
  approve_from_client = null;

  if (instance_from_client["traces"] && instance_from_client["traces"][0]) {
    trace_from_client = instance_from_client["traces"][0];

    if (trace_from_client["approves"] && trace_from_client["approves"][0]) {
      approve_from_client = instance_from_client["traces"][0]["approves"][0];
    }
  }

  space = uuflowManagerForInitApproval.getSpace(space_id);
  flow = uuflowManagerForInitApproval.getFlow(flow_id);
  space_user = uuflowManagerForInitApproval.getSpaceUser(space_id, user_id);
  space_user_org_info = uuflowManagerForInitApproval.getSpaceUserOrgInfo(space_user);
  uuflowManagerForInitApproval.isFlowEnabled(flow);
  uuflowManagerForInitApproval.isFlowSpaceMatched(flow, space_id);
  form = uuflowManagerForInitApproval.getForm(flow.form);
  permissions = permissionManager.getFlowPermissions(flow_id, user_id);

  if (!permissions.includes("add")) {
    throw new Meteor.Error('error!', "当前用户没有此流程的新建权限");
  }

  now = new Date();
  ins_obj = {};
  ins_obj._id = Creator.Collections.instances._makeNewID();
  ins_obj.space = space_id;
  ins_obj.flow = flow_id;
  ins_obj.flow_version = flow.current._id;
  ins_obj.form = flow.form;
  ins_obj.form_version = flow.current.form_version;
  ins_obj.name = flow.name;
  ins_obj.submitter = user_id;
  ins_obj.submitter_name = user_info.name;
  ins_obj.applicant = instance_from_client["applicant"] ? instance_from_client["applicant"] : user_id;
  ins_obj.applicant_name = instance_from_client["applicant_name"] ? instance_from_client["applicant_name"] : user_info.name;
  ins_obj.applicant_organization = instance_from_client["applicant_organization"] ? instance_from_client["applicant_organization"] : space_user.organization;
  ins_obj.applicant_organization_name = instance_from_client["applicant_organization_name"] ? instance_from_client["applicant_organization_name"] : space_user_org_info.organization_name;
  ins_obj.applicant_organization_fullname = instance_from_client["applicant_organization_fullname"] ? instance_from_client["applicant_organization_fullname"] : space_user_org_info.organization_fullname;
  ins_obj.applicant_company = instance_from_client["applicant_company"] ? instance_from_client["applicant_company"] : space_user.company_id;
  ins_obj.state = 'draft';
  ins_obj.code = '';
  ins_obj.is_archived = false;
  ins_obj.is_deleted = false;
  ins_obj.created = now;
  ins_obj.created_by = user_id;
  ins_obj.modified = now;
  ins_obj.modified_by = user_id;
  ins_obj.record_ids = instance_from_client["record_ids"];

  if (space_user.company_id) {
    ins_obj.company_id = space_user.company_id;
  }

  trace_obj = {};
  trace_obj._id = new Mongo.ObjectID()._str;
  trace_obj.instance = ins_obj._id;
  trace_obj.is_finished = false;
  start_step = _.find(flow.current.steps, function (step) {
    return step.step_type === 'start';
  });
  trace_obj.step = start_step._id;
  trace_obj.name = start_step.name;
  trace_obj.start_date = now;
  appr_obj = {};
  appr_obj._id = new Mongo.ObjectID()._str;
  appr_obj.instance = ins_obj._id;
  appr_obj.trace = trace_obj._id;
  appr_obj.is_finished = false;
  appr_obj.user = instance_from_client["applicant"] ? instance_from_client["applicant"] : user_id;
  appr_obj.user_name = instance_from_client["applicant_name"] ? instance_from_client["applicant_name"] : user_info.name;
  appr_obj.handler = user_id;
  appr_obj.handler_name = user_info.name;
  appr_obj.handler_organization = space_user.organization;
  appr_obj.handler_organization_name = space_user_org_info.name;
  appr_obj.handler_organization_fullname = space_user_org_info.fullname;
  appr_obj.type = 'draft';
  appr_obj.start_date = now;
  appr_obj.read_date = now;
  appr_obj.is_read = true;
  appr_obj.is_error = false;
  appr_obj.description = '';
  relatedTablesInfo = {};
  appr_obj.values = uuflowManagerForInitApproval.initiateValues(ins_obj.record_ids[0], flow_id, space_id, form.current.fields, relatedTablesInfo);
  trace_obj.approves = [appr_obj];
  ins_obj.traces = [trace_obj];
  ins_obj.values = appr_obj.values;
  ins_obj.inbox_users = instance_from_client.inbox_users || [];
  ins_obj.current_step_name = start_step.name;

  if (flow.auto_remind === true) {
    ins_obj.auto_remind = true;
  }

  ins_obj.flow_name = flow.name;

  if (form.category) {
    category = uuflowManagerForInitApproval.getCategory(form.category);

    if (category) {
      ins_obj.category_name = category.name;
      ins_obj.category = category._id;
    }
  }

  new_ins_id = Creator.Collections.instances.insert(ins_obj);
  uuflowManagerForInitApproval.initiateRecordInstanceInfo(ins_obj.record_ids[0], new_ins_id, space_id);
  uuflowManagerForInitApproval.initiateAttach(ins_obj.record_ids[0], space_id, ins_obj._id, appr_obj._id);
  return new_ins_id;
};

uuflowManagerForInitApproval.initiateValues = function (recordIds, flowId, spaceId, fields, relatedTablesInfo) {
  var fieldCodes, filterValues, flow, form, formFields, formTableFields, formTableFieldsCode, getFieldOdataValue, getFormField, getFormTableField, getFormTableFieldCode, getFormTableSubField, getRelatedObjectFieldCode, getSelectOrgValue, getSelectOrgValues, getSelectUserValue, getSelectUserValues, object, objectName, ow, record, recordId, ref, relatedObjects, relatedObjectsKeys, tableFieldCodes, tableFieldMap, tableToRelatedMap, values;
  fieldCodes = [];

  _.each(fields, function (f) {
    if (f.type === 'section') {
      return _.each(f.fields, function (ff) {
        return fieldCodes.push(ff.code);
      });
    } else {
      return fieldCodes.push(f.code);
    }
  });

  values = {};
  objectName = recordIds.o;
  object = getObjectConfig(objectName);
  recordId = recordIds.ids[0];
  ow = Creator.Collections.object_workflows.findOne({
    object_name: objectName,
    flow_id: flowId
  });
  record = objectFindOne(objectName, {
    filters: [['_id', '=', recordId]]
  });
  flow = Creator.getCollection('flows').findOne(flowId, {
    fields: {
      form: 1
    }
  });

  if (ow && record) {
    form = Creator.getCollection("forms").findOne(flow.form);
    formFields = form.current.fields || [];
    relatedObjects = getRelateds(objectName);
    relatedObjectsKeys = _.pluck(relatedObjects, 'object_name');
    formTableFields = _.filter(formFields, function (formField) {
      return formField.type === 'table';
    });
    formTableFieldsCode = _.pluck(formTableFields, 'code');

    getRelatedObjectFieldCode = function (key) {
      return _.find(relatedObjectsKeys, function (relatedObjectsKey) {
        return key.startsWith(relatedObjectsKey + '.');
      });
    };

    getFormTableFieldCode = function (key) {
      return _.find(formTableFieldsCode, function (formTableFieldCode) {
        return key.startsWith(formTableFieldCode + '.');
      });
    };

    getFormTableField = function (key) {
      return _.find(formTableFields, function (f) {
        return f.code === key;
      });
    };

    getFormField = function (key) {
      var ff;
      ff = null;

      _.forEach(formFields, function (f) {
        if (ff) {
          return;
        }

        if (f.type === 'section') {
          return ff = _.find(f.fields, function (sf) {
            return sf.code === key;
          });
        } else if (f.code === key) {
          return ff = f;
        }
      });

      return ff;
    };

    getFormTableSubField = function (tableField, subFieldCode) {
      return _.find(tableField.fields, function (f) {
        return f.code === subFieldCode;
      });
    };

    getFieldOdataValue = function (objName, id, referenceToFieldName) {
      var _record, _records, nameKey, obj;

      obj = objectql.getObject(objName);
      nameKey = getObjectNameFieldKey(objName);

      if (!obj) {
        return;
      }

      if (_.isString(id)) {
        _record = objectFindOne(objName, {
          filters: [[referenceToFieldName, '=', id]]
        });

        if (_record) {
          _record['@label'] = _record[nameKey];
          return _record;
        }
      } else if (_.isArray(id)) {
        _records = [];
        objectFind(objName, {
          filters: [[referenceToFieldName, 'in', id]]
        }).forEach(function (_record) {
          _record['@label'] = _record[nameKey];
          return _records.push(_record);
        });

        if (!_.isEmpty(_records)) {
          return _records;
        }
      }
    };

    getSelectUserValue = function (userId, spaceId) {
      var su;
      su = Creator.getCollection('space_users').findOne({
        space: spaceId,
        user: userId
      });
      su.id = userId;
      return su;
    };

    getSelectUserValues = function (userIds, spaceId) {
      var sus;
      sus = [];

      if (_.isArray(userIds)) {
        _.each(userIds, function (userId) {
          var su;
          su = getSelectUserValue(userId, spaceId);

          if (su) {
            return sus.push(su);
          }
        });
      }

      return sus;
    };

    getSelectOrgValue = function (orgId, spaceId) {
      var org;
      org = Creator.getCollection('organizations').findOne(orgId, {
        fields: {
          _id: 1,
          name: 1,
          fullname: 1
        }
      });
      org.id = orgId;
      return org;
    };

    getSelectOrgValues = function (orgIds, spaceId) {
      var orgs;
      orgs = [];

      if (_.isArray(orgIds)) {
        _.each(orgIds, function (orgId) {
          var org;
          org = getSelectOrgValue(orgId, spaceId);

          if (org) {
            return orgs.push(org);
          }
        });
      }

      return orgs;
    };

    tableFieldCodes = [];
    tableFieldMap = [];
    tableToRelatedMap = {};

    if ((ref = ow.field_map) != null) {
      ref.forEach(function (fm) {
        var formField, formTableFieldCode, gridCode, lookupFieldName, lookupFieldObj, lookupObjectRecord, lookupSelectFieldValue, oTableCode, oTableCodeReferenceField, oTableCodeReferenceFieldCode, oTableFieldCode, objField, objectField, objectFieldName, objectFieldObjectName, objectLookupField, object_field, odataFieldValue, referenceToDoc, referenceToFieldName, referenceToFieldValue, referenceToObjectName, relatedObjectFieldCode, selectFieldValue, tableToRelatedMapKey, wTableCode, workflow_field;
        object_field = fm.object_field;
        workflow_field = fm.workflow_field;

        if (!object_field || !workflow_field) {
          throw new Meteor.Error(400, '未找到字段，请检查对象流程映射字段配置');
        }

        relatedObjectFieldCode = getRelatedObjectFieldCode(object_field);
        formTableFieldCode = getFormTableFieldCode(workflow_field);
        objField = object.fields[object_field];
        formField = getFormField(workflow_field);

        if (relatedObjectFieldCode) {
          oTableCode = object_field.split('.')[0];
          oTableFieldCode = object_field.split('.')[1];
          tableToRelatedMapKey = oTableCode;

          if (!tableToRelatedMap[tableToRelatedMapKey]) {
            tableToRelatedMap[tableToRelatedMapKey] = {};
          }

          if (formTableFieldCode) {
            wTableCode = workflow_field.split('.')[0];
            tableToRelatedMap[tableToRelatedMapKey]['_FROM_TABLE_CODE'] = wTableCode;
          }

          return tableToRelatedMap[tableToRelatedMapKey][oTableFieldCode] = workflow_field;
        } else if (workflow_field.indexOf('.') > 0 && object_field.indexOf('.$.') > 0) {
          wTableCode = workflow_field.split('.')[0];
          oTableCode = object_field.split('.$.')[0];

          if (record.hasOwnProperty(oTableCode) && _.isArray(record[oTableCode])) {
            tableFieldCodes.push(JSON.stringify({
              workflow_table_field_code: wTableCode,
              object_table_field_code: oTableCode
            }));
            return tableFieldMap.push(fm);
          } else if (oTableCode.indexOf('.') > 0) {
            oTableCodeReferenceFieldCode = oTableCode.split('.')[0];
            gridCode = oTableCode.split('.')[1];
            oTableCodeReferenceField = object.fields[oTableCodeReferenceFieldCode];

            if (oTableCodeReferenceField && ['lookup', 'master_detail'].includes(oTableCodeReferenceField.type) && _.isString(oTableCodeReferenceField.reference_to)) {
              if (record[oTableCode]) {
                return;
              }

              referenceToFieldName = oTableCodeReferenceField.reference_to_field || '_id';
              referenceToObjectName = oTableCodeReferenceField.reference_to;
              referenceToFieldValue = record[oTableCodeReferenceField.name];
              referenceToDoc = getFieldOdataValue(referenceToObjectName, referenceToFieldValue, referenceToFieldName);

              if (referenceToDoc[gridCode]) {
                record[oTableCode] = referenceToDoc[gridCode];
                tableFieldCodes.push(JSON.stringify({
                  workflow_table_field_code: wTableCode,
                  object_table_field_code: oTableCode
                }));
                return tableFieldMap.push(fm);
              }
            }
          }
        } else if (object_field.indexOf('.') > 0 && object_field.indexOf('.$.') === -1) {
          objectFieldName = object_field.split('.')[0];
          lookupFieldName = object_field.split('.')[1];

          if (object) {
            objectField = object.fields[objectFieldName];

            if (objectField && formField && ['lookup', 'master_detail'].includes(objectField.type) && _.isString(objectField.reference_to)) {
              lookupObjectRecord = objectFindOne(objectField.reference_to, {
                filters: [['_id', '=', record[objectFieldName]]],
                fields: [lookupFieldName]
              });

              if (!lookupObjectRecord) {
                return;
              }

              objectFieldObjectName = objectField.reference_to;
              lookupFieldObj = getObjectConfig(objectFieldObjectName);
              objectLookupField = lookupFieldObj.fields[lookupFieldName];
              referenceToFieldValue = lookupObjectRecord[lookupFieldName];

              if (objectLookupField && formField && formField.type === 'odata' && ['lookup', 'master_detail'].includes(objectLookupField.type) && _.isString(objectLookupField.reference_to)) {
                referenceToFieldName = objectLookupField.reference_to_field || '_id';
                referenceToObjectName = objectLookupField.reference_to;
                odataFieldValue;

                if (objectField.multiple && formField.is_multiselect) {
                  odataFieldValue = getFieldOdataValue(referenceToObjectName, referenceToFieldValue, referenceToFieldName);
                } else if (!objectField.multiple && !formField.is_multiselect) {
                  odataFieldValue = getFieldOdataValue(referenceToObjectName, referenceToFieldValue, referenceToFieldName);
                }

                return values[workflow_field] = odataFieldValue;
              } else if (objectLookupField && formField && ['user', 'group'].includes(formField.type) && ['lookup', 'master_detail'].includes(objectLookupField.type) && (['users', 'organizations'].includes(objectLookupField.reference_to) || 'space_users' === objectLookupField.reference_to && 'user' === objectLookupField.reference_to_field)) {
                if (!_.isEmpty(referenceToFieldValue)) {
                  lookupSelectFieldValue;

                  if (formField.type === 'user') {
                    if (objectLookupField.multiple && formField.is_multiselect) {
                      lookupSelectFieldValue = getSelectUserValues(referenceToFieldValue, spaceId);
                    } else if (!objectLookupField.multiple && !formField.is_multiselect) {
                      lookupSelectFieldValue = getSelectUserValue(referenceToFieldValue, spaceId);
                    }
                  } else if (formField.type === 'group') {
                    if (objectLookupField.multiple && formField.is_multiselect) {
                      lookupSelectFieldValue = getSelectOrgValues(referenceToFieldValue, spaceId);
                    } else if (!objectLookupField.multiple && !formField.is_multiselect) {
                      lookupSelectFieldValue = getSelectOrgValue(referenceToFieldValue, spaceId);
                    }
                  }

                  if (lookupSelectFieldValue) {
                    return values[workflow_field] = lookupSelectFieldValue;
                  }
                }
              } else {
                return values[workflow_field] = lookupObjectRecord[lookupFieldName];
              }
            }
          }
        } else if (formField && objField && formField.type === 'odata' && ['lookup', 'master_detail'].includes(objField.type) && _.isString(objField.reference_to)) {
          referenceToFieldName = objField.reference_to_field || '_id';
          referenceToObjectName = objField.reference_to;
          referenceToFieldValue = record[objField.name];
          odataFieldValue;

          if (objField.multiple && formField.is_multiselect) {
            odataFieldValue = getFieldOdataValue(referenceToObjectName, referenceToFieldValue, referenceToFieldName);
          } else if (!objField.multiple && !formField.is_multiselect) {
            odataFieldValue = getFieldOdataValue(referenceToObjectName, referenceToFieldValue, referenceToFieldName);
          }

          return values[workflow_field] = odataFieldValue;
        } else if (formField && objField && ['user', 'group'].includes(formField.type) && ['lookup', 'master_detail'].includes(objField.type) && (['users', 'organizations'].includes(objField.reference_to) || 'space_users' === objField.reference_to && 'user' === objField.reference_to_field)) {
          referenceToFieldValue = record[objField.name];

          if (!_.isEmpty(referenceToFieldValue)) {
            selectFieldValue;

            if (formField.type === 'user') {
              if (objField.multiple && formField.is_multiselect) {
                selectFieldValue = getSelectUserValues(referenceToFieldValue, spaceId);
              } else if (!objField.multiple && !formField.is_multiselect) {
                selectFieldValue = getSelectUserValue(referenceToFieldValue, spaceId);
              }
            } else if (formField.type === 'group') {
              if (objField.multiple && formField.is_multiselect) {
                selectFieldValue = getSelectOrgValues(referenceToFieldValue, spaceId);
              } else if (!objField.multiple && !formField.is_multiselect) {
                selectFieldValue = getSelectOrgValue(referenceToFieldValue, spaceId);
              }
            }

            if (selectFieldValue) {
              return values[workflow_field] = selectFieldValue;
            }
          }
        } else if (record.hasOwnProperty(object_field)) {
          return values[workflow_field] = record[object_field];
        }
      });
    }

    _.uniq(tableFieldCodes).forEach(function (tfc) {
      var c;
      c = JSON.parse(tfc);
      values[c.workflow_table_field_code] = [];
      return record[c.object_table_field_code].forEach(function (tr) {
        var newTr;
        newTr = {};

        _.each(tr, function (v, k) {
          return tableFieldMap.forEach(function (tfm) {
            var wTdCode;

            if (tfm.object_field === c.object_table_field_code + '.$.' + k) {
              wTdCode = tfm.workflow_field.split('.')[1];
              return newTr[wTdCode] = v;
            }
          });
        });

        if (!_.isEmpty(newTr)) {
          return values[c.workflow_table_field_code].push(newTr);
        }
      });
    });

    _.each(tableToRelatedMap, function (map, key) {
      var formTableField, relatedCollection, relatedField, relatedFieldName, relatedObject, relatedObjectName, relatedRecords, relatedTableItems, selector, tableCode, tableValues;
      tableCode = map._FROM_TABLE_CODE;
      formTableField = getFormTableField(tableCode);

      if (!tableCode) {
        return console.warn('tableToRelated: [' + key + '] missing corresponding table.');
      } else {
        relatedObjectName = key;
        tableValues = [];
        relatedTableItems = [];
        relatedObject = getObjectConfig(relatedObjectName);
        relatedField = _.find(relatedObject.fields, function (f) {
          return ['lookup', 'master_detail'].includes(f.type) && f.reference_to === objectName;
        });
        relatedFieldName = relatedField.name;
        selector = {};
        selector[relatedFieldName] = recordId;
        relatedCollection = Creator.getCollection(relatedObjectName, spaceId);
        relatedRecords = relatedCollection.find(selector);
        relatedRecords.forEach(function (rr) {
          var tableValueItem;
          tableValueItem = {};

          _.each(map, function (valueKey, fieldKey) {
            var formField, formFieldKey, referenceToFieldName, referenceToFieldValue, referenceToObjectName, relatedObjectField, tableFieldValue;

            if (fieldKey !== '_FROM_TABLE_CODE') {
              tableFieldValue;
              formFieldKey;

              if (valueKey.startsWith(tableCode + '.')) {
                formFieldKey = valueKey.split(".")[1];
              } else {
                formFieldKey = valueKey;
              }

              formField = getFormTableSubField(formTableField, formFieldKey);
              relatedObjectField = relatedObject.fields[fieldKey];

              if (!formField || !relatedObjectField) {
                return;
              }

              if (formField.type === 'odata' && ['lookup', 'master_detail'].includes(relatedObjectField.type) && _.isString(relatedObjectField.reference_to)) {
                referenceToFieldName = relatedObjectField.reference_to_field || '_id';
                referenceToObjectName = relatedObjectField.reference_to;
                referenceToFieldValue = rr[fieldKey];

                if (relatedObjectField.multiple && formField.is_multiselect) {
                  tableFieldValue = getFieldOdataValue(referenceToObjectName, referenceToFieldValue, referenceToFieldName);
                } else if (!relatedObjectField.multiple && !formField.is_multiselect) {
                  tableFieldValue = getFieldOdataValue(referenceToObjectName, referenceToFieldValue, referenceToFieldName);
                }
              } else if (['user', 'group'].includes(formField.type) && ['lookup', 'master_detail'].includes(relatedObjectField.type) && ['users', 'organizations'].includes(relatedObjectField.reference_to)) {
                referenceToFieldValue = rr[fieldKey];

                if (!_.isEmpty(referenceToFieldValue)) {
                  if (formField.type === 'user') {
                    if (relatedObjectField.multiple && formField.is_multiselect) {
                      tableFieldValue = getSelectUserValues(referenceToFieldValue, spaceId);
                    } else if (!relatedObjectField.multiple && !formField.is_multiselect) {
                      tableFieldValue = getSelectUserValue(referenceToFieldValue, spaceId);
                    }
                  } else if (formField.type === 'group') {
                    if (relatedObjectField.multiple && formField.is_multiselect) {
                      tableFieldValue = getSelectOrgValues(referenceToFieldValue, spaceId);
                    } else if (!relatedObjectField.multiple && !formField.is_multiselect) {
                      tableFieldValue = getSelectOrgValue(referenceToFieldValue, spaceId);
                    }
                  }
                }
              } else {
                tableFieldValue = rr[fieldKey];
              }

              return tableValueItem[formFieldKey] = tableFieldValue;
            }
          });

          if (!_.isEmpty(tableValueItem)) {
            tableValueItem._id = rr._id;
            tableValues.push(tableValueItem);
            return relatedTableItems.push({
              _table: {
                _id: rr._id,
                _code: tableCode
              }
            });
          }
        });
        values[tableCode] = tableValues;
        return relatedTablesInfo[relatedObjectName] = relatedTableItems;
      }
    });

    if (ow.field_map_script) {
      _.extend(values, uuflowManagerForInitApproval.evalFieldMapScript(ow.field_map_script, objectName, spaceId, recordId));
    }
  }

  filterValues = {};

  _.each(_.keys(values), function (k) {
    if (fieldCodes.includes(k)) {
      return filterValues[k] = values[k];
    }
  });

  return filterValues;
};

uuflowManagerForInitApproval.evalFieldMapScript = function (field_map_script, objectName, spaceId, objectId) {
  var func, record, script, values;
  record = objectFindOne(objectName, {
    filters: [['_id', '=', objectId]]
  });
  script = "module.exports = function (record) { " + field_map_script + " }";
  func = _eval(script, "field_map_script");
  values = func(record);

  if (_.isObject(values)) {
    return values;
  } else {
    console.error("evalFieldMapScript: 脚本返回值类型不是对象");
  }

  return {};
};

uuflowManagerForInitApproval.initiateAttach = function (recordIds, spaceId, insId, approveId) {
  Creator.Collections['cms_files'].find({
    space: spaceId,
    parent: recordIds
  }).forEach(function (cf) {
    return _.each(cf.versions, function (versionId, idx) {
      var f, newFile;
      f = Creator.Collections['cfs.files.filerecord'].findOne(versionId);
      newFile = new FS.File();
      return newFile.attachData(f.createReadStream('files'), {
        type: f.original.type
      }, function (err) {
        var metadata;

        if (err) {
          throw new Meteor.Error(err.error, err.reason);
        }

        newFile.name(f.name());
        newFile.size(f.size());
        metadata = {
          owner: f.metadata.owner,
          owner_name: f.metadata.owner_name,
          space: spaceId,
          instance: insId,
          approve: approveId,
          parent: cf._id
        };

        if (idx === 0) {
          metadata.current = true;
        }

        newFile.metadata = metadata;
        return cfs.instances.insert(newFile);
      });
    });
  });
};

uuflowManagerForInitApproval.initiateRecordInstanceInfo = function (recordIds, insId, spaceId) {
  objectUpdate(recordIds.o, recordIds.ids[0], {
    instances: [{
      _id: insId,
      state: 'draft'
    }],
    locked: true,
    instance_state: 'draft'
  });
};

uuflowManagerForInitApproval.initiateRelatedRecordInstanceInfo = function (relatedTablesInfo, insId, spaceId) {
  _.each(relatedTablesInfo, function (tableItems, relatedObjectName) {
    var relatedCollection;
    relatedCollection = Creator.getCollection(relatedObjectName, spaceId);
    return _.each(tableItems, function (item) {
      return relatedCollection.direct.update(item._table._id, {
        $set: {
          instances: [{
            _id: insId,
            state: 'draft'
          }],
          _table: item._table
        }
      });
    });
  });
};

uuflowManagerForInitApproval.checkIsInApproval = function (recordIds, spaceId) {
  var record;
  record = objectFindOne(recordIds.o, {
    filters: [['_id', '=', recordIds.ids[0]]],
    fields: ['instances']
  });

  if (record && record.instances && record.instances[0].state !== 'completed' && Creator.Collections.instances.find(record.instances[0]._id).count() > 0) {
    throw new Meteor.Error('error!', "此记录已发起流程正在审批中，待审批结束方可发起下一次审批！");
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"routes":{"api_workflow_drafts.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/routes/api_workflow_drafts.coffee                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
JsonRoutes.add('post', '/api/object/workflow/drafts', function (req, res, next) {
  var current_user_id, current_user_info, e, hashData, inserted_instances;

  try {
    current_user_info = uuflowManagerForInitApproval.check_authorization(req);
    current_user_id = current_user_info._id;
    hashData = req.body;
    inserted_instances = new Array();

    _.each(hashData['Instances'], function (instance_from_client) {
      var new_ins, new_ins_id;
      new_ins_id = uuflowManagerForInitApproval.create_instance(instance_from_client, current_user_info);
      new_ins = Creator.Collections.instances.findOne({
        _id: new_ins_id
      }, {
        fields: {
          space: 1,
          flow: 1,
          flow_version: 1,
          form: 1,
          form_version: 1
        }
      });
      return inserted_instances.push(new_ins);
    });

    return JsonRoutes.sendResult(res, {
      code: 200,
      data: {
        inserts: inserted_instances
      }
    });
  } catch (error) {
    e = error;
    console.error(e.stack);
    return JsonRoutes.sendResult(res, {
      code: 200,
      data: {
        errors: [{
          errorMessage: e.reason || e.message
        }]
      }
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:creator/checkNpm.js");
require("/node_modules/meteor/steedos:creator/core.coffee");
require("/node_modules/meteor/steedos:creator/lib/apps.coffee");
require("/node_modules/meteor/steedos:creator/server/methods/object_recent_viewed.coffee");
require("/node_modules/meteor/steedos:creator/server/methods/object_recent_record.coffee");
require("/node_modules/meteor/steedos:creator/server/methods/object_listviews_options.coffee");
require("/node_modules/meteor/steedos:creator/server/methods/report_data.coffee");
require("/node_modules/meteor/steedos:creator/server/methods/user_tabular_settings.coffee");
require("/node_modules/meteor/steedos:creator/server/methods/object_export2xml.coffee");
require("/node_modules/meteor/steedos:creator/server/methods/related_objects_records.coffee");
require("/node_modules/meteor/steedos:creator/server/methods/pending_space.coffee");
require("/node_modules/meteor/steedos:creator/server/publications/object.coffee");
require("/node_modules/meteor/steedos:creator/server/publications/object_tabular.coffee");
require("/node_modules/meteor/steedos:creator/server/publications/object_listviews.coffee");
require("/node_modules/meteor/steedos:creator/server/publications/user_tabular_settings.coffee");
require("/node_modules/meteor/steedos:creator/server/publications/related_objects_records.coffee");
require("/node_modules/meteor/steedos:creator/server/publications/space_user_info.coffee");
require("/node_modules/meteor/steedos:creator/server/publications/contacts_view_limits.coffee");
require("/node_modules/meteor/steedos:creator/server/publications/contacts_no_force_phone_users.coffee");
require("/node_modules/meteor/steedos:creator/server/publications/space_need_to_confirm.coffee");
require("/node_modules/meteor/steedos:creator/server/lib/permission_manager.coffee");
require("/node_modules/meteor/steedos:creator/server/lib/uuflowManagerForInitApproval.coffee");
require("/node_modules/meteor/steedos:creator/server/routes/api_workflow_drafts.coffee");

/* Exports */
Package._define("steedos:creator", {
  permissionManagerForInitApproval: permissionManagerForInitApproval,
  uuflowManagerForInitApproval: uuflowManagerForInitApproval
});

})();

//# sourceURL=meteor://💻app/packages/steedos_creator.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjcmVhdG9yL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvbGliL2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvb2JqZWN0X3JlY2VudF92aWV3ZWQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3ZpZXdlZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3JlY29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9yZWNlbnRfcmVjb3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9yZXBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3JlcG9ydF9kYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfZXhwb3J0MnhtbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9leHBvcnQyeG1sLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3JlbGF0ZWRfb2JqZWN0c19yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvcGVuZGluZ19zcGFjZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3BlbmRpbmdfc3BhY2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF90YWJ1bGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF9saXN0dmlld3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy91c2VyX3RhYnVsYXJfc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9yZWxhdGVkX29iamVjdHNfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV91c2VyX2luZm8uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c192aWV3X2xpbWl0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfdmlld19saW1pdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c19ub19mb3JjZV9waG9uZV91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9uZWVkX3RvX2NvbmZpcm0uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX25lZWRfdG9fY29uZmlybS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbGliL3Blcm1pc3Npb25fbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvcGVybWlzc2lvbl9tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImJ1c2JveSIsIk1ldGVvciIsInNldHRpbmdzIiwiY2ZzIiwiYWxpeXVuIiwiQ3JlYXRvciIsImdldFNjaGVtYSIsIm9iamVjdF9uYW1lIiwicmVmIiwiZ2V0T2JqZWN0Iiwic2NoZW1hIiwiZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCIsImdldE9iamVjdFVybCIsInJlY29yZF9pZCIsImFwcF9pZCIsImxpc3RfdmlldyIsImxpc3Rfdmlld19pZCIsIlNlc3Npb24iLCJnZXQiLCJnZXRMaXN0VmlldyIsIl9pZCIsImdldFJlbGF0aXZlVXJsIiwiZ2V0T2JqZWN0QWJzb2x1dGVVcmwiLCJTdGVlZG9zIiwiYWJzb2x1dGVVcmwiLCJnZXRPYmplY3RSb3V0ZXJVcmwiLCJnZXRMaXN0Vmlld1VybCIsInVybCIsImdldExpc3RWaWV3UmVsYXRpdmVVcmwiLCJnZXRTd2l0Y2hMaXN0VXJsIiwiZ2V0UmVsYXRlZE9iamVjdFVybCIsInJlbGF0ZWRfb2JqZWN0X25hbWUiLCJyZWxhdGVkX2ZpZWxkX25hbWUiLCJnZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMiLCJpc19kZWVwIiwiaXNfc2tpcF9oaWRlIiwiaXNfcmVsYXRlZCIsIl9vYmplY3QiLCJfb3B0aW9ucyIsImZpZWxkcyIsImljb24iLCJyZWxhdGVkT2JqZWN0cyIsIl8iLCJmb3JFYWNoIiwiZiIsImsiLCJoaWRkZW4iLCJ0eXBlIiwicHVzaCIsImxhYmVsIiwidmFsdWUiLCJyX29iamVjdCIsInJlZmVyZW5jZV90byIsImlzU3RyaW5nIiwiZjIiLCJrMiIsImdldFJlbGF0ZWRPYmplY3RzIiwiZWFjaCIsIl90aGlzIiwiX3JlbGF0ZWRPYmplY3QiLCJyZWxhdGVkT2JqZWN0IiwicmVsYXRlZE9wdGlvbnMiLCJyZWxhdGVkT3B0aW9uIiwiZm9yZWlnbl9rZXkiLCJuYW1lIiwiZ2V0T2JqZWN0RmlsdGVyRmllbGRPcHRpb25zIiwicGVybWlzc2lvbl9maWVsZHMiLCJnZXRGaWVsZHMiLCJpbmNsdWRlIiwidGVzdCIsImluZGV4T2YiLCJnZXRPYmplY3RGaWVsZE9wdGlvbnMiLCJnZXRGaWx0ZXJzV2l0aEZpbHRlckZpZWxkcyIsImZpbHRlcnMiLCJmaWx0ZXJfZmllbGRzIiwibGVuZ3RoIiwibiIsImZpZWxkIiwicmVxdWlyZWQiLCJmaW5kV2hlcmUiLCJpc19kZWZhdWx0IiwiaXNfcmVxdWlyZWQiLCJmaWx0ZXJJdGVtIiwibWF0Y2hGaWVsZCIsImZpbmQiLCJnZXRPYmplY3RSZWNvcmQiLCJzZWxlY3RfZmllbGRzIiwiZXhwYW5kIiwiY29sbGVjdGlvbiIsIm9iaiIsInJlY29yZCIsInJlZjEiLCJyZWYyIiwiaXNDbGllbnQiLCJUZW1wbGF0ZSIsImluc3RhbmNlIiwib2RhdGEiLCJkYXRhYmFzZV9uYW1lIiwiZ2V0Q29sbGVjdGlvbiIsImZpbmRPbmUiLCJnZXRPYmplY3RSZWNvcmROYW1lIiwibmFtZV9maWVsZF9rZXkiLCJOQU1FX0ZJRUxEX0tFWSIsImdldEFwcCIsImFwcCIsIkFwcHMiLCJkZXBzIiwiZGVwZW5kIiwiZ2V0QXBwRGFzaGJvYXJkIiwiZGFzaGJvYXJkIiwiRGFzaGJvYXJkcyIsImFwcHMiLCJnZXRBcHBEYXNoYm9hcmRDb21wb25lbnQiLCJnZXRBcHBPYmplY3ROYW1lcyIsImFwcE9iamVjdHMiLCJpc01vYmlsZSIsIm9iamVjdHMiLCJtb2JpbGVfb2JqZWN0cyIsInBlcm1pc3Npb25zIiwiYWxsb3dSZWFkIiwiZ2V0VXJsV2l0aFRva2VuIiwiZXhwcmVzc2lvbkZvcm1EYXRhIiwiaGFzUXVlcnlTeW1ib2wiLCJsaW5rU3RyIiwicGFyYW1zIiwic3BhY2VJZCIsInVzZXJJZCIsImdldFVzZXJDb21wYW55SWRzIiwiQWNjb3VudHMiLCJfc3RvcmVkTG9naW5Ub2tlbiIsImlzRXhwcmVzc2lvbiIsInBhcnNlU2luZ2xlRXhwcmVzc2lvbiIsIlVTRVJfQ09OVEVYVCIsIiQiLCJwYXJhbSIsImdldEFwcE1lbnUiLCJtZW51X2lkIiwibWVudXMiLCJnZXRBcHBNZW51cyIsIm1lbnUiLCJpZCIsImdldEFwcE1lbnVVcmxGb3JJbnRlcm5ldCIsInBhdGgiLCJnZXRBcHBNZW51VXJsIiwidGFyZ2V0IiwiYXBwTWVudXMiLCJjdXJlbnRBcHBNZW51cyIsIm1lbnVJdGVtIiwiY2hpbGRyZW4iLCJsb2FkQXBwc01lbnVzIiwiZGF0YSIsIm9wdGlvbnMiLCJtb2JpbGUiLCJzdWNjZXNzIiwic2V0IiwiYXV0aFJlcXVlc3QiLCJjcmVhdG9yQXBwc1NlbGVjdG9yIiwiYXNzaWduZWRfYXBwcyIsImFkbWluQXBwIiwiY3JlYXRvckFwcHMiLCJzb3J0ZWRBcHBzIiwia2V5IiwiaXNfY3JlYXRvciIsInZpc2libGUiLCJzb3J0QnkiLCJ2YWx1ZXMiLCJhZG1pbiIsInZpc2libGVBcHBzU2VsZWN0b3IiLCJpbmNsdWRlQWRtaW4iLCJnZXRWaXNpYmxlQXBwcyIsImNoYW5nZUFwcCIsIl9zdWJBcHAiLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRWaXNpYmxlQXBwc09iamVjdHMiLCJ2aXNpYmxlT2JqZWN0TmFtZXMiLCJmbGF0dGVuIiwicGx1Y2siLCJmaWx0ZXIiLCJPYmplY3RzIiwic29ydCIsInNvcnRpbmdNZXRob2QiLCJiaW5kIiwidW5pcSIsImdldEFwcHNPYmplY3RzIiwidGVtcE9iamVjdHMiLCJjb25jYXQiLCJ2YWxpZGF0ZUZpbHRlcnMiLCJsb2dpYyIsImUiLCJlcnJvck1zZyIsImZpbHRlcl9pdGVtcyIsImZpbHRlcl9sZW5ndGgiLCJmbGFnIiwiaW5kZXgiLCJ3b3JkIiwibWFwIiwiaXNFbXB0eSIsImNvbXBhY3QiLCJyZXBsYWNlIiwibWF0Y2giLCJpIiwiaW5jbHVkZXMiLCJ3IiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwidG9hc3RyIiwiZm9ybWF0RmlsdGVyc1RvTW9uZ28iLCJzZWxlY3RvciIsIkFycmF5Iiwib3BlcmF0aW9uIiwib3B0aW9uIiwicmVnIiwic3ViX3NlbGVjdG9yIiwiZXZhbHVhdGVGb3JtdWxhIiwiUmVnRXhwIiwiaXNCZXR3ZWVuRmlsdGVyT3BlcmF0aW9uIiwiZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzIiwiZm9ybWF0RmlsdGVyc1RvRGV2IiwibG9naWNUZW1wRmlsdGVycyIsImlzX2xvZ2ljX29yIiwicG9wIiwiU3RlZWRvc0ZpbHRlcnMiLCJmb3JtYXRMb2dpY0ZpbHRlcnNUb0RldiIsImZpbHRlcl9sb2dpYyIsImZvcm1hdF9sb2dpYyIsIngiLCJfZiIsImlzQXJyYXkiLCJKU09OIiwic3RyaW5naWZ5IiwicmVsYXRlZF9vYmplY3RfbmFtZXMiLCJyZWxhdGVkX29iamVjdHMiLCJ1bnJlbGF0ZWRfb2JqZWN0cyIsImdldE9iamVjdFJlbGF0ZWRzIiwiX2NvbGxlY3Rpb25fbmFtZSIsImdldFBlcm1pc3Npb25zIiwiZGlmZmVyZW5jZSIsInJlbGF0ZWRfb2JqZWN0IiwiaXNBY3RpdmUiLCJhbGxvd1JlYWRGaWxlcyIsImdldFJlbGF0ZWRPYmplY3ROYW1lcyIsImdldFJlbGF0ZWRPYmplY3RMaXN0QWN0aW9ucyIsInJlbGF0ZWRPYmplY3ROYW1lIiwiYWN0aW9ucyIsImdldEFjdGlvbnMiLCJhY3Rpb24iLCJvbiIsImRpc2FibGVkX2FjdGlvbnMiLCJoYXMiLCJhbGxvd19jdXN0b21BY3Rpb25zIiwia2V5cyIsImV4Y2x1ZGVfYWN0aW9ucyIsImdldExpc3RWaWV3cyIsImRpc2FibGVkX2xpc3Rfdmlld3MiLCJsaXN0Vmlld3MiLCJsaXN0X3ZpZXdzIiwib2JqZWN0IiwiaXRlbSIsIml0ZW1fbmFtZSIsImlzRGlzYWJsZWQiLCJvd25lciIsImZpZWxkc05hbWUiLCJ1bnJlYWRhYmxlX2ZpZWxkcyIsImdldE9iamVjdEZpZWxkc05hbWUiLCJpc2xvYWRpbmciLCJib290c3RyYXBMb2FkZWQiLCJjb252ZXJ0U3BlY2lhbENoYXJhY3RlciIsInN0ciIsImdldERpc2FibGVkRmllbGRzIiwiZmllbGROYW1lIiwiYXV0b2Zvcm0iLCJkaXNhYmxlZCIsIm9taXQiLCJnZXRIaWRkZW5GaWVsZHMiLCJnZXRGaWVsZHNXaXRoTm9Hcm91cCIsImdyb3VwIiwiZ2V0U29ydGVkRmllbGRHcm91cE5hbWVzIiwibmFtZXMiLCJ1bmlxdWUiLCJnZXRGaWVsZHNGb3JHcm91cCIsImdyb3VwTmFtZSIsImdldFN5c3RlbUJhc2VGaWVsZHMiLCJnZXRGaWVsZHNXaXRob3V0U3lzdGVtQmFzZSIsImdldEZpZWxkc1dpdGhvdXRPbWl0IiwicGljayIsImdldEZpZWxkc0luRmlyc3RMZXZlbCIsImZpcnN0TGV2ZWxLZXlzIiwiZ2V0RmllbGRzRm9yUmVvcmRlciIsImlzU2luZ2xlIiwiX2tleXMiLCJjaGlsZEtleXMiLCJpc193aWRlXzEiLCJpc193aWRlXzIiLCJzY18xIiwic2NfMiIsImVuZHNXaXRoIiwiaXNfd2lkZSIsInNsaWNlIiwiaXNGaWx0ZXJWYWx1ZUVtcHR5IiwiTnVtYmVyIiwiaXNOYU4iLCJnZXRGaWVsZERhdGFUeXBlIiwib2JqZWN0RmllbGRzIiwicmVzdWx0IiwiZGF0YV90eXBlIiwiaXNTZXJ2ZXIiLCJnZXRBbGxSZWxhdGVkT2JqZWN0cyIsInJlbGF0ZWRfZmllbGQiLCJlbmFibGVfZmlsZXMiLCJmb3JtYXRJbmRleCIsImFycmF5IiwiaW5kZXhOYW1lIiwiaXNkb2N1bWVudERCIiwiYmFja2dyb3VuZCIsImRhdGFzb3VyY2VzIiwiZG9jdW1lbnREQiIsImpvaW4iLCJzdWJzdHJpbmciLCJhcHBzQnlOYW1lIiwibWV0aG9kcyIsInNwYWNlX2lkIiwiY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkIiwiY3VycmVudF9yZWNlbnRfdmlld2VkIiwiZG9jIiwic3BhY2UiLCJ1cGRhdGUiLCIkaW5jIiwiY291bnQiLCIkc2V0IiwibW9kaWZpZWQiLCJEYXRlIiwibW9kaWZpZWRfYnkiLCJpbnNlcnQiLCJfbWFrZU5ld0lEIiwibyIsImlkcyIsImNyZWF0ZWQiLCJjcmVhdGVkX2J5IiwiYXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSIsInJlY2VudF9hZ2dyZWdhdGUiLCJzZWFyY2hfb2JqZWN0IiwiX3JlY29yZHMiLCJjYWxsYmFjayIsIkNvbGxlY3Rpb25zIiwib2JqZWN0X3JlY2VudF92aWV3ZWQiLCJyYXdDb2xsZWN0aW9uIiwiYWdncmVnYXRlIiwiJG1hdGNoIiwiJGdyb3VwIiwibWF4Q3JlYXRlZCIsIiRtYXgiLCIkc29ydCIsIiRsaW1pdCIsInRvQXJyYXkiLCJlcnIiLCJFcnJvciIsImlzRnVuY3Rpb24iLCJ3cmFwQXN5bmMiLCJzZWFyY2hUZXh0IiwiX29iamVjdF9jb2xsZWN0aW9uIiwiX29iamVjdF9uYW1lX2tleSIsInF1ZXJ5IiwicXVlcnlfYW5kIiwicmVjb3JkcyIsInNlYXJjaF9LZXl3b3JkcyIsInNwbGl0Iiwia2V5d29yZCIsInN1YnF1ZXJ5IiwiJHJlZ2V4IiwidHJpbSIsIiRhbmQiLCIkaW4iLCJsaW1pdCIsIl9uYW1lIiwiX29iamVjdF9uYW1lIiwicmVjb3JkX29iamVjdCIsInJlY29yZF9vYmplY3RfY29sbGVjdGlvbiIsInNlbGYiLCJvYmplY3RzQnlOYW1lIiwib2JqZWN0X3JlY29yZCIsImVuYWJsZV9zZWFyY2giLCJ1cGRhdGVfZmlsdGVycyIsImxpc3R2aWV3X2lkIiwiZmlsdGVyX3Njb3BlIiwib2JqZWN0X2xpc3R2aWV3cyIsImRpcmVjdCIsInVwZGF0ZV9jb2x1bW5zIiwiY29sdW1ucyIsImNoZWNrIiwiY29tcG91bmRGaWVsZHMiLCJjdXJzb3IiLCJmaWx0ZXJGaWVsZHMiLCJjaGlsZEtleSIsIm9iamVjdEZpZWxkIiwic3BsaXRzIiwiaXNDb21tb25TcGFjZSIsImlzU3BhY2VBZG1pbiIsInNraXAiLCJmZXRjaCIsImNvbXBvdW5kRmllbGRJdGVtIiwiY29tcG91bmRGaWx0ZXJGaWVsZHMiLCJpdGVtS2V5IiwiaXRlbVZhbHVlIiwicmVmZXJlbmNlSXRlbSIsInNldHRpbmciLCJjb2x1bW5fd2lkdGgiLCJvYmoxIiwiX2lkX2FjdGlvbnMiLCJfbWl4RmllbGRzRGF0YSIsIl9taXhSZWxhdGVkRGF0YSIsIl93cml0ZVhtbEZpbGUiLCJmcyIsImxvZ2dlciIsIm1rZGlycCIsInhtbDJqcyIsInJlcXVpcmUiLCJMb2dnZXIiLCJqc29uT2JqIiwib2JqTmFtZSIsImJ1aWxkZXIiLCJkYXkiLCJmaWxlQWRkcmVzcyIsImZpbGVOYW1lIiwiZmlsZVBhdGgiLCJtb250aCIsIm5vdyIsInN0cmVhbSIsInhtbCIsInllYXIiLCJCdWlsZGVyIiwiYnVpbGRPYmplY3QiLCJCdWZmZXIiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsIl9fbWV0ZW9yX2Jvb3RzdHJhcF9fIiwic2VydmVyRGlyIiwiZXhpc3RzU3luYyIsInN5bmMiLCJ3cml0ZUZpbGUiLCJtaXhCb29sIiwibWl4RGF0ZSIsIm1peERlZmF1bHQiLCJvYmpGaWVsZHMiLCJmaWVsZF9uYW1lIiwiZGF0ZSIsImRhdGVTdHIiLCJmb3JtYXQiLCJtb21lbnQiLCJyZWxhdGVkT2JqTmFtZXMiLCJyZWxhdGVkT2JqTmFtZSIsInJlbGF0ZWRDb2xsZWN0aW9uIiwicmVsYXRlZFJlY29yZExpc3QiLCJyZWxhdGVkVGFibGVEYXRhIiwicmVsYXRlZE9iaiIsImZpZWxkc0RhdGEiLCJFeHBvcnQyeG1sIiwicmVjb3JkTGlzdCIsImluZm8iLCJ0aW1lIiwicmVjb3JkT2JqIiwidGltZUVuZCIsInJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzIiwicmVsYXRlZF9yZWNvcmRzIiwidmlld0FsbFJlY29yZHMiLCJnZXRQZW5kaW5nU3BhY2VJbmZvIiwiaW52aXRlcklkIiwiaW52aXRlck5hbWUiLCJzcGFjZU5hbWUiLCJkYiIsInVzZXJzIiwic3BhY2VzIiwiaW52aXRlciIsInJlZnVzZUpvaW5TcGFjZSIsInNwYWNlX3VzZXJzIiwiaW52aXRlX3N0YXRlIiwiYWNjZXB0Sm9pblNwYWNlIiwidXNlcl9hY2NlcHRlZCIsInB1Ymxpc2giLCJwdWJsaXNoQ29tcG9zaXRlIiwidGFibGVOYW1lIiwiX2ZpZWxkcyIsIm9iamVjdF9jb2xsZWNpdG9uIiwicmVmZXJlbmNlX2ZpZWxkcyIsInJlYWR5IiwiU3RyaW5nIiwiTWF0Y2giLCJPcHRpb25hbCIsImdldE9iamVjdE5hbWUiLCJ1bmJsb2NrIiwiZmllbGRfa2V5cyIsIl9vYmplY3RLZXlzIiwicmVmZXJlbmNlX2ZpZWxkIiwicGFyZW50IiwiY2hpbGRyZW5fZmllbGRzIiwicF9rIiwicmVmZXJlbmNlX2lkcyIsInJlZmVyZW5jZV90b19vYmplY3QiLCJzX2siLCJnZXRQcm9wZXJ0eSIsInJlZHVjZSIsImlzT2JqZWN0Iiwic2hhcmVkIiwidXNlciIsInNwYWNlX3NldHRpbmdzIiwicGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwiLCJnZXRGbG93UGVybWlzc2lvbnMiLCJmbG93X2lkIiwidXNlcl9pZCIsImZsb3ciLCJteV9wZXJtaXNzaW9ucyIsIm9yZ19pZHMiLCJvcmdhbml6YXRpb25zIiwib3Jnc19jYW5fYWRkIiwib3Jnc19jYW5fYWRtaW4iLCJvcmdzX2Nhbl9tb25pdG9yIiwidXNlcnNfY2FuX2FkZCIsInVzZXJzX2Nhbl9hZG1pbiIsInVzZXJzX2Nhbl9tb25pdG9yIiwidXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbCIsImdldEZsb3ciLCJwYXJlbnRzIiwib3JnIiwicGFyZW50X2lkIiwicGVybXMiLCJvcmdfaWQiLCJfZXZhbCIsImdldE9iamVjdENvbmZpZyIsImdldE9iamVjdE5hbWVGaWVsZEtleSIsImdldFJlbGF0ZWRzIiwib2JqZWN0RmluZCIsIm9iamVjdEZpbmRPbmUiLCJvYmplY3RVcGRhdGUiLCJvYmplY3RxbCIsIm9iamVjdEFwaU5hbWUiLCJ0b0NvbmZpZyIsImNiIiwidGhlbiIsInJlc29sdmUiLCJyZWplY3QiLCJjaGVja19hdXRob3JpemF0aW9uIiwicmVxIiwiYXV0aFRva2VuIiwiaGFzaGVkVG9rZW4iLCJfaGFzaExvZ2luVG9rZW4iLCJnZXRTcGFjZSIsImZsb3dzIiwiZ2V0U3BhY2VVc2VyIiwic3BhY2VfdXNlciIsImdldFNwYWNlVXNlck9yZ0luZm8iLCJvcmdhbml6YXRpb24iLCJmdWxsbmFtZSIsIm9yZ2FuaXphdGlvbl9uYW1lIiwib3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwiaXNGbG93RW5hYmxlZCIsInN0YXRlIiwiaXNGbG93U3BhY2VNYXRjaGVkIiwiZ2V0Rm9ybSIsImZvcm1faWQiLCJmb3JtIiwiZm9ybXMiLCJnZXRDYXRlZ29yeSIsImNhdGVnb3J5X2lkIiwiY2F0ZWdvcmllcyIsImNoZWNrU3luY0RpcmVjdGlvbiIsIm93Iiwic3luY0RpcmVjdGlvbiIsIm9iamVjdF93b3JrZmxvd3MiLCJzeW5jX2RpcmVjdGlvbiIsImNyZWF0ZV9pbnN0YW5jZSIsImluc3RhbmNlX2Zyb21fY2xpZW50IiwidXNlcl9pbmZvIiwiYXBwcl9vYmoiLCJhcHByb3ZlX2Zyb21fY2xpZW50IiwiY2F0ZWdvcnkiLCJpbnNfb2JqIiwibmV3X2luc19pZCIsInJlbGF0ZWRUYWJsZXNJbmZvIiwic3BhY2VfdXNlcl9vcmdfaW5mbyIsInN0YXJ0X3N0ZXAiLCJ0cmFjZV9mcm9tX2NsaWVudCIsInRyYWNlX29iaiIsImNoZWNrSXNJbkFwcHJvdmFsIiwicGVybWlzc2lvbk1hbmFnZXIiLCJpbnN0YW5jZXMiLCJmbG93X3ZlcnNpb24iLCJjdXJyZW50IiwiZm9ybV92ZXJzaW9uIiwic3VibWl0dGVyIiwic3VibWl0dGVyX25hbWUiLCJhcHBsaWNhbnQiLCJhcHBsaWNhbnRfbmFtZSIsImFwcGxpY2FudF9vcmdhbml6YXRpb24iLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUiLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwiYXBwbGljYW50X2NvbXBhbnkiLCJjb21wYW55X2lkIiwiY29kZSIsImlzX2FyY2hpdmVkIiwiaXNfZGVsZXRlZCIsInJlY29yZF9pZHMiLCJNb25nbyIsIk9iamVjdElEIiwiX3N0ciIsImlzX2ZpbmlzaGVkIiwic3RlcHMiLCJzdGVwIiwic3RlcF90eXBlIiwic3RhcnRfZGF0ZSIsInRyYWNlIiwidXNlcl9uYW1lIiwiaGFuZGxlciIsImhhbmRsZXJfbmFtZSIsImhhbmRsZXJfb3JnYW5pemF0aW9uIiwiaGFuZGxlcl9vcmdhbml6YXRpb25fbmFtZSIsImhhbmRsZXJfb3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwicmVhZF9kYXRlIiwiaXNfcmVhZCIsImlzX2Vycm9yIiwiZGVzY3JpcHRpb24iLCJpbml0aWF0ZVZhbHVlcyIsImFwcHJvdmVzIiwidHJhY2VzIiwiaW5ib3hfdXNlcnMiLCJjdXJyZW50X3N0ZXBfbmFtZSIsImF1dG9fcmVtaW5kIiwiZmxvd19uYW1lIiwiY2F0ZWdvcnlfbmFtZSIsImluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvIiwiaW5pdGlhdGVBdHRhY2giLCJyZWNvcmRJZHMiLCJmbG93SWQiLCJmaWVsZENvZGVzIiwiZmlsdGVyVmFsdWVzIiwiZm9ybUZpZWxkcyIsImZvcm1UYWJsZUZpZWxkcyIsImZvcm1UYWJsZUZpZWxkc0NvZGUiLCJnZXRGaWVsZE9kYXRhVmFsdWUiLCJnZXRGb3JtRmllbGQiLCJnZXRGb3JtVGFibGVGaWVsZCIsImdldEZvcm1UYWJsZUZpZWxkQ29kZSIsImdldEZvcm1UYWJsZVN1YkZpZWxkIiwiZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSIsImdldFNlbGVjdE9yZ1ZhbHVlIiwiZ2V0U2VsZWN0T3JnVmFsdWVzIiwiZ2V0U2VsZWN0VXNlclZhbHVlIiwiZ2V0U2VsZWN0VXNlclZhbHVlcyIsIm9iamVjdE5hbWUiLCJyZWNvcmRJZCIsInJlbGF0ZWRPYmplY3RzS2V5cyIsInRhYmxlRmllbGRDb2RlcyIsInRhYmxlRmllbGRNYXAiLCJ0YWJsZVRvUmVsYXRlZE1hcCIsImZmIiwiZm9ybUZpZWxkIiwicmVsYXRlZE9iamVjdHNLZXkiLCJzdGFydHNXaXRoIiwiZm9ybVRhYmxlRmllbGRDb2RlIiwic2YiLCJ0YWJsZUZpZWxkIiwic3ViRmllbGRDb2RlIiwicmVmZXJlbmNlVG9GaWVsZE5hbWUiLCJfcmVjb3JkIiwibmFtZUtleSIsInN1IiwidXNlcklkcyIsInN1cyIsIm9yZ0lkIiwib3JnSWRzIiwib3JncyIsImZpZWxkX21hcCIsImZtIiwiZ3JpZENvZGUiLCJsb29rdXBGaWVsZE5hbWUiLCJsb29rdXBGaWVsZE9iaiIsImxvb2t1cE9iamVjdFJlY29yZCIsImxvb2t1cFNlbGVjdEZpZWxkVmFsdWUiLCJvVGFibGVDb2RlIiwib1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkIiwib1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkQ29kZSIsIm9UYWJsZUZpZWxkQ29kZSIsIm9iakZpZWxkIiwib2JqZWN0RmllbGROYW1lIiwib2JqZWN0RmllbGRPYmplY3ROYW1lIiwib2JqZWN0TG9va3VwRmllbGQiLCJvYmplY3RfZmllbGQiLCJvZGF0YUZpZWxkVmFsdWUiLCJyZWZlcmVuY2VUb0RvYyIsInJlZmVyZW5jZVRvRmllbGRWYWx1ZSIsInJlZmVyZW5jZVRvT2JqZWN0TmFtZSIsInJlbGF0ZWRPYmplY3RGaWVsZENvZGUiLCJzZWxlY3RGaWVsZFZhbHVlIiwidGFibGVUb1JlbGF0ZWRNYXBLZXkiLCJ3VGFibGVDb2RlIiwid29ya2Zsb3dfZmllbGQiLCJoYXNPd25Qcm9wZXJ0eSIsIndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGUiLCJvYmplY3RfdGFibGVfZmllbGRfY29kZSIsInJlZmVyZW5jZV90b19maWVsZCIsIm11bHRpcGxlIiwiaXNfbXVsdGlzZWxlY3QiLCJ0ZmMiLCJjIiwicGFyc2UiLCJ0ciIsIm5ld1RyIiwidGZtIiwid1RkQ29kZSIsImZvcm1UYWJsZUZpZWxkIiwicmVsYXRlZEZpZWxkIiwicmVsYXRlZEZpZWxkTmFtZSIsInJlbGF0ZWRSZWNvcmRzIiwicmVsYXRlZFRhYmxlSXRlbXMiLCJ0YWJsZUNvZGUiLCJ0YWJsZVZhbHVlcyIsIl9GUk9NX1RBQkxFX0NPREUiLCJ3YXJuIiwicnIiLCJ0YWJsZVZhbHVlSXRlbSIsInZhbHVlS2V5IiwiZmllbGRLZXkiLCJmb3JtRmllbGRLZXkiLCJyZWxhdGVkT2JqZWN0RmllbGQiLCJ0YWJsZUZpZWxkVmFsdWUiLCJfdGFibGUiLCJfY29kZSIsImZpZWxkX21hcF9zY3JpcHQiLCJleHRlbmQiLCJldmFsRmllbGRNYXBTY3JpcHQiLCJvYmplY3RJZCIsImZ1bmMiLCJzY3JpcHQiLCJpbnNJZCIsImFwcHJvdmVJZCIsImNmIiwidmVyc2lvbnMiLCJ2ZXJzaW9uSWQiLCJpZHgiLCJuZXdGaWxlIiwiRlMiLCJGaWxlIiwiYXR0YWNoRGF0YSIsImNyZWF0ZVJlYWRTdHJlYW0iLCJvcmlnaW5hbCIsIm1ldGFkYXRhIiwicmVhc29uIiwic2l6ZSIsIm93bmVyX25hbWUiLCJhcHByb3ZlIiwibG9ja2VkIiwiaW5zdGFuY2Vfc3RhdGUiLCJpbml0aWF0ZVJlbGF0ZWRSZWNvcmRJbnN0YW5jZUluZm8iLCJ0YWJsZUl0ZW1zIiwiSnNvblJvdXRlcyIsImFkZCIsInJlcyIsIm5leHQiLCJjdXJyZW50X3VzZXJfaWQiLCJjdXJyZW50X3VzZXJfaW5mbyIsImhhc2hEYXRhIiwiaW5zZXJ0ZWRfaW5zdGFuY2VzIiwiYm9keSIsIm5ld19pbnMiLCJzZW5kUmVzdWx0IiwiaW5zZXJ0cyIsInN0YWNrIiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMs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QUFSLENBQWNmLEVBQUVra0IsS0FBaEI7QUNXRSxXRFZGWixXQUFXVSxVQUFYLENBQXNCUixHQUF0QixFQUEyQjtBQUMxQjlKLFlBQU0sR0FEb0I7QUFFMUJqYyxZQUFNO0FBQUUwbUIsZ0JBQVEsQ0FBQztBQUFFQyx3QkFBY3BrQixFQUFFOGlCLE1BQUYsSUFBWTlpQixFQUFFcWtCO0FBQTlCLFNBQUQ7QUFBVjtBQUZvQixLQUEzQixDQ1VFO0FBVUQ7QUQxQ0gsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0Y2hlY2tOcG1WZXJzaW9uc1xufSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHRidXNib3k6IFwiXjAuMi4xM1wiLFxuXHRcInhtbDJqc1wiOiBcIl4wLjQuMTlcIixcbn0sICdzdGVlZG9zOmNyZWF0b3InKTtcblxuaWYgKE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzICYmIE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKSB7XG5cdGNoZWNrTnBtVmVyc2lvbnMoe1xuXHRcdFwiYWxpeXVuLXNka1wiOiBcIl4xLjExLjEyXCJcblx0fSwgJ3N0ZWVkb3M6Y3JlYXRvcicpO1xufSIsIlxuXHQjIENyZWF0b3IuaW5pdEFwcHMoKVxuXG5cbiMgQ3JlYXRvci5pbml0QXBwcyA9ICgpLT5cbiMgXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcbiMgXHRcdF8uZWFjaCBDcmVhdG9yLkFwcHMsIChhcHAsIGFwcF9pZCktPlxuIyBcdFx0XHRkYl9hcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKVxuIyBcdFx0XHRpZiAhZGJfYXBwXG4jIFx0XHRcdFx0YXBwLl9pZCA9IGFwcF9pZFxuIyBcdFx0XHRcdGRiLmFwcHMuaW5zZXJ0KGFwcClcbiMgZWxzZVxuIyBcdGFwcC5faWQgPSBhcHBfaWRcbiMgXHRkYi5hcHBzLnVwZGF0ZSh7X2lkOiBhcHBfaWR9LCBhcHApXG5cbkNyZWF0b3IuZ2V0U2NoZW1hID0gKG9iamVjdF9uYW1lKS0+XG5cdHJldHVybiBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk/LnNjaGVtYVxuXG5DcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQgPSAob2JqZWN0X25hbWUpLT5cblx0IyBpZiBNZXRlb3IuaXNDbGllbnRcblx0IyBcdHJldHVybiBCdWlsZGVyQ3JlYXRvci5wbHVnaW5Db21wb25lbnRTZWxlY3RvcihCdWlsZGVyQ3JlYXRvci5zdG9yZS5nZXRTdGF0ZSgpLCBcIk9iamVjdEhvbWVcIiwgb2JqZWN0X25hbWUpXG5cdHJldHVybiBmYWxzZTtcblxuQ3JlYXRvci5nZXRPYmplY3RVcmwgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSAtPlxuXHRpZiAhYXBwX2lkXG5cdFx0YXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcblx0aWYgIW9iamVjdF9uYW1lXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0bGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbClcblx0bGlzdF92aWV3X2lkID0gbGlzdF92aWV3Py5faWRcblxuXHRpZiByZWNvcmRfaWRcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZClcblx0ZWxzZVxuXHRcdGlmIENyZWF0b3IuZ2V0T2JqZWN0SG9tZUNvbXBvbmVudChvYmplY3RfbmFtZSlcblx0XHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUpXG5cdFx0ZWxzZVxuXHRcdFx0aWYgbGlzdF92aWV3X2lkXG5cdFx0XHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lKVxuXG5DcmVhdG9yLmdldE9iamVjdEFic29sdXRlVXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cblx0aWYgIWFwcF9pZFxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXG5cdGxpc3Rfdmlld19pZCA9IGxpc3Rfdmlldz8uX2lkXG5cblx0aWYgcmVjb3JkX2lkXG5cdFx0cmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQsIHRydWUpXG5cdGVsc2Vcblx0XHRyZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCwgdHJ1ZSlcblxuQ3JlYXRvci5nZXRPYmplY3RSb3V0ZXJVcmwgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSAtPlxuXHRpZiAhYXBwX2lkXG5cdFx0YXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcblx0aWYgIW9iamVjdF9uYW1lXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0bGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbClcblx0bGlzdF92aWV3X2lkID0gbGlzdF92aWV3Py5faWRcblxuXHRpZiByZWNvcmRfaWRcblx0XHRyZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWRcblx0ZWxzZVxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZFxuXG5DcmVhdG9yLmdldExpc3RWaWV3VXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cblx0dXJsID0gQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZClcblx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwodXJsKVxuXG5DcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwgPSAob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSAtPlxuXHRyZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWRcblxuQ3JlYXRvci5nZXRTd2l0Y2hMaXN0VXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cblx0aWYgbGlzdF92aWV3X2lkXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgbGlzdF92aWV3X2lkICsgXCIvbGlzdFwiKVxuXHRlbHNlXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2xpc3Qvc3dpdGNoXCIpXG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdFVybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCByZWNvcmRfaWQsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSkgLT5cblx0aWYgcmVsYXRlZF9maWVsZF9uYW1lXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgcmVjb3JkX2lkICsgXCIvXCIgKyByZWxhdGVkX29iamVjdF9uYW1lICsgXCIvZ3JpZD9yZWxhdGVkX2ZpZWxkX25hbWU9XCIgKyByZWxhdGVkX2ZpZWxkX25hbWUpXG5cdGVsc2Vcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyByZWNvcmRfaWQgKyBcIi9cIiArIHJlbGF0ZWRfb2JqZWN0X25hbWUgKyBcIi9ncmlkXCIpXG5cbkNyZWF0b3IuZ2V0T2JqZWN0TG9va3VwRmllbGRPcHRpb25zID0gKG9iamVjdF9uYW1lLCBpc19kZWVwLCBpc19za2lwX2hpZGUsIGlzX3JlbGF0ZWQpLT5cblx0X29wdGlvbnMgPSBbXVxuXHR1bmxlc3Mgb2JqZWN0X25hbWVcblx0XHRyZXR1cm4gX29wdGlvbnNcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRmaWVsZHMgPSBfb2JqZWN0Py5maWVsZHNcblx0aWNvbiA9IF9vYmplY3Q/Lmljb25cblx0Xy5mb3JFYWNoIGZpZWxkcywgKGYsIGspLT5cblx0XHRpZiBpc19za2lwX2hpZGUgYW5kIGYuaGlkZGVuXG5cdFx0XHRyZXR1cm5cblx0XHRpZiBmLnR5cGUgPT0gXCJzZWxlY3RcIlxuXHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IFwiI3tmLmxhYmVsIHx8IGt9XCIsIHZhbHVlOiBcIiN7a31cIiwgaWNvbjogaWNvbn1cblx0XHRlbHNlXG5cdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogZi5sYWJlbCB8fCBrLCB2YWx1ZTogaywgaWNvbjogaWNvbn1cblx0aWYgaXNfZGVlcFxuXHRcdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XG5cdFx0XHRpZiBpc19za2lwX2hpZGUgYW5kIGYuaGlkZGVuXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0aWYgKGYudHlwZSA9PSBcImxvb2t1cFwiIHx8IGYudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIikgJiYgZi5yZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhmLnJlZmVyZW5jZV90bylcblx0XHRcdFx0IyDkuI3mlK/mjIFmLnJlZmVyZW5jZV90b+S4umZ1bmN0aW9u55qE5oOF5Ya177yM5pyJ6ZyA5rGC5YaN6K+0XG5cdFx0XHRcdHJfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoZi5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdGlmIHJfb2JqZWN0XG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJfb2JqZWN0LmZpZWxkcywgKGYyLCBrMiktPlxuXHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IFwiI3tmLmxhYmVsIHx8IGt9PT4je2YyLmxhYmVsIHx8IGsyfVwiLCB2YWx1ZTogXCIje2t9LiN7azJ9XCIsIGljb246IHJfb2JqZWN0Py5pY29ufVxuXHRpZiBpc19yZWxhdGVkXG5cdFx0cmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKVxuXHRcdF8uZWFjaCByZWxhdGVkT2JqZWN0cywgKF9yZWxhdGVkT2JqZWN0KT0+XG5cdFx0XHRyZWxhdGVkT3B0aW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0TG9va3VwRmllbGRPcHRpb25zKF9yZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lLCBmYWxzZSwgZmFsc2UsIGZhbHNlKVxuXHRcdFx0cmVsYXRlZE9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9yZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lKVxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRPcHRpb25zLCAocmVsYXRlZE9wdGlvbiktPlxuXHRcdFx0XHRpZiBfcmVsYXRlZE9iamVjdC5mb3JlaWduX2tleSAhPSByZWxhdGVkT3B0aW9uLnZhbHVlXG5cdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IFwiI3tyZWxhdGVkT2JqZWN0LmxhYmVsIHx8IHJlbGF0ZWRPYmplY3QubmFtZX09PiN7cmVsYXRlZE9wdGlvbi5sYWJlbH1cIiwgdmFsdWU6IFwiI3tyZWxhdGVkT2JqZWN0Lm5hbWV9LiN7cmVsYXRlZE9wdGlvbi52YWx1ZX1cIiwgaWNvbjogcmVsYXRlZE9iamVjdD8uaWNvbn1cblx0cmV0dXJuIF9vcHRpb25zXG5cbiMg57uf5LiA5Li65a+56LGhb2JqZWN0X25hbWXmj5Dkvpvlj6/nlKjkuo7ov4fomZHlmajov4fomZHlrZfmrrVcbkNyZWF0b3IuZ2V0T2JqZWN0RmlsdGVyRmllbGRPcHRpb25zID0gKG9iamVjdF9uYW1lKS0+XG5cdF9vcHRpb25zID0gW11cblx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIF9vcHRpb25zXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0ZmllbGRzID0gX29iamVjdD8uZmllbGRzXG5cdHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpXG5cdGljb24gPSBfb2JqZWN0Py5pY29uXG5cdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XG5cdFx0IyBoaWRkZW4sZ3JpZOetieexu+Wei+eahOWtl+aute+8jOS4jemcgOimgei/h+a7pFxuXHRcdGlmICFfLmluY2x1ZGUoW1wiZ3JpZFwiLFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiLCBcImF2YXRhclwiLCBcImltYWdlXCIsIFwibWFya2Rvd25cIiwgXCJodG1sXCJdLCBmLnR5cGUpIGFuZCAhZi5oaWRkZW5cblx0XHRcdCMgZmlsdGVycy4kLmZpZWxk5Y+KZmxvdy5jdXJyZW50562J5a2Q5a2X5q615Lmf5LiN6ZyA6KaB6L+H5rukXG5cdFx0XHRpZiAhL1xcdytcXC4vLnRlc3QoaykgYW5kIF8uaW5kZXhPZihwZXJtaXNzaW9uX2ZpZWxkcywgaykgPiAtMVxuXHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogZi5sYWJlbCB8fCBrLCB2YWx1ZTogaywgaWNvbjogaWNvbn1cblxuXHRyZXR1cm4gX29wdGlvbnNcblxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZE9wdGlvbnMgPSAob2JqZWN0X25hbWUpLT5cblx0X29wdGlvbnMgPSBbXVxuXHR1bmxlc3Mgb2JqZWN0X25hbWVcblx0XHRyZXR1cm4gX29wdGlvbnNcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRmaWVsZHMgPSBfb2JqZWN0Py5maWVsZHNcblx0cGVybWlzc2lvbl9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhvYmplY3RfbmFtZSlcblx0aWNvbiA9IF9vYmplY3Q/Lmljb25cblx0Xy5mb3JFYWNoIGZpZWxkcywgKGYsIGspLT5cblx0XHRpZiAhXy5pbmNsdWRlKFtcImdyaWRcIixcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSlcblx0XHRcdGlmICEvXFx3K1xcLi8udGVzdChrKSBhbmQgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xXG5cdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBmLmxhYmVsIHx8IGssIHZhbHVlOiBrLCBpY29uOiBpY29ufVxuXHRyZXR1cm4gX29wdGlvbnNcblxuIyMjXG5maWx0ZXJzOiDopoHovazmjaLnmoRmaWx0ZXJzXG5maWVsZHM6IOWvueixoeWtl+autVxuZmlsdGVyX2ZpZWxkczog6buY6K6k6L+H5ruk5a2X5q6177yM5pSv5oyB5a2X56ym5Liy5pWw57uE5ZKM5a+56LGh5pWw57uE5Lik56eN5qC85byP77yM5aaCOlsnZmlsZWRfbmFtZTEnLCdmaWxlZF9uYW1lMiddLFt7ZmllbGQ6J2ZpbGVkX25hbWUxJyxyZXF1aXJlZDp0cnVlfV1cbuWkhOeQhumAu+i+kTog5oqKZmlsdGVyc+S4reWtmOWcqOS6jmZpbHRlcl9maWVsZHPnmoTov4fmu6TmnaHku7blop7liqDmr4/pobnnmoRpc19kZWZhdWx044CBaXNfcmVxdWlyZWTlsZ7mgKfvvIzkuI3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25a+55bqU55qE56e76Zmk5q+P6aG555qE55u45YWz5bGe5oCnXG7ov5Tlm57nu5Pmnpw6IOWkhOeQhuWQjueahGZpbHRlcnNcbiMjI1xuQ3JlYXRvci5nZXRGaWx0ZXJzV2l0aEZpbHRlckZpZWxkcyA9IChmaWx0ZXJzLCBmaWVsZHMsIGZpbHRlcl9maWVsZHMpLT5cblx0dW5sZXNzIGZpbHRlcnNcblx0XHRmaWx0ZXJzID0gW11cblx0dW5sZXNzIGZpbHRlcl9maWVsZHNcblx0XHRmaWx0ZXJfZmllbGRzID0gW11cblx0aWYgZmlsdGVyX2ZpZWxkcz8ubGVuZ3RoXG5cdFx0ZmlsdGVyX2ZpZWxkcy5mb3JFYWNoIChuKS0+XG5cdFx0XHRpZiBfLmlzU3RyaW5nKG4pXG5cdFx0XHRcdG4gPSBcblx0XHRcdFx0XHRmaWVsZDogbixcblx0XHRcdFx0XHRyZXF1aXJlZDogZmFsc2Vcblx0XHRcdGlmIGZpZWxkc1tuLmZpZWxkXSBhbmQgIV8uZmluZFdoZXJlKGZpbHRlcnMse2ZpZWxkOm4uZmllbGR9KVxuXHRcdFx0XHRmaWx0ZXJzLnB1c2hcblx0XHRcdFx0XHRmaWVsZDogbi5maWVsZCxcblx0XHRcdFx0XHRpc19kZWZhdWx0OiB0cnVlLFxuXHRcdFx0XHRcdGlzX3JlcXVpcmVkOiBuLnJlcXVpcmVkXG5cdGZpbHRlcnMuZm9yRWFjaCAoZmlsdGVySXRlbSktPlxuXHRcdG1hdGNoRmllbGQgPSBmaWx0ZXJfZmllbGRzLmZpbmQgKG4pLT4gcmV0dXJuIG4gPT0gZmlsdGVySXRlbS5maWVsZCBvciBuLmZpZWxkID09IGZpbHRlckl0ZW0uZmllbGRcblx0XHRpZiBfLmlzU3RyaW5nKG1hdGNoRmllbGQpXG5cdFx0XHRtYXRjaEZpZWxkID0gXG5cdFx0XHRcdGZpZWxkOiBtYXRjaEZpZWxkLFxuXHRcdFx0XHRyZXF1aXJlZDogZmFsc2Vcblx0XHRpZiBtYXRjaEZpZWxkXG5cdFx0XHRmaWx0ZXJJdGVtLmlzX2RlZmF1bHQgPSB0cnVlXG5cdFx0XHRmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkID0gbWF0Y2hGaWVsZC5yZXF1aXJlZFxuXHRcdGVsc2Vcblx0XHRcdGRlbGV0ZSBmaWx0ZXJJdGVtLmlzX2RlZmF1bHRcblx0XHRcdGRlbGV0ZSBmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkXG5cdHJldHVybiBmaWx0ZXJzXG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZCktPlxuXG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGlmICFyZWNvcmRfaWRcblx0XHRyZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiBvYmplY3RfbmFtZSA9PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpICYmICByZWNvcmRfaWQgPT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcblx0XHRcdGlmIFRlbXBsYXRlLmluc3RhbmNlKCk/LnJlY29yZFxuXHRcdFx0XHRyZXR1cm4gVGVtcGxhdGUuaW5zdGFuY2UoKT8ucmVjb3JkPy5nZXQoKVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpXG5cblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0aWYgb2JqLmRhdGFiYXNlX25hbWUgPT0gXCJtZXRlb3JcIiB8fCAhb2JqLmRhdGFiYXNlX25hbWVcblx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxuXHRcdGlmIGNvbGxlY3Rpb25cblx0XHRcdHJlY29yZCA9IGNvbGxlY3Rpb24uZmluZE9uZShyZWNvcmRfaWQpXG5cdFx0XHRyZXR1cm4gcmVjb3JkXG5cdGVsc2UgaWYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkXG5cdFx0cmV0dXJuIENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZClcblxuQ3JlYXRvci5nZXRPYmplY3RSZWNvcmROYW1lID0gKHJlY29yZCwgb2JqZWN0X25hbWUpLT5cblx0dW5sZXNzIHJlY29yZFxuXHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKClcblx0aWYgcmVjb3JkXG5cdFx0IyDmmL7npLrnu4Tnu4fliJfooajml7bvvIznibnmrorlpITnkIZuYW1lX2ZpZWxkX2tleeS4um5hbWXlrZfmrrVcblx0XHRuYW1lX2ZpZWxkX2tleSA9IGlmIG9iamVjdF9uYW1lID09IFwib3JnYW5pemF0aW9uc1wiIHRoZW4gXCJuYW1lXCIgZWxzZSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk/Lk5BTUVfRklFTERfS0VZXG5cdFx0aWYgcmVjb3JkIGFuZCBuYW1lX2ZpZWxkX2tleVxuXHRcdFx0cmV0dXJuIHJlY29yZC5sYWJlbCB8fCByZWNvcmRbbmFtZV9maWVsZF9rZXldXG5cbkNyZWF0b3IuZ2V0QXBwID0gKGFwcF9pZCktPlxuXHRpZiAhYXBwX2lkXG5cdFx0YXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcblx0YXBwID0gQ3JlYXRvci5BcHBzW2FwcF9pZF1cblx0Q3JlYXRvci5kZXBzPy5hcHA/LmRlcGVuZCgpXG5cdHJldHVybiBhcHBcblxuQ3JlYXRvci5nZXRBcHBEYXNoYm9hcmQgPSAoYXBwX2lkKS0+XG5cdGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZClcblx0aWYgIWFwcFxuXHRcdHJldHVyblxuXHRkYXNoYm9hcmQgPSBudWxsXG5cdF8uZWFjaCBDcmVhdG9yLkRhc2hib2FyZHMsICh2LCBrKS0+XG5cdFx0aWYgdi5hcHBzPy5pbmRleE9mKGFwcC5faWQpID4gLTFcblx0XHRcdGRhc2hib2FyZCA9IHY7XG5cdHJldHVybiBkYXNoYm9hcmQ7XG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkQ29tcG9uZW50ID0gKGFwcF9pZCktPlxuXHRhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpXG5cdGlmICFhcHAgfHwgdHJ1ZVxuXHRcdHJldHVyblxuXHQjIHJldHVybiBCdWlsZGVyQ3JlYXRvci5wbHVnaW5Db21wb25lbnRTZWxlY3RvcihCdWlsZGVyQ3JlYXRvci5zdG9yZS5nZXRTdGF0ZSgpLCBcIkRhc2hib2FyZFwiLCBhcHAuX2lkKTtcblxuQ3JlYXRvci5nZXRBcHBPYmplY3ROYW1lcyA9IChhcHBfaWQpLT5cblx0YXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKVxuXHRpZiAhYXBwXG5cdFx0cmV0dXJuXG5cdGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpXG5cdGFwcE9iamVjdHMgPSBpZiBpc01vYmlsZSB0aGVuIGFwcC5tb2JpbGVfb2JqZWN0cyBlbHNlIGFwcC5vYmplY3RzXG5cdG9iamVjdHMgPSBbXVxuXHRpZiBhcHBcblx0XHRfLmVhY2ggYXBwT2JqZWN0cywgKHYpLT5cblx0XHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KHYpXG5cdFx0XHRpZiBvYmo/LnBlcm1pc3Npb25zLmdldCgpLmFsbG93UmVhZFxuXHRcdFx0XHRvYmplY3RzLnB1c2ggdlxuXHRyZXR1cm4gb2JqZWN0c1xuXG5DcmVhdG9yLmdldFVybFdpdGhUb2tlbiA9ICh1cmwsIGV4cHJlc3Npb25Gb3JtRGF0YSkgLT5cblx0IyDnu5l1cmzml7bmi7zmjqXlvZPliY3nlKjmiLd0b2tlbuebuOWFs+S/oeaBr+eUqOS6jueZu+W9lemqjOivge+8jOaUr+aMgemFjee9ruihqOi+vuW8j1xuXHRwYXJhbXMgPSB7fTtcblx0cGFyYW1zW1wiWC1TcGFjZS1JZFwiXSA9IFN0ZWVkb3Muc3BhY2VJZCgpXG5cdHBhcmFtc1tcIlgtVXNlci1JZFwiXSA9IFN0ZWVkb3MudXNlcklkKCk7XG5cdHBhcmFtc1tcIlgtQ29tcGFueS1JZHNcIl0gPSBTdGVlZG9zLmdldFVzZXJDb21wYW55SWRzKCk7XG5cdHBhcmFtc1tcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG5cdGlmIFN0ZWVkb3MuaXNFeHByZXNzaW9uKHVybClcblx0XHR1cmwgPSBTdGVlZG9zLnBhcnNlU2luZ2xlRXhwcmVzc2lvbih1cmwsIGV4cHJlc3Npb25Gb3JtRGF0YSwgXCIjXCIsIENyZWF0b3IuVVNFUl9DT05URVhUKVxuXHQjIOWklumDqOmTvuaOpeWcsOWdgOS4reWPr+iDveS8muW4puaciSPlj7fvvIzmr5TlpoIvYnVpbGRlci8/cF9pZHM9NjE5MzgzNTQ1YjJlOWE3MmVjMDU1OGIzIy9wYWdlL3B1YmxpYy90ZXN0XG5cdCMg5q2k5pe2dXJs5Lit5bey57uP5ZyoI+WPt+WJjemdouWHuueOsOS6huS4gOS4qj/lj7fvvIzov5nkuKrpl67lj7fkuI3lj6/ku6Xooqvor4bliKvkuLp1cmzlj4LmlbDvvIzlj6rmnIkj5Y+35ZCO6Z2i55qEP+WPt+aJjeW6lOivpeiiq+ivhuWIq+S4unVybOWPguaVsFxuXHRoYXNRdWVyeVN5bWJvbCA9IC8oXFwjLitcXD8pfChcXD9bXiNdKiQpL2cudGVzdCh1cmwpXG5cdGxpbmtTdHIgPSBpZiBoYXNRdWVyeVN5bWJvbCB0aGVuIFwiJlwiIGVsc2UgXCI/XCJcblx0cmV0dXJuIFwiI3t1cmx9I3tsaW5rU3RyfSN7JC5wYXJhbShwYXJhbXMpfVwiXG5cbkNyZWF0b3IuZ2V0QXBwTWVudSA9IChhcHBfaWQsIG1lbnVfaWQpLT5cblx0bWVudXMgPSBDcmVhdG9yLmdldEFwcE1lbnVzKGFwcF9pZClcblx0cmV0dXJuIG1lbnVzICYmIG1lbnVzLmZpbmQgKG1lbnUpLT4gcmV0dXJuIG1lbnUuaWQgPT0gbWVudV9pZFxuXG5DcmVhdG9yLmdldEFwcE1lbnVVcmxGb3JJbnRlcm5ldCA9IChtZW51KS0+XG5cdCMg5b2TdGFic+exu+Wei+S4unVybOaXtu+8jOaMieWklumDqOmTvuaOpeWkhOeQhu+8jOaUr+aMgemFjee9ruihqOi+vuW8j+W5tuWKoOS4iue7n+S4gOeahHVybOWPguaVsFxuXHRyZXR1cm4gQ3JlYXRvci5nZXRVcmxXaXRoVG9rZW4gbWVudS5wYXRoLCBtZW51XG5cbkNyZWF0b3IuZ2V0QXBwTWVudVVybCA9IChtZW51KS0+XG5cdHVybCA9IG1lbnUucGF0aFxuXHRpZiBtZW51LnR5cGUgPT0gXCJ1cmxcIlxuXHRcdGlmIG1lbnUudGFyZ2V0XG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRBcHBNZW51VXJsRm9ySW50ZXJuZXQobWVudSlcblx0XHRlbHNlXG5cdFx0XHQjIOWcqGlmcmFtZeS4reaYvuekunVybOeVjOmdolxuXHRcdFx0cmV0dXJuIFwiL2FwcC8tL3RhYl9pZnJhbWUvI3ttZW51LmlkfVwiXG5cdGVsc2Vcblx0XHRyZXR1cm4gbWVudS5wYXRoXG5cbkNyZWF0b3IuZ2V0QXBwTWVudXMgPSAoYXBwX2lkKS0+XG5cdGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZClcblx0aWYgIWFwcFxuXHRcdHJldHVybiBbXVxuXHRhcHBNZW51cyA9IFNlc3Npb24uZ2V0KFwiYXBwX21lbnVzXCIpO1xuXHR1bmxlc3MgYXBwTWVudXNcblx0XHRyZXR1cm4gW11cblx0Y3VyZW50QXBwTWVudXMgPSBhcHBNZW51cy5maW5kIChtZW51SXRlbSkgLT5cblx0XHRyZXR1cm4gbWVudUl0ZW0uaWQgPT0gYXBwLl9pZFxuXHRpZiBjdXJlbnRBcHBNZW51c1xuXHRcdHJldHVybiBjdXJlbnRBcHBNZW51cy5jaGlsZHJlblxuXG5DcmVhdG9yLmxvYWRBcHBzTWVudXMgPSAoKS0+XG5cdGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpXG5cdGRhdGEgPSB7IH1cblx0aWYgaXNNb2JpbGVcblx0XHRkYXRhLm1vYmlsZSA9IGlzTW9iaWxlXG5cdG9wdGlvbnMgPSB7IFxuXHRcdHR5cGU6ICdnZXQnLCBcblx0XHRkYXRhOiBkYXRhLCBcblx0XHRzdWNjZXNzOiAoZGF0YSktPlxuXHRcdFx0U2Vzc2lvbi5zZXQoXCJhcHBfbWVudXNcIiwgZGF0YSk7XG5cdCB9XG5cdFN0ZWVkb3MuYXV0aFJlcXVlc3QgXCIvc2VydmljZS9hcGkvYXBwcy9tZW51c1wiLCBvcHRpb25zXG5cbkNyZWF0b3IuY3JlYXRvckFwcHNTZWxlY3RvciA9IChhcHBzLCBhc3NpZ25lZF9hcHBzKSAtPlxuXHRhZG1pbkFwcCA9IHVuZGVmaW5lZFxuXHRzb3J0ZWRBcHBzID0gdW5kZWZpbmVkXG5cdF8uZWFjaCBhcHBzLCAoYXBwLCBrZXkpIC0+XG5cdFx0aWYgIWFwcC5faWRcblx0XHRcdGFwcC5faWQgPSBrZXlcblx0XHRpZiBhcHAuaXNfY3JlYXRvclxuXHRcdFx0IyDkuI3pnIDopoFpc1NwYWNlQWRtaW7pgLvovpFcblx0XHRcdCMgaWYgKGlzU3BhY2VBZG1pbikge1xuXHRcdFx0I1x0XHQgYXBwLnZpc2libGUgPSB0cnVlO1xuXHRcdFx0IyB9XG5cdFx0ZWxzZVxuXHRcdFx0IyDpnZ5jcmVhdG9y5bqU6K+l5LiA5b6L5LiN5pi+56S6XG5cdFx0XHRhcHAudmlzaWJsZSA9IGZhbHNlXG5cdFx0cmV0dXJuXG5cdHNvcnRlZEFwcHMgPSBfLnNvcnRCeShfLnZhbHVlcyhhcHBzKSwgJ3NvcnQnKVxuXHRjcmVhdG9yQXBwcyA9IHt9XG5cdGFkbWluQXBwID0ge31cblx0IyDmjInpkq5zb3J05o6S5bqP5qyh5bqP6K6+572uQ3JlYXRvci5BcHBz5YC8XG5cdF8uZWFjaCBzb3J0ZWRBcHBzLCAobikgLT5cblx0XHRpZiBuLl9pZCA9PSAnYWRtaW4nXG5cdFx0XHRhZG1pbkFwcCA9IG5cblx0XHRlbHNlXG5cdFx0XHRjcmVhdG9yQXBwc1tuLl9pZF0gPSBuXG5cdCMgYWRtaW7oj5zljZXmmL7npLrlnKjmnIDlkI5cblx0Y3JlYXRvckFwcHMuYWRtaW4gPSBhZG1pbkFwcFxuXHRpZiBhc3NpZ25lZF9hcHBzLmxlbmd0aFxuXHRcdF8uZWFjaCBjcmVhdG9yQXBwcywgKGFwcCwga2V5KSAtPlxuXHRcdFx0aWYgYXNzaWduZWRfYXBwcy5pbmRleE9mKGtleSkgPiAtMVxuXHRcdFx0XHRhcHAudmlzaWJsZSA9IGFwcC5pc19jcmVhdG9yXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGFwcC52aXNpYmxlID0gZmFsc2Vcblx0XHRcdHJldHVyblxuXHRjcmVhdG9yQXBwc1xuXG5DcmVhdG9yLnZpc2libGVBcHBzU2VsZWN0b3IgPSAoY3JlYXRvckFwcHMsIGluY2x1ZGVBZG1pbiA9IHRydWUpIC0+XG5cdGFwcHMgPSBbXVxuXHRfLmVhY2ggY3JlYXRvckFwcHMsICh2LCBrKSAtPlxuXHRcdGlmIHYudmlzaWJsZSAhPSBmYWxzZSBhbmQgdi5faWQgIT0gJ2FkbWluJyBvciBpbmNsdWRlQWRtaW4gYW5kIHYuX2lkID09ICdhZG1pbidcblx0XHRcdGFwcHMucHVzaCB2XG5cdFx0cmV0dXJuXG5cdGFwcHNcblxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwcyA9IChpbmNsdWRlQWRtaW4pLT5cblx0Y2hhbmdlQXBwID0gQ3JlYXRvci5fc3ViQXBwLmdldCgpO1xuXHRjcmVhdG9yQXBwcyA9IE9iamVjdC5hc3NpZ24oe30sIENyZWF0b3IuQXBwcywge2FwcHM6IGNoYW5nZUFwcH0pO1xuXHRyZXR1cm4gQ3JlYXRvci52aXNpYmxlQXBwc1NlbGVjdG9yKGNyZWF0b3JBcHBzLCBpbmNsdWRlQWRtaW4pXG5cbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHNPYmplY3RzID0gKCktPlxuXHRhcHBzID0gQ3JlYXRvci5nZXRWaXNpYmxlQXBwcygpXG5cdHZpc2libGVPYmplY3ROYW1lcyA9IF8uZmxhdHRlbihfLnBsdWNrKGFwcHMsJ29iamVjdHMnKSlcblx0b2JqZWN0cyA9IF8uZmlsdGVyIENyZWF0b3IuT2JqZWN0cywgKG9iaiktPlxuXHRcdGlmIHZpc2libGVPYmplY3ROYW1lcy5pbmRleE9mKG9iai5uYW1lKSA8IDBcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB0cnVlXG5cdG9iamVjdHMgPSBvYmplY3RzLnNvcnQoQ3JlYXRvci5zb3J0aW5nTWV0aG9kLmJpbmQoe2tleTpcImxhYmVsXCJ9KSlcblx0b2JqZWN0cyA9IF8ucGx1Y2sob2JqZWN0cywnbmFtZScpXG5cdHJldHVybiBfLnVuaXEgb2JqZWN0c1xuXG5DcmVhdG9yLmdldEFwcHNPYmplY3RzID0gKCktPlxuXHRvYmplY3RzID0gW11cblx0dGVtcE9iamVjdHMgPSBbXVxuXHRfLmZvckVhY2ggQ3JlYXRvci5BcHBzLCAoYXBwKS0+XG5cdFx0dGVtcE9iamVjdHMgPSBfLmZpbHRlciBhcHAub2JqZWN0cywgKG9iaiktPlxuXHRcdFx0cmV0dXJuICFvYmouaGlkZGVuXG5cdFx0b2JqZWN0cyA9IG9iamVjdHMuY29uY2F0KHRlbXBPYmplY3RzKVxuXHRyZXR1cm4gXy51bmlxIG9iamVjdHNcblxuQ3JlYXRvci52YWxpZGF0ZUZpbHRlcnMgPSAoZmlsdGVycywgbG9naWMpLT5cblx0ZmlsdGVyX2l0ZW1zID0gXy5tYXAgZmlsdGVycywgKG9iaikgLT5cblx0XHRpZiBfLmlzRW1wdHkob2JqKVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG9ialxuXHRmaWx0ZXJfaXRlbXMgPSBfLmNvbXBhY3QoZmlsdGVyX2l0ZW1zKVxuXHRlcnJvck1zZyA9IFwiXCJcblx0ZmlsdGVyX2xlbmd0aCA9IGZpbHRlcl9pdGVtcy5sZW5ndGhcblx0aWYgbG9naWNcblx0XHQjIOagvOW8j+WMlmZpbHRlclxuXHRcdGxvZ2ljID0gbG9naWMucmVwbGFjZSgvXFxuL2csIFwiXCIpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpXG5cblx0XHQjIOWIpOaWreeJueauiuWtl+esplxuXHRcdGlmIC9bLl9cXC0hK10rL2lnLnRlc3QobG9naWMpXG5cdFx0XHRlcnJvck1zZyA9IFwi5ZCr5pyJ54m55q6K5a2X56ym44CCXCJcblxuXHRcdGlmICFlcnJvck1zZ1xuXHRcdFx0aW5kZXggPSBsb2dpYy5tYXRjaCgvXFxkKy9pZylcblx0XHRcdGlmICFpbmRleFxuXHRcdFx0XHRlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5kZXguZm9yRWFjaCAoaSktPlxuXHRcdFx0XHRcdGlmIGkgPCAxIG9yIGkgPiBmaWx0ZXJfbGVuZ3RoXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5p2h5Lu25byV55So5LqG5pyq5a6a5LmJ55qE562b6YCJ5Zmo77yaI3tpfeOAglwiXG5cblx0XHRcdFx0ZmxhZyA9IDFcblx0XHRcdFx0d2hpbGUgZmxhZyA8PSBmaWx0ZXJfbGVuZ3RoXG5cdFx0XHRcdFx0aWYgIWluZGV4LmluY2x1ZGVzKFwiI3tmbGFnfVwiKVxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBcIuacieS6m+etm+mAieadoeS7tui/m+ihjOS6huWumuS5ie+8jOS9huacquWcqOmrmOe6p+etm+mAieadoeS7tuS4reiiq+W8leeUqOOAglwiXG5cdFx0XHRcdFx0ZmxhZysrO1xuXG5cdFx0aWYgIWVycm9yTXNnXG5cdFx0XHQjIOWIpOaWreaYr+WQpuaciemdnuazleiLseaWh+Wtl+esplxuXHRcdFx0d29yZCA9IGxvZ2ljLm1hdGNoKC9bYS16QS1aXSsvaWcpXG5cdFx0XHRpZiB3b3JkXG5cdFx0XHRcdHdvcmQuZm9yRWFjaCAodyktPlxuXHRcdFx0XHRcdGlmICEvXihhbmR8b3IpJC9pZy50ZXN0KHcpXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IFwi5qOA5p+l5oKo55qE6auY57qn562b6YCJ5p2h5Lu25Lit55qE5ou85YaZ44CCXCJcblxuXHRcdGlmICFlcnJvck1zZ1xuXHRcdFx0IyDliKTmlq3moLzlvI/mmK/lkKbmraPnoa5cblx0XHRcdHRyeVxuXHRcdFx0XHRDcmVhdG9yLmV2YWwobG9naWMucmVwbGFjZSgvYW5kL2lnLCBcIiYmXCIpLnJlcGxhY2UoL29yL2lnLCBcInx8XCIpKVxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5Lit5ZCr5pyJ54m55q6K5a2X56ymXCJcblxuXHRcdFx0aWYgLyhBTkQpW14oKV0rKE9SKS9pZy50ZXN0KGxvZ2ljKSB8fCAgLyhPUilbXigpXSsoQU5EKS9pZy50ZXN0KGxvZ2ljKVxuXHRcdFx0XHRlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5b+F6aG75Zyo6L+e57ut5oCn55qEIEFORCDlkowgT1Ig6KGo6L6+5byP5YmN5ZCO5L2/55So5ous5Y+344CCXCJcblx0aWYgZXJyb3JNc2dcblx0XHRjb25zb2xlLmxvZyBcImVycm9yXCIsIGVycm9yTXNnXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHR0b2FzdHIuZXJyb3IoZXJyb3JNc2cpXG5cdFx0cmV0dXJuIGZhbHNlXG5cdGVsc2Vcblx0XHRyZXR1cm4gdHJ1ZVxuXG4jIFwiPVwiLCBcIjw+XCIsIFwiPlwiLCBcIj49XCIsIFwiPFwiLCBcIjw9XCIsIFwic3RhcnRzd2l0aFwiLCBcImNvbnRhaW5zXCIsIFwibm90Y29udGFpbnNcIi5cbiMjI1xub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcbmV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcbiMjI1xuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9Nb25nbyA9IChmaWx0ZXJzLCBvcHRpb25zKS0+XG5cdHVubGVzcyBmaWx0ZXJzPy5sZW5ndGhcblx0XHRyZXR1cm5cblx0IyDlvZNmaWx0ZXJz5LiN5pivW0FycmF5Xeexu+Wei+iAjOaYr1tPYmplY3Rd57G75Z6L5pe277yM6L+b6KGM5qC85byP6L2s5o2iXG5cdHVubGVzcyBmaWx0ZXJzWzBdIGluc3RhbmNlb2YgQXJyYXlcblx0XHRmaWx0ZXJzID0gXy5tYXAgZmlsdGVycywgKG9iaiktPlxuXHRcdFx0cmV0dXJuIFtvYmouZmllbGQsIG9iai5vcGVyYXRpb24sIG9iai52YWx1ZV1cblx0c2VsZWN0b3IgPSBbXVxuXHRfLmVhY2ggZmlsdGVycywgKGZpbHRlciktPlxuXHRcdGZpZWxkID0gZmlsdGVyWzBdXG5cdFx0b3B0aW9uID0gZmlsdGVyWzFdXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSlcblx0XHRlbHNlXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgbnVsbCwgb3B0aW9ucylcblx0XHRzdWJfc2VsZWN0b3IgPSB7fVxuXHRcdHN1Yl9zZWxlY3RvcltmaWVsZF0gPSB7fVxuXHRcdGlmIG9wdGlvbiA9PSBcIj1cIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRlcVwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8PlwiXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJG5lXCJdID0gdmFsdWVcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIj5cIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndFwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI+PVwiXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGd0ZVwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8XCJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPD1cIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdGVcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwic3RhcnRzd2l0aFwiXG5cdFx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXlwiICsgdmFsdWUsIFwiaVwiKVxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZ1xuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiY29udGFpbnNcIlxuXHRcdFx0cmVnID0gbmV3IFJlZ0V4cCh2YWx1ZSwgXCJpXCIpXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCJub3Rjb250YWluc1wiXG5cdFx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXigoPyFcIiArIHZhbHVlICsgXCIpLikqJFwiLCBcImlcIilcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWdcblx0XHRzZWxlY3Rvci5wdXNoIHN1Yl9zZWxlY3RvclxuXHRyZXR1cm4gc2VsZWN0b3JcblxuQ3JlYXRvci5pc0JldHdlZW5GaWx0ZXJPcGVyYXRpb24gPSAob3BlcmF0aW9uKS0+XG5cdHJldHVybiBvcGVyYXRpb24gPT0gXCJiZXR3ZWVuXCIgb3IgISFDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyh0cnVlKT9bb3BlcmF0aW9uXVxuXG4jIyNcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5cdGV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcbiMjI1xuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9EZXYgPSAoZmlsdGVycywgb2JqZWN0X25hbWUsIG9wdGlvbnMpLT5cblx0dW5sZXNzIGZpbHRlcnMubGVuZ3RoXG5cdFx0cmV0dXJuXG5cdGlmIG9wdGlvbnM/LmlzX2xvZ2ljX29yXG5cdFx0IyDlpoLmnpxpc19sb2dpY19vcuS4unRydWXvvIzkuLpmaWx0ZXJz56ys5LiA5bGC5YWD57Sg5aKe5Yqgb3Lpl7TpmpRcblx0XHRsb2dpY1RlbXBGaWx0ZXJzID0gW11cblx0XHRmaWx0ZXJzLmZvckVhY2ggKG4pLT5cblx0XHRcdGxvZ2ljVGVtcEZpbHRlcnMucHVzaChuKVxuXHRcdFx0bG9naWNUZW1wRmlsdGVycy5wdXNoKFwib3JcIilcblx0XHRsb2dpY1RlbXBGaWx0ZXJzLnBvcCgpXG5cdFx0ZmlsdGVycyA9IGxvZ2ljVGVtcEZpbHRlcnNcblx0c2VsZWN0b3IgPSBTdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9EZXYoZmlsdGVycywgQ3JlYXRvci5VU0VSX0NPTlRFWFQpXG5cdHJldHVybiBzZWxlY3RvclxuXG4jIyNcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4jIyNcbkNyZWF0b3IuZm9ybWF0TG9naWNGaWx0ZXJzVG9EZXYgPSAoZmlsdGVycywgZmlsdGVyX2xvZ2ljLCBvcHRpb25zKS0+XG5cdGZvcm1hdF9sb2dpYyA9IGZpbHRlcl9sb2dpYy5yZXBsYWNlKC9cXChcXHMrL2lnLCBcIihcIikucmVwbGFjZSgvXFxzK1xcKS9pZywgXCIpXCIpLnJlcGxhY2UoL1xcKC9nLCBcIltcIikucmVwbGFjZSgvXFwpL2csIFwiXVwiKS5yZXBsYWNlKC9cXHMrL2csIFwiLFwiKS5yZXBsYWNlKC8oYW5kfG9yKS9pZywgXCInJDEnXCIpXG5cdGZvcm1hdF9sb2dpYyA9IGZvcm1hdF9sb2dpYy5yZXBsYWNlKC8oXFxkKSsvaWcsICh4KS0+XG5cdFx0X2YgPSBmaWx0ZXJzW3gtMV1cblx0XHRmaWVsZCA9IF9mLmZpZWxkXG5cdFx0b3B0aW9uID0gX2Yub3BlcmF0aW9uXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlKVxuXHRcdGVsc2Vcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUsIG51bGwsIG9wdGlvbnMpXG5cdFx0c3ViX3NlbGVjdG9yID0gW11cblx0XHRpZiBfLmlzQXJyYXkodmFsdWUpID09IHRydWVcblx0XHRcdGlmIG9wdGlvbiA9PSBcIj1cIlxuXHRcdFx0XHRfLmVhY2ggdmFsdWUsICh2KS0+XG5cdFx0XHRcdFx0c3ViX3NlbGVjdG9yLnB1c2ggW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCJcblx0XHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPD5cIlxuXHRcdFx0XHRfLmVhY2ggdmFsdWUsICh2KS0+XG5cdFx0XHRcdFx0c3ViX3NlbGVjdG9yLnB1c2ggW2ZpZWxkLCBvcHRpb24sIHZdLCBcImFuZFwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdF8uZWFjaCB2YWx1ZSwgKHYpLT5cblx0XHRcdFx0XHRzdWJfc2VsZWN0b3IucHVzaCBbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIlxuXHRcdFx0aWYgc3ViX3NlbGVjdG9yW3N1Yl9zZWxlY3Rvci5sZW5ndGggLSAxXSA9PSBcImFuZFwiIHx8IHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT0gXCJvclwiXG5cdFx0XHRcdHN1Yl9zZWxlY3Rvci5wb3AoKVxuXHRcdGVsc2Vcblx0XHRcdHN1Yl9zZWxlY3RvciA9IFtmaWVsZCwgb3B0aW9uLCB2YWx1ZV1cblx0XHRjb25zb2xlLmxvZyBcInN1Yl9zZWxlY3RvclwiLCBzdWJfc2VsZWN0b3Jcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3ViX3NlbGVjdG9yKVxuXHQpXG5cdGZvcm1hdF9sb2dpYyA9IFwiWyN7Zm9ybWF0X2xvZ2ljfV1cIlxuXHRyZXR1cm4gQ3JlYXRvci5ldmFsKGZvcm1hdF9sb2dpYylcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRpZiAhX29iamVjdFxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lc1xuXG4jXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soX29iamVjdC5yZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxuXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoX29iamVjdC5fY29sbGVjdGlvbl9uYW1lKVxuXG5cdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxuXHRpZiByZWxhdGVkX29iamVjdF9uYW1lcz8ubGVuZ3RoID09IDBcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXNcblxuXHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0dW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0c1xuXG5cdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0c1xuXHRyZXR1cm4gXy5maWx0ZXIgcmVsYXRlZF9vYmplY3RzLCAocmVsYXRlZF9vYmplY3QpLT5cblx0XHRyZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3Qub2JqZWN0X25hbWVcblx0XHRpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMVxuXHRcdCMgcmVsYXRlZF9vYmplY3RfbmFtZSA9IGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjZnNfZmlsZXNfZmlsZXJlY29yZFwiIHRoZW4gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiIGVsc2UgcmVsYXRlZF9vYmplY3RfbmFtZVxuXHRcdGFsbG93UmVhZCA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8uYWxsb3dSZWFkXG5cdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRhbGxvd1JlYWQgPSBhbGxvd1JlYWQgJiYgcGVybWlzc2lvbnMuYWxsb3dSZWFkRmlsZXNcblx0XHRyZXR1cm4gaXNBY3RpdmUgYW5kIGFsbG93UmVhZFxuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3ROYW1lcyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0cmV0dXJuIF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0TGlzdEFjdGlvbnMgPSAocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRhY3Rpb25zID0gQ3JlYXRvci5nZXRBY3Rpb25zKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XG5cdFx0aWYgYWN0aW9uLm5hbWUgPT0gXCJzdGFuZGFyZF9mb2xsb3dcIlxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0aWYgYWN0aW9uLm5hbWUgPT0gXCJzdGFuZGFyZF9xdWVyeVwiXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRpZiBhY3Rpb24ub24gPT0gXCJsaXN0XCJcblx0XHRcdGlmIHR5cGVvZiBhY3Rpb24udmlzaWJsZSA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0cmV0dXJuIGFjdGlvbi52aXNpYmxlKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIGFjdGlvbi52aXNpYmxlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdHJldHVybiBhY3Rpb25zXG5cbkNyZWF0b3IuZ2V0QWN0aW9ucyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRpZiAhb2JqXG5cdFx0cmV0dXJuXG5cblx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdGRpc2FibGVkX2FjdGlvbnMgPSBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zXG5cdGFjdGlvbnMgPSBfLnNvcnRCeShfLnZhbHVlcyhvYmouYWN0aW9ucykgLCAnc29ydCcpO1xuXG5cdGlmIF8uaGFzKG9iaiwgJ2FsbG93X2N1c3RvbUFjdGlvbnMnKVxuXHRcdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XG5cdFx0XHRyZXR1cm4gXy5pbmNsdWRlKG9iai5hbGxvd19jdXN0b21BY3Rpb25zLCBhY3Rpb24ubmFtZSkgfHwgXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLmdldE9iamVjdCgnYmFzZScpLmFjdGlvbnMpIHx8IHt9LCBhY3Rpb24ubmFtZSlcblx0aWYgXy5oYXMob2JqLCAnZXhjbHVkZV9hY3Rpb25zJylcblx0XHRhY3Rpb25zID0gXy5maWx0ZXIgYWN0aW9ucywgKGFjdGlvbiktPlxuXHRcdFx0cmV0dXJuICFfLmluY2x1ZGUob2JqLmV4Y2x1ZGVfYWN0aW9ucywgYWN0aW9uLm5hbWUpXG5cblx0Xy5lYWNoIGFjdGlvbnMsIChhY3Rpb24pLT5cblx0XHQjIOaJi+acuuS4iuWPquaYvuekuue8lui+keaMiemSru+8jOWFtuS7lueahOaUvuWIsOaKmOWPoOS4i+aLieiPnOWNleS4rVxuXHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJyZWNvcmRcIiwgXCJyZWNvcmRfb25seVwiXS5pbmRleE9mKGFjdGlvbi5vbikgPiAtMSAmJiBhY3Rpb24ubmFtZSAhPSAnc3RhbmRhcmRfZWRpdCdcblx0XHRcdGlmIGFjdGlvbi5vbiA9PSBcInJlY29yZF9vbmx5XCJcblx0XHRcdFx0YWN0aW9uLm9uID0gJ3JlY29yZF9vbmx5X21vcmUnXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGFjdGlvbi5vbiA9ICdyZWNvcmRfbW9yZSdcblxuXHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgJiYgW1wiY21zX2ZpbGVzXCIsIFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIl0uaW5kZXhPZihvYmplY3RfbmFtZSkgPiAtMVxuXHRcdCMg6ZmE5Lu254m55q6K5aSE55CG77yM5LiL6L295oyJ6ZKu5pS+5Zyo5Li76I+c5Y2V77yM57yW6L6R5oyJ6ZKu5pS+5Yiw5bqV5LiL5oqY5Y+g5LiL5ouJ6I+c5Y2V5LitXG5cdFx0YWN0aW9ucy5maW5kKChuKS0+IHJldHVybiBuLm5hbWUgPT0gXCJzdGFuZGFyZF9lZGl0XCIpPy5vbiA9IFwicmVjb3JkX21vcmVcIlxuXHRcdGFjdGlvbnMuZmluZCgobiktPiByZXR1cm4gbi5uYW1lID09IFwiZG93bmxvYWRcIik/Lm9uID0gXCJyZWNvcmRcIlxuXG5cdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XG5cdFx0cmV0dXJuIF8uaW5kZXhPZihkaXNhYmxlZF9hY3Rpb25zLCBhY3Rpb24ubmFtZSkgPCAwXG5cblx0cmV0dXJuIGFjdGlvbnNcblxuLy8vXG5cdOi/lOWbnuW9k+WJjeeUqOaIt+acieadg+mZkOiuv+mXrueahOaJgOaciWxpc3Rfdmlld++8jOWMheaLrOWIhuS6q+eahO+8jOeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahO+8iOmZpOmdnm93bmVy5Y+Y5LqG77yJ77yM5Lul5Y+K6buY6K6k55qE5YW25LuW6KeG5Zu+XG5cdOazqOaEj0NyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mmK/kuI3kvJrmnInnlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTop4blm77nmoTvvIzmiYDku6VDcmVhdG9yLmdldFBlcm1pc3Npb25z5Ye95pWw5Lit5ou/5Yiw55qE57uT5p6c5LiN5YWo77yM5bm25LiN5piv5b2T5YmN55So5oi36IO955yL5Yiw5omA5pyJ6KeG5Zu+XG4vLy9cbkNyZWF0b3IuZ2V0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdGlmICF1c2VySWRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcblx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuXG5cblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0aWYgIW9iamVjdFxuXHRcdHJldHVyblxuXG5cdGRpc2FibGVkX2xpc3Rfdmlld3MgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy5kaXNhYmxlZF9saXN0X3ZpZXdzIHx8IFtdXG5cblx0bGlzdF92aWV3cyA9IFtdXG5cblx0aXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKClcblxuXHRfLmVhY2ggb2JqZWN0Lmxpc3Rfdmlld3MsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpdGVtLm5hbWUgPSBpdGVtX25hbWVcblxuXHRsaXN0Vmlld3MgPSBfLnNvcnRCeShfLnZhbHVlcyhvYmplY3QubGlzdF92aWV3cykgLCAnc29ydF9ubycpO1xuXG5cdF8uZWFjaCBsaXN0Vmlld3MsIChpdGVtKS0+XG5cdFx0aWYgaXNNb2JpbGUgYW5kIGl0ZW0udHlwZSA9PSBcImNhbGVuZGFyXCJcblx0XHRcdCMg5omL5py65LiK5YWI5LiN5pi+56S65pel5Y6G6KeG5Zu+XG5cdFx0XHRyZXR1cm5cblx0XHRpZiBpdGVtLm5hbWUgICE9IFwiZGVmYXVsdFwiXG5cdFx0XHRpc0Rpc2FibGVkID0gXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW0ubmFtZSkgPiAtMSB8fCAoaXRlbS5faWQgJiYgXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW0uX2lkKSA+IC0xKVxuXHRcdFx0aWYgIWlzRGlzYWJsZWQgfHwgaXRlbS5vd25lciA9PSB1c2VySWRcblx0XHRcdFx0bGlzdF92aWV3cy5wdXNoIGl0ZW1cblx0cmV0dXJuIGxpc3Rfdmlld3NcblxuIyDliY3lj7DnkIborrrkuIrkuI3lupTor6XosIPnlKjor6Xlh73mlbDvvIzlm6DkuLrlrZfmrrXnmoTmnYPpmZDpg73lnKhDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZmllbGRz55qE55u45YWz5bGe5oCn5Lit5pyJ5qCH6K+G5LqGXG5DcmVhdG9yLmdldEZpZWxkcyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRmaWVsZHNOYW1lID0gQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lKG9iamVjdF9uYW1lKVxuXHR1bnJlYWRhYmxlX2ZpZWxkcyA9ICBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy51bnJlYWRhYmxlX2ZpZWxkc1xuXHRyZXR1cm4gXy5kaWZmZXJlbmNlKGZpZWxkc05hbWUsIHVucmVhZGFibGVfZmllbGRzKVxuXG5DcmVhdG9yLmlzbG9hZGluZyA9ICgpLT5cblx0cmV0dXJuICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZC5nZXQoKVxuXG5DcmVhdG9yLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpXG5cbiMg6K6h566XZmllbGRz55u45YWz5Ye95pWwXG4jIFNUQVJUXG5DcmVhdG9yLmdldERpc2FibGVkRmllbGRzID0gKHNjaGVtYSktPlxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxuXHRcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0uZGlzYWJsZWQgYW5kICFmaWVsZC5hdXRvZm9ybS5vbWl0IGFuZCBmaWVsZE5hbWVcblx0KVxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxuXHRyZXR1cm4gZmllbGRzXG5cbkNyZWF0b3IuZ2V0SGlkZGVuRmllbGRzID0gKHNjaGVtYSktPlxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxuXHRcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0udHlwZSA9PSBcImhpZGRlblwiIGFuZCAhZmllbGQuYXV0b2Zvcm0ub21pdCBhbmQgZmllbGROYW1lXG5cdClcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcblx0cmV0dXJuIGZpZWxkc1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhOb0dyb3VwID0gKHNjaGVtYSktPlxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxuXHRcdHJldHVybiAoIWZpZWxkLmF1dG9mb3JtIG9yICFmaWVsZC5hdXRvZm9ybS5ncm91cCBvciBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PSBcIi1cIikgYW5kICghZmllbGQuYXV0b2Zvcm0gb3IgZmllbGQuYXV0b2Zvcm0udHlwZSAhPSBcImhpZGRlblwiKSBhbmQgZmllbGROYW1lXG5cdClcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcblx0cmV0dXJuIGZpZWxkc1xuXG5DcmVhdG9yLmdldFNvcnRlZEZpZWxkR3JvdXBOYW1lcyA9IChzY2hlbWEpLT5cblx0bmFtZXMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCkgLT5cbiBcdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS5ncm91cCAhPSBcIi1cIiBhbmQgZmllbGQuYXV0b2Zvcm0uZ3JvdXBcblx0KVxuXHRuYW1lcyA9IF8uY29tcGFjdChuYW1lcylcblx0bmFtZXMgPSBfLnVuaXF1ZShuYW1lcylcblx0cmV0dXJuIG5hbWVzXG5cbkNyZWF0b3IuZ2V0RmllbGRzRm9yR3JvdXAgPSAoc2NoZW1hLCBncm91cE5hbWUpIC0+XG4gIFx0ZmllbGRzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQsIGZpZWxkTmFtZSkgLT5cbiAgICBcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT0gZ3JvdXBOYW1lIGFuZCBmaWVsZC5hdXRvZm9ybS50eXBlICE9IFwiaGlkZGVuXCIgYW5kIGZpZWxkTmFtZVxuICBcdClcbiAgXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxuICBcdHJldHVybiBmaWVsZHNcblxuQ3JlYXRvci5nZXRTeXN0ZW1CYXNlRmllbGRzID0gKCkgLT5cblx0cmV0dXJuIFtcImNyZWF0ZWRcIiwgXCJjcmVhdGVkX2J5XCIsIFwibW9kaWZpZWRcIiwgXCJtb2RpZmllZF9ieVwiXVxuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRTeXN0ZW1CYXNlID0gKGtleXMpIC0+XG5cdHJldHVybiBfLmRpZmZlcmVuY2Uoa2V5cywgQ3JlYXRvci5nZXRTeXN0ZW1CYXNlRmllbGRzKCkpO1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRPbWl0ID0gKHNjaGVtYSwga2V5cykgLT5cblx0a2V5cyA9IF8ubWFwKGtleXMsIChrZXkpIC0+XG5cdFx0ZmllbGQgPSBfLnBpY2soc2NoZW1hLCBrZXkpXG5cdFx0aWYgZmllbGRba2V5XS5hdXRvZm9ybT8ub21pdFxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGtleVxuXHQpXG5cdGtleXMgPSBfLmNvbXBhY3Qoa2V5cylcblx0cmV0dXJuIGtleXNcblxuQ3JlYXRvci5nZXRGaWVsZHNJbkZpcnN0TGV2ZWwgPSAoZmlyc3RMZXZlbEtleXMsIGtleXMpIC0+XG5cdGtleXMgPSBfLm1hcChrZXlzLCAoa2V5KSAtPlxuXHRcdGlmIF8uaW5kZXhPZihmaXJzdExldmVsS2V5cywga2V5KSA+IC0xXG5cdFx0XHRyZXR1cm4ga2V5XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdClcblx0a2V5cyA9IF8uY29tcGFjdChrZXlzKVxuXHRyZXR1cm4ga2V5c1xuXG5DcmVhdG9yLmdldEZpZWxkc0ZvclJlb3JkZXIgPSAoc2NoZW1hLCBrZXlzLCBpc1NpbmdsZSkgLT5cblx0ZmllbGRzID0gW11cblx0aSA9IDBcblx0X2tleXMgPSBfLmZpbHRlcihrZXlzLCAoa2V5KS0+XG5cdFx0cmV0dXJuICFrZXkuZW5kc1dpdGgoJ19lbmRMaW5lJylcblx0KTtcblx0d2hpbGUgaSA8IF9rZXlzLmxlbmd0aFxuXHRcdHNjXzEgPSBfLnBpY2soc2NoZW1hLCBfa2V5c1tpXSlcblx0XHRzY18yID0gXy5waWNrKHNjaGVtYSwgX2tleXNbaSsxXSlcblxuXHRcdGlzX3dpZGVfMSA9IGZhbHNlXG5cdFx0aXNfd2lkZV8yID0gZmFsc2VcblxuI1x0XHRpc19yYW5nZV8xID0gZmFsc2VcbiNcdFx0aXNfcmFuZ2VfMiA9IGZhbHNlXG5cblx0XHRfLmVhY2ggc2NfMSwgKHZhbHVlKSAtPlxuXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3dpZGUgfHwgdmFsdWUuYXV0b2Zvcm0/LnR5cGUgPT0gXCJ0YWJsZVwiXG5cdFx0XHRcdGlzX3dpZGVfMSA9IHRydWVcblxuI1x0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc19yYW5nZVxuI1x0XHRcdFx0aXNfcmFuZ2VfMSA9IHRydWVcblxuXHRcdF8uZWFjaCBzY18yLCAodmFsdWUpIC0+XG5cdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfd2lkZSB8fCB2YWx1ZS5hdXRvZm9ybT8udHlwZSA9PSBcInRhYmxlXCJcblx0XHRcdFx0aXNfd2lkZV8yID0gdHJ1ZVxuXG4jXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3JhbmdlXG4jXHRcdFx0XHRpc19yYW5nZV8yID0gdHJ1ZVxuXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRpc193aWRlXzEgPSB0cnVlXG5cdFx0XHRpc193aWRlXzIgPSB0cnVlXG5cblx0XHRpZiBpc1NpbmdsZVxuXHRcdFx0ZmllbGRzLnB1c2ggX2tleXMuc2xpY2UoaSwgaSsxKVxuXHRcdFx0aSArPSAxXG5cdFx0ZWxzZVxuI1x0XHRcdGlmICFpc19yYW5nZV8xICYmIGlzX3JhbmdlXzJcbiNcdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcbiNcdFx0XHRcdGNoaWxkS2V5cy5wdXNoIHVuZGVmaW5lZFxuI1x0XHRcdFx0ZmllbGRzLnB1c2ggY2hpbGRLZXlzXG4jXHRcdFx0XHRpICs9IDFcbiNcdFx0XHRlbHNlXG5cdFx0XHRpZiBpc193aWRlXzFcblx0XHRcdFx0ZmllbGRzLnB1c2ggX2tleXMuc2xpY2UoaSwgaSsxKVxuXHRcdFx0XHRpICs9IDFcblx0XHRcdGVsc2UgaWYgIWlzX3dpZGVfMSBhbmQgaXNfd2lkZV8yXG5cdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcblx0XHRcdFx0Y2hpbGRLZXlzLnB1c2ggdW5kZWZpbmVkXG5cdFx0XHRcdGZpZWxkcy5wdXNoIGNoaWxkS2V5c1xuXHRcdFx0XHRpICs9IDFcblx0XHRcdGVsc2UgaWYgIWlzX3dpZGVfMSBhbmQgIWlzX3dpZGVfMlxuXHRcdFx0XHRjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpKzEpXG5cdFx0XHRcdGlmIF9rZXlzW2krMV1cblx0XHRcdFx0XHRjaGlsZEtleXMucHVzaCBfa2V5c1tpKzFdXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcblx0XHRcdFx0ZmllbGRzLnB1c2ggY2hpbGRLZXlzXG5cdFx0XHRcdGkgKz0gMlxuXG5cdHJldHVybiBmaWVsZHNcblxuQ3JlYXRvci5pc0ZpbHRlclZhbHVlRW1wdHkgPSAodikgLT5cblx0cmV0dXJuIHR5cGVvZiB2ID09IFwidW5kZWZpbmVkXCIgfHwgdiA9PSBudWxsIHx8IE51bWJlci5pc05hTih2KSB8fCB2Lmxlbmd0aCA9PSAwXG5cbkNyZWF0b3IuZ2V0RmllbGREYXRhVHlwZSA9IChvYmplY3RGaWVsZHMsIGtleSktPlxuXHRpZiBvYmplY3RGaWVsZHMgYW5kIGtleVxuXHRcdHJlc3VsdCA9IG9iamVjdEZpZWxkc1trZXldPy50eXBlXG5cdFx0aWYgW1wiZm9ybXVsYVwiLCBcInN1bW1hcnlcIl0uaW5kZXhPZihyZXN1bHQpID4gLTFcblx0XHRcdHJlc3VsdCA9IG9iamVjdEZpZWxkc1trZXldLmRhdGFfdHlwZVxuXHRcdCMgZWxzZSBpZiByZXN1bHQgPT0gXCJzZWxlY3RcIiBhbmQgb2JqZWN0RmllbGRzW2tleV0/LmRhdGFfdHlwZSBhbmQgb2JqZWN0RmllbGRzW2tleV0uZGF0YV90eXBlICE9IFwidGV4dFwiXG5cdFx0IyBcdHJlc3VsdCA9IG9iamVjdEZpZWxkc1trZXldLmRhdGFfdHlwZVxuXHRcdHJldHVybiByZXN1bHRcblx0ZWxzZVxuXHRcdHJldHVybiBcInRleHRcIlxuXG4jIEVORFxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Q3JlYXRvci5nZXRBbGxSZWxhdGVkT2JqZWN0cyA9IChvYmplY3RfbmFtZSktPlxuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW11cblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cblx0XHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cblx0XHRcdFx0aWYgcmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWVcblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoIHJlbGF0ZWRfb2JqZWN0X25hbWVcblxuXHRcdGlmIENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKS5lbmFibGVfZmlsZXNcblx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzLnB1c2ggXCJjbXNfZmlsZXNcIlxuXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRTdGVlZG9zLmZvcm1hdEluZGV4ID0gKGFycmF5KSAtPlxuXHRcdG9iamVjdCA9IHtcbiAgICAgICAgXHRiYWNrZ3JvdW5kOiB0cnVlXG4gICAgXHR9O1xuXHRcdGlzZG9jdW1lbnREQiA9IE1ldGVvci5zZXR0aW5ncz8uZGF0YXNvdXJjZXM/LmRlZmF1bHQ/LmRvY3VtZW50REIgfHwgZmFsc2U7XG5cdFx0aWYgaXNkb2N1bWVudERCXG5cdFx0XHRpZiBhcnJheS5sZW5ndGggPiAwXG5cdFx0XHRcdGluZGV4TmFtZSA9IGFycmF5LmpvaW4oXCIuXCIpO1xuXHRcdFx0XHRvYmplY3QubmFtZSA9IGluZGV4TmFtZTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChpbmRleE5hbWUubGVuZ3RoID4gNTIpXG5cdFx0XHRcdFx0b2JqZWN0Lm5hbWUgPSBpbmRleE5hbWUuc3Vic3RyaW5nKDAsNTIpO1xuXG5cdFx0cmV0dXJuIG9iamVjdDsiLCJDcmVhdG9yLmdldFNjaGVtYSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLnNjaGVtYSA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSB7XG4gIHZhciBsaXN0X3ZpZXcsIGxpc3Rfdmlld19pZDtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpO1xuICBsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5faWQgOiB2b2lkIDA7XG4gIGlmIChyZWNvcmRfaWQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZCk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKENyZWF0b3IuZ2V0T2JqZWN0SG9tZUNvbXBvbmVudChvYmplY3RfbmFtZSkpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobGlzdF92aWV3X2lkKSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RBYnNvbHV0ZVVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkge1xuICB2YXIgbGlzdF92aWV3LCBsaXN0X3ZpZXdfaWQ7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKTtcbiAgbGlzdF92aWV3X2lkID0gbGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcuX2lkIDogdm9pZCAwO1xuICBpZiAocmVjb3JkX2lkKSB7XG4gICAgcmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQsIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkLCB0cnVlKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSb3V0ZXJVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIHtcbiAgdmFyIGxpc3RfdmlldywgbGlzdF92aWV3X2lkO1xuICBpZiAoIWFwcF9pZCkge1xuICAgIGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICB9XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgbGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbCk7XG4gIGxpc3Rfdmlld19pZCA9IGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Ll9pZCA6IHZvaWQgMDtcbiAgaWYgKHJlY29yZF9pZCkge1xuICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIHtcbiAgdmFyIHVybDtcbiAgdXJsID0gQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCk7XG4gIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKHVybCk7XG59O1xuXG5DcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIHtcbiAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkO1xufTtcblxuQ3JlYXRvci5nZXRTd2l0Y2hMaXN0VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSB7XG4gIGlmIChsaXN0X3ZpZXdfaWQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi9saXN0XCIpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9saXN0L3N3aXRjaFwiKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgcmVjb3JkX2lkLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgaWYgKHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIHJlY29yZF9pZCArIFwiL1wiICsgcmVsYXRlZF9vYmplY3RfbmFtZSArIFwiL2dyaWQ/cmVsYXRlZF9maWVsZF9uYW1lPVwiICsgcmVsYXRlZF9maWVsZF9uYW1lKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyByZWNvcmRfaWQgKyBcIi9cIiArIHJlbGF0ZWRfb2JqZWN0X25hbWUgKyBcIi9ncmlkXCIpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBpc19kZWVwLCBpc19za2lwX2hpZGUsIGlzX3JlbGF0ZWQpIHtcbiAgdmFyIF9vYmplY3QsIF9vcHRpb25zLCBmaWVsZHMsIGljb24sIHJlbGF0ZWRPYmplY3RzO1xuICBfb3B0aW9ucyA9IFtdO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIF9vcHRpb25zO1xuICB9XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZmllbGRzIDogdm9pZCAwO1xuICBpY29uID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwO1xuICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgaWYgKGlzX3NraXBfaGlkZSAmJiBmLmhpZGRlbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZi50eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgIGxhYmVsOiBcIlwiICsgKGYubGFiZWwgfHwgayksXG4gICAgICAgIHZhbHVlOiBcIlwiICsgayxcbiAgICAgICAgaWNvbjogaWNvblxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgbGFiZWw6IGYubGFiZWwgfHwgayxcbiAgICAgICAgdmFsdWU6IGssXG4gICAgICAgIGljb246IGljb25cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIGlmIChpc19kZWVwKSB7XG4gICAgXy5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZiwgaykge1xuICAgICAgdmFyIHJfb2JqZWN0O1xuICAgICAgaWYgKGlzX3NraXBfaGlkZSAmJiBmLmhpZGRlbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoKGYudHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSAmJiBmLnJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKGYucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICByX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGYucmVmZXJlbmNlX3RvKTtcbiAgICAgICAgaWYgKHJfb2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGYyLCBrMikge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgICBsYWJlbDogKGYubGFiZWwgfHwgaykgKyBcIj0+XCIgKyAoZjIubGFiZWwgfHwgazIpLFxuICAgICAgICAgICAgICB2YWx1ZTogayArIFwiLlwiICsgazIsXG4gICAgICAgICAgICAgIGljb246IHJfb2JqZWN0ICE9IG51bGwgPyByX29iamVjdC5pY29uIDogdm9pZCAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChpc19yZWxhdGVkKSB7XG4gICAgcmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKTtcbiAgICBfLmVhY2gocmVsYXRlZE9iamVjdHMsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKF9yZWxhdGVkT2JqZWN0KSB7XG4gICAgICAgIHZhciByZWxhdGVkT2JqZWN0LCByZWxhdGVkT3B0aW9ucztcbiAgICAgICAgcmVsYXRlZE9wdGlvbnMgPSBDcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyhfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSk7XG4gICAgICAgIHJldHVybiBfLmVhY2gocmVsYXRlZE9wdGlvbnMsIGZ1bmN0aW9uKHJlbGF0ZWRPcHRpb24pIHtcbiAgICAgICAgICBpZiAoX3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXkgIT09IHJlbGF0ZWRPcHRpb24udmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgbGFiZWw6IChyZWxhdGVkT2JqZWN0LmxhYmVsIHx8IHJlbGF0ZWRPYmplY3QubmFtZSkgKyBcIj0+XCIgKyByZWxhdGVkT3B0aW9uLmxhYmVsLFxuICAgICAgICAgICAgICB2YWx1ZTogcmVsYXRlZE9iamVjdC5uYW1lICsgXCIuXCIgKyByZWxhdGVkT3B0aW9uLnZhbHVlLFxuICAgICAgICAgICAgICBpY29uOiByZWxhdGVkT2JqZWN0ICE9IG51bGwgPyByZWxhdGVkT2JqZWN0Lmljb24gOiB2b2lkIDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfVxuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEZpbHRlckZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBfb3B0aW9ucywgZmllbGRzLCBpY29uLCBwZXJtaXNzaW9uX2ZpZWxkcztcbiAgX29wdGlvbnMgPSBbXTtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfb3B0aW9ucztcbiAgfVxuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgcGVybWlzc2lvbl9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhvYmplY3RfbmFtZSk7XG4gIGljb24gPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDA7XG4gIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICBpZiAoIV8uaW5jbHVkZShbXCJncmlkXCIsIFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiLCBcImF2YXRhclwiLCBcImltYWdlXCIsIFwibWFya2Rvd25cIiwgXCJodG1sXCJdLCBmLnR5cGUpICYmICFmLmhpZGRlbikge1xuICAgICAgaWYgKCEvXFx3K1xcLi8udGVzdChrKSAmJiBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiBmLmxhYmVsIHx8IGssXG4gICAgICAgICAgdmFsdWU6IGssXG4gICAgICAgICAgaWNvbjogaWNvblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBfb3B0aW9ucywgZmllbGRzLCBpY29uLCBwZXJtaXNzaW9uX2ZpZWxkcztcbiAgX29wdGlvbnMgPSBbXTtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfb3B0aW9ucztcbiAgfVxuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgcGVybWlzc2lvbl9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhvYmplY3RfbmFtZSk7XG4gIGljb24gPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDA7XG4gIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICBpZiAoIV8uaW5jbHVkZShbXCJncmlkXCIsIFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKSkge1xuICAgICAgaWYgKCEvXFx3K1xcLi8udGVzdChrKSAmJiBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiBmLmxhYmVsIHx8IGssXG4gICAgICAgICAgdmFsdWU6IGssXG4gICAgICAgICAgaWNvbjogaWNvblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5cbi8qXG5maWx0ZXJzOiDopoHovazmjaLnmoRmaWx0ZXJzXG5maWVsZHM6IOWvueixoeWtl+autVxuZmlsdGVyX2ZpZWxkczog6buY6K6k6L+H5ruk5a2X5q6177yM5pSv5oyB5a2X56ym5Liy5pWw57uE5ZKM5a+56LGh5pWw57uE5Lik56eN5qC85byP77yM5aaCOlsnZmlsZWRfbmFtZTEnLCdmaWxlZF9uYW1lMiddLFt7ZmllbGQ6J2ZpbGVkX25hbWUxJyxyZXF1aXJlZDp0cnVlfV1cbuWkhOeQhumAu+i+kTog5oqKZmlsdGVyc+S4reWtmOWcqOS6jmZpbHRlcl9maWVsZHPnmoTov4fmu6TmnaHku7blop7liqDmr4/pobnnmoRpc19kZWZhdWx044CBaXNfcmVxdWlyZWTlsZ7mgKfvvIzkuI3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25a+55bqU55qE56e76Zmk5q+P6aG555qE55u45YWz5bGe5oCnXG7ov5Tlm57nu5Pmnpw6IOWkhOeQhuWQjueahGZpbHRlcnNcbiAqL1xuXG5DcmVhdG9yLmdldEZpbHRlcnNXaXRoRmlsdGVyRmllbGRzID0gZnVuY3Rpb24oZmlsdGVycywgZmllbGRzLCBmaWx0ZXJfZmllbGRzKSB7XG4gIGlmICghZmlsdGVycykge1xuICAgIGZpbHRlcnMgPSBbXTtcbiAgfVxuICBpZiAoIWZpbHRlcl9maWVsZHMpIHtcbiAgICBmaWx0ZXJfZmllbGRzID0gW107XG4gIH1cbiAgaWYgKGZpbHRlcl9maWVsZHMgIT0gbnVsbCA/IGZpbHRlcl9maWVsZHMubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgZmlsdGVyX2ZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uKG4pIHtcbiAgICAgIGlmIChfLmlzU3RyaW5nKG4pKSB7XG4gICAgICAgIG4gPSB7XG4gICAgICAgICAgZmllbGQ6IG4sXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoZmllbGRzW24uZmllbGRdICYmICFfLmZpbmRXaGVyZShmaWx0ZXJzLCB7XG4gICAgICAgIGZpZWxkOiBuLmZpZWxkXG4gICAgICB9KSkge1xuICAgICAgICByZXR1cm4gZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICBmaWVsZDogbi5maWVsZCxcbiAgICAgICAgICBpc19kZWZhdWx0OiB0cnVlLFxuICAgICAgICAgIGlzX3JlcXVpcmVkOiBuLnJlcXVpcmVkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbihmaWx0ZXJJdGVtKSB7XG4gICAgdmFyIG1hdGNoRmllbGQ7XG4gICAgbWF0Y2hGaWVsZCA9IGZpbHRlcl9maWVsZHMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbiA9PT0gZmlsdGVySXRlbS5maWVsZCB8fCBuLmZpZWxkID09PSBmaWx0ZXJJdGVtLmZpZWxkO1xuICAgIH0pO1xuICAgIGlmIChfLmlzU3RyaW5nKG1hdGNoRmllbGQpKSB7XG4gICAgICBtYXRjaEZpZWxkID0ge1xuICAgICAgICBmaWVsZDogbWF0Y2hGaWVsZCxcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAobWF0Y2hGaWVsZCkge1xuICAgICAgZmlsdGVySXRlbS5pc19kZWZhdWx0ID0gdHJ1ZTtcbiAgICAgIHJldHVybiBmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkID0gbWF0Y2hGaWVsZC5yZXF1aXJlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGZpbHRlckl0ZW0uaXNfZGVmYXVsdDtcbiAgICAgIHJldHVybiBkZWxldGUgZmlsdGVySXRlbS5pc19yZXF1aXJlZDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmlsdGVycztcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKSB7XG4gIHZhciBjb2xsZWN0aW9uLCBvYmosIHJlY29yZCwgcmVmLCByZWYxLCByZWYyO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmICghcmVjb3JkX2lkKSB7XG4gICAgcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIik7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSAmJiByZWNvcmRfaWQgPT09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpKSB7XG4gICAgICBpZiAoKHJlZiA9IFRlbXBsYXRlLmluc3RhbmNlKCkpICE9IG51bGwgPyByZWYucmVjb3JkIDogdm9pZCAwKSB7XG4gICAgICAgIHJldHVybiAocmVmMSA9IFRlbXBsYXRlLmluc3RhbmNlKCkpICE9IG51bGwgPyAocmVmMiA9IHJlZjEucmVjb3JkKSAhPSBudWxsID8gcmVmMi5nZXQoKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZCk7XG4gICAgfVxuICB9XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKG9iai5kYXRhYmFzZV9uYW1lID09PSBcIm1ldGVvclwiIHx8ICFvYmouZGF0YWJhc2VfbmFtZSkge1xuICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpO1xuICAgIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgICByZWNvcmQgPSBjb2xsZWN0aW9uLmZpbmRPbmUocmVjb3JkX2lkKTtcbiAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgfVxuICB9IGVsc2UgaWYgKG9iamVjdF9uYW1lICYmIHJlY29yZF9pZCkge1xuICAgIHJldHVybiBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZE5hbWUgPSBmdW5jdGlvbihyZWNvcmQsIG9iamVjdF9uYW1lKSB7XG4gIHZhciBuYW1lX2ZpZWxkX2tleSwgcmVmO1xuICBpZiAoIXJlY29yZCkge1xuICAgIHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKCk7XG4gIH1cbiAgaWYgKHJlY29yZCkge1xuICAgIG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0X25hbWUgPT09IFwib3JnYW5pemF0aW9uc1wiID8gXCJuYW1lXCIgOiAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLk5BTUVfRklFTERfS0VZIDogdm9pZCAwO1xuICAgIGlmIChyZWNvcmQgJiYgbmFtZV9maWVsZF9rZXkpIHtcbiAgICAgIHJldHVybiByZWNvcmQubGFiZWwgfHwgcmVjb3JkW25hbWVfZmllbGRfa2V5XTtcbiAgICB9XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QXBwID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIHJlZiwgcmVmMTtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBhcHAgPSBDcmVhdG9yLkFwcHNbYXBwX2lkXTtcbiAgaWYgKChyZWYgPSBDcmVhdG9yLmRlcHMpICE9IG51bGwpIHtcbiAgICBpZiAoKHJlZjEgPSByZWYuYXBwKSAhPSBudWxsKSB7XG4gICAgICByZWYxLmRlcGVuZCgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXBwO1xufTtcblxuQ3JlYXRvci5nZXRBcHBEYXNoYm9hcmQgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgdmFyIGFwcCwgZGFzaGJvYXJkO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCkge1xuICAgIHJldHVybjtcbiAgfVxuICBkYXNoYm9hcmQgPSBudWxsO1xuICBfLmVhY2goQ3JlYXRvci5EYXNoYm9hcmRzLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB2LmFwcHMpICE9IG51bGwgPyByZWYuaW5kZXhPZihhcHAuX2lkKSA6IHZvaWQgMCkgPiAtMSkge1xuICAgICAgcmV0dXJuIGRhc2hib2FyZCA9IHY7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGRhc2hib2FyZDtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkQ29tcG9uZW50ID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHA7XG4gIGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZCk7XG4gIGlmICghYXBwIHx8IHRydWUpIHtcblxuICB9XG59O1xuXG5DcmVhdG9yLmdldEFwcE9iamVjdE5hbWVzID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIGFwcE9iamVjdHMsIGlzTW9iaWxlLCBvYmplY3RzO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKTtcbiAgYXBwT2JqZWN0cyA9IGlzTW9iaWxlID8gYXBwLm1vYmlsZV9vYmplY3RzIDogYXBwLm9iamVjdHM7XG4gIG9iamVjdHMgPSBbXTtcbiAgaWYgKGFwcCkge1xuICAgIF8uZWFjaChhcHBPYmplY3RzLCBmdW5jdGlvbih2KSB7XG4gICAgICB2YXIgb2JqO1xuICAgICAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qodik7XG4gICAgICBpZiAob2JqICE9IG51bGwgPyBvYmoucGVybWlzc2lvbnMuZ2V0KCkuYWxsb3dSZWFkIDogdm9pZCAwKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RzLnB1c2godik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdHM7XG59O1xuXG5DcmVhdG9yLmdldFVybFdpdGhUb2tlbiA9IGZ1bmN0aW9uKHVybCwgZXhwcmVzc2lvbkZvcm1EYXRhKSB7XG4gIHZhciBoYXNRdWVyeVN5bWJvbCwgbGlua1N0ciwgcGFyYW1zO1xuICBwYXJhbXMgPSB7fTtcbiAgcGFyYW1zW1wiWC1TcGFjZS1JZFwiXSA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICBwYXJhbXNbXCJYLVVzZXItSWRcIl0gPSBTdGVlZG9zLnVzZXJJZCgpO1xuICBwYXJhbXNbXCJYLUNvbXBhbnktSWRzXCJdID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpO1xuICBwYXJhbXNbXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICBpZiAoU3RlZWRvcy5pc0V4cHJlc3Npb24odXJsKSkge1xuICAgIHVybCA9IFN0ZWVkb3MucGFyc2VTaW5nbGVFeHByZXNzaW9uKHVybCwgZXhwcmVzc2lvbkZvcm1EYXRhLCBcIiNcIiwgQ3JlYXRvci5VU0VSX0NPTlRFWFQpO1xuICB9XG4gIGhhc1F1ZXJ5U3ltYm9sID0gLyhcXCMuK1xcPyl8KFxcP1teI10qJCkvZy50ZXN0KHVybCk7XG4gIGxpbmtTdHIgPSBoYXNRdWVyeVN5bWJvbCA/IFwiJlwiIDogXCI/XCI7XG4gIHJldHVybiBcIlwiICsgdXJsICsgbGlua1N0ciArICgkLnBhcmFtKHBhcmFtcykpO1xufTtcblxuQ3JlYXRvci5nZXRBcHBNZW51ID0gZnVuY3Rpb24oYXBwX2lkLCBtZW51X2lkKSB7XG4gIHZhciBtZW51cztcbiAgbWVudXMgPSBDcmVhdG9yLmdldEFwcE1lbnVzKGFwcF9pZCk7XG4gIHJldHVybiBtZW51cyAmJiBtZW51cy5maW5kKGZ1bmN0aW9uKG1lbnUpIHtcbiAgICByZXR1cm4gbWVudS5pZCA9PT0gbWVudV9pZDtcbiAgfSk7XG59O1xuXG5DcmVhdG9yLmdldEFwcE1lbnVVcmxGb3JJbnRlcm5ldCA9IGZ1bmN0aW9uKG1lbnUpIHtcbiAgcmV0dXJuIENyZWF0b3IuZ2V0VXJsV2l0aFRva2VuKG1lbnUucGF0aCwgbWVudSk7XG59O1xuXG5DcmVhdG9yLmdldEFwcE1lbnVVcmwgPSBmdW5jdGlvbihtZW51KSB7XG4gIHZhciB1cmw7XG4gIHVybCA9IG1lbnUucGF0aDtcbiAgaWYgKG1lbnUudHlwZSA9PT0gXCJ1cmxcIikge1xuICAgIGlmIChtZW51LnRhcmdldCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0QXBwTWVudVVybEZvckludGVybmV0KG1lbnUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCIvYXBwLy0vdGFiX2lmcmFtZS9cIiArIG1lbnUuaWQ7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBtZW51LnBhdGg7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QXBwTWVudXMgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgdmFyIGFwcCwgYXBwTWVudXMsIGN1cmVudEFwcE1lbnVzO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBhcHBNZW51cyA9IFNlc3Npb24uZ2V0KFwiYXBwX21lbnVzXCIpO1xuICBpZiAoIWFwcE1lbnVzKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGN1cmVudEFwcE1lbnVzID0gYXBwTWVudXMuZmluZChmdW5jdGlvbihtZW51SXRlbSkge1xuICAgIHJldHVybiBtZW51SXRlbS5pZCA9PT0gYXBwLl9pZDtcbiAgfSk7XG4gIGlmIChjdXJlbnRBcHBNZW51cykge1xuICAgIHJldHVybiBjdXJlbnRBcHBNZW51cy5jaGlsZHJlbjtcbiAgfVxufTtcblxuQ3JlYXRvci5sb2FkQXBwc01lbnVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkYXRhLCBpc01vYmlsZSwgb3B0aW9ucztcbiAgaXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKCk7XG4gIGRhdGEgPSB7fTtcbiAgaWYgKGlzTW9iaWxlKSB7XG4gICAgZGF0YS5tb2JpbGUgPSBpc01vYmlsZTtcbiAgfVxuICBvcHRpb25zID0ge1xuICAgIHR5cGU6ICdnZXQnLFxuICAgIGRhdGE6IGRhdGEsXG4gICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIFNlc3Npb24uc2V0KFwiYXBwX21lbnVzXCIsIGRhdGEpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIFN0ZWVkb3MuYXV0aFJlcXVlc3QoXCIvc2VydmljZS9hcGkvYXBwcy9tZW51c1wiLCBvcHRpb25zKTtcbn07XG5cbkNyZWF0b3IuY3JlYXRvckFwcHNTZWxlY3RvciA9IGZ1bmN0aW9uKGFwcHMsIGFzc2lnbmVkX2FwcHMpIHtcbiAgdmFyIGFkbWluQXBwLCBjcmVhdG9yQXBwcywgc29ydGVkQXBwcztcbiAgYWRtaW5BcHAgPSB2b2lkIDA7XG4gIHNvcnRlZEFwcHMgPSB2b2lkIDA7XG4gIF8uZWFjaChhcHBzLCBmdW5jdGlvbihhcHAsIGtleSkge1xuICAgIGlmICghYXBwLl9pZCkge1xuICAgICAgYXBwLl9pZCA9IGtleTtcbiAgICB9XG4gICAgaWYgKGFwcC5pc19jcmVhdG9yKSB7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgYXBwLnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG4gIH0pO1xuICBzb3J0ZWRBcHBzID0gXy5zb3J0QnkoXy52YWx1ZXMoYXBwcyksICdzb3J0Jyk7XG4gIGNyZWF0b3JBcHBzID0ge307XG4gIGFkbWluQXBwID0ge307XG4gIF8uZWFjaChzb3J0ZWRBcHBzLCBmdW5jdGlvbihuKSB7XG4gICAgaWYgKG4uX2lkID09PSAnYWRtaW4nKSB7XG4gICAgICByZXR1cm4gYWRtaW5BcHAgPSBuO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3JlYXRvckFwcHNbbi5faWRdID0gbjtcbiAgICB9XG4gIH0pO1xuICBjcmVhdG9yQXBwcy5hZG1pbiA9IGFkbWluQXBwO1xuICBpZiAoYXNzaWduZWRfYXBwcy5sZW5ndGgpIHtcbiAgICBfLmVhY2goY3JlYXRvckFwcHMsIGZ1bmN0aW9uKGFwcCwga2V5KSB7XG4gICAgICBpZiAoYXNzaWduZWRfYXBwcy5pbmRleE9mKGtleSkgPiAtMSkge1xuICAgICAgICBhcHAudmlzaWJsZSA9IGFwcC5pc19jcmVhdG9yO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBwLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gY3JlYXRvckFwcHM7XG59O1xuXG5DcmVhdG9yLnZpc2libGVBcHBzU2VsZWN0b3IgPSBmdW5jdGlvbihjcmVhdG9yQXBwcywgaW5jbHVkZUFkbWluKSB7XG4gIHZhciBhcHBzO1xuICBpZiAoaW5jbHVkZUFkbWluID09IG51bGwpIHtcbiAgICBpbmNsdWRlQWRtaW4gPSB0cnVlO1xuICB9XG4gIGFwcHMgPSBbXTtcbiAgXy5lYWNoKGNyZWF0b3JBcHBzLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgaWYgKHYudmlzaWJsZSAhPT0gZmFsc2UgJiYgdi5faWQgIT09ICdhZG1pbicgfHwgaW5jbHVkZUFkbWluICYmIHYuX2lkID09PSAnYWRtaW4nKSB7XG4gICAgICBhcHBzLnB1c2godik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGFwcHM7XG59O1xuXG5DcmVhdG9yLmdldFZpc2libGVBcHBzID0gZnVuY3Rpb24oaW5jbHVkZUFkbWluKSB7XG4gIHZhciBjaGFuZ2VBcHAsIGNyZWF0b3JBcHBzO1xuICBjaGFuZ2VBcHAgPSBDcmVhdG9yLl9zdWJBcHAuZ2V0KCk7XG4gIGNyZWF0b3JBcHBzID0gT2JqZWN0LmFzc2lnbih7fSwgQ3JlYXRvci5BcHBzLCB7XG4gICAgYXBwczogY2hhbmdlQXBwXG4gIH0pO1xuICByZXR1cm4gQ3JlYXRvci52aXNpYmxlQXBwc1NlbGVjdG9yKGNyZWF0b3JBcHBzLCBpbmNsdWRlQWRtaW4pO1xufTtcblxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwc09iamVjdHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGFwcHMsIG9iamVjdHMsIHZpc2libGVPYmplY3ROYW1lcztcbiAgYXBwcyA9IENyZWF0b3IuZ2V0VmlzaWJsZUFwcHMoKTtcbiAgdmlzaWJsZU9iamVjdE5hbWVzID0gXy5mbGF0dGVuKF8ucGx1Y2soYXBwcywgJ29iamVjdHMnKSk7XG4gIG9iamVjdHMgPSBfLmZpbHRlcihDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICh2aXNpYmxlT2JqZWN0TmFtZXMuaW5kZXhPZihvYmoubmFtZSkgPCAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIG9iamVjdHMgPSBvYmplY3RzLnNvcnQoQ3JlYXRvci5zb3J0aW5nTWV0aG9kLmJpbmQoe1xuICAgIGtleTogXCJsYWJlbFwiXG4gIH0pKTtcbiAgb2JqZWN0cyA9IF8ucGx1Y2sob2JqZWN0cywgJ25hbWUnKTtcbiAgcmV0dXJuIF8udW5pcShvYmplY3RzKTtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwc09iamVjdHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG9iamVjdHMsIHRlbXBPYmplY3RzO1xuICBvYmplY3RzID0gW107XG4gIHRlbXBPYmplY3RzID0gW107XG4gIF8uZm9yRWFjaChDcmVhdG9yLkFwcHMsIGZ1bmN0aW9uKGFwcCkge1xuICAgIHRlbXBPYmplY3RzID0gXy5maWx0ZXIoYXBwLm9iamVjdHMsIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuICFvYmouaGlkZGVuO1xuICAgIH0pO1xuICAgIHJldHVybiBvYmplY3RzID0gb2JqZWN0cy5jb25jYXQodGVtcE9iamVjdHMpO1xuICB9KTtcbiAgcmV0dXJuIF8udW5pcShvYmplY3RzKTtcbn07XG5cbkNyZWF0b3IudmFsaWRhdGVGaWx0ZXJzID0gZnVuY3Rpb24oZmlsdGVycywgbG9naWMpIHtcbiAgdmFyIGUsIGVycm9yTXNnLCBmaWx0ZXJfaXRlbXMsIGZpbHRlcl9sZW5ndGgsIGZsYWcsIGluZGV4LCB3b3JkO1xuICBmaWx0ZXJfaXRlbXMgPSBfLm1hcChmaWx0ZXJzLCBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoXy5pc0VtcHR5KG9iaikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gIH0pO1xuICBmaWx0ZXJfaXRlbXMgPSBfLmNvbXBhY3QoZmlsdGVyX2l0ZW1zKTtcbiAgZXJyb3JNc2cgPSBcIlwiO1xuICBmaWx0ZXJfbGVuZ3RoID0gZmlsdGVyX2l0ZW1zLmxlbmd0aDtcbiAgaWYgKGxvZ2ljKSB7XG4gICAgbG9naWMgPSBsb2dpYy5yZXBsYWNlKC9cXG4vZywgXCJcIikucmVwbGFjZSgvXFxzKy9nLCBcIiBcIik7XG4gICAgaWYgKC9bLl9cXC0hK10rL2lnLnRlc3QobG9naWMpKSB7XG4gICAgICBlcnJvck1zZyA9IFwi5ZCr5pyJ54m55q6K5a2X56ym44CCXCI7XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIGluZGV4ID0gbG9naWMubWF0Y2goL1xcZCsvaWcpO1xuICAgICAgaWYgKCFpbmRleCkge1xuICAgICAgICBlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleC5mb3JFYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICBpZiAoaSA8IDEgfHwgaSA+IGZpbHRlcl9sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5p2h5Lu25byV55So5LqG5pyq5a6a5LmJ55qE562b6YCJ5Zmo77yaXCIgKyBpICsgXCLjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmbGFnID0gMTtcbiAgICAgICAgd2hpbGUgKGZsYWcgPD0gZmlsdGVyX2xlbmd0aCkge1xuICAgICAgICAgIGlmICghaW5kZXguaW5jbHVkZXMoXCJcIiArIGZsYWcpKSB7XG4gICAgICAgICAgICBlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZsYWcrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWVycm9yTXNnKSB7XG4gICAgICB3b3JkID0gbG9naWMubWF0Y2goL1thLXpBLVpdKy9pZyk7XG4gICAgICBpZiAod29yZCkge1xuICAgICAgICB3b3JkLmZvckVhY2goZnVuY3Rpb24odykge1xuICAgICAgICAgIGlmICghL14oYW5kfG9yKSQvaWcudGVzdCh3KSkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yTXNnID0gXCLmo4Dmn6XmgqjnmoTpq5jnuqfnrZvpgInmnaHku7bkuK3nmoTmi7zlhpnjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWVycm9yTXNnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBDcmVhdG9yW1wiZXZhbFwiXShsb2dpYy5yZXBsYWNlKC9hbmQvaWcsIFwiJiZcIikucmVwbGFjZSgvb3IvaWcsIFwifHxcIikpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5Lit5ZCr5pyJ54m55q6K5a2X56ymXCI7XG4gICAgICB9XG4gICAgICBpZiAoLyhBTkQpW14oKV0rKE9SKS9pZy50ZXN0KGxvZ2ljKSB8fCAvKE9SKVteKCldKyhBTkQpL2lnLnRlc3QobG9naWMpKSB7XG4gICAgICAgIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajlv4XpobvlnKjov57nu63mgKfnmoQgQU5EIOWSjCBPUiDooajovr7lvI/liY3lkI7kvb/nlKjmi6zlj7fjgIJcIjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKGVycm9yTXNnKSB7XG4gICAgY29uc29sZS5sb2coXCJlcnJvclwiLCBlcnJvck1zZyk7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdG9hc3RyLmVycm9yKGVycm9yTXNnKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuICovXG5cbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvTW9uZ28gPSBmdW5jdGlvbihmaWx0ZXJzLCBvcHRpb25zKSB7XG4gIHZhciBzZWxlY3RvcjtcbiAgaWYgKCEoZmlsdGVycyAhPSBudWxsID8gZmlsdGVycy5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghKGZpbHRlcnNbMF0gaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICBmaWx0ZXJzID0gXy5tYXAoZmlsdGVycywgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gW29iai5maWVsZCwgb2JqLm9wZXJhdGlvbiwgb2JqLnZhbHVlXTtcbiAgICB9KTtcbiAgfVxuICBzZWxlY3RvciA9IFtdO1xuICBfLmVhY2goZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIGZpZWxkLCBvcHRpb24sIHJlZywgc3ViX3NlbGVjdG9yLCB2YWx1ZTtcbiAgICBmaWVsZCA9IGZpbHRlclswXTtcbiAgICBvcHRpb24gPSBmaWx0ZXJbMV07XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgbnVsbCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHN1Yl9zZWxlY3RvciA9IHt9O1xuICAgIHN1Yl9zZWxlY3RvcltmaWVsZF0gPSB7fTtcbiAgICBpZiAob3B0aW9uID09PSBcIj1cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRlcVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjw+XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbmVcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI+XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI+PVwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGd0ZVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjxcIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdFwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjw9XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRlXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwic3RhcnRzd2l0aFwiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKFwiXlwiICsgdmFsdWUsIFwiaVwiKTtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWc7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiY29udGFpbnNcIikge1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cCh2YWx1ZSwgXCJpXCIpO1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJub3Rjb250YWluc1wiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKFwiXigoPyFcIiArIHZhbHVlICsgXCIpLikqJFwiLCBcImlcIik7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnO1xuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3IucHVzaChzdWJfc2VsZWN0b3IpO1xuICB9KTtcbiAgcmV0dXJuIHNlbGVjdG9yO1xufTtcblxuQ3JlYXRvci5pc0JldHdlZW5GaWx0ZXJPcGVyYXRpb24gPSBmdW5jdGlvbihvcGVyYXRpb24pIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIG9wZXJhdGlvbiA9PT0gXCJiZXR3ZWVuXCIgfHwgISEoKHJlZiA9IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKHRydWUpKSAhPSBudWxsID8gcmVmW29wZXJhdGlvbl0gOiB2b2lkIDApO1xufTtcblxuXG4vKlxub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcblx0ZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuICovXG5cbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvRGV2ID0gZnVuY3Rpb24oZmlsdGVycywgb2JqZWN0X25hbWUsIG9wdGlvbnMpIHtcbiAgdmFyIGxvZ2ljVGVtcEZpbHRlcnMsIHNlbGVjdG9yO1xuICBpZiAoIWZpbHRlcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLmlzX2xvZ2ljX29yIDogdm9pZCAwKSB7XG4gICAgbG9naWNUZW1wRmlsdGVycyA9IFtdO1xuICAgIGZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbihuKSB7XG4gICAgICBsb2dpY1RlbXBGaWx0ZXJzLnB1c2gobik7XG4gICAgICByZXR1cm4gbG9naWNUZW1wRmlsdGVycy5wdXNoKFwib3JcIik7XG4gICAgfSk7XG4gICAgbG9naWNUZW1wRmlsdGVycy5wb3AoKTtcbiAgICBmaWx0ZXJzID0gbG9naWNUZW1wRmlsdGVycztcbiAgfVxuICBzZWxlY3RvciA9IFN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb0RldihmaWx0ZXJzLCBDcmVhdG9yLlVTRVJfQ09OVEVYVCk7XG4gIHJldHVybiBzZWxlY3Rvcjtcbn07XG5cblxuLypcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRMb2dpY0ZpbHRlcnNUb0RldiA9IGZ1bmN0aW9uKGZpbHRlcnMsIGZpbHRlcl9sb2dpYywgb3B0aW9ucykge1xuICB2YXIgZm9ybWF0X2xvZ2ljO1xuICBmb3JtYXRfbG9naWMgPSBmaWx0ZXJfbG9naWMucmVwbGFjZSgvXFwoXFxzKy9pZywgXCIoXCIpLnJlcGxhY2UoL1xccytcXCkvaWcsIFwiKVwiKS5yZXBsYWNlKC9cXCgvZywgXCJbXCIpLnJlcGxhY2UoL1xcKS9nLCBcIl1cIikucmVwbGFjZSgvXFxzKy9nLCBcIixcIikucmVwbGFjZSgvKGFuZHxvcikvaWcsIFwiJyQxJ1wiKTtcbiAgZm9ybWF0X2xvZ2ljID0gZm9ybWF0X2xvZ2ljLnJlcGxhY2UoLyhcXGQpKy9pZywgZnVuY3Rpb24oeCkge1xuICAgIHZhciBfZiwgZmllbGQsIG9wdGlvbiwgc3ViX3NlbGVjdG9yLCB2YWx1ZTtcbiAgICBfZiA9IGZpbHRlcnNbeCAtIDFdO1xuICAgIGZpZWxkID0gX2YuZmllbGQ7XG4gICAgb3B0aW9uID0gX2Yub3BlcmF0aW9uO1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlLCBudWxsLCBvcHRpb25zKTtcbiAgICB9XG4gICAgc3ViX3NlbGVjdG9yID0gW107XG4gICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkgPT09IHRydWUpIHtcbiAgICAgIGlmIChvcHRpb24gPT09IFwiPVwiKSB7XG4gICAgICAgIF8uZWFjaCh2YWx1ZSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBzdWJfc2VsZWN0b3IucHVzaChbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD5cIikge1xuICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4gc3ViX3NlbGVjdG9yLnB1c2goW2ZpZWxkLCBvcHRpb24sIHZdLCBcImFuZFwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4gc3ViX3NlbGVjdG9yLnB1c2goW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09PSBcImFuZFwiIHx8IHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT09IFwib3JcIikge1xuICAgICAgICBzdWJfc2VsZWN0b3IucG9wKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Yl9zZWxlY3RvciA9IFtmaWVsZCwgb3B0aW9uLCB2YWx1ZV07XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwic3ViX3NlbGVjdG9yXCIsIHN1Yl9zZWxlY3Rvcik7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN1Yl9zZWxlY3Rvcik7XG4gIH0pO1xuICBmb3JtYXRfbG9naWMgPSBcIltcIiArIGZvcm1hdF9sb2dpYyArIFwiXVwiO1xuICByZXR1cm4gQ3JlYXRvcltcImV2YWxcIl0oZm9ybWF0X2xvZ2ljKTtcbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBfb2JqZWN0LCBwZXJtaXNzaW9ucywgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHJlbGF0ZWRfb2JqZWN0cywgdW5yZWxhdGVkX29iamVjdHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBbXTtcbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFfb2JqZWN0KSB7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICB9XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoX29iamVjdC5fY29sbGVjdGlvbl9uYW1lKTtcbiAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cywgXCJvYmplY3RfbmFtZVwiKTtcbiAgaWYgKChyZWxhdGVkX29iamVjdF9uYW1lcyAhPSBudWxsID8gcmVsYXRlZF9vYmplY3RfbmFtZXMubGVuZ3RoIDogdm9pZCAwKSA9PT0gMCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgfVxuICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlKHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0cyk7XG4gIHJldHVybiBfLmZpbHRlcihyZWxhdGVkX29iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0KSB7XG4gICAgdmFyIGFsbG93UmVhZCwgaXNBY3RpdmUsIHJlZiwgcmVsYXRlZF9vYmplY3RfbmFtZTtcbiAgICByZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3Qub2JqZWN0X25hbWU7XG4gICAgaXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTE7XG4gICAgYWxsb3dSZWFkID0gKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5hbGxvd1JlYWQgOiB2b2lkIDA7XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIGFsbG93UmVhZCA9IGFsbG93UmVhZCAmJiBwZXJtaXNzaW9ucy5hbGxvd1JlYWRGaWxlcztcbiAgICB9XG4gICAgcmV0dXJuIGlzQWN0aXZlICYmIGFsbG93UmVhZDtcbiAgfSk7XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3ROYW1lcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIHJlbGF0ZWRfb2JqZWN0cztcbiAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgcmV0dXJuIF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLCBcIm9iamVjdF9uYW1lXCIpO1xufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0TGlzdEFjdGlvbnMgPSBmdW5jdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBhY3Rpb25zO1xuICBhY3Rpb25zID0gQ3JlYXRvci5nZXRBY3Rpb25zKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICBhY3Rpb25zID0gXy5maWx0ZXIoYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgaWYgKGFjdGlvbi5uYW1lID09PSBcInN0YW5kYXJkX2ZvbGxvd1wiKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChhY3Rpb24ubmFtZSA9PT0gXCJzdGFuZGFyZF9xdWVyeVwiKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChhY3Rpb24ub24gPT09IFwibGlzdFwiKSB7XG4gICAgICBpZiAodHlwZW9mIGFjdGlvbi52aXNpYmxlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi52aXNpYmxlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYWN0aW9uLnZpc2libGU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYWN0aW9ucztcbn07XG5cbkNyZWF0b3IuZ2V0QWN0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGFjdGlvbnMsIGRpc2FibGVkX2FjdGlvbnMsIG9iaiwgcGVybWlzc2lvbnMsIHJlZiwgcmVmMTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgZGlzYWJsZWRfYWN0aW9ucyA9IHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnM7XG4gIGFjdGlvbnMgPSBfLnNvcnRCeShfLnZhbHVlcyhvYmouYWN0aW9ucyksICdzb3J0Jyk7XG4gIGlmIChfLmhhcyhvYmosICdhbGxvd19jdXN0b21BY3Rpb25zJykpIHtcbiAgICBhY3Rpb25zID0gXy5maWx0ZXIoYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgICByZXR1cm4gXy5pbmNsdWRlKG9iai5hbGxvd19jdXN0b21BY3Rpb25zLCBhY3Rpb24ubmFtZSkgfHwgXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLmdldE9iamVjdCgnYmFzZScpLmFjdGlvbnMpIHx8IHt9LCBhY3Rpb24ubmFtZSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKF8uaGFzKG9iaiwgJ2V4Y2x1ZGVfYWN0aW9ucycpKSB7XG4gICAgYWN0aW9ucyA9IF8uZmlsdGVyKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgICAgcmV0dXJuICFfLmluY2x1ZGUob2JqLmV4Y2x1ZGVfYWN0aW9ucywgYWN0aW9uLm5hbWUpO1xuICAgIH0pO1xuICB9XG4gIF8uZWFjaChhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcInJlY29yZFwiLCBcInJlY29yZF9vbmx5XCJdLmluZGV4T2YoYWN0aW9uLm9uKSA+IC0xICYmIGFjdGlvbi5uYW1lICE9PSAnc3RhbmRhcmRfZWRpdCcpIHtcbiAgICAgIGlmIChhY3Rpb24ub24gPT09IFwicmVjb3JkX29ubHlcIikge1xuICAgICAgICByZXR1cm4gYWN0aW9uLm9uID0gJ3JlY29yZF9vbmx5X21vcmUnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi5vbiA9ICdyZWNvcmRfbW9yZSc7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJjbXNfZmlsZXNcIiwgXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXS5pbmRleE9mKG9iamVjdF9uYW1lKSA+IC0xKSB7XG4gICAgaWYgKChyZWYgPSBhY3Rpb25zLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4ubmFtZSA9PT0gXCJzdGFuZGFyZF9lZGl0XCI7XG4gICAgfSkpICE9IG51bGwpIHtcbiAgICAgIHJlZi5vbiA9IFwicmVjb3JkX21vcmVcIjtcbiAgICB9XG4gICAgaWYgKChyZWYxID0gYWN0aW9ucy5maW5kKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLm5hbWUgPT09IFwiZG93bmxvYWRcIjtcbiAgICB9KSkgIT0gbnVsbCkge1xuICAgICAgcmVmMS5vbiA9IFwicmVjb3JkXCI7XG4gICAgfVxuICB9XG4gIGFjdGlvbnMgPSBfLmZpbHRlcihhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICByZXR1cm4gXy5pbmRleE9mKGRpc2FibGVkX2FjdGlvbnMsIGFjdGlvbi5uYW1lKSA8IDA7XG4gIH0pO1xuICByZXR1cm4gYWN0aW9ucztcbn07XG5cbi/ov5Tlm57lvZPliY3nlKjmiLfmnInmnYPpmZDorr/pl67nmoTmiYDmnIlsaXN0X3ZpZXfvvIzljIXmi6zliIbkuqvnmoTvvIznlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTvvIjpmaTpnZ5vd25lcuWPmOS6hu+8ie+8jOS7peWPium7mOiupOeahOWFtuS7luinhuWbvuazqOaEj0NyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mmK/kuI3kvJrmnInnlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTop4blm77nmoTvvIzmiYDku6VDcmVhdG9yLmdldFBlcm1pc3Npb25z5Ye95pWw5Lit5ou/5Yiw55qE57uT5p6c5LiN5YWo77yM5bm25LiN5piv5b2T5YmN55So5oi36IO955yL5Yiw5omA5pyJ6KeG5Zu+LztcblxuQ3JlYXRvci5nZXRMaXN0Vmlld3MgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBkaXNhYmxlZF9saXN0X3ZpZXdzLCBpc01vYmlsZSwgbGlzdFZpZXdzLCBsaXN0X3ZpZXdzLCBvYmplY3QsIHJlZjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZGlzYWJsZWRfbGlzdF92aWV3cyA9ICgocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5kaXNhYmxlZF9saXN0X3ZpZXdzIDogdm9pZCAwKSB8fCBbXTtcbiAgbGlzdF92aWV3cyA9IFtdO1xuICBpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKTtcbiAgXy5lYWNoKG9iamVjdC5saXN0X3ZpZXdzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICByZXR1cm4gaXRlbS5uYW1lID0gaXRlbV9uYW1lO1xuICB9KTtcbiAgbGlzdFZpZXdzID0gXy5zb3J0QnkoXy52YWx1ZXMob2JqZWN0Lmxpc3Rfdmlld3MpLCAnc29ydF9ubycpO1xuICBfLmVhY2gobGlzdFZpZXdzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGlzRGlzYWJsZWQ7XG4gICAgaWYgKGlzTW9iaWxlICYmIGl0ZW0udHlwZSA9PT0gXCJjYWxlbmRhclwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpdGVtLm5hbWUgIT09IFwiZGVmYXVsdFwiKSB7XG4gICAgICBpc0Rpc2FibGVkID0gXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW0ubmFtZSkgPiAtMSB8fCAoaXRlbS5faWQgJiYgXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW0uX2lkKSA+IC0xKTtcbiAgICAgIGlmICghaXNEaXNhYmxlZCB8fCBpdGVtLm93bmVyID09PSB1c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlld3MucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbGlzdF92aWV3cztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgZmllbGRzTmFtZSwgcmVmLCB1bnJlYWRhYmxlX2ZpZWxkcztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBmaWVsZHNOYW1lID0gQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lKG9iamVjdF9uYW1lKTtcbiAgdW5yZWFkYWJsZV9maWVsZHMgPSAocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi51bnJlYWRhYmxlX2ZpZWxkcyA6IHZvaWQgMDtcbiAgcmV0dXJuIF8uZGlmZmVyZW5jZShmaWVsZHNOYW1lLCB1bnJlYWRhYmxlX2ZpZWxkcyk7XG59O1xuXG5DcmVhdG9yLmlzbG9hZGluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkLmdldCgpO1xufTtcblxuQ3JlYXRvci5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpO1xufTtcblxuQ3JlYXRvci5nZXREaXNhYmxlZEZpZWxkcyA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0uZGlzYWJsZWQgJiYgIWZpZWxkLmF1dG9mb3JtLm9taXQgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldEhpZGRlbkZpZWxkcyA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0udHlwZSA9PT0gXCJoaWRkZW5cIiAmJiAhZmllbGQuYXV0b2Zvcm0ub21pdCAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aE5vR3JvdXAgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuICghZmllbGQuYXV0b2Zvcm0gfHwgIWZpZWxkLmF1dG9mb3JtLmdyb3VwIHx8IGZpZWxkLmF1dG9mb3JtLmdyb3VwID09PSBcIi1cIikgJiYgKCFmaWVsZC5hdXRvZm9ybSB8fCBmaWVsZC5hdXRvZm9ybS50eXBlICE9PSBcImhpZGRlblwiKSAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0U29ydGVkRmllbGRHcm91cE5hbWVzID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBuYW1lcztcbiAgbmFtZXMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLmdyb3VwICE9PSBcIi1cIiAmJiBmaWVsZC5hdXRvZm9ybS5ncm91cDtcbiAgfSk7XG4gIG5hbWVzID0gXy5jb21wYWN0KG5hbWVzKTtcbiAgbmFtZXMgPSBfLnVuaXF1ZShuYW1lcyk7XG4gIHJldHVybiBuYW1lcztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzRm9yR3JvdXAgPSBmdW5jdGlvbihzY2hlbWEsIGdyb3VwTmFtZSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT09IGdyb3VwTmFtZSAmJiBmaWVsZC5hdXRvZm9ybS50eXBlICE9PSBcImhpZGRlblwiICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRTeXN0ZW1CYXNlRmllbGRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbXCJjcmVhdGVkXCIsIFwiY3JlYXRlZF9ieVwiLCBcIm1vZGlmaWVkXCIsIFwibW9kaWZpZWRfYnlcIl07XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRTeXN0ZW1CYXNlID0gZnVuY3Rpb24oa2V5cykge1xuICByZXR1cm4gXy5kaWZmZXJlbmNlKGtleXMsIENyZWF0b3IuZ2V0U3lzdGVtQmFzZUZpZWxkcygpKTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aG91dE9taXQgPSBmdW5jdGlvbihzY2hlbWEsIGtleXMpIHtcbiAga2V5cyA9IF8ubWFwKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBmaWVsZCwgcmVmO1xuICAgIGZpZWxkID0gXy5waWNrKHNjaGVtYSwga2V5KTtcbiAgICBpZiAoKHJlZiA9IGZpZWxkW2tleV0uYXV0b2Zvcm0pICE9IG51bGwgPyByZWYub21pdCA6IHZvaWQgMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cbiAgfSk7XG4gIGtleXMgPSBfLmNvbXBhY3Qoa2V5cyk7XG4gIHJldHVybiBrZXlzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNJbkZpcnN0TGV2ZWwgPSBmdW5jdGlvbihmaXJzdExldmVsS2V5cywga2V5cykge1xuICBrZXlzID0gXy5tYXAoa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKF8uaW5kZXhPZihmaXJzdExldmVsS2V5cywga2V5KSA+IC0xKSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcbiAga2V5cyA9IF8uY29tcGFjdChrZXlzKTtcbiAgcmV0dXJuIGtleXM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc0ZvclJlb3JkZXIgPSBmdW5jdGlvbihzY2hlbWEsIGtleXMsIGlzU2luZ2xlKSB7XG4gIHZhciBfa2V5cywgY2hpbGRLZXlzLCBmaWVsZHMsIGksIGlzX3dpZGVfMSwgaXNfd2lkZV8yLCBzY18xLCBzY18yO1xuICBmaWVsZHMgPSBbXTtcbiAgaSA9IDA7XG4gIF9rZXlzID0gXy5maWx0ZXIoa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuICFrZXkuZW5kc1dpdGgoJ19lbmRMaW5lJyk7XG4gIH0pO1xuICB3aGlsZSAoaSA8IF9rZXlzLmxlbmd0aCkge1xuICAgIHNjXzEgPSBfLnBpY2soc2NoZW1hLCBfa2V5c1tpXSk7XG4gICAgc2NfMiA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2kgKyAxXSk7XG4gICAgaXNfd2lkZV8xID0gZmFsc2U7XG4gICAgaXNfd2lkZV8yID0gZmFsc2U7XG4gICAgXy5lYWNoKHNjXzEsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCgocmVmID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYuaXNfd2lkZSA6IHZvaWQgMCkgfHwgKChyZWYxID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLnR5cGUgOiB2b2lkIDApID09PSBcInRhYmxlXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzX3dpZGVfMSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgXy5lYWNoKHNjXzIsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCgocmVmID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYuaXNfd2lkZSA6IHZvaWQgMCkgfHwgKChyZWYxID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLnR5cGUgOiB2b2lkIDApID09PSBcInRhYmxlXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzX3dpZGVfMiA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgaXNfd2lkZV8xID0gdHJ1ZTtcbiAgICAgIGlzX3dpZGVfMiA9IHRydWU7XG4gICAgfVxuICAgIGlmIChpc1NpbmdsZSkge1xuICAgICAgZmllbGRzLnB1c2goX2tleXMuc2xpY2UoaSwgaSArIDEpKTtcbiAgICAgIGkgKz0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzX3dpZGVfMSkge1xuICAgICAgICBmaWVsZHMucHVzaChfa2V5cy5zbGljZShpLCBpICsgMSkpO1xuICAgICAgICBpICs9IDE7XG4gICAgICB9IGVsc2UgaWYgKCFpc193aWRlXzEgJiYgaXNfd2lkZV8yKSB7XG4gICAgICAgIGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkgKyAxKTtcbiAgICAgICAgY2hpbGRLZXlzLnB1c2godm9pZCAwKTtcbiAgICAgICAgZmllbGRzLnB1c2goY2hpbGRLZXlzKTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgfSBlbHNlIGlmICghaXNfd2lkZV8xICYmICFpc193aWRlXzIpIHtcbiAgICAgICAgY2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSArIDEpO1xuICAgICAgICBpZiAoX2tleXNbaSArIDFdKSB7XG4gICAgICAgICAgY2hpbGRLZXlzLnB1c2goX2tleXNbaSArIDFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGlsZEtleXMucHVzaCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICAgIGZpZWxkcy5wdXNoKGNoaWxkS2V5cyk7XG4gICAgICAgIGkgKz0gMjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuaXNGaWx0ZXJWYWx1ZUVtcHR5ID0gZnVuY3Rpb24odikge1xuICByZXR1cm4gdHlwZW9mIHYgPT09IFwidW5kZWZpbmVkXCIgfHwgdiA9PT0gbnVsbCB8fCBOdW1iZXIuaXNOYU4odikgfHwgdi5sZW5ndGggPT09IDA7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGF0YVR5cGUgPSBmdW5jdGlvbihvYmplY3RGaWVsZHMsIGtleSkge1xuICB2YXIgcmVmLCByZXN1bHQ7XG4gIGlmIChvYmplY3RGaWVsZHMgJiYga2V5KSB7XG4gICAgcmVzdWx0ID0gKHJlZiA9IG9iamVjdEZpZWxkc1trZXldKSAhPSBudWxsID8gcmVmLnR5cGUgOiB2b2lkIDA7XG4gICAgaWYgKFtcImZvcm11bGFcIiwgXCJzdW1tYXJ5XCJdLmluZGV4T2YocmVzdWx0KSA+IC0xKSB7XG4gICAgICByZXN1bHQgPSBvYmplY3RGaWVsZHNba2V5XS5kYXRhX3R5cGU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwidGV4dFwiO1xuICB9XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3IuZ2V0QWxsUmVsYXRlZE9iamVjdHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgIHZhciByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdO1xuICAgIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICAgIGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSkge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoKHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpLmVuYWJsZV9maWxlcykge1xuICAgICAgcmVsYXRlZF9vYmplY3RfbmFtZXMucHVzaChcImNtc19maWxlc1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3MuZm9ybWF0SW5kZXggPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciBpbmRleE5hbWUsIGlzZG9jdW1lbnREQiwgb2JqZWN0LCByZWYsIHJlZjEsIHJlZjI7XG4gICAgb2JqZWN0ID0ge1xuICAgICAgYmFja2dyb3VuZDogdHJ1ZVxuICAgIH07XG4gICAgaXNkb2N1bWVudERCID0gKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMSA9IHJlZi5kYXRhc291cmNlcykgIT0gbnVsbCA/IChyZWYyID0gcmVmMVtcImRlZmF1bHRcIl0pICE9IG51bGwgPyByZWYyLmRvY3VtZW50REIgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDApIHx8IGZhbHNlO1xuICAgIGlmIChpc2RvY3VtZW50REIpIHtcbiAgICAgIGlmIChhcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGluZGV4TmFtZSA9IGFycmF5LmpvaW4oXCIuXCIpO1xuICAgICAgICBvYmplY3QubmFtZSA9IGluZGV4TmFtZTtcbiAgICAgICAgaWYgKGluZGV4TmFtZS5sZW5ndGggPiA1Mikge1xuICAgICAgICAgIG9iamVjdC5uYW1lID0gaW5kZXhOYW1lLnN1YnN0cmluZygwLCA1Mik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cbiIsIkNyZWF0b3IuYXBwc0J5TmFtZSA9IHt9XG5cbiIsIk1ldGVvci5tZXRob2RzXG5cdFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlX2lkKS0+XG5cdFx0aWYgIXRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0aWYgb2JqZWN0X25hbWUgPT0gXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiXG5cdFx0XHRyZXR1cm5cblx0XHRpZiBvYmplY3RfbmFtZSBhbmQgcmVjb3JkX2lkXG5cdFx0XHRpZiAhc3BhY2VfaWRcblx0XHRcdFx0ZG9jID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kT25lKHtfaWQ6IHJlY29yZF9pZH0sIHtmaWVsZHM6IHtzcGFjZTogMX19KVxuXHRcdFx0XHRzcGFjZV9pZCA9IGRvYz8uc3BhY2VcblxuXHRcdFx0Y29sbGVjdGlvbl9yZWNlbnRfdmlld2VkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIilcblx0XHRcdGZpbHRlcnMgPSB7IG93bmVyOiB0aGlzLnVzZXJJZCwgc3BhY2U6IHNwYWNlX2lkLCAncmVjb3JkLm8nOiBvYmplY3RfbmFtZSwgJ3JlY29yZC5pZHMnOiBbcmVjb3JkX2lkXX1cblx0XHRcdGN1cnJlbnRfcmVjZW50X3ZpZXdlZCA9IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5maW5kT25lKGZpbHRlcnMpXG5cdFx0XHRpZiBjdXJyZW50X3JlY2VudF92aWV3ZWRcblx0XHRcdFx0Y29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLnVwZGF0ZShcblx0XHRcdFx0XHRjdXJyZW50X3JlY2VudF92aWV3ZWQuX2lkLFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdCRpbmM6IHtcblx0XHRcdFx0XHRcdFx0Y291bnQ6IDFcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHQkc2V0OiB7XG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkOiBuZXcgRGF0ZSgpXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuaW5zZXJ0KFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdF9pZDogY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLl9tYWtlTmV3SUQoKVxuXHRcdFx0XHRcdFx0b3duZXI6IHRoaXMudXNlcklkXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VfaWRcblx0XHRcdFx0XHRcdHJlY29yZDoge286IG9iamVjdF9uYW1lLCBpZHM6IFtyZWNvcmRfaWRdfVxuXHRcdFx0XHRcdFx0Y291bnQ6IDFcblx0XHRcdFx0XHRcdGNyZWF0ZWQ6IG5ldyBEYXRlKClcblx0XHRcdFx0XHRcdGNyZWF0ZWRfYnk6IHRoaXMudXNlcklkXG5cdFx0XHRcdFx0XHRtb2RpZmllZDogbmV3IERhdGUoKVxuXHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpXG5cdFx0XHRyZXR1cm4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc3BhY2VfaWQpIHtcbiAgICB2YXIgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLCBjdXJyZW50X3JlY2VudF92aWV3ZWQsIGRvYywgZmlsdGVycztcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBcIm9iamVjdF9yZWNlbnRfdmlld2VkXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG9iamVjdF9uYW1lICYmIHJlY29yZF9pZCkge1xuICAgICAgaWYgKCFzcGFjZV9pZCkge1xuICAgICAgICBkb2MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmRPbmUoe1xuICAgICAgICAgIF9pZDogcmVjb3JkX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHNwYWNlOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc3BhY2VfaWQgPSBkb2MgIT0gbnVsbCA/IGRvYy5zcGFjZSA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICAgIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9yZWNlbnRfdmlld2VkXCIpO1xuICAgICAgZmlsdGVycyA9IHtcbiAgICAgICAgb3duZXI6IHRoaXMudXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICdyZWNvcmQubyc6IG9iamVjdF9uYW1lLFxuICAgICAgICAncmVjb3JkLmlkcyc6IFtyZWNvcmRfaWRdXG4gICAgICB9O1xuICAgICAgY3VycmVudF9yZWNlbnRfdmlld2VkID0gY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLmZpbmRPbmUoZmlsdGVycyk7XG4gICAgICBpZiAoY3VycmVudF9yZWNlbnRfdmlld2VkKSB7XG4gICAgICAgIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC51cGRhdGUoY3VycmVudF9yZWNlbnRfdmlld2VkLl9pZCwge1xuICAgICAgICAgICRpbmM6IHtcbiAgICAgICAgICAgIGNvdW50OiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuaW5zZXJ0KHtcbiAgICAgICAgICBfaWQ6IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5fbWFrZU5ld0lEKCksXG4gICAgICAgICAgb3duZXI6IHRoaXMudXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICByZWNvcmQ6IHtcbiAgICAgICAgICAgIG86IG9iamVjdF9uYW1lLFxuICAgICAgICAgICAgaWRzOiBbcmVjb3JkX2lkXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICBjcmVhdGVkX2J5OiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICBtb2RpZmllZF9ieTogdGhpcy51c2VySWRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcbiIsInJlY2VudF9hZ2dyZWdhdGUgPSAoY3JlYXRlZF9ieSwgc3BhY2VJZCwgX3JlY29yZHMsIGNhbGxiYWNrKS0+XG5cdENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3JlY2VudF92aWV3ZWQucmF3Q29sbGVjdGlvbigpLmFnZ3JlZ2F0ZShbXG5cdFx0eyRtYXRjaDoge2NyZWF0ZWRfYnk6IGNyZWF0ZWRfYnksIHNwYWNlOiBzcGFjZUlkfX0sXG5cdFx0eyRncm91cDoge19pZDoge29iamVjdF9uYW1lOiBcIiRyZWNvcmQub1wiLCByZWNvcmRfaWQ6IFwiJHJlY29yZC5pZHNcIiwgc3BhY2U6IFwiJHNwYWNlXCJ9LCBtYXhDcmVhdGVkOiB7JG1heDogXCIkY3JlYXRlZFwifX19LFxuXHRcdHskc29ydDoge21heENyZWF0ZWQ6IC0xfX0sXG5cdFx0eyRsaW1pdDogMTB9XG5cdF0pLnRvQXJyYXkgKGVyciwgZGF0YSktPlxuXHRcdGlmIGVyclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycilcblxuXHRcdGRhdGEuZm9yRWFjaCAoZG9jKSAtPlxuXHRcdFx0X3JlY29yZHMucHVzaCBkb2MuX2lkXG5cblx0XHRpZiBjYWxsYmFjayAmJiBfLmlzRnVuY3Rpb24oY2FsbGJhY2spXG5cdFx0XHRjYWxsYmFjaygpXG5cblx0XHRyZXR1cm5cblxuYXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSA9IE1ldGVvci53cmFwQXN5bmMocmVjZW50X2FnZ3JlZ2F0ZSlcblxuc2VhcmNoX29iamVjdCA9IChzcGFjZSwgb2JqZWN0X25hbWUsdXNlcklkLCBzZWFyY2hUZXh0KS0+XG5cdGRhdGEgPSBuZXcgQXJyYXkoKVxuXG5cdGlmIHNlYXJjaFRleHRcblxuXHRcdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRcdF9vYmplY3RfY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSlcblx0XHRfb2JqZWN0X25hbWVfa2V5ID0gX29iamVjdD8uTkFNRV9GSUVMRF9LRVlcblx0XHRpZiBfb2JqZWN0ICYmIF9vYmplY3RfY29sbGVjdGlvbiAmJiBfb2JqZWN0X25hbWVfa2V5XG5cdFx0XHRxdWVyeSA9IHt9XG5cdFx0XHRzZWFyY2hfS2V5d29yZHMgPSBzZWFyY2hUZXh0LnNwbGl0KFwiIFwiKVxuXHRcdFx0cXVlcnlfYW5kID0gW11cblx0XHRcdHNlYXJjaF9LZXl3b3Jkcy5mb3JFYWNoIChrZXl3b3JkKS0+XG5cdFx0XHRcdHN1YnF1ZXJ5ID0ge31cblx0XHRcdFx0c3VicXVlcnlbX29iamVjdF9uYW1lX2tleV0gPSB7JHJlZ2V4OiBrZXl3b3JkLnRyaW0oKX1cblx0XHRcdFx0cXVlcnlfYW5kLnB1c2ggc3VicXVlcnlcblxuXHRcdFx0cXVlcnkuJGFuZCA9IHF1ZXJ5X2FuZFxuXHRcdFx0cXVlcnkuc3BhY2UgPSB7JGluOiBbc3BhY2VdfVxuXG5cdFx0XHRmaWVsZHMgPSB7X2lkOiAxfVxuXHRcdFx0ZmllbGRzW19vYmplY3RfbmFtZV9rZXldID0gMVxuXG5cdFx0XHRyZWNvcmRzID0gX29iamVjdF9jb2xsZWN0aW9uLmZpbmQocXVlcnksIHtmaWVsZHM6IGZpZWxkcywgc29ydDoge21vZGlmaWVkOiAxfSwgbGltaXQ6IDV9KVxuXG5cdFx0XHRyZWNvcmRzLmZvckVhY2ggKHJlY29yZCktPlxuXHRcdFx0XHRkYXRhLnB1c2gge19pZDogcmVjb3JkLl9pZCwgX25hbWU6IHJlY29yZFtfb2JqZWN0X25hbWVfa2V5XSwgX29iamVjdF9uYW1lOiBvYmplY3RfbmFtZX1cblx0XG5cdHJldHVybiBkYXRhXG5cbk1ldGVvci5tZXRob2RzXG5cdCdvYmplY3RfcmVjZW50X3JlY29yZCc6IChzcGFjZUlkKS0+XG5cdFx0ZGF0YSA9IG5ldyBBcnJheSgpXG5cdFx0cmVjb3JkcyA9IG5ldyBBcnJheSgpXG5cdFx0YXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSh0aGlzLnVzZXJJZCwgc3BhY2VJZCwgcmVjb3Jkcylcblx0XHRyZWNvcmRzLmZvckVhY2ggKGl0ZW0pLT5cblx0XHRcdHJlY29yZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChpdGVtLm9iamVjdF9uYW1lLCBpdGVtLnNwYWNlKVxuXG5cdFx0XHRpZiAhcmVjb3JkX29iamVjdFxuXHRcdFx0XHRyZXR1cm5cblxuXHRcdFx0cmVjb3JkX29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpXG5cblx0XHRcdGlmIHJlY29yZF9vYmplY3QgJiYgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uXG5cdFx0XHRcdGZpZWxkcyA9IHtfaWQ6IDF9XG5cblx0XHRcdFx0ZmllbGRzW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldID0gMVxuXG5cdFx0XHRcdHJlY29yZCA9IHJlY29yZF9vYmplY3RfY29sbGVjdGlvbi5maW5kT25lKGl0ZW0ucmVjb3JkX2lkWzBdLCB7ZmllbGRzOiBmaWVsZHN9KVxuXHRcdFx0XHRpZiByZWNvcmRcblx0XHRcdFx0XHRkYXRhLnB1c2gge19pZDogcmVjb3JkLl9pZCwgX25hbWU6IHJlY29yZFtyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSwgX29iamVjdF9uYW1lOiBpdGVtLm9iamVjdF9uYW1lfVxuXG5cdFx0cmV0dXJuIGRhdGFcblxuXHQnb2JqZWN0X3JlY29yZF9zZWFyY2gnOiAob3B0aW9ucyktPlxuXHRcdHNlbGYgPSB0aGlzXG5cblx0XHRkYXRhID0gbmV3IEFycmF5KClcblxuXHRcdHNlYXJjaFRleHQgPSBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRzcGFjZSA9IG9wdGlvbnMuc3BhY2VcblxuXHRcdF8uZm9yRWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChfb2JqZWN0LCBuYW1lKS0+XG5cdFx0XHRpZiBfb2JqZWN0LmVuYWJsZV9zZWFyY2hcblx0XHRcdFx0b2JqZWN0X3JlY29yZCA9IHNlYXJjaF9vYmplY3Qoc3BhY2UsIF9vYmplY3QubmFtZSwgc2VsZi51c2VySWQsIHNlYXJjaFRleHQpXG5cdFx0XHRcdGRhdGEgPSBkYXRhLmNvbmNhdChvYmplY3RfcmVjb3JkKVxuXG5cdFx0cmV0dXJuIGRhdGFcbiIsInZhciBhc3luY19yZWNlbnRfYWdncmVnYXRlLCByZWNlbnRfYWdncmVnYXRlLCBzZWFyY2hfb2JqZWN0O1xuXG5yZWNlbnRfYWdncmVnYXRlID0gZnVuY3Rpb24oY3JlYXRlZF9ieSwgc3BhY2VJZCwgX3JlY29yZHMsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9yZWNlbnRfdmlld2VkLnJhd0NvbGxlY3Rpb24oKS5hZ2dyZWdhdGUoW1xuICAgIHtcbiAgICAgICRtYXRjaDoge1xuICAgICAgICBjcmVhdGVkX2J5OiBjcmVhdGVkX2J5LFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgICRncm91cDoge1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogXCIkcmVjb3JkLm9cIixcbiAgICAgICAgICByZWNvcmRfaWQ6IFwiJHJlY29yZC5pZHNcIixcbiAgICAgICAgICBzcGFjZTogXCIkc3BhY2VcIlxuICAgICAgICB9LFxuICAgICAgICBtYXhDcmVhdGVkOiB7XG4gICAgICAgICAgJG1heDogXCIkY3JlYXRlZFwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAkc29ydDoge1xuICAgICAgICBtYXhDcmVhdGVkOiAtMVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgICRsaW1pdDogMTBcbiAgICB9XG4gIF0pLnRvQXJyYXkoZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihkb2MpIHtcbiAgICAgIHJldHVybiBfcmVjb3Jkcy5wdXNoKGRvYy5faWQpO1xuICAgIH0pO1xuICAgIGlmIChjYWxsYmFjayAmJiBfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5hc3luY19yZWNlbnRfYWdncmVnYXRlID0gTWV0ZW9yLndyYXBBc3luYyhyZWNlbnRfYWdncmVnYXRlKTtcblxuc2VhcmNoX29iamVjdCA9IGZ1bmN0aW9uKHNwYWNlLCBvYmplY3RfbmFtZSwgdXNlcklkLCBzZWFyY2hUZXh0KSB7XG4gIHZhciBfb2JqZWN0LCBfb2JqZWN0X2NvbGxlY3Rpb24sIF9vYmplY3RfbmFtZV9rZXksIGRhdGEsIGZpZWxkcywgcXVlcnksIHF1ZXJ5X2FuZCwgcmVjb3Jkcywgc2VhcmNoX0tleXdvcmRzO1xuICBkYXRhID0gbmV3IEFycmF5KCk7XG4gIGlmIChzZWFyY2hUZXh0KSB7XG4gICAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpO1xuICAgIF9vYmplY3RfbmFtZV9rZXkgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lk5BTUVfRklFTERfS0VZIDogdm9pZCAwO1xuICAgIGlmIChfb2JqZWN0ICYmIF9vYmplY3RfY29sbGVjdGlvbiAmJiBfb2JqZWN0X25hbWVfa2V5KSB7XG4gICAgICBxdWVyeSA9IHt9O1xuICAgICAgc2VhcmNoX0tleXdvcmRzID0gc2VhcmNoVGV4dC5zcGxpdChcIiBcIik7XG4gICAgICBxdWVyeV9hbmQgPSBbXTtcbiAgICAgIHNlYXJjaF9LZXl3b3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKGtleXdvcmQpIHtcbiAgICAgICAgdmFyIHN1YnF1ZXJ5O1xuICAgICAgICBzdWJxdWVyeSA9IHt9O1xuICAgICAgICBzdWJxdWVyeVtfb2JqZWN0X25hbWVfa2V5XSA9IHtcbiAgICAgICAgICAkcmVnZXg6IGtleXdvcmQudHJpbSgpXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBxdWVyeV9hbmQucHVzaChzdWJxdWVyeSk7XG4gICAgICB9KTtcbiAgICAgIHF1ZXJ5LiRhbmQgPSBxdWVyeV9hbmQ7XG4gICAgICBxdWVyeS5zcGFjZSA9IHtcbiAgICAgICAgJGluOiBbc3BhY2VdXG4gICAgICB9O1xuICAgICAgZmllbGRzID0ge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH07XG4gICAgICBmaWVsZHNbX29iamVjdF9uYW1lX2tleV0gPSAxO1xuICAgICAgcmVjb3JkcyA9IF9vYmplY3RfY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCB7XG4gICAgICAgIGZpZWxkczogZmllbGRzLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgbW9kaWZpZWQ6IDFcbiAgICAgICAgfSxcbiAgICAgICAgbGltaXQ6IDVcbiAgICAgIH0pO1xuICAgICAgcmVjb3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICByZXR1cm4gZGF0YS5wdXNoKHtcbiAgICAgICAgICBfaWQ6IHJlY29yZC5faWQsXG4gICAgICAgICAgX25hbWU6IHJlY29yZFtfb2JqZWN0X25hbWVfa2V5XSxcbiAgICAgICAgICBfb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkYXRhO1xufTtcblxuTWV0ZW9yLm1ldGhvZHMoe1xuICAnb2JqZWN0X3JlY2VudF9yZWNvcmQnOiBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIGRhdGEsIHJlY29yZHM7XG4gICAgZGF0YSA9IG5ldyBBcnJheSgpO1xuICAgIHJlY29yZHMgPSBuZXcgQXJyYXkoKTtcbiAgICBhc3luY19yZWNlbnRfYWdncmVnYXRlKHRoaXMudXNlcklkLCBzcGFjZUlkLCByZWNvcmRzKTtcbiAgICByZWNvcmRzLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgdmFyIGZpZWxkcywgcmVjb3JkLCByZWNvcmRfb2JqZWN0LCByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb247XG4gICAgICByZWNvcmRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSk7XG4gICAgICBpZiAoIXJlY29yZF9vYmplY3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpO1xuICAgICAgaWYgKHJlY29yZF9vYmplY3QgJiYgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uKSB7XG4gICAgICAgIGZpZWxkcyA9IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfTtcbiAgICAgICAgZmllbGRzW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldID0gMTtcbiAgICAgICAgcmVjb3JkID0gcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uLmZpbmRPbmUoaXRlbS5yZWNvcmRfaWRbMF0sIHtcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICAgIHJldHVybiBkYXRhLnB1c2goe1xuICAgICAgICAgICAgX2lkOiByZWNvcmQuX2lkLFxuICAgICAgICAgICAgX25hbWU6IHJlY29yZFtyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSxcbiAgICAgICAgICAgIF9vYmplY3RfbmFtZTogaXRlbS5vYmplY3RfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH0sXG4gICdvYmplY3RfcmVjb3JkX3NlYXJjaCc6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgZGF0YSwgc2VhcmNoVGV4dCwgc2VsZiwgc3BhY2U7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgZGF0YSA9IG5ldyBBcnJheSgpO1xuICAgIHNlYXJjaFRleHQgPSBvcHRpb25zLnNlYXJjaFRleHQ7XG4gICAgc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICAgIF8uZm9yRWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKF9vYmplY3QsIG5hbWUpIHtcbiAgICAgIHZhciBvYmplY3RfcmVjb3JkO1xuICAgICAgaWYgKF9vYmplY3QuZW5hYmxlX3NlYXJjaCkge1xuICAgICAgICBvYmplY3RfcmVjb3JkID0gc2VhcmNoX29iamVjdChzcGFjZSwgX29iamVjdC5uYW1lLCBzZWxmLnVzZXJJZCwgc2VhcmNoVGV4dCk7XG4gICAgICAgIHJldHVybiBkYXRhID0gZGF0YS5jb25jYXQob2JqZWN0X3JlY29yZCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcbiAgICB1cGRhdGVfZmlsdGVyczogKGxpc3R2aWV3X2lkLCBmaWx0ZXJzLCBmaWx0ZXJfc2NvcGUsIGZpbHRlcl9sb2dpYyktPlxuICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MuZGlyZWN0LnVwZGF0ZSh7X2lkOiBsaXN0dmlld19pZH0sIHskc2V0OiB7ZmlsdGVyczogZmlsdGVycywgZmlsdGVyX3Njb3BlOiBmaWx0ZXJfc2NvcGUsIGZpbHRlcl9sb2dpYzogZmlsdGVyX2xvZ2ljfX0pXG5cbiAgICB1cGRhdGVfY29sdW1uczogKGxpc3R2aWV3X2lkLCBjb2x1bW5zKS0+XG4gICAgICAgIGNoZWNrKGNvbHVtbnMsIEFycmF5KVxuICAgICAgICBcbiAgICAgICAgaWYgY29sdW1ucy5sZW5ndGggPCAxXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMCwgXCJTZWxlY3QgYXQgbGVhc3Qgb25lIGZpZWxkIHRvIGRpc3BsYXlcIlxuICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MudXBkYXRlKHtfaWQ6IGxpc3R2aWV3X2lkfSwgeyRzZXQ6IHtjb2x1bW5zOiBjb2x1bW5zfX0pXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIHVwZGF0ZV9maWx0ZXJzOiBmdW5jdGlvbihsaXN0dmlld19pZCwgZmlsdGVycywgZmlsdGVyX3Njb3BlLCBmaWx0ZXJfbG9naWMpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfbGlzdHZpZXdzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBsaXN0dmlld19pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgZmlsdGVyczogZmlsdGVycyxcbiAgICAgICAgZmlsdGVyX3Njb3BlOiBmaWx0ZXJfc2NvcGUsXG4gICAgICAgIGZpbHRlcl9sb2dpYzogZmlsdGVyX2xvZ2ljXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHVwZGF0ZV9jb2x1bW5zOiBmdW5jdGlvbihsaXN0dmlld19pZCwgY29sdW1ucykge1xuICAgIGNoZWNrKGNvbHVtbnMsIEFycmF5KTtcbiAgICBpZiAoY29sdW1ucy5sZW5ndGggPCAxKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCJTZWxlY3QgYXQgbGVhc3Qgb25lIGZpZWxkIHRvIGRpc3BsYXlcIik7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MudXBkYXRlKHtcbiAgICAgIF9pZDogbGlzdHZpZXdfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnNcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHQncmVwb3J0X2RhdGEnOiAob3B0aW9ucyktPlxuXHRcdGNoZWNrKG9wdGlvbnMsIE9iamVjdClcblx0XHRzcGFjZSA9IG9wdGlvbnMuc3BhY2Vcblx0XHRmaWVsZHMgPSBvcHRpb25zLmZpZWxkc1xuXHRcdG9iamVjdF9uYW1lID0gb3B0aW9ucy5vYmplY3RfbmFtZVxuXHRcdGZpbHRlcl9zY29wZSA9IG9wdGlvbnMuZmlsdGVyX3Njb3BlXG5cdFx0ZmlsdGVycyA9IG9wdGlvbnMuZmlsdGVyc1xuXHRcdGZpbHRlckZpZWxkcyA9IHt9XG5cdFx0Y29tcG91bmRGaWVsZHMgPSBbXVxuXHRcdG9iamVjdEZpZWxkcyA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKT8uZmllbGRzXG5cdFx0Xy5lYWNoIGZpZWxkcywgKGl0ZW0sIGluZGV4KS0+XG5cdFx0XHRzcGxpdHMgPSBpdGVtLnNwbGl0KFwiLlwiKVxuXHRcdFx0bmFtZSA9IHNwbGl0c1swXVxuXHRcdFx0b2JqZWN0RmllbGQgPSBvYmplY3RGaWVsZHNbbmFtZV1cblx0XHRcdGlmIHNwbGl0cy5sZW5ndGggPiAxIGFuZCBvYmplY3RGaWVsZFxuXHRcdFx0XHRjaGlsZEtleSA9IGl0ZW0ucmVwbGFjZSBuYW1lICsgXCIuXCIsIFwiXCJcblx0XHRcdFx0Y29tcG91bmRGaWVsZHMucHVzaCh7bmFtZTogbmFtZSwgY2hpbGRLZXk6IGNoaWxkS2V5LCBmaWVsZDogb2JqZWN0RmllbGR9KVxuXHRcdFx0ZmlsdGVyRmllbGRzW25hbWVdID0gMVxuXG5cdFx0c2VsZWN0b3IgPSB7fVxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXG5cdFx0c2VsZWN0b3Iuc3BhY2UgPSBzcGFjZVxuXHRcdGlmIGZpbHRlcl9zY29wZSA9PSBcInNwYWNleFwiXG5cdFx0XHRzZWxlY3Rvci5zcGFjZSA9IFxuXHRcdFx0XHQkaW46IFtudWxsLHNwYWNlXVxuXHRcdGVsc2UgaWYgZmlsdGVyX3Njb3BlID09IFwibWluZVwiXG5cdFx0XHRzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxuXG5cdFx0aWYgQ3JlYXRvci5pc0NvbW1vblNwYWNlKHNwYWNlKSAmJiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZSwgQHVzZXJJZClcblx0XHRcdGRlbGV0ZSBzZWxlY3Rvci5zcGFjZVxuXG5cdFx0aWYgZmlsdGVycyBhbmQgZmlsdGVycy5sZW5ndGggPiAwXG5cdFx0XHRzZWxlY3RvcltcIiRhbmRcIl0gPSBmaWx0ZXJzXG5cblx0XHRjdXJzb3IgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IsIHtmaWVsZHM6IGZpbHRlckZpZWxkcywgc2tpcDogMCwgbGltaXQ6IDEwMDAwfSlcbiNcdFx0aWYgY3Vyc29yLmNvdW50KCkgPiAxMDAwMFxuI1x0XHRcdHJldHVybiBbXVxuXHRcdHJlc3VsdCA9IGN1cnNvci5mZXRjaCgpXG5cdFx0aWYgY29tcG91bmRGaWVsZHMubGVuZ3RoXG5cdFx0XHRyZXN1bHQgPSByZXN1bHQubWFwIChpdGVtLGluZGV4KS0+XG5cdFx0XHRcdF8uZWFjaCBjb21wb3VuZEZpZWxkcywgKGNvbXBvdW5kRmllbGRJdGVtLCBpbmRleCktPlxuXHRcdFx0XHRcdGl0ZW1LZXkgPSBjb21wb3VuZEZpZWxkSXRlbS5uYW1lICsgXCIqJSpcIiArIGNvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5LnJlcGxhY2UoL1xcLi9nLCBcIiolKlwiKVxuXHRcdFx0XHRcdGl0ZW1WYWx1ZSA9IGl0ZW1bY29tcG91bmRGaWVsZEl0ZW0ubmFtZV1cblx0XHRcdFx0XHR0eXBlID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQudHlwZVxuXHRcdFx0XHRcdGlmIFtcImxvb2t1cFwiLCBcIm1hc3Rlcl9kZXRhaWxcIl0uaW5kZXhPZih0eXBlKSA+IC0xXG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0XHRcdGNvbXBvdW5kRmlsdGVyRmllbGRzID0ge31cblx0XHRcdFx0XHRcdGNvbXBvdW5kRmlsdGVyRmllbGRzW2NvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5XSA9IDFcblx0XHRcdFx0XHRcdHJlZmVyZW5jZUl0ZW0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvKS5maW5kT25lIHtfaWQ6IGl0ZW1WYWx1ZX0sIGZpZWxkczogY29tcG91bmRGaWx0ZXJGaWVsZHNcblx0XHRcdFx0XHRcdGlmIHJlZmVyZW5jZUl0ZW1cblx0XHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IHJlZmVyZW5jZUl0ZW1bY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldXG5cdFx0XHRcdFx0ZWxzZSBpZiB0eXBlID09IFwic2VsZWN0XCJcblx0XHRcdFx0XHRcdG9wdGlvbnMgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5vcHRpb25zXG5cdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gXy5maW5kV2hlcmUob3B0aW9ucywge3ZhbHVlOiBpdGVtVmFsdWV9KT8ubGFiZWwgb3IgaXRlbVZhbHVlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IGl0ZW1WYWx1ZVxuXHRcdFx0XHRcdHVubGVzcyBpdGVtW2l0ZW1LZXldXG5cdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gXCItLVwiXG5cdFx0XHRcdHJldHVybiBpdGVtXG5cdFx0XHRyZXR1cm4gcmVzdWx0XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHJlc3VsdFxuXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gICdyZXBvcnRfZGF0YSc6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY29tcG91bmRGaWVsZHMsIGN1cnNvciwgZmllbGRzLCBmaWx0ZXJGaWVsZHMsIGZpbHRlcl9zY29wZSwgZmlsdGVycywgb2JqZWN0RmllbGRzLCBvYmplY3RfbmFtZSwgcmVmLCByZXN1bHQsIHNlbGVjdG9yLCBzcGFjZSwgdXNlcklkO1xuICAgIGNoZWNrKG9wdGlvbnMsIE9iamVjdCk7XG4gICAgc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICAgIGZpZWxkcyA9IG9wdGlvbnMuZmllbGRzO1xuICAgIG9iamVjdF9uYW1lID0gb3B0aW9ucy5vYmplY3RfbmFtZTtcbiAgICBmaWx0ZXJfc2NvcGUgPSBvcHRpb25zLmZpbHRlcl9zY29wZTtcbiAgICBmaWx0ZXJzID0gb3B0aW9ucy5maWx0ZXJzO1xuICAgIGZpbHRlckZpZWxkcyA9IHt9O1xuICAgIGNvbXBvdW5kRmllbGRzID0gW107XG4gICAgb2JqZWN0RmllbGRzID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDA7XG4gICAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgIHZhciBjaGlsZEtleSwgbmFtZSwgb2JqZWN0RmllbGQsIHNwbGl0cztcbiAgICAgIHNwbGl0cyA9IGl0ZW0uc3BsaXQoXCIuXCIpO1xuICAgICAgbmFtZSA9IHNwbGl0c1swXTtcbiAgICAgIG9iamVjdEZpZWxkID0gb2JqZWN0RmllbGRzW25hbWVdO1xuICAgICAgaWYgKHNwbGl0cy5sZW5ndGggPiAxICYmIG9iamVjdEZpZWxkKSB7XG4gICAgICAgIGNoaWxkS2V5ID0gaXRlbS5yZXBsYWNlKG5hbWUgKyBcIi5cIiwgXCJcIik7XG4gICAgICAgIGNvbXBvdW5kRmllbGRzLnB1c2goe1xuICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgY2hpbGRLZXk6IGNoaWxkS2V5LFxuICAgICAgICAgIGZpZWxkOiBvYmplY3RGaWVsZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmaWx0ZXJGaWVsZHNbbmFtZV0gPSAxO1xuICAgIH0pO1xuICAgIHNlbGVjdG9yID0ge307XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZTtcbiAgICBpZiAoZmlsdGVyX3Njb3BlID09PSBcInNwYWNleFwiKSB7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHtcbiAgICAgICAgJGluOiBbbnVsbCwgc3BhY2VdXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyX3Njb3BlID09PSBcIm1pbmVcIikge1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgfVxuICAgIGlmIChDcmVhdG9yLmlzQ29tbW9uU3BhY2Uoc3BhY2UpICYmIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlLCB0aGlzLnVzZXJJZCkpIHtcbiAgICAgIGRlbGV0ZSBzZWxlY3Rvci5zcGFjZTtcbiAgICB9XG4gICAgaWYgKGZpbHRlcnMgJiYgZmlsdGVycy5sZW5ndGggPiAwKSB7XG4gICAgICBzZWxlY3RvcltcIiRhbmRcIl0gPSBmaWx0ZXJzO1xuICAgIH1cbiAgICBjdXJzb3IgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IsIHtcbiAgICAgIGZpZWxkczogZmlsdGVyRmllbGRzLFxuICAgICAgc2tpcDogMCxcbiAgICAgIGxpbWl0OiAxMDAwMFxuICAgIH0pO1xuICAgIHJlc3VsdCA9IGN1cnNvci5mZXRjaCgpO1xuICAgIGlmIChjb21wb3VuZEZpZWxkcy5sZW5ndGgpIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5tYXAoZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgXy5lYWNoKGNvbXBvdW5kRmllbGRzLCBmdW5jdGlvbihjb21wb3VuZEZpZWxkSXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICB2YXIgY29tcG91bmRGaWx0ZXJGaWVsZHMsIGl0ZW1LZXksIGl0ZW1WYWx1ZSwgcmVmMSwgcmVmZXJlbmNlSXRlbSwgcmVmZXJlbmNlX3RvLCB0eXBlO1xuICAgICAgICAgIGl0ZW1LZXkgPSBjb21wb3VuZEZpZWxkSXRlbS5uYW1lICsgXCIqJSpcIiArIGNvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5LnJlcGxhY2UoL1xcLi9nLCBcIiolKlwiKTtcbiAgICAgICAgICBpdGVtVmFsdWUgPSBpdGVtW2NvbXBvdW5kRmllbGRJdGVtLm5hbWVdO1xuICAgICAgICAgIHR5cGUgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC50eXBlO1xuICAgICAgICAgIGlmIChbXCJsb29rdXBcIiwgXCJtYXN0ZXJfZGV0YWlsXCJdLmluZGV4T2YodHlwZSkgPiAtMSkge1xuICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgY29tcG91bmRGaWx0ZXJGaWVsZHMgPSB7fTtcbiAgICAgICAgICAgIGNvbXBvdW5kRmlsdGVyRmllbGRzW2NvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5XSA9IDE7XG4gICAgICAgICAgICByZWZlcmVuY2VJdGVtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bykuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogaXRlbVZhbHVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczogY29tcG91bmRGaWx0ZXJGaWVsZHNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZUl0ZW0pIHtcbiAgICAgICAgICAgICAgaXRlbVtpdGVtS2V5XSA9IHJlZmVyZW5jZUl0ZW1bY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgICAgICAgb3B0aW9ucyA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLm9wdGlvbnM7XG4gICAgICAgICAgICBpdGVtW2l0ZW1LZXldID0gKChyZWYxID0gXy5maW5kV2hlcmUob3B0aW9ucywge1xuICAgICAgICAgICAgICB2YWx1ZTogaXRlbVZhbHVlXG4gICAgICAgICAgICB9KSkgIT0gbnVsbCA/IHJlZjEubGFiZWwgOiB2b2lkIDApIHx8IGl0ZW1WYWx1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXRlbVtpdGVtS2V5XSA9IGl0ZW1WYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFpdGVtW2l0ZW1LZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbVtpdGVtS2V5XSA9IFwiLS1cIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH1cbn0pO1xuIiwiIyMjXG4gICAgdHlwZTogXCJ1c2VyXCJcbiAgICBvYmplY3RfbmFtZTogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgICByZWNvcmRfaWQ6IFwie29iamVjdF9uYW1lfSx7bGlzdHZpZXdfaWR9XCJcbiAgICBzZXR0aW5nczpcbiAgICAgICAgY29sdW1uX3dpZHRoOiB7IGZpZWxkX2E6IDEwMCwgZmllbGRfMjogMTUwIH1cbiAgICAgICAgc29ydDogW1tcImZpZWxkX2FcIiwgXCJkZXNjXCJdXVxuICAgIG93bmVyOiB7dXNlcklkfVxuIyMjXG5cbk1ldGVvci5tZXRob2RzXG4gICAgXCJ0YWJ1bGFyX3NvcnRfc2V0dGluZ3NcIjogKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIHNvcnQpLT5cbiAgICAgICAgdXNlcklkID0gdGhpcy51c2VySWRcbiAgICAgICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLCBvd25lcjogdXNlcklkfSlcbiAgICAgICAgaWYgc2V0dGluZ1xuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LnNvcnRcIjogc29ydH19KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBkb2MgPSBcbiAgICAgICAgICAgICAgICB0eXBlOiBcInVzZXJcIlxuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuICAgICAgICAgICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge31cbiAgICAgICAgICAgICAgICBvd25lcjogdXNlcklkXG5cbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge31cbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0XG5cbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYylcblxuICAgIFwidGFidWxhcl9jb2x1bW5fd2lkdGhfc2V0dGluZ3NcIjogKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbl93aWR0aCktPlxuICAgICAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxuICAgICAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsIG93bmVyOiB1c2VySWR9KVxuICAgICAgICBpZiBzZXR0aW5nXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uY29sdW1uX3dpZHRoXCI6IGNvbHVtbl93aWR0aH19KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBkb2MgPSBcbiAgICAgICAgICAgICAgICB0eXBlOiBcInVzZXJcIlxuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuICAgICAgICAgICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge31cbiAgICAgICAgICAgICAgICBvd25lcjogdXNlcklkXG5cbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge31cbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aFxuXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpXG5cbiAgICBcImdyaWRfc2V0dGluZ3NcIjogKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbl93aWR0aCwgc29ydCktPlxuICAgICAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxuICAgICAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCIsIG93bmVyOiB1c2VySWR9KVxuICAgICAgICBpZiBzZXR0aW5nXG4gICAgICAgICAgICAjIOavj+asoemDveW8uuWItuaUueWPmF9pZF9hY3Rpb25z5YiX55qE5a695bqm77yM5Lul6Kej5Yaz5b2T55So5oi35Y+q5pS55Y+Y5a2X5q615qyh5bqP6ICM5rKh5pyJ5pS55Y+Y5Lu75L2V5a2X5q615a695bqm5pe277yM5YmN56uv5rKh5pyJ6K6i6ZiF5Yiw5a2X5q615qyh5bqP5Y+Y5pu055qE5pWw5o2u55qE6Zeu6aKYXG4gICAgICAgICAgICBjb2x1bW5fd2lkdGguX2lkX2FjdGlvbnMgPSBpZiBzZXR0aW5nLnNldHRpbmdzW1wiI3tsaXN0X3ZpZXdfaWR9XCJdPy5jb2x1bW5fd2lkdGg/Ll9pZF9hY3Rpb25zID09IDQ2IHRoZW4gNDcgZWxzZSA0NlxuICAgICAgICAgICAgaWYgc29ydFxuICAgICAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5zb3J0XCI6IHNvcnQsIFwic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LmNvbHVtbl93aWR0aFwiOiBjb2x1bW5fd2lkdGh9fSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uY29sdW1uX3dpZHRoXCI6IGNvbHVtbl93aWR0aH19KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBkb2MgPVxuICAgICAgICAgICAgICAgIHR5cGU6IFwidXNlclwiXG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIlxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7fVxuICAgICAgICAgICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fVxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydFxuXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpIiwiXG4vKlxuICAgIHR5cGU6IFwidXNlclwiXG4gICAgb2JqZWN0X25hbWU6IFwib2JqZWN0X2xpc3R2aWV3c1wiXG4gICAgcmVjb3JkX2lkOiBcIntvYmplY3RfbmFtZX0se2xpc3R2aWV3X2lkfVwiXG4gICAgc2V0dGluZ3M6XG4gICAgICAgIGNvbHVtbl93aWR0aDogeyBmaWVsZF9hOiAxMDAsIGZpZWxkXzI6IDE1MCB9XG4gICAgICAgIHNvcnQ6IFtbXCJmaWVsZF9hXCIsIFwiZGVzY1wiXV1cbiAgICBvd25lcjoge3VzZXJJZH1cbiAqL1xuTWV0ZW9yLm1ldGhvZHMoe1xuICBcInRhYnVsYXJfc29ydF9zZXR0aW5nc1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBzb3J0KSB7XG4gICAgdmFyIGRvYywgb2JqLCBzZXR0aW5nLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgb3duZXI6IHVzZXJJZFxuICAgIH0pO1xuICAgIGlmIChzZXR0aW5nKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IChcbiAgICAgICAgICBvYmogPSB7fSxcbiAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLnNvcnRcIl0gPSBzb3J0LFxuICAgICAgICAgIG9ialxuICAgICAgICApXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jID0ge1xuICAgICAgICB0eXBlOiBcInVzZXJcIixcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgICBzZXR0aW5nczoge30sXG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH07XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnQ7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH0sXG4gIFwidGFidWxhcl9jb2x1bW5fd2lkdGhfc2V0dGluZ3NcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoKSB7XG4gICAgdmFyIGRvYywgb2JqLCBzZXR0aW5nLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgb3duZXI6IHVzZXJJZFxuICAgIH0pO1xuICAgIGlmIChzZXR0aW5nKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IChcbiAgICAgICAgICBvYmogPSB7fSxcbiAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLmNvbHVtbl93aWR0aFwiXSA9IGNvbHVtbl93aWR0aCxcbiAgICAgICAgICBvYmpcbiAgICAgICAgKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYyA9IHtcbiAgICAgICAgdHlwZTogXCJ1c2VyXCIsXG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgICAgc2V0dGluZ3M6IHt9LFxuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aDtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpO1xuICAgIH1cbiAgfSxcbiAgXCJncmlkX3NldHRpbmdzXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbl93aWR0aCwgc29ydCkge1xuICAgIHZhciBkb2MsIG9iaiwgb2JqMSwgcmVmLCByZWYxLCBzZXR0aW5nLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiLFxuICAgICAgb3duZXI6IHVzZXJJZFxuICAgIH0pO1xuICAgIGlmIChzZXR0aW5nKSB7XG4gICAgICBjb2x1bW5fd2lkdGguX2lkX2FjdGlvbnMgPSAoKHJlZiA9IHNldHRpbmcuc2V0dGluZ3NbXCJcIiArIGxpc3Rfdmlld19pZF0pICE9IG51bGwgPyAocmVmMSA9IHJlZi5jb2x1bW5fd2lkdGgpICE9IG51bGwgPyByZWYxLl9pZF9hY3Rpb25zIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gNDYgPyA0NyA6IDQ2O1xuICAgICAgaWYgKHNvcnQpIHtcbiAgICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgICBvYmogPSB7fSxcbiAgICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuc29ydFwiXSA9IHNvcnQsXG4gICAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLmNvbHVtbl93aWR0aFwiXSA9IGNvbHVtbl93aWR0aCxcbiAgICAgICAgICAgIG9ialxuICAgICAgICAgIClcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IChcbiAgICAgICAgICAgIG9iajEgPSB7fSxcbiAgICAgICAgICAgIG9iajFbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLmNvbHVtbl93aWR0aFwiXSA9IGNvbHVtbl93aWR0aCxcbiAgICAgICAgICAgIG9iajFcbiAgICAgICAgICApXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2MgPSB7XG4gICAgICAgIHR5cGU6IFwidXNlclwiLFxuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCIsXG4gICAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge307XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5jb2x1bW5fd2lkdGggPSBjb2x1bW5fd2lkdGg7XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydDtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpO1xuICAgIH1cbiAgfVxufSk7XG4iLCJ4bWwyanMgPSByZXF1aXJlICd4bWwyanMnXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5ta2RpcnAgPSByZXF1aXJlICdta2RpcnAnXG5cbmxvZ2dlciA9IG5ldyBMb2dnZXIgJ0V4cG9ydF9UT19YTUwnXG5cbl93cml0ZVhtbEZpbGUgPSAoanNvbk9iaixvYmpOYW1lKSAtPlxuXHQjIOi9rHhtbFxuXHRidWlsZGVyID0gbmV3IHhtbDJqcy5CdWlsZGVyKClcblx0eG1sID0gYnVpbGRlci5idWlsZE9iamVjdCBqc29uT2JqXG5cblx0IyDovazkuLpidWZmZXJcblx0c3RyZWFtID0gbmV3IEJ1ZmZlciB4bWxcblxuXHQjIOagueaNruW9k+WkqeaXtumXtOeahOW5tOaciOaXpeS9nOS4uuWtmOWCqOi3r+W+hFxuXHRub3cgPSBuZXcgRGF0ZVxuXHR5ZWFyID0gbm93LmdldEZ1bGxZZWFyKClcblx0bW9udGggPSBub3cuZ2V0TW9udGgoKSArIDFcblx0ZGF5ID0gbm93LmdldERhdGUoKVxuXG5cdCMg5paH5Lu26Lev5b6EXG5cdGZpbGVQYXRoID0gcGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwnLi4vLi4vLi4vZXhwb3J0LycgKyB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBkYXkgKyAnLycgKyBvYmpOYW1lIClcblx0ZmlsZU5hbWUgPSBqc29uT2JqPy5faWQgKyBcIi54bWxcIlxuXHRmaWxlQWRkcmVzcyA9IHBhdGguam9pbiBmaWxlUGF0aCwgZmlsZU5hbWVcblxuXHRpZiAhZnMuZXhpc3RzU3luYyBmaWxlUGF0aFxuXHRcdG1rZGlycC5zeW5jIGZpbGVQYXRoXG5cblx0IyDlhpnlhaXmlofku7Zcblx0ZnMud3JpdGVGaWxlIGZpbGVBZGRyZXNzLCBzdHJlYW0sIChlcnIpIC0+XG5cdFx0aWYgZXJyXG5cdFx0XHRsb2dnZXIuZXJyb3IgXCIje2pzb25PYmouX2lkfeWGmeWFpXhtbOaWh+S7tuWksei0pVwiLGVyclxuXHRcblx0cmV0dXJuIGZpbGVQYXRoXG5cblxuIyDmlbTnkIZGaWVsZHPnmoRqc29u5pWw5o2uXG5fbWl4RmllbGRzRGF0YSA9IChvYmosb2JqTmFtZSkgLT5cblx0IyDliJ3lp4vljJblr7nosaHmlbDmja5cblx0anNvbk9iaiA9IHt9XG5cdCMg6I635Y+WZmllbGRzXG5cdG9iakZpZWxkcyA9IENyZWF0b3I/LmdldE9iamVjdChvYmpOYW1lKT8uZmllbGRzXG5cblx0bWl4RGVmYXVsdCA9IChmaWVsZF9uYW1lKS0+XG5cdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IG9ialtmaWVsZF9uYW1lXSB8fCBcIlwiXG5cblx0bWl4RGF0ZSA9IChmaWVsZF9uYW1lLHR5cGUpLT5cblx0XHRkYXRlID0gb2JqW2ZpZWxkX25hbWVdXG5cdFx0aWYgdHlwZSA9PSBcImRhdGVcIlxuXHRcdFx0Zm9ybWF0ID0gXCJZWVlZLU1NLUREXCJcblx0XHRlbHNlXG5cdFx0XHRmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW06c3NcIlxuXHRcdGlmIGRhdGU/IGFuZCBmb3JtYXQ/XG5cdFx0XHRkYXRlU3RyID0gbW9tZW50KGRhdGUpLmZvcm1hdChmb3JtYXQpXG5cdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IGRhdGVTdHIgfHwgXCJcIlxuXG5cdG1peEJvb2wgPSAoZmllbGRfbmFtZSktPlxuXHRcdGlmIG9ialtmaWVsZF9uYW1lXSA9PSB0cnVlXG5cdFx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLmmK9cIlxuXHRcdGVsc2UgaWYgb2JqW2ZpZWxkX25hbWVdID09IGZhbHNlXG5cdFx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLlkKZcIlxuXHRcdGVsc2Vcblx0XHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIlwiXG5cblx0IyDlvqrnjq/mr4/kuKpmaWVsZHMs5bm25Yik5pat5Y+W5YC8XG5cdF8uZWFjaCBvYmpGaWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdHN3aXRjaCBmaWVsZD8udHlwZVxuXHRcdFx0d2hlbiBcImRhdGVcIixcImRhdGV0aW1lXCIgdGhlbiBtaXhEYXRlIGZpZWxkX25hbWUsZmllbGQudHlwZVxuXHRcdFx0d2hlbiBcImJvb2xlYW5cIiB0aGVuIG1peEJvb2wgZmllbGRfbmFtZVxuXHRcdFx0ZWxzZSBtaXhEZWZhdWx0IGZpZWxkX25hbWVcblxuXHRyZXR1cm4ganNvbk9ialxuXG4jIOiOt+WPluWtkOihqOaVtOeQhuaVsOaNrlxuX21peFJlbGF0ZWREYXRhID0gKG9iaixvYmpOYW1lKSAtPlxuXHQjIOWIneWni+WMluWvueixoeaVsOaNrlxuXHRyZWxhdGVkX29iamVjdHMgPSB7fVxuXG5cdCMg6I635Y+W55u45YWz6KGoXG5cdHJlbGF0ZWRPYmpOYW1lcyA9IENyZWF0b3I/LmdldEFsbFJlbGF0ZWRPYmplY3RzIG9iak5hbWVcblxuXHQjIOW+queOr+ebuOWFs+ihqFxuXHRyZWxhdGVkT2JqTmFtZXMuZm9yRWFjaCAocmVsYXRlZE9iak5hbWUpIC0+XG5cdFx0IyDmr4/kuKrooajlrprkuYnkuIDkuKrlr7nosaHmlbDnu4Rcblx0XHRyZWxhdGVkVGFibGVEYXRhID0gW11cblxuXHRcdCMgKuiuvue9ruWFs+iBlOaQnOe0ouafpeivoueahOWtl+autVxuXHRcdCMg6ZmE5Lu255qE5YWz6IGU5pCc57Si5a2X5q615piv5a6a5q2755qEXG5cdFx0aWYgcmVsYXRlZE9iak5hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gXCJwYXJlbnQuaWRzXCJcblx0XHRlbHNlXG5cdFx0XHQjIOiOt+WPlmZpZWxkc1xuXHRcdFx0ZmllbGRzID0gQ3JlYXRvcj8uT2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0/LmZpZWxkc1xuXHRcdFx0IyDlvqrnjq/mr4/kuKpmaWVsZCzmib7lh7pyZWZlcmVuY2VfdG/nmoTlhbPogZTlrZfmrrVcblx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwiXCJcblx0XHRcdF8uZWFjaCBmaWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdFx0XHRpZiBmaWVsZD8ucmVmZXJlbmNlX3RvID09IG9iak5hbWVcblx0XHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSBmaWVsZF9uYW1lXG5cblx0XHQjIOagueaNruaJvuWHuueahOWFs+iBlOWtl+aute+8jOafpeWtkOihqOaVsOaNrlxuXHRcdGlmIHJlbGF0ZWRfZmllbGRfbmFtZVxuXHRcdFx0cmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iak5hbWUpXG5cdFx0XHQjIOiOt+WPluWIsOaJgOacieeahOaVsOaNrlxuXHRcdFx0cmVsYXRlZFJlY29yZExpc3QgPSByZWxhdGVkQ29sbGVjdGlvbi5maW5kKHtcIiN7cmVsYXRlZF9maWVsZF9uYW1lfVwiOm9iai5faWR9KS5mZXRjaCgpXG5cdFx0XHQjIOW+queOr+avj+S4gOadoeaVsOaNrlxuXHRcdFx0cmVsYXRlZFJlY29yZExpc3QuZm9yRWFjaCAocmVsYXRlZE9iaiktPlxuXHRcdFx0XHQjIOaVtOWQiGZpZWxkc+aVsOaNrlxuXHRcdFx0XHRmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEgcmVsYXRlZE9iaixyZWxhdGVkT2JqTmFtZVxuXHRcdFx0XHQjIOaKiuS4gOadoeiusOW9leaPkuWFpeWIsOWvueixoeaVsOe7hOS4rVxuXHRcdFx0XHRyZWxhdGVkVGFibGVEYXRhLnB1c2ggZmllbGRzRGF0YVxuXG5cdFx0IyDmiorkuIDkuKrlrZDooajnmoTmiYDmnInmlbDmja7mj5LlhaXliLByZWxhdGVkX29iamVjdHPkuK3vvIzlho3lvqrnjq/kuIvkuIDkuKpcblx0XHRyZWxhdGVkX29iamVjdHNbcmVsYXRlZE9iak5hbWVdID0gcmVsYXRlZFRhYmxlRGF0YVxuXG5cdHJldHVybiByZWxhdGVkX29iamVjdHNcblxuIyBDcmVhdG9yLkV4cG9ydDJ4bWwoKVxuQ3JlYXRvci5FeHBvcnQyeG1sID0gKG9iak5hbWUsIHJlY29yZExpc3QpIC0+XG5cdGxvZ2dlci5pbmZvIFwiUnVuIENyZWF0b3IuRXhwb3J0MnhtbFwiXG5cblx0Y29uc29sZS50aW1lIFwiQ3JlYXRvci5FeHBvcnQyeG1sXCJcblxuXHQjIOa1i+ivleaVsOaNrlxuXHQjIG9iak5hbWUgPSBcImFyY2hpdmVfcmVjb3Jkc1wiXG5cblx0IyDmn6Xmib7lr7nosaHmlbDmja5cblx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKVxuXHQjIOa1i+ivleaVsOaNrlxuXHRyZWNvcmRMaXN0ID0gY29sbGVjdGlvbi5maW5kKHt9KS5mZXRjaCgpXG5cblx0cmVjb3JkTGlzdC5mb3JFYWNoIChyZWNvcmRPYmopLT5cblx0XHRqc29uT2JqID0ge31cblx0XHRqc29uT2JqLl9pZCA9IHJlY29yZE9iai5faWRcblxuXHRcdCMg5pW055CG5Li76KGo55qERmllbGRz5pWw5o2uXG5cdFx0ZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhIHJlY29yZE9iaixvYmpOYW1lXG5cdFx0anNvbk9ialtvYmpOYW1lXSA9IGZpZWxkc0RhdGFcblxuXHRcdCMg5pW055CG55u45YWz6KGo5pWw5o2uXG5cdFx0cmVsYXRlZF9vYmplY3RzID0gX21peFJlbGF0ZWREYXRhIHJlY29yZE9iaixvYmpOYW1lXG5cblx0XHRqc29uT2JqW1wicmVsYXRlZF9vYmplY3RzXCJdID0gcmVsYXRlZF9vYmplY3RzXG5cblx0XHQjIOi9rOS4unhtbOS/neWtmOaWh+S7tlxuXHRcdGZpbGVQYXRoID0gX3dyaXRlWG1sRmlsZSBqc29uT2JqLG9iak5hbWVcblxuXHRjb25zb2xlLnRpbWVFbmQgXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIlxuXHRyZXR1cm4gZmlsZVBhdGgiLCJ2YXIgX21peEZpZWxkc0RhdGEsIF9taXhSZWxhdGVkRGF0YSwgX3dyaXRlWG1sRmlsZSwgZnMsIGxvZ2dlciwgbWtkaXJwLCBwYXRoLCB4bWwyanM7XG5cbnhtbDJqcyA9IHJlcXVpcmUoJ3htbDJqcycpO1xuXG5mcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cbnBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbm1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpO1xuXG5sb2dnZXIgPSBuZXcgTG9nZ2VyKCdFeHBvcnRfVE9fWE1MJyk7XG5cbl93cml0ZVhtbEZpbGUgPSBmdW5jdGlvbihqc29uT2JqLCBvYmpOYW1lKSB7XG4gIHZhciBidWlsZGVyLCBkYXksIGZpbGVBZGRyZXNzLCBmaWxlTmFtZSwgZmlsZVBhdGgsIG1vbnRoLCBub3csIHN0cmVhbSwgeG1sLCB5ZWFyO1xuICBidWlsZGVyID0gbmV3IHhtbDJqcy5CdWlsZGVyKCk7XG4gIHhtbCA9IGJ1aWxkZXIuYnVpbGRPYmplY3QoanNvbk9iaik7XG4gIHN0cmVhbSA9IG5ldyBCdWZmZXIoeG1sKTtcbiAgbm93ID0gbmV3IERhdGU7XG4gIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgbW9udGggPSBub3cuZ2V0TW9udGgoKSArIDE7XG4gIGRheSA9IG5vdy5nZXREYXRlKCk7XG4gIGZpbGVQYXRoID0gcGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwgJy4uLy4uLy4uL2V4cG9ydC8nICsgeWVhciArICcvJyArIG1vbnRoICsgJy8nICsgZGF5ICsgJy8nICsgb2JqTmFtZSk7XG4gIGZpbGVOYW1lID0gKGpzb25PYmogIT0gbnVsbCA/IGpzb25PYmouX2lkIDogdm9pZCAwKSArIFwiLnhtbFwiO1xuICBmaWxlQWRkcmVzcyA9IHBhdGguam9pbihmaWxlUGF0aCwgZmlsZU5hbWUpO1xuICBpZiAoIWZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XG4gICAgbWtkaXJwLnN5bmMoZmlsZVBhdGgpO1xuICB9XG4gIGZzLndyaXRlRmlsZShmaWxlQWRkcmVzcywgc3RyZWFtLCBmdW5jdGlvbihlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICByZXR1cm4gbG9nZ2VyLmVycm9yKGpzb25PYmouX2lkICsgXCLlhpnlhaV4bWzmlofku7blpLHotKVcIiwgZXJyKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmlsZVBhdGg7XG59O1xuXG5fbWl4RmllbGRzRGF0YSA9IGZ1bmN0aW9uKG9iaiwgb2JqTmFtZSkge1xuICB2YXIganNvbk9iaiwgbWl4Qm9vbCwgbWl4RGF0ZSwgbWl4RGVmYXVsdCwgb2JqRmllbGRzLCByZWY7XG4gIGpzb25PYmogPSB7fTtcbiAgb2JqRmllbGRzID0gdHlwZW9mIENyZWF0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgQ3JlYXRvciAhPT0gbnVsbCA/IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmpOYW1lKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIG1peERlZmF1bHQgPSBmdW5jdGlvbihmaWVsZF9uYW1lKSB7XG4gICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBvYmpbZmllbGRfbmFtZV0gfHwgXCJcIjtcbiAgfTtcbiAgbWl4RGF0ZSA9IGZ1bmN0aW9uKGZpZWxkX25hbWUsIHR5cGUpIHtcbiAgICB2YXIgZGF0ZSwgZGF0ZVN0ciwgZm9ybWF0O1xuICAgIGRhdGUgPSBvYmpbZmllbGRfbmFtZV07XG4gICAgaWYgKHR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICBmb3JtYXQgPSBcIllZWVktTU0tRERcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9ybWF0ID0gXCJZWVlZLU1NLUREIEhIOm1tOnNzXCI7XG4gICAgfVxuICAgIGlmICgoZGF0ZSAhPSBudWxsKSAmJiAoZm9ybWF0ICE9IG51bGwpKSB7XG4gICAgICBkYXRlU3RyID0gbW9tZW50KGRhdGUpLmZvcm1hdChmb3JtYXQpO1xuICAgIH1cbiAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IGRhdGVTdHIgfHwgXCJcIjtcbiAgfTtcbiAgbWl4Qm9vbCA9IGZ1bmN0aW9uKGZpZWxkX25hbWUpIHtcbiAgICBpZiAob2JqW2ZpZWxkX25hbWVdID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5pivXCI7XG4gICAgfSBlbHNlIGlmIChvYmpbZmllbGRfbmFtZV0gPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5ZCmXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gXCJcIjtcbiAgICB9XG4gIH07XG4gIF8uZWFjaChvYmpGaWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgc3dpdGNoIChmaWVsZCAhPSBudWxsID8gZmllbGQudHlwZSA6IHZvaWQgMCkge1xuICAgICAgY2FzZSBcImRhdGVcIjpcbiAgICAgIGNhc2UgXCJkYXRldGltZVwiOlxuICAgICAgICByZXR1cm4gbWl4RGF0ZShmaWVsZF9uYW1lLCBmaWVsZC50eXBlKTtcbiAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgIHJldHVybiBtaXhCb29sKGZpZWxkX25hbWUpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG1peERlZmF1bHQoZmllbGRfbmFtZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGpzb25PYmo7XG59O1xuXG5fbWl4UmVsYXRlZERhdGEgPSBmdW5jdGlvbihvYmosIG9iak5hbWUpIHtcbiAgdmFyIHJlbGF0ZWRPYmpOYW1lcywgcmVsYXRlZF9vYmplY3RzO1xuICByZWxhdGVkX29iamVjdHMgPSB7fTtcbiAgcmVsYXRlZE9iak5hbWVzID0gdHlwZW9mIENyZWF0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgQ3JlYXRvciAhPT0gbnVsbCA/IENyZWF0b3IuZ2V0QWxsUmVsYXRlZE9iamVjdHMob2JqTmFtZSkgOiB2b2lkIDA7XG4gIHJlbGF0ZWRPYmpOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKHJlbGF0ZWRPYmpOYW1lKSB7XG4gICAgdmFyIGZpZWxkcywgb2JqMSwgcmVmLCByZWxhdGVkQ29sbGVjdGlvbiwgcmVsYXRlZFJlY29yZExpc3QsIHJlbGF0ZWRUYWJsZURhdGEsIHJlbGF0ZWRfZmllbGRfbmFtZTtcbiAgICByZWxhdGVkVGFibGVEYXRhID0gW107XG4gICAgaWYgKHJlbGF0ZWRPYmpOYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSBcInBhcmVudC5pZHNcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZmllbGRzID0gdHlwZW9mIENyZWF0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgQ3JlYXRvciAhPT0gbnVsbCA/IChyZWYgPSBDcmVhdG9yLk9iamVjdHNbcmVsYXRlZE9iak5hbWVdKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwiXCI7XG4gICAgICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgICAgICBpZiAoKGZpZWxkICE9IG51bGwgPyBmaWVsZC5yZWZlcmVuY2VfdG8gOiB2b2lkIDApID09PSBvYmpOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfZmllbGRfbmFtZSA9IGZpZWxkX25hbWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAocmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICByZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqTmFtZSk7XG4gICAgICByZWxhdGVkUmVjb3JkTGlzdCA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoKFxuICAgICAgICBvYmoxID0ge30sXG4gICAgICAgIG9iajFbXCJcIiArIHJlbGF0ZWRfZmllbGRfbmFtZV0gPSBvYmouX2lkLFxuICAgICAgICBvYmoxXG4gICAgICApKS5mZXRjaCgpO1xuICAgICAgcmVsYXRlZFJlY29yZExpc3QuZm9yRWFjaChmdW5jdGlvbihyZWxhdGVkT2JqKSB7XG4gICAgICAgIHZhciBmaWVsZHNEYXRhO1xuICAgICAgICBmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEocmVsYXRlZE9iaiwgcmVsYXRlZE9iak5hbWUpO1xuICAgICAgICByZXR1cm4gcmVsYXRlZFRhYmxlRGF0YS5wdXNoKGZpZWxkc0RhdGEpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZWxhdGVkX29iamVjdHNbcmVsYXRlZE9iak5hbWVdID0gcmVsYXRlZFRhYmxlRGF0YTtcbiAgfSk7XG4gIHJldHVybiByZWxhdGVkX29iamVjdHM7XG59O1xuXG5DcmVhdG9yLkV4cG9ydDJ4bWwgPSBmdW5jdGlvbihvYmpOYW1lLCByZWNvcmRMaXN0KSB7XG4gIHZhciBjb2xsZWN0aW9uO1xuICBsb2dnZXIuaW5mbyhcIlJ1biBDcmVhdG9yLkV4cG9ydDJ4bWxcIik7XG4gIGNvbnNvbGUudGltZShcIkNyZWF0b3IuRXhwb3J0MnhtbFwiKTtcbiAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKTtcbiAgcmVjb3JkTGlzdCA9IGNvbGxlY3Rpb24uZmluZCh7fSkuZmV0Y2goKTtcbiAgcmVjb3JkTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHJlY29yZE9iaikge1xuICAgIHZhciBmaWVsZHNEYXRhLCBmaWxlUGF0aCwganNvbk9iaiwgcmVsYXRlZF9vYmplY3RzO1xuICAgIGpzb25PYmogPSB7fTtcbiAgICBqc29uT2JqLl9pZCA9IHJlY29yZE9iai5faWQ7XG4gICAgZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhKHJlY29yZE9iaiwgb2JqTmFtZSk7XG4gICAganNvbk9ialtvYmpOYW1lXSA9IGZpZWxkc0RhdGE7XG4gICAgcmVsYXRlZF9vYmplY3RzID0gX21peFJlbGF0ZWREYXRhKHJlY29yZE9iaiwgb2JqTmFtZSk7XG4gICAganNvbk9ialtcInJlbGF0ZWRfb2JqZWN0c1wiXSA9IHJlbGF0ZWRfb2JqZWN0cztcbiAgICByZXR1cm4gZmlsZVBhdGggPSBfd3JpdGVYbWxGaWxlKGpzb25PYmosIG9iak5hbWUpO1xuICB9KTtcbiAgY29uc29sZS50aW1lRW5kKFwiQ3JlYXRvci5FeHBvcnQyeG1sXCIpO1xuICByZXR1cm4gZmlsZVBhdGg7XG59O1xuIiwiTWV0ZW9yLm1ldGhvZHMgXG5cdHJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzOiAob2JqZWN0X25hbWUsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZUlkKS0+XG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcblx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIlxuXHRcdFx0c2VsZWN0b3IgPSB7XCJtZXRhZGF0YS5zcGFjZVwiOiBzcGFjZUlkfVxuXHRcdGVsc2Vcblx0XHRcdHNlbGVjdG9yID0ge3NwYWNlOiBzcGFjZUlkfVxuXHRcdFxuXHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0IyDpmYTku7bnmoTlhbPogZTmkJzntKLmnaHku7bmmK/lrprmrbvnmoRcblx0XHRcdHNlbGVjdG9yW1wicGFyZW50Lm9cIl0gPSBvYmplY3RfbmFtZVxuXHRcdFx0c2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF1cblx0XHRlbHNlXG5cdFx0XHRzZWxlY3RvcltyZWxhdGVkX2ZpZWxkX25hbWVdID0gcmVjb3JkX2lkXG5cblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRcdGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMuYWxsb3dSZWFkXG5cdFx0XHRzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxuXHRcdFxuXHRcdHJlbGF0ZWRfcmVjb3JkcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKVxuXHRcdHJldHVybiByZWxhdGVkX3JlY29yZHMuY291bnQoKSIsIk1ldGVvci5tZXRob2RzKHtcbiAgcmVsYXRlZF9vYmplY3RzX3JlY29yZHM6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCkge1xuICAgIHZhciBwZXJtaXNzaW9ucywgcmVsYXRlZF9yZWNvcmRzLCBzZWxlY3RvciwgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICBcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWRcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIHNlbGVjdG9yW1wicGFyZW50Lm9cIl0gPSBvYmplY3RfbmFtZTtcbiAgICAgIHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3RvcltyZWxhdGVkX2ZpZWxkX25hbWVdID0gcmVjb3JkX2lkO1xuICAgIH1cbiAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgICBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLmFsbG93UmVhZCkge1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgfVxuICAgIHJlbGF0ZWRfcmVjb3JkcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVsYXRlZF9yZWNvcmRzLmNvdW50KCk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0Z2V0UGVuZGluZ1NwYWNlSW5mbzogKGludml0ZXJJZCwgc3BhY2VJZCktPlxuXHRcdGludml0ZXJOYW1lID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBpbnZpdGVySWR9KS5uYW1lXG5cdFx0c3BhY2VOYW1lID0gZGIuc3BhY2VzLmZpbmRPbmUoe19pZDogc3BhY2VJZH0pLm5hbWVcblxuXHRcdHJldHVybiB7aW52aXRlcjogaW52aXRlck5hbWUsIHNwYWNlOiBzcGFjZU5hbWV9XG5cblx0cmVmdXNlSm9pblNwYWNlOiAoX2lkKS0+XG5cdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBfaWR9LHskc2V0OiB7aW52aXRlX3N0YXRlOiBcInJlZnVzZWRcIn19KVxuXG5cdGFjY2VwdEpvaW5TcGFjZTogKF9pZCktPlxuXHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogX2lkfSx7JHNldDoge2ludml0ZV9zdGF0ZTogXCJhY2NlcHRlZFwiLCB1c2VyX2FjY2VwdGVkOiB0cnVlfX0pXG5cbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgZ2V0UGVuZGluZ1NwYWNlSW5mbzogZnVuY3Rpb24oaW52aXRlcklkLCBzcGFjZUlkKSB7XG4gICAgdmFyIGludml0ZXJOYW1lLCBzcGFjZU5hbWU7XG4gICAgaW52aXRlck5hbWUgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogaW52aXRlcklkXG4gICAgfSkubmFtZTtcbiAgICBzcGFjZU5hbWUgPSBkYi5zcGFjZXMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHNwYWNlSWRcbiAgICB9KS5uYW1lO1xuICAgIHJldHVybiB7XG4gICAgICBpbnZpdGVyOiBpbnZpdGVyTmFtZSxcbiAgICAgIHNwYWNlOiBzcGFjZU5hbWVcbiAgICB9O1xuICB9LFxuICByZWZ1c2VKb2luU3BhY2U6IGZ1bmN0aW9uKF9pZCkge1xuICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBpbnZpdGVfc3RhdGU6IFwicmVmdXNlZFwiXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIGFjY2VwdEpvaW5TcGFjZTogZnVuY3Rpb24oX2lkKSB7XG4gICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGludml0ZV9zdGF0ZTogXCJhY2NlcHRlZFwiLFxuICAgICAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggXCJjcmVhdG9yX29iamVjdF9yZWNvcmRcIiwgKG9iamVjdF9uYW1lLCBpZCwgc3BhY2VfaWQpLT5cblx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpXG5cdGlmIGNvbGxlY3Rpb25cblx0XHRyZXR1cm4gY29sbGVjdGlvbi5maW5kKHtfaWQ6IGlkfSlcblxuIiwiTWV0ZW9yLnB1Ymxpc2goXCJjcmVhdG9yX29iamVjdF9yZWNvcmRcIiwgZnVuY3Rpb24ob2JqZWN0X25hbWUsIGlkLCBzcGFjZV9pZCkge1xuICB2YXIgY29sbGVjdGlvbjtcbiAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpO1xuICBpZiAoY29sbGVjdGlvbikge1xuICAgIHJldHVybiBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgX2lkOiBpZFxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoQ29tcG9zaXRlIFwic3RlZWRvc19vYmplY3RfdGFidWxhclwiLCAodGFibGVOYW1lLCBpZHMsIGZpZWxkcywgc3BhY2VJZCktPlxuXHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0Y2hlY2sodGFibGVOYW1lLCBTdHJpbmcpO1xuXHRjaGVjayhpZHMsIEFycmF5KTtcblx0Y2hlY2soZmllbGRzLCBNYXRjaC5PcHRpb25hbChPYmplY3QpKTtcblxuXHRfb2JqZWN0X25hbWUgPSB0YWJsZU5hbWUucmVwbGFjZShcImNyZWF0b3JfXCIsXCJcIilcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9vYmplY3RfbmFtZSwgc3BhY2VJZClcblxuXHRpZiBzcGFjZUlkXG5cdFx0X29iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRPYmplY3ROYW1lKF9vYmplY3QpXG5cblx0b2JqZWN0X2NvbGxlY2l0b24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oX29iamVjdF9uYW1lKVxuXG5cblx0X2ZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xuXHRpZiAhX2ZpZWxkcyB8fCAhb2JqZWN0X2NvbGxlY2l0b25cblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0cmVmZXJlbmNlX2ZpZWxkcyA9IF8uZmlsdGVyIF9maWVsZHMsIChmKS0+XG5cdFx0cmV0dXJuIF8uaXNGdW5jdGlvbihmLnJlZmVyZW5jZV90bykgfHwgIV8uaXNFbXB0eShmLnJlZmVyZW5jZV90bylcblxuXHRzZWxmID0gdGhpc1xuXG5cdHNlbGYudW5ibG9jaygpO1xuXG5cdGlmIHJlZmVyZW5jZV9maWVsZHMubGVuZ3RoID4gMFxuXHRcdGRhdGEgPSB7XG5cdFx0XHRmaW5kOiAoKS0+XG5cdFx0XHRcdHNlbGYudW5ibG9jaygpO1xuXHRcdFx0XHRmaWVsZF9rZXlzID0ge31cblx0XHRcdFx0Xy5lYWNoIF8ua2V5cyhmaWVsZHMpLCAoZiktPlxuXHRcdFx0XHRcdHVubGVzcyAvXFx3KyhcXC5cXCQpezF9XFx3Py8udGVzdChmKVxuXHRcdFx0XHRcdFx0ZmllbGRfa2V5c1tmXSA9IDFcblx0XHRcdFx0XG5cdFx0XHRcdHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtfaWQ6IHskaW46IGlkc319LCB7ZmllbGRzOiBmaWVsZF9rZXlzfSk7XG5cdFx0fVxuXG5cdFx0ZGF0YS5jaGlsZHJlbiA9IFtdXG5cblx0XHRrZXlzID0gXy5rZXlzKGZpZWxkcylcblxuXHRcdGlmIGtleXMubGVuZ3RoIDwgMVxuXHRcdFx0a2V5cyA9IF8ua2V5cyhfZmllbGRzKVxuXG5cdFx0X2tleXMgPSBbXVxuXG5cdFx0a2V5cy5mb3JFYWNoIChrZXkpLT5cblx0XHRcdGlmIF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ11cblx0XHRcdFx0X2tleXMgPSBfa2V5cy5jb25jYXQoXy5tYXAoX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXSwgKGspLT5cblx0XHRcdFx0XHRyZXR1cm4ga2V5ICsgJy4nICsga1xuXHRcdFx0XHQpKVxuXHRcdFx0X2tleXMucHVzaChrZXkpXG5cblx0XHRfa2V5cy5mb3JFYWNoIChrZXkpLT5cblx0XHRcdHJlZmVyZW5jZV9maWVsZCA9IF9maWVsZHNba2V5XVxuXG5cdFx0XHRpZiByZWZlcmVuY2VfZmllbGQgJiYgKF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pKSAgIyBhbmQgQ3JlYXRvci5Db2xsZWN0aW9uc1tyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvXVxuXHRcdFx0XHRkYXRhLmNoaWxkcmVuLnB1c2gge1xuXHRcdFx0XHRcdGZpbmQ6IChwYXJlbnQpIC0+XG5cdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0c2VsZi51bmJsb2NrKCk7XG5cblx0XHRcdFx0XHRcdFx0cXVlcnkgPSB7fVxuXG5cdFx0XHRcdFx0XHRcdCMg6KGo5qC85a2Q5a2X5q6154m55q6K5aSE55CGXG5cdFx0XHRcdFx0XHRcdGlmIC9cXHcrKFxcLlxcJFxcLil7MX1cXHcrLy50ZXN0KGtleSlcblx0XHRcdFx0XHRcdFx0XHRwX2sgPSBrZXkucmVwbGFjZSgvKFxcdyspXFwuXFwkXFwuXFx3Ky9pZywgXCIkMVwiKVxuXHRcdFx0XHRcdFx0XHRcdHNfayA9IGtleS5yZXBsYWNlKC9cXHcrXFwuXFwkXFwuKFxcdyspL2lnLCBcIiQxXCIpXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX2lkcyA9IHBhcmVudFtwX2tdLmdldFByb3BlcnR5KHNfaylcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV9pZHMgPSBrZXkuc3BsaXQoJy4nKS5yZWR1Y2UgKG8sIHgpIC0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG8/W3hdXG5cdFx0XHRcdFx0XHRcdFx0LCBwYXJlbnRcblxuXHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRcdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8oKVxuXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShyZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdFx0aWYgXy5pc09iamVjdChyZWZlcmVuY2VfaWRzKSAmJiAhXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpXG5cdFx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfaWRzLm9cblx0XHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV9pZHMgPSByZWZlcmVuY2VfaWRzLmlkcyB8fCBbXVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBbXVxuXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShyZWZlcmVuY2VfaWRzKVxuXHRcdFx0XHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHskaW46IHJlZmVyZW5jZV9pZHN9XG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRxdWVyeS5faWQgPSByZWZlcmVuY2VfaWRzXG5cblx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlZmVyZW5jZV90bywgc3BhY2VJZClcblxuXHRcdFx0XHRcdFx0XHRuYW1lX2ZpZWxkX2tleSA9IHJlZmVyZW5jZV90b19vYmplY3QuTkFNRV9GSUVMRF9LRVlcblxuXHRcdFx0XHRcdFx0XHRjaGlsZHJlbl9maWVsZHMgPSB7X2lkOiAxLCBzcGFjZTogMX1cblxuXHRcdFx0XHRcdFx0XHRpZiBuYW1lX2ZpZWxkX2tleVxuXHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuX2ZpZWxkc1tuYW1lX2ZpZWxkX2tleV0gPSAxXG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8sIHNwYWNlSWQpLmZpbmQocXVlcnksIHtcblx0XHRcdFx0XHRcdFx0XHRmaWVsZHM6IGNoaWxkcmVuX2ZpZWxkc1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGNhdGNoIGVcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2cocmVmZXJlbmNlX3RvLCBwYXJlbnQsIGUpXG5cdFx0XHRcdFx0XHRcdHJldHVybiBbXVxuXHRcdFx0XHR9XG5cblx0XHRyZXR1cm4gZGF0YVxuXHRlbHNlXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZpbmQ6ICgpLT5cblx0XHRcdFx0c2VsZi51bmJsb2NrKCk7XG5cdFx0XHRcdHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtfaWQ6IHskaW46IGlkc319LCB7ZmllbGRzOiBmaWVsZHN9KVxuXHRcdH07XG5cbiIsIk1ldGVvci5wdWJsaXNoQ29tcG9zaXRlKFwic3RlZWRvc19vYmplY3RfdGFidWxhclwiLCBmdW5jdGlvbih0YWJsZU5hbWUsIGlkcywgZmllbGRzLCBzcGFjZUlkKSB7XG4gIHZhciBfZmllbGRzLCBfa2V5cywgX29iamVjdCwgX29iamVjdF9uYW1lLCBkYXRhLCBrZXlzLCBvYmplY3RfY29sbGVjaXRvbiwgcmVmZXJlbmNlX2ZpZWxkcywgc2VsZjtcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgY2hlY2sodGFibGVOYW1lLCBTdHJpbmcpO1xuICBjaGVjayhpZHMsIEFycmF5KTtcbiAgY2hlY2soZmllbGRzLCBNYXRjaC5PcHRpb25hbChPYmplY3QpKTtcbiAgX29iamVjdF9uYW1lID0gdGFibGVOYW1lLnJlcGxhY2UoXCJjcmVhdG9yX1wiLCBcIlwiKTtcbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9vYmplY3RfbmFtZSwgc3BhY2VJZCk7XG4gIGlmIChzcGFjZUlkKSB7XG4gICAgX29iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRPYmplY3ROYW1lKF9vYmplY3QpO1xuICB9XG4gIG9iamVjdF9jb2xsZWNpdG9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKF9vYmplY3RfbmFtZSk7XG4gIF9maWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgaWYgKCFfZmllbGRzIHx8ICFvYmplY3RfY29sbGVjaXRvbikge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmVmZXJlbmNlX2ZpZWxkcyA9IF8uZmlsdGVyKF9maWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKGYucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KGYucmVmZXJlbmNlX3RvKTtcbiAgfSk7XG4gIHNlbGYgPSB0aGlzO1xuICBzZWxmLnVuYmxvY2soKTtcbiAgaWYgKHJlZmVyZW5jZV9maWVsZHMubGVuZ3RoID4gMCkge1xuICAgIGRhdGEgPSB7XG4gICAgICBmaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZpZWxkX2tleXM7XG4gICAgICAgIHNlbGYudW5ibG9jaygpO1xuICAgICAgICBmaWVsZF9rZXlzID0ge307XG4gICAgICAgIF8uZWFjaChfLmtleXMoZmllbGRzKSwgZnVuY3Rpb24oZikge1xuICAgICAgICAgIGlmICghL1xcdysoXFwuXFwkKXsxfVxcdz8vLnRlc3QoZikpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZF9rZXlzW2ZdID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb2JqZWN0X2NvbGxlY2l0b24uZmluZCh7XG4gICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAkaW46IGlkc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogZmllbGRfa2V5c1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGRhdGEuY2hpbGRyZW4gPSBbXTtcbiAgICBrZXlzID0gXy5rZXlzKGZpZWxkcyk7XG4gICAgaWYgKGtleXMubGVuZ3RoIDwgMSkge1xuICAgICAga2V5cyA9IF8ua2V5cyhfZmllbGRzKTtcbiAgICB9XG4gICAgX2tleXMgPSBbXTtcbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXSkge1xuICAgICAgICBfa2V5cyA9IF9rZXlzLmNvbmNhdChfLm1hcChfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddLCBmdW5jdGlvbihrKSB7XG4gICAgICAgICAgcmV0dXJuIGtleSArICcuJyArIGs7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfa2V5cy5wdXNoKGtleSk7XG4gICAgfSk7XG4gICAgX2tleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciByZWZlcmVuY2VfZmllbGQ7XG4gICAgICByZWZlcmVuY2VfZmllbGQgPSBfZmllbGRzW2tleV07XG4gICAgICBpZiAocmVmZXJlbmNlX2ZpZWxkICYmIChfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykgfHwgIV8uaXNFbXB0eShyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuY2hpbGRyZW4ucHVzaCh7XG4gICAgICAgICAgZmluZDogZnVuY3Rpb24ocGFyZW50KSB7XG4gICAgICAgICAgICB2YXIgY2hpbGRyZW5fZmllbGRzLCBlLCBuYW1lX2ZpZWxkX2tleSwgcF9rLCBxdWVyeSwgcmVmZXJlbmNlX2lkcywgcmVmZXJlbmNlX3RvLCByZWZlcmVuY2VfdG9fb2JqZWN0LCBzX2s7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBzZWxmLnVuYmxvY2soKTtcbiAgICAgICAgICAgICAgcXVlcnkgPSB7fTtcbiAgICAgICAgICAgICAgaWYgKC9cXHcrKFxcLlxcJFxcLil7MX1cXHcrLy50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICBwX2sgPSBrZXkucmVwbGFjZSgvKFxcdyspXFwuXFwkXFwuXFx3Ky9pZywgXCIkMVwiKTtcbiAgICAgICAgICAgICAgICBzX2sgPSBrZXkucmVwbGFjZSgvXFx3K1xcLlxcJFxcLihcXHcrKS9pZywgXCIkMVwiKTtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VfaWRzID0gcGFyZW50W3Bfa10uZ2V0UHJvcGVydHkoc19rKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VfaWRzID0ga2V5LnNwbGl0KCcuJykucmVkdWNlKGZ1bmN0aW9uKG8sIHgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBvICE9IG51bGwgPyBvW3hdIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgIH0sIHBhcmVudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKF8uaXNBcnJheShyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QocmVmZXJlbmNlX2lkcykgJiYgIV8uaXNBcnJheShyZWZlcmVuY2VfaWRzKSkge1xuICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX2lkcy5vO1xuICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlX2lkcyA9IHJlZmVyZW5jZV9pZHMuaWRzIHx8IFtdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChfLmlzQXJyYXkocmVmZXJlbmNlX2lkcykpIHtcbiAgICAgICAgICAgICAgICBxdWVyeS5faWQgPSB7XG4gICAgICAgICAgICAgICAgICAkaW46IHJlZmVyZW5jZV9pZHNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHF1ZXJ5Ll9pZCA9IHJlZmVyZW5jZV9pZHM7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlZmVyZW5jZV90bywgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIG5hbWVfZmllbGRfa2V5ID0gcmVmZXJlbmNlX3RvX29iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgICAgICAgICAgICAgY2hpbGRyZW5fZmllbGRzID0ge1xuICAgICAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgICAgICBzcGFjZTogMVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBpZiAobmFtZV9maWVsZF9rZXkpIHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbl9maWVsZHNbbmFtZV9maWVsZF9rZXldID0gMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZChxdWVyeSwge1xuICAgICAgICAgICAgICAgIGZpZWxkczogY2hpbGRyZW5fZmllbGRzXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZWZlcmVuY2VfdG8sIHBhcmVudCwgZSk7XG4gICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBmaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICAgIHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtcbiAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICRpbjogaWRzXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBmaWVsZHNcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufSk7XG4iLCJNZXRlb3IucHVibGlzaCBcIm9iamVjdF9saXN0dmlld3NcIiwgKG9iamVjdF9uYW1lLCBzcGFjZUlkKS0+XG4gICAgdXNlcklkID0gdGhpcy51c2VySWRcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNwYWNlOiBzcGFjZUlkICxcIiRvclwiOlt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XX0pIiwiTWV0ZW9yLnB1Ymxpc2ggXCJ1c2VyX3RhYnVsYXJfc2V0dGluZ3NcIiwgKG9iamVjdF9uYW1lKS0+XG4gICAgdXNlcklkID0gdGhpcy51c2VySWRcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kKHtvYmplY3RfbmFtZTogeyRpbjogb2JqZWN0X25hbWV9LCByZWNvcmRfaWQ6IHskaW46IFtcIm9iamVjdF9saXN0dmlld3NcIiwgXCJvYmplY3RfZ3JpZHZpZXdzXCJdfSwgb3duZXI6IHVzZXJJZH0pXG4iLCJNZXRlb3IucHVibGlzaCBcInJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzXCIsIChvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpLT5cblx0dXNlcklkID0gdGhpcy51c2VySWRcblx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJcblx0XHRzZWxlY3RvciA9IHtcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWR9XG5cdGVsc2Vcblx0XHRzZWxlY3RvciA9IHtzcGFjZTogc3BhY2VJZH1cblx0XG5cdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdCMg6ZmE5Lu255qE5YWz6IGU5pCc57Si5p2h5Lu25piv5a6a5q2755qEXG5cdFx0c2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lXG5cdFx0c2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF1cblx0ZWxzZVxuXHRcdHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWRcblxuXHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLmFsbG93UmVhZFxuXHRcdHNlbGVjdG9yLm93bmVyID0gdXNlcklkXG5cdFxuXHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpIiwiTWV0ZW9yLnB1Ymxpc2goXCJyZWxhdGVkX29iamVjdHNfcmVjb3Jkc1wiLCBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpIHtcbiAgdmFyIHBlcm1pc3Npb25zLCBzZWxlY3RvciwgdXNlcklkO1xuICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIikge1xuICAgIHNlbGVjdG9yID0ge1xuICAgICAgXCJtZXRhZGF0YS5zcGFjZVwiOiBzcGFjZUlkXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfTtcbiAgfVxuICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIikge1xuICAgIHNlbGVjdG9yW1wicGFyZW50Lm9cIl0gPSBvYmplY3RfbmFtZTtcbiAgICBzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXTtcbiAgfSBlbHNlIHtcbiAgICBzZWxlY3RvcltyZWxhdGVkX2ZpZWxkX25hbWVdID0gcmVjb3JkX2lkO1xuICB9XG4gIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLmFsbG93UmVhZCkge1xuICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICB9XG4gIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvcik7XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoICdzcGFjZV91c2VyX2luZm8nLCAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSkiLCJcbmlmIE1ldGVvci5pc1NlcnZlclxuXG5cdE1ldGVvci5wdWJsaXNoICdjb250YWN0c192aWV3X2xpbWl0cycsIChzcGFjZUlkKS0+XG5cblx0XHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRcdHVubGVzcyBzcGFjZUlkXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0XHRzZWxlY3RvciA9XG5cdFx0XHRzcGFjZTogc3BhY2VJZFxuXHRcdFx0a2V5OiAnY29udGFjdHNfdmlld19saW1pdHMnXG5cblx0XHRyZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3RvcikiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdjb250YWN0c192aWV3X2xpbWl0cycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAga2V5OiAnY29udGFjdHNfdmlld19saW1pdHMnXG4gICAgfTtcbiAgICByZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3Rvcik7XG4gIH0pO1xufVxuIiwiXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblxuXHRNZXRlb3IucHVibGlzaCAnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnLCAoc3BhY2VJZCktPlxuXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0XHR1bmxlc3Mgc3BhY2VJZFxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdFx0c2VsZWN0b3IgPVxuXHRcdFx0c3BhY2U6IHNwYWNlSWRcblx0XHRcdGtleTogJ2NvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzJ1xuXG5cdFx0cmV0dXJuIGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoc2VsZWN0b3IpIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIHNlbGVjdG9yO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIGtleTogJ2NvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzJ1xuICAgIH07XG4gICAgcmV0dXJuIGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoc2VsZWN0b3IpO1xuICB9KTtcbn1cbiIsImlmIE1ldGVvci5pc1NlcnZlclxuXHRNZXRlb3IucHVibGlzaCAnc3BhY2VfbmVlZF90b19jb25maXJtJywgKCktPlxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXG5cdFx0cmV0dXJuIGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHVzZXJJZCwgaW52aXRlX3N0YXRlOiBcInBlbmRpbmdcIn0pIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnc3BhY2VfbmVlZF90b19jb25maXJtJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBpbnZpdGVfc3RhdGU6IFwicGVuZGluZ1wiXG4gICAgfSk7XG4gIH0pO1xufVxuIiwicGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwgPSB7fVxuXG5wZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93UGVybWlzc2lvbnMgPSAoZmxvd19pZCwgdXNlcl9pZCkgLT5cblx0IyDmoLnmja46Zmxvd19pZOafpeWIsOWvueW6lOeahGZsb3dcblx0ZmxvdyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyhmbG93X2lkKVxuXHRzcGFjZV9pZCA9IGZsb3cuc3BhY2Vcblx0IyDmoLnmja5zcGFjZV9pZOWSjDp1c2VyX2lk5Yiwb3JnYW5pemF0aW9uc+ihqOS4reafpeWIsOeUqOaIt+aJgOWxnuaJgOacieeahG9yZ19pZO+8iOWMheaLrOS4iue6p+e7hElE77yJXG5cdG9yZ19pZHMgPSBuZXcgQXJyYXlcblx0b3JnYW5pemF0aW9ucyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG5cdFx0c3BhY2U6IHNwYWNlX2lkLCB1c2VyczogdXNlcl9pZCB9LCB7IGZpZWxkczogeyBwYXJlbnRzOiAxIH0gfSkuZmV0Y2goKVxuXHRfLmVhY2gob3JnYW5pemF0aW9ucywgKG9yZykgLT5cblx0XHRvcmdfaWRzLnB1c2gob3JnLl9pZClcblx0XHRpZiBvcmcucGFyZW50c1xuXHRcdFx0Xy5lYWNoKG9yZy5wYXJlbnRzLCAocGFyZW50X2lkKSAtPlxuXHRcdFx0XHRvcmdfaWRzLnB1c2gocGFyZW50X2lkKVxuXHRcdFx0KVxuXHQpXG5cdG9yZ19pZHMgPSBfLnVuaXEob3JnX2lkcylcblx0bXlfcGVybWlzc2lvbnMgPSBuZXcgQXJyYXlcblx0aWYgZmxvdy5wZXJtc1xuXHRcdCMg5Yik5patZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW7kuK3mmK/lkKbljIXlkKvlvZPliY3nlKjmiLfvvIxcblx0XHQjIOaIluiAhWZsb3cucGVybXMub3Jnc19jYW5fYWRk5piv5ZCm5YyF5ZCrNOatpeW+l+WIsOeahG9yZ19pZOaVsOe7hOS4reeahOS7u+S9leS4gOS4qu+8jFxuXHRcdCMg6Iul5piv77yM5YiZ5Zyo6L+U5Zue55qE5pWw57uE5Lit5Yqg5LiKYWRkXG5cdFx0aWYgZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRkXG5cdFx0XHR1c2Vyc19jYW5fYWRkID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRkXG5cdFx0XHRpZiB1c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJfaWQpXG5cdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJhZGRcIilcblxuXHRcdGlmIGZsb3cucGVybXMub3Jnc19jYW5fYWRkXG5cdFx0XHRvcmdzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZFxuXHRcdFx0Xy5lYWNoKG9yZ19pZHMsIChvcmdfaWQpIC0+XG5cdFx0XHRcdGlmIG9yZ3NfY2FuX2FkZC5pbmNsdWRlcyhvcmdfaWQpXG5cdFx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKVxuXHRcdFx0KVxuXHRcdCMg5Yik5patZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvcuS4reaYr+WQpuWMheWQq+W9k+WJjeeUqOaIt++8jFxuXHRcdCMg5oiW6ICFZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9y5piv5ZCm5YyF5ZCrNOatpeW+l+WIsOeahG9yZ19pZOaVsOe7hOS4reeahOS7u+S9leS4gOS4qu+8jFxuXHRcdCMg6Iul5piv77yM5YiZ5Zyo6L+U5Zue55qE5pWw57uE5Lit5Yqg5LiKbW9uaXRvclxuXHRcdGlmIGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3Jcblx0XHRcdHVzZXJzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvclxuXHRcdFx0aWYgdXNlcnNfY2FuX21vbml0b3IuaW5jbHVkZXModXNlcl9pZClcblx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIilcblxuXHRcdGlmIGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvclxuXHRcdFx0b3Jnc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvclxuXHRcdFx0Xy5lYWNoKG9yZ19pZHMsIChvcmdfaWQpIC0+XG5cdFx0XHRcdGlmIG9yZ3NfY2FuX21vbml0b3IuaW5jbHVkZXMob3JnX2lkKVxuXHRcdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJtb25pdG9yXCIpXG5cdFx0XHQpXG5cdFx0IyDliKTmlq1mbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbuS4reaYr+WQpuWMheWQq+W9k+WJjeeUqOaIt++8jFxuXHRcdCMg5oiW6ICFZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pbuaYr+WQpuWMheWQqzTmraXlvpfliLDnmoRvcmdfaWTmlbDnu4TkuK3nmoTku7vkvZXkuIDkuKrvvIxcblx0XHQjIOiLpeaYr++8jOWImeWcqOi/lOWbnueahOaVsOe7hOS4reWKoOS4imFkbWluXG5cdFx0aWYgZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW5cblx0XHRcdHVzZXJzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluXG5cdFx0XHRpZiB1c2Vyc19jYW5fYWRtaW4uaW5jbHVkZXModXNlcl9pZClcblx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkbWluXCIpXG5cblx0XHRpZiBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluXG5cdFx0XHRvcmdzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW5cblx0XHRcdF8uZWFjaChvcmdfaWRzLCAob3JnX2lkKSAtPlxuXHRcdFx0XHRpZiBvcmdzX2Nhbl9hZG1pbi5pbmNsdWRlcyhvcmdfaWQpXG5cdFx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkbWluXCIpXG5cdFx0XHQpXG5cblx0bXlfcGVybWlzc2lvbnMgPSBfLnVuaXEobXlfcGVybWlzc2lvbnMpXG5cdHJldHVybiBteV9wZXJtaXNzaW9ucyIsIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxucGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwgPSB7fTtcblxucGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rmxvd1Blcm1pc3Npb25zID0gZnVuY3Rpb24oZmxvd19pZCwgdXNlcl9pZCkge1xuICB2YXIgZmxvdywgbXlfcGVybWlzc2lvbnMsIG9yZ19pZHMsIG9yZ2FuaXphdGlvbnMsIG9yZ3NfY2FuX2FkZCwgb3Jnc19jYW5fYWRtaW4sIG9yZ3NfY2FuX21vbml0b3IsIHNwYWNlX2lkLCB1c2Vyc19jYW5fYWRkLCB1c2Vyc19jYW5fYWRtaW4sIHVzZXJzX2Nhbl9tb25pdG9yO1xuICBmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpO1xuICBzcGFjZV9pZCA9IGZsb3cuc3BhY2U7XG4gIG9yZ19pZHMgPSBuZXcgQXJyYXk7XG4gIG9yZ2FuaXphdGlvbnMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB1c2VyczogdXNlcl9pZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBwYXJlbnRzOiAxXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBfLmVhY2gob3JnYW5pemF0aW9ucywgZnVuY3Rpb24ob3JnKSB7XG4gICAgb3JnX2lkcy5wdXNoKG9yZy5faWQpO1xuICAgIGlmIChvcmcucGFyZW50cykge1xuICAgICAgcmV0dXJuIF8uZWFjaChvcmcucGFyZW50cywgZnVuY3Rpb24ocGFyZW50X2lkKSB7XG4gICAgICAgIHJldHVybiBvcmdfaWRzLnB1c2gocGFyZW50X2lkKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIG9yZ19pZHMgPSBfLnVuaXEob3JnX2lkcyk7XG4gIG15X3Blcm1pc3Npb25zID0gbmV3IEFycmF5O1xuICBpZiAoZmxvdy5wZXJtcykge1xuICAgIGlmIChmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGQpIHtcbiAgICAgIHVzZXJzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGQ7XG4gICAgICBpZiAodXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VyX2lkKSkge1xuICAgICAgICBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGQpIHtcbiAgICAgIG9yZ3NfY2FuX2FkZCA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRkO1xuICAgICAgXy5lYWNoKG9yZ19pZHMsIGZ1bmN0aW9uKG9yZ19pZCkge1xuICAgICAgICBpZiAob3Jnc19jYW5fYWRkLmluY2x1ZGVzKG9yZ19pZCkpIHtcbiAgICAgICAgICByZXR1cm4gbXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yKSB7XG4gICAgICB1c2Vyc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3I7XG4gICAgICBpZiAodXNlcnNfY2FuX21vbml0b3IuaW5jbHVkZXModXNlcl9pZCkpIHtcbiAgICAgICAgbXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3IpIHtcbiAgICAgIG9yZ3NfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3I7XG4gICAgICBfLmVhY2gob3JnX2lkcywgZnVuY3Rpb24ob3JnX2lkKSB7XG4gICAgICAgIGlmIChvcmdzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKG9yZ19pZCkpIHtcbiAgICAgICAgICByZXR1cm4gbXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW4pIHtcbiAgICAgIHVzZXJzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluO1xuICAgICAgaWYgKHVzZXJzX2Nhbl9hZG1pbi5pbmNsdWRlcyh1c2VyX2lkKSkge1xuICAgICAgICBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluKSB7XG4gICAgICBvcmdzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW47XG4gICAgICBfLmVhY2gob3JnX2lkcywgZnVuY3Rpb24ob3JnX2lkKSB7XG4gICAgICAgIGlmIChvcmdzX2Nhbl9hZG1pbi5pbmNsdWRlcyhvcmdfaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIG15X3Blcm1pc3Npb25zID0gXy51bmlxKG15X3Blcm1pc3Npb25zKTtcbiAgcmV0dXJuIG15X3Blcm1pc3Npb25zO1xufTtcbiIsIl9ldmFsID0gcmVxdWlyZSgnZXZhbCcpXG5vYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJyk7XG5cbmdldE9iamVjdENvbmZpZyA9IChvYmplY3RBcGlOYW1lKSAtPlxuXHRyZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLnRvQ29uZmlnKClcblxuZ2V0T2JqZWN0TmFtZUZpZWxkS2V5ID0gKG9iamVjdEFwaU5hbWUpIC0+XG5cdHJldHVybiBvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkuTkFNRV9GSUVMRF9LRVlcblxuZ2V0UmVsYXRlZHMgPSAob2JqZWN0QXBpTmFtZSkgLT5cblx0cmV0dXJuIE1ldGVvci53cmFwQXN5bmMoKG9iamVjdEFwaU5hbWUsIGNiKSAtPlxuXHRcdG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS5nZXRSZWxhdGVkcygpLnRoZW4gKHJlc29sdmUsIHJlamVjdCkgLT5cblx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcblx0XHQpKG9iamVjdEFwaU5hbWUpXG5cbm9iamVjdEZpbmRPbmUgPSAob2JqZWN0QXBpTmFtZSwgcXVlcnkpIC0+XG5cdHJldHVybiBNZXRlb3Iud3JhcEFzeW5jKChvYmplY3RBcGlOYW1lLCBxdWVyeSwgY2IpIC0+XG5cdFx0b2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLmZpbmQocXVlcnkpLnRoZW4gKHJlc29sdmUsIHJlamVjdCkgLT5cblx0XHRcdGlmIChyZXNvbHZlICYmIHJlc29sdmUubGVuZ3RoID4gMClcblx0XHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlWzBdKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjYihyZWplY3QsIG51bGwpXG5cdFx0KShvYmplY3RBcGlOYW1lLCBxdWVyeSlcblxub2JqZWN0RmluZCA9IChvYmplY3RBcGlOYW1lLCBxdWVyeSkgLT5cblx0cmV0dXJuIE1ldGVvci53cmFwQXN5bmMoKG9iamVjdEFwaU5hbWUsIHF1ZXJ5LCBjYikgLT5cblx0XHRvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkuZmluZChxdWVyeSkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuXHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxuXHRcdCkob2JqZWN0QXBpTmFtZSwgcXVlcnkpXG5cbm9iamVjdFVwZGF0ZSA9IChvYmplY3RBcGlOYW1lLCBpZCwgZGF0YSkgLT5cblx0cmV0dXJuIE1ldGVvci53cmFwQXN5bmMoKG9iamVjdEFwaU5hbWUsIGlkLCBkYXRhLCBjYikgLT5cblx0XHRvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkudXBkYXRlKGlkLCBkYXRhKS50aGVuIChyZXNvbHZlLCByZWplY3QpIC0+XG5cdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXG5cdFx0KShvYmplY3RBcGlOYW1lLCBpZCwgZGF0YSlcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbiA9IChyZXEpIC0+XG5cdHF1ZXJ5ID0gcmVxLnF1ZXJ5XG5cdHVzZXJJZCA9IHF1ZXJ5W1wiWC1Vc2VyLUlkXCJdXG5cdGF1dGhUb2tlbiA9IHF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0aWYgbm90IHVzZXJJZCBvciBub3QgYXV0aFRva2VuXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG5cblx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxuXHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcblx0XHRfaWQ6IHVzZXJJZCxcblx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuXG5cdGlmIG5vdCB1c2VyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG5cblx0cmV0dXJuIHVzZXJcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZSA9IChzcGFjZV9pZCkgLT5cblx0c3BhY2UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxuXHRpZiBub3Qgc3BhY2Vcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInNwYWNlX2lk5pyJ6K+v5oiW5q2kc3BhY2Xlt7Lnu4/ooqvliKDpmaRcIilcblx0cmV0dXJuIHNwYWNlXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyA9IChmbG93X2lkKSAtPlxuXHRmbG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5mbG93cy5maW5kT25lKGZsb3dfaWQpXG5cdGlmIG5vdCBmbG93XG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJpZOacieivr+aIluatpOa1geeoi+W3sue7j+iiq+WIoOmZpFwiKVxuXHRyZXR1cm4gZmxvd1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlciA9IChzcGFjZV9pZCwgdXNlcl9pZCkgLT5cblx0c3BhY2VfdXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc3BhY2VfdXNlcnMuZmluZE9uZSh7IHNwYWNlOiBzcGFjZV9pZCwgdXNlcjogdXNlcl9pZCB9KVxuXHRpZiBub3Qgc3BhY2VfdXNlclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwidXNlcl9pZOWvueW6lOeahOeUqOaIt+S4jeWxnuS6juW9k+WJjXNwYWNlXCIpXG5cdHJldHVybiBzcGFjZV91c2VyXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyA9IChzcGFjZV91c2VyKSAtPlxuXHRpbmZvID0gbmV3IE9iamVjdFxuXHRpbmZvLm9yZ2FuaXphdGlvbiA9IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uXG5cdG9yZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub3JnYW5pemF0aW9ucy5maW5kT25lKHNwYWNlX3VzZXIub3JnYW5pemF0aW9uLCB7IGZpZWxkczogeyBuYW1lOiAxICwgZnVsbG5hbWU6IDEgfSB9KVxuXHRpbmZvLm9yZ2FuaXphdGlvbl9uYW1lID0gb3JnLm5hbWVcblx0aW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBvcmcuZnVsbG5hbWVcblx0cmV0dXJuIGluZm9cblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dFbmFibGVkID0gKGZsb3cpIC0+XG5cdGlmIGZsb3cuc3RhdGUgaXNudCBcImVuYWJsZWRcIlxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5pyq5ZCv55SoLOaTjeS9nOWksei0pVwiKVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZCA9IChmbG93LCBzcGFjZV9pZCkgLT5cblx0aWYgZmxvdy5zcGFjZSBpc250IHNwYWNlX2lkXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvlkozlt6XkvZzljLpJROS4jeWMuemFjVwiKVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZvcm0gPSAoZm9ybV9pZCkgLT5cblx0Zm9ybSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZm9ybXMuZmluZE9uZShmb3JtX2lkKVxuXHRpZiBub3QgZm9ybVxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsICfooajljZVJROacieivr+aIluatpOihqOWNleW3sue7j+iiq+WIoOmZpCcpXG5cblx0cmV0dXJuIGZvcm1cblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeSA9IChjYXRlZ29yeV9pZCkgLT5cblx0cmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuY2F0ZWdvcmllcy5maW5kT25lKGNhdGVnb3J5X2lkKVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrU3luY0RpcmVjdGlvbiA9IChvYmplY3RfbmFtZSwgZmxvd19pZCkgLT5cblx0b3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XG5cdFx0b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuXHRcdGZsb3dfaWQ6IGZsb3dfaWRcblx0fSlcblx0aWYgIW93XG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+acquaJvuWIsOWvueixoea1geeoi+aYoOWwhOiusOW9leOAgicpXG5cdHN5bmNEaXJlY3Rpb24gPSBvdy5zeW5jX2RpcmVjdGlvbiB8fCAnYm90aCdcblx0aWYgIVsnYm90aCcsICdvYmpfdG9faW5zJ10uaW5jbHVkZXMoc3luY0RpcmVjdGlvbilcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn5LiN5pSv5oyB55qE5ZCM5q2l5pa55ZCR44CCJylcblxuXHRyZXR1cm4gXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY3JlYXRlX2luc3RhbmNlID0gKGluc3RhbmNlX2Zyb21fY2xpZW50LCB1c2VyX2luZm8pIC0+XG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdLCBTdHJpbmdcblx0Y2hlY2sgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSwgU3RyaW5nXG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXSwgU3RyaW5nXG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXSwgW3tvOiBTdHJpbmcsIGlkczogW1N0cmluZ119XVxuXG5cdCMg5qCh6aqM5ZCM5q2l5pa55ZCRXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tTeW5jRGlyZWN0aW9uKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVswXS5vLCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl0pXG5cblx0IyDmoKHpqozmmK/lkKZyZWNvcmTlt7Lnu4/lj5HotbfnmoTnlLPor7fov5jlnKjlrqHmibnkuK1cblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja0lzSW5BcHByb3ZhbChpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl1bMF0sIGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0pXG5cblx0c3BhY2VfaWQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdXG5cdGZsb3dfaWQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl1cblx0dXNlcl9pZCA9IHVzZXJfaW5mby5faWRcblx0IyDojrflj5bliY3lj7DmiYDkvKDnmoR0cmFjZVxuXHR0cmFjZV9mcm9tX2NsaWVudCA9IG51bGxcblx0IyDojrflj5bliY3lj7DmiYDkvKDnmoRhcHByb3ZlXG5cdGFwcHJvdmVfZnJvbV9jbGllbnQgPSBudWxsXG5cdGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdIGFuZCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXVxuXHRcdHRyYWNlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1cblx0XHRpZiB0cmFjZV9mcm9tX2NsaWVudFtcImFwcHJvdmVzXCJdIGFuZCB0cmFjZV9mcm9tX2NsaWVudFtcImFwcHJvdmVzXCJdWzBdXG5cdFx0XHRhcHByb3ZlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1bXCJhcHByb3Zlc1wiXVswXVxuXG5cdCMg6I635Y+W5LiA5Liqc3BhY2Vcblx0c3BhY2UgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlKHNwYWNlX2lkKVxuXHQjIOiOt+WPluS4gOS4qmZsb3dcblx0ZmxvdyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyhmbG93X2lkKVxuXHQjIOiOt+WPluS4gOS4qnNwYWNl5LiL55qE5LiA5LiqdXNlclxuXHRzcGFjZV91c2VyID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXIoc3BhY2VfaWQsIHVzZXJfaWQpXG5cdCMg6I635Y+Wc3BhY2VfdXNlcuaJgOWcqOeahOmDqOmXqOS/oeaBr1xuXHRzcGFjZV91c2VyX29yZ19pbmZvID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXJPcmdJbmZvKHNwYWNlX3VzZXIpXG5cdCMg5Yik5pat5LiA5LiqZmxvd+aYr+WQpuS4uuWQr+eUqOeKtuaAgVxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd0VuYWJsZWQoZmxvdylcblx0IyDliKTmlq3kuIDkuKpmbG935ZKMc3BhY2VfaWTmmK/lkKbljLnphY1cblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQoZmxvdywgc3BhY2VfaWQpXG5cblx0Zm9ybSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybShmbG93LmZvcm0pXG5cblx0cGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd19pZCwgdXNlcl9pZClcblxuXHRpZiBub3QgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZGRcIilcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuW9k+WJjeeUqOaIt+ayoeacieatpOa1geeoi+eahOaWsOW7uuadg+mZkFwiKVxuXG5cdG5vdyA9IG5ldyBEYXRlXG5cdGluc19vYmogPSB7fVxuXHRpbnNfb2JqLl9pZCA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLl9tYWtlTmV3SUQoKVxuXHRpbnNfb2JqLnNwYWNlID0gc3BhY2VfaWRcblx0aW5zX29iai5mbG93ID0gZmxvd19pZFxuXHRpbnNfb2JqLmZsb3dfdmVyc2lvbiA9IGZsb3cuY3VycmVudC5faWRcblx0aW5zX29iai5mb3JtID0gZmxvdy5mb3JtXG5cdGluc19vYmouZm9ybV92ZXJzaW9uID0gZmxvdy5jdXJyZW50LmZvcm1fdmVyc2lvblxuXHRpbnNfb2JqLm5hbWUgPSBmbG93Lm5hbWVcblx0aW5zX29iai5zdWJtaXR0ZXIgPSB1c2VyX2lkXG5cdGluc19vYmouc3VibWl0dGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZVxuXHRpbnNfb2JqLmFwcGxpY2FudCA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gZWxzZSB1c2VyX2lkXG5cdGluc19vYmouYXBwbGljYW50X25hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSBlbHNlIHVzZXJfaW5mby5uYW1lXG5cdGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbiA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSBlbHNlIHNwYWNlX3VzZXIub3JnYW5pemF0aW9uXG5cdGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZVwiXSBlbHNlIHNwYWNlX3VzZXJfb3JnX2luZm8ub3JnYW5pemF0aW9uX25hbWVcblx0aW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdIGVsc2UgIHNwYWNlX3VzZXJfb3JnX2luZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lXG5cdGluc19vYmouYXBwbGljYW50X2NvbXBhbnkgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfY29tcGFueVwiXSBlbHNlIHNwYWNlX3VzZXIuY29tcGFueV9pZFxuXHRpbnNfb2JqLnN0YXRlID0gJ2RyYWZ0J1xuXHRpbnNfb2JqLmNvZGUgPSAnJ1xuXHRpbnNfb2JqLmlzX2FyY2hpdmVkID0gZmFsc2Vcblx0aW5zX29iai5pc19kZWxldGVkID0gZmFsc2Vcblx0aW5zX29iai5jcmVhdGVkID0gbm93XG5cdGluc19vYmouY3JlYXRlZF9ieSA9IHVzZXJfaWRcblx0aW5zX29iai5tb2RpZmllZCA9IG5vd1xuXHRpbnNfb2JqLm1vZGlmaWVkX2J5ID0gdXNlcl9pZFxuXG5cdGluc19vYmoucmVjb3JkX2lkcyA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVxuXG5cdGlmIHNwYWNlX3VzZXIuY29tcGFueV9pZFxuXHRcdGluc19vYmouY29tcGFueV9pZCA9IHNwYWNlX3VzZXIuY29tcGFueV9pZFxuXG5cdCMg5paw5bu6VHJhY2Vcblx0dHJhY2Vfb2JqID0ge31cblx0dHJhY2Vfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHJcblx0dHJhY2Vfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWRcblx0dHJhY2Vfb2JqLmlzX2ZpbmlzaGVkID0gZmFsc2Vcblx0IyDlvZPliY3mnIDmlrDniYhmbG935Lit5byA5aeL6IqC54K5XG5cdHN0YXJ0X3N0ZXAgPSBfLmZpbmQoZmxvdy5jdXJyZW50LnN0ZXBzLCAoc3RlcCkgLT5cblx0XHRyZXR1cm4gc3RlcC5zdGVwX3R5cGUgaXMgJ3N0YXJ0J1xuXHQpXG5cdHRyYWNlX29iai5zdGVwID0gc3RhcnRfc3RlcC5faWRcblx0dHJhY2Vfb2JqLm5hbWUgPSBzdGFydF9zdGVwLm5hbWVcblxuXHR0cmFjZV9vYmouc3RhcnRfZGF0ZSA9IG5vd1xuXHQjIOaWsOW7ukFwcHJvdmVcblx0YXBwcl9vYmogPSB7fVxuXHRhcHByX29iai5faWQgPSBuZXcgTW9uZ28uT2JqZWN0SUQoKS5fc3RyXG5cdGFwcHJfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWRcblx0YXBwcl9vYmoudHJhY2UgPSB0cmFjZV9vYmouX2lkXG5cdGFwcHJfb2JqLmlzX2ZpbmlzaGVkID0gZmFsc2Vcblx0YXBwcl9vYmoudXNlciA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gZWxzZSB1c2VyX2lkXG5cdGFwcHJfb2JqLnVzZXJfbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIGVsc2UgdXNlcl9pbmZvLm5hbWVcblx0YXBwcl9vYmouaGFuZGxlciA9IHVzZXJfaWRcblx0YXBwcl9vYmouaGFuZGxlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWVcblx0YXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvblxuXHRhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9uYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5uYW1lXG5cdGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5mdWxsbmFtZVxuXHRhcHByX29iai50eXBlID0gJ2RyYWZ0J1xuXHRhcHByX29iai5zdGFydF9kYXRlID0gbm93XG5cdGFwcHJfb2JqLnJlYWRfZGF0ZSA9IG5vd1xuXHRhcHByX29iai5pc19yZWFkID0gdHJ1ZVxuXHRhcHByX29iai5pc19lcnJvciA9IGZhbHNlXG5cdGFwcHJfb2JqLmRlc2NyaXB0aW9uID0gJydcblx0cmVsYXRlZFRhYmxlc0luZm8gPSB7fVxuXHRhcHByX29iai52YWx1ZXMgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlVmFsdWVzKGluc19vYmoucmVjb3JkX2lkc1swXSwgZmxvd19pZCwgc3BhY2VfaWQsIGZvcm0uY3VycmVudC5maWVsZHMsIHJlbGF0ZWRUYWJsZXNJbmZvKVxuXG5cdHRyYWNlX29iai5hcHByb3ZlcyA9IFthcHByX29ial1cblx0aW5zX29iai50cmFjZXMgPSBbdHJhY2Vfb2JqXVxuXG5cdGluc19vYmoudmFsdWVzID0gYXBwcl9vYmoudmFsdWVzXG5cblx0aW5zX29iai5pbmJveF91c2VycyA9IGluc3RhbmNlX2Zyb21fY2xpZW50LmluYm94X3VzZXJzIHx8IFtdXG5cblx0aW5zX29iai5jdXJyZW50X3N0ZXBfbmFtZSA9IHN0YXJ0X3N0ZXAubmFtZVxuXG5cdGlmIGZsb3cuYXV0b19yZW1pbmQgaXMgdHJ1ZVxuXHRcdGluc19vYmouYXV0b19yZW1pbmQgPSB0cnVlXG5cblx0IyDmlrDlu7rnlLPor7fljZXml7bvvIxpbnN0YW5jZXPorrDlvZXmtYHnqIvlkI3np7DjgIHmtYHnqIvliIbnsbvlkI3np7AgIzEzMTNcblx0aW5zX29iai5mbG93X25hbWUgPSBmbG93Lm5hbWVcblx0aWYgZm9ybS5jYXRlZ29yeVxuXHRcdGNhdGVnb3J5ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeShmb3JtLmNhdGVnb3J5KVxuXHRcdGlmIGNhdGVnb3J5XG5cdFx0XHRpbnNfb2JqLmNhdGVnb3J5X25hbWUgPSBjYXRlZ29yeS5uYW1lXG5cdFx0XHRpbnNfb2JqLmNhdGVnb3J5ID0gY2F0ZWdvcnkuX2lkXG5cblx0bmV3X2luc19pZCA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmluc2VydChpbnNfb2JqKVxuXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8oaW5zX29iai5yZWNvcmRfaWRzWzBdLCBuZXdfaW5zX2lkLCBzcGFjZV9pZClcblxuXHQjIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvKHJlbGF0ZWRUYWJsZXNJbmZvLCBuZXdfaW5zX2lkLCBzcGFjZV9pZClcblxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoKGluc19vYmoucmVjb3JkX2lkc1swXSwgc3BhY2VfaWQsIGluc19vYmouX2lkLCBhcHByX29iai5faWQpXG5cblx0cmV0dXJuIG5ld19pbnNfaWRcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVZhbHVlcyA9IChyZWNvcmRJZHMsIGZsb3dJZCwgc3BhY2VJZCwgZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbykgLT5cblx0ZmllbGRDb2RlcyA9IFtdXG5cdF8uZWFjaCBmaWVsZHMsIChmKSAtPlxuXHRcdGlmIGYudHlwZSA9PSAnc2VjdGlvbidcblx0XHRcdF8uZWFjaCBmLmZpZWxkcywgKGZmKSAtPlxuXHRcdFx0XHRmaWVsZENvZGVzLnB1c2ggZmYuY29kZVxuXHRcdGVsc2Vcblx0XHRcdGZpZWxkQ29kZXMucHVzaCBmLmNvZGVcblxuXHR2YWx1ZXMgPSB7fVxuXHRvYmplY3ROYW1lID0gcmVjb3JkSWRzLm9cblx0b2JqZWN0ID0gZ2V0T2JqZWN0Q29uZmlnKG9iamVjdE5hbWUpXG5cdHJlY29yZElkID0gcmVjb3JkSWRzLmlkc1swXVxuXHRvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3dvcmtmbG93cy5maW5kT25lKHtcblx0XHRvYmplY3RfbmFtZTogb2JqZWN0TmFtZSxcblx0XHRmbG93X2lkOiBmbG93SWRcblx0fSlcblx0IyByZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0TmFtZSwgc3BhY2VJZCkuZmluZE9uZShyZWNvcmRJZClcblx0cmVjb3JkID0gb2JqZWN0RmluZE9uZShvYmplY3ROYW1lLCB7IGZpbHRlcnM6IFtbJ19pZCcsICc9JywgcmVjb3JkSWRdXX0pXG5cdGZsb3cgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShmbG93SWQsIHsgZmllbGRzOiB7IGZvcm06IDEgfSB9KVxuXHRpZiBvdyBhbmQgcmVjb3JkXG5cdFx0Zm9ybSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImZvcm1zXCIpLmZpbmRPbmUoZmxvdy5mb3JtKVxuXHRcdGZvcm1GaWVsZHMgPSBmb3JtLmN1cnJlbnQuZmllbGRzIHx8IFtdXG5cdFx0cmVsYXRlZE9iamVjdHMgPSBnZXRSZWxhdGVkcyhvYmplY3ROYW1lKVxuXHRcdHJlbGF0ZWRPYmplY3RzS2V5cyA9IF8ucGx1Y2socmVsYXRlZE9iamVjdHMsICdvYmplY3RfbmFtZScpXG5cdFx0Zm9ybVRhYmxlRmllbGRzID0gXy5maWx0ZXIgZm9ybUZpZWxkcywgKGZvcm1GaWVsZCkgLT5cblx0XHRcdHJldHVybiBmb3JtRmllbGQudHlwZSA9PSAndGFibGUnXG5cdFx0Zm9ybVRhYmxlRmllbGRzQ29kZSA9IF8ucGx1Y2soZm9ybVRhYmxlRmllbGRzLCAnY29kZScpXG5cblx0XHRnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gIChrZXkpIC0+XG5cdFx0XHRyZXR1cm4gXy5maW5kIHJlbGF0ZWRPYmplY3RzS2V5cywgIChyZWxhdGVkT2JqZWN0c0tleSkgLT5cblx0XHRcdFx0cmV0dXJuIGtleS5zdGFydHNXaXRoKHJlbGF0ZWRPYmplY3RzS2V5ICsgJy4nKVxuXG5cdFx0Z2V0Rm9ybVRhYmxlRmllbGRDb2RlID0gKGtleSkgLT5cblx0XHRcdHJldHVybiBfLmZpbmQgZm9ybVRhYmxlRmllbGRzQ29kZSwgIChmb3JtVGFibGVGaWVsZENvZGUpIC0+XG5cdFx0XHRcdHJldHVybiBrZXkuc3RhcnRzV2l0aChmb3JtVGFibGVGaWVsZENvZGUgKyAnLicpXG5cblx0XHRnZXRGb3JtVGFibGVGaWVsZCA9IChrZXkpIC0+XG5cdFx0XHRyZXR1cm4gXy5maW5kIGZvcm1UYWJsZUZpZWxkcywgIChmKSAtPlxuXHRcdFx0XHRyZXR1cm4gZi5jb2RlID09IGtleVxuXG5cdFx0Z2V0Rm9ybUZpZWxkID0gKGtleSkgLT5cblx0XHRcdGZmID0gbnVsbFxuXHRcdFx0Xy5mb3JFYWNoIGZvcm1GaWVsZHMsIChmKSAtPlxuXHRcdFx0XHRpZiBmZlxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRpZiBmLnR5cGUgPT0gJ3NlY3Rpb24nXG5cdFx0XHRcdFx0ZmYgPSBfLmZpbmQgZi5maWVsZHMsICAoc2YpIC0+XG5cdFx0XHRcdFx0XHRyZXR1cm4gc2YuY29kZSA9PSBrZXlcblx0XHRcdFx0ZWxzZSBpZiBmLmNvZGUgPT0ga2V5XG5cdFx0XHRcdFx0ZmYgPSBmXG5cblx0XHRcdHJldHVybiBmZlxuXG5cdFx0Z2V0Rm9ybVRhYmxlU3ViRmllbGQgPSAodGFibGVGaWVsZCwgc3ViRmllbGRDb2RlKSAtPlxuXHRcdFx0cmV0dXJuIF8uZmluZCB0YWJsZUZpZWxkLmZpZWxkcywgIChmKSAtPlxuXHRcdFx0XHRyZXR1cm4gZi5jb2RlID09IHN1YkZpZWxkQ29kZVxuXG5cdFx0Z2V0RmllbGRPZGF0YVZhbHVlID0gKG9iak5hbWUsIGlkLCByZWZlcmVuY2VUb0ZpZWxkTmFtZSkgLT5cblx0XHRcdCMgb2JqID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iak5hbWUpXG5cdFx0XHRvYmogPSBvYmplY3RxbC5nZXRPYmplY3Qob2JqTmFtZSlcblx0XHRcdG5hbWVLZXkgPSBnZXRPYmplY3ROYW1lRmllbGRLZXkob2JqTmFtZSlcblx0XHRcdGlmICFvYmpcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRpZiBfLmlzU3RyaW5nIGlkXG5cdFx0XHRcdCMgX3JlY29yZCA9IG9iai5maW5kT25lKGlkKVxuXHRcdFx0XHRfcmVjb3JkID0gb2JqZWN0RmluZE9uZShvYmpOYW1lLCB7IGZpbHRlcnM6IFtbcmVmZXJlbmNlVG9GaWVsZE5hbWUsICc9JywgaWRdXX0pXG5cdFx0XHRcdGlmIF9yZWNvcmRcblx0XHRcdFx0XHRfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmRbbmFtZUtleV1cblx0XHRcdFx0XHRyZXR1cm4gX3JlY29yZFxuXHRcdFx0ZWxzZSBpZiBfLmlzQXJyYXkgaWRcblx0XHRcdFx0X3JlY29yZHMgPSBbXVxuXHRcdFx0XHQjIG9iai5maW5kKHsgX2lkOiB7ICRpbjogaWQgfSB9KVxuXHRcdFx0XHRvYmplY3RGaW5kKG9iak5hbWUsIHsgZmlsdGVyczogW1tyZWZlcmVuY2VUb0ZpZWxkTmFtZSwgJ2luJywgaWRdXX0pLmZvckVhY2ggKF9yZWNvcmQpIC0+XG5cdFx0XHRcdFx0X3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkW25hbWVLZXldXG5cdFx0XHRcdFx0X3JlY29yZHMucHVzaCBfcmVjb3JkXG5cdFx0XHRcdGlmICFfLmlzRW1wdHkgX3JlY29yZHNcblx0XHRcdFx0XHRyZXR1cm4gX3JlY29yZHNcblx0XHRcdHJldHVyblxuXG5cdFx0Z2V0U2VsZWN0VXNlclZhbHVlID0gKHVzZXJJZCwgc3BhY2VJZCkgLT5cblx0XHRcdHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0pXG5cdFx0XHRzdS5pZCA9IHVzZXJJZFxuXHRcdFx0cmV0dXJuIHN1XG5cblx0XHRnZXRTZWxlY3RVc2VyVmFsdWVzID0gKHVzZXJJZHMsIHNwYWNlSWQpIC0+XG5cdFx0XHRzdXMgPSBbXVxuXHRcdFx0aWYgXy5pc0FycmF5IHVzZXJJZHNcblx0XHRcdFx0Xy5lYWNoIHVzZXJJZHMsICh1c2VySWQpIC0+XG5cdFx0XHRcdFx0c3UgPSBnZXRTZWxlY3RVc2VyVmFsdWUodXNlcklkLCBzcGFjZUlkKVxuXHRcdFx0XHRcdGlmIHN1XG5cdFx0XHRcdFx0XHRzdXMucHVzaChzdSlcblx0XHRcdHJldHVybiBzdXNcblxuXHRcdGdldFNlbGVjdE9yZ1ZhbHVlID0gKG9yZ0lkLCBzcGFjZUlkKSAtPlxuXHRcdFx0b3JnID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZE9uZShvcmdJZCwgeyBmaWVsZHM6IHsgX2lkOiAxLCBuYW1lOiAxLCBmdWxsbmFtZTogMSB9IH0pXG5cdFx0XHRvcmcuaWQgPSBvcmdJZFxuXHRcdFx0cmV0dXJuIG9yZ1xuXG5cdFx0Z2V0U2VsZWN0T3JnVmFsdWVzID0gKG9yZ0lkcywgc3BhY2VJZCkgLT5cblx0XHRcdG9yZ3MgPSBbXVxuXHRcdFx0aWYgXy5pc0FycmF5IG9yZ0lkc1xuXHRcdFx0XHRfLmVhY2ggb3JnSWRzLCAob3JnSWQpIC0+XG5cdFx0XHRcdFx0b3JnID0gZ2V0U2VsZWN0T3JnVmFsdWUob3JnSWQsIHNwYWNlSWQpXG5cdFx0XHRcdFx0aWYgb3JnXG5cdFx0XHRcdFx0XHRvcmdzLnB1c2gob3JnKVxuXHRcdFx0cmV0dXJuIG9yZ3NcblxuXHRcdHRhYmxlRmllbGRDb2RlcyA9IFtdXG5cdFx0dGFibGVGaWVsZE1hcCA9IFtdXG5cdFx0dGFibGVUb1JlbGF0ZWRNYXAgPSB7fVxuXG5cdFx0b3cuZmllbGRfbWFwPy5mb3JFYWNoIChmbSkgLT5cblx0XHRcdG9iamVjdF9maWVsZCA9IGZtLm9iamVjdF9maWVsZFxuXHRcdFx0d29ya2Zsb3dfZmllbGQgPSBmbS53b3JrZmxvd19maWVsZFxuXHRcdFx0aWYgIW9iamVjdF9maWVsZCB8fCAhd29ya2Zsb3dfZmllbGRcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICfmnKrmib7liLDlrZfmrrXvvIzor7fmo4Dmn6Xlr7nosaHmtYHnqIvmmKDlsITlrZfmrrXphY3nva4nKVxuXHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkQ29kZSA9IGdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUob2JqZWN0X2ZpZWxkKVxuXHRcdFx0Zm9ybVRhYmxlRmllbGRDb2RlID0gZ2V0Rm9ybVRhYmxlRmllbGRDb2RlKHdvcmtmbG93X2ZpZWxkKVxuXHRcdFx0b2JqRmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdF9maWVsZF1cblx0XHRcdGZvcm1GaWVsZCA9IGdldEZvcm1GaWVsZCh3b3JrZmxvd19maWVsZClcblx0XHRcdCMg5aSE55CG5a2Q6KGo5a2X5q61XG5cdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGRDb2RlXG5cdFx0XHRcdFxuXHRcdFx0XHRvVGFibGVDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF1cblx0XHRcdFx0b1RhYmxlRmllbGRDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV1cblx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBLZXkgPSBvVGFibGVDb2RlXG5cdFx0XHRcdGlmICF0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1cblx0XHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0gPSB7fVxuXG5cdFx0XHRcdGlmIGZvcm1UYWJsZUZpZWxkQ29kZVxuXHRcdFx0XHRcdHdUYWJsZUNvZGUgPSB3b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdXG5cdFx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldWydfRlJPTV9UQUJMRV9DT0RFJ10gPSB3VGFibGVDb2RlXG5cblx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldW29UYWJsZUZpZWxkQ29kZV0gPSB3b3JrZmxvd19maWVsZFxuXHRcdFx0IyDliKTmlq3mmK/lkKbmmK/ooajmoLzlrZfmrrVcblx0XHRcdGVsc2UgaWYgd29ya2Zsb3dfZmllbGQuaW5kZXhPZignLicpID4gMCBhbmQgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID4gMFxuXHRcdFx0XHR3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVswXVxuXHRcdFx0XHRvVGFibGVDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJC4nKVswXVxuXHRcdFx0XHRpZiByZWNvcmQuaGFzT3duUHJvcGVydHkob1RhYmxlQ29kZSkgYW5kIF8uaXNBcnJheShyZWNvcmRbb1RhYmxlQ29kZV0pXG5cdFx0XHRcdFx0dGFibGVGaWVsZENvZGVzLnB1c2goSlNPTi5zdHJpbmdpZnkoe1xuXHRcdFx0XHRcdFx0d29ya2Zsb3dfdGFibGVfZmllbGRfY29kZTogd1RhYmxlQ29kZSxcblx0XHRcdFx0XHRcdG9iamVjdF90YWJsZV9maWVsZF9jb2RlOiBvVGFibGVDb2RlXG5cdFx0XHRcdFx0fSkpXG5cdFx0XHRcdFx0dGFibGVGaWVsZE1hcC5wdXNoKGZtKVxuXHRcdFx0XHRlbHNlIGlmIG9UYWJsZUNvZGUuaW5kZXhPZignLicpID4gMCAjIOivtOaYjuaYr+WFs+iBlOihqOeahGdyaWTlrZfmrrVcblx0XHRcdFx0XHRvVGFibGVDb2RlUmVmZXJlbmNlRmllbGRDb2RlID0gb1RhYmxlQ29kZS5zcGxpdCgnLicpWzBdO1xuXHRcdFx0XHRcdGdyaWRDb2RlID0gb1RhYmxlQ29kZS5zcGxpdCgnLicpWzFdO1xuXHRcdFx0XHRcdG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZCA9IG9iamVjdC5maWVsZHNbb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkQ29kZV07XG5cdFx0XHRcdFx0aWYgb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0aWYgcmVjb3JkW29UYWJsZUNvZGVdXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRmllbGROYW1lID0gb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnJlZmVyZW5jZV90b19maWVsZCB8fCAnX2lkJztcblx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5yZWZlcmVuY2VfdG87XG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSByZWNvcmRbb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLm5hbWVdO1xuXHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9Eb2MgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKTtcblx0XHRcdFx0XHRcdGlmIHJlZmVyZW5jZVRvRG9jW2dyaWRDb2RlXVxuXHRcdFx0XHRcdFx0XHRyZWNvcmRbb1RhYmxlQ29kZV0gPSByZWZlcmVuY2VUb0RvY1tncmlkQ29kZV07XG5cdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcblx0XHRcdFx0XHRcdFx0XHR3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxuXHRcdFx0XHRcdFx0XHRcdG9iamVjdF90YWJsZV9maWVsZF9jb2RlOiBvVGFibGVDb2RlXG5cdFx0XHRcdFx0XHRcdH0pKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRhYmxlRmllbGRNYXAucHVzaChmbSk7XG5cblx0XHRcdCMg5aSE55CGbG9va3Vw44CBbWFzdGVyX2RldGFpbOexu+Wei+Wtl+autVxuXHRcdFx0ZWxzZSBpZiBvYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gMCBhbmQgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID09IC0xXG5cdFx0XHRcdG9iamVjdEZpZWxkTmFtZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdXG5cdFx0XHRcdGxvb2t1cEZpZWxkTmFtZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzFdXG5cdFx0XHRcdGlmIG9iamVjdFxuXHRcdFx0XHRcdG9iamVjdEZpZWxkID0gb2JqZWN0LmZpZWxkc1tvYmplY3RGaWVsZE5hbWVdXG5cdFx0XHRcdFx0aWYgb2JqZWN0RmllbGQgJiYgZm9ybUZpZWxkICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdCMgZmllbGRzT2JqID0ge31cblx0XHRcdFx0XHRcdCMgZmllbGRzT2JqW2xvb2t1cEZpZWxkTmFtZV0gPSAxXG5cdFx0XHRcdFx0XHQjIGxvb2t1cE9iamVjdFJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpLmZpbmRPbmUocmVjb3JkW29iamVjdEZpZWxkTmFtZV0sIHsgZmllbGRzOiBmaWVsZHNPYmogfSlcblx0XHRcdFx0XHRcdGxvb2t1cE9iamVjdFJlY29yZCA9IG9iamVjdEZpbmRPbmUob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvLCB7IGZpbHRlcnM6IFtbJ19pZCcsICc9JywgcmVjb3JkW29iamVjdEZpZWxkTmFtZV1dXSwgZmllbGRzOiBbbG9va3VwRmllbGROYW1lXSB9KVxuXHRcdFx0XHRcdFx0aWYgIWxvb2t1cE9iamVjdFJlY29yZFxuXHRcdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRcdG9iamVjdEZpZWxkT2JqZWN0TmFtZSA9IG9iamVjdEZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRcdFx0bG9va3VwRmllbGRPYmogPSBnZXRPYmplY3RDb25maWcob2JqZWN0RmllbGRPYmplY3ROYW1lKVxuXHRcdFx0XHRcdFx0b2JqZWN0TG9va3VwRmllbGQgPSBsb29rdXBGaWVsZE9iai5maWVsZHNbbG9va3VwRmllbGROYW1lXVxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gbG9va3VwT2JqZWN0UmVjb3JkW2xvb2t1cEZpZWxkTmFtZV1cblx0XHRcdFx0XHRcdGlmIG9iamVjdExvb2t1cEZpZWxkICYmIGZvcm1GaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RMb29rdXBGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZE5hbWUgPSBvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQgfHwgJ19pZCdcblx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvXG5cdFx0XHRcdFx0XHRcdG9kYXRhRmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0XHRpZiBvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmICFvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb0ZpZWxkTmFtZSlcblx0XHRcdFx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiBvYmplY3RMb29rdXBGaWVsZCAmJiBmb3JtRmllbGQgJiYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RMb29rdXBGaWVsZC50eXBlKSAmJiAoWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvKSB8fCAoJ3NwYWNlX3VzZXJzJyA9PSBvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG8gJiYgJ3VzZXInID09IG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90b19maWVsZCkgKVxuXHRcdFx0XHRcdFx0XHRpZiAhXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRsb29rdXBTZWxlY3RGaWVsZFZhbHVlXG5cdFx0XHRcdFx0XHRcdFx0aWYgZm9ybUZpZWxkLnR5cGUgPT0gJ3VzZXInXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhb2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBTZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZvcm1GaWVsZC50eXBlID09ICdncm91cCdcblx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdExvb2t1cEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBTZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIW9iamVjdExvb2t1cEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRpZiBsb29rdXBTZWxlY3RGaWVsZFZhbHVlXG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gbG9va3VwU2VsZWN0RmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gbG9va3VwT2JqZWN0UmVjb3JkW2xvb2t1cEZpZWxkTmFtZV1cblxuXHRcdFx0IyBsb29rdXDjgIFtYXN0ZXJfZGV0YWls5a2X5q615ZCM5q2l5Yiwb2RhdGHlrZfmrrVcblx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkICYmIG9iakZpZWxkICYmIGZvcm1GaWVsZC50eXBlID09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iakZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqRmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkTmFtZSA9IG9iakZpZWxkLnJlZmVyZW5jZV90b19maWVsZCB8fCAnX2lkJ1xuXHRcdFx0XHRyZWZlcmVuY2VUb09iamVjdE5hbWUgPSBvYmpGaWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdXG5cdFx0XHRcdG9kYXRhRmllbGRWYWx1ZVxuXHRcdFx0XHRpZiBvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKVxuXHRcdFx0XHRlbHNlIGlmICFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb0ZpZWxkTmFtZSlcblx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZVxuXHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiAoWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob2JqRmllbGQucmVmZXJlbmNlX3RvKSB8fCAoJ3NwYWNlX3VzZXJzJyA9PSBvYmpGaWVsZC5yZWZlcmVuY2VfdG8gJiYgJ3VzZXInID09IG9iakZpZWxkLnJlZmVyZW5jZV90b19maWVsZCkgKVxuXHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSByZWNvcmRbb2JqRmllbGQubmFtZV1cblx0XHRcdFx0aWYgIV8uaXNFbXB0eShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXG5cdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZVxuXHRcdFx0XHRcdGlmIGZvcm1GaWVsZC50eXBlID09ICd1c2VyJ1xuXHRcdFx0XHRcdFx0aWYgb2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdGVsc2UgaWYgIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQudHlwZSA9PSAnZ3JvdXAnXG5cdFx0XHRcdFx0XHRpZiBvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRlbHNlIGlmICFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0aWYgc2VsZWN0RmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHNlbGVjdEZpZWxkVmFsdWVcblx0XHRcdGVsc2UgaWYgcmVjb3JkLmhhc093blByb3BlcnR5KG9iamVjdF9maWVsZClcblx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHJlY29yZFtvYmplY3RfZmllbGRdXG5cblx0XHQjIOihqOagvOWtl+autVxuXHRcdF8udW5pcSh0YWJsZUZpZWxkQ29kZXMpLmZvckVhY2ggKHRmYykgLT5cblx0XHRcdGMgPSBKU09OLnBhcnNlKHRmYylcblx0XHRcdHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdID0gW11cblx0XHRcdHJlY29yZFtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXS5mb3JFYWNoICh0cikgLT5cblx0XHRcdFx0bmV3VHIgPSB7fVxuXHRcdFx0XHRfLmVhY2ggdHIsICh2LCBrKSAtPlxuXHRcdFx0XHRcdHRhYmxlRmllbGRNYXAuZm9yRWFjaCAodGZtKSAtPlxuXHRcdFx0XHRcdFx0aWYgdGZtLm9iamVjdF9maWVsZCBpcyAoYy5vYmplY3RfdGFibGVfZmllbGRfY29kZSArICcuJC4nICsgaylcblx0XHRcdFx0XHRcdFx0d1RkQ29kZSA9IHRmbS53b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzFdXG5cdFx0XHRcdFx0XHRcdG5ld1RyW3dUZENvZGVdID0gdlxuXHRcdFx0XHRpZiBub3QgXy5pc0VtcHR5KG5ld1RyKVxuXHRcdFx0XHRcdHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdLnB1c2gobmV3VHIpXG5cblx0XHQjIOWQjOatpeWtkOihqOaVsOaNruiHs+ihqOWNleihqOagvFxuXHRcdF8uZWFjaCB0YWJsZVRvUmVsYXRlZE1hcCwgIChtYXAsIGtleSkgLT5cblx0XHRcdHRhYmxlQ29kZSA9IG1hcC5fRlJPTV9UQUJMRV9DT0RFXG5cdFx0XHRmb3JtVGFibGVGaWVsZCA9IGdldEZvcm1UYWJsZUZpZWxkKHRhYmxlQ29kZSlcblx0XHRcdGlmICF0YWJsZUNvZGVcblx0XHRcdFx0Y29uc29sZS53YXJuKCd0YWJsZVRvUmVsYXRlZDogWycgKyBrZXkgKyAnXSBtaXNzaW5nIGNvcnJlc3BvbmRpbmcgdGFibGUuJylcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmVsYXRlZE9iamVjdE5hbWUgPSBrZXlcblx0XHRcdFx0dGFibGVWYWx1ZXMgPSBbXVxuXHRcdFx0XHRyZWxhdGVkVGFibGVJdGVtcyA9IFtdXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3QgPSBnZXRPYmplY3RDb25maWcocmVsYXRlZE9iamVjdE5hbWUpXG5cdFx0XHRcdHJlbGF0ZWRGaWVsZCA9IF8uZmluZCByZWxhdGVkT2JqZWN0LmZpZWxkcywgKGYpIC0+XG5cdFx0XHRcdFx0cmV0dXJuIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhmLnR5cGUpICYmIGYucmVmZXJlbmNlX3RvID09IG9iamVjdE5hbWVcblxuXHRcdFx0XHRyZWxhdGVkRmllbGROYW1lID0gcmVsYXRlZEZpZWxkLm5hbWVcblxuXHRcdFx0XHRzZWxlY3RvciA9IHt9XG5cdFx0XHRcdHNlbGVjdG9yW3JlbGF0ZWRGaWVsZE5hbWVdID0gcmVjb3JkSWRcblx0XHRcdFx0cmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpXG5cdFx0XHRcdHJlbGF0ZWRSZWNvcmRzID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZChzZWxlY3RvcilcblxuXHRcdFx0XHRyZWxhdGVkUmVjb3Jkcy5mb3JFYWNoIChycikgLT5cblx0XHRcdFx0XHR0YWJsZVZhbHVlSXRlbSA9IHt9XG5cdFx0XHRcdFx0Xy5lYWNoIG1hcCwgKHZhbHVlS2V5LCBmaWVsZEtleSkgLT5cblx0XHRcdFx0XHRcdGlmIGZpZWxkS2V5ICE9ICdfRlJPTV9UQUJMRV9DT0RFJ1xuXHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWVcblx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkS2V5XG5cdFx0XHRcdFx0XHRcdGlmIHZhbHVlS2V5LnN0YXJ0c1dpdGgodGFibGVDb2RlICsgJy4nKVxuXHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleSA9ICh2YWx1ZUtleS5zcGxpdChcIi5cIilbMV0pXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXkgPSB2YWx1ZUtleVxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkID0gZ2V0Rm9ybVRhYmxlU3ViRmllbGQoZm9ybVRhYmxlRmllbGQsIGZvcm1GaWVsZEtleSlcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkID0gcmVsYXRlZE9iamVjdC5maWVsZHNbZmllbGRLZXldXG5cdFx0XHRcdFx0XHRcdGlmICFmb3JtRmllbGQgfHwgIXJlbGF0ZWRPYmplY3RGaWVsZFxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdFx0XHRpZiBmb3JtRmllbGQudHlwZSA9PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhyZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRmllbGROYW1lID0gcmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90b19maWVsZCB8fCAnX2lkJ1xuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV1cblx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKGZvcm1GaWVsZC50eXBlKSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcnJbZmllbGRLZXldXG5cdFx0XHRcdFx0XHRcdFx0aWYgIV8uaXNFbXB0eShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBmb3JtRmllbGQudHlwZSA9PSAndXNlcidcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmICFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZvcm1GaWVsZC50eXBlID09ICdncm91cCdcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gcnJbZmllbGRLZXldXG5cdFx0XHRcdFx0XHRcdHRhYmxlVmFsdWVJdGVtW2Zvcm1GaWVsZEtleV0gPSB0YWJsZUZpZWxkVmFsdWVcblx0XHRcdFx0XHRpZiAhXy5pc0VtcHR5KHRhYmxlVmFsdWVJdGVtKVxuXHRcdFx0XHRcdFx0dGFibGVWYWx1ZUl0ZW0uX2lkID0gcnIuX2lkXG5cdFx0XHRcdFx0XHR0YWJsZVZhbHVlcy5wdXNoKHRhYmxlVmFsdWVJdGVtKVxuXHRcdFx0XHRcdFx0cmVsYXRlZFRhYmxlSXRlbXMucHVzaCh7IF90YWJsZTogeyBfaWQ6IHJyLl9pZCwgX2NvZGU6IHRhYmxlQ29kZSB9IH0gKVxuXG5cdFx0XHRcdHZhbHVlc1t0YWJsZUNvZGVdID0gdGFibGVWYWx1ZXNcblx0XHRcdFx0cmVsYXRlZFRhYmxlc0luZm9bcmVsYXRlZE9iamVjdE5hbWVdID0gcmVsYXRlZFRhYmxlSXRlbXNcblxuXHRcdCMg5aaC5p6c6YWN572u5LqG6ISa5pys5YiZ5omn6KGM6ISa5pysXG5cdFx0aWYgb3cuZmllbGRfbWFwX3NjcmlwdFxuXHRcdFx0Xy5leHRlbmQodmFsdWVzLCB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmV2YWxGaWVsZE1hcFNjcmlwdChvdy5maWVsZF9tYXBfc2NyaXB0LCBvYmplY3ROYW1lLCBzcGFjZUlkLCByZWNvcmRJZCkpXG5cblx0IyDov4fmu6Tmjol2YWx1ZXPkuK3nmoTpnZ7ms5VrZXlcblx0ZmlsdGVyVmFsdWVzID0ge31cblx0Xy5lYWNoIF8ua2V5cyh2YWx1ZXMpLCAoaykgLT5cblx0XHRpZiBmaWVsZENvZGVzLmluY2x1ZGVzKGspXG5cdFx0XHRmaWx0ZXJWYWx1ZXNba10gPSB2YWx1ZXNba11cblxuXHRyZXR1cm4gZmlsdGVyVmFsdWVzXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0ID0gKGZpZWxkX21hcF9zY3JpcHQsIG9iamVjdE5hbWUsIHNwYWNlSWQsIG9iamVjdElkKSAtPlxuXHQjIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKG9iamVjdElkKVxuXHRyZWNvcmQgPSBvYmplY3RGaW5kT25lKG9iamVjdE5hbWUsIHsgZmlsdGVyczogW1snX2lkJywgJz0nLCBvYmplY3RJZF1dIH0pXG5cdHNjcmlwdCA9IFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocmVjb3JkKSB7IFwiICsgZmllbGRfbWFwX3NjcmlwdCArIFwiIH1cIlxuXHRmdW5jID0gX2V2YWwoc2NyaXB0LCBcImZpZWxkX21hcF9zY3JpcHRcIilcblx0dmFsdWVzID0gZnVuYyhyZWNvcmQpXG5cdGlmIF8uaXNPYmplY3QgdmFsdWVzXG5cdFx0cmV0dXJuIHZhbHVlc1xuXHRlbHNlXG5cdFx0Y29uc29sZS5lcnJvciBcImV2YWxGaWVsZE1hcFNjcmlwdDog6ISa5pys6L+U5Zue5YC857G75Z6L5LiN5piv5a+56LGhXCJcblx0cmV0dXJuIHt9XG5cblxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoID0gKHJlY29yZElkcywgc3BhY2VJZCwgaW5zSWQsIGFwcHJvdmVJZCkgLT5cblxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zWydjbXNfZmlsZXMnXS5maW5kKHtcblx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRwYXJlbnQ6IHJlY29yZElkc1xuXHR9KS5mb3JFYWNoIChjZikgLT5cblx0XHRfLmVhY2ggY2YudmVyc2lvbnMsICh2ZXJzaW9uSWQsIGlkeCkgLT5cblx0XHRcdGYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zWydjZnMuZmlsZXMuZmlsZXJlY29yZCddLmZpbmRPbmUodmVyc2lvbklkKVxuXHRcdFx0bmV3RmlsZSA9IG5ldyBGUy5GaWxlKClcblxuXHRcdFx0bmV3RmlsZS5hdHRhY2hEYXRhIGYuY3JlYXRlUmVhZFN0cmVhbSgnZmlsZXMnKSwge1xuXHRcdFx0XHRcdHR5cGU6IGYub3JpZ2luYWwudHlwZVxuXHRcdFx0fSwgKGVycikgLT5cblx0XHRcdFx0aWYgKGVycilcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbilcblxuXHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpXG5cdFx0XHRcdG5ld0ZpbGUuc2l6ZShmLnNpemUoKSlcblx0XHRcdFx0bWV0YWRhdGEgPSB7XG5cdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXG5cdFx0XHRcdFx0b3duZXJfbmFtZTogZi5tZXRhZGF0YS5vd25lcl9uYW1lLFxuXHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkLFxuXHRcdFx0XHRcdGluc3RhbmNlOiBpbnNJZCxcblx0XHRcdFx0XHRhcHByb3ZlOiBhcHByb3ZlSWRcblx0XHRcdFx0XHRwYXJlbnQ6IGNmLl9pZFxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgaWR4IGlzIDBcblx0XHRcdFx0XHRtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZVxuXG5cdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YVxuXHRcdFx0XHRjZnMuaW5zdGFuY2VzLmluc2VydChuZXdGaWxlKVxuXG5cdHJldHVyblxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvID0gKHJlY29yZElkcywgaW5zSWQsIHNwYWNlSWQpIC0+XG5cdCMgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlY29yZElkcy5vLCBzcGFjZUlkKS51cGRhdGUocmVjb3JkSWRzLmlkc1swXSwge1xuXHQjIFx0JHB1c2g6IHtcblx0IyBcdFx0aW5zdGFuY2VzOiB7XG5cdCMgXHRcdFx0JGVhY2g6IFt7XG5cdCMgXHRcdFx0XHRfaWQ6IGluc0lkLFxuXHQjIFx0XHRcdFx0c3RhdGU6ICdkcmFmdCdcblx0IyBcdFx0XHR9XSxcblx0IyBcdFx0XHQkcG9zaXRpb246IDBcblx0IyBcdFx0fVxuXHQjIFx0fSxcblx0IyBcdCRzZXQ6IHtcblx0IyBcdFx0bG9ja2VkOiB0cnVlXG5cdCMgXHRcdGluc3RhbmNlX3N0YXRlOiAnZHJhZnQnXG5cdCMgXHR9XG5cdCMgfSlcblx0b2JqZWN0VXBkYXRlKHJlY29yZElkcy5vLCByZWNvcmRJZHMuaWRzWzBdLCB7XG5cdFx0aW5zdGFuY2VzOiBbe1xuXHRcdFx0X2lkOiBpbnNJZCxcblx0XHRcdHN0YXRlOiAnZHJhZnQnXG5cdFx0fV0sXG5cdFx0bG9ja2VkOiB0cnVlLFxuXHRcdGluc3RhbmNlX3N0YXRlOiAnZHJhZnQnXG5cdH0pXG5cblx0cmV0dXJuXG5cblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlbGF0ZWRSZWNvcmRJbnN0YW5jZUluZm8gPSAocmVsYXRlZFRhYmxlc0luZm8sIGluc0lkLCBzcGFjZUlkKSAtPlxuXHRfLmVhY2ggcmVsYXRlZFRhYmxlc0luZm8sICh0YWJsZUl0ZW1zLCByZWxhdGVkT2JqZWN0TmFtZSkgLT5cblx0XHRyZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZClcblx0XHRfLmVhY2ggdGFibGVJdGVtcywgKGl0ZW0pIC0+XG5cdFx0XHRyZWxhdGVkQ29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKGl0ZW0uX3RhYmxlLl9pZCwge1xuXHRcdFx0XHQkc2V0OiB7XG5cdFx0XHRcdFx0aW5zdGFuY2VzOiBbe1xuXHRcdFx0XHRcdFx0X2lkOiBpbnNJZCxcblx0XHRcdFx0XHRcdHN0YXRlOiAnZHJhZnQnXG5cdFx0XHRcdFx0fV0sXG5cdFx0XHRcdFx0X3RhYmxlOiBpdGVtLl90YWJsZVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXG5cdHJldHVyblxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsID0gKHJlY29yZElkcywgc3BhY2VJZCkgLT5cblx0IyByZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLmZpbmRPbmUoe1xuXHQjIFx0X2lkOiByZWNvcmRJZHMuaWRzWzBdLCBpbnN0YW5jZXM6IHsgJGV4aXN0czogdHJ1ZSB9XG5cdCMgfSwgeyBmaWVsZHM6IHsgaW5zdGFuY2VzOiAxIH0gfSlcblx0cmVjb3JkID0gb2JqZWN0RmluZE9uZShyZWNvcmRJZHMubywgeyBmaWx0ZXJzOiBbWydfaWQnLCAnPScsIHJlY29yZElkcy5pZHNbMF1dXSwgZmllbGRzOiBbJ2luc3RhbmNlcyddIH0pXG5cblx0aWYgcmVjb3JkIGFuZCByZWNvcmQuaW5zdGFuY2VzIGFuZCByZWNvcmQuaW5zdGFuY2VzWzBdLnN0YXRlIGlzbnQgJ2NvbXBsZXRlZCcgYW5kIENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmZpbmQocmVjb3JkLmluc3RhbmNlc1swXS5faWQpLmNvdW50KCkgPiAwXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmraTorrDlvZXlt7Llj5HotbfmtYHnqIvmraPlnKjlrqHmibnkuK3vvIzlvoXlrqHmibnnu5PmnZ/mlrnlj6/lj5HotbfkuIvkuIDmrKHlrqHmibnvvIFcIilcblxuXHRyZXR1cm5cblxuIiwidmFyIF9ldmFsLCBnZXRPYmplY3RDb25maWcsIGdldE9iamVjdE5hbWVGaWVsZEtleSwgZ2V0UmVsYXRlZHMsIG9iamVjdEZpbmQsIG9iamVjdEZpbmRPbmUsIG9iamVjdFVwZGF0ZSwgb2JqZWN0cWw7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbl9ldmFsID0gcmVxdWlyZSgnZXZhbCcpO1xuXG5vYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJyk7XG5cbmdldE9iamVjdENvbmZpZyA9IGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUpIHtcbiAgcmV0dXJuIG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS50b0NvbmZpZygpO1xufTtcblxuZ2V0T2JqZWN0TmFtZUZpZWxkS2V5ID0gZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSkge1xuICByZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLk5BTUVfRklFTERfS0VZO1xufTtcblxuZ2V0UmVsYXRlZHMgPSBmdW5jdGlvbihvYmplY3RBcGlOYW1lKSB7XG4gIHJldHVybiBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUsIGNiKSB7XG4gICAgcmV0dXJuIG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS5nZXRSZWxhdGVkcygpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfSkob2JqZWN0QXBpTmFtZSk7XG59O1xuXG5vYmplY3RGaW5kT25lID0gZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSwgcXVlcnkpIHtcbiAgcmV0dXJuIE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSwgcXVlcnksIGNiKSB7XG4gICAgcmV0dXJuIG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS5maW5kKHF1ZXJ5KS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgaWYgKHJlc29sdmUgJiYgcmVzb2x2ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmVbMF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNiKHJlamVjdCwgbnVsbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pKG9iamVjdEFwaU5hbWUsIHF1ZXJ5KTtcbn07XG5cbm9iamVjdEZpbmQgPSBmdW5jdGlvbihvYmplY3RBcGlOYW1lLCBxdWVyeSkge1xuICByZXR1cm4gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihvYmplY3RBcGlOYW1lLCBxdWVyeSwgY2IpIHtcbiAgICByZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLmZpbmQocXVlcnkpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfSkob2JqZWN0QXBpTmFtZSwgcXVlcnkpO1xufTtcblxub2JqZWN0VXBkYXRlID0gZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSwgaWQsIGRhdGEpIHtcbiAgcmV0dXJuIE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSwgaWQsIGRhdGEsIGNiKSB7XG4gICAgcmV0dXJuIG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS51cGRhdGUoaWQsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfSkob2JqZWN0QXBpTmFtZSwgaWQsIGRhdGEpO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24gPSBmdW5jdGlvbihyZXEpIHtcbiAgdmFyIGF1dGhUb2tlbiwgaGFzaGVkVG9rZW4sIHF1ZXJ5LCB1c2VyLCB1c2VySWQ7XG4gIHF1ZXJ5ID0gcmVxLnF1ZXJ5O1xuICB1c2VySWQgPSBxdWVyeVtcIlgtVXNlci1JZFwiXTtcbiAgYXV0aFRva2VuID0gcXVlcnlbXCJYLUF1dGgtVG9rZW5cIl07XG4gIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgX2lkOiB1c2VySWQsXG4gICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgfSk7XG4gIGlmICghdXNlcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgcmV0dXJuIHVzZXI7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgdmFyIHNwYWNlO1xuICBzcGFjZSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpO1xuICBpZiAoIXNwYWNlKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJzcGFjZV9pZOacieivr+aIluatpHNwYWNl5bey57uP6KKr5Yig6ZmkXCIpO1xuICB9XG4gIHJldHVybiBzcGFjZTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyA9IGZ1bmN0aW9uKGZsb3dfaWQpIHtcbiAgdmFyIGZsb3c7XG4gIGZsb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZsb3dzLmZpbmRPbmUoZmxvd19pZCk7XG4gIGlmICghZmxvdykge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwiaWTmnInor6/miJbmraTmtYHnqIvlt7Lnu4/ooqvliKDpmaRcIik7XG4gIH1cbiAgcmV0dXJuIGZsb3c7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlciA9IGZ1bmN0aW9uKHNwYWNlX2lkLCB1c2VyX2lkKSB7XG4gIHZhciBzcGFjZV91c2VyO1xuICBzcGFjZV91c2VyID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdXNlcjogdXNlcl9pZFxuICB9KTtcbiAgaWYgKCFzcGFjZV91c2VyKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJ1c2VyX2lk5a+55bqU55qE55So5oi35LiN5bGe5LqO5b2T5YmNc3BhY2VcIik7XG4gIH1cbiAgcmV0dXJuIHNwYWNlX3VzZXI7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8gPSBmdW5jdGlvbihzcGFjZV91c2VyKSB7XG4gIHZhciBpbmZvLCBvcmc7XG4gIGluZm8gPSBuZXcgT2JqZWN0O1xuICBpbmZvLm9yZ2FuaXphdGlvbiA9IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uO1xuICBvcmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9yZ2FuaXphdGlvbnMuZmluZE9uZShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbiwge1xuICAgIGZpZWxkczoge1xuICAgICAgbmFtZTogMSxcbiAgICAgIGZ1bGxuYW1lOiAxXG4gICAgfVxuICB9KTtcbiAgaW5mby5vcmdhbml6YXRpb25fbmFtZSA9IG9yZy5uYW1lO1xuICBpbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IG9yZy5mdWxsbmFtZTtcbiAgcmV0dXJuIGluZm87XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd0VuYWJsZWQgPSBmdW5jdGlvbihmbG93KSB7XG4gIGlmIChmbG93LnN0YXRlICE9PSBcImVuYWJsZWRcIikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5pyq5ZCv55SoLOaTjeS9nOWksei0pVwiKTtcbiAgfVxufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQgPSBmdW5jdGlvbihmbG93LCBzcGFjZV9pZCkge1xuICBpZiAoZmxvdy5zcGFjZSAhPT0gc3BhY2VfaWQpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+WSjOW3peS9nOWMuklE5LiN5Yy56YWNXCIpO1xuICB9XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZvcm0gPSBmdW5jdGlvbihmb3JtX2lkKSB7XG4gIHZhciBmb3JtO1xuICBmb3JtID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5mb3Jtcy5maW5kT25lKGZvcm1faWQpO1xuICBpZiAoIWZvcm0pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn6KGo5Y2VSUTmnInor6/miJbmraTooajljZXlt7Lnu4/ooqvliKDpmaQnKTtcbiAgfVxuICByZXR1cm4gZm9ybTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Q2F0ZWdvcnkgPSBmdW5jdGlvbihjYXRlZ29yeV9pZCkge1xuICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5jYXRlZ29yaWVzLmZpbmRPbmUoY2F0ZWdvcnlfaWQpO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja1N5bmNEaXJlY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmxvd19pZCkge1xuICB2YXIgb3csIHN5bmNEaXJlY3Rpb247XG4gIG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3Rfd29ya2Zsb3dzLmZpbmRPbmUoe1xuICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICBmbG93X2lkOiBmbG93X2lkXG4gIH0pO1xuICBpZiAoIW93KSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+acquaJvuWIsOWvueixoea1geeoi+aYoOWwhOiusOW9leOAgicpO1xuICB9XG4gIHN5bmNEaXJlY3Rpb24gPSBvdy5zeW5jX2RpcmVjdGlvbiB8fCAnYm90aCc7XG4gIGlmICghWydib3RoJywgJ29ial90b19pbnMnXS5pbmNsdWRlcyhzeW5jRGlyZWN0aW9uKSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsICfkuI3mlK/mjIHnmoTlkIzmraXmlrnlkJHjgIInKTtcbiAgfVxufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UgPSBmdW5jdGlvbihpbnN0YW5jZV9mcm9tX2NsaWVudCwgdXNlcl9pbmZvKSB7XG4gIHZhciBhcHByX29iaiwgYXBwcm92ZV9mcm9tX2NsaWVudCwgY2F0ZWdvcnksIGZsb3csIGZsb3dfaWQsIGZvcm0sIGluc19vYmosIG5ld19pbnNfaWQsIG5vdywgcGVybWlzc2lvbnMsIHJlbGF0ZWRUYWJsZXNJbmZvLCBzcGFjZSwgc3BhY2VfaWQsIHNwYWNlX3VzZXIsIHNwYWNlX3VzZXJfb3JnX2luZm8sIHN0YXJ0X3N0ZXAsIHRyYWNlX2Zyb21fY2xpZW50LCB0cmFjZV9vYmosIHVzZXJfaWQ7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdLCBTdHJpbmcpO1xuICBjaGVjayhpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdLCBTdHJpbmcpO1xuICBjaGVjayhpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl0sIFN0cmluZyk7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXSwgW1xuICAgIHtcbiAgICAgIG86IFN0cmluZyxcbiAgICAgIGlkczogW1N0cmluZ11cbiAgICB9XG4gIF0pO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrU3luY0RpcmVjdGlvbihpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl1bMF0ubywgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdKTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja0lzSW5BcHByb3ZhbChpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl1bMF0sIGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0pO1xuICBzcGFjZV9pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl07XG4gIGZsb3dfaWQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl07XG4gIHVzZXJfaWQgPSB1c2VyX2luZm8uX2lkO1xuICB0cmFjZV9mcm9tX2NsaWVudCA9IG51bGw7XG4gIGFwcHJvdmVfZnJvbV9jbGllbnQgPSBudWxsO1xuICBpZiAoaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl0gJiYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF0pIHtcbiAgICB0cmFjZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdO1xuICAgIGlmICh0cmFjZV9mcm9tX2NsaWVudFtcImFwcHJvdmVzXCJdICYmIHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl1bMF0pIHtcbiAgICAgIGFwcHJvdmVfZnJvbV9jbGllbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXVtcImFwcHJvdmVzXCJdWzBdO1xuICAgIH1cbiAgfVxuICBzcGFjZSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2Uoc3BhY2VfaWQpO1xuICBmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpO1xuICBzcGFjZV91c2VyID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXIoc3BhY2VfaWQsIHVzZXJfaWQpO1xuICBzcGFjZV91c2VyX29yZ19pbmZvID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXJPcmdJbmZvKHNwYWNlX3VzZXIpO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd0VuYWJsZWQoZmxvdyk7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93U3BhY2VNYXRjaGVkKGZsb3csIHNwYWNlX2lkKTtcbiAgZm9ybSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybShmbG93LmZvcm0pO1xuICBwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93X2lkLCB1c2VyX2lkKTtcbiAgaWYgKCFwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkZFwiKSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5b2T5YmN55So5oi35rKh5pyJ5q2k5rWB56iL55qE5paw5bu65p2D6ZmQXCIpO1xuICB9XG4gIG5vdyA9IG5ldyBEYXRlO1xuICBpbnNfb2JqID0ge307XG4gIGluc19vYmouX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuX21ha2VOZXdJRCgpO1xuICBpbnNfb2JqLnNwYWNlID0gc3BhY2VfaWQ7XG4gIGluc19vYmouZmxvdyA9IGZsb3dfaWQ7XG4gIGluc19vYmouZmxvd192ZXJzaW9uID0gZmxvdy5jdXJyZW50Ll9pZDtcbiAgaW5zX29iai5mb3JtID0gZmxvdy5mb3JtO1xuICBpbnNfb2JqLmZvcm1fdmVyc2lvbiA9IGZsb3cuY3VycmVudC5mb3JtX3ZlcnNpb247XG4gIGluc19vYmoubmFtZSA9IGZsb3cubmFtZTtcbiAgaW5zX29iai5zdWJtaXR0ZXIgPSB1c2VyX2lkO1xuICBpbnNfb2JqLnN1Ym1pdHRlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWU7XG4gIGluc19vYmouYXBwbGljYW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA6IHVzZXJfaWQ7XG4gIGluc19vYmouYXBwbGljYW50X25hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA6IHVzZXJfaW5mby5uYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb24gPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25cIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25cIl0gOiBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbjtcbiAgaW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdIDogc3BhY2VfdXNlcl9vcmdfaW5mby5vcmdhbml6YXRpb25fbmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdIDogc3BhY2VfdXNlcl9vcmdfaW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWU7XG4gIGluc19vYmouYXBwbGljYW50X2NvbXBhbnkgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfY29tcGFueVwiXSA6IHNwYWNlX3VzZXIuY29tcGFueV9pZDtcbiAgaW5zX29iai5zdGF0ZSA9ICdkcmFmdCc7XG4gIGluc19vYmouY29kZSA9ICcnO1xuICBpbnNfb2JqLmlzX2FyY2hpdmVkID0gZmFsc2U7XG4gIGluc19vYmouaXNfZGVsZXRlZCA9IGZhbHNlO1xuICBpbnNfb2JqLmNyZWF0ZWQgPSBub3c7XG4gIGluc19vYmouY3JlYXRlZF9ieSA9IHVzZXJfaWQ7XG4gIGluc19vYmoubW9kaWZpZWQgPSBub3c7XG4gIGluc19vYmoubW9kaWZpZWRfYnkgPSB1c2VyX2lkO1xuICBpbnNfb2JqLnJlY29yZF9pZHMgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl07XG4gIGlmIChzcGFjZV91c2VyLmNvbXBhbnlfaWQpIHtcbiAgICBpbnNfb2JqLmNvbXBhbnlfaWQgPSBzcGFjZV91c2VyLmNvbXBhbnlfaWQ7XG4gIH1cbiAgdHJhY2Vfb2JqID0ge307XG4gIHRyYWNlX29iai5faWQgPSBuZXcgTW9uZ28uT2JqZWN0SUQoKS5fc3RyO1xuICB0cmFjZV9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZDtcbiAgdHJhY2Vfb2JqLmlzX2ZpbmlzaGVkID0gZmFsc2U7XG4gIHN0YXJ0X3N0ZXAgPSBfLmZpbmQoZmxvdy5jdXJyZW50LnN0ZXBzLCBmdW5jdGlvbihzdGVwKSB7XG4gICAgcmV0dXJuIHN0ZXAuc3RlcF90eXBlID09PSAnc3RhcnQnO1xuICB9KTtcbiAgdHJhY2Vfb2JqLnN0ZXAgPSBzdGFydF9zdGVwLl9pZDtcbiAgdHJhY2Vfb2JqLm5hbWUgPSBzdGFydF9zdGVwLm5hbWU7XG4gIHRyYWNlX29iai5zdGFydF9kYXRlID0gbm93O1xuICBhcHByX29iaiA9IHt9O1xuICBhcHByX29iai5faWQgPSBuZXcgTW9uZ28uT2JqZWN0SUQoKS5fc3RyO1xuICBhcHByX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkO1xuICBhcHByX29iai50cmFjZSA9IHRyYWNlX29iai5faWQ7XG4gIGFwcHJfb2JqLmlzX2ZpbmlzaGVkID0gZmFsc2U7XG4gIGFwcHJfb2JqLnVzZXIgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIDogdXNlcl9pZDtcbiAgYXBwcl9vYmoudXNlcl9uYW1lID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gOiB1c2VyX2luZm8ubmFtZTtcbiAgYXBwcl9vYmouaGFuZGxlciA9IHVzZXJfaWQ7XG4gIGFwcHJfb2JqLmhhbmRsZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lO1xuICBhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbiA9IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uO1xuICBhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9uYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5uYW1lO1xuICBhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IHNwYWNlX3VzZXJfb3JnX2luZm8uZnVsbG5hbWU7XG4gIGFwcHJfb2JqLnR5cGUgPSAnZHJhZnQnO1xuICBhcHByX29iai5zdGFydF9kYXRlID0gbm93O1xuICBhcHByX29iai5yZWFkX2RhdGUgPSBub3c7XG4gIGFwcHJfb2JqLmlzX3JlYWQgPSB0cnVlO1xuICBhcHByX29iai5pc19lcnJvciA9IGZhbHNlO1xuICBhcHByX29iai5kZXNjcmlwdGlvbiA9ICcnO1xuICByZWxhdGVkVGFibGVzSW5mbyA9IHt9O1xuICBhcHByX29iai52YWx1ZXMgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlVmFsdWVzKGluc19vYmoucmVjb3JkX2lkc1swXSwgZmxvd19pZCwgc3BhY2VfaWQsIGZvcm0uY3VycmVudC5maWVsZHMsIHJlbGF0ZWRUYWJsZXNJbmZvKTtcbiAgdHJhY2Vfb2JqLmFwcHJvdmVzID0gW2FwcHJfb2JqXTtcbiAgaW5zX29iai50cmFjZXMgPSBbdHJhY2Vfb2JqXTtcbiAgaW5zX29iai52YWx1ZXMgPSBhcHByX29iai52YWx1ZXM7XG4gIGluc19vYmouaW5ib3hfdXNlcnMgPSBpbnN0YW5jZV9mcm9tX2NsaWVudC5pbmJveF91c2VycyB8fCBbXTtcbiAgaW5zX29iai5jdXJyZW50X3N0ZXBfbmFtZSA9IHN0YXJ0X3N0ZXAubmFtZTtcbiAgaWYgKGZsb3cuYXV0b19yZW1pbmQgPT09IHRydWUpIHtcbiAgICBpbnNfb2JqLmF1dG9fcmVtaW5kID0gdHJ1ZTtcbiAgfVxuICBpbnNfb2JqLmZsb3dfbmFtZSA9IGZsb3cubmFtZTtcbiAgaWYgKGZvcm0uY2F0ZWdvcnkpIHtcbiAgICBjYXRlZ29yeSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Q2F0ZWdvcnkoZm9ybS5jYXRlZ29yeSk7XG4gICAgaWYgKGNhdGVnb3J5KSB7XG4gICAgICBpbnNfb2JqLmNhdGVnb3J5X25hbWUgPSBjYXRlZ29yeS5uYW1lO1xuICAgICAgaW5zX29iai5jYXRlZ29yeSA9IGNhdGVnb3J5Ll9pZDtcbiAgICB9XG4gIH1cbiAgbmV3X2luc19pZCA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmluc2VydChpbnNfb2JqKTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlY29yZEluc3RhbmNlSW5mbyhpbnNfb2JqLnJlY29yZF9pZHNbMF0sIG5ld19pbnNfaWQsIHNwYWNlX2lkKTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZUF0dGFjaChpbnNfb2JqLnJlY29yZF9pZHNbMF0sIHNwYWNlX2lkLCBpbnNfb2JqLl9pZCwgYXBwcl9vYmouX2lkKTtcbiAgcmV0dXJuIG5ld19pbnNfaWQ7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlVmFsdWVzID0gZnVuY3Rpb24ocmVjb3JkSWRzLCBmbG93SWQsIHNwYWNlSWQsIGZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pIHtcbiAgdmFyIGZpZWxkQ29kZXMsIGZpbHRlclZhbHVlcywgZmxvdywgZm9ybSwgZm9ybUZpZWxkcywgZm9ybVRhYmxlRmllbGRzLCBmb3JtVGFibGVGaWVsZHNDb2RlLCBnZXRGaWVsZE9kYXRhVmFsdWUsIGdldEZvcm1GaWVsZCwgZ2V0Rm9ybVRhYmxlRmllbGQsIGdldEZvcm1UYWJsZUZpZWxkQ29kZSwgZ2V0Rm9ybVRhYmxlU3ViRmllbGQsIGdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUsIGdldFNlbGVjdE9yZ1ZhbHVlLCBnZXRTZWxlY3RPcmdWYWx1ZXMsIGdldFNlbGVjdFVzZXJWYWx1ZSwgZ2V0U2VsZWN0VXNlclZhbHVlcywgb2JqZWN0LCBvYmplY3ROYW1lLCBvdywgcmVjb3JkLCByZWNvcmRJZCwgcmVmLCByZWxhdGVkT2JqZWN0cywgcmVsYXRlZE9iamVjdHNLZXlzLCB0YWJsZUZpZWxkQ29kZXMsIHRhYmxlRmllbGRNYXAsIHRhYmxlVG9SZWxhdGVkTWFwLCB2YWx1ZXM7XG4gIGZpZWxkQ29kZXMgPSBbXTtcbiAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgIGlmIChmLnR5cGUgPT09ICdzZWN0aW9uJykge1xuICAgICAgcmV0dXJuIF8uZWFjaChmLmZpZWxkcywgZnVuY3Rpb24oZmYpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkQ29kZXMucHVzaChmZi5jb2RlKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmllbGRDb2Rlcy5wdXNoKGYuY29kZSk7XG4gICAgfVxuICB9KTtcbiAgdmFsdWVzID0ge307XG4gIG9iamVjdE5hbWUgPSByZWNvcmRJZHMubztcbiAgb2JqZWN0ID0gZ2V0T2JqZWN0Q29uZmlnKG9iamVjdE5hbWUpO1xuICByZWNvcmRJZCA9IHJlY29yZElkcy5pZHNbMF07XG4gIG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3Rfd29ya2Zsb3dzLmZpbmRPbmUoe1xuICAgIG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxuICAgIGZsb3dfaWQ6IGZsb3dJZFxuICB9KTtcbiAgcmVjb3JkID0gb2JqZWN0RmluZE9uZShvYmplY3ROYW1lLCB7XG4gICAgZmlsdGVyczogW1snX2lkJywgJz0nLCByZWNvcmRJZF1dXG4gIH0pO1xuICBmbG93ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoZmxvd0lkLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBmb3JtOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKG93ICYmIHJlY29yZCkge1xuICAgIGZvcm0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJmb3Jtc1wiKS5maW5kT25lKGZsb3cuZm9ybSk7XG4gICAgZm9ybUZpZWxkcyA9IGZvcm0uY3VycmVudC5maWVsZHMgfHwgW107XG4gICAgcmVsYXRlZE9iamVjdHMgPSBnZXRSZWxhdGVkcyhvYmplY3ROYW1lKTtcbiAgICByZWxhdGVkT2JqZWN0c0tleXMgPSBfLnBsdWNrKHJlbGF0ZWRPYmplY3RzLCAnb2JqZWN0X25hbWUnKTtcbiAgICBmb3JtVGFibGVGaWVsZHMgPSBfLmZpbHRlcihmb3JtRmllbGRzLCBmdW5jdGlvbihmb3JtRmllbGQpIHtcbiAgICAgIHJldHVybiBmb3JtRmllbGQudHlwZSA9PT0gJ3RhYmxlJztcbiAgICB9KTtcbiAgICBmb3JtVGFibGVGaWVsZHNDb2RlID0gXy5wbHVjayhmb3JtVGFibGVGaWVsZHMsICdjb2RlJyk7XG4gICAgZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIF8uZmluZChyZWxhdGVkT2JqZWN0c0tleXMsIGZ1bmN0aW9uKHJlbGF0ZWRPYmplY3RzS2V5KSB7XG4gICAgICAgIHJldHVybiBrZXkuc3RhcnRzV2l0aChyZWxhdGVkT2JqZWN0c0tleSArICcuJyk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGdldEZvcm1UYWJsZUZpZWxkQ29kZSA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIF8uZmluZChmb3JtVGFibGVGaWVsZHNDb2RlLCBmdW5jdGlvbihmb3JtVGFibGVGaWVsZENvZGUpIHtcbiAgICAgICAgcmV0dXJuIGtleS5zdGFydHNXaXRoKGZvcm1UYWJsZUZpZWxkQ29kZSArICcuJyk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGdldEZvcm1UYWJsZUZpZWxkID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKGZvcm1UYWJsZUZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgICAgICByZXR1cm4gZi5jb2RlID09PSBrZXk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGdldEZvcm1GaWVsZCA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIGZmO1xuICAgICAgZmYgPSBudWxsO1xuICAgICAgXy5mb3JFYWNoKGZvcm1GaWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgaWYgKGZmKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmLnR5cGUgPT09ICdzZWN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBmZiA9IF8uZmluZChmLmZpZWxkcywgZnVuY3Rpb24oc2YpIHtcbiAgICAgICAgICAgIHJldHVybiBzZi5jb2RlID09PSBrZXk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZi5jb2RlID09PSBrZXkpIHtcbiAgICAgICAgICByZXR1cm4gZmYgPSBmO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmZjtcbiAgICB9O1xuICAgIGdldEZvcm1UYWJsZVN1YkZpZWxkID0gZnVuY3Rpb24odGFibGVGaWVsZCwgc3ViRmllbGRDb2RlKSB7XG4gICAgICByZXR1cm4gXy5maW5kKHRhYmxlRmllbGQuZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgIHJldHVybiBmLmNvZGUgPT09IHN1YkZpZWxkQ29kZTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0RmllbGRPZGF0YVZhbHVlID0gZnVuY3Rpb24ob2JqTmFtZSwgaWQsIHJlZmVyZW5jZVRvRmllbGROYW1lKSB7XG4gICAgICB2YXIgX3JlY29yZCwgX3JlY29yZHMsIG5hbWVLZXksIG9iajtcbiAgICAgIG9iaiA9IG9iamVjdHFsLmdldE9iamVjdChvYmpOYW1lKTtcbiAgICAgIG5hbWVLZXkgPSBnZXRPYmplY3ROYW1lRmllbGRLZXkob2JqTmFtZSk7XG4gICAgICBpZiAoIW9iaikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoXy5pc1N0cmluZyhpZCkpIHtcbiAgICAgICAgX3JlY29yZCA9IG9iamVjdEZpbmRPbmUob2JqTmFtZSwge1xuICAgICAgICAgIGZpbHRlcnM6IFtbcmVmZXJlbmNlVG9GaWVsZE5hbWUsICc9JywgaWRdXVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKF9yZWNvcmQpIHtcbiAgICAgICAgICBfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmRbbmFtZUtleV07XG4gICAgICAgICAgcmV0dXJuIF9yZWNvcmQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoXy5pc0FycmF5KGlkKSkge1xuICAgICAgICBfcmVjb3JkcyA9IFtdO1xuICAgICAgICBvYmplY3RGaW5kKG9iak5hbWUsIHtcbiAgICAgICAgICBmaWx0ZXJzOiBbW3JlZmVyZW5jZVRvRmllbGROYW1lLCAnaW4nLCBpZF1dXG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24oX3JlY29yZCkge1xuICAgICAgICAgIF9yZWNvcmRbJ0BsYWJlbCddID0gX3JlY29yZFtuYW1lS2V5XTtcbiAgICAgICAgICByZXR1cm4gX3JlY29yZHMucHVzaChfcmVjb3JkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghXy5pc0VtcHR5KF9yZWNvcmRzKSkge1xuICAgICAgICAgIHJldHVybiBfcmVjb3JkcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgZ2V0U2VsZWN0VXNlclZhbHVlID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gICAgICB2YXIgc3U7XG4gICAgICBzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgICBzdS5pZCA9IHVzZXJJZDtcbiAgICAgIHJldHVybiBzdTtcbiAgICB9O1xuICAgIGdldFNlbGVjdFVzZXJWYWx1ZXMgPSBmdW5jdGlvbih1c2VySWRzLCBzcGFjZUlkKSB7XG4gICAgICB2YXIgc3VzO1xuICAgICAgc3VzID0gW107XG4gICAgICBpZiAoXy5pc0FycmF5KHVzZXJJZHMpKSB7XG4gICAgICAgIF8uZWFjaCh1c2VySWRzLCBmdW5jdGlvbih1c2VySWQpIHtcbiAgICAgICAgICB2YXIgc3U7XG4gICAgICAgICAgc3UgPSBnZXRTZWxlY3RVc2VyVmFsdWUodXNlcklkLCBzcGFjZUlkKTtcbiAgICAgICAgICBpZiAoc3UpIHtcbiAgICAgICAgICAgIHJldHVybiBzdXMucHVzaChzdSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdXM7XG4gICAgfTtcbiAgICBnZXRTZWxlY3RPcmdWYWx1ZSA9IGZ1bmN0aW9uKG9yZ0lkLCBzcGFjZUlkKSB7XG4gICAgICB2YXIgb3JnO1xuICAgICAgb3JnID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZE9uZShvcmdJZCwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICBmdWxsbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG9yZy5pZCA9IG9yZ0lkO1xuICAgICAgcmV0dXJuIG9yZztcbiAgICB9O1xuICAgIGdldFNlbGVjdE9yZ1ZhbHVlcyA9IGZ1bmN0aW9uKG9yZ0lkcywgc3BhY2VJZCkge1xuICAgICAgdmFyIG9yZ3M7XG4gICAgICBvcmdzID0gW107XG4gICAgICBpZiAoXy5pc0FycmF5KG9yZ0lkcykpIHtcbiAgICAgICAgXy5lYWNoKG9yZ0lkcywgZnVuY3Rpb24ob3JnSWQpIHtcbiAgICAgICAgICB2YXIgb3JnO1xuICAgICAgICAgIG9yZyA9IGdldFNlbGVjdE9yZ1ZhbHVlKG9yZ0lkLCBzcGFjZUlkKTtcbiAgICAgICAgICBpZiAob3JnKSB7XG4gICAgICAgICAgICByZXR1cm4gb3Jncy5wdXNoKG9yZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcmdzO1xuICAgIH07XG4gICAgdGFibGVGaWVsZENvZGVzID0gW107XG4gICAgdGFibGVGaWVsZE1hcCA9IFtdO1xuICAgIHRhYmxlVG9SZWxhdGVkTWFwID0ge307XG4gICAgaWYgKChyZWYgPSBvdy5maWVsZF9tYXApICE9IG51bGwpIHtcbiAgICAgIHJlZi5mb3JFYWNoKGZ1bmN0aW9uKGZtKSB7XG4gICAgICAgIHZhciBmb3JtRmllbGQsIGZvcm1UYWJsZUZpZWxkQ29kZSwgZ3JpZENvZGUsIGxvb2t1cEZpZWxkTmFtZSwgbG9va3VwRmllbGRPYmosIGxvb2t1cE9iamVjdFJlY29yZCwgbG9va3VwU2VsZWN0RmllbGRWYWx1ZSwgb1RhYmxlQ29kZSwgb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLCBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGRDb2RlLCBvVGFibGVGaWVsZENvZGUsIG9iakZpZWxkLCBvYmplY3RGaWVsZCwgb2JqZWN0RmllbGROYW1lLCBvYmplY3RGaWVsZE9iamVjdE5hbWUsIG9iamVjdExvb2t1cEZpZWxkLCBvYmplY3RfZmllbGQsIG9kYXRhRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9Eb2MsIHJlZmVyZW5jZVRvRmllbGROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVsYXRlZE9iamVjdEZpZWxkQ29kZSwgc2VsZWN0RmllbGRWYWx1ZSwgdGFibGVUb1JlbGF0ZWRNYXBLZXksIHdUYWJsZUNvZGUsIHdvcmtmbG93X2ZpZWxkO1xuICAgICAgICBvYmplY3RfZmllbGQgPSBmbS5vYmplY3RfZmllbGQ7XG4gICAgICAgIHdvcmtmbG93X2ZpZWxkID0gZm0ud29ya2Zsb3dfZmllbGQ7XG4gICAgICAgIGlmICghb2JqZWN0X2ZpZWxkIHx8ICF3b3JrZmxvd19maWVsZCkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAn5pyq5om+5Yiw5a2X5q6177yM6K+35qOA5p+l5a+56LGh5rWB56iL5pig5bCE5a2X5q616YWN572uJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmVsYXRlZE9iamVjdEZpZWxkQ29kZSA9IGdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUob2JqZWN0X2ZpZWxkKTtcbiAgICAgICAgZm9ybVRhYmxlRmllbGRDb2RlID0gZ2V0Rm9ybVRhYmxlRmllbGRDb2RlKHdvcmtmbG93X2ZpZWxkKTtcbiAgICAgICAgb2JqRmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdF9maWVsZF07XG4gICAgICAgIGZvcm1GaWVsZCA9IGdldEZvcm1GaWVsZCh3b3JrZmxvd19maWVsZCk7XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0RmllbGRDb2RlKSB7XG4gICAgICAgICAgb1RhYmxlQ29kZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgIG9UYWJsZUZpZWxkQ29kZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgIHRhYmxlVG9SZWxhdGVkTWFwS2V5ID0gb1RhYmxlQ29kZTtcbiAgICAgICAgICBpZiAoIXRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSkge1xuICAgICAgICAgICAgdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmb3JtVGFibGVGaWVsZENvZGUpIHtcbiAgICAgICAgICAgIHdUYWJsZUNvZGUgPSB3b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgICAgdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldWydfRlJPTV9UQUJMRV9DT0RFJ10gPSB3VGFibGVDb2RlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldW29UYWJsZUZpZWxkQ29kZV0gPSB3b3JrZmxvd19maWVsZDtcbiAgICAgICAgfSBlbHNlIGlmICh3b3JrZmxvd19maWVsZC5pbmRleE9mKCcuJykgPiAwICYmIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA+IDApIHtcbiAgICAgICAgICB3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICBvVGFibGVDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJC4nKVswXTtcbiAgICAgICAgICBpZiAocmVjb3JkLmhhc093blByb3BlcnR5KG9UYWJsZUNvZGUpICYmIF8uaXNBcnJheShyZWNvcmRbb1RhYmxlQ29kZV0pKSB7XG4gICAgICAgICAgICB0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgIHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXG4gICAgICAgICAgICAgIG9iamVjdF90YWJsZV9maWVsZF9jb2RlOiBvVGFibGVDb2RlXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICByZXR1cm4gdGFibGVGaWVsZE1hcC5wdXNoKGZtKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG9UYWJsZUNvZGUuaW5kZXhPZignLicpID4gMCkge1xuICAgICAgICAgICAgb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkQ29kZSA9IG9UYWJsZUNvZGUuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIGdyaWRDb2RlID0gb1RhYmxlQ29kZS5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkID0gb2JqZWN0LmZpZWxkc1tvVGFibGVDb2RlUmVmZXJlbmNlRmllbGRDb2RlXTtcbiAgICAgICAgICAgIGlmIChvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgIGlmIChyZWNvcmRbb1RhYmxlQ29kZV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZE5hbWUgPSBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkIHx8ICdfaWQnO1xuICAgICAgICAgICAgICByZWZlcmVuY2VUb09iamVjdE5hbWUgPSBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSByZWNvcmRbb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLm5hbWVdO1xuICAgICAgICAgICAgICByZWZlcmVuY2VUb0RvYyA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9GaWVsZE5hbWUpO1xuICAgICAgICAgICAgICBpZiAocmVmZXJlbmNlVG9Eb2NbZ3JpZENvZGVdKSB7XG4gICAgICAgICAgICAgICAgcmVjb3JkW29UYWJsZUNvZGVdID0gcmVmZXJlbmNlVG9Eb2NbZ3JpZENvZGVdO1xuICAgICAgICAgICAgICAgIHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgIHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXG4gICAgICAgICAgICAgICAgICBvYmplY3RfdGFibGVfZmllbGRfY29kZTogb1RhYmxlQ29kZVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFibGVGaWVsZE1hcC5wdXNoKGZtKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChvYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gMCAmJiBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPT09IC0xKSB7XG4gICAgICAgICAgb2JqZWN0RmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgbG9va3VwRmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgaWYgKG9iamVjdCkge1xuICAgICAgICAgICAgb2JqZWN0RmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdEZpZWxkTmFtZV07XG4gICAgICAgICAgICBpZiAob2JqZWN0RmllbGQgJiYgZm9ybUZpZWxkICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgbG9va3VwT2JqZWN0UmVjb3JkID0gb2JqZWN0RmluZE9uZShvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8sIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzOiBbWydfaWQnLCAnPScsIHJlY29yZFtvYmplY3RGaWVsZE5hbWVdXV0sXG4gICAgICAgICAgICAgICAgZmllbGRzOiBbbG9va3VwRmllbGROYW1lXVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYgKCFsb29rdXBPYmplY3RSZWNvcmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb2JqZWN0RmllbGRPYmplY3ROYW1lID0gb2JqZWN0RmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICBsb29rdXBGaWVsZE9iaiA9IGdldE9iamVjdENvbmZpZyhvYmplY3RGaWVsZE9iamVjdE5hbWUpO1xuICAgICAgICAgICAgICBvYmplY3RMb29rdXBGaWVsZCA9IGxvb2t1cEZpZWxkT2JqLmZpZWxkc1tsb29rdXBGaWVsZE5hbWVdO1xuICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBsb29rdXBPYmplY3RSZWNvcmRbbG9va3VwRmllbGROYW1lXTtcbiAgICAgICAgICAgICAgaWYgKG9iamVjdExvb2t1cEZpZWxkICYmIGZvcm1GaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqZWN0TG9va3VwRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZE5hbWUgPSBvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQgfHwgJ19pZCc7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICAgIG9kYXRhRmllbGRWYWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAob2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAob2JqZWN0TG9va3VwRmllbGQgJiYgZm9ybUZpZWxkICYmIFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKGZvcm1GaWVsZC50eXBlKSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqZWN0TG9va3VwRmllbGQudHlwZSkgJiYgKFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90bykgfHwgKCdzcGFjZV91c2VycycgPT09IG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90byAmJiAndXNlcicgPT09IG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90b19maWVsZCkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgbG9va3VwU2VsZWN0RmllbGRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ3VzZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICBsb29rdXBTZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgbG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1GaWVsZC50eXBlID09PSAnZ3JvdXAnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICBsb29rdXBTZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIW9iamVjdExvb2t1cEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICBsb29rdXBTZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBsb29rdXBTZWxlY3RGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IGxvb2t1cE9iamVjdFJlY29yZFtsb29rdXBGaWVsZE5hbWVdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZE5hbWUgPSBvYmpGaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQgfHwgJ19pZCc7XG4gICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqRmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvYmpGaWVsZC5uYW1lXTtcbiAgICAgICAgICBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgICAgaWYgKG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb0ZpZWxkTmFtZSk7XG4gICAgICAgICAgfSBlbHNlIGlmICghb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb0ZpZWxkTmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gb2RhdGFGaWVsZFZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iakZpZWxkLnR5cGUpICYmIChbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pIHx8ICgnc3BhY2VfdXNlcnMnID09PSBvYmpGaWVsZC5yZWZlcmVuY2VfdG8gJiYgJ3VzZXInID09PSBvYmpGaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQpKSkge1xuICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvYmpGaWVsZC5uYW1lXTtcbiAgICAgICAgICBpZiAoIV8uaXNFbXB0eShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUpKSB7XG4gICAgICAgICAgICBzZWxlY3RGaWVsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKGZvcm1GaWVsZC50eXBlID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgaWYgKG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdncm91cCcpIHtcbiAgICAgICAgICAgICAgaWYgKG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZWN0RmllbGRWYWx1ZSkge1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHNlbGVjdEZpZWxkVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC5oYXNPd25Qcm9wZXJ0eShvYmplY3RfZmllbGQpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSByZWNvcmRbb2JqZWN0X2ZpZWxkXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIF8udW5pcSh0YWJsZUZpZWxkQ29kZXMpLmZvckVhY2goZnVuY3Rpb24odGZjKSB7XG4gICAgICB2YXIgYztcbiAgICAgIGMgPSBKU09OLnBhcnNlKHRmYyk7XG4gICAgICB2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXSA9IFtdO1xuICAgICAgcmV0dXJuIHJlY29yZFtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXS5mb3JFYWNoKGZ1bmN0aW9uKHRyKSB7XG4gICAgICAgIHZhciBuZXdUcjtcbiAgICAgICAgbmV3VHIgPSB7fTtcbiAgICAgICAgXy5lYWNoKHRyLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYmxlRmllbGRNYXAuZm9yRWFjaChmdW5jdGlvbih0Zm0pIHtcbiAgICAgICAgICAgIHZhciB3VGRDb2RlO1xuICAgICAgICAgICAgaWYgKHRmbS5vYmplY3RfZmllbGQgPT09IChjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlICsgJy4kLicgKyBrKSkge1xuICAgICAgICAgICAgICB3VGRDb2RlID0gdGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICAgIHJldHVybiBuZXdUclt3VGRDb2RlXSA9IHY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIV8uaXNFbXB0eShuZXdUcikpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWVzW2Mud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZV0ucHVzaChuZXdUcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIF8uZWFjaCh0YWJsZVRvUmVsYXRlZE1hcCwgZnVuY3Rpb24obWFwLCBrZXkpIHtcbiAgICAgIHZhciBmb3JtVGFibGVGaWVsZCwgcmVsYXRlZENvbGxlY3Rpb24sIHJlbGF0ZWRGaWVsZCwgcmVsYXRlZEZpZWxkTmFtZSwgcmVsYXRlZE9iamVjdCwgcmVsYXRlZE9iamVjdE5hbWUsIHJlbGF0ZWRSZWNvcmRzLCByZWxhdGVkVGFibGVJdGVtcywgc2VsZWN0b3IsIHRhYmxlQ29kZSwgdGFibGVWYWx1ZXM7XG4gICAgICB0YWJsZUNvZGUgPSBtYXAuX0ZST01fVEFCTEVfQ09ERTtcbiAgICAgIGZvcm1UYWJsZUZpZWxkID0gZ2V0Rm9ybVRhYmxlRmllbGQodGFibGVDb2RlKTtcbiAgICAgIGlmICghdGFibGVDb2RlKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oJ3RhYmxlVG9SZWxhdGVkOiBbJyArIGtleSArICddIG1pc3NpbmcgY29ycmVzcG9uZGluZyB0YWJsZS4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbGF0ZWRPYmplY3ROYW1lID0ga2V5O1xuICAgICAgICB0YWJsZVZhbHVlcyA9IFtdO1xuICAgICAgICByZWxhdGVkVGFibGVJdGVtcyA9IFtdO1xuICAgICAgICByZWxhdGVkT2JqZWN0ID0gZ2V0T2JqZWN0Q29uZmlnKHJlbGF0ZWRPYmplY3ROYW1lKTtcbiAgICAgICAgcmVsYXRlZEZpZWxkID0gXy5maW5kKHJlbGF0ZWRPYmplY3QuZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgcmV0dXJuIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhmLnR5cGUpICYmIGYucmVmZXJlbmNlX3RvID09PSBvYmplY3ROYW1lO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVsYXRlZEZpZWxkTmFtZSA9IHJlbGF0ZWRGaWVsZC5uYW1lO1xuICAgICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgICBzZWxlY3RvcltyZWxhdGVkRmllbGROYW1lXSA9IHJlY29yZElkO1xuICAgICAgICByZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCk7XG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZChzZWxlY3Rvcik7XG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2goZnVuY3Rpb24ocnIpIHtcbiAgICAgICAgICB2YXIgdGFibGVWYWx1ZUl0ZW07XG4gICAgICAgICAgdGFibGVWYWx1ZUl0ZW0gPSB7fTtcbiAgICAgICAgICBfLmVhY2gobWFwLCBmdW5jdGlvbih2YWx1ZUtleSwgZmllbGRLZXkpIHtcbiAgICAgICAgICAgIHZhciBmb3JtRmllbGQsIGZvcm1GaWVsZEtleSwgcmVmZXJlbmNlVG9GaWVsZE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWxhdGVkT2JqZWN0RmllbGQsIHRhYmxlRmllbGRWYWx1ZTtcbiAgICAgICAgICAgIGlmIChmaWVsZEtleSAhPT0gJ19GUk9NX1RBQkxFX0NPREUnKSB7XG4gICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZTtcbiAgICAgICAgICAgICAgZm9ybUZpZWxkS2V5O1xuICAgICAgICAgICAgICBpZiAodmFsdWVLZXkuc3RhcnRzV2l0aCh0YWJsZUNvZGUgKyAnLicpKSB7XG4gICAgICAgICAgICAgICAgZm9ybUZpZWxkS2V5ID0gKHZhbHVlS2V5LnNwbGl0KFwiLlwiKVsxXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9ybUZpZWxkS2V5ID0gdmFsdWVLZXk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZm9ybUZpZWxkID0gZ2V0Rm9ybVRhYmxlU3ViRmllbGQoZm9ybVRhYmxlRmllbGQsIGZvcm1GaWVsZEtleSk7XG4gICAgICAgICAgICAgIHJlbGF0ZWRPYmplY3RGaWVsZCA9IHJlbGF0ZWRPYmplY3QuZmllbGRzW2ZpZWxkS2V5XTtcbiAgICAgICAgICAgICAgaWYgKCFmb3JtRmllbGQgfHwgIXJlbGF0ZWRPYmplY3RGaWVsZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZE5hbWUgPSByZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkIHx8ICdfaWQnO1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcnJbZmllbGRLZXldO1xuICAgICAgICAgICAgICAgIGlmIChyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb0ZpZWxkTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKGZvcm1GaWVsZC50eXBlKSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcnJbZmllbGRLZXldO1xuICAgICAgICAgICAgICAgIGlmICghXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ3VzZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1GaWVsZC50eXBlID09PSAnZ3JvdXAnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBycltmaWVsZEtleV07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlVmFsdWVJdGVtW2Zvcm1GaWVsZEtleV0gPSB0YWJsZUZpZWxkVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKCFfLmlzRW1wdHkodGFibGVWYWx1ZUl0ZW0pKSB7XG4gICAgICAgICAgICB0YWJsZVZhbHVlSXRlbS5faWQgPSByci5faWQ7XG4gICAgICAgICAgICB0YWJsZVZhbHVlcy5wdXNoKHRhYmxlVmFsdWVJdGVtKTtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkVGFibGVJdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgX3RhYmxlOiB7XG4gICAgICAgICAgICAgICAgX2lkOiByci5faWQsXG4gICAgICAgICAgICAgICAgX2NvZGU6IHRhYmxlQ29kZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB2YWx1ZXNbdGFibGVDb2RlXSA9IHRhYmxlVmFsdWVzO1xuICAgICAgICByZXR1cm4gcmVsYXRlZFRhYmxlc0luZm9bcmVsYXRlZE9iamVjdE5hbWVdID0gcmVsYXRlZFRhYmxlSXRlbXM7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKG93LmZpZWxkX21hcF9zY3JpcHQpIHtcbiAgICAgIF8uZXh0ZW5kKHZhbHVlcywgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5ldmFsRmllbGRNYXBTY3JpcHQob3cuZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgcmVjb3JkSWQpKTtcbiAgICB9XG4gIH1cbiAgZmlsdGVyVmFsdWVzID0ge307XG4gIF8uZWFjaChfLmtleXModmFsdWVzKSwgZnVuY3Rpb24oaykge1xuICAgIGlmIChmaWVsZENvZGVzLmluY2x1ZGVzKGspKSB7XG4gICAgICByZXR1cm4gZmlsdGVyVmFsdWVzW2tdID0gdmFsdWVzW2tdO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmaWx0ZXJWYWx1ZXM7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmV2YWxGaWVsZE1hcFNjcmlwdCA9IGZ1bmN0aW9uKGZpZWxkX21hcF9zY3JpcHQsIG9iamVjdE5hbWUsIHNwYWNlSWQsIG9iamVjdElkKSB7XG4gIHZhciBmdW5jLCByZWNvcmQsIHNjcmlwdCwgdmFsdWVzO1xuICByZWNvcmQgPSBvYmplY3RGaW5kT25lKG9iamVjdE5hbWUsIHtcbiAgICBmaWx0ZXJzOiBbWydfaWQnLCAnPScsIG9iamVjdElkXV1cbiAgfSk7XG4gIHNjcmlwdCA9IFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocmVjb3JkKSB7IFwiICsgZmllbGRfbWFwX3NjcmlwdCArIFwiIH1cIjtcbiAgZnVuYyA9IF9ldmFsKHNjcmlwdCwgXCJmaWVsZF9tYXBfc2NyaXB0XCIpO1xuICB2YWx1ZXMgPSBmdW5jKHJlY29yZCk7XG4gIGlmIChfLmlzT2JqZWN0KHZhbHVlcykpIHtcbiAgICByZXR1cm4gdmFsdWVzO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJldmFsRmllbGRNYXBTY3JpcHQ6IOiEmuacrOi/lOWbnuWAvOexu+Wei+S4jeaYr+WvueixoVwiKTtcbiAgfVxuICByZXR1cm4ge307XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoID0gZnVuY3Rpb24ocmVjb3JkSWRzLCBzcGFjZUlkLCBpbnNJZCwgYXBwcm92ZUlkKSB7XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbJ2Ntc19maWxlcyddLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHBhcmVudDogcmVjb3JkSWRzXG4gIH0pLmZvckVhY2goZnVuY3Rpb24oY2YpIHtcbiAgICByZXR1cm4gXy5lYWNoKGNmLnZlcnNpb25zLCBmdW5jdGlvbih2ZXJzaW9uSWQsIGlkeCkge1xuICAgICAgdmFyIGYsIG5ld0ZpbGU7XG4gICAgICBmID0gQ3JlYXRvci5Db2xsZWN0aW9uc1snY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXS5maW5kT25lKHZlcnNpb25JZCk7XG4gICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgIHJldHVybiBuZXdGaWxlLmF0dGFjaERhdGEoZi5jcmVhdGVSZWFkU3RyZWFtKCdmaWxlcycpLCB7XG4gICAgICAgIHR5cGU6IGYub3JpZ2luYWwudHlwZVxuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIHZhciBtZXRhZGF0YTtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyLmVycm9yLCBlcnIucmVhc29uKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm5hbWUoZi5uYW1lKCkpO1xuICAgICAgICBuZXdGaWxlLnNpemUoZi5zaXplKCkpO1xuICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICBvd25lcjogZi5tZXRhZGF0YS5vd25lcixcbiAgICAgICAgICBvd25lcl9uYW1lOiBmLm1ldGFkYXRhLm93bmVyX25hbWUsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgaW5zdGFuY2U6IGluc0lkLFxuICAgICAgICAgIGFwcHJvdmU6IGFwcHJvdmVJZCxcbiAgICAgICAgICBwYXJlbnQ6IGNmLl9pZFxuICAgICAgICB9O1xuICAgICAgICBpZiAoaWR4ID09PSAwKSB7XG4gICAgICAgICAgbWV0YWRhdGEuY3VycmVudCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICByZXR1cm4gY2ZzLmluc3RhbmNlcy5pbnNlcnQobmV3RmlsZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvID0gZnVuY3Rpb24ocmVjb3JkSWRzLCBpbnNJZCwgc3BhY2VJZCkge1xuICBvYmplY3RVcGRhdGUocmVjb3JkSWRzLm8sIHJlY29yZElkcy5pZHNbMF0sIHtcbiAgICBpbnN0YW5jZXM6IFtcbiAgICAgIHtcbiAgICAgICAgX2lkOiBpbnNJZCxcbiAgICAgICAgc3RhdGU6ICdkcmFmdCdcbiAgICAgIH1cbiAgICBdLFxuICAgIGxvY2tlZDogdHJ1ZSxcbiAgICBpbnN0YW5jZV9zdGF0ZTogJ2RyYWZ0J1xuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvID0gZnVuY3Rpb24ocmVsYXRlZFRhYmxlc0luZm8sIGluc0lkLCBzcGFjZUlkKSB7XG4gIF8uZWFjaChyZWxhdGVkVGFibGVzSW5mbywgZnVuY3Rpb24odGFibGVJdGVtcywgcmVsYXRlZE9iamVjdE5hbWUpIHtcbiAgICB2YXIgcmVsYXRlZENvbGxlY3Rpb247XG4gICAgcmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpO1xuICAgIHJldHVybiBfLmVhY2godGFibGVJdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIHJlbGF0ZWRDb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoaXRlbS5fdGFibGUuX2lkLCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBpbnN0YW5jZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgX2lkOiBpbnNJZCxcbiAgICAgICAgICAgICAgc3RhdGU6ICdkcmFmdCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdLFxuICAgICAgICAgIF90YWJsZTogaXRlbS5fdGFibGVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja0lzSW5BcHByb3ZhbCA9IGZ1bmN0aW9uKHJlY29yZElkcywgc3BhY2VJZCkge1xuICB2YXIgcmVjb3JkO1xuICByZWNvcmQgPSBvYmplY3RGaW5kT25lKHJlY29yZElkcy5vLCB7XG4gICAgZmlsdGVyczogW1snX2lkJywgJz0nLCByZWNvcmRJZHMuaWRzWzBdXV0sXG4gICAgZmllbGRzOiBbJ2luc3RhbmNlcyddXG4gIH0pO1xuICBpZiAocmVjb3JkICYmIHJlY29yZC5pbnN0YW5jZXMgJiYgcmVjb3JkLmluc3RhbmNlc1swXS5zdGF0ZSAhPT0gJ2NvbXBsZXRlZCcgJiYgQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZChyZWNvcmQuaW5zdGFuY2VzWzBdLl9pZCkuY291bnQoKSA+IDApIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuatpOiusOW9leW3suWPkei1t+a1geeoi+ato+WcqOWuoeaJueS4re+8jOW+heWuoeaJuee7k+adn+aWueWPr+WPkei1t+S4i+S4gOasoeWuoeaJue+8gVwiKTtcbiAgfVxufTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvb2JqZWN0L3dvcmtmbG93L2RyYWZ0cycsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0dHJ5XG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxuXHRcdGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZFxuXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxuXG5cdFx0aW5zZXJ0ZWRfaW5zdGFuY2VzID0gbmV3IEFycmF5XG5cblx0XHRfLmVhY2ggaGFzaERhdGFbJ0luc3RhbmNlcyddLCAoaW5zdGFuY2VfZnJvbV9jbGllbnQpIC0+XG5cdFx0XHRuZXdfaW5zX2lkID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UoaW5zdGFuY2VfZnJvbV9jbGllbnQsIGN1cnJlbnRfdXNlcl9pbmZvKVxuXG5cdFx0XHRuZXdfaW5zID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZE9uZSh7IF9pZDogbmV3X2luc19pZCB9LCB7IGZpZWxkczogeyBzcGFjZTogMSwgZmxvdzogMSwgZmxvd192ZXJzaW9uOiAxLCBmb3JtOiAxLCBmb3JtX3ZlcnNpb246IDEgfSB9KVxuXG5cdFx0XHRpbnNlcnRlZF9pbnN0YW5jZXMucHVzaChuZXdfaW5zKVxuXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGluc2VydHM6IGluc2VydGVkX2luc3RhbmNlcyB9XG5cdFx0fVxuXHRjYXRjaCBlXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3sgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfV0gfVxuXHRcdH1cblxuIiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS9vYmplY3Qvd29ya2Zsb3cvZHJhZnRzJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGN1cnJlbnRfdXNlcl9pZCwgY3VycmVudF91c2VyX2luZm8sIGUsIGhhc2hEYXRhLCBpbnNlcnRlZF9pbnN0YW5jZXM7XG4gIHRyeSB7XG4gICAgY3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKTtcbiAgICBjdXJyZW50X3VzZXJfaWQgPSBjdXJyZW50X3VzZXJfaW5mby5faWQ7XG4gICAgaGFzaERhdGEgPSByZXEuYm9keTtcbiAgICBpbnNlcnRlZF9pbnN0YW5jZXMgPSBuZXcgQXJyYXk7XG4gICAgXy5lYWNoKGhhc2hEYXRhWydJbnN0YW5jZXMnXSwgZnVuY3Rpb24oaW5zdGFuY2VfZnJvbV9jbGllbnQpIHtcbiAgICAgIHZhciBuZXdfaW5zLCBuZXdfaW5zX2lkO1xuICAgICAgbmV3X2luc19pZCA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY3JlYXRlX2luc3RhbmNlKGluc3RhbmNlX2Zyb21fY2xpZW50LCBjdXJyZW50X3VzZXJfaW5mbyk7XG4gICAgICBuZXdfaW5zID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogbmV3X2luc19pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBzcGFjZTogMSxcbiAgICAgICAgICBmbG93OiAxLFxuICAgICAgICAgIGZsb3dfdmVyc2lvbjogMSxcbiAgICAgICAgICBmb3JtOiAxLFxuICAgICAgICAgIGZvcm1fdmVyc2lvbjogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBpbnNlcnRlZF9pbnN0YW5jZXMucHVzaChuZXdfaW5zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBpbnNlcnRzOiBpbnNlcnRlZF9pbnN0YW5jZXNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==
