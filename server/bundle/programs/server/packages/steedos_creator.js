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
    return ReactSteedos.pluginComponentSelector(ReactSteedos.store.getState(), "ObjectHome", object_name);
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
  var collection, record, ref, ref1, ref2;

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

  collection = Creator.getCollection(object_name);

  if (collection) {
    record = collection.findOne(record_id);
    return record;
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

  return ReactSteedos.pluginComponentSelector(ReactSteedos.store.getState(), "Dashboard", app._id);
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
  var hasQuerySymbol, linkStr, params, sdk, url;
  params = {};
  params["X-Space-Id"] = Steedos.spaceId();
  params["X-User-Id"] = Steedos.userId();
  params["X-Company-Ids"] = Steedos.getUserCompanyIds();
  sdk = require("@steedos-ui/builder-community/dist/builder-community.react.js");
  url = menu.path;

  if (sdk && sdk.Utils && sdk.Utils.isExpression(url)) {
    url = sdk.Utils.parseSingleExpression(url, menu, "#", Creator.USER_CONTEXT);
  }

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
  ReactSteedos.store.getState().entities.apps = Object.assign({}, ReactSteedos.store.getState().entities.apps, {
    apps: changeApp
  });
  return ReactSteedos.visibleAppsSelector(ReactSteedos.store.getState(), includeAdmin);
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

uuflowManagerForInitApproval.create_instance = function (instance_from_client, user_info) {
  var appr_obj, approve_from_client, category, flow, flow_id, form, ins_obj, new_ins_id, now, permissions, relatedTablesInfo, space, space_id, space_user, space_user_org_info, start_step, trace_from_client, trace_obj, user_id;
  check(instance_from_client["applicant"], String);
  check(instance_from_client["space"], String);
  check(instance_from_client["flow"], String);
  check(instance_from_client["record_ids"], [{
    o: String,
    ids: [String]
  }]);
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
  ins_obj.values = new Object();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjcmVhdG9yL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvbGliL2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvb2JqZWN0X3JlY2VudF92aWV3ZWQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3ZpZXdlZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3JlY29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9yZWNlbnRfcmVjb3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9yZXBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3JlcG9ydF9kYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfZXhwb3J0MnhtbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9leHBvcnQyeG1sLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3JlbGF0ZWRfb2JqZWN0c19yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvcGVuZGluZ19zcGFjZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3BlbmRpbmdfc3BhY2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF90YWJ1bGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF9saXN0dmlld3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy91c2VyX3RhYnVsYXJfc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9yZWxhdGVkX29iamVjdHNfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV91c2VyX2luZm8uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c192aWV3X2xpbWl0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfdmlld19saW1pdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c19ub19mb3JjZV9waG9uZV91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9uZWVkX3RvX2NvbmZpcm0uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX25lZWRfdG9fY29uZmlybS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbGliL3Blcm1pc3Npb25fbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvcGVybWlzc2lvbl9tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9zMy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImJ1c2JveSIsIm1rZGlycCIsIk1ldGVvciIsInNldHRpbmdzIiwiY2ZzIiwiYWxpeXVuIiwiQ3JlYXRvciIsImdldFNjaGVtYSIsIm9iamVjdF9uYW1lIiwicmVmIiwiZ2V0T2JqZWN0Iiwic2NoZW1hIiwiZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCIsImlzQ2xpZW50IiwiUmVhY3RTdGVlZG9zIiwicGx1Z2luQ29tcG9uZW50U2VsZWN0b3IiLCJzdG9yZSIsImdldFN0YXRlIiwiZ2V0T2JqZWN0VXJsIiwicmVjb3JkX2lkIiwiYXBwX2lkIiwibGlzdF92aWV3IiwibGlzdF92aWV3X2lkIiwiU2Vzc2lvbiIsImdldCIsImdldExpc3RWaWV3IiwiX2lkIiwiZ2V0UmVsYXRpdmVVcmwiLCJnZXRPYmplY3RBYnNvbHV0ZVVybCIsIlN0ZWVkb3MiLCJhYnNvbHV0ZVVybCIsImdldE9iamVjdFJvdXRlclVybCIsImdldExpc3RWaWV3VXJsIiwidXJsIiwiZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybCIsImdldFN3aXRjaExpc3RVcmwiLCJnZXRSZWxhdGVkT2JqZWN0VXJsIiwicmVsYXRlZF9vYmplY3RfbmFtZSIsInJlbGF0ZWRfZmllbGRfbmFtZSIsImdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyIsImlzX2RlZXAiLCJpc19za2lwX2hpZGUiLCJpc19yZWxhdGVkIiwiX29iamVjdCIsIl9vcHRpb25zIiwiZmllbGRzIiwiaWNvbiIsInJlbGF0ZWRPYmplY3RzIiwiXyIsImZvckVhY2giLCJmIiwiayIsImhpZGRlbiIsInR5cGUiLCJwdXNoIiwibGFiZWwiLCJ2YWx1ZSIsInJfb2JqZWN0IiwicmVmZXJlbmNlX3RvIiwiaXNTdHJpbmciLCJmMiIsImsyIiwiZ2V0UmVsYXRlZE9iamVjdHMiLCJlYWNoIiwiX3RoaXMiLCJfcmVsYXRlZE9iamVjdCIsInJlbGF0ZWRPYmplY3QiLCJyZWxhdGVkT3B0aW9ucyIsInJlbGF0ZWRPcHRpb24iLCJmb3JlaWduX2tleSIsIm5hbWUiLCJnZXRPYmplY3RGaWx0ZXJGaWVsZE9wdGlvbnMiLCJwZXJtaXNzaW9uX2ZpZWxkcyIsImdldEZpZWxkcyIsImluY2x1ZGUiLCJ0ZXN0IiwiaW5kZXhPZiIsImdldE9iamVjdEZpZWxkT3B0aW9ucyIsImdldEZpbHRlcnNXaXRoRmlsdGVyRmllbGRzIiwiZmlsdGVycyIsImZpbHRlcl9maWVsZHMiLCJsZW5ndGgiLCJuIiwiZmllbGQiLCJyZXF1aXJlZCIsImZpbmRXaGVyZSIsImlzX2RlZmF1bHQiLCJpc19yZXF1aXJlZCIsImZpbHRlckl0ZW0iLCJtYXRjaEZpZWxkIiwiZmluZCIsImdldE9iamVjdFJlY29yZCIsInNlbGVjdF9maWVsZHMiLCJleHBhbmQiLCJjb2xsZWN0aW9uIiwicmVjb3JkIiwicmVmMSIsInJlZjIiLCJUZW1wbGF0ZSIsImluc3RhbmNlIiwib2RhdGEiLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsImdldE9iamVjdFJlY29yZE5hbWUiLCJuYW1lX2ZpZWxkX2tleSIsIk5BTUVfRklFTERfS0VZIiwiZ2V0QXBwIiwiYXBwIiwiQXBwcyIsImRlcHMiLCJkZXBlbmQiLCJnZXRBcHBEYXNoYm9hcmQiLCJkYXNoYm9hcmQiLCJEYXNoYm9hcmRzIiwiYXBwcyIsImdldEFwcERhc2hib2FyZENvbXBvbmVudCIsImdldEFwcE9iamVjdE5hbWVzIiwiYXBwT2JqZWN0cyIsImlzTW9iaWxlIiwib2JqZWN0cyIsIm1vYmlsZV9vYmplY3RzIiwib2JqIiwicGVybWlzc2lvbnMiLCJhbGxvd1JlYWQiLCJnZXRBcHBNZW51IiwibWVudV9pZCIsIm1lbnVzIiwiZ2V0QXBwTWVudXMiLCJtZW51IiwiaWQiLCJnZXRBcHBNZW51VXJsRm9ySW50ZXJuZXQiLCJoYXNRdWVyeVN5bWJvbCIsImxpbmtTdHIiLCJwYXJhbXMiLCJzZGsiLCJzcGFjZUlkIiwidXNlcklkIiwiZ2V0VXNlckNvbXBhbnlJZHMiLCJyZXF1aXJlIiwicGF0aCIsIlV0aWxzIiwiaXNFeHByZXNzaW9uIiwicGFyc2VTaW5nbGVFeHByZXNzaW9uIiwiVVNFUl9DT05URVhUIiwiJCIsInBhcmFtIiwiZ2V0QXBwTWVudVVybCIsInRhcmdldCIsImFwcE1lbnVzIiwiY3VyZW50QXBwTWVudXMiLCJtZW51SXRlbSIsImNoaWxkcmVuIiwibG9hZEFwcHNNZW51cyIsImRhdGEiLCJvcHRpb25zIiwibW9iaWxlIiwic3VjY2VzcyIsInNldCIsImF1dGhSZXF1ZXN0IiwiZ2V0VmlzaWJsZUFwcHMiLCJpbmNsdWRlQWRtaW4iLCJjaGFuZ2VBcHAiLCJfc3ViQXBwIiwiZW50aXRpZXMiLCJPYmplY3QiLCJhc3NpZ24iLCJ2aXNpYmxlQXBwc1NlbGVjdG9yIiwiZ2V0VmlzaWJsZUFwcHNPYmplY3RzIiwidmlzaWJsZU9iamVjdE5hbWVzIiwiZmxhdHRlbiIsInBsdWNrIiwiZmlsdGVyIiwiT2JqZWN0cyIsInNvcnQiLCJzb3J0aW5nTWV0aG9kIiwiYmluZCIsImtleSIsInVuaXEiLCJnZXRBcHBzT2JqZWN0cyIsInRlbXBPYmplY3RzIiwiY29uY2F0IiwidmFsaWRhdGVGaWx0ZXJzIiwibG9naWMiLCJlIiwiZXJyb3JNc2ciLCJmaWx0ZXJfaXRlbXMiLCJmaWx0ZXJfbGVuZ3RoIiwiZmxhZyIsImluZGV4Iiwid29yZCIsIm1hcCIsImlzRW1wdHkiLCJjb21wYWN0IiwicmVwbGFjZSIsIm1hdGNoIiwiaSIsImluY2x1ZGVzIiwidyIsImVycm9yIiwiY29uc29sZSIsImxvZyIsInRvYXN0ciIsImZvcm1hdEZpbHRlcnNUb01vbmdvIiwic2VsZWN0b3IiLCJBcnJheSIsIm9wZXJhdGlvbiIsIm9wdGlvbiIsInJlZyIsInN1Yl9zZWxlY3RvciIsImV2YWx1YXRlRm9ybXVsYSIsIlJlZ0V4cCIsImlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyIsImZvcm1hdEZpbHRlcnNUb0RldiIsImxvZ2ljVGVtcEZpbHRlcnMiLCJzdGVlZG9zRmlsdGVycyIsImlzX2xvZ2ljX29yIiwicG9wIiwiZm9ybWF0TG9naWNGaWx0ZXJzVG9EZXYiLCJmaWx0ZXJfbG9naWMiLCJmb3JtYXRfbG9naWMiLCJ4IiwiX2YiLCJpc0FycmF5IiwiSlNPTiIsInN0cmluZ2lmeSIsInJlbGF0ZWRfb2JqZWN0X25hbWVzIiwicmVsYXRlZF9vYmplY3RzIiwidW5yZWxhdGVkX29iamVjdHMiLCJnZXRPYmplY3RSZWxhdGVkcyIsIl9jb2xsZWN0aW9uX25hbWUiLCJnZXRQZXJtaXNzaW9ucyIsImRpZmZlcmVuY2UiLCJyZWxhdGVkX29iamVjdCIsImlzQWN0aXZlIiwiYWxsb3dSZWFkRmlsZXMiLCJnZXRSZWxhdGVkT2JqZWN0TmFtZXMiLCJnZXRSZWxhdGVkT2JqZWN0TGlzdEFjdGlvbnMiLCJyZWxhdGVkT2JqZWN0TmFtZSIsImFjdGlvbnMiLCJnZXRBY3Rpb25zIiwiYWN0aW9uIiwib24iLCJ2aXNpYmxlIiwiZGlzYWJsZWRfYWN0aW9ucyIsInNvcnRCeSIsInZhbHVlcyIsImhhcyIsImFsbG93X2N1c3RvbUFjdGlvbnMiLCJrZXlzIiwiZXhjbHVkZV9hY3Rpb25zIiwiZ2V0TGlzdFZpZXdzIiwiZGlzYWJsZWRfbGlzdF92aWV3cyIsImxpc3RWaWV3cyIsImxpc3Rfdmlld3MiLCJvYmplY3QiLCJpdGVtIiwiaXRlbV9uYW1lIiwiaXNEaXNhYmxlZCIsIm93bmVyIiwiZmllbGRzTmFtZSIsInVucmVhZGFibGVfZmllbGRzIiwiZ2V0T2JqZWN0RmllbGRzTmFtZSIsImlzbG9hZGluZyIsImJvb3RzdHJhcExvYWRlZCIsImNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyIiwic3RyIiwiZ2V0RGlzYWJsZWRGaWVsZHMiLCJmaWVsZE5hbWUiLCJhdXRvZm9ybSIsImRpc2FibGVkIiwib21pdCIsImdldEhpZGRlbkZpZWxkcyIsImdldEZpZWxkc1dpdGhOb0dyb3VwIiwiZ3JvdXAiLCJnZXRTb3J0ZWRGaWVsZEdyb3VwTmFtZXMiLCJuYW1lcyIsInVuaXF1ZSIsImdldEZpZWxkc0Zvckdyb3VwIiwiZ3JvdXBOYW1lIiwiZ2V0RmllbGRzV2l0aG91dE9taXQiLCJwaWNrIiwiZ2V0RmllbGRzSW5GaXJzdExldmVsIiwiZmlyc3RMZXZlbEtleXMiLCJnZXRGaWVsZHNGb3JSZW9yZGVyIiwiaXNTaW5nbGUiLCJfa2V5cyIsImNoaWxkS2V5cyIsImlzX3dpZGVfMSIsImlzX3dpZGVfMiIsInNjXzEiLCJzY18yIiwiZW5kc1dpdGgiLCJpc193aWRlIiwic2xpY2UiLCJpc0ZpbHRlclZhbHVlRW1wdHkiLCJOdW1iZXIiLCJpc05hTiIsImdldEZpZWxkRGF0YVR5cGUiLCJvYmplY3RGaWVsZHMiLCJyZXN1bHQiLCJkYXRhX3R5cGUiLCJpc1NlcnZlciIsImdldEFsbFJlbGF0ZWRPYmplY3RzIiwicmVsYXRlZF9maWVsZCIsImVuYWJsZV9maWxlcyIsImZvcm1hdEluZGV4IiwiYXJyYXkiLCJpbmRleE5hbWUiLCJpc2RvY3VtZW50REIiLCJiYWNrZ3JvdW5kIiwiZGF0YXNvdXJjZXMiLCJkb2N1bWVudERCIiwiam9pbiIsInN1YnN0cmluZyIsImFwcHNCeU5hbWUiLCJtZXRob2RzIiwic3BhY2VfaWQiLCJjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQiLCJjdXJyZW50X3JlY2VudF92aWV3ZWQiLCJkb2MiLCJzcGFjZSIsInVwZGF0ZSIsIiRpbmMiLCJjb3VudCIsIiRzZXQiLCJtb2RpZmllZCIsIkRhdGUiLCJtb2RpZmllZF9ieSIsImluc2VydCIsIl9tYWtlTmV3SUQiLCJvIiwiaWRzIiwiY3JlYXRlZCIsImNyZWF0ZWRfYnkiLCJhc3luY19yZWNlbnRfYWdncmVnYXRlIiwicmVjZW50X2FnZ3JlZ2F0ZSIsInNlYXJjaF9vYmplY3QiLCJfcmVjb3JkcyIsImNhbGxiYWNrIiwiQ29sbGVjdGlvbnMiLCJvYmplY3RfcmVjZW50X3ZpZXdlZCIsInJhd0NvbGxlY3Rpb24iLCJhZ2dyZWdhdGUiLCIkbWF0Y2giLCIkZ3JvdXAiLCJtYXhDcmVhdGVkIiwiJG1heCIsIiRzb3J0IiwiJGxpbWl0IiwidG9BcnJheSIsImVyciIsIkVycm9yIiwiaXNGdW5jdGlvbiIsIndyYXBBc3luYyIsInNlYXJjaFRleHQiLCJfb2JqZWN0X2NvbGxlY3Rpb24iLCJfb2JqZWN0X25hbWVfa2V5IiwicXVlcnkiLCJxdWVyeV9hbmQiLCJyZWNvcmRzIiwic2VhcmNoX0tleXdvcmRzIiwic3BsaXQiLCJrZXl3b3JkIiwic3VicXVlcnkiLCIkcmVnZXgiLCJ0cmltIiwiJGFuZCIsIiRpbiIsImxpbWl0IiwiX25hbWUiLCJfb2JqZWN0X25hbWUiLCJyZWNvcmRfb2JqZWN0IiwicmVjb3JkX29iamVjdF9jb2xsZWN0aW9uIiwic2VsZiIsIm9iamVjdHNCeU5hbWUiLCJvYmplY3RfcmVjb3JkIiwiZW5hYmxlX3NlYXJjaCIsInVwZGF0ZV9maWx0ZXJzIiwibGlzdHZpZXdfaWQiLCJmaWx0ZXJfc2NvcGUiLCJvYmplY3RfbGlzdHZpZXdzIiwiZGlyZWN0IiwidXBkYXRlX2NvbHVtbnMiLCJjb2x1bW5zIiwiY2hlY2siLCJjb21wb3VuZEZpZWxkcyIsImN1cnNvciIsImZpbHRlckZpZWxkcyIsImNoaWxkS2V5Iiwib2JqZWN0RmllbGQiLCJzcGxpdHMiLCJpc0NvbW1vblNwYWNlIiwiaXNTcGFjZUFkbWluIiwic2tpcCIsImZldGNoIiwiY29tcG91bmRGaWVsZEl0ZW0iLCJjb21wb3VuZEZpbHRlckZpZWxkcyIsIml0ZW1LZXkiLCJpdGVtVmFsdWUiLCJyZWZlcmVuY2VJdGVtIiwic2V0dGluZyIsImNvbHVtbl93aWR0aCIsIm9iajEiLCJfaWRfYWN0aW9ucyIsIl9taXhGaWVsZHNEYXRhIiwiX21peFJlbGF0ZWREYXRhIiwiX3dyaXRlWG1sRmlsZSIsImZzIiwibG9nZ2VyIiwieG1sMmpzIiwiTG9nZ2VyIiwianNvbk9iaiIsIm9iak5hbWUiLCJidWlsZGVyIiwiZGF5IiwiZmlsZUFkZHJlc3MiLCJmaWxlTmFtZSIsImZpbGVQYXRoIiwibW9udGgiLCJub3ciLCJzdHJlYW0iLCJ4bWwiLCJ5ZWFyIiwiQnVpbGRlciIsImJ1aWxkT2JqZWN0IiwiQnVmZmVyIiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsImdldERhdGUiLCJfX21ldGVvcl9ib290c3RyYXBfXyIsInNlcnZlckRpciIsImV4aXN0c1N5bmMiLCJzeW5jIiwid3JpdGVGaWxlIiwibWl4Qm9vbCIsIm1peERhdGUiLCJtaXhEZWZhdWx0Iiwib2JqRmllbGRzIiwiZmllbGRfbmFtZSIsImRhdGUiLCJkYXRlU3RyIiwiZm9ybWF0IiwibW9tZW50IiwicmVsYXRlZE9iak5hbWVzIiwicmVsYXRlZE9iak5hbWUiLCJyZWxhdGVkQ29sbGVjdGlvbiIsInJlbGF0ZWRSZWNvcmRMaXN0IiwicmVsYXRlZFRhYmxlRGF0YSIsInJlbGF0ZWRPYmoiLCJmaWVsZHNEYXRhIiwiRXhwb3J0MnhtbCIsInJlY29yZExpc3QiLCJpbmZvIiwidGltZSIsInJlY29yZE9iaiIsInRpbWVFbmQiLCJyZWxhdGVkX29iamVjdHNfcmVjb3JkcyIsInJlbGF0ZWRfcmVjb3JkcyIsInZpZXdBbGxSZWNvcmRzIiwiZ2V0UGVuZGluZ1NwYWNlSW5mbyIsImludml0ZXJJZCIsImludml0ZXJOYW1lIiwic3BhY2VOYW1lIiwiZGIiLCJ1c2VycyIsInNwYWNlcyIsImludml0ZXIiLCJyZWZ1c2VKb2luU3BhY2UiLCJzcGFjZV91c2VycyIsImludml0ZV9zdGF0ZSIsImFjY2VwdEpvaW5TcGFjZSIsInVzZXJfYWNjZXB0ZWQiLCJwdWJsaXNoIiwicHVibGlzaENvbXBvc2l0ZSIsInRhYmxlTmFtZSIsIl9maWVsZHMiLCJvYmplY3RfY29sbGVjaXRvbiIsInJlZmVyZW5jZV9maWVsZHMiLCJyZWFkeSIsIlN0cmluZyIsIk1hdGNoIiwiT3B0aW9uYWwiLCJnZXRPYmplY3ROYW1lIiwidW5ibG9jayIsImZpZWxkX2tleXMiLCJfb2JqZWN0S2V5cyIsInJlZmVyZW5jZV9maWVsZCIsInBhcmVudCIsImNoaWxkcmVuX2ZpZWxkcyIsInBfayIsInJlZmVyZW5jZV9pZHMiLCJyZWZlcmVuY2VfdG9fb2JqZWN0Iiwic19rIiwiZ2V0UHJvcGVydHkiLCJyZWR1Y2UiLCJpc09iamVjdCIsInNoYXJlZCIsInVzZXIiLCJzcGFjZV9zZXR0aW5ncyIsInBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsIiwiZ2V0Rmxvd1Blcm1pc3Npb25zIiwiZmxvd19pZCIsInVzZXJfaWQiLCJmbG93IiwibXlfcGVybWlzc2lvbnMiLCJvcmdfaWRzIiwib3JnYW5pemF0aW9ucyIsIm9yZ3NfY2FuX2FkZCIsIm9yZ3NfY2FuX2FkbWluIiwib3Jnc19jYW5fbW9uaXRvciIsInVzZXJzX2Nhbl9hZGQiLCJ1c2Vyc19jYW5fYWRtaW4iLCJ1c2Vyc19jYW5fbW9uaXRvciIsInV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwiLCJnZXRGbG93IiwicGFyZW50cyIsIm9yZyIsInBhcmVudF9pZCIsInBlcm1zIiwib3JnX2lkIiwiX2V2YWwiLCJnZXRPYmplY3RDb25maWciLCJnZXRPYmplY3ROYW1lRmllbGRLZXkiLCJnZXRSZWxhdGVkcyIsIm9iamVjdHFsIiwib2JqZWN0QXBpTmFtZSIsInRvQ29uZmlnIiwiY2IiLCJ0aGVuIiwicmVzb2x2ZSIsInJlamVjdCIsImNoZWNrX2F1dGhvcml6YXRpb24iLCJyZXEiLCJhdXRoVG9rZW4iLCJoYXNoZWRUb2tlbiIsIkFjY291bnRzIiwiX2hhc2hMb2dpblRva2VuIiwiZ2V0U3BhY2UiLCJmbG93cyIsImdldFNwYWNlVXNlciIsInNwYWNlX3VzZXIiLCJnZXRTcGFjZVVzZXJPcmdJbmZvIiwib3JnYW5pemF0aW9uIiwiZnVsbG5hbWUiLCJvcmdhbml6YXRpb25fbmFtZSIsIm9yZ2FuaXphdGlvbl9mdWxsbmFtZSIsImlzRmxvd0VuYWJsZWQiLCJzdGF0ZSIsImlzRmxvd1NwYWNlTWF0Y2hlZCIsImdldEZvcm0iLCJmb3JtX2lkIiwiZm9ybSIsImZvcm1zIiwiZ2V0Q2F0ZWdvcnkiLCJjYXRlZ29yeV9pZCIsImNhdGVnb3JpZXMiLCJjcmVhdGVfaW5zdGFuY2UiLCJpbnN0YW5jZV9mcm9tX2NsaWVudCIsInVzZXJfaW5mbyIsImFwcHJfb2JqIiwiYXBwcm92ZV9mcm9tX2NsaWVudCIsImNhdGVnb3J5IiwiaW5zX29iaiIsIm5ld19pbnNfaWQiLCJyZWxhdGVkVGFibGVzSW5mbyIsInNwYWNlX3VzZXJfb3JnX2luZm8iLCJzdGFydF9zdGVwIiwidHJhY2VfZnJvbV9jbGllbnQiLCJ0cmFjZV9vYmoiLCJjaGVja0lzSW5BcHByb3ZhbCIsInBlcm1pc3Npb25NYW5hZ2VyIiwiaW5zdGFuY2VzIiwiZmxvd192ZXJzaW9uIiwiY3VycmVudCIsImZvcm1fdmVyc2lvbiIsInN1Ym1pdHRlciIsInN1Ym1pdHRlcl9uYW1lIiwiYXBwbGljYW50IiwiYXBwbGljYW50X25hbWUiLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uIiwiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lIiwiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZSIsImFwcGxpY2FudF9jb21wYW55IiwiY29tcGFueV9pZCIsImNvZGUiLCJpc19hcmNoaXZlZCIsImlzX2RlbGV0ZWQiLCJyZWNvcmRfaWRzIiwiTW9uZ28iLCJPYmplY3RJRCIsIl9zdHIiLCJpc19maW5pc2hlZCIsInN0ZXBzIiwic3RlcCIsInN0ZXBfdHlwZSIsInN0YXJ0X2RhdGUiLCJ0cmFjZSIsInVzZXJfbmFtZSIsImhhbmRsZXIiLCJoYW5kbGVyX25hbWUiLCJoYW5kbGVyX29yZ2FuaXphdGlvbiIsImhhbmRsZXJfb3JnYW5pemF0aW9uX25hbWUiLCJoYW5kbGVyX29yZ2FuaXphdGlvbl9mdWxsbmFtZSIsInJlYWRfZGF0ZSIsImlzX3JlYWQiLCJpc19lcnJvciIsImRlc2NyaXB0aW9uIiwiaW5pdGlhdGVWYWx1ZXMiLCJhcHByb3ZlcyIsInRyYWNlcyIsImluYm94X3VzZXJzIiwiY3VycmVudF9zdGVwX25hbWUiLCJhdXRvX3JlbWluZCIsImZsb3dfbmFtZSIsImNhdGVnb3J5X25hbWUiLCJpbml0aWF0ZVJlY29yZEluc3RhbmNlSW5mbyIsImluaXRpYXRlQXR0YWNoIiwicmVjb3JkSWRzIiwiZmxvd0lkIiwiZmllbGRDb2RlcyIsImZpbHRlclZhbHVlcyIsImZvcm1GaWVsZHMiLCJmb3JtVGFibGVGaWVsZHMiLCJmb3JtVGFibGVGaWVsZHNDb2RlIiwiZ2V0RmllbGRPZGF0YVZhbHVlIiwiZ2V0Rm9ybUZpZWxkIiwiZ2V0Rm9ybVRhYmxlRmllbGQiLCJnZXRGb3JtVGFibGVGaWVsZENvZGUiLCJnZXRGb3JtVGFibGVTdWJGaWVsZCIsImdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUiLCJnZXRTZWxlY3RPcmdWYWx1ZSIsImdldFNlbGVjdE9yZ1ZhbHVlcyIsImdldFNlbGVjdFVzZXJWYWx1ZSIsImdldFNlbGVjdFVzZXJWYWx1ZXMiLCJvYmplY3ROYW1lIiwib3ciLCJyZWNvcmRJZCIsInJlbGF0ZWRPYmplY3RzS2V5cyIsInRhYmxlRmllbGRDb2RlcyIsInRhYmxlRmllbGRNYXAiLCJ0YWJsZVRvUmVsYXRlZE1hcCIsImZmIiwib2JqZWN0X3dvcmtmbG93cyIsImZvcm1GaWVsZCIsInJlbGF0ZWRPYmplY3RzS2V5Iiwic3RhcnRzV2l0aCIsImZvcm1UYWJsZUZpZWxkQ29kZSIsInNmIiwidGFibGVGaWVsZCIsInN1YkZpZWxkQ29kZSIsIl9yZWNvcmQiLCJuYW1lS2V5Iiwic3UiLCJ1c2VySWRzIiwic3VzIiwib3JnSWQiLCJvcmdJZHMiLCJvcmdzIiwiZmllbGRfbWFwIiwiZm0iLCJmaWVsZHNPYmoiLCJncmlkQ29kZSIsImxvb2t1cEZpZWxkTmFtZSIsImxvb2t1cEZpZWxkT2JqIiwibG9va3VwT2JqZWN0UmVjb3JkIiwibG9va3VwU2VsZWN0RmllbGRWYWx1ZSIsIm9UYWJsZUNvZGUiLCJvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQiLCJvVGFibGVDb2RlUmVmZXJlbmNlRmllbGRDb2RlIiwib1RhYmxlRmllbGRDb2RlIiwib2JqRmllbGQiLCJvYmplY3RGaWVsZE5hbWUiLCJvYmplY3RGaWVsZE9iamVjdE5hbWUiLCJvYmplY3RMb29rdXBGaWVsZCIsIm9iamVjdF9maWVsZCIsIm9kYXRhRmllbGRWYWx1ZSIsInJlZmVyZW5jZVRvRG9jIiwicmVmZXJlbmNlVG9GaWVsZFZhbHVlIiwicmVmZXJlbmNlVG9PYmplY3ROYW1lIiwicmVsYXRlZE9iamVjdEZpZWxkQ29kZSIsInNlbGVjdEZpZWxkVmFsdWUiLCJ0YWJsZVRvUmVsYXRlZE1hcEtleSIsIndUYWJsZUNvZGUiLCJ3b3JrZmxvd19maWVsZCIsImhhc093blByb3BlcnR5Iiwid29ya2Zsb3dfdGFibGVfZmllbGRfY29kZSIsIm9iamVjdF90YWJsZV9maWVsZF9jb2RlIiwibXVsdGlwbGUiLCJpc19tdWx0aXNlbGVjdCIsInRmYyIsImMiLCJwYXJzZSIsInRyIiwibmV3VHIiLCJ0Zm0iLCJ3VGRDb2RlIiwiZm9ybVRhYmxlRmllbGQiLCJyZWxhdGVkRmllbGQiLCJyZWxhdGVkRmllbGROYW1lIiwicmVsYXRlZFJlY29yZHMiLCJyZWxhdGVkVGFibGVJdGVtcyIsInRhYmxlQ29kZSIsInRhYmxlVmFsdWVzIiwiX0ZST01fVEFCTEVfQ09ERSIsIndhcm4iLCJyciIsInRhYmxlVmFsdWVJdGVtIiwidmFsdWVLZXkiLCJmaWVsZEtleSIsImZvcm1GaWVsZEtleSIsInJlbGF0ZWRPYmplY3RGaWVsZCIsInRhYmxlRmllbGRWYWx1ZSIsIl90YWJsZSIsIl9jb2RlIiwiZmllbGRfbWFwX3NjcmlwdCIsImV4dGVuZCIsImV2YWxGaWVsZE1hcFNjcmlwdCIsIm9iamVjdElkIiwiZnVuYyIsInNjcmlwdCIsImluc0lkIiwiYXBwcm92ZUlkIiwiY2YiLCJ2ZXJzaW9ucyIsInZlcnNpb25JZCIsImlkeCIsIm5ld0ZpbGUiLCJGUyIsIkZpbGUiLCJhdHRhY2hEYXRhIiwiY3JlYXRlUmVhZFN0cmVhbSIsIm9yaWdpbmFsIiwibWV0YWRhdGEiLCJyZWFzb24iLCJzaXplIiwib3duZXJfbmFtZSIsImFwcHJvdmUiLCIkcHVzaCIsIiRlYWNoIiwiJHBvc2l0aW9uIiwibG9ja2VkIiwiaW5zdGFuY2Vfc3RhdGUiLCJpbml0aWF0ZVJlbGF0ZWRSZWNvcmRJbnN0YW5jZUluZm8iLCJ0YWJsZUl0ZW1zIiwiJGV4aXN0cyIsImdldFF1ZXJ5U3RyaW5nIiwic3RlZWRvc0F1dGgiLCJKc29uUm91dGVzIiwiYWRkIiwicmVzIiwibmV4dCIsInBhcnNlRmlsZXMiLCJmaWxlQ29sbGVjdGlvbiIsImZpbGVzIiwibWltZVR5cGUiLCJib2R5IiwiZXh0ZW50aW9uIiwiZmlsZU9iaiIsImZpbGVuYW1lIiwibmV3RmlsZU9iaklkIiwidG9Mb3dlckNhc2UiLCJkZWNvZGVVUklDb21wb25lbnQiLCJvbmNlIiwic3RvcmVOYW1lIiwicmVzcCIsInZlcnNpb25faWQiLCJlbmQiLCJzdGF0dXNDb2RlIiwiY29sbGVjdGlvbk5hbWUiLCJ1c2VyU2Vzc2lvbiIsImF1dGgiLCJyZXN1bHREYXRhIiwic2VuZFJlc3VsdCIsInN0YWNrIiwiZXJyb3JzIiwibWVzc2FnZSIsImFjY2Vzc0tleUlkIiwic2VjcmV0QWNjZXNzS2V5IiwibWV0aG9kIiwiQUxZIiwiY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nIiwicXVlcnlLZXlzIiwicXVlcnlTdHIiLCJzdHJpbmdUb1NpZ24iLCJ1dGlsIiwiRm9ybWF0IiwiVmVyc2lvbiIsIkFjY2Vzc0tleUlkIiwiU2lnbmF0dXJlTWV0aG9kIiwiVGltZXN0YW1wIiwiaXNvODYwMSIsIlNpZ25hdHVyZVZlcnNpb24iLCJTaWduYXR1cmVOb25jZSIsImdldFRpbWUiLCJwb3BFc2NhcGUiLCJ0b1VwcGVyQ2FzZSIsInN1YnN0ciIsIlNpZ25hdHVyZSIsImNyeXB0byIsImhtYWMiLCJxdWVyeVBhcmFtc1RvU3RyaW5nIiwiZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiIsIm9zcyIsInIiLCJyZWYzIiwidXBsb2FkQWRkcmVzcyIsInVwbG9hZEF1dGgiLCJ2aWRlb0lkIiwiQWN0aW9uIiwiVGl0bGUiLCJGaWxlTmFtZSIsIkhUVFAiLCJjYWxsIiwiVmlkZW9JZCIsIlVwbG9hZEFkZHJlc3MiLCJ0b1N0cmluZyIsIlVwbG9hZEF1dGgiLCJPU1MiLCJBY2Nlc3NLZXlTZWNyZXQiLCJFbmRwb2ludCIsIlNlY3VyaXR5VG9rZW4iLCJwdXRPYmplY3QiLCJCdWNrZXQiLCJLZXkiLCJCb2R5IiwiQWNjZXNzQ29udHJvbEFsbG93T3JpZ2luIiwiQ29udGVudFR5cGUiLCJDYWNoZUNvbnRyb2wiLCJDb250ZW50RGlzcG9zaXRpb24iLCJDb250ZW50RW5jb2RpbmciLCJTZXJ2ZXJTaWRlRW5jcnlwdGlvbiIsIkV4cGlyZXMiLCJiaW5kRW52aXJvbm1lbnQiLCJnZXRQbGF5SW5mb1F1ZXJ5IiwiZ2V0UGxheUluZm9SZXN1bHQiLCJnZXRQbGF5SW5mb1VybCIsIm5ld0RhdGUiLCJjdXJyZW50X3VzZXJfaWQiLCJjdXJyZW50X3VzZXJfaW5mbyIsImhhc2hEYXRhIiwiaW5zZXJ0ZWRfaW5zdGFuY2VzIiwibmV3X2lucyIsImluc2VydHMiLCJlcnJvck1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QURaSjs7QUNjRSxXRFBGOUYsV0FBV3lCLFVBQVgsQ0FBc0J2QixHQUF0QixFQUEyQjtBQUMxQnJLLFlBQU0sR0FEb0I7QUFFMUJoYixZQUFNO0FBQUVrckIsaUJBQVNGO0FBQVg7QUFGb0IsS0FBM0IsQ0NPRTtBRHRCSCxXQUFBbm9CLEtBQUE7QUFtQk1mLFFBQUFlLEtBQUE7QUFDTEMsWUFBUUQsS0FBUixDQUFjZixFQUFFK2tCLEtBQWhCO0FDV0UsV0RWRjFCLFdBQVd5QixVQUFYLENBQXNCdkIsR0FBdEIsRUFBMkI7QUFDMUJySyxZQUFNLEdBRG9CO0FBRTFCaGIsWUFBTTtBQUFFOG1CLGdCQUFRLENBQUM7QUFBRXFFLHdCQUFjcnBCLEVBQUV1aUIsTUFBRixJQUFZdmlCLEVBQUVpbEI7QUFBOUIsU0FBRDtBQUFWO0FBRm9CLEtBQTNCLENDVUU7QUFVRDtBRDFDSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRjaGVja05wbVZlcnNpb25zXG59IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuY2hlY2tOcG1WZXJzaW9ucyh7XG5cdGJ1c2JveTogXCJeMC4yLjEzXCIsXG5cdG1rZGlycDogXCJeMC4zLjVcIixcblx0XCJ4bWwyanNcIjogXCJeMC40LjE5XCIsXG5cdFwibm9kZS14bHN4XCI6IFwiXjAueFwiXG59LCAnc3RlZWRvczpjcmVhdG9yJyk7XG5cbmlmIChNZXRlb3Iuc2V0dGluZ3MgJiYgTWV0ZW9yLnNldHRpbmdzLmNmcyAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bikge1xuXHRjaGVja05wbVZlcnNpb25zKHtcblx0XHRcImFsaXl1bi1zZGtcIjogXCJeMS4xMS4xMlwiXG5cdH0sICdzdGVlZG9zOmNyZWF0b3InKTtcbn0iLCJcblx0IyBDcmVhdG9yLmluaXRBcHBzKClcblxuXG4jIENyZWF0b3IuaW5pdEFwcHMgPSAoKS0+XG4jIFx0aWYgTWV0ZW9yLmlzU2VydmVyXG4jIFx0XHRfLmVhY2ggQ3JlYXRvci5BcHBzLCAoYXBwLCBhcHBfaWQpLT5cbiMgXHRcdFx0ZGJfYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcbiMgXHRcdFx0aWYgIWRiX2FwcFxuIyBcdFx0XHRcdGFwcC5faWQgPSBhcHBfaWRcbiMgXHRcdFx0XHRkYi5hcHBzLmluc2VydChhcHApXG4jIGVsc2VcbiMgXHRhcHAuX2lkID0gYXBwX2lkXG4jIFx0ZGIuYXBwcy51cGRhdGUoe19pZDogYXBwX2lkfSwgYXBwKVxuXG5DcmVhdG9yLmdldFNjaGVtYSA9IChvYmplY3RfbmFtZSktPlxuXHRyZXR1cm4gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5zY2hlbWFcblxuQ3JlYXRvci5nZXRPYmplY3RIb21lQ29tcG9uZW50ID0gKG9iamVjdF9uYW1lKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHJldHVybiBSZWFjdFN0ZWVkb3MucGx1Z2luQ29tcG9uZW50U2VsZWN0b3IoUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCksIFwiT2JqZWN0SG9tZVwiLCBvYmplY3RfbmFtZSlcblxuQ3JlYXRvci5nZXRPYmplY3RVcmwgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSAtPlxuXHRpZiAhYXBwX2lkXG5cdFx0YXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcblx0aWYgIW9iamVjdF9uYW1lXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0bGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbClcblx0bGlzdF92aWV3X2lkID0gbGlzdF92aWV3Py5faWRcblxuXHRpZiByZWNvcmRfaWRcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZClcblx0ZWxzZVxuXHRcdGlmIG9iamVjdF9uYW1lIGlzIFwibWVldGluZ1wiXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCIpXG5cdFx0ZWxzZVxuXHRcdFx0aWYgQ3JlYXRvci5nZXRPYmplY3RIb21lQ29tcG9uZW50KG9iamVjdF9uYW1lKVxuXHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBsaXN0X3ZpZXdfaWRcblx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUpXG5cbkNyZWF0b3IuZ2V0T2JqZWN0QWJzb2x1dGVVcmwgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSAtPlxuXHRpZiAhYXBwX2lkXG5cdFx0YXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcblx0aWYgIW9iamVjdF9uYW1lXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0bGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbClcblx0bGlzdF92aWV3X2lkID0gbGlzdF92aWV3Py5faWRcblxuXHRpZiByZWNvcmRfaWRcblx0XHRyZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZCwgdHJ1ZSlcblx0ZWxzZVxuXHRcdGlmIG9iamVjdF9uYW1lIGlzIFwibWVldGluZ1wiXG5cdFx0XHRyZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCIsIHRydWUpXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQsIHRydWUpXG5cbkNyZWF0b3IuZ2V0T2JqZWN0Um91dGVyVXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cblx0aWYgIWFwcF9pZFxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXG5cdGxpc3Rfdmlld19pZCA9IGxpc3Rfdmlldz8uX2lkXG5cblx0aWYgcmVjb3JkX2lkXG5cdFx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkX2lkXG5cdGVsc2Vcblx0XHRpZiBvYmplY3RfbmFtZSBpcyBcIm1lZXRpbmdcIlxuXHRcdFx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIlxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZFxuXG5DcmVhdG9yLmdldExpc3RWaWV3VXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cblx0dXJsID0gQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZClcblx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwodXJsKVxuXG5DcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwgPSAob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSAtPlxuXHRpZiBsaXN0X3ZpZXdfaWQgaXMgXCJjYWxlbmRhclwiXG5cdFx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIlxuXHRlbHNlXG5cdFx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkXG5cbkNyZWF0b3IuZ2V0U3dpdGNoTGlzdFVybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIC0+XG5cdGlmIGxpc3Rfdmlld19pZFxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIGxpc3Rfdmlld19pZCArIFwiL2xpc3RcIilcblx0ZWxzZVxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9saXN0L3N3aXRjaFwiKVxuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RVcmwgPSAob2JqZWN0X25hbWUsIGFwcF9pZCwgcmVjb3JkX2lkLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUpIC0+XG5cdGlmIHJlbGF0ZWRfZmllbGRfbmFtZVxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIHJlY29yZF9pZCArIFwiL1wiICsgcmVsYXRlZF9vYmplY3RfbmFtZSArIFwiL2dyaWQ/cmVsYXRlZF9maWVsZF9uYW1lPVwiICsgcmVsYXRlZF9maWVsZF9uYW1lKVxuXHRlbHNlXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgcmVjb3JkX2lkICsgXCIvXCIgKyByZWxhdGVkX29iamVjdF9uYW1lICsgXCIvZ3JpZFwiKVxuXG5DcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyA9IChvYmplY3RfbmFtZSwgaXNfZGVlcCwgaXNfc2tpcF9oaWRlLCBpc19yZWxhdGVkKS0+XG5cdF9vcHRpb25zID0gW11cblx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIF9vcHRpb25zXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0ZmllbGRzID0gX29iamVjdD8uZmllbGRzXG5cdGljb24gPSBfb2JqZWN0Py5pY29uXG5cdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XG5cdFx0aWYgaXNfc2tpcF9oaWRlIGFuZCBmLmhpZGRlblxuXHRcdFx0cmV0dXJuXG5cdFx0aWYgZi50eXBlID09IFwic2VsZWN0XCJcblx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7Zi5sYWJlbCB8fCBrfVwiLCB2YWx1ZTogXCIje2t9XCIsIGljb246IGljb259XG5cdFx0ZWxzZVxuXHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XG5cdGlmIGlzX2RlZXBcblx0XHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxuXHRcdFx0aWYgaXNfc2tpcF9oaWRlIGFuZCBmLmhpZGRlblxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIChmLnR5cGUgPT0gXCJsb29rdXBcIiB8fCBmLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpICYmIGYucmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcoZi5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdCMg5LiN5pSv5oyBZi5yZWZlcmVuY2VfdG/kuLpmdW5jdGlvbueahOaDheWGte+8jOaciemcgOaxguWGjeivtFxuXHRcdFx0XHRyX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGYucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRpZiByX29iamVjdFxuXHRcdFx0XHRcdF8uZm9yRWFjaCByX29iamVjdC5maWVsZHMsIChmMiwgazIpLT5cblx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7Zi5sYWJlbCB8fCBrfT0+I3tmMi5sYWJlbCB8fCBrMn1cIiwgdmFsdWU6IFwiI3trfS4je2syfVwiLCBpY29uOiByX29iamVjdD8uaWNvbn1cblx0aWYgaXNfcmVsYXRlZFxuXHRcdHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSlcblx0XHRfLmVhY2ggcmVsYXRlZE9iamVjdHMsIChfcmVsYXRlZE9iamVjdCk9PlxuXHRcdFx0cmVsYXRlZE9wdGlvbnMgPSBDcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyhfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSlcblx0XHRcdHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSlcblx0XHRcdF8uZWFjaCByZWxhdGVkT3B0aW9ucywgKHJlbGF0ZWRPcHRpb24pLT5cblx0XHRcdFx0aWYgX3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXkgIT0gcmVsYXRlZE9wdGlvbi52YWx1ZVxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7cmVsYXRlZE9iamVjdC5sYWJlbCB8fCByZWxhdGVkT2JqZWN0Lm5hbWV9PT4je3JlbGF0ZWRPcHRpb24ubGFiZWx9XCIsIHZhbHVlOiBcIiN7cmVsYXRlZE9iamVjdC5uYW1lfS4je3JlbGF0ZWRPcHRpb24udmFsdWV9XCIsIGljb246IHJlbGF0ZWRPYmplY3Q/Lmljb259XG5cdHJldHVybiBfb3B0aW9uc1xuXG4jIOe7n+S4gOS4uuWvueixoW9iamVjdF9uYW1l5o+Q5L6b5Y+v55So5LqO6L+H6JmR5Zmo6L+H6JmR5a2X5q61XG5DcmVhdG9yLmdldE9iamVjdEZpbHRlckZpZWxkT3B0aW9ucyA9IChvYmplY3RfbmFtZSktPlxuXHRfb3B0aW9ucyA9IFtdXG5cdHVubGVzcyBvYmplY3RfbmFtZVxuXHRcdHJldHVybiBfb3B0aW9uc1xuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xuXHRwZXJtaXNzaW9uX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKG9iamVjdF9uYW1lKVxuXHRpY29uID0gX29iamVjdD8uaWNvblxuXHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxuXHRcdCMgaGlkZGVuLGdyaWTnrYnnsbvlnovnmoTlrZfmrrXvvIzkuI3pnIDopoHov4fmu6Rcblx0XHRpZiAhXy5pbmNsdWRlKFtcImdyaWRcIixcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJhdmF0YXJcIiwgXCJpbWFnZVwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKSBhbmQgIWYuaGlkZGVuXG5cdFx0XHQjIGZpbHRlcnMuJC5maWVsZOWPimZsb3cuY3VycmVudOetieWtkOWtl+auteS5n+S4jemcgOimgei/h+a7pFxuXHRcdFx0aWYgIS9cXHcrXFwuLy50ZXN0KGspIGFuZCBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTFcblx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XG5cblx0cmV0dXJuIF9vcHRpb25zXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRPcHRpb25zID0gKG9iamVjdF9uYW1lKS0+XG5cdF9vcHRpb25zID0gW11cblx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIF9vcHRpb25zXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0ZmllbGRzID0gX29iamVjdD8uZmllbGRzXG5cdHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpXG5cdGljb24gPSBfb2JqZWN0Py5pY29uXG5cdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XG5cdFx0aWYgIV8uaW5jbHVkZShbXCJncmlkXCIsXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwibWFya2Rvd25cIiwgXCJodG1sXCJdLCBmLnR5cGUpXG5cdFx0XHRpZiAhL1xcdytcXC4vLnRlc3QoaykgYW5kIF8uaW5kZXhPZihwZXJtaXNzaW9uX2ZpZWxkcywgaykgPiAtMVxuXHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogZi5sYWJlbCB8fCBrLCB2YWx1ZTogaywgaWNvbjogaWNvbn1cblx0cmV0dXJuIF9vcHRpb25zXG5cbiMjI1xuZmlsdGVyczog6KaB6L2s5o2i55qEZmlsdGVyc1xuZmllbGRzOiDlr7nosaHlrZfmrrVcbmZpbHRlcl9maWVsZHM6IOm7mOiupOi/h+a7pOWtl+aute+8jOaUr+aMgeWtl+espuS4suaVsOe7hOWSjOWvueixoeaVsOe7hOS4pOenjeagvOW8j++8jOWmgjpbJ2ZpbGVkX25hbWUxJywnZmlsZWRfbmFtZTInXSxbe2ZpZWxkOidmaWxlZF9uYW1lMScscmVxdWlyZWQ6dHJ1ZX1dXG7lpITnkIbpgLvovpE6IOaKimZpbHRlcnPkuK3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25aKe5Yqg5q+P6aG555qEaXNfZGVmYXVsdOOAgWlzX3JlcXVpcmVk5bGe5oCn77yM5LiN5a2Y5Zyo5LqOZmlsdGVyX2ZpZWxkc+eahOi/h+a7pOadoeS7tuWvueW6lOeahOenu+mZpOavj+mhueeahOebuOWFs+WxnuaAp1xu6L+U5Zue57uT5p6cOiDlpITnkIblkI7nmoRmaWx0ZXJzXG4jIyNcbkNyZWF0b3IuZ2V0RmlsdGVyc1dpdGhGaWx0ZXJGaWVsZHMgPSAoZmlsdGVycywgZmllbGRzLCBmaWx0ZXJfZmllbGRzKS0+XG5cdHVubGVzcyBmaWx0ZXJzXG5cdFx0ZmlsdGVycyA9IFtdXG5cdHVubGVzcyBmaWx0ZXJfZmllbGRzXG5cdFx0ZmlsdGVyX2ZpZWxkcyA9IFtdXG5cdGlmIGZpbHRlcl9maWVsZHM/Lmxlbmd0aFxuXHRcdGZpbHRlcl9maWVsZHMuZm9yRWFjaCAobiktPlxuXHRcdFx0aWYgXy5pc1N0cmluZyhuKVxuXHRcdFx0XHRuID0gXG5cdFx0XHRcdFx0ZmllbGQ6IG4sXG5cdFx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlXG5cdFx0XHRpZiBmaWVsZHNbbi5maWVsZF0gYW5kICFfLmZpbmRXaGVyZShmaWx0ZXJzLHtmaWVsZDpuLmZpZWxkfSlcblx0XHRcdFx0ZmlsdGVycy5wdXNoXG5cdFx0XHRcdFx0ZmllbGQ6IG4uZmllbGQsXG5cdFx0XHRcdFx0aXNfZGVmYXVsdDogdHJ1ZSxcblx0XHRcdFx0XHRpc19yZXF1aXJlZDogbi5yZXF1aXJlZFxuXHRmaWx0ZXJzLmZvckVhY2ggKGZpbHRlckl0ZW0pLT5cblx0XHRtYXRjaEZpZWxkID0gZmlsdGVyX2ZpZWxkcy5maW5kIChuKS0+IHJldHVybiBuID09IGZpbHRlckl0ZW0uZmllbGQgb3Igbi5maWVsZCA9PSBmaWx0ZXJJdGVtLmZpZWxkXG5cdFx0aWYgXy5pc1N0cmluZyhtYXRjaEZpZWxkKVxuXHRcdFx0bWF0Y2hGaWVsZCA9IFxuXHRcdFx0XHRmaWVsZDogbWF0Y2hGaWVsZCxcblx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlXG5cdFx0aWYgbWF0Y2hGaWVsZFxuXHRcdFx0ZmlsdGVySXRlbS5pc19kZWZhdWx0ID0gdHJ1ZVxuXHRcdFx0ZmlsdGVySXRlbS5pc19yZXF1aXJlZCA9IG1hdGNoRmllbGQucmVxdWlyZWRcblx0XHRlbHNlXG5cdFx0XHRkZWxldGUgZmlsdGVySXRlbS5pc19kZWZhdWx0XG5cdFx0XHRkZWxldGUgZmlsdGVySXRlbS5pc19yZXF1aXJlZFxuXHRyZXR1cm4gZmlsdGVyc1xuXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpLT5cblxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRpZiAhcmVjb3JkX2lkXG5cdFx0cmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgb2JqZWN0X25hbWUgPT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSAmJiAgcmVjb3JkX2lkID09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpXG5cdFx0XHRpZiBUZW1wbGF0ZS5pbnN0YW5jZSgpPy5yZWNvcmRcblx0XHRcdFx0cmV0dXJuIFRlbXBsYXRlLmluc3RhbmNlKCk/LnJlY29yZD8uZ2V0KClcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKVxuXG5cdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpXG5cdGlmIGNvbGxlY3Rpb25cblx0XHRyZWNvcmQgPSBjb2xsZWN0aW9uLmZpbmRPbmUocmVjb3JkX2lkKVxuXHRcdHJldHVybiByZWNvcmRcblxuQ3JlYXRvci5nZXRPYmplY3RSZWNvcmROYW1lID0gKHJlY29yZCwgb2JqZWN0X25hbWUpLT5cblx0dW5sZXNzIHJlY29yZFxuXHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKClcblx0aWYgcmVjb3JkXG5cdFx0IyDmmL7npLrnu4Tnu4fliJfooajml7bvvIznibnmrorlpITnkIZuYW1lX2ZpZWxkX2tleeS4um5hbWXlrZfmrrVcblx0XHRuYW1lX2ZpZWxkX2tleSA9IGlmIG9iamVjdF9uYW1lID09IFwib3JnYW5pemF0aW9uc1wiIHRoZW4gXCJuYW1lXCIgZWxzZSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk/Lk5BTUVfRklFTERfS0VZXG5cdFx0aWYgcmVjb3JkIGFuZCBuYW1lX2ZpZWxkX2tleVxuXHRcdFx0cmV0dXJuIHJlY29yZC5sYWJlbCB8fCByZWNvcmRbbmFtZV9maWVsZF9rZXldXG5cbkNyZWF0b3IuZ2V0QXBwID0gKGFwcF9pZCktPlxuXHRpZiAhYXBwX2lkXG5cdFx0YXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcblx0YXBwID0gQ3JlYXRvci5BcHBzW2FwcF9pZF1cblx0Q3JlYXRvci5kZXBzPy5hcHA/LmRlcGVuZCgpXG5cdHJldHVybiBhcHBcblxuQ3JlYXRvci5nZXRBcHBEYXNoYm9hcmQgPSAoYXBwX2lkKS0+XG5cdGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZClcblx0aWYgIWFwcFxuXHRcdHJldHVyblxuXHRkYXNoYm9hcmQgPSBudWxsXG5cdF8uZWFjaCBDcmVhdG9yLkRhc2hib2FyZHMsICh2LCBrKS0+XG5cdFx0aWYgdi5hcHBzPy5pbmRleE9mKGFwcC5faWQpID4gLTFcblx0XHRcdGRhc2hib2FyZCA9IHY7XG5cdHJldHVybiBkYXNoYm9hcmQ7XG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkQ29tcG9uZW50ID0gKGFwcF9pZCktPlxuXHRhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpXG5cdGlmICFhcHBcblx0XHRyZXR1cm5cblx0cmV0dXJuIFJlYWN0U3RlZWRvcy5wbHVnaW5Db21wb25lbnRTZWxlY3RvcihSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKSwgXCJEYXNoYm9hcmRcIiwgYXBwLl9pZCk7XG5cbkNyZWF0b3IuZ2V0QXBwT2JqZWN0TmFtZXMgPSAoYXBwX2lkKS0+XG5cdGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZClcblx0aWYgIWFwcFxuXHRcdHJldHVyblxuXHRpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRhcHBPYmplY3RzID0gaWYgaXNNb2JpbGUgdGhlbiBhcHAubW9iaWxlX29iamVjdHMgZWxzZSBhcHAub2JqZWN0c1xuXHRvYmplY3RzID0gW11cblx0aWYgYXBwXG5cdFx0Xy5lYWNoIGFwcE9iamVjdHMsICh2KS0+XG5cdFx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdCh2KVxuXHRcdFx0aWYgb2JqPy5wZXJtaXNzaW9ucy5nZXQoKS5hbGxvd1JlYWRcblx0XHRcdFx0b2JqZWN0cy5wdXNoIHZcblx0cmV0dXJuIG9iamVjdHNcblxuQ3JlYXRvci5nZXRBcHBNZW51ID0gKGFwcF9pZCwgbWVudV9pZCktPlxuXHRtZW51cyA9IENyZWF0b3IuZ2V0QXBwTWVudXMoYXBwX2lkKVxuXHRyZXR1cm4gbWVudXMgJiYgbWVudXMuZmluZCAobWVudSktPiByZXR1cm4gbWVudS5pZCA9PSBtZW51X2lkXG5cbkNyZWF0b3IuZ2V0QXBwTWVudVVybEZvckludGVybmV0ID0gKG1lbnUpLT5cblx0IyDlvZN0YWJz57G75Z6L5Li6dXJs5pe277yM5oyJ5aSW6YOo6ZO+5o6l5aSE55CG77yM5pSv5oyB6YWN572u6KGo6L6+5byP5bm25Yqg5LiK57uf5LiA55qEdXJs5Y+C5pWwXG5cdHBhcmFtcyA9IHt9O1xuXHRwYXJhbXNbXCJYLVNwYWNlLUlkXCJdID0gU3RlZWRvcy5zcGFjZUlkKClcblx0cGFyYW1zW1wiWC1Vc2VyLUlkXCJdID0gU3RlZWRvcy51c2VySWQoKTtcblx0cGFyYW1zW1wiWC1Db21wYW55LUlkc1wiXSA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKTtcblx0IyBwYXJhbXNbXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuXHRzZGsgPSByZXF1aXJlKFwiQHN0ZWVkb3MtdWkvYnVpbGRlci1jb21tdW5pdHkvZGlzdC9idWlsZGVyLWNvbW11bml0eS5yZWFjdC5qc1wiKVxuXHR1cmwgPSBtZW51LnBhdGhcblx0aWYgc2RrIGFuZCBzZGsuVXRpbHMgYW5kIHNkay5VdGlscy5pc0V4cHJlc3Npb24odXJsKVxuXHRcdHVybCA9IHNkay5VdGlscy5wYXJzZVNpbmdsZUV4cHJlc3Npb24odXJsLCBtZW51LCBcIiNcIiwgQ3JlYXRvci5VU0VSX0NPTlRFWFQpXG5cdGhhc1F1ZXJ5U3ltYm9sID0gLyhcXCMuK1xcPyl8KFxcP1teI10qJCkvZy50ZXN0KHVybClcblx0IyDlpoLmnpzmsqHmnIkj5Y+35pe25Y675Yik5pat5piv5ZCm5pyJ77yf5Y+377yM5pyJ5pyr5bC+5YqgJu+8jOaXoOacq+WwvuWKoO+8n++8myAgICDmnIkj5Y+35pe25Yik5patI+WPt+WQjumdouaYr+WQpuacie+8n+WPt++8jOacieacq+WwvuWKoCbvvIzml6DmnKvlsL7liqDvvJ9cblx0bGlua1N0ciA9IGlmIGhhc1F1ZXJ5U3ltYm9sIHRoZW4gXCImXCIgZWxzZSBcIj9cIlxuXHRyZXR1cm4gXCIje3VybH0je2xpbmtTdHJ9I3skLnBhcmFtKHBhcmFtcyl9XCJcblxuQ3JlYXRvci5nZXRBcHBNZW51VXJsID0gKG1lbnUpLT5cblx0dXJsID0gbWVudS5wYXRoXG5cdGlmIG1lbnUudHlwZSA9PSBcInVybFwiXG5cdFx0aWYgbWVudS50YXJnZXRcblx0XHRcdHJldHVybiBDcmVhdG9yLmdldEFwcE1lbnVVcmxGb3JJbnRlcm5ldChtZW51KVxuXHRcdGVsc2Vcblx0XHRcdCMg5ZyoaWZyYW1l5Lit5pi+56S6dXJs55WM6Z2iXG5cdFx0XHRyZXR1cm4gXCIvYXBwLy0vdGFiX2lmcmFtZS8je21lbnUuaWR9XCJcblx0ZWxzZVxuXHRcdHJldHVybiBtZW51LnBhdGhcblxuQ3JlYXRvci5nZXRBcHBNZW51cyA9IChhcHBfaWQpLT5cblx0YXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKVxuXHRpZiAhYXBwXG5cdFx0cmV0dXJuIFtdXG5cdGFwcE1lbnVzID0gU2Vzc2lvbi5nZXQoXCJhcHBfbWVudXNcIik7XG5cdHVubGVzcyBhcHBNZW51c1xuXHRcdHJldHVybiBbXVxuXHRjdXJlbnRBcHBNZW51cyA9IGFwcE1lbnVzLmZpbmQgKG1lbnVJdGVtKSAtPlxuXHRcdHJldHVybiBtZW51SXRlbS5pZCA9PSBhcHAuX2lkXG5cdGlmIGN1cmVudEFwcE1lbnVzXG5cdFx0cmV0dXJuIGN1cmVudEFwcE1lbnVzLmNoaWxkcmVuXG5cbkNyZWF0b3IubG9hZEFwcHNNZW51cyA9ICgpLT5cblx0aXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKClcblx0ZGF0YSA9IHsgfVxuXHRpZiBpc01vYmlsZVxuXHRcdGRhdGEubW9iaWxlID0gaXNNb2JpbGVcblx0b3B0aW9ucyA9IHsgXG5cdFx0dHlwZTogJ2dldCcsIFxuXHRcdGRhdGE6IGRhdGEsIFxuXHRcdHN1Y2Nlc3M6IChkYXRhKS0+XG5cdFx0XHRTZXNzaW9uLnNldChcImFwcF9tZW51c1wiLCBkYXRhKTtcblx0IH1cblx0U3RlZWRvcy5hdXRoUmVxdWVzdCBcIi9zZXJ2aWNlL2FwaS9hcHBzL21lbnVzXCIsIG9wdGlvbnNcblxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwcyA9IChpbmNsdWRlQWRtaW4pLT5cblx0Y2hhbmdlQXBwID0gQ3JlYXRvci5fc3ViQXBwLmdldCgpO1xuXHRSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKS5lbnRpdGllcy5hcHBzID0gT2JqZWN0LmFzc2lnbih7fSwgUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCkuZW50aXRpZXMuYXBwcywge2FwcHM6IGNoYW5nZUFwcH0pO1xuXHRyZXR1cm4gUmVhY3RTdGVlZG9zLnZpc2libGVBcHBzU2VsZWN0b3IoUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCksIGluY2x1ZGVBZG1pbilcblxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwc09iamVjdHMgPSAoKS0+XG5cdGFwcHMgPSBDcmVhdG9yLmdldFZpc2libGVBcHBzKClcblx0dmlzaWJsZU9iamVjdE5hbWVzID0gXy5mbGF0dGVuKF8ucGx1Y2soYXBwcywnb2JqZWN0cycpKVxuXHRvYmplY3RzID0gXy5maWx0ZXIgQ3JlYXRvci5PYmplY3RzLCAob2JqKS0+XG5cdFx0aWYgdmlzaWJsZU9iamVjdE5hbWVzLmluZGV4T2Yob2JqLm5hbWUpIDwgMFxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHRydWVcblx0b2JqZWN0cyA9IG9iamVjdHMuc29ydChDcmVhdG9yLnNvcnRpbmdNZXRob2QuYmluZCh7a2V5OlwibGFiZWxcIn0pKVxuXHRvYmplY3RzID0gXy5wbHVjayhvYmplY3RzLCduYW1lJylcblx0cmV0dXJuIF8udW5pcSBvYmplY3RzXG5cbkNyZWF0b3IuZ2V0QXBwc09iamVjdHMgPSAoKS0+XG5cdG9iamVjdHMgPSBbXVxuXHR0ZW1wT2JqZWN0cyA9IFtdXG5cdF8uZm9yRWFjaCBDcmVhdG9yLkFwcHMsIChhcHApLT5cblx0XHR0ZW1wT2JqZWN0cyA9IF8uZmlsdGVyIGFwcC5vYmplY3RzLCAob2JqKS0+XG5cdFx0XHRyZXR1cm4gIW9iai5oaWRkZW5cblx0XHRvYmplY3RzID0gb2JqZWN0cy5jb25jYXQodGVtcE9iamVjdHMpXG5cdHJldHVybiBfLnVuaXEgb2JqZWN0c1xuXG5DcmVhdG9yLnZhbGlkYXRlRmlsdGVycyA9IChmaWx0ZXJzLCBsb2dpYyktPlxuXHRmaWx0ZXJfaXRlbXMgPSBfLm1hcCBmaWx0ZXJzLCAob2JqKSAtPlxuXHRcdGlmIF8uaXNFbXB0eShvYmopXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gb2JqXG5cdGZpbHRlcl9pdGVtcyA9IF8uY29tcGFjdChmaWx0ZXJfaXRlbXMpXG5cdGVycm9yTXNnID0gXCJcIlxuXHRmaWx0ZXJfbGVuZ3RoID0gZmlsdGVyX2l0ZW1zLmxlbmd0aFxuXHRpZiBsb2dpY1xuXHRcdCMg5qC85byP5YyWZmlsdGVyXG5cdFx0bG9naWMgPSBsb2dpYy5yZXBsYWNlKC9cXG4vZywgXCJcIikucmVwbGFjZSgvXFxzKy9nLCBcIiBcIilcblxuXHRcdCMg5Yik5pat54m55q6K5a2X56ymXG5cdFx0aWYgL1suX1xcLSErXSsvaWcudGVzdChsb2dpYylcblx0XHRcdGVycm9yTXNnID0gXCLlkKvmnInnibnmrorlrZfnrKbjgIJcIlxuXG5cdFx0aWYgIWVycm9yTXNnXG5cdFx0XHRpbmRleCA9IGxvZ2ljLm1hdGNoKC9cXGQrL2lnKVxuXHRcdFx0aWYgIWluZGV4XG5cdFx0XHRcdGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpbmRleC5mb3JFYWNoIChpKS0+XG5cdFx0XHRcdFx0aWYgaSA8IDEgb3IgaSA+IGZpbHRlcl9sZW5ndGhcblx0XHRcdFx0XHRcdGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInmnaHku7blvJXnlKjkuobmnKrlrprkuYnnmoTnrZvpgInlmajvvJoje2l944CCXCJcblxuXHRcdFx0XHRmbGFnID0gMVxuXHRcdFx0XHR3aGlsZSBmbGFnIDw9IGZpbHRlcl9sZW5ndGhcblx0XHRcdFx0XHRpZiAhaW5kZXguaW5jbHVkZXMoXCIje2ZsYWd9XCIpXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCJcblx0XHRcdFx0XHRmbGFnKys7XG5cblx0XHRpZiAhZXJyb3JNc2dcblx0XHRcdCMg5Yik5pat5piv5ZCm5pyJ6Z2e5rOV6Iux5paH5a2X56ymXG5cdFx0XHR3b3JkID0gbG9naWMubWF0Y2goL1thLXpBLVpdKy9pZylcblx0XHRcdGlmIHdvcmRcblx0XHRcdFx0d29yZC5mb3JFYWNoICh3KS0+XG5cdFx0XHRcdFx0aWYgIS9eKGFuZHxvcikkL2lnLnRlc3Qodylcblx0XHRcdFx0XHRcdGVycm9yTXNnID0gXCLmo4Dmn6XmgqjnmoTpq5jnuqfnrZvpgInmnaHku7bkuK3nmoTmi7zlhpnjgIJcIlxuXG5cdFx0aWYgIWVycm9yTXNnXG5cdFx0XHQjIOWIpOaWreagvOW8j+aYr+WQpuato+ehrlxuXHRcdFx0dHJ5XG5cdFx0XHRcdENyZWF0b3IuZXZhbChsb2dpYy5yZXBsYWNlKC9hbmQvaWcsIFwiJiZcIikucmVwbGFjZSgvb3IvaWcsIFwifHxcIikpXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajkuK3lkKvmnInnibnmrorlrZfnrKZcIlxuXG5cdFx0XHRpZiAvKEFORClbXigpXSsoT1IpL2lnLnRlc3QobG9naWMpIHx8ICAvKE9SKVteKCldKyhBTkQpL2lnLnRlc3QobG9naWMpXG5cdFx0XHRcdGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajlv4XpobvlnKjov57nu63mgKfnmoQgQU5EIOWSjCBPUiDooajovr7lvI/liY3lkI7kvb/nlKjmi6zlj7fjgIJcIlxuXHRpZiBlcnJvck1zZ1xuXHRcdGNvbnNvbGUubG9nIFwiZXJyb3JcIiwgZXJyb3JNc2dcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHRvYXN0ci5lcnJvcihlcnJvck1zZylcblx0XHRyZXR1cm4gZmFsc2Vcblx0ZWxzZVxuXHRcdHJldHVybiB0cnVlXG5cbiMgXCI9XCIsIFwiPD5cIiwgXCI+XCIsIFwiPj1cIiwgXCI8XCIsIFwiPD1cIiwgXCJzdGFydHN3aXRoXCIsIFwiY29udGFpbnNcIiwgXCJub3Rjb250YWluc1wiLlxuIyMjXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuIyMjXG5DcmVhdG9yLmZvcm1hdEZpbHRlcnNUb01vbmdvID0gKGZpbHRlcnMsIG9wdGlvbnMpLT5cblx0dW5sZXNzIGZpbHRlcnM/Lmxlbmd0aFxuXHRcdHJldHVyblxuXHQjIOW9k2ZpbHRlcnPkuI3mmK9bQXJyYXld57G75Z6L6ICM5pivW09iamVjdF3nsbvlnovml7bvvIzov5vooYzmoLzlvI/ovazmjaJcblx0dW5sZXNzIGZpbHRlcnNbMF0gaW5zdGFuY2VvZiBBcnJheVxuXHRcdGZpbHRlcnMgPSBfLm1hcCBmaWx0ZXJzLCAob2JqKS0+XG5cdFx0XHRyZXR1cm4gW29iai5maWVsZCwgb2JqLm9wZXJhdGlvbiwgb2JqLnZhbHVlXVxuXHRzZWxlY3RvciA9IFtdXG5cdF8uZWFjaCBmaWx0ZXJzLCAoZmlsdGVyKS0+XG5cdFx0ZmllbGQgPSBmaWx0ZXJbMF1cblx0XHRvcHRpb24gPSBmaWx0ZXJbMV1cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdKVxuXHRcdGVsc2Vcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBudWxsLCBvcHRpb25zKVxuXHRcdHN1Yl9zZWxlY3RvciA9IHt9XG5cdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXSA9IHt9XG5cdFx0aWYgb3B0aW9uID09IFwiPVwiXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGVxXCJdID0gdmFsdWVcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIjw+XCJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbmVcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPlwiXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGd0XCJdID0gdmFsdWVcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIj49XCJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RlXCJdID0gdmFsdWVcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIjxcIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdFwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8PVwiXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGx0ZVwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCJzdGFydHN3aXRoXCJcblx0XHRcdHJlZyA9IG5ldyBSZWdFeHAoXCJeXCIgKyB2YWx1ZSwgXCJpXCIpXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCJjb250YWluc1wiXG5cdFx0XHRyZWcgPSBuZXcgUmVnRXhwKHZhbHVlLCBcImlcIilcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWdcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIm5vdGNvbnRhaW5zXCJcblx0XHRcdHJlZyA9IG5ldyBSZWdFeHAoXCJeKCg/IVwiICsgdmFsdWUgKyBcIikuKSokXCIsIFwiaVwiKVxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZ1xuXHRcdHNlbGVjdG9yLnB1c2ggc3ViX3NlbGVjdG9yXG5cdHJldHVybiBzZWxlY3RvclxuXG5DcmVhdG9yLmlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiA9IChvcGVyYXRpb24pLT5cblx0cmV0dXJuIG9wZXJhdGlvbiA9PSBcImJldHdlZW5cIiBvciAhIUNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKHRydWUpP1tvcGVyYXRpb25dXG5cbiMjI1xub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcblx0ZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuIyMjXG5DcmVhdG9yLmZvcm1hdEZpbHRlcnNUb0RldiA9IChmaWx0ZXJzLCBvYmplY3RfbmFtZSwgb3B0aW9ucyktPlxuXHRzdGVlZG9zRmlsdGVycyA9IHJlcXVpcmUoXCJAc3RlZWRvcy9maWx0ZXJzXCIpO1xuXHR1bmxlc3MgZmlsdGVycy5sZW5ndGhcblx0XHRyZXR1cm5cblx0aWYgb3B0aW9ucz8uaXNfbG9naWNfb3Jcblx0XHQjIOWmguaenGlzX2xvZ2ljX29y5Li6dHJ1Ze+8jOS4umZpbHRlcnPnrKzkuIDlsYLlhYPntKDlop7liqBvcumXtOmalFxuXHRcdGxvZ2ljVGVtcEZpbHRlcnMgPSBbXVxuXHRcdGZpbHRlcnMuZm9yRWFjaCAobiktPlxuXHRcdFx0bG9naWNUZW1wRmlsdGVycy5wdXNoKG4pXG5cdFx0XHRsb2dpY1RlbXBGaWx0ZXJzLnB1c2goXCJvclwiKVxuXHRcdGxvZ2ljVGVtcEZpbHRlcnMucG9wKClcblx0XHRmaWx0ZXJzID0gbG9naWNUZW1wRmlsdGVyc1xuXHRzZWxlY3RvciA9IHN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb0RldihmaWx0ZXJzLCBDcmVhdG9yLlVTRVJfQ09OVEVYVClcblx0cmV0dXJuIHNlbGVjdG9yXG5cbiMjI1xub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcbmV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcbiMjI1xuQ3JlYXRvci5mb3JtYXRMb2dpY0ZpbHRlcnNUb0RldiA9IChmaWx0ZXJzLCBmaWx0ZXJfbG9naWMsIG9wdGlvbnMpLT5cblx0Zm9ybWF0X2xvZ2ljID0gZmlsdGVyX2xvZ2ljLnJlcGxhY2UoL1xcKFxccysvaWcsIFwiKFwiKS5yZXBsYWNlKC9cXHMrXFwpL2lnLCBcIilcIikucmVwbGFjZSgvXFwoL2csIFwiW1wiKS5yZXBsYWNlKC9cXCkvZywgXCJdXCIpLnJlcGxhY2UoL1xccysvZywgXCIsXCIpLnJlcGxhY2UoLyhhbmR8b3IpL2lnLCBcIickMSdcIilcblx0Zm9ybWF0X2xvZ2ljID0gZm9ybWF0X2xvZ2ljLnJlcGxhY2UoLyhcXGQpKy9pZywgKHgpLT5cblx0XHRfZiA9IGZpbHRlcnNbeC0xXVxuXHRcdGZpZWxkID0gX2YuZmllbGRcblx0XHRvcHRpb24gPSBfZi5vcGVyYXRpb25cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUpXG5cdFx0ZWxzZVxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShfZi52YWx1ZSwgbnVsbCwgb3B0aW9ucylcblx0XHRzdWJfc2VsZWN0b3IgPSBbXVxuXHRcdGlmIF8uaXNBcnJheSh2YWx1ZSkgPT0gdHJ1ZVxuXHRcdFx0aWYgb3B0aW9uID09IFwiPVwiXG5cdFx0XHRcdF8uZWFjaCB2YWx1ZSwgKHYpLT5cblx0XHRcdFx0XHRzdWJfc2VsZWN0b3IucHVzaCBbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIlxuXHRcdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8PlwiXG5cdFx0XHRcdF8uZWFjaCB2YWx1ZSwgKHYpLT5cblx0XHRcdFx0XHRzdWJfc2VsZWN0b3IucHVzaCBbZmllbGQsIG9wdGlvbiwgdl0sIFwiYW5kXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0Xy5lYWNoIHZhbHVlLCAodiktPlxuXHRcdFx0XHRcdHN1Yl9zZWxlY3Rvci5wdXNoIFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiXG5cdFx0XHRpZiBzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09IFwiYW5kXCIgfHwgc3ViX3NlbGVjdG9yW3N1Yl9zZWxlY3Rvci5sZW5ndGggLSAxXSA9PSBcIm9yXCJcblx0XHRcdFx0c3ViX3NlbGVjdG9yLnBvcCgpXG5cdFx0ZWxzZVxuXHRcdFx0c3ViX3NlbGVjdG9yID0gW2ZpZWxkLCBvcHRpb24sIHZhbHVlXVxuXHRcdGNvbnNvbGUubG9nIFwic3ViX3NlbGVjdG9yXCIsIHN1Yl9zZWxlY3RvclxuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShzdWJfc2VsZWN0b3IpXG5cdClcblx0Zm9ybWF0X2xvZ2ljID0gXCJbI3tmb3JtYXRfbG9naWN9XVwiXG5cdHJldHVybiBDcmVhdG9yLmV2YWwoZm9ybWF0X2xvZ2ljKVxuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdGlmICF1c2VySWRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXG5cdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW11cblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdGlmICFfb2JqZWN0XG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzXG5cbiNcdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhfb2JqZWN0LnJlbGF0ZWRfb2JqZWN0cyxcIm9iamVjdF9uYW1lXCIpXG5cblx0cmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhfb2JqZWN0Ll9jb2xsZWN0aW9uX25hbWUpXG5cblx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cyxcIm9iamVjdF9uYW1lXCIpXG5cdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWVzPy5sZW5ndGggPT0gMFxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lc1xuXG5cdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHR1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzXG5cblx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLmRpZmZlcmVuY2UgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHVucmVsYXRlZF9vYmplY3RzXG5cdHJldHVybiBfLmZpbHRlciByZWxhdGVkX29iamVjdHMsIChyZWxhdGVkX29iamVjdCktPlxuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdC5vYmplY3RfbmFtZVxuXHRcdGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xXG5cdFx0IyByZWxhdGVkX29iamVjdF9uYW1lID0gaWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNmc19maWxlc19maWxlcmVjb3JkXCIgdGhlbiBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIgZWxzZSByZWxhdGVkX29iamVjdF9uYW1lXG5cdFx0YWxsb3dSZWFkID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy5hbGxvd1JlYWRcblx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdGFsbG93UmVhZCA9IGFsbG93UmVhZCAmJiBwZXJtaXNzaW9ucy5hbGxvd1JlYWRGaWxlc1xuXHRcdHJldHVybiBpc0FjdGl2ZSBhbmQgYWxsb3dSZWFkXG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdE5hbWVzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0cmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRyZXR1cm4gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RMaXN0QWN0aW9ucyA9IChyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGFjdGlvbnMgPSBDcmVhdG9yLmdldEFjdGlvbnMocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0YWN0aW9ucyA9IF8uZmlsdGVyIGFjdGlvbnMsIChhY3Rpb24pLT5cblx0XHRpZiBhY3Rpb24ubmFtZSA9PSBcInN0YW5kYXJkX2ZvbGxvd1wiXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRpZiBhY3Rpb24ubmFtZSA9PSBcInN0YW5kYXJkX3F1ZXJ5XCJcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGlmIGFjdGlvbi5vbiA9PSBcImxpc3RcIlxuXHRcdFx0aWYgdHlwZW9mIGFjdGlvbi52aXNpYmxlID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRyZXR1cm4gYWN0aW9uLnZpc2libGUoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gYWN0aW9uLnZpc2libGVcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0cmV0dXJuIGFjdGlvbnNcblxuQ3JlYXRvci5nZXRBY3Rpb25zID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdGlmICF1c2VySWRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdGlmICFvYmpcblx0XHRyZXR1cm5cblxuXHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0ZGlzYWJsZWRfYWN0aW9ucyA9IHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnNcblx0YWN0aW9ucyA9IF8uc29ydEJ5KF8udmFsdWVzKG9iai5hY3Rpb25zKSAsICdzb3J0Jyk7XG5cblx0aWYgXy5oYXMob2JqLCAnYWxsb3dfY3VzdG9tQWN0aW9ucycpXG5cdFx0YWN0aW9ucyA9IF8uZmlsdGVyIGFjdGlvbnMsIChhY3Rpb24pLT5cblx0XHRcdHJldHVybiBfLmluY2x1ZGUob2JqLmFsbG93X2N1c3RvbUFjdGlvbnMsIGFjdGlvbi5uYW1lKSB8fCBfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuZ2V0T2JqZWN0KCdiYXNlJykuYWN0aW9ucykgfHwge30sIGFjdGlvbi5uYW1lKVxuXHRpZiBfLmhhcyhvYmosICdleGNsdWRlX2FjdGlvbnMnKVxuXHRcdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XG5cdFx0XHRyZXR1cm4gIV8uaW5jbHVkZShvYmouZXhjbHVkZV9hY3Rpb25zLCBhY3Rpb24ubmFtZSlcblxuXHRfLmVhY2ggYWN0aW9ucywgKGFjdGlvbiktPlxuXHRcdCMg5omL5py65LiK5Y+q5pi+56S657yW6L6R5oyJ6ZKu77yM5YW25LuW55qE5pS+5Yiw5oqY5Y+g5LiL5ouJ6I+c5Y2V5LitXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcInJlY29yZFwiLCBcInJlY29yZF9vbmx5XCJdLmluZGV4T2YoYWN0aW9uLm9uKSA+IC0xICYmIGFjdGlvbi5uYW1lICE9ICdzdGFuZGFyZF9lZGl0J1xuXHRcdFx0aWYgYWN0aW9uLm9uID09IFwicmVjb3JkX29ubHlcIlxuXHRcdFx0XHRhY3Rpb24ub24gPSAncmVjb3JkX29ubHlfbW9yZSdcblx0XHRcdGVsc2Vcblx0XHRcdFx0YWN0aW9uLm9uID0gJ3JlY29yZF9tb3JlJ1xuXG5cdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJjbXNfZmlsZXNcIiwgXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXS5pbmRleE9mKG9iamVjdF9uYW1lKSA+IC0xXG5cdFx0IyDpmYTku7bnibnmrorlpITnkIbvvIzkuIvovb3mjInpkq7mlL7lnKjkuLvoj5zljZXvvIznvJbovpHmjInpkq7mlL7liLDlupXkuIvmipjlj6DkuIvmi4noj5zljZXkuK1cblx0XHRhY3Rpb25zLmZpbmQoKG4pLT4gcmV0dXJuIG4ubmFtZSA9PSBcInN0YW5kYXJkX2VkaXRcIik/Lm9uID0gXCJyZWNvcmRfbW9yZVwiXG5cdFx0YWN0aW9ucy5maW5kKChuKS0+IHJldHVybiBuLm5hbWUgPT0gXCJkb3dubG9hZFwiKT8ub24gPSBcInJlY29yZFwiXG5cblx0YWN0aW9ucyA9IF8uZmlsdGVyIGFjdGlvbnMsIChhY3Rpb24pLT5cblx0XHRyZXR1cm4gXy5pbmRleE9mKGRpc2FibGVkX2FjdGlvbnMsIGFjdGlvbi5uYW1lKSA8IDBcblxuXHRyZXR1cm4gYWN0aW9uc1xuXG4vLy9cblx06L+U5Zue5b2T5YmN55So5oi35pyJ5p2D6ZmQ6K6/6Zeu55qE5omA5pyJbGlzdF92aWV377yM5YyF5ous5YiG5Lqr55qE77yM55So5oi36Ieq5a6a5LmJ6Z2e5YiG5Lqr55qE77yI6Zmk6Z2eb3duZXLlj5jkuobvvInvvIzku6Xlj4rpu5jorqTnmoTlhbbku5bop4blm75cblx05rOo5oSPQ3JlYXRvci5nZXRQZXJtaXNzaW9uc+WHveaVsOS4reaYr+S4jeS8muacieeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahOinhuWbvueahO+8jOaJgOS7pUNyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mi7/liLDnmoTnu5PmnpzkuI3lhajvvIzlubbkuI3mmK/lvZPliY3nlKjmiLfog73nnIvliLDmiYDmnInop4blm75cbi8vL1xuQ3JlYXRvci5nZXRMaXN0Vmlld3MgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cdFxuXHR1bmxlc3Mgb2JqZWN0X25hbWVcblx0XHRyZXR1cm5cblxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRpZiAhb2JqZWN0XG5cdFx0cmV0dXJuXG5cblx0ZGlzYWJsZWRfbGlzdF92aWV3cyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk/LmRpc2FibGVkX2xpc3Rfdmlld3MgfHwgW11cblxuXHRsaXN0X3ZpZXdzID0gW11cblxuXHRpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKVxuXG5cdF8uZWFjaCBvYmplY3QubGlzdF92aWV3cywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZVxuXG5cdGxpc3RWaWV3cyA9IF8uc29ydEJ5KF8udmFsdWVzKG9iamVjdC5saXN0X3ZpZXdzKSAsICdzb3J0X25vJyk7XG5cblx0Xy5lYWNoIGxpc3RWaWV3cywgKGl0ZW0pLT5cblx0XHRpZiBpc01vYmlsZSBhbmQgaXRlbS50eXBlID09IFwiY2FsZW5kYXJcIlxuXHRcdFx0IyDmiYvmnLrkuIrlhYjkuI3mmL7npLrml6Xljobop4blm75cblx0XHRcdHJldHVyblxuXHRcdGlmIGl0ZW0ubmFtZSAgIT0gXCJkZWZhdWx0XCJcblx0XHRcdGlzRGlzYWJsZWQgPSBfLmluZGV4T2YoZGlzYWJsZWRfbGlzdF92aWV3cywgaXRlbS5uYW1lKSA+IC0xIHx8IChpdGVtLl9pZCAmJiBfLmluZGV4T2YoZGlzYWJsZWRfbGlzdF92aWV3cywgaXRlbS5faWQpID4gLTEpXG5cdFx0XHRpZiAhaXNEaXNhYmxlZCB8fCBpdGVtLm93bmVyID09IHVzZXJJZFxuXHRcdFx0XHRsaXN0X3ZpZXdzLnB1c2ggaXRlbVxuXHRyZXR1cm4gbGlzdF92aWV3c1xuXG4jIOWJjeWPsOeQhuiuuuS4iuS4jeW6lOivpeiwg+eUqOivpeWHveaVsO+8jOWboOS4uuWtl+auteeahOadg+mZkOmDveWcqENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKS5maWVsZHPnmoTnm7jlhbPlsZ7mgKfkuK3mnInmoIfor4bkuoZcbkNyZWF0b3IuZ2V0RmllbGRzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdGlmICF1c2VySWRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXG5cdGZpZWxkc05hbWUgPSBDcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUob2JqZWN0X25hbWUpXG5cdHVucmVhZGFibGVfZmllbGRzID0gIENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk/LnVucmVhZGFibGVfZmllbGRzXG5cdHJldHVybiBfLmRpZmZlcmVuY2UoZmllbGRzTmFtZSwgdW5yZWFkYWJsZV9maWVsZHMpXG5cbkNyZWF0b3IuaXNsb2FkaW5nID0gKCktPlxuXHRyZXR1cm4gIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkLmdldCgpXG5cbkNyZWF0b3IuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSAoc3RyKS0+XG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIilcblxuIyDorqHnrpdmaWVsZHPnm7jlhbPlh73mlbBcbiMgU1RBUlRcbkNyZWF0b3IuZ2V0RGlzYWJsZWRGaWVsZHMgPSAoc2NoZW1hKS0+XG5cdGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkLCBmaWVsZE5hbWUpIC0+XG5cdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS5kaXNhYmxlZCBhbmQgIWZpZWxkLmF1dG9mb3JtLm9taXQgYW5kIGZpZWxkTmFtZVxuXHQpXG5cdGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpXG5cdHJldHVybiBmaWVsZHNcblxuQ3JlYXRvci5nZXRIaWRkZW5GaWVsZHMgPSAoc2NoZW1hKS0+XG5cdGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkLCBmaWVsZE5hbWUpIC0+XG5cdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS50eXBlID09IFwiaGlkZGVuXCIgYW5kICFmaWVsZC5hdXRvZm9ybS5vbWl0IGFuZCBmaWVsZE5hbWVcblx0KVxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxuXHRyZXR1cm4gZmllbGRzXG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aE5vR3JvdXAgPSAoc2NoZW1hKS0+XG5cdGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkLCBmaWVsZE5hbWUpIC0+XG5cdFx0cmV0dXJuICghZmllbGQuYXV0b2Zvcm0gb3IgIWZpZWxkLmF1dG9mb3JtLmdyb3VwIG9yIGZpZWxkLmF1dG9mb3JtLmdyb3VwID09IFwiLVwiKSBhbmQgKCFmaWVsZC5hdXRvZm9ybSBvciBmaWVsZC5hdXRvZm9ybS50eXBlICE9IFwiaGlkZGVuXCIpIGFuZCBmaWVsZE5hbWVcblx0KVxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxuXHRyZXR1cm4gZmllbGRzXG5cbkNyZWF0b3IuZ2V0U29ydGVkRmllbGRHcm91cE5hbWVzID0gKHNjaGVtYSktPlxuXHRuYW1lcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkKSAtPlxuIFx0XHRyZXR1cm4gZmllbGQuYXV0b2Zvcm0gYW5kIGZpZWxkLmF1dG9mb3JtLmdyb3VwICE9IFwiLVwiIGFuZCBmaWVsZC5hdXRvZm9ybS5ncm91cFxuXHQpXG5cdG5hbWVzID0gXy5jb21wYWN0KG5hbWVzKVxuXHRuYW1lcyA9IF8udW5pcXVlKG5hbWVzKVxuXHRyZXR1cm4gbmFtZXNcblxuQ3JlYXRvci5nZXRGaWVsZHNGb3JHcm91cCA9IChzY2hlbWEsIGdyb3VwTmFtZSkgLT5cbiAgXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxuICAgIFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PSBncm91cE5hbWUgYW5kIGZpZWxkLmF1dG9mb3JtLnR5cGUgIT0gXCJoaWRkZW5cIiBhbmQgZmllbGROYW1lXG4gIFx0KVxuICBcdGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpXG4gIFx0cmV0dXJuIGZpZWxkc1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRPbWl0ID0gKHNjaGVtYSwga2V5cykgLT5cblx0a2V5cyA9IF8ubWFwKGtleXMsIChrZXkpIC0+XG5cdFx0ZmllbGQgPSBfLnBpY2soc2NoZW1hLCBrZXkpXG5cdFx0aWYgZmllbGRba2V5XS5hdXRvZm9ybT8ub21pdFxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGtleVxuXHQpXG5cdGtleXMgPSBfLmNvbXBhY3Qoa2V5cylcblx0cmV0dXJuIGtleXNcblxuQ3JlYXRvci5nZXRGaWVsZHNJbkZpcnN0TGV2ZWwgPSAoZmlyc3RMZXZlbEtleXMsIGtleXMpIC0+XG5cdGtleXMgPSBfLm1hcChrZXlzLCAoa2V5KSAtPlxuXHRcdGlmIF8uaW5kZXhPZihmaXJzdExldmVsS2V5cywga2V5KSA+IC0xXG5cdFx0XHRyZXR1cm4ga2V5XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdClcblx0a2V5cyA9IF8uY29tcGFjdChrZXlzKVxuXHRyZXR1cm4ga2V5c1xuXG5DcmVhdG9yLmdldEZpZWxkc0ZvclJlb3JkZXIgPSAoc2NoZW1hLCBrZXlzLCBpc1NpbmdsZSkgLT5cblx0ZmllbGRzID0gW11cblx0aSA9IDBcblx0X2tleXMgPSBfLmZpbHRlcihrZXlzLCAoa2V5KS0+XG5cdFx0cmV0dXJuICFrZXkuZW5kc1dpdGgoJ19lbmRMaW5lJylcblx0KTtcblx0d2hpbGUgaSA8IF9rZXlzLmxlbmd0aFxuXHRcdHNjXzEgPSBfLnBpY2soc2NoZW1hLCBfa2V5c1tpXSlcblx0XHRzY18yID0gXy5waWNrKHNjaGVtYSwgX2tleXNbaSsxXSlcblxuXHRcdGlzX3dpZGVfMSA9IGZhbHNlXG5cdFx0aXNfd2lkZV8yID0gZmFsc2VcblxuI1x0XHRpc19yYW5nZV8xID0gZmFsc2VcbiNcdFx0aXNfcmFuZ2VfMiA9IGZhbHNlXG5cblx0XHRfLmVhY2ggc2NfMSwgKHZhbHVlKSAtPlxuXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3dpZGUgfHwgdmFsdWUuYXV0b2Zvcm0/LnR5cGUgPT0gXCJ0YWJsZVwiXG5cdFx0XHRcdGlzX3dpZGVfMSA9IHRydWVcblxuI1x0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc19yYW5nZVxuI1x0XHRcdFx0aXNfcmFuZ2VfMSA9IHRydWVcblxuXHRcdF8uZWFjaCBzY18yLCAodmFsdWUpIC0+XG5cdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfd2lkZSB8fCB2YWx1ZS5hdXRvZm9ybT8udHlwZSA9PSBcInRhYmxlXCJcblx0XHRcdFx0aXNfd2lkZV8yID0gdHJ1ZVxuXG4jXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3JhbmdlXG4jXHRcdFx0XHRpc19yYW5nZV8yID0gdHJ1ZVxuXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRpc193aWRlXzEgPSB0cnVlXG5cdFx0XHRpc193aWRlXzIgPSB0cnVlXG5cblx0XHRpZiBpc1NpbmdsZVxuXHRcdFx0ZmllbGRzLnB1c2ggX2tleXMuc2xpY2UoaSwgaSsxKVxuXHRcdFx0aSArPSAxXG5cdFx0ZWxzZVxuI1x0XHRcdGlmICFpc19yYW5nZV8xICYmIGlzX3JhbmdlXzJcbiNcdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcbiNcdFx0XHRcdGNoaWxkS2V5cy5wdXNoIHVuZGVmaW5lZFxuI1x0XHRcdFx0ZmllbGRzLnB1c2ggY2hpbGRLZXlzXG4jXHRcdFx0XHRpICs9IDFcbiNcdFx0XHRlbHNlXG5cdFx0XHRpZiBpc193aWRlXzFcblx0XHRcdFx0ZmllbGRzLnB1c2ggX2tleXMuc2xpY2UoaSwgaSsxKVxuXHRcdFx0XHRpICs9IDFcblx0XHRcdGVsc2UgaWYgIWlzX3dpZGVfMSBhbmQgaXNfd2lkZV8yXG5cdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcblx0XHRcdFx0Y2hpbGRLZXlzLnB1c2ggdW5kZWZpbmVkXG5cdFx0XHRcdGZpZWxkcy5wdXNoIGNoaWxkS2V5c1xuXHRcdFx0XHRpICs9IDFcblx0XHRcdGVsc2UgaWYgIWlzX3dpZGVfMSBhbmQgIWlzX3dpZGVfMlxuXHRcdFx0XHRjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpKzEpXG5cdFx0XHRcdGlmIF9rZXlzW2krMV1cblx0XHRcdFx0XHRjaGlsZEtleXMucHVzaCBfa2V5c1tpKzFdXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcblx0XHRcdFx0ZmllbGRzLnB1c2ggY2hpbGRLZXlzXG5cdFx0XHRcdGkgKz0gMlxuXG5cdHJldHVybiBmaWVsZHNcblxuQ3JlYXRvci5pc0ZpbHRlclZhbHVlRW1wdHkgPSAodikgLT5cblx0cmV0dXJuIHR5cGVvZiB2ID09IFwidW5kZWZpbmVkXCIgfHwgdiA9PSBudWxsIHx8IE51bWJlci5pc05hTih2KSB8fCB2Lmxlbmd0aCA9PSAwXG5cbkNyZWF0b3IuZ2V0RmllbGREYXRhVHlwZSA9IChvYmplY3RGaWVsZHMsIGtleSktPlxuXHRpZiBvYmplY3RGaWVsZHMgYW5kIGtleVxuXHRcdHJlc3VsdCA9IG9iamVjdEZpZWxkc1trZXldPy50eXBlXG5cdFx0aWYgW1wiZm9ybXVsYVwiLCBcInN1bW1hcnlcIl0uaW5kZXhPZihyZXN1bHQpID4gLTFcblx0XHRcdHJlc3VsdCA9IG9iamVjdEZpZWxkc1trZXldLmRhdGFfdHlwZVxuXHRcdCMgZWxzZSBpZiByZXN1bHQgPT0gXCJzZWxlY3RcIiBhbmQgb2JqZWN0RmllbGRzW2tleV0/LmRhdGFfdHlwZSBhbmQgb2JqZWN0RmllbGRzW2tleV0uZGF0YV90eXBlICE9IFwidGV4dFwiXG5cdFx0IyBcdHJlc3VsdCA9IG9iamVjdEZpZWxkc1trZXldLmRhdGFfdHlwZVxuXHRcdHJldHVybiByZXN1bHRcblx0ZWxzZVxuXHRcdHJldHVybiBcInRleHRcIlxuXG4jIEVORFxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Q3JlYXRvci5nZXRBbGxSZWxhdGVkT2JqZWN0cyA9IChvYmplY3RfbmFtZSktPlxuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW11cblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cblx0XHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cblx0XHRcdFx0aWYgcmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWVcblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoIHJlbGF0ZWRfb2JqZWN0X25hbWVcblxuXHRcdGlmIENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKS5lbmFibGVfZmlsZXNcblx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzLnB1c2ggXCJjbXNfZmlsZXNcIlxuXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRTdGVlZG9zLmZvcm1hdEluZGV4ID0gKGFycmF5KSAtPlxuXHRcdG9iamVjdCA9IHtcbiAgICAgICAgXHRiYWNrZ3JvdW5kOiB0cnVlXG4gICAgXHR9O1xuXHRcdGlzZG9jdW1lbnREQiA9IE1ldGVvci5zZXR0aW5ncz8uZGF0YXNvdXJjZXM/LmRlZmF1bHQ/LmRvY3VtZW50REIgfHwgZmFsc2U7XG5cdFx0aWYgaXNkb2N1bWVudERCXG5cdFx0XHRpZiBhcnJheS5sZW5ndGggPiAwXG5cdFx0XHRcdGluZGV4TmFtZSA9IGFycmF5LmpvaW4oXCIuXCIpO1xuXHRcdFx0XHRvYmplY3QubmFtZSA9IGluZGV4TmFtZTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChpbmRleE5hbWUubGVuZ3RoID4gNTIpXG5cdFx0XHRcdFx0b2JqZWN0Lm5hbWUgPSBpbmRleE5hbWUuc3Vic3RyaW5nKDAsNTIpO1xuXG5cdFx0cmV0dXJuIG9iamVjdDsiLCJDcmVhdG9yLmdldFNjaGVtYSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLnNjaGVtYSA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gUmVhY3RTdGVlZG9zLnBsdWdpbkNvbXBvbmVudFNlbGVjdG9yKFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLCBcIk9iamVjdEhvbWVcIiwgb2JqZWN0X25hbWUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkge1xuICB2YXIgbGlzdF92aWV3LCBsaXN0X3ZpZXdfaWQ7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKTtcbiAgbGlzdF92aWV3X2lkID0gbGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcuX2lkIDogdm9pZCAwO1xuICBpZiAocmVjb3JkX2lkKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQpO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJtZWV0aW5nXCIpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChDcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQob2JqZWN0X25hbWUpKSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGxpc3Rfdmlld19pZCkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RBYnNvbHV0ZVVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkge1xuICB2YXIgbGlzdF92aWV3LCBsaXN0X3ZpZXdfaWQ7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKTtcbiAgbGlzdF92aWV3X2lkID0gbGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcuX2lkIDogdm9pZCAwO1xuICBpZiAocmVjb3JkX2lkKSB7XG4gICAgcmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQsIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJtZWV0aW5nXCIpIHtcbiAgICAgIHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIiwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkLCB0cnVlKTtcbiAgICB9XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0Um91dGVyVXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSB7XG4gIHZhciBsaXN0X3ZpZXcsIGxpc3Rfdmlld19pZDtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpO1xuICBsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5faWQgOiB2b2lkIDA7XG4gIGlmIChyZWNvcmRfaWQpIHtcbiAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBcIm1lZXRpbmdcIikge1xuICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkO1xuICAgIH1cbiAgfVxufTtcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1VybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkge1xuICB2YXIgdXJsO1xuICB1cmwgPSBDcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKTtcbiAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwodXJsKTtcbn07XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkge1xuICBpZiAobGlzdF92aWV3X2lkID09PSBcImNhbGVuZGFyXCIpIHtcbiAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRTd2l0Y2hMaXN0VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSB7XG4gIGlmIChsaXN0X3ZpZXdfaWQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi9saXN0XCIpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9saXN0L3N3aXRjaFwiKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgcmVjb3JkX2lkLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgaWYgKHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIHJlY29yZF9pZCArIFwiL1wiICsgcmVsYXRlZF9vYmplY3RfbmFtZSArIFwiL2dyaWQ/cmVsYXRlZF9maWVsZF9uYW1lPVwiICsgcmVsYXRlZF9maWVsZF9uYW1lKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyByZWNvcmRfaWQgKyBcIi9cIiArIHJlbGF0ZWRfb2JqZWN0X25hbWUgKyBcIi9ncmlkXCIpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBpc19kZWVwLCBpc19za2lwX2hpZGUsIGlzX3JlbGF0ZWQpIHtcbiAgdmFyIF9vYmplY3QsIF9vcHRpb25zLCBmaWVsZHMsIGljb24sIHJlbGF0ZWRPYmplY3RzO1xuICBfb3B0aW9ucyA9IFtdO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIF9vcHRpb25zO1xuICB9XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZmllbGRzIDogdm9pZCAwO1xuICBpY29uID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwO1xuICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgaWYgKGlzX3NraXBfaGlkZSAmJiBmLmhpZGRlbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZi50eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgIGxhYmVsOiBcIlwiICsgKGYubGFiZWwgfHwgayksXG4gICAgICAgIHZhbHVlOiBcIlwiICsgayxcbiAgICAgICAgaWNvbjogaWNvblxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgbGFiZWw6IGYubGFiZWwgfHwgayxcbiAgICAgICAgdmFsdWU6IGssXG4gICAgICAgIGljb246IGljb25cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIGlmIChpc19kZWVwKSB7XG4gICAgXy5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZiwgaykge1xuICAgICAgdmFyIHJfb2JqZWN0O1xuICAgICAgaWYgKGlzX3NraXBfaGlkZSAmJiBmLmhpZGRlbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoKGYudHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSAmJiBmLnJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKGYucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICByX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGYucmVmZXJlbmNlX3RvKTtcbiAgICAgICAgaWYgKHJfb2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGYyLCBrMikge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgICBsYWJlbDogKGYubGFiZWwgfHwgaykgKyBcIj0+XCIgKyAoZjIubGFiZWwgfHwgazIpLFxuICAgICAgICAgICAgICB2YWx1ZTogayArIFwiLlwiICsgazIsXG4gICAgICAgICAgICAgIGljb246IHJfb2JqZWN0ICE9IG51bGwgPyByX29iamVjdC5pY29uIDogdm9pZCAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChpc19yZWxhdGVkKSB7XG4gICAgcmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKTtcbiAgICBfLmVhY2gocmVsYXRlZE9iamVjdHMsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKF9yZWxhdGVkT2JqZWN0KSB7XG4gICAgICAgIHZhciByZWxhdGVkT2JqZWN0LCByZWxhdGVkT3B0aW9ucztcbiAgICAgICAgcmVsYXRlZE9wdGlvbnMgPSBDcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyhfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSk7XG4gICAgICAgIHJldHVybiBfLmVhY2gocmVsYXRlZE9wdGlvbnMsIGZ1bmN0aW9uKHJlbGF0ZWRPcHRpb24pIHtcbiAgICAgICAgICBpZiAoX3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXkgIT09IHJlbGF0ZWRPcHRpb24udmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgbGFiZWw6IChyZWxhdGVkT2JqZWN0LmxhYmVsIHx8IHJlbGF0ZWRPYmplY3QubmFtZSkgKyBcIj0+XCIgKyByZWxhdGVkT3B0aW9uLmxhYmVsLFxuICAgICAgICAgICAgICB2YWx1ZTogcmVsYXRlZE9iamVjdC5uYW1lICsgXCIuXCIgKyByZWxhdGVkT3B0aW9uLnZhbHVlLFxuICAgICAgICAgICAgICBpY29uOiByZWxhdGVkT2JqZWN0ICE9IG51bGwgPyByZWxhdGVkT2JqZWN0Lmljb24gOiB2b2lkIDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfVxuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEZpbHRlckZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBfb3B0aW9ucywgZmllbGRzLCBpY29uLCBwZXJtaXNzaW9uX2ZpZWxkcztcbiAgX29wdGlvbnMgPSBbXTtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfb3B0aW9ucztcbiAgfVxuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgcGVybWlzc2lvbl9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhvYmplY3RfbmFtZSk7XG4gIGljb24gPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDA7XG4gIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICBpZiAoIV8uaW5jbHVkZShbXCJncmlkXCIsIFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiLCBcImF2YXRhclwiLCBcImltYWdlXCIsIFwibWFya2Rvd25cIiwgXCJodG1sXCJdLCBmLnR5cGUpICYmICFmLmhpZGRlbikge1xuICAgICAgaWYgKCEvXFx3K1xcLi8udGVzdChrKSAmJiBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiBmLmxhYmVsIHx8IGssXG4gICAgICAgICAgdmFsdWU6IGssXG4gICAgICAgICAgaWNvbjogaWNvblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBfb3B0aW9ucywgZmllbGRzLCBpY29uLCBwZXJtaXNzaW9uX2ZpZWxkcztcbiAgX29wdGlvbnMgPSBbXTtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfb3B0aW9ucztcbiAgfVxuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgcGVybWlzc2lvbl9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhvYmplY3RfbmFtZSk7XG4gIGljb24gPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDA7XG4gIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICBpZiAoIV8uaW5jbHVkZShbXCJncmlkXCIsIFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKSkge1xuICAgICAgaWYgKCEvXFx3K1xcLi8udGVzdChrKSAmJiBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiBmLmxhYmVsIHx8IGssXG4gICAgICAgICAgdmFsdWU6IGssXG4gICAgICAgICAgaWNvbjogaWNvblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5cbi8qXG5maWx0ZXJzOiDopoHovazmjaLnmoRmaWx0ZXJzXG5maWVsZHM6IOWvueixoeWtl+autVxuZmlsdGVyX2ZpZWxkczog6buY6K6k6L+H5ruk5a2X5q6177yM5pSv5oyB5a2X56ym5Liy5pWw57uE5ZKM5a+56LGh5pWw57uE5Lik56eN5qC85byP77yM5aaCOlsnZmlsZWRfbmFtZTEnLCdmaWxlZF9uYW1lMiddLFt7ZmllbGQ6J2ZpbGVkX25hbWUxJyxyZXF1aXJlZDp0cnVlfV1cbuWkhOeQhumAu+i+kTog5oqKZmlsdGVyc+S4reWtmOWcqOS6jmZpbHRlcl9maWVsZHPnmoTov4fmu6TmnaHku7blop7liqDmr4/pobnnmoRpc19kZWZhdWx044CBaXNfcmVxdWlyZWTlsZ7mgKfvvIzkuI3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25a+55bqU55qE56e76Zmk5q+P6aG555qE55u45YWz5bGe5oCnXG7ov5Tlm57nu5Pmnpw6IOWkhOeQhuWQjueahGZpbHRlcnNcbiAqL1xuXG5DcmVhdG9yLmdldEZpbHRlcnNXaXRoRmlsdGVyRmllbGRzID0gZnVuY3Rpb24oZmlsdGVycywgZmllbGRzLCBmaWx0ZXJfZmllbGRzKSB7XG4gIGlmICghZmlsdGVycykge1xuICAgIGZpbHRlcnMgPSBbXTtcbiAgfVxuICBpZiAoIWZpbHRlcl9maWVsZHMpIHtcbiAgICBmaWx0ZXJfZmllbGRzID0gW107XG4gIH1cbiAgaWYgKGZpbHRlcl9maWVsZHMgIT0gbnVsbCA/IGZpbHRlcl9maWVsZHMubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgZmlsdGVyX2ZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uKG4pIHtcbiAgICAgIGlmIChfLmlzU3RyaW5nKG4pKSB7XG4gICAgICAgIG4gPSB7XG4gICAgICAgICAgZmllbGQ6IG4sXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoZmllbGRzW24uZmllbGRdICYmICFfLmZpbmRXaGVyZShmaWx0ZXJzLCB7XG4gICAgICAgIGZpZWxkOiBuLmZpZWxkXG4gICAgICB9KSkge1xuICAgICAgICByZXR1cm4gZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICBmaWVsZDogbi5maWVsZCxcbiAgICAgICAgICBpc19kZWZhdWx0OiB0cnVlLFxuICAgICAgICAgIGlzX3JlcXVpcmVkOiBuLnJlcXVpcmVkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbihmaWx0ZXJJdGVtKSB7XG4gICAgdmFyIG1hdGNoRmllbGQ7XG4gICAgbWF0Y2hGaWVsZCA9IGZpbHRlcl9maWVsZHMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbiA9PT0gZmlsdGVySXRlbS5maWVsZCB8fCBuLmZpZWxkID09PSBmaWx0ZXJJdGVtLmZpZWxkO1xuICAgIH0pO1xuICAgIGlmIChfLmlzU3RyaW5nKG1hdGNoRmllbGQpKSB7XG4gICAgICBtYXRjaEZpZWxkID0ge1xuICAgICAgICBmaWVsZDogbWF0Y2hGaWVsZCxcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAobWF0Y2hGaWVsZCkge1xuICAgICAgZmlsdGVySXRlbS5pc19kZWZhdWx0ID0gdHJ1ZTtcbiAgICAgIHJldHVybiBmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkID0gbWF0Y2hGaWVsZC5yZXF1aXJlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGZpbHRlckl0ZW0uaXNfZGVmYXVsdDtcbiAgICAgIHJldHVybiBkZWxldGUgZmlsdGVySXRlbS5pc19yZXF1aXJlZDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmlsdGVycztcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKSB7XG4gIHZhciBjb2xsZWN0aW9uLCByZWNvcmQsIHJlZiwgcmVmMSwgcmVmMjtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAoIXJlY29yZF9pZCkge1xuICAgIHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikgJiYgcmVjb3JkX2lkID09PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSkge1xuICAgICAgaWYgKChyZWYgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpKSAhPSBudWxsID8gcmVmLnJlY29yZCA6IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gKHJlZjEgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLnJlY29yZCkgIT0gbnVsbCA/IHJlZjIuZ2V0KCkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpO1xuICAgIH1cbiAgfVxuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKTtcbiAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICByZWNvcmQgPSBjb2xsZWN0aW9uLmZpbmRPbmUocmVjb3JkX2lkKTtcbiAgICByZXR1cm4gcmVjb3JkO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZE5hbWUgPSBmdW5jdGlvbihyZWNvcmQsIG9iamVjdF9uYW1lKSB7XG4gIHZhciBuYW1lX2ZpZWxkX2tleSwgcmVmO1xuICBpZiAoIXJlY29yZCkge1xuICAgIHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKCk7XG4gIH1cbiAgaWYgKHJlY29yZCkge1xuICAgIG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0X25hbWUgPT09IFwib3JnYW5pemF0aW9uc1wiID8gXCJuYW1lXCIgOiAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLk5BTUVfRklFTERfS0VZIDogdm9pZCAwO1xuICAgIGlmIChyZWNvcmQgJiYgbmFtZV9maWVsZF9rZXkpIHtcbiAgICAgIHJldHVybiByZWNvcmQubGFiZWwgfHwgcmVjb3JkW25hbWVfZmllbGRfa2V5XTtcbiAgICB9XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QXBwID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIHJlZiwgcmVmMTtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBhcHAgPSBDcmVhdG9yLkFwcHNbYXBwX2lkXTtcbiAgaWYgKChyZWYgPSBDcmVhdG9yLmRlcHMpICE9IG51bGwpIHtcbiAgICBpZiAoKHJlZjEgPSByZWYuYXBwKSAhPSBudWxsKSB7XG4gICAgICByZWYxLmRlcGVuZCgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXBwO1xufTtcblxuQ3JlYXRvci5nZXRBcHBEYXNoYm9hcmQgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgdmFyIGFwcCwgZGFzaGJvYXJkO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCkge1xuICAgIHJldHVybjtcbiAgfVxuICBkYXNoYm9hcmQgPSBudWxsO1xuICBfLmVhY2goQ3JlYXRvci5EYXNoYm9hcmRzLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB2LmFwcHMpICE9IG51bGwgPyByZWYuaW5kZXhPZihhcHAuX2lkKSA6IHZvaWQgMCkgPiAtMSkge1xuICAgICAgcmV0dXJuIGRhc2hib2FyZCA9IHY7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGRhc2hib2FyZDtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkQ29tcG9uZW50ID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHA7XG4gIGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZCk7XG4gIGlmICghYXBwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJldHVybiBSZWFjdFN0ZWVkb3MucGx1Z2luQ29tcG9uZW50U2VsZWN0b3IoUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCksIFwiRGFzaGJvYXJkXCIsIGFwcC5faWQpO1xufTtcblxuQ3JlYXRvci5nZXRBcHBPYmplY3ROYW1lcyA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwLCBhcHBPYmplY3RzLCBpc01vYmlsZSwgb2JqZWN0cztcbiAgYXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKTtcbiAgaWYgKCFhcHApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKCk7XG4gIGFwcE9iamVjdHMgPSBpc01vYmlsZSA/IGFwcC5tb2JpbGVfb2JqZWN0cyA6IGFwcC5vYmplY3RzO1xuICBvYmplY3RzID0gW107XG4gIGlmIChhcHApIHtcbiAgICBfLmVhY2goYXBwT2JqZWN0cywgZnVuY3Rpb24odikge1xuICAgICAgdmFyIG9iajtcbiAgICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KHYpO1xuICAgICAgaWYgKG9iaiAhPSBudWxsID8gb2JqLnBlcm1pc3Npb25zLmdldCgpLmFsbG93UmVhZCA6IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0cy5wdXNoKHYpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3RzO1xufTtcblxuQ3JlYXRvci5nZXRBcHBNZW51ID0gZnVuY3Rpb24oYXBwX2lkLCBtZW51X2lkKSB7XG4gIHZhciBtZW51cztcbiAgbWVudXMgPSBDcmVhdG9yLmdldEFwcE1lbnVzKGFwcF9pZCk7XG4gIHJldHVybiBtZW51cyAmJiBtZW51cy5maW5kKGZ1bmN0aW9uKG1lbnUpIHtcbiAgICByZXR1cm4gbWVudS5pZCA9PT0gbWVudV9pZDtcbiAgfSk7XG59O1xuXG5DcmVhdG9yLmdldEFwcE1lbnVVcmxGb3JJbnRlcm5ldCA9IGZ1bmN0aW9uKG1lbnUpIHtcbiAgdmFyIGhhc1F1ZXJ5U3ltYm9sLCBsaW5rU3RyLCBwYXJhbXMsIHNkaywgdXJsO1xuICBwYXJhbXMgPSB7fTtcbiAgcGFyYW1zW1wiWC1TcGFjZS1JZFwiXSA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICBwYXJhbXNbXCJYLVVzZXItSWRcIl0gPSBTdGVlZG9zLnVzZXJJZCgpO1xuICBwYXJhbXNbXCJYLUNvbXBhbnktSWRzXCJdID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpO1xuICBzZGsgPSByZXF1aXJlKFwiQHN0ZWVkb3MtdWkvYnVpbGRlci1jb21tdW5pdHkvZGlzdC9idWlsZGVyLWNvbW11bml0eS5yZWFjdC5qc1wiKTtcbiAgdXJsID0gbWVudS5wYXRoO1xuICBpZiAoc2RrICYmIHNkay5VdGlscyAmJiBzZGsuVXRpbHMuaXNFeHByZXNzaW9uKHVybCkpIHtcbiAgICB1cmwgPSBzZGsuVXRpbHMucGFyc2VTaW5nbGVFeHByZXNzaW9uKHVybCwgbWVudSwgXCIjXCIsIENyZWF0b3IuVVNFUl9DT05URVhUKTtcbiAgfVxuICBoYXNRdWVyeVN5bWJvbCA9IC8oXFwjLitcXD8pfChcXD9bXiNdKiQpL2cudGVzdCh1cmwpO1xuICBsaW5rU3RyID0gaGFzUXVlcnlTeW1ib2wgPyBcIiZcIiA6IFwiP1wiO1xuICByZXR1cm4gXCJcIiArIHVybCArIGxpbmtTdHIgKyAoJC5wYXJhbShwYXJhbXMpKTtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwTWVudVVybCA9IGZ1bmN0aW9uKG1lbnUpIHtcbiAgdmFyIHVybDtcbiAgdXJsID0gbWVudS5wYXRoO1xuICBpZiAobWVudS50eXBlID09PSBcInVybFwiKSB7XG4gICAgaWYgKG1lbnUudGFyZ2V0KSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRBcHBNZW51VXJsRm9ySW50ZXJuZXQobWVudSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIi9hcHAvLS90YWJfaWZyYW1lL1wiICsgbWVudS5pZDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG1lbnUucGF0aDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRBcHBNZW51cyA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwLCBhcHBNZW51cywgY3VyZW50QXBwTWVudXM7XG4gIGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZCk7XG4gIGlmICghYXBwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGFwcE1lbnVzID0gU2Vzc2lvbi5nZXQoXCJhcHBfbWVudXNcIik7XG4gIGlmICghYXBwTWVudXMpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgY3VyZW50QXBwTWVudXMgPSBhcHBNZW51cy5maW5kKGZ1bmN0aW9uKG1lbnVJdGVtKSB7XG4gICAgcmV0dXJuIG1lbnVJdGVtLmlkID09PSBhcHAuX2lkO1xuICB9KTtcbiAgaWYgKGN1cmVudEFwcE1lbnVzKSB7XG4gICAgcmV0dXJuIGN1cmVudEFwcE1lbnVzLmNoaWxkcmVuO1xuICB9XG59O1xuXG5DcmVhdG9yLmxvYWRBcHBzTWVudXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRhdGEsIGlzTW9iaWxlLCBvcHRpb25zO1xuICBpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKTtcbiAgZGF0YSA9IHt9O1xuICBpZiAoaXNNb2JpbGUpIHtcbiAgICBkYXRhLm1vYmlsZSA9IGlzTW9iaWxlO1xuICB9XG4gIG9wdGlvbnMgPSB7XG4gICAgdHlwZTogJ2dldCcsXG4gICAgZGF0YTogZGF0YSxcbiAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gU2Vzc2lvbi5zZXQoXCJhcHBfbWVudXNcIiwgZGF0YSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gU3RlZWRvcy5hdXRoUmVxdWVzdChcIi9zZXJ2aWNlL2FwaS9hcHBzL21lbnVzXCIsIG9wdGlvbnMpO1xufTtcblxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwcyA9IGZ1bmN0aW9uKGluY2x1ZGVBZG1pbikge1xuICB2YXIgY2hhbmdlQXBwO1xuICBjaGFuZ2VBcHAgPSBDcmVhdG9yLl9zdWJBcHAuZ2V0KCk7XG4gIFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLmVudGl0aWVzLmFwcHMgPSBPYmplY3QuYXNzaWduKHt9LCBSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKS5lbnRpdGllcy5hcHBzLCB7XG4gICAgYXBwczogY2hhbmdlQXBwXG4gIH0pO1xuICByZXR1cm4gUmVhY3RTdGVlZG9zLnZpc2libGVBcHBzU2VsZWN0b3IoUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCksIGluY2x1ZGVBZG1pbik7XG59O1xuXG5DcmVhdG9yLmdldFZpc2libGVBcHBzT2JqZWN0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXBwcywgb2JqZWN0cywgdmlzaWJsZU9iamVjdE5hbWVzO1xuICBhcHBzID0gQ3JlYXRvci5nZXRWaXNpYmxlQXBwcygpO1xuICB2aXNpYmxlT2JqZWN0TmFtZXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhhcHBzLCAnb2JqZWN0cycpKTtcbiAgb2JqZWN0cyA9IF8uZmlsdGVyKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKHZpc2libGVPYmplY3ROYW1lcy5pbmRleE9mKG9iai5uYW1lKSA8IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgb2JqZWN0cyA9IG9iamVjdHMuc29ydChDcmVhdG9yLnNvcnRpbmdNZXRob2QuYmluZCh7XG4gICAga2V5OiBcImxhYmVsXCJcbiAgfSkpO1xuICBvYmplY3RzID0gXy5wbHVjayhvYmplY3RzLCAnbmFtZScpO1xuICByZXR1cm4gXy51bmlxKG9iamVjdHMpO1xufTtcblxuQ3JlYXRvci5nZXRBcHBzT2JqZWN0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgb2JqZWN0cywgdGVtcE9iamVjdHM7XG4gIG9iamVjdHMgPSBbXTtcbiAgdGVtcE9iamVjdHMgPSBbXTtcbiAgXy5mb3JFYWNoKENyZWF0b3IuQXBwcywgZnVuY3Rpb24oYXBwKSB7XG4gICAgdGVtcE9iamVjdHMgPSBfLmZpbHRlcihhcHAub2JqZWN0cywgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gIW9iai5oaWRkZW47XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iamVjdHMgPSBvYmplY3RzLmNvbmNhdCh0ZW1wT2JqZWN0cyk7XG4gIH0pO1xuICByZXR1cm4gXy51bmlxKG9iamVjdHMpO1xufTtcblxuQ3JlYXRvci52YWxpZGF0ZUZpbHRlcnMgPSBmdW5jdGlvbihmaWx0ZXJzLCBsb2dpYykge1xuICB2YXIgZSwgZXJyb3JNc2csIGZpbHRlcl9pdGVtcywgZmlsdGVyX2xlbmd0aCwgZmxhZywgaW5kZXgsIHdvcmQ7XG4gIGZpbHRlcl9pdGVtcyA9IF8ubWFwKGZpbHRlcnMsIGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChfLmlzRW1wdHkob2JqKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgfSk7XG4gIGZpbHRlcl9pdGVtcyA9IF8uY29tcGFjdChmaWx0ZXJfaXRlbXMpO1xuICBlcnJvck1zZyA9IFwiXCI7XG4gIGZpbHRlcl9sZW5ndGggPSBmaWx0ZXJfaXRlbXMubGVuZ3RoO1xuICBpZiAobG9naWMpIHtcbiAgICBsb2dpYyA9IGxvZ2ljLnJlcGxhY2UoL1xcbi9nLCBcIlwiKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgICBpZiAoL1suX1xcLSErXSsvaWcudGVzdChsb2dpYykpIHtcbiAgICAgIGVycm9yTXNnID0gXCLlkKvmnInnibnmrorlrZfnrKbjgIJcIjtcbiAgICB9XG4gICAgaWYgKCFlcnJvck1zZykge1xuICAgICAgaW5kZXggPSBsb2dpYy5tYXRjaCgvXFxkKy9pZyk7XG4gICAgICBpZiAoIWluZGV4KSB7XG4gICAgICAgIGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZGV4LmZvckVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgIGlmIChpIDwgMSB8fCBpID4gZmlsdGVyX2xlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInmnaHku7blvJXnlKjkuobmnKrlrprkuYnnmoTnrZvpgInlmajvvJpcIiArIGkgKyBcIuOAglwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZsYWcgPSAxO1xuICAgICAgICB3aGlsZSAoZmxhZyA8PSBmaWx0ZXJfbGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFpbmRleC5pbmNsdWRlcyhcIlwiICsgZmxhZykpIHtcbiAgICAgICAgICAgIGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmxhZysrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIHdvcmQgPSBsb2dpYy5tYXRjaCgvW2EtekEtWl0rL2lnKTtcbiAgICAgIGlmICh3b3JkKSB7XG4gICAgICAgIHdvcmQuZm9yRWFjaChmdW5jdGlvbih3KSB7XG4gICAgICAgICAgaWYgKCEvXihhbmR8b3IpJC9pZy50ZXN0KHcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JNc2cgPSBcIuajgOafpeaCqOeahOmrmOe6p+etm+mAieadoeS7tuS4reeahOaLvOWGmeOAglwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIENyZWF0b3JbXCJldmFsXCJdKGxvZ2ljLnJlcGxhY2UoL2FuZC9pZywgXCImJlwiKS5yZXBsYWNlKC9vci9pZywgXCJ8fFwiKSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajkuK3lkKvmnInnibnmrorlrZfnrKZcIjtcbiAgICAgIH1cbiAgICAgIGlmICgvKEFORClbXigpXSsoT1IpL2lnLnRlc3QobG9naWMpIHx8IC8oT1IpW14oKV0rKEFORCkvaWcudGVzdChsb2dpYykpIHtcbiAgICAgICAgZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOW/hemhu+WcqOi/nue7reaAp+eahCBBTkQg5ZKMIE9SIOihqOi+vuW8j+WJjeWQjuS9v+eUqOaLrOWPt+OAglwiO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoZXJyb3JNc2cpIHtcbiAgICBjb25zb2xlLmxvZyhcImVycm9yXCIsIGVycm9yTXNnKTtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB0b2FzdHIuZXJyb3IoZXJyb3JNc2cpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cblxuLypcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9Nb25nbyA9IGZ1bmN0aW9uKGZpbHRlcnMsIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGVjdG9yO1xuICBpZiAoIShmaWx0ZXJzICE9IG51bGwgPyBmaWx0ZXJzLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCEoZmlsdGVyc1swXSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgIGZpbHRlcnMgPSBfLm1hcChmaWx0ZXJzLCBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBbb2JqLmZpZWxkLCBvYmoub3BlcmF0aW9uLCBvYmoudmFsdWVdO1xuICAgIH0pO1xuICB9XG4gIHNlbGVjdG9yID0gW107XG4gIF8uZWFjaChmaWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICB2YXIgZmllbGQsIG9wdGlvbiwgcmVnLCBzdWJfc2VsZWN0b3IsIHZhbHVlO1xuICAgIGZpZWxkID0gZmlsdGVyWzBdO1xuICAgIG9wdGlvbiA9IGZpbHRlclsxXTtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBudWxsLCBvcHRpb25zKTtcbiAgICB9XG4gICAgc3ViX3NlbGVjdG9yID0ge307XG4gICAgc3ViX3NlbGVjdG9yW2ZpZWxkXSA9IHt9O1xuICAgIGlmIChvcHRpb24gPT09IFwiPVwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGVxXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD5cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRuZVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIj5cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndFwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIj49XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RlXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPFwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGx0XCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD1cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdGVcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJzdGFydHN3aXRoXCIpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeXCIgKyB2YWx1ZSwgXCJpXCIpO1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJjb250YWluc1wiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKHZhbHVlLCBcImlcIik7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIm5vdGNvbnRhaW5zXCIpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeKCg/IVwiICsgdmFsdWUgKyBcIikuKSokXCIsIFwiaVwiKTtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWc7XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3Rvci5wdXNoKHN1Yl9zZWxlY3Rvcik7XG4gIH0pO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5DcmVhdG9yLmlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiA9IGZ1bmN0aW9uKG9wZXJhdGlvbikge1xuICB2YXIgcmVmO1xuICByZXR1cm4gb3BlcmF0aW9uID09PSBcImJldHdlZW5cIiB8fCAhISgocmVmID0gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXModHJ1ZSkpICE9IG51bGwgPyByZWZbb3BlcmF0aW9uXSA6IHZvaWQgMCk7XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuXHRleHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9EZXYgPSBmdW5jdGlvbihmaWx0ZXJzLCBvYmplY3RfbmFtZSwgb3B0aW9ucykge1xuICB2YXIgbG9naWNUZW1wRmlsdGVycywgc2VsZWN0b3IsIHN0ZWVkb3NGaWx0ZXJzO1xuICBzdGVlZG9zRmlsdGVycyA9IHJlcXVpcmUoXCJAc3RlZWRvcy9maWx0ZXJzXCIpO1xuICBpZiAoIWZpbHRlcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLmlzX2xvZ2ljX29yIDogdm9pZCAwKSB7XG4gICAgbG9naWNUZW1wRmlsdGVycyA9IFtdO1xuICAgIGZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbihuKSB7XG4gICAgICBsb2dpY1RlbXBGaWx0ZXJzLnB1c2gobik7XG4gICAgICByZXR1cm4gbG9naWNUZW1wRmlsdGVycy5wdXNoKFwib3JcIik7XG4gICAgfSk7XG4gICAgbG9naWNUZW1wRmlsdGVycy5wb3AoKTtcbiAgICBmaWx0ZXJzID0gbG9naWNUZW1wRmlsdGVycztcbiAgfVxuICBzZWxlY3RvciA9IHN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb0RldihmaWx0ZXJzLCBDcmVhdG9yLlVTRVJfQ09OVEVYVCk7XG4gIHJldHVybiBzZWxlY3Rvcjtcbn07XG5cblxuLypcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRMb2dpY0ZpbHRlcnNUb0RldiA9IGZ1bmN0aW9uKGZpbHRlcnMsIGZpbHRlcl9sb2dpYywgb3B0aW9ucykge1xuICB2YXIgZm9ybWF0X2xvZ2ljO1xuICBmb3JtYXRfbG9naWMgPSBmaWx0ZXJfbG9naWMucmVwbGFjZSgvXFwoXFxzKy9pZywgXCIoXCIpLnJlcGxhY2UoL1xccytcXCkvaWcsIFwiKVwiKS5yZXBsYWNlKC9cXCgvZywgXCJbXCIpLnJlcGxhY2UoL1xcKS9nLCBcIl1cIikucmVwbGFjZSgvXFxzKy9nLCBcIixcIikucmVwbGFjZSgvKGFuZHxvcikvaWcsIFwiJyQxJ1wiKTtcbiAgZm9ybWF0X2xvZ2ljID0gZm9ybWF0X2xvZ2ljLnJlcGxhY2UoLyhcXGQpKy9pZywgZnVuY3Rpb24oeCkge1xuICAgIHZhciBfZiwgZmllbGQsIG9wdGlvbiwgc3ViX3NlbGVjdG9yLCB2YWx1ZTtcbiAgICBfZiA9IGZpbHRlcnNbeCAtIDFdO1xuICAgIGZpZWxkID0gX2YuZmllbGQ7XG4gICAgb3B0aW9uID0gX2Yub3BlcmF0aW9uO1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlLCBudWxsLCBvcHRpb25zKTtcbiAgICB9XG4gICAgc3ViX3NlbGVjdG9yID0gW107XG4gICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkgPT09IHRydWUpIHtcbiAgICAgIGlmIChvcHRpb24gPT09IFwiPVwiKSB7XG4gICAgICAgIF8uZWFjaCh2YWx1ZSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBzdWJfc2VsZWN0b3IucHVzaChbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD5cIikge1xuICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4gc3ViX3NlbGVjdG9yLnB1c2goW2ZpZWxkLCBvcHRpb24sIHZdLCBcImFuZFwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4gc3ViX3NlbGVjdG9yLnB1c2goW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09PSBcImFuZFwiIHx8IHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT09IFwib3JcIikge1xuICAgICAgICBzdWJfc2VsZWN0b3IucG9wKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Yl9zZWxlY3RvciA9IFtmaWVsZCwgb3B0aW9uLCB2YWx1ZV07XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwic3ViX3NlbGVjdG9yXCIsIHN1Yl9zZWxlY3Rvcik7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN1Yl9zZWxlY3Rvcik7XG4gIH0pO1xuICBmb3JtYXRfbG9naWMgPSBcIltcIiArIGZvcm1hdF9sb2dpYyArIFwiXVwiO1xuICByZXR1cm4gQ3JlYXRvcltcImV2YWxcIl0oZm9ybWF0X2xvZ2ljKTtcbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBfb2JqZWN0LCBwZXJtaXNzaW9ucywgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHJlbGF0ZWRfb2JqZWN0cywgdW5yZWxhdGVkX29iamVjdHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBbXTtcbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFfb2JqZWN0KSB7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICB9XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoX29iamVjdC5fY29sbGVjdGlvbl9uYW1lKTtcbiAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cywgXCJvYmplY3RfbmFtZVwiKTtcbiAgaWYgKChyZWxhdGVkX29iamVjdF9uYW1lcyAhPSBudWxsID8gcmVsYXRlZF9vYmplY3RfbmFtZXMubGVuZ3RoIDogdm9pZCAwKSA9PT0gMCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgfVxuICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlKHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0cyk7XG4gIHJldHVybiBfLmZpbHRlcihyZWxhdGVkX29iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0KSB7XG4gICAgdmFyIGFsbG93UmVhZCwgaXNBY3RpdmUsIHJlZiwgcmVsYXRlZF9vYmplY3RfbmFtZTtcbiAgICByZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3Qub2JqZWN0X25hbWU7XG4gICAgaXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTE7XG4gICAgYWxsb3dSZWFkID0gKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5hbGxvd1JlYWQgOiB2b2lkIDA7XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIGFsbG93UmVhZCA9IGFsbG93UmVhZCAmJiBwZXJtaXNzaW9ucy5hbGxvd1JlYWRGaWxlcztcbiAgICB9XG4gICAgcmV0dXJuIGlzQWN0aXZlICYmIGFsbG93UmVhZDtcbiAgfSk7XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3ROYW1lcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIHJlbGF0ZWRfb2JqZWN0cztcbiAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgcmV0dXJuIF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLCBcIm9iamVjdF9uYW1lXCIpO1xufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0TGlzdEFjdGlvbnMgPSBmdW5jdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBhY3Rpb25zO1xuICBhY3Rpb25zID0gQ3JlYXRvci5nZXRBY3Rpb25zKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICBhY3Rpb25zID0gXy5maWx0ZXIoYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgaWYgKGFjdGlvbi5uYW1lID09PSBcInN0YW5kYXJkX2ZvbGxvd1wiKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChhY3Rpb24ubmFtZSA9PT0gXCJzdGFuZGFyZF9xdWVyeVwiKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChhY3Rpb24ub24gPT09IFwibGlzdFwiKSB7XG4gICAgICBpZiAodHlwZW9mIGFjdGlvbi52aXNpYmxlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi52aXNpYmxlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYWN0aW9uLnZpc2libGU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYWN0aW9ucztcbn07XG5cbkNyZWF0b3IuZ2V0QWN0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGFjdGlvbnMsIGRpc2FibGVkX2FjdGlvbnMsIG9iaiwgcGVybWlzc2lvbnMsIHJlZiwgcmVmMTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgZGlzYWJsZWRfYWN0aW9ucyA9IHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnM7XG4gIGFjdGlvbnMgPSBfLnNvcnRCeShfLnZhbHVlcyhvYmouYWN0aW9ucyksICdzb3J0Jyk7XG4gIGlmIChfLmhhcyhvYmosICdhbGxvd19jdXN0b21BY3Rpb25zJykpIHtcbiAgICBhY3Rpb25zID0gXy5maWx0ZXIoYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgICByZXR1cm4gXy5pbmNsdWRlKG9iai5hbGxvd19jdXN0b21BY3Rpb25zLCBhY3Rpb24ubmFtZSkgfHwgXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLmdldE9iamVjdCgnYmFzZScpLmFjdGlvbnMpIHx8IHt9LCBhY3Rpb24ubmFtZSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKF8uaGFzKG9iaiwgJ2V4Y2x1ZGVfYWN0aW9ucycpKSB7XG4gICAgYWN0aW9ucyA9IF8uZmlsdGVyKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgICAgcmV0dXJuICFfLmluY2x1ZGUob2JqLmV4Y2x1ZGVfYWN0aW9ucywgYWN0aW9uLm5hbWUpO1xuICAgIH0pO1xuICB9XG4gIF8uZWFjaChhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcInJlY29yZFwiLCBcInJlY29yZF9vbmx5XCJdLmluZGV4T2YoYWN0aW9uLm9uKSA+IC0xICYmIGFjdGlvbi5uYW1lICE9PSAnc3RhbmRhcmRfZWRpdCcpIHtcbiAgICAgIGlmIChhY3Rpb24ub24gPT09IFwicmVjb3JkX29ubHlcIikge1xuICAgICAgICByZXR1cm4gYWN0aW9uLm9uID0gJ3JlY29yZF9vbmx5X21vcmUnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi5vbiA9ICdyZWNvcmRfbW9yZSc7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJjbXNfZmlsZXNcIiwgXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXS5pbmRleE9mKG9iamVjdF9uYW1lKSA+IC0xKSB7XG4gICAgaWYgKChyZWYgPSBhY3Rpb25zLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4ubmFtZSA9PT0gXCJzdGFuZGFyZF9lZGl0XCI7XG4gICAgfSkpICE9IG51bGwpIHtcbiAgICAgIHJlZi5vbiA9IFwicmVjb3JkX21vcmVcIjtcbiAgICB9XG4gICAgaWYgKChyZWYxID0gYWN0aW9ucy5maW5kKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLm5hbWUgPT09IFwiZG93bmxvYWRcIjtcbiAgICB9KSkgIT0gbnVsbCkge1xuICAgICAgcmVmMS5vbiA9IFwicmVjb3JkXCI7XG4gICAgfVxuICB9XG4gIGFjdGlvbnMgPSBfLmZpbHRlcihhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICByZXR1cm4gXy5pbmRleE9mKGRpc2FibGVkX2FjdGlvbnMsIGFjdGlvbi5uYW1lKSA8IDA7XG4gIH0pO1xuICByZXR1cm4gYWN0aW9ucztcbn07XG5cbi/ov5Tlm57lvZPliY3nlKjmiLfmnInmnYPpmZDorr/pl67nmoTmiYDmnIlsaXN0X3ZpZXfvvIzljIXmi6zliIbkuqvnmoTvvIznlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTvvIjpmaTpnZ5vd25lcuWPmOS6hu+8ie+8jOS7peWPium7mOiupOeahOWFtuS7luinhuWbvuazqOaEj0NyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mmK/kuI3kvJrmnInnlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTop4blm77nmoTvvIzmiYDku6VDcmVhdG9yLmdldFBlcm1pc3Npb25z5Ye95pWw5Lit5ou/5Yiw55qE57uT5p6c5LiN5YWo77yM5bm25LiN5piv5b2T5YmN55So5oi36IO955yL5Yiw5omA5pyJ6KeG5Zu+LztcblxuQ3JlYXRvci5nZXRMaXN0Vmlld3MgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBkaXNhYmxlZF9saXN0X3ZpZXdzLCBpc01vYmlsZSwgbGlzdFZpZXdzLCBsaXN0X3ZpZXdzLCBvYmplY3QsIHJlZjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZGlzYWJsZWRfbGlzdF92aWV3cyA9ICgocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5kaXNhYmxlZF9saXN0X3ZpZXdzIDogdm9pZCAwKSB8fCBbXTtcbiAgbGlzdF92aWV3cyA9IFtdO1xuICBpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKTtcbiAgXy5lYWNoKG9iamVjdC5saXN0X3ZpZXdzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICByZXR1cm4gaXRlbS5uYW1lID0gaXRlbV9uYW1lO1xuICB9KTtcbiAgbGlzdFZpZXdzID0gXy5zb3J0QnkoXy52YWx1ZXMob2JqZWN0Lmxpc3Rfdmlld3MpLCAnc29ydF9ubycpO1xuICBfLmVhY2gobGlzdFZpZXdzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGlzRGlzYWJsZWQ7XG4gICAgaWYgKGlzTW9iaWxlICYmIGl0ZW0udHlwZSA9PT0gXCJjYWxlbmRhclwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpdGVtLm5hbWUgIT09IFwiZGVmYXVsdFwiKSB7XG4gICAgICBpc0Rpc2FibGVkID0gXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW0ubmFtZSkgPiAtMSB8fCAoaXRlbS5faWQgJiYgXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW0uX2lkKSA+IC0xKTtcbiAgICAgIGlmICghaXNEaXNhYmxlZCB8fCBpdGVtLm93bmVyID09PSB1c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlld3MucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbGlzdF92aWV3cztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgZmllbGRzTmFtZSwgcmVmLCB1bnJlYWRhYmxlX2ZpZWxkcztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBmaWVsZHNOYW1lID0gQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lKG9iamVjdF9uYW1lKTtcbiAgdW5yZWFkYWJsZV9maWVsZHMgPSAocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi51bnJlYWRhYmxlX2ZpZWxkcyA6IHZvaWQgMDtcbiAgcmV0dXJuIF8uZGlmZmVyZW5jZShmaWVsZHNOYW1lLCB1bnJlYWRhYmxlX2ZpZWxkcyk7XG59O1xuXG5DcmVhdG9yLmlzbG9hZGluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkLmdldCgpO1xufTtcblxuQ3JlYXRvci5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpO1xufTtcblxuQ3JlYXRvci5nZXREaXNhYmxlZEZpZWxkcyA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0uZGlzYWJsZWQgJiYgIWZpZWxkLmF1dG9mb3JtLm9taXQgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldEhpZGRlbkZpZWxkcyA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0udHlwZSA9PT0gXCJoaWRkZW5cIiAmJiAhZmllbGQuYXV0b2Zvcm0ub21pdCAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aE5vR3JvdXAgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuICghZmllbGQuYXV0b2Zvcm0gfHwgIWZpZWxkLmF1dG9mb3JtLmdyb3VwIHx8IGZpZWxkLmF1dG9mb3JtLmdyb3VwID09PSBcIi1cIikgJiYgKCFmaWVsZC5hdXRvZm9ybSB8fCBmaWVsZC5hdXRvZm9ybS50eXBlICE9PSBcImhpZGRlblwiKSAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0U29ydGVkRmllbGRHcm91cE5hbWVzID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBuYW1lcztcbiAgbmFtZXMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLmdyb3VwICE9PSBcIi1cIiAmJiBmaWVsZC5hdXRvZm9ybS5ncm91cDtcbiAgfSk7XG4gIG5hbWVzID0gXy5jb21wYWN0KG5hbWVzKTtcbiAgbmFtZXMgPSBfLnVuaXF1ZShuYW1lcyk7XG4gIHJldHVybiBuYW1lcztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzRm9yR3JvdXAgPSBmdW5jdGlvbihzY2hlbWEsIGdyb3VwTmFtZSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT09IGdyb3VwTmFtZSAmJiBmaWVsZC5hdXRvZm9ybS50eXBlICE9PSBcImhpZGRlblwiICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNXaXRob3V0T21pdCA9IGZ1bmN0aW9uKHNjaGVtYSwga2V5cykge1xuICBrZXlzID0gXy5tYXAoa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIGZpZWxkLCByZWY7XG4gICAgZmllbGQgPSBfLnBpY2soc2NoZW1hLCBrZXkpO1xuICAgIGlmICgocmVmID0gZmllbGRba2V5XS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi5vbWl0IDogdm9pZCAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICB9KTtcbiAga2V5cyA9IF8uY29tcGFjdChrZXlzKTtcbiAgcmV0dXJuIGtleXM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc0luRmlyc3RMZXZlbCA9IGZ1bmN0aW9uKGZpcnN0TGV2ZWxLZXlzLCBrZXlzKSB7XG4gIGtleXMgPSBfLm1hcChrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoXy5pbmRleE9mKGZpcnN0TGV2ZWxLZXlzLCBrZXkpID4gLTEpIHtcbiAgICAgIHJldHVybiBrZXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuICBrZXlzID0gXy5jb21wYWN0KGtleXMpO1xuICByZXR1cm4ga2V5cztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzRm9yUmVvcmRlciA9IGZ1bmN0aW9uKHNjaGVtYSwga2V5cywgaXNTaW5nbGUpIHtcbiAgdmFyIF9rZXlzLCBjaGlsZEtleXMsIGZpZWxkcywgaSwgaXNfd2lkZV8xLCBpc193aWRlXzIsIHNjXzEsIHNjXzI7XG4gIGZpZWxkcyA9IFtdO1xuICBpID0gMDtcbiAgX2tleXMgPSBfLmZpbHRlcihrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gIWtleS5lbmRzV2l0aCgnX2VuZExpbmUnKTtcbiAgfSk7XG4gIHdoaWxlIChpIDwgX2tleXMubGVuZ3RoKSB7XG4gICAgc2NfMSA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2ldKTtcbiAgICBzY18yID0gXy5waWNrKHNjaGVtYSwgX2tleXNbaSArIDFdKTtcbiAgICBpc193aWRlXzEgPSBmYWxzZTtcbiAgICBpc193aWRlXzIgPSBmYWxzZTtcbiAgICBfLmVhY2goc2NfMSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciByZWYsIHJlZjE7XG4gICAgICBpZiAoKChyZWYgPSB2YWx1ZS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi5pc193aWRlIDogdm9pZCAwKSB8fCAoKHJlZjEgPSB2YWx1ZS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjEudHlwZSA6IHZvaWQgMCkgPT09IFwidGFibGVcIikge1xuICAgICAgICByZXR1cm4gaXNfd2lkZV8xID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBfLmVhY2goc2NfMiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciByZWYsIHJlZjE7XG4gICAgICBpZiAoKChyZWYgPSB2YWx1ZS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi5pc193aWRlIDogdm9pZCAwKSB8fCAoKHJlZjEgPSB2YWx1ZS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjEudHlwZSA6IHZvaWQgMCkgPT09IFwidGFibGVcIikge1xuICAgICAgICByZXR1cm4gaXNfd2lkZV8yID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICBpc193aWRlXzEgPSB0cnVlO1xuICAgICAgaXNfd2lkZV8yID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGlzU2luZ2xlKSB7XG4gICAgICBmaWVsZHMucHVzaChfa2V5cy5zbGljZShpLCBpICsgMSkpO1xuICAgICAgaSArPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNfd2lkZV8xKSB7XG4gICAgICAgIGZpZWxkcy5wdXNoKF9rZXlzLnNsaWNlKGksIGkgKyAxKSk7XG4gICAgICAgIGkgKz0gMTtcbiAgICAgIH0gZWxzZSBpZiAoIWlzX3dpZGVfMSAmJiBpc193aWRlXzIpIHtcbiAgICAgICAgY2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSArIDEpO1xuICAgICAgICBjaGlsZEtleXMucHVzaCh2b2lkIDApO1xuICAgICAgICBmaWVsZHMucHVzaChjaGlsZEtleXMpO1xuICAgICAgICBpICs9IDE7XG4gICAgICB9IGVsc2UgaWYgKCFpc193aWRlXzEgJiYgIWlzX3dpZGVfMikge1xuICAgICAgICBjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpICsgMSk7XG4gICAgICAgIGlmIChfa2V5c1tpICsgMV0pIHtcbiAgICAgICAgICBjaGlsZEtleXMucHVzaChfa2V5c1tpICsgMV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNoaWxkS2V5cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIH1cbiAgICAgICAgZmllbGRzLnB1c2goY2hpbGRLZXlzKTtcbiAgICAgICAgaSArPSAyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5pc0ZpbHRlclZhbHVlRW1wdHkgPSBmdW5jdGlvbih2KSB7XG4gIHJldHVybiB0eXBlb2YgdiA9PT0gXCJ1bmRlZmluZWRcIiB8fCB2ID09PSBudWxsIHx8IE51bWJlci5pc05hTih2KSB8fCB2Lmxlbmd0aCA9PT0gMDtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGREYXRhVHlwZSA9IGZ1bmN0aW9uKG9iamVjdEZpZWxkcywga2V5KSB7XG4gIHZhciByZWYsIHJlc3VsdDtcbiAgaWYgKG9iamVjdEZpZWxkcyAmJiBrZXkpIHtcbiAgICByZXN1bHQgPSAocmVmID0gb2JqZWN0RmllbGRzW2tleV0pICE9IG51bGwgPyByZWYudHlwZSA6IHZvaWQgMDtcbiAgICBpZiAoW1wiZm9ybXVsYVwiLCBcInN1bW1hcnlcIl0uaW5kZXhPZihyZXN1bHQpID4gLTEpIHtcbiAgICAgIHJlc3VsdCA9IG9iamVjdEZpZWxkc1trZXldLmRhdGFfdHlwZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXCJ0ZXh0XCI7XG4gIH1cbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ3JlYXRvci5nZXRBbGxSZWxhdGVkT2JqZWN0cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICAgIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW107XG4gICAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICAgIHJldHVybiBfLmVhY2gocmVsYXRlZF9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgICAgaWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT09IG9iamVjdF9uYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzLnB1c2gocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZW5hYmxlX2ZpbGVzKSB7XG4gICAgICByZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoKFwiY21zX2ZpbGVzXCIpO1xuICAgIH1cbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXM7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5mb3JtYXRJbmRleCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIGluZGV4TmFtZSwgaXNkb2N1bWVudERCLCBvYmplY3QsIHJlZiwgcmVmMSwgcmVmMjtcbiAgICBvYmplY3QgPSB7XG4gICAgICBiYWNrZ3JvdW5kOiB0cnVlXG4gICAgfTtcbiAgICBpc2RvY3VtZW50REIgPSAoKHJlZiA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWYxID0gcmVmLmRhdGFzb3VyY2VzKSAhPSBudWxsID8gKHJlZjIgPSByZWYxW1wiZGVmYXVsdFwiXSkgIT0gbnVsbCA/IHJlZjIuZG9jdW1lbnREQiA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMCkgfHwgZmFsc2U7XG4gICAgaWYgKGlzZG9jdW1lbnREQikge1xuICAgICAgaWYgKGFycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgaW5kZXhOYW1lID0gYXJyYXkuam9pbihcIi5cIik7XG4gICAgICAgIG9iamVjdC5uYW1lID0gaW5kZXhOYW1lO1xuICAgICAgICBpZiAoaW5kZXhOYW1lLmxlbmd0aCA+IDUyKSB7XG4gICAgICAgICAgb2JqZWN0Lm5hbWUgPSBpbmRleE5hbWUuc3Vic3RyaW5nKDAsIDUyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9O1xufVxuIiwiQ3JlYXRvci5hcHBzQnlOYW1lID0ge31cblxuIiwiTWV0ZW9yLm1ldGhvZHNcblx0XCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc3BhY2VfaWQpLT5cblx0XHRpZiAhdGhpcy51c2VySWRcblx0XHRcdHJldHVybiBudWxsXG5cblx0XHRpZiBvYmplY3RfbmFtZSA9PSBcIm9iamVjdF9yZWNlbnRfdmlld2VkXCJcblx0XHRcdHJldHVyblxuXHRcdGlmIG9iamVjdF9uYW1lIGFuZCByZWNvcmRfaWRcblx0XHRcdGlmICFzcGFjZV9pZFxuXHRcdFx0XHRkb2MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmRPbmUoe19pZDogcmVjb3JkX2lkfSwge2ZpZWxkczoge3NwYWNlOiAxfX0pXG5cdFx0XHRcdHNwYWNlX2lkID0gZG9jPy5zcGFjZVxuXG5cdFx0XHRjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiKVxuXHRcdFx0ZmlsdGVycyA9IHsgb3duZXI6IHRoaXMudXNlcklkLCBzcGFjZTogc3BhY2VfaWQsICdyZWNvcmQubyc6IG9iamVjdF9uYW1lLCAncmVjb3JkLmlkcyc6IFtyZWNvcmRfaWRdfVxuXHRcdFx0Y3VycmVudF9yZWNlbnRfdmlld2VkID0gY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLmZpbmRPbmUoZmlsdGVycylcblx0XHRcdGlmIGN1cnJlbnRfcmVjZW50X3ZpZXdlZFxuXHRcdFx0XHRjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQudXBkYXRlKFxuXHRcdFx0XHRcdGN1cnJlbnRfcmVjZW50X3ZpZXdlZC5faWQsXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0JGluYzoge1xuXHRcdFx0XHRcdFx0XHRjb3VudDogMVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWQ6IG5ldyBEYXRlKClcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5pbnNlcnQoXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0X2lkOiBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuX21ha2VOZXdJRCgpXG5cdFx0XHRcdFx0XHRvd25lcjogdGhpcy51c2VySWRcblx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZV9pZFxuXHRcdFx0XHRcdFx0cmVjb3JkOiB7bzogb2JqZWN0X25hbWUsIGlkczogW3JlY29yZF9pZF19XG5cdFx0XHRcdFx0XHRjb3VudDogMVxuXHRcdFx0XHRcdFx0Y3JlYXRlZDogbmV3IERhdGUoKVxuXHRcdFx0XHRcdFx0Y3JlYXRlZF9ieTogdGhpcy51c2VySWRcblx0XHRcdFx0XHRcdG1vZGlmaWVkOiBuZXcgRGF0ZSgpXG5cdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogdGhpcy51c2VySWRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdClcblx0XHRcdHJldHVybiIsIk1ldGVvci5tZXRob2RzKHtcbiAgXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZV9pZCkge1xuICAgIHZhciBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQsIGN1cnJlbnRfcmVjZW50X3ZpZXdlZCwgZG9jLCBmaWx0ZXJzO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAob2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgICBpZiAoIXNwYWNlX2lkKSB7XG4gICAgICAgIGRvYyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZE9uZSh7XG4gICAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgc3BhY2U6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzcGFjZV9pZCA9IGRvYyAhPSBudWxsID8gZG9jLnNwYWNlIDogdm9pZCAwO1xuICAgICAgfVxuICAgICAgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIik7XG4gICAgICBmaWx0ZXJzID0ge1xuICAgICAgICBvd25lcjogdGhpcy51c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgJ3JlY29yZC5vJzogb2JqZWN0X25hbWUsXG4gICAgICAgICdyZWNvcmQuaWRzJzogW3JlY29yZF9pZF1cbiAgICAgIH07XG4gICAgICBjdXJyZW50X3JlY2VudF92aWV3ZWQgPSBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuZmluZE9uZShmaWx0ZXJzKTtcbiAgICAgIGlmIChjdXJyZW50X3JlY2VudF92aWV3ZWQpIHtcbiAgICAgICAgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLnVwZGF0ZShjdXJyZW50X3JlY2VudF92aWV3ZWQuX2lkLCB7XG4gICAgICAgICAgJGluYzoge1xuICAgICAgICAgICAgY291bnQ6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5pbnNlcnQoe1xuICAgICAgICAgIF9pZDogY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLl9tYWtlTmV3SUQoKSxcbiAgICAgICAgICBvd25lcjogdGhpcy51c2VySWQsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIHJlY29yZDoge1xuICAgICAgICAgICAgbzogb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBpZHM6IFtyZWNvcmRfaWRdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IHRoaXMudXNlcklkLFxuICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuIiwicmVjZW50X2FnZ3JlZ2F0ZSA9IChjcmVhdGVkX2J5LCBzcGFjZUlkLCBfcmVjb3JkcywgY2FsbGJhY2spLT5cblx0Q3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfcmVjZW50X3ZpZXdlZC5yYXdDb2xsZWN0aW9uKCkuYWdncmVnYXRlKFtcblx0XHR7JG1hdGNoOiB7Y3JlYXRlZF9ieTogY3JlYXRlZF9ieSwgc3BhY2U6IHNwYWNlSWR9fSxcblx0XHR7JGdyb3VwOiB7X2lkOiB7b2JqZWN0X25hbWU6IFwiJHJlY29yZC5vXCIsIHJlY29yZF9pZDogXCIkcmVjb3JkLmlkc1wiLCBzcGFjZTogXCIkc3BhY2VcIn0sIG1heENyZWF0ZWQ6IHskbWF4OiBcIiRjcmVhdGVkXCJ9fX0sXG5cdFx0eyRzb3J0OiB7bWF4Q3JlYXRlZDogLTF9fSxcblx0XHR7JGxpbWl0OiAxMH1cblx0XSkudG9BcnJheSAoZXJyLCBkYXRhKS0+XG5cdFx0aWYgZXJyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyKVxuXG5cdFx0ZGF0YS5mb3JFYWNoIChkb2MpIC0+XG5cdFx0XHRfcmVjb3Jkcy5wdXNoIGRvYy5faWRcblxuXHRcdGlmIGNhbGxiYWNrICYmIF8uaXNGdW5jdGlvbihjYWxsYmFjaylcblx0XHRcdGNhbGxiYWNrKClcblxuXHRcdHJldHVyblxuXG5hc3luY19yZWNlbnRfYWdncmVnYXRlID0gTWV0ZW9yLndyYXBBc3luYyhyZWNlbnRfYWdncmVnYXRlKVxuXG5zZWFyY2hfb2JqZWN0ID0gKHNwYWNlLCBvYmplY3RfbmFtZSx1c2VySWQsIHNlYXJjaFRleHQpLT5cblx0ZGF0YSA9IG5ldyBBcnJheSgpXG5cblx0aWYgc2VhcmNoVGV4dFxuXG5cdFx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdFx0X29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxuXHRcdF9vYmplY3RfbmFtZV9rZXkgPSBfb2JqZWN0Py5OQU1FX0ZJRUxEX0tFWVxuXHRcdGlmIF9vYmplY3QgJiYgX29iamVjdF9jb2xsZWN0aW9uICYmIF9vYmplY3RfbmFtZV9rZXlcblx0XHRcdHF1ZXJ5ID0ge31cblx0XHRcdHNlYXJjaF9LZXl3b3JkcyA9IHNlYXJjaFRleHQuc3BsaXQoXCIgXCIpXG5cdFx0XHRxdWVyeV9hbmQgPSBbXVxuXHRcdFx0c2VhcmNoX0tleXdvcmRzLmZvckVhY2ggKGtleXdvcmQpLT5cblx0XHRcdFx0c3VicXVlcnkgPSB7fVxuXHRcdFx0XHRzdWJxdWVyeVtfb2JqZWN0X25hbWVfa2V5XSA9IHskcmVnZXg6IGtleXdvcmQudHJpbSgpfVxuXHRcdFx0XHRxdWVyeV9hbmQucHVzaCBzdWJxdWVyeVxuXG5cdFx0XHRxdWVyeS4kYW5kID0gcXVlcnlfYW5kXG5cdFx0XHRxdWVyeS5zcGFjZSA9IHskaW46IFtzcGFjZV19XG5cblx0XHRcdGZpZWxkcyA9IHtfaWQ6IDF9XG5cdFx0XHRmaWVsZHNbX29iamVjdF9uYW1lX2tleV0gPSAxXG5cblx0XHRcdHJlY29yZHMgPSBfb2JqZWN0X2NvbGxlY3Rpb24uZmluZChxdWVyeSwge2ZpZWxkczogZmllbGRzLCBzb3J0OiB7bW9kaWZpZWQ6IDF9LCBsaW1pdDogNX0pXG5cblx0XHRcdHJlY29yZHMuZm9yRWFjaCAocmVjb3JkKS0+XG5cdFx0XHRcdGRhdGEucHVzaCB7X2lkOiByZWNvcmQuX2lkLCBfbmFtZTogcmVjb3JkW19vYmplY3RfbmFtZV9rZXldLCBfb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lfVxuXHRcblx0cmV0dXJuIGRhdGFcblxuTWV0ZW9yLm1ldGhvZHNcblx0J29iamVjdF9yZWNlbnRfcmVjb3JkJzogKHNwYWNlSWQpLT5cblx0XHRkYXRhID0gbmV3IEFycmF5KClcblx0XHRyZWNvcmRzID0gbmV3IEFycmF5KClcblx0XHRhc3luY19yZWNlbnRfYWdncmVnYXRlKHRoaXMudXNlcklkLCBzcGFjZUlkLCByZWNvcmRzKVxuXHRcdHJlY29yZHMuZm9yRWFjaCAoaXRlbSktPlxuXHRcdFx0cmVjb3JkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpXG5cblx0XHRcdGlmICFyZWNvcmRfb2JqZWN0XG5cdFx0XHRcdHJldHVyblxuXG5cdFx0XHRyZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSlcblxuXHRcdFx0aWYgcmVjb3JkX29iamVjdCAmJiByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb25cblx0XHRcdFx0ZmllbGRzID0ge19pZDogMX1cblxuXHRcdFx0XHRmaWVsZHNbcmVjb3JkX29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gPSAxXG5cblx0XHRcdFx0cmVjb3JkID0gcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uLmZpbmRPbmUoaXRlbS5yZWNvcmRfaWRbMF0sIHtmaWVsZHM6IGZpZWxkc30pXG5cdFx0XHRcdGlmIHJlY29yZFxuXHRcdFx0XHRcdGRhdGEucHVzaCB7X2lkOiByZWNvcmQuX2lkLCBfbmFtZTogcmVjb3JkW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldLCBfb2JqZWN0X25hbWU6IGl0ZW0ub2JqZWN0X25hbWV9XG5cblx0XHRyZXR1cm4gZGF0YVxuXG5cdCdvYmplY3RfcmVjb3JkX3NlYXJjaCc6IChvcHRpb25zKS0+XG5cdFx0c2VsZiA9IHRoaXNcblxuXHRcdGRhdGEgPSBuZXcgQXJyYXkoKVxuXG5cdFx0c2VhcmNoVGV4dCA9IG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdHNwYWNlID0gb3B0aW9ucy5zcGFjZVxuXG5cdFx0Xy5mb3JFYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKF9vYmplY3QsIG5hbWUpLT5cblx0XHRcdGlmIF9vYmplY3QuZW5hYmxlX3NlYXJjaFxuXHRcdFx0XHRvYmplY3RfcmVjb3JkID0gc2VhcmNoX29iamVjdChzcGFjZSwgX29iamVjdC5uYW1lLCBzZWxmLnVzZXJJZCwgc2VhcmNoVGV4dClcblx0XHRcdFx0ZGF0YSA9IGRhdGEuY29uY2F0KG9iamVjdF9yZWNvcmQpXG5cblx0XHRyZXR1cm4gZGF0YVxuIiwidmFyIGFzeW5jX3JlY2VudF9hZ2dyZWdhdGUsIHJlY2VudF9hZ2dyZWdhdGUsIHNlYXJjaF9vYmplY3Q7XG5cbnJlY2VudF9hZ2dyZWdhdGUgPSBmdW5jdGlvbihjcmVhdGVkX2J5LCBzcGFjZUlkLCBfcmVjb3JkcywgY2FsbGJhY2spIHtcbiAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3JlY2VudF92aWV3ZWQucmF3Q29sbGVjdGlvbigpLmFnZ3JlZ2F0ZShbXG4gICAge1xuICAgICAgJG1hdGNoOiB7XG4gICAgICAgIGNyZWF0ZWRfYnk6IGNyZWF0ZWRfYnksXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgJGdyb3VwOiB7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBcIiRyZWNvcmQub1wiLFxuICAgICAgICAgIHJlY29yZF9pZDogXCIkcmVjb3JkLmlkc1wiLFxuICAgICAgICAgIHNwYWNlOiBcIiRzcGFjZVwiXG4gICAgICAgIH0sXG4gICAgICAgIG1heENyZWF0ZWQ6IHtcbiAgICAgICAgICAkbWF4OiBcIiRjcmVhdGVkXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgICRzb3J0OiB7XG4gICAgICAgIG1heENyZWF0ZWQ6IC0xXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgJGxpbWl0OiAxMFxuICAgIH1cbiAgXSkudG9BcnJheShmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyKTtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGRvYykge1xuICAgICAgcmV0dXJuIF9yZWNvcmRzLnB1c2goZG9jLl9pZCk7XG4gICAgfSk7XG4gICAgaWYgKGNhbGxiYWNrICYmIF8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9KTtcbn07XG5cbmFzeW5jX3JlY2VudF9hZ2dyZWdhdGUgPSBNZXRlb3Iud3JhcEFzeW5jKHJlY2VudF9hZ2dyZWdhdGUpO1xuXG5zZWFyY2hfb2JqZWN0ID0gZnVuY3Rpb24oc3BhY2UsIG9iamVjdF9uYW1lLCB1c2VySWQsIHNlYXJjaFRleHQpIHtcbiAgdmFyIF9vYmplY3QsIF9vYmplY3RfY29sbGVjdGlvbiwgX29iamVjdF9uYW1lX2tleSwgZGF0YSwgZmllbGRzLCBxdWVyeSwgcXVlcnlfYW5kLCByZWNvcmRzLCBzZWFyY2hfS2V5d29yZHM7XG4gIGRhdGEgPSBuZXcgQXJyYXkoKTtcbiAgaWYgKHNlYXJjaFRleHQpIHtcbiAgICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIF9vYmplY3RfY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSk7XG4gICAgX29iamVjdF9uYW1lX2tleSA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuTkFNRV9GSUVMRF9LRVkgOiB2b2lkIDA7XG4gICAgaWYgKF9vYmplY3QgJiYgX29iamVjdF9jb2xsZWN0aW9uICYmIF9vYmplY3RfbmFtZV9rZXkpIHtcbiAgICAgIHF1ZXJ5ID0ge307XG4gICAgICBzZWFyY2hfS2V5d29yZHMgPSBzZWFyY2hUZXh0LnNwbGl0KFwiIFwiKTtcbiAgICAgIHF1ZXJ5X2FuZCA9IFtdO1xuICAgICAgc2VhcmNoX0tleXdvcmRzLmZvckVhY2goZnVuY3Rpb24oa2V5d29yZCkge1xuICAgICAgICB2YXIgc3VicXVlcnk7XG4gICAgICAgIHN1YnF1ZXJ5ID0ge307XG4gICAgICAgIHN1YnF1ZXJ5W19vYmplY3RfbmFtZV9rZXldID0ge1xuICAgICAgICAgICRyZWdleDoga2V5d29yZC50cmltKClcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHF1ZXJ5X2FuZC5wdXNoKHN1YnF1ZXJ5KTtcbiAgICAgIH0pO1xuICAgICAgcXVlcnkuJGFuZCA9IHF1ZXJ5X2FuZDtcbiAgICAgIHF1ZXJ5LnNwYWNlID0ge1xuICAgICAgICAkaW46IFtzcGFjZV1cbiAgICAgIH07XG4gICAgICBmaWVsZHMgPSB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfTtcbiAgICAgIGZpZWxkc1tfb2JqZWN0X25hbWVfa2V5XSA9IDE7XG4gICAgICByZWNvcmRzID0gX29iamVjdF9jb2xsZWN0aW9uLmZpbmQocXVlcnksIHtcbiAgICAgICAgZmllbGRzOiBmaWVsZHMsXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBtb2RpZmllZDogMVxuICAgICAgICB9LFxuICAgICAgICBsaW1pdDogNVxuICAgICAgfSk7XG4gICAgICByZWNvcmRzLmZvckVhY2goZnVuY3Rpb24ocmVjb3JkKSB7XG4gICAgICAgIHJldHVybiBkYXRhLnB1c2goe1xuICAgICAgICAgIF9pZDogcmVjb3JkLl9pZCxcbiAgICAgICAgICBfbmFtZTogcmVjb3JkW19vYmplY3RfbmFtZV9rZXldLFxuICAgICAgICAgIF9vYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gICdvYmplY3RfcmVjZW50X3JlY29yZCc6IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgZGF0YSwgcmVjb3JkcztcbiAgICBkYXRhID0gbmV3IEFycmF5KCk7XG4gICAgcmVjb3JkcyA9IG5ldyBBcnJheSgpO1xuICAgIGFzeW5jX3JlY2VudF9hZ2dyZWdhdGUodGhpcy51c2VySWQsIHNwYWNlSWQsIHJlY29yZHMpO1xuICAgIHJlY29yZHMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICB2YXIgZmllbGRzLCByZWNvcmQsIHJlY29yZF9vYmplY3QsIHJlY29yZF9vYmplY3RfY29sbGVjdGlvbjtcbiAgICAgIHJlY29yZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChpdGVtLm9iamVjdF9uYW1lLCBpdGVtLnNwYWNlKTtcbiAgICAgIGlmICghcmVjb3JkX29iamVjdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSk7XG4gICAgICBpZiAocmVjb3JkX29iamVjdCAmJiByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24pIHtcbiAgICAgICAgZmllbGRzID0ge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9O1xuICAgICAgICBmaWVsZHNbcmVjb3JkX29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gPSAxO1xuICAgICAgICByZWNvcmQgPSByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24uZmluZE9uZShpdGVtLnJlY29yZF9pZFswXSwge1xuICAgICAgICAgIGZpZWxkczogZmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGEucHVzaCh7XG4gICAgICAgICAgICBfaWQ6IHJlY29yZC5faWQsXG4gICAgICAgICAgICBfbmFtZTogcmVjb3JkW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldLFxuICAgICAgICAgICAgX29iamVjdF9uYW1lOiBpdGVtLm9iamVjdF9uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfSxcbiAgJ29iamVjdF9yZWNvcmRfc2VhcmNoJzogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBkYXRhLCBzZWFyY2hUZXh0LCBzZWxmLCBzcGFjZTtcbiAgICBzZWxmID0gdGhpcztcbiAgICBkYXRhID0gbmV3IEFycmF5KCk7XG4gICAgc2VhcmNoVGV4dCA9IG9wdGlvbnMuc2VhcmNoVGV4dDtcbiAgICBzcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gICAgXy5mb3JFYWNoKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgZnVuY3Rpb24oX29iamVjdCwgbmFtZSkge1xuICAgICAgdmFyIG9iamVjdF9yZWNvcmQ7XG4gICAgICBpZiAoX29iamVjdC5lbmFibGVfc2VhcmNoKSB7XG4gICAgICAgIG9iamVjdF9yZWNvcmQgPSBzZWFyY2hfb2JqZWN0KHNwYWNlLCBfb2JqZWN0Lm5hbWUsIHNlbGYudXNlcklkLCBzZWFyY2hUZXh0KTtcbiAgICAgICAgcmV0dXJuIGRhdGEgPSBkYXRhLmNvbmNhdChvYmplY3RfcmVjb3JkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuICAgIHVwZGF0ZV9maWx0ZXJzOiAobGlzdHZpZXdfaWQsIGZpbHRlcnMsIGZpbHRlcl9zY29wZSwgZmlsdGVyX2xvZ2ljKS0+XG4gICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy5kaXJlY3QudXBkYXRlKHtfaWQ6IGxpc3R2aWV3X2lkfSwgeyRzZXQ6IHtmaWx0ZXJzOiBmaWx0ZXJzLCBmaWx0ZXJfc2NvcGU6IGZpbHRlcl9zY29wZSwgZmlsdGVyX2xvZ2ljOiBmaWx0ZXJfbG9naWN9fSlcblxuICAgIHVwZGF0ZV9jb2x1bW5zOiAobGlzdHZpZXdfaWQsIGNvbHVtbnMpLT5cbiAgICAgICAgY2hlY2soY29sdW1ucywgQXJyYXkpXG4gICAgICAgIFxuICAgICAgICBpZiBjb2x1bW5zLmxlbmd0aCA8IDFcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAwLCBcIlNlbGVjdCBhdCBsZWFzdCBvbmUgZmllbGQgdG8gZGlzcGxheVwiXG4gICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy51cGRhdGUoe19pZDogbGlzdHZpZXdfaWR9LCB7JHNldDoge2NvbHVtbnM6IGNvbHVtbnN9fSlcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgdXBkYXRlX2ZpbHRlcnM6IGZ1bmN0aW9uKGxpc3R2aWV3X2lkLCBmaWx0ZXJzLCBmaWx0ZXJfc2NvcGUsIGZpbHRlcl9sb2dpYykge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IGxpc3R2aWV3X2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBmaWx0ZXJzOiBmaWx0ZXJzLFxuICAgICAgICBmaWx0ZXJfc2NvcGU6IGZpbHRlcl9zY29wZSxcbiAgICAgICAgZmlsdGVyX2xvZ2ljOiBmaWx0ZXJfbG9naWNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlX2NvbHVtbnM6IGZ1bmN0aW9uKGxpc3R2aWV3X2lkLCBjb2x1bW5zKSB7XG4gICAgY2hlY2soY29sdW1ucywgQXJyYXkpO1xuICAgIGlmIChjb2x1bW5zLmxlbmd0aCA8IDEpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIlNlbGVjdCBhdCBsZWFzdCBvbmUgZmllbGQgdG8gZGlzcGxheVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy51cGRhdGUoe1xuICAgICAgX2lkOiBsaXN0dmlld19pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgY29sdW1uczogY29sdW1uc1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdCdyZXBvcnRfZGF0YSc6IChvcHRpb25zKS0+XG5cdFx0Y2hlY2sob3B0aW9ucywgT2JqZWN0KVxuXHRcdHNwYWNlID0gb3B0aW9ucy5zcGFjZVxuXHRcdGZpZWxkcyA9IG9wdGlvbnMuZmllbGRzXG5cdFx0b2JqZWN0X25hbWUgPSBvcHRpb25zLm9iamVjdF9uYW1lXG5cdFx0ZmlsdGVyX3Njb3BlID0gb3B0aW9ucy5maWx0ZXJfc2NvcGVcblx0XHRmaWx0ZXJzID0gb3B0aW9ucy5maWx0ZXJzXG5cdFx0ZmlsdGVyRmllbGRzID0ge31cblx0XHRjb21wb3VuZEZpZWxkcyA9IFtdXG5cdFx0b2JqZWN0RmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5maWVsZHNcblx0XHRfLmVhY2ggZmllbGRzLCAoaXRlbSwgaW5kZXgpLT5cblx0XHRcdHNwbGl0cyA9IGl0ZW0uc3BsaXQoXCIuXCIpXG5cdFx0XHRuYW1lID0gc3BsaXRzWzBdXG5cdFx0XHRvYmplY3RGaWVsZCA9IG9iamVjdEZpZWxkc1tuYW1lXVxuXHRcdFx0aWYgc3BsaXRzLmxlbmd0aCA+IDEgYW5kIG9iamVjdEZpZWxkXG5cdFx0XHRcdGNoaWxkS2V5ID0gaXRlbS5yZXBsYWNlIG5hbWUgKyBcIi5cIiwgXCJcIlxuXHRcdFx0XHRjb21wb3VuZEZpZWxkcy5wdXNoKHtuYW1lOiBuYW1lLCBjaGlsZEtleTogY2hpbGRLZXksIGZpZWxkOiBvYmplY3RGaWVsZH0pXG5cdFx0XHRmaWx0ZXJGaWVsZHNbbmFtZV0gPSAxXG5cblx0XHRzZWxlY3RvciA9IHt9XG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcblx0XHRzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXG5cdFx0aWYgZmlsdGVyX3Njb3BlID09IFwic3BhY2V4XCJcblx0XHRcdHNlbGVjdG9yLnNwYWNlID0gXG5cdFx0XHRcdCRpbjogW251bGwsc3BhY2VdXG5cdFx0ZWxzZSBpZiBmaWx0ZXJfc2NvcGUgPT0gXCJtaW5lXCJcblx0XHRcdHNlbGVjdG9yLm93bmVyID0gdXNlcklkXG5cblx0XHRpZiBDcmVhdG9yLmlzQ29tbW9uU3BhY2Uoc3BhY2UpICYmIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlLCBAdXNlcklkKVxuXHRcdFx0ZGVsZXRlIHNlbGVjdG9yLnNwYWNlXG5cblx0XHRpZiBmaWx0ZXJzIGFuZCBmaWx0ZXJzLmxlbmd0aCA+IDBcblx0XHRcdHNlbGVjdG9yW1wiJGFuZFwiXSA9IGZpbHRlcnNcblxuXHRcdGN1cnNvciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvciwge2ZpZWxkczogZmlsdGVyRmllbGRzLCBza2lwOiAwLCBsaW1pdDogMTAwMDB9KVxuI1x0XHRpZiBjdXJzb3IuY291bnQoKSA+IDEwMDAwXG4jXHRcdFx0cmV0dXJuIFtdXG5cdFx0cmVzdWx0ID0gY3Vyc29yLmZldGNoKClcblx0XHRpZiBjb21wb3VuZEZpZWxkcy5sZW5ndGhcblx0XHRcdHJlc3VsdCA9IHJlc3VsdC5tYXAgKGl0ZW0saW5kZXgpLT5cblx0XHRcdFx0Xy5lYWNoIGNvbXBvdW5kRmllbGRzLCAoY29tcG91bmRGaWVsZEl0ZW0sIGluZGV4KS0+XG5cdFx0XHRcdFx0aXRlbUtleSA9IGNvbXBvdW5kRmllbGRJdGVtLm5hbWUgKyBcIiolKlwiICsgY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXkucmVwbGFjZSgvXFwuL2csIFwiKiUqXCIpXG5cdFx0XHRcdFx0aXRlbVZhbHVlID0gaXRlbVtjb21wb3VuZEZpZWxkSXRlbS5uYW1lXVxuXHRcdFx0XHRcdHR5cGUgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC50eXBlXG5cdFx0XHRcdFx0aWYgW1wibG9va3VwXCIsIFwibWFzdGVyX2RldGFpbFwiXS5pbmRleE9mKHR5cGUpID4gLTFcblx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRcdFx0Y29tcG91bmRGaWx0ZXJGaWVsZHMgPSB7fVxuXHRcdFx0XHRcdFx0Y29tcG91bmRGaWx0ZXJGaWVsZHNbY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldID0gMVxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlSXRlbSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8pLmZpbmRPbmUge19pZDogaXRlbVZhbHVlfSwgZmllbGRzOiBjb21wb3VuZEZpbHRlckZpZWxkc1xuXHRcdFx0XHRcdFx0aWYgcmVmZXJlbmNlSXRlbVxuXHRcdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gcmVmZXJlbmNlSXRlbVtjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV1cblx0XHRcdFx0XHRlbHNlIGlmIHR5cGUgPT0gXCJzZWxlY3RcIlxuXHRcdFx0XHRcdFx0b3B0aW9ucyA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLm9wdGlvbnNcblx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSBfLmZpbmRXaGVyZShvcHRpb25zLCB7dmFsdWU6IGl0ZW1WYWx1ZX0pPy5sYWJlbCBvciBpdGVtVmFsdWVcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gaXRlbVZhbHVlXG5cdFx0XHRcdFx0dW5sZXNzIGl0ZW1baXRlbUtleV1cblx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSBcIi0tXCJcblx0XHRcdFx0cmV0dXJuIGl0ZW1cblx0XHRcdHJldHVybiByZXN1bHRcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gcmVzdWx0XG5cbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgJ3JlcG9ydF9kYXRhJzogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBjb21wb3VuZEZpZWxkcywgY3Vyc29yLCBmaWVsZHMsIGZpbHRlckZpZWxkcywgZmlsdGVyX3Njb3BlLCBmaWx0ZXJzLCBvYmplY3RGaWVsZHMsIG9iamVjdF9uYW1lLCByZWYsIHJlc3VsdCwgc2VsZWN0b3IsIHNwYWNlLCB1c2VySWQ7XG4gICAgY2hlY2sob3B0aW9ucywgT2JqZWN0KTtcbiAgICBzcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gICAgZmllbGRzID0gb3B0aW9ucy5maWVsZHM7XG4gICAgb2JqZWN0X25hbWUgPSBvcHRpb25zLm9iamVjdF9uYW1lO1xuICAgIGZpbHRlcl9zY29wZSA9IG9wdGlvbnMuZmlsdGVyX3Njb3BlO1xuICAgIGZpbHRlcnMgPSBvcHRpb25zLmZpbHRlcnM7XG4gICAgZmlsdGVyRmllbGRzID0ge307XG4gICAgY29tcG91bmRGaWVsZHMgPSBbXTtcbiAgICBvYmplY3RGaWVsZHMgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMDtcbiAgICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgdmFyIGNoaWxkS2V5LCBuYW1lLCBvYmplY3RGaWVsZCwgc3BsaXRzO1xuICAgICAgc3BsaXRzID0gaXRlbS5zcGxpdChcIi5cIik7XG4gICAgICBuYW1lID0gc3BsaXRzWzBdO1xuICAgICAgb2JqZWN0RmllbGQgPSBvYmplY3RGaWVsZHNbbmFtZV07XG4gICAgICBpZiAoc3BsaXRzLmxlbmd0aCA+IDEgJiYgb2JqZWN0RmllbGQpIHtcbiAgICAgICAgY2hpbGRLZXkgPSBpdGVtLnJlcGxhY2UobmFtZSArIFwiLlwiLCBcIlwiKTtcbiAgICAgICAgY29tcG91bmRGaWVsZHMucHVzaCh7XG4gICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICBjaGlsZEtleTogY2hpbGRLZXksXG4gICAgICAgICAgZmllbGQ6IG9iamVjdEZpZWxkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZpbHRlckZpZWxkc1tuYW1lXSA9IDE7XG4gICAgfSk7XG4gICAgc2VsZWN0b3IgPSB7fTtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlO1xuICAgIGlmIChmaWx0ZXJfc2NvcGUgPT09IFwic3BhY2V4XCIpIHtcbiAgICAgIHNlbGVjdG9yLnNwYWNlID0ge1xuICAgICAgICAkaW46IFtudWxsLCBzcGFjZV1cbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChmaWx0ZXJfc2NvcGUgPT09IFwibWluZVwiKSB7XG4gICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZDtcbiAgICB9XG4gICAgaWYgKENyZWF0b3IuaXNDb21tb25TcGFjZShzcGFjZSkgJiYgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2UsIHRoaXMudXNlcklkKSkge1xuICAgICAgZGVsZXRlIHNlbGVjdG9yLnNwYWNlO1xuICAgIH1cbiAgICBpZiAoZmlsdGVycyAmJiBmaWx0ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHNlbGVjdG9yW1wiJGFuZFwiXSA9IGZpbHRlcnM7XG4gICAgfVxuICAgIGN1cnNvciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvciwge1xuICAgICAgZmllbGRzOiBmaWx0ZXJGaWVsZHMsXG4gICAgICBza2lwOiAwLFxuICAgICAgbGltaXQ6IDEwMDAwXG4gICAgfSk7XG4gICAgcmVzdWx0ID0gY3Vyc29yLmZldGNoKCk7XG4gICAgaWYgKGNvbXBvdW5kRmllbGRzLmxlbmd0aCkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0Lm1hcChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICBfLmVhY2goY29tcG91bmRGaWVsZHMsIGZ1bmN0aW9uKGNvbXBvdW5kRmllbGRJdGVtLCBpbmRleCkge1xuICAgICAgICAgIHZhciBjb21wb3VuZEZpbHRlckZpZWxkcywgaXRlbUtleSwgaXRlbVZhbHVlLCByZWYxLCByZWZlcmVuY2VJdGVtLCByZWZlcmVuY2VfdG8sIHR5cGU7XG4gICAgICAgICAgaXRlbUtleSA9IGNvbXBvdW5kRmllbGRJdGVtLm5hbWUgKyBcIiolKlwiICsgY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXkucmVwbGFjZSgvXFwuL2csIFwiKiUqXCIpO1xuICAgICAgICAgIGl0ZW1WYWx1ZSA9IGl0ZW1bY29tcG91bmRGaWVsZEl0ZW0ubmFtZV07XG4gICAgICAgICAgdHlwZSA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLnR5cGU7XG4gICAgICAgICAgaWYgKFtcImxvb2t1cFwiLCBcIm1hc3Rlcl9kZXRhaWxcIl0uaW5kZXhPZih0eXBlKSA+IC0xKSB7XG4gICAgICAgICAgICByZWZlcmVuY2VfdG8gPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICBjb21wb3VuZEZpbHRlckZpZWxkcyA9IHt9O1xuICAgICAgICAgICAgY29tcG91bmRGaWx0ZXJGaWVsZHNbY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldID0gMTtcbiAgICAgICAgICAgIHJlZmVyZW5jZUl0ZW0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvKS5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiBpdGVtVmFsdWVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiBjb21wb3VuZEZpbHRlckZpZWxkc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocmVmZXJlbmNlSXRlbSkge1xuICAgICAgICAgICAgICBpdGVtW2l0ZW1LZXldID0gcmVmZXJlbmNlSXRlbVtjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQub3B0aW9ucztcbiAgICAgICAgICAgIGl0ZW1baXRlbUtleV0gPSAoKHJlZjEgPSBfLmZpbmRXaGVyZShvcHRpb25zLCB7XG4gICAgICAgICAgICAgIHZhbHVlOiBpdGVtVmFsdWVcbiAgICAgICAgICAgIH0pKSAhPSBudWxsID8gcmVmMS5sYWJlbCA6IHZvaWQgMCkgfHwgaXRlbVZhbHVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtW2l0ZW1LZXldID0gaXRlbVZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWl0ZW1baXRlbUtleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtW2l0ZW1LZXldID0gXCItLVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxufSk7XG4iLCIjIyNcbiAgICB0eXBlOiBcInVzZXJcIlxuICAgIG9iamVjdF9uYW1lOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICAgIHJlY29yZF9pZDogXCJ7b2JqZWN0X25hbWV9LHtsaXN0dmlld19pZH1cIlxuICAgIHNldHRpbmdzOlxuICAgICAgICBjb2x1bW5fd2lkdGg6IHsgZmllbGRfYTogMTAwLCBmaWVsZF8yOiAxNTAgfVxuICAgICAgICBzb3J0OiBbW1wiZmllbGRfYVwiLCBcImRlc2NcIl1dXG4gICAgb3duZXI6IHt1c2VySWR9XG4jIyNcblxuTWV0ZW9yLm1ldGhvZHNcbiAgICBcInRhYnVsYXJfc29ydF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgc29ydCktPlxuICAgICAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxuICAgICAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsIG93bmVyOiB1c2VySWR9KVxuICAgICAgICBpZiBzZXR0aW5nXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uc29ydFwiOiBzb3J0fX0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRvYyA9IFxuICAgICAgICAgICAgICAgIHR5cGU6IFwidXNlclwiXG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7fVxuICAgICAgICAgICAgICAgIG93bmVyOiB1c2VySWRcblxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fVxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnRcblxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKVxuXG4gICAgXCJ0YWJ1bGFyX2NvbHVtbl93aWR0aF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoKS0+XG4gICAgICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXG4gICAgICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIiwgb3duZXI6IHVzZXJJZH0pXG4gICAgICAgIGlmIHNldHRpbmdcbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5jb2x1bW5fd2lkdGhcIjogY29sdW1uX3dpZHRofX0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRvYyA9IFxuICAgICAgICAgICAgICAgIHR5cGU6IFwidXNlclwiXG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7fVxuICAgICAgICAgICAgICAgIG93bmVyOiB1c2VySWRcblxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fVxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoXG5cbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYylcblxuICAgIFwiZ3JpZF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoLCBzb3J0KS0+XG4gICAgICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXG4gICAgICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIiwgb3duZXI6IHVzZXJJZH0pXG4gICAgICAgIGlmIHNldHRpbmdcbiAgICAgICAgICAgICMg5q+P5qyh6YO95by65Yi25pS55Y+YX2lkX2FjdGlvbnPliJfnmoTlrr3luqbvvIzku6Xop6PlhrPlvZPnlKjmiLflj6rmlLnlj5jlrZfmrrXmrKHluo/ogIzmsqHmnInmlLnlj5jku7vkvZXlrZfmrrXlrr3luqbml7bvvIzliY3nq6/msqHmnInorqLpmIXliLDlrZfmrrXmrKHluo/lj5jmm7TnmoTmlbDmja7nmoTpl67pophcbiAgICAgICAgICAgIGNvbHVtbl93aWR0aC5faWRfYWN0aW9ucyA9IGlmIHNldHRpbmcuc2V0dGluZ3NbXCIje2xpc3Rfdmlld19pZH1cIl0/LmNvbHVtbl93aWR0aD8uX2lkX2FjdGlvbnMgPT0gNDYgdGhlbiA0NyBlbHNlIDQ2XG4gICAgICAgICAgICBpZiBzb3J0XG4gICAgICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LnNvcnRcIjogc29ydCwgXCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uY29sdW1uX3dpZHRoXCI6IGNvbHVtbl93aWR0aH19KVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5jb2x1bW5fd2lkdGhcIjogY29sdW1uX3dpZHRofX0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRvYyA9XG4gICAgICAgICAgICAgICAgdHlwZTogXCJ1c2VyXCJcbiAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHt9XG4gICAgICAgICAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9XG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5jb2x1bW5fd2lkdGggPSBjb2x1bW5fd2lkdGhcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0XG5cbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYykiLCJcbi8qXG4gICAgdHlwZTogXCJ1c2VyXCJcbiAgICBvYmplY3RfbmFtZTogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgICByZWNvcmRfaWQ6IFwie29iamVjdF9uYW1lfSx7bGlzdHZpZXdfaWR9XCJcbiAgICBzZXR0aW5nczpcbiAgICAgICAgY29sdW1uX3dpZHRoOiB7IGZpZWxkX2E6IDEwMCwgZmllbGRfMjogMTUwIH1cbiAgICAgICAgc29ydDogW1tcImZpZWxkX2FcIiwgXCJkZXNjXCJdXVxuICAgIG93bmVyOiB7dXNlcklkfVxuICovXG5NZXRlb3IubWV0aG9kcyh7XG4gIFwidGFidWxhcl9zb3J0X3NldHRpbmdzXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIHNvcnQpIHtcbiAgICB2YXIgZG9jLCBvYmosIHNldHRpbmcsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICBvd25lcjogdXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNldHRpbmcpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDogKFxuICAgICAgICAgIG9iaiA9IHt9LFxuICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuc29ydFwiXSA9IHNvcnQsXG4gICAgICAgICAgb2JqXG4gICAgICAgIClcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2MgPSB7XG4gICAgICAgIHR5cGU6IFwidXNlclwiLFxuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge307XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydDtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpO1xuICAgIH1cbiAgfSxcbiAgXCJ0YWJ1bGFyX2NvbHVtbl93aWR0aF9zZXR0aW5nc1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5fd2lkdGgpIHtcbiAgICB2YXIgZG9jLCBvYmosIHNldHRpbmcsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICBvd25lcjogdXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNldHRpbmcpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDogKFxuICAgICAgICAgIG9iaiA9IHt9LFxuICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuY29sdW1uX3dpZHRoXCJdID0gY29sdW1uX3dpZHRoLFxuICAgICAgICAgIG9ialxuICAgICAgICApXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jID0ge1xuICAgICAgICB0eXBlOiBcInVzZXJcIixcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgICBzZXR0aW5nczoge30sXG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH07XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoO1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYyk7XG4gICAgfVxuICB9LFxuICBcImdyaWRfc2V0dGluZ3NcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoLCBzb3J0KSB7XG4gICAgdmFyIGRvYywgb2JqLCBvYmoxLCByZWYsIHJlZjEsIHNldHRpbmcsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCIsXG4gICAgICBvd25lcjogdXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNldHRpbmcpIHtcbiAgICAgIGNvbHVtbl93aWR0aC5faWRfYWN0aW9ucyA9ICgocmVmID0gc2V0dGluZy5zZXR0aW5nc1tcIlwiICsgbGlzdF92aWV3X2lkXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmNvbHVtbl93aWR0aCkgIT0gbnVsbCA/IHJlZjEuX2lkX2FjdGlvbnMgOiB2b2lkIDAgOiB2b2lkIDApID09PSA0NiA/IDQ3IDogNDY7XG4gICAgICBpZiAoc29ydCkge1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IChcbiAgICAgICAgICAgIG9iaiA9IHt9LFxuICAgICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5zb3J0XCJdID0gc29ydCxcbiAgICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuY29sdW1uX3dpZHRoXCJdID0gY29sdW1uX3dpZHRoLFxuICAgICAgICAgICAgb2JqXG4gICAgICAgICAgKVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDogKFxuICAgICAgICAgICAgb2JqMSA9IHt9LFxuICAgICAgICAgICAgb2JqMVtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuY29sdW1uX3dpZHRoXCJdID0gY29sdW1uX3dpZHRoLFxuICAgICAgICAgICAgb2JqMVxuICAgICAgICAgIClcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYyA9IHtcbiAgICAgICAgdHlwZTogXCJ1c2VyXCIsXG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIixcbiAgICAgICAgc2V0dGluZ3M6IHt9LFxuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aDtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0O1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYyk7XG4gICAgfVxuICB9XG59KTtcbiIsInhtbDJqcyA9IHJlcXVpcmUgJ3htbDJqcydcbmZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbm1rZGlycCA9IHJlcXVpcmUgJ21rZGlycCdcblxubG9nZ2VyID0gbmV3IExvZ2dlciAnRXhwb3J0X1RPX1hNTCdcblxuX3dyaXRlWG1sRmlsZSA9IChqc29uT2JqLG9iak5hbWUpIC0+XG5cdCMg6L2seG1sXG5cdGJ1aWxkZXIgPSBuZXcgeG1sMmpzLkJ1aWxkZXIoKVxuXHR4bWwgPSBidWlsZGVyLmJ1aWxkT2JqZWN0IGpzb25PYmpcblxuXHQjIOi9rOS4umJ1ZmZlclxuXHRzdHJlYW0gPSBuZXcgQnVmZmVyIHhtbFxuXG5cdCMg5qC55o2u5b2T5aSp5pe26Ze055qE5bm05pyI5pel5L2c5Li65a2Y5YKo6Lev5b6EXG5cdG5vdyA9IG5ldyBEYXRlXG5cdHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuXHRtb250aCA9IG5vdy5nZXRNb250aCgpICsgMVxuXHRkYXkgPSBub3cuZ2V0RGF0ZSgpXG5cblx0IyDmlofku7bot6/lvoRcblx0ZmlsZVBhdGggPSBwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCcuLi8uLi8uLi9leHBvcnQvJyArIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGRheSArICcvJyArIG9iak5hbWUgKVxuXHRmaWxlTmFtZSA9IGpzb25PYmo/Ll9pZCArIFwiLnhtbFwiXG5cdGZpbGVBZGRyZXNzID0gcGF0aC5qb2luIGZpbGVQYXRoLCBmaWxlTmFtZVxuXG5cdGlmICFmcy5leGlzdHNTeW5jIGZpbGVQYXRoXG5cdFx0bWtkaXJwLnN5bmMgZmlsZVBhdGhcblxuXHQjIOWGmeWFpeaWh+S7tlxuXHRmcy53cml0ZUZpbGUgZmlsZUFkZHJlc3MsIHN0cmVhbSwgKGVycikgLT5cblx0XHRpZiBlcnJcblx0XHRcdGxvZ2dlci5lcnJvciBcIiN7anNvbk9iai5faWR95YaZ5YWleG1s5paH5Lu25aSx6LSlXCIsZXJyXG5cdFxuXHRyZXR1cm4gZmlsZVBhdGhcblxuXG4jIOaVtOeQhkZpZWxkc+eahGpzb27mlbDmja5cbl9taXhGaWVsZHNEYXRhID0gKG9iaixvYmpOYW1lKSAtPlxuXHQjIOWIneWni+WMluWvueixoeaVsOaNrlxuXHRqc29uT2JqID0ge31cblx0IyDojrflj5ZmaWVsZHNcblx0b2JqRmllbGRzID0gQ3JlYXRvcj8uZ2V0T2JqZWN0KG9iak5hbWUpPy5maWVsZHNcblxuXHRtaXhEZWZhdWx0ID0gKGZpZWxkX25hbWUpLT5cblx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gb2JqW2ZpZWxkX25hbWVdIHx8IFwiXCJcblxuXHRtaXhEYXRlID0gKGZpZWxkX25hbWUsdHlwZSktPlxuXHRcdGRhdGUgPSBvYmpbZmllbGRfbmFtZV1cblx0XHRpZiB0eXBlID09IFwiZGF0ZVwiXG5cdFx0XHRmb3JtYXQgPSBcIllZWVktTU0tRERcIlxuXHRcdGVsc2Vcblx0XHRcdGZvcm1hdCA9IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiXG5cdFx0aWYgZGF0ZT8gYW5kIGZvcm1hdD9cblx0XHRcdGRhdGVTdHIgPSBtb21lbnQoZGF0ZSkuZm9ybWF0KGZvcm1hdClcblx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gZGF0ZVN0ciB8fCBcIlwiXG5cblx0bWl4Qm9vbCA9IChmaWVsZF9uYW1lKS0+XG5cdFx0aWYgb2JqW2ZpZWxkX25hbWVdID09IHRydWVcblx0XHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuaYr1wiXG5cdFx0ZWxzZSBpZiBvYmpbZmllbGRfbmFtZV0gPT0gZmFsc2Vcblx0XHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuWQplwiXG5cdFx0ZWxzZVxuXHRcdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IFwiXCJcblxuXHQjIOW+queOr+avj+S4qmZpZWxkcyzlubbliKTmlq3lj5blgLxcblx0Xy5lYWNoIG9iakZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0c3dpdGNoIGZpZWxkPy50eXBlXG5cdFx0XHR3aGVuIFwiZGF0ZVwiLFwiZGF0ZXRpbWVcIiB0aGVuIG1peERhdGUgZmllbGRfbmFtZSxmaWVsZC50eXBlXG5cdFx0XHR3aGVuIFwiYm9vbGVhblwiIHRoZW4gbWl4Qm9vbCBmaWVsZF9uYW1lXG5cdFx0XHRlbHNlIG1peERlZmF1bHQgZmllbGRfbmFtZVxuXG5cdHJldHVybiBqc29uT2JqXG5cbiMg6I635Y+W5a2Q6KGo5pW055CG5pWw5o2uXG5fbWl4UmVsYXRlZERhdGEgPSAob2JqLG9iak5hbWUpIC0+XG5cdCMg5Yid5aeL5YyW5a+56LGh5pWw5o2uXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IHt9XG5cblx0IyDojrflj5bnm7jlhbPooahcblx0cmVsYXRlZE9iak5hbWVzID0gQ3JlYXRvcj8uZ2V0QWxsUmVsYXRlZE9iamVjdHMgb2JqTmFtZVxuXG5cdCMg5b6q546v55u45YWz6KGoXG5cdHJlbGF0ZWRPYmpOYW1lcy5mb3JFYWNoIChyZWxhdGVkT2JqTmFtZSkgLT5cblx0XHQjIOavj+S4quihqOWumuS5ieS4gOS4quWvueixoeaVsOe7hFxuXHRcdHJlbGF0ZWRUYWJsZURhdGEgPSBbXVxuXG5cdFx0IyAq6K6+572u5YWz6IGU5pCc57Si5p+l6K+i55qE5a2X5q61XG5cdFx0IyDpmYTku7bnmoTlhbPogZTmkJzntKLlrZfmrrXmmK/lrprmrbvnmoRcblx0XHRpZiByZWxhdGVkT2JqTmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSBcInBhcmVudC5pZHNcIlxuXHRcdGVsc2Vcblx0XHRcdCMg6I635Y+WZmllbGRzXG5cdFx0XHRmaWVsZHMgPSBDcmVhdG9yPy5PYmplY3RzW3JlbGF0ZWRPYmpOYW1lXT8uZmllbGRzXG5cdFx0XHQjIOW+queOr+avj+S4qmZpZWxkLOaJvuWHunJlZmVyZW5jZV90b+eahOWFs+iBlOWtl+autVxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gXCJcIlxuXHRcdFx0Xy5lYWNoIGZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0XHRcdGlmIGZpZWxkPy5yZWZlcmVuY2VfdG8gPT0gb2JqTmFtZVxuXHRcdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IGZpZWxkX25hbWVcblxuXHRcdCMg5qC55o2u5om+5Ye655qE5YWz6IGU5a2X5q6177yM5p+l5a2Q6KGo5pWw5o2uXG5cdFx0aWYgcmVsYXRlZF9maWVsZF9uYW1lXG5cdFx0XHRyZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqTmFtZSlcblx0XHRcdCMg6I635Y+W5Yiw5omA5pyJ55qE5pWw5o2uXG5cdFx0XHRyZWxhdGVkUmVjb3JkTGlzdCA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoe1wiI3tyZWxhdGVkX2ZpZWxkX25hbWV9XCI6b2JqLl9pZH0pLmZldGNoKClcblx0XHRcdCMg5b6q546v5q+P5LiA5p2h5pWw5o2uXG5cdFx0XHRyZWxhdGVkUmVjb3JkTGlzdC5mb3JFYWNoIChyZWxhdGVkT2JqKS0+XG5cdFx0XHRcdCMg5pW05ZCIZmllbGRz5pWw5o2uXG5cdFx0XHRcdGZpZWxkc0RhdGEgPSBfbWl4RmllbGRzRGF0YSByZWxhdGVkT2JqLHJlbGF0ZWRPYmpOYW1lXG5cdFx0XHRcdCMg5oqK5LiA5p2h6K6w5b2V5o+S5YWl5Yiw5a+56LGh5pWw57uE5LitXG5cdFx0XHRcdHJlbGF0ZWRUYWJsZURhdGEucHVzaCBmaWVsZHNEYXRhXG5cblx0XHQjIOaKiuS4gOS4quWtkOihqOeahOaJgOacieaVsOaNruaPkuWFpeWIsHJlbGF0ZWRfb2JqZWN0c+S4re+8jOWGjeW+queOr+S4i+S4gOS4qlxuXHRcdHJlbGF0ZWRfb2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0gPSByZWxhdGVkVGFibGVEYXRhXG5cblx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xuXG4jIENyZWF0b3IuRXhwb3J0MnhtbCgpXG5DcmVhdG9yLkV4cG9ydDJ4bWwgPSAob2JqTmFtZSwgcmVjb3JkTGlzdCkgLT5cblx0bG9nZ2VyLmluZm8gXCJSdW4gQ3JlYXRvci5FeHBvcnQyeG1sXCJcblxuXHRjb25zb2xlLnRpbWUgXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIlxuXG5cdCMg5rWL6K+V5pWw5o2uXG5cdCMgb2JqTmFtZSA9IFwiYXJjaGl2ZV9yZWNvcmRzXCJcblxuXHQjIOafpeaJvuWvueixoeaVsOaNrlxuXHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iak5hbWUpXG5cdCMg5rWL6K+V5pWw5o2uXG5cdHJlY29yZExpc3QgPSBjb2xsZWN0aW9uLmZpbmQoe30pLmZldGNoKClcblxuXHRyZWNvcmRMaXN0LmZvckVhY2ggKHJlY29yZE9iaiktPlxuXHRcdGpzb25PYmogPSB7fVxuXHRcdGpzb25PYmouX2lkID0gcmVjb3JkT2JqLl9pZFxuXG5cdFx0IyDmlbTnkIbkuLvooajnmoRGaWVsZHPmlbDmja5cblx0XHRmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEgcmVjb3JkT2JqLG9iak5hbWVcblx0XHRqc29uT2JqW29iak5hbWVdID0gZmllbGRzRGF0YVxuXG5cdFx0IyDmlbTnkIbnm7jlhbPooajmlbDmja5cblx0XHRyZWxhdGVkX29iamVjdHMgPSBfbWl4UmVsYXRlZERhdGEgcmVjb3JkT2JqLG9iak5hbWVcblxuXHRcdGpzb25PYmpbXCJyZWxhdGVkX29iamVjdHNcIl0gPSByZWxhdGVkX29iamVjdHNcblxuXHRcdCMg6L2s5Li6eG1s5L+d5a2Y5paH5Lu2XG5cdFx0ZmlsZVBhdGggPSBfd3JpdGVYbWxGaWxlIGpzb25PYmosb2JqTmFtZVxuXG5cdGNvbnNvbGUudGltZUVuZCBcIkNyZWF0b3IuRXhwb3J0MnhtbFwiXG5cdHJldHVybiBmaWxlUGF0aCIsInZhciBfbWl4RmllbGRzRGF0YSwgX21peFJlbGF0ZWREYXRhLCBfd3JpdGVYbWxGaWxlLCBmcywgbG9nZ2VyLCBta2RpcnAsIHBhdGgsIHhtbDJqcztcblxueG1sMmpzID0gcmVxdWlyZSgneG1sMmpzJyk7XG5cbmZzID0gcmVxdWlyZSgnZnMnKTtcblxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxubWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJyk7XG5cbmxvZ2dlciA9IG5ldyBMb2dnZXIoJ0V4cG9ydF9UT19YTUwnKTtcblxuX3dyaXRlWG1sRmlsZSA9IGZ1bmN0aW9uKGpzb25PYmosIG9iak5hbWUpIHtcbiAgdmFyIGJ1aWxkZXIsIGRheSwgZmlsZUFkZHJlc3MsIGZpbGVOYW1lLCBmaWxlUGF0aCwgbW9udGgsIG5vdywgc3RyZWFtLCB4bWwsIHllYXI7XG4gIGJ1aWxkZXIgPSBuZXcgeG1sMmpzLkJ1aWxkZXIoKTtcbiAgeG1sID0gYnVpbGRlci5idWlsZE9iamVjdChqc29uT2JqKTtcbiAgc3RyZWFtID0gbmV3IEJ1ZmZlcih4bWwpO1xuICBub3cgPSBuZXcgRGF0ZTtcbiAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMTtcbiAgZGF5ID0gbm93LmdldERhdGUoKTtcbiAgZmlsZVBhdGggPSBwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCAnLi4vLi4vLi4vZXhwb3J0LycgKyB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBkYXkgKyAnLycgKyBvYmpOYW1lKTtcbiAgZmlsZU5hbWUgPSAoanNvbk9iaiAhPSBudWxsID8ganNvbk9iai5faWQgOiB2b2lkIDApICsgXCIueG1sXCI7XG4gIGZpbGVBZGRyZXNzID0gcGF0aC5qb2luKGZpbGVQYXRoLCBmaWxlTmFtZSk7XG4gIGlmICghZnMuZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcbiAgICBta2RpcnAuc3luYyhmaWxlUGF0aCk7XG4gIH1cbiAgZnMud3JpdGVGaWxlKGZpbGVBZGRyZXNzLCBzdHJlYW0sIGZ1bmN0aW9uKGVycikge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHJldHVybiBsb2dnZXIuZXJyb3IoanNvbk9iai5faWQgKyBcIuWGmeWFpXhtbOaWh+S7tuWksei0pVwiLCBlcnIpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmaWxlUGF0aDtcbn07XG5cbl9taXhGaWVsZHNEYXRhID0gZnVuY3Rpb24ob2JqLCBvYmpOYW1lKSB7XG4gIHZhciBqc29uT2JqLCBtaXhCb29sLCBtaXhEYXRlLCBtaXhEZWZhdWx0LCBvYmpGaWVsZHMsIHJlZjtcbiAganNvbk9iaiA9IHt9O1xuICBvYmpGaWVsZHMgPSB0eXBlb2YgQ3JlYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBDcmVhdG9yICE9PSBudWxsID8gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iak5hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgbWl4RGVmYXVsdCA9IGZ1bmN0aW9uKGZpZWxkX25hbWUpIHtcbiAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IG9ialtmaWVsZF9uYW1lXSB8fCBcIlwiO1xuICB9O1xuICBtaXhEYXRlID0gZnVuY3Rpb24oZmllbGRfbmFtZSwgdHlwZSkge1xuICAgIHZhciBkYXRlLCBkYXRlU3RyLCBmb3JtYXQ7XG4gICAgZGF0ZSA9IG9ialtmaWVsZF9uYW1lXTtcbiAgICBpZiAodHlwZSA9PT0gXCJkYXRlXCIpIHtcbiAgICAgIGZvcm1hdCA9IFwiWVlZWS1NTS1ERFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW06c3NcIjtcbiAgICB9XG4gICAgaWYgKChkYXRlICE9IG51bGwpICYmIChmb3JtYXQgIT0gbnVsbCkpIHtcbiAgICAgIGRhdGVTdHIgPSBtb21lbnQoZGF0ZSkuZm9ybWF0KGZvcm1hdCk7XG4gICAgfVxuICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gZGF0ZVN0ciB8fCBcIlwiO1xuICB9O1xuICBtaXhCb29sID0gZnVuY3Rpb24oZmllbGRfbmFtZSkge1xuICAgIGlmIChvYmpbZmllbGRfbmFtZV0gPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLmmK9cIjtcbiAgICB9IGVsc2UgaWYgKG9ialtmaWVsZF9uYW1lXSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLlkKZcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIlwiO1xuICAgIH1cbiAgfTtcbiAgXy5lYWNoKG9iakZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBzd2l0Y2ggKGZpZWxkICE9IG51bGwgPyBmaWVsZC50eXBlIDogdm9pZCAwKSB7XG4gICAgICBjYXNlIFwiZGF0ZVwiOlxuICAgICAgY2FzZSBcImRhdGV0aW1lXCI6XG4gICAgICAgIHJldHVybiBtaXhEYXRlKGZpZWxkX25hbWUsIGZpZWxkLnR5cGUpO1xuICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgcmV0dXJuIG1peEJvb2woZmllbGRfbmFtZSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbWl4RGVmYXVsdChmaWVsZF9uYW1lKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4ganNvbk9iajtcbn07XG5cbl9taXhSZWxhdGVkRGF0YSA9IGZ1bmN0aW9uKG9iaiwgb2JqTmFtZSkge1xuICB2YXIgcmVsYXRlZE9iak5hbWVzLCByZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IHt9O1xuICByZWxhdGVkT2JqTmFtZXMgPSB0eXBlb2YgQ3JlYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBDcmVhdG9yICE9PSBudWxsID8gQ3JlYXRvci5nZXRBbGxSZWxhdGVkT2JqZWN0cyhvYmpOYW1lKSA6IHZvaWQgMDtcbiAgcmVsYXRlZE9iak5hbWVzLmZvckVhY2goZnVuY3Rpb24ocmVsYXRlZE9iak5hbWUpIHtcbiAgICB2YXIgZmllbGRzLCBvYmoxLCByZWYsIHJlbGF0ZWRDb2xsZWN0aW9uLCByZWxhdGVkUmVjb3JkTGlzdCwgcmVsYXRlZFRhYmxlRGF0YSwgcmVsYXRlZF9maWVsZF9uYW1lO1xuICAgIHJlbGF0ZWRUYWJsZURhdGEgPSBbXTtcbiAgICBpZiAocmVsYXRlZE9iak5hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwicGFyZW50Lmlkc1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWVsZHMgPSB0eXBlb2YgQ3JlYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBDcmVhdG9yICE9PSBudWxsID8gKHJlZiA9IENyZWF0b3IuT2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0pICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gXCJcIjtcbiAgICAgIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgICAgIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnJlZmVyZW5jZV90byA6IHZvaWQgMCkgPT09IG9iak5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9maWVsZF9uYW1lID0gZmllbGRfbmFtZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChyZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgIHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmpOYW1lKTtcbiAgICAgIHJlbGF0ZWRSZWNvcmRMaXN0ID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZCgoXG4gICAgICAgIG9iajEgPSB7fSxcbiAgICAgICAgb2JqMVtcIlwiICsgcmVsYXRlZF9maWVsZF9uYW1lXSA9IG9iai5faWQsXG4gICAgICAgIG9iajFcbiAgICAgICkpLmZldGNoKCk7XG4gICAgICByZWxhdGVkUmVjb3JkTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHJlbGF0ZWRPYmopIHtcbiAgICAgICAgdmFyIGZpZWxkc0RhdGE7XG4gICAgICAgIGZpZWxkc0RhdGEgPSBfbWl4RmllbGRzRGF0YShyZWxhdGVkT2JqLCByZWxhdGVkT2JqTmFtZSk7XG4gICAgICAgIHJldHVybiByZWxhdGVkVGFibGVEYXRhLnB1c2goZmllbGRzRGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0gPSByZWxhdGVkVGFibGVEYXRhO1xuICB9KTtcbiAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbn07XG5cbkNyZWF0b3IuRXhwb3J0MnhtbCA9IGZ1bmN0aW9uKG9iak5hbWUsIHJlY29yZExpc3QpIHtcbiAgdmFyIGNvbGxlY3Rpb247XG4gIGxvZ2dlci5pbmZvKFwiUnVuIENyZWF0b3IuRXhwb3J0MnhtbFwiKTtcbiAgY29uc29sZS50aW1lKFwiQ3JlYXRvci5FeHBvcnQyeG1sXCIpO1xuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iak5hbWUpO1xuICByZWNvcmRMaXN0ID0gY29sbGVjdGlvbi5maW5kKHt9KS5mZXRjaCgpO1xuICByZWNvcmRMaXN0LmZvckVhY2goZnVuY3Rpb24ocmVjb3JkT2JqKSB7XG4gICAgdmFyIGZpZWxkc0RhdGEsIGZpbGVQYXRoLCBqc29uT2JqLCByZWxhdGVkX29iamVjdHM7XG4gICAganNvbk9iaiA9IHt9O1xuICAgIGpzb25PYmouX2lkID0gcmVjb3JkT2JqLl9pZDtcbiAgICBmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEocmVjb3JkT2JqLCBvYmpOYW1lKTtcbiAgICBqc29uT2JqW29iak5hbWVdID0gZmllbGRzRGF0YTtcbiAgICByZWxhdGVkX29iamVjdHMgPSBfbWl4UmVsYXRlZERhdGEocmVjb3JkT2JqLCBvYmpOYW1lKTtcbiAgICBqc29uT2JqW1wicmVsYXRlZF9vYmplY3RzXCJdID0gcmVsYXRlZF9vYmplY3RzO1xuICAgIHJldHVybiBmaWxlUGF0aCA9IF93cml0ZVhtbEZpbGUoanNvbk9iaiwgb2JqTmFtZSk7XG4gIH0pO1xuICBjb25zb2xlLnRpbWVFbmQoXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIik7XG4gIHJldHVybiBmaWxlUGF0aDtcbn07XG4iLCJNZXRlb3IubWV0aG9kcyBcblx0cmVsYXRlZF9vYmplY3RzX3JlY29yZHM6IChvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpLT5cblx0XHR1c2VySWQgPSB0aGlzLnVzZXJJZFxuXHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXG5cdFx0XHRzZWxlY3RvciA9IHtcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWR9XG5cdFx0ZWxzZVxuXHRcdFx0c2VsZWN0b3IgPSB7c3BhY2U6IHNwYWNlSWR9XG5cdFx0XG5cdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHQjIOmZhOS7tueahOWFs+iBlOaQnOe0ouadoeS7tuaYr+Wumuatu+eahFxuXHRcdFx0c2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lXG5cdFx0XHRzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXVxuXHRcdGVsc2Vcblx0XHRcdHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWRcblxuXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdFx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcblx0XHRcdHNlbGVjdG9yLm93bmVyID0gdXNlcklkXG5cdFx0XG5cdFx0cmVsYXRlZF9yZWNvcmRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpXG5cdFx0cmV0dXJuIHJlbGF0ZWRfcmVjb3Jkcy5jb3VudCgpIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICByZWxhdGVkX29iamVjdHNfcmVjb3JkczogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZUlkKSB7XG4gICAgdmFyIHBlcm1pc3Npb25zLCByZWxhdGVkX3JlY29yZHMsIHNlbGVjdG9yLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIikge1xuICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgIFwibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIikge1xuICAgICAgc2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lO1xuICAgICAgc2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWQ7XG4gICAgfVxuICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICAgIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMuYWxsb3dSZWFkKSB7XG4gICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZDtcbiAgICB9XG4gICAgcmVsYXRlZF9yZWNvcmRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpO1xuICAgIHJldHVybiByZWxhdGVkX3JlY29yZHMuY291bnQoKTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRnZXRQZW5kaW5nU3BhY2VJbmZvOiAoaW52aXRlcklkLCBzcGFjZUlkKS0+XG5cdFx0aW52aXRlck5hbWUgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IGludml0ZXJJZH0pLm5hbWVcblx0XHRzcGFjZU5hbWUgPSBkYi5zcGFjZXMuZmluZE9uZSh7X2lkOiBzcGFjZUlkfSkubmFtZVxuXG5cdFx0cmV0dXJuIHtpbnZpdGVyOiBpbnZpdGVyTmFtZSwgc3BhY2U6IHNwYWNlTmFtZX1cblxuXHRyZWZ1c2VKb2luU3BhY2U6IChfaWQpLT5cblx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IF9pZH0seyRzZXQ6IHtpbnZpdGVfc3RhdGU6IFwicmVmdXNlZFwifX0pXG5cblx0YWNjZXB0Sm9pblNwYWNlOiAoX2lkKS0+XG5cdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBfaWR9LHskc2V0OiB7aW52aXRlX3N0YXRlOiBcImFjY2VwdGVkXCIsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9fSlcblxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBnZXRQZW5kaW5nU3BhY2VJbmZvOiBmdW5jdGlvbihpbnZpdGVySWQsIHNwYWNlSWQpIHtcbiAgICB2YXIgaW52aXRlck5hbWUsIHNwYWNlTmFtZTtcbiAgICBpbnZpdGVyTmFtZSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBpbnZpdGVySWRcbiAgICB9KS5uYW1lO1xuICAgIHNwYWNlTmFtZSA9IGRiLnNwYWNlcy5maW5kT25lKHtcbiAgICAgIF9pZDogc3BhY2VJZFxuICAgIH0pLm5hbWU7XG4gICAgcmV0dXJuIHtcbiAgICAgIGludml0ZXI6IGludml0ZXJOYW1lLFxuICAgICAgc3BhY2U6IHNwYWNlTmFtZVxuICAgIH07XG4gIH0sXG4gIHJlZnVzZUpvaW5TcGFjZTogZnVuY3Rpb24oX2lkKSB7XG4gICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGludml0ZV9zdGF0ZTogXCJyZWZ1c2VkXCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgYWNjZXB0Sm9pblNwYWNlOiBmdW5jdGlvbihfaWQpIHtcbiAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IF9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgaW52aXRlX3N0YXRlOiBcImFjY2VwdGVkXCIsXG4gICAgICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IucHVibGlzaCBcImNyZWF0b3Jfb2JqZWN0X3JlY29yZFwiLCAob2JqZWN0X25hbWUsIGlkLCBzcGFjZV9pZCktPlxuXHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZClcblx0aWYgY29sbGVjdGlvblxuXHRcdHJldHVybiBjb2xsZWN0aW9uLmZpbmQoe19pZDogaWR9KVxuXG4iLCJNZXRlb3IucHVibGlzaChcImNyZWF0b3Jfb2JqZWN0X3JlY29yZFwiLCBmdW5jdGlvbihvYmplY3RfbmFtZSwgaWQsIHNwYWNlX2lkKSB7XG4gIHZhciBjb2xsZWN0aW9uO1xuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCk7XG4gIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICBfaWQ6IGlkXG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUgXCJzdGVlZG9zX29iamVjdF90YWJ1bGFyXCIsICh0YWJsZU5hbWUsIGlkcywgZmllbGRzLCBzcGFjZUlkKS0+XG5cdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRjaGVjayh0YWJsZU5hbWUsIFN0cmluZyk7XG5cdGNoZWNrKGlkcywgQXJyYXkpO1xuXHRjaGVjayhmaWVsZHMsIE1hdGNoLk9wdGlvbmFsKE9iamVjdCkpO1xuXG5cdF9vYmplY3RfbmFtZSA9IHRhYmxlTmFtZS5yZXBsYWNlKFwiY3JlYXRvcl9cIixcIlwiKVxuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX29iamVjdF9uYW1lLCBzcGFjZUlkKVxuXG5cdGlmIHNwYWNlSWRcblx0XHRfb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldE9iamVjdE5hbWUoX29iamVjdClcblxuXHRvYmplY3RfY29sbGVjaXRvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihfb2JqZWN0X25hbWUpXG5cblxuXHRfZmllbGRzID0gX29iamVjdD8uZmllbGRzXG5cdGlmICFfZmllbGRzIHx8ICFvYmplY3RfY29sbGVjaXRvblxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRyZWZlcmVuY2VfZmllbGRzID0gXy5maWx0ZXIgX2ZpZWxkcywgKGYpLT5cblx0XHRyZXR1cm4gXy5pc0Z1bmN0aW9uKGYucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KGYucmVmZXJlbmNlX3RvKVxuXG5cdHNlbGYgPSB0aGlzXG5cblx0c2VsZi51bmJsb2NrKCk7XG5cblx0aWYgcmVmZXJlbmNlX2ZpZWxkcy5sZW5ndGggPiAwXG5cdFx0ZGF0YSA9IHtcblx0XHRcdGZpbmQ6ICgpLT5cblx0XHRcdFx0c2VsZi51bmJsb2NrKCk7XG5cdFx0XHRcdGZpZWxkX2tleXMgPSB7fVxuXHRcdFx0XHRfLmVhY2ggXy5rZXlzKGZpZWxkcyksIChmKS0+XG5cdFx0XHRcdFx0dW5sZXNzIC9cXHcrKFxcLlxcJCl7MX1cXHc/Ly50ZXN0KGYpXG5cdFx0XHRcdFx0XHRmaWVsZF9rZXlzW2ZdID0gMVxuXHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe19pZDogeyRpbjogaWRzfX0sIHtmaWVsZHM6IGZpZWxkX2tleXN9KTtcblx0XHR9XG5cblx0XHRkYXRhLmNoaWxkcmVuID0gW11cblxuXHRcdGtleXMgPSBfLmtleXMoZmllbGRzKVxuXG5cdFx0aWYga2V5cy5sZW5ndGggPCAxXG5cdFx0XHRrZXlzID0gXy5rZXlzKF9maWVsZHMpXG5cblx0XHRfa2V5cyA9IFtdXG5cblx0XHRrZXlzLmZvckVhY2ggKGtleSktPlxuXHRcdFx0aWYgX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXVxuXHRcdFx0XHRfa2V5cyA9IF9rZXlzLmNvbmNhdChfLm1hcChfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddLCAoayktPlxuXHRcdFx0XHRcdHJldHVybiBrZXkgKyAnLicgKyBrXG5cdFx0XHRcdCkpXG5cdFx0XHRfa2V5cy5wdXNoKGtleSlcblxuXHRcdF9rZXlzLmZvckVhY2ggKGtleSktPlxuXHRcdFx0cmVmZXJlbmNlX2ZpZWxkID0gX2ZpZWxkc1trZXldXG5cblx0XHRcdGlmIHJlZmVyZW5jZV9maWVsZCAmJiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykpICAjIGFuZCBDcmVhdG9yLkNvbGxlY3Rpb25zW3JlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG9dXG5cdFx0XHRcdGRhdGEuY2hpbGRyZW4ucHVzaCB7XG5cdFx0XHRcdFx0ZmluZDogKHBhcmVudCkgLT5cblx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRzZWxmLnVuYmxvY2soKTtcblxuXHRcdFx0XHRcdFx0XHRxdWVyeSA9IHt9XG5cblx0XHRcdFx0XHRcdFx0IyDooajmoLzlrZDlrZfmrrXnibnmrorlpITnkIZcblx0XHRcdFx0XHRcdFx0aWYgL1xcdysoXFwuXFwkXFwuKXsxfVxcdysvLnRlc3Qoa2V5KVxuXHRcdFx0XHRcdFx0XHRcdHBfayA9IGtleS5yZXBsYWNlKC8oXFx3KylcXC5cXCRcXC5cXHcrL2lnLCBcIiQxXCIpXG5cdFx0XHRcdFx0XHRcdFx0c19rID0ga2V5LnJlcGxhY2UoL1xcdytcXC5cXCRcXC4oXFx3KykvaWcsIFwiJDFcIilcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfaWRzID0gcGFyZW50W3Bfa10uZ2V0UHJvcGVydHkoc19rKVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX2lkcyA9IGtleS5zcGxpdCgnLicpLnJlZHVjZSAobywgeCkgLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0bz9beF1cblx0XHRcdFx0XHRcdFx0XHQsIHBhcmVudFxuXG5cdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG9cblxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90bygpXG5cblx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KHJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRpZiBfLmlzT2JqZWN0KHJlZmVyZW5jZV9pZHMpICYmICFfLmlzQXJyYXkocmVmZXJlbmNlX2lkcylcblx0XHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9pZHMub1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX2lkcyA9IHJlZmVyZW5jZV9pZHMuaWRzIHx8IFtdXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFtdXG5cblx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpXG5cdFx0XHRcdFx0XHRcdFx0cXVlcnkuX2lkID0geyRpbjogcmVmZXJlbmNlX2lkc31cblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHJlZmVyZW5jZV9pZHNcblxuXHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG9fb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxuXG5cdFx0XHRcdFx0XHRcdG5hbWVfZmllbGRfa2V5ID0gcmVmZXJlbmNlX3RvX29iamVjdC5OQU1FX0ZJRUxEX0tFWVxuXG5cdFx0XHRcdFx0XHRcdGNoaWxkcmVuX2ZpZWxkcyA9IHtfaWQ6IDEsIHNwYWNlOiAxfVxuXG5cdFx0XHRcdFx0XHRcdGlmIG5hbWVfZmllbGRfa2V5XG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW5fZmllbGRzW25hbWVfZmllbGRfa2V5XSA9IDFcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZChxdWVyeSwge1xuXHRcdFx0XHRcdFx0XHRcdGZpZWxkczogY2hpbGRyZW5fZmllbGRzXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhyZWZlcmVuY2VfdG8sIHBhcmVudCwgZSlcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFtdXG5cdFx0XHRcdH1cblxuXHRcdHJldHVybiBkYXRhXG5cdGVsc2Vcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZmluZDogKCktPlxuXHRcdFx0XHRzZWxmLnVuYmxvY2soKTtcblx0XHRcdFx0cmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe19pZDogeyRpbjogaWRzfX0sIHtmaWVsZHM6IGZpZWxkc30pXG5cdFx0fTtcblxuIiwiTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUoXCJzdGVlZG9zX29iamVjdF90YWJ1bGFyXCIsIGZ1bmN0aW9uKHRhYmxlTmFtZSwgaWRzLCBmaWVsZHMsIHNwYWNlSWQpIHtcbiAgdmFyIF9maWVsZHMsIF9rZXlzLCBfb2JqZWN0LCBfb2JqZWN0X25hbWUsIGRhdGEsIGtleXMsIG9iamVjdF9jb2xsZWNpdG9uLCByZWZlcmVuY2VfZmllbGRzLCBzZWxmO1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBjaGVjayh0YWJsZU5hbWUsIFN0cmluZyk7XG4gIGNoZWNrKGlkcywgQXJyYXkpO1xuICBjaGVjayhmaWVsZHMsIE1hdGNoLk9wdGlvbmFsKE9iamVjdCkpO1xuICBfb2JqZWN0X25hbWUgPSB0YWJsZU5hbWUucmVwbGFjZShcImNyZWF0b3JfXCIsIFwiXCIpO1xuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX29iamVjdF9uYW1lLCBzcGFjZUlkKTtcbiAgaWYgKHNwYWNlSWQpIHtcbiAgICBfb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldE9iamVjdE5hbWUoX29iamVjdCk7XG4gIH1cbiAgb2JqZWN0X2NvbGxlY2l0b24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oX29iamVjdF9uYW1lKTtcbiAgX2ZpZWxkcyA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZmllbGRzIDogdm9pZCAwO1xuICBpZiAoIV9maWVsZHMgfHwgIW9iamVjdF9jb2xsZWNpdG9uKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZWZlcmVuY2VfZmllbGRzID0gXy5maWx0ZXIoX2ZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgIHJldHVybiBfLmlzRnVuY3Rpb24oZi5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkoZi5yZWZlcmVuY2VfdG8pO1xuICB9KTtcbiAgc2VsZiA9IHRoaXM7XG4gIHNlbGYudW5ibG9jaygpO1xuICBpZiAocmVmZXJlbmNlX2ZpZWxkcy5sZW5ndGggPiAwKSB7XG4gICAgZGF0YSA9IHtcbiAgICAgIGZpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZmllbGRfa2V5cztcbiAgICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICAgIGZpZWxkX2tleXMgPSB7fTtcbiAgICAgICAgXy5lYWNoKF8ua2V5cyhmaWVsZHMpLCBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgaWYgKCEvXFx3KyhcXC5cXCQpezF9XFx3Py8udGVzdChmKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkX2tleXNbZl0gPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtcbiAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICRpbjogaWRzXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBmaWVsZF9rZXlzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgZGF0YS5jaGlsZHJlbiA9IFtdO1xuICAgIGtleXMgPSBfLmtleXMoZmllbGRzKTtcbiAgICBpZiAoa2V5cy5sZW5ndGggPCAxKSB7XG4gICAgICBrZXlzID0gXy5rZXlzKF9maWVsZHMpO1xuICAgIH1cbiAgICBfa2V5cyA9IFtdO1xuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmIChfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddKSB7XG4gICAgICAgIF9rZXlzID0gX2tleXMuY29uY2F0KF8ubWFwKF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ10sIGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICByZXR1cm4ga2V5ICsgJy4nICsgaztcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9rZXlzLnB1c2goa2V5KTtcbiAgICB9KTtcbiAgICBfa2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIHJlZmVyZW5jZV9maWVsZDtcbiAgICAgIHJlZmVyZW5jZV9maWVsZCA9IF9maWVsZHNba2V5XTtcbiAgICAgIGlmIChyZWZlcmVuY2VfZmllbGQgJiYgKF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pKSkge1xuICAgICAgICByZXR1cm4gZGF0YS5jaGlsZHJlbi5wdXNoKHtcbiAgICAgICAgICBmaW5kOiBmdW5jdGlvbihwYXJlbnQpIHtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbl9maWVsZHMsIGUsIG5hbWVfZmllbGRfa2V5LCBwX2ssIHF1ZXJ5LCByZWZlcmVuY2VfaWRzLCByZWZlcmVuY2VfdG8sIHJlZmVyZW5jZV90b19vYmplY3QsIHNfaztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHNlbGYudW5ibG9jaygpO1xuICAgICAgICAgICAgICBxdWVyeSA9IHt9O1xuICAgICAgICAgICAgICBpZiAoL1xcdysoXFwuXFwkXFwuKXsxfVxcdysvLnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgIHBfayA9IGtleS5yZXBsYWNlKC8oXFx3KylcXC5cXCRcXC5cXHcrL2lnLCBcIiQxXCIpO1xuICAgICAgICAgICAgICAgIHNfayA9IGtleS5yZXBsYWNlKC9cXHcrXFwuXFwkXFwuKFxcdyspL2lnLCBcIiQxXCIpO1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZV9pZHMgPSBwYXJlbnRbcF9rXS5nZXRQcm9wZXJ0eShzX2spO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZV9pZHMgPSBrZXkuc3BsaXQoJy4nKS5yZWR1Y2UoZnVuY3Rpb24obywgeCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIG8gIT0gbnVsbCA/IG9beF0gOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgfSwgcGFyZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8oKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChyZWZlcmVuY2VfaWRzKSAmJiAhXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpKSB7XG4gICAgICAgICAgICAgICAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfaWRzLm87XG4gICAgICAgICAgICAgICAgICByZWZlcmVuY2VfaWRzID0gcmVmZXJlbmNlX2lkcy5pZHMgfHwgW107XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKF8uaXNBcnJheShyZWZlcmVuY2VfaWRzKSkge1xuICAgICAgICAgICAgICAgIHF1ZXJ5Ll9pZCA9IHtcbiAgICAgICAgICAgICAgICAgICRpbjogcmVmZXJlbmNlX2lkc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcXVlcnkuX2lkID0gcmVmZXJlbmNlX2lkcztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWZlcmVuY2VfdG9fb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVmZXJlbmNlX3RvLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgbmFtZV9maWVsZF9rZXkgPSByZWZlcmVuY2VfdG9fb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICAgICAgICAgICAgICBjaGlsZHJlbl9maWVsZHMgPSB7XG4gICAgICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgICAgIHNwYWNlOiAxXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGlmIChuYW1lX2ZpZWxkX2tleSkge1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuX2ZpZWxkc1tuYW1lX2ZpZWxkX2tleV0gPSAxO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kKHF1ZXJ5LCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiBjaGlsZHJlbl9maWVsZHNcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlZmVyZW5jZV90bywgcGFyZW50LCBlKTtcbiAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLnVuYmxvY2soKTtcbiAgICAgICAgcmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe1xuICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgJGluOiBpZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoIFwib2JqZWN0X2xpc3R2aWV3c1wiLCAob2JqZWN0X25hbWUsIHNwYWNlSWQpLT5cbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc3BhY2U6IHNwYWNlSWQgLFwiJG9yXCI6W3tvd25lcjogdXNlcklkfSwge3NoYXJlZDogdHJ1ZX1dfSkiLCJNZXRlb3IucHVibGlzaCBcInVzZXJfdGFidWxhcl9zZXR0aW5nc1wiLCAob2JqZWN0X25hbWUpLT5cbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmQoe29iamVjdF9uYW1lOiB7JGluOiBvYmplY3RfbmFtZX0sIHJlY29yZF9pZDogeyRpbjogW1wib2JqZWN0X2xpc3R2aWV3c1wiLCBcIm9iamVjdF9ncmlkdmlld3NcIl19LCBvd25lcjogdXNlcklkfSlcbiIsIk1ldGVvci5wdWJsaXNoIFwicmVsYXRlZF9vYmplY3RzX3JlY29yZHNcIiwgKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCktPlxuXHR1c2VySWQgPSB0aGlzLnVzZXJJZFxuXHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIlxuXHRcdHNlbGVjdG9yID0ge1wibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZH1cblx0ZWxzZVxuXHRcdHNlbGVjdG9yID0ge3NwYWNlOiBzcGFjZUlkfVxuXHRcblx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0IyDpmYTku7bnmoTlhbPogZTmkJzntKLmnaHku7bmmK/lrprmrbvnmoRcblx0XHRzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWVcblx0XHRzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXVxuXHRlbHNlXG5cdFx0c2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZFxuXG5cdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMuYWxsb3dSZWFkXG5cdFx0c2VsZWN0b3Iub3duZXIgPSB1c2VySWRcblx0XG5cdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3RvcikiLCJNZXRlb3IucHVibGlzaChcInJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzXCIsIGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCkge1xuICB2YXIgcGVybWlzc2lvbnMsIHNlbGVjdG9yLCB1c2VySWQ7XG4gIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiKSB7XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWRcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9O1xuICB9XG4gIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgc2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lO1xuICAgIHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdO1xuICB9IGVsc2Uge1xuICAgIHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWQ7XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMuYWxsb3dSZWFkKSB7XG4gICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gIH1cbiAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ3NwYWNlX3VzZXJfaW5mbycsIChzcGFjZUlkLCB1c2VySWQpLT5cblx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9KSIsIlxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cblx0TWV0ZW9yLnB1Ymxpc2ggJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJywgKHNwYWNlSWQpLT5cblxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdFx0dW5sZXNzIHNwYWNlSWRcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRcdHNlbGVjdG9yID1cblx0XHRcdHNwYWNlOiBzcGFjZUlkXG5cdFx0XHRrZXk6ICdjb250YWN0c192aWV3X2xpbWl0cydcblxuXHRcdHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKSIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBzZWxlY3RvcjtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBrZXk6ICdjb250YWN0c192aWV3X2xpbWl0cydcbiAgICB9O1xuICAgIHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKTtcbiAgfSk7XG59XG4iLCJcbmlmIE1ldGVvci5pc1NlcnZlclxuXG5cdE1ldGVvci5wdWJsaXNoICdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycycsIChzcGFjZUlkKS0+XG5cblx0XHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRcdHVubGVzcyBzcGFjZUlkXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0XHRzZWxlY3RvciA9XG5cdFx0XHRzcGFjZTogc3BhY2VJZFxuXHRcdFx0a2V5OiAnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnXG5cblx0XHRyZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3RvcikiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAga2V5OiAnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnXG4gICAgfTtcbiAgICByZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3Rvcik7XG4gIH0pO1xufVxuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG5cdE1ldGVvci5wdWJsaXNoICdzcGFjZV9uZWVkX3RvX2NvbmZpcm0nLCAoKS0+XG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcblx0XHRyZXR1cm4gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdXNlcklkLCBpbnZpdGVfc3RhdGU6IFwicGVuZGluZ1wifSkiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdzcGFjZV9uZWVkX3RvX2NvbmZpcm0nLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIGludml0ZV9zdGF0ZTogXCJwZW5kaW5nXCJcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJwZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9XG5cbnBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3dQZXJtaXNzaW9ucyA9IChmbG93X2lkLCB1c2VyX2lkKSAtPlxuXHQjIOagueaNrjpmbG93X2lk5p+l5Yiw5a+55bqU55qEZmxvd1xuXHRmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpXG5cdHNwYWNlX2lkID0gZmxvdy5zcGFjZVxuXHQjIOagueaNrnNwYWNlX2lk5ZKMOnVzZXJfaWTliLBvcmdhbml6YXRpb25z6KGo5Lit5p+l5Yiw55So5oi35omA5bGe5omA5pyJ55qEb3JnX2lk77yI5YyF5ous5LiK57qn57uESUTvvIlcblx0b3JnX2lkcyA9IG5ldyBBcnJheVxuXHRvcmdhbml6YXRpb25zID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcblx0XHRzcGFjZTogc3BhY2VfaWQsIHVzZXJzOiB1c2VyX2lkIH0sIHsgZmllbGRzOiB7IHBhcmVudHM6IDEgfSB9KS5mZXRjaCgpXG5cdF8uZWFjaChvcmdhbml6YXRpb25zLCAob3JnKSAtPlxuXHRcdG9yZ19pZHMucHVzaChvcmcuX2lkKVxuXHRcdGlmIG9yZy5wYXJlbnRzXG5cdFx0XHRfLmVhY2gob3JnLnBhcmVudHMsIChwYXJlbnRfaWQpIC0+XG5cdFx0XHRcdG9yZ19pZHMucHVzaChwYXJlbnRfaWQpXG5cdFx0XHQpXG5cdClcblx0b3JnX2lkcyA9IF8udW5pcShvcmdfaWRzKVxuXHRteV9wZXJtaXNzaW9ucyA9IG5ldyBBcnJheVxuXHRpZiBmbG93LnBlcm1zXG5cdFx0IyDliKTmlq1mbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbuS4reaYr+WQpuWMheWQq+W9k+WJjeeUqOaIt++8jFxuXHRcdCMg5oiW6ICFZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGTmmK/lkKbljIXlkKs05q2l5b6X5Yiw55qEb3JnX2lk5pWw57uE5Lit55qE5Lu75L2V5LiA5Liq77yMXG5cdFx0IyDoi6XmmK/vvIzliJnlnKjov5Tlm57nmoTmlbDnu4TkuK3liqDkuIphZGRcblx0XHRpZiBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGRcblx0XHRcdHVzZXJzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGRcblx0XHRcdGlmIHVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcl9pZClcblx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKVxuXG5cdFx0aWYgZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGRcblx0XHRcdG9yZ3NfY2FuX2FkZCA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRkXG5cdFx0XHRfLmVhY2gob3JnX2lkcywgKG9yZ19pZCkgLT5cblx0XHRcdFx0aWYgb3Jnc19jYW5fYWRkLmluY2x1ZGVzKG9yZ19pZClcblx0XHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpXG5cdFx0XHQpXG5cdFx0IyDliKTmlq1mbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9y5Lit5piv5ZCm5YyF5ZCr5b2T5YmN55So5oi377yMXG5cdFx0IyDmiJbogIVmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3LmmK/lkKbljIXlkKs05q2l5b6X5Yiw55qEb3JnX2lk5pWw57uE5Lit55qE5Lu75L2V5LiA5Liq77yMXG5cdFx0IyDoi6XmmK/vvIzliJnlnKjov5Tlm57nmoTmlbDnu4TkuK3liqDkuIptb25pdG9yXG5cdFx0aWYgZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvclxuXHRcdFx0dXNlcnNfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yXG5cdFx0XHRpZiB1c2Vyc19jYW5fbW9uaXRvci5pbmNsdWRlcyh1c2VyX2lkKVxuXHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKVxuXG5cdFx0aWYgZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yXG5cdFx0XHRvcmdzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yXG5cdFx0XHRfLmVhY2gob3JnX2lkcywgKG9yZ19pZCkgLT5cblx0XHRcdFx0aWYgb3Jnc19jYW5fbW9uaXRvci5pbmNsdWRlcyhvcmdfaWQpXG5cdFx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIilcblx0XHRcdClcblx0XHQjIOWIpOaWrWZsb3cucGVybXMudXNlcnNfY2FuX2FkbWlu5Lit5piv5ZCm5YyF5ZCr5b2T5YmN55So5oi377yMXG5cdFx0IyDmiJbogIVmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWlu5piv5ZCm5YyF5ZCrNOatpeW+l+WIsOeahG9yZ19pZOaVsOe7hOS4reeahOS7u+S9leS4gOS4qu+8jFxuXHRcdCMg6Iul5piv77yM5YiZ5Zyo6L+U5Zue55qE5pWw57uE5Lit5Yqg5LiKYWRtaW5cblx0XHRpZiBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pblxuXHRcdFx0dXNlcnNfY2FuX2FkbWluID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW5cblx0XHRcdGlmIHVzZXJzX2Nhbl9hZG1pbi5pbmNsdWRlcyh1c2VyX2lkKVxuXHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIilcblxuXHRcdGlmIGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW5cblx0XHRcdG9yZ3NfY2FuX2FkbWluID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pblxuXHRcdFx0Xy5lYWNoKG9yZ19pZHMsIChvcmdfaWQpIC0+XG5cdFx0XHRcdGlmIG9yZ3NfY2FuX2FkbWluLmluY2x1ZGVzKG9yZ19pZClcblx0XHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIilcblx0XHRcdClcblxuXHRteV9wZXJtaXNzaW9ucyA9IF8udW5pcShteV9wZXJtaXNzaW9ucylcblx0cmV0dXJuIG15X3Blcm1pc3Npb25zIiwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5wZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9O1xuXG5wZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93UGVybWlzc2lvbnMgPSBmdW5jdGlvbihmbG93X2lkLCB1c2VyX2lkKSB7XG4gIHZhciBmbG93LCBteV9wZXJtaXNzaW9ucywgb3JnX2lkcywgb3JnYW5pemF0aW9ucywgb3Jnc19jYW5fYWRkLCBvcmdzX2Nhbl9hZG1pbiwgb3Jnc19jYW5fbW9uaXRvciwgc3BhY2VfaWQsIHVzZXJzX2Nhbl9hZGQsIHVzZXJzX2Nhbl9hZG1pbiwgdXNlcnNfY2FuX21vbml0b3I7XG4gIGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZCk7XG4gIHNwYWNlX2lkID0gZmxvdy5zcGFjZTtcbiAgb3JnX2lkcyA9IG5ldyBBcnJheTtcbiAgb3JnYW5pemF0aW9ucyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHVzZXJzOiB1c2VyX2lkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHBhcmVudHM6IDFcbiAgICB9XG4gIH0pLmZldGNoKCk7XG4gIF8uZWFjaChvcmdhbml6YXRpb25zLCBmdW5jdGlvbihvcmcpIHtcbiAgICBvcmdfaWRzLnB1c2gob3JnLl9pZCk7XG4gICAgaWYgKG9yZy5wYXJlbnRzKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKG9yZy5wYXJlbnRzLCBmdW5jdGlvbihwYXJlbnRfaWQpIHtcbiAgICAgICAgcmV0dXJuIG9yZ19pZHMucHVzaChwYXJlbnRfaWQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgb3JnX2lkcyA9IF8udW5pcShvcmdfaWRzKTtcbiAgbXlfcGVybWlzc2lvbnMgPSBuZXcgQXJyYXk7XG4gIGlmIChmbG93LnBlcm1zKSB7XG4gICAgaWYgKGZsb3cucGVybXMudXNlcnNfY2FuX2FkZCkge1xuICAgICAgdXNlcnNfY2FuX2FkZCA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkZDtcbiAgICAgIGlmICh1c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJfaWQpKSB7XG4gICAgICAgIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZGRcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZCkge1xuICAgICAgb3Jnc19jYW5fYWRkID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGQ7XG4gICAgICBfLmVhY2gob3JnX2lkcywgZnVuY3Rpb24ob3JnX2lkKSB7XG4gICAgICAgIGlmIChvcmdzX2Nhbl9hZGQuaW5jbHVkZXMob3JnX2lkKSkge1xuICAgICAgICAgIHJldHVybiBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3IpIHtcbiAgICAgIHVzZXJzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvcjtcbiAgICAgIGlmICh1c2Vyc19jYW5fbW9uaXRvci5pbmNsdWRlcyh1c2VyX2lkKSkge1xuICAgICAgICBteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvcikge1xuICAgICAgb3Jnc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvcjtcbiAgICAgIF8uZWFjaChvcmdfaWRzLCBmdW5jdGlvbihvcmdfaWQpIHtcbiAgICAgICAgaWYgKG9yZ3NfY2FuX21vbml0b3IuaW5jbHVkZXMob3JnX2lkKSkge1xuICAgICAgICAgIHJldHVybiBteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbikge1xuICAgICAgdXNlcnNfY2FuX2FkbWluID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW47XG4gICAgICBpZiAodXNlcnNfY2FuX2FkbWluLmluY2x1ZGVzKHVzZXJfaWQpKSB7XG4gICAgICAgIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW4pIHtcbiAgICAgIG9yZ3NfY2FuX2FkbWluID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pbjtcbiAgICAgIF8uZWFjaChvcmdfaWRzLCBmdW5jdGlvbihvcmdfaWQpIHtcbiAgICAgICAgaWYgKG9yZ3NfY2FuX2FkbWluLmluY2x1ZGVzKG9yZ19pZCkpIHtcbiAgICAgICAgICByZXR1cm4gbXlfcGVybWlzc2lvbnMucHVzaChcImFkbWluXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgbXlfcGVybWlzc2lvbnMgPSBfLnVuaXEobXlfcGVybWlzc2lvbnMpO1xuICByZXR1cm4gbXlfcGVybWlzc2lvbnM7XG59O1xuIiwiX2V2YWwgPSByZXF1aXJlKCdldmFsJylcbm9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcblxuZ2V0T2JqZWN0Q29uZmlnID0gKG9iamVjdEFwaU5hbWUpIC0+XG5cdHJldHVybiBvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkudG9Db25maWcoKVxuXG5nZXRPYmplY3ROYW1lRmllbGRLZXkgPSAob2JqZWN0QXBpTmFtZSkgLT5cblx0cmV0dXJuIG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS5OQU1FX0ZJRUxEX0tFWVxuXG5nZXRSZWxhdGVkcyA9IChvYmplY3RBcGlOYW1lKSAtPlxuXHRyZXR1cm4gTWV0ZW9yLndyYXBBc3luYygob2JqZWN0QXBpTmFtZSwgY2IpIC0+XG5cdFx0b2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLmdldFJlbGF0ZWRzKCkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuXHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxuXHRcdCkob2JqZWN0QXBpTmFtZSlcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbiA9IChyZXEpIC0+XG5cdHF1ZXJ5ID0gcmVxLnF1ZXJ5XG5cdHVzZXJJZCA9IHF1ZXJ5W1wiWC1Vc2VyLUlkXCJdXG5cdGF1dGhUb2tlbiA9IHF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0aWYgbm90IHVzZXJJZCBvciBub3QgYXV0aFRva2VuXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG5cblx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxuXHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcblx0XHRfaWQ6IHVzZXJJZCxcblx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuXG5cdGlmIG5vdCB1c2VyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG5cblx0cmV0dXJuIHVzZXJcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZSA9IChzcGFjZV9pZCkgLT5cblx0c3BhY2UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxuXHRpZiBub3Qgc3BhY2Vcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInNwYWNlX2lk5pyJ6K+v5oiW5q2kc3BhY2Xlt7Lnu4/ooqvliKDpmaRcIilcblx0cmV0dXJuIHNwYWNlXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyA9IChmbG93X2lkKSAtPlxuXHRmbG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5mbG93cy5maW5kT25lKGZsb3dfaWQpXG5cdGlmIG5vdCBmbG93XG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJpZOacieivr+aIluatpOa1geeoi+W3sue7j+iiq+WIoOmZpFwiKVxuXHRyZXR1cm4gZmxvd1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlciA9IChzcGFjZV9pZCwgdXNlcl9pZCkgLT5cblx0c3BhY2VfdXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc3BhY2VfdXNlcnMuZmluZE9uZSh7IHNwYWNlOiBzcGFjZV9pZCwgdXNlcjogdXNlcl9pZCB9KVxuXHRpZiBub3Qgc3BhY2VfdXNlclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwidXNlcl9pZOWvueW6lOeahOeUqOaIt+S4jeWxnuS6juW9k+WJjXNwYWNlXCIpXG5cdHJldHVybiBzcGFjZV91c2VyXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyA9IChzcGFjZV91c2VyKSAtPlxuXHRpbmZvID0gbmV3IE9iamVjdFxuXHRpbmZvLm9yZ2FuaXphdGlvbiA9IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uXG5cdG9yZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub3JnYW5pemF0aW9ucy5maW5kT25lKHNwYWNlX3VzZXIub3JnYW5pemF0aW9uLCB7IGZpZWxkczogeyBuYW1lOiAxICwgZnVsbG5hbWU6IDEgfSB9KVxuXHRpbmZvLm9yZ2FuaXphdGlvbl9uYW1lID0gb3JnLm5hbWVcblx0aW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBvcmcuZnVsbG5hbWVcblx0cmV0dXJuIGluZm9cblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dFbmFibGVkID0gKGZsb3cpIC0+XG5cdGlmIGZsb3cuc3RhdGUgaXNudCBcImVuYWJsZWRcIlxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5pyq5ZCv55SoLOaTjeS9nOWksei0pVwiKVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZCA9IChmbG93LCBzcGFjZV9pZCkgLT5cblx0aWYgZmxvdy5zcGFjZSBpc250IHNwYWNlX2lkXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvlkozlt6XkvZzljLpJROS4jeWMuemFjVwiKVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZvcm0gPSAoZm9ybV9pZCkgLT5cblx0Zm9ybSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZm9ybXMuZmluZE9uZShmb3JtX2lkKVxuXHRpZiBub3QgZm9ybVxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsICfooajljZVJROacieivr+aIluatpOihqOWNleW3sue7j+iiq+WIoOmZpCcpXG5cblx0cmV0dXJuIGZvcm1cblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeSA9IChjYXRlZ29yeV9pZCkgLT5cblx0cmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuY2F0ZWdvcmllcy5maW5kT25lKGNhdGVnb3J5X2lkKVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNyZWF0ZV9pbnN0YW5jZSA9IChpbnN0YW5jZV9mcm9tX2NsaWVudCwgdXNlcl9pbmZvKSAtPlxuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSwgU3RyaW5nXG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0sIFN0cmluZ1xuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl0sIFN0cmluZ1xuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl0sIFt7bzogU3RyaW5nLCBpZHM6IFtTdHJpbmddfV1cblxuXHQjIOagoemqjOaYr+WQpnJlY29yZOW3sue7j+WPkei1t+eahOeUs+ivt+i/mOWcqOWuoeaJueS4rVxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVswXSwgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSlcblxuXHRzcGFjZV9pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl1cblx0Zmxvd19pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXVxuXHR1c2VyX2lkID0gdXNlcl9pbmZvLl9pZFxuXHQjIOiOt+WPluWJjeWPsOaJgOS8oOeahHRyYWNlXG5cdHRyYWNlX2Zyb21fY2xpZW50ID0gbnVsbFxuXHQjIOiOt+WPluWJjeWPsOaJgOS8oOeahGFwcHJvdmVcblx0YXBwcm92ZV9mcm9tX2NsaWVudCA9IG51bGxcblx0aWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl0gYW5kIGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdXG5cdFx0dHJhY2VfZnJvbV9jbGllbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXVxuXHRcdGlmIHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl0gYW5kIHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl1bMF1cblx0XHRcdGFwcHJvdmVfZnJvbV9jbGllbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXVtcImFwcHJvdmVzXCJdWzBdXG5cblx0IyDojrflj5bkuIDkuKpzcGFjZVxuXHRzcGFjZSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2Uoc3BhY2VfaWQpXG5cdCMg6I635Y+W5LiA5LiqZmxvd1xuXHRmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpXG5cdCMg6I635Y+W5LiA5Liqc3BhY2XkuIvnmoTkuIDkuKp1c2VyXG5cdHNwYWNlX3VzZXIgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlcihzcGFjZV9pZCwgdXNlcl9pZClcblx0IyDojrflj5ZzcGFjZV91c2Vy5omA5Zyo55qE6YOo6Zeo5L+h5oGvXG5cdHNwYWNlX3VzZXJfb3JnX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8oc3BhY2VfdXNlcilcblx0IyDliKTmlq3kuIDkuKpmbG935piv5ZCm5Li65ZCv55So54q25oCBXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZChmbG93KVxuXHQjIOWIpOaWreS4gOS4qmZsb3flkoxzcGFjZV9pZOaYr+WQpuWMuemFjVxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZChmbG93LCBzcGFjZV9pZClcblxuXHRmb3JtID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtKGZsb3cuZm9ybSlcblxuXHRwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93X2lkLCB1c2VyX2lkKVxuXG5cdGlmIG5vdCBwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkZFwiKVxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5b2T5YmN55So5oi35rKh5pyJ5q2k5rWB56iL55qE5paw5bu65p2D6ZmQXCIpXG5cblx0bm93ID0gbmV3IERhdGVcblx0aW5zX29iaiA9IHt9XG5cdGluc19vYmouX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuX21ha2VOZXdJRCgpXG5cdGluc19vYmouc3BhY2UgPSBzcGFjZV9pZFxuXHRpbnNfb2JqLmZsb3cgPSBmbG93X2lkXG5cdGluc19vYmouZmxvd192ZXJzaW9uID0gZmxvdy5jdXJyZW50Ll9pZFxuXHRpbnNfb2JqLmZvcm0gPSBmbG93LmZvcm1cblx0aW5zX29iai5mb3JtX3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuZm9ybV92ZXJzaW9uXG5cdGluc19vYmoubmFtZSA9IGZsb3cubmFtZVxuXHRpbnNfb2JqLnN1Ym1pdHRlciA9IHVzZXJfaWRcblx0aW5zX29iai5zdWJtaXR0ZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lXG5cdGluc19vYmouYXBwbGljYW50ID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSBlbHNlIHVzZXJfaWRcblx0aW5zX29iai5hcHBsaWNhbnRfbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIGVsc2UgdXNlcl9pbmZvLm5hbWVcblx0aW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdIGVsc2Ugc3BhY2VfdXNlci5vcmdhbml6YXRpb25cblx0aW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdIGVsc2Ugc3BhY2VfdXNlcl9vcmdfaW5mby5vcmdhbml6YXRpb25fbmFtZVxuXHRpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gZWxzZSAgc3BhY2VfdXNlcl9vcmdfaW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWVcblx0aW5zX29iai5hcHBsaWNhbnRfY29tcGFueSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdIGVsc2Ugc3BhY2VfdXNlci5jb21wYW55X2lkXG5cdGluc19vYmouc3RhdGUgPSAnZHJhZnQnXG5cdGluc19vYmouY29kZSA9ICcnXG5cdGluc19vYmouaXNfYXJjaGl2ZWQgPSBmYWxzZVxuXHRpbnNfb2JqLmlzX2RlbGV0ZWQgPSBmYWxzZVxuXHRpbnNfb2JqLmNyZWF0ZWQgPSBub3dcblx0aW5zX29iai5jcmVhdGVkX2J5ID0gdXNlcl9pZFxuXHRpbnNfb2JqLm1vZGlmaWVkID0gbm93XG5cdGluc19vYmoubW9kaWZpZWRfYnkgPSB1c2VyX2lkXG5cdGluc19vYmoudmFsdWVzID0gbmV3IE9iamVjdFxuXG5cdGluc19vYmoucmVjb3JkX2lkcyA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVxuXG5cdGlmIHNwYWNlX3VzZXIuY29tcGFueV9pZFxuXHRcdGluc19vYmouY29tcGFueV9pZCA9IHNwYWNlX3VzZXIuY29tcGFueV9pZFxuXG5cdCMg5paw5bu6VHJhY2Vcblx0dHJhY2Vfb2JqID0ge31cblx0dHJhY2Vfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHJcblx0dHJhY2Vfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWRcblx0dHJhY2Vfb2JqLmlzX2ZpbmlzaGVkID0gZmFsc2Vcblx0IyDlvZPliY3mnIDmlrDniYhmbG935Lit5byA5aeL6IqC54K5XG5cdHN0YXJ0X3N0ZXAgPSBfLmZpbmQoZmxvdy5jdXJyZW50LnN0ZXBzLCAoc3RlcCkgLT5cblx0XHRyZXR1cm4gc3RlcC5zdGVwX3R5cGUgaXMgJ3N0YXJ0J1xuXHQpXG5cdHRyYWNlX29iai5zdGVwID0gc3RhcnRfc3RlcC5faWRcblx0dHJhY2Vfb2JqLm5hbWUgPSBzdGFydF9zdGVwLm5hbWVcblxuXHR0cmFjZV9vYmouc3RhcnRfZGF0ZSA9IG5vd1xuXHQjIOaWsOW7ukFwcHJvdmVcblx0YXBwcl9vYmogPSB7fVxuXHRhcHByX29iai5faWQgPSBuZXcgTW9uZ28uT2JqZWN0SUQoKS5fc3RyXG5cdGFwcHJfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWRcblx0YXBwcl9vYmoudHJhY2UgPSB0cmFjZV9vYmouX2lkXG5cdGFwcHJfb2JqLmlzX2ZpbmlzaGVkID0gZmFsc2Vcblx0YXBwcl9vYmoudXNlciA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gZWxzZSB1c2VyX2lkXG5cdGFwcHJfb2JqLnVzZXJfbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIGVsc2UgdXNlcl9pbmZvLm5hbWVcblx0YXBwcl9vYmouaGFuZGxlciA9IHVzZXJfaWRcblx0YXBwcl9vYmouaGFuZGxlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWVcblx0YXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvblxuXHRhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9uYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5uYW1lXG5cdGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5mdWxsbmFtZVxuXHRhcHByX29iai50eXBlID0gJ2RyYWZ0J1xuXHRhcHByX29iai5zdGFydF9kYXRlID0gbm93XG5cdGFwcHJfb2JqLnJlYWRfZGF0ZSA9IG5vd1xuXHRhcHByX29iai5pc19yZWFkID0gdHJ1ZVxuXHRhcHByX29iai5pc19lcnJvciA9IGZhbHNlXG5cdGFwcHJfb2JqLmRlc2NyaXB0aW9uID0gJydcblx0cmVsYXRlZFRhYmxlc0luZm8gPSB7fVxuXHRhcHByX29iai52YWx1ZXMgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlVmFsdWVzKGluc19vYmoucmVjb3JkX2lkc1swXSwgZmxvd19pZCwgc3BhY2VfaWQsIGZvcm0uY3VycmVudC5maWVsZHMsIHJlbGF0ZWRUYWJsZXNJbmZvKVxuXG5cdHRyYWNlX29iai5hcHByb3ZlcyA9IFthcHByX29ial1cblx0aW5zX29iai50cmFjZXMgPSBbdHJhY2Vfb2JqXVxuXG5cdGluc19vYmouaW5ib3hfdXNlcnMgPSBpbnN0YW5jZV9mcm9tX2NsaWVudC5pbmJveF91c2VycyB8fCBbXVxuXG5cdGluc19vYmouY3VycmVudF9zdGVwX25hbWUgPSBzdGFydF9zdGVwLm5hbWVcblxuXHRpZiBmbG93LmF1dG9fcmVtaW5kIGlzIHRydWVcblx0XHRpbnNfb2JqLmF1dG9fcmVtaW5kID0gdHJ1ZVxuXG5cdCMg5paw5bu655Sz6K+35Y2V5pe277yMaW5zdGFuY2Vz6K6w5b2V5rWB56iL5ZCN56ew44CB5rWB56iL5YiG57G75ZCN56ewICMxMzEzXG5cdGluc19vYmouZmxvd19uYW1lID0gZmxvdy5uYW1lXG5cdGlmIGZvcm0uY2F0ZWdvcnlcblx0XHRjYXRlZ29yeSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Q2F0ZWdvcnkoZm9ybS5jYXRlZ29yeSlcblx0XHRpZiBjYXRlZ29yeVxuXHRcdFx0aW5zX29iai5jYXRlZ29yeV9uYW1lID0gY2F0ZWdvcnkubmFtZVxuXHRcdFx0aW5zX29iai5jYXRlZ29yeSA9IGNhdGVnb3J5Ll9pZFxuXG5cdG5ld19pbnNfaWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5pbnNlcnQoaW5zX29iailcblxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvKGluc19vYmoucmVjb3JkX2lkc1swXSwgbmV3X2luc19pZCwgc3BhY2VfaWQpXG5cblx0IyB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyhyZWxhdGVkVGFibGVzSW5mbywgbmV3X2luc19pZCwgc3BhY2VfaWQpXG5cblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZUF0dGFjaChpbnNfb2JqLnJlY29yZF9pZHNbMF0sIHNwYWNlX2lkLCBpbnNfb2JqLl9pZCwgYXBwcl9vYmouX2lkKVxuXG5cdHJldHVybiBuZXdfaW5zX2lkXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMgPSAocmVjb3JkSWRzLCBmbG93SWQsIHNwYWNlSWQsIGZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pIC0+XG5cdGZpZWxkQ29kZXMgPSBbXVxuXHRfLmVhY2ggZmllbGRzLCAoZikgLT5cblx0XHRpZiBmLnR5cGUgPT0gJ3NlY3Rpb24nXG5cdFx0XHRfLmVhY2ggZi5maWVsZHMsIChmZikgLT5cblx0XHRcdFx0ZmllbGRDb2Rlcy5wdXNoIGZmLmNvZGVcblx0XHRlbHNlXG5cdFx0XHRmaWVsZENvZGVzLnB1c2ggZi5jb2RlXG5cblx0dmFsdWVzID0ge31cblx0b2JqZWN0TmFtZSA9IHJlY29yZElkcy5vXG5cdG9iamVjdCA9IGdldE9iamVjdENvbmZpZyhvYmplY3ROYW1lKVxuXHRyZWNvcmRJZCA9IHJlY29yZElkcy5pZHNbMF1cblx0b3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XG5cdFx0b2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXG5cdFx0Zmxvd19pZDogZmxvd0lkXG5cdH0pXG5cdHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKHJlY29yZElkKVxuXHRmbG93ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoZmxvd0lkLCB7IGZpZWxkczogeyBmb3JtOiAxIH0gfSlcblx0aWYgb3cgYW5kIHJlY29yZFxuXHRcdGZvcm0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJmb3Jtc1wiKS5maW5kT25lKGZsb3cuZm9ybSlcblx0XHRmb3JtRmllbGRzID0gZm9ybS5jdXJyZW50LmZpZWxkcyB8fCBbXVxuXHRcdHJlbGF0ZWRPYmplY3RzID0gZ2V0UmVsYXRlZHMob2JqZWN0TmFtZSlcblx0XHRyZWxhdGVkT2JqZWN0c0tleXMgPSBfLnBsdWNrKHJlbGF0ZWRPYmplY3RzLCAnb2JqZWN0X25hbWUnKVxuXHRcdGZvcm1UYWJsZUZpZWxkcyA9IF8uZmlsdGVyIGZvcm1GaWVsZHMsIChmb3JtRmllbGQpIC0+XG5cdFx0XHRyZXR1cm4gZm9ybUZpZWxkLnR5cGUgPT0gJ3RhYmxlJ1xuXHRcdGZvcm1UYWJsZUZpZWxkc0NvZGUgPSBfLnBsdWNrKGZvcm1UYWJsZUZpZWxkcywgJ2NvZGUnKVxuXG5cdFx0Z2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSA9ICAoa2V5KSAtPlxuXHRcdFx0cmV0dXJuIF8uZmluZCByZWxhdGVkT2JqZWN0c0tleXMsICAocmVsYXRlZE9iamVjdHNLZXkpIC0+XG5cdFx0XHRcdHJldHVybiBrZXkuc3RhcnRzV2l0aChyZWxhdGVkT2JqZWN0c0tleSArICcuJylcblxuXHRcdGdldEZvcm1UYWJsZUZpZWxkQ29kZSA9IChrZXkpIC0+XG5cdFx0XHRyZXR1cm4gXy5maW5kIGZvcm1UYWJsZUZpZWxkc0NvZGUsICAoZm9ybVRhYmxlRmllbGRDb2RlKSAtPlxuXHRcdFx0XHRyZXR1cm4ga2V5LnN0YXJ0c1dpdGgoZm9ybVRhYmxlRmllbGRDb2RlICsgJy4nKVxuXG5cdFx0Z2V0Rm9ybVRhYmxlRmllbGQgPSAoa2V5KSAtPlxuXHRcdFx0cmV0dXJuIF8uZmluZCBmb3JtVGFibGVGaWVsZHMsICAoZikgLT5cblx0XHRcdFx0cmV0dXJuIGYuY29kZSA9PSBrZXlcblxuXHRcdGdldEZvcm1GaWVsZCA9IChrZXkpIC0+XG5cdFx0XHRmZiA9IG51bGxcblx0XHRcdF8uZm9yRWFjaCBmb3JtRmllbGRzLCAoZikgLT5cblx0XHRcdFx0aWYgZmZcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0aWYgZi50eXBlID09ICdzZWN0aW9uJ1xuXHRcdFx0XHRcdGZmID0gXy5maW5kIGYuZmllbGRzLCAgKHNmKSAtPlxuXHRcdFx0XHRcdFx0cmV0dXJuIHNmLmNvZGUgPT0ga2V5XG5cdFx0XHRcdGVsc2UgaWYgZi5jb2RlID09IGtleVxuXHRcdFx0XHRcdGZmID0gZlxuXG5cdFx0XHRyZXR1cm4gZmZcblxuXHRcdGdldEZvcm1UYWJsZVN1YkZpZWxkID0gKHRhYmxlRmllbGQsIHN1YkZpZWxkQ29kZSkgLT5cblx0XHRcdHJldHVybiBfLmZpbmQgdGFibGVGaWVsZC5maWVsZHMsICAoZikgLT5cblx0XHRcdFx0cmV0dXJuIGYuY29kZSA9PSBzdWJGaWVsZENvZGVcblxuXHRcdGdldEZpZWxkT2RhdGFWYWx1ZSA9IChvYmpOYW1lLCBpZCkgLT5cblx0XHRcdG9iaiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKVxuXHRcdFx0bmFtZUtleSA9IGdldE9iamVjdE5hbWVGaWVsZEtleShvYmpOYW1lKVxuXHRcdFx0aWYgIW9ialxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIF8uaXNTdHJpbmcgaWRcblx0XHRcdFx0X3JlY29yZCA9IG9iai5maW5kT25lKGlkKVxuXHRcdFx0XHRpZiBfcmVjb3JkXG5cdFx0XHRcdFx0X3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkW25hbWVLZXldXG5cdFx0XHRcdFx0cmV0dXJuIF9yZWNvcmRcblx0XHRcdGVsc2UgaWYgXy5pc0FycmF5IGlkXG5cdFx0XHRcdF9yZWNvcmRzID0gW11cblx0XHRcdFx0b2JqLmZpbmQoeyBfaWQ6IHsgJGluOiBpZCB9IH0pLmZvckVhY2ggKF9yZWNvcmQpIC0+XG5cdFx0XHRcdFx0X3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkW25hbWVLZXldXG5cdFx0XHRcdFx0X3JlY29yZHMucHVzaCBfcmVjb3JkXG5cblx0XHRcdFx0aWYgIV8uaXNFbXB0eSBfcmVjb3Jkc1xuXHRcdFx0XHRcdHJldHVybiBfcmVjb3Jkc1xuXHRcdFx0cmV0dXJuXG5cblx0XHRnZXRTZWxlY3RVc2VyVmFsdWUgPSAodXNlcklkLCBzcGFjZUlkKSAtPlxuXHRcdFx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSlcblx0XHRcdHN1LmlkID0gdXNlcklkXG5cdFx0XHRyZXR1cm4gc3VcblxuXHRcdGdldFNlbGVjdFVzZXJWYWx1ZXMgPSAodXNlcklkcywgc3BhY2VJZCkgLT5cblx0XHRcdHN1cyA9IFtdXG5cdFx0XHRpZiBfLmlzQXJyYXkgdXNlcklkc1xuXHRcdFx0XHRfLmVhY2ggdXNlcklkcywgKHVzZXJJZCkgLT5cblx0XHRcdFx0XHRzdSA9IGdldFNlbGVjdFVzZXJWYWx1ZSh1c2VySWQsIHNwYWNlSWQpXG5cdFx0XHRcdFx0aWYgc3Vcblx0XHRcdFx0XHRcdHN1cy5wdXNoKHN1KVxuXHRcdFx0cmV0dXJuIHN1c1xuXG5cdFx0Z2V0U2VsZWN0T3JnVmFsdWUgPSAob3JnSWQsIHNwYWNlSWQpIC0+XG5cdFx0XHRvcmcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kT25lKG9yZ0lkLCB7IGZpZWxkczogeyBfaWQ6IDEsIG5hbWU6IDEsIGZ1bGxuYW1lOiAxIH0gfSlcblx0XHRcdG9yZy5pZCA9IG9yZ0lkXG5cdFx0XHRyZXR1cm4gb3JnXG5cblx0XHRnZXRTZWxlY3RPcmdWYWx1ZXMgPSAob3JnSWRzLCBzcGFjZUlkKSAtPlxuXHRcdFx0b3JncyA9IFtdXG5cdFx0XHRpZiBfLmlzQXJyYXkgb3JnSWRzXG5cdFx0XHRcdF8uZWFjaCBvcmdJZHMsIChvcmdJZCkgLT5cblx0XHRcdFx0XHRvcmcgPSBnZXRTZWxlY3RPcmdWYWx1ZShvcmdJZCwgc3BhY2VJZClcblx0XHRcdFx0XHRpZiBvcmdcblx0XHRcdFx0XHRcdG9yZ3MucHVzaChvcmcpXG5cdFx0XHRyZXR1cm4gb3Jnc1xuXG5cdFx0dGFibGVGaWVsZENvZGVzID0gW11cblx0XHR0YWJsZUZpZWxkTWFwID0gW11cblx0XHR0YWJsZVRvUmVsYXRlZE1hcCA9IHt9XG5cblx0XHRvdy5maWVsZF9tYXA/LmZvckVhY2ggKGZtKSAtPlxuXHRcdFx0b2JqZWN0X2ZpZWxkID0gZm0ub2JqZWN0X2ZpZWxkXG5cdFx0XHR3b3JrZmxvd19maWVsZCA9IGZtLndvcmtmbG93X2ZpZWxkXG5cdFx0XHRpZiAhb2JqZWN0X2ZpZWxkIHx8ICF3b3JrZmxvd19maWVsZFxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ+acquaJvuWIsOWtl+aute+8jOivt+ajgOafpeWvueixoea1geeoi+aYoOWwhOWtl+autemFjee9ricpXG5cdFx0XHRyZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZShvYmplY3RfZmllbGQpXG5cdFx0XHRmb3JtVGFibGVGaWVsZENvZGUgPSBnZXRGb3JtVGFibGVGaWVsZENvZGUod29ya2Zsb3dfZmllbGQpXG5cdFx0XHRvYmpGaWVsZCA9IG9iamVjdC5maWVsZHNbb2JqZWN0X2ZpZWxkXVxuXHRcdFx0Zm9ybUZpZWxkID0gZ2V0Rm9ybUZpZWxkKHdvcmtmbG93X2ZpZWxkKVxuXHRcdFx0IyDlpITnkIblrZDooajlrZfmrrVcblx0XHRcdGlmIHJlbGF0ZWRPYmplY3RGaWVsZENvZGVcblx0XHRcdFx0XG5cdFx0XHRcdG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXVxuXHRcdFx0XHRvVGFibGVGaWVsZENvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXVxuXHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcEtleSA9IG9UYWJsZUNvZGVcblx0XHRcdFx0aWYgIXRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVxuXHRcdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSA9IHt9XG5cblx0XHRcdFx0aWYgZm9ybVRhYmxlRmllbGRDb2RlXG5cdFx0XHRcdFx0d1RhYmxlQ29kZSA9IHdvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMF1cblx0XHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bJ19GUk9NX1RBQkxFX0NPREUnXSA9IHdUYWJsZUNvZGVcblxuXHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bb1RhYmxlRmllbGRDb2RlXSA9IHdvcmtmbG93X2ZpZWxkXG5cdFx0XHQjIOWIpOaWreaYr+WQpuaYr+ihqOagvOWtl+autVxuXHRcdFx0ZWxzZSBpZiB3b3JrZmxvd19maWVsZC5pbmRleE9mKCcuJykgPiAwIGFuZCBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPiAwXG5cdFx0XHRcdHdUYWJsZUNvZGUgPSB3b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdXG5cdFx0XHRcdG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzBdXG5cdFx0XHRcdGlmIHJlY29yZC5oYXNPd25Qcm9wZXJ0eShvVGFibGVDb2RlKSBhbmQgXy5pc0FycmF5KHJlY29yZFtvVGFibGVDb2RlXSlcblx0XHRcdFx0XHR0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XG5cdFx0XHRcdFx0XHR3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxuXHRcdFx0XHRcdFx0b2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcblx0XHRcdFx0XHR9KSlcblx0XHRcdFx0XHR0YWJsZUZpZWxkTWFwLnB1c2goZm0pXG5cdFx0XHRcdGVsc2UgaWYgb1RhYmxlQ29kZS5pbmRleE9mKCcuJykgPiAwICMg6K+05piO5piv5YWz6IGU6KGo55qEZ3JpZOWtl+autVxuXHRcdFx0XHRcdG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZENvZGUgPSBvVGFibGVDb2RlLnNwbGl0KCcuJylbMF07XG5cdFx0XHRcdFx0Z3JpZENvZGUgPSBvVGFibGVDb2RlLnNwbGl0KCcuJylbMV07XG5cdFx0XHRcdFx0b1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkID0gb2JqZWN0LmZpZWxkc1tvVGFibGVDb2RlUmVmZXJlbmNlRmllbGRDb2RlXTtcblx0XHRcdFx0XHRpZiBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRpZiByZWNvcmRbb1RhYmxlQ29kZV1cblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnJlZmVyZW5jZV90bztcblx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQubmFtZV07XG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0RvYyA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSk7XG5cdFx0XHRcdFx0XHRpZiByZWZlcmVuY2VUb0RvY1tncmlkQ29kZV1cblx0XHRcdFx0XHRcdFx0cmVjb3JkW29UYWJsZUNvZGVdID0gcmVmZXJlbmNlVG9Eb2NbZ3JpZENvZGVdO1xuXHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XG5cdFx0XHRcdFx0XHRcdFx0d29ya2Zsb3dfdGFibGVfZmllbGRfY29kZTogd1RhYmxlQ29kZSxcblx0XHRcdFx0XHRcdFx0XHRvYmplY3RfdGFibGVfZmllbGRfY29kZTogb1RhYmxlQ29kZVxuXHRcdFx0XHRcdFx0XHR9KSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0YWJsZUZpZWxkTWFwLnB1c2goZm0pO1xuXG5cdFx0XHQjIOWkhOeQhmxvb2t1cOOAgW1hc3Rlcl9kZXRhaWznsbvlnovlrZfmrrVcblx0XHRcdGVsc2UgaWYgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4nKSA+IDAgYW5kIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA9PSAtMVxuXHRcdFx0XHRvYmplY3RGaWVsZE5hbWUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXVxuXHRcdFx0XHRsb29rdXBGaWVsZE5hbWUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXVxuXHRcdFx0XHRpZiBvYmplY3Rcblx0XHRcdFx0XHRvYmplY3RGaWVsZCA9IG9iamVjdC5maWVsZHNbb2JqZWN0RmllbGROYW1lXVxuXHRcdFx0XHRcdGlmIG9iamVjdEZpZWxkICYmIGZvcm1GaWVsZCAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqZWN0RmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRmaWVsZHNPYmogPSB7fVxuXHRcdFx0XHRcdFx0ZmllbGRzT2JqW2xvb2t1cEZpZWxkTmFtZV0gPSAxXG5cdFx0XHRcdFx0XHRsb29rdXBPYmplY3RSZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kT25lKHJlY29yZFtvYmplY3RGaWVsZE5hbWVdLCB7IGZpZWxkczogZmllbGRzT2JqIH0pXG5cdFx0XHRcdFx0XHRvYmplY3RGaWVsZE9iamVjdE5hbWUgPSBvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0XHRcdGxvb2t1cEZpZWxkT2JqID0gZ2V0T2JqZWN0Q29uZmlnKG9iamVjdEZpZWxkT2JqZWN0TmFtZSlcblx0XHRcdFx0XHRcdG9iamVjdExvb2t1cEZpZWxkID0gbG9va3VwRmllbGRPYmouZmllbGRzW2xvb2t1cEZpZWxkTmFtZV1cblx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IGxvb2t1cE9iamVjdFJlY29yZFtsb29rdXBGaWVsZE5hbWVdXG5cdFx0XHRcdFx0XHRpZiBvYmplY3RMb29rdXBGaWVsZCAmJiBmb3JtRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqZWN0TG9va3VwRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWVcblx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmICFvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gb2RhdGFGaWVsZFZhbHVlXG5cdFx0XHRcdFx0XHRlbHNlIGlmIG9iamVjdExvb2t1cEZpZWxkICYmIGZvcm1GaWVsZCAmJiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iamVjdExvb2t1cEZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0aWYgIV8uaXNFbXB0eShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0bG9va3VwU2VsZWN0RmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0XHRcdGlmIGZvcm1GaWVsZC50eXBlID09ICd1c2VyJ1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIW9iamVjdExvb2t1cEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQudHlwZSA9PSAnZ3JvdXAnXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmICFvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdFx0aWYgbG9va3VwU2VsZWN0RmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IGxvb2t1cFNlbGVjdEZpZWxkVmFsdWVcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IGxvb2t1cE9iamVjdFJlY29yZFtsb29rdXBGaWVsZE5hbWVdXG5cblx0XHRcdCMgbG9va3Vw44CBbWFzdGVyX2RldGFpbOWtl+auteWQjOatpeWIsG9kYXRh5a2X5q61XG5cdFx0XHRlbHNlIGlmIGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iakZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqRmllbGQucmVmZXJlbmNlX3RvXG5cdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvYmpGaWVsZC5uYW1lXVxuXHRcdFx0XHRvZGF0YUZpZWxkVmFsdWVcblx0XHRcdFx0aWYgb2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRlbHNlIGlmICFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gb2RhdGFGaWVsZFZhbHVlXG5cdFx0XHRlbHNlIGlmIGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iakZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKG9iakZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdXG5cdFx0XHRcdGlmICFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWVcblx0XHRcdFx0XHRpZiBmb3JtRmllbGQudHlwZSA9PSAndXNlcidcblx0XHRcdFx0XHRcdGlmIG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRlbHNlIGlmICFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkLnR5cGUgPT0gJ2dyb3VwJ1xuXHRcdFx0XHRcdFx0aWYgb2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAhb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdGlmIHNlbGVjdEZpZWxkVmFsdWVcblx0XHRcdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBzZWxlY3RGaWVsZFZhbHVlXG5cdFx0XHRlbHNlIGlmIHJlY29yZC5oYXNPd25Qcm9wZXJ0eShvYmplY3RfZmllbGQpXG5cdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSByZWNvcmRbb2JqZWN0X2ZpZWxkXVxuXG5cdFx0IyDooajmoLzlrZfmrrVcblx0XHRfLnVuaXEodGFibGVGaWVsZENvZGVzKS5mb3JFYWNoICh0ZmMpIC0+XG5cdFx0XHRjID0gSlNPTi5wYXJzZSh0ZmMpXG5cdFx0XHR2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXSA9IFtdXG5cdFx0XHRyZWNvcmRbYy5vYmplY3RfdGFibGVfZmllbGRfY29kZV0uZm9yRWFjaCAodHIpIC0+XG5cdFx0XHRcdG5ld1RyID0ge31cblx0XHRcdFx0Xy5lYWNoIHRyLCAodiwgaykgLT5cblx0XHRcdFx0XHR0YWJsZUZpZWxkTWFwLmZvckVhY2ggKHRmbSkgLT5cblx0XHRcdFx0XHRcdGlmIHRmbS5vYmplY3RfZmllbGQgaXMgKGMub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGUgKyAnLiQuJyArIGspXG5cdFx0XHRcdFx0XHRcdHdUZENvZGUgPSB0Zm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVsxXVxuXHRcdFx0XHRcdFx0XHRuZXdUclt3VGRDb2RlXSA9IHZcblx0XHRcdFx0aWYgbm90IF8uaXNFbXB0eShuZXdUcilcblx0XHRcdFx0XHR2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXS5wdXNoKG5ld1RyKVxuXG5cdFx0IyDlkIzmraXlrZDooajmlbDmja7oh7PooajljZXooajmoLxcblx0XHRfLmVhY2ggdGFibGVUb1JlbGF0ZWRNYXAsICAobWFwLCBrZXkpIC0+XG5cdFx0XHR0YWJsZUNvZGUgPSBtYXAuX0ZST01fVEFCTEVfQ09ERVxuXHRcdFx0Zm9ybVRhYmxlRmllbGQgPSBnZXRGb3JtVGFibGVGaWVsZCh0YWJsZUNvZGUpXG5cdFx0XHRpZiAhdGFibGVDb2RlXG5cdFx0XHRcdGNvbnNvbGUud2FybigndGFibGVUb1JlbGF0ZWQ6IFsnICsga2V5ICsgJ10gbWlzc2luZyBjb3JyZXNwb25kaW5nIHRhYmxlLicpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3ROYW1lID0ga2V5XG5cdFx0XHRcdHRhYmxlVmFsdWVzID0gW11cblx0XHRcdFx0cmVsYXRlZFRhYmxlSXRlbXMgPSBbXVxuXHRcdFx0XHRyZWxhdGVkT2JqZWN0ID0gZ2V0T2JqZWN0Q29uZmlnKHJlbGF0ZWRPYmplY3ROYW1lKVxuXHRcdFx0XHRyZWxhdGVkRmllbGQgPSBfLmZpbmQgcmVsYXRlZE9iamVjdC5maWVsZHMsIChmKSAtPlxuXHRcdFx0XHRcdHJldHVybiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMoZi50eXBlKSAmJiBmLnJlZmVyZW5jZV90byA9PSBvYmplY3ROYW1lXG5cblx0XHRcdFx0cmVsYXRlZEZpZWxkTmFtZSA9IHJlbGF0ZWRGaWVsZC5uYW1lXG5cblx0XHRcdFx0c2VsZWN0b3IgPSB7fVxuXHRcdFx0XHRzZWxlY3RvcltyZWxhdGVkRmllbGROYW1lXSA9IHJlY29yZElkXG5cdFx0XHRcdHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKVxuXHRcdFx0XHRyZWxhdGVkUmVjb3JkcyA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpXG5cblx0XHRcdFx0cmVsYXRlZFJlY29yZHMuZm9yRWFjaCAocnIpIC0+XG5cdFx0XHRcdFx0dGFibGVWYWx1ZUl0ZW0gPSB7fVxuXHRcdFx0XHRcdF8uZWFjaCBtYXAsICh2YWx1ZUtleSwgZmllbGRLZXkpIC0+XG5cdFx0XHRcdFx0XHRpZiBmaWVsZEtleSAhPSAnX0ZST01fVEFCTEVfQ09ERSdcblx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlXG5cdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleVxuXHRcdFx0XHRcdFx0XHRpZiB2YWx1ZUtleS5zdGFydHNXaXRoKHRhYmxlQ29kZSArICcuJylcblx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXkgPSAodmFsdWVLZXkuc3BsaXQoXCIuXCIpWzFdKVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkS2V5ID0gdmFsdWVLZXlcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGZvcm1GaWVsZCA9IGdldEZvcm1UYWJsZVN1YkZpZWxkKGZvcm1UYWJsZUZpZWxkLCBmb3JtRmllbGRLZXkpXG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZCA9IHJlbGF0ZWRPYmplY3QuZmllbGRzW2ZpZWxkS2V5XVxuXHRcdFx0XHRcdFx0XHRpZiAhZm9ybUZpZWxkIHx8ICFyZWxhdGVkT2JqZWN0RmllbGRcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRcdFx0aWYgZm9ybUZpZWxkLnR5cGUgPT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb09iamVjdE5hbWUgPSByZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcnJbZmllbGRLZXldXG5cdFx0XHRcdFx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV1cblx0XHRcdFx0XHRcdFx0XHRpZiAhXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGZvcm1GaWVsZC50eXBlID09ICd1c2VyJ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkLnR5cGUgPT0gJ2dyb3VwJ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBycltmaWVsZEtleV1cblx0XHRcdFx0XHRcdFx0dGFibGVWYWx1ZUl0ZW1bZm9ybUZpZWxkS2V5XSA9IHRhYmxlRmllbGRWYWx1ZVxuXHRcdFx0XHRcdGlmICFfLmlzRW1wdHkodGFibGVWYWx1ZUl0ZW0pXG5cdFx0XHRcdFx0XHR0YWJsZVZhbHVlSXRlbS5faWQgPSByci5faWRcblx0XHRcdFx0XHRcdHRhYmxlVmFsdWVzLnB1c2godGFibGVWYWx1ZUl0ZW0pXG5cdFx0XHRcdFx0XHRyZWxhdGVkVGFibGVJdGVtcy5wdXNoKHsgX3RhYmxlOiB7IF9pZDogcnIuX2lkLCBfY29kZTogdGFibGVDb2RlIH0gfSApXG5cblx0XHRcdFx0dmFsdWVzW3RhYmxlQ29kZV0gPSB0YWJsZVZhbHVlc1xuXHRcdFx0XHRyZWxhdGVkVGFibGVzSW5mb1tyZWxhdGVkT2JqZWN0TmFtZV0gPSByZWxhdGVkVGFibGVJdGVtc1xuXG5cdFx0IyDlpoLmnpzphY3nva7kuobohJrmnKzliJnmiafooYzohJrmnKxcblx0XHRpZiBvdy5maWVsZF9tYXBfc2NyaXB0XG5cdFx0XHRfLmV4dGVuZCh2YWx1ZXMsIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0KG93LmZpZWxkX21hcF9zY3JpcHQsIG9iamVjdE5hbWUsIHNwYWNlSWQsIHJlY29yZElkKSlcblxuXHQjIOi/h+a7pOaOiXZhbHVlc+S4reeahOmdnuazlWtleVxuXHRmaWx0ZXJWYWx1ZXMgPSB7fVxuXHRfLmVhY2ggXy5rZXlzKHZhbHVlcyksIChrKSAtPlxuXHRcdGlmIGZpZWxkQ29kZXMuaW5jbHVkZXMoaylcblx0XHRcdGZpbHRlclZhbHVlc1trXSA9IHZhbHVlc1trXVxuXG5cdHJldHVybiBmaWx0ZXJWYWx1ZXNcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5ldmFsRmllbGRNYXBTY3JpcHQgPSAoZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgb2JqZWN0SWQpIC0+XG5cdHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKG9iamVjdElkKVxuXHRzY3JpcHQgPSBcIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJlY29yZCkgeyBcIiArIGZpZWxkX21hcF9zY3JpcHQgKyBcIiB9XCJcblx0ZnVuYyA9IF9ldmFsKHNjcmlwdCwgXCJmaWVsZF9tYXBfc2NyaXB0XCIpXG5cdHZhbHVlcyA9IGZ1bmMocmVjb3JkKVxuXHRpZiBfLmlzT2JqZWN0IHZhbHVlc1xuXHRcdHJldHVybiB2YWx1ZXNcblx0ZWxzZVxuXHRcdGNvbnNvbGUuZXJyb3IgXCJldmFsRmllbGRNYXBTY3JpcHQ6IOiEmuacrOi/lOWbnuWAvOexu+Wei+S4jeaYr+WvueixoVwiXG5cdHJldHVybiB7fVxuXG5cblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZUF0dGFjaCA9IChyZWNvcmRJZHMsIHNwYWNlSWQsIGluc0lkLCBhcHByb3ZlSWQpIC0+XG5cblx0Q3JlYXRvci5Db2xsZWN0aW9uc1snY21zX2ZpbGVzJ10uZmluZCh7XG5cdFx0c3BhY2U6IHNwYWNlSWQsXG5cdFx0cGFyZW50OiByZWNvcmRJZHNcblx0fSkuZm9yRWFjaCAoY2YpIC0+XG5cdFx0Xy5lYWNoIGNmLnZlcnNpb25zLCAodmVyc2lvbklkLCBpZHgpIC0+XG5cdFx0XHRmID0gQ3JlYXRvci5Db2xsZWN0aW9uc1snY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXS5maW5kT25lKHZlcnNpb25JZClcblx0XHRcdG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpXG5cblx0XHRcdG5ld0ZpbGUuYXR0YWNoRGF0YSBmLmNyZWF0ZVJlYWRTdHJlYW0oJ2ZpbGVzJyksIHtcblx0XHRcdFx0XHR0eXBlOiBmLm9yaWdpbmFsLnR5cGVcblx0XHRcdH0sIChlcnIpIC0+XG5cdFx0XHRcdGlmIChlcnIpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnIuZXJyb3IsIGVyci5yZWFzb24pXG5cblx0XHRcdFx0bmV3RmlsZS5uYW1lKGYubmFtZSgpKVxuXHRcdFx0XHRuZXdGaWxlLnNpemUoZi5zaXplKCkpXG5cdFx0XHRcdG1ldGFkYXRhID0ge1xuXHRcdFx0XHRcdG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxuXHRcdFx0XHRcdG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRcdFx0XHRpbnN0YW5jZTogaW5zSWQsXG5cdFx0XHRcdFx0YXBwcm92ZTogYXBwcm92ZUlkXG5cdFx0XHRcdFx0cGFyZW50OiBjZi5faWRcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIGlkeCBpcyAwXG5cdFx0XHRcdFx0bWV0YWRhdGEuY3VycmVudCA9IHRydWVcblxuXHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGFcblx0XHRcdFx0Y2ZzLmluc3RhbmNlcy5pbnNlcnQobmV3RmlsZSlcblxuXHRyZXR1cm5cblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlY29yZEluc3RhbmNlSW5mbyA9IChyZWNvcmRJZHMsIGluc0lkLCBzcGFjZUlkKSAtPlxuXHRDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLnVwZGF0ZShyZWNvcmRJZHMuaWRzWzBdLCB7XG5cdFx0JHB1c2g6IHtcblx0XHRcdGluc3RhbmNlczoge1xuXHRcdFx0XHQkZWFjaDogW3tcblx0XHRcdFx0XHRfaWQ6IGluc0lkLFxuXHRcdFx0XHRcdHN0YXRlOiAnZHJhZnQnXG5cdFx0XHRcdH1dLFxuXHRcdFx0XHQkcG9zaXRpb246IDBcblx0XHRcdH1cblx0XHR9LFxuXHRcdCRzZXQ6IHtcblx0XHRcdGxvY2tlZDogdHJ1ZVxuXHRcdFx0aW5zdGFuY2Vfc3RhdGU6ICdkcmFmdCdcblx0XHR9XG5cdH0pXG5cblx0cmV0dXJuXG5cblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlbGF0ZWRSZWNvcmRJbnN0YW5jZUluZm8gPSAocmVsYXRlZFRhYmxlc0luZm8sIGluc0lkLCBzcGFjZUlkKSAtPlxuXHRfLmVhY2ggcmVsYXRlZFRhYmxlc0luZm8sICh0YWJsZUl0ZW1zLCByZWxhdGVkT2JqZWN0TmFtZSkgLT5cblx0XHRyZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZClcblx0XHRfLmVhY2ggdGFibGVJdGVtcywgKGl0ZW0pIC0+XG5cdFx0XHRyZWxhdGVkQ29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKGl0ZW0uX3RhYmxlLl9pZCwge1xuXHRcdFx0XHQkc2V0OiB7XG5cdFx0XHRcdFx0aW5zdGFuY2VzOiBbe1xuXHRcdFx0XHRcdFx0X2lkOiBpbnNJZCxcblx0XHRcdFx0XHRcdHN0YXRlOiAnZHJhZnQnXG5cdFx0XHRcdFx0fV0sXG5cdFx0XHRcdFx0X3RhYmxlOiBpdGVtLl90YWJsZVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXG5cdHJldHVyblxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsID0gKHJlY29yZElkcywgc3BhY2VJZCkgLT5cblx0cmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlY29yZElkcy5vLCBzcGFjZUlkKS5maW5kT25lKHtcblx0XHRfaWQ6IHJlY29yZElkcy5pZHNbMF0sIGluc3RhbmNlczogeyAkZXhpc3RzOiB0cnVlIH1cblx0fSwgeyBmaWVsZHM6IHsgaW5zdGFuY2VzOiAxIH0gfSlcblxuXHRpZiByZWNvcmQgYW5kIHJlY29yZC5pbnN0YW5jZXNbMF0uc3RhdGUgaXNudCAnY29tcGxldGVkJyBhbmQgQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZChyZWNvcmQuaW5zdGFuY2VzWzBdLl9pZCkuY291bnQoKSA+IDBcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuatpOiusOW9leW3suWPkei1t+a1geeoi+ato+WcqOWuoeaJueS4re+8jOW+heWuoeaJuee7k+adn+aWueWPr+WPkei1t+S4i+S4gOasoeWuoeaJue+8gVwiKVxuXG5cdHJldHVyblxuXG4iLCJ2YXIgX2V2YWwsIGdldE9iamVjdENvbmZpZywgZ2V0T2JqZWN0TmFtZUZpZWxkS2V5LCBnZXRSZWxhdGVkcywgb2JqZWN0cWw7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbl9ldmFsID0gcmVxdWlyZSgnZXZhbCcpO1xuXG5vYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJyk7XG5cbmdldE9iamVjdENvbmZpZyA9IGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUpIHtcbiAgcmV0dXJuIG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS50b0NvbmZpZygpO1xufTtcblxuZ2V0T2JqZWN0TmFtZUZpZWxkS2V5ID0gZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSkge1xuICByZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLk5BTUVfRklFTERfS0VZO1xufTtcblxuZ2V0UmVsYXRlZHMgPSBmdW5jdGlvbihvYmplY3RBcGlOYW1lKSB7XG4gIHJldHVybiBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUsIGNiKSB7XG4gICAgcmV0dXJuIG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS5nZXRSZWxhdGVkcygpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfSkob2JqZWN0QXBpTmFtZSk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge307XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbiA9IGZ1bmN0aW9uKHJlcSkge1xuICB2YXIgYXV0aFRva2VuLCBoYXNoZWRUb2tlbiwgcXVlcnksIHVzZXIsIHVzZXJJZDtcbiAgcXVlcnkgPSByZXEucXVlcnk7XG4gIHVzZXJJZCA9IHF1ZXJ5W1wiWC1Vc2VyLUlkXCJdO1xuICBhdXRoVG9rZW4gPSBxdWVyeVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICBfaWQ6IHVzZXJJZCxcbiAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICB9KTtcbiAgaWYgKCF1c2VyKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICByZXR1cm4gdXNlcjtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2UgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICB2YXIgc3BhY2U7XG4gIHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gIGlmICghc3BhY2UpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInNwYWNlX2lk5pyJ6K+v5oiW5q2kc3BhY2Xlt7Lnu4/ooqvliKDpmaRcIik7XG4gIH1cbiAgcmV0dXJuIHNwYWNlO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93ID0gZnVuY3Rpb24oZmxvd19pZCkge1xuICB2YXIgZmxvdztcbiAgZmxvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZmxvd3MuZmluZE9uZShmbG93X2lkKTtcbiAgaWYgKCFmbG93KSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJpZOacieivr+aIluatpOa1geeoi+W3sue7j+iiq+WIoOmZpFwiKTtcbiAgfVxuICByZXR1cm4gZmxvdztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyID0gZnVuY3Rpb24oc3BhY2VfaWQsIHVzZXJfaWQpIHtcbiAgdmFyIHNwYWNlX3VzZXI7XG4gIHNwYWNlX3VzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB1c2VyOiB1c2VyX2lkXG4gIH0pO1xuICBpZiAoIXNwYWNlX3VzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInVzZXJfaWTlr7nlupTnmoTnlKjmiLfkuI3lsZ7kuo7lvZPliY1zcGFjZVwiKTtcbiAgfVxuICByZXR1cm4gc3BhY2VfdXNlcjtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyA9IGZ1bmN0aW9uKHNwYWNlX3VzZXIpIHtcbiAgdmFyIGluZm8sIG9yZztcbiAgaW5mbyA9IG5ldyBPYmplY3Q7XG4gIGluZm8ub3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb247XG4gIG9yZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub3JnYW5pemF0aW9ucy5maW5kT25lKHNwYWNlX3VzZXIub3JnYW5pemF0aW9uLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBuYW1lOiAxLFxuICAgICAgZnVsbG5hbWU6IDFcbiAgICB9XG4gIH0pO1xuICBpbmZvLm9yZ2FuaXphdGlvbl9uYW1lID0gb3JnLm5hbWU7XG4gIGluZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gb3JnLmZ1bGxuYW1lO1xuICByZXR1cm4gaW5mbztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZCA9IGZ1bmN0aW9uKGZsb3cpIHtcbiAgaWYgKGZsb3cuc3RhdGUgIT09IFwiZW5hYmxlZFwiKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvmnKrlkK/nlKgs5pON5L2c5aSx6LSlXCIpO1xuICB9XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZCA9IGZ1bmN0aW9uKGZsb3csIHNwYWNlX2lkKSB7XG4gIGlmIChmbG93LnNwYWNlICE9PSBzcGFjZV9pZCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5ZKM5bel5L2c5Yy6SUTkuI3ljLnphY1cIik7XG4gIH1cbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybSA9IGZ1bmN0aW9uKGZvcm1faWQpIHtcbiAgdmFyIGZvcm07XG4gIGZvcm0gPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZvcm1zLmZpbmRPbmUoZm9ybV9pZCk7XG4gIGlmICghZm9ybSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsICfooajljZVJROacieivr+aIluatpOihqOWNleW3sue7j+iiq+WIoOmZpCcpO1xuICB9XG4gIHJldHVybiBmb3JtO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeSA9IGZ1bmN0aW9uKGNhdGVnb3J5X2lkKSB7XG4gIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLmNhdGVnb3JpZXMuZmluZE9uZShjYXRlZ29yeV9pZCk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNyZWF0ZV9pbnN0YW5jZSA9IGZ1bmN0aW9uKGluc3RhbmNlX2Zyb21fY2xpZW50LCB1c2VyX2luZm8pIHtcbiAgdmFyIGFwcHJfb2JqLCBhcHByb3ZlX2Zyb21fY2xpZW50LCBjYXRlZ29yeSwgZmxvdywgZmxvd19pZCwgZm9ybSwgaW5zX29iaiwgbmV3X2luc19pZCwgbm93LCBwZXJtaXNzaW9ucywgcmVsYXRlZFRhYmxlc0luZm8sIHNwYWNlLCBzcGFjZV9pZCwgc3BhY2VfdXNlciwgc3BhY2VfdXNlcl9vcmdfaW5mbywgc3RhcnRfc3RlcCwgdHJhY2VfZnJvbV9jbGllbnQsIHRyYWNlX29iaiwgdXNlcl9pZDtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0sIFN0cmluZyk7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0sIFN0cmluZyk7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXSwgU3RyaW5nKTtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdLCBbXG4gICAge1xuICAgICAgbzogU3RyaW5nLFxuICAgICAgaWRzOiBbU3RyaW5nXVxuICAgIH1cbiAgXSk7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tJc0luQXBwcm92YWwoaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdWzBdLCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdKTtcbiAgc3BhY2VfaWQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdO1xuICBmbG93X2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdO1xuICB1c2VyX2lkID0gdXNlcl9pbmZvLl9pZDtcbiAgdHJhY2VfZnJvbV9jbGllbnQgPSBudWxsO1xuICBhcHByb3ZlX2Zyb21fY2xpZW50ID0gbnVsbDtcbiAgaWYgKGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdICYmIGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdKSB7XG4gICAgdHJhY2VfZnJvbV9jbGllbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXTtcbiAgICBpZiAodHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXSAmJiB0cmFjZV9mcm9tX2NsaWVudFtcImFwcHJvdmVzXCJdWzBdKSB7XG4gICAgICBhcHByb3ZlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1bXCJhcHByb3Zlc1wiXVswXTtcbiAgICB9XG4gIH1cbiAgc3BhY2UgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlKHNwYWNlX2lkKTtcbiAgZmxvdyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyhmbG93X2lkKTtcbiAgc3BhY2VfdXNlciA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyKHNwYWNlX2lkLCB1c2VyX2lkKTtcbiAgc3BhY2VfdXNlcl9vcmdfaW5mbyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyhzcGFjZV91c2VyKTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dFbmFibGVkKGZsb3cpO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZChmbG93LCBzcGFjZV9pZCk7XG4gIGZvcm0gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZvcm0oZmxvdy5mb3JtKTtcbiAgcGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd19pZCwgdXNlcl9pZCk7XG4gIGlmICghcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZGRcIikpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuW9k+WJjeeUqOaIt+ayoeacieatpOa1geeoi+eahOaWsOW7uuadg+mZkFwiKTtcbiAgfVxuICBub3cgPSBuZXcgRGF0ZTtcbiAgaW5zX29iaiA9IHt9O1xuICBpbnNfb2JqLl9pZCA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLl9tYWtlTmV3SUQoKTtcbiAgaW5zX29iai5zcGFjZSA9IHNwYWNlX2lkO1xuICBpbnNfb2JqLmZsb3cgPSBmbG93X2lkO1xuICBpbnNfb2JqLmZsb3dfdmVyc2lvbiA9IGZsb3cuY3VycmVudC5faWQ7XG4gIGluc19vYmouZm9ybSA9IGZsb3cuZm9ybTtcbiAgaW5zX29iai5mb3JtX3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuZm9ybV92ZXJzaW9uO1xuICBpbnNfb2JqLm5hbWUgPSBmbG93Lm5hbWU7XG4gIGluc19vYmouc3VibWl0dGVyID0gdXNlcl9pZDtcbiAgaW5zX29iai5zdWJtaXR0ZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gOiB1c2VyX2lkO1xuICBpbnNfb2JqLmFwcGxpY2FudF9uYW1lID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gOiB1c2VyX2luZm8ubmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdIDogc3BhY2VfdXNlci5vcmdhbml6YXRpb247XG4gIGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZVwiXSA6IHNwYWNlX3VzZXJfb3JnX2luZm8ub3JnYW5pemF0aW9uX25hbWU7XG4gIGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZVwiXSA6IHNwYWNlX3VzZXJfb3JnX2luZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudF9jb21wYW55ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfY29tcGFueVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gOiBzcGFjZV91c2VyLmNvbXBhbnlfaWQ7XG4gIGluc19vYmouc3RhdGUgPSAnZHJhZnQnO1xuICBpbnNfb2JqLmNvZGUgPSAnJztcbiAgaW5zX29iai5pc19hcmNoaXZlZCA9IGZhbHNlO1xuICBpbnNfb2JqLmlzX2RlbGV0ZWQgPSBmYWxzZTtcbiAgaW5zX29iai5jcmVhdGVkID0gbm93O1xuICBpbnNfb2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkO1xuICBpbnNfb2JqLm1vZGlmaWVkID0gbm93O1xuICBpbnNfb2JqLm1vZGlmaWVkX2J5ID0gdXNlcl9pZDtcbiAgaW5zX29iai52YWx1ZXMgPSBuZXcgT2JqZWN0O1xuICBpbnNfb2JqLnJlY29yZF9pZHMgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl07XG4gIGlmIChzcGFjZV91c2VyLmNvbXBhbnlfaWQpIHtcbiAgICBpbnNfb2JqLmNvbXBhbnlfaWQgPSBzcGFjZV91c2VyLmNvbXBhbnlfaWQ7XG4gIH1cbiAgdHJhY2Vfb2JqID0ge307XG4gIHRyYWNlX29iai5faWQgPSBuZXcgTW9uZ28uT2JqZWN0SUQoKS5fc3RyO1xuICB0cmFjZV9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZDtcbiAgdHJhY2Vfb2JqLmlzX2ZpbmlzaGVkID0gZmFsc2U7XG4gIHN0YXJ0X3N0ZXAgPSBfLmZpbmQoZmxvdy5jdXJyZW50LnN0ZXBzLCBmdW5jdGlvbihzdGVwKSB7XG4gICAgcmV0dXJuIHN0ZXAuc3RlcF90eXBlID09PSAnc3RhcnQnO1xuICB9KTtcbiAgdHJhY2Vfb2JqLnN0ZXAgPSBzdGFydF9zdGVwLl9pZDtcbiAgdHJhY2Vfb2JqLm5hbWUgPSBzdGFydF9zdGVwLm5hbWU7XG4gIHRyYWNlX29iai5zdGFydF9kYXRlID0gbm93O1xuICBhcHByX29iaiA9IHt9O1xuICBhcHByX29iai5faWQgPSBuZXcgTW9uZ28uT2JqZWN0SUQoKS5fc3RyO1xuICBhcHByX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkO1xuICBhcHByX29iai50cmFjZSA9IHRyYWNlX29iai5faWQ7XG4gIGFwcHJfb2JqLmlzX2ZpbmlzaGVkID0gZmFsc2U7XG4gIGFwcHJfb2JqLnVzZXIgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIDogdXNlcl9pZDtcbiAgYXBwcl9vYmoudXNlcl9uYW1lID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gOiB1c2VyX2luZm8ubmFtZTtcbiAgYXBwcl9vYmouaGFuZGxlciA9IHVzZXJfaWQ7XG4gIGFwcHJfb2JqLmhhbmRsZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lO1xuICBhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbiA9IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uO1xuICBhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9uYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5uYW1lO1xuICBhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IHNwYWNlX3VzZXJfb3JnX2luZm8uZnVsbG5hbWU7XG4gIGFwcHJfb2JqLnR5cGUgPSAnZHJhZnQnO1xuICBhcHByX29iai5zdGFydF9kYXRlID0gbm93O1xuICBhcHByX29iai5yZWFkX2RhdGUgPSBub3c7XG4gIGFwcHJfb2JqLmlzX3JlYWQgPSB0cnVlO1xuICBhcHByX29iai5pc19lcnJvciA9IGZhbHNlO1xuICBhcHByX29iai5kZXNjcmlwdGlvbiA9ICcnO1xuICByZWxhdGVkVGFibGVzSW5mbyA9IHt9O1xuICBhcHByX29iai52YWx1ZXMgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlVmFsdWVzKGluc19vYmoucmVjb3JkX2lkc1swXSwgZmxvd19pZCwgc3BhY2VfaWQsIGZvcm0uY3VycmVudC5maWVsZHMsIHJlbGF0ZWRUYWJsZXNJbmZvKTtcbiAgdHJhY2Vfb2JqLmFwcHJvdmVzID0gW2FwcHJfb2JqXTtcbiAgaW5zX29iai50cmFjZXMgPSBbdHJhY2Vfb2JqXTtcbiAgaW5zX29iai5pbmJveF91c2VycyA9IGluc3RhbmNlX2Zyb21fY2xpZW50LmluYm94X3VzZXJzIHx8IFtdO1xuICBpbnNfb2JqLmN1cnJlbnRfc3RlcF9uYW1lID0gc3RhcnRfc3RlcC5uYW1lO1xuICBpZiAoZmxvdy5hdXRvX3JlbWluZCA9PT0gdHJ1ZSkge1xuICAgIGluc19vYmouYXV0b19yZW1pbmQgPSB0cnVlO1xuICB9XG4gIGluc19vYmouZmxvd19uYW1lID0gZmxvdy5uYW1lO1xuICBpZiAoZm9ybS5jYXRlZ29yeSkge1xuICAgIGNhdGVnb3J5ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeShmb3JtLmNhdGVnb3J5KTtcbiAgICBpZiAoY2F0ZWdvcnkpIHtcbiAgICAgIGluc19vYmouY2F0ZWdvcnlfbmFtZSA9IGNhdGVnb3J5Lm5hbWU7XG4gICAgICBpbnNfb2JqLmNhdGVnb3J5ID0gY2F0ZWdvcnkuX2lkO1xuICAgIH1cbiAgfVxuICBuZXdfaW5zX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuaW5zZXJ0KGluc19vYmopO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvKGluc19vYmoucmVjb3JkX2lkc1swXSwgbmV3X2luc19pZCwgc3BhY2VfaWQpO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoKGluc19vYmoucmVjb3JkX2lkc1swXSwgc3BhY2VfaWQsIGluc19vYmouX2lkLCBhcHByX29iai5faWQpO1xuICByZXR1cm4gbmV3X2luc19pZDtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMgPSBmdW5jdGlvbihyZWNvcmRJZHMsIGZsb3dJZCwgc3BhY2VJZCwgZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbykge1xuICB2YXIgZmllbGRDb2RlcywgZmlsdGVyVmFsdWVzLCBmbG93LCBmb3JtLCBmb3JtRmllbGRzLCBmb3JtVGFibGVGaWVsZHMsIGZvcm1UYWJsZUZpZWxkc0NvZGUsIGdldEZpZWxkT2RhdGFWYWx1ZSwgZ2V0Rm9ybUZpZWxkLCBnZXRGb3JtVGFibGVGaWVsZCwgZ2V0Rm9ybVRhYmxlRmllbGRDb2RlLCBnZXRGb3JtVGFibGVTdWJGaWVsZCwgZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSwgZ2V0U2VsZWN0T3JnVmFsdWUsIGdldFNlbGVjdE9yZ1ZhbHVlcywgZ2V0U2VsZWN0VXNlclZhbHVlLCBnZXRTZWxlY3RVc2VyVmFsdWVzLCBvYmplY3QsIG9iamVjdE5hbWUsIG93LCByZWNvcmQsIHJlY29yZElkLCByZWYsIHJlbGF0ZWRPYmplY3RzLCByZWxhdGVkT2JqZWN0c0tleXMsIHRhYmxlRmllbGRDb2RlcywgdGFibGVGaWVsZE1hcCwgdGFibGVUb1JlbGF0ZWRNYXAsIHZhbHVlcztcbiAgZmllbGRDb2RlcyA9IFtdO1xuICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgaWYgKGYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKGYuZmllbGRzLCBmdW5jdGlvbihmZikge1xuICAgICAgICByZXR1cm4gZmllbGRDb2Rlcy5wdXNoKGZmLmNvZGUpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaWVsZENvZGVzLnB1c2goZi5jb2RlKTtcbiAgICB9XG4gIH0pO1xuICB2YWx1ZXMgPSB7fTtcbiAgb2JqZWN0TmFtZSA9IHJlY29yZElkcy5vO1xuICBvYmplY3QgPSBnZXRPYmplY3RDb25maWcob2JqZWN0TmFtZSk7XG4gIHJlY29yZElkID0gcmVjb3JkSWRzLmlkc1swXTtcbiAgb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXG4gICAgZmxvd19pZDogZmxvd0lkXG4gIH0pO1xuICByZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0TmFtZSwgc3BhY2VJZCkuZmluZE9uZShyZWNvcmRJZCk7XG4gIGZsb3cgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShmbG93SWQsIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGZvcm06IDFcbiAgICB9XG4gIH0pO1xuICBpZiAob3cgJiYgcmVjb3JkKSB7XG4gICAgZm9ybSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImZvcm1zXCIpLmZpbmRPbmUoZmxvdy5mb3JtKTtcbiAgICBmb3JtRmllbGRzID0gZm9ybS5jdXJyZW50LmZpZWxkcyB8fCBbXTtcbiAgICByZWxhdGVkT2JqZWN0cyA9IGdldFJlbGF0ZWRzKG9iamVjdE5hbWUpO1xuICAgIHJlbGF0ZWRPYmplY3RzS2V5cyA9IF8ucGx1Y2socmVsYXRlZE9iamVjdHMsICdvYmplY3RfbmFtZScpO1xuICAgIGZvcm1UYWJsZUZpZWxkcyA9IF8uZmlsdGVyKGZvcm1GaWVsZHMsIGZ1bmN0aW9uKGZvcm1GaWVsZCkge1xuICAgICAgcmV0dXJuIGZvcm1GaWVsZC50eXBlID09PSAndGFibGUnO1xuICAgIH0pO1xuICAgIGZvcm1UYWJsZUZpZWxkc0NvZGUgPSBfLnBsdWNrKGZvcm1UYWJsZUZpZWxkcywgJ2NvZGUnKTtcbiAgICBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKHJlbGF0ZWRPYmplY3RzS2V5cywgZnVuY3Rpb24ocmVsYXRlZE9iamVjdHNLZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleS5zdGFydHNXaXRoKHJlbGF0ZWRPYmplY3RzS2V5ICsgJy4nKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlRmllbGRDb2RlID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKGZvcm1UYWJsZUZpZWxkc0NvZGUsIGZ1bmN0aW9uKGZvcm1UYWJsZUZpZWxkQ29kZSkge1xuICAgICAgICByZXR1cm4ga2V5LnN0YXJ0c1dpdGgoZm9ybVRhYmxlRmllbGRDb2RlICsgJy4nKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlRmllbGQgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBfLmZpbmQoZm9ybVRhYmxlRmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgIHJldHVybiBmLmNvZGUgPT09IGtleTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybUZpZWxkID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgZmY7XG4gICAgICBmZiA9IG51bGw7XG4gICAgICBfLmZvckVhY2goZm9ybUZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgICAgICBpZiAoZmYpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIGZmID0gXy5maW5kKGYuZmllbGRzLCBmdW5jdGlvbihzZikge1xuICAgICAgICAgICAgcmV0dXJuIHNmLmNvZGUgPT09IGtleTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChmLmNvZGUgPT09IGtleSkge1xuICAgICAgICAgIHJldHVybiBmZiA9IGY7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZmO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlU3ViRmllbGQgPSBmdW5jdGlvbih0YWJsZUZpZWxkLCBzdWJGaWVsZENvZGUpIHtcbiAgICAgIHJldHVybiBfLmZpbmQodGFibGVGaWVsZC5maWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgcmV0dXJuIGYuY29kZSA9PT0gc3ViRmllbGRDb2RlO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRGaWVsZE9kYXRhVmFsdWUgPSBmdW5jdGlvbihvYmpOYW1lLCBpZCkge1xuICAgICAgdmFyIF9yZWNvcmQsIF9yZWNvcmRzLCBuYW1lS2V5LCBvYmo7XG4gICAgICBvYmogPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqTmFtZSk7XG4gICAgICBuYW1lS2V5ID0gZ2V0T2JqZWN0TmFtZUZpZWxkS2V5KG9iak5hbWUpO1xuICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKF8uaXNTdHJpbmcoaWQpKSB7XG4gICAgICAgIF9yZWNvcmQgPSBvYmouZmluZE9uZShpZCk7XG4gICAgICAgIGlmIChfcmVjb3JkKSB7XG4gICAgICAgICAgX3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkW25hbWVLZXldO1xuICAgICAgICAgIHJldHVybiBfcmVjb3JkO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKF8uaXNBcnJheShpZCkpIHtcbiAgICAgICAgX3JlY29yZHMgPSBbXTtcbiAgICAgICAgb2JqLmZpbmQoe1xuICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgJGluOiBpZFxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihfcmVjb3JkKSB7XG4gICAgICAgICAgX3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkW25hbWVLZXldO1xuICAgICAgICAgIHJldHVybiBfcmVjb3Jkcy5wdXNoKF9yZWNvcmQpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFfLmlzRW1wdHkoX3JlY29yZHMpKSB7XG4gICAgICAgICAgcmV0dXJuIF9yZWNvcmRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBnZXRTZWxlY3RVc2VyVmFsdWUgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgICAgIHZhciBzdTtcbiAgICAgIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9KTtcbiAgICAgIHN1LmlkID0gdXNlcklkO1xuICAgICAgcmV0dXJuIHN1O1xuICAgIH07XG4gICAgZ2V0U2VsZWN0VXNlclZhbHVlcyA9IGZ1bmN0aW9uKHVzZXJJZHMsIHNwYWNlSWQpIHtcbiAgICAgIHZhciBzdXM7XG4gICAgICBzdXMgPSBbXTtcbiAgICAgIGlmIChfLmlzQXJyYXkodXNlcklkcykpIHtcbiAgICAgICAgXy5lYWNoKHVzZXJJZHMsIGZ1bmN0aW9uKHVzZXJJZCkge1xuICAgICAgICAgIHZhciBzdTtcbiAgICAgICAgICBzdSA9IGdldFNlbGVjdFVzZXJWYWx1ZSh1c2VySWQsIHNwYWNlSWQpO1xuICAgICAgICAgIGlmIChzdSkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cy5wdXNoKHN1KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN1cztcbiAgICB9O1xuICAgIGdldFNlbGVjdE9yZ1ZhbHVlID0gZnVuY3Rpb24ob3JnSWQsIHNwYWNlSWQpIHtcbiAgICAgIHZhciBvcmc7XG4gICAgICBvcmcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kT25lKG9yZ0lkLCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgIGZ1bGxuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgb3JnLmlkID0gb3JnSWQ7XG4gICAgICByZXR1cm4gb3JnO1xuICAgIH07XG4gICAgZ2V0U2VsZWN0T3JnVmFsdWVzID0gZnVuY3Rpb24ob3JnSWRzLCBzcGFjZUlkKSB7XG4gICAgICB2YXIgb3JncztcbiAgICAgIG9yZ3MgPSBbXTtcbiAgICAgIGlmIChfLmlzQXJyYXkob3JnSWRzKSkge1xuICAgICAgICBfLmVhY2gob3JnSWRzLCBmdW5jdGlvbihvcmdJZCkge1xuICAgICAgICAgIHZhciBvcmc7XG4gICAgICAgICAgb3JnID0gZ2V0U2VsZWN0T3JnVmFsdWUob3JnSWQsIHNwYWNlSWQpO1xuICAgICAgICAgIGlmIChvcmcpIHtcbiAgICAgICAgICAgIHJldHVybiBvcmdzLnB1c2gob3JnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9yZ3M7XG4gICAgfTtcbiAgICB0YWJsZUZpZWxkQ29kZXMgPSBbXTtcbiAgICB0YWJsZUZpZWxkTWFwID0gW107XG4gICAgdGFibGVUb1JlbGF0ZWRNYXAgPSB7fTtcbiAgICBpZiAoKHJlZiA9IG93LmZpZWxkX21hcCkgIT0gbnVsbCkge1xuICAgICAgcmVmLmZvckVhY2goZnVuY3Rpb24oZm0pIHtcbiAgICAgICAgdmFyIGZpZWxkc09iaiwgZm9ybUZpZWxkLCBmb3JtVGFibGVGaWVsZENvZGUsIGdyaWRDb2RlLCBsb29rdXBGaWVsZE5hbWUsIGxvb2t1cEZpZWxkT2JqLCBsb29rdXBPYmplY3RSZWNvcmQsIGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUsIG9UYWJsZUNvZGUsIG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZCwgb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkQ29kZSwgb1RhYmxlRmllbGRDb2RlLCBvYmpGaWVsZCwgb2JqZWN0RmllbGQsIG9iamVjdEZpZWxkTmFtZSwgb2JqZWN0RmllbGRPYmplY3ROYW1lLCBvYmplY3RMb29rdXBGaWVsZCwgb2JqZWN0X2ZpZWxkLCBvZGF0YUZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRG9jLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVsYXRlZE9iamVjdEZpZWxkQ29kZSwgc2VsZWN0RmllbGRWYWx1ZSwgdGFibGVUb1JlbGF0ZWRNYXBLZXksIHdUYWJsZUNvZGUsIHdvcmtmbG93X2ZpZWxkO1xuICAgICAgICBvYmplY3RfZmllbGQgPSBmbS5vYmplY3RfZmllbGQ7XG4gICAgICAgIHdvcmtmbG93X2ZpZWxkID0gZm0ud29ya2Zsb3dfZmllbGQ7XG4gICAgICAgIGlmICghb2JqZWN0X2ZpZWxkIHx8ICF3b3JrZmxvd19maWVsZCkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAn5pyq5om+5Yiw5a2X5q6177yM6K+35qOA5p+l5a+56LGh5rWB56iL5pig5bCE5a2X5q616YWN572uJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmVsYXRlZE9iamVjdEZpZWxkQ29kZSA9IGdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUob2JqZWN0X2ZpZWxkKTtcbiAgICAgICAgZm9ybVRhYmxlRmllbGRDb2RlID0gZ2V0Rm9ybVRhYmxlRmllbGRDb2RlKHdvcmtmbG93X2ZpZWxkKTtcbiAgICAgICAgb2JqRmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdF9maWVsZF07XG4gICAgICAgIGZvcm1GaWVsZCA9IGdldEZvcm1GaWVsZCh3b3JrZmxvd19maWVsZCk7XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0RmllbGRDb2RlKSB7XG4gICAgICAgICAgb1RhYmxlQ29kZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgIG9UYWJsZUZpZWxkQ29kZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgIHRhYmxlVG9SZWxhdGVkTWFwS2V5ID0gb1RhYmxlQ29kZTtcbiAgICAgICAgICBpZiAoIXRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSkge1xuICAgICAgICAgICAgdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmb3JtVGFibGVGaWVsZENvZGUpIHtcbiAgICAgICAgICAgIHdUYWJsZUNvZGUgPSB3b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgICAgdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldWydfRlJPTV9UQUJMRV9DT0RFJ10gPSB3VGFibGVDb2RlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldW29UYWJsZUZpZWxkQ29kZV0gPSB3b3JrZmxvd19maWVsZDtcbiAgICAgICAgfSBlbHNlIGlmICh3b3JrZmxvd19maWVsZC5pbmRleE9mKCcuJykgPiAwICYmIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA+IDApIHtcbiAgICAgICAgICB3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICBvVGFibGVDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJC4nKVswXTtcbiAgICAgICAgICBpZiAocmVjb3JkLmhhc093blByb3BlcnR5KG9UYWJsZUNvZGUpICYmIF8uaXNBcnJheShyZWNvcmRbb1RhYmxlQ29kZV0pKSB7XG4gICAgICAgICAgICB0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgIHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXG4gICAgICAgICAgICAgIG9iamVjdF90YWJsZV9maWVsZF9jb2RlOiBvVGFibGVDb2RlXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICByZXR1cm4gdGFibGVGaWVsZE1hcC5wdXNoKGZtKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG9UYWJsZUNvZGUuaW5kZXhPZignLicpID4gMCkge1xuICAgICAgICAgICAgb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkQ29kZSA9IG9UYWJsZUNvZGUuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIGdyaWRDb2RlID0gb1RhYmxlQ29kZS5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkID0gb2JqZWN0LmZpZWxkc1tvVGFibGVDb2RlUmVmZXJlbmNlRmllbGRDb2RlXTtcbiAgICAgICAgICAgIGlmIChvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgIGlmIChyZWNvcmRbb1RhYmxlQ29kZV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5uYW1lXTtcbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9Eb2MgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpO1xuICAgICAgICAgICAgICBpZiAocmVmZXJlbmNlVG9Eb2NbZ3JpZENvZGVdKSB7XG4gICAgICAgICAgICAgICAgcmVjb3JkW29UYWJsZUNvZGVdID0gcmVmZXJlbmNlVG9Eb2NbZ3JpZENvZGVdO1xuICAgICAgICAgICAgICAgIHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgIHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXG4gICAgICAgICAgICAgICAgICBvYmplY3RfdGFibGVfZmllbGRfY29kZTogb1RhYmxlQ29kZVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFibGVGaWVsZE1hcC5wdXNoKGZtKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChvYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gMCAmJiBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPT09IC0xKSB7XG4gICAgICAgICAgb2JqZWN0RmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgbG9va3VwRmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgaWYgKG9iamVjdCkge1xuICAgICAgICAgICAgb2JqZWN0RmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdEZpZWxkTmFtZV07XG4gICAgICAgICAgICBpZiAob2JqZWN0RmllbGQgJiYgZm9ybUZpZWxkICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgZmllbGRzT2JqID0ge307XG4gICAgICAgICAgICAgIGZpZWxkc09ialtsb29rdXBGaWVsZE5hbWVdID0gMTtcbiAgICAgICAgICAgICAgbG9va3VwT2JqZWN0UmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZE9uZShyZWNvcmRbb2JqZWN0RmllbGROYW1lXSwge1xuICAgICAgICAgICAgICAgIGZpZWxkczogZmllbGRzT2JqXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBvYmplY3RGaWVsZE9iamVjdE5hbWUgPSBvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICAgIGxvb2t1cEZpZWxkT2JqID0gZ2V0T2JqZWN0Q29uZmlnKG9iamVjdEZpZWxkT2JqZWN0TmFtZSk7XG4gICAgICAgICAgICAgIG9iamVjdExvb2t1cEZpZWxkID0gbG9va3VwRmllbGRPYmouZmllbGRzW2xvb2t1cEZpZWxkTmFtZV07XG4gICAgICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IGxvb2t1cE9iamVjdFJlY29yZFtsb29rdXBGaWVsZE5hbWVdO1xuICAgICAgICAgICAgICBpZiAob2JqZWN0TG9va3VwRmllbGQgJiYgZm9ybUZpZWxkICYmIGZvcm1GaWVsZC50eXBlID09PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RMb29rdXBGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb09iamVjdE5hbWUgPSBvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgIG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAob2JqZWN0TG9va3VwRmllbGQgJiYgZm9ybUZpZWxkICYmIFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKGZvcm1GaWVsZC50eXBlKSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqZWN0TG9va3VwRmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIGlmICghXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgIGxvb2t1cFNlbGVjdEZpZWxkVmFsdWU7XG4gICAgICAgICAgICAgICAgICBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgbG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgIGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgbG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgbG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChsb29rdXBTZWxlY3RGaWVsZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gbG9va3VwU2VsZWN0RmllbGRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBsb29rdXBPYmplY3RSZWNvcmRbbG9va3VwRmllbGROYW1lXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iakZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqRmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9iakZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSByZWNvcmRbb2JqRmllbGQubmFtZV07XG4gICAgICAgICAgb2RhdGFGaWVsZFZhbHVlO1xuICAgICAgICAgIGlmIChvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgIG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIGlmICghb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkICYmIG9iakZpZWxkICYmIFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKGZvcm1GaWVsZC50eXBlKSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob2JqRmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvYmpGaWVsZC5uYW1lXTtcbiAgICAgICAgICBpZiAoIV8uaXNFbXB0eShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUpKSB7XG4gICAgICAgICAgICBzZWxlY3RGaWVsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKGZvcm1GaWVsZC50eXBlID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgaWYgKG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdncm91cCcpIHtcbiAgICAgICAgICAgICAgaWYgKG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZWN0RmllbGRWYWx1ZSkge1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHNlbGVjdEZpZWxkVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC5oYXNPd25Qcm9wZXJ0eShvYmplY3RfZmllbGQpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSByZWNvcmRbb2JqZWN0X2ZpZWxkXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIF8udW5pcSh0YWJsZUZpZWxkQ29kZXMpLmZvckVhY2goZnVuY3Rpb24odGZjKSB7XG4gICAgICB2YXIgYztcbiAgICAgIGMgPSBKU09OLnBhcnNlKHRmYyk7XG4gICAgICB2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXSA9IFtdO1xuICAgICAgcmV0dXJuIHJlY29yZFtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXS5mb3JFYWNoKGZ1bmN0aW9uKHRyKSB7XG4gICAgICAgIHZhciBuZXdUcjtcbiAgICAgICAgbmV3VHIgPSB7fTtcbiAgICAgICAgXy5lYWNoKHRyLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYmxlRmllbGRNYXAuZm9yRWFjaChmdW5jdGlvbih0Zm0pIHtcbiAgICAgICAgICAgIHZhciB3VGRDb2RlO1xuICAgICAgICAgICAgaWYgKHRmbS5vYmplY3RfZmllbGQgPT09IChjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlICsgJy4kLicgKyBrKSkge1xuICAgICAgICAgICAgICB3VGRDb2RlID0gdGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICAgIHJldHVybiBuZXdUclt3VGRDb2RlXSA9IHY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIV8uaXNFbXB0eShuZXdUcikpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWVzW2Mud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZV0ucHVzaChuZXdUcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIF8uZWFjaCh0YWJsZVRvUmVsYXRlZE1hcCwgZnVuY3Rpb24obWFwLCBrZXkpIHtcbiAgICAgIHZhciBmb3JtVGFibGVGaWVsZCwgcmVsYXRlZENvbGxlY3Rpb24sIHJlbGF0ZWRGaWVsZCwgcmVsYXRlZEZpZWxkTmFtZSwgcmVsYXRlZE9iamVjdCwgcmVsYXRlZE9iamVjdE5hbWUsIHJlbGF0ZWRSZWNvcmRzLCByZWxhdGVkVGFibGVJdGVtcywgc2VsZWN0b3IsIHRhYmxlQ29kZSwgdGFibGVWYWx1ZXM7XG4gICAgICB0YWJsZUNvZGUgPSBtYXAuX0ZST01fVEFCTEVfQ09ERTtcbiAgICAgIGZvcm1UYWJsZUZpZWxkID0gZ2V0Rm9ybVRhYmxlRmllbGQodGFibGVDb2RlKTtcbiAgICAgIGlmICghdGFibGVDb2RlKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oJ3RhYmxlVG9SZWxhdGVkOiBbJyArIGtleSArICddIG1pc3NpbmcgY29ycmVzcG9uZGluZyB0YWJsZS4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbGF0ZWRPYmplY3ROYW1lID0ga2V5O1xuICAgICAgICB0YWJsZVZhbHVlcyA9IFtdO1xuICAgICAgICByZWxhdGVkVGFibGVJdGVtcyA9IFtdO1xuICAgICAgICByZWxhdGVkT2JqZWN0ID0gZ2V0T2JqZWN0Q29uZmlnKHJlbGF0ZWRPYmplY3ROYW1lKTtcbiAgICAgICAgcmVsYXRlZEZpZWxkID0gXy5maW5kKHJlbGF0ZWRPYmplY3QuZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgcmV0dXJuIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhmLnR5cGUpICYmIGYucmVmZXJlbmNlX3RvID09PSBvYmplY3ROYW1lO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVsYXRlZEZpZWxkTmFtZSA9IHJlbGF0ZWRGaWVsZC5uYW1lO1xuICAgICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgICBzZWxlY3RvcltyZWxhdGVkRmllbGROYW1lXSA9IHJlY29yZElkO1xuICAgICAgICByZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCk7XG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZChzZWxlY3Rvcik7XG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2goZnVuY3Rpb24ocnIpIHtcbiAgICAgICAgICB2YXIgdGFibGVWYWx1ZUl0ZW07XG4gICAgICAgICAgdGFibGVWYWx1ZUl0ZW0gPSB7fTtcbiAgICAgICAgICBfLmVhY2gobWFwLCBmdW5jdGlvbih2YWx1ZUtleSwgZmllbGRLZXkpIHtcbiAgICAgICAgICAgIHZhciBmb3JtRmllbGQsIGZvcm1GaWVsZEtleSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlbGF0ZWRPYmplY3RGaWVsZCwgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKGZpZWxkS2V5ICE9PSAnX0ZST01fVEFCTEVfQ09ERScpIHtcbiAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICBmb3JtRmllbGRLZXk7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZUtleS5zdGFydHNXaXRoKHRhYmxlQ29kZSArICcuJykpIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSAodmFsdWVLZXkuc3BsaXQoXCIuXCIpWzFdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSB2YWx1ZUtleTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBmb3JtRmllbGQgPSBnZXRGb3JtVGFibGVTdWJGaWVsZChmb3JtVGFibGVGaWVsZCwgZm9ybUZpZWxkS2V5KTtcbiAgICAgICAgICAgICAgcmVsYXRlZE9iamVjdEZpZWxkID0gcmVsYXRlZE9iamVjdC5maWVsZHNbZmllbGRLZXldO1xuICAgICAgICAgICAgICBpZiAoIWZvcm1GaWVsZCB8fCAhcmVsYXRlZE9iamVjdEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb09iamVjdE5hbWUgPSByZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XTtcbiAgICAgICAgICAgICAgICBpZiAocmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV07XG4gICAgICAgICAgICAgICAgaWYgKCFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgaWYgKGZvcm1GaWVsZC50eXBlID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdncm91cCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gdGFibGVWYWx1ZUl0ZW1bZm9ybUZpZWxkS2V5XSA9IHRhYmxlRmllbGRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoIV8uaXNFbXB0eSh0YWJsZVZhbHVlSXRlbSkpIHtcbiAgICAgICAgICAgIHRhYmxlVmFsdWVJdGVtLl9pZCA9IHJyLl9pZDtcbiAgICAgICAgICAgIHRhYmxlVmFsdWVzLnB1c2godGFibGVWYWx1ZUl0ZW0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRUYWJsZUl0ZW1zLnB1c2goe1xuICAgICAgICAgICAgICBfdGFibGU6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IHJyLl9pZCxcbiAgICAgICAgICAgICAgICBfY29kZTogdGFibGVDb2RlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHZhbHVlc1t0YWJsZUNvZGVdID0gdGFibGVWYWx1ZXM7XG4gICAgICAgIHJldHVybiByZWxhdGVkVGFibGVzSW5mb1tyZWxhdGVkT2JqZWN0TmFtZV0gPSByZWxhdGVkVGFibGVJdGVtcztcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAob3cuZmllbGRfbWFwX3NjcmlwdCkge1xuICAgICAgXy5leHRlbmQodmFsdWVzLCB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmV2YWxGaWVsZE1hcFNjcmlwdChvdy5maWVsZF9tYXBfc2NyaXB0LCBvYmplY3ROYW1lLCBzcGFjZUlkLCByZWNvcmRJZCkpO1xuICAgIH1cbiAgfVxuICBmaWx0ZXJWYWx1ZXMgPSB7fTtcbiAgXy5lYWNoKF8ua2V5cyh2YWx1ZXMpLCBmdW5jdGlvbihrKSB7XG4gICAgaWYgKGZpZWxkQ29kZXMuaW5jbHVkZXMoaykpIHtcbiAgICAgIHJldHVybiBmaWx0ZXJWYWx1ZXNba10gPSB2YWx1ZXNba107XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZpbHRlclZhbHVlcztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0ID0gZnVuY3Rpb24oZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgb2JqZWN0SWQpIHtcbiAgdmFyIGZ1bmMsIHJlY29yZCwgc2NyaXB0LCB2YWx1ZXM7XG4gIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKG9iamVjdElkKTtcbiAgc2NyaXB0ID0gXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZWNvcmQpIHsgXCIgKyBmaWVsZF9tYXBfc2NyaXB0ICsgXCIgfVwiO1xuICBmdW5jID0gX2V2YWwoc2NyaXB0LCBcImZpZWxkX21hcF9zY3JpcHRcIik7XG4gIHZhbHVlcyA9IGZ1bmMocmVjb3JkKTtcbiAgaWYgKF8uaXNPYmplY3QodmFsdWVzKSkge1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcihcImV2YWxGaWVsZE1hcFNjcmlwdDog6ISa5pys6L+U5Zue5YC857G75Z6L5LiN5piv5a+56LGhXCIpO1xuICB9XG4gIHJldHVybiB7fTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2ggPSBmdW5jdGlvbihyZWNvcmRJZHMsIHNwYWNlSWQsIGluc0lkLCBhcHByb3ZlSWQpIHtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1snY21zX2ZpbGVzJ10uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgcGFyZW50OiByZWNvcmRJZHNcbiAgfSkuZm9yRWFjaChmdW5jdGlvbihjZikge1xuICAgIHJldHVybiBfLmVhY2goY2YudmVyc2lvbnMsIGZ1bmN0aW9uKHZlcnNpb25JZCwgaWR4KSB7XG4gICAgICB2YXIgZiwgbmV3RmlsZTtcbiAgICAgIGYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zWydjZnMuZmlsZXMuZmlsZXJlY29yZCddLmZpbmRPbmUodmVyc2lvbklkKTtcbiAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgICAgcmV0dXJuIG5ld0ZpbGUuYXR0YWNoRGF0YShmLmNyZWF0ZVJlYWRTdHJlYW0oJ2ZpbGVzJyksIHtcbiAgICAgICAgdHlwZTogZi5vcmlnaW5hbC50eXBlXG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdmFyIG1ldGFkYXRhO1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnIuZXJyb3IsIGVyci5yZWFzb24pO1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUubmFtZShmLm5hbWUoKSk7XG4gICAgICAgIG5ld0ZpbGUuc2l6ZShmLnNpemUoKSk7XG4gICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgIG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxuICAgICAgICAgIG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICBpbnN0YW5jZTogaW5zSWQsXG4gICAgICAgICAgYXBwcm92ZTogYXBwcm92ZUlkLFxuICAgICAgICAgIHBhcmVudDogY2YuX2lkXG4gICAgICAgIH07XG4gICAgICAgIGlmIChpZHggPT09IDApIHtcbiAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgIHJldHVybiBjZnMuaW5zdGFuY2VzLmluc2VydChuZXdGaWxlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8gPSBmdW5jdGlvbihyZWNvcmRJZHMsIGluc0lkLCBzcGFjZUlkKSB7XG4gIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkudXBkYXRlKHJlY29yZElkcy5pZHNbMF0sIHtcbiAgICAkcHVzaDoge1xuICAgICAgaW5zdGFuY2VzOiB7XG4gICAgICAgICRlYWNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgX2lkOiBpbnNJZCxcbiAgICAgICAgICAgIHN0YXRlOiAnZHJhZnQnXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICAkcG9zaXRpb246IDBcbiAgICAgIH1cbiAgICB9LFxuICAgICRzZXQ6IHtcbiAgICAgIGxvY2tlZDogdHJ1ZSxcbiAgICAgIGluc3RhbmNlX3N0YXRlOiAnZHJhZnQnXG4gICAgfVxuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvID0gZnVuY3Rpb24ocmVsYXRlZFRhYmxlc0luZm8sIGluc0lkLCBzcGFjZUlkKSB7XG4gIF8uZWFjaChyZWxhdGVkVGFibGVzSW5mbywgZnVuY3Rpb24odGFibGVJdGVtcywgcmVsYXRlZE9iamVjdE5hbWUpIHtcbiAgICB2YXIgcmVsYXRlZENvbGxlY3Rpb247XG4gICAgcmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpO1xuICAgIHJldHVybiBfLmVhY2godGFibGVJdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIHJlbGF0ZWRDb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoaXRlbS5fdGFibGUuX2lkLCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBpbnN0YW5jZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgX2lkOiBpbnNJZCxcbiAgICAgICAgICAgICAgc3RhdGU6ICdkcmFmdCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdLFxuICAgICAgICAgIF90YWJsZTogaXRlbS5fdGFibGVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja0lzSW5BcHByb3ZhbCA9IGZ1bmN0aW9uKHJlY29yZElkcywgc3BhY2VJZCkge1xuICB2YXIgcmVjb3JkO1xuICByZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLmZpbmRPbmUoe1xuICAgIF9pZDogcmVjb3JkSWRzLmlkc1swXSxcbiAgICBpbnN0YW5jZXM6IHtcbiAgICAgICRleGlzdHM6IHRydWVcbiAgICB9XG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGluc3RhbmNlczogMVxuICAgIH1cbiAgfSk7XG4gIGlmIChyZWNvcmQgJiYgcmVjb3JkLmluc3RhbmNlc1swXS5zdGF0ZSAhPT0gJ2NvbXBsZXRlZCcgJiYgQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZChyZWNvcmQuaW5zdGFuY2VzWzBdLl9pZCkuY291bnQoKSA+IDApIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuatpOiusOW9leW3suWPkei1t+a1geeoi+ato+WcqOWuoeaJueS4re+8jOW+heWuoeaJuee7k+adn+aWueWPr+WPkei1t+S4i+S4gOasoeWuoeaJue+8gVwiKTtcbiAgfVxufTtcbiIsInN0ZWVkb3NBdXRoID0gcmVxdWlyZShcIkBzdGVlZG9zL2F1dGhcIilcbkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9zMy9cIiwgIChyZXEsIHJlcywgbmV4dCkgLT5cblxuXHRKc29uUm91dGVzLnBhcnNlRmlsZXMgcmVxLCByZXMsICgpLT5cblx0XHRjb2xsZWN0aW9uID0gY2ZzLmZpbGVzXG5cdFx0ZmlsZUNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldE9iamVjdChcImNtc19maWxlc1wiKS5kYlxuXG5cdFx0aWYgcmVxLmZpbGVzIGFuZCByZXEuZmlsZXNbMF1cblxuXHRcdFx0bmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XG5cdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEgcmVxLmZpbGVzWzBdLmRhdGEsIHt0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGV9LCAoZXJyKSAtPlxuXHRcdFx0XHRmaWxlbmFtZSA9IHJlcS5maWxlc1swXS5maWxlbmFtZVxuXHRcdFx0XHRleHRlbnRpb24gPSBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpXG5cdFx0XHRcdGlmIFtcImltYWdlLmpwZ1wiLCBcImltYWdlLmdpZlwiLCBcImltYWdlLmpwZWdcIiwgXCJpbWFnZS5wbmdcIl0uaW5jbHVkZXMoZmlsZW5hbWUudG9Mb3dlckNhc2UoKSlcblx0XHRcdFx0XHRmaWxlbmFtZSA9IFwiaW1hZ2UtXCIgKyBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KCdZWVlZTU1EREhIbW1zcycpICsgXCIuXCIgKyBleHRlbnRpb25cblxuXHRcdFx0XHRib2R5ID0gcmVxLmJvZHlcblx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0aWYgYm9keSAmJiAoYm9keVsndXBsb2FkX2Zyb20nXSBpcyBcIklFXCIgb3IgYm9keVsndXBsb2FkX2Zyb20nXSBpcyBcIm5vZGVcIilcblx0XHRcdFx0XHRcdGZpbGVuYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KGZpbGVuYW1lKVxuXHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihmaWxlbmFtZSlcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIGVcblx0XHRcdFx0XHRmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoLyUvZywgXCItXCIpXG5cblx0XHRcdFx0bmV3RmlsZS5uYW1lKGZpbGVuYW1lKVxuXG5cdFx0XHRcdGlmIGJvZHkgJiYgYm9keVsnb3duZXInXSAmJiBib2R5WydzcGFjZSddICYmIGJvZHlbJ3JlY29yZF9pZCddICAmJiBib2R5WydvYmplY3RfbmFtZSddXG5cdFx0XHRcdFx0cGFyZW50ID0gYm9keVsncGFyZW50J11cblx0XHRcdFx0XHRvd25lciA9IGJvZHlbJ293bmVyJ11cblx0XHRcdFx0XHRvd25lcl9uYW1lID0gYm9keVsnb3duZXJfbmFtZSddXG5cdFx0XHRcdFx0c3BhY2UgPSBib2R5WydzcGFjZSddXG5cdFx0XHRcdFx0cmVjb3JkX2lkID0gYm9keVsncmVjb3JkX2lkJ11cblx0XHRcdFx0XHRvYmplY3RfbmFtZSA9IGJvZHlbJ29iamVjdF9uYW1lJ11cblx0XHRcdFx0XHRkZXNjcmlwdGlvbiA9IGJvZHlbJ2Rlc2NyaXB0aW9uJ11cblx0XHRcdFx0XHRwYXJlbnQgPSBib2R5WydwYXJlbnQnXVxuXHRcdFx0XHRcdG1ldGFkYXRhID0ge293bmVyOm93bmVyLCBvd25lcl9uYW1lOm93bmVyX25hbWUsIHNwYWNlOnNwYWNlLCByZWNvcmRfaWQ6cmVjb3JkX2lkLCBvYmplY3RfbmFtZTogb2JqZWN0X25hbWV9XG5cdFx0XHRcdFx0aWYgcGFyZW50XG5cdFx0XHRcdFx0XHRtZXRhZGF0YS5wYXJlbnQgPSBwYXJlbnRcblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGFcblx0XHRcdFx0XHRmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxuXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxuXG5cblx0XHRcdFx0c2l6ZSA9IGZpbGVPYmoub3JpZ2luYWwuc2l6ZVxuXHRcdFx0XHRpZiAhc2l6ZVxuXHRcdFx0XHRcdHNpemUgPSAxMDI0XG5cdFx0XHRcdGlmIHBhcmVudFxuXHRcdFx0XHRcdGZpbGVDb2xsZWN0aW9uLnVwZGF0ZSh7X2lkOnBhcmVudH0se1xuXHRcdFx0XHRcdFx0JHNldDpcblx0XHRcdFx0XHRcdFx0bmFtZTogZmlsZW5hbWVcblx0XHRcdFx0XHRcdFx0ZXh0ZW50aW9uOiBleHRlbnRpb25cblx0XHRcdFx0XHRcdFx0c2l6ZTogc2l6ZVxuXHRcdFx0XHRcdFx0XHRtb2RpZmllZDogKG5ldyBEYXRlKCkpXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiBvd25lclxuXHRcdFx0XHRcdFx0JHB1c2g6XG5cdFx0XHRcdFx0XHRcdHZlcnNpb25zOlxuXHRcdFx0XHRcdFx0XHRcdCRlYWNoOiBbIGZpbGVPYmouX2lkIF1cblx0XHRcdFx0XHRcdFx0XHQkcG9zaXRpb246IDBcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0bmV3RmlsZU9iaklkID0gZmlsZUNvbGxlY3Rpb24uZGlyZWN0Lmluc2VydCB7XG5cdFx0XHRcdFx0XHRuYW1lOiBmaWxlbmFtZVxuXHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uXG5cdFx0XHRcdFx0XHRleHRlbnRpb246IGV4dGVudGlvblxuXHRcdFx0XHRcdFx0c2l6ZTogc2l6ZVxuXHRcdFx0XHRcdFx0dmVyc2lvbnM6IFtmaWxlT2JqLl9pZF1cblx0XHRcdFx0XHRcdHBhcmVudDoge286b2JqZWN0X25hbWUsaWRzOltyZWNvcmRfaWRdfVxuXHRcdFx0XHRcdFx0b3duZXI6IG93bmVyXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2Vcblx0XHRcdFx0XHRcdGNyZWF0ZWQ6IChuZXcgRGF0ZSgpKVxuXHRcdFx0XHRcdFx0Y3JlYXRlZF9ieTogb3duZXJcblx0XHRcdFx0XHRcdG1vZGlmaWVkOiAobmV3IERhdGUoKSlcblx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiBvd25lclxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRmaWxlT2JqLnVwZGF0ZSh7JHNldDogeydtZXRhZGF0YS5wYXJlbnQnIDogbmV3RmlsZU9iaklkfX0pXG5cblx0XHRcdG5ld0ZpbGUub25jZSAnc3RvcmVkJywgKHN0b3JlTmFtZSktPlxuXHRcdFx0XHRzaXplID0gbmV3RmlsZS5vcmlnaW5hbC5zaXplXG5cdFx0XHRcdGlmICFzaXplXG5cdFx0XHRcdFx0c2l6ZSA9IDEwMjRcblx0XHRcdFx0cmVzcCA9XG5cdFx0XHRcdFx0dmVyc2lvbl9pZDogbmV3RmlsZS5faWQsXG5cdFx0XHRcdFx0c2l6ZTogc2l6ZVxuXHRcdFx0XHRyZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcblx0XHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0cmVzLnN0YXR1c0NvZGUgPSA1MDA7XG5cdFx0XHRyZXMuZW5kKCk7XG5cbkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9zMy86Y29sbGVjdGlvblwiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblxuXHRcdHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYygocmVxLCByZXMsIGNiKS0+XG5cdFx0XHRzdGVlZG9zQXV0aC5hdXRoKHJlcSwgcmVzKS50aGVuIChyZXNvbHZlLCByZWplY3QpLT5cblx0XHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxuXHRcdCkocmVxLCByZXMpXG5cdFx0dXNlcklkID0gdXNlclNlc3Npb24udXNlcklkXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKVxuXG5cdFx0Y29sbGVjdGlvbk5hbWUgPSByZXEucGFyYW1zLmNvbGxlY3Rpb25cblxuXHRcdEpzb25Sb3V0ZXMucGFyc2VGaWxlcyByZXEsIHJlcywgKCktPlxuXHRcdFx0Y29sbGVjdGlvbiA9IGNmc1tjb2xsZWN0aW9uTmFtZV1cblxuXHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gQ29sbGVjdGlvblwiKVxuXG5cdFx0XHRpZiByZXEuZmlsZXMgYW5kIHJlcS5maWxlc1swXVxuXG5cdFx0XHRcdG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpXG5cdFx0XHRcdG5ld0ZpbGUubmFtZShyZXEuZmlsZXNbMF0uZmlsZW5hbWUpXG5cblx0XHRcdFx0aWYgcmVxLmJvZHlcblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gcmVxLmJvZHlcblxuXHRcdFx0XHRuZXdGaWxlLm93bmVyID0gdXNlcklkXG5cdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEub3duZXIgPSB1c2VySWRcblxuXHRcdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEgcmVxLmZpbGVzWzBdLmRhdGEsIHt0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGV9XG5cblx0XHRcdFx0Y29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxuXG5cdFx0XHRcdG5ld0ZpbGUub25jZSAnc3RvcmVkJywgKHN0b3JlTmFtZSktPlxuXHRcdFx0XHRcdHJlc3VsdERhdGEgPSBjb2xsZWN0aW9uLmZpbGVzLmZpbmRPbmUobmV3RmlsZS5faWQpXG5cdFx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdFx0XHRcdGNvZGU6IDIwMFxuXHRcdFx0XHRcdFx0ZGF0YTogcmVzdWx0RGF0YVxuXHRcdFx0XHRcdHJldHVyblxuXG5cdFx0XHRcdFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBGaWxlXCIpXG5cblx0XHRyZXR1cm5cblx0Y2F0Y2ggZVxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdGNvZGU6IGUuZXJyb3IgfHwgNTAwXG5cdFx0XHRkYXRhOiB7ZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2V9XG5cdFx0fVxuXG5cblxuZ2V0UXVlcnlTdHJpbmcgPSAoYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgcXVlcnksIG1ldGhvZCkgLT5cblx0Y29uc29sZS5sb2cgXCItLS0tdXVmbG93TWFuYWdlci5nZXRRdWVyeVN0cmluZy0tLS1cIlxuXHRBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJylcblx0ZGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpXG5cblx0cXVlcnkuRm9ybWF0ID0gXCJqc29uXCJcblx0cXVlcnkuVmVyc2lvbiA9IFwiMjAxNy0wMy0yMVwiXG5cdHF1ZXJ5LkFjY2Vzc0tleUlkID0gYWNjZXNzS2V5SWRcblx0cXVlcnkuU2lnbmF0dXJlTWV0aG9kID0gXCJITUFDLVNIQTFcIlxuXHRxdWVyeS5UaW1lc3RhbXAgPSBBTFkudXRpbC5kYXRlLmlzbzg2MDEoZGF0ZSlcblx0cXVlcnkuU2lnbmF0dXJlVmVyc2lvbiA9IFwiMS4wXCJcblx0cXVlcnkuU2lnbmF0dXJlTm9uY2UgPSBTdHJpbmcoZGF0ZS5nZXRUaW1lKCkpXG5cblx0cXVlcnlLZXlzID0gT2JqZWN0LmtleXMocXVlcnkpXG5cdHF1ZXJ5S2V5cy5zb3J0KClcblxuXHRjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcgPSBcIlwiXG5cdHF1ZXJ5S2V5cy5mb3JFYWNoIChuYW1lKSAtPlxuXHRcdGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyArPSBcIiZcIiArIG5hbWUgKyBcIj1cIiArIEFMWS51dGlsLnBvcEVzY2FwZShxdWVyeVtuYW1lXSlcblxuXHRzdHJpbmdUb1NpZ24gPSBtZXRob2QudG9VcHBlckNhc2UoKSArICcmJTJGJicgKyBBTFkudXRpbC5wb3BFc2NhcGUoY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nLnN1YnN0cigxKSlcblxuXHRxdWVyeS5TaWduYXR1cmUgPSBBTFkudXRpbC5jcnlwdG8uaG1hYyhzZWNyZXRBY2Nlc3NLZXkgKyAnJicsIHN0cmluZ1RvU2lnbiwgJ2Jhc2U2NCcsICdzaGExJylcblxuXHRxdWVyeVN0ciA9IEFMWS51dGlsLnF1ZXJ5UGFyYW1zVG9TdHJpbmcocXVlcnkpXG5cdGNvbnNvbGUubG9nIHF1ZXJ5U3RyXG5cdHJldHVybiBxdWVyeVN0clxuXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvczMvdm9kL3VwbG9hZFwiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKVxuXG5cdFx0Y29sbGVjdGlvbk5hbWUgPSBcInZpZGVvc1wiXG5cblx0XHRBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJylcblxuXHRcdEpzb25Sb3V0ZXMucGFyc2VGaWxlcyByZXEsIHJlcywgKCktPlxuXHRcdFx0Y29sbGVjdGlvbiA9IGNmc1tjb2xsZWN0aW9uTmFtZV1cblxuXHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gQ29sbGVjdGlvblwiKVxuXG5cdFx0XHRpZiByZXEuZmlsZXMgYW5kIHJlcS5maWxlc1swXVxuXG5cdFx0XHRcdGlmIGNvbGxlY3Rpb25OYW1lIGlzICd2aWRlb3MnIGFuZCBNZXRlb3Iuc2V0dGluZ3MucHVibGljLmNmcz8uc3RvcmUgaXMgXCJPU1NcIlxuXHRcdFx0XHRcdGFjY2Vzc0tleUlkID0gTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4/LmFjY2Vzc0tleUlkXG5cdFx0XHRcdFx0c2VjcmV0QWNjZXNzS2V5ID0gTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4/LnNlY3JldEFjY2Vzc0tleVxuXG5cdFx0XHRcdFx0ZGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpXG5cblx0XHRcdFx0XHRxdWVyeSA9IHtcblx0XHRcdFx0XHRcdEFjdGlvbjogXCJDcmVhdGVVcGxvYWRWaWRlb1wiXG5cdFx0XHRcdFx0XHRUaXRsZTogcmVxLmZpbGVzWzBdLmZpbGVuYW1lXG5cdFx0XHRcdFx0XHRGaWxlTmFtZTogcmVxLmZpbGVzWzBdLmZpbGVuYW1lXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dXJsID0gXCJodHRwOi8vdm9kLmNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS8/XCIgKyBnZXRRdWVyeVN0cmluZyhhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBxdWVyeSwgJ0dFVCcpXG5cblx0XHRcdFx0XHRyID0gSFRUUC5jYWxsICdHRVQnLCB1cmxcblxuXHRcdFx0XHRcdGNvbnNvbGUubG9nIHJcblxuXHRcdFx0XHRcdGlmIHIuZGF0YT8uVmlkZW9JZFxuXHRcdFx0XHRcdFx0dmlkZW9JZCA9IHIuZGF0YS5WaWRlb0lkXG5cdFx0XHRcdFx0XHR1cGxvYWRBZGRyZXNzID0gSlNPTi5wYXJzZShuZXcgQnVmZmVyKHIuZGF0YS5VcGxvYWRBZGRyZXNzLCAnYmFzZTY0JykudG9TdHJpbmcoKSlcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nIHVwbG9hZEFkZHJlc3Ncblx0XHRcdFx0XHRcdHVwbG9hZEF1dGggPSBKU09OLnBhcnNlKG5ldyBCdWZmZXIoci5kYXRhLlVwbG9hZEF1dGgsICdiYXNlNjQnKS50b1N0cmluZygpKVxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cgdXBsb2FkQXV0aFxuXG5cdFx0XHRcdFx0XHRvc3MgPSBuZXcgQUxZLk9TUyh7XG5cdFx0XHRcdFx0XHRcdFwiYWNjZXNzS2V5SWRcIjogdXBsb2FkQXV0aC5BY2Nlc3NLZXlJZCxcblx0XHRcdFx0XHRcdFx0XCJzZWNyZXRBY2Nlc3NLZXlcIjogdXBsb2FkQXV0aC5BY2Nlc3NLZXlTZWNyZXQsXG5cdFx0XHRcdFx0XHRcdFwiZW5kcG9pbnRcIjogdXBsb2FkQWRkcmVzcy5FbmRwb2ludCxcblx0XHRcdFx0XHRcdFx0XCJhcGlWZXJzaW9uXCI6ICcyMDEzLTEwLTE1Jyxcblx0XHRcdFx0XHRcdFx0XCJzZWN1cml0eVRva2VuXCI6IHVwbG9hZEF1dGguU2VjdXJpdHlUb2tlblxuXHRcdFx0XHRcdFx0fSlcblxuXHRcdFx0XHRcdFx0b3NzLnB1dE9iamVjdCB7XG5cdFx0XHRcdFx0XHRcdEJ1Y2tldDogdXBsb2FkQWRkcmVzcy5CdWNrZXQsXG5cdFx0XHRcdFx0XHRcdEtleTogdXBsb2FkQWRkcmVzcy5GaWxlTmFtZSxcblx0XHRcdFx0XHRcdFx0Qm9keTogcmVxLmZpbGVzWzBdLmRhdGEsXG5cdFx0XHRcdFx0XHRcdEFjY2Vzc0NvbnRyb2xBbGxvd09yaWdpbjogJycsXG5cdFx0XHRcdFx0XHRcdENvbnRlbnRUeXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGUsXG5cdFx0XHRcdFx0XHRcdENhY2hlQ29udHJvbDogJ25vLWNhY2hlJyxcblx0XHRcdFx0XHRcdFx0Q29udGVudERpc3Bvc2l0aW9uOiAnJyxcblx0XHRcdFx0XHRcdFx0Q29udGVudEVuY29kaW5nOiAndXRmLTgnLFxuXHRcdFx0XHRcdFx0XHRTZXJ2ZXJTaWRlRW5jcnlwdGlvbjogJ0FFUzI1NicsXG5cdFx0XHRcdFx0XHRcdEV4cGlyZXM6IG51bGxcblx0XHRcdFx0XHRcdH0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQgKGVyciwgZGF0YSkgLT5cblxuXHRcdFx0XHRcdFx0XHRpZiBlcnJcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnZXJyb3I6JywgZXJyKVxuXHRcdFx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlcnIubWVzc2FnZSlcblxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnc3VjY2VzczonLCBkYXRhKVxuXG5cdFx0XHRcdFx0XHRcdG5ld0RhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKVxuXG5cdFx0XHRcdFx0XHRcdGdldFBsYXlJbmZvUXVlcnkgPSB7XG5cdFx0XHRcdFx0XHRcdFx0QWN0aW9uOiAnR2V0UGxheUluZm8nXG5cdFx0XHRcdFx0XHRcdFx0VmlkZW9JZDogdmlkZW9JZFxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Z2V0UGxheUluZm9VcmwgPSBcImh0dHA6Ly92b2QuY24tc2hhbmdoYWkuYWxpeXVuY3MuY29tLz9cIiArIGdldFF1ZXJ5U3RyaW5nKGFjY2Vzc0tleUlkLCBzZWNyZXRBY2Nlc3NLZXksIGdldFBsYXlJbmZvUXVlcnksICdHRVQnKVxuXG5cdFx0XHRcdFx0XHRcdGdldFBsYXlJbmZvUmVzdWx0ID0gSFRUUC5jYWxsICdHRVQnLCBnZXRQbGF5SW5mb1VybFxuXG5cdFx0XHRcdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRcdFx0XHRcdFx0Y29kZTogMjAwXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YTogZ2V0UGxheUluZm9SZXN1bHRcblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBGaWxlXCIpXG5cblx0XHRyZXR1cm5cblx0Y2F0Y2ggZVxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdGNvZGU6IGUuZXJyb3IgfHwgNTAwXG5cdFx0XHRkYXRhOiB7ZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2V9XG5cdFx0fSIsInZhciBnZXRRdWVyeVN0cmluZywgc3RlZWRvc0F1dGg7XG5cbnN0ZWVkb3NBdXRoID0gcmVxdWlyZShcIkBzdGVlZG9zL2F1dGhcIik7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9zMy9cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyhyZXEsIHJlcywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGZpbGVDb2xsZWN0aW9uLCBuZXdGaWxlO1xuICAgIGNvbGxlY3Rpb24gPSBjZnMuZmlsZXM7XG4gICAgZmlsZUNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldE9iamVjdChcImNtc19maWxlc1wiKS5kYjtcbiAgICBpZiAocmVxLmZpbGVzICYmIHJlcS5maWxlc1swXSkge1xuICAgICAgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XG4gICAgICBuZXdGaWxlLmF0dGFjaERhdGEocmVxLmZpbGVzWzBdLmRhdGEsIHtcbiAgICAgICAgdHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlXG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdmFyIGJvZHksIGRlc2NyaXB0aW9uLCBlLCBleHRlbnRpb24sIGZpbGVPYmosIGZpbGVuYW1lLCBtZXRhZGF0YSwgbmV3RmlsZU9iaklkLCBvYmplY3RfbmFtZSwgb3duZXIsIG93bmVyX25hbWUsIHBhcmVudCwgcmVjb3JkX2lkLCBzaXplLCBzcGFjZTtcbiAgICAgICAgZmlsZW5hbWUgPSByZXEuZmlsZXNbMF0uZmlsZW5hbWU7XG4gICAgICAgIGV4dGVudGlvbiA9IGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICAgIGlmIChbXCJpbWFnZS5qcGdcIiwgXCJpbWFnZS5naWZcIiwgXCJpbWFnZS5qcGVnXCIsIFwiaW1hZ2UucG5nXCJdLmluY2x1ZGVzKGZpbGVuYW1lLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgZmlsZW5hbWUgPSBcImltYWdlLVwiICsgbW9tZW50KG5ldyBEYXRlKCkpLmZvcm1hdCgnWVlZWU1NRERISG1tc3MnKSArIFwiLlwiICsgZXh0ZW50aW9uO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkgPSByZXEuYm9keTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoYm9keSAmJiAoYm9keVsndXBsb2FkX2Zyb20nXSA9PT0gXCJJRVwiIHx8IGJvZHlbJ3VwbG9hZF9mcm9tJ10gPT09IFwibm9kZVwiKSkge1xuICAgICAgICAgICAgZmlsZW5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQoZmlsZW5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihmaWxlbmFtZSk7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoLyUvZywgXCItXCIpO1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUubmFtZShmaWxlbmFtZSk7XG4gICAgICAgIGlmIChib2R5ICYmIGJvZHlbJ293bmVyJ10gJiYgYm9keVsnc3BhY2UnXSAmJiBib2R5WydyZWNvcmRfaWQnXSAmJiBib2R5WydvYmplY3RfbmFtZSddKSB7XG4gICAgICAgICAgcGFyZW50ID0gYm9keVsncGFyZW50J107XG4gICAgICAgICAgb3duZXIgPSBib2R5Wydvd25lciddO1xuICAgICAgICAgIG93bmVyX25hbWUgPSBib2R5Wydvd25lcl9uYW1lJ107XG4gICAgICAgICAgc3BhY2UgPSBib2R5WydzcGFjZSddO1xuICAgICAgICAgIHJlY29yZF9pZCA9IGJvZHlbJ3JlY29yZF9pZCddO1xuICAgICAgICAgIG9iamVjdF9uYW1lID0gYm9keVsnb2JqZWN0X25hbWUnXTtcbiAgICAgICAgICBkZXNjcmlwdGlvbiA9IGJvZHlbJ2Rlc2NyaXB0aW9uJ107XG4gICAgICAgICAgcGFyZW50ID0gYm9keVsncGFyZW50J107XG4gICAgICAgICAgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICBvd25lcl9uYW1lOiBvd25lcl9uYW1lLFxuICAgICAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICAgICAgcmVjb3JkX2lkOiByZWNvcmRfaWQsXG4gICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgc2l6ZSA9IGZpbGVPYmoub3JpZ2luYWwuc2l6ZTtcbiAgICAgICAgaWYgKCFzaXplKSB7XG4gICAgICAgICAgc2l6ZSA9IDEwMjQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgIHJldHVybiBmaWxlQ29sbGVjdGlvbi51cGRhdGUoe1xuICAgICAgICAgICAgX2lkOiBwYXJlbnRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgIG5hbWU6IGZpbGVuYW1lLFxuICAgICAgICAgICAgICBleHRlbnRpb246IGV4dGVudGlvbixcbiAgICAgICAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgICAgICAgbW9kaWZpZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICAgIG1vZGlmaWVkX2J5OiBvd25lclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICRwdXNoOiB7XG4gICAgICAgICAgICAgIHZlcnNpb25zOiB7XG4gICAgICAgICAgICAgICAgJGVhY2g6IFtmaWxlT2JqLl9pZF0sXG4gICAgICAgICAgICAgICAgJHBvc2l0aW9uOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdGaWxlT2JqSWQgPSBmaWxlQ29sbGVjdGlvbi5kaXJlY3QuaW5zZXJ0KHtcbiAgICAgICAgICAgIG5hbWU6IGZpbGVuYW1lLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgZXh0ZW50aW9uOiBleHRlbnRpb24sXG4gICAgICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICAgICAgdmVyc2lvbnM6IFtmaWxlT2JqLl9pZF0sXG4gICAgICAgICAgICBwYXJlbnQ6IHtcbiAgICAgICAgICAgICAgbzogb2JqZWN0X25hbWUsXG4gICAgICAgICAgICAgIGlkczogW3JlY29yZF9pZF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgY3JlYXRlZF9ieTogb3duZXIsXG4gICAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIG1vZGlmaWVkX2J5OiBvd25lclxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBmaWxlT2JqLnVwZGF0ZSh7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICdtZXRhZGF0YS5wYXJlbnQnOiBuZXdGaWxlT2JqSWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gbmV3RmlsZS5vbmNlKCdzdG9yZWQnLCBmdW5jdGlvbihzdG9yZU5hbWUpIHtcbiAgICAgICAgdmFyIHJlc3AsIHNpemU7XG4gICAgICAgIHNpemUgPSBuZXdGaWxlLm9yaWdpbmFsLnNpemU7XG4gICAgICAgIGlmICghc2l6ZSkge1xuICAgICAgICAgIHNpemUgPSAxMDI0O1xuICAgICAgICB9XG4gICAgICAgIHJlc3AgPSB7XG4gICAgICAgICAgdmVyc2lvbl9pZDogbmV3RmlsZS5faWQsXG4gICAgICAgICAgc2l6ZTogc2l6ZVxuICAgICAgICB9O1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgIHJldHVybiByZXMuZW5kKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvczMvOmNvbGxlY3Rpb25cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGNvbGxlY3Rpb25OYW1lLCBlLCB1c2VySWQsIHVzZXJTZXNzaW9uO1xuICB0cnkge1xuICAgIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihyZXEsIHJlcywgY2IpIHtcbiAgICAgIHJldHVybiBzdGVlZG9zQXV0aC5hdXRoKHJlcSwgcmVzKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgIH0pO1xuICAgIH0pKHJlcSwgcmVzKTtcbiAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWQ7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIHBlcm1pc3Npb25cIik7XG4gICAgfVxuICAgIGNvbGxlY3Rpb25OYW1lID0gcmVxLnBhcmFtcy5jb2xsZWN0aW9uO1xuICAgIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyhyZXEsIHJlcywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgbmV3RmlsZTtcbiAgICAgIGNvbGxlY3Rpb24gPSBjZnNbY29sbGVjdGlvbk5hbWVdO1xuICAgICAgaWYgKCFjb2xsZWN0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIENvbGxlY3Rpb25cIik7XG4gICAgICB9XG4gICAgICBpZiAocmVxLmZpbGVzICYmIHJlcS5maWxlc1swXSkge1xuICAgICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgICAgbmV3RmlsZS5uYW1lKHJlcS5maWxlc1swXS5maWxlbmFtZSk7XG4gICAgICAgIGlmIChyZXEuYm9keSkge1xuICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSByZXEuYm9keTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm93bmVyID0gdXNlcklkO1xuICAgICAgICBuZXdGaWxlLm1ldGFkYXRhLm93bmVyID0gdXNlcklkO1xuICAgICAgICBuZXdGaWxlLmF0dGFjaERhdGEocmVxLmZpbGVzWzBdLmRhdGEsIHtcbiAgICAgICAgICB0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGVcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbGxlY3Rpb24uaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgICByZXR1cm4gbmV3RmlsZS5vbmNlKCdzdG9yZWQnLCBmdW5jdGlvbihzdG9yZU5hbWUpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0RGF0YTtcbiAgICAgICAgICByZXN1bHREYXRhID0gY29sbGVjdGlvbi5maWxlcy5maW5kT25lKG5ld0ZpbGUuX2lkKTtcbiAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiByZXN1bHREYXRhXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gRmlsZVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogZS5lcnJvciB8fCA1MDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuXG5nZXRRdWVyeVN0cmluZyA9IGZ1bmN0aW9uKGFjY2Vzc0tleUlkLCBzZWNyZXRBY2Nlc3NLZXksIHF1ZXJ5LCBtZXRob2QpIHtcbiAgdmFyIEFMWSwgY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nLCBkYXRlLCBxdWVyeUtleXMsIHF1ZXJ5U3RyLCBzdHJpbmdUb1NpZ247XG4gIGNvbnNvbGUubG9nKFwiLS0tLXV1Zmxvd01hbmFnZXIuZ2V0UXVlcnlTdHJpbmctLS0tXCIpO1xuICBBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJyk7XG4gIGRhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKTtcbiAgcXVlcnkuRm9ybWF0ID0gXCJqc29uXCI7XG4gIHF1ZXJ5LlZlcnNpb24gPSBcIjIwMTctMDMtMjFcIjtcbiAgcXVlcnkuQWNjZXNzS2V5SWQgPSBhY2Nlc3NLZXlJZDtcbiAgcXVlcnkuU2lnbmF0dXJlTWV0aG9kID0gXCJITUFDLVNIQTFcIjtcbiAgcXVlcnkuVGltZXN0YW1wID0gQUxZLnV0aWwuZGF0ZS5pc284NjAxKGRhdGUpO1xuICBxdWVyeS5TaWduYXR1cmVWZXJzaW9uID0gXCIxLjBcIjtcbiAgcXVlcnkuU2lnbmF0dXJlTm9uY2UgPSBTdHJpbmcoZGF0ZS5nZXRUaW1lKCkpO1xuICBxdWVyeUtleXMgPSBPYmplY3Qua2V5cyhxdWVyeSk7XG4gIHF1ZXJ5S2V5cy5zb3J0KCk7XG4gIGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyA9IFwiXCI7XG4gIHF1ZXJ5S2V5cy5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nICs9IFwiJlwiICsgbmFtZSArIFwiPVwiICsgQUxZLnV0aWwucG9wRXNjYXBlKHF1ZXJ5W25hbWVdKTtcbiAgfSk7XG4gIHN0cmluZ1RvU2lnbiA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpICsgJyYlMkYmJyArIEFMWS51dGlsLnBvcEVzY2FwZShjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcuc3Vic3RyKDEpKTtcbiAgcXVlcnkuU2lnbmF0dXJlID0gQUxZLnV0aWwuY3J5cHRvLmhtYWMoc2VjcmV0QWNjZXNzS2V5ICsgJyYnLCBzdHJpbmdUb1NpZ24sICdiYXNlNjQnLCAnc2hhMScpO1xuICBxdWVyeVN0ciA9IEFMWS51dGlsLnF1ZXJ5UGFyYW1zVG9TdHJpbmcocXVlcnkpO1xuICBjb25zb2xlLmxvZyhxdWVyeVN0cik7XG4gIHJldHVybiBxdWVyeVN0cjtcbn07XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9zMy92b2QvdXBsb2FkXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBBTFksIGNvbGxlY3Rpb25OYW1lLCBlLCB1c2VySWQ7XG4gIHRyeSB7XG4gICAgdXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKTtcbiAgICB9XG4gICAgY29sbGVjdGlvbk5hbWUgPSBcInZpZGVvc1wiO1xuICAgIEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKTtcbiAgICBKc29uUm91dGVzLnBhcnNlRmlsZXMocmVxLCByZXMsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFjY2Vzc0tleUlkLCBjb2xsZWN0aW9uLCBkYXRlLCBvc3MsIHF1ZXJ5LCByLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHNlY3JldEFjY2Vzc0tleSwgdXBsb2FkQWRkcmVzcywgdXBsb2FkQXV0aCwgdXJsLCB2aWRlb0lkO1xuICAgICAgY29sbGVjdGlvbiA9IGNmc1tjb2xsZWN0aW9uTmFtZV07XG4gICAgICBpZiAoIWNvbGxlY3Rpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gQ29sbGVjdGlvblwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXEuZmlsZXMgJiYgcmVxLmZpbGVzWzBdKSB7XG4gICAgICAgIGlmIChjb2xsZWN0aW9uTmFtZSA9PT0gJ3ZpZGVvcycgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0uY2ZzKSAhPSBudWxsID8gcmVmLnN0b3JlIDogdm9pZCAwKSA9PT0gXCJPU1NcIikge1xuICAgICAgICAgIGFjY2Vzc0tleUlkID0gKHJlZjEgPSBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bikgIT0gbnVsbCA/IHJlZjEuYWNjZXNzS2V5SWQgOiB2b2lkIDA7XG4gICAgICAgICAgc2VjcmV0QWNjZXNzS2V5ID0gKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bikgIT0gbnVsbCA/IHJlZjIuc2VjcmV0QWNjZXNzS2V5IDogdm9pZCAwO1xuICAgICAgICAgIGRhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKTtcbiAgICAgICAgICBxdWVyeSA9IHtcbiAgICAgICAgICAgIEFjdGlvbjogXCJDcmVhdGVVcGxvYWRWaWRlb1wiLFxuICAgICAgICAgICAgVGl0bGU6IHJlcS5maWxlc1swXS5maWxlbmFtZSxcbiAgICAgICAgICAgIEZpbGVOYW1lOiByZXEuZmlsZXNbMF0uZmlsZW5hbWVcbiAgICAgICAgICB9O1xuICAgICAgICAgIHVybCA9IFwiaHR0cDovL3ZvZC5jbi1zaGFuZ2hhaS5hbGl5dW5jcy5jb20vP1wiICsgZ2V0UXVlcnlTdHJpbmcoYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgcXVlcnksICdHRVQnKTtcbiAgICAgICAgICByID0gSFRUUC5jYWxsKCdHRVQnLCB1cmwpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHIpO1xuICAgICAgICAgIGlmICgocmVmMyA9IHIuZGF0YSkgIT0gbnVsbCA/IHJlZjMuVmlkZW9JZCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgdmlkZW9JZCA9IHIuZGF0YS5WaWRlb0lkO1xuICAgICAgICAgICAgdXBsb2FkQWRkcmVzcyA9IEpTT04ucGFyc2UobmV3IEJ1ZmZlcihyLmRhdGEuVXBsb2FkQWRkcmVzcywgJ2Jhc2U2NCcpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codXBsb2FkQWRkcmVzcyk7XG4gICAgICAgICAgICB1cGxvYWRBdXRoID0gSlNPTi5wYXJzZShuZXcgQnVmZmVyKHIuZGF0YS5VcGxvYWRBdXRoLCAnYmFzZTY0JykudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1cGxvYWRBdXRoKTtcbiAgICAgICAgICAgIG9zcyA9IG5ldyBBTFkuT1NTKHtcbiAgICAgICAgICAgICAgXCJhY2Nlc3NLZXlJZFwiOiB1cGxvYWRBdXRoLkFjY2Vzc0tleUlkLFxuICAgICAgICAgICAgICBcInNlY3JldEFjY2Vzc0tleVwiOiB1cGxvYWRBdXRoLkFjY2Vzc0tleVNlY3JldCxcbiAgICAgICAgICAgICAgXCJlbmRwb2ludFwiOiB1cGxvYWRBZGRyZXNzLkVuZHBvaW50LFxuICAgICAgICAgICAgICBcImFwaVZlcnNpb25cIjogJzIwMTMtMTAtMTUnLFxuICAgICAgICAgICAgICBcInNlY3VyaXR5VG9rZW5cIjogdXBsb2FkQXV0aC5TZWN1cml0eVRva2VuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBvc3MucHV0T2JqZWN0KHtcbiAgICAgICAgICAgICAgQnVja2V0OiB1cGxvYWRBZGRyZXNzLkJ1Y2tldCxcbiAgICAgICAgICAgICAgS2V5OiB1cGxvYWRBZGRyZXNzLkZpbGVOYW1lLFxuICAgICAgICAgICAgICBCb2R5OiByZXEuZmlsZXNbMF0uZGF0YSxcbiAgICAgICAgICAgICAgQWNjZXNzQ29udHJvbEFsbG93T3JpZ2luOiAnJyxcbiAgICAgICAgICAgICAgQ29udGVudFR5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZSxcbiAgICAgICAgICAgICAgQ2FjaGVDb250cm9sOiAnbm8tY2FjaGUnLFxuICAgICAgICAgICAgICBDb250ZW50RGlzcG9zaXRpb246ICcnLFxuICAgICAgICAgICAgICBDb250ZW50RW5jb2Rpbmc6ICd1dGYtOCcsXG4gICAgICAgICAgICAgIFNlcnZlclNpZGVFbmNyeXB0aW9uOiAnQUVTMjU2JyxcbiAgICAgICAgICAgICAgRXhwaXJlczogbnVsbFxuICAgICAgICAgICAgfSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgICAgdmFyIGdldFBsYXlJbmZvUXVlcnksIGdldFBsYXlJbmZvUmVzdWx0LCBnZXRQbGF5SW5mb1VybCwgbmV3RGF0ZTtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjonLCBlcnIpO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3N1Y2Nlc3M6JywgZGF0YSk7XG4gICAgICAgICAgICAgIG5ld0RhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKTtcbiAgICAgICAgICAgICAgZ2V0UGxheUluZm9RdWVyeSA9IHtcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdHZXRQbGF5SW5mbycsXG4gICAgICAgICAgICAgICAgVmlkZW9JZDogdmlkZW9JZFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBnZXRQbGF5SW5mb1VybCA9IFwiaHR0cDovL3ZvZC5jbi1zaGFuZ2hhaS5hbGl5dW5jcy5jb20vP1wiICsgZ2V0UXVlcnlTdHJpbmcoYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgZ2V0UGxheUluZm9RdWVyeSwgJ0dFVCcpO1xuICAgICAgICAgICAgICBnZXRQbGF5SW5mb1Jlc3VsdCA9IEhUVFAuY2FsbCgnR0VUJywgZ2V0UGxheUluZm9VcmwpO1xuICAgICAgICAgICAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBnZXRQbGF5SW5mb1Jlc3VsdFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIEZpbGVcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IGUuZXJyb3IgfHwgNTAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvb2JqZWN0L3dvcmtmbG93L2RyYWZ0cycsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0dHJ5XG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxuXHRcdGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZFxuXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxuXG5cdFx0aW5zZXJ0ZWRfaW5zdGFuY2VzID0gbmV3IEFycmF5XG5cblx0XHRfLmVhY2ggaGFzaERhdGFbJ0luc3RhbmNlcyddLCAoaW5zdGFuY2VfZnJvbV9jbGllbnQpIC0+XG5cdFx0XHRuZXdfaW5zX2lkID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UoaW5zdGFuY2VfZnJvbV9jbGllbnQsIGN1cnJlbnRfdXNlcl9pbmZvKVxuXG5cdFx0XHRuZXdfaW5zID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZE9uZSh7IF9pZDogbmV3X2luc19pZCB9LCB7IGZpZWxkczogeyBzcGFjZTogMSwgZmxvdzogMSwgZmxvd192ZXJzaW9uOiAxLCBmb3JtOiAxLCBmb3JtX3ZlcnNpb246IDEgfSB9KVxuXG5cdFx0XHRpbnNlcnRlZF9pbnN0YW5jZXMucHVzaChuZXdfaW5zKVxuXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGluc2VydHM6IGluc2VydGVkX2luc3RhbmNlcyB9XG5cdFx0fVxuXHRjYXRjaCBlXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3sgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfV0gfVxuXHRcdH1cblxuIiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS9vYmplY3Qvd29ya2Zsb3cvZHJhZnRzJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGN1cnJlbnRfdXNlcl9pZCwgY3VycmVudF91c2VyX2luZm8sIGUsIGhhc2hEYXRhLCBpbnNlcnRlZF9pbnN0YW5jZXM7XG4gIHRyeSB7XG4gICAgY3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKTtcbiAgICBjdXJyZW50X3VzZXJfaWQgPSBjdXJyZW50X3VzZXJfaW5mby5faWQ7XG4gICAgaGFzaERhdGEgPSByZXEuYm9keTtcbiAgICBpbnNlcnRlZF9pbnN0YW5jZXMgPSBuZXcgQXJyYXk7XG4gICAgXy5lYWNoKGhhc2hEYXRhWydJbnN0YW5jZXMnXSwgZnVuY3Rpb24oaW5zdGFuY2VfZnJvbV9jbGllbnQpIHtcbiAgICAgIHZhciBuZXdfaW5zLCBuZXdfaW5zX2lkO1xuICAgICAgbmV3X2luc19pZCA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY3JlYXRlX2luc3RhbmNlKGluc3RhbmNlX2Zyb21fY2xpZW50LCBjdXJyZW50X3VzZXJfaW5mbyk7XG4gICAgICBuZXdfaW5zID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogbmV3X2luc19pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBzcGFjZTogMSxcbiAgICAgICAgICBmbG93OiAxLFxuICAgICAgICAgIGZsb3dfdmVyc2lvbjogMSxcbiAgICAgICAgICBmb3JtOiAxLFxuICAgICAgICAgIGZvcm1fdmVyc2lvbjogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBpbnNlcnRlZF9pbnN0YW5jZXMucHVzaChuZXdfaW5zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBpbnNlcnRzOiBpbnNlcnRlZF9pbnN0YW5jZXNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==
