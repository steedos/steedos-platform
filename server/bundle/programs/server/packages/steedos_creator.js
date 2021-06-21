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
  "node-xlsx": "^0.12.0"
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
var _eval, objectql;

_eval = require('eval');
objectql = require('@steedos/objectql');
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
      var _record, _records, nameKey, o, obj;

      obj = Creator.getCollection(objName);
      o = Creator.getObject(objName, spaceId);
      nameKey = o.NAME_FIELD_KEY;

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

}},"routes":{"s3.coffee":function module(require){

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjcmVhdG9yL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvbGliL2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvb2JqZWN0X3JlY2VudF92aWV3ZWQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3ZpZXdlZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3JlY29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9yZWNlbnRfcmVjb3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9yZXBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3JlcG9ydF9kYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfZXhwb3J0MnhtbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9leHBvcnQyeG1sLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3JlbGF0ZWRfb2JqZWN0c19yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvcGVuZGluZ19zcGFjZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3BlbmRpbmdfc3BhY2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF90YWJ1bGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF9saXN0dmlld3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy91c2VyX3RhYnVsYXJfc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9yZWxhdGVkX29iamVjdHNfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV91c2VyX2luZm8uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c192aWV3X2xpbWl0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfdmlld19saW1pdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c19ub19mb3JjZV9waG9uZV91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9uZWVkX3RvX2NvbmZpcm0uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX25lZWRfdG9fY29uZmlybS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbGliL3Blcm1pc3Npb25fbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvcGVybWlzc2lvbl9tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9zMy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImJ1c2JveSIsIm1rZGlycCIsIk1ldGVvciIsInNldHRpbmdzIiwiY2ZzIiwiYWxpeXVuIiwiQ3JlYXRvciIsImdldFNjaGVtYSIsIm9iamVjdF9uYW1lIiwicmVmIiwiZ2V0T2JqZWN0Iiwic2NoZW1hIiwiZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCIsImlzQ2xpZW50IiwiUmVhY3RTdGVlZG9zIiwicGx1Z2luQ29tcG9uZW50U2VsZWN0b3IiLCJzdG9yZSIsImdldFN0YXRlIiwiZ2V0T2JqZWN0VXJsIiwicmVjb3JkX2lkIiwiYXBwX2lkIiwibGlzdF92aWV3IiwibGlzdF92aWV3X2lkIiwiU2Vzc2lvbiIsImdldCIsImdldExpc3RWaWV3IiwiX2lkIiwiZ2V0UmVsYXRpdmVVcmwiLCJnZXRPYmplY3RBYnNvbHV0ZVVybCIsIlN0ZWVkb3MiLCJhYnNvbHV0ZVVybCIsImdldE9iamVjdFJvdXRlclVybCIsImdldExpc3RWaWV3VXJsIiwidXJsIiwiZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybCIsImdldFN3aXRjaExpc3RVcmwiLCJnZXRSZWxhdGVkT2JqZWN0VXJsIiwicmVsYXRlZF9vYmplY3RfbmFtZSIsImdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyIsImlzX2RlZXAiLCJpc19za2lwX2hpZGUiLCJpc19yZWxhdGVkIiwiX29iamVjdCIsIl9vcHRpb25zIiwiZmllbGRzIiwiaWNvbiIsInJlbGF0ZWRPYmplY3RzIiwiXyIsImZvckVhY2giLCJmIiwiayIsImhpZGRlbiIsInR5cGUiLCJwdXNoIiwibGFiZWwiLCJ2YWx1ZSIsInJfb2JqZWN0IiwicmVmZXJlbmNlX3RvIiwiaXNTdHJpbmciLCJmMiIsImsyIiwiZ2V0UmVsYXRlZE9iamVjdHMiLCJlYWNoIiwiX3RoaXMiLCJfcmVsYXRlZE9iamVjdCIsInJlbGF0ZWRPYmplY3QiLCJyZWxhdGVkT3B0aW9ucyIsInJlbGF0ZWRPcHRpb24iLCJmb3JlaWduX2tleSIsIm5hbWUiLCJnZXRPYmplY3RGaWx0ZXJGaWVsZE9wdGlvbnMiLCJwZXJtaXNzaW9uX2ZpZWxkcyIsImdldEZpZWxkcyIsImluY2x1ZGUiLCJ0ZXN0IiwiaW5kZXhPZiIsImdldE9iamVjdEZpZWxkT3B0aW9ucyIsImdldEZpbHRlcnNXaXRoRmlsdGVyRmllbGRzIiwiZmlsdGVycyIsImZpbHRlcl9maWVsZHMiLCJsZW5ndGgiLCJuIiwiZmllbGQiLCJyZXF1aXJlZCIsImZpbmRXaGVyZSIsImlzX2RlZmF1bHQiLCJpc19yZXF1aXJlZCIsImZpbHRlckl0ZW0iLCJtYXRjaEZpZWxkIiwiZmluZCIsImdldE9iamVjdFJlY29yZCIsInNlbGVjdF9maWVsZHMiLCJleHBhbmQiLCJjb2xsZWN0aW9uIiwicmVjb3JkIiwicmVmMSIsInJlZjIiLCJUZW1wbGF0ZSIsImluc3RhbmNlIiwib2RhdGEiLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsImdldE9iamVjdFJlY29yZE5hbWUiLCJuYW1lX2ZpZWxkX2tleSIsIk5BTUVfRklFTERfS0VZIiwiZ2V0QXBwIiwiYXBwIiwiQXBwcyIsImRlcHMiLCJkZXBlbmQiLCJnZXRBcHBEYXNoYm9hcmQiLCJkYXNoYm9hcmQiLCJEYXNoYm9hcmRzIiwiYXBwcyIsImdldEFwcERhc2hib2FyZENvbXBvbmVudCIsImdldEFwcE9iamVjdE5hbWVzIiwiYXBwT2JqZWN0cyIsImlzTW9iaWxlIiwib2JqZWN0cyIsIm1vYmlsZV9vYmplY3RzIiwib2JqIiwicGVybWlzc2lvbnMiLCJhbGxvd1JlYWQiLCJnZXRWaXNpYmxlQXBwcyIsImluY2x1ZGVBZG1pbiIsImNoYW5nZUFwcCIsIl9zdWJBcHAiLCJlbnRpdGllcyIsIk9iamVjdCIsImFzc2lnbiIsInZpc2libGVBcHBzU2VsZWN0b3IiLCJnZXRWaXNpYmxlQXBwc09iamVjdHMiLCJ2aXNpYmxlT2JqZWN0TmFtZXMiLCJmbGF0dGVuIiwicGx1Y2siLCJmaWx0ZXIiLCJPYmplY3RzIiwic29ydCIsInNvcnRpbmdNZXRob2QiLCJiaW5kIiwia2V5IiwidW5pcSIsImdldEFwcHNPYmplY3RzIiwidGVtcE9iamVjdHMiLCJjb25jYXQiLCJ2YWxpZGF0ZUZpbHRlcnMiLCJsb2dpYyIsImUiLCJlcnJvck1zZyIsImZpbHRlcl9pdGVtcyIsImZpbHRlcl9sZW5ndGgiLCJmbGFnIiwiaW5kZXgiLCJ3b3JkIiwibWFwIiwiaXNFbXB0eSIsImNvbXBhY3QiLCJyZXBsYWNlIiwibWF0Y2giLCJpIiwiaW5jbHVkZXMiLCJ3IiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwidG9hc3RyIiwiZm9ybWF0RmlsdGVyc1RvTW9uZ28iLCJvcHRpb25zIiwic2VsZWN0b3IiLCJBcnJheSIsIm9wZXJhdGlvbiIsIm9wdGlvbiIsInJlZyIsInN1Yl9zZWxlY3RvciIsImV2YWx1YXRlRm9ybXVsYSIsIlJlZ0V4cCIsImlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyIsImZvcm1hdEZpbHRlcnNUb0RldiIsImxvZ2ljVGVtcEZpbHRlcnMiLCJzdGVlZG9zRmlsdGVycyIsInJlcXVpcmUiLCJpc19sb2dpY19vciIsInBvcCIsIlVTRVJfQ09OVEVYVCIsImZvcm1hdExvZ2ljRmlsdGVyc1RvRGV2IiwiZmlsdGVyX2xvZ2ljIiwiZm9ybWF0X2xvZ2ljIiwieCIsIl9mIiwiaXNBcnJheSIsIkpTT04iLCJzdHJpbmdpZnkiLCJzcGFjZUlkIiwidXNlcklkIiwicmVsYXRlZF9vYmplY3RfbmFtZXMiLCJyZWxhdGVkX29iamVjdHMiLCJ1bnJlbGF0ZWRfb2JqZWN0cyIsImdldE9iamVjdFJlbGF0ZWRzIiwiX2NvbGxlY3Rpb25fbmFtZSIsImdldFBlcm1pc3Npb25zIiwiZGlmZmVyZW5jZSIsInJlbGF0ZWRfb2JqZWN0IiwiaXNBY3RpdmUiLCJnZXRSZWxhdGVkT2JqZWN0TmFtZXMiLCJnZXRBY3Rpb25zIiwiYWN0aW9ucyIsImRpc2FibGVkX2FjdGlvbnMiLCJzb3J0QnkiLCJ2YWx1ZXMiLCJoYXMiLCJhY3Rpb24iLCJhbGxvd19jdXN0b21BY3Rpb25zIiwia2V5cyIsImV4Y2x1ZGVfYWN0aW9ucyIsIm9uIiwiZ2V0TGlzdFZpZXdzIiwiZGlzYWJsZWRfbGlzdF92aWV3cyIsImxpc3Rfdmlld3MiLCJvYmplY3QiLCJpdGVtIiwiaXRlbV9uYW1lIiwib3duZXIiLCJmaWVsZHNOYW1lIiwidW5yZWFkYWJsZV9maWVsZHMiLCJnZXRPYmplY3RGaWVsZHNOYW1lIiwiaXNsb2FkaW5nIiwiYm9vdHN0cmFwTG9hZGVkIiwiY29udmVydFNwZWNpYWxDaGFyYWN0ZXIiLCJzdHIiLCJnZXREaXNhYmxlZEZpZWxkcyIsImZpZWxkTmFtZSIsImF1dG9mb3JtIiwiZGlzYWJsZWQiLCJvbWl0IiwiZ2V0SGlkZGVuRmllbGRzIiwiZ2V0RmllbGRzV2l0aE5vR3JvdXAiLCJncm91cCIsImdldFNvcnRlZEZpZWxkR3JvdXBOYW1lcyIsIm5hbWVzIiwidW5pcXVlIiwiZ2V0RmllbGRzRm9yR3JvdXAiLCJncm91cE5hbWUiLCJnZXRGaWVsZHNXaXRob3V0T21pdCIsInBpY2siLCJnZXRGaWVsZHNJbkZpcnN0TGV2ZWwiLCJmaXJzdExldmVsS2V5cyIsImdldEZpZWxkc0ZvclJlb3JkZXIiLCJpc1NpbmdsZSIsIl9rZXlzIiwiY2hpbGRLZXlzIiwiaXNfd2lkZV8xIiwiaXNfd2lkZV8yIiwic2NfMSIsInNjXzIiLCJlbmRzV2l0aCIsImlzX3dpZGUiLCJzbGljZSIsImlzRmlsdGVyVmFsdWVFbXB0eSIsIk51bWJlciIsImlzTmFOIiwiZ2V0RmllbGREYXRhVHlwZSIsIm9iamVjdEZpZWxkcyIsInJlc3VsdCIsImRhdGFfdHlwZSIsImlzU2VydmVyIiwiZ2V0QWxsUmVsYXRlZE9iamVjdHMiLCJyZWxhdGVkX2ZpZWxkIiwicmVsYXRlZF9maWVsZF9uYW1lIiwiZW5hYmxlX2ZpbGVzIiwiZm9ybWF0SW5kZXgiLCJhcnJheSIsImluZGV4TmFtZSIsImlzZG9jdW1lbnREQiIsImJhY2tncm91bmQiLCJkYXRhc291cmNlcyIsImRvY3VtZW50REIiLCJqb2luIiwic3Vic3RyaW5nIiwiYXBwc0J5TmFtZSIsIm1ldGhvZHMiLCJzcGFjZV9pZCIsImNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZCIsImN1cnJlbnRfcmVjZW50X3ZpZXdlZCIsImRvYyIsInNwYWNlIiwidXBkYXRlIiwiJGluYyIsImNvdW50IiwiJHNldCIsIm1vZGlmaWVkIiwiRGF0ZSIsIm1vZGlmaWVkX2J5IiwiaW5zZXJ0IiwiX21ha2VOZXdJRCIsIm8iLCJpZHMiLCJjcmVhdGVkIiwiY3JlYXRlZF9ieSIsImFzeW5jX3JlY2VudF9hZ2dyZWdhdGUiLCJyZWNlbnRfYWdncmVnYXRlIiwic2VhcmNoX29iamVjdCIsIl9yZWNvcmRzIiwiY2FsbGJhY2siLCJDb2xsZWN0aW9ucyIsIm9iamVjdF9yZWNlbnRfdmlld2VkIiwicmF3Q29sbGVjdGlvbiIsImFnZ3JlZ2F0ZSIsIiRtYXRjaCIsIiRncm91cCIsIm1heENyZWF0ZWQiLCIkbWF4IiwiJHNvcnQiLCIkbGltaXQiLCJ0b0FycmF5IiwiZXJyIiwiZGF0YSIsIkVycm9yIiwiaXNGdW5jdGlvbiIsIndyYXBBc3luYyIsInNlYXJjaFRleHQiLCJfb2JqZWN0X2NvbGxlY3Rpb24iLCJfb2JqZWN0X25hbWVfa2V5IiwicXVlcnkiLCJxdWVyeV9hbmQiLCJyZWNvcmRzIiwic2VhcmNoX0tleXdvcmRzIiwic3BsaXQiLCJrZXl3b3JkIiwic3VicXVlcnkiLCIkcmVnZXgiLCJ0cmltIiwiJGFuZCIsIiRpbiIsImxpbWl0IiwiX25hbWUiLCJfb2JqZWN0X25hbWUiLCJyZWNvcmRfb2JqZWN0IiwicmVjb3JkX29iamVjdF9jb2xsZWN0aW9uIiwic2VsZiIsIm9iamVjdHNCeU5hbWUiLCJvYmplY3RfcmVjb3JkIiwiZW5hYmxlX3NlYXJjaCIsInVwZGF0ZV9maWx0ZXJzIiwibGlzdHZpZXdfaWQiLCJmaWx0ZXJfc2NvcGUiLCJvYmplY3RfbGlzdHZpZXdzIiwiZGlyZWN0IiwidXBkYXRlX2NvbHVtbnMiLCJjb2x1bW5zIiwiY2hlY2siLCJjb21wb3VuZEZpZWxkcyIsImN1cnNvciIsImZpbHRlckZpZWxkcyIsImNoaWxkS2V5Iiwib2JqZWN0RmllbGQiLCJzcGxpdHMiLCJpc0NvbW1vblNwYWNlIiwiaXNTcGFjZUFkbWluIiwic2tpcCIsImZldGNoIiwiY29tcG91bmRGaWVsZEl0ZW0iLCJjb21wb3VuZEZpbHRlckZpZWxkcyIsIml0ZW1LZXkiLCJpdGVtVmFsdWUiLCJyZWZlcmVuY2VJdGVtIiwic2V0dGluZyIsImNvbHVtbl93aWR0aCIsIm9iajEiLCJfaWRfYWN0aW9ucyIsIl9taXhGaWVsZHNEYXRhIiwiX21peFJlbGF0ZWREYXRhIiwiX3dyaXRlWG1sRmlsZSIsImZzIiwibG9nZ2VyIiwicGF0aCIsInhtbDJqcyIsIkxvZ2dlciIsImpzb25PYmoiLCJvYmpOYW1lIiwiYnVpbGRlciIsImRheSIsImZpbGVBZGRyZXNzIiwiZmlsZU5hbWUiLCJmaWxlUGF0aCIsIm1vbnRoIiwibm93Iiwic3RyZWFtIiwieG1sIiwieWVhciIsIkJ1aWxkZXIiLCJidWlsZE9iamVjdCIsIkJ1ZmZlciIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiX19tZXRlb3JfYm9vdHN0cmFwX18iLCJzZXJ2ZXJEaXIiLCJleGlzdHNTeW5jIiwic3luYyIsIndyaXRlRmlsZSIsIm1peEJvb2wiLCJtaXhEYXRlIiwibWl4RGVmYXVsdCIsIm9iakZpZWxkcyIsImZpZWxkX25hbWUiLCJkYXRlIiwiZGF0ZVN0ciIsImZvcm1hdCIsIm1vbWVudCIsInJlbGF0ZWRPYmpOYW1lcyIsInJlbGF0ZWRPYmpOYW1lIiwicmVsYXRlZENvbGxlY3Rpb24iLCJyZWxhdGVkUmVjb3JkTGlzdCIsInJlbGF0ZWRUYWJsZURhdGEiLCJyZWxhdGVkT2JqIiwiZmllbGRzRGF0YSIsIkV4cG9ydDJ4bWwiLCJyZWNvcmRMaXN0IiwiaW5mbyIsInRpbWUiLCJyZWNvcmRPYmoiLCJ0aW1lRW5kIiwicmVsYXRlZF9vYmplY3RzX3JlY29yZHMiLCJyZWxhdGVkX3JlY29yZHMiLCJ2aWV3QWxsUmVjb3JkcyIsImdldFBlbmRpbmdTcGFjZUluZm8iLCJpbnZpdGVySWQiLCJpbnZpdGVyTmFtZSIsInNwYWNlTmFtZSIsImRiIiwidXNlcnMiLCJzcGFjZXMiLCJpbnZpdGVyIiwicmVmdXNlSm9pblNwYWNlIiwic3BhY2VfdXNlcnMiLCJpbnZpdGVfc3RhdGUiLCJhY2NlcHRKb2luU3BhY2UiLCJ1c2VyX2FjY2VwdGVkIiwicHVibGlzaCIsImlkIiwicHVibGlzaENvbXBvc2l0ZSIsInRhYmxlTmFtZSIsIl9maWVsZHMiLCJvYmplY3RfY29sbGVjaXRvbiIsInJlZmVyZW5jZV9maWVsZHMiLCJyZWFkeSIsIlN0cmluZyIsIk1hdGNoIiwiT3B0aW9uYWwiLCJnZXRPYmplY3ROYW1lIiwidW5ibG9jayIsImZpZWxkX2tleXMiLCJjaGlsZHJlbiIsIl9vYmplY3RLZXlzIiwicmVmZXJlbmNlX2ZpZWxkIiwicGFyZW50IiwiY2hpbGRyZW5fZmllbGRzIiwicF9rIiwicmVmZXJlbmNlX2lkcyIsInJlZmVyZW5jZV90b19vYmplY3QiLCJzX2siLCJnZXRQcm9wZXJ0eSIsInJlZHVjZSIsImlzT2JqZWN0Iiwic2hhcmVkIiwidXNlciIsInNwYWNlX3NldHRpbmdzIiwicGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwiLCJnZXRGbG93UGVybWlzc2lvbnMiLCJmbG93X2lkIiwidXNlcl9pZCIsImZsb3ciLCJteV9wZXJtaXNzaW9ucyIsIm9yZ19pZHMiLCJvcmdhbml6YXRpb25zIiwib3Jnc19jYW5fYWRkIiwib3Jnc19jYW5fYWRtaW4iLCJvcmdzX2Nhbl9tb25pdG9yIiwidXNlcnNfY2FuX2FkZCIsInVzZXJzX2Nhbl9hZG1pbiIsInVzZXJzX2Nhbl9tb25pdG9yIiwidXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbCIsImdldEZsb3ciLCJwYXJlbnRzIiwib3JnIiwicGFyZW50X2lkIiwicGVybXMiLCJvcmdfaWQiLCJfZXZhbCIsIm9iamVjdHFsIiwiY2hlY2tfYXV0aG9yaXphdGlvbiIsInJlcSIsImF1dGhUb2tlbiIsImhhc2hlZFRva2VuIiwiQWNjb3VudHMiLCJfaGFzaExvZ2luVG9rZW4iLCJnZXRTcGFjZSIsImZsb3dzIiwiZ2V0U3BhY2VVc2VyIiwic3BhY2VfdXNlciIsImdldFNwYWNlVXNlck9yZ0luZm8iLCJvcmdhbml6YXRpb24iLCJmdWxsbmFtZSIsIm9yZ2FuaXphdGlvbl9uYW1lIiwib3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwiaXNGbG93RW5hYmxlZCIsInN0YXRlIiwiaXNGbG93U3BhY2VNYXRjaGVkIiwiZ2V0Rm9ybSIsImZvcm1faWQiLCJmb3JtIiwiZm9ybXMiLCJnZXRDYXRlZ29yeSIsImNhdGVnb3J5X2lkIiwiY2F0ZWdvcmllcyIsImNyZWF0ZV9pbnN0YW5jZSIsImluc3RhbmNlX2Zyb21fY2xpZW50IiwidXNlcl9pbmZvIiwiYXBwcl9vYmoiLCJhcHByb3ZlX2Zyb21fY2xpZW50IiwiY2F0ZWdvcnkiLCJpbnNfb2JqIiwibmV3X2luc19pZCIsInJlbGF0ZWRUYWJsZXNJbmZvIiwic3BhY2VfdXNlcl9vcmdfaW5mbyIsInN0YXJ0X3N0ZXAiLCJ0cmFjZV9mcm9tX2NsaWVudCIsInRyYWNlX29iaiIsImNoZWNrSXNJbkFwcHJvdmFsIiwicGVybWlzc2lvbk1hbmFnZXIiLCJpbnN0YW5jZXMiLCJmbG93X3ZlcnNpb24iLCJjdXJyZW50IiwiZm9ybV92ZXJzaW9uIiwic3VibWl0dGVyIiwic3VibWl0dGVyX25hbWUiLCJhcHBsaWNhbnQiLCJhcHBsaWNhbnRfbmFtZSIsImFwcGxpY2FudF9vcmdhbml6YXRpb24iLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUiLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwiYXBwbGljYW50X2NvbXBhbnkiLCJjb21wYW55X2lkIiwiY29kZSIsImlzX2FyY2hpdmVkIiwiaXNfZGVsZXRlZCIsInJlY29yZF9pZHMiLCJNb25nbyIsIk9iamVjdElEIiwiX3N0ciIsImlzX2ZpbmlzaGVkIiwic3RlcHMiLCJzdGVwIiwic3RlcF90eXBlIiwic3RhcnRfZGF0ZSIsInRyYWNlIiwidXNlcl9uYW1lIiwiaGFuZGxlciIsImhhbmRsZXJfbmFtZSIsImhhbmRsZXJfb3JnYW5pemF0aW9uIiwiaGFuZGxlcl9vcmdhbml6YXRpb25fbmFtZSIsImhhbmRsZXJfb3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwicmVhZF9kYXRlIiwiaXNfcmVhZCIsImlzX2Vycm9yIiwiZGVzY3JpcHRpb24iLCJpbml0aWF0ZVZhbHVlcyIsImFwcHJvdmVzIiwidHJhY2VzIiwiaW5ib3hfdXNlcnMiLCJjdXJyZW50X3N0ZXBfbmFtZSIsImF1dG9fcmVtaW5kIiwiZmxvd19uYW1lIiwiY2F0ZWdvcnlfbmFtZSIsImluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvIiwiaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvIiwiaW5pdGlhdGVBdHRhY2giLCJyZWNvcmRJZHMiLCJmbG93SWQiLCJmaWVsZENvZGVzIiwiZmlsdGVyVmFsdWVzIiwiZm9ybUZpZWxkcyIsImZvcm1UYWJsZUZpZWxkcyIsImZvcm1UYWJsZUZpZWxkc0NvZGUiLCJnZXRGaWVsZE9kYXRhVmFsdWUiLCJnZXRGb3JtRmllbGQiLCJnZXRGb3JtVGFibGVGaWVsZCIsImdldEZvcm1UYWJsZUZpZWxkQ29kZSIsImdldEZvcm1UYWJsZVN1YkZpZWxkIiwiZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSIsImdldFNlbGVjdE9yZ1ZhbHVlIiwiZ2V0U2VsZWN0T3JnVmFsdWVzIiwiZ2V0U2VsZWN0VXNlclZhbHVlIiwiZ2V0U2VsZWN0VXNlclZhbHVlcyIsIm9iamVjdE5hbWUiLCJvdyIsInJlY29yZElkIiwicmVsYXRlZE9iamVjdHNLZXlzIiwidGFibGVGaWVsZENvZGVzIiwidGFibGVGaWVsZE1hcCIsInRhYmxlVG9SZWxhdGVkTWFwIiwiZmYiLCJvYmplY3Rfd29ya2Zsb3dzIiwiZm9ybUZpZWxkIiwicmVsYXRlZE9iamVjdHNLZXkiLCJzdGFydHNXaXRoIiwiZm9ybVRhYmxlRmllbGRDb2RlIiwic2YiLCJ0YWJsZUZpZWxkIiwic3ViRmllbGRDb2RlIiwiX3JlY29yZCIsIm5hbWVLZXkiLCJzdSIsInVzZXJJZHMiLCJzdXMiLCJvcmdJZCIsIm9yZ0lkcyIsIm9yZ3MiLCJmaWVsZF9tYXAiLCJmbSIsImZpZWxkc09iaiIsImxvb2t1cEZpZWxkTmFtZSIsImxvb2t1cEZpZWxkT2JqIiwibG9va3VwT2JqZWN0UmVjb3JkIiwib1RhYmxlQ29kZSIsIm9UYWJsZUZpZWxkQ29kZSIsIm9iakZpZWxkIiwib2JqZWN0RmllbGROYW1lIiwib2JqZWN0RmllbGRPYmplY3ROYW1lIiwib2JqZWN0TG9va3VwRmllbGQiLCJvYmplY3RfZmllbGQiLCJvZGF0YUZpZWxkVmFsdWUiLCJyZWZlcmVuY2VUb0ZpZWxkVmFsdWUiLCJyZWZlcmVuY2VUb09iamVjdE5hbWUiLCJyZWxhdGVkT2JqZWN0RmllbGRDb2RlIiwic2VsZWN0RmllbGRWYWx1ZSIsInRhYmxlVG9SZWxhdGVkTWFwS2V5Iiwid1RhYmxlQ29kZSIsIndvcmtmbG93X2ZpZWxkIiwiaGFzT3duUHJvcGVydHkiLCJ3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlIiwib2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGUiLCJtdWx0aXBsZSIsImlzX211bHRpc2VsZWN0IiwidGZjIiwiYyIsInBhcnNlIiwidHIiLCJuZXdUciIsInRmbSIsIndUZENvZGUiLCJmb3JtVGFibGVGaWVsZCIsInJlbGF0ZWRGaWVsZCIsInJlbGF0ZWRGaWVsZE5hbWUiLCJyZWxhdGVkT2JqZWN0TmFtZSIsInJlbGF0ZWRSZWNvcmRzIiwicmVsYXRlZFRhYmxlSXRlbXMiLCJ0YWJsZUNvZGUiLCJ0YWJsZVZhbHVlcyIsIl9GUk9NX1RBQkxFX0NPREUiLCJ3YXJuIiwicnIiLCJ0YWJsZVZhbHVlSXRlbSIsInZhbHVlS2V5IiwiZmllbGRLZXkiLCJmb3JtRmllbGRLZXkiLCJyZWxhdGVkT2JqZWN0RmllbGQiLCJ0YWJsZUZpZWxkVmFsdWUiLCJfdGFibGUiLCJfY29kZSIsImZpZWxkX21hcF9zY3JpcHQiLCJleHRlbmQiLCJldmFsRmllbGRNYXBTY3JpcHQiLCJvYmplY3RJZCIsImZ1bmMiLCJzY3JpcHQiLCJpbnNJZCIsImFwcHJvdmVJZCIsImNmIiwidmVyc2lvbnMiLCJ2ZXJzaW9uSWQiLCJpZHgiLCJuZXdGaWxlIiwiRlMiLCJGaWxlIiwiYXR0YWNoRGF0YSIsImNyZWF0ZVJlYWRTdHJlYW0iLCJvcmlnaW5hbCIsIm1ldGFkYXRhIiwicmVhc29uIiwic2l6ZSIsIm93bmVyX25hbWUiLCJhcHByb3ZlIiwiJHB1c2giLCIkZWFjaCIsIiRwb3NpdGlvbiIsImxvY2tlZCIsImluc3RhbmNlX3N0YXRlIiwidGFibGVJdGVtcyIsIiRleGlzdHMiLCJnZXRRdWVyeVN0cmluZyIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXMiLCJuZXh0IiwicGFyc2VGaWxlcyIsImZpbGVDb2xsZWN0aW9uIiwiZmlsZXMiLCJtaW1lVHlwZSIsImJvZHkiLCJleHRlbnRpb24iLCJmaWxlT2JqIiwiZmlsZW5hbWUiLCJuZXdGaWxlT2JqSWQiLCJyZXNwIiwidG9Mb3dlckNhc2UiLCJkZWNvZGVVUklDb21wb25lbnQiLCJ2ZXJzaW9uX2lkIiwic2V0SGVhZGVyIiwiZW5kIiwic3RhdHVzQ29kZSIsImNvbGxlY3Rpb25OYW1lIiwiZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiIsInBhcmFtcyIsInJlc3VsdERhdGEiLCJzZW5kUmVzdWx0Iiwic3RhY2siLCJlcnJvcnMiLCJtZXNzYWdlIiwiYWNjZXNzS2V5SWQiLCJzZWNyZXRBY2Nlc3NLZXkiLCJtZXRob2QiLCJBTFkiLCJjYW5vbmljYWxpemVkUXVlcnlTdHJpbmciLCJxdWVyeUtleXMiLCJxdWVyeVN0ciIsInN0cmluZ1RvU2lnbiIsInV0aWwiLCJGb3JtYXQiLCJWZXJzaW9uIiwiQWNjZXNzS2V5SWQiLCJTaWduYXR1cmVNZXRob2QiLCJUaW1lc3RhbXAiLCJpc284NjAxIiwiU2lnbmF0dXJlVmVyc2lvbiIsIlNpZ25hdHVyZU5vbmNlIiwiZ2V0VGltZSIsInBvcEVzY2FwZSIsInRvVXBwZXJDYXNlIiwic3Vic3RyIiwiU2lnbmF0dXJlIiwiY3J5cHRvIiwiaG1hYyIsInF1ZXJ5UGFyYW1zVG9TdHJpbmciLCJvc3MiLCJyIiwicmVmMyIsInVwbG9hZEFkZHJlc3MiLCJ1cGxvYWRBdXRoIiwidmlkZW9JZCIsIkFjdGlvbiIsIlRpdGxlIiwiRmlsZU5hbWUiLCJIVFRQIiwiY2FsbCIsIlZpZGVvSWQiLCJVcGxvYWRBZGRyZXNzIiwidG9TdHJpbmciLCJVcGxvYWRBdXRoIiwiT1NTIiwiQWNjZXNzS2V5U2VjcmV0IiwiRW5kcG9pbnQiLCJTZWN1cml0eVRva2VuIiwicHV0T2JqZWN0IiwiQnVja2V0IiwiS2V5IiwiQm9keSIsIkFjY2Vzc0NvbnRyb2xBbGxvd09yaWdpbiIsIkNvbnRlbnRUeXBlIiwiQ2FjaGVDb250cm9sIiwiQ29udGVudERpc3Bvc2l0aW9uIiwiQ29udGVudEVuY29kaW5nIiwiU2VydmVyU2lkZUVuY3J5cHRpb24iLCJFeHBpcmVzIiwiYmluZEVudmlyb25tZW50IiwiZ2V0UGxheUluZm9RdWVyeSIsImdldFBsYXlJbmZvUmVzdWx0IiwiZ2V0UGxheUluZm9VcmwiLCJuZXdEYXRlIiwiY3VycmVudF91c2VyX2lkIiwiY3VycmVudF91c2VyX2luZm8iLCJoYXNoRGF0YSIsImluc2VydGVkX2luc3RhbmNlcyIsIm5ld19pbnMiLCJpbnNlcnRzIiwiZXJyb3JNZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBR3JCSCxnQkFBZ0IsQ0FBQztBQUNoQkksUUFBTSxFQUFFLFNBRFE7QUFFaEJDLFFBQU0sRUFBRSxRQUZRO0FBR2hCLFlBQVUsU0FITTtBQUloQixlQUFhO0FBSkcsQ0FBRCxFQUtiLGlCQUxhLENBQWhCOztBQU9BLElBQUlDLE1BQU0sQ0FBQ0MsUUFBUCxJQUFtQkQsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxHQUFuQyxJQUEwQ0YsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxHQUFoQixDQUFvQkMsTUFBbEUsRUFBMEU7QUFDekVULGtCQUFnQixDQUFDO0FBQ2hCLGtCQUFjO0FBREUsR0FBRCxFQUViLGlCQUZhLENBQWhCO0FBR0EsQzs7Ozs7Ozs7Ozs7O0FDQ0RVLFFBQVFDLFNBQVIsR0FBb0IsVUFBQ0MsV0FBRDtBQUNuQixNQUFBQyxHQUFBO0FBQUEsVUFBQUEsTUFBQUgsUUFBQUksU0FBQSxDQUFBRixXQUFBLGFBQUFDLElBQXVDRSxNQUF2QyxHQUF1QyxNQUF2QztBQURtQixDQUFwQjs7QUFHQUwsUUFBUU0sc0JBQVIsR0FBaUMsVUFBQ0osV0FBRDtBQUNoQyxNQUFHTixP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USxDQUFDO0FBQUVvRSx3QkFBY3pvQixFQUFFK2hCLE1BQUYsSUFBWS9oQixFQUFFc2tCO0FBQTlCLFNBQUQ7QUFBVjtBQUZvQixLQUEzQixDQ1VFO0FBVUQ7QUQxQ0gsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuXHRjaGVja05wbVZlcnNpb25zXHJcbn0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XHJcbmNoZWNrTnBtVmVyc2lvbnMoe1xyXG5cdGJ1c2JveTogXCJeMC4yLjEzXCIsXHJcblx0bWtkaXJwOiBcIl4wLjMuNVwiLFxyXG5cdFwieG1sMmpzXCI6IFwiXjAuNC4xOVwiLFxyXG5cdFwibm9kZS14bHN4XCI6IFwiXjAuMTIuMFwiXHJcbn0sICdzdGVlZG9zOmNyZWF0b3InKTtcclxuXHJcbmlmIChNZXRlb3Iuc2V0dGluZ3MgJiYgTWV0ZW9yLnNldHRpbmdzLmNmcyAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bikge1xyXG5cdGNoZWNrTnBtVmVyc2lvbnMoe1xyXG5cdFx0XCJhbGl5dW4tc2RrXCI6IFwiXjEuMTEuMTJcIlxyXG5cdH0sICdzdGVlZG9zOmNyZWF0b3InKTtcclxufSIsIlxyXG5cdCMgQ3JlYXRvci5pbml0QXBwcygpXHJcblxyXG5cclxuIyBDcmVhdG9yLmluaXRBcHBzID0gKCktPlxyXG4jIFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcbiMgXHRcdF8uZWFjaCBDcmVhdG9yLkFwcHMsIChhcHAsIGFwcF9pZCktPlxyXG4jIFx0XHRcdGRiX2FwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpXHJcbiMgXHRcdFx0aWYgIWRiX2FwcFxyXG4jIFx0XHRcdFx0YXBwLl9pZCA9IGFwcF9pZFxyXG4jIFx0XHRcdFx0ZGIuYXBwcy5pbnNlcnQoYXBwKVxyXG4jIGVsc2VcclxuIyBcdGFwcC5faWQgPSBhcHBfaWRcclxuIyBcdGRiLmFwcHMudXBkYXRlKHtfaWQ6IGFwcF9pZH0sIGFwcClcclxuXHJcbkNyZWF0b3IuZ2V0U2NoZW1hID0gKG9iamVjdF9uYW1lKS0+XHJcblx0cmV0dXJuIENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKT8uc2NoZW1hXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQgPSAob2JqZWN0X25hbWUpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdHJldHVybiBSZWFjdFN0ZWVkb3MucGx1Z2luQ29tcG9uZW50U2VsZWN0b3IoUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCksIFwiT2JqZWN0SG9tZVwiLCBvYmplY3RfbmFtZSlcclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0VXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cclxuXHRpZiAhYXBwX2lkXHJcblx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXHJcblx0bGlzdF92aWV3X2lkID0gbGlzdF92aWV3Py5faWRcclxuXHJcblx0aWYgcmVjb3JkX2lkXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZClcclxuXHRlbHNlXHJcblx0XHRpZiBvYmplY3RfbmFtZSBpcyBcIm1lZXRpbmdcIlxyXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCIpXHJcblx0XHRlbHNlXHJcblx0XHRcdGlmIENyZWF0b3IuZ2V0T2JqZWN0SG9tZUNvbXBvbmVudChvYmplY3RfbmFtZSlcclxuXHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQpXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdEFic29sdXRlVXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cclxuXHRpZiAhYXBwX2lkXHJcblx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXHJcblx0bGlzdF92aWV3X2lkID0gbGlzdF92aWV3Py5faWRcclxuXHJcblx0aWYgcmVjb3JkX2lkXHJcblx0XHRyZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZCwgdHJ1ZSlcclxuXHRlbHNlXHJcblx0XHRpZiBvYmplY3RfbmFtZSBpcyBcIm1lZXRpbmdcIlxyXG5cdFx0XHRyZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCIsIHRydWUpXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkLCB0cnVlKVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RSb3V0ZXJVcmwgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSAtPlxyXG5cdGlmICFhcHBfaWRcclxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXHJcblx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHJcblx0bGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbClcclxuXHRsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXc/Ll9pZFxyXG5cclxuXHRpZiByZWNvcmRfaWRcclxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZFxyXG5cdGVsc2VcclxuXHRcdGlmIG9iamVjdF9uYW1lIGlzIFwibWVldGluZ1wiXHJcblx0XHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCJcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkXHJcblxyXG5DcmVhdG9yLmdldExpc3RWaWV3VXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cclxuXHR1cmwgPSBDcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKVxyXG5cdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKHVybClcclxuXHJcbkNyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIC0+XHJcblx0aWYgbGlzdF92aWV3X2lkIGlzIFwiY2FsZW5kYXJcIlxyXG5cdFx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIlxyXG5cdGVsc2VcclxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZFxyXG5cclxuQ3JlYXRvci5nZXRTd2l0Y2hMaXN0VXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cclxuXHRpZiBsaXN0X3ZpZXdfaWRcclxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIGxpc3Rfdmlld19pZCArIFwiL2xpc3RcIilcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvbGlzdC9zd2l0Y2hcIilcclxuXHJcbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdFVybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCByZWNvcmRfaWQsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIC0+XHJcblx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgcmVjb3JkX2lkICsgXCIvXCIgKyByZWxhdGVkX29iamVjdF9uYW1lICsgXCIvZ3JpZFwiKVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMgPSAob2JqZWN0X25hbWUsIGlzX2RlZXAsIGlzX3NraXBfaGlkZSwgaXNfcmVsYXRlZCktPlxyXG5cdF9vcHRpb25zID0gW11cclxuXHR1bmxlc3Mgb2JqZWN0X25hbWVcclxuXHRcdHJldHVybiBfb3B0aW9uc1xyXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRmaWVsZHMgPSBfb2JqZWN0Py5maWVsZHNcclxuXHRpY29uID0gX29iamVjdD8uaWNvblxyXG5cdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XHJcblx0XHRpZiBpc19za2lwX2hpZGUgYW5kIGYuaGlkZGVuXHJcblx0XHRcdHJldHVyblxyXG5cdFx0aWYgZi50eXBlID09IFwic2VsZWN0XCJcclxuXHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IFwiI3tmLmxhYmVsIHx8IGt9XCIsIHZhbHVlOiBcIiN7a31cIiwgaWNvbjogaWNvbn1cclxuXHRcdGVsc2VcclxuXHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XHJcblx0aWYgaXNfZGVlcFxyXG5cdFx0Xy5mb3JFYWNoIGZpZWxkcywgKGYsIGspLT5cclxuXHRcdFx0aWYgaXNfc2tpcF9oaWRlIGFuZCBmLmhpZGRlblxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRpZiAoZi50eXBlID09IFwibG9va3VwXCIgfHwgZi50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKSAmJiBmLnJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKGYucmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdCMg5LiN5pSv5oyBZi5yZWZlcmVuY2VfdG/kuLpmdW5jdGlvbueahOaDheWGte+8jOaciemcgOaxguWGjeivtFxyXG5cdFx0XHRcdHJfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoZi5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0aWYgcl9vYmplY3RcclxuXHRcdFx0XHRcdF8uZm9yRWFjaCByX29iamVjdC5maWVsZHMsIChmMiwgazIpLT5cclxuXHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IFwiI3tmLmxhYmVsIHx8IGt9PT4je2YyLmxhYmVsIHx8IGsyfVwiLCB2YWx1ZTogXCIje2t9LiN7azJ9XCIsIGljb246IHJfb2JqZWN0Py5pY29ufVxyXG5cdGlmIGlzX3JlbGF0ZWRcclxuXHRcdHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSlcclxuXHRcdF8uZWFjaCByZWxhdGVkT2JqZWN0cywgKF9yZWxhdGVkT2JqZWN0KT0+XHJcblx0XHRcdHJlbGF0ZWRPcHRpb25zID0gQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMoX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UpXHJcblx0XHRcdHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSlcclxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRPcHRpb25zLCAocmVsYXRlZE9wdGlvbiktPlxyXG5cdFx0XHRcdGlmIF9yZWxhdGVkT2JqZWN0LmZvcmVpZ25fa2V5ICE9IHJlbGF0ZWRPcHRpb24udmFsdWVcclxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7cmVsYXRlZE9iamVjdC5sYWJlbCB8fCByZWxhdGVkT2JqZWN0Lm5hbWV9PT4je3JlbGF0ZWRPcHRpb24ubGFiZWx9XCIsIHZhbHVlOiBcIiN7cmVsYXRlZE9iamVjdC5uYW1lfS4je3JlbGF0ZWRPcHRpb24udmFsdWV9XCIsIGljb246IHJlbGF0ZWRPYmplY3Q/Lmljb259XHJcblx0cmV0dXJuIF9vcHRpb25zXHJcblxyXG4jIOe7n+S4gOS4uuWvueixoW9iamVjdF9uYW1l5o+Q5L6b5Y+v55So5LqO6L+H6JmR5Zmo6L+H6JmR5a2X5q61XHJcbkNyZWF0b3IuZ2V0T2JqZWN0RmlsdGVyRmllbGRPcHRpb25zID0gKG9iamVjdF9uYW1lKS0+XHJcblx0X29wdGlvbnMgPSBbXVxyXG5cdHVubGVzcyBvYmplY3RfbmFtZVxyXG5cdFx0cmV0dXJuIF9vcHRpb25zXHJcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xyXG5cdHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpXHJcblx0aWNvbiA9IF9vYmplY3Q/Lmljb25cclxuXHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxyXG5cdFx0IyBoaWRkZW4sZ3JpZOetieexu+Wei+eahOWtl+aute+8jOS4jemcgOimgei/h+a7pFxyXG5cdFx0aWYgIV8uaW5jbHVkZShbXCJncmlkXCIsXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwiYXZhdGFyXCIsIFwiaW1hZ2VcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSkgYW5kICFmLmhpZGRlblxyXG5cdFx0XHQjIGZpbHRlcnMuJC5maWVsZOWPimZsb3cuY3VycmVudOetieWtkOWtl+auteS5n+S4jemcgOimgei/h+a7pFxyXG5cdFx0XHRpZiAhL1xcdytcXC4vLnRlc3QoaykgYW5kIF8uaW5kZXhPZihwZXJtaXNzaW9uX2ZpZWxkcywgaykgPiAtMVxyXG5cdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBmLmxhYmVsIHx8IGssIHZhbHVlOiBrLCBpY29uOiBpY29ufVxyXG5cclxuXHRyZXR1cm4gX29wdGlvbnNcclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRPcHRpb25zID0gKG9iamVjdF9uYW1lKS0+XHJcblx0X29wdGlvbnMgPSBbXVxyXG5cdHVubGVzcyBvYmplY3RfbmFtZVxyXG5cdFx0cmV0dXJuIF9vcHRpb25zXHJcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xyXG5cdHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpXHJcblx0aWNvbiA9IF9vYmplY3Q/Lmljb25cclxuXHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxyXG5cdFx0aWYgIV8uaW5jbHVkZShbXCJncmlkXCIsXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwibWFya2Rvd25cIiwgXCJodG1sXCJdLCBmLnR5cGUpXHJcblx0XHRcdGlmICEvXFx3K1xcLi8udGVzdChrKSBhbmQgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xXHJcblx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XHJcblx0cmV0dXJuIF9vcHRpb25zXHJcblxyXG4jIyNcclxuZmlsdGVyczog6KaB6L2s5o2i55qEZmlsdGVyc1xyXG5maWVsZHM6IOWvueixoeWtl+autVxyXG5maWx0ZXJfZmllbGRzOiDpu5jorqTov4fmu6TlrZfmrrXvvIzmlK/mjIHlrZfnrKbkuLLmlbDnu4Tlkozlr7nosaHmlbDnu4TkuKTnp43moLzlvI/vvIzlpoI6WydmaWxlZF9uYW1lMScsJ2ZpbGVkX25hbWUyJ10sW3tmaWVsZDonZmlsZWRfbmFtZTEnLHJlcXVpcmVkOnRydWV9XVxyXG7lpITnkIbpgLvovpE6IOaKimZpbHRlcnPkuK3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25aKe5Yqg5q+P6aG555qEaXNfZGVmYXVsdOOAgWlzX3JlcXVpcmVk5bGe5oCn77yM5LiN5a2Y5Zyo5LqOZmlsdGVyX2ZpZWxkc+eahOi/h+a7pOadoeS7tuWvueW6lOeahOenu+mZpOavj+mhueeahOebuOWFs+WxnuaAp1xyXG7ov5Tlm57nu5Pmnpw6IOWkhOeQhuWQjueahGZpbHRlcnNcclxuIyMjXHJcbkNyZWF0b3IuZ2V0RmlsdGVyc1dpdGhGaWx0ZXJGaWVsZHMgPSAoZmlsdGVycywgZmllbGRzLCBmaWx0ZXJfZmllbGRzKS0+XHJcblx0dW5sZXNzIGZpbHRlcnNcclxuXHRcdGZpbHRlcnMgPSBbXVxyXG5cdHVubGVzcyBmaWx0ZXJfZmllbGRzXHJcblx0XHRmaWx0ZXJfZmllbGRzID0gW11cclxuXHRpZiBmaWx0ZXJfZmllbGRzPy5sZW5ndGhcclxuXHRcdGZpbHRlcl9maWVsZHMuZm9yRWFjaCAobiktPlxyXG5cdFx0XHRpZiBfLmlzU3RyaW5nKG4pXHJcblx0XHRcdFx0biA9IFxyXG5cdFx0XHRcdFx0ZmllbGQ6IG4sXHJcblx0XHRcdFx0XHRyZXF1aXJlZDogZmFsc2VcclxuXHRcdFx0aWYgZmllbGRzW24uZmllbGRdIGFuZCAhXy5maW5kV2hlcmUoZmlsdGVycyx7ZmllbGQ6bi5maWVsZH0pXHJcblx0XHRcdFx0ZmlsdGVycy5wdXNoXHJcblx0XHRcdFx0XHRmaWVsZDogbi5maWVsZCxcclxuXHRcdFx0XHRcdGlzX2RlZmF1bHQ6IHRydWUsXHJcblx0XHRcdFx0XHRpc19yZXF1aXJlZDogbi5yZXF1aXJlZFxyXG5cdGZpbHRlcnMuZm9yRWFjaCAoZmlsdGVySXRlbSktPlxyXG5cdFx0bWF0Y2hGaWVsZCA9IGZpbHRlcl9maWVsZHMuZmluZCAobiktPiByZXR1cm4gbiA9PSBmaWx0ZXJJdGVtLmZpZWxkIG9yIG4uZmllbGQgPT0gZmlsdGVySXRlbS5maWVsZFxyXG5cdFx0aWYgXy5pc1N0cmluZyhtYXRjaEZpZWxkKVxyXG5cdFx0XHRtYXRjaEZpZWxkID0gXHJcblx0XHRcdFx0ZmllbGQ6IG1hdGNoRmllbGQsXHJcblx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlXHJcblx0XHRpZiBtYXRjaEZpZWxkXHJcblx0XHRcdGZpbHRlckl0ZW0uaXNfZGVmYXVsdCA9IHRydWVcclxuXHRcdFx0ZmlsdGVySXRlbS5pc19yZXF1aXJlZCA9IG1hdGNoRmllbGQucmVxdWlyZWRcclxuXHRcdGVsc2VcclxuXHRcdFx0ZGVsZXRlIGZpbHRlckl0ZW0uaXNfZGVmYXVsdFxyXG5cdFx0XHRkZWxldGUgZmlsdGVySXRlbS5pc19yZXF1aXJlZFxyXG5cdHJldHVybiBmaWx0ZXJzXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpLT5cclxuXHJcblx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHJcblx0aWYgIXJlY29yZF9pZFxyXG5cdFx0cmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmIG9iamVjdF9uYW1lID09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikgJiYgIHJlY29yZF9pZCA9PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKVxyXG5cdFx0XHRpZiBUZW1wbGF0ZS5pbnN0YW5jZSgpPy5yZWNvcmRcclxuXHRcdFx0XHRyZXR1cm4gVGVtcGxhdGUuaW5zdGFuY2UoKT8ucmVjb3JkPy5nZXQoKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKVxyXG5cclxuXHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxyXG5cdGlmIGNvbGxlY3Rpb25cclxuXHRcdHJlY29yZCA9IGNvbGxlY3Rpb24uZmluZE9uZShyZWNvcmRfaWQpXHJcblx0XHRyZXR1cm4gcmVjb3JkXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZE5hbWUgPSAocmVjb3JkLCBvYmplY3RfbmFtZSktPlxyXG5cdHVubGVzcyByZWNvcmRcclxuXHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKClcclxuXHRpZiByZWNvcmRcclxuXHRcdCMg5pi+56S657uE57uH5YiX6KGo5pe277yM54m55q6K5aSE55CGbmFtZV9maWVsZF9rZXnkuLpuYW1l5a2X5q61XHJcblx0XHRuYW1lX2ZpZWxkX2tleSA9IGlmIG9iamVjdF9uYW1lID09IFwib3JnYW5pemF0aW9uc1wiIHRoZW4gXCJuYW1lXCIgZWxzZSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk/Lk5BTUVfRklFTERfS0VZXHJcblx0XHRpZiByZWNvcmQgYW5kIG5hbWVfZmllbGRfa2V5XHJcblx0XHRcdHJldHVybiByZWNvcmQubGFiZWwgfHwgcmVjb3JkW25hbWVfZmllbGRfa2V5XVxyXG5cclxuQ3JlYXRvci5nZXRBcHAgPSAoYXBwX2lkKS0+XHJcblx0aWYgIWFwcF9pZFxyXG5cdFx0YXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcclxuXHRhcHAgPSBDcmVhdG9yLkFwcHNbYXBwX2lkXVxyXG5cdENyZWF0b3IuZGVwcz8uYXBwPy5kZXBlbmQoKVxyXG5cdHJldHVybiBhcHBcclxuXHJcbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkID0gKGFwcF9pZCktPlxyXG5cdGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZClcclxuXHRpZiAhYXBwXHJcblx0XHRyZXR1cm5cclxuXHRkYXNoYm9hcmQgPSBudWxsXHJcblx0Xy5lYWNoIENyZWF0b3IuRGFzaGJvYXJkcywgKHYsIGspLT5cclxuXHRcdGlmIHYuYXBwcz8uaW5kZXhPZihhcHAuX2lkKSA+IC0xXHJcblx0XHRcdGRhc2hib2FyZCA9IHY7XHJcblx0cmV0dXJuIGRhc2hib2FyZDtcclxuXHJcbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkQ29tcG9uZW50ID0gKGFwcF9pZCktPlxyXG5cdGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZClcclxuXHRpZiAhYXBwXHJcblx0XHRyZXR1cm5cclxuXHRyZXR1cm4gUmVhY3RTdGVlZG9zLnBsdWdpbkNvbXBvbmVudFNlbGVjdG9yKFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLCBcIkRhc2hib2FyZFwiLCBhcHAuX2lkKTtcclxuXHJcbkNyZWF0b3IuZ2V0QXBwT2JqZWN0TmFtZXMgPSAoYXBwX2lkKS0+XHJcblx0YXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKVxyXG5cdGlmICFhcHBcclxuXHRcdHJldHVyblxyXG5cdGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0YXBwT2JqZWN0cyA9IGlmIGlzTW9iaWxlIHRoZW4gYXBwLm1vYmlsZV9vYmplY3RzIGVsc2UgYXBwLm9iamVjdHNcclxuXHRvYmplY3RzID0gW11cclxuXHRpZiBhcHBcclxuXHRcdF8uZWFjaCBhcHBPYmplY3RzLCAodiktPlxyXG5cdFx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdCh2KVxyXG5cdFx0XHRpZiBvYmo/LnBlcm1pc3Npb25zLmdldCgpLmFsbG93UmVhZFxyXG5cdFx0XHRcdG9iamVjdHMucHVzaCB2XHJcblx0cmV0dXJuIG9iamVjdHNcclxuXHJcbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHMgPSAoaW5jbHVkZUFkbWluKS0+XHJcblx0Y2hhbmdlQXBwID0gQ3JlYXRvci5fc3ViQXBwLmdldCgpO1xyXG5cdFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLmVudGl0aWVzLmFwcHMgPSBPYmplY3QuYXNzaWduKHt9LCBSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKS5lbnRpdGllcy5hcHBzLCB7YXBwczogY2hhbmdlQXBwfSk7XHJcblx0cmV0dXJuIFJlYWN0U3RlZWRvcy52aXNpYmxlQXBwc1NlbGVjdG9yKFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLCBpbmNsdWRlQWRtaW4pXHJcblxyXG5DcmVhdG9yLmdldFZpc2libGVBcHBzT2JqZWN0cyA9ICgpLT5cclxuXHRhcHBzID0gQ3JlYXRvci5nZXRWaXNpYmxlQXBwcygpXHJcblx0dmlzaWJsZU9iamVjdE5hbWVzID0gXy5mbGF0dGVuKF8ucGx1Y2soYXBwcywnb2JqZWN0cycpKVxyXG5cdG9iamVjdHMgPSBfLmZpbHRlciBDcmVhdG9yLk9iamVjdHMsIChvYmopLT5cclxuXHRcdGlmIHZpc2libGVPYmplY3ROYW1lcy5pbmRleE9mKG9iai5uYW1lKSA8IDBcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB0cnVlXHJcblx0b2JqZWN0cyA9IG9iamVjdHMuc29ydChDcmVhdG9yLnNvcnRpbmdNZXRob2QuYmluZCh7a2V5OlwibGFiZWxcIn0pKVxyXG5cdG9iamVjdHMgPSBfLnBsdWNrKG9iamVjdHMsJ25hbWUnKVxyXG5cdHJldHVybiBfLnVuaXEgb2JqZWN0c1xyXG5cclxuQ3JlYXRvci5nZXRBcHBzT2JqZWN0cyA9ICgpLT5cclxuXHRvYmplY3RzID0gW11cclxuXHR0ZW1wT2JqZWN0cyA9IFtdXHJcblx0Xy5mb3JFYWNoIENyZWF0b3IuQXBwcywgKGFwcCktPlxyXG5cdFx0dGVtcE9iamVjdHMgPSBfLmZpbHRlciBhcHAub2JqZWN0cywgKG9iaiktPlxyXG5cdFx0XHRyZXR1cm4gIW9iai5oaWRkZW5cclxuXHRcdG9iamVjdHMgPSBvYmplY3RzLmNvbmNhdCh0ZW1wT2JqZWN0cylcclxuXHRyZXR1cm4gXy51bmlxIG9iamVjdHNcclxuXHJcbkNyZWF0b3IudmFsaWRhdGVGaWx0ZXJzID0gKGZpbHRlcnMsIGxvZ2ljKS0+XHJcblx0ZmlsdGVyX2l0ZW1zID0gXy5tYXAgZmlsdGVycywgKG9iaikgLT5cclxuXHRcdGlmIF8uaXNFbXB0eShvYmopXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gb2JqXHJcblx0ZmlsdGVyX2l0ZW1zID0gXy5jb21wYWN0KGZpbHRlcl9pdGVtcylcclxuXHRlcnJvck1zZyA9IFwiXCJcclxuXHRmaWx0ZXJfbGVuZ3RoID0gZmlsdGVyX2l0ZW1zLmxlbmd0aFxyXG5cdGlmIGxvZ2ljXHJcblx0XHQjIOagvOW8j+WMlmZpbHRlclxyXG5cdFx0bG9naWMgPSBsb2dpYy5yZXBsYWNlKC9cXG4vZywgXCJcIikucmVwbGFjZSgvXFxzKy9nLCBcIiBcIilcclxuXHJcblx0XHQjIOWIpOaWreeJueauiuWtl+esplxyXG5cdFx0aWYgL1suX1xcLSErXSsvaWcudGVzdChsb2dpYylcclxuXHRcdFx0ZXJyb3JNc2cgPSBcIuWQq+acieeJueauiuWtl+espuOAglwiXHJcblxyXG5cdFx0aWYgIWVycm9yTXNnXHJcblx0XHRcdGluZGV4ID0gbG9naWMubWF0Y2goL1xcZCsvaWcpXHJcblx0XHRcdGlmICFpbmRleFxyXG5cdFx0XHRcdGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIlxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aW5kZXguZm9yRWFjaCAoaSktPlxyXG5cdFx0XHRcdFx0aWYgaSA8IDEgb3IgaSA+IGZpbHRlcl9sZW5ndGhcclxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieadoeS7tuW8leeUqOS6huacquWumuS5ieeahOetm+mAieWZqO+8miN7aX3jgIJcIlxyXG5cclxuXHRcdFx0XHRmbGFnID0gMVxyXG5cdFx0XHRcdHdoaWxlIGZsYWcgPD0gZmlsdGVyX2xlbmd0aFxyXG5cdFx0XHRcdFx0aWYgIWluZGV4LmluY2x1ZGVzKFwiI3tmbGFnfVwiKVxyXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCJcclxuXHRcdFx0XHRcdGZsYWcrKztcclxuXHJcblx0XHRpZiAhZXJyb3JNc2dcclxuXHRcdFx0IyDliKTmlq3mmK/lkKbmnInpnZ7ms5Xoi7HmloflrZfnrKZcclxuXHRcdFx0d29yZCA9IGxvZ2ljLm1hdGNoKC9bYS16QS1aXSsvaWcpXHJcblx0XHRcdGlmIHdvcmRcclxuXHRcdFx0XHR3b3JkLmZvckVhY2ggKHcpLT5cclxuXHRcdFx0XHRcdGlmICEvXihhbmR8b3IpJC9pZy50ZXN0KHcpXHJcblx0XHRcdFx0XHRcdGVycm9yTXNnID0gXCLmo4Dmn6XmgqjnmoTpq5jnuqfnrZvpgInmnaHku7bkuK3nmoTmi7zlhpnjgIJcIlxyXG5cclxuXHRcdGlmICFlcnJvck1zZ1xyXG5cdFx0XHQjIOWIpOaWreagvOW8j+aYr+WQpuato+ehrlxyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHRDcmVhdG9yLmV2YWwobG9naWMucmVwbGFjZSgvYW5kL2lnLCBcIiYmXCIpLnJlcGxhY2UoL29yL2lnLCBcInx8XCIpKVxyXG5cdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0ZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOS4reWQq+acieeJueauiuWtl+esplwiXHJcblxyXG5cdFx0XHRpZiAvKEFORClbXigpXSsoT1IpL2lnLnRlc3QobG9naWMpIHx8ICAvKE9SKVteKCldKyhBTkQpL2lnLnRlc3QobG9naWMpXHJcblx0XHRcdFx0ZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOW/hemhu+WcqOi/nue7reaAp+eahCBBTkQg5ZKMIE9SIOihqOi+vuW8j+WJjeWQjuS9v+eUqOaLrOWPt+OAglwiXHJcblx0aWYgZXJyb3JNc2dcclxuXHRcdGNvbnNvbGUubG9nIFwiZXJyb3JcIiwgZXJyb3JNc2dcclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHR0b2FzdHIuZXJyb3IoZXJyb3JNc2cpXHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuIyBcIj1cIiwgXCI8PlwiLCBcIj5cIiwgXCI+PVwiLCBcIjxcIiwgXCI8PVwiLCBcInN0YXJ0c3dpdGhcIiwgXCJjb250YWluc1wiLCBcIm5vdGNvbnRhaW5zXCIuXHJcbiMjI1xyXG5vcHRpb25z5Y+C5pWw77yaXHJcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXHJcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XHJcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxyXG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XHJcbiMjI1xyXG5DcmVhdG9yLmZvcm1hdEZpbHRlcnNUb01vbmdvID0gKGZpbHRlcnMsIG9wdGlvbnMpLT5cclxuXHR1bmxlc3MgZmlsdGVycz8ubGVuZ3RoXHJcblx0XHRyZXR1cm5cclxuXHQjIOW9k2ZpbHRlcnPkuI3mmK9bQXJyYXld57G75Z6L6ICM5pivW09iamVjdF3nsbvlnovml7bvvIzov5vooYzmoLzlvI/ovazmjaJcclxuXHR1bmxlc3MgZmlsdGVyc1swXSBpbnN0YW5jZW9mIEFycmF5XHJcblx0XHRmaWx0ZXJzID0gXy5tYXAgZmlsdGVycywgKG9iaiktPlxyXG5cdFx0XHRyZXR1cm4gW29iai5maWVsZCwgb2JqLm9wZXJhdGlvbiwgb2JqLnZhbHVlXVxyXG5cdHNlbGVjdG9yID0gW11cclxuXHRfLmVhY2ggZmlsdGVycywgKGZpbHRlciktPlxyXG5cdFx0ZmllbGQgPSBmaWx0ZXJbMF1cclxuXHRcdG9wdGlvbiA9IGZpbHRlclsxXVxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgbnVsbCwgb3B0aW9ucylcclxuXHRcdHN1Yl9zZWxlY3RvciA9IHt9XHJcblx0XHRzdWJfc2VsZWN0b3JbZmllbGRdID0ge31cclxuXHRcdGlmIG9wdGlvbiA9PSBcIj1cIlxyXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGVxXCJdID0gdmFsdWVcclxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPD5cIlxyXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJG5lXCJdID0gdmFsdWVcclxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPlwiXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RcIl0gPSB2YWx1ZVxyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI+PVwiXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RlXCJdID0gdmFsdWVcclxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPFwiXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRcIl0gPSB2YWx1ZVxyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8PVwiXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRlXCJdID0gdmFsdWVcclxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwic3RhcnRzd2l0aFwiXHJcblx0XHRcdHJlZyA9IG5ldyBSZWdFeHAoXCJeXCIgKyB2YWx1ZSwgXCJpXCIpXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWdcclxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiY29udGFpbnNcIlxyXG5cdFx0XHRyZWcgPSBuZXcgUmVnRXhwKHZhbHVlLCBcImlcIilcclxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZ1xyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCJub3Rjb250YWluc1wiXHJcblx0XHRcdHJlZyA9IG5ldyBSZWdFeHAoXCJeKCg/IVwiICsgdmFsdWUgKyBcIikuKSokXCIsIFwiaVwiKVxyXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnXHJcblx0XHRzZWxlY3Rvci5wdXNoIHN1Yl9zZWxlY3RvclxyXG5cdHJldHVybiBzZWxlY3RvclxyXG5cclxuQ3JlYXRvci5pc0JldHdlZW5GaWx0ZXJPcGVyYXRpb24gPSAob3BlcmF0aW9uKS0+XHJcblx0cmV0dXJuIG9wZXJhdGlvbiA9PSBcImJldHdlZW5cIiBvciAhIUNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKHRydWUpP1tvcGVyYXRpb25dXHJcblxyXG4jIyNcclxub3B0aW9uc+WPguaVsO+8mlxyXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxyXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xyXG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcclxuXHRleHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XHJcbiMjI1xyXG5DcmVhdG9yLmZvcm1hdEZpbHRlcnNUb0RldiA9IChmaWx0ZXJzLCBvYmplY3RfbmFtZSwgb3B0aW9ucyktPlxyXG5cdHN0ZWVkb3NGaWx0ZXJzID0gcmVxdWlyZShcIkBzdGVlZG9zL2ZpbHRlcnNcIik7XHJcblx0dW5sZXNzIGZpbHRlcnMubGVuZ3RoXHJcblx0XHRyZXR1cm5cclxuXHRpZiBvcHRpb25zPy5pc19sb2dpY19vclxyXG5cdFx0IyDlpoLmnpxpc19sb2dpY19vcuS4unRydWXvvIzkuLpmaWx0ZXJz56ys5LiA5bGC5YWD57Sg5aKe5Yqgb3Lpl7TpmpRcclxuXHRcdGxvZ2ljVGVtcEZpbHRlcnMgPSBbXVxyXG5cdFx0ZmlsdGVycy5mb3JFYWNoIChuKS0+XHJcblx0XHRcdGxvZ2ljVGVtcEZpbHRlcnMucHVzaChuKVxyXG5cdFx0XHRsb2dpY1RlbXBGaWx0ZXJzLnB1c2goXCJvclwiKVxyXG5cdFx0bG9naWNUZW1wRmlsdGVycy5wb3AoKVxyXG5cdFx0ZmlsdGVycyA9IGxvZ2ljVGVtcEZpbHRlcnNcclxuXHRzZWxlY3RvciA9IHN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb0RldihmaWx0ZXJzLCBDcmVhdG9yLlVTRVJfQ09OVEVYVClcclxuXHRyZXR1cm4gc2VsZWN0b3JcclxuXHJcbiMjI1xyXG5vcHRpb25z5Y+C5pWw77yaXHJcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXHJcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XHJcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxyXG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XHJcbiMjI1xyXG5DcmVhdG9yLmZvcm1hdExvZ2ljRmlsdGVyc1RvRGV2ID0gKGZpbHRlcnMsIGZpbHRlcl9sb2dpYywgb3B0aW9ucyktPlxyXG5cdGZvcm1hdF9sb2dpYyA9IGZpbHRlcl9sb2dpYy5yZXBsYWNlKC9cXChcXHMrL2lnLCBcIihcIikucmVwbGFjZSgvXFxzK1xcKS9pZywgXCIpXCIpLnJlcGxhY2UoL1xcKC9nLCBcIltcIikucmVwbGFjZSgvXFwpL2csIFwiXVwiKS5yZXBsYWNlKC9cXHMrL2csIFwiLFwiKS5yZXBsYWNlKC8oYW5kfG9yKS9pZywgXCInJDEnXCIpXHJcblx0Zm9ybWF0X2xvZ2ljID0gZm9ybWF0X2xvZ2ljLnJlcGxhY2UoLyhcXGQpKy9pZywgKHgpLT5cclxuXHRcdF9mID0gZmlsdGVyc1t4LTFdXHJcblx0XHRmaWVsZCA9IF9mLmZpZWxkXHJcblx0XHRvcHRpb24gPSBfZi5vcGVyYXRpb25cclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlLCBudWxsLCBvcHRpb25zKVxyXG5cdFx0c3ViX3NlbGVjdG9yID0gW11cclxuXHRcdGlmIF8uaXNBcnJheSh2YWx1ZSkgPT0gdHJ1ZVxyXG5cdFx0XHRpZiBvcHRpb24gPT0gXCI9XCJcclxuXHRcdFx0XHRfLmVhY2ggdmFsdWUsICh2KS0+XHJcblx0XHRcdFx0XHRzdWJfc2VsZWN0b3IucHVzaCBbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIlxyXG5cdFx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIjw+XCJcclxuXHRcdFx0XHRfLmVhY2ggdmFsdWUsICh2KS0+XHJcblx0XHRcdFx0XHRzdWJfc2VsZWN0b3IucHVzaCBbZmllbGQsIG9wdGlvbiwgdl0sIFwiYW5kXCJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdF8uZWFjaCB2YWx1ZSwgKHYpLT5cclxuXHRcdFx0XHRcdHN1Yl9zZWxlY3Rvci5wdXNoIFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiXHJcblx0XHRcdGlmIHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT0gXCJhbmRcIiB8fCBzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09IFwib3JcIlxyXG5cdFx0XHRcdHN1Yl9zZWxlY3Rvci5wb3AoKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRzdWJfc2VsZWN0b3IgPSBbZmllbGQsIG9wdGlvbiwgdmFsdWVdXHJcblx0XHRjb25zb2xlLmxvZyBcInN1Yl9zZWxlY3RvclwiLCBzdWJfc2VsZWN0b3JcclxuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShzdWJfc2VsZWN0b3IpXHJcblx0KVxyXG5cdGZvcm1hdF9sb2dpYyA9IFwiWyN7Zm9ybWF0X2xvZ2ljfV1cIlxyXG5cdHJldHVybiBDcmVhdG9yLmV2YWwoZm9ybWF0X2xvZ2ljKVxyXG5cclxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cclxuXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdXHJcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cclxuXHRpZiAhX29iamVjdFxyXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzXHJcblxyXG4jXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soX29iamVjdC5yZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxyXG5cclxuXHRyZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKF9vYmplY3QuX2NvbGxlY3Rpb25fbmFtZSlcclxuXHJcblx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cyxcIm9iamVjdF9uYW1lXCIpXHJcblx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZXM/Lmxlbmd0aCA9PSAwXHJcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXNcclxuXHJcblx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXHJcblx0dW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cclxuXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZSByZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHNcclxuXHRyZXR1cm4gXy5maWx0ZXIgcmVsYXRlZF9vYmplY3RzLCAocmVsYXRlZF9vYmplY3QpLT5cclxuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdC5vYmplY3RfbmFtZVxyXG5cdFx0aXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTFcclxuXHRcdGFsbG93UmVhZCA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8uYWxsb3dSZWFkXHJcblx0XHRyZXR1cm4gaXNBY3RpdmUgYW5kIGFsbG93UmVhZFxyXG5cclxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0TmFtZXMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxyXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcclxuXHRyZXR1cm4gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxyXG5cclxuQ3JlYXRvci5nZXRBY3Rpb25zID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblxyXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cclxuXHRpZiAhb2JqXHJcblx0XHRyZXR1cm5cclxuXHJcblx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXHJcblx0ZGlzYWJsZWRfYWN0aW9ucyA9IHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnNcclxuXHRhY3Rpb25zID0gXy5zb3J0QnkoXy52YWx1ZXMob2JqLmFjdGlvbnMpICwgJ3NvcnQnKTtcclxuXHJcblx0aWYgXy5oYXMob2JqLCAnYWxsb3dfY3VzdG9tQWN0aW9ucycpXHJcblx0XHRhY3Rpb25zID0gXy5maWx0ZXIgYWN0aW9ucywgKGFjdGlvbiktPlxyXG5cdFx0XHRyZXR1cm4gXy5pbmNsdWRlKG9iai5hbGxvd19jdXN0b21BY3Rpb25zLCBhY3Rpb24ubmFtZSkgfHwgXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLmdldE9iamVjdCgnYmFzZScpLmFjdGlvbnMpIHx8IHt9LCBhY3Rpb24ubmFtZSlcclxuXHRpZiBfLmhhcyhvYmosICdleGNsdWRlX2FjdGlvbnMnKVxyXG5cdFx0YWN0aW9ucyA9IF8uZmlsdGVyIGFjdGlvbnMsIChhY3Rpb24pLT5cclxuXHRcdFx0cmV0dXJuICFfLmluY2x1ZGUob2JqLmV4Y2x1ZGVfYWN0aW9ucywgYWN0aW9uLm5hbWUpXHJcblxyXG5cdF8uZWFjaCBhY3Rpb25zLCAoYWN0aW9uKS0+XHJcblx0XHQjIOaJi+acuuS4iuWPquaYvuekuue8lui+keaMiemSru+8jOWFtuS7lueahOaUvuWIsOaKmOWPoOS4i+aLieiPnOWNleS4rVxyXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcInJlY29yZFwiLCBcInJlY29yZF9vbmx5XCJdLmluZGV4T2YoYWN0aW9uLm9uKSA+IC0xICYmIGFjdGlvbi5uYW1lICE9ICdzdGFuZGFyZF9lZGl0J1xyXG5cdFx0XHRpZiBhY3Rpb24ub24gPT0gXCJyZWNvcmRfb25seVwiXHJcblx0XHRcdFx0YWN0aW9uLm9uID0gJ3JlY29yZF9vbmx5X21vcmUnXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRhY3Rpb24ub24gPSAncmVjb3JkX21vcmUnXHJcblxyXG5cdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJjbXNfZmlsZXNcIiwgXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXS5pbmRleE9mKG9iamVjdF9uYW1lKSA+IC0xXHJcblx0XHQjIOmZhOS7tueJueauiuWkhOeQhu+8jOS4i+i9veaMiemSruaUvuWcqOS4u+iPnOWNle+8jOe8lui+keaMiemSruaUvuWIsOW6leS4i+aKmOWPoOS4i+aLieiPnOWNleS4rVxyXG5cdFx0YWN0aW9ucy5maW5kKChuKS0+IHJldHVybiBuLm5hbWUgPT0gXCJzdGFuZGFyZF9lZGl0XCIpPy5vbiA9IFwicmVjb3JkX21vcmVcIlxyXG5cdFx0YWN0aW9ucy5maW5kKChuKS0+IHJldHVybiBuLm5hbWUgPT0gXCJkb3dubG9hZFwiKT8ub24gPSBcInJlY29yZFwiXHJcblxyXG5cdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XHJcblx0XHRyZXR1cm4gXy5pbmRleE9mKGRpc2FibGVkX2FjdGlvbnMsIGFjdGlvbi5uYW1lKSA8IDBcclxuXHJcblx0cmV0dXJuIGFjdGlvbnNcclxuXHJcbi8vL1xyXG5cdOi/lOWbnuW9k+WJjeeUqOaIt+acieadg+mZkOiuv+mXrueahOaJgOaciWxpc3Rfdmlld++8jOWMheaLrOWIhuS6q+eahO+8jOeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahO+8iOmZpOmdnm93bmVy5Y+Y5LqG77yJ77yM5Lul5Y+K6buY6K6k55qE5YW25LuW6KeG5Zu+XHJcblx05rOo5oSPQ3JlYXRvci5nZXRQZXJtaXNzaW9uc+WHveaVsOS4reaYr+S4jeS8muacieeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahOinhuWbvueahO+8jOaJgOS7pUNyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mi7/liLDnmoTnu5PmnpzkuI3lhajvvIzlubbkuI3mmK/lvZPliY3nlKjmiLfog73nnIvliLDmiYDmnInop4blm75cclxuLy8vXHJcbkNyZWF0b3IuZ2V0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHJcblx0dW5sZXNzIG9iamVjdF9uYW1lXHJcblx0XHRyZXR1cm5cclxuXHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblxyXG5cdGlmICFvYmplY3RcclxuXHRcdHJldHVyblxyXG5cclxuXHRkaXNhYmxlZF9saXN0X3ZpZXdzID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8uZGlzYWJsZWRfbGlzdF92aWV3cyB8fCBbXVxyXG5cclxuXHRsaXN0X3ZpZXdzID0gW11cclxuXHJcblx0aXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHJcblx0Xy5lYWNoIG9iamVjdC5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0XHRpZiBpc01vYmlsZSBhbmQgaXRlbS50eXBlID09IFwiY2FsZW5kYXJcIlxyXG5cdFx0XHQjIOaJi+acuuS4iuWFiOS4jeaYvuekuuaXpeWOhuinhuWbvlxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdGlmIGl0ZW1fbmFtZSAhPSBcImRlZmF1bHRcIlxyXG5cdFx0XHRpZiBfLmluZGV4T2YoZGlzYWJsZWRfbGlzdF92aWV3cywgaXRlbV9uYW1lKSA8IDAgfHwgaXRlbS5vd25lciA9PSB1c2VySWRcclxuXHRcdFx0XHRsaXN0X3ZpZXdzLnB1c2ggaXRlbVxyXG5cclxuXHRyZXR1cm4gbGlzdF92aWV3c1xyXG5cclxuIyDliY3lj7DnkIborrrkuIrkuI3lupTor6XosIPnlKjor6Xlh73mlbDvvIzlm6DkuLrlrZfmrrXnmoTmnYPpmZDpg73lnKhDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZmllbGRz55qE55u45YWz5bGe5oCn5Lit5pyJ5qCH6K+G5LqGXHJcbkNyZWF0b3IuZ2V0RmllbGRzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblxyXG5cdGZpZWxkc05hbWUgPSBDcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUob2JqZWN0X25hbWUpXHJcblx0dW5yZWFkYWJsZV9maWVsZHMgPSAgQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8udW5yZWFkYWJsZV9maWVsZHNcclxuXHRyZXR1cm4gXy5kaWZmZXJlbmNlKGZpZWxkc05hbWUsIHVucmVhZGFibGVfZmllbGRzKVxyXG5cclxuQ3JlYXRvci5pc2xvYWRpbmcgPSAoKS0+XHJcblx0cmV0dXJuICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZC5nZXQoKVxyXG5cclxuQ3JlYXRvci5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IChzdHIpLT5cclxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpXHJcblxyXG4jIOiuoeeul2ZpZWxkc+ebuOWFs+WHveaVsFxyXG4jIFNUQVJUXHJcbkNyZWF0b3IuZ2V0RGlzYWJsZWRGaWVsZHMgPSAoc2NoZW1hKS0+XHJcblx0ZmllbGRzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQsIGZpZWxkTmFtZSkgLT5cclxuXHRcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0uZGlzYWJsZWQgYW5kICFmaWVsZC5hdXRvZm9ybS5vbWl0IGFuZCBmaWVsZE5hbWVcclxuXHQpXHJcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcclxuXHRyZXR1cm4gZmllbGRzXHJcblxyXG5DcmVhdG9yLmdldEhpZGRlbkZpZWxkcyA9IChzY2hlbWEpLT5cclxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxyXG5cdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS50eXBlID09IFwiaGlkZGVuXCIgYW5kICFmaWVsZC5hdXRvZm9ybS5vbWl0IGFuZCBmaWVsZE5hbWVcclxuXHQpXHJcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcclxuXHRyZXR1cm4gZmllbGRzXHJcblxyXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhOb0dyb3VwID0gKHNjaGVtYSktPlxyXG5cdGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkLCBmaWVsZE5hbWUpIC0+XHJcblx0XHRyZXR1cm4gKCFmaWVsZC5hdXRvZm9ybSBvciAhZmllbGQuYXV0b2Zvcm0uZ3JvdXAgb3IgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT0gXCItXCIpIGFuZCAoIWZpZWxkLmF1dG9mb3JtIG9yIGZpZWxkLmF1dG9mb3JtLnR5cGUgIT0gXCJoaWRkZW5cIikgYW5kIGZpZWxkTmFtZVxyXG5cdClcclxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxyXG5cdHJldHVybiBmaWVsZHNcclxuXHJcbkNyZWF0b3IuZ2V0U29ydGVkRmllbGRHcm91cE5hbWVzID0gKHNjaGVtYSktPlxyXG5cdG5hbWVzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQpIC0+XHJcbiBcdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS5ncm91cCAhPSBcIi1cIiBhbmQgZmllbGQuYXV0b2Zvcm0uZ3JvdXBcclxuXHQpXHJcblx0bmFtZXMgPSBfLmNvbXBhY3QobmFtZXMpXHJcblx0bmFtZXMgPSBfLnVuaXF1ZShuYW1lcylcclxuXHRyZXR1cm4gbmFtZXNcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRzRm9yR3JvdXAgPSAoc2NoZW1hLCBncm91cE5hbWUpIC0+XHJcbiAgXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxyXG4gICAgXHRyZXR1cm4gZmllbGQuYXV0b2Zvcm0gYW5kIGZpZWxkLmF1dG9mb3JtLmdyb3VwID09IGdyb3VwTmFtZSBhbmQgZmllbGQuYXV0b2Zvcm0udHlwZSAhPSBcImhpZGRlblwiIGFuZCBmaWVsZE5hbWVcclxuICBcdClcclxuICBcdGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpXHJcbiAgXHRyZXR1cm4gZmllbGRzXHJcblxyXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRPbWl0ID0gKHNjaGVtYSwga2V5cykgLT5cclxuXHRrZXlzID0gXy5tYXAoa2V5cywgKGtleSkgLT5cclxuXHRcdGZpZWxkID0gXy5waWNrKHNjaGVtYSwga2V5KVxyXG5cdFx0aWYgZmllbGRba2V5XS5hdXRvZm9ybT8ub21pdFxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIGtleVxyXG5cdClcclxuXHRrZXlzID0gXy5jb21wYWN0KGtleXMpXHJcblx0cmV0dXJuIGtleXNcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRzSW5GaXJzdExldmVsID0gKGZpcnN0TGV2ZWxLZXlzLCBrZXlzKSAtPlxyXG5cdGtleXMgPSBfLm1hcChrZXlzLCAoa2V5KSAtPlxyXG5cdFx0aWYgXy5pbmRleE9mKGZpcnN0TGV2ZWxLZXlzLCBrZXkpID4gLTFcclxuXHRcdFx0cmV0dXJuIGtleVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHQpXHJcblx0a2V5cyA9IF8uY29tcGFjdChrZXlzKVxyXG5cdHJldHVybiBrZXlzXHJcblxyXG5DcmVhdG9yLmdldEZpZWxkc0ZvclJlb3JkZXIgPSAoc2NoZW1hLCBrZXlzLCBpc1NpbmdsZSkgLT5cclxuXHRmaWVsZHMgPSBbXVxyXG5cdGkgPSAwXHJcblx0X2tleXMgPSBfLmZpbHRlcihrZXlzLCAoa2V5KS0+XHJcblx0XHRyZXR1cm4gIWtleS5lbmRzV2l0aCgnX2VuZExpbmUnKVxyXG5cdCk7XHJcblx0d2hpbGUgaSA8IF9rZXlzLmxlbmd0aFxyXG5cdFx0c2NfMSA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2ldKVxyXG5cdFx0c2NfMiA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2krMV0pXHJcblxyXG5cdFx0aXNfd2lkZV8xID0gZmFsc2VcclxuXHRcdGlzX3dpZGVfMiA9IGZhbHNlXHJcblxyXG4jXHRcdGlzX3JhbmdlXzEgPSBmYWxzZVxyXG4jXHRcdGlzX3JhbmdlXzIgPSBmYWxzZVxyXG5cclxuXHRcdF8uZWFjaCBzY18xLCAodmFsdWUpIC0+XHJcblx0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc193aWRlIHx8IHZhbHVlLmF1dG9mb3JtPy50eXBlID09IFwidGFibGVcIlxyXG5cdFx0XHRcdGlzX3dpZGVfMSA9IHRydWVcclxuXHJcbiNcdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfcmFuZ2VcclxuI1x0XHRcdFx0aXNfcmFuZ2VfMSA9IHRydWVcclxuXHJcblx0XHRfLmVhY2ggc2NfMiwgKHZhbHVlKSAtPlxyXG5cdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfd2lkZSB8fCB2YWx1ZS5hdXRvZm9ybT8udHlwZSA9PSBcInRhYmxlXCJcclxuXHRcdFx0XHRpc193aWRlXzIgPSB0cnVlXHJcblxyXG4jXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3JhbmdlXHJcbiNcdFx0XHRcdGlzX3JhbmdlXzIgPSB0cnVlXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdGlzX3dpZGVfMSA9IHRydWVcclxuXHRcdFx0aXNfd2lkZV8yID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGlzU2luZ2xlXHJcblx0XHRcdGZpZWxkcy5wdXNoIF9rZXlzLnNsaWNlKGksIGkrMSlcclxuXHRcdFx0aSArPSAxXHJcblx0XHRlbHNlXHJcbiNcdFx0XHRpZiAhaXNfcmFuZ2VfMSAmJiBpc19yYW5nZV8yXHJcbiNcdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcclxuI1x0XHRcdFx0Y2hpbGRLZXlzLnB1c2ggdW5kZWZpbmVkXHJcbiNcdFx0XHRcdGZpZWxkcy5wdXNoIGNoaWxkS2V5c1xyXG4jXHRcdFx0XHRpICs9IDFcclxuI1x0XHRcdGVsc2VcclxuXHRcdFx0aWYgaXNfd2lkZV8xXHJcblx0XHRcdFx0ZmllbGRzLnB1c2ggX2tleXMuc2xpY2UoaSwgaSsxKVxyXG5cdFx0XHRcdGkgKz0gMVxyXG5cdFx0XHRlbHNlIGlmICFpc193aWRlXzEgYW5kIGlzX3dpZGVfMlxyXG5cdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcclxuXHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcclxuXHRcdFx0XHRmaWVsZHMucHVzaCBjaGlsZEtleXNcclxuXHRcdFx0XHRpICs9IDFcclxuXHRcdFx0ZWxzZSBpZiAhaXNfd2lkZV8xIGFuZCAhaXNfd2lkZV8yXHJcblx0XHRcdFx0Y2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSsxKVxyXG5cdFx0XHRcdGlmIF9rZXlzW2krMV1cclxuXHRcdFx0XHRcdGNoaWxkS2V5cy5wdXNoIF9rZXlzW2krMV1cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcclxuXHRcdFx0XHRmaWVsZHMucHVzaCBjaGlsZEtleXNcclxuXHRcdFx0XHRpICs9IDJcclxuXHJcblx0cmV0dXJuIGZpZWxkc1xyXG5cclxuQ3JlYXRvci5pc0ZpbHRlclZhbHVlRW1wdHkgPSAodikgLT5cclxuXHRyZXR1cm4gdHlwZW9mIHYgPT0gXCJ1bmRlZmluZWRcIiB8fCB2ID09IG51bGwgfHwgTnVtYmVyLmlzTmFOKHYpIHx8IHYubGVuZ3RoID09IDBcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGREYXRhVHlwZSA9IChvYmplY3RGaWVsZHMsIGtleSktPlxyXG5cdGlmIG9iamVjdEZpZWxkcyBhbmQga2V5XHJcblx0XHRyZXN1bHQgPSBvYmplY3RGaWVsZHNba2V5XT8udHlwZVxyXG5cdFx0aWYgW1wiZm9ybXVsYVwiLCBcInN1bW1hcnlcIl0uaW5kZXhPZihyZXN1bHQpID4gLTFcclxuXHRcdFx0cmVzdWx0ID0gb2JqZWN0RmllbGRzW2tleV0uZGF0YV90eXBlXHJcblx0XHRyZXR1cm4gcmVzdWx0XHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuIFwidGV4dFwiXHJcblxyXG4jIEVORFxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0Q3JlYXRvci5nZXRBbGxSZWxhdGVkT2JqZWN0cyA9IChvYmplY3RfbmFtZSktPlxyXG5cdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBbXVxyXG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XHJcblx0XHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cclxuXHRcdFx0XHRpZiByZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PSBvYmplY3RfbmFtZVxyXG5cdFx0XHRcdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMucHVzaCByZWxhdGVkX29iamVjdF9uYW1lXHJcblxyXG5cdFx0aWYgQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpLmVuYWJsZV9maWxlc1xyXG5cdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoIFwiY21zX2ZpbGVzXCJcclxuXHJcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXNcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFN0ZWVkb3MuZm9ybWF0SW5kZXggPSAoYXJyYXkpIC0+XHJcblx0XHRvYmplY3QgPSB7XHJcbiAgICAgICAgXHRiYWNrZ3JvdW5kOiB0cnVlXHJcbiAgICBcdH07XHJcblx0XHRpc2RvY3VtZW50REIgPSBNZXRlb3Iuc2V0dGluZ3M/LmRhdGFzb3VyY2VzPy5kZWZhdWx0Py5kb2N1bWVudERCIHx8IGZhbHNlO1xyXG5cdFx0aWYgaXNkb2N1bWVudERCXHJcblx0XHRcdGlmIGFycmF5Lmxlbmd0aCA+IDBcclxuXHRcdFx0XHRpbmRleE5hbWUgPSBhcnJheS5qb2luKFwiLlwiKTtcclxuXHRcdFx0XHRvYmplY3QubmFtZSA9IGluZGV4TmFtZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAoaW5kZXhOYW1lLmxlbmd0aCA+IDUyKVxyXG5cdFx0XHRcdFx0b2JqZWN0Lm5hbWUgPSBpbmRleE5hbWUuc3Vic3RyaW5nKDAsNTIpO1xyXG5cclxuXHRcdHJldHVybiBvYmplY3Q7IiwiQ3JlYXRvci5nZXRTY2hlbWEgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5zY2hlbWEgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcmV0dXJuIFJlYWN0U3RlZWRvcy5wbHVnaW5Db21wb25lbnRTZWxlY3RvcihSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKSwgXCJPYmplY3RIb21lXCIsIG9iamVjdF9uYW1lKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIHtcbiAgdmFyIGxpc3RfdmlldywgbGlzdF92aWV3X2lkO1xuICBpZiAoIWFwcF9pZCkge1xuICAgIGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICB9XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgbGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbCk7XG4gIGxpc3Rfdmlld19pZCA9IGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Ll9pZCA6IHZvaWQgMDtcbiAgaWYgKHJlY29yZF9pZCkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkX2lkKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwibWVldGluZ1wiKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoQ3JlYXRvci5nZXRPYmplY3RIb21lQ29tcG9uZW50KG9iamVjdF9uYW1lKSkge1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0QWJzb2x1dGVVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIHtcbiAgdmFyIGxpc3RfdmlldywgbGlzdF92aWV3X2lkO1xuICBpZiAoIWFwcF9pZCkge1xuICAgIGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICB9XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgbGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbCk7XG4gIGxpc3Rfdmlld19pZCA9IGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Ll9pZCA6IHZvaWQgMDtcbiAgaWYgKHJlY29yZF9pZCkge1xuICAgIHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkX2lkLCB0cnVlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwibWVldGluZ1wiKSB7XG4gICAgICByZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCIsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCwgdHJ1ZSk7XG4gICAgfVxuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJvdXRlclVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkge1xuICB2YXIgbGlzdF92aWV3LCBsaXN0X3ZpZXdfaWQ7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKTtcbiAgbGlzdF92aWV3X2lkID0gbGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcuX2lkIDogdm9pZCAwO1xuICBpZiAocmVjb3JkX2lkKSB7XG4gICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkX2lkO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJtZWV0aW5nXCIpIHtcbiAgICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZDtcbiAgICB9XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIHtcbiAgdmFyIHVybDtcbiAgdXJsID0gQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCk7XG4gIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKHVybCk7XG59O1xuXG5DcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIHtcbiAgaWYgKGxpc3Rfdmlld19pZCA9PT0gXCJjYWxlbmRhclwiKSB7XG4gICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0U3dpdGNoTGlzdFVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkge1xuICBpZiAobGlzdF92aWV3X2lkKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgbGlzdF92aWV3X2lkICsgXCIvbGlzdFwiKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvbGlzdC9zd2l0Y2hcIik7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdFVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIHJlY29yZF9pZCwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyByZWNvcmRfaWQgKyBcIi9cIiArIHJlbGF0ZWRfb2JqZWN0X25hbWUgKyBcIi9ncmlkXCIpO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgaXNfZGVlcCwgaXNfc2tpcF9oaWRlLCBpc19yZWxhdGVkKSB7XG4gIHZhciBfb2JqZWN0LCBfb3B0aW9ucywgZmllbGRzLCBpY29uLCByZWxhdGVkT2JqZWN0cztcbiAgX29wdGlvbnMgPSBbXTtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfb3B0aW9ucztcbiAgfVxuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgaWNvbiA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMDtcbiAgXy5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZiwgaykge1xuICAgIGlmIChpc19za2lwX2hpZGUgJiYgZi5oaWRkZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGYudHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICBsYWJlbDogXCJcIiArIChmLmxhYmVsIHx8IGspLFxuICAgICAgICB2YWx1ZTogXCJcIiArIGssXG4gICAgICAgIGljb246IGljb25cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgIGxhYmVsOiBmLmxhYmVsIHx8IGssXG4gICAgICAgIHZhbHVlOiBrLFxuICAgICAgICBpY29uOiBpY29uXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBpZiAoaXNfZGVlcCkge1xuICAgIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICAgIHZhciByX29iamVjdDtcbiAgICAgIGlmIChpc19za2lwX2hpZGUgJiYgZi5oaWRkZW4pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKChmLnR5cGUgPT09IFwibG9va3VwXCIgfHwgZi50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikgJiYgZi5yZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhmLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgcl9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChmLnJlZmVyZW5jZV90byk7XG4gICAgICAgIGlmIChyX29iamVjdCkge1xuICAgICAgICAgIHJldHVybiBfLmZvckVhY2gocl9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihmMiwgazIpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgbGFiZWw6IChmLmxhYmVsIHx8IGspICsgXCI9PlwiICsgKGYyLmxhYmVsIHx8IGsyKSxcbiAgICAgICAgICAgICAgdmFsdWU6IGsgKyBcIi5cIiArIGsyLFxuICAgICAgICAgICAgICBpY29uOiByX29iamVjdCAhPSBudWxsID8gcl9vYmplY3QuaWNvbiA6IHZvaWQgMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpZiAoaXNfcmVsYXRlZCkge1xuICAgIHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSk7XG4gICAgXy5lYWNoKHJlbGF0ZWRPYmplY3RzLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihfcmVsYXRlZE9iamVjdCkge1xuICAgICAgICB2YXIgcmVsYXRlZE9iamVjdCwgcmVsYXRlZE9wdGlvbnM7XG4gICAgICAgIHJlbGF0ZWRPcHRpb25zID0gQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMoX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICByZWxhdGVkT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUpO1xuICAgICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRPcHRpb25zLCBmdW5jdGlvbihyZWxhdGVkT3B0aW9uKSB7XG4gICAgICAgICAgaWYgKF9yZWxhdGVkT2JqZWN0LmZvcmVpZ25fa2V5ICE9PSByZWxhdGVkT3B0aW9uLnZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiAocmVsYXRlZE9iamVjdC5sYWJlbCB8fCByZWxhdGVkT2JqZWN0Lm5hbWUpICsgXCI9PlwiICsgcmVsYXRlZE9wdGlvbi5sYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHJlbGF0ZWRPYmplY3QubmFtZSArIFwiLlwiICsgcmVsYXRlZE9wdGlvbi52YWx1ZSxcbiAgICAgICAgICAgICAgaWNvbjogcmVsYXRlZE9iamVjdCAhPSBudWxsID8gcmVsYXRlZE9iamVjdC5pY29uIDogdm9pZCAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH1cbiAgcmV0dXJuIF9vcHRpb25zO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RGaWx0ZXJGaWVsZE9wdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgX29wdGlvbnMsIGZpZWxkcywgaWNvbiwgcGVybWlzc2lvbl9maWVsZHM7XG4gIF9vcHRpb25zID0gW107XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gX29wdGlvbnM7XG4gIH1cbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpO1xuICBpY29uID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwO1xuICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgaWYgKCFfLmluY2x1ZGUoW1wiZ3JpZFwiLCBcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJhdmF0YXJcIiwgXCJpbWFnZVwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKSAmJiAhZi5oaWRkZW4pIHtcbiAgICAgIGlmICghL1xcdytcXC4vLnRlc3QoaykgJiYgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICBsYWJlbDogZi5sYWJlbCB8fCBrLFxuICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgIGljb246IGljb25cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIF9vcHRpb25zO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZE9wdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgX29wdGlvbnMsIGZpZWxkcywgaWNvbiwgcGVybWlzc2lvbl9maWVsZHM7XG4gIF9vcHRpb25zID0gW107XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gX29wdGlvbnM7XG4gIH1cbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpO1xuICBpY29uID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwO1xuICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgaWYgKCFfLmluY2x1ZGUoW1wiZ3JpZFwiLCBcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSkpIHtcbiAgICAgIGlmICghL1xcdytcXC4vLnRlc3QoaykgJiYgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICBsYWJlbDogZi5sYWJlbCB8fCBrLFxuICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgIGljb246IGljb25cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIF9vcHRpb25zO1xufTtcblxuXG4vKlxuZmlsdGVyczog6KaB6L2s5o2i55qEZmlsdGVyc1xuZmllbGRzOiDlr7nosaHlrZfmrrVcbmZpbHRlcl9maWVsZHM6IOm7mOiupOi/h+a7pOWtl+aute+8jOaUr+aMgeWtl+espuS4suaVsOe7hOWSjOWvueixoeaVsOe7hOS4pOenjeagvOW8j++8jOWmgjpbJ2ZpbGVkX25hbWUxJywnZmlsZWRfbmFtZTInXSxbe2ZpZWxkOidmaWxlZF9uYW1lMScscmVxdWlyZWQ6dHJ1ZX1dXG7lpITnkIbpgLvovpE6IOaKimZpbHRlcnPkuK3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25aKe5Yqg5q+P6aG555qEaXNfZGVmYXVsdOOAgWlzX3JlcXVpcmVk5bGe5oCn77yM5LiN5a2Y5Zyo5LqOZmlsdGVyX2ZpZWxkc+eahOi/h+a7pOadoeS7tuWvueW6lOeahOenu+mZpOavj+mhueeahOebuOWFs+WxnuaAp1xu6L+U5Zue57uT5p6cOiDlpITnkIblkI7nmoRmaWx0ZXJzXG4gKi9cblxuQ3JlYXRvci5nZXRGaWx0ZXJzV2l0aEZpbHRlckZpZWxkcyA9IGZ1bmN0aW9uKGZpbHRlcnMsIGZpZWxkcywgZmlsdGVyX2ZpZWxkcykge1xuICBpZiAoIWZpbHRlcnMpIHtcbiAgICBmaWx0ZXJzID0gW107XG4gIH1cbiAgaWYgKCFmaWx0ZXJfZmllbGRzKSB7XG4gICAgZmlsdGVyX2ZpZWxkcyA9IFtdO1xuICB9XG4gIGlmIChmaWx0ZXJfZmllbGRzICE9IG51bGwgPyBmaWx0ZXJfZmllbGRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgIGZpbHRlcl9maWVsZHMuZm9yRWFjaChmdW5jdGlvbihuKSB7XG4gICAgICBpZiAoXy5pc1N0cmluZyhuKSkge1xuICAgICAgICBuID0ge1xuICAgICAgICAgIGZpZWxkOiBuLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKGZpZWxkc1tuLmZpZWxkXSAmJiAhXy5maW5kV2hlcmUoZmlsdGVycywge1xuICAgICAgICBmaWVsZDogbi5maWVsZFxuICAgICAgfSkpIHtcbiAgICAgICAgcmV0dXJuIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgZmllbGQ6IG4uZmllbGQsXG4gICAgICAgICAgaXNfZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICBpc19yZXF1aXJlZDogbi5yZXF1aXJlZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBmaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24oZmlsdGVySXRlbSkge1xuICAgIHZhciBtYXRjaEZpZWxkO1xuICAgIG1hdGNoRmllbGQgPSBmaWx0ZXJfZmllbGRzLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4gPT09IGZpbHRlckl0ZW0uZmllbGQgfHwgbi5maWVsZCA9PT0gZmlsdGVySXRlbS5maWVsZDtcbiAgICB9KTtcbiAgICBpZiAoXy5pc1N0cmluZyhtYXRjaEZpZWxkKSkge1xuICAgICAgbWF0Y2hGaWVsZCA9IHtcbiAgICAgICAgZmllbGQ6IG1hdGNoRmllbGQsXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKG1hdGNoRmllbGQpIHtcbiAgICAgIGZpbHRlckl0ZW0uaXNfZGVmYXVsdCA9IHRydWU7XG4gICAgICByZXR1cm4gZmlsdGVySXRlbS5pc19yZXF1aXJlZCA9IG1hdGNoRmllbGQucmVxdWlyZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBmaWx0ZXJJdGVtLmlzX2RlZmF1bHQ7XG4gICAgICByZXR1cm4gZGVsZXRlIGZpbHRlckl0ZW0uaXNfcmVxdWlyZWQ7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZpbHRlcnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZCkge1xuICB2YXIgY29sbGVjdGlvbiwgcmVjb3JkLCByZWYsIHJlZjEsIHJlZjI7XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKCFyZWNvcmRfaWQpIHtcbiAgICByZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpICYmIHJlY29yZF9pZCA9PT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikpIHtcbiAgICAgIGlmICgocmVmID0gVGVtcGxhdGUuaW5zdGFuY2UoKSkgIT0gbnVsbCA/IHJlZi5yZWNvcmQgOiB2b2lkIDApIHtcbiAgICAgICAgcmV0dXJuIChyZWYxID0gVGVtcGxhdGUuaW5zdGFuY2UoKSkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5yZWNvcmQpICE9IG51bGwgPyByZWYyLmdldCgpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKTtcbiAgICB9XG4gIH1cbiAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSk7XG4gIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgcmVjb3JkID0gY29sbGVjdGlvbi5maW5kT25lKHJlY29yZF9pZCk7XG4gICAgcmV0dXJuIHJlY29yZDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSZWNvcmROYW1lID0gZnVuY3Rpb24ocmVjb3JkLCBvYmplY3RfbmFtZSkge1xuICB2YXIgbmFtZV9maWVsZF9rZXksIHJlZjtcbiAgaWYgKCFyZWNvcmQpIHtcbiAgICByZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpO1xuICB9XG4gIGlmIChyZWNvcmQpIHtcbiAgICBuYW1lX2ZpZWxkX2tleSA9IG9iamVjdF9uYW1lID09PSBcIm9yZ2FuaXphdGlvbnNcIiA/IFwibmFtZVwiIDogKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5OQU1FX0ZJRUxEX0tFWSA6IHZvaWQgMDtcbiAgICBpZiAocmVjb3JkICYmIG5hbWVfZmllbGRfa2V5KSB7XG4gICAgICByZXR1cm4gcmVjb3JkLmxhYmVsIHx8IHJlY29yZFtuYW1lX2ZpZWxkX2tleV07XG4gICAgfVxuICB9XG59O1xuXG5DcmVhdG9yLmdldEFwcCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwLCByZWYsIHJlZjE7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgYXBwID0gQ3JlYXRvci5BcHBzW2FwcF9pZF07XG4gIGlmICgocmVmID0gQ3JlYXRvci5kZXBzKSAhPSBudWxsKSB7XG4gICAgaWYgKChyZWYxID0gcmVmLmFwcCkgIT0gbnVsbCkge1xuICAgICAgcmVmMS5kZXBlbmQoKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFwcDtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIGRhc2hib2FyZDtcbiAgYXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKTtcbiAgaWYgKCFhcHApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZGFzaGJvYXJkID0gbnVsbDtcbiAgXy5lYWNoKENyZWF0b3IuRGFzaGJvYXJkcywgZnVuY3Rpb24odiwgaykge1xuICAgIHZhciByZWY7XG4gICAgaWYgKCgocmVmID0gdi5hcHBzKSAhPSBudWxsID8gcmVmLmluZGV4T2YoYXBwLl9pZCkgOiB2b2lkIDApID4gLTEpIHtcbiAgICAgIHJldHVybiBkYXNoYm9hcmQgPSB2O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkYXNoYm9hcmQ7XG59O1xuXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZENvbXBvbmVudCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCkge1xuICAgIHJldHVybjtcbiAgfVxuICByZXR1cm4gUmVhY3RTdGVlZG9zLnBsdWdpbkNvbXBvbmVudFNlbGVjdG9yKFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLCBcIkRhc2hib2FyZFwiLCBhcHAuX2lkKTtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwT2JqZWN0TmFtZXMgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgdmFyIGFwcCwgYXBwT2JqZWN0cywgaXNNb2JpbGUsIG9iamVjdHM7XG4gIGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZCk7XG4gIGlmICghYXBwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpO1xuICBhcHBPYmplY3RzID0gaXNNb2JpbGUgPyBhcHAubW9iaWxlX29iamVjdHMgOiBhcHAub2JqZWN0cztcbiAgb2JqZWN0cyA9IFtdO1xuICBpZiAoYXBwKSB7XG4gICAgXy5lYWNoKGFwcE9iamVjdHMsIGZ1bmN0aW9uKHYpIHtcbiAgICAgIHZhciBvYmo7XG4gICAgICBvYmogPSBDcmVhdG9yLmdldE9iamVjdCh2KTtcbiAgICAgIGlmIChvYmogIT0gbnVsbCA/IG9iai5wZXJtaXNzaW9ucy5nZXQoKS5hbGxvd1JlYWQgOiB2b2lkIDApIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdHMucHVzaCh2KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb2JqZWN0cztcbn07XG5cbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHMgPSBmdW5jdGlvbihpbmNsdWRlQWRtaW4pIHtcbiAgdmFyIGNoYW5nZUFwcDtcbiAgY2hhbmdlQXBwID0gQ3JlYXRvci5fc3ViQXBwLmdldCgpO1xuICBSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKS5lbnRpdGllcy5hcHBzID0gT2JqZWN0LmFzc2lnbih7fSwgUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCkuZW50aXRpZXMuYXBwcywge1xuICAgIGFwcHM6IGNoYW5nZUFwcFxuICB9KTtcbiAgcmV0dXJuIFJlYWN0U3RlZWRvcy52aXNpYmxlQXBwc1NlbGVjdG9yKFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLCBpbmNsdWRlQWRtaW4pO1xufTtcblxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwc09iamVjdHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGFwcHMsIG9iamVjdHMsIHZpc2libGVPYmplY3ROYW1lcztcbiAgYXBwcyA9IENyZWF0b3IuZ2V0VmlzaWJsZUFwcHMoKTtcbiAgdmlzaWJsZU9iamVjdE5hbWVzID0gXy5mbGF0dGVuKF8ucGx1Y2soYXBwcywgJ29iamVjdHMnKSk7XG4gIG9iamVjdHMgPSBfLmZpbHRlcihDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICh2aXNpYmxlT2JqZWN0TmFtZXMuaW5kZXhPZihvYmoubmFtZSkgPCAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIG9iamVjdHMgPSBvYmplY3RzLnNvcnQoQ3JlYXRvci5zb3J0aW5nTWV0aG9kLmJpbmQoe1xuICAgIGtleTogXCJsYWJlbFwiXG4gIH0pKTtcbiAgb2JqZWN0cyA9IF8ucGx1Y2sob2JqZWN0cywgJ25hbWUnKTtcbiAgcmV0dXJuIF8udW5pcShvYmplY3RzKTtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwc09iamVjdHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG9iamVjdHMsIHRlbXBPYmplY3RzO1xuICBvYmplY3RzID0gW107XG4gIHRlbXBPYmplY3RzID0gW107XG4gIF8uZm9yRWFjaChDcmVhdG9yLkFwcHMsIGZ1bmN0aW9uKGFwcCkge1xuICAgIHRlbXBPYmplY3RzID0gXy5maWx0ZXIoYXBwLm9iamVjdHMsIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuICFvYmouaGlkZGVuO1xuICAgIH0pO1xuICAgIHJldHVybiBvYmplY3RzID0gb2JqZWN0cy5jb25jYXQodGVtcE9iamVjdHMpO1xuICB9KTtcbiAgcmV0dXJuIF8udW5pcShvYmplY3RzKTtcbn07XG5cbkNyZWF0b3IudmFsaWRhdGVGaWx0ZXJzID0gZnVuY3Rpb24oZmlsdGVycywgbG9naWMpIHtcbiAgdmFyIGUsIGVycm9yTXNnLCBmaWx0ZXJfaXRlbXMsIGZpbHRlcl9sZW5ndGgsIGZsYWcsIGluZGV4LCB3b3JkO1xuICBmaWx0ZXJfaXRlbXMgPSBfLm1hcChmaWx0ZXJzLCBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoXy5pc0VtcHR5KG9iaikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gIH0pO1xuICBmaWx0ZXJfaXRlbXMgPSBfLmNvbXBhY3QoZmlsdGVyX2l0ZW1zKTtcbiAgZXJyb3JNc2cgPSBcIlwiO1xuICBmaWx0ZXJfbGVuZ3RoID0gZmlsdGVyX2l0ZW1zLmxlbmd0aDtcbiAgaWYgKGxvZ2ljKSB7XG4gICAgbG9naWMgPSBsb2dpYy5yZXBsYWNlKC9cXG4vZywgXCJcIikucmVwbGFjZSgvXFxzKy9nLCBcIiBcIik7XG4gICAgaWYgKC9bLl9cXC0hK10rL2lnLnRlc3QobG9naWMpKSB7XG4gICAgICBlcnJvck1zZyA9IFwi5ZCr5pyJ54m55q6K5a2X56ym44CCXCI7XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIGluZGV4ID0gbG9naWMubWF0Y2goL1xcZCsvaWcpO1xuICAgICAgaWYgKCFpbmRleCkge1xuICAgICAgICBlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleC5mb3JFYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICBpZiAoaSA8IDEgfHwgaSA+IGZpbHRlcl9sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5p2h5Lu25byV55So5LqG5pyq5a6a5LmJ55qE562b6YCJ5Zmo77yaXCIgKyBpICsgXCLjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmbGFnID0gMTtcbiAgICAgICAgd2hpbGUgKGZsYWcgPD0gZmlsdGVyX2xlbmd0aCkge1xuICAgICAgICAgIGlmICghaW5kZXguaW5jbHVkZXMoXCJcIiArIGZsYWcpKSB7XG4gICAgICAgICAgICBlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZsYWcrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWVycm9yTXNnKSB7XG4gICAgICB3b3JkID0gbG9naWMubWF0Y2goL1thLXpBLVpdKy9pZyk7XG4gICAgICBpZiAod29yZCkge1xuICAgICAgICB3b3JkLmZvckVhY2goZnVuY3Rpb24odykge1xuICAgICAgICAgIGlmICghL14oYW5kfG9yKSQvaWcudGVzdCh3KSkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yTXNnID0gXCLmo4Dmn6XmgqjnmoTpq5jnuqfnrZvpgInmnaHku7bkuK3nmoTmi7zlhpnjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWVycm9yTXNnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBDcmVhdG9yW1wiZXZhbFwiXShsb2dpYy5yZXBsYWNlKC9hbmQvaWcsIFwiJiZcIikucmVwbGFjZSgvb3IvaWcsIFwifHxcIikpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5Lit5ZCr5pyJ54m55q6K5a2X56ymXCI7XG4gICAgICB9XG4gICAgICBpZiAoLyhBTkQpW14oKV0rKE9SKS9pZy50ZXN0KGxvZ2ljKSB8fCAvKE9SKVteKCldKyhBTkQpL2lnLnRlc3QobG9naWMpKSB7XG4gICAgICAgIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajlv4XpobvlnKjov57nu63mgKfnmoQgQU5EIOWSjCBPUiDooajovr7lvI/liY3lkI7kvb/nlKjmi6zlj7fjgIJcIjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKGVycm9yTXNnKSB7XG4gICAgY29uc29sZS5sb2coXCJlcnJvclwiLCBlcnJvck1zZyk7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdG9hc3RyLmVycm9yKGVycm9yTXNnKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuICovXG5cbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvTW9uZ28gPSBmdW5jdGlvbihmaWx0ZXJzLCBvcHRpb25zKSB7XG4gIHZhciBzZWxlY3RvcjtcbiAgaWYgKCEoZmlsdGVycyAhPSBudWxsID8gZmlsdGVycy5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghKGZpbHRlcnNbMF0gaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICBmaWx0ZXJzID0gXy5tYXAoZmlsdGVycywgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gW29iai5maWVsZCwgb2JqLm9wZXJhdGlvbiwgb2JqLnZhbHVlXTtcbiAgICB9KTtcbiAgfVxuICBzZWxlY3RvciA9IFtdO1xuICBfLmVhY2goZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIGZpZWxkLCBvcHRpb24sIHJlZywgc3ViX3NlbGVjdG9yLCB2YWx1ZTtcbiAgICBmaWVsZCA9IGZpbHRlclswXTtcbiAgICBvcHRpb24gPSBmaWx0ZXJbMV07XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgbnVsbCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHN1Yl9zZWxlY3RvciA9IHt9O1xuICAgIHN1Yl9zZWxlY3RvcltmaWVsZF0gPSB7fTtcbiAgICBpZiAob3B0aW9uID09PSBcIj1cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRlcVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjw+XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbmVcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI+XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI+PVwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGd0ZVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjxcIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdFwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjw9XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRlXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwic3RhcnRzd2l0aFwiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKFwiXlwiICsgdmFsdWUsIFwiaVwiKTtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWc7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiY29udGFpbnNcIikge1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cCh2YWx1ZSwgXCJpXCIpO1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJub3Rjb250YWluc1wiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKFwiXigoPyFcIiArIHZhbHVlICsgXCIpLikqJFwiLCBcImlcIik7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnO1xuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3IucHVzaChzdWJfc2VsZWN0b3IpO1xuICB9KTtcbiAgcmV0dXJuIHNlbGVjdG9yO1xufTtcblxuQ3JlYXRvci5pc0JldHdlZW5GaWx0ZXJPcGVyYXRpb24gPSBmdW5jdGlvbihvcGVyYXRpb24pIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIG9wZXJhdGlvbiA9PT0gXCJiZXR3ZWVuXCIgfHwgISEoKHJlZiA9IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKHRydWUpKSAhPSBudWxsID8gcmVmW29wZXJhdGlvbl0gOiB2b2lkIDApO1xufTtcblxuXG4vKlxub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcblx0ZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuICovXG5cbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvRGV2ID0gZnVuY3Rpb24oZmlsdGVycywgb2JqZWN0X25hbWUsIG9wdGlvbnMpIHtcbiAgdmFyIGxvZ2ljVGVtcEZpbHRlcnMsIHNlbGVjdG9yLCBzdGVlZG9zRmlsdGVycztcbiAgc3RlZWRvc0ZpbHRlcnMgPSByZXF1aXJlKFwiQHN0ZWVkb3MvZmlsdGVyc1wiKTtcbiAgaWYgKCFmaWx0ZXJzLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5pc19sb2dpY19vciA6IHZvaWQgMCkge1xuICAgIGxvZ2ljVGVtcEZpbHRlcnMgPSBbXTtcbiAgICBmaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24obikge1xuICAgICAgbG9naWNUZW1wRmlsdGVycy5wdXNoKG4pO1xuICAgICAgcmV0dXJuIGxvZ2ljVGVtcEZpbHRlcnMucHVzaChcIm9yXCIpO1xuICAgIH0pO1xuICAgIGxvZ2ljVGVtcEZpbHRlcnMucG9wKCk7XG4gICAgZmlsdGVycyA9IGxvZ2ljVGVtcEZpbHRlcnM7XG4gIH1cbiAgc2VsZWN0b3IgPSBzdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9EZXYoZmlsdGVycywgQ3JlYXRvci5VU0VSX0NPTlRFWFQpO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuICovXG5cbkNyZWF0b3IuZm9ybWF0TG9naWNGaWx0ZXJzVG9EZXYgPSBmdW5jdGlvbihmaWx0ZXJzLCBmaWx0ZXJfbG9naWMsIG9wdGlvbnMpIHtcbiAgdmFyIGZvcm1hdF9sb2dpYztcbiAgZm9ybWF0X2xvZ2ljID0gZmlsdGVyX2xvZ2ljLnJlcGxhY2UoL1xcKFxccysvaWcsIFwiKFwiKS5yZXBsYWNlKC9cXHMrXFwpL2lnLCBcIilcIikucmVwbGFjZSgvXFwoL2csIFwiW1wiKS5yZXBsYWNlKC9cXCkvZywgXCJdXCIpLnJlcGxhY2UoL1xccysvZywgXCIsXCIpLnJlcGxhY2UoLyhhbmR8b3IpL2lnLCBcIickMSdcIik7XG4gIGZvcm1hdF9sb2dpYyA9IGZvcm1hdF9sb2dpYy5yZXBsYWNlKC8oXFxkKSsvaWcsIGZ1bmN0aW9uKHgpIHtcbiAgICB2YXIgX2YsIGZpZWxkLCBvcHRpb24sIHN1Yl9zZWxlY3RvciwgdmFsdWU7XG4gICAgX2YgPSBmaWx0ZXJzW3ggLSAxXTtcbiAgICBmaWVsZCA9IF9mLmZpZWxkO1xuICAgIG9wdGlvbiA9IF9mLm9wZXJhdGlvbjtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShfZi52YWx1ZSwgbnVsbCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHN1Yl9zZWxlY3RvciA9IFtdO1xuICAgIGlmIChfLmlzQXJyYXkodmFsdWUpID09PSB0cnVlKSB7XG4gICAgICBpZiAob3B0aW9uID09PSBcIj1cIikge1xuICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4gc3ViX3NlbGVjdG9yLnB1c2goW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjw+XCIpIHtcbiAgICAgICAgXy5lYWNoKHZhbHVlLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIHN1Yl9zZWxlY3Rvci5wdXNoKFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJhbmRcIik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgXy5lYWNoKHZhbHVlLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIHN1Yl9zZWxlY3Rvci5wdXNoKFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoc3ViX3NlbGVjdG9yW3N1Yl9zZWxlY3Rvci5sZW5ndGggLSAxXSA9PT0gXCJhbmRcIiB8fCBzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09PSBcIm9yXCIpIHtcbiAgICAgICAgc3ViX3NlbGVjdG9yLnBvcCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdWJfc2VsZWN0b3IgPSBbZmllbGQsIG9wdGlvbiwgdmFsdWVdO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcInN1Yl9zZWxlY3RvclwiLCBzdWJfc2VsZWN0b3IpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzdWJfc2VsZWN0b3IpO1xuICB9KTtcbiAgZm9ybWF0X2xvZ2ljID0gXCJbXCIgKyBmb3JtYXRfbG9naWMgKyBcIl1cIjtcbiAgcmV0dXJuIENyZWF0b3JbXCJldmFsXCJdKGZvcm1hdF9sb2dpYyk7XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgX29iamVjdCwgcGVybWlzc2lvbnMsIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCByZWxhdGVkX29iamVjdHMsIHVucmVsYXRlZF9vYmplY3RzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW107XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghX29iamVjdCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgfVxuICByZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKF9vYmplY3QuX2NvbGxlY3Rpb25fbmFtZSk7XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsIFwib2JqZWN0X25hbWVcIik7XG4gIGlmICgocmVsYXRlZF9vYmplY3RfbmFtZXMgIT0gbnVsbCA/IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmxlbmd0aCA6IHZvaWQgMCkgPT09IDApIHtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXM7XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICB1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzO1xuICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZShyZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHMpO1xuICByZXR1cm4gXy5maWx0ZXIocmVsYXRlZF9vYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCkge1xuICAgIHZhciBhbGxvd1JlYWQsIGlzQWN0aXZlLCByZWYsIHJlbGF0ZWRfb2JqZWN0X25hbWU7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0Lm9iamVjdF9uYW1lO1xuICAgIGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xO1xuICAgIGFsbG93UmVhZCA9IChyZWYgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYuYWxsb3dSZWFkIDogdm9pZCAwO1xuICAgIHJldHVybiBpc0FjdGl2ZSAmJiBhbGxvd1JlYWQ7XG4gIH0pO1xufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0TmFtZXMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciByZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIHJldHVybiBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cywgXCJvYmplY3RfbmFtZVwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0QWN0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGFjdGlvbnMsIGRpc2FibGVkX2FjdGlvbnMsIG9iaiwgcGVybWlzc2lvbnMsIHJlZiwgcmVmMTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgZGlzYWJsZWRfYWN0aW9ucyA9IHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnM7XG4gIGFjdGlvbnMgPSBfLnNvcnRCeShfLnZhbHVlcyhvYmouYWN0aW9ucyksICdzb3J0Jyk7XG4gIGlmIChfLmhhcyhvYmosICdhbGxvd19jdXN0b21BY3Rpb25zJykpIHtcbiAgICBhY3Rpb25zID0gXy5maWx0ZXIoYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgICByZXR1cm4gXy5pbmNsdWRlKG9iai5hbGxvd19jdXN0b21BY3Rpb25zLCBhY3Rpb24ubmFtZSkgfHwgXy5pbmNsdWRlKF8ua2V5cyhDcmVhdG9yLmdldE9iamVjdCgnYmFzZScpLmFjdGlvbnMpIHx8IHt9LCBhY3Rpb24ubmFtZSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKF8uaGFzKG9iaiwgJ2V4Y2x1ZGVfYWN0aW9ucycpKSB7XG4gICAgYWN0aW9ucyA9IF8uZmlsdGVyKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgICAgcmV0dXJuICFfLmluY2x1ZGUob2JqLmV4Y2x1ZGVfYWN0aW9ucywgYWN0aW9uLm5hbWUpO1xuICAgIH0pO1xuICB9XG4gIF8uZWFjaChhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcInJlY29yZFwiLCBcInJlY29yZF9vbmx5XCJdLmluZGV4T2YoYWN0aW9uLm9uKSA+IC0xICYmIGFjdGlvbi5uYW1lICE9PSAnc3RhbmRhcmRfZWRpdCcpIHtcbiAgICAgIGlmIChhY3Rpb24ub24gPT09IFwicmVjb3JkX29ubHlcIikge1xuICAgICAgICByZXR1cm4gYWN0aW9uLm9uID0gJ3JlY29yZF9vbmx5X21vcmUnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi5vbiA9ICdyZWNvcmRfbW9yZSc7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJjbXNfZmlsZXNcIiwgXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXS5pbmRleE9mKG9iamVjdF9uYW1lKSA+IC0xKSB7XG4gICAgaWYgKChyZWYgPSBhY3Rpb25zLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4ubmFtZSA9PT0gXCJzdGFuZGFyZF9lZGl0XCI7XG4gICAgfSkpICE9IG51bGwpIHtcbiAgICAgIHJlZi5vbiA9IFwicmVjb3JkX21vcmVcIjtcbiAgICB9XG4gICAgaWYgKChyZWYxID0gYWN0aW9ucy5maW5kKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLm5hbWUgPT09IFwiZG93bmxvYWRcIjtcbiAgICB9KSkgIT0gbnVsbCkge1xuICAgICAgcmVmMS5vbiA9IFwicmVjb3JkXCI7XG4gICAgfVxuICB9XG4gIGFjdGlvbnMgPSBfLmZpbHRlcihhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICByZXR1cm4gXy5pbmRleE9mKGRpc2FibGVkX2FjdGlvbnMsIGFjdGlvbi5uYW1lKSA8IDA7XG4gIH0pO1xuICByZXR1cm4gYWN0aW9ucztcbn07XG5cbi/ov5Tlm57lvZPliY3nlKjmiLfmnInmnYPpmZDorr/pl67nmoTmiYDmnIlsaXN0X3ZpZXfvvIzljIXmi6zliIbkuqvnmoTvvIznlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTvvIjpmaTpnZ5vd25lcuWPmOS6hu+8ie+8jOS7peWPium7mOiupOeahOWFtuS7luinhuWbvuazqOaEj0NyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mmK/kuI3kvJrmnInnlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTop4blm77nmoTvvIzmiYDku6VDcmVhdG9yLmdldFBlcm1pc3Npb25z5Ye95pWw5Lit5ou/5Yiw55qE57uT5p6c5LiN5YWo77yM5bm25LiN5piv5b2T5YmN55So5oi36IO955yL5Yiw5omA5pyJ6KeG5Zu+LztcblxuQ3JlYXRvci5nZXRMaXN0Vmlld3MgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBkaXNhYmxlZF9saXN0X3ZpZXdzLCBpc01vYmlsZSwgbGlzdF92aWV3cywgb2JqZWN0LCByZWY7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGRpc2FibGVkX2xpc3Rfdmlld3MgPSAoKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYuZGlzYWJsZWRfbGlzdF92aWV3cyA6IHZvaWQgMCkgfHwgW107XG4gIGxpc3Rfdmlld3MgPSBbXTtcbiAgaXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKCk7XG4gIF8uZWFjaChvYmplY3QubGlzdF92aWV3cywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgaWYgKGlzTW9iaWxlICYmIGl0ZW0udHlwZSA9PT0gXCJjYWxlbmRhclwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpdGVtX25hbWUgIT09IFwiZGVmYXVsdFwiKSB7XG4gICAgICBpZiAoXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW1fbmFtZSkgPCAwIHx8IGl0ZW0ub3duZXIgPT09IHVzZXJJZCkge1xuICAgICAgICByZXR1cm4gbGlzdF92aWV3cy5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBsaXN0X3ZpZXdzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBmaWVsZHNOYW1lLCByZWYsIHVucmVhZGFibGVfZmllbGRzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIGZpZWxkc05hbWUgPSBDcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUob2JqZWN0X25hbWUpO1xuICB1bnJlYWRhYmxlX2ZpZWxkcyA9IChyZWYgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKSAhPSBudWxsID8gcmVmLnVucmVhZGFibGVfZmllbGRzIDogdm9pZCAwO1xuICByZXR1cm4gXy5kaWZmZXJlbmNlKGZpZWxkc05hbWUsIHVucmVhZGFibGVfZmllbGRzKTtcbn07XG5cbkNyZWF0b3IuaXNsb2FkaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhQ3JlYXRvci5ib290c3RyYXBMb2FkZWQuZ2V0KCk7XG59O1xuXG5DcmVhdG9yLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIik7XG59O1xuXG5DcmVhdG9yLmdldERpc2FibGVkRmllbGRzID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBmaWVsZHM7XG4gIGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQsIGZpZWxkTmFtZSkge1xuICAgIHJldHVybiBmaWVsZC5hdXRvZm9ybSAmJiBmaWVsZC5hdXRvZm9ybS5kaXNhYmxlZCAmJiAhZmllbGQuYXV0b2Zvcm0ub21pdCAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0SGlkZGVuRmllbGRzID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBmaWVsZHM7XG4gIGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQsIGZpZWxkTmFtZSkge1xuICAgIHJldHVybiBmaWVsZC5hdXRvZm9ybSAmJiBmaWVsZC5hdXRvZm9ybS50eXBlID09PSBcImhpZGRlblwiICYmICFmaWVsZC5hdXRvZm9ybS5vbWl0ICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNXaXRoTm9Hcm91cCA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gKCFmaWVsZC5hdXRvZm9ybSB8fCAhZmllbGQuYXV0b2Zvcm0uZ3JvdXAgfHwgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT09IFwiLVwiKSAmJiAoIWZpZWxkLmF1dG9mb3JtIHx8IGZpZWxkLmF1dG9mb3JtLnR5cGUgIT09IFwiaGlkZGVuXCIpICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRTb3J0ZWRGaWVsZEdyb3VwTmFtZXMgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIG5hbWVzO1xuICBuYW1lcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgIT09IFwiLVwiICYmIGZpZWxkLmF1dG9mb3JtLmdyb3VwO1xuICB9KTtcbiAgbmFtZXMgPSBfLmNvbXBhY3QobmFtZXMpO1xuICBuYW1lcyA9IF8udW5pcXVlKG5hbWVzKTtcbiAgcmV0dXJuIG5hbWVzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNGb3JHcm91cCA9IGZ1bmN0aW9uKHNjaGVtYSwgZ3JvdXBOYW1lKSB7XG4gIHZhciBmaWVsZHM7XG4gIGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQsIGZpZWxkTmFtZSkge1xuICAgIHJldHVybiBmaWVsZC5hdXRvZm9ybSAmJiBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PT0gZ3JvdXBOYW1lICYmIGZpZWxkLmF1dG9mb3JtLnR5cGUgIT09IFwiaGlkZGVuXCIgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRPbWl0ID0gZnVuY3Rpb24oc2NoZW1hLCBrZXlzKSB7XG4gIGtleXMgPSBfLm1hcChrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgZmllbGQsIHJlZjtcbiAgICBmaWVsZCA9IF8ucGljayhzY2hlbWEsIGtleSk7XG4gICAgaWYgKChyZWYgPSBmaWVsZFtrZXldLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmLm9taXQgOiB2b2lkIDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gIH0pO1xuICBrZXlzID0gXy5jb21wYWN0KGtleXMpO1xuICByZXR1cm4ga2V5cztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzSW5GaXJzdExldmVsID0gZnVuY3Rpb24oZmlyc3RMZXZlbEtleXMsIGtleXMpIHtcbiAga2V5cyA9IF8ubWFwKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgIGlmIChfLmluZGV4T2YoZmlyc3RMZXZlbEtleXMsIGtleSkgPiAtMSkge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSk7XG4gIGtleXMgPSBfLmNvbXBhY3Qoa2V5cyk7XG4gIHJldHVybiBrZXlzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNGb3JSZW9yZGVyID0gZnVuY3Rpb24oc2NoZW1hLCBrZXlzLCBpc1NpbmdsZSkge1xuICB2YXIgX2tleXMsIGNoaWxkS2V5cywgZmllbGRzLCBpLCBpc193aWRlXzEsIGlzX3dpZGVfMiwgc2NfMSwgc2NfMjtcbiAgZmllbGRzID0gW107XG4gIGkgPSAwO1xuICBfa2V5cyA9IF8uZmlsdGVyKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiAha2V5LmVuZHNXaXRoKCdfZW5kTGluZScpO1xuICB9KTtcbiAgd2hpbGUgKGkgPCBfa2V5cy5sZW5ndGgpIHtcbiAgICBzY18xID0gXy5waWNrKHNjaGVtYSwgX2tleXNbaV0pO1xuICAgIHNjXzIgPSBfLnBpY2soc2NoZW1hLCBfa2V5c1tpICsgMV0pO1xuICAgIGlzX3dpZGVfMSA9IGZhbHNlO1xuICAgIGlzX3dpZGVfMiA9IGZhbHNlO1xuICAgIF8uZWFjaChzY18xLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIHJlZiwgcmVmMTtcbiAgICAgIGlmICgoKHJlZiA9IHZhbHVlLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmLmlzX3dpZGUgOiB2b2lkIDApIHx8ICgocmVmMSA9IHZhbHVlLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMS50eXBlIDogdm9pZCAwKSA9PT0gXCJ0YWJsZVwiKSB7XG4gICAgICAgIHJldHVybiBpc193aWRlXzEgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIF8uZWFjaChzY18yLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIHJlZiwgcmVmMTtcbiAgICAgIGlmICgoKHJlZiA9IHZhbHVlLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmLmlzX3dpZGUgOiB2b2lkIDApIHx8ICgocmVmMSA9IHZhbHVlLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMS50eXBlIDogdm9pZCAwKSA9PT0gXCJ0YWJsZVwiKSB7XG4gICAgICAgIHJldHVybiBpc193aWRlXzIgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgIGlzX3dpZGVfMSA9IHRydWU7XG4gICAgICBpc193aWRlXzIgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoaXNTaW5nbGUpIHtcbiAgICAgIGZpZWxkcy5wdXNoKF9rZXlzLnNsaWNlKGksIGkgKyAxKSk7XG4gICAgICBpICs9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc193aWRlXzEpIHtcbiAgICAgICAgZmllbGRzLnB1c2goX2tleXMuc2xpY2UoaSwgaSArIDEpKTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgfSBlbHNlIGlmICghaXNfd2lkZV8xICYmIGlzX3dpZGVfMikge1xuICAgICAgICBjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpICsgMSk7XG4gICAgICAgIGNoaWxkS2V5cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIGZpZWxkcy5wdXNoKGNoaWxkS2V5cyk7XG4gICAgICAgIGkgKz0gMTtcbiAgICAgIH0gZWxzZSBpZiAoIWlzX3dpZGVfMSAmJiAhaXNfd2lkZV8yKSB7XG4gICAgICAgIGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkgKyAxKTtcbiAgICAgICAgaWYgKF9rZXlzW2kgKyAxXSkge1xuICAgICAgICAgIGNoaWxkS2V5cy5wdXNoKF9rZXlzW2kgKyAxXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2hpbGRLZXlzLnB1c2godm9pZCAwKTtcbiAgICAgICAgfVxuICAgICAgICBmaWVsZHMucHVzaChjaGlsZEtleXMpO1xuICAgICAgICBpICs9IDI7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmlzRmlsdGVyVmFsdWVFbXB0eSA9IGZ1bmN0aW9uKHYpIHtcbiAgcmV0dXJuIHR5cGVvZiB2ID09PSBcInVuZGVmaW5lZFwiIHx8IHYgPT09IG51bGwgfHwgTnVtYmVyLmlzTmFOKHYpIHx8IHYubGVuZ3RoID09PSAwO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZERhdGFUeXBlID0gZnVuY3Rpb24ob2JqZWN0RmllbGRzLCBrZXkpIHtcbiAgdmFyIHJlZiwgcmVzdWx0O1xuICBpZiAob2JqZWN0RmllbGRzICYmIGtleSkge1xuICAgIHJlc3VsdCA9IChyZWYgPSBvYmplY3RGaWVsZHNba2V5XSkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwO1xuICAgIGlmIChbXCJmb3JtdWxhXCIsIFwic3VtbWFyeVwiXS5pbmRleE9mKHJlc3VsdCkgPiAtMSkge1xuICAgICAgcmVzdWx0ID0gb2JqZWN0RmllbGRzW2tleV0uZGF0YV90eXBlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBcInRleHRcIjtcbiAgfVxufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDcmVhdG9yLmdldEFsbFJlbGF0ZWRPYmplY3RzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgcmVsYXRlZF9vYmplY3RfbmFtZXM7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBbXTtcbiAgICBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgICAgcmV0dXJuIF8uZWFjaChyZWxhdGVkX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgICAgICBpZiAocmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PT0gb2JqZWN0X25hbWUpIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXMucHVzaChyZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKS5lbmFibGVfZmlsZXMpIHtcbiAgICAgIHJlbGF0ZWRfb2JqZWN0X25hbWVzLnB1c2goXCJjbXNfZmlsZXNcIik7XG4gICAgfVxuICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zLmZvcm1hdEluZGV4ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgaW5kZXhOYW1lLCBpc2RvY3VtZW50REIsIG9iamVjdCwgcmVmLCByZWYxLCByZWYyO1xuICAgIG9iamVjdCA9IHtcbiAgICAgIGJhY2tncm91bmQ6IHRydWVcbiAgICB9O1xuICAgIGlzZG9jdW1lbnREQiA9ICgocmVmID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjEgPSByZWYuZGF0YXNvdXJjZXMpICE9IG51bGwgPyAocmVmMiA9IHJlZjFbXCJkZWZhdWx0XCJdKSAhPSBudWxsID8gcmVmMi5kb2N1bWVudERCIDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwKSB8fCBmYWxzZTtcbiAgICBpZiAoaXNkb2N1bWVudERCKSB7XG4gICAgICBpZiAoYXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICBpbmRleE5hbWUgPSBhcnJheS5qb2luKFwiLlwiKTtcbiAgICAgICAgb2JqZWN0Lm5hbWUgPSBpbmRleE5hbWU7XG4gICAgICAgIGlmIChpbmRleE5hbWUubGVuZ3RoID4gNTIpIHtcbiAgICAgICAgICBvYmplY3QubmFtZSA9IGluZGV4TmFtZS5zdWJzdHJpbmcoMCwgNTIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG4iLCJDcmVhdG9yLmFwcHNCeU5hbWUgPSB7fVxyXG5cclxuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRcIm9iamVjdF9yZWNlbnRfdmlld2VkXCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZV9pZCktPlxyXG5cdFx0aWYgIXRoaXMudXNlcklkXHJcblx0XHRcdHJldHVybiBudWxsXHJcblxyXG5cdFx0aWYgb2JqZWN0X25hbWUgPT0gXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiXHJcblx0XHRcdHJldHVyblxyXG5cdFx0aWYgb2JqZWN0X25hbWUgYW5kIHJlY29yZF9pZFxyXG5cdFx0XHRpZiAhc3BhY2VfaWRcclxuXHRcdFx0XHRkb2MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmRPbmUoe19pZDogcmVjb3JkX2lkfSwge2ZpZWxkczoge3NwYWNlOiAxfX0pXHJcblx0XHRcdFx0c3BhY2VfaWQgPSBkb2M/LnNwYWNlXHJcblxyXG5cdFx0XHRjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiKVxyXG5cdFx0XHRmaWx0ZXJzID0geyBvd25lcjogdGhpcy51c2VySWQsIHNwYWNlOiBzcGFjZV9pZCwgJ3JlY29yZC5vJzogb2JqZWN0X25hbWUsICdyZWNvcmQuaWRzJzogW3JlY29yZF9pZF19XHJcblx0XHRcdGN1cnJlbnRfcmVjZW50X3ZpZXdlZCA9IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5maW5kT25lKGZpbHRlcnMpXHJcblx0XHRcdGlmIGN1cnJlbnRfcmVjZW50X3ZpZXdlZFxyXG5cdFx0XHRcdGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC51cGRhdGUoXHJcblx0XHRcdFx0XHRjdXJyZW50X3JlY2VudF92aWV3ZWQuX2lkLFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHQkaW5jOiB7XHJcblx0XHRcdFx0XHRcdFx0Y291bnQ6IDFcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkOiBuZXcgRGF0ZSgpXHJcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHQpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuaW5zZXJ0KFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRfaWQ6IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5fbWFrZU5ld0lEKClcclxuXHRcdFx0XHRcdFx0b3duZXI6IHRoaXMudXNlcklkXHJcblx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZV9pZFxyXG5cdFx0XHRcdFx0XHRyZWNvcmQ6IHtvOiBvYmplY3RfbmFtZSwgaWRzOiBbcmVjb3JkX2lkXX1cclxuXHRcdFx0XHRcdFx0Y291bnQ6IDFcclxuXHRcdFx0XHRcdFx0Y3JlYXRlZDogbmV3IERhdGUoKVxyXG5cdFx0XHRcdFx0XHRjcmVhdGVkX2J5OiB0aGlzLnVzZXJJZFxyXG5cdFx0XHRcdFx0XHRtb2RpZmllZDogbmV3IERhdGUoKVxyXG5cdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogdGhpcy51c2VySWRcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHQpXHJcblx0XHRcdHJldHVybiIsIk1ldGVvci5tZXRob2RzKHtcbiAgXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZV9pZCkge1xuICAgIHZhciBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQsIGN1cnJlbnRfcmVjZW50X3ZpZXdlZCwgZG9jLCBmaWx0ZXJzO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAob2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgICBpZiAoIXNwYWNlX2lkKSB7XG4gICAgICAgIGRvYyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZE9uZSh7XG4gICAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgc3BhY2U6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzcGFjZV9pZCA9IGRvYyAhPSBudWxsID8gZG9jLnNwYWNlIDogdm9pZCAwO1xuICAgICAgfVxuICAgICAgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIik7XG4gICAgICBmaWx0ZXJzID0ge1xuICAgICAgICBvd25lcjogdGhpcy51c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgJ3JlY29yZC5vJzogb2JqZWN0X25hbWUsXG4gICAgICAgICdyZWNvcmQuaWRzJzogW3JlY29yZF9pZF1cbiAgICAgIH07XG4gICAgICBjdXJyZW50X3JlY2VudF92aWV3ZWQgPSBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuZmluZE9uZShmaWx0ZXJzKTtcbiAgICAgIGlmIChjdXJyZW50X3JlY2VudF92aWV3ZWQpIHtcbiAgICAgICAgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLnVwZGF0ZShjdXJyZW50X3JlY2VudF92aWV3ZWQuX2lkLCB7XG4gICAgICAgICAgJGluYzoge1xuICAgICAgICAgICAgY291bnQ6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5pbnNlcnQoe1xuICAgICAgICAgIF9pZDogY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLl9tYWtlTmV3SUQoKSxcbiAgICAgICAgICBvd25lcjogdGhpcy51c2VySWQsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIHJlY29yZDoge1xuICAgICAgICAgICAgbzogb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBpZHM6IFtyZWNvcmRfaWRdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IHRoaXMudXNlcklkLFxuICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuIiwicmVjZW50X2FnZ3JlZ2F0ZSA9IChjcmVhdGVkX2J5LCBzcGFjZUlkLCBfcmVjb3JkcywgY2FsbGJhY2spLT5cclxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9yZWNlbnRfdmlld2VkLnJhd0NvbGxlY3Rpb24oKS5hZ2dyZWdhdGUoW1xyXG5cdFx0eyRtYXRjaDoge2NyZWF0ZWRfYnk6IGNyZWF0ZWRfYnksIHNwYWNlOiBzcGFjZUlkfX0sXHJcblx0XHR7JGdyb3VwOiB7X2lkOiB7b2JqZWN0X25hbWU6IFwiJHJlY29yZC5vXCIsIHJlY29yZF9pZDogXCIkcmVjb3JkLmlkc1wiLCBzcGFjZTogXCIkc3BhY2VcIn0sIG1heENyZWF0ZWQ6IHskbWF4OiBcIiRjcmVhdGVkXCJ9fX0sXHJcblx0XHR7JHNvcnQ6IHttYXhDcmVhdGVkOiAtMX19LFxyXG5cdFx0eyRsaW1pdDogMTB9XHJcblx0XSkudG9BcnJheSAoZXJyLCBkYXRhKS0+XHJcblx0XHRpZiBlcnJcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycilcclxuXHJcblx0XHRkYXRhLmZvckVhY2ggKGRvYykgLT5cclxuXHRcdFx0X3JlY29yZHMucHVzaCBkb2MuX2lkXHJcblxyXG5cdFx0aWYgY2FsbGJhY2sgJiYgXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKVxyXG5cdFx0XHRjYWxsYmFjaygpXHJcblxyXG5cdFx0cmV0dXJuXHJcblxyXG5hc3luY19yZWNlbnRfYWdncmVnYXRlID0gTWV0ZW9yLndyYXBBc3luYyhyZWNlbnRfYWdncmVnYXRlKVxyXG5cclxuc2VhcmNoX29iamVjdCA9IChzcGFjZSwgb2JqZWN0X25hbWUsdXNlcklkLCBzZWFyY2hUZXh0KS0+XHJcblx0ZGF0YSA9IG5ldyBBcnJheSgpXHJcblxyXG5cdGlmIHNlYXJjaFRleHRcclxuXHJcblx0XHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblxyXG5cdFx0X29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxyXG5cdFx0X29iamVjdF9uYW1lX2tleSA9IF9vYmplY3Q/Lk5BTUVfRklFTERfS0VZXHJcblx0XHRpZiBfb2JqZWN0ICYmIF9vYmplY3RfY29sbGVjdGlvbiAmJiBfb2JqZWN0X25hbWVfa2V5XHJcblx0XHRcdHF1ZXJ5ID0ge31cclxuXHRcdFx0c2VhcmNoX0tleXdvcmRzID0gc2VhcmNoVGV4dC5zcGxpdChcIiBcIilcclxuXHRcdFx0cXVlcnlfYW5kID0gW11cclxuXHRcdFx0c2VhcmNoX0tleXdvcmRzLmZvckVhY2ggKGtleXdvcmQpLT5cclxuXHRcdFx0XHRzdWJxdWVyeSA9IHt9XHJcblx0XHRcdFx0c3VicXVlcnlbX29iamVjdF9uYW1lX2tleV0gPSB7JHJlZ2V4OiBrZXl3b3JkLnRyaW0oKX1cclxuXHRcdFx0XHRxdWVyeV9hbmQucHVzaCBzdWJxdWVyeVxyXG5cclxuXHRcdFx0cXVlcnkuJGFuZCA9IHF1ZXJ5X2FuZFxyXG5cdFx0XHRxdWVyeS5zcGFjZSA9IHskaW46IFtzcGFjZV19XHJcblxyXG5cdFx0XHRmaWVsZHMgPSB7X2lkOiAxfVxyXG5cdFx0XHRmaWVsZHNbX29iamVjdF9uYW1lX2tleV0gPSAxXHJcblxyXG5cdFx0XHRyZWNvcmRzID0gX29iamVjdF9jb2xsZWN0aW9uLmZpbmQocXVlcnksIHtmaWVsZHM6IGZpZWxkcywgc29ydDoge21vZGlmaWVkOiAxfSwgbGltaXQ6IDV9KVxyXG5cclxuXHRcdFx0cmVjb3Jkcy5mb3JFYWNoIChyZWNvcmQpLT5cclxuXHRcdFx0XHRkYXRhLnB1c2gge19pZDogcmVjb3JkLl9pZCwgX25hbWU6IHJlY29yZFtfb2JqZWN0X25hbWVfa2V5XSwgX29iamVjdF9uYW1lOiBvYmplY3RfbmFtZX1cclxuXHRcclxuXHRyZXR1cm4gZGF0YVxyXG5cclxuTWV0ZW9yLm1ldGhvZHNcclxuXHQnb2JqZWN0X3JlY2VudF9yZWNvcmQnOiAoc3BhY2VJZCktPlxyXG5cdFx0ZGF0YSA9IG5ldyBBcnJheSgpXHJcblx0XHRyZWNvcmRzID0gbmV3IEFycmF5KClcclxuXHRcdGFzeW5jX3JlY2VudF9hZ2dyZWdhdGUodGhpcy51c2VySWQsIHNwYWNlSWQsIHJlY29yZHMpXHJcblx0XHRyZWNvcmRzLmZvckVhY2ggKGl0ZW0pLT5cclxuXHRcdFx0cmVjb3JkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpXHJcblxyXG5cdFx0XHRpZiAhcmVjb3JkX29iamVjdFxyXG5cdFx0XHRcdHJldHVyblxyXG5cclxuXHRcdFx0cmVjb3JkX29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpXHJcblxyXG5cdFx0XHRpZiByZWNvcmRfb2JqZWN0ICYmIHJlY29yZF9vYmplY3RfY29sbGVjdGlvblxyXG5cdFx0XHRcdGZpZWxkcyA9IHtfaWQ6IDF9XHJcblxyXG5cdFx0XHRcdGZpZWxkc1tyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSA9IDFcclxuXHJcblx0XHRcdFx0cmVjb3JkID0gcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uLmZpbmRPbmUoaXRlbS5yZWNvcmRfaWRbMF0sIHtmaWVsZHM6IGZpZWxkc30pXHJcblx0XHRcdFx0aWYgcmVjb3JkXHJcblx0XHRcdFx0XHRkYXRhLnB1c2gge19pZDogcmVjb3JkLl9pZCwgX25hbWU6IHJlY29yZFtyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSwgX29iamVjdF9uYW1lOiBpdGVtLm9iamVjdF9uYW1lfVxyXG5cclxuXHRcdHJldHVybiBkYXRhXHJcblxyXG5cdCdvYmplY3RfcmVjb3JkX3NlYXJjaCc6IChvcHRpb25zKS0+XHJcblx0XHRzZWxmID0gdGhpc1xyXG5cclxuXHRcdGRhdGEgPSBuZXcgQXJyYXkoKVxyXG5cclxuXHRcdHNlYXJjaFRleHQgPSBvcHRpb25zLnNlYXJjaFRleHRcclxuXHRcdHNwYWNlID0gb3B0aW9ucy5zcGFjZVxyXG5cclxuXHRcdF8uZm9yRWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChfb2JqZWN0LCBuYW1lKS0+XHJcblx0XHRcdGlmIF9vYmplY3QuZW5hYmxlX3NlYXJjaFxyXG5cdFx0XHRcdG9iamVjdF9yZWNvcmQgPSBzZWFyY2hfb2JqZWN0KHNwYWNlLCBfb2JqZWN0Lm5hbWUsIHNlbGYudXNlcklkLCBzZWFyY2hUZXh0KVxyXG5cdFx0XHRcdGRhdGEgPSBkYXRhLmNvbmNhdChvYmplY3RfcmVjb3JkKVxyXG5cclxuXHRcdHJldHVybiBkYXRhXHJcbiIsInZhciBhc3luY19yZWNlbnRfYWdncmVnYXRlLCByZWNlbnRfYWdncmVnYXRlLCBzZWFyY2hfb2JqZWN0O1xuXG5yZWNlbnRfYWdncmVnYXRlID0gZnVuY3Rpb24oY3JlYXRlZF9ieSwgc3BhY2VJZCwgX3JlY29yZHMsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9yZWNlbnRfdmlld2VkLnJhd0NvbGxlY3Rpb24oKS5hZ2dyZWdhdGUoW1xuICAgIHtcbiAgICAgICRtYXRjaDoge1xuICAgICAgICBjcmVhdGVkX2J5OiBjcmVhdGVkX2J5LFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgICRncm91cDoge1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogXCIkcmVjb3JkLm9cIixcbiAgICAgICAgICByZWNvcmRfaWQ6IFwiJHJlY29yZC5pZHNcIixcbiAgICAgICAgICBzcGFjZTogXCIkc3BhY2VcIlxuICAgICAgICB9LFxuICAgICAgICBtYXhDcmVhdGVkOiB7XG4gICAgICAgICAgJG1heDogXCIkY3JlYXRlZFwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAkc29ydDoge1xuICAgICAgICBtYXhDcmVhdGVkOiAtMVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgICRsaW1pdDogMTBcbiAgICB9XG4gIF0pLnRvQXJyYXkoZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihkb2MpIHtcbiAgICAgIHJldHVybiBfcmVjb3Jkcy5wdXNoKGRvYy5faWQpO1xuICAgIH0pO1xuICAgIGlmIChjYWxsYmFjayAmJiBfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5hc3luY19yZWNlbnRfYWdncmVnYXRlID0gTWV0ZW9yLndyYXBBc3luYyhyZWNlbnRfYWdncmVnYXRlKTtcblxuc2VhcmNoX29iamVjdCA9IGZ1bmN0aW9uKHNwYWNlLCBvYmplY3RfbmFtZSwgdXNlcklkLCBzZWFyY2hUZXh0KSB7XG4gIHZhciBfb2JqZWN0LCBfb2JqZWN0X2NvbGxlY3Rpb24sIF9vYmplY3RfbmFtZV9rZXksIGRhdGEsIGZpZWxkcywgcXVlcnksIHF1ZXJ5X2FuZCwgcmVjb3Jkcywgc2VhcmNoX0tleXdvcmRzO1xuICBkYXRhID0gbmV3IEFycmF5KCk7XG4gIGlmIChzZWFyY2hUZXh0KSB7XG4gICAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpO1xuICAgIF9vYmplY3RfbmFtZV9rZXkgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lk5BTUVfRklFTERfS0VZIDogdm9pZCAwO1xuICAgIGlmIChfb2JqZWN0ICYmIF9vYmplY3RfY29sbGVjdGlvbiAmJiBfb2JqZWN0X25hbWVfa2V5KSB7XG4gICAgICBxdWVyeSA9IHt9O1xuICAgICAgc2VhcmNoX0tleXdvcmRzID0gc2VhcmNoVGV4dC5zcGxpdChcIiBcIik7XG4gICAgICBxdWVyeV9hbmQgPSBbXTtcbiAgICAgIHNlYXJjaF9LZXl3b3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKGtleXdvcmQpIHtcbiAgICAgICAgdmFyIHN1YnF1ZXJ5O1xuICAgICAgICBzdWJxdWVyeSA9IHt9O1xuICAgICAgICBzdWJxdWVyeVtfb2JqZWN0X25hbWVfa2V5XSA9IHtcbiAgICAgICAgICAkcmVnZXg6IGtleXdvcmQudHJpbSgpXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBxdWVyeV9hbmQucHVzaChzdWJxdWVyeSk7XG4gICAgICB9KTtcbiAgICAgIHF1ZXJ5LiRhbmQgPSBxdWVyeV9hbmQ7XG4gICAgICBxdWVyeS5zcGFjZSA9IHtcbiAgICAgICAgJGluOiBbc3BhY2VdXG4gICAgICB9O1xuICAgICAgZmllbGRzID0ge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH07XG4gICAgICBmaWVsZHNbX29iamVjdF9uYW1lX2tleV0gPSAxO1xuICAgICAgcmVjb3JkcyA9IF9vYmplY3RfY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCB7XG4gICAgICAgIGZpZWxkczogZmllbGRzLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgbW9kaWZpZWQ6IDFcbiAgICAgICAgfSxcbiAgICAgICAgbGltaXQ6IDVcbiAgICAgIH0pO1xuICAgICAgcmVjb3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICByZXR1cm4gZGF0YS5wdXNoKHtcbiAgICAgICAgICBfaWQ6IHJlY29yZC5faWQsXG4gICAgICAgICAgX25hbWU6IHJlY29yZFtfb2JqZWN0X25hbWVfa2V5XSxcbiAgICAgICAgICBfb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkYXRhO1xufTtcblxuTWV0ZW9yLm1ldGhvZHMoe1xuICAnb2JqZWN0X3JlY2VudF9yZWNvcmQnOiBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIGRhdGEsIHJlY29yZHM7XG4gICAgZGF0YSA9IG5ldyBBcnJheSgpO1xuICAgIHJlY29yZHMgPSBuZXcgQXJyYXkoKTtcbiAgICBhc3luY19yZWNlbnRfYWdncmVnYXRlKHRoaXMudXNlcklkLCBzcGFjZUlkLCByZWNvcmRzKTtcbiAgICByZWNvcmRzLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgdmFyIGZpZWxkcywgcmVjb3JkLCByZWNvcmRfb2JqZWN0LCByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb247XG4gICAgICByZWNvcmRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSk7XG4gICAgICBpZiAoIXJlY29yZF9vYmplY3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpO1xuICAgICAgaWYgKHJlY29yZF9vYmplY3QgJiYgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uKSB7XG4gICAgICAgIGZpZWxkcyA9IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfTtcbiAgICAgICAgZmllbGRzW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldID0gMTtcbiAgICAgICAgcmVjb3JkID0gcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uLmZpbmRPbmUoaXRlbS5yZWNvcmRfaWRbMF0sIHtcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICAgIHJldHVybiBkYXRhLnB1c2goe1xuICAgICAgICAgICAgX2lkOiByZWNvcmQuX2lkLFxuICAgICAgICAgICAgX25hbWU6IHJlY29yZFtyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSxcbiAgICAgICAgICAgIF9vYmplY3RfbmFtZTogaXRlbS5vYmplY3RfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH0sXG4gICdvYmplY3RfcmVjb3JkX3NlYXJjaCc6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgZGF0YSwgc2VhcmNoVGV4dCwgc2VsZiwgc3BhY2U7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgZGF0YSA9IG5ldyBBcnJheSgpO1xuICAgIHNlYXJjaFRleHQgPSBvcHRpb25zLnNlYXJjaFRleHQ7XG4gICAgc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICAgIF8uZm9yRWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKF9vYmplY3QsIG5hbWUpIHtcbiAgICAgIHZhciBvYmplY3RfcmVjb3JkO1xuICAgICAgaWYgKF9vYmplY3QuZW5hYmxlX3NlYXJjaCkge1xuICAgICAgICBvYmplY3RfcmVjb3JkID0gc2VhcmNoX29iamVjdChzcGFjZSwgX29iamVjdC5uYW1lLCBzZWxmLnVzZXJJZCwgc2VhcmNoVGV4dCk7XG4gICAgICAgIHJldHVybiBkYXRhID0gZGF0YS5jb25jYXQob2JqZWN0X3JlY29yZCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuICAgIHVwZGF0ZV9maWx0ZXJzOiAobGlzdHZpZXdfaWQsIGZpbHRlcnMsIGZpbHRlcl9zY29wZSwgZmlsdGVyX2xvZ2ljKS0+XHJcbiAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfbGlzdHZpZXdzLmRpcmVjdC51cGRhdGUoe19pZDogbGlzdHZpZXdfaWR9LCB7JHNldDoge2ZpbHRlcnM6IGZpbHRlcnMsIGZpbHRlcl9zY29wZTogZmlsdGVyX3Njb3BlLCBmaWx0ZXJfbG9naWM6IGZpbHRlcl9sb2dpY319KVxyXG5cclxuICAgIHVwZGF0ZV9jb2x1bW5zOiAobGlzdHZpZXdfaWQsIGNvbHVtbnMpLT5cclxuICAgICAgICBjaGVjayhjb2x1bW5zLCBBcnJheSlcclxuICAgICAgICBcclxuICAgICAgICBpZiBjb2x1bW5zLmxlbmd0aCA8IDFcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDAsIFwiU2VsZWN0IGF0IGxlYXN0IG9uZSBmaWVsZCB0byBkaXNwbGF5XCJcclxuICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MudXBkYXRlKHtfaWQ6IGxpc3R2aWV3X2lkfSwgeyRzZXQ6IHtjb2x1bW5zOiBjb2x1bW5zfX0pXHJcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgdXBkYXRlX2ZpbHRlcnM6IGZ1bmN0aW9uKGxpc3R2aWV3X2lkLCBmaWx0ZXJzLCBmaWx0ZXJfc2NvcGUsIGZpbHRlcl9sb2dpYykge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IGxpc3R2aWV3X2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBmaWx0ZXJzOiBmaWx0ZXJzLFxuICAgICAgICBmaWx0ZXJfc2NvcGU6IGZpbHRlcl9zY29wZSxcbiAgICAgICAgZmlsdGVyX2xvZ2ljOiBmaWx0ZXJfbG9naWNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlX2NvbHVtbnM6IGZ1bmN0aW9uKGxpc3R2aWV3X2lkLCBjb2x1bW5zKSB7XG4gICAgY2hlY2soY29sdW1ucywgQXJyYXkpO1xuICAgIGlmIChjb2x1bW5zLmxlbmd0aCA8IDEpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIlNlbGVjdCBhdCBsZWFzdCBvbmUgZmllbGQgdG8gZGlzcGxheVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy51cGRhdGUoe1xuICAgICAgX2lkOiBsaXN0dmlld19pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgY29sdW1uczogY29sdW1uc1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0J3JlcG9ydF9kYXRhJzogKG9wdGlvbnMpLT5cclxuXHRcdGNoZWNrKG9wdGlvbnMsIE9iamVjdClcclxuXHRcdHNwYWNlID0gb3B0aW9ucy5zcGFjZVxyXG5cdFx0ZmllbGRzID0gb3B0aW9ucy5maWVsZHNcclxuXHRcdG9iamVjdF9uYW1lID0gb3B0aW9ucy5vYmplY3RfbmFtZVxyXG5cdFx0ZmlsdGVyX3Njb3BlID0gb3B0aW9ucy5maWx0ZXJfc2NvcGVcclxuXHRcdGZpbHRlcnMgPSBvcHRpb25zLmZpbHRlcnNcclxuXHRcdGZpbHRlckZpZWxkcyA9IHt9XHJcblx0XHRjb21wb3VuZEZpZWxkcyA9IFtdXHJcblx0XHRvYmplY3RGaWVsZHMgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk/LmZpZWxkc1xyXG5cdFx0Xy5lYWNoIGZpZWxkcywgKGl0ZW0sIGluZGV4KS0+XHJcblx0XHRcdHNwbGl0cyA9IGl0ZW0uc3BsaXQoXCIuXCIpXHJcblx0XHRcdG5hbWUgPSBzcGxpdHNbMF1cclxuXHRcdFx0b2JqZWN0RmllbGQgPSBvYmplY3RGaWVsZHNbbmFtZV1cclxuXHRcdFx0aWYgc3BsaXRzLmxlbmd0aCA+IDEgYW5kIG9iamVjdEZpZWxkXHJcblx0XHRcdFx0Y2hpbGRLZXkgPSBpdGVtLnJlcGxhY2UgbmFtZSArIFwiLlwiLCBcIlwiXHJcblx0XHRcdFx0Y29tcG91bmRGaWVsZHMucHVzaCh7bmFtZTogbmFtZSwgY2hpbGRLZXk6IGNoaWxkS2V5LCBmaWVsZDogb2JqZWN0RmllbGR9KVxyXG5cdFx0XHRmaWx0ZXJGaWVsZHNbbmFtZV0gPSAxXHJcblxyXG5cdFx0c2VsZWN0b3IgPSB7fVxyXG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcclxuXHRcdHNlbGVjdG9yLnNwYWNlID0gc3BhY2VcclxuXHRcdGlmIGZpbHRlcl9zY29wZSA9PSBcInNwYWNleFwiXHJcblx0XHRcdHNlbGVjdG9yLnNwYWNlID0gXHJcblx0XHRcdFx0JGluOiBbbnVsbCxzcGFjZV1cclxuXHRcdGVsc2UgaWYgZmlsdGVyX3Njb3BlID09IFwibWluZVwiXHJcblx0XHRcdHNlbGVjdG9yLm93bmVyID0gdXNlcklkXHJcblxyXG5cdFx0aWYgQ3JlYXRvci5pc0NvbW1vblNwYWNlKHNwYWNlKSAmJiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZSwgQHVzZXJJZClcclxuXHRcdFx0ZGVsZXRlIHNlbGVjdG9yLnNwYWNlXHJcblxyXG5cdFx0aWYgZmlsdGVycyBhbmQgZmlsdGVycy5sZW5ndGggPiAwXHJcblx0XHRcdHNlbGVjdG9yW1wiJGFuZFwiXSA9IGZpbHRlcnNcclxuXHJcblx0XHRjdXJzb3IgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IsIHtmaWVsZHM6IGZpbHRlckZpZWxkcywgc2tpcDogMCwgbGltaXQ6IDEwMDAwfSlcclxuI1x0XHRpZiBjdXJzb3IuY291bnQoKSA+IDEwMDAwXHJcbiNcdFx0XHRyZXR1cm4gW11cclxuXHRcdHJlc3VsdCA9IGN1cnNvci5mZXRjaCgpXHJcblx0XHRpZiBjb21wb3VuZEZpZWxkcy5sZW5ndGhcclxuXHRcdFx0cmVzdWx0ID0gcmVzdWx0Lm1hcCAoaXRlbSxpbmRleCktPlxyXG5cdFx0XHRcdF8uZWFjaCBjb21wb3VuZEZpZWxkcywgKGNvbXBvdW5kRmllbGRJdGVtLCBpbmRleCktPlxyXG5cdFx0XHRcdFx0aXRlbUtleSA9IGNvbXBvdW5kRmllbGRJdGVtLm5hbWUgKyBcIiolKlwiICsgY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXkucmVwbGFjZSgvXFwuL2csIFwiKiUqXCIpXHJcblx0XHRcdFx0XHRpdGVtVmFsdWUgPSBpdGVtW2NvbXBvdW5kRmllbGRJdGVtLm5hbWVdXHJcblx0XHRcdFx0XHR0eXBlID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQudHlwZVxyXG5cdFx0XHRcdFx0aWYgW1wibG9va3VwXCIsIFwibWFzdGVyX2RldGFpbFwiXS5pbmRleE9mKHR5cGUpID4gLTFcclxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQucmVmZXJlbmNlX3RvXHJcblx0XHRcdFx0XHRcdGNvbXBvdW5kRmlsdGVyRmllbGRzID0ge31cclxuXHRcdFx0XHRcdFx0Y29tcG91bmRGaWx0ZXJGaWVsZHNbY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldID0gMVxyXG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VJdGVtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bykuZmluZE9uZSB7X2lkOiBpdGVtVmFsdWV9LCBmaWVsZHM6IGNvbXBvdW5kRmlsdGVyRmllbGRzXHJcblx0XHRcdFx0XHRcdGlmIHJlZmVyZW5jZUl0ZW1cclxuXHRcdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gcmVmZXJlbmNlSXRlbVtjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV1cclxuXHRcdFx0XHRcdGVsc2UgaWYgdHlwZSA9PSBcInNlbGVjdFwiXHJcblx0XHRcdFx0XHRcdG9wdGlvbnMgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5vcHRpb25zXHJcblx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSBfLmZpbmRXaGVyZShvcHRpb25zLCB7dmFsdWU6IGl0ZW1WYWx1ZX0pPy5sYWJlbCBvciBpdGVtVmFsdWVcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IGl0ZW1WYWx1ZVxyXG5cdFx0XHRcdFx0dW5sZXNzIGl0ZW1baXRlbUtleV1cclxuXHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IFwiLS1cIlxyXG5cdFx0XHRcdHJldHVybiBpdGVtXHJcblx0XHRcdHJldHVybiByZXN1bHRcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHJlc3VsdFxyXG5cclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICAncmVwb3J0X2RhdGEnOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGNvbXBvdW5kRmllbGRzLCBjdXJzb3IsIGZpZWxkcywgZmlsdGVyRmllbGRzLCBmaWx0ZXJfc2NvcGUsIGZpbHRlcnMsIG9iamVjdEZpZWxkcywgb2JqZWN0X25hbWUsIHJlZiwgcmVzdWx0LCBzZWxlY3Rvciwgc3BhY2UsIHVzZXJJZDtcbiAgICBjaGVjayhvcHRpb25zLCBPYmplY3QpO1xuICAgIHNwYWNlID0gb3B0aW9ucy5zcGFjZTtcbiAgICBmaWVsZHMgPSBvcHRpb25zLmZpZWxkcztcbiAgICBvYmplY3RfbmFtZSA9IG9wdGlvbnMub2JqZWN0X25hbWU7XG4gICAgZmlsdGVyX3Njb3BlID0gb3B0aW9ucy5maWx0ZXJfc2NvcGU7XG4gICAgZmlsdGVycyA9IG9wdGlvbnMuZmlsdGVycztcbiAgICBmaWx0ZXJGaWVsZHMgPSB7fTtcbiAgICBjb21wb3VuZEZpZWxkcyA9IFtdO1xuICAgIG9iamVjdEZpZWxkcyA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwO1xuICAgIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICB2YXIgY2hpbGRLZXksIG5hbWUsIG9iamVjdEZpZWxkLCBzcGxpdHM7XG4gICAgICBzcGxpdHMgPSBpdGVtLnNwbGl0KFwiLlwiKTtcbiAgICAgIG5hbWUgPSBzcGxpdHNbMF07XG4gICAgICBvYmplY3RGaWVsZCA9IG9iamVjdEZpZWxkc1tuYW1lXTtcbiAgICAgIGlmIChzcGxpdHMubGVuZ3RoID4gMSAmJiBvYmplY3RGaWVsZCkge1xuICAgICAgICBjaGlsZEtleSA9IGl0ZW0ucmVwbGFjZShuYW1lICsgXCIuXCIsIFwiXCIpO1xuICAgICAgICBjb21wb3VuZEZpZWxkcy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgIGNoaWxkS2V5OiBjaGlsZEtleSxcbiAgICAgICAgICBmaWVsZDogb2JqZWN0RmllbGRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmlsdGVyRmllbGRzW25hbWVdID0gMTtcbiAgICB9KTtcbiAgICBzZWxlY3RvciA9IHt9O1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2U7XG4gICAgaWYgKGZpbHRlcl9zY29wZSA9PT0gXCJzcGFjZXhcIikge1xuICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAgICRpbjogW251bGwsIHNwYWNlXVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGZpbHRlcl9zY29wZSA9PT0gXCJtaW5lXCIpIHtcbiAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICAgIH1cbiAgICBpZiAoQ3JlYXRvci5pc0NvbW1vblNwYWNlKHNwYWNlKSAmJiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZSwgdGhpcy51c2VySWQpKSB7XG4gICAgICBkZWxldGUgc2VsZWN0b3Iuc3BhY2U7XG4gICAgfVxuICAgIGlmIChmaWx0ZXJzICYmIGZpbHRlcnMubGVuZ3RoID4gMCkge1xuICAgICAgc2VsZWN0b3JbXCIkYW5kXCJdID0gZmlsdGVycztcbiAgICB9XG4gICAgY3Vyc29yID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yLCB7XG4gICAgICBmaWVsZHM6IGZpbHRlckZpZWxkcyxcbiAgICAgIHNraXA6IDAsXG4gICAgICBsaW1pdDogMTAwMDBcbiAgICB9KTtcbiAgICByZXN1bHQgPSBjdXJzb3IuZmV0Y2goKTtcbiAgICBpZiAoY29tcG91bmRGaWVsZHMubGVuZ3RoKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHQubWFwKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgIF8uZWFjaChjb21wb3VuZEZpZWxkcywgZnVuY3Rpb24oY29tcG91bmRGaWVsZEl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgdmFyIGNvbXBvdW5kRmlsdGVyRmllbGRzLCBpdGVtS2V5LCBpdGVtVmFsdWUsIHJlZjEsIHJlZmVyZW5jZUl0ZW0sIHJlZmVyZW5jZV90bywgdHlwZTtcbiAgICAgICAgICBpdGVtS2V5ID0gY29tcG91bmRGaWVsZEl0ZW0ubmFtZSArIFwiKiUqXCIgKyBjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleS5yZXBsYWNlKC9cXC4vZywgXCIqJSpcIik7XG4gICAgICAgICAgaXRlbVZhbHVlID0gaXRlbVtjb21wb3VuZEZpZWxkSXRlbS5uYW1lXTtcbiAgICAgICAgICB0eXBlID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQudHlwZTtcbiAgICAgICAgICBpZiAoW1wibG9va3VwXCIsIFwibWFzdGVyX2RldGFpbFwiXS5pbmRleE9mKHR5cGUpID4gLTEpIHtcbiAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgIGNvbXBvdW5kRmlsdGVyRmllbGRzID0ge307XG4gICAgICAgICAgICBjb21wb3VuZEZpbHRlckZpZWxkc1tjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV0gPSAxO1xuICAgICAgICAgICAgcmVmZXJlbmNlSXRlbSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8pLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IGl0ZW1WYWx1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IGNvbXBvdW5kRmlsdGVyRmllbGRzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyZWZlcmVuY2VJdGVtKSB7XG4gICAgICAgICAgICAgIGl0ZW1baXRlbUtleV0gPSByZWZlcmVuY2VJdGVtW2NvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5vcHRpb25zO1xuICAgICAgICAgICAgaXRlbVtpdGVtS2V5XSA9ICgocmVmMSA9IF8uZmluZFdoZXJlKG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgdmFsdWU6IGl0ZW1WYWx1ZVxuICAgICAgICAgICAgfSkpICE9IG51bGwgPyByZWYxLmxhYmVsIDogdm9pZCAwKSB8fCBpdGVtVmFsdWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl0ZW1baXRlbUtleV0gPSBpdGVtVmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghaXRlbVtpdGVtS2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW1baXRlbUtleV0gPSBcIi0tXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG59KTtcbiIsIiMjI1xyXG4gICAgdHlwZTogXCJ1c2VyXCJcclxuICAgIG9iamVjdF9uYW1lOiBcIm9iamVjdF9saXN0dmlld3NcIlxyXG4gICAgcmVjb3JkX2lkOiBcIntvYmplY3RfbmFtZX0se2xpc3R2aWV3X2lkfVwiXHJcbiAgICBzZXR0aW5nczpcclxuICAgICAgICBjb2x1bW5fd2lkdGg6IHsgZmllbGRfYTogMTAwLCBmaWVsZF8yOiAxNTAgfVxyXG4gICAgICAgIHNvcnQ6IFtbXCJmaWVsZF9hXCIsIFwiZGVzY1wiXV1cclxuICAgIG93bmVyOiB7dXNlcklkfVxyXG4jIyNcclxuXHJcbk1ldGVvci5tZXRob2RzXHJcbiAgICBcInRhYnVsYXJfc29ydF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgc29ydCktPlxyXG4gICAgICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXHJcbiAgICAgICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLCBvd25lcjogdXNlcklkfSlcclxuICAgICAgICBpZiBzZXR0aW5nXHJcbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5zb3J0XCI6IHNvcnR9fSlcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGRvYyA9IFxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJ1c2VyXCJcclxuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxyXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHt9XHJcbiAgICAgICAgICAgICAgICBvd25lcjogdXNlcklkXHJcblxyXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9XHJcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0XHJcblxyXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpXHJcblxyXG4gICAgXCJ0YWJ1bGFyX2NvbHVtbl93aWR0aF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoKS0+XHJcbiAgICAgICAgdXNlcklkID0gdGhpcy51c2VySWRcclxuICAgICAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsIG93bmVyOiB1c2VySWR9KVxyXG4gICAgICAgIGlmIHNldHRpbmdcclxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LmNvbHVtbl93aWR0aFwiOiBjb2x1bW5fd2lkdGh9fSlcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGRvYyA9IFxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJ1c2VyXCJcclxuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxyXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHt9XHJcbiAgICAgICAgICAgICAgICBvd25lcjogdXNlcklkXHJcblxyXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9XHJcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aFxyXG5cclxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKVxyXG5cclxuICAgIFwiZ3JpZF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoLCBzb3J0KS0+XHJcbiAgICAgICAgdXNlcklkID0gdGhpcy51c2VySWRcclxuICAgICAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCIsIG93bmVyOiB1c2VySWR9KVxyXG4gICAgICAgIGlmIHNldHRpbmdcclxuICAgICAgICAgICAgIyDmr4/mrKHpg73lvLrliLbmlLnlj5hfaWRfYWN0aW9uc+WIl+eahOWuveW6pu+8jOS7peino+WGs+W9k+eUqOaIt+WPquaUueWPmOWtl+auteasoeW6j+iAjOayoeacieaUueWPmOS7u+S9leWtl+auteWuveW6puaXtu+8jOWJjeerr+ayoeacieiuoumYheWIsOWtl+auteasoeW6j+WPmOabtOeahOaVsOaNrueahOmXrumimFxyXG4gICAgICAgICAgICBjb2x1bW5fd2lkdGguX2lkX2FjdGlvbnMgPSBpZiBzZXR0aW5nLnNldHRpbmdzW1wiI3tsaXN0X3ZpZXdfaWR9XCJdPy5jb2x1bW5fd2lkdGg/Ll9pZF9hY3Rpb25zID09IDQ2IHRoZW4gNDcgZWxzZSA0NlxyXG4gICAgICAgICAgICBpZiBzb3J0XHJcbiAgICAgICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uc29ydFwiOiBzb3J0LCBcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5jb2x1bW5fd2lkdGhcIjogY29sdW1uX3dpZHRofX0pXHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5jb2x1bW5fd2lkdGhcIjogY29sdW1uX3dpZHRofX0pXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBkb2MgPVxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJ1c2VyXCJcclxuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxyXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIlxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHt9XHJcbiAgICAgICAgICAgICAgICBvd25lcjogdXNlcklkXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9XHJcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aFxyXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydFxyXG5cclxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKSIsIlxuLypcbiAgICB0eXBlOiBcInVzZXJcIlxuICAgIG9iamVjdF9uYW1lOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICAgIHJlY29yZF9pZDogXCJ7b2JqZWN0X25hbWV9LHtsaXN0dmlld19pZH1cIlxuICAgIHNldHRpbmdzOlxuICAgICAgICBjb2x1bW5fd2lkdGg6IHsgZmllbGRfYTogMTAwLCBmaWVsZF8yOiAxNTAgfVxuICAgICAgICBzb3J0OiBbW1wiZmllbGRfYVwiLCBcImRlc2NcIl1dXG4gICAgb3duZXI6IHt1c2VySWR9XG4gKi9cbk1ldGVvci5tZXRob2RzKHtcbiAgXCJ0YWJ1bGFyX3NvcnRfc2V0dGluZ3NcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgc29ydCkge1xuICAgIHZhciBkb2MsIG9iaiwgc2V0dGluZywgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgIG93bmVyOiB1c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc2V0dGluZykge1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgb2JqID0ge30sXG4gICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5zb3J0XCJdID0gc29ydCxcbiAgICAgICAgICBvYmpcbiAgICAgICAgKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYyA9IHtcbiAgICAgICAgdHlwZTogXCJ1c2VyXCIsXG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgICAgc2V0dGluZ3M6IHt9LFxuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0O1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYyk7XG4gICAgfVxuICB9LFxuICBcInRhYnVsYXJfY29sdW1uX3dpZHRoX3NldHRpbmdzXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbl93aWR0aCkge1xuICAgIHZhciBkb2MsIG9iaiwgc2V0dGluZywgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgIG93bmVyOiB1c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc2V0dGluZykge1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgb2JqID0ge30sXG4gICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5jb2x1bW5fd2lkdGhcIl0gPSBjb2x1bW5fd2lkdGgsXG4gICAgICAgICAgb2JqXG4gICAgICAgIClcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2MgPSB7XG4gICAgICAgIHR5cGU6IFwidXNlclwiLFxuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge307XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5jb2x1bW5fd2lkdGggPSBjb2x1bW5fd2lkdGg7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH0sXG4gIFwiZ3JpZF9zZXR0aW5nc1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5fd2lkdGgsIHNvcnQpIHtcbiAgICB2YXIgZG9jLCBvYmosIG9iajEsIHJlZiwgcmVmMSwgc2V0dGluZywgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIixcbiAgICAgIG93bmVyOiB1c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc2V0dGluZykge1xuICAgICAgY29sdW1uX3dpZHRoLl9pZF9hY3Rpb25zID0gKChyZWYgPSBzZXR0aW5nLnNldHRpbmdzW1wiXCIgKyBsaXN0X3ZpZXdfaWRdKSAhPSBudWxsID8gKHJlZjEgPSByZWYuY29sdW1uX3dpZHRoKSAhPSBudWxsID8gcmVmMS5faWRfYWN0aW9ucyA6IHZvaWQgMCA6IHZvaWQgMCkgPT09IDQ2ID8gNDcgOiA0NjtcbiAgICAgIGlmIChzb3J0KSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDogKFxuICAgICAgICAgICAgb2JqID0ge30sXG4gICAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLnNvcnRcIl0gPSBzb3J0LFxuICAgICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5jb2x1bW5fd2lkdGhcIl0gPSBjb2x1bW5fd2lkdGgsXG4gICAgICAgICAgICBvYmpcbiAgICAgICAgICApXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgICBvYmoxID0ge30sXG4gICAgICAgICAgICBvYmoxW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5jb2x1bW5fd2lkdGhcIl0gPSBjb2x1bW5fd2lkdGgsXG4gICAgICAgICAgICBvYmoxXG4gICAgICAgICAgKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZG9jID0ge1xuICAgICAgICB0eXBlOiBcInVzZXJcIixcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiLFxuICAgICAgICBzZXR0aW5nczoge30sXG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH07XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoO1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnQ7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH1cbn0pO1xuIiwieG1sMmpzID0gcmVxdWlyZSAneG1sMmpzJ1xyXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xyXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcclxubWtkaXJwID0gcmVxdWlyZSAnbWtkaXJwJ1xyXG5cclxubG9nZ2VyID0gbmV3IExvZ2dlciAnRXhwb3J0X1RPX1hNTCdcclxuXHJcbl93cml0ZVhtbEZpbGUgPSAoanNvbk9iaixvYmpOYW1lKSAtPlxyXG5cdCMg6L2seG1sXHJcblx0YnVpbGRlciA9IG5ldyB4bWwyanMuQnVpbGRlcigpXHJcblx0eG1sID0gYnVpbGRlci5idWlsZE9iamVjdCBqc29uT2JqXHJcblxyXG5cdCMg6L2s5Li6YnVmZmVyXHJcblx0c3RyZWFtID0gbmV3IEJ1ZmZlciB4bWxcclxuXHJcblx0IyDmoLnmja7lvZPlpKnml7bpl7TnmoTlubTmnIjml6XkvZzkuLrlrZjlgqjot6/lvoRcclxuXHRub3cgPSBuZXcgRGF0ZVxyXG5cdHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxyXG5cdG1vbnRoID0gbm93LmdldE1vbnRoKCkgKyAxXHJcblx0ZGF5ID0gbm93LmdldERhdGUoKVxyXG5cclxuXHQjIOaWh+S7tui3r+W+hFxyXG5cdGZpbGVQYXRoID0gcGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwnLi4vLi4vLi4vZXhwb3J0LycgKyB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBkYXkgKyAnLycgKyBvYmpOYW1lIClcclxuXHRmaWxlTmFtZSA9IGpzb25PYmo/Ll9pZCArIFwiLnhtbFwiXHJcblx0ZmlsZUFkZHJlc3MgPSBwYXRoLmpvaW4gZmlsZVBhdGgsIGZpbGVOYW1lXHJcblxyXG5cdGlmICFmcy5leGlzdHNTeW5jIGZpbGVQYXRoXHJcblx0XHRta2RpcnAuc3luYyBmaWxlUGF0aFxyXG5cclxuXHQjIOWGmeWFpeaWh+S7tlxyXG5cdGZzLndyaXRlRmlsZSBmaWxlQWRkcmVzcywgc3RyZWFtLCAoZXJyKSAtPlxyXG5cdFx0aWYgZXJyXHJcblx0XHRcdGxvZ2dlci5lcnJvciBcIiN7anNvbk9iai5faWR95YaZ5YWleG1s5paH5Lu25aSx6LSlXCIsZXJyXHJcblx0XHJcblx0cmV0dXJuIGZpbGVQYXRoXHJcblxyXG5cclxuIyDmlbTnkIZGaWVsZHPnmoRqc29u5pWw5o2uXHJcbl9taXhGaWVsZHNEYXRhID0gKG9iaixvYmpOYW1lKSAtPlxyXG5cdCMg5Yid5aeL5YyW5a+56LGh5pWw5o2uXHJcblx0anNvbk9iaiA9IHt9XHJcblx0IyDojrflj5ZmaWVsZHNcclxuXHRvYmpGaWVsZHMgPSBDcmVhdG9yPy5nZXRPYmplY3Qob2JqTmFtZSk/LmZpZWxkc1xyXG5cclxuXHRtaXhEZWZhdWx0ID0gKGZpZWxkX25hbWUpLT5cclxuXHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBvYmpbZmllbGRfbmFtZV0gfHwgXCJcIlxyXG5cclxuXHRtaXhEYXRlID0gKGZpZWxkX25hbWUsdHlwZSktPlxyXG5cdFx0ZGF0ZSA9IG9ialtmaWVsZF9uYW1lXVxyXG5cdFx0aWYgdHlwZSA9PSBcImRhdGVcIlxyXG5cdFx0XHRmb3JtYXQgPSBcIllZWVktTU0tRERcIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW06c3NcIlxyXG5cdFx0aWYgZGF0ZT8gYW5kIGZvcm1hdD9cclxuXHRcdFx0ZGF0ZVN0ciA9IG1vbWVudChkYXRlKS5mb3JtYXQoZm9ybWF0KVxyXG5cdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IGRhdGVTdHIgfHwgXCJcIlxyXG5cclxuXHRtaXhCb29sID0gKGZpZWxkX25hbWUpLT5cclxuXHRcdGlmIG9ialtmaWVsZF9uYW1lXSA9PSB0cnVlXHJcblx0XHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuaYr1wiXHJcblx0XHRlbHNlIGlmIG9ialtmaWVsZF9uYW1lXSA9PSBmYWxzZVxyXG5cdFx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLlkKZcIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gXCJcIlxyXG5cclxuXHQjIOW+queOr+avj+S4qmZpZWxkcyzlubbliKTmlq3lj5blgLxcclxuXHRfLmVhY2ggb2JqRmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cclxuXHRcdHN3aXRjaCBmaWVsZD8udHlwZVxyXG5cdFx0XHR3aGVuIFwiZGF0ZVwiLFwiZGF0ZXRpbWVcIiB0aGVuIG1peERhdGUgZmllbGRfbmFtZSxmaWVsZC50eXBlXHJcblx0XHRcdHdoZW4gXCJib29sZWFuXCIgdGhlbiBtaXhCb29sIGZpZWxkX25hbWVcclxuXHRcdFx0ZWxzZSBtaXhEZWZhdWx0IGZpZWxkX25hbWVcclxuXHJcblx0cmV0dXJuIGpzb25PYmpcclxuXHJcbiMg6I635Y+W5a2Q6KGo5pW055CG5pWw5o2uXHJcbl9taXhSZWxhdGVkRGF0YSA9IChvYmosb2JqTmFtZSkgLT5cclxuXHQjIOWIneWni+WMluWvueixoeaVsOaNrlxyXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IHt9XHJcblxyXG5cdCMg6I635Y+W55u45YWz6KGoXHJcblx0cmVsYXRlZE9iak5hbWVzID0gQ3JlYXRvcj8uZ2V0QWxsUmVsYXRlZE9iamVjdHMgb2JqTmFtZVxyXG5cclxuXHQjIOW+queOr+ebuOWFs+ihqFxyXG5cdHJlbGF0ZWRPYmpOYW1lcy5mb3JFYWNoIChyZWxhdGVkT2JqTmFtZSkgLT5cclxuXHRcdCMg5q+P5Liq6KGo5a6a5LmJ5LiA5Liq5a+56LGh5pWw57uEXHJcblx0XHRyZWxhdGVkVGFibGVEYXRhID0gW11cclxuXHJcblx0XHQjICrorr7nva7lhbPogZTmkJzntKLmn6Xor6LnmoTlrZfmrrVcclxuXHRcdCMg6ZmE5Lu255qE5YWz6IGU5pCc57Si5a2X5q615piv5a6a5q2755qEXHJcblx0XHRpZiByZWxhdGVkT2JqTmFtZSA9PSBcImNtc19maWxlc1wiXHJcblx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwicGFyZW50Lmlkc1wiXHJcblx0XHRlbHNlXHJcblx0XHRcdCMg6I635Y+WZmllbGRzXHJcblx0XHRcdGZpZWxkcyA9IENyZWF0b3I/Lk9iamVjdHNbcmVsYXRlZE9iak5hbWVdPy5maWVsZHNcclxuXHRcdFx0IyDlvqrnjq/mr4/kuKpmaWVsZCzmib7lh7pyZWZlcmVuY2VfdG/nmoTlhbPogZTlrZfmrrVcclxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gXCJcIlxyXG5cdFx0XHRfLmVhY2ggZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cclxuXHRcdFx0XHRpZiBmaWVsZD8ucmVmZXJlbmNlX3RvID09IG9iak5hbWVcclxuXHRcdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IGZpZWxkX25hbWVcclxuXHJcblx0XHQjIOagueaNruaJvuWHuueahOWFs+iBlOWtl+aute+8jOafpeWtkOihqOaVsOaNrlxyXG5cdFx0aWYgcmVsYXRlZF9maWVsZF9uYW1lXHJcblx0XHRcdHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmpOYW1lKVxyXG5cdFx0XHQjIOiOt+WPluWIsOaJgOacieeahOaVsOaNrlxyXG5cdFx0XHRyZWxhdGVkUmVjb3JkTGlzdCA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoe1wiI3tyZWxhdGVkX2ZpZWxkX25hbWV9XCI6b2JqLl9pZH0pLmZldGNoKClcclxuXHRcdFx0IyDlvqrnjq/mr4/kuIDmnaHmlbDmja5cclxuXHRcdFx0cmVsYXRlZFJlY29yZExpc3QuZm9yRWFjaCAocmVsYXRlZE9iaiktPlxyXG5cdFx0XHRcdCMg5pW05ZCIZmllbGRz5pWw5o2uXHJcblx0XHRcdFx0ZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhIHJlbGF0ZWRPYmoscmVsYXRlZE9iak5hbWVcclxuXHRcdFx0XHQjIOaKiuS4gOadoeiusOW9leaPkuWFpeWIsOWvueixoeaVsOe7hOS4rVxyXG5cdFx0XHRcdHJlbGF0ZWRUYWJsZURhdGEucHVzaCBmaWVsZHNEYXRhXHJcblxyXG5cdFx0IyDmiorkuIDkuKrlrZDooajnmoTmiYDmnInmlbDmja7mj5LlhaXliLByZWxhdGVkX29iamVjdHPkuK3vvIzlho3lvqrnjq/kuIvkuIDkuKpcclxuXHRcdHJlbGF0ZWRfb2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0gPSByZWxhdGVkVGFibGVEYXRhXHJcblxyXG5cdHJldHVybiByZWxhdGVkX29iamVjdHNcclxuXHJcbiMgQ3JlYXRvci5FeHBvcnQyeG1sKClcclxuQ3JlYXRvci5FeHBvcnQyeG1sID0gKG9iak5hbWUsIHJlY29yZExpc3QpIC0+XHJcblx0bG9nZ2VyLmluZm8gXCJSdW4gQ3JlYXRvci5FeHBvcnQyeG1sXCJcclxuXHJcblx0Y29uc29sZS50aW1lIFwiQ3JlYXRvci5FeHBvcnQyeG1sXCJcclxuXHJcblx0IyDmtYvor5XmlbDmja5cclxuXHQjIG9iak5hbWUgPSBcImFyY2hpdmVfcmVjb3Jkc1wiXHJcblxyXG5cdCMg5p+l5om+5a+56LGh5pWw5o2uXHJcblx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKVxyXG5cdCMg5rWL6K+V5pWw5o2uXHJcblx0cmVjb3JkTGlzdCA9IGNvbGxlY3Rpb24uZmluZCh7fSkuZmV0Y2goKVxyXG5cclxuXHRyZWNvcmRMaXN0LmZvckVhY2ggKHJlY29yZE9iaiktPlxyXG5cdFx0anNvbk9iaiA9IHt9XHJcblx0XHRqc29uT2JqLl9pZCA9IHJlY29yZE9iai5faWRcclxuXHJcblx0XHQjIOaVtOeQhuS4u+ihqOeahEZpZWxkc+aVsOaNrlxyXG5cdFx0ZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhIHJlY29yZE9iaixvYmpOYW1lXHJcblx0XHRqc29uT2JqW29iak5hbWVdID0gZmllbGRzRGF0YVxyXG5cclxuXHRcdCMg5pW055CG55u45YWz6KGo5pWw5o2uXHJcblx0XHRyZWxhdGVkX29iamVjdHMgPSBfbWl4UmVsYXRlZERhdGEgcmVjb3JkT2JqLG9iak5hbWVcclxuXHJcblx0XHRqc29uT2JqW1wicmVsYXRlZF9vYmplY3RzXCJdID0gcmVsYXRlZF9vYmplY3RzXHJcblxyXG5cdFx0IyDovazkuLp4bWzkv53lrZjmlofku7ZcclxuXHRcdGZpbGVQYXRoID0gX3dyaXRlWG1sRmlsZSBqc29uT2JqLG9iak5hbWVcclxuXHJcblx0Y29uc29sZS50aW1lRW5kIFwiQ3JlYXRvci5FeHBvcnQyeG1sXCJcclxuXHRyZXR1cm4gZmlsZVBhdGgiLCJ2YXIgX21peEZpZWxkc0RhdGEsIF9taXhSZWxhdGVkRGF0YSwgX3dyaXRlWG1sRmlsZSwgZnMsIGxvZ2dlciwgbWtkaXJwLCBwYXRoLCB4bWwyanM7XG5cbnhtbDJqcyA9IHJlcXVpcmUoJ3htbDJqcycpO1xuXG5mcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cbnBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbm1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpO1xuXG5sb2dnZXIgPSBuZXcgTG9nZ2VyKCdFeHBvcnRfVE9fWE1MJyk7XG5cbl93cml0ZVhtbEZpbGUgPSBmdW5jdGlvbihqc29uT2JqLCBvYmpOYW1lKSB7XG4gIHZhciBidWlsZGVyLCBkYXksIGZpbGVBZGRyZXNzLCBmaWxlTmFtZSwgZmlsZVBhdGgsIG1vbnRoLCBub3csIHN0cmVhbSwgeG1sLCB5ZWFyO1xuICBidWlsZGVyID0gbmV3IHhtbDJqcy5CdWlsZGVyKCk7XG4gIHhtbCA9IGJ1aWxkZXIuYnVpbGRPYmplY3QoanNvbk9iaik7XG4gIHN0cmVhbSA9IG5ldyBCdWZmZXIoeG1sKTtcbiAgbm93ID0gbmV3IERhdGU7XG4gIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgbW9udGggPSBub3cuZ2V0TW9udGgoKSArIDE7XG4gIGRheSA9IG5vdy5nZXREYXRlKCk7XG4gIGZpbGVQYXRoID0gcGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwgJy4uLy4uLy4uL2V4cG9ydC8nICsgeWVhciArICcvJyArIG1vbnRoICsgJy8nICsgZGF5ICsgJy8nICsgb2JqTmFtZSk7XG4gIGZpbGVOYW1lID0gKGpzb25PYmogIT0gbnVsbCA/IGpzb25PYmouX2lkIDogdm9pZCAwKSArIFwiLnhtbFwiO1xuICBmaWxlQWRkcmVzcyA9IHBhdGguam9pbihmaWxlUGF0aCwgZmlsZU5hbWUpO1xuICBpZiAoIWZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XG4gICAgbWtkaXJwLnN5bmMoZmlsZVBhdGgpO1xuICB9XG4gIGZzLndyaXRlRmlsZShmaWxlQWRkcmVzcywgc3RyZWFtLCBmdW5jdGlvbihlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICByZXR1cm4gbG9nZ2VyLmVycm9yKGpzb25PYmouX2lkICsgXCLlhpnlhaV4bWzmlofku7blpLHotKVcIiwgZXJyKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmlsZVBhdGg7XG59O1xuXG5fbWl4RmllbGRzRGF0YSA9IGZ1bmN0aW9uKG9iaiwgb2JqTmFtZSkge1xuICB2YXIganNvbk9iaiwgbWl4Qm9vbCwgbWl4RGF0ZSwgbWl4RGVmYXVsdCwgb2JqRmllbGRzLCByZWY7XG4gIGpzb25PYmogPSB7fTtcbiAgb2JqRmllbGRzID0gdHlwZW9mIENyZWF0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgQ3JlYXRvciAhPT0gbnVsbCA/IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmpOYW1lKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIG1peERlZmF1bHQgPSBmdW5jdGlvbihmaWVsZF9uYW1lKSB7XG4gICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBvYmpbZmllbGRfbmFtZV0gfHwgXCJcIjtcbiAgfTtcbiAgbWl4RGF0ZSA9IGZ1bmN0aW9uKGZpZWxkX25hbWUsIHR5cGUpIHtcbiAgICB2YXIgZGF0ZSwgZGF0ZVN0ciwgZm9ybWF0O1xuICAgIGRhdGUgPSBvYmpbZmllbGRfbmFtZV07XG4gICAgaWYgKHR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICBmb3JtYXQgPSBcIllZWVktTU0tRERcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9ybWF0ID0gXCJZWVlZLU1NLUREIEhIOm1tOnNzXCI7XG4gICAgfVxuICAgIGlmICgoZGF0ZSAhPSBudWxsKSAmJiAoZm9ybWF0ICE9IG51bGwpKSB7XG4gICAgICBkYXRlU3RyID0gbW9tZW50KGRhdGUpLmZvcm1hdChmb3JtYXQpO1xuICAgIH1cbiAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IGRhdGVTdHIgfHwgXCJcIjtcbiAgfTtcbiAgbWl4Qm9vbCA9IGZ1bmN0aW9uKGZpZWxkX25hbWUpIHtcbiAgICBpZiAob2JqW2ZpZWxkX25hbWVdID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5pivXCI7XG4gICAgfSBlbHNlIGlmIChvYmpbZmllbGRfbmFtZV0gPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5ZCmXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gXCJcIjtcbiAgICB9XG4gIH07XG4gIF8uZWFjaChvYmpGaWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgc3dpdGNoIChmaWVsZCAhPSBudWxsID8gZmllbGQudHlwZSA6IHZvaWQgMCkge1xuICAgICAgY2FzZSBcImRhdGVcIjpcbiAgICAgIGNhc2UgXCJkYXRldGltZVwiOlxuICAgICAgICByZXR1cm4gbWl4RGF0ZShmaWVsZF9uYW1lLCBmaWVsZC50eXBlKTtcbiAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgIHJldHVybiBtaXhCb29sKGZpZWxkX25hbWUpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG1peERlZmF1bHQoZmllbGRfbmFtZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGpzb25PYmo7XG59O1xuXG5fbWl4UmVsYXRlZERhdGEgPSBmdW5jdGlvbihvYmosIG9iak5hbWUpIHtcbiAgdmFyIHJlbGF0ZWRPYmpOYW1lcywgcmVsYXRlZF9vYmplY3RzO1xuICByZWxhdGVkX29iamVjdHMgPSB7fTtcbiAgcmVsYXRlZE9iak5hbWVzID0gdHlwZW9mIENyZWF0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgQ3JlYXRvciAhPT0gbnVsbCA/IENyZWF0b3IuZ2V0QWxsUmVsYXRlZE9iamVjdHMob2JqTmFtZSkgOiB2b2lkIDA7XG4gIHJlbGF0ZWRPYmpOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKHJlbGF0ZWRPYmpOYW1lKSB7XG4gICAgdmFyIGZpZWxkcywgb2JqMSwgcmVmLCByZWxhdGVkQ29sbGVjdGlvbiwgcmVsYXRlZFJlY29yZExpc3QsIHJlbGF0ZWRUYWJsZURhdGEsIHJlbGF0ZWRfZmllbGRfbmFtZTtcbiAgICByZWxhdGVkVGFibGVEYXRhID0gW107XG4gICAgaWYgKHJlbGF0ZWRPYmpOYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSBcInBhcmVudC5pZHNcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZmllbGRzID0gdHlwZW9mIENyZWF0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgQ3JlYXRvciAhPT0gbnVsbCA/IChyZWYgPSBDcmVhdG9yLk9iamVjdHNbcmVsYXRlZE9iak5hbWVdKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwiXCI7XG4gICAgICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgICAgICBpZiAoKGZpZWxkICE9IG51bGwgPyBmaWVsZC5yZWZlcmVuY2VfdG8gOiB2b2lkIDApID09PSBvYmpOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfZmllbGRfbmFtZSA9IGZpZWxkX25hbWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAocmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICByZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqTmFtZSk7XG4gICAgICByZWxhdGVkUmVjb3JkTGlzdCA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoKFxuICAgICAgICBvYmoxID0ge30sXG4gICAgICAgIG9iajFbXCJcIiArIHJlbGF0ZWRfZmllbGRfbmFtZV0gPSBvYmouX2lkLFxuICAgICAgICBvYmoxXG4gICAgICApKS5mZXRjaCgpO1xuICAgICAgcmVsYXRlZFJlY29yZExpc3QuZm9yRWFjaChmdW5jdGlvbihyZWxhdGVkT2JqKSB7XG4gICAgICAgIHZhciBmaWVsZHNEYXRhO1xuICAgICAgICBmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEocmVsYXRlZE9iaiwgcmVsYXRlZE9iak5hbWUpO1xuICAgICAgICByZXR1cm4gcmVsYXRlZFRhYmxlRGF0YS5wdXNoKGZpZWxkc0RhdGEpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZWxhdGVkX29iamVjdHNbcmVsYXRlZE9iak5hbWVdID0gcmVsYXRlZFRhYmxlRGF0YTtcbiAgfSk7XG4gIHJldHVybiByZWxhdGVkX29iamVjdHM7XG59O1xuXG5DcmVhdG9yLkV4cG9ydDJ4bWwgPSBmdW5jdGlvbihvYmpOYW1lLCByZWNvcmRMaXN0KSB7XG4gIHZhciBjb2xsZWN0aW9uO1xuICBsb2dnZXIuaW5mbyhcIlJ1biBDcmVhdG9yLkV4cG9ydDJ4bWxcIik7XG4gIGNvbnNvbGUudGltZShcIkNyZWF0b3IuRXhwb3J0MnhtbFwiKTtcbiAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKTtcbiAgcmVjb3JkTGlzdCA9IGNvbGxlY3Rpb24uZmluZCh7fSkuZmV0Y2goKTtcbiAgcmVjb3JkTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHJlY29yZE9iaikge1xuICAgIHZhciBmaWVsZHNEYXRhLCBmaWxlUGF0aCwganNvbk9iaiwgcmVsYXRlZF9vYmplY3RzO1xuICAgIGpzb25PYmogPSB7fTtcbiAgICBqc29uT2JqLl9pZCA9IHJlY29yZE9iai5faWQ7XG4gICAgZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhKHJlY29yZE9iaiwgb2JqTmFtZSk7XG4gICAganNvbk9ialtvYmpOYW1lXSA9IGZpZWxkc0RhdGE7XG4gICAgcmVsYXRlZF9vYmplY3RzID0gX21peFJlbGF0ZWREYXRhKHJlY29yZE9iaiwgb2JqTmFtZSk7XG4gICAganNvbk9ialtcInJlbGF0ZWRfb2JqZWN0c1wiXSA9IHJlbGF0ZWRfb2JqZWN0cztcbiAgICByZXR1cm4gZmlsZVBhdGggPSBfd3JpdGVYbWxGaWxlKGpzb25PYmosIG9iak5hbWUpO1xuICB9KTtcbiAgY29uc29sZS50aW1lRW5kKFwiQ3JlYXRvci5FeHBvcnQyeG1sXCIpO1xuICByZXR1cm4gZmlsZVBhdGg7XG59O1xuIiwiTWV0ZW9yLm1ldGhvZHMgXHJcblx0cmVsYXRlZF9vYmplY3RzX3JlY29yZHM6IChvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpLT5cclxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXHJcblx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIlxyXG5cdFx0XHRzZWxlY3RvciA9IHtcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWR9XHJcblx0XHRlbHNlXHJcblx0XHRcdHNlbGVjdG9yID0ge3NwYWNlOiBzcGFjZUlkfVxyXG5cdFx0XHJcblx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcclxuXHRcdFx0IyDpmYTku7bnmoTlhbPogZTmkJzntKLmnaHku7bmmK/lrprmrbvnmoRcclxuXHRcdFx0c2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lXHJcblx0XHRcdHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdXHJcblx0XHRlbHNlXHJcblx0XHRcdHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWRcclxuXHJcblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxyXG5cdFx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcclxuXHRcdFx0c2VsZWN0b3Iub3duZXIgPSB1c2VySWRcclxuXHRcdFxyXG5cdFx0cmVsYXRlZF9yZWNvcmRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpXHJcblx0XHRyZXR1cm4gcmVsYXRlZF9yZWNvcmRzLmNvdW50KCkiLCJNZXRlb3IubWV0aG9kcyh7XG4gIHJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpIHtcbiAgICB2YXIgcGVybWlzc2lvbnMsIHJlbGF0ZWRfcmVjb3Jkcywgc2VsZWN0b3IsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiKSB7XG4gICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgXCJtZXRhZGF0YS5zcGFjZVwiOiBzcGFjZUlkXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgICBzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWU7XG4gICAgICBzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZDtcbiAgICB9XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy5hbGxvd1JlYWQpIHtcbiAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICAgIH1cbiAgICByZWxhdGVkX3JlY29yZHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlbGF0ZWRfcmVjb3Jkcy5jb3VudCgpO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0Z2V0UGVuZGluZ1NwYWNlSW5mbzogKGludml0ZXJJZCwgc3BhY2VJZCktPlxyXG5cdFx0aW52aXRlck5hbWUgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IGludml0ZXJJZH0pLm5hbWVcclxuXHRcdHNwYWNlTmFtZSA9IGRiLnNwYWNlcy5maW5kT25lKHtfaWQ6IHNwYWNlSWR9KS5uYW1lXHJcblxyXG5cdFx0cmV0dXJuIHtpbnZpdGVyOiBpbnZpdGVyTmFtZSwgc3BhY2U6IHNwYWNlTmFtZX1cclxuXHJcblx0cmVmdXNlSm9pblNwYWNlOiAoX2lkKS0+XHJcblx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IF9pZH0seyRzZXQ6IHtpbnZpdGVfc3RhdGU6IFwicmVmdXNlZFwifX0pXHJcblxyXG5cdGFjY2VwdEpvaW5TcGFjZTogKF9pZCktPlxyXG5cdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBfaWR9LHskc2V0OiB7aW52aXRlX3N0YXRlOiBcImFjY2VwdGVkXCIsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9fSlcclxuXHJcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgZ2V0UGVuZGluZ1NwYWNlSW5mbzogZnVuY3Rpb24oaW52aXRlcklkLCBzcGFjZUlkKSB7XG4gICAgdmFyIGludml0ZXJOYW1lLCBzcGFjZU5hbWU7XG4gICAgaW52aXRlck5hbWUgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogaW52aXRlcklkXG4gICAgfSkubmFtZTtcbiAgICBzcGFjZU5hbWUgPSBkYi5zcGFjZXMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHNwYWNlSWRcbiAgICB9KS5uYW1lO1xuICAgIHJldHVybiB7XG4gICAgICBpbnZpdGVyOiBpbnZpdGVyTmFtZSxcbiAgICAgIHNwYWNlOiBzcGFjZU5hbWVcbiAgICB9O1xuICB9LFxuICByZWZ1c2VKb2luU3BhY2U6IGZ1bmN0aW9uKF9pZCkge1xuICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBpbnZpdGVfc3RhdGU6IFwicmVmdXNlZFwiXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIGFjY2VwdEpvaW5TcGFjZTogZnVuY3Rpb24oX2lkKSB7XG4gICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGludml0ZV9zdGF0ZTogXCJhY2NlcHRlZFwiLFxuICAgICAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggXCJjcmVhdG9yX29iamVjdF9yZWNvcmRcIiwgKG9iamVjdF9uYW1lLCBpZCwgc3BhY2VfaWQpLT5cclxuXHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZClcclxuXHRpZiBjb2xsZWN0aW9uXHJcblx0XHRyZXR1cm4gY29sbGVjdGlvbi5maW5kKHtfaWQ6IGlkfSlcclxuXHJcbiIsIk1ldGVvci5wdWJsaXNoKFwiY3JlYXRvcl9vYmplY3RfcmVjb3JkXCIsIGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBpZCwgc3BhY2VfaWQpIHtcbiAgdmFyIGNvbGxlY3Rpb247XG4gIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKTtcbiAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5maW5kKHtcbiAgICAgIF9pZDogaWRcbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IucHVibGlzaENvbXBvc2l0ZSBcInN0ZWVkb3Nfb2JqZWN0X3RhYnVsYXJcIiwgKHRhYmxlTmFtZSwgaWRzLCBmaWVsZHMsIHNwYWNlSWQpLT5cclxuXHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0Y2hlY2sodGFibGVOYW1lLCBTdHJpbmcpO1xyXG5cdGNoZWNrKGlkcywgQXJyYXkpO1xyXG5cdGNoZWNrKGZpZWxkcywgTWF0Y2guT3B0aW9uYWwoT2JqZWN0KSk7XHJcblxyXG5cdF9vYmplY3RfbmFtZSA9IHRhYmxlTmFtZS5yZXBsYWNlKFwiY3JlYXRvcl9cIixcIlwiKVxyXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfb2JqZWN0X25hbWUsIHNwYWNlSWQpXHJcblxyXG5cdGlmIHNwYWNlSWRcclxuXHRcdF9vYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0TmFtZShfb2JqZWN0KVxyXG5cclxuXHRvYmplY3RfY29sbGVjaXRvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihfb2JqZWN0X25hbWUpXHJcblxyXG5cclxuXHRfZmllbGRzID0gX29iamVjdD8uZmllbGRzXHJcblx0aWYgIV9maWVsZHMgfHwgIW9iamVjdF9jb2xsZWNpdG9uXHJcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdHJlZmVyZW5jZV9maWVsZHMgPSBfLmZpbHRlciBfZmllbGRzLCAoZiktPlxyXG5cdFx0cmV0dXJuIF8uaXNGdW5jdGlvbihmLnJlZmVyZW5jZV90bykgfHwgIV8uaXNFbXB0eShmLnJlZmVyZW5jZV90bylcclxuXHJcblx0c2VsZiA9IHRoaXNcclxuXHJcblx0c2VsZi51bmJsb2NrKCk7XHJcblxyXG5cdGlmIHJlZmVyZW5jZV9maWVsZHMubGVuZ3RoID4gMFxyXG5cdFx0ZGF0YSA9IHtcclxuXHRcdFx0ZmluZDogKCktPlxyXG5cdFx0XHRcdHNlbGYudW5ibG9jaygpO1xyXG5cdFx0XHRcdGZpZWxkX2tleXMgPSB7fVxyXG5cdFx0XHRcdF8uZWFjaCBfLmtleXMoZmllbGRzKSwgKGYpLT5cclxuXHRcdFx0XHRcdHVubGVzcyAvXFx3KyhcXC5cXCQpezF9XFx3Py8udGVzdChmKVxyXG5cdFx0XHRcdFx0XHRmaWVsZF9rZXlzW2ZdID0gMVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtfaWQ6IHskaW46IGlkc319LCB7ZmllbGRzOiBmaWVsZF9rZXlzfSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZGF0YS5jaGlsZHJlbiA9IFtdXHJcblxyXG5cdFx0a2V5cyA9IF8ua2V5cyhmaWVsZHMpXHJcblxyXG5cdFx0aWYga2V5cy5sZW5ndGggPCAxXHJcblx0XHRcdGtleXMgPSBfLmtleXMoX2ZpZWxkcylcclxuXHJcblx0XHRfa2V5cyA9IFtdXHJcblxyXG5cdFx0a2V5cy5mb3JFYWNoIChrZXkpLT5cclxuXHRcdFx0aWYgX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXVxyXG5cdFx0XHRcdF9rZXlzID0gX2tleXMuY29uY2F0KF8ubWFwKF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ10sIChrKS0+XHJcblx0XHRcdFx0XHRyZXR1cm4ga2V5ICsgJy4nICsga1xyXG5cdFx0XHRcdCkpXHJcblx0XHRcdF9rZXlzLnB1c2goa2V5KVxyXG5cclxuXHRcdF9rZXlzLmZvckVhY2ggKGtleSktPlxyXG5cdFx0XHRyZWZlcmVuY2VfZmllbGQgPSBfZmllbGRzW2tleV1cclxuXHJcblx0XHRcdGlmIHJlZmVyZW5jZV9maWVsZCAmJiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykpICAjIGFuZCBDcmVhdG9yLkNvbGxlY3Rpb25zW3JlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG9dXHJcblx0XHRcdFx0ZGF0YS5jaGlsZHJlbi5wdXNoIHtcclxuXHRcdFx0XHRcdGZpbmQ6IChwYXJlbnQpIC0+XHJcblx0XHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRcdHNlbGYudW5ibG9jaygpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRxdWVyeSA9IHt9XHJcblxyXG5cdFx0XHRcdFx0XHRcdCMg6KGo5qC85a2Q5a2X5q6154m55q6K5aSE55CGXHJcblx0XHRcdFx0XHRcdFx0aWYgL1xcdysoXFwuXFwkXFwuKXsxfVxcdysvLnRlc3Qoa2V5KVxyXG5cdFx0XHRcdFx0XHRcdFx0cF9rID0ga2V5LnJlcGxhY2UoLyhcXHcrKVxcLlxcJFxcLlxcdysvaWcsIFwiJDFcIilcclxuXHRcdFx0XHRcdFx0XHRcdHNfayA9IGtleS5yZXBsYWNlKC9cXHcrXFwuXFwkXFwuKFxcdyspL2lnLCBcIiQxXCIpXHJcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfaWRzID0gcGFyZW50W3Bfa10uZ2V0UHJvcGVydHkoc19rKVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV9pZHMgPSBrZXkuc3BsaXQoJy4nKS5yZWR1Y2UgKG8sIHgpIC0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bz9beF1cclxuXHRcdFx0XHRcdFx0XHRcdCwgcGFyZW50XHJcblxyXG5cdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG9cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90bygpXHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShyZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBfLmlzT2JqZWN0KHJlZmVyZW5jZV9pZHMpICYmICFfLmlzQXJyYXkocmVmZXJlbmNlX2lkcylcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX2lkcy5vXHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV9pZHMgPSByZWZlcmVuY2VfaWRzLmlkcyB8fCBbXVxyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gW11cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpXHJcblx0XHRcdFx0XHRcdFx0XHRxdWVyeS5faWQgPSB7JGluOiByZWZlcmVuY2VfaWRzfVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHJlZmVyZW5jZV9pZHNcclxuXHJcblx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlZmVyZW5jZV90bywgc3BhY2VJZClcclxuXHJcblx0XHRcdFx0XHRcdFx0bmFtZV9maWVsZF9rZXkgPSByZWZlcmVuY2VfdG9fb2JqZWN0Lk5BTUVfRklFTERfS0VZXHJcblxyXG5cdFx0XHRcdFx0XHRcdGNoaWxkcmVuX2ZpZWxkcyA9IHtfaWQ6IDEsIHNwYWNlOiAxfVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiBuYW1lX2ZpZWxkX2tleVxyXG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW5fZmllbGRzW25hbWVfZmllbGRfa2V5XSA9IDFcclxuXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8sIHNwYWNlSWQpLmZpbmQocXVlcnksIHtcclxuXHRcdFx0XHRcdFx0XHRcdGZpZWxkczogY2hpbGRyZW5fZmllbGRzXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhyZWZlcmVuY2VfdG8sIHBhcmVudCwgZSlcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gW11cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGFcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRmaW5kOiAoKS0+XHJcblx0XHRcdFx0c2VsZi51bmJsb2NrKCk7XHJcblx0XHRcdFx0cmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe19pZDogeyRpbjogaWRzfX0sIHtmaWVsZHM6IGZpZWxkc30pXHJcblx0XHR9O1xyXG5cclxuIiwiTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUoXCJzdGVlZG9zX29iamVjdF90YWJ1bGFyXCIsIGZ1bmN0aW9uKHRhYmxlTmFtZSwgaWRzLCBmaWVsZHMsIHNwYWNlSWQpIHtcbiAgdmFyIF9maWVsZHMsIF9rZXlzLCBfb2JqZWN0LCBfb2JqZWN0X25hbWUsIGRhdGEsIGtleXMsIG9iamVjdF9jb2xsZWNpdG9uLCByZWZlcmVuY2VfZmllbGRzLCBzZWxmO1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBjaGVjayh0YWJsZU5hbWUsIFN0cmluZyk7XG4gIGNoZWNrKGlkcywgQXJyYXkpO1xuICBjaGVjayhmaWVsZHMsIE1hdGNoLk9wdGlvbmFsKE9iamVjdCkpO1xuICBfb2JqZWN0X25hbWUgPSB0YWJsZU5hbWUucmVwbGFjZShcImNyZWF0b3JfXCIsIFwiXCIpO1xuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX29iamVjdF9uYW1lLCBzcGFjZUlkKTtcbiAgaWYgKHNwYWNlSWQpIHtcbiAgICBfb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldE9iamVjdE5hbWUoX29iamVjdCk7XG4gIH1cbiAgb2JqZWN0X2NvbGxlY2l0b24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oX29iamVjdF9uYW1lKTtcbiAgX2ZpZWxkcyA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZmllbGRzIDogdm9pZCAwO1xuICBpZiAoIV9maWVsZHMgfHwgIW9iamVjdF9jb2xsZWNpdG9uKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZWZlcmVuY2VfZmllbGRzID0gXy5maWx0ZXIoX2ZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgIHJldHVybiBfLmlzRnVuY3Rpb24oZi5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkoZi5yZWZlcmVuY2VfdG8pO1xuICB9KTtcbiAgc2VsZiA9IHRoaXM7XG4gIHNlbGYudW5ibG9jaygpO1xuICBpZiAocmVmZXJlbmNlX2ZpZWxkcy5sZW5ndGggPiAwKSB7XG4gICAgZGF0YSA9IHtcbiAgICAgIGZpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZmllbGRfa2V5cztcbiAgICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICAgIGZpZWxkX2tleXMgPSB7fTtcbiAgICAgICAgXy5lYWNoKF8ua2V5cyhmaWVsZHMpLCBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgaWYgKCEvXFx3KyhcXC5cXCQpezF9XFx3Py8udGVzdChmKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkX2tleXNbZl0gPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtcbiAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICRpbjogaWRzXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBmaWVsZF9rZXlzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgZGF0YS5jaGlsZHJlbiA9IFtdO1xuICAgIGtleXMgPSBfLmtleXMoZmllbGRzKTtcbiAgICBpZiAoa2V5cy5sZW5ndGggPCAxKSB7XG4gICAgICBrZXlzID0gXy5rZXlzKF9maWVsZHMpO1xuICAgIH1cbiAgICBfa2V5cyA9IFtdO1xuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmIChfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddKSB7XG4gICAgICAgIF9rZXlzID0gX2tleXMuY29uY2F0KF8ubWFwKF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ10sIGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICByZXR1cm4ga2V5ICsgJy4nICsgaztcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9rZXlzLnB1c2goa2V5KTtcbiAgICB9KTtcbiAgICBfa2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIHJlZmVyZW5jZV9maWVsZDtcbiAgICAgIHJlZmVyZW5jZV9maWVsZCA9IF9maWVsZHNba2V5XTtcbiAgICAgIGlmIChyZWZlcmVuY2VfZmllbGQgJiYgKF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pKSkge1xuICAgICAgICByZXR1cm4gZGF0YS5jaGlsZHJlbi5wdXNoKHtcbiAgICAgICAgICBmaW5kOiBmdW5jdGlvbihwYXJlbnQpIHtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbl9maWVsZHMsIGUsIG5hbWVfZmllbGRfa2V5LCBwX2ssIHF1ZXJ5LCByZWZlcmVuY2VfaWRzLCByZWZlcmVuY2VfdG8sIHJlZmVyZW5jZV90b19vYmplY3QsIHNfaztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHNlbGYudW5ibG9jaygpO1xuICAgICAgICAgICAgICBxdWVyeSA9IHt9O1xuICAgICAgICAgICAgICBpZiAoL1xcdysoXFwuXFwkXFwuKXsxfVxcdysvLnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgIHBfayA9IGtleS5yZXBsYWNlKC8oXFx3KylcXC5cXCRcXC5cXHcrL2lnLCBcIiQxXCIpO1xuICAgICAgICAgICAgICAgIHNfayA9IGtleS5yZXBsYWNlKC9cXHcrXFwuXFwkXFwuKFxcdyspL2lnLCBcIiQxXCIpO1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZV9pZHMgPSBwYXJlbnRbcF9rXS5nZXRQcm9wZXJ0eShzX2spO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZV9pZHMgPSBrZXkuc3BsaXQoJy4nKS5yZWR1Y2UoZnVuY3Rpb24obywgeCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIG8gIT0gbnVsbCA/IG9beF0gOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgfSwgcGFyZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8oKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChyZWZlcmVuY2VfaWRzKSAmJiAhXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpKSB7XG4gICAgICAgICAgICAgICAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfaWRzLm87XG4gICAgICAgICAgICAgICAgICByZWZlcmVuY2VfaWRzID0gcmVmZXJlbmNlX2lkcy5pZHMgfHwgW107XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKF8uaXNBcnJheShyZWZlcmVuY2VfaWRzKSkge1xuICAgICAgICAgICAgICAgIHF1ZXJ5Ll9pZCA9IHtcbiAgICAgICAgICAgICAgICAgICRpbjogcmVmZXJlbmNlX2lkc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcXVlcnkuX2lkID0gcmVmZXJlbmNlX2lkcztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWZlcmVuY2VfdG9fb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVmZXJlbmNlX3RvLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgbmFtZV9maWVsZF9rZXkgPSByZWZlcmVuY2VfdG9fb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICAgICAgICAgICAgICBjaGlsZHJlbl9maWVsZHMgPSB7XG4gICAgICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgICAgIHNwYWNlOiAxXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGlmIChuYW1lX2ZpZWxkX2tleSkge1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuX2ZpZWxkc1tuYW1lX2ZpZWxkX2tleV0gPSAxO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kKHF1ZXJ5LCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiBjaGlsZHJlbl9maWVsZHNcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlZmVyZW5jZV90bywgcGFyZW50LCBlKTtcbiAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLnVuYmxvY2soKTtcbiAgICAgICAgcmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe1xuICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgJGluOiBpZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoIFwib2JqZWN0X2xpc3R2aWV3c1wiLCAob2JqZWN0X25hbWUsIHNwYWNlSWQpLT5cclxuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXHJcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNwYWNlOiBzcGFjZUlkICxcIiRvclwiOlt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XX0pIiwiTWV0ZW9yLnB1Ymxpc2ggXCJ1c2VyX3RhYnVsYXJfc2V0dGluZ3NcIiwgKG9iamVjdF9uYW1lKS0+XHJcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxyXG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZCh7b2JqZWN0X25hbWU6IHskaW46IG9iamVjdF9uYW1lfSwgcmVjb3JkX2lkOiB7JGluOiBbXCJvYmplY3RfbGlzdHZpZXdzXCIsIFwib2JqZWN0X2dyaWR2aWV3c1wiXX0sIG93bmVyOiB1c2VySWR9KVxyXG4iLCJNZXRlb3IucHVibGlzaCBcInJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzXCIsIChvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpLT5cclxuXHR1c2VySWQgPSB0aGlzLnVzZXJJZFxyXG5cdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXHJcblx0XHRzZWxlY3RvciA9IHtcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWR9XHJcblx0ZWxzZVxyXG5cdFx0c2VsZWN0b3IgPSB7c3BhY2U6IHNwYWNlSWR9XHJcblx0XHJcblx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXHJcblx0XHQjIOmZhOS7tueahOWFs+iBlOaQnOe0ouadoeS7tuaYr+Wumuatu+eahFxyXG5cdFx0c2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lXHJcblx0XHRzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXVxyXG5cdGVsc2VcclxuXHRcdHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWRcclxuXHJcblx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcclxuXHRpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLmFsbG93UmVhZFxyXG5cdFx0c2VsZWN0b3Iub3duZXIgPSB1c2VySWRcclxuXHRcclxuXHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpIiwiTWV0ZW9yLnB1Ymxpc2goXCJyZWxhdGVkX29iamVjdHNfcmVjb3Jkc1wiLCBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpIHtcbiAgdmFyIHBlcm1pc3Npb25zLCBzZWxlY3RvciwgdXNlcklkO1xuICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIikge1xuICAgIHNlbGVjdG9yID0ge1xuICAgICAgXCJtZXRhZGF0YS5zcGFjZVwiOiBzcGFjZUlkXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfTtcbiAgfVxuICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIikge1xuICAgIHNlbGVjdG9yW1wicGFyZW50Lm9cIl0gPSBvYmplY3RfbmFtZTtcbiAgICBzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXTtcbiAgfSBlbHNlIHtcbiAgICBzZWxlY3RvcltyZWxhdGVkX2ZpZWxkX25hbWVdID0gcmVjb3JkX2lkO1xuICB9XG4gIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLmFsbG93UmVhZCkge1xuICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICB9XG4gIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvcik7XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoICdzcGFjZV91c2VyX2luZm8nLCAoc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9KSIsIlxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHJcblx0TWV0ZW9yLnB1Ymxpc2ggJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJywgKHNwYWNlSWQpLT5cclxuXHJcblx0XHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRcdHVubGVzcyBzcGFjZUlkXHJcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0XHRzZWxlY3RvciA9XHJcblx0XHRcdHNwYWNlOiBzcGFjZUlkXHJcblx0XHRcdGtleTogJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJ1xyXG5cclxuXHRcdHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKSIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBzZWxlY3RvcjtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBrZXk6ICdjb250YWN0c192aWV3X2xpbWl0cydcbiAgICB9O1xuICAgIHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKTtcbiAgfSk7XG59XG4iLCJcclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblxyXG5cdE1ldGVvci5wdWJsaXNoICdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycycsIChzcGFjZUlkKS0+XHJcblxyXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXHJcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0XHR1bmxlc3Mgc3BhY2VJZFxyXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdFx0c2VsZWN0b3IgPVxyXG5cdFx0XHRzcGFjZTogc3BhY2VJZFxyXG5cdFx0XHRrZXk6ICdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycydcclxuXHJcblx0XHRyZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3RvcikiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAga2V5OiAnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnXG4gICAgfTtcbiAgICByZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3Rvcik7XG4gIH0pO1xufVxuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0TWV0ZW9yLnB1Ymxpc2ggJ3NwYWNlX25lZWRfdG9fY29uZmlybScsICgpLT5cclxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXHJcblx0XHRyZXR1cm4gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdXNlcklkLCBpbnZpdGVfc3RhdGU6IFwicGVuZGluZ1wifSkiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdzcGFjZV9uZWVkX3RvX2NvbmZpcm0nLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIGludml0ZV9zdGF0ZTogXCJwZW5kaW5nXCJcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJwZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9XHJcblxyXG5wZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93UGVybWlzc2lvbnMgPSAoZmxvd19pZCwgdXNlcl9pZCkgLT5cclxuXHQjIOagueaNrjpmbG93X2lk5p+l5Yiw5a+55bqU55qEZmxvd1xyXG5cdGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZClcclxuXHRzcGFjZV9pZCA9IGZsb3cuc3BhY2VcclxuXHQjIOagueaNrnNwYWNlX2lk5ZKMOnVzZXJfaWTliLBvcmdhbml6YXRpb25z6KGo5Lit5p+l5Yiw55So5oi35omA5bGe5omA5pyJ55qEb3JnX2lk77yI5YyF5ous5LiK57qn57uESUTvvIlcclxuXHRvcmdfaWRzID0gbmV3IEFycmF5XHJcblx0b3JnYW5pemF0aW9ucyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XHJcblx0XHRzcGFjZTogc3BhY2VfaWQsIHVzZXJzOiB1c2VyX2lkIH0sIHsgZmllbGRzOiB7IHBhcmVudHM6IDEgfSB9KS5mZXRjaCgpXHJcblx0Xy5lYWNoKG9yZ2FuaXphdGlvbnMsIChvcmcpIC0+XHJcblx0XHRvcmdfaWRzLnB1c2gob3JnLl9pZClcclxuXHRcdGlmIG9yZy5wYXJlbnRzXHJcblx0XHRcdF8uZWFjaChvcmcucGFyZW50cywgKHBhcmVudF9pZCkgLT5cclxuXHRcdFx0XHRvcmdfaWRzLnB1c2gocGFyZW50X2lkKVxyXG5cdFx0XHQpXHJcblx0KVxyXG5cdG9yZ19pZHMgPSBfLnVuaXEob3JnX2lkcylcclxuXHRteV9wZXJtaXNzaW9ucyA9IG5ldyBBcnJheVxyXG5cdGlmIGZsb3cucGVybXNcclxuXHRcdCMg5Yik5patZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW7kuK3mmK/lkKbljIXlkKvlvZPliY3nlKjmiLfvvIxcclxuXHRcdCMg5oiW6ICFZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGTmmK/lkKbljIXlkKs05q2l5b6X5Yiw55qEb3JnX2lk5pWw57uE5Lit55qE5Lu75L2V5LiA5Liq77yMXHJcblx0XHQjIOiLpeaYr++8jOWImeWcqOi/lOWbnueahOaVsOe7hOS4reWKoOS4imFkZFxyXG5cdFx0aWYgZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRkXHJcblx0XHRcdHVzZXJzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGRcclxuXHRcdFx0aWYgdXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VyX2lkKVxyXG5cdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJhZGRcIilcclxuXHJcblx0XHRpZiBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZFxyXG5cdFx0XHRvcmdzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZFxyXG5cdFx0XHRfLmVhY2gob3JnX2lkcywgKG9yZ19pZCkgLT5cclxuXHRcdFx0XHRpZiBvcmdzX2Nhbl9hZGQuaW5jbHVkZXMob3JnX2lkKVxyXG5cdFx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKVxyXG5cdFx0XHQpXHJcblx0XHQjIOWIpOaWrWZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3LkuK3mmK/lkKbljIXlkKvlvZPliY3nlKjmiLfvvIxcclxuXHRcdCMg5oiW6ICFZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9y5piv5ZCm5YyF5ZCrNOatpeW+l+WIsOeahG9yZ19pZOaVsOe7hOS4reeahOS7u+S9leS4gOS4qu+8jFxyXG5cdFx0IyDoi6XmmK/vvIzliJnlnKjov5Tlm57nmoTmlbDnu4TkuK3liqDkuIptb25pdG9yXHJcblx0XHRpZiBmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yXHJcblx0XHRcdHVzZXJzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvclxyXG5cdFx0XHRpZiB1c2Vyc19jYW5fbW9uaXRvci5pbmNsdWRlcyh1c2VyX2lkKVxyXG5cdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJtb25pdG9yXCIpXHJcblxyXG5cdFx0aWYgZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yXHJcblx0XHRcdG9yZ3NfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3JcclxuXHRcdFx0Xy5lYWNoKG9yZ19pZHMsIChvcmdfaWQpIC0+XHJcblx0XHRcdFx0aWYgb3Jnc19jYW5fbW9uaXRvci5pbmNsdWRlcyhvcmdfaWQpXHJcblx0XHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKVxyXG5cdFx0XHQpXHJcblx0XHQjIOWIpOaWrWZsb3cucGVybXMudXNlcnNfY2FuX2FkbWlu5Lit5piv5ZCm5YyF5ZCr5b2T5YmN55So5oi377yMXHJcblx0XHQjIOaIluiAhWZsb3cucGVybXMub3Jnc19jYW5fYWRtaW7mmK/lkKbljIXlkKs05q2l5b6X5Yiw55qEb3JnX2lk5pWw57uE5Lit55qE5Lu75L2V5LiA5Liq77yMXHJcblx0XHQjIOiLpeaYr++8jOWImeWcqOi/lOWbnueahOaVsOe7hOS4reWKoOS4imFkbWluXHJcblx0XHRpZiBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pblxyXG5cdFx0XHR1c2Vyc19jYW5fYWRtaW4gPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pblxyXG5cdFx0XHRpZiB1c2Vyc19jYW5fYWRtaW4uaW5jbHVkZXModXNlcl9pZClcclxuXHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIilcclxuXHJcblx0XHRpZiBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluXHJcblx0XHRcdG9yZ3NfY2FuX2FkbWluID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pblxyXG5cdFx0XHRfLmVhY2gob3JnX2lkcywgKG9yZ19pZCkgLT5cclxuXHRcdFx0XHRpZiBvcmdzX2Nhbl9hZG1pbi5pbmNsdWRlcyhvcmdfaWQpXHJcblx0XHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIilcclxuXHRcdFx0KVxyXG5cclxuXHRteV9wZXJtaXNzaW9ucyA9IF8udW5pcShteV9wZXJtaXNzaW9ucylcclxuXHRyZXR1cm4gbXlfcGVybWlzc2lvbnMiLCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbnBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge307XG5cbnBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3dQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKGZsb3dfaWQsIHVzZXJfaWQpIHtcbiAgdmFyIGZsb3csIG15X3Blcm1pc3Npb25zLCBvcmdfaWRzLCBvcmdhbml6YXRpb25zLCBvcmdzX2Nhbl9hZGQsIG9yZ3NfY2FuX2FkbWluLCBvcmdzX2Nhbl9tb25pdG9yLCBzcGFjZV9pZCwgdXNlcnNfY2FuX2FkZCwgdXNlcnNfY2FuX2FkbWluLCB1c2Vyc19jYW5fbW9uaXRvcjtcbiAgZmxvdyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyhmbG93X2lkKTtcbiAgc3BhY2VfaWQgPSBmbG93LnNwYWNlO1xuICBvcmdfaWRzID0gbmV3IEFycmF5O1xuICBvcmdhbml6YXRpb25zID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdXNlcnM6IHVzZXJfaWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgcGFyZW50czogMVxuICAgIH1cbiAgfSkuZmV0Y2goKTtcbiAgXy5lYWNoKG9yZ2FuaXphdGlvbnMsIGZ1bmN0aW9uKG9yZykge1xuICAgIG9yZ19pZHMucHVzaChvcmcuX2lkKTtcbiAgICBpZiAob3JnLnBhcmVudHMpIHtcbiAgICAgIHJldHVybiBfLmVhY2gob3JnLnBhcmVudHMsIGZ1bmN0aW9uKHBhcmVudF9pZCkge1xuICAgICAgICByZXR1cm4gb3JnX2lkcy5wdXNoKHBhcmVudF9pZCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBvcmdfaWRzID0gXy51bmlxKG9yZ19pZHMpO1xuICBteV9wZXJtaXNzaW9ucyA9IG5ldyBBcnJheTtcbiAgaWYgKGZsb3cucGVybXMpIHtcbiAgICBpZiAoZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRkKSB7XG4gICAgICB1c2Vyc19jYW5fYWRkID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRkO1xuICAgICAgaWYgKHVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcl9pZCkpIHtcbiAgICAgICAgbXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMub3Jnc19jYW5fYWRkKSB7XG4gICAgICBvcmdzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZDtcbiAgICAgIF8uZWFjaChvcmdfaWRzLCBmdW5jdGlvbihvcmdfaWQpIHtcbiAgICAgICAgaWYgKG9yZ3NfY2FuX2FkZC5pbmNsdWRlcyhvcmdfaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZGRcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvcikge1xuICAgICAgdXNlcnNfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yO1xuICAgICAgaWYgKHVzZXJzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKHVzZXJfaWQpKSB7XG4gICAgICAgIG15X3Blcm1pc3Npb25zLnB1c2goXCJtb25pdG9yXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yKSB7XG4gICAgICBvcmdzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yO1xuICAgICAgXy5lYWNoKG9yZ19pZHMsIGZ1bmN0aW9uKG9yZ19pZCkge1xuICAgICAgICBpZiAob3Jnc19jYW5fbW9uaXRvci5pbmNsdWRlcyhvcmdfaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIG15X3Blcm1pc3Npb25zLnB1c2goXCJtb25pdG9yXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluKSB7XG4gICAgICB1c2Vyc19jYW5fYWRtaW4gPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbjtcbiAgICAgIGlmICh1c2Vyc19jYW5fYWRtaW4uaW5jbHVkZXModXNlcl9pZCkpIHtcbiAgICAgICAgbXlfcGVybWlzc2lvbnMucHVzaChcImFkbWluXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pbikge1xuICAgICAgb3Jnc19jYW5fYWRtaW4gPSBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluO1xuICAgICAgXy5lYWNoKG9yZ19pZHMsIGZ1bmN0aW9uKG9yZ19pZCkge1xuICAgICAgICBpZiAob3Jnc19jYW5fYWRtaW4uaW5jbHVkZXMob3JnX2lkKSkge1xuICAgICAgICAgIHJldHVybiBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBteV9wZXJtaXNzaW9ucyA9IF8udW5pcShteV9wZXJtaXNzaW9ucyk7XG4gIHJldHVybiBteV9wZXJtaXNzaW9ucztcbn07XG4iLCJfZXZhbCA9IHJlcXVpcmUoJ2V2YWwnKVxyXG5vYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJyk7XHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge31cclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbiA9IChyZXEpIC0+XHJcblx0cXVlcnkgPSByZXEucXVlcnlcclxuXHR1c2VySWQgPSBxdWVyeVtcIlgtVXNlci1JZFwiXVxyXG5cdGF1dGhUb2tlbiA9IHF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG5cdGlmIG5vdCB1c2VySWQgb3Igbm90IGF1dGhUb2tlblxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXHJcblxyXG5cdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcclxuXHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcclxuXHRcdF9pZDogdXNlcklkLFxyXG5cdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cclxuXHJcblx0aWYgbm90IHVzZXJcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xyXG5cclxuXHRyZXR1cm4gdXNlclxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZSA9IChzcGFjZV9pZCkgLT5cclxuXHRzcGFjZSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpXHJcblx0aWYgbm90IHNwYWNlXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInNwYWNlX2lk5pyJ6K+v5oiW5q2kc3BhY2Xlt7Lnu4/ooqvliKDpmaRcIilcclxuXHRyZXR1cm4gc3BhY2VcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyA9IChmbG93X2lkKSAtPlxyXG5cdGZsb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZsb3dzLmZpbmRPbmUoZmxvd19pZClcclxuXHRpZiBub3QgZmxvd1xyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJpZOacieivr+aIluatpOa1geeoi+W3sue7j+iiq+WIoOmZpFwiKVxyXG5cdHJldHVybiBmbG93XHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlciA9IChzcGFjZV9pZCwgdXNlcl9pZCkgLT5cclxuXHRzcGFjZV91c2VyID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZV91c2Vycy5maW5kT25lKHsgc3BhY2U6IHNwYWNlX2lkLCB1c2VyOiB1c2VyX2lkIH0pXHJcblx0aWYgbm90IHNwYWNlX3VzZXJcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwidXNlcl9pZOWvueW6lOeahOeUqOaIt+S4jeWxnuS6juW9k+WJjXNwYWNlXCIpXHJcblx0cmV0dXJuIHNwYWNlX3VzZXJcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyA9IChzcGFjZV91c2VyKSAtPlxyXG5cdGluZm8gPSBuZXcgT2JqZWN0XHJcblx0aW5mby5vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvblxyXG5cdG9yZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub3JnYW5pemF0aW9ucy5maW5kT25lKHNwYWNlX3VzZXIub3JnYW5pemF0aW9uLCB7IGZpZWxkczogeyBuYW1lOiAxICwgZnVsbG5hbWU6IDEgfSB9KVxyXG5cdGluZm8ub3JnYW5pemF0aW9uX25hbWUgPSBvcmcubmFtZVxyXG5cdGluZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gb3JnLmZ1bGxuYW1lXHJcblx0cmV0dXJuIGluZm9cclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZCA9IChmbG93KSAtPlxyXG5cdGlmIGZsb3cuc3RhdGUgaXNudCBcImVuYWJsZWRcIlxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvmnKrlkK/nlKgs5pON5L2c5aSx6LSlXCIpXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZCA9IChmbG93LCBzcGFjZV9pZCkgLT5cclxuXHRpZiBmbG93LnNwYWNlIGlzbnQgc3BhY2VfaWRcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5ZKM5bel5L2c5Yy6SUTkuI3ljLnphY1cIilcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybSA9IChmb3JtX2lkKSAtPlxyXG5cdGZvcm0gPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZvcm1zLmZpbmRPbmUoZm9ybV9pZClcclxuXHRpZiBub3QgZm9ybVxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+ihqOWNlUlE5pyJ6K+v5oiW5q2k6KGo5Y2V5bey57uP6KKr5Yig6ZmkJylcclxuXHJcblx0cmV0dXJuIGZvcm1cclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Q2F0ZWdvcnkgPSAoY2F0ZWdvcnlfaWQpIC0+XHJcblx0cmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuY2F0ZWdvcmllcy5maW5kT25lKGNhdGVnb3J5X2lkKVxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UgPSAoaW5zdGFuY2VfZnJvbV9jbGllbnQsIHVzZXJfaW5mbykgLT5cclxuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSwgU3RyaW5nXHJcblx0Y2hlY2sgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSwgU3RyaW5nXHJcblx0Y2hlY2sgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdLCBTdHJpbmdcclxuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl0sIFt7bzogU3RyaW5nLCBpZHM6IFtTdHJpbmddfV1cclxuXHJcblx0IyDmoKHpqozmmK/lkKZyZWNvcmTlt7Lnu4/lj5HotbfnmoTnlLPor7fov5jlnKjlrqHmibnkuK1cclxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVswXSwgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSlcclxuXHJcblx0c3BhY2VfaWQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdXHJcblx0Zmxvd19pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXVxyXG5cdHVzZXJfaWQgPSB1c2VyX2luZm8uX2lkXHJcblx0IyDojrflj5bliY3lj7DmiYDkvKDnmoR0cmFjZVxyXG5cdHRyYWNlX2Zyb21fY2xpZW50ID0gbnVsbFxyXG5cdCMg6I635Y+W5YmN5Y+w5omA5Lyg55qEYXBwcm92ZVxyXG5cdGFwcHJvdmVfZnJvbV9jbGllbnQgPSBudWxsXHJcblx0aWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl0gYW5kIGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdXHJcblx0XHR0cmFjZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdXHJcblx0XHRpZiB0cmFjZV9mcm9tX2NsaWVudFtcImFwcHJvdmVzXCJdIGFuZCB0cmFjZV9mcm9tX2NsaWVudFtcImFwcHJvdmVzXCJdWzBdXHJcblx0XHRcdGFwcHJvdmVfZnJvbV9jbGllbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXVtcImFwcHJvdmVzXCJdWzBdXHJcblxyXG5cdCMg6I635Y+W5LiA5Liqc3BhY2VcclxuXHRzcGFjZSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2Uoc3BhY2VfaWQpXHJcblx0IyDojrflj5bkuIDkuKpmbG93XHJcblx0ZmxvdyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyhmbG93X2lkKVxyXG5cdCMg6I635Y+W5LiA5Liqc3BhY2XkuIvnmoTkuIDkuKp1c2VyXHJcblx0c3BhY2VfdXNlciA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyKHNwYWNlX2lkLCB1c2VyX2lkKVxyXG5cdCMg6I635Y+Wc3BhY2VfdXNlcuaJgOWcqOeahOmDqOmXqOS/oeaBr1xyXG5cdHNwYWNlX3VzZXJfb3JnX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8oc3BhY2VfdXNlcilcclxuXHQjIOWIpOaWreS4gOS4qmZsb3fmmK/lkKbkuLrlkK/nlKjnirbmgIFcclxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd0VuYWJsZWQoZmxvdylcclxuXHQjIOWIpOaWreS4gOS4qmZsb3flkoxzcGFjZV9pZOaYr+WQpuWMuemFjVxyXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93U3BhY2VNYXRjaGVkKGZsb3csIHNwYWNlX2lkKVxyXG5cclxuXHRmb3JtID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtKGZsb3cuZm9ybSlcclxuXHJcblx0cGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd19pZCwgdXNlcl9pZClcclxuXHJcblx0aWYgbm90IHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRkXCIpXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuW9k+WJjeeUqOaIt+ayoeacieatpOa1geeoi+eahOaWsOW7uuadg+mZkFwiKVxyXG5cclxuXHRub3cgPSBuZXcgRGF0ZVxyXG5cdGluc19vYmogPSB7fVxyXG5cdGluc19vYmouX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuX21ha2VOZXdJRCgpXHJcblx0aW5zX29iai5zcGFjZSA9IHNwYWNlX2lkXHJcblx0aW5zX29iai5mbG93ID0gZmxvd19pZFxyXG5cdGluc19vYmouZmxvd192ZXJzaW9uID0gZmxvdy5jdXJyZW50Ll9pZFxyXG5cdGluc19vYmouZm9ybSA9IGZsb3cuZm9ybVxyXG5cdGluc19vYmouZm9ybV92ZXJzaW9uID0gZmxvdy5jdXJyZW50LmZvcm1fdmVyc2lvblxyXG5cdGluc19vYmoubmFtZSA9IGZsb3cubmFtZVxyXG5cdGluc19vYmouc3VibWl0dGVyID0gdXNlcl9pZFxyXG5cdGluc19vYmouc3VibWl0dGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZVxyXG5cdGluc19vYmouYXBwbGljYW50ID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSBlbHNlIHVzZXJfaWRcclxuXHRpbnNfb2JqLmFwcGxpY2FudF9uYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gZWxzZSB1c2VyX2luZm8ubmFtZVxyXG5cdGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbiA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSBlbHNlIHNwYWNlX3VzZXIub3JnYW5pemF0aW9uXHJcblx0aW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdIGVsc2Ugc3BhY2VfdXNlcl9vcmdfaW5mby5vcmdhbml6YXRpb25fbmFtZVxyXG5cdGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZVwiXSBlbHNlICBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZVxyXG5cdGluc19vYmouYXBwbGljYW50X2NvbXBhbnkgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfY29tcGFueVwiXSBlbHNlIHNwYWNlX3VzZXIuY29tcGFueV9pZFxyXG5cdGluc19vYmouc3RhdGUgPSAnZHJhZnQnXHJcblx0aW5zX29iai5jb2RlID0gJydcclxuXHRpbnNfb2JqLmlzX2FyY2hpdmVkID0gZmFsc2VcclxuXHRpbnNfb2JqLmlzX2RlbGV0ZWQgPSBmYWxzZVxyXG5cdGluc19vYmouY3JlYXRlZCA9IG5vd1xyXG5cdGluc19vYmouY3JlYXRlZF9ieSA9IHVzZXJfaWRcclxuXHRpbnNfb2JqLm1vZGlmaWVkID0gbm93XHJcblx0aW5zX29iai5tb2RpZmllZF9ieSA9IHVzZXJfaWRcclxuXHRpbnNfb2JqLnZhbHVlcyA9IG5ldyBPYmplY3RcclxuXHJcblx0aW5zX29iai5yZWNvcmRfaWRzID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdXHJcblxyXG5cdGlmIHNwYWNlX3VzZXIuY29tcGFueV9pZFxyXG5cdFx0aW5zX29iai5jb21wYW55X2lkID0gc3BhY2VfdXNlci5jb21wYW55X2lkXHJcblxyXG5cdCMg5paw5bu6VHJhY2VcclxuXHR0cmFjZV9vYmogPSB7fVxyXG5cdHRyYWNlX29iai5faWQgPSBuZXcgTW9uZ28uT2JqZWN0SUQoKS5fc3RyXHJcblx0dHJhY2Vfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWRcclxuXHR0cmFjZV9vYmouaXNfZmluaXNoZWQgPSBmYWxzZVxyXG5cdCMg5b2T5YmN5pyA5paw54mIZmxvd+S4reW8gOWni+iKgueCuVxyXG5cdHN0YXJ0X3N0ZXAgPSBfLmZpbmQoZmxvdy5jdXJyZW50LnN0ZXBzLCAoc3RlcCkgLT5cclxuXHRcdHJldHVybiBzdGVwLnN0ZXBfdHlwZSBpcyAnc3RhcnQnXHJcblx0KVxyXG5cdHRyYWNlX29iai5zdGVwID0gc3RhcnRfc3RlcC5faWRcclxuXHR0cmFjZV9vYmoubmFtZSA9IHN0YXJ0X3N0ZXAubmFtZVxyXG5cclxuXHR0cmFjZV9vYmouc3RhcnRfZGF0ZSA9IG5vd1xyXG5cdCMg5paw5bu6QXBwcm92ZVxyXG5cdGFwcHJfb2JqID0ge31cclxuXHRhcHByX29iai5faWQgPSBuZXcgTW9uZ28uT2JqZWN0SUQoKS5fc3RyXHJcblx0YXBwcl9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZFxyXG5cdGFwcHJfb2JqLnRyYWNlID0gdHJhY2Vfb2JqLl9pZFxyXG5cdGFwcHJfb2JqLmlzX2ZpbmlzaGVkID0gZmFsc2VcclxuXHRhcHByX29iai51c2VyID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSBlbHNlIHVzZXJfaWRcclxuXHRhcHByX29iai51c2VyX25hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSBlbHNlIHVzZXJfaW5mby5uYW1lXHJcblx0YXBwcl9vYmouaGFuZGxlciA9IHVzZXJfaWRcclxuXHRhcHByX29iai5oYW5kbGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZVxyXG5cdGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb25cclxuXHRhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9uYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5uYW1lXHJcblx0YXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLmZ1bGxuYW1lXHJcblx0YXBwcl9vYmoudHlwZSA9ICdkcmFmdCdcclxuXHRhcHByX29iai5zdGFydF9kYXRlID0gbm93XHJcblx0YXBwcl9vYmoucmVhZF9kYXRlID0gbm93XHJcblx0YXBwcl9vYmouaXNfcmVhZCA9IHRydWVcclxuXHRhcHByX29iai5pc19lcnJvciA9IGZhbHNlXHJcblx0YXBwcl9vYmouZGVzY3JpcHRpb24gPSAnJ1xyXG5cdHJlbGF0ZWRUYWJsZXNJbmZvID0ge31cclxuXHRhcHByX29iai52YWx1ZXMgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlVmFsdWVzKGluc19vYmoucmVjb3JkX2lkc1swXSwgZmxvd19pZCwgc3BhY2VfaWQsIGZvcm0uY3VycmVudC5maWVsZHMsIHJlbGF0ZWRUYWJsZXNJbmZvKVxyXG5cclxuXHR0cmFjZV9vYmouYXBwcm92ZXMgPSBbYXBwcl9vYmpdXHJcblx0aW5zX29iai50cmFjZXMgPSBbdHJhY2Vfb2JqXVxyXG5cclxuXHRpbnNfb2JqLmluYm94X3VzZXJzID0gaW5zdGFuY2VfZnJvbV9jbGllbnQuaW5ib3hfdXNlcnMgfHwgW11cclxuXHJcblx0aW5zX29iai5jdXJyZW50X3N0ZXBfbmFtZSA9IHN0YXJ0X3N0ZXAubmFtZVxyXG5cclxuXHRpZiBmbG93LmF1dG9fcmVtaW5kIGlzIHRydWVcclxuXHRcdGluc19vYmouYXV0b19yZW1pbmQgPSB0cnVlXHJcblxyXG5cdCMg5paw5bu655Sz6K+35Y2V5pe277yMaW5zdGFuY2Vz6K6w5b2V5rWB56iL5ZCN56ew44CB5rWB56iL5YiG57G75ZCN56ewICMxMzEzXHJcblx0aW5zX29iai5mbG93X25hbWUgPSBmbG93Lm5hbWVcclxuXHRpZiBmb3JtLmNhdGVnb3J5XHJcblx0XHRjYXRlZ29yeSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Q2F0ZWdvcnkoZm9ybS5jYXRlZ29yeSlcclxuXHRcdGlmIGNhdGVnb3J5XHJcblx0XHRcdGluc19vYmouY2F0ZWdvcnlfbmFtZSA9IGNhdGVnb3J5Lm5hbWVcclxuXHRcdFx0aW5zX29iai5jYXRlZ29yeSA9IGNhdGVnb3J5Ll9pZFxyXG5cclxuXHRuZXdfaW5zX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuaW5zZXJ0KGluc19vYmopXHJcblxyXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8oaW5zX29iai5yZWNvcmRfaWRzWzBdLCBuZXdfaW5zX2lkLCBzcGFjZV9pZClcclxuXHJcblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlbGF0ZWRSZWNvcmRJbnN0YW5jZUluZm8ocmVsYXRlZFRhYmxlc0luZm8sIG5ld19pbnNfaWQsIHNwYWNlX2lkKVxyXG5cclxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoKGluc19vYmoucmVjb3JkX2lkc1swXSwgc3BhY2VfaWQsIGluc19vYmouX2lkLCBhcHByX29iai5faWQpXHJcblxyXG5cdHJldHVybiBuZXdfaW5zX2lkXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlVmFsdWVzID0gKHJlY29yZElkcywgZmxvd0lkLCBzcGFjZUlkLCBmaWVsZHMsIHJlbGF0ZWRUYWJsZXNJbmZvKSAtPlxyXG5cdGZpZWxkQ29kZXMgPSBbXVxyXG5cdF8uZWFjaCBmaWVsZHMsIChmKSAtPlxyXG5cdFx0aWYgZi50eXBlID09ICdzZWN0aW9uJ1xyXG5cdFx0XHRfLmVhY2ggZi5maWVsZHMsIChmZikgLT5cclxuXHRcdFx0XHRmaWVsZENvZGVzLnB1c2ggZmYuY29kZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRmaWVsZENvZGVzLnB1c2ggZi5jb2RlXHJcblxyXG5cdHZhbHVlcyA9IHt9XHJcblx0b2JqZWN0TmFtZSA9IHJlY29yZElkcy5vXHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0TmFtZSwgc3BhY2VJZClcclxuXHRyZWNvcmRJZCA9IHJlY29yZElkcy5pZHNbMF1cclxuXHRvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3dvcmtmbG93cy5maW5kT25lKHtcclxuXHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxyXG5cdFx0Zmxvd19pZDogZmxvd0lkXHJcblx0fSlcclxuXHRyZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0TmFtZSwgc3BhY2VJZCkuZmluZE9uZShyZWNvcmRJZClcclxuXHRmbG93ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoZmxvd0lkLCB7IGZpZWxkczogeyBmb3JtOiAxIH0gfSlcclxuXHRpZiBvdyBhbmQgcmVjb3JkXHJcblx0XHRmb3JtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiZm9ybXNcIikuZmluZE9uZShmbG93LmZvcm0pXHJcblx0XHRmb3JtRmllbGRzID0gZm9ybS5jdXJyZW50LmZpZWxkcyB8fCBbXVxyXG5cdFx0cmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdE5hbWUsIHNwYWNlSWQpXHJcblx0XHRyZWxhdGVkT2JqZWN0c0tleXMgPSBfLnBsdWNrKHJlbGF0ZWRPYmplY3RzLCAnb2JqZWN0X25hbWUnKVxyXG5cdFx0Zm9ybVRhYmxlRmllbGRzID0gXy5maWx0ZXIgZm9ybUZpZWxkcywgKGZvcm1GaWVsZCkgLT5cclxuXHRcdFx0cmV0dXJuIGZvcm1GaWVsZC50eXBlID09ICd0YWJsZSdcclxuXHRcdGZvcm1UYWJsZUZpZWxkc0NvZGUgPSBfLnBsdWNrKGZvcm1UYWJsZUZpZWxkcywgJ2NvZGUnKVxyXG5cclxuXHRcdGdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUgPSAgKGtleSkgLT5cclxuXHRcdFx0cmV0dXJuIF8uZmluZCByZWxhdGVkT2JqZWN0c0tleXMsICAocmVsYXRlZE9iamVjdHNLZXkpIC0+XHJcblx0XHRcdFx0cmV0dXJuIGtleS5zdGFydHNXaXRoKHJlbGF0ZWRPYmplY3RzS2V5ICsgJy4nKVxyXG5cclxuXHRcdGdldEZvcm1UYWJsZUZpZWxkQ29kZSA9IChrZXkpIC0+XHJcblx0XHRcdHJldHVybiBfLmZpbmQgZm9ybVRhYmxlRmllbGRzQ29kZSwgIChmb3JtVGFibGVGaWVsZENvZGUpIC0+XHJcblx0XHRcdFx0cmV0dXJuIGtleS5zdGFydHNXaXRoKGZvcm1UYWJsZUZpZWxkQ29kZSArICcuJylcclxuXHJcblx0XHRnZXRGb3JtVGFibGVGaWVsZCA9IChrZXkpIC0+XHJcblx0XHRcdHJldHVybiBfLmZpbmQgZm9ybVRhYmxlRmllbGRzLCAgKGYpIC0+XHJcblx0XHRcdFx0cmV0dXJuIGYuY29kZSA9PSBrZXlcclxuXHJcblx0XHRnZXRGb3JtRmllbGQgPSAoa2V5KSAtPlxyXG5cdFx0XHRmZiA9IG51bGxcclxuXHRcdFx0Xy5mb3JFYWNoIGZvcm1GaWVsZHMsIChmKSAtPlxyXG5cdFx0XHRcdGlmIGZmXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRpZiBmLnR5cGUgPT0gJ3NlY3Rpb24nXHJcblx0XHRcdFx0XHRmZiA9IF8uZmluZCBmLmZpZWxkcywgIChzZikgLT5cclxuXHRcdFx0XHRcdFx0cmV0dXJuIHNmLmNvZGUgPT0ga2V5XHJcblx0XHRcdFx0ZWxzZSBpZiBmLmNvZGUgPT0ga2V5XHJcblx0XHRcdFx0XHRmZiA9IGZcclxuXHJcblx0XHRcdHJldHVybiBmZlxyXG5cclxuXHRcdGdldEZvcm1UYWJsZVN1YkZpZWxkID0gKHRhYmxlRmllbGQsIHN1YkZpZWxkQ29kZSkgLT5cclxuXHRcdFx0cmV0dXJuIF8uZmluZCB0YWJsZUZpZWxkLmZpZWxkcywgIChmKSAtPlxyXG5cdFx0XHRcdHJldHVybiBmLmNvZGUgPT0gc3ViRmllbGRDb2RlXHJcblxyXG5cdFx0Z2V0RmllbGRPZGF0YVZhbHVlID0gKG9iak5hbWUsIGlkKSAtPlxyXG5cdFx0XHRvYmogPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqTmFtZSlcclxuXHRcdFx0byA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iak5hbWUsIHNwYWNlSWQpXHJcblx0XHRcdG5hbWVLZXkgPSBvLk5BTUVfRklFTERfS0VZXHJcblx0XHRcdGlmICFvYmpcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0aWYgXy5pc1N0cmluZyBpZFxyXG5cdFx0XHRcdF9yZWNvcmQgPSBvYmouZmluZE9uZShpZClcclxuXHRcdFx0XHRpZiBfcmVjb3JkXHJcblx0XHRcdFx0XHRfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmRbbmFtZUtleV1cclxuXHRcdFx0XHRcdHJldHVybiBfcmVjb3JkXHJcblx0XHRcdGVsc2UgaWYgXy5pc0FycmF5IGlkXHJcblx0XHRcdFx0X3JlY29yZHMgPSBbXVxyXG5cdFx0XHRcdG9iai5maW5kKHsgX2lkOiB7ICRpbjogaWQgfSB9KS5mb3JFYWNoIChfcmVjb3JkKSAtPlxyXG5cdFx0XHRcdFx0X3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkW25hbWVLZXldXHJcblx0XHRcdFx0XHRfcmVjb3Jkcy5wdXNoIF9yZWNvcmRcclxuXHJcblx0XHRcdFx0aWYgIV8uaXNFbXB0eSBfcmVjb3Jkc1xyXG5cdFx0XHRcdFx0cmV0dXJuIF9yZWNvcmRzXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGdldFNlbGVjdFVzZXJWYWx1ZSA9ICh1c2VySWQsIHNwYWNlSWQpIC0+XHJcblx0XHRcdHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0pXHJcblx0XHRcdHN1LmlkID0gdXNlcklkXHJcblx0XHRcdHJldHVybiBzdVxyXG5cclxuXHRcdGdldFNlbGVjdFVzZXJWYWx1ZXMgPSAodXNlcklkcywgc3BhY2VJZCkgLT5cclxuXHRcdFx0c3VzID0gW11cclxuXHRcdFx0aWYgXy5pc0FycmF5IHVzZXJJZHNcclxuXHRcdFx0XHRfLmVhY2ggdXNlcklkcywgKHVzZXJJZCkgLT5cclxuXHRcdFx0XHRcdHN1ID0gZ2V0U2VsZWN0VXNlclZhbHVlKHVzZXJJZCwgc3BhY2VJZClcclxuXHRcdFx0XHRcdGlmIHN1XHJcblx0XHRcdFx0XHRcdHN1cy5wdXNoKHN1KVxyXG5cdFx0XHRyZXR1cm4gc3VzXHJcblxyXG5cdFx0Z2V0U2VsZWN0T3JnVmFsdWUgPSAob3JnSWQsIHNwYWNlSWQpIC0+XHJcblx0XHRcdG9yZyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmRPbmUob3JnSWQsIHsgZmllbGRzOiB7IF9pZDogMSwgbmFtZTogMSwgZnVsbG5hbWU6IDEgfSB9KVxyXG5cdFx0XHRvcmcuaWQgPSBvcmdJZFxyXG5cdFx0XHRyZXR1cm4gb3JnXHJcblxyXG5cdFx0Z2V0U2VsZWN0T3JnVmFsdWVzID0gKG9yZ0lkcywgc3BhY2VJZCkgLT5cclxuXHRcdFx0b3JncyA9IFtdXHJcblx0XHRcdGlmIF8uaXNBcnJheSBvcmdJZHNcclxuXHRcdFx0XHRfLmVhY2ggb3JnSWRzLCAob3JnSWQpIC0+XHJcblx0XHRcdFx0XHRvcmcgPSBnZXRTZWxlY3RPcmdWYWx1ZShvcmdJZCwgc3BhY2VJZClcclxuXHRcdFx0XHRcdGlmIG9yZ1xyXG5cdFx0XHRcdFx0XHRvcmdzLnB1c2gob3JnKVxyXG5cdFx0XHRyZXR1cm4gb3Jnc1xyXG5cclxuXHRcdHRhYmxlRmllbGRDb2RlcyA9IFtdXHJcblx0XHR0YWJsZUZpZWxkTWFwID0gW11cclxuXHRcdHRhYmxlVG9SZWxhdGVkTWFwID0ge31cclxuXHJcblx0XHRvdy5maWVsZF9tYXA/LmZvckVhY2ggKGZtKSAtPlxyXG5cdFx0XHRvYmplY3RfZmllbGQgPSBmbS5vYmplY3RfZmllbGRcclxuXHRcdFx0d29ya2Zsb3dfZmllbGQgPSBmbS53b3JrZmxvd19maWVsZFxyXG5cdFx0XHRyZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZShvYmplY3RfZmllbGQpXHJcblx0XHRcdGZvcm1UYWJsZUZpZWxkQ29kZSA9IGdldEZvcm1UYWJsZUZpZWxkQ29kZSh3b3JrZmxvd19maWVsZClcclxuXHRcdFx0b2JqRmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdF9maWVsZF1cclxuXHRcdFx0Zm9ybUZpZWxkID0gZ2V0Rm9ybUZpZWxkKHdvcmtmbG93X2ZpZWxkKVxyXG5cdFx0XHQjIOWkhOeQhuWtkOihqOWtl+autVxyXG5cdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGRDb2RlXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0b1RhYmxlQ29kZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdXHJcblx0XHRcdFx0b1RhYmxlRmllbGRDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV1cclxuXHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcEtleSA9IG9UYWJsZUNvZGVcclxuXHRcdFx0XHRpZiAhdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldXHJcblx0XHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0gPSB7fVxyXG5cclxuXHRcdFx0XHRpZiBmb3JtVGFibGVGaWVsZENvZGVcclxuXHRcdFx0XHRcdHdUYWJsZUNvZGUgPSB3b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdXHJcblx0XHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bJ19GUk9NX1RBQkxFX0NPREUnXSA9IHdUYWJsZUNvZGVcclxuXHJcblx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldW29UYWJsZUZpZWxkQ29kZV0gPSB3b3JrZmxvd19maWVsZFxyXG5cdFx0XHQjIOWIpOaWreaYr+WQpuaYr+ihqOagvOWtl+autVxyXG5cdFx0XHRlbHNlIGlmIHdvcmtmbG93X2ZpZWxkLmluZGV4T2YoJy4kLicpID4gMCBhbmQgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID4gMFxyXG5cdFx0XHRcdHdUYWJsZUNvZGUgPSB3b3JrZmxvd19maWVsZC5zcGxpdCgnLiQuJylbMF1cclxuXHRcdFx0XHRvVGFibGVDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJC4nKVswXVxyXG5cdFx0XHRcdGlmIHJlY29yZC5oYXNPd25Qcm9wZXJ0eShvVGFibGVDb2RlKSBhbmQgXy5pc0FycmF5KHJlY29yZFtvVGFibGVDb2RlXSlcclxuXHRcdFx0XHRcdHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcclxuXHRcdFx0XHRcdFx0d29ya2Zsb3dfdGFibGVfZmllbGRfY29kZTogd1RhYmxlQ29kZSxcclxuXHRcdFx0XHRcdFx0b2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcclxuXHRcdFx0XHRcdH0pKVxyXG5cdFx0XHRcdFx0dGFibGVGaWVsZE1hcC5wdXNoKGZtKVxyXG5cclxuXHRcdFx0IyDlpITnkIZsb29rdXDjgIFtYXN0ZXJfZGV0YWls57G75Z6L5a2X5q61XHJcblx0XHRcdGVsc2UgaWYgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4nKSA+IDAgYW5kIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA9PSAtMVxyXG5cdFx0XHRcdG9iamVjdEZpZWxkTmFtZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdXHJcblx0XHRcdFx0bG9va3VwRmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV1cclxuXHRcdFx0XHRpZiBvYmplY3RcclxuXHRcdFx0XHRcdG9iamVjdEZpZWxkID0gb2JqZWN0LmZpZWxkc1tvYmplY3RGaWVsZE5hbWVdXHJcblx0XHRcdFx0XHRpZiBvYmplY3RGaWVsZCAmJiBmb3JtRmllbGQgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iamVjdEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0XHRmaWVsZHNPYmogPSB7fVxyXG5cdFx0XHRcdFx0XHRmaWVsZHNPYmpbbG9va3VwRmllbGROYW1lXSA9IDFcclxuXHRcdFx0XHRcdFx0bG9va3VwT2JqZWN0UmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZE9uZShyZWNvcmRbb2JqZWN0RmllbGROYW1lXSwgeyBmaWVsZHM6IGZpZWxkc09iaiB9KVxyXG5cdFx0XHRcdFx0XHRvYmplY3RGaWVsZE9iamVjdE5hbWUgPSBvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG9cclxuXHRcdFx0XHRcdFx0bG9va3VwRmllbGRPYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RGaWVsZE9iamVjdE5hbWUsIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdG9iamVjdExvb2t1cEZpZWxkID0gbG9va3VwRmllbGRPYmouZmllbGRzW2xvb2t1cEZpZWxkTmFtZV1cclxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gbG9va3VwT2JqZWN0UmVjb3JkW2xvb2t1cEZpZWxkTmFtZV1cclxuXHRcdFx0XHRcdFx0aWYgb2JqZWN0TG9va3VwRmllbGQgJiYgZm9ybUZpZWxkICYmIGZvcm1GaWVsZC50eXBlID09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iamVjdExvb2t1cEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90b1xyXG5cdFx0XHRcdFx0XHRcdG9kYXRhRmllbGRWYWx1ZVxyXG5cdFx0XHRcdFx0XHRcdGlmIG9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgIW9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3RcclxuXHRcdFx0XHRcdFx0XHRcdG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gb2RhdGFGaWVsZFZhbHVlXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gbG9va3VwT2JqZWN0UmVjb3JkW2xvb2t1cEZpZWxkTmFtZV1cclxuXHJcblx0XHRcdCMgbG9va3Vw44CBbWFzdGVyX2RldGFpbOWtl+auteWQjOatpeWIsG9kYXRh5a2X5q61XHJcblx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkICYmIG9iakZpZWxkICYmIGZvcm1GaWVsZC50eXBlID09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iakZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqRmllbGQucmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9iakZpZWxkLnJlZmVyZW5jZV90b1xyXG5cdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvYmpGaWVsZC5uYW1lXVxyXG5cdFx0XHRcdG9kYXRhRmllbGRWYWx1ZVxyXG5cdFx0XHRcdGlmIG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxyXG5cdFx0XHRcdGVsc2UgaWYgIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3RcclxuXHRcdFx0XHRcdG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcclxuXHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gb2RhdGFGaWVsZFZhbHVlXHJcblx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkICYmIG9iakZpZWxkICYmIFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKGZvcm1GaWVsZC50eXBlKSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob2JqRmllbGQucmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvYmpGaWVsZC5uYW1lXVxyXG5cdFx0XHRcdGlmICFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxyXG5cdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZVxyXG5cdFx0XHRcdFx0aWYgZm9ybUZpZWxkLnR5cGUgPT0gJ3VzZXInXHJcblx0XHRcdFx0XHRcdGlmIG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcclxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAhb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQudHlwZSA9PSAnZ3JvdXAnXHJcblx0XHRcdFx0XHRcdGlmIG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0XHRcdHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHRlbHNlIGlmICFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcclxuXHRcdFx0XHRcdGlmIHNlbGVjdEZpZWxkVmFsdWVcclxuXHRcdFx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHNlbGVjdEZpZWxkVmFsdWVcclxuXHRcdFx0ZWxzZSBpZiByZWNvcmQuaGFzT3duUHJvcGVydHkob2JqZWN0X2ZpZWxkKVxyXG5cdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSByZWNvcmRbb2JqZWN0X2ZpZWxkXVxyXG5cclxuXHRcdCMg6KGo5qC85a2X5q61XHJcblx0XHRfLnVuaXEodGFibGVGaWVsZENvZGVzKS5mb3JFYWNoICh0ZmMpIC0+XHJcblx0XHRcdGMgPSBKU09OLnBhcnNlKHRmYylcclxuXHRcdFx0dmFsdWVzW2Mud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZV0gPSBbXVxyXG5cdFx0XHRyZWNvcmRbYy5vYmplY3RfdGFibGVfZmllbGRfY29kZV0uZm9yRWFjaCAodHIpIC0+XHJcblx0XHRcdFx0bmV3VHIgPSB7fVxyXG5cdFx0XHRcdF8uZWFjaCB0ciwgKHYsIGspIC0+XHJcblx0XHRcdFx0XHR0YWJsZUZpZWxkTWFwLmZvckVhY2ggKHRmbSkgLT5cclxuXHRcdFx0XHRcdFx0aWYgdGZtLm9iamVjdF9maWVsZCBpcyAoYy5vYmplY3RfdGFibGVfZmllbGRfY29kZSArICcuJC4nICsgaylcclxuXHRcdFx0XHRcdFx0XHR3VGRDb2RlID0gdGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJC4nKVsxXVxyXG5cdFx0XHRcdFx0XHRcdG5ld1RyW3dUZENvZGVdID0gdlxyXG5cdFx0XHRcdGlmIG5vdCBfLmlzRW1wdHkobmV3VHIpXHJcblx0XHRcdFx0XHR2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXS5wdXNoKG5ld1RyKVxyXG5cclxuXHRcdCMg5ZCM5q2l5a2Q6KGo5pWw5o2u6Iez6KGo5Y2V6KGo5qC8XHJcblx0XHRfLmVhY2ggdGFibGVUb1JlbGF0ZWRNYXAsICAobWFwLCBrZXkpIC0+XHJcblx0XHRcdHRhYmxlQ29kZSA9IG1hcC5fRlJPTV9UQUJMRV9DT0RFXHJcblx0XHRcdGZvcm1UYWJsZUZpZWxkID0gZ2V0Rm9ybVRhYmxlRmllbGQodGFibGVDb2RlKVxyXG5cdFx0XHRpZiAhdGFibGVDb2RlXHJcblx0XHRcdFx0Y29uc29sZS53YXJuKCd0YWJsZVRvUmVsYXRlZDogWycgKyBrZXkgKyAnXSBtaXNzaW5nIGNvcnJlc3BvbmRpbmcgdGFibGUuJylcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3ROYW1lID0ga2V5XHJcblx0XHRcdFx0dGFibGVWYWx1ZXMgPSBbXVxyXG5cdFx0XHRcdHJlbGF0ZWRUYWJsZUl0ZW1zID0gW11cclxuXHRcdFx0XHRyZWxhdGVkT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpXHJcblx0XHRcdFx0cmVsYXRlZEZpZWxkID0gXy5maW5kIHJlbGF0ZWRPYmplY3QuZmllbGRzLCAoZikgLT5cclxuXHRcdFx0XHRcdHJldHVybiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMoZi50eXBlKSAmJiBmLnJlZmVyZW5jZV90byA9PSBvYmplY3ROYW1lXHJcblxyXG5cdFx0XHRcdHJlbGF0ZWRGaWVsZE5hbWUgPSByZWxhdGVkRmllbGQubmFtZVxyXG5cclxuXHRcdFx0XHRzZWxlY3RvciA9IHt9XHJcblx0XHRcdFx0c2VsZWN0b3JbcmVsYXRlZEZpZWxkTmFtZV0gPSByZWNvcmRJZFxyXG5cdFx0XHRcdHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKVxyXG5cdFx0XHRcdHJlbGF0ZWRSZWNvcmRzID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZChzZWxlY3RvcilcclxuXHJcblx0XHRcdFx0cmVsYXRlZFJlY29yZHMuZm9yRWFjaCAocnIpIC0+XHJcblx0XHRcdFx0XHR0YWJsZVZhbHVlSXRlbSA9IHt9XHJcblx0XHRcdFx0XHRfLmVhY2ggbWFwLCAodmFsdWVLZXksIGZpZWxkS2V5KSAtPlxyXG5cdFx0XHRcdFx0XHRpZiBmaWVsZEtleSAhPSAnX0ZST01fVEFCTEVfQ09ERSdcclxuXHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWVcclxuXHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXlcclxuXHRcdFx0XHRcdFx0XHRpZiB2YWx1ZUtleS5zdGFydHNXaXRoKHRhYmxlQ29kZSArICcuJylcclxuXHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleSA9ICh2YWx1ZUtleS5zcGxpdChcIi5cIilbMV0pXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkS2V5ID0gdmFsdWVLZXlcclxuXHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRmb3JtRmllbGQgPSBnZXRGb3JtVGFibGVTdWJGaWVsZChmb3JtVGFibGVGaWVsZCwgZm9ybUZpZWxkS2V5KVxyXG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZCA9IHJlbGF0ZWRPYmplY3QuZmllbGRzW2ZpZWxkS2V5XVxyXG5cdFx0XHRcdFx0XHRcdGlmICFmb3JtRmllbGQgfHwgIXJlbGF0ZWRPYmplY3RGaWVsZFxyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdFx0XHRcdFx0aWYgZm9ybUZpZWxkLnR5cGUgPT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG9cclxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmICFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC50eXBlKSAmJiBbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcnJbZmllbGRLZXldXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAhXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgZm9ybUZpZWxkLnR5cGUgPT0gJ3VzZXInXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3RcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgZm9ybUZpZWxkLnR5cGUgPT0gJ2dyb3VwJ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3RcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3RcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBycltmaWVsZEtleV1cclxuXHRcdFx0XHRcdFx0XHR0YWJsZVZhbHVlSXRlbVtmb3JtRmllbGRLZXldID0gdGFibGVGaWVsZFZhbHVlXHJcblx0XHRcdFx0XHRpZiAhXy5pc0VtcHR5KHRhYmxlVmFsdWVJdGVtKVxyXG5cdFx0XHRcdFx0XHR0YWJsZVZhbHVlSXRlbS5faWQgPSByci5faWRcclxuXHRcdFx0XHRcdFx0dGFibGVWYWx1ZXMucHVzaCh0YWJsZVZhbHVlSXRlbSlcclxuXHRcdFx0XHRcdFx0cmVsYXRlZFRhYmxlSXRlbXMucHVzaCh7IF90YWJsZTogeyBfaWQ6IHJyLl9pZCwgX2NvZGU6IHRhYmxlQ29kZSB9IH0gKVxyXG5cclxuXHRcdFx0XHR2YWx1ZXNbdGFibGVDb2RlXSA9IHRhYmxlVmFsdWVzXHJcblx0XHRcdFx0cmVsYXRlZFRhYmxlc0luZm9bcmVsYXRlZE9iamVjdE5hbWVdID0gcmVsYXRlZFRhYmxlSXRlbXNcclxuXHJcblx0XHQjIOWmguaenOmFjee9ruS6huiEmuacrOWImeaJp+ihjOiEmuacrFxyXG5cdFx0aWYgb3cuZmllbGRfbWFwX3NjcmlwdFxyXG5cdFx0XHRfLmV4dGVuZCh2YWx1ZXMsIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0KG93LmZpZWxkX21hcF9zY3JpcHQsIG9iamVjdE5hbWUsIHNwYWNlSWQsIHJlY29yZElkKSlcclxuXHJcblx0IyDov4fmu6Tmjol2YWx1ZXPkuK3nmoTpnZ7ms5VrZXlcclxuXHRmaWx0ZXJWYWx1ZXMgPSB7fVxyXG5cdF8uZWFjaCBfLmtleXModmFsdWVzKSwgKGspIC0+XHJcblx0XHRpZiBmaWVsZENvZGVzLmluY2x1ZGVzKGspXHJcblx0XHRcdGZpbHRlclZhbHVlc1trXSA9IHZhbHVlc1trXVxyXG5cclxuXHRyZXR1cm4gZmlsdGVyVmFsdWVzXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmV2YWxGaWVsZE1hcFNjcmlwdCA9IChmaWVsZF9tYXBfc2NyaXB0LCBvYmplY3ROYW1lLCBzcGFjZUlkLCBvYmplY3RJZCkgLT5cclxuXHRyZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0TmFtZSwgc3BhY2VJZCkuZmluZE9uZShvYmplY3RJZClcclxuXHRzY3JpcHQgPSBcIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJlY29yZCkgeyBcIiArIGZpZWxkX21hcF9zY3JpcHQgKyBcIiB9XCJcclxuXHRmdW5jID0gX2V2YWwoc2NyaXB0LCBcImZpZWxkX21hcF9zY3JpcHRcIilcclxuXHR2YWx1ZXMgPSBmdW5jKHJlY29yZClcclxuXHRpZiBfLmlzT2JqZWN0IHZhbHVlc1xyXG5cdFx0cmV0dXJuIHZhbHVlc1xyXG5cdGVsc2VcclxuXHRcdGNvbnNvbGUuZXJyb3IgXCJldmFsRmllbGRNYXBTY3JpcHQ6IOiEmuacrOi/lOWbnuWAvOexu+Wei+S4jeaYr+WvueixoVwiXHJcblx0cmV0dXJuIHt9XHJcblxyXG5cclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2ggPSAocmVjb3JkSWRzLCBzcGFjZUlkLCBpbnNJZCwgYXBwcm92ZUlkKSAtPlxyXG5cclxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zWydjbXNfZmlsZXMnXS5maW5kKHtcclxuXHRcdHNwYWNlOiBzcGFjZUlkLFxyXG5cdFx0cGFyZW50OiByZWNvcmRJZHNcclxuXHR9KS5mb3JFYWNoIChjZikgLT5cclxuXHRcdF8uZWFjaCBjZi52ZXJzaW9ucywgKHZlcnNpb25JZCwgaWR4KSAtPlxyXG5cdFx0XHRmID0gQ3JlYXRvci5Db2xsZWN0aW9uc1snY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXS5maW5kT25lKHZlcnNpb25JZClcclxuXHRcdFx0bmV3RmlsZSA9IG5ldyBGUy5GaWxlKClcclxuXHJcblx0XHRcdG5ld0ZpbGUuYXR0YWNoRGF0YSBmLmNyZWF0ZVJlYWRTdHJlYW0oJ2ZpbGVzJyksIHtcclxuXHRcdFx0XHRcdHR5cGU6IGYub3JpZ2luYWwudHlwZVxyXG5cdFx0XHR9LCAoZXJyKSAtPlxyXG5cdFx0XHRcdGlmIChlcnIpXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbilcclxuXHJcblx0XHRcdFx0bmV3RmlsZS5uYW1lKGYubmFtZSgpKVxyXG5cdFx0XHRcdG5ld0ZpbGUuc2l6ZShmLnNpemUoKSlcclxuXHRcdFx0XHRtZXRhZGF0YSA9IHtcclxuXHRcdFx0XHRcdG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxyXG5cdFx0XHRcdFx0b3duZXJfbmFtZTogZi5tZXRhZGF0YS5vd25lcl9uYW1lLFxyXG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcdFx0XHRpbnN0YW5jZTogaW5zSWQsXHJcblx0XHRcdFx0XHRhcHByb3ZlOiBhcHByb3ZlSWRcclxuXHRcdFx0XHRcdHBhcmVudDogY2YuX2lkXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiBpZHggaXMgMFxyXG5cdFx0XHRcdFx0bWV0YWRhdGEuY3VycmVudCA9IHRydWVcclxuXHJcblx0XHRcdFx0bmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhXHJcblx0XHRcdFx0Y2ZzLmluc3RhbmNlcy5pbnNlcnQobmV3RmlsZSlcclxuXHJcblx0cmV0dXJuXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvID0gKHJlY29yZElkcywgaW5zSWQsIHNwYWNlSWQpIC0+XHJcblx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlY29yZElkcy5vLCBzcGFjZUlkKS51cGRhdGUocmVjb3JkSWRzLmlkc1swXSwge1xyXG5cdFx0JHB1c2g6IHtcclxuXHRcdFx0aW5zdGFuY2VzOiB7XHJcblx0XHRcdFx0JGVhY2g6IFt7XHJcblx0XHRcdFx0XHRfaWQ6IGluc0lkLFxyXG5cdFx0XHRcdFx0c3RhdGU6ICdkcmFmdCdcclxuXHRcdFx0XHR9XSxcclxuXHRcdFx0XHQkcG9zaXRpb246IDBcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdCRzZXQ6IHtcclxuXHRcdFx0bG9ja2VkOiB0cnVlXHJcblx0XHRcdGluc3RhbmNlX3N0YXRlOiAnZHJhZnQnXHJcblx0XHR9XHJcblx0fSlcclxuXHJcblx0cmV0dXJuXHJcblxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlbGF0ZWRSZWNvcmRJbnN0YW5jZUluZm8gPSAocmVsYXRlZFRhYmxlc0luZm8sIGluc0lkLCBzcGFjZUlkKSAtPlxyXG5cdF8uZWFjaCByZWxhdGVkVGFibGVzSW5mbywgKHRhYmxlSXRlbXMsIHJlbGF0ZWRPYmplY3ROYW1lKSAtPlxyXG5cdFx0cmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpXHJcblx0XHRfLmVhY2ggdGFibGVJdGVtcywgKGl0ZW0pIC0+XHJcblx0XHRcdHJlbGF0ZWRDb2xsZWN0aW9uLnVwZGF0ZShpdGVtLl90YWJsZS5faWQsIHtcclxuXHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRpbnN0YW5jZXM6IFt7XHJcblx0XHRcdFx0XHRcdF9pZDogaW5zSWQsXHJcblx0XHRcdFx0XHRcdHN0YXRlOiAnZHJhZnQnXHJcblx0XHRcdFx0XHR9XSxcclxuXHRcdFx0XHRcdF90YWJsZTogaXRlbS5fdGFibGVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblxyXG5cdHJldHVyblxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja0lzSW5BcHByb3ZhbCA9IChyZWNvcmRJZHMsIHNwYWNlSWQpIC0+XHJcblx0cmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlY29yZElkcy5vLCBzcGFjZUlkKS5maW5kT25lKHtcclxuXHRcdF9pZDogcmVjb3JkSWRzLmlkc1swXSwgaW5zdGFuY2VzOiB7ICRleGlzdHM6IHRydWUgfVxyXG5cdH0sIHsgZmllbGRzOiB7IGluc3RhbmNlczogMSB9IH0pXHJcblxyXG5cdGlmIHJlY29yZCBhbmQgcmVjb3JkLmluc3RhbmNlc1swXS5zdGF0ZSBpc250ICdjb21wbGV0ZWQnIGFuZCBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kKHJlY29yZC5pbnN0YW5jZXNbMF0uX2lkKS5jb3VudCgpID4gMFxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmraTorrDlvZXlt7Llj5HotbfmtYHnqIvmraPlnKjlrqHmibnkuK3vvIzlvoXlrqHmibnnu5PmnZ/mlrnlj6/lj5HotbfkuIvkuIDmrKHlrqHmibnvvIFcIilcclxuXHJcblx0cmV0dXJuXHJcblxyXG4iLCJ2YXIgX2V2YWwsIG9iamVjdHFsOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5fZXZhbCA9IHJlcXVpcmUoJ2V2YWwnKTtcblxub2JqZWN0cWwgPSByZXF1aXJlKCdAc3RlZWRvcy9vYmplY3RxbCcpO1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge307XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbiA9IGZ1bmN0aW9uKHJlcSkge1xuICB2YXIgYXV0aFRva2VuLCBoYXNoZWRUb2tlbiwgcXVlcnksIHVzZXIsIHVzZXJJZDtcbiAgcXVlcnkgPSByZXEucXVlcnk7XG4gIHVzZXJJZCA9IHF1ZXJ5W1wiWC1Vc2VyLUlkXCJdO1xuICBhdXRoVG9rZW4gPSBxdWVyeVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICBfaWQ6IHVzZXJJZCxcbiAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICB9KTtcbiAgaWYgKCF1c2VyKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICByZXR1cm4gdXNlcjtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2UgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICB2YXIgc3BhY2U7XG4gIHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gIGlmICghc3BhY2UpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInNwYWNlX2lk5pyJ6K+v5oiW5q2kc3BhY2Xlt7Lnu4/ooqvliKDpmaRcIik7XG4gIH1cbiAgcmV0dXJuIHNwYWNlO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93ID0gZnVuY3Rpb24oZmxvd19pZCkge1xuICB2YXIgZmxvdztcbiAgZmxvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZmxvd3MuZmluZE9uZShmbG93X2lkKTtcbiAgaWYgKCFmbG93KSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJpZOacieivr+aIluatpOa1geeoi+W3sue7j+iiq+WIoOmZpFwiKTtcbiAgfVxuICByZXR1cm4gZmxvdztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyID0gZnVuY3Rpb24oc3BhY2VfaWQsIHVzZXJfaWQpIHtcbiAgdmFyIHNwYWNlX3VzZXI7XG4gIHNwYWNlX3VzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB1c2VyOiB1c2VyX2lkXG4gIH0pO1xuICBpZiAoIXNwYWNlX3VzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInVzZXJfaWTlr7nlupTnmoTnlKjmiLfkuI3lsZ7kuo7lvZPliY1zcGFjZVwiKTtcbiAgfVxuICByZXR1cm4gc3BhY2VfdXNlcjtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyA9IGZ1bmN0aW9uKHNwYWNlX3VzZXIpIHtcbiAgdmFyIGluZm8sIG9yZztcbiAgaW5mbyA9IG5ldyBPYmplY3Q7XG4gIGluZm8ub3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb247XG4gIG9yZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub3JnYW5pemF0aW9ucy5maW5kT25lKHNwYWNlX3VzZXIub3JnYW5pemF0aW9uLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBuYW1lOiAxLFxuICAgICAgZnVsbG5hbWU6IDFcbiAgICB9XG4gIH0pO1xuICBpbmZvLm9yZ2FuaXphdGlvbl9uYW1lID0gb3JnLm5hbWU7XG4gIGluZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gb3JnLmZ1bGxuYW1lO1xuICByZXR1cm4gaW5mbztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZCA9IGZ1bmN0aW9uKGZsb3cpIHtcbiAgaWYgKGZsb3cuc3RhdGUgIT09IFwiZW5hYmxlZFwiKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvmnKrlkK/nlKgs5pON5L2c5aSx6LSlXCIpO1xuICB9XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZCA9IGZ1bmN0aW9uKGZsb3csIHNwYWNlX2lkKSB7XG4gIGlmIChmbG93LnNwYWNlICE9PSBzcGFjZV9pZCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5ZKM5bel5L2c5Yy6SUTkuI3ljLnphY1cIik7XG4gIH1cbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybSA9IGZ1bmN0aW9uKGZvcm1faWQpIHtcbiAgdmFyIGZvcm07XG4gIGZvcm0gPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZvcm1zLmZpbmRPbmUoZm9ybV9pZCk7XG4gIGlmICghZm9ybSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsICfooajljZVJROacieivr+aIluatpOihqOWNleW3sue7j+iiq+WIoOmZpCcpO1xuICB9XG4gIHJldHVybiBmb3JtO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeSA9IGZ1bmN0aW9uKGNhdGVnb3J5X2lkKSB7XG4gIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLmNhdGVnb3JpZXMuZmluZE9uZShjYXRlZ29yeV9pZCk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNyZWF0ZV9pbnN0YW5jZSA9IGZ1bmN0aW9uKGluc3RhbmNlX2Zyb21fY2xpZW50LCB1c2VyX2luZm8pIHtcbiAgdmFyIGFwcHJfb2JqLCBhcHByb3ZlX2Zyb21fY2xpZW50LCBjYXRlZ29yeSwgZmxvdywgZmxvd19pZCwgZm9ybSwgaW5zX29iaiwgbmV3X2luc19pZCwgbm93LCBwZXJtaXNzaW9ucywgcmVsYXRlZFRhYmxlc0luZm8sIHNwYWNlLCBzcGFjZV9pZCwgc3BhY2VfdXNlciwgc3BhY2VfdXNlcl9vcmdfaW5mbywgc3RhcnRfc3RlcCwgdHJhY2VfZnJvbV9jbGllbnQsIHRyYWNlX29iaiwgdXNlcl9pZDtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0sIFN0cmluZyk7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0sIFN0cmluZyk7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXSwgU3RyaW5nKTtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdLCBbXG4gICAge1xuICAgICAgbzogU3RyaW5nLFxuICAgICAgaWRzOiBbU3RyaW5nXVxuICAgIH1cbiAgXSk7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tJc0luQXBwcm92YWwoaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdWzBdLCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdKTtcbiAgc3BhY2VfaWQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdO1xuICBmbG93X2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdO1xuICB1c2VyX2lkID0gdXNlcl9pbmZvLl9pZDtcbiAgdHJhY2VfZnJvbV9jbGllbnQgPSBudWxsO1xuICBhcHByb3ZlX2Zyb21fY2xpZW50ID0gbnVsbDtcbiAgaWYgKGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdICYmIGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdKSB7XG4gICAgdHJhY2VfZnJvbV9jbGllbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXTtcbiAgICBpZiAodHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXSAmJiB0cmFjZV9mcm9tX2NsaWVudFtcImFwcHJvdmVzXCJdWzBdKSB7XG4gICAgICBhcHByb3ZlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1bXCJhcHByb3Zlc1wiXVswXTtcbiAgICB9XG4gIH1cbiAgc3BhY2UgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlKHNwYWNlX2lkKTtcbiAgZmxvdyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyhmbG93X2lkKTtcbiAgc3BhY2VfdXNlciA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyKHNwYWNlX2lkLCB1c2VyX2lkKTtcbiAgc3BhY2VfdXNlcl9vcmdfaW5mbyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyhzcGFjZV91c2VyKTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dFbmFibGVkKGZsb3cpO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZChmbG93LCBzcGFjZV9pZCk7XG4gIGZvcm0gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZvcm0oZmxvdy5mb3JtKTtcbiAgcGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd19pZCwgdXNlcl9pZCk7XG4gIGlmICghcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZGRcIikpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuW9k+WJjeeUqOaIt+ayoeacieatpOa1geeoi+eahOaWsOW7uuadg+mZkFwiKTtcbiAgfVxuICBub3cgPSBuZXcgRGF0ZTtcbiAgaW5zX29iaiA9IHt9O1xuICBpbnNfb2JqLl9pZCA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLl9tYWtlTmV3SUQoKTtcbiAgaW5zX29iai5zcGFjZSA9IHNwYWNlX2lkO1xuICBpbnNfb2JqLmZsb3cgPSBmbG93X2lkO1xuICBpbnNfb2JqLmZsb3dfdmVyc2lvbiA9IGZsb3cuY3VycmVudC5faWQ7XG4gIGluc19vYmouZm9ybSA9IGZsb3cuZm9ybTtcbiAgaW5zX29iai5mb3JtX3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuZm9ybV92ZXJzaW9uO1xuICBpbnNfb2JqLm5hbWUgPSBmbG93Lm5hbWU7XG4gIGluc19vYmouc3VibWl0dGVyID0gdXNlcl9pZDtcbiAgaW5zX29iai5zdWJtaXR0ZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gOiB1c2VyX2lkO1xuICBpbnNfb2JqLmFwcGxpY2FudF9uYW1lID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gOiB1c2VyX2luZm8ubmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdIDogc3BhY2VfdXNlci5vcmdhbml6YXRpb247XG4gIGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZVwiXSA6IHNwYWNlX3VzZXJfb3JnX2luZm8ub3JnYW5pemF0aW9uX25hbWU7XG4gIGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZVwiXSA6IHNwYWNlX3VzZXJfb3JnX2luZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudF9jb21wYW55ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfY29tcGFueVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gOiBzcGFjZV91c2VyLmNvbXBhbnlfaWQ7XG4gIGluc19vYmouc3RhdGUgPSAnZHJhZnQnO1xuICBpbnNfb2JqLmNvZGUgPSAnJztcbiAgaW5zX29iai5pc19hcmNoaXZlZCA9IGZhbHNlO1xuICBpbnNfb2JqLmlzX2RlbGV0ZWQgPSBmYWxzZTtcbiAgaW5zX29iai5jcmVhdGVkID0gbm93O1xuICBpbnNfb2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkO1xuICBpbnNfb2JqLm1vZGlmaWVkID0gbm93O1xuICBpbnNfb2JqLm1vZGlmaWVkX2J5ID0gdXNlcl9pZDtcbiAgaW5zX29iai52YWx1ZXMgPSBuZXcgT2JqZWN0O1xuICBpbnNfb2JqLnJlY29yZF9pZHMgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl07XG4gIGlmIChzcGFjZV91c2VyLmNvbXBhbnlfaWQpIHtcbiAgICBpbnNfb2JqLmNvbXBhbnlfaWQgPSBzcGFjZV91c2VyLmNvbXBhbnlfaWQ7XG4gIH1cbiAgdHJhY2Vfb2JqID0ge307XG4gIHRyYWNlX29iai5faWQgPSBuZXcgTW9uZ28uT2JqZWN0SUQoKS5fc3RyO1xuICB0cmFjZV9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZDtcbiAgdHJhY2Vfb2JqLmlzX2ZpbmlzaGVkID0gZmFsc2U7XG4gIHN0YXJ0X3N0ZXAgPSBfLmZpbmQoZmxvdy5jdXJyZW50LnN0ZXBzLCBmdW5jdGlvbihzdGVwKSB7XG4gICAgcmV0dXJuIHN0ZXAuc3RlcF90eXBlID09PSAnc3RhcnQnO1xuICB9KTtcbiAgdHJhY2Vfb2JqLnN0ZXAgPSBzdGFydF9zdGVwLl9pZDtcbiAgdHJhY2Vfb2JqLm5hbWUgPSBzdGFydF9zdGVwLm5hbWU7XG4gIHRyYWNlX29iai5zdGFydF9kYXRlID0gbm93O1xuICBhcHByX29iaiA9IHt9O1xuICBhcHByX29iai5faWQgPSBuZXcgTW9uZ28uT2JqZWN0SUQoKS5fc3RyO1xuICBhcHByX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkO1xuICBhcHByX29iai50cmFjZSA9IHRyYWNlX29iai5faWQ7XG4gIGFwcHJfb2JqLmlzX2ZpbmlzaGVkID0gZmFsc2U7XG4gIGFwcHJfb2JqLnVzZXIgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIDogdXNlcl9pZDtcbiAgYXBwcl9vYmoudXNlcl9uYW1lID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gOiB1c2VyX2luZm8ubmFtZTtcbiAgYXBwcl9vYmouaGFuZGxlciA9IHVzZXJfaWQ7XG4gIGFwcHJfb2JqLmhhbmRsZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lO1xuICBhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbiA9IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uO1xuICBhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9uYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5uYW1lO1xuICBhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IHNwYWNlX3VzZXJfb3JnX2luZm8uZnVsbG5hbWU7XG4gIGFwcHJfb2JqLnR5cGUgPSAnZHJhZnQnO1xuICBhcHByX29iai5zdGFydF9kYXRlID0gbm93O1xuICBhcHByX29iai5yZWFkX2RhdGUgPSBub3c7XG4gIGFwcHJfb2JqLmlzX3JlYWQgPSB0cnVlO1xuICBhcHByX29iai5pc19lcnJvciA9IGZhbHNlO1xuICBhcHByX29iai5kZXNjcmlwdGlvbiA9ICcnO1xuICByZWxhdGVkVGFibGVzSW5mbyA9IHt9O1xuICBhcHByX29iai52YWx1ZXMgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlVmFsdWVzKGluc19vYmoucmVjb3JkX2lkc1swXSwgZmxvd19pZCwgc3BhY2VfaWQsIGZvcm0uY3VycmVudC5maWVsZHMsIHJlbGF0ZWRUYWJsZXNJbmZvKTtcbiAgdHJhY2Vfb2JqLmFwcHJvdmVzID0gW2FwcHJfb2JqXTtcbiAgaW5zX29iai50cmFjZXMgPSBbdHJhY2Vfb2JqXTtcbiAgaW5zX29iai5pbmJveF91c2VycyA9IGluc3RhbmNlX2Zyb21fY2xpZW50LmluYm94X3VzZXJzIHx8IFtdO1xuICBpbnNfb2JqLmN1cnJlbnRfc3RlcF9uYW1lID0gc3RhcnRfc3RlcC5uYW1lO1xuICBpZiAoZmxvdy5hdXRvX3JlbWluZCA9PT0gdHJ1ZSkge1xuICAgIGluc19vYmouYXV0b19yZW1pbmQgPSB0cnVlO1xuICB9XG4gIGluc19vYmouZmxvd19uYW1lID0gZmxvdy5uYW1lO1xuICBpZiAoZm9ybS5jYXRlZ29yeSkge1xuICAgIGNhdGVnb3J5ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeShmb3JtLmNhdGVnb3J5KTtcbiAgICBpZiAoY2F0ZWdvcnkpIHtcbiAgICAgIGluc19vYmouY2F0ZWdvcnlfbmFtZSA9IGNhdGVnb3J5Lm5hbWU7XG4gICAgICBpbnNfb2JqLmNhdGVnb3J5ID0gY2F0ZWdvcnkuX2lkO1xuICAgIH1cbiAgfVxuICBuZXdfaW5zX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuaW5zZXJ0KGluc19vYmopO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvKGluc19vYmoucmVjb3JkX2lkc1swXSwgbmV3X2luc19pZCwgc3BhY2VfaWQpO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyhyZWxhdGVkVGFibGVzSW5mbywgbmV3X2luc19pZCwgc3BhY2VfaWQpO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoKGluc19vYmoucmVjb3JkX2lkc1swXSwgc3BhY2VfaWQsIGluc19vYmouX2lkLCBhcHByX29iai5faWQpO1xuICByZXR1cm4gbmV3X2luc19pZDtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMgPSBmdW5jdGlvbihyZWNvcmRJZHMsIGZsb3dJZCwgc3BhY2VJZCwgZmllbGRzLCByZWxhdGVkVGFibGVzSW5mbykge1xuICB2YXIgZmllbGRDb2RlcywgZmlsdGVyVmFsdWVzLCBmbG93LCBmb3JtLCBmb3JtRmllbGRzLCBmb3JtVGFibGVGaWVsZHMsIGZvcm1UYWJsZUZpZWxkc0NvZGUsIGdldEZpZWxkT2RhdGFWYWx1ZSwgZ2V0Rm9ybUZpZWxkLCBnZXRGb3JtVGFibGVGaWVsZCwgZ2V0Rm9ybVRhYmxlRmllbGRDb2RlLCBnZXRGb3JtVGFibGVTdWJGaWVsZCwgZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSwgZ2V0U2VsZWN0T3JnVmFsdWUsIGdldFNlbGVjdE9yZ1ZhbHVlcywgZ2V0U2VsZWN0VXNlclZhbHVlLCBnZXRTZWxlY3RVc2VyVmFsdWVzLCBvYmplY3QsIG9iamVjdE5hbWUsIG93LCByZWNvcmQsIHJlY29yZElkLCByZWYsIHJlbGF0ZWRPYmplY3RzLCByZWxhdGVkT2JqZWN0c0tleXMsIHRhYmxlRmllbGRDb2RlcywgdGFibGVGaWVsZE1hcCwgdGFibGVUb1JlbGF0ZWRNYXAsIHZhbHVlcztcbiAgZmllbGRDb2RlcyA9IFtdO1xuICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgaWYgKGYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKGYuZmllbGRzLCBmdW5jdGlvbihmZikge1xuICAgICAgICByZXR1cm4gZmllbGRDb2Rlcy5wdXNoKGZmLmNvZGUpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaWVsZENvZGVzLnB1c2goZi5jb2RlKTtcbiAgICB9XG4gIH0pO1xuICB2YWx1ZXMgPSB7fTtcbiAgb2JqZWN0TmFtZSA9IHJlY29yZElkcy5vO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3ROYW1lLCBzcGFjZUlkKTtcbiAgcmVjb3JkSWQgPSByZWNvcmRJZHMuaWRzWzBdO1xuICBvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3dvcmtmbG93cy5maW5kT25lKHtcbiAgICBvYmplY3RfbmFtZTogb2JqZWN0TmFtZSxcbiAgICBmbG93X2lkOiBmbG93SWRcbiAgfSk7XG4gIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKHJlY29yZElkKTtcbiAgZmxvdyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignZmxvd3MnKS5maW5kT25lKGZsb3dJZCwge1xuICAgIGZpZWxkczoge1xuICAgICAgZm9ybTogMVxuICAgIH1cbiAgfSk7XG4gIGlmIChvdyAmJiByZWNvcmQpIHtcbiAgICBmb3JtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiZm9ybXNcIikuZmluZE9uZShmbG93LmZvcm0pO1xuICAgIGZvcm1GaWVsZHMgPSBmb3JtLmN1cnJlbnQuZmllbGRzIHx8IFtdO1xuICAgIHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3ROYW1lLCBzcGFjZUlkKTtcbiAgICByZWxhdGVkT2JqZWN0c0tleXMgPSBfLnBsdWNrKHJlbGF0ZWRPYmplY3RzLCAnb2JqZWN0X25hbWUnKTtcbiAgICBmb3JtVGFibGVGaWVsZHMgPSBfLmZpbHRlcihmb3JtRmllbGRzLCBmdW5jdGlvbihmb3JtRmllbGQpIHtcbiAgICAgIHJldHVybiBmb3JtRmllbGQudHlwZSA9PT0gJ3RhYmxlJztcbiAgICB9KTtcbiAgICBmb3JtVGFibGVGaWVsZHNDb2RlID0gXy5wbHVjayhmb3JtVGFibGVGaWVsZHMsICdjb2RlJyk7XG4gICAgZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIF8uZmluZChyZWxhdGVkT2JqZWN0c0tleXMsIGZ1bmN0aW9uKHJlbGF0ZWRPYmplY3RzS2V5KSB7XG4gICAgICAgIHJldHVybiBrZXkuc3RhcnRzV2l0aChyZWxhdGVkT2JqZWN0c0tleSArICcuJyk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGdldEZvcm1UYWJsZUZpZWxkQ29kZSA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIF8uZmluZChmb3JtVGFibGVGaWVsZHNDb2RlLCBmdW5jdGlvbihmb3JtVGFibGVGaWVsZENvZGUpIHtcbiAgICAgICAgcmV0dXJuIGtleS5zdGFydHNXaXRoKGZvcm1UYWJsZUZpZWxkQ29kZSArICcuJyk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGdldEZvcm1UYWJsZUZpZWxkID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKGZvcm1UYWJsZUZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgICAgICByZXR1cm4gZi5jb2RlID09PSBrZXk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGdldEZvcm1GaWVsZCA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIGZmO1xuICAgICAgZmYgPSBudWxsO1xuICAgICAgXy5mb3JFYWNoKGZvcm1GaWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgaWYgKGZmKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmLnR5cGUgPT09ICdzZWN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBmZiA9IF8uZmluZChmLmZpZWxkcywgZnVuY3Rpb24oc2YpIHtcbiAgICAgICAgICAgIHJldHVybiBzZi5jb2RlID09PSBrZXk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZi5jb2RlID09PSBrZXkpIHtcbiAgICAgICAgICByZXR1cm4gZmYgPSBmO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmZjtcbiAgICB9O1xuICAgIGdldEZvcm1UYWJsZVN1YkZpZWxkID0gZnVuY3Rpb24odGFibGVGaWVsZCwgc3ViRmllbGRDb2RlKSB7XG4gICAgICByZXR1cm4gXy5maW5kKHRhYmxlRmllbGQuZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgIHJldHVybiBmLmNvZGUgPT09IHN1YkZpZWxkQ29kZTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0RmllbGRPZGF0YVZhbHVlID0gZnVuY3Rpb24ob2JqTmFtZSwgaWQpIHtcbiAgICAgIHZhciBfcmVjb3JkLCBfcmVjb3JkcywgbmFtZUtleSwgbywgb2JqO1xuICAgICAgb2JqID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iak5hbWUpO1xuICAgICAgbyA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iak5hbWUsIHNwYWNlSWQpO1xuICAgICAgbmFtZUtleSA9IG8uTkFNRV9GSUVMRF9LRVk7XG4gICAgICBpZiAoIW9iaikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoXy5pc1N0cmluZyhpZCkpIHtcbiAgICAgICAgX3JlY29yZCA9IG9iai5maW5kT25lKGlkKTtcbiAgICAgICAgaWYgKF9yZWNvcmQpIHtcbiAgICAgICAgICBfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmRbbmFtZUtleV07XG4gICAgICAgICAgcmV0dXJuIF9yZWNvcmQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoXy5pc0FycmF5KGlkKSkge1xuICAgICAgICBfcmVjb3JkcyA9IFtdO1xuICAgICAgICBvYmouZmluZCh7XG4gICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAkaW46IGlkXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKF9yZWNvcmQpIHtcbiAgICAgICAgICBfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmRbbmFtZUtleV07XG4gICAgICAgICAgcmV0dXJuIF9yZWNvcmRzLnB1c2goX3JlY29yZCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIV8uaXNFbXB0eShfcmVjb3JkcykpIHtcbiAgICAgICAgICByZXR1cm4gX3JlY29yZHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGdldFNlbGVjdFVzZXJWYWx1ZSA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICAgICAgdmFyIHN1O1xuICAgICAgc3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0pO1xuICAgICAgc3UuaWQgPSB1c2VySWQ7XG4gICAgICByZXR1cm4gc3U7XG4gICAgfTtcbiAgICBnZXRTZWxlY3RVc2VyVmFsdWVzID0gZnVuY3Rpb24odXNlcklkcywgc3BhY2VJZCkge1xuICAgICAgdmFyIHN1cztcbiAgICAgIHN1cyA9IFtdO1xuICAgICAgaWYgKF8uaXNBcnJheSh1c2VySWRzKSkge1xuICAgICAgICBfLmVhY2godXNlcklkcywgZnVuY3Rpb24odXNlcklkKSB7XG4gICAgICAgICAgdmFyIHN1O1xuICAgICAgICAgIHN1ID0gZ2V0U2VsZWN0VXNlclZhbHVlKHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgICAgICAgaWYgKHN1KSB7XG4gICAgICAgICAgICByZXR1cm4gc3VzLnB1c2goc3UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VzO1xuICAgIH07XG4gICAgZ2V0U2VsZWN0T3JnVmFsdWUgPSBmdW5jdGlvbihvcmdJZCwgc3BhY2VJZCkge1xuICAgICAgdmFyIG9yZztcbiAgICAgIG9yZyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmRPbmUob3JnSWQsIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBvcmcuaWQgPSBvcmdJZDtcbiAgICAgIHJldHVybiBvcmc7XG4gICAgfTtcbiAgICBnZXRTZWxlY3RPcmdWYWx1ZXMgPSBmdW5jdGlvbihvcmdJZHMsIHNwYWNlSWQpIHtcbiAgICAgIHZhciBvcmdzO1xuICAgICAgb3JncyA9IFtdO1xuICAgICAgaWYgKF8uaXNBcnJheShvcmdJZHMpKSB7XG4gICAgICAgIF8uZWFjaChvcmdJZHMsIGZ1bmN0aW9uKG9yZ0lkKSB7XG4gICAgICAgICAgdmFyIG9yZztcbiAgICAgICAgICBvcmcgPSBnZXRTZWxlY3RPcmdWYWx1ZShvcmdJZCwgc3BhY2VJZCk7XG4gICAgICAgICAgaWYgKG9yZykge1xuICAgICAgICAgICAgcmV0dXJuIG9yZ3MucHVzaChvcmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3JncztcbiAgICB9O1xuICAgIHRhYmxlRmllbGRDb2RlcyA9IFtdO1xuICAgIHRhYmxlRmllbGRNYXAgPSBbXTtcbiAgICB0YWJsZVRvUmVsYXRlZE1hcCA9IHt9O1xuICAgIGlmICgocmVmID0gb3cuZmllbGRfbWFwKSAhPSBudWxsKSB7XG4gICAgICByZWYuZm9yRWFjaChmdW5jdGlvbihmbSkge1xuICAgICAgICB2YXIgZmllbGRzT2JqLCBmb3JtRmllbGQsIGZvcm1UYWJsZUZpZWxkQ29kZSwgbG9va3VwRmllbGROYW1lLCBsb29rdXBGaWVsZE9iaiwgbG9va3VwT2JqZWN0UmVjb3JkLCBvVGFibGVDb2RlLCBvVGFibGVGaWVsZENvZGUsIG9iakZpZWxkLCBvYmplY3RGaWVsZCwgb2JqZWN0RmllbGROYW1lLCBvYmplY3RGaWVsZE9iamVjdE5hbWUsIG9iamVjdExvb2t1cEZpZWxkLCBvYmplY3RfZmllbGQsIG9kYXRhRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlbGF0ZWRPYmplY3RGaWVsZENvZGUsIHNlbGVjdEZpZWxkVmFsdWUsIHRhYmxlVG9SZWxhdGVkTWFwS2V5LCB3VGFibGVDb2RlLCB3b3JrZmxvd19maWVsZDtcbiAgICAgICAgb2JqZWN0X2ZpZWxkID0gZm0ub2JqZWN0X2ZpZWxkO1xuICAgICAgICB3b3JrZmxvd19maWVsZCA9IGZtLndvcmtmbG93X2ZpZWxkO1xuICAgICAgICByZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZShvYmplY3RfZmllbGQpO1xuICAgICAgICBmb3JtVGFibGVGaWVsZENvZGUgPSBnZXRGb3JtVGFibGVGaWVsZENvZGUod29ya2Zsb3dfZmllbGQpO1xuICAgICAgICBvYmpGaWVsZCA9IG9iamVjdC5maWVsZHNbb2JqZWN0X2ZpZWxkXTtcbiAgICAgICAgZm9ybUZpZWxkID0gZ2V0Rm9ybUZpZWxkKHdvcmtmbG93X2ZpZWxkKTtcbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZENvZGUpIHtcbiAgICAgICAgICBvVGFibGVDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgb1RhYmxlRmllbGRDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgdGFibGVUb1JlbGF0ZWRNYXBLZXkgPSBvVGFibGVDb2RlO1xuICAgICAgICAgIGlmICghdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldKSB7XG4gICAgICAgICAgICB0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0gPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZvcm1UYWJsZUZpZWxkQ29kZSkge1xuICAgICAgICAgICAgd1RhYmxlQ29kZSA9IHdvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgICB0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bJ19GUk9NX1RBQkxFX0NPREUnXSA9IHdUYWJsZUNvZGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bb1RhYmxlRmllbGRDb2RlXSA9IHdvcmtmbG93X2ZpZWxkO1xuICAgICAgICB9IGVsc2UgaWYgKHdvcmtmbG93X2ZpZWxkLmluZGV4T2YoJy4kLicpID4gMCAmJiBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPiAwKSB7XG4gICAgICAgICAgd1RhYmxlQ29kZSA9IHdvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJC4nKVswXTtcbiAgICAgICAgICBvVGFibGVDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJC4nKVswXTtcbiAgICAgICAgICBpZiAocmVjb3JkLmhhc093blByb3BlcnR5KG9UYWJsZUNvZGUpICYmIF8uaXNBcnJheShyZWNvcmRbb1RhYmxlQ29kZV0pKSB7XG4gICAgICAgICAgICB0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgIHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXG4gICAgICAgICAgICAgIG9iamVjdF90YWJsZV9maWVsZF9jb2RlOiBvVGFibGVDb2RlXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICByZXR1cm4gdGFibGVGaWVsZE1hcC5wdXNoKGZtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAob2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4nKSA+IDAgJiYgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID09PSAtMSkge1xuICAgICAgICAgIG9iamVjdEZpZWxkTmFtZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgIGxvb2t1cEZpZWxkTmFtZSA9IG9iamVjdF9maWVsZC5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgIGlmIChvYmplY3QpIHtcbiAgICAgICAgICAgIG9iamVjdEZpZWxkID0gb2JqZWN0LmZpZWxkc1tvYmplY3RGaWVsZE5hbWVdO1xuICAgICAgICAgICAgaWYgKG9iamVjdEZpZWxkICYmIGZvcm1GaWVsZCAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqZWN0RmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgIGZpZWxkc09iaiA9IHt9O1xuICAgICAgICAgICAgICBmaWVsZHNPYmpbbG9va3VwRmllbGROYW1lXSA9IDE7XG4gICAgICAgICAgICAgIGxvb2t1cE9iamVjdFJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpLmZpbmRPbmUocmVjb3JkW29iamVjdEZpZWxkTmFtZV0sIHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IGZpZWxkc09ialxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgb2JqZWN0RmllbGRPYmplY3ROYW1lID0gb2JqZWN0RmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICBsb29rdXBGaWVsZE9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdEZpZWxkT2JqZWN0TmFtZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIG9iamVjdExvb2t1cEZpZWxkID0gbG9va3VwRmllbGRPYmouZmllbGRzW2xvb2t1cEZpZWxkTmFtZV07XG4gICAgICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IGxvb2t1cE9iamVjdFJlY29yZFtsb29rdXBGaWVsZE5hbWVdO1xuICAgICAgICAgICAgICBpZiAob2JqZWN0TG9va3VwRmllbGQgJiYgZm9ybUZpZWxkICYmIGZvcm1GaWVsZC50eXBlID09PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RMb29rdXBGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb09iamVjdE5hbWUgPSBvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgIG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBsb29rdXBPYmplY3RSZWNvcmRbbG9va3VwRmllbGROYW1lXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iakZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqRmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9iakZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSByZWNvcmRbb2JqRmllbGQubmFtZV07XG4gICAgICAgICAgb2RhdGFGaWVsZFZhbHVlO1xuICAgICAgICAgIGlmIChvYmpGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgIG9kYXRhRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIGlmICghb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkICYmIG9iakZpZWxkICYmIFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKGZvcm1GaWVsZC50eXBlKSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob2JqRmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvYmpGaWVsZC5uYW1lXTtcbiAgICAgICAgICBpZiAoIV8uaXNFbXB0eShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUpKSB7XG4gICAgICAgICAgICBzZWxlY3RGaWVsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKGZvcm1GaWVsZC50eXBlID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgaWYgKG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdncm91cCcpIHtcbiAgICAgICAgICAgICAgaWYgKG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZWN0RmllbGRWYWx1ZSkge1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHNlbGVjdEZpZWxkVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC5oYXNPd25Qcm9wZXJ0eShvYmplY3RfZmllbGQpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSByZWNvcmRbb2JqZWN0X2ZpZWxkXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIF8udW5pcSh0YWJsZUZpZWxkQ29kZXMpLmZvckVhY2goZnVuY3Rpb24odGZjKSB7XG4gICAgICB2YXIgYztcbiAgICAgIGMgPSBKU09OLnBhcnNlKHRmYyk7XG4gICAgICB2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXSA9IFtdO1xuICAgICAgcmV0dXJuIHJlY29yZFtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXS5mb3JFYWNoKGZ1bmN0aW9uKHRyKSB7XG4gICAgICAgIHZhciBuZXdUcjtcbiAgICAgICAgbmV3VHIgPSB7fTtcbiAgICAgICAgXy5lYWNoKHRyLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYmxlRmllbGRNYXAuZm9yRWFjaChmdW5jdGlvbih0Zm0pIHtcbiAgICAgICAgICAgIHZhciB3VGRDb2RlO1xuICAgICAgICAgICAgaWYgKHRmbS5vYmplY3RfZmllbGQgPT09IChjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlICsgJy4kLicgKyBrKSkge1xuICAgICAgICAgICAgICB3VGRDb2RlID0gdGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJC4nKVsxXTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5ld1RyW3dUZENvZGVdID0gdjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghXy5pc0VtcHR5KG5ld1RyKSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXS5wdXNoKG5ld1RyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgXy5lYWNoKHRhYmxlVG9SZWxhdGVkTWFwLCBmdW5jdGlvbihtYXAsIGtleSkge1xuICAgICAgdmFyIGZvcm1UYWJsZUZpZWxkLCByZWxhdGVkQ29sbGVjdGlvbiwgcmVsYXRlZEZpZWxkLCByZWxhdGVkRmllbGROYW1lLCByZWxhdGVkT2JqZWN0LCByZWxhdGVkT2JqZWN0TmFtZSwgcmVsYXRlZFJlY29yZHMsIHJlbGF0ZWRUYWJsZUl0ZW1zLCBzZWxlY3RvciwgdGFibGVDb2RlLCB0YWJsZVZhbHVlcztcbiAgICAgIHRhYmxlQ29kZSA9IG1hcC5fRlJPTV9UQUJMRV9DT0RFO1xuICAgICAgZm9ybVRhYmxlRmllbGQgPSBnZXRGb3JtVGFibGVGaWVsZCh0YWJsZUNvZGUpO1xuICAgICAgaWYgKCF0YWJsZUNvZGUpIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUud2FybigndGFibGVUb1JlbGF0ZWQ6IFsnICsga2V5ICsgJ10gbWlzc2luZyBjb3JyZXNwb25kaW5nIHRhYmxlLicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVsYXRlZE9iamVjdE5hbWUgPSBrZXk7XG4gICAgICAgIHRhYmxlVmFsdWVzID0gW107XG4gICAgICAgIHJlbGF0ZWRUYWJsZUl0ZW1zID0gW107XG4gICAgICAgIHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCk7XG4gICAgICAgIHJlbGF0ZWRGaWVsZCA9IF8uZmluZChyZWxhdGVkT2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgICAgICAgIHJldHVybiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMoZi50eXBlKSAmJiBmLnJlZmVyZW5jZV90byA9PT0gb2JqZWN0TmFtZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlbGF0ZWRGaWVsZE5hbWUgPSByZWxhdGVkRmllbGQubmFtZTtcbiAgICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICAgICAgc2VsZWN0b3JbcmVsYXRlZEZpZWxkTmFtZV0gPSByZWNvcmRJZDtcbiAgICAgICAgcmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpO1xuICAgICAgICByZWxhdGVkUmVjb3JkcyA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpO1xuICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKHJyKSB7XG4gICAgICAgICAgdmFyIHRhYmxlVmFsdWVJdGVtO1xuICAgICAgICAgIHRhYmxlVmFsdWVJdGVtID0ge307XG4gICAgICAgICAgXy5lYWNoKG1hcCwgZnVuY3Rpb24odmFsdWVLZXksIGZpZWxkS2V5KSB7XG4gICAgICAgICAgICB2YXIgZm9ybUZpZWxkLCBmb3JtRmllbGRLZXksIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgcmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWxhdGVkT2JqZWN0RmllbGQsIHRhYmxlRmllbGRWYWx1ZTtcbiAgICAgICAgICAgIGlmIChmaWVsZEtleSAhPT0gJ19GUk9NX1RBQkxFX0NPREUnKSB7XG4gICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZTtcbiAgICAgICAgICAgICAgZm9ybUZpZWxkS2V5O1xuICAgICAgICAgICAgICBpZiAodmFsdWVLZXkuc3RhcnRzV2l0aCh0YWJsZUNvZGUgKyAnLicpKSB7XG4gICAgICAgICAgICAgICAgZm9ybUZpZWxkS2V5ID0gKHZhbHVlS2V5LnNwbGl0KFwiLlwiKVsxXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9ybUZpZWxkS2V5ID0gdmFsdWVLZXk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZm9ybUZpZWxkID0gZ2V0Rm9ybVRhYmxlU3ViRmllbGQoZm9ybVRhYmxlRmllbGQsIGZvcm1GaWVsZEtleSk7XG4gICAgICAgICAgICAgIHJlbGF0ZWRPYmplY3RGaWVsZCA9IHJlbGF0ZWRPYmplY3QuZmllbGRzW2ZpZWxkS2V5XTtcbiAgICAgICAgICAgICAgaWYgKCFmb3JtRmllbGQgfHwgIXJlbGF0ZWRPYmplY3RGaWVsZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gcmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV07XG4gICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKGZvcm1GaWVsZC50eXBlKSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcnJbZmllbGRLZXldO1xuICAgICAgICAgICAgICAgIGlmICghXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ3VzZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1GaWVsZC50eXBlID09PSAnZ3JvdXAnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBycltmaWVsZEtleV07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlVmFsdWVJdGVtW2Zvcm1GaWVsZEtleV0gPSB0YWJsZUZpZWxkVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKCFfLmlzRW1wdHkodGFibGVWYWx1ZUl0ZW0pKSB7XG4gICAgICAgICAgICB0YWJsZVZhbHVlSXRlbS5faWQgPSByci5faWQ7XG4gICAgICAgICAgICB0YWJsZVZhbHVlcy5wdXNoKHRhYmxlVmFsdWVJdGVtKTtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkVGFibGVJdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgX3RhYmxlOiB7XG4gICAgICAgICAgICAgICAgX2lkOiByci5faWQsXG4gICAgICAgICAgICAgICAgX2NvZGU6IHRhYmxlQ29kZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB2YWx1ZXNbdGFibGVDb2RlXSA9IHRhYmxlVmFsdWVzO1xuICAgICAgICByZXR1cm4gcmVsYXRlZFRhYmxlc0luZm9bcmVsYXRlZE9iamVjdE5hbWVdID0gcmVsYXRlZFRhYmxlSXRlbXM7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKG93LmZpZWxkX21hcF9zY3JpcHQpIHtcbiAgICAgIF8uZXh0ZW5kKHZhbHVlcywgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5ldmFsRmllbGRNYXBTY3JpcHQob3cuZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgcmVjb3JkSWQpKTtcbiAgICB9XG4gIH1cbiAgZmlsdGVyVmFsdWVzID0ge307XG4gIF8uZWFjaChfLmtleXModmFsdWVzKSwgZnVuY3Rpb24oaykge1xuICAgIGlmIChmaWVsZENvZGVzLmluY2x1ZGVzKGspKSB7XG4gICAgICByZXR1cm4gZmlsdGVyVmFsdWVzW2tdID0gdmFsdWVzW2tdO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmaWx0ZXJWYWx1ZXM7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmV2YWxGaWVsZE1hcFNjcmlwdCA9IGZ1bmN0aW9uKGZpZWxkX21hcF9zY3JpcHQsIG9iamVjdE5hbWUsIHNwYWNlSWQsIG9iamVjdElkKSB7XG4gIHZhciBmdW5jLCByZWNvcmQsIHNjcmlwdCwgdmFsdWVzO1xuICByZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0TmFtZSwgc3BhY2VJZCkuZmluZE9uZShvYmplY3RJZCk7XG4gIHNjcmlwdCA9IFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocmVjb3JkKSB7IFwiICsgZmllbGRfbWFwX3NjcmlwdCArIFwiIH1cIjtcbiAgZnVuYyA9IF9ldmFsKHNjcmlwdCwgXCJmaWVsZF9tYXBfc2NyaXB0XCIpO1xuICB2YWx1ZXMgPSBmdW5jKHJlY29yZCk7XG4gIGlmIChfLmlzT2JqZWN0KHZhbHVlcykpIHtcbiAgICByZXR1cm4gdmFsdWVzO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJldmFsRmllbGRNYXBTY3JpcHQ6IOiEmuacrOi/lOWbnuWAvOexu+Wei+S4jeaYr+WvueixoVwiKTtcbiAgfVxuICByZXR1cm4ge307XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoID0gZnVuY3Rpb24ocmVjb3JkSWRzLCBzcGFjZUlkLCBpbnNJZCwgYXBwcm92ZUlkKSB7XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbJ2Ntc19maWxlcyddLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHBhcmVudDogcmVjb3JkSWRzXG4gIH0pLmZvckVhY2goZnVuY3Rpb24oY2YpIHtcbiAgICByZXR1cm4gXy5lYWNoKGNmLnZlcnNpb25zLCBmdW5jdGlvbih2ZXJzaW9uSWQsIGlkeCkge1xuICAgICAgdmFyIGYsIG5ld0ZpbGU7XG4gICAgICBmID0gQ3JlYXRvci5Db2xsZWN0aW9uc1snY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXS5maW5kT25lKHZlcnNpb25JZCk7XG4gICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgIHJldHVybiBuZXdGaWxlLmF0dGFjaERhdGEoZi5jcmVhdGVSZWFkU3RyZWFtKCdmaWxlcycpLCB7XG4gICAgICAgIHR5cGU6IGYub3JpZ2luYWwudHlwZVxuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIHZhciBtZXRhZGF0YTtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyLmVycm9yLCBlcnIucmVhc29uKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm5hbWUoZi5uYW1lKCkpO1xuICAgICAgICBuZXdGaWxlLnNpemUoZi5zaXplKCkpO1xuICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICBvd25lcjogZi5tZXRhZGF0YS5vd25lcixcbiAgICAgICAgICBvd25lcl9uYW1lOiBmLm1ldGFkYXRhLm93bmVyX25hbWUsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgaW5zdGFuY2U6IGluc0lkLFxuICAgICAgICAgIGFwcHJvdmU6IGFwcHJvdmVJZCxcbiAgICAgICAgICBwYXJlbnQ6IGNmLl9pZFxuICAgICAgICB9O1xuICAgICAgICBpZiAoaWR4ID09PSAwKSB7XG4gICAgICAgICAgbWV0YWRhdGEuY3VycmVudCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICByZXR1cm4gY2ZzLmluc3RhbmNlcy5pbnNlcnQobmV3RmlsZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvID0gZnVuY3Rpb24ocmVjb3JkSWRzLCBpbnNJZCwgc3BhY2VJZCkge1xuICBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLnVwZGF0ZShyZWNvcmRJZHMuaWRzWzBdLCB7XG4gICAgJHB1c2g6IHtcbiAgICAgIGluc3RhbmNlczoge1xuICAgICAgICAkZWFjaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIF9pZDogaW5zSWQsXG4gICAgICAgICAgICBzdGF0ZTogJ2RyYWZ0J1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgJHBvc2l0aW9uOiAwXG4gICAgICB9XG4gICAgfSxcbiAgICAkc2V0OiB7XG4gICAgICBsb2NrZWQ6IHRydWUsXG4gICAgICBpbnN0YW5jZV9zdGF0ZTogJ2RyYWZ0J1xuICAgIH1cbiAgfSk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyA9IGZ1bmN0aW9uKHJlbGF0ZWRUYWJsZXNJbmZvLCBpbnNJZCwgc3BhY2VJZCkge1xuICBfLmVhY2gocmVsYXRlZFRhYmxlc0luZm8sIGZ1bmN0aW9uKHRhYmxlSXRlbXMsIHJlbGF0ZWRPYmplY3ROYW1lKSB7XG4gICAgdmFyIHJlbGF0ZWRDb2xsZWN0aW9uO1xuICAgIHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKTtcbiAgICByZXR1cm4gXy5lYWNoKHRhYmxlSXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiByZWxhdGVkQ29sbGVjdGlvbi51cGRhdGUoaXRlbS5fdGFibGUuX2lkLCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBpbnN0YW5jZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgX2lkOiBpbnNJZCxcbiAgICAgICAgICAgICAgc3RhdGU6ICdkcmFmdCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdLFxuICAgICAgICAgIF90YWJsZTogaXRlbS5fdGFibGVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja0lzSW5BcHByb3ZhbCA9IGZ1bmN0aW9uKHJlY29yZElkcywgc3BhY2VJZCkge1xuICB2YXIgcmVjb3JkO1xuICByZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLmZpbmRPbmUoe1xuICAgIF9pZDogcmVjb3JkSWRzLmlkc1swXSxcbiAgICBpbnN0YW5jZXM6IHtcbiAgICAgICRleGlzdHM6IHRydWVcbiAgICB9XG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGluc3RhbmNlczogMVxuICAgIH1cbiAgfSk7XG4gIGlmIChyZWNvcmQgJiYgcmVjb3JkLmluc3RhbmNlc1swXS5zdGF0ZSAhPT0gJ2NvbXBsZXRlZCcgJiYgQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZChyZWNvcmQuaW5zdGFuY2VzWzBdLl9pZCkuY291bnQoKSA+IDApIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuatpOiusOW9leW3suWPkei1t+a1geeoi+ato+WcqOWuoeaJueS4re+8jOW+heWuoeaJuee7k+adn+aWueWPr+WPkei1t+S4i+S4gOasoeWuoeaJue+8gVwiKTtcbiAgfVxufTtcbiIsIkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9zMy9cIiwgIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHJcblx0SnNvblJvdXRlcy5wYXJzZUZpbGVzIHJlcSwgcmVzLCAoKS0+XHJcblx0XHRjb2xsZWN0aW9uID0gY2ZzLmZpbGVzXHJcblx0XHRmaWxlQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0T2JqZWN0KFwiY21zX2ZpbGVzXCIpLmRiXHJcblxyXG5cdFx0aWYgcmVxLmZpbGVzIGFuZCByZXEuZmlsZXNbMF1cclxuXHJcblx0XHRcdG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xyXG5cdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEgcmVxLmZpbGVzWzBdLmRhdGEsIHt0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGV9LCAoZXJyKSAtPlxyXG5cdFx0XHRcdGZpbGVuYW1lID0gcmVxLmZpbGVzWzBdLmZpbGVuYW1lXHJcblx0XHRcdFx0ZXh0ZW50aW9uID0gZmlsZW5hbWUuc3BsaXQoJy4nKS5wb3AoKVxyXG5cdFx0XHRcdGlmIFtcImltYWdlLmpwZ1wiLCBcImltYWdlLmdpZlwiLCBcImltYWdlLmpwZWdcIiwgXCJpbWFnZS5wbmdcIl0uaW5jbHVkZXMoZmlsZW5hbWUudG9Mb3dlckNhc2UoKSlcclxuXHRcdFx0XHRcdGZpbGVuYW1lID0gXCJpbWFnZS1cIiArIG1vbWVudChuZXcgRGF0ZSgpKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzJykgKyBcIi5cIiArIGV4dGVudGlvblxyXG5cclxuXHRcdFx0XHRib2R5ID0gcmVxLmJvZHlcclxuXHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdGlmIGJvZHkgJiYgKGJvZHlbJ3VwbG9hZF9mcm9tJ10gaXMgXCJJRVwiIG9yIGJvZHlbJ3VwbG9hZF9mcm9tJ10gaXMgXCJub2RlXCIpXHJcblx0XHRcdFx0XHRcdGZpbGVuYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KGZpbGVuYW1lKVxyXG5cdFx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZmlsZW5hbWUpXHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIGVcclxuXHRcdFx0XHRcdGZpbGVuYW1lID0gZmlsZW5hbWUucmVwbGFjZSgvJS9nLCBcIi1cIilcclxuXHJcblx0XHRcdFx0bmV3RmlsZS5uYW1lKGZpbGVuYW1lKVxyXG5cclxuXHRcdFx0XHRpZiBib2R5ICYmIGJvZHlbJ293bmVyJ10gJiYgYm9keVsnc3BhY2UnXSAmJiBib2R5WydyZWNvcmRfaWQnXSAgJiYgYm9keVsnb2JqZWN0X25hbWUnXVxyXG5cdFx0XHRcdFx0cGFyZW50ID0gYm9keVsncGFyZW50J11cclxuXHRcdFx0XHRcdG93bmVyID0gYm9keVsnb3duZXInXVxyXG5cdFx0XHRcdFx0b3duZXJfbmFtZSA9IGJvZHlbJ293bmVyX25hbWUnXVxyXG5cdFx0XHRcdFx0c3BhY2UgPSBib2R5WydzcGFjZSddXHJcblx0XHRcdFx0XHRyZWNvcmRfaWQgPSBib2R5WydyZWNvcmRfaWQnXVxyXG5cdFx0XHRcdFx0b2JqZWN0X25hbWUgPSBib2R5WydvYmplY3RfbmFtZSddXHJcblx0XHRcdFx0XHRwYXJlbnQgPSBib2R5WydwYXJlbnQnXVxyXG5cdFx0XHRcdFx0bWV0YWRhdGEgPSB7b3duZXI6b3duZXIsIG93bmVyX25hbWU6b3duZXJfbmFtZSwgc3BhY2U6c3BhY2UsIHJlY29yZF9pZDpyZWNvcmRfaWQsIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZX1cclxuXHRcdFx0XHRcdGlmIHBhcmVudFxyXG5cdFx0XHRcdFx0XHRtZXRhZGF0YS5wYXJlbnQgPSBwYXJlbnRcclxuXHRcdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YVxyXG5cdFx0XHRcdFx0ZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0IG5ld0ZpbGVcclxuXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0ZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0IG5ld0ZpbGVcclxuXHJcblxyXG5cdFx0XHRcdHNpemUgPSBmaWxlT2JqLm9yaWdpbmFsLnNpemVcclxuXHRcdFx0XHRpZiAhc2l6ZVxyXG5cdFx0XHRcdFx0c2l6ZSA9IDEwMjRcclxuXHRcdFx0XHRpZiBwYXJlbnRcclxuXHRcdFx0XHRcdGZpbGVDb2xsZWN0aW9uLnVwZGF0ZSh7X2lkOnBhcmVudH0se1xyXG5cdFx0XHRcdFx0XHQkc2V0OlxyXG5cdFx0XHRcdFx0XHRcdGV4dGVudGlvbjogZXh0ZW50aW9uXHJcblx0XHRcdFx0XHRcdFx0c2l6ZTogc2l6ZVxyXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkOiAobmV3IERhdGUoKSlcclxuXHRcdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogb3duZXJcclxuXHRcdFx0XHRcdFx0JHB1c2g6XHJcblx0XHRcdFx0XHRcdFx0dmVyc2lvbnM6XHJcblx0XHRcdFx0XHRcdFx0XHQkZWFjaDogWyBmaWxlT2JqLl9pZCBdXHJcblx0XHRcdFx0XHRcdFx0XHQkcG9zaXRpb246IDBcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0bmV3RmlsZU9iaklkID0gZmlsZUNvbGxlY3Rpb24uZGlyZWN0Lmluc2VydCB7XHJcblx0XHRcdFx0XHRcdG5hbWU6IGZpbGVuYW1lXHJcblx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiAnJ1xyXG5cdFx0XHRcdFx0XHRleHRlbnRpb246IGV4dGVudGlvblxyXG5cdFx0XHRcdFx0XHRzaXplOiBzaXplXHJcblx0XHRcdFx0XHRcdHZlcnNpb25zOiBbZmlsZU9iai5faWRdXHJcblx0XHRcdFx0XHRcdHBhcmVudDoge286b2JqZWN0X25hbWUsaWRzOltyZWNvcmRfaWRdfVxyXG5cdFx0XHRcdFx0XHRvd25lcjogb3duZXJcclxuXHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlXHJcblx0XHRcdFx0XHRcdGNyZWF0ZWQ6IChuZXcgRGF0ZSgpKVxyXG5cdFx0XHRcdFx0XHRjcmVhdGVkX2J5OiBvd25lclxyXG5cdFx0XHRcdFx0XHRtb2RpZmllZDogKG5ldyBEYXRlKCkpXHJcblx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiBvd25lclxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZmlsZU9iai51cGRhdGUoeyRzZXQ6IHsnbWV0YWRhdGEucGFyZW50JyA6IG5ld0ZpbGVPYmpJZH19KVxyXG5cclxuXHRcdFx0XHRyZXNwID1cclxuXHRcdFx0XHRcdHZlcnNpb25faWQ6IGZpbGVPYmouX2lkLFxyXG5cdFx0XHRcdFx0c2l6ZTogc2l6ZVxyXG5cclxuXHRcdFx0XHRyZXMuc2V0SGVhZGVyKFwieC1hbXotdmVyc2lvbi1pZFwiLGZpbGVPYmouX2lkKTtcclxuXHRcdFx0XHRyZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdGVsc2VcclxuXHRcdFx0cmVzLnN0YXR1c0NvZGUgPSA1MDA7XHJcblx0XHRcdHJlcy5lbmQoKTtcclxuXHJcbkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9zMy86Y29sbGVjdGlvblwiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0dXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKVxyXG5cdFx0aWYgIXVzZXJJZFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBwZXJtaXNzaW9uXCIpXHJcblxyXG5cdFx0Y29sbGVjdGlvbk5hbWUgPSByZXEucGFyYW1zLmNvbGxlY3Rpb25cclxuXHJcblx0XHRKc29uUm91dGVzLnBhcnNlRmlsZXMgcmVxLCByZXMsICgpLT5cclxuXHRcdFx0Y29sbGVjdGlvbiA9IGNmc1tjb2xsZWN0aW9uTmFtZV1cclxuXHJcblx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gQ29sbGVjdGlvblwiKVxyXG5cclxuXHRcdFx0aWYgcmVxLmZpbGVzIGFuZCByZXEuZmlsZXNbMF1cclxuXHJcblx0XHRcdFx0bmV3RmlsZSA9IG5ldyBGUy5GaWxlKClcclxuXHRcdFx0XHRuZXdGaWxlLm5hbWUocmVxLmZpbGVzWzBdLmZpbGVuYW1lKVxyXG5cclxuXHRcdFx0XHRpZiByZXEuYm9keVxyXG5cdFx0XHRcdFx0bmV3RmlsZS5tZXRhZGF0YSA9IHJlcS5ib2R5XHJcblxyXG5cdFx0XHRcdG5ld0ZpbGUub3duZXIgPSB1c2VySWRcclxuXHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhLm93bmVyID0gdXNlcklkXHJcblxyXG5cdFx0XHRcdG5ld0ZpbGUuYXR0YWNoRGF0YSByZXEuZmlsZXNbMF0uZGF0YSwge3R5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZX1cclxuXHJcblx0XHRcdFx0Y29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxyXG5cclxuXHRcdFx0XHRyZXN1bHREYXRhID0gY29sbGVjdGlvbi5maWxlcy5maW5kT25lKG5ld0ZpbGUuX2lkKVxyXG5cdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0XHRcdGRhdGE6IHJlc3VsdERhdGFcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIEZpbGVcIilcclxuXHJcblx0XHRyZXR1cm5cclxuXHRjYXRjaCBlXHJcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0Y29kZTogZS5lcnJvciB8fCA1MDBcclxuXHRcdFx0ZGF0YToge2Vycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlfVxyXG5cdFx0fVxyXG5cclxuXHJcblxyXG5nZXRRdWVyeVN0cmluZyA9IChhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBxdWVyeSwgbWV0aG9kKSAtPlxyXG5cdGNvbnNvbGUubG9nIFwiLS0tLXV1Zmxvd01hbmFnZXIuZ2V0UXVlcnlTdHJpbmctLS0tXCJcclxuXHRBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJylcclxuXHRkYXRlID0gQUxZLnV0aWwuZGF0ZS5nZXREYXRlKClcclxuXHJcblx0cXVlcnkuRm9ybWF0ID0gXCJqc29uXCJcclxuXHRxdWVyeS5WZXJzaW9uID0gXCIyMDE3LTAzLTIxXCJcclxuXHRxdWVyeS5BY2Nlc3NLZXlJZCA9IGFjY2Vzc0tleUlkXHJcblx0cXVlcnkuU2lnbmF0dXJlTWV0aG9kID0gXCJITUFDLVNIQTFcIlxyXG5cdHF1ZXJ5LlRpbWVzdGFtcCA9IEFMWS51dGlsLmRhdGUuaXNvODYwMShkYXRlKVxyXG5cdHF1ZXJ5LlNpZ25hdHVyZVZlcnNpb24gPSBcIjEuMFwiXHJcblx0cXVlcnkuU2lnbmF0dXJlTm9uY2UgPSBTdHJpbmcoZGF0ZS5nZXRUaW1lKCkpXHJcblxyXG5cdHF1ZXJ5S2V5cyA9IE9iamVjdC5rZXlzKHF1ZXJ5KVxyXG5cdHF1ZXJ5S2V5cy5zb3J0KClcclxuXHJcblx0Y2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nID0gXCJcIlxyXG5cdHF1ZXJ5S2V5cy5mb3JFYWNoIChuYW1lKSAtPlxyXG5cdFx0Y2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nICs9IFwiJlwiICsgbmFtZSArIFwiPVwiICsgQUxZLnV0aWwucG9wRXNjYXBlKHF1ZXJ5W25hbWVdKVxyXG5cclxuXHRzdHJpbmdUb1NpZ24gPSBtZXRob2QudG9VcHBlckNhc2UoKSArICcmJTJGJicgKyBBTFkudXRpbC5wb3BFc2NhcGUoY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nLnN1YnN0cigxKSlcclxuXHJcblx0cXVlcnkuU2lnbmF0dXJlID0gQUxZLnV0aWwuY3J5cHRvLmhtYWMoc2VjcmV0QWNjZXNzS2V5ICsgJyYnLCBzdHJpbmdUb1NpZ24sICdiYXNlNjQnLCAnc2hhMScpXHJcblxyXG5cdHF1ZXJ5U3RyID0gQUxZLnV0aWwucXVlcnlQYXJhbXNUb1N0cmluZyhxdWVyeSlcclxuXHRjb25zb2xlLmxvZyBxdWVyeVN0clxyXG5cdHJldHVybiBxdWVyeVN0clxyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL3MzL3ZvZC91cGxvYWRcIiwgIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHR0cnlcclxuXHRcdHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcylcclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKVxyXG5cclxuXHRcdGNvbGxlY3Rpb25OYW1lID0gXCJ2aWRlb3NcIlxyXG5cclxuXHRcdEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKVxyXG5cclxuXHRcdEpzb25Sb3V0ZXMucGFyc2VGaWxlcyByZXEsIHJlcywgKCktPlxyXG5cdFx0XHRjb2xsZWN0aW9uID0gY2ZzW2NvbGxlY3Rpb25OYW1lXVxyXG5cclxuXHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBDb2xsZWN0aW9uXCIpXHJcblxyXG5cdFx0XHRpZiByZXEuZmlsZXMgYW5kIHJlcS5maWxlc1swXVxyXG5cclxuXHRcdFx0XHRpZiBjb2xsZWN0aW9uTmFtZSBpcyAndmlkZW9zJyBhbmQgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy5jZnM/LnN0b3JlIGlzIFwiT1NTXCJcclxuXHRcdFx0XHRcdGFjY2Vzc0tleUlkID0gTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4/LmFjY2Vzc0tleUlkXHJcblx0XHRcdFx0XHRzZWNyZXRBY2Nlc3NLZXkgPSBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bj8uc2VjcmV0QWNjZXNzS2V5XHJcblxyXG5cdFx0XHRcdFx0ZGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpXHJcblxyXG5cdFx0XHRcdFx0cXVlcnkgPSB7XHJcblx0XHRcdFx0XHRcdEFjdGlvbjogXCJDcmVhdGVVcGxvYWRWaWRlb1wiXHJcblx0XHRcdFx0XHRcdFRpdGxlOiByZXEuZmlsZXNbMF0uZmlsZW5hbWVcclxuXHRcdFx0XHRcdFx0RmlsZU5hbWU6IHJlcS5maWxlc1swXS5maWxlbmFtZVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHVybCA9IFwiaHR0cDovL3ZvZC5jbi1zaGFuZ2hhaS5hbGl5dW5jcy5jb20vP1wiICsgZ2V0UXVlcnlTdHJpbmcoYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgcXVlcnksICdHRVQnKVxyXG5cclxuXHRcdFx0XHRcdHIgPSBIVFRQLmNhbGwgJ0dFVCcsIHVybFxyXG5cclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nIHJcclxuXHJcblx0XHRcdFx0XHRpZiByLmRhdGE/LlZpZGVvSWRcclxuXHRcdFx0XHRcdFx0dmlkZW9JZCA9IHIuZGF0YS5WaWRlb0lkXHJcblx0XHRcdFx0XHRcdHVwbG9hZEFkZHJlc3MgPSBKU09OLnBhcnNlKG5ldyBCdWZmZXIoci5kYXRhLlVwbG9hZEFkZHJlc3MsICdiYXNlNjQnKS50b1N0cmluZygpKVxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyB1cGxvYWRBZGRyZXNzXHJcblx0XHRcdFx0XHRcdHVwbG9hZEF1dGggPSBKU09OLnBhcnNlKG5ldyBCdWZmZXIoci5kYXRhLlVwbG9hZEF1dGgsICdiYXNlNjQnKS50b1N0cmluZygpKVxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyB1cGxvYWRBdXRoXHJcblxyXG5cdFx0XHRcdFx0XHRvc3MgPSBuZXcgQUxZLk9TUyh7XHJcblx0XHRcdFx0XHRcdFx0XCJhY2Nlc3NLZXlJZFwiOiB1cGxvYWRBdXRoLkFjY2Vzc0tleUlkLFxyXG5cdFx0XHRcdFx0XHRcdFwic2VjcmV0QWNjZXNzS2V5XCI6IHVwbG9hZEF1dGguQWNjZXNzS2V5U2VjcmV0LFxyXG5cdFx0XHRcdFx0XHRcdFwiZW5kcG9pbnRcIjogdXBsb2FkQWRkcmVzcy5FbmRwb2ludCxcclxuXHRcdFx0XHRcdFx0XHRcImFwaVZlcnNpb25cIjogJzIwMTMtMTAtMTUnLFxyXG5cdFx0XHRcdFx0XHRcdFwic2VjdXJpdHlUb2tlblwiOiB1cGxvYWRBdXRoLlNlY3VyaXR5VG9rZW5cclxuXHRcdFx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0XHRcdG9zcy5wdXRPYmplY3Qge1xyXG5cdFx0XHRcdFx0XHRcdEJ1Y2tldDogdXBsb2FkQWRkcmVzcy5CdWNrZXQsXHJcblx0XHRcdFx0XHRcdFx0S2V5OiB1cGxvYWRBZGRyZXNzLkZpbGVOYW1lLFxyXG5cdFx0XHRcdFx0XHRcdEJvZHk6IHJlcS5maWxlc1swXS5kYXRhLFxyXG5cdFx0XHRcdFx0XHRcdEFjY2Vzc0NvbnRyb2xBbGxvd09yaWdpbjogJycsXHJcblx0XHRcdFx0XHRcdFx0Q29udGVudFR5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZSxcclxuXHRcdFx0XHRcdFx0XHRDYWNoZUNvbnRyb2w6ICduby1jYWNoZScsXHJcblx0XHRcdFx0XHRcdFx0Q29udGVudERpc3Bvc2l0aW9uOiAnJyxcclxuXHRcdFx0XHRcdFx0XHRDb250ZW50RW5jb2Rpbmc6ICd1dGYtOCcsXHJcblx0XHRcdFx0XHRcdFx0U2VydmVyU2lkZUVuY3J5cHRpb246ICdBRVMyNTYnLFxyXG5cdFx0XHRcdFx0XHRcdEV4cGlyZXM6IG51bGxcclxuXHRcdFx0XHRcdFx0fSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCAoZXJyLCBkYXRhKSAtPlxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiBlcnJcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdlcnJvcjonLCBlcnIpXHJcblx0XHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgZXJyLm1lc3NhZ2UpXHJcblxyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdzdWNjZXNzOicsIGRhdGEpXHJcblxyXG5cdFx0XHRcdFx0XHRcdG5ld0RhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKVxyXG5cclxuXHRcdFx0XHRcdFx0XHRnZXRQbGF5SW5mb1F1ZXJ5ID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0QWN0aW9uOiAnR2V0UGxheUluZm8nXHJcblx0XHRcdFx0XHRcdFx0XHRWaWRlb0lkOiB2aWRlb0lkXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRnZXRQbGF5SW5mb1VybCA9IFwiaHR0cDovL3ZvZC5jbi1zaGFuZ2hhaS5hbGl5dW5jcy5jb20vP1wiICsgZ2V0UXVlcnlTdHJpbmcoYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgZ2V0UGxheUluZm9RdWVyeSwgJ0dFVCcpXHJcblxyXG5cdFx0XHRcdFx0XHRcdGdldFBsYXlJbmZvUmVzdWx0ID0gSFRUUC5jYWxsICdHRVQnLCBnZXRQbGF5SW5mb1VybFxyXG5cclxuXHRcdFx0XHRcdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRcdFx0XHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhOiBnZXRQbGF5SW5mb1Jlc3VsdFxyXG5cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIEZpbGVcIilcclxuXHJcblx0XHRyZXR1cm5cclxuXHRjYXRjaCBlXHJcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0Y29kZTogZS5lcnJvciB8fCA1MDBcclxuXHRcdFx0ZGF0YToge2Vycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlfVxyXG5cdFx0fSIsInZhciBnZXRRdWVyeVN0cmluZztcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL3MzL1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5wYXJzZUZpbGVzKHJlcSwgcmVzLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZmlsZUNvbGxlY3Rpb24sIG5ld0ZpbGU7XG4gICAgY29sbGVjdGlvbiA9IGNmcy5maWxlcztcbiAgICBmaWxlQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0T2JqZWN0KFwiY21zX2ZpbGVzXCIpLmRiO1xuICAgIGlmIChyZXEuZmlsZXMgJiYgcmVxLmZpbGVzWzBdKSB7XG4gICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgIHJldHVybiBuZXdGaWxlLmF0dGFjaERhdGEocmVxLmZpbGVzWzBdLmRhdGEsIHtcbiAgICAgICAgdHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlXG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdmFyIGJvZHksIGUsIGV4dGVudGlvbiwgZmlsZU9iaiwgZmlsZW5hbWUsIG1ldGFkYXRhLCBuZXdGaWxlT2JqSWQsIG9iamVjdF9uYW1lLCBvd25lciwgb3duZXJfbmFtZSwgcGFyZW50LCByZWNvcmRfaWQsIHJlc3AsIHNpemUsIHNwYWNlO1xuICAgICAgICBmaWxlbmFtZSA9IHJlcS5maWxlc1swXS5maWxlbmFtZTtcbiAgICAgICAgZXh0ZW50aW9uID0gZmlsZW5hbWUuc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgICAgaWYgKFtcImltYWdlLmpwZ1wiLCBcImltYWdlLmdpZlwiLCBcImltYWdlLmpwZWdcIiwgXCJpbWFnZS5wbmdcIl0uaW5jbHVkZXMoZmlsZW5hbWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICBmaWxlbmFtZSA9IFwiaW1hZ2UtXCIgKyBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KCdZWVlZTU1EREhIbW1zcycpICsgXCIuXCIgKyBleHRlbnRpb247XG4gICAgICAgIH1cbiAgICAgICAgYm9keSA9IHJlcS5ib2R5O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChib2R5ICYmIChib2R5Wyd1cGxvYWRfZnJvbSddID09PSBcIklFXCIgfHwgYm9keVsndXBsb2FkX2Zyb20nXSA9PT0gXCJub2RlXCIpKSB7XG4gICAgICAgICAgICBmaWxlbmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudChmaWxlbmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGZpbGVuYW1lKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUucmVwbGFjZSgvJS9nLCBcIi1cIik7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RmlsZS5uYW1lKGZpbGVuYW1lKTtcbiAgICAgICAgaWYgKGJvZHkgJiYgYm9keVsnb3duZXInXSAmJiBib2R5WydzcGFjZSddICYmIGJvZHlbJ3JlY29yZF9pZCddICYmIGJvZHlbJ29iamVjdF9uYW1lJ10pIHtcbiAgICAgICAgICBwYXJlbnQgPSBib2R5WydwYXJlbnQnXTtcbiAgICAgICAgICBvd25lciA9IGJvZHlbJ293bmVyJ107XG4gICAgICAgICAgb3duZXJfbmFtZSA9IGJvZHlbJ293bmVyX25hbWUnXTtcbiAgICAgICAgICBzcGFjZSA9IGJvZHlbJ3NwYWNlJ107XG4gICAgICAgICAgcmVjb3JkX2lkID0gYm9keVsncmVjb3JkX2lkJ107XG4gICAgICAgICAgb2JqZWN0X25hbWUgPSBib2R5WydvYmplY3RfbmFtZSddO1xuICAgICAgICAgIHBhcmVudCA9IGJvZHlbJ3BhcmVudCddO1xuICAgICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgICAgICAgb3duZXJfbmFtZTogb3duZXJfbmFtZSxcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgICAgIHJlY29yZF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIHNpemUgPSBmaWxlT2JqLm9yaWdpbmFsLnNpemU7XG4gICAgICAgIGlmICghc2l6ZSkge1xuICAgICAgICAgIHNpemUgPSAxMDI0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICBmaWxlQ29sbGVjdGlvbi51cGRhdGUoe1xuICAgICAgICAgICAgX2lkOiBwYXJlbnRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgIGV4dGVudGlvbjogZXh0ZW50aW9uLFxuICAgICAgICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgbW9kaWZpZWRfYnk6IG93bmVyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJHB1c2g6IHtcbiAgICAgICAgICAgICAgdmVyc2lvbnM6IHtcbiAgICAgICAgICAgICAgICAkZWFjaDogW2ZpbGVPYmouX2lkXSxcbiAgICAgICAgICAgICAgICAkcG9zaXRpb246IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld0ZpbGVPYmpJZCA9IGZpbGVDb2xsZWN0aW9uLmRpcmVjdC5pbnNlcnQoe1xuICAgICAgICAgICAgbmFtZTogZmlsZW5hbWUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICBleHRlbnRpb246IGV4dGVudGlvbixcbiAgICAgICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgICAgICB2ZXJzaW9uczogW2ZpbGVPYmouX2lkXSxcbiAgICAgICAgICAgIHBhcmVudDoge1xuICAgICAgICAgICAgICBvOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICAgICAgaWRzOiBbcmVjb3JkX2lkXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBjcmVhdGVkX2J5OiBvd25lcixcbiAgICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IG93bmVyXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZmlsZU9iai51cGRhdGUoe1xuICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAnbWV0YWRhdGEucGFyZW50JzogbmV3RmlsZU9iaklkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzcCA9IHtcbiAgICAgICAgICB2ZXJzaW9uX2lkOiBmaWxlT2JqLl9pZCxcbiAgICAgICAgICBzaXplOiBzaXplXG4gICAgICAgIH07XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoXCJ4LWFtei12ZXJzaW9uLWlkXCIsIGZpbGVPYmouX2lkKTtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwKSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG4gICAgICByZXR1cm4gcmVzLmVuZCgpO1xuICAgIH1cbiAgfSk7XG59KTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL3MzLzpjb2xsZWN0aW9uXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBjb2xsZWN0aW9uTmFtZSwgZSwgdXNlcklkO1xuICB0cnkge1xuICAgIHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcyk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIHBlcm1pc3Npb25cIik7XG4gICAgfVxuICAgIGNvbGxlY3Rpb25OYW1lID0gcmVxLnBhcmFtcy5jb2xsZWN0aW9uO1xuICAgIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyhyZXEsIHJlcywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgbmV3RmlsZSwgcmVzdWx0RGF0YTtcbiAgICAgIGNvbGxlY3Rpb24gPSBjZnNbY29sbGVjdGlvbk5hbWVdO1xuICAgICAgaWYgKCFjb2xsZWN0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIENvbGxlY3Rpb25cIik7XG4gICAgICB9XG4gICAgICBpZiAocmVxLmZpbGVzICYmIHJlcS5maWxlc1swXSkge1xuICAgICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgICAgbmV3RmlsZS5uYW1lKHJlcS5maWxlc1swXS5maWxlbmFtZSk7XG4gICAgICAgIGlmIChyZXEuYm9keSkge1xuICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSByZXEuYm9keTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm93bmVyID0gdXNlcklkO1xuICAgICAgICBuZXdGaWxlLm1ldGFkYXRhLm93bmVyID0gdXNlcklkO1xuICAgICAgICBuZXdGaWxlLmF0dGFjaERhdGEocmVxLmZpbGVzWzBdLmRhdGEsIHtcbiAgICAgICAgICB0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGVcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbGxlY3Rpb24uaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgICByZXN1bHREYXRhID0gY29sbGVjdGlvbi5maWxlcy5maW5kT25lKG5ld0ZpbGUuX2lkKTtcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICBkYXRhOiByZXN1bHREYXRhXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gRmlsZVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogZS5lcnJvciB8fCA1MDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuXG5nZXRRdWVyeVN0cmluZyA9IGZ1bmN0aW9uKGFjY2Vzc0tleUlkLCBzZWNyZXRBY2Nlc3NLZXksIHF1ZXJ5LCBtZXRob2QpIHtcbiAgdmFyIEFMWSwgY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nLCBkYXRlLCBxdWVyeUtleXMsIHF1ZXJ5U3RyLCBzdHJpbmdUb1NpZ247XG4gIGNvbnNvbGUubG9nKFwiLS0tLXV1Zmxvd01hbmFnZXIuZ2V0UXVlcnlTdHJpbmctLS0tXCIpO1xuICBBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJyk7XG4gIGRhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKTtcbiAgcXVlcnkuRm9ybWF0ID0gXCJqc29uXCI7XG4gIHF1ZXJ5LlZlcnNpb24gPSBcIjIwMTctMDMtMjFcIjtcbiAgcXVlcnkuQWNjZXNzS2V5SWQgPSBhY2Nlc3NLZXlJZDtcbiAgcXVlcnkuU2lnbmF0dXJlTWV0aG9kID0gXCJITUFDLVNIQTFcIjtcbiAgcXVlcnkuVGltZXN0YW1wID0gQUxZLnV0aWwuZGF0ZS5pc284NjAxKGRhdGUpO1xuICBxdWVyeS5TaWduYXR1cmVWZXJzaW9uID0gXCIxLjBcIjtcbiAgcXVlcnkuU2lnbmF0dXJlTm9uY2UgPSBTdHJpbmcoZGF0ZS5nZXRUaW1lKCkpO1xuICBxdWVyeUtleXMgPSBPYmplY3Qua2V5cyhxdWVyeSk7XG4gIHF1ZXJ5S2V5cy5zb3J0KCk7XG4gIGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyA9IFwiXCI7XG4gIHF1ZXJ5S2V5cy5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nICs9IFwiJlwiICsgbmFtZSArIFwiPVwiICsgQUxZLnV0aWwucG9wRXNjYXBlKHF1ZXJ5W25hbWVdKTtcbiAgfSk7XG4gIHN0cmluZ1RvU2lnbiA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpICsgJyYlMkYmJyArIEFMWS51dGlsLnBvcEVzY2FwZShjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcuc3Vic3RyKDEpKTtcbiAgcXVlcnkuU2lnbmF0dXJlID0gQUxZLnV0aWwuY3J5cHRvLmhtYWMoc2VjcmV0QWNjZXNzS2V5ICsgJyYnLCBzdHJpbmdUb1NpZ24sICdiYXNlNjQnLCAnc2hhMScpO1xuICBxdWVyeVN0ciA9IEFMWS51dGlsLnF1ZXJ5UGFyYW1zVG9TdHJpbmcocXVlcnkpO1xuICBjb25zb2xlLmxvZyhxdWVyeVN0cik7XG4gIHJldHVybiBxdWVyeVN0cjtcbn07XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9zMy92b2QvdXBsb2FkXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBBTFksIGNvbGxlY3Rpb25OYW1lLCBlLCB1c2VySWQ7XG4gIHRyeSB7XG4gICAgdXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKTtcbiAgICB9XG4gICAgY29sbGVjdGlvbk5hbWUgPSBcInZpZGVvc1wiO1xuICAgIEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKTtcbiAgICBKc29uUm91dGVzLnBhcnNlRmlsZXMocmVxLCByZXMsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFjY2Vzc0tleUlkLCBjb2xsZWN0aW9uLCBkYXRlLCBvc3MsIHF1ZXJ5LCByLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHNlY3JldEFjY2Vzc0tleSwgdXBsb2FkQWRkcmVzcywgdXBsb2FkQXV0aCwgdXJsLCB2aWRlb0lkO1xuICAgICAgY29sbGVjdGlvbiA9IGNmc1tjb2xsZWN0aW9uTmFtZV07XG4gICAgICBpZiAoIWNvbGxlY3Rpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gQ29sbGVjdGlvblwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXEuZmlsZXMgJiYgcmVxLmZpbGVzWzBdKSB7XG4gICAgICAgIGlmIChjb2xsZWN0aW9uTmFtZSA9PT0gJ3ZpZGVvcycgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0uY2ZzKSAhPSBudWxsID8gcmVmLnN0b3JlIDogdm9pZCAwKSA9PT0gXCJPU1NcIikge1xuICAgICAgICAgIGFjY2Vzc0tleUlkID0gKHJlZjEgPSBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bikgIT0gbnVsbCA/IHJlZjEuYWNjZXNzS2V5SWQgOiB2b2lkIDA7XG4gICAgICAgICAgc2VjcmV0QWNjZXNzS2V5ID0gKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bikgIT0gbnVsbCA/IHJlZjIuc2VjcmV0QWNjZXNzS2V5IDogdm9pZCAwO1xuICAgICAgICAgIGRhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKTtcbiAgICAgICAgICBxdWVyeSA9IHtcbiAgICAgICAgICAgIEFjdGlvbjogXCJDcmVhdGVVcGxvYWRWaWRlb1wiLFxuICAgICAgICAgICAgVGl0bGU6IHJlcS5maWxlc1swXS5maWxlbmFtZSxcbiAgICAgICAgICAgIEZpbGVOYW1lOiByZXEuZmlsZXNbMF0uZmlsZW5hbWVcbiAgICAgICAgICB9O1xuICAgICAgICAgIHVybCA9IFwiaHR0cDovL3ZvZC5jbi1zaGFuZ2hhaS5hbGl5dW5jcy5jb20vP1wiICsgZ2V0UXVlcnlTdHJpbmcoYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgcXVlcnksICdHRVQnKTtcbiAgICAgICAgICByID0gSFRUUC5jYWxsKCdHRVQnLCB1cmwpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHIpO1xuICAgICAgICAgIGlmICgocmVmMyA9IHIuZGF0YSkgIT0gbnVsbCA/IHJlZjMuVmlkZW9JZCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgdmlkZW9JZCA9IHIuZGF0YS5WaWRlb0lkO1xuICAgICAgICAgICAgdXBsb2FkQWRkcmVzcyA9IEpTT04ucGFyc2UobmV3IEJ1ZmZlcihyLmRhdGEuVXBsb2FkQWRkcmVzcywgJ2Jhc2U2NCcpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codXBsb2FkQWRkcmVzcyk7XG4gICAgICAgICAgICB1cGxvYWRBdXRoID0gSlNPTi5wYXJzZShuZXcgQnVmZmVyKHIuZGF0YS5VcGxvYWRBdXRoLCAnYmFzZTY0JykudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1cGxvYWRBdXRoKTtcbiAgICAgICAgICAgIG9zcyA9IG5ldyBBTFkuT1NTKHtcbiAgICAgICAgICAgICAgXCJhY2Nlc3NLZXlJZFwiOiB1cGxvYWRBdXRoLkFjY2Vzc0tleUlkLFxuICAgICAgICAgICAgICBcInNlY3JldEFjY2Vzc0tleVwiOiB1cGxvYWRBdXRoLkFjY2Vzc0tleVNlY3JldCxcbiAgICAgICAgICAgICAgXCJlbmRwb2ludFwiOiB1cGxvYWRBZGRyZXNzLkVuZHBvaW50LFxuICAgICAgICAgICAgICBcImFwaVZlcnNpb25cIjogJzIwMTMtMTAtMTUnLFxuICAgICAgICAgICAgICBcInNlY3VyaXR5VG9rZW5cIjogdXBsb2FkQXV0aC5TZWN1cml0eVRva2VuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBvc3MucHV0T2JqZWN0KHtcbiAgICAgICAgICAgICAgQnVja2V0OiB1cGxvYWRBZGRyZXNzLkJ1Y2tldCxcbiAgICAgICAgICAgICAgS2V5OiB1cGxvYWRBZGRyZXNzLkZpbGVOYW1lLFxuICAgICAgICAgICAgICBCb2R5OiByZXEuZmlsZXNbMF0uZGF0YSxcbiAgICAgICAgICAgICAgQWNjZXNzQ29udHJvbEFsbG93T3JpZ2luOiAnJyxcbiAgICAgICAgICAgICAgQ29udGVudFR5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZSxcbiAgICAgICAgICAgICAgQ2FjaGVDb250cm9sOiAnbm8tY2FjaGUnLFxuICAgICAgICAgICAgICBDb250ZW50RGlzcG9zaXRpb246ICcnLFxuICAgICAgICAgICAgICBDb250ZW50RW5jb2Rpbmc6ICd1dGYtOCcsXG4gICAgICAgICAgICAgIFNlcnZlclNpZGVFbmNyeXB0aW9uOiAnQUVTMjU2JyxcbiAgICAgICAgICAgICAgRXhwaXJlczogbnVsbFxuICAgICAgICAgICAgfSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgICAgdmFyIGdldFBsYXlJbmZvUXVlcnksIGdldFBsYXlJbmZvUmVzdWx0LCBnZXRQbGF5SW5mb1VybCwgbmV3RGF0ZTtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjonLCBlcnIpO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3N1Y2Nlc3M6JywgZGF0YSk7XG4gICAgICAgICAgICAgIG5ld0RhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKTtcbiAgICAgICAgICAgICAgZ2V0UGxheUluZm9RdWVyeSA9IHtcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdHZXRQbGF5SW5mbycsXG4gICAgICAgICAgICAgICAgVmlkZW9JZDogdmlkZW9JZFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBnZXRQbGF5SW5mb1VybCA9IFwiaHR0cDovL3ZvZC5jbi1zaGFuZ2hhaS5hbGl5dW5jcy5jb20vP1wiICsgZ2V0UXVlcnlTdHJpbmcoYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgZ2V0UGxheUluZm9RdWVyeSwgJ0dFVCcpO1xuICAgICAgICAgICAgICBnZXRQbGF5SW5mb1Jlc3VsdCA9IEhUVFAuY2FsbCgnR0VUJywgZ2V0UGxheUluZm9VcmwpO1xuICAgICAgICAgICAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBnZXRQbGF5SW5mb1Jlc3VsdFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIEZpbGVcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IGUuZXJyb3IgfHwgNTAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvb2JqZWN0L3dvcmtmbG93L2RyYWZ0cycsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHR0cnlcclxuXHRcdGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja19hdXRob3JpemF0aW9uKHJlcSlcclxuXHRcdGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZFxyXG5cclxuXHRcdGhhc2hEYXRhID0gcmVxLmJvZHlcclxuXHJcblx0XHRpbnNlcnRlZF9pbnN0YW5jZXMgPSBuZXcgQXJyYXlcclxuXHJcblx0XHRfLmVhY2ggaGFzaERhdGFbJ0luc3RhbmNlcyddLCAoaW5zdGFuY2VfZnJvbV9jbGllbnQpIC0+XHJcblx0XHRcdG5ld19pbnNfaWQgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNyZWF0ZV9pbnN0YW5jZShpbnN0YW5jZV9mcm9tX2NsaWVudCwgY3VycmVudF91c2VyX2luZm8pXHJcblxyXG5cdFx0XHRuZXdfaW5zID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZE9uZSh7IF9pZDogbmV3X2luc19pZCB9LCB7IGZpZWxkczogeyBzcGFjZTogMSwgZmxvdzogMSwgZmxvd192ZXJzaW9uOiAxLCBmb3JtOiAxLCBmb3JtX3ZlcnNpb246IDEgfSB9KVxyXG5cclxuXHRcdFx0aW5zZXJ0ZWRfaW5zdGFuY2VzLnB1c2gobmV3X2lucylcclxuXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRkYXRhOiB7IGluc2VydHM6IGluc2VydGVkX2luc3RhbmNlcyB9XHJcblx0XHR9XHJcblx0Y2F0Y2ggZVxyXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3sgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfV0gfVxyXG5cdFx0fVxyXG5cclxuIiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS9vYmplY3Qvd29ya2Zsb3cvZHJhZnRzJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGN1cnJlbnRfdXNlcl9pZCwgY3VycmVudF91c2VyX2luZm8sIGUsIGhhc2hEYXRhLCBpbnNlcnRlZF9pbnN0YW5jZXM7XG4gIHRyeSB7XG4gICAgY3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKTtcbiAgICBjdXJyZW50X3VzZXJfaWQgPSBjdXJyZW50X3VzZXJfaW5mby5faWQ7XG4gICAgaGFzaERhdGEgPSByZXEuYm9keTtcbiAgICBpbnNlcnRlZF9pbnN0YW5jZXMgPSBuZXcgQXJyYXk7XG4gICAgXy5lYWNoKGhhc2hEYXRhWydJbnN0YW5jZXMnXSwgZnVuY3Rpb24oaW5zdGFuY2VfZnJvbV9jbGllbnQpIHtcbiAgICAgIHZhciBuZXdfaW5zLCBuZXdfaW5zX2lkO1xuICAgICAgbmV3X2luc19pZCA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY3JlYXRlX2luc3RhbmNlKGluc3RhbmNlX2Zyb21fY2xpZW50LCBjdXJyZW50X3VzZXJfaW5mbyk7XG4gICAgICBuZXdfaW5zID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogbmV3X2luc19pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBzcGFjZTogMSxcbiAgICAgICAgICBmbG93OiAxLFxuICAgICAgICAgIGZsb3dfdmVyc2lvbjogMSxcbiAgICAgICAgICBmb3JtOiAxLFxuICAgICAgICAgIGZvcm1fdmVyc2lvbjogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBpbnNlcnRlZF9pbnN0YW5jZXMucHVzaChuZXdfaW5zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBpbnNlcnRzOiBpbnNlcnRlZF9pbnN0YW5jZXNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==
