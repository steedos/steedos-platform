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
  var appMenus, currentApp;
  appMenus = Session.get("_app_menus") || Session.get("app_menus");

  if (!appMenus) {
    return {};
  }

  currentApp = appMenus.find(function (menuItem) {
    return menuItem.id === app_id;
  });
  return currentApp;
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
  var appMenus, curentAppMenus;
  appMenus = Session.get("_app_menus") || Session.get("app_menus");

  if (!appMenus) {
    return [];
  }

  curentAppMenus = appMenus.find(function (menuItem) {
    return menuItem.id === app_id;
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
  return typeof Steedos !== "undefined" && Steedos !== null ? Steedos.authRequest("/service/api/apps/menus", options) : void 0;
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
        }, {
          validate: false
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
var _eval, checkRequiredDetails, getFieldOdataValue, getFileFieldValue, getFormField, getFormTableField, getFormTableFieldCode, getFormTableSubField, getInstanceFieldValue, getObjectConfig, getObjectNameFieldKey, getRelatedObjectFieldCode, getRelateds, getSelectOrgValue, getSelectOrgValues, getSelectUserValue, getSelectUserValues, objectFind, objectFindOne, objectUpdate, objectql;

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
    query.top = 1;
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

getRelatedObjectFieldCode = function (relatedObjectsKeys, key) {
  return _.find(relatedObjectsKeys, function (relatedObjectsKey) {
    return key.startsWith(relatedObjectsKey + '.');
  });
};

getFormTableFieldCode = function (formTableFieldsCode, key) {
  return _.find(formTableFieldsCode, function (formTableFieldCode) {
    return key.startsWith(formTableFieldCode + '.');
  });
};

getFormTableField = function (formTableFields, key) {
  return _.find(formTableFields, function (f) {
    return f.code === key;
  });
};

getFormField = function (formFields, key) {
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

getFileFieldValue = function (recordFieldId, fType) {
  var collection, files, query, value;

  if (_.isEmpty(recordFieldId)) {
    return;
  }

  if (fType === 'image') {
    collection = 'images';
  } else if (fType === 'file') {
    collection = 'files';
  }

  if (_.isString(recordFieldId)) {
    query = {
      _id: {
        $in: [recordFieldId]
      }
    };
  } else {
    query = {
      _id: {
        $in: recordFieldId
      }
    };
  }

  files = Creator.Collections["cfs." + collection + ".filerecord"].find(query);
  value = [];
  files.forEach(function (f) {
    var newFile;
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
        owner: f.metadata.owner
      };
      newFile.metadata = metadata;
      newFile._id = Creator.Collections.instances._makeNewID();
      cfs[collection].insert(newFile);
      return value.push(newFile._id);
    });
  });

  if (value.length > 0) {
    if (_.isString(recordFieldId)) {
      return value[0];
    } else {
      return value;
    }
  }
};

getInstanceFieldValue = function (objField, formField, record, object_field, spaceId, recordFieldValue) {
  var odataFieldValue, referenceToFieldName, referenceToObjectName, selectFieldValue, value;

  if (formField.steedos_field) {
    return recordFieldValue;
  }

  recordFieldValue = record[objField.name];
  value;

  if (formField && objField && formField.type === 'odata' && ['lookup', 'master_detail'].includes(objField.type) && _.isString(objField.reference_to)) {
    referenceToFieldName = objField.reference_to_field || '_id';
    referenceToObjectName = objField.reference_to;
    odataFieldValue;

    if (objField.multiple && formField.is_multiselect) {
      odataFieldValue = getFieldOdataValue(referenceToObjectName, recordFieldValue, referenceToFieldName);
    } else if (!objField.multiple && !formField.is_multiselect) {
      odataFieldValue = getFieldOdataValue(referenceToObjectName, recordFieldValue, referenceToFieldName);
    }

    value = odataFieldValue;
  } else if (formField && objField && ['user', 'group'].includes(formField.type) && ['lookup', 'master_detail'].includes(objField.type) && (['users', 'organizations'].includes(objField.reference_to) || 'space_users' === objField.reference_to && 'user' === objField.reference_to_field)) {
    if (!_.isEmpty(recordFieldValue)) {
      selectFieldValue;

      if (formField.type === 'user') {
        if (objField.multiple && formField.is_multiselect) {
          selectFieldValue = getSelectUserValues(recordFieldValue, spaceId);
        } else if (!objField.multiple && !formField.is_multiselect) {
          selectFieldValue = getSelectUserValue(recordFieldValue, spaceId);
        }
      } else if (formField.type === 'group') {
        if (objField.multiple && formField.is_multiselect) {
          selectFieldValue = getSelectOrgValues(recordFieldValue, spaceId);
        } else if (!objField.multiple && !formField.is_multiselect) {
          selectFieldValue = getSelectOrgValue(recordFieldValue, spaceId);
        }
      }

      if (selectFieldValue) {
        value = selectFieldValue;
      }
    }
  } else if (formField && objField && formField.type === 'date' && recordFieldValue) {
    value = uuflowManagerForInitApproval.formatDate(recordFieldValue);
  } else if (formField && objField && recordFieldValue && (formField.type === 'image' || formField.type === 'file')) {
    value = getFileFieldValue(recordFieldValue, formField.type);
  } else if (formField && objField && recordFieldValue && formField.type === 'lookup' && ['lookup', 'master_detail'].includes(objField.type) && _.isString(objField.reference_to)) {
    value = recordFieldValue;
  } else if (formField && objField && recordFieldValue && formField.type === 'multiSelect') {
    value = recordFieldValue.join(',');
  } else if (record.hasOwnProperty(object_field)) {
    value = recordFieldValue;
  }

  return value;
};

checkRequiredDetails = function (requiredDetails, masterRecord) {
  if (!_.isEmpty(requiredDetails)) {
    requiredDetails.forEach(function (rd) {
      var masterField, masterFieldValue, refId, subObjConfig, subTableMasterField, subTableName, subTableRecord;
      subTableName = rd.split('.')[0];
      subTableMasterField = rd.split('.')[1];
      subObjConfig = getObjectConfig(subTableName);
      masterField = subObjConfig.fields[subTableMasterField];
      refId = masterField.reference_to_field || '_id';
      masterFieldValue = masterRecord[refId];
      subTableRecord = objectFindOne(subTableName, {
        filters: [[subTableMasterField, '=', masterFieldValue]],
        fields: [subTableMasterField]
      });

      if (!subTableRecord) {
        throw new Error("请先新增" + subObjConfig.label);
      }
    });
  }
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
  var fieldCodes, filterValues, flow, form, formFields, formTableFields, formTableFieldsCode, object, objectName, ow, record, recordId, ref, relatedObjects, relatedObjectsKeys, requiredDetails, tableFieldCodes, tableFieldMap, tableToRelatedMap, values;
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
    requiredDetails = ow.required_details || [];
    checkRequiredDetails(requiredDetails, record);
    form = Creator.getCollection("forms").findOne(flow.form);
    formFields = form.current.fields || [];
    relatedObjects = getRelateds(objectName);
    relatedObjectsKeys = _.pluck(relatedObjects, 'object_name');
    formTableFields = _.filter(formFields, function (formField) {
      return formField.type === 'table';
    });
    formTableFieldsCode = _.pluck(formTableFields, 'code');
    tableFieldCodes = [];
    tableFieldMap = [];
    tableToRelatedMap = {};

    if ((ref = ow.field_map) != null) {
      ref.forEach(function (fm) {
        var formField, formTableFieldCode, gridCode, lookupFieldName, lookupFieldObj, lookupObjectRecord, oTableCode, oTableCodeReferenceField, oTableCodeReferenceFieldCode, oTableFieldCode, objField, objectField, objectFieldName, objectFieldObjectName, objectLookupField, object_field, recordFieldValue, referenceToDoc, referenceToFieldName, referenceToFieldValue, referenceToObjectName, relatedObjectFieldCode, tableToRelatedMapKey, wTableCode, workflow_field;
        object_field = fm.object_field;
        workflow_field = fm.workflow_field;

        if (!object_field || !workflow_field) {
          throw new Meteor.Error(400, '未找到字段，请检查对象流程映射字段配置');
        }

        relatedObjectFieldCode = getRelatedObjectFieldCode(relatedObjectsKeys, object_field);
        formTableFieldCode = getFormTableFieldCode(formTableFieldsCode, workflow_field);
        objField = object.fields[object_field];
        formField = getFormField(formFields, workflow_field);
        recordFieldValue = record[object_field];

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
          oTableCode = object_field.split('.$.')[0](ref1.table1.$.name);

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
              return values[workflow_field] = getInstanceFieldValue(objectLookupField, formField, lookupObjectRecord, lookupFieldName, spaceId, record[lookupFieldName]);
            }
          }
        } else {
          return values[workflow_field] = getInstanceFieldValue(objField, formField, record, object_field, spaceId, record[object_field]);
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

        _.each(tr, function (tdValue, k) {
          return tableFieldMap.forEach(function (tfm) {
            var wTdCode;

            if (tfm.object_field === c.object_table_field_code + '.$.' + k) {
              wTdCode = tfm.workflow_field.split('.')[1];
              return newTr[wTdCode] = tdValue;
            }
          });
        });

        if (!_.isEmpty(newTr)) {
          return values[c.workflow_table_field_code].push(newTr);
        }
      });
    });

    _.each(tableToRelatedMap, function (map, key) {
      var formTableField, relatedField, relatedFieldName, relatedObject, relatedObjectName, relatedRecords, relatedTableItems, tableCode, tableValues;
      tableCode = map._FROM_TABLE_CODE;
      formTableField = getFormTableField(formTableFields, tableCode);

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
        relatedRecords = objectFind(relatedObjectName, {
          filters: [[relatedFieldName, '=', recordId]]
        });
        relatedRecords.forEach(function (relatedRecord) {
          var tableValueItem;
          tableValueItem = {};

          _.each(map, function (valueKey, fieldKey) {
            var formField, formFieldKey, relatedObjectField, tableFieldValue;

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

              tableFieldValue = getInstanceFieldValue(relatedObjectField, formField, relatedRecord, fieldKey, spaceId, relatedRecord[fieldKey]);
              return tableValueItem[formFieldKey] = tableFieldValue;
            }
          });

          if (!_.isEmpty(tableValueItem)) {
            tableValueItem._id = relatedRecord._id;
            tableValues.push(tableValueItem);
            return relatedTableItems.push({
              _table: {
                _id: relatedRecord._id,
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

uuflowManagerForInitApproval.formatDate = function (date) {
  return moment(date).format("YYYY-MM-DD");
};
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

/* Exports */
Package._define("steedos:creator", {
  permissionManagerForInitApproval: permissionManagerForInitApproval,
  uuflowManagerForInitApproval: uuflowManagerForInitApproval
});

})();

//# sourceURL=meteor://💻app/packages/steedos_creator.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjcmVhdG9yL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvbGliL2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvb2JqZWN0X3JlY2VudF92aWV3ZWQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3ZpZXdlZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3JlY29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9yZWNlbnRfcmVjb3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9yZXBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3JlcG9ydF9kYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfZXhwb3J0MnhtbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9leHBvcnQyeG1sLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3JlbGF0ZWRfb2JqZWN0c19yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvcGVuZGluZ19zcGFjZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3BlbmRpbmdfc3BhY2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF90YWJ1bGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF9saXN0dmlld3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy91c2VyX3RhYnVsYXJfc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9yZWxhdGVkX29iamVjdHNfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV91c2VyX2luZm8uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c192aWV3X2xpbWl0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfdmlld19saW1pdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c19ub19mb3JjZV9waG9uZV91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9uZWVkX3RvX2NvbmZpcm0uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX25lZWRfdG9fY29uZmlybS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbGliL3Blcm1pc3Npb25fbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvcGVybWlzc2lvbl9tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiYnVzYm95IiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJjZnMiLCJhbGl5dW4iLCJDcmVhdG9yIiwiZ2V0U2NoZW1hIiwib2JqZWN0X25hbWUiLCJyZWYiLCJnZXRPYmplY3QiLCJzY2hlbWEiLCJnZXRPYmplY3RIb21lQ29tcG9uZW50IiwiZ2V0T2JqZWN0VXJsIiwicmVjb3JkX2lkIiwiYXBwX2lkIiwibGlzdF92aWV3IiwibGlzdF92aWV3X2lkIiwiU2Vzc2lvbiIsImdldCIsImdldExpc3RWaWV3IiwiX2lkIiwiZ2V0UmVsYXRpdmVVcmwiLCJnZXRPYmplY3RBYnNvbHV0ZVVybCIsIlN0ZWVkb3MiLCJhYnNvbHV0ZVVybCIsImdldE9iamVjdFJvdXRlclVybCIsImdldExpc3RWaWV3VXJsIiwidXJsIiwiZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybCIsImdldFN3aXRjaExpc3RVcmwiLCJnZXRSZWxhdGVkT2JqZWN0VXJsIiwicmVsYXRlZF9vYmplY3RfbmFtZSIsInJlbGF0ZWRfZmllbGRfbmFtZSIsImdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyIsImlzX2RlZXAiLCJpc19za2lwX2hpZGUiLCJpc19yZWxhdGVkIiwiX29iamVjdCIsIl9vcHRpb25zIiwiZmllbGRzIiwiaWNvbiIsInJlbGF0ZWRPYmplY3RzIiwiXyIsImZvckVhY2giLCJmIiwiayIsImhpZGRlbiIsInR5cGUiLCJwdXNoIiwibGFiZWwiLCJ2YWx1ZSIsInJfb2JqZWN0IiwicmVmZXJlbmNlX3RvIiwiaXNTdHJpbmciLCJmMiIsImsyIiwiZ2V0UmVsYXRlZE9iamVjdHMiLCJlYWNoIiwiX3RoaXMiLCJfcmVsYXRlZE9iamVjdCIsInJlbGF0ZWRPYmplY3QiLCJyZWxhdGVkT3B0aW9ucyIsInJlbGF0ZWRPcHRpb24iLCJmb3JlaWduX2tleSIsIm5hbWUiLCJnZXRPYmplY3RGaWx0ZXJGaWVsZE9wdGlvbnMiLCJwZXJtaXNzaW9uX2ZpZWxkcyIsImdldEZpZWxkcyIsImluY2x1ZGUiLCJ0ZXN0IiwiaW5kZXhPZiIsImdldE9iamVjdEZpZWxkT3B0aW9ucyIsImdldEZpbHRlcnNXaXRoRmlsdGVyRmllbGRzIiwiZmlsdGVycyIsImZpbHRlcl9maWVsZHMiLCJsZW5ndGgiLCJuIiwiZmllbGQiLCJyZXF1aXJlZCIsImZpbmRXaGVyZSIsImlzX2RlZmF1bHQiLCJpc19yZXF1aXJlZCIsImZpbHRlckl0ZW0iLCJtYXRjaEZpZWxkIiwiZmluZCIsImdldE9iamVjdFJlY29yZCIsInNlbGVjdF9maWVsZHMiLCJleHBhbmQiLCJjb2xsZWN0aW9uIiwib2JqIiwicmVjb3JkIiwicmVmMSIsInJlZjIiLCJpc0NsaWVudCIsIlRlbXBsYXRlIiwiaW5zdGFuY2UiLCJvZGF0YSIsImRhdGFiYXNlX25hbWUiLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsImdldE9iamVjdFJlY29yZE5hbWUiLCJuYW1lX2ZpZWxkX2tleSIsIk5BTUVfRklFTERfS0VZIiwiZ2V0QXBwIiwiYXBwTWVudXMiLCJjdXJyZW50QXBwIiwibWVudUl0ZW0iLCJpZCIsImdldEFwcERhc2hib2FyZCIsImFwcCIsImRhc2hib2FyZCIsIkRhc2hib2FyZHMiLCJhcHBzIiwiZ2V0QXBwRGFzaGJvYXJkQ29tcG9uZW50IiwiZ2V0QXBwT2JqZWN0TmFtZXMiLCJhcHBPYmplY3RzIiwiaXNNb2JpbGUiLCJvYmplY3RzIiwibW9iaWxlX29iamVjdHMiLCJwZXJtaXNzaW9ucyIsImFsbG93UmVhZCIsImdldFVybFdpdGhUb2tlbiIsImV4cHJlc3Npb25Gb3JtRGF0YSIsImhhc1F1ZXJ5U3ltYm9sIiwibGlua1N0ciIsInBhcmFtcyIsInNwYWNlSWQiLCJ1c2VySWQiLCJnZXRVc2VyQ29tcGFueUlkcyIsIkFjY291bnRzIiwiX3N0b3JlZExvZ2luVG9rZW4iLCJpc0V4cHJlc3Npb24iLCJwYXJzZVNpbmdsZUV4cHJlc3Npb24iLCJVU0VSX0NPTlRFWFQiLCIkIiwicGFyYW0iLCJnZXRBcHBNZW51IiwibWVudV9pZCIsIm1lbnVzIiwiZ2V0QXBwTWVudXMiLCJtZW51IiwiZ2V0QXBwTWVudVVybEZvckludGVybmV0IiwicGF0aCIsImdldEFwcE1lbnVVcmwiLCJ0YXJnZXQiLCJjdXJlbnRBcHBNZW51cyIsImNoaWxkcmVuIiwibG9hZEFwcHNNZW51cyIsImRhdGEiLCJvcHRpb25zIiwibW9iaWxlIiwic3VjY2VzcyIsInNldCIsImF1dGhSZXF1ZXN0IiwiY3JlYXRvckFwcHNTZWxlY3RvciIsImFzc2lnbmVkX2FwcHMiLCJhZG1pbkFwcCIsImNyZWF0b3JBcHBzIiwic29ydGVkQXBwcyIsImtleSIsImlzX2NyZWF0b3IiLCJ2aXNpYmxlIiwic29ydEJ5IiwidmFsdWVzIiwiYWRtaW4iLCJ2aXNpYmxlQXBwc1NlbGVjdG9yIiwiaW5jbHVkZUFkbWluIiwiZ2V0VmlzaWJsZUFwcHMiLCJjaGFuZ2VBcHAiLCJfc3ViQXBwIiwiT2JqZWN0IiwiYXNzaWduIiwiQXBwcyIsImdldFZpc2libGVBcHBzT2JqZWN0cyIsInZpc2libGVPYmplY3ROYW1lcyIsImZsYXR0ZW4iLCJwbHVjayIsImZpbHRlciIsIk9iamVjdHMiLCJzb3J0Iiwic29ydGluZ01ldGhvZCIsImJpbmQiLCJ1bmlxIiwiZ2V0QXBwc09iamVjdHMiLCJ0ZW1wT2JqZWN0cyIsImNvbmNhdCIsInZhbGlkYXRlRmlsdGVycyIsImxvZ2ljIiwiZSIsImVycm9yTXNnIiwiZmlsdGVyX2l0ZW1zIiwiZmlsdGVyX2xlbmd0aCIsImZsYWciLCJpbmRleCIsIndvcmQiLCJtYXAiLCJpc0VtcHR5IiwiY29tcGFjdCIsInJlcGxhY2UiLCJtYXRjaCIsImkiLCJpbmNsdWRlcyIsInciLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJ0b2FzdHIiLCJmb3JtYXRGaWx0ZXJzVG9Nb25nbyIsInNlbGVjdG9yIiwiQXJyYXkiLCJvcGVyYXRpb24iLCJvcHRpb24iLCJyZWciLCJzdWJfc2VsZWN0b3IiLCJldmFsdWF0ZUZvcm11bGEiLCJSZWdFeHAiLCJpc0JldHdlZW5GaWx0ZXJPcGVyYXRpb24iLCJnZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMiLCJmb3JtYXRGaWx0ZXJzVG9EZXYiLCJsb2dpY1RlbXBGaWx0ZXJzIiwiaXNfbG9naWNfb3IiLCJwb3AiLCJTdGVlZG9zRmlsdGVycyIsImZvcm1hdExvZ2ljRmlsdGVyc1RvRGV2IiwiZmlsdGVyX2xvZ2ljIiwiZm9ybWF0X2xvZ2ljIiwieCIsIl9mIiwiaXNBcnJheSIsIkpTT04iLCJzdHJpbmdpZnkiLCJyZWxhdGVkX29iamVjdF9uYW1lcyIsInJlbGF0ZWRfb2JqZWN0cyIsInVucmVsYXRlZF9vYmplY3RzIiwiZ2V0T2JqZWN0UmVsYXRlZHMiLCJfY29sbGVjdGlvbl9uYW1lIiwiZ2V0UGVybWlzc2lvbnMiLCJkaWZmZXJlbmNlIiwicmVsYXRlZF9vYmplY3QiLCJpc0FjdGl2ZSIsImFsbG93UmVhZEZpbGVzIiwiZ2V0UmVsYXRlZE9iamVjdE5hbWVzIiwiZ2V0UmVsYXRlZE9iamVjdExpc3RBY3Rpb25zIiwicmVsYXRlZE9iamVjdE5hbWUiLCJhY3Rpb25zIiwiZ2V0QWN0aW9ucyIsImFjdGlvbiIsIm9uIiwiZGlzYWJsZWRfYWN0aW9ucyIsImhhcyIsImFsbG93X2N1c3RvbUFjdGlvbnMiLCJrZXlzIiwiZXhjbHVkZV9hY3Rpb25zIiwiZ2V0TGlzdFZpZXdzIiwiZGlzYWJsZWRfbGlzdF92aWV3cyIsImxpc3RWaWV3cyIsImxpc3Rfdmlld3MiLCJvYmplY3QiLCJpdGVtIiwiaXRlbV9uYW1lIiwiaXNEaXNhYmxlZCIsIm93bmVyIiwiZmllbGRzTmFtZSIsInVucmVhZGFibGVfZmllbGRzIiwiZ2V0T2JqZWN0RmllbGRzTmFtZSIsImlzbG9hZGluZyIsImJvb3RzdHJhcExvYWRlZCIsImNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyIiwic3RyIiwiZ2V0RGlzYWJsZWRGaWVsZHMiLCJmaWVsZE5hbWUiLCJhdXRvZm9ybSIsImRpc2FibGVkIiwib21pdCIsImdldEhpZGRlbkZpZWxkcyIsImdldEZpZWxkc1dpdGhOb0dyb3VwIiwiZ3JvdXAiLCJnZXRTb3J0ZWRGaWVsZEdyb3VwTmFtZXMiLCJuYW1lcyIsInVuaXF1ZSIsImdldEZpZWxkc0Zvckdyb3VwIiwiZ3JvdXBOYW1lIiwiZ2V0U3lzdGVtQmFzZUZpZWxkcyIsImdldEZpZWxkc1dpdGhvdXRTeXN0ZW1CYXNlIiwiZ2V0RmllbGRzV2l0aG91dE9taXQiLCJwaWNrIiwiZ2V0RmllbGRzSW5GaXJzdExldmVsIiwiZmlyc3RMZXZlbEtleXMiLCJnZXRGaWVsZHNGb3JSZW9yZGVyIiwiaXNTaW5nbGUiLCJfa2V5cyIsImNoaWxkS2V5cyIsImlzX3dpZGVfMSIsImlzX3dpZGVfMiIsInNjXzEiLCJzY18yIiwiZW5kc1dpdGgiLCJpc193aWRlIiwic2xpY2UiLCJpc0ZpbHRlclZhbHVlRW1wdHkiLCJOdW1iZXIiLCJpc05hTiIsImdldEZpZWxkRGF0YVR5cGUiLCJvYmplY3RGaWVsZHMiLCJyZXN1bHQiLCJkYXRhX3R5cGUiLCJpc1NlcnZlciIsImdldEFsbFJlbGF0ZWRPYmplY3RzIiwicmVsYXRlZF9maWVsZCIsImVuYWJsZV9maWxlcyIsImZvcm1hdEluZGV4IiwiYXJyYXkiLCJpbmRleE5hbWUiLCJpc2RvY3VtZW50REIiLCJiYWNrZ3JvdW5kIiwiZGF0YXNvdXJjZXMiLCJkb2N1bWVudERCIiwiam9pbiIsInN1YnN0cmluZyIsImFwcHNCeU5hbWUiLCJtZXRob2RzIiwic3BhY2VfaWQiLCJjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQiLCJjdXJyZW50X3JlY2VudF92aWV3ZWQiLCJkb2MiLCJzcGFjZSIsInVwZGF0ZSIsIiRpbmMiLCJjb3VudCIsIiRzZXQiLCJtb2RpZmllZCIsIkRhdGUiLCJtb2RpZmllZF9ieSIsImluc2VydCIsIl9tYWtlTmV3SUQiLCJvIiwiaWRzIiwiY3JlYXRlZCIsImNyZWF0ZWRfYnkiLCJ2YWxpZGF0ZSIsImFzeW5jX3JlY2VudF9hZ2dyZWdhdGUiLCJyZWNlbnRfYWdncmVnYXRlIiwic2VhcmNoX29iamVjdCIsIl9yZWNvcmRzIiwiY2FsbGJhY2siLCJDb2xsZWN0aW9ucyIsIm9iamVjdF9yZWNlbnRfdmlld2VkIiwicmF3Q29sbGVjdGlvbiIsImFnZ3JlZ2F0ZSIsIiRtYXRjaCIsIiRncm91cCIsIm1heENyZWF0ZWQiLCIkbWF4IiwiJHNvcnQiLCIkbGltaXQiLCJ0b0FycmF5IiwiZXJyIiwiRXJyb3IiLCJpc0Z1bmN0aW9uIiwid3JhcEFzeW5jIiwic2VhcmNoVGV4dCIsIl9vYmplY3RfY29sbGVjdGlvbiIsIl9vYmplY3RfbmFtZV9rZXkiLCJxdWVyeSIsInF1ZXJ5X2FuZCIsInJlY29yZHMiLCJzZWFyY2hfS2V5d29yZHMiLCJzcGxpdCIsImtleXdvcmQiLCJzdWJxdWVyeSIsIiRyZWdleCIsInRyaW0iLCIkYW5kIiwiJGluIiwibGltaXQiLCJfbmFtZSIsIl9vYmplY3RfbmFtZSIsInJlY29yZF9vYmplY3QiLCJyZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24iLCJzZWxmIiwib2JqZWN0c0J5TmFtZSIsIm9iamVjdF9yZWNvcmQiLCJlbmFibGVfc2VhcmNoIiwidXBkYXRlX2ZpbHRlcnMiLCJsaXN0dmlld19pZCIsImZpbHRlcl9zY29wZSIsIm9iamVjdF9saXN0dmlld3MiLCJkaXJlY3QiLCJ1cGRhdGVfY29sdW1ucyIsImNvbHVtbnMiLCJjaGVjayIsImNvbXBvdW5kRmllbGRzIiwiY3Vyc29yIiwiZmlsdGVyRmllbGRzIiwiY2hpbGRLZXkiLCJvYmplY3RGaWVsZCIsInNwbGl0cyIsImlzQ29tbW9uU3BhY2UiLCJpc1NwYWNlQWRtaW4iLCJza2lwIiwiZmV0Y2giLCJjb21wb3VuZEZpZWxkSXRlbSIsImNvbXBvdW5kRmlsdGVyRmllbGRzIiwiaXRlbUtleSIsIml0ZW1WYWx1ZSIsInJlZmVyZW5jZUl0ZW0iLCJzZXR0aW5nIiwiY29sdW1uX3dpZHRoIiwib2JqMSIsIl9pZF9hY3Rpb25zIiwiX21peEZpZWxkc0RhdGEiLCJfbWl4UmVsYXRlZERhdGEiLCJfd3JpdGVYbWxGaWxlIiwiZnMiLCJsb2dnZXIiLCJta2RpcnAiLCJ4bWwyanMiLCJyZXF1aXJlIiwiTG9nZ2VyIiwianNvbk9iaiIsIm9iak5hbWUiLCJidWlsZGVyIiwiZGF5IiwiZmlsZUFkZHJlc3MiLCJmaWxlTmFtZSIsImZpbGVQYXRoIiwibW9udGgiLCJub3ciLCJzdHJlYW0iLCJ4bWwiLCJ5ZWFyIiwiQnVpbGRlciIsImJ1aWxkT2JqZWN0IiwiQnVmZmVyIiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsImdldERhdGUiLCJfX21ldGVvcl9ib290c3RyYXBfXyIsInNlcnZlckRpciIsImV4aXN0c1N5bmMiLCJzeW5jIiwid3JpdGVGaWxlIiwibWl4Qm9vbCIsIm1peERhdGUiLCJtaXhEZWZhdWx0Iiwib2JqRmllbGRzIiwiZmllbGRfbmFtZSIsImRhdGUiLCJkYXRlU3RyIiwiZm9ybWF0IiwibW9tZW50IiwicmVsYXRlZE9iak5hbWVzIiwicmVsYXRlZE9iak5hbWUiLCJyZWxhdGVkQ29sbGVjdGlvbiIsInJlbGF0ZWRSZWNvcmRMaXN0IiwicmVsYXRlZFRhYmxlRGF0YSIsInJlbGF0ZWRPYmoiLCJmaWVsZHNEYXRhIiwiRXhwb3J0MnhtbCIsInJlY29yZExpc3QiLCJpbmZvIiwidGltZSIsInJlY29yZE9iaiIsInRpbWVFbmQiLCJyZWxhdGVkX29iamVjdHNfcmVjb3JkcyIsInJlbGF0ZWRfcmVjb3JkcyIsInZpZXdBbGxSZWNvcmRzIiwiZ2V0UGVuZGluZ1NwYWNlSW5mbyIsImludml0ZXJJZCIsImludml0ZXJOYW1lIiwic3BhY2VOYW1lIiwiZGIiLCJ1c2VycyIsInNwYWNlcyIsImludml0ZXIiLCJyZWZ1c2VKb2luU3BhY2UiLCJzcGFjZV91c2VycyIsImludml0ZV9zdGF0ZSIsImFjY2VwdEpvaW5TcGFjZSIsInVzZXJfYWNjZXB0ZWQiLCJwdWJsaXNoIiwicHVibGlzaENvbXBvc2l0ZSIsInRhYmxlTmFtZSIsIl9maWVsZHMiLCJvYmplY3RfY29sbGVjaXRvbiIsInJlZmVyZW5jZV9maWVsZHMiLCJyZWFkeSIsIlN0cmluZyIsIk1hdGNoIiwiT3B0aW9uYWwiLCJnZXRPYmplY3ROYW1lIiwidW5ibG9jayIsImZpZWxkX2tleXMiLCJfb2JqZWN0S2V5cyIsInJlZmVyZW5jZV9maWVsZCIsInBhcmVudCIsImNoaWxkcmVuX2ZpZWxkcyIsInBfayIsInJlZmVyZW5jZV9pZHMiLCJyZWZlcmVuY2VfdG9fb2JqZWN0Iiwic19rIiwiZ2V0UHJvcGVydHkiLCJyZWR1Y2UiLCJpc09iamVjdCIsInNoYXJlZCIsInVzZXIiLCJzcGFjZV9zZXR0aW5ncyIsInBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsIiwiZ2V0Rmxvd1Blcm1pc3Npb25zIiwiZmxvd19pZCIsInVzZXJfaWQiLCJmbG93IiwibXlfcGVybWlzc2lvbnMiLCJvcmdfaWRzIiwib3JnYW5pemF0aW9ucyIsIm9yZ3NfY2FuX2FkZCIsIm9yZ3NfY2FuX2FkbWluIiwib3Jnc19jYW5fbW9uaXRvciIsInVzZXJzX2Nhbl9hZGQiLCJ1c2Vyc19jYW5fYWRtaW4iLCJ1c2Vyc19jYW5fbW9uaXRvciIsInV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwiLCJnZXRGbG93IiwicGFyZW50cyIsIm9yZyIsInBhcmVudF9pZCIsInBlcm1zIiwib3JnX2lkIiwiX2V2YWwiLCJjaGVja1JlcXVpcmVkRGV0YWlscyIsImdldEZpZWxkT2RhdGFWYWx1ZSIsImdldEZpbGVGaWVsZFZhbHVlIiwiZ2V0Rm9ybUZpZWxkIiwiZ2V0Rm9ybVRhYmxlRmllbGQiLCJnZXRGb3JtVGFibGVGaWVsZENvZGUiLCJnZXRGb3JtVGFibGVTdWJGaWVsZCIsImdldEluc3RhbmNlRmllbGRWYWx1ZSIsImdldE9iamVjdENvbmZpZyIsImdldE9iamVjdE5hbWVGaWVsZEtleSIsImdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUiLCJnZXRSZWxhdGVkcyIsImdldFNlbGVjdE9yZ1ZhbHVlIiwiZ2V0U2VsZWN0T3JnVmFsdWVzIiwiZ2V0U2VsZWN0VXNlclZhbHVlIiwiZ2V0U2VsZWN0VXNlclZhbHVlcyIsIm9iamVjdEZpbmQiLCJvYmplY3RGaW5kT25lIiwib2JqZWN0VXBkYXRlIiwib2JqZWN0cWwiLCJvYmplY3RBcGlOYW1lIiwidG9Db25maWciLCJjYiIsInRoZW4iLCJyZXNvbHZlIiwicmVqZWN0IiwidG9wIiwicmVsYXRlZE9iamVjdHNLZXlzIiwicmVsYXRlZE9iamVjdHNLZXkiLCJzdGFydHNXaXRoIiwiZm9ybVRhYmxlRmllbGRzQ29kZSIsImZvcm1UYWJsZUZpZWxkQ29kZSIsImZvcm1UYWJsZUZpZWxkcyIsImNvZGUiLCJmb3JtRmllbGRzIiwiZmYiLCJzZiIsInRhYmxlRmllbGQiLCJzdWJGaWVsZENvZGUiLCJyZWZlcmVuY2VUb0ZpZWxkTmFtZSIsIl9yZWNvcmQiLCJuYW1lS2V5Iiwic3UiLCJ1c2VySWRzIiwic3VzIiwib3JnSWQiLCJmdWxsbmFtZSIsIm9yZ0lkcyIsIm9yZ3MiLCJyZWNvcmRGaWVsZElkIiwiZlR5cGUiLCJmaWxlcyIsIm5ld0ZpbGUiLCJGUyIsIkZpbGUiLCJhdHRhY2hEYXRhIiwiY3JlYXRlUmVhZFN0cmVhbSIsIm9yaWdpbmFsIiwibWV0YWRhdGEiLCJyZWFzb24iLCJzaXplIiwiaW5zdGFuY2VzIiwib2JqRmllbGQiLCJmb3JtRmllbGQiLCJvYmplY3RfZmllbGQiLCJyZWNvcmRGaWVsZFZhbHVlIiwib2RhdGFGaWVsZFZhbHVlIiwicmVmZXJlbmNlVG9PYmplY3ROYW1lIiwic2VsZWN0RmllbGRWYWx1ZSIsInN0ZWVkb3NfZmllbGQiLCJyZWZlcmVuY2VfdG9fZmllbGQiLCJtdWx0aXBsZSIsImlzX211bHRpc2VsZWN0IiwiZm9ybWF0RGF0ZSIsImhhc093blByb3BlcnR5IiwicmVxdWlyZWREZXRhaWxzIiwibWFzdGVyUmVjb3JkIiwicmQiLCJtYXN0ZXJGaWVsZCIsIm1hc3RlckZpZWxkVmFsdWUiLCJyZWZJZCIsInN1Yk9iakNvbmZpZyIsInN1YlRhYmxlTWFzdGVyRmllbGQiLCJzdWJUYWJsZU5hbWUiLCJzdWJUYWJsZVJlY29yZCIsImNoZWNrX2F1dGhvcml6YXRpb24iLCJyZXEiLCJhdXRoVG9rZW4iLCJoYXNoZWRUb2tlbiIsIl9oYXNoTG9naW5Ub2tlbiIsImdldFNwYWNlIiwiZmxvd3MiLCJnZXRTcGFjZVVzZXIiLCJzcGFjZV91c2VyIiwiZ2V0U3BhY2VVc2VyT3JnSW5mbyIsIm9yZ2FuaXphdGlvbiIsIm9yZ2FuaXphdGlvbl9uYW1lIiwib3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwiaXNGbG93RW5hYmxlZCIsInN0YXRlIiwiaXNGbG93U3BhY2VNYXRjaGVkIiwiZ2V0Rm9ybSIsImZvcm1faWQiLCJmb3JtIiwiZm9ybXMiLCJnZXRDYXRlZ29yeSIsImNhdGVnb3J5X2lkIiwiY2F0ZWdvcmllcyIsImNoZWNrU3luY0RpcmVjdGlvbiIsIm93Iiwic3luY0RpcmVjdGlvbiIsIm9iamVjdF93b3JrZmxvd3MiLCJzeW5jX2RpcmVjdGlvbiIsImNyZWF0ZV9pbnN0YW5jZSIsImluc3RhbmNlX2Zyb21fY2xpZW50IiwidXNlcl9pbmZvIiwiYXBwcl9vYmoiLCJhcHByb3ZlX2Zyb21fY2xpZW50IiwiY2F0ZWdvcnkiLCJpbnNfb2JqIiwibmV3X2luc19pZCIsInJlbGF0ZWRUYWJsZXNJbmZvIiwic3BhY2VfdXNlcl9vcmdfaW5mbyIsInN0YXJ0X3N0ZXAiLCJ0cmFjZV9mcm9tX2NsaWVudCIsInRyYWNlX29iaiIsImNoZWNrSXNJbkFwcHJvdmFsIiwicGVybWlzc2lvbk1hbmFnZXIiLCJmbG93X3ZlcnNpb24iLCJjdXJyZW50IiwiZm9ybV92ZXJzaW9uIiwic3VibWl0dGVyIiwic3VibWl0dGVyX25hbWUiLCJhcHBsaWNhbnQiLCJhcHBsaWNhbnRfbmFtZSIsImFwcGxpY2FudF9vcmdhbml6YXRpb24iLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUiLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwiYXBwbGljYW50X2NvbXBhbnkiLCJjb21wYW55X2lkIiwiaXNfYXJjaGl2ZWQiLCJpc19kZWxldGVkIiwicmVjb3JkX2lkcyIsIk1vbmdvIiwiT2JqZWN0SUQiLCJfc3RyIiwiaXNfZmluaXNoZWQiLCJzdGVwcyIsInN0ZXAiLCJzdGVwX3R5cGUiLCJzdGFydF9kYXRlIiwidHJhY2UiLCJ1c2VyX25hbWUiLCJoYW5kbGVyIiwiaGFuZGxlcl9uYW1lIiwiaGFuZGxlcl9vcmdhbml6YXRpb24iLCJoYW5kbGVyX29yZ2FuaXphdGlvbl9uYW1lIiwiaGFuZGxlcl9vcmdhbml6YXRpb25fZnVsbG5hbWUiLCJyZWFkX2RhdGUiLCJpc19yZWFkIiwiaXNfZXJyb3IiLCJkZXNjcmlwdGlvbiIsImluaXRpYXRlVmFsdWVzIiwiYXBwcm92ZXMiLCJ0cmFjZXMiLCJpbmJveF91c2VycyIsImN1cnJlbnRfc3RlcF9uYW1lIiwiYXV0b19yZW1pbmQiLCJmbG93X25hbWUiLCJjYXRlZ29yeV9uYW1lIiwiaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8iLCJpbml0aWF0ZUF0dGFjaCIsInJlY29yZElkcyIsImZsb3dJZCIsImZpZWxkQ29kZXMiLCJmaWx0ZXJWYWx1ZXMiLCJvYmplY3ROYW1lIiwicmVjb3JkSWQiLCJ0YWJsZUZpZWxkQ29kZXMiLCJ0YWJsZUZpZWxkTWFwIiwidGFibGVUb1JlbGF0ZWRNYXAiLCJyZXF1aXJlZF9kZXRhaWxzIiwiZmllbGRfbWFwIiwiZm0iLCJncmlkQ29kZSIsImxvb2t1cEZpZWxkTmFtZSIsImxvb2t1cEZpZWxkT2JqIiwibG9va3VwT2JqZWN0UmVjb3JkIiwib1RhYmxlQ29kZSIsIm9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZCIsIm9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZENvZGUiLCJvVGFibGVGaWVsZENvZGUiLCJvYmplY3RGaWVsZE5hbWUiLCJvYmplY3RGaWVsZE9iamVjdE5hbWUiLCJvYmplY3RMb29rdXBGaWVsZCIsInJlZmVyZW5jZVRvRG9jIiwicmVmZXJlbmNlVG9GaWVsZFZhbHVlIiwicmVsYXRlZE9iamVjdEZpZWxkQ29kZSIsInRhYmxlVG9SZWxhdGVkTWFwS2V5Iiwid1RhYmxlQ29kZSIsIndvcmtmbG93X2ZpZWxkIiwidGFibGUxIiwid29ya2Zsb3dfdGFibGVfZmllbGRfY29kZSIsIm9iamVjdF90YWJsZV9maWVsZF9jb2RlIiwidGZjIiwiYyIsInBhcnNlIiwidHIiLCJuZXdUciIsInRkVmFsdWUiLCJ0Zm0iLCJ3VGRDb2RlIiwiZm9ybVRhYmxlRmllbGQiLCJyZWxhdGVkRmllbGQiLCJyZWxhdGVkRmllbGROYW1lIiwicmVsYXRlZFJlY29yZHMiLCJyZWxhdGVkVGFibGVJdGVtcyIsInRhYmxlQ29kZSIsInRhYmxlVmFsdWVzIiwiX0ZST01fVEFCTEVfQ09ERSIsIndhcm4iLCJyZWxhdGVkUmVjb3JkIiwidGFibGVWYWx1ZUl0ZW0iLCJ2YWx1ZUtleSIsImZpZWxkS2V5IiwiZm9ybUZpZWxkS2V5IiwicmVsYXRlZE9iamVjdEZpZWxkIiwidGFibGVGaWVsZFZhbHVlIiwiX3RhYmxlIiwiX2NvZGUiLCJmaWVsZF9tYXBfc2NyaXB0IiwiZXh0ZW5kIiwiZXZhbEZpZWxkTWFwU2NyaXB0Iiwib2JqZWN0SWQiLCJmdW5jIiwic2NyaXB0IiwiaW5zSWQiLCJhcHByb3ZlSWQiLCJjZiIsInZlcnNpb25zIiwidmVyc2lvbklkIiwiaWR4Iiwib3duZXJfbmFtZSIsImFwcHJvdmUiLCJsb2NrZWQiLCJpbnN0YW5jZV9zdGF0ZSIsImluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyIsInRhYmxlSXRlbXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUdyQkgsZ0JBQWdCLENBQUM7QUFDaEJJLFFBQU0sRUFBRSxTQURRO0FBRWhCLFlBQVU7QUFGTSxDQUFELEVBR2IsaUJBSGEsQ0FBaEI7O0FBS0EsSUFBSUMsTUFBTSxDQUFDQyxRQUFQLElBQW1CRCxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLEdBQW5DLElBQTBDRixNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CQyxNQUFsRSxFQUEwRTtBQUN6RVIsa0JBQWdCLENBQUM7QUFDaEIsa0JBQWM7QUFERSxHQUFELEVBRWIsaUJBRmEsQ0FBaEI7QUFHQSxDOzs7Ozs7Ozs7Ozs7QUNHRFMsUUFBUUMsU0FBUixHQUFvQixVQUFDQyxXQUFEO0FBQ25CLE1BQUFDLEdBQUE7QUFBQSxVQUFBQSxNQUFBSCxRQUFBSSxTQUFBLENBQUFGLFdBQUEsYUFBQUMsSUFBdUNFLE1BQXZDLEdBQXVDLE1BQXZDO0FBRG1CLENBQXBCOztBQUdBTCxRQUFRTSxzQkFBUixHQUFpQyxVQUFDSixXQUFEO0FBR2hDLFNBQU8sS0FBUDtBQUhnQyxDQUFqQzs7QUFLQUYsUUFBUU8sWUFBUixHQUF1QixVQUFDTCxXQUFELEVBQWNNLFNBQWQsRUFBeUJDLE1BQXpCO0FBQ3RCLE1BQUFDLFNBQUEsRUFBQUMsWUFBQTs7QUFBQSxNQUFHLENBQUNGLE1BQUo7QUFDQ0EsYUFBU0csUUFBUUMsR0FBUixDQUFZLFFBQVosQ0FBVDtBQ1pDOztBRGFGLE1BQUcsQ0FBQ1gsV0FBSjtBQUNDQSxrQkFBY1UsUUFBUUMsR0FBUixDQUFZLGFBQVosQ0FBZDtBQ1hDOztBRGFGSCxjQUFZVixRQUFRYyxXQUFSLENBQW9CWixXQUFwQixFQUFpQyxJQUFqQyxDQUFaO0FBQ0FTLGlCQUFBRCxhQUFBLE9BQWVBLFVBQVdLLEdBQTFCLEdBQTBCLE1BQTFCOztBQUVBLE1BQUdQLFNBQUg7QUFDQyxXQUFPUixRQUFRZ0IsY0FBUixDQUF1QixVQUFVUCxNQUFWLEdBQW1CLEdBQW5CLEdBQXlCUCxXQUF6QixHQUF1QyxRQUF2QyxHQUFrRE0sU0FBekUsQ0FBUDtBQUREO0FBR0MsUUFBR1IsUUFBUU0sc0JBQVIsQ0FBK0JKLFdBQS9CLENBQUg7QUFDQyxhQUFPRixRQUFRZ0IsY0FBUixDQUF1QixVQUFVUCxNQUFWLEdBQW1CLEdBQW5CLEdBQXlCUCxXQUFoRCxDQUFQO0FBREQ7QUFHQyxVQUFHUyxZQUFIO0FBQ0MsZUFBT1gsUUFBUWdCLGNBQVIsQ0FBdUIsVUFBVVAsTUFBVixHQUFtQixHQUFuQixHQUF5QlAsV0FBekIsR0FBdUMsUUFBdkMsR0FBa0RTLFlBQXpFLENBQVA7QUFERDtBQUdDLGVBQU9YLFFBQVFnQixjQUFSLENBQXVCLFVBQVVQLE1BQVYsR0FBbUIsR0FBbkIsR0FBeUJQLFdBQWhELENBQVA7QUFORjtBQUhEO0FDREU7QURSb0IsQ0FBdkI7O0FBb0JBRixRQUFRaUIsb0JBQVIsR0FBK0IsVUFBQ2YsV0FBRCxFQUFjTSxTQUFkLEVBQXlCQyxNQUF6QjtBQUM5QixNQUFBQyxTQUFBLEVBQUFDLFlBQUE7O0FBQUEsTUFBRyxDQUFDRixNQUFKO0FBQ0NBLGFBQVNHLFFBQVFDLEdBQVIsQ0FBWSxRQUFaLENBQVQ7QUNQQzs7QURRRixNQUFHLENBQUNYLFdBQUo7QUFDQ0Esa0JBQWNVLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUNOQzs7QURRRkgsY0FBWVYsUUFBUWMsV0FBUixDQUFvQlosV0FBcEIsRUFBaUMsSUFBakMsQ0FBWjtBQUNBUyxpQkFBQUQsYUFBQSxPQUFlQSxVQUFXSyxHQUExQixHQUEwQixNQUExQjs7QUFFQSxNQUFHUCxTQUFIO0FBQ0MsV0FBT1UsUUFBUUMsV0FBUixDQUFvQixVQUFVVixNQUFWLEdBQW1CLEdBQW5CLEdBQXlCUCxXQUF6QixHQUF1QyxRQUF2QyxHQUFrRE0sU0FBdEUsRUFBaUYsSUFBakYsQ0FBUDtBQUREO0FBR0MsV0FBT1UsUUFBUUMsV0FBUixDQUFvQixVQUFVVixNQUFWLEdBQW1CLEdBQW5CLEdBQXlCUCxXQUF6QixHQUF1QyxRQUF2QyxHQUFrRFMsWUFBdEUsRUFBb0YsSUFBcEYsQ0FBUDtBQ1BDO0FETDRCLENBQS9COztBQWNBWCxRQUFRb0Isa0JBQVIsR0FBNkIsVUFBQ2xCLFdBQUQsRUFBY00sU0FBZCxFQUF5QkMsTUFBekI7QUFDNUIsTUFBQUMsU0FBQSxFQUFBQyxZQUFBOztBQUFBLE1BQUcsQ0FBQ0YsTUFBSjtBQUNDQSxhQUFTRyxRQUFRQyxHQUFSLENBQVksUUFBWixDQUFUO0FDSkM7O0FES0YsTUFBRyxDQUFDWCxXQUFKO0FBQ0NBLGtCQUFjVSxRQUFRQyxHQUFSLENBQVksYUFBWixDQUFkO0FDSEM7O0FES0ZILGNBQVlWLFFBQVFjLFdBQVIsQ0FBb0JaLFdBQXBCLEVBQWlDLElBQWpDLENBQVo7QUFDQVMsaUJBQUFELGFBQUEsT0FBZUEsVUFBV0ssR0FBMUIsR0FBMEIsTUFBMUI7O0FBRUEsTUFBR1AsU0FBSDtBQUNDLFdBQU8sVUFBVUMsTUFBVixHQUFtQixHQUFuQixHQUF5QlAsV0FBekIsR0FBdUMsUUFBdkMsR0FBa0RNLFNBQXpEO0FBREQ7QUFHQyxXQUFPLFVBQVVDLE1BQVYsR0FBbUIsR0FBbkIsR0FBeUJQLFdBQXpCLEdBQXVDLFFBQXZDLEdBQWtEUyxZQUF6RDtBQ0pDO0FEUjBCLENBQTdCOztBQWNBWCxRQUFRcUIsY0FBUixHQUF5QixVQUFDbkIsV0FBRCxFQUFjTyxNQUFkLEVBQXNCRSxZQUF0QjtBQUN4QixNQUFBVyxHQUFBO0FBQUFBLFFBQU10QixRQUFRdUIsc0JBQVIsQ0FBK0JyQixXQUEvQixFQUE0Q08sTUFBNUMsRUFBb0RFLFlBQXBELENBQU47QUFDQSxTQUFPWCxRQUFRZ0IsY0FBUixDQUF1Qk0sR0FBdkIsQ0FBUDtBQUZ3QixDQUF6Qjs7QUFJQXRCLFFBQVF1QixzQkFBUixHQUFpQyxVQUFDckIsV0FBRCxFQUFjTyxNQUFkLEVBQXNCRSxZQUF0QjtBQUNoQyxTQUFPLFVBQVVGLE1BQVYsR0FBbUIsR0FBbkIsR0FBeUJQLFdBQXpCLEdBQXVDLFFBQXZDLEdBQWtEUyxZQUF6RDtBQURnQyxDQUFqQzs7QUFHQVgsUUFBUXdCLGdCQUFSLEdBQTJCLFVBQUN0QixXQUFELEVBQWNPLE1BQWQsRUFBc0JFLFlBQXRCO0FBQzFCLE1BQUdBLFlBQUg7QUFDQyxXQUFPWCxRQUFRZ0IsY0FBUixDQUF1QixVQUFVUCxNQUFWLEdBQW1CLEdBQW5CLEdBQXlCUCxXQUF6QixHQUF1QyxHQUF2QyxHQUE2Q1MsWUFBN0MsR0FBNEQsT0FBbkYsQ0FBUDtBQUREO0FBR0MsV0FBT1gsUUFBUWdCLGNBQVIsQ0FBdUIsVUFBVVAsTUFBVixHQUFtQixHQUFuQixHQUF5QlAsV0FBekIsR0FBdUMsY0FBOUQsQ0FBUDtBQ0NDO0FETHdCLENBQTNCOztBQU1BRixRQUFReUIsbUJBQVIsR0FBOEIsVUFBQ3ZCLFdBQUQsRUFBY08sTUFBZCxFQUFzQkQsU0FBdEIsRUFBaUNrQixtQkFBakMsRUFBc0RDLGtCQUF0RDtBQUM3QixNQUFHQSxrQkFBSDtBQUNDLFdBQU8zQixRQUFRZ0IsY0FBUixDQUF1QixVQUFVUCxNQUFWLEdBQW1CLEdBQW5CLEdBQXlCUCxXQUF6QixHQUF1QyxHQUF2QyxHQUE2Q00sU0FBN0MsR0FBeUQsR0FBekQsR0FBK0RrQixtQkFBL0QsR0FBcUYsMkJBQXJGLEdBQW1IQyxrQkFBMUksQ0FBUDtBQUREO0FBR0MsV0FBTzNCLFFBQVFnQixjQUFSLENBQXVCLFVBQVVQLE1BQVYsR0FBbUIsR0FBbkIsR0FBeUJQLFdBQXpCLEdBQXVDLEdBQXZDLEdBQTZDTSxTQUE3QyxHQUF5RCxHQUF6RCxHQUErRGtCLG1CQUEvRCxHQUFxRixPQUE1RyxDQUFQO0FDR0M7QURQMkIsQ0FBOUI7O0FBTUExQixRQUFRNEIsMkJBQVIsR0FBc0MsVUFBQzFCLFdBQUQsRUFBYzJCLE9BQWQsRUFBdUJDLFlBQXZCLEVBQXFDQyxVQUFyQztBQUNyQyxNQUFBQyxPQUFBLEVBQUFDLFFBQUEsRUFBQUMsTUFBQSxFQUFBQyxJQUFBLEVBQUFDLGNBQUE7O0FBQUFILGFBQVcsRUFBWDs7QUFDQSxPQUFPL0IsV0FBUDtBQUNDLFdBQU8rQixRQUFQO0FDTUM7O0FETEZELFlBQVVoQyxRQUFRSSxTQUFSLENBQWtCRixXQUFsQixDQUFWO0FBQ0FnQyxXQUFBRixXQUFBLE9BQVNBLFFBQVNFLE1BQWxCLEdBQWtCLE1BQWxCO0FBQ0FDLFNBQUFILFdBQUEsT0FBT0EsUUFBU0csSUFBaEIsR0FBZ0IsTUFBaEI7O0FBQ0FFLElBQUVDLE9BQUYsQ0FBVUosTUFBVixFQUFrQixVQUFDSyxDQUFELEVBQUlDLENBQUo7QUFDakIsUUFBR1YsZ0JBQWlCUyxFQUFFRSxNQUF0QjtBQUNDO0FDT0U7O0FETkgsUUFBR0YsRUFBRUcsSUFBRixLQUFVLFFBQWI7QUNRSSxhRFBIVCxTQUFTVSxJQUFULENBQWM7QUFBQ0MsZUFBTyxNQUFHTCxFQUFFSyxLQUFGLElBQVdKLENBQWQsQ0FBUjtBQUEyQkssZUFBTyxLQUFHTCxDQUFyQztBQUEwQ0wsY0FBTUE7QUFBaEQsT0FBZCxDQ09HO0FEUko7QUNjSSxhRFhIRixTQUFTVSxJQUFULENBQWM7QUFBQ0MsZUFBT0wsRUFBRUssS0FBRixJQUFXSixDQUFuQjtBQUFzQkssZUFBT0wsQ0FBN0I7QUFBZ0NMLGNBQU1BO0FBQXRDLE9BQWQsQ0NXRztBQUtEO0FEdEJKOztBQU9BLE1BQUdOLE9BQUg7QUFDQ1EsTUFBRUMsT0FBRixDQUFVSixNQUFWLEVBQWtCLFVBQUNLLENBQUQsRUFBSUMsQ0FBSjtBQUNqQixVQUFBTSxRQUFBOztBQUFBLFVBQUdoQixnQkFBaUJTLEVBQUVFLE1BQXRCO0FBQ0M7QUNtQkc7O0FEbEJKLFVBQUcsQ0FBQ0YsRUFBRUcsSUFBRixLQUFVLFFBQVYsSUFBc0JILEVBQUVHLElBQUYsS0FBVSxlQUFqQyxLQUFxREgsRUFBRVEsWUFBdkQsSUFBdUVWLEVBQUVXLFFBQUYsQ0FBV1QsRUFBRVEsWUFBYixDQUExRTtBQUVDRCxtQkFBVzlDLFFBQVFJLFNBQVIsQ0FBa0JtQyxFQUFFUSxZQUFwQixDQUFYOztBQUNBLFlBQUdELFFBQUg7QUNtQk0saUJEbEJMVCxFQUFFQyxPQUFGLENBQVVRLFNBQVNaLE1BQW5CLEVBQTJCLFVBQUNlLEVBQUQsRUFBS0MsRUFBTDtBQ21CcEIsbUJEbEJOakIsU0FBU1UsSUFBVCxDQUFjO0FBQUNDLHFCQUFTLENBQUNMLEVBQUVLLEtBQUYsSUFBV0osQ0FBWixJQUFjLElBQWQsSUFBa0JTLEdBQUdMLEtBQUgsSUFBWU0sRUFBOUIsQ0FBVjtBQUE4Q0wscUJBQVVMLElBQUUsR0FBRixHQUFLVSxFQUE3RDtBQUFtRWYsb0JBQUFXLFlBQUEsT0FBTUEsU0FBVVgsSUFBaEIsR0FBZ0I7QUFBbkYsYUFBZCxDQ2tCTTtBRG5CUCxZQ2tCSztBRHRCUDtBQzhCSTtBRGpDTDtBQ21DQzs7QUQxQkYsTUFBR0osVUFBSDtBQUNDSyxxQkFBaUJwQyxRQUFRbUQsaUJBQVIsQ0FBMEJqRCxXQUExQixDQUFqQjs7QUFDQW1DLE1BQUVlLElBQUYsQ0FBT2hCLGNBQVAsRUFBdUIsVUFBQWlCLEtBQUE7QUM0Qm5CLGFENUJtQixVQUFDQyxjQUFEO0FBQ3RCLFlBQUFDLGFBQUEsRUFBQUMsY0FBQTtBQUFBQSx5QkFBaUJ4RCxRQUFRNEIsMkJBQVIsQ0FBb0MwQixlQUFlcEQsV0FBbkQsRUFBZ0UsS0FBaEUsRUFBdUUsS0FBdkUsRUFBOEUsS0FBOUUsQ0FBakI7QUFDQXFELHdCQUFnQnZELFFBQVFJLFNBQVIsQ0FBa0JrRCxlQUFlcEQsV0FBakMsQ0FBaEI7QUM4QkssZUQ3QkxtQyxFQUFFZSxJQUFGLENBQU9JLGNBQVAsRUFBdUIsVUFBQ0MsYUFBRDtBQUN0QixjQUFHSCxlQUFlSSxXQUFmLEtBQThCRCxjQUFjWixLQUEvQztBQzhCUSxtQkQ3QlBaLFNBQVNVLElBQVQsQ0FBYztBQUFDQyxxQkFBUyxDQUFDVyxjQUFjWCxLQUFkLElBQXVCVyxjQUFjSSxJQUF0QyxJQUEyQyxJQUEzQyxHQUErQ0YsY0FBY2IsS0FBdkU7QUFBZ0ZDLHFCQUFVVSxjQUFjSSxJQUFkLEdBQW1CLEdBQW5CLEdBQXNCRixjQUFjWixLQUE5SDtBQUF1SVYsb0JBQUFvQixpQkFBQSxPQUFNQSxjQUFlcEIsSUFBckIsR0FBcUI7QUFBNUosYUFBZCxDQzZCTztBQUtEO0FEcENSLFVDNkJLO0FEaENpQixPQzRCbkI7QUQ1Qm1CLFdBQXZCO0FDMkNDOztBRHJDRixTQUFPRixRQUFQO0FBaENxQyxDQUF0Qzs7QUFtQ0FqQyxRQUFRNEQsMkJBQVIsR0FBc0MsVUFBQzFELFdBQUQ7QUFDckMsTUFBQThCLE9BQUEsRUFBQUMsUUFBQSxFQUFBQyxNQUFBLEVBQUFDLElBQUEsRUFBQTBCLGlCQUFBOztBQUFBNUIsYUFBVyxFQUFYOztBQUNBLE9BQU8vQixXQUFQO0FBQ0MsV0FBTytCLFFBQVA7QUN3Q0M7O0FEdkNGRCxZQUFVaEMsUUFBUUksU0FBUixDQUFrQkYsV0FBbEIsQ0FBVjtBQUNBZ0MsV0FBQUYsV0FBQSxPQUFTQSxRQUFTRSxNQUFsQixHQUFrQixNQUFsQjtBQUNBMkIsc0JBQW9CN0QsUUFBUThELFNBQVIsQ0FBa0I1RCxXQUFsQixDQUFwQjtBQUNBaUMsU0FBQUgsV0FBQSxPQUFPQSxRQUFTRyxJQUFoQixHQUFnQixNQUFoQjs7QUFDQUUsSUFBRUMsT0FBRixDQUFVSixNQUFWLEVBQWtCLFVBQUNLLENBQUQsRUFBSUMsQ0FBSjtBQUVqQixRQUFHLENBQUNILEVBQUUwQixPQUFGLENBQVUsQ0FBQyxNQUFELEVBQVEsUUFBUixFQUFrQixVQUFsQixFQUE4QixVQUE5QixFQUEwQyxRQUExQyxFQUFvRCxRQUFwRCxFQUE4RCxPQUE5RCxFQUF1RSxVQUF2RSxFQUFtRixNQUFuRixDQUFWLEVBQXNHeEIsRUFBRUcsSUFBeEcsQ0FBRCxJQUFtSCxDQUFDSCxFQUFFRSxNQUF6SDtBQUVDLFVBQUcsQ0FBQyxRQUFRdUIsSUFBUixDQUFheEIsQ0FBYixDQUFELElBQXFCSCxFQUFFNEIsT0FBRixDQUFVSixpQkFBVixFQUE2QnJCLENBQTdCLElBQWtDLENBQUMsQ0FBM0Q7QUN1Q0ssZUR0Q0pQLFNBQVNVLElBQVQsQ0FBYztBQUFDQyxpQkFBT0wsRUFBRUssS0FBRixJQUFXSixDQUFuQjtBQUFzQkssaUJBQU9MLENBQTdCO0FBQWdDTCxnQkFBTUE7QUFBdEMsU0FBZCxDQ3NDSTtBRHpDTjtBQytDRztBRGpESjs7QUFPQSxTQUFPRixRQUFQO0FBZnFDLENBQXRDOztBQWlCQWpDLFFBQVFrRSxxQkFBUixHQUFnQyxVQUFDaEUsV0FBRDtBQUMvQixNQUFBOEIsT0FBQSxFQUFBQyxRQUFBLEVBQUFDLE1BQUEsRUFBQUMsSUFBQSxFQUFBMEIsaUJBQUE7O0FBQUE1QixhQUFXLEVBQVg7O0FBQ0EsT0FBTy9CLFdBQVA7QUFDQyxXQUFPK0IsUUFBUDtBQytDQzs7QUQ5Q0ZELFlBQVVoQyxRQUFRSSxTQUFSLENBQWtCRixXQUFsQixDQUFWO0FBQ0FnQyxXQUFBRixXQUFBLE9BQVNBLFFBQVNFLE1BQWxCLEdBQWtCLE1BQWxCO0FBQ0EyQixzQkFBb0I3RCxRQUFROEQsU0FBUixDQUFrQjVELFdBQWxCLENBQXBCO0FBQ0FpQyxTQUFBSCxXQUFBLE9BQU9BLFFBQVNHLElBQWhCLEdBQWdCLE1BQWhCOztBQUNBRSxJQUFFQyxPQUFGLENBQVVKLE1BQVYsRUFBa0IsVUFBQ0ssQ0FBRCxFQUFJQyxDQUFKO0FBQ2pCLFFBQUcsQ0FBQ0gsRUFBRTBCLE9BQUYsQ0FBVSxDQUFDLE1BQUQsRUFBUSxRQUFSLEVBQWtCLFVBQWxCLEVBQThCLFVBQTlCLEVBQTBDLFFBQTFDLEVBQW9ELFVBQXBELEVBQWdFLE1BQWhFLENBQVYsRUFBbUZ4QixFQUFFRyxJQUFyRixDQUFKO0FBQ0MsVUFBRyxDQUFDLFFBQVFzQixJQUFSLENBQWF4QixDQUFiLENBQUQsSUFBcUJILEVBQUU0QixPQUFGLENBQVVKLGlCQUFWLEVBQTZCckIsQ0FBN0IsSUFBa0MsQ0FBQyxDQUEzRDtBQ2dESyxlRC9DSlAsU0FBU1UsSUFBVCxDQUFjO0FBQUNDLGlCQUFPTCxFQUFFSyxLQUFGLElBQVdKLENBQW5CO0FBQXNCSyxpQkFBT0wsQ0FBN0I7QUFBZ0NMLGdCQUFNQTtBQUF0QyxTQUFkLENDK0NJO0FEakROO0FDdURHO0FEeERKOztBQUlBLFNBQU9GLFFBQVA7QUFaK0IsQ0FBaEMsQyxDQWNBOzs7Ozs7OztBQU9BakMsUUFBUW1FLDBCQUFSLEdBQXFDLFVBQUNDLE9BQUQsRUFBVWxDLE1BQVYsRUFBa0JtQyxhQUFsQjtBQUNwQyxPQUFPRCxPQUFQO0FBQ0NBLGNBQVUsRUFBVjtBQzBEQzs7QUR6REYsT0FBT0MsYUFBUDtBQUNDQSxvQkFBZ0IsRUFBaEI7QUMyREM7O0FEMURGLE1BQUFBLGlCQUFBLE9BQUdBLGNBQWVDLE1BQWxCLEdBQWtCLE1BQWxCO0FBQ0NELGtCQUFjL0IsT0FBZCxDQUFzQixVQUFDaUMsQ0FBRDtBQUNyQixVQUFHbEMsRUFBRVcsUUFBRixDQUFXdUIsQ0FBWCxDQUFIO0FBQ0NBLFlBQ0M7QUFBQUMsaUJBQU9ELENBQVA7QUFDQUUsb0JBQVU7QUFEVixTQUREO0FDK0RHOztBRDVESixVQUFHdkMsT0FBT3FDLEVBQUVDLEtBQVQsS0FBb0IsQ0FBQ25DLEVBQUVxQyxTQUFGLENBQVlOLE9BQVosRUFBb0I7QUFBQ0ksZUFBTUQsRUFBRUM7QUFBVCxPQUFwQixDQUF4QjtBQ2dFSyxlRC9ESkosUUFBUXpCLElBQVIsQ0FDQztBQUFBNkIsaUJBQU9ELEVBQUVDLEtBQVQ7QUFDQUcsc0JBQVksSUFEWjtBQUVBQyx1QkFBYUwsRUFBRUU7QUFGZixTQURELENDK0RJO0FBS0Q7QUQxRUw7QUM0RUM7O0FEbEVGTCxVQUFROUIsT0FBUixDQUFnQixVQUFDdUMsVUFBRDtBQUNmLFFBQUFDLFVBQUE7QUFBQUEsaUJBQWFULGNBQWNVLElBQWQsQ0FBbUIsVUFBQ1IsQ0FBRDtBQUFNLGFBQU9BLE1BQUtNLFdBQVdMLEtBQWhCLElBQXlCRCxFQUFFQyxLQUFGLEtBQVdLLFdBQVdMLEtBQXREO0FBQXpCLE1BQWI7O0FBQ0EsUUFBR25DLEVBQUVXLFFBQUYsQ0FBVzhCLFVBQVgsQ0FBSDtBQUNDQSxtQkFDQztBQUFBTixlQUFPTSxVQUFQO0FBQ0FMLGtCQUFVO0FBRFYsT0FERDtBQzBFRTs7QUR2RUgsUUFBR0ssVUFBSDtBQUNDRCxpQkFBV0YsVUFBWCxHQUF3QixJQUF4QjtBQ3lFRyxhRHhFSEUsV0FBV0QsV0FBWCxHQUF5QkUsV0FBV0wsUUN3RWpDO0FEMUVKO0FBSUMsYUFBT0ksV0FBV0YsVUFBbEI7QUN5RUcsYUR4RUgsT0FBT0UsV0FBV0QsV0N3RWY7QUFDRDtBRHBGSjtBQVlBLFNBQU9SLE9BQVA7QUE1Qm9DLENBQXJDOztBQThCQXBFLFFBQVFnRixlQUFSLEdBQTBCLFVBQUM5RSxXQUFELEVBQWNNLFNBQWQsRUFBeUJ5RSxhQUF6QixFQUF3Q0MsTUFBeEM7QUFFekIsTUFBQUMsVUFBQSxFQUFBQyxHQUFBLEVBQUFDLE1BQUEsRUFBQWxGLEdBQUEsRUFBQW1GLElBQUEsRUFBQUMsSUFBQTs7QUFBQSxNQUFHLENBQUNyRixXQUFKO0FBQ0NBLGtCQUFjVSxRQUFRQyxHQUFSLENBQVksYUFBWixDQUFkO0FDNEVDOztBRDFFRixNQUFHLENBQUNMLFNBQUo7QUFDQ0EsZ0JBQVlJLFFBQVFDLEdBQVIsQ0FBWSxXQUFaLENBQVo7QUM0RUM7O0FEM0VGLE1BQUdqQixPQUFPNEYsUUFBVjtBQUNDLFFBQUd0RixnQkFBZVUsUUFBUUMsR0FBUixDQUFZLGFBQVosQ0FBZixJQUE4Q0wsY0FBYUksUUFBUUMsR0FBUixDQUFZLFdBQVosQ0FBOUQ7QUFDQyxXQUFBVixNQUFBc0YsU0FBQUMsUUFBQSxjQUFBdkYsSUFBd0JrRixNQUF4QixHQUF3QixNQUF4QjtBQUNDLGdCQUFBQyxPQUFBRyxTQUFBQyxRQUFBLGVBQUFILE9BQUFELEtBQUFELE1BQUEsWUFBQUUsS0FBb0MxRSxHQUFwQyxLQUFPLE1BQVAsR0FBTyxNQUFQO0FBRkY7QUFBQTtBQUlDLGFBQU9iLFFBQVEyRixLQUFSLENBQWM5RSxHQUFkLENBQWtCWCxXQUFsQixFQUErQk0sU0FBL0IsRUFBMEN5RSxhQUExQyxFQUF5REMsTUFBekQsQ0FBUDtBQUxGO0FDb0ZFOztBRDdFRkUsUUFBTXBGLFFBQVFJLFNBQVIsQ0FBa0JGLFdBQWxCLENBQU47O0FBRUEsTUFBR2tGLElBQUlRLGFBQUosS0FBcUIsUUFBckIsSUFBaUMsQ0FBQ1IsSUFBSVEsYUFBekM7QUFDQ1QsaUJBQWFuRixRQUFRNkYsYUFBUixDQUFzQjNGLFdBQXRCLENBQWI7O0FBQ0EsUUFBR2lGLFVBQUg7QUFDQ0UsZUFBU0YsV0FBV1csT0FBWCxDQUFtQnRGLFNBQW5CLENBQVQ7QUFDQSxhQUFPNkUsTUFBUDtBQUpGO0FBQUEsU0FLSyxJQUFHbkYsZUFBZU0sU0FBbEI7QUFDSixXQUFPUixRQUFRMkYsS0FBUixDQUFjOUUsR0FBZCxDQUFrQlgsV0FBbEIsRUFBK0JNLFNBQS9CLEVBQTBDeUUsYUFBMUMsRUFBeURDLE1BQXpELENBQVA7QUMrRUM7QURyR3VCLENBQTFCOztBQXdCQWxGLFFBQVErRixtQkFBUixHQUE4QixVQUFDVixNQUFELEVBQVNuRixXQUFUO0FBQzdCLE1BQUE4RixjQUFBLEVBQUE3RixHQUFBOztBQUFBLE9BQU9rRixNQUFQO0FBQ0NBLGFBQVNyRixRQUFRZ0YsZUFBUixFQUFUO0FDa0ZDOztBRGpGRixNQUFHSyxNQUFIO0FBRUNXLHFCQUFvQjlGLGdCQUFlLGVBQWYsR0FBb0MsTUFBcEMsR0FBSCxDQUFBQyxNQUFBSCxRQUFBSSxTQUFBLENBQUFGLFdBQUEsYUFBQUMsSUFBbUY4RixjQUFuRixHQUFtRixNQUFwRzs7QUFDQSxRQUFHWixVQUFXVyxjQUFkO0FBQ0MsYUFBT1gsT0FBT3pDLEtBQVAsSUFBZ0J5QyxPQUFPVyxjQUFQLENBQXZCO0FBSkY7QUN1RkU7QUQxRjJCLENBQTlCOztBQVNBaEcsUUFBUWtHLE1BQVIsR0FBaUIsVUFBQ3pGLE1BQUQ7QUFDaEIsTUFBQTBGLFFBQUEsRUFBQUMsVUFBQTtBQUFBRCxhQUFXdkYsUUFBUUMsR0FBUixDQUFZLFlBQVosS0FBNkJELFFBQVFDLEdBQVIsQ0FBWSxXQUFaLENBQXhDOztBQUNBLE9BQU9zRixRQUFQO0FBQ0MsV0FBTyxFQUFQO0FDc0ZDOztBRHJGRkMsZUFBYUQsU0FBU3BCLElBQVQsQ0FBYyxVQUFDc0IsUUFBRDtBQUMxQixXQUFPQSxTQUFTQyxFQUFULEtBQWU3RixNQUF0QjtBQURZLElBQWI7QUFFQSxTQUFPMkYsVUFBUDtBQU5nQixDQUFqQjs7QUFRQXBHLFFBQVF1RyxlQUFSLEdBQTBCLFVBQUM5RixNQUFEO0FBQ3pCLE1BQUErRixHQUFBLEVBQUFDLFNBQUE7QUFBQUQsUUFBTXhHLFFBQVFrRyxNQUFSLENBQWV6RixNQUFmLENBQU47O0FBQ0EsTUFBRyxDQUFDK0YsR0FBSjtBQUNDO0FDMEZDOztBRHpGRkMsY0FBWSxJQUFaOztBQUNBcEUsSUFBRWUsSUFBRixDQUFPcEQsUUFBUTBHLFVBQWYsRUFBMkIsVUFBQ2hILENBQUQsRUFBSThDLENBQUo7QUFDMUIsUUFBQXJDLEdBQUE7O0FBQUEsVUFBQUEsTUFBQVQsRUFBQWlILElBQUEsWUFBQXhHLElBQVc4RCxPQUFYLENBQW1CdUMsSUFBSXpGLEdBQXZCLElBQUcsTUFBSCxJQUE4QixDQUFDLENBQS9CO0FDNEZJLGFEM0ZIMEYsWUFBWS9HLENDMkZUO0FBQ0Q7QUQ5Rko7O0FBR0EsU0FBTytHLFNBQVA7QUFSeUIsQ0FBMUI7O0FBVUF6RyxRQUFRNEcsd0JBQVIsR0FBbUMsVUFBQ25HLE1BQUQ7QUFDbEMsTUFBQStGLEdBQUE7QUFBQUEsUUFBTXhHLFFBQVFrRyxNQUFSLENBQWV6RixNQUFmLENBQU47O0FBQ0EsTUFBRyxDQUFDK0YsR0FBRCxJQUFRLElBQVgsR0NpR0U7QURuR2dDLENBQW5DOztBQU1BeEcsUUFBUTZHLGlCQUFSLEdBQTRCLFVBQUNwRyxNQUFEO0FBQzNCLE1BQUErRixHQUFBLEVBQUFNLFVBQUEsRUFBQUMsUUFBQSxFQUFBQyxPQUFBO0FBQUFSLFFBQU14RyxRQUFRa0csTUFBUixDQUFlekYsTUFBZixDQUFOOztBQUNBLE1BQUcsQ0FBQytGLEdBQUo7QUFDQztBQ2tHQzs7QURqR0ZPLGFBQVc3RixRQUFRNkYsUUFBUixFQUFYO0FBQ0FELGVBQWdCQyxXQUFjUCxJQUFJUyxjQUFsQixHQUFzQ1QsSUFBSVEsT0FBMUQ7QUFDQUEsWUFBVSxFQUFWOztBQUNBLE1BQUdSLEdBQUg7QUFDQ25FLE1BQUVlLElBQUYsQ0FBTzBELFVBQVAsRUFBbUIsVUFBQ3BILENBQUQ7QUFDbEIsVUFBQTBGLEdBQUE7QUFBQUEsWUFBTXBGLFFBQVFJLFNBQVIsQ0FBa0JWLENBQWxCLENBQU47O0FBQ0EsVUFBQTBGLE9BQUEsT0FBR0EsSUFBSzhCLFdBQUwsQ0FBaUJyRyxHQUFqQixHQUF1QnNHLFNBQTFCLEdBQTBCLE1BQTFCO0FDb0dLLGVEbkdKSCxRQUFRckUsSUFBUixDQUFhakQsQ0FBYixDQ21HSTtBQUNEO0FEdkdMO0FDeUdDOztBRHJHRixTQUFPc0gsT0FBUDtBQVoyQixDQUE1Qjs7QUFjQWhILFFBQVFvSCxlQUFSLEdBQTBCLFVBQUM5RixHQUFELEVBQU0rRixrQkFBTjtBQUV6QixNQUFBQyxjQUFBLEVBQUFDLE9BQUEsRUFBQUMsTUFBQTtBQUFBQSxXQUFTLEVBQVQ7QUFDQUEsU0FBTyxZQUFQLElBQXVCdEcsUUFBUXVHLE9BQVIsRUFBdkI7QUFDQUQsU0FBTyxXQUFQLElBQXNCdEcsUUFBUXdHLE1BQVIsRUFBdEI7QUFDQUYsU0FBTyxlQUFQLElBQTBCdEcsUUFBUXlHLGlCQUFSLEVBQTFCO0FBQ0FILFNBQU8sY0FBUCxJQUF5QkksU0FBU0MsaUJBQVQsRUFBekI7O0FBQ0EsTUFBRzNHLFFBQVE0RyxZQUFSLENBQXFCeEcsR0FBckIsQ0FBSDtBQUNDQSxVQUFNSixRQUFRNkcscUJBQVIsQ0FBOEJ6RyxHQUE5QixFQUFtQytGLGtCQUFuQyxFQUF1RCxHQUF2RCxFQUE0RHJILFFBQVFnSSxZQUFwRSxDQUFOO0FDd0dDOztBRHJHRlYsbUJBQWlCLHVCQUF1QnRELElBQXZCLENBQTRCMUMsR0FBNUIsQ0FBakI7QUFDQWlHLFlBQWFELGlCQUFvQixHQUFwQixHQUE2QixHQUExQztBQUNBLFNBQU8sS0FBR2hHLEdBQUgsR0FBU2lHLE9BQVQsR0FBbUJVLEVBQUVDLEtBQUYsQ0FBUVYsTUFBUixDQUExQjtBQWJ5QixDQUExQjs7QUFlQXhILFFBQVFtSSxVQUFSLEdBQXFCLFVBQUMxSCxNQUFELEVBQVMySCxPQUFUO0FBQ3BCLE1BQUFDLEtBQUE7QUFBQUEsVUFBUXJJLFFBQVFzSSxXQUFSLENBQW9CN0gsTUFBcEIsQ0FBUjtBQUNBLFNBQU80SCxTQUFTQSxNQUFNdEQsSUFBTixDQUFXLFVBQUN3RCxJQUFEO0FBQVMsV0FBT0EsS0FBS2pDLEVBQUwsS0FBVzhCLE9BQWxCO0FBQXBCLElBQWhCO0FBRm9CLENBQXJCOztBQUlBcEksUUFBUXdJLHdCQUFSLEdBQW1DLFVBQUNELElBQUQ7QUFFbEMsU0FBT3ZJLFFBQVFvSCxlQUFSLENBQXdCbUIsS0FBS0UsSUFBN0IsRUFBbUNGLElBQW5DLENBQVA7QUFGa0MsQ0FBbkM7O0FBSUF2SSxRQUFRMEksYUFBUixHQUF3QixVQUFDSCxJQUFEO0FBQ3ZCLE1BQUFqSCxHQUFBO0FBQUFBLFFBQU1pSCxLQUFLRSxJQUFYOztBQUNBLE1BQUdGLEtBQUs3RixJQUFMLEtBQWEsS0FBaEI7QUFDQyxRQUFHNkYsS0FBS0ksTUFBUjtBQUNDLGFBQU8zSSxRQUFRd0ksd0JBQVIsQ0FBaUNELElBQWpDLENBQVA7QUFERDtBQUlDLGFBQU8sdUJBQXFCQSxLQUFLakMsRUFBakM7QUFMRjtBQUFBO0FBT0MsV0FBT2lDLEtBQUtFLElBQVo7QUM2R0M7QUR0SHFCLENBQXhCOztBQVdBekksUUFBUXNJLFdBQVIsR0FBc0IsVUFBQzdILE1BQUQ7QUFDckIsTUFBQTBGLFFBQUEsRUFBQXlDLGNBQUE7QUFBQXpDLGFBQVd2RixRQUFRQyxHQUFSLENBQVksWUFBWixLQUE2QkQsUUFBUUMsR0FBUixDQUFZLFdBQVosQ0FBeEM7O0FBQ0EsT0FBT3NGLFFBQVA7QUFDQyxXQUFPLEVBQVA7QUNnSEM7O0FEL0dGeUMsbUJBQWlCekMsU0FBU3BCLElBQVQsQ0FBYyxVQUFDc0IsUUFBRDtBQUM5QixXQUFPQSxTQUFTQyxFQUFULEtBQWU3RixNQUF0QjtBQURnQixJQUFqQjs7QUFFQSxNQUFHbUksY0FBSDtBQUNDLFdBQU9BLGVBQWVDLFFBQXRCO0FDa0hDO0FEekhtQixDQUF0Qjs7QUFTQTdJLFFBQVE4SSxhQUFSLEdBQXdCO0FBQ3ZCLE1BQUFDLElBQUEsRUFBQWhDLFFBQUEsRUFBQWlDLE9BQUE7QUFBQWpDLGFBQVc3RixRQUFRNkYsUUFBUixFQUFYO0FBQ0FnQyxTQUFPLEVBQVA7O0FBQ0EsTUFBR2hDLFFBQUg7QUFDQ2dDLFNBQUtFLE1BQUwsR0FBY2xDLFFBQWQ7QUNxSEM7O0FEcEhGaUMsWUFBVTtBQUNUdEcsVUFBTSxLQURHO0FBRVRxRyxVQUFNQSxJQUZHO0FBR1RHLGFBQVMsVUFBQ0gsSUFBRDtBQ3NITCxhRHJISG5JLFFBQVF1SSxHQUFSLENBQVksV0FBWixFQUF5QkosSUFBekIsQ0NxSEc7QUR6SEs7QUFBQSxHQUFWO0FDNEhDLFNBQU8sT0FBTzdILE9BQVAsS0FBbUIsV0FBbkIsSUFBa0NBLFlBQVksSUFBOUMsR0R0SFJBLFFBQVNrSSxXQUFULENBQXFCLHlCQUFyQixFQUFnREosT0FBaEQsQ0NzSFEsR0R0SFIsTUNzSEM7QURqSXNCLENBQXhCOztBQWFBaEosUUFBUXFKLG1CQUFSLEdBQThCLFVBQUMxQyxJQUFELEVBQU8yQyxhQUFQO0FBQzdCLE1BQUFDLFFBQUEsRUFBQUMsV0FBQSxFQUFBQyxVQUFBO0FBQUFGLGFBQVcsTUFBWDtBQUNBRSxlQUFhLE1BQWI7O0FBQ0FwSCxJQUFFZSxJQUFGLENBQU91RCxJQUFQLEVBQWEsVUFBQ0gsR0FBRCxFQUFNa0QsR0FBTjtBQUNaLFFBQUcsQ0FBQ2xELElBQUl6RixHQUFSO0FBQ0N5RixVQUFJekYsR0FBSixHQUFVMkksR0FBVjtBQ3lIRTs7QUR4SEgsUUFBR2xELElBQUltRCxVQUFQO0FBT0NuRCxVQUFJb0QsT0FBSixHQUFjLEtBQWQ7QUNzSEU7QURoSUo7O0FBWUFILGVBQWFwSCxFQUFFd0gsTUFBRixDQUFTeEgsRUFBRXlILE1BQUYsQ0FBU25ELElBQVQsQ0FBVCxFQUF5QixNQUF6QixDQUFiO0FBQ0E2QyxnQkFBYyxFQUFkO0FBQ0FELGFBQVcsRUFBWDs7QUFFQWxILElBQUVlLElBQUYsQ0FBT3FHLFVBQVAsRUFBbUIsVUFBQ2xGLENBQUQ7QUFDbEIsUUFBR0EsRUFBRXhELEdBQUYsS0FBUyxPQUFaO0FDc0hJLGFEckhId0ksV0FBV2hGLENDcUhSO0FEdEhKO0FDd0hJLGFEckhIaUYsWUFBWWpGLEVBQUV4RCxHQUFkLElBQXFCd0QsQ0NxSGxCO0FBQ0Q7QUQxSEo7O0FBTUFpRixjQUFZTyxLQUFaLEdBQW9CUixRQUFwQjs7QUFDQSxNQUFHRCxjQUFjaEYsTUFBakI7QUFDQ2pDLE1BQUVlLElBQUYsQ0FBT29HLFdBQVAsRUFBb0IsVUFBQ2hELEdBQUQsRUFBTWtELEdBQU47QUFDbkIsVUFBR0osY0FBY3JGLE9BQWQsQ0FBc0J5RixHQUF0QixJQUE2QixDQUFDLENBQWpDO0FBQ0NsRCxZQUFJb0QsT0FBSixHQUFjcEQsSUFBSW1ELFVBQWxCO0FBREQ7QUFHQ25ELFlBQUlvRCxPQUFKLEdBQWMsS0FBZDtBQ3VIRztBRDNITDtBQzZIQzs7QUFDRCxTRHhIREosV0N3SEM7QUR6SjRCLENBQTlCOztBQW1DQXhKLFFBQVFnSyxtQkFBUixHQUE4QixVQUFDUixXQUFELEVBQWNTLFlBQWQ7QUFDN0IsTUFBQXRELElBQUE7O0FDMEhDLE1BQUlzRCxnQkFBZ0IsSUFBcEIsRUFBMEI7QUQzSGdCQSxtQkFBZSxJQUFmO0FDNkh6Qzs7QUQ1SEZ0RCxTQUFPLEVBQVA7O0FBQ0F0RSxJQUFFZSxJQUFGLENBQU9vRyxXQUFQLEVBQW9CLFVBQUM5SixDQUFELEVBQUk4QyxDQUFKO0FBQ25CLFFBQUc5QyxFQUFFa0ssT0FBRixLQUFhLEtBQWIsSUFBdUJsSyxFQUFFcUIsR0FBRixLQUFTLE9BQWhDLElBQTJDa0osZ0JBQWlCdkssRUFBRXFCLEdBQUYsS0FBUyxPQUF4RTtBQUNDNEYsV0FBS2hFLElBQUwsQ0FBVWpELENBQVY7QUM4SEU7QURoSUo7O0FDa0lDLFNEOUhEaUgsSUM4SEM7QURwSTRCLENBQTlCOztBQVFBM0csUUFBUWtLLGNBQVIsR0FBeUIsVUFBQ0QsWUFBRDtBQUN4QixNQUFBRSxTQUFBLEVBQUFYLFdBQUE7QUFBQVcsY0FBWW5LLFFBQVFvSyxPQUFSLENBQWdCdkosR0FBaEIsRUFBWjtBQUNBMkksZ0JBQWNhLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCdEssUUFBUXVLLElBQTFCLEVBQWdDO0FBQUM1RCxVQUFNd0Q7QUFBUCxHQUFoQyxDQUFkO0FBQ0EsU0FBT25LLFFBQVFnSyxtQkFBUixDQUE0QlIsV0FBNUIsRUFBeUNTLFlBQXpDLENBQVA7QUFId0IsQ0FBekI7O0FBS0FqSyxRQUFRd0sscUJBQVIsR0FBZ0M7QUFDL0IsTUFBQTdELElBQUEsRUFBQUssT0FBQSxFQUFBeUQsa0JBQUE7QUFBQTlELFNBQU8zRyxRQUFRa0ssY0FBUixFQUFQO0FBQ0FPLHVCQUFxQnBJLEVBQUVxSSxPQUFGLENBQVVySSxFQUFFc0ksS0FBRixDQUFRaEUsSUFBUixFQUFhLFNBQWIsQ0FBVixDQUFyQjtBQUNBSyxZQUFVM0UsRUFBRXVJLE1BQUYsQ0FBUzVLLFFBQVE2SyxPQUFqQixFQUEwQixVQUFDekYsR0FBRDtBQUNuQyxRQUFHcUYsbUJBQW1CeEcsT0FBbkIsQ0FBMkJtQixJQUFJekIsSUFBL0IsSUFBdUMsQ0FBMUM7QUFDQyxhQUFPLEtBQVA7QUFERDtBQUdDLGFBQU8sSUFBUDtBQ3FJRTtBRHpJTSxJQUFWO0FBS0FxRCxZQUFVQSxRQUFROEQsSUFBUixDQUFhOUssUUFBUStLLGFBQVIsQ0FBc0JDLElBQXRCLENBQTJCO0FBQUN0QixTQUFJO0FBQUwsR0FBM0IsQ0FBYixDQUFWO0FBQ0ExQyxZQUFVM0UsRUFBRXNJLEtBQUYsQ0FBUTNELE9BQVIsRUFBZ0IsTUFBaEIsQ0FBVjtBQUNBLFNBQU8zRSxFQUFFNEksSUFBRixDQUFPakUsT0FBUCxDQUFQO0FBVitCLENBQWhDOztBQVlBaEgsUUFBUWtMLGNBQVIsR0FBeUI7QUFDeEIsTUFBQWxFLE9BQUEsRUFBQW1FLFdBQUE7QUFBQW5FLFlBQVUsRUFBVjtBQUNBbUUsZ0JBQWMsRUFBZDs7QUFDQTlJLElBQUVDLE9BQUYsQ0FBVXRDLFFBQVF1SyxJQUFsQixFQUF3QixVQUFDL0QsR0FBRDtBQUN2QjJFLGtCQUFjOUksRUFBRXVJLE1BQUYsQ0FBU3BFLElBQUlRLE9BQWIsRUFBc0IsVUFBQzVCLEdBQUQ7QUFDbkMsYUFBTyxDQUFDQSxJQUFJM0MsTUFBWjtBQURhLE1BQWQ7QUM2SUUsV0QzSUZ1RSxVQUFVQSxRQUFRb0UsTUFBUixDQUFlRCxXQUFmLENDMklSO0FEOUlIOztBQUlBLFNBQU85SSxFQUFFNEksSUFBRixDQUFPakUsT0FBUCxDQUFQO0FBUHdCLENBQXpCOztBQVNBaEgsUUFBUXFMLGVBQVIsR0FBMEIsVUFBQ2pILE9BQUQsRUFBVWtILEtBQVY7QUFDekIsTUFBQUMsQ0FBQSxFQUFBQyxRQUFBLEVBQUFDLFlBQUEsRUFBQUMsYUFBQSxFQUFBQyxJQUFBLEVBQUFDLEtBQUEsRUFBQUMsSUFBQTtBQUFBSixpQkFBZXBKLEVBQUV5SixHQUFGLENBQU0xSCxPQUFOLEVBQWUsVUFBQ2dCLEdBQUQ7QUFDN0IsUUFBRy9DLEVBQUUwSixPQUFGLENBQVUzRyxHQUFWLENBQUg7QUFDQyxhQUFPLEtBQVA7QUFERDtBQUdDLGFBQU9BLEdBQVA7QUMrSUU7QURuSlcsSUFBZjtBQUtBcUcsaUJBQWVwSixFQUFFMkosT0FBRixDQUFVUCxZQUFWLENBQWY7QUFDQUQsYUFBVyxFQUFYO0FBQ0FFLGtCQUFnQkQsYUFBYW5ILE1BQTdCOztBQUNBLE1BQUdnSCxLQUFIO0FBRUNBLFlBQVFBLE1BQU1XLE9BQU4sQ0FBYyxLQUFkLEVBQXFCLEVBQXJCLEVBQXlCQSxPQUF6QixDQUFpQyxNQUFqQyxFQUF5QyxHQUF6QyxDQUFSOztBQUdBLFFBQUcsY0FBY2pJLElBQWQsQ0FBbUJzSCxLQUFuQixDQUFIO0FBQ0NFLGlCQUFXLFNBQVg7QUM4SUU7O0FENUlILFFBQUcsQ0FBQ0EsUUFBSjtBQUNDSSxjQUFRTixNQUFNWSxLQUFOLENBQVksT0FBWixDQUFSOztBQUNBLFVBQUcsQ0FBQ04sS0FBSjtBQUNDSixtQkFBVyw0QkFBWDtBQUREO0FBR0NJLGNBQU10SixPQUFOLENBQWMsVUFBQzZKLENBQUQ7QUFDYixjQUFHQSxJQUFJLENBQUosSUFBU0EsSUFBSVQsYUFBaEI7QUM4SU8sbUJEN0lORixXQUFXLHNCQUFvQlcsQ0FBcEIsR0FBc0IsR0M2STNCO0FBQ0Q7QURoSlA7QUFJQVIsZUFBTyxDQUFQOztBQUNBLGVBQU1BLFFBQVFELGFBQWQ7QUFDQyxjQUFHLENBQUNFLE1BQU1RLFFBQU4sQ0FBZSxLQUFHVCxJQUFsQixDQUFKO0FBQ0NILHVCQUFXLDRCQUFYO0FDK0lLOztBRDlJTkc7QUFYRjtBQUZEO0FDK0pHOztBRGhKSCxRQUFHLENBQUNILFFBQUo7QUFFQ0ssYUFBT1AsTUFBTVksS0FBTixDQUFZLGFBQVosQ0FBUDs7QUFDQSxVQUFHTCxJQUFIO0FBQ0NBLGFBQUt2SixPQUFMLENBQWEsVUFBQytKLENBQUQ7QUFDWixjQUFHLENBQUMsZUFBZXJJLElBQWYsQ0FBb0JxSSxDQUFwQixDQUFKO0FDaUpPLG1CRGhKTmIsV0FBVyxpQkNnSkw7QUFDRDtBRG5KUDtBQUpGO0FDMEpHOztBRGxKSCxRQUFHLENBQUNBLFFBQUo7QUFFQztBQUNDeEwsZ0JBQU8sTUFBUCxFQUFhc0wsTUFBTVcsT0FBTixDQUFjLE9BQWQsRUFBdUIsSUFBdkIsRUFBNkJBLE9BQTdCLENBQXFDLE1BQXJDLEVBQTZDLElBQTdDLENBQWI7QUFERCxlQUFBSyxLQUFBO0FBRU1mLFlBQUFlLEtBQUE7QUFDTGQsbUJBQVcsY0FBWDtBQ29KRzs7QURsSkosVUFBRyxvQkFBb0J4SCxJQUFwQixDQUF5QnNILEtBQXpCLEtBQW9DLG9CQUFvQnRILElBQXBCLENBQXlCc0gsS0FBekIsQ0FBdkM7QUFDQ0UsbUJBQVcsa0NBQVg7QUFSRjtBQS9CRDtBQzZMRTs7QURySkYsTUFBR0EsUUFBSDtBQUNDZSxZQUFRQyxHQUFSLENBQVksT0FBWixFQUFxQmhCLFFBQXJCOztBQUNBLFFBQUc1TCxPQUFPNEYsUUFBVjtBQUNDaUgsYUFBT0gsS0FBUCxDQUFhZCxRQUFiO0FDdUpFOztBRHRKSCxXQUFPLEtBQVA7QUFKRDtBQU1DLFdBQU8sSUFBUDtBQ3dKQztBRC9NdUIsQ0FBMUIsQyxDQTBEQTs7Ozs7Ozs7QUFPQXhMLFFBQVEwTSxvQkFBUixHQUErQixVQUFDdEksT0FBRCxFQUFVNEUsT0FBVjtBQUM5QixNQUFBMkQsUUFBQTs7QUFBQSxRQUFBdkksV0FBQSxPQUFPQSxRQUFTRSxNQUFoQixHQUFnQixNQUFoQjtBQUNDO0FDNEpDOztBRDFKRixRQUFPRixRQUFRLENBQVIsYUFBc0J3SSxLQUE3QjtBQUNDeEksY0FBVS9CLEVBQUV5SixHQUFGLENBQU0xSCxPQUFOLEVBQWUsVUFBQ2dCLEdBQUQ7QUFDeEIsYUFBTyxDQUFDQSxJQUFJWixLQUFMLEVBQVlZLElBQUl5SCxTQUFoQixFQUEyQnpILElBQUl2QyxLQUEvQixDQUFQO0FBRFMsTUFBVjtBQzhKQzs7QUQ1SkY4SixhQUFXLEVBQVg7O0FBQ0F0SyxJQUFFZSxJQUFGLENBQU9nQixPQUFQLEVBQWdCLFVBQUN3RyxNQUFEO0FBQ2YsUUFBQXBHLEtBQUEsRUFBQXNJLE1BQUEsRUFBQUMsR0FBQSxFQUFBQyxZQUFBLEVBQUFuSyxLQUFBO0FBQUEyQixZQUFRb0csT0FBTyxDQUFQLENBQVI7QUFDQWtDLGFBQVNsQyxPQUFPLENBQVAsQ0FBVDs7QUFDQSxRQUFHaEwsT0FBTzRGLFFBQVY7QUFDQzNDLGNBQVE3QyxRQUFRaU4sZUFBUixDQUF3QnJDLE9BQU8sQ0FBUCxDQUF4QixDQUFSO0FBREQ7QUFHQy9ILGNBQVE3QyxRQUFRaU4sZUFBUixDQUF3QnJDLE9BQU8sQ0FBUCxDQUF4QixFQUFtQyxJQUFuQyxFQUF5QzVCLE9BQXpDLENBQVI7QUMrSkU7O0FEOUpIZ0UsbUJBQWUsRUFBZjtBQUNBQSxpQkFBYXhJLEtBQWIsSUFBc0IsRUFBdEI7O0FBQ0EsUUFBR3NJLFdBQVUsR0FBYjtBQUNDRSxtQkFBYXhJLEtBQWIsRUFBb0IsS0FBcEIsSUFBNkIzQixLQUE3QjtBQURELFdBRUssSUFBR2lLLFdBQVUsSUFBYjtBQUNKRSxtQkFBYXhJLEtBQWIsRUFBb0IsS0FBcEIsSUFBNkIzQixLQUE3QjtBQURJLFdBRUEsSUFBR2lLLFdBQVUsR0FBYjtBQUNKRSxtQkFBYXhJLEtBQWIsRUFBb0IsS0FBcEIsSUFBNkIzQixLQUE3QjtBQURJLFdBRUEsSUFBR2lLLFdBQVUsSUFBYjtBQUNKRSxtQkFBYXhJLEtBQWIsRUFBb0IsTUFBcEIsSUFBOEIzQixLQUE5QjtBQURJLFdBRUEsSUFBR2lLLFdBQVUsR0FBYjtBQUNKRSxtQkFBYXhJLEtBQWIsRUFBb0IsS0FBcEIsSUFBNkIzQixLQUE3QjtBQURJLFdBRUEsSUFBR2lLLFdBQVUsSUFBYjtBQUNKRSxtQkFBYXhJLEtBQWIsRUFBb0IsTUFBcEIsSUFBOEIzQixLQUE5QjtBQURJLFdBRUEsSUFBR2lLLFdBQVUsWUFBYjtBQUNKQyxZQUFNLElBQUlHLE1BQUosQ0FBVyxNQUFNckssS0FBakIsRUFBd0IsR0FBeEIsQ0FBTjtBQUNBbUssbUJBQWF4SSxLQUFiLEVBQW9CLFFBQXBCLElBQWdDdUksR0FBaEM7QUFGSSxXQUdBLElBQUdELFdBQVUsVUFBYjtBQUNKQyxZQUFNLElBQUlHLE1BQUosQ0FBV3JLLEtBQVgsRUFBa0IsR0FBbEIsQ0FBTjtBQUNBbUssbUJBQWF4SSxLQUFiLEVBQW9CLFFBQXBCLElBQWdDdUksR0FBaEM7QUFGSSxXQUdBLElBQUdELFdBQVUsYUFBYjtBQUNKQyxZQUFNLElBQUlHLE1BQUosQ0FBVyxVQUFVckssS0FBVixHQUFrQixPQUE3QixFQUFzQyxHQUF0QyxDQUFOO0FBQ0FtSyxtQkFBYXhJLEtBQWIsRUFBb0IsUUFBcEIsSUFBZ0N1SSxHQUFoQztBQ2dLRTs7QUFDRCxXRGhLRkosU0FBU2hLLElBQVQsQ0FBY3FLLFlBQWQsQ0NnS0U7QUQ5TEg7O0FBK0JBLFNBQU9MLFFBQVA7QUF2QzhCLENBQS9COztBQXlDQTNNLFFBQVFtTix3QkFBUixHQUFtQyxVQUFDTixTQUFEO0FBQ2xDLE1BQUExTSxHQUFBO0FBQUEsU0FBTzBNLGNBQWEsU0FBYixJQUEwQixDQUFDLEdBQUExTSxNQUFBSCxRQUFBb04sMkJBQUEsa0JBQUFqTixJQUE0QzBNLFNBQTVDLElBQTRDLE1BQTVDLENBQWxDO0FBRGtDLENBQW5DLEMsQ0FHQTs7Ozs7Ozs7QUFPQTdNLFFBQVFxTixrQkFBUixHQUE2QixVQUFDakosT0FBRCxFQUFVbEUsV0FBVixFQUF1QjhJLE9BQXZCO0FBQzVCLE1BQUFzRSxnQkFBQSxFQUFBWCxRQUFBOztBQUFBLE9BQU92SSxRQUFRRSxNQUFmO0FBQ0M7QUN3S0M7O0FEdktGLE1BQUEwRSxXQUFBLE9BQUdBLFFBQVN1RSxXQUFaLEdBQVksTUFBWjtBQUVDRCx1QkFBbUIsRUFBbkI7QUFDQWxKLFlBQVE5QixPQUFSLENBQWdCLFVBQUNpQyxDQUFEO0FBQ2YrSSx1QkFBaUIzSyxJQUFqQixDQUFzQjRCLENBQXRCO0FDd0tHLGFEdktIK0ksaUJBQWlCM0ssSUFBakIsQ0FBc0IsSUFBdEIsQ0N1S0c7QUR6S0o7QUFHQTJLLHFCQUFpQkUsR0FBakI7QUFDQXBKLGNBQVVrSixnQkFBVjtBQ3lLQzs7QUR4S0ZYLGFBQVdjLGVBQWVKLGtCQUFmLENBQWtDakosT0FBbEMsRUFBMkNwRSxRQUFRZ0ksWUFBbkQsQ0FBWDtBQUNBLFNBQU8yRSxRQUFQO0FBWjRCLENBQTdCLEMsQ0FjQTs7Ozs7Ozs7QUFPQTNNLFFBQVEwTix1QkFBUixHQUFrQyxVQUFDdEosT0FBRCxFQUFVdUosWUFBVixFQUF3QjNFLE9BQXhCO0FBQ2pDLE1BQUE0RSxZQUFBO0FBQUFBLGlCQUFlRCxhQUFhMUIsT0FBYixDQUFxQixTQUFyQixFQUFnQyxHQUFoQyxFQUFxQ0EsT0FBckMsQ0FBNkMsU0FBN0MsRUFBd0QsR0FBeEQsRUFBNkRBLE9BQTdELENBQXFFLEtBQXJFLEVBQTRFLEdBQTVFLEVBQWlGQSxPQUFqRixDQUF5RixLQUF6RixFQUFnRyxHQUFoRyxFQUFxR0EsT0FBckcsQ0FBNkcsTUFBN0csRUFBcUgsR0FBckgsRUFBMEhBLE9BQTFILENBQWtJLFlBQWxJLEVBQWdKLE1BQWhKLENBQWY7QUFDQTJCLGlCQUFlQSxhQUFhM0IsT0FBYixDQUFxQixTQUFyQixFQUFnQyxVQUFDNEIsQ0FBRDtBQUM5QyxRQUFBQyxFQUFBLEVBQUF0SixLQUFBLEVBQUFzSSxNQUFBLEVBQUFFLFlBQUEsRUFBQW5LLEtBQUE7O0FBQUFpTCxTQUFLMUosUUFBUXlKLElBQUUsQ0FBVixDQUFMO0FBQ0FySixZQUFRc0osR0FBR3RKLEtBQVg7QUFDQXNJLGFBQVNnQixHQUFHakIsU0FBWjs7QUFDQSxRQUFHak4sT0FBTzRGLFFBQVY7QUFDQzNDLGNBQVE3QyxRQUFRaU4sZUFBUixDQUF3QmEsR0FBR2pMLEtBQTNCLENBQVI7QUFERDtBQUdDQSxjQUFRN0MsUUFBUWlOLGVBQVIsQ0FBd0JhLEdBQUdqTCxLQUEzQixFQUFrQyxJQUFsQyxFQUF3Q21HLE9BQXhDLENBQVI7QUMrS0U7O0FEOUtIZ0UsbUJBQWUsRUFBZjs7QUFDQSxRQUFHM0ssRUFBRTBMLE9BQUYsQ0FBVWxMLEtBQVYsTUFBb0IsSUFBdkI7QUFDQyxVQUFHaUssV0FBVSxHQUFiO0FBQ0N6SyxVQUFFZSxJQUFGLENBQU9QLEtBQVAsRUFBYyxVQUFDbkQsQ0FBRDtBQ2dMUixpQkQvS0xzTixhQUFhckssSUFBYixDQUFrQixDQUFDNkIsS0FBRCxFQUFRc0ksTUFBUixFQUFnQnBOLENBQWhCLENBQWxCLEVBQXNDLElBQXRDLENDK0tLO0FEaExOO0FBREQsYUFHSyxJQUFHb04sV0FBVSxJQUFiO0FBQ0p6SyxVQUFFZSxJQUFGLENBQU9QLEtBQVAsRUFBYyxVQUFDbkQsQ0FBRDtBQ2lMUixpQkRoTExzTixhQUFhckssSUFBYixDQUFrQixDQUFDNkIsS0FBRCxFQUFRc0ksTUFBUixFQUFnQnBOLENBQWhCLENBQWxCLEVBQXNDLEtBQXRDLENDZ0xLO0FEakxOO0FBREk7QUFJSjJDLFVBQUVlLElBQUYsQ0FBT1AsS0FBUCxFQUFjLFVBQUNuRCxDQUFEO0FDa0xSLGlCRGpMTHNOLGFBQWFySyxJQUFiLENBQWtCLENBQUM2QixLQUFELEVBQVFzSSxNQUFSLEVBQWdCcE4sQ0FBaEIsQ0FBbEIsRUFBc0MsSUFBdEMsQ0NpTEs7QURsTE47QUNvTEc7O0FEbExKLFVBQUdzTixhQUFhQSxhQUFhMUksTUFBYixHQUFzQixDQUFuQyxNQUF5QyxLQUF6QyxJQUFrRDBJLGFBQWFBLGFBQWExSSxNQUFiLEdBQXNCLENBQW5DLE1BQXlDLElBQTlGO0FBQ0MwSSxxQkFBYVEsR0FBYjtBQVhGO0FBQUE7QUFhQ1IscUJBQWUsQ0FBQ3hJLEtBQUQsRUFBUXNJLE1BQVIsRUFBZ0JqSyxLQUFoQixDQUFmO0FDcUxFOztBRG5MSCxXQUFPbUwsS0FBS0MsU0FBTCxDQUFlakIsWUFBZixDQUFQO0FBeEJjLElBQWY7QUEwQkFZLGlCQUFlLE1BQUlBLFlBQUosR0FBaUIsR0FBaEM7QUFDQSxTQUFPNU4sUUFBTyxNQUFQLEVBQWE0TixZQUFiLENBQVA7QUE3QmlDLENBQWxDOztBQStCQTVOLFFBQVFtRCxpQkFBUixHQUE0QixVQUFDakQsV0FBRCxFQUFjdUgsT0FBZCxFQUF1QkMsTUFBdkI7QUFDM0IsTUFBQTFGLE9BQUEsRUFBQWtGLFdBQUEsRUFBQWdILG9CQUFBLEVBQUFDLGVBQUEsRUFBQUMsaUJBQUE7O0FBQUEsTUFBR3hPLE9BQU80RixRQUFWO0FBQ0MsUUFBRyxDQUFDdEYsV0FBSjtBQUNDQSxvQkFBY1UsUUFBUUMsR0FBUixDQUFZLGFBQVosQ0FBZDtBQ3VMRTs7QUR0TEgsUUFBRyxDQUFDNEcsT0FBSjtBQUNDQSxnQkFBVTdHLFFBQVFDLEdBQVIsQ0FBWSxTQUFaLENBQVY7QUN3TEU7O0FEdkxILFFBQUcsQ0FBQzZHLE1BQUo7QUFDQ0EsZUFBUzlILE9BQU84SCxNQUFQLEVBQVQ7QUFORjtBQ2dNRTs7QUR4TEZ3Ryx5QkFBdUIsRUFBdkI7QUFDQWxNLFlBQVVoQyxRQUFRSSxTQUFSLENBQWtCRixXQUFsQixDQUFWOztBQUVBLE1BQUcsQ0FBQzhCLE9BQUo7QUFDQyxXQUFPa00sb0JBQVA7QUN5TEM7O0FEckxGQyxvQkFBa0JuTyxRQUFRcU8saUJBQVIsQ0FBMEJyTSxRQUFRc00sZ0JBQWxDLENBQWxCO0FBRUFKLHlCQUF1QjdMLEVBQUVzSSxLQUFGLENBQVF3RCxlQUFSLEVBQXdCLGFBQXhCLENBQXZCOztBQUNBLE9BQUFELHdCQUFBLE9BQUdBLHFCQUFzQjVKLE1BQXpCLEdBQXlCLE1BQXpCLE1BQW1DLENBQW5DO0FBQ0MsV0FBTzRKLG9CQUFQO0FDc0xDOztBRHBMRmhILGdCQUFjbEgsUUFBUXVPLGNBQVIsQ0FBdUJyTyxXQUF2QixFQUFvQ3VILE9BQXBDLEVBQTZDQyxNQUE3QyxDQUFkO0FBQ0EwRyxzQkFBb0JsSCxZQUFZa0gsaUJBQWhDO0FBRUFGLHlCQUF1QjdMLEVBQUVtTSxVQUFGLENBQWFOLG9CQUFiLEVBQW1DRSxpQkFBbkMsQ0FBdkI7QUFDQSxTQUFPL0wsRUFBRXVJLE1BQUYsQ0FBU3VELGVBQVQsRUFBMEIsVUFBQ00sY0FBRDtBQUNoQyxRQUFBdEgsU0FBQSxFQUFBdUgsUUFBQSxFQUFBdk8sR0FBQSxFQUFBdUIsbUJBQUE7QUFBQUEsMEJBQXNCK00sZUFBZXZPLFdBQXJDO0FBQ0F3TyxlQUFXUixxQkFBcUJqSyxPQUFyQixDQUE2QnZDLG1CQUE3QixJQUFvRCxDQUFDLENBQWhFO0FBRUF5RixnQkFBQSxDQUFBaEgsTUFBQUgsUUFBQXVPLGNBQUEsQ0FBQTdNLG1CQUFBLEVBQUErRixPQUFBLEVBQUFDLE1BQUEsYUFBQXZILElBQTBFZ0gsU0FBMUUsR0FBMEUsTUFBMUU7O0FBQ0EsUUFBR3pGLHdCQUF1QixXQUExQjtBQUNDeUYsa0JBQVlBLGFBQWFELFlBQVl5SCxjQUFyQztBQ3FMRTs7QURwTEgsV0FBT0QsWUFBYXZILFNBQXBCO0FBUE0sSUFBUDtBQTNCMkIsQ0FBNUI7O0FBb0NBbkgsUUFBUTRPLHFCQUFSLEdBQWdDLFVBQUMxTyxXQUFELEVBQWN1SCxPQUFkLEVBQXVCQyxNQUF2QjtBQUMvQixNQUFBeUcsZUFBQTtBQUFBQSxvQkFBa0JuTyxRQUFRbUQsaUJBQVIsQ0FBMEJqRCxXQUExQixFQUF1Q3VILE9BQXZDLEVBQWdEQyxNQUFoRCxDQUFsQjtBQUNBLFNBQU9yRixFQUFFc0ksS0FBRixDQUFRd0QsZUFBUixFQUF3QixhQUF4QixDQUFQO0FBRitCLENBQWhDOztBQUlBbk8sUUFBUTZPLDJCQUFSLEdBQXNDLFVBQUNDLGlCQUFELEVBQW9CckgsT0FBcEIsRUFBNkJDLE1BQTdCO0FBQ3JDLE1BQUFxSCxPQUFBO0FBQUFBLFlBQVUvTyxRQUFRZ1AsVUFBUixDQUFtQkYsaUJBQW5CLEVBQXNDckgsT0FBdEMsRUFBK0NDLE1BQS9DLENBQVY7QUFDQXFILFlBQVUxTSxFQUFFdUksTUFBRixDQUFTbUUsT0FBVCxFQUFrQixVQUFDRSxNQUFEO0FBQzNCLFFBQUdBLE9BQU90TCxJQUFQLEtBQWUsaUJBQWxCO0FBQ0MsYUFBTyxLQUFQO0FDMkxFOztBRDFMSCxRQUFHc0wsT0FBT3RMLElBQVAsS0FBZSxnQkFBbEI7QUFDQyxhQUFPLEtBQVA7QUM0TEU7O0FEM0xILFFBQUdzTCxPQUFPQyxFQUFQLEtBQWEsTUFBaEI7QUFDQyxVQUFHLE9BQU9ELE9BQU9yRixPQUFkLEtBQXlCLFVBQTVCO0FBQ0MsZUFBT3FGLE9BQU9yRixPQUFQLEVBQVA7QUFERDtBQUdDLGVBQU9xRixPQUFPckYsT0FBZDtBQUpGO0FBQUE7QUFNQyxhQUFPLEtBQVA7QUM4TEU7QUR6TU0sSUFBVjtBQVlBLFNBQU9tRixPQUFQO0FBZHFDLENBQXRDOztBQWdCQS9PLFFBQVFnUCxVQUFSLEdBQXFCLFVBQUM5TyxXQUFELEVBQWN1SCxPQUFkLEVBQXVCQyxNQUF2QjtBQUNwQixNQUFBcUgsT0FBQSxFQUFBSSxnQkFBQSxFQUFBL0osR0FBQSxFQUFBOEIsV0FBQSxFQUFBL0csR0FBQSxFQUFBbUYsSUFBQTs7QUFBQSxNQUFHMUYsT0FBTzRGLFFBQVY7QUFDQyxRQUFHLENBQUN0RixXQUFKO0FBQ0NBLG9CQUFjVSxRQUFRQyxHQUFSLENBQVksYUFBWixDQUFkO0FDa01FOztBRGpNSCxRQUFHLENBQUM0RyxPQUFKO0FBQ0NBLGdCQUFVN0csUUFBUUMsR0FBUixDQUFZLFNBQVosQ0FBVjtBQ21NRTs7QURsTUgsUUFBRyxDQUFDNkcsTUFBSjtBQUNDQSxlQUFTOUgsT0FBTzhILE1BQVAsRUFBVDtBQU5GO0FDMk1FOztBRG5NRnRDLFFBQU1wRixRQUFRSSxTQUFSLENBQWtCRixXQUFsQixDQUFOOztBQUVBLE1BQUcsQ0FBQ2tGLEdBQUo7QUFDQztBQ29NQzs7QURsTUY4QixnQkFBY2xILFFBQVF1TyxjQUFSLENBQXVCck8sV0FBdkIsRUFBb0N1SCxPQUFwQyxFQUE2Q0MsTUFBN0MsQ0FBZDtBQUNBeUgscUJBQW1CakksWUFBWWlJLGdCQUEvQjtBQUNBSixZQUFVMU0sRUFBRXdILE1BQUYsQ0FBU3hILEVBQUV5SCxNQUFGLENBQVMxRSxJQUFJMkosT0FBYixDQUFULEVBQWlDLE1BQWpDLENBQVY7O0FBRUEsTUFBRzFNLEVBQUUrTSxHQUFGLENBQU1oSyxHQUFOLEVBQVcscUJBQVgsQ0FBSDtBQUNDMkosY0FBVTFNLEVBQUV1SSxNQUFGLENBQVNtRSxPQUFULEVBQWtCLFVBQUNFLE1BQUQ7QUFDM0IsYUFBTzVNLEVBQUUwQixPQUFGLENBQVVxQixJQUFJaUssbUJBQWQsRUFBbUNKLE9BQU90TCxJQUExQyxLQUFtRHRCLEVBQUUwQixPQUFGLENBQVUxQixFQUFFaU4sSUFBRixDQUFPdFAsUUFBUUksU0FBUixDQUFrQixNQUFsQixFQUEwQjJPLE9BQWpDLEtBQTZDLEVBQXZELEVBQTJERSxPQUFPdEwsSUFBbEUsQ0FBMUQ7QUFEUyxNQUFWO0FDcU1DOztBRG5NRixNQUFHdEIsRUFBRStNLEdBQUYsQ0FBTWhLLEdBQU4sRUFBVyxpQkFBWCxDQUFIO0FBQ0MySixjQUFVMU0sRUFBRXVJLE1BQUYsQ0FBU21FLE9BQVQsRUFBa0IsVUFBQ0UsTUFBRDtBQUMzQixhQUFPLENBQUM1TSxFQUFFMEIsT0FBRixDQUFVcUIsSUFBSW1LLGVBQWQsRUFBK0JOLE9BQU90TCxJQUF0QyxDQUFSO0FBRFMsTUFBVjtBQ3VNQzs7QURwTUZ0QixJQUFFZSxJQUFGLENBQU8yTCxPQUFQLEVBQWdCLFVBQUNFLE1BQUQ7QUFFZixRQUFHL04sUUFBUTZGLFFBQVIsTUFBc0IsQ0FBQyxRQUFELEVBQVcsYUFBWCxFQUEwQjlDLE9BQTFCLENBQWtDZ0wsT0FBT0MsRUFBekMsSUFBK0MsQ0FBQyxDQUF0RSxJQUEyRUQsT0FBT3RMLElBQVAsS0FBZSxlQUE3RjtBQUNDLFVBQUdzTCxPQUFPQyxFQUFQLEtBQWEsYUFBaEI7QUNxTUssZURwTUpELE9BQU9DLEVBQVAsR0FBWSxrQkNvTVI7QURyTUw7QUN1TUssZURwTUpELE9BQU9DLEVBQVAsR0FBWSxhQ29NUjtBRHhNTjtBQzBNRztBRDVNSjs7QUFRQSxNQUFHaE8sUUFBUTZGLFFBQVIsTUFBc0IsQ0FBQyxXQUFELEVBQWMsc0JBQWQsRUFBc0M5QyxPQUF0QyxDQUE4Qy9ELFdBQTlDLElBQTZELENBQUMsQ0FBdkY7QUN1TUcsUUFBSSxDQUFDQyxNQUFNNE8sUUFBUWhLLElBQVIsQ0FBYSxVQUFTUixDQUFULEVBQVk7QUFDbEMsYUFBT0EsRUFBRVosSUFBRixLQUFXLGVBQWxCO0FBQ0QsS0FGVSxDQUFQLEtBRUcsSUFGUCxFQUVhO0FBQ1h4RCxVRHhNa0QrTyxFQ3dNbEQsR0R4TXVELGFDd012RDtBQUNEOztBQUNELFFBQUksQ0FBQzVKLE9BQU95SixRQUFRaEssSUFBUixDQUFhLFVBQVNSLENBQVQsRUFBWTtBQUNuQyxhQUFPQSxFQUFFWixJQUFGLEtBQVcsVUFBbEI7QUFDRCxLQUZXLENBQVIsS0FFRyxJQUZQLEVBRWE7QUFDWDJCLFdENU02QzRKLEVDNE03QyxHRDVNa0QsUUM0TWxEO0FEL01MO0FDaU5FOztBRDVNRkgsWUFBVTFNLEVBQUV1SSxNQUFGLENBQVNtRSxPQUFULEVBQWtCLFVBQUNFLE1BQUQ7QUFDM0IsV0FBTzVNLEVBQUU0QixPQUFGLENBQVVrTCxnQkFBVixFQUE0QkYsT0FBT3RMLElBQW5DLElBQTJDLENBQWxEO0FBRFMsSUFBVjtBQUdBLFNBQU9vTCxPQUFQO0FBekNvQixDQUFyQjs7QUEyQ0E7O0FBSUEvTyxRQUFRd1AsWUFBUixHQUF1QixVQUFDdFAsV0FBRCxFQUFjdUgsT0FBZCxFQUF1QkMsTUFBdkI7QUFDdEIsTUFBQStILG1CQUFBLEVBQUExSSxRQUFBLEVBQUEySSxTQUFBLEVBQUFDLFVBQUEsRUFBQUMsTUFBQSxFQUFBelAsR0FBQTs7QUFBQSxNQUFHUCxPQUFPNEYsUUFBVjtBQUNDLFFBQUcsQ0FBQ3RGLFdBQUo7QUFDQ0Esb0JBQWNVLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUM4TUU7O0FEN01ILFFBQUcsQ0FBQzRHLE9BQUo7QUFDQ0EsZ0JBQVU3RyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFWO0FDK01FOztBRDlNSCxRQUFHLENBQUM2RyxNQUFKO0FBQ0NBLGVBQVM5SCxPQUFPOEgsTUFBUCxFQUFUO0FBTkY7QUN1TkU7O0FEL01GLE9BQU94SCxXQUFQO0FBQ0M7QUNpTkM7O0FEL01GMFAsV0FBUzVQLFFBQVFJLFNBQVIsQ0FBa0JGLFdBQWxCLENBQVQ7O0FBRUEsTUFBRyxDQUFDMFAsTUFBSjtBQUNDO0FDZ05DOztBRDlNRkgsd0JBQUEsRUFBQXRQLE1BQUFILFFBQUF1TyxjQUFBLENBQUFyTyxXQUFBLEVBQUF1SCxPQUFBLEVBQUFDLE1BQUEsYUFBQXZILElBQTRFc1AsbUJBQTVFLEdBQTRFLE1BQTVFLEtBQW1HLEVBQW5HO0FBRUFFLGVBQWEsRUFBYjtBQUVBNUksYUFBVzdGLFFBQVE2RixRQUFSLEVBQVg7O0FBRUExRSxJQUFFZSxJQUFGLENBQU93TSxPQUFPRCxVQUFkLEVBQTBCLFVBQUNFLElBQUQsRUFBT0MsU0FBUDtBQzZNdkIsV0Q1TUZELEtBQUtsTSxJQUFMLEdBQVltTSxTQzRNVjtBRDdNSDs7QUFHQUosY0FBWXJOLEVBQUV3SCxNQUFGLENBQVN4SCxFQUFFeUgsTUFBRixDQUFTOEYsT0FBT0QsVUFBaEIsQ0FBVCxFQUF1QyxTQUF2QyxDQUFaOztBQUVBdE4sSUFBRWUsSUFBRixDQUFPc00sU0FBUCxFQUFrQixVQUFDRyxJQUFEO0FBQ2pCLFFBQUFFLFVBQUE7O0FBQUEsUUFBR2hKLFlBQWE4SSxLQUFLbk4sSUFBTCxLQUFhLFVBQTdCO0FBRUM7QUM0TUU7O0FEM01ILFFBQUdtTixLQUFLbE0sSUFBTCxLQUFjLFNBQWpCO0FBQ0NvTSxtQkFBYTFOLEVBQUU0QixPQUFGLENBQVV3TCxtQkFBVixFQUErQkksS0FBS2xNLElBQXBDLElBQTRDLENBQUMsQ0FBN0MsSUFBbURrTSxLQUFLOU8sR0FBTCxJQUFZc0IsRUFBRTRCLE9BQUYsQ0FBVXdMLG1CQUFWLEVBQStCSSxLQUFLOU8sR0FBcEMsSUFBMkMsQ0FBQyxDQUF4SDs7QUFDQSxVQUFHLENBQUNnUCxVQUFELElBQWVGLEtBQUtHLEtBQUwsS0FBY3RJLE1BQWhDO0FDNk1LLGVENU1KaUksV0FBV2hOLElBQVgsQ0FBZ0JrTixJQUFoQixDQzRNSTtBRC9NTjtBQ2lORztBRHJOSjs7QUFRQSxTQUFPRixVQUFQO0FBcENzQixDQUF2Qjs7QUF1Q0EzUCxRQUFROEQsU0FBUixHQUFvQixVQUFDNUQsV0FBRCxFQUFjdUgsT0FBZCxFQUF1QkMsTUFBdkI7QUFDbkIsTUFBQXVJLFVBQUEsRUFBQTlQLEdBQUEsRUFBQStQLGlCQUFBOztBQUFBLE1BQUd0USxPQUFPNEYsUUFBVjtBQUNDLFFBQUcsQ0FBQ3RGLFdBQUo7QUFDQ0Esb0JBQWNVLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUNpTkU7O0FEaE5ILFFBQUcsQ0FBQzRHLE9BQUo7QUFDQ0EsZ0JBQVU3RyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFWO0FDa05FOztBRGpOSCxRQUFHLENBQUM2RyxNQUFKO0FBQ0NBLGVBQVM5SCxPQUFPOEgsTUFBUCxFQUFUO0FBTkY7QUMwTkU7O0FEbE5GdUksZUFBYWpRLFFBQVFtUSxtQkFBUixDQUE0QmpRLFdBQTVCLENBQWI7QUFDQWdRLHNCQUFBLENBQUEvUCxNQUFBSCxRQUFBdU8sY0FBQSxDQUFBck8sV0FBQSxFQUFBdUgsT0FBQSxFQUFBQyxNQUFBLGFBQUF2SCxJQUEyRStQLGlCQUEzRSxHQUEyRSxNQUEzRTtBQUNBLFNBQU83TixFQUFFbU0sVUFBRixDQUFheUIsVUFBYixFQUF5QkMsaUJBQXpCLENBQVA7QUFYbUIsQ0FBcEI7O0FBYUFsUSxRQUFRb1EsU0FBUixHQUFvQjtBQUNuQixTQUFPLENBQUNwUSxRQUFRcVEsZUFBUixDQUF3QnhQLEdBQXhCLEVBQVI7QUFEbUIsQ0FBcEI7O0FBR0FiLFFBQVFzUSx1QkFBUixHQUFrQyxVQUFDQyxHQUFEO0FBQ2pDLFNBQU9BLElBQUl0RSxPQUFKLENBQVksbUNBQVosRUFBaUQsTUFBakQsQ0FBUDtBQURpQyxDQUFsQzs7QUFLQWpNLFFBQVF3USxpQkFBUixHQUE0QixVQUFDblEsTUFBRDtBQUMzQixNQUFBNkIsTUFBQTtBQUFBQSxXQUFTRyxFQUFFeUosR0FBRixDQUFNekwsTUFBTixFQUFjLFVBQUNtRSxLQUFELEVBQVFpTSxTQUFSO0FBQ3RCLFdBQU9qTSxNQUFNa00sUUFBTixJQUFtQmxNLE1BQU1rTSxRQUFOLENBQWVDLFFBQWxDLElBQStDLENBQUNuTSxNQUFNa00sUUFBTixDQUFlRSxJQUEvRCxJQUF3RUgsU0FBL0U7QUFEUSxJQUFUO0FBR0F2TyxXQUFTRyxFQUFFMkosT0FBRixDQUFVOUosTUFBVixDQUFUO0FBQ0EsU0FBT0EsTUFBUDtBQUwyQixDQUE1Qjs7QUFPQWxDLFFBQVE2USxlQUFSLEdBQTBCLFVBQUN4USxNQUFEO0FBQ3pCLE1BQUE2QixNQUFBO0FBQUFBLFdBQVNHLEVBQUV5SixHQUFGLENBQU16TCxNQUFOLEVBQWMsVUFBQ21FLEtBQUQsRUFBUWlNLFNBQVI7QUFDdEIsV0FBT2pNLE1BQU1rTSxRQUFOLElBQW1CbE0sTUFBTWtNLFFBQU4sQ0FBZWhPLElBQWYsS0FBdUIsUUFBMUMsSUFBdUQsQ0FBQzhCLE1BQU1rTSxRQUFOLENBQWVFLElBQXZFLElBQWdGSCxTQUF2RjtBQURRLElBQVQ7QUFHQXZPLFdBQVNHLEVBQUUySixPQUFGLENBQVU5SixNQUFWLENBQVQ7QUFDQSxTQUFPQSxNQUFQO0FBTHlCLENBQTFCOztBQU9BbEMsUUFBUThRLG9CQUFSLEdBQStCLFVBQUN6USxNQUFEO0FBQzlCLE1BQUE2QixNQUFBO0FBQUFBLFdBQVNHLEVBQUV5SixHQUFGLENBQU16TCxNQUFOLEVBQWMsVUFBQ21FLEtBQUQsRUFBUWlNLFNBQVI7QUFDdEIsV0FBTyxDQUFDLENBQUNqTSxNQUFNa00sUUFBUCxJQUFtQixDQUFDbE0sTUFBTWtNLFFBQU4sQ0FBZUssS0FBbkMsSUFBNEN2TSxNQUFNa00sUUFBTixDQUFlSyxLQUFmLEtBQXdCLEdBQXJFLE1BQStFLENBQUN2TSxNQUFNa00sUUFBUCxJQUFtQmxNLE1BQU1rTSxRQUFOLENBQWVoTyxJQUFmLEtBQXVCLFFBQXpILEtBQXVJK04sU0FBOUk7QUFEUSxJQUFUO0FBR0F2TyxXQUFTRyxFQUFFMkosT0FBRixDQUFVOUosTUFBVixDQUFUO0FBQ0EsU0FBT0EsTUFBUDtBQUw4QixDQUEvQjs7QUFPQWxDLFFBQVFnUix3QkFBUixHQUFtQyxVQUFDM1EsTUFBRDtBQUNsQyxNQUFBNFEsS0FBQTtBQUFBQSxVQUFRNU8sRUFBRXlKLEdBQUYsQ0FBTXpMLE1BQU4sRUFBYyxVQUFDbUUsS0FBRDtBQUNwQixXQUFPQSxNQUFNa00sUUFBTixJQUFtQmxNLE1BQU1rTSxRQUFOLENBQWVLLEtBQWYsS0FBd0IsR0FBM0MsSUFBbUR2TSxNQUFNa00sUUFBTixDQUFlSyxLQUF6RTtBQURNLElBQVI7QUFHQUUsVUFBUTVPLEVBQUUySixPQUFGLENBQVVpRixLQUFWLENBQVI7QUFDQUEsVUFBUTVPLEVBQUU2TyxNQUFGLENBQVNELEtBQVQsQ0FBUjtBQUNBLFNBQU9BLEtBQVA7QUFOa0MsQ0FBbkM7O0FBUUFqUixRQUFRbVIsaUJBQVIsR0FBNEIsVUFBQzlRLE1BQUQsRUFBUytRLFNBQVQ7QUFDekIsTUFBQWxQLE1BQUE7QUFBQUEsV0FBU0csRUFBRXlKLEdBQUYsQ0FBTXpMLE1BQU4sRUFBYyxVQUFDbUUsS0FBRCxFQUFRaU0sU0FBUjtBQUNyQixXQUFPak0sTUFBTWtNLFFBQU4sSUFBbUJsTSxNQUFNa00sUUFBTixDQUFlSyxLQUFmLEtBQXdCSyxTQUEzQyxJQUF5RDVNLE1BQU1rTSxRQUFOLENBQWVoTyxJQUFmLEtBQXVCLFFBQWhGLElBQTZGK04sU0FBcEc7QUFETyxJQUFUO0FBR0F2TyxXQUFTRyxFQUFFMkosT0FBRixDQUFVOUosTUFBVixDQUFUO0FBQ0EsU0FBT0EsTUFBUDtBQUx5QixDQUE1Qjs7QUFPQWxDLFFBQVFxUixtQkFBUixHQUE4QjtBQUM3QixTQUFPLENBQUMsU0FBRCxFQUFZLFlBQVosRUFBMEIsVUFBMUIsRUFBc0MsYUFBdEMsQ0FBUDtBQUQ2QixDQUE5Qjs7QUFHQXJSLFFBQVFzUiwwQkFBUixHQUFxQyxVQUFDaEMsSUFBRDtBQUNwQyxTQUFPak4sRUFBRW1NLFVBQUYsQ0FBYWMsSUFBYixFQUFtQnRQLFFBQVFxUixtQkFBUixFQUFuQixDQUFQO0FBRG9DLENBQXJDOztBQUdBclIsUUFBUXVSLG9CQUFSLEdBQStCLFVBQUNsUixNQUFELEVBQVNpUCxJQUFUO0FBQzlCQSxTQUFPak4sRUFBRXlKLEdBQUYsQ0FBTXdELElBQU4sRUFBWSxVQUFDNUYsR0FBRDtBQUNsQixRQUFBbEYsS0FBQSxFQUFBckUsR0FBQTtBQUFBcUUsWUFBUW5DLEVBQUVtUCxJQUFGLENBQU9uUixNQUFQLEVBQWVxSixHQUFmLENBQVI7O0FBQ0EsU0FBQXZKLE1BQUFxRSxNQUFBa0YsR0FBQSxFQUFBZ0gsUUFBQSxZQUFBdlEsSUFBd0J5USxJQUF4QixHQUF3QixNQUF4QjtBQUNDLGFBQU8sS0FBUDtBQUREO0FBR0MsYUFBT2xILEdBQVA7QUNrT0U7QUR2T0csSUFBUDtBQU9BNEYsU0FBT2pOLEVBQUUySixPQUFGLENBQVVzRCxJQUFWLENBQVA7QUFDQSxTQUFPQSxJQUFQO0FBVDhCLENBQS9COztBQVdBdFAsUUFBUXlSLHFCQUFSLEdBQWdDLFVBQUNDLGNBQUQsRUFBaUJwQyxJQUFqQjtBQUMvQkEsU0FBT2pOLEVBQUV5SixHQUFGLENBQU13RCxJQUFOLEVBQVksVUFBQzVGLEdBQUQ7QUFDbEIsUUFBR3JILEVBQUU0QixPQUFGLENBQVV5TixjQUFWLEVBQTBCaEksR0FBMUIsSUFBaUMsQ0FBQyxDQUFyQztBQUNDLGFBQU9BLEdBQVA7QUFERDtBQUdDLGFBQU8sS0FBUDtBQ29PRTtBRHhPRyxJQUFQO0FBTUE0RixTQUFPak4sRUFBRTJKLE9BQUYsQ0FBVXNELElBQVYsQ0FBUDtBQUNBLFNBQU9BLElBQVA7QUFSK0IsQ0FBaEM7O0FBVUF0UCxRQUFRMlIsbUJBQVIsR0FBOEIsVUFBQ3RSLE1BQUQsRUFBU2lQLElBQVQsRUFBZXNDLFFBQWY7QUFDN0IsTUFBQUMsS0FBQSxFQUFBQyxTQUFBLEVBQUE1UCxNQUFBLEVBQUFpSyxDQUFBLEVBQUE0RixTQUFBLEVBQUFDLFNBQUEsRUFBQUMsSUFBQSxFQUFBQyxJQUFBOztBQUFBaFEsV0FBUyxFQUFUO0FBQ0FpSyxNQUFJLENBQUo7QUFDQTBGLFVBQVF4UCxFQUFFdUksTUFBRixDQUFTMEUsSUFBVCxFQUFlLFVBQUM1RixHQUFEO0FBQ3RCLFdBQU8sQ0FBQ0EsSUFBSXlJLFFBQUosQ0FBYSxVQUFiLENBQVI7QUFETyxJQUFSOztBQUdBLFNBQU1oRyxJQUFJMEYsTUFBTXZOLE1BQWhCO0FBQ0MyTixXQUFPNVAsRUFBRW1QLElBQUYsQ0FBT25SLE1BQVAsRUFBZXdSLE1BQU0xRixDQUFOLENBQWYsQ0FBUDtBQUNBK0YsV0FBTzdQLEVBQUVtUCxJQUFGLENBQU9uUixNQUFQLEVBQWV3UixNQUFNMUYsSUFBRSxDQUFSLENBQWYsQ0FBUDtBQUVBNEYsZ0JBQVksS0FBWjtBQUNBQyxnQkFBWSxLQUFaOztBQUtBM1AsTUFBRWUsSUFBRixDQUFPNk8sSUFBUCxFQUFhLFVBQUNwUCxLQUFEO0FBQ1osVUFBQTFDLEdBQUEsRUFBQW1GLElBQUE7O0FBQUEsWUFBQW5GLE1BQUEwQyxNQUFBNk4sUUFBQSxZQUFBdlEsSUFBbUJpUyxPQUFuQixHQUFtQixNQUFuQixLQUFHLEVBQUE5TSxPQUFBekMsTUFBQTZOLFFBQUEsWUFBQXBMLEtBQTJDNUMsSUFBM0MsR0FBMkMsTUFBM0MsTUFBbUQsT0FBdEQ7QUNtT0ssZURsT0pxUCxZQUFZLElDa09SO0FBQ0Q7QURyT0w7O0FBT0ExUCxNQUFFZSxJQUFGLENBQU84TyxJQUFQLEVBQWEsVUFBQ3JQLEtBQUQ7QUFDWixVQUFBMUMsR0FBQSxFQUFBbUYsSUFBQTs7QUFBQSxZQUFBbkYsTUFBQTBDLE1BQUE2TixRQUFBLFlBQUF2USxJQUFtQmlTLE9BQW5CLEdBQW1CLE1BQW5CLEtBQUcsRUFBQTlNLE9BQUF6QyxNQUFBNk4sUUFBQSxZQUFBcEwsS0FBMkM1QyxJQUEzQyxHQUEyQyxNQUEzQyxNQUFtRCxPQUF0RDtBQ2tPSyxlRGpPSnNQLFlBQVksSUNpT1I7QUFDRDtBRHBPTDs7QUFPQSxRQUFHOVEsUUFBUTZGLFFBQVIsRUFBSDtBQUNDZ0wsa0JBQVksSUFBWjtBQUNBQyxrQkFBWSxJQUFaO0FDZ09FOztBRDlOSCxRQUFHSixRQUFIO0FBQ0MxUCxhQUFPUyxJQUFQLENBQVlrUCxNQUFNUSxLQUFOLENBQVlsRyxDQUFaLEVBQWVBLElBQUUsQ0FBakIsQ0FBWjtBQUNBQSxXQUFLLENBQUw7QUFGRDtBQVVDLFVBQUc0RixTQUFIO0FBQ0M3UCxlQUFPUyxJQUFQLENBQVlrUCxNQUFNUSxLQUFOLENBQVlsRyxDQUFaLEVBQWVBLElBQUUsQ0FBakIsQ0FBWjtBQUNBQSxhQUFLLENBQUw7QUFGRCxhQUdLLElBQUcsQ0FBQzRGLFNBQUQsSUFBZUMsU0FBbEI7QUFDSkYsb0JBQVlELE1BQU1RLEtBQU4sQ0FBWWxHLENBQVosRUFBZUEsSUFBRSxDQUFqQixDQUFaO0FBQ0EyRixrQkFBVW5QLElBQVYsQ0FBZSxNQUFmO0FBQ0FULGVBQU9TLElBQVAsQ0FBWW1QLFNBQVo7QUFDQTNGLGFBQUssQ0FBTDtBQUpJLGFBS0EsSUFBRyxDQUFDNEYsU0FBRCxJQUFlLENBQUNDLFNBQW5CO0FBQ0pGLG9CQUFZRCxNQUFNUSxLQUFOLENBQVlsRyxDQUFaLEVBQWVBLElBQUUsQ0FBakIsQ0FBWjs7QUFDQSxZQUFHMEYsTUFBTTFGLElBQUUsQ0FBUixDQUFIO0FBQ0MyRixvQkFBVW5QLElBQVYsQ0FBZWtQLE1BQU0xRixJQUFFLENBQVIsQ0FBZjtBQUREO0FBR0MyRixvQkFBVW5QLElBQVYsQ0FBZSxNQUFmO0FDME5JOztBRHpOTFQsZUFBT1MsSUFBUCxDQUFZbVAsU0FBWjtBQUNBM0YsYUFBSyxDQUFMO0FBekJGO0FDcVBHO0FEalJKOztBQXVEQSxTQUFPakssTUFBUDtBQTdENkIsQ0FBOUI7O0FBK0RBbEMsUUFBUXNTLGtCQUFSLEdBQTZCLFVBQUM1UyxDQUFEO0FBQzVCLFNBQU8sT0FBT0EsQ0FBUCxLQUFZLFdBQVosSUFBMkJBLE1BQUssSUFBaEMsSUFBd0M2UyxPQUFPQyxLQUFQLENBQWE5UyxDQUFiLENBQXhDLElBQTJEQSxFQUFFNEUsTUFBRixLQUFZLENBQTlFO0FBRDRCLENBQTdCOztBQUdBdEUsUUFBUXlTLGdCQUFSLEdBQTJCLFVBQUNDLFlBQUQsRUFBZWhKLEdBQWY7QUFDMUIsTUFBQXZKLEdBQUEsRUFBQXdTLE1BQUE7O0FBQUEsTUFBR0QsZ0JBQWlCaEosR0FBcEI7QUFDQ2lKLGFBQUEsQ0FBQXhTLE1BQUF1UyxhQUFBaEosR0FBQSxhQUFBdkosSUFBNEJ1QyxJQUE1QixHQUE0QixNQUE1Qjs7QUFDQSxRQUFHLENBQUMsU0FBRCxFQUFZLFNBQVosRUFBdUJ1QixPQUF2QixDQUErQjBPLE1BQS9CLElBQXlDLENBQUMsQ0FBN0M7QUFDQ0EsZUFBU0QsYUFBYWhKLEdBQWIsRUFBa0JrSixTQUEzQjtBQ2dPRTs7QUQ3TkgsV0FBT0QsTUFBUDtBQU5EO0FBUUMsV0FBTyxNQUFQO0FDK05DO0FEeE93QixDQUEzQjs7QUFhQSxJQUFHL1MsT0FBT2lULFFBQVY7QUFDQzdTLFVBQVE4UyxvQkFBUixHQUErQixVQUFDNVMsV0FBRDtBQUM5QixRQUFBZ08sb0JBQUE7QUFBQUEsMkJBQXVCLEVBQXZCOztBQUNBN0wsTUFBRWUsSUFBRixDQUFPcEQsUUFBUTZLLE9BQWYsRUFBd0IsVUFBQzRELGNBQUQsRUFBaUIvTSxtQkFBakI7QUNnT3BCLGFEL05IVyxFQUFFZSxJQUFGLENBQU9xTCxlQUFldk0sTUFBdEIsRUFBOEIsVUFBQzZRLGFBQUQsRUFBZ0JwUixrQkFBaEI7QUFDN0IsWUFBR29SLGNBQWNyUSxJQUFkLEtBQXNCLGVBQXRCLElBQTBDcVEsY0FBY2hRLFlBQXhELElBQXlFZ1EsY0FBY2hRLFlBQWQsS0FBOEI3QyxXQUExRztBQ2dPTSxpQkQvTkxnTyxxQkFBcUJ2TCxJQUFyQixDQUEwQmpCLG1CQUExQixDQytOSztBQUNEO0FEbE9OLFFDK05HO0FEaE9KOztBQUtBLFFBQUcxQixRQUFRSSxTQUFSLENBQWtCRixXQUFsQixFQUErQjhTLFlBQWxDO0FBQ0M5RSwyQkFBcUJ2TCxJQUFyQixDQUEwQixXQUExQjtBQ2tPRTs7QURoT0gsV0FBT3VMLG9CQUFQO0FBVjhCLEdBQS9CO0FDNk9BOztBRGpPRCxJQUFHdE8sT0FBT2lULFFBQVY7QUFDQzNSLFVBQVErUixXQUFSLEdBQXNCLFVBQUNDLEtBQUQ7QUFDckIsUUFBQUMsU0FBQSxFQUFBQyxZQUFBLEVBQUF4RCxNQUFBLEVBQUF6UCxHQUFBLEVBQUFtRixJQUFBLEVBQUFDLElBQUE7QUFBQXFLLGFBQVM7QUFDRnlELGtCQUFZO0FBRFYsS0FBVDtBQUdBRCxtQkFBQSxFQUFBalQsTUFBQVAsT0FBQUMsUUFBQSxhQUFBeUYsT0FBQW5GLElBQUFtVCxXQUFBLGFBQUEvTixPQUFBRCxLQUFBLHNCQUFBQyxLQUFzRGdPLFVBQXRELEdBQXNELE1BQXRELEdBQXNELE1BQXRELEdBQXNELE1BQXRELEtBQW9FLEtBQXBFOztBQUNBLFFBQUdILFlBQUg7QUFDQyxVQUFHRixNQUFNNU8sTUFBTixHQUFlLENBQWxCO0FBQ0M2TyxvQkFBWUQsTUFBTU0sSUFBTixDQUFXLEdBQVgsQ0FBWjtBQUNBNUQsZUFBT2pNLElBQVAsR0FBY3dQLFNBQWQ7O0FBRUEsWUFBSUEsVUFBVTdPLE1BQVYsR0FBbUIsRUFBdkI7QUFDQ3NMLGlCQUFPak0sSUFBUCxHQUFjd1AsVUFBVU0sU0FBVixDQUFvQixDQUFwQixFQUFzQixFQUF0QixDQUFkO0FBTEY7QUFERDtBQzRPRzs7QURwT0gsV0FBTzdELE1BQVA7QUFicUIsR0FBdEI7QUNvUEEsQzs7Ozs7Ozs7Ozs7O0FDaG1DRDVQLFFBQVEwVCxVQUFSLEdBQXFCLEVBQXJCLEM7Ozs7Ozs7Ozs7OztBQ0FBOVQsT0FBTytULE9BQVAsQ0FDQztBQUFBLDBCQUF3QixVQUFDelQsV0FBRCxFQUFjTSxTQUFkLEVBQXlCb1QsUUFBekI7QUFDdkIsUUFBQUMsd0JBQUEsRUFBQUMscUJBQUEsRUFBQUMsR0FBQSxFQUFBM1AsT0FBQTs7QUFBQSxRQUFHLENBQUMsS0FBS3NELE1BQVQ7QUFDQyxhQUFPLElBQVA7QUNFRTs7QURBSCxRQUFHeEgsZ0JBQWUsc0JBQWxCO0FBQ0M7QUNFRTs7QURESCxRQUFHQSxlQUFnQk0sU0FBbkI7QUFDQyxVQUFHLENBQUNvVCxRQUFKO0FBQ0NHLGNBQU0vVCxRQUFRNkYsYUFBUixDQUFzQjNGLFdBQXRCLEVBQW1DNEYsT0FBbkMsQ0FBMkM7QUFBQy9FLGVBQUtQO0FBQU4sU0FBM0MsRUFBNkQ7QUFBQzBCLGtCQUFRO0FBQUM4UixtQkFBTztBQUFSO0FBQVQsU0FBN0QsQ0FBTjtBQUNBSixtQkFBQUcsT0FBQSxPQUFXQSxJQUFLQyxLQUFoQixHQUFnQixNQUFoQjtBQ1NHOztBRFBKSCxpQ0FBMkI3VCxRQUFRNkYsYUFBUixDQUFzQixzQkFBdEIsQ0FBM0I7QUFDQXpCLGdCQUFVO0FBQUU0TCxlQUFPLEtBQUt0SSxNQUFkO0FBQXNCc00sZUFBT0osUUFBN0I7QUFBdUMsb0JBQVkxVCxXQUFuRDtBQUFnRSxzQkFBYyxDQUFDTSxTQUFEO0FBQTlFLE9BQVY7QUFDQXNULDhCQUF3QkQseUJBQXlCL04sT0FBekIsQ0FBaUMxQixPQUFqQyxDQUF4Qjs7QUFDQSxVQUFHMFAscUJBQUg7QUFDQ0QsaUNBQXlCSSxNQUF6QixDQUNDSCxzQkFBc0IvUyxHQUR2QixFQUVDO0FBQ0NtVCxnQkFBTTtBQUNMQyxtQkFBTztBQURGLFdBRFA7QUFJQ0MsZ0JBQU07QUFDTEMsc0JBQVUsSUFBSUMsSUFBSixFQURMO0FBRUxDLHlCQUFhLEtBQUs3TTtBQUZiO0FBSlAsU0FGRDtBQUREO0FBY0NtTSxpQ0FBeUJXLE1BQXpCLENBQ0M7QUFDQ3pULGVBQUs4Uyx5QkFBeUJZLFVBQXpCLEVBRE47QUFFQ3pFLGlCQUFPLEtBQUt0SSxNQUZiO0FBR0NzTSxpQkFBT0osUUFIUjtBQUlDdk8sa0JBQVE7QUFBQ3FQLGVBQUd4VSxXQUFKO0FBQWlCeVUsaUJBQUssQ0FBQ25VLFNBQUQ7QUFBdEIsV0FKVDtBQUtDMlQsaUJBQU8sQ0FMUjtBQU1DUyxtQkFBUyxJQUFJTixJQUFKLEVBTlY7QUFPQ08sc0JBQVksS0FBS25OLE1BUGxCO0FBUUMyTSxvQkFBVSxJQUFJQyxJQUFKLEVBUlg7QUFTQ0MsdUJBQWEsS0FBSzdNO0FBVG5CLFNBREQsRUFZQztBQUNDb04sb0JBQVU7QUFEWCxTQVpEO0FBdEJGO0FDaURHO0FEdkRKO0FBQUEsQ0FERCxFOzs7Ozs7Ozs7Ozs7QUVBQSxJQUFBQyxzQkFBQSxFQUFBQyxnQkFBQSxFQUFBQyxhQUFBOztBQUFBRCxtQkFBbUIsVUFBQ0gsVUFBRCxFQUFhcE4sT0FBYixFQUFzQnlOLFFBQXRCLEVBQWdDQyxRQUFoQztBQ0dqQixTREZEblYsUUFBUW9WLFdBQVIsQ0FBb0JDLG9CQUFwQixDQUF5Q0MsYUFBekMsR0FBeURDLFNBQXpELENBQW1FLENBQ2xFO0FBQUNDLFlBQVE7QUFBQ1gsa0JBQVlBLFVBQWI7QUFBeUJiLGFBQU92TTtBQUFoQztBQUFULEdBRGtFLEVBRWxFO0FBQUNnTyxZQUFRO0FBQUMxVSxXQUFLO0FBQUNiLHFCQUFhLFdBQWQ7QUFBMkJNLG1CQUFXLGFBQXRDO0FBQXFEd1QsZUFBTztBQUE1RCxPQUFOO0FBQTZFMEIsa0JBQVk7QUFBQ0MsY0FBTTtBQUFQO0FBQXpGO0FBQVQsR0FGa0UsRUFHbEU7QUFBQ0MsV0FBTztBQUFDRixrQkFBWSxDQUFDO0FBQWQ7QUFBUixHQUhrRSxFQUlsRTtBQUFDRyxZQUFRO0FBQVQsR0FKa0UsQ0FBbkUsRUFLR0MsT0FMSCxDQUtXLFVBQUNDLEdBQUQsRUFBTWhOLElBQU47QUFDVixRQUFHZ04sR0FBSDtBQUNDLFlBQU0sSUFBSUMsS0FBSixDQUFVRCxHQUFWLENBQU47QUNzQkU7O0FEcEJIaE4sU0FBS3pHLE9BQUwsQ0FBYSxVQUFDeVIsR0FBRDtBQ3NCVCxhRHJCSG1CLFNBQVN2UyxJQUFULENBQWNvUixJQUFJaFQsR0FBbEIsQ0NxQkc7QUR0Qko7O0FBR0EsUUFBR29VLFlBQVk5UyxFQUFFNFQsVUFBRixDQUFhZCxRQUFiLENBQWY7QUFDQ0E7QUNzQkU7QURuQ0osSUNFQztBREhpQixDQUFuQjs7QUFrQkFKLHlCQUF5Qm5WLE9BQU9zVyxTQUFQLENBQWlCbEIsZ0JBQWpCLENBQXpCOztBQUVBQyxnQkFBZ0IsVUFBQ2pCLEtBQUQsRUFBUTlULFdBQVIsRUFBb0J3SCxNQUFwQixFQUE0QnlPLFVBQTVCO0FBQ2YsTUFBQW5VLE9BQUEsRUFBQW9VLGtCQUFBLEVBQUFDLGdCQUFBLEVBQUF0TixJQUFBLEVBQUE3RyxNQUFBLEVBQUFvVSxLQUFBLEVBQUFDLFNBQUEsRUFBQUMsT0FBQSxFQUFBQyxlQUFBOztBQUFBMU4sU0FBTyxJQUFJNkQsS0FBSixFQUFQOztBQUVBLE1BQUd1SixVQUFIO0FBRUNuVSxjQUFVaEMsUUFBUUksU0FBUixDQUFrQkYsV0FBbEIsQ0FBVjtBQUVBa1cseUJBQXFCcFcsUUFBUTZGLGFBQVIsQ0FBc0IzRixXQUF0QixDQUFyQjtBQUNBbVcsdUJBQUFyVSxXQUFBLE9BQW1CQSxRQUFTaUUsY0FBNUIsR0FBNEIsTUFBNUI7O0FBQ0EsUUFBR2pFLFdBQVdvVSxrQkFBWCxJQUFpQ0MsZ0JBQXBDO0FBQ0NDLGNBQVEsRUFBUjtBQUNBRyx3QkFBa0JOLFdBQVdPLEtBQVgsQ0FBaUIsR0FBakIsQ0FBbEI7QUFDQUgsa0JBQVksRUFBWjtBQUNBRSxzQkFBZ0JuVSxPQUFoQixDQUF3QixVQUFDcVUsT0FBRDtBQUN2QixZQUFBQyxRQUFBO0FBQUFBLG1CQUFXLEVBQVg7QUFDQUEsaUJBQVNQLGdCQUFULElBQTZCO0FBQUNRLGtCQUFRRixRQUFRRyxJQUFSO0FBQVQsU0FBN0I7QUN3QkksZUR2QkpQLFVBQVU1VCxJQUFWLENBQWVpVSxRQUFmLENDdUJJO0FEMUJMO0FBS0FOLFlBQU1TLElBQU4sR0FBYVIsU0FBYjtBQUNBRCxZQUFNdEMsS0FBTixHQUFjO0FBQUNnRCxhQUFLLENBQUNoRCxLQUFEO0FBQU4sT0FBZDtBQUVBOVIsZUFBUztBQUFDbkIsYUFBSztBQUFOLE9BQVQ7QUFDQW1CLGFBQU9tVSxnQkFBUCxJQUEyQixDQUEzQjtBQUVBRyxnQkFBVUosbUJBQW1CclIsSUFBbkIsQ0FBd0J1UixLQUF4QixFQUErQjtBQUFDcFUsZ0JBQVFBLE1BQVQ7QUFBaUI0SSxjQUFNO0FBQUN1SixvQkFBVTtBQUFYLFNBQXZCO0FBQXNDNEMsZUFBTztBQUE3QyxPQUEvQixDQUFWO0FBRUFULGNBQVFsVSxPQUFSLENBQWdCLFVBQUMrQyxNQUFEO0FDK0JYLGVEOUJKMEQsS0FBS3BHLElBQUwsQ0FBVTtBQUFDNUIsZUFBS3NFLE9BQU90RSxHQUFiO0FBQWtCbVcsaUJBQU83UixPQUFPZ1IsZ0JBQVAsQ0FBekI7QUFBbURjLHdCQUFjalg7QUFBakUsU0FBVixDQzhCSTtBRC9CTDtBQXZCRjtBQzZERTs7QURuQ0YsU0FBTzZJLElBQVA7QUE3QmUsQ0FBaEI7O0FBK0JBbkosT0FBTytULE9BQVAsQ0FDQztBQUFBLDBCQUF3QixVQUFDbE0sT0FBRDtBQUN2QixRQUFBc0IsSUFBQSxFQUFBeU4sT0FBQTtBQUFBek4sV0FBTyxJQUFJNkQsS0FBSixFQUFQO0FBQ0E0SixjQUFVLElBQUk1SixLQUFKLEVBQVY7QUFDQW1JLDJCQUF1QixLQUFLck4sTUFBNUIsRUFBb0NELE9BQXBDLEVBQTZDK08sT0FBN0M7QUFDQUEsWUFBUWxVLE9BQVIsQ0FBZ0IsVUFBQ3VOLElBQUQ7QUFDZixVQUFBM04sTUFBQSxFQUFBbUQsTUFBQSxFQUFBK1IsYUFBQSxFQUFBQyx3QkFBQTtBQUFBRCxzQkFBZ0JwWCxRQUFRSSxTQUFSLENBQWtCeVAsS0FBSzNQLFdBQXZCLEVBQW9DMlAsS0FBS21FLEtBQXpDLENBQWhCOztBQUVBLFVBQUcsQ0FBQ29ELGFBQUo7QUFDQztBQ3VDRzs7QURyQ0pDLGlDQUEyQnJYLFFBQVE2RixhQUFSLENBQXNCZ0ssS0FBSzNQLFdBQTNCLEVBQXdDMlAsS0FBS21FLEtBQTdDLENBQTNCOztBQUVBLFVBQUdvRCxpQkFBaUJDLHdCQUFwQjtBQUNDblYsaUJBQVM7QUFBQ25CLGVBQUs7QUFBTixTQUFUO0FBRUFtQixlQUFPa1YsY0FBY25SLGNBQXJCLElBQXVDLENBQXZDO0FBRUFaLGlCQUFTZ1MseUJBQXlCdlIsT0FBekIsQ0FBaUMrSixLQUFLclAsU0FBTCxDQUFlLENBQWYsQ0FBakMsRUFBb0Q7QUFBQzBCLGtCQUFRQTtBQUFULFNBQXBELENBQVQ7O0FBQ0EsWUFBR21ELE1BQUg7QUN3Q00saUJEdkNMMEQsS0FBS3BHLElBQUwsQ0FBVTtBQUFDNUIsaUJBQUtzRSxPQUFPdEUsR0FBYjtBQUFrQm1XLG1CQUFPN1IsT0FBTytSLGNBQWNuUixjQUFyQixDQUF6QjtBQUErRGtSLDBCQUFjdEgsS0FBSzNQO0FBQWxGLFdBQVYsQ0N1Q0s7QUQ5Q1A7QUNvREk7QUQ1REw7QUFpQkEsV0FBTzZJLElBQVA7QUFyQkQ7QUF1QkEsMEJBQXdCLFVBQUNDLE9BQUQ7QUFDdkIsUUFBQUQsSUFBQSxFQUFBb04sVUFBQSxFQUFBbUIsSUFBQSxFQUFBdEQsS0FBQTtBQUFBc0QsV0FBTyxJQUFQO0FBRUF2TyxXQUFPLElBQUk2RCxLQUFKLEVBQVA7QUFFQXVKLGlCQUFhbk4sUUFBUW1OLFVBQXJCO0FBQ0FuQyxZQUFRaEwsUUFBUWdMLEtBQWhCOztBQUVBM1IsTUFBRUMsT0FBRixDQUFVdEMsUUFBUXVYLGFBQWxCLEVBQWlDLFVBQUN2VixPQUFELEVBQVUyQixJQUFWO0FBQ2hDLFVBQUE2VCxhQUFBOztBQUFBLFVBQUd4VixRQUFReVYsYUFBWDtBQUNDRCx3QkFBZ0J2QyxjQUFjakIsS0FBZCxFQUFxQmhTLFFBQVEyQixJQUE3QixFQUFtQzJULEtBQUs1UCxNQUF4QyxFQUFnRHlPLFVBQWhELENBQWhCO0FDNkNJLGVENUNKcE4sT0FBT0EsS0FBS3FDLE1BQUwsQ0FBWW9NLGFBQVosQ0M0Q0g7QUFDRDtBRGhETDs7QUFLQSxXQUFPek8sSUFBUDtBQXBDRDtBQUFBLENBREQsRTs7Ozs7Ozs7Ozs7O0FFbkRBbkosT0FBTytULE9BQVAsQ0FDSTtBQUFBK0Qsa0JBQWdCLFVBQUNDLFdBQUQsRUFBY3ZULE9BQWQsRUFBdUJ3VCxZQUF2QixFQUFxQ2pLLFlBQXJDO0FDQ2hCLFdEQUkzTixRQUFRb1YsV0FBUixDQUFvQnlDLGdCQUFwQixDQUFxQ0MsTUFBckMsQ0FBNEM3RCxNQUE1QyxDQUFtRDtBQUFDbFQsV0FBSzRXO0FBQU4sS0FBbkQsRUFBdUU7QUFBQ3ZELFlBQU07QUFBQ2hRLGlCQUFTQSxPQUFWO0FBQW1Cd1Qsc0JBQWNBLFlBQWpDO0FBQStDakssc0JBQWNBO0FBQTdEO0FBQVAsS0FBdkUsQ0NBSjtBRERBO0FBR0FvSyxrQkFBZ0IsVUFBQ0osV0FBRCxFQUFjSyxPQUFkO0FBQ1pDLFVBQU1ELE9BQU4sRUFBZXBMLEtBQWY7O0FBRUEsUUFBR29MLFFBQVExVCxNQUFSLEdBQWlCLENBQXBCO0FBQ0ksWUFBTSxJQUFJMUUsT0FBT29XLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0Isc0NBQXRCLENBQU47QUNRUDs7QUFDRCxXRFJJaFcsUUFBUW9WLFdBQVIsQ0FBb0J5QyxnQkFBcEIsQ0FBcUM1RCxNQUFyQyxDQUE0QztBQUFDbFQsV0FBSzRXO0FBQU4sS0FBNUMsRUFBZ0U7QUFBQ3ZELFlBQU07QUFBQzRELGlCQUFTQTtBQUFWO0FBQVAsS0FBaEUsQ0NRSjtBRGhCQTtBQUFBLENBREosRTs7Ozs7Ozs7Ozs7O0FFQUFwWSxPQUFPK1QsT0FBUCxDQUNDO0FBQUEsaUJBQWUsVUFBQzNLLE9BQUQ7QUFDZCxRQUFBa1AsY0FBQSxFQUFBQyxNQUFBLEVBQUFqVyxNQUFBLEVBQUFrVyxZQUFBLEVBQUFSLFlBQUEsRUFBQXhULE9BQUEsRUFBQXNPLFlBQUEsRUFBQXhTLFdBQUEsRUFBQUMsR0FBQSxFQUFBd1MsTUFBQSxFQUFBaEcsUUFBQSxFQUFBcUgsS0FBQSxFQUFBdE0sTUFBQTtBQUFBdVEsVUFBTWpQLE9BQU4sRUFBZXFCLE1BQWY7QUFDQTJKLFlBQVFoTCxRQUFRZ0wsS0FBaEI7QUFDQTlSLGFBQVM4RyxRQUFROUcsTUFBakI7QUFDQWhDLGtCQUFjOEksUUFBUTlJLFdBQXRCO0FBQ0EwWCxtQkFBZTVPLFFBQVE0TyxZQUF2QjtBQUNBeFQsY0FBVTRFLFFBQVE1RSxPQUFsQjtBQUNBZ1UsbUJBQWUsRUFBZjtBQUNBRixxQkFBaUIsRUFBakI7QUFDQXhGLG1CQUFBLENBQUF2UyxNQUFBSCxRQUFBSSxTQUFBLENBQUFGLFdBQUEsYUFBQUMsSUFBK0MrQixNQUEvQyxHQUErQyxNQUEvQzs7QUFDQUcsTUFBRWUsSUFBRixDQUFPbEIsTUFBUCxFQUFlLFVBQUMyTixJQUFELEVBQU9qRSxLQUFQO0FBQ2QsVUFBQXlNLFFBQUEsRUFBQTFVLElBQUEsRUFBQTJVLFdBQUEsRUFBQUMsTUFBQTtBQUFBQSxlQUFTMUksS0FBSzZHLEtBQUwsQ0FBVyxHQUFYLENBQVQ7QUFDQS9TLGFBQU80VSxPQUFPLENBQVAsQ0FBUDtBQUNBRCxvQkFBYzVGLGFBQWEvTyxJQUFiLENBQWQ7O0FBQ0EsVUFBRzRVLE9BQU9qVSxNQUFQLEdBQWdCLENBQWhCLElBQXNCZ1UsV0FBekI7QUFDQ0QsbUJBQVd4SSxLQUFLNUQsT0FBTCxDQUFhdEksT0FBTyxHQUFwQixFQUF5QixFQUF6QixDQUFYO0FBQ0F1VSx1QkFBZXZWLElBQWYsQ0FBb0I7QUFBQ2dCLGdCQUFNQSxJQUFQO0FBQWEwVSxvQkFBVUEsUUFBdkI7QUFBaUM3VCxpQkFBTzhUO0FBQXhDLFNBQXBCO0FDT0c7O0FBQ0QsYURQSEYsYUFBYXpVLElBQWIsSUFBcUIsQ0NPbEI7QURkSjs7QUFTQWdKLGVBQVcsRUFBWDtBQUNBakYsYUFBUyxLQUFLQSxNQUFkO0FBQ0FpRixhQUFTcUgsS0FBVCxHQUFpQkEsS0FBakI7O0FBQ0EsUUFBRzRELGlCQUFnQixRQUFuQjtBQUNDakwsZUFBU3FILEtBQVQsR0FDQztBQUFBZ0QsYUFBSyxDQUFDLElBQUQsRUFBTWhELEtBQU47QUFBTCxPQUREO0FBREQsV0FHSyxJQUFHNEQsaUJBQWdCLE1BQW5CO0FBQ0pqTCxlQUFTcUQsS0FBVCxHQUFpQnRJLE1BQWpCO0FDU0U7O0FEUEgsUUFBRzFILFFBQVF3WSxhQUFSLENBQXNCeEUsS0FBdEIsS0FBZ0NoVSxRQUFReVksWUFBUixDQUFxQnpFLEtBQXJCLEVBQTRCLEtBQUN0TSxNQUE3QixDQUFuQztBQUNDLGFBQU9pRixTQUFTcUgsS0FBaEI7QUNTRTs7QURQSCxRQUFHNVAsV0FBWUEsUUFBUUUsTUFBUixHQUFpQixDQUFoQztBQUNDcUksZUFBUyxNQUFULElBQW1CdkksT0FBbkI7QUNTRTs7QURQSCtULGFBQVNuWSxRQUFRNkYsYUFBUixDQUFzQjNGLFdBQXRCLEVBQW1DNkUsSUFBbkMsQ0FBd0M0SCxRQUF4QyxFQUFrRDtBQUFDekssY0FBUWtXLFlBQVQ7QUFBdUJNLFlBQU0sQ0FBN0I7QUFBZ0N6QixhQUFPO0FBQXZDLEtBQWxELENBQVQ7QUFHQXRFLGFBQVN3RixPQUFPUSxLQUFQLEVBQVQ7O0FBQ0EsUUFBR1QsZUFBZTVULE1BQWxCO0FBQ0NxTyxlQUFTQSxPQUFPN0csR0FBUCxDQUFXLFVBQUMrRCxJQUFELEVBQU1qRSxLQUFOO0FBQ25CdkosVUFBRWUsSUFBRixDQUFPOFUsY0FBUCxFQUF1QixVQUFDVSxpQkFBRCxFQUFvQmhOLEtBQXBCO0FBQ3RCLGNBQUFpTixvQkFBQSxFQUFBQyxPQUFBLEVBQUFDLFNBQUEsRUFBQXpULElBQUEsRUFBQTBULGFBQUEsRUFBQWpXLFlBQUEsRUFBQUwsSUFBQTtBQUFBb1csb0JBQVVGLGtCQUFrQmpWLElBQWxCLEdBQXlCLEtBQXpCLEdBQWlDaVYsa0JBQWtCUCxRQUFsQixDQUEyQnBNLE9BQTNCLENBQW1DLEtBQW5DLEVBQTBDLEtBQTFDLENBQTNDO0FBQ0E4TSxzQkFBWWxKLEtBQUsrSSxrQkFBa0JqVixJQUF2QixDQUFaO0FBQ0FqQixpQkFBT2tXLGtCQUFrQnBVLEtBQWxCLENBQXdCOUIsSUFBL0I7O0FBQ0EsY0FBRyxDQUFDLFFBQUQsRUFBVyxlQUFYLEVBQTRCdUIsT0FBNUIsQ0FBb0N2QixJQUFwQyxJQUE0QyxDQUFDLENBQWhEO0FBQ0NLLDJCQUFlNlYsa0JBQWtCcFUsS0FBbEIsQ0FBd0J6QixZQUF2QztBQUNBOFYsbUNBQXVCLEVBQXZCO0FBQ0FBLGlDQUFxQkQsa0JBQWtCUCxRQUF2QyxJQUFtRCxDQUFuRDtBQUNBVyw0QkFBZ0JoWixRQUFRNkYsYUFBUixDQUFzQjlDLFlBQXRCLEVBQW9DK0MsT0FBcEMsQ0FBNEM7QUFBQy9FLG1CQUFLZ1k7QUFBTixhQUE1QyxFQUE4RDtBQUFBN1csc0JBQVEyVztBQUFSLGFBQTlELENBQWhCOztBQUNBLGdCQUFHRyxhQUFIO0FBQ0NuSixtQkFBS2lKLE9BQUwsSUFBZ0JFLGNBQWNKLGtCQUFrQlAsUUFBaEMsQ0FBaEI7QUFORjtBQUFBLGlCQU9LLElBQUczVixTQUFRLFFBQVg7QUFDSnNHLHNCQUFVNFAsa0JBQWtCcFUsS0FBbEIsQ0FBd0J3RSxPQUFsQztBQUNBNkcsaUJBQUtpSixPQUFMLE1BQUF4VCxPQUFBakQsRUFBQXFDLFNBQUEsQ0FBQXNFLE9BQUE7QUNpQlFuRyxxQkFBT2tXO0FEakJmLG1CQ2tCYSxJRGxCYixHQ2tCb0J6VCxLRGxCc0MxQyxLQUExRCxHQUEwRCxNQUExRCxLQUFtRW1XLFNBQW5FO0FBRkk7QUFJSmxKLGlCQUFLaUosT0FBTCxJQUFnQkMsU0FBaEI7QUNtQks7O0FEbEJOLGVBQU9sSixLQUFLaUosT0FBTCxDQUFQO0FDb0JPLG1CRG5CTmpKLEtBQUtpSixPQUFMLElBQWdCLElDbUJWO0FBQ0Q7QURyQ1A7O0FBa0JBLGVBQU9qSixJQUFQO0FBbkJRLFFBQVQ7QUFvQkEsYUFBTzhDLE1BQVA7QUFyQkQ7QUF1QkMsYUFBT0EsTUFBUDtBQ3VCRTtBRHBGSjtBQUFBLENBREQsRTs7Ozs7Ozs7Ozs7O0FFQUE7Ozs7Ozs7O0dBVUEvUyxPQUFPK1QsT0FBUCxDQUNJO0FBQUEsMkJBQXlCLFVBQUN6VCxXQUFELEVBQWNTLFlBQWQsRUFBNEJtSyxJQUE1QjtBQUNyQixRQUFBaUosR0FBQSxFQUFBM08sR0FBQSxFQUFBNlQsT0FBQSxFQUFBdlIsTUFBQTtBQUFBQSxhQUFTLEtBQUtBLE1BQWQ7QUFDQXVSLGNBQVVqWixRQUFRb1YsV0FBUixDQUFvQnZWLFFBQXBCLENBQTZCaUcsT0FBN0IsQ0FBcUM7QUFBQzVGLG1CQUFhQSxXQUFkO0FBQTJCTSxpQkFBVyxrQkFBdEM7QUFBMER3UCxhQUFPdEk7QUFBakUsS0FBckMsQ0FBVjs7QUFDQSxRQUFHdVIsT0FBSDtBQ01GLGFETE1qWixRQUFRb1YsV0FBUixDQUFvQnZWLFFBQXBCLENBQTZCb1UsTUFBN0IsQ0FBb0M7QUFBQ2xULGFBQUtrWSxRQUFRbFk7QUFBZCxPQUFwQyxFQUF3RDtBQUFDcVQsZUNTM0RoUCxNRFRpRSxFQ1NqRSxFQUNBQSxJRFZrRSxjQUFZekUsWUFBWixHQUF5QixPQ1UzRixJRFZtR21LLElDU25HLEVBRUExRixHRFgyRDtBQUFELE9BQXhELENDS047QURORTtBQUdJMk8sWUFDSTtBQUFBclIsY0FBTSxNQUFOO0FBQ0F4QyxxQkFBYUEsV0FEYjtBQUVBTSxtQkFBVyxrQkFGWDtBQUdBWCxrQkFBVSxFQUhWO0FBSUFtUSxlQUFPdEk7QUFKUCxPQURKO0FBT0FxTSxVQUFJbFUsUUFBSixDQUFhYyxZQUFiLElBQTZCLEVBQTdCO0FBQ0FvVCxVQUFJbFUsUUFBSixDQUFhYyxZQUFiLEVBQTJCbUssSUFBM0IsR0FBa0NBLElBQWxDO0FDY04sYURaTTlLLFFBQVFvVixXQUFSLENBQW9CdlYsUUFBcEIsQ0FBNkIyVSxNQUE3QixDQUFvQ1QsR0FBcEMsQ0NZTjtBQUNEO0FEN0JEO0FBa0JBLG1DQUFpQyxVQUFDN1QsV0FBRCxFQUFjUyxZQUFkLEVBQTRCdVksWUFBNUI7QUFDN0IsUUFBQW5GLEdBQUEsRUFBQTNPLEdBQUEsRUFBQTZULE9BQUEsRUFBQXZSLE1BQUE7QUFBQUEsYUFBUyxLQUFLQSxNQUFkO0FBQ0F1UixjQUFValosUUFBUW9WLFdBQVIsQ0FBb0J2VixRQUFwQixDQUE2QmlHLE9BQTdCLENBQXFDO0FBQUM1RixtQkFBYUEsV0FBZDtBQUEyQk0saUJBQVcsa0JBQXRDO0FBQTBEd1AsYUFBT3RJO0FBQWpFLEtBQXJDLENBQVY7O0FBQ0EsUUFBR3VSLE9BQUg7QUNtQkYsYURsQk1qWixRQUFRb1YsV0FBUixDQUFvQnZWLFFBQXBCLENBQTZCb1UsTUFBN0IsQ0FBb0M7QUFBQ2xULGFBQUtrWSxRQUFRbFk7QUFBZCxPQUFwQyxFQUF3RDtBQUFDcVQsZUNzQjNEaFAsTUR0QmlFLEVDc0JqRSxFQUNBQSxJRHZCa0UsY0FBWXpFLFlBQVosR0FBeUIsZUN1QjNGLElEdkIyR3VZLFlDc0IzRyxFQUVBOVQsR0R4QjJEO0FBQUQsT0FBeEQsQ0NrQk47QURuQkU7QUFHSTJPLFlBQ0k7QUFBQXJSLGNBQU0sTUFBTjtBQUNBeEMscUJBQWFBLFdBRGI7QUFFQU0sbUJBQVcsa0JBRlg7QUFHQVgsa0JBQVUsRUFIVjtBQUlBbVEsZUFBT3RJO0FBSlAsT0FESjtBQU9BcU0sVUFBSWxVLFFBQUosQ0FBYWMsWUFBYixJQUE2QixFQUE3QjtBQUNBb1QsVUFBSWxVLFFBQUosQ0FBYWMsWUFBYixFQUEyQnVZLFlBQTNCLEdBQTBDQSxZQUExQztBQzJCTixhRHpCTWxaLFFBQVFvVixXQUFSLENBQW9CdlYsUUFBcEIsQ0FBNkIyVSxNQUE3QixDQUFvQ1QsR0FBcEMsQ0N5Qk47QUFDRDtBRDVERDtBQW9DQSxtQkFBaUIsVUFBQzdULFdBQUQsRUFBY1MsWUFBZCxFQUE0QnVZLFlBQTVCLEVBQTBDcE8sSUFBMUM7QUFDYixRQUFBaUosR0FBQSxFQUFBM08sR0FBQSxFQUFBK1QsSUFBQSxFQUFBaFosR0FBQSxFQUFBbUYsSUFBQSxFQUFBMlQsT0FBQSxFQUFBdlIsTUFBQTtBQUFBQSxhQUFTLEtBQUtBLE1BQWQ7QUFDQXVSLGNBQVVqWixRQUFRb1YsV0FBUixDQUFvQnZWLFFBQXBCLENBQTZCaUcsT0FBN0IsQ0FBcUM7QUFBQzVGLG1CQUFhQSxXQUFkO0FBQTJCTSxpQkFBVyxrQkFBdEM7QUFBMER3UCxhQUFPdEk7QUFBakUsS0FBckMsQ0FBVjs7QUFDQSxRQUFHdVIsT0FBSDtBQUVJQyxtQkFBYUUsV0FBYixLQUFBalosTUFBQThZLFFBQUFwWixRQUFBLE1BQUFjLFlBQUEsY0FBQTJFLE9BQUFuRixJQUFBK1ksWUFBQSxZQUFBNVQsS0FBaUY4VCxXQUFqRixHQUFpRixNQUFqRixHQUFpRixNQUFqRixNQUFnRyxFQUFoRyxHQUF3RyxFQUF4RyxHQUFnSCxFQUFoSDs7QUFDQSxVQUFHdE8sSUFBSDtBQytCSixlRDlCUTlLLFFBQVFvVixXQUFSLENBQW9CdlYsUUFBcEIsQ0FBNkJvVSxNQUE3QixDQUFvQztBQUFDbFQsZUFBS2tZLFFBQVFsWTtBQUFkLFNBQXBDLEVBQXdEO0FBQUNxVCxpQkNrQzdEaFAsTURsQ21FLEVDa0NuRSxFQUNBQSxJRG5Db0UsY0FBWXpFLFlBQVosR0FBeUIsT0NtQzdGLElEbkNxR21LLElDa0NyRyxFQUVBMUYsSURwQzJHLGNBQVl6RSxZQUFaLEdBQXlCLGVDb0NwSSxJRHBDb0p1WSxZQ2tDcEosRUFHQTlULEdEckM2RDtBQUFELFNBQXhELENDOEJSO0FEL0JJO0FDMENKLGVEdkNRcEYsUUFBUW9WLFdBQVIsQ0FBb0J2VixRQUFwQixDQUE2Qm9VLE1BQTdCLENBQW9DO0FBQUNsVCxlQUFLa1ksUUFBUWxZO0FBQWQsU0FBcEMsRUFBd0Q7QUFBQ3FULGlCQzJDN0QrRSxPRDNDbUUsRUMyQ25FLEVBQ0FBLEtENUNvRSxjQUFZeFksWUFBWixHQUF5QixlQzRDN0YsSUQ1QzZHdVksWUMyQzdHLEVBRUFDLElEN0M2RDtBQUFELFNBQXhELENDdUNSO0FEN0NBO0FBQUE7QUFRSXBGLFlBQ0k7QUFBQXJSLGNBQU0sTUFBTjtBQUNBeEMscUJBQWFBLFdBRGI7QUFFQU0sbUJBQVcsa0JBRlg7QUFHQVgsa0JBQVUsRUFIVjtBQUlBbVEsZUFBT3RJO0FBSlAsT0FESjtBQU9BcU0sVUFBSWxVLFFBQUosQ0FBYWMsWUFBYixJQUE2QixFQUE3QjtBQUNBb1QsVUFBSWxVLFFBQUosQ0FBYWMsWUFBYixFQUEyQnVZLFlBQTNCLEdBQTBDQSxZQUExQztBQUNBbkYsVUFBSWxVLFFBQUosQ0FBYWMsWUFBYixFQUEyQm1LLElBQTNCLEdBQWtDQSxJQUFsQztBQ2lETixhRC9DTTlLLFFBQVFvVixXQUFSLENBQW9CdlYsUUFBcEIsQ0FBNkIyVSxNQUE3QixDQUFvQ1QsR0FBcEMsQ0MrQ047QUFDRDtBRDFHRDtBQUFBLENBREosRTs7Ozs7Ozs7Ozs7O0FFVkEsSUFBQXNGLGNBQUEsRUFBQUMsZUFBQSxFQUFBQyxhQUFBLEVBQUFDLEVBQUEsRUFBQUMsTUFBQSxFQUFBQyxNQUFBLEVBQUFqUixJQUFBLEVBQUFrUixNQUFBOztBQUFBQSxTQUFTQyxRQUFRLFFBQVIsQ0FBVDtBQUNBSixLQUFLSSxRQUFRLElBQVIsQ0FBTDtBQUNBblIsT0FBT21SLFFBQVEsTUFBUixDQUFQO0FBQ0FGLFNBQVNFLFFBQVEsUUFBUixDQUFUO0FBRUFILFNBQVMsSUFBSUksTUFBSixDQUFXLGVBQVgsQ0FBVDs7QUFFQU4sZ0JBQWdCLFVBQUNPLE9BQUQsRUFBU0MsT0FBVDtBQUVmLE1BQUFDLE9BQUEsRUFBQUMsR0FBQSxFQUFBQyxXQUFBLEVBQUFDLFFBQUEsRUFBQUMsUUFBQSxFQUFBQyxLQUFBLEVBQUFDLEdBQUEsRUFBQUMsTUFBQSxFQUFBQyxHQUFBLEVBQUFDLElBQUE7QUFBQVQsWUFBVSxJQUFJTCxPQUFPZSxPQUFYLEVBQVY7QUFDQUYsUUFBTVIsUUFBUVcsV0FBUixDQUFvQmIsT0FBcEIsQ0FBTjtBQUdBUyxXQUFTLElBQUlLLE1BQUosQ0FBV0osR0FBWCxDQUFUO0FBR0FGLFFBQU0sSUFBSWhHLElBQUosRUFBTjtBQUNBbUcsU0FBT0gsSUFBSU8sV0FBSixFQUFQO0FBQ0FSLFVBQVFDLElBQUlRLFFBQUosS0FBaUIsQ0FBekI7QUFDQWIsUUFBTUssSUFBSVMsT0FBSixFQUFOO0FBR0FYLGFBQVczUixLQUFLK0ssSUFBTCxDQUFVd0gscUJBQXFCQyxTQUEvQixFQUF5QyxxQkFBcUJSLElBQXJCLEdBQTRCLEdBQTVCLEdBQWtDSixLQUFsQyxHQUEwQyxHQUExQyxHQUFnREosR0FBaEQsR0FBc0QsR0FBdEQsR0FBNERGLE9BQXJHLENBQVg7QUFDQUksYUFBQSxDQUFBTCxXQUFBLE9BQVdBLFFBQVMvWSxHQUFwQixHQUFvQixNQUFwQixJQUEwQixNQUExQjtBQUNBbVosZ0JBQWN6UixLQUFLK0ssSUFBTCxDQUFVNEcsUUFBVixFQUFvQkQsUUFBcEIsQ0FBZDs7QUFFQSxNQUFHLENBQUNYLEdBQUcwQixVQUFILENBQWNkLFFBQWQsQ0FBSjtBQUNDVixXQUFPeUIsSUFBUCxDQUFZZixRQUFaO0FDREM7O0FESUZaLEtBQUc0QixTQUFILENBQWFsQixXQUFiLEVBQTBCSyxNQUExQixFQUFrQyxVQUFDeEUsR0FBRDtBQUNqQyxRQUFHQSxHQUFIO0FDRkksYURHSDBELE9BQU9uTixLQUFQLENBQWdCd04sUUFBUS9ZLEdBQVIsR0FBWSxXQUE1QixFQUF1Q2dWLEdBQXZDLENDSEc7QUFDRDtBREFKO0FBSUEsU0FBT3FFLFFBQVA7QUEzQmUsQ0FBaEI7O0FBK0JBZixpQkFBaUIsVUFBQ2pVLEdBQUQsRUFBSzJVLE9BQUw7QUFFaEIsTUFBQUQsT0FBQSxFQUFBdUIsT0FBQSxFQUFBQyxPQUFBLEVBQUFDLFVBQUEsRUFBQUMsU0FBQSxFQUFBcmIsR0FBQTtBQUFBMlosWUFBVSxFQUFWO0FBRUEwQixjQUFBLE9BQUF4YixPQUFBLG9CQUFBQSxZQUFBLFFBQUFHLE1BQUFILFFBQUFJLFNBQUEsQ0FBQTJaLE9BQUEsYUFBQTVaLElBQXlDK0IsTUFBekMsR0FBeUMsTUFBekMsR0FBeUMsTUFBekM7O0FBRUFxWixlQUFhLFVBQUNFLFVBQUQ7QUNKVixXREtGM0IsUUFBUTJCLFVBQVIsSUFBc0JyVyxJQUFJcVcsVUFBSixLQUFtQixFQ0x2QztBRElVLEdBQWI7O0FBR0FILFlBQVUsVUFBQ0csVUFBRCxFQUFZL1ksSUFBWjtBQUNULFFBQUFnWixJQUFBLEVBQUFDLE9BQUEsRUFBQUMsTUFBQTtBQUFBRixXQUFPdFcsSUFBSXFXLFVBQUosQ0FBUDs7QUFDQSxRQUFHL1ksU0FBUSxNQUFYO0FBQ0NrWixlQUFTLFlBQVQ7QUFERDtBQUdDQSxlQUFTLHFCQUFUO0FDSEU7O0FESUgsUUFBR0YsUUFBQSxRQUFVRSxVQUFBLElBQWI7QUFDQ0QsZ0JBQVVFLE9BQU9ILElBQVAsRUFBYUUsTUFBYixDQUFvQkEsTUFBcEIsQ0FBVjtBQ0ZFOztBQUNELFdERUY5QixRQUFRMkIsVUFBUixJQUFzQkUsV0FBVyxFQ0YvQjtBRE5PLEdBQVY7O0FBVUFOLFlBQVUsVUFBQ0ksVUFBRDtBQUNULFFBQUdyVyxJQUFJcVcsVUFBSixNQUFtQixJQUF0QjtBQ0RJLGFERUgzQixRQUFRMkIsVUFBUixJQUFzQixHQ0ZuQjtBRENKLFdBRUssSUFBR3JXLElBQUlxVyxVQUFKLE1BQW1CLEtBQXRCO0FDREQsYURFSDNCLFFBQVEyQixVQUFSLElBQXNCLEdDRm5CO0FEQ0M7QUNDRCxhREVIM0IsUUFBUTJCLFVBQVIsSUFBc0IsRUNGbkI7QUFDRDtBRExNLEdBQVY7O0FBU0FwWixJQUFFZSxJQUFGLENBQU9vWSxTQUFQLEVBQWtCLFVBQUNoWCxLQUFELEVBQVFpWCxVQUFSO0FBQ2pCLFlBQUFqWCxTQUFBLE9BQU9BLE1BQU85QixJQUFkLEdBQWMsTUFBZDtBQUFBLFdBQ00sTUFETjtBQUFBLFdBQ2EsVUFEYjtBQ0NNLGVEQXVCNFksUUFBUUcsVUFBUixFQUFtQmpYLE1BQU05QixJQUF6QixDQ0F2Qjs7QURETixXQUVNLFNBRk47QUNHTSxlRERlMlksUUFBUUksVUFBUixDQ0NmOztBREhOO0FDS00sZURGQUYsV0FBV0UsVUFBWCxDQ0VBO0FETE47QUFERDs7QUFNQSxTQUFPM0IsT0FBUDtBQWxDZ0IsQ0FBakI7O0FBcUNBUixrQkFBa0IsVUFBQ2xVLEdBQUQsRUFBSzJVLE9BQUw7QUFFakIsTUFBQStCLGVBQUEsRUFBQTNOLGVBQUE7QUFBQUEsb0JBQWtCLEVBQWxCO0FBR0EyTixvQkFBQSxPQUFBOWIsT0FBQSxvQkFBQUEsWUFBQSxPQUFrQkEsUUFBUzhTLG9CQUFULENBQThCaUgsT0FBOUIsQ0FBbEIsR0FBa0IsTUFBbEI7QUFHQStCLGtCQUFnQnhaLE9BQWhCLENBQXdCLFVBQUN5WixjQUFEO0FBRXZCLFFBQUE3WixNQUFBLEVBQUFpWCxJQUFBLEVBQUFoWixHQUFBLEVBQUE2YixpQkFBQSxFQUFBQyxpQkFBQSxFQUFBQyxnQkFBQSxFQUFBdmEsa0JBQUE7QUFBQXVhLHVCQUFtQixFQUFuQjs7QUFJQSxRQUFHSCxtQkFBa0IsV0FBckI7QUFDQ3BhLDJCQUFxQixZQUFyQjtBQUREO0FBSUNPLGVBQUEsT0FBQWxDLE9BQUEsb0JBQUFBLFlBQUEsUUFBQUcsTUFBQUgsUUFBQTZLLE9BQUEsQ0FBQWtSLGNBQUEsYUFBQTViLElBQTJDK0IsTUFBM0MsR0FBMkMsTUFBM0MsR0FBMkMsTUFBM0M7QUFFQVAsMkJBQXFCLEVBQXJCOztBQUNBVSxRQUFFZSxJQUFGLENBQU9sQixNQUFQLEVBQWUsVUFBQ3NDLEtBQUQsRUFBUWlYLFVBQVI7QUFDZCxhQUFBalgsU0FBQSxPQUFHQSxNQUFPekIsWUFBVixHQUFVLE1BQVYsTUFBMEJnWCxPQUExQjtBQ0xNLGlCRE1McFkscUJBQXFCOFosVUNOaEI7QUFDRDtBREdOO0FDREU7O0FETUgsUUFBRzlaLGtCQUFIO0FBQ0NxYSwwQkFBb0JoYyxRQUFRNkYsYUFBUixDQUFzQmtXLGNBQXRCLENBQXBCO0FBRUFFLDBCQUFvQkQsa0JBQWtCalgsSUFBbEIsRUNMZm9VLE9ES3NDLEVDTHRDLEVBQ0FBLEtESXVDLEtBQUd4WCxrQkNKMUMsSURJK0R5RCxJQUFJckUsR0NMbkUsRUFFQW9ZLElER2UsR0FBMERSLEtBQTFELEVBQXBCO0FBRUFzRCx3QkFBa0IzWixPQUFsQixDQUEwQixVQUFDNlosVUFBRDtBQUV6QixZQUFBQyxVQUFBO0FBQUFBLHFCQUFhL0MsZUFBZThDLFVBQWYsRUFBMEJKLGNBQTFCLENBQWI7QUNGSSxlRElKRyxpQkFBaUJ2WixJQUFqQixDQUFzQnlaLFVBQXRCLENDSkk7QURBTDtBQ0VFOztBQUNELFdESUZqTyxnQkFBZ0I0TixjQUFoQixJQUFrQ0csZ0JDSmhDO0FEMUJIO0FBZ0NBLFNBQU8vTixlQUFQO0FBeENpQixDQUFsQjs7QUEyQ0FuTyxRQUFRcWMsVUFBUixHQUFxQixVQUFDdEMsT0FBRCxFQUFVdUMsVUFBVjtBQUNwQixNQUFBblgsVUFBQTtBQUFBc1UsU0FBTzhDLElBQVAsQ0FBWSx3QkFBWjtBQUVBaFEsVUFBUWlRLElBQVIsQ0FBYSxvQkFBYjtBQU1BclgsZUFBYW5GLFFBQVE2RixhQUFSLENBQXNCa1UsT0FBdEIsQ0FBYjtBQUVBdUMsZUFBYW5YLFdBQVdKLElBQVgsQ0FBZ0IsRUFBaEIsRUFBb0I0VCxLQUFwQixFQUFiO0FBRUEyRCxhQUFXaGEsT0FBWCxDQUFtQixVQUFDbWEsU0FBRDtBQUNsQixRQUFBTCxVQUFBLEVBQUFoQyxRQUFBLEVBQUFOLE9BQUEsRUFBQTNMLGVBQUE7QUFBQTJMLGNBQVUsRUFBVjtBQUNBQSxZQUFRL1ksR0FBUixHQUFjMGIsVUFBVTFiLEdBQXhCO0FBR0FxYixpQkFBYS9DLGVBQWVvRCxTQUFmLEVBQXlCMUMsT0FBekIsQ0FBYjtBQUNBRCxZQUFRQyxPQUFSLElBQW1CcUMsVUFBbkI7QUFHQWpPLHNCQUFrQm1MLGdCQUFnQm1ELFNBQWhCLEVBQTBCMUMsT0FBMUIsQ0FBbEI7QUFFQUQsWUFBUSxpQkFBUixJQUE2QjNMLGVBQTdCO0FDZEUsV0RpQkZpTSxXQUFXYixjQUFjTyxPQUFkLEVBQXNCQyxPQUF0QixDQ2pCVDtBREdIO0FBZ0JBeE4sVUFBUW1RLE9BQVIsQ0FBZ0Isb0JBQWhCO0FBQ0EsU0FBT3RDLFFBQVA7QUE5Qm9CLENBQXJCLEM7Ozs7Ozs7Ozs7OztBRXRIQXhhLE9BQU8rVCxPQUFQLENBQ0M7QUFBQWdKLDJCQUF5QixVQUFDemMsV0FBRCxFQUFjd0IsbUJBQWQsRUFBbUNDLGtCQUFuQyxFQUF1RG5CLFNBQXZELEVBQWtFaUgsT0FBbEU7QUFDeEIsUUFBQVAsV0FBQSxFQUFBMFYsZUFBQSxFQUFBalEsUUFBQSxFQUFBakYsTUFBQTtBQUFBQSxhQUFTLEtBQUtBLE1BQWQ7O0FBQ0EsUUFBR2hHLHdCQUF1QixzQkFBMUI7QUFDQ2lMLGlCQUFXO0FBQUMsMEJBQWtCbEY7QUFBbkIsT0FBWDtBQUREO0FBR0NrRixpQkFBVztBQUFDcUgsZUFBT3ZNO0FBQVIsT0FBWDtBQ01FOztBREpILFFBQUcvRix3QkFBdUIsV0FBMUI7QUFFQ2lMLGVBQVMsVUFBVCxJQUF1QnpNLFdBQXZCO0FBQ0F5TSxlQUFTLFlBQVQsSUFBeUIsQ0FBQ25NLFNBQUQsQ0FBekI7QUFIRDtBQUtDbU0sZUFBU2hMLGtCQUFULElBQStCbkIsU0FBL0I7QUNLRTs7QURISDBHLGtCQUFjbEgsUUFBUXVPLGNBQVIsQ0FBdUI3TSxtQkFBdkIsRUFBNEMrRixPQUE1QyxFQUFxREMsTUFBckQsQ0FBZDs7QUFDQSxRQUFHLENBQUNSLFlBQVkyVixjQUFiLElBQWdDM1YsWUFBWUMsU0FBL0M7QUFDQ3dGLGVBQVNxRCxLQUFULEdBQWlCdEksTUFBakI7QUNLRTs7QURISGtWLHNCQUFrQjVjLFFBQVE2RixhQUFSLENBQXNCbkUsbUJBQXRCLEVBQTJDcUQsSUFBM0MsQ0FBZ0Q0SCxRQUFoRCxDQUFsQjtBQUNBLFdBQU9pUSxnQkFBZ0J6SSxLQUFoQixFQUFQO0FBbkJEO0FBQUEsQ0FERCxFOzs7Ozs7Ozs7Ozs7QUVBQXZVLE9BQU8rVCxPQUFQLENBQ0M7QUFBQW1KLHVCQUFxQixVQUFDQyxTQUFELEVBQVl0VixPQUFaO0FBQ3BCLFFBQUF1VixXQUFBLEVBQUFDLFNBQUE7QUFBQUQsa0JBQWNFLEdBQUdDLEtBQUgsQ0FBU3JYLE9BQVQsQ0FBaUI7QUFBQy9FLFdBQUtnYztBQUFOLEtBQWpCLEVBQW1DcFosSUFBakQ7QUFDQXNaLGdCQUFZQyxHQUFHRSxNQUFILENBQVV0WCxPQUFWLENBQWtCO0FBQUMvRSxXQUFLMEc7QUFBTixLQUFsQixFQUFrQzlELElBQTlDO0FBRUEsV0FBTztBQUFDMFosZUFBU0wsV0FBVjtBQUF1QmhKLGFBQU9pSjtBQUE5QixLQUFQO0FBSkQ7QUFNQUssbUJBQWlCLFVBQUN2YyxHQUFEO0FDUWQsV0RQRm1jLEdBQUdLLFdBQUgsQ0FBZXpGLE1BQWYsQ0FBc0I3RCxNQUF0QixDQUE2QjtBQUFDbFQsV0FBS0E7QUFBTixLQUE3QixFQUF3QztBQUFDcVQsWUFBTTtBQUFDb0osc0JBQWM7QUFBZjtBQUFQLEtBQXhDLENDT0U7QURkSDtBQVNBQyxtQkFBaUIsVUFBQzFjLEdBQUQ7QUNjZCxXRGJGbWMsR0FBR0ssV0FBSCxDQUFlekYsTUFBZixDQUFzQjdELE1BQXRCLENBQTZCO0FBQUNsVCxXQUFLQTtBQUFOLEtBQTdCLEVBQXdDO0FBQUNxVCxZQUFNO0FBQUNvSixzQkFBYyxVQUFmO0FBQTJCRSx1QkFBZTtBQUExQztBQUFQLEtBQXhDLENDYUU7QUR2Qkg7QUFBQSxDQURELEU7Ozs7Ozs7Ozs7OztBRUFBOWQsT0FBTytkLE9BQVAsQ0FBZSx1QkFBZixFQUF3QyxVQUFDemQsV0FBRCxFQUFjb0csRUFBZCxFQUFrQnNOLFFBQWxCO0FBQ3ZDLE1BQUF6TyxVQUFBO0FBQUFBLGVBQWFuRixRQUFRNkYsYUFBUixDQUFzQjNGLFdBQXRCLEVBQW1DMFQsUUFBbkMsQ0FBYjs7QUFDQSxNQUFHek8sVUFBSDtBQUNDLFdBQU9BLFdBQVdKLElBQVgsQ0FBZ0I7QUFBQ2hFLFdBQUt1RjtBQUFOLEtBQWhCLENBQVA7QUNJQztBRFBILEc7Ozs7Ozs7Ozs7OztBRUFBMUcsT0FBT2dlLGdCQUFQLENBQXdCLHdCQUF4QixFQUFrRCxVQUFDQyxTQUFELEVBQVlsSixHQUFaLEVBQWlCelMsTUFBakIsRUFBeUJ1RixPQUF6QjtBQUNqRCxNQUFBcVcsT0FBQSxFQUFBak0sS0FBQSxFQUFBN1AsT0FBQSxFQUFBbVYsWUFBQSxFQUFBcE8sSUFBQSxFQUFBdUcsSUFBQSxFQUFBeU8saUJBQUEsRUFBQUMsZ0JBQUEsRUFBQTFHLElBQUE7O0FBQUEsT0FBTyxLQUFLNVAsTUFBWjtBQUNDLFdBQU8sS0FBS3VXLEtBQUwsRUFBUDtBQ0VDOztBREFGaEcsUUFBTTRGLFNBQU4sRUFBaUJLLE1BQWpCO0FBQ0FqRyxRQUFNdEQsR0FBTixFQUFXL0gsS0FBWDtBQUNBcUwsUUFBTS9WLE1BQU4sRUFBY2ljLE1BQU1DLFFBQU4sQ0FBZS9ULE1BQWYsQ0FBZDtBQUVBOE0saUJBQWUwRyxVQUFVNVIsT0FBVixDQUFrQixVQUFsQixFQUE2QixFQUE3QixDQUFmO0FBQ0FqSyxZQUFVaEMsUUFBUUksU0FBUixDQUFrQitXLFlBQWxCLEVBQWdDMVAsT0FBaEMsQ0FBVjs7QUFFQSxNQUFHQSxPQUFIO0FBQ0MwUCxtQkFBZW5YLFFBQVFxZSxhQUFSLENBQXNCcmMsT0FBdEIsQ0FBZjtBQ0FDOztBREVGK2Isc0JBQW9CL2QsUUFBUTZGLGFBQVIsQ0FBc0JzUixZQUF0QixDQUFwQjtBQUdBMkcsWUFBQTliLFdBQUEsT0FBVUEsUUFBU0UsTUFBbkIsR0FBbUIsTUFBbkI7O0FBQ0EsTUFBRyxDQUFDNGIsT0FBRCxJQUFZLENBQUNDLGlCQUFoQjtBQUNDLFdBQU8sS0FBS0UsS0FBTCxFQUFQO0FDRkM7O0FESUZELHFCQUFtQjNiLEVBQUV1SSxNQUFGLENBQVNrVCxPQUFULEVBQWtCLFVBQUN2YixDQUFEO0FBQ3BDLFdBQU9GLEVBQUU0VCxVQUFGLENBQWExVCxFQUFFUSxZQUFmLEtBQWdDLENBQUNWLEVBQUUwSixPQUFGLENBQVV4SixFQUFFUSxZQUFaLENBQXhDO0FBRGtCLElBQW5CO0FBR0F1VSxTQUFPLElBQVA7QUFFQUEsT0FBS2dILE9BQUw7O0FBRUEsTUFBR04saUJBQWlCMVosTUFBakIsR0FBMEIsQ0FBN0I7QUFDQ3lFLFdBQU87QUFDTmhFLFlBQU07QUFDTCxZQUFBd1osVUFBQTtBQUFBakgsYUFBS2dILE9BQUw7QUFDQUMscUJBQWEsRUFBYjs7QUFDQWxjLFVBQUVlLElBQUYsQ0FBT2YsRUFBRWlOLElBQUYsQ0FBT3BOLE1BQVAsQ0FBUCxFQUF1QixVQUFDSyxDQUFEO0FBQ3RCLGVBQU8sa0JBQWtCeUIsSUFBbEIsQ0FBdUJ6QixDQUF2QixDQUFQO0FDSE8sbUJESU5nYyxXQUFXaGMsQ0FBWCxJQUFnQixDQ0pWO0FBQ0Q7QURDUDs7QUFJQSxlQUFPd2Isa0JBQWtCaFosSUFBbEIsQ0FBdUI7QUFBQ2hFLGVBQUs7QUFBQ2lXLGlCQUFLckM7QUFBTjtBQUFOLFNBQXZCLEVBQTBDO0FBQUN6UyxrQkFBUXFjO0FBQVQsU0FBMUMsQ0FBUDtBQVJLO0FBQUEsS0FBUDtBQVdBeFYsU0FBS0YsUUFBTCxHQUFnQixFQUFoQjtBQUVBeUcsV0FBT2pOLEVBQUVpTixJQUFGLENBQU9wTixNQUFQLENBQVA7O0FBRUEsUUFBR29OLEtBQUtoTCxNQUFMLEdBQWMsQ0FBakI7QUFDQ2dMLGFBQU9qTixFQUFFaU4sSUFBRixDQUFPd08sT0FBUCxDQUFQO0FDRUU7O0FEQUhqTSxZQUFRLEVBQVI7QUFFQXZDLFNBQUtoTixPQUFMLENBQWEsVUFBQ29ILEdBQUQ7QUFDWixVQUFHMUgsUUFBUTNCLE1BQVIsQ0FBZW1lLFdBQWYsQ0FBMkI5VSxNQUFNLEdBQWpDLENBQUg7QUFDQ21JLGdCQUFRQSxNQUFNekcsTUFBTixDQUFhL0ksRUFBRXlKLEdBQUYsQ0FBTTlKLFFBQVEzQixNQUFSLENBQWVtZSxXQUFmLENBQTJCOVUsTUFBTSxHQUFqQyxDQUFOLEVBQTZDLFVBQUNsSCxDQUFEO0FBQ2pFLGlCQUFPa0gsTUFBTSxHQUFOLEdBQVlsSCxDQUFuQjtBQURvQixVQUFiLENBQVI7QUNHRzs7QUFDRCxhRERIcVAsTUFBTWxQLElBQU4sQ0FBVytHLEdBQVgsQ0NDRztBRE5KOztBQU9BbUksVUFBTXZQLE9BQU4sQ0FBYyxVQUFDb0gsR0FBRDtBQUNiLFVBQUErVSxlQUFBO0FBQUFBLHdCQUFrQlgsUUFBUXBVLEdBQVIsQ0FBbEI7O0FBRUEsVUFBRytVLG9CQUFvQnBjLEVBQUU0VCxVQUFGLENBQWF3SSxnQkFBZ0IxYixZQUE3QixLQUE4QyxDQUFDVixFQUFFMEosT0FBRixDQUFVMFMsZ0JBQWdCMWIsWUFBMUIsQ0FBbkUsQ0FBSDtBQ0VLLGVEREpnRyxLQUFLRixRQUFMLENBQWNsRyxJQUFkLENBQW1CO0FBQ2xCb0MsZ0JBQU0sVUFBQzJaLE1BQUQ7QUFDTCxnQkFBQUMsZUFBQSxFQUFBcFQsQ0FBQSxFQUFBdkYsY0FBQSxFQUFBNFksR0FBQSxFQUFBdEksS0FBQSxFQUFBdUksYUFBQSxFQUFBOWIsWUFBQSxFQUFBK2IsbUJBQUEsRUFBQUMsR0FBQTs7QUFBQTtBQUNDekgsbUJBQUtnSCxPQUFMO0FBRUFoSSxzQkFBUSxFQUFSOztBQUdBLGtCQUFHLG9CQUFvQnRTLElBQXBCLENBQXlCMEYsR0FBekIsQ0FBSDtBQUNDa1Ysc0JBQU1sVixJQUFJdUMsT0FBSixDQUFZLGtCQUFaLEVBQWdDLElBQWhDLENBQU47QUFDQThTLHNCQUFNclYsSUFBSXVDLE9BQUosQ0FBWSxrQkFBWixFQUFnQyxJQUFoQyxDQUFOO0FBQ0E0UyxnQ0FBZ0JILE9BQU9FLEdBQVAsRUFBWUksV0FBWixDQUF3QkQsR0FBeEIsQ0FBaEI7QUFIRDtBQUtDRixnQ0FBZ0JuVixJQUFJZ04sS0FBSixDQUFVLEdBQVYsRUFBZXVJLE1BQWYsQ0FBc0IsVUFBQ3ZLLENBQUQsRUFBSTdHLENBQUo7QUNBNUIseUJBQU82RyxLQUFLLElBQUwsR0RDZkEsRUFBRzdHLENBQUgsQ0NEZSxHRENaLE1DREs7QURBTSxtQkFFZDZRLE1BRmMsQ0FBaEI7QUNFTzs7QURFUjNiLDZCQUFlMGIsZ0JBQWdCMWIsWUFBL0I7O0FBRUEsa0JBQUdWLEVBQUU0VCxVQUFGLENBQWFsVCxZQUFiLENBQUg7QUFDQ0EsK0JBQWVBLGNBQWY7QUNETzs7QURHUixrQkFBR1YsRUFBRTBMLE9BQUYsQ0FBVWhMLFlBQVYsQ0FBSDtBQUNDLG9CQUFHVixFQUFFNmMsUUFBRixDQUFXTCxhQUFYLEtBQTZCLENBQUN4YyxFQUFFMEwsT0FBRixDQUFVOFEsYUFBVixDQUFqQztBQUNDOWIsaUNBQWU4YixjQUFjbkssQ0FBN0I7QUFDQW1LLGtDQUFnQkEsY0FBY2xLLEdBQWQsSUFBcUIsRUFBckM7QUFGRDtBQUlDLHlCQUFPLEVBQVA7QUFMRjtBQ0tROztBREVSLGtCQUFHdFMsRUFBRTBMLE9BQUYsQ0FBVThRLGFBQVYsQ0FBSDtBQUNDdkksc0JBQU12VixHQUFOLEdBQVk7QUFBQ2lXLHVCQUFLNkg7QUFBTixpQkFBWjtBQUREO0FBR0N2SSxzQkFBTXZWLEdBQU4sR0FBWThkLGFBQVo7QUNFTzs7QURBUkMsb0NBQXNCOWUsUUFBUUksU0FBUixDQUFrQjJDLFlBQWxCLEVBQWdDMEUsT0FBaEMsQ0FBdEI7QUFFQXpCLCtCQUFpQjhZLG9CQUFvQjdZLGNBQXJDO0FBRUEwWSxnQ0FBa0I7QUFBQzVkLHFCQUFLLENBQU47QUFBU2lULHVCQUFPO0FBQWhCLGVBQWxCOztBQUVBLGtCQUFHaE8sY0FBSDtBQUNDMlksZ0NBQWdCM1ksY0FBaEIsSUFBa0MsQ0FBbEM7QUNFTzs7QURBUixxQkFBT2hHLFFBQVE2RixhQUFSLENBQXNCOUMsWUFBdEIsRUFBb0MwRSxPQUFwQyxFQUE2QzFDLElBQTdDLENBQWtEdVIsS0FBbEQsRUFBeUQ7QUFDL0RwVSx3QkFBUXljO0FBRHVELGVBQXpELENBQVA7QUF6Q0QscUJBQUFyUyxLQUFBO0FBNENNZixrQkFBQWUsS0FBQTtBQUNMQyxzQkFBUUMsR0FBUixDQUFZekosWUFBWixFQUEwQjJiLE1BQTFCLEVBQWtDblQsQ0FBbEM7QUFDQSxxQkFBTyxFQUFQO0FDR007QURuRFU7QUFBQSxTQUFuQixDQ0NJO0FBcUREO0FEMURMOztBQXVEQSxXQUFPeEMsSUFBUDtBQW5GRDtBQXFGQyxXQUFPO0FBQ05oRSxZQUFNO0FBQ0x1UyxhQUFLZ0gsT0FBTDtBQUNBLGVBQU9QLGtCQUFrQmhaLElBQWxCLENBQXVCO0FBQUNoRSxlQUFLO0FBQUNpVyxpQkFBS3JDO0FBQU47QUFBTixTQUF2QixFQUEwQztBQUFDelMsa0JBQVFBO0FBQVQsU0FBMUMsQ0FBUDtBQUhLO0FBQUEsS0FBUDtBQ2lCQztBRGxJSCxHOzs7Ozs7Ozs7Ozs7QUVBQXRDLE9BQU8rZCxPQUFQLENBQWUsa0JBQWYsRUFBbUMsVUFBQ3pkLFdBQUQsRUFBY3VILE9BQWQ7QUFDL0IsTUFBQUMsTUFBQTtBQUFBQSxXQUFTLEtBQUtBLE1BQWQ7QUFDQSxTQUFPMUgsUUFBUTZGLGFBQVIsQ0FBc0Isa0JBQXRCLEVBQTBDZCxJQUExQyxDQUErQztBQUFDN0UsaUJBQWFBLFdBQWQ7QUFBMkI4VCxXQUFPdk0sT0FBbEM7QUFBMkMsV0FBTSxDQUFDO0FBQUN1SSxhQUFPdEk7QUFBUixLQUFELEVBQWtCO0FBQUN5WCxjQUFRO0FBQVQsS0FBbEI7QUFBakQsR0FBL0MsQ0FBUDtBQUZKLEc7Ozs7Ozs7Ozs7OztBQ0FBdmYsT0FBTytkLE9BQVAsQ0FBZSx1QkFBZixFQUF3QyxVQUFDemQsV0FBRDtBQUNwQyxNQUFBd0gsTUFBQTtBQUFBQSxXQUFTLEtBQUtBLE1BQWQ7QUFDQSxTQUFPMUgsUUFBUW9WLFdBQVIsQ0FBb0J2VixRQUFwQixDQUE2QmtGLElBQTdCLENBQWtDO0FBQUM3RSxpQkFBYTtBQUFDOFcsV0FBSzlXO0FBQU4sS0FBZDtBQUFrQ00sZUFBVztBQUFDd1csV0FBSyxDQUFDLGtCQUFELEVBQXFCLGtCQUFyQjtBQUFOLEtBQTdDO0FBQThGaEgsV0FBT3RJO0FBQXJHLEdBQWxDLENBQVA7QUFGSixHOzs7Ozs7Ozs7Ozs7QUNBQTlILE9BQU8rZCxPQUFQLENBQWUseUJBQWYsRUFBMEMsVUFBQ3pkLFdBQUQsRUFBY3dCLG1CQUFkLEVBQW1DQyxrQkFBbkMsRUFBdURuQixTQUF2RCxFQUFrRWlILE9BQWxFO0FBQ3pDLE1BQUFQLFdBQUEsRUFBQXlGLFFBQUEsRUFBQWpGLE1BQUE7QUFBQUEsV0FBUyxLQUFLQSxNQUFkOztBQUNBLE1BQUdoRyx3QkFBdUIsc0JBQTFCO0FBQ0NpTCxlQUFXO0FBQUMsd0JBQWtCbEY7QUFBbkIsS0FBWDtBQUREO0FBR0NrRixlQUFXO0FBQUNxSCxhQUFPdk07QUFBUixLQUFYO0FDTUM7O0FESkYsTUFBRy9GLHdCQUF1QixXQUExQjtBQUVDaUwsYUFBUyxVQUFULElBQXVCek0sV0FBdkI7QUFDQXlNLGFBQVMsWUFBVCxJQUF5QixDQUFDbk0sU0FBRCxDQUF6QjtBQUhEO0FBS0NtTSxhQUFTaEwsa0JBQVQsSUFBK0JuQixTQUEvQjtBQ0tDOztBREhGMEcsZ0JBQWNsSCxRQUFRdU8sY0FBUixDQUF1QjdNLG1CQUF2QixFQUE0QytGLE9BQTVDLEVBQXFEQyxNQUFyRCxDQUFkOztBQUNBLE1BQUcsQ0FBQ1IsWUFBWTJWLGNBQWIsSUFBZ0MzVixZQUFZQyxTQUEvQztBQUNDd0YsYUFBU3FELEtBQVQsR0FBaUJ0SSxNQUFqQjtBQ0tDOztBREhGLFNBQU8xSCxRQUFRNkYsYUFBUixDQUFzQm5FLG1CQUF0QixFQUEyQ3FELElBQTNDLENBQWdENEgsUUFBaEQsQ0FBUDtBQWxCRCxHOzs7Ozs7Ozs7Ozs7QUVBQS9NLE9BQU8rZCxPQUFQLENBQWUsaUJBQWYsRUFBa0MsVUFBQ2xXLE9BQUQsRUFBVUMsTUFBVjtBQUNqQyxTQUFPMUgsUUFBUTZGLGFBQVIsQ0FBc0IsYUFBdEIsRUFBcUNkLElBQXJDLENBQTBDO0FBQUNpUCxXQUFPdk0sT0FBUjtBQUFpQjJYLFVBQU0xWDtBQUF2QixHQUExQyxDQUFQO0FBREQsRzs7Ozs7Ozs7Ozs7O0FDQ0EsSUFBRzlILE9BQU9pVCxRQUFWO0FBRUNqVCxTQUFPK2QsT0FBUCxDQUFlLHNCQUFmLEVBQXVDLFVBQUNsVyxPQUFEO0FBRXRDLFFBQUFrRixRQUFBOztBQUFBLFNBQU8sS0FBS2pGLE1BQVo7QUFDQyxhQUFPLEtBQUt1VyxLQUFMLEVBQVA7QUNERTs7QURHSCxTQUFPeFcsT0FBUDtBQUNDLGFBQU8sS0FBS3dXLEtBQUwsRUFBUDtBQ0RFOztBREdIdFIsZUFDQztBQUFBcUgsYUFBT3ZNLE9BQVA7QUFDQWlDLFdBQUs7QUFETCxLQUREO0FBSUEsV0FBT3dULEdBQUdtQyxjQUFILENBQWtCdGEsSUFBbEIsQ0FBdUI0SCxRQUF2QixDQUFQO0FBWkQ7QUNZQSxDOzs7Ozs7Ozs7Ozs7QUNkRCxJQUFHL00sT0FBT2lULFFBQVY7QUFFQ2pULFNBQU8rZCxPQUFQLENBQWUsK0JBQWYsRUFBZ0QsVUFBQ2xXLE9BQUQ7QUFFL0MsUUFBQWtGLFFBQUE7O0FBQUEsU0FBTyxLQUFLakYsTUFBWjtBQUNDLGFBQU8sS0FBS3VXLEtBQUwsRUFBUDtBQ0RFOztBREdILFNBQU94VyxPQUFQO0FBQ0MsYUFBTyxLQUFLd1csS0FBTCxFQUFQO0FDREU7O0FER0h0UixlQUNDO0FBQUFxSCxhQUFPdk0sT0FBUDtBQUNBaUMsV0FBSztBQURMLEtBREQ7QUFJQSxXQUFPd1QsR0FBR21DLGNBQUgsQ0FBa0J0YSxJQUFsQixDQUF1QjRILFFBQXZCLENBQVA7QUFaRDtBQ1lBLEM7Ozs7Ozs7Ozs7OztBQ2ZELElBQUcvTSxPQUFPaVQsUUFBVjtBQUNDalQsU0FBTytkLE9BQVAsQ0FBZSx1QkFBZixFQUF3QztBQUN2QyxRQUFBalcsTUFBQTtBQUFBQSxhQUFTLEtBQUtBLE1BQWQ7QUFDQSxXQUFPd1YsR0FBR0ssV0FBSCxDQUFleFksSUFBZixDQUFvQjtBQUFDcWEsWUFBTTFYLE1BQVA7QUFBZThWLG9CQUFjO0FBQTdCLEtBQXBCLENBQVA7QUFGRDtBQ1FBLEM7Ozs7Ozs7Ozs7OztBQ1REOEIsbUNBQW1DLEVBQW5DOztBQUVBQSxpQ0FBaUNDLGtCQUFqQyxHQUFzRCxVQUFDQyxPQUFELEVBQVVDLE9BQVY7QUFFckQsTUFBQUMsSUFBQSxFQUFBQyxjQUFBLEVBQUFDLE9BQUEsRUFBQUMsYUFBQSxFQUFBQyxZQUFBLEVBQUFDLGNBQUEsRUFBQUMsZ0JBQUEsRUFBQXBNLFFBQUEsRUFBQXFNLGFBQUEsRUFBQUMsZUFBQSxFQUFBQyxpQkFBQTtBQUFBVCxTQUFPVSw2QkFBNkJDLE9BQTdCLENBQXFDYixPQUFyQyxDQUFQO0FBQ0E1TCxhQUFXOEwsS0FBSzFMLEtBQWhCO0FBRUE0TCxZQUFVLElBQUloVCxLQUFKLEVBQVY7QUFDQWlULGtCQUFnQjNDLEdBQUcyQyxhQUFILENBQWlCOWEsSUFBakIsQ0FBc0I7QUFDckNpUCxXQUFPSixRQUQ4QjtBQUNwQnVKLFdBQU9zQztBQURhLEdBQXRCLEVBQ29CO0FBQUV2ZCxZQUFRO0FBQUVvZSxlQUFTO0FBQVg7QUFBVixHQURwQixFQUNnRDNILEtBRGhELEVBQWhCOztBQUVBdFcsSUFBRWUsSUFBRixDQUFPeWMsYUFBUCxFQUFzQixVQUFDVSxHQUFEO0FBQ3JCWCxZQUFRamQsSUFBUixDQUFhNGQsSUFBSXhmLEdBQWpCOztBQUNBLFFBQUd3ZixJQUFJRCxPQUFQO0FDUUksYURQSGplLEVBQUVlLElBQUYsQ0FBT21kLElBQUlELE9BQVgsRUFBb0IsVUFBQ0UsU0FBRDtBQ1FmLGVEUEpaLFFBQVFqZCxJQUFSLENBQWE2ZCxTQUFiLENDT0k7QURSTCxRQ09HO0FBR0Q7QURiSjs7QUFPQVosWUFBVXZkLEVBQUU0SSxJQUFGLENBQU8yVSxPQUFQLENBQVY7QUFDQUQsbUJBQWlCLElBQUkvUyxLQUFKLEVBQWpCOztBQUNBLE1BQUc4UyxLQUFLZSxLQUFSO0FBSUMsUUFBR2YsS0FBS2UsS0FBTCxDQUFXUixhQUFkO0FBQ0NBLHNCQUFnQlAsS0FBS2UsS0FBTCxDQUFXUixhQUEzQjs7QUFDQSxVQUFHQSxjQUFjN1QsUUFBZCxDQUF1QnFULE9BQXZCLENBQUg7QUFDQ0UsdUJBQWVoZCxJQUFmLENBQW9CLEtBQXBCO0FBSEY7QUNVRzs7QURMSCxRQUFHK2MsS0FBS2UsS0FBTCxDQUFXWCxZQUFkO0FBQ0NBLHFCQUFlSixLQUFLZSxLQUFMLENBQVdYLFlBQTFCOztBQUNBemQsUUFBRWUsSUFBRixDQUFPd2MsT0FBUCxFQUFnQixVQUFDYyxNQUFEO0FBQ2YsWUFBR1osYUFBYTFULFFBQWIsQ0FBc0JzVSxNQUF0QixDQUFIO0FDT00saUJETkxmLGVBQWVoZCxJQUFmLENBQW9CLEtBQXBCLENDTUs7QUFDRDtBRFROO0FDV0U7O0FESkgsUUFBRytjLEtBQUtlLEtBQUwsQ0FBV04saUJBQWQ7QUFDQ0EsMEJBQW9CVCxLQUFLZSxLQUFMLENBQVdOLGlCQUEvQjs7QUFDQSxVQUFHQSxrQkFBa0IvVCxRQUFsQixDQUEyQnFULE9BQTNCLENBQUg7QUFDQ0UsdUJBQWVoZCxJQUFmLENBQW9CLFNBQXBCO0FBSEY7QUNVRzs7QURMSCxRQUFHK2MsS0FBS2UsS0FBTCxDQUFXVCxnQkFBZDtBQUNDQSx5QkFBbUJOLEtBQUtlLEtBQUwsQ0FBV1QsZ0JBQTlCOztBQUNBM2QsUUFBRWUsSUFBRixDQUFPd2MsT0FBUCxFQUFnQixVQUFDYyxNQUFEO0FBQ2YsWUFBR1YsaUJBQWlCNVQsUUFBakIsQ0FBMEJzVSxNQUExQixDQUFIO0FDT00saUJETkxmLGVBQWVoZCxJQUFmLENBQW9CLFNBQXBCLENDTUs7QUFDRDtBRFROO0FDV0U7O0FESkgsUUFBRytjLEtBQUtlLEtBQUwsQ0FBV1AsZUFBZDtBQUNDQSx3QkFBa0JSLEtBQUtlLEtBQUwsQ0FBV1AsZUFBN0I7O0FBQ0EsVUFBR0EsZ0JBQWdCOVQsUUFBaEIsQ0FBeUJxVCxPQUF6QixDQUFIO0FBQ0NFLHVCQUFlaGQsSUFBZixDQUFvQixPQUFwQjtBQUhGO0FDVUc7O0FETEgsUUFBRytjLEtBQUtlLEtBQUwsQ0FBV1YsY0FBZDtBQUNDQSx1QkFBaUJMLEtBQUtlLEtBQUwsQ0FBV1YsY0FBNUI7O0FBQ0ExZCxRQUFFZSxJQUFGLENBQU93YyxPQUFQLEVBQWdCLFVBQUNjLE1BQUQ7QUFDZixZQUFHWCxlQUFlM1QsUUFBZixDQUF3QnNVLE1BQXhCLENBQUg7QUNPTSxpQkROTGYsZUFBZWhkLElBQWYsQ0FBb0IsT0FBcEIsQ0NNSztBQUNEO0FEVE47QUF2Q0Y7QUNtREU7O0FEUEZnZCxtQkFBaUJ0ZCxFQUFFNEksSUFBRixDQUFPMFUsY0FBUCxDQUFqQjtBQUNBLFNBQU9BLGNBQVA7QUE5RHFELENBQXRELEM7Ozs7Ozs7Ozs7OztBRURBLElBQUFnQixLQUFBLEVBQUFDLG9CQUFBLEVBQUFDLGtCQUFBLEVBQUFDLGlCQUFBLEVBQUFDLFlBQUEsRUFBQUMsaUJBQUEsRUFBQUMscUJBQUEsRUFBQUMsb0JBQUEsRUFBQUMscUJBQUEsRUFBQUMsZUFBQSxFQUFBQyxxQkFBQSxFQUFBQyx5QkFBQSxFQUFBQyxXQUFBLEVBQUFDLGlCQUFBLEVBQUFDLGtCQUFBLEVBQUFDLGtCQUFBLEVBQUFDLG1CQUFBLEVBQUFDLFVBQUEsRUFBQUMsYUFBQSxFQUFBQyxZQUFBLEVBQUFDLFFBQUE7O0FBQUFwQixRQUFRL0csUUFBUSxNQUFSLENBQVI7QUFDQW1JLFdBQVduSSxRQUFRLG1CQUFSLENBQVg7O0FBRUF3SCxrQkFBa0IsVUFBQ1ksYUFBRDtBQUNqQixTQUFPRCxTQUFTM2hCLFNBQVQsQ0FBbUI0aEIsYUFBbkIsRUFBa0NDLFFBQWxDLEVBQVA7QUFEaUIsQ0FBbEI7O0FBR0FaLHdCQUF3QixVQUFDVyxhQUFEO0FBQ3ZCLFNBQU9ELFNBQVMzaEIsU0FBVCxDQUFtQjRoQixhQUFuQixFQUFrQy9iLGNBQXpDO0FBRHVCLENBQXhCOztBQUdBc2IsY0FBYyxVQUFDUyxhQUFEO0FBQ2IsU0FBT3BpQixPQUFPc1csU0FBUCxDQUFpQixVQUFDOEwsYUFBRCxFQUFnQkUsRUFBaEI7QUNLckIsV0RKRkgsU0FBUzNoQixTQUFULENBQW1CNGhCLGFBQW5CLEVBQWtDVCxXQUFsQyxHQUFnRFksSUFBaEQsQ0FBcUQsVUFBQ0MsT0FBRCxFQUFVQyxNQUFWO0FDS2pELGFESkhILEdBQUdHLE1BQUgsRUFBV0QsT0FBWCxDQ0lHO0FETEosTUNJRTtBRExJLEtBR0pKLGFBSEksQ0FBUDtBQURhLENBQWQ7O0FBTUFILGdCQUFnQixVQUFDRyxhQUFELEVBQWdCMUwsS0FBaEI7QUFDZixTQUFPMVcsT0FBT3NXLFNBQVAsQ0FBaUIsVUFBQzhMLGFBQUQsRUFBZ0IxTCxLQUFoQixFQUF1QjRMLEVBQXZCO0FBQ3ZCNUwsVUFBTWdNLEdBQU4sR0FBWSxDQUFaO0FDT0UsV0RORlAsU0FBUzNoQixTQUFULENBQW1CNGhCLGFBQW5CLEVBQWtDamQsSUFBbEMsQ0FBdUN1UixLQUF2QyxFQUE4QzZMLElBQTlDLENBQW1ELFVBQUNDLE9BQUQsRUFBVUMsTUFBVjtBQUNsRCxVQUFJRCxXQUFXQSxRQUFROWQsTUFBUixHQUFpQixDQUFoQztBQ09LLGVETko0ZCxHQUFHRyxNQUFILEVBQVdELFFBQVEsQ0FBUixDQUFYLENDTUk7QURQTDtBQ1NLLGVETkpGLEdBQUdHLE1BQUgsRUFBVyxJQUFYLENDTUk7QUFDRDtBRFhMLE1DTUU7QURSSSxLQU9KTCxhQVBJLEVBT1cxTCxLQVBYLENBQVA7QUFEZSxDQUFoQjs7QUFVQXNMLGFBQWEsVUFBQ0ksYUFBRCxFQUFnQjFMLEtBQWhCO0FBQ1osU0FBTzFXLE9BQU9zVyxTQUFQLENBQWlCLFVBQUM4TCxhQUFELEVBQWdCMUwsS0FBaEIsRUFBdUI0TCxFQUF2QjtBQ1VyQixXRFRGSCxTQUFTM2hCLFNBQVQsQ0FBbUI0aEIsYUFBbkIsRUFBa0NqZCxJQUFsQyxDQUF1Q3VSLEtBQXZDLEVBQThDNkwsSUFBOUMsQ0FBbUQsVUFBQ0MsT0FBRCxFQUFVQyxNQUFWO0FDVS9DLGFEVEhILEdBQUdHLE1BQUgsRUFBV0QsT0FBWCxDQ1NHO0FEVkosTUNTRTtBRFZJLEtBR0pKLGFBSEksRUFHVzFMLEtBSFgsQ0FBUDtBQURZLENBQWI7O0FBTUF3TCxlQUFlLFVBQUNFLGFBQUQsRUFBZ0IxYixFQUFoQixFQUFvQnlDLElBQXBCO0FBQ2QsU0FBT25KLE9BQU9zVyxTQUFQLENBQWlCLFVBQUM4TCxhQUFELEVBQWdCMWIsRUFBaEIsRUFBb0J5QyxJQUFwQixFQUEwQm1aLEVBQTFCO0FDWXJCLFdEWEZILFNBQVMzaEIsU0FBVCxDQUFtQjRoQixhQUFuQixFQUFrQy9OLE1BQWxDLENBQXlDM04sRUFBekMsRUFBNkN5QyxJQUE3QyxFQUFtRG9aLElBQW5ELENBQXdELFVBQUNDLE9BQUQsRUFBVUMsTUFBVjtBQ1lwRCxhRFhISCxHQUFHRyxNQUFILEVBQVdELE9BQVgsQ0NXRztBRFpKLE1DV0U7QURaSSxLQUdKSixhQUhJLEVBR1cxYixFQUhYLEVBR2V5QyxJQUhmLENBQVA7QUFEYyxDQUFmOztBQU1BdVksNEJBQTZCLFVBQUNpQixrQkFBRCxFQUFxQjdZLEdBQXJCO0FBQzVCLFNBQU9ySCxFQUFFMEMsSUFBRixDQUFPd2Qsa0JBQVAsRUFBNEIsVUFBQ0MsaUJBQUQ7QUFDbEMsV0FBTzlZLElBQUkrWSxVQUFKLENBQWVELG9CQUFvQixHQUFuQyxDQUFQO0FBRE0sSUFBUDtBQUQ0QixDQUE3Qjs7QUFJQXZCLHdCQUF3QixVQUFDeUIsbUJBQUQsRUFBc0JoWixHQUF0QjtBQUN2QixTQUFPckgsRUFBRTBDLElBQUYsQ0FBTzJkLG1CQUFQLEVBQTZCLFVBQUNDLGtCQUFEO0FBQ25DLFdBQU9qWixJQUFJK1ksVUFBSixDQUFlRSxxQkFBcUIsR0FBcEMsQ0FBUDtBQURNLElBQVA7QUFEdUIsQ0FBeEI7O0FBSUEzQixvQkFBb0IsVUFBQzRCLGVBQUQsRUFBa0JsWixHQUFsQjtBQUNuQixTQUFPckgsRUFBRTBDLElBQUYsQ0FBTzZkLGVBQVAsRUFBeUIsVUFBQ3JnQixDQUFEO0FBQy9CLFdBQU9BLEVBQUVzZ0IsSUFBRixLQUFVblosR0FBakI7QUFETSxJQUFQO0FBRG1CLENBQXBCOztBQUlBcVgsZUFBZSxVQUFDK0IsVUFBRCxFQUFhcFosR0FBYjtBQUNkLE1BQUFxWixFQUFBO0FBQUFBLE9BQUssSUFBTDs7QUFDQTFnQixJQUFFQyxPQUFGLENBQVV3Z0IsVUFBVixFQUFzQixVQUFDdmdCLENBQUQ7QUFDckIsUUFBR3dnQixFQUFIO0FBQ0M7QUNxQkU7O0FEcEJILFFBQUd4Z0IsRUFBRUcsSUFBRixLQUFVLFNBQWI7QUNzQkksYURyQkhxZ0IsS0FBSzFnQixFQUFFMEMsSUFBRixDQUFPeEMsRUFBRUwsTUFBVCxFQUFrQixVQUFDOGdCLEVBQUQ7QUFDdEIsZUFBT0EsR0FBR0gsSUFBSCxLQUFXblosR0FBbEI7QUFESSxRQ3FCRjtBRHRCSixXQUdLLElBQUduSCxFQUFFc2dCLElBQUYsS0FBVW5aLEdBQWI7QUN1QkQsYUR0QkhxWixLQUFLeGdCLENDc0JGO0FBQ0Q7QUQ5Qko7O0FBU0EsU0FBT3dnQixFQUFQO0FBWGMsQ0FBZjs7QUFhQTdCLHVCQUF1QixVQUFDK0IsVUFBRCxFQUFhQyxZQUFiO0FBQ3RCLFNBQU83Z0IsRUFBRTBDLElBQUYsQ0FBT2tlLFdBQVcvZ0IsTUFBbEIsRUFBMkIsVUFBQ0ssQ0FBRDtBQUNqQyxXQUFPQSxFQUFFc2dCLElBQUYsS0FBVUssWUFBakI7QUFETSxJQUFQO0FBRHNCLENBQXZCOztBQUlBckMscUJBQXFCLFVBQUM5RyxPQUFELEVBQVV6VCxFQUFWLEVBQWM2YyxvQkFBZDtBQUVwQixNQUFBQyxPQUFBLEVBQUFsTyxRQUFBLEVBQUFtTyxPQUFBLEVBQUFqZSxHQUFBOztBQUFBQSxRQUFNMmMsU0FBUzNoQixTQUFULENBQW1CMlosT0FBbkIsQ0FBTjtBQUNBc0osWUFBVWhDLHNCQUFzQnRILE9BQXRCLENBQVY7O0FBQ0EsTUFBRyxDQUFDM1UsR0FBSjtBQUNDO0FDMkJDOztBRDFCRixNQUFHL0MsRUFBRVcsUUFBRixDQUFXc0QsRUFBWCxDQUFIO0FBRUM4YyxjQUFVdkIsY0FBYzlILE9BQWQsRUFBdUI7QUFBRTNWLGVBQVMsQ0FBQyxDQUFDK2Usb0JBQUQsRUFBdUIsR0FBdkIsRUFBNEI3YyxFQUE1QixDQUFEO0FBQVgsS0FBdkIsQ0FBVjs7QUFDQSxRQUFHOGMsT0FBSDtBQUNDQSxjQUFRLFFBQVIsSUFBb0JBLFFBQVFDLE9BQVIsQ0FBcEI7QUFDQSxhQUFPRCxPQUFQO0FBTEY7QUFBQSxTQU1LLElBQUcvZ0IsRUFBRTBMLE9BQUYsQ0FBVXpILEVBQVYsQ0FBSDtBQUNKNE8sZUFBVyxFQUFYO0FBRUEwTSxlQUFXN0gsT0FBWCxFQUFvQjtBQUFFM1YsZUFBUyxDQUFDLENBQUMrZSxvQkFBRCxFQUF1QixJQUF2QixFQUE2QjdjLEVBQTdCLENBQUQ7QUFBWCxLQUFwQixFQUFvRWhFLE9BQXBFLENBQTRFLFVBQUM4Z0IsT0FBRDtBQUMzRUEsY0FBUSxRQUFSLElBQW9CQSxRQUFRQyxPQUFSLENBQXBCO0FDK0JHLGFEOUJIbk8sU0FBU3ZTLElBQVQsQ0FBY3lnQixPQUFkLENDOEJHO0FEaENKOztBQUdBLFFBQUcsQ0FBQy9nQixFQUFFMEosT0FBRixDQUFVbUosUUFBVixDQUFKO0FBQ0MsYUFBT0EsUUFBUDtBQVBHO0FDd0NIO0FEcERrQixDQUFyQjs7QUFzQkF3TSxxQkFBcUIsVUFBQ2hhLE1BQUQsRUFBU0QsT0FBVDtBQUNwQixNQUFBNmIsRUFBQTtBQUFBQSxPQUFLdGpCLFFBQVE2RixhQUFSLENBQXNCLGFBQXRCLEVBQXFDQyxPQUFyQyxDQUE2QztBQUFFa08sV0FBT3ZNLE9BQVQ7QUFBa0IyWCxVQUFNMVg7QUFBeEIsR0FBN0MsQ0FBTDtBQUNBNGIsS0FBR2hkLEVBQUgsR0FBUW9CLE1BQVI7QUFDQSxTQUFPNGIsRUFBUDtBQUhvQixDQUFyQjs7QUFLQTNCLHNCQUFzQixVQUFDNEIsT0FBRCxFQUFVOWIsT0FBVjtBQUNyQixNQUFBK2IsR0FBQTtBQUFBQSxRQUFNLEVBQU47O0FBQ0EsTUFBR25oQixFQUFFMEwsT0FBRixDQUFVd1YsT0FBVixDQUFIO0FBQ0NsaEIsTUFBRWUsSUFBRixDQUFPbWdCLE9BQVAsRUFBZ0IsVUFBQzdiLE1BQUQ7QUFDZixVQUFBNGIsRUFBQTtBQUFBQSxXQUFLNUIsbUJBQW1CaGEsTUFBbkIsRUFBMkJELE9BQTNCLENBQUw7O0FBQ0EsVUFBRzZiLEVBQUg7QUN5Q0ssZUR4Q0pFLElBQUk3Z0IsSUFBSixDQUFTMmdCLEVBQVQsQ0N3Q0k7QUFDRDtBRDVDTDtBQzhDQzs7QUQxQ0YsU0FBT0UsR0FBUDtBQVBxQixDQUF0Qjs7QUFTQWhDLG9CQUFvQixVQUFDaUMsS0FBRCxFQUFRaGMsT0FBUjtBQUNuQixNQUFBOFksR0FBQTtBQUFBQSxRQUFNdmdCLFFBQVE2RixhQUFSLENBQXNCLGVBQXRCLEVBQXVDQyxPQUF2QyxDQUErQzJkLEtBQS9DLEVBQXNEO0FBQUV2aEIsWUFBUTtBQUFFbkIsV0FBSyxDQUFQO0FBQVU0QyxZQUFNLENBQWhCO0FBQW1CK2YsZ0JBQVU7QUFBN0I7QUFBVixHQUF0RCxDQUFOO0FBQ0FuRCxNQUFJamEsRUFBSixHQUFTbWQsS0FBVDtBQUNBLFNBQU9sRCxHQUFQO0FBSG1CLENBQXBCOztBQUtBa0IscUJBQXFCLFVBQUNrQyxNQUFELEVBQVNsYyxPQUFUO0FBQ3BCLE1BQUFtYyxJQUFBO0FBQUFBLFNBQU8sRUFBUDs7QUFDQSxNQUFHdmhCLEVBQUUwTCxPQUFGLENBQVU0VixNQUFWLENBQUg7QUFDQ3RoQixNQUFFZSxJQUFGLENBQU91Z0IsTUFBUCxFQUFlLFVBQUNGLEtBQUQ7QUFDZCxVQUFBbEQsR0FBQTtBQUFBQSxZQUFNaUIsa0JBQWtCaUMsS0FBbEIsRUFBeUJoYyxPQUF6QixDQUFOOztBQUNBLFVBQUc4WSxHQUFIO0FDdURLLGVEdERKcUQsS0FBS2poQixJQUFMLENBQVU0ZCxHQUFWLENDc0RJO0FBQ0Q7QUQxREw7QUM0REM7O0FEeERGLFNBQU9xRCxJQUFQO0FBUG9CLENBQXJCOztBQVNBOUMsb0JBQW9CLFVBQUMrQyxhQUFELEVBQWdCQyxLQUFoQjtBQUNuQixNQUFBM2UsVUFBQSxFQUFBNGUsS0FBQSxFQUFBek4sS0FBQSxFQUFBelQsS0FBQTs7QUFBQSxNQUFHUixFQUFFMEosT0FBRixDQUFVOFgsYUFBVixDQUFIO0FBQ0M7QUM0REM7O0FEM0RGLE1BQUdDLFVBQVMsT0FBWjtBQUNDM2UsaUJBQWEsUUFBYjtBQURELFNBRUssSUFBRzJlLFVBQVMsTUFBWjtBQUNKM2UsaUJBQWEsT0FBYjtBQzZEQzs7QUQ1REYsTUFBRzlDLEVBQUVXLFFBQUYsQ0FBVzZnQixhQUFYLENBQUg7QUFDQ3ZOLFlBQVE7QUFBQ3ZWLFdBQUs7QUFBQ2lXLGFBQUssQ0FBQzZNLGFBQUQ7QUFBTjtBQUFOLEtBQVI7QUFERDtBQUdDdk4sWUFBUTtBQUFDdlYsV0FBSztBQUFDaVcsYUFBSzZNO0FBQU47QUFBTixLQUFSO0FDc0VDOztBRHJFRkUsVUFBUS9qQixRQUFRb1YsV0FBUixDQUFvQixTQUFPalEsVUFBUCxHQUFrQixhQUF0QyxFQUFvREosSUFBcEQsQ0FBeUR1UixLQUF6RCxDQUFSO0FBQ0F6VCxVQUFRLEVBQVI7QUFDQWtoQixRQUFNemhCLE9BQU4sQ0FBYyxVQUFDQyxDQUFEO0FBQ2IsUUFBQXloQixPQUFBO0FBQUFBLGNBQVUsSUFBSUMsR0FBR0MsSUFBUCxFQUFWO0FDd0VFLFdEdkVGRixRQUFRRyxVQUFSLENBQW1CNWhCLEVBQUU2aEIsZ0JBQUYsQ0FBbUIsT0FBbkIsQ0FBbkIsRUFBZ0Q7QUFDOUMxaEIsWUFBTUgsRUFBRThoQixRQUFGLENBQVczaEI7QUFENkIsS0FBaEQsRUFFRyxVQUFDcVQsR0FBRDtBQUNGLFVBQUF1TyxRQUFBOztBQUFBLFVBQUl2TyxHQUFKO0FBQ0MsY0FBTSxJQUFJblcsT0FBT29XLEtBQVgsQ0FBaUJELElBQUl6SixLQUFyQixFQUE0QnlKLElBQUl3TyxNQUFoQyxDQUFOO0FDeUVHOztBRHZFSlAsY0FBUXJnQixJQUFSLENBQWFwQixFQUFFb0IsSUFBRixFQUFiO0FBQ0FxZ0IsY0FBUVEsSUFBUixDQUFhamlCLEVBQUVpaUIsSUFBRixFQUFiO0FBQ0FGLGlCQUFXO0FBQ1Z0VSxlQUFPek4sRUFBRStoQixRQUFGLENBQVd0VTtBQURSLE9BQVg7QUFHQWdVLGNBQVFNLFFBQVIsR0FBbUJBLFFBQW5CO0FBQ0FOLGNBQVFqakIsR0FBUixHQUFjZixRQUFRb1YsV0FBUixDQUFvQnFQLFNBQXBCLENBQThCaFEsVUFBOUIsRUFBZDtBQUNBM1UsVUFBSXFGLFVBQUosRUFBZ0JxUCxNQUFoQixDQUF1QndQLE9BQXZCO0FDeUVHLGFEeEVIbmhCLE1BQU1GLElBQU4sQ0FBV3FoQixRQUFRampCLEdBQW5CLENDd0VHO0FEdEZKLE1DdUVFO0FEekVIOztBQWlCQSxNQUFHOEIsTUFBTXlCLE1BQU4sR0FBZSxDQUFsQjtBQUNDLFFBQUdqQyxFQUFFVyxRQUFGLENBQVc2Z0IsYUFBWCxDQUFIO0FBQ0MsYUFBT2hoQixNQUFNLENBQU4sQ0FBUDtBQUREO0FBR0MsYUFBT0EsS0FBUDtBQUpGO0FDZ0ZFO0FEOUdpQixDQUFwQjs7QUFvQ0FzZSx3QkFBd0IsVUFBQ3VELFFBQUQsRUFBV0MsU0FBWCxFQUFzQnRmLE1BQXRCLEVBQThCdWYsWUFBOUIsRUFBNENuZCxPQUE1QyxFQUFxRG9kLGdCQUFyRDtBQUV2QixNQUFBQyxlQUFBLEVBQUEzQixvQkFBQSxFQUFBNEIscUJBQUEsRUFBQUMsZ0JBQUEsRUFBQW5pQixLQUFBOztBQUFBLE1BQUc4aEIsVUFBVU0sYUFBYjtBQUNDLFdBQU9KLGdCQUFQO0FDOEVDOztBRDVFRkEscUJBQW1CeGYsT0FBT3FmLFNBQVMvZ0IsSUFBaEIsQ0FBbkI7QUFDQWQ7O0FBRUEsTUFBRzhoQixhQUFhRCxRQUFiLElBQXlCQyxVQUFVamlCLElBQVYsS0FBa0IsT0FBM0MsSUFBc0QsQ0FBQyxRQUFELEVBQVcsZUFBWCxFQUE0QjBKLFFBQTVCLENBQXFDc1ksU0FBU2hpQixJQUE5QyxDQUF0RCxJQUE2R0wsRUFBRVcsUUFBRixDQUFXMGhCLFNBQVMzaEIsWUFBcEIsQ0FBaEg7QUFDQ29nQiwyQkFBdUJ1QixTQUFTUSxrQkFBVCxJQUErQixLQUF0RDtBQUNBSCw0QkFBd0JMLFNBQVMzaEIsWUFBakM7QUFDQStoQjs7QUFDQSxRQUFHSixTQUFTUyxRQUFULElBQXFCUixVQUFVUyxjQUFsQztBQUNDTix3QkFBa0JqRSxtQkFBbUJrRSxxQkFBbkIsRUFBMENGLGdCQUExQyxFQUE0RDFCLG9CQUE1RCxDQUFsQjtBQURELFdBRUssSUFBRyxDQUFDdUIsU0FBU1MsUUFBVixJQUFzQixDQUFDUixVQUFVUyxjQUFwQztBQUNKTix3QkFBa0JqRSxtQkFBbUJrRSxxQkFBbkIsRUFBMENGLGdCQUExQyxFQUE0RDFCLG9CQUE1RCxDQUFsQjtBQzZFRTs7QUQ1RUh0Z0IsWUFBUWlpQixlQUFSO0FBUkQsU0FTSyxJQUFHSCxhQUFhRCxRQUFiLElBQXlCLENBQUMsTUFBRCxFQUFTLE9BQVQsRUFBa0J0WSxRQUFsQixDQUEyQnVZLFVBQVVqaUIsSUFBckMsQ0FBekIsSUFBdUUsQ0FBQyxRQUFELEVBQVcsZUFBWCxFQUE0QjBKLFFBQTVCLENBQXFDc1ksU0FBU2hpQixJQUE5QyxDQUF2RSxLQUErSCxDQUFDLE9BQUQsRUFBVSxlQUFWLEVBQTJCMEosUUFBM0IsQ0FBb0NzWSxTQUFTM2hCLFlBQTdDLEtBQStELGtCQUFpQjJoQixTQUFTM2hCLFlBQTFCLElBQTBDLFdBQVUyaEIsU0FBU1Esa0JBQTNQLENBQUg7QUFDSixRQUFHLENBQUM3aUIsRUFBRTBKLE9BQUYsQ0FBVThZLGdCQUFWLENBQUo7QUFDQ0c7O0FBQ0EsVUFBR0wsVUFBVWppQixJQUFWLEtBQWtCLE1BQXJCO0FBQ0MsWUFBR2dpQixTQUFTUyxRQUFULElBQXFCUixVQUFVUyxjQUFsQztBQUNDSiw2QkFBbUJyRCxvQkFBb0JrRCxnQkFBcEIsRUFBc0NwZCxPQUF0QyxDQUFuQjtBQURELGVBRUssSUFBRyxDQUFDaWQsU0FBU1MsUUFBVixJQUFzQixDQUFDUixVQUFVUyxjQUFwQztBQUNKSiw2QkFBbUJ0RCxtQkFBbUJtRCxnQkFBbkIsRUFBcUNwZCxPQUFyQyxDQUFuQjtBQUpGO0FBQUEsYUFLSyxJQUFHa2QsVUFBVWppQixJQUFWLEtBQWtCLE9BQXJCO0FBQ0osWUFBR2dpQixTQUFTUyxRQUFULElBQXFCUixVQUFVUyxjQUFsQztBQUNDSiw2QkFBbUJ2RCxtQkFBbUJvRCxnQkFBbkIsRUFBcUNwZCxPQUFyQyxDQUFuQjtBQURELGVBRUssSUFBRyxDQUFDaWQsU0FBU1MsUUFBVixJQUFzQixDQUFDUixVQUFVUyxjQUFwQztBQUNKSiw2QkFBbUJ4RCxrQkFBa0JxRCxnQkFBbEIsRUFBb0NwZCxPQUFwQyxDQUFuQjtBQUpHO0FDb0ZEOztBRC9FSixVQUFHdWQsZ0JBQUg7QUFDQ25pQixnQkFBUW1pQixnQkFBUjtBQWJGO0FBREk7QUFBQSxTQWVBLElBQUdMLGFBQWFELFFBQWIsSUFBeUJDLFVBQVVqaUIsSUFBVixLQUFrQixNQUEzQyxJQUFxRG1pQixnQkFBeEQ7QUFDSmhpQixZQUFRdWQsNkJBQTZCaUYsVUFBN0IsQ0FBd0NSLGdCQUF4QyxDQUFSO0FBREksU0FFQSxJQUFHRixhQUFhRCxRQUFiLElBQXlCRyxnQkFBekIsS0FBOENGLFVBQVVqaUIsSUFBVixLQUFrQixPQUFsQixJQUE2QmlpQixVQUFVamlCLElBQVYsS0FBa0IsTUFBN0YsQ0FBSDtBQUNKRyxZQUFRaWUsa0JBQWtCK0QsZ0JBQWxCLEVBQW9DRixVQUFVamlCLElBQTlDLENBQVI7QUFESSxTQUVBLElBQUdpaUIsYUFBYUQsUUFBYixJQUF5QkcsZ0JBQXpCLElBQTZDRixVQUFVamlCLElBQVYsS0FBa0IsUUFBL0QsSUFBMkUsQ0FBQyxRQUFELEVBQVcsZUFBWCxFQUE0QjBKLFFBQTVCLENBQXFDc1ksU0FBU2hpQixJQUE5QyxDQUEzRSxJQUFrSUwsRUFBRVcsUUFBRixDQUFXMGhCLFNBQVMzaEIsWUFBcEIsQ0FBckk7QUFDSkYsWUFBUWdpQixnQkFBUjtBQURJLFNBRUEsSUFBR0YsYUFBYUQsUUFBYixJQUF5QkcsZ0JBQXpCLElBQThDRixVQUFVamlCLElBQVYsS0FBa0IsYUFBbkU7QUFDSkcsWUFBUWdpQixpQkFBaUJyUixJQUFqQixDQUFzQixHQUF0QixDQUFSO0FBREksU0FFQSxJQUFHbk8sT0FBT2lnQixjQUFQLENBQXNCVixZQUF0QixDQUFIO0FBQ0ovaEIsWUFBUWdpQixnQkFBUjtBQ21GQzs7QURqRkYsU0FBT2hpQixLQUFQO0FBM0N1QixDQUF4Qjs7QUE4Q0ErZCx1QkFBdUIsVUFBQzJFLGVBQUQsRUFBa0JDLFlBQWxCO0FBQ3RCLE1BQUcsQ0FBQ25qQixFQUFFMEosT0FBRixDQUFVd1osZUFBVixDQUFKO0FBRUNBLG9CQUFnQmpqQixPQUFoQixDQUF3QixVQUFDbWpCLEVBQUQ7QUFDdkIsVUFBQUMsV0FBQSxFQUFBQyxnQkFBQSxFQUFBQyxLQUFBLEVBQUFDLFlBQUEsRUFBQUMsbUJBQUEsRUFBQUMsWUFBQSxFQUFBQyxjQUFBO0FBQUFELHFCQUFlTixHQUFHL08sS0FBSCxDQUFTLEdBQVQsRUFBYyxDQUFkLENBQWY7QUFDQW9QLDRCQUFzQkwsR0FBRy9PLEtBQUgsQ0FBUyxHQUFULEVBQWMsQ0FBZCxDQUF0QjtBQUNBbVAscUJBQWV6RSxnQkFBZ0IyRSxZQUFoQixDQUFmO0FBQ0FMLG9CQUFjRyxhQUFhM2pCLE1BQWIsQ0FBb0I0akIsbUJBQXBCLENBQWQ7QUFDQUYsY0FBUUYsWUFBWVIsa0JBQVosSUFBa0MsS0FBMUM7QUFDQVMseUJBQW1CSCxhQUFhSSxLQUFiLENBQW5CO0FBRUFJLHVCQUFpQm5FLGNBQWNrRSxZQUFkLEVBQTRCO0FBQUUzaEIsaUJBQVMsQ0FBQyxDQUFDMGhCLG1CQUFELEVBQXNCLEdBQXRCLEVBQTJCSCxnQkFBM0IsQ0FBRCxDQUFYO0FBQTJEempCLGdCQUFRLENBQUM0akIsbUJBQUQ7QUFBbkUsT0FBNUIsQ0FBakI7O0FBQ0EsVUFBRyxDQUFDRSxjQUFKO0FBQ0MsY0FBTSxJQUFJaFEsS0FBSixDQUFVLFNBQU82UCxhQUFhampCLEtBQTlCLENBQU47QUNxRkc7QUQvRkw7QUNpR0M7QURwR29CLENBQXZCOztBQWdCQXdkLCtCQUErQixFQUEvQjs7QUFFQUEsNkJBQTZCNkYsbUJBQTdCLEdBQW1ELFVBQUNDLEdBQUQ7QUFDbEQsTUFBQUMsU0FBQSxFQUFBQyxXQUFBLEVBQUE5UCxLQUFBLEVBQUE4SSxJQUFBLEVBQUExWCxNQUFBO0FBQUE0TyxVQUFRNFAsSUFBSTVQLEtBQVo7QUFDQTVPLFdBQVM0TyxNQUFNLFdBQU4sQ0FBVDtBQUNBNlAsY0FBWTdQLE1BQU0sY0FBTixDQUFaOztBQUVBLE1BQUcsQ0FBSTVPLE1BQUosSUFBYyxDQUFJeWUsU0FBckI7QUFDQyxVQUFNLElBQUl2bUIsT0FBT29XLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsY0FBdEIsQ0FBTjtBQ3dGQzs7QUR0RkZvUSxnQkFBY3hlLFNBQVN5ZSxlQUFULENBQXlCRixTQUF6QixDQUFkO0FBQ0EvRyxTQUFPeGYsT0FBT3VkLEtBQVAsQ0FBYXJYLE9BQWIsQ0FDTjtBQUFBL0UsU0FBSzJHLE1BQUw7QUFDQSwrQ0FBMkMwZTtBQUQzQyxHQURNLENBQVA7O0FBSUEsTUFBRyxDQUFJaEgsSUFBUDtBQUNDLFVBQU0sSUFBSXhmLE9BQU9vVyxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGNBQXRCLENBQU47QUN3RkM7O0FEdEZGLFNBQU9vSixJQUFQO0FBaEJrRCxDQUFuRDs7QUFrQkFnQiw2QkFBNkJrRyxRQUE3QixHQUF3QyxVQUFDMVMsUUFBRDtBQUN2QyxNQUFBSSxLQUFBO0FBQUFBLFVBQVFoVSxRQUFRb1YsV0FBUixDQUFvQmdJLE1BQXBCLENBQTJCdFgsT0FBM0IsQ0FBbUM4TixRQUFuQyxDQUFSOztBQUNBLE1BQUcsQ0FBSUksS0FBUDtBQUNDLFVBQU0sSUFBSXBVLE9BQU9vVyxLQUFYLENBQWlCLFFBQWpCLEVBQTJCLHdCQUEzQixDQUFOO0FDMEZDOztBRHpGRixTQUFPaEMsS0FBUDtBQUp1QyxDQUF4Qzs7QUFNQW9NLDZCQUE2QkMsT0FBN0IsR0FBdUMsVUFBQ2IsT0FBRDtBQUN0QyxNQUFBRSxJQUFBO0FBQUFBLFNBQU8xZixRQUFRb1YsV0FBUixDQUFvQm1SLEtBQXBCLENBQTBCemdCLE9BQTFCLENBQWtDMFosT0FBbEMsQ0FBUDs7QUFDQSxNQUFHLENBQUlFLElBQVA7QUFDQyxVQUFNLElBQUk5ZixPQUFPb1csS0FBWCxDQUFpQixRQUFqQixFQUEyQixlQUEzQixDQUFOO0FDNkZDOztBRDVGRixTQUFPMEosSUFBUDtBQUpzQyxDQUF2Qzs7QUFNQVUsNkJBQTZCb0csWUFBN0IsR0FBNEMsVUFBQzVTLFFBQUQsRUFBVzZMLE9BQVg7QUFDM0MsTUFBQWdILFVBQUE7QUFBQUEsZUFBYXptQixRQUFRb1YsV0FBUixDQUFvQm1JLFdBQXBCLENBQWdDelgsT0FBaEMsQ0FBd0M7QUFBRWtPLFdBQU9KLFFBQVQ7QUFBbUJ3TCxVQUFNSztBQUF6QixHQUF4QyxDQUFiOztBQUNBLE1BQUcsQ0FBSWdILFVBQVA7QUFDQyxVQUFNLElBQUk3bUIsT0FBT29XLEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsd0JBQTNCLENBQU47QUNtR0M7O0FEbEdGLFNBQU95USxVQUFQO0FBSjJDLENBQTVDOztBQU1BckcsNkJBQTZCc0csbUJBQTdCLEdBQW1ELFVBQUNELFVBQUQ7QUFDbEQsTUFBQWxLLElBQUEsRUFBQWdFLEdBQUE7QUFBQWhFLFNBQU8sSUFBSWxTLE1BQUosRUFBUDtBQUNBa1MsT0FBS29LLFlBQUwsR0FBb0JGLFdBQVdFLFlBQS9CO0FBQ0FwRyxRQUFNdmdCLFFBQVFvVixXQUFSLENBQW9CeUssYUFBcEIsQ0FBa0MvWixPQUFsQyxDQUEwQzJnQixXQUFXRSxZQUFyRCxFQUFtRTtBQUFFemtCLFlBQVE7QUFBRXlCLFlBQU0sQ0FBUjtBQUFZK2YsZ0JBQVU7QUFBdEI7QUFBVixHQUFuRSxDQUFOO0FBQ0FuSCxPQUFLcUssaUJBQUwsR0FBeUJyRyxJQUFJNWMsSUFBN0I7QUFDQTRZLE9BQUtzSyxxQkFBTCxHQUE2QnRHLElBQUltRCxRQUFqQztBQUNBLFNBQU9uSCxJQUFQO0FBTmtELENBQW5EOztBQVFBNkQsNkJBQTZCMEcsYUFBN0IsR0FBNkMsVUFBQ3BILElBQUQ7QUFDNUMsTUFBR0EsS0FBS3FILEtBQUwsS0FBZ0IsU0FBbkI7QUFDQyxVQUFNLElBQUlubkIsT0FBT29XLEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsWUFBM0IsQ0FBTjtBQzRHQztBRDlHMEMsQ0FBN0M7O0FBSUFvSyw2QkFBNkI0RyxrQkFBN0IsR0FBa0QsVUFBQ3RILElBQUQsRUFBTzlMLFFBQVA7QUFDakQsTUFBRzhMLEtBQUsxTCxLQUFMLEtBQWdCSixRQUFuQjtBQUNDLFVBQU0sSUFBSWhVLE9BQU9vVyxLQUFYLENBQWlCLFFBQWpCLEVBQTJCLGFBQTNCLENBQU47QUM4R0M7QURoSCtDLENBQWxEOztBQUlBb0ssNkJBQTZCNkcsT0FBN0IsR0FBdUMsVUFBQ0MsT0FBRDtBQUN0QyxNQUFBQyxJQUFBO0FBQUFBLFNBQU9ubkIsUUFBUW9WLFdBQVIsQ0FBb0JnUyxLQUFwQixDQUEwQnRoQixPQUExQixDQUFrQ29oQixPQUFsQyxDQUFQOztBQUNBLE1BQUcsQ0FBSUMsSUFBUDtBQUNDLFVBQU0sSUFBSXZuQixPQUFPb1csS0FBWCxDQUFpQixRQUFqQixFQUEyQixpQkFBM0IsQ0FBTjtBQ2lIQzs7QUQvR0YsU0FBT21SLElBQVA7QUFMc0MsQ0FBdkM7O0FBT0EvRyw2QkFBNkJpSCxXQUE3QixHQUEyQyxVQUFDQyxXQUFEO0FBQzFDLFNBQU90bkIsUUFBUW9WLFdBQVIsQ0FBb0JtUyxVQUFwQixDQUErQnpoQixPQUEvQixDQUF1Q3doQixXQUF2QyxDQUFQO0FBRDBDLENBQTNDOztBQUdBbEgsNkJBQTZCb0gsa0JBQTdCLEdBQWtELFVBQUN0bkIsV0FBRCxFQUFjc2YsT0FBZDtBQUNqRCxNQUFBaUksRUFBQSxFQUFBQyxhQUFBO0FBQUFELE9BQUt6bkIsUUFBUW9WLFdBQVIsQ0FBb0J1UyxnQkFBcEIsQ0FBcUM3aEIsT0FBckMsQ0FBNkM7QUFDakQ1RixpQkFBYUEsV0FEb0M7QUFFakRzZixhQUFTQTtBQUZ3QyxHQUE3QyxDQUFMOztBQUlBLE1BQUcsQ0FBQ2lJLEVBQUo7QUFDQyxVQUFNLElBQUk3bkIsT0FBT29XLEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsY0FBM0IsQ0FBTjtBQ29IQzs7QURuSEYwUixrQkFBZ0JELEdBQUdHLGNBQUgsSUFBcUIsTUFBckM7O0FBQ0EsTUFBRyxDQUFDLENBQUMsTUFBRCxFQUFTLFlBQVQsRUFBdUJ4YixRQUF2QixDQUFnQ3NiLGFBQWhDLENBQUo7QUFDQyxVQUFNLElBQUk5bkIsT0FBT29XLEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsV0FBM0IsQ0FBTjtBQ3FIQztBRDlIK0MsQ0FBbEQ7O0FBYUFvSyw2QkFBNkJ5SCxlQUE3QixHQUErQyxVQUFDQyxvQkFBRCxFQUF1QkMsU0FBdkI7QUFDOUMsTUFBQUMsUUFBQSxFQUFBQyxtQkFBQSxFQUFBQyxRQUFBLEVBQUF4SSxJQUFBLEVBQUFGLE9BQUEsRUFBQTJILElBQUEsRUFBQWdCLE9BQUEsRUFBQUMsVUFBQSxFQUFBOU4sR0FBQSxFQUFBcFQsV0FBQSxFQUFBbWhCLGlCQUFBLEVBQUFyVSxLQUFBLEVBQUFKLFFBQUEsRUFBQTZTLFVBQUEsRUFBQTZCLG1CQUFBLEVBQUFDLFVBQUEsRUFBQUMsaUJBQUEsRUFBQUMsU0FBQSxFQUFBaEosT0FBQTtBQUFBeEgsUUFBTTZQLHFCQUFxQixXQUFyQixDQUFOLEVBQXlDNUosTUFBekM7QUFDQWpHLFFBQU02UCxxQkFBcUIsT0FBckIsQ0FBTixFQUFxQzVKLE1BQXJDO0FBQ0FqRyxRQUFNNlAscUJBQXFCLE1BQXJCLENBQU4sRUFBb0M1SixNQUFwQztBQUNBakcsUUFBTTZQLHFCQUFxQixZQUFyQixDQUFOLEVBQTBDLENBQUM7QUFBQ3BULE9BQUd3SixNQUFKO0FBQVl2SixTQUFLLENBQUN1SixNQUFEO0FBQWpCLEdBQUQsQ0FBMUM7QUFHQWtDLCtCQUE2Qm9ILGtCQUE3QixDQUFnRE0scUJBQXFCLFlBQXJCLEVBQW1DLENBQW5DLEVBQXNDcFQsQ0FBdEYsRUFBeUZvVCxxQkFBcUIsTUFBckIsQ0FBekY7QUFHQTFILCtCQUE2QnNJLGlCQUE3QixDQUErQ1oscUJBQXFCLFlBQXJCLEVBQW1DLENBQW5DLENBQS9DLEVBQXNGQSxxQkFBcUIsT0FBckIsQ0FBdEY7QUFFQWxVLGFBQVdrVSxxQkFBcUIsT0FBckIsQ0FBWDtBQUNBdEksWUFBVXNJLHFCQUFxQixNQUFyQixDQUFWO0FBQ0FySSxZQUFVc0ksVUFBVWhuQixHQUFwQjtBQUVBeW5CLHNCQUFvQixJQUFwQjtBQUVBUCx3QkFBc0IsSUFBdEI7O0FBQ0EsTUFBR0gscUJBQXFCLFFBQXJCLEtBQW1DQSxxQkFBcUIsUUFBckIsRUFBK0IsQ0FBL0IsQ0FBdEM7QUFDQ1Usd0JBQW9CVixxQkFBcUIsUUFBckIsRUFBK0IsQ0FBL0IsQ0FBcEI7O0FBQ0EsUUFBR1Usa0JBQWtCLFVBQWxCLEtBQWtDQSxrQkFBa0IsVUFBbEIsRUFBOEIsQ0FBOUIsQ0FBckM7QUFDQ1AsNEJBQXNCSCxxQkFBcUIsUUFBckIsRUFBK0IsQ0FBL0IsRUFBa0MsVUFBbEMsRUFBOEMsQ0FBOUMsQ0FBdEI7QUFIRjtBQ3dIRTs7QURsSEY5VCxVQUFRb00sNkJBQTZCa0csUUFBN0IsQ0FBc0MxUyxRQUF0QyxDQUFSO0FBRUE4TCxTQUFPVSw2QkFBNkJDLE9BQTdCLENBQXFDYixPQUFyQyxDQUFQO0FBRUFpSCxlQUFhckcsNkJBQTZCb0csWUFBN0IsQ0FBMEM1UyxRQUExQyxFQUFvRDZMLE9BQXBELENBQWI7QUFFQTZJLHdCQUFzQmxJLDZCQUE2QnNHLG1CQUE3QixDQUFpREQsVUFBakQsQ0FBdEI7QUFFQXJHLCtCQUE2QjBHLGFBQTdCLENBQTJDcEgsSUFBM0M7QUFFQVUsK0JBQTZCNEcsa0JBQTdCLENBQWdEdEgsSUFBaEQsRUFBc0Q5TCxRQUF0RDtBQUVBdVQsU0FBTy9HLDZCQUE2QjZHLE9BQTdCLENBQXFDdkgsS0FBS3lILElBQTFDLENBQVA7QUFFQWpnQixnQkFBY3loQixrQkFBa0JwSixrQkFBbEIsQ0FBcUNDLE9BQXJDLEVBQThDQyxPQUE5QyxDQUFkOztBQUVBLE1BQUcsQ0FBSXZZLFlBQVlrRixRQUFaLENBQXFCLEtBQXJCLENBQVA7QUFDQyxVQUFNLElBQUl4TSxPQUFPb1csS0FBWCxDQUFpQixRQUFqQixFQUEyQixnQkFBM0IsQ0FBTjtBQzRHQzs7QUQxR0ZzRSxRQUFNLElBQUloRyxJQUFKLEVBQU47QUFDQTZULFlBQVUsRUFBVjtBQUNBQSxVQUFRcG5CLEdBQVIsR0FBY2YsUUFBUW9WLFdBQVIsQ0FBb0JxUCxTQUFwQixDQUE4QmhRLFVBQTlCLEVBQWQ7QUFDQTBULFVBQVFuVSxLQUFSLEdBQWdCSixRQUFoQjtBQUNBdVUsVUFBUXpJLElBQVIsR0FBZUYsT0FBZjtBQUNBMkksVUFBUVMsWUFBUixHQUF1QmxKLEtBQUttSixPQUFMLENBQWE5bkIsR0FBcEM7QUFDQW9uQixVQUFRaEIsSUFBUixHQUFlekgsS0FBS3lILElBQXBCO0FBQ0FnQixVQUFRVyxZQUFSLEdBQXVCcEosS0FBS21KLE9BQUwsQ0FBYUMsWUFBcEM7QUFDQVgsVUFBUXhrQixJQUFSLEdBQWUrYixLQUFLL2IsSUFBcEI7QUFDQXdrQixVQUFRWSxTQUFSLEdBQW9CdEosT0FBcEI7QUFDQTBJLFVBQVFhLGNBQVIsR0FBeUJqQixVQUFVcGtCLElBQW5DO0FBQ0F3a0IsVUFBUWMsU0FBUixHQUF1Qm5CLHFCQUFxQixXQUFyQixJQUF1Q0EscUJBQXFCLFdBQXJCLENBQXZDLEdBQThFckksT0FBckc7QUFDQTBJLFVBQVFlLGNBQVIsR0FBNEJwQixxQkFBcUIsZ0JBQXJCLElBQTRDQSxxQkFBcUIsZ0JBQXJCLENBQTVDLEdBQXdGQyxVQUFVcGtCLElBQTlIO0FBQ0F3a0IsVUFBUWdCLHNCQUFSLEdBQW9DckIscUJBQXFCLHdCQUFyQixJQUFvREEscUJBQXFCLHdCQUFyQixDQUFwRCxHQUF3R3JCLFdBQVdFLFlBQXZKO0FBQ0F3QixVQUFRaUIsMkJBQVIsR0FBeUN0QixxQkFBcUIsNkJBQXJCLElBQXlEQSxxQkFBcUIsNkJBQXJCLENBQXpELEdBQWtIUSxvQkFBb0IxQixpQkFBL0s7QUFDQXVCLFVBQVFrQiwrQkFBUixHQUE2Q3ZCLHFCQUFxQixpQ0FBckIsSUFBNkRBLHFCQUFxQixpQ0FBckIsQ0FBN0QsR0FBMkhRLG9CQUFvQnpCLHFCQUE1TDtBQUNBc0IsVUFBUW1CLGlCQUFSLEdBQStCeEIscUJBQXFCLG1CQUFyQixJQUErQ0EscUJBQXFCLG1CQUFyQixDQUEvQyxHQUE4RnJCLFdBQVc4QyxVQUF4STtBQUNBcEIsVUFBUXBCLEtBQVIsR0FBZ0IsT0FBaEI7QUFDQW9CLFVBQVF0RixJQUFSLEdBQWUsRUFBZjtBQUNBc0YsVUFBUXFCLFdBQVIsR0FBc0IsS0FBdEI7QUFDQXJCLFVBQVFzQixVQUFSLEdBQXFCLEtBQXJCO0FBQ0F0QixVQUFRdlQsT0FBUixHQUFrQjBGLEdBQWxCO0FBQ0E2TixVQUFRdFQsVUFBUixHQUFxQjRLLE9BQXJCO0FBQ0EwSSxVQUFROVQsUUFBUixHQUFtQmlHLEdBQW5CO0FBQ0E2TixVQUFRNVQsV0FBUixHQUFzQmtMLE9BQXRCO0FBRUEwSSxVQUFRdUIsVUFBUixHQUFxQjVCLHFCQUFxQixZQUFyQixDQUFyQjs7QUFFQSxNQUFHckIsV0FBVzhDLFVBQWQ7QUFDQ3BCLFlBQVFvQixVQUFSLEdBQXFCOUMsV0FBVzhDLFVBQWhDO0FDMEdDOztBRHZHRmQsY0FBWSxFQUFaO0FBQ0FBLFlBQVUxbkIsR0FBVixHQUFnQixJQUFJNG9CLE1BQU1DLFFBQVYsR0FBcUJDLElBQXJDO0FBQ0FwQixZQUFVL2lCLFFBQVYsR0FBcUJ5aUIsUUFBUXBuQixHQUE3QjtBQUNBMG5CLFlBQVVxQixXQUFWLEdBQXdCLEtBQXhCO0FBRUF2QixlQUFhbG1CLEVBQUUwQyxJQUFGLENBQU8yYSxLQUFLbUosT0FBTCxDQUFha0IsS0FBcEIsRUFBMkIsVUFBQ0MsSUFBRDtBQUN2QyxXQUFPQSxLQUFLQyxTQUFMLEtBQWtCLE9BQXpCO0FBRFksSUFBYjtBQUdBeEIsWUFBVXVCLElBQVYsR0FBaUJ6QixXQUFXeG5CLEdBQTVCO0FBQ0EwbkIsWUFBVTlrQixJQUFWLEdBQWlCNGtCLFdBQVc1a0IsSUFBNUI7QUFFQThrQixZQUFVeUIsVUFBVixHQUF1QjVQLEdBQXZCO0FBRUEwTixhQUFXLEVBQVg7QUFDQUEsV0FBU2puQixHQUFULEdBQWUsSUFBSTRvQixNQUFNQyxRQUFWLEdBQXFCQyxJQUFwQztBQUNBN0IsV0FBU3RpQixRQUFULEdBQW9CeWlCLFFBQVFwbkIsR0FBNUI7QUFDQWluQixXQUFTbUMsS0FBVCxHQUFpQjFCLFVBQVUxbkIsR0FBM0I7QUFDQWluQixXQUFTOEIsV0FBVCxHQUF1QixLQUF2QjtBQUNBOUIsV0FBUzVJLElBQVQsR0FBbUIwSSxxQkFBcUIsV0FBckIsSUFBdUNBLHFCQUFxQixXQUFyQixDQUF2QyxHQUE4RXJJLE9BQWpHO0FBQ0F1SSxXQUFTb0MsU0FBVCxHQUF3QnRDLHFCQUFxQixnQkFBckIsSUFBNENBLHFCQUFxQixnQkFBckIsQ0FBNUMsR0FBd0ZDLFVBQVVwa0IsSUFBMUg7QUFDQXFrQixXQUFTcUMsT0FBVCxHQUFtQjVLLE9BQW5CO0FBQ0F1SSxXQUFTc0MsWUFBVCxHQUF3QnZDLFVBQVVwa0IsSUFBbEM7QUFDQXFrQixXQUFTdUMsb0JBQVQsR0FBZ0M5RCxXQUFXRSxZQUEzQztBQUNBcUIsV0FBU3dDLHlCQUFULEdBQXFDbEMsb0JBQW9CM2tCLElBQXpEO0FBQ0Fxa0IsV0FBU3lDLDZCQUFULEdBQXlDbkMsb0JBQW9CNUUsUUFBN0Q7QUFDQXNFLFdBQVN0bEIsSUFBVCxHQUFnQixPQUFoQjtBQUNBc2xCLFdBQVNrQyxVQUFULEdBQXNCNVAsR0FBdEI7QUFDQTBOLFdBQVMwQyxTQUFULEdBQXFCcFEsR0FBckI7QUFDQTBOLFdBQVMyQyxPQUFULEdBQW1CLElBQW5CO0FBQ0EzQyxXQUFTNEMsUUFBVCxHQUFvQixLQUFwQjtBQUNBNUMsV0FBUzZDLFdBQVQsR0FBdUIsRUFBdkI7QUFDQXhDLHNCQUFvQixFQUFwQjtBQUNBTCxXQUFTbGUsTUFBVCxHQUFrQnNXLDZCQUE2QjBLLGNBQTdCLENBQTRDM0MsUUFBUXVCLFVBQVIsQ0FBbUIsQ0FBbkIsQ0FBNUMsRUFBbUVsSyxPQUFuRSxFQUE0RTVMLFFBQTVFLEVBQXNGdVQsS0FBSzBCLE9BQUwsQ0FBYTNtQixNQUFuRyxFQUEyR21tQixpQkFBM0csQ0FBbEI7QUFFQUksWUFBVXNDLFFBQVYsR0FBcUIsQ0FBQy9DLFFBQUQsQ0FBckI7QUFDQUcsVUFBUTZDLE1BQVIsR0FBaUIsQ0FBQ3ZDLFNBQUQsQ0FBakI7QUFFQU4sVUFBUXJlLE1BQVIsR0FBaUJrZSxTQUFTbGUsTUFBMUI7QUFFQXFlLFVBQVE4QyxXQUFSLEdBQXNCbkQscUJBQXFCbUQsV0FBckIsSUFBb0MsRUFBMUQ7QUFFQTlDLFVBQVErQyxpQkFBUixHQUE0QjNDLFdBQVc1a0IsSUFBdkM7O0FBRUEsTUFBRytiLEtBQUt5TCxXQUFMLEtBQW9CLElBQXZCO0FBQ0NoRCxZQUFRZ0QsV0FBUixHQUFzQixJQUF0QjtBQ2lHQzs7QUQ5RkZoRCxVQUFRaUQsU0FBUixHQUFvQjFMLEtBQUsvYixJQUF6Qjs7QUFDQSxNQUFHd2pCLEtBQUtlLFFBQVI7QUFDQ0EsZUFBVzlILDZCQUE2QmlILFdBQTdCLENBQXlDRixLQUFLZSxRQUE5QyxDQUFYOztBQUNBLFFBQUdBLFFBQUg7QUFDQ0MsY0FBUWtELGFBQVIsR0FBd0JuRCxTQUFTdmtCLElBQWpDO0FBQ0F3a0IsY0FBUUQsUUFBUixHQUFtQkEsU0FBU25uQixHQUE1QjtBQUpGO0FDcUdFOztBRC9GRnFuQixlQUFhcG9CLFFBQVFvVixXQUFSLENBQW9CcVAsU0FBcEIsQ0FBOEJqUSxNQUE5QixDQUFxQzJULE9BQXJDLENBQWI7QUFFQS9ILCtCQUE2QmtMLDBCQUE3QixDQUF3RG5ELFFBQVF1QixVQUFSLENBQW1CLENBQW5CLENBQXhELEVBQStFdEIsVUFBL0UsRUFBMkZ4VSxRQUEzRjtBQUlBd00sK0JBQTZCbUwsY0FBN0IsQ0FBNENwRCxRQUFRdUIsVUFBUixDQUFtQixDQUFuQixDQUE1QyxFQUFtRTlWLFFBQW5FLEVBQTZFdVUsUUFBUXBuQixHQUFyRixFQUEwRmluQixTQUFTam5CLEdBQW5HO0FBRUEsU0FBT3FuQixVQUFQO0FBMUk4QyxDQUEvQzs7QUE0SUFoSSw2QkFBNkIwSyxjQUE3QixHQUE4QyxVQUFDVSxTQUFELEVBQVlDLE1BQVosRUFBb0Joa0IsT0FBcEIsRUFBNkJ2RixNQUE3QixFQUFxQ21tQixpQkFBckM7QUFDN0MsTUFBQXFELFVBQUEsRUFBQUMsWUFBQSxFQUFBak0sSUFBQSxFQUFBeUgsSUFBQSxFQUFBckUsVUFBQSxFQUFBRixlQUFBLEVBQUFGLG1CQUFBLEVBQUE5UyxNQUFBLEVBQUFnYyxVQUFBLEVBQUFuRSxFQUFBLEVBQUFwaUIsTUFBQSxFQUFBd21CLFFBQUEsRUFBQTFyQixHQUFBLEVBQUFpQyxjQUFBLEVBQUFtZ0Isa0JBQUEsRUFBQWdELGVBQUEsRUFBQXVHLGVBQUEsRUFBQUMsYUFBQSxFQUFBQyxpQkFBQSxFQUFBbGlCLE1BQUE7QUFBQTRoQixlQUFhLEVBQWI7O0FBQ0FycEIsSUFBRWUsSUFBRixDQUFPbEIsTUFBUCxFQUFlLFVBQUNLLENBQUQ7QUFDZCxRQUFHQSxFQUFFRyxJQUFGLEtBQVUsU0FBYjtBQzhGSSxhRDdGSEwsRUFBRWUsSUFBRixDQUFPYixFQUFFTCxNQUFULEVBQWlCLFVBQUM2Z0IsRUFBRDtBQzhGWixlRDdGSjJJLFdBQVcvb0IsSUFBWCxDQUFnQm9nQixHQUFHRixJQUFuQixDQzZGSTtBRDlGTCxRQzZGRztBRDlGSjtBQ2tHSSxhRDlGSDZJLFdBQVcvb0IsSUFBWCxDQUFnQkosRUFBRXNnQixJQUFsQixDQzhGRztBQUNEO0FEcEdKOztBQU9BL1ksV0FBUyxFQUFUO0FBQ0E4aEIsZUFBYUosVUFBVTlXLENBQXZCO0FBQ0E5RSxXQUFTd1IsZ0JBQWdCd0ssVUFBaEIsQ0FBVDtBQUNBQyxhQUFXTCxVQUFVN1csR0FBVixDQUFjLENBQWQsQ0FBWDtBQUNBOFMsT0FBS3puQixRQUFRb1YsV0FBUixDQUFvQnVTLGdCQUFwQixDQUFxQzdoQixPQUFyQyxDQUE2QztBQUNqRDVGLGlCQUFhMHJCLFVBRG9DO0FBRWpEcE0sYUFBU2lNO0FBRndDLEdBQTdDLENBQUw7QUFLQXBtQixXQUFTd2MsY0FBYytKLFVBQWQsRUFBMEI7QUFBRXhuQixhQUFTLENBQUMsQ0FBQyxLQUFELEVBQVEsR0FBUixFQUFheW5CLFFBQWIsQ0FBRDtBQUFYLEdBQTFCLENBQVQ7QUFDQW5NLFNBQU8xZixRQUFRNkYsYUFBUixDQUFzQixPQUF0QixFQUErQkMsT0FBL0IsQ0FBdUMybEIsTUFBdkMsRUFBK0M7QUFBRXZwQixZQUFRO0FBQUVpbEIsWUFBTTtBQUFSO0FBQVYsR0FBL0MsQ0FBUDs7QUFDQSxNQUFHTSxNQUFPcGlCLE1BQVY7QUFDQ2tnQixzQkFBa0JrQyxHQUFHd0UsZ0JBQUgsSUFBdUIsRUFBekM7QUFDQXJMLHlCQUFxQjJFLGVBQXJCLEVBQXNDbGdCLE1BQXRDO0FBRUE4aEIsV0FBT25uQixRQUFRNkYsYUFBUixDQUFzQixPQUF0QixFQUErQkMsT0FBL0IsQ0FBdUM0WixLQUFLeUgsSUFBNUMsQ0FBUDtBQUNBckUsaUJBQWFxRSxLQUFLMEIsT0FBTCxDQUFhM21CLE1BQWIsSUFBdUIsRUFBcEM7QUFDQUUscUJBQWlCbWYsWUFBWXFLLFVBQVosQ0FBakI7QUFDQXJKLHlCQUFxQmxnQixFQUFFc0ksS0FBRixDQUFRdkksY0FBUixFQUF3QixhQUF4QixDQUFyQjtBQUNBd2dCLHNCQUFrQnZnQixFQUFFdUksTUFBRixDQUFTa1ksVUFBVCxFQUFxQixVQUFDNkIsU0FBRDtBQUN0QyxhQUFPQSxVQUFVamlCLElBQVYsS0FBa0IsT0FBekI7QUFEaUIsTUFBbEI7QUFFQWdnQiwwQkFBc0JyZ0IsRUFBRXNJLEtBQUYsQ0FBUWlZLGVBQVIsRUFBeUIsTUFBekIsQ0FBdEI7QUFHQWtKLHNCQUFrQixFQUFsQjtBQUNBQyxvQkFBZ0IsRUFBaEI7QUFFQUMsd0JBQW9CLEVBQXBCOztBQ2tHRSxRQUFJLENBQUM3ckIsTUFBTXNuQixHQUFHeUUsU0FBVixLQUF3QixJQUE1QixFQUFrQztBQUNoQy9yQixVRGhHVW1DLE9DZ0dWLENEaEdrQixVQUFDNnBCLEVBQUQ7QUFDckIsWUFBQXhILFNBQUEsRUFBQWhDLGtCQUFBLEVBQUF5SixRQUFBLEVBQUFDLGVBQUEsRUFBQUMsY0FBQSxFQUFBQyxrQkFBQSxFQUFBQyxVQUFBLEVBQUFDLHdCQUFBLEVBQUFDLDRCQUFBLEVBQUFDLGVBQUEsRUFBQWpJLFFBQUEsRUFBQXBNLFdBQUEsRUFBQXNVLGVBQUEsRUFBQUMscUJBQUEsRUFBQUMsaUJBQUEsRUFBQWxJLFlBQUEsRUFBQUMsZ0JBQUEsRUFBQWtJLGNBQUEsRUFBQTVKLG9CQUFBLEVBQUE2SixxQkFBQSxFQUFBakkscUJBQUEsRUFBQWtJLHNCQUFBLEVBQUFDLG9CQUFBLEVBQUFDLFVBQUEsRUFBQUMsY0FBQTtBQUFBeEksdUJBQWV1SCxHQUFHdkgsWUFBbEI7QUFDQXdJLHlCQUFpQmpCLEdBQUdpQixjQUFwQjs7QUFDQSxZQUFHLENBQUN4SSxZQUFELElBQWlCLENBQUN3SSxjQUFyQjtBQUNDLGdCQUFNLElBQUl4dEIsT0FBT29XLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IscUJBQXRCLENBQU47QUNrR0s7O0FEakdOaVgsaUNBQXlCM0wsMEJBQTBCaUIsa0JBQTFCLEVBQThDcUMsWUFBOUMsQ0FBekI7QUFDQWpDLDZCQUFxQjFCLHNCQUFzQnlCLG1CQUF0QixFQUEyQzBLLGNBQTNDLENBQXJCO0FBQ0ExSSxtQkFBVzlVLE9BQU8xTixNQUFQLENBQWMwaUIsWUFBZCxDQUFYO0FBQ0FELG9CQUFZNUQsYUFBYStCLFVBQWIsRUFBeUJzSyxjQUF6QixDQUFaO0FBQ0F2SSwyQkFBbUJ4ZixPQUFPdWYsWUFBUCxDQUFuQjs7QUFFQSxZQUFHcUksc0JBQUg7QUFFQ1QsdUJBQWE1SCxhQUFhbE8sS0FBYixDQUFtQixHQUFuQixFQUF3QixDQUF4QixDQUFiO0FBQ0FpVyw0QkFBa0IvSCxhQUFhbE8sS0FBYixDQUFtQixHQUFuQixFQUF3QixDQUF4QixDQUFsQjtBQUNBd1csaUNBQXVCVixVQUF2Qjs7QUFDQSxjQUFHLENBQUNSLGtCQUFrQmtCLG9CQUFsQixDQUFKO0FBQ0NsQiw4QkFBa0JrQixvQkFBbEIsSUFBMEMsRUFBMUM7QUNpR007O0FEL0ZQLGNBQUd2SyxrQkFBSDtBQUNDd0sseUJBQWFDLGVBQWUxVyxLQUFmLENBQXFCLEdBQXJCLEVBQTBCLENBQTFCLENBQWI7QUFDQXNWLDhCQUFrQmtCLG9CQUFsQixFQUF3QyxrQkFBeEMsSUFBOERDLFVBQTlEO0FDaUdNOztBQUNELGlCRGhHTm5CLGtCQUFrQmtCLG9CQUFsQixFQUF3Q1AsZUFBeEMsSUFBMkRTLGNDZ0dyRDtBRDVHUCxlQWNLLElBQUdBLGVBQWVucEIsT0FBZixDQUF1QixHQUF2QixJQUE4QixDQUE5QixJQUFvQzJnQixhQUFhM2dCLE9BQWIsQ0FBcUIsS0FBckIsSUFBOEIsQ0FBckU7QUFDSmtwQix1QkFBYUMsZUFBZTFXLEtBQWYsQ0FBcUIsR0FBckIsRUFBMEIsQ0FBMUIsQ0FBYjtBQUNBOFYsdUJBQWE1SCxhQUFhbE8sS0FBYixDQUFtQixLQUFuQixFQUEwQixDQUExQixFQUE4QnBSLEtBQUsrbkIsTUFBTCxDQUFZcGxCLENBQVosQ0FBY3RFLElBQTVDLENBQWI7O0FBQ0EsY0FBRzBCLE9BQU9pZ0IsY0FBUCxDQUFzQmtILFVBQXRCLEtBQXNDbnFCLEVBQUUwTCxPQUFGLENBQVUxSSxPQUFPbW5CLFVBQVAsQ0FBVixDQUF6QztBQUNDViw0QkFBZ0JucEIsSUFBaEIsQ0FBcUJxTCxLQUFLQyxTQUFMLENBQWU7QUFDbkNxZix5Q0FBMkJILFVBRFE7QUFFbkNJLHVDQUF5QmY7QUFGVSxhQUFmLENBQXJCO0FDbUdPLG1CRC9GUFQsY0FBY3BwQixJQUFkLENBQW1Cd3BCLEVBQW5CLENDK0ZPO0FEcEdSLGlCQU1LLElBQUdLLFdBQVd2b0IsT0FBWCxDQUFtQixHQUFuQixJQUEwQixDQUE3QjtBQUNKeW9CLDJDQUErQkYsV0FBVzlWLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsQ0FBdEIsQ0FBL0I7QUFDQTBWLHVCQUFXSSxXQUFXOVYsS0FBWCxDQUFpQixHQUFqQixFQUFzQixDQUF0QixDQUFYO0FBQ0ErVix1Q0FBMkI3YyxPQUFPMU4sTUFBUCxDQUFjd3FCLDRCQUFkLENBQTNCOztBQUNBLGdCQUFHRCw0QkFBNEIsQ0FBQyxRQUFELEVBQVcsZUFBWCxFQUE0QnJnQixRQUE1QixDQUFxQ3FnQix5QkFBeUIvcEIsSUFBOUQsQ0FBNUIsSUFBbUdMLEVBQUVXLFFBQUYsQ0FBV3lwQix5QkFBeUIxcEIsWUFBcEMsQ0FBdEc7QUFDQyxrQkFBR3NDLE9BQU9tbkIsVUFBUCxDQUFIO0FBQ0M7QUNnR1E7O0FEL0ZUckoscUNBQXVCc0oseUJBQXlCdkgsa0JBQXpCLElBQStDLEtBQXRFO0FBQ0FILHNDQUF3QjBILHlCQUF5QjFwQixZQUFqRDtBQUNBaXFCLHNDQUF3QjNuQixPQUFPb25CLHlCQUF5QjlvQixJQUFoQyxDQUF4QjtBQUVBb3BCLCtCQUFpQmxNLG1CQUFtQmtFLHFCQUFuQixFQUEwQ2lJLHFCQUExQyxFQUFpRTdKLG9CQUFqRSxDQUFqQjs7QUFDQSxrQkFBRzRKLGVBQWVYLFFBQWYsQ0FBSDtBQUNDL21CLHVCQUFPbW5CLFVBQVAsSUFBcUJPLGVBQWVYLFFBQWYsQ0FBckI7QUFDQU4sZ0NBQWdCbnBCLElBQWhCLENBQXFCcUwsS0FBS0MsU0FBTCxDQUFlO0FBQ25DcWYsNkNBQTJCSCxVQURRO0FBRW5DSSwyQ0FBeUJmO0FBRlUsaUJBQWYsQ0FBckI7QUFJQSx1QkFBT1QsY0FBY3BwQixJQUFkLENBQW1Cd3BCLEVBQW5CLENBQVA7QUFkRjtBQUpJO0FBVEQ7QUFBQSxlQThCQSxJQUFHdkgsYUFBYTNnQixPQUFiLENBQXFCLEdBQXJCLElBQTRCLENBQTVCLElBQWtDMmdCLGFBQWEzZ0IsT0FBYixDQUFxQixLQUFyQixNQUErQixDQUFDLENBQXJFO0FBQ0oyb0IsNEJBQWtCaEksYUFBYWxPLEtBQWIsQ0FBbUIsR0FBbkIsRUFBd0IsQ0FBeEIsQ0FBbEI7QUFDQTJWLDRCQUFrQnpILGFBQWFsTyxLQUFiLENBQW1CLEdBQW5CLEVBQXdCLENBQXhCLENBQWxCOztBQUNBLGNBQUc5RyxNQUFIO0FBQ0MwSSwwQkFBYzFJLE9BQU8xTixNQUFQLENBQWMwcUIsZUFBZCxDQUFkOztBQUNBLGdCQUFHdFUsZUFBZXFNLFNBQWYsSUFBNEIsQ0FBQyxRQUFELEVBQVcsZUFBWCxFQUE0QnZZLFFBQTVCLENBQXFDa00sWUFBWTVWLElBQWpELENBQTVCLElBQXNGTCxFQUFFVyxRQUFGLENBQVdzVixZQUFZdlYsWUFBdkIsQ0FBekY7QUFDQ3dwQixtQ0FBcUIxSyxjQUFjdkosWUFBWXZWLFlBQTFCLEVBQXdDO0FBQUVxQix5QkFBUyxDQUFDLENBQUMsS0FBRCxFQUFRLEdBQVIsRUFBYWlCLE9BQU91bkIsZUFBUCxDQUFiLENBQUQsQ0FBWDtBQUFvRDFxQix3QkFBUSxDQUFDbXFCLGVBQUQ7QUFBNUQsZUFBeEMsQ0FBckI7O0FBQ0Esa0JBQUcsQ0FBQ0Usa0JBQUo7QUFDQztBQ29HUTs7QURuR1RNLHNDQUF3QnZVLFlBQVl2VixZQUFwQztBQUNBdXBCLCtCQUFpQmxMLGdCQUFnQnlMLHFCQUFoQixDQUFqQjtBQUNBQyxrQ0FBb0JSLGVBQWVwcUIsTUFBZixDQUFzQm1xQixlQUF0QixDQUFwQjtBQ3FHUSxxQkRuR1J2aUIsT0FBT3NqQixjQUFQLElBQXlCak0sc0JBQXNCMkwsaUJBQXRCLEVBQXlDbkksU0FBekMsRUFBb0Q0SCxrQkFBcEQsRUFBd0VGLGVBQXhFLEVBQXlGNWtCLE9BQXpGLEVBQWtHcEMsT0FBT2duQixlQUFQLENBQWxHLENDbUdqQjtBRDdHVjtBQUhJO0FBQUE7QUNvSEUsaUJEckdOdmlCLE9BQU9zakIsY0FBUCxJQUF5QmpNLHNCQUFzQnVELFFBQXRCLEVBQWdDQyxTQUFoQyxFQUEyQ3RmLE1BQTNDLEVBQW1EdWYsWUFBbkQsRUFBaUVuZCxPQUFqRSxFQUEwRXBDLE9BQU91ZixZQUFQLENBQTFFLENDcUduQjtBQUNEO0FENUtQLE9DZ0dJO0FBOEVEOztBRHJHSHZpQixNQUFFNEksSUFBRixDQUFPNmdCLGVBQVAsRUFBd0J4cEIsT0FBeEIsQ0FBZ0MsVUFBQ2tyQixHQUFEO0FBQy9CLFVBQUFDLENBQUE7QUFBQUEsVUFBSXpmLEtBQUswZixLQUFMLENBQVdGLEdBQVgsQ0FBSjtBQUNBMWpCLGFBQU8yakIsRUFBRUgseUJBQVQsSUFBc0MsRUFBdEM7QUN3R0csYUR2R0hqb0IsT0FBT29vQixFQUFFRix1QkFBVCxFQUFrQ2pyQixPQUFsQyxDQUEwQyxVQUFDcXJCLEVBQUQ7QUFDekMsWUFBQUMsS0FBQTtBQUFBQSxnQkFBUSxFQUFSOztBQUNBdnJCLFVBQUVlLElBQUYsQ0FBT3VxQixFQUFQLEVBQVcsVUFBQ0UsT0FBRCxFQUFVcnJCLENBQVY7QUN5R0wsaUJEeEdMdXBCLGNBQWN6cEIsT0FBZCxDQUFzQixVQUFDd3JCLEdBQUQ7QUFDckIsZ0JBQUFDLE9BQUE7O0FBQUEsZ0JBQUdELElBQUlsSixZQUFKLEtBQXFCNkksRUFBRUYsdUJBQUYsR0FBNEIsS0FBNUIsR0FBb0MvcUIsQ0FBNUQ7QUFDQ3VyQix3QkFBVUQsSUFBSVYsY0FBSixDQUFtQjFXLEtBQW5CLENBQXlCLEdBQXpCLEVBQThCLENBQTlCLENBQVY7QUMwR08scUJEekdQa1gsTUFBTUcsT0FBTixJQUFpQkYsT0N5R1Y7QUFDRDtBRDdHUixZQ3dHSztBRHpHTjs7QUFLQSxZQUFHLENBQUl4ckIsRUFBRTBKLE9BQUYsQ0FBVTZoQixLQUFWLENBQVA7QUM2R00saUJENUdMOWpCLE9BQU8yakIsRUFBRUgseUJBQVQsRUFBb0MzcUIsSUFBcEMsQ0FBeUNpckIsS0FBekMsQ0M0R0s7QUFDRDtBRHJITixRQ3VHRztBRDFHSjs7QUFjQXZyQixNQUFFZSxJQUFGLENBQU80b0IsaUJBQVAsRUFBMkIsVUFBQ2xnQixHQUFELEVBQU1wQyxHQUFOO0FBQzFCLFVBQUFza0IsY0FBQSxFQUFBQyxZQUFBLEVBQUFDLGdCQUFBLEVBQUEzcUIsYUFBQSxFQUFBdUwsaUJBQUEsRUFBQXFmLGNBQUEsRUFBQUMsaUJBQUEsRUFBQUMsU0FBQSxFQUFBQyxXQUFBO0FBQUFELGtCQUFZdmlCLElBQUl5aUIsZ0JBQWhCO0FBQ0FQLHVCQUFpQmhOLGtCQUFrQjRCLGVBQWxCLEVBQW1DeUwsU0FBbkMsQ0FBakI7O0FBQ0EsVUFBRyxDQUFDQSxTQUFKO0FDK0dLLGVEOUdKOWhCLFFBQVFpaUIsSUFBUixDQUFhLHNCQUFzQjlrQixHQUF0QixHQUE0QixnQ0FBekMsQ0M4R0k7QUQvR0w7QUFHQ29GLDRCQUFvQnBGLEdBQXBCO0FBQ0E0a0Isc0JBQWMsRUFBZDtBQUNBRiw0QkFBb0IsRUFBcEI7QUFDQTdxQix3QkFBZ0I2ZCxnQkFBZ0J0UyxpQkFBaEIsQ0FBaEI7QUFDQW1mLHVCQUFlNXJCLEVBQUUwQyxJQUFGLENBQU94QixjQUFjckIsTUFBckIsRUFBNkIsVUFBQ0ssQ0FBRDtBQUMzQyxpQkFBTyxDQUFDLFFBQUQsRUFBVyxlQUFYLEVBQTRCNkosUUFBNUIsQ0FBcUM3SixFQUFFRyxJQUF2QyxLQUFnREgsRUFBRVEsWUFBRixLQUFrQjZvQixVQUF6RTtBQURjLFVBQWY7QUFHQXNDLDJCQUFtQkQsYUFBYXRxQixJQUFoQztBQUVBd3FCLHlCQUFpQnZNLFdBQVc5UyxpQkFBWCxFQUE4QjtBQUM5QzFLLG1CQUFTLENBQ1IsQ0FBQzhwQixnQkFBRCxFQUFtQixHQUFuQixFQUF3QnJDLFFBQXhCLENBRFE7QUFEcUMsU0FBOUIsQ0FBakI7QUFNQXNDLHVCQUFlN3JCLE9BQWYsQ0FBdUIsVUFBQ21zQixhQUFEO0FBQ3RCLGNBQUFDLGNBQUE7QUFBQUEsMkJBQWlCLEVBQWpCOztBQUNBcnNCLFlBQUVlLElBQUYsQ0FBTzBJLEdBQVAsRUFBWSxVQUFDNmlCLFFBQUQsRUFBV0MsUUFBWDtBQUNYLGdCQUFBakssU0FBQSxFQUFBa0ssWUFBQSxFQUFBQyxrQkFBQSxFQUFBQyxlQUFBOztBQUFBLGdCQUFHSCxhQUFZLGtCQUFmO0FBQ0NHO0FBQ0FGOztBQUNBLGtCQUFHRixTQUFTbE0sVUFBVCxDQUFvQjRMLFlBQVksR0FBaEMsQ0FBSDtBQUNDUSwrQkFBZ0JGLFNBQVNqWSxLQUFULENBQWUsR0FBZixFQUFvQixDQUFwQixDQUFoQjtBQUREO0FBR0NtWSwrQkFBZUYsUUFBZjtBQzZHTzs7QUQzR1JoSywwQkFBWXpELHFCQUFxQjhNLGNBQXJCLEVBQXFDYSxZQUFyQyxDQUFaO0FBQ0FDLG1DQUFxQnZyQixjQUFjckIsTUFBZCxDQUFxQjBzQixRQUFyQixDQUFyQjs7QUFDQSxrQkFBRyxDQUFDakssU0FBRCxJQUFjLENBQUNtSyxrQkFBbEI7QUFDQztBQzZHTzs7QUQ1R1JDLGdDQUFrQjVOLHNCQUFzQjJOLGtCQUF0QixFQUEwQ25LLFNBQTFDLEVBQXFEOEosYUFBckQsRUFBb0VHLFFBQXBFLEVBQThFbm5CLE9BQTlFLEVBQXVGZ25CLGNBQWNHLFFBQWQsQ0FBdkYsQ0FBbEI7QUM4R08scUJEN0dQRixlQUFlRyxZQUFmLElBQStCRSxlQzZHeEI7QUFDRDtBRDVIUjs7QUFlQSxjQUFHLENBQUMxc0IsRUFBRTBKLE9BQUYsQ0FBVTJpQixjQUFWLENBQUo7QUFDQ0EsMkJBQWUzdEIsR0FBZixHQUFxQjB0QixjQUFjMXRCLEdBQW5DO0FBQ0F1dEIsd0JBQVkzckIsSUFBWixDQUFpQityQixjQUFqQjtBQ2dITSxtQkQvR05OLGtCQUFrQnpyQixJQUFsQixDQUF1QjtBQUFFcXNCLHNCQUFRO0FBQUVqdUIscUJBQUswdEIsY0FBYzF0QixHQUFyQjtBQUEwQmt1Qix1QkFBT1o7QUFBakM7QUFBVixhQUF2QixDQytHTTtBQU1EO0FEeklQO0FBc0JBdmtCLGVBQU91a0IsU0FBUCxJQUFvQkMsV0FBcEI7QUNzSEksZURySEpqRyxrQkFBa0J2WixpQkFBbEIsSUFBdUNzZixpQkNxSG5DO0FBQ0Q7QURsS0w7O0FBK0NBLFFBQUczRyxHQUFHeUgsZ0JBQU47QUFDQzdzQixRQUFFOHNCLE1BQUYsQ0FBU3JsQixNQUFULEVBQWlCc1csNkJBQTZCZ1Asa0JBQTdCLENBQWdEM0gsR0FBR3lILGdCQUFuRCxFQUFxRXRELFVBQXJFLEVBQWlGbmtCLE9BQWpGLEVBQTBGb2tCLFFBQTFGLENBQWpCO0FBMUpGO0FDaVJFOztBRHBIRkYsaUJBQWUsRUFBZjs7QUFDQXRwQixJQUFFZSxJQUFGLENBQU9mLEVBQUVpTixJQUFGLENBQU94RixNQUFQLENBQVAsRUFBdUIsVUFBQ3RILENBQUQ7QUFDdEIsUUFBR2twQixXQUFXdGYsUUFBWCxDQUFvQjVKLENBQXBCLENBQUg7QUNzSEksYURySEhtcEIsYUFBYW5wQixDQUFiLElBQWtCc0gsT0FBT3RILENBQVAsQ0NxSGY7QUFDRDtBRHhISjs7QUFJQSxTQUFPbXBCLFlBQVA7QUF0TDZDLENBQTlDOztBQXdMQXZMLDZCQUE2QmdQLGtCQUE3QixHQUFrRCxVQUFDRixnQkFBRCxFQUFtQnRELFVBQW5CLEVBQStCbmtCLE9BQS9CLEVBQXdDNG5CLFFBQXhDO0FBRWpELE1BQUFDLElBQUEsRUFBQWpxQixNQUFBLEVBQUFrcUIsTUFBQSxFQUFBemxCLE1BQUE7QUFBQXpFLFdBQVN3YyxjQUFjK0osVUFBZCxFQUEwQjtBQUFFeG5CLGFBQVMsQ0FBQyxDQUFDLEtBQUQsRUFBUSxHQUFSLEVBQWFpckIsUUFBYixDQUFEO0FBQVgsR0FBMUIsQ0FBVDtBQUNBRSxXQUFTLDBDQUEwQ0wsZ0JBQTFDLEdBQTZELElBQXRFO0FBQ0FJLFNBQU8zTyxNQUFNNE8sTUFBTixFQUFjLGtCQUFkLENBQVA7QUFDQXpsQixXQUFTd2xCLEtBQUtqcUIsTUFBTCxDQUFUOztBQUNBLE1BQUdoRCxFQUFFNmMsUUFBRixDQUFXcFYsTUFBWCxDQUFIO0FBQ0MsV0FBT0EsTUFBUDtBQUREO0FBR0N5QyxZQUFRRCxLQUFSLENBQWMsaUNBQWQ7QUMwSEM7O0FEekhGLFNBQU8sRUFBUDtBQVZpRCxDQUFsRDs7QUFjQThULDZCQUE2Qm1MLGNBQTdCLEdBQThDLFVBQUNDLFNBQUQsRUFBWS9qQixPQUFaLEVBQXFCK25CLEtBQXJCLEVBQTRCQyxTQUE1QjtBQUU3Q3p2QixVQUFRb1YsV0FBUixDQUFvQixXQUFwQixFQUFpQ3JRLElBQWpDLENBQXNDO0FBQ3JDaVAsV0FBT3ZNLE9BRDhCO0FBRXJDaVgsWUFBUThNO0FBRjZCLEdBQXRDLEVBR0dscEIsT0FISCxDQUdXLFVBQUNvdEIsRUFBRDtBQ3lIUixXRHhIRnJ0QixFQUFFZSxJQUFGLENBQU9zc0IsR0FBR0MsUUFBVixFQUFvQixVQUFDQyxTQUFELEVBQVlDLEdBQVo7QUFDbkIsVUFBQXR0QixDQUFBLEVBQUF5aEIsT0FBQTtBQUFBemhCLFVBQUl2QyxRQUFRb1YsV0FBUixDQUFvQixzQkFBcEIsRUFBNEN0UCxPQUE1QyxDQUFvRDhwQixTQUFwRCxDQUFKO0FBQ0E1TCxnQkFBVSxJQUFJQyxHQUFHQyxJQUFQLEVBQVY7QUMwSEcsYUR4SEhGLFFBQVFHLFVBQVIsQ0FBbUI1aEIsRUFBRTZoQixnQkFBRixDQUFtQixPQUFuQixDQUFuQixFQUFnRDtBQUM5QzFoQixjQUFNSCxFQUFFOGhCLFFBQUYsQ0FBVzNoQjtBQUQ2QixPQUFoRCxFQUVHLFVBQUNxVCxHQUFEO0FBQ0YsWUFBQXVPLFFBQUE7O0FBQUEsWUFBSXZPLEdBQUo7QUFDQyxnQkFBTSxJQUFJblcsT0FBT29XLEtBQVgsQ0FBaUJELElBQUl6SixLQUFyQixFQUE0QnlKLElBQUl3TyxNQUFoQyxDQUFOO0FDMEhJOztBRHhITFAsZ0JBQVFyZ0IsSUFBUixDQUFhcEIsRUFBRW9CLElBQUYsRUFBYjtBQUNBcWdCLGdCQUFRUSxJQUFSLENBQWFqaUIsRUFBRWlpQixJQUFGLEVBQWI7QUFDQUYsbUJBQVc7QUFDVnRVLGlCQUFPek4sRUFBRStoQixRQUFGLENBQVd0VSxLQURSO0FBRVY4ZixzQkFBWXZ0QixFQUFFK2hCLFFBQUYsQ0FBV3dMLFVBRmI7QUFHVjliLGlCQUFPdk0sT0FIRztBQUlWL0Isb0JBQVU4cEIsS0FKQTtBQUtWTyxtQkFBU04sU0FMQztBQU1WL1Esa0JBQVFnUixHQUFHM3VCO0FBTkQsU0FBWDs7QUFTQSxZQUFHOHVCLFFBQU8sQ0FBVjtBQUNDdkwsbUJBQVN1RSxPQUFULEdBQW1CLElBQW5CO0FDeUhJOztBRHZITDdFLGdCQUFRTSxRQUFSLEdBQW1CQSxRQUFuQjtBQ3lISSxlRHhISnhrQixJQUFJMmtCLFNBQUosQ0FBY2pRLE1BQWQsQ0FBcUJ3UCxPQUFyQixDQ3dISTtBRDdJTCxRQ3dIRztBRDVISixNQ3dIRTtBRDVISDtBQUY2QyxDQUE5Qzs7QUFtQ0E1RCw2QkFBNkJrTCwwQkFBN0IsR0FBMEQsVUFBQ0UsU0FBRCxFQUFZZ0UsS0FBWixFQUFtQi9uQixPQUFuQjtBQWdCekRxYSxlQUFhMEosVUFBVTlXLENBQXZCLEVBQTBCOFcsVUFBVTdXLEdBQVYsQ0FBYyxDQUFkLENBQTFCLEVBQTRDO0FBQzNDOFAsZUFBVyxDQUFDO0FBQ1gxakIsV0FBS3l1QixLQURNO0FBRVh6SSxhQUFPO0FBRkksS0FBRCxDQURnQztBQUszQ2lKLFlBQVEsSUFMbUM7QUFNM0NDLG9CQUFnQjtBQU4yQixHQUE1QztBQWhCeUQsQ0FBMUQ7O0FBNEJBN1AsNkJBQTZCOFAsaUNBQTdCLEdBQWlFLFVBQUM3SCxpQkFBRCxFQUFvQm1ILEtBQXBCLEVBQTJCL25CLE9BQTNCO0FBQ2hFcEYsSUFBRWUsSUFBRixDQUFPaWxCLGlCQUFQLEVBQTBCLFVBQUM4SCxVQUFELEVBQWFyaEIsaUJBQWI7QUFDekIsUUFBQWtOLGlCQUFBO0FBQUFBLHdCQUFvQmhjLFFBQVE2RixhQUFSLENBQXNCaUosaUJBQXRCLEVBQXlDckgsT0FBekMsQ0FBcEI7QUM2R0UsV0Q1R0ZwRixFQUFFZSxJQUFGLENBQU8rc0IsVUFBUCxFQUFtQixVQUFDdGdCLElBQUQ7QUM2R2YsYUQ1R0htTSxrQkFBa0JsRSxNQUFsQixDQUF5QjdELE1BQXpCLENBQWdDcEUsS0FBS21mLE1BQUwsQ0FBWWp1QixHQUE1QyxFQUFpRDtBQUNoRHFULGNBQU07QUFDTHFRLHFCQUFXLENBQUM7QUFDWDFqQixpQkFBS3l1QixLQURNO0FBRVh6SSxtQkFBTztBQUZJLFdBQUQsQ0FETjtBQUtMaUksa0JBQVFuZixLQUFLbWY7QUFMUjtBQUQwQyxPQUFqRCxDQzRHRztBRDdHSixNQzRHRTtBRDlHSDtBQURnRSxDQUFqRTs7QUFnQkE1Tyw2QkFBNkJzSSxpQkFBN0IsR0FBaUQsVUFBQzhDLFNBQUQsRUFBWS9qQixPQUFaO0FBSWhELE1BQUFwQyxNQUFBO0FBQUFBLFdBQVN3YyxjQUFjMkosVUFBVTlXLENBQXhCLEVBQTJCO0FBQUV0USxhQUFTLENBQUMsQ0FBQyxLQUFELEVBQVEsR0FBUixFQUFhb25CLFVBQVU3VyxHQUFWLENBQWMsQ0FBZCxDQUFiLENBQUQsQ0FBWDtBQUE2Q3pTLFlBQVEsQ0FBQyxXQUFEO0FBQXJELEdBQTNCLENBQVQ7O0FBRUEsTUFBR21ELFVBQVdBLE9BQU9vZixTQUFsQixJQUFnQ3BmLE9BQU9vZixTQUFQLENBQWlCLENBQWpCLEVBQW9Cc0MsS0FBcEIsS0FBK0IsV0FBL0QsSUFBK0UvbUIsUUFBUW9WLFdBQVIsQ0FBb0JxUCxTQUFwQixDQUE4QjFmLElBQTlCLENBQW1DTSxPQUFPb2YsU0FBUCxDQUFpQixDQUFqQixFQUFvQjFqQixHQUF2RCxFQUE0RG9ULEtBQTVELEtBQXNFLENBQXhKO0FBQ0MsVUFBTSxJQUFJdlUsT0FBT29XLEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsK0JBQTNCLENBQU47QUNnSEM7QUR2SDhDLENBQWpEOztBQVlBb0ssNkJBQTZCaUYsVUFBN0IsR0FBMEMsVUFBQzNKLElBQUQ7QUFDekMsU0FBT0csT0FBT0gsSUFBUCxFQUFhRSxNQUFiLENBQW9CLFlBQXBCLENBQVA7QUFEeUMsQ0FBMUMsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0Y2hlY2tOcG1WZXJzaW9uc1xufSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHRidXNib3k6IFwiXjAuMi4xM1wiLFxuXHRcInhtbDJqc1wiOiBcIl4wLjQuMTlcIixcbn0sICdzdGVlZG9zOmNyZWF0b3InKTtcblxuaWYgKE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzICYmIE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKSB7XG5cdGNoZWNrTnBtVmVyc2lvbnMoe1xuXHRcdFwiYWxpeXVuLXNka1wiOiBcIl4xLjExLjEyXCJcblx0fSwgJ3N0ZWVkb3M6Y3JlYXRvcicpO1xufSIsIlxuXHQjIENyZWF0b3IuaW5pdEFwcHMoKVxuXG5cbiMgQ3JlYXRvci5pbml0QXBwcyA9ICgpLT5cbiMgXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcbiMgXHRcdF8uZWFjaCBDcmVhdG9yLkFwcHMsIChhcHAsIGFwcF9pZCktPlxuIyBcdFx0XHRkYl9hcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKVxuIyBcdFx0XHRpZiAhZGJfYXBwXG4jIFx0XHRcdFx0YXBwLl9pZCA9IGFwcF9pZFxuIyBcdFx0XHRcdGRiLmFwcHMuaW5zZXJ0KGFwcClcbiMgZWxzZVxuIyBcdGFwcC5faWQgPSBhcHBfaWRcbiMgXHRkYi5hcHBzLnVwZGF0ZSh7X2lkOiBhcHBfaWR9LCBhcHApXG5cbkNyZWF0b3IuZ2V0U2NoZW1hID0gKG9iamVjdF9uYW1lKS0+XG5cdHJldHVybiBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk/LnNjaGVtYVxuXG5DcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQgPSAob2JqZWN0X25hbWUpLT5cblx0IyBpZiBNZXRlb3IuaXNDbGllbnRcblx0IyBcdHJldHVybiBCdWlsZGVyQ3JlYXRvci5wbHVnaW5Db21wb25lbnRTZWxlY3RvcihCdWlsZGVyQ3JlYXRvci5zdG9yZS5nZXRTdGF0ZSgpLCBcIk9iamVjdEhvbWVcIiwgb2JqZWN0X25hbWUpXG5cdHJldHVybiBmYWxzZTtcblxuQ3JlYXRvci5nZXRPYmplY3RVcmwgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSAtPlxuXHRpZiAhYXBwX2lkXG5cdFx0YXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcblx0aWYgIW9iamVjdF9uYW1lXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0bGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbClcblx0bGlzdF92aWV3X2lkID0gbGlzdF92aWV3Py5faWRcblxuXHRpZiByZWNvcmRfaWRcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZClcblx0ZWxzZVxuXHRcdGlmIENyZWF0b3IuZ2V0T2JqZWN0SG9tZUNvbXBvbmVudChvYmplY3RfbmFtZSlcblx0XHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUpXG5cdFx0ZWxzZVxuXHRcdFx0aWYgbGlzdF92aWV3X2lkXG5cdFx0XHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lKVxuXG5DcmVhdG9yLmdldE9iamVjdEFic29sdXRlVXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cblx0aWYgIWFwcF9pZFxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXG5cdGxpc3Rfdmlld19pZCA9IGxpc3Rfdmlldz8uX2lkXG5cblx0aWYgcmVjb3JkX2lkXG5cdFx0cmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQsIHRydWUpXG5cdGVsc2Vcblx0XHRyZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCwgdHJ1ZSlcblxuQ3JlYXRvci5nZXRPYmplY3RSb3V0ZXJVcmwgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSAtPlxuXHRpZiAhYXBwX2lkXG5cdFx0YXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcblx0aWYgIW9iamVjdF9uYW1lXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0bGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbClcblx0bGlzdF92aWV3X2lkID0gbGlzdF92aWV3Py5faWRcblxuXHRpZiByZWNvcmRfaWRcblx0XHRyZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWRcblx0ZWxzZVxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZFxuXG5DcmVhdG9yLmdldExpc3RWaWV3VXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cblx0dXJsID0gQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZClcblx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwodXJsKVxuXG5DcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwgPSAob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSAtPlxuXHRyZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWRcblxuQ3JlYXRvci5nZXRTd2l0Y2hMaXN0VXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cblx0aWYgbGlzdF92aWV3X2lkXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgbGlzdF92aWV3X2lkICsgXCIvbGlzdFwiKVxuXHRlbHNlXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2xpc3Qvc3dpdGNoXCIpXG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdFVybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCByZWNvcmRfaWQsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSkgLT5cblx0aWYgcmVsYXRlZF9maWVsZF9uYW1lXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgcmVjb3JkX2lkICsgXCIvXCIgKyByZWxhdGVkX29iamVjdF9uYW1lICsgXCIvZ3JpZD9yZWxhdGVkX2ZpZWxkX25hbWU9XCIgKyByZWxhdGVkX2ZpZWxkX25hbWUpXG5cdGVsc2Vcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyByZWNvcmRfaWQgKyBcIi9cIiArIHJlbGF0ZWRfb2JqZWN0X25hbWUgKyBcIi9ncmlkXCIpXG5cbkNyZWF0b3IuZ2V0T2JqZWN0TG9va3VwRmllbGRPcHRpb25zID0gKG9iamVjdF9uYW1lLCBpc19kZWVwLCBpc19za2lwX2hpZGUsIGlzX3JlbGF0ZWQpLT5cblx0X29wdGlvbnMgPSBbXVxuXHR1bmxlc3Mgb2JqZWN0X25hbWVcblx0XHRyZXR1cm4gX29wdGlvbnNcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRmaWVsZHMgPSBfb2JqZWN0Py5maWVsZHNcblx0aWNvbiA9IF9vYmplY3Q/Lmljb25cblx0Xy5mb3JFYWNoIGZpZWxkcywgKGYsIGspLT5cblx0XHRpZiBpc19za2lwX2hpZGUgYW5kIGYuaGlkZGVuXG5cdFx0XHRyZXR1cm5cblx0XHRpZiBmLnR5cGUgPT0gXCJzZWxlY3RcIlxuXHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IFwiI3tmLmxhYmVsIHx8IGt9XCIsIHZhbHVlOiBcIiN7a31cIiwgaWNvbjogaWNvbn1cblx0XHRlbHNlXG5cdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogZi5sYWJlbCB8fCBrLCB2YWx1ZTogaywgaWNvbjogaWNvbn1cblx0aWYgaXNfZGVlcFxuXHRcdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XG5cdFx0XHRpZiBpc19za2lwX2hpZGUgYW5kIGYuaGlkZGVuXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0aWYgKGYudHlwZSA9PSBcImxvb2t1cFwiIHx8IGYudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIikgJiYgZi5yZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhmLnJlZmVyZW5jZV90bylcblx0XHRcdFx0IyDkuI3mlK/mjIFmLnJlZmVyZW5jZV90b+S4umZ1bmN0aW9u55qE5oOF5Ya177yM5pyJ6ZyA5rGC5YaN6K+0XG5cdFx0XHRcdHJfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoZi5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdGlmIHJfb2JqZWN0XG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJfb2JqZWN0LmZpZWxkcywgKGYyLCBrMiktPlxuXHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IFwiI3tmLmxhYmVsIHx8IGt9PT4je2YyLmxhYmVsIHx8IGsyfVwiLCB2YWx1ZTogXCIje2t9LiN7azJ9XCIsIGljb246IHJfb2JqZWN0Py5pY29ufVxuXHRpZiBpc19yZWxhdGVkXG5cdFx0cmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKVxuXHRcdF8uZWFjaCByZWxhdGVkT2JqZWN0cywgKF9yZWxhdGVkT2JqZWN0KT0+XG5cdFx0XHRyZWxhdGVkT3B0aW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0TG9va3VwRmllbGRPcHRpb25zKF9yZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lLCBmYWxzZSwgZmFsc2UsIGZhbHNlKVxuXHRcdFx0cmVsYXRlZE9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9yZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lKVxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRPcHRpb25zLCAocmVsYXRlZE9wdGlvbiktPlxuXHRcdFx0XHRpZiBfcmVsYXRlZE9iamVjdC5mb3JlaWduX2tleSAhPSByZWxhdGVkT3B0aW9uLnZhbHVlXG5cdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IFwiI3tyZWxhdGVkT2JqZWN0LmxhYmVsIHx8IHJlbGF0ZWRPYmplY3QubmFtZX09PiN7cmVsYXRlZE9wdGlvbi5sYWJlbH1cIiwgdmFsdWU6IFwiI3tyZWxhdGVkT2JqZWN0Lm5hbWV9LiN7cmVsYXRlZE9wdGlvbi52YWx1ZX1cIiwgaWNvbjogcmVsYXRlZE9iamVjdD8uaWNvbn1cblx0cmV0dXJuIF9vcHRpb25zXG5cbiMg57uf5LiA5Li65a+56LGhb2JqZWN0X25hbWXmj5Dkvpvlj6/nlKjkuo7ov4fomZHlmajov4fomZHlrZfmrrVcbkNyZWF0b3IuZ2V0T2JqZWN0RmlsdGVyRmllbGRPcHRpb25zID0gKG9iamVjdF9uYW1lKS0+XG5cdF9vcHRpb25zID0gW11cblx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIF9vcHRpb25zXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0ZmllbGRzID0gX29iamVjdD8uZmllbGRzXG5cdHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpXG5cdGljb24gPSBfb2JqZWN0Py5pY29uXG5cdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XG5cdFx0IyBoaWRkZW4sZ3JpZOetieexu+Wei+eahOWtl+aute+8jOS4jemcgOimgei/h+a7pFxuXHRcdGlmICFfLmluY2x1ZGUoW1wiZ3JpZFwiLFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiLCBcImF2YXRhclwiLCBcImltYWdlXCIsIFwibWFya2Rvd25cIiwgXCJodG1sXCJdLCBmLnR5cGUpIGFuZCAhZi5oaWRkZW5cblx0XHRcdCMgZmlsdGVycy4kLmZpZWxk5Y+KZmxvdy5jdXJyZW50562J5a2Q5a2X5q615Lmf5LiN6ZyA6KaB6L+H5rukXG5cdFx0XHRpZiAhL1xcdytcXC4vLnRlc3QoaykgYW5kIF8uaW5kZXhPZihwZXJtaXNzaW9uX2ZpZWxkcywgaykgPiAtMVxuXHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogZi5sYWJlbCB8fCBrLCB2YWx1ZTogaywgaWNvbjogaWNvbn1cblxuXHRyZXR1cm4gX29wdGlvbnNcblxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZE9wdGlvbnMgPSAob2JqZWN0X25hbWUpLT5cblx0X29wdGlvbnMgPSBbXVxuXHR1bmxlc3Mgb2JqZWN0X25hbWVcblx0XHRyZXR1cm4gX29wdGlvbnNcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRmaWVsZHMgPSBfb2JqZWN0Py5maWVsZHNcblx0cGVybWlzc2lvbl9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhvYmplY3RfbmFtZSlcblx0aWNvbiA9IF9vYmplY3Q/Lmljb25cblx0Xy5mb3JFYWNoIGZpZWxkcywgKGYsIGspLT5cblx0XHRpZiAhXy5pbmNsdWRlKFtcImdyaWRcIixcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSlcblx0XHRcdGlmICEvXFx3K1xcLi8udGVzdChrKSBhbmQgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xXG5cdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBmLmxhYmVsIHx8IGssIHZhbHVlOiBrLCBpY29uOiBpY29ufVxuXHRyZXR1cm4gX29wdGlvbnNcblxuIyMjXG5maWx0ZXJzOiDopoHovazmjaLnmoRmaWx0ZXJzXG5maWVsZHM6IOWvueixoeWtl+autVxuZmlsdGVyX2ZpZWxkczog6buY6K6k6L+H5ruk5a2X5q6177yM5pSv5oyB5a2X56ym5Liy5pWw57uE5ZKM5a+56LGh5pWw57uE5Lik56eN5qC85byP77yM5aaCOlsnZmlsZWRfbmFtZTEnLCdmaWxlZF9uYW1lMiddLFt7ZmllbGQ6J2ZpbGVkX25hbWUxJyxyZXF1aXJlZDp0cnVlfV1cbuWkhOeQhumAu+i+kTog5oqKZmlsdGVyc+S4reWtmOWcqOS6jmZpbHRlcl9maWVsZHPnmoTov4fmu6TmnaHku7blop7liqDmr4/pobnnmoRpc19kZWZhdWx044CBaXNfcmVxdWlyZWTlsZ7mgKfvvIzkuI3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25a+55bqU55qE56e76Zmk5q+P6aG555qE55u45YWz5bGe5oCnXG7ov5Tlm57nu5Pmnpw6IOWkhOeQhuWQjueahGZpbHRlcnNcbiMjI1xuQ3JlYXRvci5nZXRGaWx0ZXJzV2l0aEZpbHRlckZpZWxkcyA9IChmaWx0ZXJzLCBmaWVsZHMsIGZpbHRlcl9maWVsZHMpLT5cblx0dW5sZXNzIGZpbHRlcnNcblx0XHRmaWx0ZXJzID0gW11cblx0dW5sZXNzIGZpbHRlcl9maWVsZHNcblx0XHRmaWx0ZXJfZmllbGRzID0gW11cblx0aWYgZmlsdGVyX2ZpZWxkcz8ubGVuZ3RoXG5cdFx0ZmlsdGVyX2ZpZWxkcy5mb3JFYWNoIChuKS0+XG5cdFx0XHRpZiBfLmlzU3RyaW5nKG4pXG5cdFx0XHRcdG4gPSBcblx0XHRcdFx0XHRmaWVsZDogbixcblx0XHRcdFx0XHRyZXF1aXJlZDogZmFsc2Vcblx0XHRcdGlmIGZpZWxkc1tuLmZpZWxkXSBhbmQgIV8uZmluZFdoZXJlKGZpbHRlcnMse2ZpZWxkOm4uZmllbGR9KVxuXHRcdFx0XHRmaWx0ZXJzLnB1c2hcblx0XHRcdFx0XHRmaWVsZDogbi5maWVsZCxcblx0XHRcdFx0XHRpc19kZWZhdWx0OiB0cnVlLFxuXHRcdFx0XHRcdGlzX3JlcXVpcmVkOiBuLnJlcXVpcmVkXG5cdGZpbHRlcnMuZm9yRWFjaCAoZmlsdGVySXRlbSktPlxuXHRcdG1hdGNoRmllbGQgPSBmaWx0ZXJfZmllbGRzLmZpbmQgKG4pLT4gcmV0dXJuIG4gPT0gZmlsdGVySXRlbS5maWVsZCBvciBuLmZpZWxkID09IGZpbHRlckl0ZW0uZmllbGRcblx0XHRpZiBfLmlzU3RyaW5nKG1hdGNoRmllbGQpXG5cdFx0XHRtYXRjaEZpZWxkID0gXG5cdFx0XHRcdGZpZWxkOiBtYXRjaEZpZWxkLFxuXHRcdFx0XHRyZXF1aXJlZDogZmFsc2Vcblx0XHRpZiBtYXRjaEZpZWxkXG5cdFx0XHRmaWx0ZXJJdGVtLmlzX2RlZmF1bHQgPSB0cnVlXG5cdFx0XHRmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkID0gbWF0Y2hGaWVsZC5yZXF1aXJlZFxuXHRcdGVsc2Vcblx0XHRcdGRlbGV0ZSBmaWx0ZXJJdGVtLmlzX2RlZmF1bHRcblx0XHRcdGRlbGV0ZSBmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkXG5cdHJldHVybiBmaWx0ZXJzXG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZCktPlxuXG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGlmICFyZWNvcmRfaWRcblx0XHRyZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiBvYmplY3RfbmFtZSA9PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpICYmICByZWNvcmRfaWQgPT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcblx0XHRcdGlmIFRlbXBsYXRlLmluc3RhbmNlKCk/LnJlY29yZFxuXHRcdFx0XHRyZXR1cm4gVGVtcGxhdGUuaW5zdGFuY2UoKT8ucmVjb3JkPy5nZXQoKVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpXG5cblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0aWYgb2JqLmRhdGFiYXNlX25hbWUgPT0gXCJtZXRlb3JcIiB8fCAhb2JqLmRhdGFiYXNlX25hbWVcblx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxuXHRcdGlmIGNvbGxlY3Rpb25cblx0XHRcdHJlY29yZCA9IGNvbGxlY3Rpb24uZmluZE9uZShyZWNvcmRfaWQpXG5cdFx0XHRyZXR1cm4gcmVjb3JkXG5cdGVsc2UgaWYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkXG5cdFx0cmV0dXJuIENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZClcblxuQ3JlYXRvci5nZXRPYmplY3RSZWNvcmROYW1lID0gKHJlY29yZCwgb2JqZWN0X25hbWUpLT5cblx0dW5sZXNzIHJlY29yZFxuXHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKClcblx0aWYgcmVjb3JkXG5cdFx0IyDmmL7npLrnu4Tnu4fliJfooajml7bvvIznibnmrorlpITnkIZuYW1lX2ZpZWxkX2tleeS4um5hbWXlrZfmrrVcblx0XHRuYW1lX2ZpZWxkX2tleSA9IGlmIG9iamVjdF9uYW1lID09IFwib3JnYW5pemF0aW9uc1wiIHRoZW4gXCJuYW1lXCIgZWxzZSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk/Lk5BTUVfRklFTERfS0VZXG5cdFx0aWYgcmVjb3JkIGFuZCBuYW1lX2ZpZWxkX2tleVxuXHRcdFx0cmV0dXJuIHJlY29yZC5sYWJlbCB8fCByZWNvcmRbbmFtZV9maWVsZF9rZXldXG5cbkNyZWF0b3IuZ2V0QXBwID0gKGFwcF9pZCktPlxuXHRhcHBNZW51cyA9IFNlc3Npb24uZ2V0KFwiX2FwcF9tZW51c1wiKSB8fCBTZXNzaW9uLmdldChcImFwcF9tZW51c1wiKTtcblx0dW5sZXNzIGFwcE1lbnVzXG5cdFx0cmV0dXJuIHt9XG5cdGN1cnJlbnRBcHAgPSBhcHBNZW51cy5maW5kIChtZW51SXRlbSkgLT5cblx0XHRyZXR1cm4gbWVudUl0ZW0uaWQgPT0gYXBwX2lkXG5cdHJldHVybiBjdXJyZW50QXBwXG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkID0gKGFwcF9pZCktPlxuXHRhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpXG5cdGlmICFhcHBcblx0XHRyZXR1cm5cblx0ZGFzaGJvYXJkID0gbnVsbFxuXHRfLmVhY2ggQ3JlYXRvci5EYXNoYm9hcmRzLCAodiwgayktPlxuXHRcdGlmIHYuYXBwcz8uaW5kZXhPZihhcHAuX2lkKSA+IC0xXG5cdFx0XHRkYXNoYm9hcmQgPSB2O1xuXHRyZXR1cm4gZGFzaGJvYXJkO1xuXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZENvbXBvbmVudCA9IChhcHBfaWQpLT5cblx0YXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKVxuXHRpZiAhYXBwIHx8IHRydWVcblx0XHRyZXR1cm5cblx0IyByZXR1cm4gQnVpbGRlckNyZWF0b3IucGx1Z2luQ29tcG9uZW50U2VsZWN0b3IoQnVpbGRlckNyZWF0b3Iuc3RvcmUuZ2V0U3RhdGUoKSwgXCJEYXNoYm9hcmRcIiwgYXBwLl9pZCk7XG5cbkNyZWF0b3IuZ2V0QXBwT2JqZWN0TmFtZXMgPSAoYXBwX2lkKS0+XG5cdGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZClcblx0aWYgIWFwcFxuXHRcdHJldHVyblxuXHRpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRhcHBPYmplY3RzID0gaWYgaXNNb2JpbGUgdGhlbiBhcHAubW9iaWxlX29iamVjdHMgZWxzZSBhcHAub2JqZWN0c1xuXHRvYmplY3RzID0gW11cblx0aWYgYXBwXG5cdFx0Xy5lYWNoIGFwcE9iamVjdHMsICh2KS0+XG5cdFx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdCh2KVxuXHRcdFx0aWYgb2JqPy5wZXJtaXNzaW9ucy5nZXQoKS5hbGxvd1JlYWRcblx0XHRcdFx0b2JqZWN0cy5wdXNoIHZcblx0cmV0dXJuIG9iamVjdHNcblxuQ3JlYXRvci5nZXRVcmxXaXRoVG9rZW4gPSAodXJsLCBleHByZXNzaW9uRm9ybURhdGEpIC0+XG5cdCMg57uZdXJs5pe25ou85o6l5b2T5YmN55So5oi3dG9rZW7nm7jlhbPkv6Hmga/nlKjkuo7nmbvlvZXpqozor4HvvIzmlK/mjIHphY3nva7ooajovr7lvI9cblx0cGFyYW1zID0ge307XG5cdHBhcmFtc1tcIlgtU3BhY2UtSWRcIl0gPSBTdGVlZG9zLnNwYWNlSWQoKVxuXHRwYXJhbXNbXCJYLVVzZXItSWRcIl0gPSBTdGVlZG9zLnVzZXJJZCgpO1xuXHRwYXJhbXNbXCJYLUNvbXBhbnktSWRzXCJdID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpO1xuXHRwYXJhbXNbXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuXHRpZiBTdGVlZG9zLmlzRXhwcmVzc2lvbih1cmwpXG5cdFx0dXJsID0gU3RlZWRvcy5wYXJzZVNpbmdsZUV4cHJlc3Npb24odXJsLCBleHByZXNzaW9uRm9ybURhdGEsIFwiI1wiLCBDcmVhdG9yLlVTRVJfQ09OVEVYVClcblx0IyDlpJbpg6jpk77mjqXlnLDlnYDkuK3lj6/og73kvJrluKbmnIkj5Y+377yM5q+U5aaCL2J1aWxkZXIvP3BfaWRzPTYxOTM4MzU0NWIyZTlhNzJlYzA1NThiMyMvcGFnZS9wdWJsaWMvdGVzdFxuXHQjIOatpOaXtnVybOS4reW3sue7j+WcqCPlj7fliY3pnaLlh7rnjrDkuobkuIDkuKo/5Y+377yM6L+Z5Liq6Zeu5Y+35LiN5Y+v5Lul6KKr6K+G5Yir5Li6dXJs5Y+C5pWw77yM5Y+q5pyJI+WPt+WQjumdoueahD/lj7fmiY3lupTor6Xooqvor4bliKvkuLp1cmzlj4LmlbBcblx0aGFzUXVlcnlTeW1ib2wgPSAvKFxcIy4rXFw/KXwoXFw/W14jXSokKS9nLnRlc3QodXJsKVxuXHRsaW5rU3RyID0gaWYgaGFzUXVlcnlTeW1ib2wgdGhlbiBcIiZcIiBlbHNlIFwiP1wiXG5cdHJldHVybiBcIiN7dXJsfSN7bGlua1N0cn0jeyQucGFyYW0ocGFyYW1zKX1cIlxuXG5DcmVhdG9yLmdldEFwcE1lbnUgPSAoYXBwX2lkLCBtZW51X2lkKS0+XG5cdG1lbnVzID0gQ3JlYXRvci5nZXRBcHBNZW51cyhhcHBfaWQpXG5cdHJldHVybiBtZW51cyAmJiBtZW51cy5maW5kIChtZW51KS0+IHJldHVybiBtZW51LmlkID09IG1lbnVfaWRcblxuQ3JlYXRvci5nZXRBcHBNZW51VXJsRm9ySW50ZXJuZXQgPSAobWVudSktPlxuXHQjIOW9k3RhYnPnsbvlnovkuLp1cmzml7bvvIzmjInlpJbpg6jpk77mjqXlpITnkIbvvIzmlK/mjIHphY3nva7ooajovr7lvI/lubbliqDkuIrnu5/kuIDnmoR1cmzlj4LmlbBcblx0cmV0dXJuIENyZWF0b3IuZ2V0VXJsV2l0aFRva2VuIG1lbnUucGF0aCwgbWVudVxuXG5DcmVhdG9yLmdldEFwcE1lbnVVcmwgPSAobWVudSktPlxuXHR1cmwgPSBtZW51LnBhdGhcblx0aWYgbWVudS50eXBlID09IFwidXJsXCJcblx0XHRpZiBtZW51LnRhcmdldFxuXHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0QXBwTWVudVVybEZvckludGVybmV0KG1lbnUpXG5cdFx0ZWxzZVxuXHRcdFx0IyDlnKhpZnJhbWXkuK3mmL7npLp1cmznlYzpnaJcblx0XHRcdHJldHVybiBcIi9hcHAvLS90YWJfaWZyYW1lLyN7bWVudS5pZH1cIlxuXHRlbHNlXG5cdFx0cmV0dXJuIG1lbnUucGF0aFxuXG5DcmVhdG9yLmdldEFwcE1lbnVzID0gKGFwcF9pZCktPlxuXHRhcHBNZW51cyA9IFNlc3Npb24uZ2V0KFwiX2FwcF9tZW51c1wiKSB8fCBTZXNzaW9uLmdldChcImFwcF9tZW51c1wiKTtcblx0dW5sZXNzIGFwcE1lbnVzXG5cdFx0cmV0dXJuIFtdXG5cdGN1cmVudEFwcE1lbnVzID0gYXBwTWVudXMuZmluZCAobWVudUl0ZW0pIC0+XG5cdFx0cmV0dXJuIG1lbnVJdGVtLmlkID09IGFwcF9pZFxuXHRpZiBjdXJlbnRBcHBNZW51c1xuXHRcdHJldHVybiBjdXJlbnRBcHBNZW51cy5jaGlsZHJlblxuXG5DcmVhdG9yLmxvYWRBcHBzTWVudXMgPSAoKS0+XG5cdGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpXG5cdGRhdGEgPSB7IH1cblx0aWYgaXNNb2JpbGVcblx0XHRkYXRhLm1vYmlsZSA9IGlzTW9iaWxlXG5cdG9wdGlvbnMgPSB7IFxuXHRcdHR5cGU6ICdnZXQnLCBcblx0XHRkYXRhOiBkYXRhLCBcblx0XHRzdWNjZXNzOiAoZGF0YSktPlxuXHRcdFx0U2Vzc2lvbi5zZXQoXCJhcHBfbWVudXNcIiwgZGF0YSk7XG5cdCB9XG5cdFN0ZWVkb3M/LmF1dGhSZXF1ZXN0IFwiL3NlcnZpY2UvYXBpL2FwcHMvbWVudXNcIiwgb3B0aW9uc1xuXG5DcmVhdG9yLmNyZWF0b3JBcHBzU2VsZWN0b3IgPSAoYXBwcywgYXNzaWduZWRfYXBwcykgLT5cblx0YWRtaW5BcHAgPSB1bmRlZmluZWRcblx0c29ydGVkQXBwcyA9IHVuZGVmaW5lZFxuXHRfLmVhY2ggYXBwcywgKGFwcCwga2V5KSAtPlxuXHRcdGlmICFhcHAuX2lkXG5cdFx0XHRhcHAuX2lkID0ga2V5XG5cdFx0aWYgYXBwLmlzX2NyZWF0b3Jcblx0XHRcdCMg5LiN6ZyA6KaBaXNTcGFjZUFkbWlu6YC76L6RXG5cdFx0XHQjIGlmIChpc1NwYWNlQWRtaW4pIHtcblx0XHRcdCNcdFx0IGFwcC52aXNpYmxlID0gdHJ1ZTtcblx0XHRcdCMgfVxuXHRcdGVsc2Vcblx0XHRcdCMg6Z2eY3JlYXRvcuW6lOivpeS4gOW+i+S4jeaYvuekulxuXHRcdFx0YXBwLnZpc2libGUgPSBmYWxzZVxuXHRcdHJldHVyblxuXHRzb3J0ZWRBcHBzID0gXy5zb3J0QnkoXy52YWx1ZXMoYXBwcyksICdzb3J0Jylcblx0Y3JlYXRvckFwcHMgPSB7fVxuXHRhZG1pbkFwcCA9IHt9XG5cdCMg5oyJ6ZKuc29ydOaOkuW6j+asoeW6j+iuvue9rkNyZWF0b3IuQXBwc+WAvFxuXHRfLmVhY2ggc29ydGVkQXBwcywgKG4pIC0+XG5cdFx0aWYgbi5faWQgPT0gJ2FkbWluJ1xuXHRcdFx0YWRtaW5BcHAgPSBuXG5cdFx0ZWxzZVxuXHRcdFx0Y3JlYXRvckFwcHNbbi5faWRdID0gblxuXHQjIGFkbWlu6I+c5Y2V5pi+56S65Zyo5pyA5ZCOXG5cdGNyZWF0b3JBcHBzLmFkbWluID0gYWRtaW5BcHBcblx0aWYgYXNzaWduZWRfYXBwcy5sZW5ndGhcblx0XHRfLmVhY2ggY3JlYXRvckFwcHMsIChhcHAsIGtleSkgLT5cblx0XHRcdGlmIGFzc2lnbmVkX2FwcHMuaW5kZXhPZihrZXkpID4gLTFcblx0XHRcdFx0YXBwLnZpc2libGUgPSBhcHAuaXNfY3JlYXRvclxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRhcHAudmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRyZXR1cm5cblx0Y3JlYXRvckFwcHNcblxuQ3JlYXRvci52aXNpYmxlQXBwc1NlbGVjdG9yID0gKGNyZWF0b3JBcHBzLCBpbmNsdWRlQWRtaW4gPSB0cnVlKSAtPlxuXHRhcHBzID0gW11cblx0Xy5lYWNoIGNyZWF0b3JBcHBzLCAodiwgaykgLT5cblx0XHRpZiB2LnZpc2libGUgIT0gZmFsc2UgYW5kIHYuX2lkICE9ICdhZG1pbicgb3IgaW5jbHVkZUFkbWluIGFuZCB2Ll9pZCA9PSAnYWRtaW4nXG5cdFx0XHRhcHBzLnB1c2ggdlxuXHRcdHJldHVyblxuXHRhcHBzXG5cbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHMgPSAoaW5jbHVkZUFkbWluKS0+XG5cdGNoYW5nZUFwcCA9IENyZWF0b3IuX3N1YkFwcC5nZXQoKTtcblx0Y3JlYXRvckFwcHMgPSBPYmplY3QuYXNzaWduKHt9LCBDcmVhdG9yLkFwcHMsIHthcHBzOiBjaGFuZ2VBcHB9KTtcblx0cmV0dXJuIENyZWF0b3IudmlzaWJsZUFwcHNTZWxlY3RvcihjcmVhdG9yQXBwcywgaW5jbHVkZUFkbWluKVxuXG5DcmVhdG9yLmdldFZpc2libGVBcHBzT2JqZWN0cyA9ICgpLT5cblx0YXBwcyA9IENyZWF0b3IuZ2V0VmlzaWJsZUFwcHMoKVxuXHR2aXNpYmxlT2JqZWN0TmFtZXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhhcHBzLCdvYmplY3RzJykpXG5cdG9iamVjdHMgPSBfLmZpbHRlciBDcmVhdG9yLk9iamVjdHMsIChvYmopLT5cblx0XHRpZiB2aXNpYmxlT2JqZWN0TmFtZXMuaW5kZXhPZihvYmoubmFtZSkgPCAwXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXHRvYmplY3RzID0gb2JqZWN0cy5zb3J0KENyZWF0b3Iuc29ydGluZ01ldGhvZC5iaW5kKHtrZXk6XCJsYWJlbFwifSkpXG5cdG9iamVjdHMgPSBfLnBsdWNrKG9iamVjdHMsJ25hbWUnKVxuXHRyZXR1cm4gXy51bmlxIG9iamVjdHNcblxuQ3JlYXRvci5nZXRBcHBzT2JqZWN0cyA9ICgpLT5cblx0b2JqZWN0cyA9IFtdXG5cdHRlbXBPYmplY3RzID0gW11cblx0Xy5mb3JFYWNoIENyZWF0b3IuQXBwcywgKGFwcCktPlxuXHRcdHRlbXBPYmplY3RzID0gXy5maWx0ZXIgYXBwLm9iamVjdHMsIChvYmopLT5cblx0XHRcdHJldHVybiAhb2JqLmhpZGRlblxuXHRcdG9iamVjdHMgPSBvYmplY3RzLmNvbmNhdCh0ZW1wT2JqZWN0cylcblx0cmV0dXJuIF8udW5pcSBvYmplY3RzXG5cbkNyZWF0b3IudmFsaWRhdGVGaWx0ZXJzID0gKGZpbHRlcnMsIGxvZ2ljKS0+XG5cdGZpbHRlcl9pdGVtcyA9IF8ubWFwIGZpbHRlcnMsIChvYmopIC0+XG5cdFx0aWYgXy5pc0VtcHR5KG9iailcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBvYmpcblx0ZmlsdGVyX2l0ZW1zID0gXy5jb21wYWN0KGZpbHRlcl9pdGVtcylcblx0ZXJyb3JNc2cgPSBcIlwiXG5cdGZpbHRlcl9sZW5ndGggPSBmaWx0ZXJfaXRlbXMubGVuZ3RoXG5cdGlmIGxvZ2ljXG5cdFx0IyDmoLzlvI/ljJZmaWx0ZXJcblx0XHRsb2dpYyA9IGxvZ2ljLnJlcGxhY2UoL1xcbi9nLCBcIlwiKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKVxuXG5cdFx0IyDliKTmlq3nibnmrorlrZfnrKZcblx0XHRpZiAvWy5fXFwtIStdKy9pZy50ZXN0KGxvZ2ljKVxuXHRcdFx0ZXJyb3JNc2cgPSBcIuWQq+acieeJueauiuWtl+espuOAglwiXG5cblx0XHRpZiAhZXJyb3JNc2dcblx0XHRcdGluZGV4ID0gbG9naWMubWF0Y2goL1xcZCsvaWcpXG5cdFx0XHRpZiAhaW5kZXhcblx0XHRcdFx0ZXJyb3JNc2cgPSBcIuacieS6m+etm+mAieadoeS7tui/m+ihjOS6huWumuS5ie+8jOS9huacquWcqOmrmOe6p+etm+mAieadoeS7tuS4reiiq+W8leeUqOOAglwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGluZGV4LmZvckVhY2ggKGkpLT5cblx0XHRcdFx0XHRpZiBpIDwgMSBvciBpID4gZmlsdGVyX2xlbmd0aFxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieadoeS7tuW8leeUqOS6huacquWumuS5ieeahOetm+mAieWZqO+8miN7aX3jgIJcIlxuXG5cdFx0XHRcdGZsYWcgPSAxXG5cdFx0XHRcdHdoaWxlIGZsYWcgPD0gZmlsdGVyX2xlbmd0aFxuXHRcdFx0XHRcdGlmICFpbmRleC5pbmNsdWRlcyhcIiN7ZmxhZ31cIilcblx0XHRcdFx0XHRcdGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIlxuXHRcdFx0XHRcdGZsYWcrKztcblxuXHRcdGlmICFlcnJvck1zZ1xuXHRcdFx0IyDliKTmlq3mmK/lkKbmnInpnZ7ms5Xoi7HmloflrZfnrKZcblx0XHRcdHdvcmQgPSBsb2dpYy5tYXRjaCgvW2EtekEtWl0rL2lnKVxuXHRcdFx0aWYgd29yZFxuXHRcdFx0XHR3b3JkLmZvckVhY2ggKHcpLT5cblx0XHRcdFx0XHRpZiAhL14oYW5kfG9yKSQvaWcudGVzdCh3KVxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBcIuajgOafpeaCqOeahOmrmOe6p+etm+mAieadoeS7tuS4reeahOaLvOWGmeOAglwiXG5cblx0XHRpZiAhZXJyb3JNc2dcblx0XHRcdCMg5Yik5pat5qC85byP5piv5ZCm5q2j56GuXG5cdFx0XHR0cnlcblx0XHRcdFx0Q3JlYXRvci5ldmFsKGxvZ2ljLnJlcGxhY2UoL2FuZC9pZywgXCImJlwiKS5yZXBsYWNlKC9vci9pZywgXCJ8fFwiKSlcblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0ZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOS4reWQq+acieeJueauiuWtl+esplwiXG5cblx0XHRcdGlmIC8oQU5EKVteKCldKyhPUikvaWcudGVzdChsb2dpYykgfHwgIC8oT1IpW14oKV0rKEFORCkvaWcudGVzdChsb2dpYylcblx0XHRcdFx0ZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOW/hemhu+WcqOi/nue7reaAp+eahCBBTkQg5ZKMIE9SIOihqOi+vuW8j+WJjeWQjuS9v+eUqOaLrOWPt+OAglwiXG5cdGlmIGVycm9yTXNnXG5cdFx0Y29uc29sZS5sb2cgXCJlcnJvclwiLCBlcnJvck1zZ1xuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0dG9hc3RyLmVycm9yKGVycm9yTXNnKVxuXHRcdHJldHVybiBmYWxzZVxuXHRlbHNlXG5cdFx0cmV0dXJuIHRydWVcblxuIyBcIj1cIiwgXCI8PlwiLCBcIj5cIiwgXCI+PVwiLCBcIjxcIiwgXCI8PVwiLCBcInN0YXJ0c3dpdGhcIiwgXCJjb250YWluc1wiLCBcIm5vdGNvbnRhaW5zXCIuXG4jIyNcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4jIyNcbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvTW9uZ28gPSAoZmlsdGVycywgb3B0aW9ucyktPlxuXHR1bmxlc3MgZmlsdGVycz8ubGVuZ3RoXG5cdFx0cmV0dXJuXG5cdCMg5b2TZmlsdGVyc+S4jeaYr1tBcnJheV3nsbvlnovogIzmmK9bT2JqZWN0Xeexu+Wei+aXtu+8jOi/m+ihjOagvOW8j+i9rOaNolxuXHR1bmxlc3MgZmlsdGVyc1swXSBpbnN0YW5jZW9mIEFycmF5XG5cdFx0ZmlsdGVycyA9IF8ubWFwIGZpbHRlcnMsIChvYmopLT5cblx0XHRcdHJldHVybiBbb2JqLmZpZWxkLCBvYmoub3BlcmF0aW9uLCBvYmoudmFsdWVdXG5cdHNlbGVjdG9yID0gW11cblx0Xy5lYWNoIGZpbHRlcnMsIChmaWx0ZXIpLT5cblx0XHRmaWVsZCA9IGZpbHRlclswXVxuXHRcdG9wdGlvbiA9IGZpbHRlclsxXVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0pXG5cdFx0ZWxzZVxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIG51bGwsIG9wdGlvbnMpXG5cdFx0c3ViX3NlbGVjdG9yID0ge31cblx0XHRzdWJfc2VsZWN0b3JbZmllbGRdID0ge31cblx0XHRpZiBvcHRpb24gPT0gXCI9XCJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZXFcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPD5cIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRuZVwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI+XCJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPj1cIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndGVcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPFwiXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGx0XCJdID0gdmFsdWVcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIjw9XCJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRlXCJdID0gdmFsdWVcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcInN0YXJ0c3dpdGhcIlxuXHRcdFx0cmVnID0gbmV3IFJlZ0V4cChcIl5cIiArIHZhbHVlLCBcImlcIilcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWdcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcImNvbnRhaW5zXCJcblx0XHRcdHJlZyA9IG5ldyBSZWdFeHAodmFsdWUsIFwiaVwiKVxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZ1xuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwibm90Y29udGFpbnNcIlxuXHRcdFx0cmVnID0gbmV3IFJlZ0V4cChcIl4oKD8hXCIgKyB2YWx1ZSArIFwiKS4pKiRcIiwgXCJpXCIpXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnXG5cdFx0c2VsZWN0b3IucHVzaCBzdWJfc2VsZWN0b3Jcblx0cmV0dXJuIHNlbGVjdG9yXG5cbkNyZWF0b3IuaXNCZXR3ZWVuRmlsdGVyT3BlcmF0aW9uID0gKG9wZXJhdGlvbiktPlxuXHRyZXR1cm4gb3BlcmF0aW9uID09IFwiYmV0d2VlblwiIG9yICEhQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXModHJ1ZSk/W29wZXJhdGlvbl1cblxuIyMjXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuXHRleHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4jIyNcbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvRGV2ID0gKGZpbHRlcnMsIG9iamVjdF9uYW1lLCBvcHRpb25zKS0+XG5cdHVubGVzcyBmaWx0ZXJzLmxlbmd0aFxuXHRcdHJldHVyblxuXHRpZiBvcHRpb25zPy5pc19sb2dpY19vclxuXHRcdCMg5aaC5p6caXNfbG9naWNfb3LkuLp0cnVl77yM5Li6ZmlsdGVyc+esrOS4gOWxguWFg+e0oOWinuWKoG9y6Ze06ZqUXG5cdFx0bG9naWNUZW1wRmlsdGVycyA9IFtdXG5cdFx0ZmlsdGVycy5mb3JFYWNoIChuKS0+XG5cdFx0XHRsb2dpY1RlbXBGaWx0ZXJzLnB1c2gobilcblx0XHRcdGxvZ2ljVGVtcEZpbHRlcnMucHVzaChcIm9yXCIpXG5cdFx0bG9naWNUZW1wRmlsdGVycy5wb3AoKVxuXHRcdGZpbHRlcnMgPSBsb2dpY1RlbXBGaWx0ZXJzXG5cdHNlbGVjdG9yID0gU3RlZWRvc0ZpbHRlcnMuZm9ybWF0RmlsdGVyc1RvRGV2KGZpbHRlcnMsIENyZWF0b3IuVVNFUl9DT05URVhUKVxuXHRyZXR1cm4gc2VsZWN0b3JcblxuIyMjXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuIyMjXG5DcmVhdG9yLmZvcm1hdExvZ2ljRmlsdGVyc1RvRGV2ID0gKGZpbHRlcnMsIGZpbHRlcl9sb2dpYywgb3B0aW9ucyktPlxuXHRmb3JtYXRfbG9naWMgPSBmaWx0ZXJfbG9naWMucmVwbGFjZSgvXFwoXFxzKy9pZywgXCIoXCIpLnJlcGxhY2UoL1xccytcXCkvaWcsIFwiKVwiKS5yZXBsYWNlKC9cXCgvZywgXCJbXCIpLnJlcGxhY2UoL1xcKS9nLCBcIl1cIikucmVwbGFjZSgvXFxzKy9nLCBcIixcIikucmVwbGFjZSgvKGFuZHxvcikvaWcsIFwiJyQxJ1wiKVxuXHRmb3JtYXRfbG9naWMgPSBmb3JtYXRfbG9naWMucmVwbGFjZSgvKFxcZCkrL2lnLCAoeCktPlxuXHRcdF9mID0gZmlsdGVyc1t4LTFdXG5cdFx0ZmllbGQgPSBfZi5maWVsZFxuXHRcdG9wdGlvbiA9IF9mLm9wZXJhdGlvblxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShfZi52YWx1ZSlcblx0XHRlbHNlXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlLCBudWxsLCBvcHRpb25zKVxuXHRcdHN1Yl9zZWxlY3RvciA9IFtdXG5cdFx0aWYgXy5pc0FycmF5KHZhbHVlKSA9PSB0cnVlXG5cdFx0XHRpZiBvcHRpb24gPT0gXCI9XCJcblx0XHRcdFx0Xy5lYWNoIHZhbHVlLCAodiktPlxuXHRcdFx0XHRcdHN1Yl9zZWxlY3Rvci5wdXNoIFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiXG5cdFx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIjw+XCJcblx0XHRcdFx0Xy5lYWNoIHZhbHVlLCAodiktPlxuXHRcdFx0XHRcdHN1Yl9zZWxlY3Rvci5wdXNoIFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJhbmRcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRfLmVhY2ggdmFsdWUsICh2KS0+XG5cdFx0XHRcdFx0c3ViX3NlbGVjdG9yLnB1c2ggW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCJcblx0XHRcdGlmIHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT0gXCJhbmRcIiB8fCBzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09IFwib3JcIlxuXHRcdFx0XHRzdWJfc2VsZWN0b3IucG9wKClcblx0XHRlbHNlXG5cdFx0XHRzdWJfc2VsZWN0b3IgPSBbZmllbGQsIG9wdGlvbiwgdmFsdWVdXG5cdFx0IyBjb25zb2xlLmxvZyBcInN1Yl9zZWxlY3RvclwiLCBzdWJfc2VsZWN0b3Jcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3ViX3NlbGVjdG9yKVxuXHQpXG5cdGZvcm1hdF9sb2dpYyA9IFwiWyN7Zm9ybWF0X2xvZ2ljfV1cIlxuXHRyZXR1cm4gQ3JlYXRvci5ldmFsKGZvcm1hdF9sb2dpYylcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRpZiAhX29iamVjdFxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lc1xuXG4jXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soX29iamVjdC5yZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxuXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoX29iamVjdC5fY29sbGVjdGlvbl9uYW1lKVxuXG5cdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxuXHRpZiByZWxhdGVkX29iamVjdF9uYW1lcz8ubGVuZ3RoID09IDBcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXNcblxuXHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0dW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0c1xuXG5cdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0c1xuXHRyZXR1cm4gXy5maWx0ZXIgcmVsYXRlZF9vYmplY3RzLCAocmVsYXRlZF9vYmplY3QpLT5cblx0XHRyZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3Qub2JqZWN0X25hbWVcblx0XHRpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMVxuXHRcdCMgcmVsYXRlZF9vYmplY3RfbmFtZSA9IGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjZnNfZmlsZXNfZmlsZXJlY29yZFwiIHRoZW4gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiIGVsc2UgcmVsYXRlZF9vYmplY3RfbmFtZVxuXHRcdGFsbG93UmVhZCA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8uYWxsb3dSZWFkXG5cdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRhbGxvd1JlYWQgPSBhbGxvd1JlYWQgJiYgcGVybWlzc2lvbnMuYWxsb3dSZWFkRmlsZXNcblx0XHRyZXR1cm4gaXNBY3RpdmUgYW5kIGFsbG93UmVhZFxuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3ROYW1lcyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0cmV0dXJuIF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0TGlzdEFjdGlvbnMgPSAocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRhY3Rpb25zID0gQ3JlYXRvci5nZXRBY3Rpb25zKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XG5cdFx0aWYgYWN0aW9uLm5hbWUgPT0gXCJzdGFuZGFyZF9mb2xsb3dcIlxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0aWYgYWN0aW9uLm5hbWUgPT0gXCJzdGFuZGFyZF9xdWVyeVwiXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRpZiBhY3Rpb24ub24gPT0gXCJsaXN0XCJcblx0XHRcdGlmIHR5cGVvZiBhY3Rpb24udmlzaWJsZSA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0cmV0dXJuIGFjdGlvbi52aXNpYmxlKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIGFjdGlvbi52aXNpYmxlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdHJldHVybiBhY3Rpb25zXG5cbkNyZWF0b3IuZ2V0QWN0aW9ucyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRpZiAhb2JqXG5cdFx0cmV0dXJuXG5cblx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdGRpc2FibGVkX2FjdGlvbnMgPSBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zXG5cdGFjdGlvbnMgPSBfLnNvcnRCeShfLnZhbHVlcyhvYmouYWN0aW9ucykgLCAnc29ydCcpO1xuXG5cdGlmIF8uaGFzKG9iaiwgJ2FsbG93X2N1c3RvbUFjdGlvbnMnKVxuXHRcdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XG5cdFx0XHRyZXR1cm4gXy5pbmNsdWRlKG9iai5hbGxvd19jdXN0b21BY3Rpb25zLCBhY3Rpb24ubmFtZSkgfHwgXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLmdldE9iamVjdCgnYmFzZScpLmFjdGlvbnMpIHx8IHt9LCBhY3Rpb24ubmFtZSlcblx0aWYgXy5oYXMob2JqLCAnZXhjbHVkZV9hY3Rpb25zJylcblx0XHRhY3Rpb25zID0gXy5maWx0ZXIgYWN0aW9ucywgKGFjdGlvbiktPlxuXHRcdFx0cmV0dXJuICFfLmluY2x1ZGUob2JqLmV4Y2x1ZGVfYWN0aW9ucywgYWN0aW9uLm5hbWUpXG5cblx0Xy5lYWNoIGFjdGlvbnMsIChhY3Rpb24pLT5cblx0XHQjIOaJi+acuuS4iuWPquaYvuekuue8lui+keaMiemSru+8jOWFtuS7lueahOaUvuWIsOaKmOWPoOS4i+aLieiPnOWNleS4rVxuXHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJyZWNvcmRcIiwgXCJyZWNvcmRfb25seVwiXS5pbmRleE9mKGFjdGlvbi5vbikgPiAtMSAmJiBhY3Rpb24ubmFtZSAhPSAnc3RhbmRhcmRfZWRpdCdcblx0XHRcdGlmIGFjdGlvbi5vbiA9PSBcInJlY29yZF9vbmx5XCJcblx0XHRcdFx0YWN0aW9uLm9uID0gJ3JlY29yZF9vbmx5X21vcmUnXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGFjdGlvbi5vbiA9ICdyZWNvcmRfbW9yZSdcblxuXHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgJiYgW1wiY21zX2ZpbGVzXCIsIFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIl0uaW5kZXhPZihvYmplY3RfbmFtZSkgPiAtMVxuXHRcdCMg6ZmE5Lu254m55q6K5aSE55CG77yM5LiL6L295oyJ6ZKu5pS+5Zyo5Li76I+c5Y2V77yM57yW6L6R5oyJ6ZKu5pS+5Yiw5bqV5LiL5oqY5Y+g5LiL5ouJ6I+c5Y2V5LitXG5cdFx0YWN0aW9ucy5maW5kKChuKS0+IHJldHVybiBuLm5hbWUgPT0gXCJzdGFuZGFyZF9lZGl0XCIpPy5vbiA9IFwicmVjb3JkX21vcmVcIlxuXHRcdGFjdGlvbnMuZmluZCgobiktPiByZXR1cm4gbi5uYW1lID09IFwiZG93bmxvYWRcIik/Lm9uID0gXCJyZWNvcmRcIlxuXG5cdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XG5cdFx0cmV0dXJuIF8uaW5kZXhPZihkaXNhYmxlZF9hY3Rpb25zLCBhY3Rpb24ubmFtZSkgPCAwXG5cblx0cmV0dXJuIGFjdGlvbnNcblxuLy8vXG5cdOi/lOWbnuW9k+WJjeeUqOaIt+acieadg+mZkOiuv+mXrueahOaJgOaciWxpc3Rfdmlld++8jOWMheaLrOWIhuS6q+eahO+8jOeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahO+8iOmZpOmdnm93bmVy5Y+Y5LqG77yJ77yM5Lul5Y+K6buY6K6k55qE5YW25LuW6KeG5Zu+XG5cdOazqOaEj0NyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mmK/kuI3kvJrmnInnlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTop4blm77nmoTvvIzmiYDku6VDcmVhdG9yLmdldFBlcm1pc3Npb25z5Ye95pWw5Lit5ou/5Yiw55qE57uT5p6c5LiN5YWo77yM5bm25LiN5piv5b2T5YmN55So5oi36IO955yL5Yiw5omA5pyJ6KeG5Zu+XG4vLy9cbkNyZWF0b3IuZ2V0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdGlmICF1c2VySWRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcblx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuXG5cblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0aWYgIW9iamVjdFxuXHRcdHJldHVyblxuXG5cdGRpc2FibGVkX2xpc3Rfdmlld3MgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy5kaXNhYmxlZF9saXN0X3ZpZXdzIHx8IFtdXG5cblx0bGlzdF92aWV3cyA9IFtdXG5cblx0aXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKClcblxuXHRfLmVhY2ggb2JqZWN0Lmxpc3Rfdmlld3MsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpdGVtLm5hbWUgPSBpdGVtX25hbWVcblxuXHRsaXN0Vmlld3MgPSBfLnNvcnRCeShfLnZhbHVlcyhvYmplY3QubGlzdF92aWV3cykgLCAnc29ydF9ubycpO1xuXG5cdF8uZWFjaCBsaXN0Vmlld3MsIChpdGVtKS0+XG5cdFx0aWYgaXNNb2JpbGUgYW5kIGl0ZW0udHlwZSA9PSBcImNhbGVuZGFyXCJcblx0XHRcdCMg5omL5py65LiK5YWI5LiN5pi+56S65pel5Y6G6KeG5Zu+XG5cdFx0XHRyZXR1cm5cblx0XHRpZiBpdGVtLm5hbWUgICE9IFwiZGVmYXVsdFwiXG5cdFx0XHRpc0Rpc2FibGVkID0gXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW0ubmFtZSkgPiAtMSB8fCAoaXRlbS5faWQgJiYgXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW0uX2lkKSA+IC0xKVxuXHRcdFx0aWYgIWlzRGlzYWJsZWQgfHwgaXRlbS5vd25lciA9PSB1c2VySWRcblx0XHRcdFx0bGlzdF92aWV3cy5wdXNoIGl0ZW1cblx0cmV0dXJuIGxpc3Rfdmlld3NcblxuIyDliY3lj7DnkIborrrkuIrkuI3lupTor6XosIPnlKjor6Xlh73mlbDvvIzlm6DkuLrlrZfmrrXnmoTmnYPpmZDpg73lnKhDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZmllbGRz55qE55u45YWz5bGe5oCn5Lit5pyJ5qCH6K+G5LqGXG5DcmVhdG9yLmdldEZpZWxkcyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRmaWVsZHNOYW1lID0gQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lKG9iamVjdF9uYW1lKVxuXHR1bnJlYWRhYmxlX2ZpZWxkcyA9ICBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy51bnJlYWRhYmxlX2ZpZWxkc1xuXHRyZXR1cm4gXy5kaWZmZXJlbmNlKGZpZWxkc05hbWUsIHVucmVhZGFibGVfZmllbGRzKVxuXG5DcmVhdG9yLmlzbG9hZGluZyA9ICgpLT5cblx0cmV0dXJuICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZC5nZXQoKVxuXG5DcmVhdG9yLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpXG5cbiMg6K6h566XZmllbGRz55u45YWz5Ye95pWwXG4jIFNUQVJUXG5DcmVhdG9yLmdldERpc2FibGVkRmllbGRzID0gKHNjaGVtYSktPlxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxuXHRcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0uZGlzYWJsZWQgYW5kICFmaWVsZC5hdXRvZm9ybS5vbWl0IGFuZCBmaWVsZE5hbWVcblx0KVxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxuXHRyZXR1cm4gZmllbGRzXG5cbkNyZWF0b3IuZ2V0SGlkZGVuRmllbGRzID0gKHNjaGVtYSktPlxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxuXHRcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0udHlwZSA9PSBcImhpZGRlblwiIGFuZCAhZmllbGQuYXV0b2Zvcm0ub21pdCBhbmQgZmllbGROYW1lXG5cdClcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcblx0cmV0dXJuIGZpZWxkc1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhOb0dyb3VwID0gKHNjaGVtYSktPlxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxuXHRcdHJldHVybiAoIWZpZWxkLmF1dG9mb3JtIG9yICFmaWVsZC5hdXRvZm9ybS5ncm91cCBvciBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PSBcIi1cIikgYW5kICghZmllbGQuYXV0b2Zvcm0gb3IgZmllbGQuYXV0b2Zvcm0udHlwZSAhPSBcImhpZGRlblwiKSBhbmQgZmllbGROYW1lXG5cdClcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcblx0cmV0dXJuIGZpZWxkc1xuXG5DcmVhdG9yLmdldFNvcnRlZEZpZWxkR3JvdXBOYW1lcyA9IChzY2hlbWEpLT5cblx0bmFtZXMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCkgLT5cbiBcdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS5ncm91cCAhPSBcIi1cIiBhbmQgZmllbGQuYXV0b2Zvcm0uZ3JvdXBcblx0KVxuXHRuYW1lcyA9IF8uY29tcGFjdChuYW1lcylcblx0bmFtZXMgPSBfLnVuaXF1ZShuYW1lcylcblx0cmV0dXJuIG5hbWVzXG5cbkNyZWF0b3IuZ2V0RmllbGRzRm9yR3JvdXAgPSAoc2NoZW1hLCBncm91cE5hbWUpIC0+XG4gIFx0ZmllbGRzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQsIGZpZWxkTmFtZSkgLT5cbiAgICBcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT0gZ3JvdXBOYW1lIGFuZCBmaWVsZC5hdXRvZm9ybS50eXBlICE9IFwiaGlkZGVuXCIgYW5kIGZpZWxkTmFtZVxuICBcdClcbiAgXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxuICBcdHJldHVybiBmaWVsZHNcblxuQ3JlYXRvci5nZXRTeXN0ZW1CYXNlRmllbGRzID0gKCkgLT5cblx0cmV0dXJuIFtcImNyZWF0ZWRcIiwgXCJjcmVhdGVkX2J5XCIsIFwibW9kaWZpZWRcIiwgXCJtb2RpZmllZF9ieVwiXVxuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRTeXN0ZW1CYXNlID0gKGtleXMpIC0+XG5cdHJldHVybiBfLmRpZmZlcmVuY2Uoa2V5cywgQ3JlYXRvci5nZXRTeXN0ZW1CYXNlRmllbGRzKCkpO1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRPbWl0ID0gKHNjaGVtYSwga2V5cykgLT5cblx0a2V5cyA9IF8ubWFwKGtleXMsIChrZXkpIC0+XG5cdFx0ZmllbGQgPSBfLnBpY2soc2NoZW1hLCBrZXkpXG5cdFx0aWYgZmllbGRba2V5XS5hdXRvZm9ybT8ub21pdFxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGtleVxuXHQpXG5cdGtleXMgPSBfLmNvbXBhY3Qoa2V5cylcblx0cmV0dXJuIGtleXNcblxuQ3JlYXRvci5nZXRGaWVsZHNJbkZpcnN0TGV2ZWwgPSAoZmlyc3RMZXZlbEtleXMsIGtleXMpIC0+XG5cdGtleXMgPSBfLm1hcChrZXlzLCAoa2V5KSAtPlxuXHRcdGlmIF8uaW5kZXhPZihmaXJzdExldmVsS2V5cywga2V5KSA+IC0xXG5cdFx0XHRyZXR1cm4ga2V5XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdClcblx0a2V5cyA9IF8uY29tcGFjdChrZXlzKVxuXHRyZXR1cm4ga2V5c1xuXG5DcmVhdG9yLmdldEZpZWxkc0ZvclJlb3JkZXIgPSAoc2NoZW1hLCBrZXlzLCBpc1NpbmdsZSkgLT5cblx0ZmllbGRzID0gW11cblx0aSA9IDBcblx0X2tleXMgPSBfLmZpbHRlcihrZXlzLCAoa2V5KS0+XG5cdFx0cmV0dXJuICFrZXkuZW5kc1dpdGgoJ19lbmRMaW5lJylcblx0KTtcblx0d2hpbGUgaSA8IF9rZXlzLmxlbmd0aFxuXHRcdHNjXzEgPSBfLnBpY2soc2NoZW1hLCBfa2V5c1tpXSlcblx0XHRzY18yID0gXy5waWNrKHNjaGVtYSwgX2tleXNbaSsxXSlcblxuXHRcdGlzX3dpZGVfMSA9IGZhbHNlXG5cdFx0aXNfd2lkZV8yID0gZmFsc2VcblxuI1x0XHRpc19yYW5nZV8xID0gZmFsc2VcbiNcdFx0aXNfcmFuZ2VfMiA9IGZhbHNlXG5cblx0XHRfLmVhY2ggc2NfMSwgKHZhbHVlKSAtPlxuXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3dpZGUgfHwgdmFsdWUuYXV0b2Zvcm0/LnR5cGUgPT0gXCJ0YWJsZVwiXG5cdFx0XHRcdGlzX3dpZGVfMSA9IHRydWVcblxuI1x0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc19yYW5nZVxuI1x0XHRcdFx0aXNfcmFuZ2VfMSA9IHRydWVcblxuXHRcdF8uZWFjaCBzY18yLCAodmFsdWUpIC0+XG5cdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfd2lkZSB8fCB2YWx1ZS5hdXRvZm9ybT8udHlwZSA9PSBcInRhYmxlXCJcblx0XHRcdFx0aXNfd2lkZV8yID0gdHJ1ZVxuXG4jXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3JhbmdlXG4jXHRcdFx0XHRpc19yYW5nZV8yID0gdHJ1ZVxuXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRpc193aWRlXzEgPSB0cnVlXG5cdFx0XHRpc193aWRlXzIgPSB0cnVlXG5cblx0XHRpZiBpc1NpbmdsZVxuXHRcdFx0ZmllbGRzLnB1c2ggX2tleXMuc2xpY2UoaSwgaSsxKVxuXHRcdFx0aSArPSAxXG5cdFx0ZWxzZVxuI1x0XHRcdGlmICFpc19yYW5nZV8xICYmIGlzX3JhbmdlXzJcbiNcdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcbiNcdFx0XHRcdGNoaWxkS2V5cy5wdXNoIHVuZGVmaW5lZFxuI1x0XHRcdFx0ZmllbGRzLnB1c2ggY2hpbGRLZXlzXG4jXHRcdFx0XHRpICs9IDFcbiNcdFx0XHRlbHNlXG5cdFx0XHRpZiBpc193aWRlXzFcblx0XHRcdFx0ZmllbGRzLnB1c2ggX2tleXMuc2xpY2UoaSwgaSsxKVxuXHRcdFx0XHRpICs9IDFcblx0XHRcdGVsc2UgaWYgIWlzX3dpZGVfMSBhbmQgaXNfd2lkZV8yXG5cdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcblx0XHRcdFx0Y2hpbGRLZXlzLnB1c2ggdW5kZWZpbmVkXG5cdFx0XHRcdGZpZWxkcy5wdXNoIGNoaWxkS2V5c1xuXHRcdFx0XHRpICs9IDFcblx0XHRcdGVsc2UgaWYgIWlzX3dpZGVfMSBhbmQgIWlzX3dpZGVfMlxuXHRcdFx0XHRjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpKzEpXG5cdFx0XHRcdGlmIF9rZXlzW2krMV1cblx0XHRcdFx0XHRjaGlsZEtleXMucHVzaCBfa2V5c1tpKzFdXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcblx0XHRcdFx0ZmllbGRzLnB1c2ggY2hpbGRLZXlzXG5cdFx0XHRcdGkgKz0gMlxuXG5cdHJldHVybiBmaWVsZHNcblxuQ3JlYXRvci5pc0ZpbHRlclZhbHVlRW1wdHkgPSAodikgLT5cblx0cmV0dXJuIHR5cGVvZiB2ID09IFwidW5kZWZpbmVkXCIgfHwgdiA9PSBudWxsIHx8IE51bWJlci5pc05hTih2KSB8fCB2Lmxlbmd0aCA9PSAwXG5cbkNyZWF0b3IuZ2V0RmllbGREYXRhVHlwZSA9IChvYmplY3RGaWVsZHMsIGtleSktPlxuXHRpZiBvYmplY3RGaWVsZHMgYW5kIGtleVxuXHRcdHJlc3VsdCA9IG9iamVjdEZpZWxkc1trZXldPy50eXBlXG5cdFx0aWYgW1wiZm9ybXVsYVwiLCBcInN1bW1hcnlcIl0uaW5kZXhPZihyZXN1bHQpID4gLTFcblx0XHRcdHJlc3VsdCA9IG9iamVjdEZpZWxkc1trZXldLmRhdGFfdHlwZVxuXHRcdCMgZWxzZSBpZiByZXN1bHQgPT0gXCJzZWxlY3RcIiBhbmQgb2JqZWN0RmllbGRzW2tleV0/LmRhdGFfdHlwZSBhbmQgb2JqZWN0RmllbGRzW2tleV0uZGF0YV90eXBlICE9IFwidGV4dFwiXG5cdFx0IyBcdHJlc3VsdCA9IG9iamVjdEZpZWxkc1trZXldLmRhdGFfdHlwZVxuXHRcdHJldHVybiByZXN1bHRcblx0ZWxzZVxuXHRcdHJldHVybiBcInRleHRcIlxuXG4jIEVORFxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Q3JlYXRvci5nZXRBbGxSZWxhdGVkT2JqZWN0cyA9IChvYmplY3RfbmFtZSktPlxuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW11cblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cblx0XHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cblx0XHRcdFx0aWYgcmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWVcblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoIHJlbGF0ZWRfb2JqZWN0X25hbWVcblxuXHRcdGlmIENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKS5lbmFibGVfZmlsZXNcblx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzLnB1c2ggXCJjbXNfZmlsZXNcIlxuXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRTdGVlZG9zLmZvcm1hdEluZGV4ID0gKGFycmF5KSAtPlxuXHRcdG9iamVjdCA9IHtcbiAgICAgICAgXHRiYWNrZ3JvdW5kOiB0cnVlXG4gICAgXHR9O1xuXHRcdGlzZG9jdW1lbnREQiA9IE1ldGVvci5zZXR0aW5ncz8uZGF0YXNvdXJjZXM/LmRlZmF1bHQ/LmRvY3VtZW50REIgfHwgZmFsc2U7XG5cdFx0aWYgaXNkb2N1bWVudERCXG5cdFx0XHRpZiBhcnJheS5sZW5ndGggPiAwXG5cdFx0XHRcdGluZGV4TmFtZSA9IGFycmF5LmpvaW4oXCIuXCIpO1xuXHRcdFx0XHRvYmplY3QubmFtZSA9IGluZGV4TmFtZTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChpbmRleE5hbWUubGVuZ3RoID4gNTIpXG5cdFx0XHRcdFx0b2JqZWN0Lm5hbWUgPSBpbmRleE5hbWUuc3Vic3RyaW5nKDAsNTIpO1xuXG5cdFx0cmV0dXJuIG9iamVjdDsiLCJDcmVhdG9yLmdldFNjaGVtYSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLnNjaGVtYSA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSB7XG4gIHZhciBsaXN0X3ZpZXcsIGxpc3Rfdmlld19pZDtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpO1xuICBsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5faWQgOiB2b2lkIDA7XG4gIGlmIChyZWNvcmRfaWQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZCk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKENyZWF0b3IuZ2V0T2JqZWN0SG9tZUNvbXBvbmVudChvYmplY3RfbmFtZSkpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobGlzdF92aWV3X2lkKSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RBYnNvbHV0ZVVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkge1xuICB2YXIgbGlzdF92aWV3LCBsaXN0X3ZpZXdfaWQ7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKTtcbiAgbGlzdF92aWV3X2lkID0gbGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcuX2lkIDogdm9pZCAwO1xuICBpZiAocmVjb3JkX2lkKSB7XG4gICAgcmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQsIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkLCB0cnVlKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSb3V0ZXJVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIHtcbiAgdmFyIGxpc3RfdmlldywgbGlzdF92aWV3X2lkO1xuICBpZiAoIWFwcF9pZCkge1xuICAgIGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICB9XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgbGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbCk7XG4gIGxpc3Rfdmlld19pZCA9IGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Ll9pZCA6IHZvaWQgMDtcbiAgaWYgKHJlY29yZF9pZCkge1xuICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIHtcbiAgdmFyIHVybDtcbiAgdXJsID0gQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCk7XG4gIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKHVybCk7XG59O1xuXG5DcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIHtcbiAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkO1xufTtcblxuQ3JlYXRvci5nZXRTd2l0Y2hMaXN0VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSB7XG4gIGlmIChsaXN0X3ZpZXdfaWQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi9saXN0XCIpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9saXN0L3N3aXRjaFwiKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgcmVjb3JkX2lkLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgaWYgKHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIHJlY29yZF9pZCArIFwiL1wiICsgcmVsYXRlZF9vYmplY3RfbmFtZSArIFwiL2dyaWQ/cmVsYXRlZF9maWVsZF9uYW1lPVwiICsgcmVsYXRlZF9maWVsZF9uYW1lKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyByZWNvcmRfaWQgKyBcIi9cIiArIHJlbGF0ZWRfb2JqZWN0X25hbWUgKyBcIi9ncmlkXCIpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBpc19kZWVwLCBpc19za2lwX2hpZGUsIGlzX3JlbGF0ZWQpIHtcbiAgdmFyIF9vYmplY3QsIF9vcHRpb25zLCBmaWVsZHMsIGljb24sIHJlbGF0ZWRPYmplY3RzO1xuICBfb3B0aW9ucyA9IFtdO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIF9vcHRpb25zO1xuICB9XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZmllbGRzIDogdm9pZCAwO1xuICBpY29uID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwO1xuICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgaWYgKGlzX3NraXBfaGlkZSAmJiBmLmhpZGRlbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZi50eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgIGxhYmVsOiBcIlwiICsgKGYubGFiZWwgfHwgayksXG4gICAgICAgIHZhbHVlOiBcIlwiICsgayxcbiAgICAgICAgaWNvbjogaWNvblxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgbGFiZWw6IGYubGFiZWwgfHwgayxcbiAgICAgICAgdmFsdWU6IGssXG4gICAgICAgIGljb246IGljb25cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIGlmIChpc19kZWVwKSB7XG4gICAgXy5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZiwgaykge1xuICAgICAgdmFyIHJfb2JqZWN0O1xuICAgICAgaWYgKGlzX3NraXBfaGlkZSAmJiBmLmhpZGRlbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoKGYudHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSAmJiBmLnJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKGYucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICByX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGYucmVmZXJlbmNlX3RvKTtcbiAgICAgICAgaWYgKHJfb2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGYyLCBrMikge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgICBsYWJlbDogKGYubGFiZWwgfHwgaykgKyBcIj0+XCIgKyAoZjIubGFiZWwgfHwgazIpLFxuICAgICAgICAgICAgICB2YWx1ZTogayArIFwiLlwiICsgazIsXG4gICAgICAgICAgICAgIGljb246IHJfb2JqZWN0ICE9IG51bGwgPyByX29iamVjdC5pY29uIDogdm9pZCAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChpc19yZWxhdGVkKSB7XG4gICAgcmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKTtcbiAgICBfLmVhY2gocmVsYXRlZE9iamVjdHMsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKF9yZWxhdGVkT2JqZWN0KSB7XG4gICAgICAgIHZhciByZWxhdGVkT2JqZWN0LCByZWxhdGVkT3B0aW9ucztcbiAgICAgICAgcmVsYXRlZE9wdGlvbnMgPSBDcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyhfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSk7XG4gICAgICAgIHJldHVybiBfLmVhY2gocmVsYXRlZE9wdGlvbnMsIGZ1bmN0aW9uKHJlbGF0ZWRPcHRpb24pIHtcbiAgICAgICAgICBpZiAoX3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXkgIT09IHJlbGF0ZWRPcHRpb24udmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgbGFiZWw6IChyZWxhdGVkT2JqZWN0LmxhYmVsIHx8IHJlbGF0ZWRPYmplY3QubmFtZSkgKyBcIj0+XCIgKyByZWxhdGVkT3B0aW9uLmxhYmVsLFxuICAgICAgICAgICAgICB2YWx1ZTogcmVsYXRlZE9iamVjdC5uYW1lICsgXCIuXCIgKyByZWxhdGVkT3B0aW9uLnZhbHVlLFxuICAgICAgICAgICAgICBpY29uOiByZWxhdGVkT2JqZWN0ICE9IG51bGwgPyByZWxhdGVkT2JqZWN0Lmljb24gOiB2b2lkIDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfVxuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEZpbHRlckZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBfb3B0aW9ucywgZmllbGRzLCBpY29uLCBwZXJtaXNzaW9uX2ZpZWxkcztcbiAgX29wdGlvbnMgPSBbXTtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfb3B0aW9ucztcbiAgfVxuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgcGVybWlzc2lvbl9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhvYmplY3RfbmFtZSk7XG4gIGljb24gPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDA7XG4gIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICBpZiAoIV8uaW5jbHVkZShbXCJncmlkXCIsIFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiLCBcImF2YXRhclwiLCBcImltYWdlXCIsIFwibWFya2Rvd25cIiwgXCJodG1sXCJdLCBmLnR5cGUpICYmICFmLmhpZGRlbikge1xuICAgICAgaWYgKCEvXFx3K1xcLi8udGVzdChrKSAmJiBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiBmLmxhYmVsIHx8IGssXG4gICAgICAgICAgdmFsdWU6IGssXG4gICAgICAgICAgaWNvbjogaWNvblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBfb3B0aW9ucywgZmllbGRzLCBpY29uLCBwZXJtaXNzaW9uX2ZpZWxkcztcbiAgX29wdGlvbnMgPSBbXTtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfb3B0aW9ucztcbiAgfVxuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgcGVybWlzc2lvbl9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhvYmplY3RfbmFtZSk7XG4gIGljb24gPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDA7XG4gIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICBpZiAoIV8uaW5jbHVkZShbXCJncmlkXCIsIFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKSkge1xuICAgICAgaWYgKCEvXFx3K1xcLi8udGVzdChrKSAmJiBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiBmLmxhYmVsIHx8IGssXG4gICAgICAgICAgdmFsdWU6IGssXG4gICAgICAgICAgaWNvbjogaWNvblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5cbi8qXG5maWx0ZXJzOiDopoHovazmjaLnmoRmaWx0ZXJzXG5maWVsZHM6IOWvueixoeWtl+autVxuZmlsdGVyX2ZpZWxkczog6buY6K6k6L+H5ruk5a2X5q6177yM5pSv5oyB5a2X56ym5Liy5pWw57uE5ZKM5a+56LGh5pWw57uE5Lik56eN5qC85byP77yM5aaCOlsnZmlsZWRfbmFtZTEnLCdmaWxlZF9uYW1lMiddLFt7ZmllbGQ6J2ZpbGVkX25hbWUxJyxyZXF1aXJlZDp0cnVlfV1cbuWkhOeQhumAu+i+kTog5oqKZmlsdGVyc+S4reWtmOWcqOS6jmZpbHRlcl9maWVsZHPnmoTov4fmu6TmnaHku7blop7liqDmr4/pobnnmoRpc19kZWZhdWx044CBaXNfcmVxdWlyZWTlsZ7mgKfvvIzkuI3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25a+55bqU55qE56e76Zmk5q+P6aG555qE55u45YWz5bGe5oCnXG7ov5Tlm57nu5Pmnpw6IOWkhOeQhuWQjueahGZpbHRlcnNcbiAqL1xuXG5DcmVhdG9yLmdldEZpbHRlcnNXaXRoRmlsdGVyRmllbGRzID0gZnVuY3Rpb24oZmlsdGVycywgZmllbGRzLCBmaWx0ZXJfZmllbGRzKSB7XG4gIGlmICghZmlsdGVycykge1xuICAgIGZpbHRlcnMgPSBbXTtcbiAgfVxuICBpZiAoIWZpbHRlcl9maWVsZHMpIHtcbiAgICBmaWx0ZXJfZmllbGRzID0gW107XG4gIH1cbiAgaWYgKGZpbHRlcl9maWVsZHMgIT0gbnVsbCA/IGZpbHRlcl9maWVsZHMubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgZmlsdGVyX2ZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uKG4pIHtcbiAgICAgIGlmIChfLmlzU3RyaW5nKG4pKSB7XG4gICAgICAgIG4gPSB7XG4gICAgICAgICAgZmllbGQ6IG4sXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoZmllbGRzW24uZmllbGRdICYmICFfLmZpbmRXaGVyZShmaWx0ZXJzLCB7XG4gICAgICAgIGZpZWxkOiBuLmZpZWxkXG4gICAgICB9KSkge1xuICAgICAgICByZXR1cm4gZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICBmaWVsZDogbi5maWVsZCxcbiAgICAgICAgICBpc19kZWZhdWx0OiB0cnVlLFxuICAgICAgICAgIGlzX3JlcXVpcmVkOiBuLnJlcXVpcmVkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbihmaWx0ZXJJdGVtKSB7XG4gICAgdmFyIG1hdGNoRmllbGQ7XG4gICAgbWF0Y2hGaWVsZCA9IGZpbHRlcl9maWVsZHMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbiA9PT0gZmlsdGVySXRlbS5maWVsZCB8fCBuLmZpZWxkID09PSBmaWx0ZXJJdGVtLmZpZWxkO1xuICAgIH0pO1xuICAgIGlmIChfLmlzU3RyaW5nKG1hdGNoRmllbGQpKSB7XG4gICAgICBtYXRjaEZpZWxkID0ge1xuICAgICAgICBmaWVsZDogbWF0Y2hGaWVsZCxcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAobWF0Y2hGaWVsZCkge1xuICAgICAgZmlsdGVySXRlbS5pc19kZWZhdWx0ID0gdHJ1ZTtcbiAgICAgIHJldHVybiBmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkID0gbWF0Y2hGaWVsZC5yZXF1aXJlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGZpbHRlckl0ZW0uaXNfZGVmYXVsdDtcbiAgICAgIHJldHVybiBkZWxldGUgZmlsdGVySXRlbS5pc19yZXF1aXJlZDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmlsdGVycztcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKSB7XG4gIHZhciBjb2xsZWN0aW9uLCBvYmosIHJlY29yZCwgcmVmLCByZWYxLCByZWYyO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmICghcmVjb3JkX2lkKSB7XG4gICAgcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIik7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSAmJiByZWNvcmRfaWQgPT09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpKSB7XG4gICAgICBpZiAoKHJlZiA9IFRlbXBsYXRlLmluc3RhbmNlKCkpICE9IG51bGwgPyByZWYucmVjb3JkIDogdm9pZCAwKSB7XG4gICAgICAgIHJldHVybiAocmVmMSA9IFRlbXBsYXRlLmluc3RhbmNlKCkpICE9IG51bGwgPyAocmVmMiA9IHJlZjEucmVjb3JkKSAhPSBudWxsID8gcmVmMi5nZXQoKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZCk7XG4gICAgfVxuICB9XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKG9iai5kYXRhYmFzZV9uYW1lID09PSBcIm1ldGVvclwiIHx8ICFvYmouZGF0YWJhc2VfbmFtZSkge1xuICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpO1xuICAgIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgICByZWNvcmQgPSBjb2xsZWN0aW9uLmZpbmRPbmUocmVjb3JkX2lkKTtcbiAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgfVxuICB9IGVsc2UgaWYgKG9iamVjdF9uYW1lICYmIHJlY29yZF9pZCkge1xuICAgIHJldHVybiBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZE5hbWUgPSBmdW5jdGlvbihyZWNvcmQsIG9iamVjdF9uYW1lKSB7XG4gIHZhciBuYW1lX2ZpZWxkX2tleSwgcmVmO1xuICBpZiAoIXJlY29yZCkge1xuICAgIHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKCk7XG4gIH1cbiAgaWYgKHJlY29yZCkge1xuICAgIG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0X25hbWUgPT09IFwib3JnYW5pemF0aW9uc1wiID8gXCJuYW1lXCIgOiAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLk5BTUVfRklFTERfS0VZIDogdm9pZCAwO1xuICAgIGlmIChyZWNvcmQgJiYgbmFtZV9maWVsZF9rZXkpIHtcbiAgICAgIHJldHVybiByZWNvcmQubGFiZWwgfHwgcmVjb3JkW25hbWVfZmllbGRfa2V5XTtcbiAgICB9XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QXBwID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHBNZW51cywgY3VycmVudEFwcDtcbiAgYXBwTWVudXMgPSBTZXNzaW9uLmdldChcIl9hcHBfbWVudXNcIikgfHwgU2Vzc2lvbi5nZXQoXCJhcHBfbWVudXNcIik7XG4gIGlmICghYXBwTWVudXMpIHtcbiAgICByZXR1cm4ge307XG4gIH1cbiAgY3VycmVudEFwcCA9IGFwcE1lbnVzLmZpbmQoZnVuY3Rpb24obWVudUl0ZW0pIHtcbiAgICByZXR1cm4gbWVudUl0ZW0uaWQgPT09IGFwcF9pZDtcbiAgfSk7XG4gIHJldHVybiBjdXJyZW50QXBwO1xufTtcblxuQ3JlYXRvci5nZXRBcHBEYXNoYm9hcmQgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgdmFyIGFwcCwgZGFzaGJvYXJkO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCkge1xuICAgIHJldHVybjtcbiAgfVxuICBkYXNoYm9hcmQgPSBudWxsO1xuICBfLmVhY2goQ3JlYXRvci5EYXNoYm9hcmRzLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB2LmFwcHMpICE9IG51bGwgPyByZWYuaW5kZXhPZihhcHAuX2lkKSA6IHZvaWQgMCkgPiAtMSkge1xuICAgICAgcmV0dXJuIGRhc2hib2FyZCA9IHY7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGRhc2hib2FyZDtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkQ29tcG9uZW50ID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHA7XG4gIGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZCk7XG4gIGlmICghYXBwIHx8IHRydWUpIHtcblxuICB9XG59O1xuXG5DcmVhdG9yLmdldEFwcE9iamVjdE5hbWVzID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIGFwcE9iamVjdHMsIGlzTW9iaWxlLCBvYmplY3RzO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKTtcbiAgYXBwT2JqZWN0cyA9IGlzTW9iaWxlID8gYXBwLm1vYmlsZV9vYmplY3RzIDogYXBwLm9iamVjdHM7XG4gIG9iamVjdHMgPSBbXTtcbiAgaWYgKGFwcCkge1xuICAgIF8uZWFjaChhcHBPYmplY3RzLCBmdW5jdGlvbih2KSB7XG4gICAgICB2YXIgb2JqO1xuICAgICAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qodik7XG4gICAgICBpZiAob2JqICE9IG51bGwgPyBvYmoucGVybWlzc2lvbnMuZ2V0KCkuYWxsb3dSZWFkIDogdm9pZCAwKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RzLnB1c2godik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdHM7XG59O1xuXG5DcmVhdG9yLmdldFVybFdpdGhUb2tlbiA9IGZ1bmN0aW9uKHVybCwgZXhwcmVzc2lvbkZvcm1EYXRhKSB7XG4gIHZhciBoYXNRdWVyeVN5bWJvbCwgbGlua1N0ciwgcGFyYW1zO1xuICBwYXJhbXMgPSB7fTtcbiAgcGFyYW1zW1wiWC1TcGFjZS1JZFwiXSA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICBwYXJhbXNbXCJYLVVzZXItSWRcIl0gPSBTdGVlZG9zLnVzZXJJZCgpO1xuICBwYXJhbXNbXCJYLUNvbXBhbnktSWRzXCJdID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpO1xuICBwYXJhbXNbXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICBpZiAoU3RlZWRvcy5pc0V4cHJlc3Npb24odXJsKSkge1xuICAgIHVybCA9IFN0ZWVkb3MucGFyc2VTaW5nbGVFeHByZXNzaW9uKHVybCwgZXhwcmVzc2lvbkZvcm1EYXRhLCBcIiNcIiwgQ3JlYXRvci5VU0VSX0NPTlRFWFQpO1xuICB9XG4gIGhhc1F1ZXJ5U3ltYm9sID0gLyhcXCMuK1xcPyl8KFxcP1teI10qJCkvZy50ZXN0KHVybCk7XG4gIGxpbmtTdHIgPSBoYXNRdWVyeVN5bWJvbCA/IFwiJlwiIDogXCI/XCI7XG4gIHJldHVybiBcIlwiICsgdXJsICsgbGlua1N0ciArICgkLnBhcmFtKHBhcmFtcykpO1xufTtcblxuQ3JlYXRvci5nZXRBcHBNZW51ID0gZnVuY3Rpb24oYXBwX2lkLCBtZW51X2lkKSB7XG4gIHZhciBtZW51cztcbiAgbWVudXMgPSBDcmVhdG9yLmdldEFwcE1lbnVzKGFwcF9pZCk7XG4gIHJldHVybiBtZW51cyAmJiBtZW51cy5maW5kKGZ1bmN0aW9uKG1lbnUpIHtcbiAgICByZXR1cm4gbWVudS5pZCA9PT0gbWVudV9pZDtcbiAgfSk7XG59O1xuXG5DcmVhdG9yLmdldEFwcE1lbnVVcmxGb3JJbnRlcm5ldCA9IGZ1bmN0aW9uKG1lbnUpIHtcbiAgcmV0dXJuIENyZWF0b3IuZ2V0VXJsV2l0aFRva2VuKG1lbnUucGF0aCwgbWVudSk7XG59O1xuXG5DcmVhdG9yLmdldEFwcE1lbnVVcmwgPSBmdW5jdGlvbihtZW51KSB7XG4gIHZhciB1cmw7XG4gIHVybCA9IG1lbnUucGF0aDtcbiAgaWYgKG1lbnUudHlwZSA9PT0gXCJ1cmxcIikge1xuICAgIGlmIChtZW51LnRhcmdldCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0QXBwTWVudVVybEZvckludGVybmV0KG1lbnUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCIvYXBwLy0vdGFiX2lmcmFtZS9cIiArIG1lbnUuaWQ7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBtZW51LnBhdGg7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QXBwTWVudXMgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgdmFyIGFwcE1lbnVzLCBjdXJlbnRBcHBNZW51cztcbiAgYXBwTWVudXMgPSBTZXNzaW9uLmdldChcIl9hcHBfbWVudXNcIikgfHwgU2Vzc2lvbi5nZXQoXCJhcHBfbWVudXNcIik7XG4gIGlmICghYXBwTWVudXMpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgY3VyZW50QXBwTWVudXMgPSBhcHBNZW51cy5maW5kKGZ1bmN0aW9uKG1lbnVJdGVtKSB7XG4gICAgcmV0dXJuIG1lbnVJdGVtLmlkID09PSBhcHBfaWQ7XG4gIH0pO1xuICBpZiAoY3VyZW50QXBwTWVudXMpIHtcbiAgICByZXR1cm4gY3VyZW50QXBwTWVudXMuY2hpbGRyZW47XG4gIH1cbn07XG5cbkNyZWF0b3IubG9hZEFwcHNNZW51cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGF0YSwgaXNNb2JpbGUsIG9wdGlvbnM7XG4gIGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpO1xuICBkYXRhID0ge307XG4gIGlmIChpc01vYmlsZSkge1xuICAgIGRhdGEubW9iaWxlID0gaXNNb2JpbGU7XG4gIH1cbiAgb3B0aW9ucyA9IHtcbiAgICB0eXBlOiAnZ2V0JyxcbiAgICBkYXRhOiBkYXRhLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiBTZXNzaW9uLnNldChcImFwcF9tZW51c1wiLCBkYXRhKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB0eXBlb2YgU3RlZWRvcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBTdGVlZG9zICE9PSBudWxsID8gU3RlZWRvcy5hdXRoUmVxdWVzdChcIi9zZXJ2aWNlL2FwaS9hcHBzL21lbnVzXCIsIG9wdGlvbnMpIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5jcmVhdG9yQXBwc1NlbGVjdG9yID0gZnVuY3Rpb24oYXBwcywgYXNzaWduZWRfYXBwcykge1xuICB2YXIgYWRtaW5BcHAsIGNyZWF0b3JBcHBzLCBzb3J0ZWRBcHBzO1xuICBhZG1pbkFwcCA9IHZvaWQgMDtcbiAgc29ydGVkQXBwcyA9IHZvaWQgMDtcbiAgXy5lYWNoKGFwcHMsIGZ1bmN0aW9uKGFwcCwga2V5KSB7XG4gICAgaWYgKCFhcHAuX2lkKSB7XG4gICAgICBhcHAuX2lkID0ga2V5O1xuICAgIH1cbiAgICBpZiAoYXBwLmlzX2NyZWF0b3IpIHtcblxuICAgIH0gZWxzZSB7XG4gICAgICBhcHAudmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cbiAgfSk7XG4gIHNvcnRlZEFwcHMgPSBfLnNvcnRCeShfLnZhbHVlcyhhcHBzKSwgJ3NvcnQnKTtcbiAgY3JlYXRvckFwcHMgPSB7fTtcbiAgYWRtaW5BcHAgPSB7fTtcbiAgXy5lYWNoKHNvcnRlZEFwcHMsIGZ1bmN0aW9uKG4pIHtcbiAgICBpZiAobi5faWQgPT09ICdhZG1pbicpIHtcbiAgICAgIHJldHVybiBhZG1pbkFwcCA9IG47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjcmVhdG9yQXBwc1tuLl9pZF0gPSBuO1xuICAgIH1cbiAgfSk7XG4gIGNyZWF0b3JBcHBzLmFkbWluID0gYWRtaW5BcHA7XG4gIGlmIChhc3NpZ25lZF9hcHBzLmxlbmd0aCkge1xuICAgIF8uZWFjaChjcmVhdG9yQXBwcywgZnVuY3Rpb24oYXBwLCBrZXkpIHtcbiAgICAgIGlmIChhc3NpZ25lZF9hcHBzLmluZGV4T2Yoa2V5KSA+IC0xKSB7XG4gICAgICAgIGFwcC52aXNpYmxlID0gYXBwLmlzX2NyZWF0b3I7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcHAudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBjcmVhdG9yQXBwcztcbn07XG5cbkNyZWF0b3IudmlzaWJsZUFwcHNTZWxlY3RvciA9IGZ1bmN0aW9uKGNyZWF0b3JBcHBzLCBpbmNsdWRlQWRtaW4pIHtcbiAgdmFyIGFwcHM7XG4gIGlmIChpbmNsdWRlQWRtaW4gPT0gbnVsbCkge1xuICAgIGluY2x1ZGVBZG1pbiA9IHRydWU7XG4gIH1cbiAgYXBwcyA9IFtdO1xuICBfLmVhY2goY3JlYXRvckFwcHMsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICBpZiAodi52aXNpYmxlICE9PSBmYWxzZSAmJiB2Ll9pZCAhPT0gJ2FkbWluJyB8fCBpbmNsdWRlQWRtaW4gJiYgdi5faWQgPT09ICdhZG1pbicpIHtcbiAgICAgIGFwcHMucHVzaCh2KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYXBwcztcbn07XG5cbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHMgPSBmdW5jdGlvbihpbmNsdWRlQWRtaW4pIHtcbiAgdmFyIGNoYW5nZUFwcCwgY3JlYXRvckFwcHM7XG4gIGNoYW5nZUFwcCA9IENyZWF0b3IuX3N1YkFwcC5nZXQoKTtcbiAgY3JlYXRvckFwcHMgPSBPYmplY3QuYXNzaWduKHt9LCBDcmVhdG9yLkFwcHMsIHtcbiAgICBhcHBzOiBjaGFuZ2VBcHBcbiAgfSk7XG4gIHJldHVybiBDcmVhdG9yLnZpc2libGVBcHBzU2VsZWN0b3IoY3JlYXRvckFwcHMsIGluY2x1ZGVBZG1pbik7XG59O1xuXG5DcmVhdG9yLmdldFZpc2libGVBcHBzT2JqZWN0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXBwcywgb2JqZWN0cywgdmlzaWJsZU9iamVjdE5hbWVzO1xuICBhcHBzID0gQ3JlYXRvci5nZXRWaXNpYmxlQXBwcygpO1xuICB2aXNpYmxlT2JqZWN0TmFtZXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhhcHBzLCAnb2JqZWN0cycpKTtcbiAgb2JqZWN0cyA9IF8uZmlsdGVyKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKHZpc2libGVPYmplY3ROYW1lcy5pbmRleE9mKG9iai5uYW1lKSA8IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgb2JqZWN0cyA9IG9iamVjdHMuc29ydChDcmVhdG9yLnNvcnRpbmdNZXRob2QuYmluZCh7XG4gICAga2V5OiBcImxhYmVsXCJcbiAgfSkpO1xuICBvYmplY3RzID0gXy5wbHVjayhvYmplY3RzLCAnbmFtZScpO1xuICByZXR1cm4gXy51bmlxKG9iamVjdHMpO1xufTtcblxuQ3JlYXRvci5nZXRBcHBzT2JqZWN0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgb2JqZWN0cywgdGVtcE9iamVjdHM7XG4gIG9iamVjdHMgPSBbXTtcbiAgdGVtcE9iamVjdHMgPSBbXTtcbiAgXy5mb3JFYWNoKENyZWF0b3IuQXBwcywgZnVuY3Rpb24oYXBwKSB7XG4gICAgdGVtcE9iamVjdHMgPSBfLmZpbHRlcihhcHAub2JqZWN0cywgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gIW9iai5oaWRkZW47XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iamVjdHMgPSBvYmplY3RzLmNvbmNhdCh0ZW1wT2JqZWN0cyk7XG4gIH0pO1xuICByZXR1cm4gXy51bmlxKG9iamVjdHMpO1xufTtcblxuQ3JlYXRvci52YWxpZGF0ZUZpbHRlcnMgPSBmdW5jdGlvbihmaWx0ZXJzLCBsb2dpYykge1xuICB2YXIgZSwgZXJyb3JNc2csIGZpbHRlcl9pdGVtcywgZmlsdGVyX2xlbmd0aCwgZmxhZywgaW5kZXgsIHdvcmQ7XG4gIGZpbHRlcl9pdGVtcyA9IF8ubWFwKGZpbHRlcnMsIGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChfLmlzRW1wdHkob2JqKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgfSk7XG4gIGZpbHRlcl9pdGVtcyA9IF8uY29tcGFjdChmaWx0ZXJfaXRlbXMpO1xuICBlcnJvck1zZyA9IFwiXCI7XG4gIGZpbHRlcl9sZW5ndGggPSBmaWx0ZXJfaXRlbXMubGVuZ3RoO1xuICBpZiAobG9naWMpIHtcbiAgICBsb2dpYyA9IGxvZ2ljLnJlcGxhY2UoL1xcbi9nLCBcIlwiKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgICBpZiAoL1suX1xcLSErXSsvaWcudGVzdChsb2dpYykpIHtcbiAgICAgIGVycm9yTXNnID0gXCLlkKvmnInnibnmrorlrZfnrKbjgIJcIjtcbiAgICB9XG4gICAgaWYgKCFlcnJvck1zZykge1xuICAgICAgaW5kZXggPSBsb2dpYy5tYXRjaCgvXFxkKy9pZyk7XG4gICAgICBpZiAoIWluZGV4KSB7XG4gICAgICAgIGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZGV4LmZvckVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgIGlmIChpIDwgMSB8fCBpID4gZmlsdGVyX2xlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInmnaHku7blvJXnlKjkuobmnKrlrprkuYnnmoTnrZvpgInlmajvvJpcIiArIGkgKyBcIuOAglwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZsYWcgPSAxO1xuICAgICAgICB3aGlsZSAoZmxhZyA8PSBmaWx0ZXJfbGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFpbmRleC5pbmNsdWRlcyhcIlwiICsgZmxhZykpIHtcbiAgICAgICAgICAgIGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmxhZysrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIHdvcmQgPSBsb2dpYy5tYXRjaCgvW2EtekEtWl0rL2lnKTtcbiAgICAgIGlmICh3b3JkKSB7XG4gICAgICAgIHdvcmQuZm9yRWFjaChmdW5jdGlvbih3KSB7XG4gICAgICAgICAgaWYgKCEvXihhbmR8b3IpJC9pZy50ZXN0KHcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JNc2cgPSBcIuajgOafpeaCqOeahOmrmOe6p+etm+mAieadoeS7tuS4reeahOaLvOWGmeOAglwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIENyZWF0b3JbXCJldmFsXCJdKGxvZ2ljLnJlcGxhY2UoL2FuZC9pZywgXCImJlwiKS5yZXBsYWNlKC9vci9pZywgXCJ8fFwiKSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajkuK3lkKvmnInnibnmrorlrZfnrKZcIjtcbiAgICAgIH1cbiAgICAgIGlmICgvKEFORClbXigpXSsoT1IpL2lnLnRlc3QobG9naWMpIHx8IC8oT1IpW14oKV0rKEFORCkvaWcudGVzdChsb2dpYykpIHtcbiAgICAgICAgZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOW/hemhu+WcqOi/nue7reaAp+eahCBBTkQg5ZKMIE9SIOihqOi+vuW8j+WJjeWQjuS9v+eUqOaLrOWPt+OAglwiO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoZXJyb3JNc2cpIHtcbiAgICBjb25zb2xlLmxvZyhcImVycm9yXCIsIGVycm9yTXNnKTtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB0b2FzdHIuZXJyb3IoZXJyb3JNc2cpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cblxuLypcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9Nb25nbyA9IGZ1bmN0aW9uKGZpbHRlcnMsIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGVjdG9yO1xuICBpZiAoIShmaWx0ZXJzICE9IG51bGwgPyBmaWx0ZXJzLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCEoZmlsdGVyc1swXSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgIGZpbHRlcnMgPSBfLm1hcChmaWx0ZXJzLCBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBbb2JqLmZpZWxkLCBvYmoub3BlcmF0aW9uLCBvYmoudmFsdWVdO1xuICAgIH0pO1xuICB9XG4gIHNlbGVjdG9yID0gW107XG4gIF8uZWFjaChmaWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICB2YXIgZmllbGQsIG9wdGlvbiwgcmVnLCBzdWJfc2VsZWN0b3IsIHZhbHVlO1xuICAgIGZpZWxkID0gZmlsdGVyWzBdO1xuICAgIG9wdGlvbiA9IGZpbHRlclsxXTtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBudWxsLCBvcHRpb25zKTtcbiAgICB9XG4gICAgc3ViX3NlbGVjdG9yID0ge307XG4gICAgc3ViX3NlbGVjdG9yW2ZpZWxkXSA9IHt9O1xuICAgIGlmIChvcHRpb24gPT09IFwiPVwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGVxXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD5cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRuZVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIj5cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndFwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIj49XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RlXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPFwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGx0XCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD1cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdGVcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJzdGFydHN3aXRoXCIpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeXCIgKyB2YWx1ZSwgXCJpXCIpO1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJjb250YWluc1wiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKHZhbHVlLCBcImlcIik7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIm5vdGNvbnRhaW5zXCIpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeKCg/IVwiICsgdmFsdWUgKyBcIikuKSokXCIsIFwiaVwiKTtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWc7XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3Rvci5wdXNoKHN1Yl9zZWxlY3Rvcik7XG4gIH0pO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5DcmVhdG9yLmlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiA9IGZ1bmN0aW9uKG9wZXJhdGlvbikge1xuICB2YXIgcmVmO1xuICByZXR1cm4gb3BlcmF0aW9uID09PSBcImJldHdlZW5cIiB8fCAhISgocmVmID0gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXModHJ1ZSkpICE9IG51bGwgPyByZWZbb3BlcmF0aW9uXSA6IHZvaWQgMCk7XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuXHRleHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9EZXYgPSBmdW5jdGlvbihmaWx0ZXJzLCBvYmplY3RfbmFtZSwgb3B0aW9ucykge1xuICB2YXIgbG9naWNUZW1wRmlsdGVycywgc2VsZWN0b3I7XG4gIGlmICghZmlsdGVycy5sZW5ndGgpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuaXNfbG9naWNfb3IgOiB2b2lkIDApIHtcbiAgICBsb2dpY1RlbXBGaWx0ZXJzID0gW107XG4gICAgZmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uKG4pIHtcbiAgICAgIGxvZ2ljVGVtcEZpbHRlcnMucHVzaChuKTtcbiAgICAgIHJldHVybiBsb2dpY1RlbXBGaWx0ZXJzLnB1c2goXCJvclwiKTtcbiAgICB9KTtcbiAgICBsb2dpY1RlbXBGaWx0ZXJzLnBvcCgpO1xuICAgIGZpbHRlcnMgPSBsb2dpY1RlbXBGaWx0ZXJzO1xuICB9XG4gIHNlbGVjdG9yID0gU3RlZWRvc0ZpbHRlcnMuZm9ybWF0RmlsdGVyc1RvRGV2KGZpbHRlcnMsIENyZWF0b3IuVVNFUl9DT05URVhUKTtcbiAgcmV0dXJuIHNlbGVjdG9yO1xufTtcblxuXG4vKlxub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcbmV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcbiAqL1xuXG5DcmVhdG9yLmZvcm1hdExvZ2ljRmlsdGVyc1RvRGV2ID0gZnVuY3Rpb24oZmlsdGVycywgZmlsdGVyX2xvZ2ljLCBvcHRpb25zKSB7XG4gIHZhciBmb3JtYXRfbG9naWM7XG4gIGZvcm1hdF9sb2dpYyA9IGZpbHRlcl9sb2dpYy5yZXBsYWNlKC9cXChcXHMrL2lnLCBcIihcIikucmVwbGFjZSgvXFxzK1xcKS9pZywgXCIpXCIpLnJlcGxhY2UoL1xcKC9nLCBcIltcIikucmVwbGFjZSgvXFwpL2csIFwiXVwiKS5yZXBsYWNlKC9cXHMrL2csIFwiLFwiKS5yZXBsYWNlKC8oYW5kfG9yKS9pZywgXCInJDEnXCIpO1xuICBmb3JtYXRfbG9naWMgPSBmb3JtYXRfbG9naWMucmVwbGFjZSgvKFxcZCkrL2lnLCBmdW5jdGlvbih4KSB7XG4gICAgdmFyIF9mLCBmaWVsZCwgb3B0aW9uLCBzdWJfc2VsZWN0b3IsIHZhbHVlO1xuICAgIF9mID0gZmlsdGVyc1t4IC0gMV07XG4gICAgZmllbGQgPSBfZi5maWVsZDtcbiAgICBvcHRpb24gPSBfZi5vcGVyYXRpb247XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShfZi52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUsIG51bGwsIG9wdGlvbnMpO1xuICAgIH1cbiAgICBzdWJfc2VsZWN0b3IgPSBbXTtcbiAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKG9wdGlvbiA9PT0gXCI9XCIpIHtcbiAgICAgICAgXy5lYWNoKHZhbHVlLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIHN1Yl9zZWxlY3Rvci5wdXNoKFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI8PlwiKSB7XG4gICAgICAgIF8uZWFjaCh2YWx1ZSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBzdWJfc2VsZWN0b3IucHVzaChbZmllbGQsIG9wdGlvbiwgdl0sIFwiYW5kXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF8uZWFjaCh2YWx1ZSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBzdWJfc2VsZWN0b3IucHVzaChbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT09IFwiYW5kXCIgfHwgc3ViX3NlbGVjdG9yW3N1Yl9zZWxlY3Rvci5sZW5ndGggLSAxXSA9PT0gXCJvclwiKSB7XG4gICAgICAgIHN1Yl9zZWxlY3Rvci5wb3AoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3ViX3NlbGVjdG9yID0gW2ZpZWxkLCBvcHRpb24sIHZhbHVlXTtcbiAgICB9XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN1Yl9zZWxlY3Rvcik7XG4gIH0pO1xuICBmb3JtYXRfbG9naWMgPSBcIltcIiArIGZvcm1hdF9sb2dpYyArIFwiXVwiO1xuICByZXR1cm4gQ3JlYXRvcltcImV2YWxcIl0oZm9ybWF0X2xvZ2ljKTtcbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBfb2JqZWN0LCBwZXJtaXNzaW9ucywgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHJlbGF0ZWRfb2JqZWN0cywgdW5yZWxhdGVkX29iamVjdHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBbXTtcbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFfb2JqZWN0KSB7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICB9XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoX29iamVjdC5fY29sbGVjdGlvbl9uYW1lKTtcbiAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cywgXCJvYmplY3RfbmFtZVwiKTtcbiAgaWYgKChyZWxhdGVkX29iamVjdF9uYW1lcyAhPSBudWxsID8gcmVsYXRlZF9vYmplY3RfbmFtZXMubGVuZ3RoIDogdm9pZCAwKSA9PT0gMCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgfVxuICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlKHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0cyk7XG4gIHJldHVybiBfLmZpbHRlcihyZWxhdGVkX29iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0KSB7XG4gICAgdmFyIGFsbG93UmVhZCwgaXNBY3RpdmUsIHJlZiwgcmVsYXRlZF9vYmplY3RfbmFtZTtcbiAgICByZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3Qub2JqZWN0X25hbWU7XG4gICAgaXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTE7XG4gICAgYWxsb3dSZWFkID0gKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5hbGxvd1JlYWQgOiB2b2lkIDA7XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIGFsbG93UmVhZCA9IGFsbG93UmVhZCAmJiBwZXJtaXNzaW9ucy5hbGxvd1JlYWRGaWxlcztcbiAgICB9XG4gICAgcmV0dXJuIGlzQWN0aXZlICYmIGFsbG93UmVhZDtcbiAgfSk7XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3ROYW1lcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIHJlbGF0ZWRfb2JqZWN0cztcbiAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgcmV0dXJuIF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLCBcIm9iamVjdF9uYW1lXCIpO1xufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0TGlzdEFjdGlvbnMgPSBmdW5jdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBhY3Rpb25zO1xuICBhY3Rpb25zID0gQ3JlYXRvci5nZXRBY3Rpb25zKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICBhY3Rpb25zID0gXy5maWx0ZXIoYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgaWYgKGFjdGlvbi5uYW1lID09PSBcInN0YW5kYXJkX2ZvbGxvd1wiKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChhY3Rpb24ubmFtZSA9PT0gXCJzdGFuZGFyZF9xdWVyeVwiKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChhY3Rpb24ub24gPT09IFwibGlzdFwiKSB7XG4gICAgICBpZiAodHlwZW9mIGFjdGlvbi52aXNpYmxlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi52aXNpYmxlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYWN0aW9uLnZpc2libGU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYWN0aW9ucztcbn07XG5cbkNyZWF0b3IuZ2V0QWN0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGFjdGlvbnMsIGRpc2FibGVkX2FjdGlvbnMsIG9iaiwgcGVybWlzc2lvbnMsIHJlZiwgcmVmMTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgZGlzYWJsZWRfYWN0aW9ucyA9IHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnM7XG4gIGFjdGlvbnMgPSBfLnNvcnRCeShfLnZhbHVlcyhvYmouYWN0aW9ucyksICdzb3J0Jyk7XG4gIGlmIChfLmhhcyhvYmosICdhbGxvd19jdXN0b21BY3Rpb25zJykpIHtcbiAgICBhY3Rpb25zID0gXy5maWx0ZXIoYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgICByZXR1cm4gXy5pbmNsdWRlKG9iai5hbGxvd19jdXN0b21BY3Rpb25zLCBhY3Rpb24ubmFtZSkgfHwgXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLmdldE9iamVjdCgnYmFzZScpLmFjdGlvbnMpIHx8IHt9LCBhY3Rpb24ubmFtZSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKF8uaGFzKG9iaiwgJ2V4Y2x1ZGVfYWN0aW9ucycpKSB7XG4gICAgYWN0aW9ucyA9IF8uZmlsdGVyKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgICAgcmV0dXJuICFfLmluY2x1ZGUob2JqLmV4Y2x1ZGVfYWN0aW9ucywgYWN0aW9uLm5hbWUpO1xuICAgIH0pO1xuICB9XG4gIF8uZWFjaChhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcInJlY29yZFwiLCBcInJlY29yZF9vbmx5XCJdLmluZGV4T2YoYWN0aW9uLm9uKSA+IC0xICYmIGFjdGlvbi5uYW1lICE9PSAnc3RhbmRhcmRfZWRpdCcpIHtcbiAgICAgIGlmIChhY3Rpb24ub24gPT09IFwicmVjb3JkX29ubHlcIikge1xuICAgICAgICByZXR1cm4gYWN0aW9uLm9uID0gJ3JlY29yZF9vbmx5X21vcmUnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi5vbiA9ICdyZWNvcmRfbW9yZSc7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJjbXNfZmlsZXNcIiwgXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXS5pbmRleE9mKG9iamVjdF9uYW1lKSA+IC0xKSB7XG4gICAgaWYgKChyZWYgPSBhY3Rpb25zLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4ubmFtZSA9PT0gXCJzdGFuZGFyZF9lZGl0XCI7XG4gICAgfSkpICE9IG51bGwpIHtcbiAgICAgIHJlZi5vbiA9IFwicmVjb3JkX21vcmVcIjtcbiAgICB9XG4gICAgaWYgKChyZWYxID0gYWN0aW9ucy5maW5kKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLm5hbWUgPT09IFwiZG93bmxvYWRcIjtcbiAgICB9KSkgIT0gbnVsbCkge1xuICAgICAgcmVmMS5vbiA9IFwicmVjb3JkXCI7XG4gICAgfVxuICB9XG4gIGFjdGlvbnMgPSBfLmZpbHRlcihhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICByZXR1cm4gXy5pbmRleE9mKGRpc2FibGVkX2FjdGlvbnMsIGFjdGlvbi5uYW1lKSA8IDA7XG4gIH0pO1xuICByZXR1cm4gYWN0aW9ucztcbn07XG5cbi/ov5Tlm57lvZPliY3nlKjmiLfmnInmnYPpmZDorr/pl67nmoTmiYDmnIlsaXN0X3ZpZXfvvIzljIXmi6zliIbkuqvnmoTvvIznlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTvvIjpmaTpnZ5vd25lcuWPmOS6hu+8ie+8jOS7peWPium7mOiupOeahOWFtuS7luinhuWbvuazqOaEj0NyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mmK/kuI3kvJrmnInnlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTop4blm77nmoTvvIzmiYDku6VDcmVhdG9yLmdldFBlcm1pc3Npb25z5Ye95pWw5Lit5ou/5Yiw55qE57uT5p6c5LiN5YWo77yM5bm25LiN5piv5b2T5YmN55So5oi36IO955yL5Yiw5omA5pyJ6KeG5Zu+LztcblxuQ3JlYXRvci5nZXRMaXN0Vmlld3MgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBkaXNhYmxlZF9saXN0X3ZpZXdzLCBpc01vYmlsZSwgbGlzdFZpZXdzLCBsaXN0X3ZpZXdzLCBvYmplY3QsIHJlZjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZGlzYWJsZWRfbGlzdF92aWV3cyA9ICgocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5kaXNhYmxlZF9saXN0X3ZpZXdzIDogdm9pZCAwKSB8fCBbXTtcbiAgbGlzdF92aWV3cyA9IFtdO1xuICBpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKTtcbiAgXy5lYWNoKG9iamVjdC5saXN0X3ZpZXdzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICByZXR1cm4gaXRlbS5uYW1lID0gaXRlbV9uYW1lO1xuICB9KTtcbiAgbGlzdFZpZXdzID0gXy5zb3J0QnkoXy52YWx1ZXMob2JqZWN0Lmxpc3Rfdmlld3MpLCAnc29ydF9ubycpO1xuICBfLmVhY2gobGlzdFZpZXdzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGlzRGlzYWJsZWQ7XG4gICAgaWYgKGlzTW9iaWxlICYmIGl0ZW0udHlwZSA9PT0gXCJjYWxlbmRhclwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpdGVtLm5hbWUgIT09IFwiZGVmYXVsdFwiKSB7XG4gICAgICBpc0Rpc2FibGVkID0gXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW0ubmFtZSkgPiAtMSB8fCAoaXRlbS5faWQgJiYgXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW0uX2lkKSA+IC0xKTtcbiAgICAgIGlmICghaXNEaXNhYmxlZCB8fCBpdGVtLm93bmVyID09PSB1c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlld3MucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbGlzdF92aWV3cztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgZmllbGRzTmFtZSwgcmVmLCB1bnJlYWRhYmxlX2ZpZWxkcztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBmaWVsZHNOYW1lID0gQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lKG9iamVjdF9uYW1lKTtcbiAgdW5yZWFkYWJsZV9maWVsZHMgPSAocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi51bnJlYWRhYmxlX2ZpZWxkcyA6IHZvaWQgMDtcbiAgcmV0dXJuIF8uZGlmZmVyZW5jZShmaWVsZHNOYW1lLCB1bnJlYWRhYmxlX2ZpZWxkcyk7XG59O1xuXG5DcmVhdG9yLmlzbG9hZGluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkLmdldCgpO1xufTtcblxuQ3JlYXRvci5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpO1xufTtcblxuQ3JlYXRvci5nZXREaXNhYmxlZEZpZWxkcyA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0uZGlzYWJsZWQgJiYgIWZpZWxkLmF1dG9mb3JtLm9taXQgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldEhpZGRlbkZpZWxkcyA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0udHlwZSA9PT0gXCJoaWRkZW5cIiAmJiAhZmllbGQuYXV0b2Zvcm0ub21pdCAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aE5vR3JvdXAgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuICghZmllbGQuYXV0b2Zvcm0gfHwgIWZpZWxkLmF1dG9mb3JtLmdyb3VwIHx8IGZpZWxkLmF1dG9mb3JtLmdyb3VwID09PSBcIi1cIikgJiYgKCFmaWVsZC5hdXRvZm9ybSB8fCBmaWVsZC5hdXRvZm9ybS50eXBlICE9PSBcImhpZGRlblwiKSAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0U29ydGVkRmllbGRHcm91cE5hbWVzID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBuYW1lcztcbiAgbmFtZXMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLmdyb3VwICE9PSBcIi1cIiAmJiBmaWVsZC5hdXRvZm9ybS5ncm91cDtcbiAgfSk7XG4gIG5hbWVzID0gXy5jb21wYWN0KG5hbWVzKTtcbiAgbmFtZXMgPSBfLnVuaXF1ZShuYW1lcyk7XG4gIHJldHVybiBuYW1lcztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzRm9yR3JvdXAgPSBmdW5jdGlvbihzY2hlbWEsIGdyb3VwTmFtZSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT09IGdyb3VwTmFtZSAmJiBmaWVsZC5hdXRvZm9ybS50eXBlICE9PSBcImhpZGRlblwiICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRTeXN0ZW1CYXNlRmllbGRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbXCJjcmVhdGVkXCIsIFwiY3JlYXRlZF9ieVwiLCBcIm1vZGlmaWVkXCIsIFwibW9kaWZpZWRfYnlcIl07XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRTeXN0ZW1CYXNlID0gZnVuY3Rpb24oa2V5cykge1xuICByZXR1cm4gXy5kaWZmZXJlbmNlKGtleXMsIENyZWF0b3IuZ2V0U3lzdGVtQmFzZUZpZWxkcygpKTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aG91dE9taXQgPSBmdW5jdGlvbihzY2hlbWEsIGtleXMpIHtcbiAga2V5cyA9IF8ubWFwKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBmaWVsZCwgcmVmO1xuICAgIGZpZWxkID0gXy5waWNrKHNjaGVtYSwga2V5KTtcbiAgICBpZiAoKHJlZiA9IGZpZWxkW2tleV0uYXV0b2Zvcm0pICE9IG51bGwgPyByZWYub21pdCA6IHZvaWQgMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cbiAgfSk7XG4gIGtleXMgPSBfLmNvbXBhY3Qoa2V5cyk7XG4gIHJldHVybiBrZXlzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNJbkZpcnN0TGV2ZWwgPSBmdW5jdGlvbihmaXJzdExldmVsS2V5cywga2V5cykge1xuICBrZXlzID0gXy5tYXAoa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKF8uaW5kZXhPZihmaXJzdExldmVsS2V5cywga2V5KSA+IC0xKSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcbiAga2V5cyA9IF8uY29tcGFjdChrZXlzKTtcbiAgcmV0dXJuIGtleXM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc0ZvclJlb3JkZXIgPSBmdW5jdGlvbihzY2hlbWEsIGtleXMsIGlzU2luZ2xlKSB7XG4gIHZhciBfa2V5cywgY2hpbGRLZXlzLCBmaWVsZHMsIGksIGlzX3dpZGVfMSwgaXNfd2lkZV8yLCBzY18xLCBzY18yO1xuICBmaWVsZHMgPSBbXTtcbiAgaSA9IDA7XG4gIF9rZXlzID0gXy5maWx0ZXIoa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuICFrZXkuZW5kc1dpdGgoJ19lbmRMaW5lJyk7XG4gIH0pO1xuICB3aGlsZSAoaSA8IF9rZXlzLmxlbmd0aCkge1xuICAgIHNjXzEgPSBfLnBpY2soc2NoZW1hLCBfa2V5c1tpXSk7XG4gICAgc2NfMiA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2kgKyAxXSk7XG4gICAgaXNfd2lkZV8xID0gZmFsc2U7XG4gICAgaXNfd2lkZV8yID0gZmFsc2U7XG4gICAgXy5lYWNoKHNjXzEsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCgocmVmID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYuaXNfd2lkZSA6IHZvaWQgMCkgfHwgKChyZWYxID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLnR5cGUgOiB2b2lkIDApID09PSBcInRhYmxlXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzX3dpZGVfMSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgXy5lYWNoKHNjXzIsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCgocmVmID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYuaXNfd2lkZSA6IHZvaWQgMCkgfHwgKChyZWYxID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLnR5cGUgOiB2b2lkIDApID09PSBcInRhYmxlXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzX3dpZGVfMiA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgaXNfd2lkZV8xID0gdHJ1ZTtcbiAgICAgIGlzX3dpZGVfMiA9IHRydWU7XG4gICAgfVxuICAgIGlmIChpc1NpbmdsZSkge1xuICAgICAgZmllbGRzLnB1c2goX2tleXMuc2xpY2UoaSwgaSArIDEpKTtcbiAgICAgIGkgKz0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzX3dpZGVfMSkge1xuICAgICAgICBmaWVsZHMucHVzaChfa2V5cy5zbGljZShpLCBpICsgMSkpO1xuICAgICAgICBpICs9IDE7XG4gICAgICB9IGVsc2UgaWYgKCFpc193aWRlXzEgJiYgaXNfd2lkZV8yKSB7XG4gICAgICAgIGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkgKyAxKTtcbiAgICAgICAgY2hpbGRLZXlzLnB1c2godm9pZCAwKTtcbiAgICAgICAgZmllbGRzLnB1c2goY2hpbGRLZXlzKTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgfSBlbHNlIGlmICghaXNfd2lkZV8xICYmICFpc193aWRlXzIpIHtcbiAgICAgICAgY2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSArIDEpO1xuICAgICAgICBpZiAoX2tleXNbaSArIDFdKSB7XG4gICAgICAgICAgY2hpbGRLZXlzLnB1c2goX2tleXNbaSArIDFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGlsZEtleXMucHVzaCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICAgIGZpZWxkcy5wdXNoKGNoaWxkS2V5cyk7XG4gICAgICAgIGkgKz0gMjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuaXNGaWx0ZXJWYWx1ZUVtcHR5ID0gZnVuY3Rpb24odikge1xuICByZXR1cm4gdHlwZW9mIHYgPT09IFwidW5kZWZpbmVkXCIgfHwgdiA9PT0gbnVsbCB8fCBOdW1iZXIuaXNOYU4odikgfHwgdi5sZW5ndGggPT09IDA7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGF0YVR5cGUgPSBmdW5jdGlvbihvYmplY3RGaWVsZHMsIGtleSkge1xuICB2YXIgcmVmLCByZXN1bHQ7XG4gIGlmIChvYmplY3RGaWVsZHMgJiYga2V5KSB7XG4gICAgcmVzdWx0ID0gKHJlZiA9IG9iamVjdEZpZWxkc1trZXldKSAhPSBudWxsID8gcmVmLnR5cGUgOiB2b2lkIDA7XG4gICAgaWYgKFtcImZvcm11bGFcIiwgXCJzdW1tYXJ5XCJdLmluZGV4T2YocmVzdWx0KSA+IC0xKSB7XG4gICAgICByZXN1bHQgPSBvYmplY3RGaWVsZHNba2V5XS5kYXRhX3R5cGU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwidGV4dFwiO1xuICB9XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3IuZ2V0QWxsUmVsYXRlZE9iamVjdHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgIHZhciByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdO1xuICAgIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICAgIGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSkge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoKHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpLmVuYWJsZV9maWxlcykge1xuICAgICAgcmVsYXRlZF9vYmplY3RfbmFtZXMucHVzaChcImNtc19maWxlc1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3MuZm9ybWF0SW5kZXggPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciBpbmRleE5hbWUsIGlzZG9jdW1lbnREQiwgb2JqZWN0LCByZWYsIHJlZjEsIHJlZjI7XG4gICAgb2JqZWN0ID0ge1xuICAgICAgYmFja2dyb3VuZDogdHJ1ZVxuICAgIH07XG4gICAgaXNkb2N1bWVudERCID0gKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMSA9IHJlZi5kYXRhc291cmNlcykgIT0gbnVsbCA/IChyZWYyID0gcmVmMVtcImRlZmF1bHRcIl0pICE9IG51bGwgPyByZWYyLmRvY3VtZW50REIgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDApIHx8IGZhbHNlO1xuICAgIGlmIChpc2RvY3VtZW50REIpIHtcbiAgICAgIGlmIChhcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGluZGV4TmFtZSA9IGFycmF5LmpvaW4oXCIuXCIpO1xuICAgICAgICBvYmplY3QubmFtZSA9IGluZGV4TmFtZTtcbiAgICAgICAgaWYgKGluZGV4TmFtZS5sZW5ndGggPiA1Mikge1xuICAgICAgICAgIG9iamVjdC5uYW1lID0gaW5kZXhOYW1lLnN1YnN0cmluZygwLCA1Mik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cbiIsIkNyZWF0b3IuYXBwc0J5TmFtZSA9IHt9XG5cbiIsIk1ldGVvci5tZXRob2RzXG5cdFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlX2lkKS0+XG5cdFx0aWYgIXRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0aWYgb2JqZWN0X25hbWUgPT0gXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiXG5cdFx0XHRyZXR1cm5cblx0XHRpZiBvYmplY3RfbmFtZSBhbmQgcmVjb3JkX2lkXG5cdFx0XHRpZiAhc3BhY2VfaWRcblx0XHRcdFx0ZG9jID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kT25lKHtfaWQ6IHJlY29yZF9pZH0sIHtmaWVsZHM6IHtzcGFjZTogMX19KVxuXHRcdFx0XHRzcGFjZV9pZCA9IGRvYz8uc3BhY2VcblxuXHRcdFx0Y29sbGVjdGlvbl9yZWNlbnRfdmlld2VkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIilcblx0XHRcdGZpbHRlcnMgPSB7IG93bmVyOiB0aGlzLnVzZXJJZCwgc3BhY2U6IHNwYWNlX2lkLCAncmVjb3JkLm8nOiBvYmplY3RfbmFtZSwgJ3JlY29yZC5pZHMnOiBbcmVjb3JkX2lkXX1cblx0XHRcdGN1cnJlbnRfcmVjZW50X3ZpZXdlZCA9IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5maW5kT25lKGZpbHRlcnMpXG5cdFx0XHRpZiBjdXJyZW50X3JlY2VudF92aWV3ZWRcblx0XHRcdFx0Y29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLnVwZGF0ZShcblx0XHRcdFx0XHRjdXJyZW50X3JlY2VudF92aWV3ZWQuX2lkLFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdCRpbmM6IHtcblx0XHRcdFx0XHRcdFx0Y291bnQ6IDFcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHQkc2V0OiB7XG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkOiBuZXcgRGF0ZSgpXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuaW5zZXJ0KFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdF9pZDogY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLl9tYWtlTmV3SUQoKVxuXHRcdFx0XHRcdFx0b3duZXI6IHRoaXMudXNlcklkXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VfaWRcblx0XHRcdFx0XHRcdHJlY29yZDoge286IG9iamVjdF9uYW1lLCBpZHM6IFtyZWNvcmRfaWRdfVxuXHRcdFx0XHRcdFx0Y291bnQ6IDFcblx0XHRcdFx0XHRcdGNyZWF0ZWQ6IG5ldyBEYXRlKClcblx0XHRcdFx0XHRcdGNyZWF0ZWRfYnk6IHRoaXMudXNlcklkXG5cdFx0XHRcdFx0XHRtb2RpZmllZDogbmV3IERhdGUoKVxuXHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR2YWxpZGF0ZTogZmFsc2Vcblx0XHRcdFx0XHR9XG5cdFx0XHRcdClcblx0XHRcdHJldHVybiIsIk1ldGVvci5tZXRob2RzKHtcbiAgXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZV9pZCkge1xuICAgIHZhciBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQsIGN1cnJlbnRfcmVjZW50X3ZpZXdlZCwgZG9jLCBmaWx0ZXJzO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAob2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgICBpZiAoIXNwYWNlX2lkKSB7XG4gICAgICAgIGRvYyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZE9uZSh7XG4gICAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgc3BhY2U6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzcGFjZV9pZCA9IGRvYyAhPSBudWxsID8gZG9jLnNwYWNlIDogdm9pZCAwO1xuICAgICAgfVxuICAgICAgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIik7XG4gICAgICBmaWx0ZXJzID0ge1xuICAgICAgICBvd25lcjogdGhpcy51c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgJ3JlY29yZC5vJzogb2JqZWN0X25hbWUsXG4gICAgICAgICdyZWNvcmQuaWRzJzogW3JlY29yZF9pZF1cbiAgICAgIH07XG4gICAgICBjdXJyZW50X3JlY2VudF92aWV3ZWQgPSBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuZmluZE9uZShmaWx0ZXJzKTtcbiAgICAgIGlmIChjdXJyZW50X3JlY2VudF92aWV3ZWQpIHtcbiAgICAgICAgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLnVwZGF0ZShjdXJyZW50X3JlY2VudF92aWV3ZWQuX2lkLCB7XG4gICAgICAgICAgJGluYzoge1xuICAgICAgICAgICAgY291bnQ6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5pbnNlcnQoe1xuICAgICAgICAgIF9pZDogY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLl9tYWtlTmV3SUQoKSxcbiAgICAgICAgICBvd25lcjogdGhpcy51c2VySWQsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIHJlY29yZDoge1xuICAgICAgICAgICAgbzogb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBpZHM6IFtyZWNvcmRfaWRdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IHRoaXMudXNlcklkLFxuICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgdmFsaWRhdGU6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG4iLCJyZWNlbnRfYWdncmVnYXRlID0gKGNyZWF0ZWRfYnksIHNwYWNlSWQsIF9yZWNvcmRzLCBjYWxsYmFjayktPlxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9yZWNlbnRfdmlld2VkLnJhd0NvbGxlY3Rpb24oKS5hZ2dyZWdhdGUoW1xuXHRcdHskbWF0Y2g6IHtjcmVhdGVkX2J5OiBjcmVhdGVkX2J5LCBzcGFjZTogc3BhY2VJZH19LFxuXHRcdHskZ3JvdXA6IHtfaWQ6IHtvYmplY3RfbmFtZTogXCIkcmVjb3JkLm9cIiwgcmVjb3JkX2lkOiBcIiRyZWNvcmQuaWRzXCIsIHNwYWNlOiBcIiRzcGFjZVwifSwgbWF4Q3JlYXRlZDogeyRtYXg6IFwiJGNyZWF0ZWRcIn19fSxcblx0XHR7JHNvcnQ6IHttYXhDcmVhdGVkOiAtMX19LFxuXHRcdHskbGltaXQ6IDEwfVxuXHRdKS50b0FycmF5IChlcnIsIGRhdGEpLT5cblx0XHRpZiBlcnJcblx0XHRcdHRocm93IG5ldyBFcnJvcihlcnIpXG5cblx0XHRkYXRhLmZvckVhY2ggKGRvYykgLT5cblx0XHRcdF9yZWNvcmRzLnB1c2ggZG9jLl9pZFxuXG5cdFx0aWYgY2FsbGJhY2sgJiYgXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKVxuXHRcdFx0Y2FsbGJhY2soKVxuXG5cdFx0cmV0dXJuXG5cbmFzeW5jX3JlY2VudF9hZ2dyZWdhdGUgPSBNZXRlb3Iud3JhcEFzeW5jKHJlY2VudF9hZ2dyZWdhdGUpXG5cbnNlYXJjaF9vYmplY3QgPSAoc3BhY2UsIG9iamVjdF9uYW1lLHVzZXJJZCwgc2VhcmNoVGV4dCktPlxuXHRkYXRhID0gbmV3IEFycmF5KClcblxuXHRpZiBzZWFyY2hUZXh0XG5cblx0XHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0XHRfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpXG5cdFx0X29iamVjdF9uYW1lX2tleSA9IF9vYmplY3Q/Lk5BTUVfRklFTERfS0VZXG5cdFx0aWYgX29iamVjdCAmJiBfb2JqZWN0X2NvbGxlY3Rpb24gJiYgX29iamVjdF9uYW1lX2tleVxuXHRcdFx0cXVlcnkgPSB7fVxuXHRcdFx0c2VhcmNoX0tleXdvcmRzID0gc2VhcmNoVGV4dC5zcGxpdChcIiBcIilcblx0XHRcdHF1ZXJ5X2FuZCA9IFtdXG5cdFx0XHRzZWFyY2hfS2V5d29yZHMuZm9yRWFjaCAoa2V5d29yZCktPlxuXHRcdFx0XHRzdWJxdWVyeSA9IHt9XG5cdFx0XHRcdHN1YnF1ZXJ5W19vYmplY3RfbmFtZV9rZXldID0geyRyZWdleDoga2V5d29yZC50cmltKCl9XG5cdFx0XHRcdHF1ZXJ5X2FuZC5wdXNoIHN1YnF1ZXJ5XG5cblx0XHRcdHF1ZXJ5LiRhbmQgPSBxdWVyeV9hbmRcblx0XHRcdHF1ZXJ5LnNwYWNlID0geyRpbjogW3NwYWNlXX1cblxuXHRcdFx0ZmllbGRzID0ge19pZDogMX1cblx0XHRcdGZpZWxkc1tfb2JqZWN0X25hbWVfa2V5XSA9IDFcblxuXHRcdFx0cmVjb3JkcyA9IF9vYmplY3RfY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCB7ZmllbGRzOiBmaWVsZHMsIHNvcnQ6IHttb2RpZmllZDogMX0sIGxpbWl0OiA1fSlcblxuXHRcdFx0cmVjb3Jkcy5mb3JFYWNoIChyZWNvcmQpLT5cblx0XHRcdFx0ZGF0YS5wdXNoIHtfaWQ6IHJlY29yZC5faWQsIF9uYW1lOiByZWNvcmRbX29iamVjdF9uYW1lX2tleV0sIF9vYmplY3RfbmFtZTogb2JqZWN0X25hbWV9XG5cdFxuXHRyZXR1cm4gZGF0YVxuXG5NZXRlb3IubWV0aG9kc1xuXHQnb2JqZWN0X3JlY2VudF9yZWNvcmQnOiAoc3BhY2VJZCktPlxuXHRcdGRhdGEgPSBuZXcgQXJyYXkoKVxuXHRcdHJlY29yZHMgPSBuZXcgQXJyYXkoKVxuXHRcdGFzeW5jX3JlY2VudF9hZ2dyZWdhdGUodGhpcy51c2VySWQsIHNwYWNlSWQsIHJlY29yZHMpXG5cdFx0cmVjb3Jkcy5mb3JFYWNoIChpdGVtKS0+XG5cdFx0XHRyZWNvcmRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSlcblxuXHRcdFx0aWYgIXJlY29yZF9vYmplY3Rcblx0XHRcdFx0cmV0dXJuXG5cblx0XHRcdHJlY29yZF9vYmplY3RfY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihpdGVtLm9iamVjdF9uYW1lLCBpdGVtLnNwYWNlKVxuXG5cdFx0XHRpZiByZWNvcmRfb2JqZWN0ICYmIHJlY29yZF9vYmplY3RfY29sbGVjdGlvblxuXHRcdFx0XHRmaWVsZHMgPSB7X2lkOiAxfVxuXG5cdFx0XHRcdGZpZWxkc1tyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSA9IDFcblxuXHRcdFx0XHRyZWNvcmQgPSByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24uZmluZE9uZShpdGVtLnJlY29yZF9pZFswXSwge2ZpZWxkczogZmllbGRzfSlcblx0XHRcdFx0aWYgcmVjb3JkXG5cdFx0XHRcdFx0ZGF0YS5wdXNoIHtfaWQ6IHJlY29yZC5faWQsIF9uYW1lOiByZWNvcmRbcmVjb3JkX29iamVjdC5OQU1FX0ZJRUxEX0tFWV0sIF9vYmplY3RfbmFtZTogaXRlbS5vYmplY3RfbmFtZX1cblxuXHRcdHJldHVybiBkYXRhXG5cblx0J29iamVjdF9yZWNvcmRfc2VhcmNoJzogKG9wdGlvbnMpLT5cblx0XHRzZWxmID0gdGhpc1xuXG5cdFx0ZGF0YSA9IG5ldyBBcnJheSgpXG5cblx0XHRzZWFyY2hUZXh0ID0gb3B0aW9ucy5zZWFyY2hUZXh0XG5cdFx0c3BhY2UgPSBvcHRpb25zLnNwYWNlXG5cblx0XHRfLmZvckVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAoX29iamVjdCwgbmFtZSktPlxuXHRcdFx0aWYgX29iamVjdC5lbmFibGVfc2VhcmNoXG5cdFx0XHRcdG9iamVjdF9yZWNvcmQgPSBzZWFyY2hfb2JqZWN0KHNwYWNlLCBfb2JqZWN0Lm5hbWUsIHNlbGYudXNlcklkLCBzZWFyY2hUZXh0KVxuXHRcdFx0XHRkYXRhID0gZGF0YS5jb25jYXQob2JqZWN0X3JlY29yZClcblxuXHRcdHJldHVybiBkYXRhXG4iLCJ2YXIgYXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSwgcmVjZW50X2FnZ3JlZ2F0ZSwgc2VhcmNoX29iamVjdDtcblxucmVjZW50X2FnZ3JlZ2F0ZSA9IGZ1bmN0aW9uKGNyZWF0ZWRfYnksIHNwYWNlSWQsIF9yZWNvcmRzLCBjYWxsYmFjaykge1xuICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfcmVjZW50X3ZpZXdlZC5yYXdDb2xsZWN0aW9uKCkuYWdncmVnYXRlKFtcbiAgICB7XG4gICAgICAkbWF0Y2g6IHtcbiAgICAgICAgY3JlYXRlZF9ieTogY3JlYXRlZF9ieSxcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAkZ3JvdXA6IHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IFwiJHJlY29yZC5vXCIsXG4gICAgICAgICAgcmVjb3JkX2lkOiBcIiRyZWNvcmQuaWRzXCIsXG4gICAgICAgICAgc3BhY2U6IFwiJHNwYWNlXCJcbiAgICAgICAgfSxcbiAgICAgICAgbWF4Q3JlYXRlZDoge1xuICAgICAgICAgICRtYXg6IFwiJGNyZWF0ZWRcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgJHNvcnQ6IHtcbiAgICAgICAgbWF4Q3JlYXRlZDogLTFcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAkbGltaXQ6IDEwXG4gICAgfVxuICBdKS50b0FycmF5KGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICAgIH1cbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZG9jKSB7XG4gICAgICByZXR1cm4gX3JlY29yZHMucHVzaChkb2MuX2lkKTtcbiAgICB9KTtcbiAgICBpZiAoY2FsbGJhY2sgJiYgXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH0pO1xufTtcblxuYXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSA9IE1ldGVvci53cmFwQXN5bmMocmVjZW50X2FnZ3JlZ2F0ZSk7XG5cbnNlYXJjaF9vYmplY3QgPSBmdW5jdGlvbihzcGFjZSwgb2JqZWN0X25hbWUsIHVzZXJJZCwgc2VhcmNoVGV4dCkge1xuICB2YXIgX29iamVjdCwgX29iamVjdF9jb2xsZWN0aW9uLCBfb2JqZWN0X25hbWVfa2V5LCBkYXRhLCBmaWVsZHMsIHF1ZXJ5LCBxdWVyeV9hbmQsIHJlY29yZHMsIHNlYXJjaF9LZXl3b3JkcztcbiAgZGF0YSA9IG5ldyBBcnJheSgpO1xuICBpZiAoc2VhcmNoVGV4dCkge1xuICAgIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgX29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKTtcbiAgICBfb2JqZWN0X25hbWVfa2V5ID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5OQU1FX0ZJRUxEX0tFWSA6IHZvaWQgMDtcbiAgICBpZiAoX29iamVjdCAmJiBfb2JqZWN0X2NvbGxlY3Rpb24gJiYgX29iamVjdF9uYW1lX2tleSkge1xuICAgICAgcXVlcnkgPSB7fTtcbiAgICAgIHNlYXJjaF9LZXl3b3JkcyA9IHNlYXJjaFRleHQuc3BsaXQoXCIgXCIpO1xuICAgICAgcXVlcnlfYW5kID0gW107XG4gICAgICBzZWFyY2hfS2V5d29yZHMuZm9yRWFjaChmdW5jdGlvbihrZXl3b3JkKSB7XG4gICAgICAgIHZhciBzdWJxdWVyeTtcbiAgICAgICAgc3VicXVlcnkgPSB7fTtcbiAgICAgICAgc3VicXVlcnlbX29iamVjdF9uYW1lX2tleV0gPSB7XG4gICAgICAgICAgJHJlZ2V4OiBrZXl3b3JkLnRyaW0oKVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcXVlcnlfYW5kLnB1c2goc3VicXVlcnkpO1xuICAgICAgfSk7XG4gICAgICBxdWVyeS4kYW5kID0gcXVlcnlfYW5kO1xuICAgICAgcXVlcnkuc3BhY2UgPSB7XG4gICAgICAgICRpbjogW3NwYWNlXVxuICAgICAgfTtcbiAgICAgIGZpZWxkcyA9IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9O1xuICAgICAgZmllbGRzW19vYmplY3RfbmFtZV9rZXldID0gMTtcbiAgICAgIHJlY29yZHMgPSBfb2JqZWN0X2NvbGxlY3Rpb24uZmluZChxdWVyeSwge1xuICAgICAgICBmaWVsZHM6IGZpZWxkcyxcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIG1vZGlmaWVkOiAxXG4gICAgICAgIH0sXG4gICAgICAgIGxpbWl0OiA1XG4gICAgICB9KTtcbiAgICAgIHJlY29yZHMuZm9yRWFjaChmdW5jdGlvbihyZWNvcmQpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEucHVzaCh7XG4gICAgICAgICAgX2lkOiByZWNvcmQuX2lkLFxuICAgICAgICAgIF9uYW1lOiByZWNvcmRbX29iamVjdF9uYW1lX2tleV0sXG4gICAgICAgICAgX29iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGF0YTtcbn07XG5cbk1ldGVvci5tZXRob2RzKHtcbiAgJ29iamVjdF9yZWNlbnRfcmVjb3JkJzogZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBkYXRhLCByZWNvcmRzO1xuICAgIGRhdGEgPSBuZXcgQXJyYXkoKTtcbiAgICByZWNvcmRzID0gbmV3IEFycmF5KCk7XG4gICAgYXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSh0aGlzLnVzZXJJZCwgc3BhY2VJZCwgcmVjb3Jkcyk7XG4gICAgcmVjb3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHZhciBmaWVsZHMsIHJlY29yZCwgcmVjb3JkX29iamVjdCwgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uO1xuICAgICAgcmVjb3JkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpO1xuICAgICAgaWYgKCFyZWNvcmRfb2JqZWN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJlY29yZF9vYmplY3RfY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihpdGVtLm9iamVjdF9uYW1lLCBpdGVtLnNwYWNlKTtcbiAgICAgIGlmIChyZWNvcmRfb2JqZWN0ICYmIHJlY29yZF9vYmplY3RfY29sbGVjdGlvbikge1xuICAgICAgICBmaWVsZHMgPSB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH07XG4gICAgICAgIGZpZWxkc1tyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSA9IDE7XG4gICAgICAgIHJlY29yZCA9IHJlY29yZF9vYmplY3RfY29sbGVjdGlvbi5maW5kT25lKGl0ZW0ucmVjb3JkX2lkWzBdLCB7XG4gICAgICAgICAgZmllbGRzOiBmaWVsZHNcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YS5wdXNoKHtcbiAgICAgICAgICAgIF9pZDogcmVjb3JkLl9pZCxcbiAgICAgICAgICAgIF9uYW1lOiByZWNvcmRbcmVjb3JkX29iamVjdC5OQU1FX0ZJRUxEX0tFWV0sXG4gICAgICAgICAgICBfb2JqZWN0X25hbWU6IGl0ZW0ub2JqZWN0X25hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9LFxuICAnb2JqZWN0X3JlY29yZF9zZWFyY2gnOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGRhdGEsIHNlYXJjaFRleHQsIHNlbGYsIHNwYWNlO1xuICAgIHNlbGYgPSB0aGlzO1xuICAgIGRhdGEgPSBuZXcgQXJyYXkoKTtcbiAgICBzZWFyY2hUZXh0ID0gb3B0aW9ucy5zZWFyY2hUZXh0O1xuICAgIHNwYWNlID0gb3B0aW9ucy5zcGFjZTtcbiAgICBfLmZvckVhY2goQ3JlYXRvci5vYmplY3RzQnlOYW1lLCBmdW5jdGlvbihfb2JqZWN0LCBuYW1lKSB7XG4gICAgICB2YXIgb2JqZWN0X3JlY29yZDtcbiAgICAgIGlmIChfb2JqZWN0LmVuYWJsZV9zZWFyY2gpIHtcbiAgICAgICAgb2JqZWN0X3JlY29yZCA9IHNlYXJjaF9vYmplY3Qoc3BhY2UsIF9vYmplY3QubmFtZSwgc2VsZi51c2VySWQsIHNlYXJjaFRleHQpO1xuICAgICAgICByZXR1cm4gZGF0YSA9IGRhdGEuY29uY2F0KG9iamVjdF9yZWNvcmQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG4gICAgdXBkYXRlX2ZpbHRlcnM6IChsaXN0dmlld19pZCwgZmlsdGVycywgZmlsdGVyX3Njb3BlLCBmaWx0ZXJfbG9naWMpLT5cbiAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfbGlzdHZpZXdzLmRpcmVjdC51cGRhdGUoe19pZDogbGlzdHZpZXdfaWR9LCB7JHNldDoge2ZpbHRlcnM6IGZpbHRlcnMsIGZpbHRlcl9zY29wZTogZmlsdGVyX3Njb3BlLCBmaWx0ZXJfbG9naWM6IGZpbHRlcl9sb2dpY319KVxuXG4gICAgdXBkYXRlX2NvbHVtbnM6IChsaXN0dmlld19pZCwgY29sdW1ucyktPlxuICAgICAgICBjaGVjayhjb2x1bW5zLCBBcnJheSlcbiAgICAgICAgXG4gICAgICAgIGlmIGNvbHVtbnMubGVuZ3RoIDwgMVxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDAsIFwiU2VsZWN0IGF0IGxlYXN0IG9uZSBmaWVsZCB0byBkaXNwbGF5XCJcbiAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfbGlzdHZpZXdzLnVwZGF0ZSh7X2lkOiBsaXN0dmlld19pZH0sIHskc2V0OiB7Y29sdW1uczogY29sdW1uc319KVxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICB1cGRhdGVfZmlsdGVyczogZnVuY3Rpb24obGlzdHZpZXdfaWQsIGZpbHRlcnMsIGZpbHRlcl9zY29wZSwgZmlsdGVyX2xvZ2ljKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogbGlzdHZpZXdfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGZpbHRlcnM6IGZpbHRlcnMsXG4gICAgICAgIGZpbHRlcl9zY29wZTogZmlsdGVyX3Njb3BlLFxuICAgICAgICBmaWx0ZXJfbG9naWM6IGZpbHRlcl9sb2dpY1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICB1cGRhdGVfY29sdW1uczogZnVuY3Rpb24obGlzdHZpZXdfaWQsIGNvbHVtbnMpIHtcbiAgICBjaGVjayhjb2x1bW5zLCBBcnJheSk7XG4gICAgaWYgKGNvbHVtbnMubGVuZ3RoIDwgMSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwiU2VsZWN0IGF0IGxlYXN0IG9uZSBmaWVsZCB0byBkaXNwbGF5XCIpO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfbGlzdHZpZXdzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IGxpc3R2aWV3X2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0J3JlcG9ydF9kYXRhJzogKG9wdGlvbnMpLT5cblx0XHRjaGVjayhvcHRpb25zLCBPYmplY3QpXG5cdFx0c3BhY2UgPSBvcHRpb25zLnNwYWNlXG5cdFx0ZmllbGRzID0gb3B0aW9ucy5maWVsZHNcblx0XHRvYmplY3RfbmFtZSA9IG9wdGlvbnMub2JqZWN0X25hbWVcblx0XHRmaWx0ZXJfc2NvcGUgPSBvcHRpb25zLmZpbHRlcl9zY29wZVxuXHRcdGZpbHRlcnMgPSBvcHRpb25zLmZpbHRlcnNcblx0XHRmaWx0ZXJGaWVsZHMgPSB7fVxuXHRcdGNvbXBvdW5kRmllbGRzID0gW11cblx0XHRvYmplY3RGaWVsZHMgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk/LmZpZWxkc1xuXHRcdF8uZWFjaCBmaWVsZHMsIChpdGVtLCBpbmRleCktPlxuXHRcdFx0c3BsaXRzID0gaXRlbS5zcGxpdChcIi5cIilcblx0XHRcdG5hbWUgPSBzcGxpdHNbMF1cblx0XHRcdG9iamVjdEZpZWxkID0gb2JqZWN0RmllbGRzW25hbWVdXG5cdFx0XHRpZiBzcGxpdHMubGVuZ3RoID4gMSBhbmQgb2JqZWN0RmllbGRcblx0XHRcdFx0Y2hpbGRLZXkgPSBpdGVtLnJlcGxhY2UgbmFtZSArIFwiLlwiLCBcIlwiXG5cdFx0XHRcdGNvbXBvdW5kRmllbGRzLnB1c2goe25hbWU6IG5hbWUsIGNoaWxkS2V5OiBjaGlsZEtleSwgZmllbGQ6IG9iamVjdEZpZWxkfSlcblx0XHRcdGZpbHRlckZpZWxkc1tuYW1lXSA9IDFcblxuXHRcdHNlbGVjdG9yID0ge31cblx0XHR1c2VySWQgPSB0aGlzLnVzZXJJZFxuXHRcdHNlbGVjdG9yLnNwYWNlID0gc3BhY2Vcblx0XHRpZiBmaWx0ZXJfc2NvcGUgPT0gXCJzcGFjZXhcIlxuXHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSBcblx0XHRcdFx0JGluOiBbbnVsbCxzcGFjZV1cblx0XHRlbHNlIGlmIGZpbHRlcl9zY29wZSA9PSBcIm1pbmVcIlxuXHRcdFx0c2VsZWN0b3Iub3duZXIgPSB1c2VySWRcblxuXHRcdGlmIENyZWF0b3IuaXNDb21tb25TcGFjZShzcGFjZSkgJiYgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2UsIEB1c2VySWQpXG5cdFx0XHRkZWxldGUgc2VsZWN0b3Iuc3BhY2VcblxuXHRcdGlmIGZpbHRlcnMgYW5kIGZpbHRlcnMubGVuZ3RoID4gMFxuXHRcdFx0c2VsZWN0b3JbXCIkYW5kXCJdID0gZmlsdGVyc1xuXG5cdFx0Y3Vyc29yID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yLCB7ZmllbGRzOiBmaWx0ZXJGaWVsZHMsIHNraXA6IDAsIGxpbWl0OiAxMDAwMH0pXG4jXHRcdGlmIGN1cnNvci5jb3VudCgpID4gMTAwMDBcbiNcdFx0XHRyZXR1cm4gW11cblx0XHRyZXN1bHQgPSBjdXJzb3IuZmV0Y2goKVxuXHRcdGlmIGNvbXBvdW5kRmllbGRzLmxlbmd0aFxuXHRcdFx0cmVzdWx0ID0gcmVzdWx0Lm1hcCAoaXRlbSxpbmRleCktPlxuXHRcdFx0XHRfLmVhY2ggY29tcG91bmRGaWVsZHMsIChjb21wb3VuZEZpZWxkSXRlbSwgaW5kZXgpLT5cblx0XHRcdFx0XHRpdGVtS2V5ID0gY29tcG91bmRGaWVsZEl0ZW0ubmFtZSArIFwiKiUqXCIgKyBjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleS5yZXBsYWNlKC9cXC4vZywgXCIqJSpcIilcblx0XHRcdFx0XHRpdGVtVmFsdWUgPSBpdGVtW2NvbXBvdW5kRmllbGRJdGVtLm5hbWVdXG5cdFx0XHRcdFx0dHlwZSA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLnR5cGVcblx0XHRcdFx0XHRpZiBbXCJsb29rdXBcIiwgXCJtYXN0ZXJfZGV0YWlsXCJdLmluZGV4T2YodHlwZSkgPiAtMVxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQucmVmZXJlbmNlX3RvXG5cdFx0XHRcdFx0XHRjb21wb3VuZEZpbHRlckZpZWxkcyA9IHt9XG5cdFx0XHRcdFx0XHRjb21wb3VuZEZpbHRlckZpZWxkc1tjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV0gPSAxXG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VJdGVtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bykuZmluZE9uZSB7X2lkOiBpdGVtVmFsdWV9LCBmaWVsZHM6IGNvbXBvdW5kRmlsdGVyRmllbGRzXG5cdFx0XHRcdFx0XHRpZiByZWZlcmVuY2VJdGVtXG5cdFx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSByZWZlcmVuY2VJdGVtW2NvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5XVxuXHRcdFx0XHRcdGVsc2UgaWYgdHlwZSA9PSBcInNlbGVjdFwiXG5cdFx0XHRcdFx0XHRvcHRpb25zID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQub3B0aW9uc1xuXHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IF8uZmluZFdoZXJlKG9wdGlvbnMsIHt2YWx1ZTogaXRlbVZhbHVlfSk/LmxhYmVsIG9yIGl0ZW1WYWx1ZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSBpdGVtVmFsdWVcblx0XHRcdFx0XHR1bmxlc3MgaXRlbVtpdGVtS2V5XVxuXHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IFwiLS1cIlxuXHRcdFx0XHRyZXR1cm4gaXRlbVxuXHRcdFx0cmV0dXJuIHJlc3VsdFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiByZXN1bHRcblxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICAncmVwb3J0X2RhdGEnOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGNvbXBvdW5kRmllbGRzLCBjdXJzb3IsIGZpZWxkcywgZmlsdGVyRmllbGRzLCBmaWx0ZXJfc2NvcGUsIGZpbHRlcnMsIG9iamVjdEZpZWxkcywgb2JqZWN0X25hbWUsIHJlZiwgcmVzdWx0LCBzZWxlY3Rvciwgc3BhY2UsIHVzZXJJZDtcbiAgICBjaGVjayhvcHRpb25zLCBPYmplY3QpO1xuICAgIHNwYWNlID0gb3B0aW9ucy5zcGFjZTtcbiAgICBmaWVsZHMgPSBvcHRpb25zLmZpZWxkcztcbiAgICBvYmplY3RfbmFtZSA9IG9wdGlvbnMub2JqZWN0X25hbWU7XG4gICAgZmlsdGVyX3Njb3BlID0gb3B0aW9ucy5maWx0ZXJfc2NvcGU7XG4gICAgZmlsdGVycyA9IG9wdGlvbnMuZmlsdGVycztcbiAgICBmaWx0ZXJGaWVsZHMgPSB7fTtcbiAgICBjb21wb3VuZEZpZWxkcyA9IFtdO1xuICAgIG9iamVjdEZpZWxkcyA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwO1xuICAgIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICB2YXIgY2hpbGRLZXksIG5hbWUsIG9iamVjdEZpZWxkLCBzcGxpdHM7XG4gICAgICBzcGxpdHMgPSBpdGVtLnNwbGl0KFwiLlwiKTtcbiAgICAgIG5hbWUgPSBzcGxpdHNbMF07XG4gICAgICBvYmplY3RGaWVsZCA9IG9iamVjdEZpZWxkc1tuYW1lXTtcbiAgICAgIGlmIChzcGxpdHMubGVuZ3RoID4gMSAmJiBvYmplY3RGaWVsZCkge1xuICAgICAgICBjaGlsZEtleSA9IGl0ZW0ucmVwbGFjZShuYW1lICsgXCIuXCIsIFwiXCIpO1xuICAgICAgICBjb21wb3VuZEZpZWxkcy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgIGNoaWxkS2V5OiBjaGlsZEtleSxcbiAgICAgICAgICBmaWVsZDogb2JqZWN0RmllbGRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmlsdGVyRmllbGRzW25hbWVdID0gMTtcbiAgICB9KTtcbiAgICBzZWxlY3RvciA9IHt9O1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2U7XG4gICAgaWYgKGZpbHRlcl9zY29wZSA9PT0gXCJzcGFjZXhcIikge1xuICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAgICRpbjogW251bGwsIHNwYWNlXVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGZpbHRlcl9zY29wZSA9PT0gXCJtaW5lXCIpIHtcbiAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICAgIH1cbiAgICBpZiAoQ3JlYXRvci5pc0NvbW1vblNwYWNlKHNwYWNlKSAmJiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZSwgdGhpcy51c2VySWQpKSB7XG4gICAgICBkZWxldGUgc2VsZWN0b3Iuc3BhY2U7XG4gICAgfVxuICAgIGlmIChmaWx0ZXJzICYmIGZpbHRlcnMubGVuZ3RoID4gMCkge1xuICAgICAgc2VsZWN0b3JbXCIkYW5kXCJdID0gZmlsdGVycztcbiAgICB9XG4gICAgY3Vyc29yID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yLCB7XG4gICAgICBmaWVsZHM6IGZpbHRlckZpZWxkcyxcbiAgICAgIHNraXA6IDAsXG4gICAgICBsaW1pdDogMTAwMDBcbiAgICB9KTtcbiAgICByZXN1bHQgPSBjdXJzb3IuZmV0Y2goKTtcbiAgICBpZiAoY29tcG91bmRGaWVsZHMubGVuZ3RoKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHQubWFwKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgIF8uZWFjaChjb21wb3VuZEZpZWxkcywgZnVuY3Rpb24oY29tcG91bmRGaWVsZEl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgdmFyIGNvbXBvdW5kRmlsdGVyRmllbGRzLCBpdGVtS2V5LCBpdGVtVmFsdWUsIHJlZjEsIHJlZmVyZW5jZUl0ZW0sIHJlZmVyZW5jZV90bywgdHlwZTtcbiAgICAgICAgICBpdGVtS2V5ID0gY29tcG91bmRGaWVsZEl0ZW0ubmFtZSArIFwiKiUqXCIgKyBjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleS5yZXBsYWNlKC9cXC4vZywgXCIqJSpcIik7XG4gICAgICAgICAgaXRlbVZhbHVlID0gaXRlbVtjb21wb3VuZEZpZWxkSXRlbS5uYW1lXTtcbiAgICAgICAgICB0eXBlID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQudHlwZTtcbiAgICAgICAgICBpZiAoW1wibG9va3VwXCIsIFwibWFzdGVyX2RldGFpbFwiXS5pbmRleE9mKHR5cGUpID4gLTEpIHtcbiAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgIGNvbXBvdW5kRmlsdGVyRmllbGRzID0ge307XG4gICAgICAgICAgICBjb21wb3VuZEZpbHRlckZpZWxkc1tjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV0gPSAxO1xuICAgICAgICAgICAgcmVmZXJlbmNlSXRlbSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8pLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IGl0ZW1WYWx1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IGNvbXBvdW5kRmlsdGVyRmllbGRzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyZWZlcmVuY2VJdGVtKSB7XG4gICAgICAgICAgICAgIGl0ZW1baXRlbUtleV0gPSByZWZlcmVuY2VJdGVtW2NvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5vcHRpb25zO1xuICAgICAgICAgICAgaXRlbVtpdGVtS2V5XSA9ICgocmVmMSA9IF8uZmluZFdoZXJlKG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgdmFsdWU6IGl0ZW1WYWx1ZVxuICAgICAgICAgICAgfSkpICE9IG51bGwgPyByZWYxLmxhYmVsIDogdm9pZCAwKSB8fCBpdGVtVmFsdWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl0ZW1baXRlbUtleV0gPSBpdGVtVmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghaXRlbVtpdGVtS2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW1baXRlbUtleV0gPSBcIi0tXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG59KTtcbiIsIiMjI1xuICAgIHR5cGU6IFwidXNlclwiXG4gICAgb2JqZWN0X25hbWU6IFwib2JqZWN0X2xpc3R2aWV3c1wiXG4gICAgcmVjb3JkX2lkOiBcIntvYmplY3RfbmFtZX0se2xpc3R2aWV3X2lkfVwiXG4gICAgc2V0dGluZ3M6XG4gICAgICAgIGNvbHVtbl93aWR0aDogeyBmaWVsZF9hOiAxMDAsIGZpZWxkXzI6IDE1MCB9XG4gICAgICAgIHNvcnQ6IFtbXCJmaWVsZF9hXCIsIFwiZGVzY1wiXV1cbiAgICBvd25lcjoge3VzZXJJZH1cbiMjI1xuXG5NZXRlb3IubWV0aG9kc1xuICAgIFwidGFidWxhcl9zb3J0X3NldHRpbmdzXCI6IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBzb3J0KS0+XG4gICAgICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXG4gICAgICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIiwgb3duZXI6IHVzZXJJZH0pXG4gICAgICAgIGlmIHNldHRpbmdcbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5zb3J0XCI6IHNvcnR9fSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZG9jID0gXG4gICAgICAgICAgICAgICAgdHlwZTogXCJ1c2VyXCJcbiAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHt9XG4gICAgICAgICAgICAgICAgb3duZXI6IHVzZXJJZFxuXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9XG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydFxuXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpXG5cbiAgICBcInRhYnVsYXJfY29sdW1uX3dpZHRoX3NldHRpbmdzXCI6IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5fd2lkdGgpLT5cbiAgICAgICAgdXNlcklkID0gdGhpcy51c2VySWRcbiAgICAgICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLCBvd25lcjogdXNlcklkfSlcbiAgICAgICAgaWYgc2V0dGluZ1xuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LmNvbHVtbl93aWR0aFwiOiBjb2x1bW5fd2lkdGh9fSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZG9jID0gXG4gICAgICAgICAgICAgICAgdHlwZTogXCJ1c2VyXCJcbiAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHt9XG4gICAgICAgICAgICAgICAgb3duZXI6IHVzZXJJZFxuXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9XG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5jb2x1bW5fd2lkdGggPSBjb2x1bW5fd2lkdGhcblxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKVxuXG4gICAgXCJncmlkX3NldHRpbmdzXCI6IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5fd2lkdGgsIHNvcnQpLT5cbiAgICAgICAgdXNlcklkID0gdGhpcy51c2VySWRcbiAgICAgICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiLCBvd25lcjogdXNlcklkfSlcbiAgICAgICAgaWYgc2V0dGluZ1xuICAgICAgICAgICAgIyDmr4/mrKHpg73lvLrliLbmlLnlj5hfaWRfYWN0aW9uc+WIl+eahOWuveW6pu+8jOS7peino+WGs+W9k+eUqOaIt+WPquaUueWPmOWtl+auteasoeW6j+iAjOayoeacieaUueWPmOS7u+S9leWtl+auteWuveW6puaXtu+8jOWJjeerr+ayoeacieiuoumYheWIsOWtl+auteasoeW6j+WPmOabtOeahOaVsOaNrueahOmXrumimFxuICAgICAgICAgICAgY29sdW1uX3dpZHRoLl9pZF9hY3Rpb25zID0gaWYgc2V0dGluZy5zZXR0aW5nc1tcIiN7bGlzdF92aWV3X2lkfVwiXT8uY29sdW1uX3dpZHRoPy5faWRfYWN0aW9ucyA9PSA0NiB0aGVuIDQ3IGVsc2UgNDZcbiAgICAgICAgICAgIGlmIHNvcnRcbiAgICAgICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uc29ydFwiOiBzb3J0LCBcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5jb2x1bW5fd2lkdGhcIjogY29sdW1uX3dpZHRofX0pXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LmNvbHVtbl93aWR0aFwiOiBjb2x1bW5fd2lkdGh9fSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZG9jID1cbiAgICAgICAgICAgICAgICB0eXBlOiBcInVzZXJcIlxuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuICAgICAgICAgICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge31cbiAgICAgICAgICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge31cbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aFxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnRcblxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKSIsIlxuLypcbiAgICB0eXBlOiBcInVzZXJcIlxuICAgIG9iamVjdF9uYW1lOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICAgIHJlY29yZF9pZDogXCJ7b2JqZWN0X25hbWV9LHtsaXN0dmlld19pZH1cIlxuICAgIHNldHRpbmdzOlxuICAgICAgICBjb2x1bW5fd2lkdGg6IHsgZmllbGRfYTogMTAwLCBmaWVsZF8yOiAxNTAgfVxuICAgICAgICBzb3J0OiBbW1wiZmllbGRfYVwiLCBcImRlc2NcIl1dXG4gICAgb3duZXI6IHt1c2VySWR9XG4gKi9cbk1ldGVvci5tZXRob2RzKHtcbiAgXCJ0YWJ1bGFyX3NvcnRfc2V0dGluZ3NcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgc29ydCkge1xuICAgIHZhciBkb2MsIG9iaiwgc2V0dGluZywgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgIG93bmVyOiB1c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc2V0dGluZykge1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgb2JqID0ge30sXG4gICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5zb3J0XCJdID0gc29ydCxcbiAgICAgICAgICBvYmpcbiAgICAgICAgKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYyA9IHtcbiAgICAgICAgdHlwZTogXCJ1c2VyXCIsXG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgICAgc2V0dGluZ3M6IHt9LFxuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0O1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYyk7XG4gICAgfVxuICB9LFxuICBcInRhYnVsYXJfY29sdW1uX3dpZHRoX3NldHRpbmdzXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbl93aWR0aCkge1xuICAgIHZhciBkb2MsIG9iaiwgc2V0dGluZywgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgIG93bmVyOiB1c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc2V0dGluZykge1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgb2JqID0ge30sXG4gICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5jb2x1bW5fd2lkdGhcIl0gPSBjb2x1bW5fd2lkdGgsXG4gICAgICAgICAgb2JqXG4gICAgICAgIClcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2MgPSB7XG4gICAgICAgIHR5cGU6IFwidXNlclwiLFxuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge307XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5jb2x1bW5fd2lkdGggPSBjb2x1bW5fd2lkdGg7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH0sXG4gIFwiZ3JpZF9zZXR0aW5nc1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5fd2lkdGgsIHNvcnQpIHtcbiAgICB2YXIgZG9jLCBvYmosIG9iajEsIHJlZiwgcmVmMSwgc2V0dGluZywgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIixcbiAgICAgIG93bmVyOiB1c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc2V0dGluZykge1xuICAgICAgY29sdW1uX3dpZHRoLl9pZF9hY3Rpb25zID0gKChyZWYgPSBzZXR0aW5nLnNldHRpbmdzW1wiXCIgKyBsaXN0X3ZpZXdfaWRdKSAhPSBudWxsID8gKHJlZjEgPSByZWYuY29sdW1uX3dpZHRoKSAhPSBudWxsID8gcmVmMS5faWRfYWN0aW9ucyA6IHZvaWQgMCA6IHZvaWQgMCkgPT09IDQ2ID8gNDcgOiA0NjtcbiAgICAgIGlmIChzb3J0KSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDogKFxuICAgICAgICAgICAgb2JqID0ge30sXG4gICAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLnNvcnRcIl0gPSBzb3J0LFxuICAgICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5jb2x1bW5fd2lkdGhcIl0gPSBjb2x1bW5fd2lkdGgsXG4gICAgICAgICAgICBvYmpcbiAgICAgICAgICApXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgICBvYmoxID0ge30sXG4gICAgICAgICAgICBvYmoxW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5jb2x1bW5fd2lkdGhcIl0gPSBjb2x1bW5fd2lkdGgsXG4gICAgICAgICAgICBvYmoxXG4gICAgICAgICAgKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZG9jID0ge1xuICAgICAgICB0eXBlOiBcInVzZXJcIixcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiLFxuICAgICAgICBzZXR0aW5nczoge30sXG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH07XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoO1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnQ7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH1cbn0pO1xuIiwieG1sMmpzID0gcmVxdWlyZSAneG1sMmpzJ1xuZnMgPSByZXF1aXJlICdmcydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xubWtkaXJwID0gcmVxdWlyZSAnbWtkaXJwJ1xuXG5sb2dnZXIgPSBuZXcgTG9nZ2VyICdFeHBvcnRfVE9fWE1MJ1xuXG5fd3JpdGVYbWxGaWxlID0gKGpzb25PYmosb2JqTmFtZSkgLT5cblx0IyDovax4bWxcblx0YnVpbGRlciA9IG5ldyB4bWwyanMuQnVpbGRlcigpXG5cdHhtbCA9IGJ1aWxkZXIuYnVpbGRPYmplY3QganNvbk9ialxuXG5cdCMg6L2s5Li6YnVmZmVyXG5cdHN0cmVhbSA9IG5ldyBCdWZmZXIgeG1sXG5cblx0IyDmoLnmja7lvZPlpKnml7bpl7TnmoTlubTmnIjml6XkvZzkuLrlrZjlgqjot6/lvoRcblx0bm93ID0gbmV3IERhdGVcblx0eWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXG5cdG1vbnRoID0gbm93LmdldE1vbnRoKCkgKyAxXG5cdGRheSA9IG5vdy5nZXREYXRlKClcblxuXHQjIOaWh+S7tui3r+W+hFxuXHRmaWxlUGF0aCA9IHBhdGguam9pbihfX21ldGVvcl9ib290c3RyYXBfXy5zZXJ2ZXJEaXIsJy4uLy4uLy4uL2V4cG9ydC8nICsgeWVhciArICcvJyArIG1vbnRoICsgJy8nICsgZGF5ICsgJy8nICsgb2JqTmFtZSApXG5cdGZpbGVOYW1lID0ganNvbk9iaj8uX2lkICsgXCIueG1sXCJcblx0ZmlsZUFkZHJlc3MgPSBwYXRoLmpvaW4gZmlsZVBhdGgsIGZpbGVOYW1lXG5cblx0aWYgIWZzLmV4aXN0c1N5bmMgZmlsZVBhdGhcblx0XHRta2RpcnAuc3luYyBmaWxlUGF0aFxuXG5cdCMg5YaZ5YWl5paH5Lu2XG5cdGZzLndyaXRlRmlsZSBmaWxlQWRkcmVzcywgc3RyZWFtLCAoZXJyKSAtPlxuXHRcdGlmIGVyclxuXHRcdFx0bG9nZ2VyLmVycm9yIFwiI3tqc29uT2JqLl9pZH3lhpnlhaV4bWzmlofku7blpLHotKVcIixlcnJcblx0XG5cdHJldHVybiBmaWxlUGF0aFxuXG5cbiMg5pW055CGRmllbGRz55qEanNvbuaVsOaNrlxuX21peEZpZWxkc0RhdGEgPSAob2JqLG9iak5hbWUpIC0+XG5cdCMg5Yid5aeL5YyW5a+56LGh5pWw5o2uXG5cdGpzb25PYmogPSB7fVxuXHQjIOiOt+WPlmZpZWxkc1xuXHRvYmpGaWVsZHMgPSBDcmVhdG9yPy5nZXRPYmplY3Qob2JqTmFtZSk/LmZpZWxkc1xuXG5cdG1peERlZmF1bHQgPSAoZmllbGRfbmFtZSktPlxuXHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBvYmpbZmllbGRfbmFtZV0gfHwgXCJcIlxuXG5cdG1peERhdGUgPSAoZmllbGRfbmFtZSx0eXBlKS0+XG5cdFx0ZGF0ZSA9IG9ialtmaWVsZF9uYW1lXVxuXHRcdGlmIHR5cGUgPT0gXCJkYXRlXCJcblx0XHRcdGZvcm1hdCA9IFwiWVlZWS1NTS1ERFwiXG5cdFx0ZWxzZVxuXHRcdFx0Zm9ybWF0ID0gXCJZWVlZLU1NLUREIEhIOm1tOnNzXCJcblx0XHRpZiBkYXRlPyBhbmQgZm9ybWF0P1xuXHRcdFx0ZGF0ZVN0ciA9IG1vbWVudChkYXRlKS5mb3JtYXQoZm9ybWF0KVxuXHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBkYXRlU3RyIHx8IFwiXCJcblxuXHRtaXhCb29sID0gKGZpZWxkX25hbWUpLT5cblx0XHRpZiBvYmpbZmllbGRfbmFtZV0gPT0gdHJ1ZVxuXHRcdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5pivXCJcblx0XHRlbHNlIGlmIG9ialtmaWVsZF9uYW1lXSA9PSBmYWxzZVxuXHRcdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5ZCmXCJcblx0XHRlbHNlXG5cdFx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gXCJcIlxuXG5cdCMg5b6q546v5q+P5LiqZmllbGRzLOW5tuWIpOaWreWPluWAvFxuXHRfLmVhY2ggb2JqRmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRzd2l0Y2ggZmllbGQ/LnR5cGVcblx0XHRcdHdoZW4gXCJkYXRlXCIsXCJkYXRldGltZVwiIHRoZW4gbWl4RGF0ZSBmaWVsZF9uYW1lLGZpZWxkLnR5cGVcblx0XHRcdHdoZW4gXCJib29sZWFuXCIgdGhlbiBtaXhCb29sIGZpZWxkX25hbWVcblx0XHRcdGVsc2UgbWl4RGVmYXVsdCBmaWVsZF9uYW1lXG5cblx0cmV0dXJuIGpzb25PYmpcblxuIyDojrflj5blrZDooajmlbTnkIbmlbDmja5cbl9taXhSZWxhdGVkRGF0YSA9IChvYmosb2JqTmFtZSkgLT5cblx0IyDliJ3lp4vljJblr7nosaHmlbDmja5cblx0cmVsYXRlZF9vYmplY3RzID0ge31cblxuXHQjIOiOt+WPluebuOWFs+ihqFxuXHRyZWxhdGVkT2JqTmFtZXMgPSBDcmVhdG9yPy5nZXRBbGxSZWxhdGVkT2JqZWN0cyBvYmpOYW1lXG5cblx0IyDlvqrnjq/nm7jlhbPooahcblx0cmVsYXRlZE9iak5hbWVzLmZvckVhY2ggKHJlbGF0ZWRPYmpOYW1lKSAtPlxuXHRcdCMg5q+P5Liq6KGo5a6a5LmJ5LiA5Liq5a+56LGh5pWw57uEXG5cdFx0cmVsYXRlZFRhYmxlRGF0YSA9IFtdXG5cblx0XHQjICrorr7nva7lhbPogZTmkJzntKLmn6Xor6LnmoTlrZfmrrVcblx0XHQjIOmZhOS7tueahOWFs+iBlOaQnOe0ouWtl+auteaYr+Wumuatu+eahFxuXHRcdGlmIHJlbGF0ZWRPYmpOYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwicGFyZW50Lmlkc1wiXG5cdFx0ZWxzZVxuXHRcdFx0IyDojrflj5ZmaWVsZHNcblx0XHRcdGZpZWxkcyA9IENyZWF0b3I/Lk9iamVjdHNbcmVsYXRlZE9iak5hbWVdPy5maWVsZHNcblx0XHRcdCMg5b6q546v5q+P5LiqZmllbGQs5om+5Ye6cmVmZXJlbmNlX3Rv55qE5YWz6IGU5a2X5q61XG5cdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSBcIlwiXG5cdFx0XHRfLmVhY2ggZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRcdFx0aWYgZmllbGQ/LnJlZmVyZW5jZV90byA9PSBvYmpOYW1lXG5cdFx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gZmllbGRfbmFtZVxuXG5cdFx0IyDmoLnmja7mib7lh7rnmoTlhbPogZTlrZfmrrXvvIzmn6XlrZDooajmlbDmja5cblx0XHRpZiByZWxhdGVkX2ZpZWxkX25hbWVcblx0XHRcdHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmpOYW1lKVxuXHRcdFx0IyDojrflj5bliLDmiYDmnInnmoTmlbDmja5cblx0XHRcdHJlbGF0ZWRSZWNvcmRMaXN0ID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZCh7XCIje3JlbGF0ZWRfZmllbGRfbmFtZX1cIjpvYmouX2lkfSkuZmV0Y2goKVxuXHRcdFx0IyDlvqrnjq/mr4/kuIDmnaHmlbDmja5cblx0XHRcdHJlbGF0ZWRSZWNvcmRMaXN0LmZvckVhY2ggKHJlbGF0ZWRPYmopLT5cblx0XHRcdFx0IyDmlbTlkIhmaWVsZHPmlbDmja5cblx0XHRcdFx0ZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhIHJlbGF0ZWRPYmoscmVsYXRlZE9iak5hbWVcblx0XHRcdFx0IyDmiorkuIDmnaHorrDlvZXmj5LlhaXliLDlr7nosaHmlbDnu4TkuK1cblx0XHRcdFx0cmVsYXRlZFRhYmxlRGF0YS5wdXNoIGZpZWxkc0RhdGFcblxuXHRcdCMg5oqK5LiA5Liq5a2Q6KGo55qE5omA5pyJ5pWw5o2u5o+S5YWl5YiwcmVsYXRlZF9vYmplY3Rz5Lit77yM5YaN5b6q546v5LiL5LiA5LiqXG5cdFx0cmVsYXRlZF9vYmplY3RzW3JlbGF0ZWRPYmpOYW1lXSA9IHJlbGF0ZWRUYWJsZURhdGFcblxuXHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXG5cbiMgQ3JlYXRvci5FeHBvcnQyeG1sKClcbkNyZWF0b3IuRXhwb3J0MnhtbCA9IChvYmpOYW1lLCByZWNvcmRMaXN0KSAtPlxuXHRsb2dnZXIuaW5mbyBcIlJ1biBDcmVhdG9yLkV4cG9ydDJ4bWxcIlxuXG5cdGNvbnNvbGUudGltZSBcIkNyZWF0b3IuRXhwb3J0MnhtbFwiXG5cblx0IyDmtYvor5XmlbDmja5cblx0IyBvYmpOYW1lID0gXCJhcmNoaXZlX3JlY29yZHNcIlxuXG5cdCMg5p+l5om+5a+56LGh5pWw5o2uXG5cdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqTmFtZSlcblx0IyDmtYvor5XmlbDmja5cblx0cmVjb3JkTGlzdCA9IGNvbGxlY3Rpb24uZmluZCh7fSkuZmV0Y2goKVxuXG5cdHJlY29yZExpc3QuZm9yRWFjaCAocmVjb3JkT2JqKS0+XG5cdFx0anNvbk9iaiA9IHt9XG5cdFx0anNvbk9iai5faWQgPSByZWNvcmRPYmouX2lkXG5cblx0XHQjIOaVtOeQhuS4u+ihqOeahEZpZWxkc+aVsOaNrlxuXHRcdGZpZWxkc0RhdGEgPSBfbWl4RmllbGRzRGF0YSByZWNvcmRPYmosb2JqTmFtZVxuXHRcdGpzb25PYmpbb2JqTmFtZV0gPSBmaWVsZHNEYXRhXG5cblx0XHQjIOaVtOeQhuebuOWFs+ihqOaVsOaNrlxuXHRcdHJlbGF0ZWRfb2JqZWN0cyA9IF9taXhSZWxhdGVkRGF0YSByZWNvcmRPYmosb2JqTmFtZVxuXG5cdFx0anNvbk9ialtcInJlbGF0ZWRfb2JqZWN0c1wiXSA9IHJlbGF0ZWRfb2JqZWN0c1xuXG5cdFx0IyDovazkuLp4bWzkv53lrZjmlofku7Zcblx0XHRmaWxlUGF0aCA9IF93cml0ZVhtbEZpbGUganNvbk9iaixvYmpOYW1lXG5cblx0Y29uc29sZS50aW1lRW5kIFwiQ3JlYXRvci5FeHBvcnQyeG1sXCJcblx0cmV0dXJuIGZpbGVQYXRoIiwidmFyIF9taXhGaWVsZHNEYXRhLCBfbWl4UmVsYXRlZERhdGEsIF93cml0ZVhtbEZpbGUsIGZzLCBsb2dnZXIsIG1rZGlycCwgcGF0aCwgeG1sMmpzO1xuXG54bWwyanMgPSByZXF1aXJlKCd4bWwyanMnKTtcblxuZnMgPSByZXF1aXJlKCdmcycpO1xuXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG5ta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKTtcblxubG9nZ2VyID0gbmV3IExvZ2dlcignRXhwb3J0X1RPX1hNTCcpO1xuXG5fd3JpdGVYbWxGaWxlID0gZnVuY3Rpb24oanNvbk9iaiwgb2JqTmFtZSkge1xuICB2YXIgYnVpbGRlciwgZGF5LCBmaWxlQWRkcmVzcywgZmlsZU5hbWUsIGZpbGVQYXRoLCBtb250aCwgbm93LCBzdHJlYW0sIHhtbCwgeWVhcjtcbiAgYnVpbGRlciA9IG5ldyB4bWwyanMuQnVpbGRlcigpO1xuICB4bWwgPSBidWlsZGVyLmJ1aWxkT2JqZWN0KGpzb25PYmopO1xuICBzdHJlYW0gPSBuZXcgQnVmZmVyKHhtbCk7XG4gIG5vdyA9IG5ldyBEYXRlO1xuICB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gIG1vbnRoID0gbm93LmdldE1vbnRoKCkgKyAxO1xuICBkYXkgPSBub3cuZ2V0RGF0ZSgpO1xuICBmaWxlUGF0aCA9IHBhdGguam9pbihfX21ldGVvcl9ib290c3RyYXBfXy5zZXJ2ZXJEaXIsICcuLi8uLi8uLi9leHBvcnQvJyArIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGRheSArICcvJyArIG9iak5hbWUpO1xuICBmaWxlTmFtZSA9IChqc29uT2JqICE9IG51bGwgPyBqc29uT2JqLl9pZCA6IHZvaWQgMCkgKyBcIi54bWxcIjtcbiAgZmlsZUFkZHJlc3MgPSBwYXRoLmpvaW4oZmlsZVBhdGgsIGZpbGVOYW1lKTtcbiAgaWYgKCFmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSkge1xuICAgIG1rZGlycC5zeW5jKGZpbGVQYXRoKTtcbiAgfVxuICBmcy53cml0ZUZpbGUoZmlsZUFkZHJlc3MsIHN0cmVhbSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgcmV0dXJuIGxvZ2dlci5lcnJvcihqc29uT2JqLl9pZCArIFwi5YaZ5YWleG1s5paH5Lu25aSx6LSlXCIsIGVycik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZpbGVQYXRoO1xufTtcblxuX21peEZpZWxkc0RhdGEgPSBmdW5jdGlvbihvYmosIG9iak5hbWUpIHtcbiAgdmFyIGpzb25PYmosIG1peEJvb2wsIG1peERhdGUsIG1peERlZmF1bHQsIG9iakZpZWxkcywgcmVmO1xuICBqc29uT2JqID0ge307XG4gIG9iakZpZWxkcyA9IHR5cGVvZiBDcmVhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmIENyZWF0b3IgIT09IG51bGwgPyAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqTmFtZSkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwIDogdm9pZCAwO1xuICBtaXhEZWZhdWx0ID0gZnVuY3Rpb24oZmllbGRfbmFtZSkge1xuICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gb2JqW2ZpZWxkX25hbWVdIHx8IFwiXCI7XG4gIH07XG4gIG1peERhdGUgPSBmdW5jdGlvbihmaWVsZF9uYW1lLCB0eXBlKSB7XG4gICAgdmFyIGRhdGUsIGRhdGVTdHIsIGZvcm1hdDtcbiAgICBkYXRlID0gb2JqW2ZpZWxkX25hbWVdO1xuICAgIGlmICh0eXBlID09PSBcImRhdGVcIikge1xuICAgICAgZm9ybWF0ID0gXCJZWVlZLU1NLUREXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvcm1hdCA9IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiO1xuICAgIH1cbiAgICBpZiAoKGRhdGUgIT0gbnVsbCkgJiYgKGZvcm1hdCAhPSBudWxsKSkge1xuICAgICAgZGF0ZVN0ciA9IG1vbWVudChkYXRlKS5mb3JtYXQoZm9ybWF0KTtcbiAgICB9XG4gICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBkYXRlU3RyIHx8IFwiXCI7XG4gIH07XG4gIG1peEJvb2wgPSBmdW5jdGlvbihmaWVsZF9uYW1lKSB7XG4gICAgaWYgKG9ialtmaWVsZF9uYW1lXSA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuaYr1wiO1xuICAgIH0gZWxzZSBpZiAob2JqW2ZpZWxkX25hbWVdID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuWQplwiO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IFwiXCI7XG4gICAgfVxuICB9O1xuICBfLmVhY2gob2JqRmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIHN3aXRjaCAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnR5cGUgOiB2b2lkIDApIHtcbiAgICAgIGNhc2UgXCJkYXRlXCI6XG4gICAgICBjYXNlIFwiZGF0ZXRpbWVcIjpcbiAgICAgICAgcmV0dXJuIG1peERhdGUoZmllbGRfbmFtZSwgZmllbGQudHlwZSk7XG4gICAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgICByZXR1cm4gbWl4Qm9vbChmaWVsZF9uYW1lKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBtaXhEZWZhdWx0KGZpZWxkX25hbWUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBqc29uT2JqO1xufTtcblxuX21peFJlbGF0ZWREYXRhID0gZnVuY3Rpb24ob2JqLCBvYmpOYW1lKSB7XG4gIHZhciByZWxhdGVkT2JqTmFtZXMsIHJlbGF0ZWRfb2JqZWN0cztcbiAgcmVsYXRlZF9vYmplY3RzID0ge307XG4gIHJlbGF0ZWRPYmpOYW1lcyA9IHR5cGVvZiBDcmVhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmIENyZWF0b3IgIT09IG51bGwgPyBDcmVhdG9yLmdldEFsbFJlbGF0ZWRPYmplY3RzKG9iak5hbWUpIDogdm9pZCAwO1xuICByZWxhdGVkT2JqTmFtZXMuZm9yRWFjaChmdW5jdGlvbihyZWxhdGVkT2JqTmFtZSkge1xuICAgIHZhciBmaWVsZHMsIG9iajEsIHJlZiwgcmVsYXRlZENvbGxlY3Rpb24sIHJlbGF0ZWRSZWNvcmRMaXN0LCByZWxhdGVkVGFibGVEYXRhLCByZWxhdGVkX2ZpZWxkX25hbWU7XG4gICAgcmVsYXRlZFRhYmxlRGF0YSA9IFtdO1xuICAgIGlmIChyZWxhdGVkT2JqTmFtZSA9PT0gXCJjbXNfZmlsZXNcIikge1xuICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gXCJwYXJlbnQuaWRzXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpZWxkcyA9IHR5cGVvZiBDcmVhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmIENyZWF0b3IgIT09IG51bGwgPyAocmVmID0gQ3JlYXRvci5PYmplY3RzW3JlbGF0ZWRPYmpOYW1lXSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSBcIlwiO1xuICAgICAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgICAgaWYgKChmaWVsZCAhPSBudWxsID8gZmllbGQucmVmZXJlbmNlX3RvIDogdm9pZCAwKSA9PT0gb2JqTmFtZSkge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX2ZpZWxkX25hbWUgPSBmaWVsZF9uYW1lO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgICAgcmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iak5hbWUpO1xuICAgICAgcmVsYXRlZFJlY29yZExpc3QgPSByZWxhdGVkQ29sbGVjdGlvbi5maW5kKChcbiAgICAgICAgb2JqMSA9IHt9LFxuICAgICAgICBvYmoxW1wiXCIgKyByZWxhdGVkX2ZpZWxkX25hbWVdID0gb2JqLl9pZCxcbiAgICAgICAgb2JqMVxuICAgICAgKSkuZmV0Y2goKTtcbiAgICAgIHJlbGF0ZWRSZWNvcmRMaXN0LmZvckVhY2goZnVuY3Rpb24ocmVsYXRlZE9iaikge1xuICAgICAgICB2YXIgZmllbGRzRGF0YTtcbiAgICAgICAgZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhKHJlbGF0ZWRPYmosIHJlbGF0ZWRPYmpOYW1lKTtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRUYWJsZURhdGEucHVzaChmaWVsZHNEYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzW3JlbGF0ZWRPYmpOYW1lXSA9IHJlbGF0ZWRUYWJsZURhdGE7XG4gIH0pO1xuICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xufTtcblxuQ3JlYXRvci5FeHBvcnQyeG1sID0gZnVuY3Rpb24ob2JqTmFtZSwgcmVjb3JkTGlzdCkge1xuICB2YXIgY29sbGVjdGlvbjtcbiAgbG9nZ2VyLmluZm8oXCJSdW4gQ3JlYXRvci5FeHBvcnQyeG1sXCIpO1xuICBjb25zb2xlLnRpbWUoXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIik7XG4gIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqTmFtZSk7XG4gIHJlY29yZExpc3QgPSBjb2xsZWN0aW9uLmZpbmQoe30pLmZldGNoKCk7XG4gIHJlY29yZExpc3QuZm9yRWFjaChmdW5jdGlvbihyZWNvcmRPYmopIHtcbiAgICB2YXIgZmllbGRzRGF0YSwgZmlsZVBhdGgsIGpzb25PYmosIHJlbGF0ZWRfb2JqZWN0cztcbiAgICBqc29uT2JqID0ge307XG4gICAganNvbk9iai5faWQgPSByZWNvcmRPYmouX2lkO1xuICAgIGZpZWxkc0RhdGEgPSBfbWl4RmllbGRzRGF0YShyZWNvcmRPYmosIG9iak5hbWUpO1xuICAgIGpzb25PYmpbb2JqTmFtZV0gPSBmaWVsZHNEYXRhO1xuICAgIHJlbGF0ZWRfb2JqZWN0cyA9IF9taXhSZWxhdGVkRGF0YShyZWNvcmRPYmosIG9iak5hbWUpO1xuICAgIGpzb25PYmpbXCJyZWxhdGVkX29iamVjdHNcIl0gPSByZWxhdGVkX29iamVjdHM7XG4gICAgcmV0dXJuIGZpbGVQYXRoID0gX3dyaXRlWG1sRmlsZShqc29uT2JqLCBvYmpOYW1lKTtcbiAgfSk7XG4gIGNvbnNvbGUudGltZUVuZChcIkNyZWF0b3IuRXhwb3J0MnhtbFwiKTtcbiAgcmV0dXJuIGZpbGVQYXRoO1xufTtcbiIsIk1ldGVvci5tZXRob2RzIFxuXHRyZWxhdGVkX29iamVjdHNfcmVjb3JkczogKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCktPlxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXG5cdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJcblx0XHRcdHNlbGVjdG9yID0ge1wibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZH1cblx0XHRlbHNlXG5cdFx0XHRzZWxlY3RvciA9IHtzcGFjZTogc3BhY2VJZH1cblx0XHRcblx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdCMg6ZmE5Lu255qE5YWz6IGU5pCc57Si5p2h5Lu25piv5a6a5q2755qEXG5cdFx0XHRzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWVcblx0XHRcdHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdXG5cdFx0ZWxzZVxuXHRcdFx0c2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZFxuXG5cdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0XHRpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLmFsbG93UmVhZFxuXHRcdFx0c2VsZWN0b3Iub3duZXIgPSB1c2VySWRcblx0XHRcblx0XHRyZWxhdGVkX3JlY29yZHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvcilcblx0XHRyZXR1cm4gcmVsYXRlZF9yZWNvcmRzLmNvdW50KCkiLCJNZXRlb3IubWV0aG9kcyh7XG4gIHJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpIHtcbiAgICB2YXIgcGVybWlzc2lvbnMsIHJlbGF0ZWRfcmVjb3Jkcywgc2VsZWN0b3IsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiKSB7XG4gICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgXCJtZXRhZGF0YS5zcGFjZVwiOiBzcGFjZUlkXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgICBzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWU7XG4gICAgICBzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZDtcbiAgICB9XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy5hbGxvd1JlYWQpIHtcbiAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICAgIH1cbiAgICByZWxhdGVkX3JlY29yZHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlbGF0ZWRfcmVjb3Jkcy5jb3VudCgpO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdGdldFBlbmRpbmdTcGFjZUluZm86IChpbnZpdGVySWQsIHNwYWNlSWQpLT5cblx0XHRpbnZpdGVyTmFtZSA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogaW52aXRlcklkfSkubmFtZVxuXHRcdHNwYWNlTmFtZSA9IGRiLnNwYWNlcy5maW5kT25lKHtfaWQ6IHNwYWNlSWR9KS5uYW1lXG5cblx0XHRyZXR1cm4ge2ludml0ZXI6IGludml0ZXJOYW1lLCBzcGFjZTogc3BhY2VOYW1lfVxuXG5cdHJlZnVzZUpvaW5TcGFjZTogKF9pZCktPlxuXHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogX2lkfSx7JHNldDoge2ludml0ZV9zdGF0ZTogXCJyZWZ1c2VkXCJ9fSlcblxuXHRhY2NlcHRKb2luU3BhY2U6IChfaWQpLT5cblx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IF9pZH0seyRzZXQ6IHtpbnZpdGVfc3RhdGU6IFwiYWNjZXB0ZWRcIiwgdXNlcl9hY2NlcHRlZDogdHJ1ZX19KVxuXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGdldFBlbmRpbmdTcGFjZUluZm86IGZ1bmN0aW9uKGludml0ZXJJZCwgc3BhY2VJZCkge1xuICAgIHZhciBpbnZpdGVyTmFtZSwgc3BhY2VOYW1lO1xuICAgIGludml0ZXJOYW1lID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IGludml0ZXJJZFxuICAgIH0pLm5hbWU7XG4gICAgc3BhY2VOYW1lID0gZGIuc3BhY2VzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBzcGFjZUlkXG4gICAgfSkubmFtZTtcbiAgICByZXR1cm4ge1xuICAgICAgaW52aXRlcjogaW52aXRlck5hbWUsXG4gICAgICBzcGFjZTogc3BhY2VOYW1lXG4gICAgfTtcbiAgfSxcbiAgcmVmdXNlSm9pblNwYWNlOiBmdW5jdGlvbihfaWQpIHtcbiAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IF9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgaW52aXRlX3N0YXRlOiBcInJlZnVzZWRcIlxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBhY2NlcHRKb2luU3BhY2U6IGZ1bmN0aW9uKF9pZCkge1xuICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBpbnZpdGVfc3RhdGU6IFwiYWNjZXB0ZWRcIixcbiAgICAgICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoIFwiY3JlYXRvcl9vYmplY3RfcmVjb3JkXCIsIChvYmplY3RfbmFtZSwgaWQsIHNwYWNlX2lkKS0+XG5cdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKVxuXHRpZiBjb2xsZWN0aW9uXG5cdFx0cmV0dXJuIGNvbGxlY3Rpb24uZmluZCh7X2lkOiBpZH0pXG5cbiIsIk1ldGVvci5wdWJsaXNoKFwiY3JlYXRvcl9vYmplY3RfcmVjb3JkXCIsIGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBpZCwgc3BhY2VfaWQpIHtcbiAgdmFyIGNvbGxlY3Rpb247XG4gIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKTtcbiAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5maW5kKHtcbiAgICAgIF9pZDogaWRcbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IucHVibGlzaENvbXBvc2l0ZSBcInN0ZWVkb3Nfb2JqZWN0X3RhYnVsYXJcIiwgKHRhYmxlTmFtZSwgaWRzLCBmaWVsZHMsIHNwYWNlSWQpLT5cblx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdGNoZWNrKHRhYmxlTmFtZSwgU3RyaW5nKTtcblx0Y2hlY2soaWRzLCBBcnJheSk7XG5cdGNoZWNrKGZpZWxkcywgTWF0Y2guT3B0aW9uYWwoT2JqZWN0KSk7XG5cblx0X29iamVjdF9uYW1lID0gdGFibGVOYW1lLnJlcGxhY2UoXCJjcmVhdG9yX1wiLFwiXCIpXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfb2JqZWN0X25hbWUsIHNwYWNlSWQpXG5cblx0aWYgc3BhY2VJZFxuXHRcdF9vYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0TmFtZShfb2JqZWN0KVxuXG5cdG9iamVjdF9jb2xsZWNpdG9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKF9vYmplY3RfbmFtZSlcblxuXG5cdF9maWVsZHMgPSBfb2JqZWN0Py5maWVsZHNcblx0aWYgIV9maWVsZHMgfHwgIW9iamVjdF9jb2xsZWNpdG9uXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdHJlZmVyZW5jZV9maWVsZHMgPSBfLmZpbHRlciBfZmllbGRzLCAoZiktPlxuXHRcdHJldHVybiBfLmlzRnVuY3Rpb24oZi5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkoZi5yZWZlcmVuY2VfdG8pXG5cblx0c2VsZiA9IHRoaXNcblxuXHRzZWxmLnVuYmxvY2soKTtcblxuXHRpZiByZWZlcmVuY2VfZmllbGRzLmxlbmd0aCA+IDBcblx0XHRkYXRhID0ge1xuXHRcdFx0ZmluZDogKCktPlxuXHRcdFx0XHRzZWxmLnVuYmxvY2soKTtcblx0XHRcdFx0ZmllbGRfa2V5cyA9IHt9XG5cdFx0XHRcdF8uZWFjaCBfLmtleXMoZmllbGRzKSwgKGYpLT5cblx0XHRcdFx0XHR1bmxlc3MgL1xcdysoXFwuXFwkKXsxfVxcdz8vLnRlc3QoZilcblx0XHRcdFx0XHRcdGZpZWxkX2tleXNbZl0gPSAxXG5cdFx0XHRcdFxuXHRcdFx0XHRyZXR1cm4gb2JqZWN0X2NvbGxlY2l0b24uZmluZCh7X2lkOiB7JGluOiBpZHN9fSwge2ZpZWxkczogZmllbGRfa2V5c30pO1xuXHRcdH1cblxuXHRcdGRhdGEuY2hpbGRyZW4gPSBbXVxuXG5cdFx0a2V5cyA9IF8ua2V5cyhmaWVsZHMpXG5cblx0XHRpZiBrZXlzLmxlbmd0aCA8IDFcblx0XHRcdGtleXMgPSBfLmtleXMoX2ZpZWxkcylcblxuXHRcdF9rZXlzID0gW11cblxuXHRcdGtleXMuZm9yRWFjaCAoa2V5KS0+XG5cdFx0XHRpZiBfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddXG5cdFx0XHRcdF9rZXlzID0gX2tleXMuY29uY2F0KF8ubWFwKF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ10sIChrKS0+XG5cdFx0XHRcdFx0cmV0dXJuIGtleSArICcuJyArIGtcblx0XHRcdFx0KSlcblx0XHRcdF9rZXlzLnB1c2goa2V5KVxuXG5cdFx0X2tleXMuZm9yRWFjaCAoa2V5KS0+XG5cdFx0XHRyZWZlcmVuY2VfZmllbGQgPSBfZmllbGRzW2tleV1cblxuXHRcdFx0aWYgcmVmZXJlbmNlX2ZpZWxkICYmIChfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykgfHwgIV8uaXNFbXB0eShyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSkgICMgYW5kIENyZWF0b3IuQ29sbGVjdGlvbnNbcmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90b11cblx0XHRcdFx0ZGF0YS5jaGlsZHJlbi5wdXNoIHtcblx0XHRcdFx0XHRmaW5kOiAocGFyZW50KSAtPlxuXHRcdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRcdHNlbGYudW5ibG9jaygpO1xuXG5cdFx0XHRcdFx0XHRcdHF1ZXJ5ID0ge31cblxuXHRcdFx0XHRcdFx0XHQjIOihqOagvOWtkOWtl+auteeJueauiuWkhOeQhlxuXHRcdFx0XHRcdFx0XHRpZiAvXFx3KyhcXC5cXCRcXC4pezF9XFx3Ky8udGVzdChrZXkpXG5cdFx0XHRcdFx0XHRcdFx0cF9rID0ga2V5LnJlcGxhY2UoLyhcXHcrKVxcLlxcJFxcLlxcdysvaWcsIFwiJDFcIilcblx0XHRcdFx0XHRcdFx0XHRzX2sgPSBrZXkucmVwbGFjZSgvXFx3K1xcLlxcJFxcLihcXHcrKS9pZywgXCIkMVwiKVxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV9pZHMgPSBwYXJlbnRbcF9rXS5nZXRQcm9wZXJ0eShzX2spXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfaWRzID0ga2V5LnNwbGl0KCcuJykucmVkdWNlIChvLCB4KSAtPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvP1t4XVxuXHRcdFx0XHRcdFx0XHRcdCwgcGFyZW50XG5cblx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvKClcblxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkocmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRcdGlmIF8uaXNPYmplY3QocmVmZXJlbmNlX2lkcykgJiYgIV8uaXNBcnJheShyZWZlcmVuY2VfaWRzKVxuXHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX2lkcy5vXG5cdFx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfaWRzID0gcmVmZXJlbmNlX2lkcy5pZHMgfHwgW11cblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gW11cblxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkocmVmZXJlbmNlX2lkcylcblx0XHRcdFx0XHRcdFx0XHRxdWVyeS5faWQgPSB7JGluOiByZWZlcmVuY2VfaWRzfVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0cXVlcnkuX2lkID0gcmVmZXJlbmNlX2lkc1xuXG5cdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90b19vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWZlcmVuY2VfdG8sIHNwYWNlSWQpXG5cblx0XHRcdFx0XHRcdFx0bmFtZV9maWVsZF9rZXkgPSByZWZlcmVuY2VfdG9fb2JqZWN0Lk5BTUVfRklFTERfS0VZXG5cblx0XHRcdFx0XHRcdFx0Y2hpbGRyZW5fZmllbGRzID0ge19pZDogMSwgc3BhY2U6IDF9XG5cblx0XHRcdFx0XHRcdFx0aWYgbmFtZV9maWVsZF9rZXlcblx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbl9maWVsZHNbbmFtZV9maWVsZF9rZXldID0gMVxuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kKHF1ZXJ5LCB7XG5cdFx0XHRcdFx0XHRcdFx0ZmllbGRzOiBjaGlsZHJlbl9maWVsZHNcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlZmVyZW5jZV90bywgcGFyZW50LCBlKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gW11cblx0XHRcdFx0fVxuXG5cdFx0cmV0dXJuIGRhdGFcblx0ZWxzZVxuXHRcdHJldHVybiB7XG5cdFx0XHRmaW5kOiAoKS0+XG5cdFx0XHRcdHNlbGYudW5ibG9jaygpO1xuXHRcdFx0XHRyZXR1cm4gb2JqZWN0X2NvbGxlY2l0b24uZmluZCh7X2lkOiB7JGluOiBpZHN9fSwge2ZpZWxkczogZmllbGRzfSlcblx0XHR9O1xuXG4iLCJNZXRlb3IucHVibGlzaENvbXBvc2l0ZShcInN0ZWVkb3Nfb2JqZWN0X3RhYnVsYXJcIiwgZnVuY3Rpb24odGFibGVOYW1lLCBpZHMsIGZpZWxkcywgc3BhY2VJZCkge1xuICB2YXIgX2ZpZWxkcywgX2tleXMsIF9vYmplY3QsIF9vYmplY3RfbmFtZSwgZGF0YSwga2V5cywgb2JqZWN0X2NvbGxlY2l0b24sIHJlZmVyZW5jZV9maWVsZHMsIHNlbGY7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIGNoZWNrKHRhYmxlTmFtZSwgU3RyaW5nKTtcbiAgY2hlY2soaWRzLCBBcnJheSk7XG4gIGNoZWNrKGZpZWxkcywgTWF0Y2guT3B0aW9uYWwoT2JqZWN0KSk7XG4gIF9vYmplY3RfbmFtZSA9IHRhYmxlTmFtZS5yZXBsYWNlKFwiY3JlYXRvcl9cIiwgXCJcIik7XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfb2JqZWN0X25hbWUsIHNwYWNlSWQpO1xuICBpZiAoc3BhY2VJZCkge1xuICAgIF9vYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0TmFtZShfb2JqZWN0KTtcbiAgfVxuICBvYmplY3RfY29sbGVjaXRvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihfb2JqZWN0X25hbWUpO1xuICBfZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIGlmICghX2ZpZWxkcyB8fCAhb2JqZWN0X2NvbGxlY2l0b24pIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJlZmVyZW5jZV9maWVsZHMgPSBfLmZpbHRlcihfZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbihmLnJlZmVyZW5jZV90bykgfHwgIV8uaXNFbXB0eShmLnJlZmVyZW5jZV90byk7XG4gIH0pO1xuICBzZWxmID0gdGhpcztcbiAgc2VsZi51bmJsb2NrKCk7XG4gIGlmIChyZWZlcmVuY2VfZmllbGRzLmxlbmd0aCA+IDApIHtcbiAgICBkYXRhID0ge1xuICAgICAgZmluZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmaWVsZF9rZXlzO1xuICAgICAgICBzZWxmLnVuYmxvY2soKTtcbiAgICAgICAgZmllbGRfa2V5cyA9IHt9O1xuICAgICAgICBfLmVhY2goXy5rZXlzKGZpZWxkcyksIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICBpZiAoIS9cXHcrKFxcLlxcJCl7MX1cXHc/Ly50ZXN0KGYpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmllbGRfa2V5c1tmXSA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe1xuICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgJGluOiBpZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkX2tleXNcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBkYXRhLmNoaWxkcmVuID0gW107XG4gICAga2V5cyA9IF8ua2V5cyhmaWVsZHMpO1xuICAgIGlmIChrZXlzLmxlbmd0aCA8IDEpIHtcbiAgICAgIGtleXMgPSBfLmtleXMoX2ZpZWxkcyk7XG4gICAgfVxuICAgIF9rZXlzID0gW107XG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ10pIHtcbiAgICAgICAgX2tleXMgPSBfa2V5cy5jb25jYXQoXy5tYXAoX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXSwgZnVuY3Rpb24oaykge1xuICAgICAgICAgIHJldHVybiBrZXkgKyAnLicgKyBrO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX2tleXMucHVzaChrZXkpO1xuICAgIH0pO1xuICAgIF9rZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgcmVmZXJlbmNlX2ZpZWxkO1xuICAgICAgcmVmZXJlbmNlX2ZpZWxkID0gX2ZpZWxkc1trZXldO1xuICAgICAgaWYgKHJlZmVyZW5jZV9maWVsZCAmJiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykpKSB7XG4gICAgICAgIHJldHVybiBkYXRhLmNoaWxkcmVuLnB1c2goe1xuICAgICAgICAgIGZpbmQ6IGZ1bmN0aW9uKHBhcmVudCkge1xuICAgICAgICAgICAgdmFyIGNoaWxkcmVuX2ZpZWxkcywgZSwgbmFtZV9maWVsZF9rZXksIHBfaywgcXVlcnksIHJlZmVyZW5jZV9pZHMsIHJlZmVyZW5jZV90bywgcmVmZXJlbmNlX3RvX29iamVjdCwgc19rO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICAgICAgICAgIHF1ZXJ5ID0ge307XG4gICAgICAgICAgICAgIGlmICgvXFx3KyhcXC5cXCRcXC4pezF9XFx3Ky8udGVzdChrZXkpKSB7XG4gICAgICAgICAgICAgICAgcF9rID0ga2V5LnJlcGxhY2UoLyhcXHcrKVxcLlxcJFxcLlxcdysvaWcsIFwiJDFcIik7XG4gICAgICAgICAgICAgICAgc19rID0ga2V5LnJlcGxhY2UoL1xcdytcXC5cXCRcXC4oXFx3KykvaWcsIFwiJDFcIik7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlX2lkcyA9IHBhcmVudFtwX2tdLmdldFByb3BlcnR5KHNfayk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlX2lkcyA9IGtleS5zcGxpdCgnLicpLnJlZHVjZShmdW5jdGlvbihvLCB4KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbyAhPSBudWxsID8gb1t4XSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICB9LCBwYXJlbnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90bygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChfLmlzQXJyYXkocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIGlmIChfLmlzT2JqZWN0KHJlZmVyZW5jZV9pZHMpICYmICFfLmlzQXJyYXkocmVmZXJlbmNlX2lkcykpIHtcbiAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9pZHMubztcbiAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZV9pZHMgPSByZWZlcmVuY2VfaWRzLmlkcyB8fCBbXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpKSB7XG4gICAgICAgICAgICAgICAgcXVlcnkuX2lkID0ge1xuICAgICAgICAgICAgICAgICAgJGluOiByZWZlcmVuY2VfaWRzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBxdWVyeS5faWQgPSByZWZlcmVuY2VfaWRzO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlZmVyZW5jZV90b19vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWZlcmVuY2VfdG8sIHNwYWNlSWQpO1xuICAgICAgICAgICAgICBuYW1lX2ZpZWxkX2tleSA9IHJlZmVyZW5jZV90b19vYmplY3QuTkFNRV9GSUVMRF9LRVk7XG4gICAgICAgICAgICAgIGNoaWxkcmVuX2ZpZWxkcyA9IHtcbiAgICAgICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICAgICAgc3BhY2U6IDFcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgaWYgKG5hbWVfZmllbGRfa2V5KSB7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW5fZmllbGRzW25hbWVfZmllbGRfa2V5XSA9IDE7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8sIHNwYWNlSWQpLmZpbmQocXVlcnksIHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IGNoaWxkcmVuX2ZpZWxkc1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVmZXJlbmNlX3RvLCBwYXJlbnQsIGUpO1xuICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgZmluZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYudW5ibG9jaygpO1xuICAgICAgICByZXR1cm4gb2JqZWN0X2NvbGxlY2l0b24uZmluZCh7XG4gICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAkaW46IGlkc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogZmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggXCJvYmplY3RfbGlzdHZpZXdzXCIsIChvYmplY3RfbmFtZSwgc3BhY2VJZCktPlxuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBzcGFjZTogc3BhY2VJZCAsXCIkb3JcIjpbe293bmVyOiB1c2VySWR9LCB7c2hhcmVkOiB0cnVlfV19KSIsIk1ldGVvci5wdWJsaXNoIFwidXNlcl90YWJ1bGFyX3NldHRpbmdzXCIsIChvYmplY3RfbmFtZSktPlxuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZCh7b2JqZWN0X25hbWU6IHskaW46IG9iamVjdF9uYW1lfSwgcmVjb3JkX2lkOiB7JGluOiBbXCJvYmplY3RfbGlzdHZpZXdzXCIsIFwib2JqZWN0X2dyaWR2aWV3c1wiXX0sIG93bmVyOiB1c2VySWR9KVxuIiwiTWV0ZW9yLnB1Ymxpc2ggXCJyZWxhdGVkX29iamVjdHNfcmVjb3Jkc1wiLCAob2JqZWN0X25hbWUsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZUlkKS0+XG5cdHVzZXJJZCA9IHRoaXMudXNlcklkXG5cdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXG5cdFx0c2VsZWN0b3IgPSB7XCJtZXRhZGF0YS5zcGFjZVwiOiBzcGFjZUlkfVxuXHRlbHNlXG5cdFx0c2VsZWN0b3IgPSB7c3BhY2U6IHNwYWNlSWR9XG5cdFxuXHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHQjIOmZhOS7tueahOWFs+iBlOaQnOe0ouadoeS7tuaYr+Wumuatu+eahFxuXHRcdHNlbGVjdG9yW1wicGFyZW50Lm9cIl0gPSBvYmplY3RfbmFtZVxuXHRcdHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdXG5cdGVsc2Vcblx0XHRzZWxlY3RvcltyZWxhdGVkX2ZpZWxkX25hbWVdID0gcmVjb3JkX2lkXG5cblx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcblx0XHRzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxuXHRcblx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKSIsIk1ldGVvci5wdWJsaXNoKFwicmVsYXRlZF9vYmplY3RzX3JlY29yZHNcIiwgZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZUlkKSB7XG4gIHZhciBwZXJtaXNzaW9ucywgc2VsZWN0b3IsIHVzZXJJZDtcbiAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpIHtcbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIFwibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH07XG4gIH1cbiAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICBzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWU7XG4gICAgc2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF07XG4gIH0gZWxzZSB7XG4gICAgc2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZDtcbiAgfVxuICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy5hbGxvd1JlYWQpIHtcbiAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZDtcbiAgfVxuICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCAnc3BhY2VfdXNlcl9pbmZvJywgKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZCh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0pIiwiXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblxuXHRNZXRlb3IucHVibGlzaCAnY29udGFjdHNfdmlld19saW1pdHMnLCAoc3BhY2VJZCktPlxuXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0XHR1bmxlc3Mgc3BhY2VJZFxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdFx0c2VsZWN0b3IgPVxuXHRcdFx0c3BhY2U6IHNwYWNlSWRcblx0XHRcdGtleTogJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJ1xuXG5cdFx0cmV0dXJuIGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoc2VsZWN0b3IpIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnY29udGFjdHNfdmlld19saW1pdHMnLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIHNlbGVjdG9yO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIGtleTogJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJ1xuICAgIH07XG4gICAgcmV0dXJuIGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoc2VsZWN0b3IpO1xuICB9KTtcbn1cbiIsIlxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cblx0TWV0ZW9yLnB1Ymxpc2ggJ2NvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzJywgKHNwYWNlSWQpLT5cblxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdFx0dW5sZXNzIHNwYWNlSWRcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRcdHNlbGVjdG9yID1cblx0XHRcdHNwYWNlOiBzcGFjZUlkXG5cdFx0XHRrZXk6ICdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycydcblxuXHRcdHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKSIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ2NvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBzZWxlY3RvcjtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBrZXk6ICdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycydcbiAgICB9O1xuICAgIHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKTtcbiAgfSk7XG59XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0TWV0ZW9yLnB1Ymxpc2ggJ3NwYWNlX25lZWRfdG9fY29uZmlybScsICgpLT5cblx0XHR1c2VySWQgPSB0aGlzLnVzZXJJZFxuXHRcdHJldHVybiBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VySWQsIGludml0ZV9zdGF0ZTogXCJwZW5kaW5nXCJ9KSIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ3NwYWNlX25lZWRfdG9fY29uZmlybScsIGZ1bmN0aW9uKCkge1xuICAgIHZhciB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgaW52aXRlX3N0YXRlOiBcInBlbmRpbmdcIlxuICAgIH0pO1xuICB9KTtcbn1cbiIsInBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge31cblxucGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rmxvd1Blcm1pc3Npb25zID0gKGZsb3dfaWQsIHVzZXJfaWQpIC0+XG5cdCMg5qC55o2uOmZsb3dfaWTmn6XliLDlr7nlupTnmoRmbG93XG5cdGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZClcblx0c3BhY2VfaWQgPSBmbG93LnNwYWNlXG5cdCMg5qC55o2uc3BhY2VfaWTlkow6dXNlcl9pZOWIsG9yZ2FuaXphdGlvbnPooajkuK3mn6XliLDnlKjmiLfmiYDlsZ7miYDmnInnmoRvcmdfaWTvvIjljIXmi6zkuIrnuqfnu4RJRO+8iVxuXHRvcmdfaWRzID0gbmV3IEFycmF5XG5cdG9yZ2FuaXphdGlvbnMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuXHRcdHNwYWNlOiBzcGFjZV9pZCwgdXNlcnM6IHVzZXJfaWQgfSwgeyBmaWVsZHM6IHsgcGFyZW50czogMSB9IH0pLmZldGNoKClcblx0Xy5lYWNoKG9yZ2FuaXphdGlvbnMsIChvcmcpIC0+XG5cdFx0b3JnX2lkcy5wdXNoKG9yZy5faWQpXG5cdFx0aWYgb3JnLnBhcmVudHNcblx0XHRcdF8uZWFjaChvcmcucGFyZW50cywgKHBhcmVudF9pZCkgLT5cblx0XHRcdFx0b3JnX2lkcy5wdXNoKHBhcmVudF9pZClcblx0XHRcdClcblx0KVxuXHRvcmdfaWRzID0gXy51bmlxKG9yZ19pZHMpXG5cdG15X3Blcm1pc3Npb25zID0gbmV3IEFycmF5XG5cdGlmIGZsb3cucGVybXNcblx0XHQjIOWIpOaWrWZsb3cucGVybXMudXNlcnNfY2FuX2FkbWlu5Lit5piv5ZCm5YyF5ZCr5b2T5YmN55So5oi377yMXG5cdFx0IyDmiJbogIVmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZOaYr+WQpuWMheWQqzTmraXlvpfliLDnmoRvcmdfaWTmlbDnu4TkuK3nmoTku7vkvZXkuIDkuKrvvIxcblx0XHQjIOiLpeaYr++8jOWImeWcqOi/lOWbnueahOaVsOe7hOS4reWKoOS4imFkZFxuXHRcdGlmIGZsb3cucGVybXMudXNlcnNfY2FuX2FkZFxuXHRcdFx0dXNlcnNfY2FuX2FkZCA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkZFxuXHRcdFx0aWYgdXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VyX2lkKVxuXHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpXG5cblx0XHRpZiBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZFxuXHRcdFx0b3Jnc19jYW5fYWRkID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGRcblx0XHRcdF8uZWFjaChvcmdfaWRzLCAob3JnX2lkKSAtPlxuXHRcdFx0XHRpZiBvcmdzX2Nhbl9hZGQuaW5jbHVkZXMob3JnX2lkKVxuXHRcdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJhZGRcIilcblx0XHRcdClcblx0XHQjIOWIpOaWrWZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3LkuK3mmK/lkKbljIXlkKvlvZPliY3nlKjmiLfvvIxcblx0XHQjIOaIluiAhWZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvcuaYr+WQpuWMheWQqzTmraXlvpfliLDnmoRvcmdfaWTmlbDnu4TkuK3nmoTku7vkvZXkuIDkuKrvvIxcblx0XHQjIOiLpeaYr++8jOWImeWcqOi/lOWbnueahOaVsOe7hOS4reWKoOS4im1vbml0b3Jcblx0XHRpZiBmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yXG5cdFx0XHR1c2Vyc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3Jcblx0XHRcdGlmIHVzZXJzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKHVzZXJfaWQpXG5cdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJtb25pdG9yXCIpXG5cblx0XHRpZiBmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3Jcblx0XHRcdG9yZ3NfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3Jcblx0XHRcdF8uZWFjaChvcmdfaWRzLCAob3JnX2lkKSAtPlxuXHRcdFx0XHRpZiBvcmdzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKG9yZ19pZClcblx0XHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKVxuXHRcdFx0KVxuXHRcdCMg5Yik5patZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW7kuK3mmK/lkKbljIXlkKvlvZPliY3nlKjmiLfvvIxcblx0XHQjIOaIluiAhWZsb3cucGVybXMub3Jnc19jYW5fYWRtaW7mmK/lkKbljIXlkKs05q2l5b6X5Yiw55qEb3JnX2lk5pWw57uE5Lit55qE5Lu75L2V5LiA5Liq77yMXG5cdFx0IyDoi6XmmK/vvIzliJnlnKjov5Tlm57nmoTmlbDnu4TkuK3liqDkuIphZG1pblxuXHRcdGlmIGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluXG5cdFx0XHR1c2Vyc19jYW5fYWRtaW4gPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pblxuXHRcdFx0aWYgdXNlcnNfY2FuX2FkbWluLmluY2x1ZGVzKHVzZXJfaWQpXG5cdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKVxuXG5cdFx0aWYgZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pblxuXHRcdFx0b3Jnc19jYW5fYWRtaW4gPSBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluXG5cdFx0XHRfLmVhY2gob3JnX2lkcywgKG9yZ19pZCkgLT5cblx0XHRcdFx0aWYgb3Jnc19jYW5fYWRtaW4uaW5jbHVkZXMob3JnX2lkKVxuXHRcdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKVxuXHRcdFx0KVxuXG5cdG15X3Blcm1pc3Npb25zID0gXy51bmlxKG15X3Blcm1pc3Npb25zKVxuXHRyZXR1cm4gbXlfcGVybWlzc2lvbnMiLCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbnBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge307XG5cbnBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3dQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKGZsb3dfaWQsIHVzZXJfaWQpIHtcbiAgdmFyIGZsb3csIG15X3Blcm1pc3Npb25zLCBvcmdfaWRzLCBvcmdhbml6YXRpb25zLCBvcmdzX2Nhbl9hZGQsIG9yZ3NfY2FuX2FkbWluLCBvcmdzX2Nhbl9tb25pdG9yLCBzcGFjZV9pZCwgdXNlcnNfY2FuX2FkZCwgdXNlcnNfY2FuX2FkbWluLCB1c2Vyc19jYW5fbW9uaXRvcjtcbiAgZmxvdyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyhmbG93X2lkKTtcbiAgc3BhY2VfaWQgPSBmbG93LnNwYWNlO1xuICBvcmdfaWRzID0gbmV3IEFycmF5O1xuICBvcmdhbml6YXRpb25zID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdXNlcnM6IHVzZXJfaWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgcGFyZW50czogMVxuICAgIH1cbiAgfSkuZmV0Y2goKTtcbiAgXy5lYWNoKG9yZ2FuaXphdGlvbnMsIGZ1bmN0aW9uKG9yZykge1xuICAgIG9yZ19pZHMucHVzaChvcmcuX2lkKTtcbiAgICBpZiAob3JnLnBhcmVudHMpIHtcbiAgICAgIHJldHVybiBfLmVhY2gob3JnLnBhcmVudHMsIGZ1bmN0aW9uKHBhcmVudF9pZCkge1xuICAgICAgICByZXR1cm4gb3JnX2lkcy5wdXNoKHBhcmVudF9pZCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBvcmdfaWRzID0gXy51bmlxKG9yZ19pZHMpO1xuICBteV9wZXJtaXNzaW9ucyA9IG5ldyBBcnJheTtcbiAgaWYgKGZsb3cucGVybXMpIHtcbiAgICBpZiAoZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRkKSB7XG4gICAgICB1c2Vyc19jYW5fYWRkID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRkO1xuICAgICAgaWYgKHVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcl9pZCkpIHtcbiAgICAgICAgbXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMub3Jnc19jYW5fYWRkKSB7XG4gICAgICBvcmdzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZDtcbiAgICAgIF8uZWFjaChvcmdfaWRzLCBmdW5jdGlvbihvcmdfaWQpIHtcbiAgICAgICAgaWYgKG9yZ3NfY2FuX2FkZC5pbmNsdWRlcyhvcmdfaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZGRcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvcikge1xuICAgICAgdXNlcnNfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yO1xuICAgICAgaWYgKHVzZXJzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKHVzZXJfaWQpKSB7XG4gICAgICAgIG15X3Blcm1pc3Npb25zLnB1c2goXCJtb25pdG9yXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yKSB7XG4gICAgICBvcmdzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yO1xuICAgICAgXy5lYWNoKG9yZ19pZHMsIGZ1bmN0aW9uKG9yZ19pZCkge1xuICAgICAgICBpZiAob3Jnc19jYW5fbW9uaXRvci5pbmNsdWRlcyhvcmdfaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIG15X3Blcm1pc3Npb25zLnB1c2goXCJtb25pdG9yXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluKSB7XG4gICAgICB1c2Vyc19jYW5fYWRtaW4gPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbjtcbiAgICAgIGlmICh1c2Vyc19jYW5fYWRtaW4uaW5jbHVkZXModXNlcl9pZCkpIHtcbiAgICAgICAgbXlfcGVybWlzc2lvbnMucHVzaChcImFkbWluXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pbikge1xuICAgICAgb3Jnc19jYW5fYWRtaW4gPSBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluO1xuICAgICAgXy5lYWNoKG9yZ19pZHMsIGZ1bmN0aW9uKG9yZ19pZCkge1xuICAgICAgICBpZiAob3Jnc19jYW5fYWRtaW4uaW5jbHVkZXMob3JnX2lkKSkge1xuICAgICAgICAgIHJldHVybiBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBteV9wZXJtaXNzaW9ucyA9IF8udW5pcShteV9wZXJtaXNzaW9ucyk7XG4gIHJldHVybiBteV9wZXJtaXNzaW9ucztcbn07XG4iLCIjIOWPkei1t+WuoeaJuVxuX2V2YWwgPSByZXF1aXJlKCdldmFsJylcbm9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcblxuZ2V0T2JqZWN0Q29uZmlnID0gKG9iamVjdEFwaU5hbWUpIC0+XG5cdHJldHVybiBvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkudG9Db25maWcoKVxuXG5nZXRPYmplY3ROYW1lRmllbGRLZXkgPSAob2JqZWN0QXBpTmFtZSkgLT5cblx0cmV0dXJuIG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS5OQU1FX0ZJRUxEX0tFWVxuXG5nZXRSZWxhdGVkcyA9IChvYmplY3RBcGlOYW1lKSAtPlxuXHRyZXR1cm4gTWV0ZW9yLndyYXBBc3luYygob2JqZWN0QXBpTmFtZSwgY2IpIC0+XG5cdFx0b2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLmdldFJlbGF0ZWRzKCkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuXHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxuXHRcdCkob2JqZWN0QXBpTmFtZSlcblxub2JqZWN0RmluZE9uZSA9IChvYmplY3RBcGlOYW1lLCBxdWVyeSkgLT5cblx0cmV0dXJuIE1ldGVvci53cmFwQXN5bmMoKG9iamVjdEFwaU5hbWUsIHF1ZXJ5LCBjYikgLT5cblx0XHRxdWVyeS50b3AgPSAxXG5cdFx0b2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLmZpbmQocXVlcnkpLnRoZW4gKHJlc29sdmUsIHJlamVjdCkgLT5cblx0XHRcdGlmIChyZXNvbHZlICYmIHJlc29sdmUubGVuZ3RoID4gMClcblx0XHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlWzBdKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjYihyZWplY3QsIG51bGwpXG5cdFx0KShvYmplY3RBcGlOYW1lLCBxdWVyeSlcblxub2JqZWN0RmluZCA9IChvYmplY3RBcGlOYW1lLCBxdWVyeSkgLT5cblx0cmV0dXJuIE1ldGVvci53cmFwQXN5bmMoKG9iamVjdEFwaU5hbWUsIHF1ZXJ5LCBjYikgLT5cblx0XHRvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkuZmluZChxdWVyeSkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuXHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxuXHRcdCkob2JqZWN0QXBpTmFtZSwgcXVlcnkpXG5cbm9iamVjdFVwZGF0ZSA9IChvYmplY3RBcGlOYW1lLCBpZCwgZGF0YSkgLT5cblx0cmV0dXJuIE1ldGVvci53cmFwQXN5bmMoKG9iamVjdEFwaU5hbWUsIGlkLCBkYXRhLCBjYikgLT5cblx0XHRvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkudXBkYXRlKGlkLCBkYXRhKS50aGVuIChyZXNvbHZlLCByZWplY3QpIC0+XG5cdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXG5cdFx0KShvYmplY3RBcGlOYW1lLCBpZCwgZGF0YSlcblxuZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSA9ICAocmVsYXRlZE9iamVjdHNLZXlzLCBrZXkpIC0+XG5cdHJldHVybiBfLmZpbmQgcmVsYXRlZE9iamVjdHNLZXlzLCAgKHJlbGF0ZWRPYmplY3RzS2V5KSAtPlxuXHRcdHJldHVybiBrZXkuc3RhcnRzV2l0aChyZWxhdGVkT2JqZWN0c0tleSArICcuJylcblxuZ2V0Rm9ybVRhYmxlRmllbGRDb2RlID0gKGZvcm1UYWJsZUZpZWxkc0NvZGUsIGtleSkgLT5cblx0cmV0dXJuIF8uZmluZCBmb3JtVGFibGVGaWVsZHNDb2RlLCAgKGZvcm1UYWJsZUZpZWxkQ29kZSkgLT5cblx0XHRyZXR1cm4ga2V5LnN0YXJ0c1dpdGgoZm9ybVRhYmxlRmllbGRDb2RlICsgJy4nKVxuXG5nZXRGb3JtVGFibGVGaWVsZCA9IChmb3JtVGFibGVGaWVsZHMsIGtleSkgLT5cblx0cmV0dXJuIF8uZmluZCBmb3JtVGFibGVGaWVsZHMsICAoZikgLT5cblx0XHRyZXR1cm4gZi5jb2RlID09IGtleVxuXG5nZXRGb3JtRmllbGQgPSAoZm9ybUZpZWxkcywga2V5KSAtPlxuXHRmZiA9IG51bGxcblx0Xy5mb3JFYWNoIGZvcm1GaWVsZHMsIChmKSAtPlxuXHRcdGlmIGZmXG5cdFx0XHRyZXR1cm5cblx0XHRpZiBmLnR5cGUgPT0gJ3NlY3Rpb24nXG5cdFx0XHRmZiA9IF8uZmluZCBmLmZpZWxkcywgIChzZikgLT5cblx0XHRcdFx0cmV0dXJuIHNmLmNvZGUgPT0ga2V5XG5cdFx0ZWxzZSBpZiBmLmNvZGUgPT0ga2V5XG5cdFx0XHRmZiA9IGZcblxuXHRyZXR1cm4gZmZcblxuZ2V0Rm9ybVRhYmxlU3ViRmllbGQgPSAodGFibGVGaWVsZCwgc3ViRmllbGRDb2RlKSAtPlxuXHRyZXR1cm4gXy5maW5kIHRhYmxlRmllbGQuZmllbGRzLCAgKGYpIC0+XG5cdFx0cmV0dXJuIGYuY29kZSA9PSBzdWJGaWVsZENvZGVcblxuZ2V0RmllbGRPZGF0YVZhbHVlID0gKG9iak5hbWUsIGlkLCByZWZlcmVuY2VUb0ZpZWxkTmFtZSkgLT5cblx0IyBvYmogPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqTmFtZSlcblx0b2JqID0gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iak5hbWUpXG5cdG5hbWVLZXkgPSBnZXRPYmplY3ROYW1lRmllbGRLZXkob2JqTmFtZSlcblx0aWYgIW9ialxuXHRcdHJldHVyblxuXHRpZiBfLmlzU3RyaW5nIGlkXG5cdFx0IyBfcmVjb3JkID0gb2JqLmZpbmRPbmUoaWQpXG5cdFx0X3JlY29yZCA9IG9iamVjdEZpbmRPbmUob2JqTmFtZSwgeyBmaWx0ZXJzOiBbW3JlZmVyZW5jZVRvRmllbGROYW1lLCAnPScsIGlkXV19KVxuXHRcdGlmIF9yZWNvcmRcblx0XHRcdF9yZWNvcmRbJ0BsYWJlbCddID0gX3JlY29yZFtuYW1lS2V5XVxuXHRcdFx0cmV0dXJuIF9yZWNvcmRcblx0ZWxzZSBpZiBfLmlzQXJyYXkgaWRcblx0XHRfcmVjb3JkcyA9IFtdXG5cdFx0IyBvYmouZmluZCh7IF9pZDogeyAkaW46IGlkIH0gfSlcblx0XHRvYmplY3RGaW5kKG9iak5hbWUsIHsgZmlsdGVyczogW1tyZWZlcmVuY2VUb0ZpZWxkTmFtZSwgJ2luJywgaWRdXX0pLmZvckVhY2ggKF9yZWNvcmQpIC0+XG5cdFx0XHRfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmRbbmFtZUtleV1cblx0XHRcdF9yZWNvcmRzLnB1c2ggX3JlY29yZFxuXHRcdGlmICFfLmlzRW1wdHkgX3JlY29yZHNcblx0XHRcdHJldHVybiBfcmVjb3Jkc1xuXHRyZXR1cm5cblxuZ2V0U2VsZWN0VXNlclZhbHVlID0gKHVzZXJJZCwgc3BhY2VJZCkgLT5cblx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSlcblx0c3UuaWQgPSB1c2VySWRcblx0cmV0dXJuIHN1XG5cbmdldFNlbGVjdFVzZXJWYWx1ZXMgPSAodXNlcklkcywgc3BhY2VJZCkgLT5cblx0c3VzID0gW11cblx0aWYgXy5pc0FycmF5IHVzZXJJZHNcblx0XHRfLmVhY2ggdXNlcklkcywgKHVzZXJJZCkgLT5cblx0XHRcdHN1ID0gZ2V0U2VsZWN0VXNlclZhbHVlKHVzZXJJZCwgc3BhY2VJZClcblx0XHRcdGlmIHN1XG5cdFx0XHRcdHN1cy5wdXNoKHN1KVxuXHRyZXR1cm4gc3VzXG5cbmdldFNlbGVjdE9yZ1ZhbHVlID0gKG9yZ0lkLCBzcGFjZUlkKSAtPlxuXHRvcmcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kT25lKG9yZ0lkLCB7IGZpZWxkczogeyBfaWQ6IDEsIG5hbWU6IDEsIGZ1bGxuYW1lOiAxIH0gfSlcblx0b3JnLmlkID0gb3JnSWRcblx0cmV0dXJuIG9yZ1xuXG5nZXRTZWxlY3RPcmdWYWx1ZXMgPSAob3JnSWRzLCBzcGFjZUlkKSAtPlxuXHRvcmdzID0gW11cblx0aWYgXy5pc0FycmF5IG9yZ0lkc1xuXHRcdF8uZWFjaCBvcmdJZHMsIChvcmdJZCkgLT5cblx0XHRcdG9yZyA9IGdldFNlbGVjdE9yZ1ZhbHVlKG9yZ0lkLCBzcGFjZUlkKVxuXHRcdFx0aWYgb3JnXG5cdFx0XHRcdG9yZ3MucHVzaChvcmcpXG5cdHJldHVybiBvcmdzXG5cbmdldEZpbGVGaWVsZFZhbHVlID0gKHJlY29yZEZpZWxkSWQsIGZUeXBlKS0+XG5cdGlmIF8uaXNFbXB0eShyZWNvcmRGaWVsZElkKVxuXHRcdHJldHVybiBcblx0aWYgZlR5cGUgPT0gJ2ltYWdlJ1xuXHRcdGNvbGxlY3Rpb24gPSAnaW1hZ2VzJ1xuXHRlbHNlIGlmIGZUeXBlID09ICdmaWxlJ1xuXHRcdGNvbGxlY3Rpb24gPSAnZmlsZXMnXG5cdGlmIF8uaXNTdHJpbmcocmVjb3JkRmllbGRJZClcblx0XHRxdWVyeSA9IHtfaWQ6IHskaW46IFtyZWNvcmRGaWVsZElkXX19XG5cdGVsc2Vcblx0XHRxdWVyeSA9IHtfaWQ6IHskaW46IHJlY29yZEZpZWxkSWR9fVxuXHRmaWxlcyA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJjZnMuI3tjb2xsZWN0aW9ufS5maWxlcmVjb3JkXCJdLmZpbmQocXVlcnkpO1xuXHR2YWx1ZSA9IFtdXG5cdGZpbGVzLmZvckVhY2ggKGYpIC0+XG5cdFx0bmV3RmlsZSA9IG5ldyBGUy5GaWxlKClcblx0XHRuZXdGaWxlLmF0dGFjaERhdGEgZi5jcmVhdGVSZWFkU3RyZWFtKCdmaWxlcycpLCB7XG5cdFx0XHRcdHR5cGU6IGYub3JpZ2luYWwudHlwZVxuXHRcdH0sIChlcnIpIC0+XG5cdFx0XHRpZiAoZXJyKVxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbilcblxuXHRcdFx0bmV3RmlsZS5uYW1lKGYubmFtZSgpKVxuXHRcdFx0bmV3RmlsZS5zaXplKGYuc2l6ZSgpKVxuXHRcdFx0bWV0YWRhdGEgPSB7XG5cdFx0XHRcdG93bmVyOiBmLm1ldGFkYXRhLm93bmVyXG5cdFx0XHR9XG5cdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG5cdFx0XHRuZXdGaWxlLl9pZCA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLl9tYWtlTmV3SUQoKTtcblx0XHRcdGNmc1tjb2xsZWN0aW9uXS5pbnNlcnQobmV3RmlsZSk7XG5cdFx0XHR2YWx1ZS5wdXNoKG5ld0ZpbGUuX2lkKVxuXHRpZiB2YWx1ZS5sZW5ndGggPiAwXG5cdFx0aWYgXy5pc1N0cmluZyhyZWNvcmRGaWVsZElkKVxuXHRcdFx0cmV0dXJuIHZhbHVlWzBdXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXG5nZXRJbnN0YW5jZUZpZWxkVmFsdWUgPSAob2JqRmllbGQsIGZvcm1GaWVsZCwgcmVjb3JkLCBvYmplY3RfZmllbGQsIHNwYWNlSWQsIHJlY29yZEZpZWxkVmFsdWUpIC0+XG5cblx0aWYgZm9ybUZpZWxkLnN0ZWVkb3NfZmllbGRcblx0XHRyZXR1cm4gcmVjb3JkRmllbGRWYWx1ZVxuXG5cdHJlY29yZEZpZWxkVmFsdWUgPSByZWNvcmRbb2JqRmllbGQubmFtZV1cblx0dmFsdWVcblx0IyBsb29rdXDjgIFtYXN0ZXJfZGV0YWls5a2X5q615ZCM5q2l5Yiwb2RhdGHlrZfmrrVcblx0aWYgZm9ybUZpZWxkICYmIG9iakZpZWxkICYmIGZvcm1GaWVsZC50eXBlID09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iakZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqRmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdHJlZmVyZW5jZVRvRmllbGROYW1lID0gb2JqRmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkIHx8ICdfaWQnXG5cdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqRmllbGQucmVmZXJlbmNlX3RvXG5cdFx0b2RhdGFGaWVsZFZhbHVlXG5cdFx0aWYgb2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWNvcmRGaWVsZFZhbHVlLCByZWZlcmVuY2VUb0ZpZWxkTmFtZSlcblx0XHRlbHNlIGlmICFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWNvcmRGaWVsZFZhbHVlLCByZWZlcmVuY2VUb0ZpZWxkTmFtZSlcblx0XHR2YWx1ZSA9IG9kYXRhRmllbGRWYWx1ZVxuXHRlbHNlIGlmIGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iakZpZWxkLnR5cGUpICYmIChbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pIHx8ICgnc3BhY2VfdXNlcnMnID09IG9iakZpZWxkLnJlZmVyZW5jZV90byAmJiAndXNlcicgPT0gb2JqRmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkKSApXG5cdFx0aWYgIV8uaXNFbXB0eShyZWNvcmRGaWVsZFZhbHVlKVxuXHRcdFx0c2VsZWN0RmllbGRWYWx1ZVxuXHRcdFx0aWYgZm9ybUZpZWxkLnR5cGUgPT0gJ3VzZXInXG5cdFx0XHRcdGlmIG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlY29yZEZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdGVsc2UgaWYgIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlY29yZEZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRlbHNlIGlmIGZvcm1GaWVsZC50eXBlID09ICdncm91cCdcblx0XHRcdFx0aWYgb2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWNvcmRGaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRlbHNlIGlmICFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlY29yZEZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRpZiBzZWxlY3RGaWVsZFZhbHVlXG5cdFx0XHRcdHZhbHVlID0gc2VsZWN0RmllbGRWYWx1ZVxuXHRlbHNlIGlmIGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PSAnZGF0ZScgJiYgcmVjb3JkRmllbGRWYWx1ZVxuXHRcdHZhbHVlID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5mb3JtYXREYXRlKHJlY29yZEZpZWxkVmFsdWUpICMgRGF0Zei9rFN0cmluZ1xuXHRlbHNlIGlmIGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiByZWNvcmRGaWVsZFZhbHVlICYmIChmb3JtRmllbGQudHlwZSA9PSAnaW1hZ2UnIHx8IGZvcm1GaWVsZC50eXBlID09ICdmaWxlJylcblx0XHR2YWx1ZSA9IGdldEZpbGVGaWVsZFZhbHVlKHJlY29yZEZpZWxkVmFsdWUsIGZvcm1GaWVsZC50eXBlKVxuXHRlbHNlIGlmIGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiByZWNvcmRGaWVsZFZhbHVlICYmIGZvcm1GaWVsZC50eXBlID09ICdsb29rdXAnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iakZpZWxkLnJlZmVyZW5jZV90bylcblx0XHR2YWx1ZSA9IHJlY29yZEZpZWxkVmFsdWVcblx0ZWxzZSBpZiBmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgcmVjb3JkRmllbGRWYWx1ZSAmJiAoZm9ybUZpZWxkLnR5cGUgPT0gJ211bHRpU2VsZWN0Jylcblx0XHR2YWx1ZSA9IHJlY29yZEZpZWxkVmFsdWUuam9pbignLCcpXG5cdGVsc2UgaWYgcmVjb3JkLmhhc093blByb3BlcnR5KG9iamVjdF9maWVsZClcblx0XHR2YWx1ZSA9IHJlY29yZEZpZWxkVmFsdWVcblx0XG5cdHJldHVybiB2YWx1ZVxuXG4jIHJlcXVpcmVkRGV0YWlsc+e7k+aehFtcIuWtkOihqOWQjS7lrZDooajkuK1tYXN0ZXJfZGV0YWls5a2X5q615ZCNXCIsIC4uLl1cbmNoZWNrUmVxdWlyZWREZXRhaWxzID0gKHJlcXVpcmVkRGV0YWlscywgbWFzdGVyUmVjb3JkKSAtPlxuXHRpZiAhXy5pc0VtcHR5IHJlcXVpcmVkRGV0YWlsc1xuXHRcdCMg5qOA5p+l5a2Q6KGo5b+F5aGr77yM5Y2z5a2Q6KGo5b+F6aG75pyJ6K6w5b2VXG5cdFx0cmVxdWlyZWREZXRhaWxzLmZvckVhY2ggKHJkKSAtPlxuXHRcdFx0c3ViVGFibGVOYW1lID0gcmQuc3BsaXQoJy4nKVswXVxuXHRcdFx0c3ViVGFibGVNYXN0ZXJGaWVsZCA9IHJkLnNwbGl0KCcuJylbMV1cblx0XHRcdHN1Yk9iakNvbmZpZyA9IGdldE9iamVjdENvbmZpZyBzdWJUYWJsZU5hbWVcblx0XHRcdG1hc3RlckZpZWxkID0gc3ViT2JqQ29uZmlnLmZpZWxkc1tzdWJUYWJsZU1hc3RlckZpZWxkXVxuXHRcdFx0cmVmSWQgPSBtYXN0ZXJGaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQgfHwgJ19pZCdcblx0XHRcdG1hc3RlckZpZWxkVmFsdWUgPSBtYXN0ZXJSZWNvcmRbcmVmSWRdXG5cdFx0XHQjIOafpeivouWtkOihqOiusOW9lVxuXHRcdFx0c3ViVGFibGVSZWNvcmQgPSBvYmplY3RGaW5kT25lKHN1YlRhYmxlTmFtZSwgeyBmaWx0ZXJzOiBbW3N1YlRhYmxlTWFzdGVyRmllbGQsICc9JywgbWFzdGVyRmllbGRWYWx1ZV1dLCBmaWVsZHM6IFtzdWJUYWJsZU1hc3RlckZpZWxkXSB9KVxuXHRcdFx0aWYgIXN1YlRhYmxlUmVjb3JkXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciBcIuivt+WFiOaWsOWiniN7c3ViT2JqQ29uZmlnLmxhYmVsfVwiXG5cdFx0cmV0dXJuXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwgPSB7fVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24gPSAocmVxKSAtPlxuXHRxdWVyeSA9IHJlcS5xdWVyeVxuXHR1c2VySWQgPSBxdWVyeVtcIlgtVXNlci1JZFwiXVxuXHRhdXRoVG9rZW4gPSBxdWVyeVtcIlgtQXV0aC1Ub2tlblwiXVxuXG5cdGlmIG5vdCB1c2VySWQgb3Igbm90IGF1dGhUb2tlblxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXG5cdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcblx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG5cdFx0X2lkOiB1c2VySWQsXG5cdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cblxuXHRpZiBub3QgdXNlclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXG5cdHJldHVybiB1c2VyXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2UgPSAoc3BhY2VfaWQpIC0+XG5cdHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcblx0aWYgbm90IHNwYWNlXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJzcGFjZV9pZOacieivr+aIluatpHNwYWNl5bey57uP6KKr5Yig6ZmkXCIpXG5cdHJldHVybiBzcGFjZVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3cgPSAoZmxvd19pZCkgLT5cblx0ZmxvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZmxvd3MuZmluZE9uZShmbG93X2lkKVxuXHRpZiBub3QgZmxvd1xuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwiaWTmnInor6/miJbmraTmtYHnqIvlt7Lnu4/ooqvliKDpmaRcIilcblx0cmV0dXJuIGZsb3dcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXIgPSAoc3BhY2VfaWQsIHVzZXJfaWQpIC0+XG5cdHNwYWNlX3VzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlX3VzZXJzLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJfaWQgfSlcblx0aWYgbm90IHNwYWNlX3VzZXJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInVzZXJfaWTlr7nlupTnmoTnlKjmiLfkuI3lsZ7kuo7lvZPliY1zcGFjZVwiKVxuXHRyZXR1cm4gc3BhY2VfdXNlclxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8gPSAoc3BhY2VfdXNlcikgLT5cblx0aW5mbyA9IG5ldyBPYmplY3Rcblx0aW5mby5vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvblxuXHRvcmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9yZ2FuaXphdGlvbnMuZmluZE9uZShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbiwgeyBmaWVsZHM6IHsgbmFtZTogMSAsIGZ1bGxuYW1lOiAxIH0gfSlcblx0aW5mby5vcmdhbml6YXRpb25fbmFtZSA9IG9yZy5uYW1lXG5cdGluZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gb3JnLmZ1bGxuYW1lXG5cdHJldHVybiBpbmZvXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZCA9IChmbG93KSAtPlxuXHRpZiBmbG93LnN0YXRlIGlzbnQgXCJlbmFibGVkXCJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+acquWQr+eUqCzmk43kvZzlpLHotKVcIilcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQgPSAoZmxvdywgc3BhY2VfaWQpIC0+XG5cdGlmIGZsb3cuc3BhY2UgaXNudCBzcGFjZV9pZFxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5ZKM5bel5L2c5Yy6SUTkuI3ljLnphY1cIilcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtID0gKGZvcm1faWQpIC0+XG5cdGZvcm0gPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZvcm1zLmZpbmRPbmUoZm9ybV9pZClcblx0aWYgbm90IGZvcm1cblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn6KGo5Y2VSUTmnInor6/miJbmraTooajljZXlt7Lnu4/ooqvliKDpmaQnKVxuXG5cdHJldHVybiBmb3JtXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Q2F0ZWdvcnkgPSAoY2F0ZWdvcnlfaWQpIC0+XG5cdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLmNhdGVnb3JpZXMuZmluZE9uZShjYXRlZ29yeV9pZClcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja1N5bmNEaXJlY3Rpb24gPSAob2JqZWN0X25hbWUsIGZsb3dfaWQpIC0+XG5cdG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3Rfd29ya2Zsb3dzLmZpbmRPbmUoe1xuXHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcblx0XHRmbG93X2lkOiBmbG93X2lkXG5cdH0pXG5cdGlmICFvd1xuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsICfmnKrmib7liLDlr7nosaHmtYHnqIvmmKDlsITorrDlvZXjgIInKVxuXHRzeW5jRGlyZWN0aW9uID0gb3cuc3luY19kaXJlY3Rpb24gfHwgJ2JvdGgnXG5cdGlmICFbJ2JvdGgnLCAnb2JqX3RvX2lucyddLmluY2x1ZGVzKHN5bmNEaXJlY3Rpb24pXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+S4jeaUr+aMgeeahOWQjOatpeaWueWQkeOAgicpXG5cblx0cmV0dXJuIFxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNyZWF0ZV9pbnN0YW5jZSA9IChpbnN0YW5jZV9mcm9tX2NsaWVudCwgdXNlcl9pbmZvKSAtPlxuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSwgU3RyaW5nXG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0sIFN0cmluZ1xuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl0sIFN0cmluZ1xuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl0sIFt7bzogU3RyaW5nLCBpZHM6IFtTdHJpbmddfV1cblxuXHQjIOagoemqjOWQjOatpeaWueWQkVxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrU3luY0RpcmVjdGlvbihpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl1bMF0ubywgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdKVxuXG5cdCMg5qCh6aqM5piv5ZCmcmVjb3Jk5bey57uP5Y+R6LW355qE55Sz6K+36L+Y5Zyo5a6h5om55LitXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tJc0luQXBwcm92YWwoaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdWzBdLCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdKVxuXG5cdHNwYWNlX2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXVxuXHRmbG93X2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdXG5cdHVzZXJfaWQgPSB1c2VyX2luZm8uX2lkXG5cdCMg6I635Y+W5YmN5Y+w5omA5Lyg55qEdHJhY2Vcblx0dHJhY2VfZnJvbV9jbGllbnQgPSBudWxsXG5cdCMg6I635Y+W5YmN5Y+w5omA5Lyg55qEYXBwcm92ZVxuXHRhcHByb3ZlX2Zyb21fY2xpZW50ID0gbnVsbFxuXHRpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXSBhbmQgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1cblx0XHR0cmFjZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdXG5cdFx0aWYgdHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXSBhbmQgdHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXVswXVxuXHRcdFx0YXBwcm92ZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdW1wiYXBwcm92ZXNcIl1bMF1cblxuXHQjIOiOt+WPluS4gOS4qnNwYWNlXG5cdHNwYWNlID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZShzcGFjZV9pZClcblx0IyDojrflj5bkuIDkuKpmbG93XG5cdGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZClcblx0IyDojrflj5bkuIDkuKpzcGFjZeS4i+eahOS4gOS4qnVzZXJcblx0c3BhY2VfdXNlciA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyKHNwYWNlX2lkLCB1c2VyX2lkKVxuXHQjIOiOt+WPlnNwYWNlX3VzZXLmiYDlnKjnmoTpg6jpl6jkv6Hmga9cblx0c3BhY2VfdXNlcl9vcmdfaW5mbyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyhzcGFjZV91c2VyKVxuXHQjIOWIpOaWreS4gOS4qmZsb3fmmK/lkKbkuLrlkK/nlKjnirbmgIFcblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dFbmFibGVkKGZsb3cpXG5cdCMg5Yik5pat5LiA5LiqZmxvd+WSjHNwYWNlX2lk5piv5ZCm5Yy56YWNXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93U3BhY2VNYXRjaGVkKGZsb3csIHNwYWNlX2lkKVxuXG5cdGZvcm0gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZvcm0oZmxvdy5mb3JtKVxuXG5cdHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dfaWQsIHVzZXJfaWQpXG5cblx0aWYgbm90IHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRkXCIpXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLlvZPliY3nlKjmiLfmsqHmnInmraTmtYHnqIvnmoTmlrDlu7rmnYPpmZBcIilcblxuXHRub3cgPSBuZXcgRGF0ZVxuXHRpbnNfb2JqID0ge31cblx0aW5zX29iai5faWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5fbWFrZU5ld0lEKClcblx0aW5zX29iai5zcGFjZSA9IHNwYWNlX2lkXG5cdGluc19vYmouZmxvdyA9IGZsb3dfaWRcblx0aW5zX29iai5mbG93X3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuX2lkXG5cdGluc19vYmouZm9ybSA9IGZsb3cuZm9ybVxuXHRpbnNfb2JqLmZvcm1fdmVyc2lvbiA9IGZsb3cuY3VycmVudC5mb3JtX3ZlcnNpb25cblx0aW5zX29iai5uYW1lID0gZmxvdy5uYW1lXG5cdGluc19vYmouc3VibWl0dGVyID0gdXNlcl9pZFxuXHRpbnNfb2JqLnN1Ym1pdHRlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWVcblx0aW5zX29iai5hcHBsaWNhbnQgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIGVsc2UgdXNlcl9pZFxuXHRpbnNfb2JqLmFwcGxpY2FudF9uYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gZWxzZSB1c2VyX2luZm8ubmFtZVxuXHRpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb24gPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25cIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25cIl0gZWxzZSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvblxuXHRpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gZWxzZSBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9uYW1lXG5cdGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZVwiXSBlbHNlICBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZVxuXHRpbnNfb2JqLmFwcGxpY2FudF9jb21wYW55ID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfY29tcGFueVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gZWxzZSBzcGFjZV91c2VyLmNvbXBhbnlfaWRcblx0aW5zX29iai5zdGF0ZSA9ICdkcmFmdCdcblx0aW5zX29iai5jb2RlID0gJydcblx0aW5zX29iai5pc19hcmNoaXZlZCA9IGZhbHNlXG5cdGluc19vYmouaXNfZGVsZXRlZCA9IGZhbHNlXG5cdGluc19vYmouY3JlYXRlZCA9IG5vd1xuXHRpbnNfb2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkXG5cdGluc19vYmoubW9kaWZpZWQgPSBub3dcblx0aW5zX29iai5tb2RpZmllZF9ieSA9IHVzZXJfaWRcblxuXHRpbnNfb2JqLnJlY29yZF9pZHMgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl1cblxuXHRpZiBzcGFjZV91c2VyLmNvbXBhbnlfaWRcblx0XHRpbnNfb2JqLmNvbXBhbnlfaWQgPSBzcGFjZV91c2VyLmNvbXBhbnlfaWRcblxuXHQjIOaWsOW7ulRyYWNlXG5cdHRyYWNlX29iaiA9IHt9XG5cdHRyYWNlX29iai5faWQgPSBuZXcgTW9uZ28uT2JqZWN0SUQoKS5fc3RyXG5cdHRyYWNlX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkXG5cdHRyYWNlX29iai5pc19maW5pc2hlZCA9IGZhbHNlXG5cdCMg5b2T5YmN5pyA5paw54mIZmxvd+S4reW8gOWni+iKgueCuVxuXHRzdGFydF9zdGVwID0gXy5maW5kKGZsb3cuY3VycmVudC5zdGVwcywgKHN0ZXApIC0+XG5cdFx0cmV0dXJuIHN0ZXAuc3RlcF90eXBlIGlzICdzdGFydCdcblx0KVxuXHR0cmFjZV9vYmouc3RlcCA9IHN0YXJ0X3N0ZXAuX2lkXG5cdHRyYWNlX29iai5uYW1lID0gc3RhcnRfc3RlcC5uYW1lXG5cblx0dHJhY2Vfb2JqLnN0YXJ0X2RhdGUgPSBub3dcblx0IyDmlrDlu7pBcHByb3ZlXG5cdGFwcHJfb2JqID0ge31cblx0YXBwcl9vYmouX2lkID0gbmV3IE1vbmdvLk9iamVjdElEKCkuX3N0clxuXHRhcHByX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkXG5cdGFwcHJfb2JqLnRyYWNlID0gdHJhY2Vfb2JqLl9pZFxuXHRhcHByX29iai5pc19maW5pc2hlZCA9IGZhbHNlXG5cdGFwcHJfb2JqLnVzZXIgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIGVsc2UgdXNlcl9pZFxuXHRhcHByX29iai51c2VyX25hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSBlbHNlIHVzZXJfaW5mby5uYW1lXG5cdGFwcHJfb2JqLmhhbmRsZXIgPSB1c2VyX2lkXG5cdGFwcHJfb2JqLmhhbmRsZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lXG5cdGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb25cblx0YXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb25fbmFtZSA9IHNwYWNlX3VzZXJfb3JnX2luZm8ubmFtZVxuXHRhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IHNwYWNlX3VzZXJfb3JnX2luZm8uZnVsbG5hbWVcblx0YXBwcl9vYmoudHlwZSA9ICdkcmFmdCdcblx0YXBwcl9vYmouc3RhcnRfZGF0ZSA9IG5vd1xuXHRhcHByX29iai5yZWFkX2RhdGUgPSBub3dcblx0YXBwcl9vYmouaXNfcmVhZCA9IHRydWVcblx0YXBwcl9vYmouaXNfZXJyb3IgPSBmYWxzZVxuXHRhcHByX29iai5kZXNjcmlwdGlvbiA9ICcnXG5cdHJlbGF0ZWRUYWJsZXNJbmZvID0ge31cblx0YXBwcl9vYmoudmFsdWVzID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVZhbHVlcyhpbnNfb2JqLnJlY29yZF9pZHNbMF0sIGZsb3dfaWQsIHNwYWNlX2lkLCBmb3JtLmN1cnJlbnQuZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbylcblxuXHR0cmFjZV9vYmouYXBwcm92ZXMgPSBbYXBwcl9vYmpdXG5cdGluc19vYmoudHJhY2VzID0gW3RyYWNlX29ial1cblxuXHRpbnNfb2JqLnZhbHVlcyA9IGFwcHJfb2JqLnZhbHVlc1xuXG5cdGluc19vYmouaW5ib3hfdXNlcnMgPSBpbnN0YW5jZV9mcm9tX2NsaWVudC5pbmJveF91c2VycyB8fCBbXVxuXG5cdGluc19vYmouY3VycmVudF9zdGVwX25hbWUgPSBzdGFydF9zdGVwLm5hbWVcblxuXHRpZiBmbG93LmF1dG9fcmVtaW5kIGlzIHRydWVcblx0XHRpbnNfb2JqLmF1dG9fcmVtaW5kID0gdHJ1ZVxuXG5cdCMg5paw5bu655Sz6K+35Y2V5pe277yMaW5zdGFuY2Vz6K6w5b2V5rWB56iL5ZCN56ew44CB5rWB56iL5YiG57G75ZCN56ewICMxMzEzXG5cdGluc19vYmouZmxvd19uYW1lID0gZmxvdy5uYW1lXG5cdGlmIGZvcm0uY2F0ZWdvcnlcblx0XHRjYXRlZ29yeSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Q2F0ZWdvcnkoZm9ybS5jYXRlZ29yeSlcblx0XHRpZiBjYXRlZ29yeVxuXHRcdFx0aW5zX29iai5jYXRlZ29yeV9uYW1lID0gY2F0ZWdvcnkubmFtZVxuXHRcdFx0aW5zX29iai5jYXRlZ29yeSA9IGNhdGVnb3J5Ll9pZFxuXG5cdG5ld19pbnNfaWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5pbnNlcnQoaW5zX29iailcblxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvKGluc19vYmoucmVjb3JkX2lkc1swXSwgbmV3X2luc19pZCwgc3BhY2VfaWQpXG5cblx0IyB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyhyZWxhdGVkVGFibGVzSW5mbywgbmV3X2luc19pZCwgc3BhY2VfaWQpXG5cblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZUF0dGFjaChpbnNfb2JqLnJlY29yZF9pZHNbMF0sIHNwYWNlX2lkLCBpbnNfb2JqLl9pZCwgYXBwcl9vYmouX2lkKVxuXG5cdHJldHVybiBuZXdfaW5zX2lkXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMgPSAocmVjb3JkSWRzLCBmbG93SWQsIHNwYWNlSWQsIGZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pIC0+XG5cdGZpZWxkQ29kZXMgPSBbXVxuXHRfLmVhY2ggZmllbGRzLCAoZikgLT5cblx0XHRpZiBmLnR5cGUgPT0gJ3NlY3Rpb24nXG5cdFx0XHRfLmVhY2ggZi5maWVsZHMsIChmZikgLT5cblx0XHRcdFx0ZmllbGRDb2Rlcy5wdXNoIGZmLmNvZGVcblx0XHRlbHNlXG5cdFx0XHRmaWVsZENvZGVzLnB1c2ggZi5jb2RlXG5cblx0dmFsdWVzID0ge31cblx0b2JqZWN0TmFtZSA9IHJlY29yZElkcy5vXG5cdG9iamVjdCA9IGdldE9iamVjdENvbmZpZyhvYmplY3ROYW1lKVxuXHRyZWNvcmRJZCA9IHJlY29yZElkcy5pZHNbMF1cblx0b3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XG5cdFx0b2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXG5cdFx0Zmxvd19pZDogZmxvd0lkXG5cdH0pXG5cdCMgcmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLmZpbmRPbmUocmVjb3JkSWQpXG5cdHJlY29yZCA9IG9iamVjdEZpbmRPbmUob2JqZWN0TmFtZSwgeyBmaWx0ZXJzOiBbWydfaWQnLCAnPScsIHJlY29yZElkXV19KVxuXHRmbG93ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoZmxvd0lkLCB7IGZpZWxkczogeyBmb3JtOiAxIH0gfSlcblx0aWYgb3cgYW5kIHJlY29yZFxuXHRcdHJlcXVpcmVkRGV0YWlscyA9IG93LnJlcXVpcmVkX2RldGFpbHMgfHwgW11cblx0XHRjaGVja1JlcXVpcmVkRGV0YWlscyhyZXF1aXJlZERldGFpbHMsIHJlY29yZClcblxuXHRcdGZvcm0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJmb3Jtc1wiKS5maW5kT25lKGZsb3cuZm9ybSlcblx0XHRmb3JtRmllbGRzID0gZm9ybS5jdXJyZW50LmZpZWxkcyB8fCBbXVxuXHRcdHJlbGF0ZWRPYmplY3RzID0gZ2V0UmVsYXRlZHMob2JqZWN0TmFtZSlcblx0XHRyZWxhdGVkT2JqZWN0c0tleXMgPSBfLnBsdWNrKHJlbGF0ZWRPYmplY3RzLCAnb2JqZWN0X25hbWUnKVxuXHRcdGZvcm1UYWJsZUZpZWxkcyA9IF8uZmlsdGVyIGZvcm1GaWVsZHMsIChmb3JtRmllbGQpIC0+XG5cdFx0XHRyZXR1cm4gZm9ybUZpZWxkLnR5cGUgPT0gJ3RhYmxlJ1xuXHRcdGZvcm1UYWJsZUZpZWxkc0NvZGUgPSBfLnBsdWNrKGZvcm1UYWJsZUZpZWxkcywgJ2NvZGUnKVxuXG5cdFx0IyBzdGVlZG9zIGZpZWxkIOS4reWumuS5ieeahGdyaWTjgIF0YWJsZeexu+Wei+Wtl+autVxuXHRcdHRhYmxlRmllbGRDb2RlcyA9IFtdXG5cdFx0dGFibGVGaWVsZE1hcCA9IFtdXG5cdFx0IyDnm7jlhbPooahcblx0XHR0YWJsZVRvUmVsYXRlZE1hcCA9IHt9XG5cblx0XHQjIGZpZWxkX21hcDog5LuO5Y+w6LSm5Yiw5a6h5om55Y2V55qE5a2X5q615ZCM5q2l5pig5bCE6KeE5YiZXG5cdFx0b3cuZmllbGRfbWFwPy5mb3JFYWNoIChmbSkgLT5cblx0XHRcdG9iamVjdF9maWVsZCA9IGZtLm9iamVjdF9maWVsZFxuXHRcdFx0d29ya2Zsb3dfZmllbGQgPSBmbS53b3JrZmxvd19maWVsZFxuXHRcdFx0aWYgIW9iamVjdF9maWVsZCB8fCAhd29ya2Zsb3dfZmllbGRcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICfmnKrmib7liLDlrZfmrrXvvIzor7fmo4Dmn6Xlr7nosaHmtYHnqIvmmKDlsITlrZfmrrXphY3nva4nKVxuXHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkQ29kZSA9IGdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUocmVsYXRlZE9iamVjdHNLZXlzLCBvYmplY3RfZmllbGQpXG5cdFx0XHRmb3JtVGFibGVGaWVsZENvZGUgPSBnZXRGb3JtVGFibGVGaWVsZENvZGUoZm9ybVRhYmxlRmllbGRzQ29kZSwgd29ya2Zsb3dfZmllbGQpXG5cdFx0XHRvYmpGaWVsZCA9IG9iamVjdC5maWVsZHNbb2JqZWN0X2ZpZWxkXVxuXHRcdFx0Zm9ybUZpZWxkID0gZ2V0Rm9ybUZpZWxkKGZvcm1GaWVsZHMsIHdvcmtmbG93X2ZpZWxkKVxuXHRcdFx0cmVjb3JkRmllbGRWYWx1ZSA9IHJlY29yZFtvYmplY3RfZmllbGRdXG5cdFx0XHQjIOWkhOeQhuWtkOihqOWtl+autVxuXHRcdFx0aWYgcmVsYXRlZE9iamVjdEZpZWxkQ29kZVxuXHRcdFx0XHRcblx0XHRcdFx0b1RhYmxlQ29kZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdXG5cdFx0XHRcdG9UYWJsZUZpZWxkQ29kZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzFdXG5cdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwS2V5ID0gb1RhYmxlQ29kZVxuXHRcdFx0XHRpZiAhdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldXG5cdFx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldID0ge31cblxuXHRcdFx0XHRpZiBmb3JtVGFibGVGaWVsZENvZGVcblx0XHRcdFx0XHR3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVswXVxuXHRcdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVsnX0ZST01fVEFCTEVfQ09ERSddID0gd1RhYmxlQ29kZVxuXG5cdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVtvVGFibGVGaWVsZENvZGVdID0gd29ya2Zsb3dfZmllbGRcblx0XHRcdCMg5Yik5pat5piv5ZCm5piv6KGo5qC85a2X5q61KG9iamVjdCBmaWVsZCDnmoQgZ3JpZOOAgXRhYmxlKVxuXHRcdFx0ZWxzZSBpZiB3b3JrZmxvd19maWVsZC5pbmRleE9mKCcuJykgPiAwIGFuZCBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPiAwXG5cdFx0XHRcdHdUYWJsZUNvZGUgPSB3b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdXG5cdFx0XHRcdG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzBdICByZWYxLnRhYmxlMS4kLm5hbWVcblx0XHRcdFx0aWYgcmVjb3JkLmhhc093blByb3BlcnR5KG9UYWJsZUNvZGUpIGFuZCBfLmlzQXJyYXkocmVjb3JkW29UYWJsZUNvZGVdKVxuXHRcdFx0XHRcdHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcblx0XHRcdFx0XHRcdHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXG5cdFx0XHRcdFx0XHRvYmplY3RfdGFibGVfZmllbGRfY29kZTogb1RhYmxlQ29kZVxuXHRcdFx0XHRcdH0pKVxuXHRcdFx0XHRcdHRhYmxlRmllbGRNYXAucHVzaChmbSlcblx0XHRcdFx0ZWxzZSBpZiBvVGFibGVDb2RlLmluZGV4T2YoJy4nKSA+IDAgIyDor7TmmI7mmK/lhbPogZTooajnmoRncmlk5a2X5q61XG5cdFx0XHRcdFx0b1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkQ29kZSA9IG9UYWJsZUNvZGUuc3BsaXQoJy4nKVswXTtcblx0XHRcdFx0XHRncmlkQ29kZSA9IG9UYWJsZUNvZGUuc3BsaXQoJy4nKVsxXTtcblx0XHRcdFx0XHRvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQgPSBvYmplY3QuZmllbGRzW29UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZENvZGVdO1xuXHRcdFx0XHRcdGlmIG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZCAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdGlmIHJlY29yZFtvVGFibGVDb2RlXVxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkTmFtZSA9IG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQgfHwgJ19pZCc7XG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VUb09iamVjdE5hbWUgPSBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQucmVmZXJlbmNlX3RvO1xuXHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5uYW1lXTtcblx0XHRcdFx0XHRcdCMg5q2k5aSE5YCf5YqpZ2V0RmllbGRPZGF0YVZhbHVl5Ye95pWw55qE6IO95YqbLCDojrflj5blhbPogZTooagobG9va3VwKeeahOiusOW9lS4g5q2k5aSE5pyq5pyq6ICD6JmRbG9va3Vw5Y2V6YCJ55qE5oOF5Ya1LiDmraTlpITojrflj5blhbPns7vmlbDmja7nmoTmiYDmnInlrZfmrrUsIOS6pOeUseS4i+aWueeahOihqOagvOaVsOaNruWQjOatpee7n+S4gOaVtOeQhuaVsOaNrlxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9Eb2MgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKTtcblx0XHRcdFx0XHRcdGlmIHJlZmVyZW5jZVRvRG9jW2dyaWRDb2RlXVxuXHRcdFx0XHRcdFx0XHRyZWNvcmRbb1RhYmxlQ29kZV0gPSByZWZlcmVuY2VUb0RvY1tncmlkQ29kZV07XG5cdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcblx0XHRcdFx0XHRcdFx0XHR3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxuXHRcdFx0XHRcdFx0XHRcdG9iamVjdF90YWJsZV9maWVsZF9jb2RlOiBvVGFibGVDb2RlXG5cdFx0XHRcdFx0XHRcdH0pKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRhYmxlRmllbGRNYXAucHVzaChmbSk7XG5cblx0XHRcdCMg5aSE55CGbG9va3Vw44CBbWFzdGVyX2RldGFpbOexu+Wei+Wtl+autVxuXHRcdFx0ZWxzZSBpZiBvYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gMCBhbmQgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID09IC0xXG5cdFx0XHRcdG9iamVjdEZpZWxkTmFtZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdXG5cdFx0XHRcdGxvb2t1cEZpZWxkTmFtZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzFdXG5cdFx0XHRcdGlmIG9iamVjdFxuXHRcdFx0XHRcdG9iamVjdEZpZWxkID0gb2JqZWN0LmZpZWxkc1tvYmplY3RGaWVsZE5hbWVdXG5cdFx0XHRcdFx0aWYgb2JqZWN0RmllbGQgJiYgZm9ybUZpZWxkICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdGxvb2t1cE9iamVjdFJlY29yZCA9IG9iamVjdEZpbmRPbmUob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvLCB7IGZpbHRlcnM6IFtbJ19pZCcsICc9JywgcmVjb3JkW29iamVjdEZpZWxkTmFtZV1dXSwgZmllbGRzOiBbbG9va3VwRmllbGROYW1lXSB9KVxuXHRcdFx0XHRcdFx0aWYgIWxvb2t1cE9iamVjdFJlY29yZFxuXHRcdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRcdG9iamVjdEZpZWxkT2JqZWN0TmFtZSA9IG9iamVjdEZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRcdFx0bG9va3VwRmllbGRPYmogPSBnZXRPYmplY3RDb25maWcob2JqZWN0RmllbGRPYmplY3ROYW1lKVxuXHRcdFx0XHRcdFx0b2JqZWN0TG9va3VwRmllbGQgPSBsb29rdXBGaWVsZE9iai5maWVsZHNbbG9va3VwRmllbGROYW1lXVxuXG5cdFx0XHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gZ2V0SW5zdGFuY2VGaWVsZFZhbHVlKG9iamVjdExvb2t1cEZpZWxkLCBmb3JtRmllbGQsIGxvb2t1cE9iamVjdFJlY29yZCwgbG9va3VwRmllbGROYW1lLCBzcGFjZUlkLCByZWNvcmRbbG9va3VwRmllbGROYW1lXSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IGdldEluc3RhbmNlRmllbGRWYWx1ZShvYmpGaWVsZCwgZm9ybUZpZWxkLCByZWNvcmQsIG9iamVjdF9maWVsZCwgc3BhY2VJZCwgcmVjb3JkW29iamVjdF9maWVsZF0pXG5cblx0XHQjIOihqOagvOWtl+autVxuXHRcdF8udW5pcSh0YWJsZUZpZWxkQ29kZXMpLmZvckVhY2ggKHRmYykgLT5cblx0XHRcdGMgPSBKU09OLnBhcnNlKHRmYylcblx0XHRcdHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdID0gW11cblx0XHRcdHJlY29yZFtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXS5mb3JFYWNoICh0cikgLT5cblx0XHRcdFx0bmV3VHIgPSB7fVxuXHRcdFx0XHRfLmVhY2ggdHIsICh0ZFZhbHVlLCBrKSAtPlxuXHRcdFx0XHRcdHRhYmxlRmllbGRNYXAuZm9yRWFjaCAodGZtKSAtPlxuXHRcdFx0XHRcdFx0aWYgdGZtLm9iamVjdF9maWVsZCBpcyAoYy5vYmplY3RfdGFibGVfZmllbGRfY29kZSArICcuJC4nICsgaylcblx0XHRcdFx0XHRcdFx0d1RkQ29kZSA9IHRmbS53b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzFdXG5cdFx0XHRcdFx0XHRcdG5ld1RyW3dUZENvZGVdID0gdGRWYWx1ZVxuXHRcdFx0XHRpZiBub3QgXy5pc0VtcHR5KG5ld1RyKVxuXHRcdFx0XHRcdHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdLnB1c2gobmV3VHIpXG5cblx0XHQjIOWQjOatpeWtkOihqOaVsOaNruiHs+ihqOWNleihqOagvFxuXHRcdF8uZWFjaCB0YWJsZVRvUmVsYXRlZE1hcCwgIChtYXAsIGtleSkgLT5cblx0XHRcdHRhYmxlQ29kZSA9IG1hcC5fRlJPTV9UQUJMRV9DT0RFXG5cdFx0XHRmb3JtVGFibGVGaWVsZCA9IGdldEZvcm1UYWJsZUZpZWxkKGZvcm1UYWJsZUZpZWxkcywgdGFibGVDb2RlKVxuXHRcdFx0aWYgIXRhYmxlQ29kZVxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ3RhYmxlVG9SZWxhdGVkOiBbJyArIGtleSArICddIG1pc3NpbmcgY29ycmVzcG9uZGluZyB0YWJsZS4nKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZWxhdGVkT2JqZWN0TmFtZSA9IGtleVxuXHRcdFx0XHR0YWJsZVZhbHVlcyA9IFtdXG5cdFx0XHRcdHJlbGF0ZWRUYWJsZUl0ZW1zID0gW11cblx0XHRcdFx0cmVsYXRlZE9iamVjdCA9IGdldE9iamVjdENvbmZpZyhyZWxhdGVkT2JqZWN0TmFtZSlcblx0XHRcdFx0cmVsYXRlZEZpZWxkID0gXy5maW5kIHJlbGF0ZWRPYmplY3QuZmllbGRzLCAoZikgLT5cblx0XHRcdFx0XHRyZXR1cm4gWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKGYudHlwZSkgJiYgZi5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0TmFtZVxuXG5cdFx0XHRcdHJlbGF0ZWRGaWVsZE5hbWUgPSByZWxhdGVkRmllbGQubmFtZVxuXG5cdFx0XHRcdHJlbGF0ZWRSZWNvcmRzID0gb2JqZWN0RmluZChyZWxhdGVkT2JqZWN0TmFtZSwge1xuXHRcdFx0XHRcdGZpbHRlcnM6IFtcblx0XHRcdFx0XHRcdFtyZWxhdGVkRmllbGROYW1lLCAnPScsIHJlY29yZElkXVxuXHRcdFx0XHRcdF1cblx0XHRcdFx0fSlcblxuXHRcdFx0XHRyZWxhdGVkUmVjb3Jkcy5mb3JFYWNoIChyZWxhdGVkUmVjb3JkKSAtPlxuXHRcdFx0XHRcdHRhYmxlVmFsdWVJdGVtID0ge31cblx0XHRcdFx0XHRfLmVhY2ggbWFwLCAodmFsdWVLZXksIGZpZWxkS2V5KSAtPlxuXHRcdFx0XHRcdFx0aWYgZmllbGRLZXkgIT0gJ19GUk9NX1RBQkxFX0NPREUnXG5cdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXlcblx0XHRcdFx0XHRcdFx0aWYgdmFsdWVLZXkuc3RhcnRzV2l0aCh0YWJsZUNvZGUgKyAnLicpXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkS2V5ID0gKHZhbHVlS2V5LnNwbGl0KFwiLlwiKVsxXSlcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleSA9IHZhbHVlS2V5XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRmb3JtRmllbGQgPSBnZXRGb3JtVGFibGVTdWJGaWVsZChmb3JtVGFibGVGaWVsZCwgZm9ybUZpZWxkS2V5KVxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0RmllbGQgPSByZWxhdGVkT2JqZWN0LmZpZWxkc1tmaWVsZEtleV1cblx0XHRcdFx0XHRcdFx0aWYgIWZvcm1GaWVsZCB8fCAhcmVsYXRlZE9iamVjdEZpZWxkXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldEluc3RhbmNlRmllbGRWYWx1ZShyZWxhdGVkT2JqZWN0RmllbGQsIGZvcm1GaWVsZCwgcmVsYXRlZFJlY29yZCwgZmllbGRLZXksIHNwYWNlSWQsIHJlbGF0ZWRSZWNvcmRbZmllbGRLZXldKVxuXHRcdFx0XHRcdFx0XHR0YWJsZVZhbHVlSXRlbVtmb3JtRmllbGRLZXldID0gdGFibGVGaWVsZFZhbHVlXG5cdFx0XHRcdFx0aWYgIV8uaXNFbXB0eSh0YWJsZVZhbHVlSXRlbSlcblx0XHRcdFx0XHRcdHRhYmxlVmFsdWVJdGVtLl9pZCA9IHJlbGF0ZWRSZWNvcmQuX2lkXG5cdFx0XHRcdFx0XHR0YWJsZVZhbHVlcy5wdXNoKHRhYmxlVmFsdWVJdGVtKVxuXHRcdFx0XHRcdFx0cmVsYXRlZFRhYmxlSXRlbXMucHVzaCh7IF90YWJsZTogeyBfaWQ6IHJlbGF0ZWRSZWNvcmQuX2lkLCBfY29kZTogdGFibGVDb2RlIH0gfSApXG5cblx0XHRcdFx0dmFsdWVzW3RhYmxlQ29kZV0gPSB0YWJsZVZhbHVlc1xuXHRcdFx0XHRyZWxhdGVkVGFibGVzSW5mb1tyZWxhdGVkT2JqZWN0TmFtZV0gPSByZWxhdGVkVGFibGVJdGVtc1xuXG5cdFx0IyDlpoLmnpzphY3nva7kuobohJrmnKzliJnmiafooYzohJrmnKxcblx0XHRpZiBvdy5maWVsZF9tYXBfc2NyaXB0XG5cdFx0XHRfLmV4dGVuZCh2YWx1ZXMsIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0KG93LmZpZWxkX21hcF9zY3JpcHQsIG9iamVjdE5hbWUsIHNwYWNlSWQsIHJlY29yZElkKSlcblxuXHQjIOi/h+a7pOaOiXZhbHVlc+S4reeahOmdnuazlWtleVxuXHRmaWx0ZXJWYWx1ZXMgPSB7fVxuXHRfLmVhY2ggXy5rZXlzKHZhbHVlcyksIChrKSAtPlxuXHRcdGlmIGZpZWxkQ29kZXMuaW5jbHVkZXMoaylcblx0XHRcdGZpbHRlclZhbHVlc1trXSA9IHZhbHVlc1trXVxuXG5cdHJldHVybiBmaWx0ZXJWYWx1ZXNcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5ldmFsRmllbGRNYXBTY3JpcHQgPSAoZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgb2JqZWN0SWQpIC0+XG5cdCMgcmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLmZpbmRPbmUob2JqZWN0SWQpXG5cdHJlY29yZCA9IG9iamVjdEZpbmRPbmUob2JqZWN0TmFtZSwgeyBmaWx0ZXJzOiBbWydfaWQnLCAnPScsIG9iamVjdElkXV0gfSlcblx0c2NyaXB0ID0gXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZWNvcmQpIHsgXCIgKyBmaWVsZF9tYXBfc2NyaXB0ICsgXCIgfVwiXG5cdGZ1bmMgPSBfZXZhbChzY3JpcHQsIFwiZmllbGRfbWFwX3NjcmlwdFwiKVxuXHR2YWx1ZXMgPSBmdW5jKHJlY29yZClcblx0aWYgXy5pc09iamVjdCB2YWx1ZXNcblx0XHRyZXR1cm4gdmFsdWVzXG5cdGVsc2Vcblx0XHRjb25zb2xlLmVycm9yIFwiZXZhbEZpZWxkTWFwU2NyaXB0OiDohJrmnKzov5Tlm57lgLznsbvlnovkuI3mmK/lr7nosaFcIlxuXHRyZXR1cm4ge31cblxuXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2ggPSAocmVjb3JkSWRzLCBzcGFjZUlkLCBpbnNJZCwgYXBwcm92ZUlkKSAtPlxuXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbJ2Ntc19maWxlcyddLmZpbmQoe1xuXHRcdHNwYWNlOiBzcGFjZUlkLFxuXHRcdHBhcmVudDogcmVjb3JkSWRzXG5cdH0pLmZvckVhY2ggKGNmKSAtPlxuXHRcdF8uZWFjaCBjZi52ZXJzaW9ucywgKHZlcnNpb25JZCwgaWR4KSAtPlxuXHRcdFx0ZiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ10uZmluZE9uZSh2ZXJzaW9uSWQpXG5cdFx0XHRuZXdGaWxlID0gbmV3IEZTLkZpbGUoKVxuXG5cdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEgZi5jcmVhdGVSZWFkU3RyZWFtKCdmaWxlcycpLCB7XG5cdFx0XHRcdFx0dHlwZTogZi5vcmlnaW5hbC50eXBlXG5cdFx0XHR9LCAoZXJyKSAtPlxuXHRcdFx0XHRpZiAoZXJyKVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyLmVycm9yLCBlcnIucmVhc29uKVxuXG5cdFx0XHRcdG5ld0ZpbGUubmFtZShmLm5hbWUoKSlcblx0XHRcdFx0bmV3RmlsZS5zaXplKGYuc2l6ZSgpKVxuXHRcdFx0XHRtZXRhZGF0YSA9IHtcblx0XHRcdFx0XHRvd25lcjogZi5tZXRhZGF0YS5vd25lcixcblx0XHRcdFx0XHRvd25lcl9uYW1lOiBmLm1ldGFkYXRhLm93bmVyX25hbWUsXG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXG5cdFx0XHRcdFx0aW5zdGFuY2U6IGluc0lkLFxuXHRcdFx0XHRcdGFwcHJvdmU6IGFwcHJvdmVJZFxuXHRcdFx0XHRcdHBhcmVudDogY2YuX2lkXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiBpZHggaXMgMFxuXHRcdFx0XHRcdG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlXG5cblx0XHRcdFx0bmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhXG5cdFx0XHRcdGNmcy5pbnN0YW5jZXMuaW5zZXJ0KG5ld0ZpbGUpXG5cblx0cmV0dXJuXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8gPSAocmVjb3JkSWRzLCBpbnNJZCwgc3BhY2VJZCkgLT5cblx0IyBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLnVwZGF0ZShyZWNvcmRJZHMuaWRzWzBdLCB7XG5cdCMgXHQkcHVzaDoge1xuXHQjIFx0XHRpbnN0YW5jZXM6IHtcblx0IyBcdFx0XHQkZWFjaDogW3tcblx0IyBcdFx0XHRcdF9pZDogaW5zSWQsXG5cdCMgXHRcdFx0XHRzdGF0ZTogJ2RyYWZ0J1xuXHQjIFx0XHRcdH1dLFxuXHQjIFx0XHRcdCRwb3NpdGlvbjogMFxuXHQjIFx0XHR9XG5cdCMgXHR9LFxuXHQjIFx0JHNldDoge1xuXHQjIFx0XHRsb2NrZWQ6IHRydWVcblx0IyBcdFx0aW5zdGFuY2Vfc3RhdGU6ICdkcmFmdCdcblx0IyBcdH1cblx0IyB9KVxuXHRvYmplY3RVcGRhdGUocmVjb3JkSWRzLm8sIHJlY29yZElkcy5pZHNbMF0sIHtcblx0XHRpbnN0YW5jZXM6IFt7XG5cdFx0XHRfaWQ6IGluc0lkLFxuXHRcdFx0c3RhdGU6ICdkcmFmdCdcblx0XHR9XSxcblx0XHRsb2NrZWQ6IHRydWUsXG5cdFx0aW5zdGFuY2Vfc3RhdGU6ICdkcmFmdCdcblx0fSlcblxuXHRyZXR1cm5cblxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyA9IChyZWxhdGVkVGFibGVzSW5mbywgaW5zSWQsIHNwYWNlSWQpIC0+XG5cdF8uZWFjaCByZWxhdGVkVGFibGVzSW5mbywgKHRhYmxlSXRlbXMsIHJlbGF0ZWRPYmplY3ROYW1lKSAtPlxuXHRcdHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKVxuXHRcdF8uZWFjaCB0YWJsZUl0ZW1zLCAoaXRlbSkgLT5cblx0XHRcdHJlbGF0ZWRDb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoaXRlbS5fdGFibGUuX2lkLCB7XG5cdFx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0XHRpbnN0YW5jZXM6IFt7XG5cdFx0XHRcdFx0XHRfaWQ6IGluc0lkLFxuXHRcdFx0XHRcdFx0c3RhdGU6ICdkcmFmdCdcblx0XHRcdFx0XHR9XSxcblx0XHRcdFx0XHRfdGFibGU6IGl0ZW0uX3RhYmxlXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cblx0cmV0dXJuXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tJc0luQXBwcm92YWwgPSAocmVjb3JkSWRzLCBzcGFjZUlkKSAtPlxuXHQjIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkuZmluZE9uZSh7XG5cdCMgXHRfaWQ6IHJlY29yZElkcy5pZHNbMF0sIGluc3RhbmNlczogeyAkZXhpc3RzOiB0cnVlIH1cblx0IyB9LCB7IGZpZWxkczogeyBpbnN0YW5jZXM6IDEgfSB9KVxuXHRyZWNvcmQgPSBvYmplY3RGaW5kT25lKHJlY29yZElkcy5vLCB7IGZpbHRlcnM6IFtbJ19pZCcsICc9JywgcmVjb3JkSWRzLmlkc1swXV1dLCBmaWVsZHM6IFsnaW5zdGFuY2VzJ10gfSlcblxuXHRpZiByZWNvcmQgYW5kIHJlY29yZC5pbnN0YW5jZXMgYW5kIHJlY29yZC5pbnN0YW5jZXNbMF0uc3RhdGUgaXNudCAnY29tcGxldGVkJyBhbmQgQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZChyZWNvcmQuaW5zdGFuY2VzWzBdLl9pZCkuY291bnQoKSA+IDBcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuatpOiusOW9leW3suWPkei1t+a1geeoi+ato+WcqOWuoeaJueS4re+8jOW+heWuoeaJuee7k+adn+aWueWPr+WPkei1t+S4i+S4gOasoeWuoeaJue+8gVwiKVxuXG5cdHJldHVyblxuXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZm9ybWF0RGF0ZSA9IChkYXRlKSAtPlxuXHRyZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikiLCJ2YXIgX2V2YWwsIGNoZWNrUmVxdWlyZWREZXRhaWxzLCBnZXRGaWVsZE9kYXRhVmFsdWUsIGdldEZpbGVGaWVsZFZhbHVlLCBnZXRGb3JtRmllbGQsIGdldEZvcm1UYWJsZUZpZWxkLCBnZXRGb3JtVGFibGVGaWVsZENvZGUsIGdldEZvcm1UYWJsZVN1YkZpZWxkLCBnZXRJbnN0YW5jZUZpZWxkVmFsdWUsIGdldE9iamVjdENvbmZpZywgZ2V0T2JqZWN0TmFtZUZpZWxkS2V5LCBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlLCBnZXRSZWxhdGVkcywgZ2V0U2VsZWN0T3JnVmFsdWUsIGdldFNlbGVjdE9yZ1ZhbHVlcywgZ2V0U2VsZWN0VXNlclZhbHVlLCBnZXRTZWxlY3RVc2VyVmFsdWVzLCBvYmplY3RGaW5kLCBvYmplY3RGaW5kT25lLCBvYmplY3RVcGRhdGUsIG9iamVjdHFsOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5fZXZhbCA9IHJlcXVpcmUoJ2V2YWwnKTtcblxub2JqZWN0cWwgPSByZXF1aXJlKCdAc3RlZWRvcy9vYmplY3RxbCcpO1xuXG5nZXRPYmplY3RDb25maWcgPSBmdW5jdGlvbihvYmplY3RBcGlOYW1lKSB7XG4gIHJldHVybiBvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkudG9Db25maWcoKTtcbn07XG5cbmdldE9iamVjdE5hbWVGaWVsZEtleSA9IGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUpIHtcbiAgcmV0dXJuIG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS5OQU1FX0ZJRUxEX0tFWTtcbn07XG5cbmdldFJlbGF0ZWRzID0gZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSkge1xuICByZXR1cm4gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihvYmplY3RBcGlOYW1lLCBjYikge1xuICAgIHJldHVybiBvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkuZ2V0UmVsYXRlZHMoKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH0pKG9iamVjdEFwaU5hbWUpO1xufTtcblxub2JqZWN0RmluZE9uZSA9IGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUsIHF1ZXJ5KSB7XG4gIHJldHVybiBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUsIHF1ZXJ5LCBjYikge1xuICAgIHF1ZXJ5LnRvcCA9IDE7XG4gICAgcmV0dXJuIG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS5maW5kKHF1ZXJ5KS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgaWYgKHJlc29sdmUgJiYgcmVzb2x2ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmVbMF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNiKHJlamVjdCwgbnVsbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pKG9iamVjdEFwaU5hbWUsIHF1ZXJ5KTtcbn07XG5cbm9iamVjdEZpbmQgPSBmdW5jdGlvbihvYmplY3RBcGlOYW1lLCBxdWVyeSkge1xuICByZXR1cm4gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihvYmplY3RBcGlOYW1lLCBxdWVyeSwgY2IpIHtcbiAgICByZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLmZpbmQocXVlcnkpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfSkob2JqZWN0QXBpTmFtZSwgcXVlcnkpO1xufTtcblxub2JqZWN0VXBkYXRlID0gZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSwgaWQsIGRhdGEpIHtcbiAgcmV0dXJuIE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSwgaWQsIGRhdGEsIGNiKSB7XG4gICAgcmV0dXJuIG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS51cGRhdGUoaWQsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfSkob2JqZWN0QXBpTmFtZSwgaWQsIGRhdGEpO1xufTtcblxuZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSA9IGZ1bmN0aW9uKHJlbGF0ZWRPYmplY3RzS2V5cywga2V5KSB7XG4gIHJldHVybiBfLmZpbmQocmVsYXRlZE9iamVjdHNLZXlzLCBmdW5jdGlvbihyZWxhdGVkT2JqZWN0c0tleSkge1xuICAgIHJldHVybiBrZXkuc3RhcnRzV2l0aChyZWxhdGVkT2JqZWN0c0tleSArICcuJyk7XG4gIH0pO1xufTtcblxuZ2V0Rm9ybVRhYmxlRmllbGRDb2RlID0gZnVuY3Rpb24oZm9ybVRhYmxlRmllbGRzQ29kZSwga2V5KSB7XG4gIHJldHVybiBfLmZpbmQoZm9ybVRhYmxlRmllbGRzQ29kZSwgZnVuY3Rpb24oZm9ybVRhYmxlRmllbGRDb2RlKSB7XG4gICAgcmV0dXJuIGtleS5zdGFydHNXaXRoKGZvcm1UYWJsZUZpZWxkQ29kZSArICcuJyk7XG4gIH0pO1xufTtcblxuZ2V0Rm9ybVRhYmxlRmllbGQgPSBmdW5jdGlvbihmb3JtVGFibGVGaWVsZHMsIGtleSkge1xuICByZXR1cm4gXy5maW5kKGZvcm1UYWJsZUZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgIHJldHVybiBmLmNvZGUgPT09IGtleTtcbiAgfSk7XG59O1xuXG5nZXRGb3JtRmllbGQgPSBmdW5jdGlvbihmb3JtRmllbGRzLCBrZXkpIHtcbiAgdmFyIGZmO1xuICBmZiA9IG51bGw7XG4gIF8uZm9yRWFjaChmb3JtRmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgaWYgKGZmKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChmLnR5cGUgPT09ICdzZWN0aW9uJykge1xuICAgICAgcmV0dXJuIGZmID0gXy5maW5kKGYuZmllbGRzLCBmdW5jdGlvbihzZikge1xuICAgICAgICByZXR1cm4gc2YuY29kZSA9PT0ga2V5O1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChmLmNvZGUgPT09IGtleSkge1xuICAgICAgcmV0dXJuIGZmID0gZjtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmY7XG59O1xuXG5nZXRGb3JtVGFibGVTdWJGaWVsZCA9IGZ1bmN0aW9uKHRhYmxlRmllbGQsIHN1YkZpZWxkQ29kZSkge1xuICByZXR1cm4gXy5maW5kKHRhYmxlRmllbGQuZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgcmV0dXJuIGYuY29kZSA9PT0gc3ViRmllbGRDb2RlO1xuICB9KTtcbn07XG5cbmdldEZpZWxkT2RhdGFWYWx1ZSA9IGZ1bmN0aW9uKG9iak5hbWUsIGlkLCByZWZlcmVuY2VUb0ZpZWxkTmFtZSkge1xuICB2YXIgX3JlY29yZCwgX3JlY29yZHMsIG5hbWVLZXksIG9iajtcbiAgb2JqID0gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iak5hbWUpO1xuICBuYW1lS2V5ID0gZ2V0T2JqZWN0TmFtZUZpZWxkS2V5KG9iak5hbWUpO1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoXy5pc1N0cmluZyhpZCkpIHtcbiAgICBfcmVjb3JkID0gb2JqZWN0RmluZE9uZShvYmpOYW1lLCB7XG4gICAgICBmaWx0ZXJzOiBbW3JlZmVyZW5jZVRvRmllbGROYW1lLCAnPScsIGlkXV1cbiAgICB9KTtcbiAgICBpZiAoX3JlY29yZCkge1xuICAgICAgX3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkW25hbWVLZXldO1xuICAgICAgcmV0dXJuIF9yZWNvcmQ7XG4gICAgfVxuICB9IGVsc2UgaWYgKF8uaXNBcnJheShpZCkpIHtcbiAgICBfcmVjb3JkcyA9IFtdO1xuICAgIG9iamVjdEZpbmQob2JqTmFtZSwge1xuICAgICAgZmlsdGVyczogW1tyZWZlcmVuY2VUb0ZpZWxkTmFtZSwgJ2luJywgaWRdXVxuICAgIH0pLmZvckVhY2goZnVuY3Rpb24oX3JlY29yZCkge1xuICAgICAgX3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkW25hbWVLZXldO1xuICAgICAgcmV0dXJuIF9yZWNvcmRzLnB1c2goX3JlY29yZCk7XG4gICAgfSk7XG4gICAgaWYgKCFfLmlzRW1wdHkoX3JlY29yZHMpKSB7XG4gICAgICByZXR1cm4gX3JlY29yZHM7XG4gICAgfVxuICB9XG59O1xuXG5nZXRTZWxlY3RVc2VyVmFsdWUgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIHN1O1xuICBzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICB1c2VyOiB1c2VySWRcbiAgfSk7XG4gIHN1LmlkID0gdXNlcklkO1xuICByZXR1cm4gc3U7XG59O1xuXG5nZXRTZWxlY3RVc2VyVmFsdWVzID0gZnVuY3Rpb24odXNlcklkcywgc3BhY2VJZCkge1xuICB2YXIgc3VzO1xuICBzdXMgPSBbXTtcbiAgaWYgKF8uaXNBcnJheSh1c2VySWRzKSkge1xuICAgIF8uZWFjaCh1c2VySWRzLCBmdW5jdGlvbih1c2VySWQpIHtcbiAgICAgIHZhciBzdTtcbiAgICAgIHN1ID0gZ2V0U2VsZWN0VXNlclZhbHVlKHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgICBpZiAoc3UpIHtcbiAgICAgICAgcmV0dXJuIHN1cy5wdXNoKHN1KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gc3VzO1xufTtcblxuZ2V0U2VsZWN0T3JnVmFsdWUgPSBmdW5jdGlvbihvcmdJZCwgc3BhY2VJZCkge1xuICB2YXIgb3JnO1xuICBvcmcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kT25lKG9yZ0lkLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBfaWQ6IDEsXG4gICAgICBuYW1lOiAxLFxuICAgICAgZnVsbG5hbWU6IDFcbiAgICB9XG4gIH0pO1xuICBvcmcuaWQgPSBvcmdJZDtcbiAgcmV0dXJuIG9yZztcbn07XG5cbmdldFNlbGVjdE9yZ1ZhbHVlcyA9IGZ1bmN0aW9uKG9yZ0lkcywgc3BhY2VJZCkge1xuICB2YXIgb3JncztcbiAgb3JncyA9IFtdO1xuICBpZiAoXy5pc0FycmF5KG9yZ0lkcykpIHtcbiAgICBfLmVhY2gob3JnSWRzLCBmdW5jdGlvbihvcmdJZCkge1xuICAgICAgdmFyIG9yZztcbiAgICAgIG9yZyA9IGdldFNlbGVjdE9yZ1ZhbHVlKG9yZ0lkLCBzcGFjZUlkKTtcbiAgICAgIGlmIChvcmcpIHtcbiAgICAgICAgcmV0dXJuIG9yZ3MucHVzaChvcmcpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvcmdzO1xufTtcblxuZ2V0RmlsZUZpZWxkVmFsdWUgPSBmdW5jdGlvbihyZWNvcmRGaWVsZElkLCBmVHlwZSkge1xuICB2YXIgY29sbGVjdGlvbiwgZmlsZXMsIHF1ZXJ5LCB2YWx1ZTtcbiAgaWYgKF8uaXNFbXB0eShyZWNvcmRGaWVsZElkKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZlR5cGUgPT09ICdpbWFnZScpIHtcbiAgICBjb2xsZWN0aW9uID0gJ2ltYWdlcyc7XG4gIH0gZWxzZSBpZiAoZlR5cGUgPT09ICdmaWxlJykge1xuICAgIGNvbGxlY3Rpb24gPSAnZmlsZXMnO1xuICB9XG4gIGlmIChfLmlzU3RyaW5nKHJlY29yZEZpZWxkSWQpKSB7XG4gICAgcXVlcnkgPSB7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiBbcmVjb3JkRmllbGRJZF1cbiAgICAgIH1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHF1ZXJ5ID0ge1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogcmVjb3JkRmllbGRJZFxuICAgICAgfVxuICAgIH07XG4gIH1cbiAgZmlsZXMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiY2ZzLlwiICsgY29sbGVjdGlvbiArIFwiLmZpbGVyZWNvcmRcIl0uZmluZChxdWVyeSk7XG4gIHZhbHVlID0gW107XG4gIGZpbGVzLmZvckVhY2goZnVuY3Rpb24oZikge1xuICAgIHZhciBuZXdGaWxlO1xuICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgIHJldHVybiBuZXdGaWxlLmF0dGFjaERhdGEoZi5jcmVhdGVSZWFkU3RyZWFtKCdmaWxlcycpLCB7XG4gICAgICB0eXBlOiBmLm9yaWdpbmFsLnR5cGVcbiAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgIHZhciBtZXRhZGF0YTtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnIuZXJyb3IsIGVyci5yZWFzb24pO1xuICAgICAgfVxuICAgICAgbmV3RmlsZS5uYW1lKGYubmFtZSgpKTtcbiAgICAgIG5ld0ZpbGUuc2l6ZShmLnNpemUoKSk7XG4gICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgb3duZXI6IGYubWV0YWRhdGEub3duZXJcbiAgICAgIH07XG4gICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICBuZXdGaWxlLl9pZCA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLl9tYWtlTmV3SUQoKTtcbiAgICAgIGNmc1tjb2xsZWN0aW9uXS5pbnNlcnQobmV3RmlsZSk7XG4gICAgICByZXR1cm4gdmFsdWUucHVzaChuZXdGaWxlLl9pZCk7XG4gICAgfSk7XG4gIH0pO1xuICBpZiAodmFsdWUubGVuZ3RoID4gMCkge1xuICAgIGlmIChfLmlzU3RyaW5nKHJlY29yZEZpZWxkSWQpKSB7XG4gICAgICByZXR1cm4gdmFsdWVbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gIH1cbn07XG5cbmdldEluc3RhbmNlRmllbGRWYWx1ZSA9IGZ1bmN0aW9uKG9iakZpZWxkLCBmb3JtRmllbGQsIHJlY29yZCwgb2JqZWN0X2ZpZWxkLCBzcGFjZUlkLCByZWNvcmRGaWVsZFZhbHVlKSB7XG4gIHZhciBvZGF0YUZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lLCByZWZlcmVuY2VUb09iamVjdE5hbWUsIHNlbGVjdEZpZWxkVmFsdWUsIHZhbHVlO1xuICBpZiAoZm9ybUZpZWxkLnN0ZWVkb3NfZmllbGQpIHtcbiAgICByZXR1cm4gcmVjb3JkRmllbGRWYWx1ZTtcbiAgfVxuICByZWNvcmRGaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdO1xuICB2YWx1ZTtcbiAgaWYgKGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgcmVmZXJlbmNlVG9GaWVsZE5hbWUgPSBvYmpGaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQgfHwgJ19pZCc7XG4gICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqRmllbGQucmVmZXJlbmNlX3RvO1xuICAgIG9kYXRhRmllbGRWYWx1ZTtcbiAgICBpZiAob2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICBvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWNvcmRGaWVsZFZhbHVlLCByZWZlcmVuY2VUb0ZpZWxkTmFtZSk7XG4gICAgfSBlbHNlIGlmICghb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVjb3JkRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9GaWVsZE5hbWUpO1xuICAgIH1cbiAgICB2YWx1ZSA9IG9kYXRhRmllbGRWYWx1ZTtcbiAgfSBlbHNlIGlmIChmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiAoWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob2JqRmllbGQucmVmZXJlbmNlX3RvKSB8fCAoJ3NwYWNlX3VzZXJzJyA9PT0gb2JqRmllbGQucmVmZXJlbmNlX3RvICYmICd1c2VyJyA9PT0gb2JqRmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkKSkpIHtcbiAgICBpZiAoIV8uaXNFbXB0eShyZWNvcmRGaWVsZFZhbHVlKSkge1xuICAgICAgc2VsZWN0RmllbGRWYWx1ZTtcbiAgICAgIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ3VzZXInKSB7XG4gICAgICAgIGlmIChvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICBzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWNvcmRGaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgfSBlbHNlIGlmICghb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVjb3JkRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdncm91cCcpIHtcbiAgICAgICAgaWYgKG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVjb3JkRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICBzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWUocmVjb3JkRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzZWxlY3RGaWVsZFZhbHVlKSB7XG4gICAgICAgIHZhbHVlID0gc2VsZWN0RmllbGRWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoZm9ybUZpZWxkICYmIG9iakZpZWxkICYmIGZvcm1GaWVsZC50eXBlID09PSAnZGF0ZScgJiYgcmVjb3JkRmllbGRWYWx1ZSkge1xuICAgIHZhbHVlID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5mb3JtYXREYXRlKHJlY29yZEZpZWxkVmFsdWUpO1xuICB9IGVsc2UgaWYgKGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiByZWNvcmRGaWVsZFZhbHVlICYmIChmb3JtRmllbGQudHlwZSA9PT0gJ2ltYWdlJyB8fCBmb3JtRmllbGQudHlwZSA9PT0gJ2ZpbGUnKSkge1xuICAgIHZhbHVlID0gZ2V0RmlsZUZpZWxkVmFsdWUocmVjb3JkRmllbGRWYWx1ZSwgZm9ybUZpZWxkLnR5cGUpO1xuICB9IGVsc2UgaWYgKGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiByZWNvcmRGaWVsZFZhbHVlICYmIGZvcm1GaWVsZC50eXBlID09PSAnbG9va3VwJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgdmFsdWUgPSByZWNvcmRGaWVsZFZhbHVlO1xuICB9IGVsc2UgaWYgKGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiByZWNvcmRGaWVsZFZhbHVlICYmIChmb3JtRmllbGQudHlwZSA9PT0gJ211bHRpU2VsZWN0JykpIHtcbiAgICB2YWx1ZSA9IHJlY29yZEZpZWxkVmFsdWUuam9pbignLCcpO1xuICB9IGVsc2UgaWYgKHJlY29yZC5oYXNPd25Qcm9wZXJ0eShvYmplY3RfZmllbGQpKSB7XG4gICAgdmFsdWUgPSByZWNvcmRGaWVsZFZhbHVlO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbmNoZWNrUmVxdWlyZWREZXRhaWxzID0gZnVuY3Rpb24ocmVxdWlyZWREZXRhaWxzLCBtYXN0ZXJSZWNvcmQpIHtcbiAgaWYgKCFfLmlzRW1wdHkocmVxdWlyZWREZXRhaWxzKSkge1xuICAgIHJlcXVpcmVkRGV0YWlscy5mb3JFYWNoKGZ1bmN0aW9uKHJkKSB7XG4gICAgICB2YXIgbWFzdGVyRmllbGQsIG1hc3RlckZpZWxkVmFsdWUsIHJlZklkLCBzdWJPYmpDb25maWcsIHN1YlRhYmxlTWFzdGVyRmllbGQsIHN1YlRhYmxlTmFtZSwgc3ViVGFibGVSZWNvcmQ7XG4gICAgICBzdWJUYWJsZU5hbWUgPSByZC5zcGxpdCgnLicpWzBdO1xuICAgICAgc3ViVGFibGVNYXN0ZXJGaWVsZCA9IHJkLnNwbGl0KCcuJylbMV07XG4gICAgICBzdWJPYmpDb25maWcgPSBnZXRPYmplY3RDb25maWcoc3ViVGFibGVOYW1lKTtcbiAgICAgIG1hc3RlckZpZWxkID0gc3ViT2JqQ29uZmlnLmZpZWxkc1tzdWJUYWJsZU1hc3RlckZpZWxkXTtcbiAgICAgIHJlZklkID0gbWFzdGVyRmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkIHx8ICdfaWQnO1xuICAgICAgbWFzdGVyRmllbGRWYWx1ZSA9IG1hc3RlclJlY29yZFtyZWZJZF07XG4gICAgICBzdWJUYWJsZVJlY29yZCA9IG9iamVjdEZpbmRPbmUoc3ViVGFibGVOYW1lLCB7XG4gICAgICAgIGZpbHRlcnM6IFtbc3ViVGFibGVNYXN0ZXJGaWVsZCwgJz0nLCBtYXN0ZXJGaWVsZFZhbHVlXV0sXG4gICAgICAgIGZpZWxkczogW3N1YlRhYmxlTWFzdGVyRmllbGRdXG4gICAgICB9KTtcbiAgICAgIGlmICghc3ViVGFibGVSZWNvcmQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwi6K+35YWI5paw5aKeXCIgKyBzdWJPYmpDb25maWcubGFiZWwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge307XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbiA9IGZ1bmN0aW9uKHJlcSkge1xuICB2YXIgYXV0aFRva2VuLCBoYXNoZWRUb2tlbiwgcXVlcnksIHVzZXIsIHVzZXJJZDtcbiAgcXVlcnkgPSByZXEucXVlcnk7XG4gIHVzZXJJZCA9IHF1ZXJ5W1wiWC1Vc2VyLUlkXCJdO1xuICBhdXRoVG9rZW4gPSBxdWVyeVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICBfaWQ6IHVzZXJJZCxcbiAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICB9KTtcbiAgaWYgKCF1c2VyKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICByZXR1cm4gdXNlcjtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2UgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICB2YXIgc3BhY2U7XG4gIHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gIGlmICghc3BhY2UpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInNwYWNlX2lk5pyJ6K+v5oiW5q2kc3BhY2Xlt7Lnu4/ooqvliKDpmaRcIik7XG4gIH1cbiAgcmV0dXJuIHNwYWNlO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93ID0gZnVuY3Rpb24oZmxvd19pZCkge1xuICB2YXIgZmxvdztcbiAgZmxvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZmxvd3MuZmluZE9uZShmbG93X2lkKTtcbiAgaWYgKCFmbG93KSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJpZOacieivr+aIluatpOa1geeoi+W3sue7j+iiq+WIoOmZpFwiKTtcbiAgfVxuICByZXR1cm4gZmxvdztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyID0gZnVuY3Rpb24oc3BhY2VfaWQsIHVzZXJfaWQpIHtcbiAgdmFyIHNwYWNlX3VzZXI7XG4gIHNwYWNlX3VzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB1c2VyOiB1c2VyX2lkXG4gIH0pO1xuICBpZiAoIXNwYWNlX3VzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInVzZXJfaWTlr7nlupTnmoTnlKjmiLfkuI3lsZ7kuo7lvZPliY1zcGFjZVwiKTtcbiAgfVxuICByZXR1cm4gc3BhY2VfdXNlcjtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyA9IGZ1bmN0aW9uKHNwYWNlX3VzZXIpIHtcbiAgdmFyIGluZm8sIG9yZztcbiAgaW5mbyA9IG5ldyBPYmplY3Q7XG4gIGluZm8ub3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb247XG4gIG9yZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub3JnYW5pemF0aW9ucy5maW5kT25lKHNwYWNlX3VzZXIub3JnYW5pemF0aW9uLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBuYW1lOiAxLFxuICAgICAgZnVsbG5hbWU6IDFcbiAgICB9XG4gIH0pO1xuICBpbmZvLm9yZ2FuaXphdGlvbl9uYW1lID0gb3JnLm5hbWU7XG4gIGluZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gb3JnLmZ1bGxuYW1lO1xuICByZXR1cm4gaW5mbztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZCA9IGZ1bmN0aW9uKGZsb3cpIHtcbiAgaWYgKGZsb3cuc3RhdGUgIT09IFwiZW5hYmxlZFwiKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvmnKrlkK/nlKgs5pON5L2c5aSx6LSlXCIpO1xuICB9XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZCA9IGZ1bmN0aW9uKGZsb3csIHNwYWNlX2lkKSB7XG4gIGlmIChmbG93LnNwYWNlICE9PSBzcGFjZV9pZCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5ZKM5bel5L2c5Yy6SUTkuI3ljLnphY1cIik7XG4gIH1cbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybSA9IGZ1bmN0aW9uKGZvcm1faWQpIHtcbiAgdmFyIGZvcm07XG4gIGZvcm0gPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZvcm1zLmZpbmRPbmUoZm9ybV9pZCk7XG4gIGlmICghZm9ybSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsICfooajljZVJROacieivr+aIluatpOihqOWNleW3sue7j+iiq+WIoOmZpCcpO1xuICB9XG4gIHJldHVybiBmb3JtO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeSA9IGZ1bmN0aW9uKGNhdGVnb3J5X2lkKSB7XG4gIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLmNhdGVnb3JpZXMuZmluZE9uZShjYXRlZ29yeV9pZCk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrU3luY0RpcmVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmbG93X2lkKSB7XG4gIHZhciBvdywgc3luY0RpcmVjdGlvbjtcbiAgb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIGZsb3dfaWQ6IGZsb3dfaWRcbiAgfSk7XG4gIGlmICghb3cpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn5pyq5om+5Yiw5a+56LGh5rWB56iL5pig5bCE6K6w5b2V44CCJyk7XG4gIH1cbiAgc3luY0RpcmVjdGlvbiA9IG93LnN5bmNfZGlyZWN0aW9uIHx8ICdib3RoJztcbiAgaWYgKCFbJ2JvdGgnLCAnb2JqX3RvX2lucyddLmluY2x1ZGVzKHN5bmNEaXJlY3Rpb24pKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+S4jeaUr+aMgeeahOWQjOatpeaWueWQkeOAgicpO1xuICB9XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNyZWF0ZV9pbnN0YW5jZSA9IGZ1bmN0aW9uKGluc3RhbmNlX2Zyb21fY2xpZW50LCB1c2VyX2luZm8pIHtcbiAgdmFyIGFwcHJfb2JqLCBhcHByb3ZlX2Zyb21fY2xpZW50LCBjYXRlZ29yeSwgZmxvdywgZmxvd19pZCwgZm9ybSwgaW5zX29iaiwgbmV3X2luc19pZCwgbm93LCBwZXJtaXNzaW9ucywgcmVsYXRlZFRhYmxlc0luZm8sIHNwYWNlLCBzcGFjZV9pZCwgc3BhY2VfdXNlciwgc3BhY2VfdXNlcl9vcmdfaW5mbywgc3RhcnRfc3RlcCwgdHJhY2VfZnJvbV9jbGllbnQsIHRyYWNlX29iaiwgdXNlcl9pZDtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0sIFN0cmluZyk7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0sIFN0cmluZyk7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXSwgU3RyaW5nKTtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdLCBbXG4gICAge1xuICAgICAgbzogU3RyaW5nLFxuICAgICAgaWRzOiBbU3RyaW5nXVxuICAgIH1cbiAgXSk7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tTeW5jRGlyZWN0aW9uKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVswXS5vLCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl0pO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVswXSwgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSk7XG4gIHNwYWNlX2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXTtcbiAgZmxvd19pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXTtcbiAgdXNlcl9pZCA9IHVzZXJfaW5mby5faWQ7XG4gIHRyYWNlX2Zyb21fY2xpZW50ID0gbnVsbDtcbiAgYXBwcm92ZV9mcm9tX2NsaWVudCA9IG51bGw7XG4gIGlmIChpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXSAmJiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXSkge1xuICAgIHRyYWNlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF07XG4gICAgaWYgKHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl0gJiYgdHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXVswXSkge1xuICAgICAgYXBwcm92ZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdW1wiYXBwcm92ZXNcIl1bMF07XG4gICAgfVxuICB9XG4gIHNwYWNlID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZShzcGFjZV9pZCk7XG4gIGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZCk7XG4gIHNwYWNlX3VzZXIgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlcihzcGFjZV9pZCwgdXNlcl9pZCk7XG4gIHNwYWNlX3VzZXJfb3JnX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8oc3BhY2VfdXNlcik7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZChmbG93KTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQoZmxvdywgc3BhY2VfaWQpO1xuICBmb3JtID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtKGZsb3cuZm9ybSk7XG4gIHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dfaWQsIHVzZXJfaWQpO1xuICBpZiAoIXBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRkXCIpKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLlvZPliY3nlKjmiLfmsqHmnInmraTmtYHnqIvnmoTmlrDlu7rmnYPpmZBcIik7XG4gIH1cbiAgbm93ID0gbmV3IERhdGU7XG4gIGluc19vYmogPSB7fTtcbiAgaW5zX29iai5faWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5fbWFrZU5ld0lEKCk7XG4gIGluc19vYmouc3BhY2UgPSBzcGFjZV9pZDtcbiAgaW5zX29iai5mbG93ID0gZmxvd19pZDtcbiAgaW5zX29iai5mbG93X3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuX2lkO1xuICBpbnNfb2JqLmZvcm0gPSBmbG93LmZvcm07XG4gIGluc19vYmouZm9ybV92ZXJzaW9uID0gZmxvdy5jdXJyZW50LmZvcm1fdmVyc2lvbjtcbiAgaW5zX29iai5uYW1lID0gZmxvdy5uYW1lO1xuICBpbnNfb2JqLnN1Ym1pdHRlciA9IHVzZXJfaWQ7XG4gIGluc19vYmouc3VibWl0dGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIDogdXNlcl9pZDtcbiAgaW5zX29iai5hcHBsaWNhbnRfbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIDogdXNlcl9pbmZvLm5hbWU7XG4gIGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbiA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSA6IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uO1xuICBpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gOiBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9uYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gOiBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnRfY29tcGFueSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdIDogc3BhY2VfdXNlci5jb21wYW55X2lkO1xuICBpbnNfb2JqLnN0YXRlID0gJ2RyYWZ0JztcbiAgaW5zX29iai5jb2RlID0gJyc7XG4gIGluc19vYmouaXNfYXJjaGl2ZWQgPSBmYWxzZTtcbiAgaW5zX29iai5pc19kZWxldGVkID0gZmFsc2U7XG4gIGluc19vYmouY3JlYXRlZCA9IG5vdztcbiAgaW5zX29iai5jcmVhdGVkX2J5ID0gdXNlcl9pZDtcbiAgaW5zX29iai5tb2RpZmllZCA9IG5vdztcbiAgaW5zX29iai5tb2RpZmllZF9ieSA9IHVzZXJfaWQ7XG4gIGluc19vYmoucmVjb3JkX2lkcyA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXTtcbiAgaWYgKHNwYWNlX3VzZXIuY29tcGFueV9pZCkge1xuICAgIGluc19vYmouY29tcGFueV9pZCA9IHNwYWNlX3VzZXIuY29tcGFueV9pZDtcbiAgfVxuICB0cmFjZV9vYmogPSB7fTtcbiAgdHJhY2Vfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHI7XG4gIHRyYWNlX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkO1xuICB0cmFjZV9vYmouaXNfZmluaXNoZWQgPSBmYWxzZTtcbiAgc3RhcnRfc3RlcCA9IF8uZmluZChmbG93LmN1cnJlbnQuc3RlcHMsIGZ1bmN0aW9uKHN0ZXApIHtcbiAgICByZXR1cm4gc3RlcC5zdGVwX3R5cGUgPT09ICdzdGFydCc7XG4gIH0pO1xuICB0cmFjZV9vYmouc3RlcCA9IHN0YXJ0X3N0ZXAuX2lkO1xuICB0cmFjZV9vYmoubmFtZSA9IHN0YXJ0X3N0ZXAubmFtZTtcbiAgdHJhY2Vfb2JqLnN0YXJ0X2RhdGUgPSBub3c7XG4gIGFwcHJfb2JqID0ge307XG4gIGFwcHJfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHI7XG4gIGFwcHJfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWQ7XG4gIGFwcHJfb2JqLnRyYWNlID0gdHJhY2Vfb2JqLl9pZDtcbiAgYXBwcl9vYmouaXNfZmluaXNoZWQgPSBmYWxzZTtcbiAgYXBwcl9vYmoudXNlciA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gOiB1c2VyX2lkO1xuICBhcHByX29iai51c2VyX25hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA6IHVzZXJfaW5mby5uYW1lO1xuICBhcHByX29iai5oYW5kbGVyID0gdXNlcl9pZDtcbiAgYXBwcl9vYmouaGFuZGxlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWU7XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb247XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX25hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLm5hbWU7XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5mdWxsbmFtZTtcbiAgYXBwcl9vYmoudHlwZSA9ICdkcmFmdCc7XG4gIGFwcHJfb2JqLnN0YXJ0X2RhdGUgPSBub3c7XG4gIGFwcHJfb2JqLnJlYWRfZGF0ZSA9IG5vdztcbiAgYXBwcl9vYmouaXNfcmVhZCA9IHRydWU7XG4gIGFwcHJfb2JqLmlzX2Vycm9yID0gZmFsc2U7XG4gIGFwcHJfb2JqLmRlc2NyaXB0aW9uID0gJyc7XG4gIHJlbGF0ZWRUYWJsZXNJbmZvID0ge307XG4gIGFwcHJfb2JqLnZhbHVlcyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMoaW5zX29iai5yZWNvcmRfaWRzWzBdLCBmbG93X2lkLCBzcGFjZV9pZCwgZm9ybS5jdXJyZW50LmZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pO1xuICB0cmFjZV9vYmouYXBwcm92ZXMgPSBbYXBwcl9vYmpdO1xuICBpbnNfb2JqLnRyYWNlcyA9IFt0cmFjZV9vYmpdO1xuICBpbnNfb2JqLnZhbHVlcyA9IGFwcHJfb2JqLnZhbHVlcztcbiAgaW5zX29iai5pbmJveF91c2VycyA9IGluc3RhbmNlX2Zyb21fY2xpZW50LmluYm94X3VzZXJzIHx8IFtdO1xuICBpbnNfb2JqLmN1cnJlbnRfc3RlcF9uYW1lID0gc3RhcnRfc3RlcC5uYW1lO1xuICBpZiAoZmxvdy5hdXRvX3JlbWluZCA9PT0gdHJ1ZSkge1xuICAgIGluc19vYmouYXV0b19yZW1pbmQgPSB0cnVlO1xuICB9XG4gIGluc19vYmouZmxvd19uYW1lID0gZmxvdy5uYW1lO1xuICBpZiAoZm9ybS5jYXRlZ29yeSkge1xuICAgIGNhdGVnb3J5ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeShmb3JtLmNhdGVnb3J5KTtcbiAgICBpZiAoY2F0ZWdvcnkpIHtcbiAgICAgIGluc19vYmouY2F0ZWdvcnlfbmFtZSA9IGNhdGVnb3J5Lm5hbWU7XG4gICAgICBpbnNfb2JqLmNhdGVnb3J5ID0gY2F0ZWdvcnkuX2lkO1xuICAgIH1cbiAgfVxuICBuZXdfaW5zX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuaW5zZXJ0KGluc19vYmopO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvKGluc19vYmoucmVjb3JkX2lkc1swXSwgbmV3X2luc19pZCwgc3BhY2VfaWQpO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoKGluc19vYmoucmVjb3JkX2lkc1swXSwgc3BhY2VfaWQsIGluc19vYmouX2lkLCBhcHByX29iai5faWQpO1xuICByZXR1cm4gbmV3X2luc19pZDtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMgPSBmdW5jdGlvbihyZWNvcmRJZHMsIGZsb3dJZCwgc3BhY2VJZCwgZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbykge1xuICB2YXIgZmllbGRDb2RlcywgZmlsdGVyVmFsdWVzLCBmbG93LCBmb3JtLCBmb3JtRmllbGRzLCBmb3JtVGFibGVGaWVsZHMsIGZvcm1UYWJsZUZpZWxkc0NvZGUsIG9iamVjdCwgb2JqZWN0TmFtZSwgb3csIHJlY29yZCwgcmVjb3JkSWQsIHJlZiwgcmVsYXRlZE9iamVjdHMsIHJlbGF0ZWRPYmplY3RzS2V5cywgcmVxdWlyZWREZXRhaWxzLCB0YWJsZUZpZWxkQ29kZXMsIHRhYmxlRmllbGRNYXAsIHRhYmxlVG9SZWxhdGVkTWFwLCB2YWx1ZXM7XG4gIGZpZWxkQ29kZXMgPSBbXTtcbiAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgIGlmIChmLnR5cGUgPT09ICdzZWN0aW9uJykge1xuICAgICAgcmV0dXJuIF8uZWFjaChmLmZpZWxkcywgZnVuY3Rpb24oZmYpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkQ29kZXMucHVzaChmZi5jb2RlKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmllbGRDb2Rlcy5wdXNoKGYuY29kZSk7XG4gICAgfVxuICB9KTtcbiAgdmFsdWVzID0ge307XG4gIG9iamVjdE5hbWUgPSByZWNvcmRJZHMubztcbiAgb2JqZWN0ID0gZ2V0T2JqZWN0Q29uZmlnKG9iamVjdE5hbWUpO1xuICByZWNvcmRJZCA9IHJlY29yZElkcy5pZHNbMF07XG4gIG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3Rfd29ya2Zsb3dzLmZpbmRPbmUoe1xuICAgIG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxuICAgIGZsb3dfaWQ6IGZsb3dJZFxuICB9KTtcbiAgcmVjb3JkID0gb2JqZWN0RmluZE9uZShvYmplY3ROYW1lLCB7XG4gICAgZmlsdGVyczogW1snX2lkJywgJz0nLCByZWNvcmRJZF1dXG4gIH0pO1xuICBmbG93ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoZmxvd0lkLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBmb3JtOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKG93ICYmIHJlY29yZCkge1xuICAgIHJlcXVpcmVkRGV0YWlscyA9IG93LnJlcXVpcmVkX2RldGFpbHMgfHwgW107XG4gICAgY2hlY2tSZXF1aXJlZERldGFpbHMocmVxdWlyZWREZXRhaWxzLCByZWNvcmQpO1xuICAgIGZvcm0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJmb3Jtc1wiKS5maW5kT25lKGZsb3cuZm9ybSk7XG4gICAgZm9ybUZpZWxkcyA9IGZvcm0uY3VycmVudC5maWVsZHMgfHwgW107XG4gICAgcmVsYXRlZE9iamVjdHMgPSBnZXRSZWxhdGVkcyhvYmplY3ROYW1lKTtcbiAgICByZWxhdGVkT2JqZWN0c0tleXMgPSBfLnBsdWNrKHJlbGF0ZWRPYmplY3RzLCAnb2JqZWN0X25hbWUnKTtcbiAgICBmb3JtVGFibGVGaWVsZHMgPSBfLmZpbHRlcihmb3JtRmllbGRzLCBmdW5jdGlvbihmb3JtRmllbGQpIHtcbiAgICAgIHJldHVybiBmb3JtRmllbGQudHlwZSA9PT0gJ3RhYmxlJztcbiAgICB9KTtcbiAgICBmb3JtVGFibGVGaWVsZHNDb2RlID0gXy5wbHVjayhmb3JtVGFibGVGaWVsZHMsICdjb2RlJyk7XG4gICAgdGFibGVGaWVsZENvZGVzID0gW107XG4gICAgdGFibGVGaWVsZE1hcCA9IFtdO1xuICAgIHRhYmxlVG9SZWxhdGVkTWFwID0ge307XG4gICAgaWYgKChyZWYgPSBvdy5maWVsZF9tYXApICE9IG51bGwpIHtcbiAgICAgIHJlZi5mb3JFYWNoKGZ1bmN0aW9uKGZtKSB7XG4gICAgICAgIHZhciBmb3JtRmllbGQsIGZvcm1UYWJsZUZpZWxkQ29kZSwgZ3JpZENvZGUsIGxvb2t1cEZpZWxkTmFtZSwgbG9va3VwRmllbGRPYmosIGxvb2t1cE9iamVjdFJlY29yZCwgb1RhYmxlQ29kZSwgb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLCBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGRDb2RlLCBvVGFibGVGaWVsZENvZGUsIG9iakZpZWxkLCBvYmplY3RGaWVsZCwgb2JqZWN0RmllbGROYW1lLCBvYmplY3RGaWVsZE9iamVjdE5hbWUsIG9iamVjdExvb2t1cEZpZWxkLCBvYmplY3RfZmllbGQsIHJlY29yZEZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRG9jLCByZWZlcmVuY2VUb0ZpZWxkTmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlbGF0ZWRPYmplY3RGaWVsZENvZGUsIHRhYmxlVG9SZWxhdGVkTWFwS2V5LCB3VGFibGVDb2RlLCB3b3JrZmxvd19maWVsZDtcbiAgICAgICAgb2JqZWN0X2ZpZWxkID0gZm0ub2JqZWN0X2ZpZWxkO1xuICAgICAgICB3b3JrZmxvd19maWVsZCA9IGZtLndvcmtmbG93X2ZpZWxkO1xuICAgICAgICBpZiAoIW9iamVjdF9maWVsZCB8fCAhd29ya2Zsb3dfZmllbGQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ+acquaJvuWIsOWtl+aute+8jOivt+ajgOafpeWvueixoea1geeoi+aYoOWwhOWtl+autemFjee9ricpO1xuICAgICAgICB9XG4gICAgICAgIHJlbGF0ZWRPYmplY3RGaWVsZENvZGUgPSBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlKHJlbGF0ZWRPYmplY3RzS2V5cywgb2JqZWN0X2ZpZWxkKTtcbiAgICAgICAgZm9ybVRhYmxlRmllbGRDb2RlID0gZ2V0Rm9ybVRhYmxlRmllbGRDb2RlKGZvcm1UYWJsZUZpZWxkc0NvZGUsIHdvcmtmbG93X2ZpZWxkKTtcbiAgICAgICAgb2JqRmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdF9maWVsZF07XG4gICAgICAgIGZvcm1GaWVsZCA9IGdldEZvcm1GaWVsZChmb3JtRmllbGRzLCB3b3JrZmxvd19maWVsZCk7XG4gICAgICAgIHJlY29yZEZpZWxkVmFsdWUgPSByZWNvcmRbb2JqZWN0X2ZpZWxkXTtcbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZENvZGUpIHtcbiAgICAgICAgICBvVGFibGVDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgb1RhYmxlRmllbGRDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgdGFibGVUb1JlbGF0ZWRNYXBLZXkgPSBvVGFibGVDb2RlO1xuICAgICAgICAgIGlmICghdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldKSB7XG4gICAgICAgICAgICB0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0gPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZvcm1UYWJsZUZpZWxkQ29kZSkge1xuICAgICAgICAgICAgd1RhYmxlQ29kZSA9IHdvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgICB0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bJ19GUk9NX1RBQkxFX0NPREUnXSA9IHdUYWJsZUNvZGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bb1RhYmxlRmllbGRDb2RlXSA9IHdvcmtmbG93X2ZpZWxkO1xuICAgICAgICB9IGVsc2UgaWYgKHdvcmtmbG93X2ZpZWxkLmluZGV4T2YoJy4nKSA+IDAgJiYgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID4gMCkge1xuICAgICAgICAgIHdUYWJsZUNvZGUgPSB3b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgIG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzBdKHJlZjEudGFibGUxLiQubmFtZSk7XG4gICAgICAgICAgaWYgKHJlY29yZC5oYXNPd25Qcm9wZXJ0eShvVGFibGVDb2RlKSAmJiBfLmlzQXJyYXkocmVjb3JkW29UYWJsZUNvZGVdKSkge1xuICAgICAgICAgICAgdGFibGVGaWVsZENvZGVzLnB1c2goSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICB3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxuICAgICAgICAgICAgICBvYmplY3RfdGFibGVfZmllbGRfY29kZTogb1RhYmxlQ29kZVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgcmV0dXJuIHRhYmxlRmllbGRNYXAucHVzaChmbSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChvVGFibGVDb2RlLmluZGV4T2YoJy4nKSA+IDApIHtcbiAgICAgICAgICAgIG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZENvZGUgPSBvVGFibGVDb2RlLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgICBncmlkQ29kZSA9IG9UYWJsZUNvZGUuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZCA9IG9iamVjdC5maWVsZHNbb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkQ29kZV07XG4gICAgICAgICAgICBpZiAob1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICBpZiAocmVjb3JkW29UYWJsZUNvZGVdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGROYW1lID0gb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnJlZmVyZW5jZV90b19maWVsZCB8fCAnX2lkJztcbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5uYW1lXTtcbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9Eb2MgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKTtcbiAgICAgICAgICAgICAgaWYgKHJlZmVyZW5jZVRvRG9jW2dyaWRDb2RlXSkge1xuICAgICAgICAgICAgICAgIHJlY29yZFtvVGFibGVDb2RlXSA9IHJlZmVyZW5jZVRvRG9jW2dyaWRDb2RlXTtcbiAgICAgICAgICAgICAgICB0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICB3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxuICAgICAgICAgICAgICAgICAgb2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlRmllbGRNYXAucHVzaChmbSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAob2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4nKSA+IDAgJiYgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID09PSAtMSkge1xuICAgICAgICAgIG9iamVjdEZpZWxkTmFtZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgIGxvb2t1cEZpZWxkTmFtZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgIGlmIChvYmplY3QpIHtcbiAgICAgICAgICAgIG9iamVjdEZpZWxkID0gb2JqZWN0LmZpZWxkc1tvYmplY3RGaWVsZE5hbWVdO1xuICAgICAgICAgICAgaWYgKG9iamVjdEZpZWxkICYmIGZvcm1GaWVsZCAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqZWN0RmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgIGxvb2t1cE9iamVjdFJlY29yZCA9IG9iamVjdEZpbmRPbmUob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvLCB7XG4gICAgICAgICAgICAgICAgZmlsdGVyczogW1snX2lkJywgJz0nLCByZWNvcmRbb2JqZWN0RmllbGROYW1lXV1dLFxuICAgICAgICAgICAgICAgIGZpZWxkczogW2xvb2t1cEZpZWxkTmFtZV1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmICghbG9va3VwT2JqZWN0UmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG9iamVjdEZpZWxkT2JqZWN0TmFtZSA9IG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgbG9va3VwRmllbGRPYmogPSBnZXRPYmplY3RDb25maWcob2JqZWN0RmllbGRPYmplY3ROYW1lKTtcbiAgICAgICAgICAgICAgb2JqZWN0TG9va3VwRmllbGQgPSBsb29rdXBGaWVsZE9iai5maWVsZHNbbG9va3VwRmllbGROYW1lXTtcbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBnZXRJbnN0YW5jZUZpZWxkVmFsdWUob2JqZWN0TG9va3VwRmllbGQsIGZvcm1GaWVsZCwgbG9va3VwT2JqZWN0UmVjb3JkLCBsb29rdXBGaWVsZE5hbWUsIHNwYWNlSWQsIHJlY29yZFtsb29rdXBGaWVsZE5hbWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBnZXRJbnN0YW5jZUZpZWxkVmFsdWUob2JqRmllbGQsIGZvcm1GaWVsZCwgcmVjb3JkLCBvYmplY3RfZmllbGQsIHNwYWNlSWQsIHJlY29yZFtvYmplY3RfZmllbGRdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIF8udW5pcSh0YWJsZUZpZWxkQ29kZXMpLmZvckVhY2goZnVuY3Rpb24odGZjKSB7XG4gICAgICB2YXIgYztcbiAgICAgIGMgPSBKU09OLnBhcnNlKHRmYyk7XG4gICAgICB2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXSA9IFtdO1xuICAgICAgcmV0dXJuIHJlY29yZFtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXS5mb3JFYWNoKGZ1bmN0aW9uKHRyKSB7XG4gICAgICAgIHZhciBuZXdUcjtcbiAgICAgICAgbmV3VHIgPSB7fTtcbiAgICAgICAgXy5lYWNoKHRyLCBmdW5jdGlvbih0ZFZhbHVlLCBrKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYmxlRmllbGRNYXAuZm9yRWFjaChmdW5jdGlvbih0Zm0pIHtcbiAgICAgICAgICAgIHZhciB3VGRDb2RlO1xuICAgICAgICAgICAgaWYgKHRmbS5vYmplY3RfZmllbGQgPT09IChjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlICsgJy4kLicgKyBrKSkge1xuICAgICAgICAgICAgICB3VGRDb2RlID0gdGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICAgIHJldHVybiBuZXdUclt3VGRDb2RlXSA9IHRkVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIV8uaXNFbXB0eShuZXdUcikpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWVzW2Mud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZV0ucHVzaChuZXdUcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIF8uZWFjaCh0YWJsZVRvUmVsYXRlZE1hcCwgZnVuY3Rpb24obWFwLCBrZXkpIHtcbiAgICAgIHZhciBmb3JtVGFibGVGaWVsZCwgcmVsYXRlZEZpZWxkLCByZWxhdGVkRmllbGROYW1lLCByZWxhdGVkT2JqZWN0LCByZWxhdGVkT2JqZWN0TmFtZSwgcmVsYXRlZFJlY29yZHMsIHJlbGF0ZWRUYWJsZUl0ZW1zLCB0YWJsZUNvZGUsIHRhYmxlVmFsdWVzO1xuICAgICAgdGFibGVDb2RlID0gbWFwLl9GUk9NX1RBQkxFX0NPREU7XG4gICAgICBmb3JtVGFibGVGaWVsZCA9IGdldEZvcm1UYWJsZUZpZWxkKGZvcm1UYWJsZUZpZWxkcywgdGFibGVDb2RlKTtcbiAgICAgIGlmICghdGFibGVDb2RlKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oJ3RhYmxlVG9SZWxhdGVkOiBbJyArIGtleSArICddIG1pc3NpbmcgY29ycmVzcG9uZGluZyB0YWJsZS4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbGF0ZWRPYmplY3ROYW1lID0ga2V5O1xuICAgICAgICB0YWJsZVZhbHVlcyA9IFtdO1xuICAgICAgICByZWxhdGVkVGFibGVJdGVtcyA9IFtdO1xuICAgICAgICByZWxhdGVkT2JqZWN0ID0gZ2V0T2JqZWN0Q29uZmlnKHJlbGF0ZWRPYmplY3ROYW1lKTtcbiAgICAgICAgcmVsYXRlZEZpZWxkID0gXy5maW5kKHJlbGF0ZWRPYmplY3QuZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgcmV0dXJuIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhmLnR5cGUpICYmIGYucmVmZXJlbmNlX3RvID09PSBvYmplY3ROYW1lO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVsYXRlZEZpZWxkTmFtZSA9IHJlbGF0ZWRGaWVsZC5uYW1lO1xuICAgICAgICByZWxhdGVkUmVjb3JkcyA9IG9iamVjdEZpbmQocmVsYXRlZE9iamVjdE5hbWUsIHtcbiAgICAgICAgICBmaWx0ZXJzOiBbW3JlbGF0ZWRGaWVsZE5hbWUsICc9JywgcmVjb3JkSWRdXVxuICAgICAgICB9KTtcbiAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChmdW5jdGlvbihyZWxhdGVkUmVjb3JkKSB7XG4gICAgICAgICAgdmFyIHRhYmxlVmFsdWVJdGVtO1xuICAgICAgICAgIHRhYmxlVmFsdWVJdGVtID0ge307XG4gICAgICAgICAgXy5lYWNoKG1hcCwgZnVuY3Rpb24odmFsdWVLZXksIGZpZWxkS2V5KSB7XG4gICAgICAgICAgICB2YXIgZm9ybUZpZWxkLCBmb3JtRmllbGRLZXksIHJlbGF0ZWRPYmplY3RGaWVsZCwgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKGZpZWxkS2V5ICE9PSAnX0ZST01fVEFCTEVfQ09ERScpIHtcbiAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICBmb3JtRmllbGRLZXk7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZUtleS5zdGFydHNXaXRoKHRhYmxlQ29kZSArICcuJykpIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSAodmFsdWVLZXkuc3BsaXQoXCIuXCIpWzFdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSB2YWx1ZUtleTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBmb3JtRmllbGQgPSBnZXRGb3JtVGFibGVTdWJGaWVsZChmb3JtVGFibGVGaWVsZCwgZm9ybUZpZWxkS2V5KTtcbiAgICAgICAgICAgICAgcmVsYXRlZE9iamVjdEZpZWxkID0gcmVsYXRlZE9iamVjdC5maWVsZHNbZmllbGRLZXldO1xuICAgICAgICAgICAgICBpZiAoIWZvcm1GaWVsZCB8fCAhcmVsYXRlZE9iamVjdEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IGdldEluc3RhbmNlRmllbGRWYWx1ZShyZWxhdGVkT2JqZWN0RmllbGQsIGZvcm1GaWVsZCwgcmVsYXRlZFJlY29yZCwgZmllbGRLZXksIHNwYWNlSWQsIHJlbGF0ZWRSZWNvcmRbZmllbGRLZXldKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlVmFsdWVJdGVtW2Zvcm1GaWVsZEtleV0gPSB0YWJsZUZpZWxkVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKCFfLmlzRW1wdHkodGFibGVWYWx1ZUl0ZW0pKSB7XG4gICAgICAgICAgICB0YWJsZVZhbHVlSXRlbS5faWQgPSByZWxhdGVkUmVjb3JkLl9pZDtcbiAgICAgICAgICAgIHRhYmxlVmFsdWVzLnB1c2godGFibGVWYWx1ZUl0ZW0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRUYWJsZUl0ZW1zLnB1c2goe1xuICAgICAgICAgICAgICBfdGFibGU6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IHJlbGF0ZWRSZWNvcmQuX2lkLFxuICAgICAgICAgICAgICAgIF9jb2RlOiB0YWJsZUNvZGVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdmFsdWVzW3RhYmxlQ29kZV0gPSB0YWJsZVZhbHVlcztcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRUYWJsZXNJbmZvW3JlbGF0ZWRPYmplY3ROYW1lXSA9IHJlbGF0ZWRUYWJsZUl0ZW1zO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChvdy5maWVsZF9tYXBfc2NyaXB0KSB7XG4gICAgICBfLmV4dGVuZCh2YWx1ZXMsIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0KG93LmZpZWxkX21hcF9zY3JpcHQsIG9iamVjdE5hbWUsIHNwYWNlSWQsIHJlY29yZElkKSk7XG4gICAgfVxuICB9XG4gIGZpbHRlclZhbHVlcyA9IHt9O1xuICBfLmVhY2goXy5rZXlzKHZhbHVlcyksIGZ1bmN0aW9uKGspIHtcbiAgICBpZiAoZmllbGRDb2Rlcy5pbmNsdWRlcyhrKSkge1xuICAgICAgcmV0dXJuIGZpbHRlclZhbHVlc1trXSA9IHZhbHVlc1trXTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmlsdGVyVmFsdWVzO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5ldmFsRmllbGRNYXBTY3JpcHQgPSBmdW5jdGlvbihmaWVsZF9tYXBfc2NyaXB0LCBvYmplY3ROYW1lLCBzcGFjZUlkLCBvYmplY3RJZCkge1xuICB2YXIgZnVuYywgcmVjb3JkLCBzY3JpcHQsIHZhbHVlcztcbiAgcmVjb3JkID0gb2JqZWN0RmluZE9uZShvYmplY3ROYW1lLCB7XG4gICAgZmlsdGVyczogW1snX2lkJywgJz0nLCBvYmplY3RJZF1dXG4gIH0pO1xuICBzY3JpcHQgPSBcIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJlY29yZCkgeyBcIiArIGZpZWxkX21hcF9zY3JpcHQgKyBcIiB9XCI7XG4gIGZ1bmMgPSBfZXZhbChzY3JpcHQsIFwiZmllbGRfbWFwX3NjcmlwdFwiKTtcbiAgdmFsdWVzID0gZnVuYyhyZWNvcmQpO1xuICBpZiAoXy5pc09iamVjdCh2YWx1ZXMpKSB7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKFwiZXZhbEZpZWxkTWFwU2NyaXB0OiDohJrmnKzov5Tlm57lgLznsbvlnovkuI3mmK/lr7nosaFcIik7XG4gIH1cbiAgcmV0dXJuIHt9O1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZUF0dGFjaCA9IGZ1bmN0aW9uKHJlY29yZElkcywgc3BhY2VJZCwgaW5zSWQsIGFwcHJvdmVJZCkge1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zWydjbXNfZmlsZXMnXS5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICBwYXJlbnQ6IHJlY29yZElkc1xuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGNmKSB7XG4gICAgcmV0dXJuIF8uZWFjaChjZi52ZXJzaW9ucywgZnVuY3Rpb24odmVyc2lvbklkLCBpZHgpIHtcbiAgICAgIHZhciBmLCBuZXdGaWxlO1xuICAgICAgZiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ10uZmluZE9uZSh2ZXJzaW9uSWQpO1xuICAgICAgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XG4gICAgICByZXR1cm4gbmV3RmlsZS5hdHRhY2hEYXRhKGYuY3JlYXRlUmVhZFN0cmVhbSgnZmlsZXMnKSwge1xuICAgICAgICB0eXBlOiBmLm9yaWdpbmFsLnR5cGVcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICB2YXIgbWV0YWRhdGE7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbik7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RmlsZS5uYW1lKGYubmFtZSgpKTtcbiAgICAgICAgbmV3RmlsZS5zaXplKGYuc2l6ZSgpKTtcbiAgICAgICAgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgb3duZXI6IGYubWV0YWRhdGEub3duZXIsXG4gICAgICAgICAgb3duZXJfbmFtZTogZi5tZXRhZGF0YS5vd25lcl9uYW1lLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgIGluc3RhbmNlOiBpbnNJZCxcbiAgICAgICAgICBhcHByb3ZlOiBhcHByb3ZlSWQsXG4gICAgICAgICAgcGFyZW50OiBjZi5faWRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGlkeCA9PT0gMCkge1xuICAgICAgICAgIG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgcmV0dXJuIGNmcy5pbnN0YW5jZXMuaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlY29yZEluc3RhbmNlSW5mbyA9IGZ1bmN0aW9uKHJlY29yZElkcywgaW5zSWQsIHNwYWNlSWQpIHtcbiAgb2JqZWN0VXBkYXRlKHJlY29yZElkcy5vLCByZWNvcmRJZHMuaWRzWzBdLCB7XG4gICAgaW5zdGFuY2VzOiBbXG4gICAgICB7XG4gICAgICAgIF9pZDogaW5zSWQsXG4gICAgICAgIHN0YXRlOiAnZHJhZnQnXG4gICAgICB9XG4gICAgXSxcbiAgICBsb2NrZWQ6IHRydWUsXG4gICAgaW5zdGFuY2Vfc3RhdGU6ICdkcmFmdCdcbiAgfSk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyA9IGZ1bmN0aW9uKHJlbGF0ZWRUYWJsZXNJbmZvLCBpbnNJZCwgc3BhY2VJZCkge1xuICBfLmVhY2gocmVsYXRlZFRhYmxlc0luZm8sIGZ1bmN0aW9uKHRhYmxlSXRlbXMsIHJlbGF0ZWRPYmplY3ROYW1lKSB7XG4gICAgdmFyIHJlbGF0ZWRDb2xsZWN0aW9uO1xuICAgIHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKTtcbiAgICByZXR1cm4gXy5lYWNoKHRhYmxlSXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiByZWxhdGVkQ29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKGl0ZW0uX3RhYmxlLl9pZCwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgaW5zdGFuY2VzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIF9pZDogaW5zSWQsXG4gICAgICAgICAgICAgIHN0YXRlOiAnZHJhZnQnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICBfdGFibGU6IGl0ZW0uX3RhYmxlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tJc0luQXBwcm92YWwgPSBmdW5jdGlvbihyZWNvcmRJZHMsIHNwYWNlSWQpIHtcbiAgdmFyIHJlY29yZDtcbiAgcmVjb3JkID0gb2JqZWN0RmluZE9uZShyZWNvcmRJZHMubywge1xuICAgIGZpbHRlcnM6IFtbJ19pZCcsICc9JywgcmVjb3JkSWRzLmlkc1swXV1dLFxuICAgIGZpZWxkczogWydpbnN0YW5jZXMnXVxuICB9KTtcbiAgaWYgKHJlY29yZCAmJiByZWNvcmQuaW5zdGFuY2VzICYmIHJlY29yZC5pbnN0YW5jZXNbMF0uc3RhdGUgIT09ICdjb21wbGV0ZWQnICYmIENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmZpbmQocmVjb3JkLmluc3RhbmNlc1swXS5faWQpLmNvdW50KCkgPiAwKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmraTorrDlvZXlt7Llj5HotbfmtYHnqIvmraPlnKjlrqHmibnkuK3vvIzlvoXlrqHmibnnu5PmnZ/mlrnlj6/lj5HotbfkuIvkuIDmrKHlrqHmibnvvIFcIik7XG4gIH1cbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgcmV0dXJuIG1vbWVudChkYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xufTtcbiJdfQ==
