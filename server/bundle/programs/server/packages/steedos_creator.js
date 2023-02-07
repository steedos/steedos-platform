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
var _eval, getObjectConfig, getObjectNameFieldKey, getRelateds, insert_instance_tasks, objectFind, objectFindOne, objectUpdate, objectql;

_eval = require('eval');
objectql = require('@steedos/objectql');
insert_instance_tasks = require('@steedos/workflow').workflowManagers.instance_tasks_manager.insert_instance_tasks;

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
  insert_instance_tasks(new_ins_id, trace_obj._id, appr_obj._id);
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
        var formField, formTableFieldCode, gridCode, lookupFieldName, lookupFieldObj, lookupObjectRecord, lookupSelectFieldValue, oTableCode, oTableCodeReferenceField, oTableCodeReferenceFieldCode, oTableFieldCode, objField, objectField, objectFieldName, objectFieldObjectName, objectLookupField, object_field, odataFieldValue, recordFieldValue, referenceToDoc, referenceToFieldName, referenceToFieldValue, referenceToObjectName, relatedObjectFieldCode, selectFieldValue, tableToRelatedMapKey, wTableCode, workflow_field;
        object_field = fm.object_field;
        workflow_field = fm.workflow_field;

        if (!object_field || !workflow_field) {
          throw new Meteor.Error(400, '未找到字段，请检查对象流程映射字段配置');
        }

        relatedObjectFieldCode = getRelatedObjectFieldCode(object_field);
        formTableFieldCode = getFormTableFieldCode(workflow_field);
        objField = object.fields[object_field];
        formField = getFormField(workflow_field);
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
        } else if (formField && objField && formField.type === 'date' && recordFieldValue) {
          return values[workflow_field] = uuflowManagerForInitApproval.formatDate(recordFieldValue);
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
      var formTableField, relatedField, relatedFieldName, relatedObject, relatedObjectName, relatedRecords, relatedTableItems, tableCode, tableValues;
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
        relatedRecords = objectFind(relatedObjectName, {
          filters: [[relatedFieldName, '=', recordId]]
        });
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
              } else if (formField.type === 'date' && rr[fieldKey]) {
                tableFieldValue = uuflowManagerForInitApproval.formatDate(rr[fieldKey]);
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

uuflowManagerForInitApproval.formatDate = function (date) {
  return moment(date).format("YYYY-MM-DD");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjcmVhdG9yL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvbGliL2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvb2JqZWN0X3JlY2VudF92aWV3ZWQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3ZpZXdlZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3JlY29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9yZWNlbnRfcmVjb3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9yZXBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3JlcG9ydF9kYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfZXhwb3J0MnhtbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9leHBvcnQyeG1sLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3JlbGF0ZWRfb2JqZWN0c19yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvcGVuZGluZ19zcGFjZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3BlbmRpbmdfc3BhY2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF90YWJ1bGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF9saXN0dmlld3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy91c2VyX3RhYnVsYXJfc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9yZWxhdGVkX29iamVjdHNfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV91c2VyX2luZm8uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c192aWV3X2xpbWl0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfdmlld19saW1pdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c19ub19mb3JjZV9waG9uZV91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9uZWVkX3RvX2NvbmZpcm0uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX25lZWRfdG9fY29uZmlybS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbGliL3Blcm1pc3Npb25fbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvcGVybWlzc2lvbl9tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImJ1c2JveSIsIk1ldGVvciIsInNldHRpbmdzIiwiY2ZzIiwiYWxpeXVuIiwiQ3JlYXRvciIsImdldFNjaGVtYSIsIm9iamVjdF9uYW1lIiwicmVmIiwiZ2V0T2JqZWN0Iiwic2NoZW1hIiwiZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCIsImdldE9iamVjdFVybCIsInJlY29yZF9pZCIsImFwcF9pZCIsImxpc3RfdmlldyIsImxpc3Rfdmlld19pZCIsIlNlc3Npb24iLCJnZXQiLCJnZXRMaXN0VmlldyIsIl9pZCIsImdldFJlbGF0aXZlVXJsIiwiZ2V0T2JqZWN0QWJzb2x1dGVVcmwiLCJTdGVlZG9zIiwiYWJzb2x1dGVVcmwiLCJnZXRPYmplY3RSb3V0ZXJVcmwiLCJnZXRMaXN0Vmlld1VybCIsInVybCIsImdldExpc3RWaWV3UmVsYXRpdmVVcmwiLCJnZXRTd2l0Y2hMaXN0VXJsIiwiZ2V0UmVsYXRlZE9iamVjdFVybCIsInJlbGF0ZWRfb2JqZWN0X25hbWUiLCJyZWxhdGVkX2ZpZWxkX25hbWUiLCJnZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMiLCJpc19kZWVwIiwiaXNfc2tpcF9oaWRlIiwiaXNfcmVsYXRlZCIsIl9vYmplY3QiLCJfb3B0aW9ucyIsImZpZWxkcyIsImljb24iLCJyZWxhdGVkT2JqZWN0cyIsIl8iLCJmb3JFYWNoIiwiZiIsImsiLCJoaWRkZW4iLCJ0eXBlIiwicHVzaCIsImxhYmVsIiwidmFsdWUiLCJyX29iamVjdCIsInJlZmVyZW5jZV90byIsImlzU3RyaW5nIiwiZjIiLCJrMiIsImdldFJlbGF0ZWRPYmplY3RzIiwiZWFjaCIsIl90aGlzIiwiX3JlbGF0ZWRPYmplY3QiLCJyZWxhdGVkT2JqZWN0IiwicmVsYXRlZE9wdGlvbnMiLCJyZWxhdGVkT3B0aW9uIiwiZm9yZWlnbl9rZXkiLCJuYW1lIiwiZ2V0T2JqZWN0RmlsdGVyRmllbGRPcHRpb25zIiwicGVybWlzc2lvbl9maWVsZHMiLCJnZXRGaWVsZHMiLCJpbmNsdWRlIiwidGVzdCIsImluZGV4T2YiLCJnZXRPYmplY3RGaWVsZE9wdGlvbnMiLCJnZXRGaWx0ZXJzV2l0aEZpbHRlckZpZWxkcyIsImZpbHRlcnMiLCJmaWx0ZXJfZmllbGRzIiwibGVuZ3RoIiwibiIsImZpZWxkIiwicmVxdWlyZWQiLCJmaW5kV2hlcmUiLCJpc19kZWZhdWx0IiwiaXNfcmVxdWlyZWQiLCJmaWx0ZXJJdGVtIiwibWF0Y2hGaWVsZCIsImZpbmQiLCJnZXRPYmplY3RSZWNvcmQiLCJzZWxlY3RfZmllbGRzIiwiZXhwYW5kIiwiY29sbGVjdGlvbiIsIm9iaiIsInJlY29yZCIsInJlZjEiLCJyZWYyIiwiaXNDbGllbnQiLCJUZW1wbGF0ZSIsImluc3RhbmNlIiwib2RhdGEiLCJkYXRhYmFzZV9uYW1lIiwiZ2V0Q29sbGVjdGlvbiIsImZpbmRPbmUiLCJnZXRPYmplY3RSZWNvcmROYW1lIiwibmFtZV9maWVsZF9rZXkiLCJOQU1FX0ZJRUxEX0tFWSIsImdldEFwcCIsImFwcCIsIkFwcHMiLCJkZXBzIiwiZGVwZW5kIiwiZ2V0QXBwRGFzaGJvYXJkIiwiZGFzaGJvYXJkIiwiRGFzaGJvYXJkcyIsImFwcHMiLCJnZXRBcHBEYXNoYm9hcmRDb21wb25lbnQiLCJnZXRBcHBPYmplY3ROYW1lcyIsImFwcE9iamVjdHMiLCJpc01vYmlsZSIsIm9iamVjdHMiLCJtb2JpbGVfb2JqZWN0cyIsInBlcm1pc3Npb25zIiwiYWxsb3dSZWFkIiwiZ2V0VXJsV2l0aFRva2VuIiwiZXhwcmVzc2lvbkZvcm1EYXRhIiwiaGFzUXVlcnlTeW1ib2wiLCJsaW5rU3RyIiwicGFyYW1zIiwic3BhY2VJZCIsInVzZXJJZCIsImdldFVzZXJDb21wYW55SWRzIiwiQWNjb3VudHMiLCJfc3RvcmVkTG9naW5Ub2tlbiIsImlzRXhwcmVzc2lvbiIsInBhcnNlU2luZ2xlRXhwcmVzc2lvbiIsIlVTRVJfQ09OVEVYVCIsIiQiLCJwYXJhbSIsImdldEFwcE1lbnUiLCJtZW51X2lkIiwibWVudXMiLCJnZXRBcHBNZW51cyIsIm1lbnUiLCJpZCIsImdldEFwcE1lbnVVcmxGb3JJbnRlcm5ldCIsInBhdGgiLCJnZXRBcHBNZW51VXJsIiwidGFyZ2V0IiwiYXBwTWVudXMiLCJjdXJlbnRBcHBNZW51cyIsIm1lbnVJdGVtIiwiY2hpbGRyZW4iLCJsb2FkQXBwc01lbnVzIiwiZGF0YSIsIm9wdGlvbnMiLCJtb2JpbGUiLCJzdWNjZXNzIiwic2V0IiwiYXV0aFJlcXVlc3QiLCJjcmVhdG9yQXBwc1NlbGVjdG9yIiwiYXNzaWduZWRfYXBwcyIsImFkbWluQXBwIiwiY3JlYXRvckFwcHMiLCJzb3J0ZWRBcHBzIiwia2V5IiwiaXNfY3JlYXRvciIsInZpc2libGUiLCJzb3J0QnkiLCJ2YWx1ZXMiLCJhZG1pbiIsInZpc2libGVBcHBzU2VsZWN0b3IiLCJpbmNsdWRlQWRtaW4iLCJnZXRWaXNpYmxlQXBwcyIsImNoYW5nZUFwcCIsIl9zdWJBcHAiLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRWaXNpYmxlQXBwc09iamVjdHMiLCJ2aXNpYmxlT2JqZWN0TmFtZXMiLCJmbGF0dGVuIiwicGx1Y2siLCJmaWx0ZXIiLCJPYmplY3RzIiwic29ydCIsInNvcnRpbmdNZXRob2QiLCJiaW5kIiwidW5pcSIsImdldEFwcHNPYmplY3RzIiwidGVtcE9iamVjdHMiLCJjb25jYXQiLCJ2YWxpZGF0ZUZpbHRlcnMiLCJsb2dpYyIsImUiLCJlcnJvck1zZyIsImZpbHRlcl9pdGVtcyIsImZpbHRlcl9sZW5ndGgiLCJmbGFnIiwiaW5kZXgiLCJ3b3JkIiwibWFwIiwiaXNFbXB0eSIsImNvbXBhY3QiLCJyZXBsYWNlIiwibWF0Y2giLCJpIiwiaW5jbHVkZXMiLCJ3IiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwidG9hc3RyIiwiZm9ybWF0RmlsdGVyc1RvTW9uZ28iLCJzZWxlY3RvciIsIkFycmF5Iiwib3BlcmF0aW9uIiwib3B0aW9uIiwicmVnIiwic3ViX3NlbGVjdG9yIiwiZXZhbHVhdGVGb3JtdWxhIiwiUmVnRXhwIiwiaXNCZXR3ZWVuRmlsdGVyT3BlcmF0aW9uIiwiZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzIiwiZm9ybWF0RmlsdGVyc1RvRGV2IiwibG9naWNUZW1wRmlsdGVycyIsImlzX2xvZ2ljX29yIiwicG9wIiwiU3RlZWRvc0ZpbHRlcnMiLCJmb3JtYXRMb2dpY0ZpbHRlcnNUb0RldiIsImZpbHRlcl9sb2dpYyIsImZvcm1hdF9sb2dpYyIsIngiLCJfZiIsImlzQXJyYXkiLCJKU09OIiwic3RyaW5naWZ5IiwicmVsYXRlZF9vYmplY3RfbmFtZXMiLCJyZWxhdGVkX29iamVjdHMiLCJ1bnJlbGF0ZWRfb2JqZWN0cyIsImdldE9iamVjdFJlbGF0ZWRzIiwiX2NvbGxlY3Rpb25fbmFtZSIsImdldFBlcm1pc3Npb25zIiwiZGlmZmVyZW5jZSIsInJlbGF0ZWRfb2JqZWN0IiwiaXNBY3RpdmUiLCJhbGxvd1JlYWRGaWxlcyIsImdldFJlbGF0ZWRPYmplY3ROYW1lcyIsImdldFJlbGF0ZWRPYmplY3RMaXN0QWN0aW9ucyIsInJlbGF0ZWRPYmplY3ROYW1lIiwiYWN0aW9ucyIsImdldEFjdGlvbnMiLCJhY3Rpb24iLCJvbiIsImRpc2FibGVkX2FjdGlvbnMiLCJoYXMiLCJhbGxvd19jdXN0b21BY3Rpb25zIiwia2V5cyIsImV4Y2x1ZGVfYWN0aW9ucyIsImdldExpc3RWaWV3cyIsImRpc2FibGVkX2xpc3Rfdmlld3MiLCJsaXN0Vmlld3MiLCJsaXN0X3ZpZXdzIiwib2JqZWN0IiwiaXRlbSIsIml0ZW1fbmFtZSIsImlzRGlzYWJsZWQiLCJvd25lciIsImZpZWxkc05hbWUiLCJ1bnJlYWRhYmxlX2ZpZWxkcyIsImdldE9iamVjdEZpZWxkc05hbWUiLCJpc2xvYWRpbmciLCJib290c3RyYXBMb2FkZWQiLCJjb252ZXJ0U3BlY2lhbENoYXJhY3RlciIsInN0ciIsImdldERpc2FibGVkRmllbGRzIiwiZmllbGROYW1lIiwiYXV0b2Zvcm0iLCJkaXNhYmxlZCIsIm9taXQiLCJnZXRIaWRkZW5GaWVsZHMiLCJnZXRGaWVsZHNXaXRoTm9Hcm91cCIsImdyb3VwIiwiZ2V0U29ydGVkRmllbGRHcm91cE5hbWVzIiwibmFtZXMiLCJ1bmlxdWUiLCJnZXRGaWVsZHNGb3JHcm91cCIsImdyb3VwTmFtZSIsImdldFN5c3RlbUJhc2VGaWVsZHMiLCJnZXRGaWVsZHNXaXRob3V0U3lzdGVtQmFzZSIsImdldEZpZWxkc1dpdGhvdXRPbWl0IiwicGljayIsImdldEZpZWxkc0luRmlyc3RMZXZlbCIsImZpcnN0TGV2ZWxLZXlzIiwiZ2V0RmllbGRzRm9yUmVvcmRlciIsImlzU2luZ2xlIiwiX2tleXMiLCJjaGlsZEtleXMiLCJpc193aWRlXzEiLCJpc193aWRlXzIiLCJzY18xIiwic2NfMiIsImVuZHNXaXRoIiwiaXNfd2lkZSIsInNsaWNlIiwiaXNGaWx0ZXJWYWx1ZUVtcHR5IiwiTnVtYmVyIiwiaXNOYU4iLCJnZXRGaWVsZERhdGFUeXBlIiwib2JqZWN0RmllbGRzIiwicmVzdWx0IiwiZGF0YV90eXBlIiwiaXNTZXJ2ZXIiLCJnZXRBbGxSZWxhdGVkT2JqZWN0cyIsInJlbGF0ZWRfZmllbGQiLCJlbmFibGVfZmlsZXMiLCJmb3JtYXRJbmRleCIsImFycmF5IiwiaW5kZXhOYW1lIiwiaXNkb2N1bWVudERCIiwiYmFja2dyb3VuZCIsImRhdGFzb3VyY2VzIiwiZG9jdW1lbnREQiIsImpvaW4iLCJzdWJzdHJpbmciLCJhcHBzQnlOYW1lIiwibWV0aG9kcyIsInNwYWNlX2lkIiwiY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkIiwiY3VycmVudF9yZWNlbnRfdmlld2VkIiwiZG9jIiwic3BhY2UiLCJ1cGRhdGUiLCIkaW5jIiwiY291bnQiLCIkc2V0IiwibW9kaWZpZWQiLCJEYXRlIiwibW9kaWZpZWRfYnkiLCJpbnNlcnQiLCJfbWFrZU5ld0lEIiwibyIsImlkcyIsImNyZWF0ZWQiLCJjcmVhdGVkX2J5IiwidmFsaWRhdGUiLCJhc3luY19yZWNlbnRfYWdncmVnYXRlIiwicmVjZW50X2FnZ3JlZ2F0ZSIsInNlYXJjaF9vYmplY3QiLCJfcmVjb3JkcyIsImNhbGxiYWNrIiwiQ29sbGVjdGlvbnMiLCJvYmplY3RfcmVjZW50X3ZpZXdlZCIsInJhd0NvbGxlY3Rpb24iLCJhZ2dyZWdhdGUiLCIkbWF0Y2giLCIkZ3JvdXAiLCJtYXhDcmVhdGVkIiwiJG1heCIsIiRzb3J0IiwiJGxpbWl0IiwidG9BcnJheSIsImVyciIsIkVycm9yIiwiaXNGdW5jdGlvbiIsIndyYXBBc3luYyIsInNlYXJjaFRleHQiLCJfb2JqZWN0X2NvbGxlY3Rpb24iLCJfb2JqZWN0X25hbWVfa2V5IiwicXVlcnkiLCJxdWVyeV9hbmQiLCJyZWNvcmRzIiwic2VhcmNoX0tleXdvcmRzIiwic3BsaXQiLCJrZXl3b3JkIiwic3VicXVlcnkiLCIkcmVnZXgiLCJ0cmltIiwiJGFuZCIsIiRpbiIsImxpbWl0IiwiX25hbWUiLCJfb2JqZWN0X25hbWUiLCJyZWNvcmRfb2JqZWN0IiwicmVjb3JkX29iamVjdF9jb2xsZWN0aW9uIiwic2VsZiIsIm9iamVjdHNCeU5hbWUiLCJvYmplY3RfcmVjb3JkIiwiZW5hYmxlX3NlYXJjaCIsInVwZGF0ZV9maWx0ZXJzIiwibGlzdHZpZXdfaWQiLCJmaWx0ZXJfc2NvcGUiLCJvYmplY3RfbGlzdHZpZXdzIiwiZGlyZWN0IiwidXBkYXRlX2NvbHVtbnMiLCJjb2x1bW5zIiwiY2hlY2siLCJjb21wb3VuZEZpZWxkcyIsImN1cnNvciIsImZpbHRlckZpZWxkcyIsImNoaWxkS2V5Iiwib2JqZWN0RmllbGQiLCJzcGxpdHMiLCJpc0NvbW1vblNwYWNlIiwiaXNTcGFjZUFkbWluIiwic2tpcCIsImZldGNoIiwiY29tcG91bmRGaWVsZEl0ZW0iLCJjb21wb3VuZEZpbHRlckZpZWxkcyIsIml0ZW1LZXkiLCJpdGVtVmFsdWUiLCJyZWZlcmVuY2VJdGVtIiwic2V0dGluZyIsImNvbHVtbl93aWR0aCIsIm9iajEiLCJfaWRfYWN0aW9ucyIsIl9taXhGaWVsZHNEYXRhIiwiX21peFJlbGF0ZWREYXRhIiwiX3dyaXRlWG1sRmlsZSIsImZzIiwibG9nZ2VyIiwibWtkaXJwIiwieG1sMmpzIiwicmVxdWlyZSIsIkxvZ2dlciIsImpzb25PYmoiLCJvYmpOYW1lIiwiYnVpbGRlciIsImRheSIsImZpbGVBZGRyZXNzIiwiZmlsZU5hbWUiLCJmaWxlUGF0aCIsIm1vbnRoIiwibm93Iiwic3RyZWFtIiwieG1sIiwieWVhciIsIkJ1aWxkZXIiLCJidWlsZE9iamVjdCIsIkJ1ZmZlciIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiX19tZXRlb3JfYm9vdHN0cmFwX18iLCJzZXJ2ZXJEaXIiLCJleGlzdHNTeW5jIiwic3luYyIsIndyaXRlRmlsZSIsIm1peEJvb2wiLCJtaXhEYXRlIiwibWl4RGVmYXVsdCIsIm9iakZpZWxkcyIsImZpZWxkX25hbWUiLCJkYXRlIiwiZGF0ZVN0ciIsImZvcm1hdCIsIm1vbWVudCIsInJlbGF0ZWRPYmpOYW1lcyIsInJlbGF0ZWRPYmpOYW1lIiwicmVsYXRlZENvbGxlY3Rpb24iLCJyZWxhdGVkUmVjb3JkTGlzdCIsInJlbGF0ZWRUYWJsZURhdGEiLCJyZWxhdGVkT2JqIiwiZmllbGRzRGF0YSIsIkV4cG9ydDJ4bWwiLCJyZWNvcmRMaXN0IiwiaW5mbyIsInRpbWUiLCJyZWNvcmRPYmoiLCJ0aW1lRW5kIiwicmVsYXRlZF9vYmplY3RzX3JlY29yZHMiLCJyZWxhdGVkX3JlY29yZHMiLCJ2aWV3QWxsUmVjb3JkcyIsImdldFBlbmRpbmdTcGFjZUluZm8iLCJpbnZpdGVySWQiLCJpbnZpdGVyTmFtZSIsInNwYWNlTmFtZSIsImRiIiwidXNlcnMiLCJzcGFjZXMiLCJpbnZpdGVyIiwicmVmdXNlSm9pblNwYWNlIiwic3BhY2VfdXNlcnMiLCJpbnZpdGVfc3RhdGUiLCJhY2NlcHRKb2luU3BhY2UiLCJ1c2VyX2FjY2VwdGVkIiwicHVibGlzaCIsInB1Ymxpc2hDb21wb3NpdGUiLCJ0YWJsZU5hbWUiLCJfZmllbGRzIiwib2JqZWN0X2NvbGxlY2l0b24iLCJyZWZlcmVuY2VfZmllbGRzIiwicmVhZHkiLCJTdHJpbmciLCJNYXRjaCIsIk9wdGlvbmFsIiwiZ2V0T2JqZWN0TmFtZSIsInVuYmxvY2siLCJmaWVsZF9rZXlzIiwiX29iamVjdEtleXMiLCJyZWZlcmVuY2VfZmllbGQiLCJwYXJlbnQiLCJjaGlsZHJlbl9maWVsZHMiLCJwX2siLCJyZWZlcmVuY2VfaWRzIiwicmVmZXJlbmNlX3RvX29iamVjdCIsInNfayIsImdldFByb3BlcnR5IiwicmVkdWNlIiwiaXNPYmplY3QiLCJzaGFyZWQiLCJ1c2VyIiwic3BhY2Vfc2V0dGluZ3MiLCJwZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbCIsImdldEZsb3dQZXJtaXNzaW9ucyIsImZsb3dfaWQiLCJ1c2VyX2lkIiwiZmxvdyIsIm15X3Blcm1pc3Npb25zIiwib3JnX2lkcyIsIm9yZ2FuaXphdGlvbnMiLCJvcmdzX2Nhbl9hZGQiLCJvcmdzX2Nhbl9hZG1pbiIsIm9yZ3NfY2FuX21vbml0b3IiLCJ1c2Vyc19jYW5fYWRkIiwidXNlcnNfY2FuX2FkbWluIiwidXNlcnNfY2FuX21vbml0b3IiLCJ1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsIiwiZ2V0RmxvdyIsInBhcmVudHMiLCJvcmciLCJwYXJlbnRfaWQiLCJwZXJtcyIsIm9yZ19pZCIsIl9ldmFsIiwiZ2V0T2JqZWN0Q29uZmlnIiwiZ2V0T2JqZWN0TmFtZUZpZWxkS2V5IiwiZ2V0UmVsYXRlZHMiLCJpbnNlcnRfaW5zdGFuY2VfdGFza3MiLCJvYmplY3RGaW5kIiwib2JqZWN0RmluZE9uZSIsIm9iamVjdFVwZGF0ZSIsIm9iamVjdHFsIiwid29ya2Zsb3dNYW5hZ2VycyIsImluc3RhbmNlX3Rhc2tzX21hbmFnZXIiLCJvYmplY3RBcGlOYW1lIiwidG9Db25maWciLCJjYiIsInRoZW4iLCJyZXNvbHZlIiwicmVqZWN0IiwiY2hlY2tfYXV0aG9yaXphdGlvbiIsInJlcSIsImF1dGhUb2tlbiIsImhhc2hlZFRva2VuIiwiX2hhc2hMb2dpblRva2VuIiwiZ2V0U3BhY2UiLCJmbG93cyIsImdldFNwYWNlVXNlciIsInNwYWNlX3VzZXIiLCJnZXRTcGFjZVVzZXJPcmdJbmZvIiwib3JnYW5pemF0aW9uIiwiZnVsbG5hbWUiLCJvcmdhbml6YXRpb25fbmFtZSIsIm9yZ2FuaXphdGlvbl9mdWxsbmFtZSIsImlzRmxvd0VuYWJsZWQiLCJzdGF0ZSIsImlzRmxvd1NwYWNlTWF0Y2hlZCIsImdldEZvcm0iLCJmb3JtX2lkIiwiZm9ybSIsImZvcm1zIiwiZ2V0Q2F0ZWdvcnkiLCJjYXRlZ29yeV9pZCIsImNhdGVnb3JpZXMiLCJjaGVja1N5bmNEaXJlY3Rpb24iLCJvdyIsInN5bmNEaXJlY3Rpb24iLCJvYmplY3Rfd29ya2Zsb3dzIiwic3luY19kaXJlY3Rpb24iLCJjcmVhdGVfaW5zdGFuY2UiLCJpbnN0YW5jZV9mcm9tX2NsaWVudCIsInVzZXJfaW5mbyIsImFwcHJfb2JqIiwiYXBwcm92ZV9mcm9tX2NsaWVudCIsImNhdGVnb3J5IiwiaW5zX29iaiIsIm5ld19pbnNfaWQiLCJyZWxhdGVkVGFibGVzSW5mbyIsInNwYWNlX3VzZXJfb3JnX2luZm8iLCJzdGFydF9zdGVwIiwidHJhY2VfZnJvbV9jbGllbnQiLCJ0cmFjZV9vYmoiLCJjaGVja0lzSW5BcHByb3ZhbCIsInBlcm1pc3Npb25NYW5hZ2VyIiwiaW5zdGFuY2VzIiwiZmxvd192ZXJzaW9uIiwiY3VycmVudCIsImZvcm1fdmVyc2lvbiIsInN1Ym1pdHRlciIsInN1Ym1pdHRlcl9uYW1lIiwiYXBwbGljYW50IiwiYXBwbGljYW50X25hbWUiLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uIiwiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lIiwiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZSIsImFwcGxpY2FudF9jb21wYW55IiwiY29tcGFueV9pZCIsImNvZGUiLCJpc19hcmNoaXZlZCIsImlzX2RlbGV0ZWQiLCJyZWNvcmRfaWRzIiwiTW9uZ28iLCJPYmplY3RJRCIsIl9zdHIiLCJpc19maW5pc2hlZCIsInN0ZXBzIiwic3RlcCIsInN0ZXBfdHlwZSIsInN0YXJ0X2RhdGUiLCJ0cmFjZSIsInVzZXJfbmFtZSIsImhhbmRsZXIiLCJoYW5kbGVyX25hbWUiLCJoYW5kbGVyX29yZ2FuaXphdGlvbiIsImhhbmRsZXJfb3JnYW5pemF0aW9uX25hbWUiLCJoYW5kbGVyX29yZ2FuaXphdGlvbl9mdWxsbmFtZSIsInJlYWRfZGF0ZSIsImlzX3JlYWQiLCJpc19lcnJvciIsImRlc2NyaXB0aW9uIiwiaW5pdGlhdGVWYWx1ZXMiLCJhcHByb3ZlcyIsInRyYWNlcyIsImluYm94X3VzZXJzIiwiY3VycmVudF9zdGVwX25hbWUiLCJhdXRvX3JlbWluZCIsImZsb3dfbmFtZSIsImNhdGVnb3J5X25hbWUiLCJpbml0aWF0ZVJlY29yZEluc3RhbmNlSW5mbyIsImluaXRpYXRlQXR0YWNoIiwicmVjb3JkSWRzIiwiZmxvd0lkIiwiZmllbGRDb2RlcyIsImZpbHRlclZhbHVlcyIsImZvcm1GaWVsZHMiLCJmb3JtVGFibGVGaWVsZHMiLCJmb3JtVGFibGVGaWVsZHNDb2RlIiwiZ2V0RmllbGRPZGF0YVZhbHVlIiwiZ2V0Rm9ybUZpZWxkIiwiZ2V0Rm9ybVRhYmxlRmllbGQiLCJnZXRGb3JtVGFibGVGaWVsZENvZGUiLCJnZXRGb3JtVGFibGVTdWJGaWVsZCIsImdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUiLCJnZXRTZWxlY3RPcmdWYWx1ZSIsImdldFNlbGVjdE9yZ1ZhbHVlcyIsImdldFNlbGVjdFVzZXJWYWx1ZSIsImdldFNlbGVjdFVzZXJWYWx1ZXMiLCJvYmplY3ROYW1lIiwicmVjb3JkSWQiLCJyZWxhdGVkT2JqZWN0c0tleXMiLCJ0YWJsZUZpZWxkQ29kZXMiLCJ0YWJsZUZpZWxkTWFwIiwidGFibGVUb1JlbGF0ZWRNYXAiLCJmZiIsImZvcm1GaWVsZCIsInJlbGF0ZWRPYmplY3RzS2V5Iiwic3RhcnRzV2l0aCIsImZvcm1UYWJsZUZpZWxkQ29kZSIsInNmIiwidGFibGVGaWVsZCIsInN1YkZpZWxkQ29kZSIsInJlZmVyZW5jZVRvRmllbGROYW1lIiwiX3JlY29yZCIsIm5hbWVLZXkiLCJzdSIsInVzZXJJZHMiLCJzdXMiLCJvcmdJZCIsIm9yZ0lkcyIsIm9yZ3MiLCJmaWVsZF9tYXAiLCJmbSIsImdyaWRDb2RlIiwibG9va3VwRmllbGROYW1lIiwibG9va3VwRmllbGRPYmoiLCJsb29rdXBPYmplY3RSZWNvcmQiLCJsb29rdXBTZWxlY3RGaWVsZFZhbHVlIiwib1RhYmxlQ29kZSIsIm9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZCIsIm9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZENvZGUiLCJvVGFibGVGaWVsZENvZGUiLCJvYmpGaWVsZCIsIm9iamVjdEZpZWxkTmFtZSIsIm9iamVjdEZpZWxkT2JqZWN0TmFtZSIsIm9iamVjdExvb2t1cEZpZWxkIiwib2JqZWN0X2ZpZWxkIiwib2RhdGFGaWVsZFZhbHVlIiwicmVjb3JkRmllbGRWYWx1ZSIsInJlZmVyZW5jZVRvRG9jIiwicmVmZXJlbmNlVG9GaWVsZFZhbHVlIiwicmVmZXJlbmNlVG9PYmplY3ROYW1lIiwicmVsYXRlZE9iamVjdEZpZWxkQ29kZSIsInNlbGVjdEZpZWxkVmFsdWUiLCJ0YWJsZVRvUmVsYXRlZE1hcEtleSIsIndUYWJsZUNvZGUiLCJ3b3JrZmxvd19maWVsZCIsImhhc093blByb3BlcnR5Iiwid29ya2Zsb3dfdGFibGVfZmllbGRfY29kZSIsIm9iamVjdF90YWJsZV9maWVsZF9jb2RlIiwicmVmZXJlbmNlX3RvX2ZpZWxkIiwibXVsdGlwbGUiLCJpc19tdWx0aXNlbGVjdCIsImZvcm1hdERhdGUiLCJ0ZmMiLCJjIiwicGFyc2UiLCJ0ciIsIm5ld1RyIiwidGZtIiwid1RkQ29kZSIsImZvcm1UYWJsZUZpZWxkIiwicmVsYXRlZEZpZWxkIiwicmVsYXRlZEZpZWxkTmFtZSIsInJlbGF0ZWRSZWNvcmRzIiwicmVsYXRlZFRhYmxlSXRlbXMiLCJ0YWJsZUNvZGUiLCJ0YWJsZVZhbHVlcyIsIl9GUk9NX1RBQkxFX0NPREUiLCJ3YXJuIiwicnIiLCJ0YWJsZVZhbHVlSXRlbSIsInZhbHVlS2V5IiwiZmllbGRLZXkiLCJmb3JtRmllbGRLZXkiLCJyZWxhdGVkT2JqZWN0RmllbGQiLCJ0YWJsZUZpZWxkVmFsdWUiLCJfdGFibGUiLCJfY29kZSIsImZpZWxkX21hcF9zY3JpcHQiLCJleHRlbmQiLCJldmFsRmllbGRNYXBTY3JpcHQiLCJvYmplY3RJZCIsImZ1bmMiLCJzY3JpcHQiLCJpbnNJZCIsImFwcHJvdmVJZCIsImNmIiwidmVyc2lvbnMiLCJ2ZXJzaW9uSWQiLCJpZHgiLCJuZXdGaWxlIiwiRlMiLCJGaWxlIiwiYXR0YWNoRGF0YSIsImNyZWF0ZVJlYWRTdHJlYW0iLCJvcmlnaW5hbCIsIm1ldGFkYXRhIiwicmVhc29uIiwic2l6ZSIsIm93bmVyX25hbWUiLCJhcHByb3ZlIiwibG9ja2VkIiwiaW5zdGFuY2Vfc3RhdGUiLCJpbml0aWF0ZVJlbGF0ZWRSZWNvcmRJbnN0YW5jZUluZm8iLCJ0YWJsZUl0ZW1zIiwiSnNvblJvdXRlcyIsImFkZCIsInJlcyIsIm5leHQiLCJjdXJyZW50X3VzZXJfaWQiLCJjdXJyZW50X3VzZXJfaW5mbyIsImhhc2hEYXRhIiwiaW5zZXJ0ZWRfaW5zdGFuY2VzIiwiYm9keSIsIm5ld19pbnMiLCJzZW5kUmVzdWx0IiwiaW5zZXJ0cyIsInN0YWNrIiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwibWVz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cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdGNoZWNrTnBtVmVyc2lvbnNcbn0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5jaGVja05wbVZlcnNpb25zKHtcblx0YnVzYm95OiBcIl4wLjIuMTNcIixcblx0XCJ4bWwyanNcIjogXCJeMC40LjE5XCIsXG59LCAnc3RlZWRvczpjcmVhdG9yJyk7XG5cbmlmIChNZXRlb3Iuc2V0dGluZ3MgJiYgTWV0ZW9yLnNldHRpbmdzLmNmcyAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bikge1xuXHRjaGVja05wbVZlcnNpb25zKHtcblx0XHRcImFsaXl1bi1zZGtcIjogXCJeMS4xMS4xMlwiXG5cdH0sICdzdGVlZG9zOmNyZWF0b3InKTtcbn0iLCJcblx0IyBDcmVhdG9yLmluaXRBcHBzKClcblxuXG4jIENyZWF0b3IuaW5pdEFwcHMgPSAoKS0+XG4jIFx0aWYgTWV0ZW9yLmlzU2VydmVyXG4jIFx0XHRfLmVhY2ggQ3JlYXRvci5BcHBzLCAoYXBwLCBhcHBfaWQpLT5cbiMgXHRcdFx0ZGJfYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcbiMgXHRcdFx0aWYgIWRiX2FwcFxuIyBcdFx0XHRcdGFwcC5faWQgPSBhcHBfaWRcbiMgXHRcdFx0XHRkYi5hcHBzLmluc2VydChhcHApXG4jIGVsc2VcbiMgXHRhcHAuX2lkID0gYXBwX2lkXG4jIFx0ZGIuYXBwcy51cGRhdGUoe19pZDogYXBwX2lkfSwgYXBwKVxuXG5DcmVhdG9yLmdldFNjaGVtYSA9IChvYmplY3RfbmFtZSktPlxuXHRyZXR1cm4gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5zY2hlbWFcblxuQ3JlYXRvci5nZXRPYmplY3RIb21lQ29tcG9uZW50ID0gKG9iamVjdF9uYW1lKS0+XG5cdCMgaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdCMgXHRyZXR1cm4gQnVpbGRlckNyZWF0b3IucGx1Z2luQ29tcG9uZW50U2VsZWN0b3IoQnVpbGRlckNyZWF0b3Iuc3RvcmUuZ2V0U3RhdGUoKSwgXCJPYmplY3RIb21lXCIsIG9iamVjdF9uYW1lKVxuXHRyZXR1cm4gZmFsc2U7XG5cbkNyZWF0b3IuZ2V0T2JqZWN0VXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cblx0aWYgIWFwcF9pZFxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXG5cdGxpc3Rfdmlld19pZCA9IGxpc3Rfdmlldz8uX2lkXG5cblx0aWYgcmVjb3JkX2lkXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQpXG5cdGVsc2Vcblx0XHRpZiBDcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQob2JqZWN0X25hbWUpXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lKVxuXHRcdGVsc2Vcblx0XHRcdGlmIGxpc3Rfdmlld19pZFxuXHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZClcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSlcblxuQ3JlYXRvci5nZXRPYmplY3RBYnNvbHV0ZVVybCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIC0+XG5cdGlmICFhcHBfaWRcblx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKVxuXHRsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXc/Ll9pZFxuXG5cdGlmIHJlY29yZF9pZFxuXHRcdHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkX2lkLCB0cnVlKVxuXHRlbHNlXG5cdFx0cmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQsIHRydWUpXG5cbkNyZWF0b3IuZ2V0T2JqZWN0Um91dGVyVXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cblx0aWYgIWFwcF9pZFxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXG5cdGxpc3Rfdmlld19pZCA9IGxpc3Rfdmlldz8uX2lkXG5cblx0aWYgcmVjb3JkX2lkXG5cdFx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkX2lkXG5cdGVsc2Vcblx0XHRyZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWRcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1VybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIC0+XG5cdHVybCA9IENyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpXG5cdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKHVybClcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cblx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkXG5cbkNyZWF0b3IuZ2V0U3dpdGNoTGlzdFVybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIC0+XG5cdGlmIGxpc3Rfdmlld19pZFxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIGxpc3Rfdmlld19pZCArIFwiL2xpc3RcIilcblx0ZWxzZVxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9saXN0L3N3aXRjaFwiKVxuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RVcmwgPSAob2JqZWN0X25hbWUsIGFwcF9pZCwgcmVjb3JkX2lkLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUpIC0+XG5cdGlmIHJlbGF0ZWRfZmllbGRfbmFtZVxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIHJlY29yZF9pZCArIFwiL1wiICsgcmVsYXRlZF9vYmplY3RfbmFtZSArIFwiL2dyaWQ/cmVsYXRlZF9maWVsZF9uYW1lPVwiICsgcmVsYXRlZF9maWVsZF9uYW1lKVxuXHRlbHNlXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgcmVjb3JkX2lkICsgXCIvXCIgKyByZWxhdGVkX29iamVjdF9uYW1lICsgXCIvZ3JpZFwiKVxuXG5DcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyA9IChvYmplY3RfbmFtZSwgaXNfZGVlcCwgaXNfc2tpcF9oaWRlLCBpc19yZWxhdGVkKS0+XG5cdF9vcHRpb25zID0gW11cblx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIF9vcHRpb25zXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0ZmllbGRzID0gX29iamVjdD8uZmllbGRzXG5cdGljb24gPSBfb2JqZWN0Py5pY29uXG5cdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XG5cdFx0aWYgaXNfc2tpcF9oaWRlIGFuZCBmLmhpZGRlblxuXHRcdFx0cmV0dXJuXG5cdFx0aWYgZi50eXBlID09IFwic2VsZWN0XCJcblx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7Zi5sYWJlbCB8fCBrfVwiLCB2YWx1ZTogXCIje2t9XCIsIGljb246IGljb259XG5cdFx0ZWxzZVxuXHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XG5cdGlmIGlzX2RlZXBcblx0XHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxuXHRcdFx0aWYgaXNfc2tpcF9oaWRlIGFuZCBmLmhpZGRlblxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIChmLnR5cGUgPT0gXCJsb29rdXBcIiB8fCBmLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpICYmIGYucmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcoZi5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdCMg5LiN5pSv5oyBZi5yZWZlcmVuY2VfdG/kuLpmdW5jdGlvbueahOaDheWGte+8jOaciemcgOaxguWGjeivtFxuXHRcdFx0XHRyX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGYucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRpZiByX29iamVjdFxuXHRcdFx0XHRcdF8uZm9yRWFjaCByX29iamVjdC5maWVsZHMsIChmMiwgazIpLT5cblx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7Zi5sYWJlbCB8fCBrfT0+I3tmMi5sYWJlbCB8fCBrMn1cIiwgdmFsdWU6IFwiI3trfS4je2syfVwiLCBpY29uOiByX29iamVjdD8uaWNvbn1cblx0aWYgaXNfcmVsYXRlZFxuXHRcdHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSlcblx0XHRfLmVhY2ggcmVsYXRlZE9iamVjdHMsIChfcmVsYXRlZE9iamVjdCk9PlxuXHRcdFx0cmVsYXRlZE9wdGlvbnMgPSBDcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyhfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSlcblx0XHRcdHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSlcblx0XHRcdF8uZWFjaCByZWxhdGVkT3B0aW9ucywgKHJlbGF0ZWRPcHRpb24pLT5cblx0XHRcdFx0aWYgX3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXkgIT0gcmVsYXRlZE9wdGlvbi52YWx1ZVxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7cmVsYXRlZE9iamVjdC5sYWJlbCB8fCByZWxhdGVkT2JqZWN0Lm5hbWV9PT4je3JlbGF0ZWRPcHRpb24ubGFiZWx9XCIsIHZhbHVlOiBcIiN7cmVsYXRlZE9iamVjdC5uYW1lfS4je3JlbGF0ZWRPcHRpb24udmFsdWV9XCIsIGljb246IHJlbGF0ZWRPYmplY3Q/Lmljb259XG5cdHJldHVybiBfb3B0aW9uc1xuXG4jIOe7n+S4gOS4uuWvueixoW9iamVjdF9uYW1l5o+Q5L6b5Y+v55So5LqO6L+H6JmR5Zmo6L+H6JmR5a2X5q61XG5DcmVhdG9yLmdldE9iamVjdEZpbHRlckZpZWxkT3B0aW9ucyA9IChvYmplY3RfbmFtZSktPlxuXHRfb3B0aW9ucyA9IFtdXG5cdHVubGVzcyBvYmplY3RfbmFtZVxuXHRcdHJldHVybiBfb3B0aW9uc1xuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xuXHRwZXJtaXNzaW9uX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKG9iamVjdF9uYW1lKVxuXHRpY29uID0gX29iamVjdD8uaWNvblxuXHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxuXHRcdCMgaGlkZGVuLGdyaWTnrYnnsbvlnovnmoTlrZfmrrXvvIzkuI3pnIDopoHov4fmu6Rcblx0XHRpZiAhXy5pbmNsdWRlKFtcImdyaWRcIixcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJhdmF0YXJcIiwgXCJpbWFnZVwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKSBhbmQgIWYuaGlkZGVuXG5cdFx0XHQjIGZpbHRlcnMuJC5maWVsZOWPimZsb3cuY3VycmVudOetieWtkOWtl+auteS5n+S4jemcgOimgei/h+a7pFxuXHRcdFx0aWYgIS9cXHcrXFwuLy50ZXN0KGspIGFuZCBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTFcblx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XG5cblx0cmV0dXJuIF9vcHRpb25zXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRPcHRpb25zID0gKG9iamVjdF9uYW1lKS0+XG5cdF9vcHRpb25zID0gW11cblx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIF9vcHRpb25zXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0ZmllbGRzID0gX29iamVjdD8uZmllbGRzXG5cdHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpXG5cdGljb24gPSBfb2JqZWN0Py5pY29uXG5cdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XG5cdFx0aWYgIV8uaW5jbHVkZShbXCJncmlkXCIsXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwibWFya2Rvd25cIiwgXCJodG1sXCJdLCBmLnR5cGUpXG5cdFx0XHRpZiAhL1xcdytcXC4vLnRlc3QoaykgYW5kIF8uaW5kZXhPZihwZXJtaXNzaW9uX2ZpZWxkcywgaykgPiAtMVxuXHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogZi5sYWJlbCB8fCBrLCB2YWx1ZTogaywgaWNvbjogaWNvbn1cblx0cmV0dXJuIF9vcHRpb25zXG5cbiMjI1xuZmlsdGVyczog6KaB6L2s5o2i55qEZmlsdGVyc1xuZmllbGRzOiDlr7nosaHlrZfmrrVcbmZpbHRlcl9maWVsZHM6IOm7mOiupOi/h+a7pOWtl+aute+8jOaUr+aMgeWtl+espuS4suaVsOe7hOWSjOWvueixoeaVsOe7hOS4pOenjeagvOW8j++8jOWmgjpbJ2ZpbGVkX25hbWUxJywnZmlsZWRfbmFtZTInXSxbe2ZpZWxkOidmaWxlZF9uYW1lMScscmVxdWlyZWQ6dHJ1ZX1dXG7lpITnkIbpgLvovpE6IOaKimZpbHRlcnPkuK3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25aKe5Yqg5q+P6aG555qEaXNfZGVmYXVsdOOAgWlzX3JlcXVpcmVk5bGe5oCn77yM5LiN5a2Y5Zyo5LqOZmlsdGVyX2ZpZWxkc+eahOi/h+a7pOadoeS7tuWvueW6lOeahOenu+mZpOavj+mhueeahOebuOWFs+WxnuaAp1xu6L+U5Zue57uT5p6cOiDlpITnkIblkI7nmoRmaWx0ZXJzXG4jIyNcbkNyZWF0b3IuZ2V0RmlsdGVyc1dpdGhGaWx0ZXJGaWVsZHMgPSAoZmlsdGVycywgZmllbGRzLCBmaWx0ZXJfZmllbGRzKS0+XG5cdHVubGVzcyBmaWx0ZXJzXG5cdFx0ZmlsdGVycyA9IFtdXG5cdHVubGVzcyBmaWx0ZXJfZmllbGRzXG5cdFx0ZmlsdGVyX2ZpZWxkcyA9IFtdXG5cdGlmIGZpbHRlcl9maWVsZHM/Lmxlbmd0aFxuXHRcdGZpbHRlcl9maWVsZHMuZm9yRWFjaCAobiktPlxuXHRcdFx0aWYgXy5pc1N0cmluZyhuKVxuXHRcdFx0XHRuID0gXG5cdFx0XHRcdFx0ZmllbGQ6IG4sXG5cdFx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlXG5cdFx0XHRpZiBmaWVsZHNbbi5maWVsZF0gYW5kICFfLmZpbmRXaGVyZShmaWx0ZXJzLHtmaWVsZDpuLmZpZWxkfSlcblx0XHRcdFx0ZmlsdGVycy5wdXNoXG5cdFx0XHRcdFx0ZmllbGQ6IG4uZmllbGQsXG5cdFx0XHRcdFx0aXNfZGVmYXVsdDogdHJ1ZSxcblx0XHRcdFx0XHRpc19yZXF1aXJlZDogbi5yZXF1aXJlZFxuXHRmaWx0ZXJzLmZvckVhY2ggKGZpbHRlckl0ZW0pLT5cblx0XHRtYXRjaEZpZWxkID0gZmlsdGVyX2ZpZWxkcy5maW5kIChuKS0+IHJldHVybiBuID09IGZpbHRlckl0ZW0uZmllbGQgb3Igbi5maWVsZCA9PSBmaWx0ZXJJdGVtLmZpZWxkXG5cdFx0aWYgXy5pc1N0cmluZyhtYXRjaEZpZWxkKVxuXHRcdFx0bWF0Y2hGaWVsZCA9IFxuXHRcdFx0XHRmaWVsZDogbWF0Y2hGaWVsZCxcblx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlXG5cdFx0aWYgbWF0Y2hGaWVsZFxuXHRcdFx0ZmlsdGVySXRlbS5pc19kZWZhdWx0ID0gdHJ1ZVxuXHRcdFx0ZmlsdGVySXRlbS5pc19yZXF1aXJlZCA9IG1hdGNoRmllbGQucmVxdWlyZWRcblx0XHRlbHNlXG5cdFx0XHRkZWxldGUgZmlsdGVySXRlbS5pc19kZWZhdWx0XG5cdFx0XHRkZWxldGUgZmlsdGVySXRlbS5pc19yZXF1aXJlZFxuXHRyZXR1cm4gZmlsdGVyc1xuXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpLT5cblxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRpZiAhcmVjb3JkX2lkXG5cdFx0cmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgb2JqZWN0X25hbWUgPT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSAmJiAgcmVjb3JkX2lkID09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpXG5cdFx0XHRpZiBUZW1wbGF0ZS5pbnN0YW5jZSgpPy5yZWNvcmRcblx0XHRcdFx0cmV0dXJuIFRlbXBsYXRlLmluc3RhbmNlKCk/LnJlY29yZD8uZ2V0KClcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKVxuXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdGlmIG9iai5kYXRhYmFzZV9uYW1lID09IFwibWV0ZW9yXCIgfHwgIW9iai5kYXRhYmFzZV9uYW1lXG5cdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSlcblx0XHRpZiBjb2xsZWN0aW9uXG5cdFx0XHRyZWNvcmQgPSBjb2xsZWN0aW9uLmZpbmRPbmUocmVjb3JkX2lkKVxuXHRcdFx0cmV0dXJuIHJlY29yZFxuXHRlbHNlIGlmIG9iamVjdF9uYW1lICYmIHJlY29yZF9pZFxuXHRcdHJldHVybiBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpXG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkTmFtZSA9IChyZWNvcmQsIG9iamVjdF9uYW1lKS0+XG5cdHVubGVzcyByZWNvcmRcblx0XHRyZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpXG5cdGlmIHJlY29yZFxuXHRcdCMg5pi+56S657uE57uH5YiX6KGo5pe277yM54m55q6K5aSE55CGbmFtZV9maWVsZF9rZXnkuLpuYW1l5a2X5q61XG5cdFx0bmFtZV9maWVsZF9rZXkgPSBpZiBvYmplY3RfbmFtZSA9PSBcIm9yZ2FuaXphdGlvbnNcIiB0aGVuIFwibmFtZVwiIGVsc2UgQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5OQU1FX0ZJRUxEX0tFWVxuXHRcdGlmIHJlY29yZCBhbmQgbmFtZV9maWVsZF9rZXlcblx0XHRcdHJldHVybiByZWNvcmQubGFiZWwgfHwgcmVjb3JkW25hbWVfZmllbGRfa2V5XVxuXG5DcmVhdG9yLmdldEFwcCA9IChhcHBfaWQpLT5cblx0aWYgIWFwcF9pZFxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdGFwcCA9IENyZWF0b3IuQXBwc1thcHBfaWRdXG5cdENyZWF0b3IuZGVwcz8uYXBwPy5kZXBlbmQoKVxuXHRyZXR1cm4gYXBwXG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkID0gKGFwcF9pZCktPlxuXHRhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpXG5cdGlmICFhcHBcblx0XHRyZXR1cm5cblx0ZGFzaGJvYXJkID0gbnVsbFxuXHRfLmVhY2ggQ3JlYXRvci5EYXNoYm9hcmRzLCAodiwgayktPlxuXHRcdGlmIHYuYXBwcz8uaW5kZXhPZihhcHAuX2lkKSA+IC0xXG5cdFx0XHRkYXNoYm9hcmQgPSB2O1xuXHRyZXR1cm4gZGFzaGJvYXJkO1xuXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZENvbXBvbmVudCA9IChhcHBfaWQpLT5cblx0YXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKVxuXHRpZiAhYXBwIHx8IHRydWVcblx0XHRyZXR1cm5cblx0IyByZXR1cm4gQnVpbGRlckNyZWF0b3IucGx1Z2luQ29tcG9uZW50U2VsZWN0b3IoQnVpbGRlckNyZWF0b3Iuc3RvcmUuZ2V0U3RhdGUoKSwgXCJEYXNoYm9hcmRcIiwgYXBwLl9pZCk7XG5cbkNyZWF0b3IuZ2V0QXBwT2JqZWN0TmFtZXMgPSAoYXBwX2lkKS0+XG5cdGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZClcblx0aWYgIWFwcFxuXHRcdHJldHVyblxuXHRpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRhcHBPYmplY3RzID0gaWYgaXNNb2JpbGUgdGhlbiBhcHAubW9iaWxlX29iamVjdHMgZWxzZSBhcHAub2JqZWN0c1xuXHRvYmplY3RzID0gW11cblx0aWYgYXBwXG5cdFx0Xy5lYWNoIGFwcE9iamVjdHMsICh2KS0+XG5cdFx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdCh2KVxuXHRcdFx0aWYgb2JqPy5wZXJtaXNzaW9ucy5nZXQoKS5hbGxvd1JlYWRcblx0XHRcdFx0b2JqZWN0cy5wdXNoIHZcblx0cmV0dXJuIG9iamVjdHNcblxuQ3JlYXRvci5nZXRVcmxXaXRoVG9rZW4gPSAodXJsLCBleHByZXNzaW9uRm9ybURhdGEpIC0+XG5cdCMg57uZdXJs5pe25ou85o6l5b2T5YmN55So5oi3dG9rZW7nm7jlhbPkv6Hmga/nlKjkuo7nmbvlvZXpqozor4HvvIzmlK/mjIHphY3nva7ooajovr7lvI9cblx0cGFyYW1zID0ge307XG5cdHBhcmFtc1tcIlgtU3BhY2UtSWRcIl0gPSBTdGVlZG9zLnNwYWNlSWQoKVxuXHRwYXJhbXNbXCJYLVVzZXItSWRcIl0gPSBTdGVlZG9zLnVzZXJJZCgpO1xuXHRwYXJhbXNbXCJYLUNvbXBhbnktSWRzXCJdID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpO1xuXHRwYXJhbXNbXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuXHRpZiBTdGVlZG9zLmlzRXhwcmVzc2lvbih1cmwpXG5cdFx0dXJsID0gU3RlZWRvcy5wYXJzZVNpbmdsZUV4cHJlc3Npb24odXJsLCBleHByZXNzaW9uRm9ybURhdGEsIFwiI1wiLCBDcmVhdG9yLlVTRVJfQ09OVEVYVClcblx0IyDlpJbpg6jpk77mjqXlnLDlnYDkuK3lj6/og73kvJrluKbmnIkj5Y+377yM5q+U5aaCL2J1aWxkZXIvP3BfaWRzPTYxOTM4MzU0NWIyZTlhNzJlYzA1NThiMyMvcGFnZS9wdWJsaWMvdGVzdFxuXHQjIOatpOaXtnVybOS4reW3sue7j+WcqCPlj7fliY3pnaLlh7rnjrDkuobkuIDkuKo/5Y+377yM6L+Z5Liq6Zeu5Y+35LiN5Y+v5Lul6KKr6K+G5Yir5Li6dXJs5Y+C5pWw77yM5Y+q5pyJI+WPt+WQjumdoueahD/lj7fmiY3lupTor6Xooqvor4bliKvkuLp1cmzlj4LmlbBcblx0aGFzUXVlcnlTeW1ib2wgPSAvKFxcIy4rXFw/KXwoXFw/W14jXSokKS9nLnRlc3QodXJsKVxuXHRsaW5rU3RyID0gaWYgaGFzUXVlcnlTeW1ib2wgdGhlbiBcIiZcIiBlbHNlIFwiP1wiXG5cdHJldHVybiBcIiN7dXJsfSN7bGlua1N0cn0jeyQucGFyYW0ocGFyYW1zKX1cIlxuXG5DcmVhdG9yLmdldEFwcE1lbnUgPSAoYXBwX2lkLCBtZW51X2lkKS0+XG5cdG1lbnVzID0gQ3JlYXRvci5nZXRBcHBNZW51cyhhcHBfaWQpXG5cdHJldHVybiBtZW51cyAmJiBtZW51cy5maW5kIChtZW51KS0+IHJldHVybiBtZW51LmlkID09IG1lbnVfaWRcblxuQ3JlYXRvci5nZXRBcHBNZW51VXJsRm9ySW50ZXJuZXQgPSAobWVudSktPlxuXHQjIOW9k3RhYnPnsbvlnovkuLp1cmzml7bvvIzmjInlpJbpg6jpk77mjqXlpITnkIbvvIzmlK/mjIHphY3nva7ooajovr7lvI/lubbliqDkuIrnu5/kuIDnmoR1cmzlj4LmlbBcblx0cmV0dXJuIENyZWF0b3IuZ2V0VXJsV2l0aFRva2VuIG1lbnUucGF0aCwgbWVudVxuXG5DcmVhdG9yLmdldEFwcE1lbnVVcmwgPSAobWVudSktPlxuXHR1cmwgPSBtZW51LnBhdGhcblx0aWYgbWVudS50eXBlID09IFwidXJsXCJcblx0XHRpZiBtZW51LnRhcmdldFxuXHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0QXBwTWVudVVybEZvckludGVybmV0KG1lbnUpXG5cdFx0ZWxzZVxuXHRcdFx0IyDlnKhpZnJhbWXkuK3mmL7npLp1cmznlYzpnaJcblx0XHRcdHJldHVybiBcIi9hcHAvLS90YWJfaWZyYW1lLyN7bWVudS5pZH1cIlxuXHRlbHNlXG5cdFx0cmV0dXJuIG1lbnUucGF0aFxuXG5DcmVhdG9yLmdldEFwcE1lbnVzID0gKGFwcF9pZCktPlxuXHRhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpXG5cdGlmICFhcHBcblx0XHRyZXR1cm4gW11cblx0YXBwTWVudXMgPSBTZXNzaW9uLmdldChcImFwcF9tZW51c1wiKTtcblx0dW5sZXNzIGFwcE1lbnVzXG5cdFx0cmV0dXJuIFtdXG5cdGN1cmVudEFwcE1lbnVzID0gYXBwTWVudXMuZmluZCAobWVudUl0ZW0pIC0+XG5cdFx0cmV0dXJuIG1lbnVJdGVtLmlkID09IGFwcC5faWRcblx0aWYgY3VyZW50QXBwTWVudXNcblx0XHRyZXR1cm4gY3VyZW50QXBwTWVudXMuY2hpbGRyZW5cblxuQ3JlYXRvci5sb2FkQXBwc01lbnVzID0gKCktPlxuXHRpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRkYXRhID0geyB9XG5cdGlmIGlzTW9iaWxlXG5cdFx0ZGF0YS5tb2JpbGUgPSBpc01vYmlsZVxuXHRvcHRpb25zID0geyBcblx0XHR0eXBlOiAnZ2V0JywgXG5cdFx0ZGF0YTogZGF0YSwgXG5cdFx0c3VjY2VzczogKGRhdGEpLT5cblx0XHRcdFNlc3Npb24uc2V0KFwiYXBwX21lbnVzXCIsIGRhdGEpO1xuXHQgfVxuXHRTdGVlZG9zLmF1dGhSZXF1ZXN0IFwiL3NlcnZpY2UvYXBpL2FwcHMvbWVudXNcIiwgb3B0aW9uc1xuXG5DcmVhdG9yLmNyZWF0b3JBcHBzU2VsZWN0b3IgPSAoYXBwcywgYXNzaWduZWRfYXBwcykgLT5cblx0YWRtaW5BcHAgPSB1bmRlZmluZWRcblx0c29ydGVkQXBwcyA9IHVuZGVmaW5lZFxuXHRfLmVhY2ggYXBwcywgKGFwcCwga2V5KSAtPlxuXHRcdGlmICFhcHAuX2lkXG5cdFx0XHRhcHAuX2lkID0ga2V5XG5cdFx0aWYgYXBwLmlzX2NyZWF0b3Jcblx0XHRcdCMg5LiN6ZyA6KaBaXNTcGFjZUFkbWlu6YC76L6RXG5cdFx0XHQjIGlmIChpc1NwYWNlQWRtaW4pIHtcblx0XHRcdCNcdFx0IGFwcC52aXNpYmxlID0gdHJ1ZTtcblx0XHRcdCMgfVxuXHRcdGVsc2Vcblx0XHRcdCMg6Z2eY3JlYXRvcuW6lOivpeS4gOW+i+S4jeaYvuekulxuXHRcdFx0YXBwLnZpc2libGUgPSBmYWxzZVxuXHRcdHJldHVyblxuXHRzb3J0ZWRBcHBzID0gXy5zb3J0QnkoXy52YWx1ZXMoYXBwcyksICdzb3J0Jylcblx0Y3JlYXRvckFwcHMgPSB7fVxuXHRhZG1pbkFwcCA9IHt9XG5cdCMg5oyJ6ZKuc29ydOaOkuW6j+asoeW6j+iuvue9rkNyZWF0b3IuQXBwc+WAvFxuXHRfLmVhY2ggc29ydGVkQXBwcywgKG4pIC0+XG5cdFx0aWYgbi5faWQgPT0gJ2FkbWluJ1xuXHRcdFx0YWRtaW5BcHAgPSBuXG5cdFx0ZWxzZVxuXHRcdFx0Y3JlYXRvckFwcHNbbi5faWRdID0gblxuXHQjIGFkbWlu6I+c5Y2V5pi+56S65Zyo5pyA5ZCOXG5cdGNyZWF0b3JBcHBzLmFkbWluID0gYWRtaW5BcHBcblx0aWYgYXNzaWduZWRfYXBwcy5sZW5ndGhcblx0XHRfLmVhY2ggY3JlYXRvckFwcHMsIChhcHAsIGtleSkgLT5cblx0XHRcdGlmIGFzc2lnbmVkX2FwcHMuaW5kZXhPZihrZXkpID4gLTFcblx0XHRcdFx0YXBwLnZpc2libGUgPSBhcHAuaXNfY3JlYXRvclxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRhcHAudmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRyZXR1cm5cblx0Y3JlYXRvckFwcHNcblxuQ3JlYXRvci52aXNpYmxlQXBwc1NlbGVjdG9yID0gKGNyZWF0b3JBcHBzLCBpbmNsdWRlQWRtaW4gPSB0cnVlKSAtPlxuXHRhcHBzID0gW11cblx0Xy5lYWNoIGNyZWF0b3JBcHBzLCAodiwgaykgLT5cblx0XHRpZiB2LnZpc2libGUgIT0gZmFsc2UgYW5kIHYuX2lkICE9ICdhZG1pbicgb3IgaW5jbHVkZUFkbWluIGFuZCB2Ll9pZCA9PSAnYWRtaW4nXG5cdFx0XHRhcHBzLnB1c2ggdlxuXHRcdHJldHVyblxuXHRhcHBzXG5cbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHMgPSAoaW5jbHVkZUFkbWluKS0+XG5cdGNoYW5nZUFwcCA9IENyZWF0b3IuX3N1YkFwcC5nZXQoKTtcblx0Y3JlYXRvckFwcHMgPSBPYmplY3QuYXNzaWduKHt9LCBDcmVhdG9yLkFwcHMsIHthcHBzOiBjaGFuZ2VBcHB9KTtcblx0cmV0dXJuIENyZWF0b3IudmlzaWJsZUFwcHNTZWxlY3RvcihjcmVhdG9yQXBwcywgaW5jbHVkZUFkbWluKVxuXG5DcmVhdG9yLmdldFZpc2libGVBcHBzT2JqZWN0cyA9ICgpLT5cblx0YXBwcyA9IENyZWF0b3IuZ2V0VmlzaWJsZUFwcHMoKVxuXHR2aXNpYmxlT2JqZWN0TmFtZXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhhcHBzLCdvYmplY3RzJykpXG5cdG9iamVjdHMgPSBfLmZpbHRlciBDcmVhdG9yLk9iamVjdHMsIChvYmopLT5cblx0XHRpZiB2aXNpYmxlT2JqZWN0TmFtZXMuaW5kZXhPZihvYmoubmFtZSkgPCAwXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXHRvYmplY3RzID0gb2JqZWN0cy5zb3J0KENyZWF0b3Iuc29ydGluZ01ldGhvZC5iaW5kKHtrZXk6XCJsYWJlbFwifSkpXG5cdG9iamVjdHMgPSBfLnBsdWNrKG9iamVjdHMsJ25hbWUnKVxuXHRyZXR1cm4gXy51bmlxIG9iamVjdHNcblxuQ3JlYXRvci5nZXRBcHBzT2JqZWN0cyA9ICgpLT5cblx0b2JqZWN0cyA9IFtdXG5cdHRlbXBPYmplY3RzID0gW11cblx0Xy5mb3JFYWNoIENyZWF0b3IuQXBwcywgKGFwcCktPlxuXHRcdHRlbXBPYmplY3RzID0gXy5maWx0ZXIgYXBwLm9iamVjdHMsIChvYmopLT5cblx0XHRcdHJldHVybiAhb2JqLmhpZGRlblxuXHRcdG9iamVjdHMgPSBvYmplY3RzLmNvbmNhdCh0ZW1wT2JqZWN0cylcblx0cmV0dXJuIF8udW5pcSBvYmplY3RzXG5cbkNyZWF0b3IudmFsaWRhdGVGaWx0ZXJzID0gKGZpbHRlcnMsIGxvZ2ljKS0+XG5cdGZpbHRlcl9pdGVtcyA9IF8ubWFwIGZpbHRlcnMsIChvYmopIC0+XG5cdFx0aWYgXy5pc0VtcHR5KG9iailcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBvYmpcblx0ZmlsdGVyX2l0ZW1zID0gXy5jb21wYWN0KGZpbHRlcl9pdGVtcylcblx0ZXJyb3JNc2cgPSBcIlwiXG5cdGZpbHRlcl9sZW5ndGggPSBmaWx0ZXJfaXRlbXMubGVuZ3RoXG5cdGlmIGxvZ2ljXG5cdFx0IyDmoLzlvI/ljJZmaWx0ZXJcblx0XHRsb2dpYyA9IGxvZ2ljLnJlcGxhY2UoL1xcbi9nLCBcIlwiKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKVxuXG5cdFx0IyDliKTmlq3nibnmrorlrZfnrKZcblx0XHRpZiAvWy5fXFwtIStdKy9pZy50ZXN0KGxvZ2ljKVxuXHRcdFx0ZXJyb3JNc2cgPSBcIuWQq+acieeJueauiuWtl+espuOAglwiXG5cblx0XHRpZiAhZXJyb3JNc2dcblx0XHRcdGluZGV4ID0gbG9naWMubWF0Y2goL1xcZCsvaWcpXG5cdFx0XHRpZiAhaW5kZXhcblx0XHRcdFx0ZXJyb3JNc2cgPSBcIuacieS6m+etm+mAieadoeS7tui/m+ihjOS6huWumuS5ie+8jOS9huacquWcqOmrmOe6p+etm+mAieadoeS7tuS4reiiq+W8leeUqOOAglwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGluZGV4LmZvckVhY2ggKGkpLT5cblx0XHRcdFx0XHRpZiBpIDwgMSBvciBpID4gZmlsdGVyX2xlbmd0aFxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieadoeS7tuW8leeUqOS6huacquWumuS5ieeahOetm+mAieWZqO+8miN7aX3jgIJcIlxuXG5cdFx0XHRcdGZsYWcgPSAxXG5cdFx0XHRcdHdoaWxlIGZsYWcgPD0gZmlsdGVyX2xlbmd0aFxuXHRcdFx0XHRcdGlmICFpbmRleC5pbmNsdWRlcyhcIiN7ZmxhZ31cIilcblx0XHRcdFx0XHRcdGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIlxuXHRcdFx0XHRcdGZsYWcrKztcblxuXHRcdGlmICFlcnJvck1zZ1xuXHRcdFx0IyDliKTmlq3mmK/lkKbmnInpnZ7ms5Xoi7HmloflrZfnrKZcblx0XHRcdHdvcmQgPSBsb2dpYy5tYXRjaCgvW2EtekEtWl0rL2lnKVxuXHRcdFx0aWYgd29yZFxuXHRcdFx0XHR3b3JkLmZvckVhY2ggKHcpLT5cblx0XHRcdFx0XHRpZiAhL14oYW5kfG9yKSQvaWcudGVzdCh3KVxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBcIuajgOafpeaCqOeahOmrmOe6p+etm+mAieadoeS7tuS4reeahOaLvOWGmeOAglwiXG5cblx0XHRpZiAhZXJyb3JNc2dcblx0XHRcdCMg5Yik5pat5qC85byP5piv5ZCm5q2j56GuXG5cdFx0XHR0cnlcblx0XHRcdFx0Q3JlYXRvci5ldmFsKGxvZ2ljLnJlcGxhY2UoL2FuZC9pZywgXCImJlwiKS5yZXBsYWNlKC9vci9pZywgXCJ8fFwiKSlcblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0ZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOS4reWQq+acieeJueauiuWtl+esplwiXG5cblx0XHRcdGlmIC8oQU5EKVteKCldKyhPUikvaWcudGVzdChsb2dpYykgfHwgIC8oT1IpW14oKV0rKEFORCkvaWcudGVzdChsb2dpYylcblx0XHRcdFx0ZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOW/hemhu+WcqOi/nue7reaAp+eahCBBTkQg5ZKMIE9SIOihqOi+vuW8j+WJjeWQjuS9v+eUqOaLrOWPt+OAglwiXG5cdGlmIGVycm9yTXNnXG5cdFx0Y29uc29sZS5sb2cgXCJlcnJvclwiLCBlcnJvck1zZ1xuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0dG9hc3RyLmVycm9yKGVycm9yTXNnKVxuXHRcdHJldHVybiBmYWxzZVxuXHRlbHNlXG5cdFx0cmV0dXJuIHRydWVcblxuIyBcIj1cIiwgXCI8PlwiLCBcIj5cIiwgXCI+PVwiLCBcIjxcIiwgXCI8PVwiLCBcInN0YXJ0c3dpdGhcIiwgXCJjb250YWluc1wiLCBcIm5vdGNvbnRhaW5zXCIuXG4jIyNcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4jIyNcbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvTW9uZ28gPSAoZmlsdGVycywgb3B0aW9ucyktPlxuXHR1bmxlc3MgZmlsdGVycz8ubGVuZ3RoXG5cdFx0cmV0dXJuXG5cdCMg5b2TZmlsdGVyc+S4jeaYr1tBcnJheV3nsbvlnovogIzmmK9bT2JqZWN0Xeexu+Wei+aXtu+8jOi/m+ihjOagvOW8j+i9rOaNolxuXHR1bmxlc3MgZmlsdGVyc1swXSBpbnN0YW5jZW9mIEFycmF5XG5cdFx0ZmlsdGVycyA9IF8ubWFwIGZpbHRlcnMsIChvYmopLT5cblx0XHRcdHJldHVybiBbb2JqLmZpZWxkLCBvYmoub3BlcmF0aW9uLCBvYmoudmFsdWVdXG5cdHNlbGVjdG9yID0gW11cblx0Xy5lYWNoIGZpbHRlcnMsIChmaWx0ZXIpLT5cblx0XHRmaWVsZCA9IGZpbHRlclswXVxuXHRcdG9wdGlvbiA9IGZpbHRlclsxXVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0pXG5cdFx0ZWxzZVxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIG51bGwsIG9wdGlvbnMpXG5cdFx0c3ViX3NlbGVjdG9yID0ge31cblx0XHRzdWJfc2VsZWN0b3JbZmllbGRdID0ge31cblx0XHRpZiBvcHRpb24gPT0gXCI9XCJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZXFcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPD5cIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRuZVwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI+XCJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPj1cIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndGVcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPFwiXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGx0XCJdID0gdmFsdWVcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIjw9XCJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRlXCJdID0gdmFsdWVcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcInN0YXJ0c3dpdGhcIlxuXHRcdFx0cmVnID0gbmV3IFJlZ0V4cChcIl5cIiArIHZhbHVlLCBcImlcIilcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWdcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcImNvbnRhaW5zXCJcblx0XHRcdHJlZyA9IG5ldyBSZWdFeHAodmFsdWUsIFwiaVwiKVxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZ1xuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwibm90Y29udGFpbnNcIlxuXHRcdFx0cmVnID0gbmV3IFJlZ0V4cChcIl4oKD8hXCIgKyB2YWx1ZSArIFwiKS4pKiRcIiwgXCJpXCIpXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnXG5cdFx0c2VsZWN0b3IucHVzaCBzdWJfc2VsZWN0b3Jcblx0cmV0dXJuIHNlbGVjdG9yXG5cbkNyZWF0b3IuaXNCZXR3ZWVuRmlsdGVyT3BlcmF0aW9uID0gKG9wZXJhdGlvbiktPlxuXHRyZXR1cm4gb3BlcmF0aW9uID09IFwiYmV0d2VlblwiIG9yICEhQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXModHJ1ZSk/W29wZXJhdGlvbl1cblxuIyMjXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuXHRleHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4jIyNcbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvRGV2ID0gKGZpbHRlcnMsIG9iamVjdF9uYW1lLCBvcHRpb25zKS0+XG5cdHVubGVzcyBmaWx0ZXJzLmxlbmd0aFxuXHRcdHJldHVyblxuXHRpZiBvcHRpb25zPy5pc19sb2dpY19vclxuXHRcdCMg5aaC5p6caXNfbG9naWNfb3LkuLp0cnVl77yM5Li6ZmlsdGVyc+esrOS4gOWxguWFg+e0oOWinuWKoG9y6Ze06ZqUXG5cdFx0bG9naWNUZW1wRmlsdGVycyA9IFtdXG5cdFx0ZmlsdGVycy5mb3JFYWNoIChuKS0+XG5cdFx0XHRsb2dpY1RlbXBGaWx0ZXJzLnB1c2gobilcblx0XHRcdGxvZ2ljVGVtcEZpbHRlcnMucHVzaChcIm9yXCIpXG5cdFx0bG9naWNUZW1wRmlsdGVycy5wb3AoKVxuXHRcdGZpbHRlcnMgPSBsb2dpY1RlbXBGaWx0ZXJzXG5cdHNlbGVjdG9yID0gU3RlZWRvc0ZpbHRlcnMuZm9ybWF0RmlsdGVyc1RvRGV2KGZpbHRlcnMsIENyZWF0b3IuVVNFUl9DT05URVhUKVxuXHRyZXR1cm4gc2VsZWN0b3JcblxuIyMjXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuIyMjXG5DcmVhdG9yLmZvcm1hdExvZ2ljRmlsdGVyc1RvRGV2ID0gKGZpbHRlcnMsIGZpbHRlcl9sb2dpYywgb3B0aW9ucyktPlxuXHRmb3JtYXRfbG9naWMgPSBmaWx0ZXJfbG9naWMucmVwbGFjZSgvXFwoXFxzKy9pZywgXCIoXCIpLnJlcGxhY2UoL1xccytcXCkvaWcsIFwiKVwiKS5yZXBsYWNlKC9cXCgvZywgXCJbXCIpLnJlcGxhY2UoL1xcKS9nLCBcIl1cIikucmVwbGFjZSgvXFxzKy9nLCBcIixcIikucmVwbGFjZSgvKGFuZHxvcikvaWcsIFwiJyQxJ1wiKVxuXHRmb3JtYXRfbG9naWMgPSBmb3JtYXRfbG9naWMucmVwbGFjZSgvKFxcZCkrL2lnLCAoeCktPlxuXHRcdF9mID0gZmlsdGVyc1t4LTFdXG5cdFx0ZmllbGQgPSBfZi5maWVsZFxuXHRcdG9wdGlvbiA9IF9mLm9wZXJhdGlvblxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShfZi52YWx1ZSlcblx0XHRlbHNlXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlLCBudWxsLCBvcHRpb25zKVxuXHRcdHN1Yl9zZWxlY3RvciA9IFtdXG5cdFx0aWYgXy5pc0FycmF5KHZhbHVlKSA9PSB0cnVlXG5cdFx0XHRpZiBvcHRpb24gPT0gXCI9XCJcblx0XHRcdFx0Xy5lYWNoIHZhbHVlLCAodiktPlxuXHRcdFx0XHRcdHN1Yl9zZWxlY3Rvci5wdXNoIFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiXG5cdFx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIjw+XCJcblx0XHRcdFx0Xy5lYWNoIHZhbHVlLCAodiktPlxuXHRcdFx0XHRcdHN1Yl9zZWxlY3Rvci5wdXNoIFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJhbmRcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRfLmVhY2ggdmFsdWUsICh2KS0+XG5cdFx0XHRcdFx0c3ViX3NlbGVjdG9yLnB1c2ggW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCJcblx0XHRcdGlmIHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT0gXCJhbmRcIiB8fCBzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09IFwib3JcIlxuXHRcdFx0XHRzdWJfc2VsZWN0b3IucG9wKClcblx0XHRlbHNlXG5cdFx0XHRzdWJfc2VsZWN0b3IgPSBbZmllbGQsIG9wdGlvbiwgdmFsdWVdXG5cdFx0Y29uc29sZS5sb2cgXCJzdWJfc2VsZWN0b3JcIiwgc3ViX3NlbGVjdG9yXG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHN1Yl9zZWxlY3Rvcilcblx0KVxuXHRmb3JtYXRfbG9naWMgPSBcIlsje2Zvcm1hdF9sb2dpY31dXCJcblx0cmV0dXJuIENyZWF0b3IuZXZhbChmb3JtYXRfbG9naWMpXG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cblx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBbXVxuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0aWYgIV9vYmplY3Rcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXNcblxuI1x0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKF9vYmplY3QucmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcblxuXHRyZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKF9vYmplY3QuX2NvbGxlY3Rpb25fbmFtZSlcblxuXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcblx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZXM/Lmxlbmd0aCA9PSAwXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzXG5cblx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHNcblxuXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZSByZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHNcblx0cmV0dXJuIF8uZmlsdGVyIHJlbGF0ZWRfb2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0KS0+XG5cdFx0cmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0Lm9iamVjdF9uYW1lXG5cdFx0aXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTFcblx0XHQjIHJlbGF0ZWRfb2JqZWN0X25hbWUgPSBpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY2ZzX2ZpbGVzX2ZpbGVyZWNvcmRcIiB0aGVuIFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIiBlbHNlIHJlbGF0ZWRfb2JqZWN0X25hbWVcblx0XHRhbGxvd1JlYWQgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk/LmFsbG93UmVhZFxuXHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0YWxsb3dSZWFkID0gYWxsb3dSZWFkICYmIHBlcm1pc3Npb25zLmFsbG93UmVhZEZpbGVzXG5cdFx0cmV0dXJuIGlzQWN0aXZlIGFuZCBhbGxvd1JlYWRcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0TmFtZXMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRyZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdHJldHVybiBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cyxcIm9iamVjdF9uYW1lXCIpXG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdExpc3RBY3Rpb25zID0gKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0YWN0aW9ucyA9IENyZWF0b3IuZ2V0QWN0aW9ucyhyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRhY3Rpb25zID0gXy5maWx0ZXIgYWN0aW9ucywgKGFjdGlvbiktPlxuXHRcdGlmIGFjdGlvbi5uYW1lID09IFwic3RhbmRhcmRfZm9sbG93XCJcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGlmIGFjdGlvbi5uYW1lID09IFwic3RhbmRhcmRfcXVlcnlcIlxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0aWYgYWN0aW9uLm9uID09IFwibGlzdFwiXG5cdFx0XHRpZiB0eXBlb2YgYWN0aW9uLnZpc2libGUgPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdHJldHVybiBhY3Rpb24udmlzaWJsZSgpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBhY3Rpb24udmlzaWJsZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBmYWxzZVxuXHRyZXR1cm4gYWN0aW9uc1xuXG5DcmVhdG9yLmdldEFjdGlvbnMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0aWYgIW9ialxuXHRcdHJldHVyblxuXG5cdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRkaXNhYmxlZF9hY3Rpb25zID0gcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9uc1xuXHRhY3Rpb25zID0gXy5zb3J0QnkoXy52YWx1ZXMob2JqLmFjdGlvbnMpICwgJ3NvcnQnKTtcblxuXHRpZiBfLmhhcyhvYmosICdhbGxvd19jdXN0b21BY3Rpb25zJylcblx0XHRhY3Rpb25zID0gXy5maWx0ZXIgYWN0aW9ucywgKGFjdGlvbiktPlxuXHRcdFx0cmV0dXJuIF8uaW5jbHVkZShvYmouYWxsb3dfY3VzdG9tQWN0aW9ucywgYWN0aW9uLm5hbWUpIHx8IF8uaW5jbHVkZShfLmtleXMoQ3JlYXRvci5nZXRPYmplY3QoJ2Jhc2UnKS5hY3Rpb25zKSB8fCB7fSwgYWN0aW9uLm5hbWUpXG5cdGlmIF8uaGFzKG9iaiwgJ2V4Y2x1ZGVfYWN0aW9ucycpXG5cdFx0YWN0aW9ucyA9IF8uZmlsdGVyIGFjdGlvbnMsIChhY3Rpb24pLT5cblx0XHRcdHJldHVybiAhXy5pbmNsdWRlKG9iai5leGNsdWRlX2FjdGlvbnMsIGFjdGlvbi5uYW1lKVxuXG5cdF8uZWFjaCBhY3Rpb25zLCAoYWN0aW9uKS0+XG5cdFx0IyDmiYvmnLrkuIrlj6rmmL7npLrnvJbovpHmjInpkq7vvIzlhbbku5bnmoTmlL7liLDmipjlj6DkuIvmi4noj5zljZXkuK1cblx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgJiYgW1wicmVjb3JkXCIsIFwicmVjb3JkX29ubHlcIl0uaW5kZXhPZihhY3Rpb24ub24pID4gLTEgJiYgYWN0aW9uLm5hbWUgIT0gJ3N0YW5kYXJkX2VkaXQnXG5cdFx0XHRpZiBhY3Rpb24ub24gPT0gXCJyZWNvcmRfb25seVwiXG5cdFx0XHRcdGFjdGlvbi5vbiA9ICdyZWNvcmRfb25seV9tb3JlJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRhY3Rpb24ub24gPSAncmVjb3JkX21vcmUnXG5cblx0aWYgU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcImNtc19maWxlc1wiLCBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJdLmluZGV4T2Yob2JqZWN0X25hbWUpID4gLTFcblx0XHQjIOmZhOS7tueJueauiuWkhOeQhu+8jOS4i+i9veaMiemSruaUvuWcqOS4u+iPnOWNle+8jOe8lui+keaMiemSruaUvuWIsOW6leS4i+aKmOWPoOS4i+aLieiPnOWNleS4rVxuXHRcdGFjdGlvbnMuZmluZCgobiktPiByZXR1cm4gbi5uYW1lID09IFwic3RhbmRhcmRfZWRpdFwiKT8ub24gPSBcInJlY29yZF9tb3JlXCJcblx0XHRhY3Rpb25zLmZpbmQoKG4pLT4gcmV0dXJuIG4ubmFtZSA9PSBcImRvd25sb2FkXCIpPy5vbiA9IFwicmVjb3JkXCJcblxuXHRhY3Rpb25zID0gXy5maWx0ZXIgYWN0aW9ucywgKGFjdGlvbiktPlxuXHRcdHJldHVybiBfLmluZGV4T2YoZGlzYWJsZWRfYWN0aW9ucywgYWN0aW9uLm5hbWUpIDwgMFxuXG5cdHJldHVybiBhY3Rpb25zXG5cbi8vL1xuXHTov5Tlm57lvZPliY3nlKjmiLfmnInmnYPpmZDorr/pl67nmoTmiYDmnIlsaXN0X3ZpZXfvvIzljIXmi6zliIbkuqvnmoTvvIznlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTvvIjpmaTpnZ5vd25lcuWPmOS6hu+8ie+8jOS7peWPium7mOiupOeahOWFtuS7luinhuWbvlxuXHTms6jmhI9DcmVhdG9yLmdldFBlcm1pc3Npb25z5Ye95pWw5Lit5piv5LiN5Lya5pyJ55So5oi36Ieq5a6a5LmJ6Z2e5YiG5Lqr55qE6KeG5Zu+55qE77yM5omA5LulQ3JlYXRvci5nZXRQZXJtaXNzaW9uc+WHveaVsOS4reaLv+WIsOeahOe7k+aenOS4jeWFqO+8jOW5tuS4jeaYr+W9k+WJjeeUqOaIt+iDveeci+WIsOaJgOacieinhuWbvlxuLy8vXG5DcmVhdG9yLmdldExpc3RWaWV3cyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblx0XG5cdHVubGVzcyBvYmplY3RfbmFtZVxuXHRcdHJldHVyblxuXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdGlmICFvYmplY3Rcblx0XHRyZXR1cm5cblxuXHRkaXNhYmxlZF9saXN0X3ZpZXdzID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8uZGlzYWJsZWRfbGlzdF92aWV3cyB8fCBbXVxuXG5cdGxpc3Rfdmlld3MgPSBbXVxuXG5cdGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpXG5cblx0Xy5lYWNoIG9iamVjdC5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aXRlbS5uYW1lID0gaXRlbV9uYW1lXG5cblx0bGlzdFZpZXdzID0gXy5zb3J0QnkoXy52YWx1ZXMob2JqZWN0Lmxpc3Rfdmlld3MpICwgJ3NvcnRfbm8nKTtcblxuXHRfLmVhY2ggbGlzdFZpZXdzLCAoaXRlbSktPlxuXHRcdGlmIGlzTW9iaWxlIGFuZCBpdGVtLnR5cGUgPT0gXCJjYWxlbmRhclwiXG5cdFx0XHQjIOaJi+acuuS4iuWFiOS4jeaYvuekuuaXpeWOhuinhuWbvlxuXHRcdFx0cmV0dXJuXG5cdFx0aWYgaXRlbS5uYW1lICAhPSBcImRlZmF1bHRcIlxuXHRcdFx0aXNEaXNhYmxlZCA9IF8uaW5kZXhPZihkaXNhYmxlZF9saXN0X3ZpZXdzLCBpdGVtLm5hbWUpID4gLTEgfHwgKGl0ZW0uX2lkICYmIF8uaW5kZXhPZihkaXNhYmxlZF9saXN0X3ZpZXdzLCBpdGVtLl9pZCkgPiAtMSlcblx0XHRcdGlmICFpc0Rpc2FibGVkIHx8IGl0ZW0ub3duZXIgPT0gdXNlcklkXG5cdFx0XHRcdGxpc3Rfdmlld3MucHVzaCBpdGVtXG5cdHJldHVybiBsaXN0X3ZpZXdzXG5cbiMg5YmN5Y+w55CG6K665LiK5LiN5bqU6K+l6LCD55So6K+l5Ye95pWw77yM5Zug5Li65a2X5q6155qE5p2D6ZmQ6YO95ZyoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpLmZpZWxkc+eahOebuOWFs+WxnuaAp+S4reacieagh+ivhuS6hlxuQ3JlYXRvci5nZXRGaWVsZHMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cblx0ZmllbGRzTmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZShvYmplY3RfbmFtZSlcblx0dW5yZWFkYWJsZV9maWVsZHMgPSAgQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8udW5yZWFkYWJsZV9maWVsZHNcblx0cmV0dXJuIF8uZGlmZmVyZW5jZShmaWVsZHNOYW1lLCB1bnJlYWRhYmxlX2ZpZWxkcylcblxuQ3JlYXRvci5pc2xvYWRpbmcgPSAoKS0+XG5cdHJldHVybiAhQ3JlYXRvci5ib290c3RyYXBMb2FkZWQuZ2V0KClcblxuQ3JlYXRvci5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IChzdHIpLT5cblx0cmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKVxuXG4jIOiuoeeul2ZpZWxkc+ebuOWFs+WHveaVsFxuIyBTVEFSVFxuQ3JlYXRvci5nZXREaXNhYmxlZEZpZWxkcyA9IChzY2hlbWEpLT5cblx0ZmllbGRzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQsIGZpZWxkTmFtZSkgLT5cblx0XHRyZXR1cm4gZmllbGQuYXV0b2Zvcm0gYW5kIGZpZWxkLmF1dG9mb3JtLmRpc2FibGVkIGFuZCAhZmllbGQuYXV0b2Zvcm0ub21pdCBhbmQgZmllbGROYW1lXG5cdClcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcblx0cmV0dXJuIGZpZWxkc1xuXG5DcmVhdG9yLmdldEhpZGRlbkZpZWxkcyA9IChzY2hlbWEpLT5cblx0ZmllbGRzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQsIGZpZWxkTmFtZSkgLT5cblx0XHRyZXR1cm4gZmllbGQuYXV0b2Zvcm0gYW5kIGZpZWxkLmF1dG9mb3JtLnR5cGUgPT0gXCJoaWRkZW5cIiBhbmQgIWZpZWxkLmF1dG9mb3JtLm9taXQgYW5kIGZpZWxkTmFtZVxuXHQpXG5cdGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpXG5cdHJldHVybiBmaWVsZHNcblxuQ3JlYXRvci5nZXRGaWVsZHNXaXRoTm9Hcm91cCA9IChzY2hlbWEpLT5cblx0ZmllbGRzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQsIGZpZWxkTmFtZSkgLT5cblx0XHRyZXR1cm4gKCFmaWVsZC5hdXRvZm9ybSBvciAhZmllbGQuYXV0b2Zvcm0uZ3JvdXAgb3IgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT0gXCItXCIpIGFuZCAoIWZpZWxkLmF1dG9mb3JtIG9yIGZpZWxkLmF1dG9mb3JtLnR5cGUgIT0gXCJoaWRkZW5cIikgYW5kIGZpZWxkTmFtZVxuXHQpXG5cdGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpXG5cdHJldHVybiBmaWVsZHNcblxuQ3JlYXRvci5nZXRTb3J0ZWRGaWVsZEdyb3VwTmFtZXMgPSAoc2NoZW1hKS0+XG5cdG5hbWVzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQpIC0+XG4gXHRcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgIT0gXCItXCIgYW5kIGZpZWxkLmF1dG9mb3JtLmdyb3VwXG5cdClcblx0bmFtZXMgPSBfLmNvbXBhY3QobmFtZXMpXG5cdG5hbWVzID0gXy51bmlxdWUobmFtZXMpXG5cdHJldHVybiBuYW1lc1xuXG5DcmVhdG9yLmdldEZpZWxkc0Zvckdyb3VwID0gKHNjaGVtYSwgZ3JvdXBOYW1lKSAtPlxuICBcdGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkLCBmaWVsZE5hbWUpIC0+XG4gICAgXHRyZXR1cm4gZmllbGQuYXV0b2Zvcm0gYW5kIGZpZWxkLmF1dG9mb3JtLmdyb3VwID09IGdyb3VwTmFtZSBhbmQgZmllbGQuYXV0b2Zvcm0udHlwZSAhPSBcImhpZGRlblwiIGFuZCBmaWVsZE5hbWVcbiAgXHQpXG4gIFx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcbiAgXHRyZXR1cm4gZmllbGRzXG5cbkNyZWF0b3IuZ2V0U3lzdGVtQmFzZUZpZWxkcyA9ICgpIC0+XG5cdHJldHVybiBbXCJjcmVhdGVkXCIsIFwiY3JlYXRlZF9ieVwiLCBcIm1vZGlmaWVkXCIsIFwibW9kaWZpZWRfYnlcIl1cblxuQ3JlYXRvci5nZXRGaWVsZHNXaXRob3V0U3lzdGVtQmFzZSA9IChrZXlzKSAtPlxuXHRyZXR1cm4gXy5kaWZmZXJlbmNlKGtleXMsIENyZWF0b3IuZ2V0U3lzdGVtQmFzZUZpZWxkcygpKTtcblxuQ3JlYXRvci5nZXRGaWVsZHNXaXRob3V0T21pdCA9IChzY2hlbWEsIGtleXMpIC0+XG5cdGtleXMgPSBfLm1hcChrZXlzLCAoa2V5KSAtPlxuXHRcdGZpZWxkID0gXy5waWNrKHNjaGVtYSwga2V5KVxuXHRcdGlmIGZpZWxkW2tleV0uYXV0b2Zvcm0/Lm9taXRcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBrZXlcblx0KVxuXHRrZXlzID0gXy5jb21wYWN0KGtleXMpXG5cdHJldHVybiBrZXlzXG5cbkNyZWF0b3IuZ2V0RmllbGRzSW5GaXJzdExldmVsID0gKGZpcnN0TGV2ZWxLZXlzLCBrZXlzKSAtPlxuXHRrZXlzID0gXy5tYXAoa2V5cywgKGtleSkgLT5cblx0XHRpZiBfLmluZGV4T2YoZmlyc3RMZXZlbEtleXMsIGtleSkgPiAtMVxuXHRcdFx0cmV0dXJuIGtleVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBmYWxzZVxuXHQpXG5cdGtleXMgPSBfLmNvbXBhY3Qoa2V5cylcblx0cmV0dXJuIGtleXNcblxuQ3JlYXRvci5nZXRGaWVsZHNGb3JSZW9yZGVyID0gKHNjaGVtYSwga2V5cywgaXNTaW5nbGUpIC0+XG5cdGZpZWxkcyA9IFtdXG5cdGkgPSAwXG5cdF9rZXlzID0gXy5maWx0ZXIoa2V5cywgKGtleSktPlxuXHRcdHJldHVybiAha2V5LmVuZHNXaXRoKCdfZW5kTGluZScpXG5cdCk7XG5cdHdoaWxlIGkgPCBfa2V5cy5sZW5ndGhcblx0XHRzY18xID0gXy5waWNrKHNjaGVtYSwgX2tleXNbaV0pXG5cdFx0c2NfMiA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2krMV0pXG5cblx0XHRpc193aWRlXzEgPSBmYWxzZVxuXHRcdGlzX3dpZGVfMiA9IGZhbHNlXG5cbiNcdFx0aXNfcmFuZ2VfMSA9IGZhbHNlXG4jXHRcdGlzX3JhbmdlXzIgPSBmYWxzZVxuXG5cdFx0Xy5lYWNoIHNjXzEsICh2YWx1ZSkgLT5cblx0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc193aWRlIHx8IHZhbHVlLmF1dG9mb3JtPy50eXBlID09IFwidGFibGVcIlxuXHRcdFx0XHRpc193aWRlXzEgPSB0cnVlXG5cbiNcdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfcmFuZ2VcbiNcdFx0XHRcdGlzX3JhbmdlXzEgPSB0cnVlXG5cblx0XHRfLmVhY2ggc2NfMiwgKHZhbHVlKSAtPlxuXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3dpZGUgfHwgdmFsdWUuYXV0b2Zvcm0/LnR5cGUgPT0gXCJ0YWJsZVwiXG5cdFx0XHRcdGlzX3dpZGVfMiA9IHRydWVcblxuI1x0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc19yYW5nZVxuI1x0XHRcdFx0aXNfcmFuZ2VfMiA9IHRydWVcblxuXHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0aXNfd2lkZV8xID0gdHJ1ZVxuXHRcdFx0aXNfd2lkZV8yID0gdHJ1ZVxuXG5cdFx0aWYgaXNTaW5nbGVcblx0XHRcdGZpZWxkcy5wdXNoIF9rZXlzLnNsaWNlKGksIGkrMSlcblx0XHRcdGkgKz0gMVxuXHRcdGVsc2VcbiNcdFx0XHRpZiAhaXNfcmFuZ2VfMSAmJiBpc19yYW5nZV8yXG4jXHRcdFx0XHRjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpKzEpXG4jXHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcbiNcdFx0XHRcdGZpZWxkcy5wdXNoIGNoaWxkS2V5c1xuI1x0XHRcdFx0aSArPSAxXG4jXHRcdFx0ZWxzZVxuXHRcdFx0aWYgaXNfd2lkZV8xXG5cdFx0XHRcdGZpZWxkcy5wdXNoIF9rZXlzLnNsaWNlKGksIGkrMSlcblx0XHRcdFx0aSArPSAxXG5cdFx0XHRlbHNlIGlmICFpc193aWRlXzEgYW5kIGlzX3dpZGVfMlxuXHRcdFx0XHRjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpKzEpXG5cdFx0XHRcdGNoaWxkS2V5cy5wdXNoIHVuZGVmaW5lZFxuXHRcdFx0XHRmaWVsZHMucHVzaCBjaGlsZEtleXNcblx0XHRcdFx0aSArPSAxXG5cdFx0XHRlbHNlIGlmICFpc193aWRlXzEgYW5kICFpc193aWRlXzJcblx0XHRcdFx0Y2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSsxKVxuXHRcdFx0XHRpZiBfa2V5c1tpKzFdXG5cdFx0XHRcdFx0Y2hpbGRLZXlzLnB1c2ggX2tleXNbaSsxXVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0Y2hpbGRLZXlzLnB1c2ggdW5kZWZpbmVkXG5cdFx0XHRcdGZpZWxkcy5wdXNoIGNoaWxkS2V5c1xuXHRcdFx0XHRpICs9IDJcblxuXHRyZXR1cm4gZmllbGRzXG5cbkNyZWF0b3IuaXNGaWx0ZXJWYWx1ZUVtcHR5ID0gKHYpIC0+XG5cdHJldHVybiB0eXBlb2YgdiA9PSBcInVuZGVmaW5lZFwiIHx8IHYgPT0gbnVsbCB8fCBOdW1iZXIuaXNOYU4odikgfHwgdi5sZW5ndGggPT0gMFxuXG5DcmVhdG9yLmdldEZpZWxkRGF0YVR5cGUgPSAob2JqZWN0RmllbGRzLCBrZXkpLT5cblx0aWYgb2JqZWN0RmllbGRzIGFuZCBrZXlcblx0XHRyZXN1bHQgPSBvYmplY3RGaWVsZHNba2V5XT8udHlwZVxuXHRcdGlmIFtcImZvcm11bGFcIiwgXCJzdW1tYXJ5XCJdLmluZGV4T2YocmVzdWx0KSA+IC0xXG5cdFx0XHRyZXN1bHQgPSBvYmplY3RGaWVsZHNba2V5XS5kYXRhX3R5cGVcblx0XHQjIGVsc2UgaWYgcmVzdWx0ID09IFwic2VsZWN0XCIgYW5kIG9iamVjdEZpZWxkc1trZXldPy5kYXRhX3R5cGUgYW5kIG9iamVjdEZpZWxkc1trZXldLmRhdGFfdHlwZSAhPSBcInRleHRcIlxuXHRcdCMgXHRyZXN1bHQgPSBvYmplY3RGaWVsZHNba2V5XS5kYXRhX3R5cGVcblx0XHRyZXR1cm4gcmVzdWx0XG5cdGVsc2Vcblx0XHRyZXR1cm4gXCJ0ZXh0XCJcblxuIyBFTkRcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdENyZWF0b3IuZ2V0QWxsUmVsYXRlZE9iamVjdHMgPSAob2JqZWN0X25hbWUpLT5cblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdXG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XG5cdFx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3QuZmllbGRzLCAocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKS0+XG5cdFx0XHRcdGlmIHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lXG5cdFx0XHRcdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMucHVzaCByZWxhdGVkX29iamVjdF9uYW1lXG5cblx0XHRpZiBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZW5hYmxlX2ZpbGVzXG5cdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoIFwiY21zX2ZpbGVzXCJcblxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lc1xuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0U3RlZWRvcy5mb3JtYXRJbmRleCA9IChhcnJheSkgLT5cblx0XHRvYmplY3QgPSB7XG4gICAgICAgIFx0YmFja2dyb3VuZDogdHJ1ZVxuICAgIFx0fTtcblx0XHRpc2RvY3VtZW50REIgPSBNZXRlb3Iuc2V0dGluZ3M/LmRhdGFzb3VyY2VzPy5kZWZhdWx0Py5kb2N1bWVudERCIHx8IGZhbHNlO1xuXHRcdGlmIGlzZG9jdW1lbnREQlxuXHRcdFx0aWYgYXJyYXkubGVuZ3RoID4gMFxuXHRcdFx0XHRpbmRleE5hbWUgPSBhcnJheS5qb2luKFwiLlwiKTtcblx0XHRcdFx0b2JqZWN0Lm5hbWUgPSBpbmRleE5hbWU7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoaW5kZXhOYW1lLmxlbmd0aCA+IDUyKVxuXHRcdFx0XHRcdG9iamVjdC5uYW1lID0gaW5kZXhOYW1lLnN1YnN0cmluZygwLDUyKTtcblxuXHRcdHJldHVybiBvYmplY3Q7IiwiQ3JlYXRvci5nZXRTY2hlbWEgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5zY2hlbWEgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICByZXR1cm4gZmFsc2U7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkge1xuICB2YXIgbGlzdF92aWV3LCBsaXN0X3ZpZXdfaWQ7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKTtcbiAgbGlzdF92aWV3X2lkID0gbGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcuX2lkIDogdm9pZCAwO1xuICBpZiAocmVjb3JkX2lkKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQpO1xuICB9IGVsc2Uge1xuICAgIGlmIChDcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQob2JqZWN0X25hbWUpKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGxpc3Rfdmlld19pZCkge1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0QWJzb2x1dGVVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIHtcbiAgdmFyIGxpc3RfdmlldywgbGlzdF92aWV3X2lkO1xuICBpZiAoIWFwcF9pZCkge1xuICAgIGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICB9XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgbGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbCk7XG4gIGxpc3Rfdmlld19pZCA9IGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Ll9pZCA6IHZvaWQgMDtcbiAgaWYgKHJlY29yZF9pZCkge1xuICAgIHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkX2lkLCB0cnVlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCwgdHJ1ZSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0Um91dGVyVXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSB7XG4gIHZhciBsaXN0X3ZpZXcsIGxpc3Rfdmlld19pZDtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpO1xuICBsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5faWQgOiB2b2lkIDA7XG4gIGlmIChyZWNvcmRfaWQpIHtcbiAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldExpc3RWaWV3VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSB7XG4gIHZhciB1cmw7XG4gIHVybCA9IENyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpO1xuICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCh1cmwpO1xufTtcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSB7XG4gIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZDtcbn07XG5cbkNyZWF0b3IuZ2V0U3dpdGNoTGlzdFVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkge1xuICBpZiAobGlzdF92aWV3X2lkKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgbGlzdF92aWV3X2lkICsgXCIvbGlzdFwiKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvbGlzdC9zd2l0Y2hcIik7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdFVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIHJlY29yZF9pZCwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gIGlmIChyZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyByZWNvcmRfaWQgKyBcIi9cIiArIHJlbGF0ZWRfb2JqZWN0X25hbWUgKyBcIi9ncmlkP3JlbGF0ZWRfZmllbGRfbmFtZT1cIiArIHJlbGF0ZWRfZmllbGRfbmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgcmVjb3JkX2lkICsgXCIvXCIgKyByZWxhdGVkX29iamVjdF9uYW1lICsgXCIvZ3JpZFwiKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgaXNfZGVlcCwgaXNfc2tpcF9oaWRlLCBpc19yZWxhdGVkKSB7XG4gIHZhciBfb2JqZWN0LCBfb3B0aW9ucywgZmllbGRzLCBpY29uLCByZWxhdGVkT2JqZWN0cztcbiAgX29wdGlvbnMgPSBbXTtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfb3B0aW9ucztcbiAgfVxuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgaWNvbiA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMDtcbiAgXy5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZiwgaykge1xuICAgIGlmIChpc19za2lwX2hpZGUgJiYgZi5oaWRkZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGYudHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICBsYWJlbDogXCJcIiArIChmLmxhYmVsIHx8IGspLFxuICAgICAgICB2YWx1ZTogXCJcIiArIGssXG4gICAgICAgIGljb246IGljb25cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgIGxhYmVsOiBmLmxhYmVsIHx8IGssXG4gICAgICAgIHZhbHVlOiBrLFxuICAgICAgICBpY29uOiBpY29uXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBpZiAoaXNfZGVlcCkge1xuICAgIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICAgIHZhciByX29iamVjdDtcbiAgICAgIGlmIChpc19za2lwX2hpZGUgJiYgZi5oaWRkZW4pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKChmLnR5cGUgPT09IFwibG9va3VwXCIgfHwgZi50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikgJiYgZi5yZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhmLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgcl9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChmLnJlZmVyZW5jZV90byk7XG4gICAgICAgIGlmIChyX29iamVjdCkge1xuICAgICAgICAgIHJldHVybiBfLmZvckVhY2gocl9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihmMiwgazIpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgbGFiZWw6IChmLmxhYmVsIHx8IGspICsgXCI9PlwiICsgKGYyLmxhYmVsIHx8IGsyKSxcbiAgICAgICAgICAgICAgdmFsdWU6IGsgKyBcIi5cIiArIGsyLFxuICAgICAgICAgICAgICBpY29uOiByX29iamVjdCAhPSBudWxsID8gcl9vYmplY3QuaWNvbiA6IHZvaWQgMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpZiAoaXNfcmVsYXRlZCkge1xuICAgIHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSk7XG4gICAgXy5lYWNoKHJlbGF0ZWRPYmplY3RzLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihfcmVsYXRlZE9iamVjdCkge1xuICAgICAgICB2YXIgcmVsYXRlZE9iamVjdCwgcmVsYXRlZE9wdGlvbnM7XG4gICAgICAgIHJlbGF0ZWRPcHRpb25zID0gQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMoX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICByZWxhdGVkT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUpO1xuICAgICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRPcHRpb25zLCBmdW5jdGlvbihyZWxhdGVkT3B0aW9uKSB7XG4gICAgICAgICAgaWYgKF9yZWxhdGVkT2JqZWN0LmZvcmVpZ25fa2V5ICE9PSByZWxhdGVkT3B0aW9uLnZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiAocmVsYXRlZE9iamVjdC5sYWJlbCB8fCByZWxhdGVkT2JqZWN0Lm5hbWUpICsgXCI9PlwiICsgcmVsYXRlZE9wdGlvbi5sYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHJlbGF0ZWRPYmplY3QubmFtZSArIFwiLlwiICsgcmVsYXRlZE9wdGlvbi52YWx1ZSxcbiAgICAgICAgICAgICAgaWNvbjogcmVsYXRlZE9iamVjdCAhPSBudWxsID8gcmVsYXRlZE9iamVjdC5pY29uIDogdm9pZCAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH1cbiAgcmV0dXJuIF9vcHRpb25zO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RGaWx0ZXJGaWVsZE9wdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgX29wdGlvbnMsIGZpZWxkcywgaWNvbiwgcGVybWlzc2lvbl9maWVsZHM7XG4gIF9vcHRpb25zID0gW107XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gX29wdGlvbnM7XG4gIH1cbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpO1xuICBpY29uID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwO1xuICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgaWYgKCFfLmluY2x1ZGUoW1wiZ3JpZFwiLCBcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJhdmF0YXJcIiwgXCJpbWFnZVwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKSAmJiAhZi5oaWRkZW4pIHtcbiAgICAgIGlmICghL1xcdytcXC4vLnRlc3QoaykgJiYgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICBsYWJlbDogZi5sYWJlbCB8fCBrLFxuICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgIGljb246IGljb25cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIF9vcHRpb25zO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZE9wdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgX29wdGlvbnMsIGZpZWxkcywgaWNvbiwgcGVybWlzc2lvbl9maWVsZHM7XG4gIF9vcHRpb25zID0gW107XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gX29wdGlvbnM7XG4gIH1cbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpO1xuICBpY29uID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwO1xuICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgaWYgKCFfLmluY2x1ZGUoW1wiZ3JpZFwiLCBcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSkpIHtcbiAgICAgIGlmICghL1xcdytcXC4vLnRlc3QoaykgJiYgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICBsYWJlbDogZi5sYWJlbCB8fCBrLFxuICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgIGljb246IGljb25cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIF9vcHRpb25zO1xufTtcblxuXG4vKlxuZmlsdGVyczog6KaB6L2s5o2i55qEZmlsdGVyc1xuZmllbGRzOiDlr7nosaHlrZfmrrVcbmZpbHRlcl9maWVsZHM6IOm7mOiupOi/h+a7pOWtl+aute+8jOaUr+aMgeWtl+espuS4suaVsOe7hOWSjOWvueixoeaVsOe7hOS4pOenjeagvOW8j++8jOWmgjpbJ2ZpbGVkX25hbWUxJywnZmlsZWRfbmFtZTInXSxbe2ZpZWxkOidmaWxlZF9uYW1lMScscmVxdWlyZWQ6dHJ1ZX1dXG7lpITnkIbpgLvovpE6IOaKimZpbHRlcnPkuK3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25aKe5Yqg5q+P6aG555qEaXNfZGVmYXVsdOOAgWlzX3JlcXVpcmVk5bGe5oCn77yM5LiN5a2Y5Zyo5LqOZmlsdGVyX2ZpZWxkc+eahOi/h+a7pOadoeS7tuWvueW6lOeahOenu+mZpOavj+mhueeahOebuOWFs+WxnuaAp1xu6L+U5Zue57uT5p6cOiDlpITnkIblkI7nmoRmaWx0ZXJzXG4gKi9cblxuQ3JlYXRvci5nZXRGaWx0ZXJzV2l0aEZpbHRlckZpZWxkcyA9IGZ1bmN0aW9uKGZpbHRlcnMsIGZpZWxkcywgZmlsdGVyX2ZpZWxkcykge1xuICBpZiAoIWZpbHRlcnMpIHtcbiAgICBmaWx0ZXJzID0gW107XG4gIH1cbiAgaWYgKCFmaWx0ZXJfZmllbGRzKSB7XG4gICAgZmlsdGVyX2ZpZWxkcyA9IFtdO1xuICB9XG4gIGlmIChmaWx0ZXJfZmllbGRzICE9IG51bGwgPyBmaWx0ZXJfZmllbGRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgIGZpbHRlcl9maWVsZHMuZm9yRWFjaChmdW5jdGlvbihuKSB7XG4gICAgICBpZiAoXy5pc1N0cmluZyhuKSkge1xuICAgICAgICBuID0ge1xuICAgICAgICAgIGZpZWxkOiBuLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKGZpZWxkc1tuLmZpZWxkXSAmJiAhXy5maW5kV2hlcmUoZmlsdGVycywge1xuICAgICAgICBmaWVsZDogbi5maWVsZFxuICAgICAgfSkpIHtcbiAgICAgICAgcmV0dXJuIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgZmllbGQ6IG4uZmllbGQsXG4gICAgICAgICAgaXNfZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICBpc19yZXF1aXJlZDogbi5yZXF1aXJlZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBmaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24oZmlsdGVySXRlbSkge1xuICAgIHZhciBtYXRjaEZpZWxkO1xuICAgIG1hdGNoRmllbGQgPSBmaWx0ZXJfZmllbGRzLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4gPT09IGZpbHRlckl0ZW0uZmllbGQgfHwgbi5maWVsZCA9PT0gZmlsdGVySXRlbS5maWVsZDtcbiAgICB9KTtcbiAgICBpZiAoXy5pc1N0cmluZyhtYXRjaEZpZWxkKSkge1xuICAgICAgbWF0Y2hGaWVsZCA9IHtcbiAgICAgICAgZmllbGQ6IG1hdGNoRmllbGQsXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKG1hdGNoRmllbGQpIHtcbiAgICAgIGZpbHRlckl0ZW0uaXNfZGVmYXVsdCA9IHRydWU7XG4gICAgICByZXR1cm4gZmlsdGVySXRlbS5pc19yZXF1aXJlZCA9IG1hdGNoRmllbGQucmVxdWlyZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBmaWx0ZXJJdGVtLmlzX2RlZmF1bHQ7XG4gICAgICByZXR1cm4gZGVsZXRlIGZpbHRlckl0ZW0uaXNfcmVxdWlyZWQ7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZpbHRlcnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZCkge1xuICB2YXIgY29sbGVjdGlvbiwgb2JqLCByZWNvcmQsIHJlZiwgcmVmMSwgcmVmMjtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAoIXJlY29yZF9pZCkge1xuICAgIHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikgJiYgcmVjb3JkX2lkID09PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSkge1xuICAgICAgaWYgKChyZWYgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpKSAhPSBudWxsID8gcmVmLnJlY29yZCA6IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gKHJlZjEgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLnJlY29yZCkgIT0gbnVsbCA/IHJlZjIuZ2V0KCkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpO1xuICAgIH1cbiAgfVxuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmIChvYmouZGF0YWJhc2VfbmFtZSA9PT0gXCJtZXRlb3JcIiB8fCAhb2JqLmRhdGFiYXNlX25hbWUpIHtcbiAgICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKTtcbiAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgcmVjb3JkID0gY29sbGVjdGlvbi5maW5kT25lKHJlY29yZF9pZCk7XG4gICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cbiAgfSBlbHNlIGlmIChvYmplY3RfbmFtZSAmJiByZWNvcmRfaWQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSZWNvcmROYW1lID0gZnVuY3Rpb24ocmVjb3JkLCBvYmplY3RfbmFtZSkge1xuICB2YXIgbmFtZV9maWVsZF9rZXksIHJlZjtcbiAgaWYgKCFyZWNvcmQpIHtcbiAgICByZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpO1xuICB9XG4gIGlmIChyZWNvcmQpIHtcbiAgICBuYW1lX2ZpZWxkX2tleSA9IG9iamVjdF9uYW1lID09PSBcIm9yZ2FuaXphdGlvbnNcIiA/IFwibmFtZVwiIDogKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5OQU1FX0ZJRUxEX0tFWSA6IHZvaWQgMDtcbiAgICBpZiAocmVjb3JkICYmIG5hbWVfZmllbGRfa2V5KSB7XG4gICAgICByZXR1cm4gcmVjb3JkLmxhYmVsIHx8IHJlY29yZFtuYW1lX2ZpZWxkX2tleV07XG4gICAgfVxuICB9XG59O1xuXG5DcmVhdG9yLmdldEFwcCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwLCByZWYsIHJlZjE7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgYXBwID0gQ3JlYXRvci5BcHBzW2FwcF9pZF07XG4gIGlmICgocmVmID0gQ3JlYXRvci5kZXBzKSAhPSBudWxsKSB7XG4gICAgaWYgKChyZWYxID0gcmVmLmFwcCkgIT0gbnVsbCkge1xuICAgICAgcmVmMS5kZXBlbmQoKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFwcDtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIGRhc2hib2FyZDtcbiAgYXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKTtcbiAgaWYgKCFhcHApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZGFzaGJvYXJkID0gbnVsbDtcbiAgXy5lYWNoKENyZWF0b3IuRGFzaGJvYXJkcywgZnVuY3Rpb24odiwgaykge1xuICAgIHZhciByZWY7XG4gICAgaWYgKCgocmVmID0gdi5hcHBzKSAhPSBudWxsID8gcmVmLmluZGV4T2YoYXBwLl9pZCkgOiB2b2lkIDApID4gLTEpIHtcbiAgICAgIHJldHVybiBkYXNoYm9hcmQgPSB2O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkYXNoYm9hcmQ7XG59O1xuXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZENvbXBvbmVudCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCB8fCB0cnVlKSB7XG5cbiAgfVxufTtcblxuQ3JlYXRvci5nZXRBcHBPYmplY3ROYW1lcyA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwLCBhcHBPYmplY3RzLCBpc01vYmlsZSwgb2JqZWN0cztcbiAgYXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKTtcbiAgaWYgKCFhcHApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKCk7XG4gIGFwcE9iamVjdHMgPSBpc01vYmlsZSA/IGFwcC5tb2JpbGVfb2JqZWN0cyA6IGFwcC5vYmplY3RzO1xuICBvYmplY3RzID0gW107XG4gIGlmIChhcHApIHtcbiAgICBfLmVhY2goYXBwT2JqZWN0cywgZnVuY3Rpb24odikge1xuICAgICAgdmFyIG9iajtcbiAgICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KHYpO1xuICAgICAgaWYgKG9iaiAhPSBudWxsID8gb2JqLnBlcm1pc3Npb25zLmdldCgpLmFsbG93UmVhZCA6IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0cy5wdXNoKHYpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3RzO1xufTtcblxuQ3JlYXRvci5nZXRVcmxXaXRoVG9rZW4gPSBmdW5jdGlvbih1cmwsIGV4cHJlc3Npb25Gb3JtRGF0YSkge1xuICB2YXIgaGFzUXVlcnlTeW1ib2wsIGxpbmtTdHIsIHBhcmFtcztcbiAgcGFyYW1zID0ge307XG4gIHBhcmFtc1tcIlgtU3BhY2UtSWRcIl0gPSBTdGVlZG9zLnNwYWNlSWQoKTtcbiAgcGFyYW1zW1wiWC1Vc2VyLUlkXCJdID0gU3RlZWRvcy51c2VySWQoKTtcbiAgcGFyYW1zW1wiWC1Db21wYW55LUlkc1wiXSA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKTtcbiAgcGFyYW1zW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcbiAgaWYgKFN0ZWVkb3MuaXNFeHByZXNzaW9uKHVybCkpIHtcbiAgICB1cmwgPSBTdGVlZG9zLnBhcnNlU2luZ2xlRXhwcmVzc2lvbih1cmwsIGV4cHJlc3Npb25Gb3JtRGF0YSwgXCIjXCIsIENyZWF0b3IuVVNFUl9DT05URVhUKTtcbiAgfVxuICBoYXNRdWVyeVN5bWJvbCA9IC8oXFwjLitcXD8pfChcXD9bXiNdKiQpL2cudGVzdCh1cmwpO1xuICBsaW5rU3RyID0gaGFzUXVlcnlTeW1ib2wgPyBcIiZcIiA6IFwiP1wiO1xuICByZXR1cm4gXCJcIiArIHVybCArIGxpbmtTdHIgKyAoJC5wYXJhbShwYXJhbXMpKTtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwTWVudSA9IGZ1bmN0aW9uKGFwcF9pZCwgbWVudV9pZCkge1xuICB2YXIgbWVudXM7XG4gIG1lbnVzID0gQ3JlYXRvci5nZXRBcHBNZW51cyhhcHBfaWQpO1xuICByZXR1cm4gbWVudXMgJiYgbWVudXMuZmluZChmdW5jdGlvbihtZW51KSB7XG4gICAgcmV0dXJuIG1lbnUuaWQgPT09IG1lbnVfaWQ7XG4gIH0pO1xufTtcblxuQ3JlYXRvci5nZXRBcHBNZW51VXJsRm9ySW50ZXJuZXQgPSBmdW5jdGlvbihtZW51KSB7XG4gIHJldHVybiBDcmVhdG9yLmdldFVybFdpdGhUb2tlbihtZW51LnBhdGgsIG1lbnUpO1xufTtcblxuQ3JlYXRvci5nZXRBcHBNZW51VXJsID0gZnVuY3Rpb24obWVudSkge1xuICB2YXIgdXJsO1xuICB1cmwgPSBtZW51LnBhdGg7XG4gIGlmIChtZW51LnR5cGUgPT09IFwidXJsXCIpIHtcbiAgICBpZiAobWVudS50YXJnZXQpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldEFwcE1lbnVVcmxGb3JJbnRlcm5ldChtZW51KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiL2FwcC8tL3RhYl9pZnJhbWUvXCIgKyBtZW51LmlkO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbWVudS5wYXRoO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEFwcE1lbnVzID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIGFwcE1lbnVzLCBjdXJlbnRBcHBNZW51cztcbiAgYXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKTtcbiAgaWYgKCFhcHApIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgYXBwTWVudXMgPSBTZXNzaW9uLmdldChcImFwcF9tZW51c1wiKTtcbiAgaWYgKCFhcHBNZW51cykge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBjdXJlbnRBcHBNZW51cyA9IGFwcE1lbnVzLmZpbmQoZnVuY3Rpb24obWVudUl0ZW0pIHtcbiAgICByZXR1cm4gbWVudUl0ZW0uaWQgPT09IGFwcC5faWQ7XG4gIH0pO1xuICBpZiAoY3VyZW50QXBwTWVudXMpIHtcbiAgICByZXR1cm4gY3VyZW50QXBwTWVudXMuY2hpbGRyZW47XG4gIH1cbn07XG5cbkNyZWF0b3IubG9hZEFwcHNNZW51cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGF0YSwgaXNNb2JpbGUsIG9wdGlvbnM7XG4gIGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpO1xuICBkYXRhID0ge307XG4gIGlmIChpc01vYmlsZSkge1xuICAgIGRhdGEubW9iaWxlID0gaXNNb2JpbGU7XG4gIH1cbiAgb3B0aW9ucyA9IHtcbiAgICB0eXBlOiAnZ2V0JyxcbiAgICBkYXRhOiBkYXRhLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiBTZXNzaW9uLnNldChcImFwcF9tZW51c1wiLCBkYXRhKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBTdGVlZG9zLmF1dGhSZXF1ZXN0KFwiL3NlcnZpY2UvYXBpL2FwcHMvbWVudXNcIiwgb3B0aW9ucyk7XG59O1xuXG5DcmVhdG9yLmNyZWF0b3JBcHBzU2VsZWN0b3IgPSBmdW5jdGlvbihhcHBzLCBhc3NpZ25lZF9hcHBzKSB7XG4gIHZhciBhZG1pbkFwcCwgY3JlYXRvckFwcHMsIHNvcnRlZEFwcHM7XG4gIGFkbWluQXBwID0gdm9pZCAwO1xuICBzb3J0ZWRBcHBzID0gdm9pZCAwO1xuICBfLmVhY2goYXBwcywgZnVuY3Rpb24oYXBwLCBrZXkpIHtcbiAgICBpZiAoIWFwcC5faWQpIHtcbiAgICAgIGFwcC5faWQgPSBrZXk7XG4gICAgfVxuICAgIGlmIChhcHAuaXNfY3JlYXRvcikge1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGFwcC52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuICB9KTtcbiAgc29ydGVkQXBwcyA9IF8uc29ydEJ5KF8udmFsdWVzKGFwcHMpLCAnc29ydCcpO1xuICBjcmVhdG9yQXBwcyA9IHt9O1xuICBhZG1pbkFwcCA9IHt9O1xuICBfLmVhY2goc29ydGVkQXBwcywgZnVuY3Rpb24obikge1xuICAgIGlmIChuLl9pZCA9PT0gJ2FkbWluJykge1xuICAgICAgcmV0dXJuIGFkbWluQXBwID0gbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNyZWF0b3JBcHBzW24uX2lkXSA9IG47XG4gICAgfVxuICB9KTtcbiAgY3JlYXRvckFwcHMuYWRtaW4gPSBhZG1pbkFwcDtcbiAgaWYgKGFzc2lnbmVkX2FwcHMubGVuZ3RoKSB7XG4gICAgXy5lYWNoKGNyZWF0b3JBcHBzLCBmdW5jdGlvbihhcHAsIGtleSkge1xuICAgICAgaWYgKGFzc2lnbmVkX2FwcHMuaW5kZXhPZihrZXkpID4gLTEpIHtcbiAgICAgICAgYXBwLnZpc2libGUgPSBhcHAuaXNfY3JlYXRvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcC52aXNpYmxlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGNyZWF0b3JBcHBzO1xufTtcblxuQ3JlYXRvci52aXNpYmxlQXBwc1NlbGVjdG9yID0gZnVuY3Rpb24oY3JlYXRvckFwcHMsIGluY2x1ZGVBZG1pbikge1xuICB2YXIgYXBwcztcbiAgaWYgKGluY2x1ZGVBZG1pbiA9PSBudWxsKSB7XG4gICAgaW5jbHVkZUFkbWluID0gdHJ1ZTtcbiAgfVxuICBhcHBzID0gW107XG4gIF8uZWFjaChjcmVhdG9yQXBwcywgZnVuY3Rpb24odiwgaykge1xuICAgIGlmICh2LnZpc2libGUgIT09IGZhbHNlICYmIHYuX2lkICE9PSAnYWRtaW4nIHx8IGluY2x1ZGVBZG1pbiAmJiB2Ll9pZCA9PT0gJ2FkbWluJykge1xuICAgICAgYXBwcy5wdXNoKHYpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhcHBzO1xufTtcblxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwcyA9IGZ1bmN0aW9uKGluY2x1ZGVBZG1pbikge1xuICB2YXIgY2hhbmdlQXBwLCBjcmVhdG9yQXBwcztcbiAgY2hhbmdlQXBwID0gQ3JlYXRvci5fc3ViQXBwLmdldCgpO1xuICBjcmVhdG9yQXBwcyA9IE9iamVjdC5hc3NpZ24oe30sIENyZWF0b3IuQXBwcywge1xuICAgIGFwcHM6IGNoYW5nZUFwcFxuICB9KTtcbiAgcmV0dXJuIENyZWF0b3IudmlzaWJsZUFwcHNTZWxlY3RvcihjcmVhdG9yQXBwcywgaW5jbHVkZUFkbWluKTtcbn07XG5cbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHNPYmplY3RzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBhcHBzLCBvYmplY3RzLCB2aXNpYmxlT2JqZWN0TmFtZXM7XG4gIGFwcHMgPSBDcmVhdG9yLmdldFZpc2libGVBcHBzKCk7XG4gIHZpc2libGVPYmplY3ROYW1lcyA9IF8uZmxhdHRlbihfLnBsdWNrKGFwcHMsICdvYmplY3RzJykpO1xuICBvYmplY3RzID0gXy5maWx0ZXIoQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAodmlzaWJsZU9iamVjdE5hbWVzLmluZGV4T2Yob2JqLm5hbWUpIDwgMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICBvYmplY3RzID0gb2JqZWN0cy5zb3J0KENyZWF0b3Iuc29ydGluZ01ldGhvZC5iaW5kKHtcbiAgICBrZXk6IFwibGFiZWxcIlxuICB9KSk7XG4gIG9iamVjdHMgPSBfLnBsdWNrKG9iamVjdHMsICduYW1lJyk7XG4gIHJldHVybiBfLnVuaXEob2JqZWN0cyk7XG59O1xuXG5DcmVhdG9yLmdldEFwcHNPYmplY3RzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBvYmplY3RzLCB0ZW1wT2JqZWN0cztcbiAgb2JqZWN0cyA9IFtdO1xuICB0ZW1wT2JqZWN0cyA9IFtdO1xuICBfLmZvckVhY2goQ3JlYXRvci5BcHBzLCBmdW5jdGlvbihhcHApIHtcbiAgICB0ZW1wT2JqZWN0cyA9IF8uZmlsdGVyKGFwcC5vYmplY3RzLCBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiAhb2JqLmhpZGRlbjtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqZWN0cyA9IG9iamVjdHMuY29uY2F0KHRlbXBPYmplY3RzKTtcbiAgfSk7XG4gIHJldHVybiBfLnVuaXEob2JqZWN0cyk7XG59O1xuXG5DcmVhdG9yLnZhbGlkYXRlRmlsdGVycyA9IGZ1bmN0aW9uKGZpbHRlcnMsIGxvZ2ljKSB7XG4gIHZhciBlLCBlcnJvck1zZywgZmlsdGVyX2l0ZW1zLCBmaWx0ZXJfbGVuZ3RoLCBmbGFnLCBpbmRleCwgd29yZDtcbiAgZmlsdGVyX2l0ZW1zID0gXy5tYXAoZmlsdGVycywgZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKF8uaXNFbXB0eShvYmopKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICB9KTtcbiAgZmlsdGVyX2l0ZW1zID0gXy5jb21wYWN0KGZpbHRlcl9pdGVtcyk7XG4gIGVycm9yTXNnID0gXCJcIjtcbiAgZmlsdGVyX2xlbmd0aCA9IGZpbHRlcl9pdGVtcy5sZW5ndGg7XG4gIGlmIChsb2dpYykge1xuICAgIGxvZ2ljID0gbG9naWMucmVwbGFjZSgvXFxuL2csIFwiXCIpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpO1xuICAgIGlmICgvWy5fXFwtIStdKy9pZy50ZXN0KGxvZ2ljKSkge1xuICAgICAgZXJyb3JNc2cgPSBcIuWQq+acieeJueauiuWtl+espuOAglwiO1xuICAgIH1cbiAgICBpZiAoIWVycm9yTXNnKSB7XG4gICAgICBpbmRleCA9IGxvZ2ljLm1hdGNoKC9cXGQrL2lnKTtcbiAgICAgIGlmICghaW5kZXgpIHtcbiAgICAgICAgZXJyb3JNc2cgPSBcIuacieS6m+etm+mAieadoeS7tui/m+ihjOS6huWumuS5ie+8jOS9huacquWcqOmrmOe6p+etm+mAieadoeS7tuS4reiiq+W8leeUqOOAglwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5kZXguZm9yRWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgaWYgKGkgPCAxIHx8IGkgPiBmaWx0ZXJfbGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieadoeS7tuW8leeUqOS6huacquWumuS5ieeahOetm+mAieWZqO+8mlwiICsgaSArIFwi44CCXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmxhZyA9IDE7XG4gICAgICAgIHdoaWxlIChmbGFnIDw9IGZpbHRlcl9sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoIWluZGV4LmluY2x1ZGVzKFwiXCIgKyBmbGFnKSkge1xuICAgICAgICAgICAgZXJyb3JNc2cgPSBcIuacieS6m+etm+mAieadoeS7tui/m+ihjOS6huWumuS5ie+8jOS9huacquWcqOmrmOe6p+etm+mAieadoeS7tuS4reiiq+W8leeUqOOAglwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmbGFnKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFlcnJvck1zZykge1xuICAgICAgd29yZCA9IGxvZ2ljLm1hdGNoKC9bYS16QS1aXSsvaWcpO1xuICAgICAgaWYgKHdvcmQpIHtcbiAgICAgICAgd29yZC5mb3JFYWNoKGZ1bmN0aW9uKHcpIHtcbiAgICAgICAgICBpZiAoIS9eKGFuZHxvcikkL2lnLnRlc3QodykpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvck1zZyA9IFwi5qOA5p+l5oKo55qE6auY57qn562b6YCJ5p2h5Lu25Lit55qE5ou85YaZ44CCXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFlcnJvck1zZykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgQ3JlYXRvcltcImV2YWxcIl0obG9naWMucmVwbGFjZSgvYW5kL2lnLCBcIiYmXCIpLnJlcGxhY2UoL29yL2lnLCBcInx8XCIpKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOS4reWQq+acieeJueauiuWtl+esplwiO1xuICAgICAgfVxuICAgICAgaWYgKC8oQU5EKVteKCldKyhPUikvaWcudGVzdChsb2dpYykgfHwgLyhPUilbXigpXSsoQU5EKS9pZy50ZXN0KGxvZ2ljKSkge1xuICAgICAgICBlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5b+F6aG75Zyo6L+e57ut5oCn55qEIEFORCDlkowgT1Ig6KGo6L6+5byP5YmN5ZCO5L2/55So5ous5Y+344CCXCI7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChlcnJvck1zZykge1xuICAgIGNvbnNvbGUubG9nKFwiZXJyb3JcIiwgZXJyb3JNc2cpO1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHRvYXN0ci5lcnJvcihlcnJvck1zZyk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxuXG4vKlxub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcbmV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcbiAqL1xuXG5DcmVhdG9yLmZvcm1hdEZpbHRlcnNUb01vbmdvID0gZnVuY3Rpb24oZmlsdGVycywgb3B0aW9ucykge1xuICB2YXIgc2VsZWN0b3I7XG4gIGlmICghKGZpbHRlcnMgIT0gbnVsbCA/IGZpbHRlcnMubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIShmaWx0ZXJzWzBdIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgZmlsdGVycyA9IF8ubWFwKGZpbHRlcnMsIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIFtvYmouZmllbGQsIG9iai5vcGVyYXRpb24sIG9iai52YWx1ZV07XG4gICAgfSk7XG4gIH1cbiAgc2VsZWN0b3IgPSBbXTtcbiAgXy5lYWNoKGZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlcikge1xuICAgIHZhciBmaWVsZCwgb3B0aW9uLCByZWcsIHN1Yl9zZWxlY3RvciwgdmFsdWU7XG4gICAgZmllbGQgPSBmaWx0ZXJbMF07XG4gICAgb3B0aW9uID0gZmlsdGVyWzFdO1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIG51bGwsIG9wdGlvbnMpO1xuICAgIH1cbiAgICBzdWJfc2VsZWN0b3IgPSB7fTtcbiAgICBzdWJfc2VsZWN0b3JbZmllbGRdID0ge307XG4gICAgaWYgKG9wdGlvbiA9PT0gXCI9XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZXFcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI8PlwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJG5lXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPlwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGd0XCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPj1cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndGVcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI8XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI8PVwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGx0ZVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcInN0YXJ0c3dpdGhcIikge1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cChcIl5cIiArIHZhbHVlLCBcImlcIik7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcImNvbnRhaW5zXCIpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAodmFsdWUsIFwiaVwiKTtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWc7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwibm90Y29udGFpbnNcIikge1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cChcIl4oKD8hXCIgKyB2YWx1ZSArIFwiKS4pKiRcIiwgXCJpXCIpO1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZztcbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdG9yLnB1c2goc3ViX3NlbGVjdG9yKTtcbiAgfSk7XG4gIHJldHVybiBzZWxlY3Rvcjtcbn07XG5cbkNyZWF0b3IuaXNCZXR3ZWVuRmlsdGVyT3BlcmF0aW9uID0gZnVuY3Rpb24ob3BlcmF0aW9uKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiBvcGVyYXRpb24gPT09IFwiYmV0d2VlblwiIHx8ICEhKChyZWYgPSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyh0cnVlKSkgIT0gbnVsbCA/IHJlZltvcGVyYXRpb25dIDogdm9pZCAwKTtcbn07XG5cblxuLypcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5cdGV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcbiAqL1xuXG5DcmVhdG9yLmZvcm1hdEZpbHRlcnNUb0RldiA9IGZ1bmN0aW9uKGZpbHRlcnMsIG9iamVjdF9uYW1lLCBvcHRpb25zKSB7XG4gIHZhciBsb2dpY1RlbXBGaWx0ZXJzLCBzZWxlY3RvcjtcbiAgaWYgKCFmaWx0ZXJzLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5pc19sb2dpY19vciA6IHZvaWQgMCkge1xuICAgIGxvZ2ljVGVtcEZpbHRlcnMgPSBbXTtcbiAgICBmaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24obikge1xuICAgICAgbG9naWNUZW1wRmlsdGVycy5wdXNoKG4pO1xuICAgICAgcmV0dXJuIGxvZ2ljVGVtcEZpbHRlcnMucHVzaChcIm9yXCIpO1xuICAgIH0pO1xuICAgIGxvZ2ljVGVtcEZpbHRlcnMucG9wKCk7XG4gICAgZmlsdGVycyA9IGxvZ2ljVGVtcEZpbHRlcnM7XG4gIH1cbiAgc2VsZWN0b3IgPSBTdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9EZXYoZmlsdGVycywgQ3JlYXRvci5VU0VSX0NPTlRFWFQpO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuICovXG5cbkNyZWF0b3IuZm9ybWF0TG9naWNGaWx0ZXJzVG9EZXYgPSBmdW5jdGlvbihmaWx0ZXJzLCBmaWx0ZXJfbG9naWMsIG9wdGlvbnMpIHtcbiAgdmFyIGZvcm1hdF9sb2dpYztcbiAgZm9ybWF0X2xvZ2ljID0gZmlsdGVyX2xvZ2ljLnJlcGxhY2UoL1xcKFxccysvaWcsIFwiKFwiKS5yZXBsYWNlKC9cXHMrXFwpL2lnLCBcIilcIikucmVwbGFjZSgvXFwoL2csIFwiW1wiKS5yZXBsYWNlKC9cXCkvZywgXCJdXCIpLnJlcGxhY2UoL1xccysvZywgXCIsXCIpLnJlcGxhY2UoLyhhbmR8b3IpL2lnLCBcIickMSdcIik7XG4gIGZvcm1hdF9sb2dpYyA9IGZvcm1hdF9sb2dpYy5yZXBsYWNlKC8oXFxkKSsvaWcsIGZ1bmN0aW9uKHgpIHtcbiAgICB2YXIgX2YsIGZpZWxkLCBvcHRpb24sIHN1Yl9zZWxlY3RvciwgdmFsdWU7XG4gICAgX2YgPSBmaWx0ZXJzW3ggLSAxXTtcbiAgICBmaWVsZCA9IF9mLmZpZWxkO1xuICAgIG9wdGlvbiA9IF9mLm9wZXJhdGlvbjtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShfZi52YWx1ZSwgbnVsbCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHN1Yl9zZWxlY3RvciA9IFtdO1xuICAgIGlmIChfLmlzQXJyYXkodmFsdWUpID09PSB0cnVlKSB7XG4gICAgICBpZiAob3B0aW9uID09PSBcIj1cIikge1xuICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4gc3ViX3NlbGVjdG9yLnB1c2goW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjw+XCIpIHtcbiAgICAgICAgXy5lYWNoKHZhbHVlLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIHN1Yl9zZWxlY3Rvci5wdXNoKFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJhbmRcIik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgXy5lYWNoKHZhbHVlLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIHN1Yl9zZWxlY3Rvci5wdXNoKFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoc3ViX3NlbGVjdG9yW3N1Yl9zZWxlY3Rvci5sZW5ndGggLSAxXSA9PT0gXCJhbmRcIiB8fCBzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09PSBcIm9yXCIpIHtcbiAgICAgICAgc3ViX3NlbGVjdG9yLnBvcCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdWJfc2VsZWN0b3IgPSBbZmllbGQsIG9wdGlvbiwgdmFsdWVdO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcInN1Yl9zZWxlY3RvclwiLCBzdWJfc2VsZWN0b3IpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzdWJfc2VsZWN0b3IpO1xuICB9KTtcbiAgZm9ybWF0X2xvZ2ljID0gXCJbXCIgKyBmb3JtYXRfbG9naWMgKyBcIl1cIjtcbiAgcmV0dXJuIENyZWF0b3JbXCJldmFsXCJdKGZvcm1hdF9sb2dpYyk7XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgX29iamVjdCwgcGVybWlzc2lvbnMsIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCByZWxhdGVkX29iamVjdHMsIHVucmVsYXRlZF9vYmplY3RzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW107XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghX29iamVjdCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgfVxuICByZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKF9vYmplY3QuX2NvbGxlY3Rpb25fbmFtZSk7XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsIFwib2JqZWN0X25hbWVcIik7XG4gIGlmICgocmVsYXRlZF9vYmplY3RfbmFtZXMgIT0gbnVsbCA/IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmxlbmd0aCA6IHZvaWQgMCkgPT09IDApIHtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXM7XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICB1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzO1xuICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZShyZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHMpO1xuICByZXR1cm4gXy5maWx0ZXIocmVsYXRlZF9vYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCkge1xuICAgIHZhciBhbGxvd1JlYWQsIGlzQWN0aXZlLCByZWYsIHJlbGF0ZWRfb2JqZWN0X25hbWU7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0Lm9iamVjdF9uYW1lO1xuICAgIGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xO1xuICAgIGFsbG93UmVhZCA9IChyZWYgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYuYWxsb3dSZWFkIDogdm9pZCAwO1xuICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgICBhbGxvd1JlYWQgPSBhbGxvd1JlYWQgJiYgcGVybWlzc2lvbnMuYWxsb3dSZWFkRmlsZXM7XG4gICAgfVxuICAgIHJldHVybiBpc0FjdGl2ZSAmJiBhbGxvd1JlYWQ7XG4gIH0pO1xufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0TmFtZXMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciByZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIHJldHVybiBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cywgXCJvYmplY3RfbmFtZVwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdExpc3RBY3Rpb25zID0gZnVuY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgYWN0aW9ucztcbiAgYWN0aW9ucyA9IENyZWF0b3IuZ2V0QWN0aW9ucyhyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgYWN0aW9ucyA9IF8uZmlsdGVyKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIGlmIChhY3Rpb24ubmFtZSA9PT0gXCJzdGFuZGFyZF9mb2xsb3dcIikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoYWN0aW9uLm5hbWUgPT09IFwic3RhbmRhcmRfcXVlcnlcIikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoYWN0aW9uLm9uID09PSBcImxpc3RcIikge1xuICAgICAgaWYgKHR5cGVvZiBhY3Rpb24udmlzaWJsZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBhY3Rpb24udmlzaWJsZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi52aXNpYmxlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGFjdGlvbnM7XG59O1xuXG5DcmVhdG9yLmdldEFjdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBhY3Rpb25zLCBkaXNhYmxlZF9hY3Rpb25zLCBvYmosIHBlcm1pc3Npb25zLCByZWYsIHJlZjE7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIGRpc2FibGVkX2FjdGlvbnMgPSBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zO1xuICBhY3Rpb25zID0gXy5zb3J0QnkoXy52YWx1ZXMob2JqLmFjdGlvbnMpLCAnc29ydCcpO1xuICBpZiAoXy5oYXMob2JqLCAnYWxsb3dfY3VzdG9tQWN0aW9ucycpKSB7XG4gICAgYWN0aW9ucyA9IF8uZmlsdGVyKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgICAgcmV0dXJuIF8uaW5jbHVkZShvYmouYWxsb3dfY3VzdG9tQWN0aW9ucywgYWN0aW9uLm5hbWUpIHx8IF8uaW5jbHVkZShfLmtleXMoQ3JlYXRvci5nZXRPYmplY3QoJ2Jhc2UnKS5hY3Rpb25zKSB8fCB7fSwgYWN0aW9uLm5hbWUpO1xuICAgIH0pO1xuICB9XG4gIGlmIChfLmhhcyhvYmosICdleGNsdWRlX2FjdGlvbnMnKSkge1xuICAgIGFjdGlvbnMgPSBfLmZpbHRlcihhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICAgIHJldHVybiAhXy5pbmNsdWRlKG9iai5leGNsdWRlX2FjdGlvbnMsIGFjdGlvbi5uYW1lKTtcbiAgICB9KTtcbiAgfVxuICBfLmVhY2goYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJyZWNvcmRcIiwgXCJyZWNvcmRfb25seVwiXS5pbmRleE9mKGFjdGlvbi5vbikgPiAtMSAmJiBhY3Rpb24ubmFtZSAhPT0gJ3N0YW5kYXJkX2VkaXQnKSB7XG4gICAgICBpZiAoYWN0aW9uLm9uID09PSBcInJlY29yZF9vbmx5XCIpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi5vbiA9ICdyZWNvcmRfb25seV9tb3JlJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBhY3Rpb24ub24gPSAncmVjb3JkX21vcmUnO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgJiYgW1wiY21zX2ZpbGVzXCIsIFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIl0uaW5kZXhPZihvYmplY3RfbmFtZSkgPiAtMSkge1xuICAgIGlmICgocmVmID0gYWN0aW9ucy5maW5kKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLm5hbWUgPT09IFwic3RhbmRhcmRfZWRpdFwiO1xuICAgIH0pKSAhPSBudWxsKSB7XG4gICAgICByZWYub24gPSBcInJlY29yZF9tb3JlXCI7XG4gICAgfVxuICAgIGlmICgocmVmMSA9IGFjdGlvbnMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5uYW1lID09PSBcImRvd25sb2FkXCI7XG4gICAgfSkpICE9IG51bGwpIHtcbiAgICAgIHJlZjEub24gPSBcInJlY29yZFwiO1xuICAgIH1cbiAgfVxuICBhY3Rpb25zID0gXy5maWx0ZXIoYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgcmV0dXJuIF8uaW5kZXhPZihkaXNhYmxlZF9hY3Rpb25zLCBhY3Rpb24ubmFtZSkgPCAwO1xuICB9KTtcbiAgcmV0dXJuIGFjdGlvbnM7XG59O1xuXG4v6L+U5Zue5b2T5YmN55So5oi35pyJ5p2D6ZmQ6K6/6Zeu55qE5omA5pyJbGlzdF92aWV377yM5YyF5ous5YiG5Lqr55qE77yM55So5oi36Ieq5a6a5LmJ6Z2e5YiG5Lqr55qE77yI6Zmk6Z2eb3duZXLlj5jkuobvvInvvIzku6Xlj4rpu5jorqTnmoTlhbbku5bop4blm77ms6jmhI9DcmVhdG9yLmdldFBlcm1pc3Npb25z5Ye95pWw5Lit5piv5LiN5Lya5pyJ55So5oi36Ieq5a6a5LmJ6Z2e5YiG5Lqr55qE6KeG5Zu+55qE77yM5omA5LulQ3JlYXRvci5nZXRQZXJtaXNzaW9uc+WHveaVsOS4reaLv+WIsOeahOe7k+aenOS4jeWFqO+8jOW5tuS4jeaYr+W9k+WJjeeUqOaIt+iDveeci+WIsOaJgOacieinhuWbvi87XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgZGlzYWJsZWRfbGlzdF92aWV3cywgaXNNb2JpbGUsIGxpc3RWaWV3cywgbGlzdF92aWV3cywgb2JqZWN0LCByZWY7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGRpc2FibGVkX2xpc3Rfdmlld3MgPSAoKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYuZGlzYWJsZWRfbGlzdF92aWV3cyA6IHZvaWQgMCkgfHwgW107XG4gIGxpc3Rfdmlld3MgPSBbXTtcbiAgaXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKCk7XG4gIF8uZWFjaChvYmplY3QubGlzdF92aWV3cywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgcmV0dXJuIGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZTtcbiAgfSk7XG4gIGxpc3RWaWV3cyA9IF8uc29ydEJ5KF8udmFsdWVzKG9iamVjdC5saXN0X3ZpZXdzKSwgJ3NvcnRfbm8nKTtcbiAgXy5lYWNoKGxpc3RWaWV3cywgZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciBpc0Rpc2FibGVkO1xuICAgIGlmIChpc01vYmlsZSAmJiBpdGVtLnR5cGUgPT09IFwiY2FsZW5kYXJcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXRlbS5uYW1lICE9PSBcImRlZmF1bHRcIikge1xuICAgICAgaXNEaXNhYmxlZCA9IF8uaW5kZXhPZihkaXNhYmxlZF9saXN0X3ZpZXdzLCBpdGVtLm5hbWUpID4gLTEgfHwgKGl0ZW0uX2lkICYmIF8uaW5kZXhPZihkaXNhYmxlZF9saXN0X3ZpZXdzLCBpdGVtLl9pZCkgPiAtMSk7XG4gICAgICBpZiAoIWlzRGlzYWJsZWQgfHwgaXRlbS5vd25lciA9PT0gdXNlcklkKSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXdzLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGxpc3Rfdmlld3M7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGZpZWxkc05hbWUsIHJlZiwgdW5yZWFkYWJsZV9maWVsZHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgZmllbGRzTmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZShvYmplY3RfbmFtZSk7XG4gIHVucmVhZGFibGVfZmllbGRzID0gKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYudW5yZWFkYWJsZV9maWVsZHMgOiB2b2lkIDA7XG4gIHJldHVybiBfLmRpZmZlcmVuY2UoZmllbGRzTmFtZSwgdW5yZWFkYWJsZV9maWVsZHMpO1xufTtcblxuQ3JlYXRvci5pc2xvYWRpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZC5nZXQoKTtcbn07XG5cbkNyZWF0b3IuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0RGlzYWJsZWRGaWVsZHMgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLmRpc2FibGVkICYmICFmaWVsZC5hdXRvZm9ybS5vbWl0ICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRIaWRkZW5GaWVsZHMgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLnR5cGUgPT09IFwiaGlkZGVuXCIgJiYgIWZpZWxkLmF1dG9mb3JtLm9taXQgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhOb0dyb3VwID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBmaWVsZHM7XG4gIGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQsIGZpZWxkTmFtZSkge1xuICAgIHJldHVybiAoIWZpZWxkLmF1dG9mb3JtIHx8ICFmaWVsZC5hdXRvZm9ybS5ncm91cCB8fCBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PT0gXCItXCIpICYmICghZmllbGQuYXV0b2Zvcm0gfHwgZmllbGQuYXV0b2Zvcm0udHlwZSAhPT0gXCJoaWRkZW5cIikgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldFNvcnRlZEZpZWxkR3JvdXBOYW1lcyA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgbmFtZXM7XG4gIG5hbWVzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZC5hdXRvZm9ybSAmJiBmaWVsZC5hdXRvZm9ybS5ncm91cCAhPT0gXCItXCIgJiYgZmllbGQuYXV0b2Zvcm0uZ3JvdXA7XG4gIH0pO1xuICBuYW1lcyA9IF8uY29tcGFjdChuYW1lcyk7XG4gIG5hbWVzID0gXy51bmlxdWUobmFtZXMpO1xuICByZXR1cm4gbmFtZXM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc0Zvckdyb3VwID0gZnVuY3Rpb24oc2NoZW1hLCBncm91cE5hbWUpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLmdyb3VwID09PSBncm91cE5hbWUgJiYgZmllbGQuYXV0b2Zvcm0udHlwZSAhPT0gXCJoaWRkZW5cIiAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0U3lzdGVtQmFzZUZpZWxkcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gW1wiY3JlYXRlZFwiLCBcImNyZWF0ZWRfYnlcIiwgXCJtb2RpZmllZFwiLCBcIm1vZGlmaWVkX2J5XCJdO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNXaXRob3V0U3lzdGVtQmFzZSA9IGZ1bmN0aW9uKGtleXMpIHtcbiAgcmV0dXJuIF8uZGlmZmVyZW5jZShrZXlzLCBDcmVhdG9yLmdldFN5c3RlbUJhc2VGaWVsZHMoKSk7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRPbWl0ID0gZnVuY3Rpb24oc2NoZW1hLCBrZXlzKSB7XG4gIGtleXMgPSBfLm1hcChrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgZmllbGQsIHJlZjtcbiAgICBmaWVsZCA9IF8ucGljayhzY2hlbWEsIGtleSk7XG4gICAgaWYgKChyZWYgPSBmaWVsZFtrZXldLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmLm9taXQgOiB2b2lkIDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gIH0pO1xuICBrZXlzID0gXy5jb21wYWN0KGtleXMpO1xuICByZXR1cm4ga2V5cztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzSW5GaXJzdExldmVsID0gZnVuY3Rpb24oZmlyc3RMZXZlbEtleXMsIGtleXMpIHtcbiAga2V5cyA9IF8ubWFwKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgIGlmIChfLmluZGV4T2YoZmlyc3RMZXZlbEtleXMsIGtleSkgPiAtMSkge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSk7XG4gIGtleXMgPSBfLmNvbXBhY3Qoa2V5cyk7XG4gIHJldHVybiBrZXlzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNGb3JSZW9yZGVyID0gZnVuY3Rpb24oc2NoZW1hLCBrZXlzLCBpc1NpbmdsZSkge1xuICB2YXIgX2tleXMsIGNoaWxkS2V5cywgZmllbGRzLCBpLCBpc193aWRlXzEsIGlzX3dpZGVfMiwgc2NfMSwgc2NfMjtcbiAgZmllbGRzID0gW107XG4gIGkgPSAwO1xuICBfa2V5cyA9IF8uZmlsdGVyKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiAha2V5LmVuZHNXaXRoKCdfZW5kTGluZScpO1xuICB9KTtcbiAgd2hpbGUgKGkgPCBfa2V5cy5sZW5ndGgpIHtcbiAgICBzY18xID0gXy5waWNrKHNjaGVtYSwgX2tleXNbaV0pO1xuICAgIHNjXzIgPSBfLnBpY2soc2NoZW1hLCBfa2V5c1tpICsgMV0pO1xuICAgIGlzX3dpZGVfMSA9IGZhbHNlO1xuICAgIGlzX3dpZGVfMiA9IGZhbHNlO1xuICAgIF8uZWFjaChzY18xLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIHJlZiwgcmVmMTtcbiAgICAgIGlmICgoKHJlZiA9IHZhbHVlLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmLmlzX3dpZGUgOiB2b2lkIDApIHx8ICgocmVmMSA9IHZhbHVlLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMS50eXBlIDogdm9pZCAwKSA9PT0gXCJ0YWJsZVwiKSB7XG4gICAgICAgIHJldHVybiBpc193aWRlXzEgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIF8uZWFjaChzY18yLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIHJlZiwgcmVmMTtcbiAgICAgIGlmICgoKHJlZiA9IHZhbHVlLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmLmlzX3dpZGUgOiB2b2lkIDApIHx8ICgocmVmMSA9IHZhbHVlLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMS50eXBlIDogdm9pZCAwKSA9PT0gXCJ0YWJsZVwiKSB7XG4gICAgICAgIHJldHVybiBpc193aWRlXzIgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgIGlzX3dpZGVfMSA9IHRydWU7XG4gICAgICBpc193aWRlXzIgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoaXNTaW5nbGUpIHtcbiAgICAgIGZpZWxkcy5wdXNoKF9rZXlzLnNsaWNlKGksIGkgKyAxKSk7XG4gICAgICBpICs9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc193aWRlXzEpIHtcbiAgICAgICAgZmllbGRzLnB1c2goX2tleXMuc2xpY2UoaSwgaSArIDEpKTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgfSBlbHNlIGlmICghaXNfd2lkZV8xICYmIGlzX3dpZGVfMikge1xuICAgICAgICBjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpICsgMSk7XG4gICAgICAgIGNoaWxkS2V5cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIGZpZWxkcy5wdXNoKGNoaWxkS2V5cyk7XG4gICAgICAgIGkgKz0gMTtcbiAgICAgIH0gZWxzZSBpZiAoIWlzX3dpZGVfMSAmJiAhaXNfd2lkZV8yKSB7XG4gICAgICAgIGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkgKyAxKTtcbiAgICAgICAgaWYgKF9rZXlzW2kgKyAxXSkge1xuICAgICAgICAgIGNoaWxkS2V5cy5wdXNoKF9rZXlzW2kgKyAxXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2hpbGRLZXlzLnB1c2godm9pZCAwKTtcbiAgICAgICAgfVxuICAgICAgICBmaWVsZHMucHVzaChjaGlsZEtleXMpO1xuICAgICAgICBpICs9IDI7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmlzRmlsdGVyVmFsdWVFbXB0eSA9IGZ1bmN0aW9uKHYpIHtcbiAgcmV0dXJuIHR5cGVvZiB2ID09PSBcInVuZGVmaW5lZFwiIHx8IHYgPT09IG51bGwgfHwgTnVtYmVyLmlzTmFOKHYpIHx8IHYubGVuZ3RoID09PSAwO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZERhdGFUeXBlID0gZnVuY3Rpb24ob2JqZWN0RmllbGRzLCBrZXkpIHtcbiAgdmFyIHJlZiwgcmVzdWx0O1xuICBpZiAob2JqZWN0RmllbGRzICYmIGtleSkge1xuICAgIHJlc3VsdCA9IChyZWYgPSBvYmplY3RGaWVsZHNba2V5XSkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwO1xuICAgIGlmIChbXCJmb3JtdWxhXCIsIFwic3VtbWFyeVwiXS5pbmRleE9mKHJlc3VsdCkgPiAtMSkge1xuICAgICAgcmVzdWx0ID0gb2JqZWN0RmllbGRzW2tleV0uZGF0YV90eXBlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBcInRleHRcIjtcbiAgfVxufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDcmVhdG9yLmdldEFsbFJlbGF0ZWRPYmplY3RzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgcmVsYXRlZF9vYmplY3RfbmFtZXM7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBbXTtcbiAgICBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgICAgcmV0dXJuIF8uZWFjaChyZWxhdGVkX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgICAgICBpZiAocmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PT0gb2JqZWN0X25hbWUpIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXMucHVzaChyZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKS5lbmFibGVfZmlsZXMpIHtcbiAgICAgIHJlbGF0ZWRfb2JqZWN0X25hbWVzLnB1c2goXCJjbXNfZmlsZXNcIik7XG4gICAgfVxuICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zLmZvcm1hdEluZGV4ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgaW5kZXhOYW1lLCBpc2RvY3VtZW50REIsIG9iamVjdCwgcmVmLCByZWYxLCByZWYyO1xuICAgIG9iamVjdCA9IHtcbiAgICAgIGJhY2tncm91bmQ6IHRydWVcbiAgICB9O1xuICAgIGlzZG9jdW1lbnREQiA9ICgocmVmID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjEgPSByZWYuZGF0YXNvdXJjZXMpICE9IG51bGwgPyAocmVmMiA9IHJlZjFbXCJkZWZhdWx0XCJdKSAhPSBudWxsID8gcmVmMi5kb2N1bWVudERCIDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwKSB8fCBmYWxzZTtcbiAgICBpZiAoaXNkb2N1bWVudERCKSB7XG4gICAgICBpZiAoYXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICBpbmRleE5hbWUgPSBhcnJheS5qb2luKFwiLlwiKTtcbiAgICAgICAgb2JqZWN0Lm5hbWUgPSBpbmRleE5hbWU7XG4gICAgICAgIGlmIChpbmRleE5hbWUubGVuZ3RoID4gNTIpIHtcbiAgICAgICAgICBvYmplY3QubmFtZSA9IGluZGV4TmFtZS5zdWJzdHJpbmcoMCwgNTIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG4iLCJDcmVhdG9yLmFwcHNCeU5hbWUgPSB7fVxuXG4iLCJNZXRlb3IubWV0aG9kc1xuXHRcIm9iamVjdF9yZWNlbnRfdmlld2VkXCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZV9pZCktPlxuXHRcdGlmICF0aGlzLnVzZXJJZFxuXHRcdFx0cmV0dXJuIG51bGxcblxuXHRcdGlmIG9iamVjdF9uYW1lID09IFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIlxuXHRcdFx0cmV0dXJuXG5cdFx0aWYgb2JqZWN0X25hbWUgYW5kIHJlY29yZF9pZFxuXHRcdFx0aWYgIXNwYWNlX2lkXG5cdFx0XHRcdGRvYyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZE9uZSh7X2lkOiByZWNvcmRfaWR9LCB7ZmllbGRzOiB7c3BhY2U6IDF9fSlcblx0XHRcdFx0c3BhY2VfaWQgPSBkb2M/LnNwYWNlXG5cblx0XHRcdGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9yZWNlbnRfdmlld2VkXCIpXG5cdFx0XHRmaWx0ZXJzID0geyBvd25lcjogdGhpcy51c2VySWQsIHNwYWNlOiBzcGFjZV9pZCwgJ3JlY29yZC5vJzogb2JqZWN0X25hbWUsICdyZWNvcmQuaWRzJzogW3JlY29yZF9pZF19XG5cdFx0XHRjdXJyZW50X3JlY2VudF92aWV3ZWQgPSBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuZmluZE9uZShmaWx0ZXJzKVxuXHRcdFx0aWYgY3VycmVudF9yZWNlbnRfdmlld2VkXG5cdFx0XHRcdGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC51cGRhdGUoXG5cdFx0XHRcdFx0Y3VycmVudF9yZWNlbnRfdmlld2VkLl9pZCxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHQkaW5jOiB7XG5cdFx0XHRcdFx0XHRcdGNvdW50OiAxXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0JHNldDoge1xuXHRcdFx0XHRcdFx0XHRtb2RpZmllZDogbmV3IERhdGUoKVxuXHRcdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogdGhpcy51c2VySWRcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdClcblx0XHRcdGVsc2Vcblx0XHRcdFx0Y29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLmluc2VydChcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRfaWQ6IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5fbWFrZU5ld0lEKClcblx0XHRcdFx0XHRcdG93bmVyOiB0aGlzLnVzZXJJZFxuXHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkXG5cdFx0XHRcdFx0XHRyZWNvcmQ6IHtvOiBvYmplY3RfbmFtZSwgaWRzOiBbcmVjb3JkX2lkXX1cblx0XHRcdFx0XHRcdGNvdW50OiAxXG5cdFx0XHRcdFx0XHRjcmVhdGVkOiBuZXcgRGF0ZSgpXG5cdFx0XHRcdFx0XHRjcmVhdGVkX2J5OiB0aGlzLnVzZXJJZFxuXHRcdFx0XHRcdFx0bW9kaWZpZWQ6IG5ldyBEYXRlKClcblx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dmFsaWRhdGU6IGZhbHNlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpXG5cdFx0XHRyZXR1cm4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc3BhY2VfaWQpIHtcbiAgICB2YXIgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLCBjdXJyZW50X3JlY2VudF92aWV3ZWQsIGRvYywgZmlsdGVycztcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBcIm9iamVjdF9yZWNlbnRfdmlld2VkXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG9iamVjdF9uYW1lICYmIHJlY29yZF9pZCkge1xuICAgICAgaWYgKCFzcGFjZV9pZCkge1xuICAgICAgICBkb2MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmRPbmUoe1xuICAgICAgICAgIF9pZDogcmVjb3JkX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHNwYWNlOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc3BhY2VfaWQgPSBkb2MgIT0gbnVsbCA/IGRvYy5zcGFjZSA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICAgIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9yZWNlbnRfdmlld2VkXCIpO1xuICAgICAgZmlsdGVycyA9IHtcbiAgICAgICAgb3duZXI6IHRoaXMudXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICdyZWNvcmQubyc6IG9iamVjdF9uYW1lLFxuICAgICAgICAncmVjb3JkLmlkcyc6IFtyZWNvcmRfaWRdXG4gICAgICB9O1xuICAgICAgY3VycmVudF9yZWNlbnRfdmlld2VkID0gY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLmZpbmRPbmUoZmlsdGVycyk7XG4gICAgICBpZiAoY3VycmVudF9yZWNlbnRfdmlld2VkKSB7XG4gICAgICAgIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC51cGRhdGUoY3VycmVudF9yZWNlbnRfdmlld2VkLl9pZCwge1xuICAgICAgICAgICRpbmM6IHtcbiAgICAgICAgICAgIGNvdW50OiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuaW5zZXJ0KHtcbiAgICAgICAgICBfaWQ6IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5fbWFrZU5ld0lEKCksXG4gICAgICAgICAgb3duZXI6IHRoaXMudXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICByZWNvcmQ6IHtcbiAgICAgICAgICAgIG86IG9iamVjdF9uYW1lLFxuICAgICAgICAgICAgaWRzOiBbcmVjb3JkX2lkXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICBjcmVhdGVkX2J5OiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICBtb2RpZmllZF9ieTogdGhpcy51c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIHZhbGlkYXRlOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuIiwicmVjZW50X2FnZ3JlZ2F0ZSA9IChjcmVhdGVkX2J5LCBzcGFjZUlkLCBfcmVjb3JkcywgY2FsbGJhY2spLT5cblx0Q3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfcmVjZW50X3ZpZXdlZC5yYXdDb2xsZWN0aW9uKCkuYWdncmVnYXRlKFtcblx0XHR7JG1hdGNoOiB7Y3JlYXRlZF9ieTogY3JlYXRlZF9ieSwgc3BhY2U6IHNwYWNlSWR9fSxcblx0XHR7JGdyb3VwOiB7X2lkOiB7b2JqZWN0X25hbWU6IFwiJHJlY29yZC5vXCIsIHJlY29yZF9pZDogXCIkcmVjb3JkLmlkc1wiLCBzcGFjZTogXCIkc3BhY2VcIn0sIG1heENyZWF0ZWQ6IHskbWF4OiBcIiRjcmVhdGVkXCJ9fX0sXG5cdFx0eyRzb3J0OiB7bWF4Q3JlYXRlZDogLTF9fSxcblx0XHR7JGxpbWl0OiAxMH1cblx0XSkudG9BcnJheSAoZXJyLCBkYXRhKS0+XG5cdFx0aWYgZXJyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyKVxuXG5cdFx0ZGF0YS5mb3JFYWNoIChkb2MpIC0+XG5cdFx0XHRfcmVjb3Jkcy5wdXNoIGRvYy5faWRcblxuXHRcdGlmIGNhbGxiYWNrICYmIF8uaXNGdW5jdGlvbihjYWxsYmFjaylcblx0XHRcdGNhbGxiYWNrKClcblxuXHRcdHJldHVyblxuXG5hc3luY19yZWNlbnRfYWdncmVnYXRlID0gTWV0ZW9yLndyYXBBc3luYyhyZWNlbnRfYWdncmVnYXRlKVxuXG5zZWFyY2hfb2JqZWN0ID0gKHNwYWNlLCBvYmplY3RfbmFtZSx1c2VySWQsIHNlYXJjaFRleHQpLT5cblx0ZGF0YSA9IG5ldyBBcnJheSgpXG5cblx0aWYgc2VhcmNoVGV4dFxuXG5cdFx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdFx0X29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxuXHRcdF9vYmplY3RfbmFtZV9rZXkgPSBfb2JqZWN0Py5OQU1FX0ZJRUxEX0tFWVxuXHRcdGlmIF9vYmplY3QgJiYgX29iamVjdF9jb2xsZWN0aW9uICYmIF9vYmplY3RfbmFtZV9rZXlcblx0XHRcdHF1ZXJ5ID0ge31cblx0XHRcdHNlYXJjaF9LZXl3b3JkcyA9IHNlYXJjaFRleHQuc3BsaXQoXCIgXCIpXG5cdFx0XHRxdWVyeV9hbmQgPSBbXVxuXHRcdFx0c2VhcmNoX0tleXdvcmRzLmZvckVhY2ggKGtleXdvcmQpLT5cblx0XHRcdFx0c3VicXVlcnkgPSB7fVxuXHRcdFx0XHRzdWJxdWVyeVtfb2JqZWN0X25hbWVfa2V5XSA9IHskcmVnZXg6IGtleXdvcmQudHJpbSgpfVxuXHRcdFx0XHRxdWVyeV9hbmQucHVzaCBzdWJxdWVyeVxuXG5cdFx0XHRxdWVyeS4kYW5kID0gcXVlcnlfYW5kXG5cdFx0XHRxdWVyeS5zcGFjZSA9IHskaW46IFtzcGFjZV19XG5cblx0XHRcdGZpZWxkcyA9IHtfaWQ6IDF9XG5cdFx0XHRmaWVsZHNbX29iamVjdF9uYW1lX2tleV0gPSAxXG5cblx0XHRcdHJlY29yZHMgPSBfb2JqZWN0X2NvbGxlY3Rpb24uZmluZChxdWVyeSwge2ZpZWxkczogZmllbGRzLCBzb3J0OiB7bW9kaWZpZWQ6IDF9LCBsaW1pdDogNX0pXG5cblx0XHRcdHJlY29yZHMuZm9yRWFjaCAocmVjb3JkKS0+XG5cdFx0XHRcdGRhdGEucHVzaCB7X2lkOiByZWNvcmQuX2lkLCBfbmFtZTogcmVjb3JkW19vYmplY3RfbmFtZV9rZXldLCBfb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lfVxuXHRcblx0cmV0dXJuIGRhdGFcblxuTWV0ZW9yLm1ldGhvZHNcblx0J29iamVjdF9yZWNlbnRfcmVjb3JkJzogKHNwYWNlSWQpLT5cblx0XHRkYXRhID0gbmV3IEFycmF5KClcblx0XHRyZWNvcmRzID0gbmV3IEFycmF5KClcblx0XHRhc3luY19yZWNlbnRfYWdncmVnYXRlKHRoaXMudXNlcklkLCBzcGFjZUlkLCByZWNvcmRzKVxuXHRcdHJlY29yZHMuZm9yRWFjaCAoaXRlbSktPlxuXHRcdFx0cmVjb3JkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpXG5cblx0XHRcdGlmICFyZWNvcmRfb2JqZWN0XG5cdFx0XHRcdHJldHVyblxuXG5cdFx0XHRyZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSlcblxuXHRcdFx0aWYgcmVjb3JkX29iamVjdCAmJiByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb25cblx0XHRcdFx0ZmllbGRzID0ge19pZDogMX1cblxuXHRcdFx0XHRmaWVsZHNbcmVjb3JkX29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gPSAxXG5cblx0XHRcdFx0cmVjb3JkID0gcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uLmZpbmRPbmUoaXRlbS5yZWNvcmRfaWRbMF0sIHtmaWVsZHM6IGZpZWxkc30pXG5cdFx0XHRcdGlmIHJlY29yZFxuXHRcdFx0XHRcdGRhdGEucHVzaCB7X2lkOiByZWNvcmQuX2lkLCBfbmFtZTogcmVjb3JkW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldLCBfb2JqZWN0X25hbWU6IGl0ZW0ub2JqZWN0X25hbWV9XG5cblx0XHRyZXR1cm4gZGF0YVxuXG5cdCdvYmplY3RfcmVjb3JkX3NlYXJjaCc6IChvcHRpb25zKS0+XG5cdFx0c2VsZiA9IHRoaXNcblxuXHRcdGRhdGEgPSBuZXcgQXJyYXkoKVxuXG5cdFx0c2VhcmNoVGV4dCA9IG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdHNwYWNlID0gb3B0aW9ucy5zcGFjZVxuXG5cdFx0Xy5mb3JFYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKF9vYmplY3QsIG5hbWUpLT5cblx0XHRcdGlmIF9vYmplY3QuZW5hYmxlX3NlYXJjaFxuXHRcdFx0XHRvYmplY3RfcmVjb3JkID0gc2VhcmNoX29iamVjdChzcGFjZSwgX29iamVjdC5uYW1lLCBzZWxmLnVzZXJJZCwgc2VhcmNoVGV4dClcblx0XHRcdFx0ZGF0YSA9IGRhdGEuY29uY2F0KG9iamVjdF9yZWNvcmQpXG5cblx0XHRyZXR1cm4gZGF0YVxuIiwidmFyIGFzeW5jX3JlY2VudF9hZ2dyZWdhdGUsIHJlY2VudF9hZ2dyZWdhdGUsIHNlYXJjaF9vYmplY3Q7XG5cbnJlY2VudF9hZ2dyZWdhdGUgPSBmdW5jdGlvbihjcmVhdGVkX2J5LCBzcGFjZUlkLCBfcmVjb3JkcywgY2FsbGJhY2spIHtcbiAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3JlY2VudF92aWV3ZWQucmF3Q29sbGVjdGlvbigpLmFnZ3JlZ2F0ZShbXG4gICAge1xuICAgICAgJG1hdGNoOiB7XG4gICAgICAgIGNyZWF0ZWRfYnk6IGNyZWF0ZWRfYnksXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgJGdyb3VwOiB7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBcIiRyZWNvcmQub1wiLFxuICAgICAgICAgIHJlY29yZF9pZDogXCIkcmVjb3JkLmlkc1wiLFxuICAgICAgICAgIHNwYWNlOiBcIiRzcGFjZVwiXG4gICAgICAgIH0sXG4gICAgICAgIG1heENyZWF0ZWQ6IHtcbiAgICAgICAgICAkbWF4OiBcIiRjcmVhdGVkXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgICRzb3J0OiB7XG4gICAgICAgIG1heENyZWF0ZWQ6IC0xXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgJGxpbWl0OiAxMFxuICAgIH1cbiAgXSkudG9BcnJheShmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyKTtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGRvYykge1xuICAgICAgcmV0dXJuIF9yZWNvcmRzLnB1c2goZG9jLl9pZCk7XG4gICAgfSk7XG4gICAgaWYgKGNhbGxiYWNrICYmIF8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9KTtcbn07XG5cbmFzeW5jX3JlY2VudF9hZ2dyZWdhdGUgPSBNZXRlb3Iud3JhcEFzeW5jKHJlY2VudF9hZ2dyZWdhdGUpO1xuXG5zZWFyY2hfb2JqZWN0ID0gZnVuY3Rpb24oc3BhY2UsIG9iamVjdF9uYW1lLCB1c2VySWQsIHNlYXJjaFRleHQpIHtcbiAgdmFyIF9vYmplY3QsIF9vYmplY3RfY29sbGVjdGlvbiwgX29iamVjdF9uYW1lX2tleSwgZGF0YSwgZmllbGRzLCBxdWVyeSwgcXVlcnlfYW5kLCByZWNvcmRzLCBzZWFyY2hfS2V5d29yZHM7XG4gIGRhdGEgPSBuZXcgQXJyYXkoKTtcbiAgaWYgKHNlYXJjaFRleHQpIHtcbiAgICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIF9vYmplY3RfY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSk7XG4gICAgX29iamVjdF9uYW1lX2tleSA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuTkFNRV9GSUVMRF9LRVkgOiB2b2lkIDA7XG4gICAgaWYgKF9vYmplY3QgJiYgX29iamVjdF9jb2xsZWN0aW9uICYmIF9vYmplY3RfbmFtZV9rZXkpIHtcbiAgICAgIHF1ZXJ5ID0ge307XG4gICAgICBzZWFyY2hfS2V5d29yZHMgPSBzZWFyY2hUZXh0LnNwbGl0KFwiIFwiKTtcbiAgICAgIHF1ZXJ5X2FuZCA9IFtdO1xuICAgICAgc2VhcmNoX0tleXdvcmRzLmZvckVhY2goZnVuY3Rpb24oa2V5d29yZCkge1xuICAgICAgICB2YXIgc3VicXVlcnk7XG4gICAgICAgIHN1YnF1ZXJ5ID0ge307XG4gICAgICAgIHN1YnF1ZXJ5W19vYmplY3RfbmFtZV9rZXldID0ge1xuICAgICAgICAgICRyZWdleDoga2V5d29yZC50cmltKClcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHF1ZXJ5X2FuZC5wdXNoKHN1YnF1ZXJ5KTtcbiAgICAgIH0pO1xuICAgICAgcXVlcnkuJGFuZCA9IHF1ZXJ5X2FuZDtcbiAgICAgIHF1ZXJ5LnNwYWNlID0ge1xuICAgICAgICAkaW46IFtzcGFjZV1cbiAgICAgIH07XG4gICAgICBmaWVsZHMgPSB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfTtcbiAgICAgIGZpZWxkc1tfb2JqZWN0X25hbWVfa2V5XSA9IDE7XG4gICAgICByZWNvcmRzID0gX29iamVjdF9jb2xsZWN0aW9uLmZpbmQocXVlcnksIHtcbiAgICAgICAgZmllbGRzOiBmaWVsZHMsXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBtb2RpZmllZDogMVxuICAgICAgICB9LFxuICAgICAgICBsaW1pdDogNVxuICAgICAgfSk7XG4gICAgICByZWNvcmRzLmZvckVhY2goZnVuY3Rpb24ocmVjb3JkKSB7XG4gICAgICAgIHJldHVybiBkYXRhLnB1c2goe1xuICAgICAgICAgIF9pZDogcmVjb3JkLl9pZCxcbiAgICAgICAgICBfbmFtZTogcmVjb3JkW19vYmplY3RfbmFtZV9rZXldLFxuICAgICAgICAgIF9vYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gICdvYmplY3RfcmVjZW50X3JlY29yZCc6IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgZGF0YSwgcmVjb3JkcztcbiAgICBkYXRhID0gbmV3IEFycmF5KCk7XG4gICAgcmVjb3JkcyA9IG5ldyBBcnJheSgpO1xuICAgIGFzeW5jX3JlY2VudF9hZ2dyZWdhdGUodGhpcy51c2VySWQsIHNwYWNlSWQsIHJlY29yZHMpO1xuICAgIHJlY29yZHMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICB2YXIgZmllbGRzLCByZWNvcmQsIHJlY29yZF9vYmplY3QsIHJlY29yZF9vYmplY3RfY29sbGVjdGlvbjtcbiAgICAgIHJlY29yZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChpdGVtLm9iamVjdF9uYW1lLCBpdGVtLnNwYWNlKTtcbiAgICAgIGlmICghcmVjb3JkX29iamVjdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSk7XG4gICAgICBpZiAocmVjb3JkX29iamVjdCAmJiByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24pIHtcbiAgICAgICAgZmllbGRzID0ge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9O1xuICAgICAgICBmaWVsZHNbcmVjb3JkX29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gPSAxO1xuICAgICAgICByZWNvcmQgPSByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24uZmluZE9uZShpdGVtLnJlY29yZF9pZFswXSwge1xuICAgICAgICAgIGZpZWxkczogZmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGEucHVzaCh7XG4gICAgICAgICAgICBfaWQ6IHJlY29yZC5faWQsXG4gICAgICAgICAgICBfbmFtZTogcmVjb3JkW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldLFxuICAgICAgICAgICAgX29iamVjdF9uYW1lOiBpdGVtLm9iamVjdF9uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfSxcbiAgJ29iamVjdF9yZWNvcmRfc2VhcmNoJzogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBkYXRhLCBzZWFyY2hUZXh0LCBzZWxmLCBzcGFjZTtcbiAgICBzZWxmID0gdGhpcztcbiAgICBkYXRhID0gbmV3IEFycmF5KCk7XG4gICAgc2VhcmNoVGV4dCA9IG9wdGlvbnMuc2VhcmNoVGV4dDtcbiAgICBzcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gICAgXy5mb3JFYWNoKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgZnVuY3Rpb24oX29iamVjdCwgbmFtZSkge1xuICAgICAgdmFyIG9iamVjdF9yZWNvcmQ7XG4gICAgICBpZiAoX29iamVjdC5lbmFibGVfc2VhcmNoKSB7XG4gICAgICAgIG9iamVjdF9yZWNvcmQgPSBzZWFyY2hfb2JqZWN0KHNwYWNlLCBfb2JqZWN0Lm5hbWUsIHNlbGYudXNlcklkLCBzZWFyY2hUZXh0KTtcbiAgICAgICAgcmV0dXJuIGRhdGEgPSBkYXRhLmNvbmNhdChvYmplY3RfcmVjb3JkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuICAgIHVwZGF0ZV9maWx0ZXJzOiAobGlzdHZpZXdfaWQsIGZpbHRlcnMsIGZpbHRlcl9zY29wZSwgZmlsdGVyX2xvZ2ljKS0+XG4gICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy5kaXJlY3QudXBkYXRlKHtfaWQ6IGxpc3R2aWV3X2lkfSwgeyRzZXQ6IHtmaWx0ZXJzOiBmaWx0ZXJzLCBmaWx0ZXJfc2NvcGU6IGZpbHRlcl9zY29wZSwgZmlsdGVyX2xvZ2ljOiBmaWx0ZXJfbG9naWN9fSlcblxuICAgIHVwZGF0ZV9jb2x1bW5zOiAobGlzdHZpZXdfaWQsIGNvbHVtbnMpLT5cbiAgICAgICAgY2hlY2soY29sdW1ucywgQXJyYXkpXG4gICAgICAgIFxuICAgICAgICBpZiBjb2x1bW5zLmxlbmd0aCA8IDFcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAwLCBcIlNlbGVjdCBhdCBsZWFzdCBvbmUgZmllbGQgdG8gZGlzcGxheVwiXG4gICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy51cGRhdGUoe19pZDogbGlzdHZpZXdfaWR9LCB7JHNldDoge2NvbHVtbnM6IGNvbHVtbnN9fSlcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgdXBkYXRlX2ZpbHRlcnM6IGZ1bmN0aW9uKGxpc3R2aWV3X2lkLCBmaWx0ZXJzLCBmaWx0ZXJfc2NvcGUsIGZpbHRlcl9sb2dpYykge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IGxpc3R2aWV3X2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBmaWx0ZXJzOiBmaWx0ZXJzLFxuICAgICAgICBmaWx0ZXJfc2NvcGU6IGZpbHRlcl9zY29wZSxcbiAgICAgICAgZmlsdGVyX2xvZ2ljOiBmaWx0ZXJfbG9naWNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlX2NvbHVtbnM6IGZ1bmN0aW9uKGxpc3R2aWV3X2lkLCBjb2x1bW5zKSB7XG4gICAgY2hlY2soY29sdW1ucywgQXJyYXkpO1xuICAgIGlmIChjb2x1bW5zLmxlbmd0aCA8IDEpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIlNlbGVjdCBhdCBsZWFzdCBvbmUgZmllbGQgdG8gZGlzcGxheVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy51cGRhdGUoe1xuICAgICAgX2lkOiBsaXN0dmlld19pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgY29sdW1uczogY29sdW1uc1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdCdyZXBvcnRfZGF0YSc6IChvcHRpb25zKS0+XG5cdFx0Y2hlY2sob3B0aW9ucywgT2JqZWN0KVxuXHRcdHNwYWNlID0gb3B0aW9ucy5zcGFjZVxuXHRcdGZpZWxkcyA9IG9wdGlvbnMuZmllbGRzXG5cdFx0b2JqZWN0X25hbWUgPSBvcHRpb25zLm9iamVjdF9uYW1lXG5cdFx0ZmlsdGVyX3Njb3BlID0gb3B0aW9ucy5maWx0ZXJfc2NvcGVcblx0XHRmaWx0ZXJzID0gb3B0aW9ucy5maWx0ZXJzXG5cdFx0ZmlsdGVyRmllbGRzID0ge31cblx0XHRjb21wb3VuZEZpZWxkcyA9IFtdXG5cdFx0b2JqZWN0RmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5maWVsZHNcblx0XHRfLmVhY2ggZmllbGRzLCAoaXRlbSwgaW5kZXgpLT5cblx0XHRcdHNwbGl0cyA9IGl0ZW0uc3BsaXQoXCIuXCIpXG5cdFx0XHRuYW1lID0gc3BsaXRzWzBdXG5cdFx0XHRvYmplY3RGaWVsZCA9IG9iamVjdEZpZWxkc1tuYW1lXVxuXHRcdFx0aWYgc3BsaXRzLmxlbmd0aCA+IDEgYW5kIG9iamVjdEZpZWxkXG5cdFx0XHRcdGNoaWxkS2V5ID0gaXRlbS5yZXBsYWNlIG5hbWUgKyBcIi5cIiwgXCJcIlxuXHRcdFx0XHRjb21wb3VuZEZpZWxkcy5wdXNoKHtuYW1lOiBuYW1lLCBjaGlsZEtleTogY2hpbGRLZXksIGZpZWxkOiBvYmplY3RGaWVsZH0pXG5cdFx0XHRmaWx0ZXJGaWVsZHNbbmFtZV0gPSAxXG5cblx0XHRzZWxlY3RvciA9IHt9XG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcblx0XHRzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXG5cdFx0aWYgZmlsdGVyX3Njb3BlID09IFwic3BhY2V4XCJcblx0XHRcdHNlbGVjdG9yLnNwYWNlID0gXG5cdFx0XHRcdCRpbjogW251bGwsc3BhY2VdXG5cdFx0ZWxzZSBpZiBmaWx0ZXJfc2NvcGUgPT0gXCJtaW5lXCJcblx0XHRcdHNlbGVjdG9yLm93bmVyID0gdXNlcklkXG5cblx0XHRpZiBDcmVhdG9yLmlzQ29tbW9uU3BhY2Uoc3BhY2UpICYmIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlLCBAdXNlcklkKVxuXHRcdFx0ZGVsZXRlIHNlbGVjdG9yLnNwYWNlXG5cblx0XHRpZiBmaWx0ZXJzIGFuZCBmaWx0ZXJzLmxlbmd0aCA+IDBcblx0XHRcdHNlbGVjdG9yW1wiJGFuZFwiXSA9IGZpbHRlcnNcblxuXHRcdGN1cnNvciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvciwge2ZpZWxkczogZmlsdGVyRmllbGRzLCBza2lwOiAwLCBsaW1pdDogMTAwMDB9KVxuI1x0XHRpZiBjdXJzb3IuY291bnQoKSA+IDEwMDAwXG4jXHRcdFx0cmV0dXJuIFtdXG5cdFx0cmVzdWx0ID0gY3Vyc29yLmZldGNoKClcblx0XHRpZiBjb21wb3VuZEZpZWxkcy5sZW5ndGhcblx0XHRcdHJlc3VsdCA9IHJlc3VsdC5tYXAgKGl0ZW0saW5kZXgpLT5cblx0XHRcdFx0Xy5lYWNoIGNvbXBvdW5kRmllbGRzLCAoY29tcG91bmRGaWVsZEl0ZW0sIGluZGV4KS0+XG5cdFx0XHRcdFx0aXRlbUtleSA9IGNvbXBvdW5kRmllbGRJdGVtLm5hbWUgKyBcIiolKlwiICsgY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXkucmVwbGFjZSgvXFwuL2csIFwiKiUqXCIpXG5cdFx0XHRcdFx0aXRlbVZhbHVlID0gaXRlbVtjb21wb3VuZEZpZWxkSXRlbS5uYW1lXVxuXHRcdFx0XHRcdHR5cGUgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC50eXBlXG5cdFx0XHRcdFx0aWYgW1wibG9va3VwXCIsIFwibWFzdGVyX2RldGFpbFwiXS5pbmRleE9mKHR5cGUpID4gLTFcblx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRcdFx0Y29tcG91bmRGaWx0ZXJGaWVsZHMgPSB7fVxuXHRcdFx0XHRcdFx0Y29tcG91bmRGaWx0ZXJGaWVsZHNbY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldID0gMVxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlSXRlbSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8pLmZpbmRPbmUge19pZDogaXRlbVZhbHVlfSwgZmllbGRzOiBjb21wb3VuZEZpbHRlckZpZWxkc1xuXHRcdFx0XHRcdFx0aWYgcmVmZXJlbmNlSXRlbVxuXHRcdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gcmVmZXJlbmNlSXRlbVtjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV1cblx0XHRcdFx0XHRlbHNlIGlmIHR5cGUgPT0gXCJzZWxlY3RcIlxuXHRcdFx0XHRcdFx0b3B0aW9ucyA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLm9wdGlvbnNcblx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSBfLmZpbmRXaGVyZShvcHRpb25zLCB7dmFsdWU6IGl0ZW1WYWx1ZX0pPy5sYWJlbCBvciBpdGVtVmFsdWVcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gaXRlbVZhbHVlXG5cdFx0XHRcdFx0dW5sZXNzIGl0ZW1baXRlbUtleV1cblx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSBcIi0tXCJcblx0XHRcdFx0cmV0dXJuIGl0ZW1cblx0XHRcdHJldHVybiByZXN1bHRcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gcmVzdWx0XG5cbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgJ3JlcG9ydF9kYXRhJzogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBjb21wb3VuZEZpZWxkcywgY3Vyc29yLCBmaWVsZHMsIGZpbHRlckZpZWxkcywgZmlsdGVyX3Njb3BlLCBmaWx0ZXJzLCBvYmplY3RGaWVsZHMsIG9iamVjdF9uYW1lLCByZWYsIHJlc3VsdCwgc2VsZWN0b3IsIHNwYWNlLCB1c2VySWQ7XG4gICAgY2hlY2sob3B0aW9ucywgT2JqZWN0KTtcbiAgICBzcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gICAgZmllbGRzID0gb3B0aW9ucy5maWVsZHM7XG4gICAgb2JqZWN0X25hbWUgPSBvcHRpb25zLm9iamVjdF9uYW1lO1xuICAgIGZpbHRlcl9zY29wZSA9IG9wdGlvbnMuZmlsdGVyX3Njb3BlO1xuICAgIGZpbHRlcnMgPSBvcHRpb25zLmZpbHRlcnM7XG4gICAgZmlsdGVyRmllbGRzID0ge307XG4gICAgY29tcG91bmRGaWVsZHMgPSBbXTtcbiAgICBvYmplY3RGaWVsZHMgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMDtcbiAgICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgdmFyIGNoaWxkS2V5LCBuYW1lLCBvYmplY3RGaWVsZCwgc3BsaXRzO1xuICAgICAgc3BsaXRzID0gaXRlbS5zcGxpdChcIi5cIik7XG4gICAgICBuYW1lID0gc3BsaXRzWzBdO1xuICAgICAgb2JqZWN0RmllbGQgPSBvYmplY3RGaWVsZHNbbmFtZV07XG4gICAgICBpZiAoc3BsaXRzLmxlbmd0aCA+IDEgJiYgb2JqZWN0RmllbGQpIHtcbiAgICAgICAgY2hpbGRLZXkgPSBpdGVtLnJlcGxhY2UobmFtZSArIFwiLlwiLCBcIlwiKTtcbiAgICAgICAgY29tcG91bmRGaWVsZHMucHVzaCh7XG4gICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICBjaGlsZEtleTogY2hpbGRLZXksXG4gICAgICAgICAgZmllbGQ6IG9iamVjdEZpZWxkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZpbHRlckZpZWxkc1tuYW1lXSA9IDE7XG4gICAgfSk7XG4gICAgc2VsZWN0b3IgPSB7fTtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlO1xuICAgIGlmIChmaWx0ZXJfc2NvcGUgPT09IFwic3BhY2V4XCIpIHtcbiAgICAgIHNlbGVjdG9yLnNwYWNlID0ge1xuICAgICAgICAkaW46IFtudWxsLCBzcGFjZV1cbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChmaWx0ZXJfc2NvcGUgPT09IFwibWluZVwiKSB7XG4gICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZDtcbiAgICB9XG4gICAgaWYgKENyZWF0b3IuaXNDb21tb25TcGFjZShzcGFjZSkgJiYgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2UsIHRoaXMudXNlcklkKSkge1xuICAgICAgZGVsZXRlIHNlbGVjdG9yLnNwYWNlO1xuICAgIH1cbiAgICBpZiAoZmlsdGVycyAmJiBmaWx0ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHNlbGVjdG9yW1wiJGFuZFwiXSA9IGZpbHRlcnM7XG4gICAgfVxuICAgIGN1cnNvciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvciwge1xuICAgICAgZmllbGRzOiBmaWx0ZXJGaWVsZHMsXG4gICAgICBza2lwOiAwLFxuICAgICAgbGltaXQ6IDEwMDAwXG4gICAgfSk7XG4gICAgcmVzdWx0ID0gY3Vyc29yLmZldGNoKCk7XG4gICAgaWYgKGNvbXBvdW5kRmllbGRzLmxlbmd0aCkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0Lm1hcChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICBfLmVhY2goY29tcG91bmRGaWVsZHMsIGZ1bmN0aW9uKGNvbXBvdW5kRmllbGRJdGVtLCBpbmRleCkge1xuICAgICAgICAgIHZhciBjb21wb3VuZEZpbHRlckZpZWxkcywgaXRlbUtleSwgaXRlbVZhbHVlLCByZWYxLCByZWZlcmVuY2VJdGVtLCByZWZlcmVuY2VfdG8sIHR5cGU7XG4gICAgICAgICAgaXRlbUtleSA9IGNvbXBvdW5kRmllbGRJdGVtLm5hbWUgKyBcIiolKlwiICsgY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXkucmVwbGFjZSgvXFwuL2csIFwiKiUqXCIpO1xuICAgICAgICAgIGl0ZW1WYWx1ZSA9IGl0ZW1bY29tcG91bmRGaWVsZEl0ZW0ubmFtZV07XG4gICAgICAgICAgdHlwZSA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLnR5cGU7XG4gICAgICAgICAgaWYgKFtcImxvb2t1cFwiLCBcIm1hc3Rlcl9kZXRhaWxcIl0uaW5kZXhPZih0eXBlKSA+IC0xKSB7XG4gICAgICAgICAgICByZWZlcmVuY2VfdG8gPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICBjb21wb3VuZEZpbHRlckZpZWxkcyA9IHt9O1xuICAgICAgICAgICAgY29tcG91bmRGaWx0ZXJGaWVsZHNbY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldID0gMTtcbiAgICAgICAgICAgIHJlZmVyZW5jZUl0ZW0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvKS5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiBpdGVtVmFsdWVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiBjb21wb3VuZEZpbHRlckZpZWxkc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocmVmZXJlbmNlSXRlbSkge1xuICAgICAgICAgICAgICBpdGVtW2l0ZW1LZXldID0gcmVmZXJlbmNlSXRlbVtjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQub3B0aW9ucztcbiAgICAgICAgICAgIGl0ZW1baXRlbUtleV0gPSAoKHJlZjEgPSBfLmZpbmRXaGVyZShvcHRpb25zLCB7XG4gICAgICAgICAgICAgIHZhbHVlOiBpdGVtVmFsdWVcbiAgICAgICAgICAgIH0pKSAhPSBudWxsID8gcmVmMS5sYWJlbCA6IHZvaWQgMCkgfHwgaXRlbVZhbHVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtW2l0ZW1LZXldID0gaXRlbVZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWl0ZW1baXRlbUtleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtW2l0ZW1LZXldID0gXCItLVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxufSk7XG4iLCIjIyNcbiAgICB0eXBlOiBcInVzZXJcIlxuICAgIG9iamVjdF9uYW1lOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICAgIHJlY29yZF9pZDogXCJ7b2JqZWN0X25hbWV9LHtsaXN0dmlld19pZH1cIlxuICAgIHNldHRpbmdzOlxuICAgICAgICBjb2x1bW5fd2lkdGg6IHsgZmllbGRfYTogMTAwLCBmaWVsZF8yOiAxNTAgfVxuICAgICAgICBzb3J0OiBbW1wiZmllbGRfYVwiLCBcImRlc2NcIl1dXG4gICAgb3duZXI6IHt1c2VySWR9XG4jIyNcblxuTWV0ZW9yLm1ldGhvZHNcbiAgICBcInRhYnVsYXJfc29ydF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgc29ydCktPlxuICAgICAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxuICAgICAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsIG93bmVyOiB1c2VySWR9KVxuICAgICAgICBpZiBzZXR0aW5nXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uc29ydFwiOiBzb3J0fX0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRvYyA9IFxuICAgICAgICAgICAgICAgIHR5cGU6IFwidXNlclwiXG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7fVxuICAgICAgICAgICAgICAgIG93bmVyOiB1c2VySWRcblxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fVxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnRcblxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKVxuXG4gICAgXCJ0YWJ1bGFyX2NvbHVtbl93aWR0aF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoKS0+XG4gICAgICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXG4gICAgICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIiwgb3duZXI6IHVzZXJJZH0pXG4gICAgICAgIGlmIHNldHRpbmdcbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5jb2x1bW5fd2lkdGhcIjogY29sdW1uX3dpZHRofX0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRvYyA9IFxuICAgICAgICAgICAgICAgIHR5cGU6IFwidXNlclwiXG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7fVxuICAgICAgICAgICAgICAgIG93bmVyOiB1c2VySWRcblxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fVxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoXG5cbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYylcblxuICAgIFwiZ3JpZF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoLCBzb3J0KS0+XG4gICAgICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXG4gICAgICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIiwgb3duZXI6IHVzZXJJZH0pXG4gICAgICAgIGlmIHNldHRpbmdcbiAgICAgICAgICAgICMg5q+P5qyh6YO95by65Yi25pS55Y+YX2lkX2FjdGlvbnPliJfnmoTlrr3luqbvvIzku6Xop6PlhrPlvZPnlKjmiLflj6rmlLnlj5jlrZfmrrXmrKHluo/ogIzmsqHmnInmlLnlj5jku7vkvZXlrZfmrrXlrr3luqbml7bvvIzliY3nq6/msqHmnInorqLpmIXliLDlrZfmrrXmrKHluo/lj5jmm7TnmoTmlbDmja7nmoTpl67pophcbiAgICAgICAgICAgIGNvbHVtbl93aWR0aC5faWRfYWN0aW9ucyA9IGlmIHNldHRpbmcuc2V0dGluZ3NbXCIje2xpc3Rfdmlld19pZH1cIl0/LmNvbHVtbl93aWR0aD8uX2lkX2FjdGlvbnMgPT0gNDYgdGhlbiA0NyBlbHNlIDQ2XG4gICAgICAgICAgICBpZiBzb3J0XG4gICAgICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LnNvcnRcIjogc29ydCwgXCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uY29sdW1uX3dpZHRoXCI6IGNvbHVtbl93aWR0aH19KVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5jb2x1bW5fd2lkdGhcIjogY29sdW1uX3dpZHRofX0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRvYyA9XG4gICAgICAgICAgICAgICAgdHlwZTogXCJ1c2VyXCJcbiAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHt9XG4gICAgICAgICAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9XG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5jb2x1bW5fd2lkdGggPSBjb2x1bW5fd2lkdGhcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0XG5cbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYykiLCJcbi8qXG4gICAgdHlwZTogXCJ1c2VyXCJcbiAgICBvYmplY3RfbmFtZTogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgICByZWNvcmRfaWQ6IFwie29iamVjdF9uYW1lfSx7bGlzdHZpZXdfaWR9XCJcbiAgICBzZXR0aW5nczpcbiAgICAgICAgY29sdW1uX3dpZHRoOiB7IGZpZWxkX2E6IDEwMCwgZmllbGRfMjogMTUwIH1cbiAgICAgICAgc29ydDogW1tcImZpZWxkX2FcIiwgXCJkZXNjXCJdXVxuICAgIG93bmVyOiB7dXNlcklkfVxuICovXG5NZXRlb3IubWV0aG9kcyh7XG4gIFwidGFidWxhcl9zb3J0X3NldHRpbmdzXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIHNvcnQpIHtcbiAgICB2YXIgZG9jLCBvYmosIHNldHRpbmcsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICBvd25lcjogdXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNldHRpbmcpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDogKFxuICAgICAgICAgIG9iaiA9IHt9LFxuICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuc29ydFwiXSA9IHNvcnQsXG4gICAgICAgICAgb2JqXG4gICAgICAgIClcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2MgPSB7XG4gICAgICAgIHR5cGU6IFwidXNlclwiLFxuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge307XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydDtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpO1xuICAgIH1cbiAgfSxcbiAgXCJ0YWJ1bGFyX2NvbHVtbl93aWR0aF9zZXR0aW5nc1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5fd2lkdGgpIHtcbiAgICB2YXIgZG9jLCBvYmosIHNldHRpbmcsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICBvd25lcjogdXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNldHRpbmcpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDogKFxuICAgICAgICAgIG9iaiA9IHt9LFxuICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuY29sdW1uX3dpZHRoXCJdID0gY29sdW1uX3dpZHRoLFxuICAgICAgICAgIG9ialxuICAgICAgICApXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jID0ge1xuICAgICAgICB0eXBlOiBcInVzZXJcIixcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgICBzZXR0aW5nczoge30sXG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH07XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoO1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYyk7XG4gICAgfVxuICB9LFxuICBcImdyaWRfc2V0dGluZ3NcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoLCBzb3J0KSB7XG4gICAgdmFyIGRvYywgb2JqLCBvYmoxLCByZWYsIHJlZjEsIHNldHRpbmcsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCIsXG4gICAgICBvd25lcjogdXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNldHRpbmcpIHtcbiAgICAgIGNvbHVtbl93aWR0aC5faWRfYWN0aW9ucyA9ICgocmVmID0gc2V0dGluZy5zZXR0aW5nc1tcIlwiICsgbGlzdF92aWV3X2lkXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmNvbHVtbl93aWR0aCkgIT0gbnVsbCA/IHJlZjEuX2lkX2FjdGlvbnMgOiB2b2lkIDAgOiB2b2lkIDApID09PSA0NiA/IDQ3IDogNDY7XG4gICAgICBpZiAoc29ydCkge1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IChcbiAgICAgICAgICAgIG9iaiA9IHt9LFxuICAgICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5zb3J0XCJdID0gc29ydCxcbiAgICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuY29sdW1uX3dpZHRoXCJdID0gY29sdW1uX3dpZHRoLFxuICAgICAgICAgICAgb2JqXG4gICAgICAgICAgKVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDogKFxuICAgICAgICAgICAgb2JqMSA9IHt9LFxuICAgICAgICAgICAgb2JqMVtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuY29sdW1uX3dpZHRoXCJdID0gY29sdW1uX3dpZHRoLFxuICAgICAgICAgICAgb2JqMVxuICAgICAgICAgIClcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYyA9IHtcbiAgICAgICAgdHlwZTogXCJ1c2VyXCIsXG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIixcbiAgICAgICAgc2V0dGluZ3M6IHt9LFxuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aDtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0O1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYyk7XG4gICAgfVxuICB9XG59KTtcbiIsInhtbDJqcyA9IHJlcXVpcmUgJ3htbDJqcydcbmZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbm1rZGlycCA9IHJlcXVpcmUgJ21rZGlycCdcblxubG9nZ2VyID0gbmV3IExvZ2dlciAnRXhwb3J0X1RPX1hNTCdcblxuX3dyaXRlWG1sRmlsZSA9IChqc29uT2JqLG9iak5hbWUpIC0+XG5cdCMg6L2seG1sXG5cdGJ1aWxkZXIgPSBuZXcgeG1sMmpzLkJ1aWxkZXIoKVxuXHR4bWwgPSBidWlsZGVyLmJ1aWxkT2JqZWN0IGpzb25PYmpcblxuXHQjIOi9rOS4umJ1ZmZlclxuXHRzdHJlYW0gPSBuZXcgQnVmZmVyIHhtbFxuXG5cdCMg5qC55o2u5b2T5aSp5pe26Ze055qE5bm05pyI5pel5L2c5Li65a2Y5YKo6Lev5b6EXG5cdG5vdyA9IG5ldyBEYXRlXG5cdHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuXHRtb250aCA9IG5vdy5nZXRNb250aCgpICsgMVxuXHRkYXkgPSBub3cuZ2V0RGF0ZSgpXG5cblx0IyDmlofku7bot6/lvoRcblx0ZmlsZVBhdGggPSBwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCcuLi8uLi8uLi9leHBvcnQvJyArIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGRheSArICcvJyArIG9iak5hbWUgKVxuXHRmaWxlTmFtZSA9IGpzb25PYmo/Ll9pZCArIFwiLnhtbFwiXG5cdGZpbGVBZGRyZXNzID0gcGF0aC5qb2luIGZpbGVQYXRoLCBmaWxlTmFtZVxuXG5cdGlmICFmcy5leGlzdHNTeW5jIGZpbGVQYXRoXG5cdFx0bWtkaXJwLnN5bmMgZmlsZVBhdGhcblxuXHQjIOWGmeWFpeaWh+S7tlxuXHRmcy53cml0ZUZpbGUgZmlsZUFkZHJlc3MsIHN0cmVhbSwgKGVycikgLT5cblx0XHRpZiBlcnJcblx0XHRcdGxvZ2dlci5lcnJvciBcIiN7anNvbk9iai5faWR95YaZ5YWleG1s5paH5Lu25aSx6LSlXCIsZXJyXG5cdFxuXHRyZXR1cm4gZmlsZVBhdGhcblxuXG4jIOaVtOeQhkZpZWxkc+eahGpzb27mlbDmja5cbl9taXhGaWVsZHNEYXRhID0gKG9iaixvYmpOYW1lKSAtPlxuXHQjIOWIneWni+WMluWvueixoeaVsOaNrlxuXHRqc29uT2JqID0ge31cblx0IyDojrflj5ZmaWVsZHNcblx0b2JqRmllbGRzID0gQ3JlYXRvcj8uZ2V0T2JqZWN0KG9iak5hbWUpPy5maWVsZHNcblxuXHRtaXhEZWZhdWx0ID0gKGZpZWxkX25hbWUpLT5cblx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gb2JqW2ZpZWxkX25hbWVdIHx8IFwiXCJcblxuXHRtaXhEYXRlID0gKGZpZWxkX25hbWUsdHlwZSktPlxuXHRcdGRhdGUgPSBvYmpbZmllbGRfbmFtZV1cblx0XHRpZiB0eXBlID09IFwiZGF0ZVwiXG5cdFx0XHRmb3JtYXQgPSBcIllZWVktTU0tRERcIlxuXHRcdGVsc2Vcblx0XHRcdGZvcm1hdCA9IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiXG5cdFx0aWYgZGF0ZT8gYW5kIGZvcm1hdD9cblx0XHRcdGRhdGVTdHIgPSBtb21lbnQoZGF0ZSkuZm9ybWF0KGZvcm1hdClcblx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gZGF0ZVN0ciB8fCBcIlwiXG5cblx0bWl4Qm9vbCA9IChmaWVsZF9uYW1lKS0+XG5cdFx0aWYgb2JqW2ZpZWxkX25hbWVdID09IHRydWVcblx0XHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuaYr1wiXG5cdFx0ZWxzZSBpZiBvYmpbZmllbGRfbmFtZV0gPT0gZmFsc2Vcblx0XHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuWQplwiXG5cdFx0ZWxzZVxuXHRcdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IFwiXCJcblxuXHQjIOW+queOr+avj+S4qmZpZWxkcyzlubbliKTmlq3lj5blgLxcblx0Xy5lYWNoIG9iakZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0c3dpdGNoIGZpZWxkPy50eXBlXG5cdFx0XHR3aGVuIFwiZGF0ZVwiLFwiZGF0ZXRpbWVcIiB0aGVuIG1peERhdGUgZmllbGRfbmFtZSxmaWVsZC50eXBlXG5cdFx0XHR3aGVuIFwiYm9vbGVhblwiIHRoZW4gbWl4Qm9vbCBmaWVsZF9uYW1lXG5cdFx0XHRlbHNlIG1peERlZmF1bHQgZmllbGRfbmFtZVxuXG5cdHJldHVybiBqc29uT2JqXG5cbiMg6I635Y+W5a2Q6KGo5pW055CG5pWw5o2uXG5fbWl4UmVsYXRlZERhdGEgPSAob2JqLG9iak5hbWUpIC0+XG5cdCMg5Yid5aeL5YyW5a+56LGh5pWw5o2uXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IHt9XG5cblx0IyDojrflj5bnm7jlhbPooahcblx0cmVsYXRlZE9iak5hbWVzID0gQ3JlYXRvcj8uZ2V0QWxsUmVsYXRlZE9iamVjdHMgb2JqTmFtZVxuXG5cdCMg5b6q546v55u45YWz6KGoXG5cdHJlbGF0ZWRPYmpOYW1lcy5mb3JFYWNoIChyZWxhdGVkT2JqTmFtZSkgLT5cblx0XHQjIOavj+S4quihqOWumuS5ieS4gOS4quWvueixoeaVsOe7hFxuXHRcdHJlbGF0ZWRUYWJsZURhdGEgPSBbXVxuXG5cdFx0IyAq6K6+572u5YWz6IGU5pCc57Si5p+l6K+i55qE5a2X5q61XG5cdFx0IyDpmYTku7bnmoTlhbPogZTmkJzntKLlrZfmrrXmmK/lrprmrbvnmoRcblx0XHRpZiByZWxhdGVkT2JqTmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSBcInBhcmVudC5pZHNcIlxuXHRcdGVsc2Vcblx0XHRcdCMg6I635Y+WZmllbGRzXG5cdFx0XHRmaWVsZHMgPSBDcmVhdG9yPy5PYmplY3RzW3JlbGF0ZWRPYmpOYW1lXT8uZmllbGRzXG5cdFx0XHQjIOW+queOr+avj+S4qmZpZWxkLOaJvuWHunJlZmVyZW5jZV90b+eahOWFs+iBlOWtl+autVxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gXCJcIlxuXHRcdFx0Xy5lYWNoIGZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0XHRcdGlmIGZpZWxkPy5yZWZlcmVuY2VfdG8gPT0gb2JqTmFtZVxuXHRcdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IGZpZWxkX25hbWVcblxuXHRcdCMg5qC55o2u5om+5Ye655qE5YWz6IGU5a2X5q6177yM5p+l5a2Q6KGo5pWw5o2uXG5cdFx0aWYgcmVsYXRlZF9maWVsZF9uYW1lXG5cdFx0XHRyZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqTmFtZSlcblx0XHRcdCMg6I635Y+W5Yiw5omA5pyJ55qE5pWw5o2uXG5cdFx0XHRyZWxhdGVkUmVjb3JkTGlzdCA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoe1wiI3tyZWxhdGVkX2ZpZWxkX25hbWV9XCI6b2JqLl9pZH0pLmZldGNoKClcblx0XHRcdCMg5b6q546v5q+P5LiA5p2h5pWw5o2uXG5cdFx0XHRyZWxhdGVkUmVjb3JkTGlzdC5mb3JFYWNoIChyZWxhdGVkT2JqKS0+XG5cdFx0XHRcdCMg5pW05ZCIZmllbGRz5pWw5o2uXG5cdFx0XHRcdGZpZWxkc0RhdGEgPSBfbWl4RmllbGRzRGF0YSByZWxhdGVkT2JqLHJlbGF0ZWRPYmpOYW1lXG5cdFx0XHRcdCMg5oqK5LiA5p2h6K6w5b2V5o+S5YWl5Yiw5a+56LGh5pWw57uE5LitXG5cdFx0XHRcdHJlbGF0ZWRUYWJsZURhdGEucHVzaCBmaWVsZHNEYXRhXG5cblx0XHQjIOaKiuS4gOS4quWtkOihqOeahOaJgOacieaVsOaNruaPkuWFpeWIsHJlbGF0ZWRfb2JqZWN0c+S4re+8jOWGjeW+queOr+S4i+S4gOS4qlxuXHRcdHJlbGF0ZWRfb2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0gPSByZWxhdGVkVGFibGVEYXRhXG5cblx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xuXG4jIENyZWF0b3IuRXhwb3J0MnhtbCgpXG5DcmVhdG9yLkV4cG9ydDJ4bWwgPSAob2JqTmFtZSwgcmVjb3JkTGlzdCkgLT5cblx0bG9nZ2VyLmluZm8gXCJSdW4gQ3JlYXRvci5FeHBvcnQyeG1sXCJcblxuXHRjb25zb2xlLnRpbWUgXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIlxuXG5cdCMg5rWL6K+V5pWw5o2uXG5cdCMgb2JqTmFtZSA9IFwiYXJjaGl2ZV9yZWNvcmRzXCJcblxuXHQjIOafpeaJvuWvueixoeaVsOaNrlxuXHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iak5hbWUpXG5cdCMg5rWL6K+V5pWw5o2uXG5cdHJlY29yZExpc3QgPSBjb2xsZWN0aW9uLmZpbmQoe30pLmZldGNoKClcblxuXHRyZWNvcmRMaXN0LmZvckVhY2ggKHJlY29yZE9iaiktPlxuXHRcdGpzb25PYmogPSB7fVxuXHRcdGpzb25PYmouX2lkID0gcmVjb3JkT2JqLl9pZFxuXG5cdFx0IyDmlbTnkIbkuLvooajnmoRGaWVsZHPmlbDmja5cblx0XHRmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEgcmVjb3JkT2JqLG9iak5hbWVcblx0XHRqc29uT2JqW29iak5hbWVdID0gZmllbGRzRGF0YVxuXG5cdFx0IyDmlbTnkIbnm7jlhbPooajmlbDmja5cblx0XHRyZWxhdGVkX29iamVjdHMgPSBfbWl4UmVsYXRlZERhdGEgcmVjb3JkT2JqLG9iak5hbWVcblxuXHRcdGpzb25PYmpbXCJyZWxhdGVkX29iamVjdHNcIl0gPSByZWxhdGVkX29iamVjdHNcblxuXHRcdCMg6L2s5Li6eG1s5L+d5a2Y5paH5Lu2XG5cdFx0ZmlsZVBhdGggPSBfd3JpdGVYbWxGaWxlIGpzb25PYmosb2JqTmFtZVxuXG5cdGNvbnNvbGUudGltZUVuZCBcIkNyZWF0b3IuRXhwb3J0MnhtbFwiXG5cdHJldHVybiBmaWxlUGF0aCIsInZhciBfbWl4RmllbGRzRGF0YSwgX21peFJlbGF0ZWREYXRhLCBfd3JpdGVYbWxGaWxlLCBmcywgbG9nZ2VyLCBta2RpcnAsIHBhdGgsIHhtbDJqcztcblxueG1sMmpzID0gcmVxdWlyZSgneG1sMmpzJyk7XG5cbmZzID0gcmVxdWlyZSgnZnMnKTtcblxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxubWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJyk7XG5cbmxvZ2dlciA9IG5ldyBMb2dnZXIoJ0V4cG9ydF9UT19YTUwnKTtcblxuX3dyaXRlWG1sRmlsZSA9IGZ1bmN0aW9uKGpzb25PYmosIG9iak5hbWUpIHtcbiAgdmFyIGJ1aWxkZXIsIGRheSwgZmlsZUFkZHJlc3MsIGZpbGVOYW1lLCBmaWxlUGF0aCwgbW9udGgsIG5vdywgc3RyZWFtLCB4bWwsIHllYXI7XG4gIGJ1aWxkZXIgPSBuZXcgeG1sMmpzLkJ1aWxkZXIoKTtcbiAgeG1sID0gYnVpbGRlci5idWlsZE9iamVjdChqc29uT2JqKTtcbiAgc3RyZWFtID0gbmV3IEJ1ZmZlcih4bWwpO1xuICBub3cgPSBuZXcgRGF0ZTtcbiAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMTtcbiAgZGF5ID0gbm93LmdldERhdGUoKTtcbiAgZmlsZVBhdGggPSBwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCAnLi4vLi4vLi4vZXhwb3J0LycgKyB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBkYXkgKyAnLycgKyBvYmpOYW1lKTtcbiAgZmlsZU5hbWUgPSAoanNvbk9iaiAhPSBudWxsID8ganNvbk9iai5faWQgOiB2b2lkIDApICsgXCIueG1sXCI7XG4gIGZpbGVBZGRyZXNzID0gcGF0aC5qb2luKGZpbGVQYXRoLCBmaWxlTmFtZSk7XG4gIGlmICghZnMuZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcbiAgICBta2RpcnAuc3luYyhmaWxlUGF0aCk7XG4gIH1cbiAgZnMud3JpdGVGaWxlKGZpbGVBZGRyZXNzLCBzdHJlYW0sIGZ1bmN0aW9uKGVycikge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHJldHVybiBsb2dnZXIuZXJyb3IoanNvbk9iai5faWQgKyBcIuWGmeWFpXhtbOaWh+S7tuWksei0pVwiLCBlcnIpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmaWxlUGF0aDtcbn07XG5cbl9taXhGaWVsZHNEYXRhID0gZnVuY3Rpb24ob2JqLCBvYmpOYW1lKSB7XG4gIHZhciBqc29uT2JqLCBtaXhCb29sLCBtaXhEYXRlLCBtaXhEZWZhdWx0LCBvYmpGaWVsZHMsIHJlZjtcbiAganNvbk9iaiA9IHt9O1xuICBvYmpGaWVsZHMgPSB0eXBlb2YgQ3JlYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBDcmVhdG9yICE9PSBudWxsID8gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iak5hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgbWl4RGVmYXVsdCA9IGZ1bmN0aW9uKGZpZWxkX25hbWUpIHtcbiAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IG9ialtmaWVsZF9uYW1lXSB8fCBcIlwiO1xuICB9O1xuICBtaXhEYXRlID0gZnVuY3Rpb24oZmllbGRfbmFtZSwgdHlwZSkge1xuICAgIHZhciBkYXRlLCBkYXRlU3RyLCBmb3JtYXQ7XG4gICAgZGF0ZSA9IG9ialtmaWVsZF9uYW1lXTtcbiAgICBpZiAodHlwZSA9PT0gXCJkYXRlXCIpIHtcbiAgICAgIGZvcm1hdCA9IFwiWVlZWS1NTS1ERFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW06c3NcIjtcbiAgICB9XG4gICAgaWYgKChkYXRlICE9IG51bGwpICYmIChmb3JtYXQgIT0gbnVsbCkpIHtcbiAgICAgIGRhdGVTdHIgPSBtb21lbnQoZGF0ZSkuZm9ybWF0KGZvcm1hdCk7XG4gICAgfVxuICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gZGF0ZVN0ciB8fCBcIlwiO1xuICB9O1xuICBtaXhCb29sID0gZnVuY3Rpb24oZmllbGRfbmFtZSkge1xuICAgIGlmIChvYmpbZmllbGRfbmFtZV0gPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLmmK9cIjtcbiAgICB9IGVsc2UgaWYgKG9ialtmaWVsZF9uYW1lXSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLlkKZcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIlwiO1xuICAgIH1cbiAgfTtcbiAgXy5lYWNoKG9iakZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBzd2l0Y2ggKGZpZWxkICE9IG51bGwgPyBmaWVsZC50eXBlIDogdm9pZCAwKSB7XG4gICAgICBjYXNlIFwiZGF0ZVwiOlxuICAgICAgY2FzZSBcImRhdGV0aW1lXCI6XG4gICAgICAgIHJldHVybiBtaXhEYXRlKGZpZWxkX25hbWUsIGZpZWxkLnR5cGUpO1xuICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgcmV0dXJuIG1peEJvb2woZmllbGRfbmFtZSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbWl4RGVmYXVsdChmaWVsZF9uYW1lKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4ganNvbk9iajtcbn07XG5cbl9taXhSZWxhdGVkRGF0YSA9IGZ1bmN0aW9uKG9iaiwgb2JqTmFtZSkge1xuICB2YXIgcmVsYXRlZE9iak5hbWVzLCByZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IHt9O1xuICByZWxhdGVkT2JqTmFtZXMgPSB0eXBlb2YgQ3JlYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBDcmVhdG9yICE9PSBudWxsID8gQ3JlYXRvci5nZXRBbGxSZWxhdGVkT2JqZWN0cyhvYmpOYW1lKSA6IHZvaWQgMDtcbiAgcmVsYXRlZE9iak5hbWVzLmZvckVhY2goZnVuY3Rpb24ocmVsYXRlZE9iak5hbWUpIHtcbiAgICB2YXIgZmllbGRzLCBvYmoxLCByZWYsIHJlbGF0ZWRDb2xsZWN0aW9uLCByZWxhdGVkUmVjb3JkTGlzdCwgcmVsYXRlZFRhYmxlRGF0YSwgcmVsYXRlZF9maWVsZF9uYW1lO1xuICAgIHJlbGF0ZWRUYWJsZURhdGEgPSBbXTtcbiAgICBpZiAocmVsYXRlZE9iak5hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwicGFyZW50Lmlkc1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWVsZHMgPSB0eXBlb2YgQ3JlYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBDcmVhdG9yICE9PSBudWxsID8gKHJlZiA9IENyZWF0b3IuT2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0pICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gXCJcIjtcbiAgICAgIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgICAgIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnJlZmVyZW5jZV90byA6IHZvaWQgMCkgPT09IG9iak5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9maWVsZF9uYW1lID0gZmllbGRfbmFtZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChyZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgIHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmpOYW1lKTtcbiAgICAgIHJlbGF0ZWRSZWNvcmRMaXN0ID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZCgoXG4gICAgICAgIG9iajEgPSB7fSxcbiAgICAgICAgb2JqMVtcIlwiICsgcmVsYXRlZF9maWVsZF9uYW1lXSA9IG9iai5faWQsXG4gICAgICAgIG9iajFcbiAgICAgICkpLmZldGNoKCk7XG4gICAgICByZWxhdGVkUmVjb3JkTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHJlbGF0ZWRPYmopIHtcbiAgICAgICAgdmFyIGZpZWxkc0RhdGE7XG4gICAgICAgIGZpZWxkc0RhdGEgPSBfbWl4RmllbGRzRGF0YShyZWxhdGVkT2JqLCByZWxhdGVkT2JqTmFtZSk7XG4gICAgICAgIHJldHVybiByZWxhdGVkVGFibGVEYXRhLnB1c2goZmllbGRzRGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0gPSByZWxhdGVkVGFibGVEYXRhO1xuICB9KTtcbiAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbn07XG5cbkNyZWF0b3IuRXhwb3J0MnhtbCA9IGZ1bmN0aW9uKG9iak5hbWUsIHJlY29yZExpc3QpIHtcbiAgdmFyIGNvbGxlY3Rpb247XG4gIGxvZ2dlci5pbmZvKFwiUnVuIENyZWF0b3IuRXhwb3J0MnhtbFwiKTtcbiAgY29uc29sZS50aW1lKFwiQ3JlYXRvci5FeHBvcnQyeG1sXCIpO1xuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iak5hbWUpO1xuICByZWNvcmRMaXN0ID0gY29sbGVjdGlvbi5maW5kKHt9KS5mZXRjaCgpO1xuICByZWNvcmRMaXN0LmZvckVhY2goZnVuY3Rpb24ocmVjb3JkT2JqKSB7XG4gICAgdmFyIGZpZWxkc0RhdGEsIGZpbGVQYXRoLCBqc29uT2JqLCByZWxhdGVkX29iamVjdHM7XG4gICAganNvbk9iaiA9IHt9O1xuICAgIGpzb25PYmouX2lkID0gcmVjb3JkT2JqLl9pZDtcbiAgICBmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEocmVjb3JkT2JqLCBvYmpOYW1lKTtcbiAgICBqc29uT2JqW29iak5hbWVdID0gZmllbGRzRGF0YTtcbiAgICByZWxhdGVkX29iamVjdHMgPSBfbWl4UmVsYXRlZERhdGEocmVjb3JkT2JqLCBvYmpOYW1lKTtcbiAgICBqc29uT2JqW1wicmVsYXRlZF9vYmplY3RzXCJdID0gcmVsYXRlZF9vYmplY3RzO1xuICAgIHJldHVybiBmaWxlUGF0aCA9IF93cml0ZVhtbEZpbGUoanNvbk9iaiwgb2JqTmFtZSk7XG4gIH0pO1xuICBjb25zb2xlLnRpbWVFbmQoXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIik7XG4gIHJldHVybiBmaWxlUGF0aDtcbn07XG4iLCJNZXRlb3IubWV0aG9kcyBcblx0cmVsYXRlZF9vYmplY3RzX3JlY29yZHM6IChvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpLT5cblx0XHR1c2VySWQgPSB0aGlzLnVzZXJJZFxuXHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXG5cdFx0XHRzZWxlY3RvciA9IHtcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWR9XG5cdFx0ZWxzZVxuXHRcdFx0c2VsZWN0b3IgPSB7c3BhY2U6IHNwYWNlSWR9XG5cdFx0XG5cdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHQjIOmZhOS7tueahOWFs+iBlOaQnOe0ouadoeS7tuaYr+Wumuatu+eahFxuXHRcdFx0c2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lXG5cdFx0XHRzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXVxuXHRcdGVsc2Vcblx0XHRcdHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWRcblxuXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdFx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcblx0XHRcdHNlbGVjdG9yLm93bmVyID0gdXNlcklkXG5cdFx0XG5cdFx0cmVsYXRlZF9yZWNvcmRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpXG5cdFx0cmV0dXJuIHJlbGF0ZWRfcmVjb3Jkcy5jb3VudCgpIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICByZWxhdGVkX29iamVjdHNfcmVjb3JkczogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZUlkKSB7XG4gICAgdmFyIHBlcm1pc3Npb25zLCByZWxhdGVkX3JlY29yZHMsIHNlbGVjdG9yLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIikge1xuICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgIFwibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIikge1xuICAgICAgc2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lO1xuICAgICAgc2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWQ7XG4gICAgfVxuICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICAgIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMuYWxsb3dSZWFkKSB7XG4gICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZDtcbiAgICB9XG4gICAgcmVsYXRlZF9yZWNvcmRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpO1xuICAgIHJldHVybiByZWxhdGVkX3JlY29yZHMuY291bnQoKTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRnZXRQZW5kaW5nU3BhY2VJbmZvOiAoaW52aXRlcklkLCBzcGFjZUlkKS0+XG5cdFx0aW52aXRlck5hbWUgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IGludml0ZXJJZH0pLm5hbWVcblx0XHRzcGFjZU5hbWUgPSBkYi5zcGFjZXMuZmluZE9uZSh7X2lkOiBzcGFjZUlkfSkubmFtZVxuXG5cdFx0cmV0dXJuIHtpbnZpdGVyOiBpbnZpdGVyTmFtZSwgc3BhY2U6IHNwYWNlTmFtZX1cblxuXHRyZWZ1c2VKb2luU3BhY2U6IChfaWQpLT5cblx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IF9pZH0seyRzZXQ6IHtpbnZpdGVfc3RhdGU6IFwicmVmdXNlZFwifX0pXG5cblx0YWNjZXB0Sm9pblNwYWNlOiAoX2lkKS0+XG5cdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBfaWR9LHskc2V0OiB7aW52aXRlX3N0YXRlOiBcImFjY2VwdGVkXCIsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9fSlcblxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBnZXRQZW5kaW5nU3BhY2VJbmZvOiBmdW5jdGlvbihpbnZpdGVySWQsIHNwYWNlSWQpIHtcbiAgICB2YXIgaW52aXRlck5hbWUsIHNwYWNlTmFtZTtcbiAgICBpbnZpdGVyTmFtZSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBpbnZpdGVySWRcbiAgICB9KS5uYW1lO1xuICAgIHNwYWNlTmFtZSA9IGRiLnNwYWNlcy5maW5kT25lKHtcbiAgICAgIF9pZDogc3BhY2VJZFxuICAgIH0pLm5hbWU7XG4gICAgcmV0dXJuIHtcbiAgICAgIGludml0ZXI6IGludml0ZXJOYW1lLFxuICAgICAgc3BhY2U6IHNwYWNlTmFtZVxuICAgIH07XG4gIH0sXG4gIHJlZnVzZUpvaW5TcGFjZTogZnVuY3Rpb24oX2lkKSB7XG4gICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGludml0ZV9zdGF0ZTogXCJyZWZ1c2VkXCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgYWNjZXB0Sm9pblNwYWNlOiBmdW5jdGlvbihfaWQpIHtcbiAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IF9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgaW52aXRlX3N0YXRlOiBcImFjY2VwdGVkXCIsXG4gICAgICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IucHVibGlzaCBcImNyZWF0b3Jfb2JqZWN0X3JlY29yZFwiLCAob2JqZWN0X25hbWUsIGlkLCBzcGFjZV9pZCktPlxuXHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZClcblx0aWYgY29sbGVjdGlvblxuXHRcdHJldHVybiBjb2xsZWN0aW9uLmZpbmQoe19pZDogaWR9KVxuXG4iLCJNZXRlb3IucHVibGlzaChcImNyZWF0b3Jfb2JqZWN0X3JlY29yZFwiLCBmdW5jdGlvbihvYmplY3RfbmFtZSwgaWQsIHNwYWNlX2lkKSB7XG4gIHZhciBjb2xsZWN0aW9uO1xuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCk7XG4gIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICBfaWQ6IGlkXG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUgXCJzdGVlZG9zX29iamVjdF90YWJ1bGFyXCIsICh0YWJsZU5hbWUsIGlkcywgZmllbGRzLCBzcGFjZUlkKS0+XG5cdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRjaGVjayh0YWJsZU5hbWUsIFN0cmluZyk7XG5cdGNoZWNrKGlkcywgQXJyYXkpO1xuXHRjaGVjayhmaWVsZHMsIE1hdGNoLk9wdGlvbmFsKE9iamVjdCkpO1xuXG5cdF9vYmplY3RfbmFtZSA9IHRhYmxlTmFtZS5yZXBsYWNlKFwiY3JlYXRvcl9cIixcIlwiKVxuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX29iamVjdF9uYW1lLCBzcGFjZUlkKVxuXG5cdGlmIHNwYWNlSWRcblx0XHRfb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldE9iamVjdE5hbWUoX29iamVjdClcblxuXHRvYmplY3RfY29sbGVjaXRvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihfb2JqZWN0X25hbWUpXG5cblxuXHRfZmllbGRzID0gX29iamVjdD8uZmllbGRzXG5cdGlmICFfZmllbGRzIHx8ICFvYmplY3RfY29sbGVjaXRvblxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRyZWZlcmVuY2VfZmllbGRzID0gXy5maWx0ZXIgX2ZpZWxkcywgKGYpLT5cblx0XHRyZXR1cm4gXy5pc0Z1bmN0aW9uKGYucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KGYucmVmZXJlbmNlX3RvKVxuXG5cdHNlbGYgPSB0aGlzXG5cblx0c2VsZi51bmJsb2NrKCk7XG5cblx0aWYgcmVmZXJlbmNlX2ZpZWxkcy5sZW5ndGggPiAwXG5cdFx0ZGF0YSA9IHtcblx0XHRcdGZpbmQ6ICgpLT5cblx0XHRcdFx0c2VsZi51bmJsb2NrKCk7XG5cdFx0XHRcdGZpZWxkX2tleXMgPSB7fVxuXHRcdFx0XHRfLmVhY2ggXy5rZXlzKGZpZWxkcyksIChmKS0+XG5cdFx0XHRcdFx0dW5sZXNzIC9cXHcrKFxcLlxcJCl7MX1cXHc/Ly50ZXN0KGYpXG5cdFx0XHRcdFx0XHRmaWVsZF9rZXlzW2ZdID0gMVxuXHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe19pZDogeyRpbjogaWRzfX0sIHtmaWVsZHM6IGZpZWxkX2tleXN9KTtcblx0XHR9XG5cblx0XHRkYXRhLmNoaWxkcmVuID0gW11cblxuXHRcdGtleXMgPSBfLmtleXMoZmllbGRzKVxuXG5cdFx0aWYga2V5cy5sZW5ndGggPCAxXG5cdFx0XHRrZXlzID0gXy5rZXlzKF9maWVsZHMpXG5cblx0XHRfa2V5cyA9IFtdXG5cblx0XHRrZXlzLmZvckVhY2ggKGtleSktPlxuXHRcdFx0aWYgX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXVxuXHRcdFx0XHRfa2V5cyA9IF9rZXlzLmNvbmNhdChfLm1hcChfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddLCAoayktPlxuXHRcdFx0XHRcdHJldHVybiBrZXkgKyAnLicgKyBrXG5cdFx0XHRcdCkpXG5cdFx0XHRfa2V5cy5wdXNoKGtleSlcblxuXHRcdF9rZXlzLmZvckVhY2ggKGtleSktPlxuXHRcdFx0cmVmZXJlbmNlX2ZpZWxkID0gX2ZpZWxkc1trZXldXG5cblx0XHRcdGlmIHJlZmVyZW5jZV9maWVsZCAmJiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykpICAjIGFuZCBDcmVhdG9yLkNvbGxlY3Rpb25zW3JlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG9dXG5cdFx0XHRcdGRhdGEuY2hpbGRyZW4ucHVzaCB7XG5cdFx0XHRcdFx0ZmluZDogKHBhcmVudCkgLT5cblx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRzZWxmLnVuYmxvY2soKTtcblxuXHRcdFx0XHRcdFx0XHRxdWVyeSA9IHt9XG5cblx0XHRcdFx0XHRcdFx0IyDooajmoLzlrZDlrZfmrrXnibnmrorlpITnkIZcblx0XHRcdFx0XHRcdFx0aWYgL1xcdysoXFwuXFwkXFwuKXsxfVxcdysvLnRlc3Qoa2V5KVxuXHRcdFx0XHRcdFx0XHRcdHBfayA9IGtleS5yZXBsYWNlKC8oXFx3KylcXC5cXCRcXC5cXHcrL2lnLCBcIiQxXCIpXG5cdFx0XHRcdFx0XHRcdFx0c19rID0ga2V5LnJlcGxhY2UoL1xcdytcXC5cXCRcXC4oXFx3KykvaWcsIFwiJDFcIilcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfaWRzID0gcGFyZW50W3Bfa10uZ2V0UHJvcGVydHkoc19rKVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX2lkcyA9IGtleS5zcGxpdCgnLicpLnJlZHVjZSAobywgeCkgLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0bz9beF1cblx0XHRcdFx0XHRcdFx0XHQsIHBhcmVudFxuXG5cdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG9cblxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90bygpXG5cblx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KHJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRpZiBfLmlzT2JqZWN0KHJlZmVyZW5jZV9pZHMpICYmICFfLmlzQXJyYXkocmVmZXJlbmNlX2lkcylcblx0XHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9pZHMub1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX2lkcyA9IHJlZmVyZW5jZV9pZHMuaWRzIHx8IFtdXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFtdXG5cblx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpXG5cdFx0XHRcdFx0XHRcdFx0cXVlcnkuX2lkID0geyRpbjogcmVmZXJlbmNlX2lkc31cblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHJlZmVyZW5jZV9pZHNcblxuXHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG9fb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxuXG5cdFx0XHRcdFx0XHRcdG5hbWVfZmllbGRfa2V5ID0gcmVmZXJlbmNlX3RvX29iamVjdC5OQU1FX0ZJRUxEX0tFWVxuXG5cdFx0XHRcdFx0XHRcdGNoaWxkcmVuX2ZpZWxkcyA9IHtfaWQ6IDEsIHNwYWNlOiAxfVxuXG5cdFx0XHRcdFx0XHRcdGlmIG5hbWVfZmllbGRfa2V5XG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW5fZmllbGRzW25hbWVfZmllbGRfa2V5XSA9IDFcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZChxdWVyeSwge1xuXHRcdFx0XHRcdFx0XHRcdGZpZWxkczogY2hpbGRyZW5fZmllbGRzXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhyZWZlcmVuY2VfdG8sIHBhcmVudCwgZSlcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFtdXG5cdFx0XHRcdH1cblxuXHRcdHJldHVybiBkYXRhXG5cdGVsc2Vcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZmluZDogKCktPlxuXHRcdFx0XHRzZWxmLnVuYmxvY2soKTtcblx0XHRcdFx0cmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe19pZDogeyRpbjogaWRzfX0sIHtmaWVsZHM6IGZpZWxkc30pXG5cdFx0fTtcblxuIiwiTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUoXCJzdGVlZG9zX29iamVjdF90YWJ1bGFyXCIsIGZ1bmN0aW9uKHRhYmxlTmFtZSwgaWRzLCBmaWVsZHMsIHNwYWNlSWQpIHtcbiAgdmFyIF9maWVsZHMsIF9rZXlzLCBfb2JqZWN0LCBfb2JqZWN0X25hbWUsIGRhdGEsIGtleXMsIG9iamVjdF9jb2xsZWNpdG9uLCByZWZlcmVuY2VfZmllbGRzLCBzZWxmO1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBjaGVjayh0YWJsZU5hbWUsIFN0cmluZyk7XG4gIGNoZWNrKGlkcywgQXJyYXkpO1xuICBjaGVjayhmaWVsZHMsIE1hdGNoLk9wdGlvbmFsKE9iamVjdCkpO1xuICBfb2JqZWN0X25hbWUgPSB0YWJsZU5hbWUucmVwbGFjZShcImNyZWF0b3JfXCIsIFwiXCIpO1xuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX29iamVjdF9uYW1lLCBzcGFjZUlkKTtcbiAgaWYgKHNwYWNlSWQpIHtcbiAgICBfb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldE9iamVjdE5hbWUoX29iamVjdCk7XG4gIH1cbiAgb2JqZWN0X2NvbGxlY2l0b24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oX29iamVjdF9uYW1lKTtcbiAgX2ZpZWxkcyA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZmllbGRzIDogdm9pZCAwO1xuICBpZiAoIV9maWVsZHMgfHwgIW9iamVjdF9jb2xsZWNpdG9uKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZWZlcmVuY2VfZmllbGRzID0gXy5maWx0ZXIoX2ZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgIHJldHVybiBfLmlzRnVuY3Rpb24oZi5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkoZi5yZWZlcmVuY2VfdG8pO1xuICB9KTtcbiAgc2VsZiA9IHRoaXM7XG4gIHNlbGYudW5ibG9jaygpO1xuICBpZiAocmVmZXJlbmNlX2ZpZWxkcy5sZW5ndGggPiAwKSB7XG4gICAgZGF0YSA9IHtcbiAgICAgIGZpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZmllbGRfa2V5cztcbiAgICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICAgIGZpZWxkX2tleXMgPSB7fTtcbiAgICAgICAgXy5lYWNoKF8ua2V5cyhmaWVsZHMpLCBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgaWYgKCEvXFx3KyhcXC5cXCQpezF9XFx3Py8udGVzdChmKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkX2tleXNbZl0gPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtcbiAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICRpbjogaWRzXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBmaWVsZF9rZXlzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgZGF0YS5jaGlsZHJlbiA9IFtdO1xuICAgIGtleXMgPSBfLmtleXMoZmllbGRzKTtcbiAgICBpZiAoa2V5cy5sZW5ndGggPCAxKSB7XG4gICAgICBrZXlzID0gXy5rZXlzKF9maWVsZHMpO1xuICAgIH1cbiAgICBfa2V5cyA9IFtdO1xuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmIChfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddKSB7XG4gICAgICAgIF9rZXlzID0gX2tleXMuY29uY2F0KF8ubWFwKF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ10sIGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICByZXR1cm4ga2V5ICsgJy4nICsgaztcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9rZXlzLnB1c2goa2V5KTtcbiAgICB9KTtcbiAgICBfa2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIHJlZmVyZW5jZV9maWVsZDtcbiAgICAgIHJlZmVyZW5jZV9maWVsZCA9IF9maWVsZHNba2V5XTtcbiAgICAgIGlmIChyZWZlcmVuY2VfZmllbGQgJiYgKF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pKSkge1xuICAgICAgICByZXR1cm4gZGF0YS5jaGlsZHJlbi5wdXNoKHtcbiAgICAgICAgICBmaW5kOiBmdW5jdGlvbihwYXJlbnQpIHtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbl9maWVsZHMsIGUsIG5hbWVfZmllbGRfa2V5LCBwX2ssIHF1ZXJ5LCByZWZlcmVuY2VfaWRzLCByZWZlcmVuY2VfdG8sIHJlZmVyZW5jZV90b19vYmplY3QsIHNfaztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHNlbGYudW5ibG9jaygpO1xuICAgICAgICAgICAgICBxdWVyeSA9IHt9O1xuICAgICAgICAgICAgICBpZiAoL1xcdysoXFwuXFwkXFwuKXsxfVxcdysvLnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgIHBfayA9IGtleS5yZXBsYWNlKC8oXFx3KylcXC5cXCRcXC5cXHcrL2lnLCBcIiQxXCIpO1xuICAgICAgICAgICAgICAgIHNfayA9IGtleS5yZXBsYWNlKC9cXHcrXFwuXFwkXFwuKFxcdyspL2lnLCBcIiQxXCIpO1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZV9pZHMgPSBwYXJlbnRbcF9rXS5nZXRQcm9wZXJ0eShzX2spO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZV9pZHMgPSBrZXkuc3BsaXQoJy4nKS5yZWR1Y2UoZnVuY3Rpb24obywgeCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIG8gIT0gbnVsbCA/IG9beF0gOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgfSwgcGFyZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8oKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChyZWZlcmVuY2VfaWRzKSAmJiAhXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpKSB7XG4gICAgICAgICAgICAgICAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfaWRzLm87XG4gICAgICAgICAgICAgICAgICByZWZlcmVuY2VfaWRzID0gcmVmZXJlbmNlX2lkcy5pZHMgfHwgW107XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKF8uaXNBcnJheShyZWZlcmVuY2VfaWRzKSkge1xuICAgICAgICAgICAgICAgIHF1ZXJ5Ll9pZCA9IHtcbiAgICAgICAgICAgICAgICAgICRpbjogcmVmZXJlbmNlX2lkc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcXVlcnkuX2lkID0gcmVmZXJlbmNlX2lkcztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWZlcmVuY2VfdG9fb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVmZXJlbmNlX3RvLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgbmFtZV9maWVsZF9rZXkgPSByZWZlcmVuY2VfdG9fb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICAgICAgICAgICAgICBjaGlsZHJlbl9maWVsZHMgPSB7XG4gICAgICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgICAgIHNwYWNlOiAxXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGlmIChuYW1lX2ZpZWxkX2tleSkge1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuX2ZpZWxkc1tuYW1lX2ZpZWxkX2tleV0gPSAxO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kKHF1ZXJ5LCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiBjaGlsZHJlbl9maWVsZHNcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlZmVyZW5jZV90bywgcGFyZW50LCBlKTtcbiAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLnVuYmxvY2soKTtcbiAgICAgICAgcmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe1xuICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgJGluOiBpZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoIFwib2JqZWN0X2xpc3R2aWV3c1wiLCAob2JqZWN0X25hbWUsIHNwYWNlSWQpLT5cbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc3BhY2U6IHNwYWNlSWQgLFwiJG9yXCI6W3tvd25lcjogdXNlcklkfSwge3NoYXJlZDogdHJ1ZX1dfSkiLCJNZXRlb3IucHVibGlzaCBcInVzZXJfdGFidWxhcl9zZXR0aW5nc1wiLCAob2JqZWN0X25hbWUpLT5cbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmQoe29iamVjdF9uYW1lOiB7JGluOiBvYmplY3RfbmFtZX0sIHJlY29yZF9pZDogeyRpbjogW1wib2JqZWN0X2xpc3R2aWV3c1wiLCBcIm9iamVjdF9ncmlkdmlld3NcIl19LCBvd25lcjogdXNlcklkfSlcbiIsIk1ldGVvci5wdWJsaXNoIFwicmVsYXRlZF9vYmplY3RzX3JlY29yZHNcIiwgKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCktPlxuXHR1c2VySWQgPSB0aGlzLnVzZXJJZFxuXHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIlxuXHRcdHNlbGVjdG9yID0ge1wibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZH1cblx0ZWxzZVxuXHRcdHNlbGVjdG9yID0ge3NwYWNlOiBzcGFjZUlkfVxuXHRcblx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0IyDpmYTku7bnmoTlhbPogZTmkJzntKLmnaHku7bmmK/lrprmrbvnmoRcblx0XHRzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWVcblx0XHRzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXVxuXHRlbHNlXG5cdFx0c2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZFxuXG5cdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMuYWxsb3dSZWFkXG5cdFx0c2VsZWN0b3Iub3duZXIgPSB1c2VySWRcblx0XG5cdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3RvcikiLCJNZXRlb3IucHVibGlzaChcInJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzXCIsIGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCkge1xuICB2YXIgcGVybWlzc2lvbnMsIHNlbGVjdG9yLCB1c2VySWQ7XG4gIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiKSB7XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWRcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9O1xuICB9XG4gIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgc2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lO1xuICAgIHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdO1xuICB9IGVsc2Uge1xuICAgIHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWQ7XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMuYWxsb3dSZWFkKSB7XG4gICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gIH1cbiAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ3NwYWNlX3VzZXJfaW5mbycsIChzcGFjZUlkLCB1c2VySWQpLT5cblx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9KSIsIlxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cblx0TWV0ZW9yLnB1Ymxpc2ggJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJywgKHNwYWNlSWQpLT5cblxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdFx0dW5sZXNzIHNwYWNlSWRcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRcdHNlbGVjdG9yID1cblx0XHRcdHNwYWNlOiBzcGFjZUlkXG5cdFx0XHRrZXk6ICdjb250YWN0c192aWV3X2xpbWl0cydcblxuXHRcdHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKSIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBzZWxlY3RvcjtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBrZXk6ICdjb250YWN0c192aWV3X2xpbWl0cydcbiAgICB9O1xuICAgIHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKTtcbiAgfSk7XG59XG4iLCJcbmlmIE1ldGVvci5pc1NlcnZlclxuXG5cdE1ldGVvci5wdWJsaXNoICdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycycsIChzcGFjZUlkKS0+XG5cblx0XHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRcdHVubGVzcyBzcGFjZUlkXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0XHRzZWxlY3RvciA9XG5cdFx0XHRzcGFjZTogc3BhY2VJZFxuXHRcdFx0a2V5OiAnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnXG5cblx0XHRyZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3RvcikiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAga2V5OiAnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnXG4gICAgfTtcbiAgICByZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3Rvcik7XG4gIH0pO1xufVxuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG5cdE1ldGVvci5wdWJsaXNoICdzcGFjZV9uZWVkX3RvX2NvbmZpcm0nLCAoKS0+XG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcblx0XHRyZXR1cm4gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdXNlcklkLCBpbnZpdGVfc3RhdGU6IFwicGVuZGluZ1wifSkiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdzcGFjZV9uZWVkX3RvX2NvbmZpcm0nLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIGludml0ZV9zdGF0ZTogXCJwZW5kaW5nXCJcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJwZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9XG5cbnBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3dQZXJtaXNzaW9ucyA9IChmbG93X2lkLCB1c2VyX2lkKSAtPlxuXHQjIOagueaNrjpmbG93X2lk5p+l5Yiw5a+55bqU55qEZmxvd1xuXHRmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpXG5cdHNwYWNlX2lkID0gZmxvdy5zcGFjZVxuXHQjIOagueaNrnNwYWNlX2lk5ZKMOnVzZXJfaWTliLBvcmdhbml6YXRpb25z6KGo5Lit5p+l5Yiw55So5oi35omA5bGe5omA5pyJ55qEb3JnX2lk77yI5YyF5ous5LiK57qn57uESUTvvIlcblx0b3JnX2lkcyA9IG5ldyBBcnJheVxuXHRvcmdhbml6YXRpb25zID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcblx0XHRzcGFjZTogc3BhY2VfaWQsIHVzZXJzOiB1c2VyX2lkIH0sIHsgZmllbGRzOiB7IHBhcmVudHM6IDEgfSB9KS5mZXRjaCgpXG5cdF8uZWFjaChvcmdhbml6YXRpb25zLCAob3JnKSAtPlxuXHRcdG9yZ19pZHMucHVzaChvcmcuX2lkKVxuXHRcdGlmIG9yZy5wYXJlbnRzXG5cdFx0XHRfLmVhY2gob3JnLnBhcmVudHMsIChwYXJlbnRfaWQpIC0+XG5cdFx0XHRcdG9yZ19pZHMucHVzaChwYXJlbnRfaWQpXG5cdFx0XHQpXG5cdClcblx0b3JnX2lkcyA9IF8udW5pcShvcmdfaWRzKVxuXHRteV9wZXJtaXNzaW9ucyA9IG5ldyBBcnJheVxuXHRpZiBmbG93LnBlcm1zXG5cdFx0IyDliKTmlq1mbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbuS4reaYr+WQpuWMheWQq+W9k+WJjeeUqOaIt++8jFxuXHRcdCMg5oiW6ICFZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGTmmK/lkKbljIXlkKs05q2l5b6X5Yiw55qEb3JnX2lk5pWw57uE5Lit55qE5Lu75L2V5LiA5Liq77yMXG5cdFx0IyDoi6XmmK/vvIzliJnlnKjov5Tlm57nmoTmlbDnu4TkuK3liqDkuIphZGRcblx0XHRpZiBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGRcblx0XHRcdHVzZXJzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGRcblx0XHRcdGlmIHVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcl9pZClcblx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKVxuXG5cdFx0aWYgZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGRcblx0XHRcdG9yZ3NfY2FuX2FkZCA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRkXG5cdFx0XHRfLmVhY2gob3JnX2lkcywgKG9yZ19pZCkgLT5cblx0XHRcdFx0aWYgb3Jnc19jYW5fYWRkLmluY2x1ZGVzKG9yZ19pZClcblx0XHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpXG5cdFx0XHQpXG5cdFx0IyDliKTmlq1mbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9y5Lit5piv5ZCm5YyF5ZCr5b2T5YmN55So5oi377yMXG5cdFx0IyDmiJbogIVmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3LmmK/lkKbljIXlkKs05q2l5b6X5Yiw55qEb3JnX2lk5pWw57uE5Lit55qE5Lu75L2V5LiA5Liq77yMXG5cdFx0IyDoi6XmmK/vvIzliJnlnKjov5Tlm57nmoTmlbDnu4TkuK3liqDkuIptb25pdG9yXG5cdFx0aWYgZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvclxuXHRcdFx0dXNlcnNfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yXG5cdFx0XHRpZiB1c2Vyc19jYW5fbW9uaXRvci5pbmNsdWRlcyh1c2VyX2lkKVxuXHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKVxuXG5cdFx0aWYgZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yXG5cdFx0XHRvcmdzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yXG5cdFx0XHRfLmVhY2gob3JnX2lkcywgKG9yZ19pZCkgLT5cblx0XHRcdFx0aWYgb3Jnc19jYW5fbW9uaXRvci5pbmNsdWRlcyhvcmdfaWQpXG5cdFx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIilcblx0XHRcdClcblx0XHQjIOWIpOaWrWZsb3cucGVybXMudXNlcnNfY2FuX2FkbWlu5Lit5piv5ZCm5YyF5ZCr5b2T5YmN55So5oi377yMXG5cdFx0IyDmiJbogIVmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWlu5piv5ZCm5YyF5ZCrNOatpeW+l+WIsOeahG9yZ19pZOaVsOe7hOS4reeahOS7u+S9leS4gOS4qu+8jFxuXHRcdCMg6Iul5piv77yM5YiZ5Zyo6L+U5Zue55qE5pWw57uE5Lit5Yqg5LiKYWRtaW5cblx0XHRpZiBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pblxuXHRcdFx0dXNlcnNfY2FuX2FkbWluID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW5cblx0XHRcdGlmIHVzZXJzX2Nhbl9hZG1pbi5pbmNsdWRlcyh1c2VyX2lkKVxuXHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIilcblxuXHRcdGlmIGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW5cblx0XHRcdG9yZ3NfY2FuX2FkbWluID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pblxuXHRcdFx0Xy5lYWNoKG9yZ19pZHMsIChvcmdfaWQpIC0+XG5cdFx0XHRcdGlmIG9yZ3NfY2FuX2FkbWluLmluY2x1ZGVzKG9yZ19pZClcblx0XHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIilcblx0XHRcdClcblxuXHRteV9wZXJtaXNzaW9ucyA9IF8udW5pcShteV9wZXJtaXNzaW9ucylcblx0cmV0dXJuIG15X3Blcm1pc3Npb25zIiwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5wZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9O1xuXG5wZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93UGVybWlzc2lvbnMgPSBmdW5jdGlvbihmbG93X2lkLCB1c2VyX2lkKSB7XG4gIHZhciBmbG93LCBteV9wZXJtaXNzaW9ucywgb3JnX2lkcywgb3JnYW5pemF0aW9ucywgb3Jnc19jYW5fYWRkLCBvcmdzX2Nhbl9hZG1pbiwgb3Jnc19jYW5fbW9uaXRvciwgc3BhY2VfaWQsIHVzZXJzX2Nhbl9hZGQsIHVzZXJzX2Nhbl9hZG1pbiwgdXNlcnNfY2FuX21vbml0b3I7XG4gIGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZCk7XG4gIHNwYWNlX2lkID0gZmxvdy5zcGFjZTtcbiAgb3JnX2lkcyA9IG5ldyBBcnJheTtcbiAgb3JnYW5pemF0aW9ucyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHVzZXJzOiB1c2VyX2lkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHBhcmVudHM6IDFcbiAgICB9XG4gIH0pLmZldGNoKCk7XG4gIF8uZWFjaChvcmdhbml6YXRpb25zLCBmdW5jdGlvbihvcmcpIHtcbiAgICBvcmdfaWRzLnB1c2gob3JnLl9pZCk7XG4gICAgaWYgKG9yZy5wYXJlbnRzKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKG9yZy5wYXJlbnRzLCBmdW5jdGlvbihwYXJlbnRfaWQpIHtcbiAgICAgICAgcmV0dXJuIG9yZ19pZHMucHVzaChwYXJlbnRfaWQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgb3JnX2lkcyA9IF8udW5pcShvcmdfaWRzKTtcbiAgbXlfcGVybWlzc2lvbnMgPSBuZXcgQXJyYXk7XG4gIGlmIChmbG93LnBlcm1zKSB7XG4gICAgaWYgKGZsb3cucGVybXMudXNlcnNfY2FuX2FkZCkge1xuICAgICAgdXNlcnNfY2FuX2FkZCA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkZDtcbiAgICAgIGlmICh1c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJfaWQpKSB7XG4gICAgICAgIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZGRcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZCkge1xuICAgICAgb3Jnc19jYW5fYWRkID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGQ7XG4gICAgICBfLmVhY2gob3JnX2lkcywgZnVuY3Rpb24ob3JnX2lkKSB7XG4gICAgICAgIGlmIChvcmdzX2Nhbl9hZGQuaW5jbHVkZXMob3JnX2lkKSkge1xuICAgICAgICAgIHJldHVybiBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3IpIHtcbiAgICAgIHVzZXJzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvcjtcbiAgICAgIGlmICh1c2Vyc19jYW5fbW9uaXRvci5pbmNsdWRlcyh1c2VyX2lkKSkge1xuICAgICAgICBteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvcikge1xuICAgICAgb3Jnc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvcjtcbiAgICAgIF8uZWFjaChvcmdfaWRzLCBmdW5jdGlvbihvcmdfaWQpIHtcbiAgICAgICAgaWYgKG9yZ3NfY2FuX21vbml0b3IuaW5jbHVkZXMob3JnX2lkKSkge1xuICAgICAgICAgIHJldHVybiBteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbikge1xuICAgICAgdXNlcnNfY2FuX2FkbWluID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW47XG4gICAgICBpZiAodXNlcnNfY2FuX2FkbWluLmluY2x1ZGVzKHVzZXJfaWQpKSB7XG4gICAgICAgIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW4pIHtcbiAgICAgIG9yZ3NfY2FuX2FkbWluID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pbjtcbiAgICAgIF8uZWFjaChvcmdfaWRzLCBmdW5jdGlvbihvcmdfaWQpIHtcbiAgICAgICAgaWYgKG9yZ3NfY2FuX2FkbWluLmluY2x1ZGVzKG9yZ19pZCkpIHtcbiAgICAgICAgICByZXR1cm4gbXlfcGVybWlzc2lvbnMucHVzaChcImFkbWluXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgbXlfcGVybWlzc2lvbnMgPSBfLnVuaXEobXlfcGVybWlzc2lvbnMpO1xuICByZXR1cm4gbXlfcGVybWlzc2lvbnM7XG59O1xuIiwiX2V2YWwgPSByZXF1aXJlKCdldmFsJylcbm9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcbntcbiAgICBpbnNlcnRfaW5zdGFuY2VfdGFza3MsXG59ID0gcmVxdWlyZSgnQHN0ZWVkb3Mvd29ya2Zsb3cnKS53b3JrZmxvd01hbmFnZXJzLmluc3RhbmNlX3Rhc2tzX21hbmFnZXJcblxuZ2V0T2JqZWN0Q29uZmlnID0gKG9iamVjdEFwaU5hbWUpIC0+XG5cdHJldHVybiBvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkudG9Db25maWcoKVxuXG5nZXRPYmplY3ROYW1lRmllbGRLZXkgPSAob2JqZWN0QXBpTmFtZSkgLT5cblx0cmV0dXJuIG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS5OQU1FX0ZJRUxEX0tFWVxuXG5nZXRSZWxhdGVkcyA9IChvYmplY3RBcGlOYW1lKSAtPlxuXHRyZXR1cm4gTWV0ZW9yLndyYXBBc3luYygob2JqZWN0QXBpTmFtZSwgY2IpIC0+XG5cdFx0b2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLmdldFJlbGF0ZWRzKCkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuXHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxuXHRcdCkob2JqZWN0QXBpTmFtZSlcblxub2JqZWN0RmluZE9uZSA9IChvYmplY3RBcGlOYW1lLCBxdWVyeSkgLT5cblx0cmV0dXJuIE1ldGVvci53cmFwQXN5bmMoKG9iamVjdEFwaU5hbWUsIHF1ZXJ5LCBjYikgLT5cblx0XHRvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkuZmluZChxdWVyeSkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuXHRcdFx0aWYgKHJlc29sdmUgJiYgcmVzb2x2ZS5sZW5ndGggPiAwKVxuXHRcdFx0XHRjYihyZWplY3QsIHJlc29sdmVbMF0pXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGNiKHJlamVjdCwgbnVsbClcblx0XHQpKG9iamVjdEFwaU5hbWUsIHF1ZXJ5KVxuXG5vYmplY3RGaW5kID0gKG9iamVjdEFwaU5hbWUsIHF1ZXJ5KSAtPlxuXHRyZXR1cm4gTWV0ZW9yLndyYXBBc3luYygob2JqZWN0QXBpTmFtZSwgcXVlcnksIGNiKSAtPlxuXHRcdG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS5maW5kKHF1ZXJ5KS50aGVuIChyZXNvbHZlLCByZWplY3QpIC0+XG5cdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXG5cdFx0KShvYmplY3RBcGlOYW1lLCBxdWVyeSlcblxub2JqZWN0VXBkYXRlID0gKG9iamVjdEFwaU5hbWUsIGlkLCBkYXRhKSAtPlxuXHRyZXR1cm4gTWV0ZW9yLndyYXBBc3luYygob2JqZWN0QXBpTmFtZSwgaWQsIGRhdGEsIGNiKSAtPlxuXHRcdG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS51cGRhdGUoaWQsIGRhdGEpLnRoZW4gKHJlc29sdmUsIHJlamVjdCkgLT5cblx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcblx0XHQpKG9iamVjdEFwaU5hbWUsIGlkLCBkYXRhKVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge31cblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja19hdXRob3JpemF0aW9uID0gKHJlcSkgLT5cblx0cXVlcnkgPSByZXEucXVlcnlcblx0dXNlcklkID0gcXVlcnlbXCJYLVVzZXItSWRcIl1cblx0YXV0aFRva2VuID0gcXVlcnlbXCJYLUF1dGgtVG9rZW5cIl1cblxuXHRpZiBub3QgdXNlcklkIG9yIG5vdCBhdXRoVG9rZW5cblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblxuXHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXG5cdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuXHRcdF9pZDogdXNlcklkLFxuXHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG5cblx0aWYgbm90IHVzZXJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblxuXHRyZXR1cm4gdXNlclxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlID0gKHNwYWNlX2lkKSAtPlxuXHRzcGFjZSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpXG5cdGlmIG5vdCBzcGFjZVxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwic3BhY2VfaWTmnInor6/miJbmraRzcGFjZeW3sue7j+iiq+WIoOmZpFwiKVxuXHRyZXR1cm4gc3BhY2VcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93ID0gKGZsb3dfaWQpIC0+XG5cdGZsb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZsb3dzLmZpbmRPbmUoZmxvd19pZClcblx0aWYgbm90IGZsb3dcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcImlk5pyJ6K+v5oiW5q2k5rWB56iL5bey57uP6KKr5Yig6ZmkXCIpXG5cdHJldHVybiBmbG93XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyID0gKHNwYWNlX2lkLCB1c2VyX2lkKSAtPlxuXHRzcGFjZV91c2VyID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZV91c2Vycy5maW5kT25lKHsgc3BhY2U6IHNwYWNlX2lkLCB1c2VyOiB1c2VyX2lkIH0pXG5cdGlmIG5vdCBzcGFjZV91c2VyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJ1c2VyX2lk5a+55bqU55qE55So5oi35LiN5bGe5LqO5b2T5YmNc3BhY2VcIilcblx0cmV0dXJuIHNwYWNlX3VzZXJcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXJPcmdJbmZvID0gKHNwYWNlX3VzZXIpIC0+XG5cdGluZm8gPSBuZXcgT2JqZWN0XG5cdGluZm8ub3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb25cblx0b3JnID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vcmdhbml6YXRpb25zLmZpbmRPbmUoc3BhY2VfdXNlci5vcmdhbml6YXRpb24sIHsgZmllbGRzOiB7IG5hbWU6IDEgLCBmdWxsbmFtZTogMSB9IH0pXG5cdGluZm8ub3JnYW5pemF0aW9uX25hbWUgPSBvcmcubmFtZVxuXHRpbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IG9yZy5mdWxsbmFtZVxuXHRyZXR1cm4gaW5mb1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd0VuYWJsZWQgPSAoZmxvdykgLT5cblx0aWYgZmxvdy5zdGF0ZSBpc250IFwiZW5hYmxlZFwiXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvmnKrlkK/nlKgs5pON5L2c5aSx6LSlXCIpXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93U3BhY2VNYXRjaGVkID0gKGZsb3csIHNwYWNlX2lkKSAtPlxuXHRpZiBmbG93LnNwYWNlIGlzbnQgc3BhY2VfaWRcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+WSjOW3peS9nOWMuklE5LiN5Yy56YWNXCIpXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybSA9IChmb3JtX2lkKSAtPlxuXHRmb3JtID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5mb3Jtcy5maW5kT25lKGZvcm1faWQpXG5cdGlmIG5vdCBmb3JtXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+ihqOWNlUlE5pyJ6K+v5oiW5q2k6KGo5Y2V5bey57uP6KKr5Yig6ZmkJylcblxuXHRyZXR1cm4gZm9ybVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldENhdGVnb3J5ID0gKGNhdGVnb3J5X2lkKSAtPlxuXHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5jYXRlZ29yaWVzLmZpbmRPbmUoY2F0ZWdvcnlfaWQpXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tTeW5jRGlyZWN0aW9uID0gKG9iamVjdF9uYW1lLCBmbG93X2lkKSAtPlxuXHRvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3dvcmtmbG93cy5maW5kT25lKHtcblx0XHRvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG5cdFx0Zmxvd19pZDogZmxvd19pZFxuXHR9KVxuXHRpZiAhb3dcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn5pyq5om+5Yiw5a+56LGh5rWB56iL5pig5bCE6K6w5b2V44CCJylcblx0c3luY0RpcmVjdGlvbiA9IG93LnN5bmNfZGlyZWN0aW9uIHx8ICdib3RoJ1xuXHRpZiAhWydib3RoJywgJ29ial90b19pbnMnXS5pbmNsdWRlcyhzeW5jRGlyZWN0aW9uKVxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsICfkuI3mlK/mjIHnmoTlkIzmraXmlrnlkJHjgIInKVxuXG5cdHJldHVybiBcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UgPSAoaW5zdGFuY2VfZnJvbV9jbGllbnQsIHVzZXJfaW5mbykgLT5cblx0Y2hlY2sgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0sIFN0cmluZ1xuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdLCBTdHJpbmdcblx0Y2hlY2sgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdLCBTdHJpbmdcblx0Y2hlY2sgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdLCBbe286IFN0cmluZywgaWRzOiBbU3RyaW5nXX1dXG5cblx0IyDmoKHpqozlkIzmraXmlrnlkJFcblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja1N5bmNEaXJlY3Rpb24oaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdWzBdLm8sIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXSlcblxuXHQjIOagoemqjOaYr+WQpnJlY29yZOW3sue7j+WPkei1t+eahOeUs+ivt+i/mOWcqOWuoeaJueS4rVxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVswXSwgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSlcblxuXHRzcGFjZV9pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl1cblx0Zmxvd19pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXVxuXHR1c2VyX2lkID0gdXNlcl9pbmZvLl9pZFxuXHQjIOiOt+WPluWJjeWPsOaJgOS8oOeahHRyYWNlXG5cdHRyYWNlX2Zyb21fY2xpZW50ID0gbnVsbFxuXHQjIOiOt+WPluWJjeWPsOaJgOS8oOeahGFwcHJvdmVcblx0YXBwcm92ZV9mcm9tX2NsaWVudCA9IG51bGxcblx0aWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl0gYW5kIGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdXG5cdFx0dHJhY2VfZnJvbV9jbGllbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXVxuXHRcdGlmIHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl0gYW5kIHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl1bMF1cblx0XHRcdGFwcHJvdmVfZnJvbV9jbGllbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXVtcImFwcHJvdmVzXCJdWzBdXG5cblx0IyDojrflj5bkuIDkuKpzcGFjZVxuXHRzcGFjZSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2Uoc3BhY2VfaWQpXG5cdCMg6I635Y+W5LiA5LiqZmxvd1xuXHRmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpXG5cdCMg6I635Y+W5LiA5Liqc3BhY2XkuIvnmoTkuIDkuKp1c2VyXG5cdHNwYWNlX3VzZXIgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlcihzcGFjZV9pZCwgdXNlcl9pZClcblx0IyDojrflj5ZzcGFjZV91c2Vy5omA5Zyo55qE6YOo6Zeo5L+h5oGvXG5cdHNwYWNlX3VzZXJfb3JnX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8oc3BhY2VfdXNlcilcblx0IyDliKTmlq3kuIDkuKpmbG935piv5ZCm5Li65ZCv55So54q25oCBXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZChmbG93KVxuXHQjIOWIpOaWreS4gOS4qmZsb3flkoxzcGFjZV9pZOaYr+WQpuWMuemFjVxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZChmbG93LCBzcGFjZV9pZClcblxuXHRmb3JtID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtKGZsb3cuZm9ybSlcblxuXHRwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93X2lkLCB1c2VyX2lkKVxuXG5cdGlmIG5vdCBwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkZFwiKVxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5b2T5YmN55So5oi35rKh5pyJ5q2k5rWB56iL55qE5paw5bu65p2D6ZmQXCIpXG5cblx0bm93ID0gbmV3IERhdGVcblx0aW5zX29iaiA9IHt9XG5cdGluc19vYmouX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuX21ha2VOZXdJRCgpXG5cdGluc19vYmouc3BhY2UgPSBzcGFjZV9pZFxuXHRpbnNfb2JqLmZsb3cgPSBmbG93X2lkXG5cdGluc19vYmouZmxvd192ZXJzaW9uID0gZmxvdy5jdXJyZW50Ll9pZFxuXHRpbnNfb2JqLmZvcm0gPSBmbG93LmZvcm1cblx0aW5zX29iai5mb3JtX3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuZm9ybV92ZXJzaW9uXG5cdGluc19vYmoubmFtZSA9IGZsb3cubmFtZVxuXHRpbnNfb2JqLnN1Ym1pdHRlciA9IHVzZXJfaWRcblx0aW5zX29iai5zdWJtaXR0ZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lXG5cdGluc19vYmouYXBwbGljYW50ID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSBlbHNlIHVzZXJfaWRcblx0aW5zX29iai5hcHBsaWNhbnRfbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIGVsc2UgdXNlcl9pbmZvLm5hbWVcblx0aW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdIGVsc2Ugc3BhY2VfdXNlci5vcmdhbml6YXRpb25cblx0aW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdIGVsc2Ugc3BhY2VfdXNlcl9vcmdfaW5mby5vcmdhbml6YXRpb25fbmFtZVxuXHRpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gZWxzZSAgc3BhY2VfdXNlcl9vcmdfaW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWVcblx0aW5zX29iai5hcHBsaWNhbnRfY29tcGFueSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdIGVsc2Ugc3BhY2VfdXNlci5jb21wYW55X2lkXG5cdGluc19vYmouc3RhdGUgPSAnZHJhZnQnXG5cdGluc19vYmouY29kZSA9ICcnXG5cdGluc19vYmouaXNfYXJjaGl2ZWQgPSBmYWxzZVxuXHRpbnNfb2JqLmlzX2RlbGV0ZWQgPSBmYWxzZVxuXHRpbnNfb2JqLmNyZWF0ZWQgPSBub3dcblx0aW5zX29iai5jcmVhdGVkX2J5ID0gdXNlcl9pZFxuXHRpbnNfb2JqLm1vZGlmaWVkID0gbm93XG5cdGluc19vYmoubW9kaWZpZWRfYnkgPSB1c2VyX2lkXG5cblx0aW5zX29iai5yZWNvcmRfaWRzID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdXG5cblx0aWYgc3BhY2VfdXNlci5jb21wYW55X2lkXG5cdFx0aW5zX29iai5jb21wYW55X2lkID0gc3BhY2VfdXNlci5jb21wYW55X2lkXG5cblx0IyDmlrDlu7pUcmFjZVxuXHR0cmFjZV9vYmogPSB7fVxuXHR0cmFjZV9vYmouX2lkID0gbmV3IE1vbmdvLk9iamVjdElEKCkuX3N0clxuXHR0cmFjZV9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZFxuXHR0cmFjZV9vYmouaXNfZmluaXNoZWQgPSBmYWxzZVxuXHQjIOW9k+WJjeacgOaWsOeJiGZsb3fkuK3lvIDlp4voioLngrlcblx0c3RhcnRfc3RlcCA9IF8uZmluZChmbG93LmN1cnJlbnQuc3RlcHMsIChzdGVwKSAtPlxuXHRcdHJldHVybiBzdGVwLnN0ZXBfdHlwZSBpcyAnc3RhcnQnXG5cdClcblx0dHJhY2Vfb2JqLnN0ZXAgPSBzdGFydF9zdGVwLl9pZFxuXHR0cmFjZV9vYmoubmFtZSA9IHN0YXJ0X3N0ZXAubmFtZVxuXG5cdHRyYWNlX29iai5zdGFydF9kYXRlID0gbm93XG5cdCMg5paw5bu6QXBwcm92ZVxuXHRhcHByX29iaiA9IHt9XG5cdGFwcHJfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHJcblx0YXBwcl9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZFxuXHRhcHByX29iai50cmFjZSA9IHRyYWNlX29iai5faWRcblx0YXBwcl9vYmouaXNfZmluaXNoZWQgPSBmYWxzZVxuXHRhcHByX29iai51c2VyID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSBlbHNlIHVzZXJfaWRcblx0YXBwcl9vYmoudXNlcl9uYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gZWxzZSB1c2VyX2luZm8ubmFtZVxuXHRhcHByX29iai5oYW5kbGVyID0gdXNlcl9pZFxuXHRhcHByX29iai5oYW5kbGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZVxuXHRhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbiA9IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uXG5cdGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX25hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLm5hbWVcblx0YXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLmZ1bGxuYW1lXG5cdGFwcHJfb2JqLnR5cGUgPSAnZHJhZnQnXG5cdGFwcHJfb2JqLnN0YXJ0X2RhdGUgPSBub3dcblx0YXBwcl9vYmoucmVhZF9kYXRlID0gbm93XG5cdGFwcHJfb2JqLmlzX3JlYWQgPSB0cnVlXG5cdGFwcHJfb2JqLmlzX2Vycm9yID0gZmFsc2Vcblx0YXBwcl9vYmouZGVzY3JpcHRpb24gPSAnJ1xuXHRyZWxhdGVkVGFibGVzSW5mbyA9IHt9XG5cdGFwcHJfb2JqLnZhbHVlcyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMoaW5zX29iai5yZWNvcmRfaWRzWzBdLCBmbG93X2lkLCBzcGFjZV9pZCwgZm9ybS5jdXJyZW50LmZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pXG5cblx0dHJhY2Vfb2JqLmFwcHJvdmVzID0gW2FwcHJfb2JqXVxuXHRpbnNfb2JqLnRyYWNlcyA9IFt0cmFjZV9vYmpdXG5cblx0aW5zX29iai52YWx1ZXMgPSBhcHByX29iai52YWx1ZXNcblxuXHRpbnNfb2JqLmluYm94X3VzZXJzID0gaW5zdGFuY2VfZnJvbV9jbGllbnQuaW5ib3hfdXNlcnMgfHwgW11cblxuXHRpbnNfb2JqLmN1cnJlbnRfc3RlcF9uYW1lID0gc3RhcnRfc3RlcC5uYW1lXG5cblx0aWYgZmxvdy5hdXRvX3JlbWluZCBpcyB0cnVlXG5cdFx0aW5zX29iai5hdXRvX3JlbWluZCA9IHRydWVcblxuXHQjIOaWsOW7uueUs+ivt+WNleaXtu+8jGluc3RhbmNlc+iusOW9lea1geeoi+WQjeensOOAgea1geeoi+WIhuexu+WQjeensCAjMTMxM1xuXHRpbnNfb2JqLmZsb3dfbmFtZSA9IGZsb3cubmFtZVxuXHRpZiBmb3JtLmNhdGVnb3J5XG5cdFx0Y2F0ZWdvcnkgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldENhdGVnb3J5KGZvcm0uY2F0ZWdvcnkpXG5cdFx0aWYgY2F0ZWdvcnlcblx0XHRcdGluc19vYmouY2F0ZWdvcnlfbmFtZSA9IGNhdGVnb3J5Lm5hbWVcblx0XHRcdGluc19vYmouY2F0ZWdvcnkgPSBjYXRlZ29yeS5faWRcblxuXHRuZXdfaW5zX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuaW5zZXJ0KGluc19vYmopXG5cblx0aW5zZXJ0X2luc3RhbmNlX3Rhc2tzKG5ld19pbnNfaWQsIHRyYWNlX29iai5faWQsIGFwcHJfb2JqLl9pZClcblxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvKGluc19vYmoucmVjb3JkX2lkc1swXSwgbmV3X2luc19pZCwgc3BhY2VfaWQpXG5cblx0IyB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyhyZWxhdGVkVGFibGVzSW5mbywgbmV3X2luc19pZCwgc3BhY2VfaWQpXG5cblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZUF0dGFjaChpbnNfb2JqLnJlY29yZF9pZHNbMF0sIHNwYWNlX2lkLCBpbnNfb2JqLl9pZCwgYXBwcl9vYmouX2lkKVxuXG5cdHJldHVybiBuZXdfaW5zX2lkXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMgPSAocmVjb3JkSWRzLCBmbG93SWQsIHNwYWNlSWQsIGZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pIC0+XG5cdGZpZWxkQ29kZXMgPSBbXVxuXHRfLmVhY2ggZmllbGRzLCAoZikgLT5cblx0XHRpZiBmLnR5cGUgPT0gJ3NlY3Rpb24nXG5cdFx0XHRfLmVhY2ggZi5maWVsZHMsIChmZikgLT5cblx0XHRcdFx0ZmllbGRDb2Rlcy5wdXNoIGZmLmNvZGVcblx0XHRlbHNlXG5cdFx0XHRmaWVsZENvZGVzLnB1c2ggZi5jb2RlXG5cblx0dmFsdWVzID0ge31cblx0b2JqZWN0TmFtZSA9IHJlY29yZElkcy5vXG5cdG9iamVjdCA9IGdldE9iamVjdENvbmZpZyhvYmplY3ROYW1lKVxuXHRyZWNvcmRJZCA9IHJlY29yZElkcy5pZHNbMF1cblx0b3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XG5cdFx0b2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXG5cdFx0Zmxvd19pZDogZmxvd0lkXG5cdH0pXG5cdCMgcmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLmZpbmRPbmUocmVjb3JkSWQpXG5cdHJlY29yZCA9IG9iamVjdEZpbmRPbmUob2JqZWN0TmFtZSwgeyBmaWx0ZXJzOiBbWydfaWQnLCAnPScsIHJlY29yZElkXV19KVxuXHRmbG93ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoZmxvd0lkLCB7IGZpZWxkczogeyBmb3JtOiAxIH0gfSlcblx0aWYgb3cgYW5kIHJlY29yZFxuXHRcdGZvcm0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJmb3Jtc1wiKS5maW5kT25lKGZsb3cuZm9ybSlcblx0XHRmb3JtRmllbGRzID0gZm9ybS5jdXJyZW50LmZpZWxkcyB8fCBbXVxuXHRcdHJlbGF0ZWRPYmplY3RzID0gZ2V0UmVsYXRlZHMob2JqZWN0TmFtZSlcblx0XHRyZWxhdGVkT2JqZWN0c0tleXMgPSBfLnBsdWNrKHJlbGF0ZWRPYmplY3RzLCAnb2JqZWN0X25hbWUnKVxuXHRcdGZvcm1UYWJsZUZpZWxkcyA9IF8uZmlsdGVyIGZvcm1GaWVsZHMsIChmb3JtRmllbGQpIC0+XG5cdFx0XHRyZXR1cm4gZm9ybUZpZWxkLnR5cGUgPT0gJ3RhYmxlJ1xuXHRcdGZvcm1UYWJsZUZpZWxkc0NvZGUgPSBfLnBsdWNrKGZvcm1UYWJsZUZpZWxkcywgJ2NvZGUnKVxuXG5cdFx0Z2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSA9ICAoa2V5KSAtPlxuXHRcdFx0cmV0dXJuIF8uZmluZCByZWxhdGVkT2JqZWN0c0tleXMsICAocmVsYXRlZE9iamVjdHNLZXkpIC0+XG5cdFx0XHRcdHJldHVybiBrZXkuc3RhcnRzV2l0aChyZWxhdGVkT2JqZWN0c0tleSArICcuJylcblxuXHRcdGdldEZvcm1UYWJsZUZpZWxkQ29kZSA9IChrZXkpIC0+XG5cdFx0XHRyZXR1cm4gXy5maW5kIGZvcm1UYWJsZUZpZWxkc0NvZGUsICAoZm9ybVRhYmxlRmllbGRDb2RlKSAtPlxuXHRcdFx0XHRyZXR1cm4ga2V5LnN0YXJ0c1dpdGgoZm9ybVRhYmxlRmllbGRDb2RlICsgJy4nKVxuXG5cdFx0Z2V0Rm9ybVRhYmxlRmllbGQgPSAoa2V5KSAtPlxuXHRcdFx0cmV0dXJuIF8uZmluZCBmb3JtVGFibGVGaWVsZHMsICAoZikgLT5cblx0XHRcdFx0cmV0dXJuIGYuY29kZSA9PSBrZXlcblxuXHRcdGdldEZvcm1GaWVsZCA9IChrZXkpIC0+XG5cdFx0XHRmZiA9IG51bGxcblx0XHRcdF8uZm9yRWFjaCBmb3JtRmllbGRzLCAoZikgLT5cblx0XHRcdFx0aWYgZmZcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0aWYgZi50eXBlID09ICdzZWN0aW9uJ1xuXHRcdFx0XHRcdGZmID0gXy5maW5kIGYuZmllbGRzLCAgKHNmKSAtPlxuXHRcdFx0XHRcdFx0cmV0dXJuIHNmLmNvZGUgPT0ga2V5XG5cdFx0XHRcdGVsc2UgaWYgZi5jb2RlID09IGtleVxuXHRcdFx0XHRcdGZmID0gZlxuXG5cdFx0XHRyZXR1cm4gZmZcblxuXHRcdGdldEZvcm1UYWJsZVN1YkZpZWxkID0gKHRhYmxlRmllbGQsIHN1YkZpZWxkQ29kZSkgLT5cblx0XHRcdHJldHVybiBfLmZpbmQgdGFibGVGaWVsZC5maWVsZHMsICAoZikgLT5cblx0XHRcdFx0cmV0dXJuIGYuY29kZSA9PSBzdWJGaWVsZENvZGVcblxuXHRcdGdldEZpZWxkT2RhdGFWYWx1ZSA9IChvYmpOYW1lLCBpZCwgcmVmZXJlbmNlVG9GaWVsZE5hbWUpIC0+XG5cdFx0XHQjIG9iaiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKVxuXHRcdFx0b2JqID0gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iak5hbWUpXG5cdFx0XHRuYW1lS2V5ID0gZ2V0T2JqZWN0TmFtZUZpZWxkS2V5KG9iak5hbWUpXG5cdFx0XHRpZiAhb2JqXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0aWYgXy5pc1N0cmluZyBpZFxuXHRcdFx0XHQjIF9yZWNvcmQgPSBvYmouZmluZE9uZShpZClcblx0XHRcdFx0X3JlY29yZCA9IG9iamVjdEZpbmRPbmUob2JqTmFtZSwgeyBmaWx0ZXJzOiBbW3JlZmVyZW5jZVRvRmllbGROYW1lLCAnPScsIGlkXV19KVxuXHRcdFx0XHRpZiBfcmVjb3JkXG5cdFx0XHRcdFx0X3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkW25hbWVLZXldXG5cdFx0XHRcdFx0cmV0dXJuIF9yZWNvcmRcblx0XHRcdGVsc2UgaWYgXy5pc0FycmF5IGlkXG5cdFx0XHRcdF9yZWNvcmRzID0gW11cblx0XHRcdFx0IyBvYmouZmluZCh7IF9pZDogeyAkaW46IGlkIH0gfSlcblx0XHRcdFx0b2JqZWN0RmluZChvYmpOYW1lLCB7IGZpbHRlcnM6IFtbcmVmZXJlbmNlVG9GaWVsZE5hbWUsICdpbicsIGlkXV19KS5mb3JFYWNoIChfcmVjb3JkKSAtPlxuXHRcdFx0XHRcdF9yZWNvcmRbJ0BsYWJlbCddID0gX3JlY29yZFtuYW1lS2V5XVxuXHRcdFx0XHRcdF9yZWNvcmRzLnB1c2ggX3JlY29yZFxuXHRcdFx0XHRpZiAhXy5pc0VtcHR5IF9yZWNvcmRzXG5cdFx0XHRcdFx0cmV0dXJuIF9yZWNvcmRzXG5cdFx0XHRyZXR1cm5cblxuXHRcdGdldFNlbGVjdFVzZXJWYWx1ZSA9ICh1c2VySWQsIHNwYWNlSWQpIC0+XG5cdFx0XHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9KVxuXHRcdFx0c3UuaWQgPSB1c2VySWRcblx0XHRcdHJldHVybiBzdVxuXG5cdFx0Z2V0U2VsZWN0VXNlclZhbHVlcyA9ICh1c2VySWRzLCBzcGFjZUlkKSAtPlxuXHRcdFx0c3VzID0gW11cblx0XHRcdGlmIF8uaXNBcnJheSB1c2VySWRzXG5cdFx0XHRcdF8uZWFjaCB1c2VySWRzLCAodXNlcklkKSAtPlxuXHRcdFx0XHRcdHN1ID0gZ2V0U2VsZWN0VXNlclZhbHVlKHVzZXJJZCwgc3BhY2VJZClcblx0XHRcdFx0XHRpZiBzdVxuXHRcdFx0XHRcdFx0c3VzLnB1c2goc3UpXG5cdFx0XHRyZXR1cm4gc3VzXG5cblx0XHRnZXRTZWxlY3RPcmdWYWx1ZSA9IChvcmdJZCwgc3BhY2VJZCkgLT5cblx0XHRcdG9yZyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmRPbmUob3JnSWQsIHsgZmllbGRzOiB7IF9pZDogMSwgbmFtZTogMSwgZnVsbG5hbWU6IDEgfSB9KVxuXHRcdFx0b3JnLmlkID0gb3JnSWRcblx0XHRcdHJldHVybiBvcmdcblxuXHRcdGdldFNlbGVjdE9yZ1ZhbHVlcyA9IChvcmdJZHMsIHNwYWNlSWQpIC0+XG5cdFx0XHRvcmdzID0gW11cblx0XHRcdGlmIF8uaXNBcnJheSBvcmdJZHNcblx0XHRcdFx0Xy5lYWNoIG9yZ0lkcywgKG9yZ0lkKSAtPlxuXHRcdFx0XHRcdG9yZyA9IGdldFNlbGVjdE9yZ1ZhbHVlKG9yZ0lkLCBzcGFjZUlkKVxuXHRcdFx0XHRcdGlmIG9yZ1xuXHRcdFx0XHRcdFx0b3Jncy5wdXNoKG9yZylcblx0XHRcdHJldHVybiBvcmdzXG5cblx0XHR0YWJsZUZpZWxkQ29kZXMgPSBbXVxuXHRcdHRhYmxlRmllbGRNYXAgPSBbXVxuXHRcdHRhYmxlVG9SZWxhdGVkTWFwID0ge31cblxuXHRcdG93LmZpZWxkX21hcD8uZm9yRWFjaCAoZm0pIC0+XG5cdFx0XHRvYmplY3RfZmllbGQgPSBmbS5vYmplY3RfZmllbGRcblx0XHRcdHdvcmtmbG93X2ZpZWxkID0gZm0ud29ya2Zsb3dfZmllbGRcblx0XHRcdGlmICFvYmplY3RfZmllbGQgfHwgIXdvcmtmbG93X2ZpZWxkXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAn5pyq5om+5Yiw5a2X5q6177yM6K+35qOA5p+l5a+56LGh5rWB56iL5pig5bCE5a2X5q616YWN572uJylcblx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZENvZGUgPSBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlKG9iamVjdF9maWVsZClcblx0XHRcdGZvcm1UYWJsZUZpZWxkQ29kZSA9IGdldEZvcm1UYWJsZUZpZWxkQ29kZSh3b3JrZmxvd19maWVsZClcblx0XHRcdG9iakZpZWxkID0gb2JqZWN0LmZpZWxkc1tvYmplY3RfZmllbGRdXG5cdFx0XHRmb3JtRmllbGQgPSBnZXRGb3JtRmllbGQod29ya2Zsb3dfZmllbGQpXG5cdFx0XHRyZWNvcmRGaWVsZFZhbHVlID0gcmVjb3JkW29iamVjdF9maWVsZF1cblx0XHRcdCMg5aSE55CG5a2Q6KGo5a2X5q61XG5cdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGRDb2RlXG5cdFx0XHRcdFxuXHRcdFx0XHRvVGFibGVDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF1cblx0XHRcdFx0b1RhYmxlRmllbGRDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV1cblx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBLZXkgPSBvVGFibGVDb2RlXG5cdFx0XHRcdGlmICF0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1cblx0XHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0gPSB7fVxuXG5cdFx0XHRcdGlmIGZvcm1UYWJsZUZpZWxkQ29kZVxuXHRcdFx0XHRcdHdUYWJsZUNvZGUgPSB3b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdXG5cdFx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldWydfRlJPTV9UQUJMRV9DT0RFJ10gPSB3VGFibGVDb2RlXG5cblx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldW29UYWJsZUZpZWxkQ29kZV0gPSB3b3JrZmxvd19maWVsZFxuXHRcdFx0IyDliKTmlq3mmK/lkKbmmK/ooajmoLzlrZfmrrVcblx0XHRcdGVsc2UgaWYgd29ya2Zsb3dfZmllbGQuaW5kZXhPZignLicpID4gMCBhbmQgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID4gMFxuXHRcdFx0XHR3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVswXVxuXHRcdFx0XHRvVGFibGVDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJC4nKVswXVxuXHRcdFx0XHRpZiByZWNvcmQuaGFzT3duUHJvcGVydHkob1RhYmxlQ29kZSkgYW5kIF8uaXNBcnJheShyZWNvcmRbb1RhYmxlQ29kZV0pXG5cdFx0XHRcdFx0dGFibGVGaWVsZENvZGVzLnB1c2goSlNPTi5zdHJpbmdpZnkoe1xuXHRcdFx0XHRcdFx0d29ya2Zsb3dfdGFibGVfZmllbGRfY29kZTogd1RhYmxlQ29kZSxcblx0XHRcdFx0XHRcdG9iamVjdF90YWJsZV9maWVsZF9jb2RlOiBvVGFibGVDb2RlXG5cdFx0XHRcdFx0fSkpXG5cdFx0XHRcdFx0dGFibGVGaWVsZE1hcC5wdXNoKGZtKVxuXHRcdFx0XHRlbHNlIGlmIG9UYWJsZUNvZGUuaW5kZXhPZignLicpID4gMCAjIOivtOaYjuaYr+WFs+iBlOihqOeahGdyaWTlrZfmrrVcblx0XHRcdFx0XHRvVGFibGVDb2RlUmVmZXJlbmNlRmllbGRDb2RlID0gb1RhYmxlQ29kZS5zcGxpdCgnLicpWzBdO1xuXHRcdFx0XHRcdGdyaWRDb2RlID0gb1RhYmxlQ29kZS5zcGxpdCgnLicpWzFdO1xuXHRcdFx0XHRcdG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZCA9IG9iamVjdC5maWVsZHNbb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkQ29kZV07XG5cdFx0XHRcdFx0aWYgb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0aWYgcmVjb3JkW29UYWJsZUNvZGVdXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRmllbGROYW1lID0gb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnJlZmVyZW5jZV90b19maWVsZCB8fCAnX2lkJztcblx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5yZWZlcmVuY2VfdG87XG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSByZWNvcmRbb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLm5hbWVdO1xuXHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9Eb2MgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKTtcblx0XHRcdFx0XHRcdGlmIHJlZmVyZW5jZVRvRG9jW2dyaWRDb2RlXVxuXHRcdFx0XHRcdFx0XHRyZWNvcmRbb1RhYmxlQ29kZV0gPSByZWZlcmVuY2VUb0RvY1tncmlkQ29kZV07XG5cdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcblx0XHRcdFx0XHRcdFx0XHR3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxuXHRcdFx0XHRcdFx0XHRcdG9iamVjdF90YWJsZV9maWVsZF9jb2RlOiBvVGFibGVDb2RlXG5cdFx0XHRcdFx0XHRcdH0pKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRhYmxlRmllbGRNYXAucHVzaChmbSk7XG5cblx0XHRcdCMg5aSE55CGbG9va3Vw44CBbWFzdGVyX2RldGFpbOexu+Wei+Wtl+autVxuXHRcdFx0ZWxzZSBpZiBvYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gMCBhbmQgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID09IC0xXG5cdFx0XHRcdG9iamVjdEZpZWxkTmFtZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdXG5cdFx0XHRcdGxvb2t1cEZpZWxkTmFtZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzFdXG5cdFx0XHRcdGlmIG9iamVjdFxuXHRcdFx0XHRcdG9iamVjdEZpZWxkID0gb2JqZWN0LmZpZWxkc1tvYmplY3RGaWVsZE5hbWVdXG5cdFx0XHRcdFx0aWYgb2JqZWN0RmllbGQgJiYgZm9ybUZpZWxkICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdCMgZmllbGRzT2JqID0ge31cblx0XHRcdFx0XHRcdCMgZmllbGRzT2JqW2xvb2t1cEZpZWxkTmFtZV0gPSAxXG5cdFx0XHRcdFx0XHQjIGxvb2t1cE9iamVjdFJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpLmZpbmRPbmUocmVjb3JkW29iamVjdEZpZWxkTmFtZV0sIHsgZmllbGRzOiBmaWVsZHNPYmogfSlcblx0XHRcdFx0XHRcdGxvb2t1cE9iamVjdFJlY29yZCA9IG9iamVjdEZpbmRPbmUob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvLCB7IGZpbHRlcnM6IFtbJ19pZCcsICc9JywgcmVjb3JkW29iamVjdEZpZWxkTmFtZV1dXSwgZmllbGRzOiBbbG9va3VwRmllbGROYW1lXSB9KVxuXHRcdFx0XHRcdFx0aWYgIWxvb2t1cE9iamVjdFJlY29yZFxuXHRcdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRcdG9iamVjdEZpZWxkT2JqZWN0TmFtZSA9IG9iamVjdEZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRcdFx0bG9va3VwRmllbGRPYmogPSBnZXRPYmplY3RDb25maWcob2JqZWN0RmllbGRPYmplY3ROYW1lKVxuXHRcdFx0XHRcdFx0b2JqZWN0TG9va3VwRmllbGQgPSBsb29rdXBGaWVsZE9iai5maWVsZHNbbG9va3VwRmllbGROYW1lXVxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gbG9va3VwT2JqZWN0UmVjb3JkW2xvb2t1cEZpZWxkTmFtZV1cblx0XHRcdFx0XHRcdGlmIG9iamVjdExvb2t1cEZpZWxkICYmIGZvcm1GaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RMb29rdXBGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZE5hbWUgPSBvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQgfHwgJ19pZCdcblx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvXG5cdFx0XHRcdFx0XHRcdG9kYXRhRmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0XHRpZiBvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmICFvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb0ZpZWxkTmFtZSlcblx0XHRcdFx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiBvYmplY3RMb29rdXBGaWVsZCAmJiBmb3JtRmllbGQgJiYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RMb29rdXBGaWVsZC50eXBlKSAmJiAoWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvKSB8fCAoJ3NwYWNlX3VzZXJzJyA9PSBvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG8gJiYgJ3VzZXInID09IG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90b19maWVsZCkgKVxuXHRcdFx0XHRcdFx0XHRpZiAhXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRsb29rdXBTZWxlY3RGaWVsZFZhbHVlXG5cdFx0XHRcdFx0XHRcdFx0aWYgZm9ybUZpZWxkLnR5cGUgPT0gJ3VzZXInXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhb2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBTZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZvcm1GaWVsZC50eXBlID09ICdncm91cCdcblx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdExvb2t1cEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBTZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIW9iamVjdExvb2t1cEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRpZiBsb29rdXBTZWxlY3RGaWVsZFZhbHVlXG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gbG9va3VwU2VsZWN0RmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gbG9va3VwT2JqZWN0UmVjb3JkW2xvb2t1cEZpZWxkTmFtZV1cblxuXHRcdFx0IyBsb29rdXDjgIFtYXN0ZXJfZGV0YWls5a2X5q615ZCM5q2l5Yiwb2RhdGHlrZfmrrVcblx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkICYmIG9iakZpZWxkICYmIGZvcm1GaWVsZC50eXBlID09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iakZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqRmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkTmFtZSA9IG9iakZpZWxkLnJlZmVyZW5jZV90b19maWVsZCB8fCAnX2lkJ1xuXHRcdFx0XHRyZWZlcmVuY2VUb09iamVjdE5hbWUgPSBvYmpGaWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdXG5cdFx0XHRcdG9kYXRhRmllbGRWYWx1ZVxuXHRcdFx0XHRpZiBvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKVxuXHRcdFx0XHRlbHNlIGlmICFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb0ZpZWxkTmFtZSlcblx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZVxuXHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiAoWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob2JqRmllbGQucmVmZXJlbmNlX3RvKSB8fCAoJ3NwYWNlX3VzZXJzJyA9PSBvYmpGaWVsZC5yZWZlcmVuY2VfdG8gJiYgJ3VzZXInID09IG9iakZpZWxkLnJlZmVyZW5jZV90b19maWVsZCkgKVxuXHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSByZWNvcmRbb2JqRmllbGQubmFtZV1cblx0XHRcdFx0aWYgIV8uaXNFbXB0eShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXG5cdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZVxuXHRcdFx0XHRcdGlmIGZvcm1GaWVsZC50eXBlID09ICd1c2VyJ1xuXHRcdFx0XHRcdFx0aWYgb2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdGVsc2UgaWYgIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQudHlwZSA9PSAnZ3JvdXAnXG5cdFx0XHRcdFx0XHRpZiBvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRlbHNlIGlmICFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0aWYgc2VsZWN0RmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHNlbGVjdEZpZWxkVmFsdWVcblx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkICYmIG9iakZpZWxkICYmIGZvcm1GaWVsZC50eXBlID09ICdkYXRlJyAmJiByZWNvcmRGaWVsZFZhbHVlXG5cdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmZvcm1hdERhdGUocmVjb3JkRmllbGRWYWx1ZSkgIyBEYXRl6L2sU3RyaW5nXG5cdFx0XHRlbHNlIGlmIHJlY29yZC5oYXNPd25Qcm9wZXJ0eShvYmplY3RfZmllbGQpXG5cdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSByZWNvcmRbb2JqZWN0X2ZpZWxkXVxuXG5cdFx0IyDooajmoLzlrZfmrrVcblx0XHRfLnVuaXEodGFibGVGaWVsZENvZGVzKS5mb3JFYWNoICh0ZmMpIC0+XG5cdFx0XHRjID0gSlNPTi5wYXJzZSh0ZmMpXG5cdFx0XHR2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXSA9IFtdXG5cdFx0XHRyZWNvcmRbYy5vYmplY3RfdGFibGVfZmllbGRfY29kZV0uZm9yRWFjaCAodHIpIC0+XG5cdFx0XHRcdG5ld1RyID0ge31cblx0XHRcdFx0Xy5lYWNoIHRyLCAodiwgaykgLT5cblx0XHRcdFx0XHR0YWJsZUZpZWxkTWFwLmZvckVhY2ggKHRmbSkgLT5cblx0XHRcdFx0XHRcdGlmIHRmbS5vYmplY3RfZmllbGQgaXMgKGMub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGUgKyAnLiQuJyArIGspXG5cdFx0XHRcdFx0XHRcdHdUZENvZGUgPSB0Zm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVsxXVxuXHRcdFx0XHRcdFx0XHRuZXdUclt3VGRDb2RlXSA9IHZcblx0XHRcdFx0aWYgbm90IF8uaXNFbXB0eShuZXdUcilcblx0XHRcdFx0XHR2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXS5wdXNoKG5ld1RyKVxuXG5cdFx0IyDlkIzmraXlrZDooajmlbDmja7oh7PooajljZXooajmoLxcblx0XHRfLmVhY2ggdGFibGVUb1JlbGF0ZWRNYXAsICAobWFwLCBrZXkpIC0+XG5cdFx0XHR0YWJsZUNvZGUgPSBtYXAuX0ZST01fVEFCTEVfQ09ERVxuXHRcdFx0Zm9ybVRhYmxlRmllbGQgPSBnZXRGb3JtVGFibGVGaWVsZCh0YWJsZUNvZGUpXG5cdFx0XHRpZiAhdGFibGVDb2RlXG5cdFx0XHRcdGNvbnNvbGUud2FybigndGFibGVUb1JlbGF0ZWQ6IFsnICsga2V5ICsgJ10gbWlzc2luZyBjb3JyZXNwb25kaW5nIHRhYmxlLicpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3ROYW1lID0ga2V5XG5cdFx0XHRcdHRhYmxlVmFsdWVzID0gW11cblx0XHRcdFx0cmVsYXRlZFRhYmxlSXRlbXMgPSBbXVxuXHRcdFx0XHRyZWxhdGVkT2JqZWN0ID0gZ2V0T2JqZWN0Q29uZmlnKHJlbGF0ZWRPYmplY3ROYW1lKVxuXHRcdFx0XHRyZWxhdGVkRmllbGQgPSBfLmZpbmQgcmVsYXRlZE9iamVjdC5maWVsZHMsIChmKSAtPlxuXHRcdFx0XHRcdHJldHVybiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMoZi50eXBlKSAmJiBmLnJlZmVyZW5jZV90byA9PSBvYmplY3ROYW1lXG5cblx0XHRcdFx0cmVsYXRlZEZpZWxkTmFtZSA9IHJlbGF0ZWRGaWVsZC5uYW1lXG5cblx0XHRcdFx0cmVsYXRlZFJlY29yZHMgPSBvYmplY3RGaW5kKHJlbGF0ZWRPYmplY3ROYW1lLCB7XG5cdFx0XHRcdFx0ZmlsdGVyczogW1xuXHRcdFx0XHRcdFx0W3JlbGF0ZWRGaWVsZE5hbWUsICc9JywgcmVjb3JkSWRdXG5cdFx0XHRcdFx0XVxuXHRcdFx0XHR9KVxuXG5cdFx0XHRcdHJlbGF0ZWRSZWNvcmRzLmZvckVhY2ggKHJyKSAtPlxuXHRcdFx0XHRcdHRhYmxlVmFsdWVJdGVtID0ge31cblx0XHRcdFx0XHRfLmVhY2ggbWFwLCAodmFsdWVLZXksIGZpZWxkS2V5KSAtPlxuXHRcdFx0XHRcdFx0aWYgZmllbGRLZXkgIT0gJ19GUk9NX1RBQkxFX0NPREUnXG5cdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXlcblx0XHRcdFx0XHRcdFx0aWYgdmFsdWVLZXkuc3RhcnRzV2l0aCh0YWJsZUNvZGUgKyAnLicpXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkS2V5ID0gKHZhbHVlS2V5LnNwbGl0KFwiLlwiKVsxXSlcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleSA9IHZhbHVlS2V5XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRmb3JtRmllbGQgPSBnZXRGb3JtVGFibGVTdWJGaWVsZChmb3JtVGFibGVGaWVsZCwgZm9ybUZpZWxkS2V5KVxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0RmllbGQgPSByZWxhdGVkT2JqZWN0LmZpZWxkc1tmaWVsZEtleV1cblx0XHRcdFx0XHRcdFx0aWYgIWZvcm1GaWVsZCB8fCAhcmVsYXRlZE9iamVjdEZpZWxkXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0XHRcdGlmIGZvcm1GaWVsZC50eXBlID09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZE5hbWUgPSByZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkIHx8ICdfaWQnXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gcmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XVxuXHRcdFx0XHRcdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9GaWVsZE5hbWUpXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9GaWVsZE5hbWUpXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV1cblx0XHRcdFx0XHRcdFx0XHRpZiAhXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGZvcm1GaWVsZC50eXBlID09ICd1c2VyJ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkLnR5cGUgPT0gJ2dyb3VwJ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkLnR5cGUgPT0gJ2RhdGUnICYmIHJyW2ZpZWxkS2V5XVxuXHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZm9ybWF0RGF0ZShycltmaWVsZEtleV0pICMgRGF0Zei9rFN0cmluZ1xuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gcnJbZmllbGRLZXldXG5cdFx0XHRcdFx0XHRcdHRhYmxlVmFsdWVJdGVtW2Zvcm1GaWVsZEtleV0gPSB0YWJsZUZpZWxkVmFsdWVcblx0XHRcdFx0XHRpZiAhXy5pc0VtcHR5KHRhYmxlVmFsdWVJdGVtKVxuXHRcdFx0XHRcdFx0dGFibGVWYWx1ZUl0ZW0uX2lkID0gcnIuX2lkXG5cdFx0XHRcdFx0XHR0YWJsZVZhbHVlcy5wdXNoKHRhYmxlVmFsdWVJdGVtKVxuXHRcdFx0XHRcdFx0cmVsYXRlZFRhYmxlSXRlbXMucHVzaCh7IF90YWJsZTogeyBfaWQ6IHJyLl9pZCwgX2NvZGU6IHRhYmxlQ29kZSB9IH0gKVxuXG5cdFx0XHRcdHZhbHVlc1t0YWJsZUNvZGVdID0gdGFibGVWYWx1ZXNcblx0XHRcdFx0cmVsYXRlZFRhYmxlc0luZm9bcmVsYXRlZE9iamVjdE5hbWVdID0gcmVsYXRlZFRhYmxlSXRlbXNcblxuXHRcdCMg5aaC5p6c6YWN572u5LqG6ISa5pys5YiZ5omn6KGM6ISa5pysXG5cdFx0aWYgb3cuZmllbGRfbWFwX3NjcmlwdFxuXHRcdFx0Xy5leHRlbmQodmFsdWVzLCB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmV2YWxGaWVsZE1hcFNjcmlwdChvdy5maWVsZF9tYXBfc2NyaXB0LCBvYmplY3ROYW1lLCBzcGFjZUlkLCByZWNvcmRJZCkpXG5cblx0IyDov4fmu6Tmjol2YWx1ZXPkuK3nmoTpnZ7ms5VrZXlcblx0ZmlsdGVyVmFsdWVzID0ge31cblx0Xy5lYWNoIF8ua2V5cyh2YWx1ZXMpLCAoaykgLT5cblx0XHRpZiBmaWVsZENvZGVzLmluY2x1ZGVzKGspXG5cdFx0XHRmaWx0ZXJWYWx1ZXNba10gPSB2YWx1ZXNba11cblxuXHRyZXR1cm4gZmlsdGVyVmFsdWVzXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0ID0gKGZpZWxkX21hcF9zY3JpcHQsIG9iamVjdE5hbWUsIHNwYWNlSWQsIG9iamVjdElkKSAtPlxuXHQjIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKG9iamVjdElkKVxuXHRyZWNvcmQgPSBvYmplY3RGaW5kT25lKG9iamVjdE5hbWUsIHsgZmlsdGVyczogW1snX2lkJywgJz0nLCBvYmplY3RJZF1dIH0pXG5cdHNjcmlwdCA9IFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocmVjb3JkKSB7IFwiICsgZmllbGRfbWFwX3NjcmlwdCArIFwiIH1cIlxuXHRmdW5jID0gX2V2YWwoc2NyaXB0LCBcImZpZWxkX21hcF9zY3JpcHRcIilcblx0dmFsdWVzID0gZnVuYyhyZWNvcmQpXG5cdGlmIF8uaXNPYmplY3QgdmFsdWVzXG5cdFx0cmV0dXJuIHZhbHVlc1xuXHRlbHNlXG5cdFx0Y29uc29sZS5lcnJvciBcImV2YWxGaWVsZE1hcFNjcmlwdDog6ISa5pys6L+U5Zue5YC857G75Z6L5LiN5piv5a+56LGhXCJcblx0cmV0dXJuIHt9XG5cblxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoID0gKHJlY29yZElkcywgc3BhY2VJZCwgaW5zSWQsIGFwcHJvdmVJZCkgLT5cblxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zWydjbXNfZmlsZXMnXS5maW5kKHtcblx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRwYXJlbnQ6IHJlY29yZElkc1xuXHR9KS5mb3JFYWNoIChjZikgLT5cblx0XHRfLmVhY2ggY2YudmVyc2lvbnMsICh2ZXJzaW9uSWQsIGlkeCkgLT5cblx0XHRcdGYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zWydjZnMuZmlsZXMuZmlsZXJlY29yZCddLmZpbmRPbmUodmVyc2lvbklkKVxuXHRcdFx0bmV3RmlsZSA9IG5ldyBGUy5GaWxlKClcblxuXHRcdFx0bmV3RmlsZS5hdHRhY2hEYXRhIGYuY3JlYXRlUmVhZFN0cmVhbSgnZmlsZXMnKSwge1xuXHRcdFx0XHRcdHR5cGU6IGYub3JpZ2luYWwudHlwZVxuXHRcdFx0fSwgKGVycikgLT5cblx0XHRcdFx0aWYgKGVycilcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbilcblxuXHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpXG5cdFx0XHRcdG5ld0ZpbGUuc2l6ZShmLnNpemUoKSlcblx0XHRcdFx0bWV0YWRhdGEgPSB7XG5cdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXG5cdFx0XHRcdFx0b3duZXJfbmFtZTogZi5tZXRhZGF0YS5vd25lcl9uYW1lLFxuXHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkLFxuXHRcdFx0XHRcdGluc3RhbmNlOiBpbnNJZCxcblx0XHRcdFx0XHRhcHByb3ZlOiBhcHByb3ZlSWRcblx0XHRcdFx0XHRwYXJlbnQ6IGNmLl9pZFxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgaWR4IGlzIDBcblx0XHRcdFx0XHRtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZVxuXG5cdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YVxuXHRcdFx0XHRjZnMuaW5zdGFuY2VzLmluc2VydChuZXdGaWxlKVxuXG5cdHJldHVyblxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvID0gKHJlY29yZElkcywgaW5zSWQsIHNwYWNlSWQpIC0+XG5cdCMgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlY29yZElkcy5vLCBzcGFjZUlkKS51cGRhdGUocmVjb3JkSWRzLmlkc1swXSwge1xuXHQjIFx0JHB1c2g6IHtcblx0IyBcdFx0aW5zdGFuY2VzOiB7XG5cdCMgXHRcdFx0JGVhY2g6IFt7XG5cdCMgXHRcdFx0XHRfaWQ6IGluc0lkLFxuXHQjIFx0XHRcdFx0c3RhdGU6ICdkcmFmdCdcblx0IyBcdFx0XHR9XSxcblx0IyBcdFx0XHQkcG9zaXRpb246IDBcblx0IyBcdFx0fVxuXHQjIFx0fSxcblx0IyBcdCRzZXQ6IHtcblx0IyBcdFx0bG9ja2VkOiB0cnVlXG5cdCMgXHRcdGluc3RhbmNlX3N0YXRlOiAnZHJhZnQnXG5cdCMgXHR9XG5cdCMgfSlcblx0b2JqZWN0VXBkYXRlKHJlY29yZElkcy5vLCByZWNvcmRJZHMuaWRzWzBdLCB7XG5cdFx0aW5zdGFuY2VzOiBbe1xuXHRcdFx0X2lkOiBpbnNJZCxcblx0XHRcdHN0YXRlOiAnZHJhZnQnXG5cdFx0fV0sXG5cdFx0bG9ja2VkOiB0cnVlLFxuXHRcdGluc3RhbmNlX3N0YXRlOiAnZHJhZnQnXG5cdH0pXG5cblx0cmV0dXJuXG5cblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlbGF0ZWRSZWNvcmRJbnN0YW5jZUluZm8gPSAocmVsYXRlZFRhYmxlc0luZm8sIGluc0lkLCBzcGFjZUlkKSAtPlxuXHRfLmVhY2ggcmVsYXRlZFRhYmxlc0luZm8sICh0YWJsZUl0ZW1zLCByZWxhdGVkT2JqZWN0TmFtZSkgLT5cblx0XHRyZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZClcblx0XHRfLmVhY2ggdGFibGVJdGVtcywgKGl0ZW0pIC0+XG5cdFx0XHRyZWxhdGVkQ29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKGl0ZW0uX3RhYmxlLl9pZCwge1xuXHRcdFx0XHQkc2V0OiB7XG5cdFx0XHRcdFx0aW5zdGFuY2VzOiBbe1xuXHRcdFx0XHRcdFx0X2lkOiBpbnNJZCxcblx0XHRcdFx0XHRcdHN0YXRlOiAnZHJhZnQnXG5cdFx0XHRcdFx0fV0sXG5cdFx0XHRcdFx0X3RhYmxlOiBpdGVtLl90YWJsZVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXG5cdHJldHVyblxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsID0gKHJlY29yZElkcywgc3BhY2VJZCkgLT5cblx0IyByZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLmZpbmRPbmUoe1xuXHQjIFx0X2lkOiByZWNvcmRJZHMuaWRzWzBdLCBpbnN0YW5jZXM6IHsgJGV4aXN0czogdHJ1ZSB9XG5cdCMgfSwgeyBmaWVsZHM6IHsgaW5zdGFuY2VzOiAxIH0gfSlcblx0cmVjb3JkID0gb2JqZWN0RmluZE9uZShyZWNvcmRJZHMubywgeyBmaWx0ZXJzOiBbWydfaWQnLCAnPScsIHJlY29yZElkcy5pZHNbMF1dXSwgZmllbGRzOiBbJ2luc3RhbmNlcyddIH0pXG5cblx0aWYgcmVjb3JkIGFuZCByZWNvcmQuaW5zdGFuY2VzIGFuZCByZWNvcmQuaW5zdGFuY2VzWzBdLnN0YXRlIGlzbnQgJ2NvbXBsZXRlZCcgYW5kIENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmZpbmQocmVjb3JkLmluc3RhbmNlc1swXS5faWQpLmNvdW50KCkgPiAwXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmraTorrDlvZXlt7Llj5HotbfmtYHnqIvmraPlnKjlrqHmibnkuK3vvIzlvoXlrqHmibnnu5PmnZ/mlrnlj6/lj5HotbfkuIvkuIDmrKHlrqHmibnvvIFcIilcblxuXHRyZXR1cm5cblxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmZvcm1hdERhdGUgPSAoZGF0ZSkgLT5cblx0cmV0dXJuIG1vbWVudChkYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpIiwidmFyIF9ldmFsLCBnZXRPYmplY3RDb25maWcsIGdldE9iamVjdE5hbWVGaWVsZEtleSwgZ2V0UmVsYXRlZHMsIGluc2VydF9pbnN0YW5jZV90YXNrcywgb2JqZWN0RmluZCwgb2JqZWN0RmluZE9uZSwgb2JqZWN0VXBkYXRlLCBvYmplY3RxbDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuX2V2YWwgPSByZXF1aXJlKCdldmFsJyk7XG5cbm9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcblxuaW5zZXJ0X2luc3RhbmNlX3Rhc2tzID0gcmVxdWlyZSgnQHN0ZWVkb3Mvd29ya2Zsb3cnKS53b3JrZmxvd01hbmFnZXJzLmluc3RhbmNlX3Rhc2tzX21hbmFnZXIuaW5zZXJ0X2luc3RhbmNlX3Rhc2tzO1xuXG5nZXRPYmplY3RDb25maWcgPSBmdW5jdGlvbihvYmplY3RBcGlOYW1lKSB7XG4gIHJldHVybiBvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkudG9Db25maWcoKTtcbn07XG5cbmdldE9iamVjdE5hbWVGaWVsZEtleSA9IGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUpIHtcbiAgcmV0dXJuIG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS5OQU1FX0ZJRUxEX0tFWTtcbn07XG5cbmdldFJlbGF0ZWRzID0gZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSkge1xuICByZXR1cm4gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihvYmplY3RBcGlOYW1lLCBjYikge1xuICAgIHJldHVybiBvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkuZ2V0UmVsYXRlZHMoKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH0pKG9iamVjdEFwaU5hbWUpO1xufTtcblxub2JqZWN0RmluZE9uZSA9IGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUsIHF1ZXJ5KSB7XG4gIHJldHVybiBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUsIHF1ZXJ5LCBjYikge1xuICAgIHJldHVybiBvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkuZmluZChxdWVyeSkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGlmIChyZXNvbHZlICYmIHJlc29sdmUubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlWzBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjYihyZWplY3QsIG51bGwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KShvYmplY3RBcGlOYW1lLCBxdWVyeSk7XG59O1xuXG5vYmplY3RGaW5kID0gZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSwgcXVlcnkpIHtcbiAgcmV0dXJuIE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSwgcXVlcnksIGNiKSB7XG4gICAgcmV0dXJuIG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS5maW5kKHF1ZXJ5KS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH0pKG9iamVjdEFwaU5hbWUsIHF1ZXJ5KTtcbn07XG5cbm9iamVjdFVwZGF0ZSA9IGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUsIGlkLCBkYXRhKSB7XG4gIHJldHVybiBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUsIGlkLCBkYXRhLCBjYikge1xuICAgIHJldHVybiBvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkudXBkYXRlKGlkLCBkYXRhKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH0pKG9iamVjdEFwaU5hbWUsIGlkLCBkYXRhKTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwgPSB7fTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja19hdXRob3JpemF0aW9uID0gZnVuY3Rpb24ocmVxKSB7XG4gIHZhciBhdXRoVG9rZW4sIGhhc2hlZFRva2VuLCBxdWVyeSwgdXNlciwgdXNlcklkO1xuICBxdWVyeSA9IHJlcS5xdWVyeTtcbiAgdXNlcklkID0gcXVlcnlbXCJYLVVzZXItSWRcIl07XG4gIGF1dGhUb2tlbiA9IHF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdO1xuICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgIF9pZDogdXNlcklkLFxuICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gIH0pO1xuICBpZiAoIXVzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIHJldHVybiB1c2VyO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZSA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHZhciBzcGFjZTtcbiAgc3BhY2UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgaWYgKCFzcGFjZSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwic3BhY2VfaWTmnInor6/miJbmraRzcGFjZeW3sue7j+iiq+WIoOmZpFwiKTtcbiAgfVxuICByZXR1cm4gc3BhY2U7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3cgPSBmdW5jdGlvbihmbG93X2lkKSB7XG4gIHZhciBmbG93O1xuICBmbG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5mbG93cy5maW5kT25lKGZsb3dfaWQpO1xuICBpZiAoIWZsb3cpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcImlk5pyJ6K+v5oiW5q2k5rWB56iL5bey57uP6KKr5Yig6ZmkXCIpO1xuICB9XG4gIHJldHVybiBmbG93O1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXIgPSBmdW5jdGlvbihzcGFjZV9pZCwgdXNlcl9pZCkge1xuICB2YXIgc3BhY2VfdXNlcjtcbiAgc3BhY2VfdXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHVzZXI6IHVzZXJfaWRcbiAgfSk7XG4gIGlmICghc3BhY2VfdXNlcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwidXNlcl9pZOWvueW6lOeahOeUqOaIt+S4jeWxnuS6juW9k+WJjXNwYWNlXCIpO1xuICB9XG4gIHJldHVybiBzcGFjZV91c2VyO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXJPcmdJbmZvID0gZnVuY3Rpb24oc3BhY2VfdXNlcikge1xuICB2YXIgaW5mbywgb3JnO1xuICBpbmZvID0gbmV3IE9iamVjdDtcbiAgaW5mby5vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbjtcbiAgb3JnID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vcmdhbml6YXRpb25zLmZpbmRPbmUoc3BhY2VfdXNlci5vcmdhbml6YXRpb24sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIG5hbWU6IDEsXG4gICAgICBmdWxsbmFtZTogMVxuICAgIH1cbiAgfSk7XG4gIGluZm8ub3JnYW5pemF0aW9uX25hbWUgPSBvcmcubmFtZTtcbiAgaW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBvcmcuZnVsbG5hbWU7XG4gIHJldHVybiBpbmZvO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dFbmFibGVkID0gZnVuY3Rpb24oZmxvdykge1xuICBpZiAoZmxvdy5zdGF0ZSAhPT0gXCJlbmFibGVkXCIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+acquWQr+eUqCzmk43kvZzlpLHotKVcIik7XG4gIH1cbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93U3BhY2VNYXRjaGVkID0gZnVuY3Rpb24oZmxvdywgc3BhY2VfaWQpIHtcbiAgaWYgKGZsb3cuc3BhY2UgIT09IHNwYWNlX2lkKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvlkozlt6XkvZzljLpJROS4jeWMuemFjVwiKTtcbiAgfVxufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtID0gZnVuY3Rpb24oZm9ybV9pZCkge1xuICB2YXIgZm9ybTtcbiAgZm9ybSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZm9ybXMuZmluZE9uZShmb3JtX2lkKTtcbiAgaWYgKCFmb3JtKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+ihqOWNlUlE5pyJ6K+v5oiW5q2k6KGo5Y2V5bey57uP6KKr5Yig6ZmkJyk7XG4gIH1cbiAgcmV0dXJuIGZvcm07XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldENhdGVnb3J5ID0gZnVuY3Rpb24oY2F0ZWdvcnlfaWQpIHtcbiAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuY2F0ZWdvcmllcy5maW5kT25lKGNhdGVnb3J5X2lkKTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tTeW5jRGlyZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZsb3dfaWQpIHtcbiAgdmFyIG93LCBzeW5jRGlyZWN0aW9uO1xuICBvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3dvcmtmbG93cy5maW5kT25lKHtcbiAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgZmxvd19pZDogZmxvd19pZFxuICB9KTtcbiAgaWYgKCFvdykge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsICfmnKrmib7liLDlr7nosaHmtYHnqIvmmKDlsITorrDlvZXjgIInKTtcbiAgfVxuICBzeW5jRGlyZWN0aW9uID0gb3cuc3luY19kaXJlY3Rpb24gfHwgJ2JvdGgnO1xuICBpZiAoIVsnYm90aCcsICdvYmpfdG9faW5zJ10uaW5jbHVkZXMoc3luY0RpcmVjdGlvbikpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn5LiN5pSv5oyB55qE5ZCM5q2l5pa55ZCR44CCJyk7XG4gIH1cbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY3JlYXRlX2luc3RhbmNlID0gZnVuY3Rpb24oaW5zdGFuY2VfZnJvbV9jbGllbnQsIHVzZXJfaW5mbykge1xuICB2YXIgYXBwcl9vYmosIGFwcHJvdmVfZnJvbV9jbGllbnQsIGNhdGVnb3J5LCBmbG93LCBmbG93X2lkLCBmb3JtLCBpbnNfb2JqLCBuZXdfaW5zX2lkLCBub3csIHBlcm1pc3Npb25zLCByZWxhdGVkVGFibGVzSW5mbywgc3BhY2UsIHNwYWNlX2lkLCBzcGFjZV91c2VyLCBzcGFjZV91c2VyX29yZ19pbmZvLCBzdGFydF9zdGVwLCB0cmFjZV9mcm9tX2NsaWVudCwgdHJhY2Vfb2JqLCB1c2VyX2lkO1xuICBjaGVjayhpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSwgU3RyaW5nKTtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSwgU3RyaW5nKTtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdLCBTdHJpbmcpO1xuICBjaGVjayhpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl0sIFtcbiAgICB7XG4gICAgICBvOiBTdHJpbmcsXG4gICAgICBpZHM6IFtTdHJpbmddXG4gICAgfVxuICBdKTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja1N5bmNEaXJlY3Rpb24oaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdWzBdLm8sIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXSk7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tJc0luQXBwcm92YWwoaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdWzBdLCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdKTtcbiAgc3BhY2VfaWQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdO1xuICBmbG93X2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdO1xuICB1c2VyX2lkID0gdXNlcl9pbmZvLl9pZDtcbiAgdHJhY2VfZnJvbV9jbGllbnQgPSBudWxsO1xuICBhcHByb3ZlX2Zyb21fY2xpZW50ID0gbnVsbDtcbiAgaWYgKGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdICYmIGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdKSB7XG4gICAgdHJhY2VfZnJvbV9jbGllbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXTtcbiAgICBpZiAodHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXSAmJiB0cmFjZV9mcm9tX2NsaWVudFtcImFwcHJvdmVzXCJdWzBdKSB7XG4gICAgICBhcHByb3ZlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1bXCJhcHByb3Zlc1wiXVswXTtcbiAgICB9XG4gIH1cbiAgc3BhY2UgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlKHNwYWNlX2lkKTtcbiAgZmxvdyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyhmbG93X2lkKTtcbiAgc3BhY2VfdXNlciA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyKHNwYWNlX2lkLCB1c2VyX2lkKTtcbiAgc3BhY2VfdXNlcl9vcmdfaW5mbyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyhzcGFjZV91c2VyKTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dFbmFibGVkKGZsb3cpO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZChmbG93LCBzcGFjZV9pZCk7XG4gIGZvcm0gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZvcm0oZmxvdy5mb3JtKTtcbiAgcGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd19pZCwgdXNlcl9pZCk7XG4gIGlmICghcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZGRcIikpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuW9k+WJjeeUqOaIt+ayoeacieatpOa1geeoi+eahOaWsOW7uuadg+mZkFwiKTtcbiAgfVxuICBub3cgPSBuZXcgRGF0ZTtcbiAgaW5zX29iaiA9IHt9O1xuICBpbnNfb2JqLl9pZCA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLl9tYWtlTmV3SUQoKTtcbiAgaW5zX29iai5zcGFjZSA9IHNwYWNlX2lkO1xuICBpbnNfb2JqLmZsb3cgPSBmbG93X2lkO1xuICBpbnNfb2JqLmZsb3dfdmVyc2lvbiA9IGZsb3cuY3VycmVudC5faWQ7XG4gIGluc19vYmouZm9ybSA9IGZsb3cuZm9ybTtcbiAgaW5zX29iai5mb3JtX3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuZm9ybV92ZXJzaW9uO1xuICBpbnNfb2JqLm5hbWUgPSBmbG93Lm5hbWU7XG4gIGluc19vYmouc3VibWl0dGVyID0gdXNlcl9pZDtcbiAgaW5zX29iai5zdWJtaXR0ZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gOiB1c2VyX2lkO1xuICBpbnNfb2JqLmFwcGxpY2FudF9uYW1lID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gOiB1c2VyX2luZm8ubmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdIDogc3BhY2VfdXNlci5vcmdhbml6YXRpb247XG4gIGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZVwiXSA6IHNwYWNlX3VzZXJfb3JnX2luZm8ub3JnYW5pemF0aW9uX25hbWU7XG4gIGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZVwiXSA6IHNwYWNlX3VzZXJfb3JnX2luZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudF9jb21wYW55ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfY29tcGFueVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gOiBzcGFjZV91c2VyLmNvbXBhbnlfaWQ7XG4gIGluc19vYmouc3RhdGUgPSAnZHJhZnQnO1xuICBpbnNfb2JqLmNvZGUgPSAnJztcbiAgaW5zX29iai5pc19hcmNoaXZlZCA9IGZhbHNlO1xuICBpbnNfb2JqLmlzX2RlbGV0ZWQgPSBmYWxzZTtcbiAgaW5zX29iai5jcmVhdGVkID0gbm93O1xuICBpbnNfb2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkO1xuICBpbnNfb2JqLm1vZGlmaWVkID0gbm93O1xuICBpbnNfb2JqLm1vZGlmaWVkX2J5ID0gdXNlcl9pZDtcbiAgaW5zX29iai5yZWNvcmRfaWRzID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdO1xuICBpZiAoc3BhY2VfdXNlci5jb21wYW55X2lkKSB7XG4gICAgaW5zX29iai5jb21wYW55X2lkID0gc3BhY2VfdXNlci5jb21wYW55X2lkO1xuICB9XG4gIHRyYWNlX29iaiA9IHt9O1xuICB0cmFjZV9vYmouX2lkID0gbmV3IE1vbmdvLk9iamVjdElEKCkuX3N0cjtcbiAgdHJhY2Vfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWQ7XG4gIHRyYWNlX29iai5pc19maW5pc2hlZCA9IGZhbHNlO1xuICBzdGFydF9zdGVwID0gXy5maW5kKGZsb3cuY3VycmVudC5zdGVwcywgZnVuY3Rpb24oc3RlcCkge1xuICAgIHJldHVybiBzdGVwLnN0ZXBfdHlwZSA9PT0gJ3N0YXJ0JztcbiAgfSk7XG4gIHRyYWNlX29iai5zdGVwID0gc3RhcnRfc3RlcC5faWQ7XG4gIHRyYWNlX29iai5uYW1lID0gc3RhcnRfc3RlcC5uYW1lO1xuICB0cmFjZV9vYmouc3RhcnRfZGF0ZSA9IG5vdztcbiAgYXBwcl9vYmogPSB7fTtcbiAgYXBwcl9vYmouX2lkID0gbmV3IE1vbmdvLk9iamVjdElEKCkuX3N0cjtcbiAgYXBwcl9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZDtcbiAgYXBwcl9vYmoudHJhY2UgPSB0cmFjZV9vYmouX2lkO1xuICBhcHByX29iai5pc19maW5pc2hlZCA9IGZhbHNlO1xuICBhcHByX29iai51c2VyID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA6IHVzZXJfaWQ7XG4gIGFwcHJfb2JqLnVzZXJfbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIDogdXNlcl9pbmZvLm5hbWU7XG4gIGFwcHJfb2JqLmhhbmRsZXIgPSB1c2VyX2lkO1xuICBhcHByX29iai5oYW5kbGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZTtcbiAgYXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbjtcbiAgYXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb25fbmFtZSA9IHNwYWNlX3VzZXJfb3JnX2luZm8ubmFtZTtcbiAgYXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLmZ1bGxuYW1lO1xuICBhcHByX29iai50eXBlID0gJ2RyYWZ0JztcbiAgYXBwcl9vYmouc3RhcnRfZGF0ZSA9IG5vdztcbiAgYXBwcl9vYmoucmVhZF9kYXRlID0gbm93O1xuICBhcHByX29iai5pc19yZWFkID0gdHJ1ZTtcbiAgYXBwcl9vYmouaXNfZXJyb3IgPSBmYWxzZTtcbiAgYXBwcl9vYmouZGVzY3JpcHRpb24gPSAnJztcbiAgcmVsYXRlZFRhYmxlc0luZm8gPSB7fTtcbiAgYXBwcl9vYmoudmFsdWVzID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVZhbHVlcyhpbnNfb2JqLnJlY29yZF9pZHNbMF0sIGZsb3dfaWQsIHNwYWNlX2lkLCBmb3JtLmN1cnJlbnQuZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbyk7XG4gIHRyYWNlX29iai5hcHByb3ZlcyA9IFthcHByX29ial07XG4gIGluc19vYmoudHJhY2VzID0gW3RyYWNlX29ial07XG4gIGluc19vYmoudmFsdWVzID0gYXBwcl9vYmoudmFsdWVzO1xuICBpbnNfb2JqLmluYm94X3VzZXJzID0gaW5zdGFuY2VfZnJvbV9jbGllbnQuaW5ib3hfdXNlcnMgfHwgW107XG4gIGluc19vYmouY3VycmVudF9zdGVwX25hbWUgPSBzdGFydF9zdGVwLm5hbWU7XG4gIGlmIChmbG93LmF1dG9fcmVtaW5kID09PSB0cnVlKSB7XG4gICAgaW5zX29iai5hdXRvX3JlbWluZCA9IHRydWU7XG4gIH1cbiAgaW5zX29iai5mbG93X25hbWUgPSBmbG93Lm5hbWU7XG4gIGlmIChmb3JtLmNhdGVnb3J5KSB7XG4gICAgY2F0ZWdvcnkgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldENhdGVnb3J5KGZvcm0uY2F0ZWdvcnkpO1xuICAgIGlmIChjYXRlZ29yeSkge1xuICAgICAgaW5zX29iai5jYXRlZ29yeV9uYW1lID0gY2F0ZWdvcnkubmFtZTtcbiAgICAgIGluc19vYmouY2F0ZWdvcnkgPSBjYXRlZ29yeS5faWQ7XG4gICAgfVxuICB9XG4gIG5ld19pbnNfaWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5pbnNlcnQoaW5zX29iaik7XG4gIGluc2VydF9pbnN0YW5jZV90YXNrcyhuZXdfaW5zX2lkLCB0cmFjZV9vYmouX2lkLCBhcHByX29iai5faWQpO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvKGluc19vYmoucmVjb3JkX2lkc1swXSwgbmV3X2luc19pZCwgc3BhY2VfaWQpO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoKGluc19vYmoucmVjb3JkX2lkc1swXSwgc3BhY2VfaWQsIGluc19vYmouX2lkLCBhcHByX29iai5faWQpO1xuICByZXR1cm4gbmV3X2luc19pZDtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMgPSBmdW5jdGlvbihyZWNvcmRJZHMsIGZsb3dJZCwgc3BhY2VJZCwgZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbykge1xuICB2YXIgZmllbGRDb2RlcywgZmlsdGVyVmFsdWVzLCBmbG93LCBmb3JtLCBmb3JtRmllbGRzLCBmb3JtVGFibGVGaWVsZHMsIGZvcm1UYWJsZUZpZWxkc0NvZGUsIGdldEZpZWxkT2RhdGFWYWx1ZSwgZ2V0Rm9ybUZpZWxkLCBnZXRGb3JtVGFibGVGaWVsZCwgZ2V0Rm9ybVRhYmxlRmllbGRDb2RlLCBnZXRGb3JtVGFibGVTdWJGaWVsZCwgZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSwgZ2V0U2VsZWN0T3JnVmFsdWUsIGdldFNlbGVjdE9yZ1ZhbHVlcywgZ2V0U2VsZWN0VXNlclZhbHVlLCBnZXRTZWxlY3RVc2VyVmFsdWVzLCBvYmplY3QsIG9iamVjdE5hbWUsIG93LCByZWNvcmQsIHJlY29yZElkLCByZWYsIHJlbGF0ZWRPYmplY3RzLCByZWxhdGVkT2JqZWN0c0tleXMsIHRhYmxlRmllbGRDb2RlcywgdGFibGVGaWVsZE1hcCwgdGFibGVUb1JlbGF0ZWRNYXAsIHZhbHVlcztcbiAgZmllbGRDb2RlcyA9IFtdO1xuICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgaWYgKGYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKGYuZmllbGRzLCBmdW5jdGlvbihmZikge1xuICAgICAgICByZXR1cm4gZmllbGRDb2Rlcy5wdXNoKGZmLmNvZGUpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaWVsZENvZGVzLnB1c2goZi5jb2RlKTtcbiAgICB9XG4gIH0pO1xuICB2YWx1ZXMgPSB7fTtcbiAgb2JqZWN0TmFtZSA9IHJlY29yZElkcy5vO1xuICBvYmplY3QgPSBnZXRPYmplY3RDb25maWcob2JqZWN0TmFtZSk7XG4gIHJlY29yZElkID0gcmVjb3JkSWRzLmlkc1swXTtcbiAgb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXG4gICAgZmxvd19pZDogZmxvd0lkXG4gIH0pO1xuICByZWNvcmQgPSBvYmplY3RGaW5kT25lKG9iamVjdE5hbWUsIHtcbiAgICBmaWx0ZXJzOiBbWydfaWQnLCAnPScsIHJlY29yZElkXV1cbiAgfSk7XG4gIGZsb3cgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShmbG93SWQsIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGZvcm06IDFcbiAgICB9XG4gIH0pO1xuICBpZiAob3cgJiYgcmVjb3JkKSB7XG4gICAgZm9ybSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImZvcm1zXCIpLmZpbmRPbmUoZmxvdy5mb3JtKTtcbiAgICBmb3JtRmllbGRzID0gZm9ybS5jdXJyZW50LmZpZWxkcyB8fCBbXTtcbiAgICByZWxhdGVkT2JqZWN0cyA9IGdldFJlbGF0ZWRzKG9iamVjdE5hbWUpO1xuICAgIHJlbGF0ZWRPYmplY3RzS2V5cyA9IF8ucGx1Y2socmVsYXRlZE9iamVjdHMsICdvYmplY3RfbmFtZScpO1xuICAgIGZvcm1UYWJsZUZpZWxkcyA9IF8uZmlsdGVyKGZvcm1GaWVsZHMsIGZ1bmN0aW9uKGZvcm1GaWVsZCkge1xuICAgICAgcmV0dXJuIGZvcm1GaWVsZC50eXBlID09PSAndGFibGUnO1xuICAgIH0pO1xuICAgIGZvcm1UYWJsZUZpZWxkc0NvZGUgPSBfLnBsdWNrKGZvcm1UYWJsZUZpZWxkcywgJ2NvZGUnKTtcbiAgICBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKHJlbGF0ZWRPYmplY3RzS2V5cywgZnVuY3Rpb24ocmVsYXRlZE9iamVjdHNLZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleS5zdGFydHNXaXRoKHJlbGF0ZWRPYmplY3RzS2V5ICsgJy4nKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlRmllbGRDb2RlID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKGZvcm1UYWJsZUZpZWxkc0NvZGUsIGZ1bmN0aW9uKGZvcm1UYWJsZUZpZWxkQ29kZSkge1xuICAgICAgICByZXR1cm4ga2V5LnN0YXJ0c1dpdGgoZm9ybVRhYmxlRmllbGRDb2RlICsgJy4nKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlRmllbGQgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBfLmZpbmQoZm9ybVRhYmxlRmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgIHJldHVybiBmLmNvZGUgPT09IGtleTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybUZpZWxkID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgZmY7XG4gICAgICBmZiA9IG51bGw7XG4gICAgICBfLmZvckVhY2goZm9ybUZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgICAgICBpZiAoZmYpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIGZmID0gXy5maW5kKGYuZmllbGRzLCBmdW5jdGlvbihzZikge1xuICAgICAgICAgICAgcmV0dXJuIHNmLmNvZGUgPT09IGtleTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChmLmNvZGUgPT09IGtleSkge1xuICAgICAgICAgIHJldHVybiBmZiA9IGY7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZmO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlU3ViRmllbGQgPSBmdW5jdGlvbih0YWJsZUZpZWxkLCBzdWJGaWVsZENvZGUpIHtcbiAgICAgIHJldHVybiBfLmZpbmQodGFibGVGaWVsZC5maWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgcmV0dXJuIGYuY29kZSA9PT0gc3ViRmllbGRDb2RlO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRGaWVsZE9kYXRhVmFsdWUgPSBmdW5jdGlvbihvYmpOYW1lLCBpZCwgcmVmZXJlbmNlVG9GaWVsZE5hbWUpIHtcbiAgICAgIHZhciBfcmVjb3JkLCBfcmVjb3JkcywgbmFtZUtleSwgb2JqO1xuICAgICAgb2JqID0gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iak5hbWUpO1xuICAgICAgbmFtZUtleSA9IGdldE9iamVjdE5hbWVGaWVsZEtleShvYmpOYW1lKTtcbiAgICAgIGlmICghb2JqKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChfLmlzU3RyaW5nKGlkKSkge1xuICAgICAgICBfcmVjb3JkID0gb2JqZWN0RmluZE9uZShvYmpOYW1lLCB7XG4gICAgICAgICAgZmlsdGVyczogW1tyZWZlcmVuY2VUb0ZpZWxkTmFtZSwgJz0nLCBpZF1dXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoX3JlY29yZCkge1xuICAgICAgICAgIF9yZWNvcmRbJ0BsYWJlbCddID0gX3JlY29yZFtuYW1lS2V5XTtcbiAgICAgICAgICByZXR1cm4gX3JlY29yZDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChfLmlzQXJyYXkoaWQpKSB7XG4gICAgICAgIF9yZWNvcmRzID0gW107XG4gICAgICAgIG9iamVjdEZpbmQob2JqTmFtZSwge1xuICAgICAgICAgIGZpbHRlcnM6IFtbcmVmZXJlbmNlVG9GaWVsZE5hbWUsICdpbicsIGlkXV1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihfcmVjb3JkKSB7XG4gICAgICAgICAgX3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkW25hbWVLZXldO1xuICAgICAgICAgIHJldHVybiBfcmVjb3Jkcy5wdXNoKF9yZWNvcmQpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFfLmlzRW1wdHkoX3JlY29yZHMpKSB7XG4gICAgICAgICAgcmV0dXJuIF9yZWNvcmRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBnZXRTZWxlY3RVc2VyVmFsdWUgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgICAgIHZhciBzdTtcbiAgICAgIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9KTtcbiAgICAgIHN1LmlkID0gdXNlcklkO1xuICAgICAgcmV0dXJuIHN1O1xuICAgIH07XG4gICAgZ2V0U2VsZWN0VXNlclZhbHVlcyA9IGZ1bmN0aW9uKHVzZXJJZHMsIHNwYWNlSWQpIHtcbiAgICAgIHZhciBzdXM7XG4gICAgICBzdXMgPSBbXTtcbiAgICAgIGlmIChfLmlzQXJyYXkodXNlcklkcykpIHtcbiAgICAgICAgXy5lYWNoKHVzZXJJZHMsIGZ1bmN0aW9uKHVzZXJJZCkge1xuICAgICAgICAgIHZhciBzdTtcbiAgICAgICAgICBzdSA9IGdldFNlbGVjdFVzZXJWYWx1ZSh1c2VySWQsIHNwYWNlSWQpO1xuICAgICAgICAgIGlmIChzdSkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cy5wdXNoKHN1KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN1cztcbiAgICB9O1xuICAgIGdldFNlbGVjdE9yZ1ZhbHVlID0gZnVuY3Rpb24ob3JnSWQsIHNwYWNlSWQpIHtcbiAgICAgIHZhciBvcmc7XG4gICAgICBvcmcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kT25lKG9yZ0lkLCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgIGZ1bGxuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgb3JnLmlkID0gb3JnSWQ7XG4gICAgICByZXR1cm4gb3JnO1xuICAgIH07XG4gICAgZ2V0U2VsZWN0T3JnVmFsdWVzID0gZnVuY3Rpb24ob3JnSWRzLCBzcGFjZUlkKSB7XG4gICAgICB2YXIgb3JncztcbiAgICAgIG9yZ3MgPSBbXTtcbiAgICAgIGlmIChfLmlzQXJyYXkob3JnSWRzKSkge1xuICAgICAgICBfLmVhY2gob3JnSWRzLCBmdW5jdGlvbihvcmdJZCkge1xuICAgICAgICAgIHZhciBvcmc7XG4gICAgICAgICAgb3JnID0gZ2V0U2VsZWN0T3JnVmFsdWUob3JnSWQsIHNwYWNlSWQpO1xuICAgICAgICAgIGlmIChvcmcpIHtcbiAgICAgICAgICAgIHJldHVybiBvcmdzLnB1c2gob3JnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9yZ3M7XG4gICAgfTtcbiAgICB0YWJsZUZpZWxkQ29kZXMgPSBbXTtcbiAgICB0YWJsZUZpZWxkTWFwID0gW107XG4gICAgdGFibGVUb1JlbGF0ZWRNYXAgPSB7fTtcbiAgICBpZiAoKHJlZiA9IG93LmZpZWxkX21hcCkgIT0gbnVsbCkge1xuICAgICAgcmVmLmZvckVhY2goZnVuY3Rpb24oZm0pIHtcbiAgICAgICAgdmFyIGZvcm1GaWVsZCwgZm9ybVRhYmxlRmllbGRDb2RlLCBncmlkQ29kZSwgbG9va3VwRmllbGROYW1lLCBsb29rdXBGaWVsZE9iaiwgbG9va3VwT2JqZWN0UmVjb3JkLCBsb29rdXBTZWxlY3RGaWVsZFZhbHVlLCBvVGFibGVDb2RlLCBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQsIG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZENvZGUsIG9UYWJsZUZpZWxkQ29kZSwgb2JqRmllbGQsIG9iamVjdEZpZWxkLCBvYmplY3RGaWVsZE5hbWUsIG9iamVjdEZpZWxkT2JqZWN0TmFtZSwgb2JqZWN0TG9va3VwRmllbGQsIG9iamVjdF9maWVsZCwgb2RhdGFGaWVsZFZhbHVlLCByZWNvcmRGaWVsZFZhbHVlLCByZWZlcmVuY2VUb0RvYywgcmVmZXJlbmNlVG9GaWVsZE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWxhdGVkT2JqZWN0RmllbGRDb2RlLCBzZWxlY3RGaWVsZFZhbHVlLCB0YWJsZVRvUmVsYXRlZE1hcEtleSwgd1RhYmxlQ29kZSwgd29ya2Zsb3dfZmllbGQ7XG4gICAgICAgIG9iamVjdF9maWVsZCA9IGZtLm9iamVjdF9maWVsZDtcbiAgICAgICAgd29ya2Zsb3dfZmllbGQgPSBmbS53b3JrZmxvd19maWVsZDtcbiAgICAgICAgaWYgKCFvYmplY3RfZmllbGQgfHwgIXdvcmtmbG93X2ZpZWxkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICfmnKrmib7liLDlrZfmrrXvvIzor7fmo4Dmn6Xlr7nosaHmtYHnqIvmmKDlsITlrZfmrrXphY3nva4nKTtcbiAgICAgICAgfVxuICAgICAgICByZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZShvYmplY3RfZmllbGQpO1xuICAgICAgICBmb3JtVGFibGVGaWVsZENvZGUgPSBnZXRGb3JtVGFibGVGaWVsZENvZGUod29ya2Zsb3dfZmllbGQpO1xuICAgICAgICBvYmpGaWVsZCA9IG9iamVjdC5maWVsZHNbb2JqZWN0X2ZpZWxkXTtcbiAgICAgICAgZm9ybUZpZWxkID0gZ2V0Rm9ybUZpZWxkKHdvcmtmbG93X2ZpZWxkKTtcbiAgICAgICAgcmVjb3JkRmllbGRWYWx1ZSA9IHJlY29yZFtvYmplY3RfZmllbGRdO1xuICAgICAgICBpZiAocmVsYXRlZE9iamVjdEZpZWxkQ29kZSkge1xuICAgICAgICAgIG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICBvVGFibGVGaWVsZENvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICB0YWJsZVRvUmVsYXRlZE1hcEtleSA9IG9UYWJsZUNvZGU7XG4gICAgICAgICAgaWYgKCF0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0pIHtcbiAgICAgICAgICAgIHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZm9ybVRhYmxlRmllbGRDb2RlKSB7XG4gICAgICAgICAgICB3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVsnX0ZST01fVEFCTEVfQ09ERSddID0gd1RhYmxlQ29kZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVtvVGFibGVGaWVsZENvZGVdID0gd29ya2Zsb3dfZmllbGQ7XG4gICAgICAgIH0gZWxzZSBpZiAod29ya2Zsb3dfZmllbGQuaW5kZXhPZignLicpID4gMCAmJiBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPiAwKSB7XG4gICAgICAgICAgd1RhYmxlQ29kZSA9IHdvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgb1RhYmxlQ29kZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLiQuJylbMF07XG4gICAgICAgICAgaWYgKHJlY29yZC5oYXNPd25Qcm9wZXJ0eShvVGFibGVDb2RlKSAmJiBfLmlzQXJyYXkocmVjb3JkW29UYWJsZUNvZGVdKSkge1xuICAgICAgICAgICAgdGFibGVGaWVsZENvZGVzLnB1c2goSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICB3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxuICAgICAgICAgICAgICBvYmplY3RfdGFibGVfZmllbGRfY29kZTogb1RhYmxlQ29kZVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgcmV0dXJuIHRhYmxlRmllbGRNYXAucHVzaChmbSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChvVGFibGVDb2RlLmluZGV4T2YoJy4nKSA+IDApIHtcbiAgICAgICAgICAgIG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZENvZGUgPSBvVGFibGVDb2RlLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgICBncmlkQ29kZSA9IG9UYWJsZUNvZGUuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZCA9IG9iamVjdC5maWVsZHNbb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkQ29kZV07XG4gICAgICAgICAgICBpZiAob1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICBpZiAocmVjb3JkW29UYWJsZUNvZGVdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGROYW1lID0gb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnJlZmVyZW5jZV90b19maWVsZCB8fCAnX2lkJztcbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5uYW1lXTtcbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9Eb2MgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKTtcbiAgICAgICAgICAgICAgaWYgKHJlZmVyZW5jZVRvRG9jW2dyaWRDb2RlXSkge1xuICAgICAgICAgICAgICAgIHJlY29yZFtvVGFibGVDb2RlXSA9IHJlZmVyZW5jZVRvRG9jW2dyaWRDb2RlXTtcbiAgICAgICAgICAgICAgICB0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICB3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxuICAgICAgICAgICAgICAgICAgb2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlRmllbGRNYXAucHVzaChmbSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAob2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4nKSA+IDAgJiYgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID09PSAtMSkge1xuICAgICAgICAgIG9iamVjdEZpZWxkTmFtZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgIGxvb2t1cEZpZWxkTmFtZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgIGlmIChvYmplY3QpIHtcbiAgICAgICAgICAgIG9iamVjdEZpZWxkID0gb2JqZWN0LmZpZWxkc1tvYmplY3RGaWVsZE5hbWVdO1xuICAgICAgICAgICAgaWYgKG9iamVjdEZpZWxkICYmIGZvcm1GaWVsZCAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqZWN0RmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgIGxvb2t1cE9iamVjdFJlY29yZCA9IG9iamVjdEZpbmRPbmUob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvLCB7XG4gICAgICAgICAgICAgICAgZmlsdGVyczogW1snX2lkJywgJz0nLCByZWNvcmRbb2JqZWN0RmllbGROYW1lXV1dLFxuICAgICAgICAgICAgICAgIGZpZWxkczogW2xvb2t1cEZpZWxkTmFtZV1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmICghbG9va3VwT2JqZWN0UmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG9iamVjdEZpZWxkT2JqZWN0TmFtZSA9IG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgbG9va3VwRmllbGRPYmogPSBnZXRPYmplY3RDb25maWcob2JqZWN0RmllbGRPYmplY3ROYW1lKTtcbiAgICAgICAgICAgICAgb2JqZWN0TG9va3VwRmllbGQgPSBsb29rdXBGaWVsZE9iai5maWVsZHNbbG9va3VwRmllbGROYW1lXTtcbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gbG9va3VwT2JqZWN0UmVjb3JkW2xvb2t1cEZpZWxkTmFtZV07XG4gICAgICAgICAgICAgIGlmIChvYmplY3RMb29rdXBGaWVsZCAmJiBmb3JtRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iamVjdExvb2t1cEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGROYW1lID0gb2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkIHx8ICdfaWQnO1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb0ZpZWxkTmFtZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb0ZpZWxkTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gb2RhdGFGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9iamVjdExvb2t1cEZpZWxkICYmIGZvcm1GaWVsZCAmJiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iamVjdExvb2t1cEZpZWxkLnR5cGUpICYmIChbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG8pIHx8ICgnc3BhY2VfdXNlcnMnID09PSBvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG8gJiYgJ3VzZXInID09PSBvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQpKSkge1xuICAgICAgICAgICAgICAgIGlmICghXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgIGxvb2t1cFNlbGVjdEZpZWxkVmFsdWU7XG4gICAgICAgICAgICAgICAgICBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgbG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgIGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgbG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgbG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChsb29rdXBTZWxlY3RGaWVsZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gbG9va3VwU2VsZWN0RmllbGRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBsb29rdXBPYmplY3RSZWNvcmRbbG9va3VwRmllbGROYW1lXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iakZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqRmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGROYW1lID0gb2JqRmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkIHx8ICdfaWQnO1xuICAgICAgICAgIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9iakZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSByZWNvcmRbb2JqRmllbGQubmFtZV07XG4gICAgICAgICAgb2RhdGFGaWVsZFZhbHVlO1xuICAgICAgICAgIGlmIChvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgIG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9GaWVsZE5hbWUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgIG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9GaWVsZE5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiAoWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob2JqRmllbGQucmVmZXJlbmNlX3RvKSB8fCAoJ3NwYWNlX3VzZXJzJyA9PT0gb2JqRmllbGQucmVmZXJlbmNlX3RvICYmICd1c2VyJyA9PT0gb2JqRmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkKSkpIHtcbiAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSByZWNvcmRbb2JqRmllbGQubmFtZV07XG4gICAgICAgICAgaWYgKCFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKSkge1xuICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZTtcbiAgICAgICAgICAgIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ3VzZXInKSB7XG4gICAgICAgICAgICAgIGlmIChvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1GaWVsZC50eXBlID09PSAnZ3JvdXAnKSB7XG4gICAgICAgICAgICAgIGlmIChvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGVjdEZpZWxkVmFsdWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBzZWxlY3RGaWVsZFZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT09ICdkYXRlJyAmJiByZWNvcmRGaWVsZFZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmZvcm1hdERhdGUocmVjb3JkRmllbGRWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLmhhc093blByb3BlcnR5KG9iamVjdF9maWVsZCkpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHJlY29yZFtvYmplY3RfZmllbGRdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgXy51bmlxKHRhYmxlRmllbGRDb2RlcykuZm9yRWFjaChmdW5jdGlvbih0ZmMpIHtcbiAgICAgIHZhciBjO1xuICAgICAgYyA9IEpTT04ucGFyc2UodGZjKTtcbiAgICAgIHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdID0gW107XG4gICAgICByZXR1cm4gcmVjb3JkW2Mub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGVdLmZvckVhY2goZnVuY3Rpb24odHIpIHtcbiAgICAgICAgdmFyIG5ld1RyO1xuICAgICAgICBuZXdUciA9IHt9O1xuICAgICAgICBfLmVhY2godHIsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgICByZXR1cm4gdGFibGVGaWVsZE1hcC5mb3JFYWNoKGZ1bmN0aW9uKHRmbSkge1xuICAgICAgICAgICAgdmFyIHdUZENvZGU7XG4gICAgICAgICAgICBpZiAodGZtLm9iamVjdF9maWVsZCA9PT0gKGMub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGUgKyAnLiQuJyArIGspKSB7XG4gICAgICAgICAgICAgIHdUZENvZGUgPSB0Zm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5ld1RyW3dUZENvZGVdID0gdjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghXy5pc0VtcHR5KG5ld1RyKSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXS5wdXNoKG5ld1RyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgXy5lYWNoKHRhYmxlVG9SZWxhdGVkTWFwLCBmdW5jdGlvbihtYXAsIGtleSkge1xuICAgICAgdmFyIGZvcm1UYWJsZUZpZWxkLCByZWxhdGVkRmllbGQsIHJlbGF0ZWRGaWVsZE5hbWUsIHJlbGF0ZWRPYmplY3QsIHJlbGF0ZWRPYmplY3ROYW1lLCByZWxhdGVkUmVjb3JkcywgcmVsYXRlZFRhYmxlSXRlbXMsIHRhYmxlQ29kZSwgdGFibGVWYWx1ZXM7XG4gICAgICB0YWJsZUNvZGUgPSBtYXAuX0ZST01fVEFCTEVfQ09ERTtcbiAgICAgIGZvcm1UYWJsZUZpZWxkID0gZ2V0Rm9ybVRhYmxlRmllbGQodGFibGVDb2RlKTtcbiAgICAgIGlmICghdGFibGVDb2RlKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oJ3RhYmxlVG9SZWxhdGVkOiBbJyArIGtleSArICddIG1pc3NpbmcgY29ycmVzcG9uZGluZyB0YWJsZS4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbGF0ZWRPYmplY3ROYW1lID0ga2V5O1xuICAgICAgICB0YWJsZVZhbHVlcyA9IFtdO1xuICAgICAgICByZWxhdGVkVGFibGVJdGVtcyA9IFtdO1xuICAgICAgICByZWxhdGVkT2JqZWN0ID0gZ2V0T2JqZWN0Q29uZmlnKHJlbGF0ZWRPYmplY3ROYW1lKTtcbiAgICAgICAgcmVsYXRlZEZpZWxkID0gXy5maW5kKHJlbGF0ZWRPYmplY3QuZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgcmV0dXJuIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhmLnR5cGUpICYmIGYucmVmZXJlbmNlX3RvID09PSBvYmplY3ROYW1lO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVsYXRlZEZpZWxkTmFtZSA9IHJlbGF0ZWRGaWVsZC5uYW1lO1xuICAgICAgICByZWxhdGVkUmVjb3JkcyA9IG9iamVjdEZpbmQocmVsYXRlZE9iamVjdE5hbWUsIHtcbiAgICAgICAgICBmaWx0ZXJzOiBbW3JlbGF0ZWRGaWVsZE5hbWUsICc9JywgcmVjb3JkSWRdXVxuICAgICAgICB9KTtcbiAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChmdW5jdGlvbihycikge1xuICAgICAgICAgIHZhciB0YWJsZVZhbHVlSXRlbTtcbiAgICAgICAgICB0YWJsZVZhbHVlSXRlbSA9IHt9O1xuICAgICAgICAgIF8uZWFjaChtYXAsIGZ1bmN0aW9uKHZhbHVlS2V5LCBmaWVsZEtleSkge1xuICAgICAgICAgICAgdmFyIGZvcm1GaWVsZCwgZm9ybUZpZWxkS2V5LCByZWZlcmVuY2VUb0ZpZWxkTmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlbGF0ZWRPYmplY3RGaWVsZCwgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKGZpZWxkS2V5ICE9PSAnX0ZST01fVEFCTEVfQ09ERScpIHtcbiAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICBmb3JtRmllbGRLZXk7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZUtleS5zdGFydHNXaXRoKHRhYmxlQ29kZSArICcuJykpIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSAodmFsdWVLZXkuc3BsaXQoXCIuXCIpWzFdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSB2YWx1ZUtleTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBmb3JtRmllbGQgPSBnZXRGb3JtVGFibGVTdWJGaWVsZChmb3JtVGFibGVGaWVsZCwgZm9ybUZpZWxkS2V5KTtcbiAgICAgICAgICAgICAgcmVsYXRlZE9iamVjdEZpZWxkID0gcmVsYXRlZE9iamVjdC5maWVsZHNbZmllbGRLZXldO1xuICAgICAgICAgICAgICBpZiAoIWZvcm1GaWVsZCB8fCAhcmVsYXRlZE9iamVjdEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkTmFtZSA9IHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQgfHwgJ19pZCc7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gcmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV07XG4gICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9GaWVsZE5hbWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV07XG4gICAgICAgICAgICAgICAgaWYgKCFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgaWYgKGZvcm1GaWVsZC50eXBlID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdncm91cCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1GaWVsZC50eXBlID09PSAnZGF0ZScgJiYgcnJbZmllbGRLZXldKSB7XG4gICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5mb3JtYXREYXRlKHJyW2ZpZWxkS2V5XSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gcnJbZmllbGRLZXldO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB0YWJsZVZhbHVlSXRlbVtmb3JtRmllbGRLZXldID0gdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICghXy5pc0VtcHR5KHRhYmxlVmFsdWVJdGVtKSkge1xuICAgICAgICAgICAgdGFibGVWYWx1ZUl0ZW0uX2lkID0gcnIuX2lkO1xuICAgICAgICAgICAgdGFibGVWYWx1ZXMucHVzaCh0YWJsZVZhbHVlSXRlbSk7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZFRhYmxlSXRlbXMucHVzaCh7XG4gICAgICAgICAgICAgIF90YWJsZToge1xuICAgICAgICAgICAgICAgIF9pZDogcnIuX2lkLFxuICAgICAgICAgICAgICAgIF9jb2RlOiB0YWJsZUNvZGVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdmFsdWVzW3RhYmxlQ29kZV0gPSB0YWJsZVZhbHVlcztcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRUYWJsZXNJbmZvW3JlbGF0ZWRPYmplY3ROYW1lXSA9IHJlbGF0ZWRUYWJsZUl0ZW1zO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChvdy5maWVsZF9tYXBfc2NyaXB0KSB7XG4gICAgICBfLmV4dGVuZCh2YWx1ZXMsIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0KG93LmZpZWxkX21hcF9zY3JpcHQsIG9iamVjdE5hbWUsIHNwYWNlSWQsIHJlY29yZElkKSk7XG4gICAgfVxuICB9XG4gIGZpbHRlclZhbHVlcyA9IHt9O1xuICBfLmVhY2goXy5rZXlzKHZhbHVlcyksIGZ1bmN0aW9uKGspIHtcbiAgICBpZiAoZmllbGRDb2Rlcy5pbmNsdWRlcyhrKSkge1xuICAgICAgcmV0dXJuIGZpbHRlclZhbHVlc1trXSA9IHZhbHVlc1trXTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmlsdGVyVmFsdWVzO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5ldmFsRmllbGRNYXBTY3JpcHQgPSBmdW5jdGlvbihmaWVsZF9tYXBfc2NyaXB0LCBvYmplY3ROYW1lLCBzcGFjZUlkLCBvYmplY3RJZCkge1xuICB2YXIgZnVuYywgcmVjb3JkLCBzY3JpcHQsIHZhbHVlcztcbiAgcmVjb3JkID0gb2JqZWN0RmluZE9uZShvYmplY3ROYW1lLCB7XG4gICAgZmlsdGVyczogW1snX2lkJywgJz0nLCBvYmplY3RJZF1dXG4gIH0pO1xuICBzY3JpcHQgPSBcIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJlY29yZCkgeyBcIiArIGZpZWxkX21hcF9zY3JpcHQgKyBcIiB9XCI7XG4gIGZ1bmMgPSBfZXZhbChzY3JpcHQsIFwiZmllbGRfbWFwX3NjcmlwdFwiKTtcbiAgdmFsdWVzID0gZnVuYyhyZWNvcmQpO1xuICBpZiAoXy5pc09iamVjdCh2YWx1ZXMpKSB7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKFwiZXZhbEZpZWxkTWFwU2NyaXB0OiDohJrmnKzov5Tlm57lgLznsbvlnovkuI3mmK/lr7nosaFcIik7XG4gIH1cbiAgcmV0dXJuIHt9O1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZUF0dGFjaCA9IGZ1bmN0aW9uKHJlY29yZElkcywgc3BhY2VJZCwgaW5zSWQsIGFwcHJvdmVJZCkge1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zWydjbXNfZmlsZXMnXS5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICBwYXJlbnQ6IHJlY29yZElkc1xuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGNmKSB7XG4gICAgcmV0dXJuIF8uZWFjaChjZi52ZXJzaW9ucywgZnVuY3Rpb24odmVyc2lvbklkLCBpZHgpIHtcbiAgICAgIHZhciBmLCBuZXdGaWxlO1xuICAgICAgZiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ10uZmluZE9uZSh2ZXJzaW9uSWQpO1xuICAgICAgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XG4gICAgICByZXR1cm4gbmV3RmlsZS5hdHRhY2hEYXRhKGYuY3JlYXRlUmVhZFN0cmVhbSgnZmlsZXMnKSwge1xuICAgICAgICB0eXBlOiBmLm9yaWdpbmFsLnR5cGVcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICB2YXIgbWV0YWRhdGE7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbik7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RmlsZS5uYW1lKGYubmFtZSgpKTtcbiAgICAgICAgbmV3RmlsZS5zaXplKGYuc2l6ZSgpKTtcbiAgICAgICAgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgb3duZXI6IGYubWV0YWRhdGEub3duZXIsXG4gICAgICAgICAgb3duZXJfbmFtZTogZi5tZXRhZGF0YS5vd25lcl9uYW1lLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgIGluc3RhbmNlOiBpbnNJZCxcbiAgICAgICAgICBhcHByb3ZlOiBhcHByb3ZlSWQsXG4gICAgICAgICAgcGFyZW50OiBjZi5faWRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGlkeCA9PT0gMCkge1xuICAgICAgICAgIG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgcmV0dXJuIGNmcy5pbnN0YW5jZXMuaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlY29yZEluc3RhbmNlSW5mbyA9IGZ1bmN0aW9uKHJlY29yZElkcywgaW5zSWQsIHNwYWNlSWQpIHtcbiAgb2JqZWN0VXBkYXRlKHJlY29yZElkcy5vLCByZWNvcmRJZHMuaWRzWzBdLCB7XG4gICAgaW5zdGFuY2VzOiBbXG4gICAgICB7XG4gICAgICAgIF9pZDogaW5zSWQsXG4gICAgICAgIHN0YXRlOiAnZHJhZnQnXG4gICAgICB9XG4gICAgXSxcbiAgICBsb2NrZWQ6IHRydWUsXG4gICAgaW5zdGFuY2Vfc3RhdGU6ICdkcmFmdCdcbiAgfSk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyA9IGZ1bmN0aW9uKHJlbGF0ZWRUYWJsZXNJbmZvLCBpbnNJZCwgc3BhY2VJZCkge1xuICBfLmVhY2gocmVsYXRlZFRhYmxlc0luZm8sIGZ1bmN0aW9uKHRhYmxlSXRlbXMsIHJlbGF0ZWRPYmplY3ROYW1lKSB7XG4gICAgdmFyIHJlbGF0ZWRDb2xsZWN0aW9uO1xuICAgIHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKTtcbiAgICByZXR1cm4gXy5lYWNoKHRhYmxlSXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiByZWxhdGVkQ29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKGl0ZW0uX3RhYmxlLl9pZCwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgaW5zdGFuY2VzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIF9pZDogaW5zSWQsXG4gICAgICAgICAgICAgIHN0YXRlOiAnZHJhZnQnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICBfdGFibGU6IGl0ZW0uX3RhYmxlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tJc0luQXBwcm92YWwgPSBmdW5jdGlvbihyZWNvcmRJZHMsIHNwYWNlSWQpIHtcbiAgdmFyIHJlY29yZDtcbiAgcmVjb3JkID0gb2JqZWN0RmluZE9uZShyZWNvcmRJZHMubywge1xuICAgIGZpbHRlcnM6IFtbJ19pZCcsICc9JywgcmVjb3JkSWRzLmlkc1swXV1dLFxuICAgIGZpZWxkczogWydpbnN0YW5jZXMnXVxuICB9KTtcbiAgaWYgKHJlY29yZCAmJiByZWNvcmQuaW5zdGFuY2VzICYmIHJlY29yZC5pbnN0YW5jZXNbMF0uc3RhdGUgIT09ICdjb21wbGV0ZWQnICYmIENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmZpbmQocmVjb3JkLmluc3RhbmNlc1swXS5faWQpLmNvdW50KCkgPiAwKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmraTorrDlvZXlt7Llj5HotbfmtYHnqIvmraPlnKjlrqHmibnkuK3vvIzlvoXlrqHmibnnu5PmnZ/mlrnlj6/lj5HotbfkuIvkuIDmrKHlrqHmibnvvIFcIik7XG4gIH1cbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgcmV0dXJuIG1vbWVudChkYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xufTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvb2JqZWN0L3dvcmtmbG93L2RyYWZ0cycsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0dHJ5XG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxuXHRcdGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZFxuXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxuXG5cdFx0aW5zZXJ0ZWRfaW5zdGFuY2VzID0gbmV3IEFycmF5XG5cblx0XHRfLmVhY2ggaGFzaERhdGFbJ0luc3RhbmNlcyddLCAoaW5zdGFuY2VfZnJvbV9jbGllbnQpIC0+XG5cdFx0XHRuZXdfaW5zX2lkID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UoaW5zdGFuY2VfZnJvbV9jbGllbnQsIGN1cnJlbnRfdXNlcl9pbmZvKVxuXG5cdFx0XHRuZXdfaW5zID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZE9uZSh7IF9pZDogbmV3X2luc19pZCB9LCB7IGZpZWxkczogeyBzcGFjZTogMSwgZmxvdzogMSwgZmxvd192ZXJzaW9uOiAxLCBmb3JtOiAxLCBmb3JtX3ZlcnNpb246IDEgfSB9KVxuXG5cdFx0XHRpbnNlcnRlZF9pbnN0YW5jZXMucHVzaChuZXdfaW5zKVxuXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGluc2VydHM6IGluc2VydGVkX2luc3RhbmNlcyB9XG5cdFx0fVxuXHRjYXRjaCBlXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3sgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfV0gfVxuXHRcdH1cblxuIiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS9vYmplY3Qvd29ya2Zsb3cvZHJhZnRzJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGN1cnJlbnRfdXNlcl9pZCwgY3VycmVudF91c2VyX2luZm8sIGUsIGhhc2hEYXRhLCBpbnNlcnRlZF9pbnN0YW5jZXM7XG4gIHRyeSB7XG4gICAgY3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKTtcbiAgICBjdXJyZW50X3VzZXJfaWQgPSBjdXJyZW50X3VzZXJfaW5mby5faWQ7XG4gICAgaGFzaERhdGEgPSByZXEuYm9keTtcbiAgICBpbnNlcnRlZF9pbnN0YW5jZXMgPSBuZXcgQXJyYXk7XG4gICAgXy5lYWNoKGhhc2hEYXRhWydJbnN0YW5jZXMnXSwgZnVuY3Rpb24oaW5zdGFuY2VfZnJvbV9jbGllbnQpIHtcbiAgICAgIHZhciBuZXdfaW5zLCBuZXdfaW5zX2lkO1xuICAgICAgbmV3X2luc19pZCA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY3JlYXRlX2luc3RhbmNlKGluc3RhbmNlX2Zyb21fY2xpZW50LCBjdXJyZW50X3VzZXJfaW5mbyk7XG4gICAgICBuZXdfaW5zID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogbmV3X2luc19pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBzcGFjZTogMSxcbiAgICAgICAgICBmbG93OiAxLFxuICAgICAgICAgIGZsb3dfdmVyc2lvbjogMSxcbiAgICAgICAgICBmb3JtOiAxLFxuICAgICAgICAgIGZvcm1fdmVyc2lvbjogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBpbnNlcnRlZF9pbnN0YW5jZXMucHVzaChuZXdfaW5zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBpbnNlcnRzOiBpbnNlcnRlZF9pbnN0YW5jZXNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==
