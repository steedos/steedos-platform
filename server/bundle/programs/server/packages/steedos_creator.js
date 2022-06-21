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
var Theme = Package['steedos:theme'].Theme;
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
  mkdirp: "^0.3.5",
  "xml2js": "^0.4.19"
}, 'steedos:creator');

if (Meteor.settings && Meteor.settings.cfs && Meteor.settings.cfs.aliyun) {
  checkNpmVersions({
    "aliyun-sdk": "^1.11.12"
  }, 'steedos:creator');
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"core.coffee":function module(require){

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
  if (Meteor.isClient) {
    return BuilderCreator.pluginComponentSelector(BuilderCreator.store.getState(), "ObjectHome", object_name);
  }
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
    if (object_name === "meeting") {
      return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name + "/calendar/");
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
    if (object_name === "meeting") {
      return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/calendar/", true);
    } else {
      return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/grid/" + list_view_id, true);
    }
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
    if (object_name === "meeting") {
      return "/app/" + app_id + "/" + object_name + "/calendar/";
    } else {
      return "/app/" + app_id + "/" + object_name + "/grid/" + list_view_id;
    }
  }
};

Creator.getListViewUrl = function (object_name, app_id, list_view_id) {
  var url;
  url = Creator.getListViewRelativeUrl(object_name, app_id, list_view_id);
  return Creator.getRelativeUrl(url);
};

Creator.getListViewRelativeUrl = function (object_name, app_id, list_view_id) {
  if (list_view_id === "calendar") {
    return "/app/" + app_id + "/" + object_name + "/calendar/";
  } else {
    return "/app/" + app_id + "/" + object_name + "/grid/" + list_view_id;
  }
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

  if (!app) {
    return;
  }

  return BuilderCreator.pluginComponentSelector(BuilderCreator.store.getState(), "Dashboard", app._id);
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

Creator.getVisibleApps = function (includeAdmin) {
  var changeApp;
  changeApp = Creator._subApp.get();
  BuilderCreator.store.getState().entities.apps = Object.assign({}, BuilderCreator.store.getState().entities.apps, {
    apps: changeApp
  });
  return BuilderCreator.visibleAppsSelector(BuilderCreator.store.getState(), includeAdmin);
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
  var logicTempFilters, selector, steedosFilters;
  steedosFilters = require("@steedos/filters");

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

  selector = steedosFilters.formatFiltersToDev(filters, Creator.USER_CONTEXT);
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

    getFieldOdataValue = function (objName, id) {
      var _record, _records, nameKey, obj;

      obj = objectql.getObject(objName);
      nameKey = getObjectNameFieldKey(objName);

      if (!obj) {
        return;
      }

      if (_.isString(id)) {
        _record = objectFindOne(objName, {
          filters: [['_id', '=', id]]
        });

        if (_record) {
          _record['@label'] = _record[nameKey];
          return _record;
        }
      } else if (_.isArray(id)) {
        _records = [];
        objectFind(objName, {
          filters: [['_id', 'in', id]]
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
        var formField, formTableFieldCode, gridCode, lookupFieldName, lookupFieldObj, lookupObjectRecord, lookupSelectFieldValue, oTableCode, oTableCodeReferenceField, oTableCodeReferenceFieldCode, oTableFieldCode, objField, objectField, objectFieldName, objectFieldObjectName, objectLookupField, object_field, odataFieldValue, referenceToDoc, referenceToFieldValue, referenceToObjectName, relatedObjectFieldCode, selectFieldValue, tableToRelatedMapKey, wTableCode, workflow_field;
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

              referenceToObjectName = oTableCodeReferenceField.reference_to;
              referenceToFieldValue = record[oTableCodeReferenceField.name];
              referenceToDoc = getFieldOdataValue(referenceToObjectName, referenceToFieldValue);

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
                referenceToObjectName = objectLookupField.reference_to;
                odataFieldValue;

                if (objectField.multiple && formField.is_multiselect) {
                  odataFieldValue = getFieldOdataValue(referenceToObjectName, referenceToFieldValue);
                } else if (!objectField.multiple && !formField.is_multiselect) {
                  odataFieldValue = getFieldOdataValue(referenceToObjectName, referenceToFieldValue);
                }

                return values[workflow_field] = odataFieldValue;
              } else if (objectLookupField && formField && ['user', 'group'].includes(formField.type) && ['lookup', 'master_detail'].includes(objectLookupField.type) && ['users', 'organizations'].includes(objectLookupField.reference_to)) {
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
          referenceToObjectName = objField.reference_to;
          referenceToFieldValue = record[objField.name];
          odataFieldValue;

          if (objField.multiple && formField.is_multiselect) {
            odataFieldValue = getFieldOdataValue(referenceToObjectName, referenceToFieldValue);
          } else if (!objField.multiple && !formField.is_multiselect) {
            odataFieldValue = getFieldOdataValue(referenceToObjectName, referenceToFieldValue);
          }

          return values[workflow_field] = odataFieldValue;
        } else if (formField && objField && ['user', 'group'].includes(formField.type) && ['lookup', 'master_detail'].includes(objField.type) && ['users', 'organizations'].includes(objField.reference_to)) {
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
            var formField, formFieldKey, referenceToFieldValue, referenceToObjectName, relatedObjectField, tableFieldValue;

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
                referenceToObjectName = relatedObjectField.reference_to;
                referenceToFieldValue = rr[fieldKey];

                if (relatedObjectField.multiple && formField.is_multiselect) {
                  tableFieldValue = getFieldOdataValue(referenceToObjectName, referenceToFieldValue);
                } else if (!relatedObjectField.multiple && !formField.is_multiselect) {
                  tableFieldValue = getFieldOdataValue(referenceToObjectName, referenceToFieldValue);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjcmVhdG9yL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvbGliL2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvb2JqZWN0X3JlY2VudF92aWV3ZWQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3ZpZXdlZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3JlY29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9yZWNlbnRfcmVjb3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9yZXBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3JlcG9ydF9kYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfZXhwb3J0MnhtbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9leHBvcnQyeG1sLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3JlbGF0ZWRfb2JqZWN0c19yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvcGVuZGluZ19zcGFjZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3BlbmRpbmdfc3BhY2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF90YWJ1bGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF9saXN0dmlld3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy91c2VyX3RhYnVsYXJfc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9yZWxhdGVkX29iamVjdHNfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV91c2VyX2luZm8uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c192aWV3X2xpbWl0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfdmlld19saW1pdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c19ub19mb3JjZV9waG9uZV91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9uZWVkX3RvX2NvbmZpcm0uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX25lZWRfdG9fY29uZmlybS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbGliL3Blcm1pc3Npb25fbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvcGVybWlzc2lvbl9tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImJ1c2JveSIsIm1rZGlycCIsIk1ldGVvciIsInNldHRpbmdzIiwiY2ZzIiwiYWxpeXVuIiwiQ3JlYXRvciIsImdldFNjaGVtYSIsIm9iamVjdF9uYW1lIiwicmVmIiwiZ2V0T2JqZWN0Iiwic2NoZW1hIiwiZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCIsImlzQ2xpZW50IiwiQnVpbGRlckNyZWF0b3IiLCJwbHVnaW5Db21wb25lbnRTZWxlY3RvciIsInN0b3JlIiwiZ2V0U3RhdGUiLCJnZXRPYmplY3RVcmwiLCJyZWNvcmRfaWQiLCJhcHBfaWQiLCJsaXN0X3ZpZXciLCJsaXN0X3ZpZXdfaWQiLCJTZXNzaW9uIiwiZ2V0IiwiZ2V0TGlzdFZpZXciLCJfaWQiLCJnZXRSZWxhdGl2ZVVybCIsImdldE9iamVjdEFic29sdXRlVXJsIiwiU3RlZWRvcyIsImFic29sdXRlVXJsIiwiZ2V0T2JqZWN0Um91dGVyVXJsIiwiZ2V0TGlzdFZpZXdVcmwiLCJ1cmwiLCJnZXRMaXN0Vmlld1JlbGF0aXZlVXJsIiwiZ2V0U3dpdGNoTGlzdFVybCIsImdldFJlbGF0ZWRPYmplY3RVcmwiLCJyZWxhdGVkX29iamVjdF9uYW1lIiwicmVsYXRlZF9maWVsZF9uYW1lIiwiZ2V0T2JqZWN0TG9va3VwRmllbGRPcHRpb25zIiwiaXNfZGVlcCIsImlzX3NraXBfaGlkZSIsImlzX3JlbGF0ZWQiLCJfb2JqZWN0IiwiX29wdGlvbnMiLCJmaWVsZHMiLCJpY29uIiwicmVsYXRlZE9iamVjdHMiLCJfIiwiZm9yRWFjaCIsImYiLCJrIiwiaGlkZGVuIiwidHlwZSIsInB1c2giLCJsYWJlbCIsInZhbHVlIiwicl9vYmplY3QiLCJyZWZlcmVuY2VfdG8iLCJpc1N0cmluZyIsImYyIiwiazIiLCJnZXRSZWxhdGVkT2JqZWN0cyIsImVhY2giLCJfdGhpcyIsIl9yZWxhdGVkT2JqZWN0IiwicmVsYXRlZE9iamVjdCIsInJlbGF0ZWRPcHRpb25zIiwicmVsYXRlZE9wdGlvbiIsImZvcmVpZ25fa2V5IiwibmFtZSIsImdldE9iamVjdEZpbHRlckZpZWxkT3B0aW9ucyIsInBlcm1pc3Npb25fZmllbGRzIiwiZ2V0RmllbGRzIiwiaW5jbHVkZSIsInRlc3QiLCJpbmRleE9mIiwiZ2V0T2JqZWN0RmllbGRPcHRpb25zIiwiZ2V0RmlsdGVyc1dpdGhGaWx0ZXJGaWVsZHMiLCJmaWx0ZXJzIiwiZmlsdGVyX2ZpZWxkcyIsImxlbmd0aCIsIm4iLCJmaWVsZCIsInJlcXVpcmVkIiwiZmluZFdoZXJlIiwiaXNfZGVmYXVsdCIsImlzX3JlcXVpcmVkIiwiZmlsdGVySXRlbSIsIm1hdGNoRmllbGQiLCJmaW5kIiwiZ2V0T2JqZWN0UmVjb3JkIiwic2VsZWN0X2ZpZWxkcyIsImV4cGFuZCIsImNvbGxlY3Rpb24iLCJvYmoiLCJyZWNvcmQiLCJyZWYxIiwicmVmMiIsIlRlbXBsYXRlIiwiaW5zdGFuY2UiLCJvZGF0YSIsImRhdGFiYXNlX25hbWUiLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsImdldE9iamVjdFJlY29yZE5hbWUiLCJuYW1lX2ZpZWxkX2tleSIsIk5BTUVfRklFTERfS0VZIiwiZ2V0QXBwIiwiYXBwIiwiQXBwcyIsImRlcHMiLCJkZXBlbmQiLCJnZXRBcHBEYXNoYm9hcmQiLCJkYXNoYm9hcmQiLCJEYXNoYm9hcmRzIiwiYXBwcyIsImdldEFwcERhc2hib2FyZENvbXBvbmVudCIsImdldEFwcE9iamVjdE5hbWVzIiwiYXBwT2JqZWN0cyIsImlzTW9iaWxlIiwib2JqZWN0cyIsIm1vYmlsZV9vYmplY3RzIiwicGVybWlzc2lvbnMiLCJhbGxvd1JlYWQiLCJnZXRVcmxXaXRoVG9rZW4iLCJleHByZXNzaW9uRm9ybURhdGEiLCJoYXNRdWVyeVN5bWJvbCIsImxpbmtTdHIiLCJwYXJhbXMiLCJzcGFjZUlkIiwidXNlcklkIiwiZ2V0VXNlckNvbXBhbnlJZHMiLCJBY2NvdW50cyIsIl9zdG9yZWRMb2dpblRva2VuIiwiaXNFeHByZXNzaW9uIiwicGFyc2VTaW5nbGVFeHByZXNzaW9uIiwiVVNFUl9DT05URVhUIiwiJCIsInBhcmFtIiwiZ2V0QXBwTWVudSIsIm1lbnVfaWQiLCJtZW51cyIsImdldEFwcE1lbnVzIiwibWVudSIsImlkIiwiZ2V0QXBwTWVudVVybEZvckludGVybmV0IiwicGF0aCIsImdldEFwcE1lbnVVcmwiLCJ0YXJnZXQiLCJhcHBNZW51cyIsImN1cmVudEFwcE1lbnVzIiwibWVudUl0ZW0iLCJjaGlsZHJlbiIsImxvYWRBcHBzTWVudXMiLCJkYXRhIiwib3B0aW9ucyIsIm1vYmlsZSIsInN1Y2Nlc3MiLCJzZXQiLCJhdXRoUmVxdWVzdCIsImdldFZpc2libGVBcHBzIiwiaW5jbHVkZUFkbWluIiwiY2hhbmdlQXBwIiwiX3N1YkFwcCIsImVudGl0aWVzIiwiT2JqZWN0IiwiYXNzaWduIiwidmlzaWJsZUFwcHNTZWxlY3RvciIsImdldFZpc2libGVBcHBzT2JqZWN0cyIsInZpc2libGVPYmplY3ROYW1lcyIsImZsYXR0ZW4iLCJwbHVjayIsImZpbHRlciIsIk9iamVjdHMiLCJzb3J0Iiwic29ydGluZ01ldGhvZCIsImJpbmQiLCJrZXkiLCJ1bmlxIiwiZ2V0QXBwc09iamVjdHMiLCJ0ZW1wT2JqZWN0cyIsImNvbmNhdCIsInZhbGlkYXRlRmlsdGVycyIsImxvZ2ljIiwiZSIsImVycm9yTXNnIiwiZmlsdGVyX2l0ZW1zIiwiZmlsdGVyX2xlbmd0aCIsImZsYWciLCJpbmRleCIsIndvcmQiLCJtYXAiLCJpc0VtcHR5IiwiY29tcGFjdCIsInJlcGxhY2UiLCJtYXRjaCIsImkiLCJpbmNsdWRlcyIsInciLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJ0b2FzdHIiLCJmb3JtYXRGaWx0ZXJzVG9Nb25nbyIsInNlbGVjdG9yIiwiQXJyYXkiLCJvcGVyYXRpb24iLCJvcHRpb24iLCJyZWciLCJzdWJfc2VsZWN0b3IiLCJldmFsdWF0ZUZvcm11bGEiLCJSZWdFeHAiLCJpc0JldHdlZW5GaWx0ZXJPcGVyYXRpb24iLCJnZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMiLCJmb3JtYXRGaWx0ZXJzVG9EZXYiLCJsb2dpY1RlbXBGaWx0ZXJzIiwic3RlZWRvc0ZpbHRlcnMiLCJyZXF1aXJlIiwiaXNfbG9naWNfb3IiLCJwb3AiLCJmb3JtYXRMb2dpY0ZpbHRlcnNUb0RldiIsImZpbHRlcl9sb2dpYyIsImZvcm1hdF9sb2dpYyIsIngiLCJfZiIsImlzQXJyYXkiLCJKU09OIiwic3RyaW5naWZ5IiwicmVsYXRlZF9vYmplY3RfbmFtZXMiLCJyZWxhdGVkX29iamVjdHMiLCJ1bnJlbGF0ZWRfb2JqZWN0cyIsImdldE9iamVjdFJlbGF0ZWRzIiwiX2NvbGxlY3Rpb25fbmFtZSIsImdldFBlcm1pc3Npb25zIiwiZGlmZmVyZW5jZSIsInJlbGF0ZWRfb2JqZWN0IiwiaXNBY3RpdmUiLCJhbGxvd1JlYWRGaWxlcyIsImdldFJlbGF0ZWRPYmplY3ROYW1lcyIsImdldFJlbGF0ZWRPYmplY3RMaXN0QWN0aW9ucyIsInJlbGF0ZWRPYmplY3ROYW1lIiwiYWN0aW9ucyIsImdldEFjdGlvbnMiLCJhY3Rpb24iLCJvbiIsInZpc2libGUiLCJkaXNhYmxlZF9hY3Rpb25zIiwic29ydEJ5IiwidmFsdWVzIiwiaGFzIiwiYWxsb3dfY3VzdG9tQWN0aW9ucyIsImtleXMiLCJleGNsdWRlX2FjdGlvbnMiLCJnZXRMaXN0Vmlld3MiLCJkaXNhYmxlZF9saXN0X3ZpZXdzIiwibGlzdFZpZXdzIiwibGlzdF92aWV3cyIsIm9iamVjdCIsIml0ZW0iLCJpdGVtX25hbWUiLCJpc0Rpc2FibGVkIiwib3duZXIiLCJmaWVsZHNOYW1lIiwidW5yZWFkYWJsZV9maWVsZHMiLCJnZXRPYmplY3RGaWVsZHNOYW1lIiwiaXNsb2FkaW5nIiwiYm9vdHN0cmFwTG9hZGVkIiwiY29udmVydFNwZWNpYWxDaGFyYWN0ZXIiLCJzdHIiLCJnZXREaXNhYmxlZEZpZWxkcyIsImZpZWxkTmFtZSIsImF1dG9mb3JtIiwiZGlzYWJsZWQiLCJvbWl0IiwiZ2V0SGlkZGVuRmllbGRzIiwiZ2V0RmllbGRzV2l0aE5vR3JvdXAiLCJncm91cCIsImdldFNvcnRlZEZpZWxkR3JvdXBOYW1lcyIsIm5hbWVzIiwidW5pcXVlIiwiZ2V0RmllbGRzRm9yR3JvdXAiLCJncm91cE5hbWUiLCJnZXRTeXN0ZW1CYXNlRmllbGRzIiwiZ2V0RmllbGRzV2l0aG91dFN5c3RlbUJhc2UiLCJnZXRGaWVsZHNXaXRob3V0T21pdCIsInBpY2siLCJnZXRGaWVsZHNJbkZpcnN0TGV2ZWwiLCJmaXJzdExldmVsS2V5cyIsImdldEZpZWxkc0ZvclJlb3JkZXIiLCJpc1NpbmdsZSIsIl9rZXlzIiwiY2hpbGRLZXlzIiwiaXNfd2lkZV8xIiwiaXNfd2lkZV8yIiwic2NfMSIsInNjXzIiLCJlbmRzV2l0aCIsImlzX3dpZGUiLCJzbGljZSIsImlzRmlsdGVyVmFsdWVFbXB0eSIsIk51bWJlciIsImlzTmFOIiwiZ2V0RmllbGREYXRhVHlwZSIsIm9iamVjdEZpZWxkcyIsInJlc3VsdCIsImRhdGFfdHlwZSIsImlzU2VydmVyIiwiZ2V0QWxsUmVsYXRlZE9iamVjdHMiLCJyZWxhdGVkX2ZpZWxkIiwiZW5hYmxlX2ZpbGVzIiwiZm9ybWF0SW5kZXgiLCJhcnJheSIsImluZGV4TmFtZSIsImlzZG9jdW1lbnREQiIsImJhY2tncm91bmQiLCJkYXRhc291cmNlcyIsImRvY3VtZW50REIiLCJqb2luIiwic3Vic3RyaW5nIiwiYXBwc0J5TmFtZSIsIm1ldGhvZHMiLCJzcGFjZV9pZCIsImNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZCIsImN1cnJlbnRfcmVjZW50X3ZpZXdlZCIsImRvYyIsInNwYWNlIiwidXBkYXRlIiwiJGluYyIsImNvdW50IiwiJHNldCIsIm1vZGlmaWVkIiwiRGF0ZSIsIm1vZGlmaWVkX2J5IiwiaW5zZXJ0IiwiX21ha2VOZXdJRCIsIm8iLCJpZHMiLCJjcmVhdGVkIiwiY3JlYXRlZF9ieSIsImFzeW5jX3JlY2VudF9hZ2dyZWdhdGUiLCJyZWNlbnRfYWdncmVnYXRlIiwic2VhcmNoX29iamVjdCIsIl9yZWNvcmRzIiwiY2FsbGJhY2siLCJDb2xsZWN0aW9ucyIsIm9iamVjdF9yZWNlbnRfdmlld2VkIiwicmF3Q29sbGVjdGlvbiIsImFnZ3JlZ2F0ZSIsIiRtYXRjaCIsIiRncm91cCIsIm1heENyZWF0ZWQiLCIkbWF4IiwiJHNvcnQiLCIkbGltaXQiLCJ0b0FycmF5IiwiZXJyIiwiRXJyb3IiLCJpc0Z1bmN0aW9uIiwid3JhcEFzeW5jIiwic2VhcmNoVGV4dCIsIl9vYmplY3RfY29sbGVjdGlvbiIsIl9vYmplY3RfbmFtZV9rZXkiLCJxdWVyeSIsInF1ZXJ5X2FuZCIsInJlY29yZHMiLCJzZWFyY2hfS2V5d29yZHMiLCJzcGxpdCIsImtleXdvcmQiLCJzdWJxdWVyeSIsIiRyZWdleCIsInRyaW0iLCIkYW5kIiwiJGluIiwibGltaXQiLCJfbmFtZSIsIl9vYmplY3RfbmFtZSIsInJlY29yZF9vYmplY3QiLCJyZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24iLCJzZWxmIiwib2JqZWN0c0J5TmFtZSIsIm9iamVjdF9yZWNvcmQiLCJlbmFibGVfc2VhcmNoIiwidXBkYXRlX2ZpbHRlcnMiLCJsaXN0dmlld19pZCIsImZpbHRlcl9zY29wZSIsIm9iamVjdF9saXN0dmlld3MiLCJkaXJlY3QiLCJ1cGRhdGVfY29sdW1ucyIsImNvbHVtbnMiLCJjaGVjayIsImNvbXBvdW5kRmllbGRzIiwiY3Vyc29yIiwiZmlsdGVyRmllbGRzIiwiY2hpbGRLZXkiLCJvYmplY3RGaWVsZCIsInNwbGl0cyIsImlzQ29tbW9uU3BhY2UiLCJpc1NwYWNlQWRtaW4iLCJza2lwIiwiZmV0Y2giLCJjb21wb3VuZEZpZWxkSXRlbSIsImNvbXBvdW5kRmlsdGVyRmllbGRzIiwiaXRlbUtleSIsIml0ZW1WYWx1ZSIsInJlZmVyZW5jZUl0ZW0iLCJzZXR0aW5nIiwiY29sdW1uX3dpZHRoIiwib2JqMSIsIl9pZF9hY3Rpb25zIiwiX21peEZpZWxkc0RhdGEiLCJfbWl4UmVsYXRlZERhdGEiLCJfd3JpdGVYbWxGaWxlIiwiZnMiLCJsb2dnZXIiLCJ4bWwyanMiLCJMb2dnZXIiLCJqc29uT2JqIiwib2JqTmFtZSIsImJ1aWxkZXIiLCJkYXkiLCJmaWxlQWRkcmVzcyIsImZpbGVOYW1lIiwiZmlsZVBhdGgiLCJtb250aCIsIm5vdyIsInN0cmVhbSIsInhtbCIsInllYXIiLCJCdWlsZGVyIiwiYnVpbGRPYmplY3QiLCJCdWZmZXIiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsIl9fbWV0ZW9yX2Jvb3RzdHJhcF9fIiwic2VydmVyRGlyIiwiZXhpc3RzU3luYyIsInN5bmMiLCJ3cml0ZUZpbGUiLCJtaXhCb29sIiwibWl4RGF0ZSIsIm1peERlZmF1bHQiLCJvYmpGaWVsZHMiLCJmaWVsZF9uYW1lIiwiZGF0ZSIsImRhdGVTdHIiLCJmb3JtYXQiLCJtb21lbnQiLCJyZWxhdGVkT2JqTmFtZXMiLCJyZWxhdGVkT2JqTmFtZSIsInJlbGF0ZWRDb2xsZWN0aW9uIiwicmVsYXRlZFJlY29yZExpc3QiLCJyZWxhdGVkVGFibGVEYXRhIiwicmVsYXRlZE9iaiIsImZpZWxkc0RhdGEiLCJFeHBvcnQyeG1sIiwicmVjb3JkTGlzdCIsImluZm8iLCJ0aW1lIiwicmVjb3JkT2JqIiwidGltZUVuZCIsInJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzIiwicmVsYXRlZF9yZWNvcmRzIiwidmlld0FsbFJlY29yZHMiLCJnZXRQZW5kaW5nU3BhY2VJbmZvIiwiaW52aXRlcklkIiwiaW52aXRlck5hbWUiLCJzcGFjZU5hbWUiLCJkYiIsInVzZXJzIiwic3BhY2VzIiwiaW52aXRlciIsInJlZnVzZUpvaW5TcGFjZSIsInNwYWNlX3VzZXJzIiwiaW52aXRlX3N0YXRlIiwiYWNjZXB0Sm9pblNwYWNlIiwidXNlcl9hY2NlcHRlZCIsInB1Ymxpc2giLCJwdWJsaXNoQ29tcG9zaXRlIiwidGFibGVOYW1lIiwiX2ZpZWxkcyIsIm9iamVjdF9jb2xsZWNpdG9uIiwicmVmZXJlbmNlX2ZpZWxkcyIsInJlYWR5IiwiU3RyaW5nIiwiTWF0Y2giLCJPcHRpb25hbCIsImdldE9iamVjdE5hbWUiLCJ1bmJsb2NrIiwiZmllbGRfa2V5cyIsIl9vYmplY3RLZXlzIiwicmVmZXJlbmNlX2ZpZWxkIiwicGFyZW50IiwiY2hpbGRyZW5fZmllbGRzIiwicF9rIiwicmVmZXJlbmNlX2lkcyIsInJlZmVyZW5jZV90b19vYmplY3QiLCJzX2siLCJnZXRQcm9wZXJ0eSIsInJlZHVjZSIsImlzT2JqZWN0Iiwic2hhcmVkIiwidXNlciIsInNwYWNlX3NldHRpbmdzIiwicGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwiLCJnZXRGbG93UGVybWlzc2lvbnMiLCJmbG93X2lkIiwidXNlcl9pZCIsImZsb3ciLCJteV9wZXJtaXNzaW9ucyIsIm9yZ19pZHMiLCJvcmdhbml6YXRpb25zIiwib3Jnc19jYW5fYWRkIiwib3Jnc19jYW5fYWRtaW4iLCJvcmdzX2Nhbl9tb25pdG9yIiwidXNlcnNfY2FuX2FkZCIsInVzZXJzX2Nhbl9hZG1pbiIsInVzZXJzX2Nhbl9tb25pdG9yIiwidXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbCIsImdldEZsb3ciLCJwYXJlbnRzIiwib3JnIiwicGFyZW50X2lkIiwicGVybXMiLCJvcmdfaWQiLCJfZXZhbCIsImdldE9iamVjdENvbmZpZyIsImdldE9iamVjdE5hbWVGaWVsZEtleSIsImdldFJlbGF0ZWRzIiwib2JqZWN0RmluZCIsIm9iamVjdEZpbmRPbmUiLCJvYmplY3RVcGRhdGUiLCJvYmplY3RxbCIsIm9iamVjdEFwaU5hbWUiLCJ0b0NvbmZpZyIsImNiIiwidGhlbiIsInJlc29sdmUiLCJyZWplY3QiLCJjaGVja19hdXRob3JpemF0aW9uIiwicmVxIiwiYXV0aFRva2VuIiwiaGFzaGVkVG9rZW4iLCJfaGFzaExvZ2luVG9rZW4iLCJnZXRTcGFjZSIsImZsb3dzIiwiZ2V0U3BhY2VVc2VyIiwic3BhY2VfdXNlciIsImdldFNwYWNlVXNlck9yZ0luZm8iLCJvcmdhbml6YXRpb24iLCJmdWxsbmFtZSIsIm9yZ2FuaXphdGlvbl9uYW1lIiwib3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwiaXNGbG93RW5hYmxlZCIsInN0YXRlIiwiaXNGbG93U3BhY2VNYXRjaGVkIiwiZ2V0Rm9ybSIsImZvcm1faWQiLCJmb3JtIiwiZm9ybXMiLCJnZXRDYXRlZ29yeSIsImNhdGVnb3J5X2lkIiwiY2F0ZWdvcmllcyIsImNoZWNrU3luY0RpcmVjdGlvbiIsIm93Iiwic3luY0RpcmVjdGlvbiIsIm9iamVjdF93b3JrZmxvd3MiLCJzeW5jX2RpcmVjdGlvbiIsImNyZWF0ZV9pbnN0YW5jZSIsImluc3RhbmNlX2Zyb21fY2xpZW50IiwidXNlcl9pbmZvIiwiYXBwcl9vYmoiLCJhcHByb3ZlX2Zyb21fY2xpZW50IiwiY2F0ZWdvcnkiLCJpbnNfb2JqIiwibmV3X2luc19pZCIsInJlbGF0ZWRUYWJsZXNJbmZvIiwic3BhY2VfdXNlcl9vcmdfaW5mbyIsInN0YXJ0X3N0ZXAiLCJ0cmFjZV9mcm9tX2NsaWVudCIsInRyYWNlX29iaiIsImNoZWNrSXNJbkFwcHJvdmFsIiwicGVybWlzc2lvbk1hbmFnZXIiLCJpbnN0YW5jZXMiLCJmbG93X3ZlcnNpb24iLCJjdXJyZW50IiwiZm9ybV92ZXJzaW9uIiwic3VibWl0dGVyIiwic3VibWl0dGVyX25hbWUiLCJhcHBsaWNhbnQiLCJhcHBsaWNhbnRfbmFtZSIsImFwcGxpY2FudF9vcmdhbml6YXRpb24iLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUiLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwiYXBwbGljYW50X2NvbXBhbnkiLCJjb21wYW55X2lkIiwiY29kZSIsImlzX2FyY2hpdmVkIiwiaXNfZGVsZXRlZCIsInJlY29yZF9pZHMiLCJNb25nbyIsIk9iamVjdElEIiwiX3N0ciIsImlzX2ZpbmlzaGVkIiwic3RlcHMiLCJzdGVwIiwic3RlcF90eXBlIiwic3RhcnRfZGF0ZSIsInRyYWNlIiwidXNlcl9uYW1lIiwiaGFuZGxlciIsImhhbmRsZXJfbmFtZSIsImhhbmRsZXJfb3JnYW5pemF0aW9uIiwiaGFuZGxlcl9vcmdhbml6YXRpb25fbmFtZSIsImhhbmRsZXJfb3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwicmVhZF9kYXRlIiwiaXNfcmVhZCIsImlzX2Vycm9yIiwiZGVzY3JpcHRpb24iLCJpbml0aWF0ZVZhbHVlcyIsImFwcHJvdmVzIiwidHJhY2VzIiwiaW5ib3hfdXNlcnMiLCJjdXJyZW50X3N0ZXBfbmFtZSIsImF1dG9fcmVtaW5kIiwiZmxvd19uYW1lIiwiY2F0ZWdvcnlfbmFtZSIsImluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvIiwiaW5pdGlhdGVBdHRhY2giLCJyZWNvcmRJZHMiLCJmbG93SWQiLCJmaWVsZENvZGVzIiwiZmlsdGVyVmFsdWVzIiwiZm9ybUZpZWxkcyIsImZvcm1UYWJsZUZpZWxkcyIsImZvcm1UYWJsZUZpZWxkc0NvZGUiLCJnZXRGaWVsZE9kYXRhVmFsdWUiLCJnZXRGb3JtRmllbGQiLCJnZXRGb3JtVGFibGVGaWVsZCIsImdldEZvcm1UYWJsZUZpZWxkQ29kZSIsImdldEZvcm1UYWJsZVN1YkZpZWxkIiwiZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSIsImdldFNlbGVjdE9yZ1ZhbHVlIiwiZ2V0U2VsZWN0T3JnVmFsdWVzIiwiZ2V0U2VsZWN0VXNlclZhbHVlIiwiZ2V0U2VsZWN0VXNlclZhbHVlcyIsIm9iamVjdE5hbWUiLCJyZWNvcmRJZCIsInJlbGF0ZWRPYmplY3RzS2V5cyIsInRhYmxlRmllbGRDb2RlcyIsInRhYmxlRmllbGRNYXAiLCJ0YWJsZVRvUmVsYXRlZE1hcCIsImZmIiwiZm9ybUZpZWxkIiwicmVsYXRlZE9iamVjdHNLZXkiLCJzdGFydHNXaXRoIiwiZm9ybVRhYmxlRmllbGRDb2RlIiwic2YiLCJ0YWJsZUZpZWxkIiwic3ViRmllbGRDb2RlIiwiX3JlY29yZCIsIm5hbWVLZXkiLCJzdSIsInVzZXJJZHMiLCJzdXMiLCJvcmdJZCIsIm9yZ0lkcyIsIm9yZ3MiLCJmaWVsZF9tYXAiLCJmbSIsImdyaWRDb2RlIiwibG9va3VwRmllbGROYW1lIiwibG9va3VwRmllbGRPYmoiLCJsb29rdXBPYmplY3RSZWNvcmQiLCJsb29rdXBTZWxlY3RGaWVsZFZhbHVlIiwib1RhYmxlQ29kZSIsIm9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZCIsIm9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZENvZGUiLCJvVGFibGVGaWVsZENvZGUiLCJvYmpGaWVsZCIsIm9iamVjdEZpZWxkTmFtZSIsIm9iamVjdEZpZWxkT2JqZWN0TmFtZSIsIm9iamVjdExvb2t1cEZpZWxkIiwib2JqZWN0X2ZpZWxkIiwib2RhdGFGaWVsZFZhbHVlIiwicmVmZXJlbmNlVG9Eb2MiLCJyZWZlcmVuY2VUb0ZpZWxkVmFsdWUiLCJyZWZlcmVuY2VUb09iamVjdE5hbWUiLCJyZWxhdGVkT2JqZWN0RmllbGRDb2RlIiwic2VsZWN0RmllbGRWYWx1ZSIsInRhYmxlVG9SZWxhdGVkTWFwS2V5Iiwid1RhYmxlQ29kZSIsIndvcmtmbG93X2ZpZWxkIiwiaGFzT3duUHJvcGVydHkiLCJ3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlIiwib2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGUiLCJtdWx0aXBsZSIsImlzX211bHRpc2VsZWN0IiwidGZjIiwiYyIsInBhcnNlIiwidHIiLCJuZXdUciIsInRmbSIsIndUZENvZGUiLCJmb3JtVGFibGVGaWVsZCIsInJlbGF0ZWRGaWVsZCIsInJlbGF0ZWRGaWVsZE5hbWUiLCJyZWxhdGVkUmVjb3JkcyIsInJlbGF0ZWRUYWJsZUl0ZW1zIiwidGFibGVDb2RlIiwidGFibGVWYWx1ZXMiLCJfRlJPTV9UQUJMRV9DT0RFIiwid2FybiIsInJyIiwidGFibGVWYWx1ZUl0ZW0iLCJ2YWx1ZUtleSIsImZpZWxkS2V5IiwiZm9ybUZpZWxkS2V5IiwicmVsYXRlZE9iamVjdEZpZWxkIiwidGFibGVGaWVsZFZhbHVlIiwiX3RhYmxlIiwiX2NvZGUiLCJmaWVsZF9tYXBfc2NyaXB0IiwiZXh0ZW5kIiwiZXZhbEZpZWxkTWFwU2NyaXB0Iiwib2JqZWN0SWQiLCJmdW5jIiwic2NyaXB0IiwiaW5zSWQiLCJhcHByb3ZlSWQiLCJjZiIsInZlcnNpb25zIiwidmVyc2lvbklkIiwiaWR4IiwibmV3RmlsZSIsIkZTIiwiRmlsZSIsImF0dGFjaERhdGEiLCJjcmVhdGVSZWFkU3RyZWFtIiwib3JpZ2luYWwiLCJtZXRhZGF0YSIsInJlYXNvbiIsInNpemUiLCJvd25lcl9uYW1lIiwiYXBwcm92ZSIsImxvY2tlZCIsImluc3RhbmNlX3N0YXRlIiwiaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvIiwidGFibGVJdGVtcyIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXMiLCJuZXh0IiwiY3VycmVudF91c2VyX2lkIiwiY3VycmVudF91c2VyX2luZm8iLCJoYXNoRGF0YSIsImluc2VydGVkX2luc3RhbmNlcyIsImJvZHkiLCJuZXdfaW5zIiwic2VuZFJlc3VsdCIsImluc2VydHMiLCJzdGFjayIsImVycm9ycyIsImVycm9yTWVzc2FnZSIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNI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O0FBQUVDLHdCQUFjcGtCLEVBQUU4aUIsTUFBRixJQUFZOWlCLEVBQUVxa0I7QUFBOUIsU0FBRDtBQUFWO0FBRm9CLEtBQTNCLENDVUU7QUFVRDtBRDFDSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRjaGVja05wbVZlcnNpb25zXG59IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuY2hlY2tOcG1WZXJzaW9ucyh7XG5cdGJ1c2JveTogXCJeMC4yLjEzXCIsXG5cdG1rZGlycDogXCJeMC4zLjVcIixcblx0XCJ4bWwyanNcIjogXCJeMC40LjE5XCIsXG59LCAnc3RlZWRvczpjcmVhdG9yJyk7XG5cbmlmIChNZXRlb3Iuc2V0dGluZ3MgJiYgTWV0ZW9yLnNldHRpbmdzLmNmcyAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bikge1xuXHRjaGVja05wbVZlcnNpb25zKHtcblx0XHRcImFsaXl1bi1zZGtcIjogXCJeMS4xMS4xMlwiXG5cdH0sICdzdGVlZG9zOmNyZWF0b3InKTtcbn0iLCJcblx0IyBDcmVhdG9yLmluaXRBcHBzKClcblxuXG4jIENyZWF0b3IuaW5pdEFwcHMgPSAoKS0+XG4jIFx0aWYgTWV0ZW9yLmlzU2VydmVyXG4jIFx0XHRfLmVhY2ggQ3JlYXRvci5BcHBzLCAoYXBwLCBhcHBfaWQpLT5cbiMgXHRcdFx0ZGJfYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcbiMgXHRcdFx0aWYgIWRiX2FwcFxuIyBcdFx0XHRcdGFwcC5faWQgPSBhcHBfaWRcbiMgXHRcdFx0XHRkYi5hcHBzLmluc2VydChhcHApXG4jIGVsc2VcbiMgXHRhcHAuX2lkID0gYXBwX2lkXG4jIFx0ZGIuYXBwcy51cGRhdGUoe19pZDogYXBwX2lkfSwgYXBwKVxuXG5DcmVhdG9yLmdldFNjaGVtYSA9IChvYmplY3RfbmFtZSktPlxuXHRyZXR1cm4gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5zY2hlbWFcblxuQ3JlYXRvci5nZXRPYmplY3RIb21lQ29tcG9uZW50ID0gKG9iamVjdF9uYW1lKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHJldHVybiBCdWlsZGVyQ3JlYXRvci5wbHVnaW5Db21wb25lbnRTZWxlY3RvcihCdWlsZGVyQ3JlYXRvci5zdG9yZS5nZXRTdGF0ZSgpLCBcIk9iamVjdEhvbWVcIiwgb2JqZWN0X25hbWUpXG5cbkNyZWF0b3IuZ2V0T2JqZWN0VXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cblx0aWYgIWFwcF9pZFxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXG5cdGxpc3Rfdmlld19pZCA9IGxpc3Rfdmlldz8uX2lkXG5cblx0aWYgcmVjb3JkX2lkXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQpXG5cdGVsc2Vcblx0XHRpZiBvYmplY3RfbmFtZSBpcyBcIm1lZXRpbmdcIlxuXHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiKVxuXHRcdGVsc2Vcblx0XHRcdGlmIENyZWF0b3IuZ2V0T2JqZWN0SG9tZUNvbXBvbmVudChvYmplY3RfbmFtZSlcblx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgbGlzdF92aWV3X2lkXG5cdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lKVxuXG5DcmVhdG9yLmdldE9iamVjdEFic29sdXRlVXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cblx0aWYgIWFwcF9pZFxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXG5cdGxpc3Rfdmlld19pZCA9IGxpc3Rfdmlldz8uX2lkXG5cblx0aWYgcmVjb3JkX2lkXG5cdFx0cmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQsIHRydWUpXG5cdGVsc2Vcblx0XHRpZiBvYmplY3RfbmFtZSBpcyBcIm1lZXRpbmdcIlxuXHRcdFx0cmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiLCB0cnVlKVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkLCB0cnVlKVxuXG5DcmVhdG9yLmdldE9iamVjdFJvdXRlclVybCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIC0+XG5cdGlmICFhcHBfaWRcblx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKVxuXHRsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXc/Ll9pZFxuXG5cdGlmIHJlY29yZF9pZFxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZFxuXHRlbHNlXG5cdFx0aWYgb2JqZWN0X25hbWUgaXMgXCJtZWV0aW5nXCJcblx0XHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCJcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWRcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1VybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIC0+XG5cdHVybCA9IENyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpXG5cdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKHVybClcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cblx0aWYgbGlzdF92aWV3X2lkIGlzIFwiY2FsZW5kYXJcIlxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCJcblx0ZWxzZVxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZFxuXG5DcmVhdG9yLmdldFN3aXRjaExpc3RVcmwgPSAob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSAtPlxuXHRpZiBsaXN0X3ZpZXdfaWRcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi9saXN0XCIpXG5cdGVsc2Vcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvbGlzdC9zd2l0Y2hcIilcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0VXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIHJlY29yZF9pZCwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lKSAtPlxuXHRpZiByZWxhdGVkX2ZpZWxkX25hbWVcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyByZWNvcmRfaWQgKyBcIi9cIiArIHJlbGF0ZWRfb2JqZWN0X25hbWUgKyBcIi9ncmlkP3JlbGF0ZWRfZmllbGRfbmFtZT1cIiArIHJlbGF0ZWRfZmllbGRfbmFtZSlcblx0ZWxzZVxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIHJlY29yZF9pZCArIFwiL1wiICsgcmVsYXRlZF9vYmplY3RfbmFtZSArIFwiL2dyaWRcIilcblxuQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMgPSAob2JqZWN0X25hbWUsIGlzX2RlZXAsIGlzX3NraXBfaGlkZSwgaXNfcmVsYXRlZCktPlxuXHRfb3B0aW9ucyA9IFtdXG5cdHVubGVzcyBvYmplY3RfbmFtZVxuXHRcdHJldHVybiBfb3B0aW9uc1xuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xuXHRpY29uID0gX29iamVjdD8uaWNvblxuXHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxuXHRcdGlmIGlzX3NraXBfaGlkZSBhbmQgZi5oaWRkZW5cblx0XHRcdHJldHVyblxuXHRcdGlmIGYudHlwZSA9PSBcInNlbGVjdFwiXG5cdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogXCIje2YubGFiZWwgfHwga31cIiwgdmFsdWU6IFwiI3trfVwiLCBpY29uOiBpY29ufVxuXHRcdGVsc2Vcblx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBmLmxhYmVsIHx8IGssIHZhbHVlOiBrLCBpY29uOiBpY29ufVxuXHRpZiBpc19kZWVwXG5cdFx0Xy5mb3JFYWNoIGZpZWxkcywgKGYsIGspLT5cblx0XHRcdGlmIGlzX3NraXBfaGlkZSBhbmQgZi5oaWRkZW5cblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRpZiAoZi50eXBlID09IFwibG9va3VwXCIgfHwgZi50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKSAmJiBmLnJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKGYucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHQjIOS4jeaUr+aMgWYucmVmZXJlbmNlX3Rv5Li6ZnVuY3Rpb27nmoTmg4XlhrXvvIzmnInpnIDmsYLlho3or7Rcblx0XHRcdFx0cl9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChmLnJlZmVyZW5jZV90bylcblx0XHRcdFx0aWYgcl9vYmplY3Rcblx0XHRcdFx0XHRfLmZvckVhY2ggcl9vYmplY3QuZmllbGRzLCAoZjIsIGsyKS0+XG5cdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogXCIje2YubGFiZWwgfHwga309PiN7ZjIubGFiZWwgfHwgazJ9XCIsIHZhbHVlOiBcIiN7a30uI3trMn1cIiwgaWNvbjogcl9vYmplY3Q/Lmljb259XG5cdGlmIGlzX3JlbGF0ZWRcblx0XHRyZWxhdGVkT2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpXG5cdFx0Xy5lYWNoIHJlbGF0ZWRPYmplY3RzLCAoX3JlbGF0ZWRPYmplY3QpPT5cblx0XHRcdHJlbGF0ZWRPcHRpb25zID0gQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMoX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UpXG5cdFx0XHRyZWxhdGVkT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUpXG5cdFx0XHRfLmVhY2ggcmVsYXRlZE9wdGlvbnMsIChyZWxhdGVkT3B0aW9uKS0+XG5cdFx0XHRcdGlmIF9yZWxhdGVkT2JqZWN0LmZvcmVpZ25fa2V5ICE9IHJlbGF0ZWRPcHRpb24udmFsdWVcblx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogXCIje3JlbGF0ZWRPYmplY3QubGFiZWwgfHwgcmVsYXRlZE9iamVjdC5uYW1lfT0+I3tyZWxhdGVkT3B0aW9uLmxhYmVsfVwiLCB2YWx1ZTogXCIje3JlbGF0ZWRPYmplY3QubmFtZX0uI3tyZWxhdGVkT3B0aW9uLnZhbHVlfVwiLCBpY29uOiByZWxhdGVkT2JqZWN0Py5pY29ufVxuXHRyZXR1cm4gX29wdGlvbnNcblxuIyDnu5/kuIDkuLrlr7nosaFvYmplY3RfbmFtZeaPkOS+m+WPr+eUqOS6jui/h+iZkeWZqOi/h+iZkeWtl+autVxuQ3JlYXRvci5nZXRPYmplY3RGaWx0ZXJGaWVsZE9wdGlvbnMgPSAob2JqZWN0X25hbWUpLT5cblx0X29wdGlvbnMgPSBbXVxuXHR1bmxlc3Mgb2JqZWN0X25hbWVcblx0XHRyZXR1cm4gX29wdGlvbnNcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRmaWVsZHMgPSBfb2JqZWN0Py5maWVsZHNcblx0cGVybWlzc2lvbl9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhvYmplY3RfbmFtZSlcblx0aWNvbiA9IF9vYmplY3Q/Lmljb25cblx0Xy5mb3JFYWNoIGZpZWxkcywgKGYsIGspLT5cblx0XHQjIGhpZGRlbixncmlk562J57G75Z6L55qE5a2X5q6177yM5LiN6ZyA6KaB6L+H5rukXG5cdFx0aWYgIV8uaW5jbHVkZShbXCJncmlkXCIsXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwiYXZhdGFyXCIsIFwiaW1hZ2VcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSkgYW5kICFmLmhpZGRlblxuXHRcdFx0IyBmaWx0ZXJzLiQuZmllbGTlj4pmbG93LmN1cnJlbnTnrYnlrZDlrZfmrrXkuZ/kuI3pnIDopoHov4fmu6Rcblx0XHRcdGlmICEvXFx3K1xcLi8udGVzdChrKSBhbmQgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xXG5cdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBmLmxhYmVsIHx8IGssIHZhbHVlOiBrLCBpY29uOiBpY29ufVxuXG5cdHJldHVybiBfb3B0aW9uc1xuXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkT3B0aW9ucyA9IChvYmplY3RfbmFtZSktPlxuXHRfb3B0aW9ucyA9IFtdXG5cdHVubGVzcyBvYmplY3RfbmFtZVxuXHRcdHJldHVybiBfb3B0aW9uc1xuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xuXHRwZXJtaXNzaW9uX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKG9iamVjdF9uYW1lKVxuXHRpY29uID0gX29iamVjdD8uaWNvblxuXHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxuXHRcdGlmICFfLmluY2x1ZGUoW1wiZ3JpZFwiLFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKVxuXHRcdFx0aWYgIS9cXHcrXFwuLy50ZXN0KGspIGFuZCBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTFcblx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XG5cdHJldHVybiBfb3B0aW9uc1xuXG4jIyNcbmZpbHRlcnM6IOimgei9rOaNoueahGZpbHRlcnNcbmZpZWxkczog5a+56LGh5a2X5q61XG5maWx0ZXJfZmllbGRzOiDpu5jorqTov4fmu6TlrZfmrrXvvIzmlK/mjIHlrZfnrKbkuLLmlbDnu4Tlkozlr7nosaHmlbDnu4TkuKTnp43moLzlvI/vvIzlpoI6WydmaWxlZF9uYW1lMScsJ2ZpbGVkX25hbWUyJ10sW3tmaWVsZDonZmlsZWRfbmFtZTEnLHJlcXVpcmVkOnRydWV9XVxu5aSE55CG6YC76L6ROiDmiopmaWx0ZXJz5Lit5a2Y5Zyo5LqOZmlsdGVyX2ZpZWxkc+eahOi/h+a7pOadoeS7tuWinuWKoOavj+mhueeahGlzX2RlZmF1bHTjgIFpc19yZXF1aXJlZOWxnuaAp++8jOS4jeWtmOWcqOS6jmZpbHRlcl9maWVsZHPnmoTov4fmu6TmnaHku7blr7nlupTnmoTnp7vpmaTmr4/pobnnmoTnm7jlhbPlsZ7mgKdcbui/lOWbnue7k+aenDog5aSE55CG5ZCO55qEZmlsdGVyc1xuIyMjXG5DcmVhdG9yLmdldEZpbHRlcnNXaXRoRmlsdGVyRmllbGRzID0gKGZpbHRlcnMsIGZpZWxkcywgZmlsdGVyX2ZpZWxkcyktPlxuXHR1bmxlc3MgZmlsdGVyc1xuXHRcdGZpbHRlcnMgPSBbXVxuXHR1bmxlc3MgZmlsdGVyX2ZpZWxkc1xuXHRcdGZpbHRlcl9maWVsZHMgPSBbXVxuXHRpZiBmaWx0ZXJfZmllbGRzPy5sZW5ndGhcblx0XHRmaWx0ZXJfZmllbGRzLmZvckVhY2ggKG4pLT5cblx0XHRcdGlmIF8uaXNTdHJpbmcobilcblx0XHRcdFx0biA9IFxuXHRcdFx0XHRcdGZpZWxkOiBuLFxuXHRcdFx0XHRcdHJlcXVpcmVkOiBmYWxzZVxuXHRcdFx0aWYgZmllbGRzW24uZmllbGRdIGFuZCAhXy5maW5kV2hlcmUoZmlsdGVycyx7ZmllbGQ6bi5maWVsZH0pXG5cdFx0XHRcdGZpbHRlcnMucHVzaFxuXHRcdFx0XHRcdGZpZWxkOiBuLmZpZWxkLFxuXHRcdFx0XHRcdGlzX2RlZmF1bHQ6IHRydWUsXG5cdFx0XHRcdFx0aXNfcmVxdWlyZWQ6IG4ucmVxdWlyZWRcblx0ZmlsdGVycy5mb3JFYWNoIChmaWx0ZXJJdGVtKS0+XG5cdFx0bWF0Y2hGaWVsZCA9IGZpbHRlcl9maWVsZHMuZmluZCAobiktPiByZXR1cm4gbiA9PSBmaWx0ZXJJdGVtLmZpZWxkIG9yIG4uZmllbGQgPT0gZmlsdGVySXRlbS5maWVsZFxuXHRcdGlmIF8uaXNTdHJpbmcobWF0Y2hGaWVsZClcblx0XHRcdG1hdGNoRmllbGQgPSBcblx0XHRcdFx0ZmllbGQ6IG1hdGNoRmllbGQsXG5cdFx0XHRcdHJlcXVpcmVkOiBmYWxzZVxuXHRcdGlmIG1hdGNoRmllbGRcblx0XHRcdGZpbHRlckl0ZW0uaXNfZGVmYXVsdCA9IHRydWVcblx0XHRcdGZpbHRlckl0ZW0uaXNfcmVxdWlyZWQgPSBtYXRjaEZpZWxkLnJlcXVpcmVkXG5cdFx0ZWxzZVxuXHRcdFx0ZGVsZXRlIGZpbHRlckl0ZW0uaXNfZGVmYXVsdFxuXHRcdFx0ZGVsZXRlIGZpbHRlckl0ZW0uaXNfcmVxdWlyZWRcblx0cmV0dXJuIGZpbHRlcnNcblxuQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKS0+XG5cblx0aWYgIW9iamVjdF9uYW1lXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0aWYgIXJlY29yZF9pZFxuXHRcdHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmIG9iamVjdF9uYW1lID09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikgJiYgIHJlY29yZF9pZCA9PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKVxuXHRcdFx0aWYgVGVtcGxhdGUuaW5zdGFuY2UoKT8ucmVjb3JkXG5cdFx0XHRcdHJldHVybiBUZW1wbGF0ZS5pbnN0YW5jZSgpPy5yZWNvcmQ/LmdldCgpXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZClcblxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRpZiBvYmouZGF0YWJhc2VfbmFtZSA9PSBcIm1ldGVvclwiIHx8ICFvYmouZGF0YWJhc2VfbmFtZVxuXHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpXG5cdFx0aWYgY29sbGVjdGlvblxuXHRcdFx0cmVjb3JkID0gY29sbGVjdGlvbi5maW5kT25lKHJlY29yZF9pZClcblx0XHRcdHJldHVybiByZWNvcmRcblx0ZWxzZSBpZiBvYmplY3RfbmFtZSAmJiByZWNvcmRfaWRcblx0XHRyZXR1cm4gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKVxuXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZE5hbWUgPSAocmVjb3JkLCBvYmplY3RfbmFtZSktPlxuXHR1bmxlc3MgcmVjb3JkXG5cdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQoKVxuXHRpZiByZWNvcmRcblx0XHQjIOaYvuekuue7hOe7h+WIl+ihqOaXtu+8jOeJueauiuWkhOeQhm5hbWVfZmllbGRfa2V55Li6bmFtZeWtl+autVxuXHRcdG5hbWVfZmllbGRfa2V5ID0gaWYgb2JqZWN0X25hbWUgPT0gXCJvcmdhbml6YXRpb25zXCIgdGhlbiBcIm5hbWVcIiBlbHNlIENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKT8uTkFNRV9GSUVMRF9LRVlcblx0XHRpZiByZWNvcmQgYW5kIG5hbWVfZmllbGRfa2V5XG5cdFx0XHRyZXR1cm4gcmVjb3JkLmxhYmVsIHx8IHJlY29yZFtuYW1lX2ZpZWxkX2tleV1cblxuQ3JlYXRvci5nZXRBcHAgPSAoYXBwX2lkKS0+XG5cdGlmICFhcHBfaWRcblx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxuXHRhcHAgPSBDcmVhdG9yLkFwcHNbYXBwX2lkXVxuXHRDcmVhdG9yLmRlcHM/LmFwcD8uZGVwZW5kKClcblx0cmV0dXJuIGFwcFxuXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZCA9IChhcHBfaWQpLT5cblx0YXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKVxuXHRpZiAhYXBwXG5cdFx0cmV0dXJuXG5cdGRhc2hib2FyZCA9IG51bGxcblx0Xy5lYWNoIENyZWF0b3IuRGFzaGJvYXJkcywgKHYsIGspLT5cblx0XHRpZiB2LmFwcHM/LmluZGV4T2YoYXBwLl9pZCkgPiAtMVxuXHRcdFx0ZGFzaGJvYXJkID0gdjtcblx0cmV0dXJuIGRhc2hib2FyZDtcblxuQ3JlYXRvci5nZXRBcHBEYXNoYm9hcmRDb21wb25lbnQgPSAoYXBwX2lkKS0+XG5cdGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZClcblx0aWYgIWFwcFxuXHRcdHJldHVyblxuXHRyZXR1cm4gQnVpbGRlckNyZWF0b3IucGx1Z2luQ29tcG9uZW50U2VsZWN0b3IoQnVpbGRlckNyZWF0b3Iuc3RvcmUuZ2V0U3RhdGUoKSwgXCJEYXNoYm9hcmRcIiwgYXBwLl9pZCk7XG5cbkNyZWF0b3IuZ2V0QXBwT2JqZWN0TmFtZXMgPSAoYXBwX2lkKS0+XG5cdGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZClcblx0aWYgIWFwcFxuXHRcdHJldHVyblxuXHRpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRhcHBPYmplY3RzID0gaWYgaXNNb2JpbGUgdGhlbiBhcHAubW9iaWxlX29iamVjdHMgZWxzZSBhcHAub2JqZWN0c1xuXHRvYmplY3RzID0gW11cblx0aWYgYXBwXG5cdFx0Xy5lYWNoIGFwcE9iamVjdHMsICh2KS0+XG5cdFx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdCh2KVxuXHRcdFx0aWYgb2JqPy5wZXJtaXNzaW9ucy5nZXQoKS5hbGxvd1JlYWRcblx0XHRcdFx0b2JqZWN0cy5wdXNoIHZcblx0cmV0dXJuIG9iamVjdHNcblxuQ3JlYXRvci5nZXRVcmxXaXRoVG9rZW4gPSAodXJsLCBleHByZXNzaW9uRm9ybURhdGEpIC0+XG5cdCMg57uZdXJs5pe25ou85o6l5b2T5YmN55So5oi3dG9rZW7nm7jlhbPkv6Hmga/nlKjkuo7nmbvlvZXpqozor4HvvIzmlK/mjIHphY3nva7ooajovr7lvI9cblx0cGFyYW1zID0ge307XG5cdHBhcmFtc1tcIlgtU3BhY2UtSWRcIl0gPSBTdGVlZG9zLnNwYWNlSWQoKVxuXHRwYXJhbXNbXCJYLVVzZXItSWRcIl0gPSBTdGVlZG9zLnVzZXJJZCgpO1xuXHRwYXJhbXNbXCJYLUNvbXBhbnktSWRzXCJdID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpO1xuXHRwYXJhbXNbXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuXHRpZiBTdGVlZG9zLmlzRXhwcmVzc2lvbih1cmwpXG5cdFx0dXJsID0gU3RlZWRvcy5wYXJzZVNpbmdsZUV4cHJlc3Npb24odXJsLCBleHByZXNzaW9uRm9ybURhdGEsIFwiI1wiLCBDcmVhdG9yLlVTRVJfQ09OVEVYVClcblx0IyDlpJbpg6jpk77mjqXlnLDlnYDkuK3lj6/og73kvJrluKbmnIkj5Y+377yM5q+U5aaCL2J1aWxkZXIvP3BfaWRzPTYxOTM4MzU0NWIyZTlhNzJlYzA1NThiMyMvcGFnZS9wdWJsaWMvdGVzdFxuXHQjIOatpOaXtnVybOS4reW3sue7j+WcqCPlj7fliY3pnaLlh7rnjrDkuobkuIDkuKo/5Y+377yM6L+Z5Liq6Zeu5Y+35LiN5Y+v5Lul6KKr6K+G5Yir5Li6dXJs5Y+C5pWw77yM5Y+q5pyJI+WPt+WQjumdoueahD/lj7fmiY3lupTor6Xooqvor4bliKvkuLp1cmzlj4LmlbBcblx0aGFzUXVlcnlTeW1ib2wgPSAvKFxcIy4rXFw/KXwoXFw/W14jXSokKS9nLnRlc3QodXJsKVxuXHRsaW5rU3RyID0gaWYgaGFzUXVlcnlTeW1ib2wgdGhlbiBcIiZcIiBlbHNlIFwiP1wiXG5cdHJldHVybiBcIiN7dXJsfSN7bGlua1N0cn0jeyQucGFyYW0ocGFyYW1zKX1cIlxuXG5DcmVhdG9yLmdldEFwcE1lbnUgPSAoYXBwX2lkLCBtZW51X2lkKS0+XG5cdG1lbnVzID0gQ3JlYXRvci5nZXRBcHBNZW51cyhhcHBfaWQpXG5cdHJldHVybiBtZW51cyAmJiBtZW51cy5maW5kIChtZW51KS0+IHJldHVybiBtZW51LmlkID09IG1lbnVfaWRcblxuQ3JlYXRvci5nZXRBcHBNZW51VXJsRm9ySW50ZXJuZXQgPSAobWVudSktPlxuXHQjIOW9k3RhYnPnsbvlnovkuLp1cmzml7bvvIzmjInlpJbpg6jpk77mjqXlpITnkIbvvIzmlK/mjIHphY3nva7ooajovr7lvI/lubbliqDkuIrnu5/kuIDnmoR1cmzlj4LmlbBcblx0cmV0dXJuIENyZWF0b3IuZ2V0VXJsV2l0aFRva2VuIG1lbnUucGF0aCwgbWVudVxuXG5DcmVhdG9yLmdldEFwcE1lbnVVcmwgPSAobWVudSktPlxuXHR1cmwgPSBtZW51LnBhdGhcblx0aWYgbWVudS50eXBlID09IFwidXJsXCJcblx0XHRpZiBtZW51LnRhcmdldFxuXHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0QXBwTWVudVVybEZvckludGVybmV0KG1lbnUpXG5cdFx0ZWxzZVxuXHRcdFx0IyDlnKhpZnJhbWXkuK3mmL7npLp1cmznlYzpnaJcblx0XHRcdHJldHVybiBcIi9hcHAvLS90YWJfaWZyYW1lLyN7bWVudS5pZH1cIlxuXHRlbHNlXG5cdFx0cmV0dXJuIG1lbnUucGF0aFxuXG5DcmVhdG9yLmdldEFwcE1lbnVzID0gKGFwcF9pZCktPlxuXHRhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpXG5cdGlmICFhcHBcblx0XHRyZXR1cm4gW11cblx0YXBwTWVudXMgPSBTZXNzaW9uLmdldChcImFwcF9tZW51c1wiKTtcblx0dW5sZXNzIGFwcE1lbnVzXG5cdFx0cmV0dXJuIFtdXG5cdGN1cmVudEFwcE1lbnVzID0gYXBwTWVudXMuZmluZCAobWVudUl0ZW0pIC0+XG5cdFx0cmV0dXJuIG1lbnVJdGVtLmlkID09IGFwcC5faWRcblx0aWYgY3VyZW50QXBwTWVudXNcblx0XHRyZXR1cm4gY3VyZW50QXBwTWVudXMuY2hpbGRyZW5cblxuQ3JlYXRvci5sb2FkQXBwc01lbnVzID0gKCktPlxuXHRpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRkYXRhID0geyB9XG5cdGlmIGlzTW9iaWxlXG5cdFx0ZGF0YS5tb2JpbGUgPSBpc01vYmlsZVxuXHRvcHRpb25zID0geyBcblx0XHR0eXBlOiAnZ2V0JywgXG5cdFx0ZGF0YTogZGF0YSwgXG5cdFx0c3VjY2VzczogKGRhdGEpLT5cblx0XHRcdFNlc3Npb24uc2V0KFwiYXBwX21lbnVzXCIsIGRhdGEpO1xuXHQgfVxuXHRTdGVlZG9zLmF1dGhSZXF1ZXN0IFwiL3NlcnZpY2UvYXBpL2FwcHMvbWVudXNcIiwgb3B0aW9uc1xuXG5DcmVhdG9yLmdldFZpc2libGVBcHBzID0gKGluY2x1ZGVBZG1pbiktPlxuXHRjaGFuZ2VBcHAgPSBDcmVhdG9yLl9zdWJBcHAuZ2V0KCk7XG5cdEJ1aWxkZXJDcmVhdG9yLnN0b3JlLmdldFN0YXRlKCkuZW50aXRpZXMuYXBwcyA9IE9iamVjdC5hc3NpZ24oe30sIEJ1aWxkZXJDcmVhdG9yLnN0b3JlLmdldFN0YXRlKCkuZW50aXRpZXMuYXBwcywge2FwcHM6IGNoYW5nZUFwcH0pO1xuXHRyZXR1cm4gQnVpbGRlckNyZWF0b3IudmlzaWJsZUFwcHNTZWxlY3RvcihCdWlsZGVyQ3JlYXRvci5zdG9yZS5nZXRTdGF0ZSgpLCBpbmNsdWRlQWRtaW4pXG5cbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHNPYmplY3RzID0gKCktPlxuXHRhcHBzID0gQ3JlYXRvci5nZXRWaXNpYmxlQXBwcygpXG5cdHZpc2libGVPYmplY3ROYW1lcyA9IF8uZmxhdHRlbihfLnBsdWNrKGFwcHMsJ29iamVjdHMnKSlcblx0b2JqZWN0cyA9IF8uZmlsdGVyIENyZWF0b3IuT2JqZWN0cywgKG9iaiktPlxuXHRcdGlmIHZpc2libGVPYmplY3ROYW1lcy5pbmRleE9mKG9iai5uYW1lKSA8IDBcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB0cnVlXG5cdG9iamVjdHMgPSBvYmplY3RzLnNvcnQoQ3JlYXRvci5zb3J0aW5nTWV0aG9kLmJpbmQoe2tleTpcImxhYmVsXCJ9KSlcblx0b2JqZWN0cyA9IF8ucGx1Y2sob2JqZWN0cywnbmFtZScpXG5cdHJldHVybiBfLnVuaXEgb2JqZWN0c1xuXG5DcmVhdG9yLmdldEFwcHNPYmplY3RzID0gKCktPlxuXHRvYmplY3RzID0gW11cblx0dGVtcE9iamVjdHMgPSBbXVxuXHRfLmZvckVhY2ggQ3JlYXRvci5BcHBzLCAoYXBwKS0+XG5cdFx0dGVtcE9iamVjdHMgPSBfLmZpbHRlciBhcHAub2JqZWN0cywgKG9iaiktPlxuXHRcdFx0cmV0dXJuICFvYmouaGlkZGVuXG5cdFx0b2JqZWN0cyA9IG9iamVjdHMuY29uY2F0KHRlbXBPYmplY3RzKVxuXHRyZXR1cm4gXy51bmlxIG9iamVjdHNcblxuQ3JlYXRvci52YWxpZGF0ZUZpbHRlcnMgPSAoZmlsdGVycywgbG9naWMpLT5cblx0ZmlsdGVyX2l0ZW1zID0gXy5tYXAgZmlsdGVycywgKG9iaikgLT5cblx0XHRpZiBfLmlzRW1wdHkob2JqKVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG9ialxuXHRmaWx0ZXJfaXRlbXMgPSBfLmNvbXBhY3QoZmlsdGVyX2l0ZW1zKVxuXHRlcnJvck1zZyA9IFwiXCJcblx0ZmlsdGVyX2xlbmd0aCA9IGZpbHRlcl9pdGVtcy5sZW5ndGhcblx0aWYgbG9naWNcblx0XHQjIOagvOW8j+WMlmZpbHRlclxuXHRcdGxvZ2ljID0gbG9naWMucmVwbGFjZSgvXFxuL2csIFwiXCIpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpXG5cblx0XHQjIOWIpOaWreeJueauiuWtl+esplxuXHRcdGlmIC9bLl9cXC0hK10rL2lnLnRlc3QobG9naWMpXG5cdFx0XHRlcnJvck1zZyA9IFwi5ZCr5pyJ54m55q6K5a2X56ym44CCXCJcblxuXHRcdGlmICFlcnJvck1zZ1xuXHRcdFx0aW5kZXggPSBsb2dpYy5tYXRjaCgvXFxkKy9pZylcblx0XHRcdGlmICFpbmRleFxuXHRcdFx0XHRlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5kZXguZm9yRWFjaCAoaSktPlxuXHRcdFx0XHRcdGlmIGkgPCAxIG9yIGkgPiBmaWx0ZXJfbGVuZ3RoXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5p2h5Lu25byV55So5LqG5pyq5a6a5LmJ55qE562b6YCJ5Zmo77yaI3tpfeOAglwiXG5cblx0XHRcdFx0ZmxhZyA9IDFcblx0XHRcdFx0d2hpbGUgZmxhZyA8PSBmaWx0ZXJfbGVuZ3RoXG5cdFx0XHRcdFx0aWYgIWluZGV4LmluY2x1ZGVzKFwiI3tmbGFnfVwiKVxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBcIuacieS6m+etm+mAieadoeS7tui/m+ihjOS6huWumuS5ie+8jOS9huacquWcqOmrmOe6p+etm+mAieadoeS7tuS4reiiq+W8leeUqOOAglwiXG5cdFx0XHRcdFx0ZmxhZysrO1xuXG5cdFx0aWYgIWVycm9yTXNnXG5cdFx0XHQjIOWIpOaWreaYr+WQpuaciemdnuazleiLseaWh+Wtl+esplxuXHRcdFx0d29yZCA9IGxvZ2ljLm1hdGNoKC9bYS16QS1aXSsvaWcpXG5cdFx0XHRpZiB3b3JkXG5cdFx0XHRcdHdvcmQuZm9yRWFjaCAodyktPlxuXHRcdFx0XHRcdGlmICEvXihhbmR8b3IpJC9pZy50ZXN0KHcpXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IFwi5qOA5p+l5oKo55qE6auY57qn562b6YCJ5p2h5Lu25Lit55qE5ou85YaZ44CCXCJcblxuXHRcdGlmICFlcnJvck1zZ1xuXHRcdFx0IyDliKTmlq3moLzlvI/mmK/lkKbmraPnoa5cblx0XHRcdHRyeVxuXHRcdFx0XHRDcmVhdG9yLmV2YWwobG9naWMucmVwbGFjZSgvYW5kL2lnLCBcIiYmXCIpLnJlcGxhY2UoL29yL2lnLCBcInx8XCIpKVxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5Lit5ZCr5pyJ54m55q6K5a2X56ymXCJcblxuXHRcdFx0aWYgLyhBTkQpW14oKV0rKE9SKS9pZy50ZXN0KGxvZ2ljKSB8fCAgLyhPUilbXigpXSsoQU5EKS9pZy50ZXN0KGxvZ2ljKVxuXHRcdFx0XHRlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5b+F6aG75Zyo6L+e57ut5oCn55qEIEFORCDlkowgT1Ig6KGo6L6+5byP5YmN5ZCO5L2/55So5ous5Y+344CCXCJcblx0aWYgZXJyb3JNc2dcblx0XHRjb25zb2xlLmxvZyBcImVycm9yXCIsIGVycm9yTXNnXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHR0b2FzdHIuZXJyb3IoZXJyb3JNc2cpXG5cdFx0cmV0dXJuIGZhbHNlXG5cdGVsc2Vcblx0XHRyZXR1cm4gdHJ1ZVxuXG4jIFwiPVwiLCBcIjw+XCIsIFwiPlwiLCBcIj49XCIsIFwiPFwiLCBcIjw9XCIsIFwic3RhcnRzd2l0aFwiLCBcImNvbnRhaW5zXCIsIFwibm90Y29udGFpbnNcIi5cbiMjI1xub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcbmV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcbiMjI1xuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9Nb25nbyA9IChmaWx0ZXJzLCBvcHRpb25zKS0+XG5cdHVubGVzcyBmaWx0ZXJzPy5sZW5ndGhcblx0XHRyZXR1cm5cblx0IyDlvZNmaWx0ZXJz5LiN5pivW0FycmF5Xeexu+Wei+iAjOaYr1tPYmplY3Rd57G75Z6L5pe277yM6L+b6KGM5qC85byP6L2s5o2iXG5cdHVubGVzcyBmaWx0ZXJzWzBdIGluc3RhbmNlb2YgQXJyYXlcblx0XHRmaWx0ZXJzID0gXy5tYXAgZmlsdGVycywgKG9iaiktPlxuXHRcdFx0cmV0dXJuIFtvYmouZmllbGQsIG9iai5vcGVyYXRpb24sIG9iai52YWx1ZV1cblx0c2VsZWN0b3IgPSBbXVxuXHRfLmVhY2ggZmlsdGVycywgKGZpbHRlciktPlxuXHRcdGZpZWxkID0gZmlsdGVyWzBdXG5cdFx0b3B0aW9uID0gZmlsdGVyWzFdXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSlcblx0XHRlbHNlXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgbnVsbCwgb3B0aW9ucylcblx0XHRzdWJfc2VsZWN0b3IgPSB7fVxuXHRcdHN1Yl9zZWxlY3RvcltmaWVsZF0gPSB7fVxuXHRcdGlmIG9wdGlvbiA9PSBcIj1cIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRlcVwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8PlwiXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJG5lXCJdID0gdmFsdWVcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIj5cIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndFwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI+PVwiXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGd0ZVwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8XCJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPD1cIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdGVcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwic3RhcnRzd2l0aFwiXG5cdFx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXlwiICsgdmFsdWUsIFwiaVwiKVxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZ1xuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiY29udGFpbnNcIlxuXHRcdFx0cmVnID0gbmV3IFJlZ0V4cCh2YWx1ZSwgXCJpXCIpXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCJub3Rjb250YWluc1wiXG5cdFx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXigoPyFcIiArIHZhbHVlICsgXCIpLikqJFwiLCBcImlcIilcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWdcblx0XHRzZWxlY3Rvci5wdXNoIHN1Yl9zZWxlY3RvclxuXHRyZXR1cm4gc2VsZWN0b3JcblxuQ3JlYXRvci5pc0JldHdlZW5GaWx0ZXJPcGVyYXRpb24gPSAob3BlcmF0aW9uKS0+XG5cdHJldHVybiBvcGVyYXRpb24gPT0gXCJiZXR3ZWVuXCIgb3IgISFDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyh0cnVlKT9bb3BlcmF0aW9uXVxuXG4jIyNcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5cdGV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcbiMjI1xuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9EZXYgPSAoZmlsdGVycywgb2JqZWN0X25hbWUsIG9wdGlvbnMpLT5cblx0c3RlZWRvc0ZpbHRlcnMgPSByZXF1aXJlKFwiQHN0ZWVkb3MvZmlsdGVyc1wiKTtcblx0dW5sZXNzIGZpbHRlcnMubGVuZ3RoXG5cdFx0cmV0dXJuXG5cdGlmIG9wdGlvbnM/LmlzX2xvZ2ljX29yXG5cdFx0IyDlpoLmnpxpc19sb2dpY19vcuS4unRydWXvvIzkuLpmaWx0ZXJz56ys5LiA5bGC5YWD57Sg5aKe5Yqgb3Lpl7TpmpRcblx0XHRsb2dpY1RlbXBGaWx0ZXJzID0gW11cblx0XHRmaWx0ZXJzLmZvckVhY2ggKG4pLT5cblx0XHRcdGxvZ2ljVGVtcEZpbHRlcnMucHVzaChuKVxuXHRcdFx0bG9naWNUZW1wRmlsdGVycy5wdXNoKFwib3JcIilcblx0XHRsb2dpY1RlbXBGaWx0ZXJzLnBvcCgpXG5cdFx0ZmlsdGVycyA9IGxvZ2ljVGVtcEZpbHRlcnNcblx0c2VsZWN0b3IgPSBzdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9EZXYoZmlsdGVycywgQ3JlYXRvci5VU0VSX0NPTlRFWFQpXG5cdHJldHVybiBzZWxlY3RvclxuXG4jIyNcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4jIyNcbkNyZWF0b3IuZm9ybWF0TG9naWNGaWx0ZXJzVG9EZXYgPSAoZmlsdGVycywgZmlsdGVyX2xvZ2ljLCBvcHRpb25zKS0+XG5cdGZvcm1hdF9sb2dpYyA9IGZpbHRlcl9sb2dpYy5yZXBsYWNlKC9cXChcXHMrL2lnLCBcIihcIikucmVwbGFjZSgvXFxzK1xcKS9pZywgXCIpXCIpLnJlcGxhY2UoL1xcKC9nLCBcIltcIikucmVwbGFjZSgvXFwpL2csIFwiXVwiKS5yZXBsYWNlKC9cXHMrL2csIFwiLFwiKS5yZXBsYWNlKC8oYW5kfG9yKS9pZywgXCInJDEnXCIpXG5cdGZvcm1hdF9sb2dpYyA9IGZvcm1hdF9sb2dpYy5yZXBsYWNlKC8oXFxkKSsvaWcsICh4KS0+XG5cdFx0X2YgPSBmaWx0ZXJzW3gtMV1cblx0XHRmaWVsZCA9IF9mLmZpZWxkXG5cdFx0b3B0aW9uID0gX2Yub3BlcmF0aW9uXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlKVxuXHRcdGVsc2Vcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUsIG51bGwsIG9wdGlvbnMpXG5cdFx0c3ViX3NlbGVjdG9yID0gW11cblx0XHRpZiBfLmlzQXJyYXkodmFsdWUpID09IHRydWVcblx0XHRcdGlmIG9wdGlvbiA9PSBcIj1cIlxuXHRcdFx0XHRfLmVhY2ggdmFsdWUsICh2KS0+XG5cdFx0XHRcdFx0c3ViX3NlbGVjdG9yLnB1c2ggW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCJcblx0XHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPD5cIlxuXHRcdFx0XHRfLmVhY2ggdmFsdWUsICh2KS0+XG5cdFx0XHRcdFx0c3ViX3NlbGVjdG9yLnB1c2ggW2ZpZWxkLCBvcHRpb24sIHZdLCBcImFuZFwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdF8uZWFjaCB2YWx1ZSwgKHYpLT5cblx0XHRcdFx0XHRzdWJfc2VsZWN0b3IucHVzaCBbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIlxuXHRcdFx0aWYgc3ViX3NlbGVjdG9yW3N1Yl9zZWxlY3Rvci5sZW5ndGggLSAxXSA9PSBcImFuZFwiIHx8IHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT0gXCJvclwiXG5cdFx0XHRcdHN1Yl9zZWxlY3Rvci5wb3AoKVxuXHRcdGVsc2Vcblx0XHRcdHN1Yl9zZWxlY3RvciA9IFtmaWVsZCwgb3B0aW9uLCB2YWx1ZV1cblx0XHRjb25zb2xlLmxvZyBcInN1Yl9zZWxlY3RvclwiLCBzdWJfc2VsZWN0b3Jcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3ViX3NlbGVjdG9yKVxuXHQpXG5cdGZvcm1hdF9sb2dpYyA9IFwiWyN7Zm9ybWF0X2xvZ2ljfV1cIlxuXHRyZXR1cm4gQ3JlYXRvci5ldmFsKGZvcm1hdF9sb2dpYylcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRpZiAhX29iamVjdFxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lc1xuXG4jXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soX29iamVjdC5yZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxuXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoX29iamVjdC5fY29sbGVjdGlvbl9uYW1lKVxuXG5cdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxuXHRpZiByZWxhdGVkX29iamVjdF9uYW1lcz8ubGVuZ3RoID09IDBcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXNcblxuXHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0dW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0c1xuXG5cdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0c1xuXHRyZXR1cm4gXy5maWx0ZXIgcmVsYXRlZF9vYmplY3RzLCAocmVsYXRlZF9vYmplY3QpLT5cblx0XHRyZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3Qub2JqZWN0X25hbWVcblx0XHRpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMVxuXHRcdCMgcmVsYXRlZF9vYmplY3RfbmFtZSA9IGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjZnNfZmlsZXNfZmlsZXJlY29yZFwiIHRoZW4gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiIGVsc2UgcmVsYXRlZF9vYmplY3RfbmFtZVxuXHRcdGFsbG93UmVhZCA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8uYWxsb3dSZWFkXG5cdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRhbGxvd1JlYWQgPSBhbGxvd1JlYWQgJiYgcGVybWlzc2lvbnMuYWxsb3dSZWFkRmlsZXNcblx0XHRyZXR1cm4gaXNBY3RpdmUgYW5kIGFsbG93UmVhZFxuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3ROYW1lcyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0cmV0dXJuIF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0TGlzdEFjdGlvbnMgPSAocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRhY3Rpb25zID0gQ3JlYXRvci5nZXRBY3Rpb25zKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XG5cdFx0aWYgYWN0aW9uLm5hbWUgPT0gXCJzdGFuZGFyZF9mb2xsb3dcIlxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0aWYgYWN0aW9uLm5hbWUgPT0gXCJzdGFuZGFyZF9xdWVyeVwiXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRpZiBhY3Rpb24ub24gPT0gXCJsaXN0XCJcblx0XHRcdGlmIHR5cGVvZiBhY3Rpb24udmlzaWJsZSA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0cmV0dXJuIGFjdGlvbi52aXNpYmxlKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIGFjdGlvbi52aXNpYmxlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdHJldHVybiBhY3Rpb25zXG5cbkNyZWF0b3IuZ2V0QWN0aW9ucyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRpZiAhb2JqXG5cdFx0cmV0dXJuXG5cblx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdGRpc2FibGVkX2FjdGlvbnMgPSBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zXG5cdGFjdGlvbnMgPSBfLnNvcnRCeShfLnZhbHVlcyhvYmouYWN0aW9ucykgLCAnc29ydCcpO1xuXG5cdGlmIF8uaGFzKG9iaiwgJ2FsbG93X2N1c3RvbUFjdGlvbnMnKVxuXHRcdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XG5cdFx0XHRyZXR1cm4gXy5pbmNsdWRlKG9iai5hbGxvd19jdXN0b21BY3Rpb25zLCBhY3Rpb24ubmFtZSkgfHwgXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLmdldE9iamVjdCgnYmFzZScpLmFjdGlvbnMpIHx8IHt9LCBhY3Rpb24ubmFtZSlcblx0aWYgXy5oYXMob2JqLCAnZXhjbHVkZV9hY3Rpb25zJylcblx0XHRhY3Rpb25zID0gXy5maWx0ZXIgYWN0aW9ucywgKGFjdGlvbiktPlxuXHRcdFx0cmV0dXJuICFfLmluY2x1ZGUob2JqLmV4Y2x1ZGVfYWN0aW9ucywgYWN0aW9uLm5hbWUpXG5cblx0Xy5lYWNoIGFjdGlvbnMsIChhY3Rpb24pLT5cblx0XHQjIOaJi+acuuS4iuWPquaYvuekuue8lui+keaMiemSru+8jOWFtuS7lueahOaUvuWIsOaKmOWPoOS4i+aLieiPnOWNleS4rVxuXHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJyZWNvcmRcIiwgXCJyZWNvcmRfb25seVwiXS5pbmRleE9mKGFjdGlvbi5vbikgPiAtMSAmJiBhY3Rpb24ubmFtZSAhPSAnc3RhbmRhcmRfZWRpdCdcblx0XHRcdGlmIGFjdGlvbi5vbiA9PSBcInJlY29yZF9vbmx5XCJcblx0XHRcdFx0YWN0aW9uLm9uID0gJ3JlY29yZF9vbmx5X21vcmUnXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGFjdGlvbi5vbiA9ICdyZWNvcmRfbW9yZSdcblxuXHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgJiYgW1wiY21zX2ZpbGVzXCIsIFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIl0uaW5kZXhPZihvYmplY3RfbmFtZSkgPiAtMVxuXHRcdCMg6ZmE5Lu254m55q6K5aSE55CG77yM5LiL6L295oyJ6ZKu5pS+5Zyo5Li76I+c5Y2V77yM57yW6L6R5oyJ6ZKu5pS+5Yiw5bqV5LiL5oqY5Y+g5LiL5ouJ6I+c5Y2V5LitXG5cdFx0YWN0aW9ucy5maW5kKChuKS0+IHJldHVybiBuLm5hbWUgPT0gXCJzdGFuZGFyZF9lZGl0XCIpPy5vbiA9IFwicmVjb3JkX21vcmVcIlxuXHRcdGFjdGlvbnMuZmluZCgobiktPiByZXR1cm4gbi5uYW1lID09IFwiZG93bmxvYWRcIik/Lm9uID0gXCJyZWNvcmRcIlxuXG5cdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XG5cdFx0cmV0dXJuIF8uaW5kZXhPZihkaXNhYmxlZF9hY3Rpb25zLCBhY3Rpb24ubmFtZSkgPCAwXG5cblx0cmV0dXJuIGFjdGlvbnNcblxuLy8vXG5cdOi/lOWbnuW9k+WJjeeUqOaIt+acieadg+mZkOiuv+mXrueahOaJgOaciWxpc3Rfdmlld++8jOWMheaLrOWIhuS6q+eahO+8jOeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahO+8iOmZpOmdnm93bmVy5Y+Y5LqG77yJ77yM5Lul5Y+K6buY6K6k55qE5YW25LuW6KeG5Zu+XG5cdOazqOaEj0NyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mmK/kuI3kvJrmnInnlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTop4blm77nmoTvvIzmiYDku6VDcmVhdG9yLmdldFBlcm1pc3Npb25z5Ye95pWw5Lit5ou/5Yiw55qE57uT5p6c5LiN5YWo77yM5bm25LiN5piv5b2T5YmN55So5oi36IO955yL5Yiw5omA5pyJ6KeG5Zu+XG4vLy9cbkNyZWF0b3IuZ2V0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdGlmICF1c2VySWRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcblx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuXG5cblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0aWYgIW9iamVjdFxuXHRcdHJldHVyblxuXG5cdGRpc2FibGVkX2xpc3Rfdmlld3MgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy5kaXNhYmxlZF9saXN0X3ZpZXdzIHx8IFtdXG5cblx0bGlzdF92aWV3cyA9IFtdXG5cblx0aXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKClcblxuXHRfLmVhY2ggb2JqZWN0Lmxpc3Rfdmlld3MsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpdGVtLm5hbWUgPSBpdGVtX25hbWVcblxuXHRsaXN0Vmlld3MgPSBfLnNvcnRCeShfLnZhbHVlcyhvYmplY3QubGlzdF92aWV3cykgLCAnc29ydF9ubycpO1xuXG5cdF8uZWFjaCBsaXN0Vmlld3MsIChpdGVtKS0+XG5cdFx0aWYgaXNNb2JpbGUgYW5kIGl0ZW0udHlwZSA9PSBcImNhbGVuZGFyXCJcblx0XHRcdCMg5omL5py65LiK5YWI5LiN5pi+56S65pel5Y6G6KeG5Zu+XG5cdFx0XHRyZXR1cm5cblx0XHRpZiBpdGVtLm5hbWUgICE9IFwiZGVmYXVsdFwiXG5cdFx0XHRpc0Rpc2FibGVkID0gXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW0ubmFtZSkgPiAtMSB8fCAoaXRlbS5faWQgJiYgXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW0uX2lkKSA+IC0xKVxuXHRcdFx0aWYgIWlzRGlzYWJsZWQgfHwgaXRlbS5vd25lciA9PSB1c2VySWRcblx0XHRcdFx0bGlzdF92aWV3cy5wdXNoIGl0ZW1cblx0cmV0dXJuIGxpc3Rfdmlld3NcblxuIyDliY3lj7DnkIborrrkuIrkuI3lupTor6XosIPnlKjor6Xlh73mlbDvvIzlm6DkuLrlrZfmrrXnmoTmnYPpmZDpg73lnKhDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZmllbGRz55qE55u45YWz5bGe5oCn5Lit5pyJ5qCH6K+G5LqGXG5DcmVhdG9yLmdldEZpZWxkcyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRmaWVsZHNOYW1lID0gQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lKG9iamVjdF9uYW1lKVxuXHR1bnJlYWRhYmxlX2ZpZWxkcyA9ICBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy51bnJlYWRhYmxlX2ZpZWxkc1xuXHRyZXR1cm4gXy5kaWZmZXJlbmNlKGZpZWxkc05hbWUsIHVucmVhZGFibGVfZmllbGRzKVxuXG5DcmVhdG9yLmlzbG9hZGluZyA9ICgpLT5cblx0cmV0dXJuICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZC5nZXQoKVxuXG5DcmVhdG9yLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpXG5cbiMg6K6h566XZmllbGRz55u45YWz5Ye95pWwXG4jIFNUQVJUXG5DcmVhdG9yLmdldERpc2FibGVkRmllbGRzID0gKHNjaGVtYSktPlxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxuXHRcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0uZGlzYWJsZWQgYW5kICFmaWVsZC5hdXRvZm9ybS5vbWl0IGFuZCBmaWVsZE5hbWVcblx0KVxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxuXHRyZXR1cm4gZmllbGRzXG5cbkNyZWF0b3IuZ2V0SGlkZGVuRmllbGRzID0gKHNjaGVtYSktPlxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxuXHRcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0udHlwZSA9PSBcImhpZGRlblwiIGFuZCAhZmllbGQuYXV0b2Zvcm0ub21pdCBhbmQgZmllbGROYW1lXG5cdClcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcblx0cmV0dXJuIGZpZWxkc1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhOb0dyb3VwID0gKHNjaGVtYSktPlxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxuXHRcdHJldHVybiAoIWZpZWxkLmF1dG9mb3JtIG9yICFmaWVsZC5hdXRvZm9ybS5ncm91cCBvciBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PSBcIi1cIikgYW5kICghZmllbGQuYXV0b2Zvcm0gb3IgZmllbGQuYXV0b2Zvcm0udHlwZSAhPSBcImhpZGRlblwiKSBhbmQgZmllbGROYW1lXG5cdClcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcblx0cmV0dXJuIGZpZWxkc1xuXG5DcmVhdG9yLmdldFNvcnRlZEZpZWxkR3JvdXBOYW1lcyA9IChzY2hlbWEpLT5cblx0bmFtZXMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCkgLT5cbiBcdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS5ncm91cCAhPSBcIi1cIiBhbmQgZmllbGQuYXV0b2Zvcm0uZ3JvdXBcblx0KVxuXHRuYW1lcyA9IF8uY29tcGFjdChuYW1lcylcblx0bmFtZXMgPSBfLnVuaXF1ZShuYW1lcylcblx0cmV0dXJuIG5hbWVzXG5cbkNyZWF0b3IuZ2V0RmllbGRzRm9yR3JvdXAgPSAoc2NoZW1hLCBncm91cE5hbWUpIC0+XG4gIFx0ZmllbGRzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQsIGZpZWxkTmFtZSkgLT5cbiAgICBcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT0gZ3JvdXBOYW1lIGFuZCBmaWVsZC5hdXRvZm9ybS50eXBlICE9IFwiaGlkZGVuXCIgYW5kIGZpZWxkTmFtZVxuICBcdClcbiAgXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxuICBcdHJldHVybiBmaWVsZHNcblxuQ3JlYXRvci5nZXRTeXN0ZW1CYXNlRmllbGRzID0gKCkgLT5cblx0cmV0dXJuIFtcImNyZWF0ZWRcIiwgXCJjcmVhdGVkX2J5XCIsIFwibW9kaWZpZWRcIiwgXCJtb2RpZmllZF9ieVwiXVxuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRTeXN0ZW1CYXNlID0gKGtleXMpIC0+XG5cdHJldHVybiBfLmRpZmZlcmVuY2Uoa2V5cywgQ3JlYXRvci5nZXRTeXN0ZW1CYXNlRmllbGRzKCkpO1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRPbWl0ID0gKHNjaGVtYSwga2V5cykgLT5cblx0a2V5cyA9IF8ubWFwKGtleXMsIChrZXkpIC0+XG5cdFx0ZmllbGQgPSBfLnBpY2soc2NoZW1hLCBrZXkpXG5cdFx0aWYgZmllbGRba2V5XS5hdXRvZm9ybT8ub21pdFxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGtleVxuXHQpXG5cdGtleXMgPSBfLmNvbXBhY3Qoa2V5cylcblx0cmV0dXJuIGtleXNcblxuQ3JlYXRvci5nZXRGaWVsZHNJbkZpcnN0TGV2ZWwgPSAoZmlyc3RMZXZlbEtleXMsIGtleXMpIC0+XG5cdGtleXMgPSBfLm1hcChrZXlzLCAoa2V5KSAtPlxuXHRcdGlmIF8uaW5kZXhPZihmaXJzdExldmVsS2V5cywga2V5KSA+IC0xXG5cdFx0XHRyZXR1cm4ga2V5XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdClcblx0a2V5cyA9IF8uY29tcGFjdChrZXlzKVxuXHRyZXR1cm4ga2V5c1xuXG5DcmVhdG9yLmdldEZpZWxkc0ZvclJlb3JkZXIgPSAoc2NoZW1hLCBrZXlzLCBpc1NpbmdsZSkgLT5cblx0ZmllbGRzID0gW11cblx0aSA9IDBcblx0X2tleXMgPSBfLmZpbHRlcihrZXlzLCAoa2V5KS0+XG5cdFx0cmV0dXJuICFrZXkuZW5kc1dpdGgoJ19lbmRMaW5lJylcblx0KTtcblx0d2hpbGUgaSA8IF9rZXlzLmxlbmd0aFxuXHRcdHNjXzEgPSBfLnBpY2soc2NoZW1hLCBfa2V5c1tpXSlcblx0XHRzY18yID0gXy5waWNrKHNjaGVtYSwgX2tleXNbaSsxXSlcblxuXHRcdGlzX3dpZGVfMSA9IGZhbHNlXG5cdFx0aXNfd2lkZV8yID0gZmFsc2VcblxuI1x0XHRpc19yYW5nZV8xID0gZmFsc2VcbiNcdFx0aXNfcmFuZ2VfMiA9IGZhbHNlXG5cblx0XHRfLmVhY2ggc2NfMSwgKHZhbHVlKSAtPlxuXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3dpZGUgfHwgdmFsdWUuYXV0b2Zvcm0/LnR5cGUgPT0gXCJ0YWJsZVwiXG5cdFx0XHRcdGlzX3dpZGVfMSA9IHRydWVcblxuI1x0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc19yYW5nZVxuI1x0XHRcdFx0aXNfcmFuZ2VfMSA9IHRydWVcblxuXHRcdF8uZWFjaCBzY18yLCAodmFsdWUpIC0+XG5cdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfd2lkZSB8fCB2YWx1ZS5hdXRvZm9ybT8udHlwZSA9PSBcInRhYmxlXCJcblx0XHRcdFx0aXNfd2lkZV8yID0gdHJ1ZVxuXG4jXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3JhbmdlXG4jXHRcdFx0XHRpc19yYW5nZV8yID0gdHJ1ZVxuXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRpc193aWRlXzEgPSB0cnVlXG5cdFx0XHRpc193aWRlXzIgPSB0cnVlXG5cblx0XHRpZiBpc1NpbmdsZVxuXHRcdFx0ZmllbGRzLnB1c2ggX2tleXMuc2xpY2UoaSwgaSsxKVxuXHRcdFx0aSArPSAxXG5cdFx0ZWxzZVxuI1x0XHRcdGlmICFpc19yYW5nZV8xICYmIGlzX3JhbmdlXzJcbiNcdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcbiNcdFx0XHRcdGNoaWxkS2V5cy5wdXNoIHVuZGVmaW5lZFxuI1x0XHRcdFx0ZmllbGRzLnB1c2ggY2hpbGRLZXlzXG4jXHRcdFx0XHRpICs9IDFcbiNcdFx0XHRlbHNlXG5cdFx0XHRpZiBpc193aWRlXzFcblx0XHRcdFx0ZmllbGRzLnB1c2ggX2tleXMuc2xpY2UoaSwgaSsxKVxuXHRcdFx0XHRpICs9IDFcblx0XHRcdGVsc2UgaWYgIWlzX3dpZGVfMSBhbmQgaXNfd2lkZV8yXG5cdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcblx0XHRcdFx0Y2hpbGRLZXlzLnB1c2ggdW5kZWZpbmVkXG5cdFx0XHRcdGZpZWxkcy5wdXNoIGNoaWxkS2V5c1xuXHRcdFx0XHRpICs9IDFcblx0XHRcdGVsc2UgaWYgIWlzX3dpZGVfMSBhbmQgIWlzX3dpZGVfMlxuXHRcdFx0XHRjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpKzEpXG5cdFx0XHRcdGlmIF9rZXlzW2krMV1cblx0XHRcdFx0XHRjaGlsZEtleXMucHVzaCBfa2V5c1tpKzFdXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcblx0XHRcdFx0ZmllbGRzLnB1c2ggY2hpbGRLZXlzXG5cdFx0XHRcdGkgKz0gMlxuXG5cdHJldHVybiBmaWVsZHNcblxuQ3JlYXRvci5pc0ZpbHRlclZhbHVlRW1wdHkgPSAodikgLT5cblx0cmV0dXJuIHR5cGVvZiB2ID09IFwidW5kZWZpbmVkXCIgfHwgdiA9PSBudWxsIHx8IE51bWJlci5pc05hTih2KSB8fCB2Lmxlbmd0aCA9PSAwXG5cbkNyZWF0b3IuZ2V0RmllbGREYXRhVHlwZSA9IChvYmplY3RGaWVsZHMsIGtleSktPlxuXHRpZiBvYmplY3RGaWVsZHMgYW5kIGtleVxuXHRcdHJlc3VsdCA9IG9iamVjdEZpZWxkc1trZXldPy50eXBlXG5cdFx0aWYgW1wiZm9ybXVsYVwiLCBcInN1bW1hcnlcIl0uaW5kZXhPZihyZXN1bHQpID4gLTFcblx0XHRcdHJlc3VsdCA9IG9iamVjdEZpZWxkc1trZXldLmRhdGFfdHlwZVxuXHRcdCMgZWxzZSBpZiByZXN1bHQgPT0gXCJzZWxlY3RcIiBhbmQgb2JqZWN0RmllbGRzW2tleV0/LmRhdGFfdHlwZSBhbmQgb2JqZWN0RmllbGRzW2tleV0uZGF0YV90eXBlICE9IFwidGV4dFwiXG5cdFx0IyBcdHJlc3VsdCA9IG9iamVjdEZpZWxkc1trZXldLmRhdGFfdHlwZVxuXHRcdHJldHVybiByZXN1bHRcblx0ZWxzZVxuXHRcdHJldHVybiBcInRleHRcIlxuXG4jIEVORFxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Q3JlYXRvci5nZXRBbGxSZWxhdGVkT2JqZWN0cyA9IChvYmplY3RfbmFtZSktPlxuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW11cblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cblx0XHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cblx0XHRcdFx0aWYgcmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWVcblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoIHJlbGF0ZWRfb2JqZWN0X25hbWVcblxuXHRcdGlmIENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKS5lbmFibGVfZmlsZXNcblx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzLnB1c2ggXCJjbXNfZmlsZXNcIlxuXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRTdGVlZG9zLmZvcm1hdEluZGV4ID0gKGFycmF5KSAtPlxuXHRcdG9iamVjdCA9IHtcbiAgICAgICAgXHRiYWNrZ3JvdW5kOiB0cnVlXG4gICAgXHR9O1xuXHRcdGlzZG9jdW1lbnREQiA9IE1ldGVvci5zZXR0aW5ncz8uZGF0YXNvdXJjZXM/LmRlZmF1bHQ/LmRvY3VtZW50REIgfHwgZmFsc2U7XG5cdFx0aWYgaXNkb2N1bWVudERCXG5cdFx0XHRpZiBhcnJheS5sZW5ndGggPiAwXG5cdFx0XHRcdGluZGV4TmFtZSA9IGFycmF5LmpvaW4oXCIuXCIpO1xuXHRcdFx0XHRvYmplY3QubmFtZSA9IGluZGV4TmFtZTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChpbmRleE5hbWUubGVuZ3RoID4gNTIpXG5cdFx0XHRcdFx0b2JqZWN0Lm5hbWUgPSBpbmRleE5hbWUuc3Vic3RyaW5nKDAsNTIpO1xuXG5cdFx0cmV0dXJuIG9iamVjdDsiLCJDcmVhdG9yLmdldFNjaGVtYSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLnNjaGVtYSA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gQnVpbGRlckNyZWF0b3IucGx1Z2luQ29tcG9uZW50U2VsZWN0b3IoQnVpbGRlckNyZWF0b3Iuc3RvcmUuZ2V0U3RhdGUoKSwgXCJPYmplY3RIb21lXCIsIG9iamVjdF9uYW1lKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIHtcbiAgdmFyIGxpc3RfdmlldywgbGlzdF92aWV3X2lkO1xuICBpZiAoIWFwcF9pZCkge1xuICAgIGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICB9XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgbGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbCk7XG4gIGxpc3Rfdmlld19pZCA9IGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Ll9pZCA6IHZvaWQgMDtcbiAgaWYgKHJlY29yZF9pZCkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkX2lkKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwibWVldGluZ1wiKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoQ3JlYXRvci5nZXRPYmplY3RIb21lQ29tcG9uZW50KG9iamVjdF9uYW1lKSkge1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChsaXN0X3ZpZXdfaWQpIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0QWJzb2x1dGVVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIHtcbiAgdmFyIGxpc3RfdmlldywgbGlzdF92aWV3X2lkO1xuICBpZiAoIWFwcF9pZCkge1xuICAgIGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICB9XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgbGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbCk7XG4gIGxpc3Rfdmlld19pZCA9IGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Ll9pZCA6IHZvaWQgMDtcbiAgaWYgKHJlY29yZF9pZCkge1xuICAgIHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkX2lkLCB0cnVlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwibWVldGluZ1wiKSB7XG4gICAgICByZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCIsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCwgdHJ1ZSk7XG4gICAgfVxuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJvdXRlclVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkge1xuICB2YXIgbGlzdF92aWV3LCBsaXN0X3ZpZXdfaWQ7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKTtcbiAgbGlzdF92aWV3X2lkID0gbGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcuX2lkIDogdm9pZCAwO1xuICBpZiAocmVjb3JkX2lkKSB7XG4gICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkX2lkO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJtZWV0aW5nXCIpIHtcbiAgICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZDtcbiAgICB9XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIHtcbiAgdmFyIHVybDtcbiAgdXJsID0gQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCk7XG4gIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKHVybCk7XG59O1xuXG5DcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIHtcbiAgaWYgKGxpc3Rfdmlld19pZCA9PT0gXCJjYWxlbmRhclwiKSB7XG4gICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0U3dpdGNoTGlzdFVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkge1xuICBpZiAobGlzdF92aWV3X2lkKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgbGlzdF92aWV3X2lkICsgXCIvbGlzdFwiKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvbGlzdC9zd2l0Y2hcIik7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdFVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIHJlY29yZF9pZCwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gIGlmIChyZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyByZWNvcmRfaWQgKyBcIi9cIiArIHJlbGF0ZWRfb2JqZWN0X25hbWUgKyBcIi9ncmlkP3JlbGF0ZWRfZmllbGRfbmFtZT1cIiArIHJlbGF0ZWRfZmllbGRfbmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgcmVjb3JkX2lkICsgXCIvXCIgKyByZWxhdGVkX29iamVjdF9uYW1lICsgXCIvZ3JpZFwiKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgaXNfZGVlcCwgaXNfc2tpcF9oaWRlLCBpc19yZWxhdGVkKSB7XG4gIHZhciBfb2JqZWN0LCBfb3B0aW9ucywgZmllbGRzLCBpY29uLCByZWxhdGVkT2JqZWN0cztcbiAgX29wdGlvbnMgPSBbXTtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfb3B0aW9ucztcbiAgfVxuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgaWNvbiA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMDtcbiAgXy5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZiwgaykge1xuICAgIGlmIChpc19za2lwX2hpZGUgJiYgZi5oaWRkZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGYudHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICBsYWJlbDogXCJcIiArIChmLmxhYmVsIHx8IGspLFxuICAgICAgICB2YWx1ZTogXCJcIiArIGssXG4gICAgICAgIGljb246IGljb25cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgIGxhYmVsOiBmLmxhYmVsIHx8IGssXG4gICAgICAgIHZhbHVlOiBrLFxuICAgICAgICBpY29uOiBpY29uXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBpZiAoaXNfZGVlcCkge1xuICAgIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICAgIHZhciByX29iamVjdDtcbiAgICAgIGlmIChpc19za2lwX2hpZGUgJiYgZi5oaWRkZW4pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKChmLnR5cGUgPT09IFwibG9va3VwXCIgfHwgZi50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikgJiYgZi5yZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhmLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgcl9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChmLnJlZmVyZW5jZV90byk7XG4gICAgICAgIGlmIChyX29iamVjdCkge1xuICAgICAgICAgIHJldHVybiBfLmZvckVhY2gocl9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihmMiwgazIpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgbGFiZWw6IChmLmxhYmVsIHx8IGspICsgXCI9PlwiICsgKGYyLmxhYmVsIHx8IGsyKSxcbiAgICAgICAgICAgICAgdmFsdWU6IGsgKyBcIi5cIiArIGsyLFxuICAgICAgICAgICAgICBpY29uOiByX29iamVjdCAhPSBudWxsID8gcl9vYmplY3QuaWNvbiA6IHZvaWQgMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpZiAoaXNfcmVsYXRlZCkge1xuICAgIHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSk7XG4gICAgXy5lYWNoKHJlbGF0ZWRPYmplY3RzLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihfcmVsYXRlZE9iamVjdCkge1xuICAgICAgICB2YXIgcmVsYXRlZE9iamVjdCwgcmVsYXRlZE9wdGlvbnM7XG4gICAgICAgIHJlbGF0ZWRPcHRpb25zID0gQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMoX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICByZWxhdGVkT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUpO1xuICAgICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRPcHRpb25zLCBmdW5jdGlvbihyZWxhdGVkT3B0aW9uKSB7XG4gICAgICAgICAgaWYgKF9yZWxhdGVkT2JqZWN0LmZvcmVpZ25fa2V5ICE9PSByZWxhdGVkT3B0aW9uLnZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiAocmVsYXRlZE9iamVjdC5sYWJlbCB8fCByZWxhdGVkT2JqZWN0Lm5hbWUpICsgXCI9PlwiICsgcmVsYXRlZE9wdGlvbi5sYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHJlbGF0ZWRPYmplY3QubmFtZSArIFwiLlwiICsgcmVsYXRlZE9wdGlvbi52YWx1ZSxcbiAgICAgICAgICAgICAgaWNvbjogcmVsYXRlZE9iamVjdCAhPSBudWxsID8gcmVsYXRlZE9iamVjdC5pY29uIDogdm9pZCAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH1cbiAgcmV0dXJuIF9vcHRpb25zO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RGaWx0ZXJGaWVsZE9wdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgX29wdGlvbnMsIGZpZWxkcywgaWNvbiwgcGVybWlzc2lvbl9maWVsZHM7XG4gIF9vcHRpb25zID0gW107XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gX29wdGlvbnM7XG4gIH1cbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpO1xuICBpY29uID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwO1xuICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgaWYgKCFfLmluY2x1ZGUoW1wiZ3JpZFwiLCBcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJhdmF0YXJcIiwgXCJpbWFnZVwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKSAmJiAhZi5oaWRkZW4pIHtcbiAgICAgIGlmICghL1xcdytcXC4vLnRlc3QoaykgJiYgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICBsYWJlbDogZi5sYWJlbCB8fCBrLFxuICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgIGljb246IGljb25cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIF9vcHRpb25zO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZE9wdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgX29wdGlvbnMsIGZpZWxkcywgaWNvbiwgcGVybWlzc2lvbl9maWVsZHM7XG4gIF9vcHRpb25zID0gW107XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gX29wdGlvbnM7XG4gIH1cbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpO1xuICBpY29uID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwO1xuICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgaWYgKCFfLmluY2x1ZGUoW1wiZ3JpZFwiLCBcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSkpIHtcbiAgICAgIGlmICghL1xcdytcXC4vLnRlc3QoaykgJiYgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICBsYWJlbDogZi5sYWJlbCB8fCBrLFxuICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgIGljb246IGljb25cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIF9vcHRpb25zO1xufTtcblxuXG4vKlxuZmlsdGVyczog6KaB6L2s5o2i55qEZmlsdGVyc1xuZmllbGRzOiDlr7nosaHlrZfmrrVcbmZpbHRlcl9maWVsZHM6IOm7mOiupOi/h+a7pOWtl+aute+8jOaUr+aMgeWtl+espuS4suaVsOe7hOWSjOWvueixoeaVsOe7hOS4pOenjeagvOW8j++8jOWmgjpbJ2ZpbGVkX25hbWUxJywnZmlsZWRfbmFtZTInXSxbe2ZpZWxkOidmaWxlZF9uYW1lMScscmVxdWlyZWQ6dHJ1ZX1dXG7lpITnkIbpgLvovpE6IOaKimZpbHRlcnPkuK3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25aKe5Yqg5q+P6aG555qEaXNfZGVmYXVsdOOAgWlzX3JlcXVpcmVk5bGe5oCn77yM5LiN5a2Y5Zyo5LqOZmlsdGVyX2ZpZWxkc+eahOi/h+a7pOadoeS7tuWvueW6lOeahOenu+mZpOavj+mhueeahOebuOWFs+WxnuaAp1xu6L+U5Zue57uT5p6cOiDlpITnkIblkI7nmoRmaWx0ZXJzXG4gKi9cblxuQ3JlYXRvci5nZXRGaWx0ZXJzV2l0aEZpbHRlckZpZWxkcyA9IGZ1bmN0aW9uKGZpbHRlcnMsIGZpZWxkcywgZmlsdGVyX2ZpZWxkcykge1xuICBpZiAoIWZpbHRlcnMpIHtcbiAgICBmaWx0ZXJzID0gW107XG4gIH1cbiAgaWYgKCFmaWx0ZXJfZmllbGRzKSB7XG4gICAgZmlsdGVyX2ZpZWxkcyA9IFtdO1xuICB9XG4gIGlmIChmaWx0ZXJfZmllbGRzICE9IG51bGwgPyBmaWx0ZXJfZmllbGRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgIGZpbHRlcl9maWVsZHMuZm9yRWFjaChmdW5jdGlvbihuKSB7XG4gICAgICBpZiAoXy5pc1N0cmluZyhuKSkge1xuICAgICAgICBuID0ge1xuICAgICAgICAgIGZpZWxkOiBuLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKGZpZWxkc1tuLmZpZWxkXSAmJiAhXy5maW5kV2hlcmUoZmlsdGVycywge1xuICAgICAgICBmaWVsZDogbi5maWVsZFxuICAgICAgfSkpIHtcbiAgICAgICAgcmV0dXJuIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgZmllbGQ6IG4uZmllbGQsXG4gICAgICAgICAgaXNfZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICBpc19yZXF1aXJlZDogbi5yZXF1aXJlZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBmaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24oZmlsdGVySXRlbSkge1xuICAgIHZhciBtYXRjaEZpZWxkO1xuICAgIG1hdGNoRmllbGQgPSBmaWx0ZXJfZmllbGRzLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4gPT09IGZpbHRlckl0ZW0uZmllbGQgfHwgbi5maWVsZCA9PT0gZmlsdGVySXRlbS5maWVsZDtcbiAgICB9KTtcbiAgICBpZiAoXy5pc1N0cmluZyhtYXRjaEZpZWxkKSkge1xuICAgICAgbWF0Y2hGaWVsZCA9IHtcbiAgICAgICAgZmllbGQ6IG1hdGNoRmllbGQsXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKG1hdGNoRmllbGQpIHtcbiAgICAgIGZpbHRlckl0ZW0uaXNfZGVmYXVsdCA9IHRydWU7XG4gICAgICByZXR1cm4gZmlsdGVySXRlbS5pc19yZXF1aXJlZCA9IG1hdGNoRmllbGQucmVxdWlyZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBmaWx0ZXJJdGVtLmlzX2RlZmF1bHQ7XG4gICAgICByZXR1cm4gZGVsZXRlIGZpbHRlckl0ZW0uaXNfcmVxdWlyZWQ7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZpbHRlcnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZCkge1xuICB2YXIgY29sbGVjdGlvbiwgb2JqLCByZWNvcmQsIHJlZiwgcmVmMSwgcmVmMjtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAoIXJlY29yZF9pZCkge1xuICAgIHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikgJiYgcmVjb3JkX2lkID09PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSkge1xuICAgICAgaWYgKChyZWYgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpKSAhPSBudWxsID8gcmVmLnJlY29yZCA6IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gKHJlZjEgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLnJlY29yZCkgIT0gbnVsbCA/IHJlZjIuZ2V0KCkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpO1xuICAgIH1cbiAgfVxuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmIChvYmouZGF0YWJhc2VfbmFtZSA9PT0gXCJtZXRlb3JcIiB8fCAhb2JqLmRhdGFiYXNlX25hbWUpIHtcbiAgICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKTtcbiAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgcmVjb3JkID0gY29sbGVjdGlvbi5maW5kT25lKHJlY29yZF9pZCk7XG4gICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cbiAgfSBlbHNlIGlmIChvYmplY3RfbmFtZSAmJiByZWNvcmRfaWQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSZWNvcmROYW1lID0gZnVuY3Rpb24ocmVjb3JkLCBvYmplY3RfbmFtZSkge1xuICB2YXIgbmFtZV9maWVsZF9rZXksIHJlZjtcbiAgaWYgKCFyZWNvcmQpIHtcbiAgICByZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpO1xuICB9XG4gIGlmIChyZWNvcmQpIHtcbiAgICBuYW1lX2ZpZWxkX2tleSA9IG9iamVjdF9uYW1lID09PSBcIm9yZ2FuaXphdGlvbnNcIiA/IFwibmFtZVwiIDogKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5OQU1FX0ZJRUxEX0tFWSA6IHZvaWQgMDtcbiAgICBpZiAocmVjb3JkICYmIG5hbWVfZmllbGRfa2V5KSB7XG4gICAgICByZXR1cm4gcmVjb3JkLmxhYmVsIHx8IHJlY29yZFtuYW1lX2ZpZWxkX2tleV07XG4gICAgfVxuICB9XG59O1xuXG5DcmVhdG9yLmdldEFwcCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwLCByZWYsIHJlZjE7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgYXBwID0gQ3JlYXRvci5BcHBzW2FwcF9pZF07XG4gIGlmICgocmVmID0gQ3JlYXRvci5kZXBzKSAhPSBudWxsKSB7XG4gICAgaWYgKChyZWYxID0gcmVmLmFwcCkgIT0gbnVsbCkge1xuICAgICAgcmVmMS5kZXBlbmQoKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFwcDtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIGRhc2hib2FyZDtcbiAgYXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKTtcbiAgaWYgKCFhcHApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZGFzaGJvYXJkID0gbnVsbDtcbiAgXy5lYWNoKENyZWF0b3IuRGFzaGJvYXJkcywgZnVuY3Rpb24odiwgaykge1xuICAgIHZhciByZWY7XG4gICAgaWYgKCgocmVmID0gdi5hcHBzKSAhPSBudWxsID8gcmVmLmluZGV4T2YoYXBwLl9pZCkgOiB2b2lkIDApID4gLTEpIHtcbiAgICAgIHJldHVybiBkYXNoYm9hcmQgPSB2O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkYXNoYm9hcmQ7XG59O1xuXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZENvbXBvbmVudCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCkge1xuICAgIHJldHVybjtcbiAgfVxuICByZXR1cm4gQnVpbGRlckNyZWF0b3IucGx1Z2luQ29tcG9uZW50U2VsZWN0b3IoQnVpbGRlckNyZWF0b3Iuc3RvcmUuZ2V0U3RhdGUoKSwgXCJEYXNoYm9hcmRcIiwgYXBwLl9pZCk7XG59O1xuXG5DcmVhdG9yLmdldEFwcE9iamVjdE5hbWVzID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIGFwcE9iamVjdHMsIGlzTW9iaWxlLCBvYmplY3RzO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKTtcbiAgYXBwT2JqZWN0cyA9IGlzTW9iaWxlID8gYXBwLm1vYmlsZV9vYmplY3RzIDogYXBwLm9iamVjdHM7XG4gIG9iamVjdHMgPSBbXTtcbiAgaWYgKGFwcCkge1xuICAgIF8uZWFjaChhcHBPYmplY3RzLCBmdW5jdGlvbih2KSB7XG4gICAgICB2YXIgb2JqO1xuICAgICAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qodik7XG4gICAgICBpZiAob2JqICE9IG51bGwgPyBvYmoucGVybWlzc2lvbnMuZ2V0KCkuYWxsb3dSZWFkIDogdm9pZCAwKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RzLnB1c2godik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdHM7XG59O1xuXG5DcmVhdG9yLmdldFVybFdpdGhUb2tlbiA9IGZ1bmN0aW9uKHVybCwgZXhwcmVzc2lvbkZvcm1EYXRhKSB7XG4gIHZhciBoYXNRdWVyeVN5bWJvbCwgbGlua1N0ciwgcGFyYW1zO1xuICBwYXJhbXMgPSB7fTtcbiAgcGFyYW1zW1wiWC1TcGFjZS1JZFwiXSA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICBwYXJhbXNbXCJYLVVzZXItSWRcIl0gPSBTdGVlZG9zLnVzZXJJZCgpO1xuICBwYXJhbXNbXCJYLUNvbXBhbnktSWRzXCJdID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpO1xuICBwYXJhbXNbXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICBpZiAoU3RlZWRvcy5pc0V4cHJlc3Npb24odXJsKSkge1xuICAgIHVybCA9IFN0ZWVkb3MucGFyc2VTaW5nbGVFeHByZXNzaW9uKHVybCwgZXhwcmVzc2lvbkZvcm1EYXRhLCBcIiNcIiwgQ3JlYXRvci5VU0VSX0NPTlRFWFQpO1xuICB9XG4gIGhhc1F1ZXJ5U3ltYm9sID0gLyhcXCMuK1xcPyl8KFxcP1teI10qJCkvZy50ZXN0KHVybCk7XG4gIGxpbmtTdHIgPSBoYXNRdWVyeVN5bWJvbCA/IFwiJlwiIDogXCI/XCI7XG4gIHJldHVybiBcIlwiICsgdXJsICsgbGlua1N0ciArICgkLnBhcmFtKHBhcmFtcykpO1xufTtcblxuQ3JlYXRvci5nZXRBcHBNZW51ID0gZnVuY3Rpb24oYXBwX2lkLCBtZW51X2lkKSB7XG4gIHZhciBtZW51cztcbiAgbWVudXMgPSBDcmVhdG9yLmdldEFwcE1lbnVzKGFwcF9pZCk7XG4gIHJldHVybiBtZW51cyAmJiBtZW51cy5maW5kKGZ1bmN0aW9uKG1lbnUpIHtcbiAgICByZXR1cm4gbWVudS5pZCA9PT0gbWVudV9pZDtcbiAgfSk7XG59O1xuXG5DcmVhdG9yLmdldEFwcE1lbnVVcmxGb3JJbnRlcm5ldCA9IGZ1bmN0aW9uKG1lbnUpIHtcbiAgcmV0dXJuIENyZWF0b3IuZ2V0VXJsV2l0aFRva2VuKG1lbnUucGF0aCwgbWVudSk7XG59O1xuXG5DcmVhdG9yLmdldEFwcE1lbnVVcmwgPSBmdW5jdGlvbihtZW51KSB7XG4gIHZhciB1cmw7XG4gIHVybCA9IG1lbnUucGF0aDtcbiAgaWYgKG1lbnUudHlwZSA9PT0gXCJ1cmxcIikge1xuICAgIGlmIChtZW51LnRhcmdldCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0QXBwTWVudVVybEZvckludGVybmV0KG1lbnUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCIvYXBwLy0vdGFiX2lmcmFtZS9cIiArIG1lbnUuaWQ7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBtZW51LnBhdGg7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QXBwTWVudXMgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgdmFyIGFwcCwgYXBwTWVudXMsIGN1cmVudEFwcE1lbnVzO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBhcHBNZW51cyA9IFNlc3Npb24uZ2V0KFwiYXBwX21lbnVzXCIpO1xuICBpZiAoIWFwcE1lbnVzKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGN1cmVudEFwcE1lbnVzID0gYXBwTWVudXMuZmluZChmdW5jdGlvbihtZW51SXRlbSkge1xuICAgIHJldHVybiBtZW51SXRlbS5pZCA9PT0gYXBwLl9pZDtcbiAgfSk7XG4gIGlmIChjdXJlbnRBcHBNZW51cykge1xuICAgIHJldHVybiBjdXJlbnRBcHBNZW51cy5jaGlsZHJlbjtcbiAgfVxufTtcblxuQ3JlYXRvci5sb2FkQXBwc01lbnVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkYXRhLCBpc01vYmlsZSwgb3B0aW9ucztcbiAgaXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKCk7XG4gIGRhdGEgPSB7fTtcbiAgaWYgKGlzTW9iaWxlKSB7XG4gICAgZGF0YS5tb2JpbGUgPSBpc01vYmlsZTtcbiAgfVxuICBvcHRpb25zID0ge1xuICAgIHR5cGU6ICdnZXQnLFxuICAgIGRhdGE6IGRhdGEsXG4gICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIFNlc3Npb24uc2V0KFwiYXBwX21lbnVzXCIsIGRhdGEpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIFN0ZWVkb3MuYXV0aFJlcXVlc3QoXCIvc2VydmljZS9hcGkvYXBwcy9tZW51c1wiLCBvcHRpb25zKTtcbn07XG5cbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHMgPSBmdW5jdGlvbihpbmNsdWRlQWRtaW4pIHtcbiAgdmFyIGNoYW5nZUFwcDtcbiAgY2hhbmdlQXBwID0gQ3JlYXRvci5fc3ViQXBwLmdldCgpO1xuICBCdWlsZGVyQ3JlYXRvci5zdG9yZS5nZXRTdGF0ZSgpLmVudGl0aWVzLmFwcHMgPSBPYmplY3QuYXNzaWduKHt9LCBCdWlsZGVyQ3JlYXRvci5zdG9yZS5nZXRTdGF0ZSgpLmVudGl0aWVzLmFwcHMsIHtcbiAgICBhcHBzOiBjaGFuZ2VBcHBcbiAgfSk7XG4gIHJldHVybiBCdWlsZGVyQ3JlYXRvci52aXNpYmxlQXBwc1NlbGVjdG9yKEJ1aWxkZXJDcmVhdG9yLnN0b3JlLmdldFN0YXRlKCksIGluY2x1ZGVBZG1pbik7XG59O1xuXG5DcmVhdG9yLmdldFZpc2libGVBcHBzT2JqZWN0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXBwcywgb2JqZWN0cywgdmlzaWJsZU9iamVjdE5hbWVzO1xuICBhcHBzID0gQ3JlYXRvci5nZXRWaXNpYmxlQXBwcygpO1xuICB2aXNpYmxlT2JqZWN0TmFtZXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhhcHBzLCAnb2JqZWN0cycpKTtcbiAgb2JqZWN0cyA9IF8uZmlsdGVyKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKHZpc2libGVPYmplY3ROYW1lcy5pbmRleE9mKG9iai5uYW1lKSA8IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgb2JqZWN0cyA9IG9iamVjdHMuc29ydChDcmVhdG9yLnNvcnRpbmdNZXRob2QuYmluZCh7XG4gICAga2V5OiBcImxhYmVsXCJcbiAgfSkpO1xuICBvYmplY3RzID0gXy5wbHVjayhvYmplY3RzLCAnbmFtZScpO1xuICByZXR1cm4gXy51bmlxKG9iamVjdHMpO1xufTtcblxuQ3JlYXRvci5nZXRBcHBzT2JqZWN0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgb2JqZWN0cywgdGVtcE9iamVjdHM7XG4gIG9iamVjdHMgPSBbXTtcbiAgdGVtcE9iamVjdHMgPSBbXTtcbiAgXy5mb3JFYWNoKENyZWF0b3IuQXBwcywgZnVuY3Rpb24oYXBwKSB7XG4gICAgdGVtcE9iamVjdHMgPSBfLmZpbHRlcihhcHAub2JqZWN0cywgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gIW9iai5oaWRkZW47XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iamVjdHMgPSBvYmplY3RzLmNvbmNhdCh0ZW1wT2JqZWN0cyk7XG4gIH0pO1xuICByZXR1cm4gXy51bmlxKG9iamVjdHMpO1xufTtcblxuQ3JlYXRvci52YWxpZGF0ZUZpbHRlcnMgPSBmdW5jdGlvbihmaWx0ZXJzLCBsb2dpYykge1xuICB2YXIgZSwgZXJyb3JNc2csIGZpbHRlcl9pdGVtcywgZmlsdGVyX2xlbmd0aCwgZmxhZywgaW5kZXgsIHdvcmQ7XG4gIGZpbHRlcl9pdGVtcyA9IF8ubWFwKGZpbHRlcnMsIGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChfLmlzRW1wdHkob2JqKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgfSk7XG4gIGZpbHRlcl9pdGVtcyA9IF8uY29tcGFjdChmaWx0ZXJfaXRlbXMpO1xuICBlcnJvck1zZyA9IFwiXCI7XG4gIGZpbHRlcl9sZW5ndGggPSBmaWx0ZXJfaXRlbXMubGVuZ3RoO1xuICBpZiAobG9naWMpIHtcbiAgICBsb2dpYyA9IGxvZ2ljLnJlcGxhY2UoL1xcbi9nLCBcIlwiKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgICBpZiAoL1suX1xcLSErXSsvaWcudGVzdChsb2dpYykpIHtcbiAgICAgIGVycm9yTXNnID0gXCLlkKvmnInnibnmrorlrZfnrKbjgIJcIjtcbiAgICB9XG4gICAgaWYgKCFlcnJvck1zZykge1xuICAgICAgaW5kZXggPSBsb2dpYy5tYXRjaCgvXFxkKy9pZyk7XG4gICAgICBpZiAoIWluZGV4KSB7XG4gICAgICAgIGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZGV4LmZvckVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgIGlmIChpIDwgMSB8fCBpID4gZmlsdGVyX2xlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInmnaHku7blvJXnlKjkuobmnKrlrprkuYnnmoTnrZvpgInlmajvvJpcIiArIGkgKyBcIuOAglwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZsYWcgPSAxO1xuICAgICAgICB3aGlsZSAoZmxhZyA8PSBmaWx0ZXJfbGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFpbmRleC5pbmNsdWRlcyhcIlwiICsgZmxhZykpIHtcbiAgICAgICAgICAgIGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmxhZysrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIHdvcmQgPSBsb2dpYy5tYXRjaCgvW2EtekEtWl0rL2lnKTtcbiAgICAgIGlmICh3b3JkKSB7XG4gICAgICAgIHdvcmQuZm9yRWFjaChmdW5jdGlvbih3KSB7XG4gICAgICAgICAgaWYgKCEvXihhbmR8b3IpJC9pZy50ZXN0KHcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JNc2cgPSBcIuajgOafpeaCqOeahOmrmOe6p+etm+mAieadoeS7tuS4reeahOaLvOWGmeOAglwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIENyZWF0b3JbXCJldmFsXCJdKGxvZ2ljLnJlcGxhY2UoL2FuZC9pZywgXCImJlwiKS5yZXBsYWNlKC9vci9pZywgXCJ8fFwiKSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajkuK3lkKvmnInnibnmrorlrZfnrKZcIjtcbiAgICAgIH1cbiAgICAgIGlmICgvKEFORClbXigpXSsoT1IpL2lnLnRlc3QobG9naWMpIHx8IC8oT1IpW14oKV0rKEFORCkvaWcudGVzdChsb2dpYykpIHtcbiAgICAgICAgZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOW/hemhu+WcqOi/nue7reaAp+eahCBBTkQg5ZKMIE9SIOihqOi+vuW8j+WJjeWQjuS9v+eUqOaLrOWPt+OAglwiO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoZXJyb3JNc2cpIHtcbiAgICBjb25zb2xlLmxvZyhcImVycm9yXCIsIGVycm9yTXNnKTtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB0b2FzdHIuZXJyb3IoZXJyb3JNc2cpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cblxuLypcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9Nb25nbyA9IGZ1bmN0aW9uKGZpbHRlcnMsIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGVjdG9yO1xuICBpZiAoIShmaWx0ZXJzICE9IG51bGwgPyBmaWx0ZXJzLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCEoZmlsdGVyc1swXSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgIGZpbHRlcnMgPSBfLm1hcChmaWx0ZXJzLCBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBbb2JqLmZpZWxkLCBvYmoub3BlcmF0aW9uLCBvYmoudmFsdWVdO1xuICAgIH0pO1xuICB9XG4gIHNlbGVjdG9yID0gW107XG4gIF8uZWFjaChmaWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICB2YXIgZmllbGQsIG9wdGlvbiwgcmVnLCBzdWJfc2VsZWN0b3IsIHZhbHVlO1xuICAgIGZpZWxkID0gZmlsdGVyWzBdO1xuICAgIG9wdGlvbiA9IGZpbHRlclsxXTtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBudWxsLCBvcHRpb25zKTtcbiAgICB9XG4gICAgc3ViX3NlbGVjdG9yID0ge307XG4gICAgc3ViX3NlbGVjdG9yW2ZpZWxkXSA9IHt9O1xuICAgIGlmIChvcHRpb24gPT09IFwiPVwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGVxXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD5cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRuZVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIj5cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndFwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIj49XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RlXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPFwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGx0XCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD1cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdGVcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJzdGFydHN3aXRoXCIpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeXCIgKyB2YWx1ZSwgXCJpXCIpO1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJjb250YWluc1wiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKHZhbHVlLCBcImlcIik7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIm5vdGNvbnRhaW5zXCIpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeKCg/IVwiICsgdmFsdWUgKyBcIikuKSokXCIsIFwiaVwiKTtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWc7XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3Rvci5wdXNoKHN1Yl9zZWxlY3Rvcik7XG4gIH0pO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5DcmVhdG9yLmlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiA9IGZ1bmN0aW9uKG9wZXJhdGlvbikge1xuICB2YXIgcmVmO1xuICByZXR1cm4gb3BlcmF0aW9uID09PSBcImJldHdlZW5cIiB8fCAhISgocmVmID0gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXModHJ1ZSkpICE9IG51bGwgPyByZWZbb3BlcmF0aW9uXSA6IHZvaWQgMCk7XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuXHRleHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9EZXYgPSBmdW5jdGlvbihmaWx0ZXJzLCBvYmplY3RfbmFtZSwgb3B0aW9ucykge1xuICB2YXIgbG9naWNUZW1wRmlsdGVycywgc2VsZWN0b3IsIHN0ZWVkb3NGaWx0ZXJzO1xuICBzdGVlZG9zRmlsdGVycyA9IHJlcXVpcmUoXCJAc3RlZWRvcy9maWx0ZXJzXCIpO1xuICBpZiAoIWZpbHRlcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLmlzX2xvZ2ljX29yIDogdm9pZCAwKSB7XG4gICAgbG9naWNUZW1wRmlsdGVycyA9IFtdO1xuICAgIGZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbihuKSB7XG4gICAgICBsb2dpY1RlbXBGaWx0ZXJzLnB1c2gobik7XG4gICAgICByZXR1cm4gbG9naWNUZW1wRmlsdGVycy5wdXNoKFwib3JcIik7XG4gICAgfSk7XG4gICAgbG9naWNUZW1wRmlsdGVycy5wb3AoKTtcbiAgICBmaWx0ZXJzID0gbG9naWNUZW1wRmlsdGVycztcbiAgfVxuICBzZWxlY3RvciA9IHN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb0RldihmaWx0ZXJzLCBDcmVhdG9yLlVTRVJfQ09OVEVYVCk7XG4gIHJldHVybiBzZWxlY3Rvcjtcbn07XG5cblxuLypcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRMb2dpY0ZpbHRlcnNUb0RldiA9IGZ1bmN0aW9uKGZpbHRlcnMsIGZpbHRlcl9sb2dpYywgb3B0aW9ucykge1xuICB2YXIgZm9ybWF0X2xvZ2ljO1xuICBmb3JtYXRfbG9naWMgPSBmaWx0ZXJfbG9naWMucmVwbGFjZSgvXFwoXFxzKy9pZywgXCIoXCIpLnJlcGxhY2UoL1xccytcXCkvaWcsIFwiKVwiKS5yZXBsYWNlKC9cXCgvZywgXCJbXCIpLnJlcGxhY2UoL1xcKS9nLCBcIl1cIikucmVwbGFjZSgvXFxzKy9nLCBcIixcIikucmVwbGFjZSgvKGFuZHxvcikvaWcsIFwiJyQxJ1wiKTtcbiAgZm9ybWF0X2xvZ2ljID0gZm9ybWF0X2xvZ2ljLnJlcGxhY2UoLyhcXGQpKy9pZywgZnVuY3Rpb24oeCkge1xuICAgIHZhciBfZiwgZmllbGQsIG9wdGlvbiwgc3ViX3NlbGVjdG9yLCB2YWx1ZTtcbiAgICBfZiA9IGZpbHRlcnNbeCAtIDFdO1xuICAgIGZpZWxkID0gX2YuZmllbGQ7XG4gICAgb3B0aW9uID0gX2Yub3BlcmF0aW9uO1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlLCBudWxsLCBvcHRpb25zKTtcbiAgICB9XG4gICAgc3ViX3NlbGVjdG9yID0gW107XG4gICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkgPT09IHRydWUpIHtcbiAgICAgIGlmIChvcHRpb24gPT09IFwiPVwiKSB7XG4gICAgICAgIF8uZWFjaCh2YWx1ZSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBzdWJfc2VsZWN0b3IucHVzaChbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD5cIikge1xuICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4gc3ViX3NlbGVjdG9yLnB1c2goW2ZpZWxkLCBvcHRpb24sIHZdLCBcImFuZFwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4gc3ViX3NlbGVjdG9yLnB1c2goW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09PSBcImFuZFwiIHx8IHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT09IFwib3JcIikge1xuICAgICAgICBzdWJfc2VsZWN0b3IucG9wKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Yl9zZWxlY3RvciA9IFtmaWVsZCwgb3B0aW9uLCB2YWx1ZV07XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwic3ViX3NlbGVjdG9yXCIsIHN1Yl9zZWxlY3Rvcik7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN1Yl9zZWxlY3Rvcik7XG4gIH0pO1xuICBmb3JtYXRfbG9naWMgPSBcIltcIiArIGZvcm1hdF9sb2dpYyArIFwiXVwiO1xuICByZXR1cm4gQ3JlYXRvcltcImV2YWxcIl0oZm9ybWF0X2xvZ2ljKTtcbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBfb2JqZWN0LCBwZXJtaXNzaW9ucywgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHJlbGF0ZWRfb2JqZWN0cywgdW5yZWxhdGVkX29iamVjdHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBbXTtcbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFfb2JqZWN0KSB7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICB9XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoX29iamVjdC5fY29sbGVjdGlvbl9uYW1lKTtcbiAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cywgXCJvYmplY3RfbmFtZVwiKTtcbiAgaWYgKChyZWxhdGVkX29iamVjdF9uYW1lcyAhPSBudWxsID8gcmVsYXRlZF9vYmplY3RfbmFtZXMubGVuZ3RoIDogdm9pZCAwKSA9PT0gMCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgfVxuICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlKHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0cyk7XG4gIHJldHVybiBfLmZpbHRlcihyZWxhdGVkX29iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0KSB7XG4gICAgdmFyIGFsbG93UmVhZCwgaXNBY3RpdmUsIHJlZiwgcmVsYXRlZF9vYmplY3RfbmFtZTtcbiAgICByZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3Qub2JqZWN0X25hbWU7XG4gICAgaXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTE7XG4gICAgYWxsb3dSZWFkID0gKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5hbGxvd1JlYWQgOiB2b2lkIDA7XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIGFsbG93UmVhZCA9IGFsbG93UmVhZCAmJiBwZXJtaXNzaW9ucy5hbGxvd1JlYWRGaWxlcztcbiAgICB9XG4gICAgcmV0dXJuIGlzQWN0aXZlICYmIGFsbG93UmVhZDtcbiAgfSk7XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3ROYW1lcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIHJlbGF0ZWRfb2JqZWN0cztcbiAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgcmV0dXJuIF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLCBcIm9iamVjdF9uYW1lXCIpO1xufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0TGlzdEFjdGlvbnMgPSBmdW5jdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBhY3Rpb25zO1xuICBhY3Rpb25zID0gQ3JlYXRvci5nZXRBY3Rpb25zKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICBhY3Rpb25zID0gXy5maWx0ZXIoYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgaWYgKGFjdGlvbi5uYW1lID09PSBcInN0YW5kYXJkX2ZvbGxvd1wiKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChhY3Rpb24ubmFtZSA9PT0gXCJzdGFuZGFyZF9xdWVyeVwiKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChhY3Rpb24ub24gPT09IFwibGlzdFwiKSB7XG4gICAgICBpZiAodHlwZW9mIGFjdGlvbi52aXNpYmxlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi52aXNpYmxlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYWN0aW9uLnZpc2libGU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYWN0aW9ucztcbn07XG5cbkNyZWF0b3IuZ2V0QWN0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGFjdGlvbnMsIGRpc2FibGVkX2FjdGlvbnMsIG9iaiwgcGVybWlzc2lvbnMsIHJlZiwgcmVmMTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgZGlzYWJsZWRfYWN0aW9ucyA9IHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnM7XG4gIGFjdGlvbnMgPSBfLnNvcnRCeShfLnZhbHVlcyhvYmouYWN0aW9ucyksICdzb3J0Jyk7XG4gIGlmIChfLmhhcyhvYmosICdhbGxvd19jdXN0b21BY3Rpb25zJykpIHtcbiAgICBhY3Rpb25zID0gXy5maWx0ZXIoYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgICByZXR1cm4gXy5pbmNsdWRlKG9iai5hbGxvd19jdXN0b21BY3Rpb25zLCBhY3Rpb24ubmFtZSkgfHwgXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLmdldE9iamVjdCgnYmFzZScpLmFjdGlvbnMpIHx8IHt9LCBhY3Rpb24ubmFtZSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKF8uaGFzKG9iaiwgJ2V4Y2x1ZGVfYWN0aW9ucycpKSB7XG4gICAgYWN0aW9ucyA9IF8uZmlsdGVyKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgICAgcmV0dXJuICFfLmluY2x1ZGUob2JqLmV4Y2x1ZGVfYWN0aW9ucywgYWN0aW9uLm5hbWUpO1xuICAgIH0pO1xuICB9XG4gIF8uZWFjaChhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcInJlY29yZFwiLCBcInJlY29yZF9vbmx5XCJdLmluZGV4T2YoYWN0aW9uLm9uKSA+IC0xICYmIGFjdGlvbi5uYW1lICE9PSAnc3RhbmRhcmRfZWRpdCcpIHtcbiAgICAgIGlmIChhY3Rpb24ub24gPT09IFwicmVjb3JkX29ubHlcIikge1xuICAgICAgICByZXR1cm4gYWN0aW9uLm9uID0gJ3JlY29yZF9vbmx5X21vcmUnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi5vbiA9ICdyZWNvcmRfbW9yZSc7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJjbXNfZmlsZXNcIiwgXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXS5pbmRleE9mKG9iamVjdF9uYW1lKSA+IC0xKSB7XG4gICAgaWYgKChyZWYgPSBhY3Rpb25zLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4ubmFtZSA9PT0gXCJzdGFuZGFyZF9lZGl0XCI7XG4gICAgfSkpICE9IG51bGwpIHtcbiAgICAgIHJlZi5vbiA9IFwicmVjb3JkX21vcmVcIjtcbiAgICB9XG4gICAgaWYgKChyZWYxID0gYWN0aW9ucy5maW5kKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLm5hbWUgPT09IFwiZG93bmxvYWRcIjtcbiAgICB9KSkgIT0gbnVsbCkge1xuICAgICAgcmVmMS5vbiA9IFwicmVjb3JkXCI7XG4gICAgfVxuICB9XG4gIGFjdGlvbnMgPSBfLmZpbHRlcihhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICByZXR1cm4gXy5pbmRleE9mKGRpc2FibGVkX2FjdGlvbnMsIGFjdGlvbi5uYW1lKSA8IDA7XG4gIH0pO1xuICByZXR1cm4gYWN0aW9ucztcbn07XG5cbi/ov5Tlm57lvZPliY3nlKjmiLfmnInmnYPpmZDorr/pl67nmoTmiYDmnIlsaXN0X3ZpZXfvvIzljIXmi6zliIbkuqvnmoTvvIznlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTvvIjpmaTpnZ5vd25lcuWPmOS6hu+8ie+8jOS7peWPium7mOiupOeahOWFtuS7luinhuWbvuazqOaEj0NyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mmK/kuI3kvJrmnInnlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTop4blm77nmoTvvIzmiYDku6VDcmVhdG9yLmdldFBlcm1pc3Npb25z5Ye95pWw5Lit5ou/5Yiw55qE57uT5p6c5LiN5YWo77yM5bm25LiN5piv5b2T5YmN55So5oi36IO955yL5Yiw5omA5pyJ6KeG5Zu+LztcblxuQ3JlYXRvci5nZXRMaXN0Vmlld3MgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBkaXNhYmxlZF9saXN0X3ZpZXdzLCBpc01vYmlsZSwgbGlzdFZpZXdzLCBsaXN0X3ZpZXdzLCBvYmplY3QsIHJlZjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZGlzYWJsZWRfbGlzdF92aWV3cyA9ICgocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5kaXNhYmxlZF9saXN0X3ZpZXdzIDogdm9pZCAwKSB8fCBbXTtcbiAgbGlzdF92aWV3cyA9IFtdO1xuICBpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKTtcbiAgXy5lYWNoKG9iamVjdC5saXN0X3ZpZXdzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICByZXR1cm4gaXRlbS5uYW1lID0gaXRlbV9uYW1lO1xuICB9KTtcbiAgbGlzdFZpZXdzID0gXy5zb3J0QnkoXy52YWx1ZXMob2JqZWN0Lmxpc3Rfdmlld3MpLCAnc29ydF9ubycpO1xuICBfLmVhY2gobGlzdFZpZXdzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGlzRGlzYWJsZWQ7XG4gICAgaWYgKGlzTW9iaWxlICYmIGl0ZW0udHlwZSA9PT0gXCJjYWxlbmRhclwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpdGVtLm5hbWUgIT09IFwiZGVmYXVsdFwiKSB7XG4gICAgICBpc0Rpc2FibGVkID0gXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW0ubmFtZSkgPiAtMSB8fCAoaXRlbS5faWQgJiYgXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW0uX2lkKSA+IC0xKTtcbiAgICAgIGlmICghaXNEaXNhYmxlZCB8fCBpdGVtLm93bmVyID09PSB1c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlld3MucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbGlzdF92aWV3cztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgZmllbGRzTmFtZSwgcmVmLCB1bnJlYWRhYmxlX2ZpZWxkcztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBmaWVsZHNOYW1lID0gQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lKG9iamVjdF9uYW1lKTtcbiAgdW5yZWFkYWJsZV9maWVsZHMgPSAocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi51bnJlYWRhYmxlX2ZpZWxkcyA6IHZvaWQgMDtcbiAgcmV0dXJuIF8uZGlmZmVyZW5jZShmaWVsZHNOYW1lLCB1bnJlYWRhYmxlX2ZpZWxkcyk7XG59O1xuXG5DcmVhdG9yLmlzbG9hZGluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkLmdldCgpO1xufTtcblxuQ3JlYXRvci5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpO1xufTtcblxuQ3JlYXRvci5nZXREaXNhYmxlZEZpZWxkcyA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0uZGlzYWJsZWQgJiYgIWZpZWxkLmF1dG9mb3JtLm9taXQgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldEhpZGRlbkZpZWxkcyA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0udHlwZSA9PT0gXCJoaWRkZW5cIiAmJiAhZmllbGQuYXV0b2Zvcm0ub21pdCAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aE5vR3JvdXAgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuICghZmllbGQuYXV0b2Zvcm0gfHwgIWZpZWxkLmF1dG9mb3JtLmdyb3VwIHx8IGZpZWxkLmF1dG9mb3JtLmdyb3VwID09PSBcIi1cIikgJiYgKCFmaWVsZC5hdXRvZm9ybSB8fCBmaWVsZC5hdXRvZm9ybS50eXBlICE9PSBcImhpZGRlblwiKSAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0U29ydGVkRmllbGRHcm91cE5hbWVzID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBuYW1lcztcbiAgbmFtZXMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLmdyb3VwICE9PSBcIi1cIiAmJiBmaWVsZC5hdXRvZm9ybS5ncm91cDtcbiAgfSk7XG4gIG5hbWVzID0gXy5jb21wYWN0KG5hbWVzKTtcbiAgbmFtZXMgPSBfLnVuaXF1ZShuYW1lcyk7XG4gIHJldHVybiBuYW1lcztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzRm9yR3JvdXAgPSBmdW5jdGlvbihzY2hlbWEsIGdyb3VwTmFtZSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT09IGdyb3VwTmFtZSAmJiBmaWVsZC5hdXRvZm9ybS50eXBlICE9PSBcImhpZGRlblwiICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRTeXN0ZW1CYXNlRmllbGRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbXCJjcmVhdGVkXCIsIFwiY3JlYXRlZF9ieVwiLCBcIm1vZGlmaWVkXCIsIFwibW9kaWZpZWRfYnlcIl07XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRTeXN0ZW1CYXNlID0gZnVuY3Rpb24oa2V5cykge1xuICByZXR1cm4gXy5kaWZmZXJlbmNlKGtleXMsIENyZWF0b3IuZ2V0U3lzdGVtQmFzZUZpZWxkcygpKTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aG91dE9taXQgPSBmdW5jdGlvbihzY2hlbWEsIGtleXMpIHtcbiAga2V5cyA9IF8ubWFwKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBmaWVsZCwgcmVmO1xuICAgIGZpZWxkID0gXy5waWNrKHNjaGVtYSwga2V5KTtcbiAgICBpZiAoKHJlZiA9IGZpZWxkW2tleV0uYXV0b2Zvcm0pICE9IG51bGwgPyByZWYub21pdCA6IHZvaWQgMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cbiAgfSk7XG4gIGtleXMgPSBfLmNvbXBhY3Qoa2V5cyk7XG4gIHJldHVybiBrZXlzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNJbkZpcnN0TGV2ZWwgPSBmdW5jdGlvbihmaXJzdExldmVsS2V5cywga2V5cykge1xuICBrZXlzID0gXy5tYXAoa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKF8uaW5kZXhPZihmaXJzdExldmVsS2V5cywga2V5KSA+IC0xKSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcbiAga2V5cyA9IF8uY29tcGFjdChrZXlzKTtcbiAgcmV0dXJuIGtleXM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc0ZvclJlb3JkZXIgPSBmdW5jdGlvbihzY2hlbWEsIGtleXMsIGlzU2luZ2xlKSB7XG4gIHZhciBfa2V5cywgY2hpbGRLZXlzLCBmaWVsZHMsIGksIGlzX3dpZGVfMSwgaXNfd2lkZV8yLCBzY18xLCBzY18yO1xuICBmaWVsZHMgPSBbXTtcbiAgaSA9IDA7XG4gIF9rZXlzID0gXy5maWx0ZXIoa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuICFrZXkuZW5kc1dpdGgoJ19lbmRMaW5lJyk7XG4gIH0pO1xuICB3aGlsZSAoaSA8IF9rZXlzLmxlbmd0aCkge1xuICAgIHNjXzEgPSBfLnBpY2soc2NoZW1hLCBfa2V5c1tpXSk7XG4gICAgc2NfMiA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2kgKyAxXSk7XG4gICAgaXNfd2lkZV8xID0gZmFsc2U7XG4gICAgaXNfd2lkZV8yID0gZmFsc2U7XG4gICAgXy5lYWNoKHNjXzEsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCgocmVmID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYuaXNfd2lkZSA6IHZvaWQgMCkgfHwgKChyZWYxID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLnR5cGUgOiB2b2lkIDApID09PSBcInRhYmxlXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzX3dpZGVfMSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgXy5lYWNoKHNjXzIsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCgocmVmID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYuaXNfd2lkZSA6IHZvaWQgMCkgfHwgKChyZWYxID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLnR5cGUgOiB2b2lkIDApID09PSBcInRhYmxlXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzX3dpZGVfMiA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgaXNfd2lkZV8xID0gdHJ1ZTtcbiAgICAgIGlzX3dpZGVfMiA9IHRydWU7XG4gICAgfVxuICAgIGlmIChpc1NpbmdsZSkge1xuICAgICAgZmllbGRzLnB1c2goX2tleXMuc2xpY2UoaSwgaSArIDEpKTtcbiAgICAgIGkgKz0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzX3dpZGVfMSkge1xuICAgICAgICBmaWVsZHMucHVzaChfa2V5cy5zbGljZShpLCBpICsgMSkpO1xuICAgICAgICBpICs9IDE7XG4gICAgICB9IGVsc2UgaWYgKCFpc193aWRlXzEgJiYgaXNfd2lkZV8yKSB7XG4gICAgICAgIGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkgKyAxKTtcbiAgICAgICAgY2hpbGRLZXlzLnB1c2godm9pZCAwKTtcbiAgICAgICAgZmllbGRzLnB1c2goY2hpbGRLZXlzKTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgfSBlbHNlIGlmICghaXNfd2lkZV8xICYmICFpc193aWRlXzIpIHtcbiAgICAgICAgY2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSArIDEpO1xuICAgICAgICBpZiAoX2tleXNbaSArIDFdKSB7XG4gICAgICAgICAgY2hpbGRLZXlzLnB1c2goX2tleXNbaSArIDFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGlsZEtleXMucHVzaCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICAgIGZpZWxkcy5wdXNoKGNoaWxkS2V5cyk7XG4gICAgICAgIGkgKz0gMjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuaXNGaWx0ZXJWYWx1ZUVtcHR5ID0gZnVuY3Rpb24odikge1xuICByZXR1cm4gdHlwZW9mIHYgPT09IFwidW5kZWZpbmVkXCIgfHwgdiA9PT0gbnVsbCB8fCBOdW1iZXIuaXNOYU4odikgfHwgdi5sZW5ndGggPT09IDA7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGF0YVR5cGUgPSBmdW5jdGlvbihvYmplY3RGaWVsZHMsIGtleSkge1xuICB2YXIgcmVmLCByZXN1bHQ7XG4gIGlmIChvYmplY3RGaWVsZHMgJiYga2V5KSB7XG4gICAgcmVzdWx0ID0gKHJlZiA9IG9iamVjdEZpZWxkc1trZXldKSAhPSBudWxsID8gcmVmLnR5cGUgOiB2b2lkIDA7XG4gICAgaWYgKFtcImZvcm11bGFcIiwgXCJzdW1tYXJ5XCJdLmluZGV4T2YocmVzdWx0KSA+IC0xKSB7XG4gICAgICByZXN1bHQgPSBvYmplY3RGaWVsZHNba2V5XS5kYXRhX3R5cGU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwidGV4dFwiO1xuICB9XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3IuZ2V0QWxsUmVsYXRlZE9iamVjdHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgIHZhciByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdO1xuICAgIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICAgIGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSkge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoKHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpLmVuYWJsZV9maWxlcykge1xuICAgICAgcmVsYXRlZF9vYmplY3RfbmFtZXMucHVzaChcImNtc19maWxlc1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3MuZm9ybWF0SW5kZXggPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciBpbmRleE5hbWUsIGlzZG9jdW1lbnREQiwgb2JqZWN0LCByZWYsIHJlZjEsIHJlZjI7XG4gICAgb2JqZWN0ID0ge1xuICAgICAgYmFja2dyb3VuZDogdHJ1ZVxuICAgIH07XG4gICAgaXNkb2N1bWVudERCID0gKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMSA9IHJlZi5kYXRhc291cmNlcykgIT0gbnVsbCA/IChyZWYyID0gcmVmMVtcImRlZmF1bHRcIl0pICE9IG51bGwgPyByZWYyLmRvY3VtZW50REIgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDApIHx8IGZhbHNlO1xuICAgIGlmIChpc2RvY3VtZW50REIpIHtcbiAgICAgIGlmIChhcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGluZGV4TmFtZSA9IGFycmF5LmpvaW4oXCIuXCIpO1xuICAgICAgICBvYmplY3QubmFtZSA9IGluZGV4TmFtZTtcbiAgICAgICAgaWYgKGluZGV4TmFtZS5sZW5ndGggPiA1Mikge1xuICAgICAgICAgIG9iamVjdC5uYW1lID0gaW5kZXhOYW1lLnN1YnN0cmluZygwLCA1Mik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cbiIsIkNyZWF0b3IuYXBwc0J5TmFtZSA9IHt9XG5cbiIsIk1ldGVvci5tZXRob2RzXG5cdFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlX2lkKS0+XG5cdFx0aWYgIXRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0aWYgb2JqZWN0X25hbWUgPT0gXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiXG5cdFx0XHRyZXR1cm5cblx0XHRpZiBvYmplY3RfbmFtZSBhbmQgcmVjb3JkX2lkXG5cdFx0XHRpZiAhc3BhY2VfaWRcblx0XHRcdFx0ZG9jID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kT25lKHtfaWQ6IHJlY29yZF9pZH0sIHtmaWVsZHM6IHtzcGFjZTogMX19KVxuXHRcdFx0XHRzcGFjZV9pZCA9IGRvYz8uc3BhY2VcblxuXHRcdFx0Y29sbGVjdGlvbl9yZWNlbnRfdmlld2VkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIilcblx0XHRcdGZpbHRlcnMgPSB7IG93bmVyOiB0aGlzLnVzZXJJZCwgc3BhY2U6IHNwYWNlX2lkLCAncmVjb3JkLm8nOiBvYmplY3RfbmFtZSwgJ3JlY29yZC5pZHMnOiBbcmVjb3JkX2lkXX1cblx0XHRcdGN1cnJlbnRfcmVjZW50X3ZpZXdlZCA9IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5maW5kT25lKGZpbHRlcnMpXG5cdFx0XHRpZiBjdXJyZW50X3JlY2VudF92aWV3ZWRcblx0XHRcdFx0Y29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLnVwZGF0ZShcblx0XHRcdFx0XHRjdXJyZW50X3JlY2VudF92aWV3ZWQuX2lkLFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdCRpbmM6IHtcblx0XHRcdFx0XHRcdFx0Y291bnQ6IDFcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHQkc2V0OiB7XG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkOiBuZXcgRGF0ZSgpXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuaW5zZXJ0KFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdF9pZDogY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLl9tYWtlTmV3SUQoKVxuXHRcdFx0XHRcdFx0b3duZXI6IHRoaXMudXNlcklkXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VfaWRcblx0XHRcdFx0XHRcdHJlY29yZDoge286IG9iamVjdF9uYW1lLCBpZHM6IFtyZWNvcmRfaWRdfVxuXHRcdFx0XHRcdFx0Y291bnQ6IDFcblx0XHRcdFx0XHRcdGNyZWF0ZWQ6IG5ldyBEYXRlKClcblx0XHRcdFx0XHRcdGNyZWF0ZWRfYnk6IHRoaXMudXNlcklkXG5cdFx0XHRcdFx0XHRtb2RpZmllZDogbmV3IERhdGUoKVxuXHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpXG5cdFx0XHRyZXR1cm4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc3BhY2VfaWQpIHtcbiAgICB2YXIgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLCBjdXJyZW50X3JlY2VudF92aWV3ZWQsIGRvYywgZmlsdGVycztcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBcIm9iamVjdF9yZWNlbnRfdmlld2VkXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG9iamVjdF9uYW1lICYmIHJlY29yZF9pZCkge1xuICAgICAgaWYgKCFzcGFjZV9pZCkge1xuICAgICAgICBkb2MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmRPbmUoe1xuICAgICAgICAgIF9pZDogcmVjb3JkX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHNwYWNlOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc3BhY2VfaWQgPSBkb2MgIT0gbnVsbCA/IGRvYy5zcGFjZSA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICAgIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9yZWNlbnRfdmlld2VkXCIpO1xuICAgICAgZmlsdGVycyA9IHtcbiAgICAgICAgb3duZXI6IHRoaXMudXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICdyZWNvcmQubyc6IG9iamVjdF9uYW1lLFxuICAgICAgICAncmVjb3JkLmlkcyc6IFtyZWNvcmRfaWRdXG4gICAgICB9O1xuICAgICAgY3VycmVudF9yZWNlbnRfdmlld2VkID0gY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLmZpbmRPbmUoZmlsdGVycyk7XG4gICAgICBpZiAoY3VycmVudF9yZWNlbnRfdmlld2VkKSB7XG4gICAgICAgIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC51cGRhdGUoY3VycmVudF9yZWNlbnRfdmlld2VkLl9pZCwge1xuICAgICAgICAgICRpbmM6IHtcbiAgICAgICAgICAgIGNvdW50OiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuaW5zZXJ0KHtcbiAgICAgICAgICBfaWQ6IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5fbWFrZU5ld0lEKCksXG4gICAgICAgICAgb3duZXI6IHRoaXMudXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICByZWNvcmQ6IHtcbiAgICAgICAgICAgIG86IG9iamVjdF9uYW1lLFxuICAgICAgICAgICAgaWRzOiBbcmVjb3JkX2lkXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICBjcmVhdGVkX2J5OiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICBtb2RpZmllZF9ieTogdGhpcy51c2VySWRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcbiIsInJlY2VudF9hZ2dyZWdhdGUgPSAoY3JlYXRlZF9ieSwgc3BhY2VJZCwgX3JlY29yZHMsIGNhbGxiYWNrKS0+XG5cdENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3JlY2VudF92aWV3ZWQucmF3Q29sbGVjdGlvbigpLmFnZ3JlZ2F0ZShbXG5cdFx0eyRtYXRjaDoge2NyZWF0ZWRfYnk6IGNyZWF0ZWRfYnksIHNwYWNlOiBzcGFjZUlkfX0sXG5cdFx0eyRncm91cDoge19pZDoge29iamVjdF9uYW1lOiBcIiRyZWNvcmQub1wiLCByZWNvcmRfaWQ6IFwiJHJlY29yZC5pZHNcIiwgc3BhY2U6IFwiJHNwYWNlXCJ9LCBtYXhDcmVhdGVkOiB7JG1heDogXCIkY3JlYXRlZFwifX19LFxuXHRcdHskc29ydDoge21heENyZWF0ZWQ6IC0xfX0sXG5cdFx0eyRsaW1pdDogMTB9XG5cdF0pLnRvQXJyYXkgKGVyciwgZGF0YSktPlxuXHRcdGlmIGVyclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycilcblxuXHRcdGRhdGEuZm9yRWFjaCAoZG9jKSAtPlxuXHRcdFx0X3JlY29yZHMucHVzaCBkb2MuX2lkXG5cblx0XHRpZiBjYWxsYmFjayAmJiBfLmlzRnVuY3Rpb24oY2FsbGJhY2spXG5cdFx0XHRjYWxsYmFjaygpXG5cblx0XHRyZXR1cm5cblxuYXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSA9IE1ldGVvci53cmFwQXN5bmMocmVjZW50X2FnZ3JlZ2F0ZSlcblxuc2VhcmNoX29iamVjdCA9IChzcGFjZSwgb2JqZWN0X25hbWUsdXNlcklkLCBzZWFyY2hUZXh0KS0+XG5cdGRhdGEgPSBuZXcgQXJyYXkoKVxuXG5cdGlmIHNlYXJjaFRleHRcblxuXHRcdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRcdF9vYmplY3RfY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSlcblx0XHRfb2JqZWN0X25hbWVfa2V5ID0gX29iamVjdD8uTkFNRV9GSUVMRF9LRVlcblx0XHRpZiBfb2JqZWN0ICYmIF9vYmplY3RfY29sbGVjdGlvbiAmJiBfb2JqZWN0X25hbWVfa2V5XG5cdFx0XHRxdWVyeSA9IHt9XG5cdFx0XHRzZWFyY2hfS2V5d29yZHMgPSBzZWFyY2hUZXh0LnNwbGl0KFwiIFwiKVxuXHRcdFx0cXVlcnlfYW5kID0gW11cblx0XHRcdHNlYXJjaF9LZXl3b3Jkcy5mb3JFYWNoIChrZXl3b3JkKS0+XG5cdFx0XHRcdHN1YnF1ZXJ5ID0ge31cblx0XHRcdFx0c3VicXVlcnlbX29iamVjdF9uYW1lX2tleV0gPSB7JHJlZ2V4OiBrZXl3b3JkLnRyaW0oKX1cblx0XHRcdFx0cXVlcnlfYW5kLnB1c2ggc3VicXVlcnlcblxuXHRcdFx0cXVlcnkuJGFuZCA9IHF1ZXJ5X2FuZFxuXHRcdFx0cXVlcnkuc3BhY2UgPSB7JGluOiBbc3BhY2VdfVxuXG5cdFx0XHRmaWVsZHMgPSB7X2lkOiAxfVxuXHRcdFx0ZmllbGRzW19vYmplY3RfbmFtZV9rZXldID0gMVxuXG5cdFx0XHRyZWNvcmRzID0gX29iamVjdF9jb2xsZWN0aW9uLmZpbmQocXVlcnksIHtmaWVsZHM6IGZpZWxkcywgc29ydDoge21vZGlmaWVkOiAxfSwgbGltaXQ6IDV9KVxuXG5cdFx0XHRyZWNvcmRzLmZvckVhY2ggKHJlY29yZCktPlxuXHRcdFx0XHRkYXRhLnB1c2gge19pZDogcmVjb3JkLl9pZCwgX25hbWU6IHJlY29yZFtfb2JqZWN0X25hbWVfa2V5XSwgX29iamVjdF9uYW1lOiBvYmplY3RfbmFtZX1cblx0XG5cdHJldHVybiBkYXRhXG5cbk1ldGVvci5tZXRob2RzXG5cdCdvYmplY3RfcmVjZW50X3JlY29yZCc6IChzcGFjZUlkKS0+XG5cdFx0ZGF0YSA9IG5ldyBBcnJheSgpXG5cdFx0cmVjb3JkcyA9IG5ldyBBcnJheSgpXG5cdFx0YXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSh0aGlzLnVzZXJJZCwgc3BhY2VJZCwgcmVjb3Jkcylcblx0XHRyZWNvcmRzLmZvckVhY2ggKGl0ZW0pLT5cblx0XHRcdHJlY29yZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChpdGVtLm9iamVjdF9uYW1lLCBpdGVtLnNwYWNlKVxuXG5cdFx0XHRpZiAhcmVjb3JkX29iamVjdFxuXHRcdFx0XHRyZXR1cm5cblxuXHRcdFx0cmVjb3JkX29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpXG5cblx0XHRcdGlmIHJlY29yZF9vYmplY3QgJiYgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uXG5cdFx0XHRcdGZpZWxkcyA9IHtfaWQ6IDF9XG5cblx0XHRcdFx0ZmllbGRzW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldID0gMVxuXG5cdFx0XHRcdHJlY29yZCA9IHJlY29yZF9vYmplY3RfY29sbGVjdGlvbi5maW5kT25lKGl0ZW0ucmVjb3JkX2lkWzBdLCB7ZmllbGRzOiBmaWVsZHN9KVxuXHRcdFx0XHRpZiByZWNvcmRcblx0XHRcdFx0XHRkYXRhLnB1c2gge19pZDogcmVjb3JkLl9pZCwgX25hbWU6IHJlY29yZFtyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSwgX29iamVjdF9uYW1lOiBpdGVtLm9iamVjdF9uYW1lfVxuXG5cdFx0cmV0dXJuIGRhdGFcblxuXHQnb2JqZWN0X3JlY29yZF9zZWFyY2gnOiAob3B0aW9ucyktPlxuXHRcdHNlbGYgPSB0aGlzXG5cblx0XHRkYXRhID0gbmV3IEFycmF5KClcblxuXHRcdHNlYXJjaFRleHQgPSBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRzcGFjZSA9IG9wdGlvbnMuc3BhY2VcblxuXHRcdF8uZm9yRWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChfb2JqZWN0LCBuYW1lKS0+XG5cdFx0XHRpZiBfb2JqZWN0LmVuYWJsZV9zZWFyY2hcblx0XHRcdFx0b2JqZWN0X3JlY29yZCA9IHNlYXJjaF9vYmplY3Qoc3BhY2UsIF9vYmplY3QubmFtZSwgc2VsZi51c2VySWQsIHNlYXJjaFRleHQpXG5cdFx0XHRcdGRhdGEgPSBkYXRhLmNvbmNhdChvYmplY3RfcmVjb3JkKVxuXG5cdFx0cmV0dXJuIGRhdGFcbiIsInZhciBhc3luY19yZWNlbnRfYWdncmVnYXRlLCByZWNlbnRfYWdncmVnYXRlLCBzZWFyY2hfb2JqZWN0O1xuXG5yZWNlbnRfYWdncmVnYXRlID0gZnVuY3Rpb24oY3JlYXRlZF9ieSwgc3BhY2VJZCwgX3JlY29yZHMsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9yZWNlbnRfdmlld2VkLnJhd0NvbGxlY3Rpb24oKS5hZ2dyZWdhdGUoW1xuICAgIHtcbiAgICAgICRtYXRjaDoge1xuICAgICAgICBjcmVhdGVkX2J5OiBjcmVhdGVkX2J5LFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgICRncm91cDoge1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogXCIkcmVjb3JkLm9cIixcbiAgICAgICAgICByZWNvcmRfaWQ6IFwiJHJlY29yZC5pZHNcIixcbiAgICAgICAgICBzcGFjZTogXCIkc3BhY2VcIlxuICAgICAgICB9LFxuICAgICAgICBtYXhDcmVhdGVkOiB7XG4gICAgICAgICAgJG1heDogXCIkY3JlYXRlZFwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAkc29ydDoge1xuICAgICAgICBtYXhDcmVhdGVkOiAtMVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgICRsaW1pdDogMTBcbiAgICB9XG4gIF0pLnRvQXJyYXkoZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihkb2MpIHtcbiAgICAgIHJldHVybiBfcmVjb3Jkcy5wdXNoKGRvYy5faWQpO1xuICAgIH0pO1xuICAgIGlmIChjYWxsYmFjayAmJiBfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5hc3luY19yZWNlbnRfYWdncmVnYXRlID0gTWV0ZW9yLndyYXBBc3luYyhyZWNlbnRfYWdncmVnYXRlKTtcblxuc2VhcmNoX29iamVjdCA9IGZ1bmN0aW9uKHNwYWNlLCBvYmplY3RfbmFtZSwgdXNlcklkLCBzZWFyY2hUZXh0KSB7XG4gIHZhciBfb2JqZWN0LCBfb2JqZWN0X2NvbGxlY3Rpb24sIF9vYmplY3RfbmFtZV9rZXksIGRhdGEsIGZpZWxkcywgcXVlcnksIHF1ZXJ5X2FuZCwgcmVjb3Jkcywgc2VhcmNoX0tleXdvcmRzO1xuICBkYXRhID0gbmV3IEFycmF5KCk7XG4gIGlmIChzZWFyY2hUZXh0KSB7XG4gICAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpO1xuICAgIF9vYmplY3RfbmFtZV9rZXkgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lk5BTUVfRklFTERfS0VZIDogdm9pZCAwO1xuICAgIGlmIChfb2JqZWN0ICYmIF9vYmplY3RfY29sbGVjdGlvbiAmJiBfb2JqZWN0X25hbWVfa2V5KSB7XG4gICAgICBxdWVyeSA9IHt9O1xuICAgICAgc2VhcmNoX0tleXdvcmRzID0gc2VhcmNoVGV4dC5zcGxpdChcIiBcIik7XG4gICAgICBxdWVyeV9hbmQgPSBbXTtcbiAgICAgIHNlYXJjaF9LZXl3b3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKGtleXdvcmQpIHtcbiAgICAgICAgdmFyIHN1YnF1ZXJ5O1xuICAgICAgICBzdWJxdWVyeSA9IHt9O1xuICAgICAgICBzdWJxdWVyeVtfb2JqZWN0X25hbWVfa2V5XSA9IHtcbiAgICAgICAgICAkcmVnZXg6IGtleXdvcmQudHJpbSgpXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBxdWVyeV9hbmQucHVzaChzdWJxdWVyeSk7XG4gICAgICB9KTtcbiAgICAgIHF1ZXJ5LiRhbmQgPSBxdWVyeV9hbmQ7XG4gICAgICBxdWVyeS5zcGFjZSA9IHtcbiAgICAgICAgJGluOiBbc3BhY2VdXG4gICAgICB9O1xuICAgICAgZmllbGRzID0ge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH07XG4gICAgICBmaWVsZHNbX29iamVjdF9uYW1lX2tleV0gPSAxO1xuICAgICAgcmVjb3JkcyA9IF9vYmplY3RfY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCB7XG4gICAgICAgIGZpZWxkczogZmllbGRzLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgbW9kaWZpZWQ6IDFcbiAgICAgICAgfSxcbiAgICAgICAgbGltaXQ6IDVcbiAgICAgIH0pO1xuICAgICAgcmVjb3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICByZXR1cm4gZGF0YS5wdXNoKHtcbiAgICAgICAgICBfaWQ6IHJlY29yZC5faWQsXG4gICAgICAgICAgX25hbWU6IHJlY29yZFtfb2JqZWN0X25hbWVfa2V5XSxcbiAgICAgICAgICBfb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkYXRhO1xufTtcblxuTWV0ZW9yLm1ldGhvZHMoe1xuICAnb2JqZWN0X3JlY2VudF9yZWNvcmQnOiBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIGRhdGEsIHJlY29yZHM7XG4gICAgZGF0YSA9IG5ldyBBcnJheSgpO1xuICAgIHJlY29yZHMgPSBuZXcgQXJyYXkoKTtcbiAgICBhc3luY19yZWNlbnRfYWdncmVnYXRlKHRoaXMudXNlcklkLCBzcGFjZUlkLCByZWNvcmRzKTtcbiAgICByZWNvcmRzLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgdmFyIGZpZWxkcywgcmVjb3JkLCByZWNvcmRfb2JqZWN0LCByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb247XG4gICAgICByZWNvcmRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSk7XG4gICAgICBpZiAoIXJlY29yZF9vYmplY3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpO1xuICAgICAgaWYgKHJlY29yZF9vYmplY3QgJiYgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uKSB7XG4gICAgICAgIGZpZWxkcyA9IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfTtcbiAgICAgICAgZmllbGRzW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldID0gMTtcbiAgICAgICAgcmVjb3JkID0gcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uLmZpbmRPbmUoaXRlbS5yZWNvcmRfaWRbMF0sIHtcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICAgIHJldHVybiBkYXRhLnB1c2goe1xuICAgICAgICAgICAgX2lkOiByZWNvcmQuX2lkLFxuICAgICAgICAgICAgX25hbWU6IHJlY29yZFtyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSxcbiAgICAgICAgICAgIF9vYmplY3RfbmFtZTogaXRlbS5vYmplY3RfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH0sXG4gICdvYmplY3RfcmVjb3JkX3NlYXJjaCc6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgZGF0YSwgc2VhcmNoVGV4dCwgc2VsZiwgc3BhY2U7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgZGF0YSA9IG5ldyBBcnJheSgpO1xuICAgIHNlYXJjaFRleHQgPSBvcHRpb25zLnNlYXJjaFRleHQ7XG4gICAgc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICAgIF8uZm9yRWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKF9vYmplY3QsIG5hbWUpIHtcbiAgICAgIHZhciBvYmplY3RfcmVjb3JkO1xuICAgICAgaWYgKF9vYmplY3QuZW5hYmxlX3NlYXJjaCkge1xuICAgICAgICBvYmplY3RfcmVjb3JkID0gc2VhcmNoX29iamVjdChzcGFjZSwgX29iamVjdC5uYW1lLCBzZWxmLnVzZXJJZCwgc2VhcmNoVGV4dCk7XG4gICAgICAgIHJldHVybiBkYXRhID0gZGF0YS5jb25jYXQob2JqZWN0X3JlY29yZCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcbiAgICB1cGRhdGVfZmlsdGVyczogKGxpc3R2aWV3X2lkLCBmaWx0ZXJzLCBmaWx0ZXJfc2NvcGUsIGZpbHRlcl9sb2dpYyktPlxuICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MuZGlyZWN0LnVwZGF0ZSh7X2lkOiBsaXN0dmlld19pZH0sIHskc2V0OiB7ZmlsdGVyczogZmlsdGVycywgZmlsdGVyX3Njb3BlOiBmaWx0ZXJfc2NvcGUsIGZpbHRlcl9sb2dpYzogZmlsdGVyX2xvZ2ljfX0pXG5cbiAgICB1cGRhdGVfY29sdW1uczogKGxpc3R2aWV3X2lkLCBjb2x1bW5zKS0+XG4gICAgICAgIGNoZWNrKGNvbHVtbnMsIEFycmF5KVxuICAgICAgICBcbiAgICAgICAgaWYgY29sdW1ucy5sZW5ndGggPCAxXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMCwgXCJTZWxlY3QgYXQgbGVhc3Qgb25lIGZpZWxkIHRvIGRpc3BsYXlcIlxuICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MudXBkYXRlKHtfaWQ6IGxpc3R2aWV3X2lkfSwgeyRzZXQ6IHtjb2x1bW5zOiBjb2x1bW5zfX0pXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIHVwZGF0ZV9maWx0ZXJzOiBmdW5jdGlvbihsaXN0dmlld19pZCwgZmlsdGVycywgZmlsdGVyX3Njb3BlLCBmaWx0ZXJfbG9naWMpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfbGlzdHZpZXdzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBsaXN0dmlld19pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgZmlsdGVyczogZmlsdGVycyxcbiAgICAgICAgZmlsdGVyX3Njb3BlOiBmaWx0ZXJfc2NvcGUsXG4gICAgICAgIGZpbHRlcl9sb2dpYzogZmlsdGVyX2xvZ2ljXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHVwZGF0ZV9jb2x1bW5zOiBmdW5jdGlvbihsaXN0dmlld19pZCwgY29sdW1ucykge1xuICAgIGNoZWNrKGNvbHVtbnMsIEFycmF5KTtcbiAgICBpZiAoY29sdW1ucy5sZW5ndGggPCAxKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCJTZWxlY3QgYXQgbGVhc3Qgb25lIGZpZWxkIHRvIGRpc3BsYXlcIik7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MudXBkYXRlKHtcbiAgICAgIF9pZDogbGlzdHZpZXdfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnNcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHQncmVwb3J0X2RhdGEnOiAob3B0aW9ucyktPlxuXHRcdGNoZWNrKG9wdGlvbnMsIE9iamVjdClcblx0XHRzcGFjZSA9IG9wdGlvbnMuc3BhY2Vcblx0XHRmaWVsZHMgPSBvcHRpb25zLmZpZWxkc1xuXHRcdG9iamVjdF9uYW1lID0gb3B0aW9ucy5vYmplY3RfbmFtZVxuXHRcdGZpbHRlcl9zY29wZSA9IG9wdGlvbnMuZmlsdGVyX3Njb3BlXG5cdFx0ZmlsdGVycyA9IG9wdGlvbnMuZmlsdGVyc1xuXHRcdGZpbHRlckZpZWxkcyA9IHt9XG5cdFx0Y29tcG91bmRGaWVsZHMgPSBbXVxuXHRcdG9iamVjdEZpZWxkcyA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKT8uZmllbGRzXG5cdFx0Xy5lYWNoIGZpZWxkcywgKGl0ZW0sIGluZGV4KS0+XG5cdFx0XHRzcGxpdHMgPSBpdGVtLnNwbGl0KFwiLlwiKVxuXHRcdFx0bmFtZSA9IHNwbGl0c1swXVxuXHRcdFx0b2JqZWN0RmllbGQgPSBvYmplY3RGaWVsZHNbbmFtZV1cblx0XHRcdGlmIHNwbGl0cy5sZW5ndGggPiAxIGFuZCBvYmplY3RGaWVsZFxuXHRcdFx0XHRjaGlsZEtleSA9IGl0ZW0ucmVwbGFjZSBuYW1lICsgXCIuXCIsIFwiXCJcblx0XHRcdFx0Y29tcG91bmRGaWVsZHMucHVzaCh7bmFtZTogbmFtZSwgY2hpbGRLZXk6IGNoaWxkS2V5LCBmaWVsZDogb2JqZWN0RmllbGR9KVxuXHRcdFx0ZmlsdGVyRmllbGRzW25hbWVdID0gMVxuXG5cdFx0c2VsZWN0b3IgPSB7fVxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXG5cdFx0c2VsZWN0b3Iuc3BhY2UgPSBzcGFjZVxuXHRcdGlmIGZpbHRlcl9zY29wZSA9PSBcInNwYWNleFwiXG5cdFx0XHRzZWxlY3Rvci5zcGFjZSA9IFxuXHRcdFx0XHQkaW46IFtudWxsLHNwYWNlXVxuXHRcdGVsc2UgaWYgZmlsdGVyX3Njb3BlID09IFwibWluZVwiXG5cdFx0XHRzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxuXG5cdFx0aWYgQ3JlYXRvci5pc0NvbW1vblNwYWNlKHNwYWNlKSAmJiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZSwgQHVzZXJJZClcblx0XHRcdGRlbGV0ZSBzZWxlY3Rvci5zcGFjZVxuXG5cdFx0aWYgZmlsdGVycyBhbmQgZmlsdGVycy5sZW5ndGggPiAwXG5cdFx0XHRzZWxlY3RvcltcIiRhbmRcIl0gPSBmaWx0ZXJzXG5cblx0XHRjdXJzb3IgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IsIHtmaWVsZHM6IGZpbHRlckZpZWxkcywgc2tpcDogMCwgbGltaXQ6IDEwMDAwfSlcbiNcdFx0aWYgY3Vyc29yLmNvdW50KCkgPiAxMDAwMFxuI1x0XHRcdHJldHVybiBbXVxuXHRcdHJlc3VsdCA9IGN1cnNvci5mZXRjaCgpXG5cdFx0aWYgY29tcG91bmRGaWVsZHMubGVuZ3RoXG5cdFx0XHRyZXN1bHQgPSByZXN1bHQubWFwIChpdGVtLGluZGV4KS0+XG5cdFx0XHRcdF8uZWFjaCBjb21wb3VuZEZpZWxkcywgKGNvbXBvdW5kRmllbGRJdGVtLCBpbmRleCktPlxuXHRcdFx0XHRcdGl0ZW1LZXkgPSBjb21wb3VuZEZpZWxkSXRlbS5uYW1lICsgXCIqJSpcIiArIGNvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5LnJlcGxhY2UoL1xcLi9nLCBcIiolKlwiKVxuXHRcdFx0XHRcdGl0ZW1WYWx1ZSA9IGl0ZW1bY29tcG91bmRGaWVsZEl0ZW0ubmFtZV1cblx0XHRcdFx0XHR0eXBlID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQudHlwZVxuXHRcdFx0XHRcdGlmIFtcImxvb2t1cFwiLCBcIm1hc3Rlcl9kZXRhaWxcIl0uaW5kZXhPZih0eXBlKSA+IC0xXG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0XHRcdGNvbXBvdW5kRmlsdGVyRmllbGRzID0ge31cblx0XHRcdFx0XHRcdGNvbXBvdW5kRmlsdGVyRmllbGRzW2NvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5XSA9IDFcblx0XHRcdFx0XHRcdHJlZmVyZW5jZUl0ZW0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvKS5maW5kT25lIHtfaWQ6IGl0ZW1WYWx1ZX0sIGZpZWxkczogY29tcG91bmRGaWx0ZXJGaWVsZHNcblx0XHRcdFx0XHRcdGlmIHJlZmVyZW5jZUl0ZW1cblx0XHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IHJlZmVyZW5jZUl0ZW1bY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldXG5cdFx0XHRcdFx0ZWxzZSBpZiB0eXBlID09IFwic2VsZWN0XCJcblx0XHRcdFx0XHRcdG9wdGlvbnMgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5vcHRpb25zXG5cdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gXy5maW5kV2hlcmUob3B0aW9ucywge3ZhbHVlOiBpdGVtVmFsdWV9KT8ubGFiZWwgb3IgaXRlbVZhbHVlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IGl0ZW1WYWx1ZVxuXHRcdFx0XHRcdHVubGVzcyBpdGVtW2l0ZW1LZXldXG5cdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gXCItLVwiXG5cdFx0XHRcdHJldHVybiBpdGVtXG5cdFx0XHRyZXR1cm4gcmVzdWx0XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHJlc3VsdFxuXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gICdyZXBvcnRfZGF0YSc6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY29tcG91bmRGaWVsZHMsIGN1cnNvciwgZmllbGRzLCBmaWx0ZXJGaWVsZHMsIGZpbHRlcl9zY29wZSwgZmlsdGVycywgb2JqZWN0RmllbGRzLCBvYmplY3RfbmFtZSwgcmVmLCByZXN1bHQsIHNlbGVjdG9yLCBzcGFjZSwgdXNlcklkO1xuICAgIGNoZWNrKG9wdGlvbnMsIE9iamVjdCk7XG4gICAgc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICAgIGZpZWxkcyA9IG9wdGlvbnMuZmllbGRzO1xuICAgIG9iamVjdF9uYW1lID0gb3B0aW9ucy5vYmplY3RfbmFtZTtcbiAgICBmaWx0ZXJfc2NvcGUgPSBvcHRpb25zLmZpbHRlcl9zY29wZTtcbiAgICBmaWx0ZXJzID0gb3B0aW9ucy5maWx0ZXJzO1xuICAgIGZpbHRlckZpZWxkcyA9IHt9O1xuICAgIGNvbXBvdW5kRmllbGRzID0gW107XG4gICAgb2JqZWN0RmllbGRzID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDA7XG4gICAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgIHZhciBjaGlsZEtleSwgbmFtZSwgb2JqZWN0RmllbGQsIHNwbGl0cztcbiAgICAgIHNwbGl0cyA9IGl0ZW0uc3BsaXQoXCIuXCIpO1xuICAgICAgbmFtZSA9IHNwbGl0c1swXTtcbiAgICAgIG9iamVjdEZpZWxkID0gb2JqZWN0RmllbGRzW25hbWVdO1xuICAgICAgaWYgKHNwbGl0cy5sZW5ndGggPiAxICYmIG9iamVjdEZpZWxkKSB7XG4gICAgICAgIGNoaWxkS2V5ID0gaXRlbS5yZXBsYWNlKG5hbWUgKyBcIi5cIiwgXCJcIik7XG4gICAgICAgIGNvbXBvdW5kRmllbGRzLnB1c2goe1xuICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgY2hpbGRLZXk6IGNoaWxkS2V5LFxuICAgICAgICAgIGZpZWxkOiBvYmplY3RGaWVsZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmaWx0ZXJGaWVsZHNbbmFtZV0gPSAxO1xuICAgIH0pO1xuICAgIHNlbGVjdG9yID0ge307XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZTtcbiAgICBpZiAoZmlsdGVyX3Njb3BlID09PSBcInNwYWNleFwiKSB7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHtcbiAgICAgICAgJGluOiBbbnVsbCwgc3BhY2VdXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyX3Njb3BlID09PSBcIm1pbmVcIikge1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgfVxuICAgIGlmIChDcmVhdG9yLmlzQ29tbW9uU3BhY2Uoc3BhY2UpICYmIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlLCB0aGlzLnVzZXJJZCkpIHtcbiAgICAgIGRlbGV0ZSBzZWxlY3Rvci5zcGFjZTtcbiAgICB9XG4gICAgaWYgKGZpbHRlcnMgJiYgZmlsdGVycy5sZW5ndGggPiAwKSB7XG4gICAgICBzZWxlY3RvcltcIiRhbmRcIl0gPSBmaWx0ZXJzO1xuICAgIH1cbiAgICBjdXJzb3IgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IsIHtcbiAgICAgIGZpZWxkczogZmlsdGVyRmllbGRzLFxuICAgICAgc2tpcDogMCxcbiAgICAgIGxpbWl0OiAxMDAwMFxuICAgIH0pO1xuICAgIHJlc3VsdCA9IGN1cnNvci5mZXRjaCgpO1xuICAgIGlmIChjb21wb3VuZEZpZWxkcy5sZW5ndGgpIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5tYXAoZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgXy5lYWNoKGNvbXBvdW5kRmllbGRzLCBmdW5jdGlvbihjb21wb3VuZEZpZWxkSXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICB2YXIgY29tcG91bmRGaWx0ZXJGaWVsZHMsIGl0ZW1LZXksIGl0ZW1WYWx1ZSwgcmVmMSwgcmVmZXJlbmNlSXRlbSwgcmVmZXJlbmNlX3RvLCB0eXBlO1xuICAgICAgICAgIGl0ZW1LZXkgPSBjb21wb3VuZEZpZWxkSXRlbS5uYW1lICsgXCIqJSpcIiArIGNvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5LnJlcGxhY2UoL1xcLi9nLCBcIiolKlwiKTtcbiAgICAgICAgICBpdGVtVmFsdWUgPSBpdGVtW2NvbXBvdW5kRmllbGRJdGVtLm5hbWVdO1xuICAgICAgICAgIHR5cGUgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC50eXBlO1xuICAgICAgICAgIGlmIChbXCJsb29rdXBcIiwgXCJtYXN0ZXJfZGV0YWlsXCJdLmluZGV4T2YodHlwZSkgPiAtMSkge1xuICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgY29tcG91bmRGaWx0ZXJGaWVsZHMgPSB7fTtcbiAgICAgICAgICAgIGNvbXBvdW5kRmlsdGVyRmllbGRzW2NvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5XSA9IDE7XG4gICAgICAgICAgICByZWZlcmVuY2VJdGVtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bykuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogaXRlbVZhbHVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczogY29tcG91bmRGaWx0ZXJGaWVsZHNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZUl0ZW0pIHtcbiAgICAgICAgICAgICAgaXRlbVtpdGVtS2V5XSA9IHJlZmVyZW5jZUl0ZW1bY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgICAgICAgb3B0aW9ucyA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLm9wdGlvbnM7XG4gICAgICAgICAgICBpdGVtW2l0ZW1LZXldID0gKChyZWYxID0gXy5maW5kV2hlcmUob3B0aW9ucywge1xuICAgICAgICAgICAgICB2YWx1ZTogaXRlbVZhbHVlXG4gICAgICAgICAgICB9KSkgIT0gbnVsbCA/IHJlZjEubGFiZWwgOiB2b2lkIDApIHx8IGl0ZW1WYWx1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXRlbVtpdGVtS2V5XSA9IGl0ZW1WYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFpdGVtW2l0ZW1LZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbVtpdGVtS2V5XSA9IFwiLS1cIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH1cbn0pO1xuIiwiIyMjXG4gICAgdHlwZTogXCJ1c2VyXCJcbiAgICBvYmplY3RfbmFtZTogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgICByZWNvcmRfaWQ6IFwie29iamVjdF9uYW1lfSx7bGlzdHZpZXdfaWR9XCJcbiAgICBzZXR0aW5nczpcbiAgICAgICAgY29sdW1uX3dpZHRoOiB7IGZpZWxkX2E6IDEwMCwgZmllbGRfMjogMTUwIH1cbiAgICAgICAgc29ydDogW1tcImZpZWxkX2FcIiwgXCJkZXNjXCJdXVxuICAgIG93bmVyOiB7dXNlcklkfVxuIyMjXG5cbk1ldGVvci5tZXRob2RzXG4gICAgXCJ0YWJ1bGFyX3NvcnRfc2V0dGluZ3NcIjogKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIHNvcnQpLT5cbiAgICAgICAgdXNlcklkID0gdGhpcy51c2VySWRcbiAgICAgICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLCBvd25lcjogdXNlcklkfSlcbiAgICAgICAgaWYgc2V0dGluZ1xuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LnNvcnRcIjogc29ydH19KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBkb2MgPSBcbiAgICAgICAgICAgICAgICB0eXBlOiBcInVzZXJcIlxuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuICAgICAgICAgICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge31cbiAgICAgICAgICAgICAgICBvd25lcjogdXNlcklkXG5cbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge31cbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0XG5cbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYylcblxuICAgIFwidGFidWxhcl9jb2x1bW5fd2lkdGhfc2V0dGluZ3NcIjogKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbl93aWR0aCktPlxuICAgICAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxuICAgICAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsIG93bmVyOiB1c2VySWR9KVxuICAgICAgICBpZiBzZXR0aW5nXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uY29sdW1uX3dpZHRoXCI6IGNvbHVtbl93aWR0aH19KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBkb2MgPSBcbiAgICAgICAgICAgICAgICB0eXBlOiBcInVzZXJcIlxuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuICAgICAgICAgICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge31cbiAgICAgICAgICAgICAgICBvd25lcjogdXNlcklkXG5cbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge31cbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aFxuXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpXG5cbiAgICBcImdyaWRfc2V0dGluZ3NcIjogKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbl93aWR0aCwgc29ydCktPlxuICAgICAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxuICAgICAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCIsIG93bmVyOiB1c2VySWR9KVxuICAgICAgICBpZiBzZXR0aW5nXG4gICAgICAgICAgICAjIOavj+asoemDveW8uuWItuaUueWPmF9pZF9hY3Rpb25z5YiX55qE5a695bqm77yM5Lul6Kej5Yaz5b2T55So5oi35Y+q5pS55Y+Y5a2X5q615qyh5bqP6ICM5rKh5pyJ5pS55Y+Y5Lu75L2V5a2X5q615a695bqm5pe277yM5YmN56uv5rKh5pyJ6K6i6ZiF5Yiw5a2X5q615qyh5bqP5Y+Y5pu055qE5pWw5o2u55qE6Zeu6aKYXG4gICAgICAgICAgICBjb2x1bW5fd2lkdGguX2lkX2FjdGlvbnMgPSBpZiBzZXR0aW5nLnNldHRpbmdzW1wiI3tsaXN0X3ZpZXdfaWR9XCJdPy5jb2x1bW5fd2lkdGg/Ll9pZF9hY3Rpb25zID09IDQ2IHRoZW4gNDcgZWxzZSA0NlxuICAgICAgICAgICAgaWYgc29ydFxuICAgICAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5zb3J0XCI6IHNvcnQsIFwic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LmNvbHVtbl93aWR0aFwiOiBjb2x1bW5fd2lkdGh9fSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uY29sdW1uX3dpZHRoXCI6IGNvbHVtbl93aWR0aH19KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBkb2MgPVxuICAgICAgICAgICAgICAgIHR5cGU6IFwidXNlclwiXG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIlxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7fVxuICAgICAgICAgICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fVxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydFxuXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpIiwiXG4vKlxuICAgIHR5cGU6IFwidXNlclwiXG4gICAgb2JqZWN0X25hbWU6IFwib2JqZWN0X2xpc3R2aWV3c1wiXG4gICAgcmVjb3JkX2lkOiBcIntvYmplY3RfbmFtZX0se2xpc3R2aWV3X2lkfVwiXG4gICAgc2V0dGluZ3M6XG4gICAgICAgIGNvbHVtbl93aWR0aDogeyBmaWVsZF9hOiAxMDAsIGZpZWxkXzI6IDE1MCB9XG4gICAgICAgIHNvcnQ6IFtbXCJmaWVsZF9hXCIsIFwiZGVzY1wiXV1cbiAgICBvd25lcjoge3VzZXJJZH1cbiAqL1xuTWV0ZW9yLm1ldGhvZHMoe1xuICBcInRhYnVsYXJfc29ydF9zZXR0aW5nc1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBzb3J0KSB7XG4gICAgdmFyIGRvYywgb2JqLCBzZXR0aW5nLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgb3duZXI6IHVzZXJJZFxuICAgIH0pO1xuICAgIGlmIChzZXR0aW5nKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IChcbiAgICAgICAgICBvYmogPSB7fSxcbiAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLnNvcnRcIl0gPSBzb3J0LFxuICAgICAgICAgIG9ialxuICAgICAgICApXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jID0ge1xuICAgICAgICB0eXBlOiBcInVzZXJcIixcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgICBzZXR0aW5nczoge30sXG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH07XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnQ7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH0sXG4gIFwidGFidWxhcl9jb2x1bW5fd2lkdGhfc2V0dGluZ3NcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoKSB7XG4gICAgdmFyIGRvYywgb2JqLCBzZXR0aW5nLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgb3duZXI6IHVzZXJJZFxuICAgIH0pO1xuICAgIGlmIChzZXR0aW5nKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IChcbiAgICAgICAgICBvYmogPSB7fSxcbiAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLmNvbHVtbl93aWR0aFwiXSA9IGNvbHVtbl93aWR0aCxcbiAgICAgICAgICBvYmpcbiAgICAgICAgKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYyA9IHtcbiAgICAgICAgdHlwZTogXCJ1c2VyXCIsXG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgICAgc2V0dGluZ3M6IHt9LFxuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aDtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpO1xuICAgIH1cbiAgfSxcbiAgXCJncmlkX3NldHRpbmdzXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbl93aWR0aCwgc29ydCkge1xuICAgIHZhciBkb2MsIG9iaiwgb2JqMSwgcmVmLCByZWYxLCBzZXR0aW5nLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiLFxuICAgICAgb3duZXI6IHVzZXJJZFxuICAgIH0pO1xuICAgIGlmIChzZXR0aW5nKSB7XG4gICAgICBjb2x1bW5fd2lkdGguX2lkX2FjdGlvbnMgPSAoKHJlZiA9IHNldHRpbmcuc2V0dGluZ3NbXCJcIiArIGxpc3Rfdmlld19pZF0pICE9IG51bGwgPyAocmVmMSA9IHJlZi5jb2x1bW5fd2lkdGgpICE9IG51bGwgPyByZWYxLl9pZF9hY3Rpb25zIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gNDYgPyA0NyA6IDQ2O1xuICAgICAgaWYgKHNvcnQpIHtcbiAgICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgICBvYmogPSB7fSxcbiAgICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuc29ydFwiXSA9IHNvcnQsXG4gICAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLmNvbHVtbl93aWR0aFwiXSA9IGNvbHVtbl93aWR0aCxcbiAgICAgICAgICAgIG9ialxuICAgICAgICAgIClcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IChcbiAgICAgICAgICAgIG9iajEgPSB7fSxcbiAgICAgICAgICAgIG9iajFbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLmNvbHVtbl93aWR0aFwiXSA9IGNvbHVtbl93aWR0aCxcbiAgICAgICAgICAgIG9iajFcbiAgICAgICAgICApXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2MgPSB7XG4gICAgICAgIHR5cGU6IFwidXNlclwiLFxuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCIsXG4gICAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge307XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5jb2x1bW5fd2lkdGggPSBjb2x1bW5fd2lkdGg7XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydDtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpO1xuICAgIH1cbiAgfVxufSk7XG4iLCJ4bWwyanMgPSByZXF1aXJlICd4bWwyanMnXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5ta2RpcnAgPSByZXF1aXJlICdta2RpcnAnXG5cbmxvZ2dlciA9IG5ldyBMb2dnZXIgJ0V4cG9ydF9UT19YTUwnXG5cbl93cml0ZVhtbEZpbGUgPSAoanNvbk9iaixvYmpOYW1lKSAtPlxuXHQjIOi9rHhtbFxuXHRidWlsZGVyID0gbmV3IHhtbDJqcy5CdWlsZGVyKClcblx0eG1sID0gYnVpbGRlci5idWlsZE9iamVjdCBqc29uT2JqXG5cblx0IyDovazkuLpidWZmZXJcblx0c3RyZWFtID0gbmV3IEJ1ZmZlciB4bWxcblxuXHQjIOagueaNruW9k+WkqeaXtumXtOeahOW5tOaciOaXpeS9nOS4uuWtmOWCqOi3r+W+hFxuXHRub3cgPSBuZXcgRGF0ZVxuXHR5ZWFyID0gbm93LmdldEZ1bGxZZWFyKClcblx0bW9udGggPSBub3cuZ2V0TW9udGgoKSArIDFcblx0ZGF5ID0gbm93LmdldERhdGUoKVxuXG5cdCMg5paH5Lu26Lev5b6EXG5cdGZpbGVQYXRoID0gcGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwnLi4vLi4vLi4vZXhwb3J0LycgKyB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBkYXkgKyAnLycgKyBvYmpOYW1lIClcblx0ZmlsZU5hbWUgPSBqc29uT2JqPy5faWQgKyBcIi54bWxcIlxuXHRmaWxlQWRkcmVzcyA9IHBhdGguam9pbiBmaWxlUGF0aCwgZmlsZU5hbWVcblxuXHRpZiAhZnMuZXhpc3RzU3luYyBmaWxlUGF0aFxuXHRcdG1rZGlycC5zeW5jIGZpbGVQYXRoXG5cblx0IyDlhpnlhaXmlofku7Zcblx0ZnMud3JpdGVGaWxlIGZpbGVBZGRyZXNzLCBzdHJlYW0sIChlcnIpIC0+XG5cdFx0aWYgZXJyXG5cdFx0XHRsb2dnZXIuZXJyb3IgXCIje2pzb25PYmouX2lkfeWGmeWFpXhtbOaWh+S7tuWksei0pVwiLGVyclxuXHRcblx0cmV0dXJuIGZpbGVQYXRoXG5cblxuIyDmlbTnkIZGaWVsZHPnmoRqc29u5pWw5o2uXG5fbWl4RmllbGRzRGF0YSA9IChvYmosb2JqTmFtZSkgLT5cblx0IyDliJ3lp4vljJblr7nosaHmlbDmja5cblx0anNvbk9iaiA9IHt9XG5cdCMg6I635Y+WZmllbGRzXG5cdG9iakZpZWxkcyA9IENyZWF0b3I/LmdldE9iamVjdChvYmpOYW1lKT8uZmllbGRzXG5cblx0bWl4RGVmYXVsdCA9IChmaWVsZF9uYW1lKS0+XG5cdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IG9ialtmaWVsZF9uYW1lXSB8fCBcIlwiXG5cblx0bWl4RGF0ZSA9IChmaWVsZF9uYW1lLHR5cGUpLT5cblx0XHRkYXRlID0gb2JqW2ZpZWxkX25hbWVdXG5cdFx0aWYgdHlwZSA9PSBcImRhdGVcIlxuXHRcdFx0Zm9ybWF0ID0gXCJZWVlZLU1NLUREXCJcblx0XHRlbHNlXG5cdFx0XHRmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW06c3NcIlxuXHRcdGlmIGRhdGU/IGFuZCBmb3JtYXQ/XG5cdFx0XHRkYXRlU3RyID0gbW9tZW50KGRhdGUpLmZvcm1hdChmb3JtYXQpXG5cdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IGRhdGVTdHIgfHwgXCJcIlxuXG5cdG1peEJvb2wgPSAoZmllbGRfbmFtZSktPlxuXHRcdGlmIG9ialtmaWVsZF9uYW1lXSA9PSB0cnVlXG5cdFx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLmmK9cIlxuXHRcdGVsc2UgaWYgb2JqW2ZpZWxkX25hbWVdID09IGZhbHNlXG5cdFx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLlkKZcIlxuXHRcdGVsc2Vcblx0XHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIlwiXG5cblx0IyDlvqrnjq/mr4/kuKpmaWVsZHMs5bm25Yik5pat5Y+W5YC8XG5cdF8uZWFjaCBvYmpGaWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdHN3aXRjaCBmaWVsZD8udHlwZVxuXHRcdFx0d2hlbiBcImRhdGVcIixcImRhdGV0aW1lXCIgdGhlbiBtaXhEYXRlIGZpZWxkX25hbWUsZmllbGQudHlwZVxuXHRcdFx0d2hlbiBcImJvb2xlYW5cIiB0aGVuIG1peEJvb2wgZmllbGRfbmFtZVxuXHRcdFx0ZWxzZSBtaXhEZWZhdWx0IGZpZWxkX25hbWVcblxuXHRyZXR1cm4ganNvbk9ialxuXG4jIOiOt+WPluWtkOihqOaVtOeQhuaVsOaNrlxuX21peFJlbGF0ZWREYXRhID0gKG9iaixvYmpOYW1lKSAtPlxuXHQjIOWIneWni+WMluWvueixoeaVsOaNrlxuXHRyZWxhdGVkX29iamVjdHMgPSB7fVxuXG5cdCMg6I635Y+W55u45YWz6KGoXG5cdHJlbGF0ZWRPYmpOYW1lcyA9IENyZWF0b3I/LmdldEFsbFJlbGF0ZWRPYmplY3RzIG9iak5hbWVcblxuXHQjIOW+queOr+ebuOWFs+ihqFxuXHRyZWxhdGVkT2JqTmFtZXMuZm9yRWFjaCAocmVsYXRlZE9iak5hbWUpIC0+XG5cdFx0IyDmr4/kuKrooajlrprkuYnkuIDkuKrlr7nosaHmlbDnu4Rcblx0XHRyZWxhdGVkVGFibGVEYXRhID0gW11cblxuXHRcdCMgKuiuvue9ruWFs+iBlOaQnOe0ouafpeivoueahOWtl+autVxuXHRcdCMg6ZmE5Lu255qE5YWz6IGU5pCc57Si5a2X5q615piv5a6a5q2755qEXG5cdFx0aWYgcmVsYXRlZE9iak5hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gXCJwYXJlbnQuaWRzXCJcblx0XHRlbHNlXG5cdFx0XHQjIOiOt+WPlmZpZWxkc1xuXHRcdFx0ZmllbGRzID0gQ3JlYXRvcj8uT2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0/LmZpZWxkc1xuXHRcdFx0IyDlvqrnjq/mr4/kuKpmaWVsZCzmib7lh7pyZWZlcmVuY2VfdG/nmoTlhbPogZTlrZfmrrVcblx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwiXCJcblx0XHRcdF8uZWFjaCBmaWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdFx0XHRpZiBmaWVsZD8ucmVmZXJlbmNlX3RvID09IG9iak5hbWVcblx0XHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSBmaWVsZF9uYW1lXG5cblx0XHQjIOagueaNruaJvuWHuueahOWFs+iBlOWtl+aute+8jOafpeWtkOihqOaVsOaNrlxuXHRcdGlmIHJlbGF0ZWRfZmllbGRfbmFtZVxuXHRcdFx0cmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iak5hbWUpXG5cdFx0XHQjIOiOt+WPluWIsOaJgOacieeahOaVsOaNrlxuXHRcdFx0cmVsYXRlZFJlY29yZExpc3QgPSByZWxhdGVkQ29sbGVjdGlvbi5maW5kKHtcIiN7cmVsYXRlZF9maWVsZF9uYW1lfVwiOm9iai5faWR9KS5mZXRjaCgpXG5cdFx0XHQjIOW+queOr+avj+S4gOadoeaVsOaNrlxuXHRcdFx0cmVsYXRlZFJlY29yZExpc3QuZm9yRWFjaCAocmVsYXRlZE9iaiktPlxuXHRcdFx0XHQjIOaVtOWQiGZpZWxkc+aVsOaNrlxuXHRcdFx0XHRmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEgcmVsYXRlZE9iaixyZWxhdGVkT2JqTmFtZVxuXHRcdFx0XHQjIOaKiuS4gOadoeiusOW9leaPkuWFpeWIsOWvueixoeaVsOe7hOS4rVxuXHRcdFx0XHRyZWxhdGVkVGFibGVEYXRhLnB1c2ggZmllbGRzRGF0YVxuXG5cdFx0IyDmiorkuIDkuKrlrZDooajnmoTmiYDmnInmlbDmja7mj5LlhaXliLByZWxhdGVkX29iamVjdHPkuK3vvIzlho3lvqrnjq/kuIvkuIDkuKpcblx0XHRyZWxhdGVkX29iamVjdHNbcmVsYXRlZE9iak5hbWVdID0gcmVsYXRlZFRhYmxlRGF0YVxuXG5cdHJldHVybiByZWxhdGVkX29iamVjdHNcblxuIyBDcmVhdG9yLkV4cG9ydDJ4bWwoKVxuQ3JlYXRvci5FeHBvcnQyeG1sID0gKG9iak5hbWUsIHJlY29yZExpc3QpIC0+XG5cdGxvZ2dlci5pbmZvIFwiUnVuIENyZWF0b3IuRXhwb3J0MnhtbFwiXG5cblx0Y29uc29sZS50aW1lIFwiQ3JlYXRvci5FeHBvcnQyeG1sXCJcblxuXHQjIOa1i+ivleaVsOaNrlxuXHQjIG9iak5hbWUgPSBcImFyY2hpdmVfcmVjb3Jkc1wiXG5cblx0IyDmn6Xmib7lr7nosaHmlbDmja5cblx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKVxuXHQjIOa1i+ivleaVsOaNrlxuXHRyZWNvcmRMaXN0ID0gY29sbGVjdGlvbi5maW5kKHt9KS5mZXRjaCgpXG5cblx0cmVjb3JkTGlzdC5mb3JFYWNoIChyZWNvcmRPYmopLT5cblx0XHRqc29uT2JqID0ge31cblx0XHRqc29uT2JqLl9pZCA9IHJlY29yZE9iai5faWRcblxuXHRcdCMg5pW055CG5Li76KGo55qERmllbGRz5pWw5o2uXG5cdFx0ZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhIHJlY29yZE9iaixvYmpOYW1lXG5cdFx0anNvbk9ialtvYmpOYW1lXSA9IGZpZWxkc0RhdGFcblxuXHRcdCMg5pW055CG55u45YWz6KGo5pWw5o2uXG5cdFx0cmVsYXRlZF9vYmplY3RzID0gX21peFJlbGF0ZWREYXRhIHJlY29yZE9iaixvYmpOYW1lXG5cblx0XHRqc29uT2JqW1wicmVsYXRlZF9vYmplY3RzXCJdID0gcmVsYXRlZF9vYmplY3RzXG5cblx0XHQjIOi9rOS4unhtbOS/neWtmOaWh+S7tlxuXHRcdGZpbGVQYXRoID0gX3dyaXRlWG1sRmlsZSBqc29uT2JqLG9iak5hbWVcblxuXHRjb25zb2xlLnRpbWVFbmQgXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIlxuXHRyZXR1cm4gZmlsZVBhdGgiLCJ2YXIgX21peEZpZWxkc0RhdGEsIF9taXhSZWxhdGVkRGF0YSwgX3dyaXRlWG1sRmlsZSwgZnMsIGxvZ2dlciwgbWtkaXJwLCBwYXRoLCB4bWwyanM7XG5cbnhtbDJqcyA9IHJlcXVpcmUoJ3htbDJqcycpO1xuXG5mcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cbnBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbm1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpO1xuXG5sb2dnZXIgPSBuZXcgTG9nZ2VyKCdFeHBvcnRfVE9fWE1MJyk7XG5cbl93cml0ZVhtbEZpbGUgPSBmdW5jdGlvbihqc29uT2JqLCBvYmpOYW1lKSB7XG4gIHZhciBidWlsZGVyLCBkYXksIGZpbGVBZGRyZXNzLCBmaWxlTmFtZSwgZmlsZVBhdGgsIG1vbnRoLCBub3csIHN0cmVhbSwgeG1sLCB5ZWFyO1xuICBidWlsZGVyID0gbmV3IHhtbDJqcy5CdWlsZGVyKCk7XG4gIHhtbCA9IGJ1aWxkZXIuYnVpbGRPYmplY3QoanNvbk9iaik7XG4gIHN0cmVhbSA9IG5ldyBCdWZmZXIoeG1sKTtcbiAgbm93ID0gbmV3IERhdGU7XG4gIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgbW9udGggPSBub3cuZ2V0TW9udGgoKSArIDE7XG4gIGRheSA9IG5vdy5nZXREYXRlKCk7XG4gIGZpbGVQYXRoID0gcGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwgJy4uLy4uLy4uL2V4cG9ydC8nICsgeWVhciArICcvJyArIG1vbnRoICsgJy8nICsgZGF5ICsgJy8nICsgb2JqTmFtZSk7XG4gIGZpbGVOYW1lID0gKGpzb25PYmogIT0gbnVsbCA/IGpzb25PYmouX2lkIDogdm9pZCAwKSArIFwiLnhtbFwiO1xuICBmaWxlQWRkcmVzcyA9IHBhdGguam9pbihmaWxlUGF0aCwgZmlsZU5hbWUpO1xuICBpZiAoIWZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XG4gICAgbWtkaXJwLnN5bmMoZmlsZVBhdGgpO1xuICB9XG4gIGZzLndyaXRlRmlsZShmaWxlQWRkcmVzcywgc3RyZWFtLCBmdW5jdGlvbihlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICByZXR1cm4gbG9nZ2VyLmVycm9yKGpzb25PYmouX2lkICsgXCLlhpnlhaV4bWzmlofku7blpLHotKVcIiwgZXJyKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmlsZVBhdGg7XG59O1xuXG5fbWl4RmllbGRzRGF0YSA9IGZ1bmN0aW9uKG9iaiwgb2JqTmFtZSkge1xuICB2YXIganNvbk9iaiwgbWl4Qm9vbCwgbWl4RGF0ZSwgbWl4RGVmYXVsdCwgb2JqRmllbGRzLCByZWY7XG4gIGpzb25PYmogPSB7fTtcbiAgb2JqRmllbGRzID0gdHlwZW9mIENyZWF0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgQ3JlYXRvciAhPT0gbnVsbCA/IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmpOYW1lKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIG1peERlZmF1bHQgPSBmdW5jdGlvbihmaWVsZF9uYW1lKSB7XG4gICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBvYmpbZmllbGRfbmFtZV0gfHwgXCJcIjtcbiAgfTtcbiAgbWl4RGF0ZSA9IGZ1bmN0aW9uKGZpZWxkX25hbWUsIHR5cGUpIHtcbiAgICB2YXIgZGF0ZSwgZGF0ZVN0ciwgZm9ybWF0O1xuICAgIGRhdGUgPSBvYmpbZmllbGRfbmFtZV07XG4gICAgaWYgKHR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICBmb3JtYXQgPSBcIllZWVktTU0tRERcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9ybWF0ID0gXCJZWVlZLU1NLUREIEhIOm1tOnNzXCI7XG4gICAgfVxuICAgIGlmICgoZGF0ZSAhPSBudWxsKSAmJiAoZm9ybWF0ICE9IG51bGwpKSB7XG4gICAgICBkYXRlU3RyID0gbW9tZW50KGRhdGUpLmZvcm1hdChmb3JtYXQpO1xuICAgIH1cbiAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IGRhdGVTdHIgfHwgXCJcIjtcbiAgfTtcbiAgbWl4Qm9vbCA9IGZ1bmN0aW9uKGZpZWxkX25hbWUpIHtcbiAgICBpZiAob2JqW2ZpZWxkX25hbWVdID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5pivXCI7XG4gICAgfSBlbHNlIGlmIChvYmpbZmllbGRfbmFtZV0gPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5ZCmXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gXCJcIjtcbiAgICB9XG4gIH07XG4gIF8uZWFjaChvYmpGaWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgc3dpdGNoIChmaWVsZCAhPSBudWxsID8gZmllbGQudHlwZSA6IHZvaWQgMCkge1xuICAgICAgY2FzZSBcImRhdGVcIjpcbiAgICAgIGNhc2UgXCJkYXRldGltZVwiOlxuICAgICAgICByZXR1cm4gbWl4RGF0ZShmaWVsZF9uYW1lLCBmaWVsZC50eXBlKTtcbiAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgIHJldHVybiBtaXhCb29sKGZpZWxkX25hbWUpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG1peERlZmF1bHQoZmllbGRfbmFtZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGpzb25PYmo7XG59O1xuXG5fbWl4UmVsYXRlZERhdGEgPSBmdW5jdGlvbihvYmosIG9iak5hbWUpIHtcbiAgdmFyIHJlbGF0ZWRPYmpOYW1lcywgcmVsYXRlZF9vYmplY3RzO1xuICByZWxhdGVkX29iamVjdHMgPSB7fTtcbiAgcmVsYXRlZE9iak5hbWVzID0gdHlwZW9mIENyZWF0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgQ3JlYXRvciAhPT0gbnVsbCA/IENyZWF0b3IuZ2V0QWxsUmVsYXRlZE9iamVjdHMob2JqTmFtZSkgOiB2b2lkIDA7XG4gIHJlbGF0ZWRPYmpOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKHJlbGF0ZWRPYmpOYW1lKSB7XG4gICAgdmFyIGZpZWxkcywgb2JqMSwgcmVmLCByZWxhdGVkQ29sbGVjdGlvbiwgcmVsYXRlZFJlY29yZExpc3QsIHJlbGF0ZWRUYWJsZURhdGEsIHJlbGF0ZWRfZmllbGRfbmFtZTtcbiAgICByZWxhdGVkVGFibGVEYXRhID0gW107XG4gICAgaWYgKHJlbGF0ZWRPYmpOYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSBcInBhcmVudC5pZHNcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZmllbGRzID0gdHlwZW9mIENyZWF0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgQ3JlYXRvciAhPT0gbnVsbCA/IChyZWYgPSBDcmVhdG9yLk9iamVjdHNbcmVsYXRlZE9iak5hbWVdKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwiXCI7XG4gICAgICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgICAgICBpZiAoKGZpZWxkICE9IG51bGwgPyBmaWVsZC5yZWZlcmVuY2VfdG8gOiB2b2lkIDApID09PSBvYmpOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfZmllbGRfbmFtZSA9IGZpZWxkX25hbWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAocmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICByZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqTmFtZSk7XG4gICAgICByZWxhdGVkUmVjb3JkTGlzdCA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoKFxuICAgICAgICBvYmoxID0ge30sXG4gICAgICAgIG9iajFbXCJcIiArIHJlbGF0ZWRfZmllbGRfbmFtZV0gPSBvYmouX2lkLFxuICAgICAgICBvYmoxXG4gICAgICApKS5mZXRjaCgpO1xuICAgICAgcmVsYXRlZFJlY29yZExpc3QuZm9yRWFjaChmdW5jdGlvbihyZWxhdGVkT2JqKSB7XG4gICAgICAgIHZhciBmaWVsZHNEYXRhO1xuICAgICAgICBmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEocmVsYXRlZE9iaiwgcmVsYXRlZE9iak5hbWUpO1xuICAgICAgICByZXR1cm4gcmVsYXRlZFRhYmxlRGF0YS5wdXNoKGZpZWxkc0RhdGEpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZWxhdGVkX29iamVjdHNbcmVsYXRlZE9iak5hbWVdID0gcmVsYXRlZFRhYmxlRGF0YTtcbiAgfSk7XG4gIHJldHVybiByZWxhdGVkX29iamVjdHM7XG59O1xuXG5DcmVhdG9yLkV4cG9ydDJ4bWwgPSBmdW5jdGlvbihvYmpOYW1lLCByZWNvcmRMaXN0KSB7XG4gIHZhciBjb2xsZWN0aW9uO1xuICBsb2dnZXIuaW5mbyhcIlJ1biBDcmVhdG9yLkV4cG9ydDJ4bWxcIik7XG4gIGNvbnNvbGUudGltZShcIkNyZWF0b3IuRXhwb3J0MnhtbFwiKTtcbiAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKTtcbiAgcmVjb3JkTGlzdCA9IGNvbGxlY3Rpb24uZmluZCh7fSkuZmV0Y2goKTtcbiAgcmVjb3JkTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHJlY29yZE9iaikge1xuICAgIHZhciBmaWVsZHNEYXRhLCBmaWxlUGF0aCwganNvbk9iaiwgcmVsYXRlZF9vYmplY3RzO1xuICAgIGpzb25PYmogPSB7fTtcbiAgICBqc29uT2JqLl9pZCA9IHJlY29yZE9iai5faWQ7XG4gICAgZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhKHJlY29yZE9iaiwgb2JqTmFtZSk7XG4gICAganNvbk9ialtvYmpOYW1lXSA9IGZpZWxkc0RhdGE7XG4gICAgcmVsYXRlZF9vYmplY3RzID0gX21peFJlbGF0ZWREYXRhKHJlY29yZE9iaiwgb2JqTmFtZSk7XG4gICAganNvbk9ialtcInJlbGF0ZWRfb2JqZWN0c1wiXSA9IHJlbGF0ZWRfb2JqZWN0cztcbiAgICByZXR1cm4gZmlsZVBhdGggPSBfd3JpdGVYbWxGaWxlKGpzb25PYmosIG9iak5hbWUpO1xuICB9KTtcbiAgY29uc29sZS50aW1lRW5kKFwiQ3JlYXRvci5FeHBvcnQyeG1sXCIpO1xuICByZXR1cm4gZmlsZVBhdGg7XG59O1xuIiwiTWV0ZW9yLm1ldGhvZHMgXG5cdHJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzOiAob2JqZWN0X25hbWUsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZUlkKS0+XG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcblx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIlxuXHRcdFx0c2VsZWN0b3IgPSB7XCJtZXRhZGF0YS5zcGFjZVwiOiBzcGFjZUlkfVxuXHRcdGVsc2Vcblx0XHRcdHNlbGVjdG9yID0ge3NwYWNlOiBzcGFjZUlkfVxuXHRcdFxuXHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0IyDpmYTku7bnmoTlhbPogZTmkJzntKLmnaHku7bmmK/lrprmrbvnmoRcblx0XHRcdHNlbGVjdG9yW1wicGFyZW50Lm9cIl0gPSBvYmplY3RfbmFtZVxuXHRcdFx0c2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF1cblx0XHRlbHNlXG5cdFx0XHRzZWxlY3RvcltyZWxhdGVkX2ZpZWxkX25hbWVdID0gcmVjb3JkX2lkXG5cblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRcdGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMuYWxsb3dSZWFkXG5cdFx0XHRzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxuXHRcdFxuXHRcdHJlbGF0ZWRfcmVjb3JkcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKVxuXHRcdHJldHVybiByZWxhdGVkX3JlY29yZHMuY291bnQoKSIsIk1ldGVvci5tZXRob2RzKHtcbiAgcmVsYXRlZF9vYmplY3RzX3JlY29yZHM6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCkge1xuICAgIHZhciBwZXJtaXNzaW9ucywgcmVsYXRlZF9yZWNvcmRzLCBzZWxlY3RvciwgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICBcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWRcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIHNlbGVjdG9yW1wicGFyZW50Lm9cIl0gPSBvYmplY3RfbmFtZTtcbiAgICAgIHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3RvcltyZWxhdGVkX2ZpZWxkX25hbWVdID0gcmVjb3JkX2lkO1xuICAgIH1cbiAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgICBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLmFsbG93UmVhZCkge1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgfVxuICAgIHJlbGF0ZWRfcmVjb3JkcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVsYXRlZF9yZWNvcmRzLmNvdW50KCk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0Z2V0UGVuZGluZ1NwYWNlSW5mbzogKGludml0ZXJJZCwgc3BhY2VJZCktPlxuXHRcdGludml0ZXJOYW1lID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBpbnZpdGVySWR9KS5uYW1lXG5cdFx0c3BhY2VOYW1lID0gZGIuc3BhY2VzLmZpbmRPbmUoe19pZDogc3BhY2VJZH0pLm5hbWVcblxuXHRcdHJldHVybiB7aW52aXRlcjogaW52aXRlck5hbWUsIHNwYWNlOiBzcGFjZU5hbWV9XG5cblx0cmVmdXNlSm9pblNwYWNlOiAoX2lkKS0+XG5cdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBfaWR9LHskc2V0OiB7aW52aXRlX3N0YXRlOiBcInJlZnVzZWRcIn19KVxuXG5cdGFjY2VwdEpvaW5TcGFjZTogKF9pZCktPlxuXHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogX2lkfSx7JHNldDoge2ludml0ZV9zdGF0ZTogXCJhY2NlcHRlZFwiLCB1c2VyX2FjY2VwdGVkOiB0cnVlfX0pXG5cbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgZ2V0UGVuZGluZ1NwYWNlSW5mbzogZnVuY3Rpb24oaW52aXRlcklkLCBzcGFjZUlkKSB7XG4gICAgdmFyIGludml0ZXJOYW1lLCBzcGFjZU5hbWU7XG4gICAgaW52aXRlck5hbWUgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogaW52aXRlcklkXG4gICAgfSkubmFtZTtcbiAgICBzcGFjZU5hbWUgPSBkYi5zcGFjZXMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHNwYWNlSWRcbiAgICB9KS5uYW1lO1xuICAgIHJldHVybiB7XG4gICAgICBpbnZpdGVyOiBpbnZpdGVyTmFtZSxcbiAgICAgIHNwYWNlOiBzcGFjZU5hbWVcbiAgICB9O1xuICB9LFxuICByZWZ1c2VKb2luU3BhY2U6IGZ1bmN0aW9uKF9pZCkge1xuICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBpbnZpdGVfc3RhdGU6IFwicmVmdXNlZFwiXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIGFjY2VwdEpvaW5TcGFjZTogZnVuY3Rpb24oX2lkKSB7XG4gICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGludml0ZV9zdGF0ZTogXCJhY2NlcHRlZFwiLFxuICAgICAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggXCJjcmVhdG9yX29iamVjdF9yZWNvcmRcIiwgKG9iamVjdF9uYW1lLCBpZCwgc3BhY2VfaWQpLT5cblx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpXG5cdGlmIGNvbGxlY3Rpb25cblx0XHRyZXR1cm4gY29sbGVjdGlvbi5maW5kKHtfaWQ6IGlkfSlcblxuIiwiTWV0ZW9yLnB1Ymxpc2goXCJjcmVhdG9yX29iamVjdF9yZWNvcmRcIiwgZnVuY3Rpb24ob2JqZWN0X25hbWUsIGlkLCBzcGFjZV9pZCkge1xuICB2YXIgY29sbGVjdGlvbjtcbiAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpO1xuICBpZiAoY29sbGVjdGlvbikge1xuICAgIHJldHVybiBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgX2lkOiBpZFxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoQ29tcG9zaXRlIFwic3RlZWRvc19vYmplY3RfdGFidWxhclwiLCAodGFibGVOYW1lLCBpZHMsIGZpZWxkcywgc3BhY2VJZCktPlxuXHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0Y2hlY2sodGFibGVOYW1lLCBTdHJpbmcpO1xuXHRjaGVjayhpZHMsIEFycmF5KTtcblx0Y2hlY2soZmllbGRzLCBNYXRjaC5PcHRpb25hbChPYmplY3QpKTtcblxuXHRfb2JqZWN0X25hbWUgPSB0YWJsZU5hbWUucmVwbGFjZShcImNyZWF0b3JfXCIsXCJcIilcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9vYmplY3RfbmFtZSwgc3BhY2VJZClcblxuXHRpZiBzcGFjZUlkXG5cdFx0X29iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRPYmplY3ROYW1lKF9vYmplY3QpXG5cblx0b2JqZWN0X2NvbGxlY2l0b24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oX29iamVjdF9uYW1lKVxuXG5cblx0X2ZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xuXHRpZiAhX2ZpZWxkcyB8fCAhb2JqZWN0X2NvbGxlY2l0b25cblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0cmVmZXJlbmNlX2ZpZWxkcyA9IF8uZmlsdGVyIF9maWVsZHMsIChmKS0+XG5cdFx0cmV0dXJuIF8uaXNGdW5jdGlvbihmLnJlZmVyZW5jZV90bykgfHwgIV8uaXNFbXB0eShmLnJlZmVyZW5jZV90bylcblxuXHRzZWxmID0gdGhpc1xuXG5cdHNlbGYudW5ibG9jaygpO1xuXG5cdGlmIHJlZmVyZW5jZV9maWVsZHMubGVuZ3RoID4gMFxuXHRcdGRhdGEgPSB7XG5cdFx0XHRmaW5kOiAoKS0+XG5cdFx0XHRcdHNlbGYudW5ibG9jaygpO1xuXHRcdFx0XHRmaWVsZF9rZXlzID0ge31cblx0XHRcdFx0Xy5lYWNoIF8ua2V5cyhmaWVsZHMpLCAoZiktPlxuXHRcdFx0XHRcdHVubGVzcyAvXFx3KyhcXC5cXCQpezF9XFx3Py8udGVzdChmKVxuXHRcdFx0XHRcdFx0ZmllbGRfa2V5c1tmXSA9IDFcblx0XHRcdFx0XG5cdFx0XHRcdHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtfaWQ6IHskaW46IGlkc319LCB7ZmllbGRzOiBmaWVsZF9rZXlzfSk7XG5cdFx0fVxuXG5cdFx0ZGF0YS5jaGlsZHJlbiA9IFtdXG5cblx0XHRrZXlzID0gXy5rZXlzKGZpZWxkcylcblxuXHRcdGlmIGtleXMubGVuZ3RoIDwgMVxuXHRcdFx0a2V5cyA9IF8ua2V5cyhfZmllbGRzKVxuXG5cdFx0X2tleXMgPSBbXVxuXG5cdFx0a2V5cy5mb3JFYWNoIChrZXkpLT5cblx0XHRcdGlmIF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ11cblx0XHRcdFx0X2tleXMgPSBfa2V5cy5jb25jYXQoXy5tYXAoX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXSwgKGspLT5cblx0XHRcdFx0XHRyZXR1cm4ga2V5ICsgJy4nICsga1xuXHRcdFx0XHQpKVxuXHRcdFx0X2tleXMucHVzaChrZXkpXG5cblx0XHRfa2V5cy5mb3JFYWNoIChrZXkpLT5cblx0XHRcdHJlZmVyZW5jZV9maWVsZCA9IF9maWVsZHNba2V5XVxuXG5cdFx0XHRpZiByZWZlcmVuY2VfZmllbGQgJiYgKF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pKSAgIyBhbmQgQ3JlYXRvci5Db2xsZWN0aW9uc1tyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvXVxuXHRcdFx0XHRkYXRhLmNoaWxkcmVuLnB1c2gge1xuXHRcdFx0XHRcdGZpbmQ6IChwYXJlbnQpIC0+XG5cdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0c2VsZi51bmJsb2NrKCk7XG5cblx0XHRcdFx0XHRcdFx0cXVlcnkgPSB7fVxuXG5cdFx0XHRcdFx0XHRcdCMg6KGo5qC85a2Q5a2X5q6154m55q6K5aSE55CGXG5cdFx0XHRcdFx0XHRcdGlmIC9cXHcrKFxcLlxcJFxcLil7MX1cXHcrLy50ZXN0KGtleSlcblx0XHRcdFx0XHRcdFx0XHRwX2sgPSBrZXkucmVwbGFjZSgvKFxcdyspXFwuXFwkXFwuXFx3Ky9pZywgXCIkMVwiKVxuXHRcdFx0XHRcdFx0XHRcdHNfayA9IGtleS5yZXBsYWNlKC9cXHcrXFwuXFwkXFwuKFxcdyspL2lnLCBcIiQxXCIpXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX2lkcyA9IHBhcmVudFtwX2tdLmdldFByb3BlcnR5KHNfaylcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV9pZHMgPSBrZXkuc3BsaXQoJy4nKS5yZWR1Y2UgKG8sIHgpIC0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG8/W3hdXG5cdFx0XHRcdFx0XHRcdFx0LCBwYXJlbnRcblxuXHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRcdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8oKVxuXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShyZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdFx0aWYgXy5pc09iamVjdChyZWZlcmVuY2VfaWRzKSAmJiAhXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpXG5cdFx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfaWRzLm9cblx0XHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV9pZHMgPSByZWZlcmVuY2VfaWRzLmlkcyB8fCBbXVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBbXVxuXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShyZWZlcmVuY2VfaWRzKVxuXHRcdFx0XHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHskaW46IHJlZmVyZW5jZV9pZHN9XG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRxdWVyeS5faWQgPSByZWZlcmVuY2VfaWRzXG5cblx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlZmVyZW5jZV90bywgc3BhY2VJZClcblxuXHRcdFx0XHRcdFx0XHRuYW1lX2ZpZWxkX2tleSA9IHJlZmVyZW5jZV90b19vYmplY3QuTkFNRV9GSUVMRF9LRVlcblxuXHRcdFx0XHRcdFx0XHRjaGlsZHJlbl9maWVsZHMgPSB7X2lkOiAxLCBzcGFjZTogMX1cblxuXHRcdFx0XHRcdFx0XHRpZiBuYW1lX2ZpZWxkX2tleVxuXHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuX2ZpZWxkc1tuYW1lX2ZpZWxkX2tleV0gPSAxXG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8sIHNwYWNlSWQpLmZpbmQocXVlcnksIHtcblx0XHRcdFx0XHRcdFx0XHRmaWVsZHM6IGNoaWxkcmVuX2ZpZWxkc1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGNhdGNoIGVcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2cocmVmZXJlbmNlX3RvLCBwYXJlbnQsIGUpXG5cdFx0XHRcdFx0XHRcdHJldHVybiBbXVxuXHRcdFx0XHR9XG5cblx0XHRyZXR1cm4gZGF0YVxuXHRlbHNlXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZpbmQ6ICgpLT5cblx0XHRcdFx0c2VsZi51bmJsb2NrKCk7XG5cdFx0XHRcdHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtfaWQ6IHskaW46IGlkc319LCB7ZmllbGRzOiBmaWVsZHN9KVxuXHRcdH07XG5cbiIsIk1ldGVvci5wdWJsaXNoQ29tcG9zaXRlKFwic3RlZWRvc19vYmplY3RfdGFidWxhclwiLCBmdW5jdGlvbih0YWJsZU5hbWUsIGlkcywgZmllbGRzLCBzcGFjZUlkKSB7XG4gIHZhciBfZmllbGRzLCBfa2V5cywgX29iamVjdCwgX29iamVjdF9uYW1lLCBkYXRhLCBrZXlzLCBvYmplY3RfY29sbGVjaXRvbiwgcmVmZXJlbmNlX2ZpZWxkcywgc2VsZjtcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgY2hlY2sodGFibGVOYW1lLCBTdHJpbmcpO1xuICBjaGVjayhpZHMsIEFycmF5KTtcbiAgY2hlY2soZmllbGRzLCBNYXRjaC5PcHRpb25hbChPYmplY3QpKTtcbiAgX29iamVjdF9uYW1lID0gdGFibGVOYW1lLnJlcGxhY2UoXCJjcmVhdG9yX1wiLCBcIlwiKTtcbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9vYmplY3RfbmFtZSwgc3BhY2VJZCk7XG4gIGlmIChzcGFjZUlkKSB7XG4gICAgX29iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRPYmplY3ROYW1lKF9vYmplY3QpO1xuICB9XG4gIG9iamVjdF9jb2xsZWNpdG9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKF9vYmplY3RfbmFtZSk7XG4gIF9maWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgaWYgKCFfZmllbGRzIHx8ICFvYmplY3RfY29sbGVjaXRvbikge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmVmZXJlbmNlX2ZpZWxkcyA9IF8uZmlsdGVyKF9maWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKGYucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KGYucmVmZXJlbmNlX3RvKTtcbiAgfSk7XG4gIHNlbGYgPSB0aGlzO1xuICBzZWxmLnVuYmxvY2soKTtcbiAgaWYgKHJlZmVyZW5jZV9maWVsZHMubGVuZ3RoID4gMCkge1xuICAgIGRhdGEgPSB7XG4gICAgICBmaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZpZWxkX2tleXM7XG4gICAgICAgIHNlbGYudW5ibG9jaygpO1xuICAgICAgICBmaWVsZF9rZXlzID0ge307XG4gICAgICAgIF8uZWFjaChfLmtleXMoZmllbGRzKSwgZnVuY3Rpb24oZikge1xuICAgICAgICAgIGlmICghL1xcdysoXFwuXFwkKXsxfVxcdz8vLnRlc3QoZikpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZF9rZXlzW2ZdID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb2JqZWN0X2NvbGxlY2l0b24uZmluZCh7XG4gICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAkaW46IGlkc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogZmllbGRfa2V5c1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGRhdGEuY2hpbGRyZW4gPSBbXTtcbiAgICBrZXlzID0gXy5rZXlzKGZpZWxkcyk7XG4gICAgaWYgKGtleXMubGVuZ3RoIDwgMSkge1xuICAgICAga2V5cyA9IF8ua2V5cyhfZmllbGRzKTtcbiAgICB9XG4gICAgX2tleXMgPSBbXTtcbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXSkge1xuICAgICAgICBfa2V5cyA9IF9rZXlzLmNvbmNhdChfLm1hcChfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddLCBmdW5jdGlvbihrKSB7XG4gICAgICAgICAgcmV0dXJuIGtleSArICcuJyArIGs7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfa2V5cy5wdXNoKGtleSk7XG4gICAgfSk7XG4gICAgX2tleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciByZWZlcmVuY2VfZmllbGQ7XG4gICAgICByZWZlcmVuY2VfZmllbGQgPSBfZmllbGRzW2tleV07XG4gICAgICBpZiAocmVmZXJlbmNlX2ZpZWxkICYmIChfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykgfHwgIV8uaXNFbXB0eShyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuY2hpbGRyZW4ucHVzaCh7XG4gICAgICAgICAgZmluZDogZnVuY3Rpb24ocGFyZW50KSB7XG4gICAgICAgICAgICB2YXIgY2hpbGRyZW5fZmllbGRzLCBlLCBuYW1lX2ZpZWxkX2tleSwgcF9rLCBxdWVyeSwgcmVmZXJlbmNlX2lkcywgcmVmZXJlbmNlX3RvLCByZWZlcmVuY2VfdG9fb2JqZWN0LCBzX2s7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBzZWxmLnVuYmxvY2soKTtcbiAgICAgICAgICAgICAgcXVlcnkgPSB7fTtcbiAgICAgICAgICAgICAgaWYgKC9cXHcrKFxcLlxcJFxcLil7MX1cXHcrLy50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICBwX2sgPSBrZXkucmVwbGFjZSgvKFxcdyspXFwuXFwkXFwuXFx3Ky9pZywgXCIkMVwiKTtcbiAgICAgICAgICAgICAgICBzX2sgPSBrZXkucmVwbGFjZSgvXFx3K1xcLlxcJFxcLihcXHcrKS9pZywgXCIkMVwiKTtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VfaWRzID0gcGFyZW50W3Bfa10uZ2V0UHJvcGVydHkoc19rKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VfaWRzID0ga2V5LnNwbGl0KCcuJykucmVkdWNlKGZ1bmN0aW9uKG8sIHgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBvICE9IG51bGwgPyBvW3hdIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgIH0sIHBhcmVudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKF8uaXNBcnJheShyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QocmVmZXJlbmNlX2lkcykgJiYgIV8uaXNBcnJheShyZWZlcmVuY2VfaWRzKSkge1xuICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX2lkcy5vO1xuICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlX2lkcyA9IHJlZmVyZW5jZV9pZHMuaWRzIHx8IFtdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChfLmlzQXJyYXkocmVmZXJlbmNlX2lkcykpIHtcbiAgICAgICAgICAgICAgICBxdWVyeS5faWQgPSB7XG4gICAgICAgICAgICAgICAgICAkaW46IHJlZmVyZW5jZV9pZHNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHF1ZXJ5Ll9pZCA9IHJlZmVyZW5jZV9pZHM7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlZmVyZW5jZV90bywgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIG5hbWVfZmllbGRfa2V5ID0gcmVmZXJlbmNlX3RvX29iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgICAgICAgICAgICAgY2hpbGRyZW5fZmllbGRzID0ge1xuICAgICAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgICAgICBzcGFjZTogMVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBpZiAobmFtZV9maWVsZF9rZXkpIHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbl9maWVsZHNbbmFtZV9maWVsZF9rZXldID0gMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZChxdWVyeSwge1xuICAgICAgICAgICAgICAgIGZpZWxkczogY2hpbGRyZW5fZmllbGRzXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZWZlcmVuY2VfdG8sIHBhcmVudCwgZSk7XG4gICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBmaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICAgIHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtcbiAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICRpbjogaWRzXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBmaWVsZHNcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufSk7XG4iLCJNZXRlb3IucHVibGlzaCBcIm9iamVjdF9saXN0dmlld3NcIiwgKG9iamVjdF9uYW1lLCBzcGFjZUlkKS0+XG4gICAgdXNlcklkID0gdGhpcy51c2VySWRcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNwYWNlOiBzcGFjZUlkICxcIiRvclwiOlt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XX0pIiwiTWV0ZW9yLnB1Ymxpc2ggXCJ1c2VyX3RhYnVsYXJfc2V0dGluZ3NcIiwgKG9iamVjdF9uYW1lKS0+XG4gICAgdXNlcklkID0gdGhpcy51c2VySWRcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kKHtvYmplY3RfbmFtZTogeyRpbjogb2JqZWN0X25hbWV9LCByZWNvcmRfaWQ6IHskaW46IFtcIm9iamVjdF9saXN0dmlld3NcIiwgXCJvYmplY3RfZ3JpZHZpZXdzXCJdfSwgb3duZXI6IHVzZXJJZH0pXG4iLCJNZXRlb3IucHVibGlzaCBcInJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzXCIsIChvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpLT5cblx0dXNlcklkID0gdGhpcy51c2VySWRcblx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJcblx0XHRzZWxlY3RvciA9IHtcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWR9XG5cdGVsc2Vcblx0XHRzZWxlY3RvciA9IHtzcGFjZTogc3BhY2VJZH1cblx0XG5cdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdCMg6ZmE5Lu255qE5YWz6IGU5pCc57Si5p2h5Lu25piv5a6a5q2755qEXG5cdFx0c2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lXG5cdFx0c2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF1cblx0ZWxzZVxuXHRcdHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWRcblxuXHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLmFsbG93UmVhZFxuXHRcdHNlbGVjdG9yLm93bmVyID0gdXNlcklkXG5cdFxuXHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpIiwiTWV0ZW9yLnB1Ymxpc2goXCJyZWxhdGVkX29iamVjdHNfcmVjb3Jkc1wiLCBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpIHtcbiAgdmFyIHBlcm1pc3Npb25zLCBzZWxlY3RvciwgdXNlcklkO1xuICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIikge1xuICAgIHNlbGVjdG9yID0ge1xuICAgICAgXCJtZXRhZGF0YS5zcGFjZVwiOiBzcGFjZUlkXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfTtcbiAgfVxuICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIikge1xuICAgIHNlbGVjdG9yW1wicGFyZW50Lm9cIl0gPSBvYmplY3RfbmFtZTtcbiAgICBzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXTtcbiAgfSBlbHNlIHtcbiAgICBzZWxlY3RvcltyZWxhdGVkX2ZpZWxkX25hbWVdID0gcmVjb3JkX2lkO1xuICB9XG4gIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLmFsbG93UmVhZCkge1xuICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICB9XG4gIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvcik7XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoICdzcGFjZV91c2VyX2luZm8nLCAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSkiLCJcbmlmIE1ldGVvci5pc1NlcnZlclxuXG5cdE1ldGVvci5wdWJsaXNoICdjb250YWN0c192aWV3X2xpbWl0cycsIChzcGFjZUlkKS0+XG5cblx0XHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRcdHVubGVzcyBzcGFjZUlkXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0XHRzZWxlY3RvciA9XG5cdFx0XHRzcGFjZTogc3BhY2VJZFxuXHRcdFx0a2V5OiAnY29udGFjdHNfdmlld19saW1pdHMnXG5cblx0XHRyZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3RvcikiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdjb250YWN0c192aWV3X2xpbWl0cycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAga2V5OiAnY29udGFjdHNfdmlld19saW1pdHMnXG4gICAgfTtcbiAgICByZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3Rvcik7XG4gIH0pO1xufVxuIiwiXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblxuXHRNZXRlb3IucHVibGlzaCAnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnLCAoc3BhY2VJZCktPlxuXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0XHR1bmxlc3Mgc3BhY2VJZFxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdFx0c2VsZWN0b3IgPVxuXHRcdFx0c3BhY2U6IHNwYWNlSWRcblx0XHRcdGtleTogJ2NvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzJ1xuXG5cdFx0cmV0dXJuIGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoc2VsZWN0b3IpIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIHNlbGVjdG9yO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIGtleTogJ2NvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzJ1xuICAgIH07XG4gICAgcmV0dXJuIGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoc2VsZWN0b3IpO1xuICB9KTtcbn1cbiIsImlmIE1ldGVvci5pc1NlcnZlclxuXHRNZXRlb3IucHVibGlzaCAnc3BhY2VfbmVlZF90b19jb25maXJtJywgKCktPlxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXG5cdFx0cmV0dXJuIGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHVzZXJJZCwgaW52aXRlX3N0YXRlOiBcInBlbmRpbmdcIn0pIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnc3BhY2VfbmVlZF90b19jb25maXJtJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBpbnZpdGVfc3RhdGU6IFwicGVuZGluZ1wiXG4gICAgfSk7XG4gIH0pO1xufVxuIiwicGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwgPSB7fVxuXG5wZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93UGVybWlzc2lvbnMgPSAoZmxvd19pZCwgdXNlcl9pZCkgLT5cblx0IyDmoLnmja46Zmxvd19pZOafpeWIsOWvueW6lOeahGZsb3dcblx0ZmxvdyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyhmbG93X2lkKVxuXHRzcGFjZV9pZCA9IGZsb3cuc3BhY2Vcblx0IyDmoLnmja5zcGFjZV9pZOWSjDp1c2VyX2lk5Yiwb3JnYW5pemF0aW9uc+ihqOS4reafpeWIsOeUqOaIt+aJgOWxnuaJgOacieeahG9yZ19pZO+8iOWMheaLrOS4iue6p+e7hElE77yJXG5cdG9yZ19pZHMgPSBuZXcgQXJyYXlcblx0b3JnYW5pemF0aW9ucyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG5cdFx0c3BhY2U6IHNwYWNlX2lkLCB1c2VyczogdXNlcl9pZCB9LCB7IGZpZWxkczogeyBwYXJlbnRzOiAxIH0gfSkuZmV0Y2goKVxuXHRfLmVhY2gob3JnYW5pemF0aW9ucywgKG9yZykgLT5cblx0XHRvcmdfaWRzLnB1c2gob3JnLl9pZClcblx0XHRpZiBvcmcucGFyZW50c1xuXHRcdFx0Xy5lYWNoKG9yZy5wYXJlbnRzLCAocGFyZW50X2lkKSAtPlxuXHRcdFx0XHRvcmdfaWRzLnB1c2gocGFyZW50X2lkKVxuXHRcdFx0KVxuXHQpXG5cdG9yZ19pZHMgPSBfLnVuaXEob3JnX2lkcylcblx0bXlfcGVybWlzc2lvbnMgPSBuZXcgQXJyYXlcblx0aWYgZmxvdy5wZXJtc1xuXHRcdCMg5Yik5patZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW7kuK3mmK/lkKbljIXlkKvlvZPliY3nlKjmiLfvvIxcblx0XHQjIOaIluiAhWZsb3cucGVybXMub3Jnc19jYW5fYWRk5piv5ZCm5YyF5ZCrNOatpeW+l+WIsOeahG9yZ19pZOaVsOe7hOS4reeahOS7u+S9leS4gOS4qu+8jFxuXHRcdCMg6Iul5piv77yM5YiZ5Zyo6L+U5Zue55qE5pWw57uE5Lit5Yqg5LiKYWRkXG5cdFx0aWYgZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRkXG5cdFx0XHR1c2Vyc19jYW5fYWRkID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRkXG5cdFx0XHRpZiB1c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJfaWQpXG5cdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJhZGRcIilcblxuXHRcdGlmIGZsb3cucGVybXMub3Jnc19jYW5fYWRkXG5cdFx0XHRvcmdzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZFxuXHRcdFx0Xy5lYWNoKG9yZ19pZHMsIChvcmdfaWQpIC0+XG5cdFx0XHRcdGlmIG9yZ3NfY2FuX2FkZC5pbmNsdWRlcyhvcmdfaWQpXG5cdFx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKVxuXHRcdFx0KVxuXHRcdCMg5Yik5patZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvcuS4reaYr+WQpuWMheWQq+W9k+WJjeeUqOaIt++8jFxuXHRcdCMg5oiW6ICFZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9y5piv5ZCm5YyF5ZCrNOatpeW+l+WIsOeahG9yZ19pZOaVsOe7hOS4reeahOS7u+S9leS4gOS4qu+8jFxuXHRcdCMg6Iul5piv77yM5YiZ5Zyo6L+U5Zue55qE5pWw57uE5Lit5Yqg5LiKbW9uaXRvclxuXHRcdGlmIGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3Jcblx0XHRcdHVzZXJzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvclxuXHRcdFx0aWYgdXNlcnNfY2FuX21vbml0b3IuaW5jbHVkZXModXNlcl9pZClcblx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIilcblxuXHRcdGlmIGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvclxuXHRcdFx0b3Jnc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvclxuXHRcdFx0Xy5lYWNoKG9yZ19pZHMsIChvcmdfaWQpIC0+XG5cdFx0XHRcdGlmIG9yZ3NfY2FuX21vbml0b3IuaW5jbHVkZXMob3JnX2lkKVxuXHRcdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJtb25pdG9yXCIpXG5cdFx0XHQpXG5cdFx0IyDliKTmlq1mbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbuS4reaYr+WQpuWMheWQq+W9k+WJjeeUqOaIt++8jFxuXHRcdCMg5oiW6ICFZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pbuaYr+WQpuWMheWQqzTmraXlvpfliLDnmoRvcmdfaWTmlbDnu4TkuK3nmoTku7vkvZXkuIDkuKrvvIxcblx0XHQjIOiLpeaYr++8jOWImeWcqOi/lOWbnueahOaVsOe7hOS4reWKoOS4imFkbWluXG5cdFx0aWYgZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW5cblx0XHRcdHVzZXJzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluXG5cdFx0XHRpZiB1c2Vyc19jYW5fYWRtaW4uaW5jbHVkZXModXNlcl9pZClcblx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkbWluXCIpXG5cblx0XHRpZiBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluXG5cdFx0XHRvcmdzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW5cblx0XHRcdF8uZWFjaChvcmdfaWRzLCAob3JnX2lkKSAtPlxuXHRcdFx0XHRpZiBvcmdzX2Nhbl9hZG1pbi5pbmNsdWRlcyhvcmdfaWQpXG5cdFx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkbWluXCIpXG5cdFx0XHQpXG5cblx0bXlfcGVybWlzc2lvbnMgPSBfLnVuaXEobXlfcGVybWlzc2lvbnMpXG5cdHJldHVybiBteV9wZXJtaXNzaW9ucyIsIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxucGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwgPSB7fTtcblxucGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rmxvd1Blcm1pc3Npb25zID0gZnVuY3Rpb24oZmxvd19pZCwgdXNlcl9pZCkge1xuICB2YXIgZmxvdywgbXlfcGVybWlzc2lvbnMsIG9yZ19pZHMsIG9yZ2FuaXphdGlvbnMsIG9yZ3NfY2FuX2FkZCwgb3Jnc19jYW5fYWRtaW4sIG9yZ3NfY2FuX21vbml0b3IsIHNwYWNlX2lkLCB1c2Vyc19jYW5fYWRkLCB1c2Vyc19jYW5fYWRtaW4sIHVzZXJzX2Nhbl9tb25pdG9yO1xuICBmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpO1xuICBzcGFjZV9pZCA9IGZsb3cuc3BhY2U7XG4gIG9yZ19pZHMgPSBuZXcgQXJyYXk7XG4gIG9yZ2FuaXphdGlvbnMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB1c2VyczogdXNlcl9pZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBwYXJlbnRzOiAxXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBfLmVhY2gob3JnYW5pemF0aW9ucywgZnVuY3Rpb24ob3JnKSB7XG4gICAgb3JnX2lkcy5wdXNoKG9yZy5faWQpO1xuICAgIGlmIChvcmcucGFyZW50cykge1xuICAgICAgcmV0dXJuIF8uZWFjaChvcmcucGFyZW50cywgZnVuY3Rpb24ocGFyZW50X2lkKSB7XG4gICAgICAgIHJldHVybiBvcmdfaWRzLnB1c2gocGFyZW50X2lkKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIG9yZ19pZHMgPSBfLnVuaXEob3JnX2lkcyk7XG4gIG15X3Blcm1pc3Npb25zID0gbmV3IEFycmF5O1xuICBpZiAoZmxvdy5wZXJtcykge1xuICAgIGlmIChmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGQpIHtcbiAgICAgIHVzZXJzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGQ7XG4gICAgICBpZiAodXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VyX2lkKSkge1xuICAgICAgICBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGQpIHtcbiAgICAgIG9yZ3NfY2FuX2FkZCA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRkO1xuICAgICAgXy5lYWNoKG9yZ19pZHMsIGZ1bmN0aW9uKG9yZ19pZCkge1xuICAgICAgICBpZiAob3Jnc19jYW5fYWRkLmluY2x1ZGVzKG9yZ19pZCkpIHtcbiAgICAgICAgICByZXR1cm4gbXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yKSB7XG4gICAgICB1c2Vyc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3I7XG4gICAgICBpZiAodXNlcnNfY2FuX21vbml0b3IuaW5jbHVkZXModXNlcl9pZCkpIHtcbiAgICAgICAgbXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3IpIHtcbiAgICAgIG9yZ3NfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3I7XG4gICAgICBfLmVhY2gob3JnX2lkcywgZnVuY3Rpb24ob3JnX2lkKSB7XG4gICAgICAgIGlmIChvcmdzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKG9yZ19pZCkpIHtcbiAgICAgICAgICByZXR1cm4gbXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW4pIHtcbiAgICAgIHVzZXJzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluO1xuICAgICAgaWYgKHVzZXJzX2Nhbl9hZG1pbi5pbmNsdWRlcyh1c2VyX2lkKSkge1xuICAgICAgICBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluKSB7XG4gICAgICBvcmdzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW47XG4gICAgICBfLmVhY2gob3JnX2lkcywgZnVuY3Rpb24ob3JnX2lkKSB7XG4gICAgICAgIGlmIChvcmdzX2Nhbl9hZG1pbi5pbmNsdWRlcyhvcmdfaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIG15X3Blcm1pc3Npb25zID0gXy51bmlxKG15X3Blcm1pc3Npb25zKTtcbiAgcmV0dXJuIG15X3Blcm1pc3Npb25zO1xufTtcbiIsIl9ldmFsID0gcmVxdWlyZSgnZXZhbCcpXG5vYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJyk7XG5cbmdldE9iamVjdENvbmZpZyA9IChvYmplY3RBcGlOYW1lKSAtPlxuXHRyZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLnRvQ29uZmlnKClcblxuZ2V0T2JqZWN0TmFtZUZpZWxkS2V5ID0gKG9iamVjdEFwaU5hbWUpIC0+XG5cdHJldHVybiBvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkuTkFNRV9GSUVMRF9LRVlcblxuZ2V0UmVsYXRlZHMgPSAob2JqZWN0QXBpTmFtZSkgLT5cblx0cmV0dXJuIE1ldGVvci53cmFwQXN5bmMoKG9iamVjdEFwaU5hbWUsIGNiKSAtPlxuXHRcdG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS5nZXRSZWxhdGVkcygpLnRoZW4gKHJlc29sdmUsIHJlamVjdCkgLT5cblx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcblx0XHQpKG9iamVjdEFwaU5hbWUpXG5cbm9iamVjdEZpbmRPbmUgPSAob2JqZWN0QXBpTmFtZSwgcXVlcnkpIC0+XG5cdHJldHVybiBNZXRlb3Iud3JhcEFzeW5jKChvYmplY3RBcGlOYW1lLCBxdWVyeSwgY2IpIC0+XG5cdFx0b2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLmZpbmQocXVlcnkpLnRoZW4gKHJlc29sdmUsIHJlamVjdCkgLT5cblx0XHRcdGlmIChyZXNvbHZlICYmIHJlc29sdmUubGVuZ3RoID4gMClcblx0XHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlWzBdKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjYihyZWplY3QsIG51bGwpXG5cdFx0KShvYmplY3RBcGlOYW1lLCBxdWVyeSlcblxub2JqZWN0RmluZCA9IChvYmplY3RBcGlOYW1lLCBxdWVyeSkgLT5cblx0cmV0dXJuIE1ldGVvci53cmFwQXN5bmMoKG9iamVjdEFwaU5hbWUsIHF1ZXJ5LCBjYikgLT5cblx0XHRvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkuZmluZChxdWVyeSkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuXHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxuXHRcdCkob2JqZWN0QXBpTmFtZSwgcXVlcnkpXG5cbm9iamVjdFVwZGF0ZSA9IChvYmplY3RBcGlOYW1lLCBpZCwgZGF0YSkgLT5cblx0cmV0dXJuIE1ldGVvci53cmFwQXN5bmMoKG9iamVjdEFwaU5hbWUsIGlkLCBkYXRhLCBjYikgLT5cblx0XHRvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkudXBkYXRlKGlkLCBkYXRhKS50aGVuIChyZXNvbHZlLCByZWplY3QpIC0+XG5cdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXG5cdFx0KShvYmplY3RBcGlOYW1lLCBpZCwgZGF0YSlcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbiA9IChyZXEpIC0+XG5cdHF1ZXJ5ID0gcmVxLnF1ZXJ5XG5cdHVzZXJJZCA9IHF1ZXJ5W1wiWC1Vc2VyLUlkXCJdXG5cdGF1dGhUb2tlbiA9IHF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0aWYgbm90IHVzZXJJZCBvciBub3QgYXV0aFRva2VuXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG5cblx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxuXHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcblx0XHRfaWQ6IHVzZXJJZCxcblx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuXG5cdGlmIG5vdCB1c2VyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG5cblx0cmV0dXJuIHVzZXJcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZSA9IChzcGFjZV9pZCkgLT5cblx0c3BhY2UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxuXHRpZiBub3Qgc3BhY2Vcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInNwYWNlX2lk5pyJ6K+v5oiW5q2kc3BhY2Xlt7Lnu4/ooqvliKDpmaRcIilcblx0cmV0dXJuIHNwYWNlXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyA9IChmbG93X2lkKSAtPlxuXHRmbG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5mbG93cy5maW5kT25lKGZsb3dfaWQpXG5cdGlmIG5vdCBmbG93XG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJpZOacieivr+aIluatpOa1geeoi+W3sue7j+iiq+WIoOmZpFwiKVxuXHRyZXR1cm4gZmxvd1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlciA9IChzcGFjZV9pZCwgdXNlcl9pZCkgLT5cblx0c3BhY2VfdXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc3BhY2VfdXNlcnMuZmluZE9uZSh7IHNwYWNlOiBzcGFjZV9pZCwgdXNlcjogdXNlcl9pZCB9KVxuXHRpZiBub3Qgc3BhY2VfdXNlclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwidXNlcl9pZOWvueW6lOeahOeUqOaIt+S4jeWxnuS6juW9k+WJjXNwYWNlXCIpXG5cdHJldHVybiBzcGFjZV91c2VyXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyA9IChzcGFjZV91c2VyKSAtPlxuXHRpbmZvID0gbmV3IE9iamVjdFxuXHRpbmZvLm9yZ2FuaXphdGlvbiA9IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uXG5cdG9yZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub3JnYW5pemF0aW9ucy5maW5kT25lKHNwYWNlX3VzZXIub3JnYW5pemF0aW9uLCB7IGZpZWxkczogeyBuYW1lOiAxICwgZnVsbG5hbWU6IDEgfSB9KVxuXHRpbmZvLm9yZ2FuaXphdGlvbl9uYW1lID0gb3JnLm5hbWVcblx0aW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBvcmcuZnVsbG5hbWVcblx0cmV0dXJuIGluZm9cblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dFbmFibGVkID0gKGZsb3cpIC0+XG5cdGlmIGZsb3cuc3RhdGUgaXNudCBcImVuYWJsZWRcIlxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5pyq5ZCv55SoLOaTjeS9nOWksei0pVwiKVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZCA9IChmbG93LCBzcGFjZV9pZCkgLT5cblx0aWYgZmxvdy5zcGFjZSBpc250IHNwYWNlX2lkXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvlkozlt6XkvZzljLpJROS4jeWMuemFjVwiKVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZvcm0gPSAoZm9ybV9pZCkgLT5cblx0Zm9ybSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZm9ybXMuZmluZE9uZShmb3JtX2lkKVxuXHRpZiBub3QgZm9ybVxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsICfooajljZVJROacieivr+aIluatpOihqOWNleW3sue7j+iiq+WIoOmZpCcpXG5cblx0cmV0dXJuIGZvcm1cblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeSA9IChjYXRlZ29yeV9pZCkgLT5cblx0cmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuY2F0ZWdvcmllcy5maW5kT25lKGNhdGVnb3J5X2lkKVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrU3luY0RpcmVjdGlvbiA9IChvYmplY3RfbmFtZSwgZmxvd19pZCkgLT5cblx0b3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XG5cdFx0b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuXHRcdGZsb3dfaWQ6IGZsb3dfaWRcblx0fSlcblx0aWYgIW93XG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+acquaJvuWIsOWvueixoea1geeoi+aYoOWwhOiusOW9leOAgicpXG5cdHN5bmNEaXJlY3Rpb24gPSBvdy5zeW5jX2RpcmVjdGlvbiB8fCAnYm90aCdcblx0aWYgIVsnYm90aCcsICdvYmpfdG9faW5zJ10uaW5jbHVkZXMoc3luY0RpcmVjdGlvbilcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn5LiN5pSv5oyB55qE5ZCM5q2l5pa55ZCR44CCJylcblxuXHRyZXR1cm4gXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY3JlYXRlX2luc3RhbmNlID0gKGluc3RhbmNlX2Zyb21fY2xpZW50LCB1c2VyX2luZm8pIC0+XG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdLCBTdHJpbmdcblx0Y2hlY2sgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSwgU3RyaW5nXG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXSwgU3RyaW5nXG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXSwgW3tvOiBTdHJpbmcsIGlkczogW1N0cmluZ119XVxuXG5cdCMg5qCh6aqM5ZCM5q2l5pa55ZCRXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tTeW5jRGlyZWN0aW9uKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVswXS5vLCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl0pXG5cblx0IyDmoKHpqozmmK/lkKZyZWNvcmTlt7Lnu4/lj5HotbfnmoTnlLPor7fov5jlnKjlrqHmibnkuK1cblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja0lzSW5BcHByb3ZhbChpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl1bMF0sIGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0pXG5cblx0c3BhY2VfaWQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdXG5cdGZsb3dfaWQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl1cblx0dXNlcl9pZCA9IHVzZXJfaW5mby5faWRcblx0IyDojrflj5bliY3lj7DmiYDkvKDnmoR0cmFjZVxuXHR0cmFjZV9mcm9tX2NsaWVudCA9IG51bGxcblx0IyDojrflj5bliY3lj7DmiYDkvKDnmoRhcHByb3ZlXG5cdGFwcHJvdmVfZnJvbV9jbGllbnQgPSBudWxsXG5cdGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdIGFuZCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXVxuXHRcdHRyYWNlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1cblx0XHRpZiB0cmFjZV9mcm9tX2NsaWVudFtcImFwcHJvdmVzXCJdIGFuZCB0cmFjZV9mcm9tX2NsaWVudFtcImFwcHJvdmVzXCJdWzBdXG5cdFx0XHRhcHByb3ZlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1bXCJhcHByb3Zlc1wiXVswXVxuXG5cdCMg6I635Y+W5LiA5Liqc3BhY2Vcblx0c3BhY2UgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlKHNwYWNlX2lkKVxuXHQjIOiOt+WPluS4gOS4qmZsb3dcblx0ZmxvdyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyhmbG93X2lkKVxuXHQjIOiOt+WPluS4gOS4qnNwYWNl5LiL55qE5LiA5LiqdXNlclxuXHRzcGFjZV91c2VyID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXIoc3BhY2VfaWQsIHVzZXJfaWQpXG5cdCMg6I635Y+Wc3BhY2VfdXNlcuaJgOWcqOeahOmDqOmXqOS/oeaBr1xuXHRzcGFjZV91c2VyX29yZ19pbmZvID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXJPcmdJbmZvKHNwYWNlX3VzZXIpXG5cdCMg5Yik5pat5LiA5LiqZmxvd+aYr+WQpuS4uuWQr+eUqOeKtuaAgVxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd0VuYWJsZWQoZmxvdylcblx0IyDliKTmlq3kuIDkuKpmbG935ZKMc3BhY2VfaWTmmK/lkKbljLnphY1cblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQoZmxvdywgc3BhY2VfaWQpXG5cblx0Zm9ybSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybShmbG93LmZvcm0pXG5cblx0cGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd19pZCwgdXNlcl9pZClcblxuXHRpZiBub3QgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZGRcIilcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuW9k+WJjeeUqOaIt+ayoeacieatpOa1geeoi+eahOaWsOW7uuadg+mZkFwiKVxuXG5cdG5vdyA9IG5ldyBEYXRlXG5cdGluc19vYmogPSB7fVxuXHRpbnNfb2JqLl9pZCA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLl9tYWtlTmV3SUQoKVxuXHRpbnNfb2JqLnNwYWNlID0gc3BhY2VfaWRcblx0aW5zX29iai5mbG93ID0gZmxvd19pZFxuXHRpbnNfb2JqLmZsb3dfdmVyc2lvbiA9IGZsb3cuY3VycmVudC5faWRcblx0aW5zX29iai5mb3JtID0gZmxvdy5mb3JtXG5cdGluc19vYmouZm9ybV92ZXJzaW9uID0gZmxvdy5jdXJyZW50LmZvcm1fdmVyc2lvblxuXHRpbnNfb2JqLm5hbWUgPSBmbG93Lm5hbWVcblx0aW5zX29iai5zdWJtaXR0ZXIgPSB1c2VyX2lkXG5cdGluc19vYmouc3VibWl0dGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZVxuXHRpbnNfb2JqLmFwcGxpY2FudCA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gZWxzZSB1c2VyX2lkXG5cdGluc19vYmouYXBwbGljYW50X25hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSBlbHNlIHVzZXJfaW5mby5uYW1lXG5cdGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbiA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSBlbHNlIHNwYWNlX3VzZXIub3JnYW5pemF0aW9uXG5cdGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZVwiXSBlbHNlIHNwYWNlX3VzZXJfb3JnX2luZm8ub3JnYW5pemF0aW9uX25hbWVcblx0aW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdIGVsc2UgIHNwYWNlX3VzZXJfb3JnX2luZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lXG5cdGluc19vYmouYXBwbGljYW50X2NvbXBhbnkgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfY29tcGFueVwiXSBlbHNlIHNwYWNlX3VzZXIuY29tcGFueV9pZFxuXHRpbnNfb2JqLnN0YXRlID0gJ2RyYWZ0J1xuXHRpbnNfb2JqLmNvZGUgPSAnJ1xuXHRpbnNfb2JqLmlzX2FyY2hpdmVkID0gZmFsc2Vcblx0aW5zX29iai5pc19kZWxldGVkID0gZmFsc2Vcblx0aW5zX29iai5jcmVhdGVkID0gbm93XG5cdGluc19vYmouY3JlYXRlZF9ieSA9IHVzZXJfaWRcblx0aW5zX29iai5tb2RpZmllZCA9IG5vd1xuXHRpbnNfb2JqLm1vZGlmaWVkX2J5ID0gdXNlcl9pZFxuXG5cdGluc19vYmoucmVjb3JkX2lkcyA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVxuXG5cdGlmIHNwYWNlX3VzZXIuY29tcGFueV9pZFxuXHRcdGluc19vYmouY29tcGFueV9pZCA9IHNwYWNlX3VzZXIuY29tcGFueV9pZFxuXG5cdCMg5paw5bu6VHJhY2Vcblx0dHJhY2Vfb2JqID0ge31cblx0dHJhY2Vfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHJcblx0dHJhY2Vfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWRcblx0dHJhY2Vfb2JqLmlzX2ZpbmlzaGVkID0gZmFsc2Vcblx0IyDlvZPliY3mnIDmlrDniYhmbG935Lit5byA5aeL6IqC54K5XG5cdHN0YXJ0X3N0ZXAgPSBfLmZpbmQoZmxvdy5jdXJyZW50LnN0ZXBzLCAoc3RlcCkgLT5cblx0XHRyZXR1cm4gc3RlcC5zdGVwX3R5cGUgaXMgJ3N0YXJ0J1xuXHQpXG5cdHRyYWNlX29iai5zdGVwID0gc3RhcnRfc3RlcC5faWRcblx0dHJhY2Vfb2JqLm5hbWUgPSBzdGFydF9zdGVwLm5hbWVcblxuXHR0cmFjZV9vYmouc3RhcnRfZGF0ZSA9IG5vd1xuXHQjIOaWsOW7ukFwcHJvdmVcblx0YXBwcl9vYmogPSB7fVxuXHRhcHByX29iai5faWQgPSBuZXcgTW9uZ28uT2JqZWN0SUQoKS5fc3RyXG5cdGFwcHJfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWRcblx0YXBwcl9vYmoudHJhY2UgPSB0cmFjZV9vYmouX2lkXG5cdGFwcHJfb2JqLmlzX2ZpbmlzaGVkID0gZmFsc2Vcblx0YXBwcl9vYmoudXNlciA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gZWxzZSB1c2VyX2lkXG5cdGFwcHJfb2JqLnVzZXJfbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIGVsc2UgdXNlcl9pbmZvLm5hbWVcblx0YXBwcl9vYmouaGFuZGxlciA9IHVzZXJfaWRcblx0YXBwcl9vYmouaGFuZGxlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWVcblx0YXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvblxuXHRhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9uYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5uYW1lXG5cdGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5mdWxsbmFtZVxuXHRhcHByX29iai50eXBlID0gJ2RyYWZ0J1xuXHRhcHByX29iai5zdGFydF9kYXRlID0gbm93XG5cdGFwcHJfb2JqLnJlYWRfZGF0ZSA9IG5vd1xuXHRhcHByX29iai5pc19yZWFkID0gdHJ1ZVxuXHRhcHByX29iai5pc19lcnJvciA9IGZhbHNlXG5cdGFwcHJfb2JqLmRlc2NyaXB0aW9uID0gJydcblx0cmVsYXRlZFRhYmxlc0luZm8gPSB7fVxuXHRhcHByX29iai52YWx1ZXMgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlVmFsdWVzKGluc19vYmoucmVjb3JkX2lkc1swXSwgZmxvd19pZCwgc3BhY2VfaWQsIGZvcm0uY3VycmVudC5maWVsZHMsIHJlbGF0ZWRUYWJsZXNJbmZvKVxuXG5cdHRyYWNlX29iai5hcHByb3ZlcyA9IFthcHByX29ial1cblx0aW5zX29iai50cmFjZXMgPSBbdHJhY2Vfb2JqXVxuXG5cdGluc19vYmoudmFsdWVzID0gYXBwcl9vYmoudmFsdWVzXG5cblx0aW5zX29iai5pbmJveF91c2VycyA9IGluc3RhbmNlX2Zyb21fY2xpZW50LmluYm94X3VzZXJzIHx8IFtdXG5cblx0aW5zX29iai5jdXJyZW50X3N0ZXBfbmFtZSA9IHN0YXJ0X3N0ZXAubmFtZVxuXG5cdGlmIGZsb3cuYXV0b19yZW1pbmQgaXMgdHJ1ZVxuXHRcdGluc19vYmouYXV0b19yZW1pbmQgPSB0cnVlXG5cblx0IyDmlrDlu7rnlLPor7fljZXml7bvvIxpbnN0YW5jZXPorrDlvZXmtYHnqIvlkI3np7DjgIHmtYHnqIvliIbnsbvlkI3np7AgIzEzMTNcblx0aW5zX29iai5mbG93X25hbWUgPSBmbG93Lm5hbWVcblx0aWYgZm9ybS5jYXRlZ29yeVxuXHRcdGNhdGVnb3J5ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeShmb3JtLmNhdGVnb3J5KVxuXHRcdGlmIGNhdGVnb3J5XG5cdFx0XHRpbnNfb2JqLmNhdGVnb3J5X25hbWUgPSBjYXRlZ29yeS5uYW1lXG5cdFx0XHRpbnNfb2JqLmNhdGVnb3J5ID0gY2F0ZWdvcnkuX2lkXG5cblx0bmV3X2luc19pZCA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmluc2VydChpbnNfb2JqKVxuXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8oaW5zX29iai5yZWNvcmRfaWRzWzBdLCBuZXdfaW5zX2lkLCBzcGFjZV9pZClcblxuXHQjIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvKHJlbGF0ZWRUYWJsZXNJbmZvLCBuZXdfaW5zX2lkLCBzcGFjZV9pZClcblxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoKGluc19vYmoucmVjb3JkX2lkc1swXSwgc3BhY2VfaWQsIGluc19vYmouX2lkLCBhcHByX29iai5faWQpXG5cblx0cmV0dXJuIG5ld19pbnNfaWRcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVZhbHVlcyA9IChyZWNvcmRJZHMsIGZsb3dJZCwgc3BhY2VJZCwgZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbykgLT5cblx0ZmllbGRDb2RlcyA9IFtdXG5cdF8uZWFjaCBmaWVsZHMsIChmKSAtPlxuXHRcdGlmIGYudHlwZSA9PSAnc2VjdGlvbidcblx0XHRcdF8uZWFjaCBmLmZpZWxkcywgKGZmKSAtPlxuXHRcdFx0XHRmaWVsZENvZGVzLnB1c2ggZmYuY29kZVxuXHRcdGVsc2Vcblx0XHRcdGZpZWxkQ29kZXMucHVzaCBmLmNvZGVcblxuXHR2YWx1ZXMgPSB7fVxuXHRvYmplY3ROYW1lID0gcmVjb3JkSWRzLm9cblx0b2JqZWN0ID0gZ2V0T2JqZWN0Q29uZmlnKG9iamVjdE5hbWUpXG5cdHJlY29yZElkID0gcmVjb3JkSWRzLmlkc1swXVxuXHRvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3dvcmtmbG93cy5maW5kT25lKHtcblx0XHRvYmplY3RfbmFtZTogb2JqZWN0TmFtZSxcblx0XHRmbG93X2lkOiBmbG93SWRcblx0fSlcblx0IyByZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0TmFtZSwgc3BhY2VJZCkuZmluZE9uZShyZWNvcmRJZClcblx0cmVjb3JkID0gb2JqZWN0RmluZE9uZShvYmplY3ROYW1lLCB7IGZpbHRlcnM6IFtbJ19pZCcsICc9JywgcmVjb3JkSWRdXX0pXG5cdGZsb3cgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShmbG93SWQsIHsgZmllbGRzOiB7IGZvcm06IDEgfSB9KVxuXHRpZiBvdyBhbmQgcmVjb3JkXG5cdFx0Zm9ybSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImZvcm1zXCIpLmZpbmRPbmUoZmxvdy5mb3JtKVxuXHRcdGZvcm1GaWVsZHMgPSBmb3JtLmN1cnJlbnQuZmllbGRzIHx8IFtdXG5cdFx0cmVsYXRlZE9iamVjdHMgPSBnZXRSZWxhdGVkcyhvYmplY3ROYW1lKVxuXHRcdHJlbGF0ZWRPYmplY3RzS2V5cyA9IF8ucGx1Y2socmVsYXRlZE9iamVjdHMsICdvYmplY3RfbmFtZScpXG5cdFx0Zm9ybVRhYmxlRmllbGRzID0gXy5maWx0ZXIgZm9ybUZpZWxkcywgKGZvcm1GaWVsZCkgLT5cblx0XHRcdHJldHVybiBmb3JtRmllbGQudHlwZSA9PSAndGFibGUnXG5cdFx0Zm9ybVRhYmxlRmllbGRzQ29kZSA9IF8ucGx1Y2soZm9ybVRhYmxlRmllbGRzLCAnY29kZScpXG5cblx0XHRnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gIChrZXkpIC0+XG5cdFx0XHRyZXR1cm4gXy5maW5kIHJlbGF0ZWRPYmplY3RzS2V5cywgIChyZWxhdGVkT2JqZWN0c0tleSkgLT5cblx0XHRcdFx0cmV0dXJuIGtleS5zdGFydHNXaXRoKHJlbGF0ZWRPYmplY3RzS2V5ICsgJy4nKVxuXG5cdFx0Z2V0Rm9ybVRhYmxlRmllbGRDb2RlID0gKGtleSkgLT5cblx0XHRcdHJldHVybiBfLmZpbmQgZm9ybVRhYmxlRmllbGRzQ29kZSwgIChmb3JtVGFibGVGaWVsZENvZGUpIC0+XG5cdFx0XHRcdHJldHVybiBrZXkuc3RhcnRzV2l0aChmb3JtVGFibGVGaWVsZENvZGUgKyAnLicpXG5cblx0XHRnZXRGb3JtVGFibGVGaWVsZCA9IChrZXkpIC0+XG5cdFx0XHRyZXR1cm4gXy5maW5kIGZvcm1UYWJsZUZpZWxkcywgIChmKSAtPlxuXHRcdFx0XHRyZXR1cm4gZi5jb2RlID09IGtleVxuXG5cdFx0Z2V0Rm9ybUZpZWxkID0gKGtleSkgLT5cblx0XHRcdGZmID0gbnVsbFxuXHRcdFx0Xy5mb3JFYWNoIGZvcm1GaWVsZHMsIChmKSAtPlxuXHRcdFx0XHRpZiBmZlxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRpZiBmLnR5cGUgPT0gJ3NlY3Rpb24nXG5cdFx0XHRcdFx0ZmYgPSBfLmZpbmQgZi5maWVsZHMsICAoc2YpIC0+XG5cdFx0XHRcdFx0XHRyZXR1cm4gc2YuY29kZSA9PSBrZXlcblx0XHRcdFx0ZWxzZSBpZiBmLmNvZGUgPT0ga2V5XG5cdFx0XHRcdFx0ZmYgPSBmXG5cblx0XHRcdHJldHVybiBmZlxuXG5cdFx0Z2V0Rm9ybVRhYmxlU3ViRmllbGQgPSAodGFibGVGaWVsZCwgc3ViRmllbGRDb2RlKSAtPlxuXHRcdFx0cmV0dXJuIF8uZmluZCB0YWJsZUZpZWxkLmZpZWxkcywgIChmKSAtPlxuXHRcdFx0XHRyZXR1cm4gZi5jb2RlID09IHN1YkZpZWxkQ29kZVxuXG5cdFx0Z2V0RmllbGRPZGF0YVZhbHVlID0gKG9iak5hbWUsIGlkKSAtPlxuXHRcdFx0IyBvYmogPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqTmFtZSlcblx0XHRcdG9iaiA9IG9iamVjdHFsLmdldE9iamVjdChvYmpOYW1lKVxuXHRcdFx0bmFtZUtleSA9IGdldE9iamVjdE5hbWVGaWVsZEtleShvYmpOYW1lKVxuXHRcdFx0aWYgIW9ialxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIF8uaXNTdHJpbmcgaWRcblx0XHRcdFx0IyBfcmVjb3JkID0gb2JqLmZpbmRPbmUoaWQpXG5cdFx0XHRcdF9yZWNvcmQgPSBvYmplY3RGaW5kT25lKG9iak5hbWUsIHsgZmlsdGVyczogW1snX2lkJywgJz0nLCBpZF1dfSlcblx0XHRcdFx0aWYgX3JlY29yZFxuXHRcdFx0XHRcdF9yZWNvcmRbJ0BsYWJlbCddID0gX3JlY29yZFtuYW1lS2V5XVxuXHRcdFx0XHRcdHJldHVybiBfcmVjb3JkXG5cdFx0XHRlbHNlIGlmIF8uaXNBcnJheSBpZFxuXHRcdFx0XHRfcmVjb3JkcyA9IFtdXG5cdFx0XHRcdCMgb2JqLmZpbmQoeyBfaWQ6IHsgJGluOiBpZCB9IH0pXG5cdFx0XHRcdG9iamVjdEZpbmQob2JqTmFtZSwgeyBmaWx0ZXJzOiBbWydfaWQnLCAnaW4nLCBpZF1dfSkuZm9yRWFjaCAoX3JlY29yZCkgLT5cblx0XHRcdFx0XHRfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmRbbmFtZUtleV1cblx0XHRcdFx0XHRfcmVjb3Jkcy5wdXNoIF9yZWNvcmRcblx0XHRcdFx0aWYgIV8uaXNFbXB0eSBfcmVjb3Jkc1xuXHRcdFx0XHRcdHJldHVybiBfcmVjb3Jkc1xuXHRcdFx0cmV0dXJuXG5cblx0XHRnZXRTZWxlY3RVc2VyVmFsdWUgPSAodXNlcklkLCBzcGFjZUlkKSAtPlxuXHRcdFx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSlcblx0XHRcdHN1LmlkID0gdXNlcklkXG5cdFx0XHRyZXR1cm4gc3VcblxuXHRcdGdldFNlbGVjdFVzZXJWYWx1ZXMgPSAodXNlcklkcywgc3BhY2VJZCkgLT5cblx0XHRcdHN1cyA9IFtdXG5cdFx0XHRpZiBfLmlzQXJyYXkgdXNlcklkc1xuXHRcdFx0XHRfLmVhY2ggdXNlcklkcywgKHVzZXJJZCkgLT5cblx0XHRcdFx0XHRzdSA9IGdldFNlbGVjdFVzZXJWYWx1ZSh1c2VySWQsIHNwYWNlSWQpXG5cdFx0XHRcdFx0aWYgc3Vcblx0XHRcdFx0XHRcdHN1cy5wdXNoKHN1KVxuXHRcdFx0cmV0dXJuIHN1c1xuXG5cdFx0Z2V0U2VsZWN0T3JnVmFsdWUgPSAob3JnSWQsIHNwYWNlSWQpIC0+XG5cdFx0XHRvcmcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kT25lKG9yZ0lkLCB7IGZpZWxkczogeyBfaWQ6IDEsIG5hbWU6IDEsIGZ1bGxuYW1lOiAxIH0gfSlcblx0XHRcdG9yZy5pZCA9IG9yZ0lkXG5cdFx0XHRyZXR1cm4gb3JnXG5cblx0XHRnZXRTZWxlY3RPcmdWYWx1ZXMgPSAob3JnSWRzLCBzcGFjZUlkKSAtPlxuXHRcdFx0b3JncyA9IFtdXG5cdFx0XHRpZiBfLmlzQXJyYXkgb3JnSWRzXG5cdFx0XHRcdF8uZWFjaCBvcmdJZHMsIChvcmdJZCkgLT5cblx0XHRcdFx0XHRvcmcgPSBnZXRTZWxlY3RPcmdWYWx1ZShvcmdJZCwgc3BhY2VJZClcblx0XHRcdFx0XHRpZiBvcmdcblx0XHRcdFx0XHRcdG9yZ3MucHVzaChvcmcpXG5cdFx0XHRyZXR1cm4gb3Jnc1xuXG5cdFx0dGFibGVGaWVsZENvZGVzID0gW11cblx0XHR0YWJsZUZpZWxkTWFwID0gW11cblx0XHR0YWJsZVRvUmVsYXRlZE1hcCA9IHt9XG5cblx0XHRvdy5maWVsZF9tYXA/LmZvckVhY2ggKGZtKSAtPlxuXHRcdFx0b2JqZWN0X2ZpZWxkID0gZm0ub2JqZWN0X2ZpZWxkXG5cdFx0XHR3b3JrZmxvd19maWVsZCA9IGZtLndvcmtmbG93X2ZpZWxkXG5cdFx0XHRpZiAhb2JqZWN0X2ZpZWxkIHx8ICF3b3JrZmxvd19maWVsZFxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ+acquaJvuWIsOWtl+aute+8jOivt+ajgOafpeWvueixoea1geeoi+aYoOWwhOWtl+autemFjee9ricpXG5cdFx0XHRyZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZShvYmplY3RfZmllbGQpXG5cdFx0XHRmb3JtVGFibGVGaWVsZENvZGUgPSBnZXRGb3JtVGFibGVGaWVsZENvZGUod29ya2Zsb3dfZmllbGQpXG5cdFx0XHRvYmpGaWVsZCA9IG9iamVjdC5maWVsZHNbb2JqZWN0X2ZpZWxkXVxuXHRcdFx0Zm9ybUZpZWxkID0gZ2V0Rm9ybUZpZWxkKHdvcmtmbG93X2ZpZWxkKVxuXHRcdFx0IyDlpITnkIblrZDooajlrZfmrrVcblx0XHRcdGlmIHJlbGF0ZWRPYmplY3RGaWVsZENvZGVcblx0XHRcdFx0XG5cdFx0XHRcdG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXVxuXHRcdFx0XHRvVGFibGVGaWVsZENvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXVxuXHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcEtleSA9IG9UYWJsZUNvZGVcblx0XHRcdFx0aWYgIXRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVxuXHRcdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSA9IHt9XG5cblx0XHRcdFx0aWYgZm9ybVRhYmxlRmllbGRDb2RlXG5cdFx0XHRcdFx0d1RhYmxlQ29kZSA9IHdvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMF1cblx0XHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bJ19GUk9NX1RBQkxFX0NPREUnXSA9IHdUYWJsZUNvZGVcblxuXHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bb1RhYmxlRmllbGRDb2RlXSA9IHdvcmtmbG93X2ZpZWxkXG5cdFx0XHQjIOWIpOaWreaYr+WQpuaYr+ihqOagvOWtl+autVxuXHRcdFx0ZWxzZSBpZiB3b3JrZmxvd19maWVsZC5pbmRleE9mKCcuJykgPiAwIGFuZCBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPiAwXG5cdFx0XHRcdHdUYWJsZUNvZGUgPSB3b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdXG5cdFx0XHRcdG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzBdXG5cdFx0XHRcdGlmIHJlY29yZC5oYXNPd25Qcm9wZXJ0eShvVGFibGVDb2RlKSBhbmQgXy5pc0FycmF5KHJlY29yZFtvVGFibGVDb2RlXSlcblx0XHRcdFx0XHR0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XG5cdFx0XHRcdFx0XHR3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxuXHRcdFx0XHRcdFx0b2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcblx0XHRcdFx0XHR9KSlcblx0XHRcdFx0XHR0YWJsZUZpZWxkTWFwLnB1c2goZm0pXG5cdFx0XHRcdGVsc2UgaWYgb1RhYmxlQ29kZS5pbmRleE9mKCcuJykgPiAwICMg6K+05piO5piv5YWz6IGU6KGo55qEZ3JpZOWtl+autVxuXHRcdFx0XHRcdG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZENvZGUgPSBvVGFibGVDb2RlLnNwbGl0KCcuJylbMF07XG5cdFx0XHRcdFx0Z3JpZENvZGUgPSBvVGFibGVDb2RlLnNwbGl0KCcuJylbMV07XG5cdFx0XHRcdFx0b1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkID0gb2JqZWN0LmZpZWxkc1tvVGFibGVDb2RlUmVmZXJlbmNlRmllbGRDb2RlXTtcblx0XHRcdFx0XHRpZiBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRpZiByZWNvcmRbb1RhYmxlQ29kZV1cblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnJlZmVyZW5jZV90bztcblx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQubmFtZV07XG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0RvYyA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSk7XG5cdFx0XHRcdFx0XHRpZiByZWZlcmVuY2VUb0RvY1tncmlkQ29kZV1cblx0XHRcdFx0XHRcdFx0cmVjb3JkW29UYWJsZUNvZGVdID0gcmVmZXJlbmNlVG9Eb2NbZ3JpZENvZGVdO1xuXHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XG5cdFx0XHRcdFx0XHRcdFx0d29ya2Zsb3dfdGFibGVfZmllbGRfY29kZTogd1RhYmxlQ29kZSxcblx0XHRcdFx0XHRcdFx0XHRvYmplY3RfdGFibGVfZmllbGRfY29kZTogb1RhYmxlQ29kZVxuXHRcdFx0XHRcdFx0XHR9KSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0YWJsZUZpZWxkTWFwLnB1c2goZm0pO1xuXG5cdFx0XHQjIOWkhOeQhmxvb2t1cOOAgW1hc3Rlcl9kZXRhaWznsbvlnovlrZfmrrVcblx0XHRcdGVsc2UgaWYgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4nKSA+IDAgYW5kIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA9PSAtMVxuXHRcdFx0XHRvYmplY3RGaWVsZE5hbWUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXVxuXHRcdFx0XHRsb29rdXBGaWVsZE5hbWUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXVxuXHRcdFx0XHRpZiBvYmplY3Rcblx0XHRcdFx0XHRvYmplY3RGaWVsZCA9IG9iamVjdC5maWVsZHNbb2JqZWN0RmllbGROYW1lXVxuXHRcdFx0XHRcdGlmIG9iamVjdEZpZWxkICYmIGZvcm1GaWVsZCAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqZWN0RmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHQjIGZpZWxkc09iaiA9IHt9XG5cdFx0XHRcdFx0XHQjIGZpZWxkc09ialtsb29rdXBGaWVsZE5hbWVdID0gMVxuXHRcdFx0XHRcdFx0IyBsb29rdXBPYmplY3RSZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kT25lKHJlY29yZFtvYmplY3RGaWVsZE5hbWVdLCB7IGZpZWxkczogZmllbGRzT2JqIH0pXG5cdFx0XHRcdFx0XHRsb29rdXBPYmplY3RSZWNvcmQgPSBvYmplY3RGaW5kT25lKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bywgeyBmaWx0ZXJzOiBbWydfaWQnLCAnPScsIHJlY29yZFtvYmplY3RGaWVsZE5hbWVdXV0sIGZpZWxkczogW2xvb2t1cEZpZWxkTmFtZV0gfSlcblx0XHRcdFx0XHRcdGlmICFsb29rdXBPYmplY3RSZWNvcmRcblx0XHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0XHRvYmplY3RGaWVsZE9iamVjdE5hbWUgPSBvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0XHRcdGxvb2t1cEZpZWxkT2JqID0gZ2V0T2JqZWN0Q29uZmlnKG9iamVjdEZpZWxkT2JqZWN0TmFtZSlcblx0XHRcdFx0XHRcdG9iamVjdExvb2t1cEZpZWxkID0gbG9va3VwRmllbGRPYmouZmllbGRzW2xvb2t1cEZpZWxkTmFtZV1cblx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IGxvb2t1cE9iamVjdFJlY29yZFtsb29rdXBGaWVsZE5hbWVdXG5cdFx0XHRcdFx0XHRpZiBvYmplY3RMb29rdXBGaWVsZCAmJiBmb3JtRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqZWN0TG9va3VwRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWVcblx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmICFvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gb2RhdGFGaWVsZFZhbHVlXG5cdFx0XHRcdFx0XHRlbHNlIGlmIG9iamVjdExvb2t1cEZpZWxkICYmIGZvcm1GaWVsZCAmJiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iamVjdExvb2t1cEZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0aWYgIV8uaXNFbXB0eShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0bG9va3VwU2VsZWN0RmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0XHRcdGlmIGZvcm1GaWVsZC50eXBlID09ICd1c2VyJ1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIW9iamVjdExvb2t1cEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQudHlwZSA9PSAnZ3JvdXAnXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmICFvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdFx0aWYgbG9va3VwU2VsZWN0RmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IGxvb2t1cFNlbGVjdEZpZWxkVmFsdWVcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IGxvb2t1cE9iamVjdFJlY29yZFtsb29rdXBGaWVsZE5hbWVdXG5cblx0XHRcdCMgbG9va3Vw44CBbWFzdGVyX2RldGFpbOWtl+auteWQjOatpeWIsG9kYXRh5a2X5q61XG5cdFx0XHRlbHNlIGlmIGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iakZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqRmllbGQucmVmZXJlbmNlX3RvXG5cdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvYmpGaWVsZC5uYW1lXVxuXHRcdFx0XHRvZGF0YUZpZWxkVmFsdWVcblx0XHRcdFx0aWYgb2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRlbHNlIGlmICFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gb2RhdGFGaWVsZFZhbHVlXG5cdFx0XHRlbHNlIGlmIGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iakZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKG9iakZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdXG5cdFx0XHRcdGlmICFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWVcblx0XHRcdFx0XHRpZiBmb3JtRmllbGQudHlwZSA9PSAndXNlcidcblx0XHRcdFx0XHRcdGlmIG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRlbHNlIGlmICFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkLnR5cGUgPT0gJ2dyb3VwJ1xuXHRcdFx0XHRcdFx0aWYgb2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAhb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdGlmIHNlbGVjdEZpZWxkVmFsdWVcblx0XHRcdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBzZWxlY3RGaWVsZFZhbHVlXG5cdFx0XHRlbHNlIGlmIHJlY29yZC5oYXNPd25Qcm9wZXJ0eShvYmplY3RfZmllbGQpXG5cdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSByZWNvcmRbb2JqZWN0X2ZpZWxkXVxuXG5cdFx0IyDooajmoLzlrZfmrrVcblx0XHRfLnVuaXEodGFibGVGaWVsZENvZGVzKS5mb3JFYWNoICh0ZmMpIC0+XG5cdFx0XHRjID0gSlNPTi5wYXJzZSh0ZmMpXG5cdFx0XHR2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXSA9IFtdXG5cdFx0XHRyZWNvcmRbYy5vYmplY3RfdGFibGVfZmllbGRfY29kZV0uZm9yRWFjaCAodHIpIC0+XG5cdFx0XHRcdG5ld1RyID0ge31cblx0XHRcdFx0Xy5lYWNoIHRyLCAodiwgaykgLT5cblx0XHRcdFx0XHR0YWJsZUZpZWxkTWFwLmZvckVhY2ggKHRmbSkgLT5cblx0XHRcdFx0XHRcdGlmIHRmbS5vYmplY3RfZmllbGQgaXMgKGMub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGUgKyAnLiQuJyArIGspXG5cdFx0XHRcdFx0XHRcdHdUZENvZGUgPSB0Zm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVsxXVxuXHRcdFx0XHRcdFx0XHRuZXdUclt3VGRDb2RlXSA9IHZcblx0XHRcdFx0aWYgbm90IF8uaXNFbXB0eShuZXdUcilcblx0XHRcdFx0XHR2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXS5wdXNoKG5ld1RyKVxuXG5cdFx0IyDlkIzmraXlrZDooajmlbDmja7oh7PooajljZXooajmoLxcblx0XHRfLmVhY2ggdGFibGVUb1JlbGF0ZWRNYXAsICAobWFwLCBrZXkpIC0+XG5cdFx0XHR0YWJsZUNvZGUgPSBtYXAuX0ZST01fVEFCTEVfQ09ERVxuXHRcdFx0Zm9ybVRhYmxlRmllbGQgPSBnZXRGb3JtVGFibGVGaWVsZCh0YWJsZUNvZGUpXG5cdFx0XHRpZiAhdGFibGVDb2RlXG5cdFx0XHRcdGNvbnNvbGUud2FybigndGFibGVUb1JlbGF0ZWQ6IFsnICsga2V5ICsgJ10gbWlzc2luZyBjb3JyZXNwb25kaW5nIHRhYmxlLicpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3ROYW1lID0ga2V5XG5cdFx0XHRcdHRhYmxlVmFsdWVzID0gW11cblx0XHRcdFx0cmVsYXRlZFRhYmxlSXRlbXMgPSBbXVxuXHRcdFx0XHRyZWxhdGVkT2JqZWN0ID0gZ2V0T2JqZWN0Q29uZmlnKHJlbGF0ZWRPYmplY3ROYW1lKVxuXHRcdFx0XHRyZWxhdGVkRmllbGQgPSBfLmZpbmQgcmVsYXRlZE9iamVjdC5maWVsZHMsIChmKSAtPlxuXHRcdFx0XHRcdHJldHVybiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMoZi50eXBlKSAmJiBmLnJlZmVyZW5jZV90byA9PSBvYmplY3ROYW1lXG5cblx0XHRcdFx0cmVsYXRlZEZpZWxkTmFtZSA9IHJlbGF0ZWRGaWVsZC5uYW1lXG5cblx0XHRcdFx0c2VsZWN0b3IgPSB7fVxuXHRcdFx0XHRzZWxlY3RvcltyZWxhdGVkRmllbGROYW1lXSA9IHJlY29yZElkXG5cdFx0XHRcdHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKVxuXHRcdFx0XHRyZWxhdGVkUmVjb3JkcyA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpXG5cblx0XHRcdFx0cmVsYXRlZFJlY29yZHMuZm9yRWFjaCAocnIpIC0+XG5cdFx0XHRcdFx0dGFibGVWYWx1ZUl0ZW0gPSB7fVxuXHRcdFx0XHRcdF8uZWFjaCBtYXAsICh2YWx1ZUtleSwgZmllbGRLZXkpIC0+XG5cdFx0XHRcdFx0XHRpZiBmaWVsZEtleSAhPSAnX0ZST01fVEFCTEVfQ09ERSdcblx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlXG5cdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleVxuXHRcdFx0XHRcdFx0XHRpZiB2YWx1ZUtleS5zdGFydHNXaXRoKHRhYmxlQ29kZSArICcuJylcblx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXkgPSAodmFsdWVLZXkuc3BsaXQoXCIuXCIpWzFdKVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkS2V5ID0gdmFsdWVLZXlcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGZvcm1GaWVsZCA9IGdldEZvcm1UYWJsZVN1YkZpZWxkKGZvcm1UYWJsZUZpZWxkLCBmb3JtRmllbGRLZXkpXG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZCA9IHJlbGF0ZWRPYmplY3QuZmllbGRzW2ZpZWxkS2V5XVxuXHRcdFx0XHRcdFx0XHRpZiAhZm9ybUZpZWxkIHx8ICFyZWxhdGVkT2JqZWN0RmllbGRcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRcdFx0aWYgZm9ybUZpZWxkLnR5cGUgPT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb09iamVjdE5hbWUgPSByZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcnJbZmllbGRLZXldXG5cdFx0XHRcdFx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV1cblx0XHRcdFx0XHRcdFx0XHRpZiAhXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGZvcm1GaWVsZC50eXBlID09ICd1c2VyJ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkLnR5cGUgPT0gJ2dyb3VwJ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBycltmaWVsZEtleV1cblx0XHRcdFx0XHRcdFx0dGFibGVWYWx1ZUl0ZW1bZm9ybUZpZWxkS2V5XSA9IHRhYmxlRmllbGRWYWx1ZVxuXHRcdFx0XHRcdGlmICFfLmlzRW1wdHkodGFibGVWYWx1ZUl0ZW0pXG5cdFx0XHRcdFx0XHR0YWJsZVZhbHVlSXRlbS5faWQgPSByci5faWRcblx0XHRcdFx0XHRcdHRhYmxlVmFsdWVzLnB1c2godGFibGVWYWx1ZUl0ZW0pXG5cdFx0XHRcdFx0XHRyZWxhdGVkVGFibGVJdGVtcy5wdXNoKHsgX3RhYmxlOiB7IF9pZDogcnIuX2lkLCBfY29kZTogdGFibGVDb2RlIH0gfSApXG5cblx0XHRcdFx0dmFsdWVzW3RhYmxlQ29kZV0gPSB0YWJsZVZhbHVlc1xuXHRcdFx0XHRyZWxhdGVkVGFibGVzSW5mb1tyZWxhdGVkT2JqZWN0TmFtZV0gPSByZWxhdGVkVGFibGVJdGVtc1xuXG5cdFx0IyDlpoLmnpzphY3nva7kuobohJrmnKzliJnmiafooYzohJrmnKxcblx0XHRpZiBvdy5maWVsZF9tYXBfc2NyaXB0XG5cdFx0XHRfLmV4dGVuZCh2YWx1ZXMsIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0KG93LmZpZWxkX21hcF9zY3JpcHQsIG9iamVjdE5hbWUsIHNwYWNlSWQsIHJlY29yZElkKSlcblxuXHQjIOi/h+a7pOaOiXZhbHVlc+S4reeahOmdnuazlWtleVxuXHRmaWx0ZXJWYWx1ZXMgPSB7fVxuXHRfLmVhY2ggXy5rZXlzKHZhbHVlcyksIChrKSAtPlxuXHRcdGlmIGZpZWxkQ29kZXMuaW5jbHVkZXMoaylcblx0XHRcdGZpbHRlclZhbHVlc1trXSA9IHZhbHVlc1trXVxuXG5cdHJldHVybiBmaWx0ZXJWYWx1ZXNcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5ldmFsRmllbGRNYXBTY3JpcHQgPSAoZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgb2JqZWN0SWQpIC0+XG5cdCMgcmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLmZpbmRPbmUob2JqZWN0SWQpXG5cdHJlY29yZCA9IG9iamVjdEZpbmRPbmUob2JqZWN0TmFtZSwgeyBmaWx0ZXJzOiBbWydfaWQnLCAnPScsIG9iamVjdElkXV0gfSlcblx0c2NyaXB0ID0gXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZWNvcmQpIHsgXCIgKyBmaWVsZF9tYXBfc2NyaXB0ICsgXCIgfVwiXG5cdGZ1bmMgPSBfZXZhbChzY3JpcHQsIFwiZmllbGRfbWFwX3NjcmlwdFwiKVxuXHR2YWx1ZXMgPSBmdW5jKHJlY29yZClcblx0aWYgXy5pc09iamVjdCB2YWx1ZXNcblx0XHRyZXR1cm4gdmFsdWVzXG5cdGVsc2Vcblx0XHRjb25zb2xlLmVycm9yIFwiZXZhbEZpZWxkTWFwU2NyaXB0OiDohJrmnKzov5Tlm57lgLznsbvlnovkuI3mmK/lr7nosaFcIlxuXHRyZXR1cm4ge31cblxuXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2ggPSAocmVjb3JkSWRzLCBzcGFjZUlkLCBpbnNJZCwgYXBwcm92ZUlkKSAtPlxuXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbJ2Ntc19maWxlcyddLmZpbmQoe1xuXHRcdHNwYWNlOiBzcGFjZUlkLFxuXHRcdHBhcmVudDogcmVjb3JkSWRzXG5cdH0pLmZvckVhY2ggKGNmKSAtPlxuXHRcdF8uZWFjaCBjZi52ZXJzaW9ucywgKHZlcnNpb25JZCwgaWR4KSAtPlxuXHRcdFx0ZiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ10uZmluZE9uZSh2ZXJzaW9uSWQpXG5cdFx0XHRuZXdGaWxlID0gbmV3IEZTLkZpbGUoKVxuXG5cdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEgZi5jcmVhdGVSZWFkU3RyZWFtKCdmaWxlcycpLCB7XG5cdFx0XHRcdFx0dHlwZTogZi5vcmlnaW5hbC50eXBlXG5cdFx0XHR9LCAoZXJyKSAtPlxuXHRcdFx0XHRpZiAoZXJyKVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyLmVycm9yLCBlcnIucmVhc29uKVxuXG5cdFx0XHRcdG5ld0ZpbGUubmFtZShmLm5hbWUoKSlcblx0XHRcdFx0bmV3RmlsZS5zaXplKGYuc2l6ZSgpKVxuXHRcdFx0XHRtZXRhZGF0YSA9IHtcblx0XHRcdFx0XHRvd25lcjogZi5tZXRhZGF0YS5vd25lcixcblx0XHRcdFx0XHRvd25lcl9uYW1lOiBmLm1ldGFkYXRhLm93bmVyX25hbWUsXG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXG5cdFx0XHRcdFx0aW5zdGFuY2U6IGluc0lkLFxuXHRcdFx0XHRcdGFwcHJvdmU6IGFwcHJvdmVJZFxuXHRcdFx0XHRcdHBhcmVudDogY2YuX2lkXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiBpZHggaXMgMFxuXHRcdFx0XHRcdG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlXG5cblx0XHRcdFx0bmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhXG5cdFx0XHRcdGNmcy5pbnN0YW5jZXMuaW5zZXJ0KG5ld0ZpbGUpXG5cblx0cmV0dXJuXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8gPSAocmVjb3JkSWRzLCBpbnNJZCwgc3BhY2VJZCkgLT5cblx0IyBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLnVwZGF0ZShyZWNvcmRJZHMuaWRzWzBdLCB7XG5cdCMgXHQkcHVzaDoge1xuXHQjIFx0XHRpbnN0YW5jZXM6IHtcblx0IyBcdFx0XHQkZWFjaDogW3tcblx0IyBcdFx0XHRcdF9pZDogaW5zSWQsXG5cdCMgXHRcdFx0XHRzdGF0ZTogJ2RyYWZ0J1xuXHQjIFx0XHRcdH1dLFxuXHQjIFx0XHRcdCRwb3NpdGlvbjogMFxuXHQjIFx0XHR9XG5cdCMgXHR9LFxuXHQjIFx0JHNldDoge1xuXHQjIFx0XHRsb2NrZWQ6IHRydWVcblx0IyBcdFx0aW5zdGFuY2Vfc3RhdGU6ICdkcmFmdCdcblx0IyBcdH1cblx0IyB9KVxuXHRvYmplY3RVcGRhdGUocmVjb3JkSWRzLm8sIHJlY29yZElkcy5pZHNbMF0sIHtcblx0XHRpbnN0YW5jZXM6IFt7XG5cdFx0XHRfaWQ6IGluc0lkLFxuXHRcdFx0c3RhdGU6ICdkcmFmdCdcblx0XHR9XSxcblx0XHRsb2NrZWQ6IHRydWUsXG5cdFx0aW5zdGFuY2Vfc3RhdGU6ICdkcmFmdCdcblx0fSlcblxuXHRyZXR1cm5cblxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyA9IChyZWxhdGVkVGFibGVzSW5mbywgaW5zSWQsIHNwYWNlSWQpIC0+XG5cdF8uZWFjaCByZWxhdGVkVGFibGVzSW5mbywgKHRhYmxlSXRlbXMsIHJlbGF0ZWRPYmplY3ROYW1lKSAtPlxuXHRcdHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKVxuXHRcdF8uZWFjaCB0YWJsZUl0ZW1zLCAoaXRlbSkgLT5cblx0XHRcdHJlbGF0ZWRDb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoaXRlbS5fdGFibGUuX2lkLCB7XG5cdFx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0XHRpbnN0YW5jZXM6IFt7XG5cdFx0XHRcdFx0XHRfaWQ6IGluc0lkLFxuXHRcdFx0XHRcdFx0c3RhdGU6ICdkcmFmdCdcblx0XHRcdFx0XHR9XSxcblx0XHRcdFx0XHRfdGFibGU6IGl0ZW0uX3RhYmxlXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cblx0cmV0dXJuXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tJc0luQXBwcm92YWwgPSAocmVjb3JkSWRzLCBzcGFjZUlkKSAtPlxuXHQjIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkuZmluZE9uZSh7XG5cdCMgXHRfaWQ6IHJlY29yZElkcy5pZHNbMF0sIGluc3RhbmNlczogeyAkZXhpc3RzOiB0cnVlIH1cblx0IyB9LCB7IGZpZWxkczogeyBpbnN0YW5jZXM6IDEgfSB9KVxuXHRyZWNvcmQgPSBvYmplY3RGaW5kT25lKHJlY29yZElkcy5vLCB7IGZpbHRlcnM6IFtbJ19pZCcsICc9JywgcmVjb3JkSWRzLmlkc1swXV1dLCBmaWVsZHM6IFsnaW5zdGFuY2VzJ10gfSlcblxuXHRpZiByZWNvcmQgYW5kIHJlY29yZC5pbnN0YW5jZXMgYW5kIHJlY29yZC5pbnN0YW5jZXNbMF0uc3RhdGUgaXNudCAnY29tcGxldGVkJyBhbmQgQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZChyZWNvcmQuaW5zdGFuY2VzWzBdLl9pZCkuY291bnQoKSA+IDBcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuatpOiusOW9leW3suWPkei1t+a1geeoi+ato+WcqOWuoeaJueS4re+8jOW+heWuoeaJuee7k+adn+aWueWPr+WPkei1t+S4i+S4gOasoeWuoeaJue+8gVwiKVxuXG5cdHJldHVyblxuXG4iLCJ2YXIgX2V2YWwsIGdldE9iamVjdENvbmZpZywgZ2V0T2JqZWN0TmFtZUZpZWxkS2V5LCBnZXRSZWxhdGVkcywgb2JqZWN0RmluZCwgb2JqZWN0RmluZE9uZSwgb2JqZWN0VXBkYXRlLCBvYmplY3RxbDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuX2V2YWwgPSByZXF1aXJlKCdldmFsJyk7XG5cbm9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcblxuZ2V0T2JqZWN0Q29uZmlnID0gZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSkge1xuICByZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLnRvQ29uZmlnKCk7XG59O1xuXG5nZXRPYmplY3ROYW1lRmllbGRLZXkgPSBmdW5jdGlvbihvYmplY3RBcGlOYW1lKSB7XG4gIHJldHVybiBvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkuTkFNRV9GSUVMRF9LRVk7XG59O1xuXG5nZXRSZWxhdGVkcyA9IGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUpIHtcbiAgcmV0dXJuIE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSwgY2IpIHtcbiAgICByZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLmdldFJlbGF0ZWRzKCkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgIH0pO1xuICB9KShvYmplY3RBcGlOYW1lKTtcbn07XG5cbm9iamVjdEZpbmRPbmUgPSBmdW5jdGlvbihvYmplY3RBcGlOYW1lLCBxdWVyeSkge1xuICByZXR1cm4gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihvYmplY3RBcGlOYW1lLCBxdWVyeSwgY2IpIHtcbiAgICByZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLmZpbmQocXVlcnkpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBpZiAocmVzb2x2ZSAmJiByZXNvbHZlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZVswXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY2IocmVqZWN0LCBudWxsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSkob2JqZWN0QXBpTmFtZSwgcXVlcnkpO1xufTtcblxub2JqZWN0RmluZCA9IGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUsIHF1ZXJ5KSB7XG4gIHJldHVybiBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUsIHF1ZXJ5LCBjYikge1xuICAgIHJldHVybiBvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkuZmluZChxdWVyeSkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgIH0pO1xuICB9KShvYmplY3RBcGlOYW1lLCBxdWVyeSk7XG59O1xuXG5vYmplY3RVcGRhdGUgPSBmdW5jdGlvbihvYmplY3RBcGlOYW1lLCBpZCwgZGF0YSkge1xuICByZXR1cm4gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihvYmplY3RBcGlOYW1lLCBpZCwgZGF0YSwgY2IpIHtcbiAgICByZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLnVwZGF0ZShpZCwgZGF0YSkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgIH0pO1xuICB9KShvYmplY3RBcGlOYW1lLCBpZCwgZGF0YSk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge307XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbiA9IGZ1bmN0aW9uKHJlcSkge1xuICB2YXIgYXV0aFRva2VuLCBoYXNoZWRUb2tlbiwgcXVlcnksIHVzZXIsIHVzZXJJZDtcbiAgcXVlcnkgPSByZXEucXVlcnk7XG4gIHVzZXJJZCA9IHF1ZXJ5W1wiWC1Vc2VyLUlkXCJdO1xuICBhdXRoVG9rZW4gPSBxdWVyeVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICBfaWQ6IHVzZXJJZCxcbiAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICB9KTtcbiAgaWYgKCF1c2VyKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICByZXR1cm4gdXNlcjtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2UgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICB2YXIgc3BhY2U7XG4gIHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gIGlmICghc3BhY2UpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInNwYWNlX2lk5pyJ6K+v5oiW5q2kc3BhY2Xlt7Lnu4/ooqvliKDpmaRcIik7XG4gIH1cbiAgcmV0dXJuIHNwYWNlO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93ID0gZnVuY3Rpb24oZmxvd19pZCkge1xuICB2YXIgZmxvdztcbiAgZmxvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZmxvd3MuZmluZE9uZShmbG93X2lkKTtcbiAgaWYgKCFmbG93KSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJpZOacieivr+aIluatpOa1geeoi+W3sue7j+iiq+WIoOmZpFwiKTtcbiAgfVxuICByZXR1cm4gZmxvdztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyID0gZnVuY3Rpb24oc3BhY2VfaWQsIHVzZXJfaWQpIHtcbiAgdmFyIHNwYWNlX3VzZXI7XG4gIHNwYWNlX3VzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB1c2VyOiB1c2VyX2lkXG4gIH0pO1xuICBpZiAoIXNwYWNlX3VzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInVzZXJfaWTlr7nlupTnmoTnlKjmiLfkuI3lsZ7kuo7lvZPliY1zcGFjZVwiKTtcbiAgfVxuICByZXR1cm4gc3BhY2VfdXNlcjtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyA9IGZ1bmN0aW9uKHNwYWNlX3VzZXIpIHtcbiAgdmFyIGluZm8sIG9yZztcbiAgaW5mbyA9IG5ldyBPYmplY3Q7XG4gIGluZm8ub3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb247XG4gIG9yZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub3JnYW5pemF0aW9ucy5maW5kT25lKHNwYWNlX3VzZXIub3JnYW5pemF0aW9uLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBuYW1lOiAxLFxuICAgICAgZnVsbG5hbWU6IDFcbiAgICB9XG4gIH0pO1xuICBpbmZvLm9yZ2FuaXphdGlvbl9uYW1lID0gb3JnLm5hbWU7XG4gIGluZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gb3JnLmZ1bGxuYW1lO1xuICByZXR1cm4gaW5mbztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZCA9IGZ1bmN0aW9uKGZsb3cpIHtcbiAgaWYgKGZsb3cuc3RhdGUgIT09IFwiZW5hYmxlZFwiKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvmnKrlkK/nlKgs5pON5L2c5aSx6LSlXCIpO1xuICB9XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZCA9IGZ1bmN0aW9uKGZsb3csIHNwYWNlX2lkKSB7XG4gIGlmIChmbG93LnNwYWNlICE9PSBzcGFjZV9pZCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5ZKM5bel5L2c5Yy6SUTkuI3ljLnphY1cIik7XG4gIH1cbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybSA9IGZ1bmN0aW9uKGZvcm1faWQpIHtcbiAgdmFyIGZvcm07XG4gIGZvcm0gPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZvcm1zLmZpbmRPbmUoZm9ybV9pZCk7XG4gIGlmICghZm9ybSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsICfooajljZVJROacieivr+aIluatpOihqOWNleW3sue7j+iiq+WIoOmZpCcpO1xuICB9XG4gIHJldHVybiBmb3JtO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeSA9IGZ1bmN0aW9uKGNhdGVnb3J5X2lkKSB7XG4gIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLmNhdGVnb3JpZXMuZmluZE9uZShjYXRlZ29yeV9pZCk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrU3luY0RpcmVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmbG93X2lkKSB7XG4gIHZhciBvdywgc3luY0RpcmVjdGlvbjtcbiAgb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIGZsb3dfaWQ6IGZsb3dfaWRcbiAgfSk7XG4gIGlmICghb3cpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn5pyq5om+5Yiw5a+56LGh5rWB56iL5pig5bCE6K6w5b2V44CCJyk7XG4gIH1cbiAgc3luY0RpcmVjdGlvbiA9IG93LnN5bmNfZGlyZWN0aW9uIHx8ICdib3RoJztcbiAgaWYgKCFbJ2JvdGgnLCAnb2JqX3RvX2lucyddLmluY2x1ZGVzKHN5bmNEaXJlY3Rpb24pKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+S4jeaUr+aMgeeahOWQjOatpeaWueWQkeOAgicpO1xuICB9XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNyZWF0ZV9pbnN0YW5jZSA9IGZ1bmN0aW9uKGluc3RhbmNlX2Zyb21fY2xpZW50LCB1c2VyX2luZm8pIHtcbiAgdmFyIGFwcHJfb2JqLCBhcHByb3ZlX2Zyb21fY2xpZW50LCBjYXRlZ29yeSwgZmxvdywgZmxvd19pZCwgZm9ybSwgaW5zX29iaiwgbmV3X2luc19pZCwgbm93LCBwZXJtaXNzaW9ucywgcmVsYXRlZFRhYmxlc0luZm8sIHNwYWNlLCBzcGFjZV9pZCwgc3BhY2VfdXNlciwgc3BhY2VfdXNlcl9vcmdfaW5mbywgc3RhcnRfc3RlcCwgdHJhY2VfZnJvbV9jbGllbnQsIHRyYWNlX29iaiwgdXNlcl9pZDtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0sIFN0cmluZyk7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0sIFN0cmluZyk7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXSwgU3RyaW5nKTtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdLCBbXG4gICAge1xuICAgICAgbzogU3RyaW5nLFxuICAgICAgaWRzOiBbU3RyaW5nXVxuICAgIH1cbiAgXSk7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tTeW5jRGlyZWN0aW9uKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVswXS5vLCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl0pO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVswXSwgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSk7XG4gIHNwYWNlX2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXTtcbiAgZmxvd19pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXTtcbiAgdXNlcl9pZCA9IHVzZXJfaW5mby5faWQ7XG4gIHRyYWNlX2Zyb21fY2xpZW50ID0gbnVsbDtcbiAgYXBwcm92ZV9mcm9tX2NsaWVudCA9IG51bGw7XG4gIGlmIChpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXSAmJiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXSkge1xuICAgIHRyYWNlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF07XG4gICAgaWYgKHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl0gJiYgdHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXVswXSkge1xuICAgICAgYXBwcm92ZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdW1wiYXBwcm92ZXNcIl1bMF07XG4gICAgfVxuICB9XG4gIHNwYWNlID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZShzcGFjZV9pZCk7XG4gIGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZCk7XG4gIHNwYWNlX3VzZXIgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlcihzcGFjZV9pZCwgdXNlcl9pZCk7XG4gIHNwYWNlX3VzZXJfb3JnX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8oc3BhY2VfdXNlcik7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZChmbG93KTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQoZmxvdywgc3BhY2VfaWQpO1xuICBmb3JtID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtKGZsb3cuZm9ybSk7XG4gIHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dfaWQsIHVzZXJfaWQpO1xuICBpZiAoIXBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRkXCIpKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLlvZPliY3nlKjmiLfmsqHmnInmraTmtYHnqIvnmoTmlrDlu7rmnYPpmZBcIik7XG4gIH1cbiAgbm93ID0gbmV3IERhdGU7XG4gIGluc19vYmogPSB7fTtcbiAgaW5zX29iai5faWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5fbWFrZU5ld0lEKCk7XG4gIGluc19vYmouc3BhY2UgPSBzcGFjZV9pZDtcbiAgaW5zX29iai5mbG93ID0gZmxvd19pZDtcbiAgaW5zX29iai5mbG93X3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuX2lkO1xuICBpbnNfb2JqLmZvcm0gPSBmbG93LmZvcm07XG4gIGluc19vYmouZm9ybV92ZXJzaW9uID0gZmxvdy5jdXJyZW50LmZvcm1fdmVyc2lvbjtcbiAgaW5zX29iai5uYW1lID0gZmxvdy5uYW1lO1xuICBpbnNfb2JqLnN1Ym1pdHRlciA9IHVzZXJfaWQ7XG4gIGluc19vYmouc3VibWl0dGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIDogdXNlcl9pZDtcbiAgaW5zX29iai5hcHBsaWNhbnRfbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIDogdXNlcl9pbmZvLm5hbWU7XG4gIGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbiA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSA6IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uO1xuICBpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gOiBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9uYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gOiBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnRfY29tcGFueSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdIDogc3BhY2VfdXNlci5jb21wYW55X2lkO1xuICBpbnNfb2JqLnN0YXRlID0gJ2RyYWZ0JztcbiAgaW5zX29iai5jb2RlID0gJyc7XG4gIGluc19vYmouaXNfYXJjaGl2ZWQgPSBmYWxzZTtcbiAgaW5zX29iai5pc19kZWxldGVkID0gZmFsc2U7XG4gIGluc19vYmouY3JlYXRlZCA9IG5vdztcbiAgaW5zX29iai5jcmVhdGVkX2J5ID0gdXNlcl9pZDtcbiAgaW5zX29iai5tb2RpZmllZCA9IG5vdztcbiAgaW5zX29iai5tb2RpZmllZF9ieSA9IHVzZXJfaWQ7XG4gIGluc19vYmoucmVjb3JkX2lkcyA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXTtcbiAgaWYgKHNwYWNlX3VzZXIuY29tcGFueV9pZCkge1xuICAgIGluc19vYmouY29tcGFueV9pZCA9IHNwYWNlX3VzZXIuY29tcGFueV9pZDtcbiAgfVxuICB0cmFjZV9vYmogPSB7fTtcbiAgdHJhY2Vfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHI7XG4gIHRyYWNlX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkO1xuICB0cmFjZV9vYmouaXNfZmluaXNoZWQgPSBmYWxzZTtcbiAgc3RhcnRfc3RlcCA9IF8uZmluZChmbG93LmN1cnJlbnQuc3RlcHMsIGZ1bmN0aW9uKHN0ZXApIHtcbiAgICByZXR1cm4gc3RlcC5zdGVwX3R5cGUgPT09ICdzdGFydCc7XG4gIH0pO1xuICB0cmFjZV9vYmouc3RlcCA9IHN0YXJ0X3N0ZXAuX2lkO1xuICB0cmFjZV9vYmoubmFtZSA9IHN0YXJ0X3N0ZXAubmFtZTtcbiAgdHJhY2Vfb2JqLnN0YXJ0X2RhdGUgPSBub3c7XG4gIGFwcHJfb2JqID0ge307XG4gIGFwcHJfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHI7XG4gIGFwcHJfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWQ7XG4gIGFwcHJfb2JqLnRyYWNlID0gdHJhY2Vfb2JqLl9pZDtcbiAgYXBwcl9vYmouaXNfZmluaXNoZWQgPSBmYWxzZTtcbiAgYXBwcl9vYmoudXNlciA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gOiB1c2VyX2lkO1xuICBhcHByX29iai51c2VyX25hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA6IHVzZXJfaW5mby5uYW1lO1xuICBhcHByX29iai5oYW5kbGVyID0gdXNlcl9pZDtcbiAgYXBwcl9vYmouaGFuZGxlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWU7XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb247XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX25hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLm5hbWU7XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5mdWxsbmFtZTtcbiAgYXBwcl9vYmoudHlwZSA9ICdkcmFmdCc7XG4gIGFwcHJfb2JqLnN0YXJ0X2RhdGUgPSBub3c7XG4gIGFwcHJfb2JqLnJlYWRfZGF0ZSA9IG5vdztcbiAgYXBwcl9vYmouaXNfcmVhZCA9IHRydWU7XG4gIGFwcHJfb2JqLmlzX2Vycm9yID0gZmFsc2U7XG4gIGFwcHJfb2JqLmRlc2NyaXB0aW9uID0gJyc7XG4gIHJlbGF0ZWRUYWJsZXNJbmZvID0ge307XG4gIGFwcHJfb2JqLnZhbHVlcyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMoaW5zX29iai5yZWNvcmRfaWRzWzBdLCBmbG93X2lkLCBzcGFjZV9pZCwgZm9ybS5jdXJyZW50LmZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pO1xuICB0cmFjZV9vYmouYXBwcm92ZXMgPSBbYXBwcl9vYmpdO1xuICBpbnNfb2JqLnRyYWNlcyA9IFt0cmFjZV9vYmpdO1xuICBpbnNfb2JqLnZhbHVlcyA9IGFwcHJfb2JqLnZhbHVlcztcbiAgaW5zX29iai5pbmJveF91c2VycyA9IGluc3RhbmNlX2Zyb21fY2xpZW50LmluYm94X3VzZXJzIHx8IFtdO1xuICBpbnNfb2JqLmN1cnJlbnRfc3RlcF9uYW1lID0gc3RhcnRfc3RlcC5uYW1lO1xuICBpZiAoZmxvdy5hdXRvX3JlbWluZCA9PT0gdHJ1ZSkge1xuICAgIGluc19vYmouYXV0b19yZW1pbmQgPSB0cnVlO1xuICB9XG4gIGluc19vYmouZmxvd19uYW1lID0gZmxvdy5uYW1lO1xuICBpZiAoZm9ybS5jYXRlZ29yeSkge1xuICAgIGNhdGVnb3J5ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeShmb3JtLmNhdGVnb3J5KTtcbiAgICBpZiAoY2F0ZWdvcnkpIHtcbiAgICAgIGluc19vYmouY2F0ZWdvcnlfbmFtZSA9IGNhdGVnb3J5Lm5hbWU7XG4gICAgICBpbnNfb2JqLmNhdGVnb3J5ID0gY2F0ZWdvcnkuX2lkO1xuICAgIH1cbiAgfVxuICBuZXdfaW5zX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuaW5zZXJ0KGluc19vYmopO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvKGluc19vYmoucmVjb3JkX2lkc1swXSwgbmV3X2luc19pZCwgc3BhY2VfaWQpO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoKGluc19vYmoucmVjb3JkX2lkc1swXSwgc3BhY2VfaWQsIGluc19vYmouX2lkLCBhcHByX29iai5faWQpO1xuICByZXR1cm4gbmV3X2luc19pZDtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMgPSBmdW5jdGlvbihyZWNvcmRJZHMsIGZsb3dJZCwgc3BhY2VJZCwgZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbykge1xuICB2YXIgZmllbGRDb2RlcywgZmlsdGVyVmFsdWVzLCBmbG93LCBmb3JtLCBmb3JtRmllbGRzLCBmb3JtVGFibGVGaWVsZHMsIGZvcm1UYWJsZUZpZWxkc0NvZGUsIGdldEZpZWxkT2RhdGFWYWx1ZSwgZ2V0Rm9ybUZpZWxkLCBnZXRGb3JtVGFibGVGaWVsZCwgZ2V0Rm9ybVRhYmxlRmllbGRDb2RlLCBnZXRGb3JtVGFibGVTdWJGaWVsZCwgZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSwgZ2V0U2VsZWN0T3JnVmFsdWUsIGdldFNlbGVjdE9yZ1ZhbHVlcywgZ2V0U2VsZWN0VXNlclZhbHVlLCBnZXRTZWxlY3RVc2VyVmFsdWVzLCBvYmplY3QsIG9iamVjdE5hbWUsIG93LCByZWNvcmQsIHJlY29yZElkLCByZWYsIHJlbGF0ZWRPYmplY3RzLCByZWxhdGVkT2JqZWN0c0tleXMsIHRhYmxlRmllbGRDb2RlcywgdGFibGVGaWVsZE1hcCwgdGFibGVUb1JlbGF0ZWRNYXAsIHZhbHVlcztcbiAgZmllbGRDb2RlcyA9IFtdO1xuICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgaWYgKGYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKGYuZmllbGRzLCBmdW5jdGlvbihmZikge1xuICAgICAgICByZXR1cm4gZmllbGRDb2Rlcy5wdXNoKGZmLmNvZGUpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaWVsZENvZGVzLnB1c2goZi5jb2RlKTtcbiAgICB9XG4gIH0pO1xuICB2YWx1ZXMgPSB7fTtcbiAgb2JqZWN0TmFtZSA9IHJlY29yZElkcy5vO1xuICBvYmplY3QgPSBnZXRPYmplY3RDb25maWcob2JqZWN0TmFtZSk7XG4gIHJlY29yZElkID0gcmVjb3JkSWRzLmlkc1swXTtcbiAgb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXG4gICAgZmxvd19pZDogZmxvd0lkXG4gIH0pO1xuICByZWNvcmQgPSBvYmplY3RGaW5kT25lKG9iamVjdE5hbWUsIHtcbiAgICBmaWx0ZXJzOiBbWydfaWQnLCAnPScsIHJlY29yZElkXV1cbiAgfSk7XG4gIGZsb3cgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShmbG93SWQsIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGZvcm06IDFcbiAgICB9XG4gIH0pO1xuICBpZiAob3cgJiYgcmVjb3JkKSB7XG4gICAgZm9ybSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImZvcm1zXCIpLmZpbmRPbmUoZmxvdy5mb3JtKTtcbiAgICBmb3JtRmllbGRzID0gZm9ybS5jdXJyZW50LmZpZWxkcyB8fCBbXTtcbiAgICByZWxhdGVkT2JqZWN0cyA9IGdldFJlbGF0ZWRzKG9iamVjdE5hbWUpO1xuICAgIHJlbGF0ZWRPYmplY3RzS2V5cyA9IF8ucGx1Y2socmVsYXRlZE9iamVjdHMsICdvYmplY3RfbmFtZScpO1xuICAgIGZvcm1UYWJsZUZpZWxkcyA9IF8uZmlsdGVyKGZvcm1GaWVsZHMsIGZ1bmN0aW9uKGZvcm1GaWVsZCkge1xuICAgICAgcmV0dXJuIGZvcm1GaWVsZC50eXBlID09PSAndGFibGUnO1xuICAgIH0pO1xuICAgIGZvcm1UYWJsZUZpZWxkc0NvZGUgPSBfLnBsdWNrKGZvcm1UYWJsZUZpZWxkcywgJ2NvZGUnKTtcbiAgICBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKHJlbGF0ZWRPYmplY3RzS2V5cywgZnVuY3Rpb24ocmVsYXRlZE9iamVjdHNLZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleS5zdGFydHNXaXRoKHJlbGF0ZWRPYmplY3RzS2V5ICsgJy4nKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlRmllbGRDb2RlID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKGZvcm1UYWJsZUZpZWxkc0NvZGUsIGZ1bmN0aW9uKGZvcm1UYWJsZUZpZWxkQ29kZSkge1xuICAgICAgICByZXR1cm4ga2V5LnN0YXJ0c1dpdGgoZm9ybVRhYmxlRmllbGRDb2RlICsgJy4nKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlRmllbGQgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBfLmZpbmQoZm9ybVRhYmxlRmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgIHJldHVybiBmLmNvZGUgPT09IGtleTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybUZpZWxkID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgZmY7XG4gICAgICBmZiA9IG51bGw7XG4gICAgICBfLmZvckVhY2goZm9ybUZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgICAgICBpZiAoZmYpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIGZmID0gXy5maW5kKGYuZmllbGRzLCBmdW5jdGlvbihzZikge1xuICAgICAgICAgICAgcmV0dXJuIHNmLmNvZGUgPT09IGtleTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChmLmNvZGUgPT09IGtleSkge1xuICAgICAgICAgIHJldHVybiBmZiA9IGY7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZmO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlU3ViRmllbGQgPSBmdW5jdGlvbih0YWJsZUZpZWxkLCBzdWJGaWVsZENvZGUpIHtcbiAgICAgIHJldHVybiBfLmZpbmQodGFibGVGaWVsZC5maWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgcmV0dXJuIGYuY29kZSA9PT0gc3ViRmllbGRDb2RlO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRGaWVsZE9kYXRhVmFsdWUgPSBmdW5jdGlvbihvYmpOYW1lLCBpZCkge1xuICAgICAgdmFyIF9yZWNvcmQsIF9yZWNvcmRzLCBuYW1lS2V5LCBvYmo7XG4gICAgICBvYmogPSBvYmplY3RxbC5nZXRPYmplY3Qob2JqTmFtZSk7XG4gICAgICBuYW1lS2V5ID0gZ2V0T2JqZWN0TmFtZUZpZWxkS2V5KG9iak5hbWUpO1xuICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKF8uaXNTdHJpbmcoaWQpKSB7XG4gICAgICAgIF9yZWNvcmQgPSBvYmplY3RGaW5kT25lKG9iak5hbWUsIHtcbiAgICAgICAgICBmaWx0ZXJzOiBbWydfaWQnLCAnPScsIGlkXV1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChfcmVjb3JkKSB7XG4gICAgICAgICAgX3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkW25hbWVLZXldO1xuICAgICAgICAgIHJldHVybiBfcmVjb3JkO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKF8uaXNBcnJheShpZCkpIHtcbiAgICAgICAgX3JlY29yZHMgPSBbXTtcbiAgICAgICAgb2JqZWN0RmluZChvYmpOYW1lLCB7XG4gICAgICAgICAgZmlsdGVyczogW1snX2lkJywgJ2luJywgaWRdXVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKF9yZWNvcmQpIHtcbiAgICAgICAgICBfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmRbbmFtZUtleV07XG4gICAgICAgICAgcmV0dXJuIF9yZWNvcmRzLnB1c2goX3JlY29yZCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIV8uaXNFbXB0eShfcmVjb3JkcykpIHtcbiAgICAgICAgICByZXR1cm4gX3JlY29yZHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGdldFNlbGVjdFVzZXJWYWx1ZSA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICAgICAgdmFyIHN1O1xuICAgICAgc3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0pO1xuICAgICAgc3UuaWQgPSB1c2VySWQ7XG4gICAgICByZXR1cm4gc3U7XG4gICAgfTtcbiAgICBnZXRTZWxlY3RVc2VyVmFsdWVzID0gZnVuY3Rpb24odXNlcklkcywgc3BhY2VJZCkge1xuICAgICAgdmFyIHN1cztcbiAgICAgIHN1cyA9IFtdO1xuICAgICAgaWYgKF8uaXNBcnJheSh1c2VySWRzKSkge1xuICAgICAgICBfLmVhY2godXNlcklkcywgZnVuY3Rpb24odXNlcklkKSB7XG4gICAgICAgICAgdmFyIHN1O1xuICAgICAgICAgIHN1ID0gZ2V0U2VsZWN0VXNlclZhbHVlKHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgICAgICAgaWYgKHN1KSB7XG4gICAgICAgICAgICByZXR1cm4gc3VzLnB1c2goc3UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VzO1xuICAgIH07XG4gICAgZ2V0U2VsZWN0T3JnVmFsdWUgPSBmdW5jdGlvbihvcmdJZCwgc3BhY2VJZCkge1xuICAgICAgdmFyIG9yZztcbiAgICAgIG9yZyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmRPbmUob3JnSWQsIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBvcmcuaWQgPSBvcmdJZDtcbiAgICAgIHJldHVybiBvcmc7XG4gICAgfTtcbiAgICBnZXRTZWxlY3RPcmdWYWx1ZXMgPSBmdW5jdGlvbihvcmdJZHMsIHNwYWNlSWQpIHtcbiAgICAgIHZhciBvcmdzO1xuICAgICAgb3JncyA9IFtdO1xuICAgICAgaWYgKF8uaXNBcnJheShvcmdJZHMpKSB7XG4gICAgICAgIF8uZWFjaChvcmdJZHMsIGZ1bmN0aW9uKG9yZ0lkKSB7XG4gICAgICAgICAgdmFyIG9yZztcbiAgICAgICAgICBvcmcgPSBnZXRTZWxlY3RPcmdWYWx1ZShvcmdJZCwgc3BhY2VJZCk7XG4gICAgICAgICAgaWYgKG9yZykge1xuICAgICAgICAgICAgcmV0dXJuIG9yZ3MucHVzaChvcmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3JncztcbiAgICB9O1xuICAgIHRhYmxlRmllbGRDb2RlcyA9IFtdO1xuICAgIHRhYmxlRmllbGRNYXAgPSBbXTtcbiAgICB0YWJsZVRvUmVsYXRlZE1hcCA9IHt9O1xuICAgIGlmICgocmVmID0gb3cuZmllbGRfbWFwKSAhPSBudWxsKSB7XG4gICAgICByZWYuZm9yRWFjaChmdW5jdGlvbihmbSkge1xuICAgICAgICB2YXIgZm9ybUZpZWxkLCBmb3JtVGFibGVGaWVsZENvZGUsIGdyaWRDb2RlLCBsb29rdXBGaWVsZE5hbWUsIGxvb2t1cEZpZWxkT2JqLCBsb29rdXBPYmplY3RSZWNvcmQsIGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUsIG9UYWJsZUNvZGUsIG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZCwgb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkQ29kZSwgb1RhYmxlRmllbGRDb2RlLCBvYmpGaWVsZCwgb2JqZWN0RmllbGQsIG9iamVjdEZpZWxkTmFtZSwgb2JqZWN0RmllbGRPYmplY3ROYW1lLCBvYmplY3RMb29rdXBGaWVsZCwgb2JqZWN0X2ZpZWxkLCBvZGF0YUZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRG9jLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVsYXRlZE9iamVjdEZpZWxkQ29kZSwgc2VsZWN0RmllbGRWYWx1ZSwgdGFibGVUb1JlbGF0ZWRNYXBLZXksIHdUYWJsZUNvZGUsIHdvcmtmbG93X2ZpZWxkO1xuICAgICAgICBvYmplY3RfZmllbGQgPSBmbS5vYmplY3RfZmllbGQ7XG4gICAgICAgIHdvcmtmbG93X2ZpZWxkID0gZm0ud29ya2Zsb3dfZmllbGQ7XG4gICAgICAgIGlmICghb2JqZWN0X2ZpZWxkIHx8ICF3b3JrZmxvd19maWVsZCkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAn5pyq5om+5Yiw5a2X5q6177yM6K+35qOA5p+l5a+56LGh5rWB56iL5pig5bCE5a2X5q616YWN572uJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmVsYXRlZE9iamVjdEZpZWxkQ29kZSA9IGdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUob2JqZWN0X2ZpZWxkKTtcbiAgICAgICAgZm9ybVRhYmxlRmllbGRDb2RlID0gZ2V0Rm9ybVRhYmxlRmllbGRDb2RlKHdvcmtmbG93X2ZpZWxkKTtcbiAgICAgICAgb2JqRmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdF9maWVsZF07XG4gICAgICAgIGZvcm1GaWVsZCA9IGdldEZvcm1GaWVsZCh3b3JrZmxvd19maWVsZCk7XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0RmllbGRDb2RlKSB7XG4gICAgICAgICAgb1RhYmxlQ29kZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgIG9UYWJsZUZpZWxkQ29kZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgIHRhYmxlVG9SZWxhdGVkTWFwS2V5ID0gb1RhYmxlQ29kZTtcbiAgICAgICAgICBpZiAoIXRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSkge1xuICAgICAgICAgICAgdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmb3JtVGFibGVGaWVsZENvZGUpIHtcbiAgICAgICAgICAgIHdUYWJsZUNvZGUgPSB3b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgICAgdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldWydfRlJPTV9UQUJMRV9DT0RFJ10gPSB3VGFibGVDb2RlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldW29UYWJsZUZpZWxkQ29kZV0gPSB3b3JrZmxvd19maWVsZDtcbiAgICAgICAgfSBlbHNlIGlmICh3b3JrZmxvd19maWVsZC5pbmRleE9mKCcuJykgPiAwICYmIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA+IDApIHtcbiAgICAgICAgICB3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICBvVGFibGVDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJC4nKVswXTtcbiAgICAgICAgICBpZiAocmVjb3JkLmhhc093blByb3BlcnR5KG9UYWJsZUNvZGUpICYmIF8uaXNBcnJheShyZWNvcmRbb1RhYmxlQ29kZV0pKSB7XG4gICAgICAgICAgICB0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgIHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXG4gICAgICAgICAgICAgIG9iamVjdF90YWJsZV9maWVsZF9jb2RlOiBvVGFibGVDb2RlXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICByZXR1cm4gdGFibGVGaWVsZE1hcC5wdXNoKGZtKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG9UYWJsZUNvZGUuaW5kZXhPZignLicpID4gMCkge1xuICAgICAgICAgICAgb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkQ29kZSA9IG9UYWJsZUNvZGUuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIGdyaWRDb2RlID0gb1RhYmxlQ29kZS5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkID0gb2JqZWN0LmZpZWxkc1tvVGFibGVDb2RlUmVmZXJlbmNlRmllbGRDb2RlXTtcbiAgICAgICAgICAgIGlmIChvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgIGlmIChyZWNvcmRbb1RhYmxlQ29kZV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5uYW1lXTtcbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9Eb2MgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpO1xuICAgICAgICAgICAgICBpZiAocmVmZXJlbmNlVG9Eb2NbZ3JpZENvZGVdKSB7XG4gICAgICAgICAgICAgICAgcmVjb3JkW29UYWJsZUNvZGVdID0gcmVmZXJlbmNlVG9Eb2NbZ3JpZENvZGVdO1xuICAgICAgICAgICAgICAgIHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgIHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXG4gICAgICAgICAgICAgICAgICBvYmplY3RfdGFibGVfZmllbGRfY29kZTogb1RhYmxlQ29kZVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFibGVGaWVsZE1hcC5wdXNoKGZtKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChvYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gMCAmJiBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPT09IC0xKSB7XG4gICAgICAgICAgb2JqZWN0RmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgbG9va3VwRmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgaWYgKG9iamVjdCkge1xuICAgICAgICAgICAgb2JqZWN0RmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdEZpZWxkTmFtZV07XG4gICAgICAgICAgICBpZiAob2JqZWN0RmllbGQgJiYgZm9ybUZpZWxkICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgbG9va3VwT2JqZWN0UmVjb3JkID0gb2JqZWN0RmluZE9uZShvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8sIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzOiBbWydfaWQnLCAnPScsIHJlY29yZFtvYmplY3RGaWVsZE5hbWVdXV0sXG4gICAgICAgICAgICAgICAgZmllbGRzOiBbbG9va3VwRmllbGROYW1lXVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYgKCFsb29rdXBPYmplY3RSZWNvcmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb2JqZWN0RmllbGRPYmplY3ROYW1lID0gb2JqZWN0RmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICBsb29rdXBGaWVsZE9iaiA9IGdldE9iamVjdENvbmZpZyhvYmplY3RGaWVsZE9iamVjdE5hbWUpO1xuICAgICAgICAgICAgICBvYmplY3RMb29rdXBGaWVsZCA9IGxvb2t1cEZpZWxkT2JqLmZpZWxkc1tsb29rdXBGaWVsZE5hbWVdO1xuICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBsb29rdXBPYmplY3RSZWNvcmRbbG9va3VwRmllbGROYW1lXTtcbiAgICAgICAgICAgICAgaWYgKG9iamVjdExvb2t1cEZpZWxkICYmIGZvcm1GaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqZWN0TG9va3VwRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICAgIG9kYXRhRmllbGRWYWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAob2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIW9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgIG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gb2RhdGFGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9iamVjdExvb2t1cEZpZWxkICYmIGZvcm1GaWVsZCAmJiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iamVjdExvb2t1cEZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBpZiAoIV8uaXNFbXB0eShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICBsb29rdXBTZWxlY3RGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICAgICAgaWYgKGZvcm1GaWVsZC50eXBlID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdExvb2t1cEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgIGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIW9iamVjdExvb2t1cEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICBsb29rdXBTZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdncm91cCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdExvb2t1cEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgIGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgIGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAobG9va3VwU2VsZWN0RmllbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IGxvb2t1cFNlbGVjdEZpZWxkVmFsdWU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gbG9va3VwT2JqZWN0UmVjb3JkW2xvb2t1cEZpZWxkTmFtZV07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkICYmIG9iakZpZWxkICYmIGZvcm1GaWVsZC50eXBlID09PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iakZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICByZWZlcmVuY2VUb09iamVjdE5hbWUgPSBvYmpGaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdO1xuICAgICAgICAgIG9kYXRhRmllbGRWYWx1ZTtcbiAgICAgICAgICBpZiAob2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgIG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gb2RhdGFGaWVsZFZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iakZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKG9iakZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSByZWNvcmRbb2JqRmllbGQubmFtZV07XG4gICAgICAgICAgaWYgKCFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKSkge1xuICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZTtcbiAgICAgICAgICAgIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ3VzZXInKSB7XG4gICAgICAgICAgICAgIGlmIChvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1GaWVsZC50eXBlID09PSAnZ3JvdXAnKSB7XG4gICAgICAgICAgICAgIGlmIChvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGVjdEZpZWxkVmFsdWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBzZWxlY3RGaWVsZFZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQuaGFzT3duUHJvcGVydHkob2JqZWN0X2ZpZWxkKSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gcmVjb3JkW29iamVjdF9maWVsZF07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBfLnVuaXEodGFibGVGaWVsZENvZGVzKS5mb3JFYWNoKGZ1bmN0aW9uKHRmYykge1xuICAgICAgdmFyIGM7XG4gICAgICBjID0gSlNPTi5wYXJzZSh0ZmMpO1xuICAgICAgdmFsdWVzW2Mud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZV0gPSBbXTtcbiAgICAgIHJldHVybiByZWNvcmRbYy5vYmplY3RfdGFibGVfZmllbGRfY29kZV0uZm9yRWFjaChmdW5jdGlvbih0cikge1xuICAgICAgICB2YXIgbmV3VHI7XG4gICAgICAgIG5ld1RyID0ge307XG4gICAgICAgIF8uZWFjaCh0ciwgZnVuY3Rpb24odiwgaykge1xuICAgICAgICAgIHJldHVybiB0YWJsZUZpZWxkTWFwLmZvckVhY2goZnVuY3Rpb24odGZtKSB7XG4gICAgICAgICAgICB2YXIgd1RkQ29kZTtcbiAgICAgICAgICAgIGlmICh0Zm0ub2JqZWN0X2ZpZWxkID09PSAoYy5vYmplY3RfdGFibGVfZmllbGRfY29kZSArICcuJC4nICsgaykpIHtcbiAgICAgICAgICAgICAgd1RkQ29kZSA9IHRmbS53b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgICByZXR1cm4gbmV3VHJbd1RkQ29kZV0gPSB2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFfLmlzRW1wdHkobmV3VHIpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdLnB1c2gobmV3VHIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBfLmVhY2godGFibGVUb1JlbGF0ZWRNYXAsIGZ1bmN0aW9uKG1hcCwga2V5KSB7XG4gICAgICB2YXIgZm9ybVRhYmxlRmllbGQsIHJlbGF0ZWRDb2xsZWN0aW9uLCByZWxhdGVkRmllbGQsIHJlbGF0ZWRGaWVsZE5hbWUsIHJlbGF0ZWRPYmplY3QsIHJlbGF0ZWRPYmplY3ROYW1lLCByZWxhdGVkUmVjb3JkcywgcmVsYXRlZFRhYmxlSXRlbXMsIHNlbGVjdG9yLCB0YWJsZUNvZGUsIHRhYmxlVmFsdWVzO1xuICAgICAgdGFibGVDb2RlID0gbWFwLl9GUk9NX1RBQkxFX0NPREU7XG4gICAgICBmb3JtVGFibGVGaWVsZCA9IGdldEZvcm1UYWJsZUZpZWxkKHRhYmxlQ29kZSk7XG4gICAgICBpZiAoIXRhYmxlQ29kZSkge1xuICAgICAgICByZXR1cm4gY29uc29sZS53YXJuKCd0YWJsZVRvUmVsYXRlZDogWycgKyBrZXkgKyAnXSBtaXNzaW5nIGNvcnJlc3BvbmRpbmcgdGFibGUuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWxhdGVkT2JqZWN0TmFtZSA9IGtleTtcbiAgICAgICAgdGFibGVWYWx1ZXMgPSBbXTtcbiAgICAgICAgcmVsYXRlZFRhYmxlSXRlbXMgPSBbXTtcbiAgICAgICAgcmVsYXRlZE9iamVjdCA9IGdldE9iamVjdENvbmZpZyhyZWxhdGVkT2JqZWN0TmFtZSk7XG4gICAgICAgIHJlbGF0ZWRGaWVsZCA9IF8uZmluZChyZWxhdGVkT2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgICAgICAgIHJldHVybiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMoZi50eXBlKSAmJiBmLnJlZmVyZW5jZV90byA9PT0gb2JqZWN0TmFtZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlbGF0ZWRGaWVsZE5hbWUgPSByZWxhdGVkRmllbGQubmFtZTtcbiAgICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICAgICAgc2VsZWN0b3JbcmVsYXRlZEZpZWxkTmFtZV0gPSByZWNvcmRJZDtcbiAgICAgICAgcmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpO1xuICAgICAgICByZWxhdGVkUmVjb3JkcyA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpO1xuICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKHJyKSB7XG4gICAgICAgICAgdmFyIHRhYmxlVmFsdWVJdGVtO1xuICAgICAgICAgIHRhYmxlVmFsdWVJdGVtID0ge307XG4gICAgICAgICAgXy5lYWNoKG1hcCwgZnVuY3Rpb24odmFsdWVLZXksIGZpZWxkS2V5KSB7XG4gICAgICAgICAgICB2YXIgZm9ybUZpZWxkLCBmb3JtRmllbGRLZXksIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWxhdGVkT2JqZWN0RmllbGQsIHRhYmxlRmllbGRWYWx1ZTtcbiAgICAgICAgICAgIGlmIChmaWVsZEtleSAhPT0gJ19GUk9NX1RBQkxFX0NPREUnKSB7XG4gICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZTtcbiAgICAgICAgICAgICAgZm9ybUZpZWxkS2V5O1xuICAgICAgICAgICAgICBpZiAodmFsdWVLZXkuc3RhcnRzV2l0aCh0YWJsZUNvZGUgKyAnLicpKSB7XG4gICAgICAgICAgICAgICAgZm9ybUZpZWxkS2V5ID0gKHZhbHVlS2V5LnNwbGl0KFwiLlwiKVsxXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9ybUZpZWxkS2V5ID0gdmFsdWVLZXk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZm9ybUZpZWxkID0gZ2V0Rm9ybVRhYmxlU3ViRmllbGQoZm9ybVRhYmxlRmllbGQsIGZvcm1GaWVsZEtleSk7XG4gICAgICAgICAgICAgIHJlbGF0ZWRPYmplY3RGaWVsZCA9IHJlbGF0ZWRPYmplY3QuZmllbGRzW2ZpZWxkS2V5XTtcbiAgICAgICAgICAgICAgaWYgKCFmb3JtRmllbGQgfHwgIXJlbGF0ZWRPYmplY3RGaWVsZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gcmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV07XG4gICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKGZvcm1GaWVsZC50eXBlKSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcnJbZmllbGRLZXldO1xuICAgICAgICAgICAgICAgIGlmICghXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ3VzZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1GaWVsZC50eXBlID09PSAnZ3JvdXAnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBycltmaWVsZEtleV07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlVmFsdWVJdGVtW2Zvcm1GaWVsZEtleV0gPSB0YWJsZUZpZWxkVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKCFfLmlzRW1wdHkodGFibGVWYWx1ZUl0ZW0pKSB7XG4gICAgICAgICAgICB0YWJsZVZhbHVlSXRlbS5faWQgPSByci5faWQ7XG4gICAgICAgICAgICB0YWJsZVZhbHVlcy5wdXNoKHRhYmxlVmFsdWVJdGVtKTtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkVGFibGVJdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgX3RhYmxlOiB7XG4gICAgICAgICAgICAgICAgX2lkOiByci5faWQsXG4gICAgICAgICAgICAgICAgX2NvZGU6IHRhYmxlQ29kZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB2YWx1ZXNbdGFibGVDb2RlXSA9IHRhYmxlVmFsdWVzO1xuICAgICAgICByZXR1cm4gcmVsYXRlZFRhYmxlc0luZm9bcmVsYXRlZE9iamVjdE5hbWVdID0gcmVsYXRlZFRhYmxlSXRlbXM7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKG93LmZpZWxkX21hcF9zY3JpcHQpIHtcbiAgICAgIF8uZXh0ZW5kKHZhbHVlcywgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5ldmFsRmllbGRNYXBTY3JpcHQob3cuZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgcmVjb3JkSWQpKTtcbiAgICB9XG4gIH1cbiAgZmlsdGVyVmFsdWVzID0ge307XG4gIF8uZWFjaChfLmtleXModmFsdWVzKSwgZnVuY3Rpb24oaykge1xuICAgIGlmIChmaWVsZENvZGVzLmluY2x1ZGVzKGspKSB7XG4gICAgICByZXR1cm4gZmlsdGVyVmFsdWVzW2tdID0gdmFsdWVzW2tdO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmaWx0ZXJWYWx1ZXM7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmV2YWxGaWVsZE1hcFNjcmlwdCA9IGZ1bmN0aW9uKGZpZWxkX21hcF9zY3JpcHQsIG9iamVjdE5hbWUsIHNwYWNlSWQsIG9iamVjdElkKSB7XG4gIHZhciBmdW5jLCByZWNvcmQsIHNjcmlwdCwgdmFsdWVzO1xuICByZWNvcmQgPSBvYmplY3RGaW5kT25lKG9iamVjdE5hbWUsIHtcbiAgICBmaWx0ZXJzOiBbWydfaWQnLCAnPScsIG9iamVjdElkXV1cbiAgfSk7XG4gIHNjcmlwdCA9IFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocmVjb3JkKSB7IFwiICsgZmllbGRfbWFwX3NjcmlwdCArIFwiIH1cIjtcbiAgZnVuYyA9IF9ldmFsKHNjcmlwdCwgXCJmaWVsZF9tYXBfc2NyaXB0XCIpO1xuICB2YWx1ZXMgPSBmdW5jKHJlY29yZCk7XG4gIGlmIChfLmlzT2JqZWN0KHZhbHVlcykpIHtcbiAgICByZXR1cm4gdmFsdWVzO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJldmFsRmllbGRNYXBTY3JpcHQ6IOiEmuacrOi/lOWbnuWAvOexu+Wei+S4jeaYr+WvueixoVwiKTtcbiAgfVxuICByZXR1cm4ge307XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoID0gZnVuY3Rpb24ocmVjb3JkSWRzLCBzcGFjZUlkLCBpbnNJZCwgYXBwcm92ZUlkKSB7XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbJ2Ntc19maWxlcyddLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHBhcmVudDogcmVjb3JkSWRzXG4gIH0pLmZvckVhY2goZnVuY3Rpb24oY2YpIHtcbiAgICByZXR1cm4gXy5lYWNoKGNmLnZlcnNpb25zLCBmdW5jdGlvbih2ZXJzaW9uSWQsIGlkeCkge1xuICAgICAgdmFyIGYsIG5ld0ZpbGU7XG4gICAgICBmID0gQ3JlYXRvci5Db2xsZWN0aW9uc1snY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXS5maW5kT25lKHZlcnNpb25JZCk7XG4gICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgIHJldHVybiBuZXdGaWxlLmF0dGFjaERhdGEoZi5jcmVhdGVSZWFkU3RyZWFtKCdmaWxlcycpLCB7XG4gICAgICAgIHR5cGU6IGYub3JpZ2luYWwudHlwZVxuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIHZhciBtZXRhZGF0YTtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyLmVycm9yLCBlcnIucmVhc29uKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm5hbWUoZi5uYW1lKCkpO1xuICAgICAgICBuZXdGaWxlLnNpemUoZi5zaXplKCkpO1xuICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICBvd25lcjogZi5tZXRhZGF0YS5vd25lcixcbiAgICAgICAgICBvd25lcl9uYW1lOiBmLm1ldGFkYXRhLm93bmVyX25hbWUsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgaW5zdGFuY2U6IGluc0lkLFxuICAgICAgICAgIGFwcHJvdmU6IGFwcHJvdmVJZCxcbiAgICAgICAgICBwYXJlbnQ6IGNmLl9pZFxuICAgICAgICB9O1xuICAgICAgICBpZiAoaWR4ID09PSAwKSB7XG4gICAgICAgICAgbWV0YWRhdGEuY3VycmVudCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICByZXR1cm4gY2ZzLmluc3RhbmNlcy5pbnNlcnQobmV3RmlsZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvID0gZnVuY3Rpb24ocmVjb3JkSWRzLCBpbnNJZCwgc3BhY2VJZCkge1xuICBvYmplY3RVcGRhdGUocmVjb3JkSWRzLm8sIHJlY29yZElkcy5pZHNbMF0sIHtcbiAgICBpbnN0YW5jZXM6IFtcbiAgICAgIHtcbiAgICAgICAgX2lkOiBpbnNJZCxcbiAgICAgICAgc3RhdGU6ICdkcmFmdCdcbiAgICAgIH1cbiAgICBdLFxuICAgIGxvY2tlZDogdHJ1ZSxcbiAgICBpbnN0YW5jZV9zdGF0ZTogJ2RyYWZ0J1xuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvID0gZnVuY3Rpb24ocmVsYXRlZFRhYmxlc0luZm8sIGluc0lkLCBzcGFjZUlkKSB7XG4gIF8uZWFjaChyZWxhdGVkVGFibGVzSW5mbywgZnVuY3Rpb24odGFibGVJdGVtcywgcmVsYXRlZE9iamVjdE5hbWUpIHtcbiAgICB2YXIgcmVsYXRlZENvbGxlY3Rpb247XG4gICAgcmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpO1xuICAgIHJldHVybiBfLmVhY2godGFibGVJdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIHJlbGF0ZWRDb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoaXRlbS5fdGFibGUuX2lkLCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBpbnN0YW5jZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgX2lkOiBpbnNJZCxcbiAgICAgICAgICAgICAgc3RhdGU6ICdkcmFmdCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdLFxuICAgICAgICAgIF90YWJsZTogaXRlbS5fdGFibGVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja0lzSW5BcHByb3ZhbCA9IGZ1bmN0aW9uKHJlY29yZElkcywgc3BhY2VJZCkge1xuICB2YXIgcmVjb3JkO1xuICByZWNvcmQgPSBvYmplY3RGaW5kT25lKHJlY29yZElkcy5vLCB7XG4gICAgZmlsdGVyczogW1snX2lkJywgJz0nLCByZWNvcmRJZHMuaWRzWzBdXV0sXG4gICAgZmllbGRzOiBbJ2luc3RhbmNlcyddXG4gIH0pO1xuICBpZiAocmVjb3JkICYmIHJlY29yZC5pbnN0YW5jZXMgJiYgcmVjb3JkLmluc3RhbmNlc1swXS5zdGF0ZSAhPT0gJ2NvbXBsZXRlZCcgJiYgQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZChyZWNvcmQuaW5zdGFuY2VzWzBdLl9pZCkuY291bnQoKSA+IDApIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuatpOiusOW9leW3suWPkei1t+a1geeoi+ato+WcqOWuoeaJueS4re+8jOW+heWuoeaJuee7k+adn+aWueWPr+WPkei1t+S4i+S4gOasoeWuoeaJue+8gVwiKTtcbiAgfVxufTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvb2JqZWN0L3dvcmtmbG93L2RyYWZ0cycsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0dHJ5XG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxuXHRcdGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZFxuXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxuXG5cdFx0aW5zZXJ0ZWRfaW5zdGFuY2VzID0gbmV3IEFycmF5XG5cblx0XHRfLmVhY2ggaGFzaERhdGFbJ0luc3RhbmNlcyddLCAoaW5zdGFuY2VfZnJvbV9jbGllbnQpIC0+XG5cdFx0XHRuZXdfaW5zX2lkID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UoaW5zdGFuY2VfZnJvbV9jbGllbnQsIGN1cnJlbnRfdXNlcl9pbmZvKVxuXG5cdFx0XHRuZXdfaW5zID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZE9uZSh7IF9pZDogbmV3X2luc19pZCB9LCB7IGZpZWxkczogeyBzcGFjZTogMSwgZmxvdzogMSwgZmxvd192ZXJzaW9uOiAxLCBmb3JtOiAxLCBmb3JtX3ZlcnNpb246IDEgfSB9KVxuXG5cdFx0XHRpbnNlcnRlZF9pbnN0YW5jZXMucHVzaChuZXdfaW5zKVxuXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGluc2VydHM6IGluc2VydGVkX2luc3RhbmNlcyB9XG5cdFx0fVxuXHRjYXRjaCBlXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3sgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfV0gfVxuXHRcdH1cblxuIiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS9vYmplY3Qvd29ya2Zsb3cvZHJhZnRzJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGN1cnJlbnRfdXNlcl9pZCwgY3VycmVudF91c2VyX2luZm8sIGUsIGhhc2hEYXRhLCBpbnNlcnRlZF9pbnN0YW5jZXM7XG4gIHRyeSB7XG4gICAgY3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKTtcbiAgICBjdXJyZW50X3VzZXJfaWQgPSBjdXJyZW50X3VzZXJfaW5mby5faWQ7XG4gICAgaGFzaERhdGEgPSByZXEuYm9keTtcbiAgICBpbnNlcnRlZF9pbnN0YW5jZXMgPSBuZXcgQXJyYXk7XG4gICAgXy5lYWNoKGhhc2hEYXRhWydJbnN0YW5jZXMnXSwgZnVuY3Rpb24oaW5zdGFuY2VfZnJvbV9jbGllbnQpIHtcbiAgICAgIHZhciBuZXdfaW5zLCBuZXdfaW5zX2lkO1xuICAgICAgbmV3X2luc19pZCA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY3JlYXRlX2luc3RhbmNlKGluc3RhbmNlX2Zyb21fY2xpZW50LCBjdXJyZW50X3VzZXJfaW5mbyk7XG4gICAgICBuZXdfaW5zID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogbmV3X2luc19pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBzcGFjZTogMSxcbiAgICAgICAgICBmbG93OiAxLFxuICAgICAgICAgIGZsb3dfdmVyc2lvbjogMSxcbiAgICAgICAgICBmb3JtOiAxLFxuICAgICAgICAgIGZvcm1fdmVyc2lvbjogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBpbnNlcnRlZF9pbnN0YW5jZXMucHVzaChuZXdfaW5zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBpbnNlcnRzOiBpbnNlcnRlZF9pbnN0YW5jZXNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==
