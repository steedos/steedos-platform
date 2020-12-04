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
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
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

var require = meteorInstall({"node_modules":{"meteor":{"steedos:creator":{"checkNpm.js":function(require,exports,module){

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
  "node-xlsx": "^0.12.0"
}, 'steedos:creator');

if (Meteor.settings && Meteor.settings.cfs && Meteor.settings.cfs.aliyun) {
  checkNpmVersions({
    "aliyun-sdk": "^1.11.12"
  }, 'steedos:creator');
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"core.coffee":function(require){

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
        return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name + "/grid/" + list_view_id);
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

Creator.getRelatedObjectUrl = function (object_name, app_id, record_id, related_object_name) {
  return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name + "/" + record_id + "/" + related_object_name + "/grid");
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
    if (!_.include(["grid", "object", "[Object]", "[object]", "Object", "avatar", "image", "markdown", "html"], f.type)) {
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

  if (_.has(obj, 'allow_actions')) {
    actions = _.filter(actions, function (action) {
      return _.include(obj.allow_actions, action.name);
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
  var disabled_list_views, isMobile, list_views, object, ref;

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
    if (isMobile && item.type === "calendar") {
      return;
    }

    if (item_name !== "default") {
      if (_.indexOf(disabled_list_views, item_name) < 0 || item.owner === userId) {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"apps.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/lib/apps.coffee                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Creator.appsByName = {};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"methods":{"object_recent_viewed.coffee":function(){

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

},"object_recent_record.coffee":function(){

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

},"object_listviews_options.coffee":function(){

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

},"report_data.coffee":function(){

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

},"user_tabular_settings.coffee":function(){

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

},"object_export2xml.coffee":function(require){

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

},"object_import_jobs.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/methods/object_import_jobs.coffee                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"related_objects_records.coffee":function(){

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

},"pending_space.coffee":function(){

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

}},"publications":{"object.coffee":function(){

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

},"object_tabular.coffee":function(){

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

},"object_listviews.coffee":function(){

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

},"user_tabular_settings.coffee":function(){

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

},"related_objects_records.coffee":function(){

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

},"space_user_info.coffee":function(){

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

},"contacts_view_limits.coffee":function(){

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

},"contacts_no_force_phone_users.coffee":function(){

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

},"space_need_to_confirm.coffee":function(){

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

}},"lib":{"permission_manager.coffee":function(){

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

},"uuflowManagerForInitApproval.coffee":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/lib/uuflowManagerForInitApproval.coffee                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _eval;

_eval = require('eval');
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
  uuflowManagerForInitApproval.initiateRelatedRecordInstanceInfo(relatedTablesInfo, new_ins_id, space_id);
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
  object = Creator.getObject(objectName, spaceId);
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
    relatedObjects = Creator.getRelatedObjects(objectName, spaceId);
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
      return _.find(formFields, function (f) {
        return f.code === key;
      });
    };

    getFormTableSubField = function (tableField, subFieldCode) {
      return _.find(tableField.fields, function (f) {
        return f.code === subFieldCode;
      });
    };

    getFieldOdataValue = function (objName, id) {
      var _record, _records, obj;

      obj = Creator.getCollection(objName);

      if (!obj) {
        return;
      }

      if (_.isString(id)) {
        _record = obj.findOne(id);

        if (_record) {
          _record['@label'] = _record.name;
          return _record;
        }
      } else if (_.isArray(id)) {
        _records = [];
        obj.find({
          _id: {
            $in: id
          }
        }).forEach(function (_record) {
          _record['@label'] = _record.name;
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
        var fieldsObj, formField, formTableFieldCode, lookupFieldName, lookupFieldObj, lookupObjectRecord, oTableCode, oTableFieldCode, objField, objectField, objectFieldName, objectFieldObjectName, objectLookupField, object_field, odataFieldValue, referenceToFieldValue, referenceToObjectName, relatedObjectFieldCode, selectFieldValue, tableToRelatedMapKey, wTableCode, workflow_field;
        object_field = fm.object_field;
        workflow_field = fm.workflow_field;
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
        } else if (workflow_field.indexOf('.$.') > 0 && object_field.indexOf('.$.') > 0) {
          wTableCode = workflow_field.split('.$.')[0];
          oTableCode = object_field.split('.$.')[0];

          if (record.hasOwnProperty(oTableCode) && _.isArray(record[oTableCode])) {
            tableFieldCodes.push(JSON.stringify({
              workflow_table_field_code: wTableCode,
              object_table_field_code: oTableCode
            }));
            return tableFieldMap.push(fm);
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
              lookupFieldObj = Creator.getObject(objectFieldObjectName, spaceId);
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
              wTdCode = tfm.workflow_field.split('.$.')[1];
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
        relatedObject = Creator.getObject(relatedObjectName, spaceId);
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
      return relatedCollection.update(item._table._id, {
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

}},"routes":{"s3.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/routes/s3.coffee                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var getQueryString;
JsonRoutes.add("post", "/s3/", function (req, res, next) {
  return JsonRoutes.parseFiles(req, res, function () {
    var collection, fileCollection, newFile;
    collection = cfs.files;
    fileCollection = Creator.getObject("cms_files").db;

    if (req.files && req.files[0]) {
      newFile = new FS.File();
      return newFile.attachData(req.files[0].data, {
        type: req.files[0].mimeType
      }, function (err) {
        var body, e, extention, fileObj, filename, metadata, newFileObjId, object_name, owner, owner_name, parent, record_id, resp, size, space;
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
          fileCollection.update({
            _id: parent
          }, {
            $set: {
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
            description: '',
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
          fileObj.update({
            $set: {
              'metadata.parent': newFileObjId
            }
          });
        }

        resp = {
          version_id: fileObj._id,
          size: size
        };
        res.setHeader("x-amz-version-id", fileObj._id);
        res.end(JSON.stringify(resp));
      });
    } else {
      res.statusCode = 500;
      return res.end();
    }
  });
});
JsonRoutes.add("post", "/s3/:collection", function (req, res, next) {
  var collectionName, e, userId;

  try {
    userId = Steedos.getUserIdFromAuthToken(req, res);

    if (!userId) {
      throw new Meteor.Error(500, "No permission");
    }

    collectionName = req.params.collection;
    JsonRoutes.parseFiles(req, res, function () {
      var collection, newFile, resultData;
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
        resultData = collection.files.findOne(newFile._id);
        JsonRoutes.sendResult(res, {
          code: 200,
          data: resultData
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

},"api_workflow_drafts.coffee":function(){

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjcmVhdG9yL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvbGliL2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvb2JqZWN0X3JlY2VudF92aWV3ZWQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3ZpZXdlZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3JlY29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9yZWNlbnRfcmVjb3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9yZXBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3JlcG9ydF9kYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfZXhwb3J0MnhtbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9leHBvcnQyeG1sLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3JlbGF0ZWRfb2JqZWN0c19yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvcGVuZGluZ19zcGFjZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3BlbmRpbmdfc3BhY2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF90YWJ1bGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF9saXN0dmlld3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy91c2VyX3RhYnVsYXJfc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9yZWxhdGVkX29iamVjdHNfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV91c2VyX2luZm8uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c192aWV3X2xpbWl0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfdmlld19saW1pdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c19ub19mb3JjZV9waG9uZV91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9uZWVkX3RvX2NvbmZpcm0uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX25lZWRfdG9fY29uZmlybS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbGliL3Blcm1pc3Npb25fbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvcGVybWlzc2lvbl9tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9zMy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImJ1c2JveSIsIm1rZGlycCIsIk1ldGVvciIsInNldHRpbmdzIiwiY2ZzIiwiYWxpeXVuIiwiQ3JlYXRvciIsImdldFNjaGVtYSIsIm9iamVjdF9uYW1lIiwicmVmIiwiZ2V0T2JqZWN0Iiwic2NoZW1hIiwiZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCIsImlzQ2xpZW50IiwiUmVhY3RTdGVlZG9zIiwicGx1Z2luQ29tcG9uZW50U2VsZWN0b3IiLCJzdG9yZSIsImdldFN0YXRlIiwiZ2V0T2JqZWN0VXJsIiwicmVjb3JkX2lkIiwiYXBwX2lkIiwibGlzdF92aWV3IiwibGlzdF92aWV3X2lkIiwiU2Vzc2lvbiIsImdldCIsImdldExpc3RWaWV3IiwiX2lkIiwiZ2V0UmVsYXRpdmVVcmwiLCJnZXRPYmplY3RBYnNvbHV0ZVVybCIsIlN0ZWVkb3MiLCJhYnNvbHV0ZVVybCIsImdldE9iamVjdFJvdXRlclVybCIsImdldExpc3RWaWV3VXJsIiwidXJsIiwiZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybCIsImdldFN3aXRjaExpc3RVcmwiLCJnZXRSZWxhdGVkT2JqZWN0VXJsIiwicmVsYXRlZF9vYmplY3RfbmFtZSIsImdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyIsImlzX2RlZXAiLCJpc19za2lwX2hpZGUiLCJpc19yZWxhdGVkIiwiX29iamVjdCIsIl9vcHRpb25zIiwiZmllbGRzIiwiaWNvbiIsInJlbGF0ZWRPYmplY3RzIiwiXyIsImZvckVhY2giLCJmIiwiayIsImhpZGRlbiIsInR5cGUiLCJwdXNoIiwibGFiZWwiLCJ2YWx1ZSIsInJfb2JqZWN0IiwicmVmZXJlbmNlX3RvIiwiaXNTdHJpbmciLCJmMiIsImsyIiwiZ2V0UmVsYXRlZE9iamVjdHMiLCJlYWNoIiwiX3RoaXMiLCJfcmVsYXRlZE9iamVjdCIsInJlbGF0ZWRPYmplY3QiLCJyZWxhdGVkT3B0aW9ucyIsInJlbGF0ZWRPcHRpb24iLCJmb3JlaWduX2tleSIsIm5hbWUiLCJnZXRPYmplY3RGaWx0ZXJGaWVsZE9wdGlvbnMiLCJwZXJtaXNzaW9uX2ZpZWxkcyIsImdldEZpZWxkcyIsImluY2x1ZGUiLCJ0ZXN0IiwiaW5kZXhPZiIsImdldE9iamVjdEZpZWxkT3B0aW9ucyIsImdldEZpbHRlcnNXaXRoRmlsdGVyRmllbGRzIiwiZmlsdGVycyIsImZpbHRlcl9maWVsZHMiLCJsZW5ndGgiLCJuIiwiZmllbGQiLCJyZXF1aXJlZCIsImZpbmRXaGVyZSIsImlzX2RlZmF1bHQiLCJpc19yZXF1aXJlZCIsImZpbHRlckl0ZW0iLCJtYXRjaEZpZWxkIiwiZmluZCIsImdldE9iamVjdFJlY29yZCIsInNlbGVjdF9maWVsZHMiLCJleHBhbmQiLCJjb2xsZWN0aW9uIiwicmVjb3JkIiwicmVmMSIsInJlZjIiLCJUZW1wbGF0ZSIsImluc3RhbmNlIiwib2RhdGEiLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsImdldE9iamVjdFJlY29yZE5hbWUiLCJuYW1lX2ZpZWxkX2tleSIsIk5BTUVfRklFTERfS0VZIiwiZ2V0QXBwIiwiYXBwIiwiQXBwcyIsImRlcHMiLCJkZXBlbmQiLCJnZXRBcHBEYXNoYm9hcmQiLCJkYXNoYm9hcmQiLCJEYXNoYm9hcmRzIiwiYXBwcyIsImdldEFwcERhc2hib2FyZENvbXBvbmVudCIsImdldEFwcE9iamVjdE5hbWVzIiwiYXBwT2JqZWN0cyIsImlzTW9iaWxlIiwib2JqZWN0cyIsIm1vYmlsZV9vYmplY3RzIiwib2JqIiwicGVybWlzc2lvbnMiLCJhbGxvd1JlYWQiLCJnZXRWaXNpYmxlQXBwcyIsImluY2x1ZGVBZG1pbiIsImNoYW5nZUFwcCIsIl9zdWJBcHAiLCJlbnRpdGllcyIsIk9iamVjdCIsImFzc2lnbiIsInZpc2libGVBcHBzU2VsZWN0b3IiLCJnZXRWaXNpYmxlQXBwc09iamVjdHMiLCJ2aXNpYmxlT2JqZWN0TmFtZXMiLCJmbGF0dGVuIiwicGx1Y2siLCJmaWx0ZXIiLCJPYmplY3RzIiwic29ydCIsInNvcnRpbmdNZXRob2QiLCJiaW5kIiwia2V5IiwidW5pcSIsImdldEFwcHNPYmplY3RzIiwidGVtcE9iamVjdHMiLCJjb25jYXQiLCJ2YWxpZGF0ZUZpbHRlcnMiLCJsb2dpYyIsImUiLCJlcnJvck1zZyIsImZpbHRlcl9pdGVtcyIsImZpbHRlcl9sZW5ndGgiLCJmbGFnIiwiaW5kZXgiLCJ3b3JkIiwibWFwIiwiaXNFbXB0eSIsImNvbXBhY3QiLCJyZXBsYWNlIiwibWF0Y2giLCJpIiwiaW5jbHVkZXMiLCJ3IiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwidG9hc3RyIiwiZm9ybWF0RmlsdGVyc1RvTW9uZ28iLCJvcHRpb25zIiwic2VsZWN0b3IiLCJBcnJheSIsIm9wZXJhdGlvbiIsIm9wdGlvbiIsInJlZyIsInN1Yl9zZWxlY3RvciIsImV2YWx1YXRlRm9ybXVsYSIsIlJlZ0V4cCIsImlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyIsImZvcm1hdEZpbHRlcnNUb0RldiIsImxvZ2ljVGVtcEZpbHRlcnMiLCJzdGVlZG9zRmlsdGVycyIsInJlcXVpcmUiLCJpc19sb2dpY19vciIsInBvcCIsIlVTRVJfQ09OVEVYVCIsImZvcm1hdExvZ2ljRmlsdGVyc1RvRGV2IiwiZmlsdGVyX2xvZ2ljIiwiZm9ybWF0X2xvZ2ljIiwieCIsIl9mIiwiaXNBcnJheSIsIkpTT04iLCJzdHJpbmdpZnkiLCJzcGFjZUlkIiwidXNlcklkIiwicmVsYXRlZF9vYmplY3RfbmFtZXMiLCJyZWxhdGVkX29iamVjdHMiLCJ1bnJlbGF0ZWRfb2JqZWN0cyIsImdldE9iamVjdFJlbGF0ZWRzIiwiX2NvbGxlY3Rpb25fbmFtZSIsImdldFBlcm1pc3Npb25zIiwiZGlmZmVyZW5jZSIsInJlbGF0ZWRfb2JqZWN0IiwiaXNBY3RpdmUiLCJnZXRSZWxhdGVkT2JqZWN0TmFtZXMiLCJnZXRBY3Rpb25zIiwiYWN0aW9ucyIsImRpc2FibGVkX2FjdGlvbnMiLCJzb3J0QnkiLCJ2YWx1ZXMiLCJoYXMiLCJhY3Rpb24iLCJhbGxvd19hY3Rpb25zIiwib24iLCJnZXRMaXN0Vmlld3MiLCJkaXNhYmxlZF9saXN0X3ZpZXdzIiwibGlzdF92aWV3cyIsIm9iamVjdCIsIml0ZW0iLCJpdGVtX25hbWUiLCJvd25lciIsImZpZWxkc05hbWUiLCJ1bnJlYWRhYmxlX2ZpZWxkcyIsImdldE9iamVjdEZpZWxkc05hbWUiLCJpc2xvYWRpbmciLCJib290c3RyYXBMb2FkZWQiLCJjb252ZXJ0U3BlY2lhbENoYXJhY3RlciIsInN0ciIsImdldERpc2FibGVkRmllbGRzIiwiZmllbGROYW1lIiwiYXV0b2Zvcm0iLCJkaXNhYmxlZCIsIm9taXQiLCJnZXRIaWRkZW5GaWVsZHMiLCJnZXRGaWVsZHNXaXRoTm9Hcm91cCIsImdyb3VwIiwiZ2V0U29ydGVkRmllbGRHcm91cE5hbWVzIiwibmFtZXMiLCJ1bmlxdWUiLCJnZXRGaWVsZHNGb3JHcm91cCIsImdyb3VwTmFtZSIsImdldEZpZWxkc1dpdGhvdXRPbWl0Iiwia2V5cyIsInBpY2siLCJnZXRGaWVsZHNJbkZpcnN0TGV2ZWwiLCJmaXJzdExldmVsS2V5cyIsImdldEZpZWxkc0ZvclJlb3JkZXIiLCJpc1NpbmdsZSIsIl9rZXlzIiwiY2hpbGRLZXlzIiwiaXNfd2lkZV8xIiwiaXNfd2lkZV8yIiwic2NfMSIsInNjXzIiLCJlbmRzV2l0aCIsImlzX3dpZGUiLCJzbGljZSIsImlzRmlsdGVyVmFsdWVFbXB0eSIsIk51bWJlciIsImlzTmFOIiwiZ2V0RmllbGREYXRhVHlwZSIsIm9iamVjdEZpZWxkcyIsInJlc3VsdCIsImRhdGFfdHlwZSIsImlzU2VydmVyIiwiZ2V0QWxsUmVsYXRlZE9iamVjdHMiLCJyZWxhdGVkX2ZpZWxkIiwicmVsYXRlZF9maWVsZF9uYW1lIiwiZW5hYmxlX2ZpbGVzIiwiYXBwc0J5TmFtZSIsIm1ldGhvZHMiLCJzcGFjZV9pZCIsImNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZCIsImN1cnJlbnRfcmVjZW50X3ZpZXdlZCIsImRvYyIsInNwYWNlIiwidXBkYXRlIiwiJGluYyIsImNvdW50IiwiJHNldCIsIm1vZGlmaWVkIiwiRGF0ZSIsIm1vZGlmaWVkX2J5IiwiaW5zZXJ0IiwiX21ha2VOZXdJRCIsIm8iLCJpZHMiLCJjcmVhdGVkIiwiY3JlYXRlZF9ieSIsImFzeW5jX3JlY2VudF9hZ2dyZWdhdGUiLCJyZWNlbnRfYWdncmVnYXRlIiwic2VhcmNoX29iamVjdCIsIl9yZWNvcmRzIiwiY2FsbGJhY2siLCJDb2xsZWN0aW9ucyIsIm9iamVjdF9yZWNlbnRfdmlld2VkIiwicmF3Q29sbGVjdGlvbiIsImFnZ3JlZ2F0ZSIsIiRtYXRjaCIsIiRncm91cCIsIm1heENyZWF0ZWQiLCIkbWF4IiwiJHNvcnQiLCIkbGltaXQiLCJ0b0FycmF5IiwiZXJyIiwiZGF0YSIsIkVycm9yIiwiaXNGdW5jdGlvbiIsIndyYXBBc3luYyIsInNlYXJjaFRleHQiLCJfb2JqZWN0X2NvbGxlY3Rpb24iLCJfb2JqZWN0X25hbWVfa2V5IiwicXVlcnkiLCJxdWVyeV9hbmQiLCJyZWNvcmRzIiwic2VhcmNoX0tleXdvcmRzIiwic3BsaXQiLCJrZXl3b3JkIiwic3VicXVlcnkiLCIkcmVnZXgiLCJ0cmltIiwiJGFuZCIsIiRpbiIsImxpbWl0IiwiX25hbWUiLCJfb2JqZWN0X25hbWUiLCJyZWNvcmRfb2JqZWN0IiwicmVjb3JkX29iamVjdF9jb2xsZWN0aW9uIiwic2VsZiIsIm9iamVjdHNCeU5hbWUiLCJvYmplY3RfcmVjb3JkIiwiZW5hYmxlX3NlYXJjaCIsInVwZGF0ZV9maWx0ZXJzIiwibGlzdHZpZXdfaWQiLCJmaWx0ZXJfc2NvcGUiLCJvYmplY3RfbGlzdHZpZXdzIiwiZGlyZWN0IiwidXBkYXRlX2NvbHVtbnMiLCJjb2x1bW5zIiwiY2hlY2siLCJjb21wb3VuZEZpZWxkcyIsImN1cnNvciIsImZpbHRlckZpZWxkcyIsImNoaWxkS2V5Iiwib2JqZWN0RmllbGQiLCJzcGxpdHMiLCJpc0NvbW1vblNwYWNlIiwiaXNTcGFjZUFkbWluIiwic2tpcCIsImZldGNoIiwiY29tcG91bmRGaWVsZEl0ZW0iLCJjb21wb3VuZEZpbHRlckZpZWxkcyIsIml0ZW1LZXkiLCJpdGVtVmFsdWUiLCJyZWZlcmVuY2VJdGVtIiwic2V0dGluZyIsImNvbHVtbl93aWR0aCIsIm9iajEiLCJfaWRfYWN0aW9ucyIsIl9taXhGaWVsZHNEYXRhIiwiX21peFJlbGF0ZWREYXRhIiwiX3dyaXRlWG1sRmlsZSIsImZzIiwibG9nZ2VyIiwicGF0aCIsInhtbDJqcyIsIkxvZ2dlciIsImpzb25PYmoiLCJvYmpOYW1lIiwiYnVpbGRlciIsImRheSIsImZpbGVBZGRyZXNzIiwiZmlsZU5hbWUiLCJmaWxlUGF0aCIsIm1vbnRoIiwibm93Iiwic3RyZWFtIiwieG1sIiwieWVhciIsIkJ1aWxkZXIiLCJidWlsZE9iamVjdCIsIkJ1ZmZlciIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiam9pbiIsIl9fbWV0ZW9yX2Jvb3RzdHJhcF9fIiwic2VydmVyRGlyIiwiZXhpc3RzU3luYyIsInN5bmMiLCJ3cml0ZUZpbGUiLCJtaXhCb29sIiwibWl4RGF0ZSIsIm1peERlZmF1bHQiLCJvYmpGaWVsZHMiLCJmaWVsZF9uYW1lIiwiZGF0ZSIsImRhdGVTdHIiLCJmb3JtYXQiLCJtb21lbnQiLCJyZWxhdGVkT2JqTmFtZXMiLCJyZWxhdGVkT2JqTmFtZSIsInJlbGF0ZWRDb2xsZWN0aW9uIiwicmVsYXRlZFJlY29yZExpc3QiLCJyZWxhdGVkVGFibGVEYXRhIiwicmVsYXRlZE9iaiIsImZpZWxkc0RhdGEiLCJFeHBvcnQyeG1sIiwicmVjb3JkTGlzdCIsImluZm8iLCJ0aW1lIiwicmVjb3JkT2JqIiwidGltZUVuZCIsInJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzIiwicmVsYXRlZF9yZWNvcmRzIiwidmlld0FsbFJlY29yZHMiLCJnZXRQZW5kaW5nU3BhY2VJbmZvIiwiaW52aXRlcklkIiwiaW52aXRlck5hbWUiLCJzcGFjZU5hbWUiLCJkYiIsInVzZXJzIiwic3BhY2VzIiwiaW52aXRlciIsInJlZnVzZUpvaW5TcGFjZSIsInNwYWNlX3VzZXJzIiwiaW52aXRlX3N0YXRlIiwiYWNjZXB0Sm9pblNwYWNlIiwidXNlcl9hY2NlcHRlZCIsInB1Ymxpc2giLCJpZCIsInB1Ymxpc2hDb21wb3NpdGUiLCJ0YWJsZU5hbWUiLCJfZmllbGRzIiwib2JqZWN0X2NvbGxlY2l0b24iLCJyZWZlcmVuY2VfZmllbGRzIiwicmVhZHkiLCJTdHJpbmciLCJNYXRjaCIsIk9wdGlvbmFsIiwiZ2V0T2JqZWN0TmFtZSIsInVuYmxvY2siLCJmaWVsZF9rZXlzIiwiY2hpbGRyZW4iLCJfb2JqZWN0S2V5cyIsInJlZmVyZW5jZV9maWVsZCIsInBhcmVudCIsImNoaWxkcmVuX2ZpZWxkcyIsInBfayIsInJlZmVyZW5jZV9pZHMiLCJyZWZlcmVuY2VfdG9fb2JqZWN0Iiwic19rIiwiZ2V0UHJvcGVydHkiLCJyZWR1Y2UiLCJpc09iamVjdCIsInNoYXJlZCIsInVzZXIiLCJzcGFjZV9zZXR0aW5ncyIsInBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsIiwiZ2V0Rmxvd1Blcm1pc3Npb25zIiwiZmxvd19pZCIsInVzZXJfaWQiLCJmbG93IiwibXlfcGVybWlzc2lvbnMiLCJvcmdfaWRzIiwib3JnYW5pemF0aW9ucyIsIm9yZ3NfY2FuX2FkZCIsIm9yZ3NfY2FuX2FkbWluIiwib3Jnc19jYW5fbW9uaXRvciIsInVzZXJzX2Nhbl9hZGQiLCJ1c2Vyc19jYW5fYWRtaW4iLCJ1c2Vyc19jYW5fbW9uaXRvciIsInV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwiLCJnZXRGbG93IiwicGFyZW50cyIsIm9yZyIsInBhcmVudF9pZCIsInBlcm1zIiwib3JnX2lkIiwiX2V2YWwiLCJjaGVja19hdXRob3JpemF0aW9uIiwicmVxIiwiYXV0aFRva2VuIiwiaGFzaGVkVG9rZW4iLCJBY2NvdW50cyIsIl9oYXNoTG9naW5Ub2tlbiIsImdldFNwYWNlIiwiZmxvd3MiLCJnZXRTcGFjZVVzZXIiLCJzcGFjZV91c2VyIiwiZ2V0U3BhY2VVc2VyT3JnSW5mbyIsIm9yZ2FuaXphdGlvbiIsImZ1bGxuYW1lIiwib3JnYW5pemF0aW9uX25hbWUiLCJvcmdhbml6YXRpb25fZnVsbG5hbWUiLCJpc0Zsb3dFbmFibGVkIiwic3RhdGUiLCJpc0Zsb3dTcGFjZU1hdGNoZWQiLCJnZXRGb3JtIiwiZm9ybV9pZCIsImZvcm0iLCJmb3JtcyIsImdldENhdGVnb3J5IiwiY2F0ZWdvcnlfaWQiLCJjYXRlZ29yaWVzIiwiY3JlYXRlX2luc3RhbmNlIiwiaW5zdGFuY2VfZnJvbV9jbGllbnQiLCJ1c2VyX2luZm8iLCJhcHByX29iaiIsImFwcHJvdmVfZnJvbV9jbGllbnQiLCJjYXRlZ29yeSIsImluc19vYmoiLCJuZXdfaW5zX2lkIiwicmVsYXRlZFRhYmxlc0luZm8iLCJzcGFjZV91c2VyX29yZ19pbmZvIiwic3RhcnRfc3RlcCIsInRyYWNlX2Zyb21fY2xpZW50IiwidHJhY2Vfb2JqIiwiY2hlY2tJc0luQXBwcm92YWwiLCJwZXJtaXNzaW9uTWFuYWdlciIsImluc3RhbmNlcyIsImZsb3dfdmVyc2lvbiIsImN1cnJlbnQiLCJmb3JtX3ZlcnNpb24iLCJzdWJtaXR0ZXIiLCJzdWJtaXR0ZXJfbmFtZSIsImFwcGxpY2FudCIsImFwcGxpY2FudF9uYW1lIiwiYXBwbGljYW50X29yZ2FuaXphdGlvbiIsImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSIsImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWUiLCJhcHBsaWNhbnRfY29tcGFueSIsImNvbXBhbnlfaWQiLCJjb2RlIiwiaXNfYXJjaGl2ZWQiLCJpc19kZWxldGVkIiwicmVjb3JkX2lkcyIsIk1vbmdvIiwiT2JqZWN0SUQiLCJfc3RyIiwiaXNfZmluaXNoZWQiLCJzdGVwcyIsInN0ZXAiLCJzdGVwX3R5cGUiLCJzdGFydF9kYXRlIiwidHJhY2UiLCJ1c2VyX25hbWUiLCJoYW5kbGVyIiwiaGFuZGxlcl9uYW1lIiwiaGFuZGxlcl9vcmdhbml6YXRpb24iLCJoYW5kbGVyX29yZ2FuaXphdGlvbl9uYW1lIiwiaGFuZGxlcl9vcmdhbml6YXRpb25fZnVsbG5hbWUiLCJyZWFkX2RhdGUiLCJpc19yZWFkIiwiaXNfZXJyb3IiLCJkZXNjcmlwdGlvbiIsImluaXRpYXRlVmFsdWVzIiwiYXBwcm92ZXMiLCJ0cmFjZXMiLCJpbmJveF91c2VycyIsImN1cnJlbnRfc3RlcF9uYW1lIiwiYXV0b19yZW1pbmQiLCJmbG93X25hbWUiLCJjYXRlZ29yeV9uYW1lIiwiaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8iLCJpbml0aWF0ZVJlbGF0ZWRSZWNvcmRJbnN0YW5jZUluZm8iLCJpbml0aWF0ZUF0dGFjaCIsInJlY29yZElkcyIsImZsb3dJZCIsImZpZWxkQ29kZXMiLCJmaWx0ZXJWYWx1ZXMiLCJmb3JtRmllbGRzIiwiZm9ybVRhYmxlRmllbGRzIiwiZm9ybVRhYmxlRmllbGRzQ29kZSIsImdldEZpZWxkT2RhdGFWYWx1ZSIsImdldEZvcm1GaWVsZCIsImdldEZvcm1UYWJsZUZpZWxkIiwiZ2V0Rm9ybVRhYmxlRmllbGRDb2RlIiwiZ2V0Rm9ybVRhYmxlU3ViRmllbGQiLCJnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlIiwiZ2V0U2VsZWN0T3JnVmFsdWUiLCJnZXRTZWxlY3RPcmdWYWx1ZXMiLCJnZXRTZWxlY3RVc2VyVmFsdWUiLCJnZXRTZWxlY3RVc2VyVmFsdWVzIiwib2JqZWN0TmFtZSIsIm93IiwicmVjb3JkSWQiLCJyZWxhdGVkT2JqZWN0c0tleXMiLCJ0YWJsZUZpZWxkQ29kZXMiLCJ0YWJsZUZpZWxkTWFwIiwidGFibGVUb1JlbGF0ZWRNYXAiLCJmZiIsIm9iamVjdF93b3JrZmxvd3MiLCJmb3JtRmllbGQiLCJyZWxhdGVkT2JqZWN0c0tleSIsInN0YXJ0c1dpdGgiLCJmb3JtVGFibGVGaWVsZENvZGUiLCJ0YWJsZUZpZWxkIiwic3ViRmllbGRDb2RlIiwiX3JlY29yZCIsInN1IiwidXNlcklkcyIsInN1cyIsIm9yZ0lkIiwib3JnSWRzIiwib3JncyIsImZpZWxkX21hcCIsImZtIiwiZmllbGRzT2JqIiwibG9va3VwRmllbGROYW1lIiwibG9va3VwRmllbGRPYmoiLCJsb29rdXBPYmplY3RSZWNvcmQiLCJvVGFibGVDb2RlIiwib1RhYmxlRmllbGRDb2RlIiwib2JqRmllbGQiLCJvYmplY3RGaWVsZE5hbWUiLCJvYmplY3RGaWVsZE9iamVjdE5hbWUiLCJvYmplY3RMb29rdXBGaWVsZCIsIm9iamVjdF9maWVsZCIsIm9kYXRhRmllbGRWYWx1ZSIsInJlZmVyZW5jZVRvRmllbGRWYWx1ZSIsInJlZmVyZW5jZVRvT2JqZWN0TmFtZSIsInJlbGF0ZWRPYmplY3RGaWVsZENvZGUiLCJzZWxlY3RGaWVsZFZhbHVlIiwidGFibGVUb1JlbGF0ZWRNYXBLZXkiLCJ3VGFibGVDb2RlIiwid29ya2Zsb3dfZmllbGQiLCJoYXNPd25Qcm9wZXJ0eSIsIndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGUiLCJvYmplY3RfdGFibGVfZmllbGRfY29kZSIsIm11bHRpcGxlIiwiaXNfbXVsdGlzZWxlY3QiLCJ0ZmMiLCJjIiwicGFyc2UiLCJ0ciIsIm5ld1RyIiwidGZtIiwid1RkQ29kZSIsImZvcm1UYWJsZUZpZWxkIiwicmVsYXRlZEZpZWxkIiwicmVsYXRlZEZpZWxkTmFtZSIsInJlbGF0ZWRPYmplY3ROYW1lIiwicmVsYXRlZFJlY29yZHMiLCJyZWxhdGVkVGFibGVJdGVtcyIsInRhYmxlQ29kZSIsInRhYmxlVmFsdWVzIiwiX0ZST01fVEFCTEVfQ09ERSIsIndhcm4iLCJyciIsInRhYmxlVmFsdWVJdGVtIiwidmFsdWVLZXkiLCJmaWVsZEtleSIsImZvcm1GaWVsZEtleSIsInJlbGF0ZWRPYmplY3RGaWVsZCIsInRhYmxlRmllbGRWYWx1ZSIsIl90YWJsZSIsIl9jb2RlIiwiZmllbGRfbWFwX3NjcmlwdCIsImV4dGVuZCIsImV2YWxGaWVsZE1hcFNjcmlwdCIsIm9iamVjdElkIiwiZnVuYyIsInNjcmlwdCIsImluc0lkIiwiYXBwcm92ZUlkIiwiY2YiLCJ2ZXJzaW9ucyIsInZlcnNpb25JZCIsImlkeCIsIm5ld0ZpbGUiLCJGUyIsIkZpbGUiLCJhdHRhY2hEYXRhIiwiY3JlYXRlUmVhZFN0cmVhbSIsIm9yaWdpbmFsIiwibWV0YWRhdGEiLCJyZWFzb24iLCJzaXplIiwib3duZXJfbmFtZSIsImFwcHJvdmUiLCIkcHVzaCIsIiRlYWNoIiwiJHBvc2l0aW9uIiwibG9ja2VkIiwiaW5zdGFuY2Vfc3RhdGUiLCJ0YWJsZUl0ZW1zIiwiJGV4aXN0cyIsImdldFF1ZXJ5U3RyaW5nIiwiSnNvblJvdXRlcyIsImFkZCIsInJlcyIsIm5leHQiLCJwYXJzZUZpbGVzIiwiZmlsZUNvbGxlY3Rpb24iLCJmaWxlcyIsIm1pbWVUeXBlIiwiYm9keSIsImV4dGVudGlvbiIsImZpbGVPYmoiLCJmaWxlbmFtZSIsIm5ld0ZpbGVPYmpJZCIsInJlc3AiLCJ0b0xvd2VyQ2FzZSIsImRlY29kZVVSSUNvbXBvbmVudCIsInZlcnNpb25faWQiLCJzZXRIZWFkZXIiLCJlbmQiLCJzdGF0dXNDb2RlIiwiY29sbGVjdGlvbk5hbWUiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwicGFyYW1zIiwicmVzdWx0RGF0YSIsInNlbmRSZXN1bHQiLCJzdGFjayIsImVycm9ycyIsIm1lc3NhZ2UiLCJhY2Nlc3NLZXlJZCIsInNlY3JldEFjY2Vzc0tleSIsIm1ldGhvZCIsIkFMWSIsImNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyIsInF1ZXJ5S2V5cyIsInF1ZXJ5U3RyIiwic3RyaW5nVG9TaWduIiwidXRpbCIsIkZvcm1hdCIsIlZlcnNpb24iLCJBY2Nlc3NLZXlJZCIsIlNpZ25hdHVyZU1ldGhvZCIsIlRpbWVzdGFtcCIsImlzbzg2MDEiLCJTaWduYXR1cmVWZXJzaW9uIiwiU2lnbmF0dXJlTm9uY2UiLCJnZXRUaW1lIiwicG9wRXNjYXBlIiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJTaWduYXR1cmUiLCJjcnlwdG8iLCJobWFjIiwicXVlcnlQYXJhbXNUb1N0cmluZyIsIm9zcyIsInIiLCJyZWYzIiwidXBsb2FkQWRkcmVzcyIsInVwbG9hZEF1dGgiLCJ2aWRlb0lkIiwiQWN0aW9uIiwiVGl0bGUiLCJGaWxlTmFtZSIsIkhUVFAiLCJjYWxsIiwiVmlkZW9JZCIsIlVwbG9hZEFkZHJlc3MiLCJ0b1N0cmluZyIsIlVwbG9hZEF1dGgiLCJPU1MiLCJBY2Nlc3NLZXlTZWNyZXQiLCJFbmRwb2ludCIsIlNlY3VyaXR5VG9rZW4iLCJwdXRPYmplY3QiLCJCdWNrZXQiLCJLZXkiLCJCb2R5IiwiQWNjZXNzQ29udHJvbEFsbG93T3JpZ2luIiwiQ29udGVudFR5cGUiLCJDYWNoZUNvbnRyb2wiLCJDb250ZW50RGlzcG9zaXRpb24iLCJDb250ZW50RW5jb2RpbmciLCJTZXJ2ZXJTaWRlRW5jcnlwdGlvbiIsIkV4cGlyZXMiLCJiaW5kRW52aXJvbm1lbnQiLCJnZXRQbGF5SW5mb1F1ZXJ5IiwiZ2V0UGxheUluZm9SZXN1bHQiLCJnZXRQbGF5SW5mb1VybCIsIm5ld0RhdGUiLCJjdXJyZW50X3VzZXJfaWQiLCJjdXJyZW50X3VzZXJfaW5mbyIsImhhc2hEYXRhIiwiaW5zZXJ0ZWRfaW5zdGFuY2VzIiwibmV3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SGlRLG1CQUFtQnh0QixJQUFuQixDQUF3Qnl0QixPQUF4QixDQ09HO0FEWko7O0FDY0UsV0RQRjVGLFdBQVd3QixVQUFYLENBQXNCdEIsR0FBdEIsRUFBMkI7QUFDMUI5SixZQUFNLEdBRG9CO0FBRTFCcE8sWUFBTTtBQUFFNmQsaUJBQVNGO0FBQVg7QUFGb0IsS0FBM0IsQ0NPRTtBRHRCSCxXQUFBM21CLEtBQUE7QUFtQk1mLFFBQUFlLEtBQUE7QUFDTEMsWUFBUUQsS0FBUixDQUFjZixFQUFFd2pCLEtBQWhCO0FDV0UsV0RWRnpCLFdBQVd3QixVQUFYLENBQXNCdEIsR0FBdEIsRUFBMkI7QUFDMUI5SixZQUFNLEdBRG9CO0FBRTFCcE8sWUFBTTtBQUFFMFosZ0JBQVEsQ0FBQztBQUFFb0Usd0JBQWM3bkIsRUFBRW1oQixNQUFGLElBQVluaEIsRUFBRTBqQjtBQUE5QixTQUFEO0FBQVY7QUFGb0IsS0FBM0IsQ0NVRTtBQVVEO0FEMUNILEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdGNoZWNrTnBtVmVyc2lvbnNcbn0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5jaGVja05wbVZlcnNpb25zKHtcblx0YnVzYm95OiBcIl4wLjIuMTNcIixcblx0bWtkaXJwOiBcIl4wLjMuNVwiLFxuXHRcInhtbDJqc1wiOiBcIl4wLjQuMTlcIixcblx0XCJub2RlLXhsc3hcIjogXCJeMC4xMi4wXCJcbn0sICdzdGVlZG9zOmNyZWF0b3InKTtcblxuaWYgKE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzICYmIE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKSB7XG5cdGNoZWNrTnBtVmVyc2lvbnMoe1xuXHRcdFwiYWxpeXVuLXNka1wiOiBcIl4xLjExLjEyXCJcblx0fSwgJ3N0ZWVkb3M6Y3JlYXRvcicpO1xufSIsIlxuXHQjIENyZWF0b3IuaW5pdEFwcHMoKVxuXG5cbiMgQ3JlYXRvci5pbml0QXBwcyA9ICgpLT5cbiMgXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcbiMgXHRcdF8uZWFjaCBDcmVhdG9yLkFwcHMsIChhcHAsIGFwcF9pZCktPlxuIyBcdFx0XHRkYl9hcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKVxuIyBcdFx0XHRpZiAhZGJfYXBwXG4jIFx0XHRcdFx0YXBwLl9pZCA9IGFwcF9pZFxuIyBcdFx0XHRcdGRiLmFwcHMuaW5zZXJ0KGFwcClcbiMgZWxzZVxuIyBcdGFwcC5faWQgPSBhcHBfaWRcbiMgXHRkYi5hcHBzLnVwZGF0ZSh7X2lkOiBhcHBfaWR9LCBhcHApXG5cbkNyZWF0b3IuZ2V0U2NoZW1hID0gKG9iamVjdF9uYW1lKS0+XG5cdHJldHVybiBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk/LnNjaGVtYVxuXG5DcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQgPSAob2JqZWN0X25hbWUpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0cmV0dXJuIFJlYWN0U3RlZWRvcy5wbHVnaW5Db21wb25lbnRTZWxlY3RvcihSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKSwgXCJPYmplY3RIb21lXCIsIG9iamVjdF9uYW1lKVxuXG5DcmVhdG9yLmdldE9iamVjdFVybCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIC0+XG5cdGlmICFhcHBfaWRcblx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKVxuXHRsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXc/Ll9pZFxuXG5cdGlmIHJlY29yZF9pZFxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkX2lkKVxuXHRlbHNlXG5cdFx0aWYgb2JqZWN0X25hbWUgaXMgXCJtZWV0aW5nXCJcblx0XHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIilcblx0XHRlbHNlXG5cdFx0XHRpZiBDcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQob2JqZWN0X25hbWUpXG5cdFx0XHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKVxuXG5DcmVhdG9yLmdldE9iamVjdEFic29sdXRlVXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cblx0aWYgIWFwcF9pZFxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXG5cdGxpc3Rfdmlld19pZCA9IGxpc3Rfdmlldz8uX2lkXG5cblx0aWYgcmVjb3JkX2lkXG5cdFx0cmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQsIHRydWUpXG5cdGVsc2Vcblx0XHRpZiBvYmplY3RfbmFtZSBpcyBcIm1lZXRpbmdcIlxuXHRcdFx0cmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiLCB0cnVlKVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkLCB0cnVlKVxuXG5DcmVhdG9yLmdldE9iamVjdFJvdXRlclVybCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIC0+XG5cdGlmICFhcHBfaWRcblx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKVxuXHRsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXc/Ll9pZFxuXG5cdGlmIHJlY29yZF9pZFxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZFxuXHRlbHNlXG5cdFx0aWYgb2JqZWN0X25hbWUgaXMgXCJtZWV0aW5nXCJcblx0XHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCJcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWRcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1VybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIC0+XG5cdHVybCA9IENyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpXG5cdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKHVybClcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cblx0aWYgbGlzdF92aWV3X2lkIGlzIFwiY2FsZW5kYXJcIlxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCJcblx0ZWxzZVxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZFxuXG5DcmVhdG9yLmdldFN3aXRjaExpc3RVcmwgPSAob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSAtPlxuXHRpZiBsaXN0X3ZpZXdfaWRcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi9saXN0XCIpXG5cdGVsc2Vcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvbGlzdC9zd2l0Y2hcIilcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0VXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIHJlY29yZF9pZCwgcmVsYXRlZF9vYmplY3RfbmFtZSkgLT5cblx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgcmVjb3JkX2lkICsgXCIvXCIgKyByZWxhdGVkX29iamVjdF9uYW1lICsgXCIvZ3JpZFwiKVxuXG5DcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyA9IChvYmplY3RfbmFtZSwgaXNfZGVlcCwgaXNfc2tpcF9oaWRlLCBpc19yZWxhdGVkKS0+XG5cdF9vcHRpb25zID0gW11cblx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIF9vcHRpb25zXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0ZmllbGRzID0gX29iamVjdD8uZmllbGRzXG5cdGljb24gPSBfb2JqZWN0Py5pY29uXG5cdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XG5cdFx0aWYgaXNfc2tpcF9oaWRlIGFuZCBmLmhpZGRlblxuXHRcdFx0cmV0dXJuXG5cdFx0aWYgZi50eXBlID09IFwic2VsZWN0XCJcblx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7Zi5sYWJlbCB8fCBrfVwiLCB2YWx1ZTogXCIje2t9XCIsIGljb246IGljb259XG5cdFx0ZWxzZVxuXHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XG5cdGlmIGlzX2RlZXBcblx0XHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxuXHRcdFx0aWYgaXNfc2tpcF9oaWRlIGFuZCBmLmhpZGRlblxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIChmLnR5cGUgPT0gXCJsb29rdXBcIiB8fCBmLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpICYmIGYucmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcoZi5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdCMg5LiN5pSv5oyBZi5yZWZlcmVuY2VfdG/kuLpmdW5jdGlvbueahOaDheWGte+8jOaciemcgOaxguWGjeivtFxuXHRcdFx0XHRyX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGYucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRpZiByX29iamVjdFxuXHRcdFx0XHRcdF8uZm9yRWFjaCByX29iamVjdC5maWVsZHMsIChmMiwgazIpLT5cblx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7Zi5sYWJlbCB8fCBrfT0+I3tmMi5sYWJlbCB8fCBrMn1cIiwgdmFsdWU6IFwiI3trfS4je2syfVwiLCBpY29uOiByX29iamVjdD8uaWNvbn1cblx0aWYgaXNfcmVsYXRlZFxuXHRcdHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSlcblx0XHRfLmVhY2ggcmVsYXRlZE9iamVjdHMsIChfcmVsYXRlZE9iamVjdCk9PlxuXHRcdFx0cmVsYXRlZE9wdGlvbnMgPSBDcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyhfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSlcblx0XHRcdHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSlcblx0XHRcdF8uZWFjaCByZWxhdGVkT3B0aW9ucywgKHJlbGF0ZWRPcHRpb24pLT5cblx0XHRcdFx0aWYgX3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXkgIT0gcmVsYXRlZE9wdGlvbi52YWx1ZVxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7cmVsYXRlZE9iamVjdC5sYWJlbCB8fCByZWxhdGVkT2JqZWN0Lm5hbWV9PT4je3JlbGF0ZWRPcHRpb24ubGFiZWx9XCIsIHZhbHVlOiBcIiN7cmVsYXRlZE9iamVjdC5uYW1lfS4je3JlbGF0ZWRPcHRpb24udmFsdWV9XCIsIGljb246IHJlbGF0ZWRPYmplY3Q/Lmljb259XG5cdHJldHVybiBfb3B0aW9uc1xuXG4jIOe7n+S4gOS4uuWvueixoW9iamVjdF9uYW1l5o+Q5L6b5Y+v55So5LqO6L+H6JmR5Zmo6L+H6JmR5a2X5q61XG5DcmVhdG9yLmdldE9iamVjdEZpbHRlckZpZWxkT3B0aW9ucyA9IChvYmplY3RfbmFtZSktPlxuXHRfb3B0aW9ucyA9IFtdXG5cdHVubGVzcyBvYmplY3RfbmFtZVxuXHRcdHJldHVybiBfb3B0aW9uc1xuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xuXHRwZXJtaXNzaW9uX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKG9iamVjdF9uYW1lKVxuXHRpY29uID0gX29iamVjdD8uaWNvblxuXHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxuXHRcdCMgaGlkZGVuLGdyaWTnrYnnsbvlnovnmoTlrZfmrrXvvIzkuI3pnIDopoHov4fmu6Rcblx0XHRpZiAhXy5pbmNsdWRlKFtcImdyaWRcIixcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJhdmF0YXJcIiwgXCJpbWFnZVwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKSBhbmQgIWYuaGlkZGVuXG5cdFx0XHQjIGZpbHRlcnMuJC5maWVsZOWPimZsb3cuY3VycmVudOetieWtkOWtl+auteS5n+S4jemcgOimgei/h+a7pFxuXHRcdFx0aWYgIS9cXHcrXFwuLy50ZXN0KGspIGFuZCBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTFcblx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XG5cblx0cmV0dXJuIF9vcHRpb25zXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRPcHRpb25zID0gKG9iamVjdF9uYW1lKS0+XG5cdF9vcHRpb25zID0gW11cblx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIF9vcHRpb25zXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0ZmllbGRzID0gX29iamVjdD8uZmllbGRzXG5cdHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpXG5cdGljb24gPSBfb2JqZWN0Py5pY29uXG5cdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XG5cdFx0aWYgIV8uaW5jbHVkZShbXCJncmlkXCIsXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwiYXZhdGFyXCIsIFwiaW1hZ2VcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSlcblx0XHRcdGlmICEvXFx3K1xcLi8udGVzdChrKSBhbmQgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xXG5cdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBmLmxhYmVsIHx8IGssIHZhbHVlOiBrLCBpY29uOiBpY29ufVxuXHRyZXR1cm4gX29wdGlvbnNcblxuIyMjXG5maWx0ZXJzOiDopoHovazmjaLnmoRmaWx0ZXJzXG5maWVsZHM6IOWvueixoeWtl+autVxuZmlsdGVyX2ZpZWxkczog6buY6K6k6L+H5ruk5a2X5q6177yM5pSv5oyB5a2X56ym5Liy5pWw57uE5ZKM5a+56LGh5pWw57uE5Lik56eN5qC85byP77yM5aaCOlsnZmlsZWRfbmFtZTEnLCdmaWxlZF9uYW1lMiddLFt7ZmllbGQ6J2ZpbGVkX25hbWUxJyxyZXF1aXJlZDp0cnVlfV1cbuWkhOeQhumAu+i+kTog5oqKZmlsdGVyc+S4reWtmOWcqOS6jmZpbHRlcl9maWVsZHPnmoTov4fmu6TmnaHku7blop7liqDmr4/pobnnmoRpc19kZWZhdWx044CBaXNfcmVxdWlyZWTlsZ7mgKfvvIzkuI3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25a+55bqU55qE56e76Zmk5q+P6aG555qE55u45YWz5bGe5oCnXG7ov5Tlm57nu5Pmnpw6IOWkhOeQhuWQjueahGZpbHRlcnNcbiMjI1xuQ3JlYXRvci5nZXRGaWx0ZXJzV2l0aEZpbHRlckZpZWxkcyA9IChmaWx0ZXJzLCBmaWVsZHMsIGZpbHRlcl9maWVsZHMpLT5cblx0dW5sZXNzIGZpbHRlcnNcblx0XHRmaWx0ZXJzID0gW11cblx0dW5sZXNzIGZpbHRlcl9maWVsZHNcblx0XHRmaWx0ZXJfZmllbGRzID0gW11cblx0aWYgZmlsdGVyX2ZpZWxkcz8ubGVuZ3RoXG5cdFx0ZmlsdGVyX2ZpZWxkcy5mb3JFYWNoIChuKS0+XG5cdFx0XHRpZiBfLmlzU3RyaW5nKG4pXG5cdFx0XHRcdG4gPSBcblx0XHRcdFx0XHRmaWVsZDogbixcblx0XHRcdFx0XHRyZXF1aXJlZDogZmFsc2Vcblx0XHRcdGlmIGZpZWxkc1tuLmZpZWxkXSBhbmQgIV8uZmluZFdoZXJlKGZpbHRlcnMse2ZpZWxkOm4uZmllbGR9KVxuXHRcdFx0XHRmaWx0ZXJzLnB1c2hcblx0XHRcdFx0XHRmaWVsZDogbi5maWVsZCxcblx0XHRcdFx0XHRpc19kZWZhdWx0OiB0cnVlLFxuXHRcdFx0XHRcdGlzX3JlcXVpcmVkOiBuLnJlcXVpcmVkXG5cdGZpbHRlcnMuZm9yRWFjaCAoZmlsdGVySXRlbSktPlxuXHRcdG1hdGNoRmllbGQgPSBmaWx0ZXJfZmllbGRzLmZpbmQgKG4pLT4gcmV0dXJuIG4gPT0gZmlsdGVySXRlbS5maWVsZCBvciBuLmZpZWxkID09IGZpbHRlckl0ZW0uZmllbGRcblx0XHRpZiBfLmlzU3RyaW5nKG1hdGNoRmllbGQpXG5cdFx0XHRtYXRjaEZpZWxkID0gXG5cdFx0XHRcdGZpZWxkOiBtYXRjaEZpZWxkLFxuXHRcdFx0XHRyZXF1aXJlZDogZmFsc2Vcblx0XHRpZiBtYXRjaEZpZWxkXG5cdFx0XHRmaWx0ZXJJdGVtLmlzX2RlZmF1bHQgPSB0cnVlXG5cdFx0XHRmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkID0gbWF0Y2hGaWVsZC5yZXF1aXJlZFxuXHRcdGVsc2Vcblx0XHRcdGRlbGV0ZSBmaWx0ZXJJdGVtLmlzX2RlZmF1bHRcblx0XHRcdGRlbGV0ZSBmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkXG5cdHJldHVybiBmaWx0ZXJzXG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZCktPlxuXG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGlmICFyZWNvcmRfaWRcblx0XHRyZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiBvYmplY3RfbmFtZSA9PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpICYmICByZWNvcmRfaWQgPT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcblx0XHRcdGlmIFRlbXBsYXRlLmluc3RhbmNlKCk/LnJlY29yZFxuXHRcdFx0XHRyZXR1cm4gVGVtcGxhdGUuaW5zdGFuY2UoKT8ucmVjb3JkPy5nZXQoKVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpXG5cblx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSlcblx0aWYgY29sbGVjdGlvblxuXHRcdHJlY29yZCA9IGNvbGxlY3Rpb24uZmluZE9uZShyZWNvcmRfaWQpXG5cdFx0cmV0dXJuIHJlY29yZFxuXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZE5hbWUgPSAocmVjb3JkLCBvYmplY3RfbmFtZSktPlxuXHR1bmxlc3MgcmVjb3JkXG5cdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQoKVxuXHRpZiByZWNvcmRcblx0XHQjIOaYvuekuue7hOe7h+WIl+ihqOaXtu+8jOeJueauiuWkhOeQhm5hbWVfZmllbGRfa2V55Li6bmFtZeWtl+autVxuXHRcdG5hbWVfZmllbGRfa2V5ID0gaWYgb2JqZWN0X25hbWUgPT0gXCJvcmdhbml6YXRpb25zXCIgdGhlbiBcIm5hbWVcIiBlbHNlIENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKT8uTkFNRV9GSUVMRF9LRVlcblx0XHRpZiByZWNvcmQgYW5kIG5hbWVfZmllbGRfa2V5XG5cdFx0XHRyZXR1cm4gcmVjb3JkLmxhYmVsIHx8IHJlY29yZFtuYW1lX2ZpZWxkX2tleV1cblxuQ3JlYXRvci5nZXRBcHAgPSAoYXBwX2lkKS0+XG5cdGlmICFhcHBfaWRcblx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxuXHRhcHAgPSBDcmVhdG9yLkFwcHNbYXBwX2lkXVxuXHRDcmVhdG9yLmRlcHM/LmFwcD8uZGVwZW5kKClcblx0cmV0dXJuIGFwcFxuXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZCA9IChhcHBfaWQpLT5cblx0YXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKVxuXHRpZiAhYXBwXG5cdFx0cmV0dXJuXG5cdGRhc2hib2FyZCA9IG51bGxcblx0Xy5lYWNoIENyZWF0b3IuRGFzaGJvYXJkcywgKHYsIGspLT5cblx0XHRpZiB2LmFwcHM/LmluZGV4T2YoYXBwLl9pZCkgPiAtMVxuXHRcdFx0ZGFzaGJvYXJkID0gdjtcblx0cmV0dXJuIGRhc2hib2FyZDtcblxuQ3JlYXRvci5nZXRBcHBEYXNoYm9hcmRDb21wb25lbnQgPSAoYXBwX2lkKS0+XG5cdGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZClcblx0aWYgIWFwcFxuXHRcdHJldHVyblxuXHRyZXR1cm4gUmVhY3RTdGVlZG9zLnBsdWdpbkNvbXBvbmVudFNlbGVjdG9yKFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLCBcIkRhc2hib2FyZFwiLCBhcHAuX2lkKTtcblxuQ3JlYXRvci5nZXRBcHBPYmplY3ROYW1lcyA9IChhcHBfaWQpLT5cblx0YXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKVxuXHRpZiAhYXBwXG5cdFx0cmV0dXJuXG5cdGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpXG5cdGFwcE9iamVjdHMgPSBpZiBpc01vYmlsZSB0aGVuIGFwcC5tb2JpbGVfb2JqZWN0cyBlbHNlIGFwcC5vYmplY3RzXG5cdG9iamVjdHMgPSBbXVxuXHRpZiBhcHBcblx0XHRfLmVhY2ggYXBwT2JqZWN0cywgKHYpLT5cblx0XHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KHYpXG5cdFx0XHRpZiBvYmo/LnBlcm1pc3Npb25zLmdldCgpLmFsbG93UmVhZFxuXHRcdFx0XHRvYmplY3RzLnB1c2ggdlxuXHRyZXR1cm4gb2JqZWN0c1xuXG5DcmVhdG9yLmdldFZpc2libGVBcHBzID0gKGluY2x1ZGVBZG1pbiktPlxuXHRjaGFuZ2VBcHAgPSBDcmVhdG9yLl9zdWJBcHAuZ2V0KCk7XG5cdFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLmVudGl0aWVzLmFwcHMgPSBPYmplY3QuYXNzaWduKHt9LCBSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKS5lbnRpdGllcy5hcHBzLCB7YXBwczogY2hhbmdlQXBwfSk7XG5cdHJldHVybiBSZWFjdFN0ZWVkb3MudmlzaWJsZUFwcHNTZWxlY3RvcihSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKSwgaW5jbHVkZUFkbWluKVxuXG5DcmVhdG9yLmdldFZpc2libGVBcHBzT2JqZWN0cyA9ICgpLT5cblx0YXBwcyA9IENyZWF0b3IuZ2V0VmlzaWJsZUFwcHMoKVxuXHR2aXNpYmxlT2JqZWN0TmFtZXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhhcHBzLCdvYmplY3RzJykpXG5cdG9iamVjdHMgPSBfLmZpbHRlciBDcmVhdG9yLk9iamVjdHMsIChvYmopLT5cblx0XHRpZiB2aXNpYmxlT2JqZWN0TmFtZXMuaW5kZXhPZihvYmoubmFtZSkgPCAwXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXHRvYmplY3RzID0gb2JqZWN0cy5zb3J0KENyZWF0b3Iuc29ydGluZ01ldGhvZC5iaW5kKHtrZXk6XCJsYWJlbFwifSkpXG5cdG9iamVjdHMgPSBfLnBsdWNrKG9iamVjdHMsJ25hbWUnKVxuXHRyZXR1cm4gXy51bmlxIG9iamVjdHNcblxuQ3JlYXRvci5nZXRBcHBzT2JqZWN0cyA9ICgpLT5cblx0b2JqZWN0cyA9IFtdXG5cdHRlbXBPYmplY3RzID0gW11cblx0Xy5mb3JFYWNoIENyZWF0b3IuQXBwcywgKGFwcCktPlxuXHRcdHRlbXBPYmplY3RzID0gXy5maWx0ZXIgYXBwLm9iamVjdHMsIChvYmopLT5cblx0XHRcdHJldHVybiAhb2JqLmhpZGRlblxuXHRcdG9iamVjdHMgPSBvYmplY3RzLmNvbmNhdCh0ZW1wT2JqZWN0cylcblx0cmV0dXJuIF8udW5pcSBvYmplY3RzXG5cbkNyZWF0b3IudmFsaWRhdGVGaWx0ZXJzID0gKGZpbHRlcnMsIGxvZ2ljKS0+XG5cdGZpbHRlcl9pdGVtcyA9IF8ubWFwIGZpbHRlcnMsIChvYmopIC0+XG5cdFx0aWYgXy5pc0VtcHR5KG9iailcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBvYmpcblx0ZmlsdGVyX2l0ZW1zID0gXy5jb21wYWN0KGZpbHRlcl9pdGVtcylcblx0ZXJyb3JNc2cgPSBcIlwiXG5cdGZpbHRlcl9sZW5ndGggPSBmaWx0ZXJfaXRlbXMubGVuZ3RoXG5cdGlmIGxvZ2ljXG5cdFx0IyDmoLzlvI/ljJZmaWx0ZXJcblx0XHRsb2dpYyA9IGxvZ2ljLnJlcGxhY2UoL1xcbi9nLCBcIlwiKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKVxuXG5cdFx0IyDliKTmlq3nibnmrorlrZfnrKZcblx0XHRpZiAvWy5fXFwtIStdKy9pZy50ZXN0KGxvZ2ljKVxuXHRcdFx0ZXJyb3JNc2cgPSBcIuWQq+acieeJueauiuWtl+espuOAglwiXG5cblx0XHRpZiAhZXJyb3JNc2dcblx0XHRcdGluZGV4ID0gbG9naWMubWF0Y2goL1xcZCsvaWcpXG5cdFx0XHRpZiAhaW5kZXhcblx0XHRcdFx0ZXJyb3JNc2cgPSBcIuacieS6m+etm+mAieadoeS7tui/m+ihjOS6huWumuS5ie+8jOS9huacquWcqOmrmOe6p+etm+mAieadoeS7tuS4reiiq+W8leeUqOOAglwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGluZGV4LmZvckVhY2ggKGkpLT5cblx0XHRcdFx0XHRpZiBpIDwgMSBvciBpID4gZmlsdGVyX2xlbmd0aFxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieadoeS7tuW8leeUqOS6huacquWumuS5ieeahOetm+mAieWZqO+8miN7aX3jgIJcIlxuXG5cdFx0XHRcdGZsYWcgPSAxXG5cdFx0XHRcdHdoaWxlIGZsYWcgPD0gZmlsdGVyX2xlbmd0aFxuXHRcdFx0XHRcdGlmICFpbmRleC5pbmNsdWRlcyhcIiN7ZmxhZ31cIilcblx0XHRcdFx0XHRcdGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIlxuXHRcdFx0XHRcdGZsYWcrKztcblxuXHRcdGlmICFlcnJvck1zZ1xuXHRcdFx0IyDliKTmlq3mmK/lkKbmnInpnZ7ms5Xoi7HmloflrZfnrKZcblx0XHRcdHdvcmQgPSBsb2dpYy5tYXRjaCgvW2EtekEtWl0rL2lnKVxuXHRcdFx0aWYgd29yZFxuXHRcdFx0XHR3b3JkLmZvckVhY2ggKHcpLT5cblx0XHRcdFx0XHRpZiAhL14oYW5kfG9yKSQvaWcudGVzdCh3KVxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBcIuajgOafpeaCqOeahOmrmOe6p+etm+mAieadoeS7tuS4reeahOaLvOWGmeOAglwiXG5cblx0XHRpZiAhZXJyb3JNc2dcblx0XHRcdCMg5Yik5pat5qC85byP5piv5ZCm5q2j56GuXG5cdFx0XHR0cnlcblx0XHRcdFx0Q3JlYXRvci5ldmFsKGxvZ2ljLnJlcGxhY2UoL2FuZC9pZywgXCImJlwiKS5yZXBsYWNlKC9vci9pZywgXCJ8fFwiKSlcblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0ZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOS4reWQq+acieeJueauiuWtl+esplwiXG5cblx0XHRcdGlmIC8oQU5EKVteKCldKyhPUikvaWcudGVzdChsb2dpYykgfHwgIC8oT1IpW14oKV0rKEFORCkvaWcudGVzdChsb2dpYylcblx0XHRcdFx0ZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOW/hemhu+WcqOi/nue7reaAp+eahCBBTkQg5ZKMIE9SIOihqOi+vuW8j+WJjeWQjuS9v+eUqOaLrOWPt+OAglwiXG5cdGlmIGVycm9yTXNnXG5cdFx0Y29uc29sZS5sb2cgXCJlcnJvclwiLCBlcnJvck1zZ1xuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0dG9hc3RyLmVycm9yKGVycm9yTXNnKVxuXHRcdHJldHVybiBmYWxzZVxuXHRlbHNlXG5cdFx0cmV0dXJuIHRydWVcblxuIyBcIj1cIiwgXCI8PlwiLCBcIj5cIiwgXCI+PVwiLCBcIjxcIiwgXCI8PVwiLCBcInN0YXJ0c3dpdGhcIiwgXCJjb250YWluc1wiLCBcIm5vdGNvbnRhaW5zXCIuXG4jIyNcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4jIyNcbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvTW9uZ28gPSAoZmlsdGVycywgb3B0aW9ucyktPlxuXHR1bmxlc3MgZmlsdGVycz8ubGVuZ3RoXG5cdFx0cmV0dXJuXG5cdCMg5b2TZmlsdGVyc+S4jeaYr1tBcnJheV3nsbvlnovogIzmmK9bT2JqZWN0Xeexu+Wei+aXtu+8jOi/m+ihjOagvOW8j+i9rOaNolxuXHR1bmxlc3MgZmlsdGVyc1swXSBpbnN0YW5jZW9mIEFycmF5XG5cdFx0ZmlsdGVycyA9IF8ubWFwIGZpbHRlcnMsIChvYmopLT5cblx0XHRcdHJldHVybiBbb2JqLmZpZWxkLCBvYmoub3BlcmF0aW9uLCBvYmoudmFsdWVdXG5cdHNlbGVjdG9yID0gW11cblx0Xy5lYWNoIGZpbHRlcnMsIChmaWx0ZXIpLT5cblx0XHRmaWVsZCA9IGZpbHRlclswXVxuXHRcdG9wdGlvbiA9IGZpbHRlclsxXVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0pXG5cdFx0ZWxzZVxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIG51bGwsIG9wdGlvbnMpXG5cdFx0c3ViX3NlbGVjdG9yID0ge31cblx0XHRzdWJfc2VsZWN0b3JbZmllbGRdID0ge31cblx0XHRpZiBvcHRpb24gPT0gXCI9XCJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZXFcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPD5cIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRuZVwiXSA9IHZhbHVlXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI+XCJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPj1cIlxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndGVcIl0gPSB2YWx1ZVxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPFwiXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGx0XCJdID0gdmFsdWVcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIjw9XCJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRlXCJdID0gdmFsdWVcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcInN0YXJ0c3dpdGhcIlxuXHRcdFx0cmVnID0gbmV3IFJlZ0V4cChcIl5cIiArIHZhbHVlLCBcImlcIilcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWdcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcImNvbnRhaW5zXCJcblx0XHRcdHJlZyA9IG5ldyBSZWdFeHAodmFsdWUsIFwiaVwiKVxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZ1xuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwibm90Y29udGFpbnNcIlxuXHRcdFx0cmVnID0gbmV3IFJlZ0V4cChcIl4oKD8hXCIgKyB2YWx1ZSArIFwiKS4pKiRcIiwgXCJpXCIpXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnXG5cdFx0c2VsZWN0b3IucHVzaCBzdWJfc2VsZWN0b3Jcblx0cmV0dXJuIHNlbGVjdG9yXG5cbkNyZWF0b3IuaXNCZXR3ZWVuRmlsdGVyT3BlcmF0aW9uID0gKG9wZXJhdGlvbiktPlxuXHRyZXR1cm4gb3BlcmF0aW9uID09IFwiYmV0d2VlblwiIG9yICEhQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXModHJ1ZSk/W29wZXJhdGlvbl1cblxuIyMjXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuXHRleHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4jIyNcbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvRGV2ID0gKGZpbHRlcnMsIG9iamVjdF9uYW1lLCBvcHRpb25zKS0+XG5cdHN0ZWVkb3NGaWx0ZXJzID0gcmVxdWlyZShcIkBzdGVlZG9zL2ZpbHRlcnNcIik7XG5cdHVubGVzcyBmaWx0ZXJzLmxlbmd0aFxuXHRcdHJldHVyblxuXHRpZiBvcHRpb25zPy5pc19sb2dpY19vclxuXHRcdCMg5aaC5p6caXNfbG9naWNfb3LkuLp0cnVl77yM5Li6ZmlsdGVyc+esrOS4gOWxguWFg+e0oOWinuWKoG9y6Ze06ZqUXG5cdFx0bG9naWNUZW1wRmlsdGVycyA9IFtdXG5cdFx0ZmlsdGVycy5mb3JFYWNoIChuKS0+XG5cdFx0XHRsb2dpY1RlbXBGaWx0ZXJzLnB1c2gobilcblx0XHRcdGxvZ2ljVGVtcEZpbHRlcnMucHVzaChcIm9yXCIpXG5cdFx0bG9naWNUZW1wRmlsdGVycy5wb3AoKVxuXHRcdGZpbHRlcnMgPSBsb2dpY1RlbXBGaWx0ZXJzXG5cdHNlbGVjdG9yID0gc3RlZWRvc0ZpbHRlcnMuZm9ybWF0RmlsdGVyc1RvRGV2KGZpbHRlcnMsIENyZWF0b3IuVVNFUl9DT05URVhUKVxuXHRyZXR1cm4gc2VsZWN0b3JcblxuIyMjXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuIyMjXG5DcmVhdG9yLmZvcm1hdExvZ2ljRmlsdGVyc1RvRGV2ID0gKGZpbHRlcnMsIGZpbHRlcl9sb2dpYywgb3B0aW9ucyktPlxuXHRmb3JtYXRfbG9naWMgPSBmaWx0ZXJfbG9naWMucmVwbGFjZSgvXFwoXFxzKy9pZywgXCIoXCIpLnJlcGxhY2UoL1xccytcXCkvaWcsIFwiKVwiKS5yZXBsYWNlKC9cXCgvZywgXCJbXCIpLnJlcGxhY2UoL1xcKS9nLCBcIl1cIikucmVwbGFjZSgvXFxzKy9nLCBcIixcIikucmVwbGFjZSgvKGFuZHxvcikvaWcsIFwiJyQxJ1wiKVxuXHRmb3JtYXRfbG9naWMgPSBmb3JtYXRfbG9naWMucmVwbGFjZSgvKFxcZCkrL2lnLCAoeCktPlxuXHRcdF9mID0gZmlsdGVyc1t4LTFdXG5cdFx0ZmllbGQgPSBfZi5maWVsZFxuXHRcdG9wdGlvbiA9IF9mLm9wZXJhdGlvblxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShfZi52YWx1ZSlcblx0XHRlbHNlXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlLCBudWxsLCBvcHRpb25zKVxuXHRcdHN1Yl9zZWxlY3RvciA9IFtdXG5cdFx0aWYgXy5pc0FycmF5KHZhbHVlKSA9PSB0cnVlXG5cdFx0XHRpZiBvcHRpb24gPT0gXCI9XCJcblx0XHRcdFx0Xy5lYWNoIHZhbHVlLCAodiktPlxuXHRcdFx0XHRcdHN1Yl9zZWxlY3Rvci5wdXNoIFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiXG5cdFx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIjw+XCJcblx0XHRcdFx0Xy5lYWNoIHZhbHVlLCAodiktPlxuXHRcdFx0XHRcdHN1Yl9zZWxlY3Rvci5wdXNoIFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJhbmRcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRfLmVhY2ggdmFsdWUsICh2KS0+XG5cdFx0XHRcdFx0c3ViX3NlbGVjdG9yLnB1c2ggW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCJcblx0XHRcdGlmIHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT0gXCJhbmRcIiB8fCBzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09IFwib3JcIlxuXHRcdFx0XHRzdWJfc2VsZWN0b3IucG9wKClcblx0XHRlbHNlXG5cdFx0XHRzdWJfc2VsZWN0b3IgPSBbZmllbGQsIG9wdGlvbiwgdmFsdWVdXG5cdFx0Y29uc29sZS5sb2cgXCJzdWJfc2VsZWN0b3JcIiwgc3ViX3NlbGVjdG9yXG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHN1Yl9zZWxlY3Rvcilcblx0KVxuXHRmb3JtYXRfbG9naWMgPSBcIlsje2Zvcm1hdF9sb2dpY31dXCJcblx0cmV0dXJuIENyZWF0b3IuZXZhbChmb3JtYXRfbG9naWMpXG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cblx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBbXVxuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0aWYgIV9vYmplY3Rcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXNcblxuI1x0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKF9vYmplY3QucmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcblxuXHRyZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKF9vYmplY3QuX2NvbGxlY3Rpb25fbmFtZSlcblxuXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcblx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZXM/Lmxlbmd0aCA9PSAwXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzXG5cblx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHNcblxuXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZSByZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHNcblx0cmV0dXJuIF8uZmlsdGVyIHJlbGF0ZWRfb2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0KS0+XG5cdFx0cmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0Lm9iamVjdF9uYW1lXG5cdFx0aXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTFcblx0XHRhbGxvd1JlYWQgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk/LmFsbG93UmVhZFxuXHRcdHJldHVybiBpc0FjdGl2ZSBhbmQgYWxsb3dSZWFkXG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdE5hbWVzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0cmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRyZXR1cm4gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxuXG5DcmVhdG9yLmdldEFjdGlvbnMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0aWYgIW9ialxuXHRcdHJldHVyblxuXG5cdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRkaXNhYmxlZF9hY3Rpb25zID0gcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9uc1xuXHRhY3Rpb25zID0gXy5zb3J0QnkoXy52YWx1ZXMob2JqLmFjdGlvbnMpICwgJ3NvcnQnKTtcblxuXHRpZiBfLmhhcyhvYmosICdhbGxvd19hY3Rpb25zJylcblx0XHRhY3Rpb25zID0gXy5maWx0ZXIgYWN0aW9ucywgKGFjdGlvbiktPlxuXHRcdFx0cmV0dXJuIF8uaW5jbHVkZShvYmouYWxsb3dfYWN0aW9ucywgYWN0aW9uLm5hbWUpXG5cblx0Xy5lYWNoIGFjdGlvbnMsIChhY3Rpb24pLT5cblx0XHQjIOaJi+acuuS4iuWPquaYvuekuue8lui+keaMiemSru+8jOWFtuS7lueahOaUvuWIsOaKmOWPoOS4i+aLieiPnOWNleS4rVxuXHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJyZWNvcmRcIiwgXCJyZWNvcmRfb25seVwiXS5pbmRleE9mKGFjdGlvbi5vbikgPiAtMSAmJiBhY3Rpb24ubmFtZSAhPSAnc3RhbmRhcmRfZWRpdCdcblx0XHRcdGlmIGFjdGlvbi5vbiA9PSBcInJlY29yZF9vbmx5XCJcblx0XHRcdFx0YWN0aW9uLm9uID0gJ3JlY29yZF9vbmx5X21vcmUnXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGFjdGlvbi5vbiA9ICdyZWNvcmRfbW9yZSdcblxuXHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgJiYgW1wiY21zX2ZpbGVzXCIsIFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIl0uaW5kZXhPZihvYmplY3RfbmFtZSkgPiAtMVxuXHRcdCMg6ZmE5Lu254m55q6K5aSE55CG77yM5LiL6L295oyJ6ZKu5pS+5Zyo5Li76I+c5Y2V77yM57yW6L6R5oyJ6ZKu5pS+5Yiw5bqV5LiL5oqY5Y+g5LiL5ouJ6I+c5Y2V5LitXG5cdFx0YWN0aW9ucy5maW5kKChuKS0+IHJldHVybiBuLm5hbWUgPT0gXCJzdGFuZGFyZF9lZGl0XCIpPy5vbiA9IFwicmVjb3JkX21vcmVcIlxuXHRcdGFjdGlvbnMuZmluZCgobiktPiByZXR1cm4gbi5uYW1lID09IFwiZG93bmxvYWRcIik/Lm9uID0gXCJyZWNvcmRcIlxuXG5cdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XG5cdFx0cmV0dXJuIF8uaW5kZXhPZihkaXNhYmxlZF9hY3Rpb25zLCBhY3Rpb24ubmFtZSkgPCAwXG5cblx0cmV0dXJuIGFjdGlvbnNcblxuLy8vXG5cdOi/lOWbnuW9k+WJjeeUqOaIt+acieadg+mZkOiuv+mXrueahOaJgOaciWxpc3Rfdmlld++8jOWMheaLrOWIhuS6q+eahO+8jOeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahO+8iOmZpOmdnm93bmVy5Y+Y5LqG77yJ77yM5Lul5Y+K6buY6K6k55qE5YW25LuW6KeG5Zu+XG5cdOazqOaEj0NyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mmK/kuI3kvJrmnInnlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTop4blm77nmoTvvIzmiYDku6VDcmVhdG9yLmdldFBlcm1pc3Npb25z5Ye95pWw5Lit5ou/5Yiw55qE57uT5p6c5LiN5YWo77yM5bm25LiN5piv5b2T5YmN55So5oi36IO955yL5Yiw5omA5pyJ6KeG5Zu+XG4vLy9cbkNyZWF0b3IuZ2V0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdGlmICF1c2VySWRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcblx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuXG5cblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0aWYgIW9iamVjdFxuXHRcdHJldHVyblxuXG5cdGRpc2FibGVkX2xpc3Rfdmlld3MgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy5kaXNhYmxlZF9saXN0X3ZpZXdzIHx8IFtdXG5cblx0bGlzdF92aWV3cyA9IFtdXG5cblx0aXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKClcblxuXHRfLmVhY2ggb2JqZWN0Lmxpc3Rfdmlld3MsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpZiBpc01vYmlsZSBhbmQgaXRlbS50eXBlID09IFwiY2FsZW5kYXJcIlxuXHRcdFx0IyDmiYvmnLrkuIrlhYjkuI3mmL7npLrml6Xljobop4blm75cblx0XHRcdHJldHVyblxuXHRcdGlmIGl0ZW1fbmFtZSAhPSBcImRlZmF1bHRcIlxuXHRcdFx0aWYgXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW1fbmFtZSkgPCAwIHx8IGl0ZW0ub3duZXIgPT0gdXNlcklkXG5cdFx0XHRcdGxpc3Rfdmlld3MucHVzaCBpdGVtXG5cblx0cmV0dXJuIGxpc3Rfdmlld3NcblxuIyDliY3lj7DnkIborrrkuIrkuI3lupTor6XosIPnlKjor6Xlh73mlbDvvIzlm6DkuLrlrZfmrrXnmoTmnYPpmZDpg73lnKhDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZmllbGRz55qE55u45YWz5bGe5oCn5Lit5pyJ5qCH6K+G5LqGXG5DcmVhdG9yLmdldEZpZWxkcyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRmaWVsZHNOYW1lID0gQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lKG9iamVjdF9uYW1lKVxuXHR1bnJlYWRhYmxlX2ZpZWxkcyA9ICBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy51bnJlYWRhYmxlX2ZpZWxkc1xuXHRyZXR1cm4gXy5kaWZmZXJlbmNlKGZpZWxkc05hbWUsIHVucmVhZGFibGVfZmllbGRzKVxuXG5DcmVhdG9yLmlzbG9hZGluZyA9ICgpLT5cblx0cmV0dXJuICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZC5nZXQoKVxuXG5DcmVhdG9yLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpXG5cbiMg6K6h566XZmllbGRz55u45YWz5Ye95pWwXG4jIFNUQVJUXG5DcmVhdG9yLmdldERpc2FibGVkRmllbGRzID0gKHNjaGVtYSktPlxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxuXHRcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0uZGlzYWJsZWQgYW5kICFmaWVsZC5hdXRvZm9ybS5vbWl0IGFuZCBmaWVsZE5hbWVcblx0KVxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxuXHRyZXR1cm4gZmllbGRzXG5cbkNyZWF0b3IuZ2V0SGlkZGVuRmllbGRzID0gKHNjaGVtYSktPlxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxuXHRcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0udHlwZSA9PSBcImhpZGRlblwiIGFuZCAhZmllbGQuYXV0b2Zvcm0ub21pdCBhbmQgZmllbGROYW1lXG5cdClcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcblx0cmV0dXJuIGZpZWxkc1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhOb0dyb3VwID0gKHNjaGVtYSktPlxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxuXHRcdHJldHVybiAoIWZpZWxkLmF1dG9mb3JtIG9yICFmaWVsZC5hdXRvZm9ybS5ncm91cCBvciBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PSBcIi1cIikgYW5kICghZmllbGQuYXV0b2Zvcm0gb3IgZmllbGQuYXV0b2Zvcm0udHlwZSAhPSBcImhpZGRlblwiKSBhbmQgZmllbGROYW1lXG5cdClcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcblx0cmV0dXJuIGZpZWxkc1xuXG5DcmVhdG9yLmdldFNvcnRlZEZpZWxkR3JvdXBOYW1lcyA9IChzY2hlbWEpLT5cblx0bmFtZXMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCkgLT5cbiBcdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS5ncm91cCAhPSBcIi1cIiBhbmQgZmllbGQuYXV0b2Zvcm0uZ3JvdXBcblx0KVxuXHRuYW1lcyA9IF8uY29tcGFjdChuYW1lcylcblx0bmFtZXMgPSBfLnVuaXF1ZShuYW1lcylcblx0cmV0dXJuIG5hbWVzXG5cbkNyZWF0b3IuZ2V0RmllbGRzRm9yR3JvdXAgPSAoc2NoZW1hLCBncm91cE5hbWUpIC0+XG4gIFx0ZmllbGRzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQsIGZpZWxkTmFtZSkgLT5cbiAgICBcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT0gZ3JvdXBOYW1lIGFuZCBmaWVsZC5hdXRvZm9ybS50eXBlICE9IFwiaGlkZGVuXCIgYW5kIGZpZWxkTmFtZVxuICBcdClcbiAgXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxuICBcdHJldHVybiBmaWVsZHNcblxuQ3JlYXRvci5nZXRGaWVsZHNXaXRob3V0T21pdCA9IChzY2hlbWEsIGtleXMpIC0+XG5cdGtleXMgPSBfLm1hcChrZXlzLCAoa2V5KSAtPlxuXHRcdGZpZWxkID0gXy5waWNrKHNjaGVtYSwga2V5KVxuXHRcdGlmIGZpZWxkW2tleV0uYXV0b2Zvcm0/Lm9taXRcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBrZXlcblx0KVxuXHRrZXlzID0gXy5jb21wYWN0KGtleXMpXG5cdHJldHVybiBrZXlzXG5cbkNyZWF0b3IuZ2V0RmllbGRzSW5GaXJzdExldmVsID0gKGZpcnN0TGV2ZWxLZXlzLCBrZXlzKSAtPlxuXHRrZXlzID0gXy5tYXAoa2V5cywgKGtleSkgLT5cblx0XHRpZiBfLmluZGV4T2YoZmlyc3RMZXZlbEtleXMsIGtleSkgPiAtMVxuXHRcdFx0cmV0dXJuIGtleVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBmYWxzZVxuXHQpXG5cdGtleXMgPSBfLmNvbXBhY3Qoa2V5cylcblx0cmV0dXJuIGtleXNcblxuQ3JlYXRvci5nZXRGaWVsZHNGb3JSZW9yZGVyID0gKHNjaGVtYSwga2V5cywgaXNTaW5nbGUpIC0+XG5cdGZpZWxkcyA9IFtdXG5cdGkgPSAwXG5cdF9rZXlzID0gXy5maWx0ZXIoa2V5cywgKGtleSktPlxuXHRcdHJldHVybiAha2V5LmVuZHNXaXRoKCdfZW5kTGluZScpXG5cdCk7XG5cdHdoaWxlIGkgPCBfa2V5cy5sZW5ndGhcblx0XHRzY18xID0gXy5waWNrKHNjaGVtYSwgX2tleXNbaV0pXG5cdFx0c2NfMiA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2krMV0pXG5cblx0XHRpc193aWRlXzEgPSBmYWxzZVxuXHRcdGlzX3dpZGVfMiA9IGZhbHNlXG5cbiNcdFx0aXNfcmFuZ2VfMSA9IGZhbHNlXG4jXHRcdGlzX3JhbmdlXzIgPSBmYWxzZVxuXG5cdFx0Xy5lYWNoIHNjXzEsICh2YWx1ZSkgLT5cblx0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc193aWRlIHx8IHZhbHVlLmF1dG9mb3JtPy50eXBlID09IFwidGFibGVcIlxuXHRcdFx0XHRpc193aWRlXzEgPSB0cnVlXG5cbiNcdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfcmFuZ2VcbiNcdFx0XHRcdGlzX3JhbmdlXzEgPSB0cnVlXG5cblx0XHRfLmVhY2ggc2NfMiwgKHZhbHVlKSAtPlxuXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3dpZGUgfHwgdmFsdWUuYXV0b2Zvcm0/LnR5cGUgPT0gXCJ0YWJsZVwiXG5cdFx0XHRcdGlzX3dpZGVfMiA9IHRydWVcblxuI1x0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc19yYW5nZVxuI1x0XHRcdFx0aXNfcmFuZ2VfMiA9IHRydWVcblxuXHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0aXNfd2lkZV8xID0gdHJ1ZVxuXHRcdFx0aXNfd2lkZV8yID0gdHJ1ZVxuXG5cdFx0aWYgaXNTaW5nbGVcblx0XHRcdGZpZWxkcy5wdXNoIF9rZXlzLnNsaWNlKGksIGkrMSlcblx0XHRcdGkgKz0gMVxuXHRcdGVsc2VcbiNcdFx0XHRpZiAhaXNfcmFuZ2VfMSAmJiBpc19yYW5nZV8yXG4jXHRcdFx0XHRjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpKzEpXG4jXHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcbiNcdFx0XHRcdGZpZWxkcy5wdXNoIGNoaWxkS2V5c1xuI1x0XHRcdFx0aSArPSAxXG4jXHRcdFx0ZWxzZVxuXHRcdFx0aWYgaXNfd2lkZV8xXG5cdFx0XHRcdGZpZWxkcy5wdXNoIF9rZXlzLnNsaWNlKGksIGkrMSlcblx0XHRcdFx0aSArPSAxXG5cdFx0XHRlbHNlIGlmICFpc193aWRlXzEgYW5kIGlzX3dpZGVfMlxuXHRcdFx0XHRjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpKzEpXG5cdFx0XHRcdGNoaWxkS2V5cy5wdXNoIHVuZGVmaW5lZFxuXHRcdFx0XHRmaWVsZHMucHVzaCBjaGlsZEtleXNcblx0XHRcdFx0aSArPSAxXG5cdFx0XHRlbHNlIGlmICFpc193aWRlXzEgYW5kICFpc193aWRlXzJcblx0XHRcdFx0Y2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSsxKVxuXHRcdFx0XHRpZiBfa2V5c1tpKzFdXG5cdFx0XHRcdFx0Y2hpbGRLZXlzLnB1c2ggX2tleXNbaSsxXVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0Y2hpbGRLZXlzLnB1c2ggdW5kZWZpbmVkXG5cdFx0XHRcdGZpZWxkcy5wdXNoIGNoaWxkS2V5c1xuXHRcdFx0XHRpICs9IDJcblxuXHRyZXR1cm4gZmllbGRzXG5cbkNyZWF0b3IuaXNGaWx0ZXJWYWx1ZUVtcHR5ID0gKHYpIC0+XG5cdHJldHVybiB0eXBlb2YgdiA9PSBcInVuZGVmaW5lZFwiIHx8IHYgPT0gbnVsbCB8fCBOdW1iZXIuaXNOYU4odikgfHwgdi5sZW5ndGggPT0gMFxuXG5DcmVhdG9yLmdldEZpZWxkRGF0YVR5cGUgPSAob2JqZWN0RmllbGRzLCBrZXkpLT5cblx0aWYgb2JqZWN0RmllbGRzIGFuZCBrZXlcblx0XHRyZXN1bHQgPSBvYmplY3RGaWVsZHNba2V5XT8udHlwZVxuXHRcdGlmIFtcImZvcm11bGFcIiwgXCJzdW1tYXJ5XCJdLmluZGV4T2YocmVzdWx0KSA+IC0xXG5cdFx0XHRyZXN1bHQgPSBvYmplY3RGaWVsZHNba2V5XS5kYXRhX3R5cGVcblx0XHRyZXR1cm4gcmVzdWx0XG5cdGVsc2Vcblx0XHRyZXR1cm4gXCJ0ZXh0XCJcblxuIyBFTkRcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdENyZWF0b3IuZ2V0QWxsUmVsYXRlZE9iamVjdHMgPSAob2JqZWN0X25hbWUpLT5cblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdXG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XG5cdFx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3QuZmllbGRzLCAocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKS0+XG5cdFx0XHRcdGlmIHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lXG5cdFx0XHRcdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMucHVzaCByZWxhdGVkX29iamVjdF9uYW1lXG5cblx0XHRpZiBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZW5hYmxlX2ZpbGVzXG5cdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoIFwiY21zX2ZpbGVzXCJcblxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcyIsIkNyZWF0b3IuZ2V0U2NoZW1hID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuc2NoZW1hIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RIb21lQ29tcG9uZW50ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHJldHVybiBSZWFjdFN0ZWVkb3MucGx1Z2luQ29tcG9uZW50U2VsZWN0b3IoUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCksIFwiT2JqZWN0SG9tZVwiLCBvYmplY3RfbmFtZSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSB7XG4gIHZhciBsaXN0X3ZpZXcsIGxpc3Rfdmlld19pZDtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpO1xuICBsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5faWQgOiB2b2lkIDA7XG4gIGlmIChyZWNvcmRfaWQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZCk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBcIm1lZXRpbmdcIikge1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKENyZWF0b3IuZ2V0T2JqZWN0SG9tZUNvbXBvbmVudChvYmplY3RfbmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEFic29sdXRlVXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSB7XG4gIHZhciBsaXN0X3ZpZXcsIGxpc3Rfdmlld19pZDtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpO1xuICBsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5faWQgOiB2b2lkIDA7XG4gIGlmIChyZWNvcmRfaWQpIHtcbiAgICByZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZCwgdHJ1ZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBcIm1lZXRpbmdcIikge1xuICAgICAgcmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQsIHRydWUpO1xuICAgIH1cbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSb3V0ZXJVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIHtcbiAgdmFyIGxpc3RfdmlldywgbGlzdF92aWV3X2lkO1xuICBpZiAoIWFwcF9pZCkge1xuICAgIGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICB9XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgbGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbCk7XG4gIGxpc3Rfdmlld19pZCA9IGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Ll9pZCA6IHZvaWQgMDtcbiAgaWYgKHJlY29yZF9pZCkge1xuICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZDtcbiAgfSBlbHNlIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwibWVldGluZ1wiKSB7XG4gICAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQ7XG4gICAgfVxuICB9XG59O1xuXG5DcmVhdG9yLmdldExpc3RWaWV3VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSB7XG4gIHZhciB1cmw7XG4gIHVybCA9IENyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpO1xuICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCh1cmwpO1xufTtcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSB7XG4gIGlmIChsaXN0X3ZpZXdfaWQgPT09IFwiY2FsZW5kYXJcIikge1xuICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFN3aXRjaExpc3RVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIHtcbiAgaWYgKGxpc3Rfdmlld19pZCkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIGxpc3Rfdmlld19pZCArIFwiL2xpc3RcIik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2xpc3Qvc3dpdGNoXCIpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYXBwX2lkLCByZWNvcmRfaWQsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgcmVjb3JkX2lkICsgXCIvXCIgKyByZWxhdGVkX29iamVjdF9uYW1lICsgXCIvZ3JpZFwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0TG9va3VwRmllbGRPcHRpb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGlzX2RlZXAsIGlzX3NraXBfaGlkZSwgaXNfcmVsYXRlZCkge1xuICB2YXIgX29iamVjdCwgX29wdGlvbnMsIGZpZWxkcywgaWNvbiwgcmVsYXRlZE9iamVjdHM7XG4gIF9vcHRpb25zID0gW107XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gX29wdGlvbnM7XG4gIH1cbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIGljb24gPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDA7XG4gIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICBpZiAoaXNfc2tpcF9oaWRlICYmIGYuaGlkZGVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChmLnR5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgbGFiZWw6IFwiXCIgKyAoZi5sYWJlbCB8fCBrKSxcbiAgICAgICAgdmFsdWU6IFwiXCIgKyBrLFxuICAgICAgICBpY29uOiBpY29uXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICBsYWJlbDogZi5sYWJlbCB8fCBrLFxuICAgICAgICB2YWx1ZTogayxcbiAgICAgICAgaWNvbjogaWNvblxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgaWYgKGlzX2RlZXApIHtcbiAgICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgICB2YXIgcl9vYmplY3Q7XG4gICAgICBpZiAoaXNfc2tpcF9oaWRlICYmIGYuaGlkZGVuKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICgoZi50eXBlID09PSBcImxvb2t1cFwiIHx8IGYudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpICYmIGYucmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcoZi5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIHJfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoZi5yZWZlcmVuY2VfdG8pO1xuICAgICAgICBpZiAocl9vYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZjIsIGsyKSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiAoZi5sYWJlbCB8fCBrKSArIFwiPT5cIiArIChmMi5sYWJlbCB8fCBrMiksXG4gICAgICAgICAgICAgIHZhbHVlOiBrICsgXCIuXCIgKyBrMixcbiAgICAgICAgICAgICAgaWNvbjogcl9vYmplY3QgIT0gbnVsbCA/IHJfb2JqZWN0Lmljb24gOiB2b2lkIDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaWYgKGlzX3JlbGF0ZWQpIHtcbiAgICByZWxhdGVkT2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpO1xuICAgIF8uZWFjaChyZWxhdGVkT2JqZWN0cywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oX3JlbGF0ZWRPYmplY3QpIHtcbiAgICAgICAgdmFyIHJlbGF0ZWRPYmplY3QsIHJlbGF0ZWRPcHRpb25zO1xuICAgICAgICByZWxhdGVkT3B0aW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0TG9va3VwRmllbGRPcHRpb25zKF9yZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcmVsYXRlZE9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9yZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lKTtcbiAgICAgICAgcmV0dXJuIF8uZWFjaChyZWxhdGVkT3B0aW9ucywgZnVuY3Rpb24ocmVsYXRlZE9wdGlvbikge1xuICAgICAgICAgIGlmIChfcmVsYXRlZE9iamVjdC5mb3JlaWduX2tleSAhPT0gcmVsYXRlZE9wdGlvbi52YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgICBsYWJlbDogKHJlbGF0ZWRPYmplY3QubGFiZWwgfHwgcmVsYXRlZE9iamVjdC5uYW1lKSArIFwiPT5cIiArIHJlbGF0ZWRPcHRpb24ubGFiZWwsXG4gICAgICAgICAgICAgIHZhbHVlOiByZWxhdGVkT2JqZWN0Lm5hbWUgKyBcIi5cIiArIHJlbGF0ZWRPcHRpb24udmFsdWUsXG4gICAgICAgICAgICAgIGljb246IHJlbGF0ZWRPYmplY3QgIT0gbnVsbCA/IHJlbGF0ZWRPYmplY3QuaWNvbiA6IHZvaWQgMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9XG4gIHJldHVybiBfb3B0aW9ucztcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmlsdGVyRmllbGRPcHRpb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIF9vYmplY3QsIF9vcHRpb25zLCBmaWVsZHMsIGljb24sIHBlcm1pc3Npb25fZmllbGRzO1xuICBfb3B0aW9ucyA9IFtdO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIF9vcHRpb25zO1xuICB9XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZmllbGRzIDogdm9pZCAwO1xuICBwZXJtaXNzaW9uX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKG9iamVjdF9uYW1lKTtcbiAgaWNvbiA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMDtcbiAgXy5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZiwgaykge1xuICAgIGlmICghXy5pbmNsdWRlKFtcImdyaWRcIiwgXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwiYXZhdGFyXCIsIFwiaW1hZ2VcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSkgJiYgIWYuaGlkZGVuKSB7XG4gICAgICBpZiAoIS9cXHcrXFwuLy50ZXN0KGspICYmIF8uaW5kZXhPZihwZXJtaXNzaW9uX2ZpZWxkcywgaykgPiAtMSkge1xuICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgbGFiZWw6IGYubGFiZWwgfHwgayxcbiAgICAgICAgICB2YWx1ZTogayxcbiAgICAgICAgICBpY29uOiBpY29uXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBfb3B0aW9ucztcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRPcHRpb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIF9vYmplY3QsIF9vcHRpb25zLCBmaWVsZHMsIGljb24sIHBlcm1pc3Npb25fZmllbGRzO1xuICBfb3B0aW9ucyA9IFtdO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIF9vcHRpb25zO1xuICB9XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZmllbGRzIDogdm9pZCAwO1xuICBwZXJtaXNzaW9uX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKG9iamVjdF9uYW1lKTtcbiAgaWNvbiA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMDtcbiAgXy5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZiwgaykge1xuICAgIGlmICghXy5pbmNsdWRlKFtcImdyaWRcIiwgXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwiYXZhdGFyXCIsIFwiaW1hZ2VcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSkpIHtcbiAgICAgIGlmICghL1xcdytcXC4vLnRlc3QoaykgJiYgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICBsYWJlbDogZi5sYWJlbCB8fCBrLFxuICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgIGljb246IGljb25cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIF9vcHRpb25zO1xufTtcblxuXG4vKlxuZmlsdGVyczog6KaB6L2s5o2i55qEZmlsdGVyc1xuZmllbGRzOiDlr7nosaHlrZfmrrVcbmZpbHRlcl9maWVsZHM6IOm7mOiupOi/h+a7pOWtl+aute+8jOaUr+aMgeWtl+espuS4suaVsOe7hOWSjOWvueixoeaVsOe7hOS4pOenjeagvOW8j++8jOWmgjpbJ2ZpbGVkX25hbWUxJywnZmlsZWRfbmFtZTInXSxbe2ZpZWxkOidmaWxlZF9uYW1lMScscmVxdWlyZWQ6dHJ1ZX1dXG7lpITnkIbpgLvovpE6IOaKimZpbHRlcnPkuK3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25aKe5Yqg5q+P6aG555qEaXNfZGVmYXVsdOOAgWlzX3JlcXVpcmVk5bGe5oCn77yM5LiN5a2Y5Zyo5LqOZmlsdGVyX2ZpZWxkc+eahOi/h+a7pOadoeS7tuWvueW6lOeahOenu+mZpOavj+mhueeahOebuOWFs+WxnuaAp1xu6L+U5Zue57uT5p6cOiDlpITnkIblkI7nmoRmaWx0ZXJzXG4gKi9cblxuQ3JlYXRvci5nZXRGaWx0ZXJzV2l0aEZpbHRlckZpZWxkcyA9IGZ1bmN0aW9uKGZpbHRlcnMsIGZpZWxkcywgZmlsdGVyX2ZpZWxkcykge1xuICBpZiAoIWZpbHRlcnMpIHtcbiAgICBmaWx0ZXJzID0gW107XG4gIH1cbiAgaWYgKCFmaWx0ZXJfZmllbGRzKSB7XG4gICAgZmlsdGVyX2ZpZWxkcyA9IFtdO1xuICB9XG4gIGlmIChmaWx0ZXJfZmllbGRzICE9IG51bGwgPyBmaWx0ZXJfZmllbGRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgIGZpbHRlcl9maWVsZHMuZm9yRWFjaChmdW5jdGlvbihuKSB7XG4gICAgICBpZiAoXy5pc1N0cmluZyhuKSkge1xuICAgICAgICBuID0ge1xuICAgICAgICAgIGZpZWxkOiBuLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKGZpZWxkc1tuLmZpZWxkXSAmJiAhXy5maW5kV2hlcmUoZmlsdGVycywge1xuICAgICAgICBmaWVsZDogbi5maWVsZFxuICAgICAgfSkpIHtcbiAgICAgICAgcmV0dXJuIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgZmllbGQ6IG4uZmllbGQsXG4gICAgICAgICAgaXNfZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICBpc19yZXF1aXJlZDogbi5yZXF1aXJlZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBmaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24oZmlsdGVySXRlbSkge1xuICAgIHZhciBtYXRjaEZpZWxkO1xuICAgIG1hdGNoRmllbGQgPSBmaWx0ZXJfZmllbGRzLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4gPT09IGZpbHRlckl0ZW0uZmllbGQgfHwgbi5maWVsZCA9PT0gZmlsdGVySXRlbS5maWVsZDtcbiAgICB9KTtcbiAgICBpZiAoXy5pc1N0cmluZyhtYXRjaEZpZWxkKSkge1xuICAgICAgbWF0Y2hGaWVsZCA9IHtcbiAgICAgICAgZmllbGQ6IG1hdGNoRmllbGQsXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKG1hdGNoRmllbGQpIHtcbiAgICAgIGZpbHRlckl0ZW0uaXNfZGVmYXVsdCA9IHRydWU7XG4gICAgICByZXR1cm4gZmlsdGVySXRlbS5pc19yZXF1aXJlZCA9IG1hdGNoRmllbGQucmVxdWlyZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBmaWx0ZXJJdGVtLmlzX2RlZmF1bHQ7XG4gICAgICByZXR1cm4gZGVsZXRlIGZpbHRlckl0ZW0uaXNfcmVxdWlyZWQ7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZpbHRlcnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZCkge1xuICB2YXIgY29sbGVjdGlvbiwgcmVjb3JkLCByZWYsIHJlZjEsIHJlZjI7XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKCFyZWNvcmRfaWQpIHtcbiAgICByZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpICYmIHJlY29yZF9pZCA9PT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikpIHtcbiAgICAgIGlmICgocmVmID0gVGVtcGxhdGUuaW5zdGFuY2UoKSkgIT0gbnVsbCA/IHJlZi5yZWNvcmQgOiB2b2lkIDApIHtcbiAgICAgICAgcmV0dXJuIChyZWYxID0gVGVtcGxhdGUuaW5zdGFuY2UoKSkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5yZWNvcmQpICE9IG51bGwgPyByZWYyLmdldCgpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKTtcbiAgICB9XG4gIH1cbiAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSk7XG4gIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgcmVjb3JkID0gY29sbGVjdGlvbi5maW5kT25lKHJlY29yZF9pZCk7XG4gICAgcmV0dXJuIHJlY29yZDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSZWNvcmROYW1lID0gZnVuY3Rpb24ocmVjb3JkLCBvYmplY3RfbmFtZSkge1xuICB2YXIgbmFtZV9maWVsZF9rZXksIHJlZjtcbiAgaWYgKCFyZWNvcmQpIHtcbiAgICByZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpO1xuICB9XG4gIGlmIChyZWNvcmQpIHtcbiAgICBuYW1lX2ZpZWxkX2tleSA9IG9iamVjdF9uYW1lID09PSBcIm9yZ2FuaXphdGlvbnNcIiA/IFwibmFtZVwiIDogKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5OQU1FX0ZJRUxEX0tFWSA6IHZvaWQgMDtcbiAgICBpZiAocmVjb3JkICYmIG5hbWVfZmllbGRfa2V5KSB7XG4gICAgICByZXR1cm4gcmVjb3JkLmxhYmVsIHx8IHJlY29yZFtuYW1lX2ZpZWxkX2tleV07XG4gICAgfVxuICB9XG59O1xuXG5DcmVhdG9yLmdldEFwcCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwLCByZWYsIHJlZjE7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgYXBwID0gQ3JlYXRvci5BcHBzW2FwcF9pZF07XG4gIGlmICgocmVmID0gQ3JlYXRvci5kZXBzKSAhPSBudWxsKSB7XG4gICAgaWYgKChyZWYxID0gcmVmLmFwcCkgIT0gbnVsbCkge1xuICAgICAgcmVmMS5kZXBlbmQoKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFwcDtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIGRhc2hib2FyZDtcbiAgYXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKTtcbiAgaWYgKCFhcHApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZGFzaGJvYXJkID0gbnVsbDtcbiAgXy5lYWNoKENyZWF0b3IuRGFzaGJvYXJkcywgZnVuY3Rpb24odiwgaykge1xuICAgIHZhciByZWY7XG4gICAgaWYgKCgocmVmID0gdi5hcHBzKSAhPSBudWxsID8gcmVmLmluZGV4T2YoYXBwLl9pZCkgOiB2b2lkIDApID4gLTEpIHtcbiAgICAgIHJldHVybiBkYXNoYm9hcmQgPSB2O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkYXNoYm9hcmQ7XG59O1xuXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZENvbXBvbmVudCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCkge1xuICAgIHJldHVybjtcbiAgfVxuICByZXR1cm4gUmVhY3RTdGVlZG9zLnBsdWdpbkNvbXBvbmVudFNlbGVjdG9yKFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLCBcIkRhc2hib2FyZFwiLCBhcHAuX2lkKTtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwT2JqZWN0TmFtZXMgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgdmFyIGFwcCwgYXBwT2JqZWN0cywgaXNNb2JpbGUsIG9iamVjdHM7XG4gIGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZCk7XG4gIGlmICghYXBwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpO1xuICBhcHBPYmplY3RzID0gaXNNb2JpbGUgPyBhcHAubW9iaWxlX29iamVjdHMgOiBhcHAub2JqZWN0cztcbiAgb2JqZWN0cyA9IFtdO1xuICBpZiAoYXBwKSB7XG4gICAgXy5lYWNoKGFwcE9iamVjdHMsIGZ1bmN0aW9uKHYpIHtcbiAgICAgIHZhciBvYmo7XG4gICAgICBvYmogPSBDcmVhdG9yLmdldE9iamVjdCh2KTtcbiAgICAgIGlmIChvYmogIT0gbnVsbCA/IG9iai5wZXJtaXNzaW9ucy5nZXQoKS5hbGxvd1JlYWQgOiB2b2lkIDApIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdHMucHVzaCh2KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb2JqZWN0cztcbn07XG5cbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHMgPSBmdW5jdGlvbihpbmNsdWRlQWRtaW4pIHtcbiAgdmFyIGNoYW5nZUFwcDtcbiAgY2hhbmdlQXBwID0gQ3JlYXRvci5fc3ViQXBwLmdldCgpO1xuICBSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKS5lbnRpdGllcy5hcHBzID0gT2JqZWN0LmFzc2lnbih7fSwgUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCkuZW50aXRpZXMuYXBwcywge1xuICAgIGFwcHM6IGNoYW5nZUFwcFxuICB9KTtcbiAgcmV0dXJuIFJlYWN0U3RlZWRvcy52aXNpYmxlQXBwc1NlbGVjdG9yKFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLCBpbmNsdWRlQWRtaW4pO1xufTtcblxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwc09iamVjdHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGFwcHMsIG9iamVjdHMsIHZpc2libGVPYmplY3ROYW1lcztcbiAgYXBwcyA9IENyZWF0b3IuZ2V0VmlzaWJsZUFwcHMoKTtcbiAgdmlzaWJsZU9iamVjdE5hbWVzID0gXy5mbGF0dGVuKF8ucGx1Y2soYXBwcywgJ29iamVjdHMnKSk7XG4gIG9iamVjdHMgPSBfLmZpbHRlcihDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICh2aXNpYmxlT2JqZWN0TmFtZXMuaW5kZXhPZihvYmoubmFtZSkgPCAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIG9iamVjdHMgPSBvYmplY3RzLnNvcnQoQ3JlYXRvci5zb3J0aW5nTWV0aG9kLmJpbmQoe1xuICAgIGtleTogXCJsYWJlbFwiXG4gIH0pKTtcbiAgb2JqZWN0cyA9IF8ucGx1Y2sob2JqZWN0cywgJ25hbWUnKTtcbiAgcmV0dXJuIF8udW5pcShvYmplY3RzKTtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwc09iamVjdHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG9iamVjdHMsIHRlbXBPYmplY3RzO1xuICBvYmplY3RzID0gW107XG4gIHRlbXBPYmplY3RzID0gW107XG4gIF8uZm9yRWFjaChDcmVhdG9yLkFwcHMsIGZ1bmN0aW9uKGFwcCkge1xuICAgIHRlbXBPYmplY3RzID0gXy5maWx0ZXIoYXBwLm9iamVjdHMsIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuICFvYmouaGlkZGVuO1xuICAgIH0pO1xuICAgIHJldHVybiBvYmplY3RzID0gb2JqZWN0cy5jb25jYXQodGVtcE9iamVjdHMpO1xuICB9KTtcbiAgcmV0dXJuIF8udW5pcShvYmplY3RzKTtcbn07XG5cbkNyZWF0b3IudmFsaWRhdGVGaWx0ZXJzID0gZnVuY3Rpb24oZmlsdGVycywgbG9naWMpIHtcbiAgdmFyIGUsIGVycm9yTXNnLCBmaWx0ZXJfaXRlbXMsIGZpbHRlcl9sZW5ndGgsIGZsYWcsIGluZGV4LCB3b3JkO1xuICBmaWx0ZXJfaXRlbXMgPSBfLm1hcChmaWx0ZXJzLCBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoXy5pc0VtcHR5KG9iaikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gIH0pO1xuICBmaWx0ZXJfaXRlbXMgPSBfLmNvbXBhY3QoZmlsdGVyX2l0ZW1zKTtcbiAgZXJyb3JNc2cgPSBcIlwiO1xuICBmaWx0ZXJfbGVuZ3RoID0gZmlsdGVyX2l0ZW1zLmxlbmd0aDtcbiAgaWYgKGxvZ2ljKSB7XG4gICAgbG9naWMgPSBsb2dpYy5yZXBsYWNlKC9cXG4vZywgXCJcIikucmVwbGFjZSgvXFxzKy9nLCBcIiBcIik7XG4gICAgaWYgKC9bLl9cXC0hK10rL2lnLnRlc3QobG9naWMpKSB7XG4gICAgICBlcnJvck1zZyA9IFwi5ZCr5pyJ54m55q6K5a2X56ym44CCXCI7XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIGluZGV4ID0gbG9naWMubWF0Y2goL1xcZCsvaWcpO1xuICAgICAgaWYgKCFpbmRleCkge1xuICAgICAgICBlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleC5mb3JFYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICBpZiAoaSA8IDEgfHwgaSA+IGZpbHRlcl9sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5p2h5Lu25byV55So5LqG5pyq5a6a5LmJ55qE562b6YCJ5Zmo77yaXCIgKyBpICsgXCLjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmbGFnID0gMTtcbiAgICAgICAgd2hpbGUgKGZsYWcgPD0gZmlsdGVyX2xlbmd0aCkge1xuICAgICAgICAgIGlmICghaW5kZXguaW5jbHVkZXMoXCJcIiArIGZsYWcpKSB7XG4gICAgICAgICAgICBlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZsYWcrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWVycm9yTXNnKSB7XG4gICAgICB3b3JkID0gbG9naWMubWF0Y2goL1thLXpBLVpdKy9pZyk7XG4gICAgICBpZiAod29yZCkge1xuICAgICAgICB3b3JkLmZvckVhY2goZnVuY3Rpb24odykge1xuICAgICAgICAgIGlmICghL14oYW5kfG9yKSQvaWcudGVzdCh3KSkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yTXNnID0gXCLmo4Dmn6XmgqjnmoTpq5jnuqfnrZvpgInmnaHku7bkuK3nmoTmi7zlhpnjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWVycm9yTXNnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBDcmVhdG9yW1wiZXZhbFwiXShsb2dpYy5yZXBsYWNlKC9hbmQvaWcsIFwiJiZcIikucmVwbGFjZSgvb3IvaWcsIFwifHxcIikpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5Lit5ZCr5pyJ54m55q6K5a2X56ymXCI7XG4gICAgICB9XG4gICAgICBpZiAoLyhBTkQpW14oKV0rKE9SKS9pZy50ZXN0KGxvZ2ljKSB8fCAvKE9SKVteKCldKyhBTkQpL2lnLnRlc3QobG9naWMpKSB7XG4gICAgICAgIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajlv4XpobvlnKjov57nu63mgKfnmoQgQU5EIOWSjCBPUiDooajovr7lvI/liY3lkI7kvb/nlKjmi6zlj7fjgIJcIjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKGVycm9yTXNnKSB7XG4gICAgY29uc29sZS5sb2coXCJlcnJvclwiLCBlcnJvck1zZyk7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdG9hc3RyLmVycm9yKGVycm9yTXNnKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuICovXG5cbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvTW9uZ28gPSBmdW5jdGlvbihmaWx0ZXJzLCBvcHRpb25zKSB7XG4gIHZhciBzZWxlY3RvcjtcbiAgaWYgKCEoZmlsdGVycyAhPSBudWxsID8gZmlsdGVycy5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghKGZpbHRlcnNbMF0gaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICBmaWx0ZXJzID0gXy5tYXAoZmlsdGVycywgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gW29iai5maWVsZCwgb2JqLm9wZXJhdGlvbiwgb2JqLnZhbHVlXTtcbiAgICB9KTtcbiAgfVxuICBzZWxlY3RvciA9IFtdO1xuICBfLmVhY2goZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIGZpZWxkLCBvcHRpb24sIHJlZywgc3ViX3NlbGVjdG9yLCB2YWx1ZTtcbiAgICBmaWVsZCA9IGZpbHRlclswXTtcbiAgICBvcHRpb24gPSBmaWx0ZXJbMV07XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgbnVsbCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHN1Yl9zZWxlY3RvciA9IHt9O1xuICAgIHN1Yl9zZWxlY3RvcltmaWVsZF0gPSB7fTtcbiAgICBpZiAob3B0aW9uID09PSBcIj1cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRlcVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjw+XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbmVcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI+XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI+PVwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGd0ZVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjxcIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdFwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjw9XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRlXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwic3RhcnRzd2l0aFwiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKFwiXlwiICsgdmFsdWUsIFwiaVwiKTtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWc7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiY29udGFpbnNcIikge1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cCh2YWx1ZSwgXCJpXCIpO1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJub3Rjb250YWluc1wiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKFwiXigoPyFcIiArIHZhbHVlICsgXCIpLikqJFwiLCBcImlcIik7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnO1xuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3IucHVzaChzdWJfc2VsZWN0b3IpO1xuICB9KTtcbiAgcmV0dXJuIHNlbGVjdG9yO1xufTtcblxuQ3JlYXRvci5pc0JldHdlZW5GaWx0ZXJPcGVyYXRpb24gPSBmdW5jdGlvbihvcGVyYXRpb24pIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIG9wZXJhdGlvbiA9PT0gXCJiZXR3ZWVuXCIgfHwgISEoKHJlZiA9IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKHRydWUpKSAhPSBudWxsID8gcmVmW29wZXJhdGlvbl0gOiB2b2lkIDApO1xufTtcblxuXG4vKlxub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcblx0ZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuICovXG5cbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvRGV2ID0gZnVuY3Rpb24oZmlsdGVycywgb2JqZWN0X25hbWUsIG9wdGlvbnMpIHtcbiAgdmFyIGxvZ2ljVGVtcEZpbHRlcnMsIHNlbGVjdG9yLCBzdGVlZG9zRmlsdGVycztcbiAgc3RlZWRvc0ZpbHRlcnMgPSByZXF1aXJlKFwiQHN0ZWVkb3MvZmlsdGVyc1wiKTtcbiAgaWYgKCFmaWx0ZXJzLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5pc19sb2dpY19vciA6IHZvaWQgMCkge1xuICAgIGxvZ2ljVGVtcEZpbHRlcnMgPSBbXTtcbiAgICBmaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24obikge1xuICAgICAgbG9naWNUZW1wRmlsdGVycy5wdXNoKG4pO1xuICAgICAgcmV0dXJuIGxvZ2ljVGVtcEZpbHRlcnMucHVzaChcIm9yXCIpO1xuICAgIH0pO1xuICAgIGxvZ2ljVGVtcEZpbHRlcnMucG9wKCk7XG4gICAgZmlsdGVycyA9IGxvZ2ljVGVtcEZpbHRlcnM7XG4gIH1cbiAgc2VsZWN0b3IgPSBzdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9EZXYoZmlsdGVycywgQ3JlYXRvci5VU0VSX0NPTlRFWFQpO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuICovXG5cbkNyZWF0b3IuZm9ybWF0TG9naWNGaWx0ZXJzVG9EZXYgPSBmdW5jdGlvbihmaWx0ZXJzLCBmaWx0ZXJfbG9naWMsIG9wdGlvbnMpIHtcbiAgdmFyIGZvcm1hdF9sb2dpYztcbiAgZm9ybWF0X2xvZ2ljID0gZmlsdGVyX2xvZ2ljLnJlcGxhY2UoL1xcKFxccysvaWcsIFwiKFwiKS5yZXBsYWNlKC9cXHMrXFwpL2lnLCBcIilcIikucmVwbGFjZSgvXFwoL2csIFwiW1wiKS5yZXBsYWNlKC9cXCkvZywgXCJdXCIpLnJlcGxhY2UoL1xccysvZywgXCIsXCIpLnJlcGxhY2UoLyhhbmR8b3IpL2lnLCBcIickMSdcIik7XG4gIGZvcm1hdF9sb2dpYyA9IGZvcm1hdF9sb2dpYy5yZXBsYWNlKC8oXFxkKSsvaWcsIGZ1bmN0aW9uKHgpIHtcbiAgICB2YXIgX2YsIGZpZWxkLCBvcHRpb24sIHN1Yl9zZWxlY3RvciwgdmFsdWU7XG4gICAgX2YgPSBmaWx0ZXJzW3ggLSAxXTtcbiAgICBmaWVsZCA9IF9mLmZpZWxkO1xuICAgIG9wdGlvbiA9IF9mLm9wZXJhdGlvbjtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShfZi52YWx1ZSwgbnVsbCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHN1Yl9zZWxlY3RvciA9IFtdO1xuICAgIGlmIChfLmlzQXJyYXkodmFsdWUpID09PSB0cnVlKSB7XG4gICAgICBpZiAob3B0aW9uID09PSBcIj1cIikge1xuICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4gc3ViX3NlbGVjdG9yLnB1c2goW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjw+XCIpIHtcbiAgICAgICAgXy5lYWNoKHZhbHVlLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIHN1Yl9zZWxlY3Rvci5wdXNoKFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJhbmRcIik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgXy5lYWNoKHZhbHVlLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIHN1Yl9zZWxlY3Rvci5wdXNoKFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoc3ViX3NlbGVjdG9yW3N1Yl9zZWxlY3Rvci5sZW5ndGggLSAxXSA9PT0gXCJhbmRcIiB8fCBzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09PSBcIm9yXCIpIHtcbiAgICAgICAgc3ViX3NlbGVjdG9yLnBvcCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdWJfc2VsZWN0b3IgPSBbZmllbGQsIG9wdGlvbiwgdmFsdWVdO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcInN1Yl9zZWxlY3RvclwiLCBzdWJfc2VsZWN0b3IpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzdWJfc2VsZWN0b3IpO1xuICB9KTtcbiAgZm9ybWF0X2xvZ2ljID0gXCJbXCIgKyBmb3JtYXRfbG9naWMgKyBcIl1cIjtcbiAgcmV0dXJuIENyZWF0b3JbXCJldmFsXCJdKGZvcm1hdF9sb2dpYyk7XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgX29iamVjdCwgcGVybWlzc2lvbnMsIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCByZWxhdGVkX29iamVjdHMsIHVucmVsYXRlZF9vYmplY3RzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW107XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghX29iamVjdCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgfVxuICByZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKF9vYmplY3QuX2NvbGxlY3Rpb25fbmFtZSk7XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsIFwib2JqZWN0X25hbWVcIik7XG4gIGlmICgocmVsYXRlZF9vYmplY3RfbmFtZXMgIT0gbnVsbCA/IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmxlbmd0aCA6IHZvaWQgMCkgPT09IDApIHtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXM7XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICB1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzO1xuICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZShyZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHMpO1xuICByZXR1cm4gXy5maWx0ZXIocmVsYXRlZF9vYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCkge1xuICAgIHZhciBhbGxvd1JlYWQsIGlzQWN0aXZlLCByZWYsIHJlbGF0ZWRfb2JqZWN0X25hbWU7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0Lm9iamVjdF9uYW1lO1xuICAgIGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xO1xuICAgIGFsbG93UmVhZCA9IChyZWYgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYuYWxsb3dSZWFkIDogdm9pZCAwO1xuICAgIHJldHVybiBpc0FjdGl2ZSAmJiBhbGxvd1JlYWQ7XG4gIH0pO1xufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0TmFtZXMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciByZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIHJldHVybiBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cywgXCJvYmplY3RfbmFtZVwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0QWN0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGFjdGlvbnMsIGRpc2FibGVkX2FjdGlvbnMsIG9iaiwgcGVybWlzc2lvbnMsIHJlZiwgcmVmMTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgZGlzYWJsZWRfYWN0aW9ucyA9IHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnM7XG4gIGFjdGlvbnMgPSBfLnNvcnRCeShfLnZhbHVlcyhvYmouYWN0aW9ucyksICdzb3J0Jyk7XG4gIGlmIChfLmhhcyhvYmosICdhbGxvd19hY3Rpb25zJykpIHtcbiAgICBhY3Rpb25zID0gXy5maWx0ZXIoYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgICByZXR1cm4gXy5pbmNsdWRlKG9iai5hbGxvd19hY3Rpb25zLCBhY3Rpb24ubmFtZSk7XG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgJiYgW1wicmVjb3JkXCIsIFwicmVjb3JkX29ubHlcIl0uaW5kZXhPZihhY3Rpb24ub24pID4gLTEgJiYgYWN0aW9uLm5hbWUgIT09ICdzdGFuZGFyZF9lZGl0Jykge1xuICAgICAgaWYgKGFjdGlvbi5vbiA9PT0gXCJyZWNvcmRfb25seVwiKSB7XG4gICAgICAgIHJldHVybiBhY3Rpb24ub24gPSAncmVjb3JkX29ubHlfbW9yZSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYWN0aW9uLm9uID0gJ3JlY29yZF9tb3JlJztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcImNtc19maWxlc1wiLCBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJdLmluZGV4T2Yob2JqZWN0X25hbWUpID4gLTEpIHtcbiAgICBpZiAoKHJlZiA9IGFjdGlvbnMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5uYW1lID09PSBcInN0YW5kYXJkX2VkaXRcIjtcbiAgICB9KSkgIT0gbnVsbCkge1xuICAgICAgcmVmLm9uID0gXCJyZWNvcmRfbW9yZVwiO1xuICAgIH1cbiAgICBpZiAoKHJlZjEgPSBhY3Rpb25zLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4ubmFtZSA9PT0gXCJkb3dubG9hZFwiO1xuICAgIH0pKSAhPSBudWxsKSB7XG4gICAgICByZWYxLm9uID0gXCJyZWNvcmRcIjtcbiAgICB9XG4gIH1cbiAgYWN0aW9ucyA9IF8uZmlsdGVyKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIHJldHVybiBfLmluZGV4T2YoZGlzYWJsZWRfYWN0aW9ucywgYWN0aW9uLm5hbWUpIDwgMDtcbiAgfSk7XG4gIHJldHVybiBhY3Rpb25zO1xufTtcblxuL+i/lOWbnuW9k+WJjeeUqOaIt+acieadg+mZkOiuv+mXrueahOaJgOaciWxpc3Rfdmlld++8jOWMheaLrOWIhuS6q+eahO+8jOeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahO+8iOmZpOmdnm93bmVy5Y+Y5LqG77yJ77yM5Lul5Y+K6buY6K6k55qE5YW25LuW6KeG5Zu+5rOo5oSPQ3JlYXRvci5nZXRQZXJtaXNzaW9uc+WHveaVsOS4reaYr+S4jeS8muacieeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahOinhuWbvueahO+8jOaJgOS7pUNyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mi7/liLDnmoTnu5PmnpzkuI3lhajvvIzlubbkuI3mmK/lvZPliY3nlKjmiLfog73nnIvliLDmiYDmnInop4blm74vO1xuXG5DcmVhdG9yLmdldExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGRpc2FibGVkX2xpc3Rfdmlld3MsIGlzTW9iaWxlLCBsaXN0X3ZpZXdzLCBvYmplY3QsIHJlZjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZGlzYWJsZWRfbGlzdF92aWV3cyA9ICgocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5kaXNhYmxlZF9saXN0X3ZpZXdzIDogdm9pZCAwKSB8fCBbXTtcbiAgbGlzdF92aWV3cyA9IFtdO1xuICBpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKTtcbiAgXy5lYWNoKG9iamVjdC5saXN0X3ZpZXdzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICBpZiAoaXNNb2JpbGUgJiYgaXRlbS50eXBlID09PSBcImNhbGVuZGFyXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGl0ZW1fbmFtZSAhPT0gXCJkZWZhdWx0XCIpIHtcbiAgICAgIGlmIChfLmluZGV4T2YoZGlzYWJsZWRfbGlzdF92aWV3cywgaXRlbV9uYW1lKSA8IDAgfHwgaXRlbS5vd25lciA9PT0gdXNlcklkKSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXdzLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGxpc3Rfdmlld3M7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGZpZWxkc05hbWUsIHJlZiwgdW5yZWFkYWJsZV9maWVsZHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgZmllbGRzTmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZShvYmplY3RfbmFtZSk7XG4gIHVucmVhZGFibGVfZmllbGRzID0gKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYudW5yZWFkYWJsZV9maWVsZHMgOiB2b2lkIDA7XG4gIHJldHVybiBfLmRpZmZlcmVuY2UoZmllbGRzTmFtZSwgdW5yZWFkYWJsZV9maWVsZHMpO1xufTtcblxuQ3JlYXRvci5pc2xvYWRpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZC5nZXQoKTtcbn07XG5cbkNyZWF0b3IuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0RGlzYWJsZWRGaWVsZHMgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLmRpc2FibGVkICYmICFmaWVsZC5hdXRvZm9ybS5vbWl0ICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRIaWRkZW5GaWVsZHMgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLnR5cGUgPT09IFwiaGlkZGVuXCIgJiYgIWZpZWxkLmF1dG9mb3JtLm9taXQgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhOb0dyb3VwID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBmaWVsZHM7XG4gIGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQsIGZpZWxkTmFtZSkge1xuICAgIHJldHVybiAoIWZpZWxkLmF1dG9mb3JtIHx8ICFmaWVsZC5hdXRvZm9ybS5ncm91cCB8fCBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PT0gXCItXCIpICYmICghZmllbGQuYXV0b2Zvcm0gfHwgZmllbGQuYXV0b2Zvcm0udHlwZSAhPT0gXCJoaWRkZW5cIikgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldFNvcnRlZEZpZWxkR3JvdXBOYW1lcyA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgbmFtZXM7XG4gIG5hbWVzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZC5hdXRvZm9ybSAmJiBmaWVsZC5hdXRvZm9ybS5ncm91cCAhPT0gXCItXCIgJiYgZmllbGQuYXV0b2Zvcm0uZ3JvdXA7XG4gIH0pO1xuICBuYW1lcyA9IF8uY29tcGFjdChuYW1lcyk7XG4gIG5hbWVzID0gXy51bmlxdWUobmFtZXMpO1xuICByZXR1cm4gbmFtZXM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc0Zvckdyb3VwID0gZnVuY3Rpb24oc2NoZW1hLCBncm91cE5hbWUpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLmdyb3VwID09PSBncm91cE5hbWUgJiYgZmllbGQuYXV0b2Zvcm0udHlwZSAhPT0gXCJoaWRkZW5cIiAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aG91dE9taXQgPSBmdW5jdGlvbihzY2hlbWEsIGtleXMpIHtcbiAga2V5cyA9IF8ubWFwKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBmaWVsZCwgcmVmO1xuICAgIGZpZWxkID0gXy5waWNrKHNjaGVtYSwga2V5KTtcbiAgICBpZiAoKHJlZiA9IGZpZWxkW2tleV0uYXV0b2Zvcm0pICE9IG51bGwgPyByZWYub21pdCA6IHZvaWQgMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cbiAgfSk7XG4gIGtleXMgPSBfLmNvbXBhY3Qoa2V5cyk7XG4gIHJldHVybiBrZXlzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNJbkZpcnN0TGV2ZWwgPSBmdW5jdGlvbihmaXJzdExldmVsS2V5cywga2V5cykge1xuICBrZXlzID0gXy5tYXAoa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKF8uaW5kZXhPZihmaXJzdExldmVsS2V5cywga2V5KSA+IC0xKSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcbiAga2V5cyA9IF8uY29tcGFjdChrZXlzKTtcbiAgcmV0dXJuIGtleXM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc0ZvclJlb3JkZXIgPSBmdW5jdGlvbihzY2hlbWEsIGtleXMsIGlzU2luZ2xlKSB7XG4gIHZhciBfa2V5cywgY2hpbGRLZXlzLCBmaWVsZHMsIGksIGlzX3dpZGVfMSwgaXNfd2lkZV8yLCBzY18xLCBzY18yO1xuICBmaWVsZHMgPSBbXTtcbiAgaSA9IDA7XG4gIF9rZXlzID0gXy5maWx0ZXIoa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuICFrZXkuZW5kc1dpdGgoJ19lbmRMaW5lJyk7XG4gIH0pO1xuICB3aGlsZSAoaSA8IF9rZXlzLmxlbmd0aCkge1xuICAgIHNjXzEgPSBfLnBpY2soc2NoZW1hLCBfa2V5c1tpXSk7XG4gICAgc2NfMiA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2kgKyAxXSk7XG4gICAgaXNfd2lkZV8xID0gZmFsc2U7XG4gICAgaXNfd2lkZV8yID0gZmFsc2U7XG4gICAgXy5lYWNoKHNjXzEsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCgocmVmID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYuaXNfd2lkZSA6IHZvaWQgMCkgfHwgKChyZWYxID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLnR5cGUgOiB2b2lkIDApID09PSBcInRhYmxlXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzX3dpZGVfMSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgXy5lYWNoKHNjXzIsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCgocmVmID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYuaXNfd2lkZSA6IHZvaWQgMCkgfHwgKChyZWYxID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLnR5cGUgOiB2b2lkIDApID09PSBcInRhYmxlXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzX3dpZGVfMiA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgaXNfd2lkZV8xID0gdHJ1ZTtcbiAgICAgIGlzX3dpZGVfMiA9IHRydWU7XG4gICAgfVxuICAgIGlmIChpc1NpbmdsZSkge1xuICAgICAgZmllbGRzLnB1c2goX2tleXMuc2xpY2UoaSwgaSArIDEpKTtcbiAgICAgIGkgKz0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzX3dpZGVfMSkge1xuICAgICAgICBmaWVsZHMucHVzaChfa2V5cy5zbGljZShpLCBpICsgMSkpO1xuICAgICAgICBpICs9IDE7XG4gICAgICB9IGVsc2UgaWYgKCFpc193aWRlXzEgJiYgaXNfd2lkZV8yKSB7XG4gICAgICAgIGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkgKyAxKTtcbiAgICAgICAgY2hpbGRLZXlzLnB1c2godm9pZCAwKTtcbiAgICAgICAgZmllbGRzLnB1c2goY2hpbGRLZXlzKTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgfSBlbHNlIGlmICghaXNfd2lkZV8xICYmICFpc193aWRlXzIpIHtcbiAgICAgICAgY2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSArIDEpO1xuICAgICAgICBpZiAoX2tleXNbaSArIDFdKSB7XG4gICAgICAgICAgY2hpbGRLZXlzLnB1c2goX2tleXNbaSArIDFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGlsZEtleXMucHVzaCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICAgIGZpZWxkcy5wdXNoKGNoaWxkS2V5cyk7XG4gICAgICAgIGkgKz0gMjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuaXNGaWx0ZXJWYWx1ZUVtcHR5ID0gZnVuY3Rpb24odikge1xuICByZXR1cm4gdHlwZW9mIHYgPT09IFwidW5kZWZpbmVkXCIgfHwgdiA9PT0gbnVsbCB8fCBOdW1iZXIuaXNOYU4odikgfHwgdi5sZW5ndGggPT09IDA7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGF0YVR5cGUgPSBmdW5jdGlvbihvYmplY3RGaWVsZHMsIGtleSkge1xuICB2YXIgcmVmLCByZXN1bHQ7XG4gIGlmIChvYmplY3RGaWVsZHMgJiYga2V5KSB7XG4gICAgcmVzdWx0ID0gKHJlZiA9IG9iamVjdEZpZWxkc1trZXldKSAhPSBudWxsID8gcmVmLnR5cGUgOiB2b2lkIDA7XG4gICAgaWYgKFtcImZvcm11bGFcIiwgXCJzdW1tYXJ5XCJdLmluZGV4T2YocmVzdWx0KSA+IC0xKSB7XG4gICAgICByZXN1bHQgPSBvYmplY3RGaWVsZHNba2V5XS5kYXRhX3R5cGU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwidGV4dFwiO1xuICB9XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3IuZ2V0QWxsUmVsYXRlZE9iamVjdHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgIHZhciByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdO1xuICAgIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICAgIGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSkge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoKHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpLmVuYWJsZV9maWxlcykge1xuICAgICAgcmVsYXRlZF9vYmplY3RfbmFtZXMucHVzaChcImNtc19maWxlc1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICB9O1xufVxuIiwiQ3JlYXRvci5hcHBzQnlOYW1lID0ge31cblxuIiwiTWV0ZW9yLm1ldGhvZHNcblx0XCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc3BhY2VfaWQpLT5cblx0XHRpZiAhdGhpcy51c2VySWRcblx0XHRcdHJldHVybiBudWxsXG5cblx0XHRpZiBvYmplY3RfbmFtZSA9PSBcIm9iamVjdF9yZWNlbnRfdmlld2VkXCJcblx0XHRcdHJldHVyblxuXHRcdGlmIG9iamVjdF9uYW1lIGFuZCByZWNvcmRfaWRcblx0XHRcdGlmICFzcGFjZV9pZFxuXHRcdFx0XHRkb2MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmRPbmUoe19pZDogcmVjb3JkX2lkfSwge2ZpZWxkczoge3NwYWNlOiAxfX0pXG5cdFx0XHRcdHNwYWNlX2lkID0gZG9jPy5zcGFjZVxuXG5cdFx0XHRjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiKVxuXHRcdFx0ZmlsdGVycyA9IHsgb3duZXI6IHRoaXMudXNlcklkLCBzcGFjZTogc3BhY2VfaWQsICdyZWNvcmQubyc6IG9iamVjdF9uYW1lLCAncmVjb3JkLmlkcyc6IFtyZWNvcmRfaWRdfVxuXHRcdFx0Y3VycmVudF9yZWNlbnRfdmlld2VkID0gY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLmZpbmRPbmUoZmlsdGVycylcblx0XHRcdGlmIGN1cnJlbnRfcmVjZW50X3ZpZXdlZFxuXHRcdFx0XHRjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQudXBkYXRlKFxuXHRcdFx0XHRcdGN1cnJlbnRfcmVjZW50X3ZpZXdlZC5faWQsXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0JGluYzoge1xuXHRcdFx0XHRcdFx0XHRjb3VudDogMVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWQ6IG5ldyBEYXRlKClcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5pbnNlcnQoXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0X2lkOiBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuX21ha2VOZXdJRCgpXG5cdFx0XHRcdFx0XHRvd25lcjogdGhpcy51c2VySWRcblx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZV9pZFxuXHRcdFx0XHRcdFx0cmVjb3JkOiB7bzogb2JqZWN0X25hbWUsIGlkczogW3JlY29yZF9pZF19XG5cdFx0XHRcdFx0XHRjb3VudDogMVxuXHRcdFx0XHRcdFx0Y3JlYXRlZDogbmV3IERhdGUoKVxuXHRcdFx0XHRcdFx0Y3JlYXRlZF9ieTogdGhpcy51c2VySWRcblx0XHRcdFx0XHRcdG1vZGlmaWVkOiBuZXcgRGF0ZSgpXG5cdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogdGhpcy51c2VySWRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdClcblx0XHRcdHJldHVybiIsIk1ldGVvci5tZXRob2RzKHtcbiAgXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZV9pZCkge1xuICAgIHZhciBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQsIGN1cnJlbnRfcmVjZW50X3ZpZXdlZCwgZG9jLCBmaWx0ZXJzO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAob2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgICBpZiAoIXNwYWNlX2lkKSB7XG4gICAgICAgIGRvYyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZE9uZSh7XG4gICAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgc3BhY2U6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzcGFjZV9pZCA9IGRvYyAhPSBudWxsID8gZG9jLnNwYWNlIDogdm9pZCAwO1xuICAgICAgfVxuICAgICAgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIik7XG4gICAgICBmaWx0ZXJzID0ge1xuICAgICAgICBvd25lcjogdGhpcy51c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgJ3JlY29yZC5vJzogb2JqZWN0X25hbWUsXG4gICAgICAgICdyZWNvcmQuaWRzJzogW3JlY29yZF9pZF1cbiAgICAgIH07XG4gICAgICBjdXJyZW50X3JlY2VudF92aWV3ZWQgPSBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuZmluZE9uZShmaWx0ZXJzKTtcbiAgICAgIGlmIChjdXJyZW50X3JlY2VudF92aWV3ZWQpIHtcbiAgICAgICAgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLnVwZGF0ZShjdXJyZW50X3JlY2VudF92aWV3ZWQuX2lkLCB7XG4gICAgICAgICAgJGluYzoge1xuICAgICAgICAgICAgY291bnQ6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5pbnNlcnQoe1xuICAgICAgICAgIF9pZDogY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLl9tYWtlTmV3SUQoKSxcbiAgICAgICAgICBvd25lcjogdGhpcy51c2VySWQsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIHJlY29yZDoge1xuICAgICAgICAgICAgbzogb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBpZHM6IFtyZWNvcmRfaWRdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IHRoaXMudXNlcklkLFxuICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuIiwicmVjZW50X2FnZ3JlZ2F0ZSA9IChjcmVhdGVkX2J5LCBzcGFjZUlkLCBfcmVjb3JkcywgY2FsbGJhY2spLT5cblx0Q3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfcmVjZW50X3ZpZXdlZC5yYXdDb2xsZWN0aW9uKCkuYWdncmVnYXRlKFtcblx0XHR7JG1hdGNoOiB7Y3JlYXRlZF9ieTogY3JlYXRlZF9ieSwgc3BhY2U6IHNwYWNlSWR9fSxcblx0XHR7JGdyb3VwOiB7X2lkOiB7b2JqZWN0X25hbWU6IFwiJHJlY29yZC5vXCIsIHJlY29yZF9pZDogXCIkcmVjb3JkLmlkc1wiLCBzcGFjZTogXCIkc3BhY2VcIn0sIG1heENyZWF0ZWQ6IHskbWF4OiBcIiRjcmVhdGVkXCJ9fX0sXG5cdFx0eyRzb3J0OiB7bWF4Q3JlYXRlZDogLTF9fSxcblx0XHR7JGxpbWl0OiAxMH1cblx0XSkudG9BcnJheSAoZXJyLCBkYXRhKS0+XG5cdFx0aWYgZXJyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyKVxuXG5cdFx0ZGF0YS5mb3JFYWNoIChkb2MpIC0+XG5cdFx0XHRfcmVjb3Jkcy5wdXNoIGRvYy5faWRcblxuXHRcdGlmIGNhbGxiYWNrICYmIF8uaXNGdW5jdGlvbihjYWxsYmFjaylcblx0XHRcdGNhbGxiYWNrKClcblxuXHRcdHJldHVyblxuXG5hc3luY19yZWNlbnRfYWdncmVnYXRlID0gTWV0ZW9yLndyYXBBc3luYyhyZWNlbnRfYWdncmVnYXRlKVxuXG5zZWFyY2hfb2JqZWN0ID0gKHNwYWNlLCBvYmplY3RfbmFtZSx1c2VySWQsIHNlYXJjaFRleHQpLT5cblx0ZGF0YSA9IG5ldyBBcnJheSgpXG5cblx0aWYgc2VhcmNoVGV4dFxuXG5cdFx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdFx0X29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxuXHRcdF9vYmplY3RfbmFtZV9rZXkgPSBfb2JqZWN0Py5OQU1FX0ZJRUxEX0tFWVxuXHRcdGlmIF9vYmplY3QgJiYgX29iamVjdF9jb2xsZWN0aW9uICYmIF9vYmplY3RfbmFtZV9rZXlcblx0XHRcdHF1ZXJ5ID0ge31cblx0XHRcdHNlYXJjaF9LZXl3b3JkcyA9IHNlYXJjaFRleHQuc3BsaXQoXCIgXCIpXG5cdFx0XHRxdWVyeV9hbmQgPSBbXVxuXHRcdFx0c2VhcmNoX0tleXdvcmRzLmZvckVhY2ggKGtleXdvcmQpLT5cblx0XHRcdFx0c3VicXVlcnkgPSB7fVxuXHRcdFx0XHRzdWJxdWVyeVtfb2JqZWN0X25hbWVfa2V5XSA9IHskcmVnZXg6IGtleXdvcmQudHJpbSgpfVxuXHRcdFx0XHRxdWVyeV9hbmQucHVzaCBzdWJxdWVyeVxuXG5cdFx0XHRxdWVyeS4kYW5kID0gcXVlcnlfYW5kXG5cdFx0XHRxdWVyeS5zcGFjZSA9IHskaW46IFtzcGFjZV19XG5cblx0XHRcdGZpZWxkcyA9IHtfaWQ6IDF9XG5cdFx0XHRmaWVsZHNbX29iamVjdF9uYW1lX2tleV0gPSAxXG5cblx0XHRcdHJlY29yZHMgPSBfb2JqZWN0X2NvbGxlY3Rpb24uZmluZChxdWVyeSwge2ZpZWxkczogZmllbGRzLCBzb3J0OiB7bW9kaWZpZWQ6IDF9LCBsaW1pdDogNX0pXG5cblx0XHRcdHJlY29yZHMuZm9yRWFjaCAocmVjb3JkKS0+XG5cdFx0XHRcdGRhdGEucHVzaCB7X2lkOiByZWNvcmQuX2lkLCBfbmFtZTogcmVjb3JkW19vYmplY3RfbmFtZV9rZXldLCBfb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lfVxuXHRcblx0cmV0dXJuIGRhdGFcblxuTWV0ZW9yLm1ldGhvZHNcblx0J29iamVjdF9yZWNlbnRfcmVjb3JkJzogKHNwYWNlSWQpLT5cblx0XHRkYXRhID0gbmV3IEFycmF5KClcblx0XHRyZWNvcmRzID0gbmV3IEFycmF5KClcblx0XHRhc3luY19yZWNlbnRfYWdncmVnYXRlKHRoaXMudXNlcklkLCBzcGFjZUlkLCByZWNvcmRzKVxuXHRcdHJlY29yZHMuZm9yRWFjaCAoaXRlbSktPlxuXHRcdFx0cmVjb3JkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpXG5cblx0XHRcdGlmICFyZWNvcmRfb2JqZWN0XG5cdFx0XHRcdHJldHVyblxuXG5cdFx0XHRyZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSlcblxuXHRcdFx0aWYgcmVjb3JkX29iamVjdCAmJiByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb25cblx0XHRcdFx0ZmllbGRzID0ge19pZDogMX1cblxuXHRcdFx0XHRmaWVsZHNbcmVjb3JkX29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gPSAxXG5cblx0XHRcdFx0cmVjb3JkID0gcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uLmZpbmRPbmUoaXRlbS5yZWNvcmRfaWRbMF0sIHtmaWVsZHM6IGZpZWxkc30pXG5cdFx0XHRcdGlmIHJlY29yZFxuXHRcdFx0XHRcdGRhdGEucHVzaCB7X2lkOiByZWNvcmQuX2lkLCBfbmFtZTogcmVjb3JkW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldLCBfb2JqZWN0X25hbWU6IGl0ZW0ub2JqZWN0X25hbWV9XG5cblx0XHRyZXR1cm4gZGF0YVxuXG5cdCdvYmplY3RfcmVjb3JkX3NlYXJjaCc6IChvcHRpb25zKS0+XG5cdFx0c2VsZiA9IHRoaXNcblxuXHRcdGRhdGEgPSBuZXcgQXJyYXkoKVxuXG5cdFx0c2VhcmNoVGV4dCA9IG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdHNwYWNlID0gb3B0aW9ucy5zcGFjZVxuXG5cdFx0Xy5mb3JFYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKF9vYmplY3QsIG5hbWUpLT5cblx0XHRcdGlmIF9vYmplY3QuZW5hYmxlX3NlYXJjaFxuXHRcdFx0XHRvYmplY3RfcmVjb3JkID0gc2VhcmNoX29iamVjdChzcGFjZSwgX29iamVjdC5uYW1lLCBzZWxmLnVzZXJJZCwgc2VhcmNoVGV4dClcblx0XHRcdFx0ZGF0YSA9IGRhdGEuY29uY2F0KG9iamVjdF9yZWNvcmQpXG5cblx0XHRyZXR1cm4gZGF0YVxuIiwidmFyIGFzeW5jX3JlY2VudF9hZ2dyZWdhdGUsIHJlY2VudF9hZ2dyZWdhdGUsIHNlYXJjaF9vYmplY3Q7XG5cbnJlY2VudF9hZ2dyZWdhdGUgPSBmdW5jdGlvbihjcmVhdGVkX2J5LCBzcGFjZUlkLCBfcmVjb3JkcywgY2FsbGJhY2spIHtcbiAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3JlY2VudF92aWV3ZWQucmF3Q29sbGVjdGlvbigpLmFnZ3JlZ2F0ZShbXG4gICAge1xuICAgICAgJG1hdGNoOiB7XG4gICAgICAgIGNyZWF0ZWRfYnk6IGNyZWF0ZWRfYnksXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgJGdyb3VwOiB7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBcIiRyZWNvcmQub1wiLFxuICAgICAgICAgIHJlY29yZF9pZDogXCIkcmVjb3JkLmlkc1wiLFxuICAgICAgICAgIHNwYWNlOiBcIiRzcGFjZVwiXG4gICAgICAgIH0sXG4gICAgICAgIG1heENyZWF0ZWQ6IHtcbiAgICAgICAgICAkbWF4OiBcIiRjcmVhdGVkXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgICRzb3J0OiB7XG4gICAgICAgIG1heENyZWF0ZWQ6IC0xXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgJGxpbWl0OiAxMFxuICAgIH1cbiAgXSkudG9BcnJheShmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyKTtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGRvYykge1xuICAgICAgcmV0dXJuIF9yZWNvcmRzLnB1c2goZG9jLl9pZCk7XG4gICAgfSk7XG4gICAgaWYgKGNhbGxiYWNrICYmIF8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9KTtcbn07XG5cbmFzeW5jX3JlY2VudF9hZ2dyZWdhdGUgPSBNZXRlb3Iud3JhcEFzeW5jKHJlY2VudF9hZ2dyZWdhdGUpO1xuXG5zZWFyY2hfb2JqZWN0ID0gZnVuY3Rpb24oc3BhY2UsIG9iamVjdF9uYW1lLCB1c2VySWQsIHNlYXJjaFRleHQpIHtcbiAgdmFyIF9vYmplY3QsIF9vYmplY3RfY29sbGVjdGlvbiwgX29iamVjdF9uYW1lX2tleSwgZGF0YSwgZmllbGRzLCBxdWVyeSwgcXVlcnlfYW5kLCByZWNvcmRzLCBzZWFyY2hfS2V5d29yZHM7XG4gIGRhdGEgPSBuZXcgQXJyYXkoKTtcbiAgaWYgKHNlYXJjaFRleHQpIHtcbiAgICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIF9vYmplY3RfY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSk7XG4gICAgX29iamVjdF9uYW1lX2tleSA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuTkFNRV9GSUVMRF9LRVkgOiB2b2lkIDA7XG4gICAgaWYgKF9vYmplY3QgJiYgX29iamVjdF9jb2xsZWN0aW9uICYmIF9vYmplY3RfbmFtZV9rZXkpIHtcbiAgICAgIHF1ZXJ5ID0ge307XG4gICAgICBzZWFyY2hfS2V5d29yZHMgPSBzZWFyY2hUZXh0LnNwbGl0KFwiIFwiKTtcbiAgICAgIHF1ZXJ5X2FuZCA9IFtdO1xuICAgICAgc2VhcmNoX0tleXdvcmRzLmZvckVhY2goZnVuY3Rpb24oa2V5d29yZCkge1xuICAgICAgICB2YXIgc3VicXVlcnk7XG4gICAgICAgIHN1YnF1ZXJ5ID0ge307XG4gICAgICAgIHN1YnF1ZXJ5W19vYmplY3RfbmFtZV9rZXldID0ge1xuICAgICAgICAgICRyZWdleDoga2V5d29yZC50cmltKClcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHF1ZXJ5X2FuZC5wdXNoKHN1YnF1ZXJ5KTtcbiAgICAgIH0pO1xuICAgICAgcXVlcnkuJGFuZCA9IHF1ZXJ5X2FuZDtcbiAgICAgIHF1ZXJ5LnNwYWNlID0ge1xuICAgICAgICAkaW46IFtzcGFjZV1cbiAgICAgIH07XG4gICAgICBmaWVsZHMgPSB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfTtcbiAgICAgIGZpZWxkc1tfb2JqZWN0X25hbWVfa2V5XSA9IDE7XG4gICAgICByZWNvcmRzID0gX29iamVjdF9jb2xsZWN0aW9uLmZpbmQocXVlcnksIHtcbiAgICAgICAgZmllbGRzOiBmaWVsZHMsXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBtb2RpZmllZDogMVxuICAgICAgICB9LFxuICAgICAgICBsaW1pdDogNVxuICAgICAgfSk7XG4gICAgICByZWNvcmRzLmZvckVhY2goZnVuY3Rpb24ocmVjb3JkKSB7XG4gICAgICAgIHJldHVybiBkYXRhLnB1c2goe1xuICAgICAgICAgIF9pZDogcmVjb3JkLl9pZCxcbiAgICAgICAgICBfbmFtZTogcmVjb3JkW19vYmplY3RfbmFtZV9rZXldLFxuICAgICAgICAgIF9vYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gICdvYmplY3RfcmVjZW50X3JlY29yZCc6IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgZGF0YSwgcmVjb3JkcztcbiAgICBkYXRhID0gbmV3IEFycmF5KCk7XG4gICAgcmVjb3JkcyA9IG5ldyBBcnJheSgpO1xuICAgIGFzeW5jX3JlY2VudF9hZ2dyZWdhdGUodGhpcy51c2VySWQsIHNwYWNlSWQsIHJlY29yZHMpO1xuICAgIHJlY29yZHMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICB2YXIgZmllbGRzLCByZWNvcmQsIHJlY29yZF9vYmplY3QsIHJlY29yZF9vYmplY3RfY29sbGVjdGlvbjtcbiAgICAgIHJlY29yZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChpdGVtLm9iamVjdF9uYW1lLCBpdGVtLnNwYWNlKTtcbiAgICAgIGlmICghcmVjb3JkX29iamVjdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSk7XG4gICAgICBpZiAocmVjb3JkX29iamVjdCAmJiByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24pIHtcbiAgICAgICAgZmllbGRzID0ge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9O1xuICAgICAgICBmaWVsZHNbcmVjb3JkX29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gPSAxO1xuICAgICAgICByZWNvcmQgPSByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24uZmluZE9uZShpdGVtLnJlY29yZF9pZFswXSwge1xuICAgICAgICAgIGZpZWxkczogZmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGEucHVzaCh7XG4gICAgICAgICAgICBfaWQ6IHJlY29yZC5faWQsXG4gICAgICAgICAgICBfbmFtZTogcmVjb3JkW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldLFxuICAgICAgICAgICAgX29iamVjdF9uYW1lOiBpdGVtLm9iamVjdF9uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfSxcbiAgJ29iamVjdF9yZWNvcmRfc2VhcmNoJzogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBkYXRhLCBzZWFyY2hUZXh0LCBzZWxmLCBzcGFjZTtcbiAgICBzZWxmID0gdGhpcztcbiAgICBkYXRhID0gbmV3IEFycmF5KCk7XG4gICAgc2VhcmNoVGV4dCA9IG9wdGlvbnMuc2VhcmNoVGV4dDtcbiAgICBzcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gICAgXy5mb3JFYWNoKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgZnVuY3Rpb24oX29iamVjdCwgbmFtZSkge1xuICAgICAgdmFyIG9iamVjdF9yZWNvcmQ7XG4gICAgICBpZiAoX29iamVjdC5lbmFibGVfc2VhcmNoKSB7XG4gICAgICAgIG9iamVjdF9yZWNvcmQgPSBzZWFyY2hfb2JqZWN0KHNwYWNlLCBfb2JqZWN0Lm5hbWUsIHNlbGYudXNlcklkLCBzZWFyY2hUZXh0KTtcbiAgICAgICAgcmV0dXJuIGRhdGEgPSBkYXRhLmNvbmNhdChvYmplY3RfcmVjb3JkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuICAgIHVwZGF0ZV9maWx0ZXJzOiAobGlzdHZpZXdfaWQsIGZpbHRlcnMsIGZpbHRlcl9zY29wZSwgZmlsdGVyX2xvZ2ljKS0+XG4gICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy5kaXJlY3QudXBkYXRlKHtfaWQ6IGxpc3R2aWV3X2lkfSwgeyRzZXQ6IHtmaWx0ZXJzOiBmaWx0ZXJzLCBmaWx0ZXJfc2NvcGU6IGZpbHRlcl9zY29wZSwgZmlsdGVyX2xvZ2ljOiBmaWx0ZXJfbG9naWN9fSlcblxuICAgIHVwZGF0ZV9jb2x1bW5zOiAobGlzdHZpZXdfaWQsIGNvbHVtbnMpLT5cbiAgICAgICAgY2hlY2soY29sdW1ucywgQXJyYXkpXG4gICAgICAgIFxuICAgICAgICBpZiBjb2x1bW5zLmxlbmd0aCA8IDFcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAwLCBcIlNlbGVjdCBhdCBsZWFzdCBvbmUgZmllbGQgdG8gZGlzcGxheVwiXG4gICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy51cGRhdGUoe19pZDogbGlzdHZpZXdfaWR9LCB7JHNldDoge2NvbHVtbnM6IGNvbHVtbnN9fSlcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgdXBkYXRlX2ZpbHRlcnM6IGZ1bmN0aW9uKGxpc3R2aWV3X2lkLCBmaWx0ZXJzLCBmaWx0ZXJfc2NvcGUsIGZpbHRlcl9sb2dpYykge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IGxpc3R2aWV3X2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBmaWx0ZXJzOiBmaWx0ZXJzLFxuICAgICAgICBmaWx0ZXJfc2NvcGU6IGZpbHRlcl9zY29wZSxcbiAgICAgICAgZmlsdGVyX2xvZ2ljOiBmaWx0ZXJfbG9naWNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlX2NvbHVtbnM6IGZ1bmN0aW9uKGxpc3R2aWV3X2lkLCBjb2x1bW5zKSB7XG4gICAgY2hlY2soY29sdW1ucywgQXJyYXkpO1xuICAgIGlmIChjb2x1bW5zLmxlbmd0aCA8IDEpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIlNlbGVjdCBhdCBsZWFzdCBvbmUgZmllbGQgdG8gZGlzcGxheVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy51cGRhdGUoe1xuICAgICAgX2lkOiBsaXN0dmlld19pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgY29sdW1uczogY29sdW1uc1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdCdyZXBvcnRfZGF0YSc6IChvcHRpb25zKS0+XG5cdFx0Y2hlY2sob3B0aW9ucywgT2JqZWN0KVxuXHRcdHNwYWNlID0gb3B0aW9ucy5zcGFjZVxuXHRcdGZpZWxkcyA9IG9wdGlvbnMuZmllbGRzXG5cdFx0b2JqZWN0X25hbWUgPSBvcHRpb25zLm9iamVjdF9uYW1lXG5cdFx0ZmlsdGVyX3Njb3BlID0gb3B0aW9ucy5maWx0ZXJfc2NvcGVcblx0XHRmaWx0ZXJzID0gb3B0aW9ucy5maWx0ZXJzXG5cdFx0ZmlsdGVyRmllbGRzID0ge31cblx0XHRjb21wb3VuZEZpZWxkcyA9IFtdXG5cdFx0b2JqZWN0RmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5maWVsZHNcblx0XHRfLmVhY2ggZmllbGRzLCAoaXRlbSwgaW5kZXgpLT5cblx0XHRcdHNwbGl0cyA9IGl0ZW0uc3BsaXQoXCIuXCIpXG5cdFx0XHRuYW1lID0gc3BsaXRzWzBdXG5cdFx0XHRvYmplY3RGaWVsZCA9IG9iamVjdEZpZWxkc1tuYW1lXVxuXHRcdFx0aWYgc3BsaXRzLmxlbmd0aCA+IDEgYW5kIG9iamVjdEZpZWxkXG5cdFx0XHRcdGNoaWxkS2V5ID0gaXRlbS5yZXBsYWNlIG5hbWUgKyBcIi5cIiwgXCJcIlxuXHRcdFx0XHRjb21wb3VuZEZpZWxkcy5wdXNoKHtuYW1lOiBuYW1lLCBjaGlsZEtleTogY2hpbGRLZXksIGZpZWxkOiBvYmplY3RGaWVsZH0pXG5cdFx0XHRmaWx0ZXJGaWVsZHNbbmFtZV0gPSAxXG5cblx0XHRzZWxlY3RvciA9IHt9XG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcblx0XHRzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXG5cdFx0aWYgZmlsdGVyX3Njb3BlID09IFwic3BhY2V4XCJcblx0XHRcdHNlbGVjdG9yLnNwYWNlID0gXG5cdFx0XHRcdCRpbjogW251bGwsc3BhY2VdXG5cdFx0ZWxzZSBpZiBmaWx0ZXJfc2NvcGUgPT0gXCJtaW5lXCJcblx0XHRcdHNlbGVjdG9yLm93bmVyID0gdXNlcklkXG5cblx0XHRpZiBDcmVhdG9yLmlzQ29tbW9uU3BhY2Uoc3BhY2UpICYmIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlLCBAdXNlcklkKVxuXHRcdFx0ZGVsZXRlIHNlbGVjdG9yLnNwYWNlXG5cblx0XHRpZiBmaWx0ZXJzIGFuZCBmaWx0ZXJzLmxlbmd0aCA+IDBcblx0XHRcdHNlbGVjdG9yW1wiJGFuZFwiXSA9IGZpbHRlcnNcblxuXHRcdGN1cnNvciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvciwge2ZpZWxkczogZmlsdGVyRmllbGRzLCBza2lwOiAwLCBsaW1pdDogMTAwMDB9KVxuI1x0XHRpZiBjdXJzb3IuY291bnQoKSA+IDEwMDAwXG4jXHRcdFx0cmV0dXJuIFtdXG5cdFx0cmVzdWx0ID0gY3Vyc29yLmZldGNoKClcblx0XHRpZiBjb21wb3VuZEZpZWxkcy5sZW5ndGhcblx0XHRcdHJlc3VsdCA9IHJlc3VsdC5tYXAgKGl0ZW0saW5kZXgpLT5cblx0XHRcdFx0Xy5lYWNoIGNvbXBvdW5kRmllbGRzLCAoY29tcG91bmRGaWVsZEl0ZW0sIGluZGV4KS0+XG5cdFx0XHRcdFx0aXRlbUtleSA9IGNvbXBvdW5kRmllbGRJdGVtLm5hbWUgKyBcIiolKlwiICsgY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXkucmVwbGFjZSgvXFwuL2csIFwiKiUqXCIpXG5cdFx0XHRcdFx0aXRlbVZhbHVlID0gaXRlbVtjb21wb3VuZEZpZWxkSXRlbS5uYW1lXVxuXHRcdFx0XHRcdHR5cGUgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC50eXBlXG5cdFx0XHRcdFx0aWYgW1wibG9va3VwXCIsIFwibWFzdGVyX2RldGFpbFwiXS5pbmRleE9mKHR5cGUpID4gLTFcblx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRcdFx0Y29tcG91bmRGaWx0ZXJGaWVsZHMgPSB7fVxuXHRcdFx0XHRcdFx0Y29tcG91bmRGaWx0ZXJGaWVsZHNbY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldID0gMVxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlSXRlbSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8pLmZpbmRPbmUge19pZDogaXRlbVZhbHVlfSwgZmllbGRzOiBjb21wb3VuZEZpbHRlckZpZWxkc1xuXHRcdFx0XHRcdFx0aWYgcmVmZXJlbmNlSXRlbVxuXHRcdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gcmVmZXJlbmNlSXRlbVtjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV1cblx0XHRcdFx0XHRlbHNlIGlmIHR5cGUgPT0gXCJzZWxlY3RcIlxuXHRcdFx0XHRcdFx0b3B0aW9ucyA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLm9wdGlvbnNcblx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSBfLmZpbmRXaGVyZShvcHRpb25zLCB7dmFsdWU6IGl0ZW1WYWx1ZX0pPy5sYWJlbCBvciBpdGVtVmFsdWVcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gaXRlbVZhbHVlXG5cdFx0XHRcdFx0dW5sZXNzIGl0ZW1baXRlbUtleV1cblx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSBcIi0tXCJcblx0XHRcdFx0cmV0dXJuIGl0ZW1cblx0XHRcdHJldHVybiByZXN1bHRcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gcmVzdWx0XG5cbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgJ3JlcG9ydF9kYXRhJzogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBjb21wb3VuZEZpZWxkcywgY3Vyc29yLCBmaWVsZHMsIGZpbHRlckZpZWxkcywgZmlsdGVyX3Njb3BlLCBmaWx0ZXJzLCBvYmplY3RGaWVsZHMsIG9iamVjdF9uYW1lLCByZWYsIHJlc3VsdCwgc2VsZWN0b3IsIHNwYWNlLCB1c2VySWQ7XG4gICAgY2hlY2sob3B0aW9ucywgT2JqZWN0KTtcbiAgICBzcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gICAgZmllbGRzID0gb3B0aW9ucy5maWVsZHM7XG4gICAgb2JqZWN0X25hbWUgPSBvcHRpb25zLm9iamVjdF9uYW1lO1xuICAgIGZpbHRlcl9zY29wZSA9IG9wdGlvbnMuZmlsdGVyX3Njb3BlO1xuICAgIGZpbHRlcnMgPSBvcHRpb25zLmZpbHRlcnM7XG4gICAgZmlsdGVyRmllbGRzID0ge307XG4gICAgY29tcG91bmRGaWVsZHMgPSBbXTtcbiAgICBvYmplY3RGaWVsZHMgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMDtcbiAgICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgdmFyIGNoaWxkS2V5LCBuYW1lLCBvYmplY3RGaWVsZCwgc3BsaXRzO1xuICAgICAgc3BsaXRzID0gaXRlbS5zcGxpdChcIi5cIik7XG4gICAgICBuYW1lID0gc3BsaXRzWzBdO1xuICAgICAgb2JqZWN0RmllbGQgPSBvYmplY3RGaWVsZHNbbmFtZV07XG4gICAgICBpZiAoc3BsaXRzLmxlbmd0aCA+IDEgJiYgb2JqZWN0RmllbGQpIHtcbiAgICAgICAgY2hpbGRLZXkgPSBpdGVtLnJlcGxhY2UobmFtZSArIFwiLlwiLCBcIlwiKTtcbiAgICAgICAgY29tcG91bmRGaWVsZHMucHVzaCh7XG4gICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICBjaGlsZEtleTogY2hpbGRLZXksXG4gICAgICAgICAgZmllbGQ6IG9iamVjdEZpZWxkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZpbHRlckZpZWxkc1tuYW1lXSA9IDE7XG4gICAgfSk7XG4gICAgc2VsZWN0b3IgPSB7fTtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlO1xuICAgIGlmIChmaWx0ZXJfc2NvcGUgPT09IFwic3BhY2V4XCIpIHtcbiAgICAgIHNlbGVjdG9yLnNwYWNlID0ge1xuICAgICAgICAkaW46IFtudWxsLCBzcGFjZV1cbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChmaWx0ZXJfc2NvcGUgPT09IFwibWluZVwiKSB7XG4gICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZDtcbiAgICB9XG4gICAgaWYgKENyZWF0b3IuaXNDb21tb25TcGFjZShzcGFjZSkgJiYgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2UsIHRoaXMudXNlcklkKSkge1xuICAgICAgZGVsZXRlIHNlbGVjdG9yLnNwYWNlO1xuICAgIH1cbiAgICBpZiAoZmlsdGVycyAmJiBmaWx0ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHNlbGVjdG9yW1wiJGFuZFwiXSA9IGZpbHRlcnM7XG4gICAgfVxuICAgIGN1cnNvciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvciwge1xuICAgICAgZmllbGRzOiBmaWx0ZXJGaWVsZHMsXG4gICAgICBza2lwOiAwLFxuICAgICAgbGltaXQ6IDEwMDAwXG4gICAgfSk7XG4gICAgcmVzdWx0ID0gY3Vyc29yLmZldGNoKCk7XG4gICAgaWYgKGNvbXBvdW5kRmllbGRzLmxlbmd0aCkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0Lm1hcChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICBfLmVhY2goY29tcG91bmRGaWVsZHMsIGZ1bmN0aW9uKGNvbXBvdW5kRmllbGRJdGVtLCBpbmRleCkge1xuICAgICAgICAgIHZhciBjb21wb3VuZEZpbHRlckZpZWxkcywgaXRlbUtleSwgaXRlbVZhbHVlLCByZWYxLCByZWZlcmVuY2VJdGVtLCByZWZlcmVuY2VfdG8sIHR5cGU7XG4gICAgICAgICAgaXRlbUtleSA9IGNvbXBvdW5kRmllbGRJdGVtLm5hbWUgKyBcIiolKlwiICsgY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXkucmVwbGFjZSgvXFwuL2csIFwiKiUqXCIpO1xuICAgICAgICAgIGl0ZW1WYWx1ZSA9IGl0ZW1bY29tcG91bmRGaWVsZEl0ZW0ubmFtZV07XG4gICAgICAgICAgdHlwZSA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLnR5cGU7XG4gICAgICAgICAgaWYgKFtcImxvb2t1cFwiLCBcIm1hc3Rlcl9kZXRhaWxcIl0uaW5kZXhPZih0eXBlKSA+IC0xKSB7XG4gICAgICAgICAgICByZWZlcmVuY2VfdG8gPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICBjb21wb3VuZEZpbHRlckZpZWxkcyA9IHt9O1xuICAgICAgICAgICAgY29tcG91bmRGaWx0ZXJGaWVsZHNbY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldID0gMTtcbiAgICAgICAgICAgIHJlZmVyZW5jZUl0ZW0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvKS5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiBpdGVtVmFsdWVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiBjb21wb3VuZEZpbHRlckZpZWxkc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocmVmZXJlbmNlSXRlbSkge1xuICAgICAgICAgICAgICBpdGVtW2l0ZW1LZXldID0gcmVmZXJlbmNlSXRlbVtjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQub3B0aW9ucztcbiAgICAgICAgICAgIGl0ZW1baXRlbUtleV0gPSAoKHJlZjEgPSBfLmZpbmRXaGVyZShvcHRpb25zLCB7XG4gICAgICAgICAgICAgIHZhbHVlOiBpdGVtVmFsdWVcbiAgICAgICAgICAgIH0pKSAhPSBudWxsID8gcmVmMS5sYWJlbCA6IHZvaWQgMCkgfHwgaXRlbVZhbHVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtW2l0ZW1LZXldID0gaXRlbVZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWl0ZW1baXRlbUtleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtW2l0ZW1LZXldID0gXCItLVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxufSk7XG4iLCIjIyNcbiAgICB0eXBlOiBcInVzZXJcIlxuICAgIG9iamVjdF9uYW1lOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICAgIHJlY29yZF9pZDogXCJ7b2JqZWN0X25hbWV9LHtsaXN0dmlld19pZH1cIlxuICAgIHNldHRpbmdzOlxuICAgICAgICBjb2x1bW5fd2lkdGg6IHsgZmllbGRfYTogMTAwLCBmaWVsZF8yOiAxNTAgfVxuICAgICAgICBzb3J0OiBbW1wiZmllbGRfYVwiLCBcImRlc2NcIl1dXG4gICAgb3duZXI6IHt1c2VySWR9XG4jIyNcblxuTWV0ZW9yLm1ldGhvZHNcbiAgICBcInRhYnVsYXJfc29ydF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgc29ydCktPlxuICAgICAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxuICAgICAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsIG93bmVyOiB1c2VySWR9KVxuICAgICAgICBpZiBzZXR0aW5nXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uc29ydFwiOiBzb3J0fX0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRvYyA9IFxuICAgICAgICAgICAgICAgIHR5cGU6IFwidXNlclwiXG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7fVxuICAgICAgICAgICAgICAgIG93bmVyOiB1c2VySWRcblxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fVxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnRcblxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKVxuXG4gICAgXCJ0YWJ1bGFyX2NvbHVtbl93aWR0aF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoKS0+XG4gICAgICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXG4gICAgICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIiwgb3duZXI6IHVzZXJJZH0pXG4gICAgICAgIGlmIHNldHRpbmdcbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5jb2x1bW5fd2lkdGhcIjogY29sdW1uX3dpZHRofX0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRvYyA9IFxuICAgICAgICAgICAgICAgIHR5cGU6IFwidXNlclwiXG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7fVxuICAgICAgICAgICAgICAgIG93bmVyOiB1c2VySWRcblxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fVxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoXG5cbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYylcblxuICAgIFwiZ3JpZF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoLCBzb3J0KS0+XG4gICAgICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXG4gICAgICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIiwgb3duZXI6IHVzZXJJZH0pXG4gICAgICAgIGlmIHNldHRpbmdcbiAgICAgICAgICAgICMg5q+P5qyh6YO95by65Yi25pS55Y+YX2lkX2FjdGlvbnPliJfnmoTlrr3luqbvvIzku6Xop6PlhrPlvZPnlKjmiLflj6rmlLnlj5jlrZfmrrXmrKHluo/ogIzmsqHmnInmlLnlj5jku7vkvZXlrZfmrrXlrr3luqbml7bvvIzliY3nq6/msqHmnInorqLpmIXliLDlrZfmrrXmrKHluo/lj5jmm7TnmoTmlbDmja7nmoTpl67pophcbiAgICAgICAgICAgIGNvbHVtbl93aWR0aC5faWRfYWN0aW9ucyA9IGlmIHNldHRpbmcuc2V0dGluZ3NbXCIje2xpc3Rfdmlld19pZH1cIl0/LmNvbHVtbl93aWR0aD8uX2lkX2FjdGlvbnMgPT0gNDYgdGhlbiA0NyBlbHNlIDQ2XG4gICAgICAgICAgICBpZiBzb3J0XG4gICAgICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LnNvcnRcIjogc29ydCwgXCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uY29sdW1uX3dpZHRoXCI6IGNvbHVtbl93aWR0aH19KVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5jb2x1bW5fd2lkdGhcIjogY29sdW1uX3dpZHRofX0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRvYyA9XG4gICAgICAgICAgICAgICAgdHlwZTogXCJ1c2VyXCJcbiAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHt9XG4gICAgICAgICAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9XG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5jb2x1bW5fd2lkdGggPSBjb2x1bW5fd2lkdGhcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0XG5cbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYykiLCJcbi8qXG4gICAgdHlwZTogXCJ1c2VyXCJcbiAgICBvYmplY3RfbmFtZTogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgICByZWNvcmRfaWQ6IFwie29iamVjdF9uYW1lfSx7bGlzdHZpZXdfaWR9XCJcbiAgICBzZXR0aW5nczpcbiAgICAgICAgY29sdW1uX3dpZHRoOiB7IGZpZWxkX2E6IDEwMCwgZmllbGRfMjogMTUwIH1cbiAgICAgICAgc29ydDogW1tcImZpZWxkX2FcIiwgXCJkZXNjXCJdXVxuICAgIG93bmVyOiB7dXNlcklkfVxuICovXG5NZXRlb3IubWV0aG9kcyh7XG4gIFwidGFidWxhcl9zb3J0X3NldHRpbmdzXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIHNvcnQpIHtcbiAgICB2YXIgZG9jLCBvYmosIHNldHRpbmcsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICBvd25lcjogdXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNldHRpbmcpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDogKFxuICAgICAgICAgIG9iaiA9IHt9LFxuICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuc29ydFwiXSA9IHNvcnQsXG4gICAgICAgICAgb2JqXG4gICAgICAgIClcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2MgPSB7XG4gICAgICAgIHR5cGU6IFwidXNlclwiLFxuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge307XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydDtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpO1xuICAgIH1cbiAgfSxcbiAgXCJ0YWJ1bGFyX2NvbHVtbl93aWR0aF9zZXR0aW5nc1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5fd2lkdGgpIHtcbiAgICB2YXIgZG9jLCBvYmosIHNldHRpbmcsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICBvd25lcjogdXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNldHRpbmcpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDogKFxuICAgICAgICAgIG9iaiA9IHt9LFxuICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuY29sdW1uX3dpZHRoXCJdID0gY29sdW1uX3dpZHRoLFxuICAgICAgICAgIG9ialxuICAgICAgICApXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jID0ge1xuICAgICAgICB0eXBlOiBcInVzZXJcIixcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgICBzZXR0aW5nczoge30sXG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH07XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoO1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYyk7XG4gICAgfVxuICB9LFxuICBcImdyaWRfc2V0dGluZ3NcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoLCBzb3J0KSB7XG4gICAgdmFyIGRvYywgb2JqLCBvYmoxLCByZWYsIHJlZjEsIHNldHRpbmcsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCIsXG4gICAgICBvd25lcjogdXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNldHRpbmcpIHtcbiAgICAgIGNvbHVtbl93aWR0aC5faWRfYWN0aW9ucyA9ICgocmVmID0gc2V0dGluZy5zZXR0aW5nc1tcIlwiICsgbGlzdF92aWV3X2lkXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmNvbHVtbl93aWR0aCkgIT0gbnVsbCA/IHJlZjEuX2lkX2FjdGlvbnMgOiB2b2lkIDAgOiB2b2lkIDApID09PSA0NiA/IDQ3IDogNDY7XG4gICAgICBpZiAoc29ydCkge1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IChcbiAgICAgICAgICAgIG9iaiA9IHt9LFxuICAgICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5zb3J0XCJdID0gc29ydCxcbiAgICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuY29sdW1uX3dpZHRoXCJdID0gY29sdW1uX3dpZHRoLFxuICAgICAgICAgICAgb2JqXG4gICAgICAgICAgKVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDogKFxuICAgICAgICAgICAgb2JqMSA9IHt9LFxuICAgICAgICAgICAgb2JqMVtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuY29sdW1uX3dpZHRoXCJdID0gY29sdW1uX3dpZHRoLFxuICAgICAgICAgICAgb2JqMVxuICAgICAgICAgIClcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYyA9IHtcbiAgICAgICAgdHlwZTogXCJ1c2VyXCIsXG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIixcbiAgICAgICAgc2V0dGluZ3M6IHt9LFxuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aDtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0O1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYyk7XG4gICAgfVxuICB9XG59KTtcbiIsInhtbDJqcyA9IHJlcXVpcmUgJ3htbDJqcydcbmZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbm1rZGlycCA9IHJlcXVpcmUgJ21rZGlycCdcblxubG9nZ2VyID0gbmV3IExvZ2dlciAnRXhwb3J0X1RPX1hNTCdcblxuX3dyaXRlWG1sRmlsZSA9IChqc29uT2JqLG9iak5hbWUpIC0+XG5cdCMg6L2seG1sXG5cdGJ1aWxkZXIgPSBuZXcgeG1sMmpzLkJ1aWxkZXIoKVxuXHR4bWwgPSBidWlsZGVyLmJ1aWxkT2JqZWN0IGpzb25PYmpcblxuXHQjIOi9rOS4umJ1ZmZlclxuXHRzdHJlYW0gPSBuZXcgQnVmZmVyIHhtbFxuXG5cdCMg5qC55o2u5b2T5aSp5pe26Ze055qE5bm05pyI5pel5L2c5Li65a2Y5YKo6Lev5b6EXG5cdG5vdyA9IG5ldyBEYXRlXG5cdHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuXHRtb250aCA9IG5vdy5nZXRNb250aCgpICsgMVxuXHRkYXkgPSBub3cuZ2V0RGF0ZSgpXG5cblx0IyDmlofku7bot6/lvoRcblx0ZmlsZVBhdGggPSBwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCcuLi8uLi8uLi9leHBvcnQvJyArIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGRheSArICcvJyArIG9iak5hbWUgKVxuXHRmaWxlTmFtZSA9IGpzb25PYmo/Ll9pZCArIFwiLnhtbFwiXG5cdGZpbGVBZGRyZXNzID0gcGF0aC5qb2luIGZpbGVQYXRoLCBmaWxlTmFtZVxuXG5cdGlmICFmcy5leGlzdHNTeW5jIGZpbGVQYXRoXG5cdFx0bWtkaXJwLnN5bmMgZmlsZVBhdGhcblxuXHQjIOWGmeWFpeaWh+S7tlxuXHRmcy53cml0ZUZpbGUgZmlsZUFkZHJlc3MsIHN0cmVhbSwgKGVycikgLT5cblx0XHRpZiBlcnJcblx0XHRcdGxvZ2dlci5lcnJvciBcIiN7anNvbk9iai5faWR95YaZ5YWleG1s5paH5Lu25aSx6LSlXCIsZXJyXG5cdFxuXHRyZXR1cm4gZmlsZVBhdGhcblxuXG4jIOaVtOeQhkZpZWxkc+eahGpzb27mlbDmja5cbl9taXhGaWVsZHNEYXRhID0gKG9iaixvYmpOYW1lKSAtPlxuXHQjIOWIneWni+WMluWvueixoeaVsOaNrlxuXHRqc29uT2JqID0ge31cblx0IyDojrflj5ZmaWVsZHNcblx0b2JqRmllbGRzID0gQ3JlYXRvcj8uZ2V0T2JqZWN0KG9iak5hbWUpPy5maWVsZHNcblxuXHRtaXhEZWZhdWx0ID0gKGZpZWxkX25hbWUpLT5cblx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gb2JqW2ZpZWxkX25hbWVdIHx8IFwiXCJcblxuXHRtaXhEYXRlID0gKGZpZWxkX25hbWUsdHlwZSktPlxuXHRcdGRhdGUgPSBvYmpbZmllbGRfbmFtZV1cblx0XHRpZiB0eXBlID09IFwiZGF0ZVwiXG5cdFx0XHRmb3JtYXQgPSBcIllZWVktTU0tRERcIlxuXHRcdGVsc2Vcblx0XHRcdGZvcm1hdCA9IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiXG5cdFx0aWYgZGF0ZT8gYW5kIGZvcm1hdD9cblx0XHRcdGRhdGVTdHIgPSBtb21lbnQoZGF0ZSkuZm9ybWF0KGZvcm1hdClcblx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gZGF0ZVN0ciB8fCBcIlwiXG5cblx0bWl4Qm9vbCA9IChmaWVsZF9uYW1lKS0+XG5cdFx0aWYgb2JqW2ZpZWxkX25hbWVdID09IHRydWVcblx0XHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuaYr1wiXG5cdFx0ZWxzZSBpZiBvYmpbZmllbGRfbmFtZV0gPT0gZmFsc2Vcblx0XHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuWQplwiXG5cdFx0ZWxzZVxuXHRcdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IFwiXCJcblxuXHQjIOW+queOr+avj+S4qmZpZWxkcyzlubbliKTmlq3lj5blgLxcblx0Xy5lYWNoIG9iakZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0c3dpdGNoIGZpZWxkPy50eXBlXG5cdFx0XHR3aGVuIFwiZGF0ZVwiLFwiZGF0ZXRpbWVcIiB0aGVuIG1peERhdGUgZmllbGRfbmFtZSxmaWVsZC50eXBlXG5cdFx0XHR3aGVuIFwiYm9vbGVhblwiIHRoZW4gbWl4Qm9vbCBmaWVsZF9uYW1lXG5cdFx0XHRlbHNlIG1peERlZmF1bHQgZmllbGRfbmFtZVxuXG5cdHJldHVybiBqc29uT2JqXG5cbiMg6I635Y+W5a2Q6KGo5pW055CG5pWw5o2uXG5fbWl4UmVsYXRlZERhdGEgPSAob2JqLG9iak5hbWUpIC0+XG5cdCMg5Yid5aeL5YyW5a+56LGh5pWw5o2uXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IHt9XG5cblx0IyDojrflj5bnm7jlhbPooahcblx0cmVsYXRlZE9iak5hbWVzID0gQ3JlYXRvcj8uZ2V0QWxsUmVsYXRlZE9iamVjdHMgb2JqTmFtZVxuXG5cdCMg5b6q546v55u45YWz6KGoXG5cdHJlbGF0ZWRPYmpOYW1lcy5mb3JFYWNoIChyZWxhdGVkT2JqTmFtZSkgLT5cblx0XHQjIOavj+S4quihqOWumuS5ieS4gOS4quWvueixoeaVsOe7hFxuXHRcdHJlbGF0ZWRUYWJsZURhdGEgPSBbXVxuXG5cdFx0IyAq6K6+572u5YWz6IGU5pCc57Si5p+l6K+i55qE5a2X5q61XG5cdFx0IyDpmYTku7bnmoTlhbPogZTmkJzntKLlrZfmrrXmmK/lrprmrbvnmoRcblx0XHRpZiByZWxhdGVkT2JqTmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSBcInBhcmVudC5pZHNcIlxuXHRcdGVsc2Vcblx0XHRcdCMg6I635Y+WZmllbGRzXG5cdFx0XHRmaWVsZHMgPSBDcmVhdG9yPy5PYmplY3RzW3JlbGF0ZWRPYmpOYW1lXT8uZmllbGRzXG5cdFx0XHQjIOW+queOr+avj+S4qmZpZWxkLOaJvuWHunJlZmVyZW5jZV90b+eahOWFs+iBlOWtl+autVxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gXCJcIlxuXHRcdFx0Xy5lYWNoIGZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0XHRcdGlmIGZpZWxkPy5yZWZlcmVuY2VfdG8gPT0gb2JqTmFtZVxuXHRcdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IGZpZWxkX25hbWVcblxuXHRcdCMg5qC55o2u5om+5Ye655qE5YWz6IGU5a2X5q6177yM5p+l5a2Q6KGo5pWw5o2uXG5cdFx0aWYgcmVsYXRlZF9maWVsZF9uYW1lXG5cdFx0XHRyZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqTmFtZSlcblx0XHRcdCMg6I635Y+W5Yiw5omA5pyJ55qE5pWw5o2uXG5cdFx0XHRyZWxhdGVkUmVjb3JkTGlzdCA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoe1wiI3tyZWxhdGVkX2ZpZWxkX25hbWV9XCI6b2JqLl9pZH0pLmZldGNoKClcblx0XHRcdCMg5b6q546v5q+P5LiA5p2h5pWw5o2uXG5cdFx0XHRyZWxhdGVkUmVjb3JkTGlzdC5mb3JFYWNoIChyZWxhdGVkT2JqKS0+XG5cdFx0XHRcdCMg5pW05ZCIZmllbGRz5pWw5o2uXG5cdFx0XHRcdGZpZWxkc0RhdGEgPSBfbWl4RmllbGRzRGF0YSByZWxhdGVkT2JqLHJlbGF0ZWRPYmpOYW1lXG5cdFx0XHRcdCMg5oqK5LiA5p2h6K6w5b2V5o+S5YWl5Yiw5a+56LGh5pWw57uE5LitXG5cdFx0XHRcdHJlbGF0ZWRUYWJsZURhdGEucHVzaCBmaWVsZHNEYXRhXG5cblx0XHQjIOaKiuS4gOS4quWtkOihqOeahOaJgOacieaVsOaNruaPkuWFpeWIsHJlbGF0ZWRfb2JqZWN0c+S4re+8jOWGjeW+queOr+S4i+S4gOS4qlxuXHRcdHJlbGF0ZWRfb2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0gPSByZWxhdGVkVGFibGVEYXRhXG5cblx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xuXG4jIENyZWF0b3IuRXhwb3J0MnhtbCgpXG5DcmVhdG9yLkV4cG9ydDJ4bWwgPSAob2JqTmFtZSwgcmVjb3JkTGlzdCkgLT5cblx0bG9nZ2VyLmluZm8gXCJSdW4gQ3JlYXRvci5FeHBvcnQyeG1sXCJcblxuXHRjb25zb2xlLnRpbWUgXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIlxuXG5cdCMg5rWL6K+V5pWw5o2uXG5cdCMgb2JqTmFtZSA9IFwiYXJjaGl2ZV9yZWNvcmRzXCJcblxuXHQjIOafpeaJvuWvueixoeaVsOaNrlxuXHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iak5hbWUpXG5cdCMg5rWL6K+V5pWw5o2uXG5cdHJlY29yZExpc3QgPSBjb2xsZWN0aW9uLmZpbmQoe30pLmZldGNoKClcblxuXHRyZWNvcmRMaXN0LmZvckVhY2ggKHJlY29yZE9iaiktPlxuXHRcdGpzb25PYmogPSB7fVxuXHRcdGpzb25PYmouX2lkID0gcmVjb3JkT2JqLl9pZFxuXG5cdFx0IyDmlbTnkIbkuLvooajnmoRGaWVsZHPmlbDmja5cblx0XHRmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEgcmVjb3JkT2JqLG9iak5hbWVcblx0XHRqc29uT2JqW29iak5hbWVdID0gZmllbGRzRGF0YVxuXG5cdFx0IyDmlbTnkIbnm7jlhbPooajmlbDmja5cblx0XHRyZWxhdGVkX29iamVjdHMgPSBfbWl4UmVsYXRlZERhdGEgcmVjb3JkT2JqLG9iak5hbWVcblxuXHRcdGpzb25PYmpbXCJyZWxhdGVkX29iamVjdHNcIl0gPSByZWxhdGVkX29iamVjdHNcblxuXHRcdCMg6L2s5Li6eG1s5L+d5a2Y5paH5Lu2XG5cdFx0ZmlsZVBhdGggPSBfd3JpdGVYbWxGaWxlIGpzb25PYmosb2JqTmFtZVxuXG5cdGNvbnNvbGUudGltZUVuZCBcIkNyZWF0b3IuRXhwb3J0MnhtbFwiXG5cdHJldHVybiBmaWxlUGF0aCIsInZhciBfbWl4RmllbGRzRGF0YSwgX21peFJlbGF0ZWREYXRhLCBfd3JpdGVYbWxGaWxlLCBmcywgbG9nZ2VyLCBta2RpcnAsIHBhdGgsIHhtbDJqcztcblxueG1sMmpzID0gcmVxdWlyZSgneG1sMmpzJyk7XG5cbmZzID0gcmVxdWlyZSgnZnMnKTtcblxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxubWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJyk7XG5cbmxvZ2dlciA9IG5ldyBMb2dnZXIoJ0V4cG9ydF9UT19YTUwnKTtcblxuX3dyaXRlWG1sRmlsZSA9IGZ1bmN0aW9uKGpzb25PYmosIG9iak5hbWUpIHtcbiAgdmFyIGJ1aWxkZXIsIGRheSwgZmlsZUFkZHJlc3MsIGZpbGVOYW1lLCBmaWxlUGF0aCwgbW9udGgsIG5vdywgc3RyZWFtLCB4bWwsIHllYXI7XG4gIGJ1aWxkZXIgPSBuZXcgeG1sMmpzLkJ1aWxkZXIoKTtcbiAgeG1sID0gYnVpbGRlci5idWlsZE9iamVjdChqc29uT2JqKTtcbiAgc3RyZWFtID0gbmV3IEJ1ZmZlcih4bWwpO1xuICBub3cgPSBuZXcgRGF0ZTtcbiAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMTtcbiAgZGF5ID0gbm93LmdldERhdGUoKTtcbiAgZmlsZVBhdGggPSBwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCAnLi4vLi4vLi4vZXhwb3J0LycgKyB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBkYXkgKyAnLycgKyBvYmpOYW1lKTtcbiAgZmlsZU5hbWUgPSAoanNvbk9iaiAhPSBudWxsID8ganNvbk9iai5faWQgOiB2b2lkIDApICsgXCIueG1sXCI7XG4gIGZpbGVBZGRyZXNzID0gcGF0aC5qb2luKGZpbGVQYXRoLCBmaWxlTmFtZSk7XG4gIGlmICghZnMuZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcbiAgICBta2RpcnAuc3luYyhmaWxlUGF0aCk7XG4gIH1cbiAgZnMud3JpdGVGaWxlKGZpbGVBZGRyZXNzLCBzdHJlYW0sIGZ1bmN0aW9uKGVycikge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHJldHVybiBsb2dnZXIuZXJyb3IoanNvbk9iai5faWQgKyBcIuWGmeWFpXhtbOaWh+S7tuWksei0pVwiLCBlcnIpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmaWxlUGF0aDtcbn07XG5cbl9taXhGaWVsZHNEYXRhID0gZnVuY3Rpb24ob2JqLCBvYmpOYW1lKSB7XG4gIHZhciBqc29uT2JqLCBtaXhCb29sLCBtaXhEYXRlLCBtaXhEZWZhdWx0LCBvYmpGaWVsZHMsIHJlZjtcbiAganNvbk9iaiA9IHt9O1xuICBvYmpGaWVsZHMgPSB0eXBlb2YgQ3JlYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBDcmVhdG9yICE9PSBudWxsID8gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iak5hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgbWl4RGVmYXVsdCA9IGZ1bmN0aW9uKGZpZWxkX25hbWUpIHtcbiAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IG9ialtmaWVsZF9uYW1lXSB8fCBcIlwiO1xuICB9O1xuICBtaXhEYXRlID0gZnVuY3Rpb24oZmllbGRfbmFtZSwgdHlwZSkge1xuICAgIHZhciBkYXRlLCBkYXRlU3RyLCBmb3JtYXQ7XG4gICAgZGF0ZSA9IG9ialtmaWVsZF9uYW1lXTtcbiAgICBpZiAodHlwZSA9PT0gXCJkYXRlXCIpIHtcbiAgICAgIGZvcm1hdCA9IFwiWVlZWS1NTS1ERFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW06c3NcIjtcbiAgICB9XG4gICAgaWYgKChkYXRlICE9IG51bGwpICYmIChmb3JtYXQgIT0gbnVsbCkpIHtcbiAgICAgIGRhdGVTdHIgPSBtb21lbnQoZGF0ZSkuZm9ybWF0KGZvcm1hdCk7XG4gICAgfVxuICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gZGF0ZVN0ciB8fCBcIlwiO1xuICB9O1xuICBtaXhCb29sID0gZnVuY3Rpb24oZmllbGRfbmFtZSkge1xuICAgIGlmIChvYmpbZmllbGRfbmFtZV0gPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLmmK9cIjtcbiAgICB9IGVsc2UgaWYgKG9ialtmaWVsZF9uYW1lXSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLlkKZcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIlwiO1xuICAgIH1cbiAgfTtcbiAgXy5lYWNoKG9iakZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBzd2l0Y2ggKGZpZWxkICE9IG51bGwgPyBmaWVsZC50eXBlIDogdm9pZCAwKSB7XG4gICAgICBjYXNlIFwiZGF0ZVwiOlxuICAgICAgY2FzZSBcImRhdGV0aW1lXCI6XG4gICAgICAgIHJldHVybiBtaXhEYXRlKGZpZWxkX25hbWUsIGZpZWxkLnR5cGUpO1xuICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgcmV0dXJuIG1peEJvb2woZmllbGRfbmFtZSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbWl4RGVmYXVsdChmaWVsZF9uYW1lKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4ganNvbk9iajtcbn07XG5cbl9taXhSZWxhdGVkRGF0YSA9IGZ1bmN0aW9uKG9iaiwgb2JqTmFtZSkge1xuICB2YXIgcmVsYXRlZE9iak5hbWVzLCByZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IHt9O1xuICByZWxhdGVkT2JqTmFtZXMgPSB0eXBlb2YgQ3JlYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBDcmVhdG9yICE9PSBudWxsID8gQ3JlYXRvci5nZXRBbGxSZWxhdGVkT2JqZWN0cyhvYmpOYW1lKSA6IHZvaWQgMDtcbiAgcmVsYXRlZE9iak5hbWVzLmZvckVhY2goZnVuY3Rpb24ocmVsYXRlZE9iak5hbWUpIHtcbiAgICB2YXIgZmllbGRzLCBvYmoxLCByZWYsIHJlbGF0ZWRDb2xsZWN0aW9uLCByZWxhdGVkUmVjb3JkTGlzdCwgcmVsYXRlZFRhYmxlRGF0YSwgcmVsYXRlZF9maWVsZF9uYW1lO1xuICAgIHJlbGF0ZWRUYWJsZURhdGEgPSBbXTtcbiAgICBpZiAocmVsYXRlZE9iak5hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwicGFyZW50Lmlkc1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWVsZHMgPSB0eXBlb2YgQ3JlYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBDcmVhdG9yICE9PSBudWxsID8gKHJlZiA9IENyZWF0b3IuT2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0pICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gXCJcIjtcbiAgICAgIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgICAgIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnJlZmVyZW5jZV90byA6IHZvaWQgMCkgPT09IG9iak5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9maWVsZF9uYW1lID0gZmllbGRfbmFtZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChyZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgIHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmpOYW1lKTtcbiAgICAgIHJlbGF0ZWRSZWNvcmRMaXN0ID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZCgoXG4gICAgICAgIG9iajEgPSB7fSxcbiAgICAgICAgb2JqMVtcIlwiICsgcmVsYXRlZF9maWVsZF9uYW1lXSA9IG9iai5faWQsXG4gICAgICAgIG9iajFcbiAgICAgICkpLmZldGNoKCk7XG4gICAgICByZWxhdGVkUmVjb3JkTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHJlbGF0ZWRPYmopIHtcbiAgICAgICAgdmFyIGZpZWxkc0RhdGE7XG4gICAgICAgIGZpZWxkc0RhdGEgPSBfbWl4RmllbGRzRGF0YShyZWxhdGVkT2JqLCByZWxhdGVkT2JqTmFtZSk7XG4gICAgICAgIHJldHVybiByZWxhdGVkVGFibGVEYXRhLnB1c2goZmllbGRzRGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0gPSByZWxhdGVkVGFibGVEYXRhO1xuICB9KTtcbiAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbn07XG5cbkNyZWF0b3IuRXhwb3J0MnhtbCA9IGZ1bmN0aW9uKG9iak5hbWUsIHJlY29yZExpc3QpIHtcbiAgdmFyIGNvbGxlY3Rpb247XG4gIGxvZ2dlci5pbmZvKFwiUnVuIENyZWF0b3IuRXhwb3J0MnhtbFwiKTtcbiAgY29uc29sZS50aW1lKFwiQ3JlYXRvci5FeHBvcnQyeG1sXCIpO1xuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iak5hbWUpO1xuICByZWNvcmRMaXN0ID0gY29sbGVjdGlvbi5maW5kKHt9KS5mZXRjaCgpO1xuICByZWNvcmRMaXN0LmZvckVhY2goZnVuY3Rpb24ocmVjb3JkT2JqKSB7XG4gICAgdmFyIGZpZWxkc0RhdGEsIGZpbGVQYXRoLCBqc29uT2JqLCByZWxhdGVkX29iamVjdHM7XG4gICAganNvbk9iaiA9IHt9O1xuICAgIGpzb25PYmouX2lkID0gcmVjb3JkT2JqLl9pZDtcbiAgICBmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEocmVjb3JkT2JqLCBvYmpOYW1lKTtcbiAgICBqc29uT2JqW29iak5hbWVdID0gZmllbGRzRGF0YTtcbiAgICByZWxhdGVkX29iamVjdHMgPSBfbWl4UmVsYXRlZERhdGEocmVjb3JkT2JqLCBvYmpOYW1lKTtcbiAgICBqc29uT2JqW1wicmVsYXRlZF9vYmplY3RzXCJdID0gcmVsYXRlZF9vYmplY3RzO1xuICAgIHJldHVybiBmaWxlUGF0aCA9IF93cml0ZVhtbEZpbGUoanNvbk9iaiwgb2JqTmFtZSk7XG4gIH0pO1xuICBjb25zb2xlLnRpbWVFbmQoXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIik7XG4gIHJldHVybiBmaWxlUGF0aDtcbn07XG4iLCJNZXRlb3IubWV0aG9kcyBcblx0cmVsYXRlZF9vYmplY3RzX3JlY29yZHM6IChvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpLT5cblx0XHR1c2VySWQgPSB0aGlzLnVzZXJJZFxuXHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXG5cdFx0XHRzZWxlY3RvciA9IHtcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWR9XG5cdFx0ZWxzZVxuXHRcdFx0c2VsZWN0b3IgPSB7c3BhY2U6IHNwYWNlSWR9XG5cdFx0XG5cdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHQjIOmZhOS7tueahOWFs+iBlOaQnOe0ouadoeS7tuaYr+Wumuatu+eahFxuXHRcdFx0c2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lXG5cdFx0XHRzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXVxuXHRcdGVsc2Vcblx0XHRcdHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWRcblxuXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdFx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcblx0XHRcdHNlbGVjdG9yLm93bmVyID0gdXNlcklkXG5cdFx0XG5cdFx0cmVsYXRlZF9yZWNvcmRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpXG5cdFx0cmV0dXJuIHJlbGF0ZWRfcmVjb3Jkcy5jb3VudCgpIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICByZWxhdGVkX29iamVjdHNfcmVjb3JkczogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZUlkKSB7XG4gICAgdmFyIHBlcm1pc3Npb25zLCByZWxhdGVkX3JlY29yZHMsIHNlbGVjdG9yLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIikge1xuICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgIFwibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIikge1xuICAgICAgc2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lO1xuICAgICAgc2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWQ7XG4gICAgfVxuICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICAgIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMuYWxsb3dSZWFkKSB7XG4gICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZDtcbiAgICB9XG4gICAgcmVsYXRlZF9yZWNvcmRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpO1xuICAgIHJldHVybiByZWxhdGVkX3JlY29yZHMuY291bnQoKTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRnZXRQZW5kaW5nU3BhY2VJbmZvOiAoaW52aXRlcklkLCBzcGFjZUlkKS0+XG5cdFx0aW52aXRlck5hbWUgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IGludml0ZXJJZH0pLm5hbWVcblx0XHRzcGFjZU5hbWUgPSBkYi5zcGFjZXMuZmluZE9uZSh7X2lkOiBzcGFjZUlkfSkubmFtZVxuXG5cdFx0cmV0dXJuIHtpbnZpdGVyOiBpbnZpdGVyTmFtZSwgc3BhY2U6IHNwYWNlTmFtZX1cblxuXHRyZWZ1c2VKb2luU3BhY2U6IChfaWQpLT5cblx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IF9pZH0seyRzZXQ6IHtpbnZpdGVfc3RhdGU6IFwicmVmdXNlZFwifX0pXG5cblx0YWNjZXB0Sm9pblNwYWNlOiAoX2lkKS0+XG5cdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBfaWR9LHskc2V0OiB7aW52aXRlX3N0YXRlOiBcImFjY2VwdGVkXCIsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9fSlcblxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBnZXRQZW5kaW5nU3BhY2VJbmZvOiBmdW5jdGlvbihpbnZpdGVySWQsIHNwYWNlSWQpIHtcbiAgICB2YXIgaW52aXRlck5hbWUsIHNwYWNlTmFtZTtcbiAgICBpbnZpdGVyTmFtZSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBpbnZpdGVySWRcbiAgICB9KS5uYW1lO1xuICAgIHNwYWNlTmFtZSA9IGRiLnNwYWNlcy5maW5kT25lKHtcbiAgICAgIF9pZDogc3BhY2VJZFxuICAgIH0pLm5hbWU7XG4gICAgcmV0dXJuIHtcbiAgICAgIGludml0ZXI6IGludml0ZXJOYW1lLFxuICAgICAgc3BhY2U6IHNwYWNlTmFtZVxuICAgIH07XG4gIH0sXG4gIHJlZnVzZUpvaW5TcGFjZTogZnVuY3Rpb24oX2lkKSB7XG4gICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGludml0ZV9zdGF0ZTogXCJyZWZ1c2VkXCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgYWNjZXB0Sm9pblNwYWNlOiBmdW5jdGlvbihfaWQpIHtcbiAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IF9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgaW52aXRlX3N0YXRlOiBcImFjY2VwdGVkXCIsXG4gICAgICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IucHVibGlzaCBcImNyZWF0b3Jfb2JqZWN0X3JlY29yZFwiLCAob2JqZWN0X25hbWUsIGlkLCBzcGFjZV9pZCktPlxuXHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZClcblx0aWYgY29sbGVjdGlvblxuXHRcdHJldHVybiBjb2xsZWN0aW9uLmZpbmQoe19pZDogaWR9KVxuXG4iLCJNZXRlb3IucHVibGlzaChcImNyZWF0b3Jfb2JqZWN0X3JlY29yZFwiLCBmdW5jdGlvbihvYmplY3RfbmFtZSwgaWQsIHNwYWNlX2lkKSB7XG4gIHZhciBjb2xsZWN0aW9uO1xuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCk7XG4gIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICBfaWQ6IGlkXG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUgXCJzdGVlZG9zX29iamVjdF90YWJ1bGFyXCIsICh0YWJsZU5hbWUsIGlkcywgZmllbGRzLCBzcGFjZUlkKS0+XG5cdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRjaGVjayh0YWJsZU5hbWUsIFN0cmluZyk7XG5cdGNoZWNrKGlkcywgQXJyYXkpO1xuXHRjaGVjayhmaWVsZHMsIE1hdGNoLk9wdGlvbmFsKE9iamVjdCkpO1xuXG5cdF9vYmplY3RfbmFtZSA9IHRhYmxlTmFtZS5yZXBsYWNlKFwiY3JlYXRvcl9cIixcIlwiKVxuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX29iamVjdF9uYW1lLCBzcGFjZUlkKVxuXG5cdGlmIHNwYWNlSWRcblx0XHRfb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldE9iamVjdE5hbWUoX29iamVjdClcblxuXHRvYmplY3RfY29sbGVjaXRvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihfb2JqZWN0X25hbWUpXG5cblxuXHRfZmllbGRzID0gX29iamVjdD8uZmllbGRzXG5cdGlmICFfZmllbGRzIHx8ICFvYmplY3RfY29sbGVjaXRvblxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRyZWZlcmVuY2VfZmllbGRzID0gXy5maWx0ZXIgX2ZpZWxkcywgKGYpLT5cblx0XHRyZXR1cm4gXy5pc0Z1bmN0aW9uKGYucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KGYucmVmZXJlbmNlX3RvKVxuXG5cdHNlbGYgPSB0aGlzXG5cblx0c2VsZi51bmJsb2NrKCk7XG5cblx0aWYgcmVmZXJlbmNlX2ZpZWxkcy5sZW5ndGggPiAwXG5cdFx0ZGF0YSA9IHtcblx0XHRcdGZpbmQ6ICgpLT5cblx0XHRcdFx0c2VsZi51bmJsb2NrKCk7XG5cdFx0XHRcdGZpZWxkX2tleXMgPSB7fVxuXHRcdFx0XHRfLmVhY2ggXy5rZXlzKGZpZWxkcyksIChmKS0+XG5cdFx0XHRcdFx0dW5sZXNzIC9cXHcrKFxcLlxcJCl7MX1cXHc/Ly50ZXN0KGYpXG5cdFx0XHRcdFx0XHRmaWVsZF9rZXlzW2ZdID0gMVxuXHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe19pZDogeyRpbjogaWRzfX0sIHtmaWVsZHM6IGZpZWxkX2tleXN9KTtcblx0XHR9XG5cblx0XHRkYXRhLmNoaWxkcmVuID0gW11cblxuXHRcdGtleXMgPSBfLmtleXMoZmllbGRzKVxuXG5cdFx0aWYga2V5cy5sZW5ndGggPCAxXG5cdFx0XHRrZXlzID0gXy5rZXlzKF9maWVsZHMpXG5cblx0XHRfa2V5cyA9IFtdXG5cblx0XHRrZXlzLmZvckVhY2ggKGtleSktPlxuXHRcdFx0aWYgX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXVxuXHRcdFx0XHRfa2V5cyA9IF9rZXlzLmNvbmNhdChfLm1hcChfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddLCAoayktPlxuXHRcdFx0XHRcdHJldHVybiBrZXkgKyAnLicgKyBrXG5cdFx0XHRcdCkpXG5cdFx0XHRfa2V5cy5wdXNoKGtleSlcblxuXHRcdF9rZXlzLmZvckVhY2ggKGtleSktPlxuXHRcdFx0cmVmZXJlbmNlX2ZpZWxkID0gX2ZpZWxkc1trZXldXG5cblx0XHRcdGlmIHJlZmVyZW5jZV9maWVsZCAmJiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykpICAjIGFuZCBDcmVhdG9yLkNvbGxlY3Rpb25zW3JlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG9dXG5cdFx0XHRcdGRhdGEuY2hpbGRyZW4ucHVzaCB7XG5cdFx0XHRcdFx0ZmluZDogKHBhcmVudCkgLT5cblx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRzZWxmLnVuYmxvY2soKTtcblxuXHRcdFx0XHRcdFx0XHRxdWVyeSA9IHt9XG5cblx0XHRcdFx0XHRcdFx0IyDooajmoLzlrZDlrZfmrrXnibnmrorlpITnkIZcblx0XHRcdFx0XHRcdFx0aWYgL1xcdysoXFwuXFwkXFwuKXsxfVxcdysvLnRlc3Qoa2V5KVxuXHRcdFx0XHRcdFx0XHRcdHBfayA9IGtleS5yZXBsYWNlKC8oXFx3KylcXC5cXCRcXC5cXHcrL2lnLCBcIiQxXCIpXG5cdFx0XHRcdFx0XHRcdFx0c19rID0ga2V5LnJlcGxhY2UoL1xcdytcXC5cXCRcXC4oXFx3KykvaWcsIFwiJDFcIilcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfaWRzID0gcGFyZW50W3Bfa10uZ2V0UHJvcGVydHkoc19rKVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX2lkcyA9IGtleS5zcGxpdCgnLicpLnJlZHVjZSAobywgeCkgLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0bz9beF1cblx0XHRcdFx0XHRcdFx0XHQsIHBhcmVudFxuXG5cdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG9cblxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90bygpXG5cblx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KHJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRpZiBfLmlzT2JqZWN0KHJlZmVyZW5jZV9pZHMpICYmICFfLmlzQXJyYXkocmVmZXJlbmNlX2lkcylcblx0XHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9pZHMub1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX2lkcyA9IHJlZmVyZW5jZV9pZHMuaWRzIHx8IFtdXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFtdXG5cblx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpXG5cdFx0XHRcdFx0XHRcdFx0cXVlcnkuX2lkID0geyRpbjogcmVmZXJlbmNlX2lkc31cblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHJlZmVyZW5jZV9pZHNcblxuXHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG9fb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxuXG5cdFx0XHRcdFx0XHRcdG5hbWVfZmllbGRfa2V5ID0gcmVmZXJlbmNlX3RvX29iamVjdC5OQU1FX0ZJRUxEX0tFWVxuXG5cdFx0XHRcdFx0XHRcdGNoaWxkcmVuX2ZpZWxkcyA9IHtfaWQ6IDEsIHNwYWNlOiAxfVxuXG5cdFx0XHRcdFx0XHRcdGlmIG5hbWVfZmllbGRfa2V5XG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW5fZmllbGRzW25hbWVfZmllbGRfa2V5XSA9IDFcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZChxdWVyeSwge1xuXHRcdFx0XHRcdFx0XHRcdGZpZWxkczogY2hpbGRyZW5fZmllbGRzXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhyZWZlcmVuY2VfdG8sIHBhcmVudCwgZSlcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFtdXG5cdFx0XHRcdH1cblxuXHRcdHJldHVybiBkYXRhXG5cdGVsc2Vcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZmluZDogKCktPlxuXHRcdFx0XHRzZWxmLnVuYmxvY2soKTtcblx0XHRcdFx0cmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe19pZDogeyRpbjogaWRzfX0sIHtmaWVsZHM6IGZpZWxkc30pXG5cdFx0fTtcblxuIiwiTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUoXCJzdGVlZG9zX29iamVjdF90YWJ1bGFyXCIsIGZ1bmN0aW9uKHRhYmxlTmFtZSwgaWRzLCBmaWVsZHMsIHNwYWNlSWQpIHtcbiAgdmFyIF9maWVsZHMsIF9rZXlzLCBfb2JqZWN0LCBfb2JqZWN0X25hbWUsIGRhdGEsIGtleXMsIG9iamVjdF9jb2xsZWNpdG9uLCByZWZlcmVuY2VfZmllbGRzLCBzZWxmO1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBjaGVjayh0YWJsZU5hbWUsIFN0cmluZyk7XG4gIGNoZWNrKGlkcywgQXJyYXkpO1xuICBjaGVjayhmaWVsZHMsIE1hdGNoLk9wdGlvbmFsKE9iamVjdCkpO1xuICBfb2JqZWN0X25hbWUgPSB0YWJsZU5hbWUucmVwbGFjZShcImNyZWF0b3JfXCIsIFwiXCIpO1xuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX29iamVjdF9uYW1lLCBzcGFjZUlkKTtcbiAgaWYgKHNwYWNlSWQpIHtcbiAgICBfb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldE9iamVjdE5hbWUoX29iamVjdCk7XG4gIH1cbiAgb2JqZWN0X2NvbGxlY2l0b24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oX29iamVjdF9uYW1lKTtcbiAgX2ZpZWxkcyA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZmllbGRzIDogdm9pZCAwO1xuICBpZiAoIV9maWVsZHMgfHwgIW9iamVjdF9jb2xsZWNpdG9uKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZWZlcmVuY2VfZmllbGRzID0gXy5maWx0ZXIoX2ZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgIHJldHVybiBfLmlzRnVuY3Rpb24oZi5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkoZi5yZWZlcmVuY2VfdG8pO1xuICB9KTtcbiAgc2VsZiA9IHRoaXM7XG4gIHNlbGYudW5ibG9jaygpO1xuICBpZiAocmVmZXJlbmNlX2ZpZWxkcy5sZW5ndGggPiAwKSB7XG4gICAgZGF0YSA9IHtcbiAgICAgIGZpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZmllbGRfa2V5cztcbiAgICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICAgIGZpZWxkX2tleXMgPSB7fTtcbiAgICAgICAgXy5lYWNoKF8ua2V5cyhmaWVsZHMpLCBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgaWYgKCEvXFx3KyhcXC5cXCQpezF9XFx3Py8udGVzdChmKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkX2tleXNbZl0gPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtcbiAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICRpbjogaWRzXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBmaWVsZF9rZXlzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgZGF0YS5jaGlsZHJlbiA9IFtdO1xuICAgIGtleXMgPSBfLmtleXMoZmllbGRzKTtcbiAgICBpZiAoa2V5cy5sZW5ndGggPCAxKSB7XG4gICAgICBrZXlzID0gXy5rZXlzKF9maWVsZHMpO1xuICAgIH1cbiAgICBfa2V5cyA9IFtdO1xuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmIChfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddKSB7XG4gICAgICAgIF9rZXlzID0gX2tleXMuY29uY2F0KF8ubWFwKF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ10sIGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICByZXR1cm4ga2V5ICsgJy4nICsgaztcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9rZXlzLnB1c2goa2V5KTtcbiAgICB9KTtcbiAgICBfa2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIHJlZmVyZW5jZV9maWVsZDtcbiAgICAgIHJlZmVyZW5jZV9maWVsZCA9IF9maWVsZHNba2V5XTtcbiAgICAgIGlmIChyZWZlcmVuY2VfZmllbGQgJiYgKF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pKSkge1xuICAgICAgICByZXR1cm4gZGF0YS5jaGlsZHJlbi5wdXNoKHtcbiAgICAgICAgICBmaW5kOiBmdW5jdGlvbihwYXJlbnQpIHtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbl9maWVsZHMsIGUsIG5hbWVfZmllbGRfa2V5LCBwX2ssIHF1ZXJ5LCByZWZlcmVuY2VfaWRzLCByZWZlcmVuY2VfdG8sIHJlZmVyZW5jZV90b19vYmplY3QsIHNfaztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHNlbGYudW5ibG9jaygpO1xuICAgICAgICAgICAgICBxdWVyeSA9IHt9O1xuICAgICAgICAgICAgICBpZiAoL1xcdysoXFwuXFwkXFwuKXsxfVxcdysvLnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgIHBfayA9IGtleS5yZXBsYWNlKC8oXFx3KylcXC5cXCRcXC5cXHcrL2lnLCBcIiQxXCIpO1xuICAgICAgICAgICAgICAgIHNfayA9IGtleS5yZXBsYWNlKC9cXHcrXFwuXFwkXFwuKFxcdyspL2lnLCBcIiQxXCIpO1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZV9pZHMgPSBwYXJlbnRbcF9rXS5nZXRQcm9wZXJ0eShzX2spO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZV9pZHMgPSBrZXkuc3BsaXQoJy4nKS5yZWR1Y2UoZnVuY3Rpb24obywgeCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIG8gIT0gbnVsbCA/IG9beF0gOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgfSwgcGFyZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8oKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChyZWZlcmVuY2VfaWRzKSAmJiAhXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpKSB7XG4gICAgICAgICAgICAgICAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfaWRzLm87XG4gICAgICAgICAgICAgICAgICByZWZlcmVuY2VfaWRzID0gcmVmZXJlbmNlX2lkcy5pZHMgfHwgW107XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKF8uaXNBcnJheShyZWZlcmVuY2VfaWRzKSkge1xuICAgICAgICAgICAgICAgIHF1ZXJ5Ll9pZCA9IHtcbiAgICAgICAgICAgICAgICAgICRpbjogcmVmZXJlbmNlX2lkc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcXVlcnkuX2lkID0gcmVmZXJlbmNlX2lkcztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWZlcmVuY2VfdG9fb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVmZXJlbmNlX3RvLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgbmFtZV9maWVsZF9rZXkgPSByZWZlcmVuY2VfdG9fb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICAgICAgICAgICAgICBjaGlsZHJlbl9maWVsZHMgPSB7XG4gICAgICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgICAgIHNwYWNlOiAxXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGlmIChuYW1lX2ZpZWxkX2tleSkge1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuX2ZpZWxkc1tuYW1lX2ZpZWxkX2tleV0gPSAxO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kKHF1ZXJ5LCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiBjaGlsZHJlbl9maWVsZHNcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlZmVyZW5jZV90bywgcGFyZW50LCBlKTtcbiAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLnVuYmxvY2soKTtcbiAgICAgICAgcmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe1xuICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgJGluOiBpZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoIFwib2JqZWN0X2xpc3R2aWV3c1wiLCAob2JqZWN0X25hbWUsIHNwYWNlSWQpLT5cbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc3BhY2U6IHNwYWNlSWQgLFwiJG9yXCI6W3tvd25lcjogdXNlcklkfSwge3NoYXJlZDogdHJ1ZX1dfSkiLCJNZXRlb3IucHVibGlzaCBcInVzZXJfdGFidWxhcl9zZXR0aW5nc1wiLCAob2JqZWN0X25hbWUpLT5cbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmQoe29iamVjdF9uYW1lOiB7JGluOiBvYmplY3RfbmFtZX0sIHJlY29yZF9pZDogeyRpbjogW1wib2JqZWN0X2xpc3R2aWV3c1wiLCBcIm9iamVjdF9ncmlkdmlld3NcIl19LCBvd25lcjogdXNlcklkfSlcbiIsIk1ldGVvci5wdWJsaXNoIFwicmVsYXRlZF9vYmplY3RzX3JlY29yZHNcIiwgKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCktPlxuXHR1c2VySWQgPSB0aGlzLnVzZXJJZFxuXHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIlxuXHRcdHNlbGVjdG9yID0ge1wibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZH1cblx0ZWxzZVxuXHRcdHNlbGVjdG9yID0ge3NwYWNlOiBzcGFjZUlkfVxuXHRcblx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0IyDpmYTku7bnmoTlhbPogZTmkJzntKLmnaHku7bmmK/lrprmrbvnmoRcblx0XHRzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWVcblx0XHRzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXVxuXHRlbHNlXG5cdFx0c2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZFxuXG5cdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMuYWxsb3dSZWFkXG5cdFx0c2VsZWN0b3Iub3duZXIgPSB1c2VySWRcblx0XG5cdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3RvcikiLCJNZXRlb3IucHVibGlzaChcInJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzXCIsIGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCkge1xuICB2YXIgcGVybWlzc2lvbnMsIHNlbGVjdG9yLCB1c2VySWQ7XG4gIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiKSB7XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWRcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9O1xuICB9XG4gIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgc2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lO1xuICAgIHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdO1xuICB9IGVsc2Uge1xuICAgIHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWQ7XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMuYWxsb3dSZWFkKSB7XG4gICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gIH1cbiAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ3NwYWNlX3VzZXJfaW5mbycsIChzcGFjZUlkLCB1c2VySWQpLT5cblx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9KSIsIlxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cblx0TWV0ZW9yLnB1Ymxpc2ggJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJywgKHNwYWNlSWQpLT5cblxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdFx0dW5sZXNzIHNwYWNlSWRcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRcdHNlbGVjdG9yID1cblx0XHRcdHNwYWNlOiBzcGFjZUlkXG5cdFx0XHRrZXk6ICdjb250YWN0c192aWV3X2xpbWl0cydcblxuXHRcdHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKSIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBzZWxlY3RvcjtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBrZXk6ICdjb250YWN0c192aWV3X2xpbWl0cydcbiAgICB9O1xuICAgIHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKTtcbiAgfSk7XG59XG4iLCJcbmlmIE1ldGVvci5pc1NlcnZlclxuXG5cdE1ldGVvci5wdWJsaXNoICdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycycsIChzcGFjZUlkKS0+XG5cblx0XHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRcdHVubGVzcyBzcGFjZUlkXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0XHRzZWxlY3RvciA9XG5cdFx0XHRzcGFjZTogc3BhY2VJZFxuXHRcdFx0a2V5OiAnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnXG5cblx0XHRyZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3RvcikiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAga2V5OiAnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnXG4gICAgfTtcbiAgICByZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3Rvcik7XG4gIH0pO1xufVxuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG5cdE1ldGVvci5wdWJsaXNoICdzcGFjZV9uZWVkX3RvX2NvbmZpcm0nLCAoKS0+XG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcblx0XHRyZXR1cm4gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdXNlcklkLCBpbnZpdGVfc3RhdGU6IFwicGVuZGluZ1wifSkiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdzcGFjZV9uZWVkX3RvX2NvbmZpcm0nLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIGludml0ZV9zdGF0ZTogXCJwZW5kaW5nXCJcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJwZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9XG5cbnBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3dQZXJtaXNzaW9ucyA9IChmbG93X2lkLCB1c2VyX2lkKSAtPlxuXHQjIOagueaNrjpmbG93X2lk5p+l5Yiw5a+55bqU55qEZmxvd1xuXHRmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpXG5cdHNwYWNlX2lkID0gZmxvdy5zcGFjZVxuXHQjIOagueaNrnNwYWNlX2lk5ZKMOnVzZXJfaWTliLBvcmdhbml6YXRpb25z6KGo5Lit5p+l5Yiw55So5oi35omA5bGe5omA5pyJ55qEb3JnX2lk77yI5YyF5ous5LiK57qn57uESUTvvIlcblx0b3JnX2lkcyA9IG5ldyBBcnJheVxuXHRvcmdhbml6YXRpb25zID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcblx0XHRzcGFjZTogc3BhY2VfaWQsIHVzZXJzOiB1c2VyX2lkIH0sIHsgZmllbGRzOiB7IHBhcmVudHM6IDEgfSB9KS5mZXRjaCgpXG5cdF8uZWFjaChvcmdhbml6YXRpb25zLCAob3JnKSAtPlxuXHRcdG9yZ19pZHMucHVzaChvcmcuX2lkKVxuXHRcdGlmIG9yZy5wYXJlbnRzXG5cdFx0XHRfLmVhY2gob3JnLnBhcmVudHMsIChwYXJlbnRfaWQpIC0+XG5cdFx0XHRcdG9yZ19pZHMucHVzaChwYXJlbnRfaWQpXG5cdFx0XHQpXG5cdClcblx0b3JnX2lkcyA9IF8udW5pcShvcmdfaWRzKVxuXHRteV9wZXJtaXNzaW9ucyA9IG5ldyBBcnJheVxuXHRpZiBmbG93LnBlcm1zXG5cdFx0IyDliKTmlq1mbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbuS4reaYr+WQpuWMheWQq+W9k+WJjeeUqOaIt++8jFxuXHRcdCMg5oiW6ICFZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGTmmK/lkKbljIXlkKs05q2l5b6X5Yiw55qEb3JnX2lk5pWw57uE5Lit55qE5Lu75L2V5LiA5Liq77yMXG5cdFx0IyDoi6XmmK/vvIzliJnlnKjov5Tlm57nmoTmlbDnu4TkuK3liqDkuIphZGRcblx0XHRpZiBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGRcblx0XHRcdHVzZXJzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGRcblx0XHRcdGlmIHVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcl9pZClcblx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKVxuXG5cdFx0aWYgZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGRcblx0XHRcdG9yZ3NfY2FuX2FkZCA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRkXG5cdFx0XHRfLmVhY2gob3JnX2lkcywgKG9yZ19pZCkgLT5cblx0XHRcdFx0aWYgb3Jnc19jYW5fYWRkLmluY2x1ZGVzKG9yZ19pZClcblx0XHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpXG5cdFx0XHQpXG5cdFx0IyDliKTmlq1mbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9y5Lit5piv5ZCm5YyF5ZCr5b2T5YmN55So5oi377yMXG5cdFx0IyDmiJbogIVmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3LmmK/lkKbljIXlkKs05q2l5b6X5Yiw55qEb3JnX2lk5pWw57uE5Lit55qE5Lu75L2V5LiA5Liq77yMXG5cdFx0IyDoi6XmmK/vvIzliJnlnKjov5Tlm57nmoTmlbDnu4TkuK3liqDkuIptb25pdG9yXG5cdFx0aWYgZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvclxuXHRcdFx0dXNlcnNfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yXG5cdFx0XHRpZiB1c2Vyc19jYW5fbW9uaXRvci5pbmNsdWRlcyh1c2VyX2lkKVxuXHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKVxuXG5cdFx0aWYgZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yXG5cdFx0XHRvcmdzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yXG5cdFx0XHRfLmVhY2gob3JnX2lkcywgKG9yZ19pZCkgLT5cblx0XHRcdFx0aWYgb3Jnc19jYW5fbW9uaXRvci5pbmNsdWRlcyhvcmdfaWQpXG5cdFx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIilcblx0XHRcdClcblx0XHQjIOWIpOaWrWZsb3cucGVybXMudXNlcnNfY2FuX2FkbWlu5Lit5piv5ZCm5YyF5ZCr5b2T5YmN55So5oi377yMXG5cdFx0IyDmiJbogIVmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWlu5piv5ZCm5YyF5ZCrNOatpeW+l+WIsOeahG9yZ19pZOaVsOe7hOS4reeahOS7u+S9leS4gOS4qu+8jFxuXHRcdCMg6Iul5piv77yM5YiZ5Zyo6L+U5Zue55qE5pWw57uE5Lit5Yqg5LiKYWRtaW5cblx0XHRpZiBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pblxuXHRcdFx0dXNlcnNfY2FuX2FkbWluID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW5cblx0XHRcdGlmIHVzZXJzX2Nhbl9hZG1pbi5pbmNsdWRlcyh1c2VyX2lkKVxuXHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIilcblxuXHRcdGlmIGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW5cblx0XHRcdG9yZ3NfY2FuX2FkbWluID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pblxuXHRcdFx0Xy5lYWNoKG9yZ19pZHMsIChvcmdfaWQpIC0+XG5cdFx0XHRcdGlmIG9yZ3NfY2FuX2FkbWluLmluY2x1ZGVzKG9yZ19pZClcblx0XHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIilcblx0XHRcdClcblxuXHRteV9wZXJtaXNzaW9ucyA9IF8udW5pcShteV9wZXJtaXNzaW9ucylcblx0cmV0dXJuIG15X3Blcm1pc3Npb25zIiwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5wZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9O1xuXG5wZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93UGVybWlzc2lvbnMgPSBmdW5jdGlvbihmbG93X2lkLCB1c2VyX2lkKSB7XG4gIHZhciBmbG93LCBteV9wZXJtaXNzaW9ucywgb3JnX2lkcywgb3JnYW5pemF0aW9ucywgb3Jnc19jYW5fYWRkLCBvcmdzX2Nhbl9hZG1pbiwgb3Jnc19jYW5fbW9uaXRvciwgc3BhY2VfaWQsIHVzZXJzX2Nhbl9hZGQsIHVzZXJzX2Nhbl9hZG1pbiwgdXNlcnNfY2FuX21vbml0b3I7XG4gIGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZCk7XG4gIHNwYWNlX2lkID0gZmxvdy5zcGFjZTtcbiAgb3JnX2lkcyA9IG5ldyBBcnJheTtcbiAgb3JnYW5pemF0aW9ucyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHVzZXJzOiB1c2VyX2lkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHBhcmVudHM6IDFcbiAgICB9XG4gIH0pLmZldGNoKCk7XG4gIF8uZWFjaChvcmdhbml6YXRpb25zLCBmdW5jdGlvbihvcmcpIHtcbiAgICBvcmdfaWRzLnB1c2gob3JnLl9pZCk7XG4gICAgaWYgKG9yZy5wYXJlbnRzKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKG9yZy5wYXJlbnRzLCBmdW5jdGlvbihwYXJlbnRfaWQpIHtcbiAgICAgICAgcmV0dXJuIG9yZ19pZHMucHVzaChwYXJlbnRfaWQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgb3JnX2lkcyA9IF8udW5pcShvcmdfaWRzKTtcbiAgbXlfcGVybWlzc2lvbnMgPSBuZXcgQXJyYXk7XG4gIGlmIChmbG93LnBlcm1zKSB7XG4gICAgaWYgKGZsb3cucGVybXMudXNlcnNfY2FuX2FkZCkge1xuICAgICAgdXNlcnNfY2FuX2FkZCA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkZDtcbiAgICAgIGlmICh1c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJfaWQpKSB7XG4gICAgICAgIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZGRcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZCkge1xuICAgICAgb3Jnc19jYW5fYWRkID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGQ7XG4gICAgICBfLmVhY2gob3JnX2lkcywgZnVuY3Rpb24ob3JnX2lkKSB7XG4gICAgICAgIGlmIChvcmdzX2Nhbl9hZGQuaW5jbHVkZXMob3JnX2lkKSkge1xuICAgICAgICAgIHJldHVybiBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3IpIHtcbiAgICAgIHVzZXJzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvcjtcbiAgICAgIGlmICh1c2Vyc19jYW5fbW9uaXRvci5pbmNsdWRlcyh1c2VyX2lkKSkge1xuICAgICAgICBteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvcikge1xuICAgICAgb3Jnc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvcjtcbiAgICAgIF8uZWFjaChvcmdfaWRzLCBmdW5jdGlvbihvcmdfaWQpIHtcbiAgICAgICAgaWYgKG9yZ3NfY2FuX21vbml0b3IuaW5jbHVkZXMob3JnX2lkKSkge1xuICAgICAgICAgIHJldHVybiBteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbikge1xuICAgICAgdXNlcnNfY2FuX2FkbWluID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW47XG4gICAgICBpZiAodXNlcnNfY2FuX2FkbWluLmluY2x1ZGVzKHVzZXJfaWQpKSB7XG4gICAgICAgIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW4pIHtcbiAgICAgIG9yZ3NfY2FuX2FkbWluID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pbjtcbiAgICAgIF8uZWFjaChvcmdfaWRzLCBmdW5jdGlvbihvcmdfaWQpIHtcbiAgICAgICAgaWYgKG9yZ3NfY2FuX2FkbWluLmluY2x1ZGVzKG9yZ19pZCkpIHtcbiAgICAgICAgICByZXR1cm4gbXlfcGVybWlzc2lvbnMucHVzaChcImFkbWluXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgbXlfcGVybWlzc2lvbnMgPSBfLnVuaXEobXlfcGVybWlzc2lvbnMpO1xuICByZXR1cm4gbXlfcGVybWlzc2lvbnM7XG59O1xuIiwiX2V2YWwgPSByZXF1aXJlKCdldmFsJylcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwgPSB7fVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24gPSAocmVxKSAtPlxuXHRxdWVyeSA9IHJlcS5xdWVyeVxuXHR1c2VySWQgPSBxdWVyeVtcIlgtVXNlci1JZFwiXVxuXHRhdXRoVG9rZW4gPSBxdWVyeVtcIlgtQXV0aC1Ub2tlblwiXVxuXG5cdGlmIG5vdCB1c2VySWQgb3Igbm90IGF1dGhUb2tlblxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXG5cdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcblx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG5cdFx0X2lkOiB1c2VySWQsXG5cdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cblxuXHRpZiBub3QgdXNlclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXG5cdHJldHVybiB1c2VyXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2UgPSAoc3BhY2VfaWQpIC0+XG5cdHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcblx0aWYgbm90IHNwYWNlXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJzcGFjZV9pZOacieivr+aIluatpHNwYWNl5bey57uP6KKr5Yig6ZmkXCIpXG5cdHJldHVybiBzcGFjZVxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3cgPSAoZmxvd19pZCkgLT5cblx0ZmxvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZmxvd3MuZmluZE9uZShmbG93X2lkKVxuXHRpZiBub3QgZmxvd1xuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwiaWTmnInor6/miJbmraTmtYHnqIvlt7Lnu4/ooqvliKDpmaRcIilcblx0cmV0dXJuIGZsb3dcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXIgPSAoc3BhY2VfaWQsIHVzZXJfaWQpIC0+XG5cdHNwYWNlX3VzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlX3VzZXJzLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJfaWQgfSlcblx0aWYgbm90IHNwYWNlX3VzZXJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInVzZXJfaWTlr7nlupTnmoTnlKjmiLfkuI3lsZ7kuo7lvZPliY1zcGFjZVwiKVxuXHRyZXR1cm4gc3BhY2VfdXNlclxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8gPSAoc3BhY2VfdXNlcikgLT5cblx0aW5mbyA9IG5ldyBPYmplY3Rcblx0aW5mby5vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvblxuXHRvcmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9yZ2FuaXphdGlvbnMuZmluZE9uZShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbiwgeyBmaWVsZHM6IHsgbmFtZTogMSAsIGZ1bGxuYW1lOiAxIH0gfSlcblx0aW5mby5vcmdhbml6YXRpb25fbmFtZSA9IG9yZy5uYW1lXG5cdGluZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gb3JnLmZ1bGxuYW1lXG5cdHJldHVybiBpbmZvXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZCA9IChmbG93KSAtPlxuXHRpZiBmbG93LnN0YXRlIGlzbnQgXCJlbmFibGVkXCJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+acquWQr+eUqCzmk43kvZzlpLHotKVcIilcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQgPSAoZmxvdywgc3BhY2VfaWQpIC0+XG5cdGlmIGZsb3cuc3BhY2UgaXNudCBzcGFjZV9pZFxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5ZKM5bel5L2c5Yy6SUTkuI3ljLnphY1cIilcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtID0gKGZvcm1faWQpIC0+XG5cdGZvcm0gPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZvcm1zLmZpbmRPbmUoZm9ybV9pZClcblx0aWYgbm90IGZvcm1cblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn6KGo5Y2VSUTmnInor6/miJbmraTooajljZXlt7Lnu4/ooqvliKDpmaQnKVxuXG5cdHJldHVybiBmb3JtXG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Q2F0ZWdvcnkgPSAoY2F0ZWdvcnlfaWQpIC0+XG5cdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLmNhdGVnb3JpZXMuZmluZE9uZShjYXRlZ29yeV9pZClcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UgPSAoaW5zdGFuY2VfZnJvbV9jbGllbnQsIHVzZXJfaW5mbykgLT5cblx0Y2hlY2sgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0sIFN0cmluZ1xuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdLCBTdHJpbmdcblx0Y2hlY2sgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdLCBTdHJpbmdcblx0Y2hlY2sgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdLCBbe286IFN0cmluZywgaWRzOiBbU3RyaW5nXX1dXG5cblx0IyDmoKHpqozmmK/lkKZyZWNvcmTlt7Lnu4/lj5HotbfnmoTnlLPor7fov5jlnKjlrqHmibnkuK1cblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja0lzSW5BcHByb3ZhbChpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl1bMF0sIGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0pXG5cblx0c3BhY2VfaWQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdXG5cdGZsb3dfaWQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl1cblx0dXNlcl9pZCA9IHVzZXJfaW5mby5faWRcblx0IyDojrflj5bliY3lj7DmiYDkvKDnmoR0cmFjZVxuXHR0cmFjZV9mcm9tX2NsaWVudCA9IG51bGxcblx0IyDojrflj5bliY3lj7DmiYDkvKDnmoRhcHByb3ZlXG5cdGFwcHJvdmVfZnJvbV9jbGllbnQgPSBudWxsXG5cdGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdIGFuZCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXVxuXHRcdHRyYWNlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1cblx0XHRpZiB0cmFjZV9mcm9tX2NsaWVudFtcImFwcHJvdmVzXCJdIGFuZCB0cmFjZV9mcm9tX2NsaWVudFtcImFwcHJvdmVzXCJdWzBdXG5cdFx0XHRhcHByb3ZlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1bXCJhcHByb3Zlc1wiXVswXVxuXG5cdCMg6I635Y+W5LiA5Liqc3BhY2Vcblx0c3BhY2UgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlKHNwYWNlX2lkKVxuXHQjIOiOt+WPluS4gOS4qmZsb3dcblx0ZmxvdyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyhmbG93X2lkKVxuXHQjIOiOt+WPluS4gOS4qnNwYWNl5LiL55qE5LiA5LiqdXNlclxuXHRzcGFjZV91c2VyID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXIoc3BhY2VfaWQsIHVzZXJfaWQpXG5cdCMg6I635Y+Wc3BhY2VfdXNlcuaJgOWcqOeahOmDqOmXqOS/oeaBr1xuXHRzcGFjZV91c2VyX29yZ19pbmZvID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXJPcmdJbmZvKHNwYWNlX3VzZXIpXG5cdCMg5Yik5pat5LiA5LiqZmxvd+aYr+WQpuS4uuWQr+eUqOeKtuaAgVxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd0VuYWJsZWQoZmxvdylcblx0IyDliKTmlq3kuIDkuKpmbG935ZKMc3BhY2VfaWTmmK/lkKbljLnphY1cblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQoZmxvdywgc3BhY2VfaWQpXG5cblx0Zm9ybSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybShmbG93LmZvcm0pXG5cblx0cGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd19pZCwgdXNlcl9pZClcblxuXHRpZiBub3QgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZGRcIilcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuW9k+WJjeeUqOaIt+ayoeacieatpOa1geeoi+eahOaWsOW7uuadg+mZkFwiKVxuXG5cdG5vdyA9IG5ldyBEYXRlXG5cdGluc19vYmogPSB7fVxuXHRpbnNfb2JqLl9pZCA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLl9tYWtlTmV3SUQoKVxuXHRpbnNfb2JqLnNwYWNlID0gc3BhY2VfaWRcblx0aW5zX29iai5mbG93ID0gZmxvd19pZFxuXHRpbnNfb2JqLmZsb3dfdmVyc2lvbiA9IGZsb3cuY3VycmVudC5faWRcblx0aW5zX29iai5mb3JtID0gZmxvdy5mb3JtXG5cdGluc19vYmouZm9ybV92ZXJzaW9uID0gZmxvdy5jdXJyZW50LmZvcm1fdmVyc2lvblxuXHRpbnNfb2JqLm5hbWUgPSBmbG93Lm5hbWVcblx0aW5zX29iai5zdWJtaXR0ZXIgPSB1c2VyX2lkXG5cdGluc19vYmouc3VibWl0dGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZVxuXHRpbnNfb2JqLmFwcGxpY2FudCA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gZWxzZSB1c2VyX2lkXG5cdGluc19vYmouYXBwbGljYW50X25hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSBlbHNlIHVzZXJfaW5mby5uYW1lXG5cdGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbiA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSBlbHNlIHNwYWNlX3VzZXIub3JnYW5pemF0aW9uXG5cdGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZVwiXSBlbHNlIHNwYWNlX3VzZXJfb3JnX2luZm8ub3JnYW5pemF0aW9uX25hbWVcblx0aW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdIGVsc2UgIHNwYWNlX3VzZXJfb3JnX2luZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lXG5cdGluc19vYmouYXBwbGljYW50X2NvbXBhbnkgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfY29tcGFueVwiXSBlbHNlIHNwYWNlX3VzZXIuY29tcGFueV9pZFxuXHRpbnNfb2JqLnN0YXRlID0gJ2RyYWZ0J1xuXHRpbnNfb2JqLmNvZGUgPSAnJ1xuXHRpbnNfb2JqLmlzX2FyY2hpdmVkID0gZmFsc2Vcblx0aW5zX29iai5pc19kZWxldGVkID0gZmFsc2Vcblx0aW5zX29iai5jcmVhdGVkID0gbm93XG5cdGluc19vYmouY3JlYXRlZF9ieSA9IHVzZXJfaWRcblx0aW5zX29iai5tb2RpZmllZCA9IG5vd1xuXHRpbnNfb2JqLm1vZGlmaWVkX2J5ID0gdXNlcl9pZFxuXHRpbnNfb2JqLnZhbHVlcyA9IG5ldyBPYmplY3RcblxuXHRpbnNfb2JqLnJlY29yZF9pZHMgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl1cblxuXHRpZiBzcGFjZV91c2VyLmNvbXBhbnlfaWRcblx0XHRpbnNfb2JqLmNvbXBhbnlfaWQgPSBzcGFjZV91c2VyLmNvbXBhbnlfaWRcblxuXHQjIOaWsOW7ulRyYWNlXG5cdHRyYWNlX29iaiA9IHt9XG5cdHRyYWNlX29iai5faWQgPSBuZXcgTW9uZ28uT2JqZWN0SUQoKS5fc3RyXG5cdHRyYWNlX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkXG5cdHRyYWNlX29iai5pc19maW5pc2hlZCA9IGZhbHNlXG5cdCMg5b2T5YmN5pyA5paw54mIZmxvd+S4reW8gOWni+iKgueCuVxuXHRzdGFydF9zdGVwID0gXy5maW5kKGZsb3cuY3VycmVudC5zdGVwcywgKHN0ZXApIC0+XG5cdFx0cmV0dXJuIHN0ZXAuc3RlcF90eXBlIGlzICdzdGFydCdcblx0KVxuXHR0cmFjZV9vYmouc3RlcCA9IHN0YXJ0X3N0ZXAuX2lkXG5cdHRyYWNlX29iai5uYW1lID0gc3RhcnRfc3RlcC5uYW1lXG5cblx0dHJhY2Vfb2JqLnN0YXJ0X2RhdGUgPSBub3dcblx0IyDmlrDlu7pBcHByb3ZlXG5cdGFwcHJfb2JqID0ge31cblx0YXBwcl9vYmouX2lkID0gbmV3IE1vbmdvLk9iamVjdElEKCkuX3N0clxuXHRhcHByX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkXG5cdGFwcHJfb2JqLnRyYWNlID0gdHJhY2Vfb2JqLl9pZFxuXHRhcHByX29iai5pc19maW5pc2hlZCA9IGZhbHNlXG5cdGFwcHJfb2JqLnVzZXIgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIGVsc2UgdXNlcl9pZFxuXHRhcHByX29iai51c2VyX25hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSBlbHNlIHVzZXJfaW5mby5uYW1lXG5cdGFwcHJfb2JqLmhhbmRsZXIgPSB1c2VyX2lkXG5cdGFwcHJfb2JqLmhhbmRsZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lXG5cdGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb25cblx0YXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb25fbmFtZSA9IHNwYWNlX3VzZXJfb3JnX2luZm8ubmFtZVxuXHRhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IHNwYWNlX3VzZXJfb3JnX2luZm8uZnVsbG5hbWVcblx0YXBwcl9vYmoudHlwZSA9ICdkcmFmdCdcblx0YXBwcl9vYmouc3RhcnRfZGF0ZSA9IG5vd1xuXHRhcHByX29iai5yZWFkX2RhdGUgPSBub3dcblx0YXBwcl9vYmouaXNfcmVhZCA9IHRydWVcblx0YXBwcl9vYmouaXNfZXJyb3IgPSBmYWxzZVxuXHRhcHByX29iai5kZXNjcmlwdGlvbiA9ICcnXG5cdHJlbGF0ZWRUYWJsZXNJbmZvID0ge31cblx0YXBwcl9vYmoudmFsdWVzID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVZhbHVlcyhpbnNfb2JqLnJlY29yZF9pZHNbMF0sIGZsb3dfaWQsIHNwYWNlX2lkLCBmb3JtLmN1cnJlbnQuZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbylcblxuXHR0cmFjZV9vYmouYXBwcm92ZXMgPSBbYXBwcl9vYmpdXG5cdGluc19vYmoudHJhY2VzID0gW3RyYWNlX29ial1cblxuXHRpbnNfb2JqLmluYm94X3VzZXJzID0gaW5zdGFuY2VfZnJvbV9jbGllbnQuaW5ib3hfdXNlcnMgfHwgW11cblxuXHRpbnNfb2JqLmN1cnJlbnRfc3RlcF9uYW1lID0gc3RhcnRfc3RlcC5uYW1lXG5cblx0aWYgZmxvdy5hdXRvX3JlbWluZCBpcyB0cnVlXG5cdFx0aW5zX29iai5hdXRvX3JlbWluZCA9IHRydWVcblxuXHQjIOaWsOW7uueUs+ivt+WNleaXtu+8jGluc3RhbmNlc+iusOW9lea1geeoi+WQjeensOOAgea1geeoi+WIhuexu+WQjeensCAjMTMxM1xuXHRpbnNfb2JqLmZsb3dfbmFtZSA9IGZsb3cubmFtZVxuXHRpZiBmb3JtLmNhdGVnb3J5XG5cdFx0Y2F0ZWdvcnkgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldENhdGVnb3J5KGZvcm0uY2F0ZWdvcnkpXG5cdFx0aWYgY2F0ZWdvcnlcblx0XHRcdGluc19vYmouY2F0ZWdvcnlfbmFtZSA9IGNhdGVnb3J5Lm5hbWVcblx0XHRcdGluc19vYmouY2F0ZWdvcnkgPSBjYXRlZ29yeS5faWRcblxuXHRuZXdfaW5zX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuaW5zZXJ0KGluc19vYmopXG5cblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlY29yZEluc3RhbmNlSW5mbyhpbnNfb2JqLnJlY29yZF9pZHNbMF0sIG5ld19pbnNfaWQsIHNwYWNlX2lkKVxuXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvKHJlbGF0ZWRUYWJsZXNJbmZvLCBuZXdfaW5zX2lkLCBzcGFjZV9pZClcblxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoKGluc19vYmoucmVjb3JkX2lkc1swXSwgc3BhY2VfaWQsIGluc19vYmouX2lkLCBhcHByX29iai5faWQpXG5cblx0cmV0dXJuIG5ld19pbnNfaWRcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVZhbHVlcyA9IChyZWNvcmRJZHMsIGZsb3dJZCwgc3BhY2VJZCwgZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbykgLT5cblx0ZmllbGRDb2RlcyA9IFtdXG5cdF8uZWFjaCBmaWVsZHMsIChmKSAtPlxuXHRcdGlmIGYudHlwZSA9PSAnc2VjdGlvbidcblx0XHRcdF8uZWFjaCBmLmZpZWxkcywgKGZmKSAtPlxuXHRcdFx0XHRmaWVsZENvZGVzLnB1c2ggZmYuY29kZVxuXHRcdGVsc2Vcblx0XHRcdGZpZWxkQ29kZXMucHVzaCBmLmNvZGVcblxuXHR2YWx1ZXMgPSB7fVxuXHRvYmplY3ROYW1lID0gcmVjb3JkSWRzLm9cblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0TmFtZSwgc3BhY2VJZClcblx0cmVjb3JkSWQgPSByZWNvcmRJZHMuaWRzWzBdXG5cdG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3Rfd29ya2Zsb3dzLmZpbmRPbmUoe1xuXHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxuXHRcdGZsb3dfaWQ6IGZsb3dJZFxuXHR9KVxuXHRyZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0TmFtZSwgc3BhY2VJZCkuZmluZE9uZShyZWNvcmRJZClcblx0ZmxvdyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignZmxvd3MnKS5maW5kT25lKGZsb3dJZCwgeyBmaWVsZHM6IHsgZm9ybTogMSB9IH0pXG5cdGlmIG93IGFuZCByZWNvcmRcblx0XHRmb3JtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiZm9ybXNcIikuZmluZE9uZShmbG93LmZvcm0pXG5cdFx0Zm9ybUZpZWxkcyA9IGZvcm0uY3VycmVudC5maWVsZHMgfHwgW11cblx0XHRyZWxhdGVkT2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0TmFtZSwgc3BhY2VJZClcblx0XHRyZWxhdGVkT2JqZWN0c0tleXMgPSBfLnBsdWNrKHJlbGF0ZWRPYmplY3RzLCAnb2JqZWN0X25hbWUnKVxuXHRcdGZvcm1UYWJsZUZpZWxkcyA9IF8uZmlsdGVyIGZvcm1GaWVsZHMsIChmb3JtRmllbGQpIC0+XG5cdFx0XHRyZXR1cm4gZm9ybUZpZWxkLnR5cGUgPT0gJ3RhYmxlJ1xuXHRcdGZvcm1UYWJsZUZpZWxkc0NvZGUgPSBfLnBsdWNrKGZvcm1UYWJsZUZpZWxkcywgJ2NvZGUnKVxuXG5cdFx0Z2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSA9ICAoa2V5KSAtPlxuXHRcdFx0cmV0dXJuIF8uZmluZCByZWxhdGVkT2JqZWN0c0tleXMsICAocmVsYXRlZE9iamVjdHNLZXkpIC0+XG5cdFx0XHRcdHJldHVybiBrZXkuc3RhcnRzV2l0aChyZWxhdGVkT2JqZWN0c0tleSArICcuJylcblxuXHRcdGdldEZvcm1UYWJsZUZpZWxkQ29kZSA9IChrZXkpIC0+XG5cdFx0XHRyZXR1cm4gXy5maW5kIGZvcm1UYWJsZUZpZWxkc0NvZGUsICAoZm9ybVRhYmxlRmllbGRDb2RlKSAtPlxuXHRcdFx0XHRyZXR1cm4ga2V5LnN0YXJ0c1dpdGgoZm9ybVRhYmxlRmllbGRDb2RlICsgJy4nKVxuXG5cdFx0Z2V0Rm9ybVRhYmxlRmllbGQgPSAoa2V5KSAtPlxuXHRcdFx0cmV0dXJuIF8uZmluZCBmb3JtVGFibGVGaWVsZHMsICAoZikgLT5cblx0XHRcdFx0cmV0dXJuIGYuY29kZSA9PSBrZXlcblxuXHRcdGdldEZvcm1GaWVsZCA9IChrZXkpIC0+XG5cdFx0XHRyZXR1cm4gXy5maW5kIGZvcm1GaWVsZHMsICAoZikgLT5cblx0XHRcdFx0cmV0dXJuIGYuY29kZSA9PSBrZXlcblxuXHRcdGdldEZvcm1UYWJsZVN1YkZpZWxkID0gKHRhYmxlRmllbGQsIHN1YkZpZWxkQ29kZSkgLT5cblx0XHRcdHJldHVybiBfLmZpbmQgdGFibGVGaWVsZC5maWVsZHMsICAoZikgLT5cblx0XHRcdFx0cmV0dXJuIGYuY29kZSA9PSBzdWJGaWVsZENvZGVcblxuXHRcdGdldEZpZWxkT2RhdGFWYWx1ZSA9IChvYmpOYW1lLCBpZCkgLT5cblx0XHRcdG9iaiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKVxuXHRcdFx0aWYgIW9ialxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIF8uaXNTdHJpbmcgaWRcblx0XHRcdFx0X3JlY29yZCA9IG9iai5maW5kT25lKGlkKVxuXHRcdFx0XHRpZiBfcmVjb3JkXG5cdFx0XHRcdFx0X3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkLm5hbWVcblx0XHRcdFx0XHRyZXR1cm4gX3JlY29yZFxuXHRcdFx0ZWxzZSBpZiBfLmlzQXJyYXkgaWRcblx0XHRcdFx0X3JlY29yZHMgPSBbXVxuXHRcdFx0XHRvYmouZmluZCh7IF9pZDogeyAkaW46IGlkIH0gfSkuZm9yRWFjaCAoX3JlY29yZCkgLT5cblx0XHRcdFx0XHRfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmQubmFtZVxuXHRcdFx0XHRcdF9yZWNvcmRzLnB1c2ggX3JlY29yZFxuXG5cdFx0XHRcdGlmICFfLmlzRW1wdHkgX3JlY29yZHNcblx0XHRcdFx0XHRyZXR1cm4gX3JlY29yZHNcblx0XHRcdHJldHVyblxuXG5cdFx0Z2V0U2VsZWN0VXNlclZhbHVlID0gKHVzZXJJZCwgc3BhY2VJZCkgLT5cblx0XHRcdHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0pXG5cdFx0XHRzdS5pZCA9IHVzZXJJZFxuXHRcdFx0cmV0dXJuIHN1XG5cblx0XHRnZXRTZWxlY3RVc2VyVmFsdWVzID0gKHVzZXJJZHMsIHNwYWNlSWQpIC0+XG5cdFx0XHRzdXMgPSBbXVxuXHRcdFx0aWYgXy5pc0FycmF5IHVzZXJJZHNcblx0XHRcdFx0Xy5lYWNoIHVzZXJJZHMsICh1c2VySWQpIC0+XG5cdFx0XHRcdFx0c3UgPSBnZXRTZWxlY3RVc2VyVmFsdWUodXNlcklkLCBzcGFjZUlkKVxuXHRcdFx0XHRcdGlmIHN1XG5cdFx0XHRcdFx0XHRzdXMucHVzaChzdSlcblx0XHRcdHJldHVybiBzdXNcblxuXHRcdGdldFNlbGVjdE9yZ1ZhbHVlID0gKG9yZ0lkLCBzcGFjZUlkKSAtPlxuXHRcdFx0b3JnID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZE9uZShvcmdJZCwgeyBmaWVsZHM6IHsgX2lkOiAxLCBuYW1lOiAxLCBmdWxsbmFtZTogMSB9IH0pXG5cdFx0XHRvcmcuaWQgPSBvcmdJZFxuXHRcdFx0cmV0dXJuIG9yZ1xuXG5cdFx0Z2V0U2VsZWN0T3JnVmFsdWVzID0gKG9yZ0lkcywgc3BhY2VJZCkgLT5cblx0XHRcdG9yZ3MgPSBbXVxuXHRcdFx0aWYgXy5pc0FycmF5IG9yZ0lkc1xuXHRcdFx0XHRfLmVhY2ggb3JnSWRzLCAob3JnSWQpIC0+XG5cdFx0XHRcdFx0b3JnID0gZ2V0U2VsZWN0T3JnVmFsdWUob3JnSWQsIHNwYWNlSWQpXG5cdFx0XHRcdFx0aWYgb3JnXG5cdFx0XHRcdFx0XHRvcmdzLnB1c2gob3JnKVxuXHRcdFx0cmV0dXJuIG9yZ3NcblxuXHRcdHRhYmxlRmllbGRDb2RlcyA9IFtdXG5cdFx0dGFibGVGaWVsZE1hcCA9IFtdXG5cdFx0dGFibGVUb1JlbGF0ZWRNYXAgPSB7fVxuXG5cdFx0b3cuZmllbGRfbWFwPy5mb3JFYWNoIChmbSkgLT5cblx0XHRcdG9iamVjdF9maWVsZCA9IGZtLm9iamVjdF9maWVsZFxuXHRcdFx0d29ya2Zsb3dfZmllbGQgPSBmbS53b3JrZmxvd19maWVsZFxuXHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkQ29kZSA9IGdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUob2JqZWN0X2ZpZWxkKVxuXHRcdFx0Zm9ybVRhYmxlRmllbGRDb2RlID0gZ2V0Rm9ybVRhYmxlRmllbGRDb2RlKHdvcmtmbG93X2ZpZWxkKVxuXHRcdFx0b2JqRmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdF9maWVsZF1cblx0XHRcdGZvcm1GaWVsZCA9IGdldEZvcm1GaWVsZCh3b3JrZmxvd19maWVsZClcblx0XHRcdCMg5aSE55CG5a2Q6KGo5a2X5q61XG5cdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGRDb2RlXG5cdFx0XHRcdFxuXHRcdFx0XHRvVGFibGVDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF1cblx0XHRcdFx0b1RhYmxlRmllbGRDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV1cblx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBLZXkgPSBvVGFibGVDb2RlXG5cdFx0XHRcdGlmICF0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1cblx0XHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0gPSB7fVxuXG5cdFx0XHRcdGlmIGZvcm1UYWJsZUZpZWxkQ29kZVxuXHRcdFx0XHRcdHdUYWJsZUNvZGUgPSB3b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdXG5cdFx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldWydfRlJPTV9UQUJMRV9DT0RFJ10gPSB3VGFibGVDb2RlXG5cblx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldW29UYWJsZUZpZWxkQ29kZV0gPSB3b3JrZmxvd19maWVsZFxuXHRcdFx0IyDliKTmlq3mmK/lkKbmmK/ooajmoLzlrZfmrrVcblx0XHRcdGVsc2UgaWYgd29ya2Zsb3dfZmllbGQuaW5kZXhPZignLiQuJykgPiAwIGFuZCBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPiAwXG5cdFx0XHRcdHdUYWJsZUNvZGUgPSB3b3JrZmxvd19maWVsZC5zcGxpdCgnLiQuJylbMF1cblx0XHRcdFx0b1RhYmxlQ29kZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLiQuJylbMF1cblx0XHRcdFx0aWYgcmVjb3JkLmhhc093blByb3BlcnR5KG9UYWJsZUNvZGUpIGFuZCBfLmlzQXJyYXkocmVjb3JkW29UYWJsZUNvZGVdKVxuXHRcdFx0XHRcdHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcblx0XHRcdFx0XHRcdHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXG5cdFx0XHRcdFx0XHRvYmplY3RfdGFibGVfZmllbGRfY29kZTogb1RhYmxlQ29kZVxuXHRcdFx0XHRcdH0pKVxuXHRcdFx0XHRcdHRhYmxlRmllbGRNYXAucHVzaChmbSlcblxuXHRcdFx0IyDlpITnkIZsb29rdXDjgIFtYXN0ZXJfZGV0YWls57G75Z6L5a2X5q61XG5cdFx0XHRlbHNlIGlmIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJykgPiAwIGFuZCBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPT0gLTFcblx0XHRcdFx0b2JqZWN0RmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF1cblx0XHRcdFx0bG9va3VwRmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV1cblx0XHRcdFx0aWYgb2JqZWN0XG5cdFx0XHRcdFx0b2JqZWN0RmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdEZpZWxkTmFtZV1cblx0XHRcdFx0XHRpZiBvYmplY3RGaWVsZCAmJiBmb3JtRmllbGQgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iamVjdEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0ZmllbGRzT2JqID0ge31cblx0XHRcdFx0XHRcdGZpZWxkc09ialtsb29rdXBGaWVsZE5hbWVdID0gMVxuXHRcdFx0XHRcdFx0bG9va3VwT2JqZWN0UmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZE9uZShyZWNvcmRbb2JqZWN0RmllbGROYW1lXSwgeyBmaWVsZHM6IGZpZWxkc09iaiB9KVxuXHRcdFx0XHRcdFx0b2JqZWN0RmllbGRPYmplY3ROYW1lID0gb2JqZWN0RmllbGQucmVmZXJlbmNlX3RvXG5cdFx0XHRcdFx0XHRsb29rdXBGaWVsZE9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdEZpZWxkT2JqZWN0TmFtZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdG9iamVjdExvb2t1cEZpZWxkID0gbG9va3VwRmllbGRPYmouZmllbGRzW2xvb2t1cEZpZWxkTmFtZV1cblx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IGxvb2t1cE9iamVjdFJlY29yZFtsb29rdXBGaWVsZE5hbWVdXG5cdFx0XHRcdFx0XHRpZiBvYmplY3RMb29rdXBGaWVsZCAmJiBmb3JtRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqZWN0TG9va3VwRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWVcblx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmICFvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gb2RhdGFGaWVsZFZhbHVlXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBsb29rdXBPYmplY3RSZWNvcmRbbG9va3VwRmllbGROYW1lXVxuXG5cdFx0XHQjIGxvb2t1cOOAgW1hc3Rlcl9kZXRhaWzlrZfmrrXlkIzmraXliLBvZGF0YeWtl+autVxuXHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9iakZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSByZWNvcmRbb2JqRmllbGQubmFtZV1cblx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlXG5cdFx0XHRcdGlmIG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcblx0XHRcdFx0ZWxzZSBpZiAhb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcblx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZVxuXHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiBbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvYmpGaWVsZC5uYW1lXVxuXHRcdFx0XHRpZiAhXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcblx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlXG5cdFx0XHRcdFx0aWYgZm9ybUZpZWxkLnR5cGUgPT0gJ3VzZXInXG5cdFx0XHRcdFx0XHRpZiBvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAhb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRlbHNlIGlmIGZvcm1GaWVsZC50eXBlID09ICdncm91cCdcblx0XHRcdFx0XHRcdGlmIG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdGVsc2UgaWYgIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRpZiBzZWxlY3RGaWVsZFZhbHVlXG5cdFx0XHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gc2VsZWN0RmllbGRWYWx1ZVxuXHRcdFx0ZWxzZSBpZiByZWNvcmQuaGFzT3duUHJvcGVydHkob2JqZWN0X2ZpZWxkKVxuXHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gcmVjb3JkW29iamVjdF9maWVsZF1cblxuXHRcdCMg6KGo5qC85a2X5q61XG5cdFx0Xy51bmlxKHRhYmxlRmllbGRDb2RlcykuZm9yRWFjaCAodGZjKSAtPlxuXHRcdFx0YyA9IEpTT04ucGFyc2UodGZjKVxuXHRcdFx0dmFsdWVzW2Mud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZV0gPSBbXVxuXHRcdFx0cmVjb3JkW2Mub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGVdLmZvckVhY2ggKHRyKSAtPlxuXHRcdFx0XHRuZXdUciA9IHt9XG5cdFx0XHRcdF8uZWFjaCB0ciwgKHYsIGspIC0+XG5cdFx0XHRcdFx0dGFibGVGaWVsZE1hcC5mb3JFYWNoICh0Zm0pIC0+XG5cdFx0XHRcdFx0XHRpZiB0Zm0ub2JqZWN0X2ZpZWxkIGlzIChjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlICsgJy4kLicgKyBrKVxuXHRcdFx0XHRcdFx0XHR3VGRDb2RlID0gdGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJC4nKVsxXVxuXHRcdFx0XHRcdFx0XHRuZXdUclt3VGRDb2RlXSA9IHZcblx0XHRcdFx0aWYgbm90IF8uaXNFbXB0eShuZXdUcilcblx0XHRcdFx0XHR2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXS5wdXNoKG5ld1RyKVxuXG5cdFx0IyDlkIzmraXlrZDooajmlbDmja7oh7PooajljZXooajmoLxcblx0XHRfLmVhY2ggdGFibGVUb1JlbGF0ZWRNYXAsICAobWFwLCBrZXkpIC0+XG5cdFx0XHR0YWJsZUNvZGUgPSBtYXAuX0ZST01fVEFCTEVfQ09ERVxuXHRcdFx0Zm9ybVRhYmxlRmllbGQgPSBnZXRGb3JtVGFibGVGaWVsZCh0YWJsZUNvZGUpXG5cdFx0XHRpZiAhdGFibGVDb2RlXG5cdFx0XHRcdGNvbnNvbGUud2FybigndGFibGVUb1JlbGF0ZWQ6IFsnICsga2V5ICsgJ10gbWlzc2luZyBjb3JyZXNwb25kaW5nIHRhYmxlLicpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3ROYW1lID0ga2V5XG5cdFx0XHRcdHRhYmxlVmFsdWVzID0gW11cblx0XHRcdFx0cmVsYXRlZFRhYmxlSXRlbXMgPSBbXVxuXHRcdFx0XHRyZWxhdGVkT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpXG5cdFx0XHRcdHJlbGF0ZWRGaWVsZCA9IF8uZmluZCByZWxhdGVkT2JqZWN0LmZpZWxkcywgKGYpIC0+XG5cdFx0XHRcdFx0cmV0dXJuIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhmLnR5cGUpICYmIGYucmVmZXJlbmNlX3RvID09IG9iamVjdE5hbWVcblxuXHRcdFx0XHRyZWxhdGVkRmllbGROYW1lID0gcmVsYXRlZEZpZWxkLm5hbWVcblxuXHRcdFx0XHRzZWxlY3RvciA9IHt9XG5cdFx0XHRcdHNlbGVjdG9yW3JlbGF0ZWRGaWVsZE5hbWVdID0gcmVjb3JkSWRcblx0XHRcdFx0cmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpXG5cdFx0XHRcdHJlbGF0ZWRSZWNvcmRzID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZChzZWxlY3RvcilcblxuXHRcdFx0XHRyZWxhdGVkUmVjb3Jkcy5mb3JFYWNoIChycikgLT5cblx0XHRcdFx0XHR0YWJsZVZhbHVlSXRlbSA9IHt9XG5cdFx0XHRcdFx0Xy5lYWNoIG1hcCwgKHZhbHVlS2V5LCBmaWVsZEtleSkgLT5cblx0XHRcdFx0XHRcdGlmIGZpZWxkS2V5ICE9ICdfRlJPTV9UQUJMRV9DT0RFJ1xuXHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWVcblx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkS2V5XG5cdFx0XHRcdFx0XHRcdGlmIHZhbHVlS2V5LnN0YXJ0c1dpdGgodGFibGVDb2RlICsgJy4nKVxuXHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleSA9ICh2YWx1ZUtleS5zcGxpdChcIi5cIilbMV0pXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXkgPSB2YWx1ZUtleVxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkID0gZ2V0Rm9ybVRhYmxlU3ViRmllbGQoZm9ybVRhYmxlRmllbGQsIGZvcm1GaWVsZEtleSlcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkID0gcmVsYXRlZE9iamVjdC5maWVsZHNbZmllbGRLZXldXG5cdFx0XHRcdFx0XHRcdGlmICFmb3JtRmllbGQgfHwgIXJlbGF0ZWRPYmplY3RGaWVsZFxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdFx0XHRpZiBmb3JtRmllbGQudHlwZSA9PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhyZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV1cblx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC50eXBlKSAmJiBbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XVxuXHRcdFx0XHRcdFx0XHRcdGlmICFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgZm9ybUZpZWxkLnR5cGUgPT0gJ3VzZXInXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQudHlwZSA9PSAnZ3JvdXAnXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmICFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XVxuXHRcdFx0XHRcdFx0XHR0YWJsZVZhbHVlSXRlbVtmb3JtRmllbGRLZXldID0gdGFibGVGaWVsZFZhbHVlXG5cdFx0XHRcdFx0aWYgIV8uaXNFbXB0eSh0YWJsZVZhbHVlSXRlbSlcblx0XHRcdFx0XHRcdHRhYmxlVmFsdWVJdGVtLl9pZCA9IHJyLl9pZFxuXHRcdFx0XHRcdFx0dGFibGVWYWx1ZXMucHVzaCh0YWJsZVZhbHVlSXRlbSlcblx0XHRcdFx0XHRcdHJlbGF0ZWRUYWJsZUl0ZW1zLnB1c2goeyBfdGFibGU6IHsgX2lkOiByci5faWQsIF9jb2RlOiB0YWJsZUNvZGUgfSB9IClcblxuXHRcdFx0XHR2YWx1ZXNbdGFibGVDb2RlXSA9IHRhYmxlVmFsdWVzXG5cdFx0XHRcdHJlbGF0ZWRUYWJsZXNJbmZvW3JlbGF0ZWRPYmplY3ROYW1lXSA9IHJlbGF0ZWRUYWJsZUl0ZW1zXG5cblx0XHQjIOWmguaenOmFjee9ruS6huiEmuacrOWImeaJp+ihjOiEmuacrFxuXHRcdGlmIG93LmZpZWxkX21hcF9zY3JpcHRcblx0XHRcdF8uZXh0ZW5kKHZhbHVlcywgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5ldmFsRmllbGRNYXBTY3JpcHQob3cuZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgcmVjb3JkSWQpKVxuXG5cdCMg6L+H5ruk5o6JdmFsdWVz5Lit55qE6Z2e5rOVa2V5XG5cdGZpbHRlclZhbHVlcyA9IHt9XG5cdF8uZWFjaCBfLmtleXModmFsdWVzKSwgKGspIC0+XG5cdFx0aWYgZmllbGRDb2Rlcy5pbmNsdWRlcyhrKVxuXHRcdFx0ZmlsdGVyVmFsdWVzW2tdID0gdmFsdWVzW2tdXG5cblx0cmV0dXJuIGZpbHRlclZhbHVlc1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmV2YWxGaWVsZE1hcFNjcmlwdCA9IChmaWVsZF9tYXBfc2NyaXB0LCBvYmplY3ROYW1lLCBzcGFjZUlkLCBvYmplY3RJZCkgLT5cblx0cmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLmZpbmRPbmUob2JqZWN0SWQpXG5cdHNjcmlwdCA9IFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocmVjb3JkKSB7IFwiICsgZmllbGRfbWFwX3NjcmlwdCArIFwiIH1cIlxuXHRmdW5jID0gX2V2YWwoc2NyaXB0LCBcImZpZWxkX21hcF9zY3JpcHRcIilcblx0dmFsdWVzID0gZnVuYyhyZWNvcmQpXG5cdGlmIF8uaXNPYmplY3QgdmFsdWVzXG5cdFx0cmV0dXJuIHZhbHVlc1xuXHRlbHNlXG5cdFx0Y29uc29sZS5lcnJvciBcImV2YWxGaWVsZE1hcFNjcmlwdDog6ISa5pys6L+U5Zue5YC857G75Z6L5LiN5piv5a+56LGhXCJcblx0cmV0dXJuIHt9XG5cblxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoID0gKHJlY29yZElkcywgc3BhY2VJZCwgaW5zSWQsIGFwcHJvdmVJZCkgLT5cblxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zWydjbXNfZmlsZXMnXS5maW5kKHtcblx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRwYXJlbnQ6IHJlY29yZElkc1xuXHR9KS5mb3JFYWNoIChjZikgLT5cblx0XHRfLmVhY2ggY2YudmVyc2lvbnMsICh2ZXJzaW9uSWQsIGlkeCkgLT5cblx0XHRcdGYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zWydjZnMuZmlsZXMuZmlsZXJlY29yZCddLmZpbmRPbmUodmVyc2lvbklkKVxuXHRcdFx0bmV3RmlsZSA9IG5ldyBGUy5GaWxlKClcblxuXHRcdFx0bmV3RmlsZS5hdHRhY2hEYXRhIGYuY3JlYXRlUmVhZFN0cmVhbSgnZmlsZXMnKSwge1xuXHRcdFx0XHRcdHR5cGU6IGYub3JpZ2luYWwudHlwZVxuXHRcdFx0fSwgKGVycikgLT5cblx0XHRcdFx0aWYgKGVycilcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbilcblxuXHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpXG5cdFx0XHRcdG5ld0ZpbGUuc2l6ZShmLnNpemUoKSlcblx0XHRcdFx0bWV0YWRhdGEgPSB7XG5cdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXG5cdFx0XHRcdFx0b3duZXJfbmFtZTogZi5tZXRhZGF0YS5vd25lcl9uYW1lLFxuXHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkLFxuXHRcdFx0XHRcdGluc3RhbmNlOiBpbnNJZCxcblx0XHRcdFx0XHRhcHByb3ZlOiBhcHByb3ZlSWRcblx0XHRcdFx0XHRwYXJlbnQ6IGNmLl9pZFxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgaWR4IGlzIDBcblx0XHRcdFx0XHRtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZVxuXG5cdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YVxuXHRcdFx0XHRjZnMuaW5zdGFuY2VzLmluc2VydChuZXdGaWxlKVxuXG5cdHJldHVyblxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvID0gKHJlY29yZElkcywgaW5zSWQsIHNwYWNlSWQpIC0+XG5cdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkudXBkYXRlKHJlY29yZElkcy5pZHNbMF0sIHtcblx0XHQkcHVzaDoge1xuXHRcdFx0aW5zdGFuY2VzOiB7XG5cdFx0XHRcdCRlYWNoOiBbe1xuXHRcdFx0XHRcdF9pZDogaW5zSWQsXG5cdFx0XHRcdFx0c3RhdGU6ICdkcmFmdCdcblx0XHRcdFx0fV0sXG5cdFx0XHRcdCRwb3NpdGlvbjogMFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0JHNldDoge1xuXHRcdFx0bG9ja2VkOiB0cnVlXG5cdFx0XHRpbnN0YW5jZV9zdGF0ZTogJ2RyYWZ0J1xuXHRcdH1cblx0fSlcblxuXHRyZXR1cm5cblxuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyA9IChyZWxhdGVkVGFibGVzSW5mbywgaW5zSWQsIHNwYWNlSWQpIC0+XG5cdF8uZWFjaCByZWxhdGVkVGFibGVzSW5mbywgKHRhYmxlSXRlbXMsIHJlbGF0ZWRPYmplY3ROYW1lKSAtPlxuXHRcdHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKVxuXHRcdF8uZWFjaCB0YWJsZUl0ZW1zLCAoaXRlbSkgLT5cblx0XHRcdHJlbGF0ZWRDb2xsZWN0aW9uLnVwZGF0ZShpdGVtLl90YWJsZS5faWQsIHtcblx0XHRcdFx0JHNldDoge1xuXHRcdFx0XHRcdGluc3RhbmNlczogW3tcblx0XHRcdFx0XHRcdF9pZDogaW5zSWQsXG5cdFx0XHRcdFx0XHRzdGF0ZTogJ2RyYWZ0J1xuXHRcdFx0XHRcdH1dLFxuXHRcdFx0XHRcdF90YWJsZTogaXRlbS5fdGFibGVcblx0XHRcdFx0fVxuXHRcdFx0fSlcblxuXHRyZXR1cm5cblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja0lzSW5BcHByb3ZhbCA9IChyZWNvcmRJZHMsIHNwYWNlSWQpIC0+XG5cdHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkuZmluZE9uZSh7XG5cdFx0X2lkOiByZWNvcmRJZHMuaWRzWzBdLCBpbnN0YW5jZXM6IHsgJGV4aXN0czogdHJ1ZSB9XG5cdH0sIHsgZmllbGRzOiB7IGluc3RhbmNlczogMSB9IH0pXG5cblx0aWYgcmVjb3JkIGFuZCByZWNvcmQuaW5zdGFuY2VzWzBdLnN0YXRlIGlzbnQgJ2NvbXBsZXRlZCcgYW5kIENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmZpbmQocmVjb3JkLmluc3RhbmNlc1swXS5faWQpLmNvdW50KCkgPiAwXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmraTorrDlvZXlt7Llj5HotbfmtYHnqIvmraPlnKjlrqHmibnkuK3vvIzlvoXlrqHmibnnu5PmnZ/mlrnlj6/lj5HotbfkuIvkuIDmrKHlrqHmibnvvIFcIilcblxuXHRyZXR1cm5cblxuIiwidmFyIF9ldmFsOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5fZXZhbCA9IHJlcXVpcmUoJ2V2YWwnKTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24gPSBmdW5jdGlvbihyZXEpIHtcbiAgdmFyIGF1dGhUb2tlbiwgaGFzaGVkVG9rZW4sIHF1ZXJ5LCB1c2VyLCB1c2VySWQ7XG4gIHF1ZXJ5ID0gcmVxLnF1ZXJ5O1xuICB1c2VySWQgPSBxdWVyeVtcIlgtVXNlci1JZFwiXTtcbiAgYXV0aFRva2VuID0gcXVlcnlbXCJYLUF1dGgtVG9rZW5cIl07XG4gIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgX2lkOiB1c2VySWQsXG4gICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgfSk7XG4gIGlmICghdXNlcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgcmV0dXJuIHVzZXI7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgdmFyIHNwYWNlO1xuICBzcGFjZSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpO1xuICBpZiAoIXNwYWNlKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJzcGFjZV9pZOacieivr+aIluatpHNwYWNl5bey57uP6KKr5Yig6ZmkXCIpO1xuICB9XG4gIHJldHVybiBzcGFjZTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyA9IGZ1bmN0aW9uKGZsb3dfaWQpIHtcbiAgdmFyIGZsb3c7XG4gIGZsb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZsb3dzLmZpbmRPbmUoZmxvd19pZCk7XG4gIGlmICghZmxvdykge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwiaWTmnInor6/miJbmraTmtYHnqIvlt7Lnu4/ooqvliKDpmaRcIik7XG4gIH1cbiAgcmV0dXJuIGZsb3c7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlciA9IGZ1bmN0aW9uKHNwYWNlX2lkLCB1c2VyX2lkKSB7XG4gIHZhciBzcGFjZV91c2VyO1xuICBzcGFjZV91c2VyID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdXNlcjogdXNlcl9pZFxuICB9KTtcbiAgaWYgKCFzcGFjZV91c2VyKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJ1c2VyX2lk5a+55bqU55qE55So5oi35LiN5bGe5LqO5b2T5YmNc3BhY2VcIik7XG4gIH1cbiAgcmV0dXJuIHNwYWNlX3VzZXI7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8gPSBmdW5jdGlvbihzcGFjZV91c2VyKSB7XG4gIHZhciBpbmZvLCBvcmc7XG4gIGluZm8gPSBuZXcgT2JqZWN0O1xuICBpbmZvLm9yZ2FuaXphdGlvbiA9IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uO1xuICBvcmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9yZ2FuaXphdGlvbnMuZmluZE9uZShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbiwge1xuICAgIGZpZWxkczoge1xuICAgICAgbmFtZTogMSxcbiAgICAgIGZ1bGxuYW1lOiAxXG4gICAgfVxuICB9KTtcbiAgaW5mby5vcmdhbml6YXRpb25fbmFtZSA9IG9yZy5uYW1lO1xuICBpbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IG9yZy5mdWxsbmFtZTtcbiAgcmV0dXJuIGluZm87XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd0VuYWJsZWQgPSBmdW5jdGlvbihmbG93KSB7XG4gIGlmIChmbG93LnN0YXRlICE9PSBcImVuYWJsZWRcIikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5pyq5ZCv55SoLOaTjeS9nOWksei0pVwiKTtcbiAgfVxufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQgPSBmdW5jdGlvbihmbG93LCBzcGFjZV9pZCkge1xuICBpZiAoZmxvdy5zcGFjZSAhPT0gc3BhY2VfaWQpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+WSjOW3peS9nOWMuklE5LiN5Yy56YWNXCIpO1xuICB9XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZvcm0gPSBmdW5jdGlvbihmb3JtX2lkKSB7XG4gIHZhciBmb3JtO1xuICBmb3JtID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5mb3Jtcy5maW5kT25lKGZvcm1faWQpO1xuICBpZiAoIWZvcm0pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn6KGo5Y2VSUTmnInor6/miJbmraTooajljZXlt7Lnu4/ooqvliKDpmaQnKTtcbiAgfVxuICByZXR1cm4gZm9ybTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Q2F0ZWdvcnkgPSBmdW5jdGlvbihjYXRlZ29yeV9pZCkge1xuICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5jYXRlZ29yaWVzLmZpbmRPbmUoY2F0ZWdvcnlfaWQpO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UgPSBmdW5jdGlvbihpbnN0YW5jZV9mcm9tX2NsaWVudCwgdXNlcl9pbmZvKSB7XG4gIHZhciBhcHByX29iaiwgYXBwcm92ZV9mcm9tX2NsaWVudCwgY2F0ZWdvcnksIGZsb3csIGZsb3dfaWQsIGZvcm0sIGluc19vYmosIG5ld19pbnNfaWQsIG5vdywgcGVybWlzc2lvbnMsIHJlbGF0ZWRUYWJsZXNJbmZvLCBzcGFjZSwgc3BhY2VfaWQsIHNwYWNlX3VzZXIsIHNwYWNlX3VzZXJfb3JnX2luZm8sIHN0YXJ0X3N0ZXAsIHRyYWNlX2Zyb21fY2xpZW50LCB0cmFjZV9vYmosIHVzZXJfaWQ7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdLCBTdHJpbmcpO1xuICBjaGVjayhpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdLCBTdHJpbmcpO1xuICBjaGVjayhpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl0sIFN0cmluZyk7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXSwgW1xuICAgIHtcbiAgICAgIG86IFN0cmluZyxcbiAgICAgIGlkczogW1N0cmluZ11cbiAgICB9XG4gIF0pO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVswXSwgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSk7XG4gIHNwYWNlX2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXTtcbiAgZmxvd19pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXTtcbiAgdXNlcl9pZCA9IHVzZXJfaW5mby5faWQ7XG4gIHRyYWNlX2Zyb21fY2xpZW50ID0gbnVsbDtcbiAgYXBwcm92ZV9mcm9tX2NsaWVudCA9IG51bGw7XG4gIGlmIChpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXSAmJiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXSkge1xuICAgIHRyYWNlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF07XG4gICAgaWYgKHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl0gJiYgdHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXVswXSkge1xuICAgICAgYXBwcm92ZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdW1wiYXBwcm92ZXNcIl1bMF07XG4gICAgfVxuICB9XG4gIHNwYWNlID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZShzcGFjZV9pZCk7XG4gIGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZCk7XG4gIHNwYWNlX3VzZXIgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlcihzcGFjZV9pZCwgdXNlcl9pZCk7XG4gIHNwYWNlX3VzZXJfb3JnX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8oc3BhY2VfdXNlcik7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZChmbG93KTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQoZmxvdywgc3BhY2VfaWQpO1xuICBmb3JtID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtKGZsb3cuZm9ybSk7XG4gIHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dfaWQsIHVzZXJfaWQpO1xuICBpZiAoIXBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRkXCIpKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLlvZPliY3nlKjmiLfmsqHmnInmraTmtYHnqIvnmoTmlrDlu7rmnYPpmZBcIik7XG4gIH1cbiAgbm93ID0gbmV3IERhdGU7XG4gIGluc19vYmogPSB7fTtcbiAgaW5zX29iai5faWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5fbWFrZU5ld0lEKCk7XG4gIGluc19vYmouc3BhY2UgPSBzcGFjZV9pZDtcbiAgaW5zX29iai5mbG93ID0gZmxvd19pZDtcbiAgaW5zX29iai5mbG93X3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuX2lkO1xuICBpbnNfb2JqLmZvcm0gPSBmbG93LmZvcm07XG4gIGluc19vYmouZm9ybV92ZXJzaW9uID0gZmxvdy5jdXJyZW50LmZvcm1fdmVyc2lvbjtcbiAgaW5zX29iai5uYW1lID0gZmxvdy5uYW1lO1xuICBpbnNfb2JqLnN1Ym1pdHRlciA9IHVzZXJfaWQ7XG4gIGluc19vYmouc3VibWl0dGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIDogdXNlcl9pZDtcbiAgaW5zX29iai5hcHBsaWNhbnRfbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIDogdXNlcl9pbmZvLm5hbWU7XG4gIGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbiA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSA6IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uO1xuICBpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gOiBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9uYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gOiBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnRfY29tcGFueSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdIDogc3BhY2VfdXNlci5jb21wYW55X2lkO1xuICBpbnNfb2JqLnN0YXRlID0gJ2RyYWZ0JztcbiAgaW5zX29iai5jb2RlID0gJyc7XG4gIGluc19vYmouaXNfYXJjaGl2ZWQgPSBmYWxzZTtcbiAgaW5zX29iai5pc19kZWxldGVkID0gZmFsc2U7XG4gIGluc19vYmouY3JlYXRlZCA9IG5vdztcbiAgaW5zX29iai5jcmVhdGVkX2J5ID0gdXNlcl9pZDtcbiAgaW5zX29iai5tb2RpZmllZCA9IG5vdztcbiAgaW5zX29iai5tb2RpZmllZF9ieSA9IHVzZXJfaWQ7XG4gIGluc19vYmoudmFsdWVzID0gbmV3IE9iamVjdDtcbiAgaW5zX29iai5yZWNvcmRfaWRzID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdO1xuICBpZiAoc3BhY2VfdXNlci5jb21wYW55X2lkKSB7XG4gICAgaW5zX29iai5jb21wYW55X2lkID0gc3BhY2VfdXNlci5jb21wYW55X2lkO1xuICB9XG4gIHRyYWNlX29iaiA9IHt9O1xuICB0cmFjZV9vYmouX2lkID0gbmV3IE1vbmdvLk9iamVjdElEKCkuX3N0cjtcbiAgdHJhY2Vfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWQ7XG4gIHRyYWNlX29iai5pc19maW5pc2hlZCA9IGZhbHNlO1xuICBzdGFydF9zdGVwID0gXy5maW5kKGZsb3cuY3VycmVudC5zdGVwcywgZnVuY3Rpb24oc3RlcCkge1xuICAgIHJldHVybiBzdGVwLnN0ZXBfdHlwZSA9PT0gJ3N0YXJ0JztcbiAgfSk7XG4gIHRyYWNlX29iai5zdGVwID0gc3RhcnRfc3RlcC5faWQ7XG4gIHRyYWNlX29iai5uYW1lID0gc3RhcnRfc3RlcC5uYW1lO1xuICB0cmFjZV9vYmouc3RhcnRfZGF0ZSA9IG5vdztcbiAgYXBwcl9vYmogPSB7fTtcbiAgYXBwcl9vYmouX2lkID0gbmV3IE1vbmdvLk9iamVjdElEKCkuX3N0cjtcbiAgYXBwcl9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZDtcbiAgYXBwcl9vYmoudHJhY2UgPSB0cmFjZV9vYmouX2lkO1xuICBhcHByX29iai5pc19maW5pc2hlZCA9IGZhbHNlO1xuICBhcHByX29iai51c2VyID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA6IHVzZXJfaWQ7XG4gIGFwcHJfb2JqLnVzZXJfbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIDogdXNlcl9pbmZvLm5hbWU7XG4gIGFwcHJfb2JqLmhhbmRsZXIgPSB1c2VyX2lkO1xuICBhcHByX29iai5oYW5kbGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZTtcbiAgYXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbjtcbiAgYXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb25fbmFtZSA9IHNwYWNlX3VzZXJfb3JnX2luZm8ubmFtZTtcbiAgYXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLmZ1bGxuYW1lO1xuICBhcHByX29iai50eXBlID0gJ2RyYWZ0JztcbiAgYXBwcl9vYmouc3RhcnRfZGF0ZSA9IG5vdztcbiAgYXBwcl9vYmoucmVhZF9kYXRlID0gbm93O1xuICBhcHByX29iai5pc19yZWFkID0gdHJ1ZTtcbiAgYXBwcl9vYmouaXNfZXJyb3IgPSBmYWxzZTtcbiAgYXBwcl9vYmouZGVzY3JpcHRpb24gPSAnJztcbiAgcmVsYXRlZFRhYmxlc0luZm8gPSB7fTtcbiAgYXBwcl9vYmoudmFsdWVzID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVZhbHVlcyhpbnNfb2JqLnJlY29yZF9pZHNbMF0sIGZsb3dfaWQsIHNwYWNlX2lkLCBmb3JtLmN1cnJlbnQuZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbyk7XG4gIHRyYWNlX29iai5hcHByb3ZlcyA9IFthcHByX29ial07XG4gIGluc19vYmoudHJhY2VzID0gW3RyYWNlX29ial07XG4gIGluc19vYmouaW5ib3hfdXNlcnMgPSBpbnN0YW5jZV9mcm9tX2NsaWVudC5pbmJveF91c2VycyB8fCBbXTtcbiAgaW5zX29iai5jdXJyZW50X3N0ZXBfbmFtZSA9IHN0YXJ0X3N0ZXAubmFtZTtcbiAgaWYgKGZsb3cuYXV0b19yZW1pbmQgPT09IHRydWUpIHtcbiAgICBpbnNfb2JqLmF1dG9fcmVtaW5kID0gdHJ1ZTtcbiAgfVxuICBpbnNfb2JqLmZsb3dfbmFtZSA9IGZsb3cubmFtZTtcbiAgaWYgKGZvcm0uY2F0ZWdvcnkpIHtcbiAgICBjYXRlZ29yeSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Q2F0ZWdvcnkoZm9ybS5jYXRlZ29yeSk7XG4gICAgaWYgKGNhdGVnb3J5KSB7XG4gICAgICBpbnNfb2JqLmNhdGVnb3J5X25hbWUgPSBjYXRlZ29yeS5uYW1lO1xuICAgICAgaW5zX29iai5jYXRlZ29yeSA9IGNhdGVnb3J5Ll9pZDtcbiAgICB9XG4gIH1cbiAgbmV3X2luc19pZCA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmluc2VydChpbnNfb2JqKTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlY29yZEluc3RhbmNlSW5mbyhpbnNfb2JqLnJlY29yZF9pZHNbMF0sIG5ld19pbnNfaWQsIHNwYWNlX2lkKTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlbGF0ZWRSZWNvcmRJbnN0YW5jZUluZm8ocmVsYXRlZFRhYmxlc0luZm8sIG5ld19pbnNfaWQsIHNwYWNlX2lkKTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZUF0dGFjaChpbnNfb2JqLnJlY29yZF9pZHNbMF0sIHNwYWNlX2lkLCBpbnNfb2JqLl9pZCwgYXBwcl9vYmouX2lkKTtcbiAgcmV0dXJuIG5ld19pbnNfaWQ7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlVmFsdWVzID0gZnVuY3Rpb24ocmVjb3JkSWRzLCBmbG93SWQsIHNwYWNlSWQsIGZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pIHtcbiAgdmFyIGZpZWxkQ29kZXMsIGZpbHRlclZhbHVlcywgZmxvdywgZm9ybSwgZm9ybUZpZWxkcywgZm9ybVRhYmxlRmllbGRzLCBmb3JtVGFibGVGaWVsZHNDb2RlLCBnZXRGaWVsZE9kYXRhVmFsdWUsIGdldEZvcm1GaWVsZCwgZ2V0Rm9ybVRhYmxlRmllbGQsIGdldEZvcm1UYWJsZUZpZWxkQ29kZSwgZ2V0Rm9ybVRhYmxlU3ViRmllbGQsIGdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUsIGdldFNlbGVjdE9yZ1ZhbHVlLCBnZXRTZWxlY3RPcmdWYWx1ZXMsIGdldFNlbGVjdFVzZXJWYWx1ZSwgZ2V0U2VsZWN0VXNlclZhbHVlcywgb2JqZWN0LCBvYmplY3ROYW1lLCBvdywgcmVjb3JkLCByZWNvcmRJZCwgcmVmLCByZWxhdGVkT2JqZWN0cywgcmVsYXRlZE9iamVjdHNLZXlzLCB0YWJsZUZpZWxkQ29kZXMsIHRhYmxlRmllbGRNYXAsIHRhYmxlVG9SZWxhdGVkTWFwLCB2YWx1ZXM7XG4gIGZpZWxkQ29kZXMgPSBbXTtcbiAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgIGlmIChmLnR5cGUgPT09ICdzZWN0aW9uJykge1xuICAgICAgcmV0dXJuIF8uZWFjaChmLmZpZWxkcywgZnVuY3Rpb24oZmYpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkQ29kZXMucHVzaChmZi5jb2RlKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmllbGRDb2Rlcy5wdXNoKGYuY29kZSk7XG4gICAgfVxuICB9KTtcbiAgdmFsdWVzID0ge307XG4gIG9iamVjdE5hbWUgPSByZWNvcmRJZHMubztcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0TmFtZSwgc3BhY2VJZCk7XG4gIHJlY29yZElkID0gcmVjb3JkSWRzLmlkc1swXTtcbiAgb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXG4gICAgZmxvd19pZDogZmxvd0lkXG4gIH0pO1xuICByZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0TmFtZSwgc3BhY2VJZCkuZmluZE9uZShyZWNvcmRJZCk7XG4gIGZsb3cgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShmbG93SWQsIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGZvcm06IDFcbiAgICB9XG4gIH0pO1xuICBpZiAob3cgJiYgcmVjb3JkKSB7XG4gICAgZm9ybSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImZvcm1zXCIpLmZpbmRPbmUoZmxvdy5mb3JtKTtcbiAgICBmb3JtRmllbGRzID0gZm9ybS5jdXJyZW50LmZpZWxkcyB8fCBbXTtcbiAgICByZWxhdGVkT2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0TmFtZSwgc3BhY2VJZCk7XG4gICAgcmVsYXRlZE9iamVjdHNLZXlzID0gXy5wbHVjayhyZWxhdGVkT2JqZWN0cywgJ29iamVjdF9uYW1lJyk7XG4gICAgZm9ybVRhYmxlRmllbGRzID0gXy5maWx0ZXIoZm9ybUZpZWxkcywgZnVuY3Rpb24oZm9ybUZpZWxkKSB7XG4gICAgICByZXR1cm4gZm9ybUZpZWxkLnR5cGUgPT09ICd0YWJsZSc7XG4gICAgfSk7XG4gICAgZm9ybVRhYmxlRmllbGRzQ29kZSA9IF8ucGx1Y2soZm9ybVRhYmxlRmllbGRzLCAnY29kZScpO1xuICAgIGdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBfLmZpbmQocmVsYXRlZE9iamVjdHNLZXlzLCBmdW5jdGlvbihyZWxhdGVkT2JqZWN0c0tleSkge1xuICAgICAgICByZXR1cm4ga2V5LnN0YXJ0c1dpdGgocmVsYXRlZE9iamVjdHNLZXkgKyAnLicpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRGb3JtVGFibGVGaWVsZENvZGUgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBfLmZpbmQoZm9ybVRhYmxlRmllbGRzQ29kZSwgZnVuY3Rpb24oZm9ybVRhYmxlRmllbGRDb2RlKSB7XG4gICAgICAgIHJldHVybiBrZXkuc3RhcnRzV2l0aChmb3JtVGFibGVGaWVsZENvZGUgKyAnLicpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRGb3JtVGFibGVGaWVsZCA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIF8uZmluZChmb3JtVGFibGVGaWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgcmV0dXJuIGYuY29kZSA9PT0ga2V5O1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRGb3JtRmllbGQgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBfLmZpbmQoZm9ybUZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgICAgICByZXR1cm4gZi5jb2RlID09PSBrZXk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGdldEZvcm1UYWJsZVN1YkZpZWxkID0gZnVuY3Rpb24odGFibGVGaWVsZCwgc3ViRmllbGRDb2RlKSB7XG4gICAgICByZXR1cm4gXy5maW5kKHRhYmxlRmllbGQuZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgIHJldHVybiBmLmNvZGUgPT09IHN1YkZpZWxkQ29kZTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0RmllbGRPZGF0YVZhbHVlID0gZnVuY3Rpb24ob2JqTmFtZSwgaWQpIHtcbiAgICAgIHZhciBfcmVjb3JkLCBfcmVjb3Jkcywgb2JqO1xuICAgICAgb2JqID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iak5hbWUpO1xuICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKF8uaXNTdHJpbmcoaWQpKSB7XG4gICAgICAgIF9yZWNvcmQgPSBvYmouZmluZE9uZShpZCk7XG4gICAgICAgIGlmIChfcmVjb3JkKSB7XG4gICAgICAgICAgX3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkLm5hbWU7XG4gICAgICAgICAgcmV0dXJuIF9yZWNvcmQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoXy5pc0FycmF5KGlkKSkge1xuICAgICAgICBfcmVjb3JkcyA9IFtdO1xuICAgICAgICBvYmouZmluZCh7XG4gICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAkaW46IGlkXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKF9yZWNvcmQpIHtcbiAgICAgICAgICBfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmQubmFtZTtcbiAgICAgICAgICByZXR1cm4gX3JlY29yZHMucHVzaChfcmVjb3JkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghXy5pc0VtcHR5KF9yZWNvcmRzKSkge1xuICAgICAgICAgIHJldHVybiBfcmVjb3JkcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgZ2V0U2VsZWN0VXNlclZhbHVlID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gICAgICB2YXIgc3U7XG4gICAgICBzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgICBzdS5pZCA9IHVzZXJJZDtcbiAgICAgIHJldHVybiBzdTtcbiAgICB9O1xuICAgIGdldFNlbGVjdFVzZXJWYWx1ZXMgPSBmdW5jdGlvbih1c2VySWRzLCBzcGFjZUlkKSB7XG4gICAgICB2YXIgc3VzO1xuICAgICAgc3VzID0gW107XG4gICAgICBpZiAoXy5pc0FycmF5KHVzZXJJZHMpKSB7XG4gICAgICAgIF8uZWFjaCh1c2VySWRzLCBmdW5jdGlvbih1c2VySWQpIHtcbiAgICAgICAgICB2YXIgc3U7XG4gICAgICAgICAgc3UgPSBnZXRTZWxlY3RVc2VyVmFsdWUodXNlcklkLCBzcGFjZUlkKTtcbiAgICAgICAgICBpZiAoc3UpIHtcbiAgICAgICAgICAgIHJldHVybiBzdXMucHVzaChzdSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdXM7XG4gICAgfTtcbiAgICBnZXRTZWxlY3RPcmdWYWx1ZSA9IGZ1bmN0aW9uKG9yZ0lkLCBzcGFjZUlkKSB7XG4gICAgICB2YXIgb3JnO1xuICAgICAgb3JnID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZE9uZShvcmdJZCwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICBmdWxsbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG9yZy5pZCA9IG9yZ0lkO1xuICAgICAgcmV0dXJuIG9yZztcbiAgICB9O1xuICAgIGdldFNlbGVjdE9yZ1ZhbHVlcyA9IGZ1bmN0aW9uKG9yZ0lkcywgc3BhY2VJZCkge1xuICAgICAgdmFyIG9yZ3M7XG4gICAgICBvcmdzID0gW107XG4gICAgICBpZiAoXy5pc0FycmF5KG9yZ0lkcykpIHtcbiAgICAgICAgXy5lYWNoKG9yZ0lkcywgZnVuY3Rpb24ob3JnSWQpIHtcbiAgICAgICAgICB2YXIgb3JnO1xuICAgICAgICAgIG9yZyA9IGdldFNlbGVjdE9yZ1ZhbHVlKG9yZ0lkLCBzcGFjZUlkKTtcbiAgICAgICAgICBpZiAob3JnKSB7XG4gICAgICAgICAgICByZXR1cm4gb3Jncy5wdXNoKG9yZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcmdzO1xuICAgIH07XG4gICAgdGFibGVGaWVsZENvZGVzID0gW107XG4gICAgdGFibGVGaWVsZE1hcCA9IFtdO1xuICAgIHRhYmxlVG9SZWxhdGVkTWFwID0ge307XG4gICAgaWYgKChyZWYgPSBvdy5maWVsZF9tYXApICE9IG51bGwpIHtcbiAgICAgIHJlZi5mb3JFYWNoKGZ1bmN0aW9uKGZtKSB7XG4gICAgICAgIHZhciBmaWVsZHNPYmosIGZvcm1GaWVsZCwgZm9ybVRhYmxlRmllbGRDb2RlLCBsb29rdXBGaWVsZE5hbWUsIGxvb2t1cEZpZWxkT2JqLCBsb29rdXBPYmplY3RSZWNvcmQsIG9UYWJsZUNvZGUsIG9UYWJsZUZpZWxkQ29kZSwgb2JqRmllbGQsIG9iamVjdEZpZWxkLCBvYmplY3RGaWVsZE5hbWUsIG9iamVjdEZpZWxkT2JqZWN0TmFtZSwgb2JqZWN0TG9va3VwRmllbGQsIG9iamVjdF9maWVsZCwgb2RhdGFGaWVsZFZhbHVlLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVsYXRlZE9iamVjdEZpZWxkQ29kZSwgc2VsZWN0RmllbGRWYWx1ZSwgdGFibGVUb1JlbGF0ZWRNYXBLZXksIHdUYWJsZUNvZGUsIHdvcmtmbG93X2ZpZWxkO1xuICAgICAgICBvYmplY3RfZmllbGQgPSBmbS5vYmplY3RfZmllbGQ7XG4gICAgICAgIHdvcmtmbG93X2ZpZWxkID0gZm0ud29ya2Zsb3dfZmllbGQ7XG4gICAgICAgIHJlbGF0ZWRPYmplY3RGaWVsZENvZGUgPSBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlKG9iamVjdF9maWVsZCk7XG4gICAgICAgIGZvcm1UYWJsZUZpZWxkQ29kZSA9IGdldEZvcm1UYWJsZUZpZWxkQ29kZSh3b3JrZmxvd19maWVsZCk7XG4gICAgICAgIG9iakZpZWxkID0gb2JqZWN0LmZpZWxkc1tvYmplY3RfZmllbGRdO1xuICAgICAgICBmb3JtRmllbGQgPSBnZXRGb3JtRmllbGQod29ya2Zsb3dfZmllbGQpO1xuICAgICAgICBpZiAocmVsYXRlZE9iamVjdEZpZWxkQ29kZSkge1xuICAgICAgICAgIG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICBvVGFibGVGaWVsZENvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICB0YWJsZVRvUmVsYXRlZE1hcEtleSA9IG9UYWJsZUNvZGU7XG4gICAgICAgICAgaWYgKCF0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0pIHtcbiAgICAgICAgICAgIHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZm9ybVRhYmxlRmllbGRDb2RlKSB7XG4gICAgICAgICAgICB3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVsnX0ZST01fVEFCTEVfQ09ERSddID0gd1RhYmxlQ29kZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVtvVGFibGVGaWVsZENvZGVdID0gd29ya2Zsb3dfZmllbGQ7XG4gICAgICAgIH0gZWxzZSBpZiAod29ya2Zsb3dfZmllbGQuaW5kZXhPZignLiQuJykgPiAwICYmIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA+IDApIHtcbiAgICAgICAgICB3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4kLicpWzBdO1xuICAgICAgICAgIG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzBdO1xuICAgICAgICAgIGlmIChyZWNvcmQuaGFzT3duUHJvcGVydHkob1RhYmxlQ29kZSkgJiYgXy5pc0FycmF5KHJlY29yZFtvVGFibGVDb2RlXSkpIHtcbiAgICAgICAgICAgIHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgd29ya2Zsb3dfdGFibGVfZmllbGRfY29kZTogd1RhYmxlQ29kZSxcbiAgICAgICAgICAgICAgb2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHJldHVybiB0YWJsZUZpZWxkTWFwLnB1c2goZm0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChvYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gMCAmJiBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPT09IC0xKSB7XG4gICAgICAgICAgb2JqZWN0RmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgbG9va3VwRmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgaWYgKG9iamVjdCkge1xuICAgICAgICAgICAgb2JqZWN0RmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdEZpZWxkTmFtZV07XG4gICAgICAgICAgICBpZiAob2JqZWN0RmllbGQgJiYgZm9ybUZpZWxkICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgZmllbGRzT2JqID0ge307XG4gICAgICAgICAgICAgIGZpZWxkc09ialtsb29rdXBGaWVsZE5hbWVdID0gMTtcbiAgICAgICAgICAgICAgbG9va3VwT2JqZWN0UmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZE9uZShyZWNvcmRbb2JqZWN0RmllbGROYW1lXSwge1xuICAgICAgICAgICAgICAgIGZpZWxkczogZmllbGRzT2JqXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBvYmplY3RGaWVsZE9iamVjdE5hbWUgPSBvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICAgIGxvb2t1cEZpZWxkT2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0RmllbGRPYmplY3ROYW1lLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgb2JqZWN0TG9va3VwRmllbGQgPSBsb29rdXBGaWVsZE9iai5maWVsZHNbbG9va3VwRmllbGROYW1lXTtcbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gbG9va3VwT2JqZWN0UmVjb3JkW2xvb2t1cEZpZWxkTmFtZV07XG4gICAgICAgICAgICAgIGlmIChvYmplY3RMb29rdXBGaWVsZCAmJiBmb3JtRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iamVjdExvb2t1cEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IGxvb2t1cE9iamVjdFJlY29yZFtsb29rdXBGaWVsZE5hbWVdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqRmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvYmpGaWVsZC5uYW1lXTtcbiAgICAgICAgICBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgICAgaWYgKG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiBbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdO1xuICAgICAgICAgIGlmICghXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWU7XG4gICAgICAgICAgICBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICBpZiAob2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgICAgICBpZiAob2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxlY3RGaWVsZFZhbHVlKSB7XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gc2VsZWN0RmllbGRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLmhhc093blByb3BlcnR5KG9iamVjdF9maWVsZCkpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHJlY29yZFtvYmplY3RfZmllbGRdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgXy51bmlxKHRhYmxlRmllbGRDb2RlcykuZm9yRWFjaChmdW5jdGlvbih0ZmMpIHtcbiAgICAgIHZhciBjO1xuICAgICAgYyA9IEpTT04ucGFyc2UodGZjKTtcbiAgICAgIHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdID0gW107XG4gICAgICByZXR1cm4gcmVjb3JkW2Mub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGVdLmZvckVhY2goZnVuY3Rpb24odHIpIHtcbiAgICAgICAgdmFyIG5ld1RyO1xuICAgICAgICBuZXdUciA9IHt9O1xuICAgICAgICBfLmVhY2godHIsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgICByZXR1cm4gdGFibGVGaWVsZE1hcC5mb3JFYWNoKGZ1bmN0aW9uKHRmbSkge1xuICAgICAgICAgICAgdmFyIHdUZENvZGU7XG4gICAgICAgICAgICBpZiAodGZtLm9iamVjdF9maWVsZCA9PT0gKGMub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGUgKyAnLiQuJyArIGspKSB7XG4gICAgICAgICAgICAgIHdUZENvZGUgPSB0Zm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4kLicpWzFdO1xuICAgICAgICAgICAgICByZXR1cm4gbmV3VHJbd1RkQ29kZV0gPSB2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFfLmlzRW1wdHkobmV3VHIpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdLnB1c2gobmV3VHIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBfLmVhY2godGFibGVUb1JlbGF0ZWRNYXAsIGZ1bmN0aW9uKG1hcCwga2V5KSB7XG4gICAgICB2YXIgZm9ybVRhYmxlRmllbGQsIHJlbGF0ZWRDb2xsZWN0aW9uLCByZWxhdGVkRmllbGQsIHJlbGF0ZWRGaWVsZE5hbWUsIHJlbGF0ZWRPYmplY3QsIHJlbGF0ZWRPYmplY3ROYW1lLCByZWxhdGVkUmVjb3JkcywgcmVsYXRlZFRhYmxlSXRlbXMsIHNlbGVjdG9yLCB0YWJsZUNvZGUsIHRhYmxlVmFsdWVzO1xuICAgICAgdGFibGVDb2RlID0gbWFwLl9GUk9NX1RBQkxFX0NPREU7XG4gICAgICBmb3JtVGFibGVGaWVsZCA9IGdldEZvcm1UYWJsZUZpZWxkKHRhYmxlQ29kZSk7XG4gICAgICBpZiAoIXRhYmxlQ29kZSkge1xuICAgICAgICByZXR1cm4gY29uc29sZS53YXJuKCd0YWJsZVRvUmVsYXRlZDogWycgKyBrZXkgKyAnXSBtaXNzaW5nIGNvcnJlc3BvbmRpbmcgdGFibGUuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWxhdGVkT2JqZWN0TmFtZSA9IGtleTtcbiAgICAgICAgdGFibGVWYWx1ZXMgPSBbXTtcbiAgICAgICAgcmVsYXRlZFRhYmxlSXRlbXMgPSBbXTtcbiAgICAgICAgcmVsYXRlZE9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKTtcbiAgICAgICAgcmVsYXRlZEZpZWxkID0gXy5maW5kKHJlbGF0ZWRPYmplY3QuZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgcmV0dXJuIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhmLnR5cGUpICYmIGYucmVmZXJlbmNlX3RvID09PSBvYmplY3ROYW1lO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVsYXRlZEZpZWxkTmFtZSA9IHJlbGF0ZWRGaWVsZC5uYW1lO1xuICAgICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgICBzZWxlY3RvcltyZWxhdGVkRmllbGROYW1lXSA9IHJlY29yZElkO1xuICAgICAgICByZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCk7XG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZChzZWxlY3Rvcik7XG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2goZnVuY3Rpb24ocnIpIHtcbiAgICAgICAgICB2YXIgdGFibGVWYWx1ZUl0ZW07XG4gICAgICAgICAgdGFibGVWYWx1ZUl0ZW0gPSB7fTtcbiAgICAgICAgICBfLmVhY2gobWFwLCBmdW5jdGlvbih2YWx1ZUtleSwgZmllbGRLZXkpIHtcbiAgICAgICAgICAgIHZhciBmb3JtRmllbGQsIGZvcm1GaWVsZEtleSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlbGF0ZWRPYmplY3RGaWVsZCwgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKGZpZWxkS2V5ICE9PSAnX0ZST01fVEFCTEVfQ09ERScpIHtcbiAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICBmb3JtRmllbGRLZXk7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZUtleS5zdGFydHNXaXRoKHRhYmxlQ29kZSArICcuJykpIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSAodmFsdWVLZXkuc3BsaXQoXCIuXCIpWzFdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSB2YWx1ZUtleTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBmb3JtRmllbGQgPSBnZXRGb3JtVGFibGVTdWJGaWVsZChmb3JtVGFibGVGaWVsZCwgZm9ybUZpZWxkS2V5KTtcbiAgICAgICAgICAgICAgcmVsYXRlZE9iamVjdEZpZWxkID0gcmVsYXRlZE9iamVjdC5maWVsZHNbZmllbGRLZXldO1xuICAgICAgICAgICAgICBpZiAoIWZvcm1GaWVsZCB8fCAhcmVsYXRlZE9iamVjdEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb09iamVjdE5hbWUgPSByZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XTtcbiAgICAgICAgICAgICAgICBpZiAocmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV07XG4gICAgICAgICAgICAgICAgaWYgKCFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgaWYgKGZvcm1GaWVsZC50eXBlID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdncm91cCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gdGFibGVWYWx1ZUl0ZW1bZm9ybUZpZWxkS2V5XSA9IHRhYmxlRmllbGRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoIV8uaXNFbXB0eSh0YWJsZVZhbHVlSXRlbSkpIHtcbiAgICAgICAgICAgIHRhYmxlVmFsdWVJdGVtLl9pZCA9IHJyLl9pZDtcbiAgICAgICAgICAgIHRhYmxlVmFsdWVzLnB1c2godGFibGVWYWx1ZUl0ZW0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRUYWJsZUl0ZW1zLnB1c2goe1xuICAgICAgICAgICAgICBfdGFibGU6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IHJyLl9pZCxcbiAgICAgICAgICAgICAgICBfY29kZTogdGFibGVDb2RlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHZhbHVlc1t0YWJsZUNvZGVdID0gdGFibGVWYWx1ZXM7XG4gICAgICAgIHJldHVybiByZWxhdGVkVGFibGVzSW5mb1tyZWxhdGVkT2JqZWN0TmFtZV0gPSByZWxhdGVkVGFibGVJdGVtcztcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAob3cuZmllbGRfbWFwX3NjcmlwdCkge1xuICAgICAgXy5leHRlbmQodmFsdWVzLCB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmV2YWxGaWVsZE1hcFNjcmlwdChvdy5maWVsZF9tYXBfc2NyaXB0LCBvYmplY3ROYW1lLCBzcGFjZUlkLCByZWNvcmRJZCkpO1xuICAgIH1cbiAgfVxuICBmaWx0ZXJWYWx1ZXMgPSB7fTtcbiAgXy5lYWNoKF8ua2V5cyh2YWx1ZXMpLCBmdW5jdGlvbihrKSB7XG4gICAgaWYgKGZpZWxkQ29kZXMuaW5jbHVkZXMoaykpIHtcbiAgICAgIHJldHVybiBmaWx0ZXJWYWx1ZXNba10gPSB2YWx1ZXNba107XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZpbHRlclZhbHVlcztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0ID0gZnVuY3Rpb24oZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgb2JqZWN0SWQpIHtcbiAgdmFyIGZ1bmMsIHJlY29yZCwgc2NyaXB0LCB2YWx1ZXM7XG4gIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKG9iamVjdElkKTtcbiAgc2NyaXB0ID0gXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZWNvcmQpIHsgXCIgKyBmaWVsZF9tYXBfc2NyaXB0ICsgXCIgfVwiO1xuICBmdW5jID0gX2V2YWwoc2NyaXB0LCBcImZpZWxkX21hcF9zY3JpcHRcIik7XG4gIHZhbHVlcyA9IGZ1bmMocmVjb3JkKTtcbiAgaWYgKF8uaXNPYmplY3QodmFsdWVzKSkge1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcihcImV2YWxGaWVsZE1hcFNjcmlwdDog6ISa5pys6L+U5Zue5YC857G75Z6L5LiN5piv5a+56LGhXCIpO1xuICB9XG4gIHJldHVybiB7fTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2ggPSBmdW5jdGlvbihyZWNvcmRJZHMsIHNwYWNlSWQsIGluc0lkLCBhcHByb3ZlSWQpIHtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1snY21zX2ZpbGVzJ10uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgcGFyZW50OiByZWNvcmRJZHNcbiAgfSkuZm9yRWFjaChmdW5jdGlvbihjZikge1xuICAgIHJldHVybiBfLmVhY2goY2YudmVyc2lvbnMsIGZ1bmN0aW9uKHZlcnNpb25JZCwgaWR4KSB7XG4gICAgICB2YXIgZiwgbmV3RmlsZTtcbiAgICAgIGYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zWydjZnMuZmlsZXMuZmlsZXJlY29yZCddLmZpbmRPbmUodmVyc2lvbklkKTtcbiAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgICAgcmV0dXJuIG5ld0ZpbGUuYXR0YWNoRGF0YShmLmNyZWF0ZVJlYWRTdHJlYW0oJ2ZpbGVzJyksIHtcbiAgICAgICAgdHlwZTogZi5vcmlnaW5hbC50eXBlXG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdmFyIG1ldGFkYXRhO1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnIuZXJyb3IsIGVyci5yZWFzb24pO1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUubmFtZShmLm5hbWUoKSk7XG4gICAgICAgIG5ld0ZpbGUuc2l6ZShmLnNpemUoKSk7XG4gICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgIG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxuICAgICAgICAgIG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICBpbnN0YW5jZTogaW5zSWQsXG4gICAgICAgICAgYXBwcm92ZTogYXBwcm92ZUlkLFxuICAgICAgICAgIHBhcmVudDogY2YuX2lkXG4gICAgICAgIH07XG4gICAgICAgIGlmIChpZHggPT09IDApIHtcbiAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgIHJldHVybiBjZnMuaW5zdGFuY2VzLmluc2VydChuZXdGaWxlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8gPSBmdW5jdGlvbihyZWNvcmRJZHMsIGluc0lkLCBzcGFjZUlkKSB7XG4gIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkudXBkYXRlKHJlY29yZElkcy5pZHNbMF0sIHtcbiAgICAkcHVzaDoge1xuICAgICAgaW5zdGFuY2VzOiB7XG4gICAgICAgICRlYWNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgX2lkOiBpbnNJZCxcbiAgICAgICAgICAgIHN0YXRlOiAnZHJhZnQnXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICAkcG9zaXRpb246IDBcbiAgICAgIH1cbiAgICB9LFxuICAgICRzZXQ6IHtcbiAgICAgIGxvY2tlZDogdHJ1ZSxcbiAgICAgIGluc3RhbmNlX3N0YXRlOiAnZHJhZnQnXG4gICAgfVxuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvID0gZnVuY3Rpb24ocmVsYXRlZFRhYmxlc0luZm8sIGluc0lkLCBzcGFjZUlkKSB7XG4gIF8uZWFjaChyZWxhdGVkVGFibGVzSW5mbywgZnVuY3Rpb24odGFibGVJdGVtcywgcmVsYXRlZE9iamVjdE5hbWUpIHtcbiAgICB2YXIgcmVsYXRlZENvbGxlY3Rpb247XG4gICAgcmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpO1xuICAgIHJldHVybiBfLmVhY2godGFibGVJdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIHJlbGF0ZWRDb2xsZWN0aW9uLnVwZGF0ZShpdGVtLl90YWJsZS5faWQsIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGluc3RhbmNlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBfaWQ6IGluc0lkLFxuICAgICAgICAgICAgICBzdGF0ZTogJ2RyYWZ0J1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAgX3RhYmxlOiBpdGVtLl90YWJsZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsID0gZnVuY3Rpb24ocmVjb3JkSWRzLCBzcGFjZUlkKSB7XG4gIHZhciByZWNvcmQ7XG4gIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkuZmluZE9uZSh7XG4gICAgX2lkOiByZWNvcmRJZHMuaWRzWzBdLFxuICAgIGluc3RhbmNlczoge1xuICAgICAgJGV4aXN0czogdHJ1ZVxuICAgIH1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgaW5zdGFuY2VzOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKHJlY29yZCAmJiByZWNvcmQuaW5zdGFuY2VzWzBdLnN0YXRlICE9PSAnY29tcGxldGVkJyAmJiBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kKHJlY29yZC5pbnN0YW5jZXNbMF0uX2lkKS5jb3VudCgpID4gMCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5q2k6K6w5b2V5bey5Y+R6LW35rWB56iL5q2j5Zyo5a6h5om55Lit77yM5b6F5a6h5om557uT5p2f5pa55Y+v5Y+R6LW35LiL5LiA5qyh5a6h5om577yBXCIpO1xuICB9XG59O1xuIiwiSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL3MzL1wiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXG5cdEpzb25Sb3V0ZXMucGFyc2VGaWxlcyByZXEsIHJlcywgKCktPlxuXHRcdGNvbGxlY3Rpb24gPSBjZnMuZmlsZXNcblx0XHRmaWxlQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0T2JqZWN0KFwiY21zX2ZpbGVzXCIpLmRiXG5cblx0XHRpZiByZXEuZmlsZXMgYW5kIHJlcS5maWxlc1swXVxuXG5cdFx0XHRuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcblx0XHRcdG5ld0ZpbGUuYXR0YWNoRGF0YSByZXEuZmlsZXNbMF0uZGF0YSwge3R5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZX0sIChlcnIpIC0+XG5cdFx0XHRcdGZpbGVuYW1lID0gcmVxLmZpbGVzWzBdLmZpbGVuYW1lXG5cdFx0XHRcdGV4dGVudGlvbiA9IGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKClcblx0XHRcdFx0aWYgW1wiaW1hZ2UuanBnXCIsIFwiaW1hZ2UuZ2lmXCIsIFwiaW1hZ2UuanBlZ1wiLCBcImltYWdlLnBuZ1wiXS5pbmNsdWRlcyhmaWxlbmFtZS50b0xvd2VyQ2FzZSgpKVxuXHRcdFx0XHRcdGZpbGVuYW1lID0gXCJpbWFnZS1cIiArIG1vbWVudChuZXcgRGF0ZSgpKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzJykgKyBcIi5cIiArIGV4dGVudGlvblxuXG5cdFx0XHRcdGJvZHkgPSByZXEuYm9keVxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRpZiBib2R5ICYmIChib2R5Wyd1cGxvYWRfZnJvbSddIGlzIFwiSUVcIiBvciBib2R5Wyd1cGxvYWRfZnJvbSddIGlzIFwibm9kZVwiKVxuXHRcdFx0XHRcdFx0ZmlsZW5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQoZmlsZW5hbWUpXG5cdFx0XHRcdGNhdGNoIGVcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGZpbGVuYW1lKVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZVxuXHRcdFx0XHRcdGZpbGVuYW1lID0gZmlsZW5hbWUucmVwbGFjZSgvJS9nLCBcIi1cIilcblxuXHRcdFx0XHRuZXdGaWxlLm5hbWUoZmlsZW5hbWUpXG5cblx0XHRcdFx0aWYgYm9keSAmJiBib2R5Wydvd25lciddICYmIGJvZHlbJ3NwYWNlJ10gJiYgYm9keVsncmVjb3JkX2lkJ10gICYmIGJvZHlbJ29iamVjdF9uYW1lJ11cblx0XHRcdFx0XHRwYXJlbnQgPSBib2R5WydwYXJlbnQnXVxuXHRcdFx0XHRcdG93bmVyID0gYm9keVsnb3duZXInXVxuXHRcdFx0XHRcdG93bmVyX25hbWUgPSBib2R5Wydvd25lcl9uYW1lJ11cblx0XHRcdFx0XHRzcGFjZSA9IGJvZHlbJ3NwYWNlJ11cblx0XHRcdFx0XHRyZWNvcmRfaWQgPSBib2R5WydyZWNvcmRfaWQnXVxuXHRcdFx0XHRcdG9iamVjdF9uYW1lID0gYm9keVsnb2JqZWN0X25hbWUnXVxuXHRcdFx0XHRcdHBhcmVudCA9IGJvZHlbJ3BhcmVudCddXG5cdFx0XHRcdFx0bWV0YWRhdGEgPSB7b3duZXI6b3duZXIsIG93bmVyX25hbWU6b3duZXJfbmFtZSwgc3BhY2U6c3BhY2UsIHJlY29yZF9pZDpyZWNvcmRfaWQsIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZX1cblx0XHRcdFx0XHRpZiBwYXJlbnRcblx0XHRcdFx0XHRcdG1ldGFkYXRhLnBhcmVudCA9IHBhcmVudFxuXHRcdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YVxuXHRcdFx0XHRcdGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXG5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXG5cblxuXHRcdFx0XHRzaXplID0gZmlsZU9iai5vcmlnaW5hbC5zaXplXG5cdFx0XHRcdGlmICFzaXplXG5cdFx0XHRcdFx0c2l6ZSA9IDEwMjRcblx0XHRcdFx0aWYgcGFyZW50XG5cdFx0XHRcdFx0ZmlsZUNvbGxlY3Rpb24udXBkYXRlKHtfaWQ6cGFyZW50fSx7XG5cdFx0XHRcdFx0XHQkc2V0OlxuXHRcdFx0XHRcdFx0XHRleHRlbnRpb246IGV4dGVudGlvblxuXHRcdFx0XHRcdFx0XHRzaXplOiBzaXplXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkOiAobmV3IERhdGUoKSlcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IG93bmVyXG5cdFx0XHRcdFx0XHQkcHVzaDpcblx0XHRcdFx0XHRcdFx0dmVyc2lvbnM6XG5cdFx0XHRcdFx0XHRcdFx0JGVhY2g6IFsgZmlsZU9iai5faWQgXVxuXHRcdFx0XHRcdFx0XHRcdCRwb3NpdGlvbjogMFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRuZXdGaWxlT2JqSWQgPSBmaWxlQ29sbGVjdGlvbi5kaXJlY3QuaW5zZXJ0IHtcblx0XHRcdFx0XHRcdG5hbWU6IGZpbGVuYW1lXG5cdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogJydcblx0XHRcdFx0XHRcdGV4dGVudGlvbjogZXh0ZW50aW9uXG5cdFx0XHRcdFx0XHRzaXplOiBzaXplXG5cdFx0XHRcdFx0XHR2ZXJzaW9uczogW2ZpbGVPYmouX2lkXVxuXHRcdFx0XHRcdFx0cGFyZW50OiB7bzpvYmplY3RfbmFtZSxpZHM6W3JlY29yZF9pZF19XG5cdFx0XHRcdFx0XHRvd25lcjogb3duZXJcblx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZVxuXHRcdFx0XHRcdFx0Y3JlYXRlZDogKG5ldyBEYXRlKCkpXG5cdFx0XHRcdFx0XHRjcmVhdGVkX2J5OiBvd25lclxuXHRcdFx0XHRcdFx0bW9kaWZpZWQ6IChuZXcgRGF0ZSgpKVxuXHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IG93bmVyXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGZpbGVPYmoudXBkYXRlKHskc2V0OiB7J21ldGFkYXRhLnBhcmVudCcgOiBuZXdGaWxlT2JqSWR9fSlcblxuXHRcdFx0XHRyZXNwID1cblx0XHRcdFx0XHR2ZXJzaW9uX2lkOiBmaWxlT2JqLl9pZCxcblx0XHRcdFx0XHRzaXplOiBzaXplXG5cblx0XHRcdFx0cmVzLnNldEhlYWRlcihcIngtYW16LXZlcnNpb24taWRcIixmaWxlT2JqLl9pZCk7XG5cdFx0XHRcdHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xuXHRcdFx0XHRyZXR1cm5cblx0XHRlbHNlXG5cdFx0XHRyZXMuc3RhdHVzQ29kZSA9IDUwMDtcblx0XHRcdHJlcy5lbmQoKTtcblxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL3MzLzpjb2xsZWN0aW9uXCIsICAocmVxLCByZXMsIG5leHQpIC0+XG5cdHRyeVxuXHRcdHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcylcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBwZXJtaXNzaW9uXCIpXG5cblx0XHRjb2xsZWN0aW9uTmFtZSA9IHJlcS5wYXJhbXMuY29sbGVjdGlvblxuXG5cdFx0SnNvblJvdXRlcy5wYXJzZUZpbGVzIHJlcSwgcmVzLCAoKS0+XG5cdFx0XHRjb2xsZWN0aW9uID0gY2ZzW2NvbGxlY3Rpb25OYW1lXVxuXG5cdFx0XHRpZiBub3QgY29sbGVjdGlvblxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBDb2xsZWN0aW9uXCIpXG5cblx0XHRcdGlmIHJlcS5maWxlcyBhbmQgcmVxLmZpbGVzWzBdXG5cblx0XHRcdFx0bmV3RmlsZSA9IG5ldyBGUy5GaWxlKClcblx0XHRcdFx0bmV3RmlsZS5uYW1lKHJlcS5maWxlc1swXS5maWxlbmFtZSlcblxuXHRcdFx0XHRpZiByZXEuYm9keVxuXHRcdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEgPSByZXEuYm9keVxuXG5cdFx0XHRcdG5ld0ZpbGUub3duZXIgPSB1c2VySWRcblx0XHRcdFx0bmV3RmlsZS5tZXRhZGF0YS5vd25lciA9IHVzZXJJZFxuXG5cdFx0XHRcdG5ld0ZpbGUuYXR0YWNoRGF0YSByZXEuZmlsZXNbMF0uZGF0YSwge3R5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZX1cblxuXHRcdFx0XHRjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXG5cblx0XHRcdFx0cmVzdWx0RGF0YSA9IGNvbGxlY3Rpb24uZmlsZXMuZmluZE9uZShuZXdGaWxlLl9pZClcblx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdFx0XHRjb2RlOiAyMDBcblx0XHRcdFx0XHRkYXRhOiByZXN1bHREYXRhXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBGaWxlXCIpXG5cblx0XHRyZXR1cm5cblx0Y2F0Y2ggZVxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdGNvZGU6IGUuZXJyb3IgfHwgNTAwXG5cdFx0XHRkYXRhOiB7ZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2V9XG5cdFx0fVxuXG5cblxuZ2V0UXVlcnlTdHJpbmcgPSAoYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgcXVlcnksIG1ldGhvZCkgLT5cblx0Y29uc29sZS5sb2cgXCItLS0tdXVmbG93TWFuYWdlci5nZXRRdWVyeVN0cmluZy0tLS1cIlxuXHRBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJylcblx0ZGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpXG5cblx0cXVlcnkuRm9ybWF0ID0gXCJqc29uXCJcblx0cXVlcnkuVmVyc2lvbiA9IFwiMjAxNy0wMy0yMVwiXG5cdHF1ZXJ5LkFjY2Vzc0tleUlkID0gYWNjZXNzS2V5SWRcblx0cXVlcnkuU2lnbmF0dXJlTWV0aG9kID0gXCJITUFDLVNIQTFcIlxuXHRxdWVyeS5UaW1lc3RhbXAgPSBBTFkudXRpbC5kYXRlLmlzbzg2MDEoZGF0ZSlcblx0cXVlcnkuU2lnbmF0dXJlVmVyc2lvbiA9IFwiMS4wXCJcblx0cXVlcnkuU2lnbmF0dXJlTm9uY2UgPSBTdHJpbmcoZGF0ZS5nZXRUaW1lKCkpXG5cblx0cXVlcnlLZXlzID0gT2JqZWN0LmtleXMocXVlcnkpXG5cdHF1ZXJ5S2V5cy5zb3J0KClcblxuXHRjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcgPSBcIlwiXG5cdHF1ZXJ5S2V5cy5mb3JFYWNoIChuYW1lKSAtPlxuXHRcdGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyArPSBcIiZcIiArIG5hbWUgKyBcIj1cIiArIEFMWS51dGlsLnBvcEVzY2FwZShxdWVyeVtuYW1lXSlcblxuXHRzdHJpbmdUb1NpZ24gPSBtZXRob2QudG9VcHBlckNhc2UoKSArICcmJTJGJicgKyBBTFkudXRpbC5wb3BFc2NhcGUoY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nLnN1YnN0cigxKSlcblxuXHRxdWVyeS5TaWduYXR1cmUgPSBBTFkudXRpbC5jcnlwdG8uaG1hYyhzZWNyZXRBY2Nlc3NLZXkgKyAnJicsIHN0cmluZ1RvU2lnbiwgJ2Jhc2U2NCcsICdzaGExJylcblxuXHRxdWVyeVN0ciA9IEFMWS51dGlsLnF1ZXJ5UGFyYW1zVG9TdHJpbmcocXVlcnkpXG5cdGNvbnNvbGUubG9nIHF1ZXJ5U3RyXG5cdHJldHVybiBxdWVyeVN0clxuXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvczMvdm9kL3VwbG9hZFwiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKVxuXG5cdFx0Y29sbGVjdGlvbk5hbWUgPSBcInZpZGVvc1wiXG5cblx0XHRBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJylcblxuXHRcdEpzb25Sb3V0ZXMucGFyc2VGaWxlcyByZXEsIHJlcywgKCktPlxuXHRcdFx0Y29sbGVjdGlvbiA9IGNmc1tjb2xsZWN0aW9uTmFtZV1cblxuXHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gQ29sbGVjdGlvblwiKVxuXG5cdFx0XHRpZiByZXEuZmlsZXMgYW5kIHJlcS5maWxlc1swXVxuXG5cdFx0XHRcdGlmIGNvbGxlY3Rpb25OYW1lIGlzICd2aWRlb3MnIGFuZCBNZXRlb3Iuc2V0dGluZ3MucHVibGljLmNmcz8uc3RvcmUgaXMgXCJPU1NcIlxuXHRcdFx0XHRcdGFjY2Vzc0tleUlkID0gTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4/LmFjY2Vzc0tleUlkXG5cdFx0XHRcdFx0c2VjcmV0QWNjZXNzS2V5ID0gTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4/LnNlY3JldEFjY2Vzc0tleVxuXG5cdFx0XHRcdFx0ZGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpXG5cblx0XHRcdFx0XHRxdWVyeSA9IHtcblx0XHRcdFx0XHRcdEFjdGlvbjogXCJDcmVhdGVVcGxvYWRWaWRlb1wiXG5cdFx0XHRcdFx0XHRUaXRsZTogcmVxLmZpbGVzWzBdLmZpbGVuYW1lXG5cdFx0XHRcdFx0XHRGaWxlTmFtZTogcmVxLmZpbGVzWzBdLmZpbGVuYW1lXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dXJsID0gXCJodHRwOi8vdm9kLmNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS8/XCIgKyBnZXRRdWVyeVN0cmluZyhhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBxdWVyeSwgJ0dFVCcpXG5cblx0XHRcdFx0XHRyID0gSFRUUC5jYWxsICdHRVQnLCB1cmxcblxuXHRcdFx0XHRcdGNvbnNvbGUubG9nIHJcblxuXHRcdFx0XHRcdGlmIHIuZGF0YT8uVmlkZW9JZFxuXHRcdFx0XHRcdFx0dmlkZW9JZCA9IHIuZGF0YS5WaWRlb0lkXG5cdFx0XHRcdFx0XHR1cGxvYWRBZGRyZXNzID0gSlNPTi5wYXJzZShuZXcgQnVmZmVyKHIuZGF0YS5VcGxvYWRBZGRyZXNzLCAnYmFzZTY0JykudG9TdHJpbmcoKSlcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nIHVwbG9hZEFkZHJlc3Ncblx0XHRcdFx0XHRcdHVwbG9hZEF1dGggPSBKU09OLnBhcnNlKG5ldyBCdWZmZXIoci5kYXRhLlVwbG9hZEF1dGgsICdiYXNlNjQnKS50b1N0cmluZygpKVxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cgdXBsb2FkQXV0aFxuXG5cdFx0XHRcdFx0XHRvc3MgPSBuZXcgQUxZLk9TUyh7XG5cdFx0XHRcdFx0XHRcdFwiYWNjZXNzS2V5SWRcIjogdXBsb2FkQXV0aC5BY2Nlc3NLZXlJZCxcblx0XHRcdFx0XHRcdFx0XCJzZWNyZXRBY2Nlc3NLZXlcIjogdXBsb2FkQXV0aC5BY2Nlc3NLZXlTZWNyZXQsXG5cdFx0XHRcdFx0XHRcdFwiZW5kcG9pbnRcIjogdXBsb2FkQWRkcmVzcy5FbmRwb2ludCxcblx0XHRcdFx0XHRcdFx0XCJhcGlWZXJzaW9uXCI6ICcyMDEzLTEwLTE1Jyxcblx0XHRcdFx0XHRcdFx0XCJzZWN1cml0eVRva2VuXCI6IHVwbG9hZEF1dGguU2VjdXJpdHlUb2tlblxuXHRcdFx0XHRcdFx0fSlcblxuXHRcdFx0XHRcdFx0b3NzLnB1dE9iamVjdCB7XG5cdFx0XHRcdFx0XHRcdEJ1Y2tldDogdXBsb2FkQWRkcmVzcy5CdWNrZXQsXG5cdFx0XHRcdFx0XHRcdEtleTogdXBsb2FkQWRkcmVzcy5GaWxlTmFtZSxcblx0XHRcdFx0XHRcdFx0Qm9keTogcmVxLmZpbGVzWzBdLmRhdGEsXG5cdFx0XHRcdFx0XHRcdEFjY2Vzc0NvbnRyb2xBbGxvd09yaWdpbjogJycsXG5cdFx0XHRcdFx0XHRcdENvbnRlbnRUeXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGUsXG5cdFx0XHRcdFx0XHRcdENhY2hlQ29udHJvbDogJ25vLWNhY2hlJyxcblx0XHRcdFx0XHRcdFx0Q29udGVudERpc3Bvc2l0aW9uOiAnJyxcblx0XHRcdFx0XHRcdFx0Q29udGVudEVuY29kaW5nOiAndXRmLTgnLFxuXHRcdFx0XHRcdFx0XHRTZXJ2ZXJTaWRlRW5jcnlwdGlvbjogJ0FFUzI1NicsXG5cdFx0XHRcdFx0XHRcdEV4cGlyZXM6IG51bGxcblx0XHRcdFx0XHRcdH0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQgKGVyciwgZGF0YSkgLT5cblxuXHRcdFx0XHRcdFx0XHRpZiBlcnJcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnZXJyb3I6JywgZXJyKVxuXHRcdFx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlcnIubWVzc2FnZSlcblxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnc3VjY2VzczonLCBkYXRhKVxuXG5cdFx0XHRcdFx0XHRcdG5ld0RhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKVxuXG5cdFx0XHRcdFx0XHRcdGdldFBsYXlJbmZvUXVlcnkgPSB7XG5cdFx0XHRcdFx0XHRcdFx0QWN0aW9uOiAnR2V0UGxheUluZm8nXG5cdFx0XHRcdFx0XHRcdFx0VmlkZW9JZDogdmlkZW9JZFxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Z2V0UGxheUluZm9VcmwgPSBcImh0dHA6Ly92b2QuY24tc2hhbmdoYWkuYWxpeXVuY3MuY29tLz9cIiArIGdldFF1ZXJ5U3RyaW5nKGFjY2Vzc0tleUlkLCBzZWNyZXRBY2Nlc3NLZXksIGdldFBsYXlJbmZvUXVlcnksICdHRVQnKVxuXG5cdFx0XHRcdFx0XHRcdGdldFBsYXlJbmZvUmVzdWx0ID0gSFRUUC5jYWxsICdHRVQnLCBnZXRQbGF5SW5mb1VybFxuXG5cdFx0XHRcdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRcdFx0XHRcdFx0Y29kZTogMjAwXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YTogZ2V0UGxheUluZm9SZXN1bHRcblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBGaWxlXCIpXG5cblx0XHRyZXR1cm5cblx0Y2F0Y2ggZVxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdGNvZGU6IGUuZXJyb3IgfHwgNTAwXG5cdFx0XHRkYXRhOiB7ZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2V9XG5cdFx0fSIsInZhciBnZXRRdWVyeVN0cmluZztcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL3MzL1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5wYXJzZUZpbGVzKHJlcSwgcmVzLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZmlsZUNvbGxlY3Rpb24sIG5ld0ZpbGU7XG4gICAgY29sbGVjdGlvbiA9IGNmcy5maWxlcztcbiAgICBmaWxlQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0T2JqZWN0KFwiY21zX2ZpbGVzXCIpLmRiO1xuICAgIGlmIChyZXEuZmlsZXMgJiYgcmVxLmZpbGVzWzBdKSB7XG4gICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgIHJldHVybiBuZXdGaWxlLmF0dGFjaERhdGEocmVxLmZpbGVzWzBdLmRhdGEsIHtcbiAgICAgICAgdHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlXG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdmFyIGJvZHksIGUsIGV4dGVudGlvbiwgZmlsZU9iaiwgZmlsZW5hbWUsIG1ldGFkYXRhLCBuZXdGaWxlT2JqSWQsIG9iamVjdF9uYW1lLCBvd25lciwgb3duZXJfbmFtZSwgcGFyZW50LCByZWNvcmRfaWQsIHJlc3AsIHNpemUsIHNwYWNlO1xuICAgICAgICBmaWxlbmFtZSA9IHJlcS5maWxlc1swXS5maWxlbmFtZTtcbiAgICAgICAgZXh0ZW50aW9uID0gZmlsZW5hbWUuc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgICAgaWYgKFtcImltYWdlLmpwZ1wiLCBcImltYWdlLmdpZlwiLCBcImltYWdlLmpwZWdcIiwgXCJpbWFnZS5wbmdcIl0uaW5jbHVkZXMoZmlsZW5hbWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICBmaWxlbmFtZSA9IFwiaW1hZ2UtXCIgKyBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KCdZWVlZTU1EREhIbW1zcycpICsgXCIuXCIgKyBleHRlbnRpb247XG4gICAgICAgIH1cbiAgICAgICAgYm9keSA9IHJlcS5ib2R5O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChib2R5ICYmIChib2R5Wyd1cGxvYWRfZnJvbSddID09PSBcIklFXCIgfHwgYm9keVsndXBsb2FkX2Zyb20nXSA9PT0gXCJub2RlXCIpKSB7XG4gICAgICAgICAgICBmaWxlbmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudChmaWxlbmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGZpbGVuYW1lKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUucmVwbGFjZSgvJS9nLCBcIi1cIik7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RmlsZS5uYW1lKGZpbGVuYW1lKTtcbiAgICAgICAgaWYgKGJvZHkgJiYgYm9keVsnb3duZXInXSAmJiBib2R5WydzcGFjZSddICYmIGJvZHlbJ3JlY29yZF9pZCddICYmIGJvZHlbJ29iamVjdF9uYW1lJ10pIHtcbiAgICAgICAgICBwYXJlbnQgPSBib2R5WydwYXJlbnQnXTtcbiAgICAgICAgICBvd25lciA9IGJvZHlbJ293bmVyJ107XG4gICAgICAgICAgb3duZXJfbmFtZSA9IGJvZHlbJ293bmVyX25hbWUnXTtcbiAgICAgICAgICBzcGFjZSA9IGJvZHlbJ3NwYWNlJ107XG4gICAgICAgICAgcmVjb3JkX2lkID0gYm9keVsncmVjb3JkX2lkJ107XG4gICAgICAgICAgb2JqZWN0X25hbWUgPSBib2R5WydvYmplY3RfbmFtZSddO1xuICAgICAgICAgIHBhcmVudCA9IGJvZHlbJ3BhcmVudCddO1xuICAgICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgICAgICAgb3duZXJfbmFtZTogb3duZXJfbmFtZSxcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgICAgIHJlY29yZF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIHNpemUgPSBmaWxlT2JqLm9yaWdpbmFsLnNpemU7XG4gICAgICAgIGlmICghc2l6ZSkge1xuICAgICAgICAgIHNpemUgPSAxMDI0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICBmaWxlQ29sbGVjdGlvbi51cGRhdGUoe1xuICAgICAgICAgICAgX2lkOiBwYXJlbnRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgIGV4dGVudGlvbjogZXh0ZW50aW9uLFxuICAgICAgICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgbW9kaWZpZWRfYnk6IG93bmVyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJHB1c2g6IHtcbiAgICAgICAgICAgICAgdmVyc2lvbnM6IHtcbiAgICAgICAgICAgICAgICAkZWFjaDogW2ZpbGVPYmouX2lkXSxcbiAgICAgICAgICAgICAgICAkcG9zaXRpb246IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld0ZpbGVPYmpJZCA9IGZpbGVDb2xsZWN0aW9uLmRpcmVjdC5pbnNlcnQoe1xuICAgICAgICAgICAgbmFtZTogZmlsZW5hbWUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICBleHRlbnRpb246IGV4dGVudGlvbixcbiAgICAgICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgICAgICB2ZXJzaW9uczogW2ZpbGVPYmouX2lkXSxcbiAgICAgICAgICAgIHBhcmVudDoge1xuICAgICAgICAgICAgICBvOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICAgICAgaWRzOiBbcmVjb3JkX2lkXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBjcmVhdGVkX2J5OiBvd25lcixcbiAgICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IG93bmVyXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZmlsZU9iai51cGRhdGUoe1xuICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAnbWV0YWRhdGEucGFyZW50JzogbmV3RmlsZU9iaklkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzcCA9IHtcbiAgICAgICAgICB2ZXJzaW9uX2lkOiBmaWxlT2JqLl9pZCxcbiAgICAgICAgICBzaXplOiBzaXplXG4gICAgICAgIH07XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoXCJ4LWFtei12ZXJzaW9uLWlkXCIsIGZpbGVPYmouX2lkKTtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwKSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG4gICAgICByZXR1cm4gcmVzLmVuZCgpO1xuICAgIH1cbiAgfSk7XG59KTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL3MzLzpjb2xsZWN0aW9uXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBjb2xsZWN0aW9uTmFtZSwgZSwgdXNlcklkO1xuICB0cnkge1xuICAgIHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcyk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIHBlcm1pc3Npb25cIik7XG4gICAgfVxuICAgIGNvbGxlY3Rpb25OYW1lID0gcmVxLnBhcmFtcy5jb2xsZWN0aW9uO1xuICAgIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyhyZXEsIHJlcywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgbmV3RmlsZSwgcmVzdWx0RGF0YTtcbiAgICAgIGNvbGxlY3Rpb24gPSBjZnNbY29sbGVjdGlvbk5hbWVdO1xuICAgICAgaWYgKCFjb2xsZWN0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIENvbGxlY3Rpb25cIik7XG4gICAgICB9XG4gICAgICBpZiAocmVxLmZpbGVzICYmIHJlcS5maWxlc1swXSkge1xuICAgICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgICAgbmV3RmlsZS5uYW1lKHJlcS5maWxlc1swXS5maWxlbmFtZSk7XG4gICAgICAgIGlmIChyZXEuYm9keSkge1xuICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSByZXEuYm9keTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm93bmVyID0gdXNlcklkO1xuICAgICAgICBuZXdGaWxlLm1ldGFkYXRhLm93bmVyID0gdXNlcklkO1xuICAgICAgICBuZXdGaWxlLmF0dGFjaERhdGEocmVxLmZpbGVzWzBdLmRhdGEsIHtcbiAgICAgICAgICB0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGVcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbGxlY3Rpb24uaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgICByZXN1bHREYXRhID0gY29sbGVjdGlvbi5maWxlcy5maW5kT25lKG5ld0ZpbGUuX2lkKTtcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICBkYXRhOiByZXN1bHREYXRhXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gRmlsZVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogZS5lcnJvciB8fCA1MDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuXG5nZXRRdWVyeVN0cmluZyA9IGZ1bmN0aW9uKGFjY2Vzc0tleUlkLCBzZWNyZXRBY2Nlc3NLZXksIHF1ZXJ5LCBtZXRob2QpIHtcbiAgdmFyIEFMWSwgY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nLCBkYXRlLCBxdWVyeUtleXMsIHF1ZXJ5U3RyLCBzdHJpbmdUb1NpZ247XG4gIGNvbnNvbGUubG9nKFwiLS0tLXV1Zmxvd01hbmFnZXIuZ2V0UXVlcnlTdHJpbmctLS0tXCIpO1xuICBBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJyk7XG4gIGRhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKTtcbiAgcXVlcnkuRm9ybWF0ID0gXCJqc29uXCI7XG4gIHF1ZXJ5LlZlcnNpb24gPSBcIjIwMTctMDMtMjFcIjtcbiAgcXVlcnkuQWNjZXNzS2V5SWQgPSBhY2Nlc3NLZXlJZDtcbiAgcXVlcnkuU2lnbmF0dXJlTWV0aG9kID0gXCJITUFDLVNIQTFcIjtcbiAgcXVlcnkuVGltZXN0YW1wID0gQUxZLnV0aWwuZGF0ZS5pc284NjAxKGRhdGUpO1xuICBxdWVyeS5TaWduYXR1cmVWZXJzaW9uID0gXCIxLjBcIjtcbiAgcXVlcnkuU2lnbmF0dXJlTm9uY2UgPSBTdHJpbmcoZGF0ZS5nZXRUaW1lKCkpO1xuICBxdWVyeUtleXMgPSBPYmplY3Qua2V5cyhxdWVyeSk7XG4gIHF1ZXJ5S2V5cy5zb3J0KCk7XG4gIGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyA9IFwiXCI7XG4gIHF1ZXJ5S2V5cy5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nICs9IFwiJlwiICsgbmFtZSArIFwiPVwiICsgQUxZLnV0aWwucG9wRXNjYXBlKHF1ZXJ5W25hbWVdKTtcbiAgfSk7XG4gIHN0cmluZ1RvU2lnbiA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpICsgJyYlMkYmJyArIEFMWS51dGlsLnBvcEVzY2FwZShjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcuc3Vic3RyKDEpKTtcbiAgcXVlcnkuU2lnbmF0dXJlID0gQUxZLnV0aWwuY3J5cHRvLmhtYWMoc2VjcmV0QWNjZXNzS2V5ICsgJyYnLCBzdHJpbmdUb1NpZ24sICdiYXNlNjQnLCAnc2hhMScpO1xuICBxdWVyeVN0ciA9IEFMWS51dGlsLnF1ZXJ5UGFyYW1zVG9TdHJpbmcocXVlcnkpO1xuICBjb25zb2xlLmxvZyhxdWVyeVN0cik7XG4gIHJldHVybiBxdWVyeVN0cjtcbn07XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9zMy92b2QvdXBsb2FkXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBBTFksIGNvbGxlY3Rpb25OYW1lLCBlLCB1c2VySWQ7XG4gIHRyeSB7XG4gICAgdXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKTtcbiAgICB9XG4gICAgY29sbGVjdGlvbk5hbWUgPSBcInZpZGVvc1wiO1xuICAgIEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKTtcbiAgICBKc29uUm91dGVzLnBhcnNlRmlsZXMocmVxLCByZXMsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFjY2Vzc0tleUlkLCBjb2xsZWN0aW9uLCBkYXRlLCBvc3MsIHF1ZXJ5LCByLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHNlY3JldEFjY2Vzc0tleSwgdXBsb2FkQWRkcmVzcywgdXBsb2FkQXV0aCwgdXJsLCB2aWRlb0lkO1xuICAgICAgY29sbGVjdGlvbiA9IGNmc1tjb2xsZWN0aW9uTmFtZV07XG4gICAgICBpZiAoIWNvbGxlY3Rpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gQ29sbGVjdGlvblwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXEuZmlsZXMgJiYgcmVxLmZpbGVzWzBdKSB7XG4gICAgICAgIGlmIChjb2xsZWN0aW9uTmFtZSA9PT0gJ3ZpZGVvcycgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0uY2ZzKSAhPSBudWxsID8gcmVmLnN0b3JlIDogdm9pZCAwKSA9PT0gXCJPU1NcIikge1xuICAgICAgICAgIGFjY2Vzc0tleUlkID0gKHJlZjEgPSBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bikgIT0gbnVsbCA/IHJlZjEuYWNjZXNzS2V5SWQgOiB2b2lkIDA7XG4gICAgICAgICAgc2VjcmV0QWNjZXNzS2V5ID0gKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bikgIT0gbnVsbCA/IHJlZjIuc2VjcmV0QWNjZXNzS2V5IDogdm9pZCAwO1xuICAgICAgICAgIGRhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKTtcbiAgICAgICAgICBxdWVyeSA9IHtcbiAgICAgICAgICAgIEFjdGlvbjogXCJDcmVhdGVVcGxvYWRWaWRlb1wiLFxuICAgICAgICAgICAgVGl0bGU6IHJlcS5maWxlc1swXS5maWxlbmFtZSxcbiAgICAgICAgICAgIEZpbGVOYW1lOiByZXEuZmlsZXNbMF0uZmlsZW5hbWVcbiAgICAgICAgICB9O1xuICAgICAgICAgIHVybCA9IFwiaHR0cDovL3ZvZC5jbi1zaGFuZ2hhaS5hbGl5dW5jcy5jb20vP1wiICsgZ2V0UXVlcnlTdHJpbmcoYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgcXVlcnksICdHRVQnKTtcbiAgICAgICAgICByID0gSFRUUC5jYWxsKCdHRVQnLCB1cmwpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHIpO1xuICAgICAgICAgIGlmICgocmVmMyA9IHIuZGF0YSkgIT0gbnVsbCA/IHJlZjMuVmlkZW9JZCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgdmlkZW9JZCA9IHIuZGF0YS5WaWRlb0lkO1xuICAgICAgICAgICAgdXBsb2FkQWRkcmVzcyA9IEpTT04ucGFyc2UobmV3IEJ1ZmZlcihyLmRhdGEuVXBsb2FkQWRkcmVzcywgJ2Jhc2U2NCcpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codXBsb2FkQWRkcmVzcyk7XG4gICAgICAgICAgICB1cGxvYWRBdXRoID0gSlNPTi5wYXJzZShuZXcgQnVmZmVyKHIuZGF0YS5VcGxvYWRBdXRoLCAnYmFzZTY0JykudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1cGxvYWRBdXRoKTtcbiAgICAgICAgICAgIG9zcyA9IG5ldyBBTFkuT1NTKHtcbiAgICAgICAgICAgICAgXCJhY2Nlc3NLZXlJZFwiOiB1cGxvYWRBdXRoLkFjY2Vzc0tleUlkLFxuICAgICAgICAgICAgICBcInNlY3JldEFjY2Vzc0tleVwiOiB1cGxvYWRBdXRoLkFjY2Vzc0tleVNlY3JldCxcbiAgICAgICAgICAgICAgXCJlbmRwb2ludFwiOiB1cGxvYWRBZGRyZXNzLkVuZHBvaW50LFxuICAgICAgICAgICAgICBcImFwaVZlcnNpb25cIjogJzIwMTMtMTAtMTUnLFxuICAgICAgICAgICAgICBcInNlY3VyaXR5VG9rZW5cIjogdXBsb2FkQXV0aC5TZWN1cml0eVRva2VuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBvc3MucHV0T2JqZWN0KHtcbiAgICAgICAgICAgICAgQnVja2V0OiB1cGxvYWRBZGRyZXNzLkJ1Y2tldCxcbiAgICAgICAgICAgICAgS2V5OiB1cGxvYWRBZGRyZXNzLkZpbGVOYW1lLFxuICAgICAgICAgICAgICBCb2R5OiByZXEuZmlsZXNbMF0uZGF0YSxcbiAgICAgICAgICAgICAgQWNjZXNzQ29udHJvbEFsbG93T3JpZ2luOiAnJyxcbiAgICAgICAgICAgICAgQ29udGVudFR5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZSxcbiAgICAgICAgICAgICAgQ2FjaGVDb250cm9sOiAnbm8tY2FjaGUnLFxuICAgICAgICAgICAgICBDb250ZW50RGlzcG9zaXRpb246ICcnLFxuICAgICAgICAgICAgICBDb250ZW50RW5jb2Rpbmc6ICd1dGYtOCcsXG4gICAgICAgICAgICAgIFNlcnZlclNpZGVFbmNyeXB0aW9uOiAnQUVTMjU2JyxcbiAgICAgICAgICAgICAgRXhwaXJlczogbnVsbFxuICAgICAgICAgICAgfSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgICAgdmFyIGdldFBsYXlJbmZvUXVlcnksIGdldFBsYXlJbmZvUmVzdWx0LCBnZXRQbGF5SW5mb1VybCwgbmV3RGF0ZTtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjonLCBlcnIpO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3N1Y2Nlc3M6JywgZGF0YSk7XG4gICAgICAgICAgICAgIG5ld0RhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKTtcbiAgICAgICAgICAgICAgZ2V0UGxheUluZm9RdWVyeSA9IHtcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdHZXRQbGF5SW5mbycsXG4gICAgICAgICAgICAgICAgVmlkZW9JZDogdmlkZW9JZFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBnZXRQbGF5SW5mb1VybCA9IFwiaHR0cDovL3ZvZC5jbi1zaGFuZ2hhaS5hbGl5dW5jcy5jb20vP1wiICsgZ2V0UXVlcnlTdHJpbmcoYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgZ2V0UGxheUluZm9RdWVyeSwgJ0dFVCcpO1xuICAgICAgICAgICAgICBnZXRQbGF5SW5mb1Jlc3VsdCA9IEhUVFAuY2FsbCgnR0VUJywgZ2V0UGxheUluZm9VcmwpO1xuICAgICAgICAgICAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBnZXRQbGF5SW5mb1Jlc3VsdFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIEZpbGVcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IGUuZXJyb3IgfHwgNTAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvb2JqZWN0L3dvcmtmbG93L2RyYWZ0cycsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0dHJ5XG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxuXHRcdGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZFxuXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxuXG5cdFx0aW5zZXJ0ZWRfaW5zdGFuY2VzID0gbmV3IEFycmF5XG5cblx0XHRfLmVhY2ggaGFzaERhdGFbJ0luc3RhbmNlcyddLCAoaW5zdGFuY2VfZnJvbV9jbGllbnQpIC0+XG5cdFx0XHRuZXdfaW5zX2lkID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UoaW5zdGFuY2VfZnJvbV9jbGllbnQsIGN1cnJlbnRfdXNlcl9pbmZvKVxuXG5cdFx0XHRuZXdfaW5zID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZE9uZSh7IF9pZDogbmV3X2luc19pZCB9LCB7IGZpZWxkczogeyBzcGFjZTogMSwgZmxvdzogMSwgZmxvd192ZXJzaW9uOiAxLCBmb3JtOiAxLCBmb3JtX3ZlcnNpb246IDEgfSB9KVxuXG5cdFx0XHRpbnNlcnRlZF9pbnN0YW5jZXMucHVzaChuZXdfaW5zKVxuXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGluc2VydHM6IGluc2VydGVkX2luc3RhbmNlcyB9XG5cdFx0fVxuXHRjYXRjaCBlXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3sgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfV0gfVxuXHRcdH1cblxuIiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS9vYmplY3Qvd29ya2Zsb3cvZHJhZnRzJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGN1cnJlbnRfdXNlcl9pZCwgY3VycmVudF91c2VyX2luZm8sIGUsIGhhc2hEYXRhLCBpbnNlcnRlZF9pbnN0YW5jZXM7XG4gIHRyeSB7XG4gICAgY3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKTtcbiAgICBjdXJyZW50X3VzZXJfaWQgPSBjdXJyZW50X3VzZXJfaW5mby5faWQ7XG4gICAgaGFzaERhdGEgPSByZXEuYm9keTtcbiAgICBpbnNlcnRlZF9pbnN0YW5jZXMgPSBuZXcgQXJyYXk7XG4gICAgXy5lYWNoKGhhc2hEYXRhWydJbnN0YW5jZXMnXSwgZnVuY3Rpb24oaW5zdGFuY2VfZnJvbV9jbGllbnQpIHtcbiAgICAgIHZhciBuZXdfaW5zLCBuZXdfaW5zX2lkO1xuICAgICAgbmV3X2luc19pZCA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY3JlYXRlX2luc3RhbmNlKGluc3RhbmNlX2Zyb21fY2xpZW50LCBjdXJyZW50X3VzZXJfaW5mbyk7XG4gICAgICBuZXdfaW5zID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogbmV3X2luc19pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBzcGFjZTogMSxcbiAgICAgICAgICBmbG93OiAxLFxuICAgICAgICAgIGZsb3dfdmVyc2lvbjogMSxcbiAgICAgICAgICBmb3JtOiAxLFxuICAgICAgICAgIGZvcm1fdmVyc2lvbjogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBpbnNlcnRlZF9pbnN0YW5jZXMucHVzaChuZXdfaW5zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBpbnNlcnRzOiBpbnNlcnRlZF9pbnN0YW5jZXNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==
