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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjcmVhdG9yL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvbGliL2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvb2JqZWN0X3JlY2VudF92aWV3ZWQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3ZpZXdlZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3JlY29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9yZWNlbnRfcmVjb3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9yZXBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3JlcG9ydF9kYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfZXhwb3J0MnhtbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9leHBvcnQyeG1sLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3JlbGF0ZWRfb2JqZWN0c19yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvcGVuZGluZ19zcGFjZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3BlbmRpbmdfc3BhY2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF90YWJ1bGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF9saXN0dmlld3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy91c2VyX3RhYnVsYXJfc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9yZWxhdGVkX29iamVjdHNfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV91c2VyX2luZm8uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c192aWV3X2xpbWl0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfdmlld19saW1pdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c19ub19mb3JjZV9waG9uZV91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9uZWVkX3RvX2NvbmZpcm0uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX25lZWRfdG9fY29uZmlybS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbGliL3Blcm1pc3Npb25fbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvcGVybWlzc2lvbl9tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImJ1c2JveSIsIk1ldGVvciIsInNldHRpbmdzIiwiY2ZzIiwiYWxpeXVuIiwiQ3JlYXRvciIsImdldFNjaGVtYSIsIm9iamVjdF9uYW1lIiwicmVmIiwiZ2V0T2JqZWN0Iiwic2NoZW1hIiwiZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCIsImlzQ2xpZW50IiwiQnVpbGRlckNyZWF0b3IiLCJwbHVnaW5Db21wb25lbnRTZWxlY3RvciIsInN0b3JlIiwiZ2V0U3RhdGUiLCJnZXRPYmplY3RVcmwiLCJyZWNvcmRfaWQiLCJhcHBfaWQiLCJsaXN0X3ZpZXciLCJsaXN0X3ZpZXdfaWQiLCJTZXNzaW9uIiwiZ2V0IiwiZ2V0TGlzdFZpZXciLCJfaWQiLCJnZXRSZWxhdGl2ZVVybCIsImdldE9iamVjdEFic29sdXRlVXJsIiwiU3RlZWRvcyIsImFic29sdXRlVXJsIiwiZ2V0T2JqZWN0Um91dGVyVXJsIiwiZ2V0TGlzdFZpZXdVcmwiLCJ1cmwiLCJnZXRMaXN0Vmlld1JlbGF0aXZlVXJsIiwiZ2V0U3dpdGNoTGlzdFVybCIsImdldFJlbGF0ZWRPYmplY3RVcmwiLCJyZWxhdGVkX29iamVjdF9uYW1lIiwicmVsYXRlZF9maWVsZF9uYW1lIiwiZ2V0T2JqZWN0TG9va3VwRmllbGRPcHRpb25zIiwiaXNfZGVlcCIsImlzX3NraXBfaGlkZSIsImlzX3JlbGF0ZWQiLCJfb2JqZWN0IiwiX29wdGlvbnMiLCJmaWVsZHMiLCJpY29uIiwicmVsYXRlZE9iamVjdHMiLCJfIiwiZm9yRWFjaCIsImYiLCJrIiwiaGlkZGVuIiwidHlwZSIsInB1c2giLCJsYWJlbCIsInZhbHVlIiwicl9vYmplY3QiLCJyZWZlcmVuY2VfdG8iLCJpc1N0cmluZyIsImYyIiwiazIiLCJnZXRSZWxhdGVkT2JqZWN0cyIsImVhY2giLCJfdGhpcyIsIl9yZWxhdGVkT2JqZWN0IiwicmVsYXRlZE9iamVjdCIsInJlbGF0ZWRPcHRpb25zIiwicmVsYXRlZE9wdGlvbiIsImZvcmVpZ25fa2V5IiwibmFtZSIsImdldE9iamVjdEZpbHRlckZpZWxkT3B0aW9ucyIsInBlcm1pc3Npb25fZmllbGRzIiwiZ2V0RmllbGRzIiwiaW5jbHVkZSIsInRlc3QiLCJpbmRleE9mIiwiZ2V0T2JqZWN0RmllbGRPcHRpb25zIiwiZ2V0RmlsdGVyc1dpdGhGaWx0ZXJGaWVsZHMiLCJmaWx0ZXJzIiwiZmlsdGVyX2ZpZWxkcyIsImxlbmd0aCIsIm4iLCJmaWVsZCIsInJlcXVpcmVkIiwiZmluZFdoZXJlIiwiaXNfZGVmYXVsdCIsImlzX3JlcXVpcmVkIiwiZmlsdGVySXRlbSIsIm1hdGNoRmllbGQiLCJmaW5kIiwiZ2V0T2JqZWN0UmVjb3JkIiwic2VsZWN0X2ZpZWxkcyIsImV4cGFuZCIsImNvbGxlY3Rpb24iLCJvYmoiLCJyZWNvcmQiLCJyZWYxIiwicmVmMiIsIlRlbXBsYXRlIiwiaW5zdGFuY2UiLCJvZGF0YSIsImRhdGFiYXNlX25hbWUiLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsImdldE9iamVjdFJlY29yZE5hbWUiLCJuYW1lX2ZpZWxkX2tleSIsIk5BTUVfRklFTERfS0VZIiwiZ2V0QXBwIiwiYXBwIiwiQXBwcyIsImRlcHMiLCJkZXBlbmQiLCJnZXRBcHBEYXNoYm9hcmQiLCJkYXNoYm9hcmQiLCJEYXNoYm9hcmRzIiwiYXBwcyIsImdldEFwcERhc2hib2FyZENvbXBvbmVudCIsImdldEFwcE9iamVjdE5hbWVzIiwiYXBwT2JqZWN0cyIsImlzTW9iaWxlIiwib2JqZWN0cyIsIm1vYmlsZV9vYmplY3RzIiwicGVybWlzc2lvbnMiLCJhbGxvd1JlYWQiLCJnZXRVcmxXaXRoVG9rZW4iLCJleHByZXNzaW9uRm9ybURhdGEiLCJoYXNRdWVyeVN5bWJvbCIsImxpbmtTdHIiLCJwYXJhbXMiLCJzcGFjZUlkIiwidXNlcklkIiwiZ2V0VXNlckNvbXBhbnlJZHMiLCJBY2NvdW50cyIsIl9zdG9yZWRMb2dpblRva2VuIiwiaXNFeHByZXNzaW9uIiwicGFyc2VTaW5nbGVFeHByZXNzaW9uIiwiVVNFUl9DT05URVhUIiwiJCIsInBhcmFtIiwiZ2V0QXBwTWVudSIsIm1lbnVfaWQiLCJtZW51cyIsImdldEFwcE1lbnVzIiwibWVudSIsImlkIiwiZ2V0QXBwTWVudVVybEZvckludGVybmV0IiwicGF0aCIsImdldEFwcE1lbnVVcmwiLCJ0YXJnZXQiLCJhcHBNZW51cyIsImN1cmVudEFwcE1lbnVzIiwibWVudUl0ZW0iLCJjaGlsZHJlbiIsImxvYWRBcHBzTWVudXMiLCJkYXRhIiwib3B0aW9ucyIsIm1vYmlsZSIsInN1Y2Nlc3MiLCJzZXQiLCJhdXRoUmVxdWVzdCIsImdldFZpc2libGVBcHBzIiwiaW5jbHVkZUFkbWluIiwiY2hhbmdlQXBwIiwiX3N1YkFwcCIsImVudGl0aWVzIiwiT2JqZWN0IiwiYXNzaWduIiwidmlzaWJsZUFwcHNTZWxlY3RvciIsImdldFZpc2libGVBcHBzT2JqZWN0cyIsInZpc2libGVPYmplY3ROYW1lcyIsImZsYXR0ZW4iLCJwbHVjayIsImZpbHRlciIsIk9iamVjdHMiLCJzb3J0Iiwic29ydGluZ01ldGhvZCIsImJpbmQiLCJrZXkiLCJ1bmlxIiwiZ2V0QXBwc09iamVjdHMiLCJ0ZW1wT2JqZWN0cyIsImNvbmNhdCIsInZhbGlkYXRlRmlsdGVycyIsImxvZ2ljIiwiZSIsImVycm9yTXNnIiwiZmlsdGVyX2l0ZW1zIiwiZmlsdGVyX2xlbmd0aCIsImZsYWciLCJpbmRleCIsIndvcmQiLCJtYXAiLCJpc0VtcHR5IiwiY29tcGFjdCIsInJlcGxhY2UiLCJtYXRjaCIsImkiLCJpbmNsdWRlcyIsInciLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJ0b2FzdHIiLCJmb3JtYXRGaWx0ZXJzVG9Nb25nbyIsInNlbGVjdG9yIiwiQXJyYXkiLCJvcGVyYXRpb24iLCJvcHRpb24iLCJyZWciLCJzdWJfc2VsZWN0b3IiLCJldmFsdWF0ZUZvcm11bGEiLCJSZWdFeHAiLCJpc0JldHdlZW5GaWx0ZXJPcGVyYXRpb24iLCJnZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMiLCJmb3JtYXRGaWx0ZXJzVG9EZXYiLCJsb2dpY1RlbXBGaWx0ZXJzIiwiaXNfbG9naWNfb3IiLCJwb3AiLCJTdGVlZG9zRmlsdGVycyIsImZvcm1hdExvZ2ljRmlsdGVyc1RvRGV2IiwiZmlsdGVyX2xvZ2ljIiwiZm9ybWF0X2xvZ2ljIiwieCIsIl9mIiwiaXNBcnJheSIsIkpTT04iLCJzdHJpbmdpZnkiLCJyZWxhdGVkX29iamVjdF9uYW1lcyIsInJlbGF0ZWRfb2JqZWN0cyIsInVucmVsYXRlZF9vYmplY3RzIiwiZ2V0T2JqZWN0UmVsYXRlZHMiLCJfY29sbGVjdGlvbl9uYW1lIiwiZ2V0UGVybWlzc2lvbnMiLCJkaWZmZXJlbmNlIiwicmVsYXRlZF9vYmplY3QiLCJpc0FjdGl2ZSIsImFsbG93UmVhZEZpbGVzIiwiZ2V0UmVsYXRlZE9iamVjdE5hbWVzIiwiZ2V0UmVsYXRlZE9iamVjdExpc3RBY3Rpb25zIiwicmVsYXRlZE9iamVjdE5hbWUiLCJhY3Rpb25zIiwiZ2V0QWN0aW9ucyIsImFjdGlvbiIsIm9uIiwidmlzaWJsZSIsImRpc2FibGVkX2FjdGlvbnMiLCJzb3J0QnkiLCJ2YWx1ZXMiLCJoYXMiLCJhbGxvd19jdXN0b21BY3Rpb25zIiwia2V5cyIsImV4Y2x1ZGVfYWN0aW9ucyIsImdldExpc3RWaWV3cyIsImRpc2FibGVkX2xpc3Rfdmlld3MiLCJsaXN0Vmlld3MiLCJsaXN0X3ZpZXdzIiwib2JqZWN0IiwiaXRlbSIsIml0ZW1fbmFtZSIsImlzRGlzYWJsZWQiLCJvd25lciIsImZpZWxkc05hbWUiLCJ1bnJlYWRhYmxlX2ZpZWxkcyIsImdldE9iamVjdEZpZWxkc05hbWUiLCJpc2xvYWRpbmciLCJib290c3RyYXBMb2FkZWQiLCJjb252ZXJ0U3BlY2lhbENoYXJhY3RlciIsInN0ciIsImdldERpc2FibGVkRmllbGRzIiwiZmllbGROYW1lIiwiYXV0b2Zvcm0iLCJkaXNhYmxlZCIsIm9taXQiLCJnZXRIaWRkZW5GaWVsZHMiLCJnZXRGaWVsZHNXaXRoTm9Hcm91cCIsImdyb3VwIiwiZ2V0U29ydGVkRmllbGRHcm91cE5hbWVzIiwibmFtZXMiLCJ1bmlxdWUiLCJnZXRGaWVsZHNGb3JHcm91cCIsImdyb3VwTmFtZSIsImdldFN5c3RlbUJhc2VGaWVsZHMiLCJnZXRGaWVsZHNXaXRob3V0U3lzdGVtQmFzZSIsImdldEZpZWxkc1dpdGhvdXRPbWl0IiwicGljayIsImdldEZpZWxkc0luRmlyc3RMZXZlbCIsImZpcnN0TGV2ZWxLZXlzIiwiZ2V0RmllbGRzRm9yUmVvcmRlciIsImlzU2luZ2xlIiwiX2tleXMiLCJjaGlsZEtleXMiLCJpc193aWRlXzEiLCJpc193aWRlXzIiLCJzY18xIiwic2NfMiIsImVuZHNXaXRoIiwiaXNfd2lkZSIsInNsaWNlIiwiaXNGaWx0ZXJWYWx1ZUVtcHR5IiwiTnVtYmVyIiwiaXNOYU4iLCJnZXRGaWVsZERhdGFUeXBlIiwib2JqZWN0RmllbGRzIiwicmVzdWx0IiwiZGF0YV90eXBlIiwiaXNTZXJ2ZXIiLCJnZXRBbGxSZWxhdGVkT2JqZWN0cyIsInJlbGF0ZWRfZmllbGQiLCJlbmFibGVfZmlsZXMiLCJmb3JtYXRJbmRleCIsImFycmF5IiwiaW5kZXhOYW1lIiwiaXNkb2N1bWVudERCIiwiYmFja2dyb3VuZCIsImRhdGFzb3VyY2VzIiwiZG9jdW1lbnREQiIsImpvaW4iLCJzdWJzdHJpbmciLCJhcHBzQnlOYW1lIiwibWV0aG9kcyIsInNwYWNlX2lkIiwiY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkIiwiY3VycmVudF9yZWNlbnRfdmlld2VkIiwiZG9jIiwic3BhY2UiLCJ1cGRhdGUiLCIkaW5jIiwiY291bnQiLCIkc2V0IiwibW9kaWZpZWQiLCJEYXRlIiwibW9kaWZpZWRfYnkiLCJpbnNlcnQiLCJfbWFrZU5ld0lEIiwibyIsImlkcyIsImNyZWF0ZWQiLCJjcmVhdGVkX2J5IiwiYXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSIsInJlY2VudF9hZ2dyZWdhdGUiLCJzZWFyY2hfb2JqZWN0IiwiX3JlY29yZHMiLCJjYWxsYmFjayIsIkNvbGxlY3Rpb25zIiwib2JqZWN0X3JlY2VudF92aWV3ZWQiLCJyYXdDb2xsZWN0aW9uIiwiYWdncmVnYXRlIiwiJG1hdGNoIiwiJGdyb3VwIiwibWF4Q3JlYXRlZCIsIiRtYXgiLCIkc29ydCIsIiRsaW1pdCIsInRvQXJyYXkiLCJlcnIiLCJFcnJvciIsImlzRnVuY3Rpb24iLCJ3cmFwQXN5bmMiLCJzZWFyY2hUZXh0IiwiX29iamVjdF9jb2xsZWN0aW9uIiwiX29iamVjdF9uYW1lX2tleSIsInF1ZXJ5IiwicXVlcnlfYW5kIiwicmVjb3JkcyIsInNlYXJjaF9LZXl3b3JkcyIsInNwbGl0Iiwia2V5d29yZCIsInN1YnF1ZXJ5IiwiJHJlZ2V4IiwidHJpbSIsIiRhbmQiLCIkaW4iLCJsaW1pdCIsIl9uYW1lIiwiX29iamVjdF9uYW1lIiwicmVjb3JkX29iamVjdCIsInJlY29yZF9vYmplY3RfY29sbGVjdGlvbiIsInNlbGYiLCJvYmplY3RzQnlOYW1lIiwib2JqZWN0X3JlY29yZCIsImVuYWJsZV9zZWFyY2giLCJ1cGRhdGVfZmlsdGVycyIsImxpc3R2aWV3X2lkIiwiZmlsdGVyX3Njb3BlIiwib2JqZWN0X2xpc3R2aWV3cyIsImRpcmVjdCIsInVwZGF0ZV9jb2x1bW5zIiwiY29sdW1ucyIsImNoZWNrIiwiY29tcG91bmRGaWVsZHMiLCJjdXJzb3IiLCJmaWx0ZXJGaWVsZHMiLCJjaGlsZEtleSIsIm9iamVjdEZpZWxkIiwic3BsaXRzIiwiaXNDb21tb25TcGFjZSIsImlzU3BhY2VBZG1pbiIsInNraXAiLCJmZXRjaCIsImNvbXBvdW5kRmllbGRJdGVtIiwiY29tcG91bmRGaWx0ZXJGaWVsZHMiLCJpdGVtS2V5IiwiaXRlbVZhbHVlIiwicmVmZXJlbmNlSXRlbSIsInNldHRpbmciLCJjb2x1bW5fd2lkdGgiLCJvYmoxIiwiX2lkX2FjdGlvbnMiLCJfbWl4RmllbGRzRGF0YSIsIl9taXhSZWxhdGVkRGF0YSIsIl93cml0ZVhtbEZpbGUiLCJmcyIsImxvZ2dlciIsIm1rZGlycCIsInhtbDJqcyIsInJlcXVpcmUiLCJMb2dnZXIiLCJqc29uT2JqIiwib2JqTmFtZSIsImJ1aWxkZXIiLCJkYXkiLCJmaWxlQWRkcmVzcyIsImZpbGVOYW1lIiwiZmlsZVBhdGgiLCJtb250aCIsIm5vdyIsInN0cmVhbSIsInhtbCIsInllYXIiLCJCdWlsZGVyIiwiYnVpbGRPYmplY3QiLCJCdWZmZXIiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsIl9fbWV0ZW9yX2Jvb3RzdHJhcF9fIiwic2VydmVyRGlyIiwiZXhpc3RzU3luYyIsInN5bmMiLCJ3cml0ZUZpbGUiLCJtaXhCb29sIiwibWl4RGF0ZSIsIm1peERlZmF1bHQiLCJvYmpGaWVsZHMiLCJmaWVsZF9uYW1lIiwiZGF0ZSIsImRhdGVTdHIiLCJmb3JtYXQiLCJtb21lbnQiLCJyZWxhdGVkT2JqTmFtZXMiLCJyZWxhdGVkT2JqTmFtZSIsInJlbGF0ZWRDb2xsZWN0aW9uIiwicmVsYXRlZFJlY29yZExpc3QiLCJyZWxhdGVkVGFibGVEYXRhIiwicmVsYXRlZE9iaiIsImZpZWxkc0RhdGEiLCJFeHBvcnQyeG1sIiwicmVjb3JkTGlzdCIsImluZm8iLCJ0aW1lIiwicmVjb3JkT2JqIiwidGltZUVuZCIsInJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzIiwicmVsYXRlZF9yZWNvcmRzIiwidmlld0FsbFJlY29yZHMiLCJnZXRQZW5kaW5nU3BhY2VJbmZvIiwiaW52aXRlcklkIiwiaW52aXRlck5hbWUiLCJzcGFjZU5hbWUiLCJkYiIsInVzZXJzIiwic3BhY2VzIiwiaW52aXRlciIsInJlZnVzZUpvaW5TcGFjZSIsInNwYWNlX3VzZXJzIiwiaW52aXRlX3N0YXRlIiwiYWNjZXB0Sm9pblNwYWNlIiwidXNlcl9hY2NlcHRlZCIsInB1Ymxpc2giLCJwdWJsaXNoQ29tcG9zaXRlIiwidGFibGVOYW1lIiwiX2ZpZWxkcyIsIm9iamVjdF9jb2xsZWNpdG9uIiwicmVmZXJlbmNlX2ZpZWxkcyIsInJlYWR5IiwiU3RyaW5nIiwiTWF0Y2giLCJPcHRpb25hbCIsImdldE9iamVjdE5hbWUiLCJ1bmJsb2NrIiwiZmllbGRfa2V5cyIsIl9vYmplY3RLZXlzIiwicmVmZXJlbmNlX2ZpZWxkIiwicGFyZW50IiwiY2hpbGRyZW5fZmllbGRzIiwicF9rIiwicmVmZXJlbmNlX2lkcyIsInJlZmVyZW5jZV90b19vYmplY3QiLCJzX2siLCJnZXRQcm9wZXJ0eSIsInJlZHVjZSIsImlzT2JqZWN0Iiwic2hhcmVkIiwidXNlciIsInNwYWNlX3NldHRpbmdzIiwicGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwiLCJnZXRGbG93UGVybWlzc2lvbnMiLCJmbG93X2lkIiwidXNlcl9pZCIsImZsb3ciLCJteV9wZXJtaXNzaW9ucyIsIm9yZ19pZHMiLCJvcmdhbml6YXRpb25zIiwib3Jnc19jYW5fYWRkIiwib3Jnc19jYW5fYWRtaW4iLCJvcmdzX2Nhbl9tb25pdG9yIiwidXNlcnNfY2FuX2FkZCIsInVzZXJzX2Nhbl9hZG1pbiIsInVzZXJzX2Nhbl9tb25pdG9yIiwidXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbCIsImdldEZsb3ciLCJwYXJlbnRzIiwib3JnIiwicGFyZW50X2lkIiwicGVybXMiLCJvcmdfaWQiLCJfZXZhbCIsImdldE9iamVjdENvbmZpZyIsImdldE9iamVjdE5hbWVGaWVsZEtleSIsImdldFJlbGF0ZWRzIiwib2JqZWN0RmluZCIsIm9iamVjdEZpbmRPbmUiLCJvYmplY3RVcGRhdGUiLCJvYmplY3RxbCIsIm9iamVjdEFwaU5hbWUiLCJ0b0NvbmZpZyIsImNiIiwidGhlbiIsInJlc29sdmUiLCJyZWplY3QiLCJjaGVja19hdXRob3JpemF0aW9uIiwicmVxIiwiYXV0aFRva2VuIiwiaGFzaGVkVG9rZW4iLCJfaGFzaExvZ2luVG9rZW4iLCJnZXRTcGFjZSIsImZsb3dzIiwiZ2V0U3BhY2VVc2VyIiwic3BhY2VfdXNlciIsImdldFNwYWNlVXNlck9yZ0luZm8iLCJvcmdhbml6YXRpb24iLCJmdWxsbmFtZSIsIm9yZ2FuaXphdGlvbl9uYW1lIiwib3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwiaXNGbG93RW5hYmxlZCIsInN0YXRlIiwiaXNGbG93U3BhY2VNYXRjaGVkIiwiZ2V0Rm9ybSIsImZvcm1faWQiLCJmb3JtIiwiZm9ybXMiLCJnZXRDYXRlZ29yeSIsImNhdGVnb3J5X2lkIiwiY2F0ZWdvcmllcyIsImNoZWNrU3luY0RpcmVjdGlvbiIsIm93Iiwic3luY0RpcmVjdGlvbiIsIm9iamVjdF93b3JrZmxvd3MiLCJzeW5jX2RpcmVjdGlvbiIsImNyZWF0ZV9pbnN0YW5jZSIsImluc3RhbmNlX2Zyb21fY2xpZW50IiwidXNlcl9pbmZvIiwiYXBwcl9vYmoiLCJhcHByb3ZlX2Zyb21fY2xpZW50IiwiY2F0ZWdvcnkiLCJpbnNfb2JqIiwibmV3X2luc19pZCIsInJlbGF0ZWRUYWJsZXNJbmZvIiwic3BhY2VfdXNlcl9vcmdfaW5mbyIsInN0YXJ0X3N0ZXAiLCJ0cmFjZV9mcm9tX2NsaWVudCIsInRyYWNlX29iaiIsImNoZWNrSXNJbkFwcHJvdmFsIiwicGVybWlzc2lvbk1hbmFnZXIiLCJpbnN0YW5jZXMiLCJmbG93X3ZlcnNpb24iLCJjdXJyZW50IiwiZm9ybV92ZXJzaW9uIiwic3VibWl0dGVyIiwic3VibWl0dGVyX25hbWUiLCJhcHBsaWNhbnQiLCJhcHBsaWNhbnRfbmFtZSIsImFwcGxpY2FudF9vcmdhbml6YXRpb24iLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUiLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwiYXBwbGljYW50X2NvbXBhbnkiLCJjb21wYW55X2lkIiwiY29kZSIsImlzX2FyY2hpdmVkIiwiaXNfZGVsZXRlZCIsInJlY29yZF9pZHMiLCJNb25nbyIsIk9iamVjdElEIiwiX3N0ciIsImlzX2ZpbmlzaGVkIiwic3RlcHMiLCJzdGVwIiwic3RlcF90eXBlIiwic3RhcnRfZGF0ZSIsInRyYWNlIiwidXNlcl9uYW1lIiwiaGFuZGxlciIsImhhbmRsZXJfbmFtZSIsImhhbmRsZXJfb3JnYW5pemF0aW9uIiwiaGFuZGxlcl9vcmdhbml6YXRpb25fbmFtZSIsImhhbmRsZXJfb3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwicmVhZF9kYXRlIiwiaXNfcmVhZCIsImlzX2Vycm9yIiwiZGVzY3JpcHRpb24iLCJpbml0aWF0ZVZhbHVlcyIsImFwcHJvdmVzIiwidHJhY2VzIiwiaW5ib3hfdXNlcnMiLCJjdXJyZW50X3N0ZXBfbmFtZSIsImF1dG9fcmVtaW5kIiwiZmxvd19uYW1lIiwiY2F0ZWdvcnlfbmFtZSIsImluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvIiwiaW5pdGlhdGVBdHRhY2giLCJyZWNvcmRJZHMiLCJmbG93SWQiLCJmaWVsZENvZGVzIiwiZmlsdGVyVmFsdWVzIiwiZm9ybUZpZWxkcyIsImZvcm1UYWJsZUZpZWxkcyIsImZvcm1UYWJsZUZpZWxkc0NvZGUiLCJnZXRGaWVsZE9kYXRhVmFsdWUiLCJnZXRGb3JtRmllbGQiLCJnZXRGb3JtVGFibGVGaWVsZCIsImdldEZvcm1UYWJsZUZpZWxkQ29kZSIsImdldEZvcm1UYWJsZVN1YkZpZWxkIiwiZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSIsImdldFNlbGVjdE9yZ1ZhbHVlIiwiZ2V0U2VsZWN0T3JnVmFsdWVzIiwiZ2V0U2VsZWN0VXNlclZhbHVlIiwiZ2V0U2VsZWN0VXNlclZhbHVlcyIsIm9iamVjdE5hbWUiLCJyZWNvcmRJZCIsInJlbGF0ZWRPYmplY3RzS2V5cyIsInRhYmxlRmllbGRDb2RlcyIsInRhYmxlRmllbGRNYXAiLCJ0YWJsZVRvUmVsYXRlZE1hcCIsImZmIiwiZm9ybUZpZWxkIiwicmVsYXRlZE9iamVjdHNLZXkiLCJzdGFydHNXaXRoIiwiZm9ybVRhYmxlRmllbGRDb2RlIiwic2YiLCJ0YWJsZUZpZWxkIiwic3ViRmllbGRDb2RlIiwicmVmZXJlbmNlVG9GaWVsZE5hbWUiLCJfcmVjb3JkIiwibmFtZUtleSIsInN1IiwidXNlcklkcyIsInN1cyIsIm9yZ0lkIiwib3JnSWRzIiwib3JncyIsImZpZWxkX21hcCIsImZtIiwiZ3JpZENvZGUiLCJsb29rdXBGaWVsZE5hbWUiLCJsb29rdXBGaWVsZE9iaiIsImxvb2t1cE9iamVjdFJlY29yZCIsImxvb2t1cFNlbGVjdEZpZWxkVmFsdWUiLCJvVGFibGVDb2RlIiwib1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkIiwib1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkQ29kZSIsIm9UYWJsZUZpZWxkQ29kZSIsIm9iakZpZWxkIiwib2JqZWN0RmllbGROYW1lIiwib2JqZWN0RmllbGRPYmplY3ROYW1lIiwib2JqZWN0TG9va3VwRmllbGQiLCJvYmplY3RfZmllbGQiLCJvZGF0YUZpZWxkVmFsdWUiLCJyZWZlcmVuY2VUb0RvYyIsInJlZmVyZW5jZVRvRmllbGRWYWx1ZSIsInJlZmVyZW5jZVRvT2JqZWN0TmFtZSIsInJlbGF0ZWRPYmplY3RGaWVsZENvZGUiLCJzZWxlY3RGaWVsZFZhbHVlIiwidGFibGVUb1JlbGF0ZWRNYXBLZXkiLCJ3VGFibGVDb2RlIiwid29ya2Zsb3dfZmllbGQiLCJoYXNPd25Qcm9wZXJ0eSIsIndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGUiLCJvYmplY3RfdGFibGVfZmllbGRfY29kZSIsInJlZmVyZW5jZV90b19maWVsZCIsIm11bHRpcGxlIiwiaXNfbXVsdGlzZWxlY3QiLCJ0ZmMiLCJjIiwicGFyc2UiLCJ0ciIsIm5ld1RyIiwidGZtIiwid1RkQ29kZSIsImZvcm1UYWJsZUZpZWxkIiwicmVsYXRlZEZpZWxkIiwicmVsYXRlZEZpZWxkTmFtZSIsInJlbGF0ZWRSZWNvcmRzIiwicmVsYXRlZFRhYmxlSXRlbXMiLCJ0YWJsZUNvZGUiLCJ0YWJsZVZhbHVlcyIsIl9GUk9NX1RBQkxFX0NPREUiLCJ3YXJuIiwicnIiLCJ0YWJsZVZhbHVlSXRlbSIsInZhbHVlS2V5IiwiZmllbGRLZXkiLCJmb3JtRmllbGRLZXkiLCJyZWxhdGVkT2JqZWN0RmllbGQiLCJ0YWJsZUZpZWxkVmFsdWUiLCJfdGFibGUiLCJfY29kZSIsImZpZWxkX21hcF9zY3JpcHQiLCJleHRlbmQiLCJldmFsRmllbGRNYXBTY3JpcHQiLCJvYmplY3RJZCIsImZ1bmMiLCJzY3JpcHQiLCJpbnNJZCIsImFwcHJvdmVJZCIsImNmIiwidmVyc2lvbnMiLCJ2ZXJzaW9uSWQiLCJpZHgiLCJuZXdGaWxlIiwiRlMiLCJGaWxlIiwiYXR0YWNoRGF0YSIsImNyZWF0ZVJlYWRTdHJlYW0iLCJvcmlnaW5hbCIsIm1ldGFkYXRhIiwicmVhc29uIiwic2l6ZSIsIm93bmVyX25hbWUiLCJhcHByb3ZlIiwibG9ja2VkIiwiaW5zdGFuY2Vfc3RhdGUiLCJpbml0aWF0ZVJlbGF0ZWRSZWNvcmRJbnN0YW5jZUluZm8iLCJ0YWJsZUl0ZW1zIiwiSnNvblJvdXRlcyIsImFkZCIsInJlcyIsIm5leHQiLCJjdXJyZW50X3VzZXJfaWQiLCJjdXJyZW50X3VzZXJfaW5mbyIsImhhc2hEYXRhIiwiaW5zZXJ0ZWRfaW5zdGFuY2VzIiwiYm9keSIsIm5ld19pbnMiLCJzZW5kUmVzdWx0IiwiaW5zZXJ0cyIsInN0YWNrIiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBR3JCSCxnQkFBZ0IsQ0FBQztBQUNoQkksUUFBTSxFQUFFLFNBRFE7QUFFaEIsWUFBVTtBQUZNLENBQUQsRUFHYixpQkFIYSxDQUFoQjs7QUFLQSxJQUFJQyxNQUFNLENBQUNDLFFBQVAsSUFBbUJELE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsR0FBbkMsSUFBMENGLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0JDLE1BQWxFLEVBQTBFO0FBQ3pFUixrQkFBZ0IsQ0FBQztBQUNoQixrQkFBYztBQURFLEdBQUQsRUFFYixpQkFGYSxDQUFoQjtBQUdBLEM7Ozs7Ozs7Ozs7OztBQ0dEUyxRQUFRQyxTQUFSLEdBQW9CLFVBQUNDLFdBQUQ7QUFDbkIsTUFBQUMsR0FBQTtBQUFBLFVBQUFBLE1BQUFILFFBQUFJLFNBQUEsQ0FBQUYsV0FBQSxhQUFBQyxJQUF1Q0UsTUFBdkMsR0FBdUMsTUFBdkM7QUFEbUIsQ0FBcEI7O0FBR0FMLFFBQVFNLHNCQUFSLEdBQWlDLFVBQUNKLFdBQUQ7QUFDaEMsTUFBR04sT0FBT1csUUFBVjtBQUNDLFdBQU9DLGVBQWVDLHVCQUFmLENBQXVDRCxlQUFlRSxLQUFmLENBQXFCQyxRQUFyQixFQUF2QyxFQUF3RSxZQUF4RSxFQUFzRlQsV0FBdEYsQ0FBUDtBQ1pDO0FEVThCLENBQWpDOztBQUlBRixRQUFRWSxZQUFSLEdBQXVCLFVBQUNWLFdBQUQsRUFBY1csU0FBZCxFQUF5QkMsTUFBekI7QUFDdEIsTUFBQUMsU0FBQSxFQUFBQyxZQUFBOztBQUFBLE1BQUcsQ0FBQ0YsTUFBSjtBQUNDQSxhQUFTRyxRQUFRQyxHQUFSLENBQVksUUFBWixDQUFUO0FDVEM7O0FEVUYsTUFBRyxDQUFDaEIsV0FBSjtBQUNDQSxrQkFBY2UsUUFBUUMsR0FBUixDQUFZLGFBQVosQ0FBZDtBQ1JDOztBRFVGSCxjQUFZZixRQUFRbUIsV0FBUixDQUFvQmpCLFdBQXBCLEVBQWlDLElBQWpDLENBQVo7QUFDQWMsaUJBQUFELGFBQUEsT0FBZUEsVUFBV0ssR0FBMUIsR0FBMEIsTUFBMUI7O0FBRUEsTUFBR1AsU0FBSDtBQUNDLFdBQU9iLFFBQVFxQixjQUFSLENBQXVCLFVBQVVQLE1BQVYsR0FBbUIsR0FBbkIsR0FBeUJaLFdBQXpCLEdBQXVDLFFBQXZDLEdBQWtEVyxTQUF6RSxDQUFQO0FBREQ7QUFHQyxRQUFHYixRQUFRTSxzQkFBUixDQUErQkosV0FBL0IsQ0FBSDtBQUNDLGFBQU9GLFFBQVFxQixjQUFSLENBQXVCLFVBQVVQLE1BQVYsR0FBbUIsR0FBbkIsR0FBeUJaLFdBQWhELENBQVA7QUFERDtBQUdDLFVBQUdjLFlBQUg7QUFDQyxlQUFPaEIsUUFBUXFCLGNBQVIsQ0FBdUIsVUFBVVAsTUFBVixHQUFtQixHQUFuQixHQUF5QlosV0FBekIsR0FBdUMsUUFBdkMsR0FBa0RjLFlBQXpFLENBQVA7QUFERDtBQUdDLGVBQU9oQixRQUFRcUIsY0FBUixDQUF1QixVQUFVUCxNQUFWLEdBQW1CLEdBQW5CLEdBQXlCWixXQUFoRCxDQUFQO0FBTkY7QUFIRDtBQ0VFO0FEWG9CLENBQXZCOztBQW9CQUYsUUFBUXNCLG9CQUFSLEdBQStCLFVBQUNwQixXQUFELEVBQWNXLFNBQWQsRUFBeUJDLE1BQXpCO0FBQzlCLE1BQUFDLFNBQUEsRUFBQUMsWUFBQTs7QUFBQSxNQUFHLENBQUNGLE1BQUo7QUFDQ0EsYUFBU0csUUFBUUMsR0FBUixDQUFZLFFBQVosQ0FBVDtBQ0pDOztBREtGLE1BQUcsQ0FBQ2hCLFdBQUo7QUFDQ0Esa0JBQWNlLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUNIQzs7QURLRkgsY0FBWWYsUUFBUW1CLFdBQVIsQ0FBb0JqQixXQUFwQixFQUFpQyxJQUFqQyxDQUFaO0FBQ0FjLGlCQUFBRCxhQUFBLE9BQWVBLFVBQVdLLEdBQTFCLEdBQTBCLE1BQTFCOztBQUVBLE1BQUdQLFNBQUg7QUFDQyxXQUFPVSxRQUFRQyxXQUFSLENBQW9CLFVBQVVWLE1BQVYsR0FBbUIsR0FBbkIsR0FBeUJaLFdBQXpCLEdBQXVDLFFBQXZDLEdBQWtEVyxTQUF0RSxFQUFpRixJQUFqRixDQUFQO0FBREQ7QUFHQyxXQUFPVSxRQUFRQyxXQUFSLENBQW9CLFVBQVVWLE1BQVYsR0FBbUIsR0FBbkIsR0FBeUJaLFdBQXpCLEdBQXVDLFFBQXZDLEdBQWtEYyxZQUF0RSxFQUFvRixJQUFwRixDQUFQO0FDSkM7QURSNEIsQ0FBL0I7O0FBY0FoQixRQUFReUIsa0JBQVIsR0FBNkIsVUFBQ3ZCLFdBQUQsRUFBY1csU0FBZCxFQUF5QkMsTUFBekI7QUFDNUIsTUFBQUMsU0FBQSxFQUFBQyxZQUFBOztBQUFBLE1BQUcsQ0FBQ0YsTUFBSjtBQUNDQSxhQUFTRyxRQUFRQyxHQUFSLENBQVksUUFBWixDQUFUO0FDREM7O0FERUYsTUFBRyxDQUFDaEIsV0FBSjtBQUNDQSxrQkFBY2UsUUFBUUMsR0FBUixDQUFZLGFBQVosQ0FBZDtBQ0FDOztBREVGSCxjQUFZZixRQUFRbUIsV0FBUixDQUFvQmpCLFdBQXBCLEVBQWlDLElBQWpDLENBQVo7QUFDQWMsaUJBQUFELGFBQUEsT0FBZUEsVUFBV0ssR0FBMUIsR0FBMEIsTUFBMUI7O0FBRUEsTUFBR1AsU0FBSDtBQUNDLFdBQU8sVUFBVUMsTUFBVixHQUFtQixHQUFuQixHQUF5QlosV0FBekIsR0FBdUMsUUFBdkMsR0FBa0RXLFNBQXpEO0FBREQ7QUFHQyxXQUFPLFVBQVVDLE1BQVYsR0FBbUIsR0FBbkIsR0FBeUJaLFdBQXpCLEdBQXVDLFFBQXZDLEdBQWtEYyxZQUF6RDtBQ0RDO0FEWDBCLENBQTdCOztBQWNBaEIsUUFBUTBCLGNBQVIsR0FBeUIsVUFBQ3hCLFdBQUQsRUFBY1ksTUFBZCxFQUFzQkUsWUFBdEI7QUFDeEIsTUFBQVcsR0FBQTtBQUFBQSxRQUFNM0IsUUFBUTRCLHNCQUFSLENBQStCMUIsV0FBL0IsRUFBNENZLE1BQTVDLEVBQW9ERSxZQUFwRCxDQUFOO0FBQ0EsU0FBT2hCLFFBQVFxQixjQUFSLENBQXVCTSxHQUF2QixDQUFQO0FBRndCLENBQXpCOztBQUlBM0IsUUFBUTRCLHNCQUFSLEdBQWlDLFVBQUMxQixXQUFELEVBQWNZLE1BQWQsRUFBc0JFLFlBQXRCO0FBQ2hDLFNBQU8sVUFBVUYsTUFBVixHQUFtQixHQUFuQixHQUF5QlosV0FBekIsR0FBdUMsUUFBdkMsR0FBa0RjLFlBQXpEO0FBRGdDLENBQWpDOztBQUdBaEIsUUFBUTZCLGdCQUFSLEdBQTJCLFVBQUMzQixXQUFELEVBQWNZLE1BQWQsRUFBc0JFLFlBQXRCO0FBQzFCLE1BQUdBLFlBQUg7QUFDQyxXQUFPaEIsUUFBUXFCLGNBQVIsQ0FBdUIsVUFBVVAsTUFBVixHQUFtQixHQUFuQixHQUF5QlosV0FBekIsR0FBdUMsR0FBdkMsR0FBNkNjLFlBQTdDLEdBQTRELE9BQW5GLENBQVA7QUFERDtBQUdDLFdBQU9oQixRQUFRcUIsY0FBUixDQUF1QixVQUFVUCxNQUFWLEdBQW1CLEdBQW5CLEdBQXlCWixXQUF6QixHQUF1QyxjQUE5RCxDQUFQO0FDSUM7QURSd0IsQ0FBM0I7O0FBTUFGLFFBQVE4QixtQkFBUixHQUE4QixVQUFDNUIsV0FBRCxFQUFjWSxNQUFkLEVBQXNCRCxTQUF0QixFQUFpQ2tCLG1CQUFqQyxFQUFzREMsa0JBQXREO0FBQzdCLE1BQUdBLGtCQUFIO0FBQ0MsV0FBT2hDLFFBQVFxQixjQUFSLENBQXVCLFVBQVVQLE1BQVYsR0FBbUIsR0FBbkIsR0FBeUJaLFdBQXpCLEdBQXVDLEdBQXZDLEdBQTZDVyxTQUE3QyxHQUF5RCxHQUF6RCxHQUErRGtCLG1CQUEvRCxHQUFxRiwyQkFBckYsR0FBbUhDLGtCQUExSSxDQUFQO0FBREQ7QUFHQyxXQUFPaEMsUUFBUXFCLGNBQVIsQ0FBdUIsVUFBVVAsTUFBVixHQUFtQixHQUFuQixHQUF5QlosV0FBekIsR0FBdUMsR0FBdkMsR0FBNkNXLFNBQTdDLEdBQXlELEdBQXpELEdBQStEa0IsbUJBQS9ELEdBQXFGLE9BQTVHLENBQVA7QUNNQztBRFYyQixDQUE5Qjs7QUFNQS9CLFFBQVFpQywyQkFBUixHQUFzQyxVQUFDL0IsV0FBRCxFQUFjZ0MsT0FBZCxFQUF1QkMsWUFBdkIsRUFBcUNDLFVBQXJDO0FBQ3JDLE1BQUFDLE9BQUEsRUFBQUMsUUFBQSxFQUFBQyxNQUFBLEVBQUFDLElBQUEsRUFBQUMsY0FBQTs7QUFBQUgsYUFBVyxFQUFYOztBQUNBLE9BQU9wQyxXQUFQO0FBQ0MsV0FBT29DLFFBQVA7QUNTQzs7QURSRkQsWUFBVXJDLFFBQVFJLFNBQVIsQ0FBa0JGLFdBQWxCLENBQVY7QUFDQXFDLFdBQUFGLFdBQUEsT0FBU0EsUUFBU0UsTUFBbEIsR0FBa0IsTUFBbEI7QUFDQUMsU0FBQUgsV0FBQSxPQUFPQSxRQUFTRyxJQUFoQixHQUFnQixNQUFoQjs7QUFDQUUsSUFBRUMsT0FBRixDQUFVSixNQUFWLEVBQWtCLFVBQUNLLENBQUQsRUFBSUMsQ0FBSjtBQUNqQixRQUFHVixnQkFBaUJTLEVBQUVFLE1BQXRCO0FBQ0M7QUNVRTs7QURUSCxRQUFHRixFQUFFRyxJQUFGLEtBQVUsUUFBYjtBQ1dJLGFEVkhULFNBQVNVLElBQVQsQ0FBYztBQUFDQyxlQUFPLE1BQUdMLEVBQUVLLEtBQUYsSUFBV0osQ0FBZCxDQUFSO0FBQTJCSyxlQUFPLEtBQUdMLENBQXJDO0FBQTBDTCxjQUFNQTtBQUFoRCxPQUFkLENDVUc7QURYSjtBQ2lCSSxhRGRIRixTQUFTVSxJQUFULENBQWM7QUFBQ0MsZUFBT0wsRUFBRUssS0FBRixJQUFXSixDQUFuQjtBQUFzQkssZUFBT0wsQ0FBN0I7QUFBZ0NMLGNBQU1BO0FBQXRDLE9BQWQsQ0NjRztBQUtEO0FEekJKOztBQU9BLE1BQUdOLE9BQUg7QUFDQ1EsTUFBRUMsT0FBRixDQUFVSixNQUFWLEVBQWtCLFVBQUNLLENBQUQsRUFBSUMsQ0FBSjtBQUNqQixVQUFBTSxRQUFBOztBQUFBLFVBQUdoQixnQkFBaUJTLEVBQUVFLE1BQXRCO0FBQ0M7QUNzQkc7O0FEckJKLFVBQUcsQ0FBQ0YsRUFBRUcsSUFBRixLQUFVLFFBQVYsSUFBc0JILEVBQUVHLElBQUYsS0FBVSxlQUFqQyxLQUFxREgsRUFBRVEsWUFBdkQsSUFBdUVWLEVBQUVXLFFBQUYsQ0FBV1QsRUFBRVEsWUFBYixDQUExRTtBQUVDRCxtQkFBV25ELFFBQVFJLFNBQVIsQ0FBa0J3QyxFQUFFUSxZQUFwQixDQUFYOztBQUNBLFlBQUdELFFBQUg7QUNzQk0saUJEckJMVCxFQUFFQyxPQUFGLENBQVVRLFNBQVNaLE1BQW5CLEVBQTJCLFVBQUNlLEVBQUQsRUFBS0MsRUFBTDtBQ3NCcEIsbUJEckJOakIsU0FBU1UsSUFBVCxDQUFjO0FBQUNDLHFCQUFTLENBQUNMLEVBQUVLLEtBQUYsSUFBV0osQ0FBWixJQUFjLElBQWQsSUFBa0JTLEdBQUdMLEtBQUgsSUFBWU0sRUFBOUIsQ0FBVjtBQUE4Q0wscUJBQVVMLElBQUUsR0FBRixHQUFLVSxFQUE3RDtBQUFtRWYsb0JBQUFXLFlBQUEsT0FBTUEsU0FBVVgsSUFBaEIsR0FBZ0I7QUFBbkYsYUFBZCxDQ3FCTTtBRHRCUCxZQ3FCSztBRHpCUDtBQ2lDSTtBRHBDTDtBQ3NDQzs7QUQ3QkYsTUFBR0osVUFBSDtBQUNDSyxxQkFBaUJ6QyxRQUFRd0QsaUJBQVIsQ0FBMEJ0RCxXQUExQixDQUFqQjs7QUFDQXdDLE1BQUVlLElBQUYsQ0FBT2hCLGNBQVAsRUFBdUIsVUFBQWlCLEtBQUE7QUMrQm5CLGFEL0JtQixVQUFDQyxjQUFEO0FBQ3RCLFlBQUFDLGFBQUEsRUFBQUMsY0FBQTtBQUFBQSx5QkFBaUI3RCxRQUFRaUMsMkJBQVIsQ0FBb0MwQixlQUFlekQsV0FBbkQsRUFBZ0UsS0FBaEUsRUFBdUUsS0FBdkUsRUFBOEUsS0FBOUUsQ0FBakI7QUFDQTBELHdCQUFnQjVELFFBQVFJLFNBQVIsQ0FBa0J1RCxlQUFlekQsV0FBakMsQ0FBaEI7QUNpQ0ssZURoQ0x3QyxFQUFFZSxJQUFGLENBQU9JLGNBQVAsRUFBdUIsVUFBQ0MsYUFBRDtBQUN0QixjQUFHSCxlQUFlSSxXQUFmLEtBQThCRCxjQUFjWixLQUEvQztBQ2lDUSxtQkRoQ1BaLFNBQVNVLElBQVQsQ0FBYztBQUFDQyxxQkFBUyxDQUFDVyxjQUFjWCxLQUFkLElBQXVCVyxjQUFjSSxJQUF0QyxJQUEyQyxJQUEzQyxHQUErQ0YsY0FBY2IsS0FBdkU7QUFBZ0ZDLHFCQUFVVSxjQUFjSSxJQUFkLEdBQW1CLEdBQW5CLEdBQXNCRixjQUFjWixLQUE5SDtBQUF1SVYsb0JBQUFvQixpQkFBQSxPQUFNQSxjQUFlcEIsSUFBckIsR0FBcUI7QUFBNUosYUFBZCxDQ2dDTztBQUtEO0FEdkNSLFVDZ0NLO0FEbkNpQixPQytCbkI7QUQvQm1CLFdBQXZCO0FDOENDOztBRHhDRixTQUFPRixRQUFQO0FBaENxQyxDQUF0Qzs7QUFtQ0F0QyxRQUFRaUUsMkJBQVIsR0FBc0MsVUFBQy9ELFdBQUQ7QUFDckMsTUFBQW1DLE9BQUEsRUFBQUMsUUFBQSxFQUFBQyxNQUFBLEVBQUFDLElBQUEsRUFBQTBCLGlCQUFBOztBQUFBNUIsYUFBVyxFQUFYOztBQUNBLE9BQU9wQyxXQUFQO0FBQ0MsV0FBT29DLFFBQVA7QUMyQ0M7O0FEMUNGRCxZQUFVckMsUUFBUUksU0FBUixDQUFrQkYsV0FBbEIsQ0FBVjtBQUNBcUMsV0FBQUYsV0FBQSxPQUFTQSxRQUFTRSxNQUFsQixHQUFrQixNQUFsQjtBQUNBMkIsc0JBQW9CbEUsUUFBUW1FLFNBQVIsQ0FBa0JqRSxXQUFsQixDQUFwQjtBQUNBc0MsU0FBQUgsV0FBQSxPQUFPQSxRQUFTRyxJQUFoQixHQUFnQixNQUFoQjs7QUFDQUUsSUFBRUMsT0FBRixDQUFVSixNQUFWLEVBQWtCLFVBQUNLLENBQUQsRUFBSUMsQ0FBSjtBQUVqQixRQUFHLENBQUNILEVBQUUwQixPQUFGLENBQVUsQ0FBQyxNQUFELEVBQVEsUUFBUixFQUFrQixVQUFsQixFQUE4QixVQUE5QixFQUEwQyxRQUExQyxFQUFvRCxRQUFwRCxFQUE4RCxPQUE5RCxFQUF1RSxVQUF2RSxFQUFtRixNQUFuRixDQUFWLEVBQXNHeEIsRUFBRUcsSUFBeEcsQ0FBRCxJQUFtSCxDQUFDSCxFQUFFRSxNQUF6SDtBQUVDLFVBQUcsQ0FBQyxRQUFRdUIsSUFBUixDQUFheEIsQ0FBYixDQUFELElBQXFCSCxFQUFFNEIsT0FBRixDQUFVSixpQkFBVixFQUE2QnJCLENBQTdCLElBQWtDLENBQUMsQ0FBM0Q7QUMwQ0ssZUR6Q0pQLFNBQVNVLElBQVQsQ0FBYztBQUFDQyxpQkFBT0wsRUFBRUssS0FBRixJQUFXSixDQUFuQjtBQUFzQkssaUJBQU9MLENBQTdCO0FBQWdDTCxnQkFBTUE7QUFBdEMsU0FBZCxDQ3lDSTtBRDVDTjtBQ2tERztBRHBESjs7QUFPQSxTQUFPRixRQUFQO0FBZnFDLENBQXRDOztBQWlCQXRDLFFBQVF1RSxxQkFBUixHQUFnQyxVQUFDckUsV0FBRDtBQUMvQixNQUFBbUMsT0FBQSxFQUFBQyxRQUFBLEVBQUFDLE1BQUEsRUFBQUMsSUFBQSxFQUFBMEIsaUJBQUE7O0FBQUE1QixhQUFXLEVBQVg7O0FBQ0EsT0FBT3BDLFdBQVA7QUFDQyxXQUFPb0MsUUFBUDtBQ2tEQzs7QURqREZELFlBQVVyQyxRQUFRSSxTQUFSLENBQWtCRixXQUFsQixDQUFWO0FBQ0FxQyxXQUFBRixXQUFBLE9BQVNBLFFBQVNFLE1BQWxCLEdBQWtCLE1BQWxCO0FBQ0EyQixzQkFBb0JsRSxRQUFRbUUsU0FBUixDQUFrQmpFLFdBQWxCLENBQXBCO0FBQ0FzQyxTQUFBSCxXQUFBLE9BQU9BLFFBQVNHLElBQWhCLEdBQWdCLE1BQWhCOztBQUNBRSxJQUFFQyxPQUFGLENBQVVKLE1BQVYsRUFBa0IsVUFBQ0ssQ0FBRCxFQUFJQyxDQUFKO0FBQ2pCLFFBQUcsQ0FBQ0gsRUFBRTBCLE9BQUYsQ0FBVSxDQUFDLE1BQUQsRUFBUSxRQUFSLEVBQWtCLFVBQWxCLEVBQThCLFVBQTlCLEVBQTBDLFFBQTFDLEVBQW9ELFVBQXBELEVBQWdFLE1BQWhFLENBQVYsRUFBbUZ4QixFQUFFRyxJQUFyRixDQUFKO0FBQ0MsVUFBRyxDQUFDLFFBQVFzQixJQUFSLENBQWF4QixDQUFiLENBQUQsSUFBcUJILEVBQUU0QixPQUFGLENBQVVKLGlCQUFWLEVBQTZCckIsQ0FBN0IsSUFBa0MsQ0FBQyxDQUEzRDtBQ21ESyxlRGxESlAsU0FBU1UsSUFBVCxDQUFjO0FBQUNDLGlCQUFPTCxFQUFFSyxLQUFGLElBQVdKLENBQW5CO0FBQXNCSyxpQkFBT0wsQ0FBN0I7QUFBZ0NMLGdCQUFNQTtBQUF0QyxTQUFkLENDa0RJO0FEcEROO0FDMERHO0FEM0RKOztBQUlBLFNBQU9GLFFBQVA7QUFaK0IsQ0FBaEMsQyxDQWNBOzs7Ozs7OztBQU9BdEMsUUFBUXdFLDBCQUFSLEdBQXFDLFVBQUNDLE9BQUQsRUFBVWxDLE1BQVYsRUFBa0JtQyxhQUFsQjtBQUNwQyxPQUFPRCxPQUFQO0FBQ0NBLGNBQVUsRUFBVjtBQzZEQzs7QUQ1REYsT0FBT0MsYUFBUDtBQUNDQSxvQkFBZ0IsRUFBaEI7QUM4REM7O0FEN0RGLE1BQUFBLGlCQUFBLE9BQUdBLGNBQWVDLE1BQWxCLEdBQWtCLE1BQWxCO0FBQ0NELGtCQUFjL0IsT0FBZCxDQUFzQixVQUFDaUMsQ0FBRDtBQUNyQixVQUFHbEMsRUFBRVcsUUFBRixDQUFXdUIsQ0FBWCxDQUFIO0FBQ0NBLFlBQ0M7QUFBQUMsaUJBQU9ELENBQVA7QUFDQUUsb0JBQVU7QUFEVixTQUREO0FDa0VHOztBRC9ESixVQUFHdkMsT0FBT3FDLEVBQUVDLEtBQVQsS0FBb0IsQ0FBQ25DLEVBQUVxQyxTQUFGLENBQVlOLE9BQVosRUFBb0I7QUFBQ0ksZUFBTUQsRUFBRUM7QUFBVCxPQUFwQixDQUF4QjtBQ21FSyxlRGxFSkosUUFBUXpCLElBQVIsQ0FDQztBQUFBNkIsaUJBQU9ELEVBQUVDLEtBQVQ7QUFDQUcsc0JBQVksSUFEWjtBQUVBQyx1QkFBYUwsRUFBRUU7QUFGZixTQURELENDa0VJO0FBS0Q7QUQ3RUw7QUMrRUM7O0FEckVGTCxVQUFROUIsT0FBUixDQUFnQixVQUFDdUMsVUFBRDtBQUNmLFFBQUFDLFVBQUE7QUFBQUEsaUJBQWFULGNBQWNVLElBQWQsQ0FBbUIsVUFBQ1IsQ0FBRDtBQUFNLGFBQU9BLE1BQUtNLFdBQVdMLEtBQWhCLElBQXlCRCxFQUFFQyxLQUFGLEtBQVdLLFdBQVdMLEtBQXREO0FBQXpCLE1BQWI7O0FBQ0EsUUFBR25DLEVBQUVXLFFBQUYsQ0FBVzhCLFVBQVgsQ0FBSDtBQUNDQSxtQkFDQztBQUFBTixlQUFPTSxVQUFQO0FBQ0FMLGtCQUFVO0FBRFYsT0FERDtBQzZFRTs7QUQxRUgsUUFBR0ssVUFBSDtBQUNDRCxpQkFBV0YsVUFBWCxHQUF3QixJQUF4QjtBQzRFRyxhRDNFSEUsV0FBV0QsV0FBWCxHQUF5QkUsV0FBV0wsUUMyRWpDO0FEN0VKO0FBSUMsYUFBT0ksV0FBV0YsVUFBbEI7QUM0RUcsYUQzRUgsT0FBT0UsV0FBV0QsV0MyRWY7QUFDRDtBRHZGSjtBQVlBLFNBQU9SLE9BQVA7QUE1Qm9DLENBQXJDOztBQThCQXpFLFFBQVFxRixlQUFSLEdBQTBCLFVBQUNuRixXQUFELEVBQWNXLFNBQWQsRUFBeUJ5RSxhQUF6QixFQUF3Q0MsTUFBeEM7QUFFekIsTUFBQUMsVUFBQSxFQUFBQyxHQUFBLEVBQUFDLE1BQUEsRUFBQXZGLEdBQUEsRUFBQXdGLElBQUEsRUFBQUMsSUFBQTs7QUFBQSxNQUFHLENBQUMxRixXQUFKO0FBQ0NBLGtCQUFjZSxRQUFRQyxHQUFSLENBQVksYUFBWixDQUFkO0FDK0VDOztBRDdFRixNQUFHLENBQUNMLFNBQUo7QUFDQ0EsZ0JBQVlJLFFBQVFDLEdBQVIsQ0FBWSxXQUFaLENBQVo7QUMrRUM7O0FEOUVGLE1BQUd0QixPQUFPVyxRQUFWO0FBQ0MsUUFBR0wsZ0JBQWVlLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWYsSUFBOENMLGNBQWFJLFFBQVFDLEdBQVIsQ0FBWSxXQUFaLENBQTlEO0FBQ0MsV0FBQWYsTUFBQTBGLFNBQUFDLFFBQUEsY0FBQTNGLElBQXdCdUYsTUFBeEIsR0FBd0IsTUFBeEI7QUFDQyxnQkFBQUMsT0FBQUUsU0FBQUMsUUFBQSxlQUFBRixPQUFBRCxLQUFBRCxNQUFBLFlBQUFFLEtBQW9DMUUsR0FBcEMsS0FBTyxNQUFQLEdBQU8sTUFBUDtBQUZGO0FBQUE7QUFJQyxhQUFPbEIsUUFBUStGLEtBQVIsQ0FBYzdFLEdBQWQsQ0FBa0JoQixXQUFsQixFQUErQlcsU0FBL0IsRUFBMEN5RSxhQUExQyxFQUF5REMsTUFBekQsQ0FBUDtBQUxGO0FDdUZFOztBRGhGRkUsUUFBTXpGLFFBQVFJLFNBQVIsQ0FBa0JGLFdBQWxCLENBQU47O0FBRUEsTUFBR3VGLElBQUlPLGFBQUosS0FBcUIsUUFBckIsSUFBaUMsQ0FBQ1AsSUFBSU8sYUFBekM7QUFDQ1IsaUJBQWF4RixRQUFRaUcsYUFBUixDQUFzQi9GLFdBQXRCLENBQWI7O0FBQ0EsUUFBR3NGLFVBQUg7QUFDQ0UsZUFBU0YsV0FBV1UsT0FBWCxDQUFtQnJGLFNBQW5CLENBQVQ7QUFDQSxhQUFPNkUsTUFBUDtBQUpGO0FBQUEsU0FLSyxJQUFHeEYsZUFBZVcsU0FBbEI7QUFDSixXQUFPYixRQUFRK0YsS0FBUixDQUFjN0UsR0FBZCxDQUFrQmhCLFdBQWxCLEVBQStCVyxTQUEvQixFQUEwQ3lFLGFBQTFDLEVBQXlEQyxNQUF6RCxDQUFQO0FDa0ZDO0FEeEd1QixDQUExQjs7QUF3QkF2RixRQUFRbUcsbUJBQVIsR0FBOEIsVUFBQ1QsTUFBRCxFQUFTeEYsV0FBVDtBQUM3QixNQUFBa0csY0FBQSxFQUFBakcsR0FBQTs7QUFBQSxPQUFPdUYsTUFBUDtBQUNDQSxhQUFTMUYsUUFBUXFGLGVBQVIsRUFBVDtBQ3FGQzs7QURwRkYsTUFBR0ssTUFBSDtBQUVDVSxxQkFBb0JsRyxnQkFBZSxlQUFmLEdBQW9DLE1BQXBDLEdBQUgsQ0FBQUMsTUFBQUgsUUFBQUksU0FBQSxDQUFBRixXQUFBLGFBQUFDLElBQW1Ga0csY0FBbkYsR0FBbUYsTUFBcEc7O0FBQ0EsUUFBR1gsVUFBV1UsY0FBZDtBQUNDLGFBQU9WLE9BQU96QyxLQUFQLElBQWdCeUMsT0FBT1UsY0FBUCxDQUF2QjtBQUpGO0FDMEZFO0FEN0YyQixDQUE5Qjs7QUFTQXBHLFFBQVFzRyxNQUFSLEdBQWlCLFVBQUN4RixNQUFEO0FBQ2hCLE1BQUF5RixHQUFBLEVBQUFwRyxHQUFBLEVBQUF3RixJQUFBOztBQUFBLE1BQUcsQ0FBQzdFLE1BQUo7QUFDQ0EsYUFBU0csUUFBUUMsR0FBUixDQUFZLFFBQVosQ0FBVDtBQ3lGQzs7QUR4RkZxRixRQUFNdkcsUUFBUXdHLElBQVIsQ0FBYTFGLE1BQWIsQ0FBTjs7QUMwRkMsTUFBSSxDQUFDWCxNQUFNSCxRQUFReUcsSUFBZixLQUF3QixJQUE1QixFQUFrQztBQUNoQyxRQUFJLENBQUNkLE9BQU94RixJQUFJb0csR0FBWixLQUFvQixJQUF4QixFQUE4QjtBQUM1QlosV0QzRmNlLE1DMkZkO0FBQ0Q7QUFDRjs7QUQ1RkYsU0FBT0gsR0FBUDtBQUxnQixDQUFqQjs7QUFPQXZHLFFBQVEyRyxlQUFSLEdBQTBCLFVBQUM3RixNQUFEO0FBQ3pCLE1BQUF5RixHQUFBLEVBQUFLLFNBQUE7QUFBQUwsUUFBTXZHLFFBQVFzRyxNQUFSLENBQWV4RixNQUFmLENBQU47O0FBQ0EsTUFBRyxDQUFDeUYsR0FBSjtBQUNDO0FDZ0dDOztBRC9GRkssY0FBWSxJQUFaOztBQUNBbEUsSUFBRWUsSUFBRixDQUFPekQsUUFBUTZHLFVBQWYsRUFBMkIsVUFBQ25ILENBQUQsRUFBSW1ELENBQUo7QUFDMUIsUUFBQTFDLEdBQUE7O0FBQUEsVUFBQUEsTUFBQVQsRUFBQW9ILElBQUEsWUFBQTNHLElBQVdtRSxPQUFYLENBQW1CaUMsSUFBSW5GLEdBQXZCLElBQUcsTUFBSCxJQUE4QixDQUFDLENBQS9CO0FDa0dJLGFEakdId0YsWUFBWWxILENDaUdUO0FBQ0Q7QURwR0o7O0FBR0EsU0FBT2tILFNBQVA7QUFSeUIsQ0FBMUI7O0FBVUE1RyxRQUFRK0csd0JBQVIsR0FBbUMsVUFBQ2pHLE1BQUQ7QUFDbEMsTUFBQXlGLEdBQUE7QUFBQUEsUUFBTXZHLFFBQVFzRyxNQUFSLENBQWV4RixNQUFmLENBQU47O0FBQ0EsTUFBRyxDQUFDeUYsR0FBSjtBQUNDO0FDc0dDOztBRHJHRixTQUFPL0YsZUFBZUMsdUJBQWYsQ0FBdUNELGVBQWVFLEtBQWYsQ0FBcUJDLFFBQXJCLEVBQXZDLEVBQXdFLFdBQXhFLEVBQXFGNEYsSUFBSW5GLEdBQXpGLENBQVA7QUFKa0MsQ0FBbkM7O0FBTUFwQixRQUFRZ0gsaUJBQVIsR0FBNEIsVUFBQ2xHLE1BQUQ7QUFDM0IsTUFBQXlGLEdBQUEsRUFBQVUsVUFBQSxFQUFBQyxRQUFBLEVBQUFDLE9BQUE7QUFBQVosUUFBTXZHLFFBQVFzRyxNQUFSLENBQWV4RixNQUFmLENBQU47O0FBQ0EsTUFBRyxDQUFDeUYsR0FBSjtBQUNDO0FDeUdDOztBRHhHRlcsYUFBVzNGLFFBQVEyRixRQUFSLEVBQVg7QUFDQUQsZUFBZ0JDLFdBQWNYLElBQUlhLGNBQWxCLEdBQXNDYixJQUFJWSxPQUExRDtBQUNBQSxZQUFVLEVBQVY7O0FBQ0EsTUFBR1osR0FBSDtBQUNDN0QsTUFBRWUsSUFBRixDQUFPd0QsVUFBUCxFQUFtQixVQUFDdkgsQ0FBRDtBQUNsQixVQUFBK0YsR0FBQTtBQUFBQSxZQUFNekYsUUFBUUksU0FBUixDQUFrQlYsQ0FBbEIsQ0FBTjs7QUFDQSxVQUFBK0YsT0FBQSxPQUFHQSxJQUFLNEIsV0FBTCxDQUFpQm5HLEdBQWpCLEdBQXVCb0csU0FBMUIsR0FBMEIsTUFBMUI7QUMyR0ssZUQxR0pILFFBQVFuRSxJQUFSLENBQWF0RCxDQUFiLENDMEdJO0FBQ0Q7QUQ5R0w7QUNnSEM7O0FENUdGLFNBQU95SCxPQUFQO0FBWjJCLENBQTVCOztBQWNBbkgsUUFBUXVILGVBQVIsR0FBMEIsVUFBQzVGLEdBQUQsRUFBTTZGLGtCQUFOO0FBRXpCLE1BQUFDLGNBQUEsRUFBQUMsT0FBQSxFQUFBQyxNQUFBO0FBQUFBLFdBQVMsRUFBVDtBQUNBQSxTQUFPLFlBQVAsSUFBdUJwRyxRQUFRcUcsT0FBUixFQUF2QjtBQUNBRCxTQUFPLFdBQVAsSUFBc0JwRyxRQUFRc0csTUFBUixFQUF0QjtBQUNBRixTQUFPLGVBQVAsSUFBMEJwRyxRQUFRdUcsaUJBQVIsRUFBMUI7QUFDQUgsU0FBTyxjQUFQLElBQXlCSSxTQUFTQyxpQkFBVCxFQUF6Qjs7QUFDQSxNQUFHekcsUUFBUTBHLFlBQVIsQ0FBcUJ0RyxHQUFyQixDQUFIO0FBQ0NBLFVBQU1KLFFBQVEyRyxxQkFBUixDQUE4QnZHLEdBQTlCLEVBQW1DNkYsa0JBQW5DLEVBQXVELEdBQXZELEVBQTREeEgsUUFBUW1JLFlBQXBFLENBQU47QUMrR0M7O0FENUdGVixtQkFBaUIsdUJBQXVCcEQsSUFBdkIsQ0FBNEIxQyxHQUE1QixDQUFqQjtBQUNBK0YsWUFBYUQsaUJBQW9CLEdBQXBCLEdBQTZCLEdBQTFDO0FBQ0EsU0FBTyxLQUFHOUYsR0FBSCxHQUFTK0YsT0FBVCxHQUFtQlUsRUFBRUMsS0FBRixDQUFRVixNQUFSLENBQTFCO0FBYnlCLENBQTFCOztBQWVBM0gsUUFBUXNJLFVBQVIsR0FBcUIsVUFBQ3hILE1BQUQsRUFBU3lILE9BQVQ7QUFDcEIsTUFBQUMsS0FBQTtBQUFBQSxVQUFReEksUUFBUXlJLFdBQVIsQ0FBb0IzSCxNQUFwQixDQUFSO0FBQ0EsU0FBTzBILFNBQVNBLE1BQU1wRCxJQUFOLENBQVcsVUFBQ3NELElBQUQ7QUFBUyxXQUFPQSxLQUFLQyxFQUFMLEtBQVdKLE9BQWxCO0FBQXBCLElBQWhCO0FBRm9CLENBQXJCOztBQUlBdkksUUFBUTRJLHdCQUFSLEdBQW1DLFVBQUNGLElBQUQ7QUFFbEMsU0FBTzFJLFFBQVF1SCxlQUFSLENBQXdCbUIsS0FBS0csSUFBN0IsRUFBbUNILElBQW5DLENBQVA7QUFGa0MsQ0FBbkM7O0FBSUExSSxRQUFROEksYUFBUixHQUF3QixVQUFDSixJQUFEO0FBQ3ZCLE1BQUEvRyxHQUFBO0FBQUFBLFFBQU0rRyxLQUFLRyxJQUFYOztBQUNBLE1BQUdILEtBQUszRixJQUFMLEtBQWEsS0FBaEI7QUFDQyxRQUFHMkYsS0FBS0ssTUFBUjtBQUNDLGFBQU8vSSxRQUFRNEksd0JBQVIsQ0FBaUNGLElBQWpDLENBQVA7QUFERDtBQUlDLGFBQU8sdUJBQXFCQSxLQUFLQyxFQUFqQztBQUxGO0FBQUE7QUFPQyxXQUFPRCxLQUFLRyxJQUFaO0FDb0hDO0FEN0hxQixDQUF4Qjs7QUFXQTdJLFFBQVF5SSxXQUFSLEdBQXNCLFVBQUMzSCxNQUFEO0FBQ3JCLE1BQUF5RixHQUFBLEVBQUF5QyxRQUFBLEVBQUFDLGNBQUE7QUFBQTFDLFFBQU12RyxRQUFRc0csTUFBUixDQUFleEYsTUFBZixDQUFOOztBQUNBLE1BQUcsQ0FBQ3lGLEdBQUo7QUFDQyxXQUFPLEVBQVA7QUN1SEM7O0FEdEhGeUMsYUFBVy9ILFFBQVFDLEdBQVIsQ0FBWSxXQUFaLENBQVg7O0FBQ0EsT0FBTzhILFFBQVA7QUFDQyxXQUFPLEVBQVA7QUN3SEM7O0FEdkhGQyxtQkFBaUJELFNBQVM1RCxJQUFULENBQWMsVUFBQzhELFFBQUQ7QUFDOUIsV0FBT0EsU0FBU1AsRUFBVCxLQUFlcEMsSUFBSW5GLEdBQTFCO0FBRGdCLElBQWpCOztBQUVBLE1BQUc2SCxjQUFIO0FBQ0MsV0FBT0EsZUFBZUUsUUFBdEI7QUMwSEM7QURwSW1CLENBQXRCOztBQVlBbkosUUFBUW9KLGFBQVIsR0FBd0I7QUFDdkIsTUFBQUMsSUFBQSxFQUFBbkMsUUFBQSxFQUFBb0MsT0FBQTtBQUFBcEMsYUFBVzNGLFFBQVEyRixRQUFSLEVBQVg7QUFDQW1DLFNBQU8sRUFBUDs7QUFDQSxNQUFHbkMsUUFBSDtBQUNDbUMsU0FBS0UsTUFBTCxHQUFjckMsUUFBZDtBQzZIQzs7QUQ1SEZvQyxZQUFVO0FBQ1R2RyxVQUFNLEtBREc7QUFFVHNHLFVBQU1BLElBRkc7QUFHVEcsYUFBUyxVQUFDSCxJQUFEO0FDOEhMLGFEN0hIcEksUUFBUXdJLEdBQVIsQ0FBWSxXQUFaLEVBQXlCSixJQUF6QixDQzZIRztBRGpJSztBQUFBLEdBQVY7QUNvSUMsU0Q5SEQ5SCxRQUFRbUksV0FBUixDQUFvQix5QkFBcEIsRUFBK0NKLE9BQS9DLENDOEhDO0FEeklzQixDQUF4Qjs7QUFhQXRKLFFBQVEySixjQUFSLEdBQXlCLFVBQUNDLFlBQUQ7QUFDeEIsTUFBQUMsU0FBQTtBQUFBQSxjQUFZN0osUUFBUThKLE9BQVIsQ0FBZ0I1SSxHQUFoQixFQUFaO0FBQ0FWLGlCQUFlRSxLQUFmLENBQXFCQyxRQUFyQixHQUFnQ29KLFFBQWhDLENBQXlDakQsSUFBekMsR0FBZ0RrRCxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQnpKLGVBQWVFLEtBQWYsQ0FBcUJDLFFBQXJCLEdBQWdDb0osUUFBaEMsQ0FBeUNqRCxJQUEzRCxFQUFpRTtBQUFDQSxVQUFNK0M7QUFBUCxHQUFqRSxDQUFoRDtBQUNBLFNBQU9ySixlQUFlMEosbUJBQWYsQ0FBbUMxSixlQUFlRSxLQUFmLENBQXFCQyxRQUFyQixFQUFuQyxFQUFvRWlKLFlBQXBFLENBQVA7QUFId0IsQ0FBekI7O0FBS0E1SixRQUFRbUsscUJBQVIsR0FBZ0M7QUFDL0IsTUFBQXJELElBQUEsRUFBQUssT0FBQSxFQUFBaUQsa0JBQUE7QUFBQXRELFNBQU85RyxRQUFRMkosY0FBUixFQUFQO0FBQ0FTLHVCQUFxQjFILEVBQUUySCxPQUFGLENBQVUzSCxFQUFFNEgsS0FBRixDQUFReEQsSUFBUixFQUFhLFNBQWIsQ0FBVixDQUFyQjtBQUNBSyxZQUFVekUsRUFBRTZILE1BQUYsQ0FBU3ZLLFFBQVF3SyxPQUFqQixFQUEwQixVQUFDL0UsR0FBRDtBQUNuQyxRQUFHMkUsbUJBQW1COUYsT0FBbkIsQ0FBMkJtQixJQUFJekIsSUFBL0IsSUFBdUMsQ0FBMUM7QUFDQyxhQUFPLEtBQVA7QUFERDtBQUdDLGFBQU8sSUFBUDtBQ3FJRTtBRHpJTSxJQUFWO0FBS0FtRCxZQUFVQSxRQUFRc0QsSUFBUixDQUFhekssUUFBUTBLLGFBQVIsQ0FBc0JDLElBQXRCLENBQTJCO0FBQUNDLFNBQUk7QUFBTCxHQUEzQixDQUFiLENBQVY7QUFDQXpELFlBQVV6RSxFQUFFNEgsS0FBRixDQUFRbkQsT0FBUixFQUFnQixNQUFoQixDQUFWO0FBQ0EsU0FBT3pFLEVBQUVtSSxJQUFGLENBQU8xRCxPQUFQLENBQVA7QUFWK0IsQ0FBaEM7O0FBWUFuSCxRQUFROEssY0FBUixHQUF5QjtBQUN4QixNQUFBM0QsT0FBQSxFQUFBNEQsV0FBQTtBQUFBNUQsWUFBVSxFQUFWO0FBQ0E0RCxnQkFBYyxFQUFkOztBQUNBckksSUFBRUMsT0FBRixDQUFVM0MsUUFBUXdHLElBQWxCLEVBQXdCLFVBQUNELEdBQUQ7QUFDdkJ3RSxrQkFBY3JJLEVBQUU2SCxNQUFGLENBQVNoRSxJQUFJWSxPQUFiLEVBQXNCLFVBQUMxQixHQUFEO0FBQ25DLGFBQU8sQ0FBQ0EsSUFBSTNDLE1BQVo7QUFEYSxNQUFkO0FDNklFLFdEM0lGcUUsVUFBVUEsUUFBUTZELE1BQVIsQ0FBZUQsV0FBZixDQzJJUjtBRDlJSDs7QUFJQSxTQUFPckksRUFBRW1JLElBQUYsQ0FBTzFELE9BQVAsQ0FBUDtBQVB3QixDQUF6Qjs7QUFTQW5ILFFBQVFpTCxlQUFSLEdBQTBCLFVBQUN4RyxPQUFELEVBQVV5RyxLQUFWO0FBQ3pCLE1BQUFDLENBQUEsRUFBQUMsUUFBQSxFQUFBQyxZQUFBLEVBQUFDLGFBQUEsRUFBQUMsSUFBQSxFQUFBQyxLQUFBLEVBQUFDLElBQUE7QUFBQUosaUJBQWUzSSxFQUFFZ0osR0FBRixDQUFNakgsT0FBTixFQUFlLFVBQUNnQixHQUFEO0FBQzdCLFFBQUcvQyxFQUFFaUosT0FBRixDQUFVbEcsR0FBVixDQUFIO0FBQ0MsYUFBTyxLQUFQO0FBREQ7QUFHQyxhQUFPQSxHQUFQO0FDK0lFO0FEbkpXLElBQWY7QUFLQTRGLGlCQUFlM0ksRUFBRWtKLE9BQUYsQ0FBVVAsWUFBVixDQUFmO0FBQ0FELGFBQVcsRUFBWDtBQUNBRSxrQkFBZ0JELGFBQWExRyxNQUE3Qjs7QUFDQSxNQUFHdUcsS0FBSDtBQUVDQSxZQUFRQSxNQUFNVyxPQUFOLENBQWMsS0FBZCxFQUFxQixFQUFyQixFQUF5QkEsT0FBekIsQ0FBaUMsTUFBakMsRUFBeUMsR0FBekMsQ0FBUjs7QUFHQSxRQUFHLGNBQWN4SCxJQUFkLENBQW1CNkcsS0FBbkIsQ0FBSDtBQUNDRSxpQkFBVyxTQUFYO0FDOElFOztBRDVJSCxRQUFHLENBQUNBLFFBQUo7QUFDQ0ksY0FBUU4sTUFBTVksS0FBTixDQUFZLE9BQVosQ0FBUjs7QUFDQSxVQUFHLENBQUNOLEtBQUo7QUFDQ0osbUJBQVcsNEJBQVg7QUFERDtBQUdDSSxjQUFNN0ksT0FBTixDQUFjLFVBQUNvSixDQUFEO0FBQ2IsY0FBR0EsSUFBSSxDQUFKLElBQVNBLElBQUlULGFBQWhCO0FDOElPLG1CRDdJTkYsV0FBVyxzQkFBb0JXLENBQXBCLEdBQXNCLEdDNkkzQjtBQUNEO0FEaEpQO0FBSUFSLGVBQU8sQ0FBUDs7QUFDQSxlQUFNQSxRQUFRRCxhQUFkO0FBQ0MsY0FBRyxDQUFDRSxNQUFNUSxRQUFOLENBQWUsS0FBR1QsSUFBbEIsQ0FBSjtBQUNDSCx1QkFBVyw0QkFBWDtBQytJSzs7QUQ5SU5HO0FBWEY7QUFGRDtBQytKRzs7QURoSkgsUUFBRyxDQUFDSCxRQUFKO0FBRUNLLGFBQU9QLE1BQU1ZLEtBQU4sQ0FBWSxhQUFaLENBQVA7O0FBQ0EsVUFBR0wsSUFBSDtBQUNDQSxhQUFLOUksT0FBTCxDQUFhLFVBQUNzSixDQUFEO0FBQ1osY0FBRyxDQUFDLGVBQWU1SCxJQUFmLENBQW9CNEgsQ0FBcEIsQ0FBSjtBQ2lKTyxtQkRoSk5iLFdBQVcsaUJDZ0pMO0FBQ0Q7QURuSlA7QUFKRjtBQzBKRzs7QURsSkgsUUFBRyxDQUFDQSxRQUFKO0FBRUM7QUFDQ3BMLGdCQUFPLE1BQVAsRUFBYWtMLE1BQU1XLE9BQU4sQ0FBYyxPQUFkLEVBQXVCLElBQXZCLEVBQTZCQSxPQUE3QixDQUFxQyxNQUFyQyxFQUE2QyxJQUE3QyxDQUFiO0FBREQsZUFBQUssS0FBQTtBQUVNZixZQUFBZSxLQUFBO0FBQ0xkLG1CQUFXLGNBQVg7QUNvSkc7O0FEbEpKLFVBQUcsb0JBQW9CL0csSUFBcEIsQ0FBeUI2RyxLQUF6QixLQUFvQyxvQkFBb0I3RyxJQUFwQixDQUF5QjZHLEtBQXpCLENBQXZDO0FBQ0NFLG1CQUFXLGtDQUFYO0FBUkY7QUEvQkQ7QUM2TEU7O0FEckpGLE1BQUdBLFFBQUg7QUFDQ2UsWUFBUUMsR0FBUixDQUFZLE9BQVosRUFBcUJoQixRQUFyQjs7QUFDQSxRQUFHeEwsT0FBT1csUUFBVjtBQUNDOEwsYUFBT0gsS0FBUCxDQUFhZCxRQUFiO0FDdUpFOztBRHRKSCxXQUFPLEtBQVA7QUFKRDtBQU1DLFdBQU8sSUFBUDtBQ3dKQztBRC9NdUIsQ0FBMUIsQyxDQTBEQTs7Ozs7Ozs7QUFPQXBMLFFBQVFzTSxvQkFBUixHQUErQixVQUFDN0gsT0FBRCxFQUFVNkUsT0FBVjtBQUM5QixNQUFBaUQsUUFBQTs7QUFBQSxRQUFBOUgsV0FBQSxPQUFPQSxRQUFTRSxNQUFoQixHQUFnQixNQUFoQjtBQUNDO0FDNEpDOztBRDFKRixRQUFPRixRQUFRLENBQVIsYUFBc0IrSCxLQUE3QjtBQUNDL0gsY0FBVS9CLEVBQUVnSixHQUFGLENBQU1qSCxPQUFOLEVBQWUsVUFBQ2dCLEdBQUQ7QUFDeEIsYUFBTyxDQUFDQSxJQUFJWixLQUFMLEVBQVlZLElBQUlnSCxTQUFoQixFQUEyQmhILElBQUl2QyxLQUEvQixDQUFQO0FBRFMsTUFBVjtBQzhKQzs7QUQ1SkZxSixhQUFXLEVBQVg7O0FBQ0E3SixJQUFFZSxJQUFGLENBQU9nQixPQUFQLEVBQWdCLFVBQUM4RixNQUFEO0FBQ2YsUUFBQTFGLEtBQUEsRUFBQTZILE1BQUEsRUFBQUMsR0FBQSxFQUFBQyxZQUFBLEVBQUExSixLQUFBO0FBQUEyQixZQUFRMEYsT0FBTyxDQUFQLENBQVI7QUFDQW1DLGFBQVNuQyxPQUFPLENBQVAsQ0FBVDs7QUFDQSxRQUFHM0ssT0FBT1csUUFBVjtBQUNDMkMsY0FBUWxELFFBQVE2TSxlQUFSLENBQXdCdEMsT0FBTyxDQUFQLENBQXhCLENBQVI7QUFERDtBQUdDckgsY0FBUWxELFFBQVE2TSxlQUFSLENBQXdCdEMsT0FBTyxDQUFQLENBQXhCLEVBQW1DLElBQW5DLEVBQXlDakIsT0FBekMsQ0FBUjtBQytKRTs7QUQ5SkhzRCxtQkFBZSxFQUFmO0FBQ0FBLGlCQUFhL0gsS0FBYixJQUFzQixFQUF0Qjs7QUFDQSxRQUFHNkgsV0FBVSxHQUFiO0FBQ0NFLG1CQUFhL0gsS0FBYixFQUFvQixLQUFwQixJQUE2QjNCLEtBQTdCO0FBREQsV0FFSyxJQUFHd0osV0FBVSxJQUFiO0FBQ0pFLG1CQUFhL0gsS0FBYixFQUFvQixLQUFwQixJQUE2QjNCLEtBQTdCO0FBREksV0FFQSxJQUFHd0osV0FBVSxHQUFiO0FBQ0pFLG1CQUFhL0gsS0FBYixFQUFvQixLQUFwQixJQUE2QjNCLEtBQTdCO0FBREksV0FFQSxJQUFHd0osV0FBVSxJQUFiO0FBQ0pFLG1CQUFhL0gsS0FBYixFQUFvQixNQUFwQixJQUE4QjNCLEtBQTlCO0FBREksV0FFQSxJQUFHd0osV0FBVSxHQUFiO0FBQ0pFLG1CQUFhL0gsS0FBYixFQUFvQixLQUFwQixJQUE2QjNCLEtBQTdCO0FBREksV0FFQSxJQUFHd0osV0FBVSxJQUFiO0FBQ0pFLG1CQUFhL0gsS0FBYixFQUFvQixNQUFwQixJQUE4QjNCLEtBQTlCO0FBREksV0FFQSxJQUFHd0osV0FBVSxZQUFiO0FBQ0pDLFlBQU0sSUFBSUcsTUFBSixDQUFXLE1BQU01SixLQUFqQixFQUF3QixHQUF4QixDQUFOO0FBQ0EwSixtQkFBYS9ILEtBQWIsRUFBb0IsUUFBcEIsSUFBZ0M4SCxHQUFoQztBQUZJLFdBR0EsSUFBR0QsV0FBVSxVQUFiO0FBQ0pDLFlBQU0sSUFBSUcsTUFBSixDQUFXNUosS0FBWCxFQUFrQixHQUFsQixDQUFOO0FBQ0EwSixtQkFBYS9ILEtBQWIsRUFBb0IsUUFBcEIsSUFBZ0M4SCxHQUFoQztBQUZJLFdBR0EsSUFBR0QsV0FBVSxhQUFiO0FBQ0pDLFlBQU0sSUFBSUcsTUFBSixDQUFXLFVBQVU1SixLQUFWLEdBQWtCLE9BQTdCLEVBQXNDLEdBQXRDLENBQU47QUFDQTBKLG1CQUFhL0gsS0FBYixFQUFvQixRQUFwQixJQUFnQzhILEdBQWhDO0FDZ0tFOztBQUNELFdEaEtGSixTQUFTdkosSUFBVCxDQUFjNEosWUFBZCxDQ2dLRTtBRDlMSDs7QUErQkEsU0FBT0wsUUFBUDtBQXZDOEIsQ0FBL0I7O0FBeUNBdk0sUUFBUStNLHdCQUFSLEdBQW1DLFVBQUNOLFNBQUQ7QUFDbEMsTUFBQXRNLEdBQUE7QUFBQSxTQUFPc00sY0FBYSxTQUFiLElBQTBCLENBQUMsR0FBQXRNLE1BQUFILFFBQUFnTiwyQkFBQSxrQkFBQTdNLElBQTRDc00sU0FBNUMsSUFBNEMsTUFBNUMsQ0FBbEM7QUFEa0MsQ0FBbkMsQyxDQUdBOzs7Ozs7OztBQU9Bek0sUUFBUWlOLGtCQUFSLEdBQTZCLFVBQUN4SSxPQUFELEVBQVV2RSxXQUFWLEVBQXVCb0osT0FBdkI7QUFDNUIsTUFBQTRELGdCQUFBLEVBQUFYLFFBQUE7O0FBQUEsT0FBTzlILFFBQVFFLE1BQWY7QUFDQztBQ3dLQzs7QUR2S0YsTUFBQTJFLFdBQUEsT0FBR0EsUUFBUzZELFdBQVosR0FBWSxNQUFaO0FBRUNELHVCQUFtQixFQUFuQjtBQUNBekksWUFBUTlCLE9BQVIsQ0FBZ0IsVUFBQ2lDLENBQUQ7QUFDZnNJLHVCQUFpQmxLLElBQWpCLENBQXNCNEIsQ0FBdEI7QUN3S0csYUR2S0hzSSxpQkFBaUJsSyxJQUFqQixDQUFzQixJQUF0QixDQ3VLRztBRHpLSjtBQUdBa0sscUJBQWlCRSxHQUFqQjtBQUNBM0ksY0FBVXlJLGdCQUFWO0FDeUtDOztBRHhLRlgsYUFBV2MsZUFBZUosa0JBQWYsQ0FBa0N4SSxPQUFsQyxFQUEyQ3pFLFFBQVFtSSxZQUFuRCxDQUFYO0FBQ0EsU0FBT29FLFFBQVA7QUFaNEIsQ0FBN0IsQyxDQWNBOzs7Ozs7OztBQU9Bdk0sUUFBUXNOLHVCQUFSLEdBQWtDLFVBQUM3SSxPQUFELEVBQVU4SSxZQUFWLEVBQXdCakUsT0FBeEI7QUFDakMsTUFBQWtFLFlBQUE7QUFBQUEsaUJBQWVELGFBQWExQixPQUFiLENBQXFCLFNBQXJCLEVBQWdDLEdBQWhDLEVBQXFDQSxPQUFyQyxDQUE2QyxTQUE3QyxFQUF3RCxHQUF4RCxFQUE2REEsT0FBN0QsQ0FBcUUsS0FBckUsRUFBNEUsR0FBNUUsRUFBaUZBLE9BQWpGLENBQXlGLEtBQXpGLEVBQWdHLEdBQWhHLEVBQXFHQSxPQUFyRyxDQUE2RyxNQUE3RyxFQUFxSCxHQUFySCxFQUEwSEEsT0FBMUgsQ0FBa0ksWUFBbEksRUFBZ0osTUFBaEosQ0FBZjtBQUNBMkIsaUJBQWVBLGFBQWEzQixPQUFiLENBQXFCLFNBQXJCLEVBQWdDLFVBQUM0QixDQUFEO0FBQzlDLFFBQUFDLEVBQUEsRUFBQTdJLEtBQUEsRUFBQTZILE1BQUEsRUFBQUUsWUFBQSxFQUFBMUosS0FBQTs7QUFBQXdLLFNBQUtqSixRQUFRZ0osSUFBRSxDQUFWLENBQUw7QUFDQTVJLFlBQVE2SSxHQUFHN0ksS0FBWDtBQUNBNkgsYUFBU2dCLEdBQUdqQixTQUFaOztBQUNBLFFBQUc3TSxPQUFPVyxRQUFWO0FBQ0MyQyxjQUFRbEQsUUFBUTZNLGVBQVIsQ0FBd0JhLEdBQUd4SyxLQUEzQixDQUFSO0FBREQ7QUFHQ0EsY0FBUWxELFFBQVE2TSxlQUFSLENBQXdCYSxHQUFHeEssS0FBM0IsRUFBa0MsSUFBbEMsRUFBd0NvRyxPQUF4QyxDQUFSO0FDK0tFOztBRDlLSHNELG1CQUFlLEVBQWY7O0FBQ0EsUUFBR2xLLEVBQUVpTCxPQUFGLENBQVV6SyxLQUFWLE1BQW9CLElBQXZCO0FBQ0MsVUFBR3dKLFdBQVUsR0FBYjtBQUNDaEssVUFBRWUsSUFBRixDQUFPUCxLQUFQLEVBQWMsVUFBQ3hELENBQUQ7QUNnTFIsaUJEL0tMa04sYUFBYTVKLElBQWIsQ0FBa0IsQ0FBQzZCLEtBQUQsRUFBUTZILE1BQVIsRUFBZ0JoTixDQUFoQixDQUFsQixFQUFzQyxJQUF0QyxDQytLSztBRGhMTjtBQURELGFBR0ssSUFBR2dOLFdBQVUsSUFBYjtBQUNKaEssVUFBRWUsSUFBRixDQUFPUCxLQUFQLEVBQWMsVUFBQ3hELENBQUQ7QUNpTFIsaUJEaExMa04sYUFBYTVKLElBQWIsQ0FBa0IsQ0FBQzZCLEtBQUQsRUFBUTZILE1BQVIsRUFBZ0JoTixDQUFoQixDQUFsQixFQUFzQyxLQUF0QyxDQ2dMSztBRGpMTjtBQURJO0FBSUpnRCxVQUFFZSxJQUFGLENBQU9QLEtBQVAsRUFBYyxVQUFDeEQsQ0FBRDtBQ2tMUixpQkRqTExrTixhQUFhNUosSUFBYixDQUFrQixDQUFDNkIsS0FBRCxFQUFRNkgsTUFBUixFQUFnQmhOLENBQWhCLENBQWxCLEVBQXNDLElBQXRDLENDaUxLO0FEbExOO0FDb0xHOztBRGxMSixVQUFHa04sYUFBYUEsYUFBYWpJLE1BQWIsR0FBc0IsQ0FBbkMsTUFBeUMsS0FBekMsSUFBa0RpSSxhQUFhQSxhQUFhakksTUFBYixHQUFzQixDQUFuQyxNQUF5QyxJQUE5RjtBQUNDaUkscUJBQWFRLEdBQWI7QUFYRjtBQUFBO0FBYUNSLHFCQUFlLENBQUMvSCxLQUFELEVBQVE2SCxNQUFSLEVBQWdCeEosS0FBaEIsQ0FBZjtBQ3FMRTs7QURwTEhpSixZQUFRQyxHQUFSLENBQVksY0FBWixFQUE0QlEsWUFBNUI7QUFDQSxXQUFPZ0IsS0FBS0MsU0FBTCxDQUFlakIsWUFBZixDQUFQO0FBeEJjLElBQWY7QUEwQkFZLGlCQUFlLE1BQUlBLFlBQUosR0FBaUIsR0FBaEM7QUFDQSxTQUFPeE4sUUFBTyxNQUFQLEVBQWF3TixZQUFiLENBQVA7QUE3QmlDLENBQWxDOztBQStCQXhOLFFBQVF3RCxpQkFBUixHQUE0QixVQUFDdEQsV0FBRCxFQUFjMEgsT0FBZCxFQUF1QkMsTUFBdkI7QUFDM0IsTUFBQXhGLE9BQUEsRUFBQWdGLFdBQUEsRUFBQXlHLG9CQUFBLEVBQUFDLGVBQUEsRUFBQUMsaUJBQUE7O0FBQUEsTUFBR3BPLE9BQU9XLFFBQVY7QUFDQyxRQUFHLENBQUNMLFdBQUo7QUFDQ0Esb0JBQWNlLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUN3TEU7O0FEdkxILFFBQUcsQ0FBQzBHLE9BQUo7QUFDQ0EsZ0JBQVUzRyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFWO0FDeUxFOztBRHhMSCxRQUFHLENBQUMyRyxNQUFKO0FBQ0NBLGVBQVNqSSxPQUFPaUksTUFBUCxFQUFUO0FBTkY7QUNpTUU7O0FEekxGaUcseUJBQXVCLEVBQXZCO0FBQ0F6TCxZQUFVckMsUUFBUUksU0FBUixDQUFrQkYsV0FBbEIsQ0FBVjs7QUFFQSxNQUFHLENBQUNtQyxPQUFKO0FBQ0MsV0FBT3lMLG9CQUFQO0FDMExDOztBRHRMRkMsb0JBQWtCL04sUUFBUWlPLGlCQUFSLENBQTBCNUwsUUFBUTZMLGdCQUFsQyxDQUFsQjtBQUVBSix5QkFBdUJwTCxFQUFFNEgsS0FBRixDQUFReUQsZUFBUixFQUF3QixhQUF4QixDQUF2Qjs7QUFDQSxPQUFBRCx3QkFBQSxPQUFHQSxxQkFBc0JuSixNQUF6QixHQUF5QixNQUF6QixNQUFtQyxDQUFuQztBQUNDLFdBQU9tSixvQkFBUDtBQ3VMQzs7QURyTEZ6RyxnQkFBY3JILFFBQVFtTyxjQUFSLENBQXVCak8sV0FBdkIsRUFBb0MwSCxPQUFwQyxFQUE2Q0MsTUFBN0MsQ0FBZDtBQUNBbUcsc0JBQW9CM0csWUFBWTJHLGlCQUFoQztBQUVBRix5QkFBdUJwTCxFQUFFMEwsVUFBRixDQUFhTixvQkFBYixFQUFtQ0UsaUJBQW5DLENBQXZCO0FBQ0EsU0FBT3RMLEVBQUU2SCxNQUFGLENBQVN3RCxlQUFULEVBQTBCLFVBQUNNLGNBQUQ7QUFDaEMsUUFBQS9HLFNBQUEsRUFBQWdILFFBQUEsRUFBQW5PLEdBQUEsRUFBQTRCLG1CQUFBO0FBQUFBLDBCQUFzQnNNLGVBQWVuTyxXQUFyQztBQUNBb08sZUFBV1IscUJBQXFCeEosT0FBckIsQ0FBNkJ2QyxtQkFBN0IsSUFBb0QsQ0FBQyxDQUFoRTtBQUVBdUYsZ0JBQUEsQ0FBQW5ILE1BQUFILFFBQUFtTyxjQUFBLENBQUFwTSxtQkFBQSxFQUFBNkYsT0FBQSxFQUFBQyxNQUFBLGFBQUExSCxJQUEwRW1ILFNBQTFFLEdBQTBFLE1BQTFFOztBQUNBLFFBQUd2Rix3QkFBdUIsV0FBMUI7QUFDQ3VGLGtCQUFZQSxhQUFhRCxZQUFZa0gsY0FBckM7QUNzTEU7O0FEckxILFdBQU9ELFlBQWFoSCxTQUFwQjtBQVBNLElBQVA7QUEzQjJCLENBQTVCOztBQW9DQXRILFFBQVF3TyxxQkFBUixHQUFnQyxVQUFDdE8sV0FBRCxFQUFjMEgsT0FBZCxFQUF1QkMsTUFBdkI7QUFDL0IsTUFBQWtHLGVBQUE7QUFBQUEsb0JBQWtCL04sUUFBUXdELGlCQUFSLENBQTBCdEQsV0FBMUIsRUFBdUMwSCxPQUF2QyxFQUFnREMsTUFBaEQsQ0FBbEI7QUFDQSxTQUFPbkYsRUFBRTRILEtBQUYsQ0FBUXlELGVBQVIsRUFBd0IsYUFBeEIsQ0FBUDtBQUYrQixDQUFoQzs7QUFJQS9OLFFBQVF5TywyQkFBUixHQUFzQyxVQUFDQyxpQkFBRCxFQUFvQjlHLE9BQXBCLEVBQTZCQyxNQUE3QjtBQUNyQyxNQUFBOEcsT0FBQTtBQUFBQSxZQUFVM08sUUFBUTRPLFVBQVIsQ0FBbUJGLGlCQUFuQixFQUFzQzlHLE9BQXRDLEVBQStDQyxNQUEvQyxDQUFWO0FBQ0E4RyxZQUFVak0sRUFBRTZILE1BQUYsQ0FBU29FLE9BQVQsRUFBa0IsVUFBQ0UsTUFBRDtBQUMzQixRQUFHQSxPQUFPN0ssSUFBUCxLQUFlLGlCQUFsQjtBQUNDLGFBQU8sS0FBUDtBQzRMRTs7QUQzTEgsUUFBRzZLLE9BQU83SyxJQUFQLEtBQWUsZ0JBQWxCO0FBQ0MsYUFBTyxLQUFQO0FDNkxFOztBRDVMSCxRQUFHNkssT0FBT0MsRUFBUCxLQUFhLE1BQWhCO0FBQ0MsVUFBRyxPQUFPRCxPQUFPRSxPQUFkLEtBQXlCLFVBQTVCO0FBQ0MsZUFBT0YsT0FBT0UsT0FBUCxFQUFQO0FBREQ7QUFHQyxlQUFPRixPQUFPRSxPQUFkO0FBSkY7QUFBQTtBQU1DLGFBQU8sS0FBUDtBQytMRTtBRDFNTSxJQUFWO0FBWUEsU0FBT0osT0FBUDtBQWRxQyxDQUF0Qzs7QUFnQkEzTyxRQUFRNE8sVUFBUixHQUFxQixVQUFDMU8sV0FBRCxFQUFjMEgsT0FBZCxFQUF1QkMsTUFBdkI7QUFDcEIsTUFBQThHLE9BQUEsRUFBQUssZ0JBQUEsRUFBQXZKLEdBQUEsRUFBQTRCLFdBQUEsRUFBQWxILEdBQUEsRUFBQXdGLElBQUE7O0FBQUEsTUFBRy9GLE9BQU9XLFFBQVY7QUFDQyxRQUFHLENBQUNMLFdBQUo7QUFDQ0Esb0JBQWNlLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUNtTUU7O0FEbE1ILFFBQUcsQ0FBQzBHLE9BQUo7QUFDQ0EsZ0JBQVUzRyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFWO0FDb01FOztBRG5NSCxRQUFHLENBQUMyRyxNQUFKO0FBQ0NBLGVBQVNqSSxPQUFPaUksTUFBUCxFQUFUO0FBTkY7QUM0TUU7O0FEcE1GcEMsUUFBTXpGLFFBQVFJLFNBQVIsQ0FBa0JGLFdBQWxCLENBQU47O0FBRUEsTUFBRyxDQUFDdUYsR0FBSjtBQUNDO0FDcU1DOztBRG5NRjRCLGdCQUFjckgsUUFBUW1PLGNBQVIsQ0FBdUJqTyxXQUF2QixFQUFvQzBILE9BQXBDLEVBQTZDQyxNQUE3QyxDQUFkO0FBQ0FtSCxxQkFBbUIzSCxZQUFZMkgsZ0JBQS9CO0FBQ0FMLFlBQVVqTSxFQUFFdU0sTUFBRixDQUFTdk0sRUFBRXdNLE1BQUYsQ0FBU3pKLElBQUlrSixPQUFiLENBQVQsRUFBaUMsTUFBakMsQ0FBVjs7QUFFQSxNQUFHak0sRUFBRXlNLEdBQUYsQ0FBTTFKLEdBQU4sRUFBVyxxQkFBWCxDQUFIO0FBQ0NrSixjQUFVak0sRUFBRTZILE1BQUYsQ0FBU29FLE9BQVQsRUFBa0IsVUFBQ0UsTUFBRDtBQUMzQixhQUFPbk0sRUFBRTBCLE9BQUYsQ0FBVXFCLElBQUkySixtQkFBZCxFQUFtQ1AsT0FBTzdLLElBQTFDLEtBQW1EdEIsRUFBRTBCLE9BQUYsQ0FBVTFCLEVBQUUyTSxJQUFGLENBQU9yUCxRQUFRSSxTQUFSLENBQWtCLE1BQWxCLEVBQTBCdU8sT0FBakMsS0FBNkMsRUFBdkQsRUFBMkRFLE9BQU83SyxJQUFsRSxDQUExRDtBQURTLE1BQVY7QUNzTUM7O0FEcE1GLE1BQUd0QixFQUFFeU0sR0FBRixDQUFNMUosR0FBTixFQUFXLGlCQUFYLENBQUg7QUFDQ2tKLGNBQVVqTSxFQUFFNkgsTUFBRixDQUFTb0UsT0FBVCxFQUFrQixVQUFDRSxNQUFEO0FBQzNCLGFBQU8sQ0FBQ25NLEVBQUUwQixPQUFGLENBQVVxQixJQUFJNkosZUFBZCxFQUErQlQsT0FBTzdLLElBQXRDLENBQVI7QUFEUyxNQUFWO0FDd01DOztBRHJNRnRCLElBQUVlLElBQUYsQ0FBT2tMLE9BQVAsRUFBZ0IsVUFBQ0UsTUFBRDtBQUVmLFFBQUd0TixRQUFRMkYsUUFBUixNQUFzQixDQUFDLFFBQUQsRUFBVyxhQUFYLEVBQTBCNUMsT0FBMUIsQ0FBa0N1SyxPQUFPQyxFQUF6QyxJQUErQyxDQUFDLENBQXRFLElBQTJFRCxPQUFPN0ssSUFBUCxLQUFlLGVBQTdGO0FBQ0MsVUFBRzZLLE9BQU9DLEVBQVAsS0FBYSxhQUFoQjtBQ3NNSyxlRHJNSkQsT0FBT0MsRUFBUCxHQUFZLGtCQ3FNUjtBRHRNTDtBQ3dNSyxlRHJNSkQsT0FBT0MsRUFBUCxHQUFZLGFDcU1SO0FEek1OO0FDMk1HO0FEN01KOztBQVFBLE1BQUd2TixRQUFRMkYsUUFBUixNQUFzQixDQUFDLFdBQUQsRUFBYyxzQkFBZCxFQUFzQzVDLE9BQXRDLENBQThDcEUsV0FBOUMsSUFBNkQsQ0FBQyxDQUF2RjtBQ3dNRyxRQUFJLENBQUNDLE1BQU13TyxRQUFRdkosSUFBUixDQUFhLFVBQVNSLENBQVQsRUFBWTtBQUNsQyxhQUFPQSxFQUFFWixJQUFGLEtBQVcsZUFBbEI7QUFDRCxLQUZVLENBQVAsS0FFRyxJQUZQLEVBRWE7QUFDWDdELFVEek1rRDJPLEVDeU1sRCxHRHpNdUQsYUN5TXZEO0FBQ0Q7O0FBQ0QsUUFBSSxDQUFDbkosT0FBT2dKLFFBQVF2SixJQUFSLENBQWEsVUFBU1IsQ0FBVCxFQUFZO0FBQ25DLGFBQU9BLEVBQUVaLElBQUYsS0FBVyxVQUFsQjtBQUNELEtBRlcsQ0FBUixLQUVHLElBRlAsRUFFYTtBQUNYMkIsV0Q3TTZDbUosRUM2TTdDLEdEN01rRCxRQzZNbEQ7QURoTkw7QUNrTkU7O0FEN01GSCxZQUFVak0sRUFBRTZILE1BQUYsQ0FBU29FLE9BQVQsRUFBa0IsVUFBQ0UsTUFBRDtBQUMzQixXQUFPbk0sRUFBRTRCLE9BQUYsQ0FBVTBLLGdCQUFWLEVBQTRCSCxPQUFPN0ssSUFBbkMsSUFBMkMsQ0FBbEQ7QUFEUyxJQUFWO0FBR0EsU0FBTzJLLE9BQVA7QUF6Q29CLENBQXJCOztBQTJDQTs7QUFJQTNPLFFBQVF1UCxZQUFSLEdBQXVCLFVBQUNyUCxXQUFELEVBQWMwSCxPQUFkLEVBQXVCQyxNQUF2QjtBQUN0QixNQUFBMkgsbUJBQUEsRUFBQXRJLFFBQUEsRUFBQXVJLFNBQUEsRUFBQUMsVUFBQSxFQUFBQyxNQUFBLEVBQUF4UCxHQUFBOztBQUFBLE1BQUdQLE9BQU9XLFFBQVY7QUFDQyxRQUFHLENBQUNMLFdBQUo7QUFDQ0Esb0JBQWNlLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUMrTUU7O0FEOU1ILFFBQUcsQ0FBQzBHLE9BQUo7QUFDQ0EsZ0JBQVUzRyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFWO0FDZ05FOztBRC9NSCxRQUFHLENBQUMyRyxNQUFKO0FBQ0NBLGVBQVNqSSxPQUFPaUksTUFBUCxFQUFUO0FBTkY7QUN3TkU7O0FEaE5GLE9BQU8zSCxXQUFQO0FBQ0M7QUNrTkM7O0FEaE5GeVAsV0FBUzNQLFFBQVFJLFNBQVIsQ0FBa0JGLFdBQWxCLENBQVQ7O0FBRUEsTUFBRyxDQUFDeVAsTUFBSjtBQUNDO0FDaU5DOztBRC9NRkgsd0JBQUEsRUFBQXJQLE1BQUFILFFBQUFtTyxjQUFBLENBQUFqTyxXQUFBLEVBQUEwSCxPQUFBLEVBQUFDLE1BQUEsYUFBQTFILElBQTRFcVAsbUJBQTVFLEdBQTRFLE1BQTVFLEtBQW1HLEVBQW5HO0FBRUFFLGVBQWEsRUFBYjtBQUVBeEksYUFBVzNGLFFBQVEyRixRQUFSLEVBQVg7O0FBRUF4RSxJQUFFZSxJQUFGLENBQU9rTSxPQUFPRCxVQUFkLEVBQTBCLFVBQUNFLElBQUQsRUFBT0MsU0FBUDtBQzhNdkIsV0Q3TUZELEtBQUs1TCxJQUFMLEdBQVk2TCxTQzZNVjtBRDlNSDs7QUFHQUosY0FBWS9NLEVBQUV1TSxNQUFGLENBQVN2TSxFQUFFd00sTUFBRixDQUFTUyxPQUFPRCxVQUFoQixDQUFULEVBQXVDLFNBQXZDLENBQVo7O0FBRUFoTixJQUFFZSxJQUFGLENBQU9nTSxTQUFQLEVBQWtCLFVBQUNHLElBQUQ7QUFDakIsUUFBQUUsVUFBQTs7QUFBQSxRQUFHNUksWUFBYTBJLEtBQUs3TSxJQUFMLEtBQWEsVUFBN0I7QUFFQztBQzZNRTs7QUQ1TUgsUUFBRzZNLEtBQUs1TCxJQUFMLEtBQWMsU0FBakI7QUFDQzhMLG1CQUFhcE4sRUFBRTRCLE9BQUYsQ0FBVWtMLG1CQUFWLEVBQStCSSxLQUFLNUwsSUFBcEMsSUFBNEMsQ0FBQyxDQUE3QyxJQUFtRDRMLEtBQUt4TyxHQUFMLElBQVlzQixFQUFFNEIsT0FBRixDQUFVa0wsbUJBQVYsRUFBK0JJLEtBQUt4TyxHQUFwQyxJQUEyQyxDQUFDLENBQXhIOztBQUNBLFVBQUcsQ0FBQzBPLFVBQUQsSUFBZUYsS0FBS0csS0FBTCxLQUFjbEksTUFBaEM7QUM4TUssZUQ3TUo2SCxXQUFXMU0sSUFBWCxDQUFnQjRNLElBQWhCLENDNk1JO0FEaE5OO0FDa05HO0FEdE5KOztBQVFBLFNBQU9GLFVBQVA7QUFwQ3NCLENBQXZCOztBQXVDQTFQLFFBQVFtRSxTQUFSLEdBQW9CLFVBQUNqRSxXQUFELEVBQWMwSCxPQUFkLEVBQXVCQyxNQUF2QjtBQUNuQixNQUFBbUksVUFBQSxFQUFBN1AsR0FBQSxFQUFBOFAsaUJBQUE7O0FBQUEsTUFBR3JRLE9BQU9XLFFBQVY7QUFDQyxRQUFHLENBQUNMLFdBQUo7QUFDQ0Esb0JBQWNlLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUNrTkU7O0FEak5ILFFBQUcsQ0FBQzBHLE9BQUo7QUFDQ0EsZ0JBQVUzRyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFWO0FDbU5FOztBRGxOSCxRQUFHLENBQUMyRyxNQUFKO0FBQ0NBLGVBQVNqSSxPQUFPaUksTUFBUCxFQUFUO0FBTkY7QUMyTkU7O0FEbk5GbUksZUFBYWhRLFFBQVFrUSxtQkFBUixDQUE0QmhRLFdBQTVCLENBQWI7QUFDQStQLHNCQUFBLENBQUE5UCxNQUFBSCxRQUFBbU8sY0FBQSxDQUFBak8sV0FBQSxFQUFBMEgsT0FBQSxFQUFBQyxNQUFBLGFBQUExSCxJQUEyRThQLGlCQUEzRSxHQUEyRSxNQUEzRTtBQUNBLFNBQU92TixFQUFFMEwsVUFBRixDQUFhNEIsVUFBYixFQUF5QkMsaUJBQXpCLENBQVA7QUFYbUIsQ0FBcEI7O0FBYUFqUSxRQUFRbVEsU0FBUixHQUFvQjtBQUNuQixTQUFPLENBQUNuUSxRQUFRb1EsZUFBUixDQUF3QmxQLEdBQXhCLEVBQVI7QUFEbUIsQ0FBcEI7O0FBR0FsQixRQUFRcVEsdUJBQVIsR0FBa0MsVUFBQ0MsR0FBRDtBQUNqQyxTQUFPQSxJQUFJekUsT0FBSixDQUFZLG1DQUFaLEVBQWlELE1BQWpELENBQVA7QUFEaUMsQ0FBbEM7O0FBS0E3TCxRQUFRdVEsaUJBQVIsR0FBNEIsVUFBQ2xRLE1BQUQ7QUFDM0IsTUFBQWtDLE1BQUE7QUFBQUEsV0FBU0csRUFBRWdKLEdBQUYsQ0FBTXJMLE1BQU4sRUFBYyxVQUFDd0UsS0FBRCxFQUFRMkwsU0FBUjtBQUN0QixXQUFPM0wsTUFBTTRMLFFBQU4sSUFBbUI1TCxNQUFNNEwsUUFBTixDQUFlQyxRQUFsQyxJQUErQyxDQUFDN0wsTUFBTTRMLFFBQU4sQ0FBZUUsSUFBL0QsSUFBd0VILFNBQS9FO0FBRFEsSUFBVDtBQUdBak8sV0FBU0csRUFBRWtKLE9BQUYsQ0FBVXJKLE1BQVYsQ0FBVDtBQUNBLFNBQU9BLE1BQVA7QUFMMkIsQ0FBNUI7O0FBT0F2QyxRQUFRNFEsZUFBUixHQUEwQixVQUFDdlEsTUFBRDtBQUN6QixNQUFBa0MsTUFBQTtBQUFBQSxXQUFTRyxFQUFFZ0osR0FBRixDQUFNckwsTUFBTixFQUFjLFVBQUN3RSxLQUFELEVBQVEyTCxTQUFSO0FBQ3RCLFdBQU8zTCxNQUFNNEwsUUFBTixJQUFtQjVMLE1BQU00TCxRQUFOLENBQWUxTixJQUFmLEtBQXVCLFFBQTFDLElBQXVELENBQUM4QixNQUFNNEwsUUFBTixDQUFlRSxJQUF2RSxJQUFnRkgsU0FBdkY7QUFEUSxJQUFUO0FBR0FqTyxXQUFTRyxFQUFFa0osT0FBRixDQUFVckosTUFBVixDQUFUO0FBQ0EsU0FBT0EsTUFBUDtBQUx5QixDQUExQjs7QUFPQXZDLFFBQVE2USxvQkFBUixHQUErQixVQUFDeFEsTUFBRDtBQUM5QixNQUFBa0MsTUFBQTtBQUFBQSxXQUFTRyxFQUFFZ0osR0FBRixDQUFNckwsTUFBTixFQUFjLFVBQUN3RSxLQUFELEVBQVEyTCxTQUFSO0FBQ3RCLFdBQU8sQ0FBQyxDQUFDM0wsTUFBTTRMLFFBQVAsSUFBbUIsQ0FBQzVMLE1BQU00TCxRQUFOLENBQWVLLEtBQW5DLElBQTRDak0sTUFBTTRMLFFBQU4sQ0FBZUssS0FBZixLQUF3QixHQUFyRSxNQUErRSxDQUFDak0sTUFBTTRMLFFBQVAsSUFBbUI1TCxNQUFNNEwsUUFBTixDQUFlMU4sSUFBZixLQUF1QixRQUF6SCxLQUF1SXlOLFNBQTlJO0FBRFEsSUFBVDtBQUdBak8sV0FBU0csRUFBRWtKLE9BQUYsQ0FBVXJKLE1BQVYsQ0FBVDtBQUNBLFNBQU9BLE1BQVA7QUFMOEIsQ0FBL0I7O0FBT0F2QyxRQUFRK1Esd0JBQVIsR0FBbUMsVUFBQzFRLE1BQUQ7QUFDbEMsTUFBQTJRLEtBQUE7QUFBQUEsVUFBUXRPLEVBQUVnSixHQUFGLENBQU1yTCxNQUFOLEVBQWMsVUFBQ3dFLEtBQUQ7QUFDcEIsV0FBT0EsTUFBTTRMLFFBQU4sSUFBbUI1TCxNQUFNNEwsUUFBTixDQUFlSyxLQUFmLEtBQXdCLEdBQTNDLElBQW1Eak0sTUFBTTRMLFFBQU4sQ0FBZUssS0FBekU7QUFETSxJQUFSO0FBR0FFLFVBQVF0TyxFQUFFa0osT0FBRixDQUFVb0YsS0FBVixDQUFSO0FBQ0FBLFVBQVF0TyxFQUFFdU8sTUFBRixDQUFTRCxLQUFULENBQVI7QUFDQSxTQUFPQSxLQUFQO0FBTmtDLENBQW5DOztBQVFBaFIsUUFBUWtSLGlCQUFSLEdBQTRCLFVBQUM3USxNQUFELEVBQVM4USxTQUFUO0FBQ3pCLE1BQUE1TyxNQUFBO0FBQUFBLFdBQVNHLEVBQUVnSixHQUFGLENBQU1yTCxNQUFOLEVBQWMsVUFBQ3dFLEtBQUQsRUFBUTJMLFNBQVI7QUFDckIsV0FBTzNMLE1BQU00TCxRQUFOLElBQW1CNUwsTUFBTTRMLFFBQU4sQ0FBZUssS0FBZixLQUF3QkssU0FBM0MsSUFBeUR0TSxNQUFNNEwsUUFBTixDQUFlMU4sSUFBZixLQUF1QixRQUFoRixJQUE2RnlOLFNBQXBHO0FBRE8sSUFBVDtBQUdBak8sV0FBU0csRUFBRWtKLE9BQUYsQ0FBVXJKLE1BQVYsQ0FBVDtBQUNBLFNBQU9BLE1BQVA7QUFMeUIsQ0FBNUI7O0FBT0F2QyxRQUFRb1IsbUJBQVIsR0FBOEI7QUFDN0IsU0FBTyxDQUFDLFNBQUQsRUFBWSxZQUFaLEVBQTBCLFVBQTFCLEVBQXNDLGFBQXRDLENBQVA7QUFENkIsQ0FBOUI7O0FBR0FwUixRQUFRcVIsMEJBQVIsR0FBcUMsVUFBQ2hDLElBQUQ7QUFDcEMsU0FBTzNNLEVBQUUwTCxVQUFGLENBQWFpQixJQUFiLEVBQW1CclAsUUFBUW9SLG1CQUFSLEVBQW5CLENBQVA7QUFEb0MsQ0FBckM7O0FBR0FwUixRQUFRc1Isb0JBQVIsR0FBK0IsVUFBQ2pSLE1BQUQsRUFBU2dQLElBQVQ7QUFDOUJBLFNBQU8zTSxFQUFFZ0osR0FBRixDQUFNMkQsSUFBTixFQUFZLFVBQUN6RSxHQUFEO0FBQ2xCLFFBQUEvRixLQUFBLEVBQUExRSxHQUFBO0FBQUEwRSxZQUFRbkMsRUFBRTZPLElBQUYsQ0FBT2xSLE1BQVAsRUFBZXVLLEdBQWYsQ0FBUjs7QUFDQSxTQUFBekssTUFBQTBFLE1BQUErRixHQUFBLEVBQUE2RixRQUFBLFlBQUF0USxJQUF3QndRLElBQXhCLEdBQXdCLE1BQXhCO0FBQ0MsYUFBTyxLQUFQO0FBREQ7QUFHQyxhQUFPL0YsR0FBUDtBQ21PRTtBRHhPRyxJQUFQO0FBT0F5RSxTQUFPM00sRUFBRWtKLE9BQUYsQ0FBVXlELElBQVYsQ0FBUDtBQUNBLFNBQU9BLElBQVA7QUFUOEIsQ0FBL0I7O0FBV0FyUCxRQUFRd1IscUJBQVIsR0FBZ0MsVUFBQ0MsY0FBRCxFQUFpQnBDLElBQWpCO0FBQy9CQSxTQUFPM00sRUFBRWdKLEdBQUYsQ0FBTTJELElBQU4sRUFBWSxVQUFDekUsR0FBRDtBQUNsQixRQUFHbEksRUFBRTRCLE9BQUYsQ0FBVW1OLGNBQVYsRUFBMEI3RyxHQUExQixJQUFpQyxDQUFDLENBQXJDO0FBQ0MsYUFBT0EsR0FBUDtBQUREO0FBR0MsYUFBTyxLQUFQO0FDcU9FO0FEek9HLElBQVA7QUFNQXlFLFNBQU8zTSxFQUFFa0osT0FBRixDQUFVeUQsSUFBVixDQUFQO0FBQ0EsU0FBT0EsSUFBUDtBQVIrQixDQUFoQzs7QUFVQXJQLFFBQVEwUixtQkFBUixHQUE4QixVQUFDclIsTUFBRCxFQUFTZ1AsSUFBVCxFQUFlc0MsUUFBZjtBQUM3QixNQUFBQyxLQUFBLEVBQUFDLFNBQUEsRUFBQXRQLE1BQUEsRUFBQXdKLENBQUEsRUFBQStGLFNBQUEsRUFBQUMsU0FBQSxFQUFBQyxJQUFBLEVBQUFDLElBQUE7O0FBQUExUCxXQUFTLEVBQVQ7QUFDQXdKLE1BQUksQ0FBSjtBQUNBNkYsVUFBUWxQLEVBQUU2SCxNQUFGLENBQVM4RSxJQUFULEVBQWUsVUFBQ3pFLEdBQUQ7QUFDdEIsV0FBTyxDQUFDQSxJQUFJc0gsUUFBSixDQUFhLFVBQWIsQ0FBUjtBQURPLElBQVI7O0FBR0EsU0FBTW5HLElBQUk2RixNQUFNak4sTUFBaEI7QUFDQ3FOLFdBQU90UCxFQUFFNk8sSUFBRixDQUFPbFIsTUFBUCxFQUFldVIsTUFBTTdGLENBQU4sQ0FBZixDQUFQO0FBQ0FrRyxXQUFPdlAsRUFBRTZPLElBQUYsQ0FBT2xSLE1BQVAsRUFBZXVSLE1BQU03RixJQUFFLENBQVIsQ0FBZixDQUFQO0FBRUErRixnQkFBWSxLQUFaO0FBQ0FDLGdCQUFZLEtBQVo7O0FBS0FyUCxNQUFFZSxJQUFGLENBQU91TyxJQUFQLEVBQWEsVUFBQzlPLEtBQUQ7QUFDWixVQUFBL0MsR0FBQSxFQUFBd0YsSUFBQTs7QUFBQSxZQUFBeEYsTUFBQStDLE1BQUF1TixRQUFBLFlBQUF0USxJQUFtQmdTLE9BQW5CLEdBQW1CLE1BQW5CLEtBQUcsRUFBQXhNLE9BQUF6QyxNQUFBdU4sUUFBQSxZQUFBOUssS0FBMkM1QyxJQUEzQyxHQUEyQyxNQUEzQyxNQUFtRCxPQUF0RDtBQ29PSyxlRG5PSitPLFlBQVksSUNtT1I7QUFDRDtBRHRPTDs7QUFPQXBQLE1BQUVlLElBQUYsQ0FBT3dPLElBQVAsRUFBYSxVQUFDL08sS0FBRDtBQUNaLFVBQUEvQyxHQUFBLEVBQUF3RixJQUFBOztBQUFBLFlBQUF4RixNQUFBK0MsTUFBQXVOLFFBQUEsWUFBQXRRLElBQW1CZ1MsT0FBbkIsR0FBbUIsTUFBbkIsS0FBRyxFQUFBeE0sT0FBQXpDLE1BQUF1TixRQUFBLFlBQUE5SyxLQUEyQzVDLElBQTNDLEdBQTJDLE1BQTNDLE1BQW1ELE9BQXREO0FDbU9LLGVEbE9KZ1AsWUFBWSxJQ2tPUjtBQUNEO0FEck9MOztBQU9BLFFBQUd4USxRQUFRMkYsUUFBUixFQUFIO0FBQ0M0SyxrQkFBWSxJQUFaO0FBQ0FDLGtCQUFZLElBQVo7QUNpT0U7O0FEL05ILFFBQUdKLFFBQUg7QUFDQ3BQLGFBQU9TLElBQVAsQ0FBWTRPLE1BQU1RLEtBQU4sQ0FBWXJHLENBQVosRUFBZUEsSUFBRSxDQUFqQixDQUFaO0FBQ0FBLFdBQUssQ0FBTDtBQUZEO0FBVUMsVUFBRytGLFNBQUg7QUFDQ3ZQLGVBQU9TLElBQVAsQ0FBWTRPLE1BQU1RLEtBQU4sQ0FBWXJHLENBQVosRUFBZUEsSUFBRSxDQUFqQixDQUFaO0FBQ0FBLGFBQUssQ0FBTDtBQUZELGFBR0ssSUFBRyxDQUFDK0YsU0FBRCxJQUFlQyxTQUFsQjtBQUNKRixvQkFBWUQsTUFBTVEsS0FBTixDQUFZckcsQ0FBWixFQUFlQSxJQUFFLENBQWpCLENBQVo7QUFDQThGLGtCQUFVN08sSUFBVixDQUFlLE1BQWY7QUFDQVQsZUFBT1MsSUFBUCxDQUFZNk8sU0FBWjtBQUNBOUYsYUFBSyxDQUFMO0FBSkksYUFLQSxJQUFHLENBQUMrRixTQUFELElBQWUsQ0FBQ0MsU0FBbkI7QUFDSkYsb0JBQVlELE1BQU1RLEtBQU4sQ0FBWXJHLENBQVosRUFBZUEsSUFBRSxDQUFqQixDQUFaOztBQUNBLFlBQUc2RixNQUFNN0YsSUFBRSxDQUFSLENBQUg7QUFDQzhGLG9CQUFVN08sSUFBVixDQUFlNE8sTUFBTTdGLElBQUUsQ0FBUixDQUFmO0FBREQ7QUFHQzhGLG9CQUFVN08sSUFBVixDQUFlLE1BQWY7QUMyTkk7O0FEMU5MVCxlQUFPUyxJQUFQLENBQVk2TyxTQUFaO0FBQ0E5RixhQUFLLENBQUw7QUF6QkY7QUNzUEc7QURsUko7O0FBdURBLFNBQU94SixNQUFQO0FBN0Q2QixDQUE5Qjs7QUErREF2QyxRQUFRcVMsa0JBQVIsR0FBNkIsVUFBQzNTLENBQUQ7QUFDNUIsU0FBTyxPQUFPQSxDQUFQLEtBQVksV0FBWixJQUEyQkEsTUFBSyxJQUFoQyxJQUF3QzRTLE9BQU9DLEtBQVAsQ0FBYTdTLENBQWIsQ0FBeEMsSUFBMkRBLEVBQUVpRixNQUFGLEtBQVksQ0FBOUU7QUFENEIsQ0FBN0I7O0FBR0EzRSxRQUFRd1MsZ0JBQVIsR0FBMkIsVUFBQ0MsWUFBRCxFQUFlN0gsR0FBZjtBQUMxQixNQUFBekssR0FBQSxFQUFBdVMsTUFBQTs7QUFBQSxNQUFHRCxnQkFBaUI3SCxHQUFwQjtBQUNDOEgsYUFBQSxDQUFBdlMsTUFBQXNTLGFBQUE3SCxHQUFBLGFBQUF6SyxJQUE0QjRDLElBQTVCLEdBQTRCLE1BQTVCOztBQUNBLFFBQUcsQ0FBQyxTQUFELEVBQVksU0FBWixFQUF1QnVCLE9BQXZCLENBQStCb08sTUFBL0IsSUFBeUMsQ0FBQyxDQUE3QztBQUNDQSxlQUFTRCxhQUFhN0gsR0FBYixFQUFrQitILFNBQTNCO0FDaU9FOztBRDlOSCxXQUFPRCxNQUFQO0FBTkQ7QUFRQyxXQUFPLE1BQVA7QUNnT0M7QUR6T3dCLENBQTNCOztBQWFBLElBQUc5UyxPQUFPZ1QsUUFBVjtBQUNDNVMsVUFBUTZTLG9CQUFSLEdBQStCLFVBQUMzUyxXQUFEO0FBQzlCLFFBQUE0TixvQkFBQTtBQUFBQSwyQkFBdUIsRUFBdkI7O0FBQ0FwTCxNQUFFZSxJQUFGLENBQU96RCxRQUFRd0ssT0FBZixFQUF3QixVQUFDNkQsY0FBRCxFQUFpQnRNLG1CQUFqQjtBQ2lPcEIsYURoT0hXLEVBQUVlLElBQUYsQ0FBTzRLLGVBQWU5TCxNQUF0QixFQUE4QixVQUFDdVEsYUFBRCxFQUFnQjlRLGtCQUFoQjtBQUM3QixZQUFHOFEsY0FBYy9QLElBQWQsS0FBc0IsZUFBdEIsSUFBMEMrUCxjQUFjMVAsWUFBeEQsSUFBeUUwUCxjQUFjMVAsWUFBZCxLQUE4QmxELFdBQTFHO0FDaU9NLGlCRGhPTDROLHFCQUFxQjlLLElBQXJCLENBQTBCakIsbUJBQTFCLENDZ09LO0FBQ0Q7QURuT04sUUNnT0c7QURqT0o7O0FBS0EsUUFBRy9CLFFBQVFJLFNBQVIsQ0FBa0JGLFdBQWxCLEVBQStCNlMsWUFBbEM7QUFDQ2pGLDJCQUFxQjlLLElBQXJCLENBQTBCLFdBQTFCO0FDbU9FOztBRGpPSCxXQUFPOEssb0JBQVA7QUFWOEIsR0FBL0I7QUM4T0E7O0FEbE9ELElBQUdsTyxPQUFPZ1QsUUFBVjtBQUNDclIsVUFBUXlSLFdBQVIsR0FBc0IsVUFBQ0MsS0FBRDtBQUNyQixRQUFBQyxTQUFBLEVBQUFDLFlBQUEsRUFBQXhELE1BQUEsRUFBQXhQLEdBQUEsRUFBQXdGLElBQUEsRUFBQUMsSUFBQTtBQUFBK0osYUFBUztBQUNGeUQsa0JBQVk7QUFEVixLQUFUO0FBR0FELG1CQUFBLEVBQUFoVCxNQUFBUCxPQUFBQyxRQUFBLGFBQUE4RixPQUFBeEYsSUFBQWtULFdBQUEsYUFBQXpOLE9BQUFELEtBQUEsc0JBQUFDLEtBQXNEME4sVUFBdEQsR0FBc0QsTUFBdEQsR0FBc0QsTUFBdEQsR0FBc0QsTUFBdEQsS0FBb0UsS0FBcEU7O0FBQ0EsUUFBR0gsWUFBSDtBQUNDLFVBQUdGLE1BQU10TyxNQUFOLEdBQWUsQ0FBbEI7QUFDQ3VPLG9CQUFZRCxNQUFNTSxJQUFOLENBQVcsR0FBWCxDQUFaO0FBQ0E1RCxlQUFPM0wsSUFBUCxHQUFja1AsU0FBZDs7QUFFQSxZQUFJQSxVQUFVdk8sTUFBVixHQUFtQixFQUF2QjtBQUNDZ0wsaUJBQU8zTCxJQUFQLEdBQWNrUCxVQUFVTSxTQUFWLENBQW9CLENBQXBCLEVBQXNCLEVBQXRCLENBQWQ7QUFMRjtBQUREO0FDNk9HOztBRHJPSCxXQUFPN0QsTUFBUDtBQWJxQixHQUF0QjtBQ3FQQSxDOzs7Ozs7Ozs7Ozs7QUN2akNEM1AsUUFBUXlULFVBQVIsR0FBcUIsRUFBckIsQzs7Ozs7Ozs7Ozs7O0FDQUE3VCxPQUFPOFQsT0FBUCxDQUNDO0FBQUEsMEJBQXdCLFVBQUN4VCxXQUFELEVBQWNXLFNBQWQsRUFBeUI4UyxRQUF6QjtBQUN2QixRQUFBQyx3QkFBQSxFQUFBQyxxQkFBQSxFQUFBQyxHQUFBLEVBQUFyUCxPQUFBOztBQUFBLFFBQUcsQ0FBQyxLQUFLb0QsTUFBVDtBQUNDLGFBQU8sSUFBUDtBQ0VFOztBREFILFFBQUczSCxnQkFBZSxzQkFBbEI7QUFDQztBQ0VFOztBRERILFFBQUdBLGVBQWdCVyxTQUFuQjtBQUNDLFVBQUcsQ0FBQzhTLFFBQUo7QUFDQ0csY0FBTTlULFFBQVFpRyxhQUFSLENBQXNCL0YsV0FBdEIsRUFBbUNnRyxPQUFuQyxDQUEyQztBQUFDOUUsZUFBS1A7QUFBTixTQUEzQyxFQUE2RDtBQUFDMEIsa0JBQVE7QUFBQ3dSLG1CQUFPO0FBQVI7QUFBVCxTQUE3RCxDQUFOO0FBQ0FKLG1CQUFBRyxPQUFBLE9BQVdBLElBQUtDLEtBQWhCLEdBQWdCLE1BQWhCO0FDU0c7O0FEUEpILGlDQUEyQjVULFFBQVFpRyxhQUFSLENBQXNCLHNCQUF0QixDQUEzQjtBQUNBeEIsZ0JBQVU7QUFBRXNMLGVBQU8sS0FBS2xJLE1BQWQ7QUFBc0JrTSxlQUFPSixRQUE3QjtBQUF1QyxvQkFBWXpULFdBQW5EO0FBQWdFLHNCQUFjLENBQUNXLFNBQUQ7QUFBOUUsT0FBVjtBQUNBZ1QsOEJBQXdCRCx5QkFBeUIxTixPQUF6QixDQUFpQ3pCLE9BQWpDLENBQXhCOztBQUNBLFVBQUdvUCxxQkFBSDtBQUNDRCxpQ0FBeUJJLE1BQXpCLENBQ0NILHNCQUFzQnpTLEdBRHZCLEVBRUM7QUFDQzZTLGdCQUFNO0FBQ0xDLG1CQUFPO0FBREYsV0FEUDtBQUlDQyxnQkFBTTtBQUNMQyxzQkFBVSxJQUFJQyxJQUFKLEVBREw7QUFFTEMseUJBQWEsS0FBS3pNO0FBRmI7QUFKUCxTQUZEO0FBREQ7QUFjQytMLGlDQUF5QlcsTUFBekIsQ0FDQztBQUNDblQsZUFBS3dTLHlCQUF5QlksVUFBekIsRUFETjtBQUVDekUsaUJBQU8sS0FBS2xJLE1BRmI7QUFHQ2tNLGlCQUFPSixRQUhSO0FBSUNqTyxrQkFBUTtBQUFDK08sZUFBR3ZVLFdBQUo7QUFBaUJ3VSxpQkFBSyxDQUFDN1QsU0FBRDtBQUF0QixXQUpUO0FBS0NxVCxpQkFBTyxDQUxSO0FBTUNTLG1CQUFTLElBQUlOLElBQUosRUFOVjtBQU9DTyxzQkFBWSxLQUFLL00sTUFQbEI7QUFRQ3VNLG9CQUFVLElBQUlDLElBQUosRUFSWDtBQVNDQyx1QkFBYSxLQUFLek07QUFUbkIsU0FERDtBQXRCRjtBQytDRztBRHJESjtBQUFBLENBREQsRTs7Ozs7Ozs7Ozs7O0FFQUEsSUFBQWdOLHNCQUFBLEVBQUFDLGdCQUFBLEVBQUFDLGFBQUE7O0FBQUFELG1CQUFtQixVQUFDRixVQUFELEVBQWFoTixPQUFiLEVBQXNCb04sUUFBdEIsRUFBZ0NDLFFBQWhDO0FDR2pCLFNERkRqVixRQUFRa1YsV0FBUixDQUFvQkMsb0JBQXBCLENBQXlDQyxhQUF6QyxHQUF5REMsU0FBekQsQ0FBbUUsQ0FDbEU7QUFBQ0MsWUFBUTtBQUFDVixrQkFBWUEsVUFBYjtBQUF5QmIsYUFBT25NO0FBQWhDO0FBQVQsR0FEa0UsRUFFbEU7QUFBQzJOLFlBQVE7QUFBQ25VLFdBQUs7QUFBQ2xCLHFCQUFhLFdBQWQ7QUFBMkJXLG1CQUFXLGFBQXRDO0FBQXFEa1QsZUFBTztBQUE1RCxPQUFOO0FBQTZFeUIsa0JBQVk7QUFBQ0MsY0FBTTtBQUFQO0FBQXpGO0FBQVQsR0FGa0UsRUFHbEU7QUFBQ0MsV0FBTztBQUFDRixrQkFBWSxDQUFDO0FBQWQ7QUFBUixHQUhrRSxFQUlsRTtBQUFDRyxZQUFRO0FBQVQsR0FKa0UsQ0FBbkUsRUFLR0MsT0FMSCxDQUtXLFVBQUNDLEdBQUQsRUFBTXhNLElBQU47QUFDVixRQUFHd00sR0FBSDtBQUNDLFlBQU0sSUFBSUMsS0FBSixDQUFVRCxHQUFWLENBQU47QUNzQkU7O0FEcEJIeE0sU0FBSzFHLE9BQUwsQ0FBYSxVQUFDbVIsR0FBRDtBQ3NCVCxhRHJCSGtCLFNBQVNoUyxJQUFULENBQWM4USxJQUFJMVMsR0FBbEIsQ0NxQkc7QUR0Qko7O0FBR0EsUUFBRzZULFlBQVl2UyxFQUFFcVQsVUFBRixDQUFhZCxRQUFiLENBQWY7QUFDQ0E7QUNzQkU7QURuQ0osSUNFQztBREhpQixDQUFuQjs7QUFrQkFKLHlCQUF5QmpWLE9BQU9vVyxTQUFQLENBQWlCbEIsZ0JBQWpCLENBQXpCOztBQUVBQyxnQkFBZ0IsVUFBQ2hCLEtBQUQsRUFBUTdULFdBQVIsRUFBb0IySCxNQUFwQixFQUE0Qm9PLFVBQTVCO0FBQ2YsTUFBQTVULE9BQUEsRUFBQTZULGtCQUFBLEVBQUFDLGdCQUFBLEVBQUE5TSxJQUFBLEVBQUE5RyxNQUFBLEVBQUE2VCxLQUFBLEVBQUFDLFNBQUEsRUFBQUMsT0FBQSxFQUFBQyxlQUFBOztBQUFBbE4sU0FBTyxJQUFJbUQsS0FBSixFQUFQOztBQUVBLE1BQUd5SixVQUFIO0FBRUM1VCxjQUFVckMsUUFBUUksU0FBUixDQUFrQkYsV0FBbEIsQ0FBVjtBQUVBZ1cseUJBQXFCbFcsUUFBUWlHLGFBQVIsQ0FBc0IvRixXQUF0QixDQUFyQjtBQUNBaVcsdUJBQUE5VCxXQUFBLE9BQW1CQSxRQUFTZ0UsY0FBNUIsR0FBNEIsTUFBNUI7O0FBQ0EsUUFBR2hFLFdBQVc2VCxrQkFBWCxJQUFpQ0MsZ0JBQXBDO0FBQ0NDLGNBQVEsRUFBUjtBQUNBRyx3QkFBa0JOLFdBQVdPLEtBQVgsQ0FBaUIsR0FBakIsQ0FBbEI7QUFDQUgsa0JBQVksRUFBWjtBQUNBRSxzQkFBZ0I1VCxPQUFoQixDQUF3QixVQUFDOFQsT0FBRDtBQUN2QixZQUFBQyxRQUFBO0FBQUFBLG1CQUFXLEVBQVg7QUFDQUEsaUJBQVNQLGdCQUFULElBQTZCO0FBQUNRLGtCQUFRRixRQUFRRyxJQUFSO0FBQVQsU0FBN0I7QUN3QkksZUR2QkpQLFVBQVVyVCxJQUFWLENBQWUwVCxRQUFmLENDdUJJO0FEMUJMO0FBS0FOLFlBQU1TLElBQU4sR0FBYVIsU0FBYjtBQUNBRCxZQUFNckMsS0FBTixHQUFjO0FBQUMrQyxhQUFLLENBQUMvQyxLQUFEO0FBQU4sT0FBZDtBQUVBeFIsZUFBUztBQUFDbkIsYUFBSztBQUFOLE9BQVQ7QUFDQW1CLGFBQU80VCxnQkFBUCxJQUEyQixDQUEzQjtBQUVBRyxnQkFBVUosbUJBQW1COVEsSUFBbkIsQ0FBd0JnUixLQUF4QixFQUErQjtBQUFDN1QsZ0JBQVFBLE1BQVQ7QUFBaUJrSSxjQUFNO0FBQUMySixvQkFBVTtBQUFYLFNBQXZCO0FBQXNDMkMsZUFBTztBQUE3QyxPQUEvQixDQUFWO0FBRUFULGNBQVEzVCxPQUFSLENBQWdCLFVBQUMrQyxNQUFEO0FDK0JYLGVEOUJKMkQsS0FBS3JHLElBQUwsQ0FBVTtBQUFDNUIsZUFBS3NFLE9BQU90RSxHQUFiO0FBQWtCNFYsaUJBQU90UixPQUFPeVEsZ0JBQVAsQ0FBekI7QUFBbURjLHdCQUFjL1c7QUFBakUsU0FBVixDQzhCSTtBRC9CTDtBQXZCRjtBQzZERTs7QURuQ0YsU0FBT21KLElBQVA7QUE3QmUsQ0FBaEI7O0FBK0JBekosT0FBTzhULE9BQVAsQ0FDQztBQUFBLDBCQUF3QixVQUFDOUwsT0FBRDtBQUN2QixRQUFBeUIsSUFBQSxFQUFBaU4sT0FBQTtBQUFBak4sV0FBTyxJQUFJbUQsS0FBSixFQUFQO0FBQ0E4SixjQUFVLElBQUk5SixLQUFKLEVBQVY7QUFDQXFJLDJCQUF1QixLQUFLaE4sTUFBNUIsRUFBb0NELE9BQXBDLEVBQTZDME8sT0FBN0M7QUFDQUEsWUFBUTNULE9BQVIsQ0FBZ0IsVUFBQ2lOLElBQUQ7QUFDZixVQUFBck4sTUFBQSxFQUFBbUQsTUFBQSxFQUFBd1IsYUFBQSxFQUFBQyx3QkFBQTtBQUFBRCxzQkFBZ0JsWCxRQUFRSSxTQUFSLENBQWtCd1AsS0FBSzFQLFdBQXZCLEVBQW9DMFAsS0FBS21FLEtBQXpDLENBQWhCOztBQUVBLFVBQUcsQ0FBQ21ELGFBQUo7QUFDQztBQ3VDRzs7QURyQ0pDLGlDQUEyQm5YLFFBQVFpRyxhQUFSLENBQXNCMkosS0FBSzFQLFdBQTNCLEVBQXdDMFAsS0FBS21FLEtBQTdDLENBQTNCOztBQUVBLFVBQUdtRCxpQkFBaUJDLHdCQUFwQjtBQUNDNVUsaUJBQVM7QUFBQ25CLGVBQUs7QUFBTixTQUFUO0FBRUFtQixlQUFPMlUsY0FBYzdRLGNBQXJCLElBQXVDLENBQXZDO0FBRUFYLGlCQUFTeVIseUJBQXlCalIsT0FBekIsQ0FBaUMwSixLQUFLL08sU0FBTCxDQUFlLENBQWYsQ0FBakMsRUFBb0Q7QUFBQzBCLGtCQUFRQTtBQUFULFNBQXBELENBQVQ7O0FBQ0EsWUFBR21ELE1BQUg7QUN3Q00saUJEdkNMMkQsS0FBS3JHLElBQUwsQ0FBVTtBQUFDNUIsaUJBQUtzRSxPQUFPdEUsR0FBYjtBQUFrQjRWLG1CQUFPdFIsT0FBT3dSLGNBQWM3USxjQUFyQixDQUF6QjtBQUErRDRRLDBCQUFjckgsS0FBSzFQO0FBQWxGLFdBQVYsQ0N1Q0s7QUQ5Q1A7QUNvREk7QUQ1REw7QUFpQkEsV0FBT21KLElBQVA7QUFyQkQ7QUF1QkEsMEJBQXdCLFVBQUNDLE9BQUQ7QUFDdkIsUUFBQUQsSUFBQSxFQUFBNE0sVUFBQSxFQUFBbUIsSUFBQSxFQUFBckQsS0FBQTtBQUFBcUQsV0FBTyxJQUFQO0FBRUEvTixXQUFPLElBQUltRCxLQUFKLEVBQVA7QUFFQXlKLGlCQUFhM00sUUFBUTJNLFVBQXJCO0FBQ0FsQyxZQUFRekssUUFBUXlLLEtBQWhCOztBQUVBclIsTUFBRUMsT0FBRixDQUFVM0MsUUFBUXFYLGFBQWxCLEVBQWlDLFVBQUNoVixPQUFELEVBQVUyQixJQUFWO0FBQ2hDLFVBQUFzVCxhQUFBOztBQUFBLFVBQUdqVixRQUFRa1YsYUFBWDtBQUNDRCx3QkFBZ0J2QyxjQUFjaEIsS0FBZCxFQUFxQjFSLFFBQVEyQixJQUE3QixFQUFtQ29ULEtBQUt2UCxNQUF4QyxFQUFnRG9PLFVBQWhELENBQWhCO0FDNkNJLGVENUNKNU0sT0FBT0EsS0FBSzJCLE1BQUwsQ0FBWXNNLGFBQVosQ0M0Q0g7QUFDRDtBRGhETDs7QUFLQSxXQUFPak8sSUFBUDtBQXBDRDtBQUFBLENBREQsRTs7Ozs7Ozs7Ozs7O0FFbkRBekosT0FBTzhULE9BQVAsQ0FDSTtBQUFBOEQsa0JBQWdCLFVBQUNDLFdBQUQsRUFBY2hULE9BQWQsRUFBdUJpVCxZQUF2QixFQUFxQ25LLFlBQXJDO0FDQ2hCLFdEQUl2TixRQUFRa1YsV0FBUixDQUFvQnlDLGdCQUFwQixDQUFxQ0MsTUFBckMsQ0FBNEM1RCxNQUE1QyxDQUFtRDtBQUFDNVMsV0FBS3FXO0FBQU4sS0FBbkQsRUFBdUU7QUFBQ3RELFlBQU07QUFBQzFQLGlCQUFTQSxPQUFWO0FBQW1CaVQsc0JBQWNBLFlBQWpDO0FBQStDbkssc0JBQWNBO0FBQTdEO0FBQVAsS0FBdkUsQ0NBSjtBRERBO0FBR0FzSyxrQkFBZ0IsVUFBQ0osV0FBRCxFQUFjSyxPQUFkO0FBQ1pDLFVBQU1ELE9BQU4sRUFBZXRMLEtBQWY7O0FBRUEsUUFBR3NMLFFBQVFuVCxNQUFSLEdBQWlCLENBQXBCO0FBQ0ksWUFBTSxJQUFJL0UsT0FBT2tXLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0Isc0NBQXRCLENBQU47QUNRUDs7QUFDRCxXRFJJOVYsUUFBUWtWLFdBQVIsQ0FBb0J5QyxnQkFBcEIsQ0FBcUMzRCxNQUFyQyxDQUE0QztBQUFDNVMsV0FBS3FXO0FBQU4sS0FBNUMsRUFBZ0U7QUFBQ3RELFlBQU07QUFBQzJELGlCQUFTQTtBQUFWO0FBQVAsS0FBaEUsQ0NRSjtBRGhCQTtBQUFBLENBREosRTs7Ozs7Ozs7Ozs7O0FFQUFsWSxPQUFPOFQsT0FBUCxDQUNDO0FBQUEsaUJBQWUsVUFBQ3BLLE9BQUQ7QUFDZCxRQUFBME8sY0FBQSxFQUFBQyxNQUFBLEVBQUExVixNQUFBLEVBQUEyVixZQUFBLEVBQUFSLFlBQUEsRUFBQWpULE9BQUEsRUFBQWdPLFlBQUEsRUFBQXZTLFdBQUEsRUFBQUMsR0FBQSxFQUFBdVMsTUFBQSxFQUFBbkcsUUFBQSxFQUFBd0gsS0FBQSxFQUFBbE0sTUFBQTtBQUFBa1EsVUFBTXpPLE9BQU4sRUFBZVUsTUFBZjtBQUNBK0osWUFBUXpLLFFBQVF5SyxLQUFoQjtBQUNBeFIsYUFBUytHLFFBQVEvRyxNQUFqQjtBQUNBckMsa0JBQWNvSixRQUFRcEosV0FBdEI7QUFDQXdYLG1CQUFlcE8sUUFBUW9PLFlBQXZCO0FBQ0FqVCxjQUFVNkUsUUFBUTdFLE9BQWxCO0FBQ0F5VCxtQkFBZSxFQUFmO0FBQ0FGLHFCQUFpQixFQUFqQjtBQUNBdkYsbUJBQUEsQ0FBQXRTLE1BQUFILFFBQUFJLFNBQUEsQ0FBQUYsV0FBQSxhQUFBQyxJQUErQ29DLE1BQS9DLEdBQStDLE1BQS9DOztBQUNBRyxNQUFFZSxJQUFGLENBQU9sQixNQUFQLEVBQWUsVUFBQ3FOLElBQUQsRUFBT3BFLEtBQVA7QUFDZCxVQUFBMk0sUUFBQSxFQUFBblUsSUFBQSxFQUFBb1UsV0FBQSxFQUFBQyxNQUFBO0FBQUFBLGVBQVN6SSxLQUFLNEcsS0FBTCxDQUFXLEdBQVgsQ0FBVDtBQUNBeFMsYUFBT3FVLE9BQU8sQ0FBUCxDQUFQO0FBQ0FELG9CQUFjM0YsYUFBYXpPLElBQWIsQ0FBZDs7QUFDQSxVQUFHcVUsT0FBTzFULE1BQVAsR0FBZ0IsQ0FBaEIsSUFBc0J5VCxXQUF6QjtBQUNDRCxtQkFBV3ZJLEtBQUsvRCxPQUFMLENBQWE3SCxPQUFPLEdBQXBCLEVBQXlCLEVBQXpCLENBQVg7QUFDQWdVLHVCQUFlaFYsSUFBZixDQUFvQjtBQUFDZ0IsZ0JBQU1BLElBQVA7QUFBYW1VLG9CQUFVQSxRQUF2QjtBQUFpQ3RULGlCQUFPdVQ7QUFBeEMsU0FBcEI7QUNPRzs7QUFDRCxhRFBIRixhQUFhbFUsSUFBYixJQUFxQixDQ09sQjtBRGRKOztBQVNBdUksZUFBVyxFQUFYO0FBQ0ExRSxhQUFTLEtBQUtBLE1BQWQ7QUFDQTBFLGFBQVN3SCxLQUFULEdBQWlCQSxLQUFqQjs7QUFDQSxRQUFHMkQsaUJBQWdCLFFBQW5CO0FBQ0NuTCxlQUFTd0gsS0FBVCxHQUNDO0FBQUErQyxhQUFLLENBQUMsSUFBRCxFQUFNL0MsS0FBTjtBQUFMLE9BREQ7QUFERCxXQUdLLElBQUcyRCxpQkFBZ0IsTUFBbkI7QUFDSm5MLGVBQVN3RCxLQUFULEdBQWlCbEksTUFBakI7QUNTRTs7QURQSCxRQUFHN0gsUUFBUXNZLGFBQVIsQ0FBc0J2RSxLQUF0QixLQUFnQy9ULFFBQVF1WSxZQUFSLENBQXFCeEUsS0FBckIsRUFBNEIsS0FBQ2xNLE1BQTdCLENBQW5DO0FBQ0MsYUFBTzBFLFNBQVN3SCxLQUFoQjtBQ1NFOztBRFBILFFBQUd0UCxXQUFZQSxRQUFRRSxNQUFSLEdBQWlCLENBQWhDO0FBQ0M0SCxlQUFTLE1BQVQsSUFBbUI5SCxPQUFuQjtBQ1NFOztBRFBId1QsYUFBU2pZLFFBQVFpRyxhQUFSLENBQXNCL0YsV0FBdEIsRUFBbUNrRixJQUFuQyxDQUF3Q21ILFFBQXhDLEVBQWtEO0FBQUNoSyxjQUFRMlYsWUFBVDtBQUF1Qk0sWUFBTSxDQUE3QjtBQUFnQ3pCLGFBQU87QUFBdkMsS0FBbEQsQ0FBVDtBQUdBckUsYUFBU3VGLE9BQU9RLEtBQVAsRUFBVDs7QUFDQSxRQUFHVCxlQUFlclQsTUFBbEI7QUFDQytOLGVBQVNBLE9BQU9oSCxHQUFQLENBQVcsVUFBQ2tFLElBQUQsRUFBTXBFLEtBQU47QUFDbkI5SSxVQUFFZSxJQUFGLENBQU91VSxjQUFQLEVBQXVCLFVBQUNVLGlCQUFELEVBQW9CbE4sS0FBcEI7QUFDdEIsY0FBQW1OLG9CQUFBLEVBQUFDLE9BQUEsRUFBQUMsU0FBQSxFQUFBbFQsSUFBQSxFQUFBbVQsYUFBQSxFQUFBMVYsWUFBQSxFQUFBTCxJQUFBO0FBQUE2VixvQkFBVUYsa0JBQWtCMVUsSUFBbEIsR0FBeUIsS0FBekIsR0FBaUMwVSxrQkFBa0JQLFFBQWxCLENBQTJCdE0sT0FBM0IsQ0FBbUMsS0FBbkMsRUFBMEMsS0FBMUMsQ0FBM0M7QUFDQWdOLHNCQUFZakosS0FBSzhJLGtCQUFrQjFVLElBQXZCLENBQVo7QUFDQWpCLGlCQUFPMlYsa0JBQWtCN1QsS0FBbEIsQ0FBd0I5QixJQUEvQjs7QUFDQSxjQUFHLENBQUMsUUFBRCxFQUFXLGVBQVgsRUFBNEJ1QixPQUE1QixDQUFvQ3ZCLElBQXBDLElBQTRDLENBQUMsQ0FBaEQ7QUFDQ0ssMkJBQWVzVixrQkFBa0I3VCxLQUFsQixDQUF3QnpCLFlBQXZDO0FBQ0F1VixtQ0FBdUIsRUFBdkI7QUFDQUEsaUNBQXFCRCxrQkFBa0JQLFFBQXZDLElBQW1ELENBQW5EO0FBQ0FXLDRCQUFnQjlZLFFBQVFpRyxhQUFSLENBQXNCN0MsWUFBdEIsRUFBb0M4QyxPQUFwQyxDQUE0QztBQUFDOUUsbUJBQUt5WDtBQUFOLGFBQTVDLEVBQThEO0FBQUF0VyxzQkFBUW9XO0FBQVIsYUFBOUQsQ0FBaEI7O0FBQ0EsZ0JBQUdHLGFBQUg7QUFDQ2xKLG1CQUFLZ0osT0FBTCxJQUFnQkUsY0FBY0osa0JBQWtCUCxRQUFoQyxDQUFoQjtBQU5GO0FBQUEsaUJBT0ssSUFBR3BWLFNBQVEsUUFBWDtBQUNKdUcsc0JBQVVvUCxrQkFBa0I3VCxLQUFsQixDQUF3QnlFLE9BQWxDO0FBQ0FzRyxpQkFBS2dKLE9BQUwsTUFBQWpULE9BQUFqRCxFQUFBcUMsU0FBQSxDQUFBdUUsT0FBQTtBQ2lCUXBHLHFCQUFPMlY7QURqQmYsbUJDa0JhLElEbEJiLEdDa0JvQmxULEtEbEJzQzFDLEtBQTFELEdBQTBELE1BQTFELEtBQW1FNFYsU0FBbkU7QUFGSTtBQUlKakosaUJBQUtnSixPQUFMLElBQWdCQyxTQUFoQjtBQ21CSzs7QURsQk4sZUFBT2pKLEtBQUtnSixPQUFMLENBQVA7QUNvQk8sbUJEbkJOaEosS0FBS2dKLE9BQUwsSUFBZ0IsSUNtQlY7QUFDRDtBRHJDUDs7QUFrQkEsZUFBT2hKLElBQVA7QUFuQlEsUUFBVDtBQW9CQSxhQUFPOEMsTUFBUDtBQXJCRDtBQXVCQyxhQUFPQSxNQUFQO0FDdUJFO0FEcEZKO0FBQUEsQ0FERCxFOzs7Ozs7Ozs7Ozs7QUVBQTs7Ozs7Ozs7R0FVQTlTLE9BQU84VCxPQUFQLENBQ0k7QUFBQSwyQkFBeUIsVUFBQ3hULFdBQUQsRUFBY2MsWUFBZCxFQUE0QnlKLElBQTVCO0FBQ3JCLFFBQUFxSixHQUFBLEVBQUFyTyxHQUFBLEVBQUFzVCxPQUFBLEVBQUFsUixNQUFBO0FBQUFBLGFBQVMsS0FBS0EsTUFBZDtBQUNBa1IsY0FBVS9ZLFFBQVFrVixXQUFSLENBQW9CclYsUUFBcEIsQ0FBNkJxRyxPQUE3QixDQUFxQztBQUFDaEcsbUJBQWFBLFdBQWQ7QUFBMkJXLGlCQUFXLGtCQUF0QztBQUEwRGtQLGFBQU9sSTtBQUFqRSxLQUFyQyxDQUFWOztBQUNBLFFBQUdrUixPQUFIO0FDTUYsYURMTS9ZLFFBQVFrVixXQUFSLENBQW9CclYsUUFBcEIsQ0FBNkJtVSxNQUE3QixDQUFvQztBQUFDNVMsYUFBSzJYLFFBQVEzWDtBQUFkLE9BQXBDLEVBQXdEO0FBQUMrUyxlQ1MzRDFPLE1EVGlFLEVDU2pFLEVBQ0FBLElEVmtFLGNBQVl6RSxZQUFaLEdBQXlCLE9DVTNGLElEVm1HeUosSUNTbkcsRUFFQWhGLEdEWDJEO0FBQUQsT0FBeEQsQ0NLTjtBRE5FO0FBR0lxTyxZQUNJO0FBQUEvUSxjQUFNLE1BQU47QUFDQTdDLHFCQUFhQSxXQURiO0FBRUFXLG1CQUFXLGtCQUZYO0FBR0FoQixrQkFBVSxFQUhWO0FBSUFrUSxlQUFPbEk7QUFKUCxPQURKO0FBT0FpTSxVQUFJalUsUUFBSixDQUFhbUIsWUFBYixJQUE2QixFQUE3QjtBQUNBOFMsVUFBSWpVLFFBQUosQ0FBYW1CLFlBQWIsRUFBMkJ5SixJQUEzQixHQUFrQ0EsSUFBbEM7QUNjTixhRFpNekssUUFBUWtWLFdBQVIsQ0FBb0JyVixRQUFwQixDQUE2QjBVLE1BQTdCLENBQW9DVCxHQUFwQyxDQ1lOO0FBQ0Q7QUQ3QkQ7QUFrQkEsbUNBQWlDLFVBQUM1VCxXQUFELEVBQWNjLFlBQWQsRUFBNEJnWSxZQUE1QjtBQUM3QixRQUFBbEYsR0FBQSxFQUFBck8sR0FBQSxFQUFBc1QsT0FBQSxFQUFBbFIsTUFBQTtBQUFBQSxhQUFTLEtBQUtBLE1BQWQ7QUFDQWtSLGNBQVUvWSxRQUFRa1YsV0FBUixDQUFvQnJWLFFBQXBCLENBQTZCcUcsT0FBN0IsQ0FBcUM7QUFBQ2hHLG1CQUFhQSxXQUFkO0FBQTJCVyxpQkFBVyxrQkFBdEM7QUFBMERrUCxhQUFPbEk7QUFBakUsS0FBckMsQ0FBVjs7QUFDQSxRQUFHa1IsT0FBSDtBQ21CRixhRGxCTS9ZLFFBQVFrVixXQUFSLENBQW9CclYsUUFBcEIsQ0FBNkJtVSxNQUE3QixDQUFvQztBQUFDNVMsYUFBSzJYLFFBQVEzWDtBQUFkLE9BQXBDLEVBQXdEO0FBQUMrUyxlQ3NCM0QxTyxNRHRCaUUsRUNzQmpFLEVBQ0FBLElEdkJrRSxjQUFZekUsWUFBWixHQUF5QixlQ3VCM0YsSUR2QjJHZ1ksWUNzQjNHLEVBRUF2VCxHRHhCMkQ7QUFBRCxPQUF4RCxDQ2tCTjtBRG5CRTtBQUdJcU8sWUFDSTtBQUFBL1EsY0FBTSxNQUFOO0FBQ0E3QyxxQkFBYUEsV0FEYjtBQUVBVyxtQkFBVyxrQkFGWDtBQUdBaEIsa0JBQVUsRUFIVjtBQUlBa1EsZUFBT2xJO0FBSlAsT0FESjtBQU9BaU0sVUFBSWpVLFFBQUosQ0FBYW1CLFlBQWIsSUFBNkIsRUFBN0I7QUFDQThTLFVBQUlqVSxRQUFKLENBQWFtQixZQUFiLEVBQTJCZ1ksWUFBM0IsR0FBMENBLFlBQTFDO0FDMkJOLGFEekJNaFosUUFBUWtWLFdBQVIsQ0FBb0JyVixRQUFwQixDQUE2QjBVLE1BQTdCLENBQW9DVCxHQUFwQyxDQ3lCTjtBQUNEO0FENUREO0FBb0NBLG1CQUFpQixVQUFDNVQsV0FBRCxFQUFjYyxZQUFkLEVBQTRCZ1ksWUFBNUIsRUFBMEN2TyxJQUExQztBQUNiLFFBQUFxSixHQUFBLEVBQUFyTyxHQUFBLEVBQUF3VCxJQUFBLEVBQUE5WSxHQUFBLEVBQUF3RixJQUFBLEVBQUFvVCxPQUFBLEVBQUFsUixNQUFBO0FBQUFBLGFBQVMsS0FBS0EsTUFBZDtBQUNBa1IsY0FBVS9ZLFFBQVFrVixXQUFSLENBQW9CclYsUUFBcEIsQ0FBNkJxRyxPQUE3QixDQUFxQztBQUFDaEcsbUJBQWFBLFdBQWQ7QUFBMkJXLGlCQUFXLGtCQUF0QztBQUEwRGtQLGFBQU9sSTtBQUFqRSxLQUFyQyxDQUFWOztBQUNBLFFBQUdrUixPQUFIO0FBRUlDLG1CQUFhRSxXQUFiLEtBQUEvWSxNQUFBNFksUUFBQWxaLFFBQUEsTUFBQW1CLFlBQUEsY0FBQTJFLE9BQUF4RixJQUFBNlksWUFBQSxZQUFBclQsS0FBaUZ1VCxXQUFqRixHQUFpRixNQUFqRixHQUFpRixNQUFqRixNQUFnRyxFQUFoRyxHQUF3RyxFQUF4RyxHQUFnSCxFQUFoSDs7QUFDQSxVQUFHek8sSUFBSDtBQytCSixlRDlCUXpLLFFBQVFrVixXQUFSLENBQW9CclYsUUFBcEIsQ0FBNkJtVSxNQUE3QixDQUFvQztBQUFDNVMsZUFBSzJYLFFBQVEzWDtBQUFkLFNBQXBDLEVBQXdEO0FBQUMrUyxpQkNrQzdEMU8sTURsQ21FLEVDa0NuRSxFQUNBQSxJRG5Db0UsY0FBWXpFLFlBQVosR0FBeUIsT0NtQzdGLElEbkNxR3lKLElDa0NyRyxFQUVBaEYsSURwQzJHLGNBQVl6RSxZQUFaLEdBQXlCLGVDb0NwSSxJRHBDb0pnWSxZQ2tDcEosRUFHQXZULEdEckM2RDtBQUFELFNBQXhELENDOEJSO0FEL0JJO0FDMENKLGVEdkNRekYsUUFBUWtWLFdBQVIsQ0FBb0JyVixRQUFwQixDQUE2Qm1VLE1BQTdCLENBQW9DO0FBQUM1UyxlQUFLMlgsUUFBUTNYO0FBQWQsU0FBcEMsRUFBd0Q7QUFBQytTLGlCQzJDN0Q4RSxPRDNDbUUsRUMyQ25FLEVBQ0FBLEtENUNvRSxjQUFZalksWUFBWixHQUF5QixlQzRDN0YsSUQ1QzZHZ1ksWUMyQzdHLEVBRUFDLElEN0M2RDtBQUFELFNBQXhELENDdUNSO0FEN0NBO0FBQUE7QUFRSW5GLFlBQ0k7QUFBQS9RLGNBQU0sTUFBTjtBQUNBN0MscUJBQWFBLFdBRGI7QUFFQVcsbUJBQVcsa0JBRlg7QUFHQWhCLGtCQUFVLEVBSFY7QUFJQWtRLGVBQU9sSTtBQUpQLE9BREo7QUFPQWlNLFVBQUlqVSxRQUFKLENBQWFtQixZQUFiLElBQTZCLEVBQTdCO0FBQ0E4UyxVQUFJalUsUUFBSixDQUFhbUIsWUFBYixFQUEyQmdZLFlBQTNCLEdBQTBDQSxZQUExQztBQUNBbEYsVUFBSWpVLFFBQUosQ0FBYW1CLFlBQWIsRUFBMkJ5SixJQUEzQixHQUFrQ0EsSUFBbEM7QUNpRE4sYUQvQ016SyxRQUFRa1YsV0FBUixDQUFvQnJWLFFBQXBCLENBQTZCMFUsTUFBN0IsQ0FBb0NULEdBQXBDLENDK0NOO0FBQ0Q7QUQxR0Q7QUFBQSxDQURKLEU7Ozs7Ozs7Ozs7OztBRVZBLElBQUFxRixjQUFBLEVBQUFDLGVBQUEsRUFBQUMsYUFBQSxFQUFBQyxFQUFBLEVBQUFDLE1BQUEsRUFBQUMsTUFBQSxFQUFBM1EsSUFBQSxFQUFBNFEsTUFBQTs7QUFBQUEsU0FBU0MsUUFBUSxRQUFSLENBQVQ7QUFDQUosS0FBS0ksUUFBUSxJQUFSLENBQUw7QUFDQTdRLE9BQU82USxRQUFRLE1BQVIsQ0FBUDtBQUNBRixTQUFTRSxRQUFRLFFBQVIsQ0FBVDtBQUVBSCxTQUFTLElBQUlJLE1BQUosQ0FBVyxlQUFYLENBQVQ7O0FBRUFOLGdCQUFnQixVQUFDTyxPQUFELEVBQVNDLE9BQVQ7QUFFZixNQUFBQyxPQUFBLEVBQUFDLEdBQUEsRUFBQUMsV0FBQSxFQUFBQyxRQUFBLEVBQUFDLFFBQUEsRUFBQUMsS0FBQSxFQUFBQyxHQUFBLEVBQUFDLE1BQUEsRUFBQUMsR0FBQSxFQUFBQyxJQUFBO0FBQUFULFlBQVUsSUFBSUwsT0FBT2UsT0FBWCxFQUFWO0FBQ0FGLFFBQU1SLFFBQVFXLFdBQVIsQ0FBb0JiLE9BQXBCLENBQU47QUFHQVMsV0FBUyxJQUFJSyxNQUFKLENBQVdKLEdBQVgsQ0FBVDtBQUdBRixRQUFNLElBQUkvRixJQUFKLEVBQU47QUFDQWtHLFNBQU9ILElBQUlPLFdBQUosRUFBUDtBQUNBUixVQUFRQyxJQUFJUSxRQUFKLEtBQWlCLENBQXpCO0FBQ0FiLFFBQU1LLElBQUlTLE9BQUosRUFBTjtBQUdBWCxhQUFXclIsS0FBSzBLLElBQUwsQ0FBVXVILHFCQUFxQkMsU0FBL0IsRUFBeUMscUJBQXFCUixJQUFyQixHQUE0QixHQUE1QixHQUFrQ0osS0FBbEMsR0FBMEMsR0FBMUMsR0FBZ0RKLEdBQWhELEdBQXNELEdBQXRELEdBQTRERixPQUFyRyxDQUFYO0FBQ0FJLGFBQUEsQ0FBQUwsV0FBQSxPQUFXQSxRQUFTeFksR0FBcEIsR0FBb0IsTUFBcEIsSUFBMEIsTUFBMUI7QUFDQTRZLGdCQUFjblIsS0FBSzBLLElBQUwsQ0FBVTJHLFFBQVYsRUFBb0JELFFBQXBCLENBQWQ7O0FBRUEsTUFBRyxDQUFDWCxHQUFHMEIsVUFBSCxDQUFjZCxRQUFkLENBQUo7QUFDQ1YsV0FBT3lCLElBQVAsQ0FBWWYsUUFBWjtBQ0RDOztBRElGWixLQUFHNEIsU0FBSCxDQUFhbEIsV0FBYixFQUEwQkssTUFBMUIsRUFBa0MsVUFBQ3hFLEdBQUQ7QUFDakMsUUFBR0EsR0FBSDtBQ0ZJLGFER0gwRCxPQUFPck4sS0FBUCxDQUFnQjBOLFFBQVF4WSxHQUFSLEdBQVksV0FBNUIsRUFBdUN5VSxHQUF2QyxDQ0hHO0FBQ0Q7QURBSjtBQUlBLFNBQU9xRSxRQUFQO0FBM0JlLENBQWhCOztBQStCQWYsaUJBQWlCLFVBQUMxVCxHQUFELEVBQUtvVSxPQUFMO0FBRWhCLE1BQUFELE9BQUEsRUFBQXVCLE9BQUEsRUFBQUMsT0FBQSxFQUFBQyxVQUFBLEVBQUFDLFNBQUEsRUFBQW5iLEdBQUE7QUFBQXlaLFlBQVUsRUFBVjtBQUVBMEIsY0FBQSxPQUFBdGIsT0FBQSxvQkFBQUEsWUFBQSxRQUFBRyxNQUFBSCxRQUFBSSxTQUFBLENBQUF5WixPQUFBLGFBQUExWixJQUF5Q29DLE1BQXpDLEdBQXlDLE1BQXpDLEdBQXlDLE1BQXpDOztBQUVBOFksZUFBYSxVQUFDRSxVQUFEO0FDSlYsV0RLRjNCLFFBQVEyQixVQUFSLElBQXNCOVYsSUFBSThWLFVBQUosS0FBbUIsRUNMdkM7QURJVSxHQUFiOztBQUdBSCxZQUFVLFVBQUNHLFVBQUQsRUFBWXhZLElBQVo7QUFDVCxRQUFBeVksSUFBQSxFQUFBQyxPQUFBLEVBQUFDLE1BQUE7QUFBQUYsV0FBTy9WLElBQUk4VixVQUFKLENBQVA7O0FBQ0EsUUFBR3hZLFNBQVEsTUFBWDtBQUNDMlksZUFBUyxZQUFUO0FBREQ7QUFHQ0EsZUFBUyxxQkFBVDtBQ0hFOztBRElILFFBQUdGLFFBQUEsUUFBVUUsVUFBQSxJQUFiO0FBQ0NELGdCQUFVRSxPQUFPSCxJQUFQLEVBQWFFLE1BQWIsQ0FBb0JBLE1BQXBCLENBQVY7QUNGRTs7QUFDRCxXREVGOUIsUUFBUTJCLFVBQVIsSUFBc0JFLFdBQVcsRUNGL0I7QUROTyxHQUFWOztBQVVBTixZQUFVLFVBQUNJLFVBQUQ7QUFDVCxRQUFHOVYsSUFBSThWLFVBQUosTUFBbUIsSUFBdEI7QUNESSxhREVIM0IsUUFBUTJCLFVBQVIsSUFBc0IsR0NGbkI7QURDSixXQUVLLElBQUc5VixJQUFJOFYsVUFBSixNQUFtQixLQUF0QjtBQ0RELGFERUgzQixRQUFRMkIsVUFBUixJQUFzQixHQ0ZuQjtBRENDO0FDQ0QsYURFSDNCLFFBQVEyQixVQUFSLElBQXNCLEVDRm5CO0FBQ0Q7QURMTSxHQUFWOztBQVNBN1ksSUFBRWUsSUFBRixDQUFPNlgsU0FBUCxFQUFrQixVQUFDelcsS0FBRCxFQUFRMFcsVUFBUjtBQUNqQixZQUFBMVcsU0FBQSxPQUFPQSxNQUFPOUIsSUFBZCxHQUFjLE1BQWQ7QUFBQSxXQUNNLE1BRE47QUFBQSxXQUNhLFVBRGI7QUNDTSxlREF1QnFZLFFBQVFHLFVBQVIsRUFBbUIxVyxNQUFNOUIsSUFBekIsQ0NBdkI7O0FERE4sV0FFTSxTQUZOO0FDR00sZUREZW9ZLFFBQVFJLFVBQVIsQ0NDZjs7QURITjtBQ0tNLGVERkFGLFdBQVdFLFVBQVgsQ0NFQTtBRExOO0FBREQ7O0FBTUEsU0FBTzNCLE9BQVA7QUFsQ2dCLENBQWpCOztBQXFDQVIsa0JBQWtCLFVBQUMzVCxHQUFELEVBQUtvVSxPQUFMO0FBRWpCLE1BQUErQixlQUFBLEVBQUE3TixlQUFBO0FBQUFBLG9CQUFrQixFQUFsQjtBQUdBNk4sb0JBQUEsT0FBQTViLE9BQUEsb0JBQUFBLFlBQUEsT0FBa0JBLFFBQVM2UyxvQkFBVCxDQUE4QmdILE9BQTlCLENBQWxCLEdBQWtCLE1BQWxCO0FBR0ErQixrQkFBZ0JqWixPQUFoQixDQUF3QixVQUFDa1osY0FBRDtBQUV2QixRQUFBdFosTUFBQSxFQUFBMFcsSUFBQSxFQUFBOVksR0FBQSxFQUFBMmIsaUJBQUEsRUFBQUMsaUJBQUEsRUFBQUMsZ0JBQUEsRUFBQWhhLGtCQUFBO0FBQUFnYSx1QkFBbUIsRUFBbkI7O0FBSUEsUUFBR0gsbUJBQWtCLFdBQXJCO0FBQ0M3WiwyQkFBcUIsWUFBckI7QUFERDtBQUlDTyxlQUFBLE9BQUF2QyxPQUFBLG9CQUFBQSxZQUFBLFFBQUFHLE1BQUFILFFBQUF3SyxPQUFBLENBQUFxUixjQUFBLGFBQUExYixJQUEyQ29DLE1BQTNDLEdBQTJDLE1BQTNDLEdBQTJDLE1BQTNDO0FBRUFQLDJCQUFxQixFQUFyQjs7QUFDQVUsUUFBRWUsSUFBRixDQUFPbEIsTUFBUCxFQUFlLFVBQUNzQyxLQUFELEVBQVEwVyxVQUFSO0FBQ2QsYUFBQTFXLFNBQUEsT0FBR0EsTUFBT3pCLFlBQVYsR0FBVSxNQUFWLE1BQTBCeVcsT0FBMUI7QUNMTSxpQkRNTDdYLHFCQUFxQnVaLFVDTmhCO0FBQ0Q7QURHTjtBQ0RFOztBRE1ILFFBQUd2WixrQkFBSDtBQUNDOFosMEJBQW9COWIsUUFBUWlHLGFBQVIsQ0FBc0I0VixjQUF0QixDQUFwQjtBQUVBRSwwQkFBb0JELGtCQUFrQjFXLElBQWxCLEVDTGY2VCxPREtzQyxFQ0x0QyxFQUNBQSxLREl1QyxLQUFHalgsa0JDSjFDLElESStEeUQsSUFBSXJFLEdDTG5FLEVBRUE2WCxJREdlLEdBQTBEUixLQUExRCxFQUFwQjtBQUVBc0Qsd0JBQWtCcFosT0FBbEIsQ0FBMEIsVUFBQ3NaLFVBQUQ7QUFFekIsWUFBQUMsVUFBQTtBQUFBQSxxQkFBYS9DLGVBQWU4QyxVQUFmLEVBQTBCSixjQUExQixDQUFiO0FDRkksZURJSkcsaUJBQWlCaFosSUFBakIsQ0FBc0JrWixVQUF0QixDQ0pJO0FEQUw7QUNFRTs7QUFDRCxXRElGbk8sZ0JBQWdCOE4sY0FBaEIsSUFBa0NHLGdCQ0poQztBRDFCSDtBQWdDQSxTQUFPak8sZUFBUDtBQXhDaUIsQ0FBbEI7O0FBMkNBL04sUUFBUW1jLFVBQVIsR0FBcUIsVUFBQ3RDLE9BQUQsRUFBVXVDLFVBQVY7QUFDcEIsTUFBQTVXLFVBQUE7QUFBQStULFNBQU84QyxJQUFQLENBQVksd0JBQVo7QUFFQWxRLFVBQVFtUSxJQUFSLENBQWEsb0JBQWI7QUFNQTlXLGVBQWF4RixRQUFRaUcsYUFBUixDQUFzQjRULE9BQXRCLENBQWI7QUFFQXVDLGVBQWE1VyxXQUFXSixJQUFYLENBQWdCLEVBQWhCLEVBQW9CcVQsS0FBcEIsRUFBYjtBQUVBMkQsYUFBV3paLE9BQVgsQ0FBbUIsVUFBQzRaLFNBQUQ7QUFDbEIsUUFBQUwsVUFBQSxFQUFBaEMsUUFBQSxFQUFBTixPQUFBLEVBQUE3TCxlQUFBO0FBQUE2TCxjQUFVLEVBQVY7QUFDQUEsWUFBUXhZLEdBQVIsR0FBY21iLFVBQVVuYixHQUF4QjtBQUdBOGEsaUJBQWEvQyxlQUFlb0QsU0FBZixFQUF5QjFDLE9BQXpCLENBQWI7QUFDQUQsWUFBUUMsT0FBUixJQUFtQnFDLFVBQW5CO0FBR0FuTyxzQkFBa0JxTCxnQkFBZ0JtRCxTQUFoQixFQUEwQjFDLE9BQTFCLENBQWxCO0FBRUFELFlBQVEsaUJBQVIsSUFBNkI3TCxlQUE3QjtBQ2RFLFdEaUJGbU0sV0FBV2IsY0FBY08sT0FBZCxFQUFzQkMsT0FBdEIsQ0NqQlQ7QURHSDtBQWdCQTFOLFVBQVFxUSxPQUFSLENBQWdCLG9CQUFoQjtBQUNBLFNBQU90QyxRQUFQO0FBOUJvQixDQUFyQixDOzs7Ozs7Ozs7Ozs7QUV0SEF0YSxPQUFPOFQsT0FBUCxDQUNDO0FBQUErSSwyQkFBeUIsVUFBQ3ZjLFdBQUQsRUFBYzZCLG1CQUFkLEVBQW1DQyxrQkFBbkMsRUFBdURuQixTQUF2RCxFQUFrRStHLE9BQWxFO0FBQ3hCLFFBQUFQLFdBQUEsRUFBQXFWLGVBQUEsRUFBQW5RLFFBQUEsRUFBQTFFLE1BQUE7QUFBQUEsYUFBUyxLQUFLQSxNQUFkOztBQUNBLFFBQUc5Rix3QkFBdUIsc0JBQTFCO0FBQ0N3SyxpQkFBVztBQUFDLDBCQUFrQjNFO0FBQW5CLE9BQVg7QUFERDtBQUdDMkUsaUJBQVc7QUFBQ3dILGVBQU9uTTtBQUFSLE9BQVg7QUNNRTs7QURKSCxRQUFHN0Ysd0JBQXVCLFdBQTFCO0FBRUN3SyxlQUFTLFVBQVQsSUFBdUJyTSxXQUF2QjtBQUNBcU0sZUFBUyxZQUFULElBQXlCLENBQUMxTCxTQUFELENBQXpCO0FBSEQ7QUFLQzBMLGVBQVN2SyxrQkFBVCxJQUErQm5CLFNBQS9CO0FDS0U7O0FESEh3RyxrQkFBY3JILFFBQVFtTyxjQUFSLENBQXVCcE0sbUJBQXZCLEVBQTRDNkYsT0FBNUMsRUFBcURDLE1BQXJELENBQWQ7O0FBQ0EsUUFBRyxDQUFDUixZQUFZc1YsY0FBYixJQUFnQ3RWLFlBQVlDLFNBQS9DO0FBQ0NpRixlQUFTd0QsS0FBVCxHQUFpQmxJLE1BQWpCO0FDS0U7O0FESEg2VSxzQkFBa0IxYyxRQUFRaUcsYUFBUixDQUFzQmxFLG1CQUF0QixFQUEyQ3FELElBQTNDLENBQWdEbUgsUUFBaEQsQ0FBbEI7QUFDQSxXQUFPbVEsZ0JBQWdCeEksS0FBaEIsRUFBUDtBQW5CRDtBQUFBLENBREQsRTs7Ozs7Ozs7Ozs7O0FFQUF0VSxPQUFPOFQsT0FBUCxDQUNDO0FBQUFrSix1QkFBcUIsVUFBQ0MsU0FBRCxFQUFZalYsT0FBWjtBQUNwQixRQUFBa1YsV0FBQSxFQUFBQyxTQUFBO0FBQUFELGtCQUFjRSxHQUFHQyxLQUFILENBQVMvVyxPQUFULENBQWlCO0FBQUM5RSxXQUFLeWI7QUFBTixLQUFqQixFQUFtQzdZLElBQWpEO0FBQ0ErWSxnQkFBWUMsR0FBR0UsTUFBSCxDQUFVaFgsT0FBVixDQUFrQjtBQUFDOUUsV0FBS3dHO0FBQU4sS0FBbEIsRUFBa0M1RCxJQUE5QztBQUVBLFdBQU87QUFBQ21aLGVBQVNMLFdBQVY7QUFBdUIvSSxhQUFPZ0o7QUFBOUIsS0FBUDtBQUpEO0FBTUFLLG1CQUFpQixVQUFDaGMsR0FBRDtBQ1FkLFdEUEY0YixHQUFHSyxXQUFILENBQWV6RixNQUFmLENBQXNCNUQsTUFBdEIsQ0FBNkI7QUFBQzVTLFdBQUtBO0FBQU4sS0FBN0IsRUFBd0M7QUFBQytTLFlBQU07QUFBQ21KLHNCQUFjO0FBQWY7QUFBUCxLQUF4QyxDQ09FO0FEZEg7QUFTQUMsbUJBQWlCLFVBQUNuYyxHQUFEO0FDY2QsV0RiRjRiLEdBQUdLLFdBQUgsQ0FBZXpGLE1BQWYsQ0FBc0I1RCxNQUF0QixDQUE2QjtBQUFDNVMsV0FBS0E7QUFBTixLQUE3QixFQUF3QztBQUFDK1MsWUFBTTtBQUFDbUosc0JBQWMsVUFBZjtBQUEyQkUsdUJBQWU7QUFBMUM7QUFBUCxLQUF4QyxDQ2FFO0FEdkJIO0FBQUEsQ0FERCxFOzs7Ozs7Ozs7Ozs7QUVBQTVkLE9BQU82ZCxPQUFQLENBQWUsdUJBQWYsRUFBd0MsVUFBQ3ZkLFdBQUQsRUFBY3lJLEVBQWQsRUFBa0JnTCxRQUFsQjtBQUN2QyxNQUFBbk8sVUFBQTtBQUFBQSxlQUFheEYsUUFBUWlHLGFBQVIsQ0FBc0IvRixXQUF0QixFQUFtQ3lULFFBQW5DLENBQWI7O0FBQ0EsTUFBR25PLFVBQUg7QUFDQyxXQUFPQSxXQUFXSixJQUFYLENBQWdCO0FBQUNoRSxXQUFLdUg7QUFBTixLQUFoQixDQUFQO0FDSUM7QURQSCxHOzs7Ozs7Ozs7Ozs7QUVBQS9JLE9BQU84ZCxnQkFBUCxDQUF3Qix3QkFBeEIsRUFBa0QsVUFBQ0MsU0FBRCxFQUFZakosR0FBWixFQUFpQm5TLE1BQWpCLEVBQXlCcUYsT0FBekI7QUFDakQsTUFBQWdXLE9BQUEsRUFBQWhNLEtBQUEsRUFBQXZQLE9BQUEsRUFBQTRVLFlBQUEsRUFBQTVOLElBQUEsRUFBQWdHLElBQUEsRUFBQXdPLGlCQUFBLEVBQUFDLGdCQUFBLEVBQUExRyxJQUFBOztBQUFBLE9BQU8sS0FBS3ZQLE1BQVo7QUFDQyxXQUFPLEtBQUtrVyxLQUFMLEVBQVA7QUNFQzs7QURBRmhHLFFBQU00RixTQUFOLEVBQWlCSyxNQUFqQjtBQUNBakcsUUFBTXJELEdBQU4sRUFBV2xJLEtBQVg7QUFDQXVMLFFBQU14VixNQUFOLEVBQWMwYixNQUFNQyxRQUFOLENBQWVsVSxNQUFmLENBQWQ7QUFFQWlOLGlCQUFlMEcsVUFBVTlSLE9BQVYsQ0FBa0IsVUFBbEIsRUFBNkIsRUFBN0IsQ0FBZjtBQUNBeEosWUFBVXJDLFFBQVFJLFNBQVIsQ0FBa0I2VyxZQUFsQixFQUFnQ3JQLE9BQWhDLENBQVY7O0FBRUEsTUFBR0EsT0FBSDtBQUNDcVAsbUJBQWVqWCxRQUFRbWUsYUFBUixDQUFzQjliLE9BQXRCLENBQWY7QUNBQzs7QURFRndiLHNCQUFvQjdkLFFBQVFpRyxhQUFSLENBQXNCZ1IsWUFBdEIsQ0FBcEI7QUFHQTJHLFlBQUF2YixXQUFBLE9BQVVBLFFBQVNFLE1BQW5CLEdBQW1CLE1BQW5COztBQUNBLE1BQUcsQ0FBQ3FiLE9BQUQsSUFBWSxDQUFDQyxpQkFBaEI7QUFDQyxXQUFPLEtBQUtFLEtBQUwsRUFBUDtBQ0ZDOztBRElGRCxxQkFBbUJwYixFQUFFNkgsTUFBRixDQUFTcVQsT0FBVCxFQUFrQixVQUFDaGIsQ0FBRDtBQUNwQyxXQUFPRixFQUFFcVQsVUFBRixDQUFhblQsRUFBRVEsWUFBZixLQUFnQyxDQUFDVixFQUFFaUosT0FBRixDQUFVL0ksRUFBRVEsWUFBWixDQUF4QztBQURrQixJQUFuQjtBQUdBZ1UsU0FBTyxJQUFQO0FBRUFBLE9BQUtnSCxPQUFMOztBQUVBLE1BQUdOLGlCQUFpQm5aLE1BQWpCLEdBQTBCLENBQTdCO0FBQ0MwRSxXQUFPO0FBQ05qRSxZQUFNO0FBQ0wsWUFBQWlaLFVBQUE7QUFBQWpILGFBQUtnSCxPQUFMO0FBQ0FDLHFCQUFhLEVBQWI7O0FBQ0EzYixVQUFFZSxJQUFGLENBQU9mLEVBQUUyTSxJQUFGLENBQU85TSxNQUFQLENBQVAsRUFBdUIsVUFBQ0ssQ0FBRDtBQUN0QixlQUFPLGtCQUFrQnlCLElBQWxCLENBQXVCekIsQ0FBdkIsQ0FBUDtBQ0hPLG1CRElOeWIsV0FBV3piLENBQVgsSUFBZ0IsQ0NKVjtBQUNEO0FEQ1A7O0FBSUEsZUFBT2liLGtCQUFrQnpZLElBQWxCLENBQXVCO0FBQUNoRSxlQUFLO0FBQUMwVixpQkFBS3BDO0FBQU47QUFBTixTQUF2QixFQUEwQztBQUFDblMsa0JBQVE4YjtBQUFULFNBQTFDLENBQVA7QUFSSztBQUFBLEtBQVA7QUFXQWhWLFNBQUtGLFFBQUwsR0FBZ0IsRUFBaEI7QUFFQWtHLFdBQU8zTSxFQUFFMk0sSUFBRixDQUFPOU0sTUFBUCxDQUFQOztBQUVBLFFBQUc4TSxLQUFLMUssTUFBTCxHQUFjLENBQWpCO0FBQ0MwSyxhQUFPM00sRUFBRTJNLElBQUYsQ0FBT3VPLE9BQVAsQ0FBUDtBQ0VFOztBREFIaE0sWUFBUSxFQUFSO0FBRUF2QyxTQUFLMU0sT0FBTCxDQUFhLFVBQUNpSSxHQUFEO0FBQ1osVUFBR3ZJLFFBQVFoQyxNQUFSLENBQWVpZSxXQUFmLENBQTJCMVQsTUFBTSxHQUFqQyxDQUFIO0FBQ0NnSCxnQkFBUUEsTUFBTTVHLE1BQU4sQ0FBYXRJLEVBQUVnSixHQUFGLENBQU1ySixRQUFRaEMsTUFBUixDQUFlaWUsV0FBZixDQUEyQjFULE1BQU0sR0FBakMsQ0FBTixFQUE2QyxVQUFDL0gsQ0FBRDtBQUNqRSxpQkFBTytILE1BQU0sR0FBTixHQUFZL0gsQ0FBbkI7QUFEb0IsVUFBYixDQUFSO0FDR0c7O0FBQ0QsYURESCtPLE1BQU01TyxJQUFOLENBQVc0SCxHQUFYLENDQ0c7QUROSjs7QUFPQWdILFVBQU1qUCxPQUFOLENBQWMsVUFBQ2lJLEdBQUQ7QUFDYixVQUFBMlQsZUFBQTtBQUFBQSx3QkFBa0JYLFFBQVFoVCxHQUFSLENBQWxCOztBQUVBLFVBQUcyVCxvQkFBb0I3YixFQUFFcVQsVUFBRixDQUFhd0ksZ0JBQWdCbmIsWUFBN0IsS0FBOEMsQ0FBQ1YsRUFBRWlKLE9BQUYsQ0FBVTRTLGdCQUFnQm5iLFlBQTFCLENBQW5FLENBQUg7QUNFSyxlRERKaUcsS0FBS0YsUUFBTCxDQUFjbkcsSUFBZCxDQUFtQjtBQUNsQm9DLGdCQUFNLFVBQUNvWixNQUFEO0FBQ0wsZ0JBQUFDLGVBQUEsRUFBQXRULENBQUEsRUFBQS9FLGNBQUEsRUFBQXNZLEdBQUEsRUFBQXRJLEtBQUEsRUFBQXVJLGFBQUEsRUFBQXZiLFlBQUEsRUFBQXdiLG1CQUFBLEVBQUFDLEdBQUE7O0FBQUE7QUFDQ3pILG1CQUFLZ0gsT0FBTDtBQUVBaEksc0JBQVEsRUFBUjs7QUFHQSxrQkFBRyxvQkFBb0IvUixJQUFwQixDQUF5QnVHLEdBQXpCLENBQUg7QUFDQzhULHNCQUFNOVQsSUFBSWlCLE9BQUosQ0FBWSxrQkFBWixFQUFnQyxJQUFoQyxDQUFOO0FBQ0FnVCxzQkFBTWpVLElBQUlpQixPQUFKLENBQVksa0JBQVosRUFBZ0MsSUFBaEMsQ0FBTjtBQUNBOFMsZ0NBQWdCSCxPQUFPRSxHQUFQLEVBQVlJLFdBQVosQ0FBd0JELEdBQXhCLENBQWhCO0FBSEQ7QUFLQ0YsZ0NBQWdCL1QsSUFBSTRMLEtBQUosQ0FBVSxHQUFWLEVBQWV1SSxNQUFmLENBQXNCLFVBQUN0SyxDQUFELEVBQUloSCxDQUFKO0FDQTVCLHlCQUFPZ0gsS0FBSyxJQUFMLEdEQ2ZBLEVBQUdoSCxDQUFILENDRGUsR0RDWixNQ0RLO0FEQU0sbUJBRWQrUSxNQUZjLENBQWhCO0FDRU87O0FERVJwYiw2QkFBZW1iLGdCQUFnQm5iLFlBQS9COztBQUVBLGtCQUFHVixFQUFFcVQsVUFBRixDQUFhM1MsWUFBYixDQUFIO0FBQ0NBLCtCQUFlQSxjQUFmO0FDRE87O0FER1Isa0JBQUdWLEVBQUVpTCxPQUFGLENBQVV2SyxZQUFWLENBQUg7QUFDQyxvQkFBR1YsRUFBRXNjLFFBQUYsQ0FBV0wsYUFBWCxLQUE2QixDQUFDamMsRUFBRWlMLE9BQUYsQ0FBVWdSLGFBQVYsQ0FBakM7QUFDQ3ZiLGlDQUFldWIsY0FBY2xLLENBQTdCO0FBQ0FrSyxrQ0FBZ0JBLGNBQWNqSyxHQUFkLElBQXFCLEVBQXJDO0FBRkQ7QUFJQyx5QkFBTyxFQUFQO0FBTEY7QUNLUTs7QURFUixrQkFBR2hTLEVBQUVpTCxPQUFGLENBQVVnUixhQUFWLENBQUg7QUFDQ3ZJLHNCQUFNaFYsR0FBTixHQUFZO0FBQUMwVix1QkFBSzZIO0FBQU4saUJBQVo7QUFERDtBQUdDdkksc0JBQU1oVixHQUFOLEdBQVl1ZCxhQUFaO0FDRU87O0FEQVJDLG9DQUFzQjVlLFFBQVFJLFNBQVIsQ0FBa0JnRCxZQUFsQixFQUFnQ3dFLE9BQWhDLENBQXRCO0FBRUF4QiwrQkFBaUJ3WSxvQkFBb0J2WSxjQUFyQztBQUVBb1ksZ0NBQWtCO0FBQUNyZCxxQkFBSyxDQUFOO0FBQVMyUyx1QkFBTztBQUFoQixlQUFsQjs7QUFFQSxrQkFBRzNOLGNBQUg7QUFDQ3FZLGdDQUFnQnJZLGNBQWhCLElBQWtDLENBQWxDO0FDRU87O0FEQVIscUJBQU9wRyxRQUFRaUcsYUFBUixDQUFzQjdDLFlBQXRCLEVBQW9Dd0UsT0FBcEMsRUFBNkN4QyxJQUE3QyxDQUFrRGdSLEtBQWxELEVBQXlEO0FBQy9EN1Qsd0JBQVFrYztBQUR1RCxlQUF6RCxDQUFQO0FBekNELHFCQUFBdlMsS0FBQTtBQTRDTWYsa0JBQUFlLEtBQUE7QUFDTEMsc0JBQVFDLEdBQVIsQ0FBWWhKLFlBQVosRUFBMEJvYixNQUExQixFQUFrQ3JULENBQWxDO0FBQ0EscUJBQU8sRUFBUDtBQ0dNO0FEbkRVO0FBQUEsU0FBbkIsQ0NDSTtBQXFERDtBRDFETDs7QUF1REEsV0FBTzlCLElBQVA7QUFuRkQ7QUFxRkMsV0FBTztBQUNOakUsWUFBTTtBQUNMZ1MsYUFBS2dILE9BQUw7QUFDQSxlQUFPUCxrQkFBa0J6WSxJQUFsQixDQUF1QjtBQUFDaEUsZUFBSztBQUFDMFYsaUJBQUtwQztBQUFOO0FBQU4sU0FBdkIsRUFBMEM7QUFBQ25TLGtCQUFRQTtBQUFULFNBQTFDLENBQVA7QUFISztBQUFBLEtBQVA7QUNpQkM7QURsSUgsRzs7Ozs7Ozs7Ozs7O0FFQUEzQyxPQUFPNmQsT0FBUCxDQUFlLGtCQUFmLEVBQW1DLFVBQUN2ZCxXQUFELEVBQWMwSCxPQUFkO0FBQy9CLE1BQUFDLE1BQUE7QUFBQUEsV0FBUyxLQUFLQSxNQUFkO0FBQ0EsU0FBTzdILFFBQVFpRyxhQUFSLENBQXNCLGtCQUF0QixFQUEwQ2IsSUFBMUMsQ0FBK0M7QUFBQ2xGLGlCQUFhQSxXQUFkO0FBQTJCNlQsV0FBT25NLE9BQWxDO0FBQTJDLFdBQU0sQ0FBQztBQUFDbUksYUFBT2xJO0FBQVIsS0FBRCxFQUFrQjtBQUFDb1gsY0FBUTtBQUFULEtBQWxCO0FBQWpELEdBQS9DLENBQVA7QUFGSixHOzs7Ozs7Ozs7Ozs7QUNBQXJmLE9BQU82ZCxPQUFQLENBQWUsdUJBQWYsRUFBd0MsVUFBQ3ZkLFdBQUQ7QUFDcEMsTUFBQTJILE1BQUE7QUFBQUEsV0FBUyxLQUFLQSxNQUFkO0FBQ0EsU0FBTzdILFFBQVFrVixXQUFSLENBQW9CclYsUUFBcEIsQ0FBNkJ1RixJQUE3QixDQUFrQztBQUFDbEYsaUJBQWE7QUFBQzRXLFdBQUs1VztBQUFOLEtBQWQ7QUFBa0NXLGVBQVc7QUFBQ2lXLFdBQUssQ0FBQyxrQkFBRCxFQUFxQixrQkFBckI7QUFBTixLQUE3QztBQUE4Ri9HLFdBQU9sSTtBQUFyRyxHQUFsQyxDQUFQO0FBRkosRzs7Ozs7Ozs7Ozs7O0FDQUFqSSxPQUFPNmQsT0FBUCxDQUFlLHlCQUFmLEVBQTBDLFVBQUN2ZCxXQUFELEVBQWM2QixtQkFBZCxFQUFtQ0Msa0JBQW5DLEVBQXVEbkIsU0FBdkQsRUFBa0UrRyxPQUFsRTtBQUN6QyxNQUFBUCxXQUFBLEVBQUFrRixRQUFBLEVBQUExRSxNQUFBO0FBQUFBLFdBQVMsS0FBS0EsTUFBZDs7QUFDQSxNQUFHOUYsd0JBQXVCLHNCQUExQjtBQUNDd0ssZUFBVztBQUFDLHdCQUFrQjNFO0FBQW5CLEtBQVg7QUFERDtBQUdDMkUsZUFBVztBQUFDd0gsYUFBT25NO0FBQVIsS0FBWDtBQ01DOztBREpGLE1BQUc3Rix3QkFBdUIsV0FBMUI7QUFFQ3dLLGFBQVMsVUFBVCxJQUF1QnJNLFdBQXZCO0FBQ0FxTSxhQUFTLFlBQVQsSUFBeUIsQ0FBQzFMLFNBQUQsQ0FBekI7QUFIRDtBQUtDMEwsYUFBU3ZLLGtCQUFULElBQStCbkIsU0FBL0I7QUNLQzs7QURIRndHLGdCQUFjckgsUUFBUW1PLGNBQVIsQ0FBdUJwTSxtQkFBdkIsRUFBNEM2RixPQUE1QyxFQUFxREMsTUFBckQsQ0FBZDs7QUFDQSxNQUFHLENBQUNSLFlBQVlzVixjQUFiLElBQWdDdFYsWUFBWUMsU0FBL0M7QUFDQ2lGLGFBQVN3RCxLQUFULEdBQWlCbEksTUFBakI7QUNLQzs7QURIRixTQUFPN0gsUUFBUWlHLGFBQVIsQ0FBc0JsRSxtQkFBdEIsRUFBMkNxRCxJQUEzQyxDQUFnRG1ILFFBQWhELENBQVA7QUFsQkQsRzs7Ozs7Ozs7Ozs7O0FFQUEzTSxPQUFPNmQsT0FBUCxDQUFlLGlCQUFmLEVBQWtDLFVBQUM3VixPQUFELEVBQVVDLE1BQVY7QUFDakMsU0FBTzdILFFBQVFpRyxhQUFSLENBQXNCLGFBQXRCLEVBQXFDYixJQUFyQyxDQUEwQztBQUFDMk8sV0FBT25NLE9BQVI7QUFBaUJzWCxVQUFNclg7QUFBdkIsR0FBMUMsQ0FBUDtBQURELEc7Ozs7Ozs7Ozs7OztBQ0NBLElBQUdqSSxPQUFPZ1QsUUFBVjtBQUVDaFQsU0FBTzZkLE9BQVAsQ0FBZSxzQkFBZixFQUF1QyxVQUFDN1YsT0FBRDtBQUV0QyxRQUFBMkUsUUFBQTs7QUFBQSxTQUFPLEtBQUsxRSxNQUFaO0FBQ0MsYUFBTyxLQUFLa1csS0FBTCxFQUFQO0FDREU7O0FER0gsU0FBT25XLE9BQVA7QUFDQyxhQUFPLEtBQUttVyxLQUFMLEVBQVA7QUNERTs7QURHSHhSLGVBQ0M7QUFBQXdILGFBQU9uTSxPQUFQO0FBQ0FnRCxXQUFLO0FBREwsS0FERDtBQUlBLFdBQU9vUyxHQUFHbUMsY0FBSCxDQUFrQi9aLElBQWxCLENBQXVCbUgsUUFBdkIsQ0FBUDtBQVpEO0FDWUEsQzs7Ozs7Ozs7Ozs7O0FDZEQsSUFBRzNNLE9BQU9nVCxRQUFWO0FBRUNoVCxTQUFPNmQsT0FBUCxDQUFlLCtCQUFmLEVBQWdELFVBQUM3VixPQUFEO0FBRS9DLFFBQUEyRSxRQUFBOztBQUFBLFNBQU8sS0FBSzFFLE1BQVo7QUFDQyxhQUFPLEtBQUtrVyxLQUFMLEVBQVA7QUNERTs7QURHSCxTQUFPblcsT0FBUDtBQUNDLGFBQU8sS0FBS21XLEtBQUwsRUFBUDtBQ0RFOztBREdIeFIsZUFDQztBQUFBd0gsYUFBT25NLE9BQVA7QUFDQWdELFdBQUs7QUFETCxLQUREO0FBSUEsV0FBT29TLEdBQUdtQyxjQUFILENBQWtCL1osSUFBbEIsQ0FBdUJtSCxRQUF2QixDQUFQO0FBWkQ7QUNZQSxDOzs7Ozs7Ozs7Ozs7QUNmRCxJQUFHM00sT0FBT2dULFFBQVY7QUFDQ2hULFNBQU82ZCxPQUFQLENBQWUsdUJBQWYsRUFBd0M7QUFDdkMsUUFBQTVWLE1BQUE7QUFBQUEsYUFBUyxLQUFLQSxNQUFkO0FBQ0EsV0FBT21WLEdBQUdLLFdBQUgsQ0FBZWpZLElBQWYsQ0FBb0I7QUFBQzhaLFlBQU1yWCxNQUFQO0FBQWV5VixvQkFBYztBQUE3QixLQUFwQixDQUFQO0FBRkQ7QUNRQSxDOzs7Ozs7Ozs7Ozs7QUNURDhCLG1DQUFtQyxFQUFuQzs7QUFFQUEsaUNBQWlDQyxrQkFBakMsR0FBc0QsVUFBQ0MsT0FBRCxFQUFVQyxPQUFWO0FBRXJELE1BQUFDLElBQUEsRUFBQUMsY0FBQSxFQUFBQyxPQUFBLEVBQUFDLGFBQUEsRUFBQUMsWUFBQSxFQUFBQyxjQUFBLEVBQUFDLGdCQUFBLEVBQUFuTSxRQUFBLEVBQUFvTSxhQUFBLEVBQUFDLGVBQUEsRUFBQUMsaUJBQUE7QUFBQVQsU0FBT1UsNkJBQTZCQyxPQUE3QixDQUFxQ2IsT0FBckMsQ0FBUDtBQUNBM0wsYUFBVzZMLEtBQUt6TCxLQUFoQjtBQUVBMkwsWUFBVSxJQUFJbFQsS0FBSixFQUFWO0FBQ0FtVCxrQkFBZ0IzQyxHQUFHMkMsYUFBSCxDQUFpQnZhLElBQWpCLENBQXNCO0FBQ3JDMk8sV0FBT0osUUFEOEI7QUFDcEJzSixXQUFPc0M7QUFEYSxHQUF0QixFQUNvQjtBQUFFaGQsWUFBUTtBQUFFNmQsZUFBUztBQUFYO0FBQVYsR0FEcEIsRUFDZ0QzSCxLQURoRCxFQUFoQjs7QUFFQS9WLElBQUVlLElBQUYsQ0FBT2tjLGFBQVAsRUFBc0IsVUFBQ1UsR0FBRDtBQUNyQlgsWUFBUTFjLElBQVIsQ0FBYXFkLElBQUlqZixHQUFqQjs7QUFDQSxRQUFHaWYsSUFBSUQsT0FBUDtBQ1FJLGFEUEgxZCxFQUFFZSxJQUFGLENBQU80YyxJQUFJRCxPQUFYLEVBQW9CLFVBQUNFLFNBQUQ7QUNRZixlRFBKWixRQUFRMWMsSUFBUixDQUFhc2QsU0FBYixDQ09JO0FEUkwsUUNPRztBQUdEO0FEYko7O0FBT0FaLFlBQVVoZCxFQUFFbUksSUFBRixDQUFPNlUsT0FBUCxDQUFWO0FBQ0FELG1CQUFpQixJQUFJalQsS0FBSixFQUFqQjs7QUFDQSxNQUFHZ1QsS0FBS2UsS0FBUjtBQUlDLFFBQUdmLEtBQUtlLEtBQUwsQ0FBV1IsYUFBZDtBQUNDQSxzQkFBZ0JQLEtBQUtlLEtBQUwsQ0FBV1IsYUFBM0I7O0FBQ0EsVUFBR0EsY0FBYy9ULFFBQWQsQ0FBdUJ1VCxPQUF2QixDQUFIO0FBQ0NFLHVCQUFlemMsSUFBZixDQUFvQixLQUFwQjtBQUhGO0FDVUc7O0FETEgsUUFBR3djLEtBQUtlLEtBQUwsQ0FBV1gsWUFBZDtBQUNDQSxxQkFBZUosS0FBS2UsS0FBTCxDQUFXWCxZQUExQjs7QUFDQWxkLFFBQUVlLElBQUYsQ0FBT2ljLE9BQVAsRUFBZ0IsVUFBQ2MsTUFBRDtBQUNmLFlBQUdaLGFBQWE1VCxRQUFiLENBQXNCd1UsTUFBdEIsQ0FBSDtBQ09NLGlCRE5MZixlQUFlemMsSUFBZixDQUFvQixLQUFwQixDQ01LO0FBQ0Q7QURUTjtBQ1dFOztBREpILFFBQUd3YyxLQUFLZSxLQUFMLENBQVdOLGlCQUFkO0FBQ0NBLDBCQUFvQlQsS0FBS2UsS0FBTCxDQUFXTixpQkFBL0I7O0FBQ0EsVUFBR0Esa0JBQWtCalUsUUFBbEIsQ0FBMkJ1VCxPQUEzQixDQUFIO0FBQ0NFLHVCQUFlemMsSUFBZixDQUFvQixTQUFwQjtBQUhGO0FDVUc7O0FETEgsUUFBR3djLEtBQUtlLEtBQUwsQ0FBV1QsZ0JBQWQ7QUFDQ0EseUJBQW1CTixLQUFLZSxLQUFMLENBQVdULGdCQUE5Qjs7QUFDQXBkLFFBQUVlLElBQUYsQ0FBT2ljLE9BQVAsRUFBZ0IsVUFBQ2MsTUFBRDtBQUNmLFlBQUdWLGlCQUFpQjlULFFBQWpCLENBQTBCd1UsTUFBMUIsQ0FBSDtBQ09NLGlCRE5MZixlQUFlemMsSUFBZixDQUFvQixTQUFwQixDQ01LO0FBQ0Q7QURUTjtBQ1dFOztBREpILFFBQUd3YyxLQUFLZSxLQUFMLENBQVdQLGVBQWQ7QUFDQ0Esd0JBQWtCUixLQUFLZSxLQUFMLENBQVdQLGVBQTdCOztBQUNBLFVBQUdBLGdCQUFnQmhVLFFBQWhCLENBQXlCdVQsT0FBekIsQ0FBSDtBQUNDRSx1QkFBZXpjLElBQWYsQ0FBb0IsT0FBcEI7QUFIRjtBQ1VHOztBRExILFFBQUd3YyxLQUFLZSxLQUFMLENBQVdWLGNBQWQ7QUFDQ0EsdUJBQWlCTCxLQUFLZSxLQUFMLENBQVdWLGNBQTVCOztBQUNBbmQsUUFBRWUsSUFBRixDQUFPaWMsT0FBUCxFQUFnQixVQUFDYyxNQUFEO0FBQ2YsWUFBR1gsZUFBZTdULFFBQWYsQ0FBd0J3VSxNQUF4QixDQUFIO0FDT00saUJETkxmLGVBQWV6YyxJQUFmLENBQW9CLE9BQXBCLENDTUs7QUFDRDtBRFROO0FBdkNGO0FDbURFOztBRFBGeWMsbUJBQWlCL2MsRUFBRW1JLElBQUYsQ0FBTzRVLGNBQVAsQ0FBakI7QUFDQSxTQUFPQSxjQUFQO0FBOURxRCxDQUF0RCxDOzs7Ozs7Ozs7Ozs7QUVGQSxJQUFBZ0IsS0FBQSxFQUFBQyxlQUFBLEVBQUFDLHFCQUFBLEVBQUFDLFdBQUEsRUFBQUMsVUFBQSxFQUFBQyxhQUFBLEVBQUFDLFlBQUEsRUFBQUMsUUFBQTs7QUFBQVAsUUFBUS9HLFFBQVEsTUFBUixDQUFSO0FBQ0FzSCxXQUFXdEgsUUFBUSxtQkFBUixDQUFYOztBQUVBZ0gsa0JBQWtCLFVBQUNPLGFBQUQ7QUFDakIsU0FBT0QsU0FBUzVnQixTQUFULENBQW1CNmdCLGFBQW5CLEVBQWtDQyxRQUFsQyxFQUFQO0FBRGlCLENBQWxCOztBQUdBUCx3QkFBd0IsVUFBQ00sYUFBRDtBQUN2QixTQUFPRCxTQUFTNWdCLFNBQVQsQ0FBbUI2Z0IsYUFBbkIsRUFBa0M1YSxjQUF6QztBQUR1QixDQUF4Qjs7QUFHQXVhLGNBQWMsVUFBQ0ssYUFBRDtBQUNiLFNBQU9yaEIsT0FBT29XLFNBQVAsQ0FBaUIsVUFBQ2lMLGFBQUQsRUFBZ0JFLEVBQWhCO0FDTXJCLFdETEZILFNBQVM1Z0IsU0FBVCxDQUFtQjZnQixhQUFuQixFQUFrQ0wsV0FBbEMsR0FBZ0RRLElBQWhELENBQXFELFVBQUNDLE9BQUQsRUFBVUMsTUFBVjtBQ01qRCxhRExISCxHQUFHRyxNQUFILEVBQVdELE9BQVgsQ0NLRztBRE5KLE1DS0U7QUROSSxLQUdKSixhQUhJLENBQVA7QUFEYSxDQUFkOztBQU1BSCxnQkFBZ0IsVUFBQ0csYUFBRCxFQUFnQjdLLEtBQWhCO0FBQ2YsU0FBT3hXLE9BQU9vVyxTQUFQLENBQWlCLFVBQUNpTCxhQUFELEVBQWdCN0ssS0FBaEIsRUFBdUIrSyxFQUF2QjtBQ1FyQixXRFBGSCxTQUFTNWdCLFNBQVQsQ0FBbUI2Z0IsYUFBbkIsRUFBa0M3YixJQUFsQyxDQUF1Q2dSLEtBQXZDLEVBQThDZ0wsSUFBOUMsQ0FBbUQsVUFBQ0MsT0FBRCxFQUFVQyxNQUFWO0FBQ2xELFVBQUlELFdBQVdBLFFBQVExYyxNQUFSLEdBQWlCLENBQWhDO0FDUUssZURQSndjLEdBQUdHLE1BQUgsRUFBV0QsUUFBUSxDQUFSLENBQVgsQ0NPSTtBRFJMO0FDVUssZURQSkYsR0FBR0csTUFBSCxFQUFXLElBQVgsQ0NPSTtBQUNEO0FEWkwsTUNPRTtBRFJJLEtBTUpMLGFBTkksRUFNVzdLLEtBTlgsQ0FBUDtBQURlLENBQWhCOztBQVNBeUssYUFBYSxVQUFDSSxhQUFELEVBQWdCN0ssS0FBaEI7QUFDWixTQUFPeFcsT0FBT29XLFNBQVAsQ0FBaUIsVUFBQ2lMLGFBQUQsRUFBZ0I3SyxLQUFoQixFQUF1QitLLEVBQXZCO0FDV3JCLFdEVkZILFNBQVM1Z0IsU0FBVCxDQUFtQjZnQixhQUFuQixFQUFrQzdiLElBQWxDLENBQXVDZ1IsS0FBdkMsRUFBOENnTCxJQUE5QyxDQUFtRCxVQUFDQyxPQUFELEVBQVVDLE1BQVY7QUNXL0MsYURWSEgsR0FBR0csTUFBSCxFQUFXRCxPQUFYLENDVUc7QURYSixNQ1VFO0FEWEksS0FHSkosYUFISSxFQUdXN0ssS0FIWCxDQUFQO0FBRFksQ0FBYjs7QUFNQTJLLGVBQWUsVUFBQ0UsYUFBRCxFQUFnQnRZLEVBQWhCLEVBQW9CVSxJQUFwQjtBQUNkLFNBQU96SixPQUFPb1csU0FBUCxDQUFpQixVQUFDaUwsYUFBRCxFQUFnQnRZLEVBQWhCLEVBQW9CVSxJQUFwQixFQUEwQjhYLEVBQTFCO0FDYXJCLFdEWkZILFNBQVM1Z0IsU0FBVCxDQUFtQjZnQixhQUFuQixFQUFrQ2pOLE1BQWxDLENBQXlDckwsRUFBekMsRUFBNkNVLElBQTdDLEVBQW1EK1gsSUFBbkQsQ0FBd0QsVUFBQ0MsT0FBRCxFQUFVQyxNQUFWO0FDYXBELGFEWkhILEdBQUdHLE1BQUgsRUFBV0QsT0FBWCxDQ1lHO0FEYkosTUNZRTtBRGJJLEtBR0pKLGFBSEksRUFHV3RZLEVBSFgsRUFHZVUsSUFIZixDQUFQO0FBRGMsQ0FBZjs7QUFNQTZXLCtCQUErQixFQUEvQjs7QUFFQUEsNkJBQTZCcUIsbUJBQTdCLEdBQW1ELFVBQUNDLEdBQUQ7QUFDbEQsTUFBQUMsU0FBQSxFQUFBQyxXQUFBLEVBQUF0TCxLQUFBLEVBQUE4SSxJQUFBLEVBQUFyWCxNQUFBO0FBQUF1TyxVQUFRb0wsSUFBSXBMLEtBQVo7QUFDQXZPLFdBQVN1TyxNQUFNLFdBQU4sQ0FBVDtBQUNBcUwsY0FBWXJMLE1BQU0sY0FBTixDQUFaOztBQUVBLE1BQUcsQ0FBSXZPLE1BQUosSUFBYyxDQUFJNFosU0FBckI7QUFDQyxVQUFNLElBQUk3aEIsT0FBT2tXLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsY0FBdEIsQ0FBTjtBQ2VDOztBRGJGNEwsZ0JBQWMzWixTQUFTNFosZUFBVCxDQUF5QkYsU0FBekIsQ0FBZDtBQUNBdkMsU0FBT3RmLE9BQU9xZCxLQUFQLENBQWEvVyxPQUFiLENBQ047QUFBQTlFLFNBQUt5RyxNQUFMO0FBQ0EsK0NBQTJDNlo7QUFEM0MsR0FETSxDQUFQOztBQUlBLE1BQUcsQ0FBSXhDLElBQVA7QUFDQyxVQUFNLElBQUl0ZixPQUFPa1csS0FBWCxDQUFpQixHQUFqQixFQUFzQixjQUF0QixDQUFOO0FDZUM7O0FEYkYsU0FBT29KLElBQVA7QUFoQmtELENBQW5EOztBQWtCQWdCLDZCQUE2QjBCLFFBQTdCLEdBQXdDLFVBQUNqTyxRQUFEO0FBQ3ZDLE1BQUFJLEtBQUE7QUFBQUEsVUFBUS9ULFFBQVFrVixXQUFSLENBQW9CZ0ksTUFBcEIsQ0FBMkJoWCxPQUEzQixDQUFtQ3lOLFFBQW5DLENBQVI7O0FBQ0EsTUFBRyxDQUFJSSxLQUFQO0FBQ0MsVUFBTSxJQUFJblUsT0FBT2tXLEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsd0JBQTNCLENBQU47QUNpQkM7O0FEaEJGLFNBQU8vQixLQUFQO0FBSnVDLENBQXhDOztBQU1BbU0sNkJBQTZCQyxPQUE3QixHQUF1QyxVQUFDYixPQUFEO0FBQ3RDLE1BQUFFLElBQUE7QUFBQUEsU0FBT3hmLFFBQVFrVixXQUFSLENBQW9CMk0sS0FBcEIsQ0FBMEIzYixPQUExQixDQUFrQ29aLE9BQWxDLENBQVA7O0FBQ0EsTUFBRyxDQUFJRSxJQUFQO0FBQ0MsVUFBTSxJQUFJNWYsT0FBT2tXLEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsZUFBM0IsQ0FBTjtBQ29CQzs7QURuQkYsU0FBTzBKLElBQVA7QUFKc0MsQ0FBdkM7O0FBTUFVLDZCQUE2QjRCLFlBQTdCLEdBQTRDLFVBQUNuTyxRQUFELEVBQVc0TCxPQUFYO0FBQzNDLE1BQUF3QyxVQUFBO0FBQUFBLGVBQWEvaEIsUUFBUWtWLFdBQVIsQ0FBb0JtSSxXQUFwQixDQUFnQ25YLE9BQWhDLENBQXdDO0FBQUU2TixXQUFPSixRQUFUO0FBQW1CdUwsVUFBTUs7QUFBekIsR0FBeEMsQ0FBYjs7QUFDQSxNQUFHLENBQUl3QyxVQUFQO0FBQ0MsVUFBTSxJQUFJbmlCLE9BQU9rVyxLQUFYLENBQWlCLFFBQWpCLEVBQTJCLHdCQUEzQixDQUFOO0FDMEJDOztBRHpCRixTQUFPaU0sVUFBUDtBQUoyQyxDQUE1Qzs7QUFNQTdCLDZCQUE2QjhCLG1CQUE3QixHQUFtRCxVQUFDRCxVQUFEO0FBQ2xELE1BQUExRixJQUFBLEVBQUFnRSxHQUFBO0FBQUFoRSxTQUFPLElBQUlyUyxNQUFKLEVBQVA7QUFDQXFTLE9BQUs0RixZQUFMLEdBQW9CRixXQUFXRSxZQUEvQjtBQUNBNUIsUUFBTXJnQixRQUFRa1YsV0FBUixDQUFvQnlLLGFBQXBCLENBQWtDelosT0FBbEMsQ0FBMEM2YixXQUFXRSxZQUFyRCxFQUFtRTtBQUFFMWYsWUFBUTtBQUFFeUIsWUFBTSxDQUFSO0FBQVlrZSxnQkFBVTtBQUF0QjtBQUFWLEdBQW5FLENBQU47QUFDQTdGLE9BQUs4RixpQkFBTCxHQUF5QjlCLElBQUlyYyxJQUE3QjtBQUNBcVksT0FBSytGLHFCQUFMLEdBQTZCL0IsSUFBSTZCLFFBQWpDO0FBQ0EsU0FBTzdGLElBQVA7QUFOa0QsQ0FBbkQ7O0FBUUE2RCw2QkFBNkJtQyxhQUE3QixHQUE2QyxVQUFDN0MsSUFBRDtBQUM1QyxNQUFHQSxLQUFLOEMsS0FBTCxLQUFnQixTQUFuQjtBQUNDLFVBQU0sSUFBSTFpQixPQUFPa1csS0FBWCxDQUFpQixRQUFqQixFQUEyQixZQUEzQixDQUFOO0FDbUNDO0FEckMwQyxDQUE3Qzs7QUFJQW9LLDZCQUE2QnFDLGtCQUE3QixHQUFrRCxVQUFDL0MsSUFBRCxFQUFPN0wsUUFBUDtBQUNqRCxNQUFHNkwsS0FBS3pMLEtBQUwsS0FBZ0JKLFFBQW5CO0FBQ0MsVUFBTSxJQUFJL1QsT0FBT2tXLEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsYUFBM0IsQ0FBTjtBQ3FDQztBRHZDK0MsQ0FBbEQ7O0FBSUFvSyw2QkFBNkJzQyxPQUE3QixHQUF1QyxVQUFDQyxPQUFEO0FBQ3RDLE1BQUFDLElBQUE7QUFBQUEsU0FBTzFpQixRQUFRa1YsV0FBUixDQUFvQnlOLEtBQXBCLENBQTBCemMsT0FBMUIsQ0FBa0N1YyxPQUFsQyxDQUFQOztBQUNBLE1BQUcsQ0FBSUMsSUFBUDtBQUNDLFVBQU0sSUFBSTlpQixPQUFPa1csS0FBWCxDQUFpQixRQUFqQixFQUEyQixpQkFBM0IsQ0FBTjtBQ3dDQzs7QUR0Q0YsU0FBTzRNLElBQVA7QUFMc0MsQ0FBdkM7O0FBT0F4Qyw2QkFBNkIwQyxXQUE3QixHQUEyQyxVQUFDQyxXQUFEO0FBQzFDLFNBQU83aUIsUUFBUWtWLFdBQVIsQ0FBb0I0TixVQUFwQixDQUErQjVjLE9BQS9CLENBQXVDMmMsV0FBdkMsQ0FBUDtBQUQwQyxDQUEzQzs7QUFHQTNDLDZCQUE2QjZDLGtCQUE3QixHQUFrRCxVQUFDN2lCLFdBQUQsRUFBY29mLE9BQWQ7QUFDakQsTUFBQTBELEVBQUEsRUFBQUMsYUFBQTtBQUFBRCxPQUFLaGpCLFFBQVFrVixXQUFSLENBQW9CZ08sZ0JBQXBCLENBQXFDaGQsT0FBckMsQ0FBNkM7QUFDakRoRyxpQkFBYUEsV0FEb0M7QUFFakRvZixhQUFTQTtBQUZ3QyxHQUE3QyxDQUFMOztBQUlBLE1BQUcsQ0FBQzBELEVBQUo7QUFDQyxVQUFNLElBQUlwakIsT0FBT2tXLEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsY0FBM0IsQ0FBTjtBQzJDQzs7QUQxQ0ZtTixrQkFBZ0JELEdBQUdHLGNBQUgsSUFBcUIsTUFBckM7O0FBQ0EsTUFBRyxDQUFDLENBQUMsTUFBRCxFQUFTLFlBQVQsRUFBdUJuWCxRQUF2QixDQUFnQ2lYLGFBQWhDLENBQUo7QUFDQyxVQUFNLElBQUlyakIsT0FBT2tXLEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsV0FBM0IsQ0FBTjtBQzRDQztBRHJEK0MsQ0FBbEQ7O0FBYUFvSyw2QkFBNkJrRCxlQUE3QixHQUErQyxVQUFDQyxvQkFBRCxFQUF1QkMsU0FBdkI7QUFDOUMsTUFBQUMsUUFBQSxFQUFBQyxtQkFBQSxFQUFBQyxRQUFBLEVBQUFqRSxJQUFBLEVBQUFGLE9BQUEsRUFBQW9ELElBQUEsRUFBQWdCLE9BQUEsRUFBQUMsVUFBQSxFQUFBdkosR0FBQSxFQUFBL1MsV0FBQSxFQUFBdWMsaUJBQUEsRUFBQTdQLEtBQUEsRUFBQUosUUFBQSxFQUFBb08sVUFBQSxFQUFBOEIsbUJBQUEsRUFBQUMsVUFBQSxFQUFBQyxpQkFBQSxFQUFBQyxTQUFBLEVBQUF6RSxPQUFBO0FBQUF4SCxRQUFNc0wscUJBQXFCLFdBQXJCLENBQU4sRUFBeUNyRixNQUF6QztBQUNBakcsUUFBTXNMLHFCQUFxQixPQUFyQixDQUFOLEVBQXFDckYsTUFBckM7QUFDQWpHLFFBQU1zTCxxQkFBcUIsTUFBckIsQ0FBTixFQUFvQ3JGLE1BQXBDO0FBQ0FqRyxRQUFNc0wscUJBQXFCLFlBQXJCLENBQU4sRUFBMEMsQ0FBQztBQUFDNU8sT0FBR3VKLE1BQUo7QUFBWXRKLFNBQUssQ0FBQ3NKLE1BQUQ7QUFBakIsR0FBRCxDQUExQztBQUdBa0MsK0JBQTZCNkMsa0JBQTdCLENBQWdETSxxQkFBcUIsWUFBckIsRUFBbUMsQ0FBbkMsRUFBc0M1TyxDQUF0RixFQUF5RjRPLHFCQUFxQixNQUFyQixDQUF6RjtBQUdBbkQsK0JBQTZCK0QsaUJBQTdCLENBQStDWixxQkFBcUIsWUFBckIsRUFBbUMsQ0FBbkMsQ0FBL0MsRUFBc0ZBLHFCQUFxQixPQUFyQixDQUF0RjtBQUVBMVAsYUFBVzBQLHFCQUFxQixPQUFyQixDQUFYO0FBQ0EvRCxZQUFVK0QscUJBQXFCLE1BQXJCLENBQVY7QUFDQTlELFlBQVUrRCxVQUFVbGlCLEdBQXBCO0FBRUEyaUIsc0JBQW9CLElBQXBCO0FBRUFQLHdCQUFzQixJQUF0Qjs7QUFDQSxNQUFHSCxxQkFBcUIsUUFBckIsS0FBbUNBLHFCQUFxQixRQUFyQixFQUErQixDQUEvQixDQUF0QztBQUNDVSx3QkFBb0JWLHFCQUFxQixRQUFyQixFQUErQixDQUEvQixDQUFwQjs7QUFDQSxRQUFHVSxrQkFBa0IsVUFBbEIsS0FBa0NBLGtCQUFrQixVQUFsQixFQUE4QixDQUE5QixDQUFyQztBQUNDUCw0QkFBc0JILHFCQUFxQixRQUFyQixFQUErQixDQUEvQixFQUFrQyxVQUFsQyxFQUE4QyxDQUE5QyxDQUF0QjtBQUhGO0FDK0NFOztBRHpDRnRQLFVBQVFtTSw2QkFBNkIwQixRQUE3QixDQUFzQ2pPLFFBQXRDLENBQVI7QUFFQTZMLFNBQU9VLDZCQUE2QkMsT0FBN0IsQ0FBcUNiLE9BQXJDLENBQVA7QUFFQXlDLGVBQWE3Qiw2QkFBNkI0QixZQUE3QixDQUEwQ25PLFFBQTFDLEVBQW9ENEwsT0FBcEQsQ0FBYjtBQUVBc0Usd0JBQXNCM0QsNkJBQTZCOEIsbUJBQTdCLENBQWlERCxVQUFqRCxDQUF0QjtBQUVBN0IsK0JBQTZCbUMsYUFBN0IsQ0FBMkM3QyxJQUEzQztBQUVBVSwrQkFBNkJxQyxrQkFBN0IsQ0FBZ0QvQyxJQUFoRCxFQUFzRDdMLFFBQXREO0FBRUErTyxTQUFPeEMsNkJBQTZCc0MsT0FBN0IsQ0FBcUNoRCxLQUFLa0QsSUFBMUMsQ0FBUDtBQUVBcmIsZ0JBQWM2YyxrQkFBa0I3RSxrQkFBbEIsQ0FBcUNDLE9BQXJDLEVBQThDQyxPQUE5QyxDQUFkOztBQUVBLE1BQUcsQ0FBSWxZLFlBQVkyRSxRQUFaLENBQXFCLEtBQXJCLENBQVA7QUFDQyxVQUFNLElBQUlwTSxPQUFPa1csS0FBWCxDQUFpQixRQUFqQixFQUEyQixnQkFBM0IsQ0FBTjtBQ21DQzs7QURqQ0ZzRSxRQUFNLElBQUkvRixJQUFKLEVBQU47QUFDQXFQLFlBQVUsRUFBVjtBQUNBQSxVQUFRdGlCLEdBQVIsR0FBY3BCLFFBQVFrVixXQUFSLENBQW9CaVAsU0FBcEIsQ0FBOEIzUCxVQUE5QixFQUFkO0FBQ0FrUCxVQUFRM1AsS0FBUixHQUFnQkosUUFBaEI7QUFDQStQLFVBQVFsRSxJQUFSLEdBQWVGLE9BQWY7QUFDQW9FLFVBQVFVLFlBQVIsR0FBdUI1RSxLQUFLNkUsT0FBTCxDQUFhampCLEdBQXBDO0FBQ0FzaUIsVUFBUWhCLElBQVIsR0FBZWxELEtBQUtrRCxJQUFwQjtBQUNBZ0IsVUFBUVksWUFBUixHQUF1QjlFLEtBQUs2RSxPQUFMLENBQWFDLFlBQXBDO0FBQ0FaLFVBQVExZixJQUFSLEdBQWV3YixLQUFLeGIsSUFBcEI7QUFDQTBmLFVBQVFhLFNBQVIsR0FBb0JoRixPQUFwQjtBQUNBbUUsVUFBUWMsY0FBUixHQUF5QmxCLFVBQVV0ZixJQUFuQztBQUNBMGYsVUFBUWUsU0FBUixHQUF1QnBCLHFCQUFxQixXQUFyQixJQUF1Q0EscUJBQXFCLFdBQXJCLENBQXZDLEdBQThFOUQsT0FBckc7QUFDQW1FLFVBQVFnQixjQUFSLEdBQTRCckIscUJBQXFCLGdCQUFyQixJQUE0Q0EscUJBQXFCLGdCQUFyQixDQUE1QyxHQUF3RkMsVUFBVXRmLElBQTlIO0FBQ0EwZixVQUFRaUIsc0JBQVIsR0FBb0N0QixxQkFBcUIsd0JBQXJCLElBQW9EQSxxQkFBcUIsd0JBQXJCLENBQXBELEdBQXdHdEIsV0FBV0UsWUFBdko7QUFDQXlCLFVBQVFrQiwyQkFBUixHQUF5Q3ZCLHFCQUFxQiw2QkFBckIsSUFBeURBLHFCQUFxQiw2QkFBckIsQ0FBekQsR0FBa0hRLG9CQUFvQjFCLGlCQUEvSztBQUNBdUIsVUFBUW1CLCtCQUFSLEdBQTZDeEIscUJBQXFCLGlDQUFyQixJQUE2REEscUJBQXFCLGlDQUFyQixDQUE3RCxHQUEySFEsb0JBQW9CekIscUJBQTVMO0FBQ0FzQixVQUFRb0IsaUJBQVIsR0FBK0J6QixxQkFBcUIsbUJBQXJCLElBQStDQSxxQkFBcUIsbUJBQXJCLENBQS9DLEdBQThGdEIsV0FBV2dELFVBQXhJO0FBQ0FyQixVQUFRcEIsS0FBUixHQUFnQixPQUFoQjtBQUNBb0IsVUFBUXNCLElBQVIsR0FBZSxFQUFmO0FBQ0F0QixVQUFRdUIsV0FBUixHQUFzQixLQUF0QjtBQUNBdkIsVUFBUXdCLFVBQVIsR0FBcUIsS0FBckI7QUFDQXhCLFVBQVEvTyxPQUFSLEdBQWtCeUYsR0FBbEI7QUFDQXNKLFVBQVE5TyxVQUFSLEdBQXFCMkssT0FBckI7QUFDQW1FLFVBQVF0UCxRQUFSLEdBQW1CZ0csR0FBbkI7QUFDQXNKLFVBQVFwUCxXQUFSLEdBQXNCaUwsT0FBdEI7QUFFQW1FLFVBQVF5QixVQUFSLEdBQXFCOUIscUJBQXFCLFlBQXJCLENBQXJCOztBQUVBLE1BQUd0QixXQUFXZ0QsVUFBZDtBQUNDckIsWUFBUXFCLFVBQVIsR0FBcUJoRCxXQUFXZ0QsVUFBaEM7QUNpQ0M7O0FEOUJGZixjQUFZLEVBQVo7QUFDQUEsWUFBVTVpQixHQUFWLEdBQWdCLElBQUlna0IsTUFBTUMsUUFBVixHQUFxQkMsSUFBckM7QUFDQXRCLFlBQVVsZSxRQUFWLEdBQXFCNGQsUUFBUXRpQixHQUE3QjtBQUNBNGlCLFlBQVV1QixXQUFWLEdBQXdCLEtBQXhCO0FBRUF6QixlQUFhcGhCLEVBQUUwQyxJQUFGLENBQU9vYSxLQUFLNkUsT0FBTCxDQUFhbUIsS0FBcEIsRUFBMkIsVUFBQ0MsSUFBRDtBQUN2QyxXQUFPQSxLQUFLQyxTQUFMLEtBQWtCLE9BQXpCO0FBRFksSUFBYjtBQUdBMUIsWUFBVXlCLElBQVYsR0FBaUIzQixXQUFXMWlCLEdBQTVCO0FBQ0E0aUIsWUFBVWhnQixJQUFWLEdBQWlCOGYsV0FBVzlmLElBQTVCO0FBRUFnZ0IsWUFBVTJCLFVBQVYsR0FBdUJ2TCxHQUF2QjtBQUVBbUosYUFBVyxFQUFYO0FBQ0FBLFdBQVNuaUIsR0FBVCxHQUFlLElBQUlna0IsTUFBTUMsUUFBVixHQUFxQkMsSUFBcEM7QUFDQS9CLFdBQVN6ZCxRQUFULEdBQW9CNGQsUUFBUXRpQixHQUE1QjtBQUNBbWlCLFdBQVNxQyxLQUFULEdBQWlCNUIsVUFBVTVpQixHQUEzQjtBQUNBbWlCLFdBQVNnQyxXQUFULEdBQXVCLEtBQXZCO0FBQ0FoQyxXQUFTckUsSUFBVCxHQUFtQm1FLHFCQUFxQixXQUFyQixJQUF1Q0EscUJBQXFCLFdBQXJCLENBQXZDLEdBQThFOUQsT0FBakc7QUFDQWdFLFdBQVNzQyxTQUFULEdBQXdCeEMscUJBQXFCLGdCQUFyQixJQUE0Q0EscUJBQXFCLGdCQUFyQixDQUE1QyxHQUF3RkMsVUFBVXRmLElBQTFIO0FBQ0F1ZixXQUFTdUMsT0FBVCxHQUFtQnZHLE9BQW5CO0FBQ0FnRSxXQUFTd0MsWUFBVCxHQUF3QnpDLFVBQVV0ZixJQUFsQztBQUNBdWYsV0FBU3lDLG9CQUFULEdBQWdDakUsV0FBV0UsWUFBM0M7QUFDQXNCLFdBQVMwQyx5QkFBVCxHQUFxQ3BDLG9CQUFvQjdmLElBQXpEO0FBQ0F1ZixXQUFTMkMsNkJBQVQsR0FBeUNyQyxvQkFBb0IzQixRQUE3RDtBQUNBcUIsV0FBU3hnQixJQUFULEdBQWdCLE9BQWhCO0FBQ0F3Z0IsV0FBU29DLFVBQVQsR0FBc0J2TCxHQUF0QjtBQUNBbUosV0FBUzRDLFNBQVQsR0FBcUIvTCxHQUFyQjtBQUNBbUosV0FBUzZDLE9BQVQsR0FBbUIsSUFBbkI7QUFDQTdDLFdBQVM4QyxRQUFULEdBQW9CLEtBQXBCO0FBQ0E5QyxXQUFTK0MsV0FBVCxHQUF1QixFQUF2QjtBQUNBMUMsc0JBQW9CLEVBQXBCO0FBQ0FMLFdBQVNyVSxNQUFULEdBQWtCZ1IsNkJBQTZCcUcsY0FBN0IsQ0FBNEM3QyxRQUFReUIsVUFBUixDQUFtQixDQUFuQixDQUE1QyxFQUFtRTdGLE9BQW5FLEVBQTRFM0wsUUFBNUUsRUFBc0YrTyxLQUFLMkIsT0FBTCxDQUFhOWhCLE1BQW5HLEVBQTJHcWhCLGlCQUEzRyxDQUFsQjtBQUVBSSxZQUFVd0MsUUFBVixHQUFxQixDQUFDakQsUUFBRCxDQUFyQjtBQUNBRyxVQUFRK0MsTUFBUixHQUFpQixDQUFDekMsU0FBRCxDQUFqQjtBQUVBTixVQUFReFUsTUFBUixHQUFpQnFVLFNBQVNyVSxNQUExQjtBQUVBd1UsVUFBUWdELFdBQVIsR0FBc0JyRCxxQkFBcUJxRCxXQUFyQixJQUFvQyxFQUExRDtBQUVBaEQsVUFBUWlELGlCQUFSLEdBQTRCN0MsV0FBVzlmLElBQXZDOztBQUVBLE1BQUd3YixLQUFLb0gsV0FBTCxLQUFvQixJQUF2QjtBQUNDbEQsWUFBUWtELFdBQVIsR0FBc0IsSUFBdEI7QUN3QkM7O0FEckJGbEQsVUFBUW1ELFNBQVIsR0FBb0JySCxLQUFLeGIsSUFBekI7O0FBQ0EsTUFBRzBlLEtBQUtlLFFBQVI7QUFDQ0EsZUFBV3ZELDZCQUE2QjBDLFdBQTdCLENBQXlDRixLQUFLZSxRQUE5QyxDQUFYOztBQUNBLFFBQUdBLFFBQUg7QUFDQ0MsY0FBUW9ELGFBQVIsR0FBd0JyRCxTQUFTemYsSUFBakM7QUFDQTBmLGNBQVFELFFBQVIsR0FBbUJBLFNBQVNyaUIsR0FBNUI7QUFKRjtBQzRCRTs7QUR0QkZ1aUIsZUFBYTNqQixRQUFRa1YsV0FBUixDQUFvQmlQLFNBQXBCLENBQThCNVAsTUFBOUIsQ0FBcUNtUCxPQUFyQyxDQUFiO0FBRUF4RCwrQkFBNkI2RywwQkFBN0IsQ0FBd0RyRCxRQUFReUIsVUFBUixDQUFtQixDQUFuQixDQUF4RCxFQUErRXhCLFVBQS9FLEVBQTJGaFEsUUFBM0Y7QUFJQXVNLCtCQUE2QjhHLGNBQTdCLENBQTRDdEQsUUFBUXlCLFVBQVIsQ0FBbUIsQ0FBbkIsQ0FBNUMsRUFBbUV4UixRQUFuRSxFQUE2RStQLFFBQVF0aUIsR0FBckYsRUFBMEZtaUIsU0FBU25pQixHQUFuRztBQUVBLFNBQU91aUIsVUFBUDtBQTFJOEMsQ0FBL0M7O0FBNElBekQsNkJBQTZCcUcsY0FBN0IsR0FBOEMsVUFBQ1UsU0FBRCxFQUFZQyxNQUFaLEVBQW9CdGYsT0FBcEIsRUFBNkJyRixNQUE3QixFQUFxQ3FoQixpQkFBckM7QUFDN0MsTUFBQXVELFVBQUEsRUFBQUMsWUFBQSxFQUFBNUgsSUFBQSxFQUFBa0QsSUFBQSxFQUFBMkUsVUFBQSxFQUFBQyxlQUFBLEVBQUFDLG1CQUFBLEVBQUFDLGtCQUFBLEVBQUFDLFlBQUEsRUFBQUMsaUJBQUEsRUFBQUMscUJBQUEsRUFBQUMsb0JBQUEsRUFBQUMseUJBQUEsRUFBQUMsaUJBQUEsRUFBQUMsa0JBQUEsRUFBQUMsa0JBQUEsRUFBQUMsbUJBQUEsRUFBQXRZLE1BQUEsRUFBQXVZLFVBQUEsRUFBQWxGLEVBQUEsRUFBQXRkLE1BQUEsRUFBQXlpQixRQUFBLEVBQUFob0IsR0FBQSxFQUFBc0MsY0FBQSxFQUFBMmxCLGtCQUFBLEVBQUFDLGVBQUEsRUFBQUMsYUFBQSxFQUFBQyxpQkFBQSxFQUFBclosTUFBQTtBQUFBaVksZUFBYSxFQUFiOztBQUNBemtCLElBQUVlLElBQUYsQ0FBT2xCLE1BQVAsRUFBZSxVQUFDSyxDQUFEO0FBQ2QsUUFBR0EsRUFBRUcsSUFBRixLQUFVLFNBQWI7QUNxQkksYURwQkhMLEVBQUVlLElBQUYsQ0FBT2IsRUFBRUwsTUFBVCxFQUFpQixVQUFDaW1CLEVBQUQ7QUNxQlosZURwQkpyQixXQUFXbmtCLElBQVgsQ0FBZ0J3bEIsR0FBR3hELElBQW5CLENDb0JJO0FEckJMLFFDb0JHO0FEckJKO0FDeUJJLGFEckJIbUMsV0FBV25rQixJQUFYLENBQWdCSixFQUFFb2lCLElBQWxCLENDcUJHO0FBQ0Q7QUQzQko7O0FBT0E5VixXQUFTLEVBQVQ7QUFDQWdaLGVBQWFqQixVQUFVeFMsQ0FBdkI7QUFDQTlFLFdBQVMrUSxnQkFBZ0J3SCxVQUFoQixDQUFUO0FBQ0FDLGFBQVdsQixVQUFVdlMsR0FBVixDQUFjLENBQWQsQ0FBWDtBQUNBc08sT0FBS2hqQixRQUFRa1YsV0FBUixDQUFvQmdPLGdCQUFwQixDQUFxQ2hkLE9BQXJDLENBQTZDO0FBQ2pEaEcsaUJBQWFnb0IsVUFEb0M7QUFFakQ1SSxhQUFTNEg7QUFGd0MsR0FBN0MsQ0FBTDtBQUtBeGhCLFdBQVNvYixjQUFjb0gsVUFBZCxFQUEwQjtBQUFFempCLGFBQVMsQ0FBQyxDQUFDLEtBQUQsRUFBUSxHQUFSLEVBQWEwakIsUUFBYixDQUFEO0FBQVgsR0FBMUIsQ0FBVDtBQUNBM0ksU0FBT3hmLFFBQVFpRyxhQUFSLENBQXNCLE9BQXRCLEVBQStCQyxPQUEvQixDQUF1Q2doQixNQUF2QyxFQUErQztBQUFFM2tCLFlBQVE7QUFBRW1nQixZQUFNO0FBQVI7QUFBVixHQUEvQyxDQUFQOztBQUNBLE1BQUdNLE1BQU90ZCxNQUFWO0FBQ0NnZCxXQUFPMWlCLFFBQVFpRyxhQUFSLENBQXNCLE9BQXRCLEVBQStCQyxPQUEvQixDQUF1Q3NaLEtBQUtrRCxJQUE1QyxDQUFQO0FBQ0EyRSxpQkFBYTNFLEtBQUsyQixPQUFMLENBQWE5aEIsTUFBYixJQUF1QixFQUFwQztBQUNBRSxxQkFBaUJtZSxZQUFZc0gsVUFBWixDQUFqQjtBQUNBRSx5QkFBcUIxbEIsRUFBRTRILEtBQUYsQ0FBUTdILGNBQVIsRUFBd0IsYUFBeEIsQ0FBckI7QUFDQTZrQixzQkFBa0I1a0IsRUFBRTZILE1BQUYsQ0FBUzhjLFVBQVQsRUFBcUIsVUFBQ29CLFNBQUQ7QUFDdEMsYUFBT0EsVUFBVTFsQixJQUFWLEtBQWtCLE9BQXpCO0FBRGlCLE1BQWxCO0FBRUF3a0IsMEJBQXNCN2tCLEVBQUU0SCxLQUFGLENBQVFnZCxlQUFSLEVBQXlCLE1BQXpCLENBQXRCOztBQUVBTyxnQ0FBNkIsVUFBQ2pkLEdBQUQ7QUFDNUIsYUFBT2xJLEVBQUUwQyxJQUFGLENBQU9nakIsa0JBQVAsRUFBNEIsVUFBQ00saUJBQUQ7QUFDbEMsZUFBTzlkLElBQUkrZCxVQUFKLENBQWVELG9CQUFvQixHQUFuQyxDQUFQO0FBRE0sUUFBUDtBQUQ0QixLQUE3Qjs7QUFJQWYsNEJBQXdCLFVBQUMvYyxHQUFEO0FBQ3ZCLGFBQU9sSSxFQUFFMEMsSUFBRixDQUFPbWlCLG1CQUFQLEVBQTZCLFVBQUNxQixrQkFBRDtBQUNuQyxlQUFPaGUsSUFBSStkLFVBQUosQ0FBZUMscUJBQXFCLEdBQXBDLENBQVA7QUFETSxRQUFQO0FBRHVCLEtBQXhCOztBQUlBbEIsd0JBQW9CLFVBQUM5YyxHQUFEO0FBQ25CLGFBQU9sSSxFQUFFMEMsSUFBRixDQUFPa2lCLGVBQVAsRUFBeUIsVUFBQzFrQixDQUFEO0FBQy9CLGVBQU9BLEVBQUVvaUIsSUFBRixLQUFVcGEsR0FBakI7QUFETSxRQUFQO0FBRG1CLEtBQXBCOztBQUlBNmMsbUJBQWUsVUFBQzdjLEdBQUQ7QUFDZCxVQUFBNGQsRUFBQTtBQUFBQSxXQUFLLElBQUw7O0FBQ0E5bEIsUUFBRUMsT0FBRixDQUFVMGtCLFVBQVYsRUFBc0IsVUFBQ3prQixDQUFEO0FBQ3JCLFlBQUc0bEIsRUFBSDtBQUNDO0FDZ0NJOztBRC9CTCxZQUFHNWxCLEVBQUVHLElBQUYsS0FBVSxTQUFiO0FDaUNNLGlCRGhDTHlsQixLQUFLOWxCLEVBQUUwQyxJQUFGLENBQU94QyxFQUFFTCxNQUFULEVBQWtCLFVBQUNzbUIsRUFBRDtBQUN0QixtQkFBT0EsR0FBRzdELElBQUgsS0FBV3BhLEdBQWxCO0FBREksWUNnQ0E7QURqQ04sZUFHSyxJQUFHaEksRUFBRW9pQixJQUFGLEtBQVVwYSxHQUFiO0FDa0NDLGlCRGpDTDRkLEtBQUs1bEIsQ0NpQ0E7QUFDRDtBRHpDTjs7QUFTQSxhQUFPNGxCLEVBQVA7QUFYYyxLQUFmOztBQWFBWiwyQkFBdUIsVUFBQ2tCLFVBQUQsRUFBYUMsWUFBYjtBQUN0QixhQUFPcm1CLEVBQUUwQyxJQUFGLENBQU8wakIsV0FBV3ZtQixNQUFsQixFQUEyQixVQUFDSyxDQUFEO0FBQ2pDLGVBQU9BLEVBQUVvaUIsSUFBRixLQUFVK0QsWUFBakI7QUFETSxRQUFQO0FBRHNCLEtBQXZCOztBQUlBdkIseUJBQXFCLFVBQUMzTixPQUFELEVBQVVsUixFQUFWLEVBQWNxZ0Isb0JBQWQ7QUFFcEIsVUFBQUMsT0FBQSxFQUFBalUsUUFBQSxFQUFBa1UsT0FBQSxFQUFBempCLEdBQUE7O0FBQUFBLFlBQU11YixTQUFTNWdCLFNBQVQsQ0FBbUJ5WixPQUFuQixDQUFOO0FBQ0FxUCxnQkFBVXZJLHNCQUFzQjlHLE9BQXRCLENBQVY7O0FBQ0EsVUFBRyxDQUFDcFUsR0FBSjtBQUNDO0FDb0NHOztBRG5DSixVQUFHL0MsRUFBRVcsUUFBRixDQUFXc0YsRUFBWCxDQUFIO0FBRUNzZ0Isa0JBQVVuSSxjQUFjakgsT0FBZCxFQUF1QjtBQUFFcFYsbUJBQVMsQ0FBQyxDQUFDdWtCLG9CQUFELEVBQXVCLEdBQXZCLEVBQTRCcmdCLEVBQTVCLENBQUQ7QUFBWCxTQUF2QixDQUFWOztBQUNBLFlBQUdzZ0IsT0FBSDtBQUNDQSxrQkFBUSxRQUFSLElBQW9CQSxRQUFRQyxPQUFSLENBQXBCO0FBQ0EsaUJBQU9ELE9BQVA7QUFMRjtBQUFBLGFBTUssSUFBR3ZtQixFQUFFaUwsT0FBRixDQUFVaEYsRUFBVixDQUFIO0FBQ0pxTSxtQkFBVyxFQUFYO0FBRUE2TCxtQkFBV2hILE9BQVgsRUFBb0I7QUFBRXBWLG1CQUFTLENBQUMsQ0FBQ3VrQixvQkFBRCxFQUF1QixJQUF2QixFQUE2QnJnQixFQUE3QixDQUFEO0FBQVgsU0FBcEIsRUFBb0VoRyxPQUFwRSxDQUE0RSxVQUFDc21CLE9BQUQ7QUFDM0VBLGtCQUFRLFFBQVIsSUFBb0JBLFFBQVFDLE9BQVIsQ0FBcEI7QUN3Q0ssaUJEdkNMbFUsU0FBU2hTLElBQVQsQ0FBY2ltQixPQUFkLENDdUNLO0FEekNOOztBQUdBLFlBQUcsQ0FBQ3ZtQixFQUFFaUosT0FBRixDQUFVcUosUUFBVixDQUFKO0FBQ0MsaUJBQU9BLFFBQVA7QUFQRztBQ2lERDtBRDdEZ0IsS0FBckI7O0FBc0JBZ1QseUJBQXFCLFVBQUNuZ0IsTUFBRCxFQUFTRCxPQUFUO0FBQ3BCLFVBQUF1aEIsRUFBQTtBQUFBQSxXQUFLbnBCLFFBQVFpRyxhQUFSLENBQXNCLGFBQXRCLEVBQXFDQyxPQUFyQyxDQUE2QztBQUFFNk4sZUFBT25NLE9BQVQ7QUFBa0JzWCxjQUFNclg7QUFBeEIsT0FBN0MsQ0FBTDtBQUNBc2hCLFNBQUd4Z0IsRUFBSCxHQUFRZCxNQUFSO0FBQ0EsYUFBT3NoQixFQUFQO0FBSG9CLEtBQXJCOztBQUtBbEIsMEJBQXNCLFVBQUNtQixPQUFELEVBQVV4aEIsT0FBVjtBQUNyQixVQUFBeWhCLEdBQUE7QUFBQUEsWUFBTSxFQUFOOztBQUNBLFVBQUczbUIsRUFBRWlMLE9BQUYsQ0FBVXliLE9BQVYsQ0FBSDtBQUNDMW1CLFVBQUVlLElBQUYsQ0FBTzJsQixPQUFQLEVBQWdCLFVBQUN2aEIsTUFBRDtBQUNmLGNBQUFzaEIsRUFBQTtBQUFBQSxlQUFLbkIsbUJBQW1CbmdCLE1BQW5CLEVBQTJCRCxPQUEzQixDQUFMOztBQUNBLGNBQUd1aEIsRUFBSDtBQ2dETyxtQkQvQ05FLElBQUlybUIsSUFBSixDQUFTbW1CLEVBQVQsQ0MrQ007QUFDRDtBRG5EUDtBQ3FERzs7QURqREosYUFBT0UsR0FBUDtBQVBxQixLQUF0Qjs7QUFTQXZCLHdCQUFvQixVQUFDd0IsS0FBRCxFQUFRMWhCLE9BQVI7QUFDbkIsVUFBQXlZLEdBQUE7QUFBQUEsWUFBTXJnQixRQUFRaUcsYUFBUixDQUFzQixlQUF0QixFQUF1Q0MsT0FBdkMsQ0FBK0NvakIsS0FBL0MsRUFBc0Q7QUFBRS9tQixnQkFBUTtBQUFFbkIsZUFBSyxDQUFQO0FBQVU0QyxnQkFBTSxDQUFoQjtBQUFtQmtlLG9CQUFVO0FBQTdCO0FBQVYsT0FBdEQsQ0FBTjtBQUNBN0IsVUFBSTFYLEVBQUosR0FBUzJnQixLQUFUO0FBQ0EsYUFBT2pKLEdBQVA7QUFIbUIsS0FBcEI7O0FBS0EwSCx5QkFBcUIsVUFBQ3dCLE1BQUQsRUFBUzNoQixPQUFUO0FBQ3BCLFVBQUE0aEIsSUFBQTtBQUFBQSxhQUFPLEVBQVA7O0FBQ0EsVUFBRzltQixFQUFFaUwsT0FBRixDQUFVNGIsTUFBVixDQUFIO0FBQ0M3bUIsVUFBRWUsSUFBRixDQUFPOGxCLE1BQVAsRUFBZSxVQUFDRCxLQUFEO0FBQ2QsY0FBQWpKLEdBQUE7QUFBQUEsZ0JBQU15SCxrQkFBa0J3QixLQUFsQixFQUF5QjFoQixPQUF6QixDQUFOOztBQUNBLGNBQUd5WSxHQUFIO0FDNERPLG1CRDNETm1KLEtBQUt4bUIsSUFBTCxDQUFVcWQsR0FBVixDQzJETTtBQUNEO0FEL0RQO0FDaUVHOztBRDdESixhQUFPbUosSUFBUDtBQVBvQixLQUFyQjs7QUFTQW5CLHNCQUFrQixFQUFsQjtBQUNBQyxvQkFBZ0IsRUFBaEI7QUFDQUMsd0JBQW9CLEVBQXBCOztBQytERSxRQUFJLENBQUNwb0IsTUFBTTZpQixHQUFHeUcsU0FBVixLQUF3QixJQUE1QixFQUFrQztBQUNoQ3RwQixVRDlEVXdDLE9DOERWLENEOURrQixVQUFDK21CLEVBQUQ7QUFDckIsWUFBQWpCLFNBQUEsRUFBQUcsa0JBQUEsRUFBQWUsUUFBQSxFQUFBQyxlQUFBLEVBQUFDLGNBQUEsRUFBQUMsa0JBQUEsRUFBQUMsc0JBQUEsRUFBQUMsVUFBQSxFQUFBQyx3QkFBQSxFQUFBQyw0QkFBQSxFQUFBQyxlQUFBLEVBQUFDLFFBQUEsRUFBQWhTLFdBQUEsRUFBQWlTLGVBQUEsRUFBQUMscUJBQUEsRUFBQUMsaUJBQUEsRUFBQUMsWUFBQSxFQUFBQyxlQUFBLEVBQUFDLGNBQUEsRUFBQTFCLG9CQUFBLEVBQUEyQixxQkFBQSxFQUFBQyxxQkFBQSxFQUFBQyxzQkFBQSxFQUFBQyxnQkFBQSxFQUFBQyxvQkFBQSxFQUFBQyxVQUFBLEVBQUFDLGNBQUE7QUFBQVQsdUJBQWVkLEdBQUdjLFlBQWxCO0FBQ0FTLHlCQUFpQnZCLEdBQUd1QixjQUFwQjs7QUFDQSxZQUFHLENBQUNULFlBQUQsSUFBaUIsQ0FBQ1MsY0FBckI7QUFDQyxnQkFBTSxJQUFJcnJCLE9BQU9rVyxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLHFCQUF0QixDQUFOO0FDZ0VLOztBRC9ETitVLGlDQUF5QmhELDBCQUEwQjJDLFlBQTFCLENBQXpCO0FBQ0E1Qiw2QkFBcUJqQixzQkFBc0JzRCxjQUF0QixDQUFyQjtBQUNBYixtQkFBV3phLE9BQU9wTixNQUFQLENBQWNpb0IsWUFBZCxDQUFYO0FBQ0EvQixvQkFBWWhCLGFBQWF3RCxjQUFiLENBQVo7O0FBRUEsWUFBR0osc0JBQUg7QUFFQ2IsdUJBQWFRLGFBQWFoVSxLQUFiLENBQW1CLEdBQW5CLEVBQXdCLENBQXhCLENBQWI7QUFDQTJULDRCQUFrQkssYUFBYWhVLEtBQWIsQ0FBbUIsR0FBbkIsRUFBd0IsQ0FBeEIsQ0FBbEI7QUFDQXVVLGlDQUF1QmYsVUFBdkI7O0FBQ0EsY0FBRyxDQUFDekIsa0JBQWtCd0Msb0JBQWxCLENBQUo7QUFDQ3hDLDhCQUFrQndDLG9CQUFsQixJQUEwQyxFQUExQztBQytETTs7QUQ3RFAsY0FBR25DLGtCQUFIO0FBQ0NvQyx5QkFBYUMsZUFBZXpVLEtBQWYsQ0FBcUIsR0FBckIsRUFBMEIsQ0FBMUIsQ0FBYjtBQUNBK1IsOEJBQWtCd0Msb0JBQWxCLEVBQXdDLGtCQUF4QyxJQUE4REMsVUFBOUQ7QUMrRE07O0FBQ0QsaUJEOUROekMsa0JBQWtCd0Msb0JBQWxCLEVBQXdDWixlQUF4QyxJQUEyRGMsY0M4RHJEO0FEMUVQLGVBY0ssSUFBR0EsZUFBZTNtQixPQUFmLENBQXVCLEdBQXZCLElBQThCLENBQTlCLElBQW9Da21CLGFBQWFsbUIsT0FBYixDQUFxQixLQUFyQixJQUE4QixDQUFyRTtBQUNKMG1CLHVCQUFhQyxlQUFlelUsS0FBZixDQUFxQixHQUFyQixFQUEwQixDQUExQixDQUFiO0FBQ0F3VCx1QkFBYVEsYUFBYWhVLEtBQWIsQ0FBbUIsS0FBbkIsRUFBMEIsQ0FBMUIsQ0FBYjs7QUFDQSxjQUFHOVEsT0FBT3dsQixjQUFQLENBQXNCbEIsVUFBdEIsS0FBc0N0bkIsRUFBRWlMLE9BQUYsQ0FBVWpJLE9BQU9za0IsVUFBUCxDQUFWLENBQXpDO0FBQ0MzQiw0QkFBZ0JybEIsSUFBaEIsQ0FBcUI0SyxLQUFLQyxTQUFMLENBQWU7QUFDbkNzZCx5Q0FBMkJILFVBRFE7QUFFbkNJLHVDQUF5QnBCO0FBRlUsYUFBZixDQUFyQjtBQ2lFTyxtQkQ3RFAxQixjQUFjdGxCLElBQWQsQ0FBbUIwbUIsRUFBbkIsQ0M2RE87QURsRVIsaUJBTUssSUFBR00sV0FBVzFsQixPQUFYLENBQW1CLEdBQW5CLElBQTBCLENBQTdCO0FBQ0o0bEIsMkNBQStCRixXQUFXeFQsS0FBWCxDQUFpQixHQUFqQixFQUFzQixDQUF0QixDQUEvQjtBQUNBbVQsdUJBQVdLLFdBQVd4VCxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLENBQXRCLENBQVg7QUFDQXlULHVDQUEyQnRhLE9BQU9wTixNQUFQLENBQWMybkIsNEJBQWQsQ0FBM0I7O0FBQ0EsZ0JBQUdELDRCQUE0QixDQUFDLFFBQUQsRUFBVyxlQUFYLEVBQTRCamUsUUFBNUIsQ0FBcUNpZSx5QkFBeUJsbkIsSUFBOUQsQ0FBNUIsSUFBbUdMLEVBQUVXLFFBQUYsQ0FBVzRtQix5QkFBeUI3bUIsWUFBcEMsQ0FBdEc7QUFDQyxrQkFBR3NDLE9BQU9za0IsVUFBUCxDQUFIO0FBQ0M7QUM4RFE7O0FEN0RUaEIscUNBQXVCaUIseUJBQXlCb0Isa0JBQXpCLElBQStDLEtBQXRFO0FBQ0FULHNDQUF3QlgseUJBQXlCN21CLFlBQWpEO0FBQ0F1bkIsc0NBQXdCamxCLE9BQU91a0IseUJBQXlCam1CLElBQWhDLENBQXhCO0FBQ0EwbUIsK0JBQWlCbEQsbUJBQW1Cb0QscUJBQW5CLEVBQTBDRCxxQkFBMUMsRUFBaUUzQixvQkFBakUsQ0FBakI7O0FBQ0Esa0JBQUcwQixlQUFlZixRQUFmLENBQUg7QUFDQ2prQix1QkFBT3NrQixVQUFQLElBQXFCVSxlQUFlZixRQUFmLENBQXJCO0FBQ0F0QixnQ0FBZ0JybEIsSUFBaEIsQ0FBcUI0SyxLQUFLQyxTQUFMLENBQWU7QUFDbkNzZCw2Q0FBMkJILFVBRFE7QUFFbkNJLDJDQUF5QnBCO0FBRlUsaUJBQWYsQ0FBckI7QUFJQSx1QkFBTzFCLGNBQWN0bEIsSUFBZCxDQUFtQjBtQixFQUFuQixDQUFQO0FBYkY7QUFKSTtBQVREO0FBQUEsZUE2QkEsSUFBR2MsYUFBYWxtQixPQUFiLENBQXFCLEdBQXJCLElBQTRCLENBQTVCLElBQWtDa21CLGFBQWFsbUIsT0FBYixDQUFxQixLQUFyQixNQUErQixDQUFDLENBQXJFO0FBQ0orbEIsNEJBQWtCRyxhQUFhaFUsS0FBYixDQUFtQixHQUFuQixFQUF3QixDQUF4QixDQUFsQjtBQUNBb1QsNEJBQWtCWSxhQUFhaFUsS0FBYixDQUFtQixHQUFuQixFQUF3QixDQUF4QixDQUFsQjs7QUFDQSxjQUFHN0csTUFBSDtBQUNDeUksMEJBQWN6SSxPQUFPcE4sTUFBUCxDQUFjOG5CLGVBQWQsQ0FBZDs7QUFDQSxnQkFBR2pTLGVBQWVxUSxTQUFmLElBQTRCLENBQUMsUUFBRCxFQUFXLGVBQVgsRUFBNEJ6YyxRQUE1QixDQUFxQ29NLFlBQVlyVixJQUFqRCxDQUE1QixJQUFzRkwsRUFBRVcsUUFBRixDQUFXK1UsWUFBWWhWLFlBQXZCLENBQXpGO0FBSUMwbUIsbUNBQXFCaEosY0FBYzFJLFlBQVloVixZQUExQixFQUF3QztBQUFFcUIseUJBQVMsQ0FBQyxDQUFDLEtBQUQsRUFBUSxHQUFSLEVBQWFpQixPQUFPMmtCLGVBQVAsQ0FBYixDQUFELENBQVg7QUFBb0Q5bkIsd0JBQVEsQ0FBQ3FuQixlQUFEO0FBQTVELGVBQXhDLENBQXJCOztBQUNBLGtCQUFHLENBQUNFLGtCQUFKO0FBQ0M7QUNnRVE7O0FEL0RUUSxzQ0FBd0JsUyxZQUFZaFYsWUFBcEM7QUFDQXltQiwrQkFBaUJuSixnQkFBZ0I0SixxQkFBaEIsQ0FBakI7QUFDQUMsa0NBQW9CVixlQUFldG5CLE1BQWYsQ0FBc0JxbkIsZUFBdEIsQ0FBcEI7QUFDQWUsc0NBQXdCYixtQkFBbUJGLGVBQW5CLENBQXhCOztBQUNBLGtCQUFHVyxxQkFBcUI5QixTQUFyQixJQUFrQ0EsVUFBVTFsQixJQUFWLEtBQWtCLE9BQXBELElBQStELENBQUMsUUFBRCxFQUFXLGVBQVgsRUFBNEJpSixRQUE1QixDQUFxQ3VlLGtCQUFrQnhuQixJQUF2RCxDQUEvRCxJQUErSEwsRUFBRVcsUUFBRixDQUFXa25CLGtCQUFrQm5uQixZQUE3QixDQUFsSTtBQUNDNGxCLHVDQUF1QnVCLGtCQUFrQmMsa0JBQWxCLElBQXdDLEtBQS9EO0FBQ0FULHdDQUF3Qkwsa0JBQWtCbm5CLFlBQTFDO0FBQ0FxbkI7O0FBQ0Esb0JBQUdyUyxZQUFZa1QsUUFBWixJQUF3QjdDLFVBQVU4QyxjQUFyQztBQUNDZCxvQ0FBa0JqRCxtQkFBbUJvRCxxQkFBbkIsRUFBMENELHFCQUExQyxFQUFpRTNCLG9CQUFqRSxDQUFsQjtBQURELHVCQUVLLElBQUcsQ0FBQzVRLFlBQVlrVCxRQUFiLElBQXlCLENBQUM3QyxVQUFVOEMsY0FBdkM7QUFDSmQsb0NBQWtCakQsbUJBQW1Cb0QscUJBQW5CLEVBQTBDRCxxQkFBMUMsRUFBaUUzQixvQkFBakUsQ0FBbEI7QUNpRVM7O0FBQ0QsdUJEakVUOVosT0FBTytiLGNBQVAsSUFBeUJSLGVDaUVoQjtBRHpFVixxQkFTSyxJQUFHRixxQkFBcUI5QixTQUFyQixJQUFrQyxDQUFDLE1BQUQsRUFBUyxPQUFULEVBQWtCemMsUUFBbEIsQ0FBMkJ5YyxVQUFVMWxCLElBQXJDLENBQWxDLElBQWdGLENBQUMsUUFBRCxFQUFXLGVBQVgsRUFBNEJpSixRQUE1QixDQUFxQ3VlLGtCQUFrQnhuQixJQUF2RCxDQUFoRixLQUFpSixDQUFDLE9BQUQsRUFBVSxlQUFWLEVBQTJCaUosUUFBM0IsQ0FBb0N1ZSxrQkFBa0JubkIsWUFBdEQsS0FBd0Usa0JBQWlCbW5CLGtCQUFrQm5uQixZQUFuQyxJQUFtRCxXQUFVbW5CLGtCQUFrQmMsa0JBQXhTLENBQUg7QUFDSixvQkFBRyxDQUFDM29CLEVBQUVpSixPQUFGLENBQVVnZixxQkFBVixDQUFKO0FBQ0NaOztBQUNBLHNCQUFHdEIsVUFBVTFsQixJQUFWLEtBQWtCLE1BQXJCO0FBQ0Msd0JBQUd3bkIsa0JBQWtCZSxRQUFsQixJQUE4QjdDLFVBQVU4QyxjQUEzQztBQUNDeEIsK0NBQXlCOUIsb0JBQW9CMEMscUJBQXBCLEVBQTJDL2lCLE9BQTNDLENBQXpCO0FBREQsMkJBRUssSUFBRyxDQUFDMmlCLGtCQUFrQmUsUUFBbkIsSUFBK0IsQ0FBQzdDLFVBQVU4QyxjQUE3QztBQUNKeEIsK0NBQXlCL0IsbUJBQW1CMkMscUJBQW5CLEVBQTBDL2lCLE9BQTFDLENBQXpCO0FBSkY7QUFBQSx5QkFLSyxJQUFHNmdCLFVBQVUxbEIsSUFBVixLQUFrQixPQUFyQjtBQUNKLHdCQUFHd25CLGtCQUFrQmUsUUFBbEIsSUFBOEI3QyxVQUFVOEMsY0FBM0M7QUFDQ3hCLCtDQUF5QmhDLG1CQUFtQjRDLHFCQUFuQixFQUEwQy9pQixPQUExQyxDQUF6QjtBQURELDJCQUVLLElBQUcsQ0FBQzJpQixrQkFBa0JlLFFBQW5CLElBQStCLENBQUM3QyxVQUFVOEMsY0FBN0M7QUFDSnhCLCtDQUF5QmpDLGtCQUFrQjZDLHFCQUFsQixFQUF5Qy9pQixPQUF6QyxDQUF6QjtBQUpHO0FDd0VNOztBRG5FWCxzQkFBR21pQixzQkFBSDtBQ3FFWSwyQkRwRVg3YSxPQUFPK2IsY0FBUCxJQUF5QmxCLHNCQ29FZDtBRGpGYjtBQURJO0FBQUE7QUNzRkssdUJEdEVUN2EsT0FBTytiLGNBQVAsSUFBeUJuQixtQkFBbUJGLGVBQW5CLENDc0VoQjtBRDFHWDtBQUZEO0FBSEk7QUFBQSxlQTRDQSxJQUFHbkIsYUFBYTJCLFFBQWIsSUFBeUIzQixVQUFVMWxCLElBQVYsS0FBa0IsT0FBM0MsSUFBc0QsQ0FBQyxRQUFELEVBQVcsZUFBWCxFQUE0QmlKLFFBQTVCLENBQXFDb2UsU0FBU3JuQixJQUE5QyxDQUF0RCxJQUE2R0wsRUFBRVcsUUFBRixDQUFXK21CLFNBQVNobkIsWUFBcEIsQ0FBaEg7QUFDSjRsQixpQ0FBdUJvQixTQUFTaUIsa0JBQVQsSUFBK0IsS0FBdEQ7QUFDQVQsa0NBQXdCUixTQUFTaG5CLFlBQWpDO0FBQ0F1bkIsa0NBQXdCamxCLE9BQU8wa0IsU0FBU3BtQixJQUFoQixDQUF4QjtBQUNBeW1COztBQUNBLGNBQUdMLFNBQVNrQixRQUFULElBQXFCN0MsVUFBVThDLGNBQWxDO0FBQ0NkLDhCQUFrQmpELG1CQUFtQm9ELHFCQUFuQixFQUEwQ0QscUJBQTFDLEVBQWlFM0Isb0JBQWpFLENBQWxCO0FBREQsaUJBRUssSUFBRyxDQUFDb0IsU0FBU2tCLFFBQVYsSUFBc0IsQ0FBQzdDLFVBQVU4QyxjQUFwQztBQUNKZCw4QkFBa0JqRCxtQkFBbUJvRCxxQkFBbkIsRUFBMENELHFCQUExQyxFQUFpRTNCLG9CQUFqRSxDQUFsQjtBQ3dFTTs7QUFDRCxpQkR4RU45WixPQUFPK2IsY0FBUCxJQUF5QlIsZUN3RW5CO0FEakZGLGVBVUEsSUFBR2hDLGFBQWEyQixRQUFiLElBQXlCLENBQUMsTUFBRCxFQUFTLE9BQVQsRUFBa0JwZSxRQUFsQixDQUEyQnljLFVBQVUxbEIsSUFBckMsQ0FBekIsSUFBdUUsQ0FBQyxRQUFELEVBQVcsZUFBWCxFQUE0QmlKLFFBQTVCLENBQXFDb2UsU0FBU3JuQixJQUE5QyxDQUF2RSxLQUErSCxDQUFDLE9BQUQsRUFBVSxlQUFWLEVBQTJCaUosUUFBM0IsQ0FBb0NvZSxTQUFTaG5CLFlBQTdDLEtBQStELGtCQUFpQmduQixTQUFTaG5CLFlBQTFCLElBQTBDLFdBQVVnbkIsU0FBU2lCLGtCQUEzUCxDQUFIO0FBQ0pWLGtDQUF3QmpsQixPQUFPMGtCLFNBQVNwbUIsSUFBaEIsQ0FBeEI7O0FBQ0EsY0FBRyxDQUFDdEIsRUFBRWlKLE9BQUYsQ0FBVWdmLHFCQUFWLENBQUo7QUFDQ0c7O0FBQ0EsZ0JBQUdyQyxVQUFVMWxCLElBQVYsS0FBa0IsTUFBckI7QUFDQyxrQkFBR3FuQixTQUFTa0IsUUFBVCxJQUFxQjdDLFVBQVU4QyxjQUFsQztBQUNDVCxtQ0FBbUI3QyxvQkFBb0IwQyxxQkFBcEIsRUFBMkMvaUIsT0FBM0MsQ0FBbkI7QUFERCxxQkFFSyxJQUFHLENBQUN3aUIsU0FBU2tCLFFBQVYsSUFBc0IsQ0FBQzdDLFVBQVU4QyxjQUFwQztBQUNKVCxtQ0FBbUI5QyxtQkFBbUIyQyxxQkFBbkIsRUFBMEMvaUIsT0FBMUMsQ0FBbkI7QUFKRjtBQUFBLG1CQUtLLElBQUc2Z0IsVUFBVTFsQixJQUFWLEtBQWtCLE9BQXJCO0FBQ0osa0JBQUdxbkIsU0FBU2tCLFFBQVQsSUFBcUI3QyxVQUFVOEMsY0FBbEM7QUFDQ1QsbUNBQW1CL0MsbUJBQW1CNEMscUJBQW5CLEVBQTBDL2lCLE9BQTFDLENBQW5CO0FBREQscUJBRUssSUFBRyxDQUFDd2lCLFNBQVNrQixRQUFWLElBQXNCLENBQUM3QyxVQUFVOEMsY0FBcEM7QUFDSlQsbUNBQW1CaEQsa0JBQWtCNkMscUJBQWxCLEVBQXlDL2lCLE9BQXpDLENBQW5CO0FBSkc7QUMrRUc7O0FEMUVSLGdCQUFHa2pCLGdCQUFIO0FDNEVTLHFCRDNFUjViLE9BQU8rYixjQUFQLElBQXlCSCxnQkMyRWpCO0FEeEZWO0FBRkk7QUFBQSxlQWdCQSxJQUFHcGxCLE9BQU93bEIsY0FBUCxDQUFzQlYsWUFBdEIsQ0FBSDtBQzhFRSxpQkQ3RU50YixPQUFPK2IsY0FBUCxJQUF5QnZsQixPQUFPOGtCLFlBQVAsQ0M2RW5CO0FBQ0Q7QUQxTVAsT0M4REk7QUE4SUQ7O0FEN0VIOW5CLE1BQUVtSSxJQUFGLENBQU93ZCxlQUFQLEVBQXdCMWxCLE9BQXhCLENBQWdDLFVBQUM2b0IsR0FBRDtBQUMvQixVQUFBQyxDQUFBO0FBQUFBLFVBQUk3ZCxLQUFLOGQsS0FBTCxDQUFXRixHQUFYLENBQUo7QUFDQXRjLGFBQU91YyxFQUFFTix5QkFBVCxJQUFzQyxFQUF0QztBQ2dGRyxhRC9FSHpsQixPQUFPK2xCLEVBQUVMLHVCQUFULEVBQWtDem9CLE9BQWxDLENBQTBDLFVBQUNncEIsRUFBRDtBQUN6QyxZQUFBQyxLQUFBO0FBQUFBLGdCQUFRLEVBQVI7O0FBQ0FscEIsVUFBRWUsSUFBRixDQUFPa29CLEVBQVAsRUFBVyxVQUFDanNCLENBQUQsRUFBSW1ELENBQUo7QUNpRkwsaUJEaEZMeWxCLGNBQWMzbEIsT0FBZCxDQUFzQixVQUFDa3BCLEdBQUQ7QUFDckIsZ0JBQUFDLE9BQUE7O0FBQUEsZ0JBQUdELElBQUlyQixZQUFKLEtBQXFCaUIsRUFBRUwsdUJBQUYsR0FBNEIsS0FBNUIsR0FBb0N2b0IsQ0FBNUQ7QUFDQ2lwQix3QkFBVUQsSUFBSVosY0FBSixDQUFtQnpVLEtBQW5CLENBQXlCLEdBQXpCLEVBQThCLENBQTlCLENBQVY7QUNrRk8scUJEakZQb1YsTUFBTUUsT0FBTixJQUFpQnBzQixDQ2lGVjtBQUNEO0FEckZSLFlDZ0ZLO0FEakZOOztBQUtBLFlBQUcsQ0FBSWdELEVBQUVpSixPQUFGLENBQVVpZ0IsS0FBVixDQUFQO0FDcUZNLGlCRHBGTDFjLE9BQU91YyxFQUFFTix5QkFBVCxFQUFvQ25vQixJQUFwQyxDQUF5QzRvQixLQUF6QyxDQ29GSztBQUNEO0FEN0ZOLFFDK0VHO0FEbEZKOztBQWNBbHBCLE1BQUVlLElBQUYsQ0FBTzhrQixpQkFBUCxFQUEyQixVQUFDN2MsR0FBRCxFQUFNZCxHQUFOO0FBQzFCLFVBQUFtaEIsY0FBQSxFQUFBalEsaUJBQUEsRUFBQWtRLFlBQUEsRUFBQUMsZ0JBQUEsRUFBQXJvQixhQUFBLEVBQUE4SyxpQkFBQSxFQUFBd2QsY0FBQSxFQUFBQyxpQkFBQSxFQUFBNWYsUUFBQSxFQUFBNmYsU0FBQSxFQUFBQyxXQUFBO0FBQUFELGtCQUFZMWdCLElBQUk0Z0IsZ0JBQWhCO0FBQ0FQLHVCQUFpQnJFLGtCQUFrQjBFLFNBQWxCLENBQWpCOztBQUNBLFVBQUcsQ0FBQ0EsU0FBSjtBQ3VGSyxlRHRGSmpnQixRQUFRb2dCLElBQVIsQ0FBYSxzQkFBc0IzaEIsR0FBdEIsR0FBNEIsZ0NBQXpDLENDc0ZJO0FEdkZMO0FBR0M4RCw0QkFBb0I5RCxHQUFwQjtBQUNBeWhCLHNCQUFjLEVBQWQ7QUFDQUYsNEJBQW9CLEVBQXBCO0FBQ0F2b0Isd0JBQWdCOGMsZ0JBQWdCaFMsaUJBQWhCLENBQWhCO0FBQ0FzZCx1QkFBZXRwQixFQUFFMEMsSUFBRixDQUFPeEIsY0FBY3JCLE1BQXJCLEVBQTZCLFVBQUNLLENBQUQ7QUFDM0MsaUJBQU8sQ0FBQyxRQUFELEVBQVcsZUFBWCxFQUE0Qm9KLFFBQTVCLENBQXFDcEosRUFBRUcsSUFBdkMsS0FBZ0RILEVBQUVRLFlBQUYsS0FBa0I4a0IsVUFBekU7QUFEYyxVQUFmO0FBR0ErRCwyQkFBbUJELGFBQWFob0IsSUFBaEM7QUFFQXVJLG1CQUFXLEVBQVg7QUFDQUEsaUJBQVMwZixnQkFBVCxJQUE2QjlELFFBQTdCO0FBQ0FyTSw0QkFBb0I5YixRQUFRaUcsYUFBUixDQUFzQnlJLGlCQUF0QixFQUF5QzlHLE9BQXpDLENBQXBCO0FBQ0Fza0IseUJBQWlCcFEsa0JBQWtCMVcsSUFBbEIsQ0FBdUJtSCxRQUF2QixDQUFqQjtBQUVBMmYsdUJBQWV2cEIsT0FBZixDQUF1QixVQUFDNnBCLEVBQUQ7QUFDdEIsY0FBQUMsY0FBQTtBQUFBQSwyQkFBaUIsRUFBakI7O0FBQ0EvcEIsWUFBRWUsSUFBRixDQUFPaUksR0FBUCxFQUFZLFVBQUNnaEIsUUFBRCxFQUFXQyxRQUFYO0FBQ1gsZ0JBQUFsRSxTQUFBLEVBQUFtRSxZQUFBLEVBQUE1RCxvQkFBQSxFQUFBMkIscUJBQUEsRUFBQUMscUJBQUEsRUFBQWlDLGtCQUFBLEVBQUFDLGVBQUE7O0FBQUEsZ0JBQUdILGFBQVksa0JBQWY7QUFDQ0c7QUFDQUY7O0FBQ0Esa0JBQUdGLFNBQVMvRCxVQUFULENBQW9CeUQsWUFBWSxHQUFoQyxDQUFIO0FBQ0NRLCtCQUFnQkYsU0FBU2xXLEtBQVQsQ0FBZSxHQUFmLEVBQW9CLENBQXBCLENBQWhCO0FBREQ7QUFHQ29XLCtCQUFlRixRQUFmO0FDdUZPOztBRHJGUmpFLDBCQUFZYixxQkFBcUJtRSxjQUFyQixFQUFxQ2EsWUFBckMsQ0FBWjtBQUNBQyxtQ0FBcUJqcEIsY0FBY3JCLE1BQWQsQ0FBcUJvcUIsUUFBckIsQ0FBckI7O0FBQ0Esa0JBQUcsQ0FBQ2xFLFNBQUQsSUFBYyxDQUFDb0Usa0JBQWxCO0FBQ0M7QUN1Rk87O0FEdEZSLGtCQUFHcEUsVUFBVTFsQixJQUFWLEtBQWtCLE9BQWxCLElBQTZCLENBQUMsUUFBRCxFQUFXLGVBQVgsRUFBNEJpSixRQUE1QixDQUFxQzZnQixtQkFBbUI5cEIsSUFBeEQsQ0FBN0IsSUFBOEZMLEVBQUVXLFFBQUYsQ0FBV3dwQixtQkFBbUJ6cEIsWUFBOUIsQ0FBakc7QUFDQzRsQix1Q0FBdUI2RCxtQkFBbUJ4QixrQkFBbkIsSUFBeUMsS0FBaEU7QUFDQVQsd0NBQXdCaUMsbUJBQW1CenBCLFlBQTNDO0FBQ0F1bkIsd0NBQXdCNkIsR0FBR0csUUFBSCxDQUF4Qjs7QUFDQSxvQkFBR0UsbUJBQW1CdkIsUUFBbkIsSUFBK0I3QyxVQUFVOEMsY0FBNUM7QUFDQ3VCLG9DQUFrQnRGLG1CQUFtQm9ELHFCQUFuQixFQUEwQ0QscUJBQTFDLEVBQWlFM0Isb0JBQWpFLENBQWxCO0FBREQsdUJBRUssSUFBRyxDQUFDNkQsbUJBQW1CdkIsUUFBcEIsSUFBZ0MsQ0FBQzdDLFVBQVU4QyxjQUE5QztBQUNKdUIsb0NBQWtCdEYsbUJBQW1Cb0QscUJBQW5CLEVBQTBDRCxxQkFBMUMsRUFBaUUzQixvQkFBakUsQ0FBbEI7QUFQRjtBQUFBLHFCQVFLLElBQUcsQ0FBQyxNQUFELEVBQVMsT0FBVCxFQUFrQmhkLFFBQWxCLENBQTJCeWMsVUFBVTFsQixJQUFyQyxLQUE4QyxDQUFDLFFBQUQsRUFBVyxlQUFYLEVBQTRCaUosUUFBNUIsQ0FBcUM2Z0IsbUJBQW1COXBCLElBQXhELENBQTlDLElBQStHLENBQUMsT0FBRCxFQUFVLGVBQVYsRUFBMkJpSixRQUEzQixDQUFvQzZnQixtQkFBbUJ6cEIsWUFBdkQsQ0FBbEg7QUFDSnVuQix3Q0FBd0I2QixHQUFHRyxRQUFILENBQXhCOztBQUNBLG9CQUFHLENBQUNqcUIsRUFBRWlKLE9BQUYsQ0FBVWdmLHFCQUFWLENBQUo7QUFDQyxzQkFBR2xDLFVBQVUxbEIsSUFBVixLQUFrQixNQUFyQjtBQUNDLHdCQUFHOHBCLG1CQUFtQnZCLFFBQW5CLElBQStCN0MsVUFBVThDLGNBQTVDO0FBQ0N1Qix3Q0FBa0I3RSxvQkFBb0IwQyxxQkFBcEIsRUFBMkMvaUIsT0FBM0MsQ0FBbEI7QUFERCwyQkFFSyxJQUFHLENBQUNpbEIsbUJBQW1CdkIsUUFBcEIsSUFBZ0MsQ0FBQzdDLFVBQVU4QyxjQUE5QztBQUNKdUIsd0NBQWtCOUUsbUJBQW1CMkMscUJBQW5CLEVBQTBDL2lCLE9BQTFDLENBQWxCO0FBSkY7QUFBQSx5QkFLSyxJQUFHNmdCLFVBQVUxbEIsSUFBVixLQUFrQixPQUFyQjtBQUNKLHdCQUFHOHBCLG1CQUFtQnZCLFFBQW5CLElBQStCN0MsVUFBVThDLGNBQTVDO0FBQ0N1Qix3Q0FBa0IvRSxtQkFBbUI0QyxxQkFBbkIsRUFBMEMvaUIsT0FBMUMsQ0FBbEI7QUFERCwyQkFFSyxJQUFHLENBQUNpbEIsbUJBQW1CdkIsUUFBcEIsSUFBZ0MsQ0FBQzdDLFVBQVU4QyxjQUE5QztBQUNKdUIsd0NBQWtCaEYsa0JBQWtCNkMscUJBQWxCLEVBQXlDL2lCLE9BQXpDLENBQWxCO0FBSkc7QUFOTjtBQUZJO0FBQUE7QUFjSmtsQixrQ0FBa0JOLEdBQUdHLFFBQUgsQ0FBbEI7QUM2Rk87O0FBQ0QscUJEN0ZQRixlQUFlRyxZQUFmLElBQStCRSxlQzZGeEI7QUFDRDtBRGxJUjs7QUFxQ0EsY0FBRyxDQUFDcHFCLEVBQUVpSixPQUFGLENBQVU4Z0IsY0FBVixDQUFKO0FBQ0NBLDJCQUFlcnJCLEdBQWYsR0FBcUJvckIsR0FBR3ByQixHQUF4QjtBQUNBaXJCLHdCQUFZcnBCLElBQVosQ0FBaUJ5cEIsY0FBakI7QUNnR00sbUJEL0ZOTixrQkFBa0JucEIsSUFBbEIsQ0FBdUI7QUFBRStwQixzQkFBUTtBQUFFM3JCLHFCQUFLb3JCLEdBQUdwckIsR0FBVjtBQUFlNHJCLHVCQUFPWjtBQUF0QjtBQUFWLGFBQXZCLENDK0ZNO0FBTUQ7QUQvSVA7QUE0Q0FsZCxlQUFPa2QsU0FBUCxJQUFvQkMsV0FBcEI7QUNzR0ksZURyR0p6SSxrQkFBa0JsVixpQkFBbEIsSUFBdUN5ZCxpQkNxR25DO0FBQ0Q7QUR2S0w7O0FBb0VBLFFBQUduSixHQUFHaUssZ0JBQU47QUFDQ3ZxQixRQUFFd3FCLE1BQUYsQ0FBU2hlLE1BQVQsRUFBaUJnUiw2QkFBNkJpTixrQkFBN0IsQ0FBZ0RuSyxHQUFHaUssZ0JBQW5ELEVBQXFFL0UsVUFBckUsRUFBaUZ0Z0IsT0FBakYsRUFBMEZ1Z0IsUUFBMUYsQ0FBakI7QUE5U0Y7QUNxWkU7O0FEcEdGZixpQkFBZSxFQUFmOztBQUNBMWtCLElBQUVlLElBQUYsQ0FBT2YsRUFBRTJNLElBQUYsQ0FBT0gsTUFBUCxDQUFQLEVBQXVCLFVBQUNyTSxDQUFEO0FBQ3RCLFFBQUdza0IsV0FBV25iLFFBQVgsQ0FBb0JuSixDQUFwQixDQUFIO0FDc0dJLGFEckdIdWtCLGFBQWF2a0IsQ0FBYixJQUFrQnFNLE9BQU9yTSxDQUFQLENDcUdmO0FBQ0Q7QUR4R0o7O0FBSUEsU0FBT3VrQixZQUFQO0FBMVU2QyxDQUE5Qzs7QUE0VUFsSCw2QkFBNkJpTixrQkFBN0IsR0FBa0QsVUFBQ0YsZ0JBQUQsRUFBbUIvRSxVQUFuQixFQUErQnRnQixPQUEvQixFQUF3Q3dsQixRQUF4QztBQUVqRCxNQUFBQyxJQUFBLEVBQUEzbkIsTUFBQSxFQUFBNG5CLE1BQUEsRUFBQXBlLE1BQUE7QUFBQXhKLFdBQVNvYixjQUFjb0gsVUFBZCxFQUEwQjtBQUFFempCLGFBQVMsQ0FBQyxDQUFDLEtBQUQsRUFBUSxHQUFSLEVBQWEyb0IsUUFBYixDQUFEO0FBQVgsR0FBMUIsQ0FBVDtBQUNBRSxXQUFTLDBDQUEwQ0wsZ0JBQTFDLEdBQTZELElBQXRFO0FBQ0FJLFNBQU81TSxNQUFNNk0sTUFBTixFQUFjLGtCQUFkLENBQVA7QUFDQXBlLFdBQVNtZSxLQUFLM25CLE1BQUwsQ0FBVDs7QUFDQSxNQUFHaEQsRUFBRXNjLFFBQUYsQ0FBVzlQLE1BQVgsQ0FBSDtBQUNDLFdBQU9BLE1BQVA7QUFERDtBQUdDL0MsWUFBUUQsS0FBUixDQUFjLGlDQUFkO0FDMEdDOztBRHpHRixTQUFPLEVBQVA7QUFWaUQsQ0FBbEQ7O0FBY0FnVSw2QkFBNkI4RyxjQUE3QixHQUE4QyxVQUFDQyxTQUFELEVBQVlyZixPQUFaLEVBQXFCMmxCLEtBQXJCLEVBQTRCQyxTQUE1QjtBQUU3Q3h0QixVQUFRa1YsV0FBUixDQUFvQixXQUFwQixFQUFpQzlQLElBQWpDLENBQXNDO0FBQ3JDMk8sV0FBT25NLE9BRDhCO0FBRXJDNFcsWUFBUXlJO0FBRjZCLEdBQXRDLEVBR0d0a0IsT0FISCxDQUdXLFVBQUM4cUIsRUFBRDtBQ3lHUixXRHhHRi9xQixFQUFFZSxJQUFGLENBQU9ncUIsR0FBR0MsUUFBVixFQUFvQixVQUFDQyxTQUFELEVBQVlDLEdBQVo7QUFDbkIsVUFBQWhyQixDQUFBLEVBQUFpckIsT0FBQTtBQUFBanJCLFVBQUk1QyxRQUFRa1YsV0FBUixDQUFvQixzQkFBcEIsRUFBNENoUCxPQUE1QyxDQUFvRHluQixTQUFwRCxDQUFKO0FBQ0FFLGdCQUFVLElBQUlDLEdBQUdDLElBQVAsRUFBVjtBQzBHRyxhRHhHSEYsUUFBUUcsVUFBUixDQUFtQnByQixFQUFFcXJCLGdCQUFGLENBQW1CLE9BQW5CLENBQW5CLEVBQWdEO0FBQzlDbHJCLGNBQU1ILEVBQUVzckIsUUFBRixDQUFXbnJCO0FBRDZCLE9BQWhELEVBRUcsVUFBQzhTLEdBQUQ7QUFDRixZQUFBc1ksUUFBQTs7QUFBQSxZQUFJdFksR0FBSjtBQUNDLGdCQUFNLElBQUlqVyxPQUFPa1csS0FBWCxDQUFpQkQsSUFBSTNKLEtBQXJCLEVBQTRCMkosSUFBSXVZLE1BQWhDLENBQU47QUMwR0k7O0FEeEdMUCxnQkFBUTdwQixJQUFSLENBQWFwQixFQUFFb0IsSUFBRixFQUFiO0FBQ0E2cEIsZ0JBQVFRLElBQVIsQ0FBYXpyQixFQUFFeXJCLElBQUYsRUFBYjtBQUNBRixtQkFBVztBQUNWcGUsaUJBQU9uTixFQUFFdXJCLFFBQUYsQ0FBV3BlLEtBRFI7QUFFVnVlLHNCQUFZMXJCLEVBQUV1ckIsUUFBRixDQUFXRyxVQUZiO0FBR1Z2YSxpQkFBT25NLE9BSEc7QUFJVjlCLG9CQUFVeW5CLEtBSkE7QUFLVmdCLG1CQUFTZixTQUxDO0FBTVZoUCxrQkFBUWlQLEdBQUdyc0I7QUFORCxTQUFYOztBQVNBLFlBQUd3c0IsUUFBTyxDQUFWO0FBQ0NPLG1CQUFTOUosT0FBVCxHQUFtQixJQUFuQjtBQ3lHSTs7QUR2R0x3SixnQkFBUU0sUUFBUixHQUFtQkEsUUFBbkI7QUN5R0ksZUR4R0pydUIsSUFBSXFrQixTQUFKLENBQWM1UCxNQUFkLENBQXFCc1osT0FBckIsQ0N3R0k7QUQ3SEwsUUN3R0c7QUQ1R0osTUN3R0U7QUQ1R0g7QUFGNkMsQ0FBOUM7O0FBbUNBM04sNkJBQTZCNkcsMEJBQTdCLEdBQTBELFVBQUNFLFNBQUQsRUFBWXNHLEtBQVosRUFBbUIzbEIsT0FBbkI7QUFnQnpEbVosZUFBYWtHLFVBQVV4UyxDQUF2QixFQUEwQndTLFVBQVV2UyxHQUFWLENBQWMsQ0FBZCxDQUExQixFQUE0QztBQUMzQ3lQLGVBQVcsQ0FBQztBQUNYL2lCLFdBQUttc0IsS0FETTtBQUVYakwsYUFBTztBQUZJLEtBQUQsQ0FEZ0M7QUFLM0NrTSxZQUFRLElBTG1DO0FBTTNDQyxvQkFBZ0I7QUFOMkIsR0FBNUM7QUFoQnlELENBQTFEOztBQTRCQXZPLDZCQUE2QndPLGlDQUE3QixHQUFpRSxVQUFDOUssaUJBQUQsRUFBb0IySixLQUFwQixFQUEyQjNsQixPQUEzQjtBQUNoRWxGLElBQUVlLElBQUYsQ0FBT21nQixpQkFBUCxFQUEwQixVQUFDK0ssVUFBRCxFQUFhamdCLGlCQUFiO0FBQ3pCLFFBQUFvTixpQkFBQTtBQUFBQSx3QkFBb0I5YixRQUFRaUcsYUFBUixDQUFzQnlJLGlCQUF0QixFQUF5QzlHLE9BQXpDLENBQXBCO0FDNkZFLFdENUZGbEYsRUFBRWUsSUFBRixDQUFPa3JCLFVBQVAsRUFBbUIsVUFBQy9lLElBQUQ7QUM2RmYsYUQ1RkhrTSxrQkFBa0JsRSxNQUFsQixDQUF5QjVELE1BQXpCLENBQWdDcEUsS0FBS21kLE1BQUwsQ0FBWTNyQixHQUE1QyxFQUFpRDtBQUNoRCtTLGNBQU07QUFDTGdRLHFCQUFXLENBQUM7QUFDWC9pQixpQkFBS21zQixLQURNO0FBRVhqTCxtQkFBTztBQUZJLFdBQUQsQ0FETjtBQUtMeUssa0JBQVFuZCxLQUFLbWQ7QUFMUjtBQUQwQyxPQUFqRCxDQzRGRztBRDdGSixNQzRGRTtBRDlGSDtBQURnRSxDQUFqRTs7QUFnQkE3TSw2QkFBNkIrRCxpQkFBN0IsR0FBaUQsVUFBQ2dELFNBQUQsRUFBWXJmLE9BQVo7QUFJaEQsTUFBQWxDLE1BQUE7QUFBQUEsV0FBU29iLGNBQWNtRyxVQUFVeFMsQ0FBeEIsRUFBMkI7QUFBRWhRLGFBQVMsQ0FBQyxDQUFDLEtBQUQsRUFBUSxHQUFSLEVBQWF3aUIsVUFBVXZTLEdBQVYsQ0FBYyxDQUFkLENBQWIsQ0FBRCxDQUFYO0FBQTZDblMsWUFBUSxDQUFDLFdBQUQ7QUFBckQsR0FBM0IsQ0FBVDs7QUFFQSxNQUFHbUQsVUFBV0EsT0FBT3llLFNBQWxCLElBQWdDemUsT0FBT3llLFNBQVAsQ0FBaUIsQ0FBakIsRUFBb0I3QixLQUFwQixLQUErQixXQUEvRCxJQUErRXRpQixRQUFRa1YsV0FBUixDQUFvQmlQLFNBQXBCLENBQThCL2UsSUFBOUIsQ0FBbUNNLE9BQU95ZSxTQUFQLENBQWlCLENBQWpCLEVBQW9CL2lCLEdBQXZELEVBQTREOFMsS0FBNUQsS0FBc0UsQ0FBeEo7QUFDQyxVQUFNLElBQUl0VSxPQUFPa1csS0FBWCxDQUFpQixRQUFqQixFQUEyQiwrQkFBM0IsQ0FBTjtBQ2dHQztBRHZHOEMsQ0FBakQsQzs7Ozs7Ozs7Ozs7O0FFdHFCQThZLFdBQVdDLEdBQVgsQ0FBZSxNQUFmLEVBQXVCLDZCQUF2QixFQUFzRCxVQUFDck4sR0FBRCxFQUFNc04sR0FBTixFQUFXQyxJQUFYO0FBQ3JELE1BQUFDLGVBQUEsRUFBQUMsaUJBQUEsRUFBQTlqQixDQUFBLEVBQUErakIsUUFBQSxFQUFBQyxrQkFBQTs7QUFBQTtBQUNDRix3QkFBb0IvTyw2QkFBNkJxQixtQkFBN0IsQ0FBaURDLEdBQWpELENBQXBCO0FBQ0F3TixzQkFBa0JDLGtCQUFrQjd0QixHQUFwQztBQUVBOHRCLGVBQVcxTixJQUFJNE4sSUFBZjtBQUVBRCx5QkFBcUIsSUFBSTNpQixLQUFKLEVBQXJCOztBQUVBOUosTUFBRWUsSUFBRixDQUFPeXJCLFNBQVMsV0FBVCxDQUFQLEVBQThCLFVBQUM3TCxvQkFBRDtBQUM3QixVQUFBZ00sT0FBQSxFQUFBMUwsVUFBQTtBQUFBQSxtQkFBYXpELDZCQUE2QmtELGVBQTdCLENBQTZDQyxvQkFBN0MsRUFBbUU0TCxpQkFBbkUsQ0FBYjtBQUVBSSxnQkFBVXJ2QixRQUFRa1YsV0FBUixDQUFvQmlQLFNBQXBCLENBQThCamUsT0FBOUIsQ0FBc0M7QUFBRTlFLGFBQUt1aUI7QUFBUCxPQUF0QyxFQUEyRDtBQUFFcGhCLGdCQUFRO0FBQUV3UixpQkFBTyxDQUFUO0FBQVl5TCxnQkFBTSxDQUFsQjtBQUFxQjRFLHdCQUFjLENBQW5DO0FBQXNDMUIsZ0JBQU0sQ0FBNUM7QUFBK0M0Qix3QkFBYztBQUE3RDtBQUFWLE9BQTNELENBQVY7QUNTRyxhRFBINkssbUJBQW1CbnNCLElBQW5CLENBQXdCcXNCLE9BQXhCLENDT0c7QURaSjs7QUNjRSxXRFBGVCxXQUFXVSxVQUFYLENBQXNCUixHQUF0QixFQUEyQjtBQUMxQjlKLFlBQU0sR0FEb0I7QUFFMUIzYixZQUFNO0FBQUVrbUIsaUJBQVNKO0FBQVg7QUFGb0IsS0FBM0IsQ0NPRTtBRHRCSCxXQUFBampCLEtBQUE7QUFtQk1mLFFBQUFlLEtBQUE7QUFDTEMsWUFBUUQsS0FBUixDQUFjZixFQUFFcWtCLEtBQWhCO0FDV0UsV0RWRlosV0FBV1UsVUFBWCxDQUFzQlIsR0FBdEIsRUFBMkI7QUFDMUI5SixZQUFNLEdBRG9CO0FBRTFCM2IsWUFBTTtBQUFFb21CLGdCQUFRLENBQUM7QUFBRUMsd0JBQWN2a0IsRUFBRWlqQixNQUFGLElBQVlqakIsRUFBRXdrQjtBQUE5QixTQUFEO0FBQVY7QUFGb0IsS0FBM0IsQ0NVRTtBQVVEO0FEMUNILEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdGNoZWNrTnBtVmVyc2lvbnNcbn0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5jaGVja05wbVZlcnNpb25zKHtcblx0YnVzYm95OiBcIl4wLjIuMTNcIixcblx0XCJ4bWwyanNcIjogXCJeMC40LjE5XCIsXG59LCAnc3RlZWRvczpjcmVhdG9yJyk7XG5cbmlmIChNZXRlb3Iuc2V0dGluZ3MgJiYgTWV0ZW9yLnNldHRpbmdzLmNmcyAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bikge1xuXHRjaGVja05wbVZlcnNpb25zKHtcblx0XHRcImFsaXl1bi1zZGtcIjogXCJeMS4xMS4xMlwiXG5cdH0sICdzdGVlZG9zOmNyZWF0b3InKTtcbn0iLCJcblx0IyBDcmVhdG9yLmluaXRBcHBzKClcblxuXG4jIENyZWF0b3IuaW5pdEFwcHMgPSAoKS0+XG4jIFx0aWYgTWV0ZW9yLmlzU2VydmVyXG4jIFx0XHRfLmVhY2ggQ3JlYXRvci5BcHBzLCAoYXBwLCBhcHBfaWQpLT5cbiMgXHRcdFx0ZGJfYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcbiMgXHRcdFx0aWYgIWRiX2FwcFxuIyBcdFx0XHRcdGFwcC5faWQgPSBhcHBfaWRcbiMgXHRcdFx0XHRkYi5hcHBzLmluc2VydChhcHApXG4jIGVsc2VcbiMgXHRhcHAuX2lkID0gYXBwX2lkXG4jIFx0ZGIuYXBwcy51cGRhdGUoe19pZDogYXBwX2lkfSwgYXBwKVxuXG5DcmVhdG9yLmdldFNjaGVtYSA9IChvYmplY3RfbmFtZSktPlxuXHRyZXR1cm4gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5zY2hlbWFcblxuQ3JlYXRvci5nZXRPYmplY3RIb21lQ29tcG9uZW50ID0gKG9iamVjdF9uYW1lKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHJldHVybiBCdWlsZGVyQ3JlYXRvci5wbHVnaW5Db21wb25lbnRTZWxlY3RvcihCdWlsZGVyQ3JlYXRvci5zdG9yZS5nZXRTdGF0ZSgpLCBcIk9iamVjdEhvbWVcIiwgb2JqZWN0X25hbWUpXG5cbkNyZWF0b3IuZ2V0T2JqZWN0VXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cblx0aWYgIWFwcF9pZFxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXG5cdGxpc3Rfdmlld19pZCA9IGxpc3Rfdmlldz8uX2lkXG5cblx0aWYgcmVjb3JkX2lkXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQpXG5cdGVsc2Vcblx0XHRpZiBDcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQob2JqZWN0X25hbWUpXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lKVxuXHRcdGVsc2Vcblx0XHRcdGlmIGxpc3Rfdmlld19pZFxuXHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZClcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSlcblxuQ3JlYXRvci5nZXRPYmplY3RBYnNvbHV0ZVVybCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIC0+XG5cdGlmICFhcHBfaWRcblx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKVxuXHRsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXc/Ll9pZFxuXG5cdGlmIHJlY29yZF9pZFxuXHRcdHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkX2lkLCB0cnVlKVxuXHRlbHNlXG5cdFx0cmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQsIHRydWUpXG5cbkNyZWF0b3IuZ2V0T2JqZWN0Um91dGVyVXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cblx0aWYgIWFwcF9pZFxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXG5cdGxpc3Rfdmlld19pZCA9IGxpc3Rfdmlldz8uX2lkXG5cblx0aWYgcmVjb3JkX2lkXG5cdFx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkX2lkXG5cdGVsc2Vcblx0XHRyZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWRcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1VybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIC0+XG5cdHVybCA9IENyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpXG5cdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKHVybClcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cblx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkXG5cbkNyZWF0b3IuZ2V0U3dpdGNoTGlzdFVybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIC0+XG5cdGlmIGxpc3Rfdmlld19pZFxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIGxpc3Rfdmlld19pZCArIFwiL2xpc3RcIilcblx0ZWxzZVxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9saXN0L3N3aXRjaFwiKVxuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RVcmwgPSAob2JqZWN0X25hbWUsIGFwcF9pZCwgcmVjb3JkX2lkLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUpIC0+XG5cdGlmIHJlbGF0ZWRfZmllbGRfbmFtZVxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIHJlY29yZF9pZCArIFwiL1wiICsgcmVsYXRlZF9vYmplY3RfbmFtZSArIFwiL2dyaWQ/cmVsYXRlZF9maWVsZF9uYW1lPVwiICsgcmVsYXRlZF9maWVsZF9uYW1lKVxuXHRlbHNlXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgcmVjb3JkX2lkICsgXCIvXCIgKyByZWxhdGVkX29iamVjdF9uYW1lICsgXCIvZ3JpZFwiKVxuXG5DcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyA9IChvYmplY3RfbmFtZSwgaXNfZGVlcCwgaXNfc2tpcF9oaWRlLCBpc19yZWxhdGVkKS0+XG5cdF9vcHRpb25zID0gW11cblx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIF9vcHRpb25zXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0ZmllbGRzID0gX29iamVjdD8uZmllbGRzXG5cdGljb24gPSBfb2JqZWN0Py5pY29uXG5cdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XG5cdFx0aWYgaXNfc2tpcF9oaWRlIGFuZCBmLmhpZGRlblxuXHRcdFx0cmV0dXJuXG5cdFx0aWYgZi50eXBlID09IFwic2VsZWN0XCJcblx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7Zi5sYWJlbCB8fCBrfVwiLCB2YWx1ZTogXCIje2t9XCIsIGljb246IGljb259XG5cdFx0ZWxzZVxuXHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XG5cdGlmIGlzX2RlZXBcblx0XHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxuXHRcdFx0aWYgaXNfc2tpcF9oaWRlIGFuZCBmLmhpZGRlblxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIChmLnR5cGUgPT0gXCJsb29rdXBcIiB8fCBmLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpICYmIGYucmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcoZi5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdCMg5LiN5pSv5oyBZi5yZWZlcmVuY2VfdG/kuLpmdW5jdGlvbueahOaDheWGte+8jOaciemcgOaxguWGjeivtFxuXHRcdFx0XHRyX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGYucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRpZiByX29iamVjdFxuXHRcdFx0XHRcdF8uZm9yRWFjaCByX29iamVjdC5maWVsZHMsIChmMiwgazIpLT5cblx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7Zi5sYWJlbCB8fCBrfT0+I3tmMi5sYWJlbCB8fCBrMn1cIiwgdmFsdWU6IFwiI3trfS4je2syfVwiLCBpY29uOiByX29iamVjdD8uaWNvbn1cblx0aWYgaXNfcmVsYXRlZFxuXHRcdHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSlcblx0XHRfLmVhY2ggcmVsYXRlZE9iamVjdHMsIChfcmVsYXRlZE9iamVjdCk9PlxuXHRcdFx0cmVsYXRlZE9wdGlvbnMgPSBDcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyhfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSlcblx0XHRcdHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSlcblx0XHRcdF8uZWFjaCByZWxhdGVkT3B0aW9ucywgKHJlbGF0ZWRPcHRpb24pLT5cblx0XHRcdFx0aWYgX3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXkgIT0gcmVsYXRlZE9wdGlvbi52YWx1ZVxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7cmVsYXRlZE9iamVjdC5sYWJlbCB8fCByZWxhdGVkT2JqZWN0Lm5hbWV9PT4je3JlbGF0ZWRPcHRpb24ubGFiZWx9XCIsIHZhbHVlOiBcIiN7cmVsYXRlZE9iamVjdC5uYW1lfS4je3JlbGF0ZWRPcHRpb24udmFsdWV9XCIsIGljb246IHJlbGF0ZWRPYmplY3Q/Lmljb259XG5cdHJldHVybiBfb3B0aW9uc1xuXG4jIOe7n+S4gOS4uuWvueixoW9iamVjdF9uYW1l5o+Q5L6b5Y+v55So5LqO6L+H6JmR5Zmo6L+H6JmR5a2X5q61XG5DcmVhdG9yLmdldE9iamVjdEZpbHRlckZpZWxkT3B0aW9ucyA9IChvYmplY3RfbmFtZSktPlxuXHRfb3B0aW9ucyA9IFtdXG5cdHVubGVzcyBvYmplY3RfbmFtZVxuXHRcdHJldHVybiBfb3B0aW9uc1xuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xuXHRwZXJtaXNzaW9uX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKG9iamVjdF9uYW1lKVxuXHRpY29uID0gX29iamVjdD8uaWNvblxuXHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxuXHRcdCMgaGlkZGVuLGdyaWTnrYnnsbvlnovnmoTlrZfmrrXvvIzkuI3pnIDopoHov4fmu6Rcblx0XHRpZiAhXy5pbmNsdWRlKFtcImdyaWRcIixcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJhdmF0YXJcIiwgXCJpbWFnZVwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKSBhbmQgIWYuaGlkZGVuXG5cdFx0XHQjIGZpbHRlcnMuJC5maWVsZOWPimZsb3cuY3VycmVudOetieWtkOWtl+auteS5n+S4jemcgOimgei/h+a7pFxuXHRcdFx0aWYgIS9cXHcrXFwuLy50ZXN0KGspIGFuZCBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTFcblx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XG5cblx0cmV0dXJuIF9vcHRpb25zXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRPcHRpb25zID0gKG9iamVjdF9uYW1lKS0+XG5cdF9vcHRpb25zID0gW11cblx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIF9vcHRpb25zXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0ZmllbGRzID0gX29iamVjdD8uZmllbGRzXG5cdHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpXG5cdGljb24gPSBfb2JqZWN0Py5pY29uXG5cdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XG5cdFx0aWYgIV8uaW5jbHVkZShbXCJncmlkXCIsXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwibWFya2Rvd25cIiwgXCJodG1sXCJdLCBmLnR5cGUpXG5cdFx0XHRpZiAhL1xcdytcXC4vLnRlc3QoaykgYW5kIF8uaW5kZXhPZihwZXJtaXNzaW9uX2ZpZWxkcywgaykgPiAtMVxuXHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogZi5sYWJlbCB8fCBrLCB2YWx1ZTogaywgaWNvbjogaWNvbn1cblx0cmV0dXJuIF9vcHRpb25zXG5cbiMjI1xuZmlsdGVyczog6KaB6L2s5o2i55qEZmlsdGVyc1xuZmllbGRzOiDlr7nosaHlrZfmrrVcbmZpbHRlcl9maWVsZHM6IOm7mOiupOi/h+a7pOWtl+aute+8jOaUr+aMgeWtl+espuS4suaVsOe7hOWSjOWvueixoeaVsOe7hOS4pOenjeagvOW8j++8jOWmgjpbJ2ZpbGVkX25hbWUxJywnZmlsZWRfbmFtZTInXSxbe2ZpZWxkOidmaWxlZF9uYW1lMScscmVxdWlyZWQ6dHJ1ZX1dXG7lpITnkIbpgLvovpE6IOaKimZpbHRlcnPkuK3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25aKe5Yqg5q+P6aG555qEaXNfZGVmYXVsdOOAgWlzX3JlcXVpcmVk5bGe5oCn77yM5LiN5a2Y5Zyo5LqOZmlsdGVyX2ZpZWxkc+eahOi/h+a7pOadoeS7tuWvueW6lOeahOenu+mZpOavj+mhueeahOebuOWFs+WxnuaAp1xu6L+U5Zue57uT5p6cOiDlpITnkIblkI7nmoRmaWx0ZXJzXG4jIyNcbkNyZWF0b3IuZ2V0RmlsdGVyc1dpdGhGaWx0ZXJGaWVsZHMgPSAoZmlsdGVycywgZmllbGRzLCBmaWx0ZXJfZmllbGRzKS0+XG5cdHVubGVzcyBmaWx0ZXJzXG5cdFx0ZmlsdGVycyA9IFtdXG5cdHVubGVzcyBmaWx0ZXJfZmllbGRzXG5cdFx0ZmlsdGVyX2ZpZWxkcyA9IFtdXG5cdGlmIGZpbHRlcl9maWVsZHM/Lmxlbmd0aFxuXHRcdGZpbHRlcl9maWVsZHMuZm9yRWFjaCAobiktPlxuXHRcdFx0aWYgXy5pc1N0cmluZyhuKVxuXHRcdFx0XHRuID0gXG5cdFx0XHRcdFx0ZmllbGQ6IG4sXG5cdFx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlXG5cdFx0XHRpZiBmaWVsZHNbbi5maWVsZF0gYW5kICFfLmZpbmRXaGVyZShmaWx0ZXJzLHtmaWVsZDpuLmZpZWxkfSlcblx0XHRcdFx0ZmlsdGVycy5wdXNoXG5cdFx0XHRcdFx0ZmllbGQ6IG4uZmllbGQsXG5cdFx0XHRcdFx0aXNfZGVmYXVsdDogdHJ1ZSxcblx0XHRcdFx0XHRpc19yZXF1aXJlZDogbi5yZXF1aXJlZFxuXHRmaWx0ZXJzLmZvckVhY2ggKGZpbHRlckl0ZW0pLT5cblx0XHRtYXRjaEZpZWxkID0gZmlsdGVyX2ZpZWxkcy5maW5kIChuKS0+IHJldHVybiBuID09IGZpbHRlckl0ZW0uZmllbGQgb3Igbi5maWVsZCA9PSBmaWx0ZXJJdGVtLmZpZWxkXG5cdFx0aWYgXy5pc1N0cmluZyhtYXRjaEZpZWxkKVxuXHRcdFx0bWF0Y2hGaWVsZCA9IFxuXHRcdFx0XHRmaWVsZDogbWF0Y2hGaWVsZCxcblx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlXG5cdFx0aWYgbWF0Y2hGaWVsZFxuXHRcdFx0ZmlsdGVySXRlbS5pc19kZWZhdWx0ID0gdHJ1ZVxuXHRcdFx0ZmlsdGVySXRlbS5pc19yZXF1aXJlZCA9IG1hdGNoRmllbGQucmVxdWlyZWRcblx0XHRlbHNlXG5cdFx0XHRkZWxldGUgZmlsdGVySXRlbS5pc19kZWZhdWx0XG5cdFx0XHRkZWxldGUgZmlsdGVySXRlbS5pc19yZXF1aXJlZFxuXHRyZXR1cm4gZmlsdGVyc1xuXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpLT5cblxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRpZiAhcmVjb3JkX2lkXG5cdFx0cmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgb2JqZWN0X25hbWUgPT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSAmJiAgcmVjb3JkX2lkID09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpXG5cdFx0XHRpZiBUZW1wbGF0ZS5pbnN0YW5jZSgpPy5yZWNvcmRcblx0XHRcdFx0cmV0dXJuIFRlbXBsYXRlLmluc3RhbmNlKCk/LnJlY29yZD8uZ2V0KClcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKVxuXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdGlmIG9iai5kYXRhYmFzZV9uYW1lID09IFwibWV0ZW9yXCIgfHwgIW9iai5kYXRhYmFzZV9uYW1lXG5cdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSlcblx0XHRpZiBjb2xsZWN0aW9uXG5cdFx0XHRyZWNvcmQgPSBjb2xsZWN0aW9uLmZpbmRPbmUocmVjb3JkX2lkKVxuXHRcdFx0cmV0dXJuIHJlY29yZFxuXHRlbHNlIGlmIG9iamVjdF9uYW1lICYmIHJlY29yZF9pZFxuXHRcdHJldHVybiBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpXG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkTmFtZSA9IChyZWNvcmQsIG9iamVjdF9uYW1lKS0+XG5cdHVubGVzcyByZWNvcmRcblx0XHRyZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpXG5cdGlmIHJlY29yZFxuXHRcdCMg5pi+56S657uE57uH5YiX6KGo5pe277yM54m55q6K5aSE55CGbmFtZV9maWVsZF9rZXnkuLpuYW1l5a2X5q61XG5cdFx0bmFtZV9maWVsZF9rZXkgPSBpZiBvYmplY3RfbmFtZSA9PSBcIm9yZ2FuaXphdGlvbnNcIiB0aGVuIFwibmFtZVwiIGVsc2UgQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5OQU1FX0ZJRUxEX0tFWVxuXHRcdGlmIHJlY29yZCBhbmQgbmFtZV9maWVsZF9rZXlcblx0XHRcdHJldHVybiByZWNvcmQubGFiZWwgfHwgcmVjb3JkW25hbWVfZmllbGRfa2V5XVxuXG5DcmVhdG9yLmdldEFwcCA9IChhcHBfaWQpLT5cblx0aWYgIWFwcF9pZFxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdGFwcCA9IENyZWF0b3IuQXBwc1thcHBfaWRdXG5cdENyZWF0b3IuZGVwcz8uYXBwPy5kZXBlbmQoKVxuXHRyZXR1cm4gYXBwXG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkID0gKGFwcF9pZCktPlxuXHRhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpXG5cdGlmICFhcHBcblx0XHRyZXR1cm5cblx0ZGFzaGJvYXJkID0gbnVsbFxuXHRfLmVhY2ggQ3JlYXRvci5EYXNoYm9hcmRzLCAodiwgayktPlxuXHRcdGlmIHYuYXBwcz8uaW5kZXhPZihhcHAuX2lkKSA+IC0xXG5cdFx0XHRkYXNoYm9hcmQgPSB2O1xuXHRyZXR1cm4gZGFzaGJvYXJkO1xuXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZENvbXBvbmVudCA9IChhcHBfaWQpLT5cblx0YXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKVxuXHRpZiAhYXBwXG5cdFx0cmV0dXJuXG5cdHJldHVybiBCdWlsZGVyQ3JlYXRvci5wbHVnaW5Db21wb25lbnRTZWxlY3RvcihCdWlsZGVyQ3JlYXRvci5zdG9yZS5nZXRTdGF0ZSgpLCBcIkRhc2hib2FyZFwiLCBhcHAuX2lkKTtcblxuQ3JlYXRvci5nZXRBcHBPYmplY3ROYW1lcyA9IChhcHBfaWQpLT5cblx0YXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKVxuXHRpZiAhYXBwXG5cdFx0cmV0dXJuXG5cdGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpXG5cdGFwcE9iamVjdHMgPSBpZiBpc01vYmlsZSB0aGVuIGFwcC5tb2JpbGVfb2JqZWN0cyBlbHNlIGFwcC5vYmplY3RzXG5cdG9iamVjdHMgPSBbXVxuXHRpZiBhcHBcblx0XHRfLmVhY2ggYXBwT2JqZWN0cywgKHYpLT5cblx0XHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KHYpXG5cdFx0XHRpZiBvYmo/LnBlcm1pc3Npb25zLmdldCgpLmFsbG93UmVhZFxuXHRcdFx0XHRvYmplY3RzLnB1c2ggdlxuXHRyZXR1cm4gb2JqZWN0c1xuXG5DcmVhdG9yLmdldFVybFdpdGhUb2tlbiA9ICh1cmwsIGV4cHJlc3Npb25Gb3JtRGF0YSkgLT5cblx0IyDnu5l1cmzml7bmi7zmjqXlvZPliY3nlKjmiLd0b2tlbuebuOWFs+S/oeaBr+eUqOS6jueZu+W9lemqjOivge+8jOaUr+aMgemFjee9ruihqOi+vuW8j1xuXHRwYXJhbXMgPSB7fTtcblx0cGFyYW1zW1wiWC1TcGFjZS1JZFwiXSA9IFN0ZWVkb3Muc3BhY2VJZCgpXG5cdHBhcmFtc1tcIlgtVXNlci1JZFwiXSA9IFN0ZWVkb3MudXNlcklkKCk7XG5cdHBhcmFtc1tcIlgtQ29tcGFueS1JZHNcIl0gPSBTdGVlZG9zLmdldFVzZXJDb21wYW55SWRzKCk7XG5cdHBhcmFtc1tcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG5cdGlmIFN0ZWVkb3MuaXNFeHByZXNzaW9uKHVybClcblx0XHR1cmwgPSBTdGVlZG9zLnBhcnNlU2luZ2xlRXhwcmVzc2lvbih1cmwsIGV4cHJlc3Npb25Gb3JtRGF0YSwgXCIjXCIsIENyZWF0b3IuVVNFUl9DT05URVhUKVxuXHQjIOWklumDqOmTvuaOpeWcsOWdgOS4reWPr+iDveS8muW4puaciSPlj7fvvIzmr5TlpoIvYnVpbGRlci8/cF9pZHM9NjE5MzgzNTQ1YjJlOWE3MmVjMDU1OGIzIy9wYWdlL3B1YmxpYy90ZXN0XG5cdCMg5q2k5pe2dXJs5Lit5bey57uP5ZyoI+WPt+WJjemdouWHuueOsOS6huS4gOS4qj/lj7fvvIzov5nkuKrpl67lj7fkuI3lj6/ku6Xooqvor4bliKvkuLp1cmzlj4LmlbDvvIzlj6rmnIkj5Y+35ZCO6Z2i55qEP+WPt+aJjeW6lOivpeiiq+ivhuWIq+S4unVybOWPguaVsFxuXHRoYXNRdWVyeVN5bWJvbCA9IC8oXFwjLitcXD8pfChcXD9bXiNdKiQpL2cudGVzdCh1cmwpXG5cdGxpbmtTdHIgPSBpZiBoYXNRdWVyeVN5bWJvbCB0aGVuIFwiJlwiIGVsc2UgXCI/XCJcblx0cmV0dXJuIFwiI3t1cmx9I3tsaW5rU3RyfSN7JC5wYXJhbShwYXJhbXMpfVwiXG5cbkNyZWF0b3IuZ2V0QXBwTWVudSA9IChhcHBfaWQsIG1lbnVfaWQpLT5cblx0bWVudXMgPSBDcmVhdG9yLmdldEFwcE1lbnVzKGFwcF9pZClcblx0cmV0dXJuIG1lbnVzICYmIG1lbnVzLmZpbmQgKG1lbnUpLT4gcmV0dXJuIG1lbnUuaWQgPT0gbWVudV9pZFxuXG5DcmVhdG9yLmdldEFwcE1lbnVVcmxGb3JJbnRlcm5ldCA9IChtZW51KS0+XG5cdCMg5b2TdGFic+exu+Wei+S4unVybOaXtu+8jOaMieWklumDqOmTvuaOpeWkhOeQhu+8jOaUr+aMgemFjee9ruihqOi+vuW8j+W5tuWKoOS4iue7n+S4gOeahHVybOWPguaVsFxuXHRyZXR1cm4gQ3JlYXRvci5nZXRVcmxXaXRoVG9rZW4gbWVudS5wYXRoLCBtZW51XG5cbkNyZWF0b3IuZ2V0QXBwTWVudVVybCA9IChtZW51KS0+XG5cdHVybCA9IG1lbnUucGF0aFxuXHRpZiBtZW51LnR5cGUgPT0gXCJ1cmxcIlxuXHRcdGlmIG1lbnUudGFyZ2V0XG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRBcHBNZW51VXJsRm9ySW50ZXJuZXQobWVudSlcblx0XHRlbHNlXG5cdFx0XHQjIOWcqGlmcmFtZeS4reaYvuekunVybOeVjOmdolxuXHRcdFx0cmV0dXJuIFwiL2FwcC8tL3RhYl9pZnJhbWUvI3ttZW51LmlkfVwiXG5cdGVsc2Vcblx0XHRyZXR1cm4gbWVudS5wYXRoXG5cbkNyZWF0b3IuZ2V0QXBwTWVudXMgPSAoYXBwX2lkKS0+XG5cdGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZClcblx0aWYgIWFwcFxuXHRcdHJldHVybiBbXVxuXHRhcHBNZW51cyA9IFNlc3Npb24uZ2V0KFwiYXBwX21lbnVzXCIpO1xuXHR1bmxlc3MgYXBwTWVudXNcblx0XHRyZXR1cm4gW11cblx0Y3VyZW50QXBwTWVudXMgPSBhcHBNZW51cy5maW5kIChtZW51SXRlbSkgLT5cblx0XHRyZXR1cm4gbWVudUl0ZW0uaWQgPT0gYXBwLl9pZFxuXHRpZiBjdXJlbnRBcHBNZW51c1xuXHRcdHJldHVybiBjdXJlbnRBcHBNZW51cy5jaGlsZHJlblxuXG5DcmVhdG9yLmxvYWRBcHBzTWVudXMgPSAoKS0+XG5cdGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpXG5cdGRhdGEgPSB7IH1cblx0aWYgaXNNb2JpbGVcblx0XHRkYXRhLm1vYmlsZSA9IGlzTW9iaWxlXG5cdG9wdGlvbnMgPSB7IFxuXHRcdHR5cGU6ICdnZXQnLCBcblx0XHRkYXRhOiBkYXRhLCBcblx0XHRzdWNjZXNzOiAoZGF0YSktPlxuXHRcdFx0U2Vzc2lvbi5zZXQoXCJhcHBfbWVudXNcIiwgZGF0YSk7XG5cdCB9XG5cdFN0ZWVkb3MuYXV0aFJlcXVlc3QgXCIvc2VydmljZS9hcGkvYXBwcy9tZW51c1wiLCBvcHRpb25zXG5cbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHMgPSAoaW5jbHVkZUFkbWluKS0+XG5cdGNoYW5nZUFwcCA9IENyZWF0b3IuX3N1YkFwcC5nZXQoKTtcblx0QnVpbGRlckNyZWF0b3Iuc3RvcmUuZ2V0U3RhdGUoKS5lbnRpdGllcy5hcHBzID0gT2JqZWN0LmFzc2lnbih7fSwgQnVpbGRlckNyZWF0b3Iuc3RvcmUuZ2V0U3RhdGUoKS5lbnRpdGllcy5hcHBzLCB7YXBwczogY2hhbmdlQXBwfSk7XG5cdHJldHVybiBCdWlsZGVyQ3JlYXRvci52aXNpYmxlQXBwc1NlbGVjdG9yKEJ1aWxkZXJDcmVhdG9yLnN0b3JlLmdldFN0YXRlKCksIGluY2x1ZGVBZG1pbilcblxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwc09iamVjdHMgPSAoKS0+XG5cdGFwcHMgPSBDcmVhdG9yLmdldFZpc2libGVBcHBzKClcblx0dmlzaWJsZU9iamVjdE5hbWVzID0gXy5mbGF0dGVuKF8ucGx1Y2soYXBwcywnb2JqZWN0cycpKVxuXHRvYmplY3RzID0gXy5maWx0ZXIgQ3JlYXRvci5PYmplY3RzLCAob2JqKS0+XG5cdFx0aWYgdmlzaWJsZU9iamVjdE5hbWVzLmluZGV4T2Yob2JqLm5hbWUpIDwgMFxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHRydWVcblx0b2JqZWN0cyA9IG9iamVjdHMuc29ydChDcmVhdG9yLnNvcnRpbmdNZXRob2QuYmluZCh7a2V5OlwibGFiZWxcIn0pKVxuXHRvYmplY3RzID0gXy5wbHVjayhvYmplY3RzLCduYW1lJylcblx0cmV0dXJuIF8udW5pcSBvYmplY3RzXG5cbkNyZWF0b3IuZ2V0QXBwc09iamVjdHMgPSAoKS0+XG5cdG9iamVjdHMgPSBbXVxuXHR0ZW1wT2JqZWN0cyA9IFtdXG5cdF8uZm9yRWFjaCBDcmVhdG9yLkFwcHMsIChhcHApLT5cblx0XHR0ZW1wT2JqZWN0cyA9IF8uZmlsdGVyIGFwcC5vYmplY3RzLCAob2JqKS0+XG5cdFx0XHRyZXR1cm4gIW9iai5oaWRkZW5cblx0XHRvYmplY3RzID0gb2JqZWN0cy5jb25jYXQodGVtcE9iamVjdHMpXG5cdHJldHVybiBfLnVuaXEgb2JqZWN0c1xuXG5DcmVhdG9yLnZhbGlkYXRlRmlsdGVycyA9IChmaWx0ZXJzLCBsb2dpYyktPlxuXHRmaWx0ZXJfaXRlbXMgPSBfLm1hcCBmaWx0ZXJzLCAob2JqKSAtPlxuXHRcdGlmIF8uaXNFbXB0eShvYmopXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gb2JqXG5cdGZpbHRlcl9pdGVtcyA9IF8uY29tcGFjdChmaWx0ZXJfaXRlbXMpXG5cdGVycm9yTXNnID0gXCJcIlxuXHRmaWx0ZXJfbGVuZ3RoID0gZmlsdGVyX2l0ZW1zLmxlbmd0aFxuXHRpZiBsb2dpY1xuXHRcdCMg5qC85byP5YyWZmlsdGVyXG5cdFx0bG9naWMgPSBsb2dpYy5yZXBsYWNlKC9cXG4vZywgXCJcIikucmVwbGFjZSgvXFxzKy9nLCBcIiBcIilcblxuXHRcdCMg5Yik5pat54m55q6K5a2X56ymXG5cdFx0aWYgL1suX1xcLSErXSsvaWcudGVzdChsb2dpYylcblx0XHRcdGVycm9yTXNnID0gXCLlkKvmnInnibnmrorlrZfnrKbjgIJcIlxuXG5cdFx0aWYgIWVycm9yTXNnXG5cdFx0XHRpbmRleCA9IGxvZ2ljLm1hdGNoKC9cXGQrL2lnKVxuXHRcdFx0aWYgIWluZGV4XG5cdFx0XHRcdGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpbmRleC5mb3JFYWNoIChpKS0+XG5cdFx0XHRcdFx0aWYgaSA8IDEgb3IgaSA+IGZpbHRlcl9sZW5ndGhcblx0XHRcdFx0XHRcdGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInmnaHku7blvJXnlKjkuobmnKrlrprkuYnnmoTnrZvpgInlmajvvJoje2l944CCXCJcblxuXHRcdFx0XHRmbGFnID0gMVxuXHRcdFx0XHR3aGlsZSBmbGFnIDw9IGZpbHRlcl9sZW5ndGhcblx0XHRcdFx0XHRpZiAhaW5kZXguaW5jbHVkZXMoXCIje2ZsYWd9XCIpXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCJcblx0XHRcdFx0XHRmbGFnKys7XG5cblx0XHRpZiAhZXJyb3JNc2dcblx0XHRcdCMg5Yik5pat5piv5ZCm5pyJ6Z2e5rOV6Iux5paH5a2X56ymXG5cdFx0XHR3b3JkID0gbG9naWMubWF0Y2goL1thLXpBLVpdKy9pZylcblx0XHRcdGlmIHdvcmRcblx0XHRcdFx0d29yZC5mb3JFYWNoICh3KS0+XG5cdFx0XHRcdFx0aWYgIS9eKGFuZHxvcikkL2lnLnRlc3Qodylcblx0XHRcdFx0XHRcdGVycm9yTXNnID0gXCLmo4Dmn6XmgqjnmoTpq5jnuqfnrZvpgInmnaHku7bkuK3nmoTmi7zlhpnjgIJcIlxuXG5cdFx0aWYgIWVycm9yTXNnXG5cdFx0XHQjIOWIpOaWreagvOW8j+aYr+WQpuato+ehrlxuXHRcdFx0dHJ5XG5cdFx0XHRcdENyZWF0b3IuZXZhbChsb2dpYy5yZXBsYWNlKC9hbmQvaWcsIFwiJiZcIikucmVwbGFjZSgvb3IvaWcsIFwifHxcIikpXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajkuK3lkKvmnInnibnmrorlrZfnrKZcIlxuXG5cdFx0XHRpZiAvKEFORClbXigpXSsoT1IpL2lnLnRlc3QobG9naWMpIHx8ICAvKE9SKVteKCldKyhBTkQpL2lnLnRlc3QobG9naWMpXG5cdFx0XHRcdGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajlv4XpobvlnKjov57nu63mgKfnmoQgQU5EIOWSjCBPUiDooajovr7lvI/liY3lkI7kvb/nlKjmi6zlj7fjgIJcIlxuXHRpZiBlcnJvck1zZ1xuXHRcdGNvbnNvbGUubG9nIFwiZXJyb3JcIiwgZXJyb3JNc2dcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHRvYXN0ci5lcnJvcihlcnJvck1zZylcblx0XHRyZXR1cm4gZmFsc2Vcblx0ZWxzZVxuXHRcdHJldHVybiB0cnVlXG5cbiMgXCI9XCIsIFwiPD5cIiwgXCI+XCIsIFwiPj1cIiwgXCI8XCIsIFwiPD1cIiwgXCJzdGFydHN3aXRoXCIsIFwiY29udGFpbnNcIiwgXCJub3Rjb250YWluc1wiLlxuIyMjXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuIyMjXG5DcmVhdG9yLmZvcm1hdEZpbHRlcnNUb01vbmdvID0gKGZpbHRlcnMsIG9wdGlvbnMpLT5cblx0dW5sZXNzIGZpbHRlcnM/Lmxlbmd0aFxuXHRcdHJldHVyblxuXHQjIOW9k2ZpbHRlcnPkuI3mmK9bQXJyYXld57G75Z6L6ICM5pivW09iamVjdF3nsbvlnovml7bvvIzov5vooYzmoLzlvI/ovazmjaJcblx0dW5sZXNzIGZpbHRlcnNbMF0gaW5zdGFuY2VvZiBBcnJheVxuXHRcdGZpbHRlcnMgPSBfLm1hcCBmaWx0ZXJzLCAob2JqKS0+XG5cdFx0XHRyZXR1cm4gW29iai5maWVsZCwgb2JqLm9wZXJhdGlvbiwgb2JqLnZhbHVlXVxuXHRzZWxlY3RvciA9IFtdXG5cdF8uZWFjaCBmaWx0ZXJzLCAoZmlsdGVyKS0+XG5cdFx0ZmllbGQgPSBmaWx0ZXJbMF1cblx0XHRvcHRpb24gPSBmaWx0ZXJbMV1cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdKVxuXHRcdGVsc2Vcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBudWxsLCBvcHRpb25zKVxuXHRcdHN1Yl9zZWxlY3RvciA9IHt9XG5cdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXSA9IHt9XG5cdFx0aWYgb3B0aW9uID09IFwiPVwiXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGVxXCJdID0gdmFsdWVcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIjw+XCJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbmVcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPlwiXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGd0XCJdID0gdmFsdWVcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIj49XCJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RlXCJdID0gdmFsdWVcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIjxcIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdFwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8PVwiXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGx0ZVwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCJzdGFydHN3aXRoXCJcblx0XHRcdHJlZyA9IG5ldyBSZWdFeHAoXCJeXCIgKyB2YWx1ZSwgXCJpXCIpXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCJjb250YWluc1wiXG5cdFx0XHRyZWcgPSBuZXcgUmVnRXhwKHZhbHVlLCBcImlcIilcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWdcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIm5vdGNvbnRhaW5zXCJcblx0XHRcdHJlZyA9IG5ldyBSZWdFeHAoXCJeKCg/IVwiICsgdmFsdWUgKyBcIikuKSokXCIsIFwiaVwiKVxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZ1xuXHRcdHNlbGVjdG9yLnB1c2ggc3ViX3NlbGVjdG9yXG5cdHJldHVybiBzZWxlY3RvclxuXG5DcmVhdG9yLmlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiA9IChvcGVyYXRpb24pLT5cblx0cmV0dXJuIG9wZXJhdGlvbiA9PSBcImJldHdlZW5cIiBvciAhIUNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKHRydWUpP1tvcGVyYXRpb25dXG5cbiMjI1xub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcblx0ZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuIyMjXG5DcmVhdG9yLmZvcm1hdEZpbHRlcnNUb0RldiA9IChmaWx0ZXJzLCBvYmplY3RfbmFtZSwgb3B0aW9ucyktPlxuXHR1bmxlc3MgZmlsdGVycy5sZW5ndGhcblx0XHRyZXR1cm5cblx0aWYgb3B0aW9ucz8uaXNfbG9naWNfb3Jcblx0XHQjIOWmguaenGlzX2xvZ2ljX29y5Li6dHJ1Ze+8jOS4umZpbHRlcnPnrKzkuIDlsYLlhYPntKDlop7liqBvcumXtOmalFxuXHRcdGxvZ2ljVGVtcEZpbHRlcnMgPSBbXVxuXHRcdGZpbHRlcnMuZm9yRWFjaCAobiktPlxuXHRcdFx0bG9naWNUZW1wRmlsdGVycy5wdXNoKG4pXG5cdFx0XHRsb2dpY1RlbXBGaWx0ZXJzLnB1c2goXCJvclwiKVxuXHRcdGxvZ2ljVGVtcEZpbHRlcnMucG9wKClcblx0XHRmaWx0ZXJzID0gbG9naWNUZW1wRmlsdGVyc1xuXHRzZWxlY3RvciA9IFN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb0RldihmaWx0ZXJzLCBDcmVhdG9yLlVTRVJfQ09OVEVYVClcblx0cmV0dXJuIHNlbGVjdG9yXG5cbiMjI1xub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcbmV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcbiMjI1xuQ3JlYXRvci5mb3JtYXRMb2dpY0ZpbHRlcnNUb0RldiA9IChmaWx0ZXJzLCBmaWx0ZXJfbG9naWMsIG9wdGlvbnMpLT5cblx0Zm9ybWF0X2xvZ2ljID0gZmlsdGVyX2xvZ2ljLnJlcGxhY2UoL1xcKFxccysvaWcsIFwiKFwiKS5yZXBsYWNlKC9cXHMrXFwpL2lnLCBcIilcIikucmVwbGFjZSgvXFwoL2csIFwiW1wiKS5yZXBsYWNlKC9cXCkvZywgXCJdXCIpLnJlcGxhY2UoL1xccysvZywgXCIsXCIpLnJlcGxhY2UoLyhhbmR8b3IpL2lnLCBcIickMSdcIilcblx0Zm9ybWF0X2xvZ2ljID0gZm9ybWF0X2xvZ2ljLnJlcGxhY2UoLyhcXGQpKy9pZywgKHgpLT5cblx0XHRfZiA9IGZpbHRlcnNbeC0xXVxuXHRcdGZpZWxkID0gX2YuZmllbGRcblx0XHRvcHRpb24gPSBfZi5vcGVyYXRpb25cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUpXG5cdFx0ZWxzZVxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShfZi52YWx1ZSwgbnVsbCwgb3B0aW9ucylcblx0XHRzdWJfc2VsZWN0b3IgPSBbXVxuXHRcdGlmIF8uaXNBcnJheSh2YWx1ZSkgPT0gdHJ1ZVxuXHRcdFx0aWYgb3B0aW9uID09IFwiPVwiXG5cdFx0XHRcdF8uZWFjaCB2YWx1ZSwgKHYpLT5cblx0XHRcdFx0XHRzdWJfc2VsZWN0b3IucHVzaCBbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIlxuXHRcdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8PlwiXG5cdFx0XHRcdF8uZWFjaCB2YWx1ZSwgKHYpLT5cblx0XHRcdFx0XHRzdWJfc2VsZWN0b3IucHVzaCBbZmllbGQsIG9wdGlvbiwgdl0sIFwiYW5kXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0Xy5lYWNoIHZhbHVlLCAodiktPlxuXHRcdFx0XHRcdHN1Yl9zZWxlY3Rvci5wdXNoIFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiXG5cdFx0XHRpZiBzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09IFwiYW5kXCIgfHwgc3ViX3NlbGVjdG9yW3N1Yl9zZWxlY3Rvci5sZW5ndGggLSAxXSA9PSBcIm9yXCJcblx0XHRcdFx0c3ViX3NlbGVjdG9yLnBvcCgpXG5cdFx0ZWxzZVxuXHRcdFx0c3ViX3NlbGVjdG9yID0gW2ZpZWxkLCBvcHRpb24sIHZhbHVlXVxuXHRcdGNvbnNvbGUubG9nIFwic3ViX3NlbGVjdG9yXCIsIHN1Yl9zZWxlY3RvclxuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShzdWJfc2VsZWN0b3IpXG5cdClcblx0Zm9ybWF0X2xvZ2ljID0gXCJbI3tmb3JtYXRfbG9naWN9XVwiXG5cdHJldHVybiBDcmVhdG9yLmV2YWwoZm9ybWF0X2xvZ2ljKVxuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdGlmICF1c2VySWRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXG5cdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW11cblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdGlmICFfb2JqZWN0XG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzXG5cbiNcdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhfb2JqZWN0LnJlbGF0ZWRfb2JqZWN0cyxcIm9iamVjdF9uYW1lXCIpXG5cblx0cmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhfb2JqZWN0Ll9jb2xsZWN0aW9uX25hbWUpXG5cblx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cyxcIm9iamVjdF9uYW1lXCIpXG5cdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWVzPy5sZW5ndGggPT0gMFxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lc1xuXG5cdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHR1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzXG5cblx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLmRpZmZlcmVuY2UgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHVucmVsYXRlZF9vYmplY3RzXG5cdHJldHVybiBfLmZpbHRlciByZWxhdGVkX29iamVjdHMsIChyZWxhdGVkX29iamVjdCktPlxuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdC5vYmplY3RfbmFtZVxuXHRcdGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xXG5cdFx0IyByZWxhdGVkX29iamVjdF9uYW1lID0gaWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNmc19maWxlc19maWxlcmVjb3JkXCIgdGhlbiBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIgZWxzZSByZWxhdGVkX29iamVjdF9uYW1lXG5cdFx0YWxsb3dSZWFkID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy5hbGxvd1JlYWRcblx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdGFsbG93UmVhZCA9IGFsbG93UmVhZCAmJiBwZXJtaXNzaW9ucy5hbGxvd1JlYWRGaWxlc1xuXHRcdHJldHVybiBpc0FjdGl2ZSBhbmQgYWxsb3dSZWFkXG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdE5hbWVzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0cmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRyZXR1cm4gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RMaXN0QWN0aW9ucyA9IChyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGFjdGlvbnMgPSBDcmVhdG9yLmdldEFjdGlvbnMocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0YWN0aW9ucyA9IF8uZmlsdGVyIGFjdGlvbnMsIChhY3Rpb24pLT5cblx0XHRpZiBhY3Rpb24ubmFtZSA9PSBcInN0YW5kYXJkX2ZvbGxvd1wiXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRpZiBhY3Rpb24ubmFtZSA9PSBcInN0YW5kYXJkX3F1ZXJ5XCJcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGlmIGFjdGlvbi5vbiA9PSBcImxpc3RcIlxuXHRcdFx0aWYgdHlwZW9mIGFjdGlvbi52aXNpYmxlID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRyZXR1cm4gYWN0aW9uLnZpc2libGUoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gYWN0aW9uLnZpc2libGVcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0cmV0dXJuIGFjdGlvbnNcblxuQ3JlYXRvci5nZXRBY3Rpb25zID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdGlmICF1c2VySWRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdGlmICFvYmpcblx0XHRyZXR1cm5cblxuXHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0ZGlzYWJsZWRfYWN0aW9ucyA9IHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnNcblx0YWN0aW9ucyA9IF8uc29ydEJ5KF8udmFsdWVzKG9iai5hY3Rpb25zKSAsICdzb3J0Jyk7XG5cblx0aWYgXy5oYXMob2JqLCAnYWxsb3dfY3VzdG9tQWN0aW9ucycpXG5cdFx0YWN0aW9ucyA9IF8uZmlsdGVyIGFjdGlvbnMsIChhY3Rpb24pLT5cblx0XHRcdHJldHVybiBfLmluY2x1ZGUob2JqLmFsbG93X2N1c3RvbUFjdGlvbnMsIGFjdGlvbi5uYW1lKSB8fCBfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuZ2V0T2JqZWN0KCdiYXNlJykuYWN0aW9ucykgfHwge30sIGFjdGlvbi5uYW1lKVxuXHRpZiBfLmhhcyhvYmosICdleGNsdWRlX2FjdGlvbnMnKVxuXHRcdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XG5cdFx0XHRyZXR1cm4gIV8uaW5jbHVkZShvYmouZXhjbHVkZV9hY3Rpb25zLCBhY3Rpb24ubmFtZSlcblxuXHRfLmVhY2ggYWN0aW9ucywgKGFjdGlvbiktPlxuXHRcdCMg5omL5py65LiK5Y+q5pi+56S657yW6L6R5oyJ6ZKu77yM5YW25LuW55qE5pS+5Yiw5oqY5Y+g5LiL5ouJ6I+c5Y2V5LitXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcInJlY29yZFwiLCBcInJlY29yZF9vbmx5XCJdLmluZGV4T2YoYWN0aW9uLm9uKSA+IC0xICYmIGFjdGlvbi5uYW1lICE9ICdzdGFuZGFyZF9lZGl0J1xuXHRcdFx0aWYgYWN0aW9uLm9uID09IFwicmVjb3JkX29ubHlcIlxuXHRcdFx0XHRhY3Rpb24ub24gPSAncmVjb3JkX29ubHlfbW9yZSdcblx0XHRcdGVsc2Vcblx0XHRcdFx0YWN0aW9uLm9uID0gJ3JlY29yZF9tb3JlJ1xuXG5cdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJjbXNfZmlsZXNcIiwgXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXS5pbmRleE9mKG9iamVjdF9uYW1lKSA+IC0xXG5cdFx0IyDpmYTku7bnibnmrorlpITnkIbvvIzkuIvovb3mjInpkq7mlL7lnKjkuLvoj5zljZXvvIznvJbovpHmjInpkq7mlL7liLDlupXkuIvmipjlj6DkuIvmi4noj5zljZXkuK1cblx0XHRhY3Rpb25zLmZpbmQoKG4pLT4gcmV0dXJuIG4ubmFtZSA9PSBcInN0YW5kYXJkX2VkaXRcIik/Lm9uID0gXCJyZWNvcmRfbW9yZVwiXG5cdFx0YWN0aW9ucy5maW5kKChuKS0+IHJldHVybiBuLm5hbWUgPT0gXCJkb3dubG9hZFwiKT8ub24gPSBcInJlY29yZFwiXG5cblx0YWN0aW9ucyA9IF8uZmlsdGVyIGFjdGlvbnMsIChhY3Rpb24pLT5cblx0XHRyZXR1cm4gXy5pbmRleE9mKGRpc2FibGVkX2FjdGlvbnMsIGFjdGlvbi5uYW1lKSA8IDBcblxuXHRyZXR1cm4gYWN0aW9uc1xuXG4vLy9cblx06L+U5Zue5b2T5YmN55So5oi35pyJ5p2D6ZmQ6K6/6Zeu55qE5omA5pyJbGlzdF92aWV377yM5YyF5ous5YiG5Lqr55qE77yM55So5oi36Ieq5a6a5LmJ6Z2e5YiG5Lqr55qE77yI6Zmk6Z2eb3duZXLlj5jkuobvvInvvIzku6Xlj4rpu5jorqTnmoTlhbbku5bop4blm75cblx05rOo5oSPQ3JlYXRvci5nZXRQZXJtaXNzaW9uc+WHveaVsOS4reaYr+S4jeS8muacieeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahOinhuWbvueahO+8jOaJgOS7pUNyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mi7/liLDnmoTnu5PmnpzkuI3lhajvvIzlubbkuI3mmK/lvZPliY3nlKjmiLfog73nnIvliLDmiYDmnInop4blm75cbi8vL1xuQ3JlYXRvci5nZXRMaXN0Vmlld3MgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cdFxuXHR1bmxlc3Mgb2JqZWN0X25hbWVcblx0XHRyZXR1cm5cblxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRpZiAhb2JqZWN0XG5cdFx0cmV0dXJuXG5cblx0ZGlzYWJsZWRfbGlzdF92aWV3cyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk/LmRpc2FibGVkX2xpc3Rfdmlld3MgfHwgW11cblxuXHRsaXN0X3ZpZXdzID0gW11cblxuXHRpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKVxuXG5cdF8uZWFjaCBvYmplY3QubGlzdF92aWV3cywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZVxuXG5cdGxpc3RWaWV3cyA9IF8uc29ydEJ5KF8udmFsdWVzKG9iamVjdC5saXN0X3ZpZXdzKSAsICdzb3J0X25vJyk7XG5cblx0Xy5lYWNoIGxpc3RWaWV3cywgKGl0ZW0pLT5cblx0XHRpZiBpc01vYmlsZSBhbmQgaXRlbS50eXBlID09IFwiY2FsZW5kYXJcIlxuXHRcdFx0IyDmiYvmnLrkuIrlhYjkuI3mmL7npLrml6Xljobop4blm75cblx0XHRcdHJldHVyblxuXHRcdGlmIGl0ZW0ubmFtZSAgIT0gXCJkZWZhdWx0XCJcblx0XHRcdGlzRGlzYWJsZWQgPSBfLmluZGV4T2YoZGlzYWJsZWRfbGlzdF92aWV3cywgaXRlbS5uYW1lKSA+IC0xIHx8IChpdGVtLl9pZCAmJiBfLmluZGV4T2YoZGlzYWJsZWRfbGlzdF92aWV3cywgaXRlbS5faWQpID4gLTEpXG5cdFx0XHRpZiAhaXNEaXNhYmxlZCB8fCBpdGVtLm93bmVyID09IHVzZXJJZFxuXHRcdFx0XHRsaXN0X3ZpZXdzLnB1c2ggaXRlbVxuXHRyZXR1cm4gbGlzdF92aWV3c1xuXG4jIOWJjeWPsOeQhuiuuuS4iuS4jeW6lOivpeiwg+eUqOivpeWHveaVsO+8jOWboOS4uuWtl+auteeahOadg+mZkOmDveWcqENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKS5maWVsZHPnmoTnm7jlhbPlsZ7mgKfkuK3mnInmoIfor4bkuoZcbkNyZWF0b3IuZ2V0RmllbGRzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdGlmICF1c2VySWRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXG5cdGZpZWxkc05hbWUgPSBDcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUob2JqZWN0X25hbWUpXG5cdHVucmVhZGFibGVfZmllbGRzID0gIENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk/LnVucmVhZGFibGVfZmllbGRzXG5cdHJldHVybiBfLmRpZmZlcmVuY2UoZmllbGRzTmFtZSwgdW5yZWFkYWJsZV9maWVsZHMpXG5cbkNyZWF0b3IuaXNsb2FkaW5nID0gKCktPlxuXHRyZXR1cm4gIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkLmdldCgpXG5cbkNyZWF0b3IuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSAoc3RyKS0+XG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIilcblxuIyDorqHnrpdmaWVsZHPnm7jlhbPlh73mlbBcbiMgU1RBUlRcbkNyZWF0b3IuZ2V0RGlzYWJsZWRGaWVsZHMgPSAoc2NoZW1hKS0+XG5cdGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkLCBmaWVsZE5hbWUpIC0+XG5cdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS5kaXNhYmxlZCBhbmQgIWZpZWxkLmF1dG9mb3JtLm9taXQgYW5kIGZpZWxkTmFtZVxuXHQpXG5cdGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpXG5cdHJldHVybiBmaWVsZHNcblxuQ3JlYXRvci5nZXRIaWRkZW5GaWVsZHMgPSAoc2NoZW1hKS0+XG5cdGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkLCBmaWVsZE5hbWUpIC0+XG5cdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS50eXBlID09IFwiaGlkZGVuXCIgYW5kICFmaWVsZC5hdXRvZm9ybS5vbWl0IGFuZCBmaWVsZE5hbWVcblx0KVxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxuXHRyZXR1cm4gZmllbGRzXG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aE5vR3JvdXAgPSAoc2NoZW1hKS0+XG5cdGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkLCBmaWVsZE5hbWUpIC0+XG5cdFx0cmV0dXJuICghZmllbGQuYXV0b2Zvcm0gb3IgIWZpZWxkLmF1dG9mb3JtLmdyb3VwIG9yIGZpZWxkLmF1dG9mb3JtLmdyb3VwID09IFwiLVwiKSBhbmQgKCFmaWVsZC5hdXRvZm9ybSBvciBmaWVsZC5hdXRvZm9ybS50eXBlICE9IFwiaGlkZGVuXCIpIGFuZCBmaWVsZE5hbWVcblx0KVxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxuXHRyZXR1cm4gZmllbGRzXG5cbkNyZWF0b3IuZ2V0U29ydGVkRmllbGRHcm91cE5hbWVzID0gKHNjaGVtYSktPlxuXHRuYW1lcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkKSAtPlxuIFx0XHRyZXR1cm4gZmllbGQuYXV0b2Zvcm0gYW5kIGZpZWxkLmF1dG9mb3JtLmdyb3VwICE9IFwiLVwiIGFuZCBmaWVsZC5hdXRvZm9ybS5ncm91cFxuXHQpXG5cdG5hbWVzID0gXy5jb21wYWN0KG5hbWVzKVxuXHRuYW1lcyA9IF8udW5pcXVlKG5hbWVzKVxuXHRyZXR1cm4gbmFtZXNcblxuQ3JlYXRvci5nZXRGaWVsZHNGb3JHcm91cCA9IChzY2hlbWEsIGdyb3VwTmFtZSkgLT5cbiAgXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxuICAgIFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PSBncm91cE5hbWUgYW5kIGZpZWxkLmF1dG9mb3JtLnR5cGUgIT0gXCJoaWRkZW5cIiBhbmQgZmllbGROYW1lXG4gIFx0KVxuICBcdGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpXG4gIFx0cmV0dXJuIGZpZWxkc1xuXG5DcmVhdG9yLmdldFN5c3RlbUJhc2VGaWVsZHMgPSAoKSAtPlxuXHRyZXR1cm4gW1wiY3JlYXRlZFwiLCBcImNyZWF0ZWRfYnlcIiwgXCJtb2RpZmllZFwiLCBcIm1vZGlmaWVkX2J5XCJdXG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aG91dFN5c3RlbUJhc2UgPSAoa2V5cykgLT5cblx0cmV0dXJuIF8uZGlmZmVyZW5jZShrZXlzLCBDcmVhdG9yLmdldFN5c3RlbUJhc2VGaWVsZHMoKSk7XG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aG91dE9taXQgPSAoc2NoZW1hLCBrZXlzKSAtPlxuXHRrZXlzID0gXy5tYXAoa2V5cywgKGtleSkgLT5cblx0XHRmaWVsZCA9IF8ucGljayhzY2hlbWEsIGtleSlcblx0XHRpZiBmaWVsZFtrZXldLmF1dG9mb3JtPy5vbWl0XG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ga2V5XG5cdClcblx0a2V5cyA9IF8uY29tcGFjdChrZXlzKVxuXHRyZXR1cm4ga2V5c1xuXG5DcmVhdG9yLmdldEZpZWxkc0luRmlyc3RMZXZlbCA9IChmaXJzdExldmVsS2V5cywga2V5cykgLT5cblx0a2V5cyA9IF8ubWFwKGtleXMsIChrZXkpIC0+XG5cdFx0aWYgXy5pbmRleE9mKGZpcnN0TGV2ZWxLZXlzLCBrZXkpID4gLTFcblx0XHRcdHJldHVybiBrZXlcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0KVxuXHRrZXlzID0gXy5jb21wYWN0KGtleXMpXG5cdHJldHVybiBrZXlzXG5cbkNyZWF0b3IuZ2V0RmllbGRzRm9yUmVvcmRlciA9IChzY2hlbWEsIGtleXMsIGlzU2luZ2xlKSAtPlxuXHRmaWVsZHMgPSBbXVxuXHRpID0gMFxuXHRfa2V5cyA9IF8uZmlsdGVyKGtleXMsIChrZXkpLT5cblx0XHRyZXR1cm4gIWtleS5lbmRzV2l0aCgnX2VuZExpbmUnKVxuXHQpO1xuXHR3aGlsZSBpIDwgX2tleXMubGVuZ3RoXG5cdFx0c2NfMSA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2ldKVxuXHRcdHNjXzIgPSBfLnBpY2soc2NoZW1hLCBfa2V5c1tpKzFdKVxuXG5cdFx0aXNfd2lkZV8xID0gZmFsc2Vcblx0XHRpc193aWRlXzIgPSBmYWxzZVxuXG4jXHRcdGlzX3JhbmdlXzEgPSBmYWxzZVxuI1x0XHRpc19yYW5nZV8yID0gZmFsc2VcblxuXHRcdF8uZWFjaCBzY18xLCAodmFsdWUpIC0+XG5cdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfd2lkZSB8fCB2YWx1ZS5hdXRvZm9ybT8udHlwZSA9PSBcInRhYmxlXCJcblx0XHRcdFx0aXNfd2lkZV8xID0gdHJ1ZVxuXG4jXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3JhbmdlXG4jXHRcdFx0XHRpc19yYW5nZV8xID0gdHJ1ZVxuXG5cdFx0Xy5lYWNoIHNjXzIsICh2YWx1ZSkgLT5cblx0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc193aWRlIHx8IHZhbHVlLmF1dG9mb3JtPy50eXBlID09IFwidGFibGVcIlxuXHRcdFx0XHRpc193aWRlXzIgPSB0cnVlXG5cbiNcdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfcmFuZ2VcbiNcdFx0XHRcdGlzX3JhbmdlXzIgPSB0cnVlXG5cblx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdGlzX3dpZGVfMSA9IHRydWVcblx0XHRcdGlzX3dpZGVfMiA9IHRydWVcblxuXHRcdGlmIGlzU2luZ2xlXG5cdFx0XHRmaWVsZHMucHVzaCBfa2V5cy5zbGljZShpLCBpKzEpXG5cdFx0XHRpICs9IDFcblx0XHRlbHNlXG4jXHRcdFx0aWYgIWlzX3JhbmdlXzEgJiYgaXNfcmFuZ2VfMlxuI1x0XHRcdFx0Y2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSsxKVxuI1x0XHRcdFx0Y2hpbGRLZXlzLnB1c2ggdW5kZWZpbmVkXG4jXHRcdFx0XHRmaWVsZHMucHVzaCBjaGlsZEtleXNcbiNcdFx0XHRcdGkgKz0gMVxuI1x0XHRcdGVsc2Vcblx0XHRcdGlmIGlzX3dpZGVfMVxuXHRcdFx0XHRmaWVsZHMucHVzaCBfa2V5cy5zbGljZShpLCBpKzEpXG5cdFx0XHRcdGkgKz0gMVxuXHRcdFx0ZWxzZSBpZiAhaXNfd2lkZV8xIGFuZCBpc193aWRlXzJcblx0XHRcdFx0Y2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSsxKVxuXHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcblx0XHRcdFx0ZmllbGRzLnB1c2ggY2hpbGRLZXlzXG5cdFx0XHRcdGkgKz0gMVxuXHRcdFx0ZWxzZSBpZiAhaXNfd2lkZV8xIGFuZCAhaXNfd2lkZV8yXG5cdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcblx0XHRcdFx0aWYgX2tleXNbaSsxXVxuXHRcdFx0XHRcdGNoaWxkS2V5cy5wdXNoIF9rZXlzW2krMV1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGNoaWxkS2V5cy5wdXNoIHVuZGVmaW5lZFxuXHRcdFx0XHRmaWVsZHMucHVzaCBjaGlsZEtleXNcblx0XHRcdFx0aSArPSAyXG5cblx0cmV0dXJuIGZpZWxkc1xuXG5DcmVhdG9yLmlzRmlsdGVyVmFsdWVFbXB0eSA9ICh2KSAtPlxuXHRyZXR1cm4gdHlwZW9mIHYgPT0gXCJ1bmRlZmluZWRcIiB8fCB2ID09IG51bGwgfHwgTnVtYmVyLmlzTmFOKHYpIHx8IHYubGVuZ3RoID09IDBcblxuQ3JlYXRvci5nZXRGaWVsZERhdGFUeXBlID0gKG9iamVjdEZpZWxkcywga2V5KS0+XG5cdGlmIG9iamVjdEZpZWxkcyBhbmQga2V5XG5cdFx0cmVzdWx0ID0gb2JqZWN0RmllbGRzW2tleV0/LnR5cGVcblx0XHRpZiBbXCJmb3JtdWxhXCIsIFwic3VtbWFyeVwiXS5pbmRleE9mKHJlc3VsdCkgPiAtMVxuXHRcdFx0cmVzdWx0ID0gb2JqZWN0RmllbGRzW2tleV0uZGF0YV90eXBlXG5cdFx0IyBlbHNlIGlmIHJlc3VsdCA9PSBcInNlbGVjdFwiIGFuZCBvYmplY3RGaWVsZHNba2V5XT8uZGF0YV90eXBlIGFuZCBvYmplY3RGaWVsZHNba2V5XS5kYXRhX3R5cGUgIT0gXCJ0ZXh0XCJcblx0XHQjIFx0cmVzdWx0ID0gb2JqZWN0RmllbGRzW2tleV0uZGF0YV90eXBlXG5cdFx0cmV0dXJuIHJlc3VsdFxuXHRlbHNlXG5cdFx0cmV0dXJuIFwidGV4dFwiXG5cbiMgRU5EXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRDcmVhdG9yLmdldEFsbFJlbGF0ZWRPYmplY3RzID0gKG9iamVjdF9uYW1lKS0+XG5cdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBbXVxuXHRcdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSktPlxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSktPlxuXHRcdFx0XHRpZiByZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PSBvYmplY3RfbmFtZVxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzLnB1c2ggcmVsYXRlZF9vYmplY3RfbmFtZVxuXG5cdFx0aWYgQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpLmVuYWJsZV9maWxlc1xuXHRcdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMucHVzaCBcImNtc19maWxlc1wiXG5cblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXNcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdFN0ZWVkb3MuZm9ybWF0SW5kZXggPSAoYXJyYXkpIC0+XG5cdFx0b2JqZWN0ID0ge1xuICAgICAgICBcdGJhY2tncm91bmQ6IHRydWVcbiAgICBcdH07XG5cdFx0aXNkb2N1bWVudERCID0gTWV0ZW9yLnNldHRpbmdzPy5kYXRhc291cmNlcz8uZGVmYXVsdD8uZG9jdW1lbnREQiB8fCBmYWxzZTtcblx0XHRpZiBpc2RvY3VtZW50REJcblx0XHRcdGlmIGFycmF5Lmxlbmd0aCA+IDBcblx0XHRcdFx0aW5kZXhOYW1lID0gYXJyYXkuam9pbihcIi5cIik7XG5cdFx0XHRcdG9iamVjdC5uYW1lID0gaW5kZXhOYW1lO1xuXHRcdFx0XHRcblx0XHRcdFx0aWYgKGluZGV4TmFtZS5sZW5ndGggPiA1Milcblx0XHRcdFx0XHRvYmplY3QubmFtZSA9IGluZGV4TmFtZS5zdWJzdHJpbmcoMCw1Mik7XG5cblx0XHRyZXR1cm4gb2JqZWN0OyIsIkNyZWF0b3IuZ2V0U2NoZW1hID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuc2NoZW1hIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RIb21lQ29tcG9uZW50ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHJldHVybiBCdWlsZGVyQ3JlYXRvci5wbHVnaW5Db21wb25lbnRTZWxlY3RvcihCdWlsZGVyQ3JlYXRvci5zdG9yZS5nZXRTdGF0ZSgpLCBcIk9iamVjdEhvbWVcIiwgb2JqZWN0X25hbWUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkge1xuICB2YXIgbGlzdF92aWV3LCBsaXN0X3ZpZXdfaWQ7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKTtcbiAgbGlzdF92aWV3X2lkID0gbGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcuX2lkIDogdm9pZCAwO1xuICBpZiAocmVjb3JkX2lkKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQpO1xuICB9IGVsc2Uge1xuICAgIGlmIChDcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQob2JqZWN0X25hbWUpKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGxpc3Rfdmlld19pZCkge1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0QWJzb2x1dGVVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIHtcbiAgdmFyIGxpc3RfdmlldywgbGlzdF92aWV3X2lkO1xuICBpZiAoIWFwcF9pZCkge1xuICAgIGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICB9XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgbGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbCk7XG4gIGxpc3Rfdmlld19pZCA9IGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Ll9pZCA6IHZvaWQgMDtcbiAgaWYgKHJlY29yZF9pZCkge1xuICAgIHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkX2lkLCB0cnVlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCwgdHJ1ZSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0Um91dGVyVXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSB7XG4gIHZhciBsaXN0X3ZpZXcsIGxpc3Rfdmlld19pZDtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpO1xuICBsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5faWQgOiB2b2lkIDA7XG4gIGlmIChyZWNvcmRfaWQpIHtcbiAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldExpc3RWaWV3VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSB7XG4gIHZhciB1cmw7XG4gIHVybCA9IENyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpO1xuICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCh1cmwpO1xufTtcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSB7XG4gIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZDtcbn07XG5cbkNyZWF0b3IuZ2V0U3dpdGNoTGlzdFVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkge1xuICBpZiAobGlzdF92aWV3X2lkKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgbGlzdF92aWV3X2lkICsgXCIvbGlzdFwiKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvbGlzdC9zd2l0Y2hcIik7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdFVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIHJlY29yZF9pZCwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gIGlmIChyZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyByZWNvcmRfaWQgKyBcIi9cIiArIHJlbGF0ZWRfb2JqZWN0X25hbWUgKyBcIi9ncmlkP3JlbGF0ZWRfZmllbGRfbmFtZT1cIiArIHJlbGF0ZWRfZmllbGRfbmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgcmVjb3JkX2lkICsgXCIvXCIgKyByZWxhdGVkX29iamVjdF9uYW1lICsgXCIvZ3JpZFwiKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgaXNfZGVlcCwgaXNfc2tpcF9oaWRlLCBpc19yZWxhdGVkKSB7XG4gIHZhciBfb2JqZWN0LCBfb3B0aW9ucywgZmllbGRzLCBpY29uLCByZWxhdGVkT2JqZWN0cztcbiAgX29wdGlvbnMgPSBbXTtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfb3B0aW9ucztcbiAgfVxuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgaWNvbiA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMDtcbiAgXy5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZiwgaykge1xuICAgIGlmIChpc19za2lwX2hpZGUgJiYgZi5oaWRkZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGYudHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICBsYWJlbDogXCJcIiArIChmLmxhYmVsIHx8IGspLFxuICAgICAgICB2YWx1ZTogXCJcIiArIGssXG4gICAgICAgIGljb246IGljb25cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgIGxhYmVsOiBmLmxhYmVsIHx8IGssXG4gICAgICAgIHZhbHVlOiBrLFxuICAgICAgICBpY29uOiBpY29uXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBpZiAoaXNfZGVlcCkge1xuICAgIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICAgIHZhciByX29iamVjdDtcbiAgICAgIGlmIChpc19za2lwX2hpZGUgJiYgZi5oaWRkZW4pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKChmLnR5cGUgPT09IFwibG9va3VwXCIgfHwgZi50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikgJiYgZi5yZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhmLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgcl9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChmLnJlZmVyZW5jZV90byk7XG4gICAgICAgIGlmIChyX29iamVjdCkge1xuICAgICAgICAgIHJldHVybiBfLmZvckVhY2gocl9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihmMiwgazIpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgbGFiZWw6IChmLmxhYmVsIHx8IGspICsgXCI9PlwiICsgKGYyLmxhYmVsIHx8IGsyKSxcbiAgICAgICAgICAgICAgdmFsdWU6IGsgKyBcIi5cIiArIGsyLFxuICAgICAgICAgICAgICBpY29uOiByX29iamVjdCAhPSBudWxsID8gcl9vYmplY3QuaWNvbiA6IHZvaWQgMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpZiAoaXNfcmVsYXRlZCkge1xuICAgIHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSk7XG4gICAgXy5lYWNoKHJlbGF0ZWRPYmplY3RzLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihfcmVsYXRlZE9iamVjdCkge1xuICAgICAgICB2YXIgcmVsYXRlZE9iamVjdCwgcmVsYXRlZE9wdGlvbnM7XG4gICAgICAgIHJlbGF0ZWRPcHRpb25zID0gQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMoX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICByZWxhdGVkT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUpO1xuICAgICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRPcHRpb25zLCBmdW5jdGlvbihyZWxhdGVkT3B0aW9uKSB7XG4gICAgICAgICAgaWYgKF9yZWxhdGVkT2JqZWN0LmZvcmVpZ25fa2V5ICE9PSByZWxhdGVkT3B0aW9uLnZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiAocmVsYXRlZE9iamVjdC5sYWJlbCB8fCByZWxhdGVkT2JqZWN0Lm5hbWUpICsgXCI9PlwiICsgcmVsYXRlZE9wdGlvbi5sYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHJlbGF0ZWRPYmplY3QubmFtZSArIFwiLlwiICsgcmVsYXRlZE9wdGlvbi52YWx1ZSxcbiAgICAgICAgICAgICAgaWNvbjogcmVsYXRlZE9iamVjdCAhPSBudWxsID8gcmVsYXRlZE9iamVjdC5pY29uIDogdm9pZCAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH1cbiAgcmV0dXJuIF9vcHRpb25zO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RGaWx0ZXJGaWVsZE9wdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgX29wdGlvbnMsIGZpZWxkcywgaWNvbiwgcGVybWlzc2lvbl9maWVsZHM7XG4gIF9vcHRpb25zID0gW107XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gX29wdGlvbnM7XG4gIH1cbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpO1xuICBpY29uID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwO1xuICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgaWYgKCFfLmluY2x1ZGUoW1wiZ3JpZFwiLCBcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJhdmF0YXJcIiwgXCJpbWFnZVwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKSAmJiAhZi5oaWRkZW4pIHtcbiAgICAgIGlmICghL1xcdytcXC4vLnRlc3QoaykgJiYgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICBsYWJlbDogZi5sYWJlbCB8fCBrLFxuICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgIGljb246IGljb25cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIF9vcHRpb25zO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZE9wdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgX29wdGlvbnMsIGZpZWxkcywgaWNvbiwgcGVybWlzc2lvbl9maWVsZHM7XG4gIF9vcHRpb25zID0gW107XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gX29wdGlvbnM7XG4gIH1cbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpO1xuICBpY29uID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwO1xuICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgaWYgKCFfLmluY2x1ZGUoW1wiZ3JpZFwiLCBcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSkpIHtcbiAgICAgIGlmICghL1xcdytcXC4vLnRlc3QoaykgJiYgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICBsYWJlbDogZi5sYWJlbCB8fCBrLFxuICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgIGljb246IGljb25cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIF9vcHRpb25zO1xufTtcblxuXG4vKlxuZmlsdGVyczog6KaB6L2s5o2i55qEZmlsdGVyc1xuZmllbGRzOiDlr7nosaHlrZfmrrVcbmZpbHRlcl9maWVsZHM6IOm7mOiupOi/h+a7pOWtl+aute+8jOaUr+aMgeWtl+espuS4suaVsOe7hOWSjOWvueixoeaVsOe7hOS4pOenjeagvOW8j++8jOWmgjpbJ2ZpbGVkX25hbWUxJywnZmlsZWRfbmFtZTInXSxbe2ZpZWxkOidmaWxlZF9uYW1lMScscmVxdWlyZWQ6dHJ1ZX1dXG7lpITnkIbpgLvovpE6IOaKimZpbHRlcnPkuK3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25aKe5Yqg5q+P6aG555qEaXNfZGVmYXVsdOOAgWlzX3JlcXVpcmVk5bGe5oCn77yM5LiN5a2Y5Zyo5LqOZmlsdGVyX2ZpZWxkc+eahOi/h+a7pOadoeS7tuWvueW6lOeahOenu+mZpOavj+mhueeahOebuOWFs+WxnuaAp1xu6L+U5Zue57uT5p6cOiDlpITnkIblkI7nmoRmaWx0ZXJzXG4gKi9cblxuQ3JlYXRvci5nZXRGaWx0ZXJzV2l0aEZpbHRlckZpZWxkcyA9IGZ1bmN0aW9uKGZpbHRlcnMsIGZpZWxkcywgZmlsdGVyX2ZpZWxkcykge1xuICBpZiAoIWZpbHRlcnMpIHtcbiAgICBmaWx0ZXJzID0gW107XG4gIH1cbiAgaWYgKCFmaWx0ZXJfZmllbGRzKSB7XG4gICAgZmlsdGVyX2ZpZWxkcyA9IFtdO1xuICB9XG4gIGlmIChmaWx0ZXJfZmllbGRzICE9IG51bGwgPyBmaWx0ZXJfZmllbGRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgIGZpbHRlcl9maWVsZHMuZm9yRWFjaChmdW5jdGlvbihuKSB7XG4gICAgICBpZiAoXy5pc1N0cmluZyhuKSkge1xuICAgICAgICBuID0ge1xuICAgICAgICAgIGZpZWxkOiBuLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKGZpZWxkc1tuLmZpZWxkXSAmJiAhXy5maW5kV2hlcmUoZmlsdGVycywge1xuICAgICAgICBmaWVsZDogbi5maWVsZFxuICAgICAgfSkpIHtcbiAgICAgICAgcmV0dXJuIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgZmllbGQ6IG4uZmllbGQsXG4gICAgICAgICAgaXNfZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICBpc19yZXF1aXJlZDogbi5yZXF1aXJlZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBmaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24oZmlsdGVySXRlbSkge1xuICAgIHZhciBtYXRjaEZpZWxkO1xuICAgIG1hdGNoRmllbGQgPSBmaWx0ZXJfZmllbGRzLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4gPT09IGZpbHRlckl0ZW0uZmllbGQgfHwgbi5maWVsZCA9PT0gZmlsdGVySXRlbS5maWVsZDtcbiAgICB9KTtcbiAgICBpZiAoXy5pc1N0cmluZyhtYXRjaEZpZWxkKSkge1xuICAgICAgbWF0Y2hGaWVsZCA9IHtcbiAgICAgICAgZmllbGQ6IG1hdGNoRmllbGQsXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKG1hdGNoRmllbGQpIHtcbiAgICAgIGZpbHRlckl0ZW0uaXNfZGVmYXVsdCA9IHRydWU7XG4gICAgICByZXR1cm4gZmlsdGVySXRlbS5pc19yZXF1aXJlZCA9IG1hdGNoRmllbGQucmVxdWlyZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBmaWx0ZXJJdGVtLmlzX2RlZmF1bHQ7XG4gICAgICByZXR1cm4gZGVsZXRlIGZpbHRlckl0ZW0uaXNfcmVxdWlyZWQ7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZpbHRlcnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZCkge1xuICB2YXIgY29sbGVjdGlvbiwgb2JqLCByZWNvcmQsIHJlZiwgcmVmMSwgcmVmMjtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAoIXJlY29yZF9pZCkge1xuICAgIHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikgJiYgcmVjb3JkX2lkID09PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSkge1xuICAgICAgaWYgKChyZWYgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpKSAhPSBudWxsID8gcmVmLnJlY29yZCA6IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gKHJlZjEgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLnJlY29yZCkgIT0gbnVsbCA/IHJlZjIuZ2V0KCkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpO1xuICAgIH1cbiAgfVxuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmIChvYmouZGF0YWJhc2VfbmFtZSA9PT0gXCJtZXRlb3JcIiB8fCAhb2JqLmRhdGFiYXNlX25hbWUpIHtcbiAgICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKTtcbiAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgcmVjb3JkID0gY29sbGVjdGlvbi5maW5kT25lKHJlY29yZF9pZCk7XG4gICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cbiAgfSBlbHNlIGlmIChvYmplY3RfbmFtZSAmJiByZWNvcmRfaWQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSZWNvcmROYW1lID0gZnVuY3Rpb24ocmVjb3JkLCBvYmplY3RfbmFtZSkge1xuICB2YXIgbmFtZV9maWVsZF9rZXksIHJlZjtcbiAgaWYgKCFyZWNvcmQpIHtcbiAgICByZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpO1xuICB9XG4gIGlmIChyZWNvcmQpIHtcbiAgICBuYW1lX2ZpZWxkX2tleSA9IG9iamVjdF9uYW1lID09PSBcIm9yZ2FuaXphdGlvbnNcIiA/IFwibmFtZVwiIDogKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5OQU1FX0ZJRUxEX0tFWSA6IHZvaWQgMDtcbiAgICBpZiAocmVjb3JkICYmIG5hbWVfZmllbGRfa2V5KSB7XG4gICAgICByZXR1cm4gcmVjb3JkLmxhYmVsIHx8IHJlY29yZFtuYW1lX2ZpZWxkX2tleV07XG4gICAgfVxuICB9XG59O1xuXG5DcmVhdG9yLmdldEFwcCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwLCByZWYsIHJlZjE7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgYXBwID0gQ3JlYXRvci5BcHBzW2FwcF9pZF07XG4gIGlmICgocmVmID0gQ3JlYXRvci5kZXBzKSAhPSBudWxsKSB7XG4gICAgaWYgKChyZWYxID0gcmVmLmFwcCkgIT0gbnVsbCkge1xuICAgICAgcmVmMS5kZXBlbmQoKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFwcDtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIGRhc2hib2FyZDtcbiAgYXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKTtcbiAgaWYgKCFhcHApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZGFzaGJvYXJkID0gbnVsbDtcbiAgXy5lYWNoKENyZWF0b3IuRGFzaGJvYXJkcywgZnVuY3Rpb24odiwgaykge1xuICAgIHZhciByZWY7XG4gICAgaWYgKCgocmVmID0gdi5hcHBzKSAhPSBudWxsID8gcmVmLmluZGV4T2YoYXBwLl9pZCkgOiB2b2lkIDApID4gLTEpIHtcbiAgICAgIHJldHVybiBkYXNoYm9hcmQgPSB2O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkYXNoYm9hcmQ7XG59O1xuXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZENvbXBvbmVudCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCkge1xuICAgIHJldHVybjtcbiAgfVxuICByZXR1cm4gQnVpbGRlckNyZWF0b3IucGx1Z2luQ29tcG9uZW50U2VsZWN0b3IoQnVpbGRlckNyZWF0b3Iuc3RvcmUuZ2V0U3RhdGUoKSwgXCJEYXNoYm9hcmRcIiwgYXBwLl9pZCk7XG59O1xuXG5DcmVhdG9yLmdldEFwcE9iamVjdE5hbWVzID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIGFwcE9iamVjdHMsIGlzTW9iaWxlLCBvYmplY3RzO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKTtcbiAgYXBwT2JqZWN0cyA9IGlzTW9iaWxlID8gYXBwLm1vYmlsZV9vYmplY3RzIDogYXBwLm9iamVjdHM7XG4gIG9iamVjdHMgPSBbXTtcbiAgaWYgKGFwcCkge1xuICAgIF8uZWFjaChhcHBPYmplY3RzLCBmdW5jdGlvbih2KSB7XG4gICAgICB2YXIgb2JqO1xuICAgICAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qodik7XG4gICAgICBpZiAob2JqICE9IG51bGwgPyBvYmoucGVybWlzc2lvbnMuZ2V0KCkuYWxsb3dSZWFkIDogdm9pZCAwKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RzLnB1c2godik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdHM7XG59O1xuXG5DcmVhdG9yLmdldFVybFdpdGhUb2tlbiA9IGZ1bmN0aW9uKHVybCwgZXhwcmVzc2lvbkZvcm1EYXRhKSB7XG4gIHZhciBoYXNRdWVyeVN5bWJvbCwgbGlua1N0ciwgcGFyYW1zO1xuICBwYXJhbXMgPSB7fTtcbiAgcGFyYW1zW1wiWC1TcGFjZS1JZFwiXSA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICBwYXJhbXNbXCJYLVVzZXItSWRcIl0gPSBTdGVlZG9zLnVzZXJJZCgpO1xuICBwYXJhbXNbXCJYLUNvbXBhbnktSWRzXCJdID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpO1xuICBwYXJhbXNbXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICBpZiAoU3RlZWRvcy5pc0V4cHJlc3Npb24odXJsKSkge1xuICAgIHVybCA9IFN0ZWVkb3MucGFyc2VTaW5nbGVFeHByZXNzaW9uKHVybCwgZXhwcmVzc2lvbkZvcm1EYXRhLCBcIiNcIiwgQ3JlYXRvci5VU0VSX0NPTlRFWFQpO1xuICB9XG4gIGhhc1F1ZXJ5U3ltYm9sID0gLyhcXCMuK1xcPyl8KFxcP1teI10qJCkvZy50ZXN0KHVybCk7XG4gIGxpbmtTdHIgPSBoYXNRdWVyeVN5bWJvbCA/IFwiJlwiIDogXCI/XCI7XG4gIHJldHVybiBcIlwiICsgdXJsICsgbGlua1N0ciArICgkLnBhcmFtKHBhcmFtcykpO1xufTtcblxuQ3JlYXRvci5nZXRBcHBNZW51ID0gZnVuY3Rpb24oYXBwX2lkLCBtZW51X2lkKSB7XG4gIHZhciBtZW51cztcbiAgbWVudXMgPSBDcmVhdG9yLmdldEFwcE1lbnVzKGFwcF9pZCk7XG4gIHJldHVybiBtZW51cyAmJiBtZW51cy5maW5kKGZ1bmN0aW9uKG1lbnUpIHtcbiAgICByZXR1cm4gbWVudS5pZCA9PT0gbWVudV9pZDtcbiAgfSk7XG59O1xuXG5DcmVhdG9yLmdldEFwcE1lbnVVcmxGb3JJbnRlcm5ldCA9IGZ1bmN0aW9uKG1lbnUpIHtcbiAgcmV0dXJuIENyZWF0b3IuZ2V0VXJsV2l0aFRva2VuKG1lbnUucGF0aCwgbWVudSk7XG59O1xuXG5DcmVhdG9yLmdldEFwcE1lbnVVcmwgPSBmdW5jdGlvbihtZW51KSB7XG4gIHZhciB1cmw7XG4gIHVybCA9IG1lbnUucGF0aDtcbiAgaWYgKG1lbnUudHlwZSA9PT0gXCJ1cmxcIikge1xuICAgIGlmIChtZW51LnRhcmdldCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0QXBwTWVudVVybEZvckludGVybmV0KG1lbnUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCIvYXBwLy0vdGFiX2lmcmFtZS9cIiArIG1lbnUuaWQ7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBtZW51LnBhdGg7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QXBwTWVudXMgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgdmFyIGFwcCwgYXBwTWVudXMsIGN1cmVudEFwcE1lbnVzO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBhcHBNZW51cyA9IFNlc3Npb24uZ2V0KFwiYXBwX21lbnVzXCIpO1xuICBpZiAoIWFwcE1lbnVzKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGN1cmVudEFwcE1lbnVzID0gYXBwTWVudXMuZmluZChmdW5jdGlvbihtZW51SXRlbSkge1xuICAgIHJldHVybiBtZW51SXRlbS5pZCA9PT0gYXBwLl9pZDtcbiAgfSk7XG4gIGlmIChjdXJlbnRBcHBNZW51cykge1xuICAgIHJldHVybiBjdXJlbnRBcHBNZW51cy5jaGlsZHJlbjtcbiAgfVxufTtcblxuQ3JlYXRvci5sb2FkQXBwc01lbnVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkYXRhLCBpc01vYmlsZSwgb3B0aW9ucztcbiAgaXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKCk7XG4gIGRhdGEgPSB7fTtcbiAgaWYgKGlzTW9iaWxlKSB7XG4gICAgZGF0YS5tb2JpbGUgPSBpc01vYmlsZTtcbiAgfVxuICBvcHRpb25zID0ge1xuICAgIHR5cGU6ICdnZXQnLFxuICAgIGRhdGE6IGRhdGEsXG4gICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIFNlc3Npb24uc2V0KFwiYXBwX21lbnVzXCIsIGRhdGEpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIFN0ZWVkb3MuYXV0aFJlcXVlc3QoXCIvc2VydmljZS9hcGkvYXBwcy9tZW51c1wiLCBvcHRpb25zKTtcbn07XG5cbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHMgPSBmdW5jdGlvbihpbmNsdWRlQWRtaW4pIHtcbiAgdmFyIGNoYW5nZUFwcDtcbiAgY2hhbmdlQXBwID0gQ3JlYXRvci5fc3ViQXBwLmdldCgpO1xuICBCdWlsZGVyQ3JlYXRvci5zdG9yZS5nZXRTdGF0ZSgpLmVudGl0aWVzLmFwcHMgPSBPYmplY3QuYXNzaWduKHt9LCBCdWlsZGVyQ3JlYXRvci5zdG9yZS5nZXRTdGF0ZSgpLmVudGl0aWVzLmFwcHMsIHtcbiAgICBhcHBzOiBjaGFuZ2VBcHBcbiAgfSk7XG4gIHJldHVybiBCdWlsZGVyQ3JlYXRvci52aXNpYmxlQXBwc1NlbGVjdG9yKEJ1aWxkZXJDcmVhdG9yLnN0b3JlLmdldFN0YXRlKCksIGluY2x1ZGVBZG1pbik7XG59O1xuXG5DcmVhdG9yLmdldFZpc2libGVBcHBzT2JqZWN0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXBwcywgb2JqZWN0cywgdmlzaWJsZU9iamVjdE5hbWVzO1xuICBhcHBzID0gQ3JlYXRvci5nZXRWaXNpYmxlQXBwcygpO1xuICB2aXNpYmxlT2JqZWN0TmFtZXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhhcHBzLCAnb2JqZWN0cycpKTtcbiAgb2JqZWN0cyA9IF8uZmlsdGVyKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKHZpc2libGVPYmplY3ROYW1lcy5pbmRleE9mKG9iai5uYW1lKSA8IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgb2JqZWN0cyA9IG9iamVjdHMuc29ydChDcmVhdG9yLnNvcnRpbmdNZXRob2QuYmluZCh7XG4gICAga2V5OiBcImxhYmVsXCJcbiAgfSkpO1xuICBvYmplY3RzID0gXy5wbHVjayhvYmplY3RzLCAnbmFtZScpO1xuICByZXR1cm4gXy51bmlxKG9iamVjdHMpO1xufTtcblxuQ3JlYXRvci5nZXRBcHBzT2JqZWN0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgb2JqZWN0cywgdGVtcE9iamVjdHM7XG4gIG9iamVjdHMgPSBbXTtcbiAgdGVtcE9iamVjdHMgPSBbXTtcbiAgXy5mb3JFYWNoKENyZWF0b3IuQXBwcywgZnVuY3Rpb24oYXBwKSB7XG4gICAgdGVtcE9iamVjdHMgPSBfLmZpbHRlcihhcHAub2JqZWN0cywgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gIW9iai5oaWRkZW47XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iamVjdHMgPSBvYmplY3RzLmNvbmNhdCh0ZW1wT2JqZWN0cyk7XG4gIH0pO1xuICByZXR1cm4gXy51bmlxKG9iamVjdHMpO1xufTtcblxuQ3JlYXRvci52YWxpZGF0ZUZpbHRlcnMgPSBmdW5jdGlvbihmaWx0ZXJzLCBsb2dpYykge1xuICB2YXIgZSwgZXJyb3JNc2csIGZpbHRlcl9pdGVtcywgZmlsdGVyX2xlbmd0aCwgZmxhZywgaW5kZXgsIHdvcmQ7XG4gIGZpbHRlcl9pdGVtcyA9IF8ubWFwKGZpbHRlcnMsIGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChfLmlzRW1wdHkob2JqKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgfSk7XG4gIGZpbHRlcl9pdGVtcyA9IF8uY29tcGFjdChmaWx0ZXJfaXRlbXMpO1xuICBlcnJvck1zZyA9IFwiXCI7XG4gIGZpbHRlcl9sZW5ndGggPSBmaWx0ZXJfaXRlbXMubGVuZ3RoO1xuICBpZiAobG9naWMpIHtcbiAgICBsb2dpYyA9IGxvZ2ljLnJlcGxhY2UoL1xcbi9nLCBcIlwiKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgICBpZiAoL1suX1xcLSErXSsvaWcudGVzdChsb2dpYykpIHtcbiAgICAgIGVycm9yTXNnID0gXCLlkKvmnInnibnmrorlrZfnrKbjgIJcIjtcbiAgICB9XG4gICAgaWYgKCFlcnJvck1zZykge1xuICAgICAgaW5kZXggPSBsb2dpYy5tYXRjaCgvXFxkKy9pZyk7XG4gICAgICBpZiAoIWluZGV4KSB7XG4gICAgICAgIGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZGV4LmZvckVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgIGlmIChpIDwgMSB8fCBpID4gZmlsdGVyX2xlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInmnaHku7blvJXnlKjkuobmnKrlrprkuYnnmoTnrZvpgInlmajvvJpcIiArIGkgKyBcIuOAglwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZsYWcgPSAxO1xuICAgICAgICB3aGlsZSAoZmxhZyA8PSBmaWx0ZXJfbGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFpbmRleC5pbmNsdWRlcyhcIlwiICsgZmxhZykpIHtcbiAgICAgICAgICAgIGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmxhZysrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIHdvcmQgPSBsb2dpYy5tYXRjaCgvW2EtekEtWl0rL2lnKTtcbiAgICAgIGlmICh3b3JkKSB7XG4gICAgICAgIHdvcmQuZm9yRWFjaChmdW5jdGlvbih3KSB7XG4gICAgICAgICAgaWYgKCEvXihhbmR8b3IpJC9pZy50ZXN0KHcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JNc2cgPSBcIuajgOafpeaCqOeahOmrmOe6p+etm+mAieadoeS7tuS4reeahOaLvOWGmeOAglwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIENyZWF0b3JbXCJldmFsXCJdKGxvZ2ljLnJlcGxhY2UoL2FuZC9pZywgXCImJlwiKS5yZXBsYWNlKC9vci9pZywgXCJ8fFwiKSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajkuK3lkKvmnInnibnmrorlrZfnrKZcIjtcbiAgICAgIH1cbiAgICAgIGlmICgvKEFORClbXigpXSsoT1IpL2lnLnRlc3QobG9naWMpIHx8IC8oT1IpW14oKV0rKEFORCkvaWcudGVzdChsb2dpYykpIHtcbiAgICAgICAgZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOW/hemhu+WcqOi/nue7reaAp+eahCBBTkQg5ZKMIE9SIOihqOi+vuW8j+WJjeWQjuS9v+eUqOaLrOWPt+OAglwiO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoZXJyb3JNc2cpIHtcbiAgICBjb25zb2xlLmxvZyhcImVycm9yXCIsIGVycm9yTXNnKTtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB0b2FzdHIuZXJyb3IoZXJyb3JNc2cpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cblxuLypcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9Nb25nbyA9IGZ1bmN0aW9uKGZpbHRlcnMsIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGVjdG9yO1xuICBpZiAoIShmaWx0ZXJzICE9IG51bGwgPyBmaWx0ZXJzLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCEoZmlsdGVyc1swXSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgIGZpbHRlcnMgPSBfLm1hcChmaWx0ZXJzLCBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBbb2JqLmZpZWxkLCBvYmoub3BlcmF0aW9uLCBvYmoudmFsdWVdO1xuICAgIH0pO1xuICB9XG4gIHNlbGVjdG9yID0gW107XG4gIF8uZWFjaChmaWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICB2YXIgZmllbGQsIG9wdGlvbiwgcmVnLCBzdWJfc2VsZWN0b3IsIHZhbHVlO1xuICAgIGZpZWxkID0gZmlsdGVyWzBdO1xuICAgIG9wdGlvbiA9IGZpbHRlclsxXTtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBudWxsLCBvcHRpb25zKTtcbiAgICB9XG4gICAgc3ViX3NlbGVjdG9yID0ge307XG4gICAgc3ViX3NlbGVjdG9yW2ZpZWxkXSA9IHt9O1xuICAgIGlmIChvcHRpb24gPT09IFwiPVwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGVxXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD5cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRuZVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIj5cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndFwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIj49XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RlXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPFwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGx0XCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD1cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdGVcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJzdGFydHN3aXRoXCIpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeXCIgKyB2YWx1ZSwgXCJpXCIpO1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJjb250YWluc1wiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKHZhbHVlLCBcImlcIik7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIm5vdGNvbnRhaW5zXCIpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeKCg/IVwiICsgdmFsdWUgKyBcIikuKSokXCIsIFwiaVwiKTtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWc7XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3Rvci5wdXNoKHN1Yl9zZWxlY3Rvcik7XG4gIH0pO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5DcmVhdG9yLmlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiA9IGZ1bmN0aW9uKG9wZXJhdGlvbikge1xuICB2YXIgcmVmO1xuICByZXR1cm4gb3BlcmF0aW9uID09PSBcImJldHdlZW5cIiB8fCAhISgocmVmID0gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXModHJ1ZSkpICE9IG51bGwgPyByZWZbb3BlcmF0aW9uXSA6IHZvaWQgMCk7XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuXHRleHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9EZXYgPSBmdW5jdGlvbihmaWx0ZXJzLCBvYmplY3RfbmFtZSwgb3B0aW9ucykge1xuICB2YXIgbG9naWNUZW1wRmlsdGVycywgc2VsZWN0b3I7XG4gIGlmICghZmlsdGVycy5sZW5ndGgpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuaXNfbG9naWNfb3IgOiB2b2lkIDApIHtcbiAgICBsb2dpY1RlbXBGaWx0ZXJzID0gW107XG4gICAgZmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uKG4pIHtcbiAgICAgIGxvZ2ljVGVtcEZpbHRlcnMucHVzaChuKTtcbiAgICAgIHJldHVybiBsb2dpY1RlbXBGaWx0ZXJzLnB1c2goXCJvclwiKTtcbiAgICB9KTtcbiAgICBsb2dpY1RlbXBGaWx0ZXJzLnBvcCgpO1xuICAgIGZpbHRlcnMgPSBsb2dpY1RlbXBGaWx0ZXJzO1xuICB9XG4gIHNlbGVjdG9yID0gU3RlZWRvc0ZpbHRlcnMuZm9ybWF0RmlsdGVyc1RvRGV2KGZpbHRlcnMsIENyZWF0b3IuVVNFUl9DT05URVhUKTtcbiAgcmV0dXJuIHNlbGVjdG9yO1xufTtcblxuXG4vKlxub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcbmV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcbiAqL1xuXG5DcmVhdG9yLmZvcm1hdExvZ2ljRmlsdGVyc1RvRGV2ID0gZnVuY3Rpb24oZmlsdGVycywgZmlsdGVyX2xvZ2ljLCBvcHRpb25zKSB7XG4gIHZhciBmb3JtYXRfbG9naWM7XG4gIGZvcm1hdF9sb2dpYyA9IGZpbHRlcl9sb2dpYy5yZXBsYWNlKC9cXChcXHMrL2lnLCBcIihcIikucmVwbGFjZSgvXFxzK1xcKS9pZywgXCIpXCIpLnJlcGxhY2UoL1xcKC9nLCBcIltcIikucmVwbGFjZSgvXFwpL2csIFwiXVwiKS5yZXBsYWNlKC9cXHMrL2csIFwiLFwiKS5yZXBsYWNlKC8oYW5kfG9yKS9pZywgXCInJDEnXCIpO1xuICBmb3JtYXRfbG9naWMgPSBmb3JtYXRfbG9naWMucmVwbGFjZSgvKFxcZCkrL2lnLCBmdW5jdGlvbih4KSB7XG4gICAgdmFyIF9mLCBmaWVsZCwgb3B0aW9uLCBzdWJfc2VsZWN0b3IsIHZhbHVlO1xuICAgIF9mID0gZmlsdGVyc1t4IC0gMV07XG4gICAgZmllbGQgPSBfZi5maWVsZDtcbiAgICBvcHRpb24gPSBfZi5vcGVyYXRpb247XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShfZi52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUsIG51bGwsIG9wdGlvbnMpO1xuICAgIH1cbiAgICBzdWJfc2VsZWN0b3IgPSBbXTtcbiAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKG9wdGlvbiA9PT0gXCI9XCIpIHtcbiAgICAgICAgXy5lYWNoKHZhbHVlLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIHN1Yl9zZWxlY3Rvci5wdXNoKFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI8PlwiKSB7XG4gICAgICAgIF8uZWFjaCh2YWx1ZSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBzdWJfc2VsZWN0b3IucHVzaChbZmllbGQsIG9wdGlvbiwgdl0sIFwiYW5kXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF8uZWFjaCh2YWx1ZSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBzdWJfc2VsZWN0b3IucHVzaChbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT09IFwiYW5kXCIgfHwgc3ViX3NlbGVjdG9yW3N1Yl9zZWxlY3Rvci5sZW5ndGggLSAxXSA9PT0gXCJvclwiKSB7XG4gICAgICAgIHN1Yl9zZWxlY3Rvci5wb3AoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3ViX3NlbGVjdG9yID0gW2ZpZWxkLCBvcHRpb24sIHZhbHVlXTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJzdWJfc2VsZWN0b3JcIiwgc3ViX3NlbGVjdG9yKTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3ViX3NlbGVjdG9yKTtcbiAgfSk7XG4gIGZvcm1hdF9sb2dpYyA9IFwiW1wiICsgZm9ybWF0X2xvZ2ljICsgXCJdXCI7XG4gIHJldHVybiBDcmVhdG9yW1wiZXZhbFwiXShmb3JtYXRfbG9naWMpO1xufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIF9vYmplY3QsIHBlcm1pc3Npb25zLCByZWxhdGVkX29iamVjdF9uYW1lcywgcmVsYXRlZF9vYmplY3RzLCB1bnJlbGF0ZWRfb2JqZWN0cztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICByZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdO1xuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIV9vYmplY3QpIHtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXM7XG4gIH1cbiAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhfb2JqZWN0Ll9jb2xsZWN0aW9uX25hbWUpO1xuICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLCBcIm9iamVjdF9uYW1lXCIpO1xuICBpZiAoKHJlbGF0ZWRfb2JqZWN0X25hbWVzICE9IG51bGwgPyByZWxhdGVkX29iamVjdF9uYW1lcy5sZW5ndGggOiB2b2lkIDApID09PSAwKSB7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICB9XG4gIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgdW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cztcbiAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLmRpZmZlcmVuY2UocmVsYXRlZF9vYmplY3RfbmFtZXMsIHVucmVsYXRlZF9vYmplY3RzKTtcbiAgcmV0dXJuIF8uZmlsdGVyKHJlbGF0ZWRfb2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QpIHtcbiAgICB2YXIgYWxsb3dSZWFkLCBpc0FjdGl2ZSwgcmVmLCByZWxhdGVkX29iamVjdF9uYW1lO1xuICAgIHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdC5vYmplY3RfbmFtZTtcbiAgICBpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMTtcbiAgICBhbGxvd1JlYWQgPSAocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKSAhPSBudWxsID8gcmVmLmFsbG93UmVhZCA6IHZvaWQgMDtcbiAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIikge1xuICAgICAgYWxsb3dSZWFkID0gYWxsb3dSZWFkICYmIHBlcm1pc3Npb25zLmFsbG93UmVhZEZpbGVzO1xuICAgIH1cbiAgICByZXR1cm4gaXNBY3RpdmUgJiYgYWxsb3dSZWFkO1xuICB9KTtcbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdE5hbWVzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgcmVsYXRlZF9vYmplY3RzO1xuICByZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICByZXR1cm4gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsIFwib2JqZWN0X25hbWVcIik7XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RMaXN0QWN0aW9ucyA9IGZ1bmN0aW9uKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGFjdGlvbnM7XG4gIGFjdGlvbnMgPSBDcmVhdG9yLmdldEFjdGlvbnMocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIGFjdGlvbnMgPSBfLmZpbHRlcihhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICBpZiAoYWN0aW9uLm5hbWUgPT09IFwic3RhbmRhcmRfZm9sbG93XCIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGFjdGlvbi5uYW1lID09PSBcInN0YW5kYXJkX3F1ZXJ5XCIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGFjdGlvbi5vbiA9PT0gXCJsaXN0XCIpIHtcbiAgICAgIGlmICh0eXBlb2YgYWN0aW9uLnZpc2libGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gYWN0aW9uLnZpc2libGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBhY3Rpb24udmlzaWJsZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhY3Rpb25zO1xufTtcblxuQ3JlYXRvci5nZXRBY3Rpb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgYWN0aW9ucywgZGlzYWJsZWRfYWN0aW9ucywgb2JqLCBwZXJtaXNzaW9ucywgcmVmLCByZWYxO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICBkaXNhYmxlZF9hY3Rpb25zID0gcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucztcbiAgYWN0aW9ucyA9IF8uc29ydEJ5KF8udmFsdWVzKG9iai5hY3Rpb25zKSwgJ3NvcnQnKTtcbiAgaWYgKF8uaGFzKG9iaiwgJ2FsbG93X2N1c3RvbUFjdGlvbnMnKSkge1xuICAgIGFjdGlvbnMgPSBfLmZpbHRlcihhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICAgIHJldHVybiBfLmluY2x1ZGUob2JqLmFsbG93X2N1c3RvbUFjdGlvbnMsIGFjdGlvbi5uYW1lKSB8fCBfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuZ2V0T2JqZWN0KCdiYXNlJykuYWN0aW9ucykgfHwge30sIGFjdGlvbi5uYW1lKTtcbiAgICB9KTtcbiAgfVxuICBpZiAoXy5oYXMob2JqLCAnZXhjbHVkZV9hY3Rpb25zJykpIHtcbiAgICBhY3Rpb25zID0gXy5maWx0ZXIoYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgICByZXR1cm4gIV8uaW5jbHVkZShvYmouZXhjbHVkZV9hY3Rpb25zLCBhY3Rpb24ubmFtZSk7XG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgJiYgW1wicmVjb3JkXCIsIFwicmVjb3JkX29ubHlcIl0uaW5kZXhPZihhY3Rpb24ub24pID4gLTEgJiYgYWN0aW9uLm5hbWUgIT09ICdzdGFuZGFyZF9lZGl0Jykge1xuICAgICAgaWYgKGFjdGlvbi5vbiA9PT0gXCJyZWNvcmRfb25seVwiKSB7XG4gICAgICAgIHJldHVybiBhY3Rpb24ub24gPSAncmVjb3JkX29ubHlfbW9yZSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYWN0aW9uLm9uID0gJ3JlY29yZF9tb3JlJztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcImNtc19maWxlc1wiLCBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJdLmluZGV4T2Yob2JqZWN0X25hbWUpID4gLTEpIHtcbiAgICBpZiAoKHJlZiA9IGFjdGlvbnMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5uYW1lID09PSBcInN0YW5kYXJkX2VkaXRcIjtcbiAgICB9KSkgIT0gbnVsbCkge1xuICAgICAgcmVmLm9uID0gXCJyZWNvcmRfbW9yZVwiO1xuICAgIH1cbiAgICBpZiAoKHJlZjEgPSBhY3Rpb25zLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4ubmFtZSA9PT0gXCJkb3dubG9hZFwiO1xuICAgIH0pKSAhPSBudWxsKSB7XG4gICAgICByZWYxLm9uID0gXCJyZWNvcmRcIjtcbiAgICB9XG4gIH1cbiAgYWN0aW9ucyA9IF8uZmlsdGVyKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIHJldHVybiBfLmluZGV4T2YoZGlzYWJsZWRfYWN0aW9ucywgYWN0aW9uLm5hbWUpIDwgMDtcbiAgfSk7XG4gIHJldHVybiBhY3Rpb25zO1xufTtcblxuL+i/lOWbnuW9k+WJjeeUqOaIt+acieadg+mZkOiuv+mXrueahOaJgOaciWxpc3Rfdmlld++8jOWMheaLrOWIhuS6q+eahO+8jOeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahO+8iOmZpOmdnm93bmVy5Y+Y5LqG77yJ77yM5Lul5Y+K6buY6K6k55qE5YW25LuW6KeG5Zu+5rOo5oSPQ3JlYXRvci5nZXRQZXJtaXNzaW9uc+WHveaVsOS4reaYr+S4jeS8muacieeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahOinhuWbvueahO+8jOaJgOS7pUNyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mi7/liLDnmoTnu5PmnpzkuI3lhajvvIzlubbkuI3mmK/lvZPliY3nlKjmiLfog73nnIvliLDmiYDmnInop4blm74vO1xuXG5DcmVhdG9yLmdldExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGRpc2FibGVkX2xpc3Rfdmlld3MsIGlzTW9iaWxlLCBsaXN0Vmlld3MsIGxpc3Rfdmlld3MsIG9iamVjdCwgcmVmO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBkaXNhYmxlZF9saXN0X3ZpZXdzID0gKChyZWYgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKSAhPSBudWxsID8gcmVmLmRpc2FibGVkX2xpc3Rfdmlld3MgOiB2b2lkIDApIHx8IFtdO1xuICBsaXN0X3ZpZXdzID0gW107XG4gIGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpO1xuICBfLmVhY2gob2JqZWN0Lmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHJldHVybiBpdGVtLm5hbWUgPSBpdGVtX25hbWU7XG4gIH0pO1xuICBsaXN0Vmlld3MgPSBfLnNvcnRCeShfLnZhbHVlcyhvYmplY3QubGlzdF92aWV3cyksICdzb3J0X25vJyk7XG4gIF8uZWFjaChsaXN0Vmlld3MsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgaXNEaXNhYmxlZDtcbiAgICBpZiAoaXNNb2JpbGUgJiYgaXRlbS50eXBlID09PSBcImNhbGVuZGFyXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGl0ZW0ubmFtZSAhPT0gXCJkZWZhdWx0XCIpIHtcbiAgICAgIGlzRGlzYWJsZWQgPSBfLmluZGV4T2YoZGlzYWJsZWRfbGlzdF92aWV3cywgaXRlbS5uYW1lKSA+IC0xIHx8IChpdGVtLl9pZCAmJiBfLmluZGV4T2YoZGlzYWJsZWRfbGlzdF92aWV3cywgaXRlbS5faWQpID4gLTEpO1xuICAgICAgaWYgKCFpc0Rpc2FibGVkIHx8IGl0ZW0ub3duZXIgPT09IHVzZXJJZCkge1xuICAgICAgICByZXR1cm4gbGlzdF92aWV3cy5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBsaXN0X3ZpZXdzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBmaWVsZHNOYW1lLCByZWYsIHVucmVhZGFibGVfZmllbGRzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIGZpZWxkc05hbWUgPSBDcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUob2JqZWN0X25hbWUpO1xuICB1bnJlYWRhYmxlX2ZpZWxkcyA9IChyZWYgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKSAhPSBudWxsID8gcmVmLnVucmVhZGFibGVfZmllbGRzIDogdm9pZCAwO1xuICByZXR1cm4gXy5kaWZmZXJlbmNlKGZpZWxkc05hbWUsIHVucmVhZGFibGVfZmllbGRzKTtcbn07XG5cbkNyZWF0b3IuaXNsb2FkaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhQ3JlYXRvci5ib290c3RyYXBMb2FkZWQuZ2V0KCk7XG59O1xuXG5DcmVhdG9yLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIik7XG59O1xuXG5DcmVhdG9yLmdldERpc2FibGVkRmllbGRzID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBmaWVsZHM7XG4gIGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQsIGZpZWxkTmFtZSkge1xuICAgIHJldHVybiBmaWVsZC5hdXRvZm9ybSAmJiBmaWVsZC5hdXRvZm9ybS5kaXNhYmxlZCAmJiAhZmllbGQuYXV0b2Zvcm0ub21pdCAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0SGlkZGVuRmllbGRzID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBmaWVsZHM7XG4gIGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQsIGZpZWxkTmFtZSkge1xuICAgIHJldHVybiBmaWVsZC5hdXRvZm9ybSAmJiBmaWVsZC5hdXRvZm9ybS50eXBlID09PSBcImhpZGRlblwiICYmICFmaWVsZC5hdXRvZm9ybS5vbWl0ICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNXaXRoTm9Hcm91cCA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gKCFmaWVsZC5hdXRvZm9ybSB8fCAhZmllbGQuYXV0b2Zvcm0uZ3JvdXAgfHwgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT09IFwiLVwiKSAmJiAoIWZpZWxkLmF1dG9mb3JtIHx8IGZpZWxkLmF1dG9mb3JtLnR5cGUgIT09IFwiaGlkZGVuXCIpICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRTb3J0ZWRGaWVsZEdyb3VwTmFtZXMgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIG5hbWVzO1xuICBuYW1lcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgIT09IFwiLVwiICYmIGZpZWxkLmF1dG9mb3JtLmdyb3VwO1xuICB9KTtcbiAgbmFtZXMgPSBfLmNvbXBhY3QobmFtZXMpO1xuICBuYW1lcyA9IF8udW5pcXVlKG5hbWVzKTtcbiAgcmV0dXJuIG5hbWVzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNGb3JHcm91cCA9IGZ1bmN0aW9uKHNjaGVtYSwgZ3JvdXBOYW1lKSB7XG4gIHZhciBmaWVsZHM7XG4gIGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQsIGZpZWxkTmFtZSkge1xuICAgIHJldHVybiBmaWVsZC5hdXRvZm9ybSAmJiBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PT0gZ3JvdXBOYW1lICYmIGZpZWxkLmF1dG9mb3JtLnR5cGUgIT09IFwiaGlkZGVuXCIgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldFN5c3RlbUJhc2VGaWVsZHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFtcImNyZWF0ZWRcIiwgXCJjcmVhdGVkX2J5XCIsIFwibW9kaWZpZWRcIiwgXCJtb2RpZmllZF9ieVwiXTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aG91dFN5c3RlbUJhc2UgPSBmdW5jdGlvbihrZXlzKSB7XG4gIHJldHVybiBfLmRpZmZlcmVuY2Uoa2V5cywgQ3JlYXRvci5nZXRTeXN0ZW1CYXNlRmllbGRzKCkpO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNXaXRob3V0T21pdCA9IGZ1bmN0aW9uKHNjaGVtYSwga2V5cykge1xuICBrZXlzID0gXy5tYXAoa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIGZpZWxkLCByZWY7XG4gICAgZmllbGQgPSBfLnBpY2soc2NoZW1hLCBrZXkpO1xuICAgIGlmICgocmVmID0gZmllbGRba2V5XS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi5vbWl0IDogdm9pZCAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICB9KTtcbiAga2V5cyA9IF8uY29tcGFjdChrZXlzKTtcbiAgcmV0dXJuIGtleXM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc0luRmlyc3RMZXZlbCA9IGZ1bmN0aW9uKGZpcnN0TGV2ZWxLZXlzLCBrZXlzKSB7XG4gIGtleXMgPSBfLm1hcChrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoXy5pbmRleE9mKGZpcnN0TGV2ZWxLZXlzLCBrZXkpID4gLTEpIHtcbiAgICAgIHJldHVybiBrZXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuICBrZXlzID0gXy5jb21wYWN0KGtleXMpO1xuICByZXR1cm4ga2V5cztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzRm9yUmVvcmRlciA9IGZ1bmN0aW9uKHNjaGVtYSwga2V5cywgaXNTaW5nbGUpIHtcbiAgdmFyIF9rZXlzLCBjaGlsZEtleXMsIGZpZWxkcywgaSwgaXNfd2lkZV8xLCBpc193aWRlXzIsIHNjXzEsIHNjXzI7XG4gIGZpZWxkcyA9IFtdO1xuICBpID0gMDtcbiAgX2tleXMgPSBfLmZpbHRlcihrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gIWtleS5lbmRzV2l0aCgnX2VuZExpbmUnKTtcbiAgfSk7XG4gIHdoaWxlIChpIDwgX2tleXMubGVuZ3RoKSB7XG4gICAgc2NfMSA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2ldKTtcbiAgICBzY18yID0gXy5waWNrKHNjaGVtYSwgX2tleXNbaSArIDFdKTtcbiAgICBpc193aWRlXzEgPSBmYWxzZTtcbiAgICBpc193aWRlXzIgPSBmYWxzZTtcbiAgICBfLmVhY2goc2NfMSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciByZWYsIHJlZjE7XG4gICAgICBpZiAoKChyZWYgPSB2YWx1ZS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi5pc193aWRlIDogdm9pZCAwKSB8fCAoKHJlZjEgPSB2YWx1ZS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjEudHlwZSA6IHZvaWQgMCkgPT09IFwidGFibGVcIikge1xuICAgICAgICByZXR1cm4gaXNfd2lkZV8xID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBfLmVhY2goc2NfMiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciByZWYsIHJlZjE7XG4gICAgICBpZiAoKChyZWYgPSB2YWx1ZS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi5pc193aWRlIDogdm9pZCAwKSB8fCAoKHJlZjEgPSB2YWx1ZS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjEudHlwZSA6IHZvaWQgMCkgPT09IFwidGFibGVcIikge1xuICAgICAgICByZXR1cm4gaXNfd2lkZV8yID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICBpc193aWRlXzEgPSB0cnVlO1xuICAgICAgaXNfd2lkZV8yID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGlzU2luZ2xlKSB7XG4gICAgICBmaWVsZHMucHVzaChfa2V5cy5zbGljZShpLCBpICsgMSkpO1xuICAgICAgaSArPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNfd2lkZV8xKSB7XG4gICAgICAgIGZpZWxkcy5wdXNoKF9rZXlzLnNsaWNlKGksIGkgKyAxKSk7XG4gICAgICAgIGkgKz0gMTtcbiAgICAgIH0gZWxzZSBpZiAoIWlzX3dpZGVfMSAmJiBpc193aWRlXzIpIHtcbiAgICAgICAgY2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSArIDEpO1xuICAgICAgICBjaGlsZEtleXMucHVzaCh2b2lkIDApO1xuICAgICAgICBmaWVsZHMucHVzaChjaGlsZEtleXMpO1xuICAgICAgICBpICs9IDE7XG4gICAgICB9IGVsc2UgaWYgKCFpc193aWRlXzEgJiYgIWlzX3dpZGVfMikge1xuICAgICAgICBjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpICsgMSk7XG4gICAgICAgIGlmIChfa2V5c1tpICsgMV0pIHtcbiAgICAgICAgICBjaGlsZEtleXMucHVzaChfa2V5c1tpICsgMV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNoaWxkS2V5cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIH1cbiAgICAgICAgZmllbGRzLnB1c2goY2hpbGRLZXlzKTtcbiAgICAgICAgaSArPSAyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5pc0ZpbHRlclZhbHVlRW1wdHkgPSBmdW5jdGlvbih2KSB7XG4gIHJldHVybiB0eXBlb2YgdiA9PT0gXCJ1bmRlZmluZWRcIiB8fCB2ID09PSBudWxsIHx8IE51bWJlci5pc05hTih2KSB8fCB2Lmxlbmd0aCA9PT0gMDtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGREYXRhVHlwZSA9IGZ1bmN0aW9uKG9iamVjdEZpZWxkcywga2V5KSB7XG4gIHZhciByZWYsIHJlc3VsdDtcbiAgaWYgKG9iamVjdEZpZWxkcyAmJiBrZXkpIHtcbiAgICByZXN1bHQgPSAocmVmID0gb2JqZWN0RmllbGRzW2tleV0pICE9IG51bGwgPyByZWYudHlwZSA6IHZvaWQgMDtcbiAgICBpZiAoW1wiZm9ybXVsYVwiLCBcInN1bW1hcnlcIl0uaW5kZXhPZihyZXN1bHQpID4gLTEpIHtcbiAgICAgIHJlc3VsdCA9IG9iamVjdEZpZWxkc1trZXldLmRhdGFfdHlwZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXCJ0ZXh0XCI7XG4gIH1cbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ3JlYXRvci5nZXRBbGxSZWxhdGVkT2JqZWN0cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICAgIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW107XG4gICAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICAgIHJldHVybiBfLmVhY2gocmVsYXRlZF9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgICAgaWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT09IG9iamVjdF9uYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzLnB1c2gocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZW5hYmxlX2ZpbGVzKSB7XG4gICAgICByZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoKFwiY21zX2ZpbGVzXCIpO1xuICAgIH1cbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXM7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5mb3JtYXRJbmRleCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIGluZGV4TmFtZSwgaXNkb2N1bWVudERCLCBvYmplY3QsIHJlZiwgcmVmMSwgcmVmMjtcbiAgICBvYmplY3QgPSB7XG4gICAgICBiYWNrZ3JvdW5kOiB0cnVlXG4gICAgfTtcbiAgICBpc2RvY3VtZW50REIgPSAoKHJlZiA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWYxID0gcmVmLmRhdGFzb3VyY2VzKSAhPSBudWxsID8gKHJlZjIgPSByZWYxW1wiZGVmYXVsdFwiXSkgIT0gbnVsbCA/IHJlZjIuZG9jdW1lbnREQiA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMCkgfHwgZmFsc2U7XG4gICAgaWYgKGlzZG9jdW1lbnREQikge1xuICAgICAgaWYgKGFycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgaW5kZXhOYW1lID0gYXJyYXkuam9pbihcIi5cIik7XG4gICAgICAgIG9iamVjdC5uYW1lID0gaW5kZXhOYW1lO1xuICAgICAgICBpZiAoaW5kZXhOYW1lLmxlbmd0aCA+IDUyKSB7XG4gICAgICAgICAgb2JqZWN0Lm5hbWUgPSBpbmRleE5hbWUuc3Vic3RyaW5nKDAsIDUyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9O1xufVxuIiwiQ3JlYXRvci5hcHBzQnlOYW1lID0ge31cblxuIiwiTWV0ZW9yLm1ldGhvZHNcblx0XCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc3BhY2VfaWQpLT5cblx0XHRpZiAhdGhpcy51c2VySWRcblx0XHRcdHJldHVybiBudWxsXG5cblx0XHRpZiBvYmplY3RfbmFtZSA9PSBcIm9iamVjdF9yZWNlbnRfdmlld2VkXCJcblx0XHRcdHJldHVyblxuXHRcdGlmIG9iamVjdF9uYW1lIGFuZCByZWNvcmRfaWRcblx0XHRcdGlmICFzcGFjZV9pZFxuXHRcdFx0XHRkb2MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmRPbmUoe19pZDogcmVjb3JkX2lkfSwge2ZpZWxkczoge3NwYWNlOiAxfX0pXG5cdFx0XHRcdHNwYWNlX2lkID0gZG9jPy5zcGFjZVxuXG5cdFx0XHRjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiKVxuXHRcdFx0ZmlsdGVycyA9IHsgb3duZXI6IHRoaXMudXNlcklkLCBzcGFjZTogc3BhY2VfaWQsICdyZWNvcmQubyc6IG9iamVjdF9uYW1lLCAncmVjb3JkLmlkcyc6IFtyZWNvcmRfaWRdfVxuXHRcdFx0Y3VycmVudF9yZWNlbnRfdmlld2VkID0gY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLmZpbmRPbmUoZmlsdGVycylcblx0XHRcdGlmIGN1cnJlbnRfcmVjZW50X3ZpZXdlZFxuXHRcdFx0XHRjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQudXBkYXRlKFxuXHRcdFx0XHRcdGN1cnJlbnRfcmVjZW50X3ZpZXdlZC5faWQsXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0JGluYzoge1xuXHRcdFx0XHRcdFx0XHRjb3VudDogMVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWQ6IG5ldyBEYXRlKClcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5pbnNlcnQoXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0X2lkOiBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuX21ha2VOZXdJRCgpXG5cdFx0XHRcdFx0XHRvd25lcjogdGhpcy51c2VySWRcblx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZV9pZFxuXHRcdFx0XHRcdFx0cmVjb3JkOiB7bzogb2JqZWN0X25hbWUsIGlkczogW3JlY29yZF9pZF19XG5cdFx0XHRcdFx0XHRjb3VudDogMVxuXHRcdFx0XHRcdFx0Y3JlYXRlZDogbmV3IERhdGUoKVxuXHRcdFx0XHRcdFx0Y3JlYXRlZF9ieTogdGhpcy51c2VySWRcblx0XHRcdFx0XHRcdG1vZGlmaWVkOiBuZXcgRGF0ZSgpXG5cdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogdGhpcy51c2VySWRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdClcblx0XHRcdHJldHVybiIsIk1ldGVvci5tZXRob2RzKHtcbiAgXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZV9pZCkge1xuICAgIHZhciBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQsIGN1cnJlbnRfcmVjZW50X3ZpZXdlZCwgZG9jLCBmaWx0ZXJzO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAob2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgICBpZiAoIXNwYWNlX2lkKSB7XG4gICAgICAgIGRvYyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZE9uZSh7XG4gICAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgc3BhY2U6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzcGFjZV9pZCA9IGRvYyAhPSBudWxsID8gZG9jLnNwYWNlIDogdm9pZCAwO1xuICAgICAgfVxuICAgICAgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIik7XG4gICAgICBmaWx0ZXJzID0ge1xuICAgICAgICBvd25lcjogdGhpcy51c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgJ3JlY29yZC5vJzogb2JqZWN0X25hbWUsXG4gICAgICAgICdyZWNvcmQuaWRzJzogW3JlY29yZF9pZF1cbiAgICAgIH07XG4gICAgICBjdXJyZW50X3JlY2VudF92aWV3ZWQgPSBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuZmluZE9uZShmaWx0ZXJzKTtcbiAgICAgIGlmIChjdXJyZW50X3JlY2VudF92aWV3ZWQpIHtcbiAgICAgICAgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLnVwZGF0ZShjdXJyZW50X3JlY2VudF92aWV3ZWQuX2lkLCB7XG4gICAgICAgICAgJGluYzoge1xuICAgICAgICAgICAgY291bnQ6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5pbnNlcnQoe1xuICAgICAgICAgIF9pZDogY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLl9tYWtlTmV3SUQoKSxcbiAgICAgICAgICBvd25lcjogdGhpcy51c2VySWQsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIHJlY29yZDoge1xuICAgICAgICAgICAgbzogb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBpZHM6IFtyZWNvcmRfaWRdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IHRoaXMudXNlcklkLFxuICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuIiwicmVjZW50X2FnZ3JlZ2F0ZSA9IChjcmVhdGVkX2J5LCBzcGFjZUlkLCBfcmVjb3JkcywgY2FsbGJhY2spLT5cblx0Q3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfcmVjZW50X3ZpZXdlZC5yYXdDb2xsZWN0aW9uKCkuYWdncmVnYXRlKFtcblx0XHR7JG1hdGNoOiB7Y3JlYXRlZF9ieTogY3JlYXRlZF9ieSwgc3BhY2U6IHNwYWNlSWR9fSxcblx0XHR7JGdyb3VwOiB7X2lkOiB7b2JqZWN0X25hbWU6IFwiJHJlY29yZC5vXCIsIHJlY29yZF9pZDogXCIkcmVjb3JkLmlkc1wiLCBzcGFjZTogXCIkc3BhY2VcIn0sIG1heENyZWF0ZWQ6IHskbWF4OiBcIiRjcmVhdGVkXCJ9fX0sXG5cdFx0eyRzb3J0OiB7bWF4Q3JlYXRlZDogLTF9fSxcblx0XHR7JGxpbWl0OiAxMH1cblx0XSkudG9BcnJheSAoZXJyLCBkYXRhKS0+XG5cdFx0aWYgZXJyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyKVxuXG5cdFx0ZGF0YS5mb3JFYWNoIChkb2MpIC0+XG5cdFx0XHRfcmVjb3Jkcy5wdXNoIGRvYy5faWRcblxuXHRcdGlmIGNhbGxiYWNrICYmIF8uaXNGdW5jdGlvbihjYWxsYmFjaylcblx0XHRcdGNhbGxiYWNrKClcblxuXHRcdHJldHVyblxuXG5hc3luY19yZWNlbnRfYWdncmVnYXRlID0gTWV0ZW9yLndyYXBBc3luYyhyZWNlbnRfYWdncmVnYXRlKVxuXG5zZWFyY2hfb2JqZWN0ID0gKHNwYWNlLCBvYmplY3RfbmFtZSx1c2VySWQsIHNlYXJjaFRleHQpLT5cblx0ZGF0YSA9IG5ldyBBcnJheSgpXG5cblx0aWYgc2VhcmNoVGV4dFxuXG5cdFx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdFx0X29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxuXHRcdF9vYmplY3RfbmFtZV9rZXkgPSBfb2JqZWN0Py5OQU1FX0ZJRUxEX0tFWVxuXHRcdGlmIF9vYmplY3QgJiYgX29iamVjdF9jb2xsZWN0aW9uICYmIF9vYmplY3RfbmFtZV9rZXlcblx0XHRcdHF1ZXJ5ID0ge31cblx0XHRcdHNlYXJjaF9LZXl3b3JkcyA9IHNlYXJjaFRleHQuc3BsaXQoXCIgXCIpXG5cdFx0XHRxdWVyeV9hbmQgPSBbXVxuXHRcdFx0c2VhcmNoX0tleXdvcmRzLmZvckVhY2ggKGtleXdvcmQpLT5cblx0XHRcdFx0c3VicXVlcnkgPSB7fVxuXHRcdFx0XHRzdWJxdWVyeVtfb2JqZWN0X25hbWVfa2V5XSA9IHskcmVnZXg6IGtleXdvcmQudHJpbSgpfVxuXHRcdFx0XHRxdWVyeV9hbmQucHVzaCBzdWJxdWVyeVxuXG5cdFx0XHRxdWVyeS4kYW5kID0gcXVlcnlfYW5kXG5cdFx0XHRxdWVyeS5zcGFjZSA9IHskaW46IFtzcGFjZV19XG5cblx0XHRcdGZpZWxkcyA9IHtfaWQ6IDF9XG5cdFx0XHRmaWVsZHNbX29iamVjdF9uYW1lX2tleV0gPSAxXG5cblx0XHRcdHJlY29yZHMgPSBfb2JqZWN0X2NvbGxlY3Rpb24uZmluZChxdWVyeSwge2ZpZWxkczogZmllbGRzLCBzb3J0OiB7bW9kaWZpZWQ6IDF9LCBsaW1pdDogNX0pXG5cblx0XHRcdHJlY29yZHMuZm9yRWFjaCAocmVjb3JkKS0+XG5cdFx0XHRcdGRhdGEucHVzaCB7X2lkOiByZWNvcmQuX2lkLCBfbmFtZTogcmVjb3JkW19vYmplY3RfbmFtZV9rZXldLCBfb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lfVxuXHRcblx0cmV0dXJuIGRhdGFcblxuTWV0ZW9yLm1ldGhvZHNcblx0J29iamVjdF9yZWNlbnRfcmVjb3JkJzogKHNwYWNlSWQpLT5cblx0XHRkYXRhID0gbmV3IEFycmF5KClcblx0XHRyZWNvcmRzID0gbmV3IEFycmF5KClcblx0XHRhc3luY19yZWNlbnRfYWdncmVnYXRlKHRoaXMudXNlcklkLCBzcGFjZUlkLCByZWNvcmRzKVxuXHRcdHJlY29yZHMuZm9yRWFjaCAoaXRlbSktPlxuXHRcdFx0cmVjb3JkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpXG5cblx0XHRcdGlmICFyZWNvcmRfb2JqZWN0XG5cdFx0XHRcdHJldHVyblxuXG5cdFx0XHRyZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSlcblxuXHRcdFx0aWYgcmVjb3JkX29iamVjdCAmJiByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb25cblx0XHRcdFx0ZmllbGRzID0ge19pZDogMX1cblxuXHRcdFx0XHRmaWVsZHNbcmVjb3JkX29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gPSAxXG5cblx0XHRcdFx0cmVjb3JkID0gcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uLmZpbmRPbmUoaXRlbS5yZWNvcmRfaWRbMF0sIHtmaWVsZHM6IGZpZWxkc30pXG5cdFx0XHRcdGlmIHJlY29yZFxuXHRcdFx0XHRcdGRhdGEucHVzaCB7X2lkOiByZWNvcmQuX2lkLCBfbmFtZTogcmVjb3JkW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldLCBfb2JqZWN0X25hbWU6IGl0ZW0ub2JqZWN0X25hbWV9XG5cblx0XHRyZXR1cm4gZGF0YVxuXG5cdCdvYmplY3RfcmVjb3JkX3NlYXJjaCc6IChvcHRpb25zKS0+XG5cdFx0c2VsZiA9IHRoaXNcblxuXHRcdGRhdGEgPSBuZXcgQXJyYXkoKVxuXG5cdFx0c2VhcmNoVGV4dCA9IG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdHNwYWNlID0gb3B0aW9ucy5zcGFjZVxuXG5cdFx0Xy5mb3JFYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKF9vYmplY3QsIG5hbWUpLT5cblx0XHRcdGlmIF9vYmplY3QuZW5hYmxlX3NlYXJjaFxuXHRcdFx0XHRvYmplY3RfcmVjb3JkID0gc2VhcmNoX29iamVjdChzcGFjZSwgX29iamVjdC5uYW1lLCBzZWxmLnVzZXJJZCwgc2VhcmNoVGV4dClcblx0XHRcdFx0ZGF0YSA9IGRhdGEuY29uY2F0KG9iamVjdF9yZWNvcmQpXG5cblx0XHRyZXR1cm4gZGF0YVxuIiwidmFyIGFzeW5jX3JlY2VudF9hZ2dyZWdhdGUsIHJlY2VudF9hZ2dyZWdhdGUsIHNlYXJjaF9vYmplY3Q7XG5cbnJlY2VudF9hZ2dyZWdhdGUgPSBmdW5jdGlvbihjcmVhdGVkX2J5LCBzcGFjZUlkLCBfcmVjb3JkcywgY2FsbGJhY2spIHtcbiAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3JlY2VudF92aWV3ZWQucmF3Q29sbGVjdGlvbigpLmFnZ3JlZ2F0ZShbXG4gICAge1xuICAgICAgJG1hdGNoOiB7XG4gICAgICAgIGNyZWF0ZWRfYnk6IGNyZWF0ZWRfYnksXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgJGdyb3VwOiB7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBcIiRyZWNvcmQub1wiLFxuICAgICAgICAgIHJlY29yZF9pZDogXCIkcmVjb3JkLmlkc1wiLFxuICAgICAgICAgIHNwYWNlOiBcIiRzcGFjZVwiXG4gICAgICAgIH0sXG4gICAgICAgIG1heENyZWF0ZWQ6IHtcbiAgICAgICAgICAkbWF4OiBcIiRjcmVhdGVkXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgICRzb3J0OiB7XG4gICAgICAgIG1heENyZWF0ZWQ6IC0xXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgJGxpbWl0OiAxMFxuICAgIH1cbiAgXSkudG9BcnJheShmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyKTtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGRvYykge1xuICAgICAgcmV0dXJuIF9yZWNvcmRzLnB1c2goZG9jLl9pZCk7XG4gICAgfSk7XG4gICAgaWYgKGNhbGxiYWNrICYmIF8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9KTtcbn07XG5cbmFzeW5jX3JlY2VudF9hZ2dyZWdhdGUgPSBNZXRlb3Iud3JhcEFzeW5jKHJlY2VudF9hZ2dyZWdhdGUpO1xuXG5zZWFyY2hfb2JqZWN0ID0gZnVuY3Rpb24oc3BhY2UsIG9iamVjdF9uYW1lLCB1c2VySWQsIHNlYXJjaFRleHQpIHtcbiAgdmFyIF9vYmplY3QsIF9vYmplY3RfY29sbGVjdGlvbiwgX29iamVjdF9uYW1lX2tleSwgZGF0YSwgZmllbGRzLCBxdWVyeSwgcXVlcnlfYW5kLCByZWNvcmRzLCBzZWFyY2hfS2V5d29yZHM7XG4gIGRhdGEgPSBuZXcgQXJyYXkoKTtcbiAgaWYgKHNlYXJjaFRleHQpIHtcbiAgICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIF9vYmplY3RfY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSk7XG4gICAgX29iamVjdF9uYW1lX2tleSA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuTkFNRV9GSUVMRF9LRVkgOiB2b2lkIDA7XG4gICAgaWYgKF9vYmplY3QgJiYgX29iamVjdF9jb2xsZWN0aW9uICYmIF9vYmplY3RfbmFtZV9rZXkpIHtcbiAgICAgIHF1ZXJ5ID0ge307XG4gICAgICBzZWFyY2hfS2V5d29yZHMgPSBzZWFyY2hUZXh0LnNwbGl0KFwiIFwiKTtcbiAgICAgIHF1ZXJ5X2FuZCA9IFtdO1xuICAgICAgc2VhcmNoX0tleXdvcmRzLmZvckVhY2goZnVuY3Rpb24oa2V5d29yZCkge1xuICAgICAgICB2YXIgc3VicXVlcnk7XG4gICAgICAgIHN1YnF1ZXJ5ID0ge307XG4gICAgICAgIHN1YnF1ZXJ5W19vYmplY3RfbmFtZV9rZXldID0ge1xuICAgICAgICAgICRyZWdleDoga2V5d29yZC50cmltKClcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHF1ZXJ5X2FuZC5wdXNoKHN1YnF1ZXJ5KTtcbiAgICAgIH0pO1xuICAgICAgcXVlcnkuJGFuZCA9IHF1ZXJ5X2FuZDtcbiAgICAgIHF1ZXJ5LnNwYWNlID0ge1xuICAgICAgICAkaW46IFtzcGFjZV1cbiAgICAgIH07XG4gICAgICBmaWVsZHMgPSB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfTtcbiAgICAgIGZpZWxkc1tfb2JqZWN0X25hbWVfa2V5XSA9IDE7XG4gICAgICByZWNvcmRzID0gX29iamVjdF9jb2xsZWN0aW9uLmZpbmQocXVlcnksIHtcbiAgICAgICAgZmllbGRzOiBmaWVsZHMsXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBtb2RpZmllZDogMVxuICAgICAgICB9LFxuICAgICAgICBsaW1pdDogNVxuICAgICAgfSk7XG4gICAgICByZWNvcmRzLmZvckVhY2goZnVuY3Rpb24ocmVjb3JkKSB7XG4gICAgICAgIHJldHVybiBkYXRhLnB1c2goe1xuICAgICAgICAgIF9pZDogcmVjb3JkLl9pZCxcbiAgICAgICAgICBfbmFtZTogcmVjb3JkW19vYmplY3RfbmFtZV9rZXldLFxuICAgICAgICAgIF9vYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gICdvYmplY3RfcmVjZW50X3JlY29yZCc6IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgZGF0YSwgcmVjb3JkcztcbiAgICBkYXRhID0gbmV3IEFycmF5KCk7XG4gICAgcmVjb3JkcyA9IG5ldyBBcnJheSgpO1xuICAgIGFzeW5jX3JlY2VudF9hZ2dyZWdhdGUodGhpcy51c2VySWQsIHNwYWNlSWQsIHJlY29yZHMpO1xuICAgIHJlY29yZHMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICB2YXIgZmllbGRzLCByZWNvcmQsIHJlY29yZF9vYmplY3QsIHJlY29yZF9vYmplY3RfY29sbGVjdGlvbjtcbiAgICAgIHJlY29yZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChpdGVtLm9iamVjdF9uYW1lLCBpdGVtLnNwYWNlKTtcbiAgICAgIGlmICghcmVjb3JkX29iamVjdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSk7XG4gICAgICBpZiAocmVjb3JkX29iamVjdCAmJiByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24pIHtcbiAgICAgICAgZmllbGRzID0ge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9O1xuICAgICAgICBmaWVsZHNbcmVjb3JkX29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gPSAxO1xuICAgICAgICByZWNvcmQgPSByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24uZmluZE9uZShpdGVtLnJlY29yZF9pZFswXSwge1xuICAgICAgICAgIGZpZWxkczogZmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGEucHVzaCh7XG4gICAgICAgICAgICBfaWQ6IHJlY29yZC5faWQsXG4gICAgICAgICAgICBfbmFtZTogcmVjb3JkW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldLFxuICAgICAgICAgICAgX29iamVjdF9uYW1lOiBpdGVtLm9iamVjdF9uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfSxcbiAgJ29iamVjdF9yZWNvcmRfc2VhcmNoJzogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBkYXRhLCBzZWFyY2hUZXh0LCBzZWxmLCBzcGFjZTtcbiAgICBzZWxmID0gdGhpcztcbiAgICBkYXRhID0gbmV3IEFycmF5KCk7XG4gICAgc2VhcmNoVGV4dCA9IG9wdGlvbnMuc2VhcmNoVGV4dDtcbiAgICBzcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gICAgXy5mb3JFYWNoKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgZnVuY3Rpb24oX29iamVjdCwgbmFtZSkge1xuICAgICAgdmFyIG9iamVjdF9yZWNvcmQ7XG4gICAgICBpZiAoX29iamVjdC5lbmFibGVfc2VhcmNoKSB7XG4gICAgICAgIG9iamVjdF9yZWNvcmQgPSBzZWFyY2hfb2JqZWN0KHNwYWNlLCBfb2JqZWN0Lm5hbWUsIHNlbGYudXNlcklkLCBzZWFyY2hUZXh0KTtcbiAgICAgICAgcmV0dXJuIGRhdGEgPSBkYXRhLmNvbmNhdChvYmplY3RfcmVjb3JkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuICAgIHVwZGF0ZV9maWx0ZXJzOiAobGlzdHZpZXdfaWQsIGZpbHRlcnMsIGZpbHRlcl9zY29wZSwgZmlsdGVyX2xvZ2ljKS0+XG4gICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy5kaXJlY3QudXBkYXRlKHtfaWQ6IGxpc3R2aWV3X2lkfSwgeyRzZXQ6IHtmaWx0ZXJzOiBmaWx0ZXJzLCBmaWx0ZXJfc2NvcGU6IGZpbHRlcl9zY29wZSwgZmlsdGVyX2xvZ2ljOiBmaWx0ZXJfbG9naWN9fSlcblxuICAgIHVwZGF0ZV9jb2x1bW5zOiAobGlzdHZpZXdfaWQsIGNvbHVtbnMpLT5cbiAgICAgICAgY2hlY2soY29sdW1ucywgQXJyYXkpXG4gICAgICAgIFxuICAgICAgICBpZiBjb2x1bW5zLmxlbmd0aCA8IDFcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAwLCBcIlNlbGVjdCBhdCBsZWFzdCBvbmUgZmllbGQgdG8gZGlzcGxheVwiXG4gICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy51cGRhdGUoe19pZDogbGlzdHZpZXdfaWR9LCB7JHNldDoge2NvbHVtbnM6IGNvbHVtbnN9fSlcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgdXBkYXRlX2ZpbHRlcnM6IGZ1bmN0aW9uKGxpc3R2aWV3X2lkLCBmaWx0ZXJzLCBmaWx0ZXJfc2NvcGUsIGZpbHRlcl9sb2dpYykge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IGxpc3R2aWV3X2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBmaWx0ZXJzOiBmaWx0ZXJzLFxuICAgICAgICBmaWx0ZXJfc2NvcGU6IGZpbHRlcl9zY29wZSxcbiAgICAgICAgZmlsdGVyX2xvZ2ljOiBmaWx0ZXJfbG9naWNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlX2NvbHVtbnM6IGZ1bmN0aW9uKGxpc3R2aWV3X2lkLCBjb2x1bW5zKSB7XG4gICAgY2hlY2soY29sdW1ucywgQXJyYXkpO1xuICAgIGlmIChjb2x1bW5zLmxlbmd0aCA8IDEpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIlNlbGVjdCBhdCBsZWFzdCBvbmUgZmllbGQgdG8gZGlzcGxheVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy51cGRhdGUoe1xuICAgICAgX2lkOiBsaXN0dmlld19pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgY29sdW1uczogY29sdW1uc1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdCdyZXBvcnRfZGF0YSc6IChvcHRpb25zKS0+XG5cdFx0Y2hlY2sob3B0aW9ucywgT2JqZWN0KVxuXHRcdHNwYWNlID0gb3B0aW9ucy5zcGFjZVxuXHRcdGZpZWxkcyA9IG9wdGlvbnMuZmllbGRzXG5cdFx0b2JqZWN0X25hbWUgPSBvcHRpb25zLm9iamVjdF9uYW1lXG5cdFx0ZmlsdGVyX3Njb3BlID0gb3B0aW9ucy5maWx0ZXJfc2NvcGVcblx0XHRmaWx0ZXJzID0gb3B0aW9ucy5maWx0ZXJzXG5cdFx0ZmlsdGVyRmllbGRzID0ge31cblx0XHRjb21wb3VuZEZpZWxkcyA9IFtdXG5cdFx0b2JqZWN0RmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5maWVsZHNcblx0XHRfLmVhY2ggZmllbGRzLCAoaXRlbSwgaW5kZXgpLT5cblx0XHRcdHNwbGl0cyA9IGl0ZW0uc3BsaXQoXCIuXCIpXG5cdFx0XHRuYW1lID0gc3BsaXRzWzBdXG5cdFx0XHRvYmplY3RGaWVsZCA9IG9iamVjdEZpZWxkc1tuYW1lXVxuXHRcdFx0aWYgc3BsaXRzLmxlbmd0aCA+IDEgYW5kIG9iamVjdEZpZWxkXG5cdFx0XHRcdGNoaWxkS2V5ID0gaXRlbS5yZXBsYWNlIG5hbWUgKyBcIi5cIiwgXCJcIlxuXHRcdFx0XHRjb21wb3VuZEZpZWxkcy5wdXNoKHtuYW1lOiBuYW1lLCBjaGlsZEtleTogY2hpbGRLZXksIGZpZWxkOiBvYmplY3RGaWVsZH0pXG5cdFx0XHRmaWx0ZXJGaWVsZHNbbmFtZV0gPSAxXG5cblx0XHRzZWxlY3RvciA9IHt9XG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcblx0XHRzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXG5cdFx0aWYgZmlsdGVyX3Njb3BlID09IFwic3BhY2V4XCJcblx0XHRcdHNlbGVjdG9yLnNwYWNlID0gXG5cdFx0XHRcdCRpbjogW251bGwsc3BhY2VdXG5cdFx0ZWxzZSBpZiBmaWx0ZXJfc2NvcGUgPT0gXCJtaW5lXCJcblx0XHRcdHNlbGVjdG9yLm93bmVyID0gdXNlcklkXG5cblx0XHRpZiBDcmVhdG9yLmlzQ29tbW9uU3BhY2Uoc3BhY2UpICYmIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlLCBAdXNlcklkKVxuXHRcdFx0ZGVsZXRlIHNlbGVjdG9yLnNwYWNlXG5cblx0XHRpZiBmaWx0ZXJzIGFuZCBmaWx0ZXJzLmxlbmd0aCA+IDBcblx0XHRcdHNlbGVjdG9yW1wiJGFuZFwiXSA9IGZpbHRlcnNcblxuXHRcdGN1cnNvciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvciwge2ZpZWxkczogZmlsdGVyRmllbGRzLCBza2lwOiAwLCBsaW1pdDogMTAwMDB9KVxuI1x0XHRpZiBjdXJzb3IuY291bnQoKSA+IDEwMDAwXG4jXHRcdFx0cmV0dXJuIFtdXG5cdFx0cmVzdWx0ID0gY3Vyc29yLmZldGNoKClcblx0XHRpZiBjb21wb3VuZEZpZWxkcy5sZW5ndGhcblx0XHRcdHJlc3VsdCA9IHJlc3VsdC5tYXAgKGl0ZW0saW5kZXgpLT5cblx0XHRcdFx0Xy5lYWNoIGNvbXBvdW5kRmllbGRzLCAoY29tcG91bmRGaWVsZEl0ZW0sIGluZGV4KS0+XG5cdFx0XHRcdFx0aXRlbUtleSA9IGNvbXBvdW5kRmllbGRJdGVtLm5hbWUgKyBcIiolKlwiICsgY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXkucmVwbGFjZSgvXFwuL2csIFwiKiUqXCIpXG5cdFx0XHRcdFx0aXRlbVZhbHVlID0gaXRlbVtjb21wb3VuZEZpZWxkSXRlbS5uYW1lXVxuXHRcdFx0XHRcdHR5cGUgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC50eXBlXG5cdFx0XHRcdFx0aWYgW1wibG9va3VwXCIsIFwibWFzdGVyX2RldGFpbFwiXS5pbmRleE9mKHR5cGUpID4gLTFcblx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRcdFx0Y29tcG91bmRGaWx0ZXJGaWVsZHMgPSB7fVxuXHRcdFx0XHRcdFx0Y29tcG91bmRGaWx0ZXJGaWVsZHNbY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldID0gMVxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlSXRlbSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8pLmZpbmRPbmUge19pZDogaXRlbVZhbHVlfSwgZmllbGRzOiBjb21wb3VuZEZpbHRlckZpZWxkc1xuXHRcdFx0XHRcdFx0aWYgcmVmZXJlbmNlSXRlbVxuXHRcdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gcmVmZXJlbmNlSXRlbVtjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV1cblx0XHRcdFx0XHRlbHNlIGlmIHR5cGUgPT0gXCJzZWxlY3RcIlxuXHRcdFx0XHRcdFx0b3B0aW9ucyA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLm9wdGlvbnNcblx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSBfLmZpbmRXaGVyZShvcHRpb25zLCB7dmFsdWU6IGl0ZW1WYWx1ZX0pPy5sYWJlbCBvciBpdGVtVmFsdWVcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gaXRlbVZhbHVlXG5cdFx0XHRcdFx0dW5sZXNzIGl0ZW1baXRlbUtleV1cblx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSBcIi0tXCJcblx0XHRcdFx0cmV0dXJuIGl0ZW1cblx0XHRcdHJldHVybiByZXN1bHRcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gcmVzdWx0XG5cbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgJ3JlcG9ydF9kYXRhJzogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBjb21wb3VuZEZpZWxkcywgY3Vyc29yLCBmaWVsZHMsIGZpbHRlckZpZWxkcywgZmlsdGVyX3Njb3BlLCBmaWx0ZXJzLCBvYmplY3RGaWVsZHMsIG9iamVjdF9uYW1lLCByZWYsIHJlc3VsdCwgc2VsZWN0b3IsIHNwYWNlLCB1c2VySWQ7XG4gICAgY2hlY2sob3B0aW9ucywgT2JqZWN0KTtcbiAgICBzcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gICAgZmllbGRzID0gb3B0aW9ucy5maWVsZHM7XG4gICAgb2JqZWN0X25hbWUgPSBvcHRpb25zLm9iamVjdF9uYW1lO1xuICAgIGZpbHRlcl9zY29wZSA9IG9wdGlvbnMuZmlsdGVyX3Njb3BlO1xuICAgIGZpbHRlcnMgPSBvcHRpb25zLmZpbHRlcnM7XG4gICAgZmlsdGVyRmllbGRzID0ge307XG4gICAgY29tcG91bmRGaWVsZHMgPSBbXTtcbiAgICBvYmplY3RGaWVsZHMgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMDtcbiAgICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgdmFyIGNoaWxkS2V5LCBuYW1lLCBvYmplY3RGaWVsZCwgc3BsaXRzO1xuICAgICAgc3BsaXRzID0gaXRlbS5zcGxpdChcIi5cIik7XG4gICAgICBuYW1lID0gc3BsaXRzWzBdO1xuICAgICAgb2JqZWN0RmllbGQgPSBvYmplY3RGaWVsZHNbbmFtZV07XG4gICAgICBpZiAoc3BsaXRzLmxlbmd0aCA+IDEgJiYgb2JqZWN0RmllbGQpIHtcbiAgICAgICAgY2hpbGRLZXkgPSBpdGVtLnJlcGxhY2UobmFtZSArIFwiLlwiLCBcIlwiKTtcbiAgICAgICAgY29tcG91bmRGaWVsZHMucHVzaCh7XG4gICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICBjaGlsZEtleTogY2hpbGRLZXksXG4gICAgICAgICAgZmllbGQ6IG9iamVjdEZpZWxkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZpbHRlckZpZWxkc1tuYW1lXSA9IDE7XG4gICAgfSk7XG4gICAgc2VsZWN0b3IgPSB7fTtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlO1xuICAgIGlmIChmaWx0ZXJfc2NvcGUgPT09IFwic3BhY2V4XCIpIHtcbiAgICAgIHNlbGVjdG9yLnNwYWNlID0ge1xuICAgICAgICAkaW46IFtudWxsLCBzcGFjZV1cbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChmaWx0ZXJfc2NvcGUgPT09IFwibWluZVwiKSB7XG4gICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZDtcbiAgICB9XG4gICAgaWYgKENyZWF0b3IuaXNDb21tb25TcGFjZShzcGFjZSkgJiYgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2UsIHRoaXMudXNlcklkKSkge1xuICAgICAgZGVsZXRlIHNlbGVjdG9yLnNwYWNlO1xuICAgIH1cbiAgICBpZiAoZmlsdGVycyAmJiBmaWx0ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHNlbGVjdG9yW1wiJGFuZFwiXSA9IGZpbHRlcnM7XG4gICAgfVxuICAgIGN1cnNvciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvciwge1xuICAgICAgZmllbGRzOiBmaWx0ZXJGaWVsZHMsXG4gICAgICBza2lwOiAwLFxuICAgICAgbGltaXQ6IDEwMDAwXG4gICAgfSk7XG4gICAgcmVzdWx0ID0gY3Vyc29yLmZldGNoKCk7XG4gICAgaWYgKGNvbXBvdW5kRmllbGRzLmxlbmd0aCkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0Lm1hcChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICBfLmVhY2goY29tcG91bmRGaWVsZHMsIGZ1bmN0aW9uKGNvbXBvdW5kRmllbGRJdGVtLCBpbmRleCkge1xuICAgICAgICAgIHZhciBjb21wb3VuZEZpbHRlckZpZWxkcywgaXRlbUtleSwgaXRlbVZhbHVlLCByZWYxLCByZWZlcmVuY2VJdGVtLCByZWZlcmVuY2VfdG8sIHR5cGU7XG4gICAgICAgICAgaXRlbUtleSA9IGNvbXBvdW5kRmllbGRJdGVtLm5hbWUgKyBcIiolKlwiICsgY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXkucmVwbGFjZSgvXFwuL2csIFwiKiUqXCIpO1xuICAgICAgICAgIGl0ZW1WYWx1ZSA9IGl0ZW1bY29tcG91bmRGaWVsZEl0ZW0ubmFtZV07XG4gICAgICAgICAgdHlwZSA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLnR5cGU7XG4gICAgICAgICAgaWYgKFtcImxvb2t1cFwiLCBcIm1hc3Rlcl9kZXRhaWxcIl0uaW5kZXhPZih0eXBlKSA+IC0xKSB7XG4gICAgICAgICAgICByZWZlcmVuY2VfdG8gPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICBjb21wb3VuZEZpbHRlckZpZWxkcyA9IHt9O1xuICAgICAgICAgICAgY29tcG91bmRGaWx0ZXJGaWVsZHNbY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldID0gMTtcbiAgICAgICAgICAgIHJlZmVyZW5jZUl0ZW0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvKS5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiBpdGVtVmFsdWVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiBjb21wb3VuZEZpbHRlckZpZWxkc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocmVmZXJlbmNlSXRlbSkge1xuICAgICAgICAgICAgICBpdGVtW2l0ZW1LZXldID0gcmVmZXJlbmNlSXRlbVtjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQub3B0aW9ucztcbiAgICAgICAgICAgIGl0ZW1baXRlbUtleV0gPSAoKHJlZjEgPSBfLmZpbmRXaGVyZShvcHRpb25zLCB7XG4gICAgICAgICAgICAgIHZhbHVlOiBpdGVtVmFsdWVcbiAgICAgICAgICAgIH0pKSAhPSBudWxsID8gcmVmMS5sYWJlbCA6IHZvaWQgMCkgfHwgaXRlbVZhbHVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtW2l0ZW1LZXldID0gaXRlbVZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWl0ZW1baXRlbUtleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtW2l0ZW1LZXldID0gXCItLVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxufSk7XG4iLCIjIyNcbiAgICB0eXBlOiBcInVzZXJcIlxuICAgIG9iamVjdF9uYW1lOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICAgIHJlY29yZF9pZDogXCJ7b2JqZWN0X25hbWV9LHtsaXN0dmlld19pZH1cIlxuICAgIHNldHRpbmdzOlxuICAgICAgICBjb2x1bW5fd2lkdGg6IHsgZmllbGRfYTogMTAwLCBmaWVsZF8yOiAxNTAgfVxuICAgICAgICBzb3J0OiBbW1wiZmllbGRfYVwiLCBcImRlc2NcIl1dXG4gICAgb3duZXI6IHt1c2VySWR9XG4jIyNcblxuTWV0ZW9yLm1ldGhvZHNcbiAgICBcInRhYnVsYXJfc29ydF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgc29ydCktPlxuICAgICAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxuICAgICAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsIG93bmVyOiB1c2VySWR9KVxuICAgICAgICBpZiBzZXR0aW5nXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uc29ydFwiOiBzb3J0fX0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRvYyA9IFxuICAgICAgICAgICAgICAgIHR5cGU6IFwidXNlclwiXG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7fVxuICAgICAgICAgICAgICAgIG93bmVyOiB1c2VySWRcblxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fVxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnRcblxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKVxuXG4gICAgXCJ0YWJ1bGFyX2NvbHVtbl93aWR0aF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoKS0+XG4gICAgICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXG4gICAgICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIiwgb3duZXI6IHVzZXJJZH0pXG4gICAgICAgIGlmIHNldHRpbmdcbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5jb2x1bW5fd2lkdGhcIjogY29sdW1uX3dpZHRofX0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRvYyA9IFxuICAgICAgICAgICAgICAgIHR5cGU6IFwidXNlclwiXG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7fVxuICAgICAgICAgICAgICAgIG93bmVyOiB1c2VySWRcblxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fVxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoXG5cbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYylcblxuICAgIFwiZ3JpZF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoLCBzb3J0KS0+XG4gICAgICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXG4gICAgICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIiwgb3duZXI6IHVzZXJJZH0pXG4gICAgICAgIGlmIHNldHRpbmdcbiAgICAgICAgICAgICMg5q+P5qyh6YO95by65Yi25pS55Y+YX2lkX2FjdGlvbnPliJfnmoTlrr3luqbvvIzku6Xop6PlhrPlvZPnlKjmiLflj6rmlLnlj5jlrZfmrrXmrKHluo/ogIzmsqHmnInmlLnlj5jku7vkvZXlrZfmrrXlrr3luqbml7bvvIzliY3nq6/msqHmnInorqLpmIXliLDlrZfmrrXmrKHluo/lj5jmm7TnmoTmlbDmja7nmoTpl67pophcbiAgICAgICAgICAgIGNvbHVtbl93aWR0aC5faWRfYWN0aW9ucyA9IGlmIHNldHRpbmcuc2V0dGluZ3NbXCIje2xpc3Rfdmlld19pZH1cIl0/LmNvbHVtbl93aWR0aD8uX2lkX2FjdGlvbnMgPT0gNDYgdGhlbiA0NyBlbHNlIDQ2XG4gICAgICAgICAgICBpZiBzb3J0XG4gICAgICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LnNvcnRcIjogc29ydCwgXCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uY29sdW1uX3dpZHRoXCI6IGNvbHVtbl93aWR0aH19KVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5jb2x1bW5fd2lkdGhcIjogY29sdW1uX3dpZHRofX0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRvYyA9XG4gICAgICAgICAgICAgICAgdHlwZTogXCJ1c2VyXCJcbiAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHt9XG4gICAgICAgICAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9XG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5jb2x1bW5fd2lkdGggPSBjb2x1bW5fd2lkdGhcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0XG5cbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYykiLCJcbi8qXG4gICAgdHlwZTogXCJ1c2VyXCJcbiAgICBvYmplY3RfbmFtZTogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgICByZWNvcmRfaWQ6IFwie29iamVjdF9uYW1lfSx7bGlzdHZpZXdfaWR9XCJcbiAgICBzZXR0aW5nczpcbiAgICAgICAgY29sdW1uX3dpZHRoOiB7IGZpZWxkX2E6IDEwMCwgZmllbGRfMjogMTUwIH1cbiAgICAgICAgc29ydDogW1tcImZpZWxkX2FcIiwgXCJkZXNjXCJdXVxuICAgIG93bmVyOiB7dXNlcklkfVxuICovXG5NZXRlb3IubWV0aG9kcyh7XG4gIFwidGFidWxhcl9zb3J0X3NldHRpbmdzXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIHNvcnQpIHtcbiAgICB2YXIgZG9jLCBvYmosIHNldHRpbmcsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICBvd25lcjogdXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNldHRpbmcpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDogKFxuICAgICAgICAgIG9iaiA9IHt9LFxuICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuc29ydFwiXSA9IHNvcnQsXG4gICAgICAgICAgb2JqXG4gICAgICAgIClcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2MgPSB7XG4gICAgICAgIHR5cGU6IFwidXNlclwiLFxuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge307XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydDtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpO1xuICAgIH1cbiAgfSxcbiAgXCJ0YWJ1bGFyX2NvbHVtbl93aWR0aF9zZXR0aW5nc1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5fd2lkdGgpIHtcbiAgICB2YXIgZG9jLCBvYmosIHNldHRpbmcsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICBvd25lcjogdXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNldHRpbmcpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDogKFxuICAgICAgICAgIG9iaiA9IHt9LFxuICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuY29sdW1uX3dpZHRoXCJdID0gY29sdW1uX3dpZHRoLFxuICAgICAgICAgIG9ialxuICAgICAgICApXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jID0ge1xuICAgICAgICB0eXBlOiBcInVzZXJcIixcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgICBzZXR0aW5nczoge30sXG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH07XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoO1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYyk7XG4gICAgfVxuICB9LFxuICBcImdyaWRfc2V0dGluZ3NcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoLCBzb3J0KSB7XG4gICAgdmFyIGRvYywgb2JqLCBvYmoxLCByZWYsIHJlZjEsIHNldHRpbmcsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCIsXG4gICAgICBvd25lcjogdXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNldHRpbmcpIHtcbiAgICAgIGNvbHVtbl93aWR0aC5faWRfYWN0aW9ucyA9ICgocmVmID0gc2V0dGluZy5zZXR0aW5nc1tcIlwiICsgbGlzdF92aWV3X2lkXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmNvbHVtbl93aWR0aCkgIT0gbnVsbCA/IHJlZjEuX2lkX2FjdGlvbnMgOiB2b2lkIDAgOiB2b2lkIDApID09PSA0NiA/IDQ3IDogNDY7XG4gICAgICBpZiAoc29ydCkge1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IChcbiAgICAgICAgICAgIG9iaiA9IHt9LFxuICAgICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5zb3J0XCJdID0gc29ydCxcbiAgICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuY29sdW1uX3dpZHRoXCJdID0gY29sdW1uX3dpZHRoLFxuICAgICAgICAgICAgb2JqXG4gICAgICAgICAgKVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDogKFxuICAgICAgICAgICAgb2JqMSA9IHt9LFxuICAgICAgICAgICAgb2JqMVtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuY29sdW1uX3dpZHRoXCJdID0gY29sdW1uX3dpZHRoLFxuICAgICAgICAgICAgb2JqMVxuICAgICAgICAgIClcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYyA9IHtcbiAgICAgICAgdHlwZTogXCJ1c2VyXCIsXG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIixcbiAgICAgICAgc2V0dGluZ3M6IHt9LFxuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aDtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0O1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYyk7XG4gICAgfVxuICB9XG59KTtcbiIsInhtbDJqcyA9IHJlcXVpcmUgJ3htbDJqcydcbmZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbm1rZGlycCA9IHJlcXVpcmUgJ21rZGlycCdcblxubG9nZ2VyID0gbmV3IExvZ2dlciAnRXhwb3J0X1RPX1hNTCdcblxuX3dyaXRlWG1sRmlsZSA9IChqc29uT2JqLG9iak5hbWUpIC0+XG5cdCMg6L2seG1sXG5cdGJ1aWxkZXIgPSBuZXcgeG1sMmpzLkJ1aWxkZXIoKVxuXHR4bWwgPSBidWlsZGVyLmJ1aWxkT2JqZWN0IGpzb25PYmpcblxuXHQjIOi9rOS4umJ1ZmZlclxuXHRzdHJlYW0gPSBuZXcgQnVmZmVyIHhtbFxuXG5cdCMg5qC55o2u5b2T5aSp5pe26Ze055qE5bm05pyI5pel5L2c5Li65a2Y5YKo6Lev5b6EXG5cdG5vdyA9IG5ldyBEYXRlXG5cdHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuXHRtb250aCA9IG5vdy5nZXRNb250aCgpICsgMVxuXHRkYXkgPSBub3cuZ2V0RGF0ZSgpXG5cblx0IyDmlofku7bot6/lvoRcblx0ZmlsZVBhdGggPSBwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCcuLi8uLi8uLi9leHBvcnQvJyArIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGRheSArICcvJyArIG9iak5hbWUgKVxuXHRmaWxlTmFtZSA9IGpzb25PYmo/Ll9pZCArIFwiLnhtbFwiXG5cdGZpbGVBZGRyZXNzID0gcGF0aC5qb2luIGZpbGVQYXRoLCBmaWxlTmFtZVxuXG5cdGlmICFmcy5leGlzdHNTeW5jIGZpbGVQYXRoXG5cdFx0bWtkaXJwLnN5bmMgZmlsZVBhdGhcblxuXHQjIOWGmeWFpeaWh+S7tlxuXHRmcy53cml0ZUZpbGUgZmlsZUFkZHJlc3MsIHN0cmVhbSwgKGVycikgLT5cblx0XHRpZiBlcnJcblx0XHRcdGxvZ2dlci5lcnJvciBcIiN7anNvbk9iai5faWR95YaZ5YWleG1s5paH5Lu25aSx6LSlXCIsZXJyXG5cdFxuXHRyZXR1cm4gZmlsZVBhdGhcblxuXG4jIOaVtOeQhkZpZWxkc+eahGpzb27mlbDmja5cbl9taXhGaWVsZHNEYXRhID0gKG9iaixvYmpOYW1lKSAtPlxuXHQjIOWIneWni+WMluWvueixoeaVsOaNrlxuXHRqc29uT2JqID0ge31cblx0IyDojrflj5ZmaWVsZHNcblx0b2JqRmllbGRzID0gQ3JlYXRvcj8uZ2V0T2JqZWN0KG9iak5hbWUpPy5maWVsZHNcblxuXHRtaXhEZWZhdWx0ID0gKGZpZWxkX25hbWUpLT5cblx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gb2JqW2ZpZWxkX25hbWVdIHx8IFwiXCJcblxuXHRtaXhEYXRlID0gKGZpZWxkX25hbWUsdHlwZSktPlxuXHRcdGRhdGUgPSBvYmpbZmllbGRfbmFtZV1cblx0XHRpZiB0eXBlID09IFwiZGF0ZVwiXG5cdFx0XHRmb3JtYXQgPSBcIllZWVktTU0tRERcIlxuXHRcdGVsc2Vcblx0XHRcdGZvcm1hdCA9IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiXG5cdFx0aWYgZGF0ZT8gYW5kIGZvcm1hdD9cblx0XHRcdGRhdGVTdHIgPSBtb21lbnQoZGF0ZSkuZm9ybWF0KGZvcm1hdClcblx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gZGF0ZVN0ciB8fCBcIlwiXG5cblx0bWl4Qm9vbCA9IChmaWVsZF9uYW1lKS0+XG5cdFx0aWYgb2JqW2ZpZWxkX25hbWVdID09IHRydWVcblx0XHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuaYr1wiXG5cdFx0ZWxzZSBpZiBvYmpbZmllbGRfbmFtZV0gPT0gZmFsc2Vcblx0XHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuWQplwiXG5cdFx0ZWxzZVxuXHRcdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IFwiXCJcblxuXHQjIOW+queOr+avj+S4qmZpZWxkcyzlubbliKTmlq3lj5blgLxcblx0Xy5lYWNoIG9iakZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0c3dpdGNoIGZpZWxkPy50eXBlXG5cdFx0XHR3aGVuIFwiZGF0ZVwiLFwiZGF0ZXRpbWVcIiB0aGVuIG1peERhdGUgZmllbGRfbmFtZSxmaWVsZC50eXBlXG5cdFx0XHR3aGVuIFwiYm9vbGVhblwiIHRoZW4gbWl4Qm9vbCBmaWVsZF9uYW1lXG5cdFx0XHRlbHNlIG1peERlZmF1bHQgZmllbGRfbmFtZVxuXG5cdHJldHVybiBqc29uT2JqXG5cbiMg6I635Y+W5a2Q6KGo5pW055CG5pWw5o2uXG5fbWl4UmVsYXRlZERhdGEgPSAob2JqLG9iak5hbWUpIC0+XG5cdCMg5Yid5aeL5YyW5a+56LGh5pWw5o2uXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IHt9XG5cblx0IyDojrflj5bnm7jlhbPooahcblx0cmVsYXRlZE9iak5hbWVzID0gQ3JlYXRvcj8uZ2V0QWxsUmVsYXRlZE9iamVjdHMgb2JqTmFtZVxuXG5cdCMg5b6q546v55u45YWz6KGoXG5cdHJlbGF0ZWRPYmpOYW1lcy5mb3JFYWNoIChyZWxhdGVkT2JqTmFtZSkgLT5cblx0XHQjIOavj+S4quihqOWumuS5ieS4gOS4quWvueixoeaVsOe7hFxuXHRcdHJlbGF0ZWRUYWJsZURhdGEgPSBbXVxuXG5cdFx0IyAq6K6+572u5YWz6IGU5pCc57Si5p+l6K+i55qE5a2X5q61XG5cdFx0IyDpmYTku7bnmoTlhbPogZTmkJzntKLlrZfmrrXmmK/lrprmrbvnmoRcblx0XHRpZiByZWxhdGVkT2JqTmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSBcInBhcmVudC5pZHNcIlxuXHRcdGVsc2Vcblx0XHRcdCMg6I635Y+WZmllbGRzXG5cdFx0XHRmaWVsZHMgPSBDcmVhdG9yPy5PYmplY3RzW3JlbGF0ZWRPYmpOYW1lXT8uZmllbGRzXG5cdFx0XHQjIOW+queOr+avj+S4qmZpZWxkLOaJvuWHunJlZmVyZW5jZV90b+eahOWFs+iBlOWtl+autVxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gXCJcIlxuXHRcdFx0Xy5lYWNoIGZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0XHRcdGlmIGZpZWxkPy5yZWZlcmVuY2VfdG8gPT0gb2JqTmFtZVxuXHRcdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IGZpZWxkX25hbWVcblxuXHRcdCMg5qC55o2u5om+5Ye655qE5YWz6IGU5a2X5q6177yM5p+l5a2Q6KGo5pWw5o2uXG5cdFx0aWYgcmVsYXRlZF9maWVsZF9uYW1lXG5cdFx0XHRyZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqTmFtZSlcblx0XHRcdCMg6I635Y+W5Yiw5omA5pyJ55qE5pWw5o2uXG5cdFx0XHRyZWxhdGVkUmVjb3JkTGlzdCA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoe1wiI3tyZWxhdGVkX2ZpZWxkX25hbWV9XCI6b2JqLl9pZH0pLmZldGNoKClcblx0XHRcdCMg5b6q546v5q+P5LiA5p2h5pWw5o2uXG5cdFx0XHRyZWxhdGVkUmVjb3JkTGlzdC5mb3JFYWNoIChyZWxhdGVkT2JqKS0+XG5cdFx0XHRcdCMg5pW05ZCIZmllbGRz5pWw5o2uXG5cdFx0XHRcdGZpZWxkc0RhdGEgPSBfbWl4RmllbGRzRGF0YSByZWxhdGVkT2JqLHJlbGF0ZWRPYmpOYW1lXG5cdFx0XHRcdCMg5oqK5LiA5p2h6K6w5b2V5o+S5YWl5Yiw5a+56LGh5pWw57uE5LitXG5cdFx0XHRcdHJlbGF0ZWRUYWJsZURhdGEucHVzaCBmaWVsZHNEYXRhXG5cblx0XHQjIOaKiuS4gOS4quWtkOihqOeahOaJgOacieaVsOaNruaPkuWFpeWIsHJlbGF0ZWRfb2JqZWN0c+S4re+8jOWGjeW+queOr+S4i+S4gOS4qlxuXHRcdHJlbGF0ZWRfb2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0gPSByZWxhdGVkVGFibGVEYXRhXG5cblx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xuXG4jIENyZWF0b3IuRXhwb3J0MnhtbCgpXG5DcmVhdG9yLkV4cG9ydDJ4bWwgPSAob2JqTmFtZSwgcmVjb3JkTGlzdCkgLT5cblx0bG9nZ2VyLmluZm8gXCJSdW4gQ3JlYXRvci5FeHBvcnQyeG1sXCJcblxuXHRjb25zb2xlLnRpbWUgXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIlxuXG5cdCMg5rWL6K+V5pWw5o2uXG5cdCMgb2JqTmFtZSA9IFwiYXJjaGl2ZV9yZWNvcmRzXCJcblxuXHQjIOafpeaJvuWvueixoeaVsOaNrlxuXHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iak5hbWUpXG5cdCMg5rWL6K+V5pWw5o2uXG5cdHJlY29yZExpc3QgPSBjb2xsZWN0aW9uLmZpbmQoe30pLmZldGNoKClcblxuXHRyZWNvcmRMaXN0LmZvckVhY2ggKHJlY29yZE9iaiktPlxuXHRcdGpzb25PYmogPSB7fVxuXHRcdGpzb25PYmouX2lkID0gcmVjb3JkT2JqLl9pZFxuXG5cdFx0IyDmlbTnkIbkuLvooajnmoRGaWVsZHPmlbDmja5cblx0XHRmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEgcmVjb3JkT2JqLG9iak5hbWVcblx0XHRqc29uT2JqW29iak5hbWVdID0gZmllbGRzRGF0YVxuXG5cdFx0IyDmlbTnkIbnm7jlhbPooajmlbDmja5cblx0XHRyZWxhdGVkX29iamVjdHMgPSBfbWl4UmVsYXRlZERhdGEgcmVjb3JkT2JqLG9iak5hbWVcblxuXHRcdGpzb25PYmpbXCJyZWxhdGVkX29iamVjdHNcIl0gPSByZWxhdGVkX29iamVjdHNcblxuXHRcdCMg6L2s5Li6eG1s5L+d5a2Y5paH5Lu2XG5cdFx0ZmlsZVBhdGggPSBfd3JpdGVYbWxGaWxlIGpzb25PYmosb2JqTmFtZVxuXG5cdGNvbnNvbGUudGltZUVuZCBcIkNyZWF0b3IuRXhwb3J0MnhtbFwiXG5cdHJldHVybiBmaWxlUGF0aCIsInZhciBfbWl4RmllbGRzRGF0YSwgX21peFJlbGF0ZWREYXRhLCBfd3JpdGVYbWxGaWxlLCBmcywgbG9nZ2VyLCBta2RpcnAsIHBhdGgsIHhtbDJqcztcblxueG1sMmpzID0gcmVxdWlyZSgneG1sMmpzJyk7XG5cbmZzID0gcmVxdWlyZSgnZnMnKTtcblxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxubWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJyk7XG5cbmxvZ2dlciA9IG5ldyBMb2dnZXIoJ0V4cG9ydF9UT19YTUwnKTtcblxuX3dyaXRlWG1sRmlsZSA9IGZ1bmN0aW9uKGpzb25PYmosIG9iak5hbWUpIHtcbiAgdmFyIGJ1aWxkZXIsIGRheSwgZmlsZUFkZHJlc3MsIGZpbGVOYW1lLCBmaWxlUGF0aCwgbW9udGgsIG5vdywgc3RyZWFtLCB4bWwsIHllYXI7XG4gIGJ1aWxkZXIgPSBuZXcgeG1sMmpzLkJ1aWxkZXIoKTtcbiAgeG1sID0gYnVpbGRlci5idWlsZE9iamVjdChqc29uT2JqKTtcbiAgc3RyZWFtID0gbmV3IEJ1ZmZlcih4bWwpO1xuICBub3cgPSBuZXcgRGF0ZTtcbiAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMTtcbiAgZGF5ID0gbm93LmdldERhdGUoKTtcbiAgZmlsZVBhdGggPSBwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCAnLi4vLi4vLi4vZXhwb3J0LycgKyB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBkYXkgKyAnLycgKyBvYmpOYW1lKTtcbiAgZmlsZU5hbWUgPSAoanNvbk9iaiAhPSBudWxsID8ganNvbk9iai5faWQgOiB2b2lkIDApICsgXCIueG1sXCI7XG4gIGZpbGVBZGRyZXNzID0gcGF0aC5qb2luKGZpbGVQYXRoLCBmaWxlTmFtZSk7XG4gIGlmICghZnMuZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcbiAgICBta2RpcnAuc3luYyhmaWxlUGF0aCk7XG4gIH1cbiAgZnMud3JpdGVGaWxlKGZpbGVBZGRyZXNzLCBzdHJlYW0sIGZ1bmN0aW9uKGVycikge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHJldHVybiBsb2dnZXIuZXJyb3IoanNvbk9iai5faWQgKyBcIuWGmeWFpXhtbOaWh+S7tuWksei0pVwiLCBlcnIpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmaWxlUGF0aDtcbn07XG5cbl9taXhGaWVsZHNEYXRhID0gZnVuY3Rpb24ob2JqLCBvYmpOYW1lKSB7XG4gIHZhciBqc29uT2JqLCBtaXhCb29sLCBtaXhEYXRlLCBtaXhEZWZhdWx0LCBvYmpGaWVsZHMsIHJlZjtcbiAganNvbk9iaiA9IHt9O1xuICBvYmpGaWVsZHMgPSB0eXBlb2YgQ3JlYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBDcmVhdG9yICE9PSBudWxsID8gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iak5hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgbWl4RGVmYXVsdCA9IGZ1bmN0aW9uKGZpZWxkX25hbWUpIHtcbiAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IG9ialtmaWVsZF9uYW1lXSB8fCBcIlwiO1xuICB9O1xuICBtaXhEYXRlID0gZnVuY3Rpb24oZmllbGRfbmFtZSwgdHlwZSkge1xuICAgIHZhciBkYXRlLCBkYXRlU3RyLCBmb3JtYXQ7XG4gICAgZGF0ZSA9IG9ialtmaWVsZF9uYW1lXTtcbiAgICBpZiAodHlwZSA9PT0gXCJkYXRlXCIpIHtcbiAgICAgIGZvcm1hdCA9IFwiWVlZWS1NTS1ERFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW06c3NcIjtcbiAgICB9XG4gICAgaWYgKChkYXRlICE9IG51bGwpICYmIChmb3JtYXQgIT0gbnVsbCkpIHtcbiAgICAgIGRhdGVTdHIgPSBtb21lbnQoZGF0ZSkuZm9ybWF0KGZvcm1hdCk7XG4gICAgfVxuICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gZGF0ZVN0ciB8fCBcIlwiO1xuICB9O1xuICBtaXhCb29sID0gZnVuY3Rpb24oZmllbGRfbmFtZSkge1xuICAgIGlmIChvYmpbZmllbGRfbmFtZV0gPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLmmK9cIjtcbiAgICB9IGVsc2UgaWYgKG9ialtmaWVsZF9uYW1lXSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLlkKZcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIlwiO1xuICAgIH1cbiAgfTtcbiAgXy5lYWNoKG9iakZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBzd2l0Y2ggKGZpZWxkICE9IG51bGwgPyBmaWVsZC50eXBlIDogdm9pZCAwKSB7XG4gICAgICBjYXNlIFwiZGF0ZVwiOlxuICAgICAgY2FzZSBcImRhdGV0aW1lXCI6XG4gICAgICAgIHJldHVybiBtaXhEYXRlKGZpZWxkX25hbWUsIGZpZWxkLnR5cGUpO1xuICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgcmV0dXJuIG1peEJvb2woZmllbGRfbmFtZSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbWl4RGVmYXVsdChmaWVsZF9uYW1lKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4ganNvbk9iajtcbn07XG5cbl9taXhSZWxhdGVkRGF0YSA9IGZ1bmN0aW9uKG9iaiwgb2JqTmFtZSkge1xuICB2YXIgcmVsYXRlZE9iak5hbWVzLCByZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IHt9O1xuICByZWxhdGVkT2JqTmFtZXMgPSB0eXBlb2YgQ3JlYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBDcmVhdG9yICE9PSBudWxsID8gQ3JlYXRvci5nZXRBbGxSZWxhdGVkT2JqZWN0cyhvYmpOYW1lKSA6IHZvaWQgMDtcbiAgcmVsYXRlZE9iak5hbWVzLmZvckVhY2goZnVuY3Rpb24ocmVsYXRlZE9iak5hbWUpIHtcbiAgICB2YXIgZmllbGRzLCBvYmoxLCByZWYsIHJlbGF0ZWRDb2xsZWN0aW9uLCByZWxhdGVkUmVjb3JkTGlzdCwgcmVsYXRlZFRhYmxlRGF0YSwgcmVsYXRlZF9maWVsZF9uYW1lO1xuICAgIHJlbGF0ZWRUYWJsZURhdGEgPSBbXTtcbiAgICBpZiAocmVsYXRlZE9iak5hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwicGFyZW50Lmlkc1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWVsZHMgPSB0eXBlb2YgQ3JlYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBDcmVhdG9yICE9PSBudWxsID8gKHJlZiA9IENyZWF0b3IuT2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0pICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gXCJcIjtcbiAgICAgIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgICAgIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnJlZmVyZW5jZV90byA6IHZvaWQgMCkgPT09IG9iak5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9maWVsZF9uYW1lID0gZmllbGRfbmFtZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChyZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgIHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmpOYW1lKTtcbiAgICAgIHJlbGF0ZWRSZWNvcmRMaXN0ID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZCgoXG4gICAgICAgIG9iajEgPSB7fSxcbiAgICAgICAgb2JqMVtcIlwiICsgcmVsYXRlZF9maWVsZF9uYW1lXSA9IG9iai5faWQsXG4gICAgICAgIG9iajFcbiAgICAgICkpLmZldGNoKCk7XG4gICAgICByZWxhdGVkUmVjb3JkTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHJlbGF0ZWRPYmopIHtcbiAgICAgICAgdmFyIGZpZWxkc0RhdGE7XG4gICAgICAgIGZpZWxkc0RhdGEgPSBfbWl4RmllbGRzRGF0YShyZWxhdGVkT2JqLCByZWxhdGVkT2JqTmFtZSk7XG4gICAgICAgIHJldHVybiByZWxhdGVkVGFibGVEYXRhLnB1c2goZmllbGRzRGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0gPSByZWxhdGVkVGFibGVEYXRhO1xuICB9KTtcbiAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbn07XG5cbkNyZWF0b3IuRXhwb3J0MnhtbCA9IGZ1bmN0aW9uKG9iak5hbWUsIHJlY29yZExpc3QpIHtcbiAgdmFyIGNvbGxlY3Rpb247XG4gIGxvZ2dlci5pbmZvKFwiUnVuIENyZWF0b3IuRXhwb3J0MnhtbFwiKTtcbiAgY29uc29sZS50aW1lKFwiQ3JlYXRvci5FeHBvcnQyeG1sXCIpO1xuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iak5hbWUpO1xuICByZWNvcmRMaXN0ID0gY29sbGVjdGlvbi5maW5kKHt9KS5mZXRjaCgpO1xuICByZWNvcmRMaXN0LmZvckVhY2goZnVuY3Rpb24ocmVjb3JkT2JqKSB7XG4gICAgdmFyIGZpZWxkc0RhdGEsIGZpbGVQYXRoLCBqc29uT2JqLCByZWxhdGVkX29iamVjdHM7XG4gICAganNvbk9iaiA9IHt9O1xuICAgIGpzb25PYmouX2lkID0gcmVjb3JkT2JqLl9pZDtcbiAgICBmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEocmVjb3JkT2JqLCBvYmpOYW1lKTtcbiAgICBqc29uT2JqW29iak5hbWVdID0gZmllbGRzRGF0YTtcbiAgICByZWxhdGVkX29iamVjdHMgPSBfbWl4UmVsYXRlZERhdGEocmVjb3JkT2JqLCBvYmpOYW1lKTtcbiAgICBqc29uT2JqW1wicmVsYXRlZF9vYmplY3RzXCJdID0gcmVsYXRlZF9vYmplY3RzO1xuICAgIHJldHVybiBmaWxlUGF0aCA9IF93cml0ZVhtbEZpbGUoanNvbk9iaiwgb2JqTmFtZSk7XG4gIH0pO1xuICBjb25zb2xlLnRpbWVFbmQoXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIik7XG4gIHJldHVybiBmaWxlUGF0aDtcbn07XG4iLCJNZXRlb3IubWV0aG9kcyBcblx0cmVsYXRlZF9vYmplY3RzX3JlY29yZHM6IChvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpLT5cblx0XHR1c2VySWQgPSB0aGlzLnVzZXJJZFxuXHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXG5cdFx0XHRzZWxlY3RvciA9IHtcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWR9XG5cdFx0ZWxzZVxuXHRcdFx0c2VsZWN0b3IgPSB7c3BhY2U6IHNwYWNlSWR9XG5cdFx0XG5cdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHQjIOmZhOS7tueahOWFs+iBlOaQnOe0ouadoeS7tuaYr+Wumuatu+eahFxuXHRcdFx0c2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lXG5cdFx0XHRzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXVxuXHRcdGVsc2Vcblx0XHRcdHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWRcblxuXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdFx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcblx0XHRcdHNlbGVjdG9yLm93bmVyID0gdXNlcklkXG5cdFx0XG5cdFx0cmVsYXRlZF9yZWNvcmRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpXG5cdFx0cmV0dXJuIHJlbGF0ZWRfcmVjb3Jkcy5jb3VudCgpIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICByZWxhdGVkX29iamVjdHNfcmVjb3JkczogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZUlkKSB7XG4gICAgdmFyIHBlcm1pc3Npb25zLCByZWxhdGVkX3JlY29yZHMsIHNlbGVjdG9yLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIikge1xuICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgIFwibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIikge1xuICAgICAgc2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lO1xuICAgICAgc2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWQ7XG4gICAgfVxuICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICAgIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMuYWxsb3dSZWFkKSB7XG4gICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZDtcbiAgICB9XG4gICAgcmVsYXRlZF9yZWNvcmRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpO1xuICAgIHJldHVybiByZWxhdGVkX3JlY29yZHMuY291bnQoKTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRnZXRQZW5kaW5nU3BhY2VJbmZvOiAoaW52aXRlcklkLCBzcGFjZUlkKS0+XG5cdFx0aW52aXRlck5hbWUgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IGludml0ZXJJZH0pLm5hbWVcblx0XHRzcGFjZU5hbWUgPSBkYi5zcGFjZXMuZmluZE9uZSh7X2lkOiBzcGFjZUlkfSkubmFtZVxuXG5cdFx0cmV0dXJuIHtpbnZpdGVyOiBpbnZpdGVyTmFtZSwgc3BhY2U6IHNwYWNlTmFtZX1cblxuXHRyZWZ1c2VKb2luU3BhY2U6IChfaWQpLT5cblx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IF9pZH0seyRzZXQ6IHtpbnZpdGVfc3RhdGU6IFwicmVmdXNlZFwifX0pXG5cblx0YWNjZXB0Sm9pblNwYWNlOiAoX2lkKS0+XG5cdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBfaWR9LHskc2V0OiB7aW52aXRlX3N0YXRlOiBcImFjY2VwdGVkXCIsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9fSlcblxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBnZXRQZW5kaW5nU3BhY2VJbmZvOiBmdW5jdGlvbihpbnZpdGVySWQsIHNwYWNlSWQpIHtcbiAgICB2YXIgaW52aXRlck5hbWUsIHNwYWNlTmFtZTtcbiAgICBpbnZpdGVyTmFtZSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBpbnZpdGVySWRcbiAgICB9KS5uYW1lO1xuICAgIHNwYWNlTmFtZSA9IGRiLnNwYWNlcy5maW5kT25lKHtcbiAgICAgIF9pZDogc3BhY2VJZFxuICAgIH0pLm5hbWU7XG4gICAgcmV0dXJuIHtcbiAgICAgIGludml0ZXI6IGludml0ZXJOYW1lLFxuICAgICAgc3BhY2U6IHNwYWNlTmFtZVxuICAgIH07XG4gIH0sXG4gIHJlZnVzZUpvaW5TcGFjZTogZnVuY3Rpb24oX2lkKSB7XG4gICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGludml0ZV9zdGF0ZTogXCJyZWZ1c2VkXCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgYWNjZXB0Sm9pblNwYWNlOiBmdW5jdGlvbihfaWQpIHtcbiAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IF9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgaW52aXRlX3N0YXRlOiBcImFjY2VwdGVkXCIsXG4gICAgICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IucHVibGlzaCBcImNyZWF0b3Jfb2JqZWN0X3JlY29yZFwiLCAob2JqZWN0X25hbWUsIGlkLCBzcGFjZV9pZCktPlxuXHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZClcblx0aWYgY29sbGVjdGlvblxuXHRcdHJldHVybiBjb2xsZWN0aW9uLmZpbmQoe19pZDogaWR9KVxuXG4iLCJNZXRlb3IucHVibGlzaChcImNyZWF0b3Jfb2JqZWN0X3JlY29yZFwiLCBmdW5jdGlvbihvYmplY3RfbmFtZSwgaWQsIHNwYWNlX2lkKSB7XG4gIHZhciBjb2xsZWN0aW9uO1xuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCk7XG4gIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICBfaWQ6IGlkXG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUgXCJzdGVlZG9zX29iamVjdF90YWJ1bGFyXCIsICh0YWJsZU5hbWUsIGlkcywgZmllbGRzLCBzcGFjZUlkKS0+XG5cdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRjaGVjayh0YWJsZU5hbWUsIFN0cmluZyk7XG5cdGNoZWNrKGlkcywgQXJyYXkpO1xuXHRjaGVjayhmaWVsZHMsIE1hdGNoLk9wdGlvbmFsKE9iamVjdCkpO1xuXG5cdF9vYmplY3RfbmFtZSA9IHRhYmxlTmFtZS5yZXBsYWNlKFwiY3JlYXRvcl9cIixcIlwiKVxuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX29iamVjdF9uYW1lLCBzcGFjZUlkKVxuXG5cdGlmIHNwYWNlSWRcblx0XHRfb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldE9iamVjdE5hbWUoX29iamVjdClcblxuXHRvYmplY3RfY29sbGVjaXRvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihfb2JqZWN0X25hbWUpXG5cblxuXHRfZmllbGRzID0gX29iamVjdD8uZmllbGRzXG5cdGlmICFfZmllbGRzIHx8ICFvYmplY3RfY29sbGVjaXRvblxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRyZWZlcmVuY2VfZmllbGRzID0gXy5maWx0ZXIgX2ZpZWxkcywgKGYpLT5cblx0XHRyZXR1cm4gXy5pc0Z1bmN0aW9uKGYucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KGYucmVmZXJlbmNlX3RvKVxuXG5cdHNlbGYgPSB0aGlzXG5cblx0c2VsZi51bmJsb2NrKCk7XG5cblx0aWYgcmVmZXJlbmNlX2ZpZWxkcy5sZW5ndGggPiAwXG5cdFx0ZGF0YSA9IHtcblx0XHRcdGZpbmQ6ICgpLT5cblx0XHRcdFx0c2VsZi51bmJsb2NrKCk7XG5cdFx0XHRcdGZpZWxkX2tleXMgPSB7fVxuXHRcdFx0XHRfLmVhY2ggXy5rZXlzKGZpZWxkcyksIChmKS0+XG5cdFx0XHRcdFx0dW5sZXNzIC9cXHcrKFxcLlxcJCl7MX1cXHc/Ly50ZXN0KGYpXG5cdFx0XHRcdFx0XHRmaWVsZF9rZXlzW2ZdID0gMVxuXHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe19pZDogeyRpbjogaWRzfX0sIHtmaWVsZHM6IGZpZWxkX2tleXN9KTtcblx0XHR9XG5cblx0XHRkYXRhLmNoaWxkcmVuID0gW11cblxuXHRcdGtleXMgPSBfLmtleXMoZmllbGRzKVxuXG5cdFx0aWYga2V5cy5sZW5ndGggPCAxXG5cdFx0XHRrZXlzID0gXy5rZXlzKF9maWVsZHMpXG5cblx0XHRfa2V5cyA9IFtdXG5cblx0XHRrZXlzLmZvckVhY2ggKGtleSktPlxuXHRcdFx0aWYgX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXVxuXHRcdFx0XHRfa2V5cyA9IF9rZXlzLmNvbmNhdChfLm1hcChfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddLCAoayktPlxuXHRcdFx0XHRcdHJldHVybiBrZXkgKyAnLicgKyBrXG5cdFx0XHRcdCkpXG5cdFx0XHRfa2V5cy5wdXNoKGtleSlcblxuXHRcdF9rZXlzLmZvckVhY2ggKGtleSktPlxuXHRcdFx0cmVmZXJlbmNlX2ZpZWxkID0gX2ZpZWxkc1trZXldXG5cblx0XHRcdGlmIHJlZmVyZW5jZV9maWVsZCAmJiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykpICAjIGFuZCBDcmVhdG9yLkNvbGxlY3Rpb25zW3JlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG9dXG5cdFx0XHRcdGRhdGEuY2hpbGRyZW4ucHVzaCB7XG5cdFx0XHRcdFx0ZmluZDogKHBhcmVudCkgLT5cblx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRzZWxmLnVuYmxvY2soKTtcblxuXHRcdFx0XHRcdFx0XHRxdWVyeSA9IHt9XG5cblx0XHRcdFx0XHRcdFx0IyDooajmoLzlrZDlrZfmrrXnibnmrorlpITnkIZcblx0XHRcdFx0XHRcdFx0aWYgL1xcdysoXFwuXFwkXFwuKXsxfVxcdysvLnRlc3Qoa2V5KVxuXHRcdFx0XHRcdFx0XHRcdHBfayA9IGtleS5yZXBsYWNlKC8oXFx3KylcXC5cXCRcXC5cXHcrL2lnLCBcIiQxXCIpXG5cdFx0XHRcdFx0XHRcdFx0c19rID0ga2V5LnJlcGxhY2UoL1xcdytcXC5cXCRcXC4oXFx3KykvaWcsIFwiJDFcIilcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfaWRzID0gcGFyZW50W3Bfa10uZ2V0UHJvcGVydHkoc19rKVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX2lkcyA9IGtleS5zcGxpdCgnLicpLnJlZHVjZSAobywgeCkgLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0bz9beF1cblx0XHRcdFx0XHRcdFx0XHQsIHBhcmVudFxuXG5cdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG9cblxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90bygpXG5cblx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KHJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRpZiBfLmlzT2JqZWN0KHJlZmVyZW5jZV9pZHMpICYmICFfLmlzQXJyYXkocmVmZXJlbmNlX2lkcylcblx0XHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9pZHMub1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX2lkcyA9IHJlZmVyZW5jZV9pZHMuaWRzIHx8IFtdXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFtdXG5cblx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpXG5cdFx0XHRcdFx0XHRcdFx0cXVlcnkuX2lkID0geyRpbjogcmVmZXJlbmNlX2lkc31cblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHJlZmVyZW5jZV9pZHNcblxuXHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG9fb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxuXG5cdFx0XHRcdFx0XHRcdG5hbWVfZmllbGRfa2V5ID0gcmVmZXJlbmNlX3RvX29iamVjdC5OQU1FX0ZJRUxEX0tFWVxuXG5cdFx0XHRcdFx0XHRcdGNoaWxkcmVuX2ZpZWxkcyA9IHtfaWQ6IDEsIHNwYWNlOiAxfVxuXG5cdFx0XHRcdFx0XHRcdGlmIG5hbWVfZmllbGRfa2V5XG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW5fZmllbGRzW25hbWVfZmllbGRfa2V5XSA9IDFcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZChxdWVyeSwge1xuXHRcdFx0XHRcdFx0XHRcdGZpZWxkczogY2hpbGRyZW5fZmllbGRzXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhyZWZlcmVuY2VfdG8sIHBhcmVudCwgZSlcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFtdXG5cdFx0XHRcdH1cblxuXHRcdHJldHVybiBkYXRhXG5cdGVsc2Vcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZmluZDogKCktPlxuXHRcdFx0XHRzZWxmLnVuYmxvY2soKTtcblx0XHRcdFx0cmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe19pZDogeyRpbjogaWRzfX0sIHtmaWVsZHM6IGZpZWxkc30pXG5cdFx0fTtcblxuIiwiTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUoXCJzdGVlZG9zX29iamVjdF90YWJ1bGFyXCIsIGZ1bmN0aW9uKHRhYmxlTmFtZSwgaWRzLCBmaWVsZHMsIHNwYWNlSWQpIHtcbiAgdmFyIF9maWVsZHMsIF9rZXlzLCBfb2JqZWN0LCBfb2JqZWN0X25hbWUsIGRhdGEsIGtleXMsIG9iamVjdF9jb2xsZWNpdG9uLCByZWZlcmVuY2VfZmllbGRzLCBzZWxmO1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBjaGVjayh0YWJsZU5hbWUsIFN0cmluZyk7XG4gIGNoZWNrKGlkcywgQXJyYXkpO1xuICBjaGVjayhmaWVsZHMsIE1hdGNoLk9wdGlvbmFsKE9iamVjdCkpO1xuICBfb2JqZWN0X25hbWUgPSB0YWJsZU5hbWUucmVwbGFjZShcImNyZWF0b3JfXCIsIFwiXCIpO1xuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX29iamVjdF9uYW1lLCBzcGFjZUlkKTtcbiAgaWYgKHNwYWNlSWQpIHtcbiAgICBfb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldE9iamVjdE5hbWUoX29iamVjdCk7XG4gIH1cbiAgb2JqZWN0X2NvbGxlY2l0b24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oX29iamVjdF9uYW1lKTtcbiAgX2ZpZWxkcyA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZmllbGRzIDogdm9pZCAwO1xuICBpZiAoIV9maWVsZHMgfHwgIW9iamVjdF9jb2xsZWNpdG9uKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZWZlcmVuY2VfZmllbGRzID0gXy5maWx0ZXIoX2ZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgIHJldHVybiBfLmlzRnVuY3Rpb24oZi5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkoZi5yZWZlcmVuY2VfdG8pO1xuICB9KTtcbiAgc2VsZiA9IHRoaXM7XG4gIHNlbGYudW5ibG9jaygpO1xuICBpZiAocmVmZXJlbmNlX2ZpZWxkcy5sZW5ndGggPiAwKSB7XG4gICAgZGF0YSA9IHtcbiAgICAgIGZpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZmllbGRfa2V5cztcbiAgICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICAgIGZpZWxkX2tleXMgPSB7fTtcbiAgICAgICAgXy5lYWNoKF8ua2V5cyhmaWVsZHMpLCBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgaWYgKCEvXFx3KyhcXC5cXCQpezF9XFx3Py8udGVzdChmKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkX2tleXNbZl0gPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtcbiAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICRpbjogaWRzXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBmaWVsZF9rZXlzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgZGF0YS5jaGlsZHJlbiA9IFtdO1xuICAgIGtleXMgPSBfLmtleXMoZmllbGRzKTtcbiAgICBpZiAoa2V5cy5sZW5ndGggPCAxKSB7XG4gICAgICBrZXlzID0gXy5rZXlzKF9maWVsZHMpO1xuICAgIH1cbiAgICBfa2V5cyA9IFtdO1xuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmIChfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddKSB7XG4gICAgICAgIF9rZXlzID0gX2tleXMuY29uY2F0KF8ubWFwKF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ10sIGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICByZXR1cm4ga2V5ICsgJy4nICsgaztcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9rZXlzLnB1c2goa2V5KTtcbiAgICB9KTtcbiAgICBfa2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIHJlZmVyZW5jZV9maWVsZDtcbiAgICAgIHJlZmVyZW5jZV9maWVsZCA9IF9maWVsZHNba2V5XTtcbiAgICAgIGlmIChyZWZlcmVuY2VfZmllbGQgJiYgKF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pKSkge1xuICAgICAgICByZXR1cm4gZGF0YS5jaGlsZHJlbi5wdXNoKHtcbiAgICAgICAgICBmaW5kOiBmdW5jdGlvbihwYXJlbnQpIHtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbl9maWVsZHMsIGUsIG5hbWVfZmllbGRfa2V5LCBwX2ssIHF1ZXJ5LCByZWZlcmVuY2VfaWRzLCByZWZlcmVuY2VfdG8sIHJlZmVyZW5jZV90b19vYmplY3QsIHNfaztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHNlbGYudW5ibG9jaygpO1xuICAgICAgICAgICAgICBxdWVyeSA9IHt9O1xuICAgICAgICAgICAgICBpZiAoL1xcdysoXFwuXFwkXFwuKXsxfVxcdysvLnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgIHBfayA9IGtleS5yZXBsYWNlKC8oXFx3KylcXC5cXCRcXC5cXHcrL2lnLCBcIiQxXCIpO1xuICAgICAgICAgICAgICAgIHNfayA9IGtleS5yZXBsYWNlKC9cXHcrXFwuXFwkXFwuKFxcdyspL2lnLCBcIiQxXCIpO1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZV9pZHMgPSBwYXJlbnRbcF9rXS5nZXRQcm9wZXJ0eShzX2spO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZV9pZHMgPSBrZXkuc3BsaXQoJy4nKS5yZWR1Y2UoZnVuY3Rpb24obywgeCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIG8gIT0gbnVsbCA/IG9beF0gOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgfSwgcGFyZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8oKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChyZWZlcmVuY2VfaWRzKSAmJiAhXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpKSB7XG4gICAgICAgICAgICAgICAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfaWRzLm87XG4gICAgICAgICAgICAgICAgICByZWZlcmVuY2VfaWRzID0gcmVmZXJlbmNlX2lkcy5pZHMgfHwgW107XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKF8uaXNBcnJheShyZWZlcmVuY2VfaWRzKSkge1xuICAgICAgICAgICAgICAgIHF1ZXJ5Ll9pZCA9IHtcbiAgICAgICAgICAgICAgICAgICRpbjogcmVmZXJlbmNlX2lkc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcXVlcnkuX2lkID0gcmVmZXJlbmNlX2lkcztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWZlcmVuY2VfdG9fb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVmZXJlbmNlX3RvLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgbmFtZV9maWVsZF9rZXkgPSByZWZlcmVuY2VfdG9fb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICAgICAgICAgICAgICBjaGlsZHJlbl9maWVsZHMgPSB7XG4gICAgICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgICAgIHNwYWNlOiAxXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGlmIChuYW1lX2ZpZWxkX2tleSkge1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuX2ZpZWxkc1tuYW1lX2ZpZWxkX2tleV0gPSAxO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kKHF1ZXJ5LCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiBjaGlsZHJlbl9maWVsZHNcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlZmVyZW5jZV90bywgcGFyZW50LCBlKTtcbiAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLnVuYmxvY2soKTtcbiAgICAgICAgcmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe1xuICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgJGluOiBpZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoIFwib2JqZWN0X2xpc3R2aWV3c1wiLCAob2JqZWN0X25hbWUsIHNwYWNlSWQpLT5cbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc3BhY2U6IHNwYWNlSWQgLFwiJG9yXCI6W3tvd25lcjogdXNlcklkfSwge3NoYXJlZDogdHJ1ZX1dfSkiLCJNZXRlb3IucHVibGlzaCBcInVzZXJfdGFidWxhcl9zZXR0aW5nc1wiLCAob2JqZWN0X25hbWUpLT5cbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmQoe29iamVjdF9uYW1lOiB7JGluOiBvYmplY3RfbmFtZX0sIHJlY29yZF9pZDogeyRpbjogW1wib2JqZWN0X2xpc3R2aWV3c1wiLCBcIm9iamVjdF9ncmlkdmlld3NcIl19LCBvd25lcjogdXNlcklkfSlcbiIsIk1ldGVvci5wdWJsaXNoIFwicmVsYXRlZF9vYmplY3RzX3JlY29yZHNcIiwgKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCktPlxuXHR1c2VySWQgPSB0aGlzLnVzZXJJZFxuXHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIlxuXHRcdHNlbGVjdG9yID0ge1wibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZH1cblx0ZWxzZVxuXHRcdHNlbGVjdG9yID0ge3NwYWNlOiBzcGFjZUlkfVxuXHRcblx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0IyDpmYTku7bnmoTlhbPogZTmkJzntKLmnaHku7bmmK/lrprmrbvnmoRcblx0XHRzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWVcblx0XHRzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXVxuXHRlbHNlXG5cdFx0c2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZFxuXG5cdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMuYWxsb3dSZWFkXG5cdFx0c2VsZWN0b3Iub3duZXIgPSB1c2VySWRcblx0XG5cdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3RvcikiLCJNZXRlb3IucHVibGlzaChcInJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzXCIsIGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCkge1xuICB2YXIgcGVybWlzc2lvbnMsIHNlbGVjdG9yLCB1c2VySWQ7XG4gIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiKSB7XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWRcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9O1xuICB9XG4gIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgc2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lO1xuICAgIHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdO1xuICB9IGVsc2Uge1xuICAgIHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWQ7XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMuYWxsb3dSZWFkKSB7XG4gICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gIH1cbiAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ3NwYWNlX3VzZXJfaW5mbycsIChzcGFjZUlkLCB1c2VySWQpLT5cblx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9KSIsIlxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cblx0TWV0ZW9yLnB1Ymxpc2ggJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJywgKHNwYWNlSWQpLT5cblxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdFx0dW5sZXNzIHNwYWNlSWRcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRcdHNlbGVjdG9yID1cblx0XHRcdHNwYWNlOiBzcGFjZUlkXG5cdFx0XHRrZXk6ICdjb250YWN0c192aWV3X2xpbWl0cydcblxuXHRcdHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKSIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBzZWxlY3RvcjtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBrZXk6ICdjb250YWN0c192aWV3X2xpbWl0cydcbiAgICB9O1xuICAgIHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKTtcbiAgfSk7XG59XG4iLCJcbmlmIE1ldGVvci5pc1NlcnZlclxuXG5cdE1ldGVvci5wdWJsaXNoICdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycycsIChzcGFjZUlkKS0+XG5cblx0XHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRcdHVubGVzcyBzcGFjZUlkXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0XHRzZWxlY3RvciA9XG5cdFx0XHRzcGFjZTogc3BhY2VJZFxuXHRcdFx0a2V5OiAnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnXG5cblx0XHRyZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3RvcikiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAga2V5OiAnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnXG4gICAgfTtcbiAgICByZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3Rvcik7XG4gIH0pO1xufVxuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG5cdE1ldGVvci5wdWJsaXNoICdzcGFjZV9uZWVkX3RvX2NvbmZpcm0nLCAoKS0+XG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcblx0XHRyZXR1cm4gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdXNlcklkLCBpbnZpdGVfc3RhdGU6IFwicGVuZGluZ1wifSkiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdzcGFjZV9uZWVkX3RvX2NvbmZpcm0nLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIGludml0ZV9zdGF0ZTogXCJwZW5kaW5nXCJcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJwZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9XG5cbnBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3dQZXJtaXNzaW9ucyA9IChmbG93X2lkLCB1c2VyX2lkKSAtPlxuXHQjIOagueaNrjpmbG93X2lk5p+l5Yiw5a+55bqU55qEZmxvd1xuXHRmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpXG5cdHNwYWNlX2lkID0gZmxvdy5zcGFjZVxuXHQjIOagueaNrnNwYWNlX2lk5ZKMOnVzZXJfaWTliLBvcmdhbml6YXRpb25z6KGo5Lit5p+l5Yiw55So5oi35omA5bGe5omA5pyJ55qEb3JnX2lk77yI5YyF5ous5LiK57qn57uESUTvvIlcblx0b3JnX2lkcyA9IG5ldyBBcnJheVxuXHRvcmdhbml6YXRpb25zID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcblx0XHRzcGFjZTogc3BhY2VfaWQsIHVzZXJzOiB1c2VyX2lkIH0sIHsgZmllbGRzOiB7IHBhcmVudHM6IDEgfSB9KS5mZXRjaCgpXG5cdF8uZWFjaChvcmdhbml6YXRpb25zLCAob3JnKSAtPlxuXHRcdG9yZ19pZHMucHVzaChvcmcuX2lkKVxuXHRcdGlmIG9yZy5wYXJlbnRzXG5cdFx0XHRfLmVhY2gob3JnLnBhcmVudHMsIChwYXJlbnRfaWQpIC0+XG5cdFx0XHRcdG9yZ19pZHMucHVzaChwYXJlbnRfaWQpXG5cdFx0XHQpXG5cdClcblx0b3JnX2lkcyA9IF8udW5pcShvcmdfaWRzKVxuXHRteV9wZXJtaXNzaW9ucyA9IG5ldyBBcnJheVxuXHRpZiBmbG93LnBlcm1zXG5cdFx0IyDliKTmlq1mbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbuS4reaYr+WQpuWMheWQq+W9k+WJjeeUqOaIt++8jFxuXHRcdCMg5oiW6ICFZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGTmmK/lkKbljIXlkKs05q2l5b6X5Yiw55qEb3JnX2lk5pWw57uE5Lit55qE5Lu75L2V5LiA5Liq77yMXG5cdFx0IyDoi6XmmK/vvIzliJnlnKjov5Tlm57nmoTmlbDnu4TkuK3liqDkuIphZGRcblx0XHRpZiBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGRcblx0XHRcdHVzZXJzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGRcblx0XHRcdGlmIHVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcl9pZClcblx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKVxuXG5cdFx0aWYgZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGRcblx0XHRcdG9yZ3NfY2FuX2FkZCA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRkXG5cdFx0XHRfLmVhY2gob3JnX2lkcywgKG9yZ19pZCkgLT5cblx0XHRcdFx0aWYgb3Jnc19jYW5fYWRkLmluY2x1ZGVzKG9yZ19pZClcblx0XHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpXG5cdFx0XHQpXG5cdFx0IyDliKTmlq1mbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9y5Lit5piv5ZCm5YyF5ZCr5b2T5YmN55So5oi377yMXG5cdFx0IyDmiJbogIVmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3LmmK/lkKbljIXlkKs05q2l5b6X5Yiw55qEb3JnX2lk5pWw57uE5Lit55qE5Lu75L2V5LiA5Liq77yMXG5cdFx0IyDoi6XmmK/vvIzliJnlnKjov5Tlm57nmoTmlbDnu4TkuK3liqDkuIptb25pdG9yXG5cdFx0aWYgZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvclxuXHRcdFx0dXNlcnNfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yXG5cdFx0XHRpZiB1c2Vyc19jYW5fbW9uaXRvci5pbmNsdWRlcyh1c2VyX2lkKVxuXHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKVxuXG5cdFx0aWYgZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yXG5cdFx0XHRvcmdzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yXG5cdFx0XHRfLmVhY2gob3JnX2lkcywgKG9yZ19pZCkgLT5cblx0XHRcdFx0aWYgb3Jnc19jYW5fbW9uaXRvci5pbmNsdWRlcyhvcmdfaWQpXG5cdFx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIilcblx0XHRcdClcblx0XHQjIOWIpOaWrWZsb3cucGVybXMudXNlcnNfY2FuX2FkbWlu5Lit5piv5ZCm5YyF5ZCr5b2T5YmN55So5oi377yMXG5cdFx0IyDmiJbogIVmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWlu5piv5ZCm5YyF5ZCrNOatpeW+l+WIsOeahG9yZ19pZOaVsOe7hOS4reeahOS7u+S9leS4gOS4qu+8jFxuXHRcdCMg6Iul5piv77yM5YiZ5Zyo6L+U5Zue55qE5pWw57uE5Lit5Yqg5LiKYWRtaW5cblx0XHRpZiBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pblxuXHRcdFx0dXNlcnNfY2FuX2FkbWluID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW5cblx0XHRcdGlmIHVzZXJzX2Nhbl9hZG1pbi5pbmNsdWRlcyh1c2VyX2lkKVxuXHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIilcblxuXHRcdGlmIGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW5cblx0XHRcdG9yZ3NfY2FuX2FkbWluID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pblxuXHRcdFx0Xy5lYWNoKG9yZ19pZHMsIChvcmdfaWQpIC0+XG5cdFx0XHRcdGlmIG9yZ3NfY2FuX2FkbWluLmluY2x1ZGVzKG9yZ19pZClcblx0XHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIilcblx0XHRcdClcblxuXHRteV9wZXJtaXNzaW9ucyA9IF8udW5pcShteV9wZXJtaXNzaW9ucylcblx0cmV0dXJuIG15X3Blcm1pc3Npb25zIiwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5wZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9O1xuXG5wZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93UGVybWlzc2lvbnMgPSBmdW5jdGlvbihmbG93X2lkLCB1c2VyX2lkKSB7XG4gIHZhciBmbG93LCBteV9wZXJtaXNzaW9ucywgb3JnX2lkcywgb3JnYW5pemF0aW9ucywgb3Jnc19jYW5fYWRkLCBvcmdzX2Nhbl9hZG1pbiwgb3Jnc19jYW5fbW9uaXRvciwgc3BhY2VfaWQsIHVzZXJzX2Nhbl9hZGQsIHVzZXJzX2Nhbl9hZG1pbiwgdXNlcnNfY2FuX21vbml0b3I7XG4gIGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZCk7XG4gIHNwYWNlX2lkID0gZmxvdy5zcGFjZTtcbiAgb3JnX2lkcyA9IG5ldyBBcnJheTtcbiAgb3JnYW5pemF0aW9ucyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHVzZXJzOiB1c2VyX2lkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHBhcmVudHM6IDFcbiAgICB9XG4gIH0pLmZldGNoKCk7XG4gIF8uZWFjaChvcmdhbml6YXRpb25zLCBmdW5jdGlvbihvcmcpIHtcbiAgICBvcmdfaWRzLnB1c2gob3JnLl9pZCk7XG4gICAgaWYgKG9yZy5wYXJlbnRzKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKG9yZy5wYXJlbnRzLCBmdW5jdGlvbihwYXJlbnRfaWQpIHtcbiAgICAgICAgcmV0dXJuIG9yZ19pZHMucHVzaChwYXJlbnRfaWQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgb3JnX2lkcyA9IF8udW5pcShvcmdfaWRzKTtcbiAgbXlfcGVybWlzc2lvbnMgPSBuZXcgQXJyYXk7XG4gIGlmIChmbG93LnBlcm1zKSB7XG4gICAgaWYgKGZsb3cucGVybXMudXNlcnNfY2FuX2FkZCkge1xuICAgICAgdXNlcnNfY2FuX2FkZCA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkZDtcbiAgICAgIGlmICh1c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJfaWQpKSB7XG4gICAgICAgIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZGRcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZCkge1xuICAgICAgb3Jnc19jYW5fYWRkID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGQ7XG4gICAgICBfLmVhY2gob3JnX2lkcywgZnVuY3Rpb24ob3JnX2lkKSB7XG4gICAgICAgIGlmIChvcmdzX2Nhbl9hZGQuaW5jbHVkZXMob3JnX2lkKSkge1xuICAgICAgICAgIHJldHVybiBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3IpIHtcbiAgICAgIHVzZXJzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvcjtcbiAgICAgIGlmICh1c2Vyc19jYW5fbW9uaXRvci5pbmNsdWRlcyh1c2VyX2lkKSkge1xuICAgICAgICBteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvcikge1xuICAgICAgb3Jnc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvcjtcbiAgICAgIF8uZWFjaChvcmdfaWRzLCBmdW5jdGlvbihvcmdfaWQpIHtcbiAgICAgICAgaWYgKG9yZ3NfY2FuX21vbml0b3IuaW5jbHVkZXMob3JnX2lkKSkge1xuICAgICAgICAgIHJldHVybiBteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbikge1xuICAgICAgdXNlcnNfY2FuX2FkbWluID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW47XG4gICAgICBpZiAodXNlcnNfY2FuX2FkbWluLmluY2x1ZGVzKHVzZXJfaWQpKSB7XG4gICAgICAgIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW4pIHtcbiAgICAgIG9yZ3NfY2FuX2FkbWluID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pbjtcbiAgICAgIF8uZWFjaChvcmdfaWRzLCBmdW5jdGlvbihvcmdfaWQpIHtcbiAgICAgICAgaWYgKG9yZ3NfY2FuX2FkbWluLmluY2x1ZGVzKG9yZ19pZCkpIHtcbiAgICAgICAgICByZXR1cm4gbXlfcGVybWlzc2lvbnMucHVzaChcImFkbWluXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgbXlfcGVybWlzc2lvbnMgPSBfLnVuaXEobXlfcGVybWlzc2lvbnMpO1xuICByZXR1cm4gbXlfcGVybWlzc2lvbnM7XG59O1xuIiwiX2V2YWwgPSByZXF1aXJlKCdldmFsJylcbm9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcblxuZ2V0T2JqZWN0Q29uZmlnID0gKG9iamVjdEFwaU5hbWUpIC0+XG5cdHJldHVybiBvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkudG9Db25maWcoKVxuXG5nZXRPYmplY3ROYW1lRmllbGRLZXkgPSAob2JqZWN0QXBpTmFtZSkgLT5cblx0cmV0dXJuIG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS5OQU1FX0ZJRUxEX0tFWVxuXG5nZXRSZWxhdGVkcyA9IChvYmplY3RBcGlOYW1lKSAtPlxuXHRyZXR1cm4gTWV0ZW9yLndyYXBBc3luYygob2JqZWN0QXBpTmFtZSwgY2IpIC0+XG5cdFx0b2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLmdldFJlbGF0ZWRzKCkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuXHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxuXHRcdCkob2JqZWN0QXBpTmFtZSlcblxub2JqZWN0RmluZE9uZSA9IChvYmplY3RBcGlOYW1lLCBxdWVyeSkgLT5cblx0cmV0dXJuIE1ldGVvci53cmFwQXN5bmMoKG9iamVjdEFwaU5hbWUsIHF1ZXJ5LCBjYikgLT5cblx0XHRvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkuZmluZChxdWVyeSkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuXHRcdFx0aWYgKHJlc29sdmUgJiYgcmVzb2x2ZS5sZW5ndGggPiAwKVxuXHRcdFx0XHRjYihyZWplY3QsIHJlc29sdmVbMF0pXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGNiKHJlamVjdCwgbnVsbClcblx0XHQpKG9iamVjdEFwaU5hbWUsIHF1ZXJ5KVxuXG5vYmplY3RGaW5kID0gKG9iamVjdEFwaU5hbWUsIHF1ZXJ5KSAtPlxuXHRyZXR1cm4gTWV0ZW9yLndyYXBBc3luYygob2JqZWN0QXBpTmFtZSwgcXVlcnksIGNiKSAtPlxuXHRcdG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS5maW5kKHF1ZXJ5KS50aGVuIChyZXNvbHZlLCByZWplY3QpIC0+XG5cdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXG5cdFx0KShvYmplY3RBcGlOYW1lLCBxdWVyeSlcblxub2JqZWN0VXBkYXRlID0gKG9iamVjdEFwaU5hbWUsIGlkLCBkYXRhKSAtPlxuXHRyZXR1cm4gTWV0ZW9yLndyYXBBc3luYygob2JqZWN0QXBpTmFtZSwgaWQsIGRhdGEsIGNiKSAtPlxuXHRcdG9iamVjdHFsLmdldE9iamVjdChvYmplY3RBcGlOYW1lKS51cGRhdGUoaWQsIGRhdGEpLnRoZW4gKHJlc29sdmUsIHJlamVjdCkgLT5cblx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcblx0XHQpKG9iamVjdEFwaU5hbWUsIGlkLCBkYXRhKVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge31cblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja19hdXRob3JpemF0aW9uID0gKHJlcSkgLT5cblx0cXVlcnkgPSByZXEucXVlcnlcblx0dXNlcklkID0gcXVlcnlbXCJYLVVzZXItSWRcIl1cblx0YXV0aFRva2VuID0gcXVlcnlbXCJYLUF1dGgtVG9rZW5cIl1cblxuXHRpZiBub3QgdXNlcklkIG9yIG5vdCBhdXRoVG9rZW5cblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblxuXHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXG5cdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuXHRcdF9pZDogdXNlcklkLFxuXHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG5cblx0aWYgbm90IHVzZXJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblxuXHRyZXR1cm4gdXNlclxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlID0gKHNwYWNlX2lkKSAtPlxuXHRzcGFjZSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpXG5cdGlmIG5vdCBzcGFjZVxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwic3BhY2VfaWTmnInor6/miJbmraRzcGFjZeW3sue7j+iiq+WIoOmZpFwiKVxuXHRyZXR1cm4gc3BhY2VcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93ID0gKGZsb3dfaWQpIC0+XG5cdGZsb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZsb3dzLmZpbmRPbmUoZmxvd19pZClcblx0aWYgbm90IGZsb3dcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcImlk5pyJ6K+v5oiW5q2k5rWB56iL5bey57uP6KKr5Yig6ZmkXCIpXG5cdHJldHVybiBmbG93XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyID0gKHNwYWNlX2lkLCB1c2VyX2lkKSAtPlxuXHRzcGFjZV91c2VyID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZV91c2Vycy5maW5kT25lKHsgc3BhY2U6IHNwYWNlX2lkLCB1c2VyOiB1c2VyX2lkIH0pXG5cdGlmIG5vdCBzcGFjZV91c2VyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJ1c2VyX2lk5a+55bqU55qE55So5oi35LiN5bGe5LqO5b2T5YmNc3BhY2VcIilcblx0cmV0dXJuIHNwYWNlX3VzZXJcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXJPcmdJbmZvID0gKHNwYWNlX3VzZXIpIC0+XG5cdGluZm8gPSBuZXcgT2JqZWN0XG5cdGluZm8ub3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb25cblx0b3JnID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vcmdhbml6YXRpb25zLmZpbmRPbmUoc3BhY2VfdXNlci5vcmdhbml6YXRpb24sIHsgZmllbGRzOiB7IG5hbWU6IDEgLCBmdWxsbmFtZTogMSB9IH0pXG5cdGluZm8ub3JnYW5pemF0aW9uX25hbWUgPSBvcmcubmFtZVxuXHRpbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IG9yZy5mdWxsbmFtZVxuXHRyZXR1cm4gaW5mb1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd0VuYWJsZWQgPSAoZmxvdykgLT5cblx0aWYgZmxvdy5zdGF0ZSBpc250IFwiZW5hYmxlZFwiXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvmnKrlkK/nlKgs5pON5L2c5aSx6LSlXCIpXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93U3BhY2VNYXRjaGVkID0gKGZsb3csIHNwYWNlX2lkKSAtPlxuXHRpZiBmbG93LnNwYWNlIGlzbnQgc3BhY2VfaWRcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+WSjOW3peS9nOWMuklE5LiN5Yy56YWNXCIpXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybSA9IChmb3JtX2lkKSAtPlxuXHRmb3JtID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5mb3Jtcy5maW5kT25lKGZvcm1faWQpXG5cdGlmIG5vdCBmb3JtXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+ihqOWNlUlE5pyJ6K+v5oiW5q2k6KGo5Y2V5bey57uP6KKr5Yig6ZmkJylcblxuXHRyZXR1cm4gZm9ybVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldENhdGVnb3J5ID0gKGNhdGVnb3J5X2lkKSAtPlxuXHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5jYXRlZ29yaWVzLmZpbmRPbmUoY2F0ZWdvcnlfaWQpXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tTeW5jRGlyZWN0aW9uID0gKG9iamVjdF9uYW1lLCBmbG93X2lkKSAtPlxuXHRvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3dvcmtmbG93cy5maW5kT25lKHtcblx0XHRvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG5cdFx0Zmxvd19pZDogZmxvd19pZFxuXHR9KVxuXHRpZiAhb3dcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn5pyq5om+5Yiw5a+56LGh5rWB56iL5pig5bCE6K6w5b2V44CCJylcblx0c3luY0RpcmVjdGlvbiA9IG93LnN5bmNfZGlyZWN0aW9uIHx8ICdib3RoJ1xuXHRpZiAhWydib3RoJywgJ29ial90b19pbnMnXS5pbmNsdWRlcyhzeW5jRGlyZWN0aW9uKVxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsICfkuI3mlK/mjIHnmoTlkIzmraXmlrnlkJHjgIInKVxuXG5cdHJldHVybiBcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UgPSAoaW5zdGFuY2VfZnJvbV9jbGllbnQsIHVzZXJfaW5mbykgLT5cblx0Y2hlY2sgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0sIFN0cmluZ1xuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdLCBTdHJpbmdcblx0Y2hlY2sgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdLCBTdHJpbmdcblx0Y2hlY2sgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdLCBbe286IFN0cmluZywgaWRzOiBbU3RyaW5nXX1dXG5cblx0IyDmoKHpqozlkIzmraXmlrnlkJFcblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja1N5bmNEaXJlY3Rpb24oaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdWzBdLm8sIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXSlcblxuXHQjIOagoemqjOaYr+WQpnJlY29yZOW3sue7j+WPkei1t+eahOeUs+ivt+i/mOWcqOWuoeaJueS4rVxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVswXSwgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSlcblxuXHRzcGFjZV9pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl1cblx0Zmxvd19pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXVxuXHR1c2VyX2lkID0gdXNlcl9pbmZvLl9pZFxuXHQjIOiOt+WPluWJjeWPsOaJgOS8oOeahHRyYWNlXG5cdHRyYWNlX2Zyb21fY2xpZW50ID0gbnVsbFxuXHQjIOiOt+WPluWJjeWPsOaJgOS8oOeahGFwcHJvdmVcblx0YXBwcm92ZV9mcm9tX2NsaWVudCA9IG51bGxcblx0aWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl0gYW5kIGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdXG5cdFx0dHJhY2VfZnJvbV9jbGllbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXVxuXHRcdGlmIHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl0gYW5kIHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl1bMF1cblx0XHRcdGFwcHJvdmVfZnJvbV9jbGllbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXVtcImFwcHJvdmVzXCJdWzBdXG5cblx0IyDojrflj5bkuIDkuKpzcGFjZVxuXHRzcGFjZSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2Uoc3BhY2VfaWQpXG5cdCMg6I635Y+W5LiA5LiqZmxvd1xuXHRmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpXG5cdCMg6I635Y+W5LiA5Liqc3BhY2XkuIvnmoTkuIDkuKp1c2VyXG5cdHNwYWNlX3VzZXIgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlcihzcGFjZV9pZCwgdXNlcl9pZClcblx0IyDojrflj5ZzcGFjZV91c2Vy5omA5Zyo55qE6YOo6Zeo5L+h5oGvXG5cdHNwYWNlX3VzZXJfb3JnX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8oc3BhY2VfdXNlcilcblx0IyDliKTmlq3kuIDkuKpmbG935piv5ZCm5Li65ZCv55So54q25oCBXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZChmbG93KVxuXHQjIOWIpOaWreS4gOS4qmZsb3flkoxzcGFjZV9pZOaYr+WQpuWMuemFjVxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZChmbG93LCBzcGFjZV9pZClcblxuXHRmb3JtID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtKGZsb3cuZm9ybSlcblxuXHRwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93X2lkLCB1c2VyX2lkKVxuXG5cdGlmIG5vdCBwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkZFwiKVxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5b2T5YmN55So5oi35rKh5pyJ5q2k5rWB56iL55qE5paw5bu65p2D6ZmQXCIpXG5cblx0bm93ID0gbmV3IERhdGVcblx0aW5zX29iaiA9IHt9XG5cdGluc19vYmouX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuX21ha2VOZXdJRCgpXG5cdGluc19vYmouc3BhY2UgPSBzcGFjZV9pZFxuXHRpbnNfb2JqLmZsb3cgPSBmbG93X2lkXG5cdGluc19vYmouZmxvd192ZXJzaW9uID0gZmxvdy5jdXJyZW50Ll9pZFxuXHRpbnNfb2JqLmZvcm0gPSBmbG93LmZvcm1cblx0aW5zX29iai5mb3JtX3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuZm9ybV92ZXJzaW9uXG5cdGluc19vYmoubmFtZSA9IGZsb3cubmFtZVxuXHRpbnNfb2JqLnN1Ym1pdHRlciA9IHVzZXJfaWRcblx0aW5zX29iai5zdWJtaXR0ZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lXG5cdGluc19vYmouYXBwbGljYW50ID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSBlbHNlIHVzZXJfaWRcblx0aW5zX29iai5hcHBsaWNhbnRfbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIGVsc2UgdXNlcl9pbmZvLm5hbWVcblx0aW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdIGVsc2Ugc3BhY2VfdXNlci5vcmdhbml6YXRpb25cblx0aW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdIGVsc2Ugc3BhY2VfdXNlcl9vcmdfaW5mby5vcmdhbml6YXRpb25fbmFtZVxuXHRpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gZWxzZSAgc3BhY2VfdXNlcl9vcmdfaW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWVcblx0aW5zX29iai5hcHBsaWNhbnRfY29tcGFueSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdIGVsc2Ugc3BhY2VfdXNlci5jb21wYW55X2lkXG5cdGluc19vYmouc3RhdGUgPSAnZHJhZnQnXG5cdGluc19vYmouY29kZSA9ICcnXG5cdGluc19vYmouaXNfYXJjaGl2ZWQgPSBmYWxzZVxuXHRpbnNfb2JqLmlzX2RlbGV0ZWQgPSBmYWxzZVxuXHRpbnNfb2JqLmNyZWF0ZWQgPSBub3dcblx0aW5zX29iai5jcmVhdGVkX2J5ID0gdXNlcl9pZFxuXHRpbnNfb2JqLm1vZGlmaWVkID0gbm93XG5cdGluc19vYmoubW9kaWZpZWRfYnkgPSB1c2VyX2lkXG5cblx0aW5zX29iai5yZWNvcmRfaWRzID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdXG5cblx0aWYgc3BhY2VfdXNlci5jb21wYW55X2lkXG5cdFx0aW5zX29iai5jb21wYW55X2lkID0gc3BhY2VfdXNlci5jb21wYW55X2lkXG5cblx0IyDmlrDlu7pUcmFjZVxuXHR0cmFjZV9vYmogPSB7fVxuXHR0cmFjZV9vYmouX2lkID0gbmV3IE1vbmdvLk9iamVjdElEKCkuX3N0clxuXHR0cmFjZV9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZFxuXHR0cmFjZV9vYmouaXNfZmluaXNoZWQgPSBmYWxzZVxuXHQjIOW9k+WJjeacgOaWsOeJiGZsb3fkuK3lvIDlp4voioLngrlcblx0c3RhcnRfc3RlcCA9IF8uZmluZChmbG93LmN1cnJlbnQuc3RlcHMsIChzdGVwKSAtPlxuXHRcdHJldHVybiBzdGVwLnN0ZXBfdHlwZSBpcyAnc3RhcnQnXG5cdClcblx0dHJhY2Vfb2JqLnN0ZXAgPSBzdGFydF9zdGVwLl9pZFxuXHR0cmFjZV9vYmoubmFtZSA9IHN0YXJ0X3N0ZXAubmFtZVxuXG5cdHRyYWNlX29iai5zdGFydF9kYXRlID0gbm93XG5cdCMg5paw5bu6QXBwcm92ZVxuXHRhcHByX29iaiA9IHt9XG5cdGFwcHJfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHJcblx0YXBwcl9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZFxuXHRhcHByX29iai50cmFjZSA9IHRyYWNlX29iai5faWRcblx0YXBwcl9vYmouaXNfZmluaXNoZWQgPSBmYWxzZVxuXHRhcHByX29iai51c2VyID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSBlbHNlIHVzZXJfaWRcblx0YXBwcl9vYmoudXNlcl9uYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gZWxzZSB1c2VyX2luZm8ubmFtZVxuXHRhcHByX29iai5oYW5kbGVyID0gdXNlcl9pZFxuXHRhcHByX29iai5oYW5kbGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZVxuXHRhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbiA9IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uXG5cdGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX25hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLm5hbWVcblx0YXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLmZ1bGxuYW1lXG5cdGFwcHJfb2JqLnR5cGUgPSAnZHJhZnQnXG5cdGFwcHJfb2JqLnN0YXJ0X2RhdGUgPSBub3dcblx0YXBwcl9vYmoucmVhZF9kYXRlID0gbm93XG5cdGFwcHJfb2JqLmlzX3JlYWQgPSB0cnVlXG5cdGFwcHJfb2JqLmlzX2Vycm9yID0gZmFsc2Vcblx0YXBwcl9vYmouZGVzY3JpcHRpb24gPSAnJ1xuXHRyZWxhdGVkVGFibGVzSW5mbyA9IHt9XG5cdGFwcHJfb2JqLnZhbHVlcyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMoaW5zX29iai5yZWNvcmRfaWRzWzBdLCBmbG93X2lkLCBzcGFjZV9pZCwgZm9ybS5jdXJyZW50LmZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pXG5cblx0dHJhY2Vfb2JqLmFwcHJvdmVzID0gW2FwcHJfb2JqXVxuXHRpbnNfb2JqLnRyYWNlcyA9IFt0cmFjZV9vYmpdXG5cblx0aW5zX29iai52YWx1ZXMgPSBhcHByX29iai52YWx1ZXNcblxuXHRpbnNfb2JqLmluYm94X3VzZXJzID0gaW5zdGFuY2VfZnJvbV9jbGllbnQuaW5ib3hfdXNlcnMgfHwgW11cblxuXHRpbnNfb2JqLmN1cnJlbnRfc3RlcF9uYW1lID0gc3RhcnRfc3RlcC5uYW1lXG5cblx0aWYgZmxvdy5hdXRvX3JlbWluZCBpcyB0cnVlXG5cdFx0aW5zX29iai5hdXRvX3JlbWluZCA9IHRydWVcblxuXHQjIOaWsOW7uueUs+ivt+WNleaXtu+8jGluc3RhbmNlc+iusOW9lea1geeoi+WQjeensOOAgea1geeoi+WIhuexu+WQjeensCAjMTMxM1xuXHRpbnNfb2JqLmZsb3dfbmFtZSA9IGZsb3cubmFtZVxuXHRpZiBmb3JtLmNhdGVnb3J5XG5cdFx0Y2F0ZWdvcnkgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldENhdGVnb3J5KGZvcm0uY2F0ZWdvcnkpXG5cdFx0aWYgY2F0ZWdvcnlcblx0XHRcdGluc19vYmouY2F0ZWdvcnlfbmFtZSA9IGNhdGVnb3J5Lm5hbWVcblx0XHRcdGluc19vYmouY2F0ZWdvcnkgPSBjYXRlZ29yeS5faWRcblxuXHRuZXdfaW5zX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuaW5zZXJ0KGluc19vYmopXG5cblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlY29yZEluc3RhbmNlSW5mbyhpbnNfb2JqLnJlY29yZF9pZHNbMF0sIG5ld19pbnNfaWQsIHNwYWNlX2lkKVxuXG5cdCMgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlbGF0ZWRSZWNvcmRJbnN0YW5jZUluZm8ocmVsYXRlZFRhYmxlc0luZm8sIG5ld19pbnNfaWQsIHNwYWNlX2lkKVxuXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2goaW5zX29iai5yZWNvcmRfaWRzWzBdLCBzcGFjZV9pZCwgaW5zX29iai5faWQsIGFwcHJfb2JqLl9pZClcblxuXHRyZXR1cm4gbmV3X2luc19pZFxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlVmFsdWVzID0gKHJlY29yZElkcywgZmxvd0lkLCBzcGFjZUlkLCBmaWVsZHMsIHJlbGF0ZWRUYWJsZXNJbmZvKSAtPlxuXHRmaWVsZENvZGVzID0gW11cblx0Xy5lYWNoIGZpZWxkcywgKGYpIC0+XG5cdFx0aWYgZi50eXBlID09ICdzZWN0aW9uJ1xuXHRcdFx0Xy5lYWNoIGYuZmllbGRzLCAoZmYpIC0+XG5cdFx0XHRcdGZpZWxkQ29kZXMucHVzaCBmZi5jb2RlXG5cdFx0ZWxzZVxuXHRcdFx0ZmllbGRDb2Rlcy5wdXNoIGYuY29kZVxuXG5cdHZhbHVlcyA9IHt9XG5cdG9iamVjdE5hbWUgPSByZWNvcmRJZHMub1xuXHRvYmplY3QgPSBnZXRPYmplY3RDb25maWcob2JqZWN0TmFtZSlcblx0cmVjb3JkSWQgPSByZWNvcmRJZHMuaWRzWzBdXG5cdG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3Rfd29ya2Zsb3dzLmZpbmRPbmUoe1xuXHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxuXHRcdGZsb3dfaWQ6IGZsb3dJZFxuXHR9KVxuXHQjIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKHJlY29yZElkKVxuXHRyZWNvcmQgPSBvYmplY3RGaW5kT25lKG9iamVjdE5hbWUsIHsgZmlsdGVyczogW1snX2lkJywgJz0nLCByZWNvcmRJZF1dfSlcblx0ZmxvdyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignZmxvd3MnKS5maW5kT25lKGZsb3dJZCwgeyBmaWVsZHM6IHsgZm9ybTogMSB9IH0pXG5cdGlmIG93IGFuZCByZWNvcmRcblx0XHRmb3JtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiZm9ybXNcIikuZmluZE9uZShmbG93LmZvcm0pXG5cdFx0Zm9ybUZpZWxkcyA9IGZvcm0uY3VycmVudC5maWVsZHMgfHwgW11cblx0XHRyZWxhdGVkT2JqZWN0cyA9IGdldFJlbGF0ZWRzKG9iamVjdE5hbWUpXG5cdFx0cmVsYXRlZE9iamVjdHNLZXlzID0gXy5wbHVjayhyZWxhdGVkT2JqZWN0cywgJ29iamVjdF9uYW1lJylcblx0XHRmb3JtVGFibGVGaWVsZHMgPSBfLmZpbHRlciBmb3JtRmllbGRzLCAoZm9ybUZpZWxkKSAtPlxuXHRcdFx0cmV0dXJuIGZvcm1GaWVsZC50eXBlID09ICd0YWJsZSdcblx0XHRmb3JtVGFibGVGaWVsZHNDb2RlID0gXy5wbHVjayhmb3JtVGFibGVGaWVsZHMsICdjb2RlJylcblxuXHRcdGdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUgPSAgKGtleSkgLT5cblx0XHRcdHJldHVybiBfLmZpbmQgcmVsYXRlZE9iamVjdHNLZXlzLCAgKHJlbGF0ZWRPYmplY3RzS2V5KSAtPlxuXHRcdFx0XHRyZXR1cm4ga2V5LnN0YXJ0c1dpdGgocmVsYXRlZE9iamVjdHNLZXkgKyAnLicpXG5cblx0XHRnZXRGb3JtVGFibGVGaWVsZENvZGUgPSAoa2V5KSAtPlxuXHRcdFx0cmV0dXJuIF8uZmluZCBmb3JtVGFibGVGaWVsZHNDb2RlLCAgKGZvcm1UYWJsZUZpZWxkQ29kZSkgLT5cblx0XHRcdFx0cmV0dXJuIGtleS5zdGFydHNXaXRoKGZvcm1UYWJsZUZpZWxkQ29kZSArICcuJylcblxuXHRcdGdldEZvcm1UYWJsZUZpZWxkID0gKGtleSkgLT5cblx0XHRcdHJldHVybiBfLmZpbmQgZm9ybVRhYmxlRmllbGRzLCAgKGYpIC0+XG5cdFx0XHRcdHJldHVybiBmLmNvZGUgPT0ga2V5XG5cblx0XHRnZXRGb3JtRmllbGQgPSAoa2V5KSAtPlxuXHRcdFx0ZmYgPSBudWxsXG5cdFx0XHRfLmZvckVhY2ggZm9ybUZpZWxkcywgKGYpIC0+XG5cdFx0XHRcdGlmIGZmXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdGlmIGYudHlwZSA9PSAnc2VjdGlvbidcblx0XHRcdFx0XHRmZiA9IF8uZmluZCBmLmZpZWxkcywgIChzZikgLT5cblx0XHRcdFx0XHRcdHJldHVybiBzZi5jb2RlID09IGtleVxuXHRcdFx0XHRlbHNlIGlmIGYuY29kZSA9PSBrZXlcblx0XHRcdFx0XHRmZiA9IGZcblxuXHRcdFx0cmV0dXJuIGZmXG5cblx0XHRnZXRGb3JtVGFibGVTdWJGaWVsZCA9ICh0YWJsZUZpZWxkLCBzdWJGaWVsZENvZGUpIC0+XG5cdFx0XHRyZXR1cm4gXy5maW5kIHRhYmxlRmllbGQuZmllbGRzLCAgKGYpIC0+XG5cdFx0XHRcdHJldHVybiBmLmNvZGUgPT0gc3ViRmllbGRDb2RlXG5cblx0XHRnZXRGaWVsZE9kYXRhVmFsdWUgPSAob2JqTmFtZSwgaWQsIHJlZmVyZW5jZVRvRmllbGROYW1lKSAtPlxuXHRcdFx0IyBvYmogPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqTmFtZSlcblx0XHRcdG9iaiA9IG9iamVjdHFsLmdldE9iamVjdChvYmpOYW1lKVxuXHRcdFx0bmFtZUtleSA9IGdldE9iamVjdE5hbWVGaWVsZEtleShvYmpOYW1lKVxuXHRcdFx0aWYgIW9ialxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIF8uaXNTdHJpbmcgaWRcblx0XHRcdFx0IyBfcmVjb3JkID0gb2JqLmZpbmRPbmUoaWQpXG5cdFx0XHRcdF9yZWNvcmQgPSBvYmplY3RGaW5kT25lKG9iak5hbWUsIHsgZmlsdGVyczogW1tyZWZlcmVuY2VUb0ZpZWxkTmFtZSwgJz0nLCBpZF1dfSlcblx0XHRcdFx0aWYgX3JlY29yZFxuXHRcdFx0XHRcdF9yZWNvcmRbJ0BsYWJlbCddID0gX3JlY29yZFtuYW1lS2V5XVxuXHRcdFx0XHRcdHJldHVybiBfcmVjb3JkXG5cdFx0XHRlbHNlIGlmIF8uaXNBcnJheSBpZFxuXHRcdFx0XHRfcmVjb3JkcyA9IFtdXG5cdFx0XHRcdCMgb2JqLmZpbmQoeyBfaWQ6IHsgJGluOiBpZCB9IH0pXG5cdFx0XHRcdG9iamVjdEZpbmQob2JqTmFtZSwgeyBmaWx0ZXJzOiBbW3JlZmVyZW5jZVRvRmllbGROYW1lLCAnaW4nLCBpZF1dfSkuZm9yRWFjaCAoX3JlY29yZCkgLT5cblx0XHRcdFx0XHRfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmRbbmFtZUtleV1cblx0XHRcdFx0XHRfcmVjb3Jkcy5wdXNoIF9yZWNvcmRcblx0XHRcdFx0aWYgIV8uaXNFbXB0eSBfcmVjb3Jkc1xuXHRcdFx0XHRcdHJldHVybiBfcmVjb3Jkc1xuXHRcdFx0cmV0dXJuXG5cblx0XHRnZXRTZWxlY3RVc2VyVmFsdWUgPSAodXNlcklkLCBzcGFjZUlkKSAtPlxuXHRcdFx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSlcblx0XHRcdHN1LmlkID0gdXNlcklkXG5cdFx0XHRyZXR1cm4gc3VcblxuXHRcdGdldFNlbGVjdFVzZXJWYWx1ZXMgPSAodXNlcklkcywgc3BhY2VJZCkgLT5cblx0XHRcdHN1cyA9IFtdXG5cdFx0XHRpZiBfLmlzQXJyYXkgdXNlcklkc1xuXHRcdFx0XHRfLmVhY2ggdXNlcklkcywgKHVzZXJJZCkgLT5cblx0XHRcdFx0XHRzdSA9IGdldFNlbGVjdFVzZXJWYWx1ZSh1c2VySWQsIHNwYWNlSWQpXG5cdFx0XHRcdFx0aWYgc3Vcblx0XHRcdFx0XHRcdHN1cy5wdXNoKHN1KVxuXHRcdFx0cmV0dXJuIHN1c1xuXG5cdFx0Z2V0U2VsZWN0T3JnVmFsdWUgPSAob3JnSWQsIHNwYWNlSWQpIC0+XG5cdFx0XHRvcmcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kT25lKG9yZ0lkLCB7IGZpZWxkczogeyBfaWQ6IDEsIG5hbWU6IDEsIGZ1bGxuYW1lOiAxIH0gfSlcblx0XHRcdG9yZy5pZCA9IG9yZ0lkXG5cdFx0XHRyZXR1cm4gb3JnXG5cblx0XHRnZXRTZWxlY3RPcmdWYWx1ZXMgPSAob3JnSWRzLCBzcGFjZUlkKSAtPlxuXHRcdFx0b3JncyA9IFtdXG5cdFx0XHRpZiBfLmlzQXJyYXkgb3JnSWRzXG5cdFx0XHRcdF8uZWFjaCBvcmdJZHMsIChvcmdJZCkgLT5cblx0XHRcdFx0XHRvcmcgPSBnZXRTZWxlY3RPcmdWYWx1ZShvcmdJZCwgc3BhY2VJZClcblx0XHRcdFx0XHRpZiBvcmdcblx0XHRcdFx0XHRcdG9yZ3MucHVzaChvcmcpXG5cdFx0XHRyZXR1cm4gb3Jnc1xuXG5cdFx0dGFibGVGaWVsZENvZGVzID0gW11cblx0XHR0YWJsZUZpZWxkTWFwID0gW11cblx0XHR0YWJsZVRvUmVsYXRlZE1hcCA9IHt9XG5cblx0XHRvdy5maWVsZF9tYXA/LmZvckVhY2ggKGZtKSAtPlxuXHRcdFx0b2JqZWN0X2ZpZWxkID0gZm0ub2JqZWN0X2ZpZWxkXG5cdFx0XHR3b3JrZmxvd19maWVsZCA9IGZtLndvcmtmbG93X2ZpZWxkXG5cdFx0XHRpZiAhb2JqZWN0X2ZpZWxkIHx8ICF3b3JrZmxvd19maWVsZFxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ+acquaJvuWIsOWtl+aute+8jOivt+ajgOafpeWvueixoea1geeoi+aYoOWwhOWtl+autemFjee9ricpXG5cdFx0XHRyZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZShvYmplY3RfZmllbGQpXG5cdFx0XHRmb3JtVGFibGVGaWVsZENvZGUgPSBnZXRGb3JtVGFibGVGaWVsZENvZGUod29ya2Zsb3dfZmllbGQpXG5cdFx0XHRvYmpGaWVsZCA9IG9iamVjdC5maWVsZHNbb2JqZWN0X2ZpZWxkXVxuXHRcdFx0Zm9ybUZpZWxkID0gZ2V0Rm9ybUZpZWxkKHdvcmtmbG93X2ZpZWxkKVxuXHRcdFx0IyDlpITnkIblrZDooajlrZfmrrVcblx0XHRcdGlmIHJlbGF0ZWRPYmplY3RGaWVsZENvZGVcblx0XHRcdFx0XG5cdFx0XHRcdG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXVxuXHRcdFx0XHRvVGFibGVGaWVsZENvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXVxuXHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcEtleSA9IG9UYWJsZUNvZGVcblx0XHRcdFx0aWYgIXRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVxuXHRcdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSA9IHt9XG5cblx0XHRcdFx0aWYgZm9ybVRhYmxlRmllbGRDb2RlXG5cdFx0XHRcdFx0d1RhYmxlQ29kZSA9IHdvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMF1cblx0XHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bJ19GUk9NX1RBQkxFX0NPREUnXSA9IHdUYWJsZUNvZGVcblxuXHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bb1RhYmxlRmllbGRDb2RlXSA9IHdvcmtmbG93X2ZpZWxkXG5cdFx0XHQjIOWIpOaWreaYr+WQpuaYr+ihqOagvOWtl+autVxuXHRcdFx0ZWxzZSBpZiB3b3JrZmxvd19maWVsZC5pbmRleE9mKCcuJykgPiAwIGFuZCBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPiAwXG5cdFx0XHRcdHdUYWJsZUNvZGUgPSB3b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdXG5cdFx0XHRcdG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzBdXG5cdFx0XHRcdGlmIHJlY29yZC5oYXNPd25Qcm9wZXJ0eShvVGFibGVDb2RlKSBhbmQgXy5pc0FycmF5KHJlY29yZFtvVGFibGVDb2RlXSlcblx0XHRcdFx0XHR0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XG5cdFx0XHRcdFx0XHR3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxuXHRcdFx0XHRcdFx0b2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcblx0XHRcdFx0XHR9KSlcblx0XHRcdFx0XHR0YWJsZUZpZWxkTWFwLnB1c2goZm0pXG5cdFx0XHRcdGVsc2UgaWYgb1RhYmxlQ29kZS5pbmRleE9mKCcuJykgPiAwICMg6K+05piO5piv5YWz6IGU6KGo55qEZ3JpZOWtl+autVxuXHRcdFx0XHRcdG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZENvZGUgPSBvVGFibGVDb2RlLnNwbGl0KCcuJylbMF07XG5cdFx0XHRcdFx0Z3JpZENvZGUgPSBvVGFibGVDb2RlLnNwbGl0KCcuJylbMV07XG5cdFx0XHRcdFx0b1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkID0gb2JqZWN0LmZpZWxkc1tvVGFibGVDb2RlUmVmZXJlbmNlRmllbGRDb2RlXTtcblx0XHRcdFx0XHRpZiBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRpZiByZWNvcmRbb1RhYmxlQ29kZV1cblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZE5hbWUgPSBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkIHx8ICdfaWQnO1xuXHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnJlZmVyZW5jZV90bztcblx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQubmFtZV07XG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0RvYyA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9GaWVsZE5hbWUpO1xuXHRcdFx0XHRcdFx0aWYgcmVmZXJlbmNlVG9Eb2NbZ3JpZENvZGVdXG5cdFx0XHRcdFx0XHRcdHJlY29yZFtvVGFibGVDb2RlXSA9IHJlZmVyZW5jZVRvRG9jW2dyaWRDb2RlXTtcblx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZENvZGVzLnB1c2goSlNPTi5zdHJpbmdpZnkoe1xuXHRcdFx0XHRcdFx0XHRcdHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXG5cdFx0XHRcdFx0XHRcdFx0b2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcblx0XHRcdFx0XHRcdFx0fSkpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGFibGVGaWVsZE1hcC5wdXNoKGZtKTtcblxuXHRcdFx0IyDlpITnkIZsb29rdXDjgIFtYXN0ZXJfZGV0YWls57G75Z6L5a2X5q61XG5cdFx0XHRlbHNlIGlmIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJykgPiAwIGFuZCBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPT0gLTFcblx0XHRcdFx0b2JqZWN0RmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF1cblx0XHRcdFx0bG9va3VwRmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV1cblx0XHRcdFx0aWYgb2JqZWN0XG5cdFx0XHRcdFx0b2JqZWN0RmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdEZpZWxkTmFtZV1cblx0XHRcdFx0XHRpZiBvYmplY3RGaWVsZCAmJiBmb3JtRmllbGQgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iamVjdEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0IyBmaWVsZHNPYmogPSB7fVxuXHRcdFx0XHRcdFx0IyBmaWVsZHNPYmpbbG9va3VwRmllbGROYW1lXSA9IDFcblx0XHRcdFx0XHRcdCMgbG9va3VwT2JqZWN0UmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZE9uZShyZWNvcmRbb2JqZWN0RmllbGROYW1lXSwgeyBmaWVsZHM6IGZpZWxkc09iaiB9KVxuXHRcdFx0XHRcdFx0bG9va3VwT2JqZWN0UmVjb3JkID0gb2JqZWN0RmluZE9uZShvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8sIHsgZmlsdGVyczogW1snX2lkJywgJz0nLCByZWNvcmRbb2JqZWN0RmllbGROYW1lXV1dLCBmaWVsZHM6IFtsb29rdXBGaWVsZE5hbWVdIH0pXG5cdFx0XHRcdFx0XHRpZiAhbG9va3VwT2JqZWN0UmVjb3JkXG5cdFx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdFx0b2JqZWN0RmllbGRPYmplY3ROYW1lID0gb2JqZWN0RmllbGQucmVmZXJlbmNlX3RvXG5cdFx0XHRcdFx0XHRsb29rdXBGaWVsZE9iaiA9IGdldE9iamVjdENvbmZpZyhvYmplY3RGaWVsZE9iamVjdE5hbWUpXG5cdFx0XHRcdFx0XHRvYmplY3RMb29rdXBGaWVsZCA9IGxvb2t1cEZpZWxkT2JqLmZpZWxkc1tsb29rdXBGaWVsZE5hbWVdXG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBsb29rdXBPYmplY3RSZWNvcmRbbG9va3VwRmllbGROYW1lXVxuXHRcdFx0XHRcdFx0aWYgb2JqZWN0TG9va3VwRmllbGQgJiYgZm9ybUZpZWxkICYmIGZvcm1GaWVsZC50eXBlID09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iamVjdExvb2t1cEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkTmFtZSA9IG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90b19maWVsZCB8fCAnX2lkJ1xuXHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb09iamVjdE5hbWUgPSBvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlXG5cdFx0XHRcdFx0XHRcdGlmIG9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRcdG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9GaWVsZE5hbWUpXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgIW9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKVxuXHRcdFx0XHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gb2RhdGFGaWVsZFZhbHVlXG5cdFx0XHRcdFx0XHRlbHNlIGlmIG9iamVjdExvb2t1cEZpZWxkICYmIGZvcm1GaWVsZCAmJiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iamVjdExvb2t1cEZpZWxkLnR5cGUpICYmIChbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG8pIHx8ICgnc3BhY2VfdXNlcnMnID09IG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90byAmJiAndXNlcicgPT0gb2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkKSApXG5cdFx0XHRcdFx0XHRcdGlmICFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdGxvb2t1cFNlbGVjdEZpZWxkVmFsdWVcblx0XHRcdFx0XHRcdFx0XHRpZiBmb3JtRmllbGQudHlwZSA9PSAndXNlcidcblx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdExvb2t1cEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBTZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmICFvYmplY3RMb29rdXBGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkLnR5cGUgPT0gJ2dyb3VwJ1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhb2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBTZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0XHRcdGlmIGxvb2t1cFNlbGVjdEZpZWxkVmFsdWVcblx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBsb29rdXBTZWxlY3RGaWVsZFZhbHVlXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBsb29rdXBPYmplY3RSZWNvcmRbbG9va3VwRmllbGROYW1lXVxuXG5cdFx0XHQjIGxvb2t1cOOAgW1hc3Rlcl9kZXRhaWzlrZfmrrXlkIzmraXliLBvZGF0YeWtl+autVxuXHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdHJlZmVyZW5jZVRvRmllbGROYW1lID0gb2JqRmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkIHx8ICdfaWQnXG5cdFx0XHRcdHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9iakZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSByZWNvcmRbb2JqRmllbGQubmFtZV1cblx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlXG5cdFx0XHRcdGlmIG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9GaWVsZE5hbWUpXG5cdFx0XHRcdGVsc2UgaWYgIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKVxuXHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gb2RhdGFGaWVsZFZhbHVlXG5cdFx0XHRlbHNlIGlmIGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iakZpZWxkLnR5cGUpICYmIChbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pIHx8ICgnc3BhY2VfdXNlcnMnID09IG9iakZpZWxkLnJlZmVyZW5jZV90byAmJiAndXNlcicgPT0gb2JqRmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkKSApXG5cdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvYmpGaWVsZC5uYW1lXVxuXHRcdFx0XHRpZiAhXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcblx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlXG5cdFx0XHRcdFx0aWYgZm9ybUZpZWxkLnR5cGUgPT0gJ3VzZXInXG5cdFx0XHRcdFx0XHRpZiBvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAhb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRlbHNlIGlmIGZvcm1GaWVsZC50eXBlID09ICdncm91cCdcblx0XHRcdFx0XHRcdGlmIG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdGVsc2UgaWYgIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRpZiBzZWxlY3RGaWVsZFZhbHVlXG5cdFx0XHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gc2VsZWN0RmllbGRWYWx1ZVxuXHRcdFx0ZWxzZSBpZiByZWNvcmQuaGFzT3duUHJvcGVydHkob2JqZWN0X2ZpZWxkKVxuXHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gcmVjb3JkW29iamVjdF9maWVsZF1cblxuXHRcdCMg6KGo5qC85a2X5q61XG5cdFx0Xy51bmlxKHRhYmxlRmllbGRDb2RlcykuZm9yRWFjaCAodGZjKSAtPlxuXHRcdFx0YyA9IEpTT04ucGFyc2UodGZjKVxuXHRcdFx0dmFsdWVzW2Mud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZV0gPSBbXVxuXHRcdFx0cmVjb3JkW2Mub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGVdLmZvckVhY2ggKHRyKSAtPlxuXHRcdFx0XHRuZXdUciA9IHt9XG5cdFx0XHRcdF8uZWFjaCB0ciwgKHYsIGspIC0+XG5cdFx0XHRcdFx0dGFibGVGaWVsZE1hcC5mb3JFYWNoICh0Zm0pIC0+XG5cdFx0XHRcdFx0XHRpZiB0Zm0ub2JqZWN0X2ZpZWxkIGlzIChjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlICsgJy4kLicgKyBrKVxuXHRcdFx0XHRcdFx0XHR3VGRDb2RlID0gdGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMV1cblx0XHRcdFx0XHRcdFx0bmV3VHJbd1RkQ29kZV0gPSB2XG5cdFx0XHRcdGlmIG5vdCBfLmlzRW1wdHkobmV3VHIpXG5cdFx0XHRcdFx0dmFsdWVzW2Mud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZV0ucHVzaChuZXdUcilcblxuXHRcdCMg5ZCM5q2l5a2Q6KGo5pWw5o2u6Iez6KGo5Y2V6KGo5qC8XG5cdFx0Xy5lYWNoIHRhYmxlVG9SZWxhdGVkTWFwLCAgKG1hcCwga2V5KSAtPlxuXHRcdFx0dGFibGVDb2RlID0gbWFwLl9GUk9NX1RBQkxFX0NPREVcblx0XHRcdGZvcm1UYWJsZUZpZWxkID0gZ2V0Rm9ybVRhYmxlRmllbGQodGFibGVDb2RlKVxuXHRcdFx0aWYgIXRhYmxlQ29kZVxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ3RhYmxlVG9SZWxhdGVkOiBbJyArIGtleSArICddIG1pc3NpbmcgY29ycmVzcG9uZGluZyB0YWJsZS4nKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZWxhdGVkT2JqZWN0TmFtZSA9IGtleVxuXHRcdFx0XHR0YWJsZVZhbHVlcyA9IFtdXG5cdFx0XHRcdHJlbGF0ZWRUYWJsZUl0ZW1zID0gW11cblx0XHRcdFx0cmVsYXRlZE9iamVjdCA9IGdldE9iamVjdENvbmZpZyhyZWxhdGVkT2JqZWN0TmFtZSlcblx0XHRcdFx0cmVsYXRlZEZpZWxkID0gXy5maW5kIHJlbGF0ZWRPYmplY3QuZmllbGRzLCAoZikgLT5cblx0XHRcdFx0XHRyZXR1cm4gWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKGYudHlwZSkgJiYgZi5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0TmFtZVxuXG5cdFx0XHRcdHJlbGF0ZWRGaWVsZE5hbWUgPSByZWxhdGVkRmllbGQubmFtZVxuXG5cdFx0XHRcdHNlbGVjdG9yID0ge31cblx0XHRcdFx0c2VsZWN0b3JbcmVsYXRlZEZpZWxkTmFtZV0gPSByZWNvcmRJZFxuXHRcdFx0XHRyZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZClcblx0XHRcdFx0cmVsYXRlZFJlY29yZHMgPSByZWxhdGVkQ29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKVxuXG5cdFx0XHRcdHJlbGF0ZWRSZWNvcmRzLmZvckVhY2ggKHJyKSAtPlxuXHRcdFx0XHRcdHRhYmxlVmFsdWVJdGVtID0ge31cblx0XHRcdFx0XHRfLmVhY2ggbWFwLCAodmFsdWVLZXksIGZpZWxkS2V5KSAtPlxuXHRcdFx0XHRcdFx0aWYgZmllbGRLZXkgIT0gJ19GUk9NX1RBQkxFX0NPREUnXG5cdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZVxuXHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXlcblx0XHRcdFx0XHRcdFx0aWYgdmFsdWVLZXkuc3RhcnRzV2l0aCh0YWJsZUNvZGUgKyAnLicpXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkS2V5ID0gKHZhbHVlS2V5LnNwbGl0KFwiLlwiKVsxXSlcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleSA9IHZhbHVlS2V5XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRmb3JtRmllbGQgPSBnZXRGb3JtVGFibGVTdWJGaWVsZChmb3JtVGFibGVGaWVsZCwgZm9ybUZpZWxkS2V5KVxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0RmllbGQgPSByZWxhdGVkT2JqZWN0LmZpZWxkc1tmaWVsZEtleV1cblx0XHRcdFx0XHRcdFx0aWYgIWZvcm1GaWVsZCB8fCAhcmVsYXRlZE9iamVjdEZpZWxkXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0XHRcdGlmIGZvcm1GaWVsZC50eXBlID09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZE5hbWUgPSByZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkIHx8ICdfaWQnXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gcmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XVxuXHRcdFx0XHRcdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9GaWVsZE5hbWUpXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9GaWVsZE5hbWUpXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV1cblx0XHRcdFx0XHRcdFx0XHRpZiAhXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGZvcm1GaWVsZC50eXBlID09ICd1c2VyJ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkLnR5cGUgPT0gJ2dyb3VwJ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBycltmaWVsZEtleV1cblx0XHRcdFx0XHRcdFx0dGFibGVWYWx1ZUl0ZW1bZm9ybUZpZWxkS2V5XSA9IHRhYmxlRmllbGRWYWx1ZVxuXHRcdFx0XHRcdGlmICFfLmlzRW1wdHkodGFibGVWYWx1ZUl0ZW0pXG5cdFx0XHRcdFx0XHR0YWJsZVZhbHVlSXRlbS5faWQgPSByci5faWRcblx0XHRcdFx0XHRcdHRhYmxlVmFsdWVzLnB1c2godGFibGVWYWx1ZUl0ZW0pXG5cdFx0XHRcdFx0XHRyZWxhdGVkVGFibGVJdGVtcy5wdXNoKHsgX3RhYmxlOiB7IF9pZDogcnIuX2lkLCBfY29kZTogdGFibGVDb2RlIH0gfSApXG5cblx0XHRcdFx0dmFsdWVzW3RhYmxlQ29kZV0gPSB0YWJsZVZhbHVlc1xuXHRcdFx0XHRyZWxhdGVkVGFibGVzSW5mb1tyZWxhdGVkT2JqZWN0TmFtZV0gPSByZWxhdGVkVGFibGVJdGVtc1xuXG5cdFx0IyDlpoLmnpzphY3nva7kuobohJrmnKzliJnmiafooYzohJrmnKxcblx0XHRpZiBvdy5maWVsZF9tYXBfc2NyaXB0XG5cdFx0XHRfLmV4dGVuZCh2YWx1ZXMsIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0KG93LmZpZWxkX21hcF9zY3JpcHQsIG9iamVjdE5hbWUsIHNwYWNlSWQsIHJlY29yZElkKSlcblxuXHQjIOi/h+a7pOaOiXZhbHVlc+S4reeahOmdnuazlWtleVxuXHRmaWx0ZXJWYWx1ZXMgPSB7fVxuXHRfLmVhY2ggXy5rZXlzKHZhbHVlcyksIChrKSAtPlxuXHRcdGlmIGZpZWxkQ29kZXMuaW5jbHVkZXMoaylcblx0XHRcdGZpbHRlclZhbHVlc1trXSA9IHZhbHVlc1trXVxuXG5cdHJldHVybiBmaWx0ZXJWYWx1ZXNcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5ldmFsRmllbGRNYXBTY3JpcHQgPSAoZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgb2JqZWN0SWQpIC0+XG5cdCMgcmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLmZpbmRPbmUob2JqZWN0SWQpXG5cdHJlY29yZCA9IG9iamVjdEZpbmRPbmUob2JqZWN0TmFtZSwgeyBmaWx0ZXJzOiBbWydfaWQnLCAnPScsIG9iamVjdElkXV0gfSlcblx0c2NyaXB0ID0gXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZWNvcmQpIHsgXCIgKyBmaWVsZF9tYXBfc2NyaXB0ICsgXCIgfVwiXG5cdGZ1bmMgPSBfZXZhbChzY3JpcHQsIFwiZmllbGRfbWFwX3NjcmlwdFwiKVxuXHR2YWx1ZXMgPSBmdW5jKHJlY29yZClcblx0aWYgXy5pc09iamVjdCB2YWx1ZXNcblx0XHRyZXR1cm4gdmFsdWVzXG5cdGVsc2Vcblx0XHRjb25zb2xlLmVycm9yIFwiZXZhbEZpZWxkTWFwU2NyaXB0OiDohJrmnKzov5Tlm57lgLznsbvlnovkuI3mmK/lr7nosaFcIlxuXHRyZXR1cm4ge31cblxuXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2ggPSAocmVjb3JkSWRzLCBzcGFjZUlkLCBpbnNJZCwgYXBwcm92ZUlkKSAtPlxuXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbJ2Ntc19maWxlcyddLmZpbmQoe1xuXHRcdHNwYWNlOiBzcGFjZUlkLFxuXHRcdHBhcmVudDogcmVjb3JkSWRzXG5cdH0pLmZvckVhY2ggKGNmKSAtPlxuXHRcdF8uZWFjaCBjZi52ZXJzaW9ucywgKHZlcnNpb25JZCwgaWR4KSAtPlxuXHRcdFx0ZiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ10uZmluZE9uZSh2ZXJzaW9uSWQpXG5cdFx0XHRuZXdGaWxlID0gbmV3IEZTLkZpbGUoKVxuXG5cdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEgZi5jcmVhdGVSZWFkU3RyZWFtKCdmaWxlcycpLCB7XG5cdFx0XHRcdFx0dHlwZTogZi5vcmlnaW5hbC50eXBlXG5cdFx0XHR9LCAoZXJyKSAtPlxuXHRcdFx0XHRpZiAoZXJyKVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyLmVycm9yLCBlcnIucmVhc29uKVxuXG5cdFx0XHRcdG5ld0ZpbGUubmFtZShmLm5hbWUoKSlcblx0XHRcdFx0bmV3RmlsZS5zaXplKGYuc2l6ZSgpKVxuXHRcdFx0XHRtZXRhZGF0YSA9IHtcblx0XHRcdFx0XHRvd25lcjogZi5tZXRhZGF0YS5vd25lcixcblx0XHRcdFx0XHRvd25lcl9uYW1lOiBmLm1ldGFkYXRhLm93bmVyX25hbWUsXG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXG5cdFx0XHRcdFx0aW5zdGFuY2U6IGluc0lkLFxuXHRcdFx0XHRcdGFwcHJvdmU6IGFwcHJvdmVJZFxuXHRcdFx0XHRcdHBhcmVudDogY2YuX2lkXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiBpZHggaXMgMFxuXHRcdFx0XHRcdG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlXG5cblx0XHRcdFx0bmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhXG5cdFx0XHRcdGNmcy5pbnN0YW5jZXMuaW5zZXJ0KG5ld0ZpbGUpXG5cblx0cmV0dXJuXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8gPSAocmVjb3JkSWRzLCBpbnNJZCwgc3BhY2VJZCkgLT5cblx0IyBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLnVwZGF0ZShyZWNvcmRJZHMuaWRzWzBdLCB7XG5cdCMgXHQkcHVzaDoge1xuXHQjIFx0XHRpbnN0YW5jZXM6IHtcblx0IyBcdFx0XHQkZWFjaDogW3tcblx0IyBcdFx0XHRcdF9pZDogaW5zSWQsXG5cdCMgXHRcdFx0XHRzdGF0ZTogJ2RyYWZ0J1xuXHQjIFx0XHRcdH1dLFxuXHQjIFx0XHRcdCRwb3NpdGlvbjogMFxuXHQjIFx0XHR9XG5cdCMgXHR9LFxuXHQjIFx0JHNldDoge1xuXHQjIFx0XHRsb2NrZWQ6IHRydWVcblx0IyBcdFx0aW5zdGFuY2Vfc3RhdGU6ICdkcmFmdCdcblx0IyBcdH1cblx0IyB9KVxuXHRvYmplY3RVcGRhdGUocmVjb3JkSWRzLm8sIHJlY29yZElkcy5pZHNbMF0sIHtcblx0XHRpbnN0YW5jZXM6IFt7XG5cdFx0XHRfaWQ6IGluc0lkLFxuXHRcdFx0c3RhdGU6ICdkcmFmdCdcblx0XHR9XSxcblx0XHRsb2NrZWQ6IHRydWUsXG5cdFx0aW5zdGFuY2Vfc3RhdGU6ICdkcmFmdCdcblx0fSlcblxuXHRyZXR1cm5cblxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyA9IChyZWxhdGVkVGFibGVzSW5mbywgaW5zSWQsIHNwYWNlSWQpIC0+XG5cdF8uZWFjaCByZWxhdGVkVGFibGVzSW5mbywgKHRhYmxlSXRlbXMsIHJlbGF0ZWRPYmplY3ROYW1lKSAtPlxuXHRcdHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKVxuXHRcdF8uZWFjaCB0YWJsZUl0ZW1zLCAoaXRlbSkgLT5cblx0XHRcdHJlbGF0ZWRDb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoaXRlbS5fdGFibGUuX2lkLCB7XG5cdFx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0XHRpbnN0YW5jZXM6IFt7XG5cdFx0XHRcdFx0XHRfaWQ6IGluc0lkLFxuXHRcdFx0XHRcdFx0c3RhdGU6ICdkcmFmdCdcblx0XHRcdFx0XHR9XSxcblx0XHRcdFx0XHRfdGFibGU6IGl0ZW0uX3RhYmxlXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cblx0cmV0dXJuXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tJc0luQXBwcm92YWwgPSAocmVjb3JkSWRzLCBzcGFjZUlkKSAtPlxuXHQjIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkuZmluZE9uZSh7XG5cdCMgXHRfaWQ6IHJlY29yZElkcy5pZHNbMF0sIGluc3RhbmNlczogeyAkZXhpc3RzOiB0cnVlIH1cblx0IyB9LCB7IGZpZWxkczogeyBpbnN0YW5jZXM6IDEgfSB9KVxuXHRyZWNvcmQgPSBvYmplY3RGaW5kT25lKHJlY29yZElkcy5vLCB7IGZpbHRlcnM6IFtbJ19pZCcsICc9JywgcmVjb3JkSWRzLmlkc1swXV1dLCBmaWVsZHM6IFsnaW5zdGFuY2VzJ10gfSlcblxuXHRpZiByZWNvcmQgYW5kIHJlY29yZC5pbnN0YW5jZXMgYW5kIHJlY29yZC5pbnN0YW5jZXNbMF0uc3RhdGUgaXNudCAnY29tcGxldGVkJyBhbmQgQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZChyZWNvcmQuaW5zdGFuY2VzWzBdLl9pZCkuY291bnQoKSA+IDBcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuatpOiusOW9leW3suWPkei1t+a1geeoi+ato+WcqOWuoeaJueS4re+8jOW+heWuoeaJuee7k+adn+aWueWPr+WPkei1t+S4i+S4gOasoeWuoeaJue+8gVwiKVxuXG5cdHJldHVyblxuXG4iLCJ2YXIgX2V2YWwsIGdldE9iamVjdENvbmZpZywgZ2V0T2JqZWN0TmFtZUZpZWxkS2V5LCBnZXRSZWxhdGVkcywgb2JqZWN0RmluZCwgb2JqZWN0RmluZE9uZSwgb2JqZWN0VXBkYXRlLCBvYmplY3RxbDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuX2V2YWwgPSByZXF1aXJlKCdldmFsJyk7XG5cbm9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcblxuZ2V0T2JqZWN0Q29uZmlnID0gZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSkge1xuICByZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLnRvQ29uZmlnKCk7XG59O1xuXG5nZXRPYmplY3ROYW1lRmllbGRLZXkgPSBmdW5jdGlvbihvYmplY3RBcGlOYW1lKSB7XG4gIHJldHVybiBvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkuTkFNRV9GSUVMRF9LRVk7XG59O1xuXG5nZXRSZWxhdGVkcyA9IGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUpIHtcbiAgcmV0dXJuIE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24ob2JqZWN0QXBpTmFtZSwgY2IpIHtcbiAgICByZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLmdldFJlbGF0ZWRzKCkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgIH0pO1xuICB9KShvYmplY3RBcGlOYW1lKTtcbn07XG5cbm9iamVjdEZpbmRPbmUgPSBmdW5jdGlvbihvYmplY3RBcGlOYW1lLCBxdWVyeSkge1xuICByZXR1cm4gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihvYmplY3RBcGlOYW1lLCBxdWVyeSwgY2IpIHtcbiAgICByZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLmZpbmQocXVlcnkpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBpZiAocmVzb2x2ZSAmJiByZXNvbHZlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZVswXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY2IocmVqZWN0LCBudWxsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSkob2JqZWN0QXBpTmFtZSwgcXVlcnkpO1xufTtcblxub2JqZWN0RmluZCA9IGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUsIHF1ZXJ5KSB7XG4gIHJldHVybiBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKG9iamVjdEFwaU5hbWUsIHF1ZXJ5LCBjYikge1xuICAgIHJldHVybiBvYmplY3RxbC5nZXRPYmplY3Qob2JqZWN0QXBpTmFtZSkuZmluZChxdWVyeSkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgIH0pO1xuICB9KShvYmplY3RBcGlOYW1lLCBxdWVyeSk7XG59O1xuXG5vYmplY3RVcGRhdGUgPSBmdW5jdGlvbihvYmplY3RBcGlOYW1lLCBpZCwgZGF0YSkge1xuICByZXR1cm4gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihvYmplY3RBcGlOYW1lLCBpZCwgZGF0YSwgY2IpIHtcbiAgICByZXR1cm4gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iamVjdEFwaU5hbWUpLnVwZGF0ZShpZCwgZGF0YSkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgIH0pO1xuICB9KShvYmplY3RBcGlOYW1lLCBpZCwgZGF0YSk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge307XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbiA9IGZ1bmN0aW9uKHJlcSkge1xuICB2YXIgYXV0aFRva2VuLCBoYXNoZWRUb2tlbiwgcXVlcnksIHVzZXIsIHVzZXJJZDtcbiAgcXVlcnkgPSByZXEucXVlcnk7XG4gIHVzZXJJZCA9IHF1ZXJ5W1wiWC1Vc2VyLUlkXCJdO1xuICBhdXRoVG9rZW4gPSBxdWVyeVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICBfaWQ6IHVzZXJJZCxcbiAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICB9KTtcbiAgaWYgKCF1c2VyKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICByZXR1cm4gdXNlcjtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2UgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICB2YXIgc3BhY2U7XG4gIHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gIGlmICghc3BhY2UpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInNwYWNlX2lk5pyJ6K+v5oiW5q2kc3BhY2Xlt7Lnu4/ooqvliKDpmaRcIik7XG4gIH1cbiAgcmV0dXJuIHNwYWNlO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93ID0gZnVuY3Rpb24oZmxvd19pZCkge1xuICB2YXIgZmxvdztcbiAgZmxvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZmxvd3MuZmluZE9uZShmbG93X2lkKTtcbiAgaWYgKCFmbG93KSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJpZOacieivr+aIluatpOa1geeoi+W3sue7j+iiq+WIoOmZpFwiKTtcbiAgfVxuICByZXR1cm4gZmxvdztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyID0gZnVuY3Rpb24oc3BhY2VfaWQsIHVzZXJfaWQpIHtcbiAgdmFyIHNwYWNlX3VzZXI7XG4gIHNwYWNlX3VzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB1c2VyOiB1c2VyX2lkXG4gIH0pO1xuICBpZiAoIXNwYWNlX3VzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInVzZXJfaWTlr7nlupTnmoTnlKjmiLfkuI3lsZ7kuo7lvZPliY1zcGFjZVwiKTtcbiAgfVxuICByZXR1cm4gc3BhY2VfdXNlcjtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyA9IGZ1bmN0aW9uKHNwYWNlX3VzZXIpIHtcbiAgdmFyIGluZm8sIG9yZztcbiAgaW5mbyA9IG5ldyBPYmplY3Q7XG4gIGluZm8ub3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb247XG4gIG9yZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub3JnYW5pemF0aW9ucy5maW5kT25lKHNwYWNlX3VzZXIub3JnYW5pemF0aW9uLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBuYW1lOiAxLFxuICAgICAgZnVsbG5hbWU6IDFcbiAgICB9XG4gIH0pO1xuICBpbmZvLm9yZ2FuaXphdGlvbl9uYW1lID0gb3JnLm5hbWU7XG4gIGluZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gb3JnLmZ1bGxuYW1lO1xuICByZXR1cm4gaW5mbztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZCA9IGZ1bmN0aW9uKGZsb3cpIHtcbiAgaWYgKGZsb3cuc3RhdGUgIT09IFwiZW5hYmxlZFwiKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvmnKrlkK/nlKgs5pON5L2c5aSx6LSlXCIpO1xuICB9XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZCA9IGZ1bmN0aW9uKGZsb3csIHNwYWNlX2lkKSB7XG4gIGlmIChmbG93LnNwYWNlICE9PSBzcGFjZV9pZCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5ZKM5bel5L2c5Yy6SUTkuI3ljLnphY1cIik7XG4gIH1cbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybSA9IGZ1bmN0aW9uKGZvcm1faWQpIHtcbiAgdmFyIGZvcm07XG4gIGZvcm0gPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZvcm1zLmZpbmRPbmUoZm9ybV9pZCk7XG4gIGlmICghZm9ybSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsICfooajljZVJROacieivr+aIluatpOihqOWNleW3sue7j+iiq+WIoOmZpCcpO1xuICB9XG4gIHJldHVybiBmb3JtO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeSA9IGZ1bmN0aW9uKGNhdGVnb3J5X2lkKSB7XG4gIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLmNhdGVnb3JpZXMuZmluZE9uZShjYXRlZ29yeV9pZCk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrU3luY0RpcmVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmbG93X2lkKSB7XG4gIHZhciBvdywgc3luY0RpcmVjdGlvbjtcbiAgb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIGZsb3dfaWQ6IGZsb3dfaWRcbiAgfSk7XG4gIGlmICghb3cpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn5pyq5om+5Yiw5a+56LGh5rWB56iL5pig5bCE6K6w5b2V44CCJyk7XG4gIH1cbiAgc3luY0RpcmVjdGlvbiA9IG93LnN5bmNfZGlyZWN0aW9uIHx8ICdib3RoJztcbiAgaWYgKCFbJ2JvdGgnLCAnb2JqX3RvX2lucyddLmluY2x1ZGVzKHN5bmNEaXJlY3Rpb24pKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+S4jeaUr+aMgeeahOWQjOatpeaWueWQkeOAgicpO1xuICB9XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNyZWF0ZV9pbnN0YW5jZSA9IGZ1bmN0aW9uKGluc3RhbmNlX2Zyb21fY2xpZW50LCB1c2VyX2luZm8pIHtcbiAgdmFyIGFwcHJfb2JqLCBhcHByb3ZlX2Zyb21fY2xpZW50LCBjYXRlZ29yeSwgZmxvdywgZmxvd19pZCwgZm9ybSwgaW5zX29iaiwgbmV3X2luc19pZCwgbm93LCBwZXJtaXNzaW9ucywgcmVsYXRlZFRhYmxlc0luZm8sIHNwYWNlLCBzcGFjZV9pZCwgc3BhY2VfdXNlciwgc3BhY2VfdXNlcl9vcmdfaW5mbywgc3RhcnRfc3RlcCwgdHJhY2VfZnJvbV9jbGllbnQsIHRyYWNlX29iaiwgdXNlcl9pZDtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0sIFN0cmluZyk7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0sIFN0cmluZyk7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXSwgU3RyaW5nKTtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdLCBbXG4gICAge1xuICAgICAgbzogU3RyaW5nLFxuICAgICAgaWRzOiBbU3RyaW5nXVxuICAgIH1cbiAgXSk7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tTeW5jRGlyZWN0aW9uKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVswXS5vLCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl0pO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVswXSwgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSk7XG4gIHNwYWNlX2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXTtcbiAgZmxvd19pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXTtcbiAgdXNlcl9pZCA9IHVzZXJfaW5mby5faWQ7XG4gIHRyYWNlX2Zyb21fY2xpZW50ID0gbnVsbDtcbiAgYXBwcm92ZV9mcm9tX2NsaWVudCA9IG51bGw7XG4gIGlmIChpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXSAmJiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXSkge1xuICAgIHRyYWNlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF07XG4gICAgaWYgKHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl0gJiYgdHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXVswXSkge1xuICAgICAgYXBwcm92ZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdW1wiYXBwcm92ZXNcIl1bMF07XG4gICAgfVxuICB9XG4gIHNwYWNlID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZShzcGFjZV9pZCk7XG4gIGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZCk7XG4gIHNwYWNlX3VzZXIgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlcihzcGFjZV9pZCwgdXNlcl9pZCk7XG4gIHNwYWNlX3VzZXJfb3JnX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8oc3BhY2VfdXNlcik7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZChmbG93KTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQoZmxvdywgc3BhY2VfaWQpO1xuICBmb3JtID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtKGZsb3cuZm9ybSk7XG4gIHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dfaWQsIHVzZXJfaWQpO1xuICBpZiAoIXBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRkXCIpKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLlvZPliY3nlKjmiLfmsqHmnInmraTmtYHnqIvnmoTmlrDlu7rmnYPpmZBcIik7XG4gIH1cbiAgbm93ID0gbmV3IERhdGU7XG4gIGluc19vYmogPSB7fTtcbiAgaW5zX29iai5faWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5fbWFrZU5ld0lEKCk7XG4gIGluc19vYmouc3BhY2UgPSBzcGFjZV9pZDtcbiAgaW5zX29iai5mbG93ID0gZmxvd19pZDtcbiAgaW5zX29iai5mbG93X3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuX2lkO1xuICBpbnNfb2JqLmZvcm0gPSBmbG93LmZvcm07XG4gIGluc19vYmouZm9ybV92ZXJzaW9uID0gZmxvdy5jdXJyZW50LmZvcm1fdmVyc2lvbjtcbiAgaW5zX29iai5uYW1lID0gZmxvdy5uYW1lO1xuICBpbnNfb2JqLnN1Ym1pdHRlciA9IHVzZXJfaWQ7XG4gIGluc19vYmouc3VibWl0dGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIDogdXNlcl9pZDtcbiAgaW5zX29iai5hcHBsaWNhbnRfbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIDogdXNlcl9pbmZvLm5hbWU7XG4gIGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbiA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSA6IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uO1xuICBpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gOiBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9uYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gOiBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnRfY29tcGFueSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdIDogc3BhY2VfdXNlci5jb21wYW55X2lkO1xuICBpbnNfb2JqLnN0YXRlID0gJ2RyYWZ0JztcbiAgaW5zX29iai5jb2RlID0gJyc7XG4gIGluc19vYmouaXNfYXJjaGl2ZWQgPSBmYWxzZTtcbiAgaW5zX29iai5pc19kZWxldGVkID0gZmFsc2U7XG4gIGluc19vYmouY3JlYXRlZCA9IG5vdztcbiAgaW5zX29iai5jcmVhdGVkX2J5ID0gdXNlcl9pZDtcbiAgaW5zX29iai5tb2RpZmllZCA9IG5vdztcbiAgaW5zX29iai5tb2RpZmllZF9ieSA9IHVzZXJfaWQ7XG4gIGluc19vYmoucmVjb3JkX2lkcyA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXTtcbiAgaWYgKHNwYWNlX3VzZXIuY29tcGFueV9pZCkge1xuICAgIGluc19vYmouY29tcGFueV9pZCA9IHNwYWNlX3VzZXIuY29tcGFueV9pZDtcbiAgfVxuICB0cmFjZV9vYmogPSB7fTtcbiAgdHJhY2Vfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHI7XG4gIHRyYWNlX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkO1xuICB0cmFjZV9vYmouaXNfZmluaXNoZWQgPSBmYWxzZTtcbiAgc3RhcnRfc3RlcCA9IF8uZmluZChmbG93LmN1cnJlbnQuc3RlcHMsIGZ1bmN0aW9uKHN0ZXApIHtcbiAgICByZXR1cm4gc3RlcC5zdGVwX3R5cGUgPT09ICdzdGFydCc7XG4gIH0pO1xuICB0cmFjZV9vYmouc3RlcCA9IHN0YXJ0X3N0ZXAuX2lkO1xuICB0cmFjZV9vYmoubmFtZSA9IHN0YXJ0X3N0ZXAubmFtZTtcbiAgdHJhY2Vfb2JqLnN0YXJ0X2RhdGUgPSBub3c7XG4gIGFwcHJfb2JqID0ge307XG4gIGFwcHJfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHI7XG4gIGFwcHJfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWQ7XG4gIGFwcHJfb2JqLnRyYWNlID0gdHJhY2Vfb2JqLl9pZDtcbiAgYXBwcl9vYmouaXNfZmluaXNoZWQgPSBmYWxzZTtcbiAgYXBwcl9vYmoudXNlciA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gOiB1c2VyX2lkO1xuICBhcHByX29iai51c2VyX25hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA6IHVzZXJfaW5mby5uYW1lO1xuICBhcHByX29iai5oYW5kbGVyID0gdXNlcl9pZDtcbiAgYXBwcl9vYmouaGFuZGxlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWU7XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb247XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX25hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLm5hbWU7XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5mdWxsbmFtZTtcbiAgYXBwcl9vYmoudHlwZSA9ICdkcmFmdCc7XG4gIGFwcHJfb2JqLnN0YXJ0X2RhdGUgPSBub3c7XG4gIGFwcHJfb2JqLnJlYWRfZGF0ZSA9IG5vdztcbiAgYXBwcl9vYmouaXNfcmVhZCA9IHRydWU7XG4gIGFwcHJfb2JqLmlzX2Vycm9yID0gZmFsc2U7XG4gIGFwcHJfb2JqLmRlc2NyaXB0aW9uID0gJyc7XG4gIHJlbGF0ZWRUYWJsZXNJbmZvID0ge307XG4gIGFwcHJfb2JqLnZhbHVlcyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMoaW5zX29iai5yZWNvcmRfaWRzWzBdLCBmbG93X2lkLCBzcGFjZV9pZCwgZm9ybS5jdXJyZW50LmZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pO1xuICB0cmFjZV9vYmouYXBwcm92ZXMgPSBbYXBwcl9vYmpdO1xuICBpbnNfb2JqLnRyYWNlcyA9IFt0cmFjZV9vYmpdO1xuICBpbnNfb2JqLnZhbHVlcyA9IGFwcHJfb2JqLnZhbHVlcztcbiAgaW5zX29iai5pbmJveF91c2VycyA9IGluc3RhbmNlX2Zyb21fY2xpZW50LmluYm94X3VzZXJzIHx8IFtdO1xuICBpbnNfb2JqLmN1cnJlbnRfc3RlcF9uYW1lID0gc3RhcnRfc3RlcC5uYW1lO1xuICBpZiAoZmxvdy5hdXRvX3JlbWluZCA9PT0gdHJ1ZSkge1xuICAgIGluc19vYmouYXV0b19yZW1pbmQgPSB0cnVlO1xuICB9XG4gIGluc19vYmouZmxvd19uYW1lID0gZmxvdy5uYW1lO1xuICBpZiAoZm9ybS5jYXRlZ29yeSkge1xuICAgIGNhdGVnb3J5ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeShmb3JtLmNhdGVnb3J5KTtcbiAgICBpZiAoY2F0ZWdvcnkpIHtcbiAgICAgIGluc19vYmouY2F0ZWdvcnlfbmFtZSA9IGNhdGVnb3J5Lm5hbWU7XG4gICAgICBpbnNfb2JqLmNhdGVnb3J5ID0gY2F0ZWdvcnkuX2lkO1xuICAgIH1cbiAgfVxuICBuZXdfaW5zX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuaW5zZXJ0KGluc19vYmopO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvKGluc19vYmoucmVjb3JkX2lkc1swXSwgbmV3X2luc19pZCwgc3BhY2VfaWQpO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoKGluc19vYmoucmVjb3JkX2lkc1swXSwgc3BhY2VfaWQsIGluc19vYmouX2lkLCBhcHByX29iai5faWQpO1xuICByZXR1cm4gbmV3X2luc19pZDtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMgPSBmdW5jdGlvbihyZWNvcmRJZHMsIGZsb3dJZCwgc3BhY2VJZCwgZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbykge1xuICB2YXIgZmllbGRDb2RlcywgZmlsdGVyVmFsdWVzLCBmbG93LCBmb3JtLCBmb3JtRmllbGRzLCBmb3JtVGFibGVGaWVsZHMsIGZvcm1UYWJsZUZpZWxkc0NvZGUsIGdldEZpZWxkT2RhdGFWYWx1ZSwgZ2V0Rm9ybUZpZWxkLCBnZXRGb3JtVGFibGVGaWVsZCwgZ2V0Rm9ybVRhYmxlRmllbGRDb2RlLCBnZXRGb3JtVGFibGVTdWJGaWVsZCwgZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSwgZ2V0U2VsZWN0T3JnVmFsdWUsIGdldFNlbGVjdE9yZ1ZhbHVlcywgZ2V0U2VsZWN0VXNlclZhbHVlLCBnZXRTZWxlY3RVc2VyVmFsdWVzLCBvYmplY3QsIG9iamVjdE5hbWUsIG93LCByZWNvcmQsIHJlY29yZElkLCByZWYsIHJlbGF0ZWRPYmplY3RzLCByZWxhdGVkT2JqZWN0c0tleXMsIHRhYmxlRmllbGRDb2RlcywgdGFibGVGaWVsZE1hcCwgdGFibGVUb1JlbGF0ZWRNYXAsIHZhbHVlcztcbiAgZmllbGRDb2RlcyA9IFtdO1xuICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgaWYgKGYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKGYuZmllbGRzLCBmdW5jdGlvbihmZikge1xuICAgICAgICByZXR1cm4gZmllbGRDb2Rlcy5wdXNoKGZmLmNvZGUpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaWVsZENvZGVzLnB1c2goZi5jb2RlKTtcbiAgICB9XG4gIH0pO1xuICB2YWx1ZXMgPSB7fTtcbiAgb2JqZWN0TmFtZSA9IHJlY29yZElkcy5vO1xuICBvYmplY3QgPSBnZXRPYmplY3RDb25maWcob2JqZWN0TmFtZSk7XG4gIHJlY29yZElkID0gcmVjb3JkSWRzLmlkc1swXTtcbiAgb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXG4gICAgZmxvd19pZDogZmxvd0lkXG4gIH0pO1xuICByZWNvcmQgPSBvYmplY3RGaW5kT25lKG9iamVjdE5hbWUsIHtcbiAgICBmaWx0ZXJzOiBbWydfaWQnLCAnPScsIHJlY29yZElkXV1cbiAgfSk7XG4gIGZsb3cgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShmbG93SWQsIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGZvcm06IDFcbiAgICB9XG4gIH0pO1xuICBpZiAob3cgJiYgcmVjb3JkKSB7XG4gICAgZm9ybSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImZvcm1zXCIpLmZpbmRPbmUoZmxvdy5mb3JtKTtcbiAgICBmb3JtRmllbGRzID0gZm9ybS5jdXJyZW50LmZpZWxkcyB8fCBbXTtcbiAgICByZWxhdGVkT2JqZWN0cyA9IGdldFJlbGF0ZWRzKG9iamVjdE5hbWUpO1xuICAgIHJlbGF0ZWRPYmplY3RzS2V5cyA9IF8ucGx1Y2socmVsYXRlZE9iamVjdHMsICdvYmplY3RfbmFtZScpO1xuICAgIGZvcm1UYWJsZUZpZWxkcyA9IF8uZmlsdGVyKGZvcm1GaWVsZHMsIGZ1bmN0aW9uKGZvcm1GaWVsZCkge1xuICAgICAgcmV0dXJuIGZvcm1GaWVsZC50eXBlID09PSAndGFibGUnO1xuICAgIH0pO1xuICAgIGZvcm1UYWJsZUZpZWxkc0NvZGUgPSBfLnBsdWNrKGZvcm1UYWJsZUZpZWxkcywgJ2NvZGUnKTtcbiAgICBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKHJlbGF0ZWRPYmplY3RzS2V5cywgZnVuY3Rpb24ocmVsYXRlZE9iamVjdHNLZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleS5zdGFydHNXaXRoKHJlbGF0ZWRPYmplY3RzS2V5ICsgJy4nKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlRmllbGRDb2RlID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKGZvcm1UYWJsZUZpZWxkc0NvZGUsIGZ1bmN0aW9uKGZvcm1UYWJsZUZpZWxkQ29kZSkge1xuICAgICAgICByZXR1cm4ga2V5LnN0YXJ0c1dpdGgoZm9ybVRhYmxlRmllbGRDb2RlICsgJy4nKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlRmllbGQgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBfLmZpbmQoZm9ybVRhYmxlRmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgIHJldHVybiBmLmNvZGUgPT09IGtleTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybUZpZWxkID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgZmY7XG4gICAgICBmZiA9IG51bGw7XG4gICAgICBfLmZvckVhY2goZm9ybUZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgICAgICBpZiAoZmYpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIGZmID0gXy5maW5kKGYuZmllbGRzLCBmdW5jdGlvbihzZikge1xuICAgICAgICAgICAgcmV0dXJuIHNmLmNvZGUgPT09IGtleTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChmLmNvZGUgPT09IGtleSkge1xuICAgICAgICAgIHJldHVybiBmZiA9IGY7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZmO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlU3ViRmllbGQgPSBmdW5jdGlvbih0YWJsZUZpZWxkLCBzdWJGaWVsZENvZGUpIHtcbiAgICAgIHJldHVybiBfLmZpbmQodGFibGVGaWVsZC5maWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgcmV0dXJuIGYuY29kZSA9PT0gc3ViRmllbGRDb2RlO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRGaWVsZE9kYXRhVmFsdWUgPSBmdW5jdGlvbihvYmpOYW1lLCBpZCwgcmVmZXJlbmNlVG9GaWVsZE5hbWUpIHtcbiAgICAgIHZhciBfcmVjb3JkLCBfcmVjb3JkcywgbmFtZUtleSwgb2JqO1xuICAgICAgb2JqID0gb2JqZWN0cWwuZ2V0T2JqZWN0KG9iak5hbWUpO1xuICAgICAgbmFtZUtleSA9IGdldE9iamVjdE5hbWVGaWVsZEtleShvYmpOYW1lKTtcbiAgICAgIGlmICghb2JqKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChfLmlzU3RyaW5nKGlkKSkge1xuICAgICAgICBfcmVjb3JkID0gb2JqZWN0RmluZE9uZShvYmpOYW1lLCB7XG4gICAgICAgICAgZmlsdGVyczogW1tyZWZlcmVuY2VUb0ZpZWxkTmFtZSwgJz0nLCBpZF1dXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoX3JlY29yZCkge1xuICAgICAgICAgIF9yZWNvcmRbJ0BsYWJlbCddID0gX3JlY29yZFtuYW1lS2V5XTtcbiAgICAgICAgICByZXR1cm4gX3JlY29yZDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChfLmlzQXJyYXkoaWQpKSB7XG4gICAgICAgIF9yZWNvcmRzID0gW107XG4gICAgICAgIG9iamVjdEZpbmQob2JqTmFtZSwge1xuICAgICAgICAgIGZpbHRlcnM6IFtbcmVmZXJlbmNlVG9GaWVsZE5hbWUsICdpbicsIGlkXV1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihfcmVjb3JkKSB7XG4gICAgICAgICAgX3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkW25hbWVLZXldO1xuICAgICAgICAgIHJldHVybiBfcmVjb3Jkcy5wdXNoKF9yZWNvcmQpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFfLmlzRW1wdHkoX3JlY29yZHMpKSB7XG4gICAgICAgICAgcmV0dXJuIF9yZWNvcmRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBnZXRTZWxlY3RVc2VyVmFsdWUgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgICAgIHZhciBzdTtcbiAgICAgIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9KTtcbiAgICAgIHN1LmlkID0gdXNlcklkO1xuICAgICAgcmV0dXJuIHN1O1xuICAgIH07XG4gICAgZ2V0U2VsZWN0VXNlclZhbHVlcyA9IGZ1bmN0aW9uKHVzZXJJZHMsIHNwYWNlSWQpIHtcbiAgICAgIHZhciBzdXM7XG4gICAgICBzdXMgPSBbXTtcbiAgICAgIGlmIChfLmlzQXJyYXkodXNlcklkcykpIHtcbiAgICAgICAgXy5lYWNoKHVzZXJJZHMsIGZ1bmN0aW9uKHVzZXJJZCkge1xuICAgICAgICAgIHZhciBzdTtcbiAgICAgICAgICBzdSA9IGdldFNlbGVjdFVzZXJWYWx1ZSh1c2VySWQsIHNwYWNlSWQpO1xuICAgICAgICAgIGlmIChzdSkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cy5wdXNoKHN1KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN1cztcbiAgICB9O1xuICAgIGdldFNlbGVjdE9yZ1ZhbHVlID0gZnVuY3Rpb24ob3JnSWQsIHNwYWNlSWQpIHtcbiAgICAgIHZhciBvcmc7XG4gICAgICBvcmcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kT25lKG9yZ0lkLCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgIGZ1bGxuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgb3JnLmlkID0gb3JnSWQ7XG4gICAgICByZXR1cm4gb3JnO1xuICAgIH07XG4gICAgZ2V0U2VsZWN0T3JnVmFsdWVzID0gZnVuY3Rpb24ob3JnSWRzLCBzcGFjZUlkKSB7XG4gICAgICB2YXIgb3JncztcbiAgICAgIG9yZ3MgPSBbXTtcbiAgICAgIGlmIChfLmlzQXJyYXkob3JnSWRzKSkge1xuICAgICAgICBfLmVhY2gob3JnSWRzLCBmdW5jdGlvbihvcmdJZCkge1xuICAgICAgICAgIHZhciBvcmc7XG4gICAgICAgICAgb3JnID0gZ2V0U2VsZWN0T3JnVmFsdWUob3JnSWQsIHNwYWNlSWQpO1xuICAgICAgICAgIGlmIChvcmcpIHtcbiAgICAgICAgICAgIHJldHVybiBvcmdzLnB1c2gob3JnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9yZ3M7XG4gICAgfTtcbiAgICB0YWJsZUZpZWxkQ29kZXMgPSBbXTtcbiAgICB0YWJsZUZpZWxkTWFwID0gW107XG4gICAgdGFibGVUb1JlbGF0ZWRNYXAgPSB7fTtcbiAgICBpZiAoKHJlZiA9IG93LmZpZWxkX21hcCkgIT0gbnVsbCkge1xuICAgICAgcmVmLmZvckVhY2goZnVuY3Rpb24oZm0pIHtcbiAgICAgICAgdmFyIGZvcm1GaWVsZCwgZm9ybVRhYmxlRmllbGRDb2RlLCBncmlkQ29kZSwgbG9va3VwRmllbGROYW1lLCBsb29rdXBGaWVsZE9iaiwgbG9va3VwT2JqZWN0UmVjb3JkLCBsb29rdXBTZWxlY3RGaWVsZFZhbHVlLCBvVGFibGVDb2RlLCBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQsIG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZENvZGUsIG9UYWJsZUZpZWxkQ29kZSwgb2JqRmllbGQsIG9iamVjdEZpZWxkLCBvYmplY3RGaWVsZE5hbWUsIG9iamVjdEZpZWxkT2JqZWN0TmFtZSwgb2JqZWN0TG9va3VwRmllbGQsIG9iamVjdF9maWVsZCwgb2RhdGFGaWVsZFZhbHVlLCByZWZlcmVuY2VUb0RvYywgcmVmZXJlbmNlVG9GaWVsZE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWxhdGVkT2JqZWN0RmllbGRDb2RlLCBzZWxlY3RGaWVsZFZhbHVlLCB0YWJsZVRvUmVsYXRlZE1hcEtleSwgd1RhYmxlQ29kZSwgd29ya2Zsb3dfZmllbGQ7XG4gICAgICAgIG9iamVjdF9maWVsZCA9IGZtLm9iamVjdF9maWVsZDtcbiAgICAgICAgd29ya2Zsb3dfZmllbGQgPSBmbS53b3JrZmxvd19maWVsZDtcbiAgICAgICAgaWYgKCFvYmplY3RfZmllbGQgfHwgIXdvcmtmbG93X2ZpZWxkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICfmnKrmib7liLDlrZfmrrXvvIzor7fmo4Dmn6Xlr7nosaHmtYHnqIvmmKDlsITlrZfmrrXphY3nva4nKTtcbiAgICAgICAgfVxuICAgICAgICByZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZShvYmplY3RfZmllbGQpO1xuICAgICAgICBmb3JtVGFibGVGaWVsZENvZGUgPSBnZXRGb3JtVGFibGVGaWVsZENvZGUod29ya2Zsb3dfZmllbGQpO1xuICAgICAgICBvYmpGaWVsZCA9IG9iamVjdC5maWVsZHNbb2JqZWN0X2ZpZWxkXTtcbiAgICAgICAgZm9ybUZpZWxkID0gZ2V0Rm9ybUZpZWxkKHdvcmtmbG93X2ZpZWxkKTtcbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZENvZGUpIHtcbiAgICAgICAgICBvVGFibGVDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgb1RhYmxlRmllbGRDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgdGFibGVUb1JlbGF0ZWRNYXBLZXkgPSBvVGFibGVDb2RlO1xuICAgICAgICAgIGlmICghdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldKSB7XG4gICAgICAgICAgICB0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0gPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZvcm1UYWJsZUZpZWxkQ29kZSkge1xuICAgICAgICAgICAgd1RhYmxlQ29kZSA9IHdvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgICB0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bJ19GUk9NX1RBQkxFX0NPREUnXSA9IHdUYWJsZUNvZGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bb1RhYmxlRmllbGRDb2RlXSA9IHdvcmtmbG93X2ZpZWxkO1xuICAgICAgICB9IGVsc2UgaWYgKHdvcmtmbG93X2ZpZWxkLmluZGV4T2YoJy4nKSA+IDAgJiYgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID4gMCkge1xuICAgICAgICAgIHdUYWJsZUNvZGUgPSB3b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgIG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzBdO1xuICAgICAgICAgIGlmIChyZWNvcmQuaGFzT3duUHJvcGVydHkob1RhYmxlQ29kZSkgJiYgXy5pc0FycmF5KHJlY29yZFtvVGFibGVDb2RlXSkpIHtcbiAgICAgICAgICAgIHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgd29ya2Zsb3dfdGFibGVfZmllbGRfY29kZTogd1RhYmxlQ29kZSxcbiAgICAgICAgICAgICAgb2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHJldHVybiB0YWJsZUZpZWxkTWFwLnB1c2goZm0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAob1RhYmxlQ29kZS5pbmRleE9mKCcuJykgPiAwKSB7XG4gICAgICAgICAgICBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGRDb2RlID0gb1RhYmxlQ29kZS5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgICAgZ3JpZENvZGUgPSBvVGFibGVDb2RlLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQgPSBvYmplY3QuZmllbGRzW29UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZENvZGVdO1xuICAgICAgICAgICAgaWYgKG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZCAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob1RhYmxlQ29kZVJlZmVyZW5jZUZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgaWYgKHJlY29yZFtvVGFibGVDb2RlXSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkTmFtZSA9IG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQgfHwgJ19pZCc7XG4gICAgICAgICAgICAgIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9UYWJsZUNvZGVSZWZlcmVuY2VGaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvVGFibGVDb2RlUmVmZXJlbmNlRmllbGQubmFtZV07XG4gICAgICAgICAgICAgIHJlZmVyZW5jZVRvRG9jID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb0ZpZWxkTmFtZSk7XG4gICAgICAgICAgICAgIGlmIChyZWZlcmVuY2VUb0RvY1tncmlkQ29kZV0pIHtcbiAgICAgICAgICAgICAgICByZWNvcmRbb1RhYmxlQ29kZV0gPSByZWZlcmVuY2VUb0RvY1tncmlkQ29kZV07XG4gICAgICAgICAgICAgICAgdGFibGVGaWVsZENvZGVzLnB1c2goSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgd29ya2Zsb3dfdGFibGVfZmllbGRfY29kZTogd1RhYmxlQ29kZSxcbiAgICAgICAgICAgICAgICAgIG9iamVjdF90YWJsZV9maWVsZF9jb2RlOiBvVGFibGVDb2RlXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0YWJsZUZpZWxkTWFwLnB1c2goZm0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG9iamVjdF9maWVsZC5pbmRleE9mKCcuJykgPiAwICYmIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA9PT0gLTEpIHtcbiAgICAgICAgICBvYmplY3RGaWVsZE5hbWUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICBsb29rdXBGaWVsZE5hbWUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgICAgICBvYmplY3RGaWVsZCA9IG9iamVjdC5maWVsZHNbb2JqZWN0RmllbGROYW1lXTtcbiAgICAgICAgICAgIGlmIChvYmplY3RGaWVsZCAmJiBmb3JtRmllbGQgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iamVjdEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICBsb29rdXBPYmplY3RSZWNvcmQgPSBvYmplY3RGaW5kT25lKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bywge1xuICAgICAgICAgICAgICAgIGZpbHRlcnM6IFtbJ19pZCcsICc9JywgcmVjb3JkW29iamVjdEZpZWxkTmFtZV1dXSxcbiAgICAgICAgICAgICAgICBmaWVsZHM6IFtsb29rdXBGaWVsZE5hbWVdXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAoIWxvb2t1cE9iamVjdFJlY29yZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBvYmplY3RGaWVsZE9iamVjdE5hbWUgPSBvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICAgIGxvb2t1cEZpZWxkT2JqID0gZ2V0T2JqZWN0Q29uZmlnKG9iamVjdEZpZWxkT2JqZWN0TmFtZSk7XG4gICAgICAgICAgICAgIG9iamVjdExvb2t1cEZpZWxkID0gbG9va3VwRmllbGRPYmouZmllbGRzW2xvb2t1cEZpZWxkTmFtZV07XG4gICAgICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IGxvb2t1cE9iamVjdFJlY29yZFtsb29rdXBGaWVsZE5hbWVdO1xuICAgICAgICAgICAgICBpZiAob2JqZWN0TG9va3VwRmllbGQgJiYgZm9ybUZpZWxkICYmIGZvcm1GaWVsZC50eXBlID09PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RMb29rdXBGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkTmFtZSA9IG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90b19maWVsZCB8fCAnX2lkJztcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb09iamVjdE5hbWUgPSBvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgIG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9GaWVsZE5hbWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIW9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgIG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9GaWVsZE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChvYmplY3RMb29rdXBGaWVsZCAmJiBmb3JtRmllbGQgJiYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RMb29rdXBGaWVsZC50eXBlKSAmJiAoWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvKSB8fCAoJ3NwYWNlX3VzZXJzJyA9PT0gb2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvICYmICd1c2VyJyA9PT0gb2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkKSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIV8uaXNFbXB0eShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICBsb29rdXBTZWxlY3RGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICAgICAgaWYgKGZvcm1GaWVsZC50eXBlID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdExvb2t1cEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgIGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIW9iamVjdExvb2t1cEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICBsb29rdXBTZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdncm91cCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdExvb2t1cEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgIGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqZWN0TG9va3VwRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgIGxvb2t1cFNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAobG9va3VwU2VsZWN0RmllbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IGxvb2t1cFNlbGVjdEZpZWxkVmFsdWU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gbG9va3VwT2JqZWN0UmVjb3JkW2xvb2t1cEZpZWxkTmFtZV07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkICYmIG9iakZpZWxkICYmIGZvcm1GaWVsZC50eXBlID09PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iakZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkTmFtZSA9IG9iakZpZWxkLnJlZmVyZW5jZV90b19maWVsZCB8fCAnX2lkJztcbiAgICAgICAgICByZWZlcmVuY2VUb09iamVjdE5hbWUgPSBvYmpGaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdO1xuICAgICAgICAgIG9kYXRhRmllbGRWYWx1ZTtcbiAgICAgICAgICBpZiAob2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkICYmIG9iakZpZWxkICYmIFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKGZvcm1GaWVsZC50eXBlKSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgKFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKG9iakZpZWxkLnJlZmVyZW5jZV90bykgfHwgKCdzcGFjZV91c2VycycgPT09IG9iakZpZWxkLnJlZmVyZW5jZV90byAmJiAndXNlcicgPT09IG9iakZpZWxkLnJlZmVyZW5jZV90b19maWVsZCkpKSB7XG4gICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdO1xuICAgICAgICAgIGlmICghXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWU7XG4gICAgICAgICAgICBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICBpZiAob2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgICAgICBpZiAob2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxlY3RGaWVsZFZhbHVlKSB7XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gc2VsZWN0RmllbGRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLmhhc093blByb3BlcnR5KG9iamVjdF9maWVsZCkpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHJlY29yZFtvYmplY3RfZmllbGRdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgXy51bmlxKHRhYmxlRmllbGRDb2RlcykuZm9yRWFjaChmdW5jdGlvbih0ZmMpIHtcbiAgICAgIHZhciBjO1xuICAgICAgYyA9IEpTT04ucGFyc2UodGZjKTtcbiAgICAgIHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdID0gW107XG4gICAgICByZXR1cm4gcmVjb3JkW2Mub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGVdLmZvckVhY2goZnVuY3Rpb24odHIpIHtcbiAgICAgICAgdmFyIG5ld1RyO1xuICAgICAgICBuZXdUciA9IHt9O1xuICAgICAgICBfLmVhY2godHIsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgICByZXR1cm4gdGFibGVGaWVsZE1hcC5mb3JFYWNoKGZ1bmN0aW9uKHRmbSkge1xuICAgICAgICAgICAgdmFyIHdUZENvZGU7XG4gICAgICAgICAgICBpZiAodGZtLm9iamVjdF9maWVsZCA9PT0gKGMub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGUgKyAnLiQuJyArIGspKSB7XG4gICAgICAgICAgICAgIHdUZENvZGUgPSB0Zm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5ld1RyW3dUZENvZGVdID0gdjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghXy5pc0VtcHR5KG5ld1RyKSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXS5wdXNoKG5ld1RyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgXy5lYWNoKHRhYmxlVG9SZWxhdGVkTWFwLCBmdW5jdGlvbihtYXAsIGtleSkge1xuICAgICAgdmFyIGZvcm1UYWJsZUZpZWxkLCByZWxhdGVkQ29sbGVjdGlvbiwgcmVsYXRlZEZpZWxkLCByZWxhdGVkRmllbGROYW1lLCByZWxhdGVkT2JqZWN0LCByZWxhdGVkT2JqZWN0TmFtZSwgcmVsYXRlZFJlY29yZHMsIHJlbGF0ZWRUYWJsZUl0ZW1zLCBzZWxlY3RvciwgdGFibGVDb2RlLCB0YWJsZVZhbHVlcztcbiAgICAgIHRhYmxlQ29kZSA9IG1hcC5fRlJPTV9UQUJMRV9DT0RFO1xuICAgICAgZm9ybVRhYmxlRmllbGQgPSBnZXRGb3JtVGFibGVGaWVsZCh0YWJsZUNvZGUpO1xuICAgICAgaWYgKCF0YWJsZUNvZGUpIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUud2FybigndGFibGVUb1JlbGF0ZWQ6IFsnICsga2V5ICsgJ10gbWlzc2luZyBjb3JyZXNwb25kaW5nIHRhYmxlLicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVsYXRlZE9iamVjdE5hbWUgPSBrZXk7XG4gICAgICAgIHRhYmxlVmFsdWVzID0gW107XG4gICAgICAgIHJlbGF0ZWRUYWJsZUl0ZW1zID0gW107XG4gICAgICAgIHJlbGF0ZWRPYmplY3QgPSBnZXRPYmplY3RDb25maWcocmVsYXRlZE9iamVjdE5hbWUpO1xuICAgICAgICByZWxhdGVkRmllbGQgPSBfLmZpbmQocmVsYXRlZE9iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICByZXR1cm4gWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKGYudHlwZSkgJiYgZi5yZWZlcmVuY2VfdG8gPT09IG9iamVjdE5hbWU7XG4gICAgICAgIH0pO1xuICAgICAgICByZWxhdGVkRmllbGROYW1lID0gcmVsYXRlZEZpZWxkLm5hbWU7XG4gICAgICAgIHNlbGVjdG9yID0ge307XG4gICAgICAgIHNlbGVjdG9yW3JlbGF0ZWRGaWVsZE5hbWVdID0gcmVjb3JkSWQ7XG4gICAgICAgIHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKTtcbiAgICAgICAgcmVsYXRlZFJlY29yZHMgPSByZWxhdGVkQ29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKTtcbiAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChmdW5jdGlvbihycikge1xuICAgICAgICAgIHZhciB0YWJsZVZhbHVlSXRlbTtcbiAgICAgICAgICB0YWJsZVZhbHVlSXRlbSA9IHt9O1xuICAgICAgICAgIF8uZWFjaChtYXAsIGZ1bmN0aW9uKHZhbHVlS2V5LCBmaWVsZEtleSkge1xuICAgICAgICAgICAgdmFyIGZvcm1GaWVsZCwgZm9ybUZpZWxkS2V5LCByZWZlcmVuY2VUb0ZpZWxkTmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlbGF0ZWRPYmplY3RGaWVsZCwgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKGZpZWxkS2V5ICE9PSAnX0ZST01fVEFCTEVfQ09ERScpIHtcbiAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICBmb3JtRmllbGRLZXk7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZUtleS5zdGFydHNXaXRoKHRhYmxlQ29kZSArICcuJykpIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSAodmFsdWVLZXkuc3BsaXQoXCIuXCIpWzFdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSB2YWx1ZUtleTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBmb3JtRmllbGQgPSBnZXRGb3JtVGFibGVTdWJGaWVsZChmb3JtVGFibGVGaWVsZCwgZm9ybUZpZWxkS2V5KTtcbiAgICAgICAgICAgICAgcmVsYXRlZE9iamVjdEZpZWxkID0gcmVsYXRlZE9iamVjdC5maWVsZHNbZmllbGRLZXldO1xuICAgICAgICAgICAgICBpZiAoIWZvcm1GaWVsZCB8fCAhcmVsYXRlZE9iamVjdEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkTmFtZSA9IHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQgfHwgJ19pZCc7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gcmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV07XG4gICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9GaWVsZE5hbWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvRmllbGROYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV07XG4gICAgICAgICAgICAgICAgaWYgKCFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgaWYgKGZvcm1GaWVsZC50eXBlID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdncm91cCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gdGFibGVWYWx1ZUl0ZW1bZm9ybUZpZWxkS2V5XSA9IHRhYmxlRmllbGRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoIV8uaXNFbXB0eSh0YWJsZVZhbHVlSXRlbSkpIHtcbiAgICAgICAgICAgIHRhYmxlVmFsdWVJdGVtLl9pZCA9IHJyLl9pZDtcbiAgICAgICAgICAgIHRhYmxlVmFsdWVzLnB1c2godGFibGVWYWx1ZUl0ZW0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRUYWJsZUl0ZW1zLnB1c2goe1xuICAgICAgICAgICAgICBfdGFibGU6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IHJyLl9pZCxcbiAgICAgICAgICAgICAgICBfY29kZTogdGFibGVDb2RlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHZhbHVlc1t0YWJsZUNvZGVdID0gdGFibGVWYWx1ZXM7XG4gICAgICAgIHJldHVybiByZWxhdGVkVGFibGVzSW5mb1tyZWxhdGVkT2JqZWN0TmFtZV0gPSByZWxhdGVkVGFibGVJdGVtcztcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAob3cuZmllbGRfbWFwX3NjcmlwdCkge1xuICAgICAgXy5leHRlbmQodmFsdWVzLCB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmV2YWxGaWVsZE1hcFNjcmlwdChvdy5maWVsZF9tYXBfc2NyaXB0LCBvYmplY3ROYW1lLCBzcGFjZUlkLCByZWNvcmRJZCkpO1xuICAgIH1cbiAgfVxuICBmaWx0ZXJWYWx1ZXMgPSB7fTtcbiAgXy5lYWNoKF8ua2V5cyh2YWx1ZXMpLCBmdW5jdGlvbihrKSB7XG4gICAgaWYgKGZpZWxkQ29kZXMuaW5jbHVkZXMoaykpIHtcbiAgICAgIHJldHVybiBmaWx0ZXJWYWx1ZXNba10gPSB2YWx1ZXNba107XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZpbHRlclZhbHVlcztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0ID0gZnVuY3Rpb24oZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgb2JqZWN0SWQpIHtcbiAgdmFyIGZ1bmMsIHJlY29yZCwgc2NyaXB0LCB2YWx1ZXM7XG4gIHJlY29yZCA9IG9iamVjdEZpbmRPbmUob2JqZWN0TmFtZSwge1xuICAgIGZpbHRlcnM6IFtbJ19pZCcsICc9Jywgb2JqZWN0SWRdXVxuICB9KTtcbiAgc2NyaXB0ID0gXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZWNvcmQpIHsgXCIgKyBmaWVsZF9tYXBfc2NyaXB0ICsgXCIgfVwiO1xuICBmdW5jID0gX2V2YWwoc2NyaXB0LCBcImZpZWxkX21hcF9zY3JpcHRcIik7XG4gIHZhbHVlcyA9IGZ1bmMocmVjb3JkKTtcbiAgaWYgKF8uaXNPYmplY3QodmFsdWVzKSkge1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcihcImV2YWxGaWVsZE1hcFNjcmlwdDog6ISa5pys6L+U5Zue5YC857G75Z6L5LiN5piv5a+56LGhXCIpO1xuICB9XG4gIHJldHVybiB7fTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2ggPSBmdW5jdGlvbihyZWNvcmRJZHMsIHNwYWNlSWQsIGluc0lkLCBhcHByb3ZlSWQpIHtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1snY21zX2ZpbGVzJ10uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgcGFyZW50OiByZWNvcmRJZHNcbiAgfSkuZm9yRWFjaChmdW5jdGlvbihjZikge1xuICAgIHJldHVybiBfLmVhY2goY2YudmVyc2lvbnMsIGZ1bmN0aW9uKHZlcnNpb25JZCwgaWR4KSB7XG4gICAgICB2YXIgZiwgbmV3RmlsZTtcbiAgICAgIGYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zWydjZnMuZmlsZXMuZmlsZXJlY29yZCddLmZpbmRPbmUodmVyc2lvbklkKTtcbiAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgICAgcmV0dXJuIG5ld0ZpbGUuYXR0YWNoRGF0YShmLmNyZWF0ZVJlYWRTdHJlYW0oJ2ZpbGVzJyksIHtcbiAgICAgICAgdHlwZTogZi5vcmlnaW5hbC50eXBlXG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdmFyIG1ldGFkYXRhO1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnIuZXJyb3IsIGVyci5yZWFzb24pO1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUubmFtZShmLm5hbWUoKSk7XG4gICAgICAgIG5ld0ZpbGUuc2l6ZShmLnNpemUoKSk7XG4gICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgIG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxuICAgICAgICAgIG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICBpbnN0YW5jZTogaW5zSWQsXG4gICAgICAgICAgYXBwcm92ZTogYXBwcm92ZUlkLFxuICAgICAgICAgIHBhcmVudDogY2YuX2lkXG4gICAgICAgIH07XG4gICAgICAgIGlmIChpZHggPT09IDApIHtcbiAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgIHJldHVybiBjZnMuaW5zdGFuY2VzLmluc2VydChuZXdGaWxlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8gPSBmdW5jdGlvbihyZWNvcmRJZHMsIGluc0lkLCBzcGFjZUlkKSB7XG4gIG9iamVjdFVwZGF0ZShyZWNvcmRJZHMubywgcmVjb3JkSWRzLmlkc1swXSwge1xuICAgIGluc3RhbmNlczogW1xuICAgICAge1xuICAgICAgICBfaWQ6IGluc0lkLFxuICAgICAgICBzdGF0ZTogJ2RyYWZ0J1xuICAgICAgfVxuICAgIF0sXG4gICAgbG9ja2VkOiB0cnVlLFxuICAgIGluc3RhbmNlX3N0YXRlOiAnZHJhZnQnXG4gIH0pO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlbGF0ZWRSZWNvcmRJbnN0YW5jZUluZm8gPSBmdW5jdGlvbihyZWxhdGVkVGFibGVzSW5mbywgaW5zSWQsIHNwYWNlSWQpIHtcbiAgXy5lYWNoKHJlbGF0ZWRUYWJsZXNJbmZvLCBmdW5jdGlvbih0YWJsZUl0ZW1zLCByZWxhdGVkT2JqZWN0TmFtZSkge1xuICAgIHZhciByZWxhdGVkQ29sbGVjdGlvbjtcbiAgICByZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCk7XG4gICAgcmV0dXJuIF8uZWFjaCh0YWJsZUl0ZW1zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICByZXR1cm4gcmVsYXRlZENvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShpdGVtLl90YWJsZS5faWQsIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGluc3RhbmNlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBfaWQ6IGluc0lkLFxuICAgICAgICAgICAgICBzdGF0ZTogJ2RyYWZ0J1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAgX3RhYmxlOiBpdGVtLl90YWJsZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsID0gZnVuY3Rpb24ocmVjb3JkSWRzLCBzcGFjZUlkKSB7XG4gIHZhciByZWNvcmQ7XG4gIHJlY29yZCA9IG9iamVjdEZpbmRPbmUocmVjb3JkSWRzLm8sIHtcbiAgICBmaWx0ZXJzOiBbWydfaWQnLCAnPScsIHJlY29yZElkcy5pZHNbMF1dXSxcbiAgICBmaWVsZHM6IFsnaW5zdGFuY2VzJ11cbiAgfSk7XG4gIGlmIChyZWNvcmQgJiYgcmVjb3JkLmluc3RhbmNlcyAmJiByZWNvcmQuaW5zdGFuY2VzWzBdLnN0YXRlICE9PSAnY29tcGxldGVkJyAmJiBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kKHJlY29yZC5pbnN0YW5jZXNbMF0uX2lkKS5jb3VudCgpID4gMCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5q2k6K6w5b2V5bey5Y+R6LW35rWB56iL5q2j5Zyo5a6h5om55Lit77yM5b6F5a6h5om557uT5p2f5pa55Y+v5Y+R6LW35LiL5LiA5qyh5a6h5om577yBXCIpO1xuICB9XG59O1xuIiwiSnNvblJvdXRlcy5hZGQgJ3Bvc3QnLCAnL2FwaS9vYmplY3Qvd29ya2Zsb3cvZHJhZnRzJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblx0XHRjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpXG5cdFx0Y3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkXG5cblx0XHRoYXNoRGF0YSA9IHJlcS5ib2R5XG5cblx0XHRpbnNlcnRlZF9pbnN0YW5jZXMgPSBuZXcgQXJyYXlcblxuXHRcdF8uZWFjaCBoYXNoRGF0YVsnSW5zdGFuY2VzJ10sIChpbnN0YW5jZV9mcm9tX2NsaWVudCkgLT5cblx0XHRcdG5ld19pbnNfaWQgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNyZWF0ZV9pbnN0YW5jZShpbnN0YW5jZV9mcm9tX2NsaWVudCwgY3VycmVudF91c2VyX2luZm8pXG5cblx0XHRcdG5ld19pbnMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kT25lKHsgX2lkOiBuZXdfaW5zX2lkIH0sIHsgZmllbGRzOiB7IHNwYWNlOiAxLCBmbG93OiAxLCBmbG93X3ZlcnNpb246IDEsIGZvcm06IDEsIGZvcm1fdmVyc2lvbjogMSB9IH0pXG5cblx0XHRcdGluc2VydGVkX2luc3RhbmNlcy5wdXNoKG5ld19pbnMpXG5cblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRjb2RlOiAyMDBcblx0XHRcdGRhdGE6IHsgaW5zZXJ0czogaW5zZXJ0ZWRfaW5zdGFuY2VzIH1cblx0XHR9XG5cdGNhdGNoIGVcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRjb2RlOiAyMDBcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbeyBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XSB9XG5cdFx0fVxuXG4iLCJKc29uUm91dGVzLmFkZCgncG9zdCcsICcvYXBpL29iamVjdC93b3JrZmxvdy9kcmFmdHMnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgY3VycmVudF91c2VyX2lkLCBjdXJyZW50X3VzZXJfaW5mbywgZSwgaGFzaERhdGEsIGluc2VydGVkX2luc3RhbmNlcztcbiAgdHJ5IHtcbiAgICBjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpO1xuICAgIGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZDtcbiAgICBoYXNoRGF0YSA9IHJlcS5ib2R5O1xuICAgIGluc2VydGVkX2luc3RhbmNlcyA9IG5ldyBBcnJheTtcbiAgICBfLmVhY2goaGFzaERhdGFbJ0luc3RhbmNlcyddLCBmdW5jdGlvbihpbnN0YW5jZV9mcm9tX2NsaWVudCkge1xuICAgICAgdmFyIG5ld19pbnMsIG5ld19pbnNfaWQ7XG4gICAgICBuZXdfaW5zX2lkID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UoaW5zdGFuY2VfZnJvbV9jbGllbnQsIGN1cnJlbnRfdXNlcl9pbmZvKTtcbiAgICAgIG5ld19pbnMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kT25lKHtcbiAgICAgICAgX2lkOiBuZXdfaW5zX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHNwYWNlOiAxLFxuICAgICAgICAgIGZsb3c6IDEsXG4gICAgICAgICAgZmxvd192ZXJzaW9uOiAxLFxuICAgICAgICAgIGZvcm06IDEsXG4gICAgICAgICAgZm9ybV92ZXJzaW9uOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGluc2VydGVkX2luc3RhbmNlcy5wdXNoKG5ld19pbnMpO1xuICAgIH0pO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGluc2VydHM6IGluc2VydGVkX2luc3RhbmNlc1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIl19
