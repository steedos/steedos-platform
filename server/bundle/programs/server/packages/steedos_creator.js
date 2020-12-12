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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjcmVhdG9yL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvbGliL2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvb2JqZWN0X3JlY2VudF92aWV3ZWQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3ZpZXdlZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3JlY29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9yZWNlbnRfcmVjb3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9yZXBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3JlcG9ydF9kYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfZXhwb3J0MnhtbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9leHBvcnQyeG1sLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3JlbGF0ZWRfb2JqZWN0c19yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvcGVuZGluZ19zcGFjZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3BlbmRpbmdfc3BhY2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF90YWJ1bGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF9saXN0dmlld3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy91c2VyX3RhYnVsYXJfc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9yZWxhdGVkX29iamVjdHNfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV91c2VyX2luZm8uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c192aWV3X2xpbWl0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfdmlld19saW1pdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c19ub19mb3JjZV9waG9uZV91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9uZWVkX3RvX2NvbmZpcm0uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX25lZWRfdG9fY29uZmlybS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbGliL3Blcm1pc3Npb25fbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvcGVybWlzc2lvbl9tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9zMy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImJ1c2JveSIsIm1rZGlycCIsIk1ldGVvciIsInNldHRpbmdzIiwiY2ZzIiwiYWxpeXVuIiwiQ3JlYXRvciIsImdldFNjaGVtYSIsIm9iamVjdF9uYW1lIiwicmVmIiwiZ2V0T2JqZWN0Iiwic2NoZW1hIiwiZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCIsImlzQ2xpZW50IiwiUmVhY3RTdGVlZG9zIiwicGx1Z2luQ29tcG9uZW50U2VsZWN0b3IiLCJzdG9yZSIsImdldFN0YXRlIiwiZ2V0T2JqZWN0VXJsIiwicmVjb3JkX2lkIiwiYXBwX2lkIiwibGlzdF92aWV3IiwibGlzdF92aWV3X2lkIiwiU2Vzc2lvbiIsImdldCIsImdldExpc3RWaWV3IiwiX2lkIiwiZ2V0UmVsYXRpdmVVcmwiLCJnZXRPYmplY3RBYnNvbHV0ZVVybCIsIlN0ZWVkb3MiLCJhYnNvbHV0ZVVybCIsImdldE9iamVjdFJvdXRlclVybCIsImdldExpc3RWaWV3VXJsIiwidXJsIiwiZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybCIsImdldFN3aXRjaExpc3RVcmwiLCJnZXRSZWxhdGVkT2JqZWN0VXJsIiwicmVsYXRlZF9vYmplY3RfbmFtZSIsImdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyIsImlzX2RlZXAiLCJpc19za2lwX2hpZGUiLCJpc19yZWxhdGVkIiwiX29iamVjdCIsIl9vcHRpb25zIiwiZmllbGRzIiwiaWNvbiIsInJlbGF0ZWRPYmplY3RzIiwiXyIsImZvckVhY2giLCJmIiwiayIsImhpZGRlbiIsInR5cGUiLCJwdXNoIiwibGFiZWwiLCJ2YWx1ZSIsInJfb2JqZWN0IiwicmVmZXJlbmNlX3RvIiwiaXNTdHJpbmciLCJmMiIsImsyIiwiZ2V0UmVsYXRlZE9iamVjdHMiLCJlYWNoIiwiX3RoaXMiLCJfcmVsYXRlZE9iamVjdCIsInJlbGF0ZWRPYmplY3QiLCJyZWxhdGVkT3B0aW9ucyIsInJlbGF0ZWRPcHRpb24iLCJmb3JlaWduX2tleSIsIm5hbWUiLCJnZXRPYmplY3RGaWx0ZXJGaWVsZE9wdGlvbnMiLCJwZXJtaXNzaW9uX2ZpZWxkcyIsImdldEZpZWxkcyIsImluY2x1ZGUiLCJ0ZXN0IiwiaW5kZXhPZiIsImdldE9iamVjdEZpZWxkT3B0aW9ucyIsImdldEZpbHRlcnNXaXRoRmlsdGVyRmllbGRzIiwiZmlsdGVycyIsImZpbHRlcl9maWVsZHMiLCJsZW5ndGgiLCJuIiwiZmllbGQiLCJyZXF1aXJlZCIsImZpbmRXaGVyZSIsImlzX2RlZmF1bHQiLCJpc19yZXF1aXJlZCIsImZpbHRlckl0ZW0iLCJtYXRjaEZpZWxkIiwiZmluZCIsImdldE9iamVjdFJlY29yZCIsInNlbGVjdF9maWVsZHMiLCJleHBhbmQiLCJjb2xsZWN0aW9uIiwicmVjb3JkIiwicmVmMSIsInJlZjIiLCJUZW1wbGF0ZSIsImluc3RhbmNlIiwib2RhdGEiLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsImdldE9iamVjdFJlY29yZE5hbWUiLCJuYW1lX2ZpZWxkX2tleSIsIk5BTUVfRklFTERfS0VZIiwiZ2V0QXBwIiwiYXBwIiwiQXBwcyIsImRlcHMiLCJkZXBlbmQiLCJnZXRBcHBEYXNoYm9hcmQiLCJkYXNoYm9hcmQiLCJEYXNoYm9hcmRzIiwiYXBwcyIsImdldEFwcERhc2hib2FyZENvbXBvbmVudCIsImdldEFwcE9iamVjdE5hbWVzIiwiYXBwT2JqZWN0cyIsImlzTW9iaWxlIiwib2JqZWN0cyIsIm1vYmlsZV9vYmplY3RzIiwib2JqIiwicGVybWlzc2lvbnMiLCJhbGxvd1JlYWQiLCJnZXRWaXNpYmxlQXBwcyIsImluY2x1ZGVBZG1pbiIsImNoYW5nZUFwcCIsIl9zdWJBcHAiLCJlbnRpdGllcyIsIk9iamVjdCIsImFzc2lnbiIsInZpc2libGVBcHBzU2VsZWN0b3IiLCJnZXRWaXNpYmxlQXBwc09iamVjdHMiLCJ2aXNpYmxlT2JqZWN0TmFtZXMiLCJmbGF0dGVuIiwicGx1Y2siLCJmaWx0ZXIiLCJPYmplY3RzIiwic29ydCIsInNvcnRpbmdNZXRob2QiLCJiaW5kIiwia2V5IiwidW5pcSIsImdldEFwcHNPYmplY3RzIiwidGVtcE9iamVjdHMiLCJjb25jYXQiLCJ2YWxpZGF0ZUZpbHRlcnMiLCJsb2dpYyIsImUiLCJlcnJvck1zZyIsImZpbHRlcl9pdGVtcyIsImZpbHRlcl9sZW5ndGgiLCJmbGFnIiwiaW5kZXgiLCJ3b3JkIiwibWFwIiwiaXNFbXB0eSIsImNvbXBhY3QiLCJyZXBsYWNlIiwibWF0Y2giLCJpIiwiaW5jbHVkZXMiLCJ3IiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwidG9hc3RyIiwiZm9ybWF0RmlsdGVyc1RvTW9uZ28iLCJvcHRpb25zIiwic2VsZWN0b3IiLCJBcnJheSIsIm9wZXJhdGlvbiIsIm9wdGlvbiIsInJlZyIsInN1Yl9zZWxlY3RvciIsImV2YWx1YXRlRm9ybXVsYSIsIlJlZ0V4cCIsImlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyIsImZvcm1hdEZpbHRlcnNUb0RldiIsImxvZ2ljVGVtcEZpbHRlcnMiLCJzdGVlZG9zRmlsdGVycyIsInJlcXVpcmUiLCJpc19sb2dpY19vciIsInBvcCIsIlVTRVJfQ09OVEVYVCIsImZvcm1hdExvZ2ljRmlsdGVyc1RvRGV2IiwiZmlsdGVyX2xvZ2ljIiwiZm9ybWF0X2xvZ2ljIiwieCIsIl9mIiwiaXNBcnJheSIsIkpTT04iLCJzdHJpbmdpZnkiLCJzcGFjZUlkIiwidXNlcklkIiwicmVsYXRlZF9vYmplY3RfbmFtZXMiLCJyZWxhdGVkX29iamVjdHMiLCJ1bnJlbGF0ZWRfb2JqZWN0cyIsImdldE9iamVjdFJlbGF0ZWRzIiwiX2NvbGxlY3Rpb25fbmFtZSIsImdldFBlcm1pc3Npb25zIiwiZGlmZmVyZW5jZSIsInJlbGF0ZWRfb2JqZWN0IiwiaXNBY3RpdmUiLCJnZXRSZWxhdGVkT2JqZWN0TmFtZXMiLCJnZXRBY3Rpb25zIiwiYWN0aW9ucyIsImRpc2FibGVkX2FjdGlvbnMiLCJzb3J0QnkiLCJ2YWx1ZXMiLCJoYXMiLCJhY3Rpb24iLCJhbGxvd19jdXN0b21BY3Rpb25zIiwia2V5cyIsImV4Y2x1ZGVfYWN0aW9ucyIsIm9uIiwiZ2V0TGlzdFZpZXdzIiwiZGlzYWJsZWRfbGlzdF92aWV3cyIsImxpc3Rfdmlld3MiLCJvYmplY3QiLCJpdGVtIiwiaXRlbV9uYW1lIiwib3duZXIiLCJmaWVsZHNOYW1lIiwidW5yZWFkYWJsZV9maWVsZHMiLCJnZXRPYmplY3RGaWVsZHNOYW1lIiwiaXNsb2FkaW5nIiwiYm9vdHN0cmFwTG9hZGVkIiwiY29udmVydFNwZWNpYWxDaGFyYWN0ZXIiLCJzdHIiLCJnZXREaXNhYmxlZEZpZWxkcyIsImZpZWxkTmFtZSIsImF1dG9mb3JtIiwiZGlzYWJsZWQiLCJvbWl0IiwiZ2V0SGlkZGVuRmllbGRzIiwiZ2V0RmllbGRzV2l0aE5vR3JvdXAiLCJncm91cCIsImdldFNvcnRlZEZpZWxkR3JvdXBOYW1lcyIsIm5hbWVzIiwidW5pcXVlIiwiZ2V0RmllbGRzRm9yR3JvdXAiLCJncm91cE5hbWUiLCJnZXRGaWVsZHNXaXRob3V0T21pdCIsInBpY2siLCJnZXRGaWVsZHNJbkZpcnN0TGV2ZWwiLCJmaXJzdExldmVsS2V5cyIsImdldEZpZWxkc0ZvclJlb3JkZXIiLCJpc1NpbmdsZSIsIl9rZXlzIiwiY2hpbGRLZXlzIiwiaXNfd2lkZV8xIiwiaXNfd2lkZV8yIiwic2NfMSIsInNjXzIiLCJlbmRzV2l0aCIsImlzX3dpZGUiLCJzbGljZSIsImlzRmlsdGVyVmFsdWVFbXB0eSIsIk51bWJlciIsImlzTmFOIiwiZ2V0RmllbGREYXRhVHlwZSIsIm9iamVjdEZpZWxkcyIsInJlc3VsdCIsImRhdGFfdHlwZSIsImlzU2VydmVyIiwiZ2V0QWxsUmVsYXRlZE9iamVjdHMiLCJyZWxhdGVkX2ZpZWxkIiwicmVsYXRlZF9maWVsZF9uYW1lIiwiZW5hYmxlX2ZpbGVzIiwiYXBwc0J5TmFtZSIsIm1ldGhvZHMiLCJzcGFjZV9pZCIsImNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZCIsImN1cnJlbnRfcmVjZW50X3ZpZXdlZCIsImRvYyIsInNwYWNlIiwidXBkYXRlIiwiJGluYyIsImNvdW50IiwiJHNldCIsIm1vZGlmaWVkIiwiRGF0ZSIsIm1vZGlmaWVkX2J5IiwiaW5zZXJ0IiwiX21ha2VOZXdJRCIsIm8iLCJpZHMiLCJjcmVhdGVkIiwiY3JlYXRlZF9ieSIsImFzeW5jX3JlY2VudF9hZ2dyZWdhdGUiLCJyZWNlbnRfYWdncmVnYXRlIiwic2VhcmNoX29iamVjdCIsIl9yZWNvcmRzIiwiY2FsbGJhY2siLCJDb2xsZWN0aW9ucyIsIm9iamVjdF9yZWNlbnRfdmlld2VkIiwicmF3Q29sbGVjdGlvbiIsImFnZ3JlZ2F0ZSIsIiRtYXRjaCIsIiRncm91cCIsIm1heENyZWF0ZWQiLCIkbWF4IiwiJHNvcnQiLCIkbGltaXQiLCJ0b0FycmF5IiwiZXJyIiwiZGF0YSIsIkVycm9yIiwiaXNGdW5jdGlvbiIsIndyYXBBc3luYyIsInNlYXJjaFRleHQiLCJfb2JqZWN0X2NvbGxlY3Rpb24iLCJfb2JqZWN0X25hbWVfa2V5IiwicXVlcnkiLCJxdWVyeV9hbmQiLCJyZWNvcmRzIiwic2VhcmNoX0tleXdvcmRzIiwic3BsaXQiLCJrZXl3b3JkIiwic3VicXVlcnkiLCIkcmVnZXgiLCJ0cmltIiwiJGFuZCIsIiRpbiIsImxpbWl0IiwiX25hbWUiLCJfb2JqZWN0X25hbWUiLCJyZWNvcmRfb2JqZWN0IiwicmVjb3JkX29iamVjdF9jb2xsZWN0aW9uIiwic2VsZiIsIm9iamVjdHNCeU5hbWUiLCJvYmplY3RfcmVjb3JkIiwiZW5hYmxlX3NlYXJjaCIsInVwZGF0ZV9maWx0ZXJzIiwibGlzdHZpZXdfaWQiLCJmaWx0ZXJfc2NvcGUiLCJvYmplY3RfbGlzdHZpZXdzIiwiZGlyZWN0IiwidXBkYXRlX2NvbHVtbnMiLCJjb2x1bW5zIiwiY2hlY2siLCJjb21wb3VuZEZpZWxkcyIsImN1cnNvciIsImZpbHRlckZpZWxkcyIsImNoaWxkS2V5Iiwib2JqZWN0RmllbGQiLCJzcGxpdHMiLCJpc0NvbW1vblNwYWNlIiwiaXNTcGFjZUFkbWluIiwic2tpcCIsImZldGNoIiwiY29tcG91bmRGaWVsZEl0ZW0iLCJjb21wb3VuZEZpbHRlckZpZWxkcyIsIml0ZW1LZXkiLCJpdGVtVmFsdWUiLCJyZWZlcmVuY2VJdGVtIiwic2V0dGluZyIsImNvbHVtbl93aWR0aCIsIm9iajEiLCJfaWRfYWN0aW9ucyIsIl9taXhGaWVsZHNEYXRhIiwiX21peFJlbGF0ZWREYXRhIiwiX3dyaXRlWG1sRmlsZSIsImZzIiwibG9nZ2VyIiwicGF0aCIsInhtbDJqcyIsIkxvZ2dlciIsImpzb25PYmoiLCJvYmpOYW1lIiwiYnVpbGRlciIsImRheSIsImZpbGVBZGRyZXNzIiwiZmlsZU5hbWUiLCJmaWxlUGF0aCIsIm1vbnRoIiwibm93Iiwic3RyZWFtIiwieG1sIiwieWVhciIsIkJ1aWxkZXIiLCJidWlsZE9iamVjdCIsIkJ1ZmZlciIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiam9pbiIsIl9fbWV0ZW9yX2Jvb3RzdHJhcF9fIiwic2VydmVyRGlyIiwiZXhpc3RzU3luYyIsInN5bmMiLCJ3cml0ZUZpbGUiLCJtaXhCb29sIiwibWl4RGF0ZSIsIm1peERlZmF1bHQiLCJvYmpGaWVsZHMiLCJmaWVsZF9uYW1lIiwiZGF0ZSIsImRhdGVTdHIiLCJmb3JtYXQiLCJtb21lbnQiLCJyZWxhdGVkT2JqTmFtZXMiLCJyZWxhdGVkT2JqTmFtZSIsInJlbGF0ZWRDb2xsZWN0aW9uIiwicmVsYXRlZFJlY29yZExpc3QiLCJyZWxhdGVkVGFibGVEYXRhIiwicmVsYXRlZE9iaiIsImZpZWxkc0RhdGEiLCJFeHBvcnQyeG1sIiwicmVjb3JkTGlzdCIsImluZm8iLCJ0aW1lIiwicmVjb3JkT2JqIiwidGltZUVuZCIsInJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzIiwicmVsYXRlZF9yZWNvcmRzIiwidmlld0FsbFJlY29yZHMiLCJnZXRQZW5kaW5nU3BhY2VJbmZvIiwiaW52aXRlcklkIiwiaW52aXRlck5hbWUiLCJzcGFjZU5hbWUiLCJkYiIsInVzZXJzIiwic3BhY2VzIiwiaW52aXRlciIsInJlZnVzZUpvaW5TcGFjZSIsInNwYWNlX3VzZXJzIiwiaW52aXRlX3N0YXRlIiwiYWNjZXB0Sm9pblNwYWNlIiwidXNlcl9hY2NlcHRlZCIsInB1Ymxpc2giLCJpZCIsInB1Ymxpc2hDb21wb3NpdGUiLCJ0YWJsZU5hbWUiLCJfZmllbGRzIiwib2JqZWN0X2NvbGxlY2l0b24iLCJyZWZlcmVuY2VfZmllbGRzIiwicmVhZHkiLCJTdHJpbmciLCJNYXRjaCIsIk9wdGlvbmFsIiwiZ2V0T2JqZWN0TmFtZSIsInVuYmxvY2siLCJmaWVsZF9rZXlzIiwiY2hpbGRyZW4iLCJfb2JqZWN0S2V5cyIsInJlZmVyZW5jZV9maWVsZCIsInBhcmVudCIsImNoaWxkcmVuX2ZpZWxkcyIsInBfayIsInJlZmVyZW5jZV9pZHMiLCJyZWZlcmVuY2VfdG9fb2JqZWN0Iiwic19rIiwiZ2V0UHJvcGVydHkiLCJyZWR1Y2UiLCJpc09iamVjdCIsInNoYXJlZCIsInVzZXIiLCJzcGFjZV9zZXR0aW5ncyIsInBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsIiwiZ2V0Rmxvd1Blcm1pc3Npb25zIiwiZmxvd19pZCIsInVzZXJfaWQiLCJmbG93IiwibXlfcGVybWlzc2lvbnMiLCJvcmdfaWRzIiwib3JnYW5pemF0aW9ucyIsIm9yZ3NfY2FuX2FkZCIsIm9yZ3NfY2FuX2FkbWluIiwib3Jnc19jYW5fbW9uaXRvciIsInVzZXJzX2Nhbl9hZGQiLCJ1c2Vyc19jYW5fYWRtaW4iLCJ1c2Vyc19jYW5fbW9uaXRvciIsInV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwiLCJnZXRGbG93IiwicGFyZW50cyIsIm9yZyIsInBhcmVudF9pZCIsInBlcm1zIiwib3JnX2lkIiwiX2V2YWwiLCJjaGVja19hdXRob3JpemF0aW9uIiwicmVxIiwiYXV0aFRva2VuIiwiaGFzaGVkVG9rZW4iLCJBY2NvdW50cyIsIl9oYXNoTG9naW5Ub2tlbiIsImdldFNwYWNlIiwiZmxvd3MiLCJnZXRTcGFjZVVzZXIiLCJzcGFjZV91c2VyIiwiZ2V0U3BhY2VVc2VyT3JnSW5mbyIsIm9yZ2FuaXphdGlvbiIsImZ1bGxuYW1lIiwib3JnYW5pemF0aW9uX25hbWUiLCJvcmdhbml6YXRpb25fZnVsbG5hbWUiLCJpc0Zsb3dFbmFibGVkIiwic3RhdGUiLCJpc0Zsb3dTcGFjZU1hdGNoZWQiLCJnZXRGb3JtIiwiZm9ybV9pZCIsImZvcm0iLCJmb3JtcyIsImdldENhdGVnb3J5IiwiY2F0ZWdvcnlfaWQiLCJjYXRlZ29yaWVzIiwiY3JlYXRlX2luc3RhbmNlIiwiaW5zdGFuY2VfZnJvbV9jbGllbnQiLCJ1c2VyX2luZm8iLCJhcHByX29iaiIsImFwcHJvdmVfZnJvbV9jbGllbnQiLCJjYXRlZ29yeSIsImluc19vYmoiLCJuZXdfaW5zX2lkIiwicmVsYXRlZFRhYmxlc0luZm8iLCJzcGFjZV91c2VyX29yZ19pbmZvIiwic3RhcnRfc3RlcCIsInRyYWNlX2Zyb21fY2xpZW50IiwidHJhY2Vfb2JqIiwiY2hlY2tJc0luQXBwcm92YWwiLCJwZXJtaXNzaW9uTWFuYWdlciIsImluc3RhbmNlcyIsImZsb3dfdmVyc2lvbiIsImN1cnJlbnQiLCJmb3JtX3ZlcnNpb24iLCJzdWJtaXR0ZXIiLCJzdWJtaXR0ZXJfbmFtZSIsImFwcGxpY2FudCIsImFwcGxpY2FudF9uYW1lIiwiYXBwbGljYW50X29yZ2FuaXphdGlvbiIsImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSIsImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWUiLCJhcHBsaWNhbnRfY29tcGFueSIsImNvbXBhbnlfaWQiLCJjb2RlIiwiaXNfYXJjaGl2ZWQiLCJpc19kZWxldGVkIiwicmVjb3JkX2lkcyIsIk1vbmdvIiwiT2JqZWN0SUQiLCJfc3RyIiwiaXNfZmluaXNoZWQiLCJzdGVwcyIsInN0ZXAiLCJzdGVwX3R5cGUiLCJzdGFydF9kYXRlIiwidHJhY2UiLCJ1c2VyX25hbWUiLCJoYW5kbGVyIiwiaGFuZGxlcl9uYW1lIiwiaGFuZGxlcl9vcmdhbml6YXRpb24iLCJoYW5kbGVyX29yZ2FuaXphdGlvbl9uYW1lIiwiaGFuZGxlcl9vcmdhbml6YXRpb25fZnVsbG5hbWUiLCJyZWFkX2RhdGUiLCJpc19yZWFkIiwiaXNfZXJyb3IiLCJkZXNjcmlwdGlvbiIsImluaXRpYXRlVmFsdWVzIiwiYXBwcm92ZXMiLCJ0cmFjZXMiLCJpbmJveF91c2VycyIsImN1cnJlbnRfc3RlcF9uYW1lIiwiYXV0b19yZW1pbmQiLCJmbG93X25hbWUiLCJjYXRlZ29yeV9uYW1lIiwiaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8iLCJpbml0aWF0ZVJlbGF0ZWRSZWNvcmRJbnN0YW5jZUluZm8iLCJpbml0aWF0ZUF0dGFjaCIsInJlY29yZElkcyIsImZsb3dJZCIsImZpZWxkQ29kZXMiLCJmaWx0ZXJWYWx1ZXMiLCJmb3JtRmllbGRzIiwiZm9ybVRhYmxlRmllbGRzIiwiZm9ybVRhYmxlRmllbGRzQ29kZSIsImdldEZpZWxkT2RhdGFWYWx1ZSIsImdldEZvcm1GaWVsZCIsImdldEZvcm1UYWJsZUZpZWxkIiwiZ2V0Rm9ybVRhYmxlRmllbGRDb2RlIiwiZ2V0Rm9ybVRhYmxlU3ViRmllbGQiLCJnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlIiwiZ2V0U2VsZWN0T3JnVmFsdWUiLCJnZXRTZWxlY3RPcmdWYWx1ZXMiLCJnZXRTZWxlY3RVc2VyVmFsdWUiLCJnZXRTZWxlY3RVc2VyVmFsdWVzIiwib2JqZWN0TmFtZSIsIm93IiwicmVjb3JkSWQiLCJyZWxhdGVkT2JqZWN0c0tleXMiLCJ0YWJsZUZpZWxkQ29kZXMiLCJ0YWJsZUZpZWxkTWFwIiwidGFibGVUb1JlbGF0ZWRNYXAiLCJmZiIsIm9iamVjdF93b3JrZmxvd3MiLCJmb3JtRmllbGQiLCJyZWxhdGVkT2JqZWN0c0tleSIsInN0YXJ0c1dpdGgiLCJmb3JtVGFibGVGaWVsZENvZGUiLCJ0YWJsZUZpZWxkIiwic3ViRmllbGRDb2RlIiwiX3JlY29yZCIsInN1IiwidXNlcklkcyIsInN1cyIsIm9yZ0lkIiwib3JnSWRzIiwib3JncyIsImZpZWxkX21hcCIsImZtIiwiZmllbGRzT2JqIiwibG9va3VwRmllbGROYW1lIiwibG9va3VwRmllbGRPYmoiLCJsb29rdXBPYmplY3RSZWNvcmQiLCJvVGFibGVDb2RlIiwib1RhYmxlRmllbGRDb2RlIiwib2JqRmllbGQiLCJvYmplY3RGaWVsZE5hbWUiLCJvYmplY3RGaWVsZE9iamVjdE5hbWUiLCJvYmplY3RMb29rdXBGaWVsZCIsIm9iamVjdF9maWVsZCIsIm9kYXRhRmllbGRWYWx1ZSIsInJlZmVyZW5jZVRvRmllbGRWYWx1ZSIsInJlZmVyZW5jZVRvT2JqZWN0TmFtZSIsInJlbGF0ZWRPYmplY3RGaWVsZENvZGUiLCJzZWxlY3RGaWVsZFZhbHVlIiwidGFibGVUb1JlbGF0ZWRNYXBLZXkiLCJ3VGFibGVDb2RlIiwid29ya2Zsb3dfZmllbGQiLCJoYXNPd25Qcm9wZXJ0eSIsIndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGUiLCJvYmplY3RfdGFibGVfZmllbGRfY29kZSIsIm11bHRpcGxlIiwiaXNfbXVsdGlzZWxlY3QiLCJ0ZmMiLCJjIiwicGFyc2UiLCJ0ciIsIm5ld1RyIiwidGZtIiwid1RkQ29kZSIsImZvcm1UYWJsZUZpZWxkIiwicmVsYXRlZEZpZWxkIiwicmVsYXRlZEZpZWxkTmFtZSIsInJlbGF0ZWRPYmplY3ROYW1lIiwicmVsYXRlZFJlY29yZHMiLCJyZWxhdGVkVGFibGVJdGVtcyIsInRhYmxlQ29kZSIsInRhYmxlVmFsdWVzIiwiX0ZST01fVEFCTEVfQ09ERSIsIndhcm4iLCJyciIsInRhYmxlVmFsdWVJdGVtIiwidmFsdWVLZXkiLCJmaWVsZEtleSIsImZvcm1GaWVsZEtleSIsInJlbGF0ZWRPYmplY3RGaWVsZCIsInRhYmxlRmllbGRWYWx1ZSIsIl90YWJsZSIsIl9jb2RlIiwiZmllbGRfbWFwX3NjcmlwdCIsImV4dGVuZCIsImV2YWxGaWVsZE1hcFNjcmlwdCIsIm9iamVjdElkIiwiZnVuYyIsInNjcmlwdCIsImluc0lkIiwiYXBwcm92ZUlkIiwiY2YiLCJ2ZXJzaW9ucyIsInZlcnNpb25JZCIsImlkeCIsIm5ld0ZpbGUiLCJGUyIsIkZpbGUiLCJhdHRhY2hEYXRhIiwiY3JlYXRlUmVhZFN0cmVhbSIsIm9yaWdpbmFsIiwibWV0YWRhdGEiLCJyZWFzb24iLCJzaXplIiwib3duZXJfbmFtZSIsImFwcHJvdmUiLCIkcHVzaCIsIiRlYWNoIiwiJHBvc2l0aW9uIiwibG9ja2VkIiwiaW5zdGFuY2Vfc3RhdGUiLCJ0YWJsZUl0ZW1zIiwiJGV4aXN0cyIsImdldFF1ZXJ5U3RyaW5nIiwiSnNvblJvdXRlcyIsImFkZCIsInJlcyIsIm5leHQiLCJwYXJzZUZpbGVzIiwiZmlsZUNvbGxlY3Rpb24iLCJmaWxlcyIsIm1pbWVUeXBlIiwiYm9keSIsImV4dGVudGlvbiIsImZpbGVPYmoiLCJmaWxlbmFtZSIsIm5ld0ZpbGVPYmpJZCIsInJlc3AiLCJ0b0xvd2VyQ2FzZSIsImRlY29kZVVSSUNvbXBvbmVudCIsInZlcnNpb25faWQiLCJzZXRIZWFkZXIiLCJlbmQiLCJzdGF0dXNDb2RlIiwiY29sbGVjdGlvbk5hbWUiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwicGFyYW1zIiwicmVzdWx0RGF0YSIsInNlbmRSZXN1bHQiLCJzdGFjayIsImVycm9ycyIsIm1lc3NhZ2UiLCJhY2Nlc3NLZXlJZCIsInNlY3JldEFjY2Vzc0tleSIsIm1ldGhvZCIsIkFMWSIsImNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyIsInF1ZXJ5S2V5cyIsInF1ZXJ5U3RyIiwic3RyaW5nVG9TaWduIiwidXRpbCIsIkZvcm1hdCIsIlZlcnNpb24iLCJBY2Nlc3NLZXlJZCIsIlNpZ25hdHVyZU1ldGhvZCIsIlRpbWVzdGFtcCIsImlzbzg2MDEiLCJTaWduYXR1cmVWZXJzaW9uIiwiU2lnbmF0dXJlTm9uY2UiLCJnZXRUaW1lIiwicG9wRXNjYXBlIiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJTaWduYXR1cmUiLCJjcnlwdG8iLCJobWFjIiwicXVlcnlQYXJhbXNUb1N0cmluZyIsIm9zcyIsInIiLCJyZWYzIiwidXBsb2FkQWRkcmVzcyIsInVwbG9hZEF1dGgiLCJ2aWRlb0lkIiwiQWN0aW9uIiwiVGl0bGUiLCJGaWxlTmFtZSIsIkhUVFAiLCJjYWxsIiwiVmlkZW9JZCIsIlVwbG9hZEFkZHJlc3MiLCJ0b1N0cmluZyIsIlVwbG9hZEF1dGgiLCJPU1MiLCJBY2Nlc3NLZXlTZWNyZXQiLCJFbmRwb2ludCIsIlNlY3VyaXR5VG9rZW4iLCJwdXRPYmplY3QiLCJCdWNrZXQiLCJLZXkiLCJCb2R5IiwiQWNjZXNzQ29udHJvbEFsbG93T3JpZ2luIiwiQ29udGVudFR5cGUiLCJDYWNoZUNvbnRyb2wiLCJDb250ZW50RGlzcG9zaXRpb24iLCJDb250ZW50RW5jb2RpbmciLCJTZXJ2ZXJTaWRlRW5jcnlwdGlvbiIsIkV4cGlyZXMiLCJiaW5kRW52aXJvbm1lbnQiLCJnZXRQbGF5SW5mb1F1ZXJ5IiwiZ2V0UGxheUluZm9SZXN1bHQiLCJnZXRQbGF5SW5mb1VybCIsIm5ld0RhdGUiLCJjdXJyZW50X3VzZXJfaWQiLCJjdXJyZW50X3VzZXJfaW5mbyIsImhhc2hEYXRhIiwiaW5zZXJ0ZWRfaW5zdGFuY2VzIiwibmV3X2lucyIsImluc2VydHMiLCJlcnJvck1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBR3JCSCxnQkFBZ0IsQ0FBQztBQUNoQkksUUFBTSxFQUFFLFNBRFE7QUFFaEJDLFFBQU0sRUFBRSxRQUZRO0FBR2hCLFlBQVUsU0FITTtBQUloQixlQUFhO0FBSkcsQ0FBRCxFQUtiLGlCQUxhLENBQWhCOztBQU9BLElBQUlDLE1BQU0sQ0FBQ0MsUUFBUCxJQUFtQkQsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxHQUFuQyxJQUEwQ0YsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxHQUFoQixDQUFvQkMsTUFBbEUsRUFBMEU7QUFDekVULGtCQUFnQixDQUFDO0FBQ2hCLGtCQUFjO0FBREUsR0FBRCxFQUViLGlCQUZhLENBQWhCO0FBR0EsQzs7Ozs7Ozs7Ozs7O0FDQ0RVLFFBQVFDLFNBQVIsR0FBb0IsVUFBQ0MsV0FBRDtBQUNuQixNQUFBQyxHQUFBO0FBQUEsVUFBQUEsTUFBQUgsUUFBQUksU0FBQSxDQUFBRixXQUFBLGFBQUFDLElBQXVDRSxNQUF2QyxHQUF1QyxNQUF2QztBQURtQixDQUFwQjs7QUFHQUwsUUFBUU0sc0JBQVIsR0FBaUMsVUFBQ0osV0FBRDtBQUNoQyxNQUFHTixPQUFPVyxRQUFWO0FBQ0MsV0FBT0MsYUFBYUMsdUJBQWIsQ0FBcUNELGFBQWFFLEtBQWIsQ0FBbUJDLFFBQW5CLEVBQXJDLEVBQW9FLFlBQXBFLEVBQWtGVCxXQUFsRixDQUFQO0FDWkM7QURVOEIsQ0FBakM7O0FBSUFGLFFBQVFZLFlBQVIsR0FBdUIsVUFBQ1YsV0FBRCxFQUFjVyxTQUFkLEVBQXlCQyxNQUF6QjtBQUN0QixNQUFBQyxTQUFBLEVBQUFDLFlBQUE7O0FBQUEsTUFBRyxDQUFDRixNQUFKO0FBQ0NBLGFBQVNHLFFBQVFDLEdBQVIsQ0FBWSxRQUFaLENBQVQ7QUNUQzs7QURVRixNQUFHLENBQUNoQixXQUFKO0FBQ0NBLGtCQUFjZSxRQUFRQyxHQUFSLENBQVksYUFBWixDQUFkO0FDUkM7O0FEVUZILGNBQVlmLFFBQVFtQixXQUFSLENBQW9CakIsV0FBcEIsRUFBaUMsSUFBakMsQ0FBWjtBQUNBYyxpQkFBQUQsYUFBQSxPQUFlQSxVQUFXSyxHQUExQixHQUEwQixNQUExQjs7QUFFQSxNQUFHUCxTQUFIO0FBQ0MsV0FBT2IsUUFBUXFCLGNBQVIsQ0FBdUIsVUFBVVAsTUFBVixHQUFtQixHQUFuQixHQUF5QlosV0FBekIsR0FBdUMsUUFBdkMsR0FBa0RXLFNBQXpFLENBQVA7QUFERDtBQUdDLFFBQUdYLGdCQUFlLFNBQWxCO0FBQ0MsYUFBT0YsUUFBUXFCLGNBQVIsQ0FBdUIsVUFBVVAsTUFBVixHQUFtQixHQUFuQixHQUF5QlosV0FBekIsR0FBdUMsWUFBOUQsQ0FBUDtBQUREO0FBR0MsVUFBR0YsUUFBUU0sc0JBQVIsQ0FBK0JKLFdBQS9CLENBQUg7QUFDQyxlQUFPRixRQUFRcUIsY0FBUixDQUF1QixVQUFVUCxNQUFWLEdBQW1CLEdBQW5CLEdBQXlCWixXQUFoRCxDQUFQO0FBREQ7QUFHQyxlQUFPRixRQUFRcUIsY0FBUixDQUF1QixVQUFVUCxNQUFWLEdBQW1CLEdBQW5CLEdBQXlCWixXQUF6QixHQUF1QyxRQUF2QyxHQUFrRGMsWUFBekUsQ0FBUDtBQU5GO0FBSEQ7QUNFRTtBRFhvQixDQUF2Qjs7QUFvQkFoQixRQUFRc0Isb0JBQVIsR0FBK0IsVUFBQ3BCLFdBQUQsRUFBY1csU0FBZCxFQUF5QkMsTUFBekI7QUFDOUIsTUFBQUMsU0FBQSxFQUFBQyxZQUFBOztBQUFBLE1BQUcsQ0FBQ0YsTUFBSjtBQUNDQSxhQUFTRyxRQUFRQyxHQUFSLENBQVksUUFBWixDQUFUO0FDSkM7O0FES0YsTUFBRyxDQUFDaEIsV0FBSjtBQUNDQSxrQkFBY2UsUUFBUUMsR0FBUixDQUFZLGFBQVosQ0FBZDtBQ0hDOztBREtGSCxjQUFZZixRQUFRbUIsV0FBUixDQUFvQmpCLFdBQXBCLEVBQWlDLElBQWpDLENBQVo7QUFDQWMsaUJBQUFELGFBQUEsT0FBZUEsVUFBV0ssR0FBMUIsR0FBMEIsTUFBMUI7O0FBRUEsTUFBR1AsU0FBSDtBQUNDLFdBQU9VLFFBQVFDLFdBQVIsQ0FBb0IsVUFBVVYsTUFBVixHQUFtQixHQUFuQixHQUF5QlosV0FBekIsR0FBdUMsUUFBdkMsR0FBa0RXLFNBQXRFLEVBQWlGLElBQWpGLENBQVA7QUFERDtBQUdDLFFBQUdYLGdCQUFlLFNBQWxCO0FBQ0MsYUFBT3FCLFFBQVFDLFdBQVIsQ0FBb0IsVUFBVVYsTUFBVixHQUFtQixHQUFuQixHQUF5QlosV0FBekIsR0FBdUMsWUFBM0QsRUFBeUUsSUFBekUsQ0FBUDtBQUREO0FBR0MsYUFBT3FCLFFBQVFDLFdBQVIsQ0FBb0IsVUFBVVYsTUFBVixHQUFtQixHQUFuQixHQUF5QlosV0FBekIsR0FBdUMsUUFBdkMsR0FBa0RjLFlBQXRFLEVBQW9GLElBQXBGLENBQVA7QUFORjtBQ0dFO0FEWjRCLENBQS9COztBQWlCQWhCLFFBQVF5QixrQkFBUixHQUE2QixVQUFDdkIsV0FBRCxFQUFjVyxTQUFkLEVBQXlCQyxNQUF6QjtBQUM1QixNQUFBQyxTQUFBLEVBQUFDLFlBQUE7O0FBQUEsTUFBRyxDQUFDRixNQUFKO0FBQ0NBLGFBQVNHLFFBQVFDLEdBQVIsQ0FBWSxRQUFaLENBQVQ7QUNBQzs7QURDRixNQUFHLENBQUNoQixXQUFKO0FBQ0NBLGtCQUFjZSxRQUFRQyxHQUFSLENBQVksYUFBWixDQUFkO0FDQ0M7O0FEQ0ZILGNBQVlmLFFBQVFtQixXQUFSLENBQW9CakIsV0FBcEIsRUFBaUMsSUFBakMsQ0FBWjtBQUNBYyxpQkFBQUQsYUFBQSxPQUFlQSxVQUFXSyxHQUExQixHQUEwQixNQUExQjs7QUFFQSxNQUFHUCxTQUFIO0FBQ0MsV0FBTyxVQUFVQyxNQUFWLEdBQW1CLEdBQW5CLEdBQXlCWixXQUF6QixHQUF1QyxRQUF2QyxHQUFrRFcsU0FBekQ7QUFERDtBQUdDLFFBQUdYLGdCQUFlLFNBQWxCO0FBQ0MsYUFBTyxVQUFVWSxNQUFWLEdBQW1CLEdBQW5CLEdBQXlCWixXQUF6QixHQUF1QyxZQUE5QztBQUREO0FBR0MsYUFBTyxVQUFVWSxNQUFWLEdBQW1CLEdBQW5CLEdBQXlCWixXQUF6QixHQUF1QyxRQUF2QyxHQUFrRGMsWUFBekQ7QUFORjtBQ09FO0FEaEIwQixDQUE3Qjs7QUFpQkFoQixRQUFRMEIsY0FBUixHQUF5QixVQUFDeEIsV0FBRCxFQUFjWSxNQUFkLEVBQXNCRSxZQUF0QjtBQUN4QixNQUFBVyxHQUFBO0FBQUFBLFFBQU0zQixRQUFRNEIsc0JBQVIsQ0FBK0IxQixXQUEvQixFQUE0Q1ksTUFBNUMsRUFBb0RFLFlBQXBELENBQU47QUFDQSxTQUFPaEIsUUFBUXFCLGNBQVIsQ0FBdUJNLEdBQXZCLENBQVA7QUFGd0IsQ0FBekI7O0FBSUEzQixRQUFRNEIsc0JBQVIsR0FBaUMsVUFBQzFCLFdBQUQsRUFBY1ksTUFBZCxFQUFzQkUsWUFBdEI7QUFDaEMsTUFBR0EsaUJBQWdCLFVBQW5CO0FBQ0MsV0FBTyxVQUFVRixNQUFWLEdBQW1CLEdBQW5CLEdBQXlCWixXQUF6QixHQUF1QyxZQUE5QztBQUREO0FBR0MsV0FBTyxVQUFVWSxNQUFWLEdBQW1CLEdBQW5CLEdBQXlCWixXQUF6QixHQUF1QyxRQUF2QyxHQUFrRGMsWUFBekQ7QUNLQztBRFQ4QixDQUFqQzs7QUFNQWhCLFFBQVE2QixnQkFBUixHQUEyQixVQUFDM0IsV0FBRCxFQUFjWSxNQUFkLEVBQXNCRSxZQUF0QjtBQUMxQixNQUFHQSxZQUFIO0FBQ0MsV0FBT2hCLFFBQVFxQixjQUFSLENBQXVCLFVBQVVQLE1BQVYsR0FBbUIsR0FBbkIsR0FBeUJaLFdBQXpCLEdBQXVDLEdBQXZDLEdBQTZDYyxZQUE3QyxHQUE0RCxPQUFuRixDQUFQO0FBREQ7QUFHQyxXQUFPaEIsUUFBUXFCLGNBQVIsQ0FBdUIsVUFBVVAsTUFBVixHQUFtQixHQUFuQixHQUF5QlosV0FBekIsR0FBdUMsY0FBOUQsQ0FBUDtBQ09DO0FEWHdCLENBQTNCOztBQU1BRixRQUFROEIsbUJBQVIsR0FBOEIsVUFBQzVCLFdBQUQsRUFBY1ksTUFBZCxFQUFzQkQsU0FBdEIsRUFBaUNrQixtQkFBakM7QUFDN0IsU0FBTy9CLFFBQVFxQixjQUFSLENBQXVCLFVBQVVQLE1BQVYsR0FBbUIsR0FBbkIsR0FBeUJaLFdBQXpCLEdBQXVDLEdBQXZDLEdBQTZDVyxTQUE3QyxHQUF5RCxHQUF6RCxHQUErRGtCLG1CQUEvRCxHQUFxRixPQUE1RyxDQUFQO0FBRDZCLENBQTlCOztBQUdBL0IsUUFBUWdDLDJCQUFSLEdBQXNDLFVBQUM5QixXQUFELEVBQWMrQixPQUFkLEVBQXVCQyxZQUF2QixFQUFxQ0MsVUFBckM7QUFDckMsTUFBQUMsT0FBQSxFQUFBQyxRQUFBLEVBQUFDLE1BQUEsRUFBQUMsSUFBQSxFQUFBQyxjQUFBOztBQUFBSCxhQUFXLEVBQVg7O0FBQ0EsT0FBT25DLFdBQVA7QUFDQyxXQUFPbUMsUUFBUDtBQ1dDOztBRFZGRCxZQUFVcEMsUUFBUUksU0FBUixDQUFrQkYsV0FBbEIsQ0FBVjtBQUNBb0MsV0FBQUYsV0FBQSxPQUFTQSxRQUFTRSxNQUFsQixHQUFrQixNQUFsQjtBQUNBQyxTQUFBSCxXQUFBLE9BQU9BLFFBQVNHLElBQWhCLEdBQWdCLE1BQWhCOztBQUNBRSxJQUFFQyxPQUFGLENBQVVKLE1BQVYsRUFBa0IsVUFBQ0ssQ0FBRCxFQUFJQyxDQUFKO0FBQ2pCLFFBQUdWLGdCQUFpQlMsRUFBRUUsTUFBdEI7QUFDQztBQ1lFOztBRFhILFFBQUdGLEVBQUVHLElBQUYsS0FBVSxRQUFiO0FDYUksYURaSFQsU0FBU1UsSUFBVCxDQUFjO0FBQUNDLGVBQU8sTUFBR0wsRUFBRUssS0FBRixJQUFXSixDQUFkLENBQVI7QUFBMkJLLGVBQU8sS0FBR0wsQ0FBckM7QUFBMENMLGNBQU1BO0FBQWhELE9BQWQsQ0NZRztBRGJKO0FDbUJJLGFEaEJIRixTQUFTVSxJQUFULENBQWM7QUFBQ0MsZUFBT0wsRUFBRUssS0FBRixJQUFXSixDQUFuQjtBQUFzQkssZUFBT0wsQ0FBN0I7QUFBZ0NMLGNBQU1BO0FBQXRDLE9BQWQsQ0NnQkc7QUFLRDtBRDNCSjs7QUFPQSxNQUFHTixPQUFIO0FBQ0NRLE1BQUVDLE9BQUYsQ0FBVUosTUFBVixFQUFrQixVQUFDSyxDQUFELEVBQUlDLENBQUo7QUFDakIsVUFBQU0sUUFBQTs7QUFBQSxVQUFHaEIsZ0JBQWlCUyxFQUFFRSxNQUF0QjtBQUNDO0FDd0JHOztBRHZCSixVQUFHLENBQUNGLEVBQUVHLElBQUYsS0FBVSxRQUFWLElBQXNCSCxFQUFFRyxJQUFGLEtBQVUsZUFBakMsS0FBcURILEVBQUVRLFlBQXZELElBQXVFVixFQUFFVyxRQUFGLENBQVdULEVBQUVRLFlBQWIsQ0FBMUU7QUFFQ0QsbUJBQVdsRCxRQUFRSSxTQUFSLENBQWtCdUMsRUFBRVEsWUFBcEIsQ0FBWDs7QUFDQSxZQUFHRCxRQUFIO0FDd0JNLGlCRHZCTFQsRUFBRUMsT0FBRixDQUFVUSxTQUFTWixNQUFuQixFQUEyQixVQUFDZSxFQUFELEVBQUtDLEVBQUw7QUN3QnBCLG1CRHZCTmpCLFNBQVNVLElBQVQsQ0FBYztBQUFDQyxxQkFBUyxDQUFDTCxFQUFFSyxLQUFGLElBQVdKLENBQVosSUFBYyxJQUFkLElBQWtCUyxHQUFHTCxLQUFILElBQVlNLEVBQTlCLENBQVY7QUFBOENMLHFCQUFVTCxJQUFFLEdBQUYsR0FBS1UsRUFBN0Q7QUFBbUVmLG9CQUFBVyxZQUFBLE9BQU1BLFNBQVVYLElBQWhCLEdBQWdCO0FBQW5GLGFBQWQsQ0N1Qk07QUR4QlAsWUN1Qks7QUQzQlA7QUNtQ0k7QUR0Q0w7QUN3Q0M7O0FEL0JGLE1BQUdKLFVBQUg7QUFDQ0sscUJBQWlCeEMsUUFBUXVELGlCQUFSLENBQTBCckQsV0FBMUIsQ0FBakI7O0FBQ0F1QyxNQUFFZSxJQUFGLENBQU9oQixjQUFQLEVBQXVCLFVBQUFpQixLQUFBO0FDaUNuQixhRGpDbUIsVUFBQ0MsY0FBRDtBQUN0QixZQUFBQyxhQUFBLEVBQUFDLGNBQUE7QUFBQUEseUJBQWlCNUQsUUFBUWdDLDJCQUFSLENBQW9DMEIsZUFBZXhELFdBQW5ELEVBQWdFLEtBQWhFLEVBQXVFLEtBQXZFLEVBQThFLEtBQTlFLENBQWpCO0FBQ0F5RCx3QkFBZ0IzRCxRQUFRSSxTQUFSLENBQWtCc0QsZUFBZXhELFdBQWpDLENBQWhCO0FDbUNLLGVEbENMdUMsRUFBRWUsSUFBRixDQUFPSSxjQUFQLEVBQXVCLFVBQUNDLGFBQUQ7QUFDdEIsY0FBR0gsZUFBZUksV0FBZixLQUE4QkQsY0FBY1osS0FBL0M7QUNtQ1EsbUJEbENQWixTQUFTVSxJQUFULENBQWM7QUFBQ0MscUJBQVMsQ0FBQ1csY0FBY1gsS0FBZCxJQUF1QlcsY0FBY0ksSUFBdEMsSUFBMkMsSUFBM0MsR0FBK0NGLGNBQWNiLEtBQXZFO0FBQWdGQyxxQkFBVVUsY0FBY0ksSUFBZCxHQUFtQixHQUFuQixHQUFzQkYsY0FBY1osS0FBOUg7QUFBdUlWLG9CQUFBb0IsaUJBQUEsT0FBTUEsY0FBZXBCLElBQXJCLEdBQXFCO0FBQTVKLGFBQWQsQ0NrQ087QUFLRDtBRHpDUixVQ2tDSztBRHJDaUIsT0NpQ25CO0FEakNtQixXQUF2QjtBQ2dEQzs7QUQxQ0YsU0FBT0YsUUFBUDtBQWhDcUMsQ0FBdEM7O0FBbUNBckMsUUFBUWdFLDJCQUFSLEdBQXNDLFVBQUM5RCxXQUFEO0FBQ3JDLE1BQUFrQyxPQUFBLEVBQUFDLFFBQUEsRUFBQUMsTUFBQSxFQUFBQyxJQUFBLEVBQUEwQixpQkFBQTs7QUFBQTVCLGFBQVcsRUFBWDs7QUFDQSxPQUFPbkMsV0FBUDtBQUNDLFdBQU9tQyxRQUFQO0FDNkNDOztBRDVDRkQsWUFBVXBDLFFBQVFJLFNBQVIsQ0FBa0JGLFdBQWxCLENBQVY7QUFDQW9DLFdBQUFGLFdBQUEsT0FBU0EsUUFBU0UsTUFBbEIsR0FBa0IsTUFBbEI7QUFDQTJCLHNCQUFvQmpFLFFBQVFrRSxTQUFSLENBQWtCaEUsV0FBbEIsQ0FBcEI7QUFDQXFDLFNBQUFILFdBQUEsT0FBT0EsUUFBU0csSUFBaEIsR0FBZ0IsTUFBaEI7O0FBQ0FFLElBQUVDLE9BQUYsQ0FBVUosTUFBVixFQUFrQixVQUFDSyxDQUFELEVBQUlDLENBQUo7QUFFakIsUUFBRyxDQUFDSCxFQUFFMEIsT0FBRixDQUFVLENBQUMsTUFBRCxFQUFRLFFBQVIsRUFBa0IsVUFBbEIsRUFBOEIsVUFBOUIsRUFBMEMsUUFBMUMsRUFBb0QsUUFBcEQsRUFBOEQsT0FBOUQsRUFBdUUsVUFBdkUsRUFBbUYsTUFBbkYsQ0FBVixFQUFzR3hCLEVBQUVHLElBQXhHLENBQUQsSUFBbUgsQ0FBQ0gsRUFBRUUsTUFBekg7QUFFQyxVQUFHLENBQUMsUUFBUXVCLElBQVIsQ0FBYXhCLENBQWIsQ0FBRCxJQUFxQkgsRUFBRTRCLE9BQUYsQ0FBVUosaUJBQVYsRUFBNkJyQixDQUE3QixJQUFrQyxDQUFDLENBQTNEO0FDNENLLGVEM0NKUCxTQUFTVSxJQUFULENBQWM7QUFBQ0MsaUJBQU9MLEVBQUVLLEtBQUYsSUFBV0osQ0FBbkI7QUFBc0JLLGlCQUFPTCxDQUE3QjtBQUFnQ0wsZ0JBQU1BO0FBQXRDLFNBQWQsQ0MyQ0k7QUQ5Q047QUNvREc7QUR0REo7O0FBT0EsU0FBT0YsUUFBUDtBQWZxQyxDQUF0Qzs7QUFpQkFyQyxRQUFRc0UscUJBQVIsR0FBZ0MsVUFBQ3BFLFdBQUQ7QUFDL0IsTUFBQWtDLE9BQUEsRUFBQUMsUUFBQSxFQUFBQyxNQUFBLEVBQUFDLElBQUEsRUFBQTBCLGlCQUFBOztBQUFBNUIsYUFBVyxFQUFYOztBQUNBLE9BQU9uQyxXQUFQO0FBQ0MsV0FBT21DLFFBQVA7QUNvREM7O0FEbkRGRCxZQUFVcEMsUUFBUUksU0FBUixDQUFrQkYsV0FBbEIsQ0FBVjtBQUNBb0MsV0FBQUYsV0FBQSxPQUFTQSxRQUFTRSxNQUFsQixHQUFrQixNQUFsQjtBQUNBMkIsc0JBQW9CakUsUUFBUWtFLFNBQVIsQ0FBa0JoRSxXQUFsQixDQUFwQjtBQUNBcUMsU0FBQUgsV0FBQSxPQUFPQSxRQUFTRyxJQUFoQixHQUFnQixNQUFoQjs7QUFDQUUsSUFBRUMsT0FBRixDQUFVSixNQUFWLEVBQWtCLFVBQUNLLENBQUQsRUFBSUMsQ0FBSjtBQUNqQixRQUFHLENBQUNILEVBQUUwQixPQUFGLENBQVUsQ0FBQyxNQUFELEVBQVEsUUFBUixFQUFrQixVQUFsQixFQUE4QixVQUE5QixFQUEwQyxRQUExQyxFQUFvRCxVQUFwRCxFQUFnRSxNQUFoRSxDQUFWLEVBQW1GeEIsRUFBRUcsSUFBckYsQ0FBSjtBQUNDLFVBQUcsQ0FBQyxRQUFRc0IsSUFBUixDQUFheEIsQ0FBYixDQUFELElBQXFCSCxFQUFFNEIsT0FBRixDQUFVSixpQkFBVixFQUE2QnJCLENBQTdCLElBQWtDLENBQUMsQ0FBM0Q7QUNxREssZURwREpQLFNBQVNVLElBQVQsQ0FBYztBQUFDQyxpQkFBT0wsRUFBRUssS0FBRixJQUFXSixDQUFuQjtBQUFzQkssaUJBQU9MLENBQTdCO0FBQWdDTCxnQkFBTUE7QUFBdEMsU0FBZCxDQ29ESTtBRHRETjtBQzRERztBRDdESjs7QUFJQSxTQUFPRixRQUFQO0FBWitCLENBQWhDLEMsQ0FjQTs7Ozs7Ozs7QUFPQXJDLFFBQVF1RSwwQkFBUixHQUFxQyxVQUFDQyxPQUFELEVBQVVsQyxNQUFWLEVBQWtCbUMsYUFBbEI7QUFDcEMsT0FBT0QsT0FBUDtBQUNDQSxjQUFVLEVBQVY7QUMrREM7O0FEOURGLE9BQU9DLGFBQVA7QUFDQ0Esb0JBQWdCLEVBQWhCO0FDZ0VDOztBRC9ERixNQUFBQSxpQkFBQSxPQUFHQSxjQUFlQyxNQUFsQixHQUFrQixNQUFsQjtBQUNDRCxrQkFBYy9CLE9BQWQsQ0FBc0IsVUFBQ2lDLENBQUQ7QUFDckIsVUFBR2xDLEVBQUVXLFFBQUYsQ0FBV3VCLENBQVgsQ0FBSDtBQUNDQSxZQUNDO0FBQUFDLGlCQUFPRCxDQUFQO0FBQ0FFLG9CQUFVO0FBRFYsU0FERDtBQ29FRzs7QURqRUosVUFBR3ZDLE9BQU9xQyxFQUFFQyxLQUFULEtBQW9CLENBQUNuQyxFQUFFcUMsU0FBRixDQUFZTixPQUFaLEVBQW9CO0FBQUNJLGVBQU1ELEVBQUVDO0FBQVQsT0FBcEIsQ0FBeEI7QUNxRUssZURwRUpKLFFBQVF6QixJQUFSLENBQ0M7QUFBQTZCLGlCQUFPRCxFQUFFQyxLQUFUO0FBQ0FHLHNCQUFZLElBRFo7QUFFQUMsdUJBQWFMLEVBQUVFO0FBRmYsU0FERCxDQ29FSTtBQUtEO0FEL0VMO0FDaUZDOztBRHZFRkwsVUFBUTlCLE9BQVIsQ0FBZ0IsVUFBQ3VDLFVBQUQ7QUFDZixRQUFBQyxVQUFBO0FBQUFBLGlCQUFhVCxjQUFjVSxJQUFkLENBQW1CLFVBQUNSLENBQUQ7QUFBTSxhQUFPQSxNQUFLTSxXQUFXTCxLQUFoQixJQUF5QkQsRUFBRUMsS0FBRixLQUFXSyxXQUFXTCxLQUF0RDtBQUF6QixNQUFiOztBQUNBLFFBQUduQyxFQUFFVyxRQUFGLENBQVc4QixVQUFYLENBQUg7QUFDQ0EsbUJBQ0M7QUFBQU4sZUFBT00sVUFBUDtBQUNBTCxrQkFBVTtBQURWLE9BREQ7QUMrRUU7O0FENUVILFFBQUdLLFVBQUg7QUFDQ0QsaUJBQVdGLFVBQVgsR0FBd0IsSUFBeEI7QUM4RUcsYUQ3RUhFLFdBQVdELFdBQVgsR0FBeUJFLFdBQVdMLFFDNkVqQztBRC9FSjtBQUlDLGFBQU9JLFdBQVdGLFVBQWxCO0FDOEVHLGFEN0VILE9BQU9FLFdBQVdELFdDNkVmO0FBQ0Q7QUR6Rko7QUFZQSxTQUFPUixPQUFQO0FBNUJvQyxDQUFyQzs7QUE4QkF4RSxRQUFRb0YsZUFBUixHQUEwQixVQUFDbEYsV0FBRCxFQUFjVyxTQUFkLEVBQXlCd0UsYUFBekIsRUFBd0NDLE1BQXhDO0FBRXpCLE1BQUFDLFVBQUEsRUFBQUMsTUFBQSxFQUFBckYsR0FBQSxFQUFBc0YsSUFBQSxFQUFBQyxJQUFBOztBQUFBLE1BQUcsQ0FBQ3hGLFdBQUo7QUFDQ0Esa0JBQWNlLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUNpRkM7O0FEL0VGLE1BQUcsQ0FBQ0wsU0FBSjtBQUNDQSxnQkFBWUksUUFBUUMsR0FBUixDQUFZLFdBQVosQ0FBWjtBQ2lGQzs7QURoRkYsTUFBR3RCLE9BQU9XLFFBQVY7QUFDQyxRQUFHTCxnQkFBZWUsUUFBUUMsR0FBUixDQUFZLGFBQVosQ0FBZixJQUE4Q0wsY0FBYUksUUFBUUMsR0FBUixDQUFZLFdBQVosQ0FBOUQ7QUFDQyxXQUFBZixNQUFBd0YsU0FBQUMsUUFBQSxjQUFBekYsSUFBd0JxRixNQUF4QixHQUF3QixNQUF4QjtBQUNDLGdCQUFBQyxPQUFBRSxTQUFBQyxRQUFBLGVBQUFGLE9BQUFELEtBQUFELE1BQUEsWUFBQUUsS0FBb0N4RSxHQUFwQyxLQUFPLE1BQVAsR0FBTyxNQUFQO0FBRkY7QUFBQTtBQUlDLGFBQU9sQixRQUFRNkYsS0FBUixDQUFjM0UsR0FBZCxDQUFrQmhCLFdBQWxCLEVBQStCVyxTQUEvQixFQUEwQ3dFLGFBQTFDLEVBQXlEQyxNQUF6RCxDQUFQO0FBTEY7QUN5RkU7O0FEbEZGQyxlQUFhdkYsUUFBUThGLGFBQVIsQ0FBc0I1RixXQUF0QixDQUFiOztBQUNBLE1BQUdxRixVQUFIO0FBQ0NDLGFBQVNELFdBQVdRLE9BQVgsQ0FBbUJsRixTQUFuQixDQUFUO0FBQ0EsV0FBTzJFLE1BQVA7QUNvRkM7QURyR3VCLENBQTFCOztBQW1CQXhGLFFBQVFnRyxtQkFBUixHQUE4QixVQUFDUixNQUFELEVBQVN0RixXQUFUO0FBQzdCLE1BQUErRixjQUFBLEVBQUE5RixHQUFBOztBQUFBLE9BQU9xRixNQUFQO0FBQ0NBLGFBQVN4RixRQUFRb0YsZUFBUixFQUFUO0FDdUZDOztBRHRGRixNQUFHSSxNQUFIO0FBRUNTLHFCQUFvQi9GLGdCQUFlLGVBQWYsR0FBb0MsTUFBcEMsR0FBSCxDQUFBQyxNQUFBSCxRQUFBSSxTQUFBLENBQUFGLFdBQUEsYUFBQUMsSUFBbUYrRixjQUFuRixHQUFtRixNQUFwRzs7QUFDQSxRQUFHVixVQUFXUyxjQUFkO0FBQ0MsYUFBT1QsT0FBT3hDLEtBQVAsSUFBZ0J3QyxPQUFPUyxjQUFQLENBQXZCO0FBSkY7QUM0RkU7QUQvRjJCLENBQTlCOztBQVNBakcsUUFBUW1HLE1BQVIsR0FBaUIsVUFBQ3JGLE1BQUQ7QUFDaEIsTUFBQXNGLEdBQUEsRUFBQWpHLEdBQUEsRUFBQXNGLElBQUE7O0FBQUEsTUFBRyxDQUFDM0UsTUFBSjtBQUNDQSxhQUFTRyxRQUFRQyxHQUFSLENBQVksUUFBWixDQUFUO0FDMkZDOztBRDFGRmtGLFFBQU1wRyxRQUFRcUcsSUFBUixDQUFhdkYsTUFBYixDQUFOOztBQzRGQyxNQUFJLENBQUNYLE1BQU1ILFFBQVFzRyxJQUFmLEtBQXdCLElBQTVCLEVBQWtDO0FBQ2hDLFFBQUksQ0FBQ2IsT0FBT3RGLElBQUlpRyxHQUFaLEtBQW9CLElBQXhCLEVBQThCO0FBQzVCWCxXRDdGY2MsTUM2RmQ7QUFDRDtBQUNGOztBRDlGRixTQUFPSCxHQUFQO0FBTGdCLENBQWpCOztBQU9BcEcsUUFBUXdHLGVBQVIsR0FBMEIsVUFBQzFGLE1BQUQ7QUFDekIsTUFBQXNGLEdBQUEsRUFBQUssU0FBQTtBQUFBTCxRQUFNcEcsUUFBUW1HLE1BQVIsQ0FBZXJGLE1BQWYsQ0FBTjs7QUFDQSxNQUFHLENBQUNzRixHQUFKO0FBQ0M7QUNrR0M7O0FEakdGSyxjQUFZLElBQVo7O0FBQ0FoRSxJQUFFZSxJQUFGLENBQU94RCxRQUFRMEcsVUFBZixFQUEyQixVQUFDakgsQ0FBRCxFQUFJbUQsQ0FBSjtBQUMxQixRQUFBekMsR0FBQTs7QUFBQSxVQUFBQSxNQUFBVixFQUFBa0gsSUFBQSxZQUFBeEcsSUFBV2tFLE9BQVgsQ0FBbUIrQixJQUFJaEYsR0FBdkIsSUFBRyxNQUFILElBQThCLENBQUMsQ0FBL0I7QUNvR0ksYURuR0hxRixZQUFZaEgsQ0NtR1Q7QUFDRDtBRHRHSjs7QUFHQSxTQUFPZ0gsU0FBUDtBQVJ5QixDQUExQjs7QUFVQXpHLFFBQVE0Ryx3QkFBUixHQUFtQyxVQUFDOUYsTUFBRDtBQUNsQyxNQUFBc0YsR0FBQTtBQUFBQSxRQUFNcEcsUUFBUW1HLE1BQVIsQ0FBZXJGLE1BQWYsQ0FBTjs7QUFDQSxNQUFHLENBQUNzRixHQUFKO0FBQ0M7QUN3R0M7O0FEdkdGLFNBQU81RixhQUFhQyx1QkFBYixDQUFxQ0QsYUFBYUUsS0FBYixDQUFtQkMsUUFBbkIsRUFBckMsRUFBb0UsV0FBcEUsRUFBaUZ5RixJQUFJaEYsR0FBckYsQ0FBUDtBQUprQyxDQUFuQzs7QUFNQXBCLFFBQVE2RyxpQkFBUixHQUE0QixVQUFDL0YsTUFBRDtBQUMzQixNQUFBc0YsR0FBQSxFQUFBVSxVQUFBLEVBQUFDLFFBQUEsRUFBQUMsT0FBQTtBQUFBWixRQUFNcEcsUUFBUW1HLE1BQVIsQ0FBZXJGLE1BQWYsQ0FBTjs7QUFDQSxNQUFHLENBQUNzRixHQUFKO0FBQ0M7QUMyR0M7O0FEMUdGVyxhQUFXeEYsUUFBUXdGLFFBQVIsRUFBWDtBQUNBRCxlQUFnQkMsV0FBY1gsSUFBSWEsY0FBbEIsR0FBc0NiLElBQUlZLE9BQTFEO0FBQ0FBLFlBQVUsRUFBVjs7QUFDQSxNQUFHWixHQUFIO0FBQ0MzRCxNQUFFZSxJQUFGLENBQU9zRCxVQUFQLEVBQW1CLFVBQUNySCxDQUFEO0FBQ2xCLFVBQUF5SCxHQUFBO0FBQUFBLFlBQU1sSCxRQUFRSSxTQUFSLENBQWtCWCxDQUFsQixDQUFOOztBQUNBLFVBQUF5SCxPQUFBLE9BQUdBLElBQUtDLFdBQUwsQ0FBaUJqRyxHQUFqQixHQUF1QmtHLFNBQTFCLEdBQTBCLE1BQTFCO0FDNkdLLGVENUdKSixRQUFRakUsSUFBUixDQUFhdEQsQ0FBYixDQzRHSTtBQUNEO0FEaEhMO0FDa0hDOztBRDlHRixTQUFPdUgsT0FBUDtBQVoyQixDQUE1Qjs7QUFjQWhILFFBQVFxSCxjQUFSLEdBQXlCLFVBQUNDLFlBQUQ7QUFDeEIsTUFBQUMsU0FBQTtBQUFBQSxjQUFZdkgsUUFBUXdILE9BQVIsQ0FBZ0J0RyxHQUFoQixFQUFaO0FBQ0FWLGVBQWFFLEtBQWIsQ0FBbUJDLFFBQW5CLEdBQThCOEcsUUFBOUIsQ0FBdUNkLElBQXZDLEdBQThDZSxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQm5ILGFBQWFFLEtBQWIsQ0FBbUJDLFFBQW5CLEdBQThCOEcsUUFBOUIsQ0FBdUNkLElBQXpELEVBQStEO0FBQUNBLFVBQU1ZO0FBQVAsR0FBL0QsQ0FBOUM7QUFDQSxTQUFPL0csYUFBYW9ILG1CQUFiLENBQWlDcEgsYUFBYUUsS0FBYixDQUFtQkMsUUFBbkIsRUFBakMsRUFBZ0UyRyxZQUFoRSxDQUFQO0FBSHdCLENBQXpCOztBQUtBdEgsUUFBUTZILHFCQUFSLEdBQWdDO0FBQy9CLE1BQUFsQixJQUFBLEVBQUFLLE9BQUEsRUFBQWMsa0JBQUE7QUFBQW5CLFNBQU8zRyxRQUFRcUgsY0FBUixFQUFQO0FBQ0FTLHVCQUFxQnJGLEVBQUVzRixPQUFGLENBQVV0RixFQUFFdUYsS0FBRixDQUFRckIsSUFBUixFQUFhLFNBQWIsQ0FBVixDQUFyQjtBQUNBSyxZQUFVdkUsRUFBRXdGLE1BQUYsQ0FBU2pJLFFBQVFrSSxPQUFqQixFQUEwQixVQUFDaEIsR0FBRDtBQUNuQyxRQUFHWSxtQkFBbUJ6RCxPQUFuQixDQUEyQjZDLElBQUluRCxJQUEvQixJQUF1QyxDQUExQztBQUNDLGFBQU8sS0FBUDtBQUREO0FBR0MsYUFBTyxJQUFQO0FDc0hFO0FEMUhNLElBQVY7QUFLQWlELFlBQVVBLFFBQVFtQixJQUFSLENBQWFuSSxRQUFRb0ksYUFBUixDQUFzQkMsSUFBdEIsQ0FBMkI7QUFBQ0MsU0FBSTtBQUFMLEdBQTNCLENBQWIsQ0FBVjtBQUNBdEIsWUFBVXZFLEVBQUV1RixLQUFGLENBQVFoQixPQUFSLEVBQWdCLE1BQWhCLENBQVY7QUFDQSxTQUFPdkUsRUFBRThGLElBQUYsQ0FBT3ZCLE9BQVAsQ0FBUDtBQVYrQixDQUFoQzs7QUFZQWhILFFBQVF3SSxjQUFSLEdBQXlCO0FBQ3hCLE1BQUF4QixPQUFBLEVBQUF5QixXQUFBO0FBQUF6QixZQUFVLEVBQVY7QUFDQXlCLGdCQUFjLEVBQWQ7O0FBQ0FoRyxJQUFFQyxPQUFGLENBQVUxQyxRQUFRcUcsSUFBbEIsRUFBd0IsVUFBQ0QsR0FBRDtBQUN2QnFDLGtCQUFjaEcsRUFBRXdGLE1BQUYsQ0FBUzdCLElBQUlZLE9BQWIsRUFBc0IsVUFBQ0UsR0FBRDtBQUNuQyxhQUFPLENBQUNBLElBQUlyRSxNQUFaO0FBRGEsTUFBZDtBQzhIRSxXRDVIRm1FLFVBQVVBLFFBQVEwQixNQUFSLENBQWVELFdBQWYsQ0M0SFI7QUQvSEg7O0FBSUEsU0FBT2hHLEVBQUU4RixJQUFGLENBQU92QixPQUFQLENBQVA7QUFQd0IsQ0FBekI7O0FBU0FoSCxRQUFRMkksZUFBUixHQUEwQixVQUFDbkUsT0FBRCxFQUFVb0UsS0FBVjtBQUN6QixNQUFBQyxDQUFBLEVBQUFDLFFBQUEsRUFBQUMsWUFBQSxFQUFBQyxhQUFBLEVBQUFDLElBQUEsRUFBQUMsS0FBQSxFQUFBQyxJQUFBO0FBQUFKLGlCQUFldEcsRUFBRTJHLEdBQUYsQ0FBTTVFLE9BQU4sRUFBZSxVQUFDMEMsR0FBRDtBQUM3QixRQUFHekUsRUFBRTRHLE9BQUYsQ0FBVW5DLEdBQVYsQ0FBSDtBQUNDLGFBQU8sS0FBUDtBQUREO0FBR0MsYUFBT0EsR0FBUDtBQ2dJRTtBRHBJVyxJQUFmO0FBS0E2QixpQkFBZXRHLEVBQUU2RyxPQUFGLENBQVVQLFlBQVYsQ0FBZjtBQUNBRCxhQUFXLEVBQVg7QUFDQUUsa0JBQWdCRCxhQUFhckUsTUFBN0I7O0FBQ0EsTUFBR2tFLEtBQUg7QUFFQ0EsWUFBUUEsTUFBTVcsT0FBTixDQUFjLEtBQWQsRUFBcUIsRUFBckIsRUFBeUJBLE9BQXpCLENBQWlDLE1BQWpDLEVBQXlDLEdBQXpDLENBQVI7O0FBR0EsUUFBRyxjQUFjbkYsSUFBZCxDQUFtQndFLEtBQW5CLENBQUg7QUFDQ0UsaUJBQVcsU0FBWDtBQytIRTs7QUQ3SEgsUUFBRyxDQUFDQSxRQUFKO0FBQ0NJLGNBQVFOLE1BQU1ZLEtBQU4sQ0FBWSxPQUFaLENBQVI7O0FBQ0EsVUFBRyxDQUFDTixLQUFKO0FBQ0NKLG1CQUFXLDRCQUFYO0FBREQ7QUFHQ0ksY0FBTXhHLE9BQU4sQ0FBYyxVQUFDK0csQ0FBRDtBQUNiLGNBQUdBLElBQUksQ0FBSixJQUFTQSxJQUFJVCxhQUFoQjtBQytITyxtQkQ5SE5GLFdBQVcsc0JBQW9CVyxDQUFwQixHQUFzQixHQzhIM0I7QUFDRDtBRGpJUDtBQUlBUixlQUFPLENBQVA7O0FBQ0EsZUFBTUEsUUFBUUQsYUFBZDtBQUNDLGNBQUcsQ0FBQ0UsTUFBTVEsUUFBTixDQUFlLEtBQUdULElBQWxCLENBQUo7QUFDQ0gsdUJBQVcsNEJBQVg7QUNnSUs7O0FEL0hORztBQVhGO0FBRkQ7QUNnSkc7O0FEaklILFFBQUcsQ0FBQ0gsUUFBSjtBQUVDSyxhQUFPUCxNQUFNWSxLQUFOLENBQVksYUFBWixDQUFQOztBQUNBLFVBQUdMLElBQUg7QUFDQ0EsYUFBS3pHLE9BQUwsQ0FBYSxVQUFDaUgsQ0FBRDtBQUNaLGNBQUcsQ0FBQyxlQUFldkYsSUFBZixDQUFvQnVGLENBQXBCLENBQUo7QUNrSU8sbUJEaklOYixXQUFXLGlCQ2lJTDtBQUNEO0FEcElQO0FBSkY7QUMySUc7O0FEbklILFFBQUcsQ0FBQ0EsUUFBSjtBQUVDO0FBQ0M5SSxnQkFBTyxNQUFQLEVBQWE0SSxNQUFNVyxPQUFOLENBQWMsT0FBZCxFQUF1QixJQUF2QixFQUE2QkEsT0FBN0IsQ0FBcUMsTUFBckMsRUFBNkMsSUFBN0MsQ0FBYjtBQURELGVBQUFLLEtBQUE7QUFFTWYsWUFBQWUsS0FBQTtBQUNMZCxtQkFBVyxjQUFYO0FDcUlHOztBRG5JSixVQUFHLG9CQUFvQjFFLElBQXBCLENBQXlCd0UsS0FBekIsS0FBb0Msb0JBQW9CeEUsSUFBcEIsQ0FBeUJ3RSxLQUF6QixDQUF2QztBQUNDRSxtQkFBVyxrQ0FBWDtBQVJGO0FBL0JEO0FDOEtFOztBRHRJRixNQUFHQSxRQUFIO0FBQ0NlLFlBQVFDLEdBQVIsQ0FBWSxPQUFaLEVBQXFCaEIsUUFBckI7O0FBQ0EsUUFBR2xKLE9BQU9XLFFBQVY7QUFDQ3dKLGFBQU9ILEtBQVAsQ0FBYWQsUUFBYjtBQ3dJRTs7QUR2SUgsV0FBTyxLQUFQO0FBSkQ7QUFNQyxXQUFPLElBQVA7QUN5SUM7QURoTXVCLENBQTFCLEMsQ0EwREE7Ozs7Ozs7O0FBT0E5SSxRQUFRZ0ssb0JBQVIsR0FBK0IsVUFBQ3hGLE9BQUQsRUFBVXlGLE9BQVY7QUFDOUIsTUFBQUMsUUFBQTs7QUFBQSxRQUFBMUYsV0FBQSxPQUFPQSxRQUFTRSxNQUFoQixHQUFnQixNQUFoQjtBQUNDO0FDNklDOztBRDNJRixRQUFPRixRQUFRLENBQVIsYUFBc0IyRixLQUE3QjtBQUNDM0YsY0FBVS9CLEVBQUUyRyxHQUFGLENBQU01RSxPQUFOLEVBQWUsVUFBQzBDLEdBQUQ7QUFDeEIsYUFBTyxDQUFDQSxJQUFJdEMsS0FBTCxFQUFZc0MsSUFBSWtELFNBQWhCLEVBQTJCbEQsSUFBSWpFLEtBQS9CLENBQVA7QUFEUyxNQUFWO0FDK0lDOztBRDdJRmlILGFBQVcsRUFBWDs7QUFDQXpILElBQUVlLElBQUYsQ0FBT2dCLE9BQVAsRUFBZ0IsVUFBQ3lELE1BQUQ7QUFDZixRQUFBckQsS0FBQSxFQUFBeUYsTUFBQSxFQUFBQyxHQUFBLEVBQUFDLFlBQUEsRUFBQXRILEtBQUE7QUFBQTJCLFlBQVFxRCxPQUFPLENBQVAsQ0FBUjtBQUNBb0MsYUFBU3BDLE9BQU8sQ0FBUCxDQUFUOztBQUNBLFFBQUdySSxPQUFPVyxRQUFWO0FBQ0MwQyxjQUFRakQsUUFBUXdLLGVBQVIsQ0FBd0J2QyxPQUFPLENBQVAsQ0FBeEIsQ0FBUjtBQUREO0FBR0NoRixjQUFRakQsUUFBUXdLLGVBQVIsQ0FBd0J2QyxPQUFPLENBQVAsQ0FBeEIsRUFBbUMsSUFBbkMsRUFBeUNnQyxPQUF6QyxDQUFSO0FDZ0pFOztBRC9JSE0sbUJBQWUsRUFBZjtBQUNBQSxpQkFBYTNGLEtBQWIsSUFBc0IsRUFBdEI7O0FBQ0EsUUFBR3lGLFdBQVUsR0FBYjtBQUNDRSxtQkFBYTNGLEtBQWIsRUFBb0IsS0FBcEIsSUFBNkIzQixLQUE3QjtBQURELFdBRUssSUFBR29ILFdBQVUsSUFBYjtBQUNKRSxtQkFBYTNGLEtBQWIsRUFBb0IsS0FBcEIsSUFBNkIzQixLQUE3QjtBQURJLFdBRUEsSUFBR29ILFdBQVUsR0FBYjtBQUNKRSxtQkFBYTNGLEtBQWIsRUFBb0IsS0FBcEIsSUFBNkIzQixLQUE3QjtBQURJLFdBRUEsSUFBR29ILFdBQVUsSUFBYjtBQUNKRSxtQkFBYTNGLEtBQWIsRUFBb0IsTUFBcEIsSUFBOEIzQixLQUE5QjtBQURJLFdBRUEsSUFBR29ILFdBQVUsR0FBYjtBQUNKRSxtQkFBYTNGLEtBQWIsRUFBb0IsS0FBcEIsSUFBNkIzQixLQUE3QjtBQURJLFdBRUEsSUFBR29ILFdBQVUsSUFBYjtBQUNKRSxtQkFBYTNGLEtBQWIsRUFBb0IsTUFBcEIsSUFBOEIzQixLQUE5QjtBQURJLFdBRUEsSUFBR29ILFdBQVUsWUFBYjtBQUNKQyxZQUFNLElBQUlHLE1BQUosQ0FBVyxNQUFNeEgsS0FBakIsRUFBd0IsR0FBeEIsQ0FBTjtBQUNBc0gsbUJBQWEzRixLQUFiLEVBQW9CLFFBQXBCLElBQWdDMEYsR0FBaEM7QUFGSSxXQUdBLElBQUdELFdBQVUsVUFBYjtBQUNKQyxZQUFNLElBQUlHLE1BQUosQ0FBV3hILEtBQVgsRUFBa0IsR0FBbEIsQ0FBTjtBQUNBc0gsbUJBQWEzRixLQUFiLEVBQW9CLFFBQXBCLElBQWdDMEYsR0FBaEM7QUFGSSxXQUdBLElBQUdELFdBQVUsYUFBYjtBQUNKQyxZQUFNLElBQUlHLE1BQUosQ0FBVyxVQUFVeEgsS0FBVixHQUFrQixPQUE3QixFQUFzQyxHQUF0QyxDQUFOO0FBQ0FzSCxtQkFBYTNGLEtBQWIsRUFBb0IsUUFBcEIsSUFBZ0MwRixHQUFoQztBQ2lKRTs7QUFDRCxXRGpKRkosU0FBU25ILElBQVQsQ0FBY3dILFlBQWQsQ0NpSkU7QUQvS0g7O0FBK0JBLFNBQU9MLFFBQVA7QUF2QzhCLENBQS9COztBQXlDQWxLLFFBQVEwSyx3QkFBUixHQUFtQyxVQUFDTixTQUFEO0FBQ2xDLE1BQUFqSyxHQUFBO0FBQUEsU0FBT2lLLGNBQWEsU0FBYixJQUEwQixDQUFDLEdBQUFqSyxNQUFBSCxRQUFBMkssMkJBQUEsa0JBQUF4SyxJQUE0Q2lLLFNBQTVDLElBQTRDLE1BQTVDLENBQWxDO0FBRGtDLENBQW5DLEMsQ0FHQTs7Ozs7Ozs7QUFPQXBLLFFBQVE0SyxrQkFBUixHQUE2QixVQUFDcEcsT0FBRCxFQUFVdEUsV0FBVixFQUF1QitKLE9BQXZCO0FBQzVCLE1BQUFZLGdCQUFBLEVBQUFYLFFBQUEsRUFBQVksY0FBQTtBQUFBQSxtQkFBaUJDLFFBQVEsa0JBQVIsQ0FBakI7O0FBQ0EsT0FBT3ZHLFFBQVFFLE1BQWY7QUFDQztBQ3lKQzs7QUR4SkYsTUFBQXVGLFdBQUEsT0FBR0EsUUFBU2UsV0FBWixHQUFZLE1BQVo7QUFFQ0gsdUJBQW1CLEVBQW5CO0FBQ0FyRyxZQUFROUIsT0FBUixDQUFnQixVQUFDaUMsQ0FBRDtBQUNma0csdUJBQWlCOUgsSUFBakIsQ0FBc0I0QixDQUF0QjtBQ3lKRyxhRHhKSGtHLGlCQUFpQjlILElBQWpCLENBQXNCLElBQXRCLENDd0pHO0FEMUpKO0FBR0E4SCxxQkFBaUJJLEdBQWpCO0FBQ0F6RyxjQUFVcUcsZ0JBQVY7QUMwSkM7O0FEekpGWCxhQUFXWSxlQUFlRixrQkFBZixDQUFrQ3BHLE9BQWxDLEVBQTJDeEUsUUFBUWtMLFlBQW5ELENBQVg7QUFDQSxTQUFPaEIsUUFBUDtBQWI0QixDQUE3QixDLENBZUE7Ozs7Ozs7O0FBT0FsSyxRQUFRbUwsdUJBQVIsR0FBa0MsVUFBQzNHLE9BQUQsRUFBVTRHLFlBQVYsRUFBd0JuQixPQUF4QjtBQUNqQyxNQUFBb0IsWUFBQTtBQUFBQSxpQkFBZUQsYUFBYTdCLE9BQWIsQ0FBcUIsU0FBckIsRUFBZ0MsR0FBaEMsRUFBcUNBLE9BQXJDLENBQTZDLFNBQTdDLEVBQXdELEdBQXhELEVBQTZEQSxPQUE3RCxDQUFxRSxLQUFyRSxFQUE0RSxHQUE1RSxFQUFpRkEsT0FBakYsQ0FBeUYsS0FBekYsRUFBZ0csR0FBaEcsRUFBcUdBLE9BQXJHLENBQTZHLE1BQTdHLEVBQXFILEdBQXJILEVBQTBIQSxPQUExSCxDQUFrSSxZQUFsSSxFQUFnSixNQUFoSixDQUFmO0FBQ0E4QixpQkFBZUEsYUFBYTlCLE9BQWIsQ0FBcUIsU0FBckIsRUFBZ0MsVUFBQytCLENBQUQ7QUFDOUMsUUFBQUMsRUFBQSxFQUFBM0csS0FBQSxFQUFBeUYsTUFBQSxFQUFBRSxZQUFBLEVBQUF0SCxLQUFBOztBQUFBc0ksU0FBSy9HLFFBQVE4RyxJQUFFLENBQVYsQ0FBTDtBQUNBMUcsWUFBUTJHLEdBQUczRyxLQUFYO0FBQ0F5RixhQUFTa0IsR0FBR25CLFNBQVo7O0FBQ0EsUUFBR3hLLE9BQU9XLFFBQVY7QUFDQzBDLGNBQVFqRCxRQUFRd0ssZUFBUixDQUF3QmUsR0FBR3RJLEtBQTNCLENBQVI7QUFERDtBQUdDQSxjQUFRakQsUUFBUXdLLGVBQVIsQ0FBd0JlLEdBQUd0SSxLQUEzQixFQUFrQyxJQUFsQyxFQUF3Q2dILE9BQXhDLENBQVI7QUNnS0U7O0FEL0pITSxtQkFBZSxFQUFmOztBQUNBLFFBQUc5SCxFQUFFK0ksT0FBRixDQUFVdkksS0FBVixNQUFvQixJQUF2QjtBQUNDLFVBQUdvSCxXQUFVLEdBQWI7QUFDQzVILFVBQUVlLElBQUYsQ0FBT1AsS0FBUCxFQUFjLFVBQUN4RCxDQUFEO0FDaUtSLGlCRGhLTDhLLGFBQWF4SCxJQUFiLENBQWtCLENBQUM2QixLQUFELEVBQVF5RixNQUFSLEVBQWdCNUssQ0FBaEIsQ0FBbEIsRUFBc0MsSUFBdEMsQ0NnS0s7QURqS047QUFERCxhQUdLLElBQUc0SyxXQUFVLElBQWI7QUFDSjVILFVBQUVlLElBQUYsQ0FBT1AsS0FBUCxFQUFjLFVBQUN4RCxDQUFEO0FDa0tSLGlCRGpLTDhLLGFBQWF4SCxJQUFiLENBQWtCLENBQUM2QixLQUFELEVBQVF5RixNQUFSLEVBQWdCNUssQ0FBaEIsQ0FBbEIsRUFBc0MsS0FBdEMsQ0NpS0s7QURsS047QUFESTtBQUlKZ0QsVUFBRWUsSUFBRixDQUFPUCxLQUFQLEVBQWMsVUFBQ3hELENBQUQ7QUNtS1IsaUJEbEtMOEssYUFBYXhILElBQWIsQ0FBa0IsQ0FBQzZCLEtBQUQsRUFBUXlGLE1BQVIsRUFBZ0I1SyxDQUFoQixDQUFsQixFQUFzQyxJQUF0QyxDQ2tLSztBRG5LTjtBQ3FLRzs7QURuS0osVUFBRzhLLGFBQWFBLGFBQWE3RixNQUFiLEdBQXNCLENBQW5DLE1BQXlDLEtBQXpDLElBQWtENkYsYUFBYUEsYUFBYTdGLE1BQWIsR0FBc0IsQ0FBbkMsTUFBeUMsSUFBOUY7QUFDQzZGLHFCQUFhVSxHQUFiO0FBWEY7QUFBQTtBQWFDVixxQkFBZSxDQUFDM0YsS0FBRCxFQUFReUYsTUFBUixFQUFnQnBILEtBQWhCLENBQWY7QUNzS0U7O0FEcktINEcsWUFBUUMsR0FBUixDQUFZLGNBQVosRUFBNEJTLFlBQTVCO0FBQ0EsV0FBT2tCLEtBQUtDLFNBQUwsQ0FBZW5CLFlBQWYsQ0FBUDtBQXhCYyxJQUFmO0FBMEJBYyxpQkFBZSxNQUFJQSxZQUFKLEdBQWlCLEdBQWhDO0FBQ0EsU0FBT3JMLFFBQU8sTUFBUCxFQUFhcUwsWUFBYixDQUFQO0FBN0JpQyxDQUFsQzs7QUErQkFyTCxRQUFRdUQsaUJBQVIsR0FBNEIsVUFBQ3JELFdBQUQsRUFBY3lMLE9BQWQsRUFBdUJDLE1BQXZCO0FBQzNCLE1BQUF4SixPQUFBLEVBQUErRSxXQUFBLEVBQUEwRSxvQkFBQSxFQUFBQyxlQUFBLEVBQUFDLGlCQUFBOztBQUFBLE1BQUduTSxPQUFPVyxRQUFWO0FBQ0MsUUFBRyxDQUFDTCxXQUFKO0FBQ0NBLG9CQUFjZSxRQUFRQyxHQUFSLENBQVksYUFBWixDQUFkO0FDeUtFOztBRHhLSCxRQUFHLENBQUN5SyxPQUFKO0FBQ0NBLGdCQUFVMUssUUFBUUMsR0FBUixDQUFZLFNBQVosQ0FBVjtBQzBLRTs7QUR6S0gsUUFBRyxDQUFDMEssTUFBSjtBQUNDQSxlQUFTaE0sT0FBT2dNLE1BQVAsRUFBVDtBQU5GO0FDa0xFOztBRDFLRkMseUJBQXVCLEVBQXZCO0FBQ0F6SixZQUFVcEMsUUFBUUksU0FBUixDQUFrQkYsV0FBbEIsQ0FBVjs7QUFFQSxNQUFHLENBQUNrQyxPQUFKO0FBQ0MsV0FBT3lKLG9CQUFQO0FDMktDOztBRHZLRkMsb0JBQWtCOUwsUUFBUWdNLGlCQUFSLENBQTBCNUosUUFBUTZKLGdCQUFsQyxDQUFsQjtBQUVBSix5QkFBdUJwSixFQUFFdUYsS0FBRixDQUFROEQsZUFBUixFQUF3QixhQUF4QixDQUF2Qjs7QUFDQSxPQUFBRCx3QkFBQSxPQUFHQSxxQkFBc0JuSCxNQUF6QixHQUF5QixNQUF6QixNQUFtQyxDQUFuQztBQUNDLFdBQU9tSCxvQkFBUDtBQ3dLQzs7QUR0S0YxRSxnQkFBY25ILFFBQVFrTSxjQUFSLENBQXVCaE0sV0FBdkIsRUFBb0N5TCxPQUFwQyxFQUE2Q0MsTUFBN0MsQ0FBZDtBQUNBRyxzQkFBb0I1RSxZQUFZNEUsaUJBQWhDO0FBRUFGLHlCQUF1QnBKLEVBQUUwSixVQUFGLENBQWFOLG9CQUFiLEVBQW1DRSxpQkFBbkMsQ0FBdkI7QUFDQSxTQUFPdEosRUFBRXdGLE1BQUYsQ0FBUzZELGVBQVQsRUFBMEIsVUFBQ00sY0FBRDtBQUNoQyxRQUFBaEYsU0FBQSxFQUFBaUYsUUFBQSxFQUFBbE0sR0FBQSxFQUFBNEIsbUJBQUE7QUFBQUEsMEJBQXNCcUssZUFBZWxNLFdBQXJDO0FBQ0FtTSxlQUFXUixxQkFBcUJ4SCxPQUFyQixDQUE2QnRDLG1CQUE3QixJQUFvRCxDQUFDLENBQWhFO0FBQ0FxRixnQkFBQSxDQUFBakgsTUFBQUgsUUFBQWtNLGNBQUEsQ0FBQW5LLG1CQUFBLEVBQUE0SixPQUFBLEVBQUFDLE1BQUEsYUFBQXpMLElBQTBFaUgsU0FBMUUsR0FBMEUsTUFBMUU7QUFDQSxXQUFPaUYsWUFBYWpGLFNBQXBCO0FBSk0sSUFBUDtBQTNCMkIsQ0FBNUI7O0FBaUNBcEgsUUFBUXNNLHFCQUFSLEdBQWdDLFVBQUNwTSxXQUFELEVBQWN5TCxPQUFkLEVBQXVCQyxNQUF2QjtBQUMvQixNQUFBRSxlQUFBO0FBQUFBLG9CQUFrQjlMLFFBQVF1RCxpQkFBUixDQUEwQnJELFdBQTFCLEVBQXVDeUwsT0FBdkMsRUFBZ0RDLE1BQWhELENBQWxCO0FBQ0EsU0FBT25KLEVBQUV1RixLQUFGLENBQVE4RCxlQUFSLEVBQXdCLGFBQXhCLENBQVA7QUFGK0IsQ0FBaEM7O0FBSUE5TCxRQUFRdU0sVUFBUixHQUFxQixVQUFDck0sV0FBRCxFQUFjeUwsT0FBZCxFQUF1QkMsTUFBdkI7QUFDcEIsTUFBQVksT0FBQSxFQUFBQyxnQkFBQSxFQUFBdkYsR0FBQSxFQUFBQyxXQUFBLEVBQUFoSCxHQUFBLEVBQUFzRixJQUFBOztBQUFBLE1BQUc3RixPQUFPVyxRQUFWO0FBQ0MsUUFBRyxDQUFDTCxXQUFKO0FBQ0NBLG9CQUFjZSxRQUFRQyxHQUFSLENBQVksYUFBWixDQUFkO0FDNktFOztBRDVLSCxRQUFHLENBQUN5SyxPQUFKO0FBQ0NBLGdCQUFVMUssUUFBUUMsR0FBUixDQUFZLFNBQVosQ0FBVjtBQzhLRTs7QUQ3S0gsUUFBRyxDQUFDMEssTUFBSjtBQUNDQSxlQUFTaE0sT0FBT2dNLE1BQVAsRUFBVDtBQU5GO0FDc0xFOztBRDlLRjFFLFFBQU1sSCxRQUFRSSxTQUFSLENBQWtCRixXQUFsQixDQUFOOztBQUVBLE1BQUcsQ0FBQ2dILEdBQUo7QUFDQztBQytLQzs7QUQ3S0ZDLGdCQUFjbkgsUUFBUWtNLGNBQVIsQ0FBdUJoTSxXQUF2QixFQUFvQ3lMLE9BQXBDLEVBQTZDQyxNQUE3QyxDQUFkO0FBQ0FhLHFCQUFtQnRGLFlBQVlzRixnQkFBL0I7QUFDQUQsWUFBVS9KLEVBQUVpSyxNQUFGLENBQVNqSyxFQUFFa0ssTUFBRixDQUFTekYsSUFBSXNGLE9BQWIsQ0FBVCxFQUFpQyxNQUFqQyxDQUFWOztBQUVBLE1BQUcvSixFQUFFbUssR0FBRixDQUFNMUYsR0FBTixFQUFXLHFCQUFYLENBQUg7QUFDQ3NGLGNBQVUvSixFQUFFd0YsTUFBRixDQUFTdUUsT0FBVCxFQUFrQixVQUFDSyxNQUFEO0FBQzNCLGFBQU9wSyxFQUFFMEIsT0FBRixDQUFVK0MsSUFBSTRGLG1CQUFkLEVBQW1DRCxPQUFPOUksSUFBMUMsS0FBbUR0QixFQUFFMEIsT0FBRixDQUFVMUIsRUFBRXNLLElBQUYsQ0FBTy9NLFFBQVFJLFNBQVIsQ0FBa0IsTUFBbEIsRUFBMEJvTSxPQUFqQyxLQUE2QyxFQUF2RCxFQUEyREssT0FBTzlJLElBQWxFLENBQTFEO0FBRFMsTUFBVjtBQ2dMQzs7QUQ5S0YsTUFBR3RCLEVBQUVtSyxHQUFGLENBQU0xRixHQUFOLEVBQVcsaUJBQVgsQ0FBSDtBQUNDc0YsY0FBVS9KLEVBQUV3RixNQUFGLENBQVN1RSxPQUFULEVBQWtCLFVBQUNLLE1BQUQ7QUFDM0IsYUFBTyxDQUFDcEssRUFBRTBCLE9BQUYsQ0FBVStDLElBQUk4RixlQUFkLEVBQStCSCxPQUFPOUksSUFBdEMsQ0FBUjtBQURTLE1BQVY7QUNrTEM7O0FEL0tGdEIsSUFBRWUsSUFBRixDQUFPZ0osT0FBUCxFQUFnQixVQUFDSyxNQUFEO0FBRWYsUUFBR3RMLFFBQVF3RixRQUFSLE1BQXNCLENBQUMsUUFBRCxFQUFXLGFBQVgsRUFBMEIxQyxPQUExQixDQUFrQ3dJLE9BQU9JLEVBQXpDLElBQStDLENBQUMsQ0FBdEUsSUFBMkVKLE9BQU85SSxJQUFQLEtBQWUsZUFBN0Y7QUFDQyxVQUFHOEksT0FBT0ksRUFBUCxLQUFhLGFBQWhCO0FDZ0xLLGVEL0tKSixPQUFPSSxFQUFQLEdBQVksa0JDK0tSO0FEaExMO0FDa0xLLGVEL0tKSixPQUFPSSxFQUFQLEdBQVksYUMrS1I7QURuTE47QUNxTEc7QUR2TEo7O0FBUUEsTUFBRzFMLFFBQVF3RixRQUFSLE1BQXNCLENBQUMsV0FBRCxFQUFjLHNCQUFkLEVBQXNDMUMsT0FBdEMsQ0FBOENuRSxXQUE5QyxJQUE2RCxDQUFDLENBQXZGO0FDa0xHLFFBQUksQ0FBQ0MsTUFBTXFNLFFBQVFySCxJQUFSLENBQWEsVUFBU1IsQ0FBVCxFQUFZO0FBQ2xDLGFBQU9BLEVBQUVaLElBQUYsS0FBVyxlQUFsQjtBQUNELEtBRlUsQ0FBUCxLQUVHLElBRlAsRUFFYTtBQUNYNUQsVURuTGtEOE0sRUNtTGxELEdEbkx1RCxhQ21MdkQ7QUFDRDs7QUFDRCxRQUFJLENBQUN4SCxPQUFPK0csUUFBUXJILElBQVIsQ0FBYSxVQUFTUixDQUFULEVBQVk7QUFDbkMsYUFBT0EsRUFBRVosSUFBRixLQUFXLFVBQWxCO0FBQ0QsS0FGVyxDQUFSLEtBRUcsSUFGUCxFQUVhO0FBQ1gwQixXRHZMNkN3SCxFQ3VMN0MsR0R2TGtELFFDdUxsRDtBRDFMTDtBQzRMRTs7QUR2TEZULFlBQVUvSixFQUFFd0YsTUFBRixDQUFTdUUsT0FBVCxFQUFrQixVQUFDSyxNQUFEO0FBQzNCLFdBQU9wSyxFQUFFNEIsT0FBRixDQUFVb0ksZ0JBQVYsRUFBNEJJLE9BQU85SSxJQUFuQyxJQUEyQyxDQUFsRDtBQURTLElBQVY7QUFHQSxTQUFPeUksT0FBUDtBQXpDb0IsQ0FBckI7O0FBMkNBOztBQUlBeE0sUUFBUWtOLFlBQVIsR0FBdUIsVUFBQ2hOLFdBQUQsRUFBY3lMLE9BQWQsRUFBdUJDLE1BQXZCO0FBQ3RCLE1BQUF1QixtQkFBQSxFQUFBcEcsUUFBQSxFQUFBcUcsVUFBQSxFQUFBQyxNQUFBLEVBQUFsTixHQUFBOztBQUFBLE1BQUdQLE9BQU9XLFFBQVY7QUFDQyxRQUFHLENBQUNMLFdBQUo7QUFDQ0Esb0JBQWNlLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUN5TEU7O0FEeExILFFBQUcsQ0FBQ3lLLE9BQUo7QUFDQ0EsZ0JBQVUxSyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFWO0FDMExFOztBRHpMSCxRQUFHLENBQUMwSyxNQUFKO0FBQ0NBLGVBQVNoTSxPQUFPZ00sTUFBUCxFQUFUO0FBTkY7QUNrTUU7O0FEMUxGLE9BQU8xTCxXQUFQO0FBQ0M7QUM0TEM7O0FEMUxGbU4sV0FBU3JOLFFBQVFJLFNBQVIsQ0FBa0JGLFdBQWxCLENBQVQ7O0FBRUEsTUFBRyxDQUFDbU4sTUFBSjtBQUNDO0FDMkxDOztBRHpMRkYsd0JBQUEsRUFBQWhOLE1BQUFILFFBQUFrTSxjQUFBLENBQUFoTSxXQUFBLEVBQUF5TCxPQUFBLEVBQUFDLE1BQUEsYUFBQXpMLElBQTRFZ04sbUJBQTVFLEdBQTRFLE1BQTVFLEtBQW1HLEVBQW5HO0FBRUFDLGVBQWEsRUFBYjtBQUVBckcsYUFBV3hGLFFBQVF3RixRQUFSLEVBQVg7O0FBRUF0RSxJQUFFZSxJQUFGLENBQU82SixPQUFPRCxVQUFkLEVBQTBCLFVBQUNFLElBQUQsRUFBT0MsU0FBUDtBQUN6QixRQUFHeEcsWUFBYXVHLEtBQUt4SyxJQUFMLEtBQWEsVUFBN0I7QUFFQztBQ3VMRTs7QUR0TEgsUUFBR3lLLGNBQWEsU0FBaEI7QUFDQyxVQUFHOUssRUFBRTRCLE9BQUYsQ0FBVThJLG1CQUFWLEVBQStCSSxTQUEvQixJQUE0QyxDQUE1QyxJQUFpREQsS0FBS0UsS0FBTCxLQUFjNUIsTUFBbEU7QUN3TEssZUR2TEp3QixXQUFXckssSUFBWCxDQUFnQnVLLElBQWhCLENDdUxJO0FEekxOO0FDMkxHO0FEL0xKOztBQVFBLFNBQU9GLFVBQVA7QUEvQnNCLENBQXZCOztBQWtDQXBOLFFBQVFrRSxTQUFSLEdBQW9CLFVBQUNoRSxXQUFELEVBQWN5TCxPQUFkLEVBQXVCQyxNQUF2QjtBQUNuQixNQUFBNkIsVUFBQSxFQUFBdE4sR0FBQSxFQUFBdU4saUJBQUE7O0FBQUEsTUFBRzlOLE9BQU9XLFFBQVY7QUFDQyxRQUFHLENBQUNMLFdBQUo7QUFDQ0Esb0JBQWNlLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUMyTEU7O0FEMUxILFFBQUcsQ0FBQ3lLLE9BQUo7QUFDQ0EsZ0JBQVUxSyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFWO0FDNExFOztBRDNMSCxRQUFHLENBQUMwSyxNQUFKO0FBQ0NBLGVBQVNoTSxPQUFPZ00sTUFBUCxFQUFUO0FBTkY7QUNvTUU7O0FENUxGNkIsZUFBYXpOLFFBQVEyTixtQkFBUixDQUE0QnpOLFdBQTVCLENBQWI7QUFDQXdOLHNCQUFBLENBQUF2TixNQUFBSCxRQUFBa00sY0FBQSxDQUFBaE0sV0FBQSxFQUFBeUwsT0FBQSxFQUFBQyxNQUFBLGFBQUF6TCxJQUEyRXVOLGlCQUEzRSxHQUEyRSxNQUEzRTtBQUNBLFNBQU9qTCxFQUFFMEosVUFBRixDQUFhc0IsVUFBYixFQUF5QkMsaUJBQXpCLENBQVA7QUFYbUIsQ0FBcEI7O0FBYUExTixRQUFRNE4sU0FBUixHQUFvQjtBQUNuQixTQUFPLENBQUM1TixRQUFRNk4sZUFBUixDQUF3QjNNLEdBQXhCLEVBQVI7QUFEbUIsQ0FBcEI7O0FBR0FsQixRQUFROE4sdUJBQVIsR0FBa0MsVUFBQ0MsR0FBRDtBQUNqQyxTQUFPQSxJQUFJeEUsT0FBSixDQUFZLG1DQUFaLEVBQWlELE1BQWpELENBQVA7QUFEaUMsQ0FBbEM7O0FBS0F2SixRQUFRZ08saUJBQVIsR0FBNEIsVUFBQzNOLE1BQUQ7QUFDM0IsTUFBQWlDLE1BQUE7QUFBQUEsV0FBU0csRUFBRTJHLEdBQUYsQ0FBTS9JLE1BQU4sRUFBYyxVQUFDdUUsS0FBRCxFQUFRcUosU0FBUjtBQUN0QixXQUFPckosTUFBTXNKLFFBQU4sSUFBbUJ0SixNQUFNc0osUUFBTixDQUFlQyxRQUFsQyxJQUErQyxDQUFDdkosTUFBTXNKLFFBQU4sQ0FBZUUsSUFBL0QsSUFBd0VILFNBQS9FO0FBRFEsSUFBVDtBQUdBM0wsV0FBU0csRUFBRTZHLE9BQUYsQ0FBVWhILE1BQVYsQ0FBVDtBQUNBLFNBQU9BLE1BQVA7QUFMMkIsQ0FBNUI7O0FBT0F0QyxRQUFRcU8sZUFBUixHQUEwQixVQUFDaE8sTUFBRDtBQUN6QixNQUFBaUMsTUFBQTtBQUFBQSxXQUFTRyxFQUFFMkcsR0FBRixDQUFNL0ksTUFBTixFQUFjLFVBQUN1RSxLQUFELEVBQVFxSixTQUFSO0FBQ3RCLFdBQU9ySixNQUFNc0osUUFBTixJQUFtQnRKLE1BQU1zSixRQUFOLENBQWVwTCxJQUFmLEtBQXVCLFFBQTFDLElBQXVELENBQUM4QixNQUFNc0osUUFBTixDQUFlRSxJQUF2RSxJQUFnRkgsU0FBdkY7QUFEUSxJQUFUO0FBR0EzTCxXQUFTRyxFQUFFNkcsT0FBRixDQUFVaEgsTUFBVixDQUFUO0FBQ0EsU0FBT0EsTUFBUDtBQUx5QixDQUExQjs7QUFPQXRDLFFBQVFzTyxvQkFBUixHQUErQixVQUFDak8sTUFBRDtBQUM5QixNQUFBaUMsTUFBQTtBQUFBQSxXQUFTRyxFQUFFMkcsR0FBRixDQUFNL0ksTUFBTixFQUFjLFVBQUN1RSxLQUFELEVBQVFxSixTQUFSO0FBQ3RCLFdBQU8sQ0FBQyxDQUFDckosTUFBTXNKLFFBQVAsSUFBbUIsQ0FBQ3RKLE1BQU1zSixRQUFOLENBQWVLLEtBQW5DLElBQTRDM0osTUFBTXNKLFFBQU4sQ0FBZUssS0FBZixLQUF3QixHQUFyRSxNQUErRSxDQUFDM0osTUFBTXNKLFFBQVAsSUFBbUJ0SixNQUFNc0osUUFBTixDQUFlcEwsSUFBZixLQUF1QixRQUF6SCxLQUF1SW1MLFNBQTlJO0FBRFEsSUFBVDtBQUdBM0wsV0FBU0csRUFBRTZHLE9BQUYsQ0FBVWhILE1BQVYsQ0FBVDtBQUNBLFNBQU9BLE1BQVA7QUFMOEIsQ0FBL0I7O0FBT0F0QyxRQUFRd08sd0JBQVIsR0FBbUMsVUFBQ25PLE1BQUQ7QUFDbEMsTUFBQW9PLEtBQUE7QUFBQUEsVUFBUWhNLEVBQUUyRyxHQUFGLENBQU0vSSxNQUFOLEVBQWMsVUFBQ3VFLEtBQUQ7QUFDcEIsV0FBT0EsTUFBTXNKLFFBQU4sSUFBbUJ0SixNQUFNc0osUUFBTixDQUFlSyxLQUFmLEtBQXdCLEdBQTNDLElBQW1EM0osTUFBTXNKLFFBQU4sQ0FBZUssS0FBekU7QUFETSxJQUFSO0FBR0FFLFVBQVFoTSxFQUFFNkcsT0FBRixDQUFVbUYsS0FBVixDQUFSO0FBQ0FBLFVBQVFoTSxFQUFFaU0sTUFBRixDQUFTRCxLQUFULENBQVI7QUFDQSxTQUFPQSxLQUFQO0FBTmtDLENBQW5DOztBQVFBek8sUUFBUTJPLGlCQUFSLEdBQTRCLFVBQUN0TyxNQUFELEVBQVN1TyxTQUFUO0FBQ3pCLE1BQUF0TSxNQUFBO0FBQUFBLFdBQVNHLEVBQUUyRyxHQUFGLENBQU0vSSxNQUFOLEVBQWMsVUFBQ3VFLEtBQUQsRUFBUXFKLFNBQVI7QUFDckIsV0FBT3JKLE1BQU1zSixRQUFOLElBQW1CdEosTUFBTXNKLFFBQU4sQ0FBZUssS0FBZixLQUF3QkssU0FBM0MsSUFBeURoSyxNQUFNc0osUUFBTixDQUFlcEwsSUFBZixLQUF1QixRQUFoRixJQUE2Rm1MLFNBQXBHO0FBRE8sSUFBVDtBQUdBM0wsV0FBU0csRUFBRTZHLE9BQUYsQ0FBVWhILE1BQVYsQ0FBVDtBQUNBLFNBQU9BLE1BQVA7QUFMeUIsQ0FBNUI7O0FBT0F0QyxRQUFRNk8sb0JBQVIsR0FBK0IsVUFBQ3hPLE1BQUQsRUFBUzBNLElBQVQ7QUFDOUJBLFNBQU90SyxFQUFFMkcsR0FBRixDQUFNMkQsSUFBTixFQUFZLFVBQUN6RSxHQUFEO0FBQ2xCLFFBQUExRCxLQUFBLEVBQUF6RSxHQUFBO0FBQUF5RSxZQUFRbkMsRUFBRXFNLElBQUYsQ0FBT3pPLE1BQVAsRUFBZWlJLEdBQWYsQ0FBUjs7QUFDQSxTQUFBbkksTUFBQXlFLE1BQUEwRCxHQUFBLEVBQUE0RixRQUFBLFlBQUEvTixJQUF3QmlPLElBQXhCLEdBQXdCLE1BQXhCO0FBQ0MsYUFBTyxLQUFQO0FBREQ7QUFHQyxhQUFPOUYsR0FBUDtBQzBNRTtBRC9NRyxJQUFQO0FBT0F5RSxTQUFPdEssRUFBRTZHLE9BQUYsQ0FBVXlELElBQVYsQ0FBUDtBQUNBLFNBQU9BLElBQVA7QUFUOEIsQ0FBL0I7O0FBV0EvTSxRQUFRK08scUJBQVIsR0FBZ0MsVUFBQ0MsY0FBRCxFQUFpQmpDLElBQWpCO0FBQy9CQSxTQUFPdEssRUFBRTJHLEdBQUYsQ0FBTTJELElBQU4sRUFBWSxVQUFDekUsR0FBRDtBQUNsQixRQUFHN0YsRUFBRTRCLE9BQUYsQ0FBVTJLLGNBQVYsRUFBMEIxRyxHQUExQixJQUFpQyxDQUFDLENBQXJDO0FBQ0MsYUFBT0EsR0FBUDtBQUREO0FBR0MsYUFBTyxLQUFQO0FDNE1FO0FEaE5HLElBQVA7QUFNQXlFLFNBQU90SyxFQUFFNkcsT0FBRixDQUFVeUQsSUFBVixDQUFQO0FBQ0EsU0FBT0EsSUFBUDtBQVIrQixDQUFoQzs7QUFVQS9NLFFBQVFpUCxtQkFBUixHQUE4QixVQUFDNU8sTUFBRCxFQUFTME0sSUFBVCxFQUFlbUMsUUFBZjtBQUM3QixNQUFBQyxLQUFBLEVBQUFDLFNBQUEsRUFBQTlNLE1BQUEsRUFBQW1ILENBQUEsRUFBQTRGLFNBQUEsRUFBQUMsU0FBQSxFQUFBQyxJQUFBLEVBQUFDLElBQUE7O0FBQUFsTixXQUFTLEVBQVQ7QUFDQW1ILE1BQUksQ0FBSjtBQUNBMEYsVUFBUTFNLEVBQUV3RixNQUFGLENBQVM4RSxJQUFULEVBQWUsVUFBQ3pFLEdBQUQ7QUFDdEIsV0FBTyxDQUFDQSxJQUFJbUgsUUFBSixDQUFhLFVBQWIsQ0FBUjtBQURPLElBQVI7O0FBR0EsU0FBTWhHLElBQUkwRixNQUFNekssTUFBaEI7QUFDQzZLLFdBQU85TSxFQUFFcU0sSUFBRixDQUFPek8sTUFBUCxFQUFlOE8sTUFBTTFGLENBQU4sQ0FBZixDQUFQO0FBQ0ErRixXQUFPL00sRUFBRXFNLElBQUYsQ0FBT3pPLE1BQVAsRUFBZThPLE1BQU0xRixJQUFFLENBQVIsQ0FBZixDQUFQO0FBRUE0RixnQkFBWSxLQUFaO0FBQ0FDLGdCQUFZLEtBQVo7O0FBS0E3TSxNQUFFZSxJQUFGLENBQU8rTCxJQUFQLEVBQWEsVUFBQ3RNLEtBQUQ7QUFDWixVQUFBOUMsR0FBQSxFQUFBc0YsSUFBQTs7QUFBQSxZQUFBdEYsTUFBQThDLE1BQUFpTCxRQUFBLFlBQUEvTixJQUFtQnVQLE9BQW5CLEdBQW1CLE1BQW5CLEtBQUcsRUFBQWpLLE9BQUF4QyxNQUFBaUwsUUFBQSxZQUFBekksS0FBMkMzQyxJQUEzQyxHQUEyQyxNQUEzQyxNQUFtRCxPQUF0RDtBQzJNSyxlRDFNSnVNLFlBQVksSUMwTVI7QUFDRDtBRDdNTDs7QUFPQTVNLE1BQUVlLElBQUYsQ0FBT2dNLElBQVAsRUFBYSxVQUFDdk0sS0FBRDtBQUNaLFVBQUE5QyxHQUFBLEVBQUFzRixJQUFBOztBQUFBLFlBQUF0RixNQUFBOEMsTUFBQWlMLFFBQUEsWUFBQS9OLElBQW1CdVAsT0FBbkIsR0FBbUIsTUFBbkIsS0FBRyxFQUFBakssT0FBQXhDLE1BQUFpTCxRQUFBLFlBQUF6SSxLQUEyQzNDLElBQTNDLEdBQTJDLE1BQTNDLE1BQW1ELE9BQXREO0FDME1LLGVEek1Kd00sWUFBWSxJQ3lNUjtBQUNEO0FENU1MOztBQU9BLFFBQUcvTixRQUFRd0YsUUFBUixFQUFIO0FBQ0NzSSxrQkFBWSxJQUFaO0FBQ0FDLGtCQUFZLElBQVo7QUN3TUU7O0FEdE1ILFFBQUdKLFFBQUg7QUFDQzVNLGFBQU9TLElBQVAsQ0FBWW9NLE1BQU1RLEtBQU4sQ0FBWWxHLENBQVosRUFBZUEsSUFBRSxDQUFqQixDQUFaO0FBQ0FBLFdBQUssQ0FBTDtBQUZEO0FBVUMsVUFBRzRGLFNBQUg7QUFDQy9NLGVBQU9TLElBQVAsQ0FBWW9NLE1BQU1RLEtBQU4sQ0FBWWxHLENBQVosRUFBZUEsSUFBRSxDQUFqQixDQUFaO0FBQ0FBLGFBQUssQ0FBTDtBQUZELGFBR0ssSUFBRyxDQUFDNEYsU0FBRCxJQUFlQyxTQUFsQjtBQUNKRixvQkFBWUQsTUFBTVEsS0FBTixDQUFZbEcsQ0FBWixFQUFlQSxJQUFFLENBQWpCLENBQVo7QUFDQTJGLGtCQUFVck0sSUFBVixDQUFlLE1BQWY7QUFDQVQsZUFBT1MsSUFBUCxDQUFZcU0sU0FBWjtBQUNBM0YsYUFBSyxDQUFMO0FBSkksYUFLQSxJQUFHLENBQUM0RixTQUFELElBQWUsQ0FBQ0MsU0FBbkI7QUFDSkYsb0JBQVlELE1BQU1RLEtBQU4sQ0FBWWxHLENBQVosRUFBZUEsSUFBRSxDQUFqQixDQUFaOztBQUNBLFlBQUcwRixNQUFNMUYsSUFBRSxDQUFSLENBQUg7QUFDQzJGLG9CQUFVck0sSUFBVixDQUFlb00sTUFBTTFGLElBQUUsQ0FBUixDQUFmO0FBREQ7QUFHQzJGLG9CQUFVck0sSUFBVixDQUFlLE1BQWY7QUNrTUk7O0FEak1MVCxlQUFPUyxJQUFQLENBQVlxTSxTQUFaO0FBQ0EzRixhQUFLLENBQUw7QUF6QkY7QUM2Tkc7QUR6UEo7O0FBdURBLFNBQU9uSCxNQUFQO0FBN0Q2QixDQUE5Qjs7QUErREF0QyxRQUFRNFAsa0JBQVIsR0FBNkIsVUFBQ25RLENBQUQ7QUFDNUIsU0FBTyxPQUFPQSxDQUFQLEtBQVksV0FBWixJQUEyQkEsTUFBSyxJQUFoQyxJQUF3Q29RLE9BQU9DLEtBQVAsQ0FBYXJRLENBQWIsQ0FBeEMsSUFBMkRBLEVBQUVpRixNQUFGLEtBQVksQ0FBOUU7QUFENEIsQ0FBN0I7O0FBR0ExRSxRQUFRK1AsZ0JBQVIsR0FBMkIsVUFBQ0MsWUFBRCxFQUFlMUgsR0FBZjtBQUMxQixNQUFBbkksR0FBQSxFQUFBOFAsTUFBQTs7QUFBQSxNQUFHRCxnQkFBaUIxSCxHQUFwQjtBQUNDMkgsYUFBQSxDQUFBOVAsTUFBQTZQLGFBQUExSCxHQUFBLGFBQUFuSSxJQUE0QjJDLElBQTVCLEdBQTRCLE1BQTVCOztBQUNBLFFBQUcsQ0FBQyxTQUFELEVBQVksU0FBWixFQUF1QnVCLE9BQXZCLENBQStCNEwsTUFBL0IsSUFBeUMsQ0FBQyxDQUE3QztBQUNDQSxlQUFTRCxhQUFhMUgsR0FBYixFQUFrQjRILFNBQTNCO0FDd01FOztBRHZNSCxXQUFPRCxNQUFQO0FBSkQ7QUFNQyxXQUFPLE1BQVA7QUN5TUM7QURoTndCLENBQTNCOztBQVdBLElBQUdyUSxPQUFPdVEsUUFBVjtBQUNDblEsVUFBUW9RLG9CQUFSLEdBQStCLFVBQUNsUSxXQUFEO0FBQzlCLFFBQUEyTCxvQkFBQTtBQUFBQSwyQkFBdUIsRUFBdkI7O0FBQ0FwSixNQUFFZSxJQUFGLENBQU94RCxRQUFRa0ksT0FBZixFQUF3QixVQUFDa0UsY0FBRCxFQUFpQnJLLG1CQUFqQjtBQzBNcEIsYUR6TUhVLEVBQUVlLElBQUYsQ0FBTzRJLGVBQWU5SixNQUF0QixFQUE4QixVQUFDK04sYUFBRCxFQUFnQkMsa0JBQWhCO0FBQzdCLFlBQUdELGNBQWN2TixJQUFkLEtBQXNCLGVBQXRCLElBQTBDdU4sY0FBY2xOLFlBQXhELElBQXlFa04sY0FBY2xOLFlBQWQsS0FBOEJqRCxXQUExRztBQzBNTSxpQkR6TUwyTCxxQkFBcUI5SSxJQUFyQixDQUEwQmhCLG1CQUExQixDQ3lNSztBQUNEO0FENU1OLFFDeU1HO0FEMU1KOztBQUtBLFFBQUcvQixRQUFRSSxTQUFSLENBQWtCRixXQUFsQixFQUErQnFRLFlBQWxDO0FBQ0MxRSwyQkFBcUI5SSxJQUFyQixDQUEwQixXQUExQjtBQzRNRTs7QUQxTUgsV0FBTzhJLG9CQUFQO0FBVjhCLEdBQS9CO0FDdU5BLEM7Ozs7Ozs7Ozs7OztBQ243QkQ3TCxRQUFRd1EsVUFBUixHQUFxQixFQUFyQixDOzs7Ozs7Ozs7Ozs7QUNBQTVRLE9BQU82USxPQUFQLENBQ0M7QUFBQSwwQkFBd0IsVUFBQ3ZRLFdBQUQsRUFBY1csU0FBZCxFQUF5QjZQLFFBQXpCO0FBQ3ZCLFFBQUFDLHdCQUFBLEVBQUFDLHFCQUFBLEVBQUFDLEdBQUEsRUFBQXJNLE9BQUE7O0FBQUEsUUFBRyxDQUFDLEtBQUtvSCxNQUFUO0FBQ0MsYUFBTyxJQUFQO0FDRUU7O0FEQUgsUUFBRzFMLGdCQUFlLHNCQUFsQjtBQUNDO0FDRUU7O0FEREgsUUFBR0EsZUFBZ0JXLFNBQW5CO0FBQ0MsVUFBRyxDQUFDNlAsUUFBSjtBQUNDRyxjQUFNN1EsUUFBUThGLGFBQVIsQ0FBc0I1RixXQUF0QixFQUFtQzZGLE9BQW5DLENBQTJDO0FBQUMzRSxlQUFLUDtBQUFOLFNBQTNDLEVBQTZEO0FBQUN5QixrQkFBUTtBQUFDd08sbUJBQU87QUFBUjtBQUFULFNBQTdELENBQU47QUFDQUosbUJBQUFHLE9BQUEsT0FBV0EsSUFBS0MsS0FBaEIsR0FBZ0IsTUFBaEI7QUNTRzs7QURQSkgsaUNBQTJCM1EsUUFBUThGLGFBQVIsQ0FBc0Isc0JBQXRCLENBQTNCO0FBQ0F0QixnQkFBVTtBQUFFZ0osZUFBTyxLQUFLNUIsTUFBZDtBQUFzQmtGLGVBQU9KLFFBQTdCO0FBQXVDLG9CQUFZeFEsV0FBbkQ7QUFBZ0Usc0JBQWMsQ0FBQ1csU0FBRDtBQUE5RSxPQUFWO0FBQ0ErUCw4QkFBd0JELHlCQUF5QjVLLE9BQXpCLENBQWlDdkIsT0FBakMsQ0FBeEI7O0FBQ0EsVUFBR29NLHFCQUFIO0FBQ0NELGlDQUF5QkksTUFBekIsQ0FDQ0gsc0JBQXNCeFAsR0FEdkIsRUFFQztBQUNDNFAsZ0JBQU07QUFDTEMsbUJBQU87QUFERixXQURQO0FBSUNDLGdCQUFNO0FBQ0xDLHNCQUFVLElBQUlDLElBQUosRUFETDtBQUVMQyx5QkFBYSxLQUFLekY7QUFGYjtBQUpQLFNBRkQ7QUFERDtBQWNDK0UsaUNBQXlCVyxNQUF6QixDQUNDO0FBQ0NsUSxlQUFLdVAseUJBQXlCWSxVQUF6QixFQUROO0FBRUMvRCxpQkFBTyxLQUFLNUIsTUFGYjtBQUdDa0YsaUJBQU9KLFFBSFI7QUFJQ2xMLGtCQUFRO0FBQUNnTSxlQUFHdFIsV0FBSjtBQUFpQnVSLGlCQUFLLENBQUM1USxTQUFEO0FBQXRCLFdBSlQ7QUFLQ29RLGlCQUFPLENBTFI7QUFNQ1MsbUJBQVMsSUFBSU4sSUFBSixFQU5WO0FBT0NPLHNCQUFZLEtBQUsvRixNQVBsQjtBQVFDdUYsb0JBQVUsSUFBSUMsSUFBSixFQVJYO0FBU0NDLHVCQUFhLEtBQUt6RjtBQVRuQixTQUREO0FBdEJGO0FDK0NHO0FEckRKO0FBQUEsQ0FERCxFOzs7Ozs7Ozs7Ozs7QUVBQSxJQUFBZ0csc0JBQUEsRUFBQUMsZ0JBQUEsRUFBQUMsYUFBQTs7QUFBQUQsbUJBQW1CLFVBQUNGLFVBQUQsRUFBYWhHLE9BQWIsRUFBc0JvRyxRQUF0QixFQUFnQ0MsUUFBaEM7QUNHakIsU0RGRGhTLFFBQVFpUyxXQUFSLENBQW9CQyxvQkFBcEIsQ0FBeUNDLGFBQXpDLEdBQXlEQyxTQUF6RCxDQUFtRSxDQUNsRTtBQUFDQyxZQUFRO0FBQUNWLGtCQUFZQSxVQUFiO0FBQXlCYixhQUFPbkY7QUFBaEM7QUFBVCxHQURrRSxFQUVsRTtBQUFDMkcsWUFBUTtBQUFDbFIsV0FBSztBQUFDbEIscUJBQWEsV0FBZDtBQUEyQlcsbUJBQVcsYUFBdEM7QUFBcURpUSxlQUFPO0FBQTVELE9BQU47QUFBNkV5QixrQkFBWTtBQUFDQyxjQUFNO0FBQVA7QUFBekY7QUFBVCxHQUZrRSxFQUdsRTtBQUFDQyxXQUFPO0FBQUNGLGtCQUFZLENBQUM7QUFBZDtBQUFSLEdBSGtFLEVBSWxFO0FBQUNHLFlBQVE7QUFBVCxHQUprRSxDQUFuRSxFQUtHQyxPQUxILENBS1csVUFBQ0MsR0FBRCxFQUFNQyxJQUFOO0FBQ1YsUUFBR0QsR0FBSDtBQUNDLFlBQU0sSUFBSUUsS0FBSixDQUFVRixHQUFWLENBQU47QUNzQkU7O0FEcEJIQyxTQUFLblEsT0FBTCxDQUFhLFVBQUNtTyxHQUFEO0FDc0JULGFEckJIa0IsU0FBU2hQLElBQVQsQ0FBYzhOLElBQUl6UCxHQUFsQixDQ3FCRztBRHRCSjs7QUFHQSxRQUFHNFEsWUFBWXZQLEVBQUVzUSxVQUFGLENBQWFmLFFBQWIsQ0FBZjtBQUNDQTtBQ3NCRTtBRG5DSixJQ0VDO0FESGlCLENBQW5COztBQWtCQUoseUJBQXlCaFMsT0FBT29ULFNBQVAsQ0FBaUJuQixnQkFBakIsQ0FBekI7O0FBRUFDLGdCQUFnQixVQUFDaEIsS0FBRCxFQUFRNVEsV0FBUixFQUFvQjBMLE1BQXBCLEVBQTRCcUgsVUFBNUI7QUFDZixNQUFBN1EsT0FBQSxFQUFBOFEsa0JBQUEsRUFBQUMsZ0JBQUEsRUFBQU4sSUFBQSxFQUFBdlEsTUFBQSxFQUFBOFEsS0FBQSxFQUFBQyxTQUFBLEVBQUFDLE9BQUEsRUFBQUMsZUFBQTs7QUFBQVYsU0FBTyxJQUFJMUksS0FBSixFQUFQOztBQUVBLE1BQUc4SSxVQUFIO0FBRUM3USxjQUFVcEMsUUFBUUksU0FBUixDQUFrQkYsV0FBbEIsQ0FBVjtBQUVBZ1QseUJBQXFCbFQsUUFBUThGLGFBQVIsQ0FBc0I1RixXQUF0QixDQUFyQjtBQUNBaVQsdUJBQUEvUSxXQUFBLE9BQW1CQSxRQUFTOEQsY0FBNUIsR0FBNEIsTUFBNUI7O0FBQ0EsUUFBRzlELFdBQVc4USxrQkFBWCxJQUFpQ0MsZ0JBQXBDO0FBQ0NDLGNBQVEsRUFBUjtBQUNBRyx3QkFBa0JOLFdBQVdPLEtBQVgsQ0FBaUIsR0FBakIsQ0FBbEI7QUFDQUgsa0JBQVksRUFBWjtBQUNBRSxzQkFBZ0I3USxPQUFoQixDQUF3QixVQUFDK1EsT0FBRDtBQUN2QixZQUFBQyxRQUFBO0FBQUFBLG1CQUFXLEVBQVg7QUFDQUEsaUJBQVNQLGdCQUFULElBQTZCO0FBQUNRLGtCQUFRRixRQUFRRyxJQUFSO0FBQVQsU0FBN0I7QUN3QkksZUR2QkpQLFVBQVV0USxJQUFWLENBQWUyUSxRQUFmLENDdUJJO0FEMUJMO0FBS0FOLFlBQU1TLElBQU4sR0FBYVIsU0FBYjtBQUNBRCxZQUFNdEMsS0FBTixHQUFjO0FBQUNnRCxhQUFLLENBQUNoRCxLQUFEO0FBQU4sT0FBZDtBQUVBeE8sZUFBUztBQUFDbEIsYUFBSztBQUFOLE9BQVQ7QUFDQWtCLGFBQU82USxnQkFBUCxJQUEyQixDQUEzQjtBQUVBRyxnQkFBVUosbUJBQW1CL04sSUFBbkIsQ0FBd0JpTyxLQUF4QixFQUErQjtBQUFDOVEsZ0JBQVFBLE1BQVQ7QUFBaUI2RixjQUFNO0FBQUNnSixvQkFBVTtBQUFYLFNBQXZCO0FBQXNDNEMsZUFBTztBQUE3QyxPQUEvQixDQUFWO0FBRUFULGNBQVE1USxPQUFSLENBQWdCLFVBQUM4QyxNQUFEO0FDK0JYLGVEOUJKcU4sS0FBSzlQLElBQUwsQ0FBVTtBQUFDM0IsZUFBS29FLE9BQU9wRSxHQUFiO0FBQWtCNFMsaUJBQU94TyxPQUFPMk4sZ0JBQVAsQ0FBekI7QUFBbURjLHdCQUFjL1Q7QUFBakUsU0FBVixDQzhCSTtBRC9CTDtBQXZCRjtBQzZERTs7QURuQ0YsU0FBTzJTLElBQVA7QUE3QmUsQ0FBaEI7O0FBK0JBalQsT0FBTzZRLE9BQVAsQ0FDQztBQUFBLDBCQUF3QixVQUFDOUUsT0FBRDtBQUN2QixRQUFBa0gsSUFBQSxFQUFBUyxPQUFBO0FBQUFULFdBQU8sSUFBSTFJLEtBQUosRUFBUDtBQUNBbUosY0FBVSxJQUFJbkosS0FBSixFQUFWO0FBQ0F5SCwyQkFBdUIsS0FBS2hHLE1BQTVCLEVBQW9DRCxPQUFwQyxFQUE2QzJILE9BQTdDO0FBQ0FBLFlBQVE1USxPQUFSLENBQWdCLFVBQUM0SyxJQUFEO0FBQ2YsVUFBQWhMLE1BQUEsRUFBQWtELE1BQUEsRUFBQTBPLGFBQUEsRUFBQUMsd0JBQUE7QUFBQUQsc0JBQWdCbFUsUUFBUUksU0FBUixDQUFrQmtOLEtBQUtwTixXQUF2QixFQUFvQ29OLEtBQUt3RCxLQUF6QyxDQUFoQjs7QUFFQSxVQUFHLENBQUNvRCxhQUFKO0FBQ0M7QUN1Q0c7O0FEckNKQyxpQ0FBMkJuVSxRQUFROEYsYUFBUixDQUFzQndILEtBQUtwTixXQUEzQixFQUF3Q29OLEtBQUt3RCxLQUE3QyxDQUEzQjs7QUFFQSxVQUFHb0QsaUJBQWlCQyx3QkFBcEI7QUFDQzdSLGlCQUFTO0FBQUNsQixlQUFLO0FBQU4sU0FBVDtBQUVBa0IsZUFBTzRSLGNBQWNoTyxjQUFyQixJQUF1QyxDQUF2QztBQUVBVixpQkFBUzJPLHlCQUF5QnBPLE9BQXpCLENBQWlDdUgsS0FBS3pNLFNBQUwsQ0FBZSxDQUFmLENBQWpDLEVBQW9EO0FBQUN5QixrQkFBUUE7QUFBVCxTQUFwRCxDQUFUOztBQUNBLFlBQUdrRCxNQUFIO0FDd0NNLGlCRHZDTHFOLEtBQUs5UCxJQUFMLENBQVU7QUFBQzNCLGlCQUFLb0UsT0FBT3BFLEdBQWI7QUFBa0I0UyxtQkFBT3hPLE9BQU8wTyxjQUFjaE8sY0FBckIsQ0FBekI7QUFBK0QrTiwwQkFBYzNHLEtBQUtwTjtBQUFsRixXQUFWLENDdUNLO0FEOUNQO0FDb0RJO0FENURMO0FBaUJBLFdBQU8yUyxJQUFQO0FBckJEO0FBdUJBLDBCQUF3QixVQUFDNUksT0FBRDtBQUN2QixRQUFBNEksSUFBQSxFQUFBSSxVQUFBLEVBQUFtQixJQUFBLEVBQUF0RCxLQUFBO0FBQUFzRCxXQUFPLElBQVA7QUFFQXZCLFdBQU8sSUFBSTFJLEtBQUosRUFBUDtBQUVBOEksaUJBQWFoSixRQUFRZ0osVUFBckI7QUFDQW5DLFlBQVE3RyxRQUFRNkcsS0FBaEI7O0FBRUFyTyxNQUFFQyxPQUFGLENBQVUxQyxRQUFRcVUsYUFBbEIsRUFBaUMsVUFBQ2pTLE9BQUQsRUFBVTJCLElBQVY7QUFDaEMsVUFBQXVRLGFBQUE7O0FBQUEsVUFBR2xTLFFBQVFtUyxhQUFYO0FBQ0NELHdCQUFnQnhDLGNBQWNoQixLQUFkLEVBQXFCMU8sUUFBUTJCLElBQTdCLEVBQW1DcVEsS0FBS3hJLE1BQXhDLEVBQWdEcUgsVUFBaEQsQ0FBaEI7QUM2Q0ksZUQ1Q0pKLE9BQU9BLEtBQUtuSyxNQUFMLENBQVk0TCxhQUFaLENDNENIO0FBQ0Q7QURoREw7O0FBS0EsV0FBT3pCLElBQVA7QUFwQ0Q7QUFBQSxDQURELEU7Ozs7Ozs7Ozs7OztBRW5EQWpULE9BQU82USxPQUFQLENBQ0k7QUFBQStELGtCQUFnQixVQUFDQyxXQUFELEVBQWNqUSxPQUFkLEVBQXVCa1EsWUFBdkIsRUFBcUN0SixZQUFyQztBQ0NoQixXREFJcEwsUUFBUWlTLFdBQVIsQ0FBb0IwQyxnQkFBcEIsQ0FBcUNDLE1BQXJDLENBQTRDN0QsTUFBNUMsQ0FBbUQ7QUFBQzNQLFdBQUtxVDtBQUFOLEtBQW5ELEVBQXVFO0FBQUN2RCxZQUFNO0FBQUMxTSxpQkFBU0EsT0FBVjtBQUFtQmtRLHNCQUFjQSxZQUFqQztBQUErQ3RKLHNCQUFjQTtBQUE3RDtBQUFQLEtBQXZFLENDQUo7QUREQTtBQUdBeUosa0JBQWdCLFVBQUNKLFdBQUQsRUFBY0ssT0FBZDtBQUNaQyxVQUFNRCxPQUFOLEVBQWUzSyxLQUFmOztBQUVBLFFBQUcySyxRQUFRcFEsTUFBUixHQUFpQixDQUFwQjtBQUNJLFlBQU0sSUFBSTlFLE9BQU9rVCxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLHNDQUF0QixDQUFOO0FDUVA7O0FBQ0QsV0RSSTlTLFFBQVFpUyxXQUFSLENBQW9CMEMsZ0JBQXBCLENBQXFDNUQsTUFBckMsQ0FBNEM7QUFBQzNQLFdBQUtxVDtBQUFOLEtBQTVDLEVBQWdFO0FBQUN2RCxZQUFNO0FBQUM0RCxpQkFBU0E7QUFBVjtBQUFQLEtBQWhFLENDUUo7QURoQkE7QUFBQSxDQURKLEU7Ozs7Ozs7Ozs7OztBRUFBbFYsT0FBTzZRLE9BQVAsQ0FDQztBQUFBLGlCQUFlLFVBQUN4RyxPQUFEO0FBQ2QsUUFBQStLLGNBQUEsRUFBQUMsTUFBQSxFQUFBM1MsTUFBQSxFQUFBNFMsWUFBQSxFQUFBUixZQUFBLEVBQUFsUSxPQUFBLEVBQUF3TCxZQUFBLEVBQUE5UCxXQUFBLEVBQUFDLEdBQUEsRUFBQThQLE1BQUEsRUFBQS9GLFFBQUEsRUFBQTRHLEtBQUEsRUFBQWxGLE1BQUE7QUFBQW1KLFVBQU05SyxPQUFOLEVBQWV2QyxNQUFmO0FBQ0FvSixZQUFRN0csUUFBUTZHLEtBQWhCO0FBQ0F4TyxhQUFTMkgsUUFBUTNILE1BQWpCO0FBQ0FwQyxrQkFBYytKLFFBQVEvSixXQUF0QjtBQUNBd1UsbUJBQWV6SyxRQUFReUssWUFBdkI7QUFDQWxRLGNBQVV5RixRQUFRekYsT0FBbEI7QUFDQTBRLG1CQUFlLEVBQWY7QUFDQUYscUJBQWlCLEVBQWpCO0FBQ0FoRixtQkFBQSxDQUFBN1AsTUFBQUgsUUFBQUksU0FBQSxDQUFBRixXQUFBLGFBQUFDLElBQStDbUMsTUFBL0MsR0FBK0MsTUFBL0M7O0FBQ0FHLE1BQUVlLElBQUYsQ0FBT2xCLE1BQVAsRUFBZSxVQUFDZ0wsSUFBRCxFQUFPcEUsS0FBUDtBQUNkLFVBQUFpTSxRQUFBLEVBQUFwUixJQUFBLEVBQUFxUixXQUFBLEVBQUFDLE1BQUE7QUFBQUEsZUFBUy9ILEtBQUtrRyxLQUFMLENBQVcsR0FBWCxDQUFUO0FBQ0F6UCxhQUFPc1IsT0FBTyxDQUFQLENBQVA7QUFDQUQsb0JBQWNwRixhQUFhak0sSUFBYixDQUFkOztBQUNBLFVBQUdzUixPQUFPM1EsTUFBUCxHQUFnQixDQUFoQixJQUFzQjBRLFdBQXpCO0FBQ0NELG1CQUFXN0gsS0FBSy9ELE9BQUwsQ0FBYXhGLE9BQU8sR0FBcEIsRUFBeUIsRUFBekIsQ0FBWDtBQUNBaVIsdUJBQWVqUyxJQUFmLENBQW9CO0FBQUNnQixnQkFBTUEsSUFBUDtBQUFhb1Isb0JBQVVBLFFBQXZCO0FBQWlDdlEsaUJBQU93UTtBQUF4QyxTQUFwQjtBQ09HOztBQUNELGFEUEhGLGFBQWFuUixJQUFiLElBQXFCLENDT2xCO0FEZEo7O0FBU0FtRyxlQUFXLEVBQVg7QUFDQTBCLGFBQVMsS0FBS0EsTUFBZDtBQUNBMUIsYUFBUzRHLEtBQVQsR0FBaUJBLEtBQWpCOztBQUNBLFFBQUc0RCxpQkFBZ0IsUUFBbkI7QUFDQ3hLLGVBQVM0RyxLQUFULEdBQ0M7QUFBQWdELGFBQUssQ0FBQyxJQUFELEVBQU1oRCxLQUFOO0FBQUwsT0FERDtBQURELFdBR0ssSUFBRzRELGlCQUFnQixNQUFuQjtBQUNKeEssZUFBU3NELEtBQVQsR0FBaUI1QixNQUFqQjtBQ1NFOztBRFBILFFBQUc1TCxRQUFRc1YsYUFBUixDQUFzQnhFLEtBQXRCLEtBQWdDOVEsUUFBUXVWLFlBQVIsQ0FBcUJ6RSxLQUFyQixFQUE0QixLQUFDbEYsTUFBN0IsQ0FBbkM7QUFDQyxhQUFPMUIsU0FBUzRHLEtBQWhCO0FDU0U7O0FEUEgsUUFBR3RNLFdBQVlBLFFBQVFFLE1BQVIsR0FBaUIsQ0FBaEM7QUFDQ3dGLGVBQVMsTUFBVCxJQUFtQjFGLE9BQW5CO0FDU0U7O0FEUEh5USxhQUFTalYsUUFBUThGLGFBQVIsQ0FBc0I1RixXQUF0QixFQUFtQ2lGLElBQW5DLENBQXdDK0UsUUFBeEMsRUFBa0Q7QUFBQzVILGNBQVE0UyxZQUFUO0FBQXVCTSxZQUFNLENBQTdCO0FBQWdDekIsYUFBTztBQUF2QyxLQUFsRCxDQUFUO0FBR0E5RCxhQUFTZ0YsT0FBT1EsS0FBUCxFQUFUOztBQUNBLFFBQUdULGVBQWV0USxNQUFsQjtBQUNDdUwsZUFBU0EsT0FBTzdHLEdBQVAsQ0FBVyxVQUFDa0UsSUFBRCxFQUFNcEUsS0FBTjtBQUNuQnpHLFVBQUVlLElBQUYsQ0FBT3dSLGNBQVAsRUFBdUIsVUFBQ1UsaUJBQUQsRUFBb0J4TSxLQUFwQjtBQUN0QixjQUFBeU0sb0JBQUEsRUFBQUMsT0FBQSxFQUFBQyxTQUFBLEVBQUFwUSxJQUFBLEVBQUFxUSxhQUFBLEVBQUEzUyxZQUFBLEVBQUFMLElBQUE7QUFBQThTLG9CQUFVRixrQkFBa0IzUixJQUFsQixHQUF5QixLQUF6QixHQUFpQzJSLGtCQUFrQlAsUUFBbEIsQ0FBMkI1TCxPQUEzQixDQUFtQyxLQUFuQyxFQUEwQyxLQUExQyxDQUEzQztBQUNBc00sc0JBQVl2SSxLQUFLb0ksa0JBQWtCM1IsSUFBdkIsQ0FBWjtBQUNBakIsaUJBQU80UyxrQkFBa0I5USxLQUFsQixDQUF3QjlCLElBQS9COztBQUNBLGNBQUcsQ0FBQyxRQUFELEVBQVcsZUFBWCxFQUE0QnVCLE9BQTVCLENBQW9DdkIsSUFBcEMsSUFBNEMsQ0FBQyxDQUFoRDtBQUNDSywyQkFBZXVTLGtCQUFrQjlRLEtBQWxCLENBQXdCekIsWUFBdkM7QUFDQXdTLG1DQUF1QixFQUF2QjtBQUNBQSxpQ0FBcUJELGtCQUFrQlAsUUFBdkMsSUFBbUQsQ0FBbkQ7QUFDQVcsNEJBQWdCOVYsUUFBUThGLGFBQVIsQ0FBc0IzQyxZQUF0QixFQUFvQzRDLE9BQXBDLENBQTRDO0FBQUMzRSxtQkFBS3lVO0FBQU4sYUFBNUMsRUFBOEQ7QUFBQXZULHNCQUFRcVQ7QUFBUixhQUE5RCxDQUFoQjs7QUFDQSxnQkFBR0csYUFBSDtBQUNDeEksbUJBQUtzSSxPQUFMLElBQWdCRSxjQUFjSixrQkFBa0JQLFFBQWhDLENBQWhCO0FBTkY7QUFBQSxpQkFPSyxJQUFHclMsU0FBUSxRQUFYO0FBQ0ptSCxzQkFBVXlMLGtCQUFrQjlRLEtBQWxCLENBQXdCcUYsT0FBbEM7QUFDQXFELGlCQUFLc0ksT0FBTCxNQUFBblEsT0FBQWhELEVBQUFxQyxTQUFBLENBQUFtRixPQUFBO0FDaUJRaEgscUJBQU80UztBRGpCZixtQkNrQmEsSURsQmIsR0NrQm9CcFEsS0RsQnNDekMsS0FBMUQsR0FBMEQsTUFBMUQsS0FBbUU2UyxTQUFuRTtBQUZJO0FBSUp2SSxpQkFBS3NJLE9BQUwsSUFBZ0JDLFNBQWhCO0FDbUJLOztBRGxCTixlQUFPdkksS0FBS3NJLE9BQUwsQ0FBUDtBQ29CTyxtQkRuQk50SSxLQUFLc0ksT0FBTCxJQUFnQixJQ21CVjtBQUNEO0FEckNQOztBQWtCQSxlQUFPdEksSUFBUDtBQW5CUSxRQUFUO0FBb0JBLGFBQU8yQyxNQUFQO0FBckJEO0FBdUJDLGFBQU9BLE1BQVA7QUN1QkU7QURwRko7QUFBQSxDQURELEU7Ozs7Ozs7Ozs7OztBRUFBOzs7Ozs7OztHQVVBclEsT0FBTzZRLE9BQVAsQ0FDSTtBQUFBLDJCQUF5QixVQUFDdlEsV0FBRCxFQUFjYyxZQUFkLEVBQTRCbUgsSUFBNUI7QUFDckIsUUFBQTBJLEdBQUEsRUFBQTNKLEdBQUEsRUFBQTZPLE9BQUEsRUFBQW5LLE1BQUE7QUFBQUEsYUFBUyxLQUFLQSxNQUFkO0FBQ0FtSyxjQUFVL1YsUUFBUWlTLFdBQVIsQ0FBb0JwUyxRQUFwQixDQUE2QmtHLE9BQTdCLENBQXFDO0FBQUM3RixtQkFBYUEsV0FBZDtBQUEyQlcsaUJBQVcsa0JBQXRDO0FBQTBEMk0sYUFBTzVCO0FBQWpFLEtBQXJDLENBQVY7O0FBQ0EsUUFBR21LLE9BQUg7QUNNRixhRExNL1YsUUFBUWlTLFdBQVIsQ0FBb0JwUyxRQUFwQixDQUE2QmtSLE1BQTdCLENBQW9DO0FBQUMzUCxhQUFLMlUsUUFBUTNVO0FBQWQsT0FBcEMsRUFBd0Q7QUFBQzhQLGVDUzNEaEssTURUaUUsRUNTakUsRUFDQUEsSURWa0UsY0FBWWxHLFlBQVosR0FBeUIsT0NVM0YsSURWbUdtSCxJQ1NuRyxFQUVBakIsR0RYMkQ7QUFBRCxPQUF4RCxDQ0tOO0FETkU7QUFHSTJKLFlBQ0k7QUFBQS9OLGNBQU0sTUFBTjtBQUNBNUMscUJBQWFBLFdBRGI7QUFFQVcsbUJBQVcsa0JBRlg7QUFHQWhCLGtCQUFVLEVBSFY7QUFJQTJOLGVBQU81QjtBQUpQLE9BREo7QUFPQWlGLFVBQUloUixRQUFKLENBQWFtQixZQUFiLElBQTZCLEVBQTdCO0FBQ0E2UCxVQUFJaFIsUUFBSixDQUFhbUIsWUFBYixFQUEyQm1ILElBQTNCLEdBQWtDQSxJQUFsQztBQ2NOLGFEWk1uSSxRQUFRaVMsV0FBUixDQUFvQnBTLFFBQXBCLENBQTZCeVIsTUFBN0IsQ0FBb0NULEdBQXBDLENDWU47QUFDRDtBRDdCRDtBQWtCQSxtQ0FBaUMsVUFBQzNRLFdBQUQsRUFBY2MsWUFBZCxFQUE0QmdWLFlBQTVCO0FBQzdCLFFBQUFuRixHQUFBLEVBQUEzSixHQUFBLEVBQUE2TyxPQUFBLEVBQUFuSyxNQUFBO0FBQUFBLGFBQVMsS0FBS0EsTUFBZDtBQUNBbUssY0FBVS9WLFFBQVFpUyxXQUFSLENBQW9CcFMsUUFBcEIsQ0FBNkJrRyxPQUE3QixDQUFxQztBQUFDN0YsbUJBQWFBLFdBQWQ7QUFBMkJXLGlCQUFXLGtCQUF0QztBQUEwRDJNLGFBQU81QjtBQUFqRSxLQUFyQyxDQUFWOztBQUNBLFFBQUdtSyxPQUFIO0FDbUJGLGFEbEJNL1YsUUFBUWlTLFdBQVIsQ0FBb0JwUyxRQUFwQixDQUE2QmtSLE1BQTdCLENBQW9DO0FBQUMzUCxhQUFLMlUsUUFBUTNVO0FBQWQsT0FBcEMsRUFBd0Q7QUFBQzhQLGVDc0IzRGhLLE1EdEJpRSxFQ3NCakUsRUFDQUEsSUR2QmtFLGNBQVlsRyxZQUFaLEdBQXlCLGVDdUIzRixJRHZCMkdnVixZQ3NCM0csRUFFQTlPLEdEeEIyRDtBQUFELE9BQXhELENDa0JOO0FEbkJFO0FBR0kySixZQUNJO0FBQUEvTixjQUFNLE1BQU47QUFDQTVDLHFCQUFhQSxXQURiO0FBRUFXLG1CQUFXLGtCQUZYO0FBR0FoQixrQkFBVSxFQUhWO0FBSUEyTixlQUFPNUI7QUFKUCxPQURKO0FBT0FpRixVQUFJaFIsUUFBSixDQUFhbUIsWUFBYixJQUE2QixFQUE3QjtBQUNBNlAsVUFBSWhSLFFBQUosQ0FBYW1CLFlBQWIsRUFBMkJnVixZQUEzQixHQUEwQ0EsWUFBMUM7QUMyQk4sYUR6Qk1oVyxRQUFRaVMsV0FBUixDQUFvQnBTLFFBQXBCLENBQTZCeVIsTUFBN0IsQ0FBb0NULEdBQXBDLENDeUJOO0FBQ0Q7QUQ1REQ7QUFvQ0EsbUJBQWlCLFVBQUMzUSxXQUFELEVBQWNjLFlBQWQsRUFBNEJnVixZQUE1QixFQUEwQzdOLElBQTFDO0FBQ2IsUUFBQTBJLEdBQUEsRUFBQTNKLEdBQUEsRUFBQStPLElBQUEsRUFBQTlWLEdBQUEsRUFBQXNGLElBQUEsRUFBQXNRLE9BQUEsRUFBQW5LLE1BQUE7QUFBQUEsYUFBUyxLQUFLQSxNQUFkO0FBQ0FtSyxjQUFVL1YsUUFBUWlTLFdBQVIsQ0FBb0JwUyxRQUFwQixDQUE2QmtHLE9BQTdCLENBQXFDO0FBQUM3RixtQkFBYUEsV0FBZDtBQUEyQlcsaUJBQVcsa0JBQXRDO0FBQTBEMk0sYUFBTzVCO0FBQWpFLEtBQXJDLENBQVY7O0FBQ0EsUUFBR21LLE9BQUg7QUFFSUMsbUJBQWFFLFdBQWIsS0FBQS9WLE1BQUE0VixRQUFBbFcsUUFBQSxNQUFBbUIsWUFBQSxjQUFBeUUsT0FBQXRGLElBQUE2VixZQUFBLFlBQUF2USxLQUFpRnlRLFdBQWpGLEdBQWlGLE1BQWpGLEdBQWlGLE1BQWpGLE1BQWdHLEVBQWhHLEdBQXdHLEVBQXhHLEdBQWdILEVBQWhIOztBQUNBLFVBQUcvTixJQUFIO0FDK0JKLGVEOUJRbkksUUFBUWlTLFdBQVIsQ0FBb0JwUyxRQUFwQixDQUE2QmtSLE1BQTdCLENBQW9DO0FBQUMzUCxlQUFLMlUsUUFBUTNVO0FBQWQsU0FBcEMsRUFBd0Q7QUFBQzhQLGlCQ2tDN0RoSyxNRGxDbUUsRUNrQ25FLEVBQ0FBLElEbkNvRSxjQUFZbEcsWUFBWixHQUF5QixPQ21DN0YsSURuQ3FHbUgsSUNrQ3JHLEVBRUFqQixJRHBDMkcsY0FBWWxHLFlBQVosR0FBeUIsZUNvQ3BJLElEcENvSmdWLFlDa0NwSixFQUdBOU8sR0RyQzZEO0FBQUQsU0FBeEQsQ0M4QlI7QUQvQkk7QUMwQ0osZUR2Q1FsSCxRQUFRaVMsV0FBUixDQUFvQnBTLFFBQXBCLENBQTZCa1IsTUFBN0IsQ0FBb0M7QUFBQzNQLGVBQUsyVSxRQUFRM1U7QUFBZCxTQUFwQyxFQUF3RDtBQUFDOFAsaUJDMkM3RCtFLE9EM0NtRSxFQzJDbkUsRUFDQUEsS0Q1Q29FLGNBQVlqVixZQUFaLEdBQXlCLGVDNEM3RixJRDVDNkdnVixZQzJDN0csRUFFQUMsSUQ3QzZEO0FBQUQsU0FBeEQsQ0N1Q1I7QUQ3Q0E7QUFBQTtBQVFJcEYsWUFDSTtBQUFBL04sY0FBTSxNQUFOO0FBQ0E1QyxxQkFBYUEsV0FEYjtBQUVBVyxtQkFBVyxrQkFGWDtBQUdBaEIsa0JBQVUsRUFIVjtBQUlBMk4sZUFBTzVCO0FBSlAsT0FESjtBQU9BaUYsVUFBSWhSLFFBQUosQ0FBYW1CLFlBQWIsSUFBNkIsRUFBN0I7QUFDQTZQLFVBQUloUixRQUFKLENBQWFtQixZQUFiLEVBQTJCZ1YsWUFBM0IsR0FBMENBLFlBQTFDO0FBQ0FuRixVQUFJaFIsUUFBSixDQUFhbUIsWUFBYixFQUEyQm1ILElBQTNCLEdBQWtDQSxJQUFsQztBQ2lETixhRC9DTW5JLFFBQVFpUyxXQUFSLENBQW9CcFMsUUFBcEIsQ0FBNkJ5UixNQUE3QixDQUFvQ1QsR0FBcEMsQ0MrQ047QUFDRDtBRDFHRDtBQUFBLENBREosRTs7Ozs7Ozs7Ozs7O0FFVkEsSUFBQXNGLGNBQUEsRUFBQUMsZUFBQSxFQUFBQyxhQUFBLEVBQUFDLEVBQUEsRUFBQUMsTUFBQSxFQUFBNVcsTUFBQSxFQUFBNlcsSUFBQSxFQUFBQyxNQUFBOztBQUFBQSxTQUFTMUwsUUFBUSxRQUFSLENBQVQ7QUFDQXVMLEtBQUt2TCxRQUFRLElBQVIsQ0FBTDtBQUNBeUwsT0FBT3pMLFFBQVEsTUFBUixDQUFQO0FBQ0FwTCxTQUFTb0wsUUFBUSxRQUFSLENBQVQ7QUFFQXdMLFNBQVMsSUFBSUcsTUFBSixDQUFXLGVBQVgsQ0FBVDs7QUFFQUwsZ0JBQWdCLFVBQUNNLE9BQUQsRUFBU0MsT0FBVDtBQUVmLE1BQUFDLE9BQUEsRUFBQUMsR0FBQSxFQUFBQyxXQUFBLEVBQUFDLFFBQUEsRUFBQUMsUUFBQSxFQUFBQyxLQUFBLEVBQUFDLEdBQUEsRUFBQUMsTUFBQSxFQUFBQyxHQUFBLEVBQUFDLElBQUE7QUFBQVQsWUFBVSxJQUFJSixPQUFPYyxPQUFYLEVBQVY7QUFDQUYsUUFBTVIsUUFBUVcsV0FBUixDQUFvQmIsT0FBcEIsQ0FBTjtBQUdBUyxXQUFTLElBQUlLLE1BQUosQ0FBV0osR0FBWCxDQUFUO0FBR0FGLFFBQU0sSUFBSS9GLElBQUosRUFBTjtBQUNBa0csU0FBT0gsSUFBSU8sV0FBSixFQUFQO0FBQ0FSLFVBQVFDLElBQUlRLFFBQUosS0FBaUIsQ0FBekI7QUFDQWIsUUFBTUssSUFBSVMsT0FBSixFQUFOO0FBR0FYLGFBQVdULEtBQUtxQixJQUFMLENBQVVDLHFCQUFxQkMsU0FBL0IsRUFBeUMscUJBQXFCVCxJQUFyQixHQUE0QixHQUE1QixHQUFrQ0osS0FBbEMsR0FBMEMsR0FBMUMsR0FBZ0RKLEdBQWhELEdBQXNELEdBQXRELEdBQTRERixPQUFyRyxDQUFYO0FBQ0FJLGFBQUEsQ0FBQUwsV0FBQSxPQUFXQSxRQUFTdlYsR0FBcEIsR0FBb0IsTUFBcEIsSUFBMEIsTUFBMUI7QUFDQTJWLGdCQUFjUCxLQUFLcUIsSUFBTCxDQUFVWixRQUFWLEVBQW9CRCxRQUFwQixDQUFkOztBQUVBLE1BQUcsQ0FBQ1YsR0FBRzBCLFVBQUgsQ0FBY2YsUUFBZCxDQUFKO0FBQ0N0WCxXQUFPc1ksSUFBUCxDQUFZaEIsUUFBWjtBQ0RDOztBRElGWCxLQUFHNEIsU0FBSCxDQUFhbkIsV0FBYixFQUEwQkssTUFBMUIsRUFBa0MsVUFBQ3hFLEdBQUQ7QUFDakMsUUFBR0EsR0FBSDtBQ0ZJLGFER0gyRCxPQUFPM00sS0FBUCxDQUFnQitNLFFBQVF2VixHQUFSLEdBQVksV0FBNUIsRUFBdUN3UixHQUF2QyxDQ0hHO0FBQ0Q7QURBSjtBQUlBLFNBQU9xRSxRQUFQO0FBM0JlLENBQWhCOztBQStCQWQsaUJBQWlCLFVBQUNqUCxHQUFELEVBQUswUCxPQUFMO0FBRWhCLE1BQUFELE9BQUEsRUFBQXdCLE9BQUEsRUFBQUMsT0FBQSxFQUFBQyxVQUFBLEVBQUFDLFNBQUEsRUFBQW5ZLEdBQUE7QUFBQXdXLFlBQVUsRUFBVjtBQUVBMkIsY0FBQSxPQUFBdFksT0FBQSxvQkFBQUEsWUFBQSxRQUFBRyxNQUFBSCxRQUFBSSxTQUFBLENBQUF3VyxPQUFBLGFBQUF6VyxJQUF5Q21DLE1BQXpDLEdBQXlDLE1BQXpDLEdBQXlDLE1BQXpDOztBQUVBK1YsZUFBYSxVQUFDRSxVQUFEO0FDSlYsV0RLRjVCLFFBQVE0QixVQUFSLElBQXNCclIsSUFBSXFSLFVBQUosS0FBbUIsRUNMdkM7QURJVSxHQUFiOztBQUdBSCxZQUFVLFVBQUNHLFVBQUQsRUFBWXpWLElBQVo7QUFDVCxRQUFBMFYsSUFBQSxFQUFBQyxPQUFBLEVBQUFDLE1BQUE7QUFBQUYsV0FBT3RSLElBQUlxUixVQUFKLENBQVA7O0FBQ0EsUUFBR3pWLFNBQVEsTUFBWDtBQUNDNFYsZUFBUyxZQUFUO0FBREQ7QUFHQ0EsZUFBUyxxQkFBVDtBQ0hFOztBRElILFFBQUdGLFFBQUEsUUFBVUUsVUFBQSxJQUFiO0FBQ0NELGdCQUFVRSxPQUFPSCxJQUFQLEVBQWFFLE1BQWIsQ0FBb0JBLE1BQXBCLENBQVY7QUNGRTs7QUFDRCxXREVGL0IsUUFBUTRCLFVBQVIsSUFBc0JFLFdBQVcsRUNGL0I7QUROTyxHQUFWOztBQVVBTixZQUFVLFVBQUNJLFVBQUQ7QUFDVCxRQUFHclIsSUFBSXFSLFVBQUosTUFBbUIsSUFBdEI7QUNESSxhREVINUIsUUFBUTRCLFVBQVIsSUFBc0IsR0NGbkI7QURDSixXQUVLLElBQUdyUixJQUFJcVIsVUFBSixNQUFtQixLQUF0QjtBQ0RELGFERUg1QixRQUFRNEIsVUFBUixJQUFzQixHQ0ZuQjtBRENDO0FDQ0QsYURFSDVCLFFBQVE0QixVQUFSLElBQXNCLEVDRm5CO0FBQ0Q7QURMTSxHQUFWOztBQVNBOVYsSUFBRWUsSUFBRixDQUFPOFUsU0FBUCxFQUFrQixVQUFDMVQsS0FBRCxFQUFRMlQsVUFBUjtBQUNqQixZQUFBM1QsU0FBQSxPQUFPQSxNQUFPOUIsSUFBZCxHQUFjLE1BQWQ7QUFBQSxXQUNNLE1BRE47QUFBQSxXQUNhLFVBRGI7QUNDTSxlREF1QnNWLFFBQVFHLFVBQVIsRUFBbUIzVCxNQUFNOUIsSUFBekIsQ0NBdkI7O0FERE4sV0FFTSxTQUZOO0FDR00sZUREZXFWLFFBQVFJLFVBQVIsQ0NDZjs7QURITjtBQ0tNLGVERkFGLFdBQVdFLFVBQVgsQ0NFQTtBRExOO0FBREQ7O0FBTUEsU0FBTzVCLE9BQVA7QUFsQ2dCLENBQWpCOztBQXFDQVAsa0JBQWtCLFVBQUNsUCxHQUFELEVBQUswUCxPQUFMO0FBRWpCLE1BQUFnQyxlQUFBLEVBQUE5TSxlQUFBO0FBQUFBLG9CQUFrQixFQUFsQjtBQUdBOE0sb0JBQUEsT0FBQTVZLE9BQUEsb0JBQUFBLFlBQUEsT0FBa0JBLFFBQVNvUSxvQkFBVCxDQUE4QndHLE9BQTlCLENBQWxCLEdBQWtCLE1BQWxCO0FBR0FnQyxrQkFBZ0JsVyxPQUFoQixDQUF3QixVQUFDbVcsY0FBRDtBQUV2QixRQUFBdlcsTUFBQSxFQUFBMlQsSUFBQSxFQUFBOVYsR0FBQSxFQUFBMlksaUJBQUEsRUFBQUMsaUJBQUEsRUFBQUMsZ0JBQUEsRUFBQTFJLGtCQUFBO0FBQUEwSSx1QkFBbUIsRUFBbkI7O0FBSUEsUUFBR0gsbUJBQWtCLFdBQXJCO0FBQ0N2SSwyQkFBcUIsWUFBckI7QUFERDtBQUlDaE8sZUFBQSxPQUFBdEMsT0FBQSxvQkFBQUEsWUFBQSxRQUFBRyxNQUFBSCxRQUFBa0ksT0FBQSxDQUFBMlEsY0FBQSxhQUFBMVksSUFBMkNtQyxNQUEzQyxHQUEyQyxNQUEzQyxHQUEyQyxNQUEzQztBQUVBZ08sMkJBQXFCLEVBQXJCOztBQUNBN04sUUFBRWUsSUFBRixDQUFPbEIsTUFBUCxFQUFlLFVBQUNzQyxLQUFELEVBQVEyVCxVQUFSO0FBQ2QsYUFBQTNULFNBQUEsT0FBR0EsTUFBT3pCLFlBQVYsR0FBVSxNQUFWLE1BQTBCeVQsT0FBMUI7QUNMTSxpQkRNTHRHLHFCQUFxQmlJLFVDTmhCO0FBQ0Q7QURHTjtBQ0RFOztBRE1ILFFBQUdqSSxrQkFBSDtBQUNDd0ksMEJBQW9COVksUUFBUThGLGFBQVIsQ0FBc0IrUyxjQUF0QixDQUFwQjtBQUVBRSwwQkFBb0JELGtCQUFrQjNULElBQWxCLEVDTGY4USxPREtzQyxFQ0x0QyxFQUNBQSxLREl1QyxLQUFHM0Ysa0JDSjFDLElESStEcEosSUFBSTlGLEdDTG5FLEVBRUE2VSxJREdlLEdBQTBEUixLQUExRCxFQUFwQjtBQUVBc0Qsd0JBQWtCclcsT0FBbEIsQ0FBMEIsVUFBQ3VXLFVBQUQ7QUFFekIsWUFBQUMsVUFBQTtBQUFBQSxxQkFBYS9DLGVBQWU4QyxVQUFmLEVBQTBCSixjQUExQixDQUFiO0FDRkksZURJSkcsaUJBQWlCalcsSUFBakIsQ0FBc0JtVyxVQUF0QixDQ0pJO0FEQUw7QUNFRTs7QUFDRCxXRElGcE4sZ0JBQWdCK00sY0FBaEIsSUFBa0NHLGdCQ0poQztBRDFCSDtBQWdDQSxTQUFPbE4sZUFBUDtBQXhDaUIsQ0FBbEI7O0FBMkNBOUwsUUFBUW1aLFVBQVIsR0FBcUIsVUFBQ3ZDLE9BQUQsRUFBVXdDLFVBQVY7QUFDcEIsTUFBQTdULFVBQUE7QUFBQWdSLFNBQU84QyxJQUFQLENBQVksd0JBQVo7QUFFQXhQLFVBQVF5UCxJQUFSLENBQWEsb0JBQWI7QUFNQS9ULGVBQWF2RixRQUFROEYsYUFBUixDQUFzQjhRLE9BQXRCLENBQWI7QUFFQXdDLGVBQWE3VCxXQUFXSixJQUFYLENBQWdCLEVBQWhCLEVBQW9Cc1EsS0FBcEIsRUFBYjtBQUVBMkQsYUFBVzFXLE9BQVgsQ0FBbUIsVUFBQzZXLFNBQUQ7QUFDbEIsUUFBQUwsVUFBQSxFQUFBakMsUUFBQSxFQUFBTixPQUFBLEVBQUE3SyxlQUFBO0FBQUE2SyxjQUFVLEVBQVY7QUFDQUEsWUFBUXZWLEdBQVIsR0FBY21ZLFVBQVVuWSxHQUF4QjtBQUdBOFgsaUJBQWEvQyxlQUFlb0QsU0FBZixFQUF5QjNDLE9BQXpCLENBQWI7QUFDQUQsWUFBUUMsT0FBUixJQUFtQnNDLFVBQW5CO0FBR0FwTixzQkFBa0JzSyxnQkFBZ0JtRCxTQUFoQixFQUEwQjNDLE9BQTFCLENBQWxCO0FBRUFELFlBQVEsaUJBQVIsSUFBNkI3SyxlQUE3QjtBQ2RFLFdEaUJGbUwsV0FBV1osY0FBY00sT0FBZCxFQUFzQkMsT0FBdEIsQ0NqQlQ7QURHSDtBQWdCQS9NLFVBQVEyUCxPQUFSLENBQWdCLG9CQUFoQjtBQUNBLFNBQU92QyxRQUFQO0FBOUJvQixDQUFyQixDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUV0SEFyWCxPQUFPNlEsT0FBUCxDQUNDO0FBQUFnSiwyQkFBeUIsVUFBQ3ZaLFdBQUQsRUFBYzZCLG1CQUFkLEVBQW1DdU8sa0JBQW5DLEVBQXVEelAsU0FBdkQsRUFBa0U4SyxPQUFsRTtBQUN4QixRQUFBeEUsV0FBQSxFQUFBdVMsZUFBQSxFQUFBeFAsUUFBQSxFQUFBMEIsTUFBQTtBQUFBQSxhQUFTLEtBQUtBLE1BQWQ7O0FBQ0EsUUFBRzdKLHdCQUF1QixzQkFBMUI7QUFDQ21JLGlCQUFXO0FBQUMsMEJBQWtCeUI7QUFBbkIsT0FBWDtBQUREO0FBR0N6QixpQkFBVztBQUFDNEcsZUFBT25GO0FBQVIsT0FBWDtBQ01FOztBREpILFFBQUc1Six3QkFBdUIsV0FBMUI7QUFFQ21JLGVBQVMsVUFBVCxJQUF1QmhLLFdBQXZCO0FBQ0FnSyxlQUFTLFlBQVQsSUFBeUIsQ0FBQ3JKLFNBQUQsQ0FBekI7QUFIRDtBQUtDcUosZUFBU29HLGtCQUFULElBQStCelAsU0FBL0I7QUNLRTs7QURISHNHLGtCQUFjbkgsUUFBUWtNLGNBQVIsQ0FBdUJuSyxtQkFBdkIsRUFBNEM0SixPQUE1QyxFQUFxREMsTUFBckQsQ0FBZDs7QUFDQSxRQUFHLENBQUN6RSxZQUFZd1MsY0FBYixJQUFnQ3hTLFlBQVlDLFNBQS9DO0FBQ0M4QyxlQUFTc0QsS0FBVCxHQUFpQjVCLE1BQWpCO0FDS0U7O0FESEg4TixzQkFBa0IxWixRQUFROEYsYUFBUixDQUFzQi9ELG1CQUF0QixFQUEyQ29ELElBQTNDLENBQWdEK0UsUUFBaEQsQ0FBbEI7QUFDQSxXQUFPd1AsZ0JBQWdCekksS0FBaEIsRUFBUDtBQW5CRDtBQUFBLENBREQsRTs7Ozs7Ozs7Ozs7O0FFQUFyUixPQUFPNlEsT0FBUCxDQUNDO0FBQUFtSix1QkFBcUIsVUFBQ0MsU0FBRCxFQUFZbE8sT0FBWjtBQUNwQixRQUFBbU8sV0FBQSxFQUFBQyxTQUFBO0FBQUFELGtCQUFjRSxHQUFHQyxLQUFILENBQVNsVSxPQUFULENBQWlCO0FBQUMzRSxXQUFLeVk7QUFBTixLQUFqQixFQUFtQzlWLElBQWpEO0FBQ0FnVyxnQkFBWUMsR0FBR0UsTUFBSCxDQUFVblUsT0FBVixDQUFrQjtBQUFDM0UsV0FBS3VLO0FBQU4sS0FBbEIsRUFBa0M1SCxJQUE5QztBQUVBLFdBQU87QUFBQ29XLGVBQVNMLFdBQVY7QUFBdUJoSixhQUFPaUo7QUFBOUIsS0FBUDtBQUpEO0FBTUFLLG1CQUFpQixVQUFDaFosR0FBRDtBQ1FkLFdEUEY0WSxHQUFHSyxXQUFILENBQWV6RixNQUFmLENBQXNCN0QsTUFBdEIsQ0FBNkI7QUFBQzNQLFdBQUtBO0FBQU4sS0FBN0IsRUFBd0M7QUFBQzhQLFlBQU07QUFBQ29KLHNCQUFjO0FBQWY7QUFBUCxLQUF4QyxDQ09FO0FEZEg7QUFTQUMsbUJBQWlCLFVBQUNuWixHQUFEO0FDY2QsV0RiRjRZLEdBQUdLLFdBQUgsQ0FBZXpGLE1BQWYsQ0FBc0I3RCxNQUF0QixDQUE2QjtBQUFDM1AsV0FBS0E7QUFBTixLQUE3QixFQUF3QztBQUFDOFAsWUFBTTtBQUFDb0osc0JBQWMsVUFBZjtBQUEyQkUsdUJBQWU7QUFBMUM7QUFBUCxLQUF4QyxDQ2FFO0FEdkJIO0FBQUEsQ0FERCxFOzs7Ozs7Ozs7Ozs7QUVBQTVhLE9BQU82YSxPQUFQLENBQWUsdUJBQWYsRUFBd0MsVUFBQ3ZhLFdBQUQsRUFBY3dhLEVBQWQsRUFBa0JoSyxRQUFsQjtBQUN2QyxNQUFBbkwsVUFBQTtBQUFBQSxlQUFhdkYsUUFBUThGLGFBQVIsQ0FBc0I1RixXQUF0QixFQUFtQ3dRLFFBQW5DLENBQWI7O0FBQ0EsTUFBR25MLFVBQUg7QUFDQyxXQUFPQSxXQUFXSixJQUFYLENBQWdCO0FBQUMvRCxXQUFLc1o7QUFBTixLQUFoQixDQUFQO0FDSUM7QURQSCxHOzs7Ozs7Ozs7Ozs7QUVBQTlhLE9BQU8rYSxnQkFBUCxDQUF3Qix3QkFBeEIsRUFBa0QsVUFBQ0MsU0FBRCxFQUFZbkosR0FBWixFQUFpQm5QLE1BQWpCLEVBQXlCcUosT0FBekI7QUFDakQsTUFBQWtQLE9BQUEsRUFBQTFMLEtBQUEsRUFBQS9NLE9BQUEsRUFBQTZSLFlBQUEsRUFBQXBCLElBQUEsRUFBQTlGLElBQUEsRUFBQStOLGlCQUFBLEVBQUFDLGdCQUFBLEVBQUEzRyxJQUFBOztBQUFBLE9BQU8sS0FBS3hJLE1BQVo7QUFDQyxXQUFPLEtBQUtvUCxLQUFMLEVBQVA7QUNFQzs7QURBRmpHLFFBQU02RixTQUFOLEVBQWlCSyxNQUFqQjtBQUNBbEcsUUFBTXRELEdBQU4sRUFBV3RILEtBQVg7QUFDQTRLLFFBQU16UyxNQUFOLEVBQWM0WSxNQUFNQyxRQUFOLENBQWV6VCxNQUFmLENBQWQ7QUFFQXVNLGlCQUFlMkcsVUFBVXJSLE9BQVYsQ0FBa0IsVUFBbEIsRUFBNkIsRUFBN0IsQ0FBZjtBQUNBbkgsWUFBVXBDLFFBQVFJLFNBQVIsQ0FBa0I2VCxZQUFsQixFQUFnQ3RJLE9BQWhDLENBQVY7O0FBRUEsTUFBR0EsT0FBSDtBQUNDc0ksbUJBQWVqVSxRQUFRb2IsYUFBUixDQUFzQmhaLE9BQXRCLENBQWY7QUNBQzs7QURFRjBZLHNCQUFvQjlhLFFBQVE4RixhQUFSLENBQXNCbU8sWUFBdEIsQ0FBcEI7QUFHQTRHLFlBQUF6WSxXQUFBLE9BQVVBLFFBQVNFLE1BQW5CLEdBQW1CLE1BQW5COztBQUNBLE1BQUcsQ0FBQ3VZLE9BQUQsSUFBWSxDQUFDQyxpQkFBaEI7QUFDQyxXQUFPLEtBQUtFLEtBQUwsRUFBUDtBQ0ZDOztBRElGRCxxQkFBbUJ0WSxFQUFFd0YsTUFBRixDQUFTNFMsT0FBVCxFQUFrQixVQUFDbFksQ0FBRDtBQUNwQyxXQUFPRixFQUFFc1EsVUFBRixDQUFhcFEsRUFBRVEsWUFBZixLQUFnQyxDQUFDVixFQUFFNEcsT0FBRixDQUFVMUcsRUFBRVEsWUFBWixDQUF4QztBQURrQixJQUFuQjtBQUdBaVIsU0FBTyxJQUFQO0FBRUFBLE9BQUtpSCxPQUFMOztBQUVBLE1BQUdOLGlCQUFpQnJXLE1BQWpCLEdBQTBCLENBQTdCO0FBQ0NtTyxXQUFPO0FBQ04xTixZQUFNO0FBQ0wsWUFBQW1XLFVBQUE7QUFBQWxILGFBQUtpSCxPQUFMO0FBQ0FDLHFCQUFhLEVBQWI7O0FBQ0E3WSxVQUFFZSxJQUFGLENBQU9mLEVBQUVzSyxJQUFGLENBQU96SyxNQUFQLENBQVAsRUFBdUIsVUFBQ0ssQ0FBRDtBQUN0QixlQUFPLGtCQUFrQnlCLElBQWxCLENBQXVCekIsQ0FBdkIsQ0FBUDtBQ0hPLG1CRElOMlksV0FBVzNZLENBQVgsSUFBZ0IsQ0NKVjtBQUNEO0FEQ1A7O0FBSUEsZUFBT21ZLGtCQUFrQjNWLElBQWxCLENBQXVCO0FBQUMvRCxlQUFLO0FBQUMwUyxpQkFBS3JDO0FBQU47QUFBTixTQUF2QixFQUEwQztBQUFDblAsa0JBQVFnWjtBQUFULFNBQTFDLENBQVA7QUFSSztBQUFBLEtBQVA7QUFXQXpJLFNBQUswSSxRQUFMLEdBQWdCLEVBQWhCO0FBRUF4TyxXQUFPdEssRUFBRXNLLElBQUYsQ0FBT3pLLE1BQVAsQ0FBUDs7QUFFQSxRQUFHeUssS0FBS3JJLE1BQUwsR0FBYyxDQUFqQjtBQUNDcUksYUFBT3RLLEVBQUVzSyxJQUFGLENBQU84TixPQUFQLENBQVA7QUNFRTs7QURBSDFMLFlBQVEsRUFBUjtBQUVBcEMsU0FBS3JLLE9BQUwsQ0FBYSxVQUFDNEYsR0FBRDtBQUNaLFVBQUdsRyxRQUFRL0IsTUFBUixDQUFlbWIsV0FBZixDQUEyQmxULE1BQU0sR0FBakMsQ0FBSDtBQUNDNkcsZ0JBQVFBLE1BQU16RyxNQUFOLENBQWFqRyxFQUFFMkcsR0FBRixDQUFNaEgsUUFBUS9CLE1BQVIsQ0FBZW1iLFdBQWYsQ0FBMkJsVCxNQUFNLEdBQWpDLENBQU4sRUFBNkMsVUFBQzFGLENBQUQ7QUFDakUsaUJBQU8wRixNQUFNLEdBQU4sR0FBWTFGLENBQW5CO0FBRG9CLFVBQWIsQ0FBUjtBQ0dHOztBQUNELGFEREh1TSxNQUFNcE0sSUFBTixDQUFXdUYsR0FBWCxDQ0NHO0FETko7O0FBT0E2RyxVQUFNek0sT0FBTixDQUFjLFVBQUM0RixHQUFEO0FBQ2IsVUFBQW1ULGVBQUE7QUFBQUEsd0JBQWtCWixRQUFRdlMsR0FBUixDQUFsQjs7QUFFQSxVQUFHbVQsb0JBQW9CaFosRUFBRXNRLFVBQUYsQ0FBYTBJLGdCQUFnQnRZLFlBQTdCLEtBQThDLENBQUNWLEVBQUU0RyxPQUFGLENBQVVvUyxnQkFBZ0J0WSxZQUExQixDQUFuRSxDQUFIO0FDRUssZURESjBQLEtBQUswSSxRQUFMLENBQWN4WSxJQUFkLENBQW1CO0FBQ2xCb0MsZ0JBQU0sVUFBQ3VXLE1BQUQ7QUFDTCxnQkFBQUMsZUFBQSxFQUFBOVMsQ0FBQSxFQUFBNUMsY0FBQSxFQUFBMlYsR0FBQSxFQUFBeEksS0FBQSxFQUFBeUksYUFBQSxFQUFBMVksWUFBQSxFQUFBMlksbUJBQUEsRUFBQUMsR0FBQTs7QUFBQTtBQUNDM0gsbUJBQUtpSCxPQUFMO0FBRUFqSSxzQkFBUSxFQUFSOztBQUdBLGtCQUFHLG9CQUFvQmhQLElBQXBCLENBQXlCa0UsR0FBekIsQ0FBSDtBQUNDc1Qsc0JBQU10VCxJQUFJaUIsT0FBSixDQUFZLGtCQUFaLEVBQWdDLElBQWhDLENBQU47QUFDQXdTLHNCQUFNelQsSUFBSWlCLE9BQUosQ0FBWSxrQkFBWixFQUFnQyxJQUFoQyxDQUFOO0FBQ0FzUyxnQ0FBZ0JILE9BQU9FLEdBQVAsRUFBWUksV0FBWixDQUF3QkQsR0FBeEIsQ0FBaEI7QUFIRDtBQUtDRixnQ0FBZ0J2VCxJQUFJa0wsS0FBSixDQUFVLEdBQVYsRUFBZXlJLE1BQWYsQ0FBc0IsVUFBQ3pLLENBQUQsRUFBSWxHLENBQUo7QUNBNUIseUJBQU9rRyxLQUFLLElBQUwsR0RDZkEsRUFBR2xHLENBQUgsQ0NEZSxHRENaLE1DREs7QURBTSxtQkFFZG9RLE1BRmMsQ0FBaEI7QUNFTzs7QURFUnZZLDZCQUFlc1ksZ0JBQWdCdFksWUFBL0I7O0FBRUEsa0JBQUdWLEVBQUVzUSxVQUFGLENBQWE1UCxZQUFiLENBQUg7QUFDQ0EsK0JBQWVBLGNBQWY7QUNETzs7QURHUixrQkFBR1YsRUFBRStJLE9BQUYsQ0FBVXJJLFlBQVYsQ0FBSDtBQUNDLG9CQUFHVixFQUFFeVosUUFBRixDQUFXTCxhQUFYLEtBQTZCLENBQUNwWixFQUFFK0ksT0FBRixDQUFVcVEsYUFBVixDQUFqQztBQUNDMVksaUNBQWUwWSxjQUFjckssQ0FBN0I7QUFDQXFLLGtDQUFnQkEsY0FBY3BLLEdBQWQsSUFBcUIsRUFBckM7QUFGRDtBQUlDLHlCQUFPLEVBQVA7QUFMRjtBQ0tROztBREVSLGtCQUFHaFAsRUFBRStJLE9BQUYsQ0FBVXFRLGFBQVYsQ0FBSDtBQUNDekksc0JBQU1oUyxHQUFOLEdBQVk7QUFBQzBTLHVCQUFLK0g7QUFBTixpQkFBWjtBQUREO0FBR0N6SSxzQkFBTWhTLEdBQU4sR0FBWXlhLGFBQVo7QUNFTzs7QURBUkMsb0NBQXNCOWIsUUFBUUksU0FBUixDQUFrQitDLFlBQWxCLEVBQWdDd0ksT0FBaEMsQ0FBdEI7QUFFQTFGLCtCQUFpQjZWLG9CQUFvQjVWLGNBQXJDO0FBRUF5VixnQ0FBa0I7QUFBQ3ZhLHFCQUFLLENBQU47QUFBUzBQLHVCQUFPO0FBQWhCLGVBQWxCOztBQUVBLGtCQUFHN0ssY0FBSDtBQUNDMFYsZ0NBQWdCMVYsY0FBaEIsSUFBa0MsQ0FBbEM7QUNFTzs7QURBUixxQkFBT2pHLFFBQVE4RixhQUFSLENBQXNCM0MsWUFBdEIsRUFBb0N3SSxPQUFwQyxFQUE2Q3hHLElBQTdDLENBQWtEaU8sS0FBbEQsRUFBeUQ7QUFDL0Q5USx3QkFBUXFaO0FBRHVELGVBQXpELENBQVA7QUF6Q0QscUJBQUEvUixLQUFBO0FBNENNZixrQkFBQWUsS0FBQTtBQUNMQyxzQkFBUUMsR0FBUixDQUFZM0csWUFBWixFQUEwQnVZLE1BQTFCLEVBQWtDN1MsQ0FBbEM7QUFDQSxxQkFBTyxFQUFQO0FDR007QURuRFU7QUFBQSxTQUFuQixDQ0NJO0FBcUREO0FEMURMOztBQXVEQSxXQUFPZ0ssSUFBUDtBQW5GRDtBQXFGQyxXQUFPO0FBQ04xTixZQUFNO0FBQ0xpUCxhQUFLaUgsT0FBTDtBQUNBLGVBQU9QLGtCQUFrQjNWLElBQWxCLENBQXVCO0FBQUMvRCxlQUFLO0FBQUMwUyxpQkFBS3JDO0FBQU47QUFBTixTQUF2QixFQUEwQztBQUFDblAsa0JBQVFBO0FBQVQsU0FBMUMsQ0FBUDtBQUhLO0FBQUEsS0FBUDtBQ2lCQztBRGxJSCxHOzs7Ozs7Ozs7Ozs7QUVBQTFDLE9BQU82YSxPQUFQLENBQWUsa0JBQWYsRUFBbUMsVUFBQ3ZhLFdBQUQsRUFBY3lMLE9BQWQ7QUFDL0IsTUFBQUMsTUFBQTtBQUFBQSxXQUFTLEtBQUtBLE1BQWQ7QUFDQSxTQUFPNUwsUUFBUThGLGFBQVIsQ0FBc0Isa0JBQXRCLEVBQTBDWCxJQUExQyxDQUErQztBQUFDakYsaUJBQWFBLFdBQWQ7QUFBMkI0USxXQUFPbkYsT0FBbEM7QUFBMkMsV0FBTSxDQUFDO0FBQUM2QixhQUFPNUI7QUFBUixLQUFELEVBQWtCO0FBQUN1USxjQUFRO0FBQVQsS0FBbEI7QUFBakQsR0FBL0MsQ0FBUDtBQUZKLEc7Ozs7Ozs7Ozs7OztBQ0FBdmMsT0FBTzZhLE9BQVAsQ0FBZSx1QkFBZixFQUF3QyxVQUFDdmEsV0FBRDtBQUNwQyxNQUFBMEwsTUFBQTtBQUFBQSxXQUFTLEtBQUtBLE1BQWQ7QUFDQSxTQUFPNUwsUUFBUWlTLFdBQVIsQ0FBb0JwUyxRQUFwQixDQUE2QnNGLElBQTdCLENBQWtDO0FBQUNqRixpQkFBYTtBQUFDNFQsV0FBSzVUO0FBQU4sS0FBZDtBQUFrQ1csZUFBVztBQUFDaVQsV0FBSyxDQUFDLGtCQUFELEVBQXFCLGtCQUFyQjtBQUFOLEtBQTdDO0FBQThGdEcsV0FBTzVCO0FBQXJHLEdBQWxDLENBQVA7QUFGSixHOzs7Ozs7Ozs7Ozs7QUNBQWhNLE9BQU82YSxPQUFQLENBQWUseUJBQWYsRUFBMEMsVUFBQ3ZhLFdBQUQsRUFBYzZCLG1CQUFkLEVBQW1DdU8sa0JBQW5DLEVBQXVEelAsU0FBdkQsRUFBa0U4SyxPQUFsRTtBQUN6QyxNQUFBeEUsV0FBQSxFQUFBK0MsUUFBQSxFQUFBMEIsTUFBQTtBQUFBQSxXQUFTLEtBQUtBLE1BQWQ7O0FBQ0EsTUFBRzdKLHdCQUF1QixzQkFBMUI7QUFDQ21JLGVBQVc7QUFBQyx3QkFBa0J5QjtBQUFuQixLQUFYO0FBREQ7QUFHQ3pCLGVBQVc7QUFBQzRHLGFBQU9uRjtBQUFSLEtBQVg7QUNNQzs7QURKRixNQUFHNUosd0JBQXVCLFdBQTFCO0FBRUNtSSxhQUFTLFVBQVQsSUFBdUJoSyxXQUF2QjtBQUNBZ0ssYUFBUyxZQUFULElBQXlCLENBQUNySixTQUFELENBQXpCO0FBSEQ7QUFLQ3FKLGFBQVNvRyxrQkFBVCxJQUErQnpQLFNBQS9CO0FDS0M7O0FESEZzRyxnQkFBY25ILFFBQVFrTSxjQUFSLENBQXVCbkssbUJBQXZCLEVBQTRDNEosT0FBNUMsRUFBcURDLE1BQXJELENBQWQ7O0FBQ0EsTUFBRyxDQUFDekUsWUFBWXdTLGNBQWIsSUFBZ0N4UyxZQUFZQyxTQUEvQztBQUNDOEMsYUFBU3NELEtBQVQsR0FBaUI1QixNQUFqQjtBQ0tDOztBREhGLFNBQU81TCxRQUFROEYsYUFBUixDQUFzQi9ELG1CQUF0QixFQUEyQ29ELElBQTNDLENBQWdEK0UsUUFBaEQsQ0FBUDtBQWxCRCxHOzs7Ozs7Ozs7Ozs7QUVBQXRLLE9BQU82YSxPQUFQLENBQWUsaUJBQWYsRUFBa0MsVUFBQzlPLE9BQUQsRUFBVUMsTUFBVjtBQUNqQyxTQUFPNUwsUUFBUThGLGFBQVIsQ0FBc0IsYUFBdEIsRUFBcUNYLElBQXJDLENBQTBDO0FBQUMyTCxXQUFPbkYsT0FBUjtBQUFpQnlRLFVBQU14UTtBQUF2QixHQUExQyxDQUFQO0FBREQsRzs7Ozs7Ozs7Ozs7O0FDQ0EsSUFBR2hNLE9BQU91USxRQUFWO0FBRUN2USxTQUFPNmEsT0FBUCxDQUFlLHNCQUFmLEVBQXVDLFVBQUM5TyxPQUFEO0FBRXRDLFFBQUF6QixRQUFBOztBQUFBLFNBQU8sS0FBSzBCLE1BQVo7QUFDQyxhQUFPLEtBQUtvUCxLQUFMLEVBQVA7QUNERTs7QURHSCxTQUFPclAsT0FBUDtBQUNDLGFBQU8sS0FBS3FQLEtBQUwsRUFBUDtBQ0RFOztBREdIOVEsZUFDQztBQUFBNEcsYUFBT25GLE9BQVA7QUFDQXJELFdBQUs7QUFETCxLQUREO0FBSUEsV0FBTzBSLEdBQUdxQyxjQUFILENBQWtCbFgsSUFBbEIsQ0FBdUIrRSxRQUF2QixDQUFQO0FBWkQ7QUNZQSxDOzs7Ozs7Ozs7Ozs7QUNkRCxJQUFHdEssT0FBT3VRLFFBQVY7QUFFQ3ZRLFNBQU82YSxPQUFQLENBQWUsK0JBQWYsRUFBZ0QsVUFBQzlPLE9BQUQ7QUFFL0MsUUFBQXpCLFFBQUE7O0FBQUEsU0FBTyxLQUFLMEIsTUFBWjtBQUNDLGFBQU8sS0FBS29QLEtBQUwsRUFBUDtBQ0RFOztBREdILFNBQU9yUCxPQUFQO0FBQ0MsYUFBTyxLQUFLcVAsS0FBTCxFQUFQO0FDREU7O0FER0g5USxlQUNDO0FBQUE0RyxhQUFPbkYsT0FBUDtBQUNBckQsV0FBSztBQURMLEtBREQ7QUFJQSxXQUFPMFIsR0FBR3FDLGNBQUgsQ0FBa0JsWCxJQUFsQixDQUF1QitFLFFBQXZCLENBQVA7QUFaRDtBQ1lBLEM7Ozs7Ozs7Ozs7OztBQ2ZELElBQUd0SyxPQUFPdVEsUUFBVjtBQUNDdlEsU0FBTzZhLE9BQVAsQ0FBZSx1QkFBZixFQUF3QztBQUN2QyxRQUFBN08sTUFBQTtBQUFBQSxhQUFTLEtBQUtBLE1BQWQ7QUFDQSxXQUFPb08sR0FBR0ssV0FBSCxDQUFlbFYsSUFBZixDQUFvQjtBQUFDaVgsWUFBTXhRLE1BQVA7QUFBZTBPLG9CQUFjO0FBQTdCLEtBQXBCLENBQVA7QUFGRDtBQ1FBLEM7Ozs7Ozs7Ozs7OztBQ1REZ0MsbUNBQW1DLEVBQW5DOztBQUVBQSxpQ0FBaUNDLGtCQUFqQyxHQUFzRCxVQUFDQyxPQUFELEVBQVVDLE9BQVY7QUFFckQsTUFBQUMsSUFBQSxFQUFBQyxjQUFBLEVBQUFDLE9BQUEsRUFBQUMsYUFBQSxFQUFBQyxZQUFBLEVBQUFDLGNBQUEsRUFBQUMsZ0JBQUEsRUFBQXRNLFFBQUEsRUFBQXVNLGFBQUEsRUFBQUMsZUFBQSxFQUFBQyxpQkFBQTtBQUFBVCxTQUFPVSw2QkFBNkJDLE9BQTdCLENBQXFDYixPQUFyQyxDQUFQO0FBQ0E5TCxhQUFXZ00sS0FBSzVMLEtBQWhCO0FBRUE4TCxZQUFVLElBQUl6UyxLQUFKLEVBQVY7QUFDQTBTLGtCQUFnQjdDLEdBQUc2QyxhQUFILENBQWlCMVgsSUFBakIsQ0FBc0I7QUFDckMyTCxXQUFPSixRQUQ4QjtBQUNwQnVKLFdBQU93QztBQURhLEdBQXRCLEVBQ29CO0FBQUVuYSxZQUFRO0FBQUVnYixlQUFTO0FBQVg7QUFBVixHQURwQixFQUNnRDdILEtBRGhELEVBQWhCOztBQUVBaFQsSUFBRWUsSUFBRixDQUFPcVosYUFBUCxFQUFzQixVQUFDVSxHQUFEO0FBQ3JCWCxZQUFRN1osSUFBUixDQUFhd2EsSUFBSW5jLEdBQWpCOztBQUNBLFFBQUdtYyxJQUFJRCxPQUFQO0FDUUksYURQSDdhLEVBQUVlLElBQUYsQ0FBTytaLElBQUlELE9BQVgsRUFBb0IsVUFBQ0UsU0FBRDtBQ1FmLGVEUEpaLFFBQVE3WixJQUFSLENBQWF5YSxTQUFiLENDT0k7QURSTCxRQ09HO0FBR0Q7QURiSjs7QUFPQVosWUFBVW5hLEVBQUU4RixJQUFGLENBQU9xVSxPQUFQLENBQVY7QUFDQUQsbUJBQWlCLElBQUl4UyxLQUFKLEVBQWpCOztBQUNBLE1BQUd1UyxLQUFLZSxLQUFSO0FBSUMsUUFBR2YsS0FBS2UsS0FBTCxDQUFXUixhQUFkO0FBQ0NBLHNCQUFnQlAsS0FBS2UsS0FBTCxDQUFXUixhQUEzQjs7QUFDQSxVQUFHQSxjQUFjdlQsUUFBZCxDQUF1QitTLE9BQXZCLENBQUg7QUFDQ0UsdUJBQWU1WixJQUFmLENBQW9CLEtBQXBCO0FBSEY7QUNVRzs7QURMSCxRQUFHMlosS0FBS2UsS0FBTCxDQUFXWCxZQUFkO0FBQ0NBLHFCQUFlSixLQUFLZSxLQUFMLENBQVdYLFlBQTFCOztBQUNBcmEsUUFBRWUsSUFBRixDQUFPb1osT0FBUCxFQUFnQixVQUFDYyxNQUFEO0FBQ2YsWUFBR1osYUFBYXBULFFBQWIsQ0FBc0JnVSxNQUF0QixDQUFIO0FDT00saUJETkxmLGVBQWU1WixJQUFmLENBQW9CLEtBQXBCLENDTUs7QUFDRDtBRFROO0FDV0U7O0FESkgsUUFBRzJaLEtBQUtlLEtBQUwsQ0FBV04saUJBQWQ7QUFDQ0EsMEJBQW9CVCxLQUFLZSxLQUFMLENBQVdOLGlCQUEvQjs7QUFDQSxVQUFHQSxrQkFBa0J6VCxRQUFsQixDQUEyQitTLE9BQTNCLENBQUg7QUFDQ0UsdUJBQWU1WixJQUFmLENBQW9CLFNBQXBCO0FBSEY7QUNVRzs7QURMSCxRQUFHMlosS0FBS2UsS0FBTCxDQUFXVCxnQkFBZDtBQUNDQSx5QkFBbUJOLEtBQUtlLEtBQUwsQ0FBV1QsZ0JBQTlCOztBQUNBdmEsUUFBRWUsSUFBRixDQUFPb1osT0FBUCxFQUFnQixVQUFDYyxNQUFEO0FBQ2YsWUFBR1YsaUJBQWlCdFQsUUFBakIsQ0FBMEJnVSxNQUExQixDQUFIO0FDT00saUJETkxmLGVBQWU1WixJQUFmLENBQW9CLFNBQXBCLENDTUs7QUFDRDtBRFROO0FDV0U7O0FESkgsUUFBRzJaLEtBQUtlLEtBQUwsQ0FBV1AsZUFBZDtBQUNDQSx3QkFBa0JSLEtBQUtlLEtBQUwsQ0FBV1AsZUFBN0I7O0FBQ0EsVUFBR0EsZ0JBQWdCeFQsUUFBaEIsQ0FBeUIrUyxPQUF6QixDQUFIO0FBQ0NFLHVCQUFlNVosSUFBZixDQUFvQixPQUFwQjtBQUhGO0FDVUc7O0FETEgsUUFBRzJaLEtBQUtlLEtBQUwsQ0FBV1YsY0FBZDtBQUNDQSx1QkFBaUJMLEtBQUtlLEtBQUwsQ0FBV1YsY0FBNUI7O0FBQ0F0YSxRQUFFZSxJQUFGLENBQU9vWixPQUFQLEVBQWdCLFVBQUNjLE1BQUQ7QUFDZixZQUFHWCxlQUFlclQsUUFBZixDQUF3QmdVLE1BQXhCLENBQUg7QUNPTSxpQkROTGYsZUFBZTVaLElBQWYsQ0FBb0IsT0FBcEIsQ0NNSztBQUNEO0FEVE47QUF2Q0Y7QUNtREU7O0FEUEY0WixtQkFBaUJsYSxFQUFFOEYsSUFBRixDQUFPb1UsY0FBUCxDQUFqQjtBQUNBLFNBQU9BLGNBQVA7QUE5RHFELENBQXRELEM7Ozs7Ozs7Ozs7OztBRUZBLElBQUFnQixLQUFBOztBQUFBQSxRQUFRNVMsUUFBUSxNQUFSLENBQVI7QUFDQXFTLCtCQUErQixFQUEvQjs7QUFFQUEsNkJBQTZCUSxtQkFBN0IsR0FBbUQsVUFBQ0MsR0FBRDtBQUNsRCxNQUFBQyxTQUFBLEVBQUFDLFdBQUEsRUFBQTNLLEtBQUEsRUFBQWdKLElBQUEsRUFBQXhRLE1BQUE7QUFBQXdILFVBQVF5SyxJQUFJekssS0FBWjtBQUNBeEgsV0FBU3dILE1BQU0sV0FBTixDQUFUO0FBQ0EwSyxjQUFZMUssTUFBTSxjQUFOLENBQVo7O0FBRUEsTUFBRyxDQUFJeEgsTUFBSixJQUFjLENBQUlrUyxTQUFyQjtBQUNDLFVBQU0sSUFBSWxlLE9BQU9rVCxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGNBQXRCLENBQU47QUNJQzs7QURGRmlMLGdCQUFjQyxTQUFTQyxlQUFULENBQXlCSCxTQUF6QixDQUFkO0FBQ0ExQixTQUFPeGMsT0FBT3FhLEtBQVAsQ0FBYWxVLE9BQWIsQ0FDTjtBQUFBM0UsU0FBS3dLLE1BQUw7QUFDQSwrQ0FBMkNtUztBQUQzQyxHQURNLENBQVA7O0FBSUEsTUFBRyxDQUFJM0IsSUFBUDtBQUNDLFVBQU0sSUFBSXhjLE9BQU9rVCxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGNBQXRCLENBQU47QUNJQzs7QURGRixTQUFPc0osSUFBUDtBQWhCa0QsQ0FBbkQ7O0FBa0JBZ0IsNkJBQTZCYyxRQUE3QixHQUF3QyxVQUFDeE4sUUFBRDtBQUN2QyxNQUFBSSxLQUFBO0FBQUFBLFVBQVE5USxRQUFRaVMsV0FBUixDQUFvQmlJLE1BQXBCLENBQTJCblUsT0FBM0IsQ0FBbUMySyxRQUFuQyxDQUFSOztBQUNBLE1BQUcsQ0FBSUksS0FBUDtBQUNDLFVBQU0sSUFBSWxSLE9BQU9rVCxLQUFYLENBQWlCLFFBQWpCLEVBQTJCLHdCQUEzQixDQUFOO0FDTUM7O0FETEYsU0FBT2hDLEtBQVA7QUFKdUMsQ0FBeEM7O0FBTUFzTSw2QkFBNkJDLE9BQTdCLEdBQXVDLFVBQUNiLE9BQUQ7QUFDdEMsTUFBQUUsSUFBQTtBQUFBQSxTQUFPMWMsUUFBUWlTLFdBQVIsQ0FBb0JrTSxLQUFwQixDQUEwQnBZLE9BQTFCLENBQWtDeVcsT0FBbEMsQ0FBUDs7QUFDQSxNQUFHLENBQUlFLElBQVA7QUFDQyxVQUFNLElBQUk5YyxPQUFPa1QsS0FBWCxDQUFpQixRQUFqQixFQUEyQixlQUEzQixDQUFOO0FDU0M7O0FEUkYsU0FBTzRKLElBQVA7QUFKc0MsQ0FBdkM7O0FBTUFVLDZCQUE2QmdCLFlBQTdCLEdBQTRDLFVBQUMxTixRQUFELEVBQVcrTCxPQUFYO0FBQzNDLE1BQUE0QixVQUFBO0FBQUFBLGVBQWFyZSxRQUFRaVMsV0FBUixDQUFvQm9JLFdBQXBCLENBQWdDdFUsT0FBaEMsQ0FBd0M7QUFBRStLLFdBQU9KLFFBQVQ7QUFBbUIwTCxVQUFNSztBQUF6QixHQUF4QyxDQUFiOztBQUNBLE1BQUcsQ0FBSTRCLFVBQVA7QUFDQyxVQUFNLElBQUl6ZSxPQUFPa1QsS0FBWCxDQUFpQixRQUFqQixFQUEyQix3QkFBM0IsQ0FBTjtBQ2VDOztBRGRGLFNBQU91TCxVQUFQO0FBSjJDLENBQTVDOztBQU1BakIsNkJBQTZCa0IsbUJBQTdCLEdBQW1ELFVBQUNELFVBQUQ7QUFDbEQsTUFBQWhGLElBQUEsRUFBQWtFLEdBQUE7QUFBQWxFLFNBQU8sSUFBSTNSLE1BQUosRUFBUDtBQUNBMlIsT0FBS2tGLFlBQUwsR0FBb0JGLFdBQVdFLFlBQS9CO0FBQ0FoQixRQUFNdmQsUUFBUWlTLFdBQVIsQ0FBb0I0SyxhQUFwQixDQUFrQzlXLE9BQWxDLENBQTBDc1ksV0FBV0UsWUFBckQsRUFBbUU7QUFBRWpjLFlBQVE7QUFBRXlCLFlBQU0sQ0FBUjtBQUFZeWEsZ0JBQVU7QUFBdEI7QUFBVixHQUFuRSxDQUFOO0FBQ0FuRixPQUFLb0YsaUJBQUwsR0FBeUJsQixJQUFJeFosSUFBN0I7QUFDQXNWLE9BQUtxRixxQkFBTCxHQUE2Qm5CLElBQUlpQixRQUFqQztBQUNBLFNBQU9uRixJQUFQO0FBTmtELENBQW5EOztBQVFBK0QsNkJBQTZCdUIsYUFBN0IsR0FBNkMsVUFBQ2pDLElBQUQ7QUFDNUMsTUFBR0EsS0FBS2tDLEtBQUwsS0FBZ0IsU0FBbkI7QUFDQyxVQUFNLElBQUloZixPQUFPa1QsS0FBWCxDQUFpQixRQUFqQixFQUEyQixZQUEzQixDQUFOO0FDd0JDO0FEMUIwQyxDQUE3Qzs7QUFJQXNLLDZCQUE2QnlCLGtCQUE3QixHQUFrRCxVQUFDbkMsSUFBRCxFQUFPaE0sUUFBUDtBQUNqRCxNQUFHZ00sS0FBSzVMLEtBQUwsS0FBZ0JKLFFBQW5CO0FBQ0MsVUFBTSxJQUFJOVEsT0FBT2tULEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsYUFBM0IsQ0FBTjtBQzBCQztBRDVCK0MsQ0FBbEQ7O0FBSUFzSyw2QkFBNkIwQixPQUE3QixHQUF1QyxVQUFDQyxPQUFEO0FBQ3RDLE1BQUFDLElBQUE7QUFBQUEsU0FBT2hmLFFBQVFpUyxXQUFSLENBQW9CZ04sS0FBcEIsQ0FBMEJsWixPQUExQixDQUFrQ2daLE9BQWxDLENBQVA7O0FBQ0EsTUFBRyxDQUFJQyxJQUFQO0FBQ0MsVUFBTSxJQUFJcGYsT0FBT2tULEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsaUJBQTNCLENBQU47QUM2QkM7O0FEM0JGLFNBQU9rTSxJQUFQO0FBTHNDLENBQXZDOztBQU9BNUIsNkJBQTZCOEIsV0FBN0IsR0FBMkMsVUFBQ0MsV0FBRDtBQUMxQyxTQUFPbmYsUUFBUWlTLFdBQVIsQ0FBb0JtTixVQUFwQixDQUErQnJaLE9BQS9CLENBQXVDb1osV0FBdkMsQ0FBUDtBQUQwQyxDQUEzQzs7QUFHQS9CLDZCQUE2QmlDLGVBQTdCLEdBQStDLFVBQUNDLG9CQUFELEVBQXVCQyxTQUF2QjtBQUM5QyxNQUFBQyxRQUFBLEVBQUFDLG1CQUFBLEVBQUFDLFFBQUEsRUFBQWhELElBQUEsRUFBQUYsT0FBQSxFQUFBd0MsSUFBQSxFQUFBVyxPQUFBLEVBQUFDLFVBQUEsRUFBQXpJLEdBQUEsRUFBQWhRLFdBQUEsRUFBQTBZLGlCQUFBLEVBQUEvTyxLQUFBLEVBQUFKLFFBQUEsRUFBQTJOLFVBQUEsRUFBQXlCLG1CQUFBLEVBQUFDLFVBQUEsRUFBQUMsaUJBQUEsRUFBQUMsU0FBQSxFQUFBeEQsT0FBQTtBQUFBMUgsUUFBTXVLLHFCQUFxQixXQUFyQixDQUFOLEVBQXlDckUsTUFBekM7QUFDQWxHLFFBQU11SyxxQkFBcUIsT0FBckIsQ0FBTixFQUFxQ3JFLE1BQXJDO0FBQ0FsRyxRQUFNdUsscUJBQXFCLE1BQXJCLENBQU4sRUFBb0NyRSxNQUFwQztBQUNBbEcsUUFBTXVLLHFCQUFxQixZQUFyQixDQUFOLEVBQTBDLENBQUM7QUFBQzlOLE9BQUd5SixNQUFKO0FBQVl4SixTQUFLLENBQUN3SixNQUFEO0FBQWpCLEdBQUQsQ0FBMUM7QUFHQW1DLCtCQUE2QjhDLGlCQUE3QixDQUErQ1oscUJBQXFCLFlBQXJCLEVBQW1DLENBQW5DLENBQS9DLEVBQXNGQSxxQkFBcUIsT0FBckIsQ0FBdEY7QUFFQTVPLGFBQVc0TyxxQkFBcUIsT0FBckIsQ0FBWDtBQUNBOUMsWUFBVThDLHFCQUFxQixNQUFyQixDQUFWO0FBQ0E3QyxZQUFVOEMsVUFBVW5lLEdBQXBCO0FBRUE0ZSxzQkFBb0IsSUFBcEI7QUFFQVAsd0JBQXNCLElBQXRCOztBQUNBLE1BQUdILHFCQUFxQixRQUFyQixLQUFtQ0EscUJBQXFCLFFBQXJCLEVBQStCLENBQS9CLENBQXRDO0FBQ0NVLHdCQUFvQlYscUJBQXFCLFFBQXJCLEVBQStCLENBQS9CLENBQXBCOztBQUNBLFFBQUdVLGtCQUFrQixVQUFsQixLQUFrQ0Esa0JBQWtCLFVBQWxCLEVBQThCLENBQTlCLENBQXJDO0FBQ0NQLDRCQUFzQkgscUJBQXFCLFFBQXJCLEVBQStCLENBQS9CLEVBQWtDLFVBQWxDLEVBQThDLENBQTlDLENBQXRCO0FBSEY7QUNvQ0U7O0FEOUJGeE8sVUFBUXNNLDZCQUE2QmMsUUFBN0IsQ0FBc0N4TixRQUF0QyxDQUFSO0FBRUFnTSxTQUFPVSw2QkFBNkJDLE9BQTdCLENBQXFDYixPQUFyQyxDQUFQO0FBRUE2QixlQUFhakIsNkJBQTZCZ0IsWUFBN0IsQ0FBMEMxTixRQUExQyxFQUFvRCtMLE9BQXBELENBQWI7QUFFQXFELHdCQUFzQjFDLDZCQUE2QmtCLG1CQUE3QixDQUFpREQsVUFBakQsQ0FBdEI7QUFFQWpCLCtCQUE2QnVCLGFBQTdCLENBQTJDakMsSUFBM0M7QUFFQVUsK0JBQTZCeUIsa0JBQTdCLENBQWdEbkMsSUFBaEQsRUFBc0RoTSxRQUF0RDtBQUVBc08sU0FBTzVCLDZCQUE2QjBCLE9BQTdCLENBQXFDcEMsS0FBS3NDLElBQTFDLENBQVA7QUFFQTdYLGdCQUFjZ1osa0JBQWtCNUQsa0JBQWxCLENBQXFDQyxPQUFyQyxFQUE4Q0MsT0FBOUMsQ0FBZDs7QUFFQSxNQUFHLENBQUl0VixZQUFZdUMsUUFBWixDQUFxQixLQUFyQixDQUFQO0FBQ0MsVUFBTSxJQUFJOUosT0FBT2tULEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsZ0JBQTNCLENBQU47QUN3QkM7O0FEdEJGcUUsUUFBTSxJQUFJL0YsSUFBSixFQUFOO0FBQ0F1TyxZQUFVLEVBQVY7QUFDQUEsVUFBUXZlLEdBQVIsR0FBY3BCLFFBQVFpUyxXQUFSLENBQW9CbU8sU0FBcEIsQ0FBOEI3TyxVQUE5QixFQUFkO0FBQ0FvTyxVQUFRN08sS0FBUixHQUFnQkosUUFBaEI7QUFDQWlQLFVBQVFqRCxJQUFSLEdBQWVGLE9BQWY7QUFDQW1ELFVBQVFVLFlBQVIsR0FBdUIzRCxLQUFLNEQsT0FBTCxDQUFhbGYsR0FBcEM7QUFDQXVlLFVBQVFYLElBQVIsR0FBZXRDLEtBQUtzQyxJQUFwQjtBQUNBVyxVQUFRWSxZQUFSLEdBQXVCN0QsS0FBSzRELE9BQUwsQ0FBYUMsWUFBcEM7QUFDQVosVUFBUTViLElBQVIsR0FBZTJZLEtBQUszWSxJQUFwQjtBQUNBNGIsVUFBUWEsU0FBUixHQUFvQi9ELE9BQXBCO0FBQ0FrRCxVQUFRYyxjQUFSLEdBQXlCbEIsVUFBVXhiLElBQW5DO0FBQ0E0YixVQUFRZSxTQUFSLEdBQXVCcEIscUJBQXFCLFdBQXJCLElBQXVDQSxxQkFBcUIsV0FBckIsQ0FBdkMsR0FBOEU3QyxPQUFyRztBQUNBa0QsVUFBUWdCLGNBQVIsR0FBNEJyQixxQkFBcUIsZ0JBQXJCLElBQTRDQSxxQkFBcUIsZ0JBQXJCLENBQTVDLEdBQXdGQyxVQUFVeGIsSUFBOUg7QUFDQTRiLFVBQVFpQixzQkFBUixHQUFvQ3RCLHFCQUFxQix3QkFBckIsSUFBb0RBLHFCQUFxQix3QkFBckIsQ0FBcEQsR0FBd0dqQixXQUFXRSxZQUF2SjtBQUNBb0IsVUFBUWtCLDJCQUFSLEdBQXlDdkIscUJBQXFCLDZCQUFyQixJQUF5REEscUJBQXFCLDZCQUFyQixDQUF6RCxHQUFrSFEsb0JBQW9CckIsaUJBQS9LO0FBQ0FrQixVQUFRbUIsK0JBQVIsR0FBNkN4QixxQkFBcUIsaUNBQXJCLElBQTZEQSxxQkFBcUIsaUNBQXJCLENBQTdELEdBQTJIUSxvQkFBb0JwQixxQkFBNUw7QUFDQWlCLFVBQVFvQixpQkFBUixHQUErQnpCLHFCQUFxQixtQkFBckIsSUFBK0NBLHFCQUFxQixtQkFBckIsQ0FBL0MsR0FBOEZqQixXQUFXMkMsVUFBeEk7QUFDQXJCLFVBQVFmLEtBQVIsR0FBZ0IsT0FBaEI7QUFDQWUsVUFBUXNCLElBQVIsR0FBZSxFQUFmO0FBQ0F0QixVQUFRdUIsV0FBUixHQUFzQixLQUF0QjtBQUNBdkIsVUFBUXdCLFVBQVIsR0FBcUIsS0FBckI7QUFDQXhCLFVBQVFqTyxPQUFSLEdBQWtCeUYsR0FBbEI7QUFDQXdJLFVBQVFoTyxVQUFSLEdBQXFCOEssT0FBckI7QUFDQWtELFVBQVF4TyxRQUFSLEdBQW1CZ0csR0FBbkI7QUFDQXdJLFVBQVF0TyxXQUFSLEdBQXNCb0wsT0FBdEI7QUFDQWtELFVBQVFoVCxNQUFSLEdBQWlCLElBQUlqRixNQUFKLEVBQWpCO0FBRUFpWSxVQUFReUIsVUFBUixHQUFxQjlCLHFCQUFxQixZQUFyQixDQUFyQjs7QUFFQSxNQUFHakIsV0FBVzJDLFVBQWQ7QUFDQ3JCLFlBQVFxQixVQUFSLEdBQXFCM0MsV0FBVzJDLFVBQWhDO0FDc0JDOztBRG5CRmYsY0FBWSxFQUFaO0FBQ0FBLFlBQVU3ZSxHQUFWLEdBQWdCLElBQUlpZ0IsTUFBTUMsUUFBVixHQUFxQkMsSUFBckM7QUFDQXRCLFlBQVVyYSxRQUFWLEdBQXFCK1osUUFBUXZlLEdBQTdCO0FBQ0E2ZSxZQUFVdUIsV0FBVixHQUF3QixLQUF4QjtBQUVBekIsZUFBYXRkLEVBQUUwQyxJQUFGLENBQU91WCxLQUFLNEQsT0FBTCxDQUFhbUIsS0FBcEIsRUFBMkIsVUFBQ0MsSUFBRDtBQUN2QyxXQUFPQSxLQUFLQyxTQUFMLEtBQWtCLE9BQXpCO0FBRFksSUFBYjtBQUdBMUIsWUFBVXlCLElBQVYsR0FBaUIzQixXQUFXM2UsR0FBNUI7QUFDQTZlLFlBQVVsYyxJQUFWLEdBQWlCZ2MsV0FBV2hjLElBQTVCO0FBRUFrYyxZQUFVMkIsVUFBVixHQUF1QnpLLEdBQXZCO0FBRUFxSSxhQUFXLEVBQVg7QUFDQUEsV0FBU3BlLEdBQVQsR0FBZSxJQUFJaWdCLE1BQU1DLFFBQVYsR0FBcUJDLElBQXBDO0FBQ0EvQixXQUFTNVosUUFBVCxHQUFvQitaLFFBQVF2ZSxHQUE1QjtBQUNBb2UsV0FBU3FDLEtBQVQsR0FBaUI1QixVQUFVN2UsR0FBM0I7QUFDQW9lLFdBQVNnQyxXQUFULEdBQXVCLEtBQXZCO0FBQ0FoQyxXQUFTcEQsSUFBVCxHQUFtQmtELHFCQUFxQixXQUFyQixJQUF1Q0EscUJBQXFCLFdBQXJCLENBQXZDLEdBQThFN0MsT0FBakc7QUFDQStDLFdBQVNzQyxTQUFULEdBQXdCeEMscUJBQXFCLGdCQUFyQixJQUE0Q0EscUJBQXFCLGdCQUFyQixDQUE1QyxHQUF3RkMsVUFBVXhiLElBQTFIO0FBQ0F5YixXQUFTdUMsT0FBVCxHQUFtQnRGLE9BQW5CO0FBQ0ErQyxXQUFTd0MsWUFBVCxHQUF3QnpDLFVBQVV4YixJQUFsQztBQUNBeWIsV0FBU3lDLG9CQUFULEdBQWdDNUQsV0FBV0UsWUFBM0M7QUFDQWlCLFdBQVMwQyx5QkFBVCxHQUFxQ3BDLG9CQUFvQi9iLElBQXpEO0FBQ0F5YixXQUFTMkMsNkJBQVQsR0FBeUNyQyxvQkFBb0J0QixRQUE3RDtBQUNBZ0IsV0FBUzFjLElBQVQsR0FBZ0IsT0FBaEI7QUFDQTBjLFdBQVNvQyxVQUFULEdBQXNCekssR0FBdEI7QUFDQXFJLFdBQVM0QyxTQUFULEdBQXFCakwsR0FBckI7QUFDQXFJLFdBQVM2QyxPQUFULEdBQW1CLElBQW5CO0FBQ0E3QyxXQUFTOEMsUUFBVCxHQUFvQixLQUFwQjtBQUNBOUMsV0FBUytDLFdBQVQsR0FBdUIsRUFBdkI7QUFDQTFDLHNCQUFvQixFQUFwQjtBQUNBTCxXQUFTN1MsTUFBVCxHQUFrQnlRLDZCQUE2Qm9GLGNBQTdCLENBQTRDN0MsUUFBUXlCLFVBQVIsQ0FBbUIsQ0FBbkIsQ0FBNUMsRUFBbUU1RSxPQUFuRSxFQUE0RTlMLFFBQTVFLEVBQXNGc08sS0FBS3NCLE9BQUwsQ0FBYWhlLE1BQW5HLEVBQTJHdWQsaUJBQTNHLENBQWxCO0FBRUFJLFlBQVV3QyxRQUFWLEdBQXFCLENBQUNqRCxRQUFELENBQXJCO0FBQ0FHLFVBQVErQyxNQUFSLEdBQWlCLENBQUN6QyxTQUFELENBQWpCO0FBRUFOLFVBQVFnRCxXQUFSLEdBQXNCckQscUJBQXFCcUQsV0FBckIsSUFBb0MsRUFBMUQ7QUFFQWhELFVBQVFpRCxpQkFBUixHQUE0QjdDLFdBQVdoYyxJQUF2Qzs7QUFFQSxNQUFHMlksS0FBS21HLFdBQUwsS0FBb0IsSUFBdkI7QUFDQ2xELFlBQVFrRCxXQUFSLEdBQXNCLElBQXRCO0FDY0M7O0FEWEZsRCxVQUFRbUQsU0FBUixHQUFvQnBHLEtBQUszWSxJQUF6Qjs7QUFDQSxNQUFHaWIsS0FBS1UsUUFBUjtBQUNDQSxlQUFXdEMsNkJBQTZCOEIsV0FBN0IsQ0FBeUNGLEtBQUtVLFFBQTlDLENBQVg7O0FBQ0EsUUFBR0EsUUFBSDtBQUNDQyxjQUFRb0QsYUFBUixHQUF3QnJELFNBQVMzYixJQUFqQztBQUNBNGIsY0FBUUQsUUFBUixHQUFtQkEsU0FBU3RlLEdBQTVCO0FBSkY7QUNrQkU7O0FEWkZ3ZSxlQUFhNWYsUUFBUWlTLFdBQVIsQ0FBb0JtTyxTQUFwQixDQUE4QjlPLE1BQTlCLENBQXFDcU8sT0FBckMsQ0FBYjtBQUVBdkMsK0JBQTZCNEYsMEJBQTdCLENBQXdEckQsUUFBUXlCLFVBQVIsQ0FBbUIsQ0FBbkIsQ0FBeEQsRUFBK0V4QixVQUEvRSxFQUEyRmxQLFFBQTNGO0FBRUEwTSwrQkFBNkI2RixpQ0FBN0IsQ0FBK0RwRCxpQkFBL0QsRUFBa0ZELFVBQWxGLEVBQThGbFAsUUFBOUY7QUFFQTBNLCtCQUE2QjhGLGNBQTdCLENBQTRDdkQsUUFBUXlCLFVBQVIsQ0FBbUIsQ0FBbkIsQ0FBNUMsRUFBbUUxUSxRQUFuRSxFQUE2RWlQLFFBQVF2ZSxHQUFyRixFQUEwRm9lLFNBQVNwZSxHQUFuRztBQUVBLFNBQU93ZSxVQUFQO0FBdEk4QyxDQUEvQzs7QUF3SUF4Qyw2QkFBNkJvRixjQUE3QixHQUE4QyxVQUFDVyxTQUFELEVBQVlDLE1BQVosRUFBb0J6WCxPQUFwQixFQUE2QnJKLE1BQTdCLEVBQXFDdWQsaUJBQXJDO0FBQzdDLE1BQUF3RCxVQUFBLEVBQUFDLFlBQUEsRUFBQTVHLElBQUEsRUFBQXNDLElBQUEsRUFBQXVFLFVBQUEsRUFBQUMsZUFBQSxFQUFBQyxtQkFBQSxFQUFBQyxrQkFBQSxFQUFBQyxZQUFBLEVBQUFDLGlCQUFBLEVBQUFDLHFCQUFBLEVBQUFDLG9CQUFBLEVBQUFDLHlCQUFBLEVBQUFDLGlCQUFBLEVBQUFDLGtCQUFBLEVBQUFDLGtCQUFBLEVBQUFDLG1CQUFBLEVBQUE5VyxNQUFBLEVBQUErVyxVQUFBLEVBQUFDLEVBQUEsRUFBQTdlLE1BQUEsRUFBQThlLFFBQUEsRUFBQW5rQixHQUFBLEVBQUFxQyxjQUFBLEVBQUEraEIsa0JBQUEsRUFBQUMsZUFBQSxFQUFBQyxhQUFBLEVBQUFDLGlCQUFBLEVBQUEvWCxNQUFBO0FBQUEwVyxlQUFhLEVBQWI7O0FBQ0E1Z0IsSUFBRWUsSUFBRixDQUFPbEIsTUFBUCxFQUFlLFVBQUNLLENBQUQ7QUFDZCxRQUFHQSxFQUFFRyxJQUFGLEtBQVUsU0FBYjtBQ1lJLGFEWEhMLEVBQUVlLElBQUYsQ0FBT2IsRUFBRUwsTUFBVCxFQUFpQixVQUFDcWlCLEVBQUQ7QUNZWixlRFhKdEIsV0FBV3RnQixJQUFYLENBQWdCNGhCLEdBQUcxRCxJQUFuQixDQ1dJO0FEWkwsUUNXRztBRFpKO0FDZ0JJLGFEWkhvQyxXQUFXdGdCLElBQVgsQ0FBZ0JKLEVBQUVzZSxJQUFsQixDQ1lHO0FBQ0Q7QURsQko7O0FBT0F0VSxXQUFTLEVBQVQ7QUFDQXlYLGVBQWFqQixVQUFVM1IsQ0FBdkI7QUFDQW5FLFdBQVNyTixRQUFRSSxTQUFSLENBQWtCZ2tCLFVBQWxCLEVBQThCelksT0FBOUIsQ0FBVDtBQUNBMlksYUFBV25CLFVBQVUxUixHQUFWLENBQWMsQ0FBZCxDQUFYO0FBQ0E0UyxPQUFLcmtCLFFBQVFpUyxXQUFSLENBQW9CMlMsZ0JBQXBCLENBQXFDN2UsT0FBckMsQ0FBNkM7QUFDakQ3RixpQkFBYWtrQixVQURvQztBQUVqRDVILGFBQVM0RztBQUZ3QyxHQUE3QyxDQUFMO0FBSUE1ZCxXQUFTeEYsUUFBUThGLGFBQVIsQ0FBc0JzZSxVQUF0QixFQUFrQ3pZLE9BQWxDLEVBQTJDNUYsT0FBM0MsQ0FBbUR1ZSxRQUFuRCxDQUFUO0FBQ0E1SCxTQUFPMWMsUUFBUThGLGFBQVIsQ0FBc0IsT0FBdEIsRUFBK0JDLE9BQS9CLENBQXVDcWQsTUFBdkMsRUFBK0M7QUFBRTlnQixZQUFRO0FBQUUwYyxZQUFNO0FBQVI7QUFBVixHQUEvQyxDQUFQOztBQUNBLE1BQUdxRixNQUFPN2UsTUFBVjtBQUNDd1osV0FBT2hmLFFBQVE4RixhQUFSLENBQXNCLE9BQXRCLEVBQStCQyxPQUEvQixDQUF1QzJXLEtBQUtzQyxJQUE1QyxDQUFQO0FBQ0F1RSxpQkFBYXZFLEtBQUtzQixPQUFMLENBQWFoZSxNQUFiLElBQXVCLEVBQXBDO0FBQ0FFLHFCQUFpQnhDLFFBQVF1RCxpQkFBUixDQUEwQjZnQixVQUExQixFQUFzQ3pZLE9BQXRDLENBQWpCO0FBQ0E0WSx5QkFBcUI5aEIsRUFBRXVGLEtBQUYsQ0FBUXhGLGNBQVIsRUFBd0IsYUFBeEIsQ0FBckI7QUFDQWdoQixzQkFBa0IvZ0IsRUFBRXdGLE1BQUYsQ0FBU3NiLFVBQVQsRUFBcUIsVUFBQ3NCLFNBQUQ7QUFDdEMsYUFBT0EsVUFBVS9oQixJQUFWLEtBQWtCLE9BQXpCO0FBRGlCLE1BQWxCO0FBRUEyZ0IsMEJBQXNCaGhCLEVBQUV1RixLQUFGLENBQVF3YixlQUFSLEVBQXlCLE1BQXpCLENBQXRCOztBQUVBTyxnQ0FBNkIsVUFBQ3piLEdBQUQ7QUFDNUIsYUFBTzdGLEVBQUUwQyxJQUFGLENBQU9vZixrQkFBUCxFQUE0QixVQUFDTyxpQkFBRDtBQUNsQyxlQUFPeGMsSUFBSXljLFVBQUosQ0FBZUQsb0JBQW9CLEdBQW5DLENBQVA7QUFETSxRQUFQO0FBRDRCLEtBQTdCOztBQUlBakIsNEJBQXdCLFVBQUN2YixHQUFEO0FBQ3ZCLGFBQU83RixFQUFFMEMsSUFBRixDQUFPc2UsbUJBQVAsRUFBNkIsVUFBQ3VCLGtCQUFEO0FBQ25DLGVBQU8xYyxJQUFJeWMsVUFBSixDQUFlQyxxQkFBcUIsR0FBcEMsQ0FBUDtBQURNLFFBQVA7QUFEdUIsS0FBeEI7O0FBSUFwQix3QkFBb0IsVUFBQ3RiLEdBQUQ7QUFDbkIsYUFBTzdGLEVBQUUwQyxJQUFGLENBQU9xZSxlQUFQLEVBQXlCLFVBQUM3Z0IsQ0FBRDtBQUMvQixlQUFPQSxFQUFFc2UsSUFBRixLQUFVM1ksR0FBakI7QUFETSxRQUFQO0FBRG1CLEtBQXBCOztBQUlBcWIsbUJBQWUsVUFBQ3JiLEdBQUQ7QUFDZCxhQUFPN0YsRUFBRTBDLElBQUYsQ0FBT29lLFVBQVAsRUFBb0IsVUFBQzVnQixDQUFEO0FBQzFCLGVBQU9BLEVBQUVzZSxJQUFGLEtBQVUzWSxHQUFqQjtBQURNLFFBQVA7QUFEYyxLQUFmOztBQUlBd2IsMkJBQXVCLFVBQUNtQixVQUFELEVBQWFDLFlBQWI7QUFDdEIsYUFBT3ppQixFQUFFMEMsSUFBRixDQUFPOGYsV0FBVzNpQixNQUFsQixFQUEyQixVQUFDSyxDQUFEO0FBQ2pDLGVBQU9BLEVBQUVzZSxJQUFGLEtBQVVpRSxZQUFqQjtBQURNLFFBQVA7QUFEc0IsS0FBdkI7O0FBSUF4Qix5QkFBcUIsVUFBQzlNLE9BQUQsRUFBVThELEVBQVY7QUFDcEIsVUFBQXlLLE9BQUEsRUFBQXBULFFBQUEsRUFBQTdLLEdBQUE7O0FBQUFBLFlBQU1sSCxRQUFROEYsYUFBUixDQUFzQjhRLE9BQXRCLENBQU47O0FBQ0EsVUFBRyxDQUFDMVAsR0FBSjtBQUNDO0FDd0JHOztBRHZCSixVQUFHekUsRUFBRVcsUUFBRixDQUFXc1gsRUFBWCxDQUFIO0FBQ0N5SyxrQkFBVWplLElBQUluQixPQUFKLENBQVkyVSxFQUFaLENBQVY7O0FBQ0EsWUFBR3lLLE9BQUg7QUFDQ0Esa0JBQVEsUUFBUixJQUFvQkEsUUFBUXBoQixJQUE1QjtBQUNBLGlCQUFPb2hCLE9BQVA7QUFKRjtBQUFBLGFBS0ssSUFBRzFpQixFQUFFK0ksT0FBRixDQUFVa1AsRUFBVixDQUFIO0FBQ0ozSSxtQkFBVyxFQUFYO0FBQ0E3SyxZQUFJL0IsSUFBSixDQUFTO0FBQUUvRCxlQUFLO0FBQUUwUyxpQkFBSzRHO0FBQVA7QUFBUCxTQUFULEVBQStCaFksT0FBL0IsQ0FBdUMsVUFBQ3lpQixPQUFEO0FBQ3RDQSxrQkFBUSxRQUFSLElBQW9CQSxRQUFRcGhCLElBQTVCO0FDOEJLLGlCRDdCTGdPLFNBQVNoUCxJQUFULENBQWNvaUIsT0FBZCxDQzZCSztBRC9CTjs7QUFJQSxZQUFHLENBQUMxaUIsRUFBRTRHLE9BQUYsQ0FBVTBJLFFBQVYsQ0FBSjtBQUNDLGlCQUFPQSxRQUFQO0FBUEc7QUNzQ0Q7QUQvQ2dCLEtBQXJCOztBQW1CQW1TLHlCQUFxQixVQUFDdFksTUFBRCxFQUFTRCxPQUFUO0FBQ3BCLFVBQUF5WixFQUFBO0FBQUFBLFdBQUtwbEIsUUFBUThGLGFBQVIsQ0FBc0IsYUFBdEIsRUFBcUNDLE9BQXJDLENBQTZDO0FBQUUrSyxlQUFPbkYsT0FBVDtBQUFrQnlRLGNBQU14UTtBQUF4QixPQUE3QyxDQUFMO0FBQ0F3WixTQUFHMUssRUFBSCxHQUFROU8sTUFBUjtBQUNBLGFBQU93WixFQUFQO0FBSG9CLEtBQXJCOztBQUtBakIsMEJBQXNCLFVBQUNrQixPQUFELEVBQVUxWixPQUFWO0FBQ3JCLFVBQUEyWixHQUFBO0FBQUFBLFlBQU0sRUFBTjs7QUFDQSxVQUFHN2lCLEVBQUUrSSxPQUFGLENBQVU2WixPQUFWLENBQUg7QUFDQzVpQixVQUFFZSxJQUFGLENBQU82aEIsT0FBUCxFQUFnQixVQUFDelosTUFBRDtBQUNmLGNBQUF3WixFQUFBO0FBQUFBLGVBQUtsQixtQkFBbUJ0WSxNQUFuQixFQUEyQkQsT0FBM0IsQ0FBTDs7QUFDQSxjQUFHeVosRUFBSDtBQ3FDTyxtQkRwQ05FLElBQUl2aUIsSUFBSixDQUFTcWlCLEVBQVQsQ0NvQ007QUFDRDtBRHhDUDtBQzBDRzs7QUR0Q0osYUFBT0UsR0FBUDtBQVBxQixLQUF0Qjs7QUFTQXRCLHdCQUFvQixVQUFDdUIsS0FBRCxFQUFRNVosT0FBUjtBQUNuQixVQUFBNFIsR0FBQTtBQUFBQSxZQUFNdmQsUUFBUThGLGFBQVIsQ0FBc0IsZUFBdEIsRUFBdUNDLE9BQXZDLENBQStDd2YsS0FBL0MsRUFBc0Q7QUFBRWpqQixnQkFBUTtBQUFFbEIsZUFBSyxDQUFQO0FBQVUyQyxnQkFBTSxDQUFoQjtBQUFtQnlhLG9CQUFVO0FBQTdCO0FBQVYsT0FBdEQsQ0FBTjtBQUNBakIsVUFBSTdDLEVBQUosR0FBUzZLLEtBQVQ7QUFDQSxhQUFPaEksR0FBUDtBQUhtQixLQUFwQjs7QUFLQTBHLHlCQUFxQixVQUFDdUIsTUFBRCxFQUFTN1osT0FBVDtBQUNwQixVQUFBOFosSUFBQTtBQUFBQSxhQUFPLEVBQVA7O0FBQ0EsVUFBR2hqQixFQUFFK0ksT0FBRixDQUFVZ2EsTUFBVixDQUFIO0FBQ0MvaUIsVUFBRWUsSUFBRixDQUFPZ2lCLE1BQVAsRUFBZSxVQUFDRCxLQUFEO0FBQ2QsY0FBQWhJLEdBQUE7QUFBQUEsZ0JBQU15RyxrQkFBa0J1QixLQUFsQixFQUF5QjVaLE9BQXpCLENBQU47O0FBQ0EsY0FBRzRSLEdBQUg7QUNpRE8sbUJEaEROa0ksS0FBSzFpQixJQUFMLENBQVV3YSxHQUFWLENDZ0RNO0FBQ0Q7QURwRFA7QUNzREc7O0FEbERKLGFBQU9rSSxJQUFQO0FBUG9CLEtBQXJCOztBQVNBakIsc0JBQWtCLEVBQWxCO0FBQ0FDLG9CQUFnQixFQUFoQjtBQUNBQyx3QkFBb0IsRUFBcEI7O0FDb0RFLFFBQUksQ0FBQ3ZrQixNQUFNa2tCLEdBQUdxQixTQUFWLEtBQXdCLElBQTVCLEVBQWtDO0FBQ2hDdmxCLFVEbkRVdUMsT0NtRFYsQ0RuRGtCLFVBQUNpakIsRUFBRDtBQUNyQixZQUFBQyxTQUFBLEVBQUFmLFNBQUEsRUFBQUcsa0JBQUEsRUFBQWEsZUFBQSxFQUFBQyxjQUFBLEVBQUFDLGtCQUFBLEVBQUFDLFVBQUEsRUFBQUMsZUFBQSxFQUFBQyxRQUFBLEVBQUE5USxXQUFBLEVBQUErUSxlQUFBLEVBQUFDLHFCQUFBLEVBQUFDLGlCQUFBLEVBQUFDLFlBQUEsRUFBQUMsZUFBQSxFQUFBQyxxQkFBQSxFQUFBQyxxQkFBQSxFQUFBQyxzQkFBQSxFQUFBQyxnQkFBQSxFQUFBQyxvQkFBQSxFQUFBQyxVQUFBLEVBQUFDLGNBQUE7QUFBQVIsdUJBQWVYLEdBQUdXLFlBQWxCO0FBQ0FRLHlCQUFpQm5CLEdBQUdtQixjQUFwQjtBQUNBSixpQ0FBeUIzQywwQkFBMEJ1QyxZQUExQixDQUF6QjtBQUNBdEIsNkJBQXFCbkIsc0JBQXNCaUQsY0FBdEIsQ0FBckI7QUFDQVosbUJBQVc3WSxPQUFPL0ssTUFBUCxDQUFjZ2tCLFlBQWQsQ0FBWDtBQUNBekIsb0JBQVlsQixhQUFhbUQsY0FBYixDQUFaOztBQUVBLFlBQUdKLHNCQUFIO0FBRUNWLHVCQUFhTSxhQUFhOVMsS0FBYixDQUFtQixHQUFuQixFQUF3QixDQUF4QixDQUFiO0FBQ0F5Uyw0QkFBa0JLLGFBQWE5UyxLQUFiLENBQW1CLEdBQW5CLEVBQXdCLENBQXhCLENBQWxCO0FBQ0FvVCxpQ0FBdUJaLFVBQXZCOztBQUNBLGNBQUcsQ0FBQ3RCLGtCQUFrQmtDLG9CQUFsQixDQUFKO0FBQ0NsQyw4QkFBa0JrQyxvQkFBbEIsSUFBMEMsRUFBMUM7QUNtRE07O0FEakRQLGNBQUc1QixrQkFBSDtBQUNDNkIseUJBQWFDLGVBQWV0VCxLQUFmLENBQXFCLEdBQXJCLEVBQTBCLENBQTFCLENBQWI7QUFDQWtSLDhCQUFrQmtDLG9CQUFsQixFQUF3QyxrQkFBeEMsSUFBOERDLFVBQTlEO0FDbURNOztBQUNELGlCRGxETm5DLGtCQUFrQmtDLG9CQUFsQixFQUF3Q1gsZUFBeEMsSUFBMkRhLGNDa0RyRDtBRDlEUCxlQWNLLElBQUdBLGVBQWV6aUIsT0FBZixDQUF1QixLQUF2QixJQUFnQyxDQUFoQyxJQUFzQ2lpQixhQUFhamlCLE9BQWIsQ0FBcUIsS0FBckIsSUFBOEIsQ0FBdkU7QUFDSndpQix1QkFBYUMsZUFBZXRULEtBQWYsQ0FBcUIsS0FBckIsRUFBNEIsQ0FBNUIsQ0FBYjtBQUNBd1MsdUJBQWFNLGFBQWE5UyxLQUFiLENBQW1CLEtBQW5CLEVBQTBCLENBQTFCLENBQWI7O0FBQ0EsY0FBR2hPLE9BQU91aEIsY0FBUCxDQUFzQmYsVUFBdEIsS0FBc0N2akIsRUFBRStJLE9BQUYsQ0FBVWhHLE9BQU93Z0IsVUFBUCxDQUFWLENBQXpDO0FBQ0N4Qiw0QkFBZ0J6aEIsSUFBaEIsQ0FBcUIwSSxLQUFLQyxTQUFMLENBQWU7QUFDbkNzYix5Q0FBMkJILFVBRFE7QUFFbkNJLHVDQUF5QmpCO0FBRlUsYUFBZixDQUFyQjtBQ3FETyxtQkRqRFB2QixjQUFjMWhCLElBQWQsQ0FBbUI0aUIsRUFBbkIsQ0NpRE87QUR6REo7QUFBQSxlQVdBLElBQUdXLGFBQWFqaUIsT0FBYixDQUFxQixHQUFyQixJQUE0QixDQUE1QixJQUFrQ2lpQixhQUFhamlCLE9BQWIsQ0FBcUIsS0FBckIsTUFBK0IsQ0FBQyxDQUFyRTtBQUNKOGhCLDRCQUFrQkcsYUFBYTlTLEtBQWIsQ0FBbUIsR0FBbkIsRUFBd0IsQ0FBeEIsQ0FBbEI7QUFDQXFTLDRCQUFrQlMsYUFBYTlTLEtBQWIsQ0FBbUIsR0FBbkIsRUFBd0IsQ0FBeEIsQ0FBbEI7O0FBQ0EsY0FBR25HLE1BQUg7QUFDQytILDBCQUFjL0gsT0FBTy9LLE1BQVAsQ0FBYzZqQixlQUFkLENBQWQ7O0FBQ0EsZ0JBQUcvUSxlQUFleVAsU0FBZixJQUE0QixDQUFDLFFBQUQsRUFBVyxlQUFYLEVBQTRCbmIsUUFBNUIsQ0FBcUMwTCxZQUFZdFMsSUFBakQsQ0FBNUIsSUFBc0ZMLEVBQUVXLFFBQUYsQ0FBV2dTLFlBQVlqUyxZQUF2QixDQUF6RjtBQUNDeWlCLDBCQUFZLEVBQVo7QUFDQUEsd0JBQVVDLGVBQVYsSUFBNkIsQ0FBN0I7QUFDQUUsbUNBQXFCL2xCLFFBQVE4RixhQUFSLENBQXNCc1AsWUFBWWpTLFlBQWxDLEVBQWdEd0ksT0FBaEQsRUFBeUQ1RixPQUF6RCxDQUFpRVAsT0FBTzJnQixlQUFQLENBQWpFLEVBQTBGO0FBQUU3akIsd0JBQVFzakI7QUFBVixlQUExRixDQUFyQjtBQUNBUSxzQ0FBd0JoUixZQUFZalMsWUFBcEM7QUFDQTJpQiwrQkFBaUI5bEIsUUFBUUksU0FBUixDQUFrQmdtQixxQkFBbEIsRUFBeUN6YSxPQUF6QyxDQUFqQjtBQUNBMGEsa0NBQW9CUCxlQUFleGpCLE1BQWYsQ0FBc0J1akIsZUFBdEIsQ0FBcEI7QUFDQVcsc0NBQXdCVCxtQkFBbUJGLGVBQW5CLENBQXhCOztBQUNBLGtCQUFHUSxxQkFBcUJ4QixTQUFyQixJQUFrQ0EsVUFBVS9oQixJQUFWLEtBQWtCLE9BQXBELElBQStELENBQUMsUUFBRCxFQUFXLGVBQVgsRUFBNEI0RyxRQUE1QixDQUFxQzJjLGtCQUFrQnZqQixJQUF2RCxDQUEvRCxJQUErSEwsRUFBRVcsUUFBRixDQUFXaWpCLGtCQUFrQmxqQixZQUE3QixDQUFsSTtBQUNDc2pCLHdDQUF3Qkosa0JBQWtCbGpCLFlBQTFDO0FBQ0FvakI7O0FBQ0Esb0JBQUduUixZQUFZOFIsUUFBWixJQUF3QnJDLFVBQVVzQyxjQUFyQztBQUNDWixvQ0FBa0I3QyxtQkFBbUIrQyxxQkFBbkIsRUFBMENELHFCQUExQyxDQUFsQjtBQURELHVCQUVLLElBQUcsQ0FBQ3BSLFlBQVk4UixRQUFiLElBQXlCLENBQUNyQyxVQUFVc0MsY0FBdkM7QUFDSlosb0NBQWtCN0MsbUJBQW1CK0MscUJBQW5CLEVBQTBDRCxxQkFBMUMsQ0FBbEI7QUNtRFM7O0FBQ0QsdUJEbkRUN1osT0FBT21hLGNBQVAsSUFBeUJQLGVDbURoQjtBRDFEVjtBQzREVSx1QkRuRFQ1WixPQUFPbWEsY0FBUCxJQUF5QmYsbUJBQW1CRixlQUFuQixDQ21EaEI7QURwRVg7QUFGRDtBQUhJO0FBQUEsZUF5QkEsSUFBR2hCLGFBQWFxQixRQUFiLElBQXlCckIsVUFBVS9oQixJQUFWLEtBQWtCLE9BQTNDLElBQXNELENBQUMsUUFBRCxFQUFXLGVBQVgsRUFBNEI0RyxRQUE1QixDQUFxQ3djLFNBQVNwakIsSUFBOUMsQ0FBdEQsSUFBNkdMLEVBQUVXLFFBQUYsQ0FBVzhpQixTQUFTL2lCLFlBQXBCLENBQWhIO0FBQ0pzakIsa0NBQXdCUCxTQUFTL2lCLFlBQWpDO0FBQ0FxakIsa0NBQXdCaGhCLE9BQU8wZ0IsU0FBU25pQixJQUFoQixDQUF4QjtBQUNBd2lCOztBQUNBLGNBQUdMLFNBQVNnQixRQUFULElBQXFCckMsVUFBVXNDLGNBQWxDO0FBQ0NaLDhCQUFrQjdDLG1CQUFtQitDLHFCQUFuQixFQUEwQ0QscUJBQTFDLENBQWxCO0FBREQsaUJBRUssSUFBRyxDQUFDTixTQUFTZ0IsUUFBVixJQUFzQixDQUFDckMsVUFBVXNDLGNBQXBDO0FBQ0paLDhCQUFrQjdDLG1CQUFtQitDLHFCQUFuQixFQUEwQ0QscUJBQTFDLENBQWxCO0FDcURNOztBQUNELGlCRHJETjdaLE9BQU9tYSxjQUFQLElBQXlCUCxlQ3FEbkI7QUQ3REYsZUFTQSxJQUFHMUIsYUFBYXFCLFFBQWIsSUFBeUIsQ0FBQyxNQUFELEVBQVMsT0FBVCxFQUFrQnhjLFFBQWxCLENBQTJCbWIsVUFBVS9oQixJQUFyQyxDQUF6QixJQUF1RSxDQUFDLFFBQUQsRUFBVyxlQUFYLEVBQTRCNEcsUUFBNUIsQ0FBcUN3YyxTQUFTcGpCLElBQTlDLENBQXZFLElBQThILENBQUMsT0FBRCxFQUFVLGVBQVYsRUFBMkI0RyxRQUEzQixDQUFvQ3djLFNBQVMvaUIsWUFBN0MsQ0FBakk7QUFDSnFqQixrQ0FBd0JoaEIsT0FBTzBnQixTQUFTbmlCLElBQWhCLENBQXhCOztBQUNBLGNBQUcsQ0FBQ3RCLEVBQUU0RyxPQUFGLENBQVVtZCxxQkFBVixDQUFKO0FBQ0NHOztBQUNBLGdCQUFHOUIsVUFBVS9oQixJQUFWLEtBQWtCLE1BQXJCO0FBQ0Msa0JBQUdvakIsU0FBU2dCLFFBQVQsSUFBcUJyQyxVQUFVc0MsY0FBbEM7QUFDQ1IsbUNBQW1CeEMsb0JBQW9CcUMscUJBQXBCLEVBQTJDN2EsT0FBM0MsQ0FBbkI7QUFERCxxQkFFSyxJQUFHLENBQUN1YSxTQUFTZ0IsUUFBVixJQUFzQixDQUFDckMsVUFBVXNDLGNBQXBDO0FBQ0pSLG1DQUFtQnpDLG1CQUFtQnNDLHFCQUFuQixFQUEwQzdhLE9BQTFDLENBQW5CO0FBSkY7QUFBQSxtQkFLSyxJQUFHa1osVUFBVS9oQixJQUFWLEtBQWtCLE9BQXJCO0FBQ0osa0JBQUdvakIsU0FBU2dCLFFBQVQsSUFBcUJyQyxVQUFVc0MsY0FBbEM7QUFDQ1IsbUNBQW1CMUMsbUJBQW1CdUMscUJBQW5CLEVBQTBDN2EsT0FBMUMsQ0FBbkI7QUFERCxxQkFFSyxJQUFHLENBQUN1YSxTQUFTZ0IsUUFBVixJQUFzQixDQUFDckMsVUFBVXNDLGNBQXBDO0FBQ0pSLG1DQUFtQjNDLGtCQUFrQndDLHFCQUFsQixFQUF5QzdhLE9BQXpDLENBQW5CO0FBSkc7QUM0REc7O0FEdkRSLGdCQUFHZ2IsZ0JBQUg7QUN5RFMscUJEeERSaGEsT0FBT21hLGNBQVAsSUFBeUJILGdCQ3dEakI7QURyRVY7QUFGSTtBQUFBLGVBZ0JBLElBQUduaEIsT0FBT3VoQixjQUFQLENBQXNCVCxZQUF0QixDQUFIO0FDMkRFLGlCRDFETjNaLE9BQU9tYSxjQUFQLElBQXlCdGhCLE9BQU84Z0IsWUFBUCxDQzBEbkI7QUFDRDtBRC9JUCxPQ21ESTtBQThGRDs7QUQxREg3akIsTUFBRThGLElBQUYsQ0FBT2ljLGVBQVAsRUFBd0I5aEIsT0FBeEIsQ0FBZ0MsVUFBQzBrQixHQUFEO0FBQy9CLFVBQUFDLENBQUE7QUFBQUEsVUFBSTViLEtBQUs2YixLQUFMLENBQVdGLEdBQVgsQ0FBSjtBQUNBemEsYUFBTzBhLEVBQUVMLHlCQUFULElBQXNDLEVBQXRDO0FDNkRHLGFENURIeGhCLE9BQU82aEIsRUFBRUosdUJBQVQsRUFBa0N2a0IsT0FBbEMsQ0FBMEMsVUFBQzZrQixFQUFEO0FBQ3pDLFlBQUFDLEtBQUE7QUFBQUEsZ0JBQVEsRUFBUjs7QUFDQS9rQixVQUFFZSxJQUFGLENBQU8rakIsRUFBUCxFQUFXLFVBQUM5bkIsQ0FBRCxFQUFJbUQsQ0FBSjtBQzhETCxpQkQ3REw2aEIsY0FBYy9oQixPQUFkLENBQXNCLFVBQUMra0IsR0FBRDtBQUNyQixnQkFBQUMsT0FBQTs7QUFBQSxnQkFBR0QsSUFBSW5CLFlBQUosS0FBcUJlLEVBQUVKLHVCQUFGLEdBQTRCLEtBQTVCLEdBQW9DcmtCLENBQTVEO0FBQ0M4a0Isd0JBQVVELElBQUlYLGNBQUosQ0FBbUJ0VCxLQUFuQixDQUF5QixLQUF6QixFQUFnQyxDQUFoQyxDQUFWO0FDK0RPLHFCRDlEUGdVLE1BQU1FLE9BQU4sSUFBaUJqb0IsQ0M4RFY7QUFDRDtBRGxFUixZQzZESztBRDlETjs7QUFLQSxZQUFHLENBQUlnRCxFQUFFNEcsT0FBRixDQUFVbWUsS0FBVixDQUFQO0FDa0VNLGlCRGpFTDdhLE9BQU8wYSxFQUFFTCx5QkFBVCxFQUFvQ2prQixJQUFwQyxDQUF5Q3lrQixLQUF6QyxDQ2lFSztBQUNEO0FEMUVOLFFDNERHO0FEL0RKOztBQWNBL2tCLE1BQUVlLElBQUYsQ0FBT2toQixpQkFBUCxFQUEyQixVQUFDdGIsR0FBRCxFQUFNZCxHQUFOO0FBQzFCLFVBQUFxZixjQUFBLEVBQUE3TyxpQkFBQSxFQUFBOE8sWUFBQSxFQUFBQyxnQkFBQSxFQUFBbGtCLGFBQUEsRUFBQW1rQixpQkFBQSxFQUFBQyxjQUFBLEVBQUFDLGlCQUFBLEVBQUE5ZCxRQUFBLEVBQUErZCxTQUFBLEVBQUFDLFdBQUE7QUFBQUQsa0JBQVk3ZSxJQUFJK2UsZ0JBQWhCO0FBQ0FSLHVCQUFpQi9ELGtCQUFrQnFFLFNBQWxCLENBQWpCOztBQUNBLFVBQUcsQ0FBQ0EsU0FBSjtBQ29FSyxlRG5FSnBlLFFBQVF1ZSxJQUFSLENBQWEsc0JBQXNCOWYsR0FBdEIsR0FBNEIsZ0NBQXpDLENDbUVJO0FEcEVMO0FBR0N3Ziw0QkFBb0J4ZixHQUFwQjtBQUNBNGYsc0JBQWMsRUFBZDtBQUNBRiw0QkFBb0IsRUFBcEI7QUFDQXJrQix3QkFBZ0IzRCxRQUFRSSxTQUFSLENBQWtCMG5CLGlCQUFsQixFQUFxQ25jLE9BQXJDLENBQWhCO0FBQ0FpYyx1QkFBZW5sQixFQUFFMEMsSUFBRixDQUFPeEIsY0FBY3JCLE1BQXJCLEVBQTZCLFVBQUNLLENBQUQ7QUFDM0MsaUJBQU8sQ0FBQyxRQUFELEVBQVcsZUFBWCxFQUE0QitHLFFBQTVCLENBQXFDL0csRUFBRUcsSUFBdkMsS0FBZ0RILEVBQUVRLFlBQUYsS0FBa0JpaEIsVUFBekU7QUFEYyxVQUFmO0FBR0F5RCwyQkFBbUJELGFBQWE3akIsSUFBaEM7QUFFQW1HLG1CQUFXLEVBQVg7QUFDQUEsaUJBQVMyZCxnQkFBVCxJQUE2QnZELFFBQTdCO0FBQ0F4TCw0QkFBb0I5WSxRQUFROEYsYUFBUixDQUFzQmdpQixpQkFBdEIsRUFBeUNuYyxPQUF6QyxDQUFwQjtBQUNBb2MseUJBQWlCalAsa0JBQWtCM1QsSUFBbEIsQ0FBdUIrRSxRQUF2QixDQUFqQjtBQUVBNmQsdUJBQWVybEIsT0FBZixDQUF1QixVQUFDMmxCLEVBQUQ7QUFDdEIsY0FBQUMsY0FBQTtBQUFBQSwyQkFBaUIsRUFBakI7O0FBQ0E3bEIsWUFBRWUsSUFBRixDQUFPNEYsR0FBUCxFQUFZLFVBQUNtZixRQUFELEVBQVdDLFFBQVg7QUFDWCxnQkFBQTNELFNBQUEsRUFBQTRELFlBQUEsRUFBQWpDLHFCQUFBLEVBQUFDLHFCQUFBLEVBQUFpQyxrQkFBQSxFQUFBQyxlQUFBOztBQUFBLGdCQUFHSCxhQUFZLGtCQUFmO0FBQ0NHO0FBQ0FGOztBQUNBLGtCQUFHRixTQUFTeEQsVUFBVCxDQUFvQmtELFlBQVksR0FBaEMsQ0FBSDtBQUNDUSwrQkFBZ0JGLFNBQVMvVSxLQUFULENBQWUsR0FBZixFQUFvQixDQUFwQixDQUFoQjtBQUREO0FBR0NpViwrQkFBZUYsUUFBZjtBQ29FTzs7QURsRVIxRCwwQkFBWWYscUJBQXFCNkQsY0FBckIsRUFBcUNjLFlBQXJDLENBQVo7QUFDQUMsbUNBQXFCL2tCLGNBQWNyQixNQUFkLENBQXFCa21CLFFBQXJCLENBQXJCOztBQUNBLGtCQUFHLENBQUMzRCxTQUFELElBQWMsQ0FBQzZELGtCQUFsQjtBQUNDO0FDb0VPOztBRG5FUixrQkFBRzdELFVBQVUvaEIsSUFBVixLQUFrQixPQUFsQixJQUE2QixDQUFDLFFBQUQsRUFBVyxlQUFYLEVBQTRCNEcsUUFBNUIsQ0FBcUNnZixtQkFBbUI1bEIsSUFBeEQsQ0FBN0IsSUFBOEZMLEVBQUVXLFFBQUYsQ0FBV3NsQixtQkFBbUJ2bEIsWUFBOUIsQ0FBakc7QUFDQ3NqQix3Q0FBd0JpQyxtQkFBbUJ2bEIsWUFBM0M7QUFDQXFqQix3Q0FBd0I2QixHQUFHRyxRQUFILENBQXhCOztBQUNBLG9CQUFHRSxtQkFBbUJ4QixRQUFuQixJQUErQnJDLFVBQVVzQyxjQUE1QztBQUNDd0Isb0NBQWtCakYsbUJBQW1CK0MscUJBQW5CLEVBQTBDRCxxQkFBMUMsQ0FBbEI7QUFERCx1QkFFSyxJQUFHLENBQUNrQyxtQkFBbUJ4QixRQUFwQixJQUFnQyxDQUFDckMsVUFBVXNDLGNBQTlDO0FBQ0p3QixvQ0FBa0JqRixtQkFBbUIrQyxxQkFBbkIsRUFBMENELHFCQUExQyxDQUFsQjtBQU5GO0FBQUEscUJBT0ssSUFBRyxDQUFDLE1BQUQsRUFBUyxPQUFULEVBQWtCOWMsUUFBbEIsQ0FBMkJtYixVQUFVL2hCLElBQXJDLEtBQThDLENBQUMsUUFBRCxFQUFXLGVBQVgsRUFBNEI0RyxRQUE1QixDQUFxQ2dmLG1CQUFtQjVsQixJQUF4RCxDQUE5QyxJQUErRyxDQUFDLE9BQUQsRUFBVSxlQUFWLEVBQTJCNEcsUUFBM0IsQ0FBb0NnZixtQkFBbUJ2bEIsWUFBdkQsQ0FBbEg7QUFDSnFqQix3Q0FBd0I2QixHQUFHRyxRQUFILENBQXhCOztBQUNBLG9CQUFHLENBQUMvbEIsRUFBRTRHLE9BQUYsQ0FBVW1kLHFCQUFWLENBQUo7QUFDQyxzQkFBRzNCLFVBQVUvaEIsSUFBVixLQUFrQixNQUFyQjtBQUNDLHdCQUFHNGxCLG1CQUFtQnhCLFFBQW5CLElBQStCckMsVUFBVXNDLGNBQTVDO0FBQ0N3Qix3Q0FBa0J4RSxvQkFBb0JxQyxxQkFBcEIsRUFBMkM3YSxPQUEzQyxDQUFsQjtBQURELDJCQUVLLElBQUcsQ0FBQytjLG1CQUFtQnhCLFFBQXBCLElBQWdDLENBQUNyQyxVQUFVc0MsY0FBOUM7QUFDSndCLHdDQUFrQnpFLG1CQUFtQnNDLHFCQUFuQixFQUEwQzdhLE9BQTFDLENBQWxCO0FBSkY7QUFBQSx5QkFLSyxJQUFHa1osVUFBVS9oQixJQUFWLEtBQWtCLE9BQXJCO0FBQ0osd0JBQUc0bEIsbUJBQW1CeEIsUUFBbkIsSUFBK0JyQyxVQUFVc0MsY0FBNUM7QUFDQ3dCLHdDQUFrQjFFLG1CQUFtQnVDLHFCQUFuQixFQUEwQzdhLE9BQTFDLENBQWxCO0FBREQsMkJBRUssSUFBRyxDQUFDK2MsbUJBQW1CeEIsUUFBcEIsSUFBZ0MsQ0FBQ3JDLFVBQVVzQyxjQUE5QztBQUNKd0Isd0NBQWtCM0Usa0JBQWtCd0MscUJBQWxCLEVBQXlDN2EsT0FBekMsQ0FBbEI7QUFKRztBQU5OO0FBRkk7QUFBQTtBQWNKZ2Qsa0NBQWtCTixHQUFHRyxRQUFILENBQWxCO0FDMEVPOztBQUNELHFCRDFFUEYsZUFBZUcsWUFBZixJQUErQkUsZUMwRXhCO0FBQ0Q7QUQ5R1I7O0FBb0NBLGNBQUcsQ0FBQ2xtQixFQUFFNEcsT0FBRixDQUFVaWYsY0FBVixDQUFKO0FBQ0NBLDJCQUFlbG5CLEdBQWYsR0FBcUJpbkIsR0FBR2puQixHQUF4QjtBQUNBOG1CLHdCQUFZbmxCLElBQVosQ0FBaUJ1bEIsY0FBakI7QUM2RU0sbUJENUVOTixrQkFBa0JqbEIsSUFBbEIsQ0FBdUI7QUFBRTZsQixzQkFBUTtBQUFFeG5CLHFCQUFLaW5CLEdBQUdqbkIsR0FBVjtBQUFleW5CLHVCQUFPWjtBQUF0QjtBQUFWLGFBQXZCLENDNEVNO0FBTUQ7QUQzSFA7QUEyQ0F0YixlQUFPc2IsU0FBUCxJQUFvQkMsV0FBcEI7QUNtRkksZURsRkpySSxrQkFBa0JpSSxpQkFBbEIsSUFBdUNFLGlCQ2tGbkM7QUFDRDtBRG5KTDs7QUFtRUEsUUFBRzNELEdBQUd5RSxnQkFBTjtBQUNDcm1CLFFBQUVzbUIsTUFBRixDQUFTcGMsTUFBVCxFQUFpQnlRLDZCQUE2QjRMLGtCQUE3QixDQUFnRDNFLEdBQUd5RSxnQkFBbkQsRUFBcUUxRSxVQUFyRSxFQUFpRnpZLE9BQWpGLEVBQTBGMlksUUFBMUYsQ0FBakI7QUF6UEY7QUM2VUU7O0FEakZGaEIsaUJBQWUsRUFBZjs7QUFDQTdnQixJQUFFZSxJQUFGLENBQU9mLEVBQUVzSyxJQUFGLENBQU9KLE1BQVAsQ0FBUCxFQUF1QixVQUFDL0osQ0FBRDtBQUN0QixRQUFHeWdCLFdBQVczWixRQUFYLENBQW9COUcsQ0FBcEIsQ0FBSDtBQ21GSSxhRGxGSDBnQixhQUFhMWdCLENBQWIsSUFBa0IrSixPQUFPL0osQ0FBUCxDQ2tGZjtBQUNEO0FEckZKOztBQUlBLFNBQU8wZ0IsWUFBUDtBQXBSNkMsQ0FBOUM7O0FBc1JBbEcsNkJBQTZCNEwsa0JBQTdCLEdBQWtELFVBQUNGLGdCQUFELEVBQW1CMUUsVUFBbkIsRUFBK0J6WSxPQUEvQixFQUF3Q3NkLFFBQXhDO0FBQ2pELE1BQUFDLElBQUEsRUFBQTFqQixNQUFBLEVBQUEyakIsTUFBQSxFQUFBeGMsTUFBQTtBQUFBbkgsV0FBU3hGLFFBQVE4RixhQUFSLENBQXNCc2UsVUFBdEIsRUFBa0N6WSxPQUFsQyxFQUEyQzVGLE9BQTNDLENBQW1Ea2pCLFFBQW5ELENBQVQ7QUFDQUUsV0FBUywwQ0FBMENMLGdCQUExQyxHQUE2RCxJQUF0RTtBQUNBSSxTQUFPdkwsTUFBTXdMLE1BQU4sRUFBYyxrQkFBZCxDQUFQO0FBQ0F4YyxXQUFTdWMsS0FBSzFqQixNQUFMLENBQVQ7O0FBQ0EsTUFBRy9DLEVBQUV5WixRQUFGLENBQVd2UCxNQUFYLENBQUg7QUFDQyxXQUFPQSxNQUFQO0FBREQ7QUFHQzlDLFlBQVFELEtBQVIsQ0FBYyxpQ0FBZDtBQ3NGQzs7QURyRkYsU0FBTyxFQUFQO0FBVGlELENBQWxEOztBQWFBd1QsNkJBQTZCOEYsY0FBN0IsR0FBOEMsVUFBQ0MsU0FBRCxFQUFZeFgsT0FBWixFQUFxQnlkLEtBQXJCLEVBQTRCQyxTQUE1QjtBQUU3Q3JwQixVQUFRaVMsV0FBUixDQUFvQixXQUFwQixFQUFpQzlNLElBQWpDLENBQXNDO0FBQ3JDMkwsV0FBT25GLE9BRDhCO0FBRXJDK1AsWUFBUXlIO0FBRjZCLEdBQXRDLEVBR0d6Z0IsT0FISCxDQUdXLFVBQUM0bUIsRUFBRDtBQ3FGUixXRHBGRjdtQixFQUFFZSxJQUFGLENBQU84bEIsR0FBR0MsUUFBVixFQUFvQixVQUFDQyxTQUFELEVBQVlDLEdBQVo7QUFDbkIsVUFBQTltQixDQUFBLEVBQUErbUIsT0FBQTtBQUFBL21CLFVBQUkzQyxRQUFRaVMsV0FBUixDQUFvQixzQkFBcEIsRUFBNENsTSxPQUE1QyxDQUFvRHlqQixTQUFwRCxDQUFKO0FBQ0FFLGdCQUFVLElBQUlDLEdBQUdDLElBQVAsRUFBVjtBQ3NGRyxhRHBGSEYsUUFBUUcsVUFBUixDQUFtQmxuQixFQUFFbW5CLGdCQUFGLENBQW1CLE9BQW5CLENBQW5CLEVBQWdEO0FBQzlDaG5CLGNBQU1ILEVBQUVvbkIsUUFBRixDQUFXam5CO0FBRDZCLE9BQWhELEVBRUcsVUFBQzhQLEdBQUQ7QUFDRixZQUFBb1gsUUFBQTs7QUFBQSxZQUFJcFgsR0FBSjtBQUNDLGdCQUFNLElBQUloVCxPQUFPa1QsS0FBWCxDQUFpQkYsSUFBSWhKLEtBQXJCLEVBQTRCZ0osSUFBSXFYLE1BQWhDLENBQU47QUNzRkk7O0FEcEZMUCxnQkFBUTNsQixJQUFSLENBQWFwQixFQUFFb0IsSUFBRixFQUFiO0FBQ0EybEIsZ0JBQVFRLElBQVIsQ0FBYXZuQixFQUFFdW5CLElBQUYsRUFBYjtBQUNBRixtQkFBVztBQUNWeGMsaUJBQU83SyxFQUFFcW5CLFFBQUYsQ0FBV3hjLEtBRFI7QUFFVjJjLHNCQUFZeG5CLEVBQUVxbkIsUUFBRixDQUFXRyxVQUZiO0FBR1ZyWixpQkFBT25GLE9BSEc7QUFJVi9GLG9CQUFVd2pCLEtBSkE7QUFLVmdCLG1CQUFTZixTQUxDO0FBTVYzTixrQkFBUTROLEdBQUdsb0I7QUFORCxTQUFYOztBQVNBLFlBQUdxb0IsUUFBTyxDQUFWO0FBQ0NPLG1CQUFTMUosT0FBVCxHQUFtQixJQUFuQjtBQ3FGSTs7QURuRkxvSixnQkFBUU0sUUFBUixHQUFtQkEsUUFBbkI7QUNxRkksZURwRkpscUIsSUFBSXNnQixTQUFKLENBQWM5TyxNQUFkLENBQXFCb1ksT0FBckIsQ0NvRkk7QUR6R0wsUUNvRkc7QUR4RkosTUNvRkU7QUR4Rkg7QUFGNkMsQ0FBOUM7O0FBbUNBdE0sNkJBQTZCNEYsMEJBQTdCLEdBQTBELFVBQUNHLFNBQUQsRUFBWWlHLEtBQVosRUFBbUJ6ZCxPQUFuQjtBQUN6RDNMLFVBQVE4RixhQUFSLENBQXNCcWQsVUFBVTNSLENBQWhDLEVBQW1DN0YsT0FBbkMsRUFBNENvRixNQUE1QyxDQUFtRG9TLFVBQVUxUixHQUFWLENBQWMsQ0FBZCxDQUFuRCxFQUFxRTtBQUNwRTRZLFdBQU87QUFDTmpLLGlCQUFXO0FBQ1ZrSyxlQUFPLENBQUM7QUFDUGxwQixlQUFLZ29CLEtBREU7QUFFUHhLLGlCQUFPO0FBRkEsU0FBRCxDQURHO0FBS1YyTCxtQkFBVztBQUxEO0FBREwsS0FENkQ7QUFVcEVyWixVQUFNO0FBQ0xzWixjQUFRLElBREg7QUFFTEMsc0JBQWdCO0FBRlg7QUFWOEQsR0FBckU7QUFEeUQsQ0FBMUQ7O0FBb0JBck4sNkJBQTZCNkYsaUNBQTdCLEdBQWlFLFVBQUNwRCxpQkFBRCxFQUFvQnVKLEtBQXBCLEVBQTJCemQsT0FBM0I7QUFDaEVsSixJQUFFZSxJQUFGLENBQU9xYyxpQkFBUCxFQUEwQixVQUFDNkssVUFBRCxFQUFhNUMsaUJBQWI7QUFDekIsUUFBQWhQLGlCQUFBO0FBQUFBLHdCQUFvQjlZLFFBQVE4RixhQUFSLENBQXNCZ2lCLGlCQUF0QixFQUF5Q25jLE9BQXpDLENBQXBCO0FDd0ZFLFdEdkZGbEosRUFBRWUsSUFBRixDQUFPa25CLFVBQVAsRUFBbUIsVUFBQ3BkLElBQUQ7QUN3RmYsYUR2Rkh3TCxrQkFBa0IvSCxNQUFsQixDQUF5QnpELEtBQUtzYixNQUFMLENBQVl4bkIsR0FBckMsRUFBMEM7QUFDekM4UCxjQUFNO0FBQ0xrUCxxQkFBVyxDQUFDO0FBQ1hoZixpQkFBS2dvQixLQURNO0FBRVh4SyxtQkFBTztBQUZJLFdBQUQsQ0FETjtBQUtMZ0ssa0JBQVF0YixLQUFLc2I7QUFMUjtBQURtQyxPQUExQyxDQ3VGRztBRHhGSixNQ3VGRTtBRHpGSDtBQURnRSxDQUFqRTs7QUFnQkF4TCw2QkFBNkI4QyxpQkFBN0IsR0FBaUQsVUFBQ2lELFNBQUQsRUFBWXhYLE9BQVo7QUFDaEQsTUFBQW5HLE1BQUE7QUFBQUEsV0FBU3hGLFFBQVE4RixhQUFSLENBQXNCcWQsVUFBVTNSLENBQWhDLEVBQW1DN0YsT0FBbkMsRUFBNEM1RixPQUE1QyxDQUFvRDtBQUM1RDNFLFNBQUsraEIsVUFBVTFSLEdBQVYsQ0FBYyxDQUFkLENBRHVEO0FBQ3JDMk8sZUFBVztBQUFFdUssZUFBUztBQUFYO0FBRDBCLEdBQXBELEVBRU47QUFBRXJvQixZQUFRO0FBQUU4ZCxpQkFBVztBQUFiO0FBQVYsR0FGTSxDQUFUOztBQUlBLE1BQUc1YSxVQUFXQSxPQUFPNGEsU0FBUCxDQUFpQixDQUFqQixFQUFvQnhCLEtBQXBCLEtBQStCLFdBQTFDLElBQTBENWUsUUFBUWlTLFdBQVIsQ0FBb0JtTyxTQUFwQixDQUE4QmpiLElBQTlCLENBQW1DSyxPQUFPNGEsU0FBUCxDQUFpQixDQUFqQixFQUFvQmhmLEdBQXZELEVBQTRENlAsS0FBNUQsS0FBc0UsQ0FBbkk7QUFDQyxVQUFNLElBQUlyUixPQUFPa1QsS0FBWCxDQUFpQixRQUFqQixFQUEyQiwrQkFBM0IsQ0FBTjtBQ2tHQztBRHhHOEMsQ0FBakQsQzs7Ozs7Ozs7Ozs7O0FFbmpCQSxJQUFBOFgsY0FBQTtBQUFBQyxXQUFXQyxHQUFYLENBQWUsTUFBZixFQUF1QixNQUF2QixFQUFnQyxVQUFDak4sR0FBRCxFQUFNa04sR0FBTixFQUFXQyxJQUFYO0FDRzlCLFNERERILFdBQVdJLFVBQVgsQ0FBc0JwTixHQUF0QixFQUEyQmtOLEdBQTNCLEVBQWdDO0FBQy9CLFFBQUF4bEIsVUFBQSxFQUFBMmxCLGNBQUEsRUFBQXhCLE9BQUE7QUFBQW5rQixpQkFBYXpGLElBQUlxckIsS0FBakI7QUFDQUQscUJBQWlCbHJCLFFBQVFJLFNBQVIsQ0FBa0IsV0FBbEIsRUFBK0I0WixFQUFoRDs7QUFFQSxRQUFHNkQsSUFBSXNOLEtBQUosSUFBY3ROLElBQUlzTixLQUFKLENBQVUsQ0FBVixDQUFqQjtBQUVDekIsZ0JBQVUsSUFBSUMsR0FBR0MsSUFBUCxFQUFWO0FDQ0csYURBSEYsUUFBUUcsVUFBUixDQUFtQmhNLElBQUlzTixLQUFKLENBQVUsQ0FBVixFQUFhdFksSUFBaEMsRUFBc0M7QUFBQy9QLGNBQU0rYSxJQUFJc04sS0FBSixDQUFVLENBQVYsRUFBYUM7QUFBcEIsT0FBdEMsRUFBcUUsVUFBQ3hZLEdBQUQ7QUFDcEUsWUFBQXlZLElBQUEsRUFBQXhpQixDQUFBLEVBQUF5aUIsU0FBQSxFQUFBQyxPQUFBLEVBQUFDLFFBQUEsRUFBQXhCLFFBQUEsRUFBQXlCLFlBQUEsRUFBQXZyQixXQUFBLEVBQUFzTixLQUFBLEVBQUEyYyxVQUFBLEVBQUF6TyxNQUFBLEVBQUE3YSxTQUFBLEVBQUE2cUIsSUFBQSxFQUFBeEIsSUFBQSxFQUFBcFosS0FBQTtBQUFBMGEsbUJBQVczTixJQUFJc04sS0FBSixDQUFVLENBQVYsRUFBYUssUUFBeEI7QUFDQUYsb0JBQVlFLFNBQVNoWSxLQUFULENBQWUsR0FBZixFQUFvQnZJLEdBQXBCLEVBQVo7O0FBQ0EsWUFBRyxDQUFDLFdBQUQsRUFBYyxXQUFkLEVBQTJCLFlBQTNCLEVBQXlDLFdBQXpDLEVBQXNEdkIsUUFBdEQsQ0FBK0Q4aEIsU0FBU0csV0FBVCxFQUEvRCxDQUFIO0FBQ0NILHFCQUFXLFdBQVc3UyxPQUFPLElBQUl2SCxJQUFKLEVBQVAsRUFBbUJzSCxNQUFuQixDQUEwQixnQkFBMUIsQ0FBWCxHQUF5RCxHQUF6RCxHQUErRDRTLFNBQTFFO0FDSUk7O0FERkxELGVBQU94TixJQUFJd04sSUFBWDs7QUFDQTtBQUNDLGNBQUdBLFNBQVNBLEtBQUssYUFBTCxNQUF1QixJQUF2QixJQUErQkEsS0FBSyxhQUFMLE1BQXVCLE1BQS9ELENBQUg7QUFDQ0csdUJBQVdJLG1CQUFtQkosUUFBbkIsQ0FBWDtBQUZGO0FBQUEsaUJBQUE1aEIsS0FBQTtBQUdNZixjQUFBZSxLQUFBO0FBQ0xDLGtCQUFRRCxLQUFSLENBQWM0aEIsUUFBZDtBQUNBM2hCLGtCQUFRRCxLQUFSLENBQWNmLENBQWQ7QUFDQTJpQixxQkFBV0EsU0FBU2ppQixPQUFULENBQWlCLElBQWpCLEVBQXVCLEdBQXZCLENBQVg7QUNNSTs7QURKTG1nQixnQkFBUTNsQixJQUFSLENBQWF5bkIsUUFBYjs7QUFFQSxZQUFHSCxRQUFRQSxLQUFLLE9BQUwsQ0FBUixJQUF5QkEsS0FBSyxPQUFMLENBQXpCLElBQTBDQSxLQUFLLFdBQUwsQ0FBMUMsSUFBZ0VBLEtBQUssYUFBTCxDQUFuRTtBQUNDM1AsbUJBQVMyUCxLQUFLLFFBQUwsQ0FBVDtBQUNBN2Qsa0JBQVE2ZCxLQUFLLE9BQUwsQ0FBUjtBQUNBbEIsdUJBQWFrQixLQUFLLFlBQUwsQ0FBYjtBQUNBdmEsa0JBQVF1YSxLQUFLLE9BQUwsQ0FBUjtBQUNBeHFCLHNCQUFZd3FCLEtBQUssV0FBTCxDQUFaO0FBQ0FuckIsd0JBQWNtckIsS0FBSyxhQUFMLENBQWQ7QUFDQTNQLG1CQUFTMlAsS0FBSyxRQUFMLENBQVQ7QUFDQXJCLHFCQUFXO0FBQUN4YyxtQkFBTUEsS0FBUDtBQUFjMmMsd0JBQVdBLFVBQXpCO0FBQXFDclosbUJBQU1BLEtBQTNDO0FBQWtEalEsdUJBQVVBLFNBQTVEO0FBQXVFWCx5QkFBYUE7QUFBcEYsV0FBWDs7QUFDQSxjQUFHd2IsTUFBSDtBQUNDc08scUJBQVN0TyxNQUFULEdBQWtCQSxNQUFsQjtBQ1dLOztBRFZOZ08sa0JBQVFNLFFBQVIsR0FBbUJBLFFBQW5CO0FBQ0F1QixvQkFBVWhtQixXQUFXK0wsTUFBWCxDQUFrQm9ZLE9BQWxCLENBQVY7QUFaRDtBQWVDNkIsb0JBQVVobUIsV0FBVytMLE1BQVgsQ0FBa0JvWSxPQUFsQixDQUFWO0FDV0k7O0FEUkxRLGVBQU9xQixRQUFReEIsUUFBUixDQUFpQkcsSUFBeEI7O0FBQ0EsWUFBRyxDQUFDQSxJQUFKO0FBQ0NBLGlCQUFPLElBQVA7QUNVSTs7QURUTCxZQUFHeE8sTUFBSDtBQUNDd1AseUJBQWVuYSxNQUFmLENBQXNCO0FBQUMzUCxpQkFBSXNhO0FBQUwsV0FBdEIsRUFBbUM7QUFDbEN4SyxrQkFDQztBQUFBb2EseUJBQVdBLFNBQVg7QUFDQXBCLG9CQUFNQSxJQUROO0FBRUEvWSx3QkFBVyxJQUFJQyxJQUFKLEVBRlg7QUFHQUMsMkJBQWE3RDtBQUhiLGFBRmlDO0FBTWxDNmMsbUJBQ0M7QUFBQWQsd0JBQ0M7QUFBQWUsdUJBQU8sQ0FBRWlCLFFBQVFucUIsR0FBVixDQUFQO0FBQ0FtcEIsMkJBQVc7QUFEWDtBQUREO0FBUGlDLFdBQW5DO0FBREQ7QUFhQ2tCLHlCQUFlUCxlQUFldFcsTUFBZixDQUFzQnRELE1BQXRCLENBQTZCO0FBQzNDdk4sa0JBQU15bkIsUUFEcUM7QUFFM0NqSix5QkFBYSxFQUY4QjtBQUczQytJLHVCQUFXQSxTQUhnQztBQUkzQ3BCLGtCQUFNQSxJQUpxQztBQUszQ1gsc0JBQVUsQ0FBQ2dDLFFBQVFucUIsR0FBVCxDQUxpQztBQU0zQ3NhLG9CQUFRO0FBQUNsSyxpQkFBRXRSLFdBQUg7QUFBZXVSLG1CQUFJLENBQUM1USxTQUFEO0FBQW5CLGFBTm1DO0FBTzNDMk0sbUJBQU9BLEtBUG9DO0FBUTNDc0QsbUJBQU9BLEtBUm9DO0FBUzNDWSxxQkFBVSxJQUFJTixJQUFKLEVBVGlDO0FBVTNDTyx3QkFBWW5FLEtBVitCO0FBVzNDMkQsc0JBQVcsSUFBSUMsSUFBSixFQVhnQztBQVkzQ0MseUJBQWE3RDtBQVo4QixXQUE3QixDQUFmO0FBY0ErZCxrQkFBUXhhLE1BQVIsQ0FBZTtBQUFDRyxrQkFBTTtBQUFDLGlDQUFvQnVhO0FBQXJCO0FBQVAsV0FBZjtBQ3VCSTs7QURyQkxDLGVBQ0M7QUFBQUcsc0JBQVlOLFFBQVFucUIsR0FBcEI7QUFDQThvQixnQkFBTUE7QUFETixTQUREO0FBSUFhLFlBQUllLFNBQUosQ0FBYyxrQkFBZCxFQUFpQ1AsUUFBUW5xQixHQUF6QztBQUNBMnBCLFlBQUlnQixHQUFKLENBQVF0Z0IsS0FBS0MsU0FBTCxDQUFlZ2dCLElBQWYsQ0FBUjtBQXhFRCxRQ0FHO0FESEo7QUE4RUNYLFVBQUlpQixVQUFKLEdBQWlCLEdBQWpCO0FDdUJHLGFEdEJIakIsSUFBSWdCLEdBQUosRUNzQkc7QUFDRDtBRDFHSixJQ0NDO0FESEY7QUF1RkFsQixXQUFXQyxHQUFYLENBQWUsTUFBZixFQUF1QixpQkFBdkIsRUFBMkMsVUFBQ2pOLEdBQUQsRUFBTWtOLEdBQU4sRUFBV0MsSUFBWDtBQUMxQyxNQUFBaUIsY0FBQSxFQUFBcGpCLENBQUEsRUFBQStDLE1BQUE7O0FBQUE7QUFDQ0EsYUFBU3JLLFFBQVEycUIsc0JBQVIsQ0FBK0JyTyxHQUEvQixFQUFvQ2tOLEdBQXBDLENBQVQ7O0FBQ0EsUUFBRyxDQUFDbmYsTUFBSjtBQUNDLFlBQU0sSUFBSWhNLE9BQU9rVCxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGVBQXRCLENBQU47QUMyQkU7O0FEekJIbVoscUJBQWlCcE8sSUFBSXNPLE1BQUosQ0FBVzVtQixVQUE1QjtBQUVBc2xCLGVBQVdJLFVBQVgsQ0FBc0JwTixHQUF0QixFQUEyQmtOLEdBQTNCLEVBQWdDO0FBQy9CLFVBQUF4bEIsVUFBQSxFQUFBbWtCLE9BQUEsRUFBQTBDLFVBQUE7QUFBQTdtQixtQkFBYXpGLElBQUltc0IsY0FBSixDQUFiOztBQUVBLFVBQUcsQ0FBSTFtQixVQUFQO0FBQ0MsY0FBTSxJQUFJM0YsT0FBT2tULEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsZUFBdEIsQ0FBTjtBQzBCRzs7QUR4QkosVUFBRytLLElBQUlzTixLQUFKLElBQWN0TixJQUFJc04sS0FBSixDQUFVLENBQVYsQ0FBakI7QUFFQ3pCLGtCQUFVLElBQUlDLEdBQUdDLElBQVAsRUFBVjtBQUNBRixnQkFBUTNsQixJQUFSLENBQWE4WixJQUFJc04sS0FBSixDQUFVLENBQVYsRUFBYUssUUFBMUI7O0FBRUEsWUFBRzNOLElBQUl3TixJQUFQO0FBQ0MzQixrQkFBUU0sUUFBUixHQUFtQm5NLElBQUl3TixJQUF2QjtBQ3dCSTs7QUR0QkwzQixnQkFBUWxjLEtBQVIsR0FBZ0I1QixNQUFoQjtBQUNBOGQsZ0JBQVFNLFFBQVIsQ0FBaUJ4YyxLQUFqQixHQUF5QjVCLE1BQXpCO0FBRUE4ZCxnQkFBUUcsVUFBUixDQUFtQmhNLElBQUlzTixLQUFKLENBQVUsQ0FBVixFQUFhdFksSUFBaEMsRUFBc0M7QUFBQy9QLGdCQUFNK2EsSUFBSXNOLEtBQUosQ0FBVSxDQUFWLEVBQWFDO0FBQXBCLFNBQXRDO0FBRUE3bEIsbUJBQVcrTCxNQUFYLENBQWtCb1ksT0FBbEI7QUFFQTBDLHFCQUFhN21CLFdBQVc0bEIsS0FBWCxDQUFpQnBsQixPQUFqQixDQUF5QjJqQixRQUFRdG9CLEdBQWpDLENBQWI7QUFDQXlwQixtQkFBV3dCLFVBQVgsQ0FBc0J0QixHQUF0QixFQUNDO0FBQUE5SixnQkFBTSxHQUFOO0FBQ0FwTyxnQkFBTXVaO0FBRE4sU0FERDtBQWhCRDtBQXFCQyxjQUFNLElBQUl4c0IsT0FBT2tULEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsU0FBdEIsQ0FBTjtBQ3VCRztBRGxETDtBQVBELFdBQUFsSixLQUFBO0FBcUNNZixRQUFBZSxLQUFBO0FBQ0xDLFlBQVFELEtBQVIsQ0FBY2YsRUFBRXlqQixLQUFoQjtBQ3dCRSxXRHZCRnpCLFdBQVd3QixVQUFYLENBQXNCdEIsR0FBdEIsRUFBMkI7QUFDMUI5SixZQUFNcFksRUFBRWUsS0FBRixJQUFXLEdBRFM7QUFFMUJpSixZQUFNO0FBQUMwWixnQkFBUTFqQixFQUFFb2hCLE1BQUYsSUFBWXBoQixFQUFFMmpCO0FBQXZCO0FBRm9CLEtBQTNCLENDdUJFO0FBTUQ7QURyRUg7O0FBK0NBNUIsaUJBQWlCLFVBQUM2QixXQUFELEVBQWNDLGVBQWQsRUFBK0J0WixLQUEvQixFQUFzQ3VaLE1BQXRDO0FBQ2hCLE1BQUFDLEdBQUEsRUFBQUMsd0JBQUEsRUFBQXJVLElBQUEsRUFBQXNVLFNBQUEsRUFBQUMsUUFBQSxFQUFBQyxZQUFBO0FBQUFuakIsVUFBUUMsR0FBUixDQUFZLHNDQUFaO0FBQ0E4aUIsUUFBTTdoQixRQUFRLFlBQVIsQ0FBTjtBQUNBeU4sU0FBT29VLElBQUlLLElBQUosQ0FBU3pVLElBQVQsQ0FBY1osT0FBZCxFQUFQO0FBRUF4RSxRQUFNOFosTUFBTixHQUFlLE1BQWY7QUFDQTlaLFFBQU0rWixPQUFOLEdBQWdCLFlBQWhCO0FBQ0EvWixRQUFNZ2EsV0FBTixHQUFvQlgsV0FBcEI7QUFDQXJaLFFBQU1pYSxlQUFOLEdBQXdCLFdBQXhCO0FBQ0FqYSxRQUFNa2EsU0FBTixHQUFrQlYsSUFBSUssSUFBSixDQUFTelUsSUFBVCxDQUFjK1UsT0FBZCxDQUFzQi9VLElBQXRCLENBQWxCO0FBQ0FwRixRQUFNb2EsZ0JBQU4sR0FBeUIsS0FBekI7QUFDQXBhLFFBQU1xYSxjQUFOLEdBQXVCeFMsT0FBT3pDLEtBQUtrVixPQUFMLEVBQVAsQ0FBdkI7QUFFQVosY0FBWXBsQixPQUFPcUYsSUFBUCxDQUFZcUcsS0FBWixDQUFaO0FBQ0EwWixZQUFVM2tCLElBQVY7QUFFQTBrQiw2QkFBMkIsRUFBM0I7QUFDQUMsWUFBVXBxQixPQUFWLENBQWtCLFVBQUNxQixJQUFEO0FDd0JmLFdEdkJGOG9CLDRCQUE0QixNQUFNOW9CLElBQU4sR0FBYSxHQUFiLEdBQW1CNm9CLElBQUlLLElBQUosQ0FBU1UsU0FBVCxDQUFtQnZhLE1BQU1yUCxJQUFOLENBQW5CLENDdUI3QztBRHhCSDtBQUdBaXBCLGlCQUFlTCxPQUFPaUIsV0FBUCxLQUF1QixPQUF2QixHQUFpQ2hCLElBQUlLLElBQUosQ0FBU1UsU0FBVCxDQUFtQmQseUJBQXlCZ0IsTUFBekIsQ0FBZ0MsQ0FBaEMsQ0FBbkIsQ0FBaEQ7QUFFQXphLFFBQU0wYSxTQUFOLEdBQWtCbEIsSUFBSUssSUFBSixDQUFTYyxNQUFULENBQWdCQyxJQUFoQixDQUFxQnRCLGtCQUFrQixHQUF2QyxFQUE0Q00sWUFBNUMsRUFBMEQsUUFBMUQsRUFBb0UsTUFBcEUsQ0FBbEI7QUFFQUQsYUFBV0gsSUFBSUssSUFBSixDQUFTZ0IsbUJBQVQsQ0FBNkI3YSxLQUE3QixDQUFYO0FBQ0F2SixVQUFRQyxHQUFSLENBQVlpakIsUUFBWjtBQUNBLFNBQU9BLFFBQVA7QUExQmdCLENBQWpCOztBQTRCQWxDLFdBQVdDLEdBQVgsQ0FBZSxNQUFmLEVBQXVCLGdCQUF2QixFQUEwQyxVQUFDak4sR0FBRCxFQUFNa04sR0FBTixFQUFXQyxJQUFYO0FBQ3pDLE1BQUE0QixHQUFBLEVBQUFYLGNBQUEsRUFBQXBqQixDQUFBLEVBQUErQyxNQUFBOztBQUFBO0FBQ0NBLGFBQVNySyxRQUFRMnFCLHNCQUFSLENBQStCck8sR0FBL0IsRUFBb0NrTixHQUFwQyxDQUFUOztBQUNBLFFBQUcsQ0FBQ25mLE1BQUo7QUFDQyxZQUFNLElBQUloTSxPQUFPa1QsS0FBWCxDQUFpQixHQUFqQixFQUFzQixlQUF0QixDQUFOO0FDd0JFOztBRHRCSG1aLHFCQUFpQixRQUFqQjtBQUVBVyxVQUFNN2hCLFFBQVEsWUFBUixDQUFOO0FBRUE4ZixlQUFXSSxVQUFYLENBQXNCcE4sR0FBdEIsRUFBMkJrTixHQUEzQixFQUFnQztBQUMvQixVQUFBMEIsV0FBQSxFQUFBbG5CLFVBQUEsRUFBQWlULElBQUEsRUFBQTBWLEdBQUEsRUFBQTlhLEtBQUEsRUFBQSthLENBQUEsRUFBQWh1QixHQUFBLEVBQUFzRixJQUFBLEVBQUFDLElBQUEsRUFBQTBvQixJQUFBLEVBQUExQixlQUFBLEVBQUEyQixhQUFBLEVBQUFDLFVBQUEsRUFBQTNzQixHQUFBLEVBQUE0c0IsT0FBQTtBQUFBaHBCLG1CQUFhekYsSUFBSW1zQixjQUFKLENBQWI7O0FBRUEsVUFBRyxDQUFJMW1CLFVBQVA7QUFDQyxjQUFNLElBQUkzRixPQUFPa1QsS0FBWCxDQUFpQixHQUFqQixFQUFzQixlQUF0QixDQUFOO0FDc0JHOztBRHBCSixVQUFHK0ssSUFBSXNOLEtBQUosSUFBY3ROLElBQUlzTixLQUFKLENBQVUsQ0FBVixDQUFqQjtBQUVDLFlBQUdjLG1CQUFrQixRQUFsQixNQUFBOXJCLE1BQUFQLE9BQUFDLFFBQUEsV0FBQUMsR0FBQSxZQUFBSyxJQUEyRE8sS0FBM0QsR0FBMkQsTUFBM0QsTUFBb0UsS0FBdkU7QUFDQytyQix3QkFBQSxDQUFBaG5CLE9BQUE3RixPQUFBQyxRQUFBLENBQUFDLEdBQUEsQ0FBQUMsTUFBQSxZQUFBMEYsS0FBMENnbkIsV0FBMUMsR0FBMEMsTUFBMUM7QUFDQUMsNEJBQUEsQ0FBQWhuQixPQUFBOUYsT0FBQUMsUUFBQSxDQUFBQyxHQUFBLENBQUFDLE1BQUEsWUFBQTJGLEtBQThDZ25CLGVBQTlDLEdBQThDLE1BQTlDO0FBRUFsVSxpQkFBT29VLElBQUlLLElBQUosQ0FBU3pVLElBQVQsQ0FBY1osT0FBZCxFQUFQO0FBRUF4RSxrQkFBUTtBQUNQb2Isb0JBQVEsbUJBREQ7QUFFUEMsbUJBQU81USxJQUFJc04sS0FBSixDQUFVLENBQVYsRUFBYUssUUFGYjtBQUdQa0Qsc0JBQVU3USxJQUFJc04sS0FBSixDQUFVLENBQVYsRUFBYUs7QUFIaEIsV0FBUjtBQU1BN3BCLGdCQUFNLDBDQUEwQ2lwQixlQUFlNkIsV0FBZixFQUE0QkMsZUFBNUIsRUFBNkN0WixLQUE3QyxFQUFvRCxLQUFwRCxDQUFoRDtBQUVBK2EsY0FBSVEsS0FBS0MsSUFBTCxDQUFVLEtBQVYsRUFBaUJqdEIsR0FBakIsQ0FBSjtBQUVBa0ksa0JBQVFDLEdBQVIsQ0FBWXFrQixDQUFaOztBQUVBLGVBQUFDLE9BQUFELEVBQUF0YixJQUFBLFlBQUF1YixLQUFXUyxPQUFYLEdBQVcsTUFBWDtBQUNDTixzQkFBVUosRUFBRXRiLElBQUYsQ0FBT2djLE9BQWpCO0FBQ0FSLDRCQUFnQjVpQixLQUFLNmIsS0FBTCxDQUFXLElBQUk3UCxNQUFKLENBQVcwVyxFQUFFdGIsSUFBRixDQUFPaWMsYUFBbEIsRUFBaUMsUUFBakMsRUFBMkNDLFFBQTNDLEVBQVgsQ0FBaEI7QUFDQWxsQixvQkFBUUMsR0FBUixDQUFZdWtCLGFBQVo7QUFDQUMseUJBQWE3aUIsS0FBSzZiLEtBQUwsQ0FBVyxJQUFJN1AsTUFBSixDQUFXMFcsRUFBRXRiLElBQUYsQ0FBT21jLFVBQWxCLEVBQThCLFFBQTlCLEVBQXdDRCxRQUF4QyxFQUFYLENBQWI7QUFDQWxsQixvQkFBUUMsR0FBUixDQUFZd2tCLFVBQVo7QUFFQUosa0JBQU0sSUFBSXRCLElBQUlxQyxHQUFSLENBQVk7QUFDakIsNkJBQWVYLFdBQVdsQixXQURUO0FBRWpCLGlDQUFtQmtCLFdBQVdZLGVBRmI7QUFHakIsMEJBQVliLGNBQWNjLFFBSFQ7QUFJakIsNEJBQWMsWUFKRztBQUtqQiwrQkFBaUJiLFdBQVdjO0FBTFgsYUFBWixDQUFOO0FDb0JNLG1CRFpObEIsSUFBSW1CLFNBQUosQ0FBYztBQUNiQyxzQkFBUWpCLGNBQWNpQixNQURUO0FBRWJDLG1CQUFLbEIsY0FBY0ssUUFGTjtBQUdiYyxvQkFBTTNSLElBQUlzTixLQUFKLENBQVUsQ0FBVixFQUFhdFksSUFITjtBQUliNGMsd0NBQTBCLEVBSmI7QUFLYkMsMkJBQWE3UixJQUFJc04sS0FBSixDQUFVLENBQVYsRUFBYUMsUUFMYjtBQU1idUUsNEJBQWMsVUFORDtBQU9iQyxrQ0FBb0IsRUFQUDtBQVFiQywrQkFBaUIsT0FSSjtBQVNiQyxvQ0FBc0IsUUFUVDtBQVViQyx1QkFBUztBQVZJLGFBQWQsRUFXR253QixPQUFPb3dCLGVBQVAsQ0FBdUIsVUFBQ3BkLEdBQUQsRUFBTUMsSUFBTjtBQUV6QixrQkFBQW9kLGdCQUFBLEVBQUFDLGlCQUFBLEVBQUFDLGNBQUEsRUFBQUMsT0FBQTs7QUFBQSxrQkFBR3hkLEdBQUg7QUFDQy9JLHdCQUFRQyxHQUFSLENBQVksUUFBWixFQUFzQjhJLEdBQXRCO0FBQ0Esc0JBQU0sSUFBSWhULE9BQU9rVCxLQUFYLENBQWlCLEdBQWpCLEVBQXNCRixJQUFJNFosT0FBMUIsQ0FBTjtBQ2FPOztBRFhSM2lCLHNCQUFRQyxHQUFSLENBQVksVUFBWixFQUF3QitJLElBQXhCO0FBRUF1ZCx3QkFBVXhELElBQUlLLElBQUosQ0FBU3pVLElBQVQsQ0FBY1osT0FBZCxFQUFWO0FBRUFxWSxpQ0FBbUI7QUFDbEJ6Qix3QkFBUSxhQURVO0FBRWxCSyx5QkFBU047QUFGUyxlQUFuQjtBQUtBNEIsK0JBQWlCLDBDQUEwQ3ZGLGVBQWU2QixXQUFmLEVBQTRCQyxlQUE1QixFQUE2Q3VELGdCQUE3QyxFQUErRCxLQUEvRCxDQUEzRDtBQUVBQyxrQ0FBb0J2QixLQUFLQyxJQUFMLENBQVUsS0FBVixFQUFpQnVCLGNBQWpCLENBQXBCO0FDU08scUJEUFB0RixXQUFXd0IsVUFBWCxDQUFzQnRCLEdBQXRCLEVBQ0M7QUFBQTlKLHNCQUFNLEdBQU47QUFDQXBPLHNCQUFNcWQ7QUFETixlQURELENDT087QUQxQkwsY0FYSCxDQ1lNO0FEN0NSO0FBRkQ7QUFBQTtBQXNFQyxjQUFNLElBQUl0d0IsT0FBT2tULEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsU0FBdEIsQ0FBTjtBQ1dHO0FEdkZMO0FBVEQsV0FBQWxKLEtBQUE7QUF3Rk1mLFFBQUFlLEtBQUE7QUFDTEMsWUFBUUQsS0FBUixDQUFjZixFQUFFeWpCLEtBQWhCO0FDWUUsV0RYRnpCLFdBQVd3QixVQUFYLENBQXNCdEIsR0FBdEIsRUFBMkI7QUFDMUI5SixZQUFNcFksRUFBRWUsS0FBRixJQUFXLEdBRFM7QUFFMUJpSixZQUFNO0FBQUMwWixnQkFBUTFqQixFQUFFb2hCLE1BQUYsSUFBWXBoQixFQUFFMmpCO0FBQXZCO0FBRm9CLEtBQTNCLENDV0U7QUFNRDtBRDVHSCxHOzs7Ozs7Ozs7Ozs7QUVsS0EzQixXQUFXQyxHQUFYLENBQWUsTUFBZixFQUF1Qiw2QkFBdkIsRUFBc0QsVUFBQ2pOLEdBQUQsRUFBTWtOLEdBQU4sRUFBV0MsSUFBWDtBQUNyRCxNQUFBcUYsZUFBQSxFQUFBQyxpQkFBQSxFQUFBem5CLENBQUEsRUFBQTBuQixRQUFBLEVBQUFDLGtCQUFBOztBQUFBO0FBQ0NGLHdCQUFvQmxULDZCQUE2QlEsbUJBQTdCLENBQWlEQyxHQUFqRCxDQUFwQjtBQUNBd1Msc0JBQWtCQyxrQkFBa0JsdkIsR0FBcEM7QUFFQW12QixlQUFXMVMsSUFBSXdOLElBQWY7QUFFQW1GLHlCQUFxQixJQUFJcm1CLEtBQUosRUFBckI7O0FBRUExSCxNQUFFZSxJQUFGLENBQU8rc0IsU0FBUyxXQUFULENBQVAsRUFBOEIsVUFBQ2pSLG9CQUFEO0FBQzdCLFVBQUFtUixPQUFBLEVBQUE3USxVQUFBO0FBQUFBLG1CQUFheEMsNkJBQTZCaUMsZUFBN0IsQ0FBNkNDLG9CQUE3QyxFQUFtRWdSLGlCQUFuRSxDQUFiO0FBRUFHLGdCQUFVendCLFFBQVFpUyxXQUFSLENBQW9CbU8sU0FBcEIsQ0FBOEJyYSxPQUE5QixDQUFzQztBQUFFM0UsYUFBS3dlO0FBQVAsT0FBdEMsRUFBMkQ7QUFBRXRkLGdCQUFRO0FBQUV3TyxpQkFBTyxDQUFUO0FBQVk0TCxnQkFBTSxDQUFsQjtBQUFxQjJELHdCQUFjLENBQW5DO0FBQXNDckIsZ0JBQU0sQ0FBNUM7QUFBK0N1Qix3QkFBYztBQUE3RDtBQUFWLE9BQTNELENBQVY7QUNTRyxhRFBIaVEsbUJBQW1CenRCLElBQW5CLENBQXdCMHRCLE9BQXhCLENDT0c7QURaSjs7QUNjRSxXRFBGNUYsV0FBV3dCLFVBQVgsQ0FBc0J0QixHQUF0QixFQUEyQjtBQUMxQjlKLFlBQU0sR0FEb0I7QUFFMUJwTyxZQUFNO0FBQUU2ZCxpQkFBU0Y7QUFBWDtBQUZvQixLQUEzQixDQ09FO0FEdEJILFdBQUE1bUIsS0FBQTtBQW1CTWYsUUFBQWUsS0FBQTtBQUNMQyxZQUFRRCxLQUFSLENBQWNmLEVBQUV5akIsS0FBaEI7QUNXRSxXRFZGekIsV0FBV3dCLFVBQVgsQ0FBc0J0QixHQUF0QixFQUEyQjtBQUMxQjlKLFlBQU0sR0FEb0I7QUFFMUJwTyxZQUFNO0FBQUUwWixnQkFBUSxDQUFDO0FBQUVvRSx3QkFBYzluQixFQUFFb2hCLE1BQUYsSUFBWXBoQixFQUFFMmpCO0FBQTlCLFNBQUQ7QUFBVjtBQUZvQixLQUEzQixDQ1VFO0FBVUQ7QUQxQ0gsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuXHRjaGVja05wbVZlcnNpb25zXHJcbn0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XHJcbmNoZWNrTnBtVmVyc2lvbnMoe1xyXG5cdGJ1c2JveTogXCJeMC4yLjEzXCIsXHJcblx0bWtkaXJwOiBcIl4wLjMuNVwiLFxyXG5cdFwieG1sMmpzXCI6IFwiXjAuNC4xOVwiLFxyXG5cdFwibm9kZS14bHN4XCI6IFwiXjAuMTIuMFwiXHJcbn0sICdzdGVlZG9zOmNyZWF0b3InKTtcclxuXHJcbmlmIChNZXRlb3Iuc2V0dGluZ3MgJiYgTWV0ZW9yLnNldHRpbmdzLmNmcyAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bikge1xyXG5cdGNoZWNrTnBtVmVyc2lvbnMoe1xyXG5cdFx0XCJhbGl5dW4tc2RrXCI6IFwiXjEuMTEuMTJcIlxyXG5cdH0sICdzdGVlZG9zOmNyZWF0b3InKTtcclxufSIsIlxyXG5cdCMgQ3JlYXRvci5pbml0QXBwcygpXHJcblxyXG5cclxuIyBDcmVhdG9yLmluaXRBcHBzID0gKCktPlxyXG4jIFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcbiMgXHRcdF8uZWFjaCBDcmVhdG9yLkFwcHMsIChhcHAsIGFwcF9pZCktPlxyXG4jIFx0XHRcdGRiX2FwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpXHJcbiMgXHRcdFx0aWYgIWRiX2FwcFxyXG4jIFx0XHRcdFx0YXBwLl9pZCA9IGFwcF9pZFxyXG4jIFx0XHRcdFx0ZGIuYXBwcy5pbnNlcnQoYXBwKVxyXG4jIGVsc2VcclxuIyBcdGFwcC5faWQgPSBhcHBfaWRcclxuIyBcdGRiLmFwcHMudXBkYXRlKHtfaWQ6IGFwcF9pZH0sIGFwcClcclxuXHJcbkNyZWF0b3IuZ2V0U2NoZW1hID0gKG9iamVjdF9uYW1lKS0+XHJcblx0cmV0dXJuIENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKT8uc2NoZW1hXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQgPSAob2JqZWN0X25hbWUpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdHJldHVybiBSZWFjdFN0ZWVkb3MucGx1Z2luQ29tcG9uZW50U2VsZWN0b3IoUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCksIFwiT2JqZWN0SG9tZVwiLCBvYmplY3RfbmFtZSlcclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0VXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cclxuXHRpZiAhYXBwX2lkXHJcblx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXHJcblx0bGlzdF92aWV3X2lkID0gbGlzdF92aWV3Py5faWRcclxuXHJcblx0aWYgcmVjb3JkX2lkXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZClcclxuXHRlbHNlXHJcblx0XHRpZiBvYmplY3RfbmFtZSBpcyBcIm1lZXRpbmdcIlxyXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCIpXHJcblx0XHRlbHNlXHJcblx0XHRcdGlmIENyZWF0b3IuZ2V0T2JqZWN0SG9tZUNvbXBvbmVudChvYmplY3RfbmFtZSlcclxuXHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQpXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdEFic29sdXRlVXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cclxuXHRpZiAhYXBwX2lkXHJcblx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXHJcblx0bGlzdF92aWV3X2lkID0gbGlzdF92aWV3Py5faWRcclxuXHJcblx0aWYgcmVjb3JkX2lkXHJcblx0XHRyZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZCwgdHJ1ZSlcclxuXHRlbHNlXHJcblx0XHRpZiBvYmplY3RfbmFtZSBpcyBcIm1lZXRpbmdcIlxyXG5cdFx0XHRyZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCIsIHRydWUpXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkLCB0cnVlKVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RSb3V0ZXJVcmwgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSAtPlxyXG5cdGlmICFhcHBfaWRcclxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXHJcblx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHJcblx0bGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbClcclxuXHRsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXc/Ll9pZFxyXG5cclxuXHRpZiByZWNvcmRfaWRcclxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZFxyXG5cdGVsc2VcclxuXHRcdGlmIG9iamVjdF9uYW1lIGlzIFwibWVldGluZ1wiXHJcblx0XHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCJcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkXHJcblxyXG5DcmVhdG9yLmdldExpc3RWaWV3VXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cclxuXHR1cmwgPSBDcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKVxyXG5cdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKHVybClcclxuXHJcbkNyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIC0+XHJcblx0aWYgbGlzdF92aWV3X2lkIGlzIFwiY2FsZW5kYXJcIlxyXG5cdFx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIlxyXG5cdGVsc2VcclxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZFxyXG5cclxuQ3JlYXRvci5nZXRTd2l0Y2hMaXN0VXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cclxuXHRpZiBsaXN0X3ZpZXdfaWRcclxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIGxpc3Rfdmlld19pZCArIFwiL2xpc3RcIilcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvbGlzdC9zd2l0Y2hcIilcclxuXHJcbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdFVybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCByZWNvcmRfaWQsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIC0+XHJcblx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgcmVjb3JkX2lkICsgXCIvXCIgKyByZWxhdGVkX29iamVjdF9uYW1lICsgXCIvZ3JpZFwiKVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMgPSAob2JqZWN0X25hbWUsIGlzX2RlZXAsIGlzX3NraXBfaGlkZSwgaXNfcmVsYXRlZCktPlxyXG5cdF9vcHRpb25zID0gW11cclxuXHR1bmxlc3Mgb2JqZWN0X25hbWVcclxuXHRcdHJldHVybiBfb3B0aW9uc1xyXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRmaWVsZHMgPSBfb2JqZWN0Py5maWVsZHNcclxuXHRpY29uID0gX29iamVjdD8uaWNvblxyXG5cdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XHJcblx0XHRpZiBpc19za2lwX2hpZGUgYW5kIGYuaGlkZGVuXHJcblx0XHRcdHJldHVyblxyXG5cdFx0aWYgZi50eXBlID09IFwic2VsZWN0XCJcclxuXHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IFwiI3tmLmxhYmVsIHx8IGt9XCIsIHZhbHVlOiBcIiN7a31cIiwgaWNvbjogaWNvbn1cclxuXHRcdGVsc2VcclxuXHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XHJcblx0aWYgaXNfZGVlcFxyXG5cdFx0Xy5mb3JFYWNoIGZpZWxkcywgKGYsIGspLT5cclxuXHRcdFx0aWYgaXNfc2tpcF9oaWRlIGFuZCBmLmhpZGRlblxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRpZiAoZi50eXBlID09IFwibG9va3VwXCIgfHwgZi50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKSAmJiBmLnJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKGYucmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdCMg5LiN5pSv5oyBZi5yZWZlcmVuY2VfdG/kuLpmdW5jdGlvbueahOaDheWGte+8jOaciemcgOaxguWGjeivtFxyXG5cdFx0XHRcdHJfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoZi5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0aWYgcl9vYmplY3RcclxuXHRcdFx0XHRcdF8uZm9yRWFjaCByX29iamVjdC5maWVsZHMsIChmMiwgazIpLT5cclxuXHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IFwiI3tmLmxhYmVsIHx8IGt9PT4je2YyLmxhYmVsIHx8IGsyfVwiLCB2YWx1ZTogXCIje2t9LiN7azJ9XCIsIGljb246IHJfb2JqZWN0Py5pY29ufVxyXG5cdGlmIGlzX3JlbGF0ZWRcclxuXHRcdHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSlcclxuXHRcdF8uZWFjaCByZWxhdGVkT2JqZWN0cywgKF9yZWxhdGVkT2JqZWN0KT0+XHJcblx0XHRcdHJlbGF0ZWRPcHRpb25zID0gQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMoX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UpXHJcblx0XHRcdHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSlcclxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRPcHRpb25zLCAocmVsYXRlZE9wdGlvbiktPlxyXG5cdFx0XHRcdGlmIF9yZWxhdGVkT2JqZWN0LmZvcmVpZ25fa2V5ICE9IHJlbGF0ZWRPcHRpb24udmFsdWVcclxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7cmVsYXRlZE9iamVjdC5sYWJlbCB8fCByZWxhdGVkT2JqZWN0Lm5hbWV9PT4je3JlbGF0ZWRPcHRpb24ubGFiZWx9XCIsIHZhbHVlOiBcIiN7cmVsYXRlZE9iamVjdC5uYW1lfS4je3JlbGF0ZWRPcHRpb24udmFsdWV9XCIsIGljb246IHJlbGF0ZWRPYmplY3Q/Lmljb259XHJcblx0cmV0dXJuIF9vcHRpb25zXHJcblxyXG4jIOe7n+S4gOS4uuWvueixoW9iamVjdF9uYW1l5o+Q5L6b5Y+v55So5LqO6L+H6JmR5Zmo6L+H6JmR5a2X5q61XHJcbkNyZWF0b3IuZ2V0T2JqZWN0RmlsdGVyRmllbGRPcHRpb25zID0gKG9iamVjdF9uYW1lKS0+XHJcblx0X29wdGlvbnMgPSBbXVxyXG5cdHVubGVzcyBvYmplY3RfbmFtZVxyXG5cdFx0cmV0dXJuIF9vcHRpb25zXHJcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xyXG5cdHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpXHJcblx0aWNvbiA9IF9vYmplY3Q/Lmljb25cclxuXHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxyXG5cdFx0IyBoaWRkZW4sZ3JpZOetieexu+Wei+eahOWtl+aute+8jOS4jemcgOimgei/h+a7pFxyXG5cdFx0aWYgIV8uaW5jbHVkZShbXCJncmlkXCIsXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwiYXZhdGFyXCIsIFwiaW1hZ2VcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSkgYW5kICFmLmhpZGRlblxyXG5cdFx0XHQjIGZpbHRlcnMuJC5maWVsZOWPimZsb3cuY3VycmVudOetieWtkOWtl+auteS5n+S4jemcgOimgei/h+a7pFxyXG5cdFx0XHRpZiAhL1xcdytcXC4vLnRlc3QoaykgYW5kIF8uaW5kZXhPZihwZXJtaXNzaW9uX2ZpZWxkcywgaykgPiAtMVxyXG5cdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBmLmxhYmVsIHx8IGssIHZhbHVlOiBrLCBpY29uOiBpY29ufVxyXG5cclxuXHRyZXR1cm4gX29wdGlvbnNcclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRPcHRpb25zID0gKG9iamVjdF9uYW1lKS0+XHJcblx0X29wdGlvbnMgPSBbXVxyXG5cdHVubGVzcyBvYmplY3RfbmFtZVxyXG5cdFx0cmV0dXJuIF9vcHRpb25zXHJcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xyXG5cdHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpXHJcblx0aWNvbiA9IF9vYmplY3Q/Lmljb25cclxuXHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxyXG5cdFx0aWYgIV8uaW5jbHVkZShbXCJncmlkXCIsXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwibWFya2Rvd25cIiwgXCJodG1sXCJdLCBmLnR5cGUpXHJcblx0XHRcdGlmICEvXFx3K1xcLi8udGVzdChrKSBhbmQgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xXHJcblx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XHJcblx0cmV0dXJuIF9vcHRpb25zXHJcblxyXG4jIyNcclxuZmlsdGVyczog6KaB6L2s5o2i55qEZmlsdGVyc1xyXG5maWVsZHM6IOWvueixoeWtl+autVxyXG5maWx0ZXJfZmllbGRzOiDpu5jorqTov4fmu6TlrZfmrrXvvIzmlK/mjIHlrZfnrKbkuLLmlbDnu4Tlkozlr7nosaHmlbDnu4TkuKTnp43moLzlvI/vvIzlpoI6WydmaWxlZF9uYW1lMScsJ2ZpbGVkX25hbWUyJ10sW3tmaWVsZDonZmlsZWRfbmFtZTEnLHJlcXVpcmVkOnRydWV9XVxyXG7lpITnkIbpgLvovpE6IOaKimZpbHRlcnPkuK3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25aKe5Yqg5q+P6aG555qEaXNfZGVmYXVsdOOAgWlzX3JlcXVpcmVk5bGe5oCn77yM5LiN5a2Y5Zyo5LqOZmlsdGVyX2ZpZWxkc+eahOi/h+a7pOadoeS7tuWvueW6lOeahOenu+mZpOavj+mhueeahOebuOWFs+WxnuaAp1xyXG7ov5Tlm57nu5Pmnpw6IOWkhOeQhuWQjueahGZpbHRlcnNcclxuIyMjXHJcbkNyZWF0b3IuZ2V0RmlsdGVyc1dpdGhGaWx0ZXJGaWVsZHMgPSAoZmlsdGVycywgZmllbGRzLCBmaWx0ZXJfZmllbGRzKS0+XHJcblx0dW5sZXNzIGZpbHRlcnNcclxuXHRcdGZpbHRlcnMgPSBbXVxyXG5cdHVubGVzcyBmaWx0ZXJfZmllbGRzXHJcblx0XHRmaWx0ZXJfZmllbGRzID0gW11cclxuXHRpZiBmaWx0ZXJfZmllbGRzPy5sZW5ndGhcclxuXHRcdGZpbHRlcl9maWVsZHMuZm9yRWFjaCAobiktPlxyXG5cdFx0XHRpZiBfLmlzU3RyaW5nKG4pXHJcblx0XHRcdFx0biA9IFxyXG5cdFx0XHRcdFx0ZmllbGQ6IG4sXHJcblx0XHRcdFx0XHRyZXF1aXJlZDogZmFsc2VcclxuXHRcdFx0aWYgZmllbGRzW24uZmllbGRdIGFuZCAhXy5maW5kV2hlcmUoZmlsdGVycyx7ZmllbGQ6bi5maWVsZH0pXHJcblx0XHRcdFx0ZmlsdGVycy5wdXNoXHJcblx0XHRcdFx0XHRmaWVsZDogbi5maWVsZCxcclxuXHRcdFx0XHRcdGlzX2RlZmF1bHQ6IHRydWUsXHJcblx0XHRcdFx0XHRpc19yZXF1aXJlZDogbi5yZXF1aXJlZFxyXG5cdGZpbHRlcnMuZm9yRWFjaCAoZmlsdGVySXRlbSktPlxyXG5cdFx0bWF0Y2hGaWVsZCA9IGZpbHRlcl9maWVsZHMuZmluZCAobiktPiByZXR1cm4gbiA9PSBmaWx0ZXJJdGVtLmZpZWxkIG9yIG4uZmllbGQgPT0gZmlsdGVySXRlbS5maWVsZFxyXG5cdFx0aWYgXy5pc1N0cmluZyhtYXRjaEZpZWxkKVxyXG5cdFx0XHRtYXRjaEZpZWxkID0gXHJcblx0XHRcdFx0ZmllbGQ6IG1hdGNoRmllbGQsXHJcblx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlXHJcblx0XHRpZiBtYXRjaEZpZWxkXHJcblx0XHRcdGZpbHRlckl0ZW0uaXNfZGVmYXVsdCA9IHRydWVcclxuXHRcdFx0ZmlsdGVySXRlbS5pc19yZXF1aXJlZCA9IG1hdGNoRmllbGQucmVxdWlyZWRcclxuXHRcdGVsc2VcclxuXHRcdFx0ZGVsZXRlIGZpbHRlckl0ZW0uaXNfZGVmYXVsdFxyXG5cdFx0XHRkZWxldGUgZmlsdGVySXRlbS5pc19yZXF1aXJlZFxyXG5cdHJldHVybiBmaWx0ZXJzXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpLT5cclxuXHJcblx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHJcblx0aWYgIXJlY29yZF9pZFxyXG5cdFx0cmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmIG9iamVjdF9uYW1lID09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikgJiYgIHJlY29yZF9pZCA9PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKVxyXG5cdFx0XHRpZiBUZW1wbGF0ZS5pbnN0YW5jZSgpPy5yZWNvcmRcclxuXHRcdFx0XHRyZXR1cm4gVGVtcGxhdGUuaW5zdGFuY2UoKT8ucmVjb3JkPy5nZXQoKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKVxyXG5cclxuXHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxyXG5cdGlmIGNvbGxlY3Rpb25cclxuXHRcdHJlY29yZCA9IGNvbGxlY3Rpb24uZmluZE9uZShyZWNvcmRfaWQpXHJcblx0XHRyZXR1cm4gcmVjb3JkXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZE5hbWUgPSAocmVjb3JkLCBvYmplY3RfbmFtZSktPlxyXG5cdHVubGVzcyByZWNvcmRcclxuXHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKClcclxuXHRpZiByZWNvcmRcclxuXHRcdCMg5pi+56S657uE57uH5YiX6KGo5pe277yM54m55q6K5aSE55CGbmFtZV9maWVsZF9rZXnkuLpuYW1l5a2X5q61XHJcblx0XHRuYW1lX2ZpZWxkX2tleSA9IGlmIG9iamVjdF9uYW1lID09IFwib3JnYW5pemF0aW9uc1wiIHRoZW4gXCJuYW1lXCIgZWxzZSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk/Lk5BTUVfRklFTERfS0VZXHJcblx0XHRpZiByZWNvcmQgYW5kIG5hbWVfZmllbGRfa2V5XHJcblx0XHRcdHJldHVybiByZWNvcmQubGFiZWwgfHwgcmVjb3JkW25hbWVfZmllbGRfa2V5XVxyXG5cclxuQ3JlYXRvci5nZXRBcHAgPSAoYXBwX2lkKS0+XHJcblx0aWYgIWFwcF9pZFxyXG5cdFx0YXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcclxuXHRhcHAgPSBDcmVhdG9yLkFwcHNbYXBwX2lkXVxyXG5cdENyZWF0b3IuZGVwcz8uYXBwPy5kZXBlbmQoKVxyXG5cdHJldHVybiBhcHBcclxuXHJcbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkID0gKGFwcF9pZCktPlxyXG5cdGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZClcclxuXHRpZiAhYXBwXHJcblx0XHRyZXR1cm5cclxuXHRkYXNoYm9hcmQgPSBudWxsXHJcblx0Xy5lYWNoIENyZWF0b3IuRGFzaGJvYXJkcywgKHYsIGspLT5cclxuXHRcdGlmIHYuYXBwcz8uaW5kZXhPZihhcHAuX2lkKSA+IC0xXHJcblx0XHRcdGRhc2hib2FyZCA9IHY7XHJcblx0cmV0dXJuIGRhc2hib2FyZDtcclxuXHJcbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkQ29tcG9uZW50ID0gKGFwcF9pZCktPlxyXG5cdGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZClcclxuXHRpZiAhYXBwXHJcblx0XHRyZXR1cm5cclxuXHRyZXR1cm4gUmVhY3RTdGVlZG9zLnBsdWdpbkNvbXBvbmVudFNlbGVjdG9yKFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLCBcIkRhc2hib2FyZFwiLCBhcHAuX2lkKTtcclxuXHJcbkNyZWF0b3IuZ2V0QXBwT2JqZWN0TmFtZXMgPSAoYXBwX2lkKS0+XHJcblx0YXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKVxyXG5cdGlmICFhcHBcclxuXHRcdHJldHVyblxyXG5cdGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0YXBwT2JqZWN0cyA9IGlmIGlzTW9iaWxlIHRoZW4gYXBwLm1vYmlsZV9vYmplY3RzIGVsc2UgYXBwLm9iamVjdHNcclxuXHRvYmplY3RzID0gW11cclxuXHRpZiBhcHBcclxuXHRcdF8uZWFjaCBhcHBPYmplY3RzLCAodiktPlxyXG5cdFx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdCh2KVxyXG5cdFx0XHRpZiBvYmo/LnBlcm1pc3Npb25zLmdldCgpLmFsbG93UmVhZFxyXG5cdFx0XHRcdG9iamVjdHMucHVzaCB2XHJcblx0cmV0dXJuIG9iamVjdHNcclxuXHJcbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHMgPSAoaW5jbHVkZUFkbWluKS0+XHJcblx0Y2hhbmdlQXBwID0gQ3JlYXRvci5fc3ViQXBwLmdldCgpO1xyXG5cdFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLmVudGl0aWVzLmFwcHMgPSBPYmplY3QuYXNzaWduKHt9LCBSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKS5lbnRpdGllcy5hcHBzLCB7YXBwczogY2hhbmdlQXBwfSk7XHJcblx0cmV0dXJuIFJlYWN0U3RlZWRvcy52aXNpYmxlQXBwc1NlbGVjdG9yKFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLCBpbmNsdWRlQWRtaW4pXHJcblxyXG5DcmVhdG9yLmdldFZpc2libGVBcHBzT2JqZWN0cyA9ICgpLT5cclxuXHRhcHBzID0gQ3JlYXRvci5nZXRWaXNpYmxlQXBwcygpXHJcblx0dmlzaWJsZU9iamVjdE5hbWVzID0gXy5mbGF0dGVuKF8ucGx1Y2soYXBwcywnb2JqZWN0cycpKVxyXG5cdG9iamVjdHMgPSBfLmZpbHRlciBDcmVhdG9yLk9iamVjdHMsIChvYmopLT5cclxuXHRcdGlmIHZpc2libGVPYmplY3ROYW1lcy5pbmRleE9mKG9iai5uYW1lKSA8IDBcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB0cnVlXHJcblx0b2JqZWN0cyA9IG9iamVjdHMuc29ydChDcmVhdG9yLnNvcnRpbmdNZXRob2QuYmluZCh7a2V5OlwibGFiZWxcIn0pKVxyXG5cdG9iamVjdHMgPSBfLnBsdWNrKG9iamVjdHMsJ25hbWUnKVxyXG5cdHJldHVybiBfLnVuaXEgb2JqZWN0c1xyXG5cclxuQ3JlYXRvci5nZXRBcHBzT2JqZWN0cyA9ICgpLT5cclxuXHRvYmplY3RzID0gW11cclxuXHR0ZW1wT2JqZWN0cyA9IFtdXHJcblx0Xy5mb3JFYWNoIENyZWF0b3IuQXBwcywgKGFwcCktPlxyXG5cdFx0dGVtcE9iamVjdHMgPSBfLmZpbHRlciBhcHAub2JqZWN0cywgKG9iaiktPlxyXG5cdFx0XHRyZXR1cm4gIW9iai5oaWRkZW5cclxuXHRcdG9iamVjdHMgPSBvYmplY3RzLmNvbmNhdCh0ZW1wT2JqZWN0cylcclxuXHRyZXR1cm4gXy51bmlxIG9iamVjdHNcclxuXHJcbkNyZWF0b3IudmFsaWRhdGVGaWx0ZXJzID0gKGZpbHRlcnMsIGxvZ2ljKS0+XHJcblx0ZmlsdGVyX2l0ZW1zID0gXy5tYXAgZmlsdGVycywgKG9iaikgLT5cclxuXHRcdGlmIF8uaXNFbXB0eShvYmopXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gb2JqXHJcblx0ZmlsdGVyX2l0ZW1zID0gXy5jb21wYWN0KGZpbHRlcl9pdGVtcylcclxuXHRlcnJvck1zZyA9IFwiXCJcclxuXHRmaWx0ZXJfbGVuZ3RoID0gZmlsdGVyX2l0ZW1zLmxlbmd0aFxyXG5cdGlmIGxvZ2ljXHJcblx0XHQjIOagvOW8j+WMlmZpbHRlclxyXG5cdFx0bG9naWMgPSBsb2dpYy5yZXBsYWNlKC9cXG4vZywgXCJcIikucmVwbGFjZSgvXFxzKy9nLCBcIiBcIilcclxuXHJcblx0XHQjIOWIpOaWreeJueauiuWtl+esplxyXG5cdFx0aWYgL1suX1xcLSErXSsvaWcudGVzdChsb2dpYylcclxuXHRcdFx0ZXJyb3JNc2cgPSBcIuWQq+acieeJueauiuWtl+espuOAglwiXHJcblxyXG5cdFx0aWYgIWVycm9yTXNnXHJcblx0XHRcdGluZGV4ID0gbG9naWMubWF0Y2goL1xcZCsvaWcpXHJcblx0XHRcdGlmICFpbmRleFxyXG5cdFx0XHRcdGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIlxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aW5kZXguZm9yRWFjaCAoaSktPlxyXG5cdFx0XHRcdFx0aWYgaSA8IDEgb3IgaSA+IGZpbHRlcl9sZW5ndGhcclxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieadoeS7tuW8leeUqOS6huacquWumuS5ieeahOetm+mAieWZqO+8miN7aX3jgIJcIlxyXG5cclxuXHRcdFx0XHRmbGFnID0gMVxyXG5cdFx0XHRcdHdoaWxlIGZsYWcgPD0gZmlsdGVyX2xlbmd0aFxyXG5cdFx0XHRcdFx0aWYgIWluZGV4LmluY2x1ZGVzKFwiI3tmbGFnfVwiKVxyXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCJcclxuXHRcdFx0XHRcdGZsYWcrKztcclxuXHJcblx0XHRpZiAhZXJyb3JNc2dcclxuXHRcdFx0IyDliKTmlq3mmK/lkKbmnInpnZ7ms5Xoi7HmloflrZfnrKZcclxuXHRcdFx0d29yZCA9IGxvZ2ljLm1hdGNoKC9bYS16QS1aXSsvaWcpXHJcblx0XHRcdGlmIHdvcmRcclxuXHRcdFx0XHR3b3JkLmZvckVhY2ggKHcpLT5cclxuXHRcdFx0XHRcdGlmICEvXihhbmR8b3IpJC9pZy50ZXN0KHcpXHJcblx0XHRcdFx0XHRcdGVycm9yTXNnID0gXCLmo4Dmn6XmgqjnmoTpq5jnuqfnrZvpgInmnaHku7bkuK3nmoTmi7zlhpnjgIJcIlxyXG5cclxuXHRcdGlmICFlcnJvck1zZ1xyXG5cdFx0XHQjIOWIpOaWreagvOW8j+aYr+WQpuato+ehrlxyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHRDcmVhdG9yLmV2YWwobG9naWMucmVwbGFjZSgvYW5kL2lnLCBcIiYmXCIpLnJlcGxhY2UoL29yL2lnLCBcInx8XCIpKVxyXG5cdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0ZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOS4reWQq+acieeJueauiuWtl+esplwiXHJcblxyXG5cdFx0XHRpZiAvKEFORClbXigpXSsoT1IpL2lnLnRlc3QobG9naWMpIHx8ICAvKE9SKVteKCldKyhBTkQpL2lnLnRlc3QobG9naWMpXHJcblx0XHRcdFx0ZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOW/hemhu+WcqOi/nue7reaAp+eahCBBTkQg5ZKMIE9SIOihqOi+vuW8j+WJjeWQjuS9v+eUqOaLrOWPt+OAglwiXHJcblx0aWYgZXJyb3JNc2dcclxuXHRcdGNvbnNvbGUubG9nIFwiZXJyb3JcIiwgZXJyb3JNc2dcclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHR0b2FzdHIuZXJyb3IoZXJyb3JNc2cpXHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuIyBcIj1cIiwgXCI8PlwiLCBcIj5cIiwgXCI+PVwiLCBcIjxcIiwgXCI8PVwiLCBcInN0YXJ0c3dpdGhcIiwgXCJjb250YWluc1wiLCBcIm5vdGNvbnRhaW5zXCIuXHJcbiMjI1xyXG5vcHRpb25z5Y+C5pWw77yaXHJcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXHJcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XHJcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxyXG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XHJcbiMjI1xyXG5DcmVhdG9yLmZvcm1hdEZpbHRlcnNUb01vbmdvID0gKGZpbHRlcnMsIG9wdGlvbnMpLT5cclxuXHR1bmxlc3MgZmlsdGVycz8ubGVuZ3RoXHJcblx0XHRyZXR1cm5cclxuXHQjIOW9k2ZpbHRlcnPkuI3mmK9bQXJyYXld57G75Z6L6ICM5pivW09iamVjdF3nsbvlnovml7bvvIzov5vooYzmoLzlvI/ovazmjaJcclxuXHR1bmxlc3MgZmlsdGVyc1swXSBpbnN0YW5jZW9mIEFycmF5XHJcblx0XHRmaWx0ZXJzID0gXy5tYXAgZmlsdGVycywgKG9iaiktPlxyXG5cdFx0XHRyZXR1cm4gW29iai5maWVsZCwgb2JqLm9wZXJhdGlvbiwgb2JqLnZhbHVlXVxyXG5cdHNlbGVjdG9yID0gW11cclxuXHRfLmVhY2ggZmlsdGVycywgKGZpbHRlciktPlxyXG5cdFx0ZmllbGQgPSBmaWx0ZXJbMF1cclxuXHRcdG9wdGlvbiA9IGZpbHRlclsxXVxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgbnVsbCwgb3B0aW9ucylcclxuXHRcdHN1Yl9zZWxlY3RvciA9IHt9XHJcblx0XHRzdWJfc2VsZWN0b3JbZmllbGRdID0ge31cclxuXHRcdGlmIG9wdGlvbiA9PSBcIj1cIlxyXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGVxXCJdID0gdmFsdWVcclxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPD5cIlxyXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJG5lXCJdID0gdmFsdWVcclxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPlwiXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RcIl0gPSB2YWx1ZVxyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI+PVwiXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RlXCJdID0gdmFsdWVcclxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPFwiXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRcIl0gPSB2YWx1ZVxyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8PVwiXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRlXCJdID0gdmFsdWVcclxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwic3RhcnRzd2l0aFwiXHJcblx0XHRcdHJlZyA9IG5ldyBSZWdFeHAoXCJeXCIgKyB2YWx1ZSwgXCJpXCIpXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWdcclxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiY29udGFpbnNcIlxyXG5cdFx0XHRyZWcgPSBuZXcgUmVnRXhwKHZhbHVlLCBcImlcIilcclxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZ1xyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCJub3Rjb250YWluc1wiXHJcblx0XHRcdHJlZyA9IG5ldyBSZWdFeHAoXCJeKCg/IVwiICsgdmFsdWUgKyBcIikuKSokXCIsIFwiaVwiKVxyXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnXHJcblx0XHRzZWxlY3Rvci5wdXNoIHN1Yl9zZWxlY3RvclxyXG5cdHJldHVybiBzZWxlY3RvclxyXG5cclxuQ3JlYXRvci5pc0JldHdlZW5GaWx0ZXJPcGVyYXRpb24gPSAob3BlcmF0aW9uKS0+XHJcblx0cmV0dXJuIG9wZXJhdGlvbiA9PSBcImJldHdlZW5cIiBvciAhIUNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKHRydWUpP1tvcGVyYXRpb25dXHJcblxyXG4jIyNcclxub3B0aW9uc+WPguaVsO+8mlxyXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxyXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xyXG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcclxuXHRleHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XHJcbiMjI1xyXG5DcmVhdG9yLmZvcm1hdEZpbHRlcnNUb0RldiA9IChmaWx0ZXJzLCBvYmplY3RfbmFtZSwgb3B0aW9ucyktPlxyXG5cdHN0ZWVkb3NGaWx0ZXJzID0gcmVxdWlyZShcIkBzdGVlZG9zL2ZpbHRlcnNcIik7XHJcblx0dW5sZXNzIGZpbHRlcnMubGVuZ3RoXHJcblx0XHRyZXR1cm5cclxuXHRpZiBvcHRpb25zPy5pc19sb2dpY19vclxyXG5cdFx0IyDlpoLmnpxpc19sb2dpY19vcuS4unRydWXvvIzkuLpmaWx0ZXJz56ys5LiA5bGC5YWD57Sg5aKe5Yqgb3Lpl7TpmpRcclxuXHRcdGxvZ2ljVGVtcEZpbHRlcnMgPSBbXVxyXG5cdFx0ZmlsdGVycy5mb3JFYWNoIChuKS0+XHJcblx0XHRcdGxvZ2ljVGVtcEZpbHRlcnMucHVzaChuKVxyXG5cdFx0XHRsb2dpY1RlbXBGaWx0ZXJzLnB1c2goXCJvclwiKVxyXG5cdFx0bG9naWNUZW1wRmlsdGVycy5wb3AoKVxyXG5cdFx0ZmlsdGVycyA9IGxvZ2ljVGVtcEZpbHRlcnNcclxuXHRzZWxlY3RvciA9IHN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb0RldihmaWx0ZXJzLCBDcmVhdG9yLlVTRVJfQ09OVEVYVClcclxuXHRyZXR1cm4gc2VsZWN0b3JcclxuXHJcbiMjI1xyXG5vcHRpb25z5Y+C5pWw77yaXHJcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXHJcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XHJcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxyXG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XHJcbiMjI1xyXG5DcmVhdG9yLmZvcm1hdExvZ2ljRmlsdGVyc1RvRGV2ID0gKGZpbHRlcnMsIGZpbHRlcl9sb2dpYywgb3B0aW9ucyktPlxyXG5cdGZvcm1hdF9sb2dpYyA9IGZpbHRlcl9sb2dpYy5yZXBsYWNlKC9cXChcXHMrL2lnLCBcIihcIikucmVwbGFjZSgvXFxzK1xcKS9pZywgXCIpXCIpLnJlcGxhY2UoL1xcKC9nLCBcIltcIikucmVwbGFjZSgvXFwpL2csIFwiXVwiKS5yZXBsYWNlKC9cXHMrL2csIFwiLFwiKS5yZXBsYWNlKC8oYW5kfG9yKS9pZywgXCInJDEnXCIpXHJcblx0Zm9ybWF0X2xvZ2ljID0gZm9ybWF0X2xvZ2ljLnJlcGxhY2UoLyhcXGQpKy9pZywgKHgpLT5cclxuXHRcdF9mID0gZmlsdGVyc1t4LTFdXHJcblx0XHRmaWVsZCA9IF9mLmZpZWxkXHJcblx0XHRvcHRpb24gPSBfZi5vcGVyYXRpb25cclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlLCBudWxsLCBvcHRpb25zKVxyXG5cdFx0c3ViX3NlbGVjdG9yID0gW11cclxuXHRcdGlmIF8uaXNBcnJheSh2YWx1ZSkgPT0gdHJ1ZVxyXG5cdFx0XHRpZiBvcHRpb24gPT0gXCI9XCJcclxuXHRcdFx0XHRfLmVhY2ggdmFsdWUsICh2KS0+XHJcblx0XHRcdFx0XHRzdWJfc2VsZWN0b3IucHVzaCBbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIlxyXG5cdFx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIjw+XCJcclxuXHRcdFx0XHRfLmVhY2ggdmFsdWUsICh2KS0+XHJcblx0XHRcdFx0XHRzdWJfc2VsZWN0b3IucHVzaCBbZmllbGQsIG9wdGlvbiwgdl0sIFwiYW5kXCJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdF8uZWFjaCB2YWx1ZSwgKHYpLT5cclxuXHRcdFx0XHRcdHN1Yl9zZWxlY3Rvci5wdXNoIFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiXHJcblx0XHRcdGlmIHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT0gXCJhbmRcIiB8fCBzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09IFwib3JcIlxyXG5cdFx0XHRcdHN1Yl9zZWxlY3Rvci5wb3AoKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRzdWJfc2VsZWN0b3IgPSBbZmllbGQsIG9wdGlvbiwgdmFsdWVdXHJcblx0XHRjb25zb2xlLmxvZyBcInN1Yl9zZWxlY3RvclwiLCBzdWJfc2VsZWN0b3JcclxuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShzdWJfc2VsZWN0b3IpXHJcblx0KVxyXG5cdGZvcm1hdF9sb2dpYyA9IFwiWyN7Zm9ybWF0X2xvZ2ljfV1cIlxyXG5cdHJldHVybiBDcmVhdG9yLmV2YWwoZm9ybWF0X2xvZ2ljKVxyXG5cclxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cclxuXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdXHJcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cclxuXHRpZiAhX29iamVjdFxyXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzXHJcblxyXG4jXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soX29iamVjdC5yZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxyXG5cclxuXHRyZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKF9vYmplY3QuX2NvbGxlY3Rpb25fbmFtZSlcclxuXHJcblx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cyxcIm9iamVjdF9uYW1lXCIpXHJcblx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZXM/Lmxlbmd0aCA9PSAwXHJcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXNcclxuXHJcblx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXHJcblx0dW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cclxuXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZSByZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHNcclxuXHRyZXR1cm4gXy5maWx0ZXIgcmVsYXRlZF9vYmplY3RzLCAocmVsYXRlZF9vYmplY3QpLT5cclxuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdC5vYmplY3RfbmFtZVxyXG5cdFx0aXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTFcclxuXHRcdGFsbG93UmVhZCA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8uYWxsb3dSZWFkXHJcblx0XHRyZXR1cm4gaXNBY3RpdmUgYW5kIGFsbG93UmVhZFxyXG5cclxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0TmFtZXMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxyXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcclxuXHRyZXR1cm4gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxyXG5cclxuQ3JlYXRvci5nZXRBY3Rpb25zID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblxyXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cclxuXHRpZiAhb2JqXHJcblx0XHRyZXR1cm5cclxuXHJcblx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXHJcblx0ZGlzYWJsZWRfYWN0aW9ucyA9IHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnNcclxuXHRhY3Rpb25zID0gXy5zb3J0QnkoXy52YWx1ZXMob2JqLmFjdGlvbnMpICwgJ3NvcnQnKTtcclxuXHJcblx0aWYgXy5oYXMob2JqLCAnYWxsb3dfY3VzdG9tQWN0aW9ucycpXHJcblx0XHRhY3Rpb25zID0gXy5maWx0ZXIgYWN0aW9ucywgKGFjdGlvbiktPlxyXG5cdFx0XHRyZXR1cm4gXy5pbmNsdWRlKG9iai5hbGxvd19jdXN0b21BY3Rpb25zLCBhY3Rpb24ubmFtZSkgfHwgXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLmdldE9iamVjdCgnYmFzZScpLmFjdGlvbnMpIHx8IHt9LCBhY3Rpb24ubmFtZSlcclxuXHRpZiBfLmhhcyhvYmosICdleGNsdWRlX2FjdGlvbnMnKVxyXG5cdFx0YWN0aW9ucyA9IF8uZmlsdGVyIGFjdGlvbnMsIChhY3Rpb24pLT5cclxuXHRcdFx0cmV0dXJuICFfLmluY2x1ZGUob2JqLmV4Y2x1ZGVfYWN0aW9ucywgYWN0aW9uLm5hbWUpXHJcblxyXG5cdF8uZWFjaCBhY3Rpb25zLCAoYWN0aW9uKS0+XHJcblx0XHQjIOaJi+acuuS4iuWPquaYvuekuue8lui+keaMiemSru+8jOWFtuS7lueahOaUvuWIsOaKmOWPoOS4i+aLieiPnOWNleS4rVxyXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcInJlY29yZFwiLCBcInJlY29yZF9vbmx5XCJdLmluZGV4T2YoYWN0aW9uLm9uKSA+IC0xICYmIGFjdGlvbi5uYW1lICE9ICdzdGFuZGFyZF9lZGl0J1xyXG5cdFx0XHRpZiBhY3Rpb24ub24gPT0gXCJyZWNvcmRfb25seVwiXHJcblx0XHRcdFx0YWN0aW9uLm9uID0gJ3JlY29yZF9vbmx5X21vcmUnXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRhY3Rpb24ub24gPSAncmVjb3JkX21vcmUnXHJcblxyXG5cdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJjbXNfZmlsZXNcIiwgXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXS5pbmRleE9mKG9iamVjdF9uYW1lKSA+IC0xXHJcblx0XHQjIOmZhOS7tueJueauiuWkhOeQhu+8jOS4i+i9veaMiemSruaUvuWcqOS4u+iPnOWNle+8jOe8lui+keaMiemSruaUvuWIsOW6leS4i+aKmOWPoOS4i+aLieiPnOWNleS4rVxyXG5cdFx0YWN0aW9ucy5maW5kKChuKS0+IHJldHVybiBuLm5hbWUgPT0gXCJzdGFuZGFyZF9lZGl0XCIpPy5vbiA9IFwicmVjb3JkX21vcmVcIlxyXG5cdFx0YWN0aW9ucy5maW5kKChuKS0+IHJldHVybiBuLm5hbWUgPT0gXCJkb3dubG9hZFwiKT8ub24gPSBcInJlY29yZFwiXHJcblxyXG5cdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XHJcblx0XHRyZXR1cm4gXy5pbmRleE9mKGRpc2FibGVkX2FjdGlvbnMsIGFjdGlvbi5uYW1lKSA8IDBcclxuXHJcblx0cmV0dXJuIGFjdGlvbnNcclxuXHJcbi8vL1xyXG5cdOi/lOWbnuW9k+WJjeeUqOaIt+acieadg+mZkOiuv+mXrueahOaJgOaciWxpc3Rfdmlld++8jOWMheaLrOWIhuS6q+eahO+8jOeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahO+8iOmZpOmdnm93bmVy5Y+Y5LqG77yJ77yM5Lul5Y+K6buY6K6k55qE5YW25LuW6KeG5Zu+XHJcblx05rOo5oSPQ3JlYXRvci5nZXRQZXJtaXNzaW9uc+WHveaVsOS4reaYr+S4jeS8muacieeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahOinhuWbvueahO+8jOaJgOS7pUNyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mi7/liLDnmoTnu5PmnpzkuI3lhajvvIzlubbkuI3mmK/lvZPliY3nlKjmiLfog73nnIvliLDmiYDmnInop4blm75cclxuLy8vXHJcbkNyZWF0b3IuZ2V0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHJcblx0dW5sZXNzIG9iamVjdF9uYW1lXHJcblx0XHRyZXR1cm5cclxuXHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblxyXG5cdGlmICFvYmplY3RcclxuXHRcdHJldHVyblxyXG5cclxuXHRkaXNhYmxlZF9saXN0X3ZpZXdzID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8uZGlzYWJsZWRfbGlzdF92aWV3cyB8fCBbXVxyXG5cclxuXHRsaXN0X3ZpZXdzID0gW11cclxuXHJcblx0aXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHJcblx0Xy5lYWNoIG9iamVjdC5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0XHRpZiBpc01vYmlsZSBhbmQgaXRlbS50eXBlID09IFwiY2FsZW5kYXJcIlxyXG5cdFx0XHQjIOaJi+acuuS4iuWFiOS4jeaYvuekuuaXpeWOhuinhuWbvlxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdGlmIGl0ZW1fbmFtZSAhPSBcImRlZmF1bHRcIlxyXG5cdFx0XHRpZiBfLmluZGV4T2YoZGlzYWJsZWRfbGlzdF92aWV3cywgaXRlbV9uYW1lKSA8IDAgfHwgaXRlbS5vd25lciA9PSB1c2VySWRcclxuXHRcdFx0XHRsaXN0X3ZpZXdzLnB1c2ggaXRlbVxyXG5cclxuXHRyZXR1cm4gbGlzdF92aWV3c1xyXG5cclxuIyDliY3lj7DnkIborrrkuIrkuI3lupTor6XosIPnlKjor6Xlh73mlbDvvIzlm6DkuLrlrZfmrrXnmoTmnYPpmZDpg73lnKhDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZmllbGRz55qE55u45YWz5bGe5oCn5Lit5pyJ5qCH6K+G5LqGXHJcbkNyZWF0b3IuZ2V0RmllbGRzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblxyXG5cdGZpZWxkc05hbWUgPSBDcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUob2JqZWN0X25hbWUpXHJcblx0dW5yZWFkYWJsZV9maWVsZHMgPSAgQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8udW5yZWFkYWJsZV9maWVsZHNcclxuXHRyZXR1cm4gXy5kaWZmZXJlbmNlKGZpZWxkc05hbWUsIHVucmVhZGFibGVfZmllbGRzKVxyXG5cclxuQ3JlYXRvci5pc2xvYWRpbmcgPSAoKS0+XHJcblx0cmV0dXJuICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZC5nZXQoKVxyXG5cclxuQ3JlYXRvci5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IChzdHIpLT5cclxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpXHJcblxyXG4jIOiuoeeul2ZpZWxkc+ebuOWFs+WHveaVsFxyXG4jIFNUQVJUXHJcbkNyZWF0b3IuZ2V0RGlzYWJsZWRGaWVsZHMgPSAoc2NoZW1hKS0+XHJcblx0ZmllbGRzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQsIGZpZWxkTmFtZSkgLT5cclxuXHRcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0uZGlzYWJsZWQgYW5kICFmaWVsZC5hdXRvZm9ybS5vbWl0IGFuZCBmaWVsZE5hbWVcclxuXHQpXHJcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcclxuXHRyZXR1cm4gZmllbGRzXHJcblxyXG5DcmVhdG9yLmdldEhpZGRlbkZpZWxkcyA9IChzY2hlbWEpLT5cclxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxyXG5cdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS50eXBlID09IFwiaGlkZGVuXCIgYW5kICFmaWVsZC5hdXRvZm9ybS5vbWl0IGFuZCBmaWVsZE5hbWVcclxuXHQpXHJcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcclxuXHRyZXR1cm4gZmllbGRzXHJcblxyXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhOb0dyb3VwID0gKHNjaGVtYSktPlxyXG5cdGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkLCBmaWVsZE5hbWUpIC0+XHJcblx0XHRyZXR1cm4gKCFmaWVsZC5hdXRvZm9ybSBvciAhZmllbGQuYXV0b2Zvcm0uZ3JvdXAgb3IgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT0gXCItXCIpIGFuZCAoIWZpZWxkLmF1dG9mb3JtIG9yIGZpZWxkLmF1dG9mb3JtLnR5cGUgIT0gXCJoaWRkZW5cIikgYW5kIGZpZWxkTmFtZVxyXG5cdClcclxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxyXG5cdHJldHVybiBmaWVsZHNcclxuXHJcbkNyZWF0b3IuZ2V0U29ydGVkRmllbGRHcm91cE5hbWVzID0gKHNjaGVtYSktPlxyXG5cdG5hbWVzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQpIC0+XHJcbiBcdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS5ncm91cCAhPSBcIi1cIiBhbmQgZmllbGQuYXV0b2Zvcm0uZ3JvdXBcclxuXHQpXHJcblx0bmFtZXMgPSBfLmNvbXBhY3QobmFtZXMpXHJcblx0bmFtZXMgPSBfLnVuaXF1ZShuYW1lcylcclxuXHRyZXR1cm4gbmFtZXNcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRzRm9yR3JvdXAgPSAoc2NoZW1hLCBncm91cE5hbWUpIC0+XHJcbiAgXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxyXG4gICAgXHRyZXR1cm4gZmllbGQuYXV0b2Zvcm0gYW5kIGZpZWxkLmF1dG9mb3JtLmdyb3VwID09IGdyb3VwTmFtZSBhbmQgZmllbGQuYXV0b2Zvcm0udHlwZSAhPSBcImhpZGRlblwiIGFuZCBmaWVsZE5hbWVcclxuICBcdClcclxuICBcdGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpXHJcbiAgXHRyZXR1cm4gZmllbGRzXHJcblxyXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRPbWl0ID0gKHNjaGVtYSwga2V5cykgLT5cclxuXHRrZXlzID0gXy5tYXAoa2V5cywgKGtleSkgLT5cclxuXHRcdGZpZWxkID0gXy5waWNrKHNjaGVtYSwga2V5KVxyXG5cdFx0aWYgZmllbGRba2V5XS5hdXRvZm9ybT8ub21pdFxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIGtleVxyXG5cdClcclxuXHRrZXlzID0gXy5jb21wYWN0KGtleXMpXHJcblx0cmV0dXJuIGtleXNcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRzSW5GaXJzdExldmVsID0gKGZpcnN0TGV2ZWxLZXlzLCBrZXlzKSAtPlxyXG5cdGtleXMgPSBfLm1hcChrZXlzLCAoa2V5KSAtPlxyXG5cdFx0aWYgXy5pbmRleE9mKGZpcnN0TGV2ZWxLZXlzLCBrZXkpID4gLTFcclxuXHRcdFx0cmV0dXJuIGtleVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHQpXHJcblx0a2V5cyA9IF8uY29tcGFjdChrZXlzKVxyXG5cdHJldHVybiBrZXlzXHJcblxyXG5DcmVhdG9yLmdldEZpZWxkc0ZvclJlb3JkZXIgPSAoc2NoZW1hLCBrZXlzLCBpc1NpbmdsZSkgLT5cclxuXHRmaWVsZHMgPSBbXVxyXG5cdGkgPSAwXHJcblx0X2tleXMgPSBfLmZpbHRlcihrZXlzLCAoa2V5KS0+XHJcblx0XHRyZXR1cm4gIWtleS5lbmRzV2l0aCgnX2VuZExpbmUnKVxyXG5cdCk7XHJcblx0d2hpbGUgaSA8IF9rZXlzLmxlbmd0aFxyXG5cdFx0c2NfMSA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2ldKVxyXG5cdFx0c2NfMiA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2krMV0pXHJcblxyXG5cdFx0aXNfd2lkZV8xID0gZmFsc2VcclxuXHRcdGlzX3dpZGVfMiA9IGZhbHNlXHJcblxyXG4jXHRcdGlzX3JhbmdlXzEgPSBmYWxzZVxyXG4jXHRcdGlzX3JhbmdlXzIgPSBmYWxzZVxyXG5cclxuXHRcdF8uZWFjaCBzY18xLCAodmFsdWUpIC0+XHJcblx0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc193aWRlIHx8IHZhbHVlLmF1dG9mb3JtPy50eXBlID09IFwidGFibGVcIlxyXG5cdFx0XHRcdGlzX3dpZGVfMSA9IHRydWVcclxuXHJcbiNcdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfcmFuZ2VcclxuI1x0XHRcdFx0aXNfcmFuZ2VfMSA9IHRydWVcclxuXHJcblx0XHRfLmVhY2ggc2NfMiwgKHZhbHVlKSAtPlxyXG5cdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfd2lkZSB8fCB2YWx1ZS5hdXRvZm9ybT8udHlwZSA9PSBcInRhYmxlXCJcclxuXHRcdFx0XHRpc193aWRlXzIgPSB0cnVlXHJcblxyXG4jXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3JhbmdlXHJcbiNcdFx0XHRcdGlzX3JhbmdlXzIgPSB0cnVlXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdGlzX3dpZGVfMSA9IHRydWVcclxuXHRcdFx0aXNfd2lkZV8yID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGlzU2luZ2xlXHJcblx0XHRcdGZpZWxkcy5wdXNoIF9rZXlzLnNsaWNlKGksIGkrMSlcclxuXHRcdFx0aSArPSAxXHJcblx0XHRlbHNlXHJcbiNcdFx0XHRpZiAhaXNfcmFuZ2VfMSAmJiBpc19yYW5nZV8yXHJcbiNcdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcclxuI1x0XHRcdFx0Y2hpbGRLZXlzLnB1c2ggdW5kZWZpbmVkXHJcbiNcdFx0XHRcdGZpZWxkcy5wdXNoIGNoaWxkS2V5c1xyXG4jXHRcdFx0XHRpICs9IDFcclxuI1x0XHRcdGVsc2VcclxuXHRcdFx0aWYgaXNfd2lkZV8xXHJcblx0XHRcdFx0ZmllbGRzLnB1c2ggX2tleXMuc2xpY2UoaSwgaSsxKVxyXG5cdFx0XHRcdGkgKz0gMVxyXG5cdFx0XHRlbHNlIGlmICFpc193aWRlXzEgYW5kIGlzX3dpZGVfMlxyXG5cdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcclxuXHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcclxuXHRcdFx0XHRmaWVsZHMucHVzaCBjaGlsZEtleXNcclxuXHRcdFx0XHRpICs9IDFcclxuXHRcdFx0ZWxzZSBpZiAhaXNfd2lkZV8xIGFuZCAhaXNfd2lkZV8yXHJcblx0XHRcdFx0Y2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSsxKVxyXG5cdFx0XHRcdGlmIF9rZXlzW2krMV1cclxuXHRcdFx0XHRcdGNoaWxkS2V5cy5wdXNoIF9rZXlzW2krMV1cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcclxuXHRcdFx0XHRmaWVsZHMucHVzaCBjaGlsZEtleXNcclxuXHRcdFx0XHRpICs9IDJcclxuXHJcblx0cmV0dXJuIGZpZWxkc1xyXG5cclxuQ3JlYXRvci5pc0ZpbHRlclZhbHVlRW1wdHkgPSAodikgLT5cclxuXHRyZXR1cm4gdHlwZW9mIHYgPT0gXCJ1bmRlZmluZWRcIiB8fCB2ID09IG51bGwgfHwgTnVtYmVyLmlzTmFOKHYpIHx8IHYubGVuZ3RoID09IDBcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGREYXRhVHlwZSA9IChvYmplY3RGaWVsZHMsIGtleSktPlxyXG5cdGlmIG9iamVjdEZpZWxkcyBhbmQga2V5XHJcblx0XHRyZXN1bHQgPSBvYmplY3RGaWVsZHNba2V5XT8udHlwZVxyXG5cdFx0aWYgW1wiZm9ybXVsYVwiLCBcInN1bW1hcnlcIl0uaW5kZXhPZihyZXN1bHQpID4gLTFcclxuXHRcdFx0cmVzdWx0ID0gb2JqZWN0RmllbGRzW2tleV0uZGF0YV90eXBlXHJcblx0XHRyZXR1cm4gcmVzdWx0XHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuIFwidGV4dFwiXHJcblxyXG4jIEVORFxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0Q3JlYXRvci5nZXRBbGxSZWxhdGVkT2JqZWN0cyA9IChvYmplY3RfbmFtZSktPlxyXG5cdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBbXVxyXG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XHJcblx0XHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cclxuXHRcdFx0XHRpZiByZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PSBvYmplY3RfbmFtZVxyXG5cdFx0XHRcdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMucHVzaCByZWxhdGVkX29iamVjdF9uYW1lXHJcblxyXG5cdFx0aWYgQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpLmVuYWJsZV9maWxlc1xyXG5cdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoIFwiY21zX2ZpbGVzXCJcclxuXHJcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXMiLCJDcmVhdG9yLmdldFNjaGVtYSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLnNjaGVtYSA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gUmVhY3RTdGVlZG9zLnBsdWdpbkNvbXBvbmVudFNlbGVjdG9yKFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLCBcIk9iamVjdEhvbWVcIiwgb2JqZWN0X25hbWUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkge1xuICB2YXIgbGlzdF92aWV3LCBsaXN0X3ZpZXdfaWQ7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKTtcbiAgbGlzdF92aWV3X2lkID0gbGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcuX2lkIDogdm9pZCAwO1xuICBpZiAocmVjb3JkX2lkKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQpO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJtZWV0aW5nXCIpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChDcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQob2JqZWN0X25hbWUpKSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RBYnNvbHV0ZVVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkge1xuICB2YXIgbGlzdF92aWV3LCBsaXN0X3ZpZXdfaWQ7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKTtcbiAgbGlzdF92aWV3X2lkID0gbGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcuX2lkIDogdm9pZCAwO1xuICBpZiAocmVjb3JkX2lkKSB7XG4gICAgcmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQsIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJtZWV0aW5nXCIpIHtcbiAgICAgIHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIiwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkLCB0cnVlKTtcbiAgICB9XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0Um91dGVyVXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSB7XG4gIHZhciBsaXN0X3ZpZXcsIGxpc3Rfdmlld19pZDtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpO1xuICBsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5faWQgOiB2b2lkIDA7XG4gIGlmIChyZWNvcmRfaWQpIHtcbiAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBcIm1lZXRpbmdcIikge1xuICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkO1xuICAgIH1cbiAgfVxufTtcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1VybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkge1xuICB2YXIgdXJsO1xuICB1cmwgPSBDcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKTtcbiAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwodXJsKTtcbn07XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkge1xuICBpZiAobGlzdF92aWV3X2lkID09PSBcImNhbGVuZGFyXCIpIHtcbiAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRTd2l0Y2hMaXN0VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSB7XG4gIGlmIChsaXN0X3ZpZXdfaWQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi9saXN0XCIpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9saXN0L3N3aXRjaFwiKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgcmVjb3JkX2lkLCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIHJlY29yZF9pZCArIFwiL1wiICsgcmVsYXRlZF9vYmplY3RfbmFtZSArIFwiL2dyaWRcIik7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBpc19kZWVwLCBpc19za2lwX2hpZGUsIGlzX3JlbGF0ZWQpIHtcbiAgdmFyIF9vYmplY3QsIF9vcHRpb25zLCBmaWVsZHMsIGljb24sIHJlbGF0ZWRPYmplY3RzO1xuICBfb3B0aW9ucyA9IFtdO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIF9vcHRpb25zO1xuICB9XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZmllbGRzIDogdm9pZCAwO1xuICBpY29uID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwO1xuICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgaWYgKGlzX3NraXBfaGlkZSAmJiBmLmhpZGRlbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZi50eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgIGxhYmVsOiBcIlwiICsgKGYubGFiZWwgfHwgayksXG4gICAgICAgIHZhbHVlOiBcIlwiICsgayxcbiAgICAgICAgaWNvbjogaWNvblxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgbGFiZWw6IGYubGFiZWwgfHwgayxcbiAgICAgICAgdmFsdWU6IGssXG4gICAgICAgIGljb246IGljb25cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIGlmIChpc19kZWVwKSB7XG4gICAgXy5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZiwgaykge1xuICAgICAgdmFyIHJfb2JqZWN0O1xuICAgICAgaWYgKGlzX3NraXBfaGlkZSAmJiBmLmhpZGRlbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoKGYudHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSAmJiBmLnJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKGYucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICByX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGYucmVmZXJlbmNlX3RvKTtcbiAgICAgICAgaWYgKHJfb2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGYyLCBrMikge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgICBsYWJlbDogKGYubGFiZWwgfHwgaykgKyBcIj0+XCIgKyAoZjIubGFiZWwgfHwgazIpLFxuICAgICAgICAgICAgICB2YWx1ZTogayArIFwiLlwiICsgazIsXG4gICAgICAgICAgICAgIGljb246IHJfb2JqZWN0ICE9IG51bGwgPyByX29iamVjdC5pY29uIDogdm9pZCAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChpc19yZWxhdGVkKSB7XG4gICAgcmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKTtcbiAgICBfLmVhY2gocmVsYXRlZE9iamVjdHMsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKF9yZWxhdGVkT2JqZWN0KSB7XG4gICAgICAgIHZhciByZWxhdGVkT2JqZWN0LCByZWxhdGVkT3B0aW9ucztcbiAgICAgICAgcmVsYXRlZE9wdGlvbnMgPSBDcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyhfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSk7XG4gICAgICAgIHJldHVybiBfLmVhY2gocmVsYXRlZE9wdGlvbnMsIGZ1bmN0aW9uKHJlbGF0ZWRPcHRpb24pIHtcbiAgICAgICAgICBpZiAoX3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXkgIT09IHJlbGF0ZWRPcHRpb24udmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgbGFiZWw6IChyZWxhdGVkT2JqZWN0LmxhYmVsIHx8IHJlbGF0ZWRPYmplY3QubmFtZSkgKyBcIj0+XCIgKyByZWxhdGVkT3B0aW9uLmxhYmVsLFxuICAgICAgICAgICAgICB2YWx1ZTogcmVsYXRlZE9iamVjdC5uYW1lICsgXCIuXCIgKyByZWxhdGVkT3B0aW9uLnZhbHVlLFxuICAgICAgICAgICAgICBpY29uOiByZWxhdGVkT2JqZWN0ICE9IG51bGwgPyByZWxhdGVkT2JqZWN0Lmljb24gOiB2b2lkIDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfVxuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEZpbHRlckZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBfb3B0aW9ucywgZmllbGRzLCBpY29uLCBwZXJtaXNzaW9uX2ZpZWxkcztcbiAgX29wdGlvbnMgPSBbXTtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfb3B0aW9ucztcbiAgfVxuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgcGVybWlzc2lvbl9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhvYmplY3RfbmFtZSk7XG4gIGljb24gPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDA7XG4gIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICBpZiAoIV8uaW5jbHVkZShbXCJncmlkXCIsIFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiLCBcImF2YXRhclwiLCBcImltYWdlXCIsIFwibWFya2Rvd25cIiwgXCJodG1sXCJdLCBmLnR5cGUpICYmICFmLmhpZGRlbikge1xuICAgICAgaWYgKCEvXFx3K1xcLi8udGVzdChrKSAmJiBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiBmLmxhYmVsIHx8IGssXG4gICAgICAgICAgdmFsdWU6IGssXG4gICAgICAgICAgaWNvbjogaWNvblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBfb3B0aW9ucywgZmllbGRzLCBpY29uLCBwZXJtaXNzaW9uX2ZpZWxkcztcbiAgX29wdGlvbnMgPSBbXTtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfb3B0aW9ucztcbiAgfVxuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgcGVybWlzc2lvbl9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhvYmplY3RfbmFtZSk7XG4gIGljb24gPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDA7XG4gIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICBpZiAoIV8uaW5jbHVkZShbXCJncmlkXCIsIFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKSkge1xuICAgICAgaWYgKCEvXFx3K1xcLi8udGVzdChrKSAmJiBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiBmLmxhYmVsIHx8IGssXG4gICAgICAgICAgdmFsdWU6IGssXG4gICAgICAgICAgaWNvbjogaWNvblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5cbi8qXG5maWx0ZXJzOiDopoHovazmjaLnmoRmaWx0ZXJzXG5maWVsZHM6IOWvueixoeWtl+autVxuZmlsdGVyX2ZpZWxkczog6buY6K6k6L+H5ruk5a2X5q6177yM5pSv5oyB5a2X56ym5Liy5pWw57uE5ZKM5a+56LGh5pWw57uE5Lik56eN5qC85byP77yM5aaCOlsnZmlsZWRfbmFtZTEnLCdmaWxlZF9uYW1lMiddLFt7ZmllbGQ6J2ZpbGVkX25hbWUxJyxyZXF1aXJlZDp0cnVlfV1cbuWkhOeQhumAu+i+kTog5oqKZmlsdGVyc+S4reWtmOWcqOS6jmZpbHRlcl9maWVsZHPnmoTov4fmu6TmnaHku7blop7liqDmr4/pobnnmoRpc19kZWZhdWx044CBaXNfcmVxdWlyZWTlsZ7mgKfvvIzkuI3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25a+55bqU55qE56e76Zmk5q+P6aG555qE55u45YWz5bGe5oCnXG7ov5Tlm57nu5Pmnpw6IOWkhOeQhuWQjueahGZpbHRlcnNcbiAqL1xuXG5DcmVhdG9yLmdldEZpbHRlcnNXaXRoRmlsdGVyRmllbGRzID0gZnVuY3Rpb24oZmlsdGVycywgZmllbGRzLCBmaWx0ZXJfZmllbGRzKSB7XG4gIGlmICghZmlsdGVycykge1xuICAgIGZpbHRlcnMgPSBbXTtcbiAgfVxuICBpZiAoIWZpbHRlcl9maWVsZHMpIHtcbiAgICBmaWx0ZXJfZmllbGRzID0gW107XG4gIH1cbiAgaWYgKGZpbHRlcl9maWVsZHMgIT0gbnVsbCA/IGZpbHRlcl9maWVsZHMubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgZmlsdGVyX2ZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uKG4pIHtcbiAgICAgIGlmIChfLmlzU3RyaW5nKG4pKSB7XG4gICAgICAgIG4gPSB7XG4gICAgICAgICAgZmllbGQ6IG4sXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoZmllbGRzW24uZmllbGRdICYmICFfLmZpbmRXaGVyZShmaWx0ZXJzLCB7XG4gICAgICAgIGZpZWxkOiBuLmZpZWxkXG4gICAgICB9KSkge1xuICAgICAgICByZXR1cm4gZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICBmaWVsZDogbi5maWVsZCxcbiAgICAgICAgICBpc19kZWZhdWx0OiB0cnVlLFxuICAgICAgICAgIGlzX3JlcXVpcmVkOiBuLnJlcXVpcmVkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbihmaWx0ZXJJdGVtKSB7XG4gICAgdmFyIG1hdGNoRmllbGQ7XG4gICAgbWF0Y2hGaWVsZCA9IGZpbHRlcl9maWVsZHMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbiA9PT0gZmlsdGVySXRlbS5maWVsZCB8fCBuLmZpZWxkID09PSBmaWx0ZXJJdGVtLmZpZWxkO1xuICAgIH0pO1xuICAgIGlmIChfLmlzU3RyaW5nKG1hdGNoRmllbGQpKSB7XG4gICAgICBtYXRjaEZpZWxkID0ge1xuICAgICAgICBmaWVsZDogbWF0Y2hGaWVsZCxcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAobWF0Y2hGaWVsZCkge1xuICAgICAgZmlsdGVySXRlbS5pc19kZWZhdWx0ID0gdHJ1ZTtcbiAgICAgIHJldHVybiBmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkID0gbWF0Y2hGaWVsZC5yZXF1aXJlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGZpbHRlckl0ZW0uaXNfZGVmYXVsdDtcbiAgICAgIHJldHVybiBkZWxldGUgZmlsdGVySXRlbS5pc19yZXF1aXJlZDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmlsdGVycztcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKSB7XG4gIHZhciBjb2xsZWN0aW9uLCByZWNvcmQsIHJlZiwgcmVmMSwgcmVmMjtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAoIXJlY29yZF9pZCkge1xuICAgIHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikgJiYgcmVjb3JkX2lkID09PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSkge1xuICAgICAgaWYgKChyZWYgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpKSAhPSBudWxsID8gcmVmLnJlY29yZCA6IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gKHJlZjEgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLnJlY29yZCkgIT0gbnVsbCA/IHJlZjIuZ2V0KCkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpO1xuICAgIH1cbiAgfVxuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKTtcbiAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICByZWNvcmQgPSBjb2xsZWN0aW9uLmZpbmRPbmUocmVjb3JkX2lkKTtcbiAgICByZXR1cm4gcmVjb3JkO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZE5hbWUgPSBmdW5jdGlvbihyZWNvcmQsIG9iamVjdF9uYW1lKSB7XG4gIHZhciBuYW1lX2ZpZWxkX2tleSwgcmVmO1xuICBpZiAoIXJlY29yZCkge1xuICAgIHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKCk7XG4gIH1cbiAgaWYgKHJlY29yZCkge1xuICAgIG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0X25hbWUgPT09IFwib3JnYW5pemF0aW9uc1wiID8gXCJuYW1lXCIgOiAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLk5BTUVfRklFTERfS0VZIDogdm9pZCAwO1xuICAgIGlmIChyZWNvcmQgJiYgbmFtZV9maWVsZF9rZXkpIHtcbiAgICAgIHJldHVybiByZWNvcmQubGFiZWwgfHwgcmVjb3JkW25hbWVfZmllbGRfa2V5XTtcbiAgICB9XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QXBwID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIHJlZiwgcmVmMTtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBhcHAgPSBDcmVhdG9yLkFwcHNbYXBwX2lkXTtcbiAgaWYgKChyZWYgPSBDcmVhdG9yLmRlcHMpICE9IG51bGwpIHtcbiAgICBpZiAoKHJlZjEgPSByZWYuYXBwKSAhPSBudWxsKSB7XG4gICAgICByZWYxLmRlcGVuZCgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXBwO1xufTtcblxuQ3JlYXRvci5nZXRBcHBEYXNoYm9hcmQgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgdmFyIGFwcCwgZGFzaGJvYXJkO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCkge1xuICAgIHJldHVybjtcbiAgfVxuICBkYXNoYm9hcmQgPSBudWxsO1xuICBfLmVhY2goQ3JlYXRvci5EYXNoYm9hcmRzLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB2LmFwcHMpICE9IG51bGwgPyByZWYuaW5kZXhPZihhcHAuX2lkKSA6IHZvaWQgMCkgPiAtMSkge1xuICAgICAgcmV0dXJuIGRhc2hib2FyZCA9IHY7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGRhc2hib2FyZDtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkQ29tcG9uZW50ID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHA7XG4gIGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZCk7XG4gIGlmICghYXBwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJldHVybiBSZWFjdFN0ZWVkb3MucGx1Z2luQ29tcG9uZW50U2VsZWN0b3IoUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCksIFwiRGFzaGJvYXJkXCIsIGFwcC5faWQpO1xufTtcblxuQ3JlYXRvci5nZXRBcHBPYmplY3ROYW1lcyA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwLCBhcHBPYmplY3RzLCBpc01vYmlsZSwgb2JqZWN0cztcbiAgYXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKTtcbiAgaWYgKCFhcHApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKCk7XG4gIGFwcE9iamVjdHMgPSBpc01vYmlsZSA/IGFwcC5tb2JpbGVfb2JqZWN0cyA6IGFwcC5vYmplY3RzO1xuICBvYmplY3RzID0gW107XG4gIGlmIChhcHApIHtcbiAgICBfLmVhY2goYXBwT2JqZWN0cywgZnVuY3Rpb24odikge1xuICAgICAgdmFyIG9iajtcbiAgICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KHYpO1xuICAgICAgaWYgKG9iaiAhPSBudWxsID8gb2JqLnBlcm1pc3Npb25zLmdldCgpLmFsbG93UmVhZCA6IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0cy5wdXNoKHYpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3RzO1xufTtcblxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwcyA9IGZ1bmN0aW9uKGluY2x1ZGVBZG1pbikge1xuICB2YXIgY2hhbmdlQXBwO1xuICBjaGFuZ2VBcHAgPSBDcmVhdG9yLl9zdWJBcHAuZ2V0KCk7XG4gIFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLmVudGl0aWVzLmFwcHMgPSBPYmplY3QuYXNzaWduKHt9LCBSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKS5lbnRpdGllcy5hcHBzLCB7XG4gICAgYXBwczogY2hhbmdlQXBwXG4gIH0pO1xuICByZXR1cm4gUmVhY3RTdGVlZG9zLnZpc2libGVBcHBzU2VsZWN0b3IoUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCksIGluY2x1ZGVBZG1pbik7XG59O1xuXG5DcmVhdG9yLmdldFZpc2libGVBcHBzT2JqZWN0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXBwcywgb2JqZWN0cywgdmlzaWJsZU9iamVjdE5hbWVzO1xuICBhcHBzID0gQ3JlYXRvci5nZXRWaXNpYmxlQXBwcygpO1xuICB2aXNpYmxlT2JqZWN0TmFtZXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhhcHBzLCAnb2JqZWN0cycpKTtcbiAgb2JqZWN0cyA9IF8uZmlsdGVyKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKHZpc2libGVPYmplY3ROYW1lcy5pbmRleE9mKG9iai5uYW1lKSA8IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgb2JqZWN0cyA9IG9iamVjdHMuc29ydChDcmVhdG9yLnNvcnRpbmdNZXRob2QuYmluZCh7XG4gICAga2V5OiBcImxhYmVsXCJcbiAgfSkpO1xuICBvYmplY3RzID0gXy5wbHVjayhvYmplY3RzLCAnbmFtZScpO1xuICByZXR1cm4gXy51bmlxKG9iamVjdHMpO1xufTtcblxuQ3JlYXRvci5nZXRBcHBzT2JqZWN0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgb2JqZWN0cywgdGVtcE9iamVjdHM7XG4gIG9iamVjdHMgPSBbXTtcbiAgdGVtcE9iamVjdHMgPSBbXTtcbiAgXy5mb3JFYWNoKENyZWF0b3IuQXBwcywgZnVuY3Rpb24oYXBwKSB7XG4gICAgdGVtcE9iamVjdHMgPSBfLmZpbHRlcihhcHAub2JqZWN0cywgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gIW9iai5oaWRkZW47XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iamVjdHMgPSBvYmplY3RzLmNvbmNhdCh0ZW1wT2JqZWN0cyk7XG4gIH0pO1xuICByZXR1cm4gXy51bmlxKG9iamVjdHMpO1xufTtcblxuQ3JlYXRvci52YWxpZGF0ZUZpbHRlcnMgPSBmdW5jdGlvbihmaWx0ZXJzLCBsb2dpYykge1xuICB2YXIgZSwgZXJyb3JNc2csIGZpbHRlcl9pdGVtcywgZmlsdGVyX2xlbmd0aCwgZmxhZywgaW5kZXgsIHdvcmQ7XG4gIGZpbHRlcl9pdGVtcyA9IF8ubWFwKGZpbHRlcnMsIGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChfLmlzRW1wdHkob2JqKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgfSk7XG4gIGZpbHRlcl9pdGVtcyA9IF8uY29tcGFjdChmaWx0ZXJfaXRlbXMpO1xuICBlcnJvck1zZyA9IFwiXCI7XG4gIGZpbHRlcl9sZW5ndGggPSBmaWx0ZXJfaXRlbXMubGVuZ3RoO1xuICBpZiAobG9naWMpIHtcbiAgICBsb2dpYyA9IGxvZ2ljLnJlcGxhY2UoL1xcbi9nLCBcIlwiKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgICBpZiAoL1suX1xcLSErXSsvaWcudGVzdChsb2dpYykpIHtcbiAgICAgIGVycm9yTXNnID0gXCLlkKvmnInnibnmrorlrZfnrKbjgIJcIjtcbiAgICB9XG4gICAgaWYgKCFlcnJvck1zZykge1xuICAgICAgaW5kZXggPSBsb2dpYy5tYXRjaCgvXFxkKy9pZyk7XG4gICAgICBpZiAoIWluZGV4KSB7XG4gICAgICAgIGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZGV4LmZvckVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgIGlmIChpIDwgMSB8fCBpID4gZmlsdGVyX2xlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInmnaHku7blvJXnlKjkuobmnKrlrprkuYnnmoTnrZvpgInlmajvvJpcIiArIGkgKyBcIuOAglwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZsYWcgPSAxO1xuICAgICAgICB3aGlsZSAoZmxhZyA8PSBmaWx0ZXJfbGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFpbmRleC5pbmNsdWRlcyhcIlwiICsgZmxhZykpIHtcbiAgICAgICAgICAgIGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmxhZysrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIHdvcmQgPSBsb2dpYy5tYXRjaCgvW2EtekEtWl0rL2lnKTtcbiAgICAgIGlmICh3b3JkKSB7XG4gICAgICAgIHdvcmQuZm9yRWFjaChmdW5jdGlvbih3KSB7XG4gICAgICAgICAgaWYgKCEvXihhbmR8b3IpJC9pZy50ZXN0KHcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JNc2cgPSBcIuajgOafpeaCqOeahOmrmOe6p+etm+mAieadoeS7tuS4reeahOaLvOWGmeOAglwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIENyZWF0b3JbXCJldmFsXCJdKGxvZ2ljLnJlcGxhY2UoL2FuZC9pZywgXCImJlwiKS5yZXBsYWNlKC9vci9pZywgXCJ8fFwiKSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajkuK3lkKvmnInnibnmrorlrZfnrKZcIjtcbiAgICAgIH1cbiAgICAgIGlmICgvKEFORClbXigpXSsoT1IpL2lnLnRlc3QobG9naWMpIHx8IC8oT1IpW14oKV0rKEFORCkvaWcudGVzdChsb2dpYykpIHtcbiAgICAgICAgZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOW/hemhu+WcqOi/nue7reaAp+eahCBBTkQg5ZKMIE9SIOihqOi+vuW8j+WJjeWQjuS9v+eUqOaLrOWPt+OAglwiO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoZXJyb3JNc2cpIHtcbiAgICBjb25zb2xlLmxvZyhcImVycm9yXCIsIGVycm9yTXNnKTtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB0b2FzdHIuZXJyb3IoZXJyb3JNc2cpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cblxuLypcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9Nb25nbyA9IGZ1bmN0aW9uKGZpbHRlcnMsIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGVjdG9yO1xuICBpZiAoIShmaWx0ZXJzICE9IG51bGwgPyBmaWx0ZXJzLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCEoZmlsdGVyc1swXSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgIGZpbHRlcnMgPSBfLm1hcChmaWx0ZXJzLCBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBbb2JqLmZpZWxkLCBvYmoub3BlcmF0aW9uLCBvYmoudmFsdWVdO1xuICAgIH0pO1xuICB9XG4gIHNlbGVjdG9yID0gW107XG4gIF8uZWFjaChmaWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICB2YXIgZmllbGQsIG9wdGlvbiwgcmVnLCBzdWJfc2VsZWN0b3IsIHZhbHVlO1xuICAgIGZpZWxkID0gZmlsdGVyWzBdO1xuICAgIG9wdGlvbiA9IGZpbHRlclsxXTtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBudWxsLCBvcHRpb25zKTtcbiAgICB9XG4gICAgc3ViX3NlbGVjdG9yID0ge307XG4gICAgc3ViX3NlbGVjdG9yW2ZpZWxkXSA9IHt9O1xuICAgIGlmIChvcHRpb24gPT09IFwiPVwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGVxXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD5cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRuZVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIj5cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndFwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIj49XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RlXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPFwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGx0XCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD1cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdGVcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJzdGFydHN3aXRoXCIpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeXCIgKyB2YWx1ZSwgXCJpXCIpO1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJjb250YWluc1wiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKHZhbHVlLCBcImlcIik7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIm5vdGNvbnRhaW5zXCIpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeKCg/IVwiICsgdmFsdWUgKyBcIikuKSokXCIsIFwiaVwiKTtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWc7XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3Rvci5wdXNoKHN1Yl9zZWxlY3Rvcik7XG4gIH0pO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5DcmVhdG9yLmlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiA9IGZ1bmN0aW9uKG9wZXJhdGlvbikge1xuICB2YXIgcmVmO1xuICByZXR1cm4gb3BlcmF0aW9uID09PSBcImJldHdlZW5cIiB8fCAhISgocmVmID0gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXModHJ1ZSkpICE9IG51bGwgPyByZWZbb3BlcmF0aW9uXSA6IHZvaWQgMCk7XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuXHRleHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9EZXYgPSBmdW5jdGlvbihmaWx0ZXJzLCBvYmplY3RfbmFtZSwgb3B0aW9ucykge1xuICB2YXIgbG9naWNUZW1wRmlsdGVycywgc2VsZWN0b3IsIHN0ZWVkb3NGaWx0ZXJzO1xuICBzdGVlZG9zRmlsdGVycyA9IHJlcXVpcmUoXCJAc3RlZWRvcy9maWx0ZXJzXCIpO1xuICBpZiAoIWZpbHRlcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLmlzX2xvZ2ljX29yIDogdm9pZCAwKSB7XG4gICAgbG9naWNUZW1wRmlsdGVycyA9IFtdO1xuICAgIGZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbihuKSB7XG4gICAgICBsb2dpY1RlbXBGaWx0ZXJzLnB1c2gobik7XG4gICAgICByZXR1cm4gbG9naWNUZW1wRmlsdGVycy5wdXNoKFwib3JcIik7XG4gICAgfSk7XG4gICAgbG9naWNUZW1wRmlsdGVycy5wb3AoKTtcbiAgICBmaWx0ZXJzID0gbG9naWNUZW1wRmlsdGVycztcbiAgfVxuICBzZWxlY3RvciA9IHN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb0RldihmaWx0ZXJzLCBDcmVhdG9yLlVTRVJfQ09OVEVYVCk7XG4gIHJldHVybiBzZWxlY3Rvcjtcbn07XG5cblxuLypcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRMb2dpY0ZpbHRlcnNUb0RldiA9IGZ1bmN0aW9uKGZpbHRlcnMsIGZpbHRlcl9sb2dpYywgb3B0aW9ucykge1xuICB2YXIgZm9ybWF0X2xvZ2ljO1xuICBmb3JtYXRfbG9naWMgPSBmaWx0ZXJfbG9naWMucmVwbGFjZSgvXFwoXFxzKy9pZywgXCIoXCIpLnJlcGxhY2UoL1xccytcXCkvaWcsIFwiKVwiKS5yZXBsYWNlKC9cXCgvZywgXCJbXCIpLnJlcGxhY2UoL1xcKS9nLCBcIl1cIikucmVwbGFjZSgvXFxzKy9nLCBcIixcIikucmVwbGFjZSgvKGFuZHxvcikvaWcsIFwiJyQxJ1wiKTtcbiAgZm9ybWF0X2xvZ2ljID0gZm9ybWF0X2xvZ2ljLnJlcGxhY2UoLyhcXGQpKy9pZywgZnVuY3Rpb24oeCkge1xuICAgIHZhciBfZiwgZmllbGQsIG9wdGlvbiwgc3ViX3NlbGVjdG9yLCB2YWx1ZTtcbiAgICBfZiA9IGZpbHRlcnNbeCAtIDFdO1xuICAgIGZpZWxkID0gX2YuZmllbGQ7XG4gICAgb3B0aW9uID0gX2Yub3BlcmF0aW9uO1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlLCBudWxsLCBvcHRpb25zKTtcbiAgICB9XG4gICAgc3ViX3NlbGVjdG9yID0gW107XG4gICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkgPT09IHRydWUpIHtcbiAgICAgIGlmIChvcHRpb24gPT09IFwiPVwiKSB7XG4gICAgICAgIF8uZWFjaCh2YWx1ZSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBzdWJfc2VsZWN0b3IucHVzaChbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD5cIikge1xuICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4gc3ViX3NlbGVjdG9yLnB1c2goW2ZpZWxkLCBvcHRpb24sIHZdLCBcImFuZFwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4gc3ViX3NlbGVjdG9yLnB1c2goW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09PSBcImFuZFwiIHx8IHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT09IFwib3JcIikge1xuICAgICAgICBzdWJfc2VsZWN0b3IucG9wKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Yl9zZWxlY3RvciA9IFtmaWVsZCwgb3B0aW9uLCB2YWx1ZV07XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwic3ViX3NlbGVjdG9yXCIsIHN1Yl9zZWxlY3Rvcik7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN1Yl9zZWxlY3Rvcik7XG4gIH0pO1xuICBmb3JtYXRfbG9naWMgPSBcIltcIiArIGZvcm1hdF9sb2dpYyArIFwiXVwiO1xuICByZXR1cm4gQ3JlYXRvcltcImV2YWxcIl0oZm9ybWF0X2xvZ2ljKTtcbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBfb2JqZWN0LCBwZXJtaXNzaW9ucywgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHJlbGF0ZWRfb2JqZWN0cywgdW5yZWxhdGVkX29iamVjdHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBbXTtcbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFfb2JqZWN0KSB7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICB9XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoX29iamVjdC5fY29sbGVjdGlvbl9uYW1lKTtcbiAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cywgXCJvYmplY3RfbmFtZVwiKTtcbiAgaWYgKChyZWxhdGVkX29iamVjdF9uYW1lcyAhPSBudWxsID8gcmVsYXRlZF9vYmplY3RfbmFtZXMubGVuZ3RoIDogdm9pZCAwKSA9PT0gMCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgfVxuICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlKHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0cyk7XG4gIHJldHVybiBfLmZpbHRlcihyZWxhdGVkX29iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0KSB7XG4gICAgdmFyIGFsbG93UmVhZCwgaXNBY3RpdmUsIHJlZiwgcmVsYXRlZF9vYmplY3RfbmFtZTtcbiAgICByZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3Qub2JqZWN0X25hbWU7XG4gICAgaXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTE7XG4gICAgYWxsb3dSZWFkID0gKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5hbGxvd1JlYWQgOiB2b2lkIDA7XG4gICAgcmV0dXJuIGlzQWN0aXZlICYmIGFsbG93UmVhZDtcbiAgfSk7XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3ROYW1lcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIHJlbGF0ZWRfb2JqZWN0cztcbiAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgcmV0dXJuIF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLCBcIm9iamVjdF9uYW1lXCIpO1xufTtcblxuQ3JlYXRvci5nZXRBY3Rpb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgYWN0aW9ucywgZGlzYWJsZWRfYWN0aW9ucywgb2JqLCBwZXJtaXNzaW9ucywgcmVmLCByZWYxO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICBkaXNhYmxlZF9hY3Rpb25zID0gcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucztcbiAgYWN0aW9ucyA9IF8uc29ydEJ5KF8udmFsdWVzKG9iai5hY3Rpb25zKSwgJ3NvcnQnKTtcbiAgaWYgKF8uaGFzKG9iaiwgJ2FsbG93X2N1c3RvbUFjdGlvbnMnKSkge1xuICAgIGFjdGlvbnMgPSBfLmZpbHRlcihhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICAgIHJldHVybiBfLmluY2x1ZGUob2JqLmFsbG93X2N1c3RvbUFjdGlvbnMsIGFjdGlvbi5uYW1lKSB8fCBfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuZ2V0T2JqZWN0KCdiYXNlJykuYWN0aW9ucykgfHwge30sIGFjdGlvbi5uYW1lKTtcbiAgICB9KTtcbiAgfVxuICBpZiAoXy5oYXMob2JqLCAnZXhjbHVkZV9hY3Rpb25zJykpIHtcbiAgICBhY3Rpb25zID0gXy5maWx0ZXIoYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgICByZXR1cm4gIV8uaW5jbHVkZShvYmouZXhjbHVkZV9hY3Rpb25zLCBhY3Rpb24ubmFtZSk7XG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgJiYgW1wicmVjb3JkXCIsIFwicmVjb3JkX29ubHlcIl0uaW5kZXhPZihhY3Rpb24ub24pID4gLTEgJiYgYWN0aW9uLm5hbWUgIT09ICdzdGFuZGFyZF9lZGl0Jykge1xuICAgICAgaWYgKGFjdGlvbi5vbiA9PT0gXCJyZWNvcmRfb25seVwiKSB7XG4gICAgICAgIHJldHVybiBhY3Rpb24ub24gPSAncmVjb3JkX29ubHlfbW9yZSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYWN0aW9uLm9uID0gJ3JlY29yZF9tb3JlJztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcImNtc19maWxlc1wiLCBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJdLmluZGV4T2Yob2JqZWN0X25hbWUpID4gLTEpIHtcbiAgICBpZiAoKHJlZiA9IGFjdGlvbnMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5uYW1lID09PSBcInN0YW5kYXJkX2VkaXRcIjtcbiAgICB9KSkgIT0gbnVsbCkge1xuICAgICAgcmVmLm9uID0gXCJyZWNvcmRfbW9yZVwiO1xuICAgIH1cbiAgICBpZiAoKHJlZjEgPSBhY3Rpb25zLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4ubmFtZSA9PT0gXCJkb3dubG9hZFwiO1xuICAgIH0pKSAhPSBudWxsKSB7XG4gICAgICByZWYxLm9uID0gXCJyZWNvcmRcIjtcbiAgICB9XG4gIH1cbiAgYWN0aW9ucyA9IF8uZmlsdGVyKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIHJldHVybiBfLmluZGV4T2YoZGlzYWJsZWRfYWN0aW9ucywgYWN0aW9uLm5hbWUpIDwgMDtcbiAgfSk7XG4gIHJldHVybiBhY3Rpb25zO1xufTtcblxuL+i/lOWbnuW9k+WJjeeUqOaIt+acieadg+mZkOiuv+mXrueahOaJgOaciWxpc3Rfdmlld++8jOWMheaLrOWIhuS6q+eahO+8jOeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahO+8iOmZpOmdnm93bmVy5Y+Y5LqG77yJ77yM5Lul5Y+K6buY6K6k55qE5YW25LuW6KeG5Zu+5rOo5oSPQ3JlYXRvci5nZXRQZXJtaXNzaW9uc+WHveaVsOS4reaYr+S4jeS8muacieeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahOinhuWbvueahO+8jOaJgOS7pUNyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mi7/liLDnmoTnu5PmnpzkuI3lhajvvIzlubbkuI3mmK/lvZPliY3nlKjmiLfog73nnIvliLDmiYDmnInop4blm74vO1xuXG5DcmVhdG9yLmdldExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGRpc2FibGVkX2xpc3Rfdmlld3MsIGlzTW9iaWxlLCBsaXN0X3ZpZXdzLCBvYmplY3QsIHJlZjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZGlzYWJsZWRfbGlzdF92aWV3cyA9ICgocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5kaXNhYmxlZF9saXN0X3ZpZXdzIDogdm9pZCAwKSB8fCBbXTtcbiAgbGlzdF92aWV3cyA9IFtdO1xuICBpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKTtcbiAgXy5lYWNoKG9iamVjdC5saXN0X3ZpZXdzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICBpZiAoaXNNb2JpbGUgJiYgaXRlbS50eXBlID09PSBcImNhbGVuZGFyXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGl0ZW1fbmFtZSAhPT0gXCJkZWZhdWx0XCIpIHtcbiAgICAgIGlmIChfLmluZGV4T2YoZGlzYWJsZWRfbGlzdF92aWV3cywgaXRlbV9uYW1lKSA8IDAgfHwgaXRlbS5vd25lciA9PT0gdXNlcklkKSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXdzLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGxpc3Rfdmlld3M7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGZpZWxkc05hbWUsIHJlZiwgdW5yZWFkYWJsZV9maWVsZHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgZmllbGRzTmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZShvYmplY3RfbmFtZSk7XG4gIHVucmVhZGFibGVfZmllbGRzID0gKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYudW5yZWFkYWJsZV9maWVsZHMgOiB2b2lkIDA7XG4gIHJldHVybiBfLmRpZmZlcmVuY2UoZmllbGRzTmFtZSwgdW5yZWFkYWJsZV9maWVsZHMpO1xufTtcblxuQ3JlYXRvci5pc2xvYWRpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZC5nZXQoKTtcbn07XG5cbkNyZWF0b3IuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0RGlzYWJsZWRGaWVsZHMgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLmRpc2FibGVkICYmICFmaWVsZC5hdXRvZm9ybS5vbWl0ICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRIaWRkZW5GaWVsZHMgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLnR5cGUgPT09IFwiaGlkZGVuXCIgJiYgIWZpZWxkLmF1dG9mb3JtLm9taXQgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhOb0dyb3VwID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBmaWVsZHM7XG4gIGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQsIGZpZWxkTmFtZSkge1xuICAgIHJldHVybiAoIWZpZWxkLmF1dG9mb3JtIHx8ICFmaWVsZC5hdXRvZm9ybS5ncm91cCB8fCBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PT0gXCItXCIpICYmICghZmllbGQuYXV0b2Zvcm0gfHwgZmllbGQuYXV0b2Zvcm0udHlwZSAhPT0gXCJoaWRkZW5cIikgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldFNvcnRlZEZpZWxkR3JvdXBOYW1lcyA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgbmFtZXM7XG4gIG5hbWVzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZC5hdXRvZm9ybSAmJiBmaWVsZC5hdXRvZm9ybS5ncm91cCAhPT0gXCItXCIgJiYgZmllbGQuYXV0b2Zvcm0uZ3JvdXA7XG4gIH0pO1xuICBuYW1lcyA9IF8uY29tcGFjdChuYW1lcyk7XG4gIG5hbWVzID0gXy51bmlxdWUobmFtZXMpO1xuICByZXR1cm4gbmFtZXM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc0Zvckdyb3VwID0gZnVuY3Rpb24oc2NoZW1hLCBncm91cE5hbWUpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLmdyb3VwID09PSBncm91cE5hbWUgJiYgZmllbGQuYXV0b2Zvcm0udHlwZSAhPT0gXCJoaWRkZW5cIiAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aG91dE9taXQgPSBmdW5jdGlvbihzY2hlbWEsIGtleXMpIHtcbiAga2V5cyA9IF8ubWFwKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBmaWVsZCwgcmVmO1xuICAgIGZpZWxkID0gXy5waWNrKHNjaGVtYSwga2V5KTtcbiAgICBpZiAoKHJlZiA9IGZpZWxkW2tleV0uYXV0b2Zvcm0pICE9IG51bGwgPyByZWYub21pdCA6IHZvaWQgMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cbiAgfSk7XG4gIGtleXMgPSBfLmNvbXBhY3Qoa2V5cyk7XG4gIHJldHVybiBrZXlzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNJbkZpcnN0TGV2ZWwgPSBmdW5jdGlvbihmaXJzdExldmVsS2V5cywga2V5cykge1xuICBrZXlzID0gXy5tYXAoa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKF8uaW5kZXhPZihmaXJzdExldmVsS2V5cywga2V5KSA+IC0xKSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcbiAga2V5cyA9IF8uY29tcGFjdChrZXlzKTtcbiAgcmV0dXJuIGtleXM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc0ZvclJlb3JkZXIgPSBmdW5jdGlvbihzY2hlbWEsIGtleXMsIGlzU2luZ2xlKSB7XG4gIHZhciBfa2V5cywgY2hpbGRLZXlzLCBmaWVsZHMsIGksIGlzX3dpZGVfMSwgaXNfd2lkZV8yLCBzY18xLCBzY18yO1xuICBmaWVsZHMgPSBbXTtcbiAgaSA9IDA7XG4gIF9rZXlzID0gXy5maWx0ZXIoa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuICFrZXkuZW5kc1dpdGgoJ19lbmRMaW5lJyk7XG4gIH0pO1xuICB3aGlsZSAoaSA8IF9rZXlzLmxlbmd0aCkge1xuICAgIHNjXzEgPSBfLnBpY2soc2NoZW1hLCBfa2V5c1tpXSk7XG4gICAgc2NfMiA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2kgKyAxXSk7XG4gICAgaXNfd2lkZV8xID0gZmFsc2U7XG4gICAgaXNfd2lkZV8yID0gZmFsc2U7XG4gICAgXy5lYWNoKHNjXzEsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCgocmVmID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYuaXNfd2lkZSA6IHZvaWQgMCkgfHwgKChyZWYxID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLnR5cGUgOiB2b2lkIDApID09PSBcInRhYmxlXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzX3dpZGVfMSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgXy5lYWNoKHNjXzIsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCgocmVmID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYuaXNfd2lkZSA6IHZvaWQgMCkgfHwgKChyZWYxID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLnR5cGUgOiB2b2lkIDApID09PSBcInRhYmxlXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzX3dpZGVfMiA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgaXNfd2lkZV8xID0gdHJ1ZTtcbiAgICAgIGlzX3dpZGVfMiA9IHRydWU7XG4gICAgfVxuICAgIGlmIChpc1NpbmdsZSkge1xuICAgICAgZmllbGRzLnB1c2goX2tleXMuc2xpY2UoaSwgaSArIDEpKTtcbiAgICAgIGkgKz0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzX3dpZGVfMSkge1xuICAgICAgICBmaWVsZHMucHVzaChfa2V5cy5zbGljZShpLCBpICsgMSkpO1xuICAgICAgICBpICs9IDE7XG4gICAgICB9IGVsc2UgaWYgKCFpc193aWRlXzEgJiYgaXNfd2lkZV8yKSB7XG4gICAgICAgIGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkgKyAxKTtcbiAgICAgICAgY2hpbGRLZXlzLnB1c2godm9pZCAwKTtcbiAgICAgICAgZmllbGRzLnB1c2goY2hpbGRLZXlzKTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgfSBlbHNlIGlmICghaXNfd2lkZV8xICYmICFpc193aWRlXzIpIHtcbiAgICAgICAgY2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSArIDEpO1xuICAgICAgICBpZiAoX2tleXNbaSArIDFdKSB7XG4gICAgICAgICAgY2hpbGRLZXlzLnB1c2goX2tleXNbaSArIDFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGlsZEtleXMucHVzaCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICAgIGZpZWxkcy5wdXNoKGNoaWxkS2V5cyk7XG4gICAgICAgIGkgKz0gMjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuaXNGaWx0ZXJWYWx1ZUVtcHR5ID0gZnVuY3Rpb24odikge1xuICByZXR1cm4gdHlwZW9mIHYgPT09IFwidW5kZWZpbmVkXCIgfHwgdiA9PT0gbnVsbCB8fCBOdW1iZXIuaXNOYU4odikgfHwgdi5sZW5ndGggPT09IDA7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGF0YVR5cGUgPSBmdW5jdGlvbihvYmplY3RGaWVsZHMsIGtleSkge1xuICB2YXIgcmVmLCByZXN1bHQ7XG4gIGlmIChvYmplY3RGaWVsZHMgJiYga2V5KSB7XG4gICAgcmVzdWx0ID0gKHJlZiA9IG9iamVjdEZpZWxkc1trZXldKSAhPSBudWxsID8gcmVmLnR5cGUgOiB2b2lkIDA7XG4gICAgaWYgKFtcImZvcm11bGFcIiwgXCJzdW1tYXJ5XCJdLmluZGV4T2YocmVzdWx0KSA+IC0xKSB7XG4gICAgICByZXN1bHQgPSBvYmplY3RGaWVsZHNba2V5XS5kYXRhX3R5cGU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwidGV4dFwiO1xuICB9XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3IuZ2V0QWxsUmVsYXRlZE9iamVjdHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgIHZhciByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdO1xuICAgIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICAgIGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSkge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoKHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpLmVuYWJsZV9maWxlcykge1xuICAgICAgcmVsYXRlZF9vYmplY3RfbmFtZXMucHVzaChcImNtc19maWxlc1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICB9O1xufVxuIiwiQ3JlYXRvci5hcHBzQnlOYW1lID0ge31cclxuXHJcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0XCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc3BhY2VfaWQpLT5cclxuXHRcdGlmICF0aGlzLnVzZXJJZFxyXG5cdFx0XHRyZXR1cm4gbnVsbFxyXG5cclxuXHRcdGlmIG9iamVjdF9uYW1lID09IFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIlxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdGlmIG9iamVjdF9uYW1lIGFuZCByZWNvcmRfaWRcclxuXHRcdFx0aWYgIXNwYWNlX2lkXHJcblx0XHRcdFx0ZG9jID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kT25lKHtfaWQ6IHJlY29yZF9pZH0sIHtmaWVsZHM6IHtzcGFjZTogMX19KVxyXG5cdFx0XHRcdHNwYWNlX2lkID0gZG9jPy5zcGFjZVxyXG5cclxuXHRcdFx0Y29sbGVjdGlvbl9yZWNlbnRfdmlld2VkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIilcclxuXHRcdFx0ZmlsdGVycyA9IHsgb3duZXI6IHRoaXMudXNlcklkLCBzcGFjZTogc3BhY2VfaWQsICdyZWNvcmQubyc6IG9iamVjdF9uYW1lLCAncmVjb3JkLmlkcyc6IFtyZWNvcmRfaWRdfVxyXG5cdFx0XHRjdXJyZW50X3JlY2VudF92aWV3ZWQgPSBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuZmluZE9uZShmaWx0ZXJzKVxyXG5cdFx0XHRpZiBjdXJyZW50X3JlY2VudF92aWV3ZWRcclxuXHRcdFx0XHRjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQudXBkYXRlKFxyXG5cdFx0XHRcdFx0Y3VycmVudF9yZWNlbnRfdmlld2VkLl9pZCxcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0JGluYzoge1xyXG5cdFx0XHRcdFx0XHRcdGNvdW50OiAxXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdFx0XHRtb2RpZmllZDogbmV3IERhdGUoKVxyXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0KVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Y29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLmluc2VydChcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0X2lkOiBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuX21ha2VOZXdJRCgpXHJcblx0XHRcdFx0XHRcdG93bmVyOiB0aGlzLnVzZXJJZFxyXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VfaWRcclxuXHRcdFx0XHRcdFx0cmVjb3JkOiB7bzogb2JqZWN0X25hbWUsIGlkczogW3JlY29yZF9pZF19XHJcblx0XHRcdFx0XHRcdGNvdW50OiAxXHJcblx0XHRcdFx0XHRcdGNyZWF0ZWQ6IG5ldyBEYXRlKClcclxuXHRcdFx0XHRcdFx0Y3JlYXRlZF9ieTogdGhpcy51c2VySWRcclxuXHRcdFx0XHRcdFx0bW9kaWZpZWQ6IG5ldyBEYXRlKClcclxuXHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0KVxyXG5cdFx0XHRyZXR1cm4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc3BhY2VfaWQpIHtcbiAgICB2YXIgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLCBjdXJyZW50X3JlY2VudF92aWV3ZWQsIGRvYywgZmlsdGVycztcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBcIm9iamVjdF9yZWNlbnRfdmlld2VkXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG9iamVjdF9uYW1lICYmIHJlY29yZF9pZCkge1xuICAgICAgaWYgKCFzcGFjZV9pZCkge1xuICAgICAgICBkb2MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmRPbmUoe1xuICAgICAgICAgIF9pZDogcmVjb3JkX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHNwYWNlOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc3BhY2VfaWQgPSBkb2MgIT0gbnVsbCA/IGRvYy5zcGFjZSA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICAgIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9yZWNlbnRfdmlld2VkXCIpO1xuICAgICAgZmlsdGVycyA9IHtcbiAgICAgICAgb3duZXI6IHRoaXMudXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICdyZWNvcmQubyc6IG9iamVjdF9uYW1lLFxuICAgICAgICAncmVjb3JkLmlkcyc6IFtyZWNvcmRfaWRdXG4gICAgICB9O1xuICAgICAgY3VycmVudF9yZWNlbnRfdmlld2VkID0gY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLmZpbmRPbmUoZmlsdGVycyk7XG4gICAgICBpZiAoY3VycmVudF9yZWNlbnRfdmlld2VkKSB7XG4gICAgICAgIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC51cGRhdGUoY3VycmVudF9yZWNlbnRfdmlld2VkLl9pZCwge1xuICAgICAgICAgICRpbmM6IHtcbiAgICAgICAgICAgIGNvdW50OiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuaW5zZXJ0KHtcbiAgICAgICAgICBfaWQ6IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5fbWFrZU5ld0lEKCksXG4gICAgICAgICAgb3duZXI6IHRoaXMudXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICByZWNvcmQ6IHtcbiAgICAgICAgICAgIG86IG9iamVjdF9uYW1lLFxuICAgICAgICAgICAgaWRzOiBbcmVjb3JkX2lkXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICBjcmVhdGVkX2J5OiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICBtb2RpZmllZF9ieTogdGhpcy51c2VySWRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcbiIsInJlY2VudF9hZ2dyZWdhdGUgPSAoY3JlYXRlZF9ieSwgc3BhY2VJZCwgX3JlY29yZHMsIGNhbGxiYWNrKS0+XHJcblx0Q3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfcmVjZW50X3ZpZXdlZC5yYXdDb2xsZWN0aW9uKCkuYWdncmVnYXRlKFtcclxuXHRcdHskbWF0Y2g6IHtjcmVhdGVkX2J5OiBjcmVhdGVkX2J5LCBzcGFjZTogc3BhY2VJZH19LFxyXG5cdFx0eyRncm91cDoge19pZDoge29iamVjdF9uYW1lOiBcIiRyZWNvcmQub1wiLCByZWNvcmRfaWQ6IFwiJHJlY29yZC5pZHNcIiwgc3BhY2U6IFwiJHNwYWNlXCJ9LCBtYXhDcmVhdGVkOiB7JG1heDogXCIkY3JlYXRlZFwifX19LFxyXG5cdFx0eyRzb3J0OiB7bWF4Q3JlYXRlZDogLTF9fSxcclxuXHRcdHskbGltaXQ6IDEwfVxyXG5cdF0pLnRvQXJyYXkgKGVyciwgZGF0YSktPlxyXG5cdFx0aWYgZXJyXHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihlcnIpXHJcblxyXG5cdFx0ZGF0YS5mb3JFYWNoIChkb2MpIC0+XHJcblx0XHRcdF9yZWNvcmRzLnB1c2ggZG9jLl9pZFxyXG5cclxuXHRcdGlmIGNhbGxiYWNrICYmIF8uaXNGdW5jdGlvbihjYWxsYmFjaylcclxuXHRcdFx0Y2FsbGJhY2soKVxyXG5cclxuXHRcdHJldHVyblxyXG5cclxuYXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSA9IE1ldGVvci53cmFwQXN5bmMocmVjZW50X2FnZ3JlZ2F0ZSlcclxuXHJcbnNlYXJjaF9vYmplY3QgPSAoc3BhY2UsIG9iamVjdF9uYW1lLHVzZXJJZCwgc2VhcmNoVGV4dCktPlxyXG5cdGRhdGEgPSBuZXcgQXJyYXkoKVxyXG5cclxuXHRpZiBzZWFyY2hUZXh0XHJcblxyXG5cdFx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cclxuXHRcdF9vYmplY3RfY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSlcclxuXHRcdF9vYmplY3RfbmFtZV9rZXkgPSBfb2JqZWN0Py5OQU1FX0ZJRUxEX0tFWVxyXG5cdFx0aWYgX29iamVjdCAmJiBfb2JqZWN0X2NvbGxlY3Rpb24gJiYgX29iamVjdF9uYW1lX2tleVxyXG5cdFx0XHRxdWVyeSA9IHt9XHJcblx0XHRcdHNlYXJjaF9LZXl3b3JkcyA9IHNlYXJjaFRleHQuc3BsaXQoXCIgXCIpXHJcblx0XHRcdHF1ZXJ5X2FuZCA9IFtdXHJcblx0XHRcdHNlYXJjaF9LZXl3b3Jkcy5mb3JFYWNoIChrZXl3b3JkKS0+XHJcblx0XHRcdFx0c3VicXVlcnkgPSB7fVxyXG5cdFx0XHRcdHN1YnF1ZXJ5W19vYmplY3RfbmFtZV9rZXldID0geyRyZWdleDoga2V5d29yZC50cmltKCl9XHJcblx0XHRcdFx0cXVlcnlfYW5kLnB1c2ggc3VicXVlcnlcclxuXHJcblx0XHRcdHF1ZXJ5LiRhbmQgPSBxdWVyeV9hbmRcclxuXHRcdFx0cXVlcnkuc3BhY2UgPSB7JGluOiBbc3BhY2VdfVxyXG5cclxuXHRcdFx0ZmllbGRzID0ge19pZDogMX1cclxuXHRcdFx0ZmllbGRzW19vYmplY3RfbmFtZV9rZXldID0gMVxyXG5cclxuXHRcdFx0cmVjb3JkcyA9IF9vYmplY3RfY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCB7ZmllbGRzOiBmaWVsZHMsIHNvcnQ6IHttb2RpZmllZDogMX0sIGxpbWl0OiA1fSlcclxuXHJcblx0XHRcdHJlY29yZHMuZm9yRWFjaCAocmVjb3JkKS0+XHJcblx0XHRcdFx0ZGF0YS5wdXNoIHtfaWQ6IHJlY29yZC5faWQsIF9uYW1lOiByZWNvcmRbX29iamVjdF9uYW1lX2tleV0sIF9vYmplY3RfbmFtZTogb2JqZWN0X25hbWV9XHJcblx0XHJcblx0cmV0dXJuIGRhdGFcclxuXHJcbk1ldGVvci5tZXRob2RzXHJcblx0J29iamVjdF9yZWNlbnRfcmVjb3JkJzogKHNwYWNlSWQpLT5cclxuXHRcdGRhdGEgPSBuZXcgQXJyYXkoKVxyXG5cdFx0cmVjb3JkcyA9IG5ldyBBcnJheSgpXHJcblx0XHRhc3luY19yZWNlbnRfYWdncmVnYXRlKHRoaXMudXNlcklkLCBzcGFjZUlkLCByZWNvcmRzKVxyXG5cdFx0cmVjb3Jkcy5mb3JFYWNoIChpdGVtKS0+XHJcblx0XHRcdHJlY29yZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChpdGVtLm9iamVjdF9uYW1lLCBpdGVtLnNwYWNlKVxyXG5cclxuXHRcdFx0aWYgIXJlY29yZF9vYmplY3RcclxuXHRcdFx0XHRyZXR1cm5cclxuXHJcblx0XHRcdHJlY29yZF9vYmplY3RfY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihpdGVtLm9iamVjdF9uYW1lLCBpdGVtLnNwYWNlKVxyXG5cclxuXHRcdFx0aWYgcmVjb3JkX29iamVjdCAmJiByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb25cclxuXHRcdFx0XHRmaWVsZHMgPSB7X2lkOiAxfVxyXG5cclxuXHRcdFx0XHRmaWVsZHNbcmVjb3JkX29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gPSAxXHJcblxyXG5cdFx0XHRcdHJlY29yZCA9IHJlY29yZF9vYmplY3RfY29sbGVjdGlvbi5maW5kT25lKGl0ZW0ucmVjb3JkX2lkWzBdLCB7ZmllbGRzOiBmaWVsZHN9KVxyXG5cdFx0XHRcdGlmIHJlY29yZFxyXG5cdFx0XHRcdFx0ZGF0YS5wdXNoIHtfaWQ6IHJlY29yZC5faWQsIF9uYW1lOiByZWNvcmRbcmVjb3JkX29iamVjdC5OQU1FX0ZJRUxEX0tFWV0sIF9vYmplY3RfbmFtZTogaXRlbS5vYmplY3RfbmFtZX1cclxuXHJcblx0XHRyZXR1cm4gZGF0YVxyXG5cclxuXHQnb2JqZWN0X3JlY29yZF9zZWFyY2gnOiAob3B0aW9ucyktPlxyXG5cdFx0c2VsZiA9IHRoaXNcclxuXHJcblx0XHRkYXRhID0gbmV3IEFycmF5KClcclxuXHJcblx0XHRzZWFyY2hUZXh0ID0gb3B0aW9ucy5zZWFyY2hUZXh0XHJcblx0XHRzcGFjZSA9IG9wdGlvbnMuc3BhY2VcclxuXHJcblx0XHRfLmZvckVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAoX29iamVjdCwgbmFtZSktPlxyXG5cdFx0XHRpZiBfb2JqZWN0LmVuYWJsZV9zZWFyY2hcclxuXHRcdFx0XHRvYmplY3RfcmVjb3JkID0gc2VhcmNoX29iamVjdChzcGFjZSwgX29iamVjdC5uYW1lLCBzZWxmLnVzZXJJZCwgc2VhcmNoVGV4dClcclxuXHRcdFx0XHRkYXRhID0gZGF0YS5jb25jYXQob2JqZWN0X3JlY29yZClcclxuXHJcblx0XHRyZXR1cm4gZGF0YVxyXG4iLCJ2YXIgYXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSwgcmVjZW50X2FnZ3JlZ2F0ZSwgc2VhcmNoX29iamVjdDtcblxucmVjZW50X2FnZ3JlZ2F0ZSA9IGZ1bmN0aW9uKGNyZWF0ZWRfYnksIHNwYWNlSWQsIF9yZWNvcmRzLCBjYWxsYmFjaykge1xuICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfcmVjZW50X3ZpZXdlZC5yYXdDb2xsZWN0aW9uKCkuYWdncmVnYXRlKFtcbiAgICB7XG4gICAgICAkbWF0Y2g6IHtcbiAgICAgICAgY3JlYXRlZF9ieTogY3JlYXRlZF9ieSxcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAkZ3JvdXA6IHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IFwiJHJlY29yZC5vXCIsXG4gICAgICAgICAgcmVjb3JkX2lkOiBcIiRyZWNvcmQuaWRzXCIsXG4gICAgICAgICAgc3BhY2U6IFwiJHNwYWNlXCJcbiAgICAgICAgfSxcbiAgICAgICAgbWF4Q3JlYXRlZDoge1xuICAgICAgICAgICRtYXg6IFwiJGNyZWF0ZWRcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgJHNvcnQ6IHtcbiAgICAgICAgbWF4Q3JlYXRlZDogLTFcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAkbGltaXQ6IDEwXG4gICAgfVxuICBdKS50b0FycmF5KGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICAgIH1cbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZG9jKSB7XG4gICAgICByZXR1cm4gX3JlY29yZHMucHVzaChkb2MuX2lkKTtcbiAgICB9KTtcbiAgICBpZiAoY2FsbGJhY2sgJiYgXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH0pO1xufTtcblxuYXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSA9IE1ldGVvci53cmFwQXN5bmMocmVjZW50X2FnZ3JlZ2F0ZSk7XG5cbnNlYXJjaF9vYmplY3QgPSBmdW5jdGlvbihzcGFjZSwgb2JqZWN0X25hbWUsIHVzZXJJZCwgc2VhcmNoVGV4dCkge1xuICB2YXIgX29iamVjdCwgX29iamVjdF9jb2xsZWN0aW9uLCBfb2JqZWN0X25hbWVfa2V5LCBkYXRhLCBmaWVsZHMsIHF1ZXJ5LCBxdWVyeV9hbmQsIHJlY29yZHMsIHNlYXJjaF9LZXl3b3JkcztcbiAgZGF0YSA9IG5ldyBBcnJheSgpO1xuICBpZiAoc2VhcmNoVGV4dCkge1xuICAgIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgX29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKTtcbiAgICBfb2JqZWN0X25hbWVfa2V5ID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5OQU1FX0ZJRUxEX0tFWSA6IHZvaWQgMDtcbiAgICBpZiAoX29iamVjdCAmJiBfb2JqZWN0X2NvbGxlY3Rpb24gJiYgX29iamVjdF9uYW1lX2tleSkge1xuICAgICAgcXVlcnkgPSB7fTtcbiAgICAgIHNlYXJjaF9LZXl3b3JkcyA9IHNlYXJjaFRleHQuc3BsaXQoXCIgXCIpO1xuICAgICAgcXVlcnlfYW5kID0gW107XG4gICAgICBzZWFyY2hfS2V5d29yZHMuZm9yRWFjaChmdW5jdGlvbihrZXl3b3JkKSB7XG4gICAgICAgIHZhciBzdWJxdWVyeTtcbiAgICAgICAgc3VicXVlcnkgPSB7fTtcbiAgICAgICAgc3VicXVlcnlbX29iamVjdF9uYW1lX2tleV0gPSB7XG4gICAgICAgICAgJHJlZ2V4OiBrZXl3b3JkLnRyaW0oKVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcXVlcnlfYW5kLnB1c2goc3VicXVlcnkpO1xuICAgICAgfSk7XG4gICAgICBxdWVyeS4kYW5kID0gcXVlcnlfYW5kO1xuICAgICAgcXVlcnkuc3BhY2UgPSB7XG4gICAgICAgICRpbjogW3NwYWNlXVxuICAgICAgfTtcbiAgICAgIGZpZWxkcyA9IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9O1xuICAgICAgZmllbGRzW19vYmplY3RfbmFtZV9rZXldID0gMTtcbiAgICAgIHJlY29yZHMgPSBfb2JqZWN0X2NvbGxlY3Rpb24uZmluZChxdWVyeSwge1xuICAgICAgICBmaWVsZHM6IGZpZWxkcyxcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIG1vZGlmaWVkOiAxXG4gICAgICAgIH0sXG4gICAgICAgIGxpbWl0OiA1XG4gICAgICB9KTtcbiAgICAgIHJlY29yZHMuZm9yRWFjaChmdW5jdGlvbihyZWNvcmQpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEucHVzaCh7XG4gICAgICAgICAgX2lkOiByZWNvcmQuX2lkLFxuICAgICAgICAgIF9uYW1lOiByZWNvcmRbX29iamVjdF9uYW1lX2tleV0sXG4gICAgICAgICAgX29iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGF0YTtcbn07XG5cbk1ldGVvci5tZXRob2RzKHtcbiAgJ29iamVjdF9yZWNlbnRfcmVjb3JkJzogZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBkYXRhLCByZWNvcmRzO1xuICAgIGRhdGEgPSBuZXcgQXJyYXkoKTtcbiAgICByZWNvcmRzID0gbmV3IEFycmF5KCk7XG4gICAgYXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSh0aGlzLnVzZXJJZCwgc3BhY2VJZCwgcmVjb3Jkcyk7XG4gICAgcmVjb3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHZhciBmaWVsZHMsIHJlY29yZCwgcmVjb3JkX29iamVjdCwgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uO1xuICAgICAgcmVjb3JkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpO1xuICAgICAgaWYgKCFyZWNvcmRfb2JqZWN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJlY29yZF9vYmplY3RfY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihpdGVtLm9iamVjdF9uYW1lLCBpdGVtLnNwYWNlKTtcbiAgICAgIGlmIChyZWNvcmRfb2JqZWN0ICYmIHJlY29yZF9vYmplY3RfY29sbGVjdGlvbikge1xuICAgICAgICBmaWVsZHMgPSB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH07XG4gICAgICAgIGZpZWxkc1tyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSA9IDE7XG4gICAgICAgIHJlY29yZCA9IHJlY29yZF9vYmplY3RfY29sbGVjdGlvbi5maW5kT25lKGl0ZW0ucmVjb3JkX2lkWzBdLCB7XG4gICAgICAgICAgZmllbGRzOiBmaWVsZHNcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YS5wdXNoKHtcbiAgICAgICAgICAgIF9pZDogcmVjb3JkLl9pZCxcbiAgICAgICAgICAgIF9uYW1lOiByZWNvcmRbcmVjb3JkX29iamVjdC5OQU1FX0ZJRUxEX0tFWV0sXG4gICAgICAgICAgICBfb2JqZWN0X25hbWU6IGl0ZW0ub2JqZWN0X25hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9LFxuICAnb2JqZWN0X3JlY29yZF9zZWFyY2gnOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGRhdGEsIHNlYXJjaFRleHQsIHNlbGYsIHNwYWNlO1xuICAgIHNlbGYgPSB0aGlzO1xuICAgIGRhdGEgPSBuZXcgQXJyYXkoKTtcbiAgICBzZWFyY2hUZXh0ID0gb3B0aW9ucy5zZWFyY2hUZXh0O1xuICAgIHNwYWNlID0gb3B0aW9ucy5zcGFjZTtcbiAgICBfLmZvckVhY2goQ3JlYXRvci5vYmplY3RzQnlOYW1lLCBmdW5jdGlvbihfb2JqZWN0LCBuYW1lKSB7XG4gICAgICB2YXIgb2JqZWN0X3JlY29yZDtcbiAgICAgIGlmIChfb2JqZWN0LmVuYWJsZV9zZWFyY2gpIHtcbiAgICAgICAgb2JqZWN0X3JlY29yZCA9IHNlYXJjaF9vYmplY3Qoc3BhY2UsIF9vYmplY3QubmFtZSwgc2VsZi51c2VySWQsIHNlYXJjaFRleHQpO1xuICAgICAgICByZXR1cm4gZGF0YSA9IGRhdGEuY29uY2F0KG9iamVjdF9yZWNvcmQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcbiAgICB1cGRhdGVfZmlsdGVyczogKGxpc3R2aWV3X2lkLCBmaWx0ZXJzLCBmaWx0ZXJfc2NvcGUsIGZpbHRlcl9sb2dpYyktPlxyXG4gICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy5kaXJlY3QudXBkYXRlKHtfaWQ6IGxpc3R2aWV3X2lkfSwgeyRzZXQ6IHtmaWx0ZXJzOiBmaWx0ZXJzLCBmaWx0ZXJfc2NvcGU6IGZpbHRlcl9zY29wZSwgZmlsdGVyX2xvZ2ljOiBmaWx0ZXJfbG9naWN9fSlcclxuXHJcbiAgICB1cGRhdGVfY29sdW1uczogKGxpc3R2aWV3X2lkLCBjb2x1bW5zKS0+XHJcbiAgICAgICAgY2hlY2soY29sdW1ucywgQXJyYXkpXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgY29sdW1ucy5sZW5ndGggPCAxXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAwLCBcIlNlbGVjdCBhdCBsZWFzdCBvbmUgZmllbGQgdG8gZGlzcGxheVwiXHJcbiAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfbGlzdHZpZXdzLnVwZGF0ZSh7X2lkOiBsaXN0dmlld19pZH0sIHskc2V0OiB7Y29sdW1uczogY29sdW1uc319KVxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIHVwZGF0ZV9maWx0ZXJzOiBmdW5jdGlvbihsaXN0dmlld19pZCwgZmlsdGVycywgZmlsdGVyX3Njb3BlLCBmaWx0ZXJfbG9naWMpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfbGlzdHZpZXdzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBsaXN0dmlld19pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgZmlsdGVyczogZmlsdGVycyxcbiAgICAgICAgZmlsdGVyX3Njb3BlOiBmaWx0ZXJfc2NvcGUsXG4gICAgICAgIGZpbHRlcl9sb2dpYzogZmlsdGVyX2xvZ2ljXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHVwZGF0ZV9jb2x1bW5zOiBmdW5jdGlvbihsaXN0dmlld19pZCwgY29sdW1ucykge1xuICAgIGNoZWNrKGNvbHVtbnMsIEFycmF5KTtcbiAgICBpZiAoY29sdW1ucy5sZW5ndGggPCAxKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCJTZWxlY3QgYXQgbGVhc3Qgb25lIGZpZWxkIHRvIGRpc3BsYXlcIik7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MudXBkYXRlKHtcbiAgICAgIF9pZDogbGlzdHZpZXdfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnNcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdCdyZXBvcnRfZGF0YSc6IChvcHRpb25zKS0+XHJcblx0XHRjaGVjayhvcHRpb25zLCBPYmplY3QpXHJcblx0XHRzcGFjZSA9IG9wdGlvbnMuc3BhY2VcclxuXHRcdGZpZWxkcyA9IG9wdGlvbnMuZmllbGRzXHJcblx0XHRvYmplY3RfbmFtZSA9IG9wdGlvbnMub2JqZWN0X25hbWVcclxuXHRcdGZpbHRlcl9zY29wZSA9IG9wdGlvbnMuZmlsdGVyX3Njb3BlXHJcblx0XHRmaWx0ZXJzID0gb3B0aW9ucy5maWx0ZXJzXHJcblx0XHRmaWx0ZXJGaWVsZHMgPSB7fVxyXG5cdFx0Y29tcG91bmRGaWVsZHMgPSBbXVxyXG5cdFx0b2JqZWN0RmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5maWVsZHNcclxuXHRcdF8uZWFjaCBmaWVsZHMsIChpdGVtLCBpbmRleCktPlxyXG5cdFx0XHRzcGxpdHMgPSBpdGVtLnNwbGl0KFwiLlwiKVxyXG5cdFx0XHRuYW1lID0gc3BsaXRzWzBdXHJcblx0XHRcdG9iamVjdEZpZWxkID0gb2JqZWN0RmllbGRzW25hbWVdXHJcblx0XHRcdGlmIHNwbGl0cy5sZW5ndGggPiAxIGFuZCBvYmplY3RGaWVsZFxyXG5cdFx0XHRcdGNoaWxkS2V5ID0gaXRlbS5yZXBsYWNlIG5hbWUgKyBcIi5cIiwgXCJcIlxyXG5cdFx0XHRcdGNvbXBvdW5kRmllbGRzLnB1c2goe25hbWU6IG5hbWUsIGNoaWxkS2V5OiBjaGlsZEtleSwgZmllbGQ6IG9iamVjdEZpZWxkfSlcclxuXHRcdFx0ZmlsdGVyRmllbGRzW25hbWVdID0gMVxyXG5cclxuXHRcdHNlbGVjdG9yID0ge31cclxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXHJcblx0XHRzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXHJcblx0XHRpZiBmaWx0ZXJfc2NvcGUgPT0gXCJzcGFjZXhcIlxyXG5cdFx0XHRzZWxlY3Rvci5zcGFjZSA9IFxyXG5cdFx0XHRcdCRpbjogW251bGwsc3BhY2VdXHJcblx0XHRlbHNlIGlmIGZpbHRlcl9zY29wZSA9PSBcIm1pbmVcIlxyXG5cdFx0XHRzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxyXG5cclxuXHRcdGlmIENyZWF0b3IuaXNDb21tb25TcGFjZShzcGFjZSkgJiYgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2UsIEB1c2VySWQpXHJcblx0XHRcdGRlbGV0ZSBzZWxlY3Rvci5zcGFjZVxyXG5cclxuXHRcdGlmIGZpbHRlcnMgYW5kIGZpbHRlcnMubGVuZ3RoID4gMFxyXG5cdFx0XHRzZWxlY3RvcltcIiRhbmRcIl0gPSBmaWx0ZXJzXHJcblxyXG5cdFx0Y3Vyc29yID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yLCB7ZmllbGRzOiBmaWx0ZXJGaWVsZHMsIHNraXA6IDAsIGxpbWl0OiAxMDAwMH0pXHJcbiNcdFx0aWYgY3Vyc29yLmNvdW50KCkgPiAxMDAwMFxyXG4jXHRcdFx0cmV0dXJuIFtdXHJcblx0XHRyZXN1bHQgPSBjdXJzb3IuZmV0Y2goKVxyXG5cdFx0aWYgY29tcG91bmRGaWVsZHMubGVuZ3RoXHJcblx0XHRcdHJlc3VsdCA9IHJlc3VsdC5tYXAgKGl0ZW0saW5kZXgpLT5cclxuXHRcdFx0XHRfLmVhY2ggY29tcG91bmRGaWVsZHMsIChjb21wb3VuZEZpZWxkSXRlbSwgaW5kZXgpLT5cclxuXHRcdFx0XHRcdGl0ZW1LZXkgPSBjb21wb3VuZEZpZWxkSXRlbS5uYW1lICsgXCIqJSpcIiArIGNvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5LnJlcGxhY2UoL1xcLi9nLCBcIiolKlwiKVxyXG5cdFx0XHRcdFx0aXRlbVZhbHVlID0gaXRlbVtjb21wb3VuZEZpZWxkSXRlbS5uYW1lXVxyXG5cdFx0XHRcdFx0dHlwZSA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLnR5cGVcclxuXHRcdFx0XHRcdGlmIFtcImxvb2t1cFwiLCBcIm1hc3Rlcl9kZXRhaWxcIl0uaW5kZXhPZih0eXBlKSA+IC0xXHJcblx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLnJlZmVyZW5jZV90b1xyXG5cdFx0XHRcdFx0XHRjb21wb3VuZEZpbHRlckZpZWxkcyA9IHt9XHJcblx0XHRcdFx0XHRcdGNvbXBvdW5kRmlsdGVyRmllbGRzW2NvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5XSA9IDFcclxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlSXRlbSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8pLmZpbmRPbmUge19pZDogaXRlbVZhbHVlfSwgZmllbGRzOiBjb21wb3VuZEZpbHRlckZpZWxkc1xyXG5cdFx0XHRcdFx0XHRpZiByZWZlcmVuY2VJdGVtXHJcblx0XHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IHJlZmVyZW5jZUl0ZW1bY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldXHJcblx0XHRcdFx0XHRlbHNlIGlmIHR5cGUgPT0gXCJzZWxlY3RcIlxyXG5cdFx0XHRcdFx0XHRvcHRpb25zID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQub3B0aW9uc1xyXG5cdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gXy5maW5kV2hlcmUob3B0aW9ucywge3ZhbHVlOiBpdGVtVmFsdWV9KT8ubGFiZWwgb3IgaXRlbVZhbHVlXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSBpdGVtVmFsdWVcclxuXHRcdFx0XHRcdHVubGVzcyBpdGVtW2l0ZW1LZXldXHJcblx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSBcIi0tXCJcclxuXHRcdFx0XHRyZXR1cm4gaXRlbVxyXG5cdFx0XHRyZXR1cm4gcmVzdWx0XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiByZXN1bHRcclxuXHJcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgJ3JlcG9ydF9kYXRhJzogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBjb21wb3VuZEZpZWxkcywgY3Vyc29yLCBmaWVsZHMsIGZpbHRlckZpZWxkcywgZmlsdGVyX3Njb3BlLCBmaWx0ZXJzLCBvYmplY3RGaWVsZHMsIG9iamVjdF9uYW1lLCByZWYsIHJlc3VsdCwgc2VsZWN0b3IsIHNwYWNlLCB1c2VySWQ7XG4gICAgY2hlY2sob3B0aW9ucywgT2JqZWN0KTtcbiAgICBzcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gICAgZmllbGRzID0gb3B0aW9ucy5maWVsZHM7XG4gICAgb2JqZWN0X25hbWUgPSBvcHRpb25zLm9iamVjdF9uYW1lO1xuICAgIGZpbHRlcl9zY29wZSA9IG9wdGlvbnMuZmlsdGVyX3Njb3BlO1xuICAgIGZpbHRlcnMgPSBvcHRpb25zLmZpbHRlcnM7XG4gICAgZmlsdGVyRmllbGRzID0ge307XG4gICAgY29tcG91bmRGaWVsZHMgPSBbXTtcbiAgICBvYmplY3RGaWVsZHMgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMDtcbiAgICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgdmFyIGNoaWxkS2V5LCBuYW1lLCBvYmplY3RGaWVsZCwgc3BsaXRzO1xuICAgICAgc3BsaXRzID0gaXRlbS5zcGxpdChcIi5cIik7XG4gICAgICBuYW1lID0gc3BsaXRzWzBdO1xuICAgICAgb2JqZWN0RmllbGQgPSBvYmplY3RGaWVsZHNbbmFtZV07XG4gICAgICBpZiAoc3BsaXRzLmxlbmd0aCA+IDEgJiYgb2JqZWN0RmllbGQpIHtcbiAgICAgICAgY2hpbGRLZXkgPSBpdGVtLnJlcGxhY2UobmFtZSArIFwiLlwiLCBcIlwiKTtcbiAgICAgICAgY29tcG91bmRGaWVsZHMucHVzaCh7XG4gICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICBjaGlsZEtleTogY2hpbGRLZXksXG4gICAgICAgICAgZmllbGQ6IG9iamVjdEZpZWxkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZpbHRlckZpZWxkc1tuYW1lXSA9IDE7XG4gICAgfSk7XG4gICAgc2VsZWN0b3IgPSB7fTtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlO1xuICAgIGlmIChmaWx0ZXJfc2NvcGUgPT09IFwic3BhY2V4XCIpIHtcbiAgICAgIHNlbGVjdG9yLnNwYWNlID0ge1xuICAgICAgICAkaW46IFtudWxsLCBzcGFjZV1cbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChmaWx0ZXJfc2NvcGUgPT09IFwibWluZVwiKSB7XG4gICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZDtcbiAgICB9XG4gICAgaWYgKENyZWF0b3IuaXNDb21tb25TcGFjZShzcGFjZSkgJiYgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2UsIHRoaXMudXNlcklkKSkge1xuICAgICAgZGVsZXRlIHNlbGVjdG9yLnNwYWNlO1xuICAgIH1cbiAgICBpZiAoZmlsdGVycyAmJiBmaWx0ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHNlbGVjdG9yW1wiJGFuZFwiXSA9IGZpbHRlcnM7XG4gICAgfVxuICAgIGN1cnNvciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvciwge1xuICAgICAgZmllbGRzOiBmaWx0ZXJGaWVsZHMsXG4gICAgICBza2lwOiAwLFxuICAgICAgbGltaXQ6IDEwMDAwXG4gICAgfSk7XG4gICAgcmVzdWx0ID0gY3Vyc29yLmZldGNoKCk7XG4gICAgaWYgKGNvbXBvdW5kRmllbGRzLmxlbmd0aCkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0Lm1hcChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICBfLmVhY2goY29tcG91bmRGaWVsZHMsIGZ1bmN0aW9uKGNvbXBvdW5kRmllbGRJdGVtLCBpbmRleCkge1xuICAgICAgICAgIHZhciBjb21wb3VuZEZpbHRlckZpZWxkcywgaXRlbUtleSwgaXRlbVZhbHVlLCByZWYxLCByZWZlcmVuY2VJdGVtLCByZWZlcmVuY2VfdG8sIHR5cGU7XG4gICAgICAgICAgaXRlbUtleSA9IGNvbXBvdW5kRmllbGRJdGVtLm5hbWUgKyBcIiolKlwiICsgY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXkucmVwbGFjZSgvXFwuL2csIFwiKiUqXCIpO1xuICAgICAgICAgIGl0ZW1WYWx1ZSA9IGl0ZW1bY29tcG91bmRGaWVsZEl0ZW0ubmFtZV07XG4gICAgICAgICAgdHlwZSA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLnR5cGU7XG4gICAgICAgICAgaWYgKFtcImxvb2t1cFwiLCBcIm1hc3Rlcl9kZXRhaWxcIl0uaW5kZXhPZih0eXBlKSA+IC0xKSB7XG4gICAgICAgICAgICByZWZlcmVuY2VfdG8gPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICBjb21wb3VuZEZpbHRlckZpZWxkcyA9IHt9O1xuICAgICAgICAgICAgY29tcG91bmRGaWx0ZXJGaWVsZHNbY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldID0gMTtcbiAgICAgICAgICAgIHJlZmVyZW5jZUl0ZW0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvKS5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiBpdGVtVmFsdWVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiBjb21wb3VuZEZpbHRlckZpZWxkc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocmVmZXJlbmNlSXRlbSkge1xuICAgICAgICAgICAgICBpdGVtW2l0ZW1LZXldID0gcmVmZXJlbmNlSXRlbVtjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQub3B0aW9ucztcbiAgICAgICAgICAgIGl0ZW1baXRlbUtleV0gPSAoKHJlZjEgPSBfLmZpbmRXaGVyZShvcHRpb25zLCB7XG4gICAgICAgICAgICAgIHZhbHVlOiBpdGVtVmFsdWVcbiAgICAgICAgICAgIH0pKSAhPSBudWxsID8gcmVmMS5sYWJlbCA6IHZvaWQgMCkgfHwgaXRlbVZhbHVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtW2l0ZW1LZXldID0gaXRlbVZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWl0ZW1baXRlbUtleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtW2l0ZW1LZXldID0gXCItLVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxufSk7XG4iLCIjIyNcclxuICAgIHR5cGU6IFwidXNlclwiXHJcbiAgICBvYmplY3RfbmFtZTogXCJvYmplY3RfbGlzdHZpZXdzXCJcclxuICAgIHJlY29yZF9pZDogXCJ7b2JqZWN0X25hbWV9LHtsaXN0dmlld19pZH1cIlxyXG4gICAgc2V0dGluZ3M6XHJcbiAgICAgICAgY29sdW1uX3dpZHRoOiB7IGZpZWxkX2E6IDEwMCwgZmllbGRfMjogMTUwIH1cclxuICAgICAgICBzb3J0OiBbW1wiZmllbGRfYVwiLCBcImRlc2NcIl1dXHJcbiAgICBvd25lcjoge3VzZXJJZH1cclxuIyMjXHJcblxyXG5NZXRlb3IubWV0aG9kc1xyXG4gICAgXCJ0YWJ1bGFyX3NvcnRfc2V0dGluZ3NcIjogKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIHNvcnQpLT5cclxuICAgICAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxyXG4gICAgICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIiwgb3duZXI6IHVzZXJJZH0pXHJcbiAgICAgICAgaWYgc2V0dGluZ1xyXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uc29ydFwiOiBzb3J0fX0pXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBkb2MgPSBcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwidXNlclwiXHJcbiAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcclxuICAgICAgICAgICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7fVxyXG4gICAgICAgICAgICAgICAgb3duZXI6IHVzZXJJZFxyXG5cclxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fVxyXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydFxyXG5cclxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKVxyXG5cclxuICAgIFwidGFidWxhcl9jb2x1bW5fd2lkdGhfc2V0dGluZ3NcIjogKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbl93aWR0aCktPlxyXG4gICAgICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXHJcbiAgICAgICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLCBvd25lcjogdXNlcklkfSlcclxuICAgICAgICBpZiBzZXR0aW5nXHJcbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5jb2x1bW5fd2lkdGhcIjogY29sdW1uX3dpZHRofX0pXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBkb2MgPSBcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwidXNlclwiXHJcbiAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcclxuICAgICAgICAgICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7fVxyXG4gICAgICAgICAgICAgICAgb3duZXI6IHVzZXJJZFxyXG5cclxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fVxyXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5jb2x1bW5fd2lkdGggPSBjb2x1bW5fd2lkdGhcclxuXHJcbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYylcclxuXHJcbiAgICBcImdyaWRfc2V0dGluZ3NcIjogKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbl93aWR0aCwgc29ydCktPlxyXG4gICAgICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXHJcbiAgICAgICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiLCBvd25lcjogdXNlcklkfSlcclxuICAgICAgICBpZiBzZXR0aW5nXHJcbiAgICAgICAgICAgICMg5q+P5qyh6YO95by65Yi25pS55Y+YX2lkX2FjdGlvbnPliJfnmoTlrr3luqbvvIzku6Xop6PlhrPlvZPnlKjmiLflj6rmlLnlj5jlrZfmrrXmrKHluo/ogIzmsqHmnInmlLnlj5jku7vkvZXlrZfmrrXlrr3luqbml7bvvIzliY3nq6/msqHmnInorqLpmIXliLDlrZfmrrXmrKHluo/lj5jmm7TnmoTmlbDmja7nmoTpl67pophcclxuICAgICAgICAgICAgY29sdW1uX3dpZHRoLl9pZF9hY3Rpb25zID0gaWYgc2V0dGluZy5zZXR0aW5nc1tcIiN7bGlzdF92aWV3X2lkfVwiXT8uY29sdW1uX3dpZHRoPy5faWRfYWN0aW9ucyA9PSA0NiB0aGVuIDQ3IGVsc2UgNDZcclxuICAgICAgICAgICAgaWYgc29ydFxyXG4gICAgICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LnNvcnRcIjogc29ydCwgXCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uY29sdW1uX3dpZHRoXCI6IGNvbHVtbl93aWR0aH19KVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uY29sdW1uX3dpZHRoXCI6IGNvbHVtbl93aWR0aH19KVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZG9jID1cclxuICAgICAgICAgICAgICAgIHR5cGU6IFwidXNlclwiXHJcbiAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcclxuICAgICAgICAgICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCJcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7fVxyXG4gICAgICAgICAgICAgICAgb3duZXI6IHVzZXJJZFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fVxyXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5jb2x1bW5fd2lkdGggPSBjb2x1bW5fd2lkdGhcclxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnRcclxuXHJcbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYykiLCJcbi8qXG4gICAgdHlwZTogXCJ1c2VyXCJcbiAgICBvYmplY3RfbmFtZTogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgICByZWNvcmRfaWQ6IFwie29iamVjdF9uYW1lfSx7bGlzdHZpZXdfaWR9XCJcbiAgICBzZXR0aW5nczpcbiAgICAgICAgY29sdW1uX3dpZHRoOiB7IGZpZWxkX2E6IDEwMCwgZmllbGRfMjogMTUwIH1cbiAgICAgICAgc29ydDogW1tcImZpZWxkX2FcIiwgXCJkZXNjXCJdXVxuICAgIG93bmVyOiB7dXNlcklkfVxuICovXG5NZXRlb3IubWV0aG9kcyh7XG4gIFwidGFidWxhcl9zb3J0X3NldHRpbmdzXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIHNvcnQpIHtcbiAgICB2YXIgZG9jLCBvYmosIHNldHRpbmcsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICBvd25lcjogdXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNldHRpbmcpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDogKFxuICAgICAgICAgIG9iaiA9IHt9LFxuICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuc29ydFwiXSA9IHNvcnQsXG4gICAgICAgICAgb2JqXG4gICAgICAgIClcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2MgPSB7XG4gICAgICAgIHR5cGU6IFwidXNlclwiLFxuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge307XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydDtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpO1xuICAgIH1cbiAgfSxcbiAgXCJ0YWJ1bGFyX2NvbHVtbl93aWR0aF9zZXR0aW5nc1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5fd2lkdGgpIHtcbiAgICB2YXIgZG9jLCBvYmosIHNldHRpbmcsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICBvd25lcjogdXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNldHRpbmcpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDogKFxuICAgICAgICAgIG9iaiA9IHt9LFxuICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuY29sdW1uX3dpZHRoXCJdID0gY29sdW1uX3dpZHRoLFxuICAgICAgICAgIG9ialxuICAgICAgICApXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jID0ge1xuICAgICAgICB0eXBlOiBcInVzZXJcIixcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgICBzZXR0aW5nczoge30sXG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH07XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoO1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYyk7XG4gICAgfVxuICB9LFxuICBcImdyaWRfc2V0dGluZ3NcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoLCBzb3J0KSB7XG4gICAgdmFyIGRvYywgb2JqLCBvYmoxLCByZWYsIHJlZjEsIHNldHRpbmcsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCIsXG4gICAgICBvd25lcjogdXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNldHRpbmcpIHtcbiAgICAgIGNvbHVtbl93aWR0aC5faWRfYWN0aW9ucyA9ICgocmVmID0gc2V0dGluZy5zZXR0aW5nc1tcIlwiICsgbGlzdF92aWV3X2lkXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmNvbHVtbl93aWR0aCkgIT0gbnVsbCA/IHJlZjEuX2lkX2FjdGlvbnMgOiB2b2lkIDAgOiB2b2lkIDApID09PSA0NiA/IDQ3IDogNDY7XG4gICAgICBpZiAoc29ydCkge1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IChcbiAgICAgICAgICAgIG9iaiA9IHt9LFxuICAgICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5zb3J0XCJdID0gc29ydCxcbiAgICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuY29sdW1uX3dpZHRoXCJdID0gY29sdW1uX3dpZHRoLFxuICAgICAgICAgICAgb2JqXG4gICAgICAgICAgKVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDogKFxuICAgICAgICAgICAgb2JqMSA9IHt9LFxuICAgICAgICAgICAgb2JqMVtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuY29sdW1uX3dpZHRoXCJdID0gY29sdW1uX3dpZHRoLFxuICAgICAgICAgICAgb2JqMVxuICAgICAgICAgIClcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYyA9IHtcbiAgICAgICAgdHlwZTogXCJ1c2VyXCIsXG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIixcbiAgICAgICAgc2V0dGluZ3M6IHt9LFxuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aDtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0O1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYyk7XG4gICAgfVxuICB9XG59KTtcbiIsInhtbDJqcyA9IHJlcXVpcmUgJ3htbDJqcydcclxuZnMgPSByZXF1aXJlICdmcydcclxucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXHJcbm1rZGlycCA9IHJlcXVpcmUgJ21rZGlycCdcclxuXHJcbmxvZ2dlciA9IG5ldyBMb2dnZXIgJ0V4cG9ydF9UT19YTUwnXHJcblxyXG5fd3JpdGVYbWxGaWxlID0gKGpzb25PYmosb2JqTmFtZSkgLT5cclxuXHQjIOi9rHhtbFxyXG5cdGJ1aWxkZXIgPSBuZXcgeG1sMmpzLkJ1aWxkZXIoKVxyXG5cdHhtbCA9IGJ1aWxkZXIuYnVpbGRPYmplY3QganNvbk9ialxyXG5cclxuXHQjIOi9rOS4umJ1ZmZlclxyXG5cdHN0cmVhbSA9IG5ldyBCdWZmZXIgeG1sXHJcblxyXG5cdCMg5qC55o2u5b2T5aSp5pe26Ze055qE5bm05pyI5pel5L2c5Li65a2Y5YKo6Lev5b6EXHJcblx0bm93ID0gbmV3IERhdGVcclxuXHR5ZWFyID0gbm93LmdldEZ1bGxZZWFyKClcclxuXHRtb250aCA9IG5vdy5nZXRNb250aCgpICsgMVxyXG5cdGRheSA9IG5vdy5nZXREYXRlKClcclxuXHJcblx0IyDmlofku7bot6/lvoRcclxuXHRmaWxlUGF0aCA9IHBhdGguam9pbihfX21ldGVvcl9ib290c3RyYXBfXy5zZXJ2ZXJEaXIsJy4uLy4uLy4uL2V4cG9ydC8nICsgeWVhciArICcvJyArIG1vbnRoICsgJy8nICsgZGF5ICsgJy8nICsgb2JqTmFtZSApXHJcblx0ZmlsZU5hbWUgPSBqc29uT2JqPy5faWQgKyBcIi54bWxcIlxyXG5cdGZpbGVBZGRyZXNzID0gcGF0aC5qb2luIGZpbGVQYXRoLCBmaWxlTmFtZVxyXG5cclxuXHRpZiAhZnMuZXhpc3RzU3luYyBmaWxlUGF0aFxyXG5cdFx0bWtkaXJwLnN5bmMgZmlsZVBhdGhcclxuXHJcblx0IyDlhpnlhaXmlofku7ZcclxuXHRmcy53cml0ZUZpbGUgZmlsZUFkZHJlc3MsIHN0cmVhbSwgKGVycikgLT5cclxuXHRcdGlmIGVyclxyXG5cdFx0XHRsb2dnZXIuZXJyb3IgXCIje2pzb25PYmouX2lkfeWGmeWFpXhtbOaWh+S7tuWksei0pVwiLGVyclxyXG5cdFxyXG5cdHJldHVybiBmaWxlUGF0aFxyXG5cclxuXHJcbiMg5pW055CGRmllbGRz55qEanNvbuaVsOaNrlxyXG5fbWl4RmllbGRzRGF0YSA9IChvYmosb2JqTmFtZSkgLT5cclxuXHQjIOWIneWni+WMluWvueixoeaVsOaNrlxyXG5cdGpzb25PYmogPSB7fVxyXG5cdCMg6I635Y+WZmllbGRzXHJcblx0b2JqRmllbGRzID0gQ3JlYXRvcj8uZ2V0T2JqZWN0KG9iak5hbWUpPy5maWVsZHNcclxuXHJcblx0bWl4RGVmYXVsdCA9IChmaWVsZF9uYW1lKS0+XHJcblx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gb2JqW2ZpZWxkX25hbWVdIHx8IFwiXCJcclxuXHJcblx0bWl4RGF0ZSA9IChmaWVsZF9uYW1lLHR5cGUpLT5cclxuXHRcdGRhdGUgPSBvYmpbZmllbGRfbmFtZV1cclxuXHRcdGlmIHR5cGUgPT0gXCJkYXRlXCJcclxuXHRcdFx0Zm9ybWF0ID0gXCJZWVlZLU1NLUREXCJcclxuXHRcdGVsc2VcclxuXHRcdFx0Zm9ybWF0ID0gXCJZWVlZLU1NLUREIEhIOm1tOnNzXCJcclxuXHRcdGlmIGRhdGU/IGFuZCBmb3JtYXQ/XHJcblx0XHRcdGRhdGVTdHIgPSBtb21lbnQoZGF0ZSkuZm9ybWF0KGZvcm1hdClcclxuXHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBkYXRlU3RyIHx8IFwiXCJcclxuXHJcblx0bWl4Qm9vbCA9IChmaWVsZF9uYW1lKS0+XHJcblx0XHRpZiBvYmpbZmllbGRfbmFtZV0gPT0gdHJ1ZVxyXG5cdFx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLmmK9cIlxyXG5cdFx0ZWxzZSBpZiBvYmpbZmllbGRfbmFtZV0gPT0gZmFsc2VcclxuXHRcdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5ZCmXCJcclxuXHRcdGVsc2VcclxuXHRcdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IFwiXCJcclxuXHJcblx0IyDlvqrnjq/mr4/kuKpmaWVsZHMs5bm25Yik5pat5Y+W5YC8XHJcblx0Xy5lYWNoIG9iakZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblx0XHRzd2l0Y2ggZmllbGQ/LnR5cGVcclxuXHRcdFx0d2hlbiBcImRhdGVcIixcImRhdGV0aW1lXCIgdGhlbiBtaXhEYXRlIGZpZWxkX25hbWUsZmllbGQudHlwZVxyXG5cdFx0XHR3aGVuIFwiYm9vbGVhblwiIHRoZW4gbWl4Qm9vbCBmaWVsZF9uYW1lXHJcblx0XHRcdGVsc2UgbWl4RGVmYXVsdCBmaWVsZF9uYW1lXHJcblxyXG5cdHJldHVybiBqc29uT2JqXHJcblxyXG4jIOiOt+WPluWtkOihqOaVtOeQhuaVsOaNrlxyXG5fbWl4UmVsYXRlZERhdGEgPSAob2JqLG9iak5hbWUpIC0+XHJcblx0IyDliJ3lp4vljJblr7nosaHmlbDmja5cclxuXHRyZWxhdGVkX29iamVjdHMgPSB7fVxyXG5cclxuXHQjIOiOt+WPluebuOWFs+ihqFxyXG5cdHJlbGF0ZWRPYmpOYW1lcyA9IENyZWF0b3I/LmdldEFsbFJlbGF0ZWRPYmplY3RzIG9iak5hbWVcclxuXHJcblx0IyDlvqrnjq/nm7jlhbPooahcclxuXHRyZWxhdGVkT2JqTmFtZXMuZm9yRWFjaCAocmVsYXRlZE9iak5hbWUpIC0+XHJcblx0XHQjIOavj+S4quihqOWumuS5ieS4gOS4quWvueixoeaVsOe7hFxyXG5cdFx0cmVsYXRlZFRhYmxlRGF0YSA9IFtdXHJcblxyXG5cdFx0IyAq6K6+572u5YWz6IGU5pCc57Si5p+l6K+i55qE5a2X5q61XHJcblx0XHQjIOmZhOS7tueahOWFs+iBlOaQnOe0ouWtl+auteaYr+Wumuatu+eahFxyXG5cdFx0aWYgcmVsYXRlZE9iak5hbWUgPT0gXCJjbXNfZmlsZXNcIlxyXG5cdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSBcInBhcmVudC5pZHNcIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHQjIOiOt+WPlmZpZWxkc1xyXG5cdFx0XHRmaWVsZHMgPSBDcmVhdG9yPy5PYmplY3RzW3JlbGF0ZWRPYmpOYW1lXT8uZmllbGRzXHJcblx0XHRcdCMg5b6q546v5q+P5LiqZmllbGQs5om+5Ye6cmVmZXJlbmNlX3Rv55qE5YWz6IGU5a2X5q61XHJcblx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwiXCJcclxuXHRcdFx0Xy5lYWNoIGZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblx0XHRcdFx0aWYgZmllbGQ/LnJlZmVyZW5jZV90byA9PSBvYmpOYW1lXHJcblx0XHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSBmaWVsZF9uYW1lXHJcblxyXG5cdFx0IyDmoLnmja7mib7lh7rnmoTlhbPogZTlrZfmrrXvvIzmn6XlrZDooajmlbDmja5cclxuXHRcdGlmIHJlbGF0ZWRfZmllbGRfbmFtZVxyXG5cdFx0XHRyZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqTmFtZSlcclxuXHRcdFx0IyDojrflj5bliLDmiYDmnInnmoTmlbDmja5cclxuXHRcdFx0cmVsYXRlZFJlY29yZExpc3QgPSByZWxhdGVkQ29sbGVjdGlvbi5maW5kKHtcIiN7cmVsYXRlZF9maWVsZF9uYW1lfVwiOm9iai5faWR9KS5mZXRjaCgpXHJcblx0XHRcdCMg5b6q546v5q+P5LiA5p2h5pWw5o2uXHJcblx0XHRcdHJlbGF0ZWRSZWNvcmRMaXN0LmZvckVhY2ggKHJlbGF0ZWRPYmopLT5cclxuXHRcdFx0XHQjIOaVtOWQiGZpZWxkc+aVsOaNrlxyXG5cdFx0XHRcdGZpZWxkc0RhdGEgPSBfbWl4RmllbGRzRGF0YSByZWxhdGVkT2JqLHJlbGF0ZWRPYmpOYW1lXHJcblx0XHRcdFx0IyDmiorkuIDmnaHorrDlvZXmj5LlhaXliLDlr7nosaHmlbDnu4TkuK1cclxuXHRcdFx0XHRyZWxhdGVkVGFibGVEYXRhLnB1c2ggZmllbGRzRGF0YVxyXG5cclxuXHRcdCMg5oqK5LiA5Liq5a2Q6KGo55qE5omA5pyJ5pWw5o2u5o+S5YWl5YiwcmVsYXRlZF9vYmplY3Rz5Lit77yM5YaN5b6q546v5LiL5LiA5LiqXHJcblx0XHRyZWxhdGVkX29iamVjdHNbcmVsYXRlZE9iak5hbWVdID0gcmVsYXRlZFRhYmxlRGF0YVxyXG5cclxuXHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXHJcblxyXG4jIENyZWF0b3IuRXhwb3J0MnhtbCgpXHJcbkNyZWF0b3IuRXhwb3J0MnhtbCA9IChvYmpOYW1lLCByZWNvcmRMaXN0KSAtPlxyXG5cdGxvZ2dlci5pbmZvIFwiUnVuIENyZWF0b3IuRXhwb3J0MnhtbFwiXHJcblxyXG5cdGNvbnNvbGUudGltZSBcIkNyZWF0b3IuRXhwb3J0MnhtbFwiXHJcblxyXG5cdCMg5rWL6K+V5pWw5o2uXHJcblx0IyBvYmpOYW1lID0gXCJhcmNoaXZlX3JlY29yZHNcIlxyXG5cclxuXHQjIOafpeaJvuWvueixoeaVsOaNrlxyXG5cdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqTmFtZSlcclxuXHQjIOa1i+ivleaVsOaNrlxyXG5cdHJlY29yZExpc3QgPSBjb2xsZWN0aW9uLmZpbmQoe30pLmZldGNoKClcclxuXHJcblx0cmVjb3JkTGlzdC5mb3JFYWNoIChyZWNvcmRPYmopLT5cclxuXHRcdGpzb25PYmogPSB7fVxyXG5cdFx0anNvbk9iai5faWQgPSByZWNvcmRPYmouX2lkXHJcblxyXG5cdFx0IyDmlbTnkIbkuLvooajnmoRGaWVsZHPmlbDmja5cclxuXHRcdGZpZWxkc0RhdGEgPSBfbWl4RmllbGRzRGF0YSByZWNvcmRPYmosb2JqTmFtZVxyXG5cdFx0anNvbk9ialtvYmpOYW1lXSA9IGZpZWxkc0RhdGFcclxuXHJcblx0XHQjIOaVtOeQhuebuOWFs+ihqOaVsOaNrlxyXG5cdFx0cmVsYXRlZF9vYmplY3RzID0gX21peFJlbGF0ZWREYXRhIHJlY29yZE9iaixvYmpOYW1lXHJcblxyXG5cdFx0anNvbk9ialtcInJlbGF0ZWRfb2JqZWN0c1wiXSA9IHJlbGF0ZWRfb2JqZWN0c1xyXG5cclxuXHRcdCMg6L2s5Li6eG1s5L+d5a2Y5paH5Lu2XHJcblx0XHRmaWxlUGF0aCA9IF93cml0ZVhtbEZpbGUganNvbk9iaixvYmpOYW1lXHJcblxyXG5cdGNvbnNvbGUudGltZUVuZCBcIkNyZWF0b3IuRXhwb3J0MnhtbFwiXHJcblx0cmV0dXJuIGZpbGVQYXRoIiwidmFyIF9taXhGaWVsZHNEYXRhLCBfbWl4UmVsYXRlZERhdGEsIF93cml0ZVhtbEZpbGUsIGZzLCBsb2dnZXIsIG1rZGlycCwgcGF0aCwgeG1sMmpzO1xuXG54bWwyanMgPSByZXF1aXJlKCd4bWwyanMnKTtcblxuZnMgPSByZXF1aXJlKCdmcycpO1xuXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG5ta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKTtcblxubG9nZ2VyID0gbmV3IExvZ2dlcignRXhwb3J0X1RPX1hNTCcpO1xuXG5fd3JpdGVYbWxGaWxlID0gZnVuY3Rpb24oanNvbk9iaiwgb2JqTmFtZSkge1xuICB2YXIgYnVpbGRlciwgZGF5LCBmaWxlQWRkcmVzcywgZmlsZU5hbWUsIGZpbGVQYXRoLCBtb250aCwgbm93LCBzdHJlYW0sIHhtbCwgeWVhcjtcbiAgYnVpbGRlciA9IG5ldyB4bWwyanMuQnVpbGRlcigpO1xuICB4bWwgPSBidWlsZGVyLmJ1aWxkT2JqZWN0KGpzb25PYmopO1xuICBzdHJlYW0gPSBuZXcgQnVmZmVyKHhtbCk7XG4gIG5vdyA9IG5ldyBEYXRlO1xuICB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gIG1vbnRoID0gbm93LmdldE1vbnRoKCkgKyAxO1xuICBkYXkgPSBub3cuZ2V0RGF0ZSgpO1xuICBmaWxlUGF0aCA9IHBhdGguam9pbihfX21ldGVvcl9ib290c3RyYXBfXy5zZXJ2ZXJEaXIsICcuLi8uLi8uLi9leHBvcnQvJyArIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGRheSArICcvJyArIG9iak5hbWUpO1xuICBmaWxlTmFtZSA9IChqc29uT2JqICE9IG51bGwgPyBqc29uT2JqLl9pZCA6IHZvaWQgMCkgKyBcIi54bWxcIjtcbiAgZmlsZUFkZHJlc3MgPSBwYXRoLmpvaW4oZmlsZVBhdGgsIGZpbGVOYW1lKTtcbiAgaWYgKCFmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSkge1xuICAgIG1rZGlycC5zeW5jKGZpbGVQYXRoKTtcbiAgfVxuICBmcy53cml0ZUZpbGUoZmlsZUFkZHJlc3MsIHN0cmVhbSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgcmV0dXJuIGxvZ2dlci5lcnJvcihqc29uT2JqLl9pZCArIFwi5YaZ5YWleG1s5paH5Lu25aSx6LSlXCIsIGVycik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZpbGVQYXRoO1xufTtcblxuX21peEZpZWxkc0RhdGEgPSBmdW5jdGlvbihvYmosIG9iak5hbWUpIHtcbiAgdmFyIGpzb25PYmosIG1peEJvb2wsIG1peERhdGUsIG1peERlZmF1bHQsIG9iakZpZWxkcywgcmVmO1xuICBqc29uT2JqID0ge307XG4gIG9iakZpZWxkcyA9IHR5cGVvZiBDcmVhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmIENyZWF0b3IgIT09IG51bGwgPyAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqTmFtZSkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwIDogdm9pZCAwO1xuICBtaXhEZWZhdWx0ID0gZnVuY3Rpb24oZmllbGRfbmFtZSkge1xuICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gb2JqW2ZpZWxkX25hbWVdIHx8IFwiXCI7XG4gIH07XG4gIG1peERhdGUgPSBmdW5jdGlvbihmaWVsZF9uYW1lLCB0eXBlKSB7XG4gICAgdmFyIGRhdGUsIGRhdGVTdHIsIGZvcm1hdDtcbiAgICBkYXRlID0gb2JqW2ZpZWxkX25hbWVdO1xuICAgIGlmICh0eXBlID09PSBcImRhdGVcIikge1xuICAgICAgZm9ybWF0ID0gXCJZWVlZLU1NLUREXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvcm1hdCA9IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiO1xuICAgIH1cbiAgICBpZiAoKGRhdGUgIT0gbnVsbCkgJiYgKGZvcm1hdCAhPSBudWxsKSkge1xuICAgICAgZGF0ZVN0ciA9IG1vbWVudChkYXRlKS5mb3JtYXQoZm9ybWF0KTtcbiAgICB9XG4gICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBkYXRlU3RyIHx8IFwiXCI7XG4gIH07XG4gIG1peEJvb2wgPSBmdW5jdGlvbihmaWVsZF9uYW1lKSB7XG4gICAgaWYgKG9ialtmaWVsZF9uYW1lXSA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuaYr1wiO1xuICAgIH0gZWxzZSBpZiAob2JqW2ZpZWxkX25hbWVdID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuWQplwiO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IFwiXCI7XG4gICAgfVxuICB9O1xuICBfLmVhY2gob2JqRmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIHN3aXRjaCAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnR5cGUgOiB2b2lkIDApIHtcbiAgICAgIGNhc2UgXCJkYXRlXCI6XG4gICAgICBjYXNlIFwiZGF0ZXRpbWVcIjpcbiAgICAgICAgcmV0dXJuIG1peERhdGUoZmllbGRfbmFtZSwgZmllbGQudHlwZSk7XG4gICAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgICByZXR1cm4gbWl4Qm9vbChmaWVsZF9uYW1lKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBtaXhEZWZhdWx0KGZpZWxkX25hbWUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBqc29uT2JqO1xufTtcblxuX21peFJlbGF0ZWREYXRhID0gZnVuY3Rpb24ob2JqLCBvYmpOYW1lKSB7XG4gIHZhciByZWxhdGVkT2JqTmFtZXMsIHJlbGF0ZWRfb2JqZWN0cztcbiAgcmVsYXRlZF9vYmplY3RzID0ge307XG4gIHJlbGF0ZWRPYmpOYW1lcyA9IHR5cGVvZiBDcmVhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmIENyZWF0b3IgIT09IG51bGwgPyBDcmVhdG9yLmdldEFsbFJlbGF0ZWRPYmplY3RzKG9iak5hbWUpIDogdm9pZCAwO1xuICByZWxhdGVkT2JqTmFtZXMuZm9yRWFjaChmdW5jdGlvbihyZWxhdGVkT2JqTmFtZSkge1xuICAgIHZhciBmaWVsZHMsIG9iajEsIHJlZiwgcmVsYXRlZENvbGxlY3Rpb24sIHJlbGF0ZWRSZWNvcmRMaXN0LCByZWxhdGVkVGFibGVEYXRhLCByZWxhdGVkX2ZpZWxkX25hbWU7XG4gICAgcmVsYXRlZFRhYmxlRGF0YSA9IFtdO1xuICAgIGlmIChyZWxhdGVkT2JqTmFtZSA9PT0gXCJjbXNfZmlsZXNcIikge1xuICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gXCJwYXJlbnQuaWRzXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpZWxkcyA9IHR5cGVvZiBDcmVhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmIENyZWF0b3IgIT09IG51bGwgPyAocmVmID0gQ3JlYXRvci5PYmplY3RzW3JlbGF0ZWRPYmpOYW1lXSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSBcIlwiO1xuICAgICAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgICAgaWYgKChmaWVsZCAhPSBudWxsID8gZmllbGQucmVmZXJlbmNlX3RvIDogdm9pZCAwKSA9PT0gb2JqTmFtZSkge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX2ZpZWxkX25hbWUgPSBmaWVsZF9uYW1lO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgICAgcmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iak5hbWUpO1xuICAgICAgcmVsYXRlZFJlY29yZExpc3QgPSByZWxhdGVkQ29sbGVjdGlvbi5maW5kKChcbiAgICAgICAgb2JqMSA9IHt9LFxuICAgICAgICBvYmoxW1wiXCIgKyByZWxhdGVkX2ZpZWxkX25hbWVdID0gb2JqLl9pZCxcbiAgICAgICAgb2JqMVxuICAgICAgKSkuZmV0Y2goKTtcbiAgICAgIHJlbGF0ZWRSZWNvcmRMaXN0LmZvckVhY2goZnVuY3Rpb24ocmVsYXRlZE9iaikge1xuICAgICAgICB2YXIgZmllbGRzRGF0YTtcbiAgICAgICAgZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhKHJlbGF0ZWRPYmosIHJlbGF0ZWRPYmpOYW1lKTtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRUYWJsZURhdGEucHVzaChmaWVsZHNEYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzW3JlbGF0ZWRPYmpOYW1lXSA9IHJlbGF0ZWRUYWJsZURhdGE7XG4gIH0pO1xuICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xufTtcblxuQ3JlYXRvci5FeHBvcnQyeG1sID0gZnVuY3Rpb24ob2JqTmFtZSwgcmVjb3JkTGlzdCkge1xuICB2YXIgY29sbGVjdGlvbjtcbiAgbG9nZ2VyLmluZm8oXCJSdW4gQ3JlYXRvci5FeHBvcnQyeG1sXCIpO1xuICBjb25zb2xlLnRpbWUoXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIik7XG4gIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqTmFtZSk7XG4gIHJlY29yZExpc3QgPSBjb2xsZWN0aW9uLmZpbmQoe30pLmZldGNoKCk7XG4gIHJlY29yZExpc3QuZm9yRWFjaChmdW5jdGlvbihyZWNvcmRPYmopIHtcbiAgICB2YXIgZmllbGRzRGF0YSwgZmlsZVBhdGgsIGpzb25PYmosIHJlbGF0ZWRfb2JqZWN0cztcbiAgICBqc29uT2JqID0ge307XG4gICAganNvbk9iai5faWQgPSByZWNvcmRPYmouX2lkO1xuICAgIGZpZWxkc0RhdGEgPSBfbWl4RmllbGRzRGF0YShyZWNvcmRPYmosIG9iak5hbWUpO1xuICAgIGpzb25PYmpbb2JqTmFtZV0gPSBmaWVsZHNEYXRhO1xuICAgIHJlbGF0ZWRfb2JqZWN0cyA9IF9taXhSZWxhdGVkRGF0YShyZWNvcmRPYmosIG9iak5hbWUpO1xuICAgIGpzb25PYmpbXCJyZWxhdGVkX29iamVjdHNcIl0gPSByZWxhdGVkX29iamVjdHM7XG4gICAgcmV0dXJuIGZpbGVQYXRoID0gX3dyaXRlWG1sRmlsZShqc29uT2JqLCBvYmpOYW1lKTtcbiAgfSk7XG4gIGNvbnNvbGUudGltZUVuZChcIkNyZWF0b3IuRXhwb3J0MnhtbFwiKTtcbiAgcmV0dXJuIGZpbGVQYXRoO1xufTtcbiIsIk1ldGVvci5tZXRob2RzIFxyXG5cdHJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzOiAob2JqZWN0X25hbWUsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZUlkKS0+XHJcblx0XHR1c2VySWQgPSB0aGlzLnVzZXJJZFxyXG5cdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJcclxuXHRcdFx0c2VsZWN0b3IgPSB7XCJtZXRhZGF0YS5zcGFjZVwiOiBzcGFjZUlkfVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRzZWxlY3RvciA9IHtzcGFjZTogc3BhY2VJZH1cclxuXHRcdFxyXG5cdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXHJcblx0XHRcdCMg6ZmE5Lu255qE5YWz6IGU5pCc57Si5p2h5Lu25piv5a6a5q2755qEXHJcblx0XHRcdHNlbGVjdG9yW1wicGFyZW50Lm9cIl0gPSBvYmplY3RfbmFtZVxyXG5cdFx0XHRzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRzZWxlY3RvcltyZWxhdGVkX2ZpZWxkX25hbWVdID0gcmVjb3JkX2lkXHJcblxyXG5cdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcclxuXHRcdGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMuYWxsb3dSZWFkXHJcblx0XHRcdHNlbGVjdG9yLm93bmVyID0gdXNlcklkXHJcblx0XHRcclxuXHRcdHJlbGF0ZWRfcmVjb3JkcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKVxyXG5cdFx0cmV0dXJuIHJlbGF0ZWRfcmVjb3Jkcy5jb3VudCgpIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICByZWxhdGVkX29iamVjdHNfcmVjb3JkczogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZUlkKSB7XG4gICAgdmFyIHBlcm1pc3Npb25zLCByZWxhdGVkX3JlY29yZHMsIHNlbGVjdG9yLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIikge1xuICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgIFwibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIikge1xuICAgICAgc2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lO1xuICAgICAgc2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWQ7XG4gICAgfVxuICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICAgIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMuYWxsb3dSZWFkKSB7XG4gICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZDtcbiAgICB9XG4gICAgcmVsYXRlZF9yZWNvcmRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpO1xuICAgIHJldHVybiByZWxhdGVkX3JlY29yZHMuY291bnQoKTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdGdldFBlbmRpbmdTcGFjZUluZm86IChpbnZpdGVySWQsIHNwYWNlSWQpLT5cclxuXHRcdGludml0ZXJOYW1lID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBpbnZpdGVySWR9KS5uYW1lXHJcblx0XHRzcGFjZU5hbWUgPSBkYi5zcGFjZXMuZmluZE9uZSh7X2lkOiBzcGFjZUlkfSkubmFtZVxyXG5cclxuXHRcdHJldHVybiB7aW52aXRlcjogaW52aXRlck5hbWUsIHNwYWNlOiBzcGFjZU5hbWV9XHJcblxyXG5cdHJlZnVzZUpvaW5TcGFjZTogKF9pZCktPlxyXG5cdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBfaWR9LHskc2V0OiB7aW52aXRlX3N0YXRlOiBcInJlZnVzZWRcIn19KVxyXG5cclxuXHRhY2NlcHRKb2luU3BhY2U6IChfaWQpLT5cclxuXHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogX2lkfSx7JHNldDoge2ludml0ZV9zdGF0ZTogXCJhY2NlcHRlZFwiLCB1c2VyX2FjY2VwdGVkOiB0cnVlfX0pXHJcblxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGdldFBlbmRpbmdTcGFjZUluZm86IGZ1bmN0aW9uKGludml0ZXJJZCwgc3BhY2VJZCkge1xuICAgIHZhciBpbnZpdGVyTmFtZSwgc3BhY2VOYW1lO1xuICAgIGludml0ZXJOYW1lID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IGludml0ZXJJZFxuICAgIH0pLm5hbWU7XG4gICAgc3BhY2VOYW1lID0gZGIuc3BhY2VzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBzcGFjZUlkXG4gICAgfSkubmFtZTtcbiAgICByZXR1cm4ge1xuICAgICAgaW52aXRlcjogaW52aXRlck5hbWUsXG4gICAgICBzcGFjZTogc3BhY2VOYW1lXG4gICAgfTtcbiAgfSxcbiAgcmVmdXNlSm9pblNwYWNlOiBmdW5jdGlvbihfaWQpIHtcbiAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IF9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgaW52aXRlX3N0YXRlOiBcInJlZnVzZWRcIlxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBhY2NlcHRKb2luU3BhY2U6IGZ1bmN0aW9uKF9pZCkge1xuICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBpbnZpdGVfc3RhdGU6IFwiYWNjZXB0ZWRcIixcbiAgICAgICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoIFwiY3JlYXRvcl9vYmplY3RfcmVjb3JkXCIsIChvYmplY3RfbmFtZSwgaWQsIHNwYWNlX2lkKS0+XHJcblx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpXHJcblx0aWYgY29sbGVjdGlvblxyXG5cdFx0cmV0dXJuIGNvbGxlY3Rpb24uZmluZCh7X2lkOiBpZH0pXHJcblxyXG4iLCJNZXRlb3IucHVibGlzaChcImNyZWF0b3Jfb2JqZWN0X3JlY29yZFwiLCBmdW5jdGlvbihvYmplY3RfbmFtZSwgaWQsIHNwYWNlX2lkKSB7XG4gIHZhciBjb2xsZWN0aW9uO1xuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCk7XG4gIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICBfaWQ6IGlkXG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUgXCJzdGVlZG9zX29iamVjdF90YWJ1bGFyXCIsICh0YWJsZU5hbWUsIGlkcywgZmllbGRzLCBzcGFjZUlkKS0+XHJcblx0dW5sZXNzIHRoaXMudXNlcklkXHJcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdGNoZWNrKHRhYmxlTmFtZSwgU3RyaW5nKTtcclxuXHRjaGVjayhpZHMsIEFycmF5KTtcclxuXHRjaGVjayhmaWVsZHMsIE1hdGNoLk9wdGlvbmFsKE9iamVjdCkpO1xyXG5cclxuXHRfb2JqZWN0X25hbWUgPSB0YWJsZU5hbWUucmVwbGFjZShcImNyZWF0b3JfXCIsXCJcIilcclxuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX29iamVjdF9uYW1lLCBzcGFjZUlkKVxyXG5cclxuXHRpZiBzcGFjZUlkXHJcblx0XHRfb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldE9iamVjdE5hbWUoX29iamVjdClcclxuXHJcblx0b2JqZWN0X2NvbGxlY2l0b24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oX29iamVjdF9uYW1lKVxyXG5cclxuXHJcblx0X2ZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xyXG5cdGlmICFfZmllbGRzIHx8ICFvYmplY3RfY29sbGVjaXRvblxyXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRyZWZlcmVuY2VfZmllbGRzID0gXy5maWx0ZXIgX2ZpZWxkcywgKGYpLT5cclxuXHRcdHJldHVybiBfLmlzRnVuY3Rpb24oZi5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkoZi5yZWZlcmVuY2VfdG8pXHJcblxyXG5cdHNlbGYgPSB0aGlzXHJcblxyXG5cdHNlbGYudW5ibG9jaygpO1xyXG5cclxuXHRpZiByZWZlcmVuY2VfZmllbGRzLmxlbmd0aCA+IDBcclxuXHRcdGRhdGEgPSB7XHJcblx0XHRcdGZpbmQ6ICgpLT5cclxuXHRcdFx0XHRzZWxmLnVuYmxvY2soKTtcclxuXHRcdFx0XHRmaWVsZF9rZXlzID0ge31cclxuXHRcdFx0XHRfLmVhY2ggXy5rZXlzKGZpZWxkcyksIChmKS0+XHJcblx0XHRcdFx0XHR1bmxlc3MgL1xcdysoXFwuXFwkKXsxfVxcdz8vLnRlc3QoZilcclxuXHRcdFx0XHRcdFx0ZmllbGRfa2V5c1tmXSA9IDFcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRyZXR1cm4gb2JqZWN0X2NvbGxlY2l0b24uZmluZCh7X2lkOiB7JGluOiBpZHN9fSwge2ZpZWxkczogZmllbGRfa2V5c30pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGRhdGEuY2hpbGRyZW4gPSBbXVxyXG5cclxuXHRcdGtleXMgPSBfLmtleXMoZmllbGRzKVxyXG5cclxuXHRcdGlmIGtleXMubGVuZ3RoIDwgMVxyXG5cdFx0XHRrZXlzID0gXy5rZXlzKF9maWVsZHMpXHJcblxyXG5cdFx0X2tleXMgPSBbXVxyXG5cclxuXHRcdGtleXMuZm9yRWFjaCAoa2V5KS0+XHJcblx0XHRcdGlmIF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ11cclxuXHRcdFx0XHRfa2V5cyA9IF9rZXlzLmNvbmNhdChfLm1hcChfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddLCAoayktPlxyXG5cdFx0XHRcdFx0cmV0dXJuIGtleSArICcuJyArIGtcclxuXHRcdFx0XHQpKVxyXG5cdFx0XHRfa2V5cy5wdXNoKGtleSlcclxuXHJcblx0XHRfa2V5cy5mb3JFYWNoIChrZXkpLT5cclxuXHRcdFx0cmVmZXJlbmNlX2ZpZWxkID0gX2ZpZWxkc1trZXldXHJcblxyXG5cdFx0XHRpZiByZWZlcmVuY2VfZmllbGQgJiYgKF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pKSAgIyBhbmQgQ3JlYXRvci5Db2xsZWN0aW9uc1tyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvXVxyXG5cdFx0XHRcdGRhdGEuY2hpbGRyZW4ucHVzaCB7XHJcblx0XHRcdFx0XHRmaW5kOiAocGFyZW50KSAtPlxyXG5cdFx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0XHRzZWxmLnVuYmxvY2soKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0cXVlcnkgPSB7fVxyXG5cclxuXHRcdFx0XHRcdFx0XHQjIOihqOagvOWtkOWtl+auteeJueauiuWkhOeQhlxyXG5cdFx0XHRcdFx0XHRcdGlmIC9cXHcrKFxcLlxcJFxcLil7MX1cXHcrLy50ZXN0KGtleSlcclxuXHRcdFx0XHRcdFx0XHRcdHBfayA9IGtleS5yZXBsYWNlKC8oXFx3KylcXC5cXCRcXC5cXHcrL2lnLCBcIiQxXCIpXHJcblx0XHRcdFx0XHRcdFx0XHRzX2sgPSBrZXkucmVwbGFjZSgvXFx3K1xcLlxcJFxcLihcXHcrKS9pZywgXCIkMVwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX2lkcyA9IHBhcmVudFtwX2tdLmdldFByb3BlcnR5KHNfaylcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfaWRzID0ga2V5LnNwbGl0KCcuJykucmVkdWNlIChvLCB4KSAtPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG8/W3hdXHJcblx0XHRcdFx0XHRcdFx0XHQsIHBhcmVudFxyXG5cclxuXHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvXHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8oKVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkocmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgXy5pc09iamVjdChyZWZlcmVuY2VfaWRzKSAmJiAhXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpXHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9pZHMub1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfaWRzID0gcmVmZXJlbmNlX2lkcy5pZHMgfHwgW11cclxuXHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFtdXHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShyZWZlcmVuY2VfaWRzKVxyXG5cdFx0XHRcdFx0XHRcdFx0cXVlcnkuX2lkID0geyRpbjogcmVmZXJlbmNlX2lkc31cclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRxdWVyeS5faWQgPSByZWZlcmVuY2VfaWRzXHJcblxyXG5cdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90b19vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWZlcmVuY2VfdG8sIHNwYWNlSWQpXHJcblxyXG5cdFx0XHRcdFx0XHRcdG5hbWVfZmllbGRfa2V5ID0gcmVmZXJlbmNlX3RvX29iamVjdC5OQU1FX0ZJRUxEX0tFWVxyXG5cclxuXHRcdFx0XHRcdFx0XHRjaGlsZHJlbl9maWVsZHMgPSB7X2lkOiAxLCBzcGFjZTogMX1cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgbmFtZV9maWVsZF9rZXlcclxuXHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuX2ZpZWxkc1tuYW1lX2ZpZWxkX2tleV0gPSAxXHJcblxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kKHF1ZXJ5LCB7XHJcblx0XHRcdFx0XHRcdFx0XHRmaWVsZHM6IGNoaWxkcmVuX2ZpZWxkc1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2cocmVmZXJlbmNlX3RvLCBwYXJlbnQsIGUpXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFtdXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZmluZDogKCktPlxyXG5cdFx0XHRcdHNlbGYudW5ibG9jaygpO1xyXG5cdFx0XHRcdHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtfaWQ6IHskaW46IGlkc319LCB7ZmllbGRzOiBmaWVsZHN9KVxyXG5cdFx0fTtcclxuXHJcbiIsIk1ldGVvci5wdWJsaXNoQ29tcG9zaXRlKFwic3RlZWRvc19vYmplY3RfdGFidWxhclwiLCBmdW5jdGlvbih0YWJsZU5hbWUsIGlkcywgZmllbGRzLCBzcGFjZUlkKSB7XG4gIHZhciBfZmllbGRzLCBfa2V5cywgX29iamVjdCwgX29iamVjdF9uYW1lLCBkYXRhLCBrZXlzLCBvYmplY3RfY29sbGVjaXRvbiwgcmVmZXJlbmNlX2ZpZWxkcywgc2VsZjtcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgY2hlY2sodGFibGVOYW1lLCBTdHJpbmcpO1xuICBjaGVjayhpZHMsIEFycmF5KTtcbiAgY2hlY2soZmllbGRzLCBNYXRjaC5PcHRpb25hbChPYmplY3QpKTtcbiAgX29iamVjdF9uYW1lID0gdGFibGVOYW1lLnJlcGxhY2UoXCJjcmVhdG9yX1wiLCBcIlwiKTtcbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9vYmplY3RfbmFtZSwgc3BhY2VJZCk7XG4gIGlmIChzcGFjZUlkKSB7XG4gICAgX29iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRPYmplY3ROYW1lKF9vYmplY3QpO1xuICB9XG4gIG9iamVjdF9jb2xsZWNpdG9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKF9vYmplY3RfbmFtZSk7XG4gIF9maWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgaWYgKCFfZmllbGRzIHx8ICFvYmplY3RfY29sbGVjaXRvbikge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmVmZXJlbmNlX2ZpZWxkcyA9IF8uZmlsdGVyKF9maWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKGYucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KGYucmVmZXJlbmNlX3RvKTtcbiAgfSk7XG4gIHNlbGYgPSB0aGlzO1xuICBzZWxmLnVuYmxvY2soKTtcbiAgaWYgKHJlZmVyZW5jZV9maWVsZHMubGVuZ3RoID4gMCkge1xuICAgIGRhdGEgPSB7XG4gICAgICBmaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZpZWxkX2tleXM7XG4gICAgICAgIHNlbGYudW5ibG9jaygpO1xuICAgICAgICBmaWVsZF9rZXlzID0ge307XG4gICAgICAgIF8uZWFjaChfLmtleXMoZmllbGRzKSwgZnVuY3Rpb24oZikge1xuICAgICAgICAgIGlmICghL1xcdysoXFwuXFwkKXsxfVxcdz8vLnRlc3QoZikpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZF9rZXlzW2ZdID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb2JqZWN0X2NvbGxlY2l0b24uZmluZCh7XG4gICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAkaW46IGlkc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogZmllbGRfa2V5c1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGRhdGEuY2hpbGRyZW4gPSBbXTtcbiAgICBrZXlzID0gXy5rZXlzKGZpZWxkcyk7XG4gICAgaWYgKGtleXMubGVuZ3RoIDwgMSkge1xuICAgICAga2V5cyA9IF8ua2V5cyhfZmllbGRzKTtcbiAgICB9XG4gICAgX2tleXMgPSBbXTtcbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXSkge1xuICAgICAgICBfa2V5cyA9IF9rZXlzLmNvbmNhdChfLm1hcChfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddLCBmdW5jdGlvbihrKSB7XG4gICAgICAgICAgcmV0dXJuIGtleSArICcuJyArIGs7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfa2V5cy5wdXNoKGtleSk7XG4gICAgfSk7XG4gICAgX2tleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciByZWZlcmVuY2VfZmllbGQ7XG4gICAgICByZWZlcmVuY2VfZmllbGQgPSBfZmllbGRzW2tleV07XG4gICAgICBpZiAocmVmZXJlbmNlX2ZpZWxkICYmIChfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykgfHwgIV8uaXNFbXB0eShyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuY2hpbGRyZW4ucHVzaCh7XG4gICAgICAgICAgZmluZDogZnVuY3Rpb24ocGFyZW50KSB7XG4gICAgICAgICAgICB2YXIgY2hpbGRyZW5fZmllbGRzLCBlLCBuYW1lX2ZpZWxkX2tleSwgcF9rLCBxdWVyeSwgcmVmZXJlbmNlX2lkcywgcmVmZXJlbmNlX3RvLCByZWZlcmVuY2VfdG9fb2JqZWN0LCBzX2s7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBzZWxmLnVuYmxvY2soKTtcbiAgICAgICAgICAgICAgcXVlcnkgPSB7fTtcbiAgICAgICAgICAgICAgaWYgKC9cXHcrKFxcLlxcJFxcLil7MX1cXHcrLy50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICBwX2sgPSBrZXkucmVwbGFjZSgvKFxcdyspXFwuXFwkXFwuXFx3Ky9pZywgXCIkMVwiKTtcbiAgICAgICAgICAgICAgICBzX2sgPSBrZXkucmVwbGFjZSgvXFx3K1xcLlxcJFxcLihcXHcrKS9pZywgXCIkMVwiKTtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VfaWRzID0gcGFyZW50W3Bfa10uZ2V0UHJvcGVydHkoc19rKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VfaWRzID0ga2V5LnNwbGl0KCcuJykucmVkdWNlKGZ1bmN0aW9uKG8sIHgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBvICE9IG51bGwgPyBvW3hdIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgIH0sIHBhcmVudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKF8uaXNBcnJheShyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QocmVmZXJlbmNlX2lkcykgJiYgIV8uaXNBcnJheShyZWZlcmVuY2VfaWRzKSkge1xuICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX2lkcy5vO1xuICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlX2lkcyA9IHJlZmVyZW5jZV9pZHMuaWRzIHx8IFtdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChfLmlzQXJyYXkocmVmZXJlbmNlX2lkcykpIHtcbiAgICAgICAgICAgICAgICBxdWVyeS5faWQgPSB7XG4gICAgICAgICAgICAgICAgICAkaW46IHJlZmVyZW5jZV9pZHNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHF1ZXJ5Ll9pZCA9IHJlZmVyZW5jZV9pZHM7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlZmVyZW5jZV90bywgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIG5hbWVfZmllbGRfa2V5ID0gcmVmZXJlbmNlX3RvX29iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgICAgICAgICAgICAgY2hpbGRyZW5fZmllbGRzID0ge1xuICAgICAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgICAgICBzcGFjZTogMVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBpZiAobmFtZV9maWVsZF9rZXkpIHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbl9maWVsZHNbbmFtZV9maWVsZF9rZXldID0gMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZChxdWVyeSwge1xuICAgICAgICAgICAgICAgIGZpZWxkczogY2hpbGRyZW5fZmllbGRzXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZWZlcmVuY2VfdG8sIHBhcmVudCwgZSk7XG4gICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBmaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICAgIHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtcbiAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICRpbjogaWRzXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBmaWVsZHNcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufSk7XG4iLCJNZXRlb3IucHVibGlzaCBcIm9iamVjdF9saXN0dmlld3NcIiwgKG9iamVjdF9uYW1lLCBzcGFjZUlkKS0+XHJcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxyXG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBzcGFjZTogc3BhY2VJZCAsXCIkb3JcIjpbe293bmVyOiB1c2VySWR9LCB7c2hhcmVkOiB0cnVlfV19KSIsIk1ldGVvci5wdWJsaXNoIFwidXNlcl90YWJ1bGFyX3NldHRpbmdzXCIsIChvYmplY3RfbmFtZSktPlxyXG4gICAgdXNlcklkID0gdGhpcy51c2VySWRcclxuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmQoe29iamVjdF9uYW1lOiB7JGluOiBvYmplY3RfbmFtZX0sIHJlY29yZF9pZDogeyRpbjogW1wib2JqZWN0X2xpc3R2aWV3c1wiLCBcIm9iamVjdF9ncmlkdmlld3NcIl19LCBvd25lcjogdXNlcklkfSlcclxuIiwiTWV0ZW9yLnB1Ymxpc2ggXCJyZWxhdGVkX29iamVjdHNfcmVjb3Jkc1wiLCAob2JqZWN0X25hbWUsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZUlkKS0+XHJcblx0dXNlcklkID0gdGhpcy51c2VySWRcclxuXHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIlxyXG5cdFx0c2VsZWN0b3IgPSB7XCJtZXRhZGF0YS5zcGFjZVwiOiBzcGFjZUlkfVxyXG5cdGVsc2VcclxuXHRcdHNlbGVjdG9yID0ge3NwYWNlOiBzcGFjZUlkfVxyXG5cdFxyXG5cdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxyXG5cdFx0IyDpmYTku7bnmoTlhbPogZTmkJzntKLmnaHku7bmmK/lrprmrbvnmoRcclxuXHRcdHNlbGVjdG9yW1wicGFyZW50Lm9cIl0gPSBvYmplY3RfbmFtZVxyXG5cdFx0c2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF1cclxuXHRlbHNlXHJcblx0XHRzZWxlY3RvcltyZWxhdGVkX2ZpZWxkX25hbWVdID0gcmVjb3JkX2lkXHJcblxyXG5cdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXHJcblx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcclxuXHRcdHNlbGVjdG9yLm93bmVyID0gdXNlcklkXHJcblx0XHJcblx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKSIsIk1ldGVvci5wdWJsaXNoKFwicmVsYXRlZF9vYmplY3RzX3JlY29yZHNcIiwgZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZUlkKSB7XG4gIHZhciBwZXJtaXNzaW9ucywgc2VsZWN0b3IsIHVzZXJJZDtcbiAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpIHtcbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIFwibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH07XG4gIH1cbiAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICBzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWU7XG4gICAgc2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF07XG4gIH0gZWxzZSB7XG4gICAgc2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZDtcbiAgfVxuICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy5hbGxvd1JlYWQpIHtcbiAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZDtcbiAgfVxuICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCAnc3BhY2VfdXNlcl9pbmZvJywgKHNwYWNlSWQsIHVzZXJJZCktPlxyXG5cdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSkiLCJcclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblxyXG5cdE1ldGVvci5wdWJsaXNoICdjb250YWN0c192aWV3X2xpbWl0cycsIChzcGFjZUlkKS0+XHJcblxyXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXHJcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0XHR1bmxlc3Mgc3BhY2VJZFxyXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdFx0c2VsZWN0b3IgPVxyXG5cdFx0XHRzcGFjZTogc3BhY2VJZFxyXG5cdFx0XHRrZXk6ICdjb250YWN0c192aWV3X2xpbWl0cydcclxuXHJcblx0XHRyZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3RvcikiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdjb250YWN0c192aWV3X2xpbWl0cycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAga2V5OiAnY29udGFjdHNfdmlld19saW1pdHMnXG4gICAgfTtcbiAgICByZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3Rvcik7XG4gIH0pO1xufVxuIiwiXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cclxuXHRNZXRlb3IucHVibGlzaCAnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnLCAoc3BhY2VJZCktPlxyXG5cclxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxyXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdFx0dW5sZXNzIHNwYWNlSWRcclxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRcdHNlbGVjdG9yID1cclxuXHRcdFx0c3BhY2U6IHNwYWNlSWRcclxuXHRcdFx0a2V5OiAnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnXHJcblxyXG5cdFx0cmV0dXJuIGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoc2VsZWN0b3IpIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIHNlbGVjdG9yO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIGtleTogJ2NvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzJ1xuICAgIH07XG4gICAgcmV0dXJuIGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoc2VsZWN0b3IpO1xuICB9KTtcbn1cbiIsImlmIE1ldGVvci5pc1NlcnZlclxyXG5cdE1ldGVvci5wdWJsaXNoICdzcGFjZV9uZWVkX3RvX2NvbmZpcm0nLCAoKS0+XHJcblx0XHR1c2VySWQgPSB0aGlzLnVzZXJJZFxyXG5cdFx0cmV0dXJuIGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHVzZXJJZCwgaW52aXRlX3N0YXRlOiBcInBlbmRpbmdcIn0pIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnc3BhY2VfbmVlZF90b19jb25maXJtJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBpbnZpdGVfc3RhdGU6IFwicGVuZGluZ1wiXG4gICAgfSk7XG4gIH0pO1xufVxuIiwicGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwgPSB7fVxyXG5cclxucGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rmxvd1Blcm1pc3Npb25zID0gKGZsb3dfaWQsIHVzZXJfaWQpIC0+XHJcblx0IyDmoLnmja46Zmxvd19pZOafpeWIsOWvueW6lOeahGZsb3dcclxuXHRmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpXHJcblx0c3BhY2VfaWQgPSBmbG93LnNwYWNlXHJcblx0IyDmoLnmja5zcGFjZV9pZOWSjDp1c2VyX2lk5Yiwb3JnYW5pemF0aW9uc+ihqOS4reafpeWIsOeUqOaIt+aJgOWxnuaJgOacieeahG9yZ19pZO+8iOWMheaLrOS4iue6p+e7hElE77yJXHJcblx0b3JnX2lkcyA9IG5ldyBBcnJheVxyXG5cdG9yZ2FuaXphdGlvbnMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xyXG5cdFx0c3BhY2U6IHNwYWNlX2lkLCB1c2VyczogdXNlcl9pZCB9LCB7IGZpZWxkczogeyBwYXJlbnRzOiAxIH0gfSkuZmV0Y2goKVxyXG5cdF8uZWFjaChvcmdhbml6YXRpb25zLCAob3JnKSAtPlxyXG5cdFx0b3JnX2lkcy5wdXNoKG9yZy5faWQpXHJcblx0XHRpZiBvcmcucGFyZW50c1xyXG5cdFx0XHRfLmVhY2gob3JnLnBhcmVudHMsIChwYXJlbnRfaWQpIC0+XHJcblx0XHRcdFx0b3JnX2lkcy5wdXNoKHBhcmVudF9pZClcclxuXHRcdFx0KVxyXG5cdClcclxuXHRvcmdfaWRzID0gXy51bmlxKG9yZ19pZHMpXHJcblx0bXlfcGVybWlzc2lvbnMgPSBuZXcgQXJyYXlcclxuXHRpZiBmbG93LnBlcm1zXHJcblx0XHQjIOWIpOaWrWZsb3cucGVybXMudXNlcnNfY2FuX2FkbWlu5Lit5piv5ZCm5YyF5ZCr5b2T5YmN55So5oi377yMXHJcblx0XHQjIOaIluiAhWZsb3cucGVybXMub3Jnc19jYW5fYWRk5piv5ZCm5YyF5ZCrNOatpeW+l+WIsOeahG9yZ19pZOaVsOe7hOS4reeahOS7u+S9leS4gOS4qu+8jFxyXG5cdFx0IyDoi6XmmK/vvIzliJnlnKjov5Tlm57nmoTmlbDnu4TkuK3liqDkuIphZGRcclxuXHRcdGlmIGZsb3cucGVybXMudXNlcnNfY2FuX2FkZFxyXG5cdFx0XHR1c2Vyc19jYW5fYWRkID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRkXHJcblx0XHRcdGlmIHVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcl9pZClcclxuXHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpXHJcblxyXG5cdFx0aWYgZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGRcclxuXHRcdFx0b3Jnc19jYW5fYWRkID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGRcclxuXHRcdFx0Xy5lYWNoKG9yZ19pZHMsIChvcmdfaWQpIC0+XHJcblx0XHRcdFx0aWYgb3Jnc19jYW5fYWRkLmluY2x1ZGVzKG9yZ19pZClcclxuXHRcdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJhZGRcIilcclxuXHRcdFx0KVxyXG5cdFx0IyDliKTmlq1mbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9y5Lit5piv5ZCm5YyF5ZCr5b2T5YmN55So5oi377yMXHJcblx0XHQjIOaIluiAhWZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvcuaYr+WQpuWMheWQqzTmraXlvpfliLDnmoRvcmdfaWTmlbDnu4TkuK3nmoTku7vkvZXkuIDkuKrvvIxcclxuXHRcdCMg6Iul5piv77yM5YiZ5Zyo6L+U5Zue55qE5pWw57uE5Lit5Yqg5LiKbW9uaXRvclxyXG5cdFx0aWYgZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvclxyXG5cdFx0XHR1c2Vyc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3JcclxuXHRcdFx0aWYgdXNlcnNfY2FuX21vbml0b3IuaW5jbHVkZXModXNlcl9pZClcclxuXHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKVxyXG5cclxuXHRcdGlmIGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvclxyXG5cdFx0XHRvcmdzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yXHJcblx0XHRcdF8uZWFjaChvcmdfaWRzLCAob3JnX2lkKSAtPlxyXG5cdFx0XHRcdGlmIG9yZ3NfY2FuX21vbml0b3IuaW5jbHVkZXMob3JnX2lkKVxyXG5cdFx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIilcclxuXHRcdFx0KVxyXG5cdFx0IyDliKTmlq1mbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbuS4reaYr+WQpuWMheWQq+W9k+WJjeeUqOaIt++8jFxyXG5cdFx0IyDmiJbogIVmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWlu5piv5ZCm5YyF5ZCrNOatpeW+l+WIsOeahG9yZ19pZOaVsOe7hOS4reeahOS7u+S9leS4gOS4qu+8jFxyXG5cdFx0IyDoi6XmmK/vvIzliJnlnKjov5Tlm57nmoTmlbDnu4TkuK3liqDkuIphZG1pblxyXG5cdFx0aWYgZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW5cclxuXHRcdFx0dXNlcnNfY2FuX2FkbWluID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW5cclxuXHRcdFx0aWYgdXNlcnNfY2FuX2FkbWluLmluY2x1ZGVzKHVzZXJfaWQpXHJcblx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkbWluXCIpXHJcblxyXG5cdFx0aWYgZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pblxyXG5cdFx0XHRvcmdzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW5cclxuXHRcdFx0Xy5lYWNoKG9yZ19pZHMsIChvcmdfaWQpIC0+XHJcblx0XHRcdFx0aWYgb3Jnc19jYW5fYWRtaW4uaW5jbHVkZXMob3JnX2lkKVxyXG5cdFx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkbWluXCIpXHJcblx0XHRcdClcclxuXHJcblx0bXlfcGVybWlzc2lvbnMgPSBfLnVuaXEobXlfcGVybWlzc2lvbnMpXHJcblx0cmV0dXJuIG15X3Blcm1pc3Npb25zIiwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5wZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9O1xuXG5wZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93UGVybWlzc2lvbnMgPSBmdW5jdGlvbihmbG93X2lkLCB1c2VyX2lkKSB7XG4gIHZhciBmbG93LCBteV9wZXJtaXNzaW9ucywgb3JnX2lkcywgb3JnYW5pemF0aW9ucywgb3Jnc19jYW5fYWRkLCBvcmdzX2Nhbl9hZG1pbiwgb3Jnc19jYW5fbW9uaXRvciwgc3BhY2VfaWQsIHVzZXJzX2Nhbl9hZGQsIHVzZXJzX2Nhbl9hZG1pbiwgdXNlcnNfY2FuX21vbml0b3I7XG4gIGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZCk7XG4gIHNwYWNlX2lkID0gZmxvdy5zcGFjZTtcbiAgb3JnX2lkcyA9IG5ldyBBcnJheTtcbiAgb3JnYW5pemF0aW9ucyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHVzZXJzOiB1c2VyX2lkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHBhcmVudHM6IDFcbiAgICB9XG4gIH0pLmZldGNoKCk7XG4gIF8uZWFjaChvcmdhbml6YXRpb25zLCBmdW5jdGlvbihvcmcpIHtcbiAgICBvcmdfaWRzLnB1c2gob3JnLl9pZCk7XG4gICAgaWYgKG9yZy5wYXJlbnRzKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKG9yZy5wYXJlbnRzLCBmdW5jdGlvbihwYXJlbnRfaWQpIHtcbiAgICAgICAgcmV0dXJuIG9yZ19pZHMucHVzaChwYXJlbnRfaWQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgb3JnX2lkcyA9IF8udW5pcShvcmdfaWRzKTtcbiAgbXlfcGVybWlzc2lvbnMgPSBuZXcgQXJyYXk7XG4gIGlmIChmbG93LnBlcm1zKSB7XG4gICAgaWYgKGZsb3cucGVybXMudXNlcnNfY2FuX2FkZCkge1xuICAgICAgdXNlcnNfY2FuX2FkZCA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkZDtcbiAgICAgIGlmICh1c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJfaWQpKSB7XG4gICAgICAgIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZGRcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZCkge1xuICAgICAgb3Jnc19jYW5fYWRkID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGQ7XG4gICAgICBfLmVhY2gob3JnX2lkcywgZnVuY3Rpb24ob3JnX2lkKSB7XG4gICAgICAgIGlmIChvcmdzX2Nhbl9hZGQuaW5jbHVkZXMob3JnX2lkKSkge1xuICAgICAgICAgIHJldHVybiBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3IpIHtcbiAgICAgIHVzZXJzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvcjtcbiAgICAgIGlmICh1c2Vyc19jYW5fbW9uaXRvci5pbmNsdWRlcyh1c2VyX2lkKSkge1xuICAgICAgICBteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvcikge1xuICAgICAgb3Jnc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvcjtcbiAgICAgIF8uZWFjaChvcmdfaWRzLCBmdW5jdGlvbihvcmdfaWQpIHtcbiAgICAgICAgaWYgKG9yZ3NfY2FuX21vbml0b3IuaW5jbHVkZXMob3JnX2lkKSkge1xuICAgICAgICAgIHJldHVybiBteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbikge1xuICAgICAgdXNlcnNfY2FuX2FkbWluID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW47XG4gICAgICBpZiAodXNlcnNfY2FuX2FkbWluLmluY2x1ZGVzKHVzZXJfaWQpKSB7XG4gICAgICAgIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW4pIHtcbiAgICAgIG9yZ3NfY2FuX2FkbWluID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pbjtcbiAgICAgIF8uZWFjaChvcmdfaWRzLCBmdW5jdGlvbihvcmdfaWQpIHtcbiAgICAgICAgaWYgKG9yZ3NfY2FuX2FkbWluLmluY2x1ZGVzKG9yZ19pZCkpIHtcbiAgICAgICAgICByZXR1cm4gbXlfcGVybWlzc2lvbnMucHVzaChcImFkbWluXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgbXlfcGVybWlzc2lvbnMgPSBfLnVuaXEobXlfcGVybWlzc2lvbnMpO1xuICByZXR1cm4gbXlfcGVybWlzc2lvbnM7XG59O1xuIiwiX2V2YWwgPSByZXF1aXJlKCdldmFsJylcclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9XHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24gPSAocmVxKSAtPlxyXG5cdHF1ZXJ5ID0gcmVxLnF1ZXJ5XHJcblx0dXNlcklkID0gcXVlcnlbXCJYLVVzZXItSWRcIl1cclxuXHRhdXRoVG9rZW4gPSBxdWVyeVtcIlgtQXV0aC1Ub2tlblwiXVxyXG5cclxuXHRpZiBub3QgdXNlcklkIG9yIG5vdCBhdXRoVG9rZW5cclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xyXG5cclxuXHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXHJcblx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXHJcblx0XHRfaWQ6IHVzZXJJZCxcclxuXHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXHJcblxyXG5cdGlmIG5vdCB1c2VyXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcclxuXHJcblx0cmV0dXJuIHVzZXJcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2UgPSAoc3BhY2VfaWQpIC0+XHJcblx0c3BhY2UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxyXG5cdGlmIG5vdCBzcGFjZVxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJzcGFjZV9pZOacieivr+aIluatpHNwYWNl5bey57uP6KKr5Yig6ZmkXCIpXHJcblx0cmV0dXJuIHNwYWNlXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3cgPSAoZmxvd19pZCkgLT5cclxuXHRmbG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5mbG93cy5maW5kT25lKGZsb3dfaWQpXHJcblx0aWYgbm90IGZsb3dcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwiaWTmnInor6/miJbmraTmtYHnqIvlt7Lnu4/ooqvliKDpmaRcIilcclxuXHRyZXR1cm4gZmxvd1xyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXIgPSAoc3BhY2VfaWQsIHVzZXJfaWQpIC0+XHJcblx0c3BhY2VfdXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc3BhY2VfdXNlcnMuZmluZE9uZSh7IHNwYWNlOiBzcGFjZV9pZCwgdXNlcjogdXNlcl9pZCB9KVxyXG5cdGlmIG5vdCBzcGFjZV91c2VyXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInVzZXJfaWTlr7nlupTnmoTnlKjmiLfkuI3lsZ7kuo7lvZPliY1zcGFjZVwiKVxyXG5cdHJldHVybiBzcGFjZV91c2VyXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8gPSAoc3BhY2VfdXNlcikgLT5cclxuXHRpbmZvID0gbmV3IE9iamVjdFxyXG5cdGluZm8ub3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb25cclxuXHRvcmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9yZ2FuaXphdGlvbnMuZmluZE9uZShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbiwgeyBmaWVsZHM6IHsgbmFtZTogMSAsIGZ1bGxuYW1lOiAxIH0gfSlcclxuXHRpbmZvLm9yZ2FuaXphdGlvbl9uYW1lID0gb3JnLm5hbWVcclxuXHRpbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IG9yZy5mdWxsbmFtZVxyXG5cdHJldHVybiBpbmZvXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd0VuYWJsZWQgPSAoZmxvdykgLT5cclxuXHRpZiBmbG93LnN0YXRlIGlzbnQgXCJlbmFibGVkXCJcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5pyq5ZCv55SoLOaTjeS9nOWksei0pVwiKVxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQgPSAoZmxvdywgc3BhY2VfaWQpIC0+XHJcblx0aWYgZmxvdy5zcGFjZSBpc250IHNwYWNlX2lkXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+WSjOW3peS9nOWMuklE5LiN5Yy56YWNXCIpXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZvcm0gPSAoZm9ybV9pZCkgLT5cclxuXHRmb3JtID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5mb3Jtcy5maW5kT25lKGZvcm1faWQpXHJcblx0aWYgbm90IGZvcm1cclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsICfooajljZVJROacieivr+aIluatpOihqOWNleW3sue7j+iiq+WIoOmZpCcpXHJcblxyXG5cdHJldHVybiBmb3JtXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldENhdGVnb3J5ID0gKGNhdGVnb3J5X2lkKSAtPlxyXG5cdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLmNhdGVnb3JpZXMuZmluZE9uZShjYXRlZ29yeV9pZClcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY3JlYXRlX2luc3RhbmNlID0gKGluc3RhbmNlX2Zyb21fY2xpZW50LCB1c2VyX2luZm8pIC0+XHJcblx0Y2hlY2sgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0sIFN0cmluZ1xyXG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0sIFN0cmluZ1xyXG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXSwgU3RyaW5nXHJcblx0Y2hlY2sgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdLCBbe286IFN0cmluZywgaWRzOiBbU3RyaW5nXX1dXHJcblxyXG5cdCMg5qCh6aqM5piv5ZCmcmVjb3Jk5bey57uP5Y+R6LW355qE55Sz6K+36L+Y5Zyo5a6h5om55LitXHJcblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja0lzSW5BcHByb3ZhbChpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl1bMF0sIGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0pXHJcblxyXG5cdHNwYWNlX2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXVxyXG5cdGZsb3dfaWQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl1cclxuXHR1c2VyX2lkID0gdXNlcl9pbmZvLl9pZFxyXG5cdCMg6I635Y+W5YmN5Y+w5omA5Lyg55qEdHJhY2VcclxuXHR0cmFjZV9mcm9tX2NsaWVudCA9IG51bGxcclxuXHQjIOiOt+WPluWJjeWPsOaJgOS8oOeahGFwcHJvdmVcclxuXHRhcHByb3ZlX2Zyb21fY2xpZW50ID0gbnVsbFxyXG5cdGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdIGFuZCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXVxyXG5cdFx0dHJhY2VfZnJvbV9jbGllbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXVxyXG5cdFx0aWYgdHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXSBhbmQgdHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXVswXVxyXG5cdFx0XHRhcHByb3ZlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1bXCJhcHByb3Zlc1wiXVswXVxyXG5cclxuXHQjIOiOt+WPluS4gOS4qnNwYWNlXHJcblx0c3BhY2UgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlKHNwYWNlX2lkKVxyXG5cdCMg6I635Y+W5LiA5LiqZmxvd1xyXG5cdGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZClcclxuXHQjIOiOt+WPluS4gOS4qnNwYWNl5LiL55qE5LiA5LiqdXNlclxyXG5cdHNwYWNlX3VzZXIgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlcihzcGFjZV9pZCwgdXNlcl9pZClcclxuXHQjIOiOt+WPlnNwYWNlX3VzZXLmiYDlnKjnmoTpg6jpl6jkv6Hmga9cclxuXHRzcGFjZV91c2VyX29yZ19pbmZvID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXJPcmdJbmZvKHNwYWNlX3VzZXIpXHJcblx0IyDliKTmlq3kuIDkuKpmbG935piv5ZCm5Li65ZCv55So54q25oCBXHJcblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dFbmFibGVkKGZsb3cpXHJcblx0IyDliKTmlq3kuIDkuKpmbG935ZKMc3BhY2VfaWTmmK/lkKbljLnphY1cclxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZChmbG93LCBzcGFjZV9pZClcclxuXHJcblx0Zm9ybSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybShmbG93LmZvcm0pXHJcblxyXG5cdHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dfaWQsIHVzZXJfaWQpXHJcblxyXG5cdGlmIG5vdCBwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkZFwiKVxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLlvZPliY3nlKjmiLfmsqHmnInmraTmtYHnqIvnmoTmlrDlu7rmnYPpmZBcIilcclxuXHJcblx0bm93ID0gbmV3IERhdGVcclxuXHRpbnNfb2JqID0ge31cclxuXHRpbnNfb2JqLl9pZCA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLl9tYWtlTmV3SUQoKVxyXG5cdGluc19vYmouc3BhY2UgPSBzcGFjZV9pZFxyXG5cdGluc19vYmouZmxvdyA9IGZsb3dfaWRcclxuXHRpbnNfb2JqLmZsb3dfdmVyc2lvbiA9IGZsb3cuY3VycmVudC5faWRcclxuXHRpbnNfb2JqLmZvcm0gPSBmbG93LmZvcm1cclxuXHRpbnNfb2JqLmZvcm1fdmVyc2lvbiA9IGZsb3cuY3VycmVudC5mb3JtX3ZlcnNpb25cclxuXHRpbnNfb2JqLm5hbWUgPSBmbG93Lm5hbWVcclxuXHRpbnNfb2JqLnN1Ym1pdHRlciA9IHVzZXJfaWRcclxuXHRpbnNfb2JqLnN1Ym1pdHRlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWVcclxuXHRpbnNfb2JqLmFwcGxpY2FudCA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gZWxzZSB1c2VyX2lkXHJcblx0aW5zX29iai5hcHBsaWNhbnRfbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIGVsc2UgdXNlcl9pbmZvLm5hbWVcclxuXHRpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb24gPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25cIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25cIl0gZWxzZSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvblxyXG5cdGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZVwiXSBlbHNlIHNwYWNlX3VzZXJfb3JnX2luZm8ub3JnYW5pemF0aW9uX25hbWVcclxuXHRpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gZWxzZSAgc3BhY2VfdXNlcl9vcmdfaW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWVcclxuXHRpbnNfb2JqLmFwcGxpY2FudF9jb21wYW55ID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfY29tcGFueVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gZWxzZSBzcGFjZV91c2VyLmNvbXBhbnlfaWRcclxuXHRpbnNfb2JqLnN0YXRlID0gJ2RyYWZ0J1xyXG5cdGluc19vYmouY29kZSA9ICcnXHJcblx0aW5zX29iai5pc19hcmNoaXZlZCA9IGZhbHNlXHJcblx0aW5zX29iai5pc19kZWxldGVkID0gZmFsc2VcclxuXHRpbnNfb2JqLmNyZWF0ZWQgPSBub3dcclxuXHRpbnNfb2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkXHJcblx0aW5zX29iai5tb2RpZmllZCA9IG5vd1xyXG5cdGluc19vYmoubW9kaWZpZWRfYnkgPSB1c2VyX2lkXHJcblx0aW5zX29iai52YWx1ZXMgPSBuZXcgT2JqZWN0XHJcblxyXG5cdGluc19vYmoucmVjb3JkX2lkcyA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVxyXG5cclxuXHRpZiBzcGFjZV91c2VyLmNvbXBhbnlfaWRcclxuXHRcdGluc19vYmouY29tcGFueV9pZCA9IHNwYWNlX3VzZXIuY29tcGFueV9pZFxyXG5cclxuXHQjIOaWsOW7ulRyYWNlXHJcblx0dHJhY2Vfb2JqID0ge31cclxuXHR0cmFjZV9vYmouX2lkID0gbmV3IE1vbmdvLk9iamVjdElEKCkuX3N0clxyXG5cdHRyYWNlX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkXHJcblx0dHJhY2Vfb2JqLmlzX2ZpbmlzaGVkID0gZmFsc2VcclxuXHQjIOW9k+WJjeacgOaWsOeJiGZsb3fkuK3lvIDlp4voioLngrlcclxuXHRzdGFydF9zdGVwID0gXy5maW5kKGZsb3cuY3VycmVudC5zdGVwcywgKHN0ZXApIC0+XHJcblx0XHRyZXR1cm4gc3RlcC5zdGVwX3R5cGUgaXMgJ3N0YXJ0J1xyXG5cdClcclxuXHR0cmFjZV9vYmouc3RlcCA9IHN0YXJ0X3N0ZXAuX2lkXHJcblx0dHJhY2Vfb2JqLm5hbWUgPSBzdGFydF9zdGVwLm5hbWVcclxuXHJcblx0dHJhY2Vfb2JqLnN0YXJ0X2RhdGUgPSBub3dcclxuXHQjIOaWsOW7ukFwcHJvdmVcclxuXHRhcHByX29iaiA9IHt9XHJcblx0YXBwcl9vYmouX2lkID0gbmV3IE1vbmdvLk9iamVjdElEKCkuX3N0clxyXG5cdGFwcHJfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWRcclxuXHRhcHByX29iai50cmFjZSA9IHRyYWNlX29iai5faWRcclxuXHRhcHByX29iai5pc19maW5pc2hlZCA9IGZhbHNlXHJcblx0YXBwcl9vYmoudXNlciA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gZWxzZSB1c2VyX2lkXHJcblx0YXBwcl9vYmoudXNlcl9uYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gZWxzZSB1c2VyX2luZm8ubmFtZVxyXG5cdGFwcHJfb2JqLmhhbmRsZXIgPSB1c2VyX2lkXHJcblx0YXBwcl9vYmouaGFuZGxlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWVcclxuXHRhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbiA9IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uXHJcblx0YXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb25fbmFtZSA9IHNwYWNlX3VzZXJfb3JnX2luZm8ubmFtZVxyXG5cdGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5mdWxsbmFtZVxyXG5cdGFwcHJfb2JqLnR5cGUgPSAnZHJhZnQnXHJcblx0YXBwcl9vYmouc3RhcnRfZGF0ZSA9IG5vd1xyXG5cdGFwcHJfb2JqLnJlYWRfZGF0ZSA9IG5vd1xyXG5cdGFwcHJfb2JqLmlzX3JlYWQgPSB0cnVlXHJcblx0YXBwcl9vYmouaXNfZXJyb3IgPSBmYWxzZVxyXG5cdGFwcHJfb2JqLmRlc2NyaXB0aW9uID0gJydcclxuXHRyZWxhdGVkVGFibGVzSW5mbyA9IHt9XHJcblx0YXBwcl9vYmoudmFsdWVzID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVZhbHVlcyhpbnNfb2JqLnJlY29yZF9pZHNbMF0sIGZsb3dfaWQsIHNwYWNlX2lkLCBmb3JtLmN1cnJlbnQuZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbylcclxuXHJcblx0dHJhY2Vfb2JqLmFwcHJvdmVzID0gW2FwcHJfb2JqXVxyXG5cdGluc19vYmoudHJhY2VzID0gW3RyYWNlX29ial1cclxuXHJcblx0aW5zX29iai5pbmJveF91c2VycyA9IGluc3RhbmNlX2Zyb21fY2xpZW50LmluYm94X3VzZXJzIHx8IFtdXHJcblxyXG5cdGluc19vYmouY3VycmVudF9zdGVwX25hbWUgPSBzdGFydF9zdGVwLm5hbWVcclxuXHJcblx0aWYgZmxvdy5hdXRvX3JlbWluZCBpcyB0cnVlXHJcblx0XHRpbnNfb2JqLmF1dG9fcmVtaW5kID0gdHJ1ZVxyXG5cclxuXHQjIOaWsOW7uueUs+ivt+WNleaXtu+8jGluc3RhbmNlc+iusOW9lea1geeoi+WQjeensOOAgea1geeoi+WIhuexu+WQjeensCAjMTMxM1xyXG5cdGluc19vYmouZmxvd19uYW1lID0gZmxvdy5uYW1lXHJcblx0aWYgZm9ybS5jYXRlZ29yeVxyXG5cdFx0Y2F0ZWdvcnkgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldENhdGVnb3J5KGZvcm0uY2F0ZWdvcnkpXHJcblx0XHRpZiBjYXRlZ29yeVxyXG5cdFx0XHRpbnNfb2JqLmNhdGVnb3J5X25hbWUgPSBjYXRlZ29yeS5uYW1lXHJcblx0XHRcdGluc19vYmouY2F0ZWdvcnkgPSBjYXRlZ29yeS5faWRcclxuXHJcblx0bmV3X2luc19pZCA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmluc2VydChpbnNfb2JqKVxyXG5cclxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvKGluc19vYmoucmVjb3JkX2lkc1swXSwgbmV3X2luc19pZCwgc3BhY2VfaWQpXHJcblxyXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvKHJlbGF0ZWRUYWJsZXNJbmZvLCBuZXdfaW5zX2lkLCBzcGFjZV9pZClcclxuXHJcblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZUF0dGFjaChpbnNfb2JqLnJlY29yZF9pZHNbMF0sIHNwYWNlX2lkLCBpbnNfb2JqLl9pZCwgYXBwcl9vYmouX2lkKVxyXG5cclxuXHRyZXR1cm4gbmV3X2luc19pZFxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVZhbHVlcyA9IChyZWNvcmRJZHMsIGZsb3dJZCwgc3BhY2VJZCwgZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbykgLT5cclxuXHRmaWVsZENvZGVzID0gW11cclxuXHRfLmVhY2ggZmllbGRzLCAoZikgLT5cclxuXHRcdGlmIGYudHlwZSA9PSAnc2VjdGlvbidcclxuXHRcdFx0Xy5lYWNoIGYuZmllbGRzLCAoZmYpIC0+XHJcblx0XHRcdFx0ZmllbGRDb2Rlcy5wdXNoIGZmLmNvZGVcclxuXHRcdGVsc2VcclxuXHRcdFx0ZmllbGRDb2Rlcy5wdXNoIGYuY29kZVxyXG5cclxuXHR2YWx1ZXMgPSB7fVxyXG5cdG9iamVjdE5hbWUgPSByZWNvcmRJZHMub1xyXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdE5hbWUsIHNwYWNlSWQpXHJcblx0cmVjb3JkSWQgPSByZWNvcmRJZHMuaWRzWzBdXHJcblx0b3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XHJcblx0XHRvYmplY3RfbmFtZTogb2JqZWN0TmFtZSxcclxuXHRcdGZsb3dfaWQ6IGZsb3dJZFxyXG5cdH0pXHJcblx0cmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLmZpbmRPbmUocmVjb3JkSWQpXHJcblx0ZmxvdyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignZmxvd3MnKS5maW5kT25lKGZsb3dJZCwgeyBmaWVsZHM6IHsgZm9ybTogMSB9IH0pXHJcblx0aWYgb3cgYW5kIHJlY29yZFxyXG5cdFx0Zm9ybSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImZvcm1zXCIpLmZpbmRPbmUoZmxvdy5mb3JtKVxyXG5cdFx0Zm9ybUZpZWxkcyA9IGZvcm0uY3VycmVudC5maWVsZHMgfHwgW11cclxuXHRcdHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3ROYW1lLCBzcGFjZUlkKVxyXG5cdFx0cmVsYXRlZE9iamVjdHNLZXlzID0gXy5wbHVjayhyZWxhdGVkT2JqZWN0cywgJ29iamVjdF9uYW1lJylcclxuXHRcdGZvcm1UYWJsZUZpZWxkcyA9IF8uZmlsdGVyIGZvcm1GaWVsZHMsIChmb3JtRmllbGQpIC0+XHJcblx0XHRcdHJldHVybiBmb3JtRmllbGQudHlwZSA9PSAndGFibGUnXHJcblx0XHRmb3JtVGFibGVGaWVsZHNDb2RlID0gXy5wbHVjayhmb3JtVGFibGVGaWVsZHMsICdjb2RlJylcclxuXHJcblx0XHRnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gIChrZXkpIC0+XHJcblx0XHRcdHJldHVybiBfLmZpbmQgcmVsYXRlZE9iamVjdHNLZXlzLCAgKHJlbGF0ZWRPYmplY3RzS2V5KSAtPlxyXG5cdFx0XHRcdHJldHVybiBrZXkuc3RhcnRzV2l0aChyZWxhdGVkT2JqZWN0c0tleSArICcuJylcclxuXHJcblx0XHRnZXRGb3JtVGFibGVGaWVsZENvZGUgPSAoa2V5KSAtPlxyXG5cdFx0XHRyZXR1cm4gXy5maW5kIGZvcm1UYWJsZUZpZWxkc0NvZGUsICAoZm9ybVRhYmxlRmllbGRDb2RlKSAtPlxyXG5cdFx0XHRcdHJldHVybiBrZXkuc3RhcnRzV2l0aChmb3JtVGFibGVGaWVsZENvZGUgKyAnLicpXHJcblxyXG5cdFx0Z2V0Rm9ybVRhYmxlRmllbGQgPSAoa2V5KSAtPlxyXG5cdFx0XHRyZXR1cm4gXy5maW5kIGZvcm1UYWJsZUZpZWxkcywgIChmKSAtPlxyXG5cdFx0XHRcdHJldHVybiBmLmNvZGUgPT0ga2V5XHJcblxyXG5cdFx0Z2V0Rm9ybUZpZWxkID0gKGtleSkgLT5cclxuXHRcdFx0cmV0dXJuIF8uZmluZCBmb3JtRmllbGRzLCAgKGYpIC0+XHJcblx0XHRcdFx0cmV0dXJuIGYuY29kZSA9PSBrZXlcclxuXHJcblx0XHRnZXRGb3JtVGFibGVTdWJGaWVsZCA9ICh0YWJsZUZpZWxkLCBzdWJGaWVsZENvZGUpIC0+XHJcblx0XHRcdHJldHVybiBfLmZpbmQgdGFibGVGaWVsZC5maWVsZHMsICAoZikgLT5cclxuXHRcdFx0XHRyZXR1cm4gZi5jb2RlID09IHN1YkZpZWxkQ29kZVxyXG5cclxuXHRcdGdldEZpZWxkT2RhdGFWYWx1ZSA9IChvYmpOYW1lLCBpZCkgLT5cclxuXHRcdFx0b2JqID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iak5hbWUpXHJcblx0XHRcdGlmICFvYmpcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0aWYgXy5pc1N0cmluZyBpZFxyXG5cdFx0XHRcdF9yZWNvcmQgPSBvYmouZmluZE9uZShpZClcclxuXHRcdFx0XHRpZiBfcmVjb3JkXHJcblx0XHRcdFx0XHRfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmQubmFtZVxyXG5cdFx0XHRcdFx0cmV0dXJuIF9yZWNvcmRcclxuXHRcdFx0ZWxzZSBpZiBfLmlzQXJyYXkgaWRcclxuXHRcdFx0XHRfcmVjb3JkcyA9IFtdXHJcblx0XHRcdFx0b2JqLmZpbmQoeyBfaWQ6IHsgJGluOiBpZCB9IH0pLmZvckVhY2ggKF9yZWNvcmQpIC0+XHJcblx0XHRcdFx0XHRfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmQubmFtZVxyXG5cdFx0XHRcdFx0X3JlY29yZHMucHVzaCBfcmVjb3JkXHJcblxyXG5cdFx0XHRcdGlmICFfLmlzRW1wdHkgX3JlY29yZHNcclxuXHRcdFx0XHRcdHJldHVybiBfcmVjb3Jkc1xyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRnZXRTZWxlY3RVc2VyVmFsdWUgPSAodXNlcklkLCBzcGFjZUlkKSAtPlxyXG5cdFx0XHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9KVxyXG5cdFx0XHRzdS5pZCA9IHVzZXJJZFxyXG5cdFx0XHRyZXR1cm4gc3VcclxuXHJcblx0XHRnZXRTZWxlY3RVc2VyVmFsdWVzID0gKHVzZXJJZHMsIHNwYWNlSWQpIC0+XHJcblx0XHRcdHN1cyA9IFtdXHJcblx0XHRcdGlmIF8uaXNBcnJheSB1c2VySWRzXHJcblx0XHRcdFx0Xy5lYWNoIHVzZXJJZHMsICh1c2VySWQpIC0+XHJcblx0XHRcdFx0XHRzdSA9IGdldFNlbGVjdFVzZXJWYWx1ZSh1c2VySWQsIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRpZiBzdVxyXG5cdFx0XHRcdFx0XHRzdXMucHVzaChzdSlcclxuXHRcdFx0cmV0dXJuIHN1c1xyXG5cclxuXHRcdGdldFNlbGVjdE9yZ1ZhbHVlID0gKG9yZ0lkLCBzcGFjZUlkKSAtPlxyXG5cdFx0XHRvcmcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kT25lKG9yZ0lkLCB7IGZpZWxkczogeyBfaWQ6IDEsIG5hbWU6IDEsIGZ1bGxuYW1lOiAxIH0gfSlcclxuXHRcdFx0b3JnLmlkID0gb3JnSWRcclxuXHRcdFx0cmV0dXJuIG9yZ1xyXG5cclxuXHRcdGdldFNlbGVjdE9yZ1ZhbHVlcyA9IChvcmdJZHMsIHNwYWNlSWQpIC0+XHJcblx0XHRcdG9yZ3MgPSBbXVxyXG5cdFx0XHRpZiBfLmlzQXJyYXkgb3JnSWRzXHJcblx0XHRcdFx0Xy5lYWNoIG9yZ0lkcywgKG9yZ0lkKSAtPlxyXG5cdFx0XHRcdFx0b3JnID0gZ2V0U2VsZWN0T3JnVmFsdWUob3JnSWQsIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRpZiBvcmdcclxuXHRcdFx0XHRcdFx0b3Jncy5wdXNoKG9yZylcclxuXHRcdFx0cmV0dXJuIG9yZ3NcclxuXHJcblx0XHR0YWJsZUZpZWxkQ29kZXMgPSBbXVxyXG5cdFx0dGFibGVGaWVsZE1hcCA9IFtdXHJcblx0XHR0YWJsZVRvUmVsYXRlZE1hcCA9IHt9XHJcblxyXG5cdFx0b3cuZmllbGRfbWFwPy5mb3JFYWNoIChmbSkgLT5cclxuXHRcdFx0b2JqZWN0X2ZpZWxkID0gZm0ub2JqZWN0X2ZpZWxkXHJcblx0XHRcdHdvcmtmbG93X2ZpZWxkID0gZm0ud29ya2Zsb3dfZmllbGRcclxuXHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkQ29kZSA9IGdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUob2JqZWN0X2ZpZWxkKVxyXG5cdFx0XHRmb3JtVGFibGVGaWVsZENvZGUgPSBnZXRGb3JtVGFibGVGaWVsZENvZGUod29ya2Zsb3dfZmllbGQpXHJcblx0XHRcdG9iakZpZWxkID0gb2JqZWN0LmZpZWxkc1tvYmplY3RfZmllbGRdXHJcblx0XHRcdGZvcm1GaWVsZCA9IGdldEZvcm1GaWVsZCh3b3JrZmxvd19maWVsZClcclxuXHRcdFx0IyDlpITnkIblrZDooajlrZfmrrVcclxuXHRcdFx0aWYgcmVsYXRlZE9iamVjdEZpZWxkQ29kZVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXVxyXG5cdFx0XHRcdG9UYWJsZUZpZWxkQ29kZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzFdXHJcblx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBLZXkgPSBvVGFibGVDb2RlXHJcblx0XHRcdFx0aWYgIXRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVxyXG5cdFx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldID0ge31cclxuXHJcblx0XHRcdFx0aWYgZm9ybVRhYmxlRmllbGRDb2RlXHJcblx0XHRcdFx0XHR3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVswXVxyXG5cdFx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldWydfRlJPTV9UQUJMRV9DT0RFJ10gPSB3VGFibGVDb2RlXHJcblxyXG5cdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVtvVGFibGVGaWVsZENvZGVdID0gd29ya2Zsb3dfZmllbGRcclxuXHRcdFx0IyDliKTmlq3mmK/lkKbmmK/ooajmoLzlrZfmrrVcclxuXHRcdFx0ZWxzZSBpZiB3b3JrZmxvd19maWVsZC5pbmRleE9mKCcuJC4nKSA+IDAgYW5kIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA+IDBcclxuXHRcdFx0XHR3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4kLicpWzBdXHJcblx0XHRcdFx0b1RhYmxlQ29kZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLiQuJylbMF1cclxuXHRcdFx0XHRpZiByZWNvcmQuaGFzT3duUHJvcGVydHkob1RhYmxlQ29kZSkgYW5kIF8uaXNBcnJheShyZWNvcmRbb1RhYmxlQ29kZV0pXHJcblx0XHRcdFx0XHR0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XHJcblx0XHRcdFx0XHRcdHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXHJcblx0XHRcdFx0XHRcdG9iamVjdF90YWJsZV9maWVsZF9jb2RlOiBvVGFibGVDb2RlXHJcblx0XHRcdFx0XHR9KSlcclxuXHRcdFx0XHRcdHRhYmxlRmllbGRNYXAucHVzaChmbSlcclxuXHJcblx0XHRcdCMg5aSE55CGbG9va3Vw44CBbWFzdGVyX2RldGFpbOexu+Wei+Wtl+autVxyXG5cdFx0XHRlbHNlIGlmIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJykgPiAwIGFuZCBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPT0gLTFcclxuXHRcdFx0XHRvYmplY3RGaWVsZE5hbWUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXVxyXG5cdFx0XHRcdGxvb2t1cEZpZWxkTmFtZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzFdXHJcblx0XHRcdFx0aWYgb2JqZWN0XHJcblx0XHRcdFx0XHRvYmplY3RGaWVsZCA9IG9iamVjdC5maWVsZHNbb2JqZWN0RmllbGROYW1lXVxyXG5cdFx0XHRcdFx0aWYgb2JqZWN0RmllbGQgJiYgZm9ybUZpZWxkICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdFx0ZmllbGRzT2JqID0ge31cclxuXHRcdFx0XHRcdFx0ZmllbGRzT2JqW2xvb2t1cEZpZWxkTmFtZV0gPSAxXHJcblx0XHRcdFx0XHRcdGxvb2t1cE9iamVjdFJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpLmZpbmRPbmUocmVjb3JkW29iamVjdEZpZWxkTmFtZV0sIHsgZmllbGRzOiBmaWVsZHNPYmogfSlcclxuXHRcdFx0XHRcdFx0b2JqZWN0RmllbGRPYmplY3ROYW1lID0gb2JqZWN0RmllbGQucmVmZXJlbmNlX3RvXHJcblx0XHRcdFx0XHRcdGxvb2t1cEZpZWxkT2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0RmllbGRPYmplY3ROYW1lLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHRvYmplY3RMb29rdXBGaWVsZCA9IGxvb2t1cEZpZWxkT2JqLmZpZWxkc1tsb29rdXBGaWVsZE5hbWVdXHJcblx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IGxvb2t1cE9iamVjdFJlY29yZFtsb29rdXBGaWVsZE5hbWVdXHJcblx0XHRcdFx0XHRcdGlmIG9iamVjdExvb2t1cEZpZWxkICYmIGZvcm1GaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RMb29rdXBGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb09iamVjdE5hbWUgPSBvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG9cclxuXHRcdFx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWVcclxuXHRcdFx0XHRcdFx0XHRpZiBvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3RcclxuXHRcdFx0XHRcdFx0XHRcdG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmICFvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXHJcblx0XHRcdFx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IGxvb2t1cE9iamVjdFJlY29yZFtsb29rdXBGaWVsZE5hbWVdXHJcblxyXG5cdFx0XHQjIGxvb2t1cOOAgW1hc3Rlcl9kZXRhaWzlrZfmrrXlkIzmraXliLBvZGF0YeWtl+autVxyXG5cdFx0XHRlbHNlIGlmIGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iakZpZWxkLnJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRyZWZlcmVuY2VUb09iamVjdE5hbWUgPSBvYmpGaWVsZC5yZWZlcmVuY2VfdG9cclxuXHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSByZWNvcmRbb2JqRmllbGQubmFtZV1cclxuXHRcdFx0XHRvZGF0YUZpZWxkVmFsdWVcclxuXHRcdFx0XHRpZiBvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3RcclxuXHRcdFx0XHRcdG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcclxuXHRcdFx0XHRlbHNlIGlmICFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXHJcblx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZVxyXG5cdFx0XHRlbHNlIGlmIGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iakZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKG9iakZpZWxkLnJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSByZWNvcmRbb2JqRmllbGQubmFtZV1cclxuXHRcdFx0XHRpZiAhXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcclxuXHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWVcclxuXHRcdFx0XHRcdGlmIGZvcm1GaWVsZC50eXBlID09ICd1c2VyJ1xyXG5cdFx0XHRcdFx0XHRpZiBvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3RcclxuXHRcdFx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3RcclxuXHRcdFx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcclxuXHRcdFx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkLnR5cGUgPT0gJ2dyb3VwJ1xyXG5cdFx0XHRcdFx0XHRpZiBvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3RcclxuXHRcdFx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcclxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAhb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRpZiBzZWxlY3RGaWVsZFZhbHVlXHJcblx0XHRcdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBzZWxlY3RGaWVsZFZhbHVlXHJcblx0XHRcdGVsc2UgaWYgcmVjb3JkLmhhc093blByb3BlcnR5KG9iamVjdF9maWVsZClcclxuXHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gcmVjb3JkW29iamVjdF9maWVsZF1cclxuXHJcblx0XHQjIOihqOagvOWtl+autVxyXG5cdFx0Xy51bmlxKHRhYmxlRmllbGRDb2RlcykuZm9yRWFjaCAodGZjKSAtPlxyXG5cdFx0XHRjID0gSlNPTi5wYXJzZSh0ZmMpXHJcblx0XHRcdHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdID0gW11cclxuXHRcdFx0cmVjb3JkW2Mub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGVdLmZvckVhY2ggKHRyKSAtPlxyXG5cdFx0XHRcdG5ld1RyID0ge31cclxuXHRcdFx0XHRfLmVhY2ggdHIsICh2LCBrKSAtPlxyXG5cdFx0XHRcdFx0dGFibGVGaWVsZE1hcC5mb3JFYWNoICh0Zm0pIC0+XHJcblx0XHRcdFx0XHRcdGlmIHRmbS5vYmplY3RfZmllbGQgaXMgKGMub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGUgKyAnLiQuJyArIGspXHJcblx0XHRcdFx0XHRcdFx0d1RkQ29kZSA9IHRmbS53b3JrZmxvd19maWVsZC5zcGxpdCgnLiQuJylbMV1cclxuXHRcdFx0XHRcdFx0XHRuZXdUclt3VGRDb2RlXSA9IHZcclxuXHRcdFx0XHRpZiBub3QgXy5pc0VtcHR5KG5ld1RyKVxyXG5cdFx0XHRcdFx0dmFsdWVzW2Mud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZV0ucHVzaChuZXdUcilcclxuXHJcblx0XHQjIOWQjOatpeWtkOihqOaVsOaNruiHs+ihqOWNleihqOagvFxyXG5cdFx0Xy5lYWNoIHRhYmxlVG9SZWxhdGVkTWFwLCAgKG1hcCwga2V5KSAtPlxyXG5cdFx0XHR0YWJsZUNvZGUgPSBtYXAuX0ZST01fVEFCTEVfQ09ERVxyXG5cdFx0XHRmb3JtVGFibGVGaWVsZCA9IGdldEZvcm1UYWJsZUZpZWxkKHRhYmxlQ29kZSlcclxuXHRcdFx0aWYgIXRhYmxlQ29kZVxyXG5cdFx0XHRcdGNvbnNvbGUud2FybigndGFibGVUb1JlbGF0ZWQ6IFsnICsga2V5ICsgJ10gbWlzc2luZyBjb3JyZXNwb25kaW5nIHRhYmxlLicpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZWxhdGVkT2JqZWN0TmFtZSA9IGtleVxyXG5cdFx0XHRcdHRhYmxlVmFsdWVzID0gW11cclxuXHRcdFx0XHRyZWxhdGVkVGFibGVJdGVtcyA9IFtdXHJcblx0XHRcdFx0cmVsYXRlZE9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKVxyXG5cdFx0XHRcdHJlbGF0ZWRGaWVsZCA9IF8uZmluZCByZWxhdGVkT2JqZWN0LmZpZWxkcywgKGYpIC0+XHJcblx0XHRcdFx0XHRyZXR1cm4gWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKGYudHlwZSkgJiYgZi5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0TmFtZVxyXG5cclxuXHRcdFx0XHRyZWxhdGVkRmllbGROYW1lID0gcmVsYXRlZEZpZWxkLm5hbWVcclxuXHJcblx0XHRcdFx0c2VsZWN0b3IgPSB7fVxyXG5cdFx0XHRcdHNlbGVjdG9yW3JlbGF0ZWRGaWVsZE5hbWVdID0gcmVjb3JkSWRcclxuXHRcdFx0XHRyZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZClcclxuXHRcdFx0XHRyZWxhdGVkUmVjb3JkcyA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpXHJcblxyXG5cdFx0XHRcdHJlbGF0ZWRSZWNvcmRzLmZvckVhY2ggKHJyKSAtPlxyXG5cdFx0XHRcdFx0dGFibGVWYWx1ZUl0ZW0gPSB7fVxyXG5cdFx0XHRcdFx0Xy5lYWNoIG1hcCwgKHZhbHVlS2V5LCBmaWVsZEtleSkgLT5cclxuXHRcdFx0XHRcdFx0aWYgZmllbGRLZXkgIT0gJ19GUk9NX1RBQkxFX0NPREUnXHJcblx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlXHJcblx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkS2V5XHJcblx0XHRcdFx0XHRcdFx0aWYgdmFsdWVLZXkuc3RhcnRzV2l0aCh0YWJsZUNvZGUgKyAnLicpXHJcblx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXkgPSAodmFsdWVLZXkuc3BsaXQoXCIuXCIpWzFdKVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleSA9IHZhbHVlS2V5XHJcblx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkID0gZ2V0Rm9ybVRhYmxlU3ViRmllbGQoZm9ybVRhYmxlRmllbGQsIGZvcm1GaWVsZEtleSlcclxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0RmllbGQgPSByZWxhdGVkT2JqZWN0LmZpZWxkc1tmaWVsZEtleV1cclxuXHRcdFx0XHRcdFx0XHRpZiAhZm9ybUZpZWxkIHx8ICFyZWxhdGVkT2JqZWN0RmllbGRcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRcdFx0XHRcdGlmIGZvcm1GaWVsZC50eXBlID09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb09iamVjdE5hbWUgPSByZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvXHJcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV1cclxuXHRcdFx0XHRcdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3RcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3RcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgIV8uaXNFbXB0eShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGZvcm1GaWVsZC50eXBlID09ICd1c2VyJ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3RcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZvcm1GaWVsZC50eXBlID09ICdncm91cCdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gcnJbZmllbGRLZXldXHJcblx0XHRcdFx0XHRcdFx0dGFibGVWYWx1ZUl0ZW1bZm9ybUZpZWxkS2V5XSA9IHRhYmxlRmllbGRWYWx1ZVxyXG5cdFx0XHRcdFx0aWYgIV8uaXNFbXB0eSh0YWJsZVZhbHVlSXRlbSlcclxuXHRcdFx0XHRcdFx0dGFibGVWYWx1ZUl0ZW0uX2lkID0gcnIuX2lkXHJcblx0XHRcdFx0XHRcdHRhYmxlVmFsdWVzLnB1c2godGFibGVWYWx1ZUl0ZW0pXHJcblx0XHRcdFx0XHRcdHJlbGF0ZWRUYWJsZUl0ZW1zLnB1c2goeyBfdGFibGU6IHsgX2lkOiByci5faWQsIF9jb2RlOiB0YWJsZUNvZGUgfSB9IClcclxuXHJcblx0XHRcdFx0dmFsdWVzW3RhYmxlQ29kZV0gPSB0YWJsZVZhbHVlc1xyXG5cdFx0XHRcdHJlbGF0ZWRUYWJsZXNJbmZvW3JlbGF0ZWRPYmplY3ROYW1lXSA9IHJlbGF0ZWRUYWJsZUl0ZW1zXHJcblxyXG5cdFx0IyDlpoLmnpzphY3nva7kuobohJrmnKzliJnmiafooYzohJrmnKxcclxuXHRcdGlmIG93LmZpZWxkX21hcF9zY3JpcHRcclxuXHRcdFx0Xy5leHRlbmQodmFsdWVzLCB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmV2YWxGaWVsZE1hcFNjcmlwdChvdy5maWVsZF9tYXBfc2NyaXB0LCBvYmplY3ROYW1lLCBzcGFjZUlkLCByZWNvcmRJZCkpXHJcblxyXG5cdCMg6L+H5ruk5o6JdmFsdWVz5Lit55qE6Z2e5rOVa2V5XHJcblx0ZmlsdGVyVmFsdWVzID0ge31cclxuXHRfLmVhY2ggXy5rZXlzKHZhbHVlcyksIChrKSAtPlxyXG5cdFx0aWYgZmllbGRDb2Rlcy5pbmNsdWRlcyhrKVxyXG5cdFx0XHRmaWx0ZXJWYWx1ZXNba10gPSB2YWx1ZXNba11cclxuXHJcblx0cmV0dXJuIGZpbHRlclZhbHVlc1xyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5ldmFsRmllbGRNYXBTY3JpcHQgPSAoZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgb2JqZWN0SWQpIC0+XHJcblx0cmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLmZpbmRPbmUob2JqZWN0SWQpXHJcblx0c2NyaXB0ID0gXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZWNvcmQpIHsgXCIgKyBmaWVsZF9tYXBfc2NyaXB0ICsgXCIgfVwiXHJcblx0ZnVuYyA9IF9ldmFsKHNjcmlwdCwgXCJmaWVsZF9tYXBfc2NyaXB0XCIpXHJcblx0dmFsdWVzID0gZnVuYyhyZWNvcmQpXHJcblx0aWYgXy5pc09iamVjdCB2YWx1ZXNcclxuXHRcdHJldHVybiB2YWx1ZXNcclxuXHRlbHNlXHJcblx0XHRjb25zb2xlLmVycm9yIFwiZXZhbEZpZWxkTWFwU2NyaXB0OiDohJrmnKzov5Tlm57lgLznsbvlnovkuI3mmK/lr7nosaFcIlxyXG5cdHJldHVybiB7fVxyXG5cclxuXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoID0gKHJlY29yZElkcywgc3BhY2VJZCwgaW5zSWQsIGFwcHJvdmVJZCkgLT5cclxuXHJcblx0Q3JlYXRvci5Db2xsZWN0aW9uc1snY21zX2ZpbGVzJ10uZmluZCh7XHJcblx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdHBhcmVudDogcmVjb3JkSWRzXHJcblx0fSkuZm9yRWFjaCAoY2YpIC0+XHJcblx0XHRfLmVhY2ggY2YudmVyc2lvbnMsICh2ZXJzaW9uSWQsIGlkeCkgLT5cclxuXHRcdFx0ZiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ10uZmluZE9uZSh2ZXJzaW9uSWQpXHJcblx0XHRcdG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpXHJcblxyXG5cdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEgZi5jcmVhdGVSZWFkU3RyZWFtKCdmaWxlcycpLCB7XHJcblx0XHRcdFx0XHR0eXBlOiBmLm9yaWdpbmFsLnR5cGVcclxuXHRcdFx0fSwgKGVycikgLT5cclxuXHRcdFx0XHRpZiAoZXJyKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnIuZXJyb3IsIGVyci5yZWFzb24pXHJcblxyXG5cdFx0XHRcdG5ld0ZpbGUubmFtZShmLm5hbWUoKSlcclxuXHRcdFx0XHRuZXdGaWxlLnNpemUoZi5zaXplKCkpXHJcblx0XHRcdFx0bWV0YWRhdGEgPSB7XHJcblx0XHRcdFx0XHRvd25lcjogZi5tZXRhZGF0YS5vd25lcixcclxuXHRcdFx0XHRcdG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcclxuXHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkLFxyXG5cdFx0XHRcdFx0aW5zdGFuY2U6IGluc0lkLFxyXG5cdFx0XHRcdFx0YXBwcm92ZTogYXBwcm92ZUlkXHJcblx0XHRcdFx0XHRwYXJlbnQ6IGNmLl9pZFxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgaWR4IGlzIDBcclxuXHRcdFx0XHRcdG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlXHJcblxyXG5cdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YVxyXG5cdFx0XHRcdGNmcy5pbnN0YW5jZXMuaW5zZXJ0KG5ld0ZpbGUpXHJcblxyXG5cdHJldHVyblxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlY29yZEluc3RhbmNlSW5mbyA9IChyZWNvcmRJZHMsIGluc0lkLCBzcGFjZUlkKSAtPlxyXG5cdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkudXBkYXRlKHJlY29yZElkcy5pZHNbMF0sIHtcclxuXHRcdCRwdXNoOiB7XHJcblx0XHRcdGluc3RhbmNlczoge1xyXG5cdFx0XHRcdCRlYWNoOiBbe1xyXG5cdFx0XHRcdFx0X2lkOiBpbnNJZCxcclxuXHRcdFx0XHRcdHN0YXRlOiAnZHJhZnQnXHJcblx0XHRcdFx0fV0sXHJcblx0XHRcdFx0JHBvc2l0aW9uOiAwXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHQkc2V0OiB7XHJcblx0XHRcdGxvY2tlZDogdHJ1ZVxyXG5cdFx0XHRpbnN0YW5jZV9zdGF0ZTogJ2RyYWZ0J1xyXG5cdFx0fVxyXG5cdH0pXHJcblxyXG5cdHJldHVyblxyXG5cclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvID0gKHJlbGF0ZWRUYWJsZXNJbmZvLCBpbnNJZCwgc3BhY2VJZCkgLT5cclxuXHRfLmVhY2ggcmVsYXRlZFRhYmxlc0luZm8sICh0YWJsZUl0ZW1zLCByZWxhdGVkT2JqZWN0TmFtZSkgLT5cclxuXHRcdHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKVxyXG5cdFx0Xy5lYWNoIHRhYmxlSXRlbXMsIChpdGVtKSAtPlxyXG5cdFx0XHRyZWxhdGVkQ29sbGVjdGlvbi51cGRhdGUoaXRlbS5fdGFibGUuX2lkLCB7XHJcblx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0aW5zdGFuY2VzOiBbe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IGluc0lkLFxyXG5cdFx0XHRcdFx0XHRzdGF0ZTogJ2RyYWZ0J1xyXG5cdFx0XHRcdFx0fV0sXHJcblx0XHRcdFx0XHRfdGFibGU6IGl0ZW0uX3RhYmxlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cclxuXHRyZXR1cm5cclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tJc0luQXBwcm92YWwgPSAocmVjb3JkSWRzLCBzcGFjZUlkKSAtPlxyXG5cdHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkuZmluZE9uZSh7XHJcblx0XHRfaWQ6IHJlY29yZElkcy5pZHNbMF0sIGluc3RhbmNlczogeyAkZXhpc3RzOiB0cnVlIH1cclxuXHR9LCB7IGZpZWxkczogeyBpbnN0YW5jZXM6IDEgfSB9KVxyXG5cclxuXHRpZiByZWNvcmQgYW5kIHJlY29yZC5pbnN0YW5jZXNbMF0uc3RhdGUgaXNudCAnY29tcGxldGVkJyBhbmQgQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZChyZWNvcmQuaW5zdGFuY2VzWzBdLl9pZCkuY291bnQoKSA+IDBcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5q2k6K6w5b2V5bey5Y+R6LW35rWB56iL5q2j5Zyo5a6h5om55Lit77yM5b6F5a6h5om557uT5p2f5pa55Y+v5Y+R6LW35LiL5LiA5qyh5a6h5om577yBXCIpXHJcblxyXG5cdHJldHVyblxyXG5cclxuIiwidmFyIF9ldmFsOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5fZXZhbCA9IHJlcXVpcmUoJ2V2YWwnKTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24gPSBmdW5jdGlvbihyZXEpIHtcbiAgdmFyIGF1dGhUb2tlbiwgaGFzaGVkVG9rZW4sIHF1ZXJ5LCB1c2VyLCB1c2VySWQ7XG4gIHF1ZXJ5ID0gcmVxLnF1ZXJ5O1xuICB1c2VySWQgPSBxdWVyeVtcIlgtVXNlci1JZFwiXTtcbiAgYXV0aFRva2VuID0gcXVlcnlbXCJYLUF1dGgtVG9rZW5cIl07XG4gIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgX2lkOiB1c2VySWQsXG4gICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgfSk7XG4gIGlmICghdXNlcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgcmV0dXJuIHVzZXI7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgdmFyIHNwYWNlO1xuICBzcGFjZSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpO1xuICBpZiAoIXNwYWNlKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJzcGFjZV9pZOacieivr+aIluatpHNwYWNl5bey57uP6KKr5Yig6ZmkXCIpO1xuICB9XG4gIHJldHVybiBzcGFjZTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyA9IGZ1bmN0aW9uKGZsb3dfaWQpIHtcbiAgdmFyIGZsb3c7XG4gIGZsb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZsb3dzLmZpbmRPbmUoZmxvd19pZCk7XG4gIGlmICghZmxvdykge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwiaWTmnInor6/miJbmraTmtYHnqIvlt7Lnu4/ooqvliKDpmaRcIik7XG4gIH1cbiAgcmV0dXJuIGZsb3c7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlciA9IGZ1bmN0aW9uKHNwYWNlX2lkLCB1c2VyX2lkKSB7XG4gIHZhciBzcGFjZV91c2VyO1xuICBzcGFjZV91c2VyID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdXNlcjogdXNlcl9pZFxuICB9KTtcbiAgaWYgKCFzcGFjZV91c2VyKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJ1c2VyX2lk5a+55bqU55qE55So5oi35LiN5bGe5LqO5b2T5YmNc3BhY2VcIik7XG4gIH1cbiAgcmV0dXJuIHNwYWNlX3VzZXI7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8gPSBmdW5jdGlvbihzcGFjZV91c2VyKSB7XG4gIHZhciBpbmZvLCBvcmc7XG4gIGluZm8gPSBuZXcgT2JqZWN0O1xuICBpbmZvLm9yZ2FuaXphdGlvbiA9IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uO1xuICBvcmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9yZ2FuaXphdGlvbnMuZmluZE9uZShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbiwge1xuICAgIGZpZWxkczoge1xuICAgICAgbmFtZTogMSxcbiAgICAgIGZ1bGxuYW1lOiAxXG4gICAgfVxuICB9KTtcbiAgaW5mby5vcmdhbml6YXRpb25fbmFtZSA9IG9yZy5uYW1lO1xuICBpbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IG9yZy5mdWxsbmFtZTtcbiAgcmV0dXJuIGluZm87XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd0VuYWJsZWQgPSBmdW5jdGlvbihmbG93KSB7XG4gIGlmIChmbG93LnN0YXRlICE9PSBcImVuYWJsZWRcIikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5pyq5ZCv55SoLOaTjeS9nOWksei0pVwiKTtcbiAgfVxufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQgPSBmdW5jdGlvbihmbG93LCBzcGFjZV9pZCkge1xuICBpZiAoZmxvdy5zcGFjZSAhPT0gc3BhY2VfaWQpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+WSjOW3peS9nOWMuklE5LiN5Yy56YWNXCIpO1xuICB9XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZvcm0gPSBmdW5jdGlvbihmb3JtX2lkKSB7XG4gIHZhciBmb3JtO1xuICBmb3JtID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5mb3Jtcy5maW5kT25lKGZvcm1faWQpO1xuICBpZiAoIWZvcm0pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn6KGo5Y2VSUTmnInor6/miJbmraTooajljZXlt7Lnu4/ooqvliKDpmaQnKTtcbiAgfVxuICByZXR1cm4gZm9ybTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Q2F0ZWdvcnkgPSBmdW5jdGlvbihjYXRlZ29yeV9pZCkge1xuICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5jYXRlZ29yaWVzLmZpbmRPbmUoY2F0ZWdvcnlfaWQpO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UgPSBmdW5jdGlvbihpbnN0YW5jZV9mcm9tX2NsaWVudCwgdXNlcl9pbmZvKSB7XG4gIHZhciBhcHByX29iaiwgYXBwcm92ZV9mcm9tX2NsaWVudCwgY2F0ZWdvcnksIGZsb3csIGZsb3dfaWQsIGZvcm0sIGluc19vYmosIG5ld19pbnNfaWQsIG5vdywgcGVybWlzc2lvbnMsIHJlbGF0ZWRUYWJsZXNJbmZvLCBzcGFjZSwgc3BhY2VfaWQsIHNwYWNlX3VzZXIsIHNwYWNlX3VzZXJfb3JnX2luZm8sIHN0YXJ0X3N0ZXAsIHRyYWNlX2Zyb21fY2xpZW50LCB0cmFjZV9vYmosIHVzZXJfaWQ7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdLCBTdHJpbmcpO1xuICBjaGVjayhpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdLCBTdHJpbmcpO1xuICBjaGVjayhpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl0sIFN0cmluZyk7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXSwgW1xuICAgIHtcbiAgICAgIG86IFN0cmluZyxcbiAgICAgIGlkczogW1N0cmluZ11cbiAgICB9XG4gIF0pO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVswXSwgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSk7XG4gIHNwYWNlX2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXTtcbiAgZmxvd19pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXTtcbiAgdXNlcl9pZCA9IHVzZXJfaW5mby5faWQ7XG4gIHRyYWNlX2Zyb21fY2xpZW50ID0gbnVsbDtcbiAgYXBwcm92ZV9mcm9tX2NsaWVudCA9IG51bGw7XG4gIGlmIChpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXSAmJiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXSkge1xuICAgIHRyYWNlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF07XG4gICAgaWYgKHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl0gJiYgdHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXVswXSkge1xuICAgICAgYXBwcm92ZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdW1wiYXBwcm92ZXNcIl1bMF07XG4gICAgfVxuICB9XG4gIHNwYWNlID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZShzcGFjZV9pZCk7XG4gIGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZCk7XG4gIHNwYWNlX3VzZXIgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlcihzcGFjZV9pZCwgdXNlcl9pZCk7XG4gIHNwYWNlX3VzZXJfb3JnX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8oc3BhY2VfdXNlcik7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZChmbG93KTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQoZmxvdywgc3BhY2VfaWQpO1xuICBmb3JtID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtKGZsb3cuZm9ybSk7XG4gIHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dfaWQsIHVzZXJfaWQpO1xuICBpZiAoIXBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRkXCIpKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLlvZPliY3nlKjmiLfmsqHmnInmraTmtYHnqIvnmoTmlrDlu7rmnYPpmZBcIik7XG4gIH1cbiAgbm93ID0gbmV3IERhdGU7XG4gIGluc19vYmogPSB7fTtcbiAgaW5zX29iai5faWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5fbWFrZU5ld0lEKCk7XG4gIGluc19vYmouc3BhY2UgPSBzcGFjZV9pZDtcbiAgaW5zX29iai5mbG93ID0gZmxvd19pZDtcbiAgaW5zX29iai5mbG93X3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuX2lkO1xuICBpbnNfb2JqLmZvcm0gPSBmbG93LmZvcm07XG4gIGluc19vYmouZm9ybV92ZXJzaW9uID0gZmxvdy5jdXJyZW50LmZvcm1fdmVyc2lvbjtcbiAgaW5zX29iai5uYW1lID0gZmxvdy5uYW1lO1xuICBpbnNfb2JqLnN1Ym1pdHRlciA9IHVzZXJfaWQ7XG4gIGluc19vYmouc3VibWl0dGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIDogdXNlcl9pZDtcbiAgaW5zX29iai5hcHBsaWNhbnRfbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIDogdXNlcl9pbmZvLm5hbWU7XG4gIGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbiA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSA6IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uO1xuICBpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gOiBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9uYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gOiBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnRfY29tcGFueSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdIDogc3BhY2VfdXNlci5jb21wYW55X2lkO1xuICBpbnNfb2JqLnN0YXRlID0gJ2RyYWZ0JztcbiAgaW5zX29iai5jb2RlID0gJyc7XG4gIGluc19vYmouaXNfYXJjaGl2ZWQgPSBmYWxzZTtcbiAgaW5zX29iai5pc19kZWxldGVkID0gZmFsc2U7XG4gIGluc19vYmouY3JlYXRlZCA9IG5vdztcbiAgaW5zX29iai5jcmVhdGVkX2J5ID0gdXNlcl9pZDtcbiAgaW5zX29iai5tb2RpZmllZCA9IG5vdztcbiAgaW5zX29iai5tb2RpZmllZF9ieSA9IHVzZXJfaWQ7XG4gIGluc19vYmoudmFsdWVzID0gbmV3IE9iamVjdDtcbiAgaW5zX29iai5yZWNvcmRfaWRzID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdO1xuICBpZiAoc3BhY2VfdXNlci5jb21wYW55X2lkKSB7XG4gICAgaW5zX29iai5jb21wYW55X2lkID0gc3BhY2VfdXNlci5jb21wYW55X2lkO1xuICB9XG4gIHRyYWNlX29iaiA9IHt9O1xuICB0cmFjZV9vYmouX2lkID0gbmV3IE1vbmdvLk9iamVjdElEKCkuX3N0cjtcbiAgdHJhY2Vfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWQ7XG4gIHRyYWNlX29iai5pc19maW5pc2hlZCA9IGZhbHNlO1xuICBzdGFydF9zdGVwID0gXy5maW5kKGZsb3cuY3VycmVudC5zdGVwcywgZnVuY3Rpb24oc3RlcCkge1xuICAgIHJldHVybiBzdGVwLnN0ZXBfdHlwZSA9PT0gJ3N0YXJ0JztcbiAgfSk7XG4gIHRyYWNlX29iai5zdGVwID0gc3RhcnRfc3RlcC5faWQ7XG4gIHRyYWNlX29iai5uYW1lID0gc3RhcnRfc3RlcC5uYW1lO1xuICB0cmFjZV9vYmouc3RhcnRfZGF0ZSA9IG5vdztcbiAgYXBwcl9vYmogPSB7fTtcbiAgYXBwcl9vYmouX2lkID0gbmV3IE1vbmdvLk9iamVjdElEKCkuX3N0cjtcbiAgYXBwcl9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZDtcbiAgYXBwcl9vYmoudHJhY2UgPSB0cmFjZV9vYmouX2lkO1xuICBhcHByX29iai5pc19maW5pc2hlZCA9IGZhbHNlO1xuICBhcHByX29iai51c2VyID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA6IHVzZXJfaWQ7XG4gIGFwcHJfb2JqLnVzZXJfbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIDogdXNlcl9pbmZvLm5hbWU7XG4gIGFwcHJfb2JqLmhhbmRsZXIgPSB1c2VyX2lkO1xuICBhcHByX29iai5oYW5kbGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZTtcbiAgYXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbjtcbiAgYXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb25fbmFtZSA9IHNwYWNlX3VzZXJfb3JnX2luZm8ubmFtZTtcbiAgYXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLmZ1bGxuYW1lO1xuICBhcHByX29iai50eXBlID0gJ2RyYWZ0JztcbiAgYXBwcl9vYmouc3RhcnRfZGF0ZSA9IG5vdztcbiAgYXBwcl9vYmoucmVhZF9kYXRlID0gbm93O1xuICBhcHByX29iai5pc19yZWFkID0gdHJ1ZTtcbiAgYXBwcl9vYmouaXNfZXJyb3IgPSBmYWxzZTtcbiAgYXBwcl9vYmouZGVzY3JpcHRpb24gPSAnJztcbiAgcmVsYXRlZFRhYmxlc0luZm8gPSB7fTtcbiAgYXBwcl9vYmoudmFsdWVzID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVZhbHVlcyhpbnNfb2JqLnJlY29yZF9pZHNbMF0sIGZsb3dfaWQsIHNwYWNlX2lkLCBmb3JtLmN1cnJlbnQuZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbyk7XG4gIHRyYWNlX29iai5hcHByb3ZlcyA9IFthcHByX29ial07XG4gIGluc19vYmoudHJhY2VzID0gW3RyYWNlX29ial07XG4gIGluc19vYmouaW5ib3hfdXNlcnMgPSBpbnN0YW5jZV9mcm9tX2NsaWVudC5pbmJveF91c2VycyB8fCBbXTtcbiAgaW5zX29iai5jdXJyZW50X3N0ZXBfbmFtZSA9IHN0YXJ0X3N0ZXAubmFtZTtcbiAgaWYgKGZsb3cuYXV0b19yZW1pbmQgPT09IHRydWUpIHtcbiAgICBpbnNfb2JqLmF1dG9fcmVtaW5kID0gdHJ1ZTtcbiAgfVxuICBpbnNfb2JqLmZsb3dfbmFtZSA9IGZsb3cubmFtZTtcbiAgaWYgKGZvcm0uY2F0ZWdvcnkpIHtcbiAgICBjYXRlZ29yeSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Q2F0ZWdvcnkoZm9ybS5jYXRlZ29yeSk7XG4gICAgaWYgKGNhdGVnb3J5KSB7XG4gICAgICBpbnNfb2JqLmNhdGVnb3J5X25hbWUgPSBjYXRlZ29yeS5uYW1lO1xuICAgICAgaW5zX29iai5jYXRlZ29yeSA9IGNhdGVnb3J5Ll9pZDtcbiAgICB9XG4gIH1cbiAgbmV3X2luc19pZCA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmluc2VydChpbnNfb2JqKTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlY29yZEluc3RhbmNlSW5mbyhpbnNfb2JqLnJlY29yZF9pZHNbMF0sIG5ld19pbnNfaWQsIHNwYWNlX2lkKTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlbGF0ZWRSZWNvcmRJbnN0YW5jZUluZm8ocmVsYXRlZFRhYmxlc0luZm8sIG5ld19pbnNfaWQsIHNwYWNlX2lkKTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZUF0dGFjaChpbnNfb2JqLnJlY29yZF9pZHNbMF0sIHNwYWNlX2lkLCBpbnNfb2JqLl9pZCwgYXBwcl9vYmouX2lkKTtcbiAgcmV0dXJuIG5ld19pbnNfaWQ7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlVmFsdWVzID0gZnVuY3Rpb24ocmVjb3JkSWRzLCBmbG93SWQsIHNwYWNlSWQsIGZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pIHtcbiAgdmFyIGZpZWxkQ29kZXMsIGZpbHRlclZhbHVlcywgZmxvdywgZm9ybSwgZm9ybUZpZWxkcywgZm9ybVRhYmxlRmllbGRzLCBmb3JtVGFibGVGaWVsZHNDb2RlLCBnZXRGaWVsZE9kYXRhVmFsdWUsIGdldEZvcm1GaWVsZCwgZ2V0Rm9ybVRhYmxlRmllbGQsIGdldEZvcm1UYWJsZUZpZWxkQ29kZSwgZ2V0Rm9ybVRhYmxlU3ViRmllbGQsIGdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUsIGdldFNlbGVjdE9yZ1ZhbHVlLCBnZXRTZWxlY3RPcmdWYWx1ZXMsIGdldFNlbGVjdFVzZXJWYWx1ZSwgZ2V0U2VsZWN0VXNlclZhbHVlcywgb2JqZWN0LCBvYmplY3ROYW1lLCBvdywgcmVjb3JkLCByZWNvcmRJZCwgcmVmLCByZWxhdGVkT2JqZWN0cywgcmVsYXRlZE9iamVjdHNLZXlzLCB0YWJsZUZpZWxkQ29kZXMsIHRhYmxlRmllbGRNYXAsIHRhYmxlVG9SZWxhdGVkTWFwLCB2YWx1ZXM7XG4gIGZpZWxkQ29kZXMgPSBbXTtcbiAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgIGlmIChmLnR5cGUgPT09ICdzZWN0aW9uJykge1xuICAgICAgcmV0dXJuIF8uZWFjaChmLmZpZWxkcywgZnVuY3Rpb24oZmYpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkQ29kZXMucHVzaChmZi5jb2RlKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmllbGRDb2Rlcy5wdXNoKGYuY29kZSk7XG4gICAgfVxuICB9KTtcbiAgdmFsdWVzID0ge307XG4gIG9iamVjdE5hbWUgPSByZWNvcmRJZHMubztcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0TmFtZSwgc3BhY2VJZCk7XG4gIHJlY29yZElkID0gcmVjb3JkSWRzLmlkc1swXTtcbiAgb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXG4gICAgZmxvd19pZDogZmxvd0lkXG4gIH0pO1xuICByZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0TmFtZSwgc3BhY2VJZCkuZmluZE9uZShyZWNvcmRJZCk7XG4gIGZsb3cgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShmbG93SWQsIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGZvcm06IDFcbiAgICB9XG4gIH0pO1xuICBpZiAob3cgJiYgcmVjb3JkKSB7XG4gICAgZm9ybSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImZvcm1zXCIpLmZpbmRPbmUoZmxvdy5mb3JtKTtcbiAgICBmb3JtRmllbGRzID0gZm9ybS5jdXJyZW50LmZpZWxkcyB8fCBbXTtcbiAgICByZWxhdGVkT2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0TmFtZSwgc3BhY2VJZCk7XG4gICAgcmVsYXRlZE9iamVjdHNLZXlzID0gXy5wbHVjayhyZWxhdGVkT2JqZWN0cywgJ29iamVjdF9uYW1lJyk7XG4gICAgZm9ybVRhYmxlRmllbGRzID0gXy5maWx0ZXIoZm9ybUZpZWxkcywgZnVuY3Rpb24oZm9ybUZpZWxkKSB7XG4gICAgICByZXR1cm4gZm9ybUZpZWxkLnR5cGUgPT09ICd0YWJsZSc7XG4gICAgfSk7XG4gICAgZm9ybVRhYmxlRmllbGRzQ29kZSA9IF8ucGx1Y2soZm9ybVRhYmxlRmllbGRzLCAnY29kZScpO1xuICAgIGdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBfLmZpbmQocmVsYXRlZE9iamVjdHNLZXlzLCBmdW5jdGlvbihyZWxhdGVkT2JqZWN0c0tleSkge1xuICAgICAgICByZXR1cm4ga2V5LnN0YXJ0c1dpdGgocmVsYXRlZE9iamVjdHNLZXkgKyAnLicpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRGb3JtVGFibGVGaWVsZENvZGUgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBfLmZpbmQoZm9ybVRhYmxlRmllbGRzQ29kZSwgZnVuY3Rpb24oZm9ybVRhYmxlRmllbGRDb2RlKSB7XG4gICAgICAgIHJldHVybiBrZXkuc3RhcnRzV2l0aChmb3JtVGFibGVGaWVsZENvZGUgKyAnLicpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRGb3JtVGFibGVGaWVsZCA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIF8uZmluZChmb3JtVGFibGVGaWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgcmV0dXJuIGYuY29kZSA9PT0ga2V5O1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRGb3JtRmllbGQgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBfLmZpbmQoZm9ybUZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgICAgICByZXR1cm4gZi5jb2RlID09PSBrZXk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGdldEZvcm1UYWJsZVN1YkZpZWxkID0gZnVuY3Rpb24odGFibGVGaWVsZCwgc3ViRmllbGRDb2RlKSB7XG4gICAgICByZXR1cm4gXy5maW5kKHRhYmxlRmllbGQuZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgIHJldHVybiBmLmNvZGUgPT09IHN1YkZpZWxkQ29kZTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0RmllbGRPZGF0YVZhbHVlID0gZnVuY3Rpb24ob2JqTmFtZSwgaWQpIHtcbiAgICAgIHZhciBfcmVjb3JkLCBfcmVjb3Jkcywgb2JqO1xuICAgICAgb2JqID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iak5hbWUpO1xuICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKF8uaXNTdHJpbmcoaWQpKSB7XG4gICAgICAgIF9yZWNvcmQgPSBvYmouZmluZE9uZShpZCk7XG4gICAgICAgIGlmIChfcmVjb3JkKSB7XG4gICAgICAgICAgX3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkLm5hbWU7XG4gICAgICAgICAgcmV0dXJuIF9yZWNvcmQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoXy5pc0FycmF5KGlkKSkge1xuICAgICAgICBfcmVjb3JkcyA9IFtdO1xuICAgICAgICBvYmouZmluZCh7XG4gICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAkaW46IGlkXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKF9yZWNvcmQpIHtcbiAgICAgICAgICBfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmQubmFtZTtcbiAgICAgICAgICByZXR1cm4gX3JlY29yZHMucHVzaChfcmVjb3JkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghXy5pc0VtcHR5KF9yZWNvcmRzKSkge1xuICAgICAgICAgIHJldHVybiBfcmVjb3JkcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgZ2V0U2VsZWN0VXNlclZhbHVlID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gICAgICB2YXIgc3U7XG4gICAgICBzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgICBzdS5pZCA9IHVzZXJJZDtcbiAgICAgIHJldHVybiBzdTtcbiAgICB9O1xuICAgIGdldFNlbGVjdFVzZXJWYWx1ZXMgPSBmdW5jdGlvbih1c2VySWRzLCBzcGFjZUlkKSB7XG4gICAgICB2YXIgc3VzO1xuICAgICAgc3VzID0gW107XG4gICAgICBpZiAoXy5pc0FycmF5KHVzZXJJZHMpKSB7XG4gICAgICAgIF8uZWFjaCh1c2VySWRzLCBmdW5jdGlvbih1c2VySWQpIHtcbiAgICAgICAgICB2YXIgc3U7XG4gICAgICAgICAgc3UgPSBnZXRTZWxlY3RVc2VyVmFsdWUodXNlcklkLCBzcGFjZUlkKTtcbiAgICAgICAgICBpZiAoc3UpIHtcbiAgICAgICAgICAgIHJldHVybiBzdXMucHVzaChzdSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdXM7XG4gICAgfTtcbiAgICBnZXRTZWxlY3RPcmdWYWx1ZSA9IGZ1bmN0aW9uKG9yZ0lkLCBzcGFjZUlkKSB7XG4gICAgICB2YXIgb3JnO1xuICAgICAgb3JnID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZE9uZShvcmdJZCwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICBmdWxsbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG9yZy5pZCA9IG9yZ0lkO1xuICAgICAgcmV0dXJuIG9yZztcbiAgICB9O1xuICAgIGdldFNlbGVjdE9yZ1ZhbHVlcyA9IGZ1bmN0aW9uKG9yZ0lkcywgc3BhY2VJZCkge1xuICAgICAgdmFyIG9yZ3M7XG4gICAgICBvcmdzID0gW107XG4gICAgICBpZiAoXy5pc0FycmF5KG9yZ0lkcykpIHtcbiAgICAgICAgXy5lYWNoKG9yZ0lkcywgZnVuY3Rpb24ob3JnSWQpIHtcbiAgICAgICAgICB2YXIgb3JnO1xuICAgICAgICAgIG9yZyA9IGdldFNlbGVjdE9yZ1ZhbHVlKG9yZ0lkLCBzcGFjZUlkKTtcbiAgICAgICAgICBpZiAob3JnKSB7XG4gICAgICAgICAgICByZXR1cm4gb3Jncy5wdXNoKG9yZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcmdzO1xuICAgIH07XG4gICAgdGFibGVGaWVsZENvZGVzID0gW107XG4gICAgdGFibGVGaWVsZE1hcCA9IFtdO1xuICAgIHRhYmxlVG9SZWxhdGVkTWFwID0ge307XG4gICAgaWYgKChyZWYgPSBvdy5maWVsZF9tYXApICE9IG51bGwpIHtcbiAgICAgIHJlZi5mb3JFYWNoKGZ1bmN0aW9uKGZtKSB7XG4gICAgICAgIHZhciBmaWVsZHNPYmosIGZvcm1GaWVsZCwgZm9ybVRhYmxlRmllbGRDb2RlLCBsb29rdXBGaWVsZE5hbWUsIGxvb2t1cEZpZWxkT2JqLCBsb29rdXBPYmplY3RSZWNvcmQsIG9UYWJsZUNvZGUsIG9UYWJsZUZpZWxkQ29kZSwgb2JqRmllbGQsIG9iamVjdEZpZWxkLCBvYmplY3RGaWVsZE5hbWUsIG9iamVjdEZpZWxkT2JqZWN0TmFtZSwgb2JqZWN0TG9va3VwRmllbGQsIG9iamVjdF9maWVsZCwgb2RhdGFGaWVsZFZhbHVlLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVsYXRlZE9iamVjdEZpZWxkQ29kZSwgc2VsZWN0RmllbGRWYWx1ZSwgdGFibGVUb1JlbGF0ZWRNYXBLZXksIHdUYWJsZUNvZGUsIHdvcmtmbG93X2ZpZWxkO1xuICAgICAgICBvYmplY3RfZmllbGQgPSBmbS5vYmplY3RfZmllbGQ7XG4gICAgICAgIHdvcmtmbG93X2ZpZWxkID0gZm0ud29ya2Zsb3dfZmllbGQ7XG4gICAgICAgIHJlbGF0ZWRPYmplY3RGaWVsZENvZGUgPSBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlKG9iamVjdF9maWVsZCk7XG4gICAgICAgIGZvcm1UYWJsZUZpZWxkQ29kZSA9IGdldEZvcm1UYWJsZUZpZWxkQ29kZSh3b3JrZmxvd19maWVsZCk7XG4gICAgICAgIG9iakZpZWxkID0gb2JqZWN0LmZpZWxkc1tvYmplY3RfZmllbGRdO1xuICAgICAgICBmb3JtRmllbGQgPSBnZXRGb3JtRmllbGQod29ya2Zsb3dfZmllbGQpO1xuICAgICAgICBpZiAocmVsYXRlZE9iamVjdEZpZWxkQ29kZSkge1xuICAgICAgICAgIG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICBvVGFibGVGaWVsZENvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICB0YWJsZVRvUmVsYXRlZE1hcEtleSA9IG9UYWJsZUNvZGU7XG4gICAgICAgICAgaWYgKCF0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0pIHtcbiAgICAgICAgICAgIHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZm9ybVRhYmxlRmllbGRDb2RlKSB7XG4gICAgICAgICAgICB3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVsnX0ZST01fVEFCTEVfQ09ERSddID0gd1RhYmxlQ29kZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVtvVGFibGVGaWVsZENvZGVdID0gd29ya2Zsb3dfZmllbGQ7XG4gICAgICAgIH0gZWxzZSBpZiAod29ya2Zsb3dfZmllbGQuaW5kZXhPZignLiQuJykgPiAwICYmIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA+IDApIHtcbiAgICAgICAgICB3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4kLicpWzBdO1xuICAgICAgICAgIG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzBdO1xuICAgICAgICAgIGlmIChyZWNvcmQuaGFzT3duUHJvcGVydHkob1RhYmxlQ29kZSkgJiYgXy5pc0FycmF5KHJlY29yZFtvVGFibGVDb2RlXSkpIHtcbiAgICAgICAgICAgIHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgd29ya2Zsb3dfdGFibGVfZmllbGRfY29kZTogd1RhYmxlQ29kZSxcbiAgICAgICAgICAgICAgb2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHJldHVybiB0YWJsZUZpZWxkTWFwLnB1c2goZm0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChvYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gMCAmJiBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPT09IC0xKSB7XG4gICAgICAgICAgb2JqZWN0RmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgbG9va3VwRmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgaWYgKG9iamVjdCkge1xuICAgICAgICAgICAgb2JqZWN0RmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdEZpZWxkTmFtZV07XG4gICAgICAgICAgICBpZiAob2JqZWN0RmllbGQgJiYgZm9ybUZpZWxkICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgZmllbGRzT2JqID0ge307XG4gICAgICAgICAgICAgIGZpZWxkc09ialtsb29rdXBGaWVsZE5hbWVdID0gMTtcbiAgICAgICAgICAgICAgbG9va3VwT2JqZWN0UmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZE9uZShyZWNvcmRbb2JqZWN0RmllbGROYW1lXSwge1xuICAgICAgICAgICAgICAgIGZpZWxkczogZmllbGRzT2JqXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBvYmplY3RGaWVsZE9iamVjdE5hbWUgPSBvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICAgIGxvb2t1cEZpZWxkT2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0RmllbGRPYmplY3ROYW1lLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgb2JqZWN0TG9va3VwRmllbGQgPSBsb29rdXBGaWVsZE9iai5maWVsZHNbbG9va3VwRmllbGROYW1lXTtcbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gbG9va3VwT2JqZWN0UmVjb3JkW2xvb2t1cEZpZWxkTmFtZV07XG4gICAgICAgICAgICAgIGlmIChvYmplY3RMb29rdXBGaWVsZCAmJiBmb3JtRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iamVjdExvb2t1cEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IGxvb2t1cE9iamVjdFJlY29yZFtsb29rdXBGaWVsZE5hbWVdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqRmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvYmpGaWVsZC5uYW1lXTtcbiAgICAgICAgICBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgICAgaWYgKG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiBbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdO1xuICAgICAgICAgIGlmICghXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWU7XG4gICAgICAgICAgICBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICBpZiAob2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgICAgICBpZiAob2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxlY3RGaWVsZFZhbHVlKSB7XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gc2VsZWN0RmllbGRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLmhhc093blByb3BlcnR5KG9iamVjdF9maWVsZCkpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHJlY29yZFtvYmplY3RfZmllbGRdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgXy51bmlxKHRhYmxlRmllbGRDb2RlcykuZm9yRWFjaChmdW5jdGlvbih0ZmMpIHtcbiAgICAgIHZhciBjO1xuICAgICAgYyA9IEpTT04ucGFyc2UodGZjKTtcbiAgICAgIHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdID0gW107XG4gICAgICByZXR1cm4gcmVjb3JkW2Mub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGVdLmZvckVhY2goZnVuY3Rpb24odHIpIHtcbiAgICAgICAgdmFyIG5ld1RyO1xuICAgICAgICBuZXdUciA9IHt9O1xuICAgICAgICBfLmVhY2godHIsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgICByZXR1cm4gdGFibGVGaWVsZE1hcC5mb3JFYWNoKGZ1bmN0aW9uKHRmbSkge1xuICAgICAgICAgICAgdmFyIHdUZENvZGU7XG4gICAgICAgICAgICBpZiAodGZtLm9iamVjdF9maWVsZCA9PT0gKGMub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGUgKyAnLiQuJyArIGspKSB7XG4gICAgICAgICAgICAgIHdUZENvZGUgPSB0Zm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4kLicpWzFdO1xuICAgICAgICAgICAgICByZXR1cm4gbmV3VHJbd1RkQ29kZV0gPSB2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFfLmlzRW1wdHkobmV3VHIpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdLnB1c2gobmV3VHIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBfLmVhY2godGFibGVUb1JlbGF0ZWRNYXAsIGZ1bmN0aW9uKG1hcCwga2V5KSB7XG4gICAgICB2YXIgZm9ybVRhYmxlRmllbGQsIHJlbGF0ZWRDb2xsZWN0aW9uLCByZWxhdGVkRmllbGQsIHJlbGF0ZWRGaWVsZE5hbWUsIHJlbGF0ZWRPYmplY3QsIHJlbGF0ZWRPYmplY3ROYW1lLCByZWxhdGVkUmVjb3JkcywgcmVsYXRlZFRhYmxlSXRlbXMsIHNlbGVjdG9yLCB0YWJsZUNvZGUsIHRhYmxlVmFsdWVzO1xuICAgICAgdGFibGVDb2RlID0gbWFwLl9GUk9NX1RBQkxFX0NPREU7XG4gICAgICBmb3JtVGFibGVGaWVsZCA9IGdldEZvcm1UYWJsZUZpZWxkKHRhYmxlQ29kZSk7XG4gICAgICBpZiAoIXRhYmxlQ29kZSkge1xuICAgICAgICByZXR1cm4gY29uc29sZS53YXJuKCd0YWJsZVRvUmVsYXRlZDogWycgKyBrZXkgKyAnXSBtaXNzaW5nIGNvcnJlc3BvbmRpbmcgdGFibGUuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWxhdGVkT2JqZWN0TmFtZSA9IGtleTtcbiAgICAgICAgdGFibGVWYWx1ZXMgPSBbXTtcbiAgICAgICAgcmVsYXRlZFRhYmxlSXRlbXMgPSBbXTtcbiAgICAgICAgcmVsYXRlZE9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKTtcbiAgICAgICAgcmVsYXRlZEZpZWxkID0gXy5maW5kKHJlbGF0ZWRPYmplY3QuZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgcmV0dXJuIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhmLnR5cGUpICYmIGYucmVmZXJlbmNlX3RvID09PSBvYmplY3ROYW1lO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVsYXRlZEZpZWxkTmFtZSA9IHJlbGF0ZWRGaWVsZC5uYW1lO1xuICAgICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgICBzZWxlY3RvcltyZWxhdGVkRmllbGROYW1lXSA9IHJlY29yZElkO1xuICAgICAgICByZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCk7XG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZChzZWxlY3Rvcik7XG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2goZnVuY3Rpb24ocnIpIHtcbiAgICAgICAgICB2YXIgdGFibGVWYWx1ZUl0ZW07XG4gICAgICAgICAgdGFibGVWYWx1ZUl0ZW0gPSB7fTtcbiAgICAgICAgICBfLmVhY2gobWFwLCBmdW5jdGlvbih2YWx1ZUtleSwgZmllbGRLZXkpIHtcbiAgICAgICAgICAgIHZhciBmb3JtRmllbGQsIGZvcm1GaWVsZEtleSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlbGF0ZWRPYmplY3RGaWVsZCwgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKGZpZWxkS2V5ICE9PSAnX0ZST01fVEFCTEVfQ09ERScpIHtcbiAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICBmb3JtRmllbGRLZXk7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZUtleS5zdGFydHNXaXRoKHRhYmxlQ29kZSArICcuJykpIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSAodmFsdWVLZXkuc3BsaXQoXCIuXCIpWzFdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSB2YWx1ZUtleTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBmb3JtRmllbGQgPSBnZXRGb3JtVGFibGVTdWJGaWVsZChmb3JtVGFibGVGaWVsZCwgZm9ybUZpZWxkS2V5KTtcbiAgICAgICAgICAgICAgcmVsYXRlZE9iamVjdEZpZWxkID0gcmVsYXRlZE9iamVjdC5maWVsZHNbZmllbGRLZXldO1xuICAgICAgICAgICAgICBpZiAoIWZvcm1GaWVsZCB8fCAhcmVsYXRlZE9iamVjdEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb09iamVjdE5hbWUgPSByZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XTtcbiAgICAgICAgICAgICAgICBpZiAocmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV07XG4gICAgICAgICAgICAgICAgaWYgKCFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgaWYgKGZvcm1GaWVsZC50eXBlID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdncm91cCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gdGFibGVWYWx1ZUl0ZW1bZm9ybUZpZWxkS2V5XSA9IHRhYmxlRmllbGRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoIV8uaXNFbXB0eSh0YWJsZVZhbHVlSXRlbSkpIHtcbiAgICAgICAgICAgIHRhYmxlVmFsdWVJdGVtLl9pZCA9IHJyLl9pZDtcbiAgICAgICAgICAgIHRhYmxlVmFsdWVzLnB1c2godGFibGVWYWx1ZUl0ZW0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRUYWJsZUl0ZW1zLnB1c2goe1xuICAgICAgICAgICAgICBfdGFibGU6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IHJyLl9pZCxcbiAgICAgICAgICAgICAgICBfY29kZTogdGFibGVDb2RlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHZhbHVlc1t0YWJsZUNvZGVdID0gdGFibGVWYWx1ZXM7XG4gICAgICAgIHJldHVybiByZWxhdGVkVGFibGVzSW5mb1tyZWxhdGVkT2JqZWN0TmFtZV0gPSByZWxhdGVkVGFibGVJdGVtcztcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAob3cuZmllbGRfbWFwX3NjcmlwdCkge1xuICAgICAgXy5leHRlbmQodmFsdWVzLCB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmV2YWxGaWVsZE1hcFNjcmlwdChvdy5maWVsZF9tYXBfc2NyaXB0LCBvYmplY3ROYW1lLCBzcGFjZUlkLCByZWNvcmRJZCkpO1xuICAgIH1cbiAgfVxuICBmaWx0ZXJWYWx1ZXMgPSB7fTtcbiAgXy5lYWNoKF8ua2V5cyh2YWx1ZXMpLCBmdW5jdGlvbihrKSB7XG4gICAgaWYgKGZpZWxkQ29kZXMuaW5jbHVkZXMoaykpIHtcbiAgICAgIHJldHVybiBmaWx0ZXJWYWx1ZXNba10gPSB2YWx1ZXNba107XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZpbHRlclZhbHVlcztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0ID0gZnVuY3Rpb24oZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgb2JqZWN0SWQpIHtcbiAgdmFyIGZ1bmMsIHJlY29yZCwgc2NyaXB0LCB2YWx1ZXM7XG4gIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKG9iamVjdElkKTtcbiAgc2NyaXB0ID0gXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZWNvcmQpIHsgXCIgKyBmaWVsZF9tYXBfc2NyaXB0ICsgXCIgfVwiO1xuICBmdW5jID0gX2V2YWwoc2NyaXB0LCBcImZpZWxkX21hcF9zY3JpcHRcIik7XG4gIHZhbHVlcyA9IGZ1bmMocmVjb3JkKTtcbiAgaWYgKF8uaXNPYmplY3QodmFsdWVzKSkge1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcihcImV2YWxGaWVsZE1hcFNjcmlwdDog6ISa5pys6L+U5Zue5YC857G75Z6L5LiN5piv5a+56LGhXCIpO1xuICB9XG4gIHJldHVybiB7fTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2ggPSBmdW5jdGlvbihyZWNvcmRJZHMsIHNwYWNlSWQsIGluc0lkLCBhcHByb3ZlSWQpIHtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1snY21zX2ZpbGVzJ10uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgcGFyZW50OiByZWNvcmRJZHNcbiAgfSkuZm9yRWFjaChmdW5jdGlvbihjZikge1xuICAgIHJldHVybiBfLmVhY2goY2YudmVyc2lvbnMsIGZ1bmN0aW9uKHZlcnNpb25JZCwgaWR4KSB7XG4gICAgICB2YXIgZiwgbmV3RmlsZTtcbiAgICAgIGYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zWydjZnMuZmlsZXMuZmlsZXJlY29yZCddLmZpbmRPbmUodmVyc2lvbklkKTtcbiAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgICAgcmV0dXJuIG5ld0ZpbGUuYXR0YWNoRGF0YShmLmNyZWF0ZVJlYWRTdHJlYW0oJ2ZpbGVzJyksIHtcbiAgICAgICAgdHlwZTogZi5vcmlnaW5hbC50eXBlXG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdmFyIG1ldGFkYXRhO1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnIuZXJyb3IsIGVyci5yZWFzb24pO1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUubmFtZShmLm5hbWUoKSk7XG4gICAgICAgIG5ld0ZpbGUuc2l6ZShmLnNpemUoKSk7XG4gICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgIG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxuICAgICAgICAgIG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICBpbnN0YW5jZTogaW5zSWQsXG4gICAgICAgICAgYXBwcm92ZTogYXBwcm92ZUlkLFxuICAgICAgICAgIHBhcmVudDogY2YuX2lkXG4gICAgICAgIH07XG4gICAgICAgIGlmIChpZHggPT09IDApIHtcbiAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgIHJldHVybiBjZnMuaW5zdGFuY2VzLmluc2VydChuZXdGaWxlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8gPSBmdW5jdGlvbihyZWNvcmRJZHMsIGluc0lkLCBzcGFjZUlkKSB7XG4gIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkudXBkYXRlKHJlY29yZElkcy5pZHNbMF0sIHtcbiAgICAkcHVzaDoge1xuICAgICAgaW5zdGFuY2VzOiB7XG4gICAgICAgICRlYWNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgX2lkOiBpbnNJZCxcbiAgICAgICAgICAgIHN0YXRlOiAnZHJhZnQnXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICAkcG9zaXRpb246IDBcbiAgICAgIH1cbiAgICB9LFxuICAgICRzZXQ6IHtcbiAgICAgIGxvY2tlZDogdHJ1ZSxcbiAgICAgIGluc3RhbmNlX3N0YXRlOiAnZHJhZnQnXG4gICAgfVxuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvID0gZnVuY3Rpb24ocmVsYXRlZFRhYmxlc0luZm8sIGluc0lkLCBzcGFjZUlkKSB7XG4gIF8uZWFjaChyZWxhdGVkVGFibGVzSW5mbywgZnVuY3Rpb24odGFibGVJdGVtcywgcmVsYXRlZE9iamVjdE5hbWUpIHtcbiAgICB2YXIgcmVsYXRlZENvbGxlY3Rpb247XG4gICAgcmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpO1xuICAgIHJldHVybiBfLmVhY2godGFibGVJdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIHJlbGF0ZWRDb2xsZWN0aW9uLnVwZGF0ZShpdGVtLl90YWJsZS5faWQsIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGluc3RhbmNlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBfaWQ6IGluc0lkLFxuICAgICAgICAgICAgICBzdGF0ZTogJ2RyYWZ0J1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAgX3RhYmxlOiBpdGVtLl90YWJsZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsID0gZnVuY3Rpb24ocmVjb3JkSWRzLCBzcGFjZUlkKSB7XG4gIHZhciByZWNvcmQ7XG4gIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkuZmluZE9uZSh7XG4gICAgX2lkOiByZWNvcmRJZHMuaWRzWzBdLFxuICAgIGluc3RhbmNlczoge1xuICAgICAgJGV4aXN0czogdHJ1ZVxuICAgIH1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgaW5zdGFuY2VzOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKHJlY29yZCAmJiByZWNvcmQuaW5zdGFuY2VzWzBdLnN0YXRlICE9PSAnY29tcGxldGVkJyAmJiBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kKHJlY29yZC5pbnN0YW5jZXNbMF0uX2lkKS5jb3VudCgpID4gMCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5q2k6K6w5b2V5bey5Y+R6LW35rWB56iL5q2j5Zyo5a6h5om55Lit77yM5b6F5a6h5om557uT5p2f5pa55Y+v5Y+R6LW35LiL5LiA5qyh5a6h5om577yBXCIpO1xuICB9XG59O1xuIiwiSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL3MzL1wiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cclxuXHRKc29uUm91dGVzLnBhcnNlRmlsZXMgcmVxLCByZXMsICgpLT5cclxuXHRcdGNvbGxlY3Rpb24gPSBjZnMuZmlsZXNcclxuXHRcdGZpbGVDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRPYmplY3QoXCJjbXNfZmlsZXNcIikuZGJcclxuXHJcblx0XHRpZiByZXEuZmlsZXMgYW5kIHJlcS5maWxlc1swXVxyXG5cclxuXHRcdFx0bmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XHJcblx0XHRcdG5ld0ZpbGUuYXR0YWNoRGF0YSByZXEuZmlsZXNbMF0uZGF0YSwge3R5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZX0sIChlcnIpIC0+XHJcblx0XHRcdFx0ZmlsZW5hbWUgPSByZXEuZmlsZXNbMF0uZmlsZW5hbWVcclxuXHRcdFx0XHRleHRlbnRpb24gPSBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpXHJcblx0XHRcdFx0aWYgW1wiaW1hZ2UuanBnXCIsIFwiaW1hZ2UuZ2lmXCIsIFwiaW1hZ2UuanBlZ1wiLCBcImltYWdlLnBuZ1wiXS5pbmNsdWRlcyhmaWxlbmFtZS50b0xvd2VyQ2FzZSgpKVxyXG5cdFx0XHRcdFx0ZmlsZW5hbWUgPSBcImltYWdlLVwiICsgbW9tZW50KG5ldyBEYXRlKCkpLmZvcm1hdCgnWVlZWU1NRERISG1tc3MnKSArIFwiLlwiICsgZXh0ZW50aW9uXHJcblxyXG5cdFx0XHRcdGJvZHkgPSByZXEuYm9keVxyXG5cdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0aWYgYm9keSAmJiAoYm9keVsndXBsb2FkX2Zyb20nXSBpcyBcIklFXCIgb3IgYm9keVsndXBsb2FkX2Zyb20nXSBpcyBcIm5vZGVcIilcclxuXHRcdFx0XHRcdFx0ZmlsZW5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQoZmlsZW5hbWUpXHJcblx0XHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihmaWxlbmFtZSlcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZVxyXG5cdFx0XHRcdFx0ZmlsZW5hbWUgPSBmaWxlbmFtZS5yZXBsYWNlKC8lL2csIFwiLVwiKVxyXG5cclxuXHRcdFx0XHRuZXdGaWxlLm5hbWUoZmlsZW5hbWUpXHJcblxyXG5cdFx0XHRcdGlmIGJvZHkgJiYgYm9keVsnb3duZXInXSAmJiBib2R5WydzcGFjZSddICYmIGJvZHlbJ3JlY29yZF9pZCddICAmJiBib2R5WydvYmplY3RfbmFtZSddXHJcblx0XHRcdFx0XHRwYXJlbnQgPSBib2R5WydwYXJlbnQnXVxyXG5cdFx0XHRcdFx0b3duZXIgPSBib2R5Wydvd25lciddXHJcblx0XHRcdFx0XHRvd25lcl9uYW1lID0gYm9keVsnb3duZXJfbmFtZSddXHJcblx0XHRcdFx0XHRzcGFjZSA9IGJvZHlbJ3NwYWNlJ11cclxuXHRcdFx0XHRcdHJlY29yZF9pZCA9IGJvZHlbJ3JlY29yZF9pZCddXHJcblx0XHRcdFx0XHRvYmplY3RfbmFtZSA9IGJvZHlbJ29iamVjdF9uYW1lJ11cclxuXHRcdFx0XHRcdHBhcmVudCA9IGJvZHlbJ3BhcmVudCddXHJcblx0XHRcdFx0XHRtZXRhZGF0YSA9IHtvd25lcjpvd25lciwgb3duZXJfbmFtZTpvd25lcl9uYW1lLCBzcGFjZTpzcGFjZSwgcmVjb3JkX2lkOnJlY29yZF9pZCwgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lfVxyXG5cdFx0XHRcdFx0aWYgcGFyZW50XHJcblx0XHRcdFx0XHRcdG1ldGFkYXRhLnBhcmVudCA9IHBhcmVudFxyXG5cdFx0XHRcdFx0bmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhXHJcblx0XHRcdFx0XHRmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxyXG5cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxyXG5cclxuXHJcblx0XHRcdFx0c2l6ZSA9IGZpbGVPYmoub3JpZ2luYWwuc2l6ZVxyXG5cdFx0XHRcdGlmICFzaXplXHJcblx0XHRcdFx0XHRzaXplID0gMTAyNFxyXG5cdFx0XHRcdGlmIHBhcmVudFxyXG5cdFx0XHRcdFx0ZmlsZUNvbGxlY3Rpb24udXBkYXRlKHtfaWQ6cGFyZW50fSx7XHJcblx0XHRcdFx0XHRcdCRzZXQ6XHJcblx0XHRcdFx0XHRcdFx0ZXh0ZW50aW9uOiBleHRlbnRpb25cclxuXHRcdFx0XHRcdFx0XHRzaXplOiBzaXplXHJcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWQ6IChuZXcgRGF0ZSgpKVxyXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiBvd25lclxyXG5cdFx0XHRcdFx0XHQkcHVzaDpcclxuXHRcdFx0XHRcdFx0XHR2ZXJzaW9uczpcclxuXHRcdFx0XHRcdFx0XHRcdCRlYWNoOiBbIGZpbGVPYmouX2lkIF1cclxuXHRcdFx0XHRcdFx0XHRcdCRwb3NpdGlvbjogMFxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRuZXdGaWxlT2JqSWQgPSBmaWxlQ29sbGVjdGlvbi5kaXJlY3QuaW5zZXJ0IHtcclxuXHRcdFx0XHRcdFx0bmFtZTogZmlsZW5hbWVcclxuXHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246ICcnXHJcblx0XHRcdFx0XHRcdGV4dGVudGlvbjogZXh0ZW50aW9uXHJcblx0XHRcdFx0XHRcdHNpemU6IHNpemVcclxuXHRcdFx0XHRcdFx0dmVyc2lvbnM6IFtmaWxlT2JqLl9pZF1cclxuXHRcdFx0XHRcdFx0cGFyZW50OiB7bzpvYmplY3RfbmFtZSxpZHM6W3JlY29yZF9pZF19XHJcblx0XHRcdFx0XHRcdG93bmVyOiBvd25lclxyXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VcclxuXHRcdFx0XHRcdFx0Y3JlYXRlZDogKG5ldyBEYXRlKCkpXHJcblx0XHRcdFx0XHRcdGNyZWF0ZWRfYnk6IG93bmVyXHJcblx0XHRcdFx0XHRcdG1vZGlmaWVkOiAobmV3IERhdGUoKSlcclxuXHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IG93bmVyXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRmaWxlT2JqLnVwZGF0ZSh7JHNldDogeydtZXRhZGF0YS5wYXJlbnQnIDogbmV3RmlsZU9iaklkfX0pXHJcblxyXG5cdFx0XHRcdHJlc3AgPVxyXG5cdFx0XHRcdFx0dmVyc2lvbl9pZDogZmlsZU9iai5faWQsXHJcblx0XHRcdFx0XHRzaXplOiBzaXplXHJcblxyXG5cdFx0XHRcdHJlcy5zZXRIZWFkZXIoXCJ4LWFtei12ZXJzaW9uLWlkXCIsZmlsZU9iai5faWQpO1xyXG5cdFx0XHRcdHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXMuc3RhdHVzQ29kZSA9IDUwMDtcclxuXHRcdFx0cmVzLmVuZCgpO1xyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL3MzLzpjb2xsZWN0aW9uXCIsICAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0dHJ5XHJcblx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIHBlcm1pc3Npb25cIilcclxuXHJcblx0XHRjb2xsZWN0aW9uTmFtZSA9IHJlcS5wYXJhbXMuY29sbGVjdGlvblxyXG5cclxuXHRcdEpzb25Sb3V0ZXMucGFyc2VGaWxlcyByZXEsIHJlcywgKCktPlxyXG5cdFx0XHRjb2xsZWN0aW9uID0gY2ZzW2NvbGxlY3Rpb25OYW1lXVxyXG5cclxuXHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBDb2xsZWN0aW9uXCIpXHJcblxyXG5cdFx0XHRpZiByZXEuZmlsZXMgYW5kIHJlcS5maWxlc1swXVxyXG5cclxuXHRcdFx0XHRuZXdGaWxlID0gbmV3IEZTLkZpbGUoKVxyXG5cdFx0XHRcdG5ld0ZpbGUubmFtZShyZXEuZmlsZXNbMF0uZmlsZW5hbWUpXHJcblxyXG5cdFx0XHRcdGlmIHJlcS5ib2R5XHJcblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gcmVxLmJvZHlcclxuXHJcblx0XHRcdFx0bmV3RmlsZS5vd25lciA9IHVzZXJJZFxyXG5cdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEub3duZXIgPSB1c2VySWRcclxuXHJcblx0XHRcdFx0bmV3RmlsZS5hdHRhY2hEYXRhIHJlcS5maWxlc1swXS5kYXRhLCB7dHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlfVxyXG5cclxuXHRcdFx0XHRjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXHJcblxyXG5cdFx0XHRcdHJlc3VsdERhdGEgPSBjb2xsZWN0aW9uLmZpbGVzLmZpbmRPbmUobmV3RmlsZS5faWQpXHJcblx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRcdFx0ZGF0YTogcmVzdWx0RGF0YVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gRmlsZVwiKVxyXG5cclxuXHRcdHJldHVyblxyXG5cdGNhdGNoIGVcclxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRjb2RlOiBlLmVycm9yIHx8IDUwMFxyXG5cdFx0XHRkYXRhOiB7ZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2V9XHJcblx0XHR9XHJcblxyXG5cclxuXHJcbmdldFF1ZXJ5U3RyaW5nID0gKGFjY2Vzc0tleUlkLCBzZWNyZXRBY2Nlc3NLZXksIHF1ZXJ5LCBtZXRob2QpIC0+XHJcblx0Y29uc29sZS5sb2cgXCItLS0tdXVmbG93TWFuYWdlci5nZXRRdWVyeVN0cmluZy0tLS1cIlxyXG5cdEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKVxyXG5cdGRhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKVxyXG5cclxuXHRxdWVyeS5Gb3JtYXQgPSBcImpzb25cIlxyXG5cdHF1ZXJ5LlZlcnNpb24gPSBcIjIwMTctMDMtMjFcIlxyXG5cdHF1ZXJ5LkFjY2Vzc0tleUlkID0gYWNjZXNzS2V5SWRcclxuXHRxdWVyeS5TaWduYXR1cmVNZXRob2QgPSBcIkhNQUMtU0hBMVwiXHJcblx0cXVlcnkuVGltZXN0YW1wID0gQUxZLnV0aWwuZGF0ZS5pc284NjAxKGRhdGUpXHJcblx0cXVlcnkuU2lnbmF0dXJlVmVyc2lvbiA9IFwiMS4wXCJcclxuXHRxdWVyeS5TaWduYXR1cmVOb25jZSA9IFN0cmluZyhkYXRlLmdldFRpbWUoKSlcclxuXHJcblx0cXVlcnlLZXlzID0gT2JqZWN0LmtleXMocXVlcnkpXHJcblx0cXVlcnlLZXlzLnNvcnQoKVxyXG5cclxuXHRjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcgPSBcIlwiXHJcblx0cXVlcnlLZXlzLmZvckVhY2ggKG5hbWUpIC0+XHJcblx0XHRjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcgKz0gXCImXCIgKyBuYW1lICsgXCI9XCIgKyBBTFkudXRpbC5wb3BFc2NhcGUocXVlcnlbbmFtZV0pXHJcblxyXG5cdHN0cmluZ1RvU2lnbiA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpICsgJyYlMkYmJyArIEFMWS51dGlsLnBvcEVzY2FwZShjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcuc3Vic3RyKDEpKVxyXG5cclxuXHRxdWVyeS5TaWduYXR1cmUgPSBBTFkudXRpbC5jcnlwdG8uaG1hYyhzZWNyZXRBY2Nlc3NLZXkgKyAnJicsIHN0cmluZ1RvU2lnbiwgJ2Jhc2U2NCcsICdzaGExJylcclxuXHJcblx0cXVlcnlTdHIgPSBBTFkudXRpbC5xdWVyeVBhcmFtc1RvU3RyaW5nKHF1ZXJ5KVxyXG5cdGNvbnNvbGUubG9nIHF1ZXJ5U3RyXHJcblx0cmV0dXJuIHF1ZXJ5U3RyXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvczMvdm9kL3VwbG9hZFwiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0dXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKVxyXG5cdFx0aWYgIXVzZXJJZFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBwZXJtaXNzaW9uXCIpXHJcblxyXG5cdFx0Y29sbGVjdGlvbk5hbWUgPSBcInZpZGVvc1wiXHJcblxyXG5cdFx0QUxZID0gcmVxdWlyZSgnYWxpeXVuLXNkaycpXHJcblxyXG5cdFx0SnNvblJvdXRlcy5wYXJzZUZpbGVzIHJlcSwgcmVzLCAoKS0+XHJcblx0XHRcdGNvbGxlY3Rpb24gPSBjZnNbY29sbGVjdGlvbk5hbWVdXHJcblxyXG5cdFx0XHRpZiBub3QgY29sbGVjdGlvblxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIENvbGxlY3Rpb25cIilcclxuXHJcblx0XHRcdGlmIHJlcS5maWxlcyBhbmQgcmVxLmZpbGVzWzBdXHJcblxyXG5cdFx0XHRcdGlmIGNvbGxlY3Rpb25OYW1lIGlzICd2aWRlb3MnIGFuZCBNZXRlb3Iuc2V0dGluZ3MucHVibGljLmNmcz8uc3RvcmUgaXMgXCJPU1NcIlxyXG5cdFx0XHRcdFx0YWNjZXNzS2V5SWQgPSBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bj8uYWNjZXNzS2V5SWRcclxuXHRcdFx0XHRcdHNlY3JldEFjY2Vzc0tleSA9IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuPy5zZWNyZXRBY2Nlc3NLZXlcclxuXHJcblx0XHRcdFx0XHRkYXRlID0gQUxZLnV0aWwuZGF0ZS5nZXREYXRlKClcclxuXHJcblx0XHRcdFx0XHRxdWVyeSA9IHtcclxuXHRcdFx0XHRcdFx0QWN0aW9uOiBcIkNyZWF0ZVVwbG9hZFZpZGVvXCJcclxuXHRcdFx0XHRcdFx0VGl0bGU6IHJlcS5maWxlc1swXS5maWxlbmFtZVxyXG5cdFx0XHRcdFx0XHRGaWxlTmFtZTogcmVxLmZpbGVzWzBdLmZpbGVuYW1lXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dXJsID0gXCJodHRwOi8vdm9kLmNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS8/XCIgKyBnZXRRdWVyeVN0cmluZyhhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBxdWVyeSwgJ0dFVCcpXHJcblxyXG5cdFx0XHRcdFx0ciA9IEhUVFAuY2FsbCAnR0VUJywgdXJsXHJcblxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgclxyXG5cclxuXHRcdFx0XHRcdGlmIHIuZGF0YT8uVmlkZW9JZFxyXG5cdFx0XHRcdFx0XHR2aWRlb0lkID0gci5kYXRhLlZpZGVvSWRcclxuXHRcdFx0XHRcdFx0dXBsb2FkQWRkcmVzcyA9IEpTT04ucGFyc2UobmV3IEJ1ZmZlcihyLmRhdGEuVXBsb2FkQWRkcmVzcywgJ2Jhc2U2NCcpLnRvU3RyaW5nKCkpXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nIHVwbG9hZEFkZHJlc3NcclxuXHRcdFx0XHRcdFx0dXBsb2FkQXV0aCA9IEpTT04ucGFyc2UobmV3IEJ1ZmZlcihyLmRhdGEuVXBsb2FkQXV0aCwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCkpXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nIHVwbG9hZEF1dGhcclxuXHJcblx0XHRcdFx0XHRcdG9zcyA9IG5ldyBBTFkuT1NTKHtcclxuXHRcdFx0XHRcdFx0XHRcImFjY2Vzc0tleUlkXCI6IHVwbG9hZEF1dGguQWNjZXNzS2V5SWQsXHJcblx0XHRcdFx0XHRcdFx0XCJzZWNyZXRBY2Nlc3NLZXlcIjogdXBsb2FkQXV0aC5BY2Nlc3NLZXlTZWNyZXQsXHJcblx0XHRcdFx0XHRcdFx0XCJlbmRwb2ludFwiOiB1cGxvYWRBZGRyZXNzLkVuZHBvaW50LFxyXG5cdFx0XHRcdFx0XHRcdFwiYXBpVmVyc2lvblwiOiAnMjAxMy0xMC0xNScsXHJcblx0XHRcdFx0XHRcdFx0XCJzZWN1cml0eVRva2VuXCI6IHVwbG9hZEF1dGguU2VjdXJpdHlUb2tlblxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRcdFx0b3NzLnB1dE9iamVjdCB7XHJcblx0XHRcdFx0XHRcdFx0QnVja2V0OiB1cGxvYWRBZGRyZXNzLkJ1Y2tldCxcclxuXHRcdFx0XHRcdFx0XHRLZXk6IHVwbG9hZEFkZHJlc3MuRmlsZU5hbWUsXHJcblx0XHRcdFx0XHRcdFx0Qm9keTogcmVxLmZpbGVzWzBdLmRhdGEsXHJcblx0XHRcdFx0XHRcdFx0QWNjZXNzQ29udHJvbEFsbG93T3JpZ2luOiAnJyxcclxuXHRcdFx0XHRcdFx0XHRDb250ZW50VHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlLFxyXG5cdFx0XHRcdFx0XHRcdENhY2hlQ29udHJvbDogJ25vLWNhY2hlJyxcclxuXHRcdFx0XHRcdFx0XHRDb250ZW50RGlzcG9zaXRpb246ICcnLFxyXG5cdFx0XHRcdFx0XHRcdENvbnRlbnRFbmNvZGluZzogJ3V0Zi04JyxcclxuXHRcdFx0XHRcdFx0XHRTZXJ2ZXJTaWRlRW5jcnlwdGlvbjogJ0FFUzI1NicsXHJcblx0XHRcdFx0XHRcdFx0RXhwaXJlczogbnVsbFxyXG5cdFx0XHRcdFx0XHR9LCBNZXRlb3IuYmluZEVudmlyb25tZW50IChlcnIsIGRhdGEpIC0+XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIGVyclxyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ2Vycm9yOicsIGVycilcclxuXHRcdFx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlcnIubWVzc2FnZSlcclxuXHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ3N1Y2Nlc3M6JywgZGF0YSlcclxuXHJcblx0XHRcdFx0XHRcdFx0bmV3RGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpXHJcblxyXG5cdFx0XHRcdFx0XHRcdGdldFBsYXlJbmZvUXVlcnkgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRBY3Rpb246ICdHZXRQbGF5SW5mbydcclxuXHRcdFx0XHRcdFx0XHRcdFZpZGVvSWQ6IHZpZGVvSWRcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGdldFBsYXlJbmZvVXJsID0gXCJodHRwOi8vdm9kLmNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS8/XCIgKyBnZXRRdWVyeVN0cmluZyhhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBnZXRQbGF5SW5mb1F1ZXJ5LCAnR0VUJylcclxuXHJcblx0XHRcdFx0XHRcdFx0Z2V0UGxheUluZm9SZXN1bHQgPSBIVFRQLmNhbGwgJ0dFVCcsIGdldFBsYXlJbmZvVXJsXHJcblxyXG5cdFx0XHRcdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdFx0XHRcdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGE6IGdldFBsYXlJbmZvUmVzdWx0XHJcblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gRmlsZVwiKVxyXG5cclxuXHRcdHJldHVyblxyXG5cdGNhdGNoIGVcclxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRjb2RlOiBlLmVycm9yIHx8IDUwMFxyXG5cdFx0XHRkYXRhOiB7ZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2V9XHJcblx0XHR9IiwidmFyIGdldFF1ZXJ5U3RyaW5nO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvczMvXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHJldHVybiBKc29uUm91dGVzLnBhcnNlRmlsZXMocmVxLCByZXMsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb2xsZWN0aW9uLCBmaWxlQ29sbGVjdGlvbiwgbmV3RmlsZTtcbiAgICBjb2xsZWN0aW9uID0gY2ZzLmZpbGVzO1xuICAgIGZpbGVDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRPYmplY3QoXCJjbXNfZmlsZXNcIikuZGI7XG4gICAgaWYgKHJlcS5maWxlcyAmJiByZXEuZmlsZXNbMF0pIHtcbiAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgICAgcmV0dXJuIG5ld0ZpbGUuYXR0YWNoRGF0YShyZXEuZmlsZXNbMF0uZGF0YSwge1xuICAgICAgICB0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGVcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICB2YXIgYm9keSwgZSwgZXh0ZW50aW9uLCBmaWxlT2JqLCBmaWxlbmFtZSwgbWV0YWRhdGEsIG5ld0ZpbGVPYmpJZCwgb2JqZWN0X25hbWUsIG93bmVyLCBvd25lcl9uYW1lLCBwYXJlbnQsIHJlY29yZF9pZCwgcmVzcCwgc2l6ZSwgc3BhY2U7XG4gICAgICAgIGZpbGVuYW1lID0gcmVxLmZpbGVzWzBdLmZpbGVuYW1lO1xuICAgICAgICBleHRlbnRpb24gPSBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpO1xuICAgICAgICBpZiAoW1wiaW1hZ2UuanBnXCIsIFwiaW1hZ2UuZ2lmXCIsIFwiaW1hZ2UuanBlZ1wiLCBcImltYWdlLnBuZ1wiXS5pbmNsdWRlcyhmaWxlbmFtZS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgIGZpbGVuYW1lID0gXCJpbWFnZS1cIiArIG1vbWVudChuZXcgRGF0ZSgpKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzJykgKyBcIi5cIiArIGV4dGVudGlvbjtcbiAgICAgICAgfVxuICAgICAgICBib2R5ID0gcmVxLmJvZHk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKGJvZHkgJiYgKGJvZHlbJ3VwbG9hZF9mcm9tJ10gPT09IFwiSUVcIiB8fCBib2R5Wyd1cGxvYWRfZnJvbSddID09PSBcIm5vZGVcIikpIHtcbiAgICAgICAgICAgIGZpbGVuYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KGZpbGVuYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZmlsZW5hbWUpO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgZmlsZW5hbWUgPSBmaWxlbmFtZS5yZXBsYWNlKC8lL2csIFwiLVwiKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm5hbWUoZmlsZW5hbWUpO1xuICAgICAgICBpZiAoYm9keSAmJiBib2R5Wydvd25lciddICYmIGJvZHlbJ3NwYWNlJ10gJiYgYm9keVsncmVjb3JkX2lkJ10gJiYgYm9keVsnb2JqZWN0X25hbWUnXSkge1xuICAgICAgICAgIHBhcmVudCA9IGJvZHlbJ3BhcmVudCddO1xuICAgICAgICAgIG93bmVyID0gYm9keVsnb3duZXInXTtcbiAgICAgICAgICBvd25lcl9uYW1lID0gYm9keVsnb3duZXJfbmFtZSddO1xuICAgICAgICAgIHNwYWNlID0gYm9keVsnc3BhY2UnXTtcbiAgICAgICAgICByZWNvcmRfaWQgPSBib2R5WydyZWNvcmRfaWQnXTtcbiAgICAgICAgICBvYmplY3RfbmFtZSA9IGJvZHlbJ29iamVjdF9uYW1lJ107XG4gICAgICAgICAgcGFyZW50ID0gYm9keVsncGFyZW50J107XG4gICAgICAgICAgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICBvd25lcl9uYW1lOiBvd25lcl9uYW1lLFxuICAgICAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICAgICAgcmVjb3JkX2lkOiByZWNvcmRfaWQsXG4gICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgc2l6ZSA9IGZpbGVPYmoub3JpZ2luYWwuc2l6ZTtcbiAgICAgICAgaWYgKCFzaXplKSB7XG4gICAgICAgICAgc2l6ZSA9IDEwMjQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgIGZpbGVDb2xsZWN0aW9uLnVwZGF0ZSh7XG4gICAgICAgICAgICBfaWQ6IHBhcmVudFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgZXh0ZW50aW9uOiBleHRlbnRpb24sXG4gICAgICAgICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgICBtb2RpZmllZF9ieTogb3duZXJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICAgICB2ZXJzaW9uczoge1xuICAgICAgICAgICAgICAgICRlYWNoOiBbZmlsZU9iai5faWRdLFxuICAgICAgICAgICAgICAgICRwb3NpdGlvbjogMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3RmlsZU9iaklkID0gZmlsZUNvbGxlY3Rpb24uZGlyZWN0Lmluc2VydCh7XG4gICAgICAgICAgICBuYW1lOiBmaWxlbmFtZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgICAgIGV4dGVudGlvbjogZXh0ZW50aW9uLFxuICAgICAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgICAgIHZlcnNpb25zOiBbZmlsZU9iai5faWRdLFxuICAgICAgICAgICAgcGFyZW50OiB7XG4gICAgICAgICAgICAgIG86IG9iamVjdF9uYW1lLFxuICAgICAgICAgICAgICBpZHM6IFtyZWNvcmRfaWRdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIGNyZWF0ZWRfYnk6IG93bmVyLFxuICAgICAgICAgICAgbW9kaWZpZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBtb2RpZmllZF9ieTogb3duZXJcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBmaWxlT2JqLnVwZGF0ZSh7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICdtZXRhZGF0YS5wYXJlbnQnOiBuZXdGaWxlT2JqSWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXNwID0ge1xuICAgICAgICAgIHZlcnNpb25faWQ6IGZpbGVPYmouX2lkLFxuICAgICAgICAgIHNpemU6IHNpemVcbiAgICAgICAgfTtcbiAgICAgICAgcmVzLnNldEhlYWRlcihcIngtYW16LXZlcnNpb24taWRcIiwgZmlsZU9iai5faWQpO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgIHJldHVybiByZXMuZW5kKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvczMvOmNvbGxlY3Rpb25cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGNvbGxlY3Rpb25OYW1lLCBlLCB1c2VySWQ7XG4gIHRyeSB7XG4gICAgdXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKTtcbiAgICB9XG4gICAgY29sbGVjdGlvbk5hbWUgPSByZXEucGFyYW1zLmNvbGxlY3Rpb247XG4gICAgSnNvblJvdXRlcy5wYXJzZUZpbGVzKHJlcSwgcmVzLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uLCBuZXdGaWxlLCByZXN1bHREYXRhO1xuICAgICAgY29sbGVjdGlvbiA9IGNmc1tjb2xsZWN0aW9uTmFtZV07XG4gICAgICBpZiAoIWNvbGxlY3Rpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gQ29sbGVjdGlvblwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXEuZmlsZXMgJiYgcmVxLmZpbGVzWzBdKSB7XG4gICAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgICAgICBuZXdGaWxlLm5hbWUocmVxLmZpbGVzWzBdLmZpbGVuYW1lKTtcbiAgICAgICAgaWYgKHJlcS5ib2R5KSB7XG4gICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IHJlcS5ib2R5O1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUub3duZXIgPSB1c2VySWQ7XG4gICAgICAgIG5ld0ZpbGUubWV0YWRhdGEub3duZXIgPSB1c2VySWQ7XG4gICAgICAgIG5ld0ZpbGUuYXR0YWNoRGF0YShyZXEuZmlsZXNbMF0uZGF0YSwge1xuICAgICAgICAgIHR5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZVxuICAgICAgICB9KTtcbiAgICAgICAgY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgIHJlc3VsdERhdGEgPSBjb2xsZWN0aW9uLmZpbGVzLmZpbmRPbmUobmV3RmlsZS5faWQpO1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgIGRhdGE6IHJlc3VsdERhdGFcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBGaWxlXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiBlLmVycm9yIHx8IDUwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG5cbmdldFF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24oYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgcXVlcnksIG1ldGhvZCkge1xuICB2YXIgQUxZLCBjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcsIGRhdGUsIHF1ZXJ5S2V5cywgcXVlcnlTdHIsIHN0cmluZ1RvU2lnbjtcbiAgY29uc29sZS5sb2coXCItLS0tdXVmbG93TWFuYWdlci5nZXRRdWVyeVN0cmluZy0tLS1cIik7XG4gIEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKTtcbiAgZGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpO1xuICBxdWVyeS5Gb3JtYXQgPSBcImpzb25cIjtcbiAgcXVlcnkuVmVyc2lvbiA9IFwiMjAxNy0wMy0yMVwiO1xuICBxdWVyeS5BY2Nlc3NLZXlJZCA9IGFjY2Vzc0tleUlkO1xuICBxdWVyeS5TaWduYXR1cmVNZXRob2QgPSBcIkhNQUMtU0hBMVwiO1xuICBxdWVyeS5UaW1lc3RhbXAgPSBBTFkudXRpbC5kYXRlLmlzbzg2MDEoZGF0ZSk7XG4gIHF1ZXJ5LlNpZ25hdHVyZVZlcnNpb24gPSBcIjEuMFwiO1xuICBxdWVyeS5TaWduYXR1cmVOb25jZSA9IFN0cmluZyhkYXRlLmdldFRpbWUoKSk7XG4gIHF1ZXJ5S2V5cyA9IE9iamVjdC5rZXlzKHF1ZXJ5KTtcbiAgcXVlcnlLZXlzLnNvcnQoKTtcbiAgY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nID0gXCJcIjtcbiAgcXVlcnlLZXlzLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiBjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcgKz0gXCImXCIgKyBuYW1lICsgXCI9XCIgKyBBTFkudXRpbC5wb3BFc2NhcGUocXVlcnlbbmFtZV0pO1xuICB9KTtcbiAgc3RyaW5nVG9TaWduID0gbWV0aG9kLnRvVXBwZXJDYXNlKCkgKyAnJiUyRiYnICsgQUxZLnV0aWwucG9wRXNjYXBlKGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZy5zdWJzdHIoMSkpO1xuICBxdWVyeS5TaWduYXR1cmUgPSBBTFkudXRpbC5jcnlwdG8uaG1hYyhzZWNyZXRBY2Nlc3NLZXkgKyAnJicsIHN0cmluZ1RvU2lnbiwgJ2Jhc2U2NCcsICdzaGExJyk7XG4gIHF1ZXJ5U3RyID0gQUxZLnV0aWwucXVlcnlQYXJhbXNUb1N0cmluZyhxdWVyeSk7XG4gIGNvbnNvbGUubG9nKHF1ZXJ5U3RyKTtcbiAgcmV0dXJuIHF1ZXJ5U3RyO1xufTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL3MzL3ZvZC91cGxvYWRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIEFMWSwgY29sbGVjdGlvbk5hbWUsIGUsIHVzZXJJZDtcbiAgdHJ5IHtcbiAgICB1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBwZXJtaXNzaW9uXCIpO1xuICAgIH1cbiAgICBjb2xsZWN0aW9uTmFtZSA9IFwidmlkZW9zXCI7XG4gICAgQUxZID0gcmVxdWlyZSgnYWxpeXVuLXNkaycpO1xuICAgIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyhyZXEsIHJlcywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYWNjZXNzS2V5SWQsIGNvbGxlY3Rpb24sIGRhdGUsIG9zcywgcXVlcnksIHIsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgc2VjcmV0QWNjZXNzS2V5LCB1cGxvYWRBZGRyZXNzLCB1cGxvYWRBdXRoLCB1cmwsIHZpZGVvSWQ7XG4gICAgICBjb2xsZWN0aW9uID0gY2ZzW2NvbGxlY3Rpb25OYW1lXTtcbiAgICAgIGlmICghY29sbGVjdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBDb2xsZWN0aW9uXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHJlcS5maWxlcyAmJiByZXEuZmlsZXNbMF0pIHtcbiAgICAgICAgaWYgKGNvbGxlY3Rpb25OYW1lID09PSAndmlkZW9zJyAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS5jZnMpICE9IG51bGwgPyByZWYuc3RvcmUgOiB2b2lkIDApID09PSBcIk9TU1wiKSB7XG4gICAgICAgICAgYWNjZXNzS2V5SWQgPSAocmVmMSA9IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKSAhPSBudWxsID8gcmVmMS5hY2Nlc3NLZXlJZCA6IHZvaWQgMDtcbiAgICAgICAgICBzZWNyZXRBY2Nlc3NLZXkgPSAocmVmMiA9IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKSAhPSBudWxsID8gcmVmMi5zZWNyZXRBY2Nlc3NLZXkgOiB2b2lkIDA7XG4gICAgICAgICAgZGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpO1xuICAgICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgICAgQWN0aW9uOiBcIkNyZWF0ZVVwbG9hZFZpZGVvXCIsXG4gICAgICAgICAgICBUaXRsZTogcmVxLmZpbGVzWzBdLmZpbGVuYW1lLFxuICAgICAgICAgICAgRmlsZU5hbWU6IHJlcS5maWxlc1swXS5maWxlbmFtZVxuICAgICAgICAgIH07XG4gICAgICAgICAgdXJsID0gXCJodHRwOi8vdm9kLmNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS8/XCIgKyBnZXRRdWVyeVN0cmluZyhhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBxdWVyeSwgJ0dFVCcpO1xuICAgICAgICAgIHIgPSBIVFRQLmNhbGwoJ0dFVCcsIHVybCk7XG4gICAgICAgICAgY29uc29sZS5sb2cocik7XG4gICAgICAgICAgaWYgKChyZWYzID0gci5kYXRhKSAhPSBudWxsID8gcmVmMy5WaWRlb0lkIDogdm9pZCAwKSB7XG4gICAgICAgICAgICB2aWRlb0lkID0gci5kYXRhLlZpZGVvSWQ7XG4gICAgICAgICAgICB1cGxvYWRBZGRyZXNzID0gSlNPTi5wYXJzZShuZXcgQnVmZmVyKHIuZGF0YS5VcGxvYWRBZGRyZXNzLCAnYmFzZTY0JykudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1cGxvYWRBZGRyZXNzKTtcbiAgICAgICAgICAgIHVwbG9hZEF1dGggPSBKU09OLnBhcnNlKG5ldyBCdWZmZXIoci5kYXRhLlVwbG9hZEF1dGgsICdiYXNlNjQnKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVwbG9hZEF1dGgpO1xuICAgICAgICAgICAgb3NzID0gbmV3IEFMWS5PU1Moe1xuICAgICAgICAgICAgICBcImFjY2Vzc0tleUlkXCI6IHVwbG9hZEF1dGguQWNjZXNzS2V5SWQsXG4gICAgICAgICAgICAgIFwic2VjcmV0QWNjZXNzS2V5XCI6IHVwbG9hZEF1dGguQWNjZXNzS2V5U2VjcmV0LFxuICAgICAgICAgICAgICBcImVuZHBvaW50XCI6IHVwbG9hZEFkZHJlc3MuRW5kcG9pbnQsXG4gICAgICAgICAgICAgIFwiYXBpVmVyc2lvblwiOiAnMjAxMy0xMC0xNScsXG4gICAgICAgICAgICAgIFwic2VjdXJpdHlUb2tlblwiOiB1cGxvYWRBdXRoLlNlY3VyaXR5VG9rZW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG9zcy5wdXRPYmplY3Qoe1xuICAgICAgICAgICAgICBCdWNrZXQ6IHVwbG9hZEFkZHJlc3MuQnVja2V0LFxuICAgICAgICAgICAgICBLZXk6IHVwbG9hZEFkZHJlc3MuRmlsZU5hbWUsXG4gICAgICAgICAgICAgIEJvZHk6IHJlcS5maWxlc1swXS5kYXRhLFxuICAgICAgICAgICAgICBBY2Nlc3NDb250cm9sQWxsb3dPcmlnaW46ICcnLFxuICAgICAgICAgICAgICBDb250ZW50VHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlLFxuICAgICAgICAgICAgICBDYWNoZUNvbnRyb2w6ICduby1jYWNoZScsXG4gICAgICAgICAgICAgIENvbnRlbnREaXNwb3NpdGlvbjogJycsXG4gICAgICAgICAgICAgIENvbnRlbnRFbmNvZGluZzogJ3V0Zi04JyxcbiAgICAgICAgICAgICAgU2VydmVyU2lkZUVuY3J5cHRpb246ICdBRVMyNTYnLFxuICAgICAgICAgICAgICBFeHBpcmVzOiBudWxsXG4gICAgICAgICAgICB9LCBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgICB2YXIgZ2V0UGxheUluZm9RdWVyeSwgZ2V0UGxheUluZm9SZXN1bHQsIGdldFBsYXlJbmZvVXJsLCBuZXdEYXRlO1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yOicsIGVycik7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc3VjY2VzczonLCBkYXRhKTtcbiAgICAgICAgICAgICAgbmV3RGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpO1xuICAgICAgICAgICAgICBnZXRQbGF5SW5mb1F1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgIEFjdGlvbjogJ0dldFBsYXlJbmZvJyxcbiAgICAgICAgICAgICAgICBWaWRlb0lkOiB2aWRlb0lkXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGdldFBsYXlJbmZvVXJsID0gXCJodHRwOi8vdm9kLmNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS8/XCIgKyBnZXRRdWVyeVN0cmluZyhhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBnZXRQbGF5SW5mb1F1ZXJ5LCAnR0VUJyk7XG4gICAgICAgICAgICAgIGdldFBsYXlJbmZvUmVzdWx0ID0gSFRUUC5jYWxsKCdHRVQnLCBnZXRQbGF5SW5mb1VybCk7XG4gICAgICAgICAgICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGdldFBsYXlJbmZvUmVzdWx0XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gRmlsZVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogZS5lcnJvciB8fCA1MDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgJ3Bvc3QnLCAnL2FwaS9vYmplY3Qvd29ya2Zsb3cvZHJhZnRzJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxyXG5cdFx0Y3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkXHJcblxyXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxyXG5cclxuXHRcdGluc2VydGVkX2luc3RhbmNlcyA9IG5ldyBBcnJheVxyXG5cclxuXHRcdF8uZWFjaCBoYXNoRGF0YVsnSW5zdGFuY2VzJ10sIChpbnN0YW5jZV9mcm9tX2NsaWVudCkgLT5cclxuXHRcdFx0bmV3X2luc19pZCA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY3JlYXRlX2luc3RhbmNlKGluc3RhbmNlX2Zyb21fY2xpZW50LCBjdXJyZW50X3VzZXJfaW5mbylcclxuXHJcblx0XHRcdG5ld19pbnMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kT25lKHsgX2lkOiBuZXdfaW5zX2lkIH0sIHsgZmllbGRzOiB7IHNwYWNlOiAxLCBmbG93OiAxLCBmbG93X3ZlcnNpb246IDEsIGZvcm06IDEsIGZvcm1fdmVyc2lvbjogMSB9IH0pXHJcblxyXG5cdFx0XHRpbnNlcnRlZF9pbnN0YW5jZXMucHVzaChuZXdfaW5zKVxyXG5cclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdGRhdGE6IHsgaW5zZXJ0czogaW5zZXJ0ZWRfaW5zdGFuY2VzIH1cclxuXHRcdH1cclxuXHRjYXRjaCBlXHJcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbeyBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XSB9XHJcblx0XHR9XHJcblxyXG4iLCJKc29uUm91dGVzLmFkZCgncG9zdCcsICcvYXBpL29iamVjdC93b3JrZmxvdy9kcmFmdHMnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgY3VycmVudF91c2VyX2lkLCBjdXJyZW50X3VzZXJfaW5mbywgZSwgaGFzaERhdGEsIGluc2VydGVkX2luc3RhbmNlcztcbiAgdHJ5IHtcbiAgICBjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpO1xuICAgIGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZDtcbiAgICBoYXNoRGF0YSA9IHJlcS5ib2R5O1xuICAgIGluc2VydGVkX2luc3RhbmNlcyA9IG5ldyBBcnJheTtcbiAgICBfLmVhY2goaGFzaERhdGFbJ0luc3RhbmNlcyddLCBmdW5jdGlvbihpbnN0YW5jZV9mcm9tX2NsaWVudCkge1xuICAgICAgdmFyIG5ld19pbnMsIG5ld19pbnNfaWQ7XG4gICAgICBuZXdfaW5zX2lkID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UoaW5zdGFuY2VfZnJvbV9jbGllbnQsIGN1cnJlbnRfdXNlcl9pbmZvKTtcbiAgICAgIG5ld19pbnMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kT25lKHtcbiAgICAgICAgX2lkOiBuZXdfaW5zX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHNwYWNlOiAxLFxuICAgICAgICAgIGZsb3c6IDEsXG4gICAgICAgICAgZmxvd192ZXJzaW9uOiAxLFxuICAgICAgICAgIGZvcm06IDEsXG4gICAgICAgICAgZm9ybV92ZXJzaW9uOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGluc2VydGVkX2luc3RhbmNlcy5wdXNoKG5ld19pbnMpO1xuICAgIH0pO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGluc2VydHM6IGluc2VydGVkX2luc3RhbmNlc1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIl19
