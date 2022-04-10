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
  "xml2js": "^0.4.19",
  "node-xlsx": "^0.x"
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

Creator.getAppMenu = function (app_id, menu_id) {
  var menus;
  menus = Creator.getAppMenus(app_id);
  return menus && menus.find(function (menu) {
    return menu.id === menu_id;
  });
};

Creator.getAppMenuUrlForInternet = function (menu) {
  var hasQuerySymbol, linkStr, params, url;
  params = {};
  params["X-Space-Id"] = Steedos.spaceId();
  params["X-User-Id"] = Steedos.userId();
  params["X-Company-Ids"] = Steedos.getUserCompanyIds();
  url = menu.path;
  url = Steedos.parseSingleExpression(url, menu, "#", Creator.USER_CONTEXT);
  hasQuerySymbol = /(\#.+\?)|(\?[^#]*$)/g.test(url);
  linkStr = hasQuerySymbol ? "&" : "?";
  return "" + url + linkStr + $.param(params);
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

},"object_import_jobs.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/methods/object_import_jobs.coffee                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

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
var _eval, getObjectConfig, getObjectNameFieldKey, getRelateds, objectql;

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
  record = Creator.getCollection(objectName, spaceId).findOne(recordId);
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

      obj = Creator.getCollection(objName);
      nameKey = getObjectNameFieldKey(objName);

      if (!obj) {
        return;
      }

      if (_.isString(id)) {
        _record = obj.findOne(id);

        if (_record) {
          _record['@label'] = _record[nameKey];
          return _record;
        }
      } else if (_.isArray(id)) {
        _records = [];
        obj.find({
          _id: {
            $in: id
          }
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
        var fieldsObj, formField, formTableFieldCode, gridCode, lookupFieldName, lookupFieldObj, lookupObjectRecord, lookupSelectFieldValue, oTableCode, oTableCodeReferenceField, oTableCodeReferenceFieldCode, oTableFieldCode, objField, objectField, objectFieldName, objectFieldObjectName, objectLookupField, object_field, odataFieldValue, referenceToDoc, referenceToFieldValue, referenceToObjectName, relatedObjectFieldCode, selectFieldValue, tableToRelatedMapKey, wTableCode, workflow_field;
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
              fieldsObj = {};
              fieldsObj[lookupFieldName] = 1;
              lookupObjectRecord = Creator.getCollection(objectField.reference_to, spaceId).findOne(record[objectFieldName], {
                fields: fieldsObj
              });
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
  record = Creator.getCollection(objectName, spaceId).findOne(objectId);
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
  Creator.getCollection(recordIds.o, spaceId).update(recordIds.ids[0], {
    $push: {
      instances: {
        $each: [{
          _id: insId,
          state: 'draft'
        }],
        $position: 0
      }
    },
    $set: {
      locked: true,
      instance_state: 'draft'
    }
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
  record = Creator.getCollection(recordIds.o, spaceId).findOne({
    _id: recordIds.ids[0],
    instances: {
      $exists: true
    }
  }, {
    fields: {
      instances: 1
    }
  });

  if (record && record.instances[0].state !== 'completed' && Creator.Collections.instances.find(record.instances[0]._id).count() > 0) {
    throw new Meteor.Error('error!', "此记录已发起流程正在审批中，待审批结束方可发起下一次审批！");
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"routes":{"s3.coffee":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/routes/s3.coffee                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var getQueryString, steedosAuth;
steedosAuth = require("@steedos/auth");
JsonRoutes.add("post", "/s3/", function (req, res, next) {
  return JsonRoutes.parseFiles(req, res, function () {
    var collection, fileCollection, newFile;
    collection = cfs.files;
    fileCollection = Creator.getObject("cms_files").db;

    if (req.files && req.files[0]) {
      newFile = new FS.File();
      newFile.attachData(req.files[0].data, {
        type: req.files[0].mimeType
      }, function (err) {
        var body, description, e, extention, fileObj, filename, metadata, newFileObjId, object_name, owner, owner_name, parent, record_id, size, space;
        filename = req.files[0].filename;
        extention = filename.split('.').pop();

        if (["image.jpg", "image.gif", "image.jpeg", "image.png"].includes(filename.toLowerCase())) {
          filename = "image-" + moment(new Date()).format('YYYYMMDDHHmmss') + "." + extention;
        }

        body = req.body;

        try {
          if (body && (body['upload_from'] === "IE" || body['upload_from'] === "node")) {
            filename = decodeURIComponent(filename);
          }
        } catch (error) {
          e = error;
          console.error(filename);
          console.error(e);
          filename = filename.replace(/%/g, "-");
        }

        newFile.name(filename);

        if (body && body['owner'] && body['space'] && body['record_id'] && body['object_name']) {
          parent = body['parent'];
          owner = body['owner'];
          owner_name = body['owner_name'];
          space = body['space'];
          record_id = body['record_id'];
          object_name = body['object_name'];
          description = body['description'];
          parent = body['parent'];
          metadata = {
            owner: owner,
            owner_name: owner_name,
            space: space,
            record_id: record_id,
            object_name: object_name
          };

          if (parent) {
            metadata.parent = parent;
          }

          newFile.metadata = metadata;
          fileObj = collection.insert(newFile);
        } else {
          fileObj = collection.insert(newFile);
        }

        size = fileObj.original.size;

        if (!size) {
          size = 1024;
        }

        if (parent) {
          return fileCollection.update({
            _id: parent
          }, {
            $set: {
              name: filename,
              extention: extention,
              size: size,
              modified: new Date(),
              modified_by: owner
            },
            $push: {
              versions: {
                $each: [fileObj._id],
                $position: 0
              }
            }
          });
        } else {
          newFileObjId = fileCollection.direct.insert({
            name: filename,
            description: description,
            extention: extention,
            size: size,
            versions: [fileObj._id],
            parent: {
              o: object_name,
              ids: [record_id]
            },
            owner: owner,
            space: space,
            created: new Date(),
            created_by: owner,
            modified: new Date(),
            modified_by: owner
          });
          return fileObj.update({
            $set: {
              'metadata.parent': newFileObjId
            }
          });
        }
      });
      return newFile.once('stored', function (storeName) {
        var resp, size;
        size = newFile.original.size;

        if (!size) {
          size = 1024;
        }

        resp = {
          version_id: newFile._id,
          size: size
        };
        res.end(JSON.stringify(resp));
      });
    } else {
      res.statusCode = 500;
      return res.end();
    }
  });
});
JsonRoutes.add("post", "/s3/:collection", function (req, res, next) {
  var collectionName, e, userId, userSession;

  try {
    userSession = Meteor.wrapAsync(function (req, res, cb) {
      return steedosAuth.auth(req, res).then(function (resolve, reject) {
        return cb(reject, resolve);
      });
    })(req, res);
    userId = userSession.userId;

    if (!userId) {
      throw new Meteor.Error(500, "No permission");
    }

    collectionName = req.params.collection;
    JsonRoutes.parseFiles(req, res, function () {
      var collection, newFile;
      collection = cfs[collectionName];

      if (!collection) {
        throw new Meteor.Error(500, "No Collection");
      }

      if (req.files && req.files[0]) {
        newFile = new FS.File();
        newFile.name(req.files[0].filename);

        if (req.body) {
          newFile.metadata = req.body;
        }

        newFile.owner = userId;
        newFile.metadata.owner = userId;
        newFile.attachData(req.files[0].data, {
          type: req.files[0].mimeType
        });
        collection.insert(newFile);
        return newFile.once('stored', function (storeName) {
          var resultData;
          resultData = collection.files.findOne(newFile._id);
          JsonRoutes.sendResult(res, {
            code: 200,
            data: resultData
          });
        });
      } else {
        throw new Meteor.Error(500, "No File");
      }
    });
  } catch (error) {
    e = error;
    console.error(e.stack);
    return JsonRoutes.sendResult(res, {
      code: e.error || 500,
      data: {
        errors: e.reason || e.message
      }
    });
  }
});

getQueryString = function (accessKeyId, secretAccessKey, query, method) {
  var ALY, canonicalizedQueryString, date, queryKeys, queryStr, stringToSign;
  console.log("----uuflowManager.getQueryString----");
  ALY = require('aliyun-sdk');
  date = ALY.util.date.getDate();
  query.Format = "json";
  query.Version = "2017-03-21";
  query.AccessKeyId = accessKeyId;
  query.SignatureMethod = "HMAC-SHA1";
  query.Timestamp = ALY.util.date.iso8601(date);
  query.SignatureVersion = "1.0";
  query.SignatureNonce = String(date.getTime());
  queryKeys = Object.keys(query);
  queryKeys.sort();
  canonicalizedQueryString = "";
  queryKeys.forEach(function (name) {
    return canonicalizedQueryString += "&" + name + "=" + ALY.util.popEscape(query[name]);
  });
  stringToSign = method.toUpperCase() + '&%2F&' + ALY.util.popEscape(canonicalizedQueryString.substr(1));
  query.Signature = ALY.util.crypto.hmac(secretAccessKey + '&', stringToSign, 'base64', 'sha1');
  queryStr = ALY.util.queryParamsToString(query);
  console.log(queryStr);
  return queryStr;
};

JsonRoutes.add("post", "/s3/vod/upload", function (req, res, next) {
  var ALY, collectionName, e, userId;

  try {
    userId = Steedos.getUserIdFromAuthToken(req, res);

    if (!userId) {
      throw new Meteor.Error(500, "No permission");
    }

    collectionName = "videos";
    ALY = require('aliyun-sdk');
    JsonRoutes.parseFiles(req, res, function () {
      var accessKeyId, collection, date, oss, query, r, ref, ref1, ref2, ref3, secretAccessKey, uploadAddress, uploadAuth, url, videoId;
      collection = cfs[collectionName];

      if (!collection) {
        throw new Meteor.Error(500, "No Collection");
      }

      if (req.files && req.files[0]) {
        if (collectionName === 'videos' && ((ref = Meteor.settings["public"].cfs) != null ? ref.store : void 0) === "OSS") {
          accessKeyId = (ref1 = Meteor.settings.cfs.aliyun) != null ? ref1.accessKeyId : void 0;
          secretAccessKey = (ref2 = Meteor.settings.cfs.aliyun) != null ? ref2.secretAccessKey : void 0;
          date = ALY.util.date.getDate();
          query = {
            Action: "CreateUploadVideo",
            Title: req.files[0].filename,
            FileName: req.files[0].filename
          };
          url = "http://vod.cn-shanghai.aliyuncs.com/?" + getQueryString(accessKeyId, secretAccessKey, query, 'GET');
          r = HTTP.call('GET', url);
          console.log(r);

          if ((ref3 = r.data) != null ? ref3.VideoId : void 0) {
            videoId = r.data.VideoId;
            uploadAddress = JSON.parse(new Buffer(r.data.UploadAddress, 'base64').toString());
            console.log(uploadAddress);
            uploadAuth = JSON.parse(new Buffer(r.data.UploadAuth, 'base64').toString());
            console.log(uploadAuth);
            oss = new ALY.OSS({
              "accessKeyId": uploadAuth.AccessKeyId,
              "secretAccessKey": uploadAuth.AccessKeySecret,
              "endpoint": uploadAddress.Endpoint,
              "apiVersion": '2013-10-15',
              "securityToken": uploadAuth.SecurityToken
            });
            return oss.putObject({
              Bucket: uploadAddress.Bucket,
              Key: uploadAddress.FileName,
              Body: req.files[0].data,
              AccessControlAllowOrigin: '',
              ContentType: req.files[0].mimeType,
              CacheControl: 'no-cache',
              ContentDisposition: '',
              ContentEncoding: 'utf-8',
              ServerSideEncryption: 'AES256',
              Expires: null
            }, Meteor.bindEnvironment(function (err, data) {
              var getPlayInfoQuery, getPlayInfoResult, getPlayInfoUrl, newDate;

              if (err) {
                console.log('error:', err);
                throw new Meteor.Error(500, err.message);
              }

              console.log('success:', data);
              newDate = ALY.util.date.getDate();
              getPlayInfoQuery = {
                Action: 'GetPlayInfo',
                VideoId: videoId
              };
              getPlayInfoUrl = "http://vod.cn-shanghai.aliyuncs.com/?" + getQueryString(accessKeyId, secretAccessKey, getPlayInfoQuery, 'GET');
              getPlayInfoResult = HTTP.call('GET', getPlayInfoUrl);
              return JsonRoutes.sendResult(res, {
                code: 200,
                data: getPlayInfoResult
              });
            }));
          }
        }
      } else {
        throw new Meteor.Error(500, "No File");
      }
    });
  } catch (error) {
    e = error;
    console.error(e.stack);
    return JsonRoutes.sendResult(res, {
      code: e.error || 500,
      data: {
        errors: e.reason || e.message
      }
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"api_workflow_drafts.coffee":function module(){

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
require("/node_modules/meteor/steedos:creator/server/methods/object_import_jobs.coffee");
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
require("/node_modules/meteor/steedos:creator/server/routes/s3.coffee");
require("/node_modules/meteor/steedos:creator/server/routes/api_workflow_drafts.coffee");

/* Exports */
Package._define("steedos:creator", {
  permissionManagerForInitApproval: permissionManagerForInitApproval,
  uuflowManagerForInitApproval: uuflowManagerForInitApproval
});

})();

//# sourceURL=meteor://💻app/packages/steedos_creator.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjcmVhdG9yL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvbGliL2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvb2JqZWN0X3JlY2VudF92aWV3ZWQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3ZpZXdlZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3JlY29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9yZWNlbnRfcmVjb3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9yZXBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3JlcG9ydF9kYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfZXhwb3J0MnhtbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9leHBvcnQyeG1sLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3JlbGF0ZWRfb2JqZWN0c19yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvcGVuZGluZ19zcGFjZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3BlbmRpbmdfc3BhY2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF90YWJ1bGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF9saXN0dmlld3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy91c2VyX3RhYnVsYXJfc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9yZWxhdGVkX29iamVjdHNfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV91c2VyX2luZm8uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c192aWV3X2xpbWl0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfdmlld19saW1pdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c19ub19mb3JjZV9waG9uZV91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9uZWVkX3RvX2NvbmZpcm0uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX25lZWRfdG9fY29uZmlybS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbGliL3Blcm1pc3Npb25fbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvcGVybWlzc2lvbl9tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9zMy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImJ1c2JveSIsIm1rZGlycCIsIk1ldGVvciIsInNldHRpbmdzIiwiY2ZzIiwiYWxpeXVuIiwiQ3JlYXRvciIsImdldFNjaGVtYSIsIm9iamVjdF9uYW1lIiwicmVmIiwiZ2V0T2JqZWN0Iiwic2NoZW1hIiwiZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCIsImlzQ2xpZW50IiwiQnVpbGRlckNyZWF0b3IiLCJwbHVnaW5Db21wb25lbnRTZWxlY3RvciIsInN0b3JlIiwiZ2V0U3RhdGUiLCJnZXRPYmplY3RVcmwiLCJyZWNvcmRfaWQiLCJhcHBfaWQiLCJsaXN0X3ZpZXciLCJsaXN0X3ZpZXdfaWQiLCJTZXNzaW9uIiwiZ2V0IiwiZ2V0TGlzdFZpZXciLCJfaWQiLCJnZXRSZWxhdGl2ZVVybCIsImdldE9iamVjdEFic29sdXRlVXJsIiwiU3RlZWRvcyIsImFic29sdXRlVXJsIiwiZ2V0T2JqZWN0Um91dGVyVXJsIiwiZ2V0TGlzdFZpZXdVcmwiLCJ1cmwiLCJnZXRMaXN0Vmlld1JlbGF0aXZlVXJsIiwiZ2V0U3dpdGNoTGlzdFVybCIsImdldFJlbGF0ZWRPYmplY3RVcmwiLCJyZWxhdGVkX29iamVjdF9uYW1lIiwicmVsYXRlZF9maWVsZF9uYW1lIiwiZ2V0T2JqZWN0TG9va3VwRmllbGRPcHRpb25zIiwiaXNfZGVlcCIsImlzX3NraXBfaGlkZSIsImlzX3JlbGF0ZWQiLCJfb2JqZWN0IiwiX29wdGlvbnMiLCJmaWVsZHMiLCJpY29uIiwicmVsYXRlZE9iamVjdHMiLCJfIiwiZm9yRWFjaCIsImYiLCJrIiwiaGlkZGVuIiwidHlwZSIsInB1c2giLCJsYWJlbCIsInZhbHVlIiwicl9vYmplY3QiLCJyZWZlcmVuY2VfdG8iLCJpc1N0cmluZyIsImYyIiwiazIiLCJnZXRSZWxhdGVkT2JqZWN0cyIsImVhY2giLCJfdGhpcyIsIl9yZWxhdGVkT2JqZWN0IiwicmVsYXRlZE9iamVjdCIsInJlbGF0ZWRPcHRpb25zIiwicmVsYXRlZE9wdGlvbiIsImZvcmVpZ25fa2V5IiwibmFtZSIsImdldE9iamVjdEZpbHRlckZpZWxkT3B0aW9ucyIsInBlcm1pc3Npb25fZmllbGRzIiwiZ2V0RmllbGRzIiwiaW5jbHVkZSIsInRlc3QiLCJpbmRleE9mIiwiZ2V0T2JqZWN0RmllbGRPcHRpb25zIiwiZ2V0RmlsdGVyc1dpdGhGaWx0ZXJGaWVsZHMiLCJmaWx0ZXJzIiwiZmlsdGVyX2ZpZWxkcyIsImxlbmd0aCIsIm4iLCJmaWVsZCIsInJlcXVpcmVkIiwiZmluZFdoZXJlIiwiaXNfZGVmYXVsdCIsImlzX3JlcXVpcmVkIiwiZmlsdGVySXRlbSIsIm1hdGNoRmllbGQiLCJmaW5kIiwiZ2V0T2JqZWN0UmVjb3JkIiwic2VsZWN0X2ZpZWxkcyIsImV4cGFuZCIsImNvbGxlY3Rpb24iLCJvYmoiLCJyZWNvcmQiLCJyZWYxIiwicmVmMiIsIlRlbXBsYXRlIiwiaW5zdGFuY2UiLCJvZGF0YSIsImRhdGFiYXNlX25hbWUiLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsImdldE9iamVjdFJlY29yZE5hbWUiLCJuYW1lX2ZpZWxkX2tleSIsIk5BTUVfRklFTERfS0VZIiwiZ2V0QXBwIiwiYXBwIiwiQXBwcyIsImRlcHMiLCJkZXBlbmQiLCJnZXRBcHBEYXNoYm9hcmQiLCJkYXNoYm9hcmQiLCJEYXNoYm9hcmRzIiwiYXBwcyIsImdldEFwcERhc2hib2FyZENvbXBvbmVudCIsImdldEFwcE9iamVjdE5hbWVzIiwiYXBwT2JqZWN0cyIsImlzTW9iaWxlIiwib2JqZWN0cyIsIm1vYmlsZV9vYmplY3RzIiwicGVybWlzc2lvbnMiLCJhbGxvd1JlYWQiLCJnZXRBcHBNZW51IiwibWVudV9pZCIsIm1lbnVzIiwiZ2V0QXBwTWVudXMiLCJtZW51IiwiaWQiLCJnZXRBcHBNZW51VXJsRm9ySW50ZXJuZXQiLCJoYXNRdWVyeVN5bWJvbCIsImxpbmtTdHIiLCJwYXJhbXMiLCJzcGFjZUlkIiwidXNlcklkIiwiZ2V0VXNlckNvbXBhbnlJZHMiLCJwYXRoIiwicGFyc2VTaW5nbGVFeHByZXNzaW9uIiwiVVNFUl9DT05URVhUIiwiJCIsInBhcmFtIiwiZ2V0QXBwTWVudVVybCIsInRhcmdldCIsImFwcE1lbnVzIiwiY3VyZW50QXBwTWVudXMiLCJtZW51SXRlbSIsImNoaWxkcmVuIiwibG9hZEFwcHNNZW51cyIsImRhdGEiLCJvcHRpb25zIiwibW9iaWxlIiwic3VjY2VzcyIsInNldCIsImF1dGhSZXF1ZXN0IiwiZ2V0VmlzaWJsZUFwcHMiLCJpbmNsdWRlQWRtaW4iLCJjaGFuZ2VBcHAiLCJfc3ViQXBwIiwiZW50aXRpZXMiLCJPYmplY3QiLCJhc3NpZ24iLCJ2aXNpYmxlQXBwc1NlbGVjdG9yIiwiZ2V0VmlzaWJsZUFwcHNPYmplY3RzIiwidmlzaWJsZU9iamVjdE5hbWVzIiwiZmxhdHRlbiIsInBsdWNrIiwiZmlsdGVyIiwiT2JqZWN0cyIsInNvcnQiLCJzb3J0aW5nTWV0aG9kIiwiYmluZCIsImtleSIsInVuaXEiLCJnZXRBcHBzT2JqZWN0cyIsInRlbXBPYmplY3RzIiwiY29uY2F0IiwidmFsaWRhdGVGaWx0ZXJzIiwibG9naWMiLCJlIiwiZXJyb3JNc2ciLCJmaWx0ZXJfaXRlbXMiLCJmaWx0ZXJfbGVuZ3RoIiwiZmxhZyIsImluZGV4Iiwid29yZCIsIm1hcCIsImlzRW1wdHkiLCJjb21wYWN0IiwicmVwbGFjZSIsIm1hdGNoIiwiaSIsImluY2x1ZGVzIiwidyIsImVycm9yIiwiY29uc29sZSIsImxvZyIsInRvYXN0ciIsImZvcm1hdEZpbHRlcnNUb01vbmdvIiwic2VsZWN0b3IiLCJBcnJheSIsIm9wZXJhdGlvbiIsIm9wdGlvbiIsInJlZyIsInN1Yl9zZWxlY3RvciIsImV2YWx1YXRlRm9ybXVsYSIsIlJlZ0V4cCIsImlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyIsImZvcm1hdEZpbHRlcnNUb0RldiIsImxvZ2ljVGVtcEZpbHRlcnMiLCJzdGVlZG9zRmlsdGVycyIsInJlcXVpcmUiLCJpc19sb2dpY19vciIsInBvcCIsImZvcm1hdExvZ2ljRmlsdGVyc1RvRGV2IiwiZmlsdGVyX2xvZ2ljIiwiZm9ybWF0X2xvZ2ljIiwieCIsIl9mIiwiaXNBcnJheSIsIkpTT04iLCJzdHJpbmdpZnkiLCJyZWxhdGVkX29iamVjdF9uYW1lcyIsInJlbGF0ZWRfb2JqZWN0cyIsInVucmVsYXRlZF9vYmplY3RzIiwiZ2V0T2JqZWN0UmVsYXRlZHMiLCJfY29sbGVjdGlvbl9uYW1lIiwiZ2V0UGVybWlzc2lvbnMiLCJkaWZmZXJlbmNlIiwicmVsYXRlZF9vYmplY3QiLCJpc0FjdGl2ZSIsImFsbG93UmVhZEZpbGVzIiwiZ2V0UmVsYXRlZE9iamVjdE5hbWVzIiwiZ2V0UmVsYXRlZE9iamVjdExpc3RBY3Rpb25zIiwicmVsYXRlZE9iamVjdE5hbWUiLCJhY3Rpb25zIiwiZ2V0QWN0aW9ucyIsImFjdGlvbiIsIm9uIiwidmlzaWJsZSIsImRpc2FibGVkX2FjdGlvbnMiLCJzb3J0QnkiLCJ2YWx1ZXMiLCJoYXMiLCJhbGxvd19jdXN0b21BY3Rpb25zIiwia2V5cyIsImV4Y2x1ZGVfYWN0aW9ucyIsImdldExpc3RWaWV3cyIsImRpc2FibGVkX2xpc3Rfdmlld3MiLCJsaXN0Vmlld3MiLCJsaXN0X3ZpZXdzIiwib2JqZWN0IiwiaXRlbSIsIml0ZW1fbmFtZSIsImlzRGlzYWJsZWQiLCJvd25lciIsImZpZWxkc05hbWUiLCJ1bnJlYWRhYmxlX2ZpZWxkcyIsImdldE9iamVjdEZpZWxkc05hbWUiLCJpc2xvYWRpbmciLCJib290c3RyYXBMb2FkZWQiLCJjb252ZXJ0U3BlY2lhbENoYXJhY3RlciIsInN0ciIsImdldERpc2FibGVkRmllbGRzIiwiZmllbGROYW1lIiwiYXV0b2Zvcm0iLCJkaXNhYmxlZCIsIm9taXQiLCJnZXRIaWRkZW5GaWVsZHMiLCJnZXRGaWVsZHNXaXRoTm9Hcm91cCIsImdyb3VwIiwiZ2V0U29ydGVkRmllbGRHcm91cE5hbWVzIiwibmFtZXMiLCJ1bmlxdWUiLCJnZXRGaWVsZHNGb3JHcm91cCIsImdyb3VwTmFtZSIsImdldEZpZWxkc1dpdGhvdXRPbWl0IiwicGljayIsImdldEZpZWxkc0luRmlyc3RMZXZlbCIsImZpcnN0TGV2ZWxLZXlzIiwiZ2V0RmllbGRzRm9yUmVvcmRlciIsImlzU2luZ2xlIiwiX2tleXMiLCJjaGlsZEtleXMiLCJpc193aWRlXzEiLCJpc193aWRlXzIiLCJzY18xIiwic2NfMiIsImVuZHNXaXRoIiwiaXNfd2lkZSIsInNsaWNlIiwiaXNGaWx0ZXJWYWx1ZUVtcHR5IiwiTnVtYmVyIiwiaXNOYU4iLCJnZXRGaWVsZERhdGFUeXBlIiwib2JqZWN0RmllbGRzIiwicmVzdWx0IiwiZGF0YV90eXBlIiwiaXNTZXJ2ZXIiLCJnZXRBbGxSZWxhdGVkT2JqZWN0cyIsInJlbGF0ZWRfZmllbGQiLCJlbmFibGVfZmlsZXMiLCJmb3JtYXRJbmRleCIsImFycmF5IiwiaW5kZXhOYW1lIiwiaXNkb2N1bWVudERCIiwiYmFja2dyb3VuZCIsImRhdGFzb3VyY2VzIiwiZG9jdW1lbnREQiIsImpvaW4iLCJzdWJzdHJpbmciLCJhcHBzQnlOYW1lIiwibWV0aG9kcyIsInNwYWNlX2lkIiwiY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkIiwiY3VycmVudF9yZWNlbnRfdmlld2VkIiwiZG9jIiwic3BhY2UiLCJ1cGRhdGUiLCIkaW5jIiwiY291bnQiLCIkc2V0IiwibW9kaWZpZWQiLCJEYXRlIiwibW9kaWZpZWRfYnkiLCJpbnNlcnQiLCJfbWFrZU5ld0lEIiwibyIsImlkcyIsImNyZWF0ZWQiLCJjcmVhdGVkX2J5IiwiYXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSIsInJlY2VudF9hZ2dyZWdhdGUiLCJzZWFyY2hfb2JqZWN0IiwiX3JlY29yZHMiLCJjYWxsYmFjayIsIkNvbGxlY3Rpb25zIiwib2JqZWN0X3JlY2VudF92aWV3ZWQiLCJyYXdDb2xsZWN0aW9uIiwiYWdncmVnYXRlIiwiJG1hdGNoIiwiJGdyb3VwIiwibWF4Q3JlYXRlZCIsIiRtYXgiLCIkc29ydCIsIiRsaW1pdCIsInRvQXJyYXkiLCJlcnIiLCJFcnJvciIsImlzRnVuY3Rpb24iLCJ3cmFwQXN5bmMiLCJzZWFyY2hUZXh0IiwiX29iamVjdF9jb2xsZWN0aW9uIiwiX29iamVjdF9uYW1lX2tleSIsInF1ZXJ5IiwicXVlcnlfYW5kIiwicmVjb3JkcyIsInNlYXJjaF9LZXl3b3JkcyIsInNwbGl0Iiwia2V5d29yZCIsInN1YnF1ZXJ5IiwiJHJlZ2V4IiwidHJpbSIsIiRhbmQiLCIkaW4iLCJsaW1pdCIsIl9uYW1lIiwiX29iamVjdF9uYW1lIiwicmVjb3JkX29iamVjdCIsInJlY29yZF9vYmplY3RfY29sbGVjdGlvbiIsInNlbGYiLCJvYmplY3RzQnlOYW1lIiwib2JqZWN0X3JlY29yZCIsImVuYWJsZV9zZWFyY2giLCJ1cGRhdGVfZmlsdGVycyIsImxpc3R2aWV3X2lkIiwiZmlsdGVyX3Njb3BlIiwib2JqZWN0X2xpc3R2aWV3cyIsImRpcmVjdCIsInVwZGF0ZV9jb2x1bW5zIiwiY29sdW1ucyIsImNoZWNrIiwiY29tcG91bmRGaWVsZHMiLCJjdXJzb3IiLCJmaWx0ZXJGaWVsZHMiLCJjaGlsZEtleSIsIm9iamVjdEZpZWxkIiwic3BsaXRzIiwiaXNDb21tb25TcGFjZSIsImlzU3BhY2VBZG1pbiIsInNraXAiLCJmZXRjaCIsImNvbXBvdW5kRmllbGRJdGVtIiwiY29tcG91bmRGaWx0ZXJGaWVsZHMiLCJpdGVtS2V5IiwiaXRlbVZhbHVlIiwicmVmZXJlbmNlSXRlbSIsInNldHRpbmciLCJjb2x1bW5fd2lkdGgiLCJvYmoxIiwiX2lkX2FjdGlvbnMiLCJfbWl4RmllbGRzRGF0YSIsIl9taXhSZWxhdGVkRGF0YSIsIl93cml0ZVhtbEZpbGUiLCJmcyIsImxvZ2dlciIsInhtbDJqcyIsIkxvZ2dlciIsImpzb25PYmoiLCJvYmpOYW1lIiwiYnVpbGRlciIsImRheSIsImZpbGVBZGRyZXNzIiwiZmlsZU5hbWUiLCJmaWxlUGF0aCIsIm1vbnRoIiwibm93Iiwic3RyZWFtIiwieG1sIiwieWVhciIsIkJ1aWxkZXIiLCJidWlsZE9iamVjdCIsIkJ1ZmZlciIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiX19tZXRlb3JfYm9vdHN0cmFwX18iLCJzZXJ2ZXJEaXIiLCJleGlzdHNTeW5jIiwic3luYyIsIndyaXRlRmlsZSIsIm1peEJvb2wiLCJtaXhEYXRlIiwibWl4RGVmYXVsdCIsIm9iakZpZWxkcyIsImZpZWxkX25hbWUiLCJkYXRlIiwiZGF0ZVN0ciIsImZvcm1hdCIsIm1vbWVudCIsInJlbGF0ZWRPYmpOYW1lcyIsInJlbGF0ZWRPYmpOYW1lIiwicmVsYXRlZENvbGxlY3Rpb24iLCJyZWxhdGVkUmVjb3JkTGlzdCIsInJlbGF0ZWRUYWJsZURhdGEiLCJyZWxhdGVkT2JqIiwiZmllbGRzRGF0YSIsIkV4cG9ydDJ4bWwiLCJyZWNvcmRMaXN0IiwiaW5mbyIsInRpbWUiLCJyZWNvcmRPYmoiLCJ0aW1lRW5kIiwicmVsYXRlZF9vYmplY3RzX3JlY29yZHMiLCJyZWxhdGVkX3JlY29yZHMiLCJ2aWV3QWxsUmVjb3JkcyIsImdldFBlbmRpbmdTcGFjZUluZm8iLCJpbnZpdGVySWQiLCJpbnZpdGVyTmFtZSIsInNwYWNlTmFtZSIsImRiIiwidXNlcnMiLCJzcGFjZXMiLCJpbnZpdGVyIiwicmVmdXNlSm9pblNwYWNlIiwic3BhY2VfdXNlcnMiLCJpbnZpdGVfc3RhdGUiLCJhY2NlcHRKb2luU3BhY2UiLCJ1c2VyX2FjY2VwdGVkIiwicHVibGlzaCIsInB1Ymxpc2hDb21wb3NpdGUiLCJ0YWJsZU5hbWUiLCJfZmllbGRzIiwib2JqZWN0X2NvbGxlY2l0b24iLCJyZWZlcmVuY2VfZmllbGRzIiwicmVhZHkiLCJTdHJpbmciLCJNYXRjaCIsIk9wdGlvbmFsIiwiZ2V0T2JqZWN0TmFtZSIsInVuYmxvY2siLCJmaWVsZF9rZXlzIiwiX29iamVjdEtleXMiLCJyZWZlcmVuY2VfZmllbGQiLCJwYXJlbnQiLCJjaGlsZHJlbl9maWVsZHMiLCJwX2siLCJyZWZlcmVuY2VfaWRzIiwicmVmZXJlbmNlX3RvX29iamVjdCIsInNfayIsImdldFByb3BlcnR5IiwicmVkdWNlIiwiaXNPYmplY3QiLCJzaGFyZWQiLCJ1c2VyIiwic3BhY2Vfc2V0dGluZ3MiLCJwZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbCIsImdldEZsb3dQZXJtaXNzaW9ucyIsImZsb3dfaWQiLCJ1c2VyX2lkIiwiZmxvdyIsIm15X3Blcm1pc3Npb25zIiwib3JnX2lkcyIsIm9yZ2FuaXphdGlvbnMiLCJvcmdzX2Nhbl9hZGQiLCJvcmdzX2Nhbl9hZG1pbiIsIm9yZ3NfY2FuX21vbml0b3IiLCJ1c2Vyc19jYW5fYWRkIiwidXNlcnNfY2FuX2FkbWluIiwidXNlcnNfY2FuX21vbml0b3IiLCJ1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsIiwiZ2V0RmxvdyIsInBhcmVudHMiLCJvcmciLCJwYXJlbnRfaWQiLCJwZXJtcyIsIm9yZ19pZCIsIl9ldmFsIiwiZ2V0T2JqZWN0Q29uZmlnIiwiZ2V0T2JqZWN0TmFtZUZpZWxkS2V5IiwiZ2V0UmVsYXRlZHMiLCJvYmplY3RxbCIsIm9iamVjdEFwaU5hbWUiLCJ0b0NvbmZpZyIsImNiIiwidGhlbiIsInJlc29sdmUiLCJyZWplY3QiLCJjaGVja19hdXRob3JpemF0aW9uIiwicmVxIiwiYXV0aFRva2VuIiwiaGFzaGVkVG9rZW4iLCJBY2NvdW50cyIsIl9oYXNoTG9naW5Ub2tlbiIsImdldFNwYWNlIiwiZmxvd3MiLCJnZXRTcGFjZVVzZXIiLCJzcGFjZV91c2VyIiwiZ2V0U3BhY2VVc2VyT3JnSW5mbyIsIm9yZ2FuaXphdGlvbiIsImZ1bGxuYW1lIiwib3JnYW5pemF0aW9uX25hbWUiLCJvcmdhbml6YXRpb25fZnVsbG5hbWUiLCJpc0Zsb3dFbmFibGVkIiwic3RhdGUiLCJpc0Zsb3dTcGFjZU1hdGNoZWQiLCJnZXRGb3JtIiwiZm9ybV9pZCIsImZvcm0iLCJmb3JtcyIsImdldENhdGVnb3J5IiwiY2F0ZWdvcnlfaWQiLCJjYXRlZ29yaWVzIiwiY2hlY2tTeW5jRGlyZWN0aW9uIiwib3ciLCJzeW5jRGlyZWN0aW9uIiwib2JqZWN0X3dvcmtmbG93cyIsInN5bmNfZGlyZWN0aW9uIiwiY3JlYXRlX2luc3RhbmNlIiwiaW5zdGFuY2VfZnJvbV9jbGllbnQiLCJ1c2VyX2luZm8iLCJhcHByX29iaiIsImFwcHJvdmVfZnJvbV9jbGllbnQiLCJjYXRlZ29yeSIsImluc19vYmoiLCJuZXdfaW5zX2lkIiwicmVsYXRlZFRhYmxlc0luZm8iLCJzcGFjZV91c2VyX29yZ19pbmZvIiwic3RhcnRfc3RlcCIsInRyYWNlX2Zyb21fY2xpZW50IiwidHJhY2Vfb2JqIiwiY2hlY2tJc0luQXBwcm92YWwiLCJwZXJtaXNzaW9uTWFuYWdlciIsImluc3RhbmNlcyIsImZsb3dfdmVyc2lvbiIsImN1cnJlbnQiLCJmb3JtX3ZlcnNpb24iLCJzdWJtaXR0ZXIiLCJzdWJtaXR0ZXJfbmFtZSIsImFwcGxpY2FudCIsImFwcGxpY2FudF9uYW1lIiwiYXBwbGljYW50X29yZ2FuaXphdGlvbiIsImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSIsImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWUiLCJhcHBsaWNhbnRfY29tcGFueSIsImNvbXBhbnlfaWQiLCJjb2RlIiwiaXNfYXJjaGl2ZWQiLCJpc19kZWxldGVkIiwicmVjb3JkX2lkcyIsIk1vbmdvIiwiT2JqZWN0SUQiLCJfc3RyIiwiaXNfZmluaXNoZWQiLCJzdGVwcyIsInN0ZXAiLCJzdGVwX3R5cGUiLCJzdGFydF9kYXRlIiwidHJhY2UiLCJ1c2VyX25hbWUiLCJoYW5kbGVyIiwiaGFuZGxlcl9uYW1lIiwiaGFuZGxlcl9vcmdhbml6YXRpb24iLCJoYW5kbGVyX29yZ2FuaXphdGlvbl9uYW1lIiwiaGFuZGxlcl9vcmdhbml6YXRpb25fZnVsbG5hbWUiLCJyZWFkX2RhdGUiLCJpc19yZWFkIiwiaXNfZXJyb3IiLCJkZXNjcmlwdGlvbiIsImluaXRpYXRlVmFsdWVzIiwiYXBwcm92ZXMiLCJ0cmFjZXMiLCJpbmJveF91c2VycyIsImN1cnJlbnRfc3RlcF9uYW1lIiwiYXV0b19yZW1pbmQiLCJmbG93X25hbWUiLCJjYXRlZ29yeV9uYW1lIiwiaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8iLCJpbml0aWF0ZUF0dGFjaCIsInJlY29yZElkcyIsImZsb3dJZCIsImZpZWxkQ29kZXMiLCJmaWx0ZXJWYWx1ZXMiLCJmb3JtRmllbGRzIiwiZm9ybVRhYmxlRmllbGRzIiwiZm9ybVRhYmxlRmllbGRzQ29kZSIsImdldEZpZWxkT2RhdGFWYWx1ZSIsImdldEZvcm1GaWVsZCIsImdldEZvcm1UYWJsZUZpZWxkIiwiZ2V0Rm9ybVRhYmxlRmllbGRDb2RlIiwiZ2V0Rm9ybVRhYmxlU3ViRmllbGQiLCJnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlIiwiZ2V0U2VsZWN0T3JnVmFsdWUiLCJnZXRTZWxlY3RPcmdWYWx1ZXMiLCJnZXRTZWxlY3RVc2VyVmFsdWUiLCJnZXRTZWxlY3RVc2VyVmFsdWVzIiwib2JqZWN0TmFtZSIsInJlY29yZElkIiwicmVsYXRlZE9iamVjdHNLZXlzIiwidGFibGVGaWVsZENvZGVzIiwidGFibGVGaWVsZE1hcCIsInRhYmxlVG9SZWxhdGVkTWFwIiwiZmYiLCJmb3JtRmllbGQiLCJyZWxhdGVkT2JqZWN0c0tleSIsInN0YXJ0c1dpdGgiLCJmb3JtVGFibGVGaWVsZENvZGUiLCJzZiIsInRhYmxlRmllbGQiLCJzdWJGaWVsZENvZGUiLCJfcmVjb3JkIiwibmFtZUtleSIsInN1IiwidXNlcklkcyIsInN1cyIsIm9yZ0lkIiwib3JnSWRzIiwib3JncyIsImZpZWxkX21hcCIsImZtIiwiZmllbGRzT2JqIiwiZ3JpZENvZGUiLCJsb29rdXBGaWVsZE5hbWUiLCJsb29rdXBGaWVsZE9iaiIsImxvb2t1cE9iamVjdFJlY29yZCIsImxvb2t1cFNlbGVjdEZpZWxkVmFsdWUiLCJvVGFibGVDb2RlIiwib1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkIiwib1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkQ29kZSIsIm9UYWJsZUZpZWxkQ29kZSIsIm9iakZpZWxkIiwib2JqZWN0RmllbGROYW1lIiwib2JqZWN0RmllbGRPYmplY3ROYW1lIiwib2JqZWN0TG9va3VwRmllbGQiLCJvYmplY3RfZmllbGQiLCJvZGF0YUZpZWxkVmFsdWUiLCJyZWZlcmVuY2VUb0RvYyIsInJlZmVyZW5jZVRvRmllbGRWYWx1ZSIsInJlZmVyZW5jZVRvT2JqZWN0TmFtZSIsInJlbGF0ZWRPYmplY3RGaWVsZENvZGUiLCJzZWxlY3RGaWVsZFZhbHVlIiwidGFibGVUb1JlbGF0ZWRNYXBLZXkiLCJ3VGFibGVDb2RlIiwid29ya2Zsb3dfZmllbGQiLCJoYXNPd25Qcm9wZXJ0eSIsIndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGUiLCJvYmplY3RfdGFibGVfZmllbGRfY29kZSIsIm11bHRpcGxlIiwiaXNfbXVsdGlzZWxlY3QiLCJ0ZmMiLCJjIiwicGFyc2UiLCJ0ciIsIm5ld1RyIiwidGZtIiwid1RkQ29kZSIsImZvcm1UYWJsZUZpZWxkIiwicmVsYXRlZEZpZWxkIiwicmVsYXRlZEZpZWxkTmFtZSIsInJlbGF0ZWRSZWNvcmRzIiwicmVsYXRlZFRhYmxlSXRlbXMiLCJ0YWJsZUNvZGUiLCJ0YWJsZVZhbHVlcyIsIl9GUk9NX1RBQkxFX0NPREUiLCJ3YXJuIiwicnIiLCJ0YWJsZVZhbHVlSXRlbSIsInZhbHVlS2V5IiwiZmllbGRLZXkiLCJmb3JtRmllbGRLZXkiLCJyZWxhdGVkT2JqZWN0RmllbGQiLCJ0YWJsZUZpZWxkVmFsdWUiLCJfdGFibGUiLCJfY29kZSIsImZpZWxkX21hcF9zY3JpcHQiLCJleHRlbmQiLCJldmFsRmllbGRNYXBTY3JpcHQiLCJvYmplY3RJZCIsImZ1bmMiLCJzY3JpcHQiLCJpbnNJZCIsImFwcHJvdmVJZCIsImNmIiwidmVyc2lvbnMiLCJ2ZXJzaW9uSWQiLCJpZHgiLCJuZXdGaWxlIiwiRlMiLCJGaWxlIiwiYXR0YWNoRGF0YSIsImNyZWF0ZVJlYWRTdHJlYW0iLCJvcmlnaW5hbCIsIm1ldGFkYXRhIiwicmVhc29uIiwic2l6ZSIsIm93bmVyX25hbWUiLCJhcHByb3ZlIiwiJHB1c2giLCIkZWFjaCIsIiRwb3NpdGlvbiIsImxvY2tlZCIsImluc3RhbmNlX3N0YXRlIiwiaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvIiwidGFibGVJdGVtcyIsIiRleGlzdHMiLCJnZXRRdWVyeVN0cmluZyIsInN0ZWVkb3NBdXRoIiwiSnNvblJvdXRlcyIsImFkZCIsInJlcyIsIm5leHQiLCJwYXJzZUZpbGVzIiwiZmlsZUNvbGxlY3Rpb24iLCJmaWxlcyIsIm1pbWVUeXBlIiwiYm9keSIsImV4dGVudGlvbiIsImZpbGVPYmoiLCJmaWxlbmFtZSIsIm5ld0ZpbGVPYmpJZCIsInRvTG93ZXJDYXNlIiwiZGVjb2RlVVJJQ29tcG9uZW50Iiwib25jZSIsInN0b3JlTmFtZSIsInJlc3AiLCJ2ZXJzaW9uX2lkIiwiZW5kIiwic3RhdHVzQ29kZSIsImNvbGxlY3Rpb25OYW1lIiwidXNlclNlc3Npb24iLCJhdXRoIiwicmVzdWx0RGF0YSIsInNlbmRSZXN1bHQiLCJzdGFjayIsImVycm9ycyIsIm1lc3NhZ2UiLCJhY2Nlc3NLZXlJZCIsInNlY3JldEFjY2Vzc0tleSIsIm1ldGhvZCIsIkFMWSIsImNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyIsInF1ZXJ5S2V5cyIsInF1ZXJ5U3RyIiwic3RyaW5nVG9TaWduIiwidXRpbCIsIkZvcm1hdCIsIlZlcnNpb24iLCJBY2Nlc3NLZXlJZCIsIlNpZ25hdHVyZU1ldGhvZCIsIlRpbWVzdGFtcCIsImlzbzg2MDEiLCJTaWduYXR1cmVWZXJzaW9uIiwiU2lnbmF0dXJlTm9uY2UiLCJnZXRUaW1lIiwicG9wRXNjYXBlIiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJTaWduYXR1cmUiLCJjcnlwdG8iLCJobWFjIiwicXVlcnlQYXJhbXNUb1N0cmluZyIsImdldFVzZXJJZEZyb21BdXRoVG9rZW4iLCJvc3MiLCJyIiwicmVmMyIsInVwbG9hZEFkZHJlc3MiLCJ1cGxvYWRBdXRoIiwidmlkZW9JZCIsIkFjdGlvbiIsIlRpdGxlIiwiRmlsZU5hbWUiLCJIVFRQIiwiY2FsbCIsIlZpZGVvSWQiLCJVcGxvYWRBZGRyZXNzIiwidG9TdHJpbmciLCJVcGxvYWRBdXRoIiwiT1NTIiwiQWNjZXNzS2V5U2VjcmV0IiwiRW5kcG9pbnQiLCJTZWN1cml0eVRva2VuIiwicHV0T2JqZWN0IiwiQnVja2V0IiwiS2V5IiwiQm9keSIsIkFjY2Vzc0NvbnRyb2xBbGxvd09yaWdpbiIsIkNvbnRlbnRUeXBlIiwiQ2FjaGVDb250cm9sIiwiQ29udGVudERpc3Bvc2l0aW9uIiwiQ29udGVudEVuY29kaW5nIiwiU2VydmVyU2lkZUVuY3J5cHRpb24iLCJFeHBpcmVzIiwiYmluZEVudmlyb25tZW50IiwiZ2V0UGxheUluZm9RdWVyeSIsImdldFBsYXlJbmZvUmVzdWx0IiwiZ2V0UGxheUluZm9VcmwiLCJuZXdEYXRlIiwiY3VycmVudF91c2VyX2lkIiwiY3VycmVudF91c2VyX2luZm8iLCJoYXNoRGF0YSIsImluc2VydGVkX2luc3RhbmNlcyIsIm5ld19pbnMiLCJpbnNlcnRzIiwiZXJyb3JNZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7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S0FBaEI7QUNXRSxXRFZGMUIsV0FBV3lCLFVBQVgsQ0FBc0J2QixHQUF0QixFQUEyQjtBQUMxQm5LLFlBQU0sR0FEb0I7QUFFMUJ0YixZQUFNO0FBQUVrbkIsZ0JBQVEsQ0FBQztBQUFFcUUsd0JBQWN6cEIsRUFBRTJpQixNQUFGLElBQVkzaUIsRUFBRXFsQjtBQUE5QixTQUFEO0FBQVY7QUFGb0IsS0FBM0IsQ0NVRTtBQVVEO0FEMUNILEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdGNoZWNrTnBtVmVyc2lvbnNcbn0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5jaGVja05wbVZlcnNpb25zKHtcblx0YnVzYm95OiBcIl4wLjIuMTNcIixcblx0bWtkaXJwOiBcIl4wLjMuNVwiLFxuXHRcInhtbDJqc1wiOiBcIl4wLjQuMTlcIixcblx0XCJub2RlLXhsc3hcIjogXCJeMC54XCJcbn0sICdzdGVlZG9zOmNyZWF0b3InKTtcblxuaWYgKE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzICYmIE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKSB7XG5cdGNoZWNrTnBtVmVyc2lvbnMoe1xuXHRcdFwiYWxpeXVuLXNka1wiOiBcIl4xLjExLjEyXCJcblx0fSwgJ3N0ZWVkb3M6Y3JlYXRvcicpO1xufSIsIlxuXHQjIENyZWF0b3IuaW5pdEFwcHMoKVxuXG5cbiMgQ3JlYXRvci5pbml0QXBwcyA9ICgpLT5cbiMgXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcbiMgXHRcdF8uZWFjaCBDcmVhdG9yLkFwcHMsIChhcHAsIGFwcF9pZCktPlxuIyBcdFx0XHRkYl9hcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKVxuIyBcdFx0XHRpZiAhZGJfYXBwXG4jIFx0XHRcdFx0YXBwLl9pZCA9IGFwcF9pZFxuIyBcdFx0XHRcdGRiLmFwcHMuaW5zZXJ0KGFwcClcbiMgZWxzZVxuIyBcdGFwcC5faWQgPSBhcHBfaWRcbiMgXHRkYi5hcHBzLnVwZGF0ZSh7X2lkOiBhcHBfaWR9LCBhcHApXG5cbkNyZWF0b3IuZ2V0U2NoZW1hID0gKG9iamVjdF9uYW1lKS0+XG5cdHJldHVybiBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk/LnNjaGVtYVxuXG5DcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQgPSAob2JqZWN0X25hbWUpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0cmV0dXJuIEJ1aWxkZXJDcmVhdG9yLnBsdWdpbkNvbXBvbmVudFNlbGVjdG9yKEJ1aWxkZXJDcmVhdG9yLnN0b3JlLmdldFN0YXRlKCksIFwiT2JqZWN0SG9tZVwiLCBvYmplY3RfbmFtZSlcblxuQ3JlYXRvci5nZXRPYmplY3RVcmwgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSAtPlxuXHRpZiAhYXBwX2lkXG5cdFx0YXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcblx0aWYgIW9iamVjdF9uYW1lXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0bGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbClcblx0bGlzdF92aWV3X2lkID0gbGlzdF92aWV3Py5faWRcblxuXHRpZiByZWNvcmRfaWRcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZClcblx0ZWxzZVxuXHRcdGlmIG9iamVjdF9uYW1lIGlzIFwibWVldGluZ1wiXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCIpXG5cdFx0ZWxzZVxuXHRcdFx0aWYgQ3JlYXRvci5nZXRPYmplY3RIb21lQ29tcG9uZW50KG9iamVjdF9uYW1lKVxuXHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBsaXN0X3ZpZXdfaWRcblx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUpXG5cbkNyZWF0b3IuZ2V0T2JqZWN0QWJzb2x1dGVVcmwgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSAtPlxuXHRpZiAhYXBwX2lkXG5cdFx0YXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcblx0aWYgIW9iamVjdF9uYW1lXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0bGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbClcblx0bGlzdF92aWV3X2lkID0gbGlzdF92aWV3Py5faWRcblxuXHRpZiByZWNvcmRfaWRcblx0XHRyZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZCwgdHJ1ZSlcblx0ZWxzZVxuXHRcdGlmIG9iamVjdF9uYW1lIGlzIFwibWVldGluZ1wiXG5cdFx0XHRyZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCIsIHRydWUpXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQsIHRydWUpXG5cbkNyZWF0b3IuZ2V0T2JqZWN0Um91dGVyVXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cblx0aWYgIWFwcF9pZFxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXG5cdGxpc3Rfdmlld19pZCA9IGxpc3Rfdmlldz8uX2lkXG5cblx0aWYgcmVjb3JkX2lkXG5cdFx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkX2lkXG5cdGVsc2Vcblx0XHRpZiBvYmplY3RfbmFtZSBpcyBcIm1lZXRpbmdcIlxuXHRcdFx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIlxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZFxuXG5DcmVhdG9yLmdldExpc3RWaWV3VXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cblx0dXJsID0gQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZClcblx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwodXJsKVxuXG5DcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwgPSAob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSAtPlxuXHRpZiBsaXN0X3ZpZXdfaWQgaXMgXCJjYWxlbmRhclwiXG5cdFx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIlxuXHRlbHNlXG5cdFx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkXG5cbkNyZWF0b3IuZ2V0U3dpdGNoTGlzdFVybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIC0+XG5cdGlmIGxpc3Rfdmlld19pZFxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIGxpc3Rfdmlld19pZCArIFwiL2xpc3RcIilcblx0ZWxzZVxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9saXN0L3N3aXRjaFwiKVxuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RVcmwgPSAob2JqZWN0X25hbWUsIGFwcF9pZCwgcmVjb3JkX2lkLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUpIC0+XG5cdGlmIHJlbGF0ZWRfZmllbGRfbmFtZVxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIHJlY29yZF9pZCArIFwiL1wiICsgcmVsYXRlZF9vYmplY3RfbmFtZSArIFwiL2dyaWQ/cmVsYXRlZF9maWVsZF9uYW1lPVwiICsgcmVsYXRlZF9maWVsZF9uYW1lKVxuXHRlbHNlXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgcmVjb3JkX2lkICsgXCIvXCIgKyByZWxhdGVkX29iamVjdF9uYW1lICsgXCIvZ3JpZFwiKVxuXG5DcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyA9IChvYmplY3RfbmFtZSwgaXNfZGVlcCwgaXNfc2tpcF9oaWRlLCBpc19yZWxhdGVkKS0+XG5cdF9vcHRpb25zID0gW11cblx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIF9vcHRpb25zXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0ZmllbGRzID0gX29iamVjdD8uZmllbGRzXG5cdGljb24gPSBfb2JqZWN0Py5pY29uXG5cdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XG5cdFx0aWYgaXNfc2tpcF9oaWRlIGFuZCBmLmhpZGRlblxuXHRcdFx0cmV0dXJuXG5cdFx0aWYgZi50eXBlID09IFwic2VsZWN0XCJcblx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7Zi5sYWJlbCB8fCBrfVwiLCB2YWx1ZTogXCIje2t9XCIsIGljb246IGljb259XG5cdFx0ZWxzZVxuXHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XG5cdGlmIGlzX2RlZXBcblx0XHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxuXHRcdFx0aWYgaXNfc2tpcF9oaWRlIGFuZCBmLmhpZGRlblxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIChmLnR5cGUgPT0gXCJsb29rdXBcIiB8fCBmLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpICYmIGYucmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcoZi5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdCMg5LiN5pSv5oyBZi5yZWZlcmVuY2VfdG/kuLpmdW5jdGlvbueahOaDheWGte+8jOaciemcgOaxguWGjeivtFxuXHRcdFx0XHRyX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGYucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRpZiByX29iamVjdFxuXHRcdFx0XHRcdF8uZm9yRWFjaCByX29iamVjdC5maWVsZHMsIChmMiwgazIpLT5cblx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7Zi5sYWJlbCB8fCBrfT0+I3tmMi5sYWJlbCB8fCBrMn1cIiwgdmFsdWU6IFwiI3trfS4je2syfVwiLCBpY29uOiByX29iamVjdD8uaWNvbn1cblx0aWYgaXNfcmVsYXRlZFxuXHRcdHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSlcblx0XHRfLmVhY2ggcmVsYXRlZE9iamVjdHMsIChfcmVsYXRlZE9iamVjdCk9PlxuXHRcdFx0cmVsYXRlZE9wdGlvbnMgPSBDcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyhfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSlcblx0XHRcdHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSlcblx0XHRcdF8uZWFjaCByZWxhdGVkT3B0aW9ucywgKHJlbGF0ZWRPcHRpb24pLT5cblx0XHRcdFx0aWYgX3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXkgIT0gcmVsYXRlZE9wdGlvbi52YWx1ZVxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7cmVsYXRlZE9iamVjdC5sYWJlbCB8fCByZWxhdGVkT2JqZWN0Lm5hbWV9PT4je3JlbGF0ZWRPcHRpb24ubGFiZWx9XCIsIHZhbHVlOiBcIiN7cmVsYXRlZE9iamVjdC5uYW1lfS4je3JlbGF0ZWRPcHRpb24udmFsdWV9XCIsIGljb246IHJlbGF0ZWRPYmplY3Q/Lmljb259XG5cdHJldHVybiBfb3B0aW9uc1xuXG4jIOe7n+S4gOS4uuWvueixoW9iamVjdF9uYW1l5o+Q5L6b5Y+v55So5LqO6L+H6JmR5Zmo6L+H6JmR5a2X5q61XG5DcmVhdG9yLmdldE9iamVjdEZpbHRlckZpZWxkT3B0aW9ucyA9IChvYmplY3RfbmFtZSktPlxuXHRfb3B0aW9ucyA9IFtdXG5cdHVubGVzcyBvYmplY3RfbmFtZVxuXHRcdHJldHVybiBfb3B0aW9uc1xuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xuXHRwZXJtaXNzaW9uX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKG9iamVjdF9uYW1lKVxuXHRpY29uID0gX29iamVjdD8uaWNvblxuXHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxuXHRcdCMgaGlkZGVuLGdyaWTnrYnnsbvlnovnmoTlrZfmrrXvvIzkuI3pnIDopoHov4fmu6Rcblx0XHRpZiAhXy5pbmNsdWRlKFtcImdyaWRcIixcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJhdmF0YXJcIiwgXCJpbWFnZVwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKSBhbmQgIWYuaGlkZGVuXG5cdFx0XHQjIGZpbHRlcnMuJC5maWVsZOWPimZsb3cuY3VycmVudOetieWtkOWtl+auteS5n+S4jemcgOimgei/h+a7pFxuXHRcdFx0aWYgIS9cXHcrXFwuLy50ZXN0KGspIGFuZCBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTFcblx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XG5cblx0cmV0dXJuIF9vcHRpb25zXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRPcHRpb25zID0gKG9iamVjdF9uYW1lKS0+XG5cdF9vcHRpb25zID0gW11cblx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIF9vcHRpb25zXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0ZmllbGRzID0gX29iamVjdD8uZmllbGRzXG5cdHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpXG5cdGljb24gPSBfb2JqZWN0Py5pY29uXG5cdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XG5cdFx0aWYgIV8uaW5jbHVkZShbXCJncmlkXCIsXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwibWFya2Rvd25cIiwgXCJodG1sXCJdLCBmLnR5cGUpXG5cdFx0XHRpZiAhL1xcdytcXC4vLnRlc3QoaykgYW5kIF8uaW5kZXhPZihwZXJtaXNzaW9uX2ZpZWxkcywgaykgPiAtMVxuXHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogZi5sYWJlbCB8fCBrLCB2YWx1ZTogaywgaWNvbjogaWNvbn1cblx0cmV0dXJuIF9vcHRpb25zXG5cbiMjI1xuZmlsdGVyczog6KaB6L2s5o2i55qEZmlsdGVyc1xuZmllbGRzOiDlr7nosaHlrZfmrrVcbmZpbHRlcl9maWVsZHM6IOm7mOiupOi/h+a7pOWtl+aute+8jOaUr+aMgeWtl+espuS4suaVsOe7hOWSjOWvueixoeaVsOe7hOS4pOenjeagvOW8j++8jOWmgjpbJ2ZpbGVkX25hbWUxJywnZmlsZWRfbmFtZTInXSxbe2ZpZWxkOidmaWxlZF9uYW1lMScscmVxdWlyZWQ6dHJ1ZX1dXG7lpITnkIbpgLvovpE6IOaKimZpbHRlcnPkuK3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25aKe5Yqg5q+P6aG555qEaXNfZGVmYXVsdOOAgWlzX3JlcXVpcmVk5bGe5oCn77yM5LiN5a2Y5Zyo5LqOZmlsdGVyX2ZpZWxkc+eahOi/h+a7pOadoeS7tuWvueW6lOeahOenu+mZpOavj+mhueeahOebuOWFs+WxnuaAp1xu6L+U5Zue57uT5p6cOiDlpITnkIblkI7nmoRmaWx0ZXJzXG4jIyNcbkNyZWF0b3IuZ2V0RmlsdGVyc1dpdGhGaWx0ZXJGaWVsZHMgPSAoZmlsdGVycywgZmllbGRzLCBmaWx0ZXJfZmllbGRzKS0+XG5cdHVubGVzcyBmaWx0ZXJzXG5cdFx0ZmlsdGVycyA9IFtdXG5cdHVubGVzcyBmaWx0ZXJfZmllbGRzXG5cdFx0ZmlsdGVyX2ZpZWxkcyA9IFtdXG5cdGlmIGZpbHRlcl9maWVsZHM/Lmxlbmd0aFxuXHRcdGZpbHRlcl9maWVsZHMuZm9yRWFjaCAobiktPlxuXHRcdFx0aWYgXy5pc1N0cmluZyhuKVxuXHRcdFx0XHRuID0gXG5cdFx0XHRcdFx0ZmllbGQ6IG4sXG5cdFx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlXG5cdFx0XHRpZiBmaWVsZHNbbi5maWVsZF0gYW5kICFfLmZpbmRXaGVyZShmaWx0ZXJzLHtmaWVsZDpuLmZpZWxkfSlcblx0XHRcdFx0ZmlsdGVycy5wdXNoXG5cdFx0XHRcdFx0ZmllbGQ6IG4uZmllbGQsXG5cdFx0XHRcdFx0aXNfZGVmYXVsdDogdHJ1ZSxcblx0XHRcdFx0XHRpc19yZXF1aXJlZDogbi5yZXF1aXJlZFxuXHRmaWx0ZXJzLmZvckVhY2ggKGZpbHRlckl0ZW0pLT5cblx0XHRtYXRjaEZpZWxkID0gZmlsdGVyX2ZpZWxkcy5maW5kIChuKS0+IHJldHVybiBuID09IGZpbHRlckl0ZW0uZmllbGQgb3Igbi5maWVsZCA9PSBmaWx0ZXJJdGVtLmZpZWxkXG5cdFx0aWYgXy5pc1N0cmluZyhtYXRjaEZpZWxkKVxuXHRcdFx0bWF0Y2hGaWVsZCA9IFxuXHRcdFx0XHRmaWVsZDogbWF0Y2hGaWVsZCxcblx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlXG5cdFx0aWYgbWF0Y2hGaWVsZFxuXHRcdFx0ZmlsdGVySXRlbS5pc19kZWZhdWx0ID0gdHJ1ZVxuXHRcdFx0ZmlsdGVySXRlbS5pc19yZXF1aXJlZCA9IG1hdGNoRmllbGQucmVxdWlyZWRcblx0XHRlbHNlXG5cdFx0XHRkZWxldGUgZmlsdGVySXRlbS5pc19kZWZhdWx0XG5cdFx0XHRkZWxldGUgZmlsdGVySXRlbS5pc19yZXF1aXJlZFxuXHRyZXR1cm4gZmlsdGVyc1xuXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpLT5cblxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRpZiAhcmVjb3JkX2lkXG5cdFx0cmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgb2JqZWN0X25hbWUgPT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSAmJiAgcmVjb3JkX2lkID09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpXG5cdFx0XHRpZiBUZW1wbGF0ZS5pbnN0YW5jZSgpPy5yZWNvcmRcblx0XHRcdFx0cmV0dXJuIFRlbXBsYXRlLmluc3RhbmNlKCk/LnJlY29yZD8uZ2V0KClcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKVxuXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdGlmIG9iai5kYXRhYmFzZV9uYW1lID09IFwibWV0ZW9yXCIgfHwgIW9iai5kYXRhYmFzZV9uYW1lXG5cdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSlcblx0XHRpZiBjb2xsZWN0aW9uXG5cdFx0XHRyZWNvcmQgPSBjb2xsZWN0aW9uLmZpbmRPbmUocmVjb3JkX2lkKVxuXHRcdFx0cmV0dXJuIHJlY29yZFxuXHRlbHNlIGlmIG9iamVjdF9uYW1lICYmIHJlY29yZF9pZFxuXHRcdHJldHVybiBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpXG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkTmFtZSA9IChyZWNvcmQsIG9iamVjdF9uYW1lKS0+XG5cdHVubGVzcyByZWNvcmRcblx0XHRyZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpXG5cdGlmIHJlY29yZFxuXHRcdCMg5pi+56S657uE57uH5YiX6KGo5pe277yM54m55q6K5aSE55CGbmFtZV9maWVsZF9rZXnkuLpuYW1l5a2X5q61XG5cdFx0bmFtZV9maWVsZF9rZXkgPSBpZiBvYmplY3RfbmFtZSA9PSBcIm9yZ2FuaXphdGlvbnNcIiB0aGVuIFwibmFtZVwiIGVsc2UgQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5OQU1FX0ZJRUxEX0tFWVxuXHRcdGlmIHJlY29yZCBhbmQgbmFtZV9maWVsZF9rZXlcblx0XHRcdHJldHVybiByZWNvcmQubGFiZWwgfHwgcmVjb3JkW25hbWVfZmllbGRfa2V5XVxuXG5DcmVhdG9yLmdldEFwcCA9IChhcHBfaWQpLT5cblx0aWYgIWFwcF9pZFxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdGFwcCA9IENyZWF0b3IuQXBwc1thcHBfaWRdXG5cdENyZWF0b3IuZGVwcz8uYXBwPy5kZXBlbmQoKVxuXHRyZXR1cm4gYXBwXG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkID0gKGFwcF9pZCktPlxuXHRhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpXG5cdGlmICFhcHBcblx0XHRyZXR1cm5cblx0ZGFzaGJvYXJkID0gbnVsbFxuXHRfLmVhY2ggQ3JlYXRvci5EYXNoYm9hcmRzLCAodiwgayktPlxuXHRcdGlmIHYuYXBwcz8uaW5kZXhPZihhcHAuX2lkKSA+IC0xXG5cdFx0XHRkYXNoYm9hcmQgPSB2O1xuXHRyZXR1cm4gZGFzaGJvYXJkO1xuXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZENvbXBvbmVudCA9IChhcHBfaWQpLT5cblx0YXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKVxuXHRpZiAhYXBwXG5cdFx0cmV0dXJuXG5cdHJldHVybiBCdWlsZGVyQ3JlYXRvci5wbHVnaW5Db21wb25lbnRTZWxlY3RvcihCdWlsZGVyQ3JlYXRvci5zdG9yZS5nZXRTdGF0ZSgpLCBcIkRhc2hib2FyZFwiLCBhcHAuX2lkKTtcblxuQ3JlYXRvci5nZXRBcHBPYmplY3ROYW1lcyA9IChhcHBfaWQpLT5cblx0YXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKVxuXHRpZiAhYXBwXG5cdFx0cmV0dXJuXG5cdGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpXG5cdGFwcE9iamVjdHMgPSBpZiBpc01vYmlsZSB0aGVuIGFwcC5tb2JpbGVfb2JqZWN0cyBlbHNlIGFwcC5vYmplY3RzXG5cdG9iamVjdHMgPSBbXVxuXHRpZiBhcHBcblx0XHRfLmVhY2ggYXBwT2JqZWN0cywgKHYpLT5cblx0XHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KHYpXG5cdFx0XHRpZiBvYmo/LnBlcm1pc3Npb25zLmdldCgpLmFsbG93UmVhZFxuXHRcdFx0XHRvYmplY3RzLnB1c2ggdlxuXHRyZXR1cm4gb2JqZWN0c1xuXG5DcmVhdG9yLmdldEFwcE1lbnUgPSAoYXBwX2lkLCBtZW51X2lkKS0+XG5cdG1lbnVzID0gQ3JlYXRvci5nZXRBcHBNZW51cyhhcHBfaWQpXG5cdHJldHVybiBtZW51cyAmJiBtZW51cy5maW5kIChtZW51KS0+IHJldHVybiBtZW51LmlkID09IG1lbnVfaWRcblxuQ3JlYXRvci5nZXRBcHBNZW51VXJsRm9ySW50ZXJuZXQgPSAobWVudSktPlxuXHQjIOW9k3RhYnPnsbvlnovkuLp1cmzml7bvvIzmjInlpJbpg6jpk77mjqXlpITnkIbvvIzmlK/mjIHphY3nva7ooajovr7lvI/lubbliqDkuIrnu5/kuIDnmoR1cmzlj4LmlbBcblx0cGFyYW1zID0ge307XG5cdHBhcmFtc1tcIlgtU3BhY2UtSWRcIl0gPSBTdGVlZG9zLnNwYWNlSWQoKVxuXHRwYXJhbXNbXCJYLVVzZXItSWRcIl0gPSBTdGVlZG9zLnVzZXJJZCgpO1xuXHRwYXJhbXNbXCJYLUNvbXBhbnktSWRzXCJdID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpO1xuXHQjIHBhcmFtc1tcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG5cdHVybCA9IG1lbnUucGF0aFxuXHR1cmwgPSBTdGVlZG9zLnBhcnNlU2luZ2xlRXhwcmVzc2lvbih1cmwsIG1lbnUsIFwiI1wiLCBDcmVhdG9yLlVTRVJfQ09OVEVYVClcblx0aGFzUXVlcnlTeW1ib2wgPSAvKFxcIy4rXFw/KXwoXFw/W14jXSokKS9nLnRlc3QodXJsKVxuXHQjIOWmguaenOayoeaciSPlj7fml7bljrvliKTmlq3mmK/lkKbmnInvvJ/lj7fvvIzmnInmnKvlsL7liqAm77yM5peg5pyr5bC+5Yqg77yf77ybICAgIOaciSPlj7fml7bliKTmlq0j5Y+35ZCO6Z2i5piv5ZCm5pyJ77yf5Y+377yM5pyJ5pyr5bC+5YqgJu+8jOaXoOacq+WwvuWKoO+8n1xuXHRsaW5rU3RyID0gaWYgaGFzUXVlcnlTeW1ib2wgdGhlbiBcIiZcIiBlbHNlIFwiP1wiXG5cdHJldHVybiBcIiN7dXJsfSN7bGlua1N0cn0jeyQucGFyYW0ocGFyYW1zKX1cIlxuXG5DcmVhdG9yLmdldEFwcE1lbnVVcmwgPSAobWVudSktPlxuXHR1cmwgPSBtZW51LnBhdGhcblx0aWYgbWVudS50eXBlID09IFwidXJsXCJcblx0XHRpZiBtZW51LnRhcmdldFxuXHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0QXBwTWVudVVybEZvckludGVybmV0KG1lbnUpXG5cdFx0ZWxzZVxuXHRcdFx0IyDlnKhpZnJhbWXkuK3mmL7npLp1cmznlYzpnaJcblx0XHRcdHJldHVybiBcIi9hcHAvLS90YWJfaWZyYW1lLyN7bWVudS5pZH1cIlxuXHRlbHNlXG5cdFx0cmV0dXJuIG1lbnUucGF0aFxuXG5DcmVhdG9yLmdldEFwcE1lbnVzID0gKGFwcF9pZCktPlxuXHRhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpXG5cdGlmICFhcHBcblx0XHRyZXR1cm4gW11cblx0YXBwTWVudXMgPSBTZXNzaW9uLmdldChcImFwcF9tZW51c1wiKTtcblx0dW5sZXNzIGFwcE1lbnVzXG5cdFx0cmV0dXJuIFtdXG5cdGN1cmVudEFwcE1lbnVzID0gYXBwTWVudXMuZmluZCAobWVudUl0ZW0pIC0+XG5cdFx0cmV0dXJuIG1lbnVJdGVtLmlkID09IGFwcC5faWRcblx0aWYgY3VyZW50QXBwTWVudXNcblx0XHRyZXR1cm4gY3VyZW50QXBwTWVudXMuY2hpbGRyZW5cblxuQ3JlYXRvci5sb2FkQXBwc01lbnVzID0gKCktPlxuXHRpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRkYXRhID0geyB9XG5cdGlmIGlzTW9iaWxlXG5cdFx0ZGF0YS5tb2JpbGUgPSBpc01vYmlsZVxuXHRvcHRpb25zID0geyBcblx0XHR0eXBlOiAnZ2V0JywgXG5cdFx0ZGF0YTogZGF0YSwgXG5cdFx0c3VjY2VzczogKGRhdGEpLT5cblx0XHRcdFNlc3Npb24uc2V0KFwiYXBwX21lbnVzXCIsIGRhdGEpO1xuXHQgfVxuXHRTdGVlZG9zLmF1dGhSZXF1ZXN0IFwiL3NlcnZpY2UvYXBpL2FwcHMvbWVudXNcIiwgb3B0aW9uc1xuXG5DcmVhdG9yLmdldFZpc2libGVBcHBzID0gKGluY2x1ZGVBZG1pbiktPlxuXHRjaGFuZ2VBcHAgPSBDcmVhdG9yLl9zdWJBcHAuZ2V0KCk7XG5cdEJ1aWxkZXJDcmVhdG9yLnN0b3JlLmdldFN0YXRlKCkuZW50aXRpZXMuYXBwcyA9IE9iamVjdC5hc3NpZ24oe30sIEJ1aWxkZXJDcmVhdG9yLnN0b3JlLmdldFN0YXRlKCkuZW50aXRpZXMuYXBwcywge2FwcHM6IGNoYW5nZUFwcH0pO1xuXHRyZXR1cm4gQnVpbGRlckNyZWF0b3IudmlzaWJsZUFwcHNTZWxlY3RvcihCdWlsZGVyQ3JlYXRvci5zdG9yZS5nZXRTdGF0ZSgpLCBpbmNsdWRlQWRtaW4pXG5cbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHNPYmplY3RzID0gKCktPlxuXHRhcHBzID0gQ3JlYXRvci5nZXRWaXNpYmxlQXBwcygpXG5cdHZpc2libGVPYmplY3ROYW1lcyA9IF8uZmxhdHRlbihfLnBsdWNrKGFwcHMsJ29iamVjdHMnKSlcblx0b2JqZWN0cyA9IF8uZmlsdGVyIENyZWF0b3IuT2JqZWN0cywgKG9iaiktPlxuXHRcdGlmIHZpc2libGVPYmplY3ROYW1lcy5pbmRleE9mKG9iai5uYW1lKSA8IDBcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB0cnVlXG5cdG9iamVjdHMgPSBvYmplY3RzLnNvcnQoQ3JlYXRvci5zb3J0aW5nTWV0aG9kLmJpbmQoe2tleTpcImxhYmVsXCJ9KSlcblx0b2JqZWN0cyA9IF8ucGx1Y2sob2JqZWN0cywnbmFtZScpXG5cdHJldHVybiBfLnVuaXEgb2JqZWN0c1xuXG5DcmVhdG9yLmdldEFwcHNPYmplY3RzID0gKCktPlxuXHRvYmplY3RzID0gW11cblx0dGVtcE9iamVjdHMgPSBbXVxuXHRfLmZvckVhY2ggQ3JlYXRvci5BcHBzLCAoYXBwKS0+XG5cdFx0dGVtcE9iamVjdHMgPSBfLmZpbHRlciBhcHAub2JqZWN0cywgKG9iaiktPlxuXHRcdFx0cmV0dXJuICFvYmouaGlkZGVuXG5cdFx0b2JqZWN0cyA9IG9iamVjdHMuY29uY2F0KHRlbXBPYmplY3RzKVxuXHRyZXR1cm4gXy51bmlxIG9iamVjdHNcblxuQ3JlYXRvci52YWxpZGF0ZUZpbHRlcnMgPSAoZmlsdGVycywgbG9naWMpLT5cblx0ZmlsdGVyX2l0ZW1zID0gXy5tYXAgZmlsdGVycywgKG9iaikgLT5cblx0XHRpZiBfLmlzRW1wdHkob2JqKVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG9ialxuXHRmaWx0ZXJfaXRlbXMgPSBfLmNvbXBhY3QoZmlsdGVyX2l0ZW1zKVxuXHRlcnJvck1zZyA9IFwiXCJcblx0ZmlsdGVyX2xlbmd0aCA9IGZpbHRlcl9pdGVtcy5sZW5ndGhcblx0aWYgbG9naWNcblx0XHQjIOagvOW8j+WMlmZpbHRlclxuXHRcdGxvZ2ljID0gbG9naWMucmVwbGFjZSgvXFxuL2csIFwiXCIpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpXG5cblx0XHQjIOWIpOaWreeJueauiuWtl+esplxuXHRcdGlmIC9bLl9cXC0hK10rL2lnLnRlc3QobG9naWMpXG5cdFx0XHRlcnJvck1zZyA9IFwi5ZCr5pyJ54m55q6K5a2X56ym44CCXCJcblxuXHRcdGlmICFlcnJvck1zZ1xuXHRcdFx0aW5kZXggPSBsb2dpYy5tYXRjaCgvXFxkKy9pZylcblx0XHRcdGlmICFpbmRleFxuXHRcdFx0XHRlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5kZXguZm9yRWFjaCAoaSktPlxuXHRcdFx0XHRcdGlmIGkgPCAxIG9yIGkgPiBmaWx0ZXJfbGVuZ3RoXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5p2h5Lu25byV55So5LqG5pyq5a6a5LmJ55qE562b6YCJ5Zmo77yaI3tpfeOAglwiXG5cblx0XHRcdFx0ZmxhZyA9IDFcblx0XHRcdFx0d2hpbGUgZmxhZyA8PSBmaWx0ZXJfbGVuZ3RoXG5cdFx0XHRcdFx0aWYgIWluZGV4LmluY2x1ZGVzKFwiI3tmbGFnfVwiKVxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBcIuacieS6m+etm+mAieadoeS7tui/m+ihjOS6huWumuS5ie+8jOS9huacquWcqOmrmOe6p+etm+mAieadoeS7tuS4reiiq+W8leeUqOOAglwiXG5cdFx0XHRcdFx0ZmxhZysrO1xuXG5cdFx0aWYgIWVycm9yTXNnXG5cdFx0XHQjIOWIpOaWreaYr+WQpuaciemdnuazleiLseaWh+Wtl+esplxuXHRcdFx0d29yZCA9IGxvZ2ljLm1hdGNoKC9bYS16QS1aXSsvaWcpXG5cdFx0XHRpZiB3b3JkXG5cdFx0XHRcdHdvcmQuZm9yRWFjaCAodyktPlxuXHRcdFx0XHRcdGlmICEvXihhbmR8b3IpJC9pZy50ZXN0KHcpXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IFwi5qOA5p+l5oKo55qE6auY57qn562b6YCJ5p2h5Lu25Lit55qE5ou85YaZ44CCXCJcblxuXHRcdGlmICFlcnJvck1zZ1xuXHRcdFx0IyDliKTmlq3moLzlvI/mmK/lkKbmraPnoa5cblx0XHRcdHRyeVxuXHRcdFx0XHRDcmVhdG9yLmV2YWwobG9naWMucmVwbGFjZSgvYW5kL2lnLCBcIiYmXCIpLnJlcGxhY2UoL29yL2lnLCBcInx8XCIpKVxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5Lit5ZCr5pyJ54m55q6K5a2X56ymXCJcblxuXHRcdFx0aWYgLyhBTkQpW14oKV0rKE9SKS9pZy50ZXN0KGxvZ2ljKSB8fCAgLyhPUilbXigpXSsoQU5EKS9pZy50ZXN0KGxvZ2ljKVxuXHRcdFx0XHRlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5b+F6aG75Zyo6L+e57ut5oCn55qEIEFORCDlkowgT1Ig6KGo6L6+5byP5YmN5ZCO5L2/55So5ous5Y+344CCXCJcblx0aWYgZXJyb3JNc2dcblx0XHRjb25zb2xlLmxvZyBcImVycm9yXCIsIGVycm9yTXNnXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHR0b2FzdHIuZXJyb3IoZXJyb3JNc2cpXG5cdFx0cmV0dXJuIGZhbHNlXG5cdGVsc2Vcblx0XHRyZXR1cm4gdHJ1ZVxuXG4jIFwiPVwiLCBcIjw+XCIsIFwiPlwiLCBcIj49XCIsIFwiPFwiLCBcIjw9XCIsIFwic3RhcnRzd2l0aFwiLCBcImNvbnRhaW5zXCIsIFwibm90Y29udGFpbnNcIi5cbiMjI1xub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcbmV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcbiMjI1xuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9Nb25nbyA9IChmaWx0ZXJzLCBvcHRpb25zKS0+XG5cdHVubGVzcyBmaWx0ZXJzPy5sZW5ndGhcblx0XHRyZXR1cm5cblx0IyDlvZNmaWx0ZXJz5LiN5pivW0FycmF5Xeexu+Wei+iAjOaYr1tPYmplY3Rd57G75Z6L5pe277yM6L+b6KGM5qC85byP6L2s5o2iXG5cdHVubGVzcyBmaWx0ZXJzWzBdIGluc3RhbmNlb2YgQXJyYXlcblx0XHRmaWx0ZXJzID0gXy5tYXAgZmlsdGVycywgKG9iaiktPlxuXHRcdFx0cmV0dXJuIFtvYmouZmllbGQsIG9iai5vcGVyYXRpb24sIG9iai52YWx1ZV1cblx0c2VsZWN0b3IgPSBbXVxuXHRfLmVhY2ggZmlsdGVycywgKGZpbHRlciktPlxuXHRcdGZpZWxkID0gZmlsdGVyWzBdXG5cdFx0b3B0aW9uID0gZmlsdGVyWzFdXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSlcblx0XHRlbHNlXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgbnVsbCwgb3B0aW9ucylcblx0XHRzdWJfc2VsZWN0b3IgPSB7fVxuXHRcdHN1Yl9zZWxlY3RvcltmaWVsZF0gPSB7fVxuXHRcdGlmIG9wdGlvbiA9PSBcIj1cIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRlcVwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8PlwiXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJG5lXCJdID0gdmFsdWVcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIj5cIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndFwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI+PVwiXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGd0ZVwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8XCJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPD1cIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdGVcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwic3RhcnRzd2l0aFwiXG5cdFx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXlwiICsgdmFsdWUsIFwiaVwiKVxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZ1xuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiY29udGFpbnNcIlxuXHRcdFx0cmVnID0gbmV3IFJlZ0V4cCh2YWx1ZSwgXCJpXCIpXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCJub3Rjb250YWluc1wiXG5cdFx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXigoPyFcIiArIHZhbHVlICsgXCIpLikqJFwiLCBcImlcIilcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWdcblx0XHRzZWxlY3Rvci5wdXNoIHN1Yl9zZWxlY3RvclxuXHRyZXR1cm4gc2VsZWN0b3JcblxuQ3JlYXRvci5pc0JldHdlZW5GaWx0ZXJPcGVyYXRpb24gPSAob3BlcmF0aW9uKS0+XG5cdHJldHVybiBvcGVyYXRpb24gPT0gXCJiZXR3ZWVuXCIgb3IgISFDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyh0cnVlKT9bb3BlcmF0aW9uXVxuXG4jIyNcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5cdGV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcbiMjI1xuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9EZXYgPSAoZmlsdGVycywgb2JqZWN0X25hbWUsIG9wdGlvbnMpLT5cblx0c3RlZWRvc0ZpbHRlcnMgPSByZXF1aXJlKFwiQHN0ZWVkb3MvZmlsdGVyc1wiKTtcblx0dW5sZXNzIGZpbHRlcnMubGVuZ3RoXG5cdFx0cmV0dXJuXG5cdGlmIG9wdGlvbnM/LmlzX2xvZ2ljX29yXG5cdFx0IyDlpoLmnpxpc19sb2dpY19vcuS4unRydWXvvIzkuLpmaWx0ZXJz56ys5LiA5bGC5YWD57Sg5aKe5Yqgb3Lpl7TpmpRcblx0XHRsb2dpY1RlbXBGaWx0ZXJzID0gW11cblx0XHRmaWx0ZXJzLmZvckVhY2ggKG4pLT5cblx0XHRcdGxvZ2ljVGVtcEZpbHRlcnMucHVzaChuKVxuXHRcdFx0bG9naWNUZW1wRmlsdGVycy5wdXNoKFwib3JcIilcblx0XHRsb2dpY1RlbXBGaWx0ZXJzLnBvcCgpXG5cdFx0ZmlsdGVycyA9IGxvZ2ljVGVtcEZpbHRlcnNcblx0c2VsZWN0b3IgPSBzdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9EZXYoZmlsdGVycywgQ3JlYXRvci5VU0VSX0NPTlRFWFQpXG5cdHJldHVybiBzZWxlY3RvclxuXG4jIyNcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4jIyNcbkNyZWF0b3IuZm9ybWF0TG9naWNGaWx0ZXJzVG9EZXYgPSAoZmlsdGVycywgZmlsdGVyX2xvZ2ljLCBvcHRpb25zKS0+XG5cdGZvcm1hdF9sb2dpYyA9IGZpbHRlcl9sb2dpYy5yZXBsYWNlKC9cXChcXHMrL2lnLCBcIihcIikucmVwbGFjZSgvXFxzK1xcKS9pZywgXCIpXCIpLnJlcGxhY2UoL1xcKC9nLCBcIltcIikucmVwbGFjZSgvXFwpL2csIFwiXVwiKS5yZXBsYWNlKC9cXHMrL2csIFwiLFwiKS5yZXBsYWNlKC8oYW5kfG9yKS9pZywgXCInJDEnXCIpXG5cdGZvcm1hdF9sb2dpYyA9IGZvcm1hdF9sb2dpYy5yZXBsYWNlKC8oXFxkKSsvaWcsICh4KS0+XG5cdFx0X2YgPSBmaWx0ZXJzW3gtMV1cblx0XHRmaWVsZCA9IF9mLmZpZWxkXG5cdFx0b3B0aW9uID0gX2Yub3BlcmF0aW9uXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlKVxuXHRcdGVsc2Vcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUsIG51bGwsIG9wdGlvbnMpXG5cdFx0c3ViX3NlbGVjdG9yID0gW11cblx0XHRpZiBfLmlzQXJyYXkodmFsdWUpID09IHRydWVcblx0XHRcdGlmIG9wdGlvbiA9PSBcIj1cIlxuXHRcdFx0XHRfLmVhY2ggdmFsdWUsICh2KS0+XG5cdFx0XHRcdFx0c3ViX3NlbGVjdG9yLnB1c2ggW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCJcblx0XHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPD5cIlxuXHRcdFx0XHRfLmVhY2ggdmFsdWUsICh2KS0+XG5cdFx0XHRcdFx0c3ViX3NlbGVjdG9yLnB1c2ggW2ZpZWxkLCBvcHRpb24sIHZdLCBcImFuZFwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdF8uZWFjaCB2YWx1ZSwgKHYpLT5cblx0XHRcdFx0XHRzdWJfc2VsZWN0b3IucHVzaCBbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIlxuXHRcdFx0aWYgc3ViX3NlbGVjdG9yW3N1Yl9zZWxlY3Rvci5sZW5ndGggLSAxXSA9PSBcImFuZFwiIHx8IHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT0gXCJvclwiXG5cdFx0XHRcdHN1Yl9zZWxlY3Rvci5wb3AoKVxuXHRcdGVsc2Vcblx0XHRcdHN1Yl9zZWxlY3RvciA9IFtmaWVsZCwgb3B0aW9uLCB2YWx1ZV1cblx0XHRjb25zb2xlLmxvZyBcInN1Yl9zZWxlY3RvclwiLCBzdWJfc2VsZWN0b3Jcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3ViX3NlbGVjdG9yKVxuXHQpXG5cdGZvcm1hdF9sb2dpYyA9IFwiWyN7Zm9ybWF0X2xvZ2ljfV1cIlxuXHRyZXR1cm4gQ3JlYXRvci5ldmFsKGZvcm1hdF9sb2dpYylcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRpZiAhX29iamVjdFxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lc1xuXG4jXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soX29iamVjdC5yZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxuXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoX29iamVjdC5fY29sbGVjdGlvbl9uYW1lKVxuXG5cdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxuXHRpZiByZWxhdGVkX29iamVjdF9uYW1lcz8ubGVuZ3RoID09IDBcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXNcblxuXHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0dW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0c1xuXG5cdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0c1xuXHRyZXR1cm4gXy5maWx0ZXIgcmVsYXRlZF9vYmplY3RzLCAocmVsYXRlZF9vYmplY3QpLT5cblx0XHRyZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3Qub2JqZWN0X25hbWVcblx0XHRpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMVxuXHRcdCMgcmVsYXRlZF9vYmplY3RfbmFtZSA9IGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjZnNfZmlsZXNfZmlsZXJlY29yZFwiIHRoZW4gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiIGVsc2UgcmVsYXRlZF9vYmplY3RfbmFtZVxuXHRcdGFsbG93UmVhZCA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8uYWxsb3dSZWFkXG5cdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRhbGxvd1JlYWQgPSBhbGxvd1JlYWQgJiYgcGVybWlzc2lvbnMuYWxsb3dSZWFkRmlsZXNcblx0XHRyZXR1cm4gaXNBY3RpdmUgYW5kIGFsbG93UmVhZFxuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3ROYW1lcyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0cmV0dXJuIF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0TGlzdEFjdGlvbnMgPSAocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRhY3Rpb25zID0gQ3JlYXRvci5nZXRBY3Rpb25zKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XG5cdFx0aWYgYWN0aW9uLm5hbWUgPT0gXCJzdGFuZGFyZF9mb2xsb3dcIlxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0aWYgYWN0aW9uLm5hbWUgPT0gXCJzdGFuZGFyZF9xdWVyeVwiXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRpZiBhY3Rpb24ub24gPT0gXCJsaXN0XCJcblx0XHRcdGlmIHR5cGVvZiBhY3Rpb24udmlzaWJsZSA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0cmV0dXJuIGFjdGlvbi52aXNpYmxlKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIGFjdGlvbi52aXNpYmxlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdHJldHVybiBhY3Rpb25zXG5cbkNyZWF0b3IuZ2V0QWN0aW9ucyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRpZiAhb2JqXG5cdFx0cmV0dXJuXG5cblx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdGRpc2FibGVkX2FjdGlvbnMgPSBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zXG5cdGFjdGlvbnMgPSBfLnNvcnRCeShfLnZhbHVlcyhvYmouYWN0aW9ucykgLCAnc29ydCcpO1xuXG5cdGlmIF8uaGFzKG9iaiwgJ2FsbG93X2N1c3RvbUFjdGlvbnMnKVxuXHRcdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XG5cdFx0XHRyZXR1cm4gXy5pbmNsdWRlKG9iai5hbGxvd19jdXN0b21BY3Rpb25zLCBhY3Rpb24ubmFtZSkgfHwgXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLmdldE9iamVjdCgnYmFzZScpLmFjdGlvbnMpIHx8IHt9LCBhY3Rpb24ubmFtZSlcblx0aWYgXy5oYXMob2JqLCAnZXhjbHVkZV9hY3Rpb25zJylcblx0XHRhY3Rpb25zID0gXy5maWx0ZXIgYWN0aW9ucywgKGFjdGlvbiktPlxuXHRcdFx0cmV0dXJuICFfLmluY2x1ZGUob2JqLmV4Y2x1ZGVfYWN0aW9ucywgYWN0aW9uLm5hbWUpXG5cblx0Xy5lYWNoIGFjdGlvbnMsIChhY3Rpb24pLT5cblx0XHQjIOaJi+acuuS4iuWPquaYvuekuue8lui+keaMiemSru+8jOWFtuS7lueahOaUvuWIsOaKmOWPoOS4i+aLieiPnOWNleS4rVxuXHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJyZWNvcmRcIiwgXCJyZWNvcmRfb25seVwiXS5pbmRleE9mKGFjdGlvbi5vbikgPiAtMSAmJiBhY3Rpb24ubmFtZSAhPSAnc3RhbmRhcmRfZWRpdCdcblx0XHRcdGlmIGFjdGlvbi5vbiA9PSBcInJlY29yZF9vbmx5XCJcblx0XHRcdFx0YWN0aW9uLm9uID0gJ3JlY29yZF9vbmx5X21vcmUnXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGFjdGlvbi5vbiA9ICdyZWNvcmRfbW9yZSdcblxuXHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgJiYgW1wiY21zX2ZpbGVzXCIsIFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIl0uaW5kZXhPZihvYmplY3RfbmFtZSkgPiAtMVxuXHRcdCMg6ZmE5Lu254m55q6K5aSE55CG77yM5LiL6L295oyJ6ZKu5pS+5Zyo5Li76I+c5Y2V77yM57yW6L6R5oyJ6ZKu5pS+5Yiw5bqV5LiL5oqY5Y+g5LiL5ouJ6I+c5Y2V5LitXG5cdFx0YWN0aW9ucy5maW5kKChuKS0+IHJldHVybiBuLm5hbWUgPT0gXCJzdGFuZGFyZF9lZGl0XCIpPy5vbiA9IFwicmVjb3JkX21vcmVcIlxuXHRcdGFjdGlvbnMuZmluZCgobiktPiByZXR1cm4gbi5uYW1lID09IFwiZG93bmxvYWRcIik/Lm9uID0gXCJyZWNvcmRcIlxuXG5cdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XG5cdFx0cmV0dXJuIF8uaW5kZXhPZihkaXNhYmxlZF9hY3Rpb25zLCBhY3Rpb24ubmFtZSkgPCAwXG5cblx0cmV0dXJuIGFjdGlvbnNcblxuLy8vXG5cdOi/lOWbnuW9k+WJjeeUqOaIt+acieadg+mZkOiuv+mXrueahOaJgOaciWxpc3Rfdmlld++8jOWMheaLrOWIhuS6q+eahO+8jOeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahO+8iOmZpOmdnm93bmVy5Y+Y5LqG77yJ77yM5Lul5Y+K6buY6K6k55qE5YW25LuW6KeG5Zu+XG5cdOazqOaEj0NyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mmK/kuI3kvJrmnInnlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTop4blm77nmoTvvIzmiYDku6VDcmVhdG9yLmdldFBlcm1pc3Npb25z5Ye95pWw5Lit5ou/5Yiw55qE57uT5p6c5LiN5YWo77yM5bm25LiN5piv5b2T5YmN55So5oi36IO955yL5Yiw5omA5pyJ6KeG5Zu+XG4vLy9cbkNyZWF0b3IuZ2V0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdGlmICF1c2VySWRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcblx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuXG5cblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0aWYgIW9iamVjdFxuXHRcdHJldHVyblxuXG5cdGRpc2FibGVkX2xpc3Rfdmlld3MgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy5kaXNhYmxlZF9saXN0X3ZpZXdzIHx8IFtdXG5cblx0bGlzdF92aWV3cyA9IFtdXG5cblx0aXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKClcblxuXHRfLmVhY2ggb2JqZWN0Lmxpc3Rfdmlld3MsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpdGVtLm5hbWUgPSBpdGVtX25hbWVcblxuXHRsaXN0Vmlld3MgPSBfLnNvcnRCeShfLnZhbHVlcyhvYmplY3QubGlzdF92aWV3cykgLCAnc29ydF9ubycpO1xuXG5cdF8uZWFjaCBsaXN0Vmlld3MsIChpdGVtKS0+XG5cdFx0aWYgaXNNb2JpbGUgYW5kIGl0ZW0udHlwZSA9PSBcImNhbGVuZGFyXCJcblx0XHRcdCMg5omL5py65LiK5YWI5LiN5pi+56S65pel5Y6G6KeG5Zu+XG5cdFx0XHRyZXR1cm5cblx0XHRpZiBpdGVtLm5hbWUgICE9IFwiZGVmYXVsdFwiXG5cdFx0XHRpc0Rpc2FibGVkID0gXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW0ubmFtZSkgPiAtMSB8fCAoaXRlbS5faWQgJiYgXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW0uX2lkKSA+IC0xKVxuXHRcdFx0aWYgIWlzRGlzYWJsZWQgfHwgaXRlbS5vd25lciA9PSB1c2VySWRcblx0XHRcdFx0bGlzdF92aWV3cy5wdXNoIGl0ZW1cblx0cmV0dXJuIGxpc3Rfdmlld3NcblxuIyDliY3lj7DnkIborrrkuIrkuI3lupTor6XosIPnlKjor6Xlh73mlbDvvIzlm6DkuLrlrZfmrrXnmoTmnYPpmZDpg73lnKhDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZmllbGRz55qE55u45YWz5bGe5oCn5Lit5pyJ5qCH6K+G5LqGXG5DcmVhdG9yLmdldEZpZWxkcyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRmaWVsZHNOYW1lID0gQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lKG9iamVjdF9uYW1lKVxuXHR1bnJlYWRhYmxlX2ZpZWxkcyA9ICBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy51bnJlYWRhYmxlX2ZpZWxkc1xuXHRyZXR1cm4gXy5kaWZmZXJlbmNlKGZpZWxkc05hbWUsIHVucmVhZGFibGVfZmllbGRzKVxuXG5DcmVhdG9yLmlzbG9hZGluZyA9ICgpLT5cblx0cmV0dXJuICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZC5nZXQoKVxuXG5DcmVhdG9yLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpXG5cbiMg6K6h566XZmllbGRz55u45YWz5Ye95pWwXG4jIFNUQVJUXG5DcmVhdG9yLmdldERpc2FibGVkRmllbGRzID0gKHNjaGVtYSktPlxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxuXHRcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0uZGlzYWJsZWQgYW5kICFmaWVsZC5hdXRvZm9ybS5vbWl0IGFuZCBmaWVsZE5hbWVcblx0KVxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxuXHRyZXR1cm4gZmllbGRzXG5cbkNyZWF0b3IuZ2V0SGlkZGVuRmllbGRzID0gKHNjaGVtYSktPlxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxuXHRcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0udHlwZSA9PSBcImhpZGRlblwiIGFuZCAhZmllbGQuYXV0b2Zvcm0ub21pdCBhbmQgZmllbGROYW1lXG5cdClcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcblx0cmV0dXJuIGZpZWxkc1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhOb0dyb3VwID0gKHNjaGVtYSktPlxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxuXHRcdHJldHVybiAoIWZpZWxkLmF1dG9mb3JtIG9yICFmaWVsZC5hdXRvZm9ybS5ncm91cCBvciBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PSBcIi1cIikgYW5kICghZmllbGQuYXV0b2Zvcm0gb3IgZmllbGQuYXV0b2Zvcm0udHlwZSAhPSBcImhpZGRlblwiKSBhbmQgZmllbGROYW1lXG5cdClcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcblx0cmV0dXJuIGZpZWxkc1xuXG5DcmVhdG9yLmdldFNvcnRlZEZpZWxkR3JvdXBOYW1lcyA9IChzY2hlbWEpLT5cblx0bmFtZXMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCkgLT5cbiBcdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS5ncm91cCAhPSBcIi1cIiBhbmQgZmllbGQuYXV0b2Zvcm0uZ3JvdXBcblx0KVxuXHRuYW1lcyA9IF8uY29tcGFjdChuYW1lcylcblx0bmFtZXMgPSBfLnVuaXF1ZShuYW1lcylcblx0cmV0dXJuIG5hbWVzXG5cbkNyZWF0b3IuZ2V0RmllbGRzRm9yR3JvdXAgPSAoc2NoZW1hLCBncm91cE5hbWUpIC0+XG4gIFx0ZmllbGRzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQsIGZpZWxkTmFtZSkgLT5cbiAgICBcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT0gZ3JvdXBOYW1lIGFuZCBmaWVsZC5hdXRvZm9ybS50eXBlICE9IFwiaGlkZGVuXCIgYW5kIGZpZWxkTmFtZVxuICBcdClcbiAgXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxuICBcdHJldHVybiBmaWVsZHNcblxuQ3JlYXRvci5nZXRGaWVsZHNXaXRob3V0T21pdCA9IChzY2hlbWEsIGtleXMpIC0+XG5cdGtleXMgPSBfLm1hcChrZXlzLCAoa2V5KSAtPlxuXHRcdGZpZWxkID0gXy5waWNrKHNjaGVtYSwga2V5KVxuXHRcdGlmIGZpZWxkW2tleV0uYXV0b2Zvcm0/Lm9taXRcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBrZXlcblx0KVxuXHRrZXlzID0gXy5jb21wYWN0KGtleXMpXG5cdHJldHVybiBrZXlzXG5cbkNyZWF0b3IuZ2V0RmllbGRzSW5GaXJzdExldmVsID0gKGZpcnN0TGV2ZWxLZXlzLCBrZXlzKSAtPlxuXHRrZXlzID0gXy5tYXAoa2V5cywgKGtleSkgLT5cblx0XHRpZiBfLmluZGV4T2YoZmlyc3RMZXZlbEtleXMsIGtleSkgPiAtMVxuXHRcdFx0cmV0dXJuIGtleVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBmYWxzZVxuXHQpXG5cdGtleXMgPSBfLmNvbXBhY3Qoa2V5cylcblx0cmV0dXJuIGtleXNcblxuQ3JlYXRvci5nZXRGaWVsZHNGb3JSZW9yZGVyID0gKHNjaGVtYSwga2V5cywgaXNTaW5nbGUpIC0+XG5cdGZpZWxkcyA9IFtdXG5cdGkgPSAwXG5cdF9rZXlzID0gXy5maWx0ZXIoa2V5cywgKGtleSktPlxuXHRcdHJldHVybiAha2V5LmVuZHNXaXRoKCdfZW5kTGluZScpXG5cdCk7XG5cdHdoaWxlIGkgPCBfa2V5cy5sZW5ndGhcblx0XHRzY18xID0gXy5waWNrKHNjaGVtYSwgX2tleXNbaV0pXG5cdFx0c2NfMiA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2krMV0pXG5cblx0XHRpc193aWRlXzEgPSBmYWxzZVxuXHRcdGlzX3dpZGVfMiA9IGZhbHNlXG5cbiNcdFx0aXNfcmFuZ2VfMSA9IGZhbHNlXG4jXHRcdGlzX3JhbmdlXzIgPSBmYWxzZVxuXG5cdFx0Xy5lYWNoIHNjXzEsICh2YWx1ZSkgLT5cblx0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc193aWRlIHx8IHZhbHVlLmF1dG9mb3JtPy50eXBlID09IFwidGFibGVcIlxuXHRcdFx0XHRpc193aWRlXzEgPSB0cnVlXG5cbiNcdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfcmFuZ2VcbiNcdFx0XHRcdGlzX3JhbmdlXzEgPSB0cnVlXG5cblx0XHRfLmVhY2ggc2NfMiwgKHZhbHVlKSAtPlxuXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3dpZGUgfHwgdmFsdWUuYXV0b2Zvcm0/LnR5cGUgPT0gXCJ0YWJsZVwiXG5cdFx0XHRcdGlzX3dpZGVfMiA9IHRydWVcblxuI1x0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc19yYW5nZVxuI1x0XHRcdFx0aXNfcmFuZ2VfMiA9IHRydWVcblxuXHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0aXNfd2lkZV8xID0gdHJ1ZVxuXHRcdFx0aXNfd2lkZV8yID0gdHJ1ZVxuXG5cdFx0aWYgaXNTaW5nbGVcblx0XHRcdGZpZWxkcy5wdXNoIF9rZXlzLnNsaWNlKGksIGkrMSlcblx0XHRcdGkgKz0gMVxuXHRcdGVsc2VcbiNcdFx0XHRpZiAhaXNfcmFuZ2VfMSAmJiBpc19yYW5nZV8yXG4jXHRcdFx0XHRjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpKzEpXG4jXHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcbiNcdFx0XHRcdGZpZWxkcy5wdXNoIGNoaWxkS2V5c1xuI1x0XHRcdFx0aSArPSAxXG4jXHRcdFx0ZWxzZVxuXHRcdFx0aWYgaXNfd2lkZV8xXG5cdFx0XHRcdGZpZWxkcy5wdXNoIF9rZXlzLnNsaWNlKGksIGkrMSlcblx0XHRcdFx0aSArPSAxXG5cdFx0XHRlbHNlIGlmICFpc193aWRlXzEgYW5kIGlzX3dpZGVfMlxuXHRcdFx0XHRjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpKzEpXG5cdFx0XHRcdGNoaWxkS2V5cy5wdXNoIHVuZGVmaW5lZFxuXHRcdFx0XHRmaWVsZHMucHVzaCBjaGlsZEtleXNcblx0XHRcdFx0aSArPSAxXG5cdFx0XHRlbHNlIGlmICFpc193aWRlXzEgYW5kICFpc193aWRlXzJcblx0XHRcdFx0Y2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSsxKVxuXHRcdFx0XHRpZiBfa2V5c1tpKzFdXG5cdFx0XHRcdFx0Y2hpbGRLZXlzLnB1c2ggX2tleXNbaSsxXVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0Y2hpbGRLZXlzLnB1c2ggdW5kZWZpbmVkXG5cdFx0XHRcdGZpZWxkcy5wdXNoIGNoaWxkS2V5c1xuXHRcdFx0XHRpICs9IDJcblxuXHRyZXR1cm4gZmllbGRzXG5cbkNyZWF0b3IuaXNGaWx0ZXJWYWx1ZUVtcHR5ID0gKHYpIC0+XG5cdHJldHVybiB0eXBlb2YgdiA9PSBcInVuZGVmaW5lZFwiIHx8IHYgPT0gbnVsbCB8fCBOdW1iZXIuaXNOYU4odikgfHwgdi5sZW5ndGggPT0gMFxuXG5DcmVhdG9yLmdldEZpZWxkRGF0YVR5cGUgPSAob2JqZWN0RmllbGRzLCBrZXkpLT5cblx0aWYgb2JqZWN0RmllbGRzIGFuZCBrZXlcblx0XHRyZXN1bHQgPSBvYmplY3RGaWVsZHNba2V5XT8udHlwZVxuXHRcdGlmIFtcImZvcm11bGFcIiwgXCJzdW1tYXJ5XCJdLmluZGV4T2YocmVzdWx0KSA+IC0xXG5cdFx0XHRyZXN1bHQgPSBvYmplY3RGaWVsZHNba2V5XS5kYXRhX3R5cGVcblx0XHQjIGVsc2UgaWYgcmVzdWx0ID09IFwic2VsZWN0XCIgYW5kIG9iamVjdEZpZWxkc1trZXldPy5kYXRhX3R5cGUgYW5kIG9iamVjdEZpZWxkc1trZXldLmRhdGFfdHlwZSAhPSBcInRleHRcIlxuXHRcdCMgXHRyZXN1bHQgPSBvYmplY3RGaWVsZHNba2V5XS5kYXRhX3R5cGVcblx0XHRyZXR1cm4gcmVzdWx0XG5cdGVsc2Vcblx0XHRyZXR1cm4gXCJ0ZXh0XCJcblxuIyBFTkRcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdENyZWF0b3IuZ2V0QWxsUmVsYXRlZE9iamVjdHMgPSAob2JqZWN0X25hbWUpLT5cblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdXG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XG5cdFx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3QuZmllbGRzLCAocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKS0+XG5cdFx0XHRcdGlmIHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lXG5cdFx0XHRcdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMucHVzaCByZWxhdGVkX29iamVjdF9uYW1lXG5cblx0XHRpZiBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZW5hYmxlX2ZpbGVzXG5cdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoIFwiY21zX2ZpbGVzXCJcblxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lc1xuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0U3RlZWRvcy5mb3JtYXRJbmRleCA9IChhcnJheSkgLT5cblx0XHRvYmplY3QgPSB7XG4gICAgICAgIFx0YmFja2dyb3VuZDogdHJ1ZVxuICAgIFx0fTtcblx0XHRpc2RvY3VtZW50REIgPSBNZXRlb3Iuc2V0dGluZ3M/LmRhdGFzb3VyY2VzPy5kZWZhdWx0Py5kb2N1bWVudERCIHx8IGZhbHNlO1xuXHRcdGlmIGlzZG9jdW1lbnREQlxuXHRcdFx0aWYgYXJyYXkubGVuZ3RoID4gMFxuXHRcdFx0XHRpbmRleE5hbWUgPSBhcnJheS5qb2luKFwiLlwiKTtcblx0XHRcdFx0b2JqZWN0Lm5hbWUgPSBpbmRleE5hbWU7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoaW5kZXhOYW1lLmxlbmd0aCA+IDUyKVxuXHRcdFx0XHRcdG9iamVjdC5uYW1lID0gaW5kZXhOYW1lLnN1YnN0cmluZygwLDUyKTtcblxuXHRcdHJldHVybiBvYmplY3Q7IiwiQ3JlYXRvci5nZXRTY2hlbWEgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5zY2hlbWEgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcmV0dXJuIEJ1aWxkZXJDcmVhdG9yLnBsdWdpbkNvbXBvbmVudFNlbGVjdG9yKEJ1aWxkZXJDcmVhdG9yLnN0b3JlLmdldFN0YXRlKCksIFwiT2JqZWN0SG9tZVwiLCBvYmplY3RfbmFtZSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSB7XG4gIHZhciBsaXN0X3ZpZXcsIGxpc3Rfdmlld19pZDtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpO1xuICBsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5faWQgOiB2b2lkIDA7XG4gIGlmIChyZWNvcmRfaWQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZCk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBcIm1lZXRpbmdcIikge1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKENyZWF0b3IuZ2V0T2JqZWN0SG9tZUNvbXBvbmVudChvYmplY3RfbmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobGlzdF92aWV3X2lkKSB7XG4gICAgICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEFic29sdXRlVXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSB7XG4gIHZhciBsaXN0X3ZpZXcsIGxpc3Rfdmlld19pZDtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpO1xuICBsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5faWQgOiB2b2lkIDA7XG4gIGlmIChyZWNvcmRfaWQpIHtcbiAgICByZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZCwgdHJ1ZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBcIm1lZXRpbmdcIikge1xuICAgICAgcmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQsIHRydWUpO1xuICAgIH1cbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSb3V0ZXJVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIHtcbiAgdmFyIGxpc3RfdmlldywgbGlzdF92aWV3X2lkO1xuICBpZiAoIWFwcF9pZCkge1xuICAgIGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICB9XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgbGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbCk7XG4gIGxpc3Rfdmlld19pZCA9IGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Ll9pZCA6IHZvaWQgMDtcbiAgaWYgKHJlY29yZF9pZCkge1xuICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZDtcbiAgfSBlbHNlIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwibWVldGluZ1wiKSB7XG4gICAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQ7XG4gICAgfVxuICB9XG59O1xuXG5DcmVhdG9yLmdldExpc3RWaWV3VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSB7XG4gIHZhciB1cmw7XG4gIHVybCA9IENyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpO1xuICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCh1cmwpO1xufTtcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSB7XG4gIGlmIChsaXN0X3ZpZXdfaWQgPT09IFwiY2FsZW5kYXJcIikge1xuICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFN3aXRjaExpc3RVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIHtcbiAgaWYgKGxpc3Rfdmlld19pZCkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIGxpc3Rfdmlld19pZCArIFwiL2xpc3RcIik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2xpc3Qvc3dpdGNoXCIpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYXBwX2lkLCByZWNvcmRfaWQsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICBpZiAocmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgcmVjb3JkX2lkICsgXCIvXCIgKyByZWxhdGVkX29iamVjdF9uYW1lICsgXCIvZ3JpZD9yZWxhdGVkX2ZpZWxkX25hbWU9XCIgKyByZWxhdGVkX2ZpZWxkX25hbWUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIHJlY29yZF9pZCArIFwiL1wiICsgcmVsYXRlZF9vYmplY3RfbmFtZSArIFwiL2dyaWRcIik7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0TG9va3VwRmllbGRPcHRpb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGlzX2RlZXAsIGlzX3NraXBfaGlkZSwgaXNfcmVsYXRlZCkge1xuICB2YXIgX29iamVjdCwgX29wdGlvbnMsIGZpZWxkcywgaWNvbiwgcmVsYXRlZE9iamVjdHM7XG4gIF9vcHRpb25zID0gW107XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gX29wdGlvbnM7XG4gIH1cbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIGljb24gPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDA7XG4gIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICBpZiAoaXNfc2tpcF9oaWRlICYmIGYuaGlkZGVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChmLnR5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgbGFiZWw6IFwiXCIgKyAoZi5sYWJlbCB8fCBrKSxcbiAgICAgICAgdmFsdWU6IFwiXCIgKyBrLFxuICAgICAgICBpY29uOiBpY29uXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICBsYWJlbDogZi5sYWJlbCB8fCBrLFxuICAgICAgICB2YWx1ZTogayxcbiAgICAgICAgaWNvbjogaWNvblxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgaWYgKGlzX2RlZXApIHtcbiAgICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgICB2YXIgcl9vYmplY3Q7XG4gICAgICBpZiAoaXNfc2tpcF9oaWRlICYmIGYuaGlkZGVuKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICgoZi50eXBlID09PSBcImxvb2t1cFwiIHx8IGYudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpICYmIGYucmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcoZi5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIHJfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoZi5yZWZlcmVuY2VfdG8pO1xuICAgICAgICBpZiAocl9vYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZjIsIGsyKSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiAoZi5sYWJlbCB8fCBrKSArIFwiPT5cIiArIChmMi5sYWJlbCB8fCBrMiksXG4gICAgICAgICAgICAgIHZhbHVlOiBrICsgXCIuXCIgKyBrMixcbiAgICAgICAgICAgICAgaWNvbjogcl9vYmplY3QgIT0gbnVsbCA/IHJfb2JqZWN0Lmljb24gOiB2b2lkIDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaWYgKGlzX3JlbGF0ZWQpIHtcbiAgICByZWxhdGVkT2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpO1xuICAgIF8uZWFjaChyZWxhdGVkT2JqZWN0cywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oX3JlbGF0ZWRPYmplY3QpIHtcbiAgICAgICAgdmFyIHJlbGF0ZWRPYmplY3QsIHJlbGF0ZWRPcHRpb25zO1xuICAgICAgICByZWxhdGVkT3B0aW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0TG9va3VwRmllbGRPcHRpb25zKF9yZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcmVsYXRlZE9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9yZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lKTtcbiAgICAgICAgcmV0dXJuIF8uZWFjaChyZWxhdGVkT3B0aW9ucywgZnVuY3Rpb24ocmVsYXRlZE9wdGlvbikge1xuICAgICAgICAgIGlmIChfcmVsYXRlZE9iamVjdC5mb3JlaWduX2tleSAhPT0gcmVsYXRlZE9wdGlvbi52YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgICBsYWJlbDogKHJlbGF0ZWRPYmplY3QubGFiZWwgfHwgcmVsYXRlZE9iamVjdC5uYW1lKSArIFwiPT5cIiArIHJlbGF0ZWRPcHRpb24ubGFiZWwsXG4gICAgICAgICAgICAgIHZhbHVlOiByZWxhdGVkT2JqZWN0Lm5hbWUgKyBcIi5cIiArIHJlbGF0ZWRPcHRpb24udmFsdWUsXG4gICAgICAgICAgICAgIGljb246IHJlbGF0ZWRPYmplY3QgIT0gbnVsbCA/IHJlbGF0ZWRPYmplY3QuaWNvbiA6IHZvaWQgMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9XG4gIHJldHVybiBfb3B0aW9ucztcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmlsdGVyRmllbGRPcHRpb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIF9vYmplY3QsIF9vcHRpb25zLCBmaWVsZHMsIGljb24sIHBlcm1pc3Npb25fZmllbGRzO1xuICBfb3B0aW9ucyA9IFtdO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIF9vcHRpb25zO1xuICB9XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZmllbGRzIDogdm9pZCAwO1xuICBwZXJtaXNzaW9uX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKG9iamVjdF9uYW1lKTtcbiAgaWNvbiA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMDtcbiAgXy5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZiwgaykge1xuICAgIGlmICghXy5pbmNsdWRlKFtcImdyaWRcIiwgXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwiYXZhdGFyXCIsIFwiaW1hZ2VcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSkgJiYgIWYuaGlkZGVuKSB7XG4gICAgICBpZiAoIS9cXHcrXFwuLy50ZXN0KGspICYmIF8uaW5kZXhPZihwZXJtaXNzaW9uX2ZpZWxkcywgaykgPiAtMSkge1xuICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgbGFiZWw6IGYubGFiZWwgfHwgayxcbiAgICAgICAgICB2YWx1ZTogayxcbiAgICAgICAgICBpY29uOiBpY29uXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBfb3B0aW9ucztcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRPcHRpb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIF9vYmplY3QsIF9vcHRpb25zLCBmaWVsZHMsIGljb24sIHBlcm1pc3Npb25fZmllbGRzO1xuICBfb3B0aW9ucyA9IFtdO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIF9vcHRpb25zO1xuICB9XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZmllbGRzIDogdm9pZCAwO1xuICBwZXJtaXNzaW9uX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKG9iamVjdF9uYW1lKTtcbiAgaWNvbiA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMDtcbiAgXy5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZiwgaykge1xuICAgIGlmICghXy5pbmNsdWRlKFtcImdyaWRcIiwgXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwibWFya2Rvd25cIiwgXCJodG1sXCJdLCBmLnR5cGUpKSB7XG4gICAgICBpZiAoIS9cXHcrXFwuLy50ZXN0KGspICYmIF8uaW5kZXhPZihwZXJtaXNzaW9uX2ZpZWxkcywgaykgPiAtMSkge1xuICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgbGFiZWw6IGYubGFiZWwgfHwgayxcbiAgICAgICAgICB2YWx1ZTogayxcbiAgICAgICAgICBpY29uOiBpY29uXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBfb3B0aW9ucztcbn07XG5cblxuLypcbmZpbHRlcnM6IOimgei9rOaNoueahGZpbHRlcnNcbmZpZWxkczog5a+56LGh5a2X5q61XG5maWx0ZXJfZmllbGRzOiDpu5jorqTov4fmu6TlrZfmrrXvvIzmlK/mjIHlrZfnrKbkuLLmlbDnu4Tlkozlr7nosaHmlbDnu4TkuKTnp43moLzlvI/vvIzlpoI6WydmaWxlZF9uYW1lMScsJ2ZpbGVkX25hbWUyJ10sW3tmaWVsZDonZmlsZWRfbmFtZTEnLHJlcXVpcmVkOnRydWV9XVxu5aSE55CG6YC76L6ROiDmiopmaWx0ZXJz5Lit5a2Y5Zyo5LqOZmlsdGVyX2ZpZWxkc+eahOi/h+a7pOadoeS7tuWinuWKoOavj+mhueeahGlzX2RlZmF1bHTjgIFpc19yZXF1aXJlZOWxnuaAp++8jOS4jeWtmOWcqOS6jmZpbHRlcl9maWVsZHPnmoTov4fmu6TmnaHku7blr7nlupTnmoTnp7vpmaTmr4/pobnnmoTnm7jlhbPlsZ7mgKdcbui/lOWbnue7k+aenDog5aSE55CG5ZCO55qEZmlsdGVyc1xuICovXG5cbkNyZWF0b3IuZ2V0RmlsdGVyc1dpdGhGaWx0ZXJGaWVsZHMgPSBmdW5jdGlvbihmaWx0ZXJzLCBmaWVsZHMsIGZpbHRlcl9maWVsZHMpIHtcbiAgaWYgKCFmaWx0ZXJzKSB7XG4gICAgZmlsdGVycyA9IFtdO1xuICB9XG4gIGlmICghZmlsdGVyX2ZpZWxkcykge1xuICAgIGZpbHRlcl9maWVsZHMgPSBbXTtcbiAgfVxuICBpZiAoZmlsdGVyX2ZpZWxkcyAhPSBudWxsID8gZmlsdGVyX2ZpZWxkcy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICBmaWx0ZXJfZmllbGRzLmZvckVhY2goZnVuY3Rpb24obikge1xuICAgICAgaWYgKF8uaXNTdHJpbmcobikpIHtcbiAgICAgICAgbiA9IHtcbiAgICAgICAgICBmaWVsZDogbixcbiAgICAgICAgICByZXF1aXJlZDogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWVsZHNbbi5maWVsZF0gJiYgIV8uZmluZFdoZXJlKGZpbHRlcnMsIHtcbiAgICAgICAgZmllbGQ6IG4uZmllbGRcbiAgICAgIH0pKSB7XG4gICAgICAgIHJldHVybiBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgIGZpZWxkOiBuLmZpZWxkLFxuICAgICAgICAgIGlzX2RlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgaXNfcmVxdWlyZWQ6IG4ucmVxdWlyZWRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgZmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uKGZpbHRlckl0ZW0pIHtcbiAgICB2YXIgbWF0Y2hGaWVsZDtcbiAgICBtYXRjaEZpZWxkID0gZmlsdGVyX2ZpZWxkcy5maW5kKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuID09PSBmaWx0ZXJJdGVtLmZpZWxkIHx8IG4uZmllbGQgPT09IGZpbHRlckl0ZW0uZmllbGQ7XG4gICAgfSk7XG4gICAgaWYgKF8uaXNTdHJpbmcobWF0Y2hGaWVsZCkpIHtcbiAgICAgIG1hdGNoRmllbGQgPSB7XG4gICAgICAgIGZpZWxkOiBtYXRjaEZpZWxkLFxuICAgICAgICByZXF1aXJlZDogZmFsc2VcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChtYXRjaEZpZWxkKSB7XG4gICAgICBmaWx0ZXJJdGVtLmlzX2RlZmF1bHQgPSB0cnVlO1xuICAgICAgcmV0dXJuIGZpbHRlckl0ZW0uaXNfcmVxdWlyZWQgPSBtYXRjaEZpZWxkLnJlcXVpcmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgZmlsdGVySXRlbS5pc19kZWZhdWx0O1xuICAgICAgcmV0dXJuIGRlbGV0ZSBmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmaWx0ZXJzO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpIHtcbiAgdmFyIGNvbGxlY3Rpb24sIG9iaiwgcmVjb3JkLCByZWYsIHJlZjEsIHJlZjI7XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKCFyZWNvcmRfaWQpIHtcbiAgICByZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpICYmIHJlY29yZF9pZCA9PT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikpIHtcbiAgICAgIGlmICgocmVmID0gVGVtcGxhdGUuaW5zdGFuY2UoKSkgIT0gbnVsbCA/IHJlZi5yZWNvcmQgOiB2b2lkIDApIHtcbiAgICAgICAgcmV0dXJuIChyZWYxID0gVGVtcGxhdGUuaW5zdGFuY2UoKSkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5yZWNvcmQpICE9IG51bGwgPyByZWYyLmdldCgpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKTtcbiAgICB9XG4gIH1cbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAob2JqLmRhdGFiYXNlX25hbWUgPT09IFwibWV0ZW9yXCIgfHwgIW9iai5kYXRhYmFzZV9uYW1lKSB7XG4gICAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSk7XG4gICAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJlY29yZCA9IGNvbGxlY3Rpb24uZmluZE9uZShyZWNvcmRfaWQpO1xuICAgICAgcmV0dXJuIHJlY29yZDtcbiAgICB9XG4gIH0gZWxzZSBpZiAob2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgcmV0dXJuIENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZCk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkTmFtZSA9IGZ1bmN0aW9uKHJlY29yZCwgb2JqZWN0X25hbWUpIHtcbiAgdmFyIG5hbWVfZmllbGRfa2V5LCByZWY7XG4gIGlmICghcmVjb3JkKSB7XG4gICAgcmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQoKTtcbiAgfVxuICBpZiAocmVjb3JkKSB7XG4gICAgbmFtZV9maWVsZF9rZXkgPSBvYmplY3RfbmFtZSA9PT0gXCJvcmdhbml6YXRpb25zXCIgPyBcIm5hbWVcIiA6IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuTkFNRV9GSUVMRF9LRVkgOiB2b2lkIDA7XG4gICAgaWYgKHJlY29yZCAmJiBuYW1lX2ZpZWxkX2tleSkge1xuICAgICAgcmV0dXJuIHJlY29yZC5sYWJlbCB8fCByZWNvcmRbbmFtZV9maWVsZF9rZXldO1xuICAgIH1cbiAgfVxufTtcblxuQ3JlYXRvci5nZXRBcHAgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgdmFyIGFwcCwgcmVmLCByZWYxO1xuICBpZiAoIWFwcF9pZCkge1xuICAgIGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICB9XG4gIGFwcCA9IENyZWF0b3IuQXBwc1thcHBfaWRdO1xuICBpZiAoKHJlZiA9IENyZWF0b3IuZGVwcykgIT0gbnVsbCkge1xuICAgIGlmICgocmVmMSA9IHJlZi5hcHApICE9IG51bGwpIHtcbiAgICAgIHJlZjEuZGVwZW5kKCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcHA7XG59O1xuXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwLCBkYXNoYm9hcmQ7XG4gIGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZCk7XG4gIGlmICghYXBwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGRhc2hib2FyZCA9IG51bGw7XG4gIF8uZWFjaChDcmVhdG9yLkRhc2hib2FyZHMsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICB2YXIgcmVmO1xuICAgIGlmICgoKHJlZiA9IHYuYXBwcykgIT0gbnVsbCA/IHJlZi5pbmRleE9mKGFwcC5faWQpIDogdm9pZCAwKSA+IC0xKSB7XG4gICAgICByZXR1cm4gZGFzaGJvYXJkID0gdjtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZGFzaGJvYXJkO1xufTtcblxuQ3JlYXRvci5nZXRBcHBEYXNoYm9hcmRDb21wb25lbnQgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgdmFyIGFwcDtcbiAgYXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKTtcbiAgaWYgKCFhcHApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmV0dXJuIEJ1aWxkZXJDcmVhdG9yLnBsdWdpbkNvbXBvbmVudFNlbGVjdG9yKEJ1aWxkZXJDcmVhdG9yLnN0b3JlLmdldFN0YXRlKCksIFwiRGFzaGJvYXJkXCIsIGFwcC5faWQpO1xufTtcblxuQ3JlYXRvci5nZXRBcHBPYmplY3ROYW1lcyA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwLCBhcHBPYmplY3RzLCBpc01vYmlsZSwgb2JqZWN0cztcbiAgYXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKTtcbiAgaWYgKCFhcHApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKCk7XG4gIGFwcE9iamVjdHMgPSBpc01vYmlsZSA/IGFwcC5tb2JpbGVfb2JqZWN0cyA6IGFwcC5vYmplY3RzO1xuICBvYmplY3RzID0gW107XG4gIGlmIChhcHApIHtcbiAgICBfLmVhY2goYXBwT2JqZWN0cywgZnVuY3Rpb24odikge1xuICAgICAgdmFyIG9iajtcbiAgICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KHYpO1xuICAgICAgaWYgKG9iaiAhPSBudWxsID8gb2JqLnBlcm1pc3Npb25zLmdldCgpLmFsbG93UmVhZCA6IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0cy5wdXNoKHYpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3RzO1xufTtcblxuQ3JlYXRvci5nZXRBcHBNZW51ID0gZnVuY3Rpb24oYXBwX2lkLCBtZW51X2lkKSB7XG4gIHZhciBtZW51cztcbiAgbWVudXMgPSBDcmVhdG9yLmdldEFwcE1lbnVzKGFwcF9pZCk7XG4gIHJldHVybiBtZW51cyAmJiBtZW51cy5maW5kKGZ1bmN0aW9uKG1lbnUpIHtcbiAgICByZXR1cm4gbWVudS5pZCA9PT0gbWVudV9pZDtcbiAgfSk7XG59O1xuXG5DcmVhdG9yLmdldEFwcE1lbnVVcmxGb3JJbnRlcm5ldCA9IGZ1bmN0aW9uKG1lbnUpIHtcbiAgdmFyIGhhc1F1ZXJ5U3ltYm9sLCBsaW5rU3RyLCBwYXJhbXMsIHVybDtcbiAgcGFyYW1zID0ge307XG4gIHBhcmFtc1tcIlgtU3BhY2UtSWRcIl0gPSBTdGVlZG9zLnNwYWNlSWQoKTtcbiAgcGFyYW1zW1wiWC1Vc2VyLUlkXCJdID0gU3RlZWRvcy51c2VySWQoKTtcbiAgcGFyYW1zW1wiWC1Db21wYW55LUlkc1wiXSA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKTtcbiAgdXJsID0gbWVudS5wYXRoO1xuICB1cmwgPSBTdGVlZG9zLnBhcnNlU2luZ2xlRXhwcmVzc2lvbih1cmwsIG1lbnUsIFwiI1wiLCBDcmVhdG9yLlVTRVJfQ09OVEVYVCk7XG4gIGhhc1F1ZXJ5U3ltYm9sID0gLyhcXCMuK1xcPyl8KFxcP1teI10qJCkvZy50ZXN0KHVybCk7XG4gIGxpbmtTdHIgPSBoYXNRdWVyeVN5bWJvbCA/IFwiJlwiIDogXCI/XCI7XG4gIHJldHVybiBcIlwiICsgdXJsICsgbGlua1N0ciArICgkLnBhcmFtKHBhcmFtcykpO1xufTtcblxuQ3JlYXRvci5nZXRBcHBNZW51VXJsID0gZnVuY3Rpb24obWVudSkge1xuICB2YXIgdXJsO1xuICB1cmwgPSBtZW51LnBhdGg7XG4gIGlmIChtZW51LnR5cGUgPT09IFwidXJsXCIpIHtcbiAgICBpZiAobWVudS50YXJnZXQpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldEFwcE1lbnVVcmxGb3JJbnRlcm5ldChtZW51KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiL2FwcC8tL3RhYl9pZnJhbWUvXCIgKyBtZW51LmlkO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbWVudS5wYXRoO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEFwcE1lbnVzID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIGFwcE1lbnVzLCBjdXJlbnRBcHBNZW51cztcbiAgYXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKTtcbiAgaWYgKCFhcHApIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgYXBwTWVudXMgPSBTZXNzaW9uLmdldChcImFwcF9tZW51c1wiKTtcbiAgaWYgKCFhcHBNZW51cykge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBjdXJlbnRBcHBNZW51cyA9IGFwcE1lbnVzLmZpbmQoZnVuY3Rpb24obWVudUl0ZW0pIHtcbiAgICByZXR1cm4gbWVudUl0ZW0uaWQgPT09IGFwcC5faWQ7XG4gIH0pO1xuICBpZiAoY3VyZW50QXBwTWVudXMpIHtcbiAgICByZXR1cm4gY3VyZW50QXBwTWVudXMuY2hpbGRyZW47XG4gIH1cbn07XG5cbkNyZWF0b3IubG9hZEFwcHNNZW51cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGF0YSwgaXNNb2JpbGUsIG9wdGlvbnM7XG4gIGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpO1xuICBkYXRhID0ge307XG4gIGlmIChpc01vYmlsZSkge1xuICAgIGRhdGEubW9iaWxlID0gaXNNb2JpbGU7XG4gIH1cbiAgb3B0aW9ucyA9IHtcbiAgICB0eXBlOiAnZ2V0JyxcbiAgICBkYXRhOiBkYXRhLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiBTZXNzaW9uLnNldChcImFwcF9tZW51c1wiLCBkYXRhKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBTdGVlZG9zLmF1dGhSZXF1ZXN0KFwiL3NlcnZpY2UvYXBpL2FwcHMvbWVudXNcIiwgb3B0aW9ucyk7XG59O1xuXG5DcmVhdG9yLmdldFZpc2libGVBcHBzID0gZnVuY3Rpb24oaW5jbHVkZUFkbWluKSB7XG4gIHZhciBjaGFuZ2VBcHA7XG4gIGNoYW5nZUFwcCA9IENyZWF0b3IuX3N1YkFwcC5nZXQoKTtcbiAgQnVpbGRlckNyZWF0b3Iuc3RvcmUuZ2V0U3RhdGUoKS5lbnRpdGllcy5hcHBzID0gT2JqZWN0LmFzc2lnbih7fSwgQnVpbGRlckNyZWF0b3Iuc3RvcmUuZ2V0U3RhdGUoKS5lbnRpdGllcy5hcHBzLCB7XG4gICAgYXBwczogY2hhbmdlQXBwXG4gIH0pO1xuICByZXR1cm4gQnVpbGRlckNyZWF0b3IudmlzaWJsZUFwcHNTZWxlY3RvcihCdWlsZGVyQ3JlYXRvci5zdG9yZS5nZXRTdGF0ZSgpLCBpbmNsdWRlQWRtaW4pO1xufTtcblxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwc09iamVjdHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGFwcHMsIG9iamVjdHMsIHZpc2libGVPYmplY3ROYW1lcztcbiAgYXBwcyA9IENyZWF0b3IuZ2V0VmlzaWJsZUFwcHMoKTtcbiAgdmlzaWJsZU9iamVjdE5hbWVzID0gXy5mbGF0dGVuKF8ucGx1Y2soYXBwcywgJ29iamVjdHMnKSk7XG4gIG9iamVjdHMgPSBfLmZpbHRlcihDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICh2aXNpYmxlT2JqZWN0TmFtZXMuaW5kZXhPZihvYmoubmFtZSkgPCAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIG9iamVjdHMgPSBvYmplY3RzLnNvcnQoQ3JlYXRvci5zb3J0aW5nTWV0aG9kLmJpbmQoe1xuICAgIGtleTogXCJsYWJlbFwiXG4gIH0pKTtcbiAgb2JqZWN0cyA9IF8ucGx1Y2sob2JqZWN0cywgJ25hbWUnKTtcbiAgcmV0dXJuIF8udW5pcShvYmplY3RzKTtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwc09iamVjdHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG9iamVjdHMsIHRlbXBPYmplY3RzO1xuICBvYmplY3RzID0gW107XG4gIHRlbXBPYmplY3RzID0gW107XG4gIF8uZm9yRWFjaChDcmVhdG9yLkFwcHMsIGZ1bmN0aW9uKGFwcCkge1xuICAgIHRlbXBPYmplY3RzID0gXy5maWx0ZXIoYXBwLm9iamVjdHMsIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuICFvYmouaGlkZGVuO1xuICAgIH0pO1xuICAgIHJldHVybiBvYmplY3RzID0gb2JqZWN0cy5jb25jYXQodGVtcE9iamVjdHMpO1xuICB9KTtcbiAgcmV0dXJuIF8udW5pcShvYmplY3RzKTtcbn07XG5cbkNyZWF0b3IudmFsaWRhdGVGaWx0ZXJzID0gZnVuY3Rpb24oZmlsdGVycywgbG9naWMpIHtcbiAgdmFyIGUsIGVycm9yTXNnLCBmaWx0ZXJfaXRlbXMsIGZpbHRlcl9sZW5ndGgsIGZsYWcsIGluZGV4LCB3b3JkO1xuICBmaWx0ZXJfaXRlbXMgPSBfLm1hcChmaWx0ZXJzLCBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoXy5pc0VtcHR5KG9iaikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gIH0pO1xuICBmaWx0ZXJfaXRlbXMgPSBfLmNvbXBhY3QoZmlsdGVyX2l0ZW1zKTtcbiAgZXJyb3JNc2cgPSBcIlwiO1xuICBmaWx0ZXJfbGVuZ3RoID0gZmlsdGVyX2l0ZW1zLmxlbmd0aDtcbiAgaWYgKGxvZ2ljKSB7XG4gICAgbG9naWMgPSBsb2dpYy5yZXBsYWNlKC9cXG4vZywgXCJcIikucmVwbGFjZSgvXFxzKy9nLCBcIiBcIik7XG4gICAgaWYgKC9bLl9cXC0hK10rL2lnLnRlc3QobG9naWMpKSB7XG4gICAgICBlcnJvck1zZyA9IFwi5ZCr5pyJ54m55q6K5a2X56ym44CCXCI7XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIGluZGV4ID0gbG9naWMubWF0Y2goL1xcZCsvaWcpO1xuICAgICAgaWYgKCFpbmRleCkge1xuICAgICAgICBlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleC5mb3JFYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICBpZiAoaSA8IDEgfHwgaSA+IGZpbHRlcl9sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5p2h5Lu25byV55So5LqG5pyq5a6a5LmJ55qE562b6YCJ5Zmo77yaXCIgKyBpICsgXCLjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmbGFnID0gMTtcbiAgICAgICAgd2hpbGUgKGZsYWcgPD0gZmlsdGVyX2xlbmd0aCkge1xuICAgICAgICAgIGlmICghaW5kZXguaW5jbHVkZXMoXCJcIiArIGZsYWcpKSB7XG4gICAgICAgICAgICBlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZsYWcrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWVycm9yTXNnKSB7XG4gICAgICB3b3JkID0gbG9naWMubWF0Y2goL1thLXpBLVpdKy9pZyk7XG4gICAgICBpZiAod29yZCkge1xuICAgICAgICB3b3JkLmZvckVhY2goZnVuY3Rpb24odykge1xuICAgICAgICAgIGlmICghL14oYW5kfG9yKSQvaWcudGVzdCh3KSkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yTXNnID0gXCLmo4Dmn6XmgqjnmoTpq5jnuqfnrZvpgInmnaHku7bkuK3nmoTmi7zlhpnjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWVycm9yTXNnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBDcmVhdG9yW1wiZXZhbFwiXShsb2dpYy5yZXBsYWNlKC9hbmQvaWcsIFwiJiZcIikucmVwbGFjZSgvb3IvaWcsIFwifHxcIikpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5Lit5ZCr5pyJ54m55q6K5a2X56ymXCI7XG4gICAgICB9XG4gICAgICBpZiAoLyhBTkQpW14oKV0rKE9SKS9pZy50ZXN0KGxvZ2ljKSB8fCAvKE9SKVteKCldKyhBTkQpL2lnLnRlc3QobG9naWMpKSB7XG4gICAgICAgIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajlv4XpobvlnKjov57nu63mgKfnmoQgQU5EIOWSjCBPUiDooajovr7lvI/liY3lkI7kvb/nlKjmi6zlj7fjgIJcIjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKGVycm9yTXNnKSB7XG4gICAgY29uc29sZS5sb2coXCJlcnJvclwiLCBlcnJvck1zZyk7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdG9hc3RyLmVycm9yKGVycm9yTXNnKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuICovXG5cbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvTW9uZ28gPSBmdW5jdGlvbihmaWx0ZXJzLCBvcHRpb25zKSB7XG4gIHZhciBzZWxlY3RvcjtcbiAgaWYgKCEoZmlsdGVycyAhPSBudWxsID8gZmlsdGVycy5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghKGZpbHRlcnNbMF0gaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICBmaWx0ZXJzID0gXy5tYXAoZmlsdGVycywgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gW29iai5maWVsZCwgb2JqLm9wZXJhdGlvbiwgb2JqLnZhbHVlXTtcbiAgICB9KTtcbiAgfVxuICBzZWxlY3RvciA9IFtdO1xuICBfLmVhY2goZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIGZpZWxkLCBvcHRpb24sIHJlZywgc3ViX3NlbGVjdG9yLCB2YWx1ZTtcbiAgICBmaWVsZCA9IGZpbHRlclswXTtcbiAgICBvcHRpb24gPSBmaWx0ZXJbMV07XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgbnVsbCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHN1Yl9zZWxlY3RvciA9IHt9O1xuICAgIHN1Yl9zZWxlY3RvcltmaWVsZF0gPSB7fTtcbiAgICBpZiAob3B0aW9uID09PSBcIj1cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRlcVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjw+XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbmVcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI+XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI+PVwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGd0ZVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjxcIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdFwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjw9XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRlXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwic3RhcnRzd2l0aFwiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKFwiXlwiICsgdmFsdWUsIFwiaVwiKTtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWc7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiY29udGFpbnNcIikge1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cCh2YWx1ZSwgXCJpXCIpO1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJub3Rjb250YWluc1wiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKFwiXigoPyFcIiArIHZhbHVlICsgXCIpLikqJFwiLCBcImlcIik7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnO1xuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3IucHVzaChzdWJfc2VsZWN0b3IpO1xuICB9KTtcbiAgcmV0dXJuIHNlbGVjdG9yO1xufTtcblxuQ3JlYXRvci5pc0JldHdlZW5GaWx0ZXJPcGVyYXRpb24gPSBmdW5jdGlvbihvcGVyYXRpb24pIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIG9wZXJhdGlvbiA9PT0gXCJiZXR3ZWVuXCIgfHwgISEoKHJlZiA9IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKHRydWUpKSAhPSBudWxsID8gcmVmW29wZXJhdGlvbl0gOiB2b2lkIDApO1xufTtcblxuXG4vKlxub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcblx0ZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuICovXG5cbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvRGV2ID0gZnVuY3Rpb24oZmlsdGVycywgb2JqZWN0X25hbWUsIG9wdGlvbnMpIHtcbiAgdmFyIGxvZ2ljVGVtcEZpbHRlcnMsIHNlbGVjdG9yLCBzdGVlZG9zRmlsdGVycztcbiAgc3RlZWRvc0ZpbHRlcnMgPSByZXF1aXJlKFwiQHN0ZWVkb3MvZmlsdGVyc1wiKTtcbiAgaWYgKCFmaWx0ZXJzLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5pc19sb2dpY19vciA6IHZvaWQgMCkge1xuICAgIGxvZ2ljVGVtcEZpbHRlcnMgPSBbXTtcbiAgICBmaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24obikge1xuICAgICAgbG9naWNUZW1wRmlsdGVycy5wdXNoKG4pO1xuICAgICAgcmV0dXJuIGxvZ2ljVGVtcEZpbHRlcnMucHVzaChcIm9yXCIpO1xuICAgIH0pO1xuICAgIGxvZ2ljVGVtcEZpbHRlcnMucG9wKCk7XG4gICAgZmlsdGVycyA9IGxvZ2ljVGVtcEZpbHRlcnM7XG4gIH1cbiAgc2VsZWN0b3IgPSBzdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9EZXYoZmlsdGVycywgQ3JlYXRvci5VU0VSX0NPTlRFWFQpO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuICovXG5cbkNyZWF0b3IuZm9ybWF0TG9naWNGaWx0ZXJzVG9EZXYgPSBmdW5jdGlvbihmaWx0ZXJzLCBmaWx0ZXJfbG9naWMsIG9wdGlvbnMpIHtcbiAgdmFyIGZvcm1hdF9sb2dpYztcbiAgZm9ybWF0X2xvZ2ljID0gZmlsdGVyX2xvZ2ljLnJlcGxhY2UoL1xcKFxccysvaWcsIFwiKFwiKS5yZXBsYWNlKC9cXHMrXFwpL2lnLCBcIilcIikucmVwbGFjZSgvXFwoL2csIFwiW1wiKS5yZXBsYWNlKC9cXCkvZywgXCJdXCIpLnJlcGxhY2UoL1xccysvZywgXCIsXCIpLnJlcGxhY2UoLyhhbmR8b3IpL2lnLCBcIickMSdcIik7XG4gIGZvcm1hdF9sb2dpYyA9IGZvcm1hdF9sb2dpYy5yZXBsYWNlKC8oXFxkKSsvaWcsIGZ1bmN0aW9uKHgpIHtcbiAgICB2YXIgX2YsIGZpZWxkLCBvcHRpb24sIHN1Yl9zZWxlY3RvciwgdmFsdWU7XG4gICAgX2YgPSBmaWx0ZXJzW3ggLSAxXTtcbiAgICBmaWVsZCA9IF9mLmZpZWxkO1xuICAgIG9wdGlvbiA9IF9mLm9wZXJhdGlvbjtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShfZi52YWx1ZSwgbnVsbCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHN1Yl9zZWxlY3RvciA9IFtdO1xuICAgIGlmIChfLmlzQXJyYXkodmFsdWUpID09PSB0cnVlKSB7XG4gICAgICBpZiAob3B0aW9uID09PSBcIj1cIikge1xuICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4gc3ViX3NlbGVjdG9yLnB1c2goW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjw+XCIpIHtcbiAgICAgICAgXy5lYWNoKHZhbHVlLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIHN1Yl9zZWxlY3Rvci5wdXNoKFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJhbmRcIik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgXy5lYWNoKHZhbHVlLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIHN1Yl9zZWxlY3Rvci5wdXNoKFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoc3ViX3NlbGVjdG9yW3N1Yl9zZWxlY3Rvci5sZW5ndGggLSAxXSA9PT0gXCJhbmRcIiB8fCBzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09PSBcIm9yXCIpIHtcbiAgICAgICAgc3ViX3NlbGVjdG9yLnBvcCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdWJfc2VsZWN0b3IgPSBbZmllbGQsIG9wdGlvbiwgdmFsdWVdO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcInN1Yl9zZWxlY3RvclwiLCBzdWJfc2VsZWN0b3IpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzdWJfc2VsZWN0b3IpO1xuICB9KTtcbiAgZm9ybWF0X2xvZ2ljID0gXCJbXCIgKyBmb3JtYXRfbG9naWMgKyBcIl1cIjtcbiAgcmV0dXJuIENyZWF0b3JbXCJldmFsXCJdKGZvcm1hdF9sb2dpYyk7XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgX29iamVjdCwgcGVybWlzc2lvbnMsIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCByZWxhdGVkX29iamVjdHMsIHVucmVsYXRlZF9vYmplY3RzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW107XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghX29iamVjdCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgfVxuICByZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKF9vYmplY3QuX2NvbGxlY3Rpb25fbmFtZSk7XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsIFwib2JqZWN0X25hbWVcIik7XG4gIGlmICgocmVsYXRlZF9vYmplY3RfbmFtZXMgIT0gbnVsbCA/IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmxlbmd0aCA6IHZvaWQgMCkgPT09IDApIHtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXM7XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICB1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzO1xuICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZShyZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHMpO1xuICByZXR1cm4gXy5maWx0ZXIocmVsYXRlZF9vYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCkge1xuICAgIHZhciBhbGxvd1JlYWQsIGlzQWN0aXZlLCByZWYsIHJlbGF0ZWRfb2JqZWN0X25hbWU7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0Lm9iamVjdF9uYW1lO1xuICAgIGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xO1xuICAgIGFsbG93UmVhZCA9IChyZWYgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYuYWxsb3dSZWFkIDogdm9pZCAwO1xuICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgICBhbGxvd1JlYWQgPSBhbGxvd1JlYWQgJiYgcGVybWlzc2lvbnMuYWxsb3dSZWFkRmlsZXM7XG4gICAgfVxuICAgIHJldHVybiBpc0FjdGl2ZSAmJiBhbGxvd1JlYWQ7XG4gIH0pO1xufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0TmFtZXMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciByZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIHJldHVybiBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cywgXCJvYmplY3RfbmFtZVwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdExpc3RBY3Rpb25zID0gZnVuY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgYWN0aW9ucztcbiAgYWN0aW9ucyA9IENyZWF0b3IuZ2V0QWN0aW9ucyhyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgYWN0aW9ucyA9IF8uZmlsdGVyKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIGlmIChhY3Rpb24ubmFtZSA9PT0gXCJzdGFuZGFyZF9mb2xsb3dcIikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoYWN0aW9uLm5hbWUgPT09IFwic3RhbmRhcmRfcXVlcnlcIikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoYWN0aW9uLm9uID09PSBcImxpc3RcIikge1xuICAgICAgaWYgKHR5cGVvZiBhY3Rpb24udmlzaWJsZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBhY3Rpb24udmlzaWJsZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi52aXNpYmxlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGFjdGlvbnM7XG59O1xuXG5DcmVhdG9yLmdldEFjdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBhY3Rpb25zLCBkaXNhYmxlZF9hY3Rpb25zLCBvYmosIHBlcm1pc3Npb25zLCByZWYsIHJlZjE7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIGRpc2FibGVkX2FjdGlvbnMgPSBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zO1xuICBhY3Rpb25zID0gXy5zb3J0QnkoXy52YWx1ZXMob2JqLmFjdGlvbnMpLCAnc29ydCcpO1xuICBpZiAoXy5oYXMob2JqLCAnYWxsb3dfY3VzdG9tQWN0aW9ucycpKSB7XG4gICAgYWN0aW9ucyA9IF8uZmlsdGVyKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgICAgcmV0dXJuIF8uaW5jbHVkZShvYmouYWxsb3dfY3VzdG9tQWN0aW9ucywgYWN0aW9uLm5hbWUpIHx8IF8uaW5jbHVkZShfLmtleXMoQ3JlYXRvci5nZXRPYmplY3QoJ2Jhc2UnKS5hY3Rpb25zKSB8fCB7fSwgYWN0aW9uLm5hbWUpO1xuICAgIH0pO1xuICB9XG4gIGlmIChfLmhhcyhvYmosICdleGNsdWRlX2FjdGlvbnMnKSkge1xuICAgIGFjdGlvbnMgPSBfLmZpbHRlcihhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICAgIHJldHVybiAhXy5pbmNsdWRlKG9iai5leGNsdWRlX2FjdGlvbnMsIGFjdGlvbi5uYW1lKTtcbiAgICB9KTtcbiAgfVxuICBfLmVhY2goYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJyZWNvcmRcIiwgXCJyZWNvcmRfb25seVwiXS5pbmRleE9mKGFjdGlvbi5vbikgPiAtMSAmJiBhY3Rpb24ubmFtZSAhPT0gJ3N0YW5kYXJkX2VkaXQnKSB7XG4gICAgICBpZiAoYWN0aW9uLm9uID09PSBcInJlY29yZF9vbmx5XCIpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi5vbiA9ICdyZWNvcmRfb25seV9tb3JlJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBhY3Rpb24ub24gPSAncmVjb3JkX21vcmUnO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgJiYgW1wiY21zX2ZpbGVzXCIsIFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIl0uaW5kZXhPZihvYmplY3RfbmFtZSkgPiAtMSkge1xuICAgIGlmICgocmVmID0gYWN0aW9ucy5maW5kKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLm5hbWUgPT09IFwic3RhbmRhcmRfZWRpdFwiO1xuICAgIH0pKSAhPSBudWxsKSB7XG4gICAgICByZWYub24gPSBcInJlY29yZF9tb3JlXCI7XG4gICAgfVxuICAgIGlmICgocmVmMSA9IGFjdGlvbnMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5uYW1lID09PSBcImRvd25sb2FkXCI7XG4gICAgfSkpICE9IG51bGwpIHtcbiAgICAgIHJlZjEub24gPSBcInJlY29yZFwiO1xuICAgIH1cbiAgfVxuICBhY3Rpb25zID0gXy5maWx0ZXIoYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgcmV0dXJuIF8uaW5kZXhPZihkaXNhYmxlZF9hY3Rpb25zLCBhY3Rpb24ubmFtZSkgPCAwO1xuICB9KTtcbiAgcmV0dXJuIGFjdGlvbnM7XG59O1xuXG4v6L+U5Zue5b2T5YmN55So5oi35pyJ5p2D6ZmQ6K6/6Zeu55qE5omA5pyJbGlzdF92aWV377yM5YyF5ous5YiG5Lqr55qE77yM55So5oi36Ieq5a6a5LmJ6Z2e5YiG5Lqr55qE77yI6Zmk6Z2eb3duZXLlj5jkuobvvInvvIzku6Xlj4rpu5jorqTnmoTlhbbku5bop4blm77ms6jmhI9DcmVhdG9yLmdldFBlcm1pc3Npb25z5Ye95pWw5Lit5piv5LiN5Lya5pyJ55So5oi36Ieq5a6a5LmJ6Z2e5YiG5Lqr55qE6KeG5Zu+55qE77yM5omA5LulQ3JlYXRvci5nZXRQZXJtaXNzaW9uc+WHveaVsOS4reaLv+WIsOeahOe7k+aenOS4jeWFqO+8jOW5tuS4jeaYr+W9k+WJjeeUqOaIt+iDveeci+WIsOaJgOacieinhuWbvi87XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgZGlzYWJsZWRfbGlzdF92aWV3cywgaXNNb2JpbGUsIGxpc3RWaWV3cywgbGlzdF92aWV3cywgb2JqZWN0LCByZWY7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGRpc2FibGVkX2xpc3Rfdmlld3MgPSAoKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYuZGlzYWJsZWRfbGlzdF92aWV3cyA6IHZvaWQgMCkgfHwgW107XG4gIGxpc3Rfdmlld3MgPSBbXTtcbiAgaXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKCk7XG4gIF8uZWFjaChvYmplY3QubGlzdF92aWV3cywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgcmV0dXJuIGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZTtcbiAgfSk7XG4gIGxpc3RWaWV3cyA9IF8uc29ydEJ5KF8udmFsdWVzKG9iamVjdC5saXN0X3ZpZXdzKSwgJ3NvcnRfbm8nKTtcbiAgXy5lYWNoKGxpc3RWaWV3cywgZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciBpc0Rpc2FibGVkO1xuICAgIGlmIChpc01vYmlsZSAmJiBpdGVtLnR5cGUgPT09IFwiY2FsZW5kYXJcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXRlbS5uYW1lICE9PSBcImRlZmF1bHRcIikge1xuICAgICAgaXNEaXNhYmxlZCA9IF8uaW5kZXhPZihkaXNhYmxlZF9saXN0X3ZpZXdzLCBpdGVtLm5hbWUpID4gLTEgfHwgKGl0ZW0uX2lkICYmIF8uaW5kZXhPZihkaXNhYmxlZF9saXN0X3ZpZXdzLCBpdGVtLl9pZCkgPiAtMSk7XG4gICAgICBpZiAoIWlzRGlzYWJsZWQgfHwgaXRlbS5vd25lciA9PT0gdXNlcklkKSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXdzLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGxpc3Rfdmlld3M7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGZpZWxkc05hbWUsIHJlZiwgdW5yZWFkYWJsZV9maWVsZHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgZmllbGRzTmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZShvYmplY3RfbmFtZSk7XG4gIHVucmVhZGFibGVfZmllbGRzID0gKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYudW5yZWFkYWJsZV9maWVsZHMgOiB2b2lkIDA7XG4gIHJldHVybiBfLmRpZmZlcmVuY2UoZmllbGRzTmFtZSwgdW5yZWFkYWJsZV9maWVsZHMpO1xufTtcblxuQ3JlYXRvci5pc2xvYWRpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZC5nZXQoKTtcbn07XG5cbkNyZWF0b3IuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0RGlzYWJsZWRGaWVsZHMgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLmRpc2FibGVkICYmICFmaWVsZC5hdXRvZm9ybS5vbWl0ICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRIaWRkZW5GaWVsZHMgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLnR5cGUgPT09IFwiaGlkZGVuXCIgJiYgIWZpZWxkLmF1dG9mb3JtLm9taXQgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhOb0dyb3VwID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBmaWVsZHM7XG4gIGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQsIGZpZWxkTmFtZSkge1xuICAgIHJldHVybiAoIWZpZWxkLmF1dG9mb3JtIHx8ICFmaWVsZC5hdXRvZm9ybS5ncm91cCB8fCBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PT0gXCItXCIpICYmICghZmllbGQuYXV0b2Zvcm0gfHwgZmllbGQuYXV0b2Zvcm0udHlwZSAhPT0gXCJoaWRkZW5cIikgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldFNvcnRlZEZpZWxkR3JvdXBOYW1lcyA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgbmFtZXM7XG4gIG5hbWVzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZC5hdXRvZm9ybSAmJiBmaWVsZC5hdXRvZm9ybS5ncm91cCAhPT0gXCItXCIgJiYgZmllbGQuYXV0b2Zvcm0uZ3JvdXA7XG4gIH0pO1xuICBuYW1lcyA9IF8uY29tcGFjdChuYW1lcyk7XG4gIG5hbWVzID0gXy51bmlxdWUobmFtZXMpO1xuICByZXR1cm4gbmFtZXM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc0Zvckdyb3VwID0gZnVuY3Rpb24oc2NoZW1hLCBncm91cE5hbWUpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLmdyb3VwID09PSBncm91cE5hbWUgJiYgZmllbGQuYXV0b2Zvcm0udHlwZSAhPT0gXCJoaWRkZW5cIiAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aG91dE9taXQgPSBmdW5jdGlvbihzY2hlbWEsIGtleXMpIHtcbiAga2V5cyA9IF8ubWFwKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBmaWVsZCwgcmVmO1xuICAgIGZpZWxkID0gXy5waWNrKHNjaGVtYSwga2V5KTtcbiAgICBpZiAoKHJlZiA9IGZpZWxkW2tleV0uYXV0b2Zvcm0pICE9IG51bGwgPyByZWYub21pdCA6IHZvaWQgMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cbiAgfSk7XG4gIGtleXMgPSBfLmNvbXBhY3Qoa2V5cyk7XG4gIHJldHVybiBrZXlzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNJbkZpcnN0TGV2ZWwgPSBmdW5jdGlvbihmaXJzdExldmVsS2V5cywga2V5cykge1xuICBrZXlzID0gXy5tYXAoa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKF8uaW5kZXhPZihmaXJzdExldmVsS2V5cywga2V5KSA+IC0xKSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcbiAga2V5cyA9IF8uY29tcGFjdChrZXlzKTtcbiAgcmV0dXJuIGtleXM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc0ZvclJlb3JkZXIgPSBmdW5jdGlvbihzY2hlbWEsIGtleXMsIGlzU2luZ2xlKSB7XG4gIHZhciBfa2V5cywgY2hpbGRLZXlzLCBmaWVsZHMsIGksIGlzX3dpZGVfMSwgaXNfd2lkZV8yLCBzY18xLCBzY18yO1xuICBmaWVsZHMgPSBbXTtcbiAgaSA9IDA7XG4gIF9rZXlzID0gXy5maWx0ZXIoa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuICFrZXkuZW5kc1dpdGgoJ19lbmRMaW5lJyk7XG4gIH0pO1xuICB3aGlsZSAoaSA8IF9rZXlzLmxlbmd0aCkge1xuICAgIHNjXzEgPSBfLnBpY2soc2NoZW1hLCBfa2V5c1tpXSk7XG4gICAgc2NfMiA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2kgKyAxXSk7XG4gICAgaXNfd2lkZV8xID0gZmFsc2U7XG4gICAgaXNfd2lkZV8yID0gZmFsc2U7XG4gICAgXy5lYWNoKHNjXzEsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCgocmVmID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYuaXNfd2lkZSA6IHZvaWQgMCkgfHwgKChyZWYxID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLnR5cGUgOiB2b2lkIDApID09PSBcInRhYmxlXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzX3dpZGVfMSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgXy5lYWNoKHNjXzIsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCgocmVmID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYuaXNfd2lkZSA6IHZvaWQgMCkgfHwgKChyZWYxID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLnR5cGUgOiB2b2lkIDApID09PSBcInRhYmxlXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzX3dpZGVfMiA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgaXNfd2lkZV8xID0gdHJ1ZTtcbiAgICAgIGlzX3dpZGVfMiA9IHRydWU7XG4gICAgfVxuICAgIGlmIChpc1NpbmdsZSkge1xuICAgICAgZmllbGRzLnB1c2goX2tleXMuc2xpY2UoaSwgaSArIDEpKTtcbiAgICAgIGkgKz0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzX3dpZGVfMSkge1xuICAgICAgICBmaWVsZHMucHVzaChfa2V5cy5zbGljZShpLCBpICsgMSkpO1xuICAgICAgICBpICs9IDE7XG4gICAgICB9IGVsc2UgaWYgKCFpc193aWRlXzEgJiYgaXNfd2lkZV8yKSB7XG4gICAgICAgIGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkgKyAxKTtcbiAgICAgICAgY2hpbGRLZXlzLnB1c2godm9pZCAwKTtcbiAgICAgICAgZmllbGRzLnB1c2goY2hpbGRLZXlzKTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgfSBlbHNlIGlmICghaXNfd2lkZV8xICYmICFpc193aWRlXzIpIHtcbiAgICAgICAgY2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSArIDEpO1xuICAgICAgICBpZiAoX2tleXNbaSArIDFdKSB7XG4gICAgICAgICAgY2hpbGRLZXlzLnB1c2goX2tleXNbaSArIDFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGlsZEtleXMucHVzaCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICAgIGZpZWxkcy5wdXNoKGNoaWxkS2V5cyk7XG4gICAgICAgIGkgKz0gMjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuaXNGaWx0ZXJWYWx1ZUVtcHR5ID0gZnVuY3Rpb24odikge1xuICByZXR1cm4gdHlwZW9mIHYgPT09IFwidW5kZWZpbmVkXCIgfHwgdiA9PT0gbnVsbCB8fCBOdW1iZXIuaXNOYU4odikgfHwgdi5sZW5ndGggPT09IDA7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGF0YVR5cGUgPSBmdW5jdGlvbihvYmplY3RGaWVsZHMsIGtleSkge1xuICB2YXIgcmVmLCByZXN1bHQ7XG4gIGlmIChvYmplY3RGaWVsZHMgJiYga2V5KSB7XG4gICAgcmVzdWx0ID0gKHJlZiA9IG9iamVjdEZpZWxkc1trZXldKSAhPSBudWxsID8gcmVmLnR5cGUgOiB2b2lkIDA7XG4gICAgaWYgKFtcImZvcm11bGFcIiwgXCJzdW1tYXJ5XCJdLmluZGV4T2YocmVzdWx0KSA+IC0xKSB7XG4gICAgICByZXN1bHQgPSBvYmplY3RGaWVsZHNba2V5XS5kYXRhX3R5cGU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwidGV4dFwiO1xuICB9XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3IuZ2V0QWxsUmVsYXRlZE9iamVjdHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgIHZhciByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdO1xuICAgIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICAgIGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSkge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoKHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpLmVuYWJsZV9maWxlcykge1xuICAgICAgcmVsYXRlZF9vYmplY3RfbmFtZXMucHVzaChcImNtc19maWxlc1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3MuZm9ybWF0SW5kZXggPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciBpbmRleE5hbWUsIGlzZG9jdW1lbnREQiwgb2JqZWN0LCByZWYsIHJlZjEsIHJlZjI7XG4gICAgb2JqZWN0ID0ge1xuICAgICAgYmFja2dyb3VuZDogdHJ1ZVxuICAgIH07XG4gICAgaXNkb2N1bWVudERCID0gKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMSA9IHJlZi5kYXRhc291cmNlcykgIT0gbnVsbCA/IChyZWYyID0gcmVmMVtcImRlZmF1bHRcIl0pICE9IG51bGwgPyByZWYyLmRvY3VtZW50REIgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDApIHx8IGZhbHNlO1xuICAgIGlmIChpc2RvY3VtZW50REIpIHtcbiAgICAgIGlmIChhcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGluZGV4TmFtZSA9IGFycmF5LmpvaW4oXCIuXCIpO1xuICAgICAgICBvYmplY3QubmFtZSA9IGluZGV4TmFtZTtcbiAgICAgICAgaWYgKGluZGV4TmFtZS5sZW5ndGggPiA1Mikge1xuICAgICAgICAgIG9iamVjdC5uYW1lID0gaW5kZXhOYW1lLnN1YnN0cmluZygwLCA1Mik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cbiIsIkNyZWF0b3IuYXBwc0J5TmFtZSA9IHt9XG5cbiIsIk1ldGVvci5tZXRob2RzXG5cdFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlX2lkKS0+XG5cdFx0aWYgIXRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0aWYgb2JqZWN0X25hbWUgPT0gXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiXG5cdFx0XHRyZXR1cm5cblx0XHRpZiBvYmplY3RfbmFtZSBhbmQgcmVjb3JkX2lkXG5cdFx0XHRpZiAhc3BhY2VfaWRcblx0XHRcdFx0ZG9jID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kT25lKHtfaWQ6IHJlY29yZF9pZH0sIHtmaWVsZHM6IHtzcGFjZTogMX19KVxuXHRcdFx0XHRzcGFjZV9pZCA9IGRvYz8uc3BhY2VcblxuXHRcdFx0Y29sbGVjdGlvbl9yZWNlbnRfdmlld2VkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIilcblx0XHRcdGZpbHRlcnMgPSB7IG93bmVyOiB0aGlzLnVzZXJJZCwgc3BhY2U6IHNwYWNlX2lkLCAncmVjb3JkLm8nOiBvYmplY3RfbmFtZSwgJ3JlY29yZC5pZHMnOiBbcmVjb3JkX2lkXX1cblx0XHRcdGN1cnJlbnRfcmVjZW50X3ZpZXdlZCA9IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5maW5kT25lKGZpbHRlcnMpXG5cdFx0XHRpZiBjdXJyZW50X3JlY2VudF92aWV3ZWRcblx0XHRcdFx0Y29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLnVwZGF0ZShcblx0XHRcdFx0XHRjdXJyZW50X3JlY2VudF92aWV3ZWQuX2lkLFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdCRpbmM6IHtcblx0XHRcdFx0XHRcdFx0Y291bnQ6IDFcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHQkc2V0OiB7XG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkOiBuZXcgRGF0ZSgpXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuaW5zZXJ0KFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdF9pZDogY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLl9tYWtlTmV3SUQoKVxuXHRcdFx0XHRcdFx0b3duZXI6IHRoaXMudXNlcklkXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VfaWRcblx0XHRcdFx0XHRcdHJlY29yZDoge286IG9iamVjdF9uYW1lLCBpZHM6IFtyZWNvcmRfaWRdfVxuXHRcdFx0XHRcdFx0Y291bnQ6IDFcblx0XHRcdFx0XHRcdGNyZWF0ZWQ6IG5ldyBEYXRlKClcblx0XHRcdFx0XHRcdGNyZWF0ZWRfYnk6IHRoaXMudXNlcklkXG5cdFx0XHRcdFx0XHRtb2RpZmllZDogbmV3IERhdGUoKVxuXHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpXG5cdFx0XHRyZXR1cm4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc3BhY2VfaWQpIHtcbiAgICB2YXIgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLCBjdXJyZW50X3JlY2VudF92aWV3ZWQsIGRvYywgZmlsdGVycztcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBcIm9iamVjdF9yZWNlbnRfdmlld2VkXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG9iamVjdF9uYW1lICYmIHJlY29yZF9pZCkge1xuICAgICAgaWYgKCFzcGFjZV9pZCkge1xuICAgICAgICBkb2MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmRPbmUoe1xuICAgICAgICAgIF9pZDogcmVjb3JkX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHNwYWNlOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc3BhY2VfaWQgPSBkb2MgIT0gbnVsbCA/IGRvYy5zcGFjZSA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICAgIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9yZWNlbnRfdmlld2VkXCIpO1xuICAgICAgZmlsdGVycyA9IHtcbiAgICAgICAgb3duZXI6IHRoaXMudXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICdyZWNvcmQubyc6IG9iamVjdF9uYW1lLFxuICAgICAgICAncmVjb3JkLmlkcyc6IFtyZWNvcmRfaWRdXG4gICAgICB9O1xuICAgICAgY3VycmVudF9yZWNlbnRfdmlld2VkID0gY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLmZpbmRPbmUoZmlsdGVycyk7XG4gICAgICBpZiAoY3VycmVudF9yZWNlbnRfdmlld2VkKSB7XG4gICAgICAgIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC51cGRhdGUoY3VycmVudF9yZWNlbnRfdmlld2VkLl9pZCwge1xuICAgICAgICAgICRpbmM6IHtcbiAgICAgICAgICAgIGNvdW50OiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuaW5zZXJ0KHtcbiAgICAgICAgICBfaWQ6IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5fbWFrZU5ld0lEKCksXG4gICAgICAgICAgb3duZXI6IHRoaXMudXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICByZWNvcmQ6IHtcbiAgICAgICAgICAgIG86IG9iamVjdF9uYW1lLFxuICAgICAgICAgICAgaWRzOiBbcmVjb3JkX2lkXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICBjcmVhdGVkX2J5OiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICBtb2RpZmllZF9ieTogdGhpcy51c2VySWRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcbiIsInJlY2VudF9hZ2dyZWdhdGUgPSAoY3JlYXRlZF9ieSwgc3BhY2VJZCwgX3JlY29yZHMsIGNhbGxiYWNrKS0+XG5cdENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3JlY2VudF92aWV3ZWQucmF3Q29sbGVjdGlvbigpLmFnZ3JlZ2F0ZShbXG5cdFx0eyRtYXRjaDoge2NyZWF0ZWRfYnk6IGNyZWF0ZWRfYnksIHNwYWNlOiBzcGFjZUlkfX0sXG5cdFx0eyRncm91cDoge19pZDoge29iamVjdF9uYW1lOiBcIiRyZWNvcmQub1wiLCByZWNvcmRfaWQ6IFwiJHJlY29yZC5pZHNcIiwgc3BhY2U6IFwiJHNwYWNlXCJ9LCBtYXhDcmVhdGVkOiB7JG1heDogXCIkY3JlYXRlZFwifX19LFxuXHRcdHskc29ydDoge21heENyZWF0ZWQ6IC0xfX0sXG5cdFx0eyRsaW1pdDogMTB9XG5cdF0pLnRvQXJyYXkgKGVyciwgZGF0YSktPlxuXHRcdGlmIGVyclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycilcblxuXHRcdGRhdGEuZm9yRWFjaCAoZG9jKSAtPlxuXHRcdFx0X3JlY29yZHMucHVzaCBkb2MuX2lkXG5cblx0XHRpZiBjYWxsYmFjayAmJiBfLmlzRnVuY3Rpb24oY2FsbGJhY2spXG5cdFx0XHRjYWxsYmFjaygpXG5cblx0XHRyZXR1cm5cblxuYXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSA9IE1ldGVvci53cmFwQXN5bmMocmVjZW50X2FnZ3JlZ2F0ZSlcblxuc2VhcmNoX29iamVjdCA9IChzcGFjZSwgb2JqZWN0X25hbWUsdXNlcklkLCBzZWFyY2hUZXh0KS0+XG5cdGRhdGEgPSBuZXcgQXJyYXkoKVxuXG5cdGlmIHNlYXJjaFRleHRcblxuXHRcdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRcdF9vYmplY3RfY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSlcblx0XHRfb2JqZWN0X25hbWVfa2V5ID0gX29iamVjdD8uTkFNRV9GSUVMRF9LRVlcblx0XHRpZiBfb2JqZWN0ICYmIF9vYmplY3RfY29sbGVjdGlvbiAmJiBfb2JqZWN0X25hbWVfa2V5XG5cdFx0XHRxdWVyeSA9IHt9XG5cdFx0XHRzZWFyY2hfS2V5d29yZHMgPSBzZWFyY2hUZXh0LnNwbGl0KFwiIFwiKVxuXHRcdFx0cXVlcnlfYW5kID0gW11cblx0XHRcdHNlYXJjaF9LZXl3b3Jkcy5mb3JFYWNoIChrZXl3b3JkKS0+XG5cdFx0XHRcdHN1YnF1ZXJ5ID0ge31cblx0XHRcdFx0c3VicXVlcnlbX29iamVjdF9uYW1lX2tleV0gPSB7JHJlZ2V4OiBrZXl3b3JkLnRyaW0oKX1cblx0XHRcdFx0cXVlcnlfYW5kLnB1c2ggc3VicXVlcnlcblxuXHRcdFx0cXVlcnkuJGFuZCA9IHF1ZXJ5X2FuZFxuXHRcdFx0cXVlcnkuc3BhY2UgPSB7JGluOiBbc3BhY2VdfVxuXG5cdFx0XHRmaWVsZHMgPSB7X2lkOiAxfVxuXHRcdFx0ZmllbGRzW19vYmplY3RfbmFtZV9rZXldID0gMVxuXG5cdFx0XHRyZWNvcmRzID0gX29iamVjdF9jb2xsZWN0aW9uLmZpbmQocXVlcnksIHtmaWVsZHM6IGZpZWxkcywgc29ydDoge21vZGlmaWVkOiAxfSwgbGltaXQ6IDV9KVxuXG5cdFx0XHRyZWNvcmRzLmZvckVhY2ggKHJlY29yZCktPlxuXHRcdFx0XHRkYXRhLnB1c2gge19pZDogcmVjb3JkLl9pZCwgX25hbWU6IHJlY29yZFtfb2JqZWN0X25hbWVfa2V5XSwgX29iamVjdF9uYW1lOiBvYmplY3RfbmFtZX1cblx0XG5cdHJldHVybiBkYXRhXG5cbk1ldGVvci5tZXRob2RzXG5cdCdvYmplY3RfcmVjZW50X3JlY29yZCc6IChzcGFjZUlkKS0+XG5cdFx0ZGF0YSA9IG5ldyBBcnJheSgpXG5cdFx0cmVjb3JkcyA9IG5ldyBBcnJheSgpXG5cdFx0YXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSh0aGlzLnVzZXJJZCwgc3BhY2VJZCwgcmVjb3Jkcylcblx0XHRyZWNvcmRzLmZvckVhY2ggKGl0ZW0pLT5cblx0XHRcdHJlY29yZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChpdGVtLm9iamVjdF9uYW1lLCBpdGVtLnNwYWNlKVxuXG5cdFx0XHRpZiAhcmVjb3JkX29iamVjdFxuXHRcdFx0XHRyZXR1cm5cblxuXHRcdFx0cmVjb3JkX29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpXG5cblx0XHRcdGlmIHJlY29yZF9vYmplY3QgJiYgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uXG5cdFx0XHRcdGZpZWxkcyA9IHtfaWQ6IDF9XG5cblx0XHRcdFx0ZmllbGRzW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldID0gMVxuXG5cdFx0XHRcdHJlY29yZCA9IHJlY29yZF9vYmplY3RfY29sbGVjdGlvbi5maW5kT25lKGl0ZW0ucmVjb3JkX2lkWzBdLCB7ZmllbGRzOiBmaWVsZHN9KVxuXHRcdFx0XHRpZiByZWNvcmRcblx0XHRcdFx0XHRkYXRhLnB1c2gge19pZDogcmVjb3JkLl9pZCwgX25hbWU6IHJlY29yZFtyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSwgX29iamVjdF9uYW1lOiBpdGVtLm9iamVjdF9uYW1lfVxuXG5cdFx0cmV0dXJuIGRhdGFcblxuXHQnb2JqZWN0X3JlY29yZF9zZWFyY2gnOiAob3B0aW9ucyktPlxuXHRcdHNlbGYgPSB0aGlzXG5cblx0XHRkYXRhID0gbmV3IEFycmF5KClcblxuXHRcdHNlYXJjaFRleHQgPSBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRzcGFjZSA9IG9wdGlvbnMuc3BhY2VcblxuXHRcdF8uZm9yRWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChfb2JqZWN0LCBuYW1lKS0+XG5cdFx0XHRpZiBfb2JqZWN0LmVuYWJsZV9zZWFyY2hcblx0XHRcdFx0b2JqZWN0X3JlY29yZCA9IHNlYXJjaF9vYmplY3Qoc3BhY2UsIF9vYmplY3QubmFtZSwgc2VsZi51c2VySWQsIHNlYXJjaFRleHQpXG5cdFx0XHRcdGRhdGEgPSBkYXRhLmNvbmNhdChvYmplY3RfcmVjb3JkKVxuXG5cdFx0cmV0dXJuIGRhdGFcbiIsInZhciBhc3luY19yZWNlbnRfYWdncmVnYXRlLCByZWNlbnRfYWdncmVnYXRlLCBzZWFyY2hfb2JqZWN0O1xuXG5yZWNlbnRfYWdncmVnYXRlID0gZnVuY3Rpb24oY3JlYXRlZF9ieSwgc3BhY2VJZCwgX3JlY29yZHMsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9yZWNlbnRfdmlld2VkLnJhd0NvbGxlY3Rpb24oKS5hZ2dyZWdhdGUoW1xuICAgIHtcbiAgICAgICRtYXRjaDoge1xuICAgICAgICBjcmVhdGVkX2J5OiBjcmVhdGVkX2J5LFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgICRncm91cDoge1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogXCIkcmVjb3JkLm9cIixcbiAgICAgICAgICByZWNvcmRfaWQ6IFwiJHJlY29yZC5pZHNcIixcbiAgICAgICAgICBzcGFjZTogXCIkc3BhY2VcIlxuICAgICAgICB9LFxuICAgICAgICBtYXhDcmVhdGVkOiB7XG4gICAgICAgICAgJG1heDogXCIkY3JlYXRlZFwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAkc29ydDoge1xuICAgICAgICBtYXhDcmVhdGVkOiAtMVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgICRsaW1pdDogMTBcbiAgICB9XG4gIF0pLnRvQXJyYXkoZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihkb2MpIHtcbiAgICAgIHJldHVybiBfcmVjb3Jkcy5wdXNoKGRvYy5faWQpO1xuICAgIH0pO1xuICAgIGlmIChjYWxsYmFjayAmJiBfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5hc3luY19yZWNlbnRfYWdncmVnYXRlID0gTWV0ZW9yLndyYXBBc3luYyhyZWNlbnRfYWdncmVnYXRlKTtcblxuc2VhcmNoX29iamVjdCA9IGZ1bmN0aW9uKHNwYWNlLCBvYmplY3RfbmFtZSwgdXNlcklkLCBzZWFyY2hUZXh0KSB7XG4gIHZhciBfb2JqZWN0LCBfb2JqZWN0X2NvbGxlY3Rpb24sIF9vYmplY3RfbmFtZV9rZXksIGRhdGEsIGZpZWxkcywgcXVlcnksIHF1ZXJ5X2FuZCwgcmVjb3Jkcywgc2VhcmNoX0tleXdvcmRzO1xuICBkYXRhID0gbmV3IEFycmF5KCk7XG4gIGlmIChzZWFyY2hUZXh0KSB7XG4gICAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpO1xuICAgIF9vYmplY3RfbmFtZV9rZXkgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lk5BTUVfRklFTERfS0VZIDogdm9pZCAwO1xuICAgIGlmIChfb2JqZWN0ICYmIF9vYmplY3RfY29sbGVjdGlvbiAmJiBfb2JqZWN0X25hbWVfa2V5KSB7XG4gICAgICBxdWVyeSA9IHt9O1xuICAgICAgc2VhcmNoX0tleXdvcmRzID0gc2VhcmNoVGV4dC5zcGxpdChcIiBcIik7XG4gICAgICBxdWVyeV9hbmQgPSBbXTtcbiAgICAgIHNlYXJjaF9LZXl3b3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKGtleXdvcmQpIHtcbiAgICAgICAgdmFyIHN1YnF1ZXJ5O1xuICAgICAgICBzdWJxdWVyeSA9IHt9O1xuICAgICAgICBzdWJxdWVyeVtfb2JqZWN0X25hbWVfa2V5XSA9IHtcbiAgICAgICAgICAkcmVnZXg6IGtleXdvcmQudHJpbSgpXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBxdWVyeV9hbmQucHVzaChzdWJxdWVyeSk7XG4gICAgICB9KTtcbiAgICAgIHF1ZXJ5LiRhbmQgPSBxdWVyeV9hbmQ7XG4gICAgICBxdWVyeS5zcGFjZSA9IHtcbiAgICAgICAgJGluOiBbc3BhY2VdXG4gICAgICB9O1xuICAgICAgZmllbGRzID0ge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH07XG4gICAgICBmaWVsZHNbX29iamVjdF9uYW1lX2tleV0gPSAxO1xuICAgICAgcmVjb3JkcyA9IF9vYmplY3RfY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCB7XG4gICAgICAgIGZpZWxkczogZmllbGRzLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgbW9kaWZpZWQ6IDFcbiAgICAgICAgfSxcbiAgICAgICAgbGltaXQ6IDVcbiAgICAgIH0pO1xuICAgICAgcmVjb3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICByZXR1cm4gZGF0YS5wdXNoKHtcbiAgICAgICAgICBfaWQ6IHJlY29yZC5faWQsXG4gICAgICAgICAgX25hbWU6IHJlY29yZFtfb2JqZWN0X25hbWVfa2V5XSxcbiAgICAgICAgICBfb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkYXRhO1xufTtcblxuTWV0ZW9yLm1ldGhvZHMoe1xuICAnb2JqZWN0X3JlY2VudF9yZWNvcmQnOiBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIGRhdGEsIHJlY29yZHM7XG4gICAgZGF0YSA9IG5ldyBBcnJheSgpO1xuICAgIHJlY29yZHMgPSBuZXcgQXJyYXkoKTtcbiAgICBhc3luY19yZWNlbnRfYWdncmVnYXRlKHRoaXMudXNlcklkLCBzcGFjZUlkLCByZWNvcmRzKTtcbiAgICByZWNvcmRzLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgdmFyIGZpZWxkcywgcmVjb3JkLCByZWNvcmRfb2JqZWN0LCByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb247XG4gICAgICByZWNvcmRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSk7XG4gICAgICBpZiAoIXJlY29yZF9vYmplY3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpO1xuICAgICAgaWYgKHJlY29yZF9vYmplY3QgJiYgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uKSB7XG4gICAgICAgIGZpZWxkcyA9IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfTtcbiAgICAgICAgZmllbGRzW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldID0gMTtcbiAgICAgICAgcmVjb3JkID0gcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uLmZpbmRPbmUoaXRlbS5yZWNvcmRfaWRbMF0sIHtcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICAgIHJldHVybiBkYXRhLnB1c2goe1xuICAgICAgICAgICAgX2lkOiByZWNvcmQuX2lkLFxuICAgICAgICAgICAgX25hbWU6IHJlY29yZFtyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSxcbiAgICAgICAgICAgIF9vYmplY3RfbmFtZTogaXRlbS5vYmplY3RfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH0sXG4gICdvYmplY3RfcmVjb3JkX3NlYXJjaCc6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgZGF0YSwgc2VhcmNoVGV4dCwgc2VsZiwgc3BhY2U7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgZGF0YSA9IG5ldyBBcnJheSgpO1xuICAgIHNlYXJjaFRleHQgPSBvcHRpb25zLnNlYXJjaFRleHQ7XG4gICAgc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICAgIF8uZm9yRWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKF9vYmplY3QsIG5hbWUpIHtcbiAgICAgIHZhciBvYmplY3RfcmVjb3JkO1xuICAgICAgaWYgKF9vYmplY3QuZW5hYmxlX3NlYXJjaCkge1xuICAgICAgICBvYmplY3RfcmVjb3JkID0gc2VhcmNoX29iamVjdChzcGFjZSwgX29iamVjdC5uYW1lLCBzZWxmLnVzZXJJZCwgc2VhcmNoVGV4dCk7XG4gICAgICAgIHJldHVybiBkYXRhID0gZGF0YS5jb25jYXQob2JqZWN0X3JlY29yZCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcbiAgICB1cGRhdGVfZmlsdGVyczogKGxpc3R2aWV3X2lkLCBmaWx0ZXJzLCBmaWx0ZXJfc2NvcGUsIGZpbHRlcl9sb2dpYyktPlxuICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MuZGlyZWN0LnVwZGF0ZSh7X2lkOiBsaXN0dmlld19pZH0sIHskc2V0OiB7ZmlsdGVyczogZmlsdGVycywgZmlsdGVyX3Njb3BlOiBmaWx0ZXJfc2NvcGUsIGZpbHRlcl9sb2dpYzogZmlsdGVyX2xvZ2ljfX0pXG5cbiAgICB1cGRhdGVfY29sdW1uczogKGxpc3R2aWV3X2lkLCBjb2x1bW5zKS0+XG4gICAgICAgIGNoZWNrKGNvbHVtbnMsIEFycmF5KVxuICAgICAgICBcbiAgICAgICAgaWYgY29sdW1ucy5sZW5ndGggPCAxXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMCwgXCJTZWxlY3QgYXQgbGVhc3Qgb25lIGZpZWxkIHRvIGRpc3BsYXlcIlxuICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MudXBkYXRlKHtfaWQ6IGxpc3R2aWV3X2lkfSwgeyRzZXQ6IHtjb2x1bW5zOiBjb2x1bW5zfX0pXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIHVwZGF0ZV9maWx0ZXJzOiBmdW5jdGlvbihsaXN0dmlld19pZCwgZmlsdGVycywgZmlsdGVyX3Njb3BlLCBmaWx0ZXJfbG9naWMpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfbGlzdHZpZXdzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBsaXN0dmlld19pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgZmlsdGVyczogZmlsdGVycyxcbiAgICAgICAgZmlsdGVyX3Njb3BlOiBmaWx0ZXJfc2NvcGUsXG4gICAgICAgIGZpbHRlcl9sb2dpYzogZmlsdGVyX2xvZ2ljXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHVwZGF0ZV9jb2x1bW5zOiBmdW5jdGlvbihsaXN0dmlld19pZCwgY29sdW1ucykge1xuICAgIGNoZWNrKGNvbHVtbnMsIEFycmF5KTtcbiAgICBpZiAoY29sdW1ucy5sZW5ndGggPCAxKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCJTZWxlY3QgYXQgbGVhc3Qgb25lIGZpZWxkIHRvIGRpc3BsYXlcIik7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MudXBkYXRlKHtcbiAgICAgIF9pZDogbGlzdHZpZXdfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnNcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHQncmVwb3J0X2RhdGEnOiAob3B0aW9ucyktPlxuXHRcdGNoZWNrKG9wdGlvbnMsIE9iamVjdClcblx0XHRzcGFjZSA9IG9wdGlvbnMuc3BhY2Vcblx0XHRmaWVsZHMgPSBvcHRpb25zLmZpZWxkc1xuXHRcdG9iamVjdF9uYW1lID0gb3B0aW9ucy5vYmplY3RfbmFtZVxuXHRcdGZpbHRlcl9zY29wZSA9IG9wdGlvbnMuZmlsdGVyX3Njb3BlXG5cdFx0ZmlsdGVycyA9IG9wdGlvbnMuZmlsdGVyc1xuXHRcdGZpbHRlckZpZWxkcyA9IHt9XG5cdFx0Y29tcG91bmRGaWVsZHMgPSBbXVxuXHRcdG9iamVjdEZpZWxkcyA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKT8uZmllbGRzXG5cdFx0Xy5lYWNoIGZpZWxkcywgKGl0ZW0sIGluZGV4KS0+XG5cdFx0XHRzcGxpdHMgPSBpdGVtLnNwbGl0KFwiLlwiKVxuXHRcdFx0bmFtZSA9IHNwbGl0c1swXVxuXHRcdFx0b2JqZWN0RmllbGQgPSBvYmplY3RGaWVsZHNbbmFtZV1cblx0XHRcdGlmIHNwbGl0cy5sZW5ndGggPiAxIGFuZCBvYmplY3RGaWVsZFxuXHRcdFx0XHRjaGlsZEtleSA9IGl0ZW0ucmVwbGFjZSBuYW1lICsgXCIuXCIsIFwiXCJcblx0XHRcdFx0Y29tcG91bmRGaWVsZHMucHVzaCh7bmFtZTogbmFtZSwgY2hpbGRLZXk6IGNoaWxkS2V5LCBmaWVsZDogb2JqZWN0RmllbGR9KVxuXHRcdFx0ZmlsdGVyRmllbGRzW25hbWVdID0gMVxuXG5cdFx0c2VsZWN0b3IgPSB7fVxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXG5cdFx0c2VsZWN0b3Iuc3BhY2UgPSBzcGFjZVxuXHRcdGlmIGZpbHRlcl9zY29wZSA9PSBcInNwYWNleFwiXG5cdFx0XHRzZWxlY3Rvci5zcGFjZSA9IFxuXHRcdFx0XHQkaW46IFtudWxsLHNwYWNlXVxuXHRcdGVsc2UgaWYgZmlsdGVyX3Njb3BlID09IFwibWluZVwiXG5cdFx0XHRzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxuXG5cdFx0aWYgQ3JlYXRvci5pc0NvbW1vblNwYWNlKHNwYWNlKSAmJiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZSwgQHVzZXJJZClcblx0XHRcdGRlbGV0ZSBzZWxlY3Rvci5zcGFjZVxuXG5cdFx0aWYgZmlsdGVycyBhbmQgZmlsdGVycy5sZW5ndGggPiAwXG5cdFx0XHRzZWxlY3RvcltcIiRhbmRcIl0gPSBmaWx0ZXJzXG5cblx0XHRjdXJzb3IgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IsIHtmaWVsZHM6IGZpbHRlckZpZWxkcywgc2tpcDogMCwgbGltaXQ6IDEwMDAwfSlcbiNcdFx0aWYgY3Vyc29yLmNvdW50KCkgPiAxMDAwMFxuI1x0XHRcdHJldHVybiBbXVxuXHRcdHJlc3VsdCA9IGN1cnNvci5mZXRjaCgpXG5cdFx0aWYgY29tcG91bmRGaWVsZHMubGVuZ3RoXG5cdFx0XHRyZXN1bHQgPSByZXN1bHQubWFwIChpdGVtLGluZGV4KS0+XG5cdFx0XHRcdF8uZWFjaCBjb21wb3VuZEZpZWxkcywgKGNvbXBvdW5kRmllbGRJdGVtLCBpbmRleCktPlxuXHRcdFx0XHRcdGl0ZW1LZXkgPSBjb21wb3VuZEZpZWxkSXRlbS5uYW1lICsgXCIqJSpcIiArIGNvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5LnJlcGxhY2UoL1xcLi9nLCBcIiolKlwiKVxuXHRcdFx0XHRcdGl0ZW1WYWx1ZSA9IGl0ZW1bY29tcG91bmRGaWVsZEl0ZW0ubmFtZV1cblx0XHRcdFx0XHR0eXBlID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQudHlwZVxuXHRcdFx0XHRcdGlmIFtcImxvb2t1cFwiLCBcIm1hc3Rlcl9kZXRhaWxcIl0uaW5kZXhPZih0eXBlKSA+IC0xXG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0XHRcdGNvbXBvdW5kRmlsdGVyRmllbGRzID0ge31cblx0XHRcdFx0XHRcdGNvbXBvdW5kRmlsdGVyRmllbGRzW2NvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5XSA9IDFcblx0XHRcdFx0XHRcdHJlZmVyZW5jZUl0ZW0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvKS5maW5kT25lIHtfaWQ6IGl0ZW1WYWx1ZX0sIGZpZWxkczogY29tcG91bmRGaWx0ZXJGaWVsZHNcblx0XHRcdFx0XHRcdGlmIHJlZmVyZW5jZUl0ZW1cblx0XHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IHJlZmVyZW5jZUl0ZW1bY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldXG5cdFx0XHRcdFx0ZWxzZSBpZiB0eXBlID09IFwic2VsZWN0XCJcblx0XHRcdFx0XHRcdG9wdGlvbnMgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5vcHRpb25zXG5cdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gXy5maW5kV2hlcmUob3B0aW9ucywge3ZhbHVlOiBpdGVtVmFsdWV9KT8ubGFiZWwgb3IgaXRlbVZhbHVlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IGl0ZW1WYWx1ZVxuXHRcdFx0XHRcdHVubGVzcyBpdGVtW2l0ZW1LZXldXG5cdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gXCItLVwiXG5cdFx0XHRcdHJldHVybiBpdGVtXG5cdFx0XHRyZXR1cm4gcmVzdWx0XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHJlc3VsdFxuXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gICdyZXBvcnRfZGF0YSc6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY29tcG91bmRGaWVsZHMsIGN1cnNvciwgZmllbGRzLCBmaWx0ZXJGaWVsZHMsIGZpbHRlcl9zY29wZSwgZmlsdGVycywgb2JqZWN0RmllbGRzLCBvYmplY3RfbmFtZSwgcmVmLCByZXN1bHQsIHNlbGVjdG9yLCBzcGFjZSwgdXNlcklkO1xuICAgIGNoZWNrKG9wdGlvbnMsIE9iamVjdCk7XG4gICAgc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICAgIGZpZWxkcyA9IG9wdGlvbnMuZmllbGRzO1xuICAgIG9iamVjdF9uYW1lID0gb3B0aW9ucy5vYmplY3RfbmFtZTtcbiAgICBmaWx0ZXJfc2NvcGUgPSBvcHRpb25zLmZpbHRlcl9zY29wZTtcbiAgICBmaWx0ZXJzID0gb3B0aW9ucy5maWx0ZXJzO1xuICAgIGZpbHRlckZpZWxkcyA9IHt9O1xuICAgIGNvbXBvdW5kRmllbGRzID0gW107XG4gICAgb2JqZWN0RmllbGRzID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDA7XG4gICAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgIHZhciBjaGlsZEtleSwgbmFtZSwgb2JqZWN0RmllbGQsIHNwbGl0cztcbiAgICAgIHNwbGl0cyA9IGl0ZW0uc3BsaXQoXCIuXCIpO1xuICAgICAgbmFtZSA9IHNwbGl0c1swXTtcbiAgICAgIG9iamVjdEZpZWxkID0gb2JqZWN0RmllbGRzW25hbWVdO1xuICAgICAgaWYgKHNwbGl0cy5sZW5ndGggPiAxICYmIG9iamVjdEZpZWxkKSB7XG4gICAgICAgIGNoaWxkS2V5ID0gaXRlbS5yZXBsYWNlKG5hbWUgKyBcIi5cIiwgXCJcIik7XG4gICAgICAgIGNvbXBvdW5kRmllbGRzLnB1c2goe1xuICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgY2hpbGRLZXk6IGNoaWxkS2V5LFxuICAgICAgICAgIGZpZWxkOiBvYmplY3RGaWVsZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmaWx0ZXJGaWVsZHNbbmFtZV0gPSAxO1xuICAgIH0pO1xuICAgIHNlbGVjdG9yID0ge307XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZTtcbiAgICBpZiAoZmlsdGVyX3Njb3BlID09PSBcInNwYWNleFwiKSB7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHtcbiAgICAgICAgJGluOiBbbnVsbCwgc3BhY2VdXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyX3Njb3BlID09PSBcIm1pbmVcIikge1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgfVxuICAgIGlmIChDcmVhdG9yLmlzQ29tbW9uU3BhY2Uoc3BhY2UpICYmIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlLCB0aGlzLnVzZXJJZCkpIHtcbiAgICAgIGRlbGV0ZSBzZWxlY3Rvci5zcGFjZTtcbiAgICB9XG4gICAgaWYgKGZpbHRlcnMgJiYgZmlsdGVycy5sZW5ndGggPiAwKSB7XG4gICAgICBzZWxlY3RvcltcIiRhbmRcIl0gPSBmaWx0ZXJzO1xuICAgIH1cbiAgICBjdXJzb3IgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IsIHtcbiAgICAgIGZpZWxkczogZmlsdGVyRmllbGRzLFxuICAgICAgc2tpcDogMCxcbiAgICAgIGxpbWl0OiAxMDAwMFxuICAgIH0pO1xuICAgIHJlc3VsdCA9IGN1cnNvci5mZXRjaCgpO1xuICAgIGlmIChjb21wb3VuZEZpZWxkcy5sZW5ndGgpIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5tYXAoZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgXy5lYWNoKGNvbXBvdW5kRmllbGRzLCBmdW5jdGlvbihjb21wb3VuZEZpZWxkSXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICB2YXIgY29tcG91bmRGaWx0ZXJGaWVsZHMsIGl0ZW1LZXksIGl0ZW1WYWx1ZSwgcmVmMSwgcmVmZXJlbmNlSXRlbSwgcmVmZXJlbmNlX3RvLCB0eXBlO1xuICAgICAgICAgIGl0ZW1LZXkgPSBjb21wb3VuZEZpZWxkSXRlbS5uYW1lICsgXCIqJSpcIiArIGNvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5LnJlcGxhY2UoL1xcLi9nLCBcIiolKlwiKTtcbiAgICAgICAgICBpdGVtVmFsdWUgPSBpdGVtW2NvbXBvdW5kRmllbGRJdGVtLm5hbWVdO1xuICAgICAgICAgIHR5cGUgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC50eXBlO1xuICAgICAgICAgIGlmIChbXCJsb29rdXBcIiwgXCJtYXN0ZXJfZGV0YWlsXCJdLmluZGV4T2YodHlwZSkgPiAtMSkge1xuICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgY29tcG91bmRGaWx0ZXJGaWVsZHMgPSB7fTtcbiAgICAgICAgICAgIGNvbXBvdW5kRmlsdGVyRmllbGRzW2NvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5XSA9IDE7XG4gICAgICAgICAgICByZWZlcmVuY2VJdGVtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bykuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogaXRlbVZhbHVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczogY29tcG91bmRGaWx0ZXJGaWVsZHNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZUl0ZW0pIHtcbiAgICAgICAgICAgICAgaXRlbVtpdGVtS2V5XSA9IHJlZmVyZW5jZUl0ZW1bY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgICAgICAgb3B0aW9ucyA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLm9wdGlvbnM7XG4gICAgICAgICAgICBpdGVtW2l0ZW1LZXldID0gKChyZWYxID0gXy5maW5kV2hlcmUob3B0aW9ucywge1xuICAgICAgICAgICAgICB2YWx1ZTogaXRlbVZhbHVlXG4gICAgICAgICAgICB9KSkgIT0gbnVsbCA/IHJlZjEubGFiZWwgOiB2b2lkIDApIHx8IGl0ZW1WYWx1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXRlbVtpdGVtS2V5XSA9IGl0ZW1WYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFpdGVtW2l0ZW1LZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbVtpdGVtS2V5XSA9IFwiLS1cIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH1cbn0pO1xuIiwiIyMjXG4gICAgdHlwZTogXCJ1c2VyXCJcbiAgICBvYmplY3RfbmFtZTogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgICByZWNvcmRfaWQ6IFwie29iamVjdF9uYW1lfSx7bGlzdHZpZXdfaWR9XCJcbiAgICBzZXR0aW5nczpcbiAgICAgICAgY29sdW1uX3dpZHRoOiB7IGZpZWxkX2E6IDEwMCwgZmllbGRfMjogMTUwIH1cbiAgICAgICAgc29ydDogW1tcImZpZWxkX2FcIiwgXCJkZXNjXCJdXVxuICAgIG93bmVyOiB7dXNlcklkfVxuIyMjXG5cbk1ldGVvci5tZXRob2RzXG4gICAgXCJ0YWJ1bGFyX3NvcnRfc2V0dGluZ3NcIjogKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIHNvcnQpLT5cbiAgICAgICAgdXNlcklkID0gdGhpcy51c2VySWRcbiAgICAgICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLCBvd25lcjogdXNlcklkfSlcbiAgICAgICAgaWYgc2V0dGluZ1xuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LnNvcnRcIjogc29ydH19KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBkb2MgPSBcbiAgICAgICAgICAgICAgICB0eXBlOiBcInVzZXJcIlxuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuICAgICAgICAgICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge31cbiAgICAgICAgICAgICAgICBvd25lcjogdXNlcklkXG5cbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge31cbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0XG5cbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYylcblxuICAgIFwidGFidWxhcl9jb2x1bW5fd2lkdGhfc2V0dGluZ3NcIjogKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbl93aWR0aCktPlxuICAgICAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxuICAgICAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsIG93bmVyOiB1c2VySWR9KVxuICAgICAgICBpZiBzZXR0aW5nXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uY29sdW1uX3dpZHRoXCI6IGNvbHVtbl93aWR0aH19KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBkb2MgPSBcbiAgICAgICAgICAgICAgICB0eXBlOiBcInVzZXJcIlxuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuICAgICAgICAgICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge31cbiAgICAgICAgICAgICAgICBvd25lcjogdXNlcklkXG5cbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge31cbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aFxuXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpXG5cbiAgICBcImdyaWRfc2V0dGluZ3NcIjogKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbl93aWR0aCwgc29ydCktPlxuICAgICAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxuICAgICAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCIsIG93bmVyOiB1c2VySWR9KVxuICAgICAgICBpZiBzZXR0aW5nXG4gICAgICAgICAgICAjIOavj+asoemDveW8uuWItuaUueWPmF9pZF9hY3Rpb25z5YiX55qE5a695bqm77yM5Lul6Kej5Yaz5b2T55So5oi35Y+q5pS55Y+Y5a2X5q615qyh5bqP6ICM5rKh5pyJ5pS55Y+Y5Lu75L2V5a2X5q615a695bqm5pe277yM5YmN56uv5rKh5pyJ6K6i6ZiF5Yiw5a2X5q615qyh5bqP5Y+Y5pu055qE5pWw5o2u55qE6Zeu6aKYXG4gICAgICAgICAgICBjb2x1bW5fd2lkdGguX2lkX2FjdGlvbnMgPSBpZiBzZXR0aW5nLnNldHRpbmdzW1wiI3tsaXN0X3ZpZXdfaWR9XCJdPy5jb2x1bW5fd2lkdGg/Ll9pZF9hY3Rpb25zID09IDQ2IHRoZW4gNDcgZWxzZSA0NlxuICAgICAgICAgICAgaWYgc29ydFxuICAgICAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5zb3J0XCI6IHNvcnQsIFwic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LmNvbHVtbl93aWR0aFwiOiBjb2x1bW5fd2lkdGh9fSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uY29sdW1uX3dpZHRoXCI6IGNvbHVtbl93aWR0aH19KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBkb2MgPVxuICAgICAgICAgICAgICAgIHR5cGU6IFwidXNlclwiXG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIlxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7fVxuICAgICAgICAgICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fVxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydFxuXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpIiwiXG4vKlxuICAgIHR5cGU6IFwidXNlclwiXG4gICAgb2JqZWN0X25hbWU6IFwib2JqZWN0X2xpc3R2aWV3c1wiXG4gICAgcmVjb3JkX2lkOiBcIntvYmplY3RfbmFtZX0se2xpc3R2aWV3X2lkfVwiXG4gICAgc2V0dGluZ3M6XG4gICAgICAgIGNvbHVtbl93aWR0aDogeyBmaWVsZF9hOiAxMDAsIGZpZWxkXzI6IDE1MCB9XG4gICAgICAgIHNvcnQ6IFtbXCJmaWVsZF9hXCIsIFwiZGVzY1wiXV1cbiAgICBvd25lcjoge3VzZXJJZH1cbiAqL1xuTWV0ZW9yLm1ldGhvZHMoe1xuICBcInRhYnVsYXJfc29ydF9zZXR0aW5nc1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBzb3J0KSB7XG4gICAgdmFyIGRvYywgb2JqLCBzZXR0aW5nLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgb3duZXI6IHVzZXJJZFxuICAgIH0pO1xuICAgIGlmIChzZXR0aW5nKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IChcbiAgICAgICAgICBvYmogPSB7fSxcbiAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLnNvcnRcIl0gPSBzb3J0LFxuICAgICAgICAgIG9ialxuICAgICAgICApXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jID0ge1xuICAgICAgICB0eXBlOiBcInVzZXJcIixcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgICBzZXR0aW5nczoge30sXG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH07XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnQ7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH0sXG4gIFwidGFidWxhcl9jb2x1bW5fd2lkdGhfc2V0dGluZ3NcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoKSB7XG4gICAgdmFyIGRvYywgb2JqLCBzZXR0aW5nLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgb3duZXI6IHVzZXJJZFxuICAgIH0pO1xuICAgIGlmIChzZXR0aW5nKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IChcbiAgICAgICAgICBvYmogPSB7fSxcbiAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLmNvbHVtbl93aWR0aFwiXSA9IGNvbHVtbl93aWR0aCxcbiAgICAgICAgICBvYmpcbiAgICAgICAgKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYyA9IHtcbiAgICAgICAgdHlwZTogXCJ1c2VyXCIsXG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgICAgc2V0dGluZ3M6IHt9LFxuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aDtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpO1xuICAgIH1cbiAgfSxcbiAgXCJncmlkX3NldHRpbmdzXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbl93aWR0aCwgc29ydCkge1xuICAgIHZhciBkb2MsIG9iaiwgb2JqMSwgcmVmLCByZWYxLCBzZXR0aW5nLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiLFxuICAgICAgb3duZXI6IHVzZXJJZFxuICAgIH0pO1xuICAgIGlmIChzZXR0aW5nKSB7XG4gICAgICBjb2x1bW5fd2lkdGguX2lkX2FjdGlvbnMgPSAoKHJlZiA9IHNldHRpbmcuc2V0dGluZ3NbXCJcIiArIGxpc3Rfdmlld19pZF0pICE9IG51bGwgPyAocmVmMSA9IHJlZi5jb2x1bW5fd2lkdGgpICE9IG51bGwgPyByZWYxLl9pZF9hY3Rpb25zIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gNDYgPyA0NyA6IDQ2O1xuICAgICAgaWYgKHNvcnQpIHtcbiAgICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgICBvYmogPSB7fSxcbiAgICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuc29ydFwiXSA9IHNvcnQsXG4gICAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLmNvbHVtbl93aWR0aFwiXSA9IGNvbHVtbl93aWR0aCxcbiAgICAgICAgICAgIG9ialxuICAgICAgICAgIClcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IChcbiAgICAgICAgICAgIG9iajEgPSB7fSxcbiAgICAgICAgICAgIG9iajFbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLmNvbHVtbl93aWR0aFwiXSA9IGNvbHVtbl93aWR0aCxcbiAgICAgICAgICAgIG9iajFcbiAgICAgICAgICApXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2MgPSB7XG4gICAgICAgIHR5cGU6IFwidXNlclwiLFxuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCIsXG4gICAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge307XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5jb2x1bW5fd2lkdGggPSBjb2x1bW5fd2lkdGg7XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydDtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpO1xuICAgIH1cbiAgfVxufSk7XG4iLCJ4bWwyanMgPSByZXF1aXJlICd4bWwyanMnXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5ta2RpcnAgPSByZXF1aXJlICdta2RpcnAnXG5cbmxvZ2dlciA9IG5ldyBMb2dnZXIgJ0V4cG9ydF9UT19YTUwnXG5cbl93cml0ZVhtbEZpbGUgPSAoanNvbk9iaixvYmpOYW1lKSAtPlxuXHQjIOi9rHhtbFxuXHRidWlsZGVyID0gbmV3IHhtbDJqcy5CdWlsZGVyKClcblx0eG1sID0gYnVpbGRlci5idWlsZE9iamVjdCBqc29uT2JqXG5cblx0IyDovazkuLpidWZmZXJcblx0c3RyZWFtID0gbmV3IEJ1ZmZlciB4bWxcblxuXHQjIOagueaNruW9k+WkqeaXtumXtOeahOW5tOaciOaXpeS9nOS4uuWtmOWCqOi3r+W+hFxuXHRub3cgPSBuZXcgRGF0ZVxuXHR5ZWFyID0gbm93LmdldEZ1bGxZZWFyKClcblx0bW9udGggPSBub3cuZ2V0TW9udGgoKSArIDFcblx0ZGF5ID0gbm93LmdldERhdGUoKVxuXG5cdCMg5paH5Lu26Lev5b6EXG5cdGZpbGVQYXRoID0gcGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwnLi4vLi4vLi4vZXhwb3J0LycgKyB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBkYXkgKyAnLycgKyBvYmpOYW1lIClcblx0ZmlsZU5hbWUgPSBqc29uT2JqPy5faWQgKyBcIi54bWxcIlxuXHRmaWxlQWRkcmVzcyA9IHBhdGguam9pbiBmaWxlUGF0aCwgZmlsZU5hbWVcblxuXHRpZiAhZnMuZXhpc3RzU3luYyBmaWxlUGF0aFxuXHRcdG1rZGlycC5zeW5jIGZpbGVQYXRoXG5cblx0IyDlhpnlhaXmlofku7Zcblx0ZnMud3JpdGVGaWxlIGZpbGVBZGRyZXNzLCBzdHJlYW0sIChlcnIpIC0+XG5cdFx0aWYgZXJyXG5cdFx0XHRsb2dnZXIuZXJyb3IgXCIje2pzb25PYmouX2lkfeWGmeWFpXhtbOaWh+S7tuWksei0pVwiLGVyclxuXHRcblx0cmV0dXJuIGZpbGVQYXRoXG5cblxuIyDmlbTnkIZGaWVsZHPnmoRqc29u5pWw5o2uXG5fbWl4RmllbGRzRGF0YSA9IChvYmosb2JqTmFtZSkgLT5cblx0IyDliJ3lp4vljJblr7nosaHmlbDmja5cblx0anNvbk9iaiA9IHt9XG5cdCMg6I635Y+WZmllbGRzXG5cdG9iakZpZWxkcyA9IENyZWF0b3I/LmdldE9iamVjdChvYmpOYW1lKT8uZmllbGRzXG5cblx0bWl4RGVmYXVsdCA9IChmaWVsZF9uYW1lKS0+XG5cdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IG9ialtmaWVsZF9uYW1lXSB8fCBcIlwiXG5cblx0bWl4RGF0ZSA9IChmaWVsZF9uYW1lLHR5cGUpLT5cblx0XHRkYXRlID0gb2JqW2ZpZWxkX25hbWVdXG5cdFx0aWYgdHlwZSA9PSBcImRhdGVcIlxuXHRcdFx0Zm9ybWF0ID0gXCJZWVlZLU1NLUREXCJcblx0XHRlbHNlXG5cdFx0XHRmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW06c3NcIlxuXHRcdGlmIGRhdGU/IGFuZCBmb3JtYXQ/XG5cdFx0XHRkYXRlU3RyID0gbW9tZW50KGRhdGUpLmZvcm1hdChmb3JtYXQpXG5cdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IGRhdGVTdHIgfHwgXCJcIlxuXG5cdG1peEJvb2wgPSAoZmllbGRfbmFtZSktPlxuXHRcdGlmIG9ialtmaWVsZF9uYW1lXSA9PSB0cnVlXG5cdFx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLmmK9cIlxuXHRcdGVsc2UgaWYgb2JqW2ZpZWxkX25hbWVdID09IGZhbHNlXG5cdFx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLlkKZcIlxuXHRcdGVsc2Vcblx0XHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIlwiXG5cblx0IyDlvqrnjq/mr4/kuKpmaWVsZHMs5bm25Yik5pat5Y+W5YC8XG5cdF8uZWFjaCBvYmpGaWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdHN3aXRjaCBmaWVsZD8udHlwZVxuXHRcdFx0d2hlbiBcImRhdGVcIixcImRhdGV0aW1lXCIgdGhlbiBtaXhEYXRlIGZpZWxkX25hbWUsZmllbGQudHlwZVxuXHRcdFx0d2hlbiBcImJvb2xlYW5cIiB0aGVuIG1peEJvb2wgZmllbGRfbmFtZVxuXHRcdFx0ZWxzZSBtaXhEZWZhdWx0IGZpZWxkX25hbWVcblxuXHRyZXR1cm4ganNvbk9ialxuXG4jIOiOt+WPluWtkOihqOaVtOeQhuaVsOaNrlxuX21peFJlbGF0ZWREYXRhID0gKG9iaixvYmpOYW1lKSAtPlxuXHQjIOWIneWni+WMluWvueixoeaVsOaNrlxuXHRyZWxhdGVkX29iamVjdHMgPSB7fVxuXG5cdCMg6I635Y+W55u45YWz6KGoXG5cdHJlbGF0ZWRPYmpOYW1lcyA9IENyZWF0b3I/LmdldEFsbFJlbGF0ZWRPYmplY3RzIG9iak5hbWVcblxuXHQjIOW+queOr+ebuOWFs+ihqFxuXHRyZWxhdGVkT2JqTmFtZXMuZm9yRWFjaCAocmVsYXRlZE9iak5hbWUpIC0+XG5cdFx0IyDmr4/kuKrooajlrprkuYnkuIDkuKrlr7nosaHmlbDnu4Rcblx0XHRyZWxhdGVkVGFibGVEYXRhID0gW11cblxuXHRcdCMgKuiuvue9ruWFs+iBlOaQnOe0ouafpeivoueahOWtl+autVxuXHRcdCMg6ZmE5Lu255qE5YWz6IGU5pCc57Si5a2X5q615piv5a6a5q2755qEXG5cdFx0aWYgcmVsYXRlZE9iak5hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gXCJwYXJlbnQuaWRzXCJcblx0XHRlbHNlXG5cdFx0XHQjIOiOt+WPlmZpZWxkc1xuXHRcdFx0ZmllbGRzID0gQ3JlYXRvcj8uT2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0/LmZpZWxkc1xuXHRcdFx0IyDlvqrnjq/mr4/kuKpmaWVsZCzmib7lh7pyZWZlcmVuY2VfdG/nmoTlhbPogZTlrZfmrrVcblx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwiXCJcblx0XHRcdF8uZWFjaCBmaWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdFx0XHRpZiBmaWVsZD8ucmVmZXJlbmNlX3RvID09IG9iak5hbWVcblx0XHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSBmaWVsZF9uYW1lXG5cblx0XHQjIOagueaNruaJvuWHuueahOWFs+iBlOWtl+aute+8jOafpeWtkOihqOaVsOaNrlxuXHRcdGlmIHJlbGF0ZWRfZmllbGRfbmFtZVxuXHRcdFx0cmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iak5hbWUpXG5cdFx0XHQjIOiOt+WPluWIsOaJgOacieeahOaVsOaNrlxuXHRcdFx0cmVsYXRlZFJlY29yZExpc3QgPSByZWxhdGVkQ29sbGVjdGlvbi5maW5kKHtcIiN7cmVsYXRlZF9maWVsZF9uYW1lfVwiOm9iai5faWR9KS5mZXRjaCgpXG5cdFx0XHQjIOW+queOr+avj+S4gOadoeaVsOaNrlxuXHRcdFx0cmVsYXRlZFJlY29yZExpc3QuZm9yRWFjaCAocmVsYXRlZE9iaiktPlxuXHRcdFx0XHQjIOaVtOWQiGZpZWxkc+aVsOaNrlxuXHRcdFx0XHRmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEgcmVsYXRlZE9iaixyZWxhdGVkT2JqTmFtZVxuXHRcdFx0XHQjIOaKiuS4gOadoeiusOW9leaPkuWFpeWIsOWvueixoeaVsOe7hOS4rVxuXHRcdFx0XHRyZWxhdGVkVGFibGVEYXRhLnB1c2ggZmllbGRzRGF0YVxuXG5cdFx0IyDmiorkuIDkuKrlrZDooajnmoTmiYDmnInmlbDmja7mj5LlhaXliLByZWxhdGVkX29iamVjdHPkuK3vvIzlho3lvqrnjq/kuIvkuIDkuKpcblx0XHRyZWxhdGVkX29iamVjdHNbcmVsYXRlZE9iak5hbWVdID0gcmVsYXRlZFRhYmxlRGF0YVxuXG5cdHJldHVybiByZWxhdGVkX29iamVjdHNcblxuIyBDcmVhdG9yLkV4cG9ydDJ4bWwoKVxuQ3JlYXRvci5FeHBvcnQyeG1sID0gKG9iak5hbWUsIHJlY29yZExpc3QpIC0+XG5cdGxvZ2dlci5pbmZvIFwiUnVuIENyZWF0b3IuRXhwb3J0MnhtbFwiXG5cblx0Y29uc29sZS50aW1lIFwiQ3JlYXRvci5FeHBvcnQyeG1sXCJcblxuXHQjIOa1i+ivleaVsOaNrlxuXHQjIG9iak5hbWUgPSBcImFyY2hpdmVfcmVjb3Jkc1wiXG5cblx0IyDmn6Xmib7lr7nosaHmlbDmja5cblx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKVxuXHQjIOa1i+ivleaVsOaNrlxuXHRyZWNvcmRMaXN0ID0gY29sbGVjdGlvbi5maW5kKHt9KS5mZXRjaCgpXG5cblx0cmVjb3JkTGlzdC5mb3JFYWNoIChyZWNvcmRPYmopLT5cblx0XHRqc29uT2JqID0ge31cblx0XHRqc29uT2JqLl9pZCA9IHJlY29yZE9iai5faWRcblxuXHRcdCMg5pW055CG5Li76KGo55qERmllbGRz5pWw5o2uXG5cdFx0ZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhIHJlY29yZE9iaixvYmpOYW1lXG5cdFx0anNvbk9ialtvYmpOYW1lXSA9IGZpZWxkc0RhdGFcblxuXHRcdCMg5pW055CG55u45YWz6KGo5pWw5o2uXG5cdFx0cmVsYXRlZF9vYmplY3RzID0gX21peFJlbGF0ZWREYXRhIHJlY29yZE9iaixvYmpOYW1lXG5cblx0XHRqc29uT2JqW1wicmVsYXRlZF9vYmplY3RzXCJdID0gcmVsYXRlZF9vYmplY3RzXG5cblx0XHQjIOi9rOS4unhtbOS/neWtmOaWh+S7tlxuXHRcdGZpbGVQYXRoID0gX3dyaXRlWG1sRmlsZSBqc29uT2JqLG9iak5hbWVcblxuXHRjb25zb2xlLnRpbWVFbmQgXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIlxuXHRyZXR1cm4gZmlsZVBhdGgiLCJ2YXIgX21peEZpZWxkc0RhdGEsIF9taXhSZWxhdGVkRGF0YSwgX3dyaXRlWG1sRmlsZSwgZnMsIGxvZ2dlciwgbWtkaXJwLCBwYXRoLCB4bWwyanM7XG5cbnhtbDJqcyA9IHJlcXVpcmUoJ3htbDJqcycpO1xuXG5mcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cbnBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbm1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpO1xuXG5sb2dnZXIgPSBuZXcgTG9nZ2VyKCdFeHBvcnRfVE9fWE1MJyk7XG5cbl93cml0ZVhtbEZpbGUgPSBmdW5jdGlvbihqc29uT2JqLCBvYmpOYW1lKSB7XG4gIHZhciBidWlsZGVyLCBkYXksIGZpbGVBZGRyZXNzLCBmaWxlTmFtZSwgZmlsZVBhdGgsIG1vbnRoLCBub3csIHN0cmVhbSwgeG1sLCB5ZWFyO1xuICBidWlsZGVyID0gbmV3IHhtbDJqcy5CdWlsZGVyKCk7XG4gIHhtbCA9IGJ1aWxkZXIuYnVpbGRPYmplY3QoanNvbk9iaik7XG4gIHN0cmVhbSA9IG5ldyBCdWZmZXIoeG1sKTtcbiAgbm93ID0gbmV3IERhdGU7XG4gIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgbW9udGggPSBub3cuZ2V0TW9udGgoKSArIDE7XG4gIGRheSA9IG5vdy5nZXREYXRlKCk7XG4gIGZpbGVQYXRoID0gcGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwgJy4uLy4uLy4uL2V4cG9ydC8nICsgeWVhciArICcvJyArIG1vbnRoICsgJy8nICsgZGF5ICsgJy8nICsgb2JqTmFtZSk7XG4gIGZpbGVOYW1lID0gKGpzb25PYmogIT0gbnVsbCA/IGpzb25PYmouX2lkIDogdm9pZCAwKSArIFwiLnhtbFwiO1xuICBmaWxlQWRkcmVzcyA9IHBhdGguam9pbihmaWxlUGF0aCwgZmlsZU5hbWUpO1xuICBpZiAoIWZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XG4gICAgbWtkaXJwLnN5bmMoZmlsZVBhdGgpO1xuICB9XG4gIGZzLndyaXRlRmlsZShmaWxlQWRkcmVzcywgc3RyZWFtLCBmdW5jdGlvbihlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICByZXR1cm4gbG9nZ2VyLmVycm9yKGpzb25PYmouX2lkICsgXCLlhpnlhaV4bWzmlofku7blpLHotKVcIiwgZXJyKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmlsZVBhdGg7XG59O1xuXG5fbWl4RmllbGRzRGF0YSA9IGZ1bmN0aW9uKG9iaiwgb2JqTmFtZSkge1xuICB2YXIganNvbk9iaiwgbWl4Qm9vbCwgbWl4RGF0ZSwgbWl4RGVmYXVsdCwgb2JqRmllbGRzLCByZWY7XG4gIGpzb25PYmogPSB7fTtcbiAgb2JqRmllbGRzID0gdHlwZW9mIENyZWF0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgQ3JlYXRvciAhPT0gbnVsbCA/IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmpOYW1lKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIG1peERlZmF1bHQgPSBmdW5jdGlvbihmaWVsZF9uYW1lKSB7XG4gICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBvYmpbZmllbGRfbmFtZV0gfHwgXCJcIjtcbiAgfTtcbiAgbWl4RGF0ZSA9IGZ1bmN0aW9uKGZpZWxkX25hbWUsIHR5cGUpIHtcbiAgICB2YXIgZGF0ZSwgZGF0ZVN0ciwgZm9ybWF0O1xuICAgIGRhdGUgPSBvYmpbZmllbGRfbmFtZV07XG4gICAgaWYgKHR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICBmb3JtYXQgPSBcIllZWVktTU0tRERcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9ybWF0ID0gXCJZWVlZLU1NLUREIEhIOm1tOnNzXCI7XG4gICAgfVxuICAgIGlmICgoZGF0ZSAhPSBudWxsKSAmJiAoZm9ybWF0ICE9IG51bGwpKSB7XG4gICAgICBkYXRlU3RyID0gbW9tZW50KGRhdGUpLmZvcm1hdChmb3JtYXQpO1xuICAgIH1cbiAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IGRhdGVTdHIgfHwgXCJcIjtcbiAgfTtcbiAgbWl4Qm9vbCA9IGZ1bmN0aW9uKGZpZWxkX25hbWUpIHtcbiAgICBpZiAob2JqW2ZpZWxkX25hbWVdID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5pivXCI7XG4gICAgfSBlbHNlIGlmIChvYmpbZmllbGRfbmFtZV0gPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5ZCmXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gXCJcIjtcbiAgICB9XG4gIH07XG4gIF8uZWFjaChvYmpGaWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgc3dpdGNoIChmaWVsZCAhPSBudWxsID8gZmllbGQudHlwZSA6IHZvaWQgMCkge1xuICAgICAgY2FzZSBcImRhdGVcIjpcbiAgICAgIGNhc2UgXCJkYXRldGltZVwiOlxuICAgICAgICByZXR1cm4gbWl4RGF0ZShmaWVsZF9uYW1lLCBmaWVsZC50eXBlKTtcbiAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgIHJldHVybiBtaXhCb29sKGZpZWxkX25hbWUpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG1peERlZmF1bHQoZmllbGRfbmFtZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGpzb25PYmo7XG59O1xuXG5fbWl4UmVsYXRlZERhdGEgPSBmdW5jdGlvbihvYmosIG9iak5hbWUpIHtcbiAgdmFyIHJlbGF0ZWRPYmpOYW1lcywgcmVsYXRlZF9vYmplY3RzO1xuICByZWxhdGVkX29iamVjdHMgPSB7fTtcbiAgcmVsYXRlZE9iak5hbWVzID0gdHlwZW9mIENyZWF0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgQ3JlYXRvciAhPT0gbnVsbCA/IENyZWF0b3IuZ2V0QWxsUmVsYXRlZE9iamVjdHMob2JqTmFtZSkgOiB2b2lkIDA7XG4gIHJlbGF0ZWRPYmpOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKHJlbGF0ZWRPYmpOYW1lKSB7XG4gICAgdmFyIGZpZWxkcywgb2JqMSwgcmVmLCByZWxhdGVkQ29sbGVjdGlvbiwgcmVsYXRlZFJlY29yZExpc3QsIHJlbGF0ZWRUYWJsZURhdGEsIHJlbGF0ZWRfZmllbGRfbmFtZTtcbiAgICByZWxhdGVkVGFibGVEYXRhID0gW107XG4gICAgaWYgKHJlbGF0ZWRPYmpOYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSBcInBhcmVudC5pZHNcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZmllbGRzID0gdHlwZW9mIENyZWF0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgQ3JlYXRvciAhPT0gbnVsbCA/IChyZWYgPSBDcmVhdG9yLk9iamVjdHNbcmVsYXRlZE9iak5hbWVdKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwiXCI7XG4gICAgICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgICAgICBpZiAoKGZpZWxkICE9IG51bGwgPyBmaWVsZC5yZWZlcmVuY2VfdG8gOiB2b2lkIDApID09PSBvYmpOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfZmllbGRfbmFtZSA9IGZpZWxkX25hbWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAocmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICByZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqTmFtZSk7XG4gICAgICByZWxhdGVkUmVjb3JkTGlzdCA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoKFxuICAgICAgICBvYmoxID0ge30sXG4gICAgICAgIG9iajFbXCJcIiArIHJlbGF0ZWRfZmllbGRfbmFtZV0gPSBvYmouX2lkLFxuICAgICAgICBvYmoxXG4gICAgICApKS5mZXRjaCgpO1xuICAgICAgcmVsYXRlZFJlY29yZExpc3QuZm9yRWFjaChmdW5jdGlvbihyZWxhdGVkT2JqKSB7XG4gICAgICAgIHZhciBmaWVsZHNEYXRhO1xuICAgICAgICBmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEocmVsYXRlZE9iaiwgcmVsYXRlZE9iak5hbWUpO1xuICAgICAgICByZXR1cm4gcmVsYXRlZFRhYmxlRGF0YS5wdXNoKGZpZWxkc0RhdGEpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZWxhdGVkX29iamVjdHNbcmVsYXRlZE9iak5hbWVdID0gcmVsYXRlZFRhYmxlRGF0YTtcbiAgfSk7XG4gIHJldHVybiByZWxhdGVkX29iamVjdHM7XG59O1xuXG5DcmVhdG9yLkV4cG9ydDJ4bWwgPSBmdW5jdGlvbihvYmpOYW1lLCByZWNvcmRMaXN0KSB7XG4gIHZhciBjb2xsZWN0aW9uO1xuICBsb2dnZXIuaW5mbyhcIlJ1biBDcmVhdG9yLkV4cG9ydDJ4bWxcIik7XG4gIGNvbnNvbGUudGltZShcIkNyZWF0b3IuRXhwb3J0MnhtbFwiKTtcbiAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKTtcbiAgcmVjb3JkTGlzdCA9IGNvbGxlY3Rpb24uZmluZCh7fSkuZmV0Y2goKTtcbiAgcmVjb3JkTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHJlY29yZE9iaikge1xuICAgIHZhciBmaWVsZHNEYXRhLCBmaWxlUGF0aCwganNvbk9iaiwgcmVsYXRlZF9vYmplY3RzO1xuICAgIGpzb25PYmogPSB7fTtcbiAgICBqc29uT2JqLl9pZCA9IHJlY29yZE9iai5faWQ7XG4gICAgZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhKHJlY29yZE9iaiwgb2JqTmFtZSk7XG4gICAganNvbk9ialtvYmpOYW1lXSA9IGZpZWxkc0RhdGE7XG4gICAgcmVsYXRlZF9vYmplY3RzID0gX21peFJlbGF0ZWREYXRhKHJlY29yZE9iaiwgb2JqTmFtZSk7XG4gICAganNvbk9ialtcInJlbGF0ZWRfb2JqZWN0c1wiXSA9IHJlbGF0ZWRfb2JqZWN0cztcbiAgICByZXR1cm4gZmlsZVBhdGggPSBfd3JpdGVYbWxGaWxlKGpzb25PYmosIG9iak5hbWUpO1xuICB9KTtcbiAgY29uc29sZS50aW1lRW5kKFwiQ3JlYXRvci5FeHBvcnQyeG1sXCIpO1xuICByZXR1cm4gZmlsZVBhdGg7XG59O1xuIiwiTWV0ZW9yLm1ldGhvZHMgXG5cdHJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzOiAob2JqZWN0X25hbWUsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZUlkKS0+XG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcblx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIlxuXHRcdFx0c2VsZWN0b3IgPSB7XCJtZXRhZGF0YS5zcGFjZVwiOiBzcGFjZUlkfVxuXHRcdGVsc2Vcblx0XHRcdHNlbGVjdG9yID0ge3NwYWNlOiBzcGFjZUlkfVxuXHRcdFxuXHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0IyDpmYTku7bnmoTlhbPogZTmkJzntKLmnaHku7bmmK/lrprmrbvnmoRcblx0XHRcdHNlbGVjdG9yW1wicGFyZW50Lm9cIl0gPSBvYmplY3RfbmFtZVxuXHRcdFx0c2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF1cblx0XHRlbHNlXG5cdFx0XHRzZWxlY3RvcltyZWxhdGVkX2ZpZWxkX25hbWVdID0gcmVjb3JkX2lkXG5cblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRcdGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMuYWxsb3dSZWFkXG5cdFx0XHRzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxuXHRcdFxuXHRcdHJlbGF0ZWRfcmVjb3JkcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKVxuXHRcdHJldHVybiByZWxhdGVkX3JlY29yZHMuY291bnQoKSIsIk1ldGVvci5tZXRob2RzKHtcbiAgcmVsYXRlZF9vYmplY3RzX3JlY29yZHM6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCkge1xuICAgIHZhciBwZXJtaXNzaW9ucywgcmVsYXRlZF9yZWNvcmRzLCBzZWxlY3RvciwgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICBcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWRcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIHNlbGVjdG9yW1wicGFyZW50Lm9cIl0gPSBvYmplY3RfbmFtZTtcbiAgICAgIHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3RvcltyZWxhdGVkX2ZpZWxkX25hbWVdID0gcmVjb3JkX2lkO1xuICAgIH1cbiAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgICBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLmFsbG93UmVhZCkge1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgfVxuICAgIHJlbGF0ZWRfcmVjb3JkcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVsYXRlZF9yZWNvcmRzLmNvdW50KCk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0Z2V0UGVuZGluZ1NwYWNlSW5mbzogKGludml0ZXJJZCwgc3BhY2VJZCktPlxuXHRcdGludml0ZXJOYW1lID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBpbnZpdGVySWR9KS5uYW1lXG5cdFx0c3BhY2VOYW1lID0gZGIuc3BhY2VzLmZpbmRPbmUoe19pZDogc3BhY2VJZH0pLm5hbWVcblxuXHRcdHJldHVybiB7aW52aXRlcjogaW52aXRlck5hbWUsIHNwYWNlOiBzcGFjZU5hbWV9XG5cblx0cmVmdXNlSm9pblNwYWNlOiAoX2lkKS0+XG5cdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBfaWR9LHskc2V0OiB7aW52aXRlX3N0YXRlOiBcInJlZnVzZWRcIn19KVxuXG5cdGFjY2VwdEpvaW5TcGFjZTogKF9pZCktPlxuXHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogX2lkfSx7JHNldDoge2ludml0ZV9zdGF0ZTogXCJhY2NlcHRlZFwiLCB1c2VyX2FjY2VwdGVkOiB0cnVlfX0pXG5cbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgZ2V0UGVuZGluZ1NwYWNlSW5mbzogZnVuY3Rpb24oaW52aXRlcklkLCBzcGFjZUlkKSB7XG4gICAgdmFyIGludml0ZXJOYW1lLCBzcGFjZU5hbWU7XG4gICAgaW52aXRlck5hbWUgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogaW52aXRlcklkXG4gICAgfSkubmFtZTtcbiAgICBzcGFjZU5hbWUgPSBkYi5zcGFjZXMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHNwYWNlSWRcbiAgICB9KS5uYW1lO1xuICAgIHJldHVybiB7XG4gICAgICBpbnZpdGVyOiBpbnZpdGVyTmFtZSxcbiAgICAgIHNwYWNlOiBzcGFjZU5hbWVcbiAgICB9O1xuICB9LFxuICByZWZ1c2VKb2luU3BhY2U6IGZ1bmN0aW9uKF9pZCkge1xuICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBpbnZpdGVfc3RhdGU6IFwicmVmdXNlZFwiXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIGFjY2VwdEpvaW5TcGFjZTogZnVuY3Rpb24oX2lkKSB7XG4gICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGludml0ZV9zdGF0ZTogXCJhY2NlcHRlZFwiLFxuICAgICAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggXCJjcmVhdG9yX29iamVjdF9yZWNvcmRcIiwgKG9iamVjdF9uYW1lLCBpZCwgc3BhY2VfaWQpLT5cblx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpXG5cdGlmIGNvbGxlY3Rpb25cblx0XHRyZXR1cm4gY29sbGVjdGlvbi5maW5kKHtfaWQ6IGlkfSlcblxuIiwiTWV0ZW9yLnB1Ymxpc2goXCJjcmVhdG9yX29iamVjdF9yZWNvcmRcIiwgZnVuY3Rpb24ob2JqZWN0X25hbWUsIGlkLCBzcGFjZV9pZCkge1xuICB2YXIgY29sbGVjdGlvbjtcbiAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpO1xuICBpZiAoY29sbGVjdGlvbikge1xuICAgIHJldHVybiBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgX2lkOiBpZFxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoQ29tcG9zaXRlIFwic3RlZWRvc19vYmplY3RfdGFidWxhclwiLCAodGFibGVOYW1lLCBpZHMsIGZpZWxkcywgc3BhY2VJZCktPlxuXHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0Y2hlY2sodGFibGVOYW1lLCBTdHJpbmcpO1xuXHRjaGVjayhpZHMsIEFycmF5KTtcblx0Y2hlY2soZmllbGRzLCBNYXRjaC5PcHRpb25hbChPYmplY3QpKTtcblxuXHRfb2JqZWN0X25hbWUgPSB0YWJsZU5hbWUucmVwbGFjZShcImNyZWF0b3JfXCIsXCJcIilcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9vYmplY3RfbmFtZSwgc3BhY2VJZClcblxuXHRpZiBzcGFjZUlkXG5cdFx0X29iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRPYmplY3ROYW1lKF9vYmplY3QpXG5cblx0b2JqZWN0X2NvbGxlY2l0b24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oX29iamVjdF9uYW1lKVxuXG5cblx0X2ZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xuXHRpZiAhX2ZpZWxkcyB8fCAhb2JqZWN0X2NvbGxlY2l0b25cblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0cmVmZXJlbmNlX2ZpZWxkcyA9IF8uZmlsdGVyIF9maWVsZHMsIChmKS0+XG5cdFx0cmV0dXJuIF8uaXNGdW5jdGlvbihmLnJlZmVyZW5jZV90bykgfHwgIV8uaXNFbXB0eShmLnJlZmVyZW5jZV90bylcblxuXHRzZWxmID0gdGhpc1xuXG5cdHNlbGYudW5ibG9jaygpO1xuXG5cdGlmIHJlZmVyZW5jZV9maWVsZHMubGVuZ3RoID4gMFxuXHRcdGRhdGEgPSB7XG5cdFx0XHRmaW5kOiAoKS0+XG5cdFx0XHRcdHNlbGYudW5ibG9jaygpO1xuXHRcdFx0XHRmaWVsZF9rZXlzID0ge31cblx0XHRcdFx0Xy5lYWNoIF8ua2V5cyhmaWVsZHMpLCAoZiktPlxuXHRcdFx0XHRcdHVubGVzcyAvXFx3KyhcXC5cXCQpezF9XFx3Py8udGVzdChmKVxuXHRcdFx0XHRcdFx0ZmllbGRfa2V5c1tmXSA9IDFcblx0XHRcdFx0XG5cdFx0XHRcdHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtfaWQ6IHskaW46IGlkc319LCB7ZmllbGRzOiBmaWVsZF9rZXlzfSk7XG5cdFx0fVxuXG5cdFx0ZGF0YS5jaGlsZHJlbiA9IFtdXG5cblx0XHRrZXlzID0gXy5rZXlzKGZpZWxkcylcblxuXHRcdGlmIGtleXMubGVuZ3RoIDwgMVxuXHRcdFx0a2V5cyA9IF8ua2V5cyhfZmllbGRzKVxuXG5cdFx0X2tleXMgPSBbXVxuXG5cdFx0a2V5cy5mb3JFYWNoIChrZXkpLT5cblx0XHRcdGlmIF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ11cblx0XHRcdFx0X2tleXMgPSBfa2V5cy5jb25jYXQoXy5tYXAoX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXSwgKGspLT5cblx0XHRcdFx0XHRyZXR1cm4ga2V5ICsgJy4nICsga1xuXHRcdFx0XHQpKVxuXHRcdFx0X2tleXMucHVzaChrZXkpXG5cblx0XHRfa2V5cy5mb3JFYWNoIChrZXkpLT5cblx0XHRcdHJlZmVyZW5jZV9maWVsZCA9IF9maWVsZHNba2V5XVxuXG5cdFx0XHRpZiByZWZlcmVuY2VfZmllbGQgJiYgKF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pKSAgIyBhbmQgQ3JlYXRvci5Db2xsZWN0aW9uc1tyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvXVxuXHRcdFx0XHRkYXRhLmNoaWxkcmVuLnB1c2gge1xuXHRcdFx0XHRcdGZpbmQ6IChwYXJlbnQpIC0+XG5cdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0c2VsZi51bmJsb2NrKCk7XG5cblx0XHRcdFx0XHRcdFx0cXVlcnkgPSB7fVxuXG5cdFx0XHRcdFx0XHRcdCMg6KGo5qC85a2Q5a2X5q6154m55q6K5aSE55CGXG5cdFx0XHRcdFx0XHRcdGlmIC9cXHcrKFxcLlxcJFxcLil7MX1cXHcrLy50ZXN0KGtleSlcblx0XHRcdFx0XHRcdFx0XHRwX2sgPSBrZXkucmVwbGFjZSgvKFxcdyspXFwuXFwkXFwuXFx3Ky9pZywgXCIkMVwiKVxuXHRcdFx0XHRcdFx0XHRcdHNfayA9IGtleS5yZXBsYWNlKC9cXHcrXFwuXFwkXFwuKFxcdyspL2lnLCBcIiQxXCIpXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX2lkcyA9IHBhcmVudFtwX2tdLmdldFByb3BlcnR5KHNfaylcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV9pZHMgPSBrZXkuc3BsaXQoJy4nKS5yZWR1Y2UgKG8sIHgpIC0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG8/W3hdXG5cdFx0XHRcdFx0XHRcdFx0LCBwYXJlbnRcblxuXHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRcdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8oKVxuXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShyZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdFx0aWYgXy5pc09iamVjdChyZWZlcmVuY2VfaWRzKSAmJiAhXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpXG5cdFx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfaWRzLm9cblx0XHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV9pZHMgPSByZWZlcmVuY2VfaWRzLmlkcyB8fCBbXVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBbXVxuXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShyZWZlcmVuY2VfaWRzKVxuXHRcdFx0XHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHskaW46IHJlZmVyZW5jZV9pZHN9XG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRxdWVyeS5faWQgPSByZWZlcmVuY2VfaWRzXG5cblx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlZmVyZW5jZV90bywgc3BhY2VJZClcblxuXHRcdFx0XHRcdFx0XHRuYW1lX2ZpZWxkX2tleSA9IHJlZmVyZW5jZV90b19vYmplY3QuTkFNRV9GSUVMRF9LRVlcblxuXHRcdFx0XHRcdFx0XHRjaGlsZHJlbl9maWVsZHMgPSB7X2lkOiAxLCBzcGFjZTogMX1cblxuXHRcdFx0XHRcdFx0XHRpZiBuYW1lX2ZpZWxkX2tleVxuXHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuX2ZpZWxkc1tuYW1lX2ZpZWxkX2tleV0gPSAxXG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8sIHNwYWNlSWQpLmZpbmQocXVlcnksIHtcblx0XHRcdFx0XHRcdFx0XHRmaWVsZHM6IGNoaWxkcmVuX2ZpZWxkc1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGNhdGNoIGVcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2cocmVmZXJlbmNlX3RvLCBwYXJlbnQsIGUpXG5cdFx0XHRcdFx0XHRcdHJldHVybiBbXVxuXHRcdFx0XHR9XG5cblx0XHRyZXR1cm4gZGF0YVxuXHRlbHNlXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZpbmQ6ICgpLT5cblx0XHRcdFx0c2VsZi51bmJsb2NrKCk7XG5cdFx0XHRcdHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtfaWQ6IHskaW46IGlkc319LCB7ZmllbGRzOiBmaWVsZHN9KVxuXHRcdH07XG5cbiIsIk1ldGVvci5wdWJsaXNoQ29tcG9zaXRlKFwic3RlZWRvc19vYmplY3RfdGFidWxhclwiLCBmdW5jdGlvbih0YWJsZU5hbWUsIGlkcywgZmllbGRzLCBzcGFjZUlkKSB7XG4gIHZhciBfZmllbGRzLCBfa2V5cywgX29iamVjdCwgX29iamVjdF9uYW1lLCBkYXRhLCBrZXlzLCBvYmplY3RfY29sbGVjaXRvbiwgcmVmZXJlbmNlX2ZpZWxkcywgc2VsZjtcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgY2hlY2sodGFibGVOYW1lLCBTdHJpbmcpO1xuICBjaGVjayhpZHMsIEFycmF5KTtcbiAgY2hlY2soZmllbGRzLCBNYXRjaC5PcHRpb25hbChPYmplY3QpKTtcbiAgX29iamVjdF9uYW1lID0gdGFibGVOYW1lLnJlcGxhY2UoXCJjcmVhdG9yX1wiLCBcIlwiKTtcbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9vYmplY3RfbmFtZSwgc3BhY2VJZCk7XG4gIGlmIChzcGFjZUlkKSB7XG4gICAgX29iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRPYmplY3ROYW1lKF9vYmplY3QpO1xuICB9XG4gIG9iamVjdF9jb2xsZWNpdG9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKF9vYmplY3RfbmFtZSk7XG4gIF9maWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgaWYgKCFfZmllbGRzIHx8ICFvYmplY3RfY29sbGVjaXRvbikge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmVmZXJlbmNlX2ZpZWxkcyA9IF8uZmlsdGVyKF9maWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKGYucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KGYucmVmZXJlbmNlX3RvKTtcbiAgfSk7XG4gIHNlbGYgPSB0aGlzO1xuICBzZWxmLnVuYmxvY2soKTtcbiAgaWYgKHJlZmVyZW5jZV9maWVsZHMubGVuZ3RoID4gMCkge1xuICAgIGRhdGEgPSB7XG4gICAgICBmaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZpZWxkX2tleXM7XG4gICAgICAgIHNlbGYudW5ibG9jaygpO1xuICAgICAgICBmaWVsZF9rZXlzID0ge307XG4gICAgICAgIF8uZWFjaChfLmtleXMoZmllbGRzKSwgZnVuY3Rpb24oZikge1xuICAgICAgICAgIGlmICghL1xcdysoXFwuXFwkKXsxfVxcdz8vLnRlc3QoZikpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZF9rZXlzW2ZdID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb2JqZWN0X2NvbGxlY2l0b24uZmluZCh7XG4gICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAkaW46IGlkc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogZmllbGRfa2V5c1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGRhdGEuY2hpbGRyZW4gPSBbXTtcbiAgICBrZXlzID0gXy5rZXlzKGZpZWxkcyk7XG4gICAgaWYgKGtleXMubGVuZ3RoIDwgMSkge1xuICAgICAga2V5cyA9IF8ua2V5cyhfZmllbGRzKTtcbiAgICB9XG4gICAgX2tleXMgPSBbXTtcbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXSkge1xuICAgICAgICBfa2V5cyA9IF9rZXlzLmNvbmNhdChfLm1hcChfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddLCBmdW5jdGlvbihrKSB7XG4gICAgICAgICAgcmV0dXJuIGtleSArICcuJyArIGs7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfa2V5cy5wdXNoKGtleSk7XG4gICAgfSk7XG4gICAgX2tleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciByZWZlcmVuY2VfZmllbGQ7XG4gICAgICByZWZlcmVuY2VfZmllbGQgPSBfZmllbGRzW2tleV07XG4gICAgICBpZiAocmVmZXJlbmNlX2ZpZWxkICYmIChfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykgfHwgIV8uaXNFbXB0eShyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuY2hpbGRyZW4ucHVzaCh7XG4gICAgICAgICAgZmluZDogZnVuY3Rpb24ocGFyZW50KSB7XG4gICAgICAgICAgICB2YXIgY2hpbGRyZW5fZmllbGRzLCBlLCBuYW1lX2ZpZWxkX2tleSwgcF9rLCBxdWVyeSwgcmVmZXJlbmNlX2lkcywgcmVmZXJlbmNlX3RvLCByZWZlcmVuY2VfdG9fb2JqZWN0LCBzX2s7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBzZWxmLnVuYmxvY2soKTtcbiAgICAgICAgICAgICAgcXVlcnkgPSB7fTtcbiAgICAgICAgICAgICAgaWYgKC9cXHcrKFxcLlxcJFxcLil7MX1cXHcrLy50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICBwX2sgPSBrZXkucmVwbGFjZSgvKFxcdyspXFwuXFwkXFwuXFx3Ky9pZywgXCIkMVwiKTtcbiAgICAgICAgICAgICAgICBzX2sgPSBrZXkucmVwbGFjZSgvXFx3K1xcLlxcJFxcLihcXHcrKS9pZywgXCIkMVwiKTtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VfaWRzID0gcGFyZW50W3Bfa10uZ2V0UHJvcGVydHkoc19rKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VfaWRzID0ga2V5LnNwbGl0KCcuJykucmVkdWNlKGZ1bmN0aW9uKG8sIHgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBvICE9IG51bGwgPyBvW3hdIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgIH0sIHBhcmVudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKF8uaXNBcnJheShyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QocmVmZXJlbmNlX2lkcykgJiYgIV8uaXNBcnJheShyZWZlcmVuY2VfaWRzKSkge1xuICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX2lkcy5vO1xuICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlX2lkcyA9IHJlZmVyZW5jZV9pZHMuaWRzIHx8IFtdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChfLmlzQXJyYXkocmVmZXJlbmNlX2lkcykpIHtcbiAgICAgICAgICAgICAgICBxdWVyeS5faWQgPSB7XG4gICAgICAgICAgICAgICAgICAkaW46IHJlZmVyZW5jZV9pZHNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHF1ZXJ5Ll9pZCA9IHJlZmVyZW5jZV9pZHM7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlZmVyZW5jZV90bywgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIG5hbWVfZmllbGRfa2V5ID0gcmVmZXJlbmNlX3RvX29iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgICAgICAgICAgICAgY2hpbGRyZW5fZmllbGRzID0ge1xuICAgICAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgICAgICBzcGFjZTogMVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBpZiAobmFtZV9maWVsZF9rZXkpIHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbl9maWVsZHNbbmFtZV9maWVsZF9rZXldID0gMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZChxdWVyeSwge1xuICAgICAgICAgICAgICAgIGZpZWxkczogY2hpbGRyZW5fZmllbGRzXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZWZlcmVuY2VfdG8sIHBhcmVudCwgZSk7XG4gICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBmaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICAgIHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtcbiAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICRpbjogaWRzXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBmaWVsZHNcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufSk7XG4iLCJNZXRlb3IucHVibGlzaCBcIm9iamVjdF9saXN0dmlld3NcIiwgKG9iamVjdF9uYW1lLCBzcGFjZUlkKS0+XG4gICAgdXNlcklkID0gdGhpcy51c2VySWRcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNwYWNlOiBzcGFjZUlkICxcIiRvclwiOlt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XX0pIiwiTWV0ZW9yLnB1Ymxpc2ggXCJ1c2VyX3RhYnVsYXJfc2V0dGluZ3NcIiwgKG9iamVjdF9uYW1lKS0+XG4gICAgdXNlcklkID0gdGhpcy51c2VySWRcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kKHtvYmplY3RfbmFtZTogeyRpbjogb2JqZWN0X25hbWV9LCByZWNvcmRfaWQ6IHskaW46IFtcIm9iamVjdF9saXN0dmlld3NcIiwgXCJvYmplY3RfZ3JpZHZpZXdzXCJdfSwgb3duZXI6IHVzZXJJZH0pXG4iLCJNZXRlb3IucHVibGlzaCBcInJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzXCIsIChvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpLT5cblx0dXNlcklkID0gdGhpcy51c2VySWRcblx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJcblx0XHRzZWxlY3RvciA9IHtcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWR9XG5cdGVsc2Vcblx0XHRzZWxlY3RvciA9IHtzcGFjZTogc3BhY2VJZH1cblx0XG5cdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdCMg6ZmE5Lu255qE5YWz6IGU5pCc57Si5p2h5Lu25piv5a6a5q2755qEXG5cdFx0c2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lXG5cdFx0c2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF1cblx0ZWxzZVxuXHRcdHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWRcblxuXHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLmFsbG93UmVhZFxuXHRcdHNlbGVjdG9yLm93bmVyID0gdXNlcklkXG5cdFxuXHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpIiwiTWV0ZW9yLnB1Ymxpc2goXCJyZWxhdGVkX29iamVjdHNfcmVjb3Jkc1wiLCBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpIHtcbiAgdmFyIHBlcm1pc3Npb25zLCBzZWxlY3RvciwgdXNlcklkO1xuICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIikge1xuICAgIHNlbGVjdG9yID0ge1xuICAgICAgXCJtZXRhZGF0YS5zcGFjZVwiOiBzcGFjZUlkXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfTtcbiAgfVxuICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIikge1xuICAgIHNlbGVjdG9yW1wicGFyZW50Lm9cIl0gPSBvYmplY3RfbmFtZTtcbiAgICBzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXTtcbiAgfSBlbHNlIHtcbiAgICBzZWxlY3RvcltyZWxhdGVkX2ZpZWxkX25hbWVdID0gcmVjb3JkX2lkO1xuICB9XG4gIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLmFsbG93UmVhZCkge1xuICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICB9XG4gIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvcik7XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoICdzcGFjZV91c2VyX2luZm8nLCAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSkiLCJcbmlmIE1ldGVvci5pc1NlcnZlclxuXG5cdE1ldGVvci5wdWJsaXNoICdjb250YWN0c192aWV3X2xpbWl0cycsIChzcGFjZUlkKS0+XG5cblx0XHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRcdHVubGVzcyBzcGFjZUlkXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0XHRzZWxlY3RvciA9XG5cdFx0XHRzcGFjZTogc3BhY2VJZFxuXHRcdFx0a2V5OiAnY29udGFjdHNfdmlld19saW1pdHMnXG5cblx0XHRyZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3RvcikiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdjb250YWN0c192aWV3X2xpbWl0cycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAga2V5OiAnY29udGFjdHNfdmlld19saW1pdHMnXG4gICAgfTtcbiAgICByZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3Rvcik7XG4gIH0pO1xufVxuIiwiXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblxuXHRNZXRlb3IucHVibGlzaCAnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnLCAoc3BhY2VJZCktPlxuXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0XHR1bmxlc3Mgc3BhY2VJZFxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdFx0c2VsZWN0b3IgPVxuXHRcdFx0c3BhY2U6IHNwYWNlSWRcblx0XHRcdGtleTogJ2NvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzJ1xuXG5cdFx0cmV0dXJuIGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoc2VsZWN0b3IpIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIHNlbGVjdG9yO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIGtleTogJ2NvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzJ1xuICAgIH07XG4gICAgcmV0dXJuIGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoc2VsZWN0b3IpO1xuICB9KTtcbn1cbiIsImlmIE1ldGVvci5pc1NlcnZlclxuXHRNZXRlb3IucHVibGlzaCAnc3BhY2VfbmVlZF90b19jb25maXJtJywgKCktPlxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXG5cdFx0cmV0dXJuIGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHVzZXJJZCwgaW52aXRlX3N0YXRlOiBcInBlbmRpbmdcIn0pIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnc3BhY2VfbmVlZF90b19jb25maXJtJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBpbnZpdGVfc3RhdGU6IFwicGVuZGluZ1wiXG4gICAgfSk7XG4gIH0pO1xufVxuIiwicGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwgPSB7fVxuXG5wZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93UGVybWlzc2lvbnMgPSAoZmxvd19pZCwgdXNlcl9pZCkgLT5cblx0IyDmoLnmja46Zmxvd19pZOafpeWIsOWvueW6lOeahGZsb3dcblx0ZmxvdyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyhmbG93X2lkKVxuXHRzcGFjZV9pZCA9IGZsb3cuc3BhY2Vcblx0IyDmoLnmja5zcGFjZV9pZOWSjDp1c2VyX2lk5Yiwb3JnYW5pemF0aW9uc+ihqOS4reafpeWIsOeUqOaIt+aJgOWxnuaJgOacieeahG9yZ19pZO+8iOWMheaLrOS4iue6p+e7hElE77yJXG5cdG9yZ19pZHMgPSBuZXcgQXJyYXlcblx0b3JnYW5pemF0aW9ucyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG5cdFx0c3BhY2U6IHNwYWNlX2lkLCB1c2VyczogdXNlcl9pZCB9LCB7IGZpZWxkczogeyBwYXJlbnRzOiAxIH0gfSkuZmV0Y2goKVxuXHRfLmVhY2gob3JnYW5pemF0aW9ucywgKG9yZykgLT5cblx0XHRvcmdfaWRzLnB1c2gob3JnLl9pZClcblx0XHRpZiBvcmcucGFyZW50c1xuXHRcdFx0Xy5lYWNoKG9yZy5wYXJlbnRzLCAocGFyZW50X2lkKSAtPlxuXHRcdFx0XHRvcmdfaWRzLnB1c2gocGFyZW50X2lkKVxuXHRcdFx0KVxuXHQpXG5cdG9yZ19pZHMgPSBfLnVuaXEob3JnX2lkcylcblx0bXlfcGVybWlzc2lvbnMgPSBuZXcgQXJyYXlcblx0aWYgZmxvdy5wZXJtc1xuXHRcdCMg5Yik5patZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW7kuK3mmK/lkKbljIXlkKvlvZPliY3nlKjmiLfvvIxcblx0XHQjIOaIluiAhWZsb3cucGVybXMub3Jnc19jYW5fYWRk5piv5ZCm5YyF5ZCrNOatpeW+l+WIsOeahG9yZ19pZOaVsOe7hOS4reeahOS7u+S9leS4gOS4qu+8jFxuXHRcdCMg6Iul5piv77yM5YiZ5Zyo6L+U5Zue55qE5pWw57uE5Lit5Yqg5LiKYWRkXG5cdFx0aWYgZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRkXG5cdFx0XHR1c2Vyc19jYW5fYWRkID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRkXG5cdFx0XHRpZiB1c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJfaWQpXG5cdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJhZGRcIilcblxuXHRcdGlmIGZsb3cucGVybXMub3Jnc19jYW5fYWRkXG5cdFx0XHRvcmdzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZFxuXHRcdFx0Xy5lYWNoKG9yZ19pZHMsIChvcmdfaWQpIC0+XG5cdFx0XHRcdGlmIG9yZ3NfY2FuX2FkZC5pbmNsdWRlcyhvcmdfaWQpXG5cdFx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKVxuXHRcdFx0KVxuXHRcdCMg5Yik5patZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvcuS4reaYr+WQpuWMheWQq+W9k+WJjeeUqOaIt++8jFxuXHRcdCMg5oiW6ICFZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9y5piv5ZCm5YyF5ZCrNOatpeW+l+WIsOeahG9yZ19pZOaVsOe7hOS4reeahOS7u+S9leS4gOS4qu+8jFxuXHRcdCMg6Iul5piv77yM5YiZ5Zyo6L+U5Zue55qE5pWw57uE5Lit5Yqg5LiKbW9uaXRvclxuXHRcdGlmIGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3Jcblx0XHRcdHVzZXJzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvclxuXHRcdFx0aWYgdXNlcnNfY2FuX21vbml0b3IuaW5jbHVkZXModXNlcl9pZClcblx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIilcblxuXHRcdGlmIGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvclxuXHRcdFx0b3Jnc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvclxuXHRcdFx0Xy5lYWNoKG9yZ19pZHMsIChvcmdfaWQpIC0+XG5cdFx0XHRcdGlmIG9yZ3NfY2FuX21vbml0b3IuaW5jbHVkZXMob3JnX2lkKVxuXHRcdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJtb25pdG9yXCIpXG5cdFx0XHQpXG5cdFx0IyDliKTmlq1mbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbuS4reaYr+WQpuWMheWQq+W9k+WJjeeUqOaIt++8jFxuXHRcdCMg5oiW6ICFZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pbuaYr+WQpuWMheWQqzTmraXlvpfliLDnmoRvcmdfaWTmlbDnu4TkuK3nmoTku7vkvZXkuIDkuKrvvIxcblx0XHQjIOiLpeaYr++8jOWImeWcqOi/lOWbnueahOaVsOe7hOS4reWKoOS4imFkbWluXG5cdFx0aWYgZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW5cblx0XHRcdHVzZXJzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluXG5cdFx0XHRpZiB1c2Vyc19jYW5fYWRtaW4uaW5jbHVkZXModXNlcl9pZClcblx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkbWluXCIpXG5cblx0XHRpZiBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluXG5cdFx0XHRvcmdzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW5cblx0XHRcdF8uZWFjaChvcmdfaWRzLCAob3JnX2lkKSAtPlxuXHRcdFx0XHRpZiBvcmdzX2Nhbl9hZG1pbi5pbmNsdWRlcyhvcmdfaWQpXG5cdFx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkbWluXCIpXG5cdFx0XHQpXG5cblx0bXlfcGVybWlzc2lvbnMgPSBfLnVuaXEobXlfcGVybWlzc2lvbnMpXG5cdHJldHVybiBteV9wZXJtaXNzaW9ucyIsIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxucGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwgPSB7fTtcblxucGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rmxvd1Blcm1pc3Npb25zID0gZnVuY3Rpb24oZmxvd19pZCwgdXNlcl9pZCkge1xuICB2YXIgZmxvdywgbXlfcGVybWlzc2lvbnMsIG9yZ19pZHMsIG9yZ2FuaXphdGlvbnMsIG9yZ3NfY2FuX2FkZCwgb3Jnc19jYW5fYWRtaW4sIG9yZ3NfY2FuX21vbml0b3IsIHNwYWNlX2lkLCB1c2Vyc19jYW5fYWRkLCB1c2Vyc19jYW5fYWRtaW4sIHVzZXJzX2Nhbl9tb25pdG9yO1xuICBmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpO1xuICBzcGFjZV9pZCA9IGZsb3cuc3BhY2U7XG4gIG9yZ19pZHMgPSBuZXcgQXJyYXk7XG4gIG9yZ2FuaXphdGlvbnMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB1c2VyczogdXNlcl9pZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBwYXJlbnRzOiAxXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBfLmVhY2gob3JnYW5pemF0aW9ucywgZnVuY3Rpb24ob3JnKSB7XG4gICAgb3JnX2lkcy5wdXNoKG9yZy5faWQpO1xuICAgIGlmIChvcmcucGFyZW50cykge1xuICAgICAgcmV0dXJuIF8uZWFjaChvcmcucGFyZW50cywgZnVuY3Rpb24ocGFyZW50X2lkKSB7XG4gICAgICAgIHJldHVybiBvcmdfaWRzLnB1c2gocGFyZW50X2lkKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIG9yZ19pZHMgPSBfLnVuaXEob3JnX2lkcyk7XG4gIG15X3Blcm1pc3Npb25zID0gbmV3IEFycmF5O1xuICBpZiAoZmxvdy5wZXJtcykge1xuICAgIGlmIChmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGQpIHtcbiAgICAgIHVzZXJzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGQ7XG4gICAgICBpZiAodXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VyX2lkKSkge1xuICAgICAgICBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGQpIHtcbiAgICAgIG9yZ3NfY2FuX2FkZCA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRkO1xuICAgICAgXy5lYWNoKG9yZ19pZHMsIGZ1bmN0aW9uKG9yZ19pZCkge1xuICAgICAgICBpZiAob3Jnc19jYW5fYWRkLmluY2x1ZGVzKG9yZ19pZCkpIHtcbiAgICAgICAgICByZXR1cm4gbXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yKSB7XG4gICAgICB1c2Vyc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3I7XG4gICAgICBpZiAodXNlcnNfY2FuX21vbml0b3IuaW5jbHVkZXModXNlcl9pZCkpIHtcbiAgICAgICAgbXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3IpIHtcbiAgICAgIG9yZ3NfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3I7XG4gICAgICBfLmVhY2gob3JnX2lkcywgZnVuY3Rpb24ob3JnX2lkKSB7XG4gICAgICAgIGlmIChvcmdzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKG9yZ19pZCkpIHtcbiAgICAgICAgICByZXR1cm4gbXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW4pIHtcbiAgICAgIHVzZXJzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluO1xuICAgICAgaWYgKHVzZXJzX2Nhbl9hZG1pbi5pbmNsdWRlcyh1c2VyX2lkKSkge1xuICAgICAgICBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluKSB7XG4gICAgICBvcmdzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW47XG4gICAgICBfLmVhY2gob3JnX2lkcywgZnVuY3Rpb24ob3JnX2lkKSB7XG4gICAgICAgIGlmIChvcmdzX2Nhbl9hZG1pbi5pbmNsdWRlcyhvcmdfaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIG15X3Blcm1pc3Npb25zID0gXy51bmlxKG15X3Blcm1pc3Npb25zKTtcbiAgcmV0dXJuIG15X3Blcm1pc3Npb25zO1xufTtcbiIsIl9ldmFsID0gcmVxdWlyZSgnZXZhbCcpXG5vYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJyk7XG5cbmdldE9iamVjdENvbmZpZyA9IChvYmplY3RBcGlOYW1lKSAtPlxuXHRyZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLnRvQ29uZmlnKClcblxuZ2V0T2JqZWN0TmFtZUZpZWxkS2V5ID0gKG9iamVjdEFwaU5hbWUpIC0+XG5cdHJldHVybiBvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkuTkFNRV9GSUVMRF9LRVlcblxuZ2V0UmVsYXRlZHMgPSAob2JqZWN0QXBpTmFtZSkgLT5cblx0cmV0dXJuIE1ldGVvci53cmFwQXN5bmMoKG9iamVjdEFwaU5hbWUsIGNiKSAtPlxuXHRcdG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS5nZXRSZWxhdGVkcygpLnRoZW4gKHJlc29sdmUsIHJlamVjdCkgLT5cblx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcblx0XHQpKG9iamVjdEFwaU5hbWUpXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwgPSB7fVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24gPSAocmVxKSAtPlxuXHRxdWVyeSA9IHJlcS5xdWVyeVxuXHR1c2VySWQgPSBxdWVyeVtcIlgtVXNlci1JZFwiXVxuXHRhdXRoVG9rZW4gPSBxdWVyeVtcIlgtQXV0aC1Ub2tlblwiXVxuXG5cdGlmIG5vdCB1c2VySWQgb3Igbm90IGF1dGhUb2tlblxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXG5cdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcblx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG5cdFx0X2lkOiB1c2VySWQsXG5cdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cblxuXHRpZiBub3QgdXNlclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXG5cdHJldHVybiB1c2VyXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2UgPSAoc3BhY2VfaWQpIC0+XG5cdHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcblx0aWYgbm90IHNwYWNlXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJzcGFjZV9pZOacieivr+aIluatpHNwYWNl5bey57uP6KKr5Yig6ZmkXCIpXG5cdHJldHVybiBzcGFjZVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3cgPSAoZmxvd19pZCkgLT5cblx0ZmxvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZmxvd3MuZmluZE9uZShmbG93X2lkKVxuXHRpZiBub3QgZmxvd1xuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwiaWTmnInor6/miJbmraTmtYHnqIvlt7Lnu4/ooqvliKDpmaRcIilcblx0cmV0dXJuIGZsb3dcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXIgPSAoc3BhY2VfaWQsIHVzZXJfaWQpIC0+XG5cdHNwYWNlX3VzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlX3VzZXJzLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJfaWQgfSlcblx0aWYgbm90IHNwYWNlX3VzZXJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInVzZXJfaWTlr7nlupTnmoTnlKjmiLfkuI3lsZ7kuo7lvZPliY1zcGFjZVwiKVxuXHRyZXR1cm4gc3BhY2VfdXNlclxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8gPSAoc3BhY2VfdXNlcikgLT5cblx0aW5mbyA9IG5ldyBPYmplY3Rcblx0aW5mby5vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvblxuXHRvcmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9yZ2FuaXphdGlvbnMuZmluZE9uZShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbiwgeyBmaWVsZHM6IHsgbmFtZTogMSAsIGZ1bGxuYW1lOiAxIH0gfSlcblx0aW5mby5vcmdhbml6YXRpb25fbmFtZSA9IG9yZy5uYW1lXG5cdGluZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gb3JnLmZ1bGxuYW1lXG5cdHJldHVybiBpbmZvXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZCA9IChmbG93KSAtPlxuXHRpZiBmbG93LnN0YXRlIGlzbnQgXCJlbmFibGVkXCJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+acquWQr+eUqCzmk43kvZzlpLHotKVcIilcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQgPSAoZmxvdywgc3BhY2VfaWQpIC0+XG5cdGlmIGZsb3cuc3BhY2UgaXNudCBzcGFjZV9pZFxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5ZKM5bel5L2c5Yy6SUTkuI3ljLnphY1cIilcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtID0gKGZvcm1faWQpIC0+XG5cdGZvcm0gPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZvcm1zLmZpbmRPbmUoZm9ybV9pZClcblx0aWYgbm90IGZvcm1cblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn6KGo5Y2VSUTmnInor6/miJbmraTooajljZXlt7Lnu4/ooqvliKDpmaQnKVxuXG5cdHJldHVybiBmb3JtXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Q2F0ZWdvcnkgPSAoY2F0ZWdvcnlfaWQpIC0+XG5cdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLmNhdGVnb3JpZXMuZmluZE9uZShjYXRlZ29yeV9pZClcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja1N5bmNEaXJlY3Rpb24gPSAob2JqZWN0X25hbWUsIGZsb3dfaWQpIC0+XG5cdG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3Rfd29ya2Zsb3dzLmZpbmRPbmUoe1xuXHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcblx0XHRmbG93X2lkOiBmbG93X2lkXG5cdH0pXG5cdGlmICFvd1xuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsICfmnKrmib7liLDlr7nosaHmtYHnqIvmmKDlsITorrDlvZXjgIInKVxuXHRzeW5jRGlyZWN0aW9uID0gb3cuc3luY19kaXJlY3Rpb24gfHwgJ2JvdGgnXG5cdGlmICFbJ2JvdGgnLCAnb2JqX3RvX2lucyddLmluY2x1ZGVzKHN5bmNEaXJlY3Rpb24pXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+S4jeaUr+aMgeeahOWQjOatpeaWueWQkeOAgicpXG5cblx0cmV0dXJuIFxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNyZWF0ZV9pbnN0YW5jZSA9IChpbnN0YW5jZV9mcm9tX2NsaWVudCwgdXNlcl9pbmZvKSAtPlxuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSwgU3RyaW5nXG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0sIFN0cmluZ1xuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl0sIFN0cmluZ1xuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl0sIFt7bzogU3RyaW5nLCBpZHM6IFtTdHJpbmddfV1cblxuXHQjIOagoemqjOWQjOatpeaWueWQkVxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrU3luY0RpcmVjdGlvbihpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl1bMF0ubywgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdKVxuXG5cdCMg5qCh6aqM5piv5ZCmcmVjb3Jk5bey57uP5Y+R6LW355qE55Sz6K+36L+Y5Zyo5a6h5om55LitXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tJc0luQXBwcm92YWwoaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdWzBdLCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdKVxuXG5cdHNwYWNlX2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXVxuXHRmbG93X2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdXG5cdHVzZXJfaWQgPSB1c2VyX2luZm8uX2lkXG5cdCMg6I635Y+W5YmN5Y+w5omA5Lyg55qEdHJhY2Vcblx0dHJhY2VfZnJvbV9jbGllbnQgPSBudWxsXG5cdCMg6I635Y+W5YmN5Y+w5omA5Lyg55qEYXBwcm92ZVxuXHRhcHByb3ZlX2Zyb21fY2xpZW50ID0gbnVsbFxuXHRpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXSBhbmQgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1cblx0XHR0cmFjZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdXG5cdFx0aWYgdHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXSBhbmQgdHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXVswXVxuXHRcdFx0YXBwcm92ZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdW1wiYXBwcm92ZXNcIl1bMF1cblxuXHQjIOiOt+WPluS4gOS4qnNwYWNlXG5cdHNwYWNlID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZShzcGFjZV9pZClcblx0IyDojrflj5bkuIDkuKpmbG93XG5cdGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZClcblx0IyDojrflj5bkuIDkuKpzcGFjZeS4i+eahOS4gOS4qnVzZXJcblx0c3BhY2VfdXNlciA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyKHNwYWNlX2lkLCB1c2VyX2lkKVxuXHQjIOiOt+WPlnNwYWNlX3VzZXLmiYDlnKjnmoTpg6jpl6jkv6Hmga9cblx0c3BhY2VfdXNlcl9vcmdfaW5mbyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyhzcGFjZV91c2VyKVxuXHQjIOWIpOaWreS4gOS4qmZsb3fmmK/lkKbkuLrlkK/nlKjnirbmgIFcblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dFbmFibGVkKGZsb3cpXG5cdCMg5Yik5pat5LiA5LiqZmxvd+WSjHNwYWNlX2lk5piv5ZCm5Yy56YWNXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93U3BhY2VNYXRjaGVkKGZsb3csIHNwYWNlX2lkKVxuXG5cdGZvcm0gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZvcm0oZmxvdy5mb3JtKVxuXG5cdHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dfaWQsIHVzZXJfaWQpXG5cblx0aWYgbm90IHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRkXCIpXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLlvZPliY3nlKjmiLfmsqHmnInmraTmtYHnqIvnmoTmlrDlu7rmnYPpmZBcIilcblxuXHRub3cgPSBuZXcgRGF0ZVxuXHRpbnNfb2JqID0ge31cblx0aW5zX29iai5faWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5fbWFrZU5ld0lEKClcblx0aW5zX29iai5zcGFjZSA9IHNwYWNlX2lkXG5cdGluc19vYmouZmxvdyA9IGZsb3dfaWRcblx0aW5zX29iai5mbG93X3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuX2lkXG5cdGluc19vYmouZm9ybSA9IGZsb3cuZm9ybVxuXHRpbnNfb2JqLmZvcm1fdmVyc2lvbiA9IGZsb3cuY3VycmVudC5mb3JtX3ZlcnNpb25cblx0aW5zX29iai5uYW1lID0gZmxvdy5uYW1lXG5cdGluc19vYmouc3VibWl0dGVyID0gdXNlcl9pZFxuXHRpbnNfb2JqLnN1Ym1pdHRlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWVcblx0aW5zX29iai5hcHBsaWNhbnQgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIGVsc2UgdXNlcl9pZFxuXHRpbnNfb2JqLmFwcGxpY2FudF9uYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gZWxzZSB1c2VyX2luZm8ubmFtZVxuXHRpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb24gPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25cIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25cIl0gZWxzZSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvblxuXHRpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gZWxzZSBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9uYW1lXG5cdGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZVwiXSBlbHNlICBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZVxuXHRpbnNfb2JqLmFwcGxpY2FudF9jb21wYW55ID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfY29tcGFueVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gZWxzZSBzcGFjZV91c2VyLmNvbXBhbnlfaWRcblx0aW5zX29iai5zdGF0ZSA9ICdkcmFmdCdcblx0aW5zX29iai5jb2RlID0gJydcblx0aW5zX29iai5pc19hcmNoaXZlZCA9IGZhbHNlXG5cdGluc19vYmouaXNfZGVsZXRlZCA9IGZhbHNlXG5cdGluc19vYmouY3JlYXRlZCA9IG5vd1xuXHRpbnNfb2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkXG5cdGluc19vYmoubW9kaWZpZWQgPSBub3dcblx0aW5zX29iai5tb2RpZmllZF9ieSA9IHVzZXJfaWRcblxuXHRpbnNfb2JqLnJlY29yZF9pZHMgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl1cblxuXHRpZiBzcGFjZV91c2VyLmNvbXBhbnlfaWRcblx0XHRpbnNfb2JqLmNvbXBhbnlfaWQgPSBzcGFjZV91c2VyLmNvbXBhbnlfaWRcblxuXHQjIOaWsOW7ulRyYWNlXG5cdHRyYWNlX29iaiA9IHt9XG5cdHRyYWNlX29iai5faWQgPSBuZXcgTW9uZ28uT2JqZWN0SUQoKS5fc3RyXG5cdHRyYWNlX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkXG5cdHRyYWNlX29iai5pc19maW5pc2hlZCA9IGZhbHNlXG5cdCMg5b2T5YmN5pyA5paw54mIZmxvd+S4reW8gOWni+iKgueCuVxuXHRzdGFydF9zdGVwID0gXy5maW5kKGZsb3cuY3VycmVudC5zdGVwcywgKHN0ZXApIC0+XG5cdFx0cmV0dXJuIHN0ZXAuc3RlcF90eXBlIGlzICdzdGFydCdcblx0KVxuXHR0cmFjZV9vYmouc3RlcCA9IHN0YXJ0X3N0ZXAuX2lkXG5cdHRyYWNlX29iai5uYW1lID0gc3RhcnRfc3RlcC5uYW1lXG5cblx0dHJhY2Vfb2JqLnN0YXJ0X2RhdGUgPSBub3dcblx0IyDmlrDlu7pBcHByb3ZlXG5cdGFwcHJfb2JqID0ge31cblx0YXBwcl9vYmouX2lkID0gbmV3IE1vbmdvLk9iamVjdElEKCkuX3N0clxuXHRhcHByX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkXG5cdGFwcHJfb2JqLnRyYWNlID0gdHJhY2Vfb2JqLl9pZFxuXHRhcHByX29iai5pc19maW5pc2hlZCA9IGZhbHNlXG5cdGFwcHJfb2JqLnVzZXIgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIGVsc2UgdXNlcl9pZFxuXHRhcHByX29iai51c2VyX25hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSBlbHNlIHVzZXJfaW5mby5uYW1lXG5cdGFwcHJfb2JqLmhhbmRsZXIgPSB1c2VyX2lkXG5cdGFwcHJfb2JqLmhhbmRsZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lXG5cdGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb25cblx0YXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb25fbmFtZSA9IHNwYWNlX3VzZXJfb3JnX2luZm8ubmFtZVxuXHRhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IHNwYWNlX3VzZXJfb3JnX2luZm8uZnVsbG5hbWVcblx0YXBwcl9vYmoudHlwZSA9ICdkcmFmdCdcblx0YXBwcl9vYmouc3RhcnRfZGF0ZSA9IG5vd1xuXHRhcHByX29iai5yZWFkX2RhdGUgPSBub3dcblx0YXBwcl9vYmouaXNfcmVhZCA9IHRydWVcblx0YXBwcl9vYmouaXNfZXJyb3IgPSBmYWxzZVxuXHRhcHByX29iai5kZXNjcmlwdGlvbiA9ICcnXG5cdHJlbGF0ZWRUYWJsZXNJbmZvID0ge31cblx0YXBwcl9vYmoudmFsdWVzID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVZhbHVlcyhpbnNfb2JqLnJlY29yZF9pZHNbMF0sIGZsb3dfaWQsIHNwYWNlX2lkLCBmb3JtLmN1cnJlbnQuZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbylcblxuXHR0cmFjZV9vYmouYXBwcm92ZXMgPSBbYXBwcl9vYmpdXG5cdGluc19vYmoudHJhY2VzID0gW3RyYWNlX29ial1cblxuXHRpbnNfb2JqLnZhbHVlcyA9IGFwcHJfb2JqLnZhbHVlc1xuXG5cdGluc19vYmouaW5ib3hfdXNlcnMgPSBpbnN0YW5jZV9mcm9tX2NsaWVudC5pbmJveF91c2VycyB8fCBbXVxuXG5cdGluc19vYmouY3VycmVudF9zdGVwX25hbWUgPSBzdGFydF9zdGVwLm5hbWVcblxuXHRpZiBmbG93LmF1dG9fcmVtaW5kIGlzIHRydWVcblx0XHRpbnNfb2JqLmF1dG9fcmVtaW5kID0gdHJ1ZVxuXG5cdCMg5paw5bu655Sz6K+35Y2V5pe277yMaW5zdGFuY2Vz6K6w5b2V5rWB56iL5ZCN56ew44CB5rWB56iL5YiG57G75ZCN56ewICMxMzEzXG5cdGluc19vYmouZmxvd19uYW1lID0gZmxvdy5uYW1lXG5cdGlmIGZvcm0uY2F0ZWdvcnlcblx0XHRjYXRlZ29yeSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Q2F0ZWdvcnkoZm9ybS5jYXRlZ29yeSlcblx0XHRpZiBjYXRlZ29yeVxuXHRcdFx0aW5zX29iai5jYXRlZ29yeV9uYW1lID0gY2F0ZWdvcnkubmFtZVxuXHRcdFx0aW5zX29iai5jYXRlZ29yeSA9IGNhdGVnb3J5Ll9pZFxuXG5cdG5ld19pbnNfaWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5pbnNlcnQoaW5zX29iailcblxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvKGluc19vYmoucmVjb3JkX2lkc1swXSwgbmV3X2luc19pZCwgc3BhY2VfaWQpXG5cblx0IyB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyhyZWxhdGVkVGFibGVzSW5mbywgbmV3X2luc19pZCwgc3BhY2VfaWQpXG5cblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZUF0dGFjaChpbnNfb2JqLnJlY29yZF9pZHNbMF0sIHNwYWNlX2lkLCBpbnNfb2JqLl9pZCwgYXBwcl9vYmouX2lkKVxuXG5cdHJldHVybiBuZXdfaW5zX2lkXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMgPSAocmVjb3JkSWRzLCBmbG93SWQsIHNwYWNlSWQsIGZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pIC0+XG5cdGZpZWxkQ29kZXMgPSBbXVxuXHRfLmVhY2ggZmllbGRzLCAoZikgLT5cblx0XHRpZiBmLnR5cGUgPT0gJ3NlY3Rpb24nXG5cdFx0XHRfLmVhY2ggZi5maWVsZHMsIChmZikgLT5cblx0XHRcdFx0ZmllbGRDb2Rlcy5wdXNoIGZmLmNvZGVcblx0XHRlbHNlXG5cdFx0XHRmaWVsZENvZGVzLnB1c2ggZi5jb2RlXG5cblx0dmFsdWVzID0ge31cblx0b2JqZWN0TmFtZSA9IHJlY29yZElkcy5vXG5cdG9iamVjdCA9IGdldE9iamVjdENvbmZpZyhvYmplY3ROYW1lKVxuXHRyZWNvcmRJZCA9IHJlY29yZElkcy5pZHNbMF1cblx0b3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XG5cdFx0b2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXG5cdFx0Zmxvd19pZDogZmxvd0lkXG5cdH0pXG5cdHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKHJlY29yZElkKVxuXHRmbG93ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoZmxvd0lkLCB7IGZpZWxkczogeyBmb3JtOiAxIH0gfSlcblx0aWYgb3cgYW5kIHJlY29yZFxuXHRcdGZvcm0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJmb3Jtc1wiKS5maW5kT25lKGZsb3cuZm9ybSlcblx0XHRmb3JtRmllbGRzID0gZm9ybS5jdXJyZW50LmZpZWxkcyB8fCBbXVxuXHRcdHJlbGF0ZWRPYmplY3RzID0gZ2V0UmVsYXRlZHMob2JqZWN0TmFtZSlcblx0XHRyZWxhdGVkT2JqZWN0c0tleXMgPSBfLnBsdWNrKHJlbGF0ZWRPYmplY3RzLCAnb2JqZWN0X25hbWUnKVxuXHRcdGZvcm1UYWJsZUZpZWxkcyA9IF8uZmlsdGVyIGZvcm1GaWVsZHMsIChmb3JtRmllbGQpIC0+XG5cdFx0XHRyZXR1cm4gZm9ybUZpZWxkLnR5cGUgPT0gJ3RhYmxlJ1xuXHRcdGZvcm1UYWJsZUZpZWxkc0NvZGUgPSBfLnBsdWNrKGZvcm1UYWJsZUZpZWxkcywgJ2NvZGUnKVxuXG5cdFx0Z2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSA9ICAoa2V5KSAtPlxuXHRcdFx0cmV0dXJuIF8uZmluZCByZWxhdGVkT2JqZWN0c0tleXMsICAocmVsYXRlZE9iamVjdHNLZXkpIC0+XG5cdFx0XHRcdHJldHVybiBrZXkuc3RhcnRzV2l0aChyZWxhdGVkT2JqZWN0c0tleSArICcuJylcblxuXHRcdGdldEZvcm1UYWJsZUZpZWxkQ29kZSA9IChrZXkpIC0+XG5cdFx0XHRyZXR1cm4gXy5maW5kIGZvcm1UYWJsZUZpZWxkc0NvZGUsICAoZm9ybVRhYmxlRmllbGRDb2RlKSAtPlxuXHRcdFx0XHRyZXR1cm4ga2V5LnN0YXJ0c1dpdGgoZm9ybVRhYmxlRmllbGRDb2RlICsgJy4nKVxuXG5cdFx0Z2V0Rm9ybVRhYmxlRmllbGQgPSAoa2V5KSAtPlxuXHRcdFx0cmV0dXJuIF8uZmluZCBmb3JtVGFibGVGaWVsZHMsICAoZikgLT5cblx0XHRcdFx0cmV0dXJuIGYuY29kZSA9PSBrZXlcblxuXHRcdGdldEZvcm1GaWVsZCA9IChrZXkpIC0+XG5cdFx0XHRmZiA9IG51bGxcblx0XHRcdF8uZm9yRWFjaCBmb3JtRmllbGRzLCAoZikgLT5cblx0XHRcdFx0aWYgZmZcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0aWYgZi50eXBlID09ICdzZWN0aW9uJ1xuXHRcdFx0XHRcdGZmID0gXy5maW5kIGYuZmllbGRzLCAgKHNmKSAtPlxuXHRcdFx0XHRcdFx0cmV0dXJuIHNmLmNvZGUgPT0ga2V5XG5cdFx0XHRcdGVsc2UgaWYgZi5jb2RlID09IGtleVxuXHRcdFx0XHRcdGZmID0gZlxuXG5cdFx0XHRyZXR1cm4gZmZcblxuXHRcdGdldEZvcm1UYWJsZVN1YkZpZWxkID0gKHRhYmxlRmllbGQsIHN1YkZpZWxkQ29kZSkgLT5cblx0XHRcdHJldHVybiBfLmZpbmQgdGFibGVGaWVsZC5maWVsZHMsICAoZikgLT5cblx0XHRcdFx0cmV0dXJuIGYuY29kZSA9PSBzdWJGaWVsZENvZGVcblxuXHRcdGdldEZpZWxkT2RhdGFWYWx1ZSA9IChvYmpOYW1lLCBpZCkgLT5cblx0XHRcdG9iaiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKVxuXHRcdFx0bmFtZUtleSA9IGdldE9iamVjdE5hbWVGaWVsZEtleShvYmpOYW1lKVxuXHRcdFx0aWYgIW9ialxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIF8uaXNTdHJpbmcgaWRcblx0XHRcdFx0X3JlY29yZCA9IG9iai5maW5kT25lKGlkKVxuXHRcdFx0XHRpZiBfcmVjb3JkXG5cdFx0XHRcdFx0X3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkW25hbWVLZXldXG5cdFx0XHRcdFx0cmV0dXJuIF9yZWNvcmRcblx0XHRcdGVsc2UgaWYgXy5pc0FycmF5IGlkXG5cdFx0XHRcdF9yZWNvcmRzID0gW11cblx0XHRcdFx0b2JqLmZpbmQoeyBfaWQ6IHsgJGluOiBpZCB9IH0pLmZvckVhY2ggKF9yZWNvcmQpIC0+XG5cdFx0XHRcdFx0X3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkW25hbWVLZXldXG5cdFx0XHRcdFx0X3JlY29yZHMucHVzaCBfcmVjb3JkXG5cblx0XHRcdFx0aWYgIV8uaXNFbXB0eSBfcmVjb3Jkc1xuXHRcdFx0XHRcdHJldHVybiBfcmVjb3Jkc1xuXHRcdFx0cmV0dXJuXG5cblx0XHRnZXRTZWxlY3RVc2VyVmFsdWUgPSAodXNlcklkLCBzcGFjZUlkKSAtPlxuXHRcdFx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSlcblx0XHRcdHN1LmlkID0gdXNlcklkXG5cdFx0XHRyZXR1cm4gc3VcblxuXHRcdGdldFNlbGVjdFVzZXJWYWx1ZXMgPSAodXNlcklkcywgc3BhY2VJZCkgLT5cblx0XHRcdHN1cyA9IFtdXG5cdFx0XHRpZiBfLmlzQXJyYXkgdXNlcklkc1xuXHRcdFx0XHRfLmVhY2ggdXNlcklkcywgKHVzZXJJZCkgLT5cblx0XHRcdFx0XHRzdSA9IGdldFNlbGVjdFVzZXJWYWx1ZSh1c2VySWQsIHNwYWNlSWQpXG5cdFx0XHRcdFx0aWYgc3Vcblx0XHRcdFx0XHRcdHN1cy5wdXNoKHN1KVxuXHRcdFx0cmV0dXJuIHN1c1xuXG5cdFx0Z2V0U2VsZWN0T3JnVmFsdWUgPSAob3JnSWQsIHNwYWNlSWQpIC0+XG5cdFx0XHRvcmcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kT25lKG9yZ0lkLCB7IGZpZWxkczogeyBfaWQ6IDEsIG5hbWU6IDEsIGZ1bGxuYW1lOiAxIH0gfSlcblx0XHRcdG9yZy5pZCA9IG9yZ0lkXG5cdFx0XHRyZXR1cm4gb3JnXG5cblx0XHRnZXRTZWxlY3RPcmdWYWx1ZXMgPSAob3JnSWRzLCBzcGFjZUlkKSAtPlxuXHRcdFx0b3JncyA9IFtdXG5cdFx0XHRpZiBfLmlzQXJyYXkgb3JnSWRzXG5cdFx0XHRcdF8uZWFjaCBvcmdJZHMsIChvcmdJZCkgLT5cblx0XHRcdFx0XHRvcmcgPSBnZXRTZWxlY3RPcmdWYWx1ZShvcmdJZCwgc3BhY2VJZClcblx0XHRcdFx0XHRpZiBvcmdcblx0XHRcdFx0XHRcdG9yZ3MucHVzaChvcmcpXG5cdFx0XHRyZXR1cm4gb3Jnc1xuXG5cdFx0dGFibGVGaWVsZENvZGVzID0gW11cblx0XHR0YWJsZUZpZWxkTWFwID0gW11cblx0XHR0YWJsZVRvUmVsYXRlZE1hcCA9IHt9XG5cblx0XHRvdy5maWVsZF9tYXA/LmZvckVhY2ggKGZtKSAtPlxuXHRcdFx0b2JqZWN0X2ZpZWxkID0gZm0ub2JqZWN0X2ZpZWxkXG5cdFx0XHR3b3JrZmxvd19maWVsZCA9IGZtLndvcmtmbG93X2ZpZWxkXG5cdFx0XHRpZiAhb2JqZWN0X2ZpZWxkIHx8ICF3b3JrZmxvd19maWVsZFxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ+acquaJvuWIsOWtl+aute+8jOivt+ajgOafpeWvueixoea1geeoi+aYoOWwhOWtl+autemFjee9ricpXG5cdFx0XHRyZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZShvYmplY3RfZmllbGQpXG5cdFx0XHRmb3JtVGFibGVGaWVsZENvZGUgPSBnZXRGb3JtVGFibGVGaWVsZENvZGUod29ya2Zsb3dfZmllbGQpXG5cdFx0XHRvYmpGaWVsZCA9IG9iamVjdC5maWVsZHNbb2JqZWN0X2ZpZWxkXVxuXHRcdFx0Zm9ybUZpZWxkID0gZ2V0Rm9ybUZpZWxkKHdvcmtmbG93X2ZpZWxkKVxuXHRcdFx0IyDlpITnkIblrZDooajlrZfmrrVcblx0XHRcdGlmIHJlbGF0ZWRPYmplY3RGaWVsZENvZGVcblx0XHRcdFx0XG5cdFx0XHRcdG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXVxuXHRcdFx0XHRvVGFibGVGaWVsZENvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXVxuXHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcEtleSA9IG9UYWJsZUNvZGVcblx0XHRcdFx0aWYgIXRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVxuXHRcdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSA9IHt9XG5cblx0XHRcdFx0aWYgZm9ybVRhYmxlRmllbGRDb2RlXG5cdFx0XHRcdFx0d1RhYmxlQ29kZSA9IHdvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMF1cblx0XHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bJ19GUk9NX1RBQkxFX0NPREUnXSA9IHdUYWJsZUNvZGVcblxuXHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bb1RhYmxlRmllbGRDb2RlXSA9IHdvcmtmbG93X2ZpZWxkXG5cdFx0XHQjIOWIpOaWreaYr+WQpuaYr+ihqOagvOWtl+autVxuXHRcdFx0ZWxzZSBpZiB3b3JrZmxvd19maWVsZC5pbmRleE9mKCcuJykgPiAwIGFuZCBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPiAwXG5cdFx0XHRcdHdUYWJsZUNvZGUgPSB3b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdXG5cdFx0XHRcdG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzBdXG5cdFx0XHRcdGlmIHJlY29yZC5oYXNPd25Qcm9wZXJ0eShvVGFibGVDb2RlKSBhbmQgXy5pc0FycmF5KHJlY29yZFtvVGFibGVDb2RlXSlcblx0XHRcdFx0XHR0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XG5cdFx0XHRcdFx0XHR3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxuXHRcdFx0XHRcdFx0b2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcblx0XHRcdFx0XHR9KSlcblx0XHRcdFx0XHR0YWJsZUZpZWxkTWFwLnB1c2goZm0pXG5cdFx0XHRcdGVsc2UgaWYgb1RhYmxlQ29kZS5pbmRleE9mKCcuJykgPiAwICMg6K+05piO5piv5YWz6IGU6KGo55qEZ3JpZOWtl+autVxuXHRcdFx0XHRcdG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZENvZGUgPSBvVGFibGVDb2RlLnNwbGl0KCcuJylbMF07XG5cdFx0XHRcdFx0Z3JpZENvZGUgPSBvVGFibGVDb2RlLnNwbGl0KCcuJylbMV07XG5cdFx0XHRcdFx0b1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkID0gb2JqZWN0LmZpZWxkc1tvVGFibGVDb2RlUmVmZXJlbmNlRmllbGRDb2RlXTtcblx0XHRcdFx0XHRpZiBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRpZiByZWNvcmRbb1RhYmxlQ29kZV1cblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnJlZmVyZW5jZV90bztcblx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQubmFtZV07XG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0RvYyA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSk7XG5cdFx0XHRcdFx0XHRpZiByZWZlcmVuY2VUb0RvY1tncmlkQ29kZV1cblx0XHRcdFx0XHRcdFx0cmVjb3JkW29UYWJsZUNvZGVdID0gcmVmZXJlbmNlVG9Eb2NbZ3JpZENvZGVdO1xuXHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XG5cdFx0XHRcdFx0XHRcdFx0d29ya2Zsb3dfdGFibGVfZmllbGRfY29kZTogd1RhYmxlQ29kZSxcblx0XHRcdFx0XHRcdFx0XHRvYmplY3RfdGFibGVfZmllbGRfY29kZTogb1RhYmxlQ29kZVxuXHRcdFx0XHRcdFx0XHR9KSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0YWJsZUZpZWxkTWFwLnB1c2goZm0pO1xuXG5cdFx0XHQjIOWkhOeQhmxvb2t1cOOAgW1hc3Rlcl9kZXRhaWznsbvlnovlrZfmrrVcblx0XHRcdGVsc2UgaWYgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4nKSA+IDAgYW5kIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA9PSAtMVxuXHRcdFx0XHRvYmplY3RGaWVsZE5hbWUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXVxuXHRcdFx0XHRsb29rdXBGaWVsZE5hbWUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXVxuXHRcdFx0XHRpZiBvYmplY3Rcblx0XHRcdFx0XHRvYmplY3RGaWVsZCA9IG9iamVjdC5maWVsZHNbb2JqZWN0RmllbGROYW1lXVxuXHRcdFx0XHRcdGlmIG9iamVjdEZpZWxkICYmIGZvcm1GaWVsZCAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqZWN0RmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRmaWVsZHNPYmogPSB7fVxuXHRcdFx0XHRcdFx0ZmllbGRzT2JqW2xvb2t1cEZpZWxkTmFtZV0gPSAxXG5cdFx0XHRcdFx0XHRsb29rdXBPYmplY3RSZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kT25lKHJlY29yZFtvYmplY3RGaWVsZE5hbWVdLCB7IGZpZWxkczogZmllbGRzT2JqIH0pXG5cdFx0XHRcdFx0XHRvYmplY3RGaWVsZE9iamVjdE5hbWUgPSBvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0XHRcdGxvb2t1cEZpZWxkT2JqID0gZ2V0T2JqZWN0Q29uZmlnKG9iamVjdEZpZWxkT2JqZWN0TmFtZSlcblx0XHRcdFx0XHRcdG9iamVjdExvb2t1cEZpZWxkID0gbG9va3VwRmllbGRPYmouZmllbGRzW2xvb2t1cEZpZWxkTmFtZV1cblx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IGxvb2t1cE9iamVjdFJlY29yZFtsb29rdXBGaWVsZE5hbWVdXG5cdFx0XHRcdFx0XHRpZiBvYmplY3RMb29rdXBGaWVsZCAmJiBmb3JtRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqZWN0TG9va3VwRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWVcblx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmICFvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gb2RhdGFGaWVsZFZhbHVlXG5cdFx0XHRcdFx0XHRlbHNlIGlmIG9iamVjdExvb2t1cEZpZWxkICYmIGZvcm1GaWVsZCAmJiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iamVjdExvb2t1cEZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0aWYgIV8uaXNFbXB0eShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0bG9va3VwU2VsZWN0RmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0XHRcdGlmIGZvcm1GaWVsZC50eXBlID09ICd1c2VyJ1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIW9iamVjdExvb2t1cEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQudHlwZSA9PSAnZ3JvdXAnXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmICFvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdFx0aWYgbG9va3VwU2VsZWN0RmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IGxvb2t1cFNlbGVjdEZpZWxkVmFsdWVcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IGxvb2t1cE9iamVjdFJlY29yZFtsb29rdXBGaWVsZE5hbWVdXG5cblx0XHRcdCMgbG9va3Vw44CBbWFzdGVyX2RldGFpbOWtl+auteWQjOatpeWIsG9kYXRh5a2X5q61XG5cdFx0XHRlbHNlIGlmIGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iakZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqRmllbGQucmVmZXJlbmNlX3RvXG5cdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvYmpGaWVsZC5uYW1lXVxuXHRcdFx0XHRvZGF0YUZpZWxkVmFsdWVcblx0XHRcdFx0aWYgb2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRlbHNlIGlmICFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gb2RhdGFGaWVsZFZhbHVlXG5cdFx0XHRlbHNlIGlmIGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iakZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKG9iakZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdXG5cdFx0XHRcdGlmICFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWVcblx0XHRcdFx0XHRpZiBmb3JtRmllbGQudHlwZSA9PSAndXNlcidcblx0XHRcdFx0XHRcdGlmIG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRlbHNlIGlmICFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkLnR5cGUgPT0gJ2dyb3VwJ1xuXHRcdFx0XHRcdFx0aWYgb2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAhb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdGlmIHNlbGVjdEZpZWxkVmFsdWVcblx0XHRcdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBzZWxlY3RGaWVsZFZhbHVlXG5cdFx0XHRlbHNlIGlmIHJlY29yZC5oYXNPd25Qcm9wZXJ0eShvYmplY3RfZmllbGQpXG5cdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSByZWNvcmRbb2JqZWN0X2ZpZWxkXVxuXG5cdFx0IyDooajmoLzlrZfmrrVcblx0XHRfLnVuaXEodGFibGVGaWVsZENvZGVzKS5mb3JFYWNoICh0ZmMpIC0+XG5cdFx0XHRjID0gSlNPTi5wYXJzZSh0ZmMpXG5cdFx0XHR2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXSA9IFtdXG5cdFx0XHRyZWNvcmRbYy5vYmplY3RfdGFibGVfZmllbGRfY29kZV0uZm9yRWFjaCAodHIpIC0+XG5cdFx0XHRcdG5ld1RyID0ge31cblx0XHRcdFx0Xy5lYWNoIHRyLCAodiwgaykgLT5cblx0XHRcdFx0XHR0YWJsZUZpZWxkTWFwLmZvckVhY2ggKHRmbSkgLT5cblx0XHRcdFx0XHRcdGlmIHRmbS5vYmplY3RfZmllbGQgaXMgKGMub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGUgKyAnLiQuJyArIGspXG5cdFx0XHRcdFx0XHRcdHdUZENvZGUgPSB0Zm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVsxXVxuXHRcdFx0XHRcdFx0XHRuZXdUclt3VGRDb2RlXSA9IHZcblx0XHRcdFx0aWYgbm90IF8uaXNFbXB0eShuZXdUcilcblx0XHRcdFx0XHR2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXS5wdXNoKG5ld1RyKVxuXG5cdFx0IyDlkIzmraXlrZDooajmlbDmja7oh7PooajljZXooajmoLxcblx0XHRfLmVhY2ggdGFibGVUb1JlbGF0ZWRNYXAsICAobWFwLCBrZXkpIC0+XG5cdFx0XHR0YWJsZUNvZGUgPSBtYXAuX0ZST01fVEFCTEVfQ09ERVxuXHRcdFx0Zm9ybVRhYmxlRmllbGQgPSBnZXRGb3JtVGFibGVGaWVsZCh0YWJsZUNvZGUpXG5cdFx0XHRpZiAhdGFibGVDb2RlXG5cdFx0XHRcdGNvbnNvbGUud2FybigndGFibGVUb1JlbGF0ZWQ6IFsnICsga2V5ICsgJ10gbWlzc2luZyBjb3JyZXNwb25kaW5nIHRhYmxlLicpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3ROYW1lID0ga2V5XG5cdFx0XHRcdHRhYmxlVmFsdWVzID0gW11cblx0XHRcdFx0cmVsYXRlZFRhYmxlSXRlbXMgPSBbXVxuXHRcdFx0XHRyZWxhdGVkT2JqZWN0ID0gZ2V0T2JqZWN0Q29uZmlnKHJlbGF0ZWRPYmplY3ROYW1lKVxuXHRcdFx0XHRyZWxhdGVkRmllbGQgPSBfLmZpbmQgcmVsYXRlZE9iamVjdC5maWVsZHMsIChmKSAtPlxuXHRcdFx0XHRcdHJldHVybiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMoZi50eXBlKSAmJiBmLnJlZmVyZW5jZV90byA9PSBvYmplY3ROYW1lXG5cblx0XHRcdFx0cmVsYXRlZEZpZWxkTmFtZSA9IHJlbGF0ZWRGaWVsZC5uYW1lXG5cblx0XHRcdFx0c2VsZWN0b3IgPSB7fVxuXHRcdFx0XHRzZWxlY3RvcltyZWxhdGVkRmllbGROYW1lXSA9IHJlY29yZElkXG5cdFx0XHRcdHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKVxuXHRcdFx0XHRyZWxhdGVkUmVjb3JkcyA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpXG5cblx0XHRcdFx0cmVsYXRlZFJlY29yZHMuZm9yRWFjaCAocnIpIC0+XG5cdFx0XHRcdFx0dGFibGVWYWx1ZUl0ZW0gPSB7fVxuXHRcdFx0XHRcdF8uZWFjaCBtYXAsICh2YWx1ZUtleSwgZmllbGRLZXkpIC0+XG5cdFx0XHRcdFx0XHRpZiBmaWVsZEtleSAhPSAnX0ZST01fVEFCTEVfQ09ERSdcblx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlXG5cdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleVxuXHRcdFx0XHRcdFx0XHRpZiB2YWx1ZUtleS5zdGFydHNXaXRoKHRhYmxlQ29kZSArICcuJylcblx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXkgPSAodmFsdWVLZXkuc3BsaXQoXCIuXCIpWzFdKVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkS2V5ID0gdmFsdWVLZXlcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGZvcm1GaWVsZCA9IGdldEZvcm1UYWJsZVN1YkZpZWxkKGZvcm1UYWJsZUZpZWxkLCBmb3JtRmllbGRLZXkpXG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZCA9IHJlbGF0ZWRPYmplY3QuZmllbGRzW2ZpZWxkS2V5XVxuXHRcdFx0XHRcdFx0XHRpZiAhZm9ybUZpZWxkIHx8ICFyZWxhdGVkT2JqZWN0RmllbGRcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRcdFx0aWYgZm9ybUZpZWxkLnR5cGUgPT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb09iamVjdE5hbWUgPSByZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcnJbZmllbGRLZXldXG5cdFx0XHRcdFx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV1cblx0XHRcdFx0XHRcdFx0XHRpZiAhXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGZvcm1GaWVsZC50eXBlID09ICd1c2VyJ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkLnR5cGUgPT0gJ2dyb3VwJ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBycltmaWVsZEtleV1cblx0XHRcdFx0XHRcdFx0dGFibGVWYWx1ZUl0ZW1bZm9ybUZpZWxkS2V5XSA9IHRhYmxlRmllbGRWYWx1ZVxuXHRcdFx0XHRcdGlmICFfLmlzRW1wdHkodGFibGVWYWx1ZUl0ZW0pXG5cdFx0XHRcdFx0XHR0YWJsZVZhbHVlSXRlbS5faWQgPSByci5faWRcblx0XHRcdFx0XHRcdHRhYmxlVmFsdWVzLnB1c2godGFibGVWYWx1ZUl0ZW0pXG5cdFx0XHRcdFx0XHRyZWxhdGVkVGFibGVJdGVtcy5wdXNoKHsgX3RhYmxlOiB7IF9pZDogcnIuX2lkLCBfY29kZTogdGFibGVDb2RlIH0gfSApXG5cblx0XHRcdFx0dmFsdWVzW3RhYmxlQ29kZV0gPSB0YWJsZVZhbHVlc1xuXHRcdFx0XHRyZWxhdGVkVGFibGVzSW5mb1tyZWxhdGVkT2JqZWN0TmFtZV0gPSByZWxhdGVkVGFibGVJdGVtc1xuXG5cdFx0IyDlpoLmnpzphY3nva7kuobohJrmnKzliJnmiafooYzohJrmnKxcblx0XHRpZiBvdy5maWVsZF9tYXBfc2NyaXB0XG5cdFx0XHRfLmV4dGVuZCh2YWx1ZXMsIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0KG93LmZpZWxkX21hcF9zY3JpcHQsIG9iamVjdE5hbWUsIHNwYWNlSWQsIHJlY29yZElkKSlcblxuXHQjIOi/h+a7pOaOiXZhbHVlc+S4reeahOmdnuazlWtleVxuXHRmaWx0ZXJWYWx1ZXMgPSB7fVxuXHRfLmVhY2ggXy5rZXlzKHZhbHVlcyksIChrKSAtPlxuXHRcdGlmIGZpZWxkQ29kZXMuaW5jbHVkZXMoaylcblx0XHRcdGZpbHRlclZhbHVlc1trXSA9IHZhbHVlc1trXVxuXG5cdHJldHVybiBmaWx0ZXJWYWx1ZXNcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5ldmFsRmllbGRNYXBTY3JpcHQgPSAoZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgb2JqZWN0SWQpIC0+XG5cdHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKG9iamVjdElkKVxuXHRzY3JpcHQgPSBcIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJlY29yZCkgeyBcIiArIGZpZWxkX21hcF9zY3JpcHQgKyBcIiB9XCJcblx0ZnVuYyA9IF9ldmFsKHNjcmlwdCwgXCJmaWVsZF9tYXBfc2NyaXB0XCIpXG5cdHZhbHVlcyA9IGZ1bmMocmVjb3JkKVxuXHRpZiBfLmlzT2JqZWN0IHZhbHVlc1xuXHRcdHJldHVybiB2YWx1ZXNcblx0ZWxzZVxuXHRcdGNvbnNvbGUuZXJyb3IgXCJldmFsRmllbGRNYXBTY3JpcHQ6IOiEmuacrOi/lOWbnuWAvOexu+Wei+S4jeaYr+WvueixoVwiXG5cdHJldHVybiB7fVxuXG5cblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZUF0dGFjaCA9IChyZWNvcmRJZHMsIHNwYWNlSWQsIGluc0lkLCBhcHByb3ZlSWQpIC0+XG5cblx0Q3JlYXRvci5Db2xsZWN0aW9uc1snY21zX2ZpbGVzJ10uZmluZCh7XG5cdFx0c3BhY2U6IHNwYWNlSWQsXG5cdFx0cGFyZW50OiByZWNvcmRJZHNcblx0fSkuZm9yRWFjaCAoY2YpIC0+XG5cdFx0Xy5lYWNoIGNmLnZlcnNpb25zLCAodmVyc2lvbklkLCBpZHgpIC0+XG5cdFx0XHRmID0gQ3JlYXRvci5Db2xsZWN0aW9uc1snY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXS5maW5kT25lKHZlcnNpb25JZClcblx0XHRcdG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpXG5cblx0XHRcdG5ld0ZpbGUuYXR0YWNoRGF0YSBmLmNyZWF0ZVJlYWRTdHJlYW0oJ2ZpbGVzJyksIHtcblx0XHRcdFx0XHR0eXBlOiBmLm9yaWdpbmFsLnR5cGVcblx0XHRcdH0sIChlcnIpIC0+XG5cdFx0XHRcdGlmIChlcnIpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnIuZXJyb3IsIGVyci5yZWFzb24pXG5cblx0XHRcdFx0bmV3RmlsZS5uYW1lKGYubmFtZSgpKVxuXHRcdFx0XHRuZXdGaWxlLnNpemUoZi5zaXplKCkpXG5cdFx0XHRcdG1ldGFkYXRhID0ge1xuXHRcdFx0XHRcdG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxuXHRcdFx0XHRcdG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRcdFx0XHRpbnN0YW5jZTogaW5zSWQsXG5cdFx0XHRcdFx0YXBwcm92ZTogYXBwcm92ZUlkXG5cdFx0XHRcdFx0cGFyZW50OiBjZi5faWRcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIGlkeCBpcyAwXG5cdFx0XHRcdFx0bWV0YWRhdGEuY3VycmVudCA9IHRydWVcblxuXHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGFcblx0XHRcdFx0Y2ZzLmluc3RhbmNlcy5pbnNlcnQobmV3RmlsZSlcblxuXHRyZXR1cm5cblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlY29yZEluc3RhbmNlSW5mbyA9IChyZWNvcmRJZHMsIGluc0lkLCBzcGFjZUlkKSAtPlxuXHRDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLnVwZGF0ZShyZWNvcmRJZHMuaWRzWzBdLCB7XG5cdFx0JHB1c2g6IHtcblx0XHRcdGluc3RhbmNlczoge1xuXHRcdFx0XHQkZWFjaDogW3tcblx0XHRcdFx0XHRfaWQ6IGluc0lkLFxuXHRcdFx0XHRcdHN0YXRlOiAnZHJhZnQnXG5cdFx0XHRcdH1dLFxuXHRcdFx0XHQkcG9zaXRpb246IDBcblx0XHRcdH1cblx0XHR9LFxuXHRcdCRzZXQ6IHtcblx0XHRcdGxvY2tlZDogdHJ1ZVxuXHRcdFx0aW5zdGFuY2Vfc3RhdGU6ICdkcmFmdCdcblx0XHR9XG5cdH0pXG5cblx0cmV0dXJuXG5cblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlbGF0ZWRSZWNvcmRJbnN0YW5jZUluZm8gPSAocmVsYXRlZFRhYmxlc0luZm8sIGluc0lkLCBzcGFjZUlkKSAtPlxuXHRfLmVhY2ggcmVsYXRlZFRhYmxlc0luZm8sICh0YWJsZUl0ZW1zLCByZWxhdGVkT2JqZWN0TmFtZSkgLT5cblx0XHRyZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZClcblx0XHRfLmVhY2ggdGFibGVJdGVtcywgKGl0ZW0pIC0+XG5cdFx0XHRyZWxhdGVkQ29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKGl0ZW0uX3RhYmxlLl9pZCwge1xuXHRcdFx0XHQkc2V0OiB7XG5cdFx0XHRcdFx0aW5zdGFuY2VzOiBbe1xuXHRcdFx0XHRcdFx0X2lkOiBpbnNJZCxcblx0XHRcdFx0XHRcdHN0YXRlOiAnZHJhZnQnXG5cdFx0XHRcdFx0fV0sXG5cdFx0XHRcdFx0X3RhYmxlOiBpdGVtLl90YWJsZVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXG5cdHJldHVyblxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsID0gKHJlY29yZElkcywgc3BhY2VJZCkgLT5cblx0cmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlY29yZElkcy5vLCBzcGFjZUlkKS5maW5kT25lKHtcblx0XHRfaWQ6IHJlY29yZElkcy5pZHNbMF0sIGluc3RhbmNlczogeyAkZXhpc3RzOiB0cnVlIH1cblx0fSwgeyBmaWVsZHM6IHsgaW5zdGFuY2VzOiAxIH0gfSlcblxuXHRpZiByZWNvcmQgYW5kIHJlY29yZC5pbnN0YW5jZXNbMF0uc3RhdGUgaXNudCAnY29tcGxldGVkJyBhbmQgQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZChyZWNvcmQuaW5zdGFuY2VzWzBdLl9pZCkuY291bnQoKSA+IDBcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuatpOiusOW9leW3suWPkei1t+a1geeoi+ato+WcqOWuoeaJueS4re+8jOW+heWuoeaJuee7k+adn+aWueWPr+WPkei1t+S4i+S4gOasoeWuoeaJue+8gVwiKVxuXG5cdHJldHVyblxuXG4iLCJ2YXIgX2V2YWwsIGdldE9iamVjdENvbmZpZywgZ2V0T2JqZWN0TmFtZUZpZWxkS2V5LCBnZXRSZWxhdGVkcywgb2JqZWN0cWw7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbl9ldmFsID0gcmVxdWlyZSgnZXZhbCcpO1xuXG5vYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJyk7XG5cbmdldE9iamVjdENvbmZpZyA9IGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUpIHtcbiAgcmV0dXJuIG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS50b0NvbmZpZygpO1xufTtcblxuZ2V0T2JqZWN0TmFtZUZpZWxkS2V5ID0gZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSkge1xuICByZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLk5BTUVfRklFTERfS0VZO1xufTtcblxuZ2V0UmVsYXRlZHMgPSBmdW5jdGlvbihvYmplY3RBcGlOYW1lKSB7XG4gIHJldHVybiBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUsIGNiKSB7XG4gICAgcmV0dXJuIG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS5nZXRSZWxhdGVkcygpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfSkob2JqZWN0QXBpTmFtZSk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge307XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbiA9IGZ1bmN0aW9uKHJlcSkge1xuICB2YXIgYXV0aFRva2VuLCBoYXNoZWRUb2tlbiwgcXVlcnksIHVzZXIsIHVzZXJJZDtcbiAgcXVlcnkgPSByZXEucXVlcnk7XG4gIHVzZXJJZCA9IHF1ZXJ5W1wiWC1Vc2VyLUlkXCJdO1xuICBhdXRoVG9rZW4gPSBxdWVyeVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICBfaWQ6IHVzZXJJZCxcbiAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICB9KTtcbiAgaWYgKCF1c2VyKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICByZXR1cm4gdXNlcjtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2UgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICB2YXIgc3BhY2U7XG4gIHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gIGlmICghc3BhY2UpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInNwYWNlX2lk5pyJ6K+v5oiW5q2kc3BhY2Xlt7Lnu4/ooqvliKDpmaRcIik7XG4gIH1cbiAgcmV0dXJuIHNwYWNlO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93ID0gZnVuY3Rpb24oZmxvd19pZCkge1xuICB2YXIgZmxvdztcbiAgZmxvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZmxvd3MuZmluZE9uZShmbG93X2lkKTtcbiAgaWYgKCFmbG93KSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJpZOacieivr+aIluatpOa1geeoi+W3sue7j+iiq+WIoOmZpFwiKTtcbiAgfVxuICByZXR1cm4gZmxvdztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyID0gZnVuY3Rpb24oc3BhY2VfaWQsIHVzZXJfaWQpIHtcbiAgdmFyIHNwYWNlX3VzZXI7XG4gIHNwYWNlX3VzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB1c2VyOiB1c2VyX2lkXG4gIH0pO1xuICBpZiAoIXNwYWNlX3VzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInVzZXJfaWTlr7nlupTnmoTnlKjmiLfkuI3lsZ7kuo7lvZPliY1zcGFjZVwiKTtcbiAgfVxuICByZXR1cm4gc3BhY2VfdXNlcjtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyA9IGZ1bmN0aW9uKHNwYWNlX3VzZXIpIHtcbiAgdmFyIGluZm8sIG9yZztcbiAgaW5mbyA9IG5ldyBPYmplY3Q7XG4gIGluZm8ub3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb247XG4gIG9yZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub3JnYW5pemF0aW9ucy5maW5kT25lKHNwYWNlX3VzZXIub3JnYW5pemF0aW9uLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBuYW1lOiAxLFxuICAgICAgZnVsbG5hbWU6IDFcbiAgICB9XG4gIH0pO1xuICBpbmZvLm9yZ2FuaXphdGlvbl9uYW1lID0gb3JnLm5hbWU7XG4gIGluZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gb3JnLmZ1bGxuYW1lO1xuICByZXR1cm4gaW5mbztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZCA9IGZ1bmN0aW9uKGZsb3cpIHtcbiAgaWYgKGZsb3cuc3RhdGUgIT09IFwiZW5hYmxlZFwiKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvmnKrlkK/nlKgs5pON5L2c5aSx6LSlXCIpO1xuICB9XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZCA9IGZ1bmN0aW9uKGZsb3csIHNwYWNlX2lkKSB7XG4gIGlmIChmbG93LnNwYWNlICE9PSBzcGFjZV9pZCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5ZKM5bel5L2c5Yy6SUTkuI3ljLnphY1cIik7XG4gIH1cbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybSA9IGZ1bmN0aW9uKGZvcm1faWQpIHtcbiAgdmFyIGZvcm07XG4gIGZvcm0gPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZvcm1zLmZpbmRPbmUoZm9ybV9pZCk7XG4gIGlmICghZm9ybSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsICfooajljZVJROacieivr+aIluatpOihqOWNleW3sue7j+iiq+WIoOmZpCcpO1xuICB9XG4gIHJldHVybiBmb3JtO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeSA9IGZ1bmN0aW9uKGNhdGVnb3J5X2lkKSB7XG4gIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLmNhdGVnb3JpZXMuZmluZE9uZShjYXRlZ29yeV9pZCk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrU3luY0RpcmVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmbG93X2lkKSB7XG4gIHZhciBvdywgc3luY0RpcmVjdGlvbjtcbiAgb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIGZsb3dfaWQ6IGZsb3dfaWRcbiAgfSk7XG4gIGlmICghb3cpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn5pyq5om+5Yiw5a+56LGh5rWB56iL5pig5bCE6K6w5b2V44CCJyk7XG4gIH1cbiAgc3luY0RpcmVjdGlvbiA9IG93LnN5bmNfZGlyZWN0aW9uIHx8ICdib3RoJztcbiAgaWYgKCFbJ2JvdGgnLCAnb2JqX3RvX2lucyddLmluY2x1ZGVzKHN5bmNEaXJlY3Rpb24pKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+S4jeaUr+aMgeeahOWQjOatpeaWueWQkeOAgicpO1xuICB9XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNyZWF0ZV9pbnN0YW5jZSA9IGZ1bmN0aW9uKGluc3RhbmNlX2Zyb21fY2xpZW50LCB1c2VyX2luZm8pIHtcbiAgdmFyIGFwcHJfb2JqLCBhcHByb3ZlX2Zyb21fY2xpZW50LCBjYXRlZ29yeSwgZmxvdywgZmxvd19pZCwgZm9ybSwgaW5zX29iaiwgbmV3X2luc19pZCwgbm93LCBwZXJtaXNzaW9ucywgcmVsYXRlZFRhYmxlc0luZm8sIHNwYWNlLCBzcGFjZV9pZCwgc3BhY2VfdXNlciwgc3BhY2VfdXNlcl9vcmdfaW5mbywgc3RhcnRfc3RlcCwgdHJhY2VfZnJvbV9jbGllbnQsIHRyYWNlX29iaiwgdXNlcl9pZDtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0sIFN0cmluZyk7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0sIFN0cmluZyk7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXSwgU3RyaW5nKTtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdLCBbXG4gICAge1xuICAgICAgbzogU3RyaW5nLFxuICAgICAgaWRzOiBbU3RyaW5nXVxuICAgIH1cbiAgXSk7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tTeW5jRGlyZWN0aW9uKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVswXS5vLCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl0pO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVswXSwgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSk7XG4gIHNwYWNlX2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXTtcbiAgZmxvd19pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXTtcbiAgdXNlcl9pZCA9IHVzZXJfaW5mby5faWQ7XG4gIHRyYWNlX2Zyb21fY2xpZW50ID0gbnVsbDtcbiAgYXBwcm92ZV9mcm9tX2NsaWVudCA9IG51bGw7XG4gIGlmIChpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXSAmJiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXSkge1xuICAgIHRyYWNlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF07XG4gICAgaWYgKHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl0gJiYgdHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXVswXSkge1xuICAgICAgYXBwcm92ZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdW1wiYXBwcm92ZXNcIl1bMF07XG4gICAgfVxuICB9XG4gIHNwYWNlID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZShzcGFjZV9pZCk7XG4gIGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZCk7XG4gIHNwYWNlX3VzZXIgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlcihzcGFjZV9pZCwgdXNlcl9pZCk7XG4gIHNwYWNlX3VzZXJfb3JnX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8oc3BhY2VfdXNlcik7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZChmbG93KTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQoZmxvdywgc3BhY2VfaWQpO1xuICBmb3JtID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtKGZsb3cuZm9ybSk7XG4gIHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dfaWQsIHVzZXJfaWQpO1xuICBpZiAoIXBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRkXCIpKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLlvZPliY3nlKjmiLfmsqHmnInmraTmtYHnqIvnmoTmlrDlu7rmnYPpmZBcIik7XG4gIH1cbiAgbm93ID0gbmV3IERhdGU7XG4gIGluc19vYmogPSB7fTtcbiAgaW5zX29iai5faWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5fbWFrZU5ld0lEKCk7XG4gIGluc19vYmouc3BhY2UgPSBzcGFjZV9pZDtcbiAgaW5zX29iai5mbG93ID0gZmxvd19pZDtcbiAgaW5zX29iai5mbG93X3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuX2lkO1xuICBpbnNfb2JqLmZvcm0gPSBmbG93LmZvcm07XG4gIGluc19vYmouZm9ybV92ZXJzaW9uID0gZmxvdy5jdXJyZW50LmZvcm1fdmVyc2lvbjtcbiAgaW5zX29iai5uYW1lID0gZmxvdy5uYW1lO1xuICBpbnNfb2JqLnN1Ym1pdHRlciA9IHVzZXJfaWQ7XG4gIGluc19vYmouc3VibWl0dGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIDogdXNlcl9pZDtcbiAgaW5zX29iai5hcHBsaWNhbnRfbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIDogdXNlcl9pbmZvLm5hbWU7XG4gIGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbiA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSA6IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uO1xuICBpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gOiBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9uYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gOiBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnRfY29tcGFueSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdIDogc3BhY2VfdXNlci5jb21wYW55X2lkO1xuICBpbnNfb2JqLnN0YXRlID0gJ2RyYWZ0JztcbiAgaW5zX29iai5jb2RlID0gJyc7XG4gIGluc19vYmouaXNfYXJjaGl2ZWQgPSBmYWxzZTtcbiAgaW5zX29iai5pc19kZWxldGVkID0gZmFsc2U7XG4gIGluc19vYmouY3JlYXRlZCA9IG5vdztcbiAgaW5zX29iai5jcmVhdGVkX2J5ID0gdXNlcl9pZDtcbiAgaW5zX29iai5tb2RpZmllZCA9IG5vdztcbiAgaW5zX29iai5tb2RpZmllZF9ieSA9IHVzZXJfaWQ7XG4gIGluc19vYmoucmVjb3JkX2lkcyA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXTtcbiAgaWYgKHNwYWNlX3VzZXIuY29tcGFueV9pZCkge1xuICAgIGluc19vYmouY29tcGFueV9pZCA9IHNwYWNlX3VzZXIuY29tcGFueV9pZDtcbiAgfVxuICB0cmFjZV9vYmogPSB7fTtcbiAgdHJhY2Vfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHI7XG4gIHRyYWNlX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkO1xuICB0cmFjZV9vYmouaXNfZmluaXNoZWQgPSBmYWxzZTtcbiAgc3RhcnRfc3RlcCA9IF8uZmluZChmbG93LmN1cnJlbnQuc3RlcHMsIGZ1bmN0aW9uKHN0ZXApIHtcbiAgICByZXR1cm4gc3RlcC5zdGVwX3R5cGUgPT09ICdzdGFydCc7XG4gIH0pO1xuICB0cmFjZV9vYmouc3RlcCA9IHN0YXJ0X3N0ZXAuX2lkO1xuICB0cmFjZV9vYmoubmFtZSA9IHN0YXJ0X3N0ZXAubmFtZTtcbiAgdHJhY2Vfb2JqLnN0YXJ0X2RhdGUgPSBub3c7XG4gIGFwcHJfb2JqID0ge307XG4gIGFwcHJfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHI7XG4gIGFwcHJfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWQ7XG4gIGFwcHJfb2JqLnRyYWNlID0gdHJhY2Vfb2JqLl9pZDtcbiAgYXBwcl9vYmouaXNfZmluaXNoZWQgPSBmYWxzZTtcbiAgYXBwcl9vYmoudXNlciA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gOiB1c2VyX2lkO1xuICBhcHByX29iai51c2VyX25hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA6IHVzZXJfaW5mby5uYW1lO1xuICBhcHByX29iai5oYW5kbGVyID0gdXNlcl9pZDtcbiAgYXBwcl9vYmouaGFuZGxlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWU7XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb247XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX25hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLm5hbWU7XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5mdWxsbmFtZTtcbiAgYXBwcl9vYmoudHlwZSA9ICdkcmFmdCc7XG4gIGFwcHJfb2JqLnN0YXJ0X2RhdGUgPSBub3c7XG4gIGFwcHJfb2JqLnJlYWRfZGF0ZSA9IG5vdztcbiAgYXBwcl9vYmouaXNfcmVhZCA9IHRydWU7XG4gIGFwcHJfb2JqLmlzX2Vycm9yID0gZmFsc2U7XG4gIGFwcHJfb2JqLmRlc2NyaXB0aW9uID0gJyc7XG4gIHJlbGF0ZWRUYWJsZXNJbmZvID0ge307XG4gIGFwcHJfb2JqLnZhbHVlcyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMoaW5zX29iai5yZWNvcmRfaWRzWzBdLCBmbG93X2lkLCBzcGFjZV9pZCwgZm9ybS5jdXJyZW50LmZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pO1xuICB0cmFjZV9vYmouYXBwcm92ZXMgPSBbYXBwcl9vYmpdO1xuICBpbnNfb2JqLnRyYWNlcyA9IFt0cmFjZV9vYmpdO1xuICBpbnNfb2JqLnZhbHVlcyA9IGFwcHJfb2JqLnZhbHVlcztcbiAgaW5zX29iai5pbmJveF91c2VycyA9IGluc3RhbmNlX2Zyb21fY2xpZW50LmluYm94X3VzZXJzIHx8IFtdO1xuICBpbnNfb2JqLmN1cnJlbnRfc3RlcF9uYW1lID0gc3RhcnRfc3RlcC5uYW1lO1xuICBpZiAoZmxvdy5hdXRvX3JlbWluZCA9PT0gdHJ1ZSkge1xuICAgIGluc19vYmouYXV0b19yZW1pbmQgPSB0cnVlO1xuICB9XG4gIGluc19vYmouZmxvd19uYW1lID0gZmxvdy5uYW1lO1xuICBpZiAoZm9ybS5jYXRlZ29yeSkge1xuICAgIGNhdGVnb3J5ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeShmb3JtLmNhdGVnb3J5KTtcbiAgICBpZiAoY2F0ZWdvcnkpIHtcbiAgICAgIGluc19vYmouY2F0ZWdvcnlfbmFtZSA9IGNhdGVnb3J5Lm5hbWU7XG4gICAgICBpbnNfb2JqLmNhdGVnb3J5ID0gY2F0ZWdvcnkuX2lkO1xuICAgIH1cbiAgfVxuICBuZXdfaW5zX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuaW5zZXJ0KGluc19vYmopO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvKGluc19vYmoucmVjb3JkX2lkc1swXSwgbmV3X2luc19pZCwgc3BhY2VfaWQpO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoKGluc19vYmoucmVjb3JkX2lkc1swXSwgc3BhY2VfaWQsIGluc19vYmouX2lkLCBhcHByX29iai5faWQpO1xuICByZXR1cm4gbmV3X2luc19pZDtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMgPSBmdW5jdGlvbihyZWNvcmRJZHMsIGZsb3dJZCwgc3BhY2VJZCwgZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbykge1xuICB2YXIgZmllbGRDb2RlcywgZmlsdGVyVmFsdWVzLCBmbG93LCBmb3JtLCBmb3JtRmllbGRzLCBmb3JtVGFibGVGaWVsZHMsIGZvcm1UYWJsZUZpZWxkc0NvZGUsIGdldEZpZWxkT2RhdGFWYWx1ZSwgZ2V0Rm9ybUZpZWxkLCBnZXRGb3JtVGFibGVGaWVsZCwgZ2V0Rm9ybVRhYmxlRmllbGRDb2RlLCBnZXRGb3JtVGFibGVTdWJGaWVsZCwgZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSwgZ2V0U2VsZWN0T3JnVmFsdWUsIGdldFNlbGVjdE9yZ1ZhbHVlcywgZ2V0U2VsZWN0VXNlclZhbHVlLCBnZXRTZWxlY3RVc2VyVmFsdWVzLCBvYmplY3QsIG9iamVjdE5hbWUsIG93LCByZWNvcmQsIHJlY29yZElkLCByZWYsIHJlbGF0ZWRPYmplY3RzLCByZWxhdGVkT2JqZWN0c0tleXMsIHRhYmxlRmllbGRDb2RlcywgdGFibGVGaWVsZE1hcCwgdGFibGVUb1JlbGF0ZWRNYXAsIHZhbHVlcztcbiAgZmllbGRDb2RlcyA9IFtdO1xuICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgaWYgKGYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKGYuZmllbGRzLCBmdW5jdGlvbihmZikge1xuICAgICAgICByZXR1cm4gZmllbGRDb2Rlcy5wdXNoKGZmLmNvZGUpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaWVsZENvZGVzLnB1c2goZi5jb2RlKTtcbiAgICB9XG4gIH0pO1xuICB2YWx1ZXMgPSB7fTtcbiAgb2JqZWN0TmFtZSA9IHJlY29yZElkcy5vO1xuICBvYmplY3QgPSBnZXRPYmplY3RDb25maWcob2JqZWN0TmFtZSk7XG4gIHJlY29yZElkID0gcmVjb3JkSWRzLmlkc1swXTtcbiAgb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXG4gICAgZmxvd19pZDogZmxvd0lkXG4gIH0pO1xuICByZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0TmFtZSwgc3BhY2VJZCkuZmluZE9uZShyZWNvcmRJZCk7XG4gIGZsb3cgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShmbG93SWQsIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGZvcm06IDFcbiAgICB9XG4gIH0pO1xuICBpZiAob3cgJiYgcmVjb3JkKSB7XG4gICAgZm9ybSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImZvcm1zXCIpLmZpbmRPbmUoZmxvdy5mb3JtKTtcbiAgICBmb3JtRmllbGRzID0gZm9ybS5jdXJyZW50LmZpZWxkcyB8fCBbXTtcbiAgICByZWxhdGVkT2JqZWN0cyA9IGdldFJlbGF0ZWRzKG9iamVjdE5hbWUpO1xuICAgIHJlbGF0ZWRPYmplY3RzS2V5cyA9IF8ucGx1Y2socmVsYXRlZE9iamVjdHMsICdvYmplY3RfbmFtZScpO1xuICAgIGZvcm1UYWJsZUZpZWxkcyA9IF8uZmlsdGVyKGZvcm1GaWVsZHMsIGZ1bmN0aW9uKGZvcm1GaWVsZCkge1xuICAgICAgcmV0dXJuIGZvcm1GaWVsZC50eXBlID09PSAndGFibGUnO1xuICAgIH0pO1xuICAgIGZvcm1UYWJsZUZpZWxkc0NvZGUgPSBfLnBsdWNrKGZvcm1UYWJsZUZpZWxkcywgJ2NvZGUnKTtcbiAgICBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKHJlbGF0ZWRPYmplY3RzS2V5cywgZnVuY3Rpb24ocmVsYXRlZE9iamVjdHNLZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleS5zdGFydHNXaXRoKHJlbGF0ZWRPYmplY3RzS2V5ICsgJy4nKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlRmllbGRDb2RlID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKGZvcm1UYWJsZUZpZWxkc0NvZGUsIGZ1bmN0aW9uKGZvcm1UYWJsZUZpZWxkQ29kZSkge1xuICAgICAgICByZXR1cm4ga2V5LnN0YXJ0c1dpdGgoZm9ybVRhYmxlRmllbGRDb2RlICsgJy4nKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlRmllbGQgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBfLmZpbmQoZm9ybVRhYmxlRmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgIHJldHVybiBmLmNvZGUgPT09IGtleTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybUZpZWxkID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgZmY7XG4gICAgICBmZiA9IG51bGw7XG4gICAgICBfLmZvckVhY2goZm9ybUZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgICAgICBpZiAoZmYpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIGZmID0gXy5maW5kKGYuZmllbGRzLCBmdW5jdGlvbihzZikge1xuICAgICAgICAgICAgcmV0dXJuIHNmLmNvZGUgPT09IGtleTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChmLmNvZGUgPT09IGtleSkge1xuICAgICAgICAgIHJldHVybiBmZiA9IGY7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZmO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlU3ViRmllbGQgPSBmdW5jdGlvbih0YWJsZUZpZWxkLCBzdWJGaWVsZENvZGUpIHtcbiAgICAgIHJldHVybiBfLmZpbmQodGFibGVGaWVsZC5maWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgcmV0dXJuIGYuY29kZSA9PT0gc3ViRmllbGRDb2RlO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRGaWVsZE9kYXRhVmFsdWUgPSBmdW5jdGlvbihvYmpOYW1lLCBpZCkge1xuICAgICAgdmFyIF9yZWNvcmQsIF9yZWNvcmRzLCBuYW1lS2V5LCBvYmo7XG4gICAgICBvYmogPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqTmFtZSk7XG4gICAgICBuYW1lS2V5ID0gZ2V0T2JqZWN0TmFtZUZpZWxkS2V5KG9iak5hbWUpO1xuICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKF8uaXNTdHJpbmcoaWQpKSB7XG4gICAgICAgIF9yZWNvcmQgPSBvYmouZmluZE9uZShpZCk7XG4gICAgICAgIGlmIChfcmVjb3JkKSB7XG4gICAgICAgICAgX3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkW25hbWVLZXldO1xuICAgICAgICAgIHJldHVybiBfcmVjb3JkO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKF8uaXNBcnJheShpZCkpIHtcbiAgICAgICAgX3JlY29yZHMgPSBbXTtcbiAgICAgICAgb2JqLmZpbmQoe1xuICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgJGluOiBpZFxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihfcmVjb3JkKSB7XG4gICAgICAgICAgX3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkW25hbWVLZXldO1xuICAgICAgICAgIHJldHVybiBfcmVjb3Jkcy5wdXNoKF9yZWNvcmQpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFfLmlzRW1wdHkoX3JlY29yZHMpKSB7XG4gICAgICAgICAgcmV0dXJuIF9yZWNvcmRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBnZXRTZWxlY3RVc2VyVmFsdWUgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgICAgIHZhciBzdTtcbiAgICAgIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9KTtcbiAgICAgIHN1LmlkID0gdXNlcklkO1xuICAgICAgcmV0dXJuIHN1O1xuICAgIH07XG4gICAgZ2V0U2VsZWN0VXNlclZhbHVlcyA9IGZ1bmN0aW9uKHVzZXJJZHMsIHNwYWNlSWQpIHtcbiAgICAgIHZhciBzdXM7XG4gICAgICBzdXMgPSBbXTtcbiAgICAgIGlmIChfLmlzQXJyYXkodXNlcklkcykpIHtcbiAgICAgICAgXy5lYWNoKHVzZXJJZHMsIGZ1bmN0aW9uKHVzZXJJZCkge1xuICAgICAgICAgIHZhciBzdTtcbiAgICAgICAgICBzdSA9IGdldFNlbGVjdFVzZXJWYWx1ZSh1c2VySWQsIHNwYWNlSWQpO1xuICAgICAgICAgIGlmIChzdSkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cy5wdXNoKHN1KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN1cztcbiAgICB9O1xuICAgIGdldFNlbGVjdE9yZ1ZhbHVlID0gZnVuY3Rpb24ob3JnSWQsIHNwYWNlSWQpIHtcbiAgICAgIHZhciBvcmc7XG4gICAgICBvcmcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kT25lKG9yZ0lkLCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgIGZ1bGxuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgb3JnLmlkID0gb3JnSWQ7XG4gICAgICByZXR1cm4gb3JnO1xuICAgIH07XG4gICAgZ2V0U2VsZWN0T3JnVmFsdWVzID0gZnVuY3Rpb24ob3JnSWRzLCBzcGFjZUlkKSB7XG4gICAgICB2YXIgb3JncztcbiAgICAgIG9yZ3MgPSBbXTtcbiAgICAgIGlmIChfLmlzQXJyYXkob3JnSWRzKSkge1xuICAgICAgICBfLmVhY2gob3JnSWRzLCBmdW5jdGlvbihvcmdJZCkge1xuICAgICAgICAgIHZhciBvcmc7XG4gICAgICAgICAgb3JnID0gZ2V0U2VsZWN0T3JnVmFsdWUob3JnSWQsIHNwYWNlSWQpO1xuICAgICAgICAgIGlmIChvcmcpIHtcbiAgICAgICAgICAgIHJldHVybiBvcmdzLnB1c2gob3JnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9yZ3M7XG4gICAgfTtcbiAgICB0YWJsZUZpZWxkQ29kZXMgPSBbXTtcbiAgICB0YWJsZUZpZWxkTWFwID0gW107XG4gICAgdGFibGVUb1JlbGF0ZWRNYXAgPSB7fTtcbiAgICBpZiAoKHJlZiA9IG93LmZpZWxkX21hcCkgIT0gbnVsbCkge1xuICAgICAgcmVmLmZvckVhY2goZnVuY3Rpb24oZm0pIHtcbiAgICAgICAgdmFyIGZpZWxkc09iaiwgZm9ybUZpZWxkLCBmb3JtVGFibGVGaWVsZENvZGUsIGdyaWRDb2RlLCBsb29rdXBGaWVsZE5hbWUsIGxvb2t1cEZpZWxkT2JqLCBsb29rdXBPYmplY3RSZWNvcmQsIGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUsIG9UYWJsZUNvZGUsIG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZCwgb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkQ29kZSwgb1RhYmxlRmllbGRDb2RlLCBvYmpGaWVsZCwgb2JqZWN0RmllbGQsIG9iamVjdEZpZWxkTmFtZSwgb2JqZWN0RmllbGRPYmplY3ROYW1lLCBvYmplY3RMb29rdXBGaWVsZCwgb2JqZWN0X2ZpZWxkLCBvZGF0YUZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRG9jLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVsYXRlZE9iamVjdEZpZWxkQ29kZSwgc2VsZWN0RmllbGRWYWx1ZSwgdGFibGVUb1JlbGF0ZWRNYXBLZXksIHdUYWJsZUNvZGUsIHdvcmtmbG93X2ZpZWxkO1xuICAgICAgICBvYmplY3RfZmllbGQgPSBmbS5vYmplY3RfZmllbGQ7XG4gICAgICAgIHdvcmtmbG93X2ZpZWxkID0gZm0ud29ya2Zsb3dfZmllbGQ7XG4gICAgICAgIGlmICghb2JqZWN0X2ZpZWxkIHx8ICF3b3JrZmxvd19maWVsZCkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAn5pyq5om+5Yiw5a2X5q6177yM6K+35qOA5p+l5a+56LGh5rWB56iL5pig5bCE5a2X5q616YWN572uJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmVsYXRlZE9iamVjdEZpZWxkQ29kZSA9IGdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUob2JqZWN0X2ZpZWxkKTtcbiAgICAgICAgZm9ybVRhYmxlRmllbGRDb2RlID0gZ2V0Rm9ybVRhYmxlRmllbGRDb2RlKHdvcmtmbG93X2ZpZWxkKTtcbiAgICAgICAgb2JqRmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdF9maWVsZF07XG4gICAgICAgIGZvcm1GaWVsZCA9IGdldEZvcm1GaWVsZCh3b3JrZmxvd19maWVsZCk7XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0RmllbGRDb2RlKSB7XG4gICAgICAgICAgb1RhYmxlQ29kZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgIG9UYWJsZUZpZWxkQ29kZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgIHRhYmxlVG9SZWxhdGVkTWFwS2V5ID0gb1RhYmxlQ29kZTtcbiAgICAgICAgICBpZiAoIXRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSkge1xuICAgICAgICAgICAgdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmb3JtVGFibGVGaWVsZENvZGUpIHtcbiAgICAgICAgICAgIHdUYWJsZUNvZGUgPSB3b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgICAgdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldWydfRlJPTV9UQUJMRV9DT0RFJ10gPSB3VGFibGVDb2RlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldW29UYWJsZUZpZWxkQ29kZV0gPSB3b3JrZmxvd19maWVsZDtcbiAgICAgICAgfSBlbHNlIGlmICh3b3JrZmxvd19maWVsZC5pbmRleE9mKCcuJykgPiAwICYmIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA+IDApIHtcbiAgICAgICAgICB3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICBvVGFibGVDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJC4nKVswXTtcbiAgICAgICAgICBpZiAocmVjb3JkLmhhc093blByb3BlcnR5KG9UYWJsZUNvZGUpICYmIF8uaXNBcnJheShyZWNvcmRbb1RhYmxlQ29kZV0pKSB7XG4gICAgICAgICAgICB0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgIHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXG4gICAgICAgICAgICAgIG9iamVjdF90YWJsZV9maWVsZF9jb2RlOiBvVGFibGVDb2RlXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICByZXR1cm4gdGFibGVGaWVsZE1hcC5wdXNoKGZtKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG9UYWJsZUNvZGUuaW5kZXhPZignLicpID4gMCkge1xuICAgICAgICAgICAgb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkQ29kZSA9IG9UYWJsZUNvZGUuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIGdyaWRDb2RlID0gb1RhYmxlQ29kZS5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkID0gb2JqZWN0LmZpZWxkc1tvVGFibGVDb2RlUmVmZXJlbmNlRmllbGRDb2RlXTtcbiAgICAgICAgICAgIGlmIChvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgIGlmIChyZWNvcmRbb1RhYmxlQ29kZV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5uYW1lXTtcbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9Eb2MgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpO1xuICAgICAgICAgICAgICBpZiAocmVmZXJlbmNlVG9Eb2NbZ3JpZENvZGVdKSB7XG4gICAgICAgICAgICAgICAgcmVjb3JkW29UYWJsZUNvZGVdID0gcmVmZXJlbmNlVG9Eb2NbZ3JpZENvZGVdO1xuICAgICAgICAgICAgICAgIHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgIHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXG4gICAgICAgICAgICAgICAgICBvYmplY3RfdGFibGVfZmllbGRfY29kZTogb1RhYmxlQ29kZVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFibGVGaWVsZE1hcC5wdXNoKGZtKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChvYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gMCAmJiBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPT09IC0xKSB7XG4gICAgICAgICAgb2JqZWN0RmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgbG9va3VwRmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgaWYgKG9iamVjdCkge1xuICAgICAgICAgICAgb2JqZWN0RmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdEZpZWxkTmFtZV07XG4gICAgICAgICAgICBpZiAob2JqZWN0RmllbGQgJiYgZm9ybUZpZWxkICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgZmllbGRzT2JqID0ge307XG4gICAgICAgICAgICAgIGZpZWxkc09ialtsb29rdXBGaWVsZE5hbWVdID0gMTtcbiAgICAgICAgICAgICAgbG9va3VwT2JqZWN0UmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZE9uZShyZWNvcmRbb2JqZWN0RmllbGROYW1lXSwge1xuICAgICAgICAgICAgICAgIGZpZWxkczogZmllbGRzT2JqXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBvYmplY3RGaWVsZE9iamVjdE5hbWUgPSBvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICAgIGxvb2t1cEZpZWxkT2JqID0gZ2V0T2JqZWN0Q29uZmlnKG9iamVjdEZpZWxkT2JqZWN0TmFtZSk7XG4gICAgICAgICAgICAgIG9iamVjdExvb2t1cEZpZWxkID0gbG9va3VwRmllbGRPYmouZmllbGRzW2xvb2t1cEZpZWxkTmFtZV07XG4gICAgICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IGxvb2t1cE9iamVjdFJlY29yZFtsb29rdXBGaWVsZE5hbWVdO1xuICAgICAgICAgICAgICBpZiAob2JqZWN0TG9va3VwRmllbGQgJiYgZm9ybUZpZWxkICYmIGZvcm1GaWVsZC50eXBlID09PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RMb29rdXBGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb09iamVjdE5hbWUgPSBvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgIG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAob2JqZWN0TG9va3VwRmllbGQgJiYgZm9ybUZpZWxkICYmIFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKGZvcm1GaWVsZC50eXBlKSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqZWN0TG9va3VwRmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIGlmICghXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgIGxvb2t1cFNlbGVjdEZpZWxkVmFsdWU7XG4gICAgICAgICAgICAgICAgICBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgbG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgIGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgbG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgbG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChsb29rdXBTZWxlY3RGaWVsZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gbG9va3VwU2VsZWN0RmllbGRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBsb29rdXBPYmplY3RSZWNvcmRbbG9va3VwRmllbGROYW1lXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iakZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqRmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9iakZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSByZWNvcmRbb2JqRmllbGQubmFtZV07XG4gICAgICAgICAgb2RhdGFGaWVsZFZhbHVlO1xuICAgICAgICAgIGlmIChvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgIG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIGlmICghb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkICYmIG9iakZpZWxkICYmIFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKGZvcm1GaWVsZC50eXBlKSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob2JqRmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvYmpGaWVsZC5uYW1lXTtcbiAgICAgICAgICBpZiAoIV8uaXNFbXB0eShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUpKSB7XG4gICAgICAgICAgICBzZWxlY3RGaWVsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKGZvcm1GaWVsZC50eXBlID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgaWYgKG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdncm91cCcpIHtcbiAgICAgICAgICAgICAgaWYgKG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZWN0RmllbGRWYWx1ZSkge1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHNlbGVjdEZpZWxkVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC5oYXNPd25Qcm9wZXJ0eShvYmplY3RfZmllbGQpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSByZWNvcmRbb2JqZWN0X2ZpZWxkXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIF8udW5pcSh0YWJsZUZpZWxkQ29kZXMpLmZvckVhY2goZnVuY3Rpb24odGZjKSB7XG4gICAgICB2YXIgYztcbiAgICAgIGMgPSBKU09OLnBhcnNlKHRmYyk7XG4gICAgICB2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXSA9IFtdO1xuICAgICAgcmV0dXJuIHJlY29yZFtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXS5mb3JFYWNoKGZ1bmN0aW9uKHRyKSB7XG4gICAgICAgIHZhciBuZXdUcjtcbiAgICAgICAgbmV3VHIgPSB7fTtcbiAgICAgICAgXy5lYWNoKHRyLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYmxlRmllbGRNYXAuZm9yRWFjaChmdW5jdGlvbih0Zm0pIHtcbiAgICAgICAgICAgIHZhciB3VGRDb2RlO1xuICAgICAgICAgICAgaWYgKHRmbS5vYmplY3RfZmllbGQgPT09IChjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlICsgJy4kLicgKyBrKSkge1xuICAgICAgICAgICAgICB3VGRDb2RlID0gdGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICAgIHJldHVybiBuZXdUclt3VGRDb2RlXSA9IHY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIV8uaXNFbXB0eShuZXdUcikpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWVzW2Mud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZV0ucHVzaChuZXdUcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIF8uZWFjaCh0YWJsZVRvUmVsYXRlZE1hcCwgZnVuY3Rpb24obWFwLCBrZXkpIHtcbiAgICAgIHZhciBmb3JtVGFibGVGaWVsZCwgcmVsYXRlZENvbGxlY3Rpb24sIHJlbGF0ZWRGaWVsZCwgcmVsYXRlZEZpZWxkTmFtZSwgcmVsYXRlZE9iamVjdCwgcmVsYXRlZE9iamVjdE5hbWUsIHJlbGF0ZWRSZWNvcmRzLCByZWxhdGVkVGFibGVJdGVtcywgc2VsZWN0b3IsIHRhYmxlQ29kZSwgdGFibGVWYWx1ZXM7XG4gICAgICB0YWJsZUNvZGUgPSBtYXAuX0ZST01fVEFCTEVfQ09ERTtcbiAgICAgIGZvcm1UYWJsZUZpZWxkID0gZ2V0Rm9ybVRhYmxlRmllbGQodGFibGVDb2RlKTtcbiAgICAgIGlmICghdGFibGVDb2RlKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oJ3RhYmxlVG9SZWxhdGVkOiBbJyArIGtleSArICddIG1pc3NpbmcgY29ycmVzcG9uZGluZyB0YWJsZS4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbGF0ZWRPYmplY3ROYW1lID0ga2V5O1xuICAgICAgICB0YWJsZVZhbHVlcyA9IFtdO1xuICAgICAgICByZWxhdGVkVGFibGVJdGVtcyA9IFtdO1xuICAgICAgICByZWxhdGVkT2JqZWN0ID0gZ2V0T2JqZWN0Q29uZmlnKHJlbGF0ZWRPYmplY3ROYW1lKTtcbiAgICAgICAgcmVsYXRlZEZpZWxkID0gXy5maW5kKHJlbGF0ZWRPYmplY3QuZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgcmV0dXJuIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhmLnR5cGUpICYmIGYucmVmZXJlbmNlX3RvID09PSBvYmplY3ROYW1lO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVsYXRlZEZpZWxkTmFtZSA9IHJlbGF0ZWRGaWVsZC5uYW1lO1xuICAgICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgICBzZWxlY3RvcltyZWxhdGVkRmllbGROYW1lXSA9IHJlY29yZElkO1xuICAgICAgICByZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCk7XG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZChzZWxlY3Rvcik7XG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2goZnVuY3Rpb24ocnIpIHtcbiAgICAgICAgICB2YXIgdGFibGVWYWx1ZUl0ZW07XG4gICAgICAgICAgdGFibGVWYWx1ZUl0ZW0gPSB7fTtcbiAgICAgICAgICBfLmVhY2gobWFwLCBmdW5jdGlvbih2YWx1ZUtleSwgZmllbGRLZXkpIHtcbiAgICAgICAgICAgIHZhciBmb3JtRmllbGQsIGZvcm1GaWVsZEtleSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlbGF0ZWRPYmplY3RGaWVsZCwgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKGZpZWxkS2V5ICE9PSAnX0ZST01fVEFCTEVfQ09ERScpIHtcbiAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICBmb3JtRmllbGRLZXk7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZUtleS5zdGFydHNXaXRoKHRhYmxlQ29kZSArICcuJykpIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSAodmFsdWVLZXkuc3BsaXQoXCIuXCIpWzFdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSB2YWx1ZUtleTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBmb3JtRmllbGQgPSBnZXRGb3JtVGFibGVTdWJGaWVsZChmb3JtVGFibGVGaWVsZCwgZm9ybUZpZWxkS2V5KTtcbiAgICAgICAgICAgICAgcmVsYXRlZE9iamVjdEZpZWxkID0gcmVsYXRlZE9iamVjdC5maWVsZHNbZmllbGRLZXldO1xuICAgICAgICAgICAgICBpZiAoIWZvcm1GaWVsZCB8fCAhcmVsYXRlZE9iamVjdEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb09iamVjdE5hbWUgPSByZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XTtcbiAgICAgICAgICAgICAgICBpZiAocmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV07XG4gICAgICAgICAgICAgICAgaWYgKCFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgaWYgKGZvcm1GaWVsZC50eXBlID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdncm91cCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gdGFibGVWYWx1ZUl0ZW1bZm9ybUZpZWxkS2V5XSA9IHRhYmxlRmllbGRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoIV8uaXNFbXB0eSh0YWJsZVZhbHVlSXRlbSkpIHtcbiAgICAgICAgICAgIHRhYmxlVmFsdWVJdGVtLl9pZCA9IHJyLl9pZDtcbiAgICAgICAgICAgIHRhYmxlVmFsdWVzLnB1c2godGFibGVWYWx1ZUl0ZW0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRUYWJsZUl0ZW1zLnB1c2goe1xuICAgICAgICAgICAgICBfdGFibGU6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IHJyLl9pZCxcbiAgICAgICAgICAgICAgICBfY29kZTogdGFibGVDb2RlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHZhbHVlc1t0YWJsZUNvZGVdID0gdGFibGVWYWx1ZXM7XG4gICAgICAgIHJldHVybiByZWxhdGVkVGFibGVzSW5mb1tyZWxhdGVkT2JqZWN0TmFtZV0gPSByZWxhdGVkVGFibGVJdGVtcztcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAob3cuZmllbGRfbWFwX3NjcmlwdCkge1xuICAgICAgXy5leHRlbmQodmFsdWVzLCB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmV2YWxGaWVsZE1hcFNjcmlwdChvdy5maWVsZF9tYXBfc2NyaXB0LCBvYmplY3ROYW1lLCBzcGFjZUlkLCByZWNvcmRJZCkpO1xuICAgIH1cbiAgfVxuICBmaWx0ZXJWYWx1ZXMgPSB7fTtcbiAgXy5lYWNoKF8ua2V5cyh2YWx1ZXMpLCBmdW5jdGlvbihrKSB7XG4gICAgaWYgKGZpZWxkQ29kZXMuaW5jbHVkZXMoaykpIHtcbiAgICAgIHJldHVybiBmaWx0ZXJWYWx1ZXNba10gPSB2YWx1ZXNba107XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZpbHRlclZhbHVlcztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0ID0gZnVuY3Rpb24oZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgb2JqZWN0SWQpIHtcbiAgdmFyIGZ1bmMsIHJlY29yZCwgc2NyaXB0LCB2YWx1ZXM7XG4gIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKG9iamVjdElkKTtcbiAgc2NyaXB0ID0gXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZWNvcmQpIHsgXCIgKyBmaWVsZF9tYXBfc2NyaXB0ICsgXCIgfVwiO1xuICBmdW5jID0gX2V2YWwoc2NyaXB0LCBcImZpZWxkX21hcF9zY3JpcHRcIik7XG4gIHZhbHVlcyA9IGZ1bmMocmVjb3JkKTtcbiAgaWYgKF8uaXNPYmplY3QodmFsdWVzKSkge1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcihcImV2YWxGaWVsZE1hcFNjcmlwdDog6ISa5pys6L+U5Zue5YC857G75Z6L5LiN5piv5a+56LGhXCIpO1xuICB9XG4gIHJldHVybiB7fTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2ggPSBmdW5jdGlvbihyZWNvcmRJZHMsIHNwYWNlSWQsIGluc0lkLCBhcHByb3ZlSWQpIHtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1snY21zX2ZpbGVzJ10uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgcGFyZW50OiByZWNvcmRJZHNcbiAgfSkuZm9yRWFjaChmdW5jdGlvbihjZikge1xuICAgIHJldHVybiBfLmVhY2goY2YudmVyc2lvbnMsIGZ1bmN0aW9uKHZlcnNpb25JZCwgaWR4KSB7XG4gICAgICB2YXIgZiwgbmV3RmlsZTtcbiAgICAgIGYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zWydjZnMuZmlsZXMuZmlsZXJlY29yZCddLmZpbmRPbmUodmVyc2lvbklkKTtcbiAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgICAgcmV0dXJuIG5ld0ZpbGUuYXR0YWNoRGF0YShmLmNyZWF0ZVJlYWRTdHJlYW0oJ2ZpbGVzJyksIHtcbiAgICAgICAgdHlwZTogZi5vcmlnaW5hbC50eXBlXG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdmFyIG1ldGFkYXRhO1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnIuZXJyb3IsIGVyci5yZWFzb24pO1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUubmFtZShmLm5hbWUoKSk7XG4gICAgICAgIG5ld0ZpbGUuc2l6ZShmLnNpemUoKSk7XG4gICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgIG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxuICAgICAgICAgIG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICBpbnN0YW5jZTogaW5zSWQsXG4gICAgICAgICAgYXBwcm92ZTogYXBwcm92ZUlkLFxuICAgICAgICAgIHBhcmVudDogY2YuX2lkXG4gICAgICAgIH07XG4gICAgICAgIGlmIChpZHggPT09IDApIHtcbiAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgIHJldHVybiBjZnMuaW5zdGFuY2VzLmluc2VydChuZXdGaWxlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8gPSBmdW5jdGlvbihyZWNvcmRJZHMsIGluc0lkLCBzcGFjZUlkKSB7XG4gIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkudXBkYXRlKHJlY29yZElkcy5pZHNbMF0sIHtcbiAgICAkcHVzaDoge1xuICAgICAgaW5zdGFuY2VzOiB7XG4gICAgICAgICRlYWNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgX2lkOiBpbnNJZCxcbiAgICAgICAgICAgIHN0YXRlOiAnZHJhZnQnXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICAkcG9zaXRpb246IDBcbiAgICAgIH1cbiAgICB9LFxuICAgICRzZXQ6IHtcbiAgICAgIGxvY2tlZDogdHJ1ZSxcbiAgICAgIGluc3RhbmNlX3N0YXRlOiAnZHJhZnQnXG4gICAgfVxuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvID0gZnVuY3Rpb24ocmVsYXRlZFRhYmxlc0luZm8sIGluc0lkLCBzcGFjZUlkKSB7XG4gIF8uZWFjaChyZWxhdGVkVGFibGVzSW5mbywgZnVuY3Rpb24odGFibGVJdGVtcywgcmVsYXRlZE9iamVjdE5hbWUpIHtcbiAgICB2YXIgcmVsYXRlZENvbGxlY3Rpb247XG4gICAgcmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpO1xuICAgIHJldHVybiBfLmVhY2godGFibGVJdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIHJlbGF0ZWRDb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoaXRlbS5fdGFibGUuX2lkLCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBpbnN0YW5jZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgX2lkOiBpbnNJZCxcbiAgICAgICAgICAgICAgc3RhdGU6ICdkcmFmdCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdLFxuICAgICAgICAgIF90YWJsZTogaXRlbS5fdGFibGVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja0lzSW5BcHByb3ZhbCA9IGZ1bmN0aW9uKHJlY29yZElkcywgc3BhY2VJZCkge1xuICB2YXIgcmVjb3JkO1xuICByZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLmZpbmRPbmUoe1xuICAgIF9pZDogcmVjb3JkSWRzLmlkc1swXSxcbiAgICBpbnN0YW5jZXM6IHtcbiAgICAgICRleGlzdHM6IHRydWVcbiAgICB9XG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGluc3RhbmNlczogMVxuICAgIH1cbiAgfSk7XG4gIGlmIChyZWNvcmQgJiYgcmVjb3JkLmluc3RhbmNlc1swXS5zdGF0ZSAhPT0gJ2NvbXBsZXRlZCcgJiYgQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZChyZWNvcmQuaW5zdGFuY2VzWzBdLl9pZCkuY291bnQoKSA+IDApIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuatpOiusOW9leW3suWPkei1t+a1geeoi+ato+WcqOWuoeaJueS4re+8jOW+heWuoeaJuee7k+adn+aWueWPr+WPkei1t+S4i+S4gOasoeWuoeaJue+8gVwiKTtcbiAgfVxufTtcbiIsInN0ZWVkb3NBdXRoID0gcmVxdWlyZShcIkBzdGVlZG9zL2F1dGhcIilcbkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9zMy9cIiwgIChyZXEsIHJlcywgbmV4dCkgLT5cblxuXHRKc29uUm91dGVzLnBhcnNlRmlsZXMgcmVxLCByZXMsICgpLT5cblx0XHRjb2xsZWN0aW9uID0gY2ZzLmZpbGVzXG5cdFx0ZmlsZUNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldE9iamVjdChcImNtc19maWxlc1wiKS5kYlxuXG5cdFx0aWYgcmVxLmZpbGVzIGFuZCByZXEuZmlsZXNbMF1cblxuXHRcdFx0bmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XG5cdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEgcmVxLmZpbGVzWzBdLmRhdGEsIHt0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGV9LCAoZXJyKSAtPlxuXHRcdFx0XHRmaWxlbmFtZSA9IHJlcS5maWxlc1swXS5maWxlbmFtZVxuXHRcdFx0XHRleHRlbnRpb24gPSBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpXG5cdFx0XHRcdGlmIFtcImltYWdlLmpwZ1wiLCBcImltYWdlLmdpZlwiLCBcImltYWdlLmpwZWdcIiwgXCJpbWFnZS5wbmdcIl0uaW5jbHVkZXMoZmlsZW5hbWUudG9Mb3dlckNhc2UoKSlcblx0XHRcdFx0XHRmaWxlbmFtZSA9IFwiaW1hZ2UtXCIgKyBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KCdZWVlZTU1EREhIbW1zcycpICsgXCIuXCIgKyBleHRlbnRpb25cblxuXHRcdFx0XHRib2R5ID0gcmVxLmJvZHlcblx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0aWYgYm9keSAmJiAoYm9keVsndXBsb2FkX2Zyb20nXSBpcyBcIklFXCIgb3IgYm9keVsndXBsb2FkX2Zyb20nXSBpcyBcIm5vZGVcIilcblx0XHRcdFx0XHRcdGZpbGVuYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KGZpbGVuYW1lKVxuXHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihmaWxlbmFtZSlcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIGVcblx0XHRcdFx0XHRmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoLyUvZywgXCItXCIpXG5cblx0XHRcdFx0bmV3RmlsZS5uYW1lKGZpbGVuYW1lKVxuXG5cdFx0XHRcdGlmIGJvZHkgJiYgYm9keVsnb3duZXInXSAmJiBib2R5WydzcGFjZSddICYmIGJvZHlbJ3JlY29yZF9pZCddICAmJiBib2R5WydvYmplY3RfbmFtZSddXG5cdFx0XHRcdFx0cGFyZW50ID0gYm9keVsncGFyZW50J11cblx0XHRcdFx0XHRvd25lciA9IGJvZHlbJ293bmVyJ11cblx0XHRcdFx0XHRvd25lcl9uYW1lID0gYm9keVsnb3duZXJfbmFtZSddXG5cdFx0XHRcdFx0c3BhY2UgPSBib2R5WydzcGFjZSddXG5cdFx0XHRcdFx0cmVjb3JkX2lkID0gYm9keVsncmVjb3JkX2lkJ11cblx0XHRcdFx0XHRvYmplY3RfbmFtZSA9IGJvZHlbJ29iamVjdF9uYW1lJ11cblx0XHRcdFx0XHRkZXNjcmlwdGlvbiA9IGJvZHlbJ2Rlc2NyaXB0aW9uJ11cblx0XHRcdFx0XHRwYXJlbnQgPSBib2R5WydwYXJlbnQnXVxuXHRcdFx0XHRcdG1ldGFkYXRhID0ge293bmVyOm93bmVyLCBvd25lcl9uYW1lOm93bmVyX25hbWUsIHNwYWNlOnNwYWNlLCByZWNvcmRfaWQ6cmVjb3JkX2lkLCBvYmplY3RfbmFtZTogb2JqZWN0X25hbWV9XG5cdFx0XHRcdFx0aWYgcGFyZW50XG5cdFx0XHRcdFx0XHRtZXRhZGF0YS5wYXJlbnQgPSBwYXJlbnRcblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGFcblx0XHRcdFx0XHRmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxuXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxuXG5cblx0XHRcdFx0c2l6ZSA9IGZpbGVPYmoub3JpZ2luYWwuc2l6ZVxuXHRcdFx0XHRpZiAhc2l6ZVxuXHRcdFx0XHRcdHNpemUgPSAxMDI0XG5cdFx0XHRcdGlmIHBhcmVudFxuXHRcdFx0XHRcdGZpbGVDb2xsZWN0aW9uLnVwZGF0ZSh7X2lkOnBhcmVudH0se1xuXHRcdFx0XHRcdFx0JHNldDpcblx0XHRcdFx0XHRcdFx0bmFtZTogZmlsZW5hbWVcblx0XHRcdFx0XHRcdFx0ZXh0ZW50aW9uOiBleHRlbnRpb25cblx0XHRcdFx0XHRcdFx0c2l6ZTogc2l6ZVxuXHRcdFx0XHRcdFx0XHRtb2RpZmllZDogKG5ldyBEYXRlKCkpXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiBvd25lclxuXHRcdFx0XHRcdFx0JHB1c2g6XG5cdFx0XHRcdFx0XHRcdHZlcnNpb25zOlxuXHRcdFx0XHRcdFx0XHRcdCRlYWNoOiBbIGZpbGVPYmouX2lkIF1cblx0XHRcdFx0XHRcdFx0XHQkcG9zaXRpb246IDBcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0bmV3RmlsZU9iaklkID0gZmlsZUNvbGxlY3Rpb24uZGlyZWN0Lmluc2VydCB7XG5cdFx0XHRcdFx0XHRuYW1lOiBmaWxlbmFtZVxuXHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uXG5cdFx0XHRcdFx0XHRleHRlbnRpb246IGV4dGVudGlvblxuXHRcdFx0XHRcdFx0c2l6ZTogc2l6ZVxuXHRcdFx0XHRcdFx0dmVyc2lvbnM6IFtmaWxlT2JqLl9pZF1cblx0XHRcdFx0XHRcdHBhcmVudDoge286b2JqZWN0X25hbWUsaWRzOltyZWNvcmRfaWRdfVxuXHRcdFx0XHRcdFx0b3duZXI6IG93bmVyXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2Vcblx0XHRcdFx0XHRcdGNyZWF0ZWQ6IChuZXcgRGF0ZSgpKVxuXHRcdFx0XHRcdFx0Y3JlYXRlZF9ieTogb3duZXJcblx0XHRcdFx0XHRcdG1vZGlmaWVkOiAobmV3IERhdGUoKSlcblx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiBvd25lclxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRmaWxlT2JqLnVwZGF0ZSh7JHNldDogeydtZXRhZGF0YS5wYXJlbnQnIDogbmV3RmlsZU9iaklkfX0pXG5cblx0XHRcdG5ld0ZpbGUub25jZSAnc3RvcmVkJywgKHN0b3JlTmFtZSktPlxuXHRcdFx0XHRzaXplID0gbmV3RmlsZS5vcmlnaW5hbC5zaXplXG5cdFx0XHRcdGlmICFzaXplXG5cdFx0XHRcdFx0c2l6ZSA9IDEwMjRcblx0XHRcdFx0cmVzcCA9XG5cdFx0XHRcdFx0dmVyc2lvbl9pZDogbmV3RmlsZS5faWQsXG5cdFx0XHRcdFx0c2l6ZTogc2l6ZVxuXHRcdFx0XHRyZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcblx0XHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0cmVzLnN0YXR1c0NvZGUgPSA1MDA7XG5cdFx0XHRyZXMuZW5kKCk7XG5cbkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9zMy86Y29sbGVjdGlvblwiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblxuXHRcdHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYygocmVxLCByZXMsIGNiKS0+XG5cdFx0XHRzdGVlZG9zQXV0aC5hdXRoKHJlcSwgcmVzKS50aGVuIChyZXNvbHZlLCByZWplY3QpLT5cblx0XHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxuXHRcdCkocmVxLCByZXMpXG5cdFx0dXNlcklkID0gdXNlclNlc3Npb24udXNlcklkXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKVxuXG5cdFx0Y29sbGVjdGlvbk5hbWUgPSByZXEucGFyYW1zLmNvbGxlY3Rpb25cblxuXHRcdEpzb25Sb3V0ZXMucGFyc2VGaWxlcyByZXEsIHJlcywgKCktPlxuXHRcdFx0Y29sbGVjdGlvbiA9IGNmc1tjb2xsZWN0aW9uTmFtZV1cblxuXHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gQ29sbGVjdGlvblwiKVxuXG5cdFx0XHRpZiByZXEuZmlsZXMgYW5kIHJlcS5maWxlc1swXVxuXG5cdFx0XHRcdG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpXG5cdFx0XHRcdG5ld0ZpbGUubmFtZShyZXEuZmlsZXNbMF0uZmlsZW5hbWUpXG5cblx0XHRcdFx0aWYgcmVxLmJvZHlcblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gcmVxLmJvZHlcblxuXHRcdFx0XHRuZXdGaWxlLm93bmVyID0gdXNlcklkXG5cdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEub3duZXIgPSB1c2VySWRcblxuXHRcdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEgcmVxLmZpbGVzWzBdLmRhdGEsIHt0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGV9XG5cblx0XHRcdFx0Y29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxuXG5cdFx0XHRcdG5ld0ZpbGUub25jZSAnc3RvcmVkJywgKHN0b3JlTmFtZSktPlxuXHRcdFx0XHRcdHJlc3VsdERhdGEgPSBjb2xsZWN0aW9uLmZpbGVzLmZpbmRPbmUobmV3RmlsZS5faWQpXG5cdFx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdFx0XHRcdGNvZGU6IDIwMFxuXHRcdFx0XHRcdFx0ZGF0YTogcmVzdWx0RGF0YVxuXHRcdFx0XHRcdHJldHVyblxuXG5cdFx0XHRcdFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBGaWxlXCIpXG5cblx0XHRyZXR1cm5cblx0Y2F0Y2ggZVxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdGNvZGU6IGUuZXJyb3IgfHwgNTAwXG5cdFx0XHRkYXRhOiB7ZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2V9XG5cdFx0fVxuXG5cblxuZ2V0UXVlcnlTdHJpbmcgPSAoYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgcXVlcnksIG1ldGhvZCkgLT5cblx0Y29uc29sZS5sb2cgXCItLS0tdXVmbG93TWFuYWdlci5nZXRRdWVyeVN0cmluZy0tLS1cIlxuXHRBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJylcblx0ZGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpXG5cblx0cXVlcnkuRm9ybWF0ID0gXCJqc29uXCJcblx0cXVlcnkuVmVyc2lvbiA9IFwiMjAxNy0wMy0yMVwiXG5cdHF1ZXJ5LkFjY2Vzc0tleUlkID0gYWNjZXNzS2V5SWRcblx0cXVlcnkuU2lnbmF0dXJlTWV0aG9kID0gXCJITUFDLVNIQTFcIlxuXHRxdWVyeS5UaW1lc3RhbXAgPSBBTFkudXRpbC5kYXRlLmlzbzg2MDEoZGF0ZSlcblx0cXVlcnkuU2lnbmF0dXJlVmVyc2lvbiA9IFwiMS4wXCJcblx0cXVlcnkuU2lnbmF0dXJlTm9uY2UgPSBTdHJpbmcoZGF0ZS5nZXRUaW1lKCkpXG5cblx0cXVlcnlLZXlzID0gT2JqZWN0LmtleXMocXVlcnkpXG5cdHF1ZXJ5S2V5cy5zb3J0KClcblxuXHRjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcgPSBcIlwiXG5cdHF1ZXJ5S2V5cy5mb3JFYWNoIChuYW1lKSAtPlxuXHRcdGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyArPSBcIiZcIiArIG5hbWUgKyBcIj1cIiArIEFMWS51dGlsLnBvcEVzY2FwZShxdWVyeVtuYW1lXSlcblxuXHRzdHJpbmdUb1NpZ24gPSBtZXRob2QudG9VcHBlckNhc2UoKSArICcmJTJGJicgKyBBTFkudXRpbC5wb3BFc2NhcGUoY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nLnN1YnN0cigxKSlcblxuXHRxdWVyeS5TaWduYXR1cmUgPSBBTFkudXRpbC5jcnlwdG8uaG1hYyhzZWNyZXRBY2Nlc3NLZXkgKyAnJicsIHN0cmluZ1RvU2lnbiwgJ2Jhc2U2NCcsICdzaGExJylcblxuXHRxdWVyeVN0ciA9IEFMWS51dGlsLnF1ZXJ5UGFyYW1zVG9TdHJpbmcocXVlcnkpXG5cdGNvbnNvbGUubG9nIHF1ZXJ5U3RyXG5cdHJldHVybiBxdWVyeVN0clxuXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvczMvdm9kL3VwbG9hZFwiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKVxuXG5cdFx0Y29sbGVjdGlvbk5hbWUgPSBcInZpZGVvc1wiXG5cblx0XHRBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJylcblxuXHRcdEpzb25Sb3V0ZXMucGFyc2VGaWxlcyByZXEsIHJlcywgKCktPlxuXHRcdFx0Y29sbGVjdGlvbiA9IGNmc1tjb2xsZWN0aW9uTmFtZV1cblxuXHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gQ29sbGVjdGlvblwiKVxuXG5cdFx0XHRpZiByZXEuZmlsZXMgYW5kIHJlcS5maWxlc1swXVxuXG5cdFx0XHRcdGlmIGNvbGxlY3Rpb25OYW1lIGlzICd2aWRlb3MnIGFuZCBNZXRlb3Iuc2V0dGluZ3MucHVibGljLmNmcz8uc3RvcmUgaXMgXCJPU1NcIlxuXHRcdFx0XHRcdGFjY2Vzc0tleUlkID0gTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4/LmFjY2Vzc0tleUlkXG5cdFx0XHRcdFx0c2VjcmV0QWNjZXNzS2V5ID0gTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4/LnNlY3JldEFjY2Vzc0tleVxuXG5cdFx0XHRcdFx0ZGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpXG5cblx0XHRcdFx0XHRxdWVyeSA9IHtcblx0XHRcdFx0XHRcdEFjdGlvbjogXCJDcmVhdGVVcGxvYWRWaWRlb1wiXG5cdFx0XHRcdFx0XHRUaXRsZTogcmVxLmZpbGVzWzBdLmZpbGVuYW1lXG5cdFx0XHRcdFx0XHRGaWxlTmFtZTogcmVxLmZpbGVzWzBdLmZpbGVuYW1lXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dXJsID0gXCJodHRwOi8vdm9kLmNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS8/XCIgKyBnZXRRdWVyeVN0cmluZyhhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBxdWVyeSwgJ0dFVCcpXG5cblx0XHRcdFx0XHRyID0gSFRUUC5jYWxsICdHRVQnLCB1cmxcblxuXHRcdFx0XHRcdGNvbnNvbGUubG9nIHJcblxuXHRcdFx0XHRcdGlmIHIuZGF0YT8uVmlkZW9JZFxuXHRcdFx0XHRcdFx0dmlkZW9JZCA9IHIuZGF0YS5WaWRlb0lkXG5cdFx0XHRcdFx0XHR1cGxvYWRBZGRyZXNzID0gSlNPTi5wYXJzZShuZXcgQnVmZmVyKHIuZGF0YS5VcGxvYWRBZGRyZXNzLCAnYmFzZTY0JykudG9TdHJpbmcoKSlcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nIHVwbG9hZEFkZHJlc3Ncblx0XHRcdFx0XHRcdHVwbG9hZEF1dGggPSBKU09OLnBhcnNlKG5ldyBCdWZmZXIoci5kYXRhLlVwbG9hZEF1dGgsICdiYXNlNjQnKS50b1N0cmluZygpKVxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cgdXBsb2FkQXV0aFxuXG5cdFx0XHRcdFx0XHRvc3MgPSBuZXcgQUxZLk9TUyh7XG5cdFx0XHRcdFx0XHRcdFwiYWNjZXNzS2V5SWRcIjogdXBsb2FkQXV0aC5BY2Nlc3NLZXlJZCxcblx0XHRcdFx0XHRcdFx0XCJzZWNyZXRBY2Nlc3NLZXlcIjogdXBsb2FkQXV0aC5BY2Nlc3NLZXlTZWNyZXQsXG5cdFx0XHRcdFx0XHRcdFwiZW5kcG9pbnRcIjogdXBsb2FkQWRkcmVzcy5FbmRwb2ludCxcblx0XHRcdFx0XHRcdFx0XCJhcGlWZXJzaW9uXCI6ICcyMDEzLTEwLTE1Jyxcblx0XHRcdFx0XHRcdFx0XCJzZWN1cml0eVRva2VuXCI6IHVwbG9hZEF1dGguU2VjdXJpdHlUb2tlblxuXHRcdFx0XHRcdFx0fSlcblxuXHRcdFx0XHRcdFx0b3NzLnB1dE9iamVjdCB7XG5cdFx0XHRcdFx0XHRcdEJ1Y2tldDogdXBsb2FkQWRkcmVzcy5CdWNrZXQsXG5cdFx0XHRcdFx0XHRcdEtleTogdXBsb2FkQWRkcmVzcy5GaWxlTmFtZSxcblx0XHRcdFx0XHRcdFx0Qm9keTogcmVxLmZpbGVzWzBdLmRhdGEsXG5cdFx0XHRcdFx0XHRcdEFjY2Vzc0NvbnRyb2xBbGxvd09yaWdpbjogJycsXG5cdFx0XHRcdFx0XHRcdENvbnRlbnRUeXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGUsXG5cdFx0XHRcdFx0XHRcdENhY2hlQ29udHJvbDogJ25vLWNhY2hlJyxcblx0XHRcdFx0XHRcdFx0Q29udGVudERpc3Bvc2l0aW9uOiAnJyxcblx0XHRcdFx0XHRcdFx0Q29udGVudEVuY29kaW5nOiAndXRmLTgnLFxuXHRcdFx0XHRcdFx0XHRTZXJ2ZXJTaWRlRW5jcnlwdGlvbjogJ0FFUzI1NicsXG5cdFx0XHRcdFx0XHRcdEV4cGlyZXM6IG51bGxcblx0XHRcdFx0XHRcdH0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQgKGVyciwgZGF0YSkgLT5cblxuXHRcdFx0XHRcdFx0XHRpZiBlcnJcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnZXJyb3I6JywgZXJyKVxuXHRcdFx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlcnIubWVzc2FnZSlcblxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnc3VjY2VzczonLCBkYXRhKVxuXG5cdFx0XHRcdFx0XHRcdG5ld0RhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKVxuXG5cdFx0XHRcdFx0XHRcdGdldFBsYXlJbmZvUXVlcnkgPSB7XG5cdFx0XHRcdFx0XHRcdFx0QWN0aW9uOiAnR2V0UGxheUluZm8nXG5cdFx0XHRcdFx0XHRcdFx0VmlkZW9JZDogdmlkZW9JZFxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Z2V0UGxheUluZm9VcmwgPSBcImh0dHA6Ly92b2QuY24tc2hhbmdoYWkuYWxpeXVuY3MuY29tLz9cIiArIGdldFF1ZXJ5U3RyaW5nKGFjY2Vzc0tleUlkLCBzZWNyZXRBY2Nlc3NLZXksIGdldFBsYXlJbmZvUXVlcnksICdHRVQnKVxuXG5cdFx0XHRcdFx0XHRcdGdldFBsYXlJbmZvUmVzdWx0ID0gSFRUUC5jYWxsICdHRVQnLCBnZXRQbGF5SW5mb1VybFxuXG5cdFx0XHRcdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRcdFx0XHRcdFx0Y29kZTogMjAwXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YTogZ2V0UGxheUluZm9SZXN1bHRcblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBGaWxlXCIpXG5cblx0XHRyZXR1cm5cblx0Y2F0Y2ggZVxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdGNvZGU6IGUuZXJyb3IgfHwgNTAwXG5cdFx0XHRkYXRhOiB7ZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2V9XG5cdFx0fSIsInZhciBnZXRRdWVyeVN0cmluZywgc3RlZWRvc0F1dGg7XG5cbnN0ZWVkb3NBdXRoID0gcmVxdWlyZShcIkBzdGVlZG9zL2F1dGhcIik7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9zMy9cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyhyZXEsIHJlcywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGZpbGVDb2xsZWN0aW9uLCBuZXdGaWxlO1xuICAgIGNvbGxlY3Rpb24gPSBjZnMuZmlsZXM7XG4gICAgZmlsZUNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldE9iamVjdChcImNtc19maWxlc1wiKS5kYjtcbiAgICBpZiAocmVxLmZpbGVzICYmIHJlcS5maWxlc1swXSkge1xuICAgICAgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XG4gICAgICBuZXdGaWxlLmF0dGFjaERhdGEocmVxLmZpbGVzWzBdLmRhdGEsIHtcbiAgICAgICAgdHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlXG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdmFyIGJvZHksIGRlc2NyaXB0aW9uLCBlLCBleHRlbnRpb24sIGZpbGVPYmosIGZpbGVuYW1lLCBtZXRhZGF0YSwgbmV3RmlsZU9iaklkLCBvYmplY3RfbmFtZSwgb3duZXIsIG93bmVyX25hbWUsIHBhcmVudCwgcmVjb3JkX2lkLCBzaXplLCBzcGFjZTtcbiAgICAgICAgZmlsZW5hbWUgPSByZXEuZmlsZXNbMF0uZmlsZW5hbWU7XG4gICAgICAgIGV4dGVudGlvbiA9IGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICAgIGlmIChbXCJpbWFnZS5qcGdcIiwgXCJpbWFnZS5naWZcIiwgXCJpbWFnZS5qcGVnXCIsIFwiaW1hZ2UucG5nXCJdLmluY2x1ZGVzKGZpbGVuYW1lLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgZmlsZW5hbWUgPSBcImltYWdlLVwiICsgbW9tZW50KG5ldyBEYXRlKCkpLmZvcm1hdCgnWVlZWU1NRERISG1tc3MnKSArIFwiLlwiICsgZXh0ZW50aW9uO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkgPSByZXEuYm9keTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoYm9keSAmJiAoYm9keVsndXBsb2FkX2Zyb20nXSA9PT0gXCJJRVwiIHx8IGJvZHlbJ3VwbG9hZF9mcm9tJ10gPT09IFwibm9kZVwiKSkge1xuICAgICAgICAgICAgZmlsZW5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQoZmlsZW5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihmaWxlbmFtZSk7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoLyUvZywgXCItXCIpO1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUubmFtZShmaWxlbmFtZSk7XG4gICAgICAgIGlmIChib2R5ICYmIGJvZHlbJ293bmVyJ10gJiYgYm9keVsnc3BhY2UnXSAmJiBib2R5WydyZWNvcmRfaWQnXSAmJiBib2R5WydvYmplY3RfbmFtZSddKSB7XG4gICAgICAgICAgcGFyZW50ID0gYm9keVsncGFyZW50J107XG4gICAgICAgICAgb3duZXIgPSBib2R5Wydvd25lciddO1xuICAgICAgICAgIG93bmVyX25hbWUgPSBib2R5Wydvd25lcl9uYW1lJ107XG4gICAgICAgICAgc3BhY2UgPSBib2R5WydzcGFjZSddO1xuICAgICAgICAgIHJlY29yZF9pZCA9IGJvZHlbJ3JlY29yZF9pZCddO1xuICAgICAgICAgIG9iamVjdF9uYW1lID0gYm9keVsnb2JqZWN0X25hbWUnXTtcbiAgICAgICAgICBkZXNjcmlwdGlvbiA9IGJvZHlbJ2Rlc2NyaXB0aW9uJ107XG4gICAgICAgICAgcGFyZW50ID0gYm9keVsncGFyZW50J107XG4gICAgICAgICAgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICBvd25lcl9uYW1lOiBvd25lcl9uYW1lLFxuICAgICAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICAgICAgcmVjb3JkX2lkOiByZWNvcmRfaWQsXG4gICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgc2l6ZSA9IGZpbGVPYmoub3JpZ2luYWwuc2l6ZTtcbiAgICAgICAgaWYgKCFzaXplKSB7XG4gICAgICAgICAgc2l6ZSA9IDEwMjQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgIHJldHVybiBmaWxlQ29sbGVjdGlvbi51cGRhdGUoe1xuICAgICAgICAgICAgX2lkOiBwYXJlbnRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgIG5hbWU6IGZpbGVuYW1lLFxuICAgICAgICAgICAgICBleHRlbnRpb246IGV4dGVudGlvbixcbiAgICAgICAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgICAgICAgbW9kaWZpZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICAgIG1vZGlmaWVkX2J5OiBvd25lclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICRwdXNoOiB7XG4gICAgICAgICAgICAgIHZlcnNpb25zOiB7XG4gICAgICAgICAgICAgICAgJGVhY2g6IFtmaWxlT2JqLl9pZF0sXG4gICAgICAgICAgICAgICAgJHBvc2l0aW9uOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdGaWxlT2JqSWQgPSBmaWxlQ29sbGVjdGlvbi5kaXJlY3QuaW5zZXJ0KHtcbiAgICAgICAgICAgIG5hbWU6IGZpbGVuYW1lLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgZXh0ZW50aW9uOiBleHRlbnRpb24sXG4gICAgICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICAgICAgdmVyc2lvbnM6IFtmaWxlT2JqLl9pZF0sXG4gICAgICAgICAgICBwYXJlbnQ6IHtcbiAgICAgICAgICAgICAgbzogb2JqZWN0X25hbWUsXG4gICAgICAgICAgICAgIGlkczogW3JlY29yZF9pZF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgY3JlYXRlZF9ieTogb3duZXIsXG4gICAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIG1vZGlmaWVkX2J5OiBvd25lclxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBmaWxlT2JqLnVwZGF0ZSh7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICdtZXRhZGF0YS5wYXJlbnQnOiBuZXdGaWxlT2JqSWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gbmV3RmlsZS5vbmNlKCdzdG9yZWQnLCBmdW5jdGlvbihzdG9yZU5hbWUpIHtcbiAgICAgICAgdmFyIHJlc3AsIHNpemU7XG4gICAgICAgIHNpemUgPSBuZXdGaWxlLm9yaWdpbmFsLnNpemU7XG4gICAgICAgIGlmICghc2l6ZSkge1xuICAgICAgICAgIHNpemUgPSAxMDI0O1xuICAgICAgICB9XG4gICAgICAgIHJlc3AgPSB7XG4gICAgICAgICAgdmVyc2lvbl9pZDogbmV3RmlsZS5faWQsXG4gICAgICAgICAgc2l6ZTogc2l6ZVxuICAgICAgICB9O1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgIHJldHVybiByZXMuZW5kKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvczMvOmNvbGxlY3Rpb25cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGNvbGxlY3Rpb25OYW1lLCBlLCB1c2VySWQsIHVzZXJTZXNzaW9uO1xuICB0cnkge1xuICAgIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihyZXEsIHJlcywgY2IpIHtcbiAgICAgIHJldHVybiBzdGVlZG9zQXV0aC5hdXRoKHJlcSwgcmVzKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgIH0pO1xuICAgIH0pKHJlcSwgcmVzKTtcbiAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWQ7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIHBlcm1pc3Npb25cIik7XG4gICAgfVxuICAgIGNvbGxlY3Rpb25OYW1lID0gcmVxLnBhcmFtcy5jb2xsZWN0aW9uO1xuICAgIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyhyZXEsIHJlcywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgbmV3RmlsZTtcbiAgICAgIGNvbGxlY3Rpb24gPSBjZnNbY29sbGVjdGlvbk5hbWVdO1xuICAgICAgaWYgKCFjb2xsZWN0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIENvbGxlY3Rpb25cIik7XG4gICAgICB9XG4gICAgICBpZiAocmVxLmZpbGVzICYmIHJlcS5maWxlc1swXSkge1xuICAgICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgICAgbmV3RmlsZS5uYW1lKHJlcS5maWxlc1swXS5maWxlbmFtZSk7XG4gICAgICAgIGlmIChyZXEuYm9keSkge1xuICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSByZXEuYm9keTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm93bmVyID0gdXNlcklkO1xuICAgICAgICBuZXdGaWxlLm1ldGFkYXRhLm93bmVyID0gdXNlcklkO1xuICAgICAgICBuZXdGaWxlLmF0dGFjaERhdGEocmVxLmZpbGVzWzBdLmRhdGEsIHtcbiAgICAgICAgICB0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGVcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbGxlY3Rpb24uaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgICByZXR1cm4gbmV3RmlsZS5vbmNlKCdzdG9yZWQnLCBmdW5jdGlvbihzdG9yZU5hbWUpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0RGF0YTtcbiAgICAgICAgICByZXN1bHREYXRhID0gY29sbGVjdGlvbi5maWxlcy5maW5kT25lKG5ld0ZpbGUuX2lkKTtcbiAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiByZXN1bHREYXRhXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gRmlsZVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogZS5lcnJvciB8fCA1MDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuXG5nZXRRdWVyeVN0cmluZyA9IGZ1bmN0aW9uKGFjY2Vzc0tleUlkLCBzZWNyZXRBY2Nlc3NLZXksIHF1ZXJ5LCBtZXRob2QpIHtcbiAgdmFyIEFMWSwgY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nLCBkYXRlLCBxdWVyeUtleXMsIHF1ZXJ5U3RyLCBzdHJpbmdUb1NpZ247XG4gIGNvbnNvbGUubG9nKFwiLS0tLXV1Zmxvd01hbmFnZXIuZ2V0UXVlcnlTdHJpbmctLS0tXCIpO1xuICBBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJyk7XG4gIGRhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKTtcbiAgcXVlcnkuRm9ybWF0ID0gXCJqc29uXCI7XG4gIHF1ZXJ5LlZlcnNpb24gPSBcIjIwMTctMDMtMjFcIjtcbiAgcXVlcnkuQWNjZXNzS2V5SWQgPSBhY2Nlc3NLZXlJZDtcbiAgcXVlcnkuU2lnbmF0dXJlTWV0aG9kID0gXCJITUFDLVNIQTFcIjtcbiAgcXVlcnkuVGltZXN0YW1wID0gQUxZLnV0aWwuZGF0ZS5pc284NjAxKGRhdGUpO1xuICBxdWVyeS5TaWduYXR1cmVWZXJzaW9uID0gXCIxLjBcIjtcbiAgcXVlcnkuU2lnbmF0dXJlTm9uY2UgPSBTdHJpbmcoZGF0ZS5nZXRUaW1lKCkpO1xuICBxdWVyeUtleXMgPSBPYmplY3Qua2V5cyhxdWVyeSk7XG4gIHF1ZXJ5S2V5cy5zb3J0KCk7XG4gIGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyA9IFwiXCI7XG4gIHF1ZXJ5S2V5cy5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nICs9IFwiJlwiICsgbmFtZSArIFwiPVwiICsgQUxZLnV0aWwucG9wRXNjYXBlKHF1ZXJ5W25hbWVdKTtcbiAgfSk7XG4gIHN0cmluZ1RvU2lnbiA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpICsgJyYlMkYmJyArIEFMWS51dGlsLnBvcEVzY2FwZShjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcuc3Vic3RyKDEpKTtcbiAgcXVlcnkuU2lnbmF0dXJlID0gQUxZLnV0aWwuY3J5cHRvLmhtYWMoc2VjcmV0QWNjZXNzS2V5ICsgJyYnLCBzdHJpbmdUb1NpZ24sICdiYXNlNjQnLCAnc2hhMScpO1xuICBxdWVyeVN0ciA9IEFMWS51dGlsLnF1ZXJ5UGFyYW1zVG9TdHJpbmcocXVlcnkpO1xuICBjb25zb2xlLmxvZyhxdWVyeVN0cik7XG4gIHJldHVybiBxdWVyeVN0cjtcbn07XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9zMy92b2QvdXBsb2FkXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBBTFksIGNvbGxlY3Rpb25OYW1lLCBlLCB1c2VySWQ7XG4gIHRyeSB7XG4gICAgdXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKTtcbiAgICB9XG4gICAgY29sbGVjdGlvbk5hbWUgPSBcInZpZGVvc1wiO1xuICAgIEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKTtcbiAgICBKc29uUm91dGVzLnBhcnNlRmlsZXMocmVxLCByZXMsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFjY2Vzc0tleUlkLCBjb2xsZWN0aW9uLCBkYXRlLCBvc3MsIHF1ZXJ5LCByLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHNlY3JldEFjY2Vzc0tleSwgdXBsb2FkQWRkcmVzcywgdXBsb2FkQXV0aCwgdXJsLCB2aWRlb0lkO1xuICAgICAgY29sbGVjdGlvbiA9IGNmc1tjb2xsZWN0aW9uTmFtZV07XG4gICAgICBpZiAoIWNvbGxlY3Rpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gQ29sbGVjdGlvblwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXEuZmlsZXMgJiYgcmVxLmZpbGVzWzBdKSB7XG4gICAgICAgIGlmIChjb2xsZWN0aW9uTmFtZSA9PT0gJ3ZpZGVvcycgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0uY2ZzKSAhPSBudWxsID8gcmVmLnN0b3JlIDogdm9pZCAwKSA9PT0gXCJPU1NcIikge1xuICAgICAgICAgIGFjY2Vzc0tleUlkID0gKHJlZjEgPSBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bikgIT0gbnVsbCA/IHJlZjEuYWNjZXNzS2V5SWQgOiB2b2lkIDA7XG4gICAgICAgICAgc2VjcmV0QWNjZXNzS2V5ID0gKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bikgIT0gbnVsbCA/IHJlZjIuc2VjcmV0QWNjZXNzS2V5IDogdm9pZCAwO1xuICAgICAgICAgIGRhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKTtcbiAgICAgICAgICBxdWVyeSA9IHtcbiAgICAgICAgICAgIEFjdGlvbjogXCJDcmVhdGVVcGxvYWRWaWRlb1wiLFxuICAgICAgICAgICAgVGl0bGU6IHJlcS5maWxlc1swXS5maWxlbmFtZSxcbiAgICAgICAgICAgIEZpbGVOYW1lOiByZXEuZmlsZXNbMF0uZmlsZW5hbWVcbiAgICAgICAgICB9O1xuICAgICAgICAgIHVybCA9IFwiaHR0cDovL3ZvZC5jbi1zaGFuZ2hhaS5hbGl5dW5jcy5jb20vP1wiICsgZ2V0UXVlcnlTdHJpbmcoYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgcXVlcnksICdHRVQnKTtcbiAgICAgICAgICByID0gSFRUUC5jYWxsKCdHRVQnLCB1cmwpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHIpO1xuICAgICAgICAgIGlmICgocmVmMyA9IHIuZGF0YSkgIT0gbnVsbCA/IHJlZjMuVmlkZW9JZCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgdmlkZW9JZCA9IHIuZGF0YS5WaWRlb0lkO1xuICAgICAgICAgICAgdXBsb2FkQWRkcmVzcyA9IEpTT04ucGFyc2UobmV3IEJ1ZmZlcihyLmRhdGEuVXBsb2FkQWRkcmVzcywgJ2Jhc2U2NCcpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codXBsb2FkQWRkcmVzcyk7XG4gICAgICAgICAgICB1cGxvYWRBdXRoID0gSlNPTi5wYXJzZShuZXcgQnVmZmVyKHIuZGF0YS5VcGxvYWRBdXRoLCAnYmFzZTY0JykudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1cGxvYWRBdXRoKTtcbiAgICAgICAgICAgIG9zcyA9IG5ldyBBTFkuT1NTKHtcbiAgICAgICAgICAgICAgXCJhY2Nlc3NLZXlJZFwiOiB1cGxvYWRBdXRoLkFjY2Vzc0tleUlkLFxuICAgICAgICAgICAgICBcInNlY3JldEFjY2Vzc0tleVwiOiB1cGxvYWRBdXRoLkFjY2Vzc0tleVNlY3JldCxcbiAgICAgICAgICAgICAgXCJlbmRwb2ludFwiOiB1cGxvYWRBZGRyZXNzLkVuZHBvaW50LFxuICAgICAgICAgICAgICBcImFwaVZlcnNpb25cIjogJzIwMTMtMTAtMTUnLFxuICAgICAgICAgICAgICBcInNlY3VyaXR5VG9rZW5cIjogdXBsb2FkQXV0aC5TZWN1cml0eVRva2VuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBvc3MucHV0T2JqZWN0KHtcbiAgICAgICAgICAgICAgQnVja2V0OiB1cGxvYWRBZGRyZXNzLkJ1Y2tldCxcbiAgICAgICAgICAgICAgS2V5OiB1cGxvYWRBZGRyZXNzLkZpbGVOYW1lLFxuICAgICAgICAgICAgICBCb2R5OiByZXEuZmlsZXNbMF0uZGF0YSxcbiAgICAgICAgICAgICAgQWNjZXNzQ29udHJvbEFsbG93T3JpZ2luOiAnJyxcbiAgICAgICAgICAgICAgQ29udGVudFR5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZSxcbiAgICAgICAgICAgICAgQ2FjaGVDb250cm9sOiAnbm8tY2FjaGUnLFxuICAgICAgICAgICAgICBDb250ZW50RGlzcG9zaXRpb246ICcnLFxuICAgICAgICAgICAgICBDb250ZW50RW5jb2Rpbmc6ICd1dGYtOCcsXG4gICAgICAgICAgICAgIFNlcnZlclNpZGVFbmNyeXB0aW9uOiAnQUVTMjU2JyxcbiAgICAgICAgICAgICAgRXhwaXJlczogbnVsbFxuICAgICAgICAgICAgfSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgICAgdmFyIGdldFBsYXlJbmZvUXVlcnksIGdldFBsYXlJbmZvUmVzdWx0LCBnZXRQbGF5SW5mb1VybCwgbmV3RGF0ZTtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjonLCBlcnIpO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3N1Y2Nlc3M6JywgZGF0YSk7XG4gICAgICAgICAgICAgIG5ld0RhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKTtcbiAgICAgICAgICAgICAgZ2V0UGxheUluZm9RdWVyeSA9IHtcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdHZXRQbGF5SW5mbycsXG4gICAgICAgICAgICAgICAgVmlkZW9JZDogdmlkZW9JZFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBnZXRQbGF5SW5mb1VybCA9IFwiaHR0cDovL3ZvZC5jbi1zaGFuZ2hhaS5hbGl5dW5jcy5jb20vP1wiICsgZ2V0UXVlcnlTdHJpbmcoYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgZ2V0UGxheUluZm9RdWVyeSwgJ0dFVCcpO1xuICAgICAgICAgICAgICBnZXRQbGF5SW5mb1Jlc3VsdCA9IEhUVFAuY2FsbCgnR0VUJywgZ2V0UGxheUluZm9VcmwpO1xuICAgICAgICAgICAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBnZXRQbGF5SW5mb1Jlc3VsdFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIEZpbGVcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IGUuZXJyb3IgfHwgNTAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvb2JqZWN0L3dvcmtmbG93L2RyYWZ0cycsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0dHJ5XG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxuXHRcdGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZFxuXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxuXG5cdFx0aW5zZXJ0ZWRfaW5zdGFuY2VzID0gbmV3IEFycmF5XG5cblx0XHRfLmVhY2ggaGFzaERhdGFbJ0luc3RhbmNlcyddLCAoaW5zdGFuY2VfZnJvbV9jbGllbnQpIC0+XG5cdFx0XHRuZXdfaW5zX2lkID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UoaW5zdGFuY2VfZnJvbV9jbGllbnQsIGN1cnJlbnRfdXNlcl9pbmZvKVxuXG5cdFx0XHRuZXdfaW5zID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZE9uZSh7IF9pZDogbmV3X2luc19pZCB9LCB7IGZpZWxkczogeyBzcGFjZTogMSwgZmxvdzogMSwgZmxvd192ZXJzaW9uOiAxLCBmb3JtOiAxLCBmb3JtX3ZlcnNpb246IDEgfSB9KVxuXG5cdFx0XHRpbnNlcnRlZF9pbnN0YW5jZXMucHVzaChuZXdfaW5zKVxuXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGluc2VydHM6IGluc2VydGVkX2luc3RhbmNlcyB9XG5cdFx0fVxuXHRjYXRjaCBlXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3sgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfV0gfVxuXHRcdH1cblxuIiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS9vYmplY3Qvd29ya2Zsb3cvZHJhZnRzJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGN1cnJlbnRfdXNlcl9pZCwgY3VycmVudF91c2VyX2luZm8sIGUsIGhhc2hEYXRhLCBpbnNlcnRlZF9pbnN0YW5jZXM7XG4gIHRyeSB7XG4gICAgY3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKTtcbiAgICBjdXJyZW50X3VzZXJfaWQgPSBjdXJyZW50X3VzZXJfaW5mby5faWQ7XG4gICAgaGFzaERhdGEgPSByZXEuYm9keTtcbiAgICBpbnNlcnRlZF9pbnN0YW5jZXMgPSBuZXcgQXJyYXk7XG4gICAgXy5lYWNoKGhhc2hEYXRhWydJbnN0YW5jZXMnXSwgZnVuY3Rpb24oaW5zdGFuY2VfZnJvbV9jbGllbnQpIHtcbiAgICAgIHZhciBuZXdfaW5zLCBuZXdfaW5zX2lkO1xuICAgICAgbmV3X2luc19pZCA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY3JlYXRlX2luc3RhbmNlKGluc3RhbmNlX2Zyb21fY2xpZW50LCBjdXJyZW50X3VzZXJfaW5mbyk7XG4gICAgICBuZXdfaW5zID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogbmV3X2luc19pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBzcGFjZTogMSxcbiAgICAgICAgICBmbG93OiAxLFxuICAgICAgICAgIGZsb3dfdmVyc2lvbjogMSxcbiAgICAgICAgICBmb3JtOiAxLFxuICAgICAgICAgIGZvcm1fdmVyc2lvbjogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBpbnNlcnRlZF9pbnN0YW5jZXMucHVzaChuZXdfaW5zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBpbnNlcnRzOiBpbnNlcnRlZF9pbnN0YW5jZXNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==
