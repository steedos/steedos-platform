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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjcmVhdG9yL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvbGliL2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvb2JqZWN0X3JlY2VudF92aWV3ZWQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3ZpZXdlZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3JlY29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9yZWNlbnRfcmVjb3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9yZXBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3JlcG9ydF9kYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfZXhwb3J0MnhtbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9leHBvcnQyeG1sLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3JlbGF0ZWRfb2JqZWN0c19yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvcGVuZGluZ19zcGFjZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3BlbmRpbmdfc3BhY2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF90YWJ1bGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF9saXN0dmlld3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy91c2VyX3RhYnVsYXJfc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9yZWxhdGVkX29iamVjdHNfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV91c2VyX2luZm8uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c192aWV3X2xpbWl0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfdmlld19saW1pdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c19ub19mb3JjZV9waG9uZV91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9uZWVkX3RvX2NvbmZpcm0uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX25lZWRfdG9fY29uZmlybS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbGliL3Blcm1pc3Npb25fbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvcGVybWlzc2lvbl9tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9zMy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImJ1c2JveSIsIm1rZGlycCIsIk1ldGVvciIsInNldHRpbmdzIiwiY2ZzIiwiYWxpeXVuIiwiQ3JlYXRvciIsImdldFNjaGVtYSIsIm9iamVjdF9uYW1lIiwicmVmIiwiZ2V0T2JqZWN0Iiwic2NoZW1hIiwiZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCIsImlzQ2xpZW50IiwiUmVhY3RTdGVlZG9zIiwicGx1Z2luQ29tcG9uZW50U2VsZWN0b3IiLCJzdG9yZSIsImdldFN0YXRlIiwiZ2V0T2JqZWN0VXJsIiwicmVjb3JkX2lkIiwiYXBwX2lkIiwibGlzdF92aWV3IiwibGlzdF92aWV3X2lkIiwiU2Vzc2lvbiIsImdldCIsImdldExpc3RWaWV3IiwiX2lkIiwiZ2V0UmVsYXRpdmVVcmwiLCJnZXRPYmplY3RBYnNvbHV0ZVVybCIsIlN0ZWVkb3MiLCJhYnNvbHV0ZVVybCIsImdldE9iamVjdFJvdXRlclVybCIsImdldExpc3RWaWV3VXJsIiwidXJsIiwiZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybCIsImdldFN3aXRjaExpc3RVcmwiLCJnZXRSZWxhdGVkT2JqZWN0VXJsIiwicmVsYXRlZF9vYmplY3RfbmFtZSIsInJlbGF0ZWRfZmllbGRfbmFtZSIsImdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyIsImlzX2RlZXAiLCJpc19za2lwX2hpZGUiLCJpc19yZWxhdGVkIiwiX29iamVjdCIsIl9vcHRpb25zIiwiZmllbGRzIiwiaWNvbiIsInJlbGF0ZWRPYmplY3RzIiwiXyIsImZvckVhY2giLCJmIiwiayIsImhpZGRlbiIsInR5cGUiLCJwdXNoIiwibGFiZWwiLCJ2YWx1ZSIsInJfb2JqZWN0IiwicmVmZXJlbmNlX3RvIiwiaXNTdHJpbmciLCJmMiIsImsyIiwiZ2V0UmVsYXRlZE9iamVjdHMiLCJlYWNoIiwiX3RoaXMiLCJfcmVsYXRlZE9iamVjdCIsInJlbGF0ZWRPYmplY3QiLCJyZWxhdGVkT3B0aW9ucyIsInJlbGF0ZWRPcHRpb24iLCJmb3JlaWduX2tleSIsIm5hbWUiLCJnZXRPYmplY3RGaWx0ZXJGaWVsZE9wdGlvbnMiLCJwZXJtaXNzaW9uX2ZpZWxkcyIsImdldEZpZWxkcyIsImluY2x1ZGUiLCJ0ZXN0IiwiaW5kZXhPZiIsImdldE9iamVjdEZpZWxkT3B0aW9ucyIsImdldEZpbHRlcnNXaXRoRmlsdGVyRmllbGRzIiwiZmlsdGVycyIsImZpbHRlcl9maWVsZHMiLCJsZW5ndGgiLCJuIiwiZmllbGQiLCJyZXF1aXJlZCIsImZpbmRXaGVyZSIsImlzX2RlZmF1bHQiLCJpc19yZXF1aXJlZCIsImZpbHRlckl0ZW0iLCJtYXRjaEZpZWxkIiwiZmluZCIsImdldE9iamVjdFJlY29yZCIsInNlbGVjdF9maWVsZHMiLCJleHBhbmQiLCJjb2xsZWN0aW9uIiwicmVjb3JkIiwicmVmMSIsInJlZjIiLCJUZW1wbGF0ZSIsImluc3RhbmNlIiwib2RhdGEiLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsImdldE9iamVjdFJlY29yZE5hbWUiLCJuYW1lX2ZpZWxkX2tleSIsIk5BTUVfRklFTERfS0VZIiwiZ2V0QXBwIiwiYXBwIiwiQXBwcyIsImRlcHMiLCJkZXBlbmQiLCJnZXRBcHBEYXNoYm9hcmQiLCJkYXNoYm9hcmQiLCJEYXNoYm9hcmRzIiwiYXBwcyIsImdldEFwcERhc2hib2FyZENvbXBvbmVudCIsImdldEFwcE9iamVjdE5hbWVzIiwiYXBwT2JqZWN0cyIsImlzTW9iaWxlIiwib2JqZWN0cyIsIm1vYmlsZV9vYmplY3RzIiwib2JqIiwicGVybWlzc2lvbnMiLCJhbGxvd1JlYWQiLCJnZXRBcHBNZW51IiwibWVudV9pZCIsIm1lbnVzIiwiZ2V0QXBwTWVudXMiLCJtZW51IiwiaWQiLCJnZXRBcHBNZW51VXJsRm9ySW50ZXJuZXQiLCJoYXNRdWVyeVN5bWJvbCIsImxpbmtTdHIiLCJwYXJhbXMiLCJzZGsiLCJzcGFjZUlkIiwidXNlcklkIiwiZ2V0VXNlckNvbXBhbnlJZHMiLCJyZXF1aXJlIiwicGF0aCIsIlV0aWxzIiwiaXNFeHByZXNzaW9uIiwicGFyc2VTaW5nbGVFeHByZXNzaW9uIiwiVVNFUl9DT05URVhUIiwiJCIsInBhcmFtIiwiZ2V0QXBwTWVudVVybCIsInRhcmdldCIsImFwcE1lbnVzIiwiY3VyZW50QXBwTWVudXMiLCJtZW51SXRlbSIsImNoaWxkcmVuIiwibG9hZEFwcHNNZW51cyIsImRhdGEiLCJvcHRpb25zIiwibW9iaWxlIiwic3VjY2VzcyIsInNldCIsImF1dGhSZXF1ZXN0IiwiZ2V0VmlzaWJsZUFwcHMiLCJpbmNsdWRlQWRtaW4iLCJjaGFuZ2VBcHAiLCJfc3ViQXBwIiwiZW50aXRpZXMiLCJPYmplY3QiLCJhc3NpZ24iLCJ2aXNpYmxlQXBwc1NlbGVjdG9yIiwiZ2V0VmlzaWJsZUFwcHNPYmplY3RzIiwidmlzaWJsZU9iamVjdE5hbWVzIiwiZmxhdHRlbiIsInBsdWNrIiwiZmlsdGVyIiwiT2JqZWN0cyIsInNvcnQiLCJzb3J0aW5nTWV0aG9kIiwiYmluZCIsImtleSIsInVuaXEiLCJnZXRBcHBzT2JqZWN0cyIsInRlbXBPYmplY3RzIiwiY29uY2F0IiwidmFsaWRhdGVGaWx0ZXJzIiwibG9naWMiLCJlIiwiZXJyb3JNc2ciLCJmaWx0ZXJfaXRlbXMiLCJmaWx0ZXJfbGVuZ3RoIiwiZmxhZyIsImluZGV4Iiwid29yZCIsIm1hcCIsImlzRW1wdHkiLCJjb21wYWN0IiwicmVwbGFjZSIsIm1hdGNoIiwiaSIsImluY2x1ZGVzIiwidyIsImVycm9yIiwiY29uc29sZSIsImxvZyIsInRvYXN0ciIsImZvcm1hdEZpbHRlcnNUb01vbmdvIiwic2VsZWN0b3IiLCJBcnJheSIsIm9wZXJhdGlvbiIsIm9wdGlvbiIsInJlZyIsInN1Yl9zZWxlY3RvciIsImV2YWx1YXRlRm9ybXVsYSIsIlJlZ0V4cCIsImlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyIsImZvcm1hdEZpbHRlcnNUb0RldiIsImxvZ2ljVGVtcEZpbHRlcnMiLCJzdGVlZG9zRmlsdGVycyIsImlzX2xvZ2ljX29yIiwicG9wIiwiZm9ybWF0TG9naWNGaWx0ZXJzVG9EZXYiLCJmaWx0ZXJfbG9naWMiLCJmb3JtYXRfbG9naWMiLCJ4IiwiX2YiLCJpc0FycmF5IiwiSlNPTiIsInN0cmluZ2lmeSIsInJlbGF0ZWRfb2JqZWN0X25hbWVzIiwicmVsYXRlZF9vYmplY3RzIiwidW5yZWxhdGVkX29iamVjdHMiLCJnZXRPYmplY3RSZWxhdGVkcyIsIl9jb2xsZWN0aW9uX25hbWUiLCJnZXRQZXJtaXNzaW9ucyIsImRpZmZlcmVuY2UiLCJyZWxhdGVkX29iamVjdCIsImlzQWN0aXZlIiwiYWxsb3dSZWFkRmlsZXMiLCJnZXRSZWxhdGVkT2JqZWN0TmFtZXMiLCJnZXRBY3Rpb25zIiwiYWN0aW9ucyIsImRpc2FibGVkX2FjdGlvbnMiLCJzb3J0QnkiLCJ2YWx1ZXMiLCJoYXMiLCJhY3Rpb24iLCJhbGxvd19jdXN0b21BY3Rpb25zIiwia2V5cyIsImV4Y2x1ZGVfYWN0aW9ucyIsIm9uIiwiZ2V0TGlzdFZpZXdzIiwiZGlzYWJsZWRfbGlzdF92aWV3cyIsImxpc3RWaWV3cyIsImxpc3Rfdmlld3MiLCJvYmplY3QiLCJpdGVtIiwiaXRlbV9uYW1lIiwiaXNEaXNhYmxlZCIsIm93bmVyIiwiZmllbGRzTmFtZSIsInVucmVhZGFibGVfZmllbGRzIiwiZ2V0T2JqZWN0RmllbGRzTmFtZSIsImlzbG9hZGluZyIsImJvb3RzdHJhcExvYWRlZCIsImNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyIiwic3RyIiwiZ2V0RGlzYWJsZWRGaWVsZHMiLCJmaWVsZE5hbWUiLCJhdXRvZm9ybSIsImRpc2FibGVkIiwib21pdCIsImdldEhpZGRlbkZpZWxkcyIsImdldEZpZWxkc1dpdGhOb0dyb3VwIiwiZ3JvdXAiLCJnZXRTb3J0ZWRGaWVsZEdyb3VwTmFtZXMiLCJuYW1lcyIsInVuaXF1ZSIsImdldEZpZWxkc0Zvckdyb3VwIiwiZ3JvdXBOYW1lIiwiZ2V0RmllbGRzV2l0aG91dE9taXQiLCJwaWNrIiwiZ2V0RmllbGRzSW5GaXJzdExldmVsIiwiZmlyc3RMZXZlbEtleXMiLCJnZXRGaWVsZHNGb3JSZW9yZGVyIiwiaXNTaW5nbGUiLCJfa2V5cyIsImNoaWxkS2V5cyIsImlzX3dpZGVfMSIsImlzX3dpZGVfMiIsInNjXzEiLCJzY18yIiwiZW5kc1dpdGgiLCJpc193aWRlIiwic2xpY2UiLCJpc0ZpbHRlclZhbHVlRW1wdHkiLCJOdW1iZXIiLCJpc05hTiIsImdldEZpZWxkRGF0YVR5cGUiLCJvYmplY3RGaWVsZHMiLCJyZXN1bHQiLCJkYXRhX3R5cGUiLCJpc1NlcnZlciIsImdldEFsbFJlbGF0ZWRPYmplY3RzIiwicmVsYXRlZF9maWVsZCIsImVuYWJsZV9maWxlcyIsImZvcm1hdEluZGV4IiwiYXJyYXkiLCJpbmRleE5hbWUiLCJpc2RvY3VtZW50REIiLCJiYWNrZ3JvdW5kIiwiZGF0YXNvdXJjZXMiLCJkb2N1bWVudERCIiwiam9pbiIsInN1YnN0cmluZyIsImFwcHNCeU5hbWUiLCJtZXRob2RzIiwic3BhY2VfaWQiLCJjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQiLCJjdXJyZW50X3JlY2VudF92aWV3ZWQiLCJkb2MiLCJzcGFjZSIsInVwZGF0ZSIsIiRpbmMiLCJjb3VudCIsIiRzZXQiLCJtb2RpZmllZCIsIkRhdGUiLCJtb2RpZmllZF9ieSIsImluc2VydCIsIl9tYWtlTmV3SUQiLCJvIiwiaWRzIiwiY3JlYXRlZCIsImNyZWF0ZWRfYnkiLCJhc3luY19yZWNlbnRfYWdncmVnYXRlIiwicmVjZW50X2FnZ3JlZ2F0ZSIsInNlYXJjaF9vYmplY3QiLCJfcmVjb3JkcyIsImNhbGxiYWNrIiwiQ29sbGVjdGlvbnMiLCJvYmplY3RfcmVjZW50X3ZpZXdlZCIsInJhd0NvbGxlY3Rpb24iLCJhZ2dyZWdhdGUiLCIkbWF0Y2giLCIkZ3JvdXAiLCJtYXhDcmVhdGVkIiwiJG1heCIsIiRzb3J0IiwiJGxpbWl0IiwidG9BcnJheSIsImVyciIsIkVycm9yIiwiaXNGdW5jdGlvbiIsIndyYXBBc3luYyIsInNlYXJjaFRleHQiLCJfb2JqZWN0X2NvbGxlY3Rpb24iLCJfb2JqZWN0X25hbWVfa2V5IiwicXVlcnkiLCJxdWVyeV9hbmQiLCJyZWNvcmRzIiwic2VhcmNoX0tleXdvcmRzIiwic3BsaXQiLCJrZXl3b3JkIiwic3VicXVlcnkiLCIkcmVnZXgiLCJ0cmltIiwiJGFuZCIsIiRpbiIsImxpbWl0IiwiX25hbWUiLCJfb2JqZWN0X25hbWUiLCJyZWNvcmRfb2JqZWN0IiwicmVjb3JkX29iamVjdF9jb2xsZWN0aW9uIiwic2VsZiIsIm9iamVjdHNCeU5hbWUiLCJvYmplY3RfcmVjb3JkIiwiZW5hYmxlX3NlYXJjaCIsInVwZGF0ZV9maWx0ZXJzIiwibGlzdHZpZXdfaWQiLCJmaWx0ZXJfc2NvcGUiLCJvYmplY3RfbGlzdHZpZXdzIiwiZGlyZWN0IiwidXBkYXRlX2NvbHVtbnMiLCJjb2x1bW5zIiwiY2hlY2siLCJjb21wb3VuZEZpZWxkcyIsImN1cnNvciIsImZpbHRlckZpZWxkcyIsImNoaWxkS2V5Iiwib2JqZWN0RmllbGQiLCJzcGxpdHMiLCJpc0NvbW1vblNwYWNlIiwiaXNTcGFjZUFkbWluIiwic2tpcCIsImZldGNoIiwiY29tcG91bmRGaWVsZEl0ZW0iLCJjb21wb3VuZEZpbHRlckZpZWxkcyIsIml0ZW1LZXkiLCJpdGVtVmFsdWUiLCJyZWZlcmVuY2VJdGVtIiwic2V0dGluZyIsImNvbHVtbl93aWR0aCIsIm9iajEiLCJfaWRfYWN0aW9ucyIsIl9taXhGaWVsZHNEYXRhIiwiX21peFJlbGF0ZWREYXRhIiwiX3dyaXRlWG1sRmlsZSIsImZzIiwibG9nZ2VyIiwieG1sMmpzIiwiTG9nZ2VyIiwianNvbk9iaiIsIm9iak5hbWUiLCJidWlsZGVyIiwiZGF5IiwiZmlsZUFkZHJlc3MiLCJmaWxlTmFtZSIsImZpbGVQYXRoIiwibW9udGgiLCJub3ciLCJzdHJlYW0iLCJ4bWwiLCJ5ZWFyIiwiQnVpbGRlciIsImJ1aWxkT2JqZWN0IiwiQnVmZmVyIiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsImdldERhdGUiLCJfX21ldGVvcl9ib290c3RyYXBfXyIsInNlcnZlckRpciIsImV4aXN0c1N5bmMiLCJzeW5jIiwid3JpdGVGaWxlIiwibWl4Qm9vbCIsIm1peERhdGUiLCJtaXhEZWZhdWx0Iiwib2JqRmllbGRzIiwiZmllbGRfbmFtZSIsImRhdGUiLCJkYXRlU3RyIiwiZm9ybWF0IiwibW9tZW50IiwicmVsYXRlZE9iak5hbWVzIiwicmVsYXRlZE9iak5hbWUiLCJyZWxhdGVkQ29sbGVjdGlvbiIsInJlbGF0ZWRSZWNvcmRMaXN0IiwicmVsYXRlZFRhYmxlRGF0YSIsInJlbGF0ZWRPYmoiLCJmaWVsZHNEYXRhIiwiRXhwb3J0MnhtbCIsInJlY29yZExpc3QiLCJpbmZvIiwidGltZSIsInJlY29yZE9iaiIsInRpbWVFbmQiLCJyZWxhdGVkX29iamVjdHNfcmVjb3JkcyIsInJlbGF0ZWRfcmVjb3JkcyIsInZpZXdBbGxSZWNvcmRzIiwiZ2V0UGVuZGluZ1NwYWNlSW5mbyIsImludml0ZXJJZCIsImludml0ZXJOYW1lIiwic3BhY2VOYW1lIiwiZGIiLCJ1c2VycyIsInNwYWNlcyIsImludml0ZXIiLCJyZWZ1c2VKb2luU3BhY2UiLCJzcGFjZV91c2VycyIsImludml0ZV9zdGF0ZSIsImFjY2VwdEpvaW5TcGFjZSIsInVzZXJfYWNjZXB0ZWQiLCJwdWJsaXNoIiwicHVibGlzaENvbXBvc2l0ZSIsInRhYmxlTmFtZSIsIl9maWVsZHMiLCJvYmplY3RfY29sbGVjaXRvbiIsInJlZmVyZW5jZV9maWVsZHMiLCJyZWFkeSIsIlN0cmluZyIsIk1hdGNoIiwiT3B0aW9uYWwiLCJnZXRPYmplY3ROYW1lIiwidW5ibG9jayIsImZpZWxkX2tleXMiLCJfb2JqZWN0S2V5cyIsInJlZmVyZW5jZV9maWVsZCIsInBhcmVudCIsImNoaWxkcmVuX2ZpZWxkcyIsInBfayIsInJlZmVyZW5jZV9pZHMiLCJyZWZlcmVuY2VfdG9fb2JqZWN0Iiwic19rIiwiZ2V0UHJvcGVydHkiLCJyZWR1Y2UiLCJpc09iamVjdCIsInNoYXJlZCIsInVzZXIiLCJzcGFjZV9zZXR0aW5ncyIsInBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsIiwiZ2V0Rmxvd1Blcm1pc3Npb25zIiwiZmxvd19pZCIsInVzZXJfaWQiLCJmbG93IiwibXlfcGVybWlzc2lvbnMiLCJvcmdfaWRzIiwib3JnYW5pemF0aW9ucyIsIm9yZ3NfY2FuX2FkZCIsIm9yZ3NfY2FuX2FkbWluIiwib3Jnc19jYW5fbW9uaXRvciIsInVzZXJzX2Nhbl9hZGQiLCJ1c2Vyc19jYW5fYWRtaW4iLCJ1c2Vyc19jYW5fbW9uaXRvciIsInV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwiLCJnZXRGbG93IiwicGFyZW50cyIsIm9yZyIsInBhcmVudF9pZCIsInBlcm1zIiwib3JnX2lkIiwiX2V2YWwiLCJnZXRPYmplY3RDb25maWciLCJnZXRPYmplY3ROYW1lRmllbGRLZXkiLCJnZXRSZWxhdGVkcyIsIm9iamVjdHFsIiwib2JqZWN0QXBpTmFtZSIsInRvQ29uZmlnIiwiY2IiLCJ0aGVuIiwicmVzb2x2ZSIsInJlamVjdCIsImNoZWNrX2F1dGhvcml6YXRpb24iLCJyZXEiLCJhdXRoVG9rZW4iLCJoYXNoZWRUb2tlbiIsIkFjY291bnRzIiwiX2hhc2hMb2dpblRva2VuIiwiZ2V0U3BhY2UiLCJmbG93cyIsImdldFNwYWNlVXNlciIsInNwYWNlX3VzZXIiLCJnZXRTcGFjZVVzZXJPcmdJbmZvIiwib3JnYW5pemF0aW9uIiwiZnVsbG5hbWUiLCJvcmdhbml6YXRpb25fbmFtZSIsIm9yZ2FuaXphdGlvbl9mdWxsbmFtZSIsImlzRmxvd0VuYWJsZWQiLCJzdGF0ZSIsImlzRmxvd1NwYWNlTWF0Y2hlZCIsImdldEZvcm0iLCJmb3JtX2lkIiwiZm9ybSIsImZvcm1zIiwiZ2V0Q2F0ZWdvcnkiLCJjYXRlZ29yeV9pZCIsImNhdGVnb3JpZXMiLCJjcmVhdGVfaW5zdGFuY2UiLCJpbnN0YW5jZV9mcm9tX2NsaWVudCIsInVzZXJfaW5mbyIsImFwcHJfb2JqIiwiYXBwcm92ZV9mcm9tX2NsaWVudCIsImNhdGVnb3J5IiwiaW5zX29iaiIsIm5ld19pbnNfaWQiLCJyZWxhdGVkVGFibGVzSW5mbyIsInNwYWNlX3VzZXJfb3JnX2luZm8iLCJzdGFydF9zdGVwIiwidHJhY2VfZnJvbV9jbGllbnQiLCJ0cmFjZV9vYmoiLCJjaGVja0lzSW5BcHByb3ZhbCIsInBlcm1pc3Npb25NYW5hZ2VyIiwiaW5zdGFuY2VzIiwiZmxvd192ZXJzaW9uIiwiY3VycmVudCIsImZvcm1fdmVyc2lvbiIsInN1Ym1pdHRlciIsInN1Ym1pdHRlcl9uYW1lIiwiYXBwbGljYW50IiwiYXBwbGljYW50X25hbWUiLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uIiwiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lIiwiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZSIsImFwcGxpY2FudF9jb21wYW55IiwiY29tcGFueV9pZCIsImNvZGUiLCJpc19hcmNoaXZlZCIsImlzX2RlbGV0ZWQiLCJyZWNvcmRfaWRzIiwiTW9uZ28iLCJPYmplY3RJRCIsIl9zdHIiLCJpc19maW5pc2hlZCIsInN0ZXBzIiwic3RlcCIsInN0ZXBfdHlwZSIsInN0YXJ0X2RhdGUiLCJ0cmFjZSIsInVzZXJfbmFtZSIsImhhbmRsZXIiLCJoYW5kbGVyX25hbWUiLCJoYW5kbGVyX29yZ2FuaXphdGlvbiIsImhhbmRsZXJfb3JnYW5pemF0aW9uX25hbWUiLCJoYW5kbGVyX29yZ2FuaXphdGlvbl9mdWxsbmFtZSIsInJlYWRfZGF0ZSIsImlzX3JlYWQiLCJpc19lcnJvciIsImRlc2NyaXB0aW9uIiwiaW5pdGlhdGVWYWx1ZXMiLCJhcHByb3ZlcyIsInRyYWNlcyIsImluYm94X3VzZXJzIiwiY3VycmVudF9zdGVwX25hbWUiLCJhdXRvX3JlbWluZCIsImZsb3dfbmFtZSIsImNhdGVnb3J5X25hbWUiLCJpbml0aWF0ZVJlY29yZEluc3RhbmNlSW5mbyIsImluaXRpYXRlQXR0YWNoIiwicmVjb3JkSWRzIiwiZmxvd0lkIiwiZmllbGRDb2RlcyIsImZpbHRlclZhbHVlcyIsImZvcm1GaWVsZHMiLCJmb3JtVGFibGVGaWVsZHMiLCJmb3JtVGFibGVGaWVsZHNDb2RlIiwiZ2V0RmllbGRPZGF0YVZhbHVlIiwiZ2V0Rm9ybUZpZWxkIiwiZ2V0Rm9ybVRhYmxlRmllbGQiLCJnZXRGb3JtVGFibGVGaWVsZENvZGUiLCJnZXRGb3JtVGFibGVTdWJGaWVsZCIsImdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUiLCJnZXRTZWxlY3RPcmdWYWx1ZSIsImdldFNlbGVjdE9yZ1ZhbHVlcyIsImdldFNlbGVjdFVzZXJWYWx1ZSIsImdldFNlbGVjdFVzZXJWYWx1ZXMiLCJvYmplY3ROYW1lIiwib3ciLCJyZWNvcmRJZCIsInJlbGF0ZWRPYmplY3RzS2V5cyIsInRhYmxlRmllbGRDb2RlcyIsInRhYmxlRmllbGRNYXAiLCJ0YWJsZVRvUmVsYXRlZE1hcCIsImZmIiwib2JqZWN0X3dvcmtmbG93cyIsImZvcm1GaWVsZCIsInJlbGF0ZWRPYmplY3RzS2V5Iiwic3RhcnRzV2l0aCIsImZvcm1UYWJsZUZpZWxkQ29kZSIsInNmIiwidGFibGVGaWVsZCIsInN1YkZpZWxkQ29kZSIsIl9yZWNvcmQiLCJuYW1lS2V5Iiwic3UiLCJ1c2VySWRzIiwic3VzIiwib3JnSWQiLCJvcmdJZHMiLCJvcmdzIiwiZmllbGRfbWFwIiwiZm0iLCJmaWVsZHNPYmoiLCJncmlkQ29kZSIsImxvb2t1cEZpZWxkTmFtZSIsImxvb2t1cEZpZWxkT2JqIiwibG9va3VwT2JqZWN0UmVjb3JkIiwibG9va3VwU2VsZWN0RmllbGRWYWx1ZSIsIm9UYWJsZUNvZGUiLCJvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQiLCJvVGFibGVDb2RlUmVmZXJlbmNlRmllbGRDb2RlIiwib1RhYmxlRmllbGRDb2RlIiwib2JqRmllbGQiLCJvYmplY3RGaWVsZE5hbWUiLCJvYmplY3RGaWVsZE9iamVjdE5hbWUiLCJvYmplY3RMb29rdXBGaWVsZCIsIm9iamVjdF9maWVsZCIsIm9kYXRhRmllbGRWYWx1ZSIsInJlZmVyZW5jZVRvRG9jIiwicmVmZXJlbmNlVG9GaWVsZFZhbHVlIiwicmVmZXJlbmNlVG9PYmplY3ROYW1lIiwicmVsYXRlZE9iamVjdEZpZWxkQ29kZSIsInNlbGVjdEZpZWxkVmFsdWUiLCJ0YWJsZVRvUmVsYXRlZE1hcEtleSIsIndUYWJsZUNvZGUiLCJ3b3JrZmxvd19maWVsZCIsImhhc093blByb3BlcnR5Iiwid29ya2Zsb3dfdGFibGVfZmllbGRfY29kZSIsIm9iamVjdF90YWJsZV9maWVsZF9jb2RlIiwibXVsdGlwbGUiLCJpc19tdWx0aXNlbGVjdCIsInRmYyIsImMiLCJwYXJzZSIsInRyIiwibmV3VHIiLCJ0Zm0iLCJ3VGRDb2RlIiwiZm9ybVRhYmxlRmllbGQiLCJyZWxhdGVkRmllbGQiLCJyZWxhdGVkRmllbGROYW1lIiwicmVsYXRlZE9iamVjdE5hbWUiLCJyZWxhdGVkUmVjb3JkcyIsInJlbGF0ZWRUYWJsZUl0ZW1zIiwidGFibGVDb2RlIiwidGFibGVWYWx1ZXMiLCJfRlJPTV9UQUJMRV9DT0RFIiwid2FybiIsInJyIiwidGFibGVWYWx1ZUl0ZW0iLCJ2YWx1ZUtleSIsImZpZWxkS2V5IiwiZm9ybUZpZWxkS2V5IiwicmVsYXRlZE9iamVjdEZpZWxkIiwidGFibGVGaWVsZFZhbHVlIiwiX3RhYmxlIiwiX2NvZGUiLCJmaWVsZF9tYXBfc2NyaXB0IiwiZXh0ZW5kIiwiZXZhbEZpZWxkTWFwU2NyaXB0Iiwib2JqZWN0SWQiLCJmdW5jIiwic2NyaXB0IiwiaW5zSWQiLCJhcHByb3ZlSWQiLCJjZiIsInZlcnNpb25zIiwidmVyc2lvbklkIiwiaWR4IiwibmV3RmlsZSIsIkZTIiwiRmlsZSIsImF0dGFjaERhdGEiLCJjcmVhdGVSZWFkU3RyZWFtIiwib3JpZ2luYWwiLCJtZXRhZGF0YSIsInJlYXNvbiIsInNpemUiLCJvd25lcl9uYW1lIiwiYXBwcm92ZSIsIiRwdXNoIiwiJGVhY2giLCIkcG9zaXRpb24iLCJsb2NrZWQiLCJpbnN0YW5jZV9zdGF0ZSIsImluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyIsInRhYmxlSXRlbXMiLCIkZXhpc3RzIiwiZ2V0UXVlcnlTdHJpbmciLCJzdGVlZG9zQXV0aCIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXMiLCJuZXh0IiwicGFyc2VGaWxlcyIsImZpbGVDb2xsZWN0aW9uIiwiZmlsZXMiLCJtaW1lVHlwZSIsImJvZHkiLCJleHRlbnRpb24iLCJmaWxlT2JqIiwiZmlsZW5hbWUiLCJuZXdGaWxlT2JqSWQiLCJ0b0xvd2VyQ2FzZSIsImRlY29kZVVSSUNvbXBvbmVudCIsIm9uY2UiLCJzdG9yZU5hbWUiLCJyZXNwIiwidmVyc2lvbl9pZCIsImVuZCIsInN0YXR1c0NvZGUiLCJjb2xsZWN0aW9uTmFtZSIsInVzZXJTZXNzaW9uIiwiYXV0aCIsInJlc3VsdERhdGEiLCJzZW5kUmVzdWx0Iiwic3RhY2siLCJlcnJvcnMiLCJtZXNzYWdlIiwiYWNjZXNzS2V5SWQiLCJzZWNyZXRBY2Nlc3NLZXkiLCJtZXRob2QiLCJBTFkiLCJjYW5vbmljYWxpemVkUXVlcnlTdHJpbmciLCJxdWVyeUtleXMiLCJxdWVyeVN0ciIsInN0cmluZ1RvU2lnbiIsInV0aWwiLCJGb3JtYXQiLCJWZXJzaW9uIiwiQWNjZXNzS2V5SWQiLCJTaWduYXR1cmVNZXRob2QiLCJUaW1lc3RhbXAiLCJpc284NjAxIiwiU2lnbmF0dXJlVmVyc2lvbiIsIlNpZ25hdHVyZU5vbmNlIiwiZ2V0VGltZSIsInBvcEVzY2FwZSIsInRvVXBwZXJDYXNlIiwic3Vic3RyIiwiU2lnbmF0dXJlIiwiY3J5cHRvIiwiaG1hYyIsInF1ZXJ5UGFyYW1zVG9TdHJpbmciLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwib3NzIiwiciIsInJlZjMiLCJ1cGxvYWRBZGRyZXNzIiwidXBsb2FkQXV0aCIsInZpZGVvSWQiLCJBY3Rpb24iLCJUaXRsZSIsIkZpbGVOYW1lIiwiSFRUUCIsImNhbGwiLCJWaWRlb0lkIiwiVXBsb2FkQWRkcmVzcyIsInRvU3RyaW5nIiwiVXBsb2FkQXV0aCIsIk9TUyIsIkFjY2Vzc0tleVNlY3JldCIsIkVuZHBvaW50IiwiU2VjdXJpdHlUb2tlbiIsInB1dE9iamVjdCIsIkJ1Y2tldCIsIktleSIsIkJvZHkiLCJBY2Nlc3NDb250cm9sQWxsb3dPcmlnaW4iLCJDb250ZW50VHlwZSIsIkNhY2hlQ29udHJvbCIsIkNvbnRlbnREaXNwb3NpdGlvbiIsIkNvbnRlbnRFbmNvZGluZyIsIlNlcnZlclNpZGVFbmNyeXB0aW9uIiwiRXhwaXJlcyIsImJpbmRFbnZpcm9ubWVudCIsImdldFBsYXlJbmZvUXVlcnkiLCJnZXRQbGF5SW5mb1Jlc3VsdCIsImdldFBsYXlJbmZvVXJsIiwibmV3RGF0ZSIsImN1cnJlbnRfdXNlcl9pZCIsImN1cnJlbnRfdXNlcl9pbmZvIiwiaGFzaERhdGEiLCJpbnNlcnRlZF9pbnN0YW5jZXMiLCJuZXdfaW5zIiwiaW5zZXJ0cyIsImVycm9yTWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7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LFVBQUE7QUFBQUEsbUJBQWFsRCw2QkFBNkIyQyxlQUE3QixDQUE2Q0Msb0JBQTdDLEVBQW1FMFIsaUJBQW5FLENBQWI7QUFFQUcsZ0JBQVVsMEIsUUFBUTJVLFdBQVIsQ0FBb0J3TyxTQUFwQixDQUE4Qm5kLE9BQTlCLENBQXNDO0FBQUU1RSxhQUFLdWhCO0FBQVAsT0FBdEMsRUFBMkQ7QUFBRXBnQixnQkFBUTtBQUFFaVIsaUJBQU8sQ0FBVDtBQUFZdUwsZ0JBQU0sQ0FBbEI7QUFBcUJxRSx3QkFBYyxDQUFuQztBQUFzQ3JCLGdCQUFNLENBQTVDO0FBQStDdUIsd0JBQWM7QUFBN0Q7QUFBVixPQUEzRCxDQUFWO0FDU0csYURQSDJRLG1CQUFtQmp4QixJQUFuQixDQUF3Qmt4QixPQUF4QixDQ09HO0FEWko7O0FDY0UsV0RQRjlGLFdBQVd5QixVQUFYLENBQXNCdkIsR0FBdEIsRUFBMkI7QUFDMUJ0SyxZQUFNLEdBRG9CO0FBRTFCN2EsWUFBTTtBQUFFZ3JCLGlCQUFTRjtBQUFYO0FBRm9CLEtBQTNCLENDT0U7QUR0QkgsV0FBQWpvQixLQUFBO0FBbUJNZixRQUFBZSxLQUFBO0FBQ0xDLFlBQVFELEtBQVIsQ0FBY2YsRUFBRTZrQixLQUFoQjtBQ1dFLFdEVkYxQixXQUFXeUIsVUFBWCxDQUFzQnZCLEdBQXRCLEVBQTJCO0FBQzFCdEssWUFBTSxHQURvQjtBQUUxQjdhLFlBQU07QUFBRTRtQixnQkFBUSxDQUFDO0FBQUVxRSx3QkFBY25wQixFQUFFcWlCLE1BQUYsSUFBWXJpQixFQUFFK2tCO0FBQTlCLFNBQUQ7QUFBVjtBQUZvQixLQUEzQixDQ1VFO0FBVUQ7QUQxQ0gsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0Y2hlY2tOcG1WZXJzaW9uc1xufSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHRidXNib3k6IFwiXjAuMi4xM1wiLFxuXHRta2RpcnA6IFwiXjAuMy41XCIsXG5cdFwieG1sMmpzXCI6IFwiXjAuNC4xOVwiLFxuXHRcIm5vZGUteGxzeFwiOiBcIl4wLnhcIlxufSwgJ3N0ZWVkb3M6Y3JlYXRvcicpO1xuXG5pZiAoTWV0ZW9yLnNldHRpbmdzICYmIE1ldGVvci5zZXR0aW5ncy5jZnMgJiYgTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4pIHtcblx0Y2hlY2tOcG1WZXJzaW9ucyh7XG5cdFx0XCJhbGl5dW4tc2RrXCI6IFwiXjEuMTEuMTJcIlxuXHR9LCAnc3RlZWRvczpjcmVhdG9yJyk7XG59IiwiXG5cdCMgQ3JlYXRvci5pbml0QXBwcygpXG5cblxuIyBDcmVhdG9yLmluaXRBcHBzID0gKCktPlxuIyBcdGlmIE1ldGVvci5pc1NlcnZlclxuIyBcdFx0Xy5lYWNoIENyZWF0b3IuQXBwcywgKGFwcCwgYXBwX2lkKS0+XG4jIFx0XHRcdGRiX2FwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpXG4jIFx0XHRcdGlmICFkYl9hcHBcbiMgXHRcdFx0XHRhcHAuX2lkID0gYXBwX2lkXG4jIFx0XHRcdFx0ZGIuYXBwcy5pbnNlcnQoYXBwKVxuIyBlbHNlXG4jIFx0YXBwLl9pZCA9IGFwcF9pZFxuIyBcdGRiLmFwcHMudXBkYXRlKHtfaWQ6IGFwcF9pZH0sIGFwcClcblxuQ3JlYXRvci5nZXRTY2hlbWEgPSAob2JqZWN0X25hbWUpLT5cblx0cmV0dXJuIENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKT8uc2NoZW1hXG5cbkNyZWF0b3IuZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCA9IChvYmplY3RfbmFtZSktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRyZXR1cm4gUmVhY3RTdGVlZG9zLnBsdWdpbkNvbXBvbmVudFNlbGVjdG9yKFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLCBcIk9iamVjdEhvbWVcIiwgb2JqZWN0X25hbWUpXG5cbkNyZWF0b3IuZ2V0T2JqZWN0VXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cblx0aWYgIWFwcF9pZFxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXG5cdGxpc3Rfdmlld19pZCA9IGxpc3Rfdmlldz8uX2lkXG5cblx0aWYgcmVjb3JkX2lkXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQpXG5cdGVsc2Vcblx0XHRpZiBvYmplY3RfbmFtZSBpcyBcIm1lZXRpbmdcIlxuXHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiKVxuXHRcdGVsc2Vcblx0XHRcdGlmIENyZWF0b3IuZ2V0T2JqZWN0SG9tZUNvbXBvbmVudChvYmplY3RfbmFtZSlcblx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgbGlzdF92aWV3X2lkXG5cdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lKVxuXG5DcmVhdG9yLmdldE9iamVjdEFic29sdXRlVXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cblx0aWYgIWFwcF9pZFxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXG5cdGxpc3Rfdmlld19pZCA9IGxpc3Rfdmlldz8uX2lkXG5cblx0aWYgcmVjb3JkX2lkXG5cdFx0cmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQsIHRydWUpXG5cdGVsc2Vcblx0XHRpZiBvYmplY3RfbmFtZSBpcyBcIm1lZXRpbmdcIlxuXHRcdFx0cmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiLCB0cnVlKVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkLCB0cnVlKVxuXG5DcmVhdG9yLmdldE9iamVjdFJvdXRlclVybCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIC0+XG5cdGlmICFhcHBfaWRcblx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKVxuXHRsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXc/Ll9pZFxuXG5cdGlmIHJlY29yZF9pZFxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZFxuXHRlbHNlXG5cdFx0aWYgb2JqZWN0X25hbWUgaXMgXCJtZWV0aW5nXCJcblx0XHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCJcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWRcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1VybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIC0+XG5cdHVybCA9IENyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpXG5cdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKHVybClcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cblx0aWYgbGlzdF92aWV3X2lkIGlzIFwiY2FsZW5kYXJcIlxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCJcblx0ZWxzZVxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZFxuXG5DcmVhdG9yLmdldFN3aXRjaExpc3RVcmwgPSAob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSAtPlxuXHRpZiBsaXN0X3ZpZXdfaWRcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi9saXN0XCIpXG5cdGVsc2Vcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvbGlzdC9zd2l0Y2hcIilcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0VXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIHJlY29yZF9pZCwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lKSAtPlxuXHRpZiByZWxhdGVkX2ZpZWxkX25hbWVcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyByZWNvcmRfaWQgKyBcIi9cIiArIHJlbGF0ZWRfb2JqZWN0X25hbWUgKyBcIi9ncmlkP3JlbGF0ZWRfZmllbGRfbmFtZT1cIiArIHJlbGF0ZWRfZmllbGRfbmFtZSlcblx0ZWxzZVxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIHJlY29yZF9pZCArIFwiL1wiICsgcmVsYXRlZF9vYmplY3RfbmFtZSArIFwiL2dyaWRcIilcblxuQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMgPSAob2JqZWN0X25hbWUsIGlzX2RlZXAsIGlzX3NraXBfaGlkZSwgaXNfcmVsYXRlZCktPlxuXHRfb3B0aW9ucyA9IFtdXG5cdHVubGVzcyBvYmplY3RfbmFtZVxuXHRcdHJldHVybiBfb3B0aW9uc1xuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xuXHRpY29uID0gX29iamVjdD8uaWNvblxuXHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxuXHRcdGlmIGlzX3NraXBfaGlkZSBhbmQgZi5oaWRkZW5cblx0XHRcdHJldHVyblxuXHRcdGlmIGYudHlwZSA9PSBcInNlbGVjdFwiXG5cdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogXCIje2YubGFiZWwgfHwga31cIiwgdmFsdWU6IFwiI3trfVwiLCBpY29uOiBpY29ufVxuXHRcdGVsc2Vcblx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBmLmxhYmVsIHx8IGssIHZhbHVlOiBrLCBpY29uOiBpY29ufVxuXHRpZiBpc19kZWVwXG5cdFx0Xy5mb3JFYWNoIGZpZWxkcywgKGYsIGspLT5cblx0XHRcdGlmIGlzX3NraXBfaGlkZSBhbmQgZi5oaWRkZW5cblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRpZiAoZi50eXBlID09IFwibG9va3VwXCIgfHwgZi50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKSAmJiBmLnJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKGYucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHQjIOS4jeaUr+aMgWYucmVmZXJlbmNlX3Rv5Li6ZnVuY3Rpb27nmoTmg4XlhrXvvIzmnInpnIDmsYLlho3or7Rcblx0XHRcdFx0cl9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChmLnJlZmVyZW5jZV90bylcblx0XHRcdFx0aWYgcl9vYmplY3Rcblx0XHRcdFx0XHRfLmZvckVhY2ggcl9vYmplY3QuZmllbGRzLCAoZjIsIGsyKS0+XG5cdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogXCIje2YubGFiZWwgfHwga309PiN7ZjIubGFiZWwgfHwgazJ9XCIsIHZhbHVlOiBcIiN7a30uI3trMn1cIiwgaWNvbjogcl9vYmplY3Q/Lmljb259XG5cdGlmIGlzX3JlbGF0ZWRcblx0XHRyZWxhdGVkT2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpXG5cdFx0Xy5lYWNoIHJlbGF0ZWRPYmplY3RzLCAoX3JlbGF0ZWRPYmplY3QpPT5cblx0XHRcdHJlbGF0ZWRPcHRpb25zID0gQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMoX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UpXG5cdFx0XHRyZWxhdGVkT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUpXG5cdFx0XHRfLmVhY2ggcmVsYXRlZE9wdGlvbnMsIChyZWxhdGVkT3B0aW9uKS0+XG5cdFx0XHRcdGlmIF9yZWxhdGVkT2JqZWN0LmZvcmVpZ25fa2V5ICE9IHJlbGF0ZWRPcHRpb24udmFsdWVcblx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogXCIje3JlbGF0ZWRPYmplY3QubGFiZWwgfHwgcmVsYXRlZE9iamVjdC5uYW1lfT0+I3tyZWxhdGVkT3B0aW9uLmxhYmVsfVwiLCB2YWx1ZTogXCIje3JlbGF0ZWRPYmplY3QubmFtZX0uI3tyZWxhdGVkT3B0aW9uLnZhbHVlfVwiLCBpY29uOiByZWxhdGVkT2JqZWN0Py5pY29ufVxuXHRyZXR1cm4gX29wdGlvbnNcblxuIyDnu5/kuIDkuLrlr7nosaFvYmplY3RfbmFtZeaPkOS+m+WPr+eUqOS6jui/h+iZkeWZqOi/h+iZkeWtl+autVxuQ3JlYXRvci5nZXRPYmplY3RGaWx0ZXJGaWVsZE9wdGlvbnMgPSAob2JqZWN0X25hbWUpLT5cblx0X29wdGlvbnMgPSBbXVxuXHR1bmxlc3Mgb2JqZWN0X25hbWVcblx0XHRyZXR1cm4gX29wdGlvbnNcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRmaWVsZHMgPSBfb2JqZWN0Py5maWVsZHNcblx0cGVybWlzc2lvbl9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhvYmplY3RfbmFtZSlcblx0aWNvbiA9IF9vYmplY3Q/Lmljb25cblx0Xy5mb3JFYWNoIGZpZWxkcywgKGYsIGspLT5cblx0XHQjIGhpZGRlbixncmlk562J57G75Z6L55qE5a2X5q6177yM5LiN6ZyA6KaB6L+H5rukXG5cdFx0aWYgIV8uaW5jbHVkZShbXCJncmlkXCIsXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwiYXZhdGFyXCIsIFwiaW1hZ2VcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSkgYW5kICFmLmhpZGRlblxuXHRcdFx0IyBmaWx0ZXJzLiQuZmllbGTlj4pmbG93LmN1cnJlbnTnrYnlrZDlrZfmrrXkuZ/kuI3pnIDopoHov4fmu6Rcblx0XHRcdGlmICEvXFx3K1xcLi8udGVzdChrKSBhbmQgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xXG5cdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBmLmxhYmVsIHx8IGssIHZhbHVlOiBrLCBpY29uOiBpY29ufVxuXG5cdHJldHVybiBfb3B0aW9uc1xuXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkT3B0aW9ucyA9IChvYmplY3RfbmFtZSktPlxuXHRfb3B0aW9ucyA9IFtdXG5cdHVubGVzcyBvYmplY3RfbmFtZVxuXHRcdHJldHVybiBfb3B0aW9uc1xuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xuXHRwZXJtaXNzaW9uX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKG9iamVjdF9uYW1lKVxuXHRpY29uID0gX29iamVjdD8uaWNvblxuXHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxuXHRcdGlmICFfLmluY2x1ZGUoW1wiZ3JpZFwiLFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKVxuXHRcdFx0aWYgIS9cXHcrXFwuLy50ZXN0KGspIGFuZCBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTFcblx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XG5cdHJldHVybiBfb3B0aW9uc1xuXG4jIyNcbmZpbHRlcnM6IOimgei9rOaNoueahGZpbHRlcnNcbmZpZWxkczog5a+56LGh5a2X5q61XG5maWx0ZXJfZmllbGRzOiDpu5jorqTov4fmu6TlrZfmrrXvvIzmlK/mjIHlrZfnrKbkuLLmlbDnu4Tlkozlr7nosaHmlbDnu4TkuKTnp43moLzlvI/vvIzlpoI6WydmaWxlZF9uYW1lMScsJ2ZpbGVkX25hbWUyJ10sW3tmaWVsZDonZmlsZWRfbmFtZTEnLHJlcXVpcmVkOnRydWV9XVxu5aSE55CG6YC76L6ROiDmiopmaWx0ZXJz5Lit5a2Y5Zyo5LqOZmlsdGVyX2ZpZWxkc+eahOi/h+a7pOadoeS7tuWinuWKoOavj+mhueeahGlzX2RlZmF1bHTjgIFpc19yZXF1aXJlZOWxnuaAp++8jOS4jeWtmOWcqOS6jmZpbHRlcl9maWVsZHPnmoTov4fmu6TmnaHku7blr7nlupTnmoTnp7vpmaTmr4/pobnnmoTnm7jlhbPlsZ7mgKdcbui/lOWbnue7k+aenDog5aSE55CG5ZCO55qEZmlsdGVyc1xuIyMjXG5DcmVhdG9yLmdldEZpbHRlcnNXaXRoRmlsdGVyRmllbGRzID0gKGZpbHRlcnMsIGZpZWxkcywgZmlsdGVyX2ZpZWxkcyktPlxuXHR1bmxlc3MgZmlsdGVyc1xuXHRcdGZpbHRlcnMgPSBbXVxuXHR1bmxlc3MgZmlsdGVyX2ZpZWxkc1xuXHRcdGZpbHRlcl9maWVsZHMgPSBbXVxuXHRpZiBmaWx0ZXJfZmllbGRzPy5sZW5ndGhcblx0XHRmaWx0ZXJfZmllbGRzLmZvckVhY2ggKG4pLT5cblx0XHRcdGlmIF8uaXNTdHJpbmcobilcblx0XHRcdFx0biA9IFxuXHRcdFx0XHRcdGZpZWxkOiBuLFxuXHRcdFx0XHRcdHJlcXVpcmVkOiBmYWxzZVxuXHRcdFx0aWYgZmllbGRzW24uZmllbGRdIGFuZCAhXy5maW5kV2hlcmUoZmlsdGVycyx7ZmllbGQ6bi5maWVsZH0pXG5cdFx0XHRcdGZpbHRlcnMucHVzaFxuXHRcdFx0XHRcdGZpZWxkOiBuLmZpZWxkLFxuXHRcdFx0XHRcdGlzX2RlZmF1bHQ6IHRydWUsXG5cdFx0XHRcdFx0aXNfcmVxdWlyZWQ6IG4ucmVxdWlyZWRcblx0ZmlsdGVycy5mb3JFYWNoIChmaWx0ZXJJdGVtKS0+XG5cdFx0bWF0Y2hGaWVsZCA9IGZpbHRlcl9maWVsZHMuZmluZCAobiktPiByZXR1cm4gbiA9PSBmaWx0ZXJJdGVtLmZpZWxkIG9yIG4uZmllbGQgPT0gZmlsdGVySXRlbS5maWVsZFxuXHRcdGlmIF8uaXNTdHJpbmcobWF0Y2hGaWVsZClcblx0XHRcdG1hdGNoRmllbGQgPSBcblx0XHRcdFx0ZmllbGQ6IG1hdGNoRmllbGQsXG5cdFx0XHRcdHJlcXVpcmVkOiBmYWxzZVxuXHRcdGlmIG1hdGNoRmllbGRcblx0XHRcdGZpbHRlckl0ZW0uaXNfZGVmYXVsdCA9IHRydWVcblx0XHRcdGZpbHRlckl0ZW0uaXNfcmVxdWlyZWQgPSBtYXRjaEZpZWxkLnJlcXVpcmVkXG5cdFx0ZWxzZVxuXHRcdFx0ZGVsZXRlIGZpbHRlckl0ZW0uaXNfZGVmYXVsdFxuXHRcdFx0ZGVsZXRlIGZpbHRlckl0ZW0uaXNfcmVxdWlyZWRcblx0cmV0dXJuIGZpbHRlcnNcblxuQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKS0+XG5cblx0aWYgIW9iamVjdF9uYW1lXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0aWYgIXJlY29yZF9pZFxuXHRcdHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmIG9iamVjdF9uYW1lID09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikgJiYgIHJlY29yZF9pZCA9PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKVxuXHRcdFx0aWYgVGVtcGxhdGUuaW5zdGFuY2UoKT8ucmVjb3JkXG5cdFx0XHRcdHJldHVybiBUZW1wbGF0ZS5pbnN0YW5jZSgpPy5yZWNvcmQ/LmdldCgpXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZClcblxuXHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxuXHRpZiBjb2xsZWN0aW9uXG5cdFx0cmVjb3JkID0gY29sbGVjdGlvbi5maW5kT25lKHJlY29yZF9pZClcblx0XHRyZXR1cm4gcmVjb3JkXG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkTmFtZSA9IChyZWNvcmQsIG9iamVjdF9uYW1lKS0+XG5cdHVubGVzcyByZWNvcmRcblx0XHRyZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpXG5cdGlmIHJlY29yZFxuXHRcdCMg5pi+56S657uE57uH5YiX6KGo5pe277yM54m55q6K5aSE55CGbmFtZV9maWVsZF9rZXnkuLpuYW1l5a2X5q61XG5cdFx0bmFtZV9maWVsZF9rZXkgPSBpZiBvYmplY3RfbmFtZSA9PSBcIm9yZ2FuaXphdGlvbnNcIiB0aGVuIFwibmFtZVwiIGVsc2UgQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5OQU1FX0ZJRUxEX0tFWVxuXHRcdGlmIHJlY29yZCBhbmQgbmFtZV9maWVsZF9rZXlcblx0XHRcdHJldHVybiByZWNvcmQubGFiZWwgfHwgcmVjb3JkW25hbWVfZmllbGRfa2V5XVxuXG5DcmVhdG9yLmdldEFwcCA9IChhcHBfaWQpLT5cblx0aWYgIWFwcF9pZFxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdGFwcCA9IENyZWF0b3IuQXBwc1thcHBfaWRdXG5cdENyZWF0b3IuZGVwcz8uYXBwPy5kZXBlbmQoKVxuXHRyZXR1cm4gYXBwXG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkID0gKGFwcF9pZCktPlxuXHRhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpXG5cdGlmICFhcHBcblx0XHRyZXR1cm5cblx0ZGFzaGJvYXJkID0gbnVsbFxuXHRfLmVhY2ggQ3JlYXRvci5EYXNoYm9hcmRzLCAodiwgayktPlxuXHRcdGlmIHYuYXBwcz8uaW5kZXhPZihhcHAuX2lkKSA+IC0xXG5cdFx0XHRkYXNoYm9hcmQgPSB2O1xuXHRyZXR1cm4gZGFzaGJvYXJkO1xuXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZENvbXBvbmVudCA9IChhcHBfaWQpLT5cblx0YXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKVxuXHRpZiAhYXBwXG5cdFx0cmV0dXJuXG5cdHJldHVybiBSZWFjdFN0ZWVkb3MucGx1Z2luQ29tcG9uZW50U2VsZWN0b3IoUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCksIFwiRGFzaGJvYXJkXCIsIGFwcC5faWQpO1xuXG5DcmVhdG9yLmdldEFwcE9iamVjdE5hbWVzID0gKGFwcF9pZCktPlxuXHRhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpXG5cdGlmICFhcHBcblx0XHRyZXR1cm5cblx0aXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKClcblx0YXBwT2JqZWN0cyA9IGlmIGlzTW9iaWxlIHRoZW4gYXBwLm1vYmlsZV9vYmplY3RzIGVsc2UgYXBwLm9iamVjdHNcblx0b2JqZWN0cyA9IFtdXG5cdGlmIGFwcFxuXHRcdF8uZWFjaCBhcHBPYmplY3RzLCAodiktPlxuXHRcdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qodilcblx0XHRcdGlmIG9iaj8ucGVybWlzc2lvbnMuZ2V0KCkuYWxsb3dSZWFkXG5cdFx0XHRcdG9iamVjdHMucHVzaCB2XG5cdHJldHVybiBvYmplY3RzXG5cbkNyZWF0b3IuZ2V0QXBwTWVudSA9IChhcHBfaWQsIG1lbnVfaWQpLT5cblx0bWVudXMgPSBDcmVhdG9yLmdldEFwcE1lbnVzKGFwcF9pZClcblx0cmV0dXJuIG1lbnVzICYmIG1lbnVzLmZpbmQgKG1lbnUpLT4gcmV0dXJuIG1lbnUuaWQgPT0gbWVudV9pZFxuXG5DcmVhdG9yLmdldEFwcE1lbnVVcmxGb3JJbnRlcm5ldCA9IChtZW51KS0+XG5cdCMg5b2TdGFic+exu+Wei+S4unVybOaXtu+8jOaMieWklumDqOmTvuaOpeWkhOeQhu+8jOaUr+aMgemFjee9ruihqOi+vuW8j+W5tuWKoOS4iue7n+S4gOeahHVybOWPguaVsFxuXHRwYXJhbXMgPSB7fTtcblx0cGFyYW1zW1wiWC1TcGFjZS1JZFwiXSA9IFN0ZWVkb3Muc3BhY2VJZCgpXG5cdHBhcmFtc1tcIlgtVXNlci1JZFwiXSA9IFN0ZWVkb3MudXNlcklkKCk7XG5cdHBhcmFtc1tcIlgtQ29tcGFueS1JZHNcIl0gPSBTdGVlZG9zLmdldFVzZXJDb21wYW55SWRzKCk7XG5cdCMgcGFyYW1zW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcblx0c2RrID0gcmVxdWlyZShcIkBzdGVlZG9zLXVpL2J1aWxkZXItY29tbXVuaXR5L2Rpc3QvYnVpbGRlci1jb21tdW5pdHkucmVhY3QuanNcIilcblx0dXJsID0gbWVudS5wYXRoXG5cdGlmIHNkayBhbmQgc2RrLlV0aWxzIGFuZCBzZGsuVXRpbHMuaXNFeHByZXNzaW9uKHVybClcblx0XHR1cmwgPSBzZGsuVXRpbHMucGFyc2VTaW5nbGVFeHByZXNzaW9uKHVybCwgbWVudSwgXCIjXCIsIENyZWF0b3IuVVNFUl9DT05URVhUKVxuXHRoYXNRdWVyeVN5bWJvbCA9IC8oXFwjLitcXD8pfChcXD9bXiNdKiQpL2cudGVzdCh1cmwpXG5cdCMg5aaC5p6c5rKh5pyJI+WPt+aXtuWOu+WIpOaWreaYr+WQpuacie+8n+WPt++8jOacieacq+WwvuWKoCbvvIzml6DmnKvlsL7liqDvvJ/vvJsgICAg5pyJI+WPt+aXtuWIpOaWrSPlj7flkI7pnaLmmK/lkKbmnInvvJ/lj7fvvIzmnInmnKvlsL7liqAm77yM5peg5pyr5bC+5Yqg77yfXG5cdGxpbmtTdHIgPSBpZiBoYXNRdWVyeVN5bWJvbCB0aGVuIFwiJlwiIGVsc2UgXCI/XCJcblx0cmV0dXJuIFwiI3t1cmx9I3tsaW5rU3RyfSN7JC5wYXJhbShwYXJhbXMpfVwiXG5cbkNyZWF0b3IuZ2V0QXBwTWVudVVybCA9IChtZW51KS0+XG5cdHVybCA9IG1lbnUucGF0aFxuXHRpZiBtZW51LnR5cGUgPT0gXCJ1cmxcIlxuXHRcdGlmIG1lbnUudGFyZ2V0XG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRBcHBNZW51VXJsRm9ySW50ZXJuZXQobWVudSlcblx0XHRlbHNlXG5cdFx0XHQjIOWcqGlmcmFtZeS4reaYvuekunVybOeVjOmdolxuXHRcdFx0cmV0dXJuIFwiL2FwcC8tL3RhYl9pZnJhbWUvI3ttZW51LmlkfVwiXG5cdGVsc2Vcblx0XHRyZXR1cm4gbWVudS5wYXRoXG5cbkNyZWF0b3IuZ2V0QXBwTWVudXMgPSAoYXBwX2lkKS0+XG5cdGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZClcblx0aWYgIWFwcFxuXHRcdHJldHVybiBbXVxuXHRhcHBNZW51cyA9IFNlc3Npb24uZ2V0KFwiYXBwX21lbnVzXCIpO1xuXHR1bmxlc3MgYXBwTWVudXNcblx0XHRyZXR1cm4gW11cblx0Y3VyZW50QXBwTWVudXMgPSBhcHBNZW51cy5maW5kIChtZW51SXRlbSkgLT5cblx0XHRyZXR1cm4gbWVudUl0ZW0uaWQgPT0gYXBwLl9pZFxuXHRpZiBjdXJlbnRBcHBNZW51c1xuXHRcdHJldHVybiBjdXJlbnRBcHBNZW51cy5jaGlsZHJlblxuXG5DcmVhdG9yLmxvYWRBcHBzTWVudXMgPSAoKS0+XG5cdGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpXG5cdGRhdGEgPSB7IH1cblx0aWYgaXNNb2JpbGVcblx0XHRkYXRhLm1vYmlsZSA9IGlzTW9iaWxlXG5cdG9wdGlvbnMgPSB7IFxuXHRcdHR5cGU6ICdnZXQnLCBcblx0XHRkYXRhOiBkYXRhLCBcblx0XHRzdWNjZXNzOiAoZGF0YSktPlxuXHRcdFx0U2Vzc2lvbi5zZXQoXCJhcHBfbWVudXNcIiwgZGF0YSk7XG5cdCB9XG5cdFN0ZWVkb3MuYXV0aFJlcXVlc3QgXCIvc2VydmljZS9hcGkvYXBwcy9tZW51c1wiLCBvcHRpb25zXG5cbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHMgPSAoaW5jbHVkZUFkbWluKS0+XG5cdGNoYW5nZUFwcCA9IENyZWF0b3IuX3N1YkFwcC5nZXQoKTtcblx0UmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCkuZW50aXRpZXMuYXBwcyA9IE9iamVjdC5hc3NpZ24oe30sIFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLmVudGl0aWVzLmFwcHMsIHthcHBzOiBjaGFuZ2VBcHB9KTtcblx0cmV0dXJuIFJlYWN0U3RlZWRvcy52aXNpYmxlQXBwc1NlbGVjdG9yKFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLCBpbmNsdWRlQWRtaW4pXG5cbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHNPYmplY3RzID0gKCktPlxuXHRhcHBzID0gQ3JlYXRvci5nZXRWaXNpYmxlQXBwcygpXG5cdHZpc2libGVPYmplY3ROYW1lcyA9IF8uZmxhdHRlbihfLnBsdWNrKGFwcHMsJ29iamVjdHMnKSlcblx0b2JqZWN0cyA9IF8uZmlsdGVyIENyZWF0b3IuT2JqZWN0cywgKG9iaiktPlxuXHRcdGlmIHZpc2libGVPYmplY3ROYW1lcy5pbmRleE9mKG9iai5uYW1lKSA8IDBcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB0cnVlXG5cdG9iamVjdHMgPSBvYmplY3RzLnNvcnQoQ3JlYXRvci5zb3J0aW5nTWV0aG9kLmJpbmQoe2tleTpcImxhYmVsXCJ9KSlcblx0b2JqZWN0cyA9IF8ucGx1Y2sob2JqZWN0cywnbmFtZScpXG5cdHJldHVybiBfLnVuaXEgb2JqZWN0c1xuXG5DcmVhdG9yLmdldEFwcHNPYmplY3RzID0gKCktPlxuXHRvYmplY3RzID0gW11cblx0dGVtcE9iamVjdHMgPSBbXVxuXHRfLmZvckVhY2ggQ3JlYXRvci5BcHBzLCAoYXBwKS0+XG5cdFx0dGVtcE9iamVjdHMgPSBfLmZpbHRlciBhcHAub2JqZWN0cywgKG9iaiktPlxuXHRcdFx0cmV0dXJuICFvYmouaGlkZGVuXG5cdFx0b2JqZWN0cyA9IG9iamVjdHMuY29uY2F0KHRlbXBPYmplY3RzKVxuXHRyZXR1cm4gXy51bmlxIG9iamVjdHNcblxuQ3JlYXRvci52YWxpZGF0ZUZpbHRlcnMgPSAoZmlsdGVycywgbG9naWMpLT5cblx0ZmlsdGVyX2l0ZW1zID0gXy5tYXAgZmlsdGVycywgKG9iaikgLT5cblx0XHRpZiBfLmlzRW1wdHkob2JqKVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG9ialxuXHRmaWx0ZXJfaXRlbXMgPSBfLmNvbXBhY3QoZmlsdGVyX2l0ZW1zKVxuXHRlcnJvck1zZyA9IFwiXCJcblx0ZmlsdGVyX2xlbmd0aCA9IGZpbHRlcl9pdGVtcy5sZW5ndGhcblx0aWYgbG9naWNcblx0XHQjIOagvOW8j+WMlmZpbHRlclxuXHRcdGxvZ2ljID0gbG9naWMucmVwbGFjZSgvXFxuL2csIFwiXCIpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpXG5cblx0XHQjIOWIpOaWreeJueauiuWtl+esplxuXHRcdGlmIC9bLl9cXC0hK10rL2lnLnRlc3QobG9naWMpXG5cdFx0XHRlcnJvck1zZyA9IFwi5ZCr5pyJ54m55q6K5a2X56ym44CCXCJcblxuXHRcdGlmICFlcnJvck1zZ1xuXHRcdFx0aW5kZXggPSBsb2dpYy5tYXRjaCgvXFxkKy9pZylcblx0XHRcdGlmICFpbmRleFxuXHRcdFx0XHRlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5kZXguZm9yRWFjaCAoaSktPlxuXHRcdFx0XHRcdGlmIGkgPCAxIG9yIGkgPiBmaWx0ZXJfbGVuZ3RoXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5p2h5Lu25byV55So5LqG5pyq5a6a5LmJ55qE562b6YCJ5Zmo77yaI3tpfeOAglwiXG5cblx0XHRcdFx0ZmxhZyA9IDFcblx0XHRcdFx0d2hpbGUgZmxhZyA8PSBmaWx0ZXJfbGVuZ3RoXG5cdFx0XHRcdFx0aWYgIWluZGV4LmluY2x1ZGVzKFwiI3tmbGFnfVwiKVxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBcIuacieS6m+etm+mAieadoeS7tui/m+ihjOS6huWumuS5ie+8jOS9huacquWcqOmrmOe6p+etm+mAieadoeS7tuS4reiiq+W8leeUqOOAglwiXG5cdFx0XHRcdFx0ZmxhZysrO1xuXG5cdFx0aWYgIWVycm9yTXNnXG5cdFx0XHQjIOWIpOaWreaYr+WQpuaciemdnuazleiLseaWh+Wtl+esplxuXHRcdFx0d29yZCA9IGxvZ2ljLm1hdGNoKC9bYS16QS1aXSsvaWcpXG5cdFx0XHRpZiB3b3JkXG5cdFx0XHRcdHdvcmQuZm9yRWFjaCAodyktPlxuXHRcdFx0XHRcdGlmICEvXihhbmR8b3IpJC9pZy50ZXN0KHcpXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IFwi5qOA5p+l5oKo55qE6auY57qn562b6YCJ5p2h5Lu25Lit55qE5ou85YaZ44CCXCJcblxuXHRcdGlmICFlcnJvck1zZ1xuXHRcdFx0IyDliKTmlq3moLzlvI/mmK/lkKbmraPnoa5cblx0XHRcdHRyeVxuXHRcdFx0XHRDcmVhdG9yLmV2YWwobG9naWMucmVwbGFjZSgvYW5kL2lnLCBcIiYmXCIpLnJlcGxhY2UoL29yL2lnLCBcInx8XCIpKVxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5Lit5ZCr5pyJ54m55q6K5a2X56ymXCJcblxuXHRcdFx0aWYgLyhBTkQpW14oKV0rKE9SKS9pZy50ZXN0KGxvZ2ljKSB8fCAgLyhPUilbXigpXSsoQU5EKS9pZy50ZXN0KGxvZ2ljKVxuXHRcdFx0XHRlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5b+F6aG75Zyo6L+e57ut5oCn55qEIEFORCDlkowgT1Ig6KGo6L6+5byP5YmN5ZCO5L2/55So5ous5Y+344CCXCJcblx0aWYgZXJyb3JNc2dcblx0XHRjb25zb2xlLmxvZyBcImVycm9yXCIsIGVycm9yTXNnXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHR0b2FzdHIuZXJyb3IoZXJyb3JNc2cpXG5cdFx0cmV0dXJuIGZhbHNlXG5cdGVsc2Vcblx0XHRyZXR1cm4gdHJ1ZVxuXG4jIFwiPVwiLCBcIjw+XCIsIFwiPlwiLCBcIj49XCIsIFwiPFwiLCBcIjw9XCIsIFwic3RhcnRzd2l0aFwiLCBcImNvbnRhaW5zXCIsIFwibm90Y29udGFpbnNcIi5cbiMjI1xub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcbmV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcbiMjI1xuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9Nb25nbyA9IChmaWx0ZXJzLCBvcHRpb25zKS0+XG5cdHVubGVzcyBmaWx0ZXJzPy5sZW5ndGhcblx0XHRyZXR1cm5cblx0IyDlvZNmaWx0ZXJz5LiN5pivW0FycmF5Xeexu+Wei+iAjOaYr1tPYmplY3Rd57G75Z6L5pe277yM6L+b6KGM5qC85byP6L2s5o2iXG5cdHVubGVzcyBmaWx0ZXJzWzBdIGluc3RhbmNlb2YgQXJyYXlcblx0XHRmaWx0ZXJzID0gXy5tYXAgZmlsdGVycywgKG9iaiktPlxuXHRcdFx0cmV0dXJuIFtvYmouZmllbGQsIG9iai5vcGVyYXRpb24sIG9iai52YWx1ZV1cblx0c2VsZWN0b3IgPSBbXVxuXHRfLmVhY2ggZmlsdGVycywgKGZpbHRlciktPlxuXHRcdGZpZWxkID0gZmlsdGVyWzBdXG5cdFx0b3B0aW9uID0gZmlsdGVyWzFdXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSlcblx0XHRlbHNlXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgbnVsbCwgb3B0aW9ucylcblx0XHRzdWJfc2VsZWN0b3IgPSB7fVxuXHRcdHN1Yl9zZWxlY3RvcltmaWVsZF0gPSB7fVxuXHRcdGlmIG9wdGlvbiA9PSBcIj1cIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRlcVwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8PlwiXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJG5lXCJdID0gdmFsdWVcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIj5cIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndFwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI+PVwiXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGd0ZVwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8XCJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPD1cIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdGVcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwic3RhcnRzd2l0aFwiXG5cdFx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXlwiICsgdmFsdWUsIFwiaVwiKVxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZ1xuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiY29udGFpbnNcIlxuXHRcdFx0cmVnID0gbmV3IFJlZ0V4cCh2YWx1ZSwgXCJpXCIpXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCJub3Rjb250YWluc1wiXG5cdFx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXigoPyFcIiArIHZhbHVlICsgXCIpLikqJFwiLCBcImlcIilcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWdcblx0XHRzZWxlY3Rvci5wdXNoIHN1Yl9zZWxlY3RvclxuXHRyZXR1cm4gc2VsZWN0b3JcblxuQ3JlYXRvci5pc0JldHdlZW5GaWx0ZXJPcGVyYXRpb24gPSAob3BlcmF0aW9uKS0+XG5cdHJldHVybiBvcGVyYXRpb24gPT0gXCJiZXR3ZWVuXCIgb3IgISFDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyh0cnVlKT9bb3BlcmF0aW9uXVxuXG4jIyNcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5cdGV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcbiMjI1xuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9EZXYgPSAoZmlsdGVycywgb2JqZWN0X25hbWUsIG9wdGlvbnMpLT5cblx0c3RlZWRvc0ZpbHRlcnMgPSByZXF1aXJlKFwiQHN0ZWVkb3MvZmlsdGVyc1wiKTtcblx0dW5sZXNzIGZpbHRlcnMubGVuZ3RoXG5cdFx0cmV0dXJuXG5cdGlmIG9wdGlvbnM/LmlzX2xvZ2ljX29yXG5cdFx0IyDlpoLmnpxpc19sb2dpY19vcuS4unRydWXvvIzkuLpmaWx0ZXJz56ys5LiA5bGC5YWD57Sg5aKe5Yqgb3Lpl7TpmpRcblx0XHRsb2dpY1RlbXBGaWx0ZXJzID0gW11cblx0XHRmaWx0ZXJzLmZvckVhY2ggKG4pLT5cblx0XHRcdGxvZ2ljVGVtcEZpbHRlcnMucHVzaChuKVxuXHRcdFx0bG9naWNUZW1wRmlsdGVycy5wdXNoKFwib3JcIilcblx0XHRsb2dpY1RlbXBGaWx0ZXJzLnBvcCgpXG5cdFx0ZmlsdGVycyA9IGxvZ2ljVGVtcEZpbHRlcnNcblx0c2VsZWN0b3IgPSBzdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9EZXYoZmlsdGVycywgQ3JlYXRvci5VU0VSX0NPTlRFWFQpXG5cdHJldHVybiBzZWxlY3RvclxuXG4jIyNcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4jIyNcbkNyZWF0b3IuZm9ybWF0TG9naWNGaWx0ZXJzVG9EZXYgPSAoZmlsdGVycywgZmlsdGVyX2xvZ2ljLCBvcHRpb25zKS0+XG5cdGZvcm1hdF9sb2dpYyA9IGZpbHRlcl9sb2dpYy5yZXBsYWNlKC9cXChcXHMrL2lnLCBcIihcIikucmVwbGFjZSgvXFxzK1xcKS9pZywgXCIpXCIpLnJlcGxhY2UoL1xcKC9nLCBcIltcIikucmVwbGFjZSgvXFwpL2csIFwiXVwiKS5yZXBsYWNlKC9cXHMrL2csIFwiLFwiKS5yZXBsYWNlKC8oYW5kfG9yKS9pZywgXCInJDEnXCIpXG5cdGZvcm1hdF9sb2dpYyA9IGZvcm1hdF9sb2dpYy5yZXBsYWNlKC8oXFxkKSsvaWcsICh4KS0+XG5cdFx0X2YgPSBmaWx0ZXJzW3gtMV1cblx0XHRmaWVsZCA9IF9mLmZpZWxkXG5cdFx0b3B0aW9uID0gX2Yub3BlcmF0aW9uXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlKVxuXHRcdGVsc2Vcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUsIG51bGwsIG9wdGlvbnMpXG5cdFx0c3ViX3NlbGVjdG9yID0gW11cblx0XHRpZiBfLmlzQXJyYXkodmFsdWUpID09IHRydWVcblx0XHRcdGlmIG9wdGlvbiA9PSBcIj1cIlxuXHRcdFx0XHRfLmVhY2ggdmFsdWUsICh2KS0+XG5cdFx0XHRcdFx0c3ViX3NlbGVjdG9yLnB1c2ggW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCJcblx0XHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPD5cIlxuXHRcdFx0XHRfLmVhY2ggdmFsdWUsICh2KS0+XG5cdFx0XHRcdFx0c3ViX3NlbGVjdG9yLnB1c2ggW2ZpZWxkLCBvcHRpb24sIHZdLCBcImFuZFwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdF8uZWFjaCB2YWx1ZSwgKHYpLT5cblx0XHRcdFx0XHRzdWJfc2VsZWN0b3IucHVzaCBbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIlxuXHRcdFx0aWYgc3ViX3NlbGVjdG9yW3N1Yl9zZWxlY3Rvci5sZW5ndGggLSAxXSA9PSBcImFuZFwiIHx8IHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT0gXCJvclwiXG5cdFx0XHRcdHN1Yl9zZWxlY3Rvci5wb3AoKVxuXHRcdGVsc2Vcblx0XHRcdHN1Yl9zZWxlY3RvciA9IFtmaWVsZCwgb3B0aW9uLCB2YWx1ZV1cblx0XHRjb25zb2xlLmxvZyBcInN1Yl9zZWxlY3RvclwiLCBzdWJfc2VsZWN0b3Jcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3ViX3NlbGVjdG9yKVxuXHQpXG5cdGZvcm1hdF9sb2dpYyA9IFwiWyN7Zm9ybWF0X2xvZ2ljfV1cIlxuXHRyZXR1cm4gQ3JlYXRvci5ldmFsKGZvcm1hdF9sb2dpYylcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRpZiAhX29iamVjdFxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lc1xuXG4jXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soX29iamVjdC5yZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxuXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoX29iamVjdC5fY29sbGVjdGlvbl9uYW1lKVxuXG5cdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxuXHRpZiByZWxhdGVkX29iamVjdF9uYW1lcz8ubGVuZ3RoID09IDBcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXNcblxuXHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0dW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0c1xuXG5cdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0c1xuXHRyZXR1cm4gXy5maWx0ZXIgcmVsYXRlZF9vYmplY3RzLCAocmVsYXRlZF9vYmplY3QpLT5cblx0XHRyZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3Qub2JqZWN0X25hbWVcblx0XHRpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMVxuXHRcdCMgcmVsYXRlZF9vYmplY3RfbmFtZSA9IGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjZnNfZmlsZXNfZmlsZXJlY29yZFwiIHRoZW4gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiIGVsc2UgcmVsYXRlZF9vYmplY3RfbmFtZVxuXHRcdGFsbG93UmVhZCA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8uYWxsb3dSZWFkXG5cdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRhbGxvd1JlYWQgPSBhbGxvd1JlYWQgJiYgcGVybWlzc2lvbnMuYWxsb3dSZWFkRmlsZXNcblx0XHRyZXR1cm4gaXNBY3RpdmUgYW5kIGFsbG93UmVhZFxuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3ROYW1lcyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0cmV0dXJuIF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcblxuQ3JlYXRvci5nZXRBY3Rpb25zID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdGlmICF1c2VySWRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdGlmICFvYmpcblx0XHRyZXR1cm5cblxuXHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0ZGlzYWJsZWRfYWN0aW9ucyA9IHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnNcblx0YWN0aW9ucyA9IF8uc29ydEJ5KF8udmFsdWVzKG9iai5hY3Rpb25zKSAsICdzb3J0Jyk7XG5cblx0aWYgXy5oYXMob2JqLCAnYWxsb3dfY3VzdG9tQWN0aW9ucycpXG5cdFx0YWN0aW9ucyA9IF8uZmlsdGVyIGFjdGlvbnMsIChhY3Rpb24pLT5cblx0XHRcdHJldHVybiBfLmluY2x1ZGUob2JqLmFsbG93X2N1c3RvbUFjdGlvbnMsIGFjdGlvbi5uYW1lKSB8fCBfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuZ2V0T2JqZWN0KCdiYXNlJykuYWN0aW9ucykgfHwge30sIGFjdGlvbi5uYW1lKVxuXHRpZiBfLmhhcyhvYmosICdleGNsdWRlX2FjdGlvbnMnKVxuXHRcdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XG5cdFx0XHRyZXR1cm4gIV8uaW5jbHVkZShvYmouZXhjbHVkZV9hY3Rpb25zLCBhY3Rpb24ubmFtZSlcblxuXHRfLmVhY2ggYWN0aW9ucywgKGFjdGlvbiktPlxuXHRcdCMg5omL5py65LiK5Y+q5pi+56S657yW6L6R5oyJ6ZKu77yM5YW25LuW55qE5pS+5Yiw5oqY5Y+g5LiL5ouJ6I+c5Y2V5LitXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcInJlY29yZFwiLCBcInJlY29yZF9vbmx5XCJdLmluZGV4T2YoYWN0aW9uLm9uKSA+IC0xICYmIGFjdGlvbi5uYW1lICE9ICdzdGFuZGFyZF9lZGl0J1xuXHRcdFx0aWYgYWN0aW9uLm9uID09IFwicmVjb3JkX29ubHlcIlxuXHRcdFx0XHRhY3Rpb24ub24gPSAncmVjb3JkX29ubHlfbW9yZSdcblx0XHRcdGVsc2Vcblx0XHRcdFx0YWN0aW9uLm9uID0gJ3JlY29yZF9tb3JlJ1xuXG5cdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJjbXNfZmlsZXNcIiwgXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXS5pbmRleE9mKG9iamVjdF9uYW1lKSA+IC0xXG5cdFx0IyDpmYTku7bnibnmrorlpITnkIbvvIzkuIvovb3mjInpkq7mlL7lnKjkuLvoj5zljZXvvIznvJbovpHmjInpkq7mlL7liLDlupXkuIvmipjlj6DkuIvmi4noj5zljZXkuK1cblx0XHRhY3Rpb25zLmZpbmQoKG4pLT4gcmV0dXJuIG4ubmFtZSA9PSBcInN0YW5kYXJkX2VkaXRcIik/Lm9uID0gXCJyZWNvcmRfbW9yZVwiXG5cdFx0YWN0aW9ucy5maW5kKChuKS0+IHJldHVybiBuLm5hbWUgPT0gXCJkb3dubG9hZFwiKT8ub24gPSBcInJlY29yZFwiXG5cblx0YWN0aW9ucyA9IF8uZmlsdGVyIGFjdGlvbnMsIChhY3Rpb24pLT5cblx0XHRyZXR1cm4gXy5pbmRleE9mKGRpc2FibGVkX2FjdGlvbnMsIGFjdGlvbi5uYW1lKSA8IDBcblxuXHRyZXR1cm4gYWN0aW9uc1xuXG4vLy9cblx06L+U5Zue5b2T5YmN55So5oi35pyJ5p2D6ZmQ6K6/6Zeu55qE5omA5pyJbGlzdF92aWV377yM5YyF5ous5YiG5Lqr55qE77yM55So5oi36Ieq5a6a5LmJ6Z2e5YiG5Lqr55qE77yI6Zmk6Z2eb3duZXLlj5jkuobvvInvvIzku6Xlj4rpu5jorqTnmoTlhbbku5bop4blm75cblx05rOo5oSPQ3JlYXRvci5nZXRQZXJtaXNzaW9uc+WHveaVsOS4reaYr+S4jeS8muacieeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahOinhuWbvueahO+8jOaJgOS7pUNyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mi7/liLDnmoTnu5PmnpzkuI3lhajvvIzlubbkuI3mmK/lvZPliY3nlKjmiLfog73nnIvliLDmiYDmnInop4blm75cbi8vL1xuQ3JlYXRvci5nZXRMaXN0Vmlld3MgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cdFxuXHR1bmxlc3Mgb2JqZWN0X25hbWVcblx0XHRyZXR1cm5cblxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRpZiAhb2JqZWN0XG5cdFx0cmV0dXJuXG5cblx0ZGlzYWJsZWRfbGlzdF92aWV3cyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk/LmRpc2FibGVkX2xpc3Rfdmlld3MgfHwgW11cblxuXHRsaXN0X3ZpZXdzID0gW11cblxuXHRpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKVxuXG5cdF8uZWFjaCBvYmplY3QubGlzdF92aWV3cywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZVxuXG5cdGxpc3RWaWV3cyA9IF8uc29ydEJ5KF8udmFsdWVzKG9iamVjdC5saXN0X3ZpZXdzKSAsICdzb3J0X25vJyk7XG5cblx0Xy5lYWNoIGxpc3RWaWV3cywgKGl0ZW0pLT5cblx0XHRpZiBpc01vYmlsZSBhbmQgaXRlbS50eXBlID09IFwiY2FsZW5kYXJcIlxuXHRcdFx0IyDmiYvmnLrkuIrlhYjkuI3mmL7npLrml6Xljobop4blm75cblx0XHRcdHJldHVyblxuXHRcdGlmIGl0ZW0ubmFtZSAgIT0gXCJkZWZhdWx0XCJcblx0XHRcdGlzRGlzYWJsZWQgPSBfLmluZGV4T2YoZGlzYWJsZWRfbGlzdF92aWV3cywgaXRlbS5uYW1lKSA+IC0xIHx8IChpdGVtLl9pZCAmJiBfLmluZGV4T2YoZGlzYWJsZWRfbGlzdF92aWV3cywgaXRlbS5faWQpID4gLTEpXG5cdFx0XHRpZiAhaXNEaXNhYmxlZCB8fCBpdGVtLm93bmVyID09IHVzZXJJZFxuXHRcdFx0XHRsaXN0X3ZpZXdzLnB1c2ggaXRlbVxuXHRyZXR1cm4gbGlzdF92aWV3c1xuXG4jIOWJjeWPsOeQhuiuuuS4iuS4jeW6lOivpeiwg+eUqOivpeWHveaVsO+8jOWboOS4uuWtl+auteeahOadg+mZkOmDveWcqENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKS5maWVsZHPnmoTnm7jlhbPlsZ7mgKfkuK3mnInmoIfor4bkuoZcbkNyZWF0b3IuZ2V0RmllbGRzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdGlmICF1c2VySWRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXG5cdGZpZWxkc05hbWUgPSBDcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUob2JqZWN0X25hbWUpXG5cdHVucmVhZGFibGVfZmllbGRzID0gIENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk/LnVucmVhZGFibGVfZmllbGRzXG5cdHJldHVybiBfLmRpZmZlcmVuY2UoZmllbGRzTmFtZSwgdW5yZWFkYWJsZV9maWVsZHMpXG5cbkNyZWF0b3IuaXNsb2FkaW5nID0gKCktPlxuXHRyZXR1cm4gIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkLmdldCgpXG5cbkNyZWF0b3IuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSAoc3RyKS0+XG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIilcblxuIyDorqHnrpdmaWVsZHPnm7jlhbPlh73mlbBcbiMgU1RBUlRcbkNyZWF0b3IuZ2V0RGlzYWJsZWRGaWVsZHMgPSAoc2NoZW1hKS0+XG5cdGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkLCBmaWVsZE5hbWUpIC0+XG5cdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS5kaXNhYmxlZCBhbmQgIWZpZWxkLmF1dG9mb3JtLm9taXQgYW5kIGZpZWxkTmFtZVxuXHQpXG5cdGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpXG5cdHJldHVybiBmaWVsZHNcblxuQ3JlYXRvci5nZXRIaWRkZW5GaWVsZHMgPSAoc2NoZW1hKS0+XG5cdGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkLCBmaWVsZE5hbWUpIC0+XG5cdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS50eXBlID09IFwiaGlkZGVuXCIgYW5kICFmaWVsZC5hdXRvZm9ybS5vbWl0IGFuZCBmaWVsZE5hbWVcblx0KVxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxuXHRyZXR1cm4gZmllbGRzXG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aE5vR3JvdXAgPSAoc2NoZW1hKS0+XG5cdGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkLCBmaWVsZE5hbWUpIC0+XG5cdFx0cmV0dXJuICghZmllbGQuYXV0b2Zvcm0gb3IgIWZpZWxkLmF1dG9mb3JtLmdyb3VwIG9yIGZpZWxkLmF1dG9mb3JtLmdyb3VwID09IFwiLVwiKSBhbmQgKCFmaWVsZC5hdXRvZm9ybSBvciBmaWVsZC5hdXRvZm9ybS50eXBlICE9IFwiaGlkZGVuXCIpIGFuZCBmaWVsZE5hbWVcblx0KVxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxuXHRyZXR1cm4gZmllbGRzXG5cbkNyZWF0b3IuZ2V0U29ydGVkRmllbGRHcm91cE5hbWVzID0gKHNjaGVtYSktPlxuXHRuYW1lcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkKSAtPlxuIFx0XHRyZXR1cm4gZmllbGQuYXV0b2Zvcm0gYW5kIGZpZWxkLmF1dG9mb3JtLmdyb3VwICE9IFwiLVwiIGFuZCBmaWVsZC5hdXRvZm9ybS5ncm91cFxuXHQpXG5cdG5hbWVzID0gXy5jb21wYWN0KG5hbWVzKVxuXHRuYW1lcyA9IF8udW5pcXVlKG5hbWVzKVxuXHRyZXR1cm4gbmFtZXNcblxuQ3JlYXRvci5nZXRGaWVsZHNGb3JHcm91cCA9IChzY2hlbWEsIGdyb3VwTmFtZSkgLT5cbiAgXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxuICAgIFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PSBncm91cE5hbWUgYW5kIGZpZWxkLmF1dG9mb3JtLnR5cGUgIT0gXCJoaWRkZW5cIiBhbmQgZmllbGROYW1lXG4gIFx0KVxuICBcdGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpXG4gIFx0cmV0dXJuIGZpZWxkc1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRPbWl0ID0gKHNjaGVtYSwga2V5cykgLT5cblx0a2V5cyA9IF8ubWFwKGtleXMsIChrZXkpIC0+XG5cdFx0ZmllbGQgPSBfLnBpY2soc2NoZW1hLCBrZXkpXG5cdFx0aWYgZmllbGRba2V5XS5hdXRvZm9ybT8ub21pdFxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGtleVxuXHQpXG5cdGtleXMgPSBfLmNvbXBhY3Qoa2V5cylcblx0cmV0dXJuIGtleXNcblxuQ3JlYXRvci5nZXRGaWVsZHNJbkZpcnN0TGV2ZWwgPSAoZmlyc3RMZXZlbEtleXMsIGtleXMpIC0+XG5cdGtleXMgPSBfLm1hcChrZXlzLCAoa2V5KSAtPlxuXHRcdGlmIF8uaW5kZXhPZihmaXJzdExldmVsS2V5cywga2V5KSA+IC0xXG5cdFx0XHRyZXR1cm4ga2V5XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdClcblx0a2V5cyA9IF8uY29tcGFjdChrZXlzKVxuXHRyZXR1cm4ga2V5c1xuXG5DcmVhdG9yLmdldEZpZWxkc0ZvclJlb3JkZXIgPSAoc2NoZW1hLCBrZXlzLCBpc1NpbmdsZSkgLT5cblx0ZmllbGRzID0gW11cblx0aSA9IDBcblx0X2tleXMgPSBfLmZpbHRlcihrZXlzLCAoa2V5KS0+XG5cdFx0cmV0dXJuICFrZXkuZW5kc1dpdGgoJ19lbmRMaW5lJylcblx0KTtcblx0d2hpbGUgaSA8IF9rZXlzLmxlbmd0aFxuXHRcdHNjXzEgPSBfLnBpY2soc2NoZW1hLCBfa2V5c1tpXSlcblx0XHRzY18yID0gXy5waWNrKHNjaGVtYSwgX2tleXNbaSsxXSlcblxuXHRcdGlzX3dpZGVfMSA9IGZhbHNlXG5cdFx0aXNfd2lkZV8yID0gZmFsc2VcblxuI1x0XHRpc19yYW5nZV8xID0gZmFsc2VcbiNcdFx0aXNfcmFuZ2VfMiA9IGZhbHNlXG5cblx0XHRfLmVhY2ggc2NfMSwgKHZhbHVlKSAtPlxuXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3dpZGUgfHwgdmFsdWUuYXV0b2Zvcm0/LnR5cGUgPT0gXCJ0YWJsZVwiXG5cdFx0XHRcdGlzX3dpZGVfMSA9IHRydWVcblxuI1x0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc19yYW5nZVxuI1x0XHRcdFx0aXNfcmFuZ2VfMSA9IHRydWVcblxuXHRcdF8uZWFjaCBzY18yLCAodmFsdWUpIC0+XG5cdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfd2lkZSB8fCB2YWx1ZS5hdXRvZm9ybT8udHlwZSA9PSBcInRhYmxlXCJcblx0XHRcdFx0aXNfd2lkZV8yID0gdHJ1ZVxuXG4jXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3JhbmdlXG4jXHRcdFx0XHRpc19yYW5nZV8yID0gdHJ1ZVxuXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRpc193aWRlXzEgPSB0cnVlXG5cdFx0XHRpc193aWRlXzIgPSB0cnVlXG5cblx0XHRpZiBpc1NpbmdsZVxuXHRcdFx0ZmllbGRzLnB1c2ggX2tleXMuc2xpY2UoaSwgaSsxKVxuXHRcdFx0aSArPSAxXG5cdFx0ZWxzZVxuI1x0XHRcdGlmICFpc19yYW5nZV8xICYmIGlzX3JhbmdlXzJcbiNcdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcbiNcdFx0XHRcdGNoaWxkS2V5cy5wdXNoIHVuZGVmaW5lZFxuI1x0XHRcdFx0ZmllbGRzLnB1c2ggY2hpbGRLZXlzXG4jXHRcdFx0XHRpICs9IDFcbiNcdFx0XHRlbHNlXG5cdFx0XHRpZiBpc193aWRlXzFcblx0XHRcdFx0ZmllbGRzLnB1c2ggX2tleXMuc2xpY2UoaSwgaSsxKVxuXHRcdFx0XHRpICs9IDFcblx0XHRcdGVsc2UgaWYgIWlzX3dpZGVfMSBhbmQgaXNfd2lkZV8yXG5cdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcblx0XHRcdFx0Y2hpbGRLZXlzLnB1c2ggdW5kZWZpbmVkXG5cdFx0XHRcdGZpZWxkcy5wdXNoIGNoaWxkS2V5c1xuXHRcdFx0XHRpICs9IDFcblx0XHRcdGVsc2UgaWYgIWlzX3dpZGVfMSBhbmQgIWlzX3dpZGVfMlxuXHRcdFx0XHRjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpKzEpXG5cdFx0XHRcdGlmIF9rZXlzW2krMV1cblx0XHRcdFx0XHRjaGlsZEtleXMucHVzaCBfa2V5c1tpKzFdXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcblx0XHRcdFx0ZmllbGRzLnB1c2ggY2hpbGRLZXlzXG5cdFx0XHRcdGkgKz0gMlxuXG5cdHJldHVybiBmaWVsZHNcblxuQ3JlYXRvci5pc0ZpbHRlclZhbHVlRW1wdHkgPSAodikgLT5cblx0cmV0dXJuIHR5cGVvZiB2ID09IFwidW5kZWZpbmVkXCIgfHwgdiA9PSBudWxsIHx8IE51bWJlci5pc05hTih2KSB8fCB2Lmxlbmd0aCA9PSAwXG5cbkNyZWF0b3IuZ2V0RmllbGREYXRhVHlwZSA9IChvYmplY3RGaWVsZHMsIGtleSktPlxuXHRpZiBvYmplY3RGaWVsZHMgYW5kIGtleVxuXHRcdHJlc3VsdCA9IG9iamVjdEZpZWxkc1trZXldPy50eXBlXG5cdFx0aWYgW1wiZm9ybXVsYVwiLCBcInN1bW1hcnlcIl0uaW5kZXhPZihyZXN1bHQpID4gLTFcblx0XHRcdHJlc3VsdCA9IG9iamVjdEZpZWxkc1trZXldLmRhdGFfdHlwZVxuXHRcdCMgZWxzZSBpZiByZXN1bHQgPT0gXCJzZWxlY3RcIiBhbmQgb2JqZWN0RmllbGRzW2tleV0/LmRhdGFfdHlwZSBhbmQgb2JqZWN0RmllbGRzW2tleV0uZGF0YV90eXBlICE9IFwidGV4dFwiXG5cdFx0IyBcdHJlc3VsdCA9IG9iamVjdEZpZWxkc1trZXldLmRhdGFfdHlwZVxuXHRcdHJldHVybiByZXN1bHRcblx0ZWxzZVxuXHRcdHJldHVybiBcInRleHRcIlxuXG4jIEVORFxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Q3JlYXRvci5nZXRBbGxSZWxhdGVkT2JqZWN0cyA9IChvYmplY3RfbmFtZSktPlxuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW11cblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cblx0XHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cblx0XHRcdFx0aWYgcmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWVcblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoIHJlbGF0ZWRfb2JqZWN0X25hbWVcblxuXHRcdGlmIENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKS5lbmFibGVfZmlsZXNcblx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzLnB1c2ggXCJjbXNfZmlsZXNcIlxuXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRTdGVlZG9zLmZvcm1hdEluZGV4ID0gKGFycmF5KSAtPlxuXHRcdG9iamVjdCA9IHtcbiAgICAgICAgXHRiYWNrZ3JvdW5kOiB0cnVlXG4gICAgXHR9O1xuXHRcdGlzZG9jdW1lbnREQiA9IE1ldGVvci5zZXR0aW5ncz8uZGF0YXNvdXJjZXM/LmRlZmF1bHQ/LmRvY3VtZW50REIgfHwgZmFsc2U7XG5cdFx0aWYgaXNkb2N1bWVudERCXG5cdFx0XHRpZiBhcnJheS5sZW5ndGggPiAwXG5cdFx0XHRcdGluZGV4TmFtZSA9IGFycmF5LmpvaW4oXCIuXCIpO1xuXHRcdFx0XHRvYmplY3QubmFtZSA9IGluZGV4TmFtZTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChpbmRleE5hbWUubGVuZ3RoID4gNTIpXG5cdFx0XHRcdFx0b2JqZWN0Lm5hbWUgPSBpbmRleE5hbWUuc3Vic3RyaW5nKDAsNTIpO1xuXG5cdFx0cmV0dXJuIG9iamVjdDsiLCJDcmVhdG9yLmdldFNjaGVtYSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLnNjaGVtYSA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gUmVhY3RTdGVlZG9zLnBsdWdpbkNvbXBvbmVudFNlbGVjdG9yKFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLCBcIk9iamVjdEhvbWVcIiwgb2JqZWN0X25hbWUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkge1xuICB2YXIgbGlzdF92aWV3LCBsaXN0X3ZpZXdfaWQ7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKTtcbiAgbGlzdF92aWV3X2lkID0gbGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcuX2lkIDogdm9pZCAwO1xuICBpZiAocmVjb3JkX2lkKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQpO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJtZWV0aW5nXCIpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChDcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQob2JqZWN0X25hbWUpKSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGxpc3Rfdmlld19pZCkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RBYnNvbHV0ZVVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkge1xuICB2YXIgbGlzdF92aWV3LCBsaXN0X3ZpZXdfaWQ7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKTtcbiAgbGlzdF92aWV3X2lkID0gbGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcuX2lkIDogdm9pZCAwO1xuICBpZiAocmVjb3JkX2lkKSB7XG4gICAgcmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQsIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJtZWV0aW5nXCIpIHtcbiAgICAgIHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIiwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkLCB0cnVlKTtcbiAgICB9XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0Um91dGVyVXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSB7XG4gIHZhciBsaXN0X3ZpZXcsIGxpc3Rfdmlld19pZDtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpO1xuICBsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5faWQgOiB2b2lkIDA7XG4gIGlmIChyZWNvcmRfaWQpIHtcbiAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBcIm1lZXRpbmdcIikge1xuICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkO1xuICAgIH1cbiAgfVxufTtcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1VybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkge1xuICB2YXIgdXJsO1xuICB1cmwgPSBDcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKTtcbiAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwodXJsKTtcbn07XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkge1xuICBpZiAobGlzdF92aWV3X2lkID09PSBcImNhbGVuZGFyXCIpIHtcbiAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRTd2l0Y2hMaXN0VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSB7XG4gIGlmIChsaXN0X3ZpZXdfaWQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi9saXN0XCIpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9saXN0L3N3aXRjaFwiKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgcmVjb3JkX2lkLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgaWYgKHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIHJlY29yZF9pZCArIFwiL1wiICsgcmVsYXRlZF9vYmplY3RfbmFtZSArIFwiL2dyaWQ/cmVsYXRlZF9maWVsZF9uYW1lPVwiICsgcmVsYXRlZF9maWVsZF9uYW1lKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyByZWNvcmRfaWQgKyBcIi9cIiArIHJlbGF0ZWRfb2JqZWN0X25hbWUgKyBcIi9ncmlkXCIpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBpc19kZWVwLCBpc19za2lwX2hpZGUsIGlzX3JlbGF0ZWQpIHtcbiAgdmFyIF9vYmplY3QsIF9vcHRpb25zLCBmaWVsZHMsIGljb24sIHJlbGF0ZWRPYmplY3RzO1xuICBfb3B0aW9ucyA9IFtdO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIF9vcHRpb25zO1xuICB9XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZmllbGRzIDogdm9pZCAwO1xuICBpY29uID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwO1xuICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgaWYgKGlzX3NraXBfaGlkZSAmJiBmLmhpZGRlbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZi50eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgIGxhYmVsOiBcIlwiICsgKGYubGFiZWwgfHwgayksXG4gICAgICAgIHZhbHVlOiBcIlwiICsgayxcbiAgICAgICAgaWNvbjogaWNvblxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgbGFiZWw6IGYubGFiZWwgfHwgayxcbiAgICAgICAgdmFsdWU6IGssXG4gICAgICAgIGljb246IGljb25cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIGlmIChpc19kZWVwKSB7XG4gICAgXy5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZiwgaykge1xuICAgICAgdmFyIHJfb2JqZWN0O1xuICAgICAgaWYgKGlzX3NraXBfaGlkZSAmJiBmLmhpZGRlbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoKGYudHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSAmJiBmLnJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKGYucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICByX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGYucmVmZXJlbmNlX3RvKTtcbiAgICAgICAgaWYgKHJfb2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGYyLCBrMikge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgICBsYWJlbDogKGYubGFiZWwgfHwgaykgKyBcIj0+XCIgKyAoZjIubGFiZWwgfHwgazIpLFxuICAgICAgICAgICAgICB2YWx1ZTogayArIFwiLlwiICsgazIsXG4gICAgICAgICAgICAgIGljb246IHJfb2JqZWN0ICE9IG51bGwgPyByX29iamVjdC5pY29uIDogdm9pZCAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChpc19yZWxhdGVkKSB7XG4gICAgcmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKTtcbiAgICBfLmVhY2gocmVsYXRlZE9iamVjdHMsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKF9yZWxhdGVkT2JqZWN0KSB7XG4gICAgICAgIHZhciByZWxhdGVkT2JqZWN0LCByZWxhdGVkT3B0aW9ucztcbiAgICAgICAgcmVsYXRlZE9wdGlvbnMgPSBDcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyhfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSk7XG4gICAgICAgIHJldHVybiBfLmVhY2gocmVsYXRlZE9wdGlvbnMsIGZ1bmN0aW9uKHJlbGF0ZWRPcHRpb24pIHtcbiAgICAgICAgICBpZiAoX3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXkgIT09IHJlbGF0ZWRPcHRpb24udmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgbGFiZWw6IChyZWxhdGVkT2JqZWN0LmxhYmVsIHx8IHJlbGF0ZWRPYmplY3QubmFtZSkgKyBcIj0+XCIgKyByZWxhdGVkT3B0aW9uLmxhYmVsLFxuICAgICAgICAgICAgICB2YWx1ZTogcmVsYXRlZE9iamVjdC5uYW1lICsgXCIuXCIgKyByZWxhdGVkT3B0aW9uLnZhbHVlLFxuICAgICAgICAgICAgICBpY29uOiByZWxhdGVkT2JqZWN0ICE9IG51bGwgPyByZWxhdGVkT2JqZWN0Lmljb24gOiB2b2lkIDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfVxuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEZpbHRlckZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBfb3B0aW9ucywgZmllbGRzLCBpY29uLCBwZXJtaXNzaW9uX2ZpZWxkcztcbiAgX29wdGlvbnMgPSBbXTtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfb3B0aW9ucztcbiAgfVxuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgcGVybWlzc2lvbl9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhvYmplY3RfbmFtZSk7XG4gIGljb24gPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDA7XG4gIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICBpZiAoIV8uaW5jbHVkZShbXCJncmlkXCIsIFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiLCBcImF2YXRhclwiLCBcImltYWdlXCIsIFwibWFya2Rvd25cIiwgXCJodG1sXCJdLCBmLnR5cGUpICYmICFmLmhpZGRlbikge1xuICAgICAgaWYgKCEvXFx3K1xcLi8udGVzdChrKSAmJiBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiBmLmxhYmVsIHx8IGssXG4gICAgICAgICAgdmFsdWU6IGssXG4gICAgICAgICAgaWNvbjogaWNvblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBfb3B0aW9ucywgZmllbGRzLCBpY29uLCBwZXJtaXNzaW9uX2ZpZWxkcztcbiAgX29wdGlvbnMgPSBbXTtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfb3B0aW9ucztcbiAgfVxuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgcGVybWlzc2lvbl9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhvYmplY3RfbmFtZSk7XG4gIGljb24gPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDA7XG4gIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICBpZiAoIV8uaW5jbHVkZShbXCJncmlkXCIsIFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKSkge1xuICAgICAgaWYgKCEvXFx3K1xcLi8udGVzdChrKSAmJiBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiBmLmxhYmVsIHx8IGssXG4gICAgICAgICAgdmFsdWU6IGssXG4gICAgICAgICAgaWNvbjogaWNvblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5cbi8qXG5maWx0ZXJzOiDopoHovazmjaLnmoRmaWx0ZXJzXG5maWVsZHM6IOWvueixoeWtl+autVxuZmlsdGVyX2ZpZWxkczog6buY6K6k6L+H5ruk5a2X5q6177yM5pSv5oyB5a2X56ym5Liy5pWw57uE5ZKM5a+56LGh5pWw57uE5Lik56eN5qC85byP77yM5aaCOlsnZmlsZWRfbmFtZTEnLCdmaWxlZF9uYW1lMiddLFt7ZmllbGQ6J2ZpbGVkX25hbWUxJyxyZXF1aXJlZDp0cnVlfV1cbuWkhOeQhumAu+i+kTog5oqKZmlsdGVyc+S4reWtmOWcqOS6jmZpbHRlcl9maWVsZHPnmoTov4fmu6TmnaHku7blop7liqDmr4/pobnnmoRpc19kZWZhdWx044CBaXNfcmVxdWlyZWTlsZ7mgKfvvIzkuI3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25a+55bqU55qE56e76Zmk5q+P6aG555qE55u45YWz5bGe5oCnXG7ov5Tlm57nu5Pmnpw6IOWkhOeQhuWQjueahGZpbHRlcnNcbiAqL1xuXG5DcmVhdG9yLmdldEZpbHRlcnNXaXRoRmlsdGVyRmllbGRzID0gZnVuY3Rpb24oZmlsdGVycywgZmllbGRzLCBmaWx0ZXJfZmllbGRzKSB7XG4gIGlmICghZmlsdGVycykge1xuICAgIGZpbHRlcnMgPSBbXTtcbiAgfVxuICBpZiAoIWZpbHRlcl9maWVsZHMpIHtcbiAgICBmaWx0ZXJfZmllbGRzID0gW107XG4gIH1cbiAgaWYgKGZpbHRlcl9maWVsZHMgIT0gbnVsbCA/IGZpbHRlcl9maWVsZHMubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgZmlsdGVyX2ZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uKG4pIHtcbiAgICAgIGlmIChfLmlzU3RyaW5nKG4pKSB7XG4gICAgICAgIG4gPSB7XG4gICAgICAgICAgZmllbGQ6IG4sXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoZmllbGRzW24uZmllbGRdICYmICFfLmZpbmRXaGVyZShmaWx0ZXJzLCB7XG4gICAgICAgIGZpZWxkOiBuLmZpZWxkXG4gICAgICB9KSkge1xuICAgICAgICByZXR1cm4gZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICBmaWVsZDogbi5maWVsZCxcbiAgICAgICAgICBpc19kZWZhdWx0OiB0cnVlLFxuICAgICAgICAgIGlzX3JlcXVpcmVkOiBuLnJlcXVpcmVkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbihmaWx0ZXJJdGVtKSB7XG4gICAgdmFyIG1hdGNoRmllbGQ7XG4gICAgbWF0Y2hGaWVsZCA9IGZpbHRlcl9maWVsZHMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbiA9PT0gZmlsdGVySXRlbS5maWVsZCB8fCBuLmZpZWxkID09PSBmaWx0ZXJJdGVtLmZpZWxkO1xuICAgIH0pO1xuICAgIGlmIChfLmlzU3RyaW5nKG1hdGNoRmllbGQpKSB7XG4gICAgICBtYXRjaEZpZWxkID0ge1xuICAgICAgICBmaWVsZDogbWF0Y2hGaWVsZCxcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAobWF0Y2hGaWVsZCkge1xuICAgICAgZmlsdGVySXRlbS5pc19kZWZhdWx0ID0gdHJ1ZTtcbiAgICAgIHJldHVybiBmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkID0gbWF0Y2hGaWVsZC5yZXF1aXJlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGZpbHRlckl0ZW0uaXNfZGVmYXVsdDtcbiAgICAgIHJldHVybiBkZWxldGUgZmlsdGVySXRlbS5pc19yZXF1aXJlZDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmlsdGVycztcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKSB7XG4gIHZhciBjb2xsZWN0aW9uLCByZWNvcmQsIHJlZiwgcmVmMSwgcmVmMjtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAoIXJlY29yZF9pZCkge1xuICAgIHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikgJiYgcmVjb3JkX2lkID09PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSkge1xuICAgICAgaWYgKChyZWYgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpKSAhPSBudWxsID8gcmVmLnJlY29yZCA6IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gKHJlZjEgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLnJlY29yZCkgIT0gbnVsbCA/IHJlZjIuZ2V0KCkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpO1xuICAgIH1cbiAgfVxuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKTtcbiAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICByZWNvcmQgPSBjb2xsZWN0aW9uLmZpbmRPbmUocmVjb3JkX2lkKTtcbiAgICByZXR1cm4gcmVjb3JkO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZE5hbWUgPSBmdW5jdGlvbihyZWNvcmQsIG9iamVjdF9uYW1lKSB7XG4gIHZhciBuYW1lX2ZpZWxkX2tleSwgcmVmO1xuICBpZiAoIXJlY29yZCkge1xuICAgIHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKCk7XG4gIH1cbiAgaWYgKHJlY29yZCkge1xuICAgIG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0X25hbWUgPT09IFwib3JnYW5pemF0aW9uc1wiID8gXCJuYW1lXCIgOiAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLk5BTUVfRklFTERfS0VZIDogdm9pZCAwO1xuICAgIGlmIChyZWNvcmQgJiYgbmFtZV9maWVsZF9rZXkpIHtcbiAgICAgIHJldHVybiByZWNvcmQubGFiZWwgfHwgcmVjb3JkW25hbWVfZmllbGRfa2V5XTtcbiAgICB9XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QXBwID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIHJlZiwgcmVmMTtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBhcHAgPSBDcmVhdG9yLkFwcHNbYXBwX2lkXTtcbiAgaWYgKChyZWYgPSBDcmVhdG9yLmRlcHMpICE9IG51bGwpIHtcbiAgICBpZiAoKHJlZjEgPSByZWYuYXBwKSAhPSBudWxsKSB7XG4gICAgICByZWYxLmRlcGVuZCgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXBwO1xufTtcblxuQ3JlYXRvci5nZXRBcHBEYXNoYm9hcmQgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgdmFyIGFwcCwgZGFzaGJvYXJkO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCkge1xuICAgIHJldHVybjtcbiAgfVxuICBkYXNoYm9hcmQgPSBudWxsO1xuICBfLmVhY2goQ3JlYXRvci5EYXNoYm9hcmRzLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB2LmFwcHMpICE9IG51bGwgPyByZWYuaW5kZXhPZihhcHAuX2lkKSA6IHZvaWQgMCkgPiAtMSkge1xuICAgICAgcmV0dXJuIGRhc2hib2FyZCA9IHY7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGRhc2hib2FyZDtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkQ29tcG9uZW50ID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHA7XG4gIGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZCk7XG4gIGlmICghYXBwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJldHVybiBSZWFjdFN0ZWVkb3MucGx1Z2luQ29tcG9uZW50U2VsZWN0b3IoUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCksIFwiRGFzaGJvYXJkXCIsIGFwcC5faWQpO1xufTtcblxuQ3JlYXRvci5nZXRBcHBPYmplY3ROYW1lcyA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwLCBhcHBPYmplY3RzLCBpc01vYmlsZSwgb2JqZWN0cztcbiAgYXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKTtcbiAgaWYgKCFhcHApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKCk7XG4gIGFwcE9iamVjdHMgPSBpc01vYmlsZSA/IGFwcC5tb2JpbGVfb2JqZWN0cyA6IGFwcC5vYmplY3RzO1xuICBvYmplY3RzID0gW107XG4gIGlmIChhcHApIHtcbiAgICBfLmVhY2goYXBwT2JqZWN0cywgZnVuY3Rpb24odikge1xuICAgICAgdmFyIG9iajtcbiAgICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KHYpO1xuICAgICAgaWYgKG9iaiAhPSBudWxsID8gb2JqLnBlcm1pc3Npb25zLmdldCgpLmFsbG93UmVhZCA6IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0cy5wdXNoKHYpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3RzO1xufTtcblxuQ3JlYXRvci5nZXRBcHBNZW51ID0gZnVuY3Rpb24oYXBwX2lkLCBtZW51X2lkKSB7XG4gIHZhciBtZW51cztcbiAgbWVudXMgPSBDcmVhdG9yLmdldEFwcE1lbnVzKGFwcF9pZCk7XG4gIHJldHVybiBtZW51cyAmJiBtZW51cy5maW5kKGZ1bmN0aW9uKG1lbnUpIHtcbiAgICByZXR1cm4gbWVudS5pZCA9PT0gbWVudV9pZDtcbiAgfSk7XG59O1xuXG5DcmVhdG9yLmdldEFwcE1lbnVVcmxGb3JJbnRlcm5ldCA9IGZ1bmN0aW9uKG1lbnUpIHtcbiAgdmFyIGhhc1F1ZXJ5U3ltYm9sLCBsaW5rU3RyLCBwYXJhbXMsIHNkaywgdXJsO1xuICBwYXJhbXMgPSB7fTtcbiAgcGFyYW1zW1wiWC1TcGFjZS1JZFwiXSA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICBwYXJhbXNbXCJYLVVzZXItSWRcIl0gPSBTdGVlZG9zLnVzZXJJZCgpO1xuICBwYXJhbXNbXCJYLUNvbXBhbnktSWRzXCJdID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpO1xuICBzZGsgPSByZXF1aXJlKFwiQHN0ZWVkb3MtdWkvYnVpbGRlci1jb21tdW5pdHkvZGlzdC9idWlsZGVyLWNvbW11bml0eS5yZWFjdC5qc1wiKTtcbiAgdXJsID0gbWVudS5wYXRoO1xuICBpZiAoc2RrICYmIHNkay5VdGlscyAmJiBzZGsuVXRpbHMuaXNFeHByZXNzaW9uKHVybCkpIHtcbiAgICB1cmwgPSBzZGsuVXRpbHMucGFyc2VTaW5nbGVFeHByZXNzaW9uKHVybCwgbWVudSwgXCIjXCIsIENyZWF0b3IuVVNFUl9DT05URVhUKTtcbiAgfVxuICBoYXNRdWVyeVN5bWJvbCA9IC8oXFwjLitcXD8pfChcXD9bXiNdKiQpL2cudGVzdCh1cmwpO1xuICBsaW5rU3RyID0gaGFzUXVlcnlTeW1ib2wgPyBcIiZcIiA6IFwiP1wiO1xuICByZXR1cm4gXCJcIiArIHVybCArIGxpbmtTdHIgKyAoJC5wYXJhbShwYXJhbXMpKTtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwTWVudVVybCA9IGZ1bmN0aW9uKG1lbnUpIHtcbiAgdmFyIHVybDtcbiAgdXJsID0gbWVudS5wYXRoO1xuICBpZiAobWVudS50eXBlID09PSBcInVybFwiKSB7XG4gICAgaWYgKG1lbnUudGFyZ2V0KSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRBcHBNZW51VXJsRm9ySW50ZXJuZXQobWVudSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIi9hcHAvLS90YWJfaWZyYW1lL1wiICsgbWVudS5pZDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG1lbnUucGF0aDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRBcHBNZW51cyA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwLCBhcHBNZW51cywgY3VyZW50QXBwTWVudXM7XG4gIGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZCk7XG4gIGlmICghYXBwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGFwcE1lbnVzID0gU2Vzc2lvbi5nZXQoXCJhcHBfbWVudXNcIik7XG4gIGlmICghYXBwTWVudXMpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgY3VyZW50QXBwTWVudXMgPSBhcHBNZW51cy5maW5kKGZ1bmN0aW9uKG1lbnVJdGVtKSB7XG4gICAgcmV0dXJuIG1lbnVJdGVtLmlkID09PSBhcHAuX2lkO1xuICB9KTtcbiAgaWYgKGN1cmVudEFwcE1lbnVzKSB7XG4gICAgcmV0dXJuIGN1cmVudEFwcE1lbnVzLmNoaWxkcmVuO1xuICB9XG59O1xuXG5DcmVhdG9yLmxvYWRBcHBzTWVudXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRhdGEsIGlzTW9iaWxlLCBvcHRpb25zO1xuICBpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKTtcbiAgZGF0YSA9IHt9O1xuICBpZiAoaXNNb2JpbGUpIHtcbiAgICBkYXRhLm1vYmlsZSA9IGlzTW9iaWxlO1xuICB9XG4gIG9wdGlvbnMgPSB7XG4gICAgdHlwZTogJ2dldCcsXG4gICAgZGF0YTogZGF0YSxcbiAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gU2Vzc2lvbi5zZXQoXCJhcHBfbWVudXNcIiwgZGF0YSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gU3RlZWRvcy5hdXRoUmVxdWVzdChcIi9zZXJ2aWNlL2FwaS9hcHBzL21lbnVzXCIsIG9wdGlvbnMpO1xufTtcblxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwcyA9IGZ1bmN0aW9uKGluY2x1ZGVBZG1pbikge1xuICB2YXIgY2hhbmdlQXBwO1xuICBjaGFuZ2VBcHAgPSBDcmVhdG9yLl9zdWJBcHAuZ2V0KCk7XG4gIFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLmVudGl0aWVzLmFwcHMgPSBPYmplY3QuYXNzaWduKHt9LCBSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKS5lbnRpdGllcy5hcHBzLCB7XG4gICAgYXBwczogY2hhbmdlQXBwXG4gIH0pO1xuICByZXR1cm4gUmVhY3RTdGVlZG9zLnZpc2libGVBcHBzU2VsZWN0b3IoUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCksIGluY2x1ZGVBZG1pbik7XG59O1xuXG5DcmVhdG9yLmdldFZpc2libGVBcHBzT2JqZWN0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXBwcywgb2JqZWN0cywgdmlzaWJsZU9iamVjdE5hbWVzO1xuICBhcHBzID0gQ3JlYXRvci5nZXRWaXNpYmxlQXBwcygpO1xuICB2aXNpYmxlT2JqZWN0TmFtZXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhhcHBzLCAnb2JqZWN0cycpKTtcbiAgb2JqZWN0cyA9IF8uZmlsdGVyKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKHZpc2libGVPYmplY3ROYW1lcy5pbmRleE9mKG9iai5uYW1lKSA8IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgb2JqZWN0cyA9IG9iamVjdHMuc29ydChDcmVhdG9yLnNvcnRpbmdNZXRob2QuYmluZCh7XG4gICAga2V5OiBcImxhYmVsXCJcbiAgfSkpO1xuICBvYmplY3RzID0gXy5wbHVjayhvYmplY3RzLCAnbmFtZScpO1xuICByZXR1cm4gXy51bmlxKG9iamVjdHMpO1xufTtcblxuQ3JlYXRvci5nZXRBcHBzT2JqZWN0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgb2JqZWN0cywgdGVtcE9iamVjdHM7XG4gIG9iamVjdHMgPSBbXTtcbiAgdGVtcE9iamVjdHMgPSBbXTtcbiAgXy5mb3JFYWNoKENyZWF0b3IuQXBwcywgZnVuY3Rpb24oYXBwKSB7XG4gICAgdGVtcE9iamVjdHMgPSBfLmZpbHRlcihhcHAub2JqZWN0cywgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gIW9iai5oaWRkZW47XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iamVjdHMgPSBvYmplY3RzLmNvbmNhdCh0ZW1wT2JqZWN0cyk7XG4gIH0pO1xuICByZXR1cm4gXy51bmlxKG9iamVjdHMpO1xufTtcblxuQ3JlYXRvci52YWxpZGF0ZUZpbHRlcnMgPSBmdW5jdGlvbihmaWx0ZXJzLCBsb2dpYykge1xuICB2YXIgZSwgZXJyb3JNc2csIGZpbHRlcl9pdGVtcywgZmlsdGVyX2xlbmd0aCwgZmxhZywgaW5kZXgsIHdvcmQ7XG4gIGZpbHRlcl9pdGVtcyA9IF8ubWFwKGZpbHRlcnMsIGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChfLmlzRW1wdHkob2JqKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgfSk7XG4gIGZpbHRlcl9pdGVtcyA9IF8uY29tcGFjdChmaWx0ZXJfaXRlbXMpO1xuICBlcnJvck1zZyA9IFwiXCI7XG4gIGZpbHRlcl9sZW5ndGggPSBmaWx0ZXJfaXRlbXMubGVuZ3RoO1xuICBpZiAobG9naWMpIHtcbiAgICBsb2dpYyA9IGxvZ2ljLnJlcGxhY2UoL1xcbi9nLCBcIlwiKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgICBpZiAoL1suX1xcLSErXSsvaWcudGVzdChsb2dpYykpIHtcbiAgICAgIGVycm9yTXNnID0gXCLlkKvmnInnibnmrorlrZfnrKbjgIJcIjtcbiAgICB9XG4gICAgaWYgKCFlcnJvck1zZykge1xuICAgICAgaW5kZXggPSBsb2dpYy5tYXRjaCgvXFxkKy9pZyk7XG4gICAgICBpZiAoIWluZGV4KSB7XG4gICAgICAgIGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZGV4LmZvckVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgIGlmIChpIDwgMSB8fCBpID4gZmlsdGVyX2xlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInmnaHku7blvJXnlKjkuobmnKrlrprkuYnnmoTnrZvpgInlmajvvJpcIiArIGkgKyBcIuOAglwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZsYWcgPSAxO1xuICAgICAgICB3aGlsZSAoZmxhZyA8PSBmaWx0ZXJfbGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFpbmRleC5pbmNsdWRlcyhcIlwiICsgZmxhZykpIHtcbiAgICAgICAgICAgIGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmxhZysrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIHdvcmQgPSBsb2dpYy5tYXRjaCgvW2EtekEtWl0rL2lnKTtcbiAgICAgIGlmICh3b3JkKSB7XG4gICAgICAgIHdvcmQuZm9yRWFjaChmdW5jdGlvbih3KSB7XG4gICAgICAgICAgaWYgKCEvXihhbmR8b3IpJC9pZy50ZXN0KHcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JNc2cgPSBcIuajgOafpeaCqOeahOmrmOe6p+etm+mAieadoeS7tuS4reeahOaLvOWGmeOAglwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIENyZWF0b3JbXCJldmFsXCJdKGxvZ2ljLnJlcGxhY2UoL2FuZC9pZywgXCImJlwiKS5yZXBsYWNlKC9vci9pZywgXCJ8fFwiKSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajkuK3lkKvmnInnibnmrorlrZfnrKZcIjtcbiAgICAgIH1cbiAgICAgIGlmICgvKEFORClbXigpXSsoT1IpL2lnLnRlc3QobG9naWMpIHx8IC8oT1IpW14oKV0rKEFORCkvaWcudGVzdChsb2dpYykpIHtcbiAgICAgICAgZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOW/hemhu+WcqOi/nue7reaAp+eahCBBTkQg5ZKMIE9SIOihqOi+vuW8j+WJjeWQjuS9v+eUqOaLrOWPt+OAglwiO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoZXJyb3JNc2cpIHtcbiAgICBjb25zb2xlLmxvZyhcImVycm9yXCIsIGVycm9yTXNnKTtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB0b2FzdHIuZXJyb3IoZXJyb3JNc2cpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cblxuLypcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9Nb25nbyA9IGZ1bmN0aW9uKGZpbHRlcnMsIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGVjdG9yO1xuICBpZiAoIShmaWx0ZXJzICE9IG51bGwgPyBmaWx0ZXJzLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCEoZmlsdGVyc1swXSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgIGZpbHRlcnMgPSBfLm1hcChmaWx0ZXJzLCBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBbb2JqLmZpZWxkLCBvYmoub3BlcmF0aW9uLCBvYmoudmFsdWVdO1xuICAgIH0pO1xuICB9XG4gIHNlbGVjdG9yID0gW107XG4gIF8uZWFjaChmaWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICB2YXIgZmllbGQsIG9wdGlvbiwgcmVnLCBzdWJfc2VsZWN0b3IsIHZhbHVlO1xuICAgIGZpZWxkID0gZmlsdGVyWzBdO1xuICAgIG9wdGlvbiA9IGZpbHRlclsxXTtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBudWxsLCBvcHRpb25zKTtcbiAgICB9XG4gICAgc3ViX3NlbGVjdG9yID0ge307XG4gICAgc3ViX3NlbGVjdG9yW2ZpZWxkXSA9IHt9O1xuICAgIGlmIChvcHRpb24gPT09IFwiPVwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGVxXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD5cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRuZVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIj5cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndFwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIj49XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RlXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPFwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGx0XCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD1cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdGVcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJzdGFydHN3aXRoXCIpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeXCIgKyB2YWx1ZSwgXCJpXCIpO1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJjb250YWluc1wiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKHZhbHVlLCBcImlcIik7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIm5vdGNvbnRhaW5zXCIpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeKCg/IVwiICsgdmFsdWUgKyBcIikuKSokXCIsIFwiaVwiKTtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWc7XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3Rvci5wdXNoKHN1Yl9zZWxlY3Rvcik7XG4gIH0pO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5DcmVhdG9yLmlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiA9IGZ1bmN0aW9uKG9wZXJhdGlvbikge1xuICB2YXIgcmVmO1xuICByZXR1cm4gb3BlcmF0aW9uID09PSBcImJldHdlZW5cIiB8fCAhISgocmVmID0gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXModHJ1ZSkpICE9IG51bGwgPyByZWZbb3BlcmF0aW9uXSA6IHZvaWQgMCk7XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuXHRleHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9EZXYgPSBmdW5jdGlvbihmaWx0ZXJzLCBvYmplY3RfbmFtZSwgb3B0aW9ucykge1xuICB2YXIgbG9naWNUZW1wRmlsdGVycywgc2VsZWN0b3IsIHN0ZWVkb3NGaWx0ZXJzO1xuICBzdGVlZG9zRmlsdGVycyA9IHJlcXVpcmUoXCJAc3RlZWRvcy9maWx0ZXJzXCIpO1xuICBpZiAoIWZpbHRlcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLmlzX2xvZ2ljX29yIDogdm9pZCAwKSB7XG4gICAgbG9naWNUZW1wRmlsdGVycyA9IFtdO1xuICAgIGZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbihuKSB7XG4gICAgICBsb2dpY1RlbXBGaWx0ZXJzLnB1c2gobik7XG4gICAgICByZXR1cm4gbG9naWNUZW1wRmlsdGVycy5wdXNoKFwib3JcIik7XG4gICAgfSk7XG4gICAgbG9naWNUZW1wRmlsdGVycy5wb3AoKTtcbiAgICBmaWx0ZXJzID0gbG9naWNUZW1wRmlsdGVycztcbiAgfVxuICBzZWxlY3RvciA9IHN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb0RldihmaWx0ZXJzLCBDcmVhdG9yLlVTRVJfQ09OVEVYVCk7XG4gIHJldHVybiBzZWxlY3Rvcjtcbn07XG5cblxuLypcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRMb2dpY0ZpbHRlcnNUb0RldiA9IGZ1bmN0aW9uKGZpbHRlcnMsIGZpbHRlcl9sb2dpYywgb3B0aW9ucykge1xuICB2YXIgZm9ybWF0X2xvZ2ljO1xuICBmb3JtYXRfbG9naWMgPSBmaWx0ZXJfbG9naWMucmVwbGFjZSgvXFwoXFxzKy9pZywgXCIoXCIpLnJlcGxhY2UoL1xccytcXCkvaWcsIFwiKVwiKS5yZXBsYWNlKC9cXCgvZywgXCJbXCIpLnJlcGxhY2UoL1xcKS9nLCBcIl1cIikucmVwbGFjZSgvXFxzKy9nLCBcIixcIikucmVwbGFjZSgvKGFuZHxvcikvaWcsIFwiJyQxJ1wiKTtcbiAgZm9ybWF0X2xvZ2ljID0gZm9ybWF0X2xvZ2ljLnJlcGxhY2UoLyhcXGQpKy9pZywgZnVuY3Rpb24oeCkge1xuICAgIHZhciBfZiwgZmllbGQsIG9wdGlvbiwgc3ViX3NlbGVjdG9yLCB2YWx1ZTtcbiAgICBfZiA9IGZpbHRlcnNbeCAtIDFdO1xuICAgIGZpZWxkID0gX2YuZmllbGQ7XG4gICAgb3B0aW9uID0gX2Yub3BlcmF0aW9uO1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlLCBudWxsLCBvcHRpb25zKTtcbiAgICB9XG4gICAgc3ViX3NlbGVjdG9yID0gW107XG4gICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkgPT09IHRydWUpIHtcbiAgICAgIGlmIChvcHRpb24gPT09IFwiPVwiKSB7XG4gICAgICAgIF8uZWFjaCh2YWx1ZSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBzdWJfc2VsZWN0b3IucHVzaChbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD5cIikge1xuICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4gc3ViX3NlbGVjdG9yLnB1c2goW2ZpZWxkLCBvcHRpb24sIHZdLCBcImFuZFwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4gc3ViX3NlbGVjdG9yLnB1c2goW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09PSBcImFuZFwiIHx8IHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT09IFwib3JcIikge1xuICAgICAgICBzdWJfc2VsZWN0b3IucG9wKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Yl9zZWxlY3RvciA9IFtmaWVsZCwgb3B0aW9uLCB2YWx1ZV07XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwic3ViX3NlbGVjdG9yXCIsIHN1Yl9zZWxlY3Rvcik7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN1Yl9zZWxlY3Rvcik7XG4gIH0pO1xuICBmb3JtYXRfbG9naWMgPSBcIltcIiArIGZvcm1hdF9sb2dpYyArIFwiXVwiO1xuICByZXR1cm4gQ3JlYXRvcltcImV2YWxcIl0oZm9ybWF0X2xvZ2ljKTtcbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBfb2JqZWN0LCBwZXJtaXNzaW9ucywgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHJlbGF0ZWRfb2JqZWN0cywgdW5yZWxhdGVkX29iamVjdHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBbXTtcbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFfb2JqZWN0KSB7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICB9XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoX29iamVjdC5fY29sbGVjdGlvbl9uYW1lKTtcbiAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cywgXCJvYmplY3RfbmFtZVwiKTtcbiAgaWYgKChyZWxhdGVkX29iamVjdF9uYW1lcyAhPSBudWxsID8gcmVsYXRlZF9vYmplY3RfbmFtZXMubGVuZ3RoIDogdm9pZCAwKSA9PT0gMCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgfVxuICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlKHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0cyk7XG4gIHJldHVybiBfLmZpbHRlcihyZWxhdGVkX29iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0KSB7XG4gICAgdmFyIGFsbG93UmVhZCwgaXNBY3RpdmUsIHJlZiwgcmVsYXRlZF9vYmplY3RfbmFtZTtcbiAgICByZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3Qub2JqZWN0X25hbWU7XG4gICAgaXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTE7XG4gICAgYWxsb3dSZWFkID0gKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5hbGxvd1JlYWQgOiB2b2lkIDA7XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIGFsbG93UmVhZCA9IGFsbG93UmVhZCAmJiBwZXJtaXNzaW9ucy5hbGxvd1JlYWRGaWxlcztcbiAgICB9XG4gICAgcmV0dXJuIGlzQWN0aXZlICYmIGFsbG93UmVhZDtcbiAgfSk7XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3ROYW1lcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIHJlbGF0ZWRfb2JqZWN0cztcbiAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgcmV0dXJuIF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLCBcIm9iamVjdF9uYW1lXCIpO1xufTtcblxuQ3JlYXRvci5nZXRBY3Rpb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgYWN0aW9ucywgZGlzYWJsZWRfYWN0aW9ucywgb2JqLCBwZXJtaXNzaW9ucywgcmVmLCByZWYxO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICBkaXNhYmxlZF9hY3Rpb25zID0gcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucztcbiAgYWN0aW9ucyA9IF8uc29ydEJ5KF8udmFsdWVzKG9iai5hY3Rpb25zKSwgJ3NvcnQnKTtcbiAgaWYgKF8uaGFzKG9iaiwgJ2FsbG93X2N1c3RvbUFjdGlvbnMnKSkge1xuICAgIGFjdGlvbnMgPSBfLmZpbHRlcihhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICAgIHJldHVybiBfLmluY2x1ZGUob2JqLmFsbG93X2N1c3RvbUFjdGlvbnMsIGFjdGlvbi5uYW1lKSB8fCBfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuZ2V0T2JqZWN0KCdiYXNlJykuYWN0aW9ucykgfHwge30sIGFjdGlvbi5uYW1lKTtcbiAgICB9KTtcbiAgfVxuICBpZiAoXy5oYXMob2JqLCAnZXhjbHVkZV9hY3Rpb25zJykpIHtcbiAgICBhY3Rpb25zID0gXy5maWx0ZXIoYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgICByZXR1cm4gIV8uaW5jbHVkZShvYmouZXhjbHVkZV9hY3Rpb25zLCBhY3Rpb24ubmFtZSk7XG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgJiYgW1wicmVjb3JkXCIsIFwicmVjb3JkX29ubHlcIl0uaW5kZXhPZihhY3Rpb24ub24pID4gLTEgJiYgYWN0aW9uLm5hbWUgIT09ICdzdGFuZGFyZF9lZGl0Jykge1xuICAgICAgaWYgKGFjdGlvbi5vbiA9PT0gXCJyZWNvcmRfb25seVwiKSB7XG4gICAgICAgIHJldHVybiBhY3Rpb24ub24gPSAncmVjb3JkX29ubHlfbW9yZSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYWN0aW9uLm9uID0gJ3JlY29yZF9tb3JlJztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcImNtc19maWxlc1wiLCBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJdLmluZGV4T2Yob2JqZWN0X25hbWUpID4gLTEpIHtcbiAgICBpZiAoKHJlZiA9IGFjdGlvbnMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5uYW1lID09PSBcInN0YW5kYXJkX2VkaXRcIjtcbiAgICB9KSkgIT0gbnVsbCkge1xuICAgICAgcmVmLm9uID0gXCJyZWNvcmRfbW9yZVwiO1xuICAgIH1cbiAgICBpZiAoKHJlZjEgPSBhY3Rpb25zLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4ubmFtZSA9PT0gXCJkb3dubG9hZFwiO1xuICAgIH0pKSAhPSBudWxsKSB7XG4gICAgICByZWYxLm9uID0gXCJyZWNvcmRcIjtcbiAgICB9XG4gIH1cbiAgYWN0aW9ucyA9IF8uZmlsdGVyKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIHJldHVybiBfLmluZGV4T2YoZGlzYWJsZWRfYWN0aW9ucywgYWN0aW9uLm5hbWUpIDwgMDtcbiAgfSk7XG4gIHJldHVybiBhY3Rpb25zO1xufTtcblxuL+i/lOWbnuW9k+WJjeeUqOaIt+acieadg+mZkOiuv+mXrueahOaJgOaciWxpc3Rfdmlld++8jOWMheaLrOWIhuS6q+eahO+8jOeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahO+8iOmZpOmdnm93bmVy5Y+Y5LqG77yJ77yM5Lul5Y+K6buY6K6k55qE5YW25LuW6KeG5Zu+5rOo5oSPQ3JlYXRvci5nZXRQZXJtaXNzaW9uc+WHveaVsOS4reaYr+S4jeS8muacieeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahOinhuWbvueahO+8jOaJgOS7pUNyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mi7/liLDnmoTnu5PmnpzkuI3lhajvvIzlubbkuI3mmK/lvZPliY3nlKjmiLfog73nnIvliLDmiYDmnInop4blm74vO1xuXG5DcmVhdG9yLmdldExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGRpc2FibGVkX2xpc3Rfdmlld3MsIGlzTW9iaWxlLCBsaXN0Vmlld3MsIGxpc3Rfdmlld3MsIG9iamVjdCwgcmVmO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBkaXNhYmxlZF9saXN0X3ZpZXdzID0gKChyZWYgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKSAhPSBudWxsID8gcmVmLmRpc2FibGVkX2xpc3Rfdmlld3MgOiB2b2lkIDApIHx8IFtdO1xuICBsaXN0X3ZpZXdzID0gW107XG4gIGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpO1xuICBfLmVhY2gob2JqZWN0Lmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHJldHVybiBpdGVtLm5hbWUgPSBpdGVtX25hbWU7XG4gIH0pO1xuICBsaXN0Vmlld3MgPSBfLnNvcnRCeShfLnZhbHVlcyhvYmplY3QubGlzdF92aWV3cyksICdzb3J0X25vJyk7XG4gIF8uZWFjaChsaXN0Vmlld3MsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgaXNEaXNhYmxlZDtcbiAgICBpZiAoaXNNb2JpbGUgJiYgaXRlbS50eXBlID09PSBcImNhbGVuZGFyXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGl0ZW0ubmFtZSAhPT0gXCJkZWZhdWx0XCIpIHtcbiAgICAgIGlzRGlzYWJsZWQgPSBfLmluZGV4T2YoZGlzYWJsZWRfbGlzdF92aWV3cywgaXRlbS5uYW1lKSA+IC0xIHx8IChpdGVtLl9pZCAmJiBfLmluZGV4T2YoZGlzYWJsZWRfbGlzdF92aWV3cywgaXRlbS5faWQpID4gLTEpO1xuICAgICAgaWYgKCFpc0Rpc2FibGVkIHx8IGl0ZW0ub3duZXIgPT09IHVzZXJJZCkge1xuICAgICAgICByZXR1cm4gbGlzdF92aWV3cy5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBsaXN0X3ZpZXdzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBmaWVsZHNOYW1lLCByZWYsIHVucmVhZGFibGVfZmllbGRzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIGZpZWxkc05hbWUgPSBDcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUob2JqZWN0X25hbWUpO1xuICB1bnJlYWRhYmxlX2ZpZWxkcyA9IChyZWYgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKSAhPSBudWxsID8gcmVmLnVucmVhZGFibGVfZmllbGRzIDogdm9pZCAwO1xuICByZXR1cm4gXy5kaWZmZXJlbmNlKGZpZWxkc05hbWUsIHVucmVhZGFibGVfZmllbGRzKTtcbn07XG5cbkNyZWF0b3IuaXNsb2FkaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhQ3JlYXRvci5ib290c3RyYXBMb2FkZWQuZ2V0KCk7XG59O1xuXG5DcmVhdG9yLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIik7XG59O1xuXG5DcmVhdG9yLmdldERpc2FibGVkRmllbGRzID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBmaWVsZHM7XG4gIGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQsIGZpZWxkTmFtZSkge1xuICAgIHJldHVybiBmaWVsZC5hdXRvZm9ybSAmJiBmaWVsZC5hdXRvZm9ybS5kaXNhYmxlZCAmJiAhZmllbGQuYXV0b2Zvcm0ub21pdCAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0SGlkZGVuRmllbGRzID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBmaWVsZHM7XG4gIGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQsIGZpZWxkTmFtZSkge1xuICAgIHJldHVybiBmaWVsZC5hdXRvZm9ybSAmJiBmaWVsZC5hdXRvZm9ybS50eXBlID09PSBcImhpZGRlblwiICYmICFmaWVsZC5hdXRvZm9ybS5vbWl0ICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNXaXRoTm9Hcm91cCA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gKCFmaWVsZC5hdXRvZm9ybSB8fCAhZmllbGQuYXV0b2Zvcm0uZ3JvdXAgfHwgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT09IFwiLVwiKSAmJiAoIWZpZWxkLmF1dG9mb3JtIHx8IGZpZWxkLmF1dG9mb3JtLnR5cGUgIT09IFwiaGlkZGVuXCIpICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRTb3J0ZWRGaWVsZEdyb3VwTmFtZXMgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIG5hbWVzO1xuICBuYW1lcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgIT09IFwiLVwiICYmIGZpZWxkLmF1dG9mb3JtLmdyb3VwO1xuICB9KTtcbiAgbmFtZXMgPSBfLmNvbXBhY3QobmFtZXMpO1xuICBuYW1lcyA9IF8udW5pcXVlKG5hbWVzKTtcbiAgcmV0dXJuIG5hbWVzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNGb3JHcm91cCA9IGZ1bmN0aW9uKHNjaGVtYSwgZ3JvdXBOYW1lKSB7XG4gIHZhciBmaWVsZHM7XG4gIGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQsIGZpZWxkTmFtZSkge1xuICAgIHJldHVybiBmaWVsZC5hdXRvZm9ybSAmJiBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PT0gZ3JvdXBOYW1lICYmIGZpZWxkLmF1dG9mb3JtLnR5cGUgIT09IFwiaGlkZGVuXCIgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRPbWl0ID0gZnVuY3Rpb24oc2NoZW1hLCBrZXlzKSB7XG4gIGtleXMgPSBfLm1hcChrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgZmllbGQsIHJlZjtcbiAgICBmaWVsZCA9IF8ucGljayhzY2hlbWEsIGtleSk7XG4gICAgaWYgKChyZWYgPSBmaWVsZFtrZXldLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmLm9taXQgOiB2b2lkIDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gIH0pO1xuICBrZXlzID0gXy5jb21wYWN0KGtleXMpO1xuICByZXR1cm4ga2V5cztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzSW5GaXJzdExldmVsID0gZnVuY3Rpb24oZmlyc3RMZXZlbEtleXMsIGtleXMpIHtcbiAga2V5cyA9IF8ubWFwKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgIGlmIChfLmluZGV4T2YoZmlyc3RMZXZlbEtleXMsIGtleSkgPiAtMSkge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSk7XG4gIGtleXMgPSBfLmNvbXBhY3Qoa2V5cyk7XG4gIHJldHVybiBrZXlzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNGb3JSZW9yZGVyID0gZnVuY3Rpb24oc2NoZW1hLCBrZXlzLCBpc1NpbmdsZSkge1xuICB2YXIgX2tleXMsIGNoaWxkS2V5cywgZmllbGRzLCBpLCBpc193aWRlXzEsIGlzX3dpZGVfMiwgc2NfMSwgc2NfMjtcbiAgZmllbGRzID0gW107XG4gIGkgPSAwO1xuICBfa2V5cyA9IF8uZmlsdGVyKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiAha2V5LmVuZHNXaXRoKCdfZW5kTGluZScpO1xuICB9KTtcbiAgd2hpbGUgKGkgPCBfa2V5cy5sZW5ndGgpIHtcbiAgICBzY18xID0gXy5waWNrKHNjaGVtYSwgX2tleXNbaV0pO1xuICAgIHNjXzIgPSBfLnBpY2soc2NoZW1hLCBfa2V5c1tpICsgMV0pO1xuICAgIGlzX3dpZGVfMSA9IGZhbHNlO1xuICAgIGlzX3dpZGVfMiA9IGZhbHNlO1xuICAgIF8uZWFjaChzY18xLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIHJlZiwgcmVmMTtcbiAgICAgIGlmICgoKHJlZiA9IHZhbHVlLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmLmlzX3dpZGUgOiB2b2lkIDApIHx8ICgocmVmMSA9IHZhbHVlLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMS50eXBlIDogdm9pZCAwKSA9PT0gXCJ0YWJsZVwiKSB7XG4gICAgICAgIHJldHVybiBpc193aWRlXzEgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIF8uZWFjaChzY18yLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIHJlZiwgcmVmMTtcbiAgICAgIGlmICgoKHJlZiA9IHZhbHVlLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmLmlzX3dpZGUgOiB2b2lkIDApIHx8ICgocmVmMSA9IHZhbHVlLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMS50eXBlIDogdm9pZCAwKSA9PT0gXCJ0YWJsZVwiKSB7XG4gICAgICAgIHJldHVybiBpc193aWRlXzIgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgIGlzX3dpZGVfMSA9IHRydWU7XG4gICAgICBpc193aWRlXzIgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoaXNTaW5nbGUpIHtcbiAgICAgIGZpZWxkcy5wdXNoKF9rZXlzLnNsaWNlKGksIGkgKyAxKSk7XG4gICAgICBpICs9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc193aWRlXzEpIHtcbiAgICAgICAgZmllbGRzLnB1c2goX2tleXMuc2xpY2UoaSwgaSArIDEpKTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgfSBlbHNlIGlmICghaXNfd2lkZV8xICYmIGlzX3dpZGVfMikge1xuICAgICAgICBjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpICsgMSk7XG4gICAgICAgIGNoaWxkS2V5cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIGZpZWxkcy5wdXNoKGNoaWxkS2V5cyk7XG4gICAgICAgIGkgKz0gMTtcbiAgICAgIH0gZWxzZSBpZiAoIWlzX3dpZGVfMSAmJiAhaXNfd2lkZV8yKSB7XG4gICAgICAgIGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkgKyAxKTtcbiAgICAgICAgaWYgKF9rZXlzW2kgKyAxXSkge1xuICAgICAgICAgIGNoaWxkS2V5cy5wdXNoKF9rZXlzW2kgKyAxXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2hpbGRLZXlzLnB1c2godm9pZCAwKTtcbiAgICAgICAgfVxuICAgICAgICBmaWVsZHMucHVzaChjaGlsZEtleXMpO1xuICAgICAgICBpICs9IDI7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmlzRmlsdGVyVmFsdWVFbXB0eSA9IGZ1bmN0aW9uKHYpIHtcbiAgcmV0dXJuIHR5cGVvZiB2ID09PSBcInVuZGVmaW5lZFwiIHx8IHYgPT09IG51bGwgfHwgTnVtYmVyLmlzTmFOKHYpIHx8IHYubGVuZ3RoID09PSAwO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZERhdGFUeXBlID0gZnVuY3Rpb24ob2JqZWN0RmllbGRzLCBrZXkpIHtcbiAgdmFyIHJlZiwgcmVzdWx0O1xuICBpZiAob2JqZWN0RmllbGRzICYmIGtleSkge1xuICAgIHJlc3VsdCA9IChyZWYgPSBvYmplY3RGaWVsZHNba2V5XSkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwO1xuICAgIGlmIChbXCJmb3JtdWxhXCIsIFwic3VtbWFyeVwiXS5pbmRleE9mKHJlc3VsdCkgPiAtMSkge1xuICAgICAgcmVzdWx0ID0gb2JqZWN0RmllbGRzW2tleV0uZGF0YV90eXBlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBcInRleHRcIjtcbiAgfVxufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDcmVhdG9yLmdldEFsbFJlbGF0ZWRPYmplY3RzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgcmVsYXRlZF9vYmplY3RfbmFtZXM7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBbXTtcbiAgICBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgICAgcmV0dXJuIF8uZWFjaChyZWxhdGVkX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgICAgICBpZiAocmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PT0gb2JqZWN0X25hbWUpIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXMucHVzaChyZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKS5lbmFibGVfZmlsZXMpIHtcbiAgICAgIHJlbGF0ZWRfb2JqZWN0X25hbWVzLnB1c2goXCJjbXNfZmlsZXNcIik7XG4gICAgfVxuICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zLmZvcm1hdEluZGV4ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgaW5kZXhOYW1lLCBpc2RvY3VtZW50REIsIG9iamVjdCwgcmVmLCByZWYxLCByZWYyO1xuICAgIG9iamVjdCA9IHtcbiAgICAgIGJhY2tncm91bmQ6IHRydWVcbiAgICB9O1xuICAgIGlzZG9jdW1lbnREQiA9ICgocmVmID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjEgPSByZWYuZGF0YXNvdXJjZXMpICE9IG51bGwgPyAocmVmMiA9IHJlZjFbXCJkZWZhdWx0XCJdKSAhPSBudWxsID8gcmVmMi5kb2N1bWVudERCIDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwKSB8fCBmYWxzZTtcbiAgICBpZiAoaXNkb2N1bWVudERCKSB7XG4gICAgICBpZiAoYXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICBpbmRleE5hbWUgPSBhcnJheS5qb2luKFwiLlwiKTtcbiAgICAgICAgb2JqZWN0Lm5hbWUgPSBpbmRleE5hbWU7XG4gICAgICAgIGlmIChpbmRleE5hbWUubGVuZ3RoID4gNTIpIHtcbiAgICAgICAgICBvYmplY3QubmFtZSA9IGluZGV4TmFtZS5zdWJzdHJpbmcoMCwgNTIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG4iLCJDcmVhdG9yLmFwcHNCeU5hbWUgPSB7fVxuXG4iLCJNZXRlb3IubWV0aG9kc1xuXHRcIm9iamVjdF9yZWNlbnRfdmlld2VkXCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZV9pZCktPlxuXHRcdGlmICF0aGlzLnVzZXJJZFxuXHRcdFx0cmV0dXJuIG51bGxcblxuXHRcdGlmIG9iamVjdF9uYW1lID09IFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIlxuXHRcdFx0cmV0dXJuXG5cdFx0aWYgb2JqZWN0X25hbWUgYW5kIHJlY29yZF9pZFxuXHRcdFx0aWYgIXNwYWNlX2lkXG5cdFx0XHRcdGRvYyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZE9uZSh7X2lkOiByZWNvcmRfaWR9LCB7ZmllbGRzOiB7c3BhY2U6IDF9fSlcblx0XHRcdFx0c3BhY2VfaWQgPSBkb2M/LnNwYWNlXG5cblx0XHRcdGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9yZWNlbnRfdmlld2VkXCIpXG5cdFx0XHRmaWx0ZXJzID0geyBvd25lcjogdGhpcy51c2VySWQsIHNwYWNlOiBzcGFjZV9pZCwgJ3JlY29yZC5vJzogb2JqZWN0X25hbWUsICdyZWNvcmQuaWRzJzogW3JlY29yZF9pZF19XG5cdFx0XHRjdXJyZW50X3JlY2VudF92aWV3ZWQgPSBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuZmluZE9uZShmaWx0ZXJzKVxuXHRcdFx0aWYgY3VycmVudF9yZWNlbnRfdmlld2VkXG5cdFx0XHRcdGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC51cGRhdGUoXG5cdFx0XHRcdFx0Y3VycmVudF9yZWNlbnRfdmlld2VkLl9pZCxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHQkaW5jOiB7XG5cdFx0XHRcdFx0XHRcdGNvdW50OiAxXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0JHNldDoge1xuXHRcdFx0XHRcdFx0XHRtb2RpZmllZDogbmV3IERhdGUoKVxuXHRcdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogdGhpcy51c2VySWRcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdClcblx0XHRcdGVsc2Vcblx0XHRcdFx0Y29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLmluc2VydChcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRfaWQ6IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5fbWFrZU5ld0lEKClcblx0XHRcdFx0XHRcdG93bmVyOiB0aGlzLnVzZXJJZFxuXHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkXG5cdFx0XHRcdFx0XHRyZWNvcmQ6IHtvOiBvYmplY3RfbmFtZSwgaWRzOiBbcmVjb3JkX2lkXX1cblx0XHRcdFx0XHRcdGNvdW50OiAxXG5cdFx0XHRcdFx0XHRjcmVhdGVkOiBuZXcgRGF0ZSgpXG5cdFx0XHRcdFx0XHRjcmVhdGVkX2J5OiB0aGlzLnVzZXJJZFxuXHRcdFx0XHRcdFx0bW9kaWZpZWQ6IG5ldyBEYXRlKClcblx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KVxuXHRcdFx0cmV0dXJuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBcIm9iamVjdF9yZWNlbnRfdmlld2VkXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlX2lkKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZCwgY3VycmVudF9yZWNlbnRfdmlld2VkLCBkb2MsIGZpbHRlcnM7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChvYmplY3RfbmFtZSAmJiByZWNvcmRfaWQpIHtcbiAgICAgIGlmICghc3BhY2VfaWQpIHtcbiAgICAgICAgZG9jID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kT25lKHtcbiAgICAgICAgICBfaWQ6IHJlY29yZF9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBzcGFjZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHNwYWNlX2lkID0gZG9jICE9IG51bGwgPyBkb2Muc3BhY2UgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgICBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiKTtcbiAgICAgIGZpbHRlcnMgPSB7XG4gICAgICAgIG93bmVyOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAncmVjb3JkLm8nOiBvYmplY3RfbmFtZSxcbiAgICAgICAgJ3JlY29yZC5pZHMnOiBbcmVjb3JkX2lkXVxuICAgICAgfTtcbiAgICAgIGN1cnJlbnRfcmVjZW50X3ZpZXdlZCA9IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5maW5kT25lKGZpbHRlcnMpO1xuICAgICAgaWYgKGN1cnJlbnRfcmVjZW50X3ZpZXdlZCkge1xuICAgICAgICBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQudXBkYXRlKGN1cnJlbnRfcmVjZW50X3ZpZXdlZC5faWQsIHtcbiAgICAgICAgICAkaW5jOiB7XG4gICAgICAgICAgICBjb3VudDogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgbW9kaWZpZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBtb2RpZmllZF9ieTogdGhpcy51c2VySWRcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLmluc2VydCh7XG4gICAgICAgICAgX2lkOiBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuX21ha2VOZXdJRCgpLFxuICAgICAgICAgIG93bmVyOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgcmVjb3JkOiB7XG4gICAgICAgICAgICBvOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGlkczogW3JlY29yZF9pZF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvdW50OiAxLFxuICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgY3JlYXRlZF9ieTogdGhpcy51c2VySWQsXG4gICAgICAgICAgbW9kaWZpZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG4iLCJyZWNlbnRfYWdncmVnYXRlID0gKGNyZWF0ZWRfYnksIHNwYWNlSWQsIF9yZWNvcmRzLCBjYWxsYmFjayktPlxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9yZWNlbnRfdmlld2VkLnJhd0NvbGxlY3Rpb24oKS5hZ2dyZWdhdGUoW1xuXHRcdHskbWF0Y2g6IHtjcmVhdGVkX2J5OiBjcmVhdGVkX2J5LCBzcGFjZTogc3BhY2VJZH19LFxuXHRcdHskZ3JvdXA6IHtfaWQ6IHtvYmplY3RfbmFtZTogXCIkcmVjb3JkLm9cIiwgcmVjb3JkX2lkOiBcIiRyZWNvcmQuaWRzXCIsIHNwYWNlOiBcIiRzcGFjZVwifSwgbWF4Q3JlYXRlZDogeyRtYXg6IFwiJGNyZWF0ZWRcIn19fSxcblx0XHR7JHNvcnQ6IHttYXhDcmVhdGVkOiAtMX19LFxuXHRcdHskbGltaXQ6IDEwfVxuXHRdKS50b0FycmF5IChlcnIsIGRhdGEpLT5cblx0XHRpZiBlcnJcblx0XHRcdHRocm93IG5ldyBFcnJvcihlcnIpXG5cblx0XHRkYXRhLmZvckVhY2ggKGRvYykgLT5cblx0XHRcdF9yZWNvcmRzLnB1c2ggZG9jLl9pZFxuXG5cdFx0aWYgY2FsbGJhY2sgJiYgXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKVxuXHRcdFx0Y2FsbGJhY2soKVxuXG5cdFx0cmV0dXJuXG5cbmFzeW5jX3JlY2VudF9hZ2dyZWdhdGUgPSBNZXRlb3Iud3JhcEFzeW5jKHJlY2VudF9hZ2dyZWdhdGUpXG5cbnNlYXJjaF9vYmplY3QgPSAoc3BhY2UsIG9iamVjdF9uYW1lLHVzZXJJZCwgc2VhcmNoVGV4dCktPlxuXHRkYXRhID0gbmV3IEFycmF5KClcblxuXHRpZiBzZWFyY2hUZXh0XG5cblx0XHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0XHRfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpXG5cdFx0X29iamVjdF9uYW1lX2tleSA9IF9vYmplY3Q/Lk5BTUVfRklFTERfS0VZXG5cdFx0aWYgX29iamVjdCAmJiBfb2JqZWN0X2NvbGxlY3Rpb24gJiYgX29iamVjdF9uYW1lX2tleVxuXHRcdFx0cXVlcnkgPSB7fVxuXHRcdFx0c2VhcmNoX0tleXdvcmRzID0gc2VhcmNoVGV4dC5zcGxpdChcIiBcIilcblx0XHRcdHF1ZXJ5X2FuZCA9IFtdXG5cdFx0XHRzZWFyY2hfS2V5d29yZHMuZm9yRWFjaCAoa2V5d29yZCktPlxuXHRcdFx0XHRzdWJxdWVyeSA9IHt9XG5cdFx0XHRcdHN1YnF1ZXJ5W19vYmplY3RfbmFtZV9rZXldID0geyRyZWdleDoga2V5d29yZC50cmltKCl9XG5cdFx0XHRcdHF1ZXJ5X2FuZC5wdXNoIHN1YnF1ZXJ5XG5cblx0XHRcdHF1ZXJ5LiRhbmQgPSBxdWVyeV9hbmRcblx0XHRcdHF1ZXJ5LnNwYWNlID0geyRpbjogW3NwYWNlXX1cblxuXHRcdFx0ZmllbGRzID0ge19pZDogMX1cblx0XHRcdGZpZWxkc1tfb2JqZWN0X25hbWVfa2V5XSA9IDFcblxuXHRcdFx0cmVjb3JkcyA9IF9vYmplY3RfY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCB7ZmllbGRzOiBmaWVsZHMsIHNvcnQ6IHttb2RpZmllZDogMX0sIGxpbWl0OiA1fSlcblxuXHRcdFx0cmVjb3Jkcy5mb3JFYWNoIChyZWNvcmQpLT5cblx0XHRcdFx0ZGF0YS5wdXNoIHtfaWQ6IHJlY29yZC5faWQsIF9uYW1lOiByZWNvcmRbX29iamVjdF9uYW1lX2tleV0sIF9vYmplY3RfbmFtZTogb2JqZWN0X25hbWV9XG5cdFxuXHRyZXR1cm4gZGF0YVxuXG5NZXRlb3IubWV0aG9kc1xuXHQnb2JqZWN0X3JlY2VudF9yZWNvcmQnOiAoc3BhY2VJZCktPlxuXHRcdGRhdGEgPSBuZXcgQXJyYXkoKVxuXHRcdHJlY29yZHMgPSBuZXcgQXJyYXkoKVxuXHRcdGFzeW5jX3JlY2VudF9hZ2dyZWdhdGUodGhpcy51c2VySWQsIHNwYWNlSWQsIHJlY29yZHMpXG5cdFx0cmVjb3Jkcy5mb3JFYWNoIChpdGVtKS0+XG5cdFx0XHRyZWNvcmRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSlcblxuXHRcdFx0aWYgIXJlY29yZF9vYmplY3Rcblx0XHRcdFx0cmV0dXJuXG5cblx0XHRcdHJlY29yZF9vYmplY3RfY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihpdGVtLm9iamVjdF9uYW1lLCBpdGVtLnNwYWNlKVxuXG5cdFx0XHRpZiByZWNvcmRfb2JqZWN0ICYmIHJlY29yZF9vYmplY3RfY29sbGVjdGlvblxuXHRcdFx0XHRmaWVsZHMgPSB7X2lkOiAxfVxuXG5cdFx0XHRcdGZpZWxkc1tyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSA9IDFcblxuXHRcdFx0XHRyZWNvcmQgPSByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24uZmluZE9uZShpdGVtLnJlY29yZF9pZFswXSwge2ZpZWxkczogZmllbGRzfSlcblx0XHRcdFx0aWYgcmVjb3JkXG5cdFx0XHRcdFx0ZGF0YS5wdXNoIHtfaWQ6IHJlY29yZC5faWQsIF9uYW1lOiByZWNvcmRbcmVjb3JkX29iamVjdC5OQU1FX0ZJRUxEX0tFWV0sIF9vYmplY3RfbmFtZTogaXRlbS5vYmplY3RfbmFtZX1cblxuXHRcdHJldHVybiBkYXRhXG5cblx0J29iamVjdF9yZWNvcmRfc2VhcmNoJzogKG9wdGlvbnMpLT5cblx0XHRzZWxmID0gdGhpc1xuXG5cdFx0ZGF0YSA9IG5ldyBBcnJheSgpXG5cblx0XHRzZWFyY2hUZXh0ID0gb3B0aW9ucy5zZWFyY2hUZXh0XG5cdFx0c3BhY2UgPSBvcHRpb25zLnNwYWNlXG5cblx0XHRfLmZvckVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAoX29iamVjdCwgbmFtZSktPlxuXHRcdFx0aWYgX29iamVjdC5lbmFibGVfc2VhcmNoXG5cdFx0XHRcdG9iamVjdF9yZWNvcmQgPSBzZWFyY2hfb2JqZWN0KHNwYWNlLCBfb2JqZWN0Lm5hbWUsIHNlbGYudXNlcklkLCBzZWFyY2hUZXh0KVxuXHRcdFx0XHRkYXRhID0gZGF0YS5jb25jYXQob2JqZWN0X3JlY29yZClcblxuXHRcdHJldHVybiBkYXRhXG4iLCJ2YXIgYXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSwgcmVjZW50X2FnZ3JlZ2F0ZSwgc2VhcmNoX29iamVjdDtcblxucmVjZW50X2FnZ3JlZ2F0ZSA9IGZ1bmN0aW9uKGNyZWF0ZWRfYnksIHNwYWNlSWQsIF9yZWNvcmRzLCBjYWxsYmFjaykge1xuICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfcmVjZW50X3ZpZXdlZC5yYXdDb2xsZWN0aW9uKCkuYWdncmVnYXRlKFtcbiAgICB7XG4gICAgICAkbWF0Y2g6IHtcbiAgICAgICAgY3JlYXRlZF9ieTogY3JlYXRlZF9ieSxcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAkZ3JvdXA6IHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IFwiJHJlY29yZC5vXCIsXG4gICAgICAgICAgcmVjb3JkX2lkOiBcIiRyZWNvcmQuaWRzXCIsXG4gICAgICAgICAgc3BhY2U6IFwiJHNwYWNlXCJcbiAgICAgICAgfSxcbiAgICAgICAgbWF4Q3JlYXRlZDoge1xuICAgICAgICAgICRtYXg6IFwiJGNyZWF0ZWRcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgJHNvcnQ6IHtcbiAgICAgICAgbWF4Q3JlYXRlZDogLTFcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAkbGltaXQ6IDEwXG4gICAgfVxuICBdKS50b0FycmF5KGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICAgIH1cbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZG9jKSB7XG4gICAgICByZXR1cm4gX3JlY29yZHMucHVzaChkb2MuX2lkKTtcbiAgICB9KTtcbiAgICBpZiAoY2FsbGJhY2sgJiYgXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH0pO1xufTtcblxuYXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSA9IE1ldGVvci53cmFwQXN5bmMocmVjZW50X2FnZ3JlZ2F0ZSk7XG5cbnNlYXJjaF9vYmplY3QgPSBmdW5jdGlvbihzcGFjZSwgb2JqZWN0X25hbWUsIHVzZXJJZCwgc2VhcmNoVGV4dCkge1xuICB2YXIgX29iamVjdCwgX29iamVjdF9jb2xsZWN0aW9uLCBfb2JqZWN0X25hbWVfa2V5LCBkYXRhLCBmaWVsZHMsIHF1ZXJ5LCBxdWVyeV9hbmQsIHJlY29yZHMsIHNlYXJjaF9LZXl3b3JkcztcbiAgZGF0YSA9IG5ldyBBcnJheSgpO1xuICBpZiAoc2VhcmNoVGV4dCkge1xuICAgIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgX29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKTtcbiAgICBfb2JqZWN0X25hbWVfa2V5ID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5OQU1FX0ZJRUxEX0tFWSA6IHZvaWQgMDtcbiAgICBpZiAoX29iamVjdCAmJiBfb2JqZWN0X2NvbGxlY3Rpb24gJiYgX29iamVjdF9uYW1lX2tleSkge1xuICAgICAgcXVlcnkgPSB7fTtcbiAgICAgIHNlYXJjaF9LZXl3b3JkcyA9IHNlYXJjaFRleHQuc3BsaXQoXCIgXCIpO1xuICAgICAgcXVlcnlfYW5kID0gW107XG4gICAgICBzZWFyY2hfS2V5d29yZHMuZm9yRWFjaChmdW5jdGlvbihrZXl3b3JkKSB7XG4gICAgICAgIHZhciBzdWJxdWVyeTtcbiAgICAgICAgc3VicXVlcnkgPSB7fTtcbiAgICAgICAgc3VicXVlcnlbX29iamVjdF9uYW1lX2tleV0gPSB7XG4gICAgICAgICAgJHJlZ2V4OiBrZXl3b3JkLnRyaW0oKVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcXVlcnlfYW5kLnB1c2goc3VicXVlcnkpO1xuICAgICAgfSk7XG4gICAgICBxdWVyeS4kYW5kID0gcXVlcnlfYW5kO1xuICAgICAgcXVlcnkuc3BhY2UgPSB7XG4gICAgICAgICRpbjogW3NwYWNlXVxuICAgICAgfTtcbiAgICAgIGZpZWxkcyA9IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9O1xuICAgICAgZmllbGRzW19vYmplY3RfbmFtZV9rZXldID0gMTtcbiAgICAgIHJlY29yZHMgPSBfb2JqZWN0X2NvbGxlY3Rpb24uZmluZChxdWVyeSwge1xuICAgICAgICBmaWVsZHM6IGZpZWxkcyxcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIG1vZGlmaWVkOiAxXG4gICAgICAgIH0sXG4gICAgICAgIGxpbWl0OiA1XG4gICAgICB9KTtcbiAgICAgIHJlY29yZHMuZm9yRWFjaChmdW5jdGlvbihyZWNvcmQpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEucHVzaCh7XG4gICAgICAgICAgX2lkOiByZWNvcmQuX2lkLFxuICAgICAgICAgIF9uYW1lOiByZWNvcmRbX29iamVjdF9uYW1lX2tleV0sXG4gICAgICAgICAgX29iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGF0YTtcbn07XG5cbk1ldGVvci5tZXRob2RzKHtcbiAgJ29iamVjdF9yZWNlbnRfcmVjb3JkJzogZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBkYXRhLCByZWNvcmRzO1xuICAgIGRhdGEgPSBuZXcgQXJyYXkoKTtcbiAgICByZWNvcmRzID0gbmV3IEFycmF5KCk7XG4gICAgYXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSh0aGlzLnVzZXJJZCwgc3BhY2VJZCwgcmVjb3Jkcyk7XG4gICAgcmVjb3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHZhciBmaWVsZHMsIHJlY29yZCwgcmVjb3JkX29iamVjdCwgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uO1xuICAgICAgcmVjb3JkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpO1xuICAgICAgaWYgKCFyZWNvcmRfb2JqZWN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJlY29yZF9vYmplY3RfY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihpdGVtLm9iamVjdF9uYW1lLCBpdGVtLnNwYWNlKTtcbiAgICAgIGlmIChyZWNvcmRfb2JqZWN0ICYmIHJlY29yZF9vYmplY3RfY29sbGVjdGlvbikge1xuICAgICAgICBmaWVsZHMgPSB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH07XG4gICAgICAgIGZpZWxkc1tyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSA9IDE7XG4gICAgICAgIHJlY29yZCA9IHJlY29yZF9vYmplY3RfY29sbGVjdGlvbi5maW5kT25lKGl0ZW0ucmVjb3JkX2lkWzBdLCB7XG4gICAgICAgICAgZmllbGRzOiBmaWVsZHNcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YS5wdXNoKHtcbiAgICAgICAgICAgIF9pZDogcmVjb3JkLl9pZCxcbiAgICAgICAgICAgIF9uYW1lOiByZWNvcmRbcmVjb3JkX29iamVjdC5OQU1FX0ZJRUxEX0tFWV0sXG4gICAgICAgICAgICBfb2JqZWN0X25hbWU6IGl0ZW0ub2JqZWN0X25hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9LFxuICAnb2JqZWN0X3JlY29yZF9zZWFyY2gnOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGRhdGEsIHNlYXJjaFRleHQsIHNlbGYsIHNwYWNlO1xuICAgIHNlbGYgPSB0aGlzO1xuICAgIGRhdGEgPSBuZXcgQXJyYXkoKTtcbiAgICBzZWFyY2hUZXh0ID0gb3B0aW9ucy5zZWFyY2hUZXh0O1xuICAgIHNwYWNlID0gb3B0aW9ucy5zcGFjZTtcbiAgICBfLmZvckVhY2goQ3JlYXRvci5vYmplY3RzQnlOYW1lLCBmdW5jdGlvbihfb2JqZWN0LCBuYW1lKSB7XG4gICAgICB2YXIgb2JqZWN0X3JlY29yZDtcbiAgICAgIGlmIChfb2JqZWN0LmVuYWJsZV9zZWFyY2gpIHtcbiAgICAgICAgb2JqZWN0X3JlY29yZCA9IHNlYXJjaF9vYmplY3Qoc3BhY2UsIF9vYmplY3QubmFtZSwgc2VsZi51c2VySWQsIHNlYXJjaFRleHQpO1xuICAgICAgICByZXR1cm4gZGF0YSA9IGRhdGEuY29uY2F0KG9iamVjdF9yZWNvcmQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG4gICAgdXBkYXRlX2ZpbHRlcnM6IChsaXN0dmlld19pZCwgZmlsdGVycywgZmlsdGVyX3Njb3BlLCBmaWx0ZXJfbG9naWMpLT5cbiAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfbGlzdHZpZXdzLmRpcmVjdC51cGRhdGUoe19pZDogbGlzdHZpZXdfaWR9LCB7JHNldDoge2ZpbHRlcnM6IGZpbHRlcnMsIGZpbHRlcl9zY29wZTogZmlsdGVyX3Njb3BlLCBmaWx0ZXJfbG9naWM6IGZpbHRlcl9sb2dpY319KVxuXG4gICAgdXBkYXRlX2NvbHVtbnM6IChsaXN0dmlld19pZCwgY29sdW1ucyktPlxuICAgICAgICBjaGVjayhjb2x1bW5zLCBBcnJheSlcbiAgICAgICAgXG4gICAgICAgIGlmIGNvbHVtbnMubGVuZ3RoIDwgMVxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDAsIFwiU2VsZWN0IGF0IGxlYXN0IG9uZSBmaWVsZCB0byBkaXNwbGF5XCJcbiAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfbGlzdHZpZXdzLnVwZGF0ZSh7X2lkOiBsaXN0dmlld19pZH0sIHskc2V0OiB7Y29sdW1uczogY29sdW1uc319KVxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICB1cGRhdGVfZmlsdGVyczogZnVuY3Rpb24obGlzdHZpZXdfaWQsIGZpbHRlcnMsIGZpbHRlcl9zY29wZSwgZmlsdGVyX2xvZ2ljKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogbGlzdHZpZXdfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGZpbHRlcnM6IGZpbHRlcnMsXG4gICAgICAgIGZpbHRlcl9zY29wZTogZmlsdGVyX3Njb3BlLFxuICAgICAgICBmaWx0ZXJfbG9naWM6IGZpbHRlcl9sb2dpY1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICB1cGRhdGVfY29sdW1uczogZnVuY3Rpb24obGlzdHZpZXdfaWQsIGNvbHVtbnMpIHtcbiAgICBjaGVjayhjb2x1bW5zLCBBcnJheSk7XG4gICAgaWYgKGNvbHVtbnMubGVuZ3RoIDwgMSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwiU2VsZWN0IGF0IGxlYXN0IG9uZSBmaWVsZCB0byBkaXNwbGF5XCIpO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfbGlzdHZpZXdzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IGxpc3R2aWV3X2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0J3JlcG9ydF9kYXRhJzogKG9wdGlvbnMpLT5cblx0XHRjaGVjayhvcHRpb25zLCBPYmplY3QpXG5cdFx0c3BhY2UgPSBvcHRpb25zLnNwYWNlXG5cdFx0ZmllbGRzID0gb3B0aW9ucy5maWVsZHNcblx0XHRvYmplY3RfbmFtZSA9IG9wdGlvbnMub2JqZWN0X25hbWVcblx0XHRmaWx0ZXJfc2NvcGUgPSBvcHRpb25zLmZpbHRlcl9zY29wZVxuXHRcdGZpbHRlcnMgPSBvcHRpb25zLmZpbHRlcnNcblx0XHRmaWx0ZXJGaWVsZHMgPSB7fVxuXHRcdGNvbXBvdW5kRmllbGRzID0gW11cblx0XHRvYmplY3RGaWVsZHMgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk/LmZpZWxkc1xuXHRcdF8uZWFjaCBmaWVsZHMsIChpdGVtLCBpbmRleCktPlxuXHRcdFx0c3BsaXRzID0gaXRlbS5zcGxpdChcIi5cIilcblx0XHRcdG5hbWUgPSBzcGxpdHNbMF1cblx0XHRcdG9iamVjdEZpZWxkID0gb2JqZWN0RmllbGRzW25hbWVdXG5cdFx0XHRpZiBzcGxpdHMubGVuZ3RoID4gMSBhbmQgb2JqZWN0RmllbGRcblx0XHRcdFx0Y2hpbGRLZXkgPSBpdGVtLnJlcGxhY2UgbmFtZSArIFwiLlwiLCBcIlwiXG5cdFx0XHRcdGNvbXBvdW5kRmllbGRzLnB1c2goe25hbWU6IG5hbWUsIGNoaWxkS2V5OiBjaGlsZEtleSwgZmllbGQ6IG9iamVjdEZpZWxkfSlcblx0XHRcdGZpbHRlckZpZWxkc1tuYW1lXSA9IDFcblxuXHRcdHNlbGVjdG9yID0ge31cblx0XHR1c2VySWQgPSB0aGlzLnVzZXJJZFxuXHRcdHNlbGVjdG9yLnNwYWNlID0gc3BhY2Vcblx0XHRpZiBmaWx0ZXJfc2NvcGUgPT0gXCJzcGFjZXhcIlxuXHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSBcblx0XHRcdFx0JGluOiBbbnVsbCxzcGFjZV1cblx0XHRlbHNlIGlmIGZpbHRlcl9zY29wZSA9PSBcIm1pbmVcIlxuXHRcdFx0c2VsZWN0b3Iub3duZXIgPSB1c2VySWRcblxuXHRcdGlmIENyZWF0b3IuaXNDb21tb25TcGFjZShzcGFjZSkgJiYgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2UsIEB1c2VySWQpXG5cdFx0XHRkZWxldGUgc2VsZWN0b3Iuc3BhY2VcblxuXHRcdGlmIGZpbHRlcnMgYW5kIGZpbHRlcnMubGVuZ3RoID4gMFxuXHRcdFx0c2VsZWN0b3JbXCIkYW5kXCJdID0gZmlsdGVyc1xuXG5cdFx0Y3Vyc29yID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yLCB7ZmllbGRzOiBmaWx0ZXJGaWVsZHMsIHNraXA6IDAsIGxpbWl0OiAxMDAwMH0pXG4jXHRcdGlmIGN1cnNvci5jb3VudCgpID4gMTAwMDBcbiNcdFx0XHRyZXR1cm4gW11cblx0XHRyZXN1bHQgPSBjdXJzb3IuZmV0Y2goKVxuXHRcdGlmIGNvbXBvdW5kRmllbGRzLmxlbmd0aFxuXHRcdFx0cmVzdWx0ID0gcmVzdWx0Lm1hcCAoaXRlbSxpbmRleCktPlxuXHRcdFx0XHRfLmVhY2ggY29tcG91bmRGaWVsZHMsIChjb21wb3VuZEZpZWxkSXRlbSwgaW5kZXgpLT5cblx0XHRcdFx0XHRpdGVtS2V5ID0gY29tcG91bmRGaWVsZEl0ZW0ubmFtZSArIFwiKiUqXCIgKyBjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleS5yZXBsYWNlKC9cXC4vZywgXCIqJSpcIilcblx0XHRcdFx0XHRpdGVtVmFsdWUgPSBpdGVtW2NvbXBvdW5kRmllbGRJdGVtLm5hbWVdXG5cdFx0XHRcdFx0dHlwZSA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLnR5cGVcblx0XHRcdFx0XHRpZiBbXCJsb29rdXBcIiwgXCJtYXN0ZXJfZGV0YWlsXCJdLmluZGV4T2YodHlwZSkgPiAtMVxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQucmVmZXJlbmNlX3RvXG5cdFx0XHRcdFx0XHRjb21wb3VuZEZpbHRlckZpZWxkcyA9IHt9XG5cdFx0XHRcdFx0XHRjb21wb3VuZEZpbHRlckZpZWxkc1tjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV0gPSAxXG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VJdGVtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bykuZmluZE9uZSB7X2lkOiBpdGVtVmFsdWV9LCBmaWVsZHM6IGNvbXBvdW5kRmlsdGVyRmllbGRzXG5cdFx0XHRcdFx0XHRpZiByZWZlcmVuY2VJdGVtXG5cdFx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSByZWZlcmVuY2VJdGVtW2NvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5XVxuXHRcdFx0XHRcdGVsc2UgaWYgdHlwZSA9PSBcInNlbGVjdFwiXG5cdFx0XHRcdFx0XHRvcHRpb25zID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQub3B0aW9uc1xuXHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IF8uZmluZFdoZXJlKG9wdGlvbnMsIHt2YWx1ZTogaXRlbVZhbHVlfSk/LmxhYmVsIG9yIGl0ZW1WYWx1ZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSBpdGVtVmFsdWVcblx0XHRcdFx0XHR1bmxlc3MgaXRlbVtpdGVtS2V5XVxuXHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IFwiLS1cIlxuXHRcdFx0XHRyZXR1cm4gaXRlbVxuXHRcdFx0cmV0dXJuIHJlc3VsdFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiByZXN1bHRcblxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICAncmVwb3J0X2RhdGEnOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGNvbXBvdW5kRmllbGRzLCBjdXJzb3IsIGZpZWxkcywgZmlsdGVyRmllbGRzLCBmaWx0ZXJfc2NvcGUsIGZpbHRlcnMsIG9iamVjdEZpZWxkcywgb2JqZWN0X25hbWUsIHJlZiwgcmVzdWx0LCBzZWxlY3Rvciwgc3BhY2UsIHVzZXJJZDtcbiAgICBjaGVjayhvcHRpb25zLCBPYmplY3QpO1xuICAgIHNwYWNlID0gb3B0aW9ucy5zcGFjZTtcbiAgICBmaWVsZHMgPSBvcHRpb25zLmZpZWxkcztcbiAgICBvYmplY3RfbmFtZSA9IG9wdGlvbnMub2JqZWN0X25hbWU7XG4gICAgZmlsdGVyX3Njb3BlID0gb3B0aW9ucy5maWx0ZXJfc2NvcGU7XG4gICAgZmlsdGVycyA9IG9wdGlvbnMuZmlsdGVycztcbiAgICBmaWx0ZXJGaWVsZHMgPSB7fTtcbiAgICBjb21wb3VuZEZpZWxkcyA9IFtdO1xuICAgIG9iamVjdEZpZWxkcyA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwO1xuICAgIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICB2YXIgY2hpbGRLZXksIG5hbWUsIG9iamVjdEZpZWxkLCBzcGxpdHM7XG4gICAgICBzcGxpdHMgPSBpdGVtLnNwbGl0KFwiLlwiKTtcbiAgICAgIG5hbWUgPSBzcGxpdHNbMF07XG4gICAgICBvYmplY3RGaWVsZCA9IG9iamVjdEZpZWxkc1tuYW1lXTtcbiAgICAgIGlmIChzcGxpdHMubGVuZ3RoID4gMSAmJiBvYmplY3RGaWVsZCkge1xuICAgICAgICBjaGlsZEtleSA9IGl0ZW0ucmVwbGFjZShuYW1lICsgXCIuXCIsIFwiXCIpO1xuICAgICAgICBjb21wb3VuZEZpZWxkcy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgIGNoaWxkS2V5OiBjaGlsZEtleSxcbiAgICAgICAgICBmaWVsZDogb2JqZWN0RmllbGRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmlsdGVyRmllbGRzW25hbWVdID0gMTtcbiAgICB9KTtcbiAgICBzZWxlY3RvciA9IHt9O1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2U7XG4gICAgaWYgKGZpbHRlcl9zY29wZSA9PT0gXCJzcGFjZXhcIikge1xuICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAgICRpbjogW251bGwsIHNwYWNlXVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGZpbHRlcl9zY29wZSA9PT0gXCJtaW5lXCIpIHtcbiAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICAgIH1cbiAgICBpZiAoQ3JlYXRvci5pc0NvbW1vblNwYWNlKHNwYWNlKSAmJiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZSwgdGhpcy51c2VySWQpKSB7XG4gICAgICBkZWxldGUgc2VsZWN0b3Iuc3BhY2U7XG4gICAgfVxuICAgIGlmIChmaWx0ZXJzICYmIGZpbHRlcnMubGVuZ3RoID4gMCkge1xuICAgICAgc2VsZWN0b3JbXCIkYW5kXCJdID0gZmlsdGVycztcbiAgICB9XG4gICAgY3Vyc29yID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yLCB7XG4gICAgICBmaWVsZHM6IGZpbHRlckZpZWxkcyxcbiAgICAgIHNraXA6IDAsXG4gICAgICBsaW1pdDogMTAwMDBcbiAgICB9KTtcbiAgICByZXN1bHQgPSBjdXJzb3IuZmV0Y2goKTtcbiAgICBpZiAoY29tcG91bmRGaWVsZHMubGVuZ3RoKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHQubWFwKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgIF8uZWFjaChjb21wb3VuZEZpZWxkcywgZnVuY3Rpb24oY29tcG91bmRGaWVsZEl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgdmFyIGNvbXBvdW5kRmlsdGVyRmllbGRzLCBpdGVtS2V5LCBpdGVtVmFsdWUsIHJlZjEsIHJlZmVyZW5jZUl0ZW0sIHJlZmVyZW5jZV90bywgdHlwZTtcbiAgICAgICAgICBpdGVtS2V5ID0gY29tcG91bmRGaWVsZEl0ZW0ubmFtZSArIFwiKiUqXCIgKyBjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleS5yZXBsYWNlKC9cXC4vZywgXCIqJSpcIik7XG4gICAgICAgICAgaXRlbVZhbHVlID0gaXRlbVtjb21wb3VuZEZpZWxkSXRlbS5uYW1lXTtcbiAgICAgICAgICB0eXBlID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQudHlwZTtcbiAgICAgICAgICBpZiAoW1wibG9va3VwXCIsIFwibWFzdGVyX2RldGFpbFwiXS5pbmRleE9mKHR5cGUpID4gLTEpIHtcbiAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgIGNvbXBvdW5kRmlsdGVyRmllbGRzID0ge307XG4gICAgICAgICAgICBjb21wb3VuZEZpbHRlckZpZWxkc1tjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV0gPSAxO1xuICAgICAgICAgICAgcmVmZXJlbmNlSXRlbSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8pLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IGl0ZW1WYWx1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IGNvbXBvdW5kRmlsdGVyRmllbGRzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyZWZlcmVuY2VJdGVtKSB7XG4gICAgICAgICAgICAgIGl0ZW1baXRlbUtleV0gPSByZWZlcmVuY2VJdGVtW2NvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5vcHRpb25zO1xuICAgICAgICAgICAgaXRlbVtpdGVtS2V5XSA9ICgocmVmMSA9IF8uZmluZFdoZXJlKG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgdmFsdWU6IGl0ZW1WYWx1ZVxuICAgICAgICAgICAgfSkpICE9IG51bGwgPyByZWYxLmxhYmVsIDogdm9pZCAwKSB8fCBpdGVtVmFsdWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl0ZW1baXRlbUtleV0gPSBpdGVtVmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghaXRlbVtpdGVtS2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW1baXRlbUtleV0gPSBcIi0tXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG59KTtcbiIsIiMjI1xuICAgIHR5cGU6IFwidXNlclwiXG4gICAgb2JqZWN0X25hbWU6IFwib2JqZWN0X2xpc3R2aWV3c1wiXG4gICAgcmVjb3JkX2lkOiBcIntvYmplY3RfbmFtZX0se2xpc3R2aWV3X2lkfVwiXG4gICAgc2V0dGluZ3M6XG4gICAgICAgIGNvbHVtbl93aWR0aDogeyBmaWVsZF9hOiAxMDAsIGZpZWxkXzI6IDE1MCB9XG4gICAgICAgIHNvcnQ6IFtbXCJmaWVsZF9hXCIsIFwiZGVzY1wiXV1cbiAgICBvd25lcjoge3VzZXJJZH1cbiMjI1xuXG5NZXRlb3IubWV0aG9kc1xuICAgIFwidGFidWxhcl9zb3J0X3NldHRpbmdzXCI6IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBzb3J0KS0+XG4gICAgICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXG4gICAgICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIiwgb3duZXI6IHVzZXJJZH0pXG4gICAgICAgIGlmIHNldHRpbmdcbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5zb3J0XCI6IHNvcnR9fSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZG9jID0gXG4gICAgICAgICAgICAgICAgdHlwZTogXCJ1c2VyXCJcbiAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHt9XG4gICAgICAgICAgICAgICAgb3duZXI6IHVzZXJJZFxuXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9XG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydFxuXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpXG5cbiAgICBcInRhYnVsYXJfY29sdW1uX3dpZHRoX3NldHRpbmdzXCI6IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5fd2lkdGgpLT5cbiAgICAgICAgdXNlcklkID0gdGhpcy51c2VySWRcbiAgICAgICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLCBvd25lcjogdXNlcklkfSlcbiAgICAgICAgaWYgc2V0dGluZ1xuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LmNvbHVtbl93aWR0aFwiOiBjb2x1bW5fd2lkdGh9fSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZG9jID0gXG4gICAgICAgICAgICAgICAgdHlwZTogXCJ1c2VyXCJcbiAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHt9XG4gICAgICAgICAgICAgICAgb3duZXI6IHVzZXJJZFxuXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9XG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5jb2x1bW5fd2lkdGggPSBjb2x1bW5fd2lkdGhcblxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKVxuXG4gICAgXCJncmlkX3NldHRpbmdzXCI6IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5fd2lkdGgsIHNvcnQpLT5cbiAgICAgICAgdXNlcklkID0gdGhpcy51c2VySWRcbiAgICAgICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiLCBvd25lcjogdXNlcklkfSlcbiAgICAgICAgaWYgc2V0dGluZ1xuICAgICAgICAgICAgIyDmr4/mrKHpg73lvLrliLbmlLnlj5hfaWRfYWN0aW9uc+WIl+eahOWuveW6pu+8jOS7peino+WGs+W9k+eUqOaIt+WPquaUueWPmOWtl+auteasoeW6j+iAjOayoeacieaUueWPmOS7u+S9leWtl+auteWuveW6puaXtu+8jOWJjeerr+ayoeacieiuoumYheWIsOWtl+auteasoeW6j+WPmOabtOeahOaVsOaNrueahOmXrumimFxuICAgICAgICAgICAgY29sdW1uX3dpZHRoLl9pZF9hY3Rpb25zID0gaWYgc2V0dGluZy5zZXR0aW5nc1tcIiN7bGlzdF92aWV3X2lkfVwiXT8uY29sdW1uX3dpZHRoPy5faWRfYWN0aW9ucyA9PSA0NiB0aGVuIDQ3IGVsc2UgNDZcbiAgICAgICAgICAgIGlmIHNvcnRcbiAgICAgICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uc29ydFwiOiBzb3J0LCBcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5jb2x1bW5fd2lkdGhcIjogY29sdW1uX3dpZHRofX0pXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LmNvbHVtbl93aWR0aFwiOiBjb2x1bW5fd2lkdGh9fSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZG9jID1cbiAgICAgICAgICAgICAgICB0eXBlOiBcInVzZXJcIlxuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuICAgICAgICAgICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge31cbiAgICAgICAgICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge31cbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aFxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnRcblxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKSIsIlxuLypcbiAgICB0eXBlOiBcInVzZXJcIlxuICAgIG9iamVjdF9uYW1lOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICAgIHJlY29yZF9pZDogXCJ7b2JqZWN0X25hbWV9LHtsaXN0dmlld19pZH1cIlxuICAgIHNldHRpbmdzOlxuICAgICAgICBjb2x1bW5fd2lkdGg6IHsgZmllbGRfYTogMTAwLCBmaWVsZF8yOiAxNTAgfVxuICAgICAgICBzb3J0OiBbW1wiZmllbGRfYVwiLCBcImRlc2NcIl1dXG4gICAgb3duZXI6IHt1c2VySWR9XG4gKi9cbk1ldGVvci5tZXRob2RzKHtcbiAgXCJ0YWJ1bGFyX3NvcnRfc2V0dGluZ3NcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgc29ydCkge1xuICAgIHZhciBkb2MsIG9iaiwgc2V0dGluZywgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgIG93bmVyOiB1c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc2V0dGluZykge1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgb2JqID0ge30sXG4gICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5zb3J0XCJdID0gc29ydCxcbiAgICAgICAgICBvYmpcbiAgICAgICAgKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYyA9IHtcbiAgICAgICAgdHlwZTogXCJ1c2VyXCIsXG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgICAgc2V0dGluZ3M6IHt9LFxuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0O1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYyk7XG4gICAgfVxuICB9LFxuICBcInRhYnVsYXJfY29sdW1uX3dpZHRoX3NldHRpbmdzXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbl93aWR0aCkge1xuICAgIHZhciBkb2MsIG9iaiwgc2V0dGluZywgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgIG93bmVyOiB1c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc2V0dGluZykge1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgb2JqID0ge30sXG4gICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5jb2x1bW5fd2lkdGhcIl0gPSBjb2x1bW5fd2lkdGgsXG4gICAgICAgICAgb2JqXG4gICAgICAgIClcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2MgPSB7XG4gICAgICAgIHR5cGU6IFwidXNlclwiLFxuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge307XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5jb2x1bW5fd2lkdGggPSBjb2x1bW5fd2lkdGg7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH0sXG4gIFwiZ3JpZF9zZXR0aW5nc1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5fd2lkdGgsIHNvcnQpIHtcbiAgICB2YXIgZG9jLCBvYmosIG9iajEsIHJlZiwgcmVmMSwgc2V0dGluZywgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIixcbiAgICAgIG93bmVyOiB1c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc2V0dGluZykge1xuICAgICAgY29sdW1uX3dpZHRoLl9pZF9hY3Rpb25zID0gKChyZWYgPSBzZXR0aW5nLnNldHRpbmdzW1wiXCIgKyBsaXN0X3ZpZXdfaWRdKSAhPSBudWxsID8gKHJlZjEgPSByZWYuY29sdW1uX3dpZHRoKSAhPSBudWxsID8gcmVmMS5faWRfYWN0aW9ucyA6IHZvaWQgMCA6IHZvaWQgMCkgPT09IDQ2ID8gNDcgOiA0NjtcbiAgICAgIGlmIChzb3J0KSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDogKFxuICAgICAgICAgICAgb2JqID0ge30sXG4gICAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLnNvcnRcIl0gPSBzb3J0LFxuICAgICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5jb2x1bW5fd2lkdGhcIl0gPSBjb2x1bW5fd2lkdGgsXG4gICAgICAgICAgICBvYmpcbiAgICAgICAgICApXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgICBvYmoxID0ge30sXG4gICAgICAgICAgICBvYmoxW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5jb2x1bW5fd2lkdGhcIl0gPSBjb2x1bW5fd2lkdGgsXG4gICAgICAgICAgICBvYmoxXG4gICAgICAgICAgKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZG9jID0ge1xuICAgICAgICB0eXBlOiBcInVzZXJcIixcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiLFxuICAgICAgICBzZXR0aW5nczoge30sXG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH07XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoO1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnQ7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH1cbn0pO1xuIiwieG1sMmpzID0gcmVxdWlyZSAneG1sMmpzJ1xuZnMgPSByZXF1aXJlICdmcydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xubWtkaXJwID0gcmVxdWlyZSAnbWtkaXJwJ1xuXG5sb2dnZXIgPSBuZXcgTG9nZ2VyICdFeHBvcnRfVE9fWE1MJ1xuXG5fd3JpdGVYbWxGaWxlID0gKGpzb25PYmosb2JqTmFtZSkgLT5cblx0IyDovax4bWxcblx0YnVpbGRlciA9IG5ldyB4bWwyanMuQnVpbGRlcigpXG5cdHhtbCA9IGJ1aWxkZXIuYnVpbGRPYmplY3QganNvbk9ialxuXG5cdCMg6L2s5Li6YnVmZmVyXG5cdHN0cmVhbSA9IG5ldyBCdWZmZXIgeG1sXG5cblx0IyDmoLnmja7lvZPlpKnml7bpl7TnmoTlubTmnIjml6XkvZzkuLrlrZjlgqjot6/lvoRcblx0bm93ID0gbmV3IERhdGVcblx0eWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXG5cdG1vbnRoID0gbm93LmdldE1vbnRoKCkgKyAxXG5cdGRheSA9IG5vdy5nZXREYXRlKClcblxuXHQjIOaWh+S7tui3r+W+hFxuXHRmaWxlUGF0aCA9IHBhdGguam9pbihfX21ldGVvcl9ib290c3RyYXBfXy5zZXJ2ZXJEaXIsJy4uLy4uLy4uL2V4cG9ydC8nICsgeWVhciArICcvJyArIG1vbnRoICsgJy8nICsgZGF5ICsgJy8nICsgb2JqTmFtZSApXG5cdGZpbGVOYW1lID0ganNvbk9iaj8uX2lkICsgXCIueG1sXCJcblx0ZmlsZUFkZHJlc3MgPSBwYXRoLmpvaW4gZmlsZVBhdGgsIGZpbGVOYW1lXG5cblx0aWYgIWZzLmV4aXN0c1N5bmMgZmlsZVBhdGhcblx0XHRta2RpcnAuc3luYyBmaWxlUGF0aFxuXG5cdCMg5YaZ5YWl5paH5Lu2XG5cdGZzLndyaXRlRmlsZSBmaWxlQWRkcmVzcywgc3RyZWFtLCAoZXJyKSAtPlxuXHRcdGlmIGVyclxuXHRcdFx0bG9nZ2VyLmVycm9yIFwiI3tqc29uT2JqLl9pZH3lhpnlhaV4bWzmlofku7blpLHotKVcIixlcnJcblx0XG5cdHJldHVybiBmaWxlUGF0aFxuXG5cbiMg5pW055CGRmllbGRz55qEanNvbuaVsOaNrlxuX21peEZpZWxkc0RhdGEgPSAob2JqLG9iak5hbWUpIC0+XG5cdCMg5Yid5aeL5YyW5a+56LGh5pWw5o2uXG5cdGpzb25PYmogPSB7fVxuXHQjIOiOt+WPlmZpZWxkc1xuXHRvYmpGaWVsZHMgPSBDcmVhdG9yPy5nZXRPYmplY3Qob2JqTmFtZSk/LmZpZWxkc1xuXG5cdG1peERlZmF1bHQgPSAoZmllbGRfbmFtZSktPlxuXHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBvYmpbZmllbGRfbmFtZV0gfHwgXCJcIlxuXG5cdG1peERhdGUgPSAoZmllbGRfbmFtZSx0eXBlKS0+XG5cdFx0ZGF0ZSA9IG9ialtmaWVsZF9uYW1lXVxuXHRcdGlmIHR5cGUgPT0gXCJkYXRlXCJcblx0XHRcdGZvcm1hdCA9IFwiWVlZWS1NTS1ERFwiXG5cdFx0ZWxzZVxuXHRcdFx0Zm9ybWF0ID0gXCJZWVlZLU1NLUREIEhIOm1tOnNzXCJcblx0XHRpZiBkYXRlPyBhbmQgZm9ybWF0P1xuXHRcdFx0ZGF0ZVN0ciA9IG1vbWVudChkYXRlKS5mb3JtYXQoZm9ybWF0KVxuXHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBkYXRlU3RyIHx8IFwiXCJcblxuXHRtaXhCb29sID0gKGZpZWxkX25hbWUpLT5cblx0XHRpZiBvYmpbZmllbGRfbmFtZV0gPT0gdHJ1ZVxuXHRcdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5pivXCJcblx0XHRlbHNlIGlmIG9ialtmaWVsZF9uYW1lXSA9PSBmYWxzZVxuXHRcdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5ZCmXCJcblx0XHRlbHNlXG5cdFx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gXCJcIlxuXG5cdCMg5b6q546v5q+P5LiqZmllbGRzLOW5tuWIpOaWreWPluWAvFxuXHRfLmVhY2ggb2JqRmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRzd2l0Y2ggZmllbGQ/LnR5cGVcblx0XHRcdHdoZW4gXCJkYXRlXCIsXCJkYXRldGltZVwiIHRoZW4gbWl4RGF0ZSBmaWVsZF9uYW1lLGZpZWxkLnR5cGVcblx0XHRcdHdoZW4gXCJib29sZWFuXCIgdGhlbiBtaXhCb29sIGZpZWxkX25hbWVcblx0XHRcdGVsc2UgbWl4RGVmYXVsdCBmaWVsZF9uYW1lXG5cblx0cmV0dXJuIGpzb25PYmpcblxuIyDojrflj5blrZDooajmlbTnkIbmlbDmja5cbl9taXhSZWxhdGVkRGF0YSA9IChvYmosb2JqTmFtZSkgLT5cblx0IyDliJ3lp4vljJblr7nosaHmlbDmja5cblx0cmVsYXRlZF9vYmplY3RzID0ge31cblxuXHQjIOiOt+WPluebuOWFs+ihqFxuXHRyZWxhdGVkT2JqTmFtZXMgPSBDcmVhdG9yPy5nZXRBbGxSZWxhdGVkT2JqZWN0cyBvYmpOYW1lXG5cblx0IyDlvqrnjq/nm7jlhbPooahcblx0cmVsYXRlZE9iak5hbWVzLmZvckVhY2ggKHJlbGF0ZWRPYmpOYW1lKSAtPlxuXHRcdCMg5q+P5Liq6KGo5a6a5LmJ5LiA5Liq5a+56LGh5pWw57uEXG5cdFx0cmVsYXRlZFRhYmxlRGF0YSA9IFtdXG5cblx0XHQjICrorr7nva7lhbPogZTmkJzntKLmn6Xor6LnmoTlrZfmrrVcblx0XHQjIOmZhOS7tueahOWFs+iBlOaQnOe0ouWtl+auteaYr+Wumuatu+eahFxuXHRcdGlmIHJlbGF0ZWRPYmpOYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwicGFyZW50Lmlkc1wiXG5cdFx0ZWxzZVxuXHRcdFx0IyDojrflj5ZmaWVsZHNcblx0XHRcdGZpZWxkcyA9IENyZWF0b3I/Lk9iamVjdHNbcmVsYXRlZE9iak5hbWVdPy5maWVsZHNcblx0XHRcdCMg5b6q546v5q+P5LiqZmllbGQs5om+5Ye6cmVmZXJlbmNlX3Rv55qE5YWz6IGU5a2X5q61XG5cdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSBcIlwiXG5cdFx0XHRfLmVhY2ggZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRcdFx0aWYgZmllbGQ/LnJlZmVyZW5jZV90byA9PSBvYmpOYW1lXG5cdFx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gZmllbGRfbmFtZVxuXG5cdFx0IyDmoLnmja7mib7lh7rnmoTlhbPogZTlrZfmrrXvvIzmn6XlrZDooajmlbDmja5cblx0XHRpZiByZWxhdGVkX2ZpZWxkX25hbWVcblx0XHRcdHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmpOYW1lKVxuXHRcdFx0IyDojrflj5bliLDmiYDmnInnmoTmlbDmja5cblx0XHRcdHJlbGF0ZWRSZWNvcmRMaXN0ID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZCh7XCIje3JlbGF0ZWRfZmllbGRfbmFtZX1cIjpvYmouX2lkfSkuZmV0Y2goKVxuXHRcdFx0IyDlvqrnjq/mr4/kuIDmnaHmlbDmja5cblx0XHRcdHJlbGF0ZWRSZWNvcmRMaXN0LmZvckVhY2ggKHJlbGF0ZWRPYmopLT5cblx0XHRcdFx0IyDmlbTlkIhmaWVsZHPmlbDmja5cblx0XHRcdFx0ZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhIHJlbGF0ZWRPYmoscmVsYXRlZE9iak5hbWVcblx0XHRcdFx0IyDmiorkuIDmnaHorrDlvZXmj5LlhaXliLDlr7nosaHmlbDnu4TkuK1cblx0XHRcdFx0cmVsYXRlZFRhYmxlRGF0YS5wdXNoIGZpZWxkc0RhdGFcblxuXHRcdCMg5oqK5LiA5Liq5a2Q6KGo55qE5omA5pyJ5pWw5o2u5o+S5YWl5YiwcmVsYXRlZF9vYmplY3Rz5Lit77yM5YaN5b6q546v5LiL5LiA5LiqXG5cdFx0cmVsYXRlZF9vYmplY3RzW3JlbGF0ZWRPYmpOYW1lXSA9IHJlbGF0ZWRUYWJsZURhdGFcblxuXHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXG5cbiMgQ3JlYXRvci5FeHBvcnQyeG1sKClcbkNyZWF0b3IuRXhwb3J0MnhtbCA9IChvYmpOYW1lLCByZWNvcmRMaXN0KSAtPlxuXHRsb2dnZXIuaW5mbyBcIlJ1biBDcmVhdG9yLkV4cG9ydDJ4bWxcIlxuXG5cdGNvbnNvbGUudGltZSBcIkNyZWF0b3IuRXhwb3J0MnhtbFwiXG5cblx0IyDmtYvor5XmlbDmja5cblx0IyBvYmpOYW1lID0gXCJhcmNoaXZlX3JlY29yZHNcIlxuXG5cdCMg5p+l5om+5a+56LGh5pWw5o2uXG5cdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqTmFtZSlcblx0IyDmtYvor5XmlbDmja5cblx0cmVjb3JkTGlzdCA9IGNvbGxlY3Rpb24uZmluZCh7fSkuZmV0Y2goKVxuXG5cdHJlY29yZExpc3QuZm9yRWFjaCAocmVjb3JkT2JqKS0+XG5cdFx0anNvbk9iaiA9IHt9XG5cdFx0anNvbk9iai5faWQgPSByZWNvcmRPYmouX2lkXG5cblx0XHQjIOaVtOeQhuS4u+ihqOeahEZpZWxkc+aVsOaNrlxuXHRcdGZpZWxkc0RhdGEgPSBfbWl4RmllbGRzRGF0YSByZWNvcmRPYmosb2JqTmFtZVxuXHRcdGpzb25PYmpbb2JqTmFtZV0gPSBmaWVsZHNEYXRhXG5cblx0XHQjIOaVtOeQhuebuOWFs+ihqOaVsOaNrlxuXHRcdHJlbGF0ZWRfb2JqZWN0cyA9IF9taXhSZWxhdGVkRGF0YSByZWNvcmRPYmosb2JqTmFtZVxuXG5cdFx0anNvbk9ialtcInJlbGF0ZWRfb2JqZWN0c1wiXSA9IHJlbGF0ZWRfb2JqZWN0c1xuXG5cdFx0IyDovazkuLp4bWzkv53lrZjmlofku7Zcblx0XHRmaWxlUGF0aCA9IF93cml0ZVhtbEZpbGUganNvbk9iaixvYmpOYW1lXG5cblx0Y29uc29sZS50aW1lRW5kIFwiQ3JlYXRvci5FeHBvcnQyeG1sXCJcblx0cmV0dXJuIGZpbGVQYXRoIiwidmFyIF9taXhGaWVsZHNEYXRhLCBfbWl4UmVsYXRlZERhdGEsIF93cml0ZVhtbEZpbGUsIGZzLCBsb2dnZXIsIG1rZGlycCwgcGF0aCwgeG1sMmpzO1xuXG54bWwyanMgPSByZXF1aXJlKCd4bWwyanMnKTtcblxuZnMgPSByZXF1aXJlKCdmcycpO1xuXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG5ta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKTtcblxubG9nZ2VyID0gbmV3IExvZ2dlcignRXhwb3J0X1RPX1hNTCcpO1xuXG5fd3JpdGVYbWxGaWxlID0gZnVuY3Rpb24oanNvbk9iaiwgb2JqTmFtZSkge1xuICB2YXIgYnVpbGRlciwgZGF5LCBmaWxlQWRkcmVzcywgZmlsZU5hbWUsIGZpbGVQYXRoLCBtb250aCwgbm93LCBzdHJlYW0sIHhtbCwgeWVhcjtcbiAgYnVpbGRlciA9IG5ldyB4bWwyanMuQnVpbGRlcigpO1xuICB4bWwgPSBidWlsZGVyLmJ1aWxkT2JqZWN0KGpzb25PYmopO1xuICBzdHJlYW0gPSBuZXcgQnVmZmVyKHhtbCk7XG4gIG5vdyA9IG5ldyBEYXRlO1xuICB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gIG1vbnRoID0gbm93LmdldE1vbnRoKCkgKyAxO1xuICBkYXkgPSBub3cuZ2V0RGF0ZSgpO1xuICBmaWxlUGF0aCA9IHBhdGguam9pbihfX21ldGVvcl9ib290c3RyYXBfXy5zZXJ2ZXJEaXIsICcuLi8uLi8uLi9leHBvcnQvJyArIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGRheSArICcvJyArIG9iak5hbWUpO1xuICBmaWxlTmFtZSA9IChqc29uT2JqICE9IG51bGwgPyBqc29uT2JqLl9pZCA6IHZvaWQgMCkgKyBcIi54bWxcIjtcbiAgZmlsZUFkZHJlc3MgPSBwYXRoLmpvaW4oZmlsZVBhdGgsIGZpbGVOYW1lKTtcbiAgaWYgKCFmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSkge1xuICAgIG1rZGlycC5zeW5jKGZpbGVQYXRoKTtcbiAgfVxuICBmcy53cml0ZUZpbGUoZmlsZUFkZHJlc3MsIHN0cmVhbSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgcmV0dXJuIGxvZ2dlci5lcnJvcihqc29uT2JqLl9pZCArIFwi5YaZ5YWleG1s5paH5Lu25aSx6LSlXCIsIGVycik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZpbGVQYXRoO1xufTtcblxuX21peEZpZWxkc0RhdGEgPSBmdW5jdGlvbihvYmosIG9iak5hbWUpIHtcbiAgdmFyIGpzb25PYmosIG1peEJvb2wsIG1peERhdGUsIG1peERlZmF1bHQsIG9iakZpZWxkcywgcmVmO1xuICBqc29uT2JqID0ge307XG4gIG9iakZpZWxkcyA9IHR5cGVvZiBDcmVhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmIENyZWF0b3IgIT09IG51bGwgPyAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqTmFtZSkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwIDogdm9pZCAwO1xuICBtaXhEZWZhdWx0ID0gZnVuY3Rpb24oZmllbGRfbmFtZSkge1xuICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gb2JqW2ZpZWxkX25hbWVdIHx8IFwiXCI7XG4gIH07XG4gIG1peERhdGUgPSBmdW5jdGlvbihmaWVsZF9uYW1lLCB0eXBlKSB7XG4gICAgdmFyIGRhdGUsIGRhdGVTdHIsIGZvcm1hdDtcbiAgICBkYXRlID0gb2JqW2ZpZWxkX25hbWVdO1xuICAgIGlmICh0eXBlID09PSBcImRhdGVcIikge1xuICAgICAgZm9ybWF0ID0gXCJZWVlZLU1NLUREXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvcm1hdCA9IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiO1xuICAgIH1cbiAgICBpZiAoKGRhdGUgIT0gbnVsbCkgJiYgKGZvcm1hdCAhPSBudWxsKSkge1xuICAgICAgZGF0ZVN0ciA9IG1vbWVudChkYXRlKS5mb3JtYXQoZm9ybWF0KTtcbiAgICB9XG4gICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBkYXRlU3RyIHx8IFwiXCI7XG4gIH07XG4gIG1peEJvb2wgPSBmdW5jdGlvbihmaWVsZF9uYW1lKSB7XG4gICAgaWYgKG9ialtmaWVsZF9uYW1lXSA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuaYr1wiO1xuICAgIH0gZWxzZSBpZiAob2JqW2ZpZWxkX25hbWVdID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuWQplwiO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IFwiXCI7XG4gICAgfVxuICB9O1xuICBfLmVhY2gob2JqRmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIHN3aXRjaCAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnR5cGUgOiB2b2lkIDApIHtcbiAgICAgIGNhc2UgXCJkYXRlXCI6XG4gICAgICBjYXNlIFwiZGF0ZXRpbWVcIjpcbiAgICAgICAgcmV0dXJuIG1peERhdGUoZmllbGRfbmFtZSwgZmllbGQudHlwZSk7XG4gICAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgICByZXR1cm4gbWl4Qm9vbChmaWVsZF9uYW1lKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBtaXhEZWZhdWx0KGZpZWxkX25hbWUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBqc29uT2JqO1xufTtcblxuX21peFJlbGF0ZWREYXRhID0gZnVuY3Rpb24ob2JqLCBvYmpOYW1lKSB7XG4gIHZhciByZWxhdGVkT2JqTmFtZXMsIHJlbGF0ZWRfb2JqZWN0cztcbiAgcmVsYXRlZF9vYmplY3RzID0ge307XG4gIHJlbGF0ZWRPYmpOYW1lcyA9IHR5cGVvZiBDcmVhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmIENyZWF0b3IgIT09IG51bGwgPyBDcmVhdG9yLmdldEFsbFJlbGF0ZWRPYmplY3RzKG9iak5hbWUpIDogdm9pZCAwO1xuICByZWxhdGVkT2JqTmFtZXMuZm9yRWFjaChmdW5jdGlvbihyZWxhdGVkT2JqTmFtZSkge1xuICAgIHZhciBmaWVsZHMsIG9iajEsIHJlZiwgcmVsYXRlZENvbGxlY3Rpb24sIHJlbGF0ZWRSZWNvcmRMaXN0LCByZWxhdGVkVGFibGVEYXRhLCByZWxhdGVkX2ZpZWxkX25hbWU7XG4gICAgcmVsYXRlZFRhYmxlRGF0YSA9IFtdO1xuICAgIGlmIChyZWxhdGVkT2JqTmFtZSA9PT0gXCJjbXNfZmlsZXNcIikge1xuICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gXCJwYXJlbnQuaWRzXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpZWxkcyA9IHR5cGVvZiBDcmVhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmIENyZWF0b3IgIT09IG51bGwgPyAocmVmID0gQ3JlYXRvci5PYmplY3RzW3JlbGF0ZWRPYmpOYW1lXSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSBcIlwiO1xuICAgICAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgICAgaWYgKChmaWVsZCAhPSBudWxsID8gZmllbGQucmVmZXJlbmNlX3RvIDogdm9pZCAwKSA9PT0gb2JqTmFtZSkge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX2ZpZWxkX25hbWUgPSBmaWVsZF9uYW1lO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgICAgcmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iak5hbWUpO1xuICAgICAgcmVsYXRlZFJlY29yZExpc3QgPSByZWxhdGVkQ29sbGVjdGlvbi5maW5kKChcbiAgICAgICAgb2JqMSA9IHt9LFxuICAgICAgICBvYmoxW1wiXCIgKyByZWxhdGVkX2ZpZWxkX25hbWVdID0gb2JqLl9pZCxcbiAgICAgICAgb2JqMVxuICAgICAgKSkuZmV0Y2goKTtcbiAgICAgIHJlbGF0ZWRSZWNvcmRMaXN0LmZvckVhY2goZnVuY3Rpb24ocmVsYXRlZE9iaikge1xuICAgICAgICB2YXIgZmllbGRzRGF0YTtcbiAgICAgICAgZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhKHJlbGF0ZWRPYmosIHJlbGF0ZWRPYmpOYW1lKTtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRUYWJsZURhdGEucHVzaChmaWVsZHNEYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzW3JlbGF0ZWRPYmpOYW1lXSA9IHJlbGF0ZWRUYWJsZURhdGE7XG4gIH0pO1xuICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xufTtcblxuQ3JlYXRvci5FeHBvcnQyeG1sID0gZnVuY3Rpb24ob2JqTmFtZSwgcmVjb3JkTGlzdCkge1xuICB2YXIgY29sbGVjdGlvbjtcbiAgbG9nZ2VyLmluZm8oXCJSdW4gQ3JlYXRvci5FeHBvcnQyeG1sXCIpO1xuICBjb25zb2xlLnRpbWUoXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIik7XG4gIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqTmFtZSk7XG4gIHJlY29yZExpc3QgPSBjb2xsZWN0aW9uLmZpbmQoe30pLmZldGNoKCk7XG4gIHJlY29yZExpc3QuZm9yRWFjaChmdW5jdGlvbihyZWNvcmRPYmopIHtcbiAgICB2YXIgZmllbGRzRGF0YSwgZmlsZVBhdGgsIGpzb25PYmosIHJlbGF0ZWRfb2JqZWN0cztcbiAgICBqc29uT2JqID0ge307XG4gICAganNvbk9iai5faWQgPSByZWNvcmRPYmouX2lkO1xuICAgIGZpZWxkc0RhdGEgPSBfbWl4RmllbGRzRGF0YShyZWNvcmRPYmosIG9iak5hbWUpO1xuICAgIGpzb25PYmpbb2JqTmFtZV0gPSBmaWVsZHNEYXRhO1xuICAgIHJlbGF0ZWRfb2JqZWN0cyA9IF9taXhSZWxhdGVkRGF0YShyZWNvcmRPYmosIG9iak5hbWUpO1xuICAgIGpzb25PYmpbXCJyZWxhdGVkX29iamVjdHNcIl0gPSByZWxhdGVkX29iamVjdHM7XG4gICAgcmV0dXJuIGZpbGVQYXRoID0gX3dyaXRlWG1sRmlsZShqc29uT2JqLCBvYmpOYW1lKTtcbiAgfSk7XG4gIGNvbnNvbGUudGltZUVuZChcIkNyZWF0b3IuRXhwb3J0MnhtbFwiKTtcbiAgcmV0dXJuIGZpbGVQYXRoO1xufTtcbiIsIk1ldGVvci5tZXRob2RzIFxuXHRyZWxhdGVkX29iamVjdHNfcmVjb3JkczogKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCktPlxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXG5cdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJcblx0XHRcdHNlbGVjdG9yID0ge1wibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZH1cblx0XHRlbHNlXG5cdFx0XHRzZWxlY3RvciA9IHtzcGFjZTogc3BhY2VJZH1cblx0XHRcblx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdCMg6ZmE5Lu255qE5YWz6IGU5pCc57Si5p2h5Lu25piv5a6a5q2755qEXG5cdFx0XHRzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWVcblx0XHRcdHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdXG5cdFx0ZWxzZVxuXHRcdFx0c2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZFxuXG5cdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0XHRpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLmFsbG93UmVhZFxuXHRcdFx0c2VsZWN0b3Iub3duZXIgPSB1c2VySWRcblx0XHRcblx0XHRyZWxhdGVkX3JlY29yZHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvcilcblx0XHRyZXR1cm4gcmVsYXRlZF9yZWNvcmRzLmNvdW50KCkiLCJNZXRlb3IubWV0aG9kcyh7XG4gIHJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpIHtcbiAgICB2YXIgcGVybWlzc2lvbnMsIHJlbGF0ZWRfcmVjb3Jkcywgc2VsZWN0b3IsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiKSB7XG4gICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgXCJtZXRhZGF0YS5zcGFjZVwiOiBzcGFjZUlkXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgICBzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWU7XG4gICAgICBzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZDtcbiAgICB9XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy5hbGxvd1JlYWQpIHtcbiAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICAgIH1cbiAgICByZWxhdGVkX3JlY29yZHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlbGF0ZWRfcmVjb3Jkcy5jb3VudCgpO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdGdldFBlbmRpbmdTcGFjZUluZm86IChpbnZpdGVySWQsIHNwYWNlSWQpLT5cblx0XHRpbnZpdGVyTmFtZSA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogaW52aXRlcklkfSkubmFtZVxuXHRcdHNwYWNlTmFtZSA9IGRiLnNwYWNlcy5maW5kT25lKHtfaWQ6IHNwYWNlSWR9KS5uYW1lXG5cblx0XHRyZXR1cm4ge2ludml0ZXI6IGludml0ZXJOYW1lLCBzcGFjZTogc3BhY2VOYW1lfVxuXG5cdHJlZnVzZUpvaW5TcGFjZTogKF9pZCktPlxuXHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogX2lkfSx7JHNldDoge2ludml0ZV9zdGF0ZTogXCJyZWZ1c2VkXCJ9fSlcblxuXHRhY2NlcHRKb2luU3BhY2U6IChfaWQpLT5cblx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IF9pZH0seyRzZXQ6IHtpbnZpdGVfc3RhdGU6IFwiYWNjZXB0ZWRcIiwgdXNlcl9hY2NlcHRlZDogdHJ1ZX19KVxuXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGdldFBlbmRpbmdTcGFjZUluZm86IGZ1bmN0aW9uKGludml0ZXJJZCwgc3BhY2VJZCkge1xuICAgIHZhciBpbnZpdGVyTmFtZSwgc3BhY2VOYW1lO1xuICAgIGludml0ZXJOYW1lID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IGludml0ZXJJZFxuICAgIH0pLm5hbWU7XG4gICAgc3BhY2VOYW1lID0gZGIuc3BhY2VzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBzcGFjZUlkXG4gICAgfSkubmFtZTtcbiAgICByZXR1cm4ge1xuICAgICAgaW52aXRlcjogaW52aXRlck5hbWUsXG4gICAgICBzcGFjZTogc3BhY2VOYW1lXG4gICAgfTtcbiAgfSxcbiAgcmVmdXNlSm9pblNwYWNlOiBmdW5jdGlvbihfaWQpIHtcbiAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IF9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgaW52aXRlX3N0YXRlOiBcInJlZnVzZWRcIlxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBhY2NlcHRKb2luU3BhY2U6IGZ1bmN0aW9uKF9pZCkge1xuICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBpbnZpdGVfc3RhdGU6IFwiYWNjZXB0ZWRcIixcbiAgICAgICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoIFwiY3JlYXRvcl9vYmplY3RfcmVjb3JkXCIsIChvYmplY3RfbmFtZSwgaWQsIHNwYWNlX2lkKS0+XG5cdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKVxuXHRpZiBjb2xsZWN0aW9uXG5cdFx0cmV0dXJuIGNvbGxlY3Rpb24uZmluZCh7X2lkOiBpZH0pXG5cbiIsIk1ldGVvci5wdWJsaXNoKFwiY3JlYXRvcl9vYmplY3RfcmVjb3JkXCIsIGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBpZCwgc3BhY2VfaWQpIHtcbiAgdmFyIGNvbGxlY3Rpb247XG4gIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKTtcbiAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5maW5kKHtcbiAgICAgIF9pZDogaWRcbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IucHVibGlzaENvbXBvc2l0ZSBcInN0ZWVkb3Nfb2JqZWN0X3RhYnVsYXJcIiwgKHRhYmxlTmFtZSwgaWRzLCBmaWVsZHMsIHNwYWNlSWQpLT5cblx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdGNoZWNrKHRhYmxlTmFtZSwgU3RyaW5nKTtcblx0Y2hlY2soaWRzLCBBcnJheSk7XG5cdGNoZWNrKGZpZWxkcywgTWF0Y2guT3B0aW9uYWwoT2JqZWN0KSk7XG5cblx0X29iamVjdF9uYW1lID0gdGFibGVOYW1lLnJlcGxhY2UoXCJjcmVhdG9yX1wiLFwiXCIpXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfb2JqZWN0X25hbWUsIHNwYWNlSWQpXG5cblx0aWYgc3BhY2VJZFxuXHRcdF9vYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0TmFtZShfb2JqZWN0KVxuXG5cdG9iamVjdF9jb2xsZWNpdG9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKF9vYmplY3RfbmFtZSlcblxuXG5cdF9maWVsZHMgPSBfb2JqZWN0Py5maWVsZHNcblx0aWYgIV9maWVsZHMgfHwgIW9iamVjdF9jb2xsZWNpdG9uXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdHJlZmVyZW5jZV9maWVsZHMgPSBfLmZpbHRlciBfZmllbGRzLCAoZiktPlxuXHRcdHJldHVybiBfLmlzRnVuY3Rpb24oZi5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkoZi5yZWZlcmVuY2VfdG8pXG5cblx0c2VsZiA9IHRoaXNcblxuXHRzZWxmLnVuYmxvY2soKTtcblxuXHRpZiByZWZlcmVuY2VfZmllbGRzLmxlbmd0aCA+IDBcblx0XHRkYXRhID0ge1xuXHRcdFx0ZmluZDogKCktPlxuXHRcdFx0XHRzZWxmLnVuYmxvY2soKTtcblx0XHRcdFx0ZmllbGRfa2V5cyA9IHt9XG5cdFx0XHRcdF8uZWFjaCBfLmtleXMoZmllbGRzKSwgKGYpLT5cblx0XHRcdFx0XHR1bmxlc3MgL1xcdysoXFwuXFwkKXsxfVxcdz8vLnRlc3QoZilcblx0XHRcdFx0XHRcdGZpZWxkX2tleXNbZl0gPSAxXG5cdFx0XHRcdFxuXHRcdFx0XHRyZXR1cm4gb2JqZWN0X2NvbGxlY2l0b24uZmluZCh7X2lkOiB7JGluOiBpZHN9fSwge2ZpZWxkczogZmllbGRfa2V5c30pO1xuXHRcdH1cblxuXHRcdGRhdGEuY2hpbGRyZW4gPSBbXVxuXG5cdFx0a2V5cyA9IF8ua2V5cyhmaWVsZHMpXG5cblx0XHRpZiBrZXlzLmxlbmd0aCA8IDFcblx0XHRcdGtleXMgPSBfLmtleXMoX2ZpZWxkcylcblxuXHRcdF9rZXlzID0gW11cblxuXHRcdGtleXMuZm9yRWFjaCAoa2V5KS0+XG5cdFx0XHRpZiBfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddXG5cdFx0XHRcdF9rZXlzID0gX2tleXMuY29uY2F0KF8ubWFwKF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ10sIChrKS0+XG5cdFx0XHRcdFx0cmV0dXJuIGtleSArICcuJyArIGtcblx0XHRcdFx0KSlcblx0XHRcdF9rZXlzLnB1c2goa2V5KVxuXG5cdFx0X2tleXMuZm9yRWFjaCAoa2V5KS0+XG5cdFx0XHRyZWZlcmVuY2VfZmllbGQgPSBfZmllbGRzW2tleV1cblxuXHRcdFx0aWYgcmVmZXJlbmNlX2ZpZWxkICYmIChfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykgfHwgIV8uaXNFbXB0eShyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSkgICMgYW5kIENyZWF0b3IuQ29sbGVjdGlvbnNbcmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90b11cblx0XHRcdFx0ZGF0YS5jaGlsZHJlbi5wdXNoIHtcblx0XHRcdFx0XHRmaW5kOiAocGFyZW50KSAtPlxuXHRcdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRcdHNlbGYudW5ibG9jaygpO1xuXG5cdFx0XHRcdFx0XHRcdHF1ZXJ5ID0ge31cblxuXHRcdFx0XHRcdFx0XHQjIOihqOagvOWtkOWtl+auteeJueauiuWkhOeQhlxuXHRcdFx0XHRcdFx0XHRpZiAvXFx3KyhcXC5cXCRcXC4pezF9XFx3Ky8udGVzdChrZXkpXG5cdFx0XHRcdFx0XHRcdFx0cF9rID0ga2V5LnJlcGxhY2UoLyhcXHcrKVxcLlxcJFxcLlxcdysvaWcsIFwiJDFcIilcblx0XHRcdFx0XHRcdFx0XHRzX2sgPSBrZXkucmVwbGFjZSgvXFx3K1xcLlxcJFxcLihcXHcrKS9pZywgXCIkMVwiKVxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV9pZHMgPSBwYXJlbnRbcF9rXS5nZXRQcm9wZXJ0eShzX2spXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfaWRzID0ga2V5LnNwbGl0KCcuJykucmVkdWNlIChvLCB4KSAtPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvP1t4XVxuXHRcdFx0XHRcdFx0XHRcdCwgcGFyZW50XG5cblx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvKClcblxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkocmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRcdGlmIF8uaXNPYmplY3QocmVmZXJlbmNlX2lkcykgJiYgIV8uaXNBcnJheShyZWZlcmVuY2VfaWRzKVxuXHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX2lkcy5vXG5cdFx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfaWRzID0gcmVmZXJlbmNlX2lkcy5pZHMgfHwgW11cblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gW11cblxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkocmVmZXJlbmNlX2lkcylcblx0XHRcdFx0XHRcdFx0XHRxdWVyeS5faWQgPSB7JGluOiByZWZlcmVuY2VfaWRzfVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0cXVlcnkuX2lkID0gcmVmZXJlbmNlX2lkc1xuXG5cdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90b19vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWZlcmVuY2VfdG8sIHNwYWNlSWQpXG5cblx0XHRcdFx0XHRcdFx0bmFtZV9maWVsZF9rZXkgPSByZWZlcmVuY2VfdG9fb2JqZWN0Lk5BTUVfRklFTERfS0VZXG5cblx0XHRcdFx0XHRcdFx0Y2hpbGRyZW5fZmllbGRzID0ge19pZDogMSwgc3BhY2U6IDF9XG5cblx0XHRcdFx0XHRcdFx0aWYgbmFtZV9maWVsZF9rZXlcblx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbl9maWVsZHNbbmFtZV9maWVsZF9rZXldID0gMVxuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kKHF1ZXJ5LCB7XG5cdFx0XHRcdFx0XHRcdFx0ZmllbGRzOiBjaGlsZHJlbl9maWVsZHNcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlZmVyZW5jZV90bywgcGFyZW50LCBlKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gW11cblx0XHRcdFx0fVxuXG5cdFx0cmV0dXJuIGRhdGFcblx0ZWxzZVxuXHRcdHJldHVybiB7XG5cdFx0XHRmaW5kOiAoKS0+XG5cdFx0XHRcdHNlbGYudW5ibG9jaygpO1xuXHRcdFx0XHRyZXR1cm4gb2JqZWN0X2NvbGxlY2l0b24uZmluZCh7X2lkOiB7JGluOiBpZHN9fSwge2ZpZWxkczogZmllbGRzfSlcblx0XHR9O1xuXG4iLCJNZXRlb3IucHVibGlzaENvbXBvc2l0ZShcInN0ZWVkb3Nfb2JqZWN0X3RhYnVsYXJcIiwgZnVuY3Rpb24odGFibGVOYW1lLCBpZHMsIGZpZWxkcywgc3BhY2VJZCkge1xuICB2YXIgX2ZpZWxkcywgX2tleXMsIF9vYmplY3QsIF9vYmplY3RfbmFtZSwgZGF0YSwga2V5cywgb2JqZWN0X2NvbGxlY2l0b24sIHJlZmVyZW5jZV9maWVsZHMsIHNlbGY7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIGNoZWNrKHRhYmxlTmFtZSwgU3RyaW5nKTtcbiAgY2hlY2soaWRzLCBBcnJheSk7XG4gIGNoZWNrKGZpZWxkcywgTWF0Y2guT3B0aW9uYWwoT2JqZWN0KSk7XG4gIF9vYmplY3RfbmFtZSA9IHRhYmxlTmFtZS5yZXBsYWNlKFwiY3JlYXRvcl9cIiwgXCJcIik7XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfb2JqZWN0X25hbWUsIHNwYWNlSWQpO1xuICBpZiAoc3BhY2VJZCkge1xuICAgIF9vYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0TmFtZShfb2JqZWN0KTtcbiAgfVxuICBvYmplY3RfY29sbGVjaXRvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihfb2JqZWN0X25hbWUpO1xuICBfZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIGlmICghX2ZpZWxkcyB8fCAhb2JqZWN0X2NvbGxlY2l0b24pIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJlZmVyZW5jZV9maWVsZHMgPSBfLmZpbHRlcihfZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbihmLnJlZmVyZW5jZV90bykgfHwgIV8uaXNFbXB0eShmLnJlZmVyZW5jZV90byk7XG4gIH0pO1xuICBzZWxmID0gdGhpcztcbiAgc2VsZi51bmJsb2NrKCk7XG4gIGlmIChyZWZlcmVuY2VfZmllbGRzLmxlbmd0aCA+IDApIHtcbiAgICBkYXRhID0ge1xuICAgICAgZmluZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmaWVsZF9rZXlzO1xuICAgICAgICBzZWxmLnVuYmxvY2soKTtcbiAgICAgICAgZmllbGRfa2V5cyA9IHt9O1xuICAgICAgICBfLmVhY2goXy5rZXlzKGZpZWxkcyksIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICBpZiAoIS9cXHcrKFxcLlxcJCl7MX1cXHc/Ly50ZXN0KGYpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmllbGRfa2V5c1tmXSA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe1xuICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgJGluOiBpZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkX2tleXNcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBkYXRhLmNoaWxkcmVuID0gW107XG4gICAga2V5cyA9IF8ua2V5cyhmaWVsZHMpO1xuICAgIGlmIChrZXlzLmxlbmd0aCA8IDEpIHtcbiAgICAgIGtleXMgPSBfLmtleXMoX2ZpZWxkcyk7XG4gICAgfVxuICAgIF9rZXlzID0gW107XG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ10pIHtcbiAgICAgICAgX2tleXMgPSBfa2V5cy5jb25jYXQoXy5tYXAoX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXSwgZnVuY3Rpb24oaykge1xuICAgICAgICAgIHJldHVybiBrZXkgKyAnLicgKyBrO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX2tleXMucHVzaChrZXkpO1xuICAgIH0pO1xuICAgIF9rZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgcmVmZXJlbmNlX2ZpZWxkO1xuICAgICAgcmVmZXJlbmNlX2ZpZWxkID0gX2ZpZWxkc1trZXldO1xuICAgICAgaWYgKHJlZmVyZW5jZV9maWVsZCAmJiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykpKSB7XG4gICAgICAgIHJldHVybiBkYXRhLmNoaWxkcmVuLnB1c2goe1xuICAgICAgICAgIGZpbmQ6IGZ1bmN0aW9uKHBhcmVudCkge1xuICAgICAgICAgICAgdmFyIGNoaWxkcmVuX2ZpZWxkcywgZSwgbmFtZV9maWVsZF9rZXksIHBfaywgcXVlcnksIHJlZmVyZW5jZV9pZHMsIHJlZmVyZW5jZV90bywgcmVmZXJlbmNlX3RvX29iamVjdCwgc19rO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICAgICAgICAgIHF1ZXJ5ID0ge307XG4gICAgICAgICAgICAgIGlmICgvXFx3KyhcXC5cXCRcXC4pezF9XFx3Ky8udGVzdChrZXkpKSB7XG4gICAgICAgICAgICAgICAgcF9rID0ga2V5LnJlcGxhY2UoLyhcXHcrKVxcLlxcJFxcLlxcdysvaWcsIFwiJDFcIik7XG4gICAgICAgICAgICAgICAgc19rID0ga2V5LnJlcGxhY2UoL1xcdytcXC5cXCRcXC4oXFx3KykvaWcsIFwiJDFcIik7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlX2lkcyA9IHBhcmVudFtwX2tdLmdldFByb3BlcnR5KHNfayk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlX2lkcyA9IGtleS5zcGxpdCgnLicpLnJlZHVjZShmdW5jdGlvbihvLCB4KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbyAhPSBudWxsID8gb1t4XSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICB9LCBwYXJlbnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90bygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChfLmlzQXJyYXkocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIGlmIChfLmlzT2JqZWN0KHJlZmVyZW5jZV9pZHMpICYmICFfLmlzQXJyYXkocmVmZXJlbmNlX2lkcykpIHtcbiAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9pZHMubztcbiAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZV9pZHMgPSByZWZlcmVuY2VfaWRzLmlkcyB8fCBbXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpKSB7XG4gICAgICAgICAgICAgICAgcXVlcnkuX2lkID0ge1xuICAgICAgICAgICAgICAgICAgJGluOiByZWZlcmVuY2VfaWRzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBxdWVyeS5faWQgPSByZWZlcmVuY2VfaWRzO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlZmVyZW5jZV90b19vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWZlcmVuY2VfdG8sIHNwYWNlSWQpO1xuICAgICAgICAgICAgICBuYW1lX2ZpZWxkX2tleSA9IHJlZmVyZW5jZV90b19vYmplY3QuTkFNRV9GSUVMRF9LRVk7XG4gICAgICAgICAgICAgIGNoaWxkcmVuX2ZpZWxkcyA9IHtcbiAgICAgICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICAgICAgc3BhY2U6IDFcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgaWYgKG5hbWVfZmllbGRfa2V5KSB7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW5fZmllbGRzW25hbWVfZmllbGRfa2V5XSA9IDE7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8sIHNwYWNlSWQpLmZpbmQocXVlcnksIHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IGNoaWxkcmVuX2ZpZWxkc1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVmZXJlbmNlX3RvLCBwYXJlbnQsIGUpO1xuICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgZmluZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYudW5ibG9jaygpO1xuICAgICAgICByZXR1cm4gb2JqZWN0X2NvbGxlY2l0b24uZmluZCh7XG4gICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAkaW46IGlkc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogZmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggXCJvYmplY3RfbGlzdHZpZXdzXCIsIChvYmplY3RfbmFtZSwgc3BhY2VJZCktPlxuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBzcGFjZTogc3BhY2VJZCAsXCIkb3JcIjpbe293bmVyOiB1c2VySWR9LCB7c2hhcmVkOiB0cnVlfV19KSIsIk1ldGVvci5wdWJsaXNoIFwidXNlcl90YWJ1bGFyX3NldHRpbmdzXCIsIChvYmplY3RfbmFtZSktPlxuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZCh7b2JqZWN0X25hbWU6IHskaW46IG9iamVjdF9uYW1lfSwgcmVjb3JkX2lkOiB7JGluOiBbXCJvYmplY3RfbGlzdHZpZXdzXCIsIFwib2JqZWN0X2dyaWR2aWV3c1wiXX0sIG93bmVyOiB1c2VySWR9KVxuIiwiTWV0ZW9yLnB1Ymxpc2ggXCJyZWxhdGVkX29iamVjdHNfcmVjb3Jkc1wiLCAob2JqZWN0X25hbWUsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZUlkKS0+XG5cdHVzZXJJZCA9IHRoaXMudXNlcklkXG5cdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXG5cdFx0c2VsZWN0b3IgPSB7XCJtZXRhZGF0YS5zcGFjZVwiOiBzcGFjZUlkfVxuXHRlbHNlXG5cdFx0c2VsZWN0b3IgPSB7c3BhY2U6IHNwYWNlSWR9XG5cdFxuXHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHQjIOmZhOS7tueahOWFs+iBlOaQnOe0ouadoeS7tuaYr+Wumuatu+eahFxuXHRcdHNlbGVjdG9yW1wicGFyZW50Lm9cIl0gPSBvYmplY3RfbmFtZVxuXHRcdHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdXG5cdGVsc2Vcblx0XHRzZWxlY3RvcltyZWxhdGVkX2ZpZWxkX25hbWVdID0gcmVjb3JkX2lkXG5cblx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcblx0XHRzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxuXHRcblx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKSIsIk1ldGVvci5wdWJsaXNoKFwicmVsYXRlZF9vYmplY3RzX3JlY29yZHNcIiwgZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZUlkKSB7XG4gIHZhciBwZXJtaXNzaW9ucywgc2VsZWN0b3IsIHVzZXJJZDtcbiAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpIHtcbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIFwibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH07XG4gIH1cbiAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICBzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWU7XG4gICAgc2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF07XG4gIH0gZWxzZSB7XG4gICAgc2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZDtcbiAgfVxuICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy5hbGxvd1JlYWQpIHtcbiAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZDtcbiAgfVxuICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCAnc3BhY2VfdXNlcl9pbmZvJywgKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZCh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0pIiwiXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblxuXHRNZXRlb3IucHVibGlzaCAnY29udGFjdHNfdmlld19saW1pdHMnLCAoc3BhY2VJZCktPlxuXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0XHR1bmxlc3Mgc3BhY2VJZFxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdFx0c2VsZWN0b3IgPVxuXHRcdFx0c3BhY2U6IHNwYWNlSWRcblx0XHRcdGtleTogJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJ1xuXG5cdFx0cmV0dXJuIGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoc2VsZWN0b3IpIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnY29udGFjdHNfdmlld19saW1pdHMnLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIHNlbGVjdG9yO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIGtleTogJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJ1xuICAgIH07XG4gICAgcmV0dXJuIGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoc2VsZWN0b3IpO1xuICB9KTtcbn1cbiIsIlxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cblx0TWV0ZW9yLnB1Ymxpc2ggJ2NvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzJywgKHNwYWNlSWQpLT5cblxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdFx0dW5sZXNzIHNwYWNlSWRcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRcdHNlbGVjdG9yID1cblx0XHRcdHNwYWNlOiBzcGFjZUlkXG5cdFx0XHRrZXk6ICdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycydcblxuXHRcdHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKSIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ2NvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBzZWxlY3RvcjtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBrZXk6ICdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycydcbiAgICB9O1xuICAgIHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKTtcbiAgfSk7XG59XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0TWV0ZW9yLnB1Ymxpc2ggJ3NwYWNlX25lZWRfdG9fY29uZmlybScsICgpLT5cblx0XHR1c2VySWQgPSB0aGlzLnVzZXJJZFxuXHRcdHJldHVybiBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VySWQsIGludml0ZV9zdGF0ZTogXCJwZW5kaW5nXCJ9KSIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ3NwYWNlX25lZWRfdG9fY29uZmlybScsIGZ1bmN0aW9uKCkge1xuICAgIHZhciB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgaW52aXRlX3N0YXRlOiBcInBlbmRpbmdcIlxuICAgIH0pO1xuICB9KTtcbn1cbiIsInBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge31cblxucGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rmxvd1Blcm1pc3Npb25zID0gKGZsb3dfaWQsIHVzZXJfaWQpIC0+XG5cdCMg5qC55o2uOmZsb3dfaWTmn6XliLDlr7nlupTnmoRmbG93XG5cdGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZClcblx0c3BhY2VfaWQgPSBmbG93LnNwYWNlXG5cdCMg5qC55o2uc3BhY2VfaWTlkow6dXNlcl9pZOWIsG9yZ2FuaXphdGlvbnPooajkuK3mn6XliLDnlKjmiLfmiYDlsZ7miYDmnInnmoRvcmdfaWTvvIjljIXmi6zkuIrnuqfnu4RJRO+8iVxuXHRvcmdfaWRzID0gbmV3IEFycmF5XG5cdG9yZ2FuaXphdGlvbnMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuXHRcdHNwYWNlOiBzcGFjZV9pZCwgdXNlcnM6IHVzZXJfaWQgfSwgeyBmaWVsZHM6IHsgcGFyZW50czogMSB9IH0pLmZldGNoKClcblx0Xy5lYWNoKG9yZ2FuaXphdGlvbnMsIChvcmcpIC0+XG5cdFx0b3JnX2lkcy5wdXNoKG9yZy5faWQpXG5cdFx0aWYgb3JnLnBhcmVudHNcblx0XHRcdF8uZWFjaChvcmcucGFyZW50cywgKHBhcmVudF9pZCkgLT5cblx0XHRcdFx0b3JnX2lkcy5wdXNoKHBhcmVudF9pZClcblx0XHRcdClcblx0KVxuXHRvcmdfaWRzID0gXy51bmlxKG9yZ19pZHMpXG5cdG15X3Blcm1pc3Npb25zID0gbmV3IEFycmF5XG5cdGlmIGZsb3cucGVybXNcblx0XHQjIOWIpOaWrWZsb3cucGVybXMudXNlcnNfY2FuX2FkbWlu5Lit5piv5ZCm5YyF5ZCr5b2T5YmN55So5oi377yMXG5cdFx0IyDmiJbogIVmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZOaYr+WQpuWMheWQqzTmraXlvpfliLDnmoRvcmdfaWTmlbDnu4TkuK3nmoTku7vkvZXkuIDkuKrvvIxcblx0XHQjIOiLpeaYr++8jOWImeWcqOi/lOWbnueahOaVsOe7hOS4reWKoOS4imFkZFxuXHRcdGlmIGZsb3cucGVybXMudXNlcnNfY2FuX2FkZFxuXHRcdFx0dXNlcnNfY2FuX2FkZCA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkZFxuXHRcdFx0aWYgdXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VyX2lkKVxuXHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpXG5cblx0XHRpZiBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZFxuXHRcdFx0b3Jnc19jYW5fYWRkID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGRcblx0XHRcdF8uZWFjaChvcmdfaWRzLCAob3JnX2lkKSAtPlxuXHRcdFx0XHRpZiBvcmdzX2Nhbl9hZGQuaW5jbHVkZXMob3JnX2lkKVxuXHRcdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJhZGRcIilcblx0XHRcdClcblx0XHQjIOWIpOaWrWZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3LkuK3mmK/lkKbljIXlkKvlvZPliY3nlKjmiLfvvIxcblx0XHQjIOaIluiAhWZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvcuaYr+WQpuWMheWQqzTmraXlvpfliLDnmoRvcmdfaWTmlbDnu4TkuK3nmoTku7vkvZXkuIDkuKrvvIxcblx0XHQjIOiLpeaYr++8jOWImeWcqOi/lOWbnueahOaVsOe7hOS4reWKoOS4im1vbml0b3Jcblx0XHRpZiBmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yXG5cdFx0XHR1c2Vyc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3Jcblx0XHRcdGlmIHVzZXJzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKHVzZXJfaWQpXG5cdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJtb25pdG9yXCIpXG5cblx0XHRpZiBmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3Jcblx0XHRcdG9yZ3NfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3Jcblx0XHRcdF8uZWFjaChvcmdfaWRzLCAob3JnX2lkKSAtPlxuXHRcdFx0XHRpZiBvcmdzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKG9yZ19pZClcblx0XHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKVxuXHRcdFx0KVxuXHRcdCMg5Yik5patZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW7kuK3mmK/lkKbljIXlkKvlvZPliY3nlKjmiLfvvIxcblx0XHQjIOaIluiAhWZsb3cucGVybXMub3Jnc19jYW5fYWRtaW7mmK/lkKbljIXlkKs05q2l5b6X5Yiw55qEb3JnX2lk5pWw57uE5Lit55qE5Lu75L2V5LiA5Liq77yMXG5cdFx0IyDoi6XmmK/vvIzliJnlnKjov5Tlm57nmoTmlbDnu4TkuK3liqDkuIphZG1pblxuXHRcdGlmIGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluXG5cdFx0XHR1c2Vyc19jYW5fYWRtaW4gPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pblxuXHRcdFx0aWYgdXNlcnNfY2FuX2FkbWluLmluY2x1ZGVzKHVzZXJfaWQpXG5cdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKVxuXG5cdFx0aWYgZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pblxuXHRcdFx0b3Jnc19jYW5fYWRtaW4gPSBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluXG5cdFx0XHRfLmVhY2gob3JnX2lkcywgKG9yZ19pZCkgLT5cblx0XHRcdFx0aWYgb3Jnc19jYW5fYWRtaW4uaW5jbHVkZXMob3JnX2lkKVxuXHRcdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKVxuXHRcdFx0KVxuXG5cdG15X3Blcm1pc3Npb25zID0gXy51bmlxKG15X3Blcm1pc3Npb25zKVxuXHRyZXR1cm4gbXlfcGVybWlzc2lvbnMiLCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbnBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge307XG5cbnBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3dQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKGZsb3dfaWQsIHVzZXJfaWQpIHtcbiAgdmFyIGZsb3csIG15X3Blcm1pc3Npb25zLCBvcmdfaWRzLCBvcmdhbml6YXRpb25zLCBvcmdzX2Nhbl9hZGQsIG9yZ3NfY2FuX2FkbWluLCBvcmdzX2Nhbl9tb25pdG9yLCBzcGFjZV9pZCwgdXNlcnNfY2FuX2FkZCwgdXNlcnNfY2FuX2FkbWluLCB1c2Vyc19jYW5fbW9uaXRvcjtcbiAgZmxvdyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyhmbG93X2lkKTtcbiAgc3BhY2VfaWQgPSBmbG93LnNwYWNlO1xuICBvcmdfaWRzID0gbmV3IEFycmF5O1xuICBvcmdhbml6YXRpb25zID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdXNlcnM6IHVzZXJfaWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgcGFyZW50czogMVxuICAgIH1cbiAgfSkuZmV0Y2goKTtcbiAgXy5lYWNoKG9yZ2FuaXphdGlvbnMsIGZ1bmN0aW9uKG9yZykge1xuICAgIG9yZ19pZHMucHVzaChvcmcuX2lkKTtcbiAgICBpZiAob3JnLnBhcmVudHMpIHtcbiAgICAgIHJldHVybiBfLmVhY2gob3JnLnBhcmVudHMsIGZ1bmN0aW9uKHBhcmVudF9pZCkge1xuICAgICAgICByZXR1cm4gb3JnX2lkcy5wdXNoKHBhcmVudF9pZCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBvcmdfaWRzID0gXy51bmlxKG9yZ19pZHMpO1xuICBteV9wZXJtaXNzaW9ucyA9IG5ldyBBcnJheTtcbiAgaWYgKGZsb3cucGVybXMpIHtcbiAgICBpZiAoZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRkKSB7XG4gICAgICB1c2Vyc19jYW5fYWRkID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRkO1xuICAgICAgaWYgKHVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcl9pZCkpIHtcbiAgICAgICAgbXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMub3Jnc19jYW5fYWRkKSB7XG4gICAgICBvcmdzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZDtcbiAgICAgIF8uZWFjaChvcmdfaWRzLCBmdW5jdGlvbihvcmdfaWQpIHtcbiAgICAgICAgaWYgKG9yZ3NfY2FuX2FkZC5pbmNsdWRlcyhvcmdfaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZGRcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvcikge1xuICAgICAgdXNlcnNfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yO1xuICAgICAgaWYgKHVzZXJzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKHVzZXJfaWQpKSB7XG4gICAgICAgIG15X3Blcm1pc3Npb25zLnB1c2goXCJtb25pdG9yXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yKSB7XG4gICAgICBvcmdzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yO1xuICAgICAgXy5lYWNoKG9yZ19pZHMsIGZ1bmN0aW9uKG9yZ19pZCkge1xuICAgICAgICBpZiAob3Jnc19jYW5fbW9uaXRvci5pbmNsdWRlcyhvcmdfaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIG15X3Blcm1pc3Npb25zLnB1c2goXCJtb25pdG9yXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluKSB7XG4gICAgICB1c2Vyc19jYW5fYWRtaW4gPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbjtcbiAgICAgIGlmICh1c2Vyc19jYW5fYWRtaW4uaW5jbHVkZXModXNlcl9pZCkpIHtcbiAgICAgICAgbXlfcGVybWlzc2lvbnMucHVzaChcImFkbWluXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pbikge1xuICAgICAgb3Jnc19jYW5fYWRtaW4gPSBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluO1xuICAgICAgXy5lYWNoKG9yZ19pZHMsIGZ1bmN0aW9uKG9yZ19pZCkge1xuICAgICAgICBpZiAob3Jnc19jYW5fYWRtaW4uaW5jbHVkZXMob3JnX2lkKSkge1xuICAgICAgICAgIHJldHVybiBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBteV9wZXJtaXNzaW9ucyA9IF8udW5pcShteV9wZXJtaXNzaW9ucyk7XG4gIHJldHVybiBteV9wZXJtaXNzaW9ucztcbn07XG4iLCJfZXZhbCA9IHJlcXVpcmUoJ2V2YWwnKVxub2JqZWN0cWwgPSByZXF1aXJlKCdAc3RlZWRvcy9vYmplY3RxbCcpO1xuXG5nZXRPYmplY3RDb25maWcgPSAob2JqZWN0QXBpTmFtZSkgLT5cblx0cmV0dXJuIG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS50b0NvbmZpZygpXG5cbmdldE9iamVjdE5hbWVGaWVsZEtleSA9IChvYmplY3RBcGlOYW1lKSAtPlxuXHRyZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLk5BTUVfRklFTERfS0VZXG5cbmdldFJlbGF0ZWRzID0gKG9iamVjdEFwaU5hbWUpIC0+XG5cdHJldHVybiBNZXRlb3Iud3JhcEFzeW5jKChvYmplY3RBcGlOYW1lLCBjYikgLT5cblx0XHRvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkuZ2V0UmVsYXRlZHMoKS50aGVuIChyZXNvbHZlLCByZWplY3QpIC0+XG5cdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXG5cdFx0KShvYmplY3RBcGlOYW1lKVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge31cblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja19hdXRob3JpemF0aW9uID0gKHJlcSkgLT5cblx0cXVlcnkgPSByZXEucXVlcnlcblx0dXNlcklkID0gcXVlcnlbXCJYLVVzZXItSWRcIl1cblx0YXV0aFRva2VuID0gcXVlcnlbXCJYLUF1dGgtVG9rZW5cIl1cblxuXHRpZiBub3QgdXNlcklkIG9yIG5vdCBhdXRoVG9rZW5cblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblxuXHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXG5cdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuXHRcdF9pZDogdXNlcklkLFxuXHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG5cblx0aWYgbm90IHVzZXJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblxuXHRyZXR1cm4gdXNlclxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlID0gKHNwYWNlX2lkKSAtPlxuXHRzcGFjZSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpXG5cdGlmIG5vdCBzcGFjZVxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwic3BhY2VfaWTmnInor6/miJbmraRzcGFjZeW3sue7j+iiq+WIoOmZpFwiKVxuXHRyZXR1cm4gc3BhY2VcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93ID0gKGZsb3dfaWQpIC0+XG5cdGZsb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZsb3dzLmZpbmRPbmUoZmxvd19pZClcblx0aWYgbm90IGZsb3dcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcImlk5pyJ6K+v5oiW5q2k5rWB56iL5bey57uP6KKr5Yig6ZmkXCIpXG5cdHJldHVybiBmbG93XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyID0gKHNwYWNlX2lkLCB1c2VyX2lkKSAtPlxuXHRzcGFjZV91c2VyID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZV91c2Vycy5maW5kT25lKHsgc3BhY2U6IHNwYWNlX2lkLCB1c2VyOiB1c2VyX2lkIH0pXG5cdGlmIG5vdCBzcGFjZV91c2VyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJ1c2VyX2lk5a+55bqU55qE55So5oi35LiN5bGe5LqO5b2T5YmNc3BhY2VcIilcblx0cmV0dXJuIHNwYWNlX3VzZXJcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXJPcmdJbmZvID0gKHNwYWNlX3VzZXIpIC0+XG5cdGluZm8gPSBuZXcgT2JqZWN0XG5cdGluZm8ub3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb25cblx0b3JnID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vcmdhbml6YXRpb25zLmZpbmRPbmUoc3BhY2VfdXNlci5vcmdhbml6YXRpb24sIHsgZmllbGRzOiB7IG5hbWU6IDEgLCBmdWxsbmFtZTogMSB9IH0pXG5cdGluZm8ub3JnYW5pemF0aW9uX25hbWUgPSBvcmcubmFtZVxuXHRpbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IG9yZy5mdWxsbmFtZVxuXHRyZXR1cm4gaW5mb1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd0VuYWJsZWQgPSAoZmxvdykgLT5cblx0aWYgZmxvdy5zdGF0ZSBpc250IFwiZW5hYmxlZFwiXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvmnKrlkK/nlKgs5pON5L2c5aSx6LSlXCIpXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93U3BhY2VNYXRjaGVkID0gKGZsb3csIHNwYWNlX2lkKSAtPlxuXHRpZiBmbG93LnNwYWNlIGlzbnQgc3BhY2VfaWRcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+WSjOW3peS9nOWMuklE5LiN5Yy56YWNXCIpXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybSA9IChmb3JtX2lkKSAtPlxuXHRmb3JtID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5mb3Jtcy5maW5kT25lKGZvcm1faWQpXG5cdGlmIG5vdCBmb3JtXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+ihqOWNlUlE5pyJ6K+v5oiW5q2k6KGo5Y2V5bey57uP6KKr5Yig6ZmkJylcblxuXHRyZXR1cm4gZm9ybVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldENhdGVnb3J5ID0gKGNhdGVnb3J5X2lkKSAtPlxuXHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5jYXRlZ29yaWVzLmZpbmRPbmUoY2F0ZWdvcnlfaWQpXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY3JlYXRlX2luc3RhbmNlID0gKGluc3RhbmNlX2Zyb21fY2xpZW50LCB1c2VyX2luZm8pIC0+XG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdLCBTdHJpbmdcblx0Y2hlY2sgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSwgU3RyaW5nXG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXSwgU3RyaW5nXG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXSwgW3tvOiBTdHJpbmcsIGlkczogW1N0cmluZ119XVxuXG5cdCMg5qCh6aqM5piv5ZCmcmVjb3Jk5bey57uP5Y+R6LW355qE55Sz6K+36L+Y5Zyo5a6h5om55LitXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tJc0luQXBwcm92YWwoaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdWzBdLCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdKVxuXG5cdHNwYWNlX2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXVxuXHRmbG93X2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdXG5cdHVzZXJfaWQgPSB1c2VyX2luZm8uX2lkXG5cdCMg6I635Y+W5YmN5Y+w5omA5Lyg55qEdHJhY2Vcblx0dHJhY2VfZnJvbV9jbGllbnQgPSBudWxsXG5cdCMg6I635Y+W5YmN5Y+w5omA5Lyg55qEYXBwcm92ZVxuXHRhcHByb3ZlX2Zyb21fY2xpZW50ID0gbnVsbFxuXHRpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXSBhbmQgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1cblx0XHR0cmFjZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdXG5cdFx0aWYgdHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXSBhbmQgdHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXVswXVxuXHRcdFx0YXBwcm92ZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdW1wiYXBwcm92ZXNcIl1bMF1cblxuXHQjIOiOt+WPluS4gOS4qnNwYWNlXG5cdHNwYWNlID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZShzcGFjZV9pZClcblx0IyDojrflj5bkuIDkuKpmbG93XG5cdGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZClcblx0IyDojrflj5bkuIDkuKpzcGFjZeS4i+eahOS4gOS4qnVzZXJcblx0c3BhY2VfdXNlciA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyKHNwYWNlX2lkLCB1c2VyX2lkKVxuXHQjIOiOt+WPlnNwYWNlX3VzZXLmiYDlnKjnmoTpg6jpl6jkv6Hmga9cblx0c3BhY2VfdXNlcl9vcmdfaW5mbyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyhzcGFjZV91c2VyKVxuXHQjIOWIpOaWreS4gOS4qmZsb3fmmK/lkKbkuLrlkK/nlKjnirbmgIFcblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dFbmFibGVkKGZsb3cpXG5cdCMg5Yik5pat5LiA5LiqZmxvd+WSjHNwYWNlX2lk5piv5ZCm5Yy56YWNXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93U3BhY2VNYXRjaGVkKGZsb3csIHNwYWNlX2lkKVxuXG5cdGZvcm0gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZvcm0oZmxvdy5mb3JtKVxuXG5cdHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dfaWQsIHVzZXJfaWQpXG5cblx0aWYgbm90IHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRkXCIpXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLlvZPliY3nlKjmiLfmsqHmnInmraTmtYHnqIvnmoTmlrDlu7rmnYPpmZBcIilcblxuXHRub3cgPSBuZXcgRGF0ZVxuXHRpbnNfb2JqID0ge31cblx0aW5zX29iai5faWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5fbWFrZU5ld0lEKClcblx0aW5zX29iai5zcGFjZSA9IHNwYWNlX2lkXG5cdGluc19vYmouZmxvdyA9IGZsb3dfaWRcblx0aW5zX29iai5mbG93X3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuX2lkXG5cdGluc19vYmouZm9ybSA9IGZsb3cuZm9ybVxuXHRpbnNfb2JqLmZvcm1fdmVyc2lvbiA9IGZsb3cuY3VycmVudC5mb3JtX3ZlcnNpb25cblx0aW5zX29iai5uYW1lID0gZmxvdy5uYW1lXG5cdGluc19vYmouc3VibWl0dGVyID0gdXNlcl9pZFxuXHRpbnNfb2JqLnN1Ym1pdHRlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWVcblx0aW5zX29iai5hcHBsaWNhbnQgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIGVsc2UgdXNlcl9pZFxuXHRpbnNfb2JqLmFwcGxpY2FudF9uYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gZWxzZSB1c2VyX2luZm8ubmFtZVxuXHRpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb24gPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25cIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25cIl0gZWxzZSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvblxuXHRpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gZWxzZSBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9uYW1lXG5cdGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZVwiXSBlbHNlICBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZVxuXHRpbnNfb2JqLmFwcGxpY2FudF9jb21wYW55ID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfY29tcGFueVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gZWxzZSBzcGFjZV91c2VyLmNvbXBhbnlfaWRcblx0aW5zX29iai5zdGF0ZSA9ICdkcmFmdCdcblx0aW5zX29iai5jb2RlID0gJydcblx0aW5zX29iai5pc19hcmNoaXZlZCA9IGZhbHNlXG5cdGluc19vYmouaXNfZGVsZXRlZCA9IGZhbHNlXG5cdGluc19vYmouY3JlYXRlZCA9IG5vd1xuXHRpbnNfb2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkXG5cdGluc19vYmoubW9kaWZpZWQgPSBub3dcblx0aW5zX29iai5tb2RpZmllZF9ieSA9IHVzZXJfaWRcblx0aW5zX29iai52YWx1ZXMgPSBuZXcgT2JqZWN0XG5cblx0aW5zX29iai5yZWNvcmRfaWRzID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdXG5cblx0aWYgc3BhY2VfdXNlci5jb21wYW55X2lkXG5cdFx0aW5zX29iai5jb21wYW55X2lkID0gc3BhY2VfdXNlci5jb21wYW55X2lkXG5cblx0IyDmlrDlu7pUcmFjZVxuXHR0cmFjZV9vYmogPSB7fVxuXHR0cmFjZV9vYmouX2lkID0gbmV3IE1vbmdvLk9iamVjdElEKCkuX3N0clxuXHR0cmFjZV9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZFxuXHR0cmFjZV9vYmouaXNfZmluaXNoZWQgPSBmYWxzZVxuXHQjIOW9k+WJjeacgOaWsOeJiGZsb3fkuK3lvIDlp4voioLngrlcblx0c3RhcnRfc3RlcCA9IF8uZmluZChmbG93LmN1cnJlbnQuc3RlcHMsIChzdGVwKSAtPlxuXHRcdHJldHVybiBzdGVwLnN0ZXBfdHlwZSBpcyAnc3RhcnQnXG5cdClcblx0dHJhY2Vfb2JqLnN0ZXAgPSBzdGFydF9zdGVwLl9pZFxuXHR0cmFjZV9vYmoubmFtZSA9IHN0YXJ0X3N0ZXAubmFtZVxuXG5cdHRyYWNlX29iai5zdGFydF9kYXRlID0gbm93XG5cdCMg5paw5bu6QXBwcm92ZVxuXHRhcHByX29iaiA9IHt9XG5cdGFwcHJfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHJcblx0YXBwcl9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZFxuXHRhcHByX29iai50cmFjZSA9IHRyYWNlX29iai5faWRcblx0YXBwcl9vYmouaXNfZmluaXNoZWQgPSBmYWxzZVxuXHRhcHByX29iai51c2VyID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSBlbHNlIHVzZXJfaWRcblx0YXBwcl9vYmoudXNlcl9uYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gZWxzZSB1c2VyX2luZm8ubmFtZVxuXHRhcHByX29iai5oYW5kbGVyID0gdXNlcl9pZFxuXHRhcHByX29iai5oYW5kbGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZVxuXHRhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbiA9IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uXG5cdGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX25hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLm5hbWVcblx0YXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLmZ1bGxuYW1lXG5cdGFwcHJfb2JqLnR5cGUgPSAnZHJhZnQnXG5cdGFwcHJfb2JqLnN0YXJ0X2RhdGUgPSBub3dcblx0YXBwcl9vYmoucmVhZF9kYXRlID0gbm93XG5cdGFwcHJfb2JqLmlzX3JlYWQgPSB0cnVlXG5cdGFwcHJfb2JqLmlzX2Vycm9yID0gZmFsc2Vcblx0YXBwcl9vYmouZGVzY3JpcHRpb24gPSAnJ1xuXHRyZWxhdGVkVGFibGVzSW5mbyA9IHt9XG5cdGFwcHJfb2JqLnZhbHVlcyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMoaW5zX29iai5yZWNvcmRfaWRzWzBdLCBmbG93X2lkLCBzcGFjZV9pZCwgZm9ybS5jdXJyZW50LmZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pXG5cblx0dHJhY2Vfb2JqLmFwcHJvdmVzID0gW2FwcHJfb2JqXVxuXHRpbnNfb2JqLnRyYWNlcyA9IFt0cmFjZV9vYmpdXG5cblx0aW5zX29iai5pbmJveF91c2VycyA9IGluc3RhbmNlX2Zyb21fY2xpZW50LmluYm94X3VzZXJzIHx8IFtdXG5cblx0aW5zX29iai5jdXJyZW50X3N0ZXBfbmFtZSA9IHN0YXJ0X3N0ZXAubmFtZVxuXG5cdGlmIGZsb3cuYXV0b19yZW1pbmQgaXMgdHJ1ZVxuXHRcdGluc19vYmouYXV0b19yZW1pbmQgPSB0cnVlXG5cblx0IyDmlrDlu7rnlLPor7fljZXml7bvvIxpbnN0YW5jZXPorrDlvZXmtYHnqIvlkI3np7DjgIHmtYHnqIvliIbnsbvlkI3np7AgIzEzMTNcblx0aW5zX29iai5mbG93X25hbWUgPSBmbG93Lm5hbWVcblx0aWYgZm9ybS5jYXRlZ29yeVxuXHRcdGNhdGVnb3J5ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeShmb3JtLmNhdGVnb3J5KVxuXHRcdGlmIGNhdGVnb3J5XG5cdFx0XHRpbnNfb2JqLmNhdGVnb3J5X25hbWUgPSBjYXRlZ29yeS5uYW1lXG5cdFx0XHRpbnNfb2JqLmNhdGVnb3J5ID0gY2F0ZWdvcnkuX2lkXG5cblx0bmV3X2luc19pZCA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmluc2VydChpbnNfb2JqKVxuXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8oaW5zX29iai5yZWNvcmRfaWRzWzBdLCBuZXdfaW5zX2lkLCBzcGFjZV9pZClcblxuXHQjIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvKHJlbGF0ZWRUYWJsZXNJbmZvLCBuZXdfaW5zX2lkLCBzcGFjZV9pZClcblxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoKGluc19vYmoucmVjb3JkX2lkc1swXSwgc3BhY2VfaWQsIGluc19vYmouX2lkLCBhcHByX29iai5faWQpXG5cblx0cmV0dXJuIG5ld19pbnNfaWRcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVZhbHVlcyA9IChyZWNvcmRJZHMsIGZsb3dJZCwgc3BhY2VJZCwgZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbykgLT5cblx0ZmllbGRDb2RlcyA9IFtdXG5cdF8uZWFjaCBmaWVsZHMsIChmKSAtPlxuXHRcdGlmIGYudHlwZSA9PSAnc2VjdGlvbidcblx0XHRcdF8uZWFjaCBmLmZpZWxkcywgKGZmKSAtPlxuXHRcdFx0XHRmaWVsZENvZGVzLnB1c2ggZmYuY29kZVxuXHRcdGVsc2Vcblx0XHRcdGZpZWxkQ29kZXMucHVzaCBmLmNvZGVcblxuXHR2YWx1ZXMgPSB7fVxuXHRvYmplY3ROYW1lID0gcmVjb3JkSWRzLm9cblx0b2JqZWN0ID0gZ2V0T2JqZWN0Q29uZmlnKG9iamVjdE5hbWUpXG5cdHJlY29yZElkID0gcmVjb3JkSWRzLmlkc1swXVxuXHRvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3dvcmtmbG93cy5maW5kT25lKHtcblx0XHRvYmplY3RfbmFtZTogb2JqZWN0TmFtZSxcblx0XHRmbG93X2lkOiBmbG93SWRcblx0fSlcblx0cmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLmZpbmRPbmUocmVjb3JkSWQpXG5cdGZsb3cgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShmbG93SWQsIHsgZmllbGRzOiB7IGZvcm06IDEgfSB9KVxuXHRpZiBvdyBhbmQgcmVjb3JkXG5cdFx0Zm9ybSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImZvcm1zXCIpLmZpbmRPbmUoZmxvdy5mb3JtKVxuXHRcdGZvcm1GaWVsZHMgPSBmb3JtLmN1cnJlbnQuZmllbGRzIHx8IFtdXG5cdFx0cmVsYXRlZE9iamVjdHMgPSBnZXRSZWxhdGVkcyhvYmplY3ROYW1lKVxuXHRcdHJlbGF0ZWRPYmplY3RzS2V5cyA9IF8ucGx1Y2socmVsYXRlZE9iamVjdHMsICdvYmplY3RfbmFtZScpXG5cdFx0Zm9ybVRhYmxlRmllbGRzID0gXy5maWx0ZXIgZm9ybUZpZWxkcywgKGZvcm1GaWVsZCkgLT5cblx0XHRcdHJldHVybiBmb3JtRmllbGQudHlwZSA9PSAndGFibGUnXG5cdFx0Zm9ybVRhYmxlRmllbGRzQ29kZSA9IF8ucGx1Y2soZm9ybVRhYmxlRmllbGRzLCAnY29kZScpXG5cblx0XHRnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gIChrZXkpIC0+XG5cdFx0XHRyZXR1cm4gXy5maW5kIHJlbGF0ZWRPYmplY3RzS2V5cywgIChyZWxhdGVkT2JqZWN0c0tleSkgLT5cblx0XHRcdFx0cmV0dXJuIGtleS5zdGFydHNXaXRoKHJlbGF0ZWRPYmplY3RzS2V5ICsgJy4nKVxuXG5cdFx0Z2V0Rm9ybVRhYmxlRmllbGRDb2RlID0gKGtleSkgLT5cblx0XHRcdHJldHVybiBfLmZpbmQgZm9ybVRhYmxlRmllbGRzQ29kZSwgIChmb3JtVGFibGVGaWVsZENvZGUpIC0+XG5cdFx0XHRcdHJldHVybiBrZXkuc3RhcnRzV2l0aChmb3JtVGFibGVGaWVsZENvZGUgKyAnLicpXG5cblx0XHRnZXRGb3JtVGFibGVGaWVsZCA9IChrZXkpIC0+XG5cdFx0XHRyZXR1cm4gXy5maW5kIGZvcm1UYWJsZUZpZWxkcywgIChmKSAtPlxuXHRcdFx0XHRyZXR1cm4gZi5jb2RlID09IGtleVxuXG5cdFx0Z2V0Rm9ybUZpZWxkID0gKGtleSkgLT5cblx0XHRcdGZmID0gbnVsbFxuXHRcdFx0Xy5mb3JFYWNoIGZvcm1GaWVsZHMsIChmKSAtPlxuXHRcdFx0XHRpZiBmZlxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRpZiBmLnR5cGUgPT0gJ3NlY3Rpb24nXG5cdFx0XHRcdFx0ZmYgPSBfLmZpbmQgZi5maWVsZHMsICAoc2YpIC0+XG5cdFx0XHRcdFx0XHRyZXR1cm4gc2YuY29kZSA9PSBrZXlcblx0XHRcdFx0ZWxzZSBpZiBmLmNvZGUgPT0ga2V5XG5cdFx0XHRcdFx0ZmYgPSBmXG5cblx0XHRcdHJldHVybiBmZlxuXG5cdFx0Z2V0Rm9ybVRhYmxlU3ViRmllbGQgPSAodGFibGVGaWVsZCwgc3ViRmllbGRDb2RlKSAtPlxuXHRcdFx0cmV0dXJuIF8uZmluZCB0YWJsZUZpZWxkLmZpZWxkcywgIChmKSAtPlxuXHRcdFx0XHRyZXR1cm4gZi5jb2RlID09IHN1YkZpZWxkQ29kZVxuXG5cdFx0Z2V0RmllbGRPZGF0YVZhbHVlID0gKG9iak5hbWUsIGlkKSAtPlxuXHRcdFx0b2JqID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iak5hbWUpXG5cdFx0XHRuYW1lS2V5ID0gZ2V0T2JqZWN0TmFtZUZpZWxkS2V5KG9iak5hbWUpXG5cdFx0XHRpZiAhb2JqXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0aWYgXy5pc1N0cmluZyBpZFxuXHRcdFx0XHRfcmVjb3JkID0gb2JqLmZpbmRPbmUoaWQpXG5cdFx0XHRcdGlmIF9yZWNvcmRcblx0XHRcdFx0XHRfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmRbbmFtZUtleV1cblx0XHRcdFx0XHRyZXR1cm4gX3JlY29yZFxuXHRcdFx0ZWxzZSBpZiBfLmlzQXJyYXkgaWRcblx0XHRcdFx0X3JlY29yZHMgPSBbXVxuXHRcdFx0XHRvYmouZmluZCh7IF9pZDogeyAkaW46IGlkIH0gfSkuZm9yRWFjaCAoX3JlY29yZCkgLT5cblx0XHRcdFx0XHRfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmRbbmFtZUtleV1cblx0XHRcdFx0XHRfcmVjb3Jkcy5wdXNoIF9yZWNvcmRcblxuXHRcdFx0XHRpZiAhXy5pc0VtcHR5IF9yZWNvcmRzXG5cdFx0XHRcdFx0cmV0dXJuIF9yZWNvcmRzXG5cdFx0XHRyZXR1cm5cblxuXHRcdGdldFNlbGVjdFVzZXJWYWx1ZSA9ICh1c2VySWQsIHNwYWNlSWQpIC0+XG5cdFx0XHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9KVxuXHRcdFx0c3UuaWQgPSB1c2VySWRcblx0XHRcdHJldHVybiBzdVxuXG5cdFx0Z2V0U2VsZWN0VXNlclZhbHVlcyA9ICh1c2VySWRzLCBzcGFjZUlkKSAtPlxuXHRcdFx0c3VzID0gW11cblx0XHRcdGlmIF8uaXNBcnJheSB1c2VySWRzXG5cdFx0XHRcdF8uZWFjaCB1c2VySWRzLCAodXNlcklkKSAtPlxuXHRcdFx0XHRcdHN1ID0gZ2V0U2VsZWN0VXNlclZhbHVlKHVzZXJJZCwgc3BhY2VJZClcblx0XHRcdFx0XHRpZiBzdVxuXHRcdFx0XHRcdFx0c3VzLnB1c2goc3UpXG5cdFx0XHRyZXR1cm4gc3VzXG5cblx0XHRnZXRTZWxlY3RPcmdWYWx1ZSA9IChvcmdJZCwgc3BhY2VJZCkgLT5cblx0XHRcdG9yZyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmRPbmUob3JnSWQsIHsgZmllbGRzOiB7IF9pZDogMSwgbmFtZTogMSwgZnVsbG5hbWU6IDEgfSB9KVxuXHRcdFx0b3JnLmlkID0gb3JnSWRcblx0XHRcdHJldHVybiBvcmdcblxuXHRcdGdldFNlbGVjdE9yZ1ZhbHVlcyA9IChvcmdJZHMsIHNwYWNlSWQpIC0+XG5cdFx0XHRvcmdzID0gW11cblx0XHRcdGlmIF8uaXNBcnJheSBvcmdJZHNcblx0XHRcdFx0Xy5lYWNoIG9yZ0lkcywgKG9yZ0lkKSAtPlxuXHRcdFx0XHRcdG9yZyA9IGdldFNlbGVjdE9yZ1ZhbHVlKG9yZ0lkLCBzcGFjZUlkKVxuXHRcdFx0XHRcdGlmIG9yZ1xuXHRcdFx0XHRcdFx0b3Jncy5wdXNoKG9yZylcblx0XHRcdHJldHVybiBvcmdzXG5cblx0XHR0YWJsZUZpZWxkQ29kZXMgPSBbXVxuXHRcdHRhYmxlRmllbGRNYXAgPSBbXVxuXHRcdHRhYmxlVG9SZWxhdGVkTWFwID0ge31cblxuXHRcdG93LmZpZWxkX21hcD8uZm9yRWFjaCAoZm0pIC0+XG5cdFx0XHRvYmplY3RfZmllbGQgPSBmbS5vYmplY3RfZmllbGRcblx0XHRcdHdvcmtmbG93X2ZpZWxkID0gZm0ud29ya2Zsb3dfZmllbGRcblx0XHRcdGlmICFvYmplY3RfZmllbGQgfHwgIXdvcmtmbG93X2ZpZWxkXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAn5pyq5om+5Yiw5a2X5q6177yM6K+35qOA5p+l5a+56LGh5rWB56iL5pig5bCE5a2X5q616YWN572uJylcblx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZENvZGUgPSBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlKG9iamVjdF9maWVsZClcblx0XHRcdGZvcm1UYWJsZUZpZWxkQ29kZSA9IGdldEZvcm1UYWJsZUZpZWxkQ29kZSh3b3JrZmxvd19maWVsZClcblx0XHRcdG9iakZpZWxkID0gb2JqZWN0LmZpZWxkc1tvYmplY3RfZmllbGRdXG5cdFx0XHRmb3JtRmllbGQgPSBnZXRGb3JtRmllbGQod29ya2Zsb3dfZmllbGQpXG5cdFx0XHQjIOWkhOeQhuWtkOihqOWtl+autVxuXHRcdFx0aWYgcmVsYXRlZE9iamVjdEZpZWxkQ29kZVxuXHRcdFx0XHRcblx0XHRcdFx0b1RhYmxlQ29kZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdXG5cdFx0XHRcdG9UYWJsZUZpZWxkQ29kZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzFdXG5cdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwS2V5ID0gb1RhYmxlQ29kZVxuXHRcdFx0XHRpZiAhdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldXG5cdFx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldID0ge31cblxuXHRcdFx0XHRpZiBmb3JtVGFibGVGaWVsZENvZGVcblx0XHRcdFx0XHR3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVswXVxuXHRcdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVsnX0ZST01fVEFCTEVfQ09ERSddID0gd1RhYmxlQ29kZVxuXG5cdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVtvVGFibGVGaWVsZENvZGVdID0gd29ya2Zsb3dfZmllbGRcblx0XHRcdCMg5Yik5pat5piv5ZCm5piv6KGo5qC85a2X5q61XG5cdFx0XHRlbHNlIGlmIHdvcmtmbG93X2ZpZWxkLmluZGV4T2YoJy4nKSA+IDAgYW5kIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA+IDBcblx0XHRcdFx0d1RhYmxlQ29kZSA9IHdvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMF1cblx0XHRcdFx0b1RhYmxlQ29kZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLiQuJylbMF1cblx0XHRcdFx0aWYgcmVjb3JkLmhhc093blByb3BlcnR5KG9UYWJsZUNvZGUpIGFuZCBfLmlzQXJyYXkocmVjb3JkW29UYWJsZUNvZGVdKVxuXHRcdFx0XHRcdHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcblx0XHRcdFx0XHRcdHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXG5cdFx0XHRcdFx0XHRvYmplY3RfdGFibGVfZmllbGRfY29kZTogb1RhYmxlQ29kZVxuXHRcdFx0XHRcdH0pKVxuXHRcdFx0XHRcdHRhYmxlRmllbGRNYXAucHVzaChmbSlcblx0XHRcdFx0ZWxzZSBpZiBvVGFibGVDb2RlLmluZGV4T2YoJy4nKSA+IDAgIyDor7TmmI7mmK/lhbPogZTooajnmoRncmlk5a2X5q61XG5cdFx0XHRcdFx0b1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkQ29kZSA9IG9UYWJsZUNvZGUuc3BsaXQoJy4nKVswXTtcblx0XHRcdFx0XHRncmlkQ29kZSA9IG9UYWJsZUNvZGUuc3BsaXQoJy4nKVsxXTtcblx0XHRcdFx0XHRvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQgPSBvYmplY3QuZmllbGRzW29UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZENvZGVdO1xuXHRcdFx0XHRcdGlmIG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZCAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdGlmIHJlY29yZFtvVGFibGVDb2RlXVxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VUb09iamVjdE5hbWUgPSBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQucmVmZXJlbmNlX3RvO1xuXHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5uYW1lXTtcblx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRG9jID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcblx0XHRcdFx0XHRcdGlmIHJlZmVyZW5jZVRvRG9jW2dyaWRDb2RlXVxuXHRcdFx0XHRcdFx0XHRyZWNvcmRbb1RhYmxlQ29kZV0gPSByZWZlcmVuY2VUb0RvY1tncmlkQ29kZV07XG5cdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcblx0XHRcdFx0XHRcdFx0XHR3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxuXHRcdFx0XHRcdFx0XHRcdG9iamVjdF90YWJsZV9maWVsZF9jb2RlOiBvVGFibGVDb2RlXG5cdFx0XHRcdFx0XHRcdH0pKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRhYmxlRmllbGRNYXAucHVzaChmbSk7XG5cblx0XHRcdCMg5aSE55CGbG9va3Vw44CBbWFzdGVyX2RldGFpbOexu+Wei+Wtl+autVxuXHRcdFx0ZWxzZSBpZiBvYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gMCBhbmQgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID09IC0xXG5cdFx0XHRcdG9iamVjdEZpZWxkTmFtZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdXG5cdFx0XHRcdGxvb2t1cEZpZWxkTmFtZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzFdXG5cdFx0XHRcdGlmIG9iamVjdFxuXHRcdFx0XHRcdG9iamVjdEZpZWxkID0gb2JqZWN0LmZpZWxkc1tvYmplY3RGaWVsZE5hbWVdXG5cdFx0XHRcdFx0aWYgb2JqZWN0RmllbGQgJiYgZm9ybUZpZWxkICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdGZpZWxkc09iaiA9IHt9XG5cdFx0XHRcdFx0XHRmaWVsZHNPYmpbbG9va3VwRmllbGROYW1lXSA9IDFcblx0XHRcdFx0XHRcdGxvb2t1cE9iamVjdFJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpLmZpbmRPbmUocmVjb3JkW29iamVjdEZpZWxkTmFtZV0sIHsgZmllbGRzOiBmaWVsZHNPYmogfSlcblx0XHRcdFx0XHRcdG9iamVjdEZpZWxkT2JqZWN0TmFtZSA9IG9iamVjdEZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRcdFx0bG9va3VwRmllbGRPYmogPSBnZXRPYmplY3RDb25maWcob2JqZWN0RmllbGRPYmplY3ROYW1lKVxuXHRcdFx0XHRcdFx0b2JqZWN0TG9va3VwRmllbGQgPSBsb29rdXBGaWVsZE9iai5maWVsZHNbbG9va3VwRmllbGROYW1lXVxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gbG9va3VwT2JqZWN0UmVjb3JkW2xvb2t1cEZpZWxkTmFtZV1cblx0XHRcdFx0XHRcdGlmIG9iamVjdExvb2t1cEZpZWxkICYmIGZvcm1GaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RMb29rdXBGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvXG5cdFx0XHRcdFx0XHRcdG9kYXRhRmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0XHRpZiBvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgIW9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXG5cdFx0XHRcdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBvZGF0YUZpZWxkVmFsdWVcblx0XHRcdFx0XHRcdGVsc2UgaWYgb2JqZWN0TG9va3VwRmllbGQgJiYgZm9ybUZpZWxkICYmIFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKGZvcm1GaWVsZC50eXBlKSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqZWN0TG9va3VwRmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRpZiAhXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRsb29rdXBTZWxlY3RGaWVsZFZhbHVlXG5cdFx0XHRcdFx0XHRcdFx0aWYgZm9ybUZpZWxkLnR5cGUgPT0gJ3VzZXInXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhb2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBTZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZvcm1GaWVsZC50eXBlID09ICdncm91cCdcblx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdExvb2t1cEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBTZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIW9iamVjdExvb2t1cEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRpZiBsb29rdXBTZWxlY3RGaWVsZFZhbHVlXG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gbG9va3VwU2VsZWN0RmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gbG9va3VwT2JqZWN0UmVjb3JkW2xvb2t1cEZpZWxkTmFtZV1cblxuXHRcdFx0IyBsb29rdXDjgIFtYXN0ZXJfZGV0YWls5a2X5q615ZCM5q2l5Yiwb2RhdGHlrZfmrrVcblx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkICYmIG9iakZpZWxkICYmIGZvcm1GaWVsZC50eXBlID09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iakZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqRmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRyZWZlcmVuY2VUb09iamVjdE5hbWUgPSBvYmpGaWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdXG5cdFx0XHRcdG9kYXRhRmllbGRWYWx1ZVxuXHRcdFx0XHRpZiBvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXG5cdFx0XHRcdGVsc2UgaWYgIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXG5cdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBvZGF0YUZpZWxkVmFsdWVcblx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkICYmIG9iakZpZWxkICYmIFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKGZvcm1GaWVsZC50eXBlKSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob2JqRmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSByZWNvcmRbb2JqRmllbGQubmFtZV1cblx0XHRcdFx0aWYgIV8uaXNFbXB0eShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXG5cdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZVxuXHRcdFx0XHRcdGlmIGZvcm1GaWVsZC50eXBlID09ICd1c2VyJ1xuXHRcdFx0XHRcdFx0aWYgb2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdGVsc2UgaWYgIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQudHlwZSA9PSAnZ3JvdXAnXG5cdFx0XHRcdFx0XHRpZiBvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRlbHNlIGlmICFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0aWYgc2VsZWN0RmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHNlbGVjdEZpZWxkVmFsdWVcblx0XHRcdGVsc2UgaWYgcmVjb3JkLmhhc093blByb3BlcnR5KG9iamVjdF9maWVsZClcblx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHJlY29yZFtvYmplY3RfZmllbGRdXG5cblx0XHQjIOihqOagvOWtl+autVxuXHRcdF8udW5pcSh0YWJsZUZpZWxkQ29kZXMpLmZvckVhY2ggKHRmYykgLT5cblx0XHRcdGMgPSBKU09OLnBhcnNlKHRmYylcblx0XHRcdHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdID0gW11cblx0XHRcdHJlY29yZFtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXS5mb3JFYWNoICh0cikgLT5cblx0XHRcdFx0bmV3VHIgPSB7fVxuXHRcdFx0XHRfLmVhY2ggdHIsICh2LCBrKSAtPlxuXHRcdFx0XHRcdHRhYmxlRmllbGRNYXAuZm9yRWFjaCAodGZtKSAtPlxuXHRcdFx0XHRcdFx0aWYgdGZtLm9iamVjdF9maWVsZCBpcyAoYy5vYmplY3RfdGFibGVfZmllbGRfY29kZSArICcuJC4nICsgaylcblx0XHRcdFx0XHRcdFx0d1RkQ29kZSA9IHRmbS53b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzFdXG5cdFx0XHRcdFx0XHRcdG5ld1RyW3dUZENvZGVdID0gdlxuXHRcdFx0XHRpZiBub3QgXy5pc0VtcHR5KG5ld1RyKVxuXHRcdFx0XHRcdHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdLnB1c2gobmV3VHIpXG5cblx0XHQjIOWQjOatpeWtkOihqOaVsOaNruiHs+ihqOWNleihqOagvFxuXHRcdF8uZWFjaCB0YWJsZVRvUmVsYXRlZE1hcCwgIChtYXAsIGtleSkgLT5cblx0XHRcdHRhYmxlQ29kZSA9IG1hcC5fRlJPTV9UQUJMRV9DT0RFXG5cdFx0XHRmb3JtVGFibGVGaWVsZCA9IGdldEZvcm1UYWJsZUZpZWxkKHRhYmxlQ29kZSlcblx0XHRcdGlmICF0YWJsZUNvZGVcblx0XHRcdFx0Y29uc29sZS53YXJuKCd0YWJsZVRvUmVsYXRlZDogWycgKyBrZXkgKyAnXSBtaXNzaW5nIGNvcnJlc3BvbmRpbmcgdGFibGUuJylcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmVsYXRlZE9iamVjdE5hbWUgPSBrZXlcblx0XHRcdFx0dGFibGVWYWx1ZXMgPSBbXVxuXHRcdFx0XHRyZWxhdGVkVGFibGVJdGVtcyA9IFtdXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3QgPSBnZXRPYmplY3RDb25maWcocmVsYXRlZE9iamVjdE5hbWUpXG5cdFx0XHRcdHJlbGF0ZWRGaWVsZCA9IF8uZmluZCByZWxhdGVkT2JqZWN0LmZpZWxkcywgKGYpIC0+XG5cdFx0XHRcdFx0cmV0dXJuIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhmLnR5cGUpICYmIGYucmVmZXJlbmNlX3RvID09IG9iamVjdE5hbWVcblxuXHRcdFx0XHRyZWxhdGVkRmllbGROYW1lID0gcmVsYXRlZEZpZWxkLm5hbWVcblxuXHRcdFx0XHRzZWxlY3RvciA9IHt9XG5cdFx0XHRcdHNlbGVjdG9yW3JlbGF0ZWRGaWVsZE5hbWVdID0gcmVjb3JkSWRcblx0XHRcdFx0cmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpXG5cdFx0XHRcdHJlbGF0ZWRSZWNvcmRzID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZChzZWxlY3RvcilcblxuXHRcdFx0XHRyZWxhdGVkUmVjb3Jkcy5mb3JFYWNoIChycikgLT5cblx0XHRcdFx0XHR0YWJsZVZhbHVlSXRlbSA9IHt9XG5cdFx0XHRcdFx0Xy5lYWNoIG1hcCwgKHZhbHVlS2V5LCBmaWVsZEtleSkgLT5cblx0XHRcdFx0XHRcdGlmIGZpZWxkS2V5ICE9ICdfRlJPTV9UQUJMRV9DT0RFJ1xuXHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWVcblx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkS2V5XG5cdFx0XHRcdFx0XHRcdGlmIHZhbHVlS2V5LnN0YXJ0c1dpdGgodGFibGVDb2RlICsgJy4nKVxuXHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleSA9ICh2YWx1ZUtleS5zcGxpdChcIi5cIilbMV0pXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXkgPSB2YWx1ZUtleVxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkID0gZ2V0Rm9ybVRhYmxlU3ViRmllbGQoZm9ybVRhYmxlRmllbGQsIGZvcm1GaWVsZEtleSlcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkID0gcmVsYXRlZE9iamVjdC5maWVsZHNbZmllbGRLZXldXG5cdFx0XHRcdFx0XHRcdGlmICFmb3JtRmllbGQgfHwgIXJlbGF0ZWRPYmplY3RGaWVsZFxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdFx0XHRpZiBmb3JtRmllbGQudHlwZSA9PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhyZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV1cblx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC50eXBlKSAmJiBbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XVxuXHRcdFx0XHRcdFx0XHRcdGlmICFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgZm9ybUZpZWxkLnR5cGUgPT0gJ3VzZXInXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQudHlwZSA9PSAnZ3JvdXAnXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmICFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XVxuXHRcdFx0XHRcdFx0XHR0YWJsZVZhbHVlSXRlbVtmb3JtRmllbGRLZXldID0gdGFibGVGaWVsZFZhbHVlXG5cdFx0XHRcdFx0aWYgIV8uaXNFbXB0eSh0YWJsZVZhbHVlSXRlbSlcblx0XHRcdFx0XHRcdHRhYmxlVmFsdWVJdGVtLl9pZCA9IHJyLl9pZFxuXHRcdFx0XHRcdFx0dGFibGVWYWx1ZXMucHVzaCh0YWJsZVZhbHVlSXRlbSlcblx0XHRcdFx0XHRcdHJlbGF0ZWRUYWJsZUl0ZW1zLnB1c2goeyBfdGFibGU6IHsgX2lkOiByci5faWQsIF9jb2RlOiB0YWJsZUNvZGUgfSB9IClcblxuXHRcdFx0XHR2YWx1ZXNbdGFibGVDb2RlXSA9IHRhYmxlVmFsdWVzXG5cdFx0XHRcdHJlbGF0ZWRUYWJsZXNJbmZvW3JlbGF0ZWRPYmplY3ROYW1lXSA9IHJlbGF0ZWRUYWJsZUl0ZW1zXG5cblx0XHQjIOWmguaenOmFjee9ruS6huiEmuacrOWImeaJp+ihjOiEmuacrFxuXHRcdGlmIG93LmZpZWxkX21hcF9zY3JpcHRcblx0XHRcdF8uZXh0ZW5kKHZhbHVlcywgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5ldmFsRmllbGRNYXBTY3JpcHQob3cuZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgcmVjb3JkSWQpKVxuXG5cdCMg6L+H5ruk5o6JdmFsdWVz5Lit55qE6Z2e5rOVa2V5XG5cdGZpbHRlclZhbHVlcyA9IHt9XG5cdF8uZWFjaCBfLmtleXModmFsdWVzKSwgKGspIC0+XG5cdFx0aWYgZmllbGRDb2Rlcy5pbmNsdWRlcyhrKVxuXHRcdFx0ZmlsdGVyVmFsdWVzW2tdID0gdmFsdWVzW2tdXG5cblx0cmV0dXJuIGZpbHRlclZhbHVlc1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmV2YWxGaWVsZE1hcFNjcmlwdCA9IChmaWVsZF9tYXBfc2NyaXB0LCBvYmplY3ROYW1lLCBzcGFjZUlkLCBvYmplY3RJZCkgLT5cblx0cmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLmZpbmRPbmUob2JqZWN0SWQpXG5cdHNjcmlwdCA9IFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocmVjb3JkKSB7IFwiICsgZmllbGRfbWFwX3NjcmlwdCArIFwiIH1cIlxuXHRmdW5jID0gX2V2YWwoc2NyaXB0LCBcImZpZWxkX21hcF9zY3JpcHRcIilcblx0dmFsdWVzID0gZnVuYyhyZWNvcmQpXG5cdGlmIF8uaXNPYmplY3QgdmFsdWVzXG5cdFx0cmV0dXJuIHZhbHVlc1xuXHRlbHNlXG5cdFx0Y29uc29sZS5lcnJvciBcImV2YWxGaWVsZE1hcFNjcmlwdDog6ISa5pys6L+U5Zue5YC857G75Z6L5LiN5piv5a+56LGhXCJcblx0cmV0dXJuIHt9XG5cblxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoID0gKHJlY29yZElkcywgc3BhY2VJZCwgaW5zSWQsIGFwcHJvdmVJZCkgLT5cblxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zWydjbXNfZmlsZXMnXS5maW5kKHtcblx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRwYXJlbnQ6IHJlY29yZElkc1xuXHR9KS5mb3JFYWNoIChjZikgLT5cblx0XHRfLmVhY2ggY2YudmVyc2lvbnMsICh2ZXJzaW9uSWQsIGlkeCkgLT5cblx0XHRcdGYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zWydjZnMuZmlsZXMuZmlsZXJlY29yZCddLmZpbmRPbmUodmVyc2lvbklkKVxuXHRcdFx0bmV3RmlsZSA9IG5ldyBGUy5GaWxlKClcblxuXHRcdFx0bmV3RmlsZS5hdHRhY2hEYXRhIGYuY3JlYXRlUmVhZFN0cmVhbSgnZmlsZXMnKSwge1xuXHRcdFx0XHRcdHR5cGU6IGYub3JpZ2luYWwudHlwZVxuXHRcdFx0fSwgKGVycikgLT5cblx0XHRcdFx0aWYgKGVycilcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbilcblxuXHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpXG5cdFx0XHRcdG5ld0ZpbGUuc2l6ZShmLnNpemUoKSlcblx0XHRcdFx0bWV0YWRhdGEgPSB7XG5cdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXG5cdFx0XHRcdFx0b3duZXJfbmFtZTogZi5tZXRhZGF0YS5vd25lcl9uYW1lLFxuXHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkLFxuXHRcdFx0XHRcdGluc3RhbmNlOiBpbnNJZCxcblx0XHRcdFx0XHRhcHByb3ZlOiBhcHByb3ZlSWRcblx0XHRcdFx0XHRwYXJlbnQ6IGNmLl9pZFxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgaWR4IGlzIDBcblx0XHRcdFx0XHRtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZVxuXG5cdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YVxuXHRcdFx0XHRjZnMuaW5zdGFuY2VzLmluc2VydChuZXdGaWxlKVxuXG5cdHJldHVyblxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvID0gKHJlY29yZElkcywgaW5zSWQsIHNwYWNlSWQpIC0+XG5cdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkudXBkYXRlKHJlY29yZElkcy5pZHNbMF0sIHtcblx0XHQkcHVzaDoge1xuXHRcdFx0aW5zdGFuY2VzOiB7XG5cdFx0XHRcdCRlYWNoOiBbe1xuXHRcdFx0XHRcdF9pZDogaW5zSWQsXG5cdFx0XHRcdFx0c3RhdGU6ICdkcmFmdCdcblx0XHRcdFx0fV0sXG5cdFx0XHRcdCRwb3NpdGlvbjogMFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0JHNldDoge1xuXHRcdFx0bG9ja2VkOiB0cnVlXG5cdFx0XHRpbnN0YW5jZV9zdGF0ZTogJ2RyYWZ0J1xuXHRcdH1cblx0fSlcblxuXHRyZXR1cm5cblxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyA9IChyZWxhdGVkVGFibGVzSW5mbywgaW5zSWQsIHNwYWNlSWQpIC0+XG5cdF8uZWFjaCByZWxhdGVkVGFibGVzSW5mbywgKHRhYmxlSXRlbXMsIHJlbGF0ZWRPYmplY3ROYW1lKSAtPlxuXHRcdHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKVxuXHRcdF8uZWFjaCB0YWJsZUl0ZW1zLCAoaXRlbSkgLT5cblx0XHRcdHJlbGF0ZWRDb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoaXRlbS5fdGFibGUuX2lkLCB7XG5cdFx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0XHRpbnN0YW5jZXM6IFt7XG5cdFx0XHRcdFx0XHRfaWQ6IGluc0lkLFxuXHRcdFx0XHRcdFx0c3RhdGU6ICdkcmFmdCdcblx0XHRcdFx0XHR9XSxcblx0XHRcdFx0XHRfdGFibGU6IGl0ZW0uX3RhYmxlXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cblx0cmV0dXJuXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tJc0luQXBwcm92YWwgPSAocmVjb3JkSWRzLCBzcGFjZUlkKSAtPlxuXHRyZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLmZpbmRPbmUoe1xuXHRcdF9pZDogcmVjb3JkSWRzLmlkc1swXSwgaW5zdGFuY2VzOiB7ICRleGlzdHM6IHRydWUgfVxuXHR9LCB7IGZpZWxkczogeyBpbnN0YW5jZXM6IDEgfSB9KVxuXG5cdGlmIHJlY29yZCBhbmQgcmVjb3JkLmluc3RhbmNlc1swXS5zdGF0ZSBpc250ICdjb21wbGV0ZWQnIGFuZCBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kKHJlY29yZC5pbnN0YW5jZXNbMF0uX2lkKS5jb3VudCgpID4gMFxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5q2k6K6w5b2V5bey5Y+R6LW35rWB56iL5q2j5Zyo5a6h5om55Lit77yM5b6F5a6h5om557uT5p2f5pa55Y+v5Y+R6LW35LiL5LiA5qyh5a6h5om577yBXCIpXG5cblx0cmV0dXJuXG5cbiIsInZhciBfZXZhbCwgZ2V0T2JqZWN0Q29uZmlnLCBnZXRPYmplY3ROYW1lRmllbGRLZXksIGdldFJlbGF0ZWRzLCBvYmplY3RxbDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuX2V2YWwgPSByZXF1aXJlKCdldmFsJyk7XG5cbm9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcblxuZ2V0T2JqZWN0Q29uZmlnID0gZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSkge1xuICByZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLnRvQ29uZmlnKCk7XG59O1xuXG5nZXRPYmplY3ROYW1lRmllbGRLZXkgPSBmdW5jdGlvbihvYmplY3RBcGlOYW1lKSB7XG4gIHJldHVybiBvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkuTkFNRV9GSUVMRF9LRVk7XG59O1xuXG5nZXRSZWxhdGVkcyA9IGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUpIHtcbiAgcmV0dXJuIE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSwgY2IpIHtcbiAgICByZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLmdldFJlbGF0ZWRzKCkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgIH0pO1xuICB9KShvYmplY3RBcGlOYW1lKTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwgPSB7fTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja19hdXRob3JpemF0aW9uID0gZnVuY3Rpb24ocmVxKSB7XG4gIHZhciBhdXRoVG9rZW4sIGhhc2hlZFRva2VuLCBxdWVyeSwgdXNlciwgdXNlcklkO1xuICBxdWVyeSA9IHJlcS5xdWVyeTtcbiAgdXNlcklkID0gcXVlcnlbXCJYLVVzZXItSWRcIl07XG4gIGF1dGhUb2tlbiA9IHF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdO1xuICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgIF9pZDogdXNlcklkLFxuICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gIH0pO1xuICBpZiAoIXVzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIHJldHVybiB1c2VyO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZSA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHZhciBzcGFjZTtcbiAgc3BhY2UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgaWYgKCFzcGFjZSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwic3BhY2VfaWTmnInor6/miJbmraRzcGFjZeW3sue7j+iiq+WIoOmZpFwiKTtcbiAgfVxuICByZXR1cm4gc3BhY2U7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3cgPSBmdW5jdGlvbihmbG93X2lkKSB7XG4gIHZhciBmbG93O1xuICBmbG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5mbG93cy5maW5kT25lKGZsb3dfaWQpO1xuICBpZiAoIWZsb3cpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcImlk5pyJ6K+v5oiW5q2k5rWB56iL5bey57uP6KKr5Yig6ZmkXCIpO1xuICB9XG4gIHJldHVybiBmbG93O1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXIgPSBmdW5jdGlvbihzcGFjZV9pZCwgdXNlcl9pZCkge1xuICB2YXIgc3BhY2VfdXNlcjtcbiAgc3BhY2VfdXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHVzZXI6IHVzZXJfaWRcbiAgfSk7XG4gIGlmICghc3BhY2VfdXNlcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwidXNlcl9pZOWvueW6lOeahOeUqOaIt+S4jeWxnuS6juW9k+WJjXNwYWNlXCIpO1xuICB9XG4gIHJldHVybiBzcGFjZV91c2VyO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXJPcmdJbmZvID0gZnVuY3Rpb24oc3BhY2VfdXNlcikge1xuICB2YXIgaW5mbywgb3JnO1xuICBpbmZvID0gbmV3IE9iamVjdDtcbiAgaW5mby5vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbjtcbiAgb3JnID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vcmdhbml6YXRpb25zLmZpbmRPbmUoc3BhY2VfdXNlci5vcmdhbml6YXRpb24sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIG5hbWU6IDEsXG4gICAgICBmdWxsbmFtZTogMVxuICAgIH1cbiAgfSk7XG4gIGluZm8ub3JnYW5pemF0aW9uX25hbWUgPSBvcmcubmFtZTtcbiAgaW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBvcmcuZnVsbG5hbWU7XG4gIHJldHVybiBpbmZvO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dFbmFibGVkID0gZnVuY3Rpb24oZmxvdykge1xuICBpZiAoZmxvdy5zdGF0ZSAhPT0gXCJlbmFibGVkXCIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+acquWQr+eUqCzmk43kvZzlpLHotKVcIik7XG4gIH1cbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93U3BhY2VNYXRjaGVkID0gZnVuY3Rpb24oZmxvdywgc3BhY2VfaWQpIHtcbiAgaWYgKGZsb3cuc3BhY2UgIT09IHNwYWNlX2lkKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvlkozlt6XkvZzljLpJROS4jeWMuemFjVwiKTtcbiAgfVxufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtID0gZnVuY3Rpb24oZm9ybV9pZCkge1xuICB2YXIgZm9ybTtcbiAgZm9ybSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZm9ybXMuZmluZE9uZShmb3JtX2lkKTtcbiAgaWYgKCFmb3JtKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+ihqOWNlUlE5pyJ6K+v5oiW5q2k6KGo5Y2V5bey57uP6KKr5Yig6ZmkJyk7XG4gIH1cbiAgcmV0dXJuIGZvcm07XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldENhdGVnb3J5ID0gZnVuY3Rpb24oY2F0ZWdvcnlfaWQpIHtcbiAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuY2F0ZWdvcmllcy5maW5kT25lKGNhdGVnb3J5X2lkKTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY3JlYXRlX2luc3RhbmNlID0gZnVuY3Rpb24oaW5zdGFuY2VfZnJvbV9jbGllbnQsIHVzZXJfaW5mbykge1xuICB2YXIgYXBwcl9vYmosIGFwcHJvdmVfZnJvbV9jbGllbnQsIGNhdGVnb3J5LCBmbG93LCBmbG93X2lkLCBmb3JtLCBpbnNfb2JqLCBuZXdfaW5zX2lkLCBub3csIHBlcm1pc3Npb25zLCByZWxhdGVkVGFibGVzSW5mbywgc3BhY2UsIHNwYWNlX2lkLCBzcGFjZV91c2VyLCBzcGFjZV91c2VyX29yZ19pbmZvLCBzdGFydF9zdGVwLCB0cmFjZV9mcm9tX2NsaWVudCwgdHJhY2Vfb2JqLCB1c2VyX2lkO1xuICBjaGVjayhpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSwgU3RyaW5nKTtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSwgU3RyaW5nKTtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdLCBTdHJpbmcpO1xuICBjaGVjayhpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl0sIFtcbiAgICB7XG4gICAgICBvOiBTdHJpbmcsXG4gICAgICBpZHM6IFtTdHJpbmddXG4gICAgfVxuICBdKTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja0lzSW5BcHByb3ZhbChpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl1bMF0sIGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0pO1xuICBzcGFjZV9pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl07XG4gIGZsb3dfaWQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl07XG4gIHVzZXJfaWQgPSB1c2VyX2luZm8uX2lkO1xuICB0cmFjZV9mcm9tX2NsaWVudCA9IG51bGw7XG4gIGFwcHJvdmVfZnJvbV9jbGllbnQgPSBudWxsO1xuICBpZiAoaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl0gJiYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF0pIHtcbiAgICB0cmFjZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdO1xuICAgIGlmICh0cmFjZV9mcm9tX2NsaWVudFtcImFwcHJvdmVzXCJdICYmIHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl1bMF0pIHtcbiAgICAgIGFwcHJvdmVfZnJvbV9jbGllbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXVtcImFwcHJvdmVzXCJdWzBdO1xuICAgIH1cbiAgfVxuICBzcGFjZSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2Uoc3BhY2VfaWQpO1xuICBmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpO1xuICBzcGFjZV91c2VyID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXIoc3BhY2VfaWQsIHVzZXJfaWQpO1xuICBzcGFjZV91c2VyX29yZ19pbmZvID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXJPcmdJbmZvKHNwYWNlX3VzZXIpO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd0VuYWJsZWQoZmxvdyk7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93U3BhY2VNYXRjaGVkKGZsb3csIHNwYWNlX2lkKTtcbiAgZm9ybSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybShmbG93LmZvcm0pO1xuICBwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93X2lkLCB1c2VyX2lkKTtcbiAgaWYgKCFwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkZFwiKSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5b2T5YmN55So5oi35rKh5pyJ5q2k5rWB56iL55qE5paw5bu65p2D6ZmQXCIpO1xuICB9XG4gIG5vdyA9IG5ldyBEYXRlO1xuICBpbnNfb2JqID0ge307XG4gIGluc19vYmouX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuX21ha2VOZXdJRCgpO1xuICBpbnNfb2JqLnNwYWNlID0gc3BhY2VfaWQ7XG4gIGluc19vYmouZmxvdyA9IGZsb3dfaWQ7XG4gIGluc19vYmouZmxvd192ZXJzaW9uID0gZmxvdy5jdXJyZW50Ll9pZDtcbiAgaW5zX29iai5mb3JtID0gZmxvdy5mb3JtO1xuICBpbnNfb2JqLmZvcm1fdmVyc2lvbiA9IGZsb3cuY3VycmVudC5mb3JtX3ZlcnNpb247XG4gIGluc19vYmoubmFtZSA9IGZsb3cubmFtZTtcbiAgaW5zX29iai5zdWJtaXR0ZXIgPSB1c2VyX2lkO1xuICBpbnNfb2JqLnN1Ym1pdHRlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWU7XG4gIGluc19vYmouYXBwbGljYW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA6IHVzZXJfaWQ7XG4gIGluc19vYmouYXBwbGljYW50X25hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA6IHVzZXJfaW5mby5uYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb24gPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25cIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25cIl0gOiBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbjtcbiAgaW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdIDogc3BhY2VfdXNlcl9vcmdfaW5mby5vcmdhbml6YXRpb25fbmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdIDogc3BhY2VfdXNlcl9vcmdfaW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWU7XG4gIGluc19vYmouYXBwbGljYW50X2NvbXBhbnkgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfY29tcGFueVwiXSA6IHNwYWNlX3VzZXIuY29tcGFueV9pZDtcbiAgaW5zX29iai5zdGF0ZSA9ICdkcmFmdCc7XG4gIGluc19vYmouY29kZSA9ICcnO1xuICBpbnNfb2JqLmlzX2FyY2hpdmVkID0gZmFsc2U7XG4gIGluc19vYmouaXNfZGVsZXRlZCA9IGZhbHNlO1xuICBpbnNfb2JqLmNyZWF0ZWQgPSBub3c7XG4gIGluc19vYmouY3JlYXRlZF9ieSA9IHVzZXJfaWQ7XG4gIGluc19vYmoubW9kaWZpZWQgPSBub3c7XG4gIGluc19vYmoubW9kaWZpZWRfYnkgPSB1c2VyX2lkO1xuICBpbnNfb2JqLnZhbHVlcyA9IG5ldyBPYmplY3Q7XG4gIGluc19vYmoucmVjb3JkX2lkcyA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXTtcbiAgaWYgKHNwYWNlX3VzZXIuY29tcGFueV9pZCkge1xuICAgIGluc19vYmouY29tcGFueV9pZCA9IHNwYWNlX3VzZXIuY29tcGFueV9pZDtcbiAgfVxuICB0cmFjZV9vYmogPSB7fTtcbiAgdHJhY2Vfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHI7XG4gIHRyYWNlX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkO1xuICB0cmFjZV9vYmouaXNfZmluaXNoZWQgPSBmYWxzZTtcbiAgc3RhcnRfc3RlcCA9IF8uZmluZChmbG93LmN1cnJlbnQuc3RlcHMsIGZ1bmN0aW9uKHN0ZXApIHtcbiAgICByZXR1cm4gc3RlcC5zdGVwX3R5cGUgPT09ICdzdGFydCc7XG4gIH0pO1xuICB0cmFjZV9vYmouc3RlcCA9IHN0YXJ0X3N0ZXAuX2lkO1xuICB0cmFjZV9vYmoubmFtZSA9IHN0YXJ0X3N0ZXAubmFtZTtcbiAgdHJhY2Vfb2JqLnN0YXJ0X2RhdGUgPSBub3c7XG4gIGFwcHJfb2JqID0ge307XG4gIGFwcHJfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHI7XG4gIGFwcHJfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWQ7XG4gIGFwcHJfb2JqLnRyYWNlID0gdHJhY2Vfb2JqLl9pZDtcbiAgYXBwcl9vYmouaXNfZmluaXNoZWQgPSBmYWxzZTtcbiAgYXBwcl9vYmoudXNlciA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gOiB1c2VyX2lkO1xuICBhcHByX29iai51c2VyX25hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA6IHVzZXJfaW5mby5uYW1lO1xuICBhcHByX29iai5oYW5kbGVyID0gdXNlcl9pZDtcbiAgYXBwcl9vYmouaGFuZGxlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWU7XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb247XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX25hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLm5hbWU7XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5mdWxsbmFtZTtcbiAgYXBwcl9vYmoudHlwZSA9ICdkcmFmdCc7XG4gIGFwcHJfb2JqLnN0YXJ0X2RhdGUgPSBub3c7XG4gIGFwcHJfb2JqLnJlYWRfZGF0ZSA9IG5vdztcbiAgYXBwcl9vYmouaXNfcmVhZCA9IHRydWU7XG4gIGFwcHJfb2JqLmlzX2Vycm9yID0gZmFsc2U7XG4gIGFwcHJfb2JqLmRlc2NyaXB0aW9uID0gJyc7XG4gIHJlbGF0ZWRUYWJsZXNJbmZvID0ge307XG4gIGFwcHJfb2JqLnZhbHVlcyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMoaW5zX29iai5yZWNvcmRfaWRzWzBdLCBmbG93X2lkLCBzcGFjZV9pZCwgZm9ybS5jdXJyZW50LmZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pO1xuICB0cmFjZV9vYmouYXBwcm92ZXMgPSBbYXBwcl9vYmpdO1xuICBpbnNfb2JqLnRyYWNlcyA9IFt0cmFjZV9vYmpdO1xuICBpbnNfb2JqLmluYm94X3VzZXJzID0gaW5zdGFuY2VfZnJvbV9jbGllbnQuaW5ib3hfdXNlcnMgfHwgW107XG4gIGluc19vYmouY3VycmVudF9zdGVwX25hbWUgPSBzdGFydF9zdGVwLm5hbWU7XG4gIGlmIChmbG93LmF1dG9fcmVtaW5kID09PSB0cnVlKSB7XG4gICAgaW5zX29iai5hdXRvX3JlbWluZCA9IHRydWU7XG4gIH1cbiAgaW5zX29iai5mbG93X25hbWUgPSBmbG93Lm5hbWU7XG4gIGlmIChmb3JtLmNhdGVnb3J5KSB7XG4gICAgY2F0ZWdvcnkgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldENhdGVnb3J5KGZvcm0uY2F0ZWdvcnkpO1xuICAgIGlmIChjYXRlZ29yeSkge1xuICAgICAgaW5zX29iai5jYXRlZ29yeV9uYW1lID0gY2F0ZWdvcnkubmFtZTtcbiAgICAgIGluc19vYmouY2F0ZWdvcnkgPSBjYXRlZ29yeS5faWQ7XG4gICAgfVxuICB9XG4gIG5ld19pbnNfaWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5pbnNlcnQoaW5zX29iaik7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8oaW5zX29iai5yZWNvcmRfaWRzWzBdLCBuZXdfaW5zX2lkLCBzcGFjZV9pZCk7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2goaW5zX29iai5yZWNvcmRfaWRzWzBdLCBzcGFjZV9pZCwgaW5zX29iai5faWQsIGFwcHJfb2JqLl9pZCk7XG4gIHJldHVybiBuZXdfaW5zX2lkO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVZhbHVlcyA9IGZ1bmN0aW9uKHJlY29yZElkcywgZmxvd0lkLCBzcGFjZUlkLCBmaWVsZHMsIHJlbGF0ZWRUYWJsZXNJbmZvKSB7XG4gIHZhciBmaWVsZENvZGVzLCBmaWx0ZXJWYWx1ZXMsIGZsb3csIGZvcm0sIGZvcm1GaWVsZHMsIGZvcm1UYWJsZUZpZWxkcywgZm9ybVRhYmxlRmllbGRzQ29kZSwgZ2V0RmllbGRPZGF0YVZhbHVlLCBnZXRGb3JtRmllbGQsIGdldEZvcm1UYWJsZUZpZWxkLCBnZXRGb3JtVGFibGVGaWVsZENvZGUsIGdldEZvcm1UYWJsZVN1YkZpZWxkLCBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlLCBnZXRTZWxlY3RPcmdWYWx1ZSwgZ2V0U2VsZWN0T3JnVmFsdWVzLCBnZXRTZWxlY3RVc2VyVmFsdWUsIGdldFNlbGVjdFVzZXJWYWx1ZXMsIG9iamVjdCwgb2JqZWN0TmFtZSwgb3csIHJlY29yZCwgcmVjb3JkSWQsIHJlZiwgcmVsYXRlZE9iamVjdHMsIHJlbGF0ZWRPYmplY3RzS2V5cywgdGFibGVGaWVsZENvZGVzLCB0YWJsZUZpZWxkTWFwLCB0YWJsZVRvUmVsYXRlZE1hcCwgdmFsdWVzO1xuICBmaWVsZENvZGVzID0gW107XG4gIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICBpZiAoZi50eXBlID09PSAnc2VjdGlvbicpIHtcbiAgICAgIHJldHVybiBfLmVhY2goZi5maWVsZHMsIGZ1bmN0aW9uKGZmKSB7XG4gICAgICAgIHJldHVybiBmaWVsZENvZGVzLnB1c2goZmYuY29kZSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpZWxkQ29kZXMucHVzaChmLmNvZGUpO1xuICAgIH1cbiAgfSk7XG4gIHZhbHVlcyA9IHt9O1xuICBvYmplY3ROYW1lID0gcmVjb3JkSWRzLm87XG4gIG9iamVjdCA9IGdldE9iamVjdENvbmZpZyhvYmplY3ROYW1lKTtcbiAgcmVjb3JkSWQgPSByZWNvcmRJZHMuaWRzWzBdO1xuICBvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3dvcmtmbG93cy5maW5kT25lKHtcbiAgICBvYmplY3RfbmFtZTogb2JqZWN0TmFtZSxcbiAgICBmbG93X2lkOiBmbG93SWRcbiAgfSk7XG4gIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKHJlY29yZElkKTtcbiAgZmxvdyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignZmxvd3MnKS5maW5kT25lKGZsb3dJZCwge1xuICAgIGZpZWxkczoge1xuICAgICAgZm9ybTogMVxuICAgIH1cbiAgfSk7XG4gIGlmIChvdyAmJiByZWNvcmQpIHtcbiAgICBmb3JtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiZm9ybXNcIikuZmluZE9uZShmbG93LmZvcm0pO1xuICAgIGZvcm1GaWVsZHMgPSBmb3JtLmN1cnJlbnQuZmllbGRzIHx8IFtdO1xuICAgIHJlbGF0ZWRPYmplY3RzID0gZ2V0UmVsYXRlZHMob2JqZWN0TmFtZSk7XG4gICAgcmVsYXRlZE9iamVjdHNLZXlzID0gXy5wbHVjayhyZWxhdGVkT2JqZWN0cywgJ29iamVjdF9uYW1lJyk7XG4gICAgZm9ybVRhYmxlRmllbGRzID0gXy5maWx0ZXIoZm9ybUZpZWxkcywgZnVuY3Rpb24oZm9ybUZpZWxkKSB7XG4gICAgICByZXR1cm4gZm9ybUZpZWxkLnR5cGUgPT09ICd0YWJsZSc7XG4gICAgfSk7XG4gICAgZm9ybVRhYmxlRmllbGRzQ29kZSA9IF8ucGx1Y2soZm9ybVRhYmxlRmllbGRzLCAnY29kZScpO1xuICAgIGdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBfLmZpbmQocmVsYXRlZE9iamVjdHNLZXlzLCBmdW5jdGlvbihyZWxhdGVkT2JqZWN0c0tleSkge1xuICAgICAgICByZXR1cm4ga2V5LnN0YXJ0c1dpdGgocmVsYXRlZE9iamVjdHNLZXkgKyAnLicpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRGb3JtVGFibGVGaWVsZENvZGUgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBfLmZpbmQoZm9ybVRhYmxlRmllbGRzQ29kZSwgZnVuY3Rpb24oZm9ybVRhYmxlRmllbGRDb2RlKSB7XG4gICAgICAgIHJldHVybiBrZXkuc3RhcnRzV2l0aChmb3JtVGFibGVGaWVsZENvZGUgKyAnLicpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRGb3JtVGFibGVGaWVsZCA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIF8uZmluZChmb3JtVGFibGVGaWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgcmV0dXJuIGYuY29kZSA9PT0ga2V5O1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRGb3JtRmllbGQgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBmZjtcbiAgICAgIGZmID0gbnVsbDtcbiAgICAgIF8uZm9yRWFjaChmb3JtRmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgIGlmIChmZikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZi50eXBlID09PSAnc2VjdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gZmYgPSBfLmZpbmQoZi5maWVsZHMsIGZ1bmN0aW9uKHNmKSB7XG4gICAgICAgICAgICByZXR1cm4gc2YuY29kZSA9PT0ga2V5O1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGYuY29kZSA9PT0ga2V5KSB7XG4gICAgICAgICAgcmV0dXJuIGZmID0gZjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZmY7XG4gICAgfTtcbiAgICBnZXRGb3JtVGFibGVTdWJGaWVsZCA9IGZ1bmN0aW9uKHRhYmxlRmllbGQsIHN1YkZpZWxkQ29kZSkge1xuICAgICAgcmV0dXJuIF8uZmluZCh0YWJsZUZpZWxkLmZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgICAgICByZXR1cm4gZi5jb2RlID09PSBzdWJGaWVsZENvZGU7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGdldEZpZWxkT2RhdGFWYWx1ZSA9IGZ1bmN0aW9uKG9iak5hbWUsIGlkKSB7XG4gICAgICB2YXIgX3JlY29yZCwgX3JlY29yZHMsIG5hbWVLZXksIG9iajtcbiAgICAgIG9iaiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKTtcbiAgICAgIG5hbWVLZXkgPSBnZXRPYmplY3ROYW1lRmllbGRLZXkob2JqTmFtZSk7XG4gICAgICBpZiAoIW9iaikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoXy5pc1N0cmluZyhpZCkpIHtcbiAgICAgICAgX3JlY29yZCA9IG9iai5maW5kT25lKGlkKTtcbiAgICAgICAgaWYgKF9yZWNvcmQpIHtcbiAgICAgICAgICBfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmRbbmFtZUtleV07XG4gICAgICAgICAgcmV0dXJuIF9yZWNvcmQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoXy5pc0FycmF5KGlkKSkge1xuICAgICAgICBfcmVjb3JkcyA9IFtdO1xuICAgICAgICBvYmouZmluZCh7XG4gICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAkaW46IGlkXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKF9yZWNvcmQpIHtcbiAgICAgICAgICBfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmRbbmFtZUtleV07XG4gICAgICAgICAgcmV0dXJuIF9yZWNvcmRzLnB1c2goX3JlY29yZCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIV8uaXNFbXB0eShfcmVjb3JkcykpIHtcbiAgICAgICAgICByZXR1cm4gX3JlY29yZHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGdldFNlbGVjdFVzZXJWYWx1ZSA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICAgICAgdmFyIHN1O1xuICAgICAgc3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0pO1xuICAgICAgc3UuaWQgPSB1c2VySWQ7XG4gICAgICByZXR1cm4gc3U7XG4gICAgfTtcbiAgICBnZXRTZWxlY3RVc2VyVmFsdWVzID0gZnVuY3Rpb24odXNlcklkcywgc3BhY2VJZCkge1xuICAgICAgdmFyIHN1cztcbiAgICAgIHN1cyA9IFtdO1xuICAgICAgaWYgKF8uaXNBcnJheSh1c2VySWRzKSkge1xuICAgICAgICBfLmVhY2godXNlcklkcywgZnVuY3Rpb24odXNlcklkKSB7XG4gICAgICAgICAgdmFyIHN1O1xuICAgICAgICAgIHN1ID0gZ2V0U2VsZWN0VXNlclZhbHVlKHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgICAgICAgaWYgKHN1KSB7XG4gICAgICAgICAgICByZXR1cm4gc3VzLnB1c2goc3UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VzO1xuICAgIH07XG4gICAgZ2V0U2VsZWN0T3JnVmFsdWUgPSBmdW5jdGlvbihvcmdJZCwgc3BhY2VJZCkge1xuICAgICAgdmFyIG9yZztcbiAgICAgIG9yZyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmRPbmUob3JnSWQsIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBvcmcuaWQgPSBvcmdJZDtcbiAgICAgIHJldHVybiBvcmc7XG4gICAgfTtcbiAgICBnZXRTZWxlY3RPcmdWYWx1ZXMgPSBmdW5jdGlvbihvcmdJZHMsIHNwYWNlSWQpIHtcbiAgICAgIHZhciBvcmdzO1xuICAgICAgb3JncyA9IFtdO1xuICAgICAgaWYgKF8uaXNBcnJheShvcmdJZHMpKSB7XG4gICAgICAgIF8uZWFjaChvcmdJZHMsIGZ1bmN0aW9uKG9yZ0lkKSB7XG4gICAgICAgICAgdmFyIG9yZztcbiAgICAgICAgICBvcmcgPSBnZXRTZWxlY3RPcmdWYWx1ZShvcmdJZCwgc3BhY2VJZCk7XG4gICAgICAgICAgaWYgKG9yZykge1xuICAgICAgICAgICAgcmV0dXJuIG9yZ3MucHVzaChvcmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3JncztcbiAgICB9O1xuICAgIHRhYmxlRmllbGRDb2RlcyA9IFtdO1xuICAgIHRhYmxlRmllbGRNYXAgPSBbXTtcbiAgICB0YWJsZVRvUmVsYXRlZE1hcCA9IHt9O1xuICAgIGlmICgocmVmID0gb3cuZmllbGRfbWFwKSAhPSBudWxsKSB7XG4gICAgICByZWYuZm9yRWFjaChmdW5jdGlvbihmbSkge1xuICAgICAgICB2YXIgZmllbGRzT2JqLCBmb3JtRmllbGQsIGZvcm1UYWJsZUZpZWxkQ29kZSwgZ3JpZENvZGUsIGxvb2t1cEZpZWxkTmFtZSwgbG9va3VwRmllbGRPYmosIGxvb2t1cE9iamVjdFJlY29yZCwgbG9va3VwU2VsZWN0RmllbGRWYWx1ZSwgb1RhYmxlQ29kZSwgb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLCBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGRDb2RlLCBvVGFibGVGaWVsZENvZGUsIG9iakZpZWxkLCBvYmplY3RGaWVsZCwgb2JqZWN0RmllbGROYW1lLCBvYmplY3RGaWVsZE9iamVjdE5hbWUsIG9iamVjdExvb2t1cEZpZWxkLCBvYmplY3RfZmllbGQsIG9kYXRhRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9Eb2MsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWxhdGVkT2JqZWN0RmllbGRDb2RlLCBzZWxlY3RGaWVsZFZhbHVlLCB0YWJsZVRvUmVsYXRlZE1hcEtleSwgd1RhYmxlQ29kZSwgd29ya2Zsb3dfZmllbGQ7XG4gICAgICAgIG9iamVjdF9maWVsZCA9IGZtLm9iamVjdF9maWVsZDtcbiAgICAgICAgd29ya2Zsb3dfZmllbGQgPSBmbS53b3JrZmxvd19maWVsZDtcbiAgICAgICAgaWYgKCFvYmplY3RfZmllbGQgfHwgIXdvcmtmbG93X2ZpZWxkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICfmnKrmib7liLDlrZfmrrXvvIzor7fmo4Dmn6Xlr7nosaHmtYHnqIvmmKDlsITlrZfmrrXphY3nva4nKTtcbiAgICAgICAgfVxuICAgICAgICByZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZShvYmplY3RfZmllbGQpO1xuICAgICAgICBmb3JtVGFibGVGaWVsZENvZGUgPSBnZXRGb3JtVGFibGVGaWVsZENvZGUod29ya2Zsb3dfZmllbGQpO1xuICAgICAgICBvYmpGaWVsZCA9IG9iamVjdC5maWVsZHNbb2JqZWN0X2ZpZWxkXTtcbiAgICAgICAgZm9ybUZpZWxkID0gZ2V0Rm9ybUZpZWxkKHdvcmtmbG93X2ZpZWxkKTtcbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZENvZGUpIHtcbiAgICAgICAgICBvVGFibGVDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgb1RhYmxlRmllbGRDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgdGFibGVUb1JlbGF0ZWRNYXBLZXkgPSBvVGFibGVDb2RlO1xuICAgICAgICAgIGlmICghdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldKSB7XG4gICAgICAgICAgICB0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0gPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZvcm1UYWJsZUZpZWxkQ29kZSkge1xuICAgICAgICAgICAgd1RhYmxlQ29kZSA9IHdvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgICB0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bJ19GUk9NX1RBQkxFX0NPREUnXSA9IHdUYWJsZUNvZGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bb1RhYmxlRmllbGRDb2RlXSA9IHdvcmtmbG93X2ZpZWxkO1xuICAgICAgICB9IGVsc2UgaWYgKHdvcmtmbG93X2ZpZWxkLmluZGV4T2YoJy4nKSA+IDAgJiYgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID4gMCkge1xuICAgICAgICAgIHdUYWJsZUNvZGUgPSB3b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgIG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzBdO1xuICAgICAgICAgIGlmIChyZWNvcmQuaGFzT3duUHJvcGVydHkob1RhYmxlQ29kZSkgJiYgXy5pc0FycmF5KHJlY29yZFtvVGFibGVDb2RlXSkpIHtcbiAgICAgICAgICAgIHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgd29ya2Zsb3dfdGFibGVfZmllbGRfY29kZTogd1RhYmxlQ29kZSxcbiAgICAgICAgICAgICAgb2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHJldHVybiB0YWJsZUZpZWxkTWFwLnB1c2goZm0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAob1RhYmxlQ29kZS5pbmRleE9mKCcuJykgPiAwKSB7XG4gICAgICAgICAgICBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGRDb2RlID0gb1RhYmxlQ29kZS5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgICAgZ3JpZENvZGUgPSBvVGFibGVDb2RlLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQgPSBvYmplY3QuZmllbGRzW29UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZENvZGVdO1xuICAgICAgICAgICAgaWYgKG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZCAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgaWYgKHJlY29yZFtvVGFibGVDb2RlXSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWZlcmVuY2VUb09iamVjdE5hbWUgPSBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSByZWNvcmRbb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLm5hbWVdO1xuICAgICAgICAgICAgICByZWZlcmVuY2VUb0RvYyA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSk7XG4gICAgICAgICAgICAgIGlmIChyZWZlcmVuY2VUb0RvY1tncmlkQ29kZV0pIHtcbiAgICAgICAgICAgICAgICByZWNvcmRbb1RhYmxlQ29kZV0gPSByZWZlcmVuY2VUb0RvY1tncmlkQ29kZV07XG4gICAgICAgICAgICAgICAgdGFibGVGaWVsZENvZGVzLnB1c2goSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgd29ya2Zsb3dfdGFibGVfZmllbGRfY29kZTogd1RhYmxlQ29kZSxcbiAgICAgICAgICAgICAgICAgIG9iamVjdF90YWJsZV9maWVsZF9jb2RlOiBvVGFibGVDb2RlXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0YWJsZUZpZWxkTWFwLnB1c2goZm0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG9iamVjdF9maWVsZC5pbmRleE9mKCcuJykgPiAwICYmIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA9PT0gLTEpIHtcbiAgICAgICAgICBvYmplY3RGaWVsZE5hbWUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICBsb29rdXBGaWVsZE5hbWUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgICAgICBvYmplY3RGaWVsZCA9IG9iamVjdC5maWVsZHNbb2JqZWN0RmllbGROYW1lXTtcbiAgICAgICAgICAgIGlmIChvYmplY3RGaWVsZCAmJiBmb3JtRmllbGQgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iamVjdEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICBmaWVsZHNPYmogPSB7fTtcbiAgICAgICAgICAgICAgZmllbGRzT2JqW2xvb2t1cEZpZWxkTmFtZV0gPSAxO1xuICAgICAgICAgICAgICBsb29rdXBPYmplY3RSZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kT25lKHJlY29yZFtvYmplY3RGaWVsZE5hbWVdLCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiBmaWVsZHNPYmpcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIG9iamVjdEZpZWxkT2JqZWN0TmFtZSA9IG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgbG9va3VwRmllbGRPYmogPSBnZXRPYmplY3RDb25maWcob2JqZWN0RmllbGRPYmplY3ROYW1lKTtcbiAgICAgICAgICAgICAgb2JqZWN0TG9va3VwRmllbGQgPSBsb29rdXBGaWVsZE9iai5maWVsZHNbbG9va3VwRmllbGROYW1lXTtcbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gbG9va3VwT2JqZWN0UmVjb3JkW2xvb2t1cEZpZWxkTmFtZV07XG4gICAgICAgICAgICAgIGlmIChvYmplY3RMb29rdXBGaWVsZCAmJiBmb3JtRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iamVjdExvb2t1cEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChvYmplY3RMb29rdXBGaWVsZCAmJiBmb3JtRmllbGQgJiYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RMb29rdXBGaWVsZC50eXBlKSAmJiBbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgbG9va3VwU2VsZWN0RmllbGRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ3VzZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICBsb29rdXBTZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgbG9va3VwU2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1GaWVsZC50eXBlID09PSAnZ3JvdXAnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICBsb29rdXBTZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIW9iamVjdExvb2t1cEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICBsb29rdXBTZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBsb29rdXBTZWxlY3RGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IGxvb2t1cE9iamVjdFJlY29yZFtsb29rdXBGaWVsZE5hbWVdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqRmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvYmpGaWVsZC5uYW1lXTtcbiAgICAgICAgICBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgICAgaWYgKG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiBbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdO1xuICAgICAgICAgIGlmICghXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWU7XG4gICAgICAgICAgICBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICBpZiAob2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgICAgICBpZiAob2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxlY3RGaWVsZFZhbHVlKSB7XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gc2VsZWN0RmllbGRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLmhhc093blByb3BlcnR5KG9iamVjdF9maWVsZCkpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHJlY29yZFtvYmplY3RfZmllbGRdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgXy51bmlxKHRhYmxlRmllbGRDb2RlcykuZm9yRWFjaChmdW5jdGlvbih0ZmMpIHtcbiAgICAgIHZhciBjO1xuICAgICAgYyA9IEpTT04ucGFyc2UodGZjKTtcbiAgICAgIHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdID0gW107XG4gICAgICByZXR1cm4gcmVjb3JkW2Mub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGVdLmZvckVhY2goZnVuY3Rpb24odHIpIHtcbiAgICAgICAgdmFyIG5ld1RyO1xuICAgICAgICBuZXdUciA9IHt9O1xuICAgICAgICBfLmVhY2godHIsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgICByZXR1cm4gdGFibGVGaWVsZE1hcC5mb3JFYWNoKGZ1bmN0aW9uKHRmbSkge1xuICAgICAgICAgICAgdmFyIHdUZENvZGU7XG4gICAgICAgICAgICBpZiAodGZtLm9iamVjdF9maWVsZCA9PT0gKGMub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGUgKyAnLiQuJyArIGspKSB7XG4gICAgICAgICAgICAgIHdUZENvZGUgPSB0Zm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5ld1RyW3dUZENvZGVdID0gdjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghXy5pc0VtcHR5KG5ld1RyKSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXS5wdXNoKG5ld1RyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgXy5lYWNoKHRhYmxlVG9SZWxhdGVkTWFwLCBmdW5jdGlvbihtYXAsIGtleSkge1xuICAgICAgdmFyIGZvcm1UYWJsZUZpZWxkLCByZWxhdGVkQ29sbGVjdGlvbiwgcmVsYXRlZEZpZWxkLCByZWxhdGVkRmllbGROYW1lLCByZWxhdGVkT2JqZWN0LCByZWxhdGVkT2JqZWN0TmFtZSwgcmVsYXRlZFJlY29yZHMsIHJlbGF0ZWRUYWJsZUl0ZW1zLCBzZWxlY3RvciwgdGFibGVDb2RlLCB0YWJsZVZhbHVlcztcbiAgICAgIHRhYmxlQ29kZSA9IG1hcC5fRlJPTV9UQUJMRV9DT0RFO1xuICAgICAgZm9ybVRhYmxlRmllbGQgPSBnZXRGb3JtVGFibGVGaWVsZCh0YWJsZUNvZGUpO1xuICAgICAgaWYgKCF0YWJsZUNvZGUpIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUud2FybigndGFibGVUb1JlbGF0ZWQ6IFsnICsga2V5ICsgJ10gbWlzc2luZyBjb3JyZXNwb25kaW5nIHRhYmxlLicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVsYXRlZE9iamVjdE5hbWUgPSBrZXk7XG4gICAgICAgIHRhYmxlVmFsdWVzID0gW107XG4gICAgICAgIHJlbGF0ZWRUYWJsZUl0ZW1zID0gW107XG4gICAgICAgIHJlbGF0ZWRPYmplY3QgPSBnZXRPYmplY3RDb25maWcocmVsYXRlZE9iamVjdE5hbWUpO1xuICAgICAgICByZWxhdGVkRmllbGQgPSBfLmZpbmQocmVsYXRlZE9iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICByZXR1cm4gWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKGYudHlwZSkgJiYgZi5yZWZlcmVuY2VfdG8gPT09IG9iamVjdE5hbWU7XG4gICAgICAgIH0pO1xuICAgICAgICByZWxhdGVkRmllbGROYW1lID0gcmVsYXRlZEZpZWxkLm5hbWU7XG4gICAgICAgIHNlbGVjdG9yID0ge307XG4gICAgICAgIHNlbGVjdG9yW3JlbGF0ZWRGaWVsZE5hbWVdID0gcmVjb3JkSWQ7XG4gICAgICAgIHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKTtcbiAgICAgICAgcmVsYXRlZFJlY29yZHMgPSByZWxhdGVkQ29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKTtcbiAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChmdW5jdGlvbihycikge1xuICAgICAgICAgIHZhciB0YWJsZVZhbHVlSXRlbTtcbiAgICAgICAgICB0YWJsZVZhbHVlSXRlbSA9IHt9O1xuICAgICAgICAgIF8uZWFjaChtYXAsIGZ1bmN0aW9uKHZhbHVlS2V5LCBmaWVsZEtleSkge1xuICAgICAgICAgICAgdmFyIGZvcm1GaWVsZCwgZm9ybUZpZWxkS2V5LCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVsYXRlZE9iamVjdEZpZWxkLCB0YWJsZUZpZWxkVmFsdWU7XG4gICAgICAgICAgICBpZiAoZmllbGRLZXkgIT09ICdfRlJPTV9UQUJMRV9DT0RFJykge1xuICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWU7XG4gICAgICAgICAgICAgIGZvcm1GaWVsZEtleTtcbiAgICAgICAgICAgICAgaWYgKHZhbHVlS2V5LnN0YXJ0c1dpdGgodGFibGVDb2RlICsgJy4nKSkge1xuICAgICAgICAgICAgICAgIGZvcm1GaWVsZEtleSA9ICh2YWx1ZUtleS5zcGxpdChcIi5cIilbMV0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvcm1GaWVsZEtleSA9IHZhbHVlS2V5O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGZvcm1GaWVsZCA9IGdldEZvcm1UYWJsZVN1YkZpZWxkKGZvcm1UYWJsZUZpZWxkLCBmb3JtRmllbGRLZXkpO1xuICAgICAgICAgICAgICByZWxhdGVkT2JqZWN0RmllbGQgPSByZWxhdGVkT2JqZWN0LmZpZWxkc1tmaWVsZEtleV07XG4gICAgICAgICAgICAgIGlmICghZm9ybUZpZWxkIHx8ICFyZWxhdGVkT2JqZWN0RmllbGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGZvcm1GaWVsZC50eXBlID09PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhyZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcnJbZmllbGRLZXldO1xuICAgICAgICAgICAgICAgIGlmIChyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC50eXBlKSAmJiBbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XTtcbiAgICAgICAgICAgICAgICBpZiAoIV8uaXNFbXB0eShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gcnJbZmllbGRLZXldO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB0YWJsZVZhbHVlSXRlbVtmb3JtRmllbGRLZXldID0gdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICghXy5pc0VtcHR5KHRhYmxlVmFsdWVJdGVtKSkge1xuICAgICAgICAgICAgdGFibGVWYWx1ZUl0ZW0uX2lkID0gcnIuX2lkO1xuICAgICAgICAgICAgdGFibGVWYWx1ZXMucHVzaCh0YWJsZVZhbHVlSXRlbSk7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZFRhYmxlSXRlbXMucHVzaCh7XG4gICAgICAgICAgICAgIF90YWJsZToge1xuICAgICAgICAgICAgICAgIF9pZDogcnIuX2lkLFxuICAgICAgICAgICAgICAgIF9jb2RlOiB0YWJsZUNvZGVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdmFsdWVzW3RhYmxlQ29kZV0gPSB0YWJsZVZhbHVlcztcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRUYWJsZXNJbmZvW3JlbGF0ZWRPYmplY3ROYW1lXSA9IHJlbGF0ZWRUYWJsZUl0ZW1zO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChvdy5maWVsZF9tYXBfc2NyaXB0KSB7XG4gICAgICBfLmV4dGVuZCh2YWx1ZXMsIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0KG93LmZpZWxkX21hcF9zY3JpcHQsIG9iamVjdE5hbWUsIHNwYWNlSWQsIHJlY29yZElkKSk7XG4gICAgfVxuICB9XG4gIGZpbHRlclZhbHVlcyA9IHt9O1xuICBfLmVhY2goXy5rZXlzKHZhbHVlcyksIGZ1bmN0aW9uKGspIHtcbiAgICBpZiAoZmllbGRDb2Rlcy5pbmNsdWRlcyhrKSkge1xuICAgICAgcmV0dXJuIGZpbHRlclZhbHVlc1trXSA9IHZhbHVlc1trXTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmlsdGVyVmFsdWVzO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5ldmFsRmllbGRNYXBTY3JpcHQgPSBmdW5jdGlvbihmaWVsZF9tYXBfc2NyaXB0LCBvYmplY3ROYW1lLCBzcGFjZUlkLCBvYmplY3RJZCkge1xuICB2YXIgZnVuYywgcmVjb3JkLCBzY3JpcHQsIHZhbHVlcztcbiAgcmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLmZpbmRPbmUob2JqZWN0SWQpO1xuICBzY3JpcHQgPSBcIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJlY29yZCkgeyBcIiArIGZpZWxkX21hcF9zY3JpcHQgKyBcIiB9XCI7XG4gIGZ1bmMgPSBfZXZhbChzY3JpcHQsIFwiZmllbGRfbWFwX3NjcmlwdFwiKTtcbiAgdmFsdWVzID0gZnVuYyhyZWNvcmQpO1xuICBpZiAoXy5pc09iamVjdCh2YWx1ZXMpKSB7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKFwiZXZhbEZpZWxkTWFwU2NyaXB0OiDohJrmnKzov5Tlm57lgLznsbvlnovkuI3mmK/lr7nosaFcIik7XG4gIH1cbiAgcmV0dXJuIHt9O1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZUF0dGFjaCA9IGZ1bmN0aW9uKHJlY29yZElkcywgc3BhY2VJZCwgaW5zSWQsIGFwcHJvdmVJZCkge1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zWydjbXNfZmlsZXMnXS5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICBwYXJlbnQ6IHJlY29yZElkc1xuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGNmKSB7XG4gICAgcmV0dXJuIF8uZWFjaChjZi52ZXJzaW9ucywgZnVuY3Rpb24odmVyc2lvbklkLCBpZHgpIHtcbiAgICAgIHZhciBmLCBuZXdGaWxlO1xuICAgICAgZiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ10uZmluZE9uZSh2ZXJzaW9uSWQpO1xuICAgICAgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XG4gICAgICByZXR1cm4gbmV3RmlsZS5hdHRhY2hEYXRhKGYuY3JlYXRlUmVhZFN0cmVhbSgnZmlsZXMnKSwge1xuICAgICAgICB0eXBlOiBmLm9yaWdpbmFsLnR5cGVcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICB2YXIgbWV0YWRhdGE7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbik7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RmlsZS5uYW1lKGYubmFtZSgpKTtcbiAgICAgICAgbmV3RmlsZS5zaXplKGYuc2l6ZSgpKTtcbiAgICAgICAgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgb3duZXI6IGYubWV0YWRhdGEub3duZXIsXG4gICAgICAgICAgb3duZXJfbmFtZTogZi5tZXRhZGF0YS5vd25lcl9uYW1lLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgIGluc3RhbmNlOiBpbnNJZCxcbiAgICAgICAgICBhcHByb3ZlOiBhcHByb3ZlSWQsXG4gICAgICAgICAgcGFyZW50OiBjZi5faWRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGlkeCA9PT0gMCkge1xuICAgICAgICAgIG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgcmV0dXJuIGNmcy5pbnN0YW5jZXMuaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlY29yZEluc3RhbmNlSW5mbyA9IGZ1bmN0aW9uKHJlY29yZElkcywgaW5zSWQsIHNwYWNlSWQpIHtcbiAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlY29yZElkcy5vLCBzcGFjZUlkKS51cGRhdGUocmVjb3JkSWRzLmlkc1swXSwge1xuICAgICRwdXNoOiB7XG4gICAgICBpbnN0YW5jZXM6IHtcbiAgICAgICAgJGVhY2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBfaWQ6IGluc0lkLFxuICAgICAgICAgICAgc3RhdGU6ICdkcmFmdCdcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgICRwb3NpdGlvbjogMFxuICAgICAgfVxuICAgIH0sXG4gICAgJHNldDoge1xuICAgICAgbG9ja2VkOiB0cnVlLFxuICAgICAgaW5zdGFuY2Vfc3RhdGU6ICdkcmFmdCdcbiAgICB9XG4gIH0pO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlbGF0ZWRSZWNvcmRJbnN0YW5jZUluZm8gPSBmdW5jdGlvbihyZWxhdGVkVGFibGVzSW5mbywgaW5zSWQsIHNwYWNlSWQpIHtcbiAgXy5lYWNoKHJlbGF0ZWRUYWJsZXNJbmZvLCBmdW5jdGlvbih0YWJsZUl0ZW1zLCByZWxhdGVkT2JqZWN0TmFtZSkge1xuICAgIHZhciByZWxhdGVkQ29sbGVjdGlvbjtcbiAgICByZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCk7XG4gICAgcmV0dXJuIF8uZWFjaCh0YWJsZUl0ZW1zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICByZXR1cm4gcmVsYXRlZENvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShpdGVtLl90YWJsZS5faWQsIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGluc3RhbmNlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBfaWQ6IGluc0lkLFxuICAgICAgICAgICAgICBzdGF0ZTogJ2RyYWZ0J1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAgX3RhYmxlOiBpdGVtLl90YWJsZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsID0gZnVuY3Rpb24ocmVjb3JkSWRzLCBzcGFjZUlkKSB7XG4gIHZhciByZWNvcmQ7XG4gIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkuZmluZE9uZSh7XG4gICAgX2lkOiByZWNvcmRJZHMuaWRzWzBdLFxuICAgIGluc3RhbmNlczoge1xuICAgICAgJGV4aXN0czogdHJ1ZVxuICAgIH1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgaW5zdGFuY2VzOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKHJlY29yZCAmJiByZWNvcmQuaW5zdGFuY2VzWzBdLnN0YXRlICE9PSAnY29tcGxldGVkJyAmJiBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kKHJlY29yZC5pbnN0YW5jZXNbMF0uX2lkKS5jb3VudCgpID4gMCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5q2k6K6w5b2V5bey5Y+R6LW35rWB56iL5q2j5Zyo5a6h5om55Lit77yM5b6F5a6h5om557uT5p2f5pa55Y+v5Y+R6LW35LiL5LiA5qyh5a6h5om577yBXCIpO1xuICB9XG59O1xuIiwic3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKVxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL3MzL1wiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXG5cdEpzb25Sb3V0ZXMucGFyc2VGaWxlcyByZXEsIHJlcywgKCktPlxuXHRcdGNvbGxlY3Rpb24gPSBjZnMuZmlsZXNcblx0XHRmaWxlQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0T2JqZWN0KFwiY21zX2ZpbGVzXCIpLmRiXG5cblx0XHRpZiByZXEuZmlsZXMgYW5kIHJlcS5maWxlc1swXVxuXG5cdFx0XHRuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcblx0XHRcdG5ld0ZpbGUuYXR0YWNoRGF0YSByZXEuZmlsZXNbMF0uZGF0YSwge3R5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZX0sIChlcnIpIC0+XG5cdFx0XHRcdGZpbGVuYW1lID0gcmVxLmZpbGVzWzBdLmZpbGVuYW1lXG5cdFx0XHRcdGV4dGVudGlvbiA9IGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKClcblx0XHRcdFx0aWYgW1wiaW1hZ2UuanBnXCIsIFwiaW1hZ2UuZ2lmXCIsIFwiaW1hZ2UuanBlZ1wiLCBcImltYWdlLnBuZ1wiXS5pbmNsdWRlcyhmaWxlbmFtZS50b0xvd2VyQ2FzZSgpKVxuXHRcdFx0XHRcdGZpbGVuYW1lID0gXCJpbWFnZS1cIiArIG1vbWVudChuZXcgRGF0ZSgpKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzJykgKyBcIi5cIiArIGV4dGVudGlvblxuXG5cdFx0XHRcdGJvZHkgPSByZXEuYm9keVxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRpZiBib2R5ICYmIChib2R5Wyd1cGxvYWRfZnJvbSddIGlzIFwiSUVcIiBvciBib2R5Wyd1cGxvYWRfZnJvbSddIGlzIFwibm9kZVwiKVxuXHRcdFx0XHRcdFx0ZmlsZW5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQoZmlsZW5hbWUpXG5cdFx0XHRcdGNhdGNoIGVcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGZpbGVuYW1lKVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZVxuXHRcdFx0XHRcdGZpbGVuYW1lID0gZmlsZW5hbWUucmVwbGFjZSgvJS9nLCBcIi1cIilcblxuXHRcdFx0XHRuZXdGaWxlLm5hbWUoZmlsZW5hbWUpXG5cblx0XHRcdFx0aWYgYm9keSAmJiBib2R5Wydvd25lciddICYmIGJvZHlbJ3NwYWNlJ10gJiYgYm9keVsncmVjb3JkX2lkJ10gICYmIGJvZHlbJ29iamVjdF9uYW1lJ11cblx0XHRcdFx0XHRwYXJlbnQgPSBib2R5WydwYXJlbnQnXVxuXHRcdFx0XHRcdG93bmVyID0gYm9keVsnb3duZXInXVxuXHRcdFx0XHRcdG93bmVyX25hbWUgPSBib2R5Wydvd25lcl9uYW1lJ11cblx0XHRcdFx0XHRzcGFjZSA9IGJvZHlbJ3NwYWNlJ11cblx0XHRcdFx0XHRyZWNvcmRfaWQgPSBib2R5WydyZWNvcmRfaWQnXVxuXHRcdFx0XHRcdG9iamVjdF9uYW1lID0gYm9keVsnb2JqZWN0X25hbWUnXVxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uID0gYm9keVsnZGVzY3JpcHRpb24nXVxuXHRcdFx0XHRcdHBhcmVudCA9IGJvZHlbJ3BhcmVudCddXG5cdFx0XHRcdFx0bWV0YWRhdGEgPSB7b3duZXI6b3duZXIsIG93bmVyX25hbWU6b3duZXJfbmFtZSwgc3BhY2U6c3BhY2UsIHJlY29yZF9pZDpyZWNvcmRfaWQsIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZX1cblx0XHRcdFx0XHRpZiBwYXJlbnRcblx0XHRcdFx0XHRcdG1ldGFkYXRhLnBhcmVudCA9IHBhcmVudFxuXHRcdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YVxuXHRcdFx0XHRcdGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXG5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXG5cblxuXHRcdFx0XHRzaXplID0gZmlsZU9iai5vcmlnaW5hbC5zaXplXG5cdFx0XHRcdGlmICFzaXplXG5cdFx0XHRcdFx0c2l6ZSA9IDEwMjRcblx0XHRcdFx0aWYgcGFyZW50XG5cdFx0XHRcdFx0ZmlsZUNvbGxlY3Rpb24udXBkYXRlKHtfaWQ6cGFyZW50fSx7XG5cdFx0XHRcdFx0XHQkc2V0OlxuXHRcdFx0XHRcdFx0XHRuYW1lOiBmaWxlbmFtZVxuXHRcdFx0XHRcdFx0XHRleHRlbnRpb246IGV4dGVudGlvblxuXHRcdFx0XHRcdFx0XHRzaXplOiBzaXplXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkOiAobmV3IERhdGUoKSlcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IG93bmVyXG5cdFx0XHRcdFx0XHQkcHVzaDpcblx0XHRcdFx0XHRcdFx0dmVyc2lvbnM6XG5cdFx0XHRcdFx0XHRcdFx0JGVhY2g6IFsgZmlsZU9iai5faWQgXVxuXHRcdFx0XHRcdFx0XHRcdCRwb3NpdGlvbjogMFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRuZXdGaWxlT2JqSWQgPSBmaWxlQ29sbGVjdGlvbi5kaXJlY3QuaW5zZXJ0IHtcblx0XHRcdFx0XHRcdG5hbWU6IGZpbGVuYW1lXG5cdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogZGVzY3JpcHRpb25cblx0XHRcdFx0XHRcdGV4dGVudGlvbjogZXh0ZW50aW9uXG5cdFx0XHRcdFx0XHRzaXplOiBzaXplXG5cdFx0XHRcdFx0XHR2ZXJzaW9uczogW2ZpbGVPYmouX2lkXVxuXHRcdFx0XHRcdFx0cGFyZW50OiB7bzpvYmplY3RfbmFtZSxpZHM6W3JlY29yZF9pZF19XG5cdFx0XHRcdFx0XHRvd25lcjogb3duZXJcblx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZVxuXHRcdFx0XHRcdFx0Y3JlYXRlZDogKG5ldyBEYXRlKCkpXG5cdFx0XHRcdFx0XHRjcmVhdGVkX2J5OiBvd25lclxuXHRcdFx0XHRcdFx0bW9kaWZpZWQ6IChuZXcgRGF0ZSgpKVxuXHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IG93bmVyXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGZpbGVPYmoudXBkYXRlKHskc2V0OiB7J21ldGFkYXRhLnBhcmVudCcgOiBuZXdGaWxlT2JqSWR9fSlcblxuXHRcdFx0bmV3RmlsZS5vbmNlICdzdG9yZWQnLCAoc3RvcmVOYW1lKS0+XG5cdFx0XHRcdHNpemUgPSBuZXdGaWxlLm9yaWdpbmFsLnNpemVcblx0XHRcdFx0aWYgIXNpemVcblx0XHRcdFx0XHRzaXplID0gMTAyNFxuXHRcdFx0XHRyZXNwID1cblx0XHRcdFx0XHR2ZXJzaW9uX2lkOiBuZXdGaWxlLl9pZCxcblx0XHRcdFx0XHRzaXplOiBzaXplXG5cdFx0XHRcdHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xuXHRcdFx0XHRyZXR1cm5cblx0XHRlbHNlXG5cdFx0XHRyZXMuc3RhdHVzQ29kZSA9IDUwMDtcblx0XHRcdHJlcy5lbmQoKTtcblxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL3MzLzpjb2xsZWN0aW9uXCIsICAocmVxLCByZXMsIG5leHQpIC0+XG5cdHRyeVxuXG5cdFx0dXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKChyZXEsIHJlcywgY2IpLT5cblx0XHRcdHN0ZWVkb3NBdXRoLmF1dGgocmVxLCByZXMpLnRoZW4gKHJlc29sdmUsIHJlamVjdCktPlxuXHRcdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXG5cdFx0KShyZXEsIHJlcylcblx0XHR1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWRcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBwZXJtaXNzaW9uXCIpXG5cblx0XHRjb2xsZWN0aW9uTmFtZSA9IHJlcS5wYXJhbXMuY29sbGVjdGlvblxuXG5cdFx0SnNvblJvdXRlcy5wYXJzZUZpbGVzIHJlcSwgcmVzLCAoKS0+XG5cdFx0XHRjb2xsZWN0aW9uID0gY2ZzW2NvbGxlY3Rpb25OYW1lXVxuXG5cdFx0XHRpZiBub3QgY29sbGVjdGlvblxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBDb2xsZWN0aW9uXCIpXG5cblx0XHRcdGlmIHJlcS5maWxlcyBhbmQgcmVxLmZpbGVzWzBdXG5cblx0XHRcdFx0bmV3RmlsZSA9IG5ldyBGUy5GaWxlKClcblx0XHRcdFx0bmV3RmlsZS5uYW1lKHJlcS5maWxlc1swXS5maWxlbmFtZSlcblxuXHRcdFx0XHRpZiByZXEuYm9keVxuXHRcdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEgPSByZXEuYm9keVxuXG5cdFx0XHRcdG5ld0ZpbGUub3duZXIgPSB1c2VySWRcblx0XHRcdFx0bmV3RmlsZS5tZXRhZGF0YS5vd25lciA9IHVzZXJJZFxuXG5cdFx0XHRcdG5ld0ZpbGUuYXR0YWNoRGF0YSByZXEuZmlsZXNbMF0uZGF0YSwge3R5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZX1cblxuXHRcdFx0XHRjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXG5cblx0XHRcdFx0bmV3RmlsZS5vbmNlICdzdG9yZWQnLCAoc3RvcmVOYW1lKS0+XG5cdFx0XHRcdFx0cmVzdWx0RGF0YSA9IGNvbGxlY3Rpb24uZmlsZXMuZmluZE9uZShuZXdGaWxlLl9pZClcblx0XHRcdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0XHRcdFx0Y29kZTogMjAwXG5cdFx0XHRcdFx0XHRkYXRhOiByZXN1bHREYXRhXG5cdFx0XHRcdFx0cmV0dXJuXG5cblx0XHRcdFx0XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIEZpbGVcIilcblxuXHRcdHJldHVyblxuXHRjYXRjaCBlXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogZS5lcnJvciB8fCA1MDBcblx0XHRcdGRhdGE6IHtlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZX1cblx0XHR9XG5cblxuXG5nZXRRdWVyeVN0cmluZyA9IChhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBxdWVyeSwgbWV0aG9kKSAtPlxuXHRjb25zb2xlLmxvZyBcIi0tLS11dWZsb3dNYW5hZ2VyLmdldFF1ZXJ5U3RyaW5nLS0tLVwiXG5cdEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKVxuXHRkYXRlID0gQUxZLnV0aWwuZGF0ZS5nZXREYXRlKClcblxuXHRxdWVyeS5Gb3JtYXQgPSBcImpzb25cIlxuXHRxdWVyeS5WZXJzaW9uID0gXCIyMDE3LTAzLTIxXCJcblx0cXVlcnkuQWNjZXNzS2V5SWQgPSBhY2Nlc3NLZXlJZFxuXHRxdWVyeS5TaWduYXR1cmVNZXRob2QgPSBcIkhNQUMtU0hBMVwiXG5cdHF1ZXJ5LlRpbWVzdGFtcCA9IEFMWS51dGlsLmRhdGUuaXNvODYwMShkYXRlKVxuXHRxdWVyeS5TaWduYXR1cmVWZXJzaW9uID0gXCIxLjBcIlxuXHRxdWVyeS5TaWduYXR1cmVOb25jZSA9IFN0cmluZyhkYXRlLmdldFRpbWUoKSlcblxuXHRxdWVyeUtleXMgPSBPYmplY3Qua2V5cyhxdWVyeSlcblx0cXVlcnlLZXlzLnNvcnQoKVxuXG5cdGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyA9IFwiXCJcblx0cXVlcnlLZXlzLmZvckVhY2ggKG5hbWUpIC0+XG5cdFx0Y2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nICs9IFwiJlwiICsgbmFtZSArIFwiPVwiICsgQUxZLnV0aWwucG9wRXNjYXBlKHF1ZXJ5W25hbWVdKVxuXG5cdHN0cmluZ1RvU2lnbiA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpICsgJyYlMkYmJyArIEFMWS51dGlsLnBvcEVzY2FwZShjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcuc3Vic3RyKDEpKVxuXG5cdHF1ZXJ5LlNpZ25hdHVyZSA9IEFMWS51dGlsLmNyeXB0by5obWFjKHNlY3JldEFjY2Vzc0tleSArICcmJywgc3RyaW5nVG9TaWduLCAnYmFzZTY0JywgJ3NoYTEnKVxuXG5cdHF1ZXJ5U3RyID0gQUxZLnV0aWwucXVlcnlQYXJhbXNUb1N0cmluZyhxdWVyeSlcblx0Y29uc29sZS5sb2cgcXVlcnlTdHJcblx0cmV0dXJuIHF1ZXJ5U3RyXG5cbkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9zMy92b2QvdXBsb2FkXCIsICAocmVxLCByZXMsIG5leHQpIC0+XG5cdHRyeVxuXHRcdHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcylcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBwZXJtaXNzaW9uXCIpXG5cblx0XHRjb2xsZWN0aW9uTmFtZSA9IFwidmlkZW9zXCJcblxuXHRcdEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKVxuXG5cdFx0SnNvblJvdXRlcy5wYXJzZUZpbGVzIHJlcSwgcmVzLCAoKS0+XG5cdFx0XHRjb2xsZWN0aW9uID0gY2ZzW2NvbGxlY3Rpb25OYW1lXVxuXG5cdFx0XHRpZiBub3QgY29sbGVjdGlvblxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBDb2xsZWN0aW9uXCIpXG5cblx0XHRcdGlmIHJlcS5maWxlcyBhbmQgcmVxLmZpbGVzWzBdXG5cblx0XHRcdFx0aWYgY29sbGVjdGlvbk5hbWUgaXMgJ3ZpZGVvcycgYW5kIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuY2ZzPy5zdG9yZSBpcyBcIk9TU1wiXG5cdFx0XHRcdFx0YWNjZXNzS2V5SWQgPSBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bj8uYWNjZXNzS2V5SWRcblx0XHRcdFx0XHRzZWNyZXRBY2Nlc3NLZXkgPSBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bj8uc2VjcmV0QWNjZXNzS2V5XG5cblx0XHRcdFx0XHRkYXRlID0gQUxZLnV0aWwuZGF0ZS5nZXREYXRlKClcblxuXHRcdFx0XHRcdHF1ZXJ5ID0ge1xuXHRcdFx0XHRcdFx0QWN0aW9uOiBcIkNyZWF0ZVVwbG9hZFZpZGVvXCJcblx0XHRcdFx0XHRcdFRpdGxlOiByZXEuZmlsZXNbMF0uZmlsZW5hbWVcblx0XHRcdFx0XHRcdEZpbGVOYW1lOiByZXEuZmlsZXNbMF0uZmlsZW5hbWVcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR1cmwgPSBcImh0dHA6Ly92b2QuY24tc2hhbmdoYWkuYWxpeXVuY3MuY29tLz9cIiArIGdldFF1ZXJ5U3RyaW5nKGFjY2Vzc0tleUlkLCBzZWNyZXRBY2Nlc3NLZXksIHF1ZXJ5LCAnR0VUJylcblxuXHRcdFx0XHRcdHIgPSBIVFRQLmNhbGwgJ0dFVCcsIHVybFxuXG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgclxuXG5cdFx0XHRcdFx0aWYgci5kYXRhPy5WaWRlb0lkXG5cdFx0XHRcdFx0XHR2aWRlb0lkID0gci5kYXRhLlZpZGVvSWRcblx0XHRcdFx0XHRcdHVwbG9hZEFkZHJlc3MgPSBKU09OLnBhcnNlKG5ldyBCdWZmZXIoci5kYXRhLlVwbG9hZEFkZHJlc3MsICdiYXNlNjQnKS50b1N0cmluZygpKVxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cgdXBsb2FkQWRkcmVzc1xuXHRcdFx0XHRcdFx0dXBsb2FkQXV0aCA9IEpTT04ucGFyc2UobmV3IEJ1ZmZlcihyLmRhdGEuVXBsb2FkQXV0aCwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCkpXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyB1cGxvYWRBdXRoXG5cblx0XHRcdFx0XHRcdG9zcyA9IG5ldyBBTFkuT1NTKHtcblx0XHRcdFx0XHRcdFx0XCJhY2Nlc3NLZXlJZFwiOiB1cGxvYWRBdXRoLkFjY2Vzc0tleUlkLFxuXHRcdFx0XHRcdFx0XHRcInNlY3JldEFjY2Vzc0tleVwiOiB1cGxvYWRBdXRoLkFjY2Vzc0tleVNlY3JldCxcblx0XHRcdFx0XHRcdFx0XCJlbmRwb2ludFwiOiB1cGxvYWRBZGRyZXNzLkVuZHBvaW50LFxuXHRcdFx0XHRcdFx0XHRcImFwaVZlcnNpb25cIjogJzIwMTMtMTAtMTUnLFxuXHRcdFx0XHRcdFx0XHRcInNlY3VyaXR5VG9rZW5cIjogdXBsb2FkQXV0aC5TZWN1cml0eVRva2VuXG5cdFx0XHRcdFx0XHR9KVxuXG5cdFx0XHRcdFx0XHRvc3MucHV0T2JqZWN0IHtcblx0XHRcdFx0XHRcdFx0QnVja2V0OiB1cGxvYWRBZGRyZXNzLkJ1Y2tldCxcblx0XHRcdFx0XHRcdFx0S2V5OiB1cGxvYWRBZGRyZXNzLkZpbGVOYW1lLFxuXHRcdFx0XHRcdFx0XHRCb2R5OiByZXEuZmlsZXNbMF0uZGF0YSxcblx0XHRcdFx0XHRcdFx0QWNjZXNzQ29udHJvbEFsbG93T3JpZ2luOiAnJyxcblx0XHRcdFx0XHRcdFx0Q29udGVudFR5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZSxcblx0XHRcdFx0XHRcdFx0Q2FjaGVDb250cm9sOiAnbm8tY2FjaGUnLFxuXHRcdFx0XHRcdFx0XHRDb250ZW50RGlzcG9zaXRpb246ICcnLFxuXHRcdFx0XHRcdFx0XHRDb250ZW50RW5jb2Rpbmc6ICd1dGYtOCcsXG5cdFx0XHRcdFx0XHRcdFNlcnZlclNpZGVFbmNyeXB0aW9uOiAnQUVTMjU2Jyxcblx0XHRcdFx0XHRcdFx0RXhwaXJlczogbnVsbFxuXHRcdFx0XHRcdFx0fSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCAoZXJyLCBkYXRhKSAtPlxuXG5cdFx0XHRcdFx0XHRcdGlmIGVyclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdlcnJvcjonLCBlcnIpXG5cdFx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIGVyci5tZXNzYWdlKVxuXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdzdWNjZXNzOicsIGRhdGEpXG5cblx0XHRcdFx0XHRcdFx0bmV3RGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpXG5cblx0XHRcdFx0XHRcdFx0Z2V0UGxheUluZm9RdWVyeSA9IHtcblx0XHRcdFx0XHRcdFx0XHRBY3Rpb246ICdHZXRQbGF5SW5mbydcblx0XHRcdFx0XHRcdFx0XHRWaWRlb0lkOiB2aWRlb0lkXG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRnZXRQbGF5SW5mb1VybCA9IFwiaHR0cDovL3ZvZC5jbi1zaGFuZ2hhaS5hbGl5dW5jcy5jb20vP1wiICsgZ2V0UXVlcnlTdHJpbmcoYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgZ2V0UGxheUluZm9RdWVyeSwgJ0dFVCcpXG5cblx0XHRcdFx0XHRcdFx0Z2V0UGxheUluZm9SZXN1bHQgPSBIVFRQLmNhbGwgJ0dFVCcsIGdldFBsYXlJbmZvVXJsXG5cblx0XHRcdFx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdFx0XHRcdFx0XHRjb2RlOiAyMDBcblx0XHRcdFx0XHRcdFx0XHRkYXRhOiBnZXRQbGF5SW5mb1Jlc3VsdFxuXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIEZpbGVcIilcblxuXHRcdHJldHVyblxuXHRjYXRjaCBlXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogZS5lcnJvciB8fCA1MDBcblx0XHRcdGRhdGE6IHtlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZX1cblx0XHR9IiwidmFyIGdldFF1ZXJ5U3RyaW5nLCBzdGVlZG9zQXV0aDtcblxuc3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL3MzL1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5wYXJzZUZpbGVzKHJlcSwgcmVzLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZmlsZUNvbGxlY3Rpb24sIG5ld0ZpbGU7XG4gICAgY29sbGVjdGlvbiA9IGNmcy5maWxlcztcbiAgICBmaWxlQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0T2JqZWN0KFwiY21zX2ZpbGVzXCIpLmRiO1xuICAgIGlmIChyZXEuZmlsZXMgJiYgcmVxLmZpbGVzWzBdKSB7XG4gICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgIG5ld0ZpbGUuYXR0YWNoRGF0YShyZXEuZmlsZXNbMF0uZGF0YSwge1xuICAgICAgICB0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGVcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICB2YXIgYm9keSwgZGVzY3JpcHRpb24sIGUsIGV4dGVudGlvbiwgZmlsZU9iaiwgZmlsZW5hbWUsIG1ldGFkYXRhLCBuZXdGaWxlT2JqSWQsIG9iamVjdF9uYW1lLCBvd25lciwgb3duZXJfbmFtZSwgcGFyZW50LCByZWNvcmRfaWQsIHNpemUsIHNwYWNlO1xuICAgICAgICBmaWxlbmFtZSA9IHJlcS5maWxlc1swXS5maWxlbmFtZTtcbiAgICAgICAgZXh0ZW50aW9uID0gZmlsZW5hbWUuc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgICAgaWYgKFtcImltYWdlLmpwZ1wiLCBcImltYWdlLmdpZlwiLCBcImltYWdlLmpwZWdcIiwgXCJpbWFnZS5wbmdcIl0uaW5jbHVkZXMoZmlsZW5hbWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICBmaWxlbmFtZSA9IFwiaW1hZ2UtXCIgKyBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KCdZWVlZTU1EREhIbW1zcycpICsgXCIuXCIgKyBleHRlbnRpb247XG4gICAgICAgIH1cbiAgICAgICAgYm9keSA9IHJlcS5ib2R5O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChib2R5ICYmIChib2R5Wyd1cGxvYWRfZnJvbSddID09PSBcIklFXCIgfHwgYm9keVsndXBsb2FkX2Zyb20nXSA9PT0gXCJub2RlXCIpKSB7XG4gICAgICAgICAgICBmaWxlbmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudChmaWxlbmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGZpbGVuYW1lKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUucmVwbGFjZSgvJS9nLCBcIi1cIik7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RmlsZS5uYW1lKGZpbGVuYW1lKTtcbiAgICAgICAgaWYgKGJvZHkgJiYgYm9keVsnb3duZXInXSAmJiBib2R5WydzcGFjZSddICYmIGJvZHlbJ3JlY29yZF9pZCddICYmIGJvZHlbJ29iamVjdF9uYW1lJ10pIHtcbiAgICAgICAgICBwYXJlbnQgPSBib2R5WydwYXJlbnQnXTtcbiAgICAgICAgICBvd25lciA9IGJvZHlbJ293bmVyJ107XG4gICAgICAgICAgb3duZXJfbmFtZSA9IGJvZHlbJ293bmVyX25hbWUnXTtcbiAgICAgICAgICBzcGFjZSA9IGJvZHlbJ3NwYWNlJ107XG4gICAgICAgICAgcmVjb3JkX2lkID0gYm9keVsncmVjb3JkX2lkJ107XG4gICAgICAgICAgb2JqZWN0X25hbWUgPSBib2R5WydvYmplY3RfbmFtZSddO1xuICAgICAgICAgIGRlc2NyaXB0aW9uID0gYm9keVsnZGVzY3JpcHRpb24nXTtcbiAgICAgICAgICBwYXJlbnQgPSBib2R5WydwYXJlbnQnXTtcbiAgICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgIG93bmVyX25hbWU6IG93bmVyX25hbWUsXG4gICAgICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgICAgICByZWNvcmRfaWQ6IHJlY29yZF9pZCxcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgbWV0YWRhdGEucGFyZW50ID0gcGFyZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgfVxuICAgICAgICBzaXplID0gZmlsZU9iai5vcmlnaW5hbC5zaXplO1xuICAgICAgICBpZiAoIXNpemUpIHtcbiAgICAgICAgICBzaXplID0gMTAyNDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgcmV0dXJuIGZpbGVDb2xsZWN0aW9uLnVwZGF0ZSh7XG4gICAgICAgICAgICBfaWQ6IHBhcmVudFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgbmFtZTogZmlsZW5hbWUsXG4gICAgICAgICAgICAgIGV4dGVudGlvbjogZXh0ZW50aW9uLFxuICAgICAgICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgbW9kaWZpZWRfYnk6IG93bmVyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJHB1c2g6IHtcbiAgICAgICAgICAgICAgdmVyc2lvbnM6IHtcbiAgICAgICAgICAgICAgICAkZWFjaDogW2ZpbGVPYmouX2lkXSxcbiAgICAgICAgICAgICAgICAkcG9zaXRpb246IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld0ZpbGVPYmpJZCA9IGZpbGVDb2xsZWN0aW9uLmRpcmVjdC5pbnNlcnQoe1xuICAgICAgICAgICAgbmFtZTogZmlsZW5hbWUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBleHRlbnRpb246IGV4dGVudGlvbixcbiAgICAgICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgICAgICB2ZXJzaW9uczogW2ZpbGVPYmouX2lkXSxcbiAgICAgICAgICAgIHBhcmVudDoge1xuICAgICAgICAgICAgICBvOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICAgICAgaWRzOiBbcmVjb3JkX2lkXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBjcmVhdGVkX2J5OiBvd25lcixcbiAgICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IG93bmVyXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGZpbGVPYmoudXBkYXRlKHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgJ21ldGFkYXRhLnBhcmVudCc6IG5ld0ZpbGVPYmpJZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuZXdGaWxlLm9uY2UoJ3N0b3JlZCcsIGZ1bmN0aW9uKHN0b3JlTmFtZSkge1xuICAgICAgICB2YXIgcmVzcCwgc2l6ZTtcbiAgICAgICAgc2l6ZSA9IG5ld0ZpbGUub3JpZ2luYWwuc2l6ZTtcbiAgICAgICAgaWYgKCFzaXplKSB7XG4gICAgICAgICAgc2l6ZSA9IDEwMjQ7XG4gICAgICAgIH1cbiAgICAgICAgcmVzcCA9IHtcbiAgICAgICAgICB2ZXJzaW9uX2lkOiBuZXdGaWxlLl9pZCxcbiAgICAgICAgICBzaXplOiBzaXplXG4gICAgICAgIH07XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuICAgICAgcmV0dXJuIHJlcy5lbmQoKTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9zMy86Y29sbGVjdGlvblwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgY29sbGVjdGlvbk5hbWUsIGUsIHVzZXJJZCwgdXNlclNlc3Npb247XG4gIHRyeSB7XG4gICAgdXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKHJlcSwgcmVzLCBjYikge1xuICAgICAgcmV0dXJuIHN0ZWVkb3NBdXRoLmF1dGgocmVxLCByZXMpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgICAgfSk7XG4gICAgfSkocmVxLCByZXMpO1xuICAgIHVzZXJJZCA9IHVzZXJTZXNzaW9uLnVzZXJJZDtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKTtcbiAgICB9XG4gICAgY29sbGVjdGlvbk5hbWUgPSByZXEucGFyYW1zLmNvbGxlY3Rpb247XG4gICAgSnNvblJvdXRlcy5wYXJzZUZpbGVzKHJlcSwgcmVzLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uLCBuZXdGaWxlO1xuICAgICAgY29sbGVjdGlvbiA9IGNmc1tjb2xsZWN0aW9uTmFtZV07XG4gICAgICBpZiAoIWNvbGxlY3Rpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gQ29sbGVjdGlvblwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXEuZmlsZXMgJiYgcmVxLmZpbGVzWzBdKSB7XG4gICAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgICAgICBuZXdGaWxlLm5hbWUocmVxLmZpbGVzWzBdLmZpbGVuYW1lKTtcbiAgICAgICAgaWYgKHJlcS5ib2R5KSB7XG4gICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IHJlcS5ib2R5O1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUub3duZXIgPSB1c2VySWQ7XG4gICAgICAgIG5ld0ZpbGUubWV0YWRhdGEub3duZXIgPSB1c2VySWQ7XG4gICAgICAgIG5ld0ZpbGUuYXR0YWNoRGF0YShyZXEuZmlsZXNbMF0uZGF0YSwge1xuICAgICAgICAgIHR5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZVxuICAgICAgICB9KTtcbiAgICAgICAgY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgIHJldHVybiBuZXdGaWxlLm9uY2UoJ3N0b3JlZCcsIGZ1bmN0aW9uKHN0b3JlTmFtZSkge1xuICAgICAgICAgIHZhciByZXN1bHREYXRhO1xuICAgICAgICAgIHJlc3VsdERhdGEgPSBjb2xsZWN0aW9uLmZpbGVzLmZpbmRPbmUobmV3RmlsZS5faWQpO1xuICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IHJlc3VsdERhdGFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBGaWxlXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiBlLmVycm9yIHx8IDUwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG5cbmdldFF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24oYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgcXVlcnksIG1ldGhvZCkge1xuICB2YXIgQUxZLCBjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcsIGRhdGUsIHF1ZXJ5S2V5cywgcXVlcnlTdHIsIHN0cmluZ1RvU2lnbjtcbiAgY29uc29sZS5sb2coXCItLS0tdXVmbG93TWFuYWdlci5nZXRRdWVyeVN0cmluZy0tLS1cIik7XG4gIEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKTtcbiAgZGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpO1xuICBxdWVyeS5Gb3JtYXQgPSBcImpzb25cIjtcbiAgcXVlcnkuVmVyc2lvbiA9IFwiMjAxNy0wMy0yMVwiO1xuICBxdWVyeS5BY2Nlc3NLZXlJZCA9IGFjY2Vzc0tleUlkO1xuICBxdWVyeS5TaWduYXR1cmVNZXRob2QgPSBcIkhNQUMtU0hBMVwiO1xuICBxdWVyeS5UaW1lc3RhbXAgPSBBTFkudXRpbC5kYXRlLmlzbzg2MDEoZGF0ZSk7XG4gIHF1ZXJ5LlNpZ25hdHVyZVZlcnNpb24gPSBcIjEuMFwiO1xuICBxdWVyeS5TaWduYXR1cmVOb25jZSA9IFN0cmluZyhkYXRlLmdldFRpbWUoKSk7XG4gIHF1ZXJ5S2V5cyA9IE9iamVjdC5rZXlzKHF1ZXJ5KTtcbiAgcXVlcnlLZXlzLnNvcnQoKTtcbiAgY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nID0gXCJcIjtcbiAgcXVlcnlLZXlzLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiBjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcgKz0gXCImXCIgKyBuYW1lICsgXCI9XCIgKyBBTFkudXRpbC5wb3BFc2NhcGUocXVlcnlbbmFtZV0pO1xuICB9KTtcbiAgc3RyaW5nVG9TaWduID0gbWV0aG9kLnRvVXBwZXJDYXNlKCkgKyAnJiUyRiYnICsgQUxZLnV0aWwucG9wRXNjYXBlKGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZy5zdWJzdHIoMSkpO1xuICBxdWVyeS5TaWduYXR1cmUgPSBBTFkudXRpbC5jcnlwdG8uaG1hYyhzZWNyZXRBY2Nlc3NLZXkgKyAnJicsIHN0cmluZ1RvU2lnbiwgJ2Jhc2U2NCcsICdzaGExJyk7XG4gIHF1ZXJ5U3RyID0gQUxZLnV0aWwucXVlcnlQYXJhbXNUb1N0cmluZyhxdWVyeSk7XG4gIGNvbnNvbGUubG9nKHF1ZXJ5U3RyKTtcbiAgcmV0dXJuIHF1ZXJ5U3RyO1xufTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL3MzL3ZvZC91cGxvYWRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIEFMWSwgY29sbGVjdGlvbk5hbWUsIGUsIHVzZXJJZDtcbiAgdHJ5IHtcbiAgICB1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBwZXJtaXNzaW9uXCIpO1xuICAgIH1cbiAgICBjb2xsZWN0aW9uTmFtZSA9IFwidmlkZW9zXCI7XG4gICAgQUxZID0gcmVxdWlyZSgnYWxpeXVuLXNkaycpO1xuICAgIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyhyZXEsIHJlcywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYWNjZXNzS2V5SWQsIGNvbGxlY3Rpb24sIGRhdGUsIG9zcywgcXVlcnksIHIsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgc2VjcmV0QWNjZXNzS2V5LCB1cGxvYWRBZGRyZXNzLCB1cGxvYWRBdXRoLCB1cmwsIHZpZGVvSWQ7XG4gICAgICBjb2xsZWN0aW9uID0gY2ZzW2NvbGxlY3Rpb25OYW1lXTtcbiAgICAgIGlmICghY29sbGVjdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBDb2xsZWN0aW9uXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHJlcS5maWxlcyAmJiByZXEuZmlsZXNbMF0pIHtcbiAgICAgICAgaWYgKGNvbGxlY3Rpb25OYW1lID09PSAndmlkZW9zJyAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS5jZnMpICE9IG51bGwgPyByZWYuc3RvcmUgOiB2b2lkIDApID09PSBcIk9TU1wiKSB7XG4gICAgICAgICAgYWNjZXNzS2V5SWQgPSAocmVmMSA9IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKSAhPSBudWxsID8gcmVmMS5hY2Nlc3NLZXlJZCA6IHZvaWQgMDtcbiAgICAgICAgICBzZWNyZXRBY2Nlc3NLZXkgPSAocmVmMiA9IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKSAhPSBudWxsID8gcmVmMi5zZWNyZXRBY2Nlc3NLZXkgOiB2b2lkIDA7XG4gICAgICAgICAgZGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpO1xuICAgICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgICAgQWN0aW9uOiBcIkNyZWF0ZVVwbG9hZFZpZGVvXCIsXG4gICAgICAgICAgICBUaXRsZTogcmVxLmZpbGVzWzBdLmZpbGVuYW1lLFxuICAgICAgICAgICAgRmlsZU5hbWU6IHJlcS5maWxlc1swXS5maWxlbmFtZVxuICAgICAgICAgIH07XG4gICAgICAgICAgdXJsID0gXCJodHRwOi8vdm9kLmNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS8/XCIgKyBnZXRRdWVyeVN0cmluZyhhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBxdWVyeSwgJ0dFVCcpO1xuICAgICAgICAgIHIgPSBIVFRQLmNhbGwoJ0dFVCcsIHVybCk7XG4gICAgICAgICAgY29uc29sZS5sb2cocik7XG4gICAgICAgICAgaWYgKChyZWYzID0gci5kYXRhKSAhPSBudWxsID8gcmVmMy5WaWRlb0lkIDogdm9pZCAwKSB7XG4gICAgICAgICAgICB2aWRlb0lkID0gci5kYXRhLlZpZGVvSWQ7XG4gICAgICAgICAgICB1cGxvYWRBZGRyZXNzID0gSlNPTi5wYXJzZShuZXcgQnVmZmVyKHIuZGF0YS5VcGxvYWRBZGRyZXNzLCAnYmFzZTY0JykudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1cGxvYWRBZGRyZXNzKTtcbiAgICAgICAgICAgIHVwbG9hZEF1dGggPSBKU09OLnBhcnNlKG5ldyBCdWZmZXIoci5kYXRhLlVwbG9hZEF1dGgsICdiYXNlNjQnKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVwbG9hZEF1dGgpO1xuICAgICAgICAgICAgb3NzID0gbmV3IEFMWS5PU1Moe1xuICAgICAgICAgICAgICBcImFjY2Vzc0tleUlkXCI6IHVwbG9hZEF1dGguQWNjZXNzS2V5SWQsXG4gICAgICAgICAgICAgIFwic2VjcmV0QWNjZXNzS2V5XCI6IHVwbG9hZEF1dGguQWNjZXNzS2V5U2VjcmV0LFxuICAgICAgICAgICAgICBcImVuZHBvaW50XCI6IHVwbG9hZEFkZHJlc3MuRW5kcG9pbnQsXG4gICAgICAgICAgICAgIFwiYXBpVmVyc2lvblwiOiAnMjAxMy0xMC0xNScsXG4gICAgICAgICAgICAgIFwic2VjdXJpdHlUb2tlblwiOiB1cGxvYWRBdXRoLlNlY3VyaXR5VG9rZW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG9zcy5wdXRPYmplY3Qoe1xuICAgICAgICAgICAgICBCdWNrZXQ6IHVwbG9hZEFkZHJlc3MuQnVja2V0LFxuICAgICAgICAgICAgICBLZXk6IHVwbG9hZEFkZHJlc3MuRmlsZU5hbWUsXG4gICAgICAgICAgICAgIEJvZHk6IHJlcS5maWxlc1swXS5kYXRhLFxuICAgICAgICAgICAgICBBY2Nlc3NDb250cm9sQWxsb3dPcmlnaW46ICcnLFxuICAgICAgICAgICAgICBDb250ZW50VHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlLFxuICAgICAgICAgICAgICBDYWNoZUNvbnRyb2w6ICduby1jYWNoZScsXG4gICAgICAgICAgICAgIENvbnRlbnREaXNwb3NpdGlvbjogJycsXG4gICAgICAgICAgICAgIENvbnRlbnRFbmNvZGluZzogJ3V0Zi04JyxcbiAgICAgICAgICAgICAgU2VydmVyU2lkZUVuY3J5cHRpb246ICdBRVMyNTYnLFxuICAgICAgICAgICAgICBFeHBpcmVzOiBudWxsXG4gICAgICAgICAgICB9LCBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgICB2YXIgZ2V0UGxheUluZm9RdWVyeSwgZ2V0UGxheUluZm9SZXN1bHQsIGdldFBsYXlJbmZvVXJsLCBuZXdEYXRlO1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yOicsIGVycik7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc3VjY2VzczonLCBkYXRhKTtcbiAgICAgICAgICAgICAgbmV3RGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpO1xuICAgICAgICAgICAgICBnZXRQbGF5SW5mb1F1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgIEFjdGlvbjogJ0dldFBsYXlJbmZvJyxcbiAgICAgICAgICAgICAgICBWaWRlb0lkOiB2aWRlb0lkXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGdldFBsYXlJbmZvVXJsID0gXCJodHRwOi8vdm9kLmNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS8/XCIgKyBnZXRRdWVyeVN0cmluZyhhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBnZXRQbGF5SW5mb1F1ZXJ5LCAnR0VUJyk7XG4gICAgICAgICAgICAgIGdldFBsYXlJbmZvUmVzdWx0ID0gSFRUUC5jYWxsKCdHRVQnLCBnZXRQbGF5SW5mb1VybCk7XG4gICAgICAgICAgICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGdldFBsYXlJbmZvUmVzdWx0XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gRmlsZVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogZS5lcnJvciB8fCA1MDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgJ3Bvc3QnLCAnL2FwaS9vYmplY3Qvd29ya2Zsb3cvZHJhZnRzJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblx0XHRjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpXG5cdFx0Y3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkXG5cblx0XHRoYXNoRGF0YSA9IHJlcS5ib2R5XG5cblx0XHRpbnNlcnRlZF9pbnN0YW5jZXMgPSBuZXcgQXJyYXlcblxuXHRcdF8uZWFjaCBoYXNoRGF0YVsnSW5zdGFuY2VzJ10sIChpbnN0YW5jZV9mcm9tX2NsaWVudCkgLT5cblx0XHRcdG5ld19pbnNfaWQgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNyZWF0ZV9pbnN0YW5jZShpbnN0YW5jZV9mcm9tX2NsaWVudCwgY3VycmVudF91c2VyX2luZm8pXG5cblx0XHRcdG5ld19pbnMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kT25lKHsgX2lkOiBuZXdfaW5zX2lkIH0sIHsgZmllbGRzOiB7IHNwYWNlOiAxLCBmbG93OiAxLCBmbG93X3ZlcnNpb246IDEsIGZvcm06IDEsIGZvcm1fdmVyc2lvbjogMSB9IH0pXG5cblx0XHRcdGluc2VydGVkX2luc3RhbmNlcy5wdXNoKG5ld19pbnMpXG5cblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRjb2RlOiAyMDBcblx0XHRcdGRhdGE6IHsgaW5zZXJ0czogaW5zZXJ0ZWRfaW5zdGFuY2VzIH1cblx0XHR9XG5cdGNhdGNoIGVcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRjb2RlOiAyMDBcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbeyBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XSB9XG5cdFx0fVxuXG4iLCJKc29uUm91dGVzLmFkZCgncG9zdCcsICcvYXBpL29iamVjdC93b3JrZmxvdy9kcmFmdHMnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgY3VycmVudF91c2VyX2lkLCBjdXJyZW50X3VzZXJfaW5mbywgZSwgaGFzaERhdGEsIGluc2VydGVkX2luc3RhbmNlcztcbiAgdHJ5IHtcbiAgICBjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpO1xuICAgIGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZDtcbiAgICBoYXNoRGF0YSA9IHJlcS5ib2R5O1xuICAgIGluc2VydGVkX2luc3RhbmNlcyA9IG5ldyBBcnJheTtcbiAgICBfLmVhY2goaGFzaERhdGFbJ0luc3RhbmNlcyddLCBmdW5jdGlvbihpbnN0YW5jZV9mcm9tX2NsaWVudCkge1xuICAgICAgdmFyIG5ld19pbnMsIG5ld19pbnNfaWQ7XG4gICAgICBuZXdfaW5zX2lkID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UoaW5zdGFuY2VfZnJvbV9jbGllbnQsIGN1cnJlbnRfdXNlcl9pbmZvKTtcbiAgICAgIG5ld19pbnMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kT25lKHtcbiAgICAgICAgX2lkOiBuZXdfaW5zX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHNwYWNlOiAxLFxuICAgICAgICAgIGZsb3c6IDEsXG4gICAgICAgICAgZmxvd192ZXJzaW9uOiAxLFxuICAgICAgICAgIGZvcm06IDEsXG4gICAgICAgICAgZm9ybV92ZXJzaW9uOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGluc2VydGVkX2luc3RhbmNlcy5wdXNoKG5ld19pbnMpO1xuICAgIH0pO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGluc2VydHM6IGluc2VydGVkX2luc3RhbmNlc1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIl19
