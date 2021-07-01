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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjcmVhdG9yL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvbGliL2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvb2JqZWN0X3JlY2VudF92aWV3ZWQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3ZpZXdlZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3JlY29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9yZWNlbnRfcmVjb3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9yZXBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3JlcG9ydF9kYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfZXhwb3J0MnhtbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9leHBvcnQyeG1sLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3JlbGF0ZWRfb2JqZWN0c19yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvcGVuZGluZ19zcGFjZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3BlbmRpbmdfc3BhY2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF90YWJ1bGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF9saXN0dmlld3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy91c2VyX3RhYnVsYXJfc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9yZWxhdGVkX29iamVjdHNfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV91c2VyX2luZm8uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c192aWV3X2xpbWl0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfdmlld19saW1pdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c19ub19mb3JjZV9waG9uZV91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9uZWVkX3RvX2NvbmZpcm0uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX25lZWRfdG9fY29uZmlybS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbGliL3Blcm1pc3Npb25fbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvcGVybWlzc2lvbl9tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9zMy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImJ1c2JveSIsIm1rZGlycCIsIk1ldGVvciIsInNldHRpbmdzIiwiY2ZzIiwiYWxpeXVuIiwiQ3JlYXRvciIsImdldFNjaGVtYSIsIm9iamVjdF9uYW1lIiwicmVmIiwiZ2V0T2JqZWN0Iiwic2NoZW1hIiwiZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCIsImlzQ2xpZW50IiwiUmVhY3RTdGVlZG9zIiwicGx1Z2luQ29tcG9uZW50U2VsZWN0b3IiLCJzdG9yZSIsImdldFN0YXRlIiwiZ2V0T2JqZWN0VXJsIiwicmVjb3JkX2lkIiwiYXBwX2lkIiwibGlzdF92aWV3IiwibGlzdF92aWV3X2lkIiwiU2Vzc2lvbiIsImdldCIsImdldExpc3RWaWV3IiwiX2lkIiwiZ2V0UmVsYXRpdmVVcmwiLCJnZXRPYmplY3RBYnNvbHV0ZVVybCIsIlN0ZWVkb3MiLCJhYnNvbHV0ZVVybCIsImdldE9iamVjdFJvdXRlclVybCIsImdldExpc3RWaWV3VXJsIiwidXJsIiwiZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybCIsImdldFN3aXRjaExpc3RVcmwiLCJnZXRSZWxhdGVkT2JqZWN0VXJsIiwicmVsYXRlZF9vYmplY3RfbmFtZSIsInJlbGF0ZWRfZmllbGRfbmFtZSIsImdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyIsImlzX2RlZXAiLCJpc19za2lwX2hpZGUiLCJpc19yZWxhdGVkIiwiX29iamVjdCIsIl9vcHRpb25zIiwiZmllbGRzIiwiaWNvbiIsInJlbGF0ZWRPYmplY3RzIiwiXyIsImZvckVhY2giLCJmIiwiayIsImhpZGRlbiIsInR5cGUiLCJwdXNoIiwibGFiZWwiLCJ2YWx1ZSIsInJfb2JqZWN0IiwicmVmZXJlbmNlX3RvIiwiaXNTdHJpbmciLCJmMiIsImsyIiwiZ2V0UmVsYXRlZE9iamVjdHMiLCJlYWNoIiwiX3RoaXMiLCJfcmVsYXRlZE9iamVjdCIsInJlbGF0ZWRPYmplY3QiLCJyZWxhdGVkT3B0aW9ucyIsInJlbGF0ZWRPcHRpb24iLCJmb3JlaWduX2tleSIsIm5hbWUiLCJnZXRPYmplY3RGaWx0ZXJGaWVsZE9wdGlvbnMiLCJwZXJtaXNzaW9uX2ZpZWxkcyIsImdldEZpZWxkcyIsImluY2x1ZGUiLCJ0ZXN0IiwiaW5kZXhPZiIsImdldE9iamVjdEZpZWxkT3B0aW9ucyIsImdldEZpbHRlcnNXaXRoRmlsdGVyRmllbGRzIiwiZmlsdGVycyIsImZpbHRlcl9maWVsZHMiLCJsZW5ndGgiLCJuIiwiZmllbGQiLCJyZXF1aXJlZCIsImZpbmRXaGVyZSIsImlzX2RlZmF1bHQiLCJpc19yZXF1aXJlZCIsImZpbHRlckl0ZW0iLCJtYXRjaEZpZWxkIiwiZmluZCIsImdldE9iamVjdFJlY29yZCIsInNlbGVjdF9maWVsZHMiLCJleHBhbmQiLCJjb2xsZWN0aW9uIiwicmVjb3JkIiwicmVmMSIsInJlZjIiLCJUZW1wbGF0ZSIsImluc3RhbmNlIiwib2RhdGEiLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsImdldE9iamVjdFJlY29yZE5hbWUiLCJuYW1lX2ZpZWxkX2tleSIsIk5BTUVfRklFTERfS0VZIiwiZ2V0QXBwIiwiYXBwIiwiQXBwcyIsImRlcHMiLCJkZXBlbmQiLCJnZXRBcHBEYXNoYm9hcmQiLCJkYXNoYm9hcmQiLCJEYXNoYm9hcmRzIiwiYXBwcyIsImdldEFwcERhc2hib2FyZENvbXBvbmVudCIsImdldEFwcE9iamVjdE5hbWVzIiwiYXBwT2JqZWN0cyIsImlzTW9iaWxlIiwib2JqZWN0cyIsIm1vYmlsZV9vYmplY3RzIiwib2JqIiwicGVybWlzc2lvbnMiLCJhbGxvd1JlYWQiLCJnZXRWaXNpYmxlQXBwcyIsImluY2x1ZGVBZG1pbiIsImNoYW5nZUFwcCIsIl9zdWJBcHAiLCJlbnRpdGllcyIsIk9iamVjdCIsImFzc2lnbiIsInZpc2libGVBcHBzU2VsZWN0b3IiLCJnZXRWaXNpYmxlQXBwc09iamVjdHMiLCJ2aXNpYmxlT2JqZWN0TmFtZXMiLCJmbGF0dGVuIiwicGx1Y2siLCJmaWx0ZXIiLCJPYmplY3RzIiwic29ydCIsInNvcnRpbmdNZXRob2QiLCJiaW5kIiwia2V5IiwidW5pcSIsImdldEFwcHNPYmplY3RzIiwidGVtcE9iamVjdHMiLCJjb25jYXQiLCJ2YWxpZGF0ZUZpbHRlcnMiLCJsb2dpYyIsImUiLCJlcnJvck1zZyIsImZpbHRlcl9pdGVtcyIsImZpbHRlcl9sZW5ndGgiLCJmbGFnIiwiaW5kZXgiLCJ3b3JkIiwibWFwIiwiaXNFbXB0eSIsImNvbXBhY3QiLCJyZXBsYWNlIiwibWF0Y2giLCJpIiwiaW5jbHVkZXMiLCJ3IiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwidG9hc3RyIiwiZm9ybWF0RmlsdGVyc1RvTW9uZ28iLCJvcHRpb25zIiwic2VsZWN0b3IiLCJBcnJheSIsIm9wZXJhdGlvbiIsIm9wdGlvbiIsInJlZyIsInN1Yl9zZWxlY3RvciIsImV2YWx1YXRlRm9ybXVsYSIsIlJlZ0V4cCIsImlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyIsImZvcm1hdEZpbHRlcnNUb0RldiIsImxvZ2ljVGVtcEZpbHRlcnMiLCJzdGVlZG9zRmlsdGVycyIsInJlcXVpcmUiLCJpc19sb2dpY19vciIsInBvcCIsIlVTRVJfQ09OVEVYVCIsImZvcm1hdExvZ2ljRmlsdGVyc1RvRGV2IiwiZmlsdGVyX2xvZ2ljIiwiZm9ybWF0X2xvZ2ljIiwieCIsIl9mIiwiaXNBcnJheSIsIkpTT04iLCJzdHJpbmdpZnkiLCJzcGFjZUlkIiwidXNlcklkIiwicmVsYXRlZF9vYmplY3RfbmFtZXMiLCJyZWxhdGVkX29iamVjdHMiLCJ1bnJlbGF0ZWRfb2JqZWN0cyIsImdldE9iamVjdFJlbGF0ZWRzIiwiX2NvbGxlY3Rpb25fbmFtZSIsImdldFBlcm1pc3Npb25zIiwiZGlmZmVyZW5jZSIsInJlbGF0ZWRfb2JqZWN0IiwiaXNBY3RpdmUiLCJnZXRSZWxhdGVkT2JqZWN0TmFtZXMiLCJnZXRBY3Rpb25zIiwiYWN0aW9ucyIsImRpc2FibGVkX2FjdGlvbnMiLCJzb3J0QnkiLCJ2YWx1ZXMiLCJoYXMiLCJhY3Rpb24iLCJhbGxvd19jdXN0b21BY3Rpb25zIiwia2V5cyIsImV4Y2x1ZGVfYWN0aW9ucyIsIm9uIiwiZ2V0TGlzdFZpZXdzIiwiZGlzYWJsZWRfbGlzdF92aWV3cyIsImxpc3Rfdmlld3MiLCJvYmplY3QiLCJpdGVtIiwiaXRlbV9uYW1lIiwib3duZXIiLCJmaWVsZHNOYW1lIiwidW5yZWFkYWJsZV9maWVsZHMiLCJnZXRPYmplY3RGaWVsZHNOYW1lIiwiaXNsb2FkaW5nIiwiYm9vdHN0cmFwTG9hZGVkIiwiY29udmVydFNwZWNpYWxDaGFyYWN0ZXIiLCJzdHIiLCJnZXREaXNhYmxlZEZpZWxkcyIsImZpZWxkTmFtZSIsImF1dG9mb3JtIiwiZGlzYWJsZWQiLCJvbWl0IiwiZ2V0SGlkZGVuRmllbGRzIiwiZ2V0RmllbGRzV2l0aE5vR3JvdXAiLCJncm91cCIsImdldFNvcnRlZEZpZWxkR3JvdXBOYW1lcyIsIm5hbWVzIiwidW5pcXVlIiwiZ2V0RmllbGRzRm9yR3JvdXAiLCJncm91cE5hbWUiLCJnZXRGaWVsZHNXaXRob3V0T21pdCIsInBpY2siLCJnZXRGaWVsZHNJbkZpcnN0TGV2ZWwiLCJmaXJzdExldmVsS2V5cyIsImdldEZpZWxkc0ZvclJlb3JkZXIiLCJpc1NpbmdsZSIsIl9rZXlzIiwiY2hpbGRLZXlzIiwiaXNfd2lkZV8xIiwiaXNfd2lkZV8yIiwic2NfMSIsInNjXzIiLCJlbmRzV2l0aCIsImlzX3dpZGUiLCJzbGljZSIsImlzRmlsdGVyVmFsdWVFbXB0eSIsIk51bWJlciIsImlzTmFOIiwiZ2V0RmllbGREYXRhVHlwZSIsIm9iamVjdEZpZWxkcyIsInJlc3VsdCIsImRhdGFfdHlwZSIsImlzU2VydmVyIiwiZ2V0QWxsUmVsYXRlZE9iamVjdHMiLCJyZWxhdGVkX2ZpZWxkIiwiZW5hYmxlX2ZpbGVzIiwiZm9ybWF0SW5kZXgiLCJhcnJheSIsImluZGV4TmFtZSIsImlzZG9jdW1lbnREQiIsImJhY2tncm91bmQiLCJkYXRhc291cmNlcyIsImRvY3VtZW50REIiLCJqb2luIiwic3Vic3RyaW5nIiwiYXBwc0J5TmFtZSIsIm1ldGhvZHMiLCJzcGFjZV9pZCIsImNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZCIsImN1cnJlbnRfcmVjZW50X3ZpZXdlZCIsImRvYyIsInNwYWNlIiwidXBkYXRlIiwiJGluYyIsImNvdW50IiwiJHNldCIsIm1vZGlmaWVkIiwiRGF0ZSIsIm1vZGlmaWVkX2J5IiwiaW5zZXJ0IiwiX21ha2VOZXdJRCIsIm8iLCJpZHMiLCJjcmVhdGVkIiwiY3JlYXRlZF9ieSIsImFzeW5jX3JlY2VudF9hZ2dyZWdhdGUiLCJyZWNlbnRfYWdncmVnYXRlIiwic2VhcmNoX29iamVjdCIsIl9yZWNvcmRzIiwiY2FsbGJhY2siLCJDb2xsZWN0aW9ucyIsIm9iamVjdF9yZWNlbnRfdmlld2VkIiwicmF3Q29sbGVjdGlvbiIsImFnZ3JlZ2F0ZSIsIiRtYXRjaCIsIiRncm91cCIsIm1heENyZWF0ZWQiLCIkbWF4IiwiJHNvcnQiLCIkbGltaXQiLCJ0b0FycmF5IiwiZXJyIiwiZGF0YSIsIkVycm9yIiwiaXNGdW5jdGlvbiIsIndyYXBBc3luYyIsInNlYXJjaFRleHQiLCJfb2JqZWN0X2NvbGxlY3Rpb24iLCJfb2JqZWN0X25hbWVfa2V5IiwicXVlcnkiLCJxdWVyeV9hbmQiLCJyZWNvcmRzIiwic2VhcmNoX0tleXdvcmRzIiwic3BsaXQiLCJrZXl3b3JkIiwic3VicXVlcnkiLCIkcmVnZXgiLCJ0cmltIiwiJGFuZCIsIiRpbiIsImxpbWl0IiwiX25hbWUiLCJfb2JqZWN0X25hbWUiLCJyZWNvcmRfb2JqZWN0IiwicmVjb3JkX29iamVjdF9jb2xsZWN0aW9uIiwic2VsZiIsIm9iamVjdHNCeU5hbWUiLCJvYmplY3RfcmVjb3JkIiwiZW5hYmxlX3NlYXJjaCIsInVwZGF0ZV9maWx0ZXJzIiwibGlzdHZpZXdfaWQiLCJmaWx0ZXJfc2NvcGUiLCJvYmplY3RfbGlzdHZpZXdzIiwiZGlyZWN0IiwidXBkYXRlX2NvbHVtbnMiLCJjb2x1bW5zIiwiY2hlY2siLCJjb21wb3VuZEZpZWxkcyIsImN1cnNvciIsImZpbHRlckZpZWxkcyIsImNoaWxkS2V5Iiwib2JqZWN0RmllbGQiLCJzcGxpdHMiLCJpc0NvbW1vblNwYWNlIiwiaXNTcGFjZUFkbWluIiwic2tpcCIsImZldGNoIiwiY29tcG91bmRGaWVsZEl0ZW0iLCJjb21wb3VuZEZpbHRlckZpZWxkcyIsIml0ZW1LZXkiLCJpdGVtVmFsdWUiLCJyZWZlcmVuY2VJdGVtIiwic2V0dGluZyIsImNvbHVtbl93aWR0aCIsIm9iajEiLCJfaWRfYWN0aW9ucyIsIl9taXhGaWVsZHNEYXRhIiwiX21peFJlbGF0ZWREYXRhIiwiX3dyaXRlWG1sRmlsZSIsImZzIiwibG9nZ2VyIiwicGF0aCIsInhtbDJqcyIsIkxvZ2dlciIsImpzb25PYmoiLCJvYmpOYW1lIiwiYnVpbGRlciIsImRheSIsImZpbGVBZGRyZXNzIiwiZmlsZU5hbWUiLCJmaWxlUGF0aCIsIm1vbnRoIiwibm93Iiwic3RyZWFtIiwieG1sIiwieWVhciIsIkJ1aWxkZXIiLCJidWlsZE9iamVjdCIsIkJ1ZmZlciIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiX19tZXRlb3JfYm9vdHN0cmFwX18iLCJzZXJ2ZXJEaXIiLCJleGlzdHNTeW5jIiwic3luYyIsIndyaXRlRmlsZSIsIm1peEJvb2wiLCJtaXhEYXRlIiwibWl4RGVmYXVsdCIsIm9iakZpZWxkcyIsImZpZWxkX25hbWUiLCJkYXRlIiwiZGF0ZVN0ciIsImZvcm1hdCIsIm1vbWVudCIsInJlbGF0ZWRPYmpOYW1lcyIsInJlbGF0ZWRPYmpOYW1lIiwicmVsYXRlZENvbGxlY3Rpb24iLCJyZWxhdGVkUmVjb3JkTGlzdCIsInJlbGF0ZWRUYWJsZURhdGEiLCJyZWxhdGVkT2JqIiwiZmllbGRzRGF0YSIsIkV4cG9ydDJ4bWwiLCJyZWNvcmRMaXN0IiwiaW5mbyIsInRpbWUiLCJyZWNvcmRPYmoiLCJ0aW1lRW5kIiwicmVsYXRlZF9vYmplY3RzX3JlY29yZHMiLCJyZWxhdGVkX3JlY29yZHMiLCJ2aWV3QWxsUmVjb3JkcyIsImdldFBlbmRpbmdTcGFjZUluZm8iLCJpbnZpdGVySWQiLCJpbnZpdGVyTmFtZSIsInNwYWNlTmFtZSIsImRiIiwidXNlcnMiLCJzcGFjZXMiLCJpbnZpdGVyIiwicmVmdXNlSm9pblNwYWNlIiwic3BhY2VfdXNlcnMiLCJpbnZpdGVfc3RhdGUiLCJhY2NlcHRKb2luU3BhY2UiLCJ1c2VyX2FjY2VwdGVkIiwicHVibGlzaCIsImlkIiwicHVibGlzaENvbXBvc2l0ZSIsInRhYmxlTmFtZSIsIl9maWVsZHMiLCJvYmplY3RfY29sbGVjaXRvbiIsInJlZmVyZW5jZV9maWVsZHMiLCJyZWFkeSIsIlN0cmluZyIsIk1hdGNoIiwiT3B0aW9uYWwiLCJnZXRPYmplY3ROYW1lIiwidW5ibG9jayIsImZpZWxkX2tleXMiLCJjaGlsZHJlbiIsIl9vYmplY3RLZXlzIiwicmVmZXJlbmNlX2ZpZWxkIiwicGFyZW50IiwiY2hpbGRyZW5fZmllbGRzIiwicF9rIiwicmVmZXJlbmNlX2lkcyIsInJlZmVyZW5jZV90b19vYmplY3QiLCJzX2siLCJnZXRQcm9wZXJ0eSIsInJlZHVjZSIsImlzT2JqZWN0Iiwic2hhcmVkIiwidXNlciIsInNwYWNlX3NldHRpbmdzIiwicGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwiLCJnZXRGbG93UGVybWlzc2lvbnMiLCJmbG93X2lkIiwidXNlcl9pZCIsImZsb3ciLCJteV9wZXJtaXNzaW9ucyIsIm9yZ19pZHMiLCJvcmdhbml6YXRpb25zIiwib3Jnc19jYW5fYWRkIiwib3Jnc19jYW5fYWRtaW4iLCJvcmdzX2Nhbl9tb25pdG9yIiwidXNlcnNfY2FuX2FkZCIsInVzZXJzX2Nhbl9hZG1pbiIsInVzZXJzX2Nhbl9tb25pdG9yIiwidXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbCIsImdldEZsb3ciLCJwYXJlbnRzIiwib3JnIiwicGFyZW50X2lkIiwicGVybXMiLCJvcmdfaWQiLCJfZXZhbCIsIm9iamVjdHFsIiwiY2hlY2tfYXV0aG9yaXphdGlvbiIsInJlcSIsImF1dGhUb2tlbiIsImhhc2hlZFRva2VuIiwiQWNjb3VudHMiLCJfaGFzaExvZ2luVG9rZW4iLCJnZXRTcGFjZSIsImZsb3dzIiwiZ2V0U3BhY2VVc2VyIiwic3BhY2VfdXNlciIsImdldFNwYWNlVXNlck9yZ0luZm8iLCJvcmdhbml6YXRpb24iLCJmdWxsbmFtZSIsIm9yZ2FuaXphdGlvbl9uYW1lIiwib3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwiaXNGbG93RW5hYmxlZCIsInN0YXRlIiwiaXNGbG93U3BhY2VNYXRjaGVkIiwiZ2V0Rm9ybSIsImZvcm1faWQiLCJmb3JtIiwiZm9ybXMiLCJnZXRDYXRlZ29yeSIsImNhdGVnb3J5X2lkIiwiY2F0ZWdvcmllcyIsImNyZWF0ZV9pbnN0YW5jZSIsImluc3RhbmNlX2Zyb21fY2xpZW50IiwidXNlcl9pbmZvIiwiYXBwcl9vYmoiLCJhcHByb3ZlX2Zyb21fY2xpZW50IiwiY2F0ZWdvcnkiLCJpbnNfb2JqIiwibmV3X2luc19pZCIsInJlbGF0ZWRUYWJsZXNJbmZvIiwic3BhY2VfdXNlcl9vcmdfaW5mbyIsInN0YXJ0X3N0ZXAiLCJ0cmFjZV9mcm9tX2NsaWVudCIsInRyYWNlX29iaiIsImNoZWNrSXNJbkFwcHJvdmFsIiwicGVybWlzc2lvbk1hbmFnZXIiLCJpbnN0YW5jZXMiLCJmbG93X3ZlcnNpb24iLCJjdXJyZW50IiwiZm9ybV92ZXJzaW9uIiwic3VibWl0dGVyIiwic3VibWl0dGVyX25hbWUiLCJhcHBsaWNhbnQiLCJhcHBsaWNhbnRfbmFtZSIsImFwcGxpY2FudF9vcmdhbml6YXRpb24iLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUiLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwiYXBwbGljYW50X2NvbXBhbnkiLCJjb21wYW55X2lkIiwiY29kZSIsImlzX2FyY2hpdmVkIiwiaXNfZGVsZXRlZCIsInJlY29yZF9pZHMiLCJNb25nbyIsIk9iamVjdElEIiwiX3N0ciIsImlzX2ZpbmlzaGVkIiwic3RlcHMiLCJzdGVwIiwic3RlcF90eXBlIiwic3RhcnRfZGF0ZSIsInRyYWNlIiwidXNlcl9uYW1lIiwiaGFuZGxlciIsImhhbmRsZXJfbmFtZSIsImhhbmRsZXJfb3JnYW5pemF0aW9uIiwiaGFuZGxlcl9vcmdhbml6YXRpb25fbmFtZSIsImhhbmRsZXJfb3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwicmVhZF9kYXRlIiwiaXNfcmVhZCIsImlzX2Vycm9yIiwiZGVzY3JpcHRpb24iLCJpbml0aWF0ZVZhbHVlcyIsImFwcHJvdmVzIiwidHJhY2VzIiwiaW5ib3hfdXNlcnMiLCJjdXJyZW50X3N0ZXBfbmFtZSIsImF1dG9fcmVtaW5kIiwiZmxvd19uYW1lIiwiY2F0ZWdvcnlfbmFtZSIsImluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvIiwiaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvIiwiaW5pdGlhdGVBdHRhY2giLCJyZWNvcmRJZHMiLCJmbG93SWQiLCJmaWVsZENvZGVzIiwiZmlsdGVyVmFsdWVzIiwiZm9ybUZpZWxkcyIsImZvcm1UYWJsZUZpZWxkcyIsImZvcm1UYWJsZUZpZWxkc0NvZGUiLCJnZXRGaWVsZE9kYXRhVmFsdWUiLCJnZXRGb3JtRmllbGQiLCJnZXRGb3JtVGFibGVGaWVsZCIsImdldEZvcm1UYWJsZUZpZWxkQ29kZSIsImdldEZvcm1UYWJsZVN1YkZpZWxkIiwiZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSIsImdldFNlbGVjdE9yZ1ZhbHVlIiwiZ2V0U2VsZWN0T3JnVmFsdWVzIiwiZ2V0U2VsZWN0VXNlclZhbHVlIiwiZ2V0U2VsZWN0VXNlclZhbHVlcyIsIm9iamVjdE5hbWUiLCJvdyIsInJlY29yZElkIiwicmVsYXRlZE9iamVjdHNLZXlzIiwidGFibGVGaWVsZENvZGVzIiwidGFibGVGaWVsZE1hcCIsInRhYmxlVG9SZWxhdGVkTWFwIiwiZmYiLCJvYmplY3Rfd29ya2Zsb3dzIiwiZm9ybUZpZWxkIiwicmVsYXRlZE9iamVjdHNLZXkiLCJzdGFydHNXaXRoIiwiZm9ybVRhYmxlRmllbGRDb2RlIiwic2YiLCJ0YWJsZUZpZWxkIiwic3ViRmllbGRDb2RlIiwiX3JlY29yZCIsIm5hbWVLZXkiLCJzdSIsInVzZXJJZHMiLCJzdXMiLCJvcmdJZCIsIm9yZ0lkcyIsIm9yZ3MiLCJmaWVsZF9tYXAiLCJmbSIsImZpZWxkc09iaiIsImxvb2t1cEZpZWxkTmFtZSIsImxvb2t1cEZpZWxkT2JqIiwibG9va3VwT2JqZWN0UmVjb3JkIiwib1RhYmxlQ29kZSIsIm9UYWJsZUZpZWxkQ29kZSIsIm9iakZpZWxkIiwib2JqZWN0RmllbGROYW1lIiwib2JqZWN0RmllbGRPYmplY3ROYW1lIiwib2JqZWN0TG9va3VwRmllbGQiLCJvYmplY3RfZmllbGQiLCJvZGF0YUZpZWxkVmFsdWUiLCJyZWZlcmVuY2VUb0ZpZWxkVmFsdWUiLCJyZWZlcmVuY2VUb09iamVjdE5hbWUiLCJyZWxhdGVkT2JqZWN0RmllbGRDb2RlIiwic2VsZWN0RmllbGRWYWx1ZSIsInRhYmxlVG9SZWxhdGVkTWFwS2V5Iiwid1RhYmxlQ29kZSIsIndvcmtmbG93X2ZpZWxkIiwiaGFzT3duUHJvcGVydHkiLCJ3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlIiwib2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGUiLCJtdWx0aXBsZSIsImlzX211bHRpc2VsZWN0IiwidGZjIiwiYyIsInBhcnNlIiwidHIiLCJuZXdUciIsInRmbSIsIndUZENvZGUiLCJmb3JtVGFibGVGaWVsZCIsInJlbGF0ZWRGaWVsZCIsInJlbGF0ZWRGaWVsZE5hbWUiLCJyZWxhdGVkT2JqZWN0TmFtZSIsInJlbGF0ZWRSZWNvcmRzIiwicmVsYXRlZFRhYmxlSXRlbXMiLCJ0YWJsZUNvZGUiLCJ0YWJsZVZhbHVlcyIsIl9GUk9NX1RBQkxFX0NPREUiLCJ3YXJuIiwicnIiLCJ0YWJsZVZhbHVlSXRlbSIsInZhbHVlS2V5IiwiZmllbGRLZXkiLCJmb3JtRmllbGRLZXkiLCJyZWxhdGVkT2JqZWN0RmllbGQiLCJ0YWJsZUZpZWxkVmFsdWUiLCJfdGFibGUiLCJfY29kZSIsImZpZWxkX21hcF9zY3JpcHQiLCJleHRlbmQiLCJldmFsRmllbGRNYXBTY3JpcHQiLCJvYmplY3RJZCIsImZ1bmMiLCJzY3JpcHQiLCJpbnNJZCIsImFwcHJvdmVJZCIsImNmIiwidmVyc2lvbnMiLCJ2ZXJzaW9uSWQiLCJpZHgiLCJuZXdGaWxlIiwiRlMiLCJGaWxlIiwiYXR0YWNoRGF0YSIsImNyZWF0ZVJlYWRTdHJlYW0iLCJvcmlnaW5hbCIsIm1ldGFkYXRhIiwicmVhc29uIiwic2l6ZSIsIm93bmVyX25hbWUiLCJhcHByb3ZlIiwiJHB1c2giLCIkZWFjaCIsIiRwb3NpdGlvbiIsImxvY2tlZCIsImluc3RhbmNlX3N0YXRlIiwidGFibGVJdGVtcyIsIiRleGlzdHMiLCJnZXRRdWVyeVN0cmluZyIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXMiLCJuZXh0IiwicGFyc2VGaWxlcyIsImZpbGVDb2xsZWN0aW9uIiwiZmlsZXMiLCJtaW1lVHlwZSIsImJvZHkiLCJleHRlbnRpb24iLCJmaWxlT2JqIiwiZmlsZW5hbWUiLCJuZXdGaWxlT2JqSWQiLCJyZXNwIiwidG9Mb3dlckNhc2UiLCJkZWNvZGVVUklDb21wb25lbnQiLCJ2ZXJzaW9uX2lkIiwic2V0SGVhZGVyIiwiZW5kIiwic3RhdHVzQ29kZSIsImNvbGxlY3Rpb25OYW1lIiwiZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiIsInBhcmFtcyIsInJlc3VsdERhdGEiLCJzZW5kUmVzdWx0Iiwic3RhY2siLCJlcnJvcnMiLCJtZXNzYWdlIiwiYWNjZXNzS2V5SWQiLCJzZWNyZXRBY2Nlc3NLZXkiLCJtZXRob2QiLCJBTFkiLCJjYW5vbmljYWxpemVkUXVlcnlTdHJpbmciLCJxdWVyeUtleXMiLCJxdWVyeVN0ciIsInN0cmluZ1RvU2lnbiIsInV0aWwiLCJGb3JtYXQiLCJWZXJzaW9uIiwiQWNjZXNzS2V5SWQiLCJTaWduYXR1cmVNZXRob2QiLCJUaW1lc3RhbXAiLCJpc284NjAxIiwiU2lnbmF0dXJlVmVyc2lvbiIsIlNpZ25hdHVyZU5vbmNlIiwiZ2V0VGltZSIsInBvcEVzY2FwZSIsInRvVXBwZXJDYXNlIiwic3Vic3RyIiwiU2lnbmF0dXJlIiwiY3J5cHRvIiwiaG1hYyIsInF1ZXJ5UGFyYW1zVG9TdHJpbmciLCJvc3MiLCJyIiwicmVmMyIsInVwbG9hZEFkZHJlc3MiLCJ1cGxvYWRBdXRoIiwidmlkZW9JZCIsIkFjdGlvbiIsIlRpdGxlIiwiRmlsZU5hbWUiLCJIVFRQIiwiY2FsbCIsIlZpZGVvSWQiLCJVcGxvYWRBZGRyZXNzIiwidG9TdHJpbmciLCJVcGxvYWRBdXRoIiwiT1NTIiwiQWNjZXNzS2V5U2VjcmV0IiwiRW5kcG9pbnQiLCJTZWN1cml0eVRva2VuIiwicHV0T2JqZWN0IiwiQnVja2V0IiwiS2V5IiwiQm9keSIsIkFjY2Vzc0NvbnRyb2xBbGxvd09yaWdpbiIsIkNvbnRlbnRUeXBlIiwiQ2FjaGVDb250cm9sIiwiQ29udGVudERpc3Bvc2l0aW9uIiwiQ29udGVudEVuY29kaW5nIiwiU2VydmVyU2lkZUVuY3J5cHRpb24iLCJFeHBpcmVzIiwiYmluZEVudmlyb25tZW50IiwiZ2V0UGxheUluZm9RdWVyeSIsImdldFBsYXlJbmZvUmVzdWx0IiwiZ2V0UGxheUluZm9VcmwiLCJuZXdEYXRlIiwiY3VycmVudF91c2VyX2lkIiwiY3VycmVudF91c2VyX2luZm8iLCJoYXNoRGF0YSIsImluc2VydGVkX2luc3RhbmNlcyIsIm5ld19pbnMiLCJpbnNlcnRzIiwiZXJyb3JNZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBR3JCSCxnQkFBZ0IsQ0FBQztBQUNoQkksUUFBTSxFQUFFLFNBRFE7QUFFaEJDLFFBQU0sRUFBRSxRQUZRO0FBR2hCLFlBQVUsU0FITTtBQUloQixlQUFhO0FBSkcsQ0FBRCxFQUtiLGlCQUxhLENBQWhCOztBQU9BLElBQUlDLE1BQU0sQ0FBQ0MsUUFBUCxJQUFtQkQsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxHQUFuQyxJQUEwQ0YsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxHQUFoQixDQUFvQkMsTUFBbEUsRUFBMEU7QUFDekVULGtCQUFnQixDQUFDO0FBQ2hCLGtCQUFjO0FBREUsR0FBRCxFQUViLGlCQUZhLENBQWhCO0FBR0EsQzs7Ozs7Ozs7Ozs7O0FDQ0RVLFFBQVFDLFNBQVIsR0FBb0IsVUFBQ0MsV0FBRDtBQUNuQixNQUFBQyxHQUFBO0FBQUEsVUFBQUEsTUFBQUgsUUFBQUksU0FBQSxDQUFBRixXQUFBLGFBQUFDLElBQXVDRSxNQUF2QyxHQUF1QyxNQUF2QztBQURtQixDQUFwQjs7QUFHQUwsUUFBUU0sc0JBQVIsR0FBaUMsVUFBQ0osV0FBRDtBQUNoQyxNQUFHTixP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QVNGO0FBQVg7QUFGb0IsS0FBM0IsQ0NPRTtBRHRCSCxXQUFBdG5CLEtBQUE7QUFtQk1mLFFBQUFlLEtBQUE7QUFDTEMsWUFBUUQsS0FBUixDQUFjZixFQUFFbWtCLEtBQWhCO0FDV0UsV0RWRnpCLFdBQVd3QixVQUFYLENBQXNCdEIsR0FBdEIsRUFBMkI7QUFDMUJoSyxZQUFNLEdBRG9CO0FBRTFCcE8sWUFBTTtBQUFFNFosZ0JBQVEsQ0FBQztBQUFFb0Usd0JBQWN4b0IsRUFBRThoQixNQUFGLElBQVk5aEIsRUFBRXFrQjtBQUE5QixTQUFEO0FBQVY7QUFGb0IsS0FBM0IsQ0NVRTtBQVVEO0FEMUNILEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcblx0Y2hlY2tOcG1WZXJzaW9uc1xyXG59IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5jaGVja05wbVZlcnNpb25zKHtcclxuXHRidXNib3k6IFwiXjAuMi4xM1wiLFxyXG5cdG1rZGlycDogXCJeMC4zLjVcIixcclxuXHRcInhtbDJqc1wiOiBcIl4wLjQuMTlcIixcclxuXHRcIm5vZGUteGxzeFwiOiBcIl4wLjEyLjBcIlxyXG59LCAnc3RlZWRvczpjcmVhdG9yJyk7XHJcblxyXG5pZiAoTWV0ZW9yLnNldHRpbmdzICYmIE1ldGVvci5zZXR0aW5ncy5jZnMgJiYgTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4pIHtcclxuXHRjaGVja05wbVZlcnNpb25zKHtcclxuXHRcdFwiYWxpeXVuLXNka1wiOiBcIl4xLjExLjEyXCJcclxuXHR9LCAnc3RlZWRvczpjcmVhdG9yJyk7XHJcbn0iLCJcclxuXHQjIENyZWF0b3IuaW5pdEFwcHMoKVxyXG5cclxuXHJcbiMgQ3JlYXRvci5pbml0QXBwcyA9ICgpLT5cclxuIyBcdGlmIE1ldGVvci5pc1NlcnZlclxyXG4jIFx0XHRfLmVhY2ggQ3JlYXRvci5BcHBzLCAoYXBwLCBhcHBfaWQpLT5cclxuIyBcdFx0XHRkYl9hcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKVxyXG4jIFx0XHRcdGlmICFkYl9hcHBcclxuIyBcdFx0XHRcdGFwcC5faWQgPSBhcHBfaWRcclxuIyBcdFx0XHRcdGRiLmFwcHMuaW5zZXJ0KGFwcClcclxuIyBlbHNlXHJcbiMgXHRhcHAuX2lkID0gYXBwX2lkXHJcbiMgXHRkYi5hcHBzLnVwZGF0ZSh7X2lkOiBhcHBfaWR9LCBhcHApXHJcblxyXG5DcmVhdG9yLmdldFNjaGVtYSA9IChvYmplY3RfbmFtZSktPlxyXG5cdHJldHVybiBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk/LnNjaGVtYVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RIb21lQ29tcG9uZW50ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRyZXR1cm4gUmVhY3RTdGVlZG9zLnBsdWdpbkNvbXBvbmVudFNlbGVjdG9yKFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLCBcIk9iamVjdEhvbWVcIiwgb2JqZWN0X25hbWUpXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdFVybCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIC0+XHJcblx0aWYgIWFwcF9pZFxyXG5cdFx0YXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcclxuXHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cclxuXHRsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKVxyXG5cdGxpc3Rfdmlld19pZCA9IGxpc3Rfdmlldz8uX2lkXHJcblxyXG5cdGlmIHJlY29yZF9pZFxyXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQpXHJcblx0ZWxzZVxyXG5cdFx0aWYgb2JqZWN0X25hbWUgaXMgXCJtZWV0aW5nXCJcclxuXHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRpZiBDcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQob2JqZWN0X25hbWUpXHJcblx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSlcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RBYnNvbHV0ZVVybCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIC0+XHJcblx0aWYgIWFwcF9pZFxyXG5cdFx0YXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcclxuXHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cclxuXHRsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKVxyXG5cdGxpc3Rfdmlld19pZCA9IGxpc3Rfdmlldz8uX2lkXHJcblxyXG5cdGlmIHJlY29yZF9pZFxyXG5cdFx0cmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQsIHRydWUpXHJcblx0ZWxzZVxyXG5cdFx0aWYgb2JqZWN0X25hbWUgaXMgXCJtZWV0aW5nXCJcclxuXHRcdFx0cmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiLCB0cnVlKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCwgdHJ1ZSlcclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0Um91dGVyVXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cclxuXHRpZiAhYXBwX2lkXHJcblx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXHJcblx0bGlzdF92aWV3X2lkID0gbGlzdF92aWV3Py5faWRcclxuXHJcblx0aWYgcmVjb3JkX2lkXHJcblx0XHRyZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWRcclxuXHRlbHNlXHJcblx0XHRpZiBvYmplY3RfbmFtZSBpcyBcIm1lZXRpbmdcIlxyXG5cdFx0XHRyZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZFxyXG5cclxuQ3JlYXRvci5nZXRMaXN0Vmlld1VybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIC0+XHJcblx0dXJsID0gQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZClcclxuXHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCh1cmwpXHJcblxyXG5DcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwgPSAob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSAtPlxyXG5cdGlmIGxpc3Rfdmlld19pZCBpcyBcImNhbGVuZGFyXCJcclxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCJcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWRcclxuXHJcbkNyZWF0b3IuZ2V0U3dpdGNoTGlzdFVybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIC0+XHJcblx0aWYgbGlzdF92aWV3X2lkXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi9saXN0XCIpXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2xpc3Qvc3dpdGNoXCIpXHJcblxyXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RVcmwgPSAob2JqZWN0X25hbWUsIGFwcF9pZCwgcmVjb3JkX2lkLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUpIC0+XHJcblx0aWYgcmVsYXRlZF9maWVsZF9uYW1lXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyByZWNvcmRfaWQgKyBcIi9cIiArIHJlbGF0ZWRfb2JqZWN0X25hbWUgKyBcIi9ncmlkP3JlbGF0ZWRfZmllbGRfbmFtZT1cIiArIHJlbGF0ZWRfZmllbGRfbmFtZSlcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyByZWNvcmRfaWQgKyBcIi9cIiArIHJlbGF0ZWRfb2JqZWN0X25hbWUgKyBcIi9ncmlkXCIpXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyA9IChvYmplY3RfbmFtZSwgaXNfZGVlcCwgaXNfc2tpcF9oaWRlLCBpc19yZWxhdGVkKS0+XHJcblx0X29wdGlvbnMgPSBbXVxyXG5cdHVubGVzcyBvYmplY3RfbmFtZVxyXG5cdFx0cmV0dXJuIF9vcHRpb25zXHJcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xyXG5cdGljb24gPSBfb2JqZWN0Py5pY29uXHJcblx0Xy5mb3JFYWNoIGZpZWxkcywgKGYsIGspLT5cclxuXHRcdGlmIGlzX3NraXBfaGlkZSBhbmQgZi5oaWRkZW5cclxuXHRcdFx0cmV0dXJuXHJcblx0XHRpZiBmLnR5cGUgPT0gXCJzZWxlY3RcIlxyXG5cdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogXCIje2YubGFiZWwgfHwga31cIiwgdmFsdWU6IFwiI3trfVwiLCBpY29uOiBpY29ufVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogZi5sYWJlbCB8fCBrLCB2YWx1ZTogaywgaWNvbjogaWNvbn1cclxuXHRpZiBpc19kZWVwXHJcblx0XHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxyXG5cdFx0XHRpZiBpc19za2lwX2hpZGUgYW5kIGYuaGlkZGVuXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdGlmIChmLnR5cGUgPT0gXCJsb29rdXBcIiB8fCBmLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpICYmIGYucmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcoZi5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0IyDkuI3mlK/mjIFmLnJlZmVyZW5jZV90b+S4umZ1bmN0aW9u55qE5oOF5Ya177yM5pyJ6ZyA5rGC5YaN6K+0XHJcblx0XHRcdFx0cl9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChmLnJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRpZiByX29iamVjdFxyXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJfb2JqZWN0LmZpZWxkcywgKGYyLCBrMiktPlxyXG5cdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogXCIje2YubGFiZWwgfHwga309PiN7ZjIubGFiZWwgfHwgazJ9XCIsIHZhbHVlOiBcIiN7a30uI3trMn1cIiwgaWNvbjogcl9vYmplY3Q/Lmljb259XHJcblx0aWYgaXNfcmVsYXRlZFxyXG5cdFx0cmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKVxyXG5cdFx0Xy5lYWNoIHJlbGF0ZWRPYmplY3RzLCAoX3JlbGF0ZWRPYmplY3QpPT5cclxuXHRcdFx0cmVsYXRlZE9wdGlvbnMgPSBDcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyhfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSlcclxuXHRcdFx0cmVsYXRlZE9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9yZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lKVxyXG5cdFx0XHRfLmVhY2ggcmVsYXRlZE9wdGlvbnMsIChyZWxhdGVkT3B0aW9uKS0+XHJcblx0XHRcdFx0aWYgX3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXkgIT0gcmVsYXRlZE9wdGlvbi52YWx1ZVxyXG5cdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IFwiI3tyZWxhdGVkT2JqZWN0LmxhYmVsIHx8IHJlbGF0ZWRPYmplY3QubmFtZX09PiN7cmVsYXRlZE9wdGlvbi5sYWJlbH1cIiwgdmFsdWU6IFwiI3tyZWxhdGVkT2JqZWN0Lm5hbWV9LiN7cmVsYXRlZE9wdGlvbi52YWx1ZX1cIiwgaWNvbjogcmVsYXRlZE9iamVjdD8uaWNvbn1cclxuXHRyZXR1cm4gX29wdGlvbnNcclxuXHJcbiMg57uf5LiA5Li65a+56LGhb2JqZWN0X25hbWXmj5Dkvpvlj6/nlKjkuo7ov4fomZHlmajov4fomZHlrZfmrrVcclxuQ3JlYXRvci5nZXRPYmplY3RGaWx0ZXJGaWVsZE9wdGlvbnMgPSAob2JqZWN0X25hbWUpLT5cclxuXHRfb3B0aW9ucyA9IFtdXHJcblx0dW5sZXNzIG9iamVjdF9uYW1lXHJcblx0XHRyZXR1cm4gX29wdGlvbnNcclxuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0ZmllbGRzID0gX29iamVjdD8uZmllbGRzXHJcblx0cGVybWlzc2lvbl9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhvYmplY3RfbmFtZSlcclxuXHRpY29uID0gX29iamVjdD8uaWNvblxyXG5cdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XHJcblx0XHQjIGhpZGRlbixncmlk562J57G75Z6L55qE5a2X5q6177yM5LiN6ZyA6KaB6L+H5rukXHJcblx0XHRpZiAhXy5pbmNsdWRlKFtcImdyaWRcIixcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJhdmF0YXJcIiwgXCJpbWFnZVwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKSBhbmQgIWYuaGlkZGVuXHJcblx0XHRcdCMgZmlsdGVycy4kLmZpZWxk5Y+KZmxvdy5jdXJyZW50562J5a2Q5a2X5q615Lmf5LiN6ZyA6KaB6L+H5rukXHJcblx0XHRcdGlmICEvXFx3K1xcLi8udGVzdChrKSBhbmQgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xXHJcblx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XHJcblxyXG5cdHJldHVybiBfb3B0aW9uc1xyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZE9wdGlvbnMgPSAob2JqZWN0X25hbWUpLT5cclxuXHRfb3B0aW9ucyA9IFtdXHJcblx0dW5sZXNzIG9iamVjdF9uYW1lXHJcblx0XHRyZXR1cm4gX29wdGlvbnNcclxuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0ZmllbGRzID0gX29iamVjdD8uZmllbGRzXHJcblx0cGVybWlzc2lvbl9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhvYmplY3RfbmFtZSlcclxuXHRpY29uID0gX29iamVjdD8uaWNvblxyXG5cdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XHJcblx0XHRpZiAhXy5pbmNsdWRlKFtcImdyaWRcIixcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSlcclxuXHRcdFx0aWYgIS9cXHcrXFwuLy50ZXN0KGspIGFuZCBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTFcclxuXHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogZi5sYWJlbCB8fCBrLCB2YWx1ZTogaywgaWNvbjogaWNvbn1cclxuXHRyZXR1cm4gX29wdGlvbnNcclxuXHJcbiMjI1xyXG5maWx0ZXJzOiDopoHovazmjaLnmoRmaWx0ZXJzXHJcbmZpZWxkczog5a+56LGh5a2X5q61XHJcbmZpbHRlcl9maWVsZHM6IOm7mOiupOi/h+a7pOWtl+aute+8jOaUr+aMgeWtl+espuS4suaVsOe7hOWSjOWvueixoeaVsOe7hOS4pOenjeagvOW8j++8jOWmgjpbJ2ZpbGVkX25hbWUxJywnZmlsZWRfbmFtZTInXSxbe2ZpZWxkOidmaWxlZF9uYW1lMScscmVxdWlyZWQ6dHJ1ZX1dXHJcbuWkhOeQhumAu+i+kTog5oqKZmlsdGVyc+S4reWtmOWcqOS6jmZpbHRlcl9maWVsZHPnmoTov4fmu6TmnaHku7blop7liqDmr4/pobnnmoRpc19kZWZhdWx044CBaXNfcmVxdWlyZWTlsZ7mgKfvvIzkuI3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25a+55bqU55qE56e76Zmk5q+P6aG555qE55u45YWz5bGe5oCnXHJcbui/lOWbnue7k+aenDog5aSE55CG5ZCO55qEZmlsdGVyc1xyXG4jIyNcclxuQ3JlYXRvci5nZXRGaWx0ZXJzV2l0aEZpbHRlckZpZWxkcyA9IChmaWx0ZXJzLCBmaWVsZHMsIGZpbHRlcl9maWVsZHMpLT5cclxuXHR1bmxlc3MgZmlsdGVyc1xyXG5cdFx0ZmlsdGVycyA9IFtdXHJcblx0dW5sZXNzIGZpbHRlcl9maWVsZHNcclxuXHRcdGZpbHRlcl9maWVsZHMgPSBbXVxyXG5cdGlmIGZpbHRlcl9maWVsZHM/Lmxlbmd0aFxyXG5cdFx0ZmlsdGVyX2ZpZWxkcy5mb3JFYWNoIChuKS0+XHJcblx0XHRcdGlmIF8uaXNTdHJpbmcobilcclxuXHRcdFx0XHRuID0gXHJcblx0XHRcdFx0XHRmaWVsZDogbixcclxuXHRcdFx0XHRcdHJlcXVpcmVkOiBmYWxzZVxyXG5cdFx0XHRpZiBmaWVsZHNbbi5maWVsZF0gYW5kICFfLmZpbmRXaGVyZShmaWx0ZXJzLHtmaWVsZDpuLmZpZWxkfSlcclxuXHRcdFx0XHRmaWx0ZXJzLnB1c2hcclxuXHRcdFx0XHRcdGZpZWxkOiBuLmZpZWxkLFxyXG5cdFx0XHRcdFx0aXNfZGVmYXVsdDogdHJ1ZSxcclxuXHRcdFx0XHRcdGlzX3JlcXVpcmVkOiBuLnJlcXVpcmVkXHJcblx0ZmlsdGVycy5mb3JFYWNoIChmaWx0ZXJJdGVtKS0+XHJcblx0XHRtYXRjaEZpZWxkID0gZmlsdGVyX2ZpZWxkcy5maW5kIChuKS0+IHJldHVybiBuID09IGZpbHRlckl0ZW0uZmllbGQgb3Igbi5maWVsZCA9PSBmaWx0ZXJJdGVtLmZpZWxkXHJcblx0XHRpZiBfLmlzU3RyaW5nKG1hdGNoRmllbGQpXHJcblx0XHRcdG1hdGNoRmllbGQgPSBcclxuXHRcdFx0XHRmaWVsZDogbWF0Y2hGaWVsZCxcclxuXHRcdFx0XHRyZXF1aXJlZDogZmFsc2VcclxuXHRcdGlmIG1hdGNoRmllbGRcclxuXHRcdFx0ZmlsdGVySXRlbS5pc19kZWZhdWx0ID0gdHJ1ZVxyXG5cdFx0XHRmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkID0gbWF0Y2hGaWVsZC5yZXF1aXJlZFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRkZWxldGUgZmlsdGVySXRlbS5pc19kZWZhdWx0XHJcblx0XHRcdGRlbGV0ZSBmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkXHJcblx0cmV0dXJuIGZpbHRlcnNcclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZCktPlxyXG5cclxuXHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cclxuXHRpZiAhcmVjb3JkX2lkXHJcblx0XHRyZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKVxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgb2JqZWN0X25hbWUgPT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSAmJiAgcmVjb3JkX2lkID09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpXHJcblx0XHRcdGlmIFRlbXBsYXRlLmluc3RhbmNlKCk/LnJlY29yZFxyXG5cdFx0XHRcdHJldHVybiBUZW1wbGF0ZS5pbnN0YW5jZSgpPy5yZWNvcmQ/LmdldCgpXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpXHJcblxyXG5cdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpXHJcblx0aWYgY29sbGVjdGlvblxyXG5cdFx0cmVjb3JkID0gY29sbGVjdGlvbi5maW5kT25lKHJlY29yZF9pZClcclxuXHRcdHJldHVybiByZWNvcmRcclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkTmFtZSA9IChyZWNvcmQsIG9iamVjdF9uYW1lKS0+XHJcblx0dW5sZXNzIHJlY29yZFxyXG5cdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQoKVxyXG5cdGlmIHJlY29yZFxyXG5cdFx0IyDmmL7npLrnu4Tnu4fliJfooajml7bvvIznibnmrorlpITnkIZuYW1lX2ZpZWxkX2tleeS4um5hbWXlrZfmrrVcclxuXHRcdG5hbWVfZmllbGRfa2V5ID0gaWYgb2JqZWN0X25hbWUgPT0gXCJvcmdhbml6YXRpb25zXCIgdGhlbiBcIm5hbWVcIiBlbHNlIENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKT8uTkFNRV9GSUVMRF9LRVlcclxuXHRcdGlmIHJlY29yZCBhbmQgbmFtZV9maWVsZF9rZXlcclxuXHRcdFx0cmV0dXJuIHJlY29yZC5sYWJlbCB8fCByZWNvcmRbbmFtZV9maWVsZF9rZXldXHJcblxyXG5DcmVhdG9yLmdldEFwcCA9IChhcHBfaWQpLT5cclxuXHRpZiAhYXBwX2lkXHJcblx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxyXG5cdGFwcCA9IENyZWF0b3IuQXBwc1thcHBfaWRdXHJcblx0Q3JlYXRvci5kZXBzPy5hcHA/LmRlcGVuZCgpXHJcblx0cmV0dXJuIGFwcFxyXG5cclxuQ3JlYXRvci5nZXRBcHBEYXNoYm9hcmQgPSAoYXBwX2lkKS0+XHJcblx0YXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKVxyXG5cdGlmICFhcHBcclxuXHRcdHJldHVyblxyXG5cdGRhc2hib2FyZCA9IG51bGxcclxuXHRfLmVhY2ggQ3JlYXRvci5EYXNoYm9hcmRzLCAodiwgayktPlxyXG5cdFx0aWYgdi5hcHBzPy5pbmRleE9mKGFwcC5faWQpID4gLTFcclxuXHRcdFx0ZGFzaGJvYXJkID0gdjtcclxuXHRyZXR1cm4gZGFzaGJvYXJkO1xyXG5cclxuQ3JlYXRvci5nZXRBcHBEYXNoYm9hcmRDb21wb25lbnQgPSAoYXBwX2lkKS0+XHJcblx0YXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKVxyXG5cdGlmICFhcHBcclxuXHRcdHJldHVyblxyXG5cdHJldHVybiBSZWFjdFN0ZWVkb3MucGx1Z2luQ29tcG9uZW50U2VsZWN0b3IoUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCksIFwiRGFzaGJvYXJkXCIsIGFwcC5faWQpO1xyXG5cclxuQ3JlYXRvci5nZXRBcHBPYmplY3ROYW1lcyA9IChhcHBfaWQpLT5cclxuXHRhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpXHJcblx0aWYgIWFwcFxyXG5cdFx0cmV0dXJuXHJcblx0aXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHRhcHBPYmplY3RzID0gaWYgaXNNb2JpbGUgdGhlbiBhcHAubW9iaWxlX29iamVjdHMgZWxzZSBhcHAub2JqZWN0c1xyXG5cdG9iamVjdHMgPSBbXVxyXG5cdGlmIGFwcFxyXG5cdFx0Xy5lYWNoIGFwcE9iamVjdHMsICh2KS0+XHJcblx0XHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KHYpXHJcblx0XHRcdGlmIG9iaj8ucGVybWlzc2lvbnMuZ2V0KCkuYWxsb3dSZWFkXHJcblx0XHRcdFx0b2JqZWN0cy5wdXNoIHZcclxuXHRyZXR1cm4gb2JqZWN0c1xyXG5cclxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwcyA9IChpbmNsdWRlQWRtaW4pLT5cclxuXHRjaGFuZ2VBcHAgPSBDcmVhdG9yLl9zdWJBcHAuZ2V0KCk7XHJcblx0UmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCkuZW50aXRpZXMuYXBwcyA9IE9iamVjdC5hc3NpZ24oe30sIFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLmVudGl0aWVzLmFwcHMsIHthcHBzOiBjaGFuZ2VBcHB9KTtcclxuXHRyZXR1cm4gUmVhY3RTdGVlZG9zLnZpc2libGVBcHBzU2VsZWN0b3IoUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCksIGluY2x1ZGVBZG1pbilcclxuXHJcbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHNPYmplY3RzID0gKCktPlxyXG5cdGFwcHMgPSBDcmVhdG9yLmdldFZpc2libGVBcHBzKClcclxuXHR2aXNpYmxlT2JqZWN0TmFtZXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhhcHBzLCdvYmplY3RzJykpXHJcblx0b2JqZWN0cyA9IF8uZmlsdGVyIENyZWF0b3IuT2JqZWN0cywgKG9iaiktPlxyXG5cdFx0aWYgdmlzaWJsZU9iamVjdE5hbWVzLmluZGV4T2Yob2JqLm5hbWUpIDwgMFxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHRydWVcclxuXHRvYmplY3RzID0gb2JqZWN0cy5zb3J0KENyZWF0b3Iuc29ydGluZ01ldGhvZC5iaW5kKHtrZXk6XCJsYWJlbFwifSkpXHJcblx0b2JqZWN0cyA9IF8ucGx1Y2sob2JqZWN0cywnbmFtZScpXHJcblx0cmV0dXJuIF8udW5pcSBvYmplY3RzXHJcblxyXG5DcmVhdG9yLmdldEFwcHNPYmplY3RzID0gKCktPlxyXG5cdG9iamVjdHMgPSBbXVxyXG5cdHRlbXBPYmplY3RzID0gW11cclxuXHRfLmZvckVhY2ggQ3JlYXRvci5BcHBzLCAoYXBwKS0+XHJcblx0XHR0ZW1wT2JqZWN0cyA9IF8uZmlsdGVyIGFwcC5vYmplY3RzLCAob2JqKS0+XHJcblx0XHRcdHJldHVybiAhb2JqLmhpZGRlblxyXG5cdFx0b2JqZWN0cyA9IG9iamVjdHMuY29uY2F0KHRlbXBPYmplY3RzKVxyXG5cdHJldHVybiBfLnVuaXEgb2JqZWN0c1xyXG5cclxuQ3JlYXRvci52YWxpZGF0ZUZpbHRlcnMgPSAoZmlsdGVycywgbG9naWMpLT5cclxuXHRmaWx0ZXJfaXRlbXMgPSBfLm1hcCBmaWx0ZXJzLCAob2JqKSAtPlxyXG5cdFx0aWYgXy5pc0VtcHR5KG9iailcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBvYmpcclxuXHRmaWx0ZXJfaXRlbXMgPSBfLmNvbXBhY3QoZmlsdGVyX2l0ZW1zKVxyXG5cdGVycm9yTXNnID0gXCJcIlxyXG5cdGZpbHRlcl9sZW5ndGggPSBmaWx0ZXJfaXRlbXMubGVuZ3RoXHJcblx0aWYgbG9naWNcclxuXHRcdCMg5qC85byP5YyWZmlsdGVyXHJcblx0XHRsb2dpYyA9IGxvZ2ljLnJlcGxhY2UoL1xcbi9nLCBcIlwiKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKVxyXG5cclxuXHRcdCMg5Yik5pat54m55q6K5a2X56ymXHJcblx0XHRpZiAvWy5fXFwtIStdKy9pZy50ZXN0KGxvZ2ljKVxyXG5cdFx0XHRlcnJvck1zZyA9IFwi5ZCr5pyJ54m55q6K5a2X56ym44CCXCJcclxuXHJcblx0XHRpZiAhZXJyb3JNc2dcclxuXHRcdFx0aW5kZXggPSBsb2dpYy5tYXRjaCgvXFxkKy9pZylcclxuXHRcdFx0aWYgIWluZGV4XHJcblx0XHRcdFx0ZXJyb3JNc2cgPSBcIuacieS6m+etm+mAieadoeS7tui/m+ihjOS6huWumuS5ie+8jOS9huacquWcqOmrmOe6p+etm+mAieadoeS7tuS4reiiq+W8leeUqOOAglwiXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpbmRleC5mb3JFYWNoIChpKS0+XHJcblx0XHRcdFx0XHRpZiBpIDwgMSBvciBpID4gZmlsdGVyX2xlbmd0aFxyXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5p2h5Lu25byV55So5LqG5pyq5a6a5LmJ55qE562b6YCJ5Zmo77yaI3tpfeOAglwiXHJcblxyXG5cdFx0XHRcdGZsYWcgPSAxXHJcblx0XHRcdFx0d2hpbGUgZmxhZyA8PSBmaWx0ZXJfbGVuZ3RoXHJcblx0XHRcdFx0XHRpZiAhaW5kZXguaW5jbHVkZXMoXCIje2ZsYWd9XCIpXHJcblx0XHRcdFx0XHRcdGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIlxyXG5cdFx0XHRcdFx0ZmxhZysrO1xyXG5cclxuXHRcdGlmICFlcnJvck1zZ1xyXG5cdFx0XHQjIOWIpOaWreaYr+WQpuaciemdnuazleiLseaWh+Wtl+esplxyXG5cdFx0XHR3b3JkID0gbG9naWMubWF0Y2goL1thLXpBLVpdKy9pZylcclxuXHRcdFx0aWYgd29yZFxyXG5cdFx0XHRcdHdvcmQuZm9yRWFjaCAodyktPlxyXG5cdFx0XHRcdFx0aWYgIS9eKGFuZHxvcikkL2lnLnRlc3QodylcclxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBcIuajgOafpeaCqOeahOmrmOe6p+etm+mAieadoeS7tuS4reeahOaLvOWGmeOAglwiXHJcblxyXG5cdFx0aWYgIWVycm9yTXNnXHJcblx0XHRcdCMg5Yik5pat5qC85byP5piv5ZCm5q2j56GuXHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdENyZWF0b3IuZXZhbChsb2dpYy5yZXBsYWNlKC9hbmQvaWcsIFwiJiZcIikucmVwbGFjZSgvb3IvaWcsIFwifHxcIikpXHJcblx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5Lit5ZCr5pyJ54m55q6K5a2X56ymXCJcclxuXHJcblx0XHRcdGlmIC8oQU5EKVteKCldKyhPUikvaWcudGVzdChsb2dpYykgfHwgIC8oT1IpW14oKV0rKEFORCkvaWcudGVzdChsb2dpYylcclxuXHRcdFx0XHRlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5b+F6aG75Zyo6L+e57ut5oCn55qEIEFORCDlkowgT1Ig6KGo6L6+5byP5YmN5ZCO5L2/55So5ous5Y+344CCXCJcclxuXHRpZiBlcnJvck1zZ1xyXG5cdFx0Y29uc29sZS5sb2cgXCJlcnJvclwiLCBlcnJvck1zZ1xyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdHRvYXN0ci5lcnJvcihlcnJvck1zZylcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdGVsc2VcclxuXHRcdHJldHVybiB0cnVlXHJcblxyXG4jIFwiPVwiLCBcIjw+XCIsIFwiPlwiLCBcIj49XCIsIFwiPFwiLCBcIjw9XCIsIFwic3RhcnRzd2l0aFwiLCBcImNvbnRhaW5zXCIsIFwibm90Y29udGFpbnNcIi5cclxuIyMjXHJcbm9wdGlvbnPlj4LmlbDvvJpcclxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcclxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcclxuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XHJcbmV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcclxuIyMjXHJcbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvTW9uZ28gPSAoZmlsdGVycywgb3B0aW9ucyktPlxyXG5cdHVubGVzcyBmaWx0ZXJzPy5sZW5ndGhcclxuXHRcdHJldHVyblxyXG5cdCMg5b2TZmlsdGVyc+S4jeaYr1tBcnJheV3nsbvlnovogIzmmK9bT2JqZWN0Xeexu+Wei+aXtu+8jOi/m+ihjOagvOW8j+i9rOaNolxyXG5cdHVubGVzcyBmaWx0ZXJzWzBdIGluc3RhbmNlb2YgQXJyYXlcclxuXHRcdGZpbHRlcnMgPSBfLm1hcCBmaWx0ZXJzLCAob2JqKS0+XHJcblx0XHRcdHJldHVybiBbb2JqLmZpZWxkLCBvYmoub3BlcmF0aW9uLCBvYmoudmFsdWVdXHJcblx0c2VsZWN0b3IgPSBbXVxyXG5cdF8uZWFjaCBmaWx0ZXJzLCAoZmlsdGVyKS0+XHJcblx0XHRmaWVsZCA9IGZpbHRlclswXVxyXG5cdFx0b3B0aW9uID0gZmlsdGVyWzFdXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0pXHJcblx0XHRlbHNlXHJcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBudWxsLCBvcHRpb25zKVxyXG5cdFx0c3ViX3NlbGVjdG9yID0ge31cclxuXHRcdHN1Yl9zZWxlY3RvcltmaWVsZF0gPSB7fVxyXG5cdFx0aWYgb3B0aW9uID09IFwiPVwiXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZXFcIl0gPSB2YWx1ZVxyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8PlwiXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbmVcIl0gPSB2YWx1ZVxyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI+XCJcclxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndFwiXSA9IHZhbHVlXHJcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIj49XCJcclxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndGVcIl0gPSB2YWx1ZVxyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8XCJcclxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdFwiXSA9IHZhbHVlXHJcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIjw9XCJcclxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdGVcIl0gPSB2YWx1ZVxyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCJzdGFydHN3aXRoXCJcclxuXHRcdFx0cmVnID0gbmV3IFJlZ0V4cChcIl5cIiArIHZhbHVlLCBcImlcIilcclxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZ1xyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCJjb250YWluc1wiXHJcblx0XHRcdHJlZyA9IG5ldyBSZWdFeHAodmFsdWUsIFwiaVwiKVxyXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnXHJcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIm5vdGNvbnRhaW5zXCJcclxuXHRcdFx0cmVnID0gbmV3IFJlZ0V4cChcIl4oKD8hXCIgKyB2YWx1ZSArIFwiKS4pKiRcIiwgXCJpXCIpXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWdcclxuXHRcdHNlbGVjdG9yLnB1c2ggc3ViX3NlbGVjdG9yXHJcblx0cmV0dXJuIHNlbGVjdG9yXHJcblxyXG5DcmVhdG9yLmlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiA9IChvcGVyYXRpb24pLT5cclxuXHRyZXR1cm4gb3BlcmF0aW9uID09IFwiYmV0d2VlblwiIG9yICEhQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXModHJ1ZSk/W29wZXJhdGlvbl1cclxuXHJcbiMjI1xyXG5vcHRpb25z5Y+C5pWw77yaXHJcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXHJcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XHJcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxyXG5cdGV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcclxuIyMjXHJcbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvRGV2ID0gKGZpbHRlcnMsIG9iamVjdF9uYW1lLCBvcHRpb25zKS0+XHJcblx0c3RlZWRvc0ZpbHRlcnMgPSByZXF1aXJlKFwiQHN0ZWVkb3MvZmlsdGVyc1wiKTtcclxuXHR1bmxlc3MgZmlsdGVycy5sZW5ndGhcclxuXHRcdHJldHVyblxyXG5cdGlmIG9wdGlvbnM/LmlzX2xvZ2ljX29yXHJcblx0XHQjIOWmguaenGlzX2xvZ2ljX29y5Li6dHJ1Ze+8jOS4umZpbHRlcnPnrKzkuIDlsYLlhYPntKDlop7liqBvcumXtOmalFxyXG5cdFx0bG9naWNUZW1wRmlsdGVycyA9IFtdXHJcblx0XHRmaWx0ZXJzLmZvckVhY2ggKG4pLT5cclxuXHRcdFx0bG9naWNUZW1wRmlsdGVycy5wdXNoKG4pXHJcblx0XHRcdGxvZ2ljVGVtcEZpbHRlcnMucHVzaChcIm9yXCIpXHJcblx0XHRsb2dpY1RlbXBGaWx0ZXJzLnBvcCgpXHJcblx0XHRmaWx0ZXJzID0gbG9naWNUZW1wRmlsdGVyc1xyXG5cdHNlbGVjdG9yID0gc3RlZWRvc0ZpbHRlcnMuZm9ybWF0RmlsdGVyc1RvRGV2KGZpbHRlcnMsIENyZWF0b3IuVVNFUl9DT05URVhUKVxyXG5cdHJldHVybiBzZWxlY3RvclxyXG5cclxuIyMjXHJcbm9wdGlvbnPlj4LmlbDvvJpcclxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcclxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcclxuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XHJcbmV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcclxuIyMjXHJcbkNyZWF0b3IuZm9ybWF0TG9naWNGaWx0ZXJzVG9EZXYgPSAoZmlsdGVycywgZmlsdGVyX2xvZ2ljLCBvcHRpb25zKS0+XHJcblx0Zm9ybWF0X2xvZ2ljID0gZmlsdGVyX2xvZ2ljLnJlcGxhY2UoL1xcKFxccysvaWcsIFwiKFwiKS5yZXBsYWNlKC9cXHMrXFwpL2lnLCBcIilcIikucmVwbGFjZSgvXFwoL2csIFwiW1wiKS5yZXBsYWNlKC9cXCkvZywgXCJdXCIpLnJlcGxhY2UoL1xccysvZywgXCIsXCIpLnJlcGxhY2UoLyhhbmR8b3IpL2lnLCBcIickMSdcIilcclxuXHRmb3JtYXRfbG9naWMgPSBmb3JtYXRfbG9naWMucmVwbGFjZSgvKFxcZCkrL2lnLCAoeCktPlxyXG5cdFx0X2YgPSBmaWx0ZXJzW3gtMV1cclxuXHRcdGZpZWxkID0gX2YuZmllbGRcclxuXHRcdG9wdGlvbiA9IF9mLm9wZXJhdGlvblxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUpXHJcblx0XHRlbHNlXHJcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUsIG51bGwsIG9wdGlvbnMpXHJcblx0XHRzdWJfc2VsZWN0b3IgPSBbXVxyXG5cdFx0aWYgXy5pc0FycmF5KHZhbHVlKSA9PSB0cnVlXHJcblx0XHRcdGlmIG9wdGlvbiA9PSBcIj1cIlxyXG5cdFx0XHRcdF8uZWFjaCB2YWx1ZSwgKHYpLT5cclxuXHRcdFx0XHRcdHN1Yl9zZWxlY3Rvci5wdXNoIFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiXHJcblx0XHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPD5cIlxyXG5cdFx0XHRcdF8uZWFjaCB2YWx1ZSwgKHYpLT5cclxuXHRcdFx0XHRcdHN1Yl9zZWxlY3Rvci5wdXNoIFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJhbmRcIlxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Xy5lYWNoIHZhbHVlLCAodiktPlxyXG5cdFx0XHRcdFx0c3ViX3NlbGVjdG9yLnB1c2ggW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCJcclxuXHRcdFx0aWYgc3ViX3NlbGVjdG9yW3N1Yl9zZWxlY3Rvci5sZW5ndGggLSAxXSA9PSBcImFuZFwiIHx8IHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT0gXCJvclwiXHJcblx0XHRcdFx0c3ViX3NlbGVjdG9yLnBvcCgpXHJcblx0XHRlbHNlXHJcblx0XHRcdHN1Yl9zZWxlY3RvciA9IFtmaWVsZCwgb3B0aW9uLCB2YWx1ZV1cclxuXHRcdGNvbnNvbGUubG9nIFwic3ViX3NlbGVjdG9yXCIsIHN1Yl9zZWxlY3RvclxyXG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHN1Yl9zZWxlY3RvcilcclxuXHQpXHJcblx0Zm9ybWF0X2xvZ2ljID0gXCJbI3tmb3JtYXRfbG9naWN9XVwiXHJcblx0cmV0dXJuIENyZWF0b3IuZXZhbChmb3JtYXRfbG9naWMpXHJcblxyXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblxyXG5cdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW11cclxuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblxyXG5cdGlmICFfb2JqZWN0XHJcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXNcclxuXHJcbiNcdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhfb2JqZWN0LnJlbGF0ZWRfb2JqZWN0cyxcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoX29iamVjdC5fY29sbGVjdGlvbl9uYW1lKVxyXG5cclxuXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcclxuXHRpZiByZWxhdGVkX29iamVjdF9uYW1lcz8ubGVuZ3RoID09IDBcclxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lc1xyXG5cclxuXHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcclxuXHR1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzXHJcblxyXG5cdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdHJldHVybiBfLmZpbHRlciByZWxhdGVkX29iamVjdHMsIChyZWxhdGVkX29iamVjdCktPlxyXG5cdFx0cmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0Lm9iamVjdF9uYW1lXHJcblx0XHRpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMVxyXG5cdFx0YWxsb3dSZWFkID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy5hbGxvd1JlYWRcclxuXHRcdHJldHVybiBpc0FjdGl2ZSBhbmQgYWxsb3dSZWFkXHJcblxyXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3ROYW1lcyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0cmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxyXG5cdHJldHVybiBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cyxcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5DcmVhdG9yLmdldEFjdGlvbnMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cdFx0aWYgIXNwYWNlSWRcclxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxyXG5cdFx0aWYgIXVzZXJJZFxyXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHJcblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblxyXG5cdGlmICFvYmpcclxuXHRcdHJldHVyblxyXG5cclxuXHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcclxuXHRkaXNhYmxlZF9hY3Rpb25zID0gcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9uc1xyXG5cdGFjdGlvbnMgPSBfLnNvcnRCeShfLnZhbHVlcyhvYmouYWN0aW9ucykgLCAnc29ydCcpO1xyXG5cclxuXHRpZiBfLmhhcyhvYmosICdhbGxvd19jdXN0b21BY3Rpb25zJylcclxuXHRcdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XHJcblx0XHRcdHJldHVybiBfLmluY2x1ZGUob2JqLmFsbG93X2N1c3RvbUFjdGlvbnMsIGFjdGlvbi5uYW1lKSB8fCBfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuZ2V0T2JqZWN0KCdiYXNlJykuYWN0aW9ucykgfHwge30sIGFjdGlvbi5uYW1lKVxyXG5cdGlmIF8uaGFzKG9iaiwgJ2V4Y2x1ZGVfYWN0aW9ucycpXHJcblx0XHRhY3Rpb25zID0gXy5maWx0ZXIgYWN0aW9ucywgKGFjdGlvbiktPlxyXG5cdFx0XHRyZXR1cm4gIV8uaW5jbHVkZShvYmouZXhjbHVkZV9hY3Rpb25zLCBhY3Rpb24ubmFtZSlcclxuXHJcblx0Xy5lYWNoIGFjdGlvbnMsIChhY3Rpb24pLT5cclxuXHRcdCMg5omL5py65LiK5Y+q5pi+56S657yW6L6R5oyJ6ZKu77yM5YW25LuW55qE5pS+5Yiw5oqY5Y+g5LiL5ouJ6I+c5Y2V5LitXHJcblx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgJiYgW1wicmVjb3JkXCIsIFwicmVjb3JkX29ubHlcIl0uaW5kZXhPZihhY3Rpb24ub24pID4gLTEgJiYgYWN0aW9uLm5hbWUgIT0gJ3N0YW5kYXJkX2VkaXQnXHJcblx0XHRcdGlmIGFjdGlvbi5vbiA9PSBcInJlY29yZF9vbmx5XCJcclxuXHRcdFx0XHRhY3Rpb24ub24gPSAncmVjb3JkX29ubHlfbW9yZSdcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGFjdGlvbi5vbiA9ICdyZWNvcmRfbW9yZSdcclxuXHJcblx0aWYgU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcImNtc19maWxlc1wiLCBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJdLmluZGV4T2Yob2JqZWN0X25hbWUpID4gLTFcclxuXHRcdCMg6ZmE5Lu254m55q6K5aSE55CG77yM5LiL6L295oyJ6ZKu5pS+5Zyo5Li76I+c5Y2V77yM57yW6L6R5oyJ6ZKu5pS+5Yiw5bqV5LiL5oqY5Y+g5LiL5ouJ6I+c5Y2V5LitXHJcblx0XHRhY3Rpb25zLmZpbmQoKG4pLT4gcmV0dXJuIG4ubmFtZSA9PSBcInN0YW5kYXJkX2VkaXRcIik/Lm9uID0gXCJyZWNvcmRfbW9yZVwiXHJcblx0XHRhY3Rpb25zLmZpbmQoKG4pLT4gcmV0dXJuIG4ubmFtZSA9PSBcImRvd25sb2FkXCIpPy5vbiA9IFwicmVjb3JkXCJcclxuXHJcblx0YWN0aW9ucyA9IF8uZmlsdGVyIGFjdGlvbnMsIChhY3Rpb24pLT5cclxuXHRcdHJldHVybiBfLmluZGV4T2YoZGlzYWJsZWRfYWN0aW9ucywgYWN0aW9uLm5hbWUpIDwgMFxyXG5cclxuXHRyZXR1cm4gYWN0aW9uc1xyXG5cclxuLy8vXHJcblx06L+U5Zue5b2T5YmN55So5oi35pyJ5p2D6ZmQ6K6/6Zeu55qE5omA5pyJbGlzdF92aWV377yM5YyF5ous5YiG5Lqr55qE77yM55So5oi36Ieq5a6a5LmJ6Z2e5YiG5Lqr55qE77yI6Zmk6Z2eb3duZXLlj5jkuobvvInvvIzku6Xlj4rpu5jorqTnmoTlhbbku5bop4blm75cclxuXHTms6jmhI9DcmVhdG9yLmdldFBlcm1pc3Npb25z5Ye95pWw5Lit5piv5LiN5Lya5pyJ55So5oi36Ieq5a6a5LmJ6Z2e5YiG5Lqr55qE6KeG5Zu+55qE77yM5omA5LulQ3JlYXRvci5nZXRQZXJtaXNzaW9uc+WHveaVsOS4reaLv+WIsOeahOe7k+aenOS4jeWFqO+8jOW5tuS4jeaYr+W9k+WJjeeUqOaIt+iDveeci+WIsOaJgOacieinhuWbvlxyXG4vLy9cclxuQ3JlYXRvci5nZXRMaXN0Vmlld3MgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cdFx0aWYgIXNwYWNlSWRcclxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxyXG5cdFx0aWYgIXVzZXJJZFxyXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHRcclxuXHR1bmxlc3Mgb2JqZWN0X25hbWVcclxuXHRcdHJldHVyblxyXG5cclxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHJcblx0aWYgIW9iamVjdFxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdGRpc2FibGVkX2xpc3Rfdmlld3MgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy5kaXNhYmxlZF9saXN0X3ZpZXdzIHx8IFtdXHJcblxyXG5cdGxpc3Rfdmlld3MgPSBbXVxyXG5cclxuXHRpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKVxyXG5cclxuXHRfLmVhY2ggb2JqZWN0Lmxpc3Rfdmlld3MsIChpdGVtLCBpdGVtX25hbWUpLT5cclxuXHRcdGlmIGlzTW9iaWxlIGFuZCBpdGVtLnR5cGUgPT0gXCJjYWxlbmRhclwiXHJcblx0XHRcdCMg5omL5py65LiK5YWI5LiN5pi+56S65pel5Y6G6KeG5Zu+XHJcblx0XHRcdHJldHVyblxyXG5cdFx0aWYgaXRlbV9uYW1lICE9IFwiZGVmYXVsdFwiXHJcblx0XHRcdGlmIF8uaW5kZXhPZihkaXNhYmxlZF9saXN0X3ZpZXdzLCBpdGVtX25hbWUpIDwgMCB8fCBpdGVtLm93bmVyID09IHVzZXJJZFxyXG5cdFx0XHRcdGxpc3Rfdmlld3MucHVzaCBpdGVtXHJcblxyXG5cdHJldHVybiBsaXN0X3ZpZXdzXHJcblxyXG4jIOWJjeWPsOeQhuiuuuS4iuS4jeW6lOivpeiwg+eUqOivpeWHveaVsO+8jOWboOS4uuWtl+auteeahOadg+mZkOmDveWcqENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKS5maWVsZHPnmoTnm7jlhbPlsZ7mgKfkuK3mnInmoIfor4bkuoZcclxuQ3JlYXRvci5nZXRGaWVsZHMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cdFx0aWYgIXNwYWNlSWRcclxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxyXG5cdFx0aWYgIXVzZXJJZFxyXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHJcblx0ZmllbGRzTmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZShvYmplY3RfbmFtZSlcclxuXHR1bnJlYWRhYmxlX2ZpZWxkcyA9ICBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy51bnJlYWRhYmxlX2ZpZWxkc1xyXG5cdHJldHVybiBfLmRpZmZlcmVuY2UoZmllbGRzTmFtZSwgdW5yZWFkYWJsZV9maWVsZHMpXHJcblxyXG5DcmVhdG9yLmlzbG9hZGluZyA9ICgpLT5cclxuXHRyZXR1cm4gIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkLmdldCgpXHJcblxyXG5DcmVhdG9yLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxyXG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIilcclxuXHJcbiMg6K6h566XZmllbGRz55u45YWz5Ye95pWwXHJcbiMgU1RBUlRcclxuQ3JlYXRvci5nZXREaXNhYmxlZEZpZWxkcyA9IChzY2hlbWEpLT5cclxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxyXG5cdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS5kaXNhYmxlZCBhbmQgIWZpZWxkLmF1dG9mb3JtLm9taXQgYW5kIGZpZWxkTmFtZVxyXG5cdClcclxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxyXG5cdHJldHVybiBmaWVsZHNcclxuXHJcbkNyZWF0b3IuZ2V0SGlkZGVuRmllbGRzID0gKHNjaGVtYSktPlxyXG5cdGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkLCBmaWVsZE5hbWUpIC0+XHJcblx0XHRyZXR1cm4gZmllbGQuYXV0b2Zvcm0gYW5kIGZpZWxkLmF1dG9mb3JtLnR5cGUgPT0gXCJoaWRkZW5cIiBhbmQgIWZpZWxkLmF1dG9mb3JtLm9taXQgYW5kIGZpZWxkTmFtZVxyXG5cdClcclxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxyXG5cdHJldHVybiBmaWVsZHNcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRzV2l0aE5vR3JvdXAgPSAoc2NoZW1hKS0+XHJcblx0ZmllbGRzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQsIGZpZWxkTmFtZSkgLT5cclxuXHRcdHJldHVybiAoIWZpZWxkLmF1dG9mb3JtIG9yICFmaWVsZC5hdXRvZm9ybS5ncm91cCBvciBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PSBcIi1cIikgYW5kICghZmllbGQuYXV0b2Zvcm0gb3IgZmllbGQuYXV0b2Zvcm0udHlwZSAhPSBcImhpZGRlblwiKSBhbmQgZmllbGROYW1lXHJcblx0KVxyXG5cdGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpXHJcblx0cmV0dXJuIGZpZWxkc1xyXG5cclxuQ3JlYXRvci5nZXRTb3J0ZWRGaWVsZEdyb3VwTmFtZXMgPSAoc2NoZW1hKS0+XHJcblx0bmFtZXMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCkgLT5cclxuIFx0XHRyZXR1cm4gZmllbGQuYXV0b2Zvcm0gYW5kIGZpZWxkLmF1dG9mb3JtLmdyb3VwICE9IFwiLVwiIGFuZCBmaWVsZC5hdXRvZm9ybS5ncm91cFxyXG5cdClcclxuXHRuYW1lcyA9IF8uY29tcGFjdChuYW1lcylcclxuXHRuYW1lcyA9IF8udW5pcXVlKG5hbWVzKVxyXG5cdHJldHVybiBuYW1lc1xyXG5cclxuQ3JlYXRvci5nZXRGaWVsZHNGb3JHcm91cCA9IChzY2hlbWEsIGdyb3VwTmFtZSkgLT5cclxuICBcdGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkLCBmaWVsZE5hbWUpIC0+XHJcbiAgICBcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT0gZ3JvdXBOYW1lIGFuZCBmaWVsZC5hdXRvZm9ybS50eXBlICE9IFwiaGlkZGVuXCIgYW5kIGZpZWxkTmFtZVxyXG4gIFx0KVxyXG4gIFx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcclxuICBcdHJldHVybiBmaWVsZHNcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRzV2l0aG91dE9taXQgPSAoc2NoZW1hLCBrZXlzKSAtPlxyXG5cdGtleXMgPSBfLm1hcChrZXlzLCAoa2V5KSAtPlxyXG5cdFx0ZmllbGQgPSBfLnBpY2soc2NoZW1hLCBrZXkpXHJcblx0XHRpZiBmaWVsZFtrZXldLmF1dG9mb3JtPy5vbWl0XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ga2V5XHJcblx0KVxyXG5cdGtleXMgPSBfLmNvbXBhY3Qoa2V5cylcclxuXHRyZXR1cm4ga2V5c1xyXG5cclxuQ3JlYXRvci5nZXRGaWVsZHNJbkZpcnN0TGV2ZWwgPSAoZmlyc3RMZXZlbEtleXMsIGtleXMpIC0+XHJcblx0a2V5cyA9IF8ubWFwKGtleXMsIChrZXkpIC0+XHJcblx0XHRpZiBfLmluZGV4T2YoZmlyc3RMZXZlbEtleXMsIGtleSkgPiAtMVxyXG5cdFx0XHRyZXR1cm4ga2V5XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdClcclxuXHRrZXlzID0gXy5jb21wYWN0KGtleXMpXHJcblx0cmV0dXJuIGtleXNcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRzRm9yUmVvcmRlciA9IChzY2hlbWEsIGtleXMsIGlzU2luZ2xlKSAtPlxyXG5cdGZpZWxkcyA9IFtdXHJcblx0aSA9IDBcclxuXHRfa2V5cyA9IF8uZmlsdGVyKGtleXMsIChrZXkpLT5cclxuXHRcdHJldHVybiAha2V5LmVuZHNXaXRoKCdfZW5kTGluZScpXHJcblx0KTtcclxuXHR3aGlsZSBpIDwgX2tleXMubGVuZ3RoXHJcblx0XHRzY18xID0gXy5waWNrKHNjaGVtYSwgX2tleXNbaV0pXHJcblx0XHRzY18yID0gXy5waWNrKHNjaGVtYSwgX2tleXNbaSsxXSlcclxuXHJcblx0XHRpc193aWRlXzEgPSBmYWxzZVxyXG5cdFx0aXNfd2lkZV8yID0gZmFsc2VcclxuXHJcbiNcdFx0aXNfcmFuZ2VfMSA9IGZhbHNlXHJcbiNcdFx0aXNfcmFuZ2VfMiA9IGZhbHNlXHJcblxyXG5cdFx0Xy5lYWNoIHNjXzEsICh2YWx1ZSkgLT5cclxuXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3dpZGUgfHwgdmFsdWUuYXV0b2Zvcm0/LnR5cGUgPT0gXCJ0YWJsZVwiXHJcblx0XHRcdFx0aXNfd2lkZV8xID0gdHJ1ZVxyXG5cclxuI1x0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc19yYW5nZVxyXG4jXHRcdFx0XHRpc19yYW5nZV8xID0gdHJ1ZVxyXG5cclxuXHRcdF8uZWFjaCBzY18yLCAodmFsdWUpIC0+XHJcblx0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc193aWRlIHx8IHZhbHVlLmF1dG9mb3JtPy50eXBlID09IFwidGFibGVcIlxyXG5cdFx0XHRcdGlzX3dpZGVfMiA9IHRydWVcclxuXHJcbiNcdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfcmFuZ2VcclxuI1x0XHRcdFx0aXNfcmFuZ2VfMiA9IHRydWVcclxuXHJcblx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHRcdFx0aXNfd2lkZV8xID0gdHJ1ZVxyXG5cdFx0XHRpc193aWRlXzIgPSB0cnVlXHJcblxyXG5cdFx0aWYgaXNTaW5nbGVcclxuXHRcdFx0ZmllbGRzLnB1c2ggX2tleXMuc2xpY2UoaSwgaSsxKVxyXG5cdFx0XHRpICs9IDFcclxuXHRcdGVsc2VcclxuI1x0XHRcdGlmICFpc19yYW5nZV8xICYmIGlzX3JhbmdlXzJcclxuI1x0XHRcdFx0Y2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSsxKVxyXG4jXHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcclxuI1x0XHRcdFx0ZmllbGRzLnB1c2ggY2hpbGRLZXlzXHJcbiNcdFx0XHRcdGkgKz0gMVxyXG4jXHRcdFx0ZWxzZVxyXG5cdFx0XHRpZiBpc193aWRlXzFcclxuXHRcdFx0XHRmaWVsZHMucHVzaCBfa2V5cy5zbGljZShpLCBpKzEpXHJcblx0XHRcdFx0aSArPSAxXHJcblx0XHRcdGVsc2UgaWYgIWlzX3dpZGVfMSBhbmQgaXNfd2lkZV8yXHJcblx0XHRcdFx0Y2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSsxKVxyXG5cdFx0XHRcdGNoaWxkS2V5cy5wdXNoIHVuZGVmaW5lZFxyXG5cdFx0XHRcdGZpZWxkcy5wdXNoIGNoaWxkS2V5c1xyXG5cdFx0XHRcdGkgKz0gMVxyXG5cdFx0XHRlbHNlIGlmICFpc193aWRlXzEgYW5kICFpc193aWRlXzJcclxuXHRcdFx0XHRjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpKzEpXHJcblx0XHRcdFx0aWYgX2tleXNbaSsxXVxyXG5cdFx0XHRcdFx0Y2hpbGRLZXlzLnB1c2ggX2tleXNbaSsxXVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGNoaWxkS2V5cy5wdXNoIHVuZGVmaW5lZFxyXG5cdFx0XHRcdGZpZWxkcy5wdXNoIGNoaWxkS2V5c1xyXG5cdFx0XHRcdGkgKz0gMlxyXG5cclxuXHRyZXR1cm4gZmllbGRzXHJcblxyXG5DcmVhdG9yLmlzRmlsdGVyVmFsdWVFbXB0eSA9ICh2KSAtPlxyXG5cdHJldHVybiB0eXBlb2YgdiA9PSBcInVuZGVmaW5lZFwiIHx8IHYgPT0gbnVsbCB8fCBOdW1iZXIuaXNOYU4odikgfHwgdi5sZW5ndGggPT0gMFxyXG5cclxuQ3JlYXRvci5nZXRGaWVsZERhdGFUeXBlID0gKG9iamVjdEZpZWxkcywga2V5KS0+XHJcblx0aWYgb2JqZWN0RmllbGRzIGFuZCBrZXlcclxuXHRcdHJlc3VsdCA9IG9iamVjdEZpZWxkc1trZXldPy50eXBlXHJcblx0XHRpZiBbXCJmb3JtdWxhXCIsIFwic3VtbWFyeVwiXS5pbmRleE9mKHJlc3VsdCkgPiAtMVxyXG5cdFx0XHRyZXN1bHQgPSBvYmplY3RGaWVsZHNba2V5XS5kYXRhX3R5cGVcclxuXHRcdHJldHVybiByZXN1bHRcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gXCJ0ZXh0XCJcclxuXHJcbiMgRU5EXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRDcmVhdG9yLmdldEFsbFJlbGF0ZWRPYmplY3RzID0gKG9iamVjdF9uYW1lKS0+XHJcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdXHJcblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cclxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSktPlxyXG5cdFx0XHRcdGlmIHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lXHJcblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoIHJlbGF0ZWRfb2JqZWN0X25hbWVcclxuXHJcblx0XHRpZiBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZW5hYmxlX2ZpbGVzXHJcblx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzLnB1c2ggXCJjbXNfZmlsZXNcIlxyXG5cclxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lc1xyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0U3RlZWRvcy5mb3JtYXRJbmRleCA9IChhcnJheSkgLT5cclxuXHRcdG9iamVjdCA9IHtcclxuICAgICAgICBcdGJhY2tncm91bmQ6IHRydWVcclxuICAgIFx0fTtcclxuXHRcdGlzZG9jdW1lbnREQiA9IE1ldGVvci5zZXR0aW5ncz8uZGF0YXNvdXJjZXM/LmRlZmF1bHQ/LmRvY3VtZW50REIgfHwgZmFsc2U7XHJcblx0XHRpZiBpc2RvY3VtZW50REJcclxuXHRcdFx0aWYgYXJyYXkubGVuZ3RoID4gMFxyXG5cdFx0XHRcdGluZGV4TmFtZSA9IGFycmF5LmpvaW4oXCIuXCIpO1xyXG5cdFx0XHRcdG9iamVjdC5uYW1lID0gaW5kZXhOYW1lO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChpbmRleE5hbWUubGVuZ3RoID4gNTIpXHJcblx0XHRcdFx0XHRvYmplY3QubmFtZSA9IGluZGV4TmFtZS5zdWJzdHJpbmcoMCw1Mik7XHJcblxyXG5cdFx0cmV0dXJuIG9iamVjdDsiLCJDcmVhdG9yLmdldFNjaGVtYSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLnNjaGVtYSA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0SG9tZUNvbXBvbmVudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gUmVhY3RTdGVlZG9zLnBsdWdpbkNvbXBvbmVudFNlbGVjdG9yKFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLCBcIk9iamVjdEhvbWVcIiwgb2JqZWN0X25hbWUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkge1xuICB2YXIgbGlzdF92aWV3LCBsaXN0X3ZpZXdfaWQ7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKTtcbiAgbGlzdF92aWV3X2lkID0gbGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcuX2lkIDogdm9pZCAwO1xuICBpZiAocmVjb3JkX2lkKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQpO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJtZWV0aW5nXCIpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChDcmVhdG9yLmdldE9iamVjdEhvbWVDb21wb25lbnQob2JqZWN0X25hbWUpKSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RBYnNvbHV0ZVVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkge1xuICB2YXIgbGlzdF92aWV3LCBsaXN0X3ZpZXdfaWQ7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKTtcbiAgbGlzdF92aWV3X2lkID0gbGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcuX2lkIDogdm9pZCAwO1xuICBpZiAocmVjb3JkX2lkKSB7XG4gICAgcmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQsIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJtZWV0aW5nXCIpIHtcbiAgICAgIHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIiwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkLCB0cnVlKTtcbiAgICB9XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0Um91dGVyVXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSB7XG4gIHZhciBsaXN0X3ZpZXcsIGxpc3Rfdmlld19pZDtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpO1xuICBsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5faWQgOiB2b2lkIDA7XG4gIGlmIChyZWNvcmRfaWQpIHtcbiAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBcIm1lZXRpbmdcIikge1xuICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkO1xuICAgIH1cbiAgfVxufTtcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1VybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkge1xuICB2YXIgdXJsO1xuICB1cmwgPSBDcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKTtcbiAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwodXJsKTtcbn07XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkge1xuICBpZiAobGlzdF92aWV3X2lkID09PSBcImNhbGVuZGFyXCIpIHtcbiAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRTd2l0Y2hMaXN0VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSB7XG4gIGlmIChsaXN0X3ZpZXdfaWQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi9saXN0XCIpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9saXN0L3N3aXRjaFwiKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgcmVjb3JkX2lkLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgaWYgKHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIHJlY29yZF9pZCArIFwiL1wiICsgcmVsYXRlZF9vYmplY3RfbmFtZSArIFwiL2dyaWQ/cmVsYXRlZF9maWVsZF9uYW1lPVwiICsgcmVsYXRlZF9maWVsZF9uYW1lKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyByZWNvcmRfaWQgKyBcIi9cIiArIHJlbGF0ZWRfb2JqZWN0X25hbWUgKyBcIi9ncmlkXCIpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBpc19kZWVwLCBpc19za2lwX2hpZGUsIGlzX3JlbGF0ZWQpIHtcbiAgdmFyIF9vYmplY3QsIF9vcHRpb25zLCBmaWVsZHMsIGljb24sIHJlbGF0ZWRPYmplY3RzO1xuICBfb3B0aW9ucyA9IFtdO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIF9vcHRpb25zO1xuICB9XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZmllbGRzIDogdm9pZCAwO1xuICBpY29uID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwO1xuICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgaWYgKGlzX3NraXBfaGlkZSAmJiBmLmhpZGRlbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZi50eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgIGxhYmVsOiBcIlwiICsgKGYubGFiZWwgfHwgayksXG4gICAgICAgIHZhbHVlOiBcIlwiICsgayxcbiAgICAgICAgaWNvbjogaWNvblxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgbGFiZWw6IGYubGFiZWwgfHwgayxcbiAgICAgICAgdmFsdWU6IGssXG4gICAgICAgIGljb246IGljb25cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIGlmIChpc19kZWVwKSB7XG4gICAgXy5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZiwgaykge1xuICAgICAgdmFyIHJfb2JqZWN0O1xuICAgICAgaWYgKGlzX3NraXBfaGlkZSAmJiBmLmhpZGRlbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoKGYudHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSAmJiBmLnJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKGYucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICByX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGYucmVmZXJlbmNlX3RvKTtcbiAgICAgICAgaWYgKHJfb2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGYyLCBrMikge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgICBsYWJlbDogKGYubGFiZWwgfHwgaykgKyBcIj0+XCIgKyAoZjIubGFiZWwgfHwgazIpLFxuICAgICAgICAgICAgICB2YWx1ZTogayArIFwiLlwiICsgazIsXG4gICAgICAgICAgICAgIGljb246IHJfb2JqZWN0ICE9IG51bGwgPyByX29iamVjdC5pY29uIDogdm9pZCAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChpc19yZWxhdGVkKSB7XG4gICAgcmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKTtcbiAgICBfLmVhY2gocmVsYXRlZE9iamVjdHMsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKF9yZWxhdGVkT2JqZWN0KSB7XG4gICAgICAgIHZhciByZWxhdGVkT2JqZWN0LCByZWxhdGVkT3B0aW9ucztcbiAgICAgICAgcmVsYXRlZE9wdGlvbnMgPSBDcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyhfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSk7XG4gICAgICAgIHJldHVybiBfLmVhY2gocmVsYXRlZE9wdGlvbnMsIGZ1bmN0aW9uKHJlbGF0ZWRPcHRpb24pIHtcbiAgICAgICAgICBpZiAoX3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXkgIT09IHJlbGF0ZWRPcHRpb24udmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgbGFiZWw6IChyZWxhdGVkT2JqZWN0LmxhYmVsIHx8IHJlbGF0ZWRPYmplY3QubmFtZSkgKyBcIj0+XCIgKyByZWxhdGVkT3B0aW9uLmxhYmVsLFxuICAgICAgICAgICAgICB2YWx1ZTogcmVsYXRlZE9iamVjdC5uYW1lICsgXCIuXCIgKyByZWxhdGVkT3B0aW9uLnZhbHVlLFxuICAgICAgICAgICAgICBpY29uOiByZWxhdGVkT2JqZWN0ICE9IG51bGwgPyByZWxhdGVkT2JqZWN0Lmljb24gOiB2b2lkIDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfVxuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEZpbHRlckZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBfb3B0aW9ucywgZmllbGRzLCBpY29uLCBwZXJtaXNzaW9uX2ZpZWxkcztcbiAgX29wdGlvbnMgPSBbXTtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfb3B0aW9ucztcbiAgfVxuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgcGVybWlzc2lvbl9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhvYmplY3RfbmFtZSk7XG4gIGljb24gPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDA7XG4gIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICBpZiAoIV8uaW5jbHVkZShbXCJncmlkXCIsIFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiLCBcImF2YXRhclwiLCBcImltYWdlXCIsIFwibWFya2Rvd25cIiwgXCJodG1sXCJdLCBmLnR5cGUpICYmICFmLmhpZGRlbikge1xuICAgICAgaWYgKCEvXFx3K1xcLi8udGVzdChrKSAmJiBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiBmLmxhYmVsIHx8IGssXG4gICAgICAgICAgdmFsdWU6IGssXG4gICAgICAgICAgaWNvbjogaWNvblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBfb3B0aW9ucywgZmllbGRzLCBpY29uLCBwZXJtaXNzaW9uX2ZpZWxkcztcbiAgX29wdGlvbnMgPSBbXTtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfb3B0aW9ucztcbiAgfVxuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgcGVybWlzc2lvbl9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhvYmplY3RfbmFtZSk7XG4gIGljb24gPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDA7XG4gIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICBpZiAoIV8uaW5jbHVkZShbXCJncmlkXCIsIFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKSkge1xuICAgICAgaWYgKCEvXFx3K1xcLi8udGVzdChrKSAmJiBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiBmLmxhYmVsIHx8IGssXG4gICAgICAgICAgdmFsdWU6IGssXG4gICAgICAgICAgaWNvbjogaWNvblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5cbi8qXG5maWx0ZXJzOiDopoHovazmjaLnmoRmaWx0ZXJzXG5maWVsZHM6IOWvueixoeWtl+autVxuZmlsdGVyX2ZpZWxkczog6buY6K6k6L+H5ruk5a2X5q6177yM5pSv5oyB5a2X56ym5Liy5pWw57uE5ZKM5a+56LGh5pWw57uE5Lik56eN5qC85byP77yM5aaCOlsnZmlsZWRfbmFtZTEnLCdmaWxlZF9uYW1lMiddLFt7ZmllbGQ6J2ZpbGVkX25hbWUxJyxyZXF1aXJlZDp0cnVlfV1cbuWkhOeQhumAu+i+kTog5oqKZmlsdGVyc+S4reWtmOWcqOS6jmZpbHRlcl9maWVsZHPnmoTov4fmu6TmnaHku7blop7liqDmr4/pobnnmoRpc19kZWZhdWx044CBaXNfcmVxdWlyZWTlsZ7mgKfvvIzkuI3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25a+55bqU55qE56e76Zmk5q+P6aG555qE55u45YWz5bGe5oCnXG7ov5Tlm57nu5Pmnpw6IOWkhOeQhuWQjueahGZpbHRlcnNcbiAqL1xuXG5DcmVhdG9yLmdldEZpbHRlcnNXaXRoRmlsdGVyRmllbGRzID0gZnVuY3Rpb24oZmlsdGVycywgZmllbGRzLCBmaWx0ZXJfZmllbGRzKSB7XG4gIGlmICghZmlsdGVycykge1xuICAgIGZpbHRlcnMgPSBbXTtcbiAgfVxuICBpZiAoIWZpbHRlcl9maWVsZHMpIHtcbiAgICBmaWx0ZXJfZmllbGRzID0gW107XG4gIH1cbiAgaWYgKGZpbHRlcl9maWVsZHMgIT0gbnVsbCA/IGZpbHRlcl9maWVsZHMubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgZmlsdGVyX2ZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uKG4pIHtcbiAgICAgIGlmIChfLmlzU3RyaW5nKG4pKSB7XG4gICAgICAgIG4gPSB7XG4gICAgICAgICAgZmllbGQ6IG4sXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoZmllbGRzW24uZmllbGRdICYmICFfLmZpbmRXaGVyZShmaWx0ZXJzLCB7XG4gICAgICAgIGZpZWxkOiBuLmZpZWxkXG4gICAgICB9KSkge1xuICAgICAgICByZXR1cm4gZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICBmaWVsZDogbi5maWVsZCxcbiAgICAgICAgICBpc19kZWZhdWx0OiB0cnVlLFxuICAgICAgICAgIGlzX3JlcXVpcmVkOiBuLnJlcXVpcmVkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbihmaWx0ZXJJdGVtKSB7XG4gICAgdmFyIG1hdGNoRmllbGQ7XG4gICAgbWF0Y2hGaWVsZCA9IGZpbHRlcl9maWVsZHMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbiA9PT0gZmlsdGVySXRlbS5maWVsZCB8fCBuLmZpZWxkID09PSBmaWx0ZXJJdGVtLmZpZWxkO1xuICAgIH0pO1xuICAgIGlmIChfLmlzU3RyaW5nKG1hdGNoRmllbGQpKSB7XG4gICAgICBtYXRjaEZpZWxkID0ge1xuICAgICAgICBmaWVsZDogbWF0Y2hGaWVsZCxcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAobWF0Y2hGaWVsZCkge1xuICAgICAgZmlsdGVySXRlbS5pc19kZWZhdWx0ID0gdHJ1ZTtcbiAgICAgIHJldHVybiBmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkID0gbWF0Y2hGaWVsZC5yZXF1aXJlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGZpbHRlckl0ZW0uaXNfZGVmYXVsdDtcbiAgICAgIHJldHVybiBkZWxldGUgZmlsdGVySXRlbS5pc19yZXF1aXJlZDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmlsdGVycztcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKSB7XG4gIHZhciBjb2xsZWN0aW9uLCByZWNvcmQsIHJlZiwgcmVmMSwgcmVmMjtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAoIXJlY29yZF9pZCkge1xuICAgIHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikgJiYgcmVjb3JkX2lkID09PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSkge1xuICAgICAgaWYgKChyZWYgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpKSAhPSBudWxsID8gcmVmLnJlY29yZCA6IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gKHJlZjEgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLnJlY29yZCkgIT0gbnVsbCA/IHJlZjIuZ2V0KCkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpO1xuICAgIH1cbiAgfVxuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKTtcbiAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICByZWNvcmQgPSBjb2xsZWN0aW9uLmZpbmRPbmUocmVjb3JkX2lkKTtcbiAgICByZXR1cm4gcmVjb3JkO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZE5hbWUgPSBmdW5jdGlvbihyZWNvcmQsIG9iamVjdF9uYW1lKSB7XG4gIHZhciBuYW1lX2ZpZWxkX2tleSwgcmVmO1xuICBpZiAoIXJlY29yZCkge1xuICAgIHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKCk7XG4gIH1cbiAgaWYgKHJlY29yZCkge1xuICAgIG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0X25hbWUgPT09IFwib3JnYW5pemF0aW9uc1wiID8gXCJuYW1lXCIgOiAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLk5BTUVfRklFTERfS0VZIDogdm9pZCAwO1xuICAgIGlmIChyZWNvcmQgJiYgbmFtZV9maWVsZF9rZXkpIHtcbiAgICAgIHJldHVybiByZWNvcmQubGFiZWwgfHwgcmVjb3JkW25hbWVfZmllbGRfa2V5XTtcbiAgICB9XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QXBwID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIHJlZiwgcmVmMTtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBhcHAgPSBDcmVhdG9yLkFwcHNbYXBwX2lkXTtcbiAgaWYgKChyZWYgPSBDcmVhdG9yLmRlcHMpICE9IG51bGwpIHtcbiAgICBpZiAoKHJlZjEgPSByZWYuYXBwKSAhPSBudWxsKSB7XG4gICAgICByZWYxLmRlcGVuZCgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXBwO1xufTtcblxuQ3JlYXRvci5nZXRBcHBEYXNoYm9hcmQgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgdmFyIGFwcCwgZGFzaGJvYXJkO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCkge1xuICAgIHJldHVybjtcbiAgfVxuICBkYXNoYm9hcmQgPSBudWxsO1xuICBfLmVhY2goQ3JlYXRvci5EYXNoYm9hcmRzLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB2LmFwcHMpICE9IG51bGwgPyByZWYuaW5kZXhPZihhcHAuX2lkKSA6IHZvaWQgMCkgPiAtMSkge1xuICAgICAgcmV0dXJuIGRhc2hib2FyZCA9IHY7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGRhc2hib2FyZDtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkQ29tcG9uZW50ID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHA7XG4gIGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZCk7XG4gIGlmICghYXBwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJldHVybiBSZWFjdFN0ZWVkb3MucGx1Z2luQ29tcG9uZW50U2VsZWN0b3IoUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCksIFwiRGFzaGJvYXJkXCIsIGFwcC5faWQpO1xufTtcblxuQ3JlYXRvci5nZXRBcHBPYmplY3ROYW1lcyA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwLCBhcHBPYmplY3RzLCBpc01vYmlsZSwgb2JqZWN0cztcbiAgYXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKTtcbiAgaWYgKCFhcHApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKCk7XG4gIGFwcE9iamVjdHMgPSBpc01vYmlsZSA/IGFwcC5tb2JpbGVfb2JqZWN0cyA6IGFwcC5vYmplY3RzO1xuICBvYmplY3RzID0gW107XG4gIGlmIChhcHApIHtcbiAgICBfLmVhY2goYXBwT2JqZWN0cywgZnVuY3Rpb24odikge1xuICAgICAgdmFyIG9iajtcbiAgICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KHYpO1xuICAgICAgaWYgKG9iaiAhPSBudWxsID8gb2JqLnBlcm1pc3Npb25zLmdldCgpLmFsbG93UmVhZCA6IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0cy5wdXNoKHYpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3RzO1xufTtcblxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwcyA9IGZ1bmN0aW9uKGluY2x1ZGVBZG1pbikge1xuICB2YXIgY2hhbmdlQXBwO1xuICBjaGFuZ2VBcHAgPSBDcmVhdG9yLl9zdWJBcHAuZ2V0KCk7XG4gIFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLmVudGl0aWVzLmFwcHMgPSBPYmplY3QuYXNzaWduKHt9LCBSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKS5lbnRpdGllcy5hcHBzLCB7XG4gICAgYXBwczogY2hhbmdlQXBwXG4gIH0pO1xuICByZXR1cm4gUmVhY3RTdGVlZG9zLnZpc2libGVBcHBzU2VsZWN0b3IoUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCksIGluY2x1ZGVBZG1pbik7XG59O1xuXG5DcmVhdG9yLmdldFZpc2libGVBcHBzT2JqZWN0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXBwcywgb2JqZWN0cywgdmlzaWJsZU9iamVjdE5hbWVzO1xuICBhcHBzID0gQ3JlYXRvci5nZXRWaXNpYmxlQXBwcygpO1xuICB2aXNpYmxlT2JqZWN0TmFtZXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhhcHBzLCAnb2JqZWN0cycpKTtcbiAgb2JqZWN0cyA9IF8uZmlsdGVyKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKHZpc2libGVPYmplY3ROYW1lcy5pbmRleE9mKG9iai5uYW1lKSA8IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgb2JqZWN0cyA9IG9iamVjdHMuc29ydChDcmVhdG9yLnNvcnRpbmdNZXRob2QuYmluZCh7XG4gICAga2V5OiBcImxhYmVsXCJcbiAgfSkpO1xuICBvYmplY3RzID0gXy5wbHVjayhvYmplY3RzLCAnbmFtZScpO1xuICByZXR1cm4gXy51bmlxKG9iamVjdHMpO1xufTtcblxuQ3JlYXRvci5nZXRBcHBzT2JqZWN0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgb2JqZWN0cywgdGVtcE9iamVjdHM7XG4gIG9iamVjdHMgPSBbXTtcbiAgdGVtcE9iamVjdHMgPSBbXTtcbiAgXy5mb3JFYWNoKENyZWF0b3IuQXBwcywgZnVuY3Rpb24oYXBwKSB7XG4gICAgdGVtcE9iamVjdHMgPSBfLmZpbHRlcihhcHAub2JqZWN0cywgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gIW9iai5oaWRkZW47XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iamVjdHMgPSBvYmplY3RzLmNvbmNhdCh0ZW1wT2JqZWN0cyk7XG4gIH0pO1xuICByZXR1cm4gXy51bmlxKG9iamVjdHMpO1xufTtcblxuQ3JlYXRvci52YWxpZGF0ZUZpbHRlcnMgPSBmdW5jdGlvbihmaWx0ZXJzLCBsb2dpYykge1xuICB2YXIgZSwgZXJyb3JNc2csIGZpbHRlcl9pdGVtcywgZmlsdGVyX2xlbmd0aCwgZmxhZywgaW5kZXgsIHdvcmQ7XG4gIGZpbHRlcl9pdGVtcyA9IF8ubWFwKGZpbHRlcnMsIGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChfLmlzRW1wdHkob2JqKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgfSk7XG4gIGZpbHRlcl9pdGVtcyA9IF8uY29tcGFjdChmaWx0ZXJfaXRlbXMpO1xuICBlcnJvck1zZyA9IFwiXCI7XG4gIGZpbHRlcl9sZW5ndGggPSBmaWx0ZXJfaXRlbXMubGVuZ3RoO1xuICBpZiAobG9naWMpIHtcbiAgICBsb2dpYyA9IGxvZ2ljLnJlcGxhY2UoL1xcbi9nLCBcIlwiKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgICBpZiAoL1suX1xcLSErXSsvaWcudGVzdChsb2dpYykpIHtcbiAgICAgIGVycm9yTXNnID0gXCLlkKvmnInnibnmrorlrZfnrKbjgIJcIjtcbiAgICB9XG4gICAgaWYgKCFlcnJvck1zZykge1xuICAgICAgaW5kZXggPSBsb2dpYy5tYXRjaCgvXFxkKy9pZyk7XG4gICAgICBpZiAoIWluZGV4KSB7XG4gICAgICAgIGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZGV4LmZvckVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgIGlmIChpIDwgMSB8fCBpID4gZmlsdGVyX2xlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInmnaHku7blvJXnlKjkuobmnKrlrprkuYnnmoTnrZvpgInlmajvvJpcIiArIGkgKyBcIuOAglwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZsYWcgPSAxO1xuICAgICAgICB3aGlsZSAoZmxhZyA8PSBmaWx0ZXJfbGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFpbmRleC5pbmNsdWRlcyhcIlwiICsgZmxhZykpIHtcbiAgICAgICAgICAgIGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmxhZysrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIHdvcmQgPSBsb2dpYy5tYXRjaCgvW2EtekEtWl0rL2lnKTtcbiAgICAgIGlmICh3b3JkKSB7XG4gICAgICAgIHdvcmQuZm9yRWFjaChmdW5jdGlvbih3KSB7XG4gICAgICAgICAgaWYgKCEvXihhbmR8b3IpJC9pZy50ZXN0KHcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JNc2cgPSBcIuajgOafpeaCqOeahOmrmOe6p+etm+mAieadoeS7tuS4reeahOaLvOWGmeOAglwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIENyZWF0b3JbXCJldmFsXCJdKGxvZ2ljLnJlcGxhY2UoL2FuZC9pZywgXCImJlwiKS5yZXBsYWNlKC9vci9pZywgXCJ8fFwiKSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajkuK3lkKvmnInnibnmrorlrZfnrKZcIjtcbiAgICAgIH1cbiAgICAgIGlmICgvKEFORClbXigpXSsoT1IpL2lnLnRlc3QobG9naWMpIHx8IC8oT1IpW14oKV0rKEFORCkvaWcudGVzdChsb2dpYykpIHtcbiAgICAgICAgZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOW/hemhu+WcqOi/nue7reaAp+eahCBBTkQg5ZKMIE9SIOihqOi+vuW8j+WJjeWQjuS9v+eUqOaLrOWPt+OAglwiO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoZXJyb3JNc2cpIHtcbiAgICBjb25zb2xlLmxvZyhcImVycm9yXCIsIGVycm9yTXNnKTtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB0b2FzdHIuZXJyb3IoZXJyb3JNc2cpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cblxuLypcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9Nb25nbyA9IGZ1bmN0aW9uKGZpbHRlcnMsIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGVjdG9yO1xuICBpZiAoIShmaWx0ZXJzICE9IG51bGwgPyBmaWx0ZXJzLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCEoZmlsdGVyc1swXSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgIGZpbHRlcnMgPSBfLm1hcChmaWx0ZXJzLCBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBbb2JqLmZpZWxkLCBvYmoub3BlcmF0aW9uLCBvYmoudmFsdWVdO1xuICAgIH0pO1xuICB9XG4gIHNlbGVjdG9yID0gW107XG4gIF8uZWFjaChmaWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICB2YXIgZmllbGQsIG9wdGlvbiwgcmVnLCBzdWJfc2VsZWN0b3IsIHZhbHVlO1xuICAgIGZpZWxkID0gZmlsdGVyWzBdO1xuICAgIG9wdGlvbiA9IGZpbHRlclsxXTtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBudWxsLCBvcHRpb25zKTtcbiAgICB9XG4gICAgc3ViX3NlbGVjdG9yID0ge307XG4gICAgc3ViX3NlbGVjdG9yW2ZpZWxkXSA9IHt9O1xuICAgIGlmIChvcHRpb24gPT09IFwiPVwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGVxXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD5cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRuZVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIj5cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndFwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIj49XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RlXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPFwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGx0XCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD1cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdGVcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJzdGFydHN3aXRoXCIpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeXCIgKyB2YWx1ZSwgXCJpXCIpO1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJjb250YWluc1wiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKHZhbHVlLCBcImlcIik7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIm5vdGNvbnRhaW5zXCIpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeKCg/IVwiICsgdmFsdWUgKyBcIikuKSokXCIsIFwiaVwiKTtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWc7XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3Rvci5wdXNoKHN1Yl9zZWxlY3Rvcik7XG4gIH0pO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5DcmVhdG9yLmlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiA9IGZ1bmN0aW9uKG9wZXJhdGlvbikge1xuICB2YXIgcmVmO1xuICByZXR1cm4gb3BlcmF0aW9uID09PSBcImJldHdlZW5cIiB8fCAhISgocmVmID0gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXModHJ1ZSkpICE9IG51bGwgPyByZWZbb3BlcmF0aW9uXSA6IHZvaWQgMCk7XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuXHRleHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9EZXYgPSBmdW5jdGlvbihmaWx0ZXJzLCBvYmplY3RfbmFtZSwgb3B0aW9ucykge1xuICB2YXIgbG9naWNUZW1wRmlsdGVycywgc2VsZWN0b3IsIHN0ZWVkb3NGaWx0ZXJzO1xuICBzdGVlZG9zRmlsdGVycyA9IHJlcXVpcmUoXCJAc3RlZWRvcy9maWx0ZXJzXCIpO1xuICBpZiAoIWZpbHRlcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLmlzX2xvZ2ljX29yIDogdm9pZCAwKSB7XG4gICAgbG9naWNUZW1wRmlsdGVycyA9IFtdO1xuICAgIGZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbihuKSB7XG4gICAgICBsb2dpY1RlbXBGaWx0ZXJzLnB1c2gobik7XG4gICAgICByZXR1cm4gbG9naWNUZW1wRmlsdGVycy5wdXNoKFwib3JcIik7XG4gICAgfSk7XG4gICAgbG9naWNUZW1wRmlsdGVycy5wb3AoKTtcbiAgICBmaWx0ZXJzID0gbG9naWNUZW1wRmlsdGVycztcbiAgfVxuICBzZWxlY3RvciA9IHN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb0RldihmaWx0ZXJzLCBDcmVhdG9yLlVTRVJfQ09OVEVYVCk7XG4gIHJldHVybiBzZWxlY3Rvcjtcbn07XG5cblxuLypcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XG4gKi9cblxuQ3JlYXRvci5mb3JtYXRMb2dpY0ZpbHRlcnNUb0RldiA9IGZ1bmN0aW9uKGZpbHRlcnMsIGZpbHRlcl9sb2dpYywgb3B0aW9ucykge1xuICB2YXIgZm9ybWF0X2xvZ2ljO1xuICBmb3JtYXRfbG9naWMgPSBmaWx0ZXJfbG9naWMucmVwbGFjZSgvXFwoXFxzKy9pZywgXCIoXCIpLnJlcGxhY2UoL1xccytcXCkvaWcsIFwiKVwiKS5yZXBsYWNlKC9cXCgvZywgXCJbXCIpLnJlcGxhY2UoL1xcKS9nLCBcIl1cIikucmVwbGFjZSgvXFxzKy9nLCBcIixcIikucmVwbGFjZSgvKGFuZHxvcikvaWcsIFwiJyQxJ1wiKTtcbiAgZm9ybWF0X2xvZ2ljID0gZm9ybWF0X2xvZ2ljLnJlcGxhY2UoLyhcXGQpKy9pZywgZnVuY3Rpb24oeCkge1xuICAgIHZhciBfZiwgZmllbGQsIG9wdGlvbiwgc3ViX3NlbGVjdG9yLCB2YWx1ZTtcbiAgICBfZiA9IGZpbHRlcnNbeCAtIDFdO1xuICAgIGZpZWxkID0gX2YuZmllbGQ7XG4gICAgb3B0aW9uID0gX2Yub3BlcmF0aW9uO1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlLCBudWxsLCBvcHRpb25zKTtcbiAgICB9XG4gICAgc3ViX3NlbGVjdG9yID0gW107XG4gICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkgPT09IHRydWUpIHtcbiAgICAgIGlmIChvcHRpb24gPT09IFwiPVwiKSB7XG4gICAgICAgIF8uZWFjaCh2YWx1ZSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBzdWJfc2VsZWN0b3IucHVzaChbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPD5cIikge1xuICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4gc3ViX3NlbGVjdG9yLnB1c2goW2ZpZWxkLCBvcHRpb24sIHZdLCBcImFuZFwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4gc3ViX3NlbGVjdG9yLnB1c2goW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09PSBcImFuZFwiIHx8IHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT09IFwib3JcIikge1xuICAgICAgICBzdWJfc2VsZWN0b3IucG9wKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Yl9zZWxlY3RvciA9IFtmaWVsZCwgb3B0aW9uLCB2YWx1ZV07XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwic3ViX3NlbGVjdG9yXCIsIHN1Yl9zZWxlY3Rvcik7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN1Yl9zZWxlY3Rvcik7XG4gIH0pO1xuICBmb3JtYXRfbG9naWMgPSBcIltcIiArIGZvcm1hdF9sb2dpYyArIFwiXVwiO1xuICByZXR1cm4gQ3JlYXRvcltcImV2YWxcIl0oZm9ybWF0X2xvZ2ljKTtcbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBfb2JqZWN0LCBwZXJtaXNzaW9ucywgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHJlbGF0ZWRfb2JqZWN0cywgdW5yZWxhdGVkX29iamVjdHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBbXTtcbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFfb2JqZWN0KSB7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICB9XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoX29iamVjdC5fY29sbGVjdGlvbl9uYW1lKTtcbiAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cywgXCJvYmplY3RfbmFtZVwiKTtcbiAgaWYgKChyZWxhdGVkX29iamVjdF9uYW1lcyAhPSBudWxsID8gcmVsYXRlZF9vYmplY3RfbmFtZXMubGVuZ3RoIDogdm9pZCAwKSA9PT0gMCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgfVxuICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlKHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0cyk7XG4gIHJldHVybiBfLmZpbHRlcihyZWxhdGVkX29iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0KSB7XG4gICAgdmFyIGFsbG93UmVhZCwgaXNBY3RpdmUsIHJlZiwgcmVsYXRlZF9vYmplY3RfbmFtZTtcbiAgICByZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3Qub2JqZWN0X25hbWU7XG4gICAgaXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTE7XG4gICAgYWxsb3dSZWFkID0gKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5hbGxvd1JlYWQgOiB2b2lkIDA7XG4gICAgcmV0dXJuIGlzQWN0aXZlICYmIGFsbG93UmVhZDtcbiAgfSk7XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3ROYW1lcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIHJlbGF0ZWRfb2JqZWN0cztcbiAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgcmV0dXJuIF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLCBcIm9iamVjdF9uYW1lXCIpO1xufTtcblxuQ3JlYXRvci5nZXRBY3Rpb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgYWN0aW9ucywgZGlzYWJsZWRfYWN0aW9ucywgb2JqLCBwZXJtaXNzaW9ucywgcmVmLCByZWYxO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICBkaXNhYmxlZF9hY3Rpb25zID0gcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucztcbiAgYWN0aW9ucyA9IF8uc29ydEJ5KF8udmFsdWVzKG9iai5hY3Rpb25zKSwgJ3NvcnQnKTtcbiAgaWYgKF8uaGFzKG9iaiwgJ2FsbG93X2N1c3RvbUFjdGlvbnMnKSkge1xuICAgIGFjdGlvbnMgPSBfLmZpbHRlcihhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICAgIHJldHVybiBfLmluY2x1ZGUob2JqLmFsbG93X2N1c3RvbUFjdGlvbnMsIGFjdGlvbi5uYW1lKSB8fCBfLmluY2x1ZGUoXy5rZXlzKENyZWF0b3IuZ2V0T2JqZWN0KCdiYXNlJykuYWN0aW9ucykgfHwge30sIGFjdGlvbi5uYW1lKTtcbiAgICB9KTtcbiAgfVxuICBpZiAoXy5oYXMob2JqLCAnZXhjbHVkZV9hY3Rpb25zJykpIHtcbiAgICBhY3Rpb25zID0gXy5maWx0ZXIoYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgICByZXR1cm4gIV8uaW5jbHVkZShvYmouZXhjbHVkZV9hY3Rpb25zLCBhY3Rpb24ubmFtZSk7XG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgJiYgW1wicmVjb3JkXCIsIFwicmVjb3JkX29ubHlcIl0uaW5kZXhPZihhY3Rpb24ub24pID4gLTEgJiYgYWN0aW9uLm5hbWUgIT09ICdzdGFuZGFyZF9lZGl0Jykge1xuICAgICAgaWYgKGFjdGlvbi5vbiA9PT0gXCJyZWNvcmRfb25seVwiKSB7XG4gICAgICAgIHJldHVybiBhY3Rpb24ub24gPSAncmVjb3JkX29ubHlfbW9yZSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYWN0aW9uLm9uID0gJ3JlY29yZF9tb3JlJztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcImNtc19maWxlc1wiLCBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJdLmluZGV4T2Yob2JqZWN0X25hbWUpID4gLTEpIHtcbiAgICBpZiAoKHJlZiA9IGFjdGlvbnMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5uYW1lID09PSBcInN0YW5kYXJkX2VkaXRcIjtcbiAgICB9KSkgIT0gbnVsbCkge1xuICAgICAgcmVmLm9uID0gXCJyZWNvcmRfbW9yZVwiO1xuICAgIH1cbiAgICBpZiAoKHJlZjEgPSBhY3Rpb25zLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4ubmFtZSA9PT0gXCJkb3dubG9hZFwiO1xuICAgIH0pKSAhPSBudWxsKSB7XG4gICAgICByZWYxLm9uID0gXCJyZWNvcmRcIjtcbiAgICB9XG4gIH1cbiAgYWN0aW9ucyA9IF8uZmlsdGVyKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIHJldHVybiBfLmluZGV4T2YoZGlzYWJsZWRfYWN0aW9ucywgYWN0aW9uLm5hbWUpIDwgMDtcbiAgfSk7XG4gIHJldHVybiBhY3Rpb25zO1xufTtcblxuL+i/lOWbnuW9k+WJjeeUqOaIt+acieadg+mZkOiuv+mXrueahOaJgOaciWxpc3Rfdmlld++8jOWMheaLrOWIhuS6q+eahO+8jOeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahO+8iOmZpOmdnm93bmVy5Y+Y5LqG77yJ77yM5Lul5Y+K6buY6K6k55qE5YW25LuW6KeG5Zu+5rOo5oSPQ3JlYXRvci5nZXRQZXJtaXNzaW9uc+WHveaVsOS4reaYr+S4jeS8muacieeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahOinhuWbvueahO+8jOaJgOS7pUNyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mi7/liLDnmoTnu5PmnpzkuI3lhajvvIzlubbkuI3mmK/lvZPliY3nlKjmiLfog73nnIvliLDmiYDmnInop4blm74vO1xuXG5DcmVhdG9yLmdldExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGRpc2FibGVkX2xpc3Rfdmlld3MsIGlzTW9iaWxlLCBsaXN0X3ZpZXdzLCBvYmplY3QsIHJlZjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZGlzYWJsZWRfbGlzdF92aWV3cyA9ICgocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5kaXNhYmxlZF9saXN0X3ZpZXdzIDogdm9pZCAwKSB8fCBbXTtcbiAgbGlzdF92aWV3cyA9IFtdO1xuICBpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKTtcbiAgXy5lYWNoKG9iamVjdC5saXN0X3ZpZXdzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICBpZiAoaXNNb2JpbGUgJiYgaXRlbS50eXBlID09PSBcImNhbGVuZGFyXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGl0ZW1fbmFtZSAhPT0gXCJkZWZhdWx0XCIpIHtcbiAgICAgIGlmIChfLmluZGV4T2YoZGlzYWJsZWRfbGlzdF92aWV3cywgaXRlbV9uYW1lKSA8IDAgfHwgaXRlbS5vd25lciA9PT0gdXNlcklkKSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXdzLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGxpc3Rfdmlld3M7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGZpZWxkc05hbWUsIHJlZiwgdW5yZWFkYWJsZV9maWVsZHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgZmllbGRzTmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZShvYmplY3RfbmFtZSk7XG4gIHVucmVhZGFibGVfZmllbGRzID0gKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYudW5yZWFkYWJsZV9maWVsZHMgOiB2b2lkIDA7XG4gIHJldHVybiBfLmRpZmZlcmVuY2UoZmllbGRzTmFtZSwgdW5yZWFkYWJsZV9maWVsZHMpO1xufTtcblxuQ3JlYXRvci5pc2xvYWRpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZC5nZXQoKTtcbn07XG5cbkNyZWF0b3IuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0RGlzYWJsZWRGaWVsZHMgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLmRpc2FibGVkICYmICFmaWVsZC5hdXRvZm9ybS5vbWl0ICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRIaWRkZW5GaWVsZHMgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLnR5cGUgPT09IFwiaGlkZGVuXCIgJiYgIWZpZWxkLmF1dG9mb3JtLm9taXQgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhOb0dyb3VwID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBmaWVsZHM7XG4gIGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQsIGZpZWxkTmFtZSkge1xuICAgIHJldHVybiAoIWZpZWxkLmF1dG9mb3JtIHx8ICFmaWVsZC5hdXRvZm9ybS5ncm91cCB8fCBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PT0gXCItXCIpICYmICghZmllbGQuYXV0b2Zvcm0gfHwgZmllbGQuYXV0b2Zvcm0udHlwZSAhPT0gXCJoaWRkZW5cIikgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldFNvcnRlZEZpZWxkR3JvdXBOYW1lcyA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgbmFtZXM7XG4gIG5hbWVzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZC5hdXRvZm9ybSAmJiBmaWVsZC5hdXRvZm9ybS5ncm91cCAhPT0gXCItXCIgJiYgZmllbGQuYXV0b2Zvcm0uZ3JvdXA7XG4gIH0pO1xuICBuYW1lcyA9IF8uY29tcGFjdChuYW1lcyk7XG4gIG5hbWVzID0gXy51bmlxdWUobmFtZXMpO1xuICByZXR1cm4gbmFtZXM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc0Zvckdyb3VwID0gZnVuY3Rpb24oc2NoZW1hLCBncm91cE5hbWUpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLmdyb3VwID09PSBncm91cE5hbWUgJiYgZmllbGQuYXV0b2Zvcm0udHlwZSAhPT0gXCJoaWRkZW5cIiAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aG91dE9taXQgPSBmdW5jdGlvbihzY2hlbWEsIGtleXMpIHtcbiAga2V5cyA9IF8ubWFwKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBmaWVsZCwgcmVmO1xuICAgIGZpZWxkID0gXy5waWNrKHNjaGVtYSwga2V5KTtcbiAgICBpZiAoKHJlZiA9IGZpZWxkW2tleV0uYXV0b2Zvcm0pICE9IG51bGwgPyByZWYub21pdCA6IHZvaWQgMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cbiAgfSk7XG4gIGtleXMgPSBfLmNvbXBhY3Qoa2V5cyk7XG4gIHJldHVybiBrZXlzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNJbkZpcnN0TGV2ZWwgPSBmdW5jdGlvbihmaXJzdExldmVsS2V5cywga2V5cykge1xuICBrZXlzID0gXy5tYXAoa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKF8uaW5kZXhPZihmaXJzdExldmVsS2V5cywga2V5KSA+IC0xKSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcbiAga2V5cyA9IF8uY29tcGFjdChrZXlzKTtcbiAgcmV0dXJuIGtleXM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc0ZvclJlb3JkZXIgPSBmdW5jdGlvbihzY2hlbWEsIGtleXMsIGlzU2luZ2xlKSB7XG4gIHZhciBfa2V5cywgY2hpbGRLZXlzLCBmaWVsZHMsIGksIGlzX3dpZGVfMSwgaXNfd2lkZV8yLCBzY18xLCBzY18yO1xuICBmaWVsZHMgPSBbXTtcbiAgaSA9IDA7XG4gIF9rZXlzID0gXy5maWx0ZXIoa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuICFrZXkuZW5kc1dpdGgoJ19lbmRMaW5lJyk7XG4gIH0pO1xuICB3aGlsZSAoaSA8IF9rZXlzLmxlbmd0aCkge1xuICAgIHNjXzEgPSBfLnBpY2soc2NoZW1hLCBfa2V5c1tpXSk7XG4gICAgc2NfMiA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2kgKyAxXSk7XG4gICAgaXNfd2lkZV8xID0gZmFsc2U7XG4gICAgaXNfd2lkZV8yID0gZmFsc2U7XG4gICAgXy5lYWNoKHNjXzEsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCgocmVmID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYuaXNfd2lkZSA6IHZvaWQgMCkgfHwgKChyZWYxID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLnR5cGUgOiB2b2lkIDApID09PSBcInRhYmxlXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzX3dpZGVfMSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgXy5lYWNoKHNjXzIsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCgocmVmID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYuaXNfd2lkZSA6IHZvaWQgMCkgfHwgKChyZWYxID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLnR5cGUgOiB2b2lkIDApID09PSBcInRhYmxlXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzX3dpZGVfMiA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgaXNfd2lkZV8xID0gdHJ1ZTtcbiAgICAgIGlzX3dpZGVfMiA9IHRydWU7XG4gICAgfVxuICAgIGlmIChpc1NpbmdsZSkge1xuICAgICAgZmllbGRzLnB1c2goX2tleXMuc2xpY2UoaSwgaSArIDEpKTtcbiAgICAgIGkgKz0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzX3dpZGVfMSkge1xuICAgICAgICBmaWVsZHMucHVzaChfa2V5cy5zbGljZShpLCBpICsgMSkpO1xuICAgICAgICBpICs9IDE7XG4gICAgICB9IGVsc2UgaWYgKCFpc193aWRlXzEgJiYgaXNfd2lkZV8yKSB7XG4gICAgICAgIGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkgKyAxKTtcbiAgICAgICAgY2hpbGRLZXlzLnB1c2godm9pZCAwKTtcbiAgICAgICAgZmllbGRzLnB1c2goY2hpbGRLZXlzKTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgfSBlbHNlIGlmICghaXNfd2lkZV8xICYmICFpc193aWRlXzIpIHtcbiAgICAgICAgY2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSArIDEpO1xuICAgICAgICBpZiAoX2tleXNbaSArIDFdKSB7XG4gICAgICAgICAgY2hpbGRLZXlzLnB1c2goX2tleXNbaSArIDFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGlsZEtleXMucHVzaCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICAgIGZpZWxkcy5wdXNoKGNoaWxkS2V5cyk7XG4gICAgICAgIGkgKz0gMjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuaXNGaWx0ZXJWYWx1ZUVtcHR5ID0gZnVuY3Rpb24odikge1xuICByZXR1cm4gdHlwZW9mIHYgPT09IFwidW5kZWZpbmVkXCIgfHwgdiA9PT0gbnVsbCB8fCBOdW1iZXIuaXNOYU4odikgfHwgdi5sZW5ndGggPT09IDA7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGF0YVR5cGUgPSBmdW5jdGlvbihvYmplY3RGaWVsZHMsIGtleSkge1xuICB2YXIgcmVmLCByZXN1bHQ7XG4gIGlmIChvYmplY3RGaWVsZHMgJiYga2V5KSB7XG4gICAgcmVzdWx0ID0gKHJlZiA9IG9iamVjdEZpZWxkc1trZXldKSAhPSBudWxsID8gcmVmLnR5cGUgOiB2b2lkIDA7XG4gICAgaWYgKFtcImZvcm11bGFcIiwgXCJzdW1tYXJ5XCJdLmluZGV4T2YocmVzdWx0KSA+IC0xKSB7XG4gICAgICByZXN1bHQgPSBvYmplY3RGaWVsZHNba2V5XS5kYXRhX3R5cGU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwidGV4dFwiO1xuICB9XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3IuZ2V0QWxsUmVsYXRlZE9iamVjdHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgIHZhciByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdO1xuICAgIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICAgIGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSkge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoKHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpLmVuYWJsZV9maWxlcykge1xuICAgICAgcmVsYXRlZF9vYmplY3RfbmFtZXMucHVzaChcImNtc19maWxlc1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3MuZm9ybWF0SW5kZXggPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciBpbmRleE5hbWUsIGlzZG9jdW1lbnREQiwgb2JqZWN0LCByZWYsIHJlZjEsIHJlZjI7XG4gICAgb2JqZWN0ID0ge1xuICAgICAgYmFja2dyb3VuZDogdHJ1ZVxuICAgIH07XG4gICAgaXNkb2N1bWVudERCID0gKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMSA9IHJlZi5kYXRhc291cmNlcykgIT0gbnVsbCA/IChyZWYyID0gcmVmMVtcImRlZmF1bHRcIl0pICE9IG51bGwgPyByZWYyLmRvY3VtZW50REIgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDApIHx8IGZhbHNlO1xuICAgIGlmIChpc2RvY3VtZW50REIpIHtcbiAgICAgIGlmIChhcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGluZGV4TmFtZSA9IGFycmF5LmpvaW4oXCIuXCIpO1xuICAgICAgICBvYmplY3QubmFtZSA9IGluZGV4TmFtZTtcbiAgICAgICAgaWYgKGluZGV4TmFtZS5sZW5ndGggPiA1Mikge1xuICAgICAgICAgIG9iamVjdC5uYW1lID0gaW5kZXhOYW1lLnN1YnN0cmluZygwLCA1Mik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cbiIsIkNyZWF0b3IuYXBwc0J5TmFtZSA9IHt9XHJcblxyXG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlX2lkKS0+XHJcblx0XHRpZiAhdGhpcy51c2VySWRcclxuXHRcdFx0cmV0dXJuIG51bGxcclxuXHJcblx0XHRpZiBvYmplY3RfbmFtZSA9PSBcIm9iamVjdF9yZWNlbnRfdmlld2VkXCJcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRpZiBvYmplY3RfbmFtZSBhbmQgcmVjb3JkX2lkXHJcblx0XHRcdGlmICFzcGFjZV9pZFxyXG5cdFx0XHRcdGRvYyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZE9uZSh7X2lkOiByZWNvcmRfaWR9LCB7ZmllbGRzOiB7c3BhY2U6IDF9fSlcclxuXHRcdFx0XHRzcGFjZV9pZCA9IGRvYz8uc3BhY2VcclxuXHJcblx0XHRcdGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9yZWNlbnRfdmlld2VkXCIpXHJcblx0XHRcdGZpbHRlcnMgPSB7IG93bmVyOiB0aGlzLnVzZXJJZCwgc3BhY2U6IHNwYWNlX2lkLCAncmVjb3JkLm8nOiBvYmplY3RfbmFtZSwgJ3JlY29yZC5pZHMnOiBbcmVjb3JkX2lkXX1cclxuXHRcdFx0Y3VycmVudF9yZWNlbnRfdmlld2VkID0gY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLmZpbmRPbmUoZmlsdGVycylcclxuXHRcdFx0aWYgY3VycmVudF9yZWNlbnRfdmlld2VkXHJcblx0XHRcdFx0Y29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLnVwZGF0ZShcclxuXHRcdFx0XHRcdGN1cnJlbnRfcmVjZW50X3ZpZXdlZC5faWQsXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdCRpbmM6IHtcclxuXHRcdFx0XHRcdFx0XHRjb3VudDogMVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWQ6IG5ldyBEYXRlKClcclxuXHRcdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogdGhpcy51c2VySWRcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5pbnNlcnQoXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdF9pZDogY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLl9tYWtlTmV3SUQoKVxyXG5cdFx0XHRcdFx0XHRvd25lcjogdGhpcy51c2VySWRcclxuXHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkXHJcblx0XHRcdFx0XHRcdHJlY29yZDoge286IG9iamVjdF9uYW1lLCBpZHM6IFtyZWNvcmRfaWRdfVxyXG5cdFx0XHRcdFx0XHRjb3VudDogMVxyXG5cdFx0XHRcdFx0XHRjcmVhdGVkOiBuZXcgRGF0ZSgpXHJcblx0XHRcdFx0XHRcdGNyZWF0ZWRfYnk6IHRoaXMudXNlcklkXHJcblx0XHRcdFx0XHRcdG1vZGlmaWVkOiBuZXcgRGF0ZSgpXHJcblx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdClcclxuXHRcdFx0cmV0dXJuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBcIm9iamVjdF9yZWNlbnRfdmlld2VkXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlX2lkKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZCwgY3VycmVudF9yZWNlbnRfdmlld2VkLCBkb2MsIGZpbHRlcnM7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChvYmplY3RfbmFtZSAmJiByZWNvcmRfaWQpIHtcbiAgICAgIGlmICghc3BhY2VfaWQpIHtcbiAgICAgICAgZG9jID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kT25lKHtcbiAgICAgICAgICBfaWQ6IHJlY29yZF9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBzcGFjZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHNwYWNlX2lkID0gZG9jICE9IG51bGwgPyBkb2Muc3BhY2UgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgICBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiKTtcbiAgICAgIGZpbHRlcnMgPSB7XG4gICAgICAgIG93bmVyOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAncmVjb3JkLm8nOiBvYmplY3RfbmFtZSxcbiAgICAgICAgJ3JlY29yZC5pZHMnOiBbcmVjb3JkX2lkXVxuICAgICAgfTtcbiAgICAgIGN1cnJlbnRfcmVjZW50X3ZpZXdlZCA9IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5maW5kT25lKGZpbHRlcnMpO1xuICAgICAgaWYgKGN1cnJlbnRfcmVjZW50X3ZpZXdlZCkge1xuICAgICAgICBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQudXBkYXRlKGN1cnJlbnRfcmVjZW50X3ZpZXdlZC5faWQsIHtcbiAgICAgICAgICAkaW5jOiB7XG4gICAgICAgICAgICBjb3VudDogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgbW9kaWZpZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBtb2RpZmllZF9ieTogdGhpcy51c2VySWRcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLmluc2VydCh7XG4gICAgICAgICAgX2lkOiBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuX21ha2VOZXdJRCgpLFxuICAgICAgICAgIG93bmVyOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgcmVjb3JkOiB7XG4gICAgICAgICAgICBvOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGlkczogW3JlY29yZF9pZF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvdW50OiAxLFxuICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgY3JlYXRlZF9ieTogdGhpcy51c2VySWQsXG4gICAgICAgICAgbW9kaWZpZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG4iLCJyZWNlbnRfYWdncmVnYXRlID0gKGNyZWF0ZWRfYnksIHNwYWNlSWQsIF9yZWNvcmRzLCBjYWxsYmFjayktPlxyXG5cdENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3JlY2VudF92aWV3ZWQucmF3Q29sbGVjdGlvbigpLmFnZ3JlZ2F0ZShbXHJcblx0XHR7JG1hdGNoOiB7Y3JlYXRlZF9ieTogY3JlYXRlZF9ieSwgc3BhY2U6IHNwYWNlSWR9fSxcclxuXHRcdHskZ3JvdXA6IHtfaWQ6IHtvYmplY3RfbmFtZTogXCIkcmVjb3JkLm9cIiwgcmVjb3JkX2lkOiBcIiRyZWNvcmQuaWRzXCIsIHNwYWNlOiBcIiRzcGFjZVwifSwgbWF4Q3JlYXRlZDogeyRtYXg6IFwiJGNyZWF0ZWRcIn19fSxcclxuXHRcdHskc29ydDoge21heENyZWF0ZWQ6IC0xfX0sXHJcblx0XHR7JGxpbWl0OiAxMH1cclxuXHRdKS50b0FycmF5IChlcnIsIGRhdGEpLT5cclxuXHRcdGlmIGVyclxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyKVxyXG5cclxuXHRcdGRhdGEuZm9yRWFjaCAoZG9jKSAtPlxyXG5cdFx0XHRfcmVjb3Jkcy5wdXNoIGRvYy5faWRcclxuXHJcblx0XHRpZiBjYWxsYmFjayAmJiBfLmlzRnVuY3Rpb24oY2FsbGJhY2spXHJcblx0XHRcdGNhbGxiYWNrKClcclxuXHJcblx0XHRyZXR1cm5cclxuXHJcbmFzeW5jX3JlY2VudF9hZ2dyZWdhdGUgPSBNZXRlb3Iud3JhcEFzeW5jKHJlY2VudF9hZ2dyZWdhdGUpXHJcblxyXG5zZWFyY2hfb2JqZWN0ID0gKHNwYWNlLCBvYmplY3RfbmFtZSx1c2VySWQsIHNlYXJjaFRleHQpLT5cclxuXHRkYXRhID0gbmV3IEFycmF5KClcclxuXHJcblx0aWYgc2VhcmNoVGV4dFxyXG5cclxuXHRcdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHJcblx0XHRfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpXHJcblx0XHRfb2JqZWN0X25hbWVfa2V5ID0gX29iamVjdD8uTkFNRV9GSUVMRF9LRVlcclxuXHRcdGlmIF9vYmplY3QgJiYgX29iamVjdF9jb2xsZWN0aW9uICYmIF9vYmplY3RfbmFtZV9rZXlcclxuXHRcdFx0cXVlcnkgPSB7fVxyXG5cdFx0XHRzZWFyY2hfS2V5d29yZHMgPSBzZWFyY2hUZXh0LnNwbGl0KFwiIFwiKVxyXG5cdFx0XHRxdWVyeV9hbmQgPSBbXVxyXG5cdFx0XHRzZWFyY2hfS2V5d29yZHMuZm9yRWFjaCAoa2V5d29yZCktPlxyXG5cdFx0XHRcdHN1YnF1ZXJ5ID0ge31cclxuXHRcdFx0XHRzdWJxdWVyeVtfb2JqZWN0X25hbWVfa2V5XSA9IHskcmVnZXg6IGtleXdvcmQudHJpbSgpfVxyXG5cdFx0XHRcdHF1ZXJ5X2FuZC5wdXNoIHN1YnF1ZXJ5XHJcblxyXG5cdFx0XHRxdWVyeS4kYW5kID0gcXVlcnlfYW5kXHJcblx0XHRcdHF1ZXJ5LnNwYWNlID0geyRpbjogW3NwYWNlXX1cclxuXHJcblx0XHRcdGZpZWxkcyA9IHtfaWQ6IDF9XHJcblx0XHRcdGZpZWxkc1tfb2JqZWN0X25hbWVfa2V5XSA9IDFcclxuXHJcblx0XHRcdHJlY29yZHMgPSBfb2JqZWN0X2NvbGxlY3Rpb24uZmluZChxdWVyeSwge2ZpZWxkczogZmllbGRzLCBzb3J0OiB7bW9kaWZpZWQ6IDF9LCBsaW1pdDogNX0pXHJcblxyXG5cdFx0XHRyZWNvcmRzLmZvckVhY2ggKHJlY29yZCktPlxyXG5cdFx0XHRcdGRhdGEucHVzaCB7X2lkOiByZWNvcmQuX2lkLCBfbmFtZTogcmVjb3JkW19vYmplY3RfbmFtZV9rZXldLCBfb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lfVxyXG5cdFxyXG5cdHJldHVybiBkYXRhXHJcblxyXG5NZXRlb3IubWV0aG9kc1xyXG5cdCdvYmplY3RfcmVjZW50X3JlY29yZCc6IChzcGFjZUlkKS0+XHJcblx0XHRkYXRhID0gbmV3IEFycmF5KClcclxuXHRcdHJlY29yZHMgPSBuZXcgQXJyYXkoKVxyXG5cdFx0YXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSh0aGlzLnVzZXJJZCwgc3BhY2VJZCwgcmVjb3JkcylcclxuXHRcdHJlY29yZHMuZm9yRWFjaCAoaXRlbSktPlxyXG5cdFx0XHRyZWNvcmRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSlcclxuXHJcblx0XHRcdGlmICFyZWNvcmRfb2JqZWN0XHJcblx0XHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0XHRyZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSlcclxuXHJcblx0XHRcdGlmIHJlY29yZF9vYmplY3QgJiYgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uXHJcblx0XHRcdFx0ZmllbGRzID0ge19pZDogMX1cclxuXHJcblx0XHRcdFx0ZmllbGRzW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldID0gMVxyXG5cclxuXHRcdFx0XHRyZWNvcmQgPSByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24uZmluZE9uZShpdGVtLnJlY29yZF9pZFswXSwge2ZpZWxkczogZmllbGRzfSlcclxuXHRcdFx0XHRpZiByZWNvcmRcclxuXHRcdFx0XHRcdGRhdGEucHVzaCB7X2lkOiByZWNvcmQuX2lkLCBfbmFtZTogcmVjb3JkW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldLCBfb2JqZWN0X25hbWU6IGl0ZW0ub2JqZWN0X25hbWV9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGFcclxuXHJcblx0J29iamVjdF9yZWNvcmRfc2VhcmNoJzogKG9wdGlvbnMpLT5cclxuXHRcdHNlbGYgPSB0aGlzXHJcblxyXG5cdFx0ZGF0YSA9IG5ldyBBcnJheSgpXHJcblxyXG5cdFx0c2VhcmNoVGV4dCA9IG9wdGlvbnMuc2VhcmNoVGV4dFxyXG5cdFx0c3BhY2UgPSBvcHRpb25zLnNwYWNlXHJcblxyXG5cdFx0Xy5mb3JFYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKF9vYmplY3QsIG5hbWUpLT5cclxuXHRcdFx0aWYgX29iamVjdC5lbmFibGVfc2VhcmNoXHJcblx0XHRcdFx0b2JqZWN0X3JlY29yZCA9IHNlYXJjaF9vYmplY3Qoc3BhY2UsIF9vYmplY3QubmFtZSwgc2VsZi51c2VySWQsIHNlYXJjaFRleHQpXHJcblx0XHRcdFx0ZGF0YSA9IGRhdGEuY29uY2F0KG9iamVjdF9yZWNvcmQpXHJcblxyXG5cdFx0cmV0dXJuIGRhdGFcclxuIiwidmFyIGFzeW5jX3JlY2VudF9hZ2dyZWdhdGUsIHJlY2VudF9hZ2dyZWdhdGUsIHNlYXJjaF9vYmplY3Q7XG5cbnJlY2VudF9hZ2dyZWdhdGUgPSBmdW5jdGlvbihjcmVhdGVkX2J5LCBzcGFjZUlkLCBfcmVjb3JkcywgY2FsbGJhY2spIHtcbiAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3JlY2VudF92aWV3ZWQucmF3Q29sbGVjdGlvbigpLmFnZ3JlZ2F0ZShbXG4gICAge1xuICAgICAgJG1hdGNoOiB7XG4gICAgICAgIGNyZWF0ZWRfYnk6IGNyZWF0ZWRfYnksXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgJGdyb3VwOiB7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBcIiRyZWNvcmQub1wiLFxuICAgICAgICAgIHJlY29yZF9pZDogXCIkcmVjb3JkLmlkc1wiLFxuICAgICAgICAgIHNwYWNlOiBcIiRzcGFjZVwiXG4gICAgICAgIH0sXG4gICAgICAgIG1heENyZWF0ZWQ6IHtcbiAgICAgICAgICAkbWF4OiBcIiRjcmVhdGVkXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgICRzb3J0OiB7XG4gICAgICAgIG1heENyZWF0ZWQ6IC0xXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgJGxpbWl0OiAxMFxuICAgIH1cbiAgXSkudG9BcnJheShmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyKTtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGRvYykge1xuICAgICAgcmV0dXJuIF9yZWNvcmRzLnB1c2goZG9jLl9pZCk7XG4gICAgfSk7XG4gICAgaWYgKGNhbGxiYWNrICYmIF8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9KTtcbn07XG5cbmFzeW5jX3JlY2VudF9hZ2dyZWdhdGUgPSBNZXRlb3Iud3JhcEFzeW5jKHJlY2VudF9hZ2dyZWdhdGUpO1xuXG5zZWFyY2hfb2JqZWN0ID0gZnVuY3Rpb24oc3BhY2UsIG9iamVjdF9uYW1lLCB1c2VySWQsIHNlYXJjaFRleHQpIHtcbiAgdmFyIF9vYmplY3QsIF9vYmplY3RfY29sbGVjdGlvbiwgX29iamVjdF9uYW1lX2tleSwgZGF0YSwgZmllbGRzLCBxdWVyeSwgcXVlcnlfYW5kLCByZWNvcmRzLCBzZWFyY2hfS2V5d29yZHM7XG4gIGRhdGEgPSBuZXcgQXJyYXkoKTtcbiAgaWYgKHNlYXJjaFRleHQpIHtcbiAgICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIF9vYmplY3RfY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSk7XG4gICAgX29iamVjdF9uYW1lX2tleSA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuTkFNRV9GSUVMRF9LRVkgOiB2b2lkIDA7XG4gICAgaWYgKF9vYmplY3QgJiYgX29iamVjdF9jb2xsZWN0aW9uICYmIF9vYmplY3RfbmFtZV9rZXkpIHtcbiAgICAgIHF1ZXJ5ID0ge307XG4gICAgICBzZWFyY2hfS2V5d29yZHMgPSBzZWFyY2hUZXh0LnNwbGl0KFwiIFwiKTtcbiAgICAgIHF1ZXJ5X2FuZCA9IFtdO1xuICAgICAgc2VhcmNoX0tleXdvcmRzLmZvckVhY2goZnVuY3Rpb24oa2V5d29yZCkge1xuICAgICAgICB2YXIgc3VicXVlcnk7XG4gICAgICAgIHN1YnF1ZXJ5ID0ge307XG4gICAgICAgIHN1YnF1ZXJ5W19vYmplY3RfbmFtZV9rZXldID0ge1xuICAgICAgICAgICRyZWdleDoga2V5d29yZC50cmltKClcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHF1ZXJ5X2FuZC5wdXNoKHN1YnF1ZXJ5KTtcbiAgICAgIH0pO1xuICAgICAgcXVlcnkuJGFuZCA9IHF1ZXJ5X2FuZDtcbiAgICAgIHF1ZXJ5LnNwYWNlID0ge1xuICAgICAgICAkaW46IFtzcGFjZV1cbiAgICAgIH07XG4gICAgICBmaWVsZHMgPSB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfTtcbiAgICAgIGZpZWxkc1tfb2JqZWN0X25hbWVfa2V5XSA9IDE7XG4gICAgICByZWNvcmRzID0gX29iamVjdF9jb2xsZWN0aW9uLmZpbmQocXVlcnksIHtcbiAgICAgICAgZmllbGRzOiBmaWVsZHMsXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBtb2RpZmllZDogMVxuICAgICAgICB9LFxuICAgICAgICBsaW1pdDogNVxuICAgICAgfSk7XG4gICAgICByZWNvcmRzLmZvckVhY2goZnVuY3Rpb24ocmVjb3JkKSB7XG4gICAgICAgIHJldHVybiBkYXRhLnB1c2goe1xuICAgICAgICAgIF9pZDogcmVjb3JkLl9pZCxcbiAgICAgICAgICBfbmFtZTogcmVjb3JkW19vYmplY3RfbmFtZV9rZXldLFxuICAgICAgICAgIF9vYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gICdvYmplY3RfcmVjZW50X3JlY29yZCc6IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgZGF0YSwgcmVjb3JkcztcbiAgICBkYXRhID0gbmV3IEFycmF5KCk7XG4gICAgcmVjb3JkcyA9IG5ldyBBcnJheSgpO1xuICAgIGFzeW5jX3JlY2VudF9hZ2dyZWdhdGUodGhpcy51c2VySWQsIHNwYWNlSWQsIHJlY29yZHMpO1xuICAgIHJlY29yZHMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICB2YXIgZmllbGRzLCByZWNvcmQsIHJlY29yZF9vYmplY3QsIHJlY29yZF9vYmplY3RfY29sbGVjdGlvbjtcbiAgICAgIHJlY29yZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChpdGVtLm9iamVjdF9uYW1lLCBpdGVtLnNwYWNlKTtcbiAgICAgIGlmICghcmVjb3JkX29iamVjdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSk7XG4gICAgICBpZiAocmVjb3JkX29iamVjdCAmJiByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24pIHtcbiAgICAgICAgZmllbGRzID0ge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9O1xuICAgICAgICBmaWVsZHNbcmVjb3JkX29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gPSAxO1xuICAgICAgICByZWNvcmQgPSByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24uZmluZE9uZShpdGVtLnJlY29yZF9pZFswXSwge1xuICAgICAgICAgIGZpZWxkczogZmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGEucHVzaCh7XG4gICAgICAgICAgICBfaWQ6IHJlY29yZC5faWQsXG4gICAgICAgICAgICBfbmFtZTogcmVjb3JkW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldLFxuICAgICAgICAgICAgX29iamVjdF9uYW1lOiBpdGVtLm9iamVjdF9uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfSxcbiAgJ29iamVjdF9yZWNvcmRfc2VhcmNoJzogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBkYXRhLCBzZWFyY2hUZXh0LCBzZWxmLCBzcGFjZTtcbiAgICBzZWxmID0gdGhpcztcbiAgICBkYXRhID0gbmV3IEFycmF5KCk7XG4gICAgc2VhcmNoVGV4dCA9IG9wdGlvbnMuc2VhcmNoVGV4dDtcbiAgICBzcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gICAgXy5mb3JFYWNoKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgZnVuY3Rpb24oX29iamVjdCwgbmFtZSkge1xuICAgICAgdmFyIG9iamVjdF9yZWNvcmQ7XG4gICAgICBpZiAoX29iamVjdC5lbmFibGVfc2VhcmNoKSB7XG4gICAgICAgIG9iamVjdF9yZWNvcmQgPSBzZWFyY2hfb2JqZWN0KHNwYWNlLCBfb2JqZWN0Lm5hbWUsIHNlbGYudXNlcklkLCBzZWFyY2hUZXh0KTtcbiAgICAgICAgcmV0dXJuIGRhdGEgPSBkYXRhLmNvbmNhdChvYmplY3RfcmVjb3JkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG4gICAgdXBkYXRlX2ZpbHRlcnM6IChsaXN0dmlld19pZCwgZmlsdGVycywgZmlsdGVyX3Njb3BlLCBmaWx0ZXJfbG9naWMpLT5cclxuICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MuZGlyZWN0LnVwZGF0ZSh7X2lkOiBsaXN0dmlld19pZH0sIHskc2V0OiB7ZmlsdGVyczogZmlsdGVycywgZmlsdGVyX3Njb3BlOiBmaWx0ZXJfc2NvcGUsIGZpbHRlcl9sb2dpYzogZmlsdGVyX2xvZ2ljfX0pXHJcblxyXG4gICAgdXBkYXRlX2NvbHVtbnM6IChsaXN0dmlld19pZCwgY29sdW1ucyktPlxyXG4gICAgICAgIGNoZWNrKGNvbHVtbnMsIEFycmF5KVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIGNvbHVtbnMubGVuZ3RoIDwgMVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMCwgXCJTZWxlY3QgYXQgbGVhc3Qgb25lIGZpZWxkIHRvIGRpc3BsYXlcIlxyXG4gICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy51cGRhdGUoe19pZDogbGlzdHZpZXdfaWR9LCB7JHNldDoge2NvbHVtbnM6IGNvbHVtbnN9fSlcclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICB1cGRhdGVfZmlsdGVyczogZnVuY3Rpb24obGlzdHZpZXdfaWQsIGZpbHRlcnMsIGZpbHRlcl9zY29wZSwgZmlsdGVyX2xvZ2ljKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogbGlzdHZpZXdfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGZpbHRlcnM6IGZpbHRlcnMsXG4gICAgICAgIGZpbHRlcl9zY29wZTogZmlsdGVyX3Njb3BlLFxuICAgICAgICBmaWx0ZXJfbG9naWM6IGZpbHRlcl9sb2dpY1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICB1cGRhdGVfY29sdW1uczogZnVuY3Rpb24obGlzdHZpZXdfaWQsIGNvbHVtbnMpIHtcbiAgICBjaGVjayhjb2x1bW5zLCBBcnJheSk7XG4gICAgaWYgKGNvbHVtbnMubGVuZ3RoIDwgMSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwiU2VsZWN0IGF0IGxlYXN0IG9uZSBmaWVsZCB0byBkaXNwbGF5XCIpO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfbGlzdHZpZXdzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IGxpc3R2aWV3X2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHQncmVwb3J0X2RhdGEnOiAob3B0aW9ucyktPlxyXG5cdFx0Y2hlY2sob3B0aW9ucywgT2JqZWN0KVxyXG5cdFx0c3BhY2UgPSBvcHRpb25zLnNwYWNlXHJcblx0XHRmaWVsZHMgPSBvcHRpb25zLmZpZWxkc1xyXG5cdFx0b2JqZWN0X25hbWUgPSBvcHRpb25zLm9iamVjdF9uYW1lXHJcblx0XHRmaWx0ZXJfc2NvcGUgPSBvcHRpb25zLmZpbHRlcl9zY29wZVxyXG5cdFx0ZmlsdGVycyA9IG9wdGlvbnMuZmlsdGVyc1xyXG5cdFx0ZmlsdGVyRmllbGRzID0ge31cclxuXHRcdGNvbXBvdW5kRmllbGRzID0gW11cclxuXHRcdG9iamVjdEZpZWxkcyA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKT8uZmllbGRzXHJcblx0XHRfLmVhY2ggZmllbGRzLCAoaXRlbSwgaW5kZXgpLT5cclxuXHRcdFx0c3BsaXRzID0gaXRlbS5zcGxpdChcIi5cIilcclxuXHRcdFx0bmFtZSA9IHNwbGl0c1swXVxyXG5cdFx0XHRvYmplY3RGaWVsZCA9IG9iamVjdEZpZWxkc1tuYW1lXVxyXG5cdFx0XHRpZiBzcGxpdHMubGVuZ3RoID4gMSBhbmQgb2JqZWN0RmllbGRcclxuXHRcdFx0XHRjaGlsZEtleSA9IGl0ZW0ucmVwbGFjZSBuYW1lICsgXCIuXCIsIFwiXCJcclxuXHRcdFx0XHRjb21wb3VuZEZpZWxkcy5wdXNoKHtuYW1lOiBuYW1lLCBjaGlsZEtleTogY2hpbGRLZXksIGZpZWxkOiBvYmplY3RGaWVsZH0pXHJcblx0XHRcdGZpbHRlckZpZWxkc1tuYW1lXSA9IDFcclxuXHJcblx0XHRzZWxlY3RvciA9IHt9XHJcblx0XHR1c2VySWQgPSB0aGlzLnVzZXJJZFxyXG5cdFx0c2VsZWN0b3Iuc3BhY2UgPSBzcGFjZVxyXG5cdFx0aWYgZmlsdGVyX3Njb3BlID09IFwic3BhY2V4XCJcclxuXHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSBcclxuXHRcdFx0XHQkaW46IFtudWxsLHNwYWNlXVxyXG5cdFx0ZWxzZSBpZiBmaWx0ZXJfc2NvcGUgPT0gXCJtaW5lXCJcclxuXHRcdFx0c2VsZWN0b3Iub3duZXIgPSB1c2VySWRcclxuXHJcblx0XHRpZiBDcmVhdG9yLmlzQ29tbW9uU3BhY2Uoc3BhY2UpICYmIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlLCBAdXNlcklkKVxyXG5cdFx0XHRkZWxldGUgc2VsZWN0b3Iuc3BhY2VcclxuXHJcblx0XHRpZiBmaWx0ZXJzIGFuZCBmaWx0ZXJzLmxlbmd0aCA+IDBcclxuXHRcdFx0c2VsZWN0b3JbXCIkYW5kXCJdID0gZmlsdGVyc1xyXG5cclxuXHRcdGN1cnNvciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvciwge2ZpZWxkczogZmlsdGVyRmllbGRzLCBza2lwOiAwLCBsaW1pdDogMTAwMDB9KVxyXG4jXHRcdGlmIGN1cnNvci5jb3VudCgpID4gMTAwMDBcclxuI1x0XHRcdHJldHVybiBbXVxyXG5cdFx0cmVzdWx0ID0gY3Vyc29yLmZldGNoKClcclxuXHRcdGlmIGNvbXBvdW5kRmllbGRzLmxlbmd0aFxyXG5cdFx0XHRyZXN1bHQgPSByZXN1bHQubWFwIChpdGVtLGluZGV4KS0+XHJcblx0XHRcdFx0Xy5lYWNoIGNvbXBvdW5kRmllbGRzLCAoY29tcG91bmRGaWVsZEl0ZW0sIGluZGV4KS0+XHJcblx0XHRcdFx0XHRpdGVtS2V5ID0gY29tcG91bmRGaWVsZEl0ZW0ubmFtZSArIFwiKiUqXCIgKyBjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleS5yZXBsYWNlKC9cXC4vZywgXCIqJSpcIilcclxuXHRcdFx0XHRcdGl0ZW1WYWx1ZSA9IGl0ZW1bY29tcG91bmRGaWVsZEl0ZW0ubmFtZV1cclxuXHRcdFx0XHRcdHR5cGUgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC50eXBlXHJcblx0XHRcdFx0XHRpZiBbXCJsb29rdXBcIiwgXCJtYXN0ZXJfZGV0YWlsXCJdLmluZGV4T2YodHlwZSkgPiAtMVxyXG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5yZWZlcmVuY2VfdG9cclxuXHRcdFx0XHRcdFx0Y29tcG91bmRGaWx0ZXJGaWVsZHMgPSB7fVxyXG5cdFx0XHRcdFx0XHRjb21wb3VuZEZpbHRlckZpZWxkc1tjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV0gPSAxXHJcblx0XHRcdFx0XHRcdHJlZmVyZW5jZUl0ZW0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvKS5maW5kT25lIHtfaWQ6IGl0ZW1WYWx1ZX0sIGZpZWxkczogY29tcG91bmRGaWx0ZXJGaWVsZHNcclxuXHRcdFx0XHRcdFx0aWYgcmVmZXJlbmNlSXRlbVxyXG5cdFx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSByZWZlcmVuY2VJdGVtW2NvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5XVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiB0eXBlID09IFwic2VsZWN0XCJcclxuXHRcdFx0XHRcdFx0b3B0aW9ucyA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLm9wdGlvbnNcclxuXHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IF8uZmluZFdoZXJlKG9wdGlvbnMsIHt2YWx1ZTogaXRlbVZhbHVlfSk/LmxhYmVsIG9yIGl0ZW1WYWx1ZVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gaXRlbVZhbHVlXHJcblx0XHRcdFx0XHR1bmxlc3MgaXRlbVtpdGVtS2V5XVxyXG5cdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gXCItLVwiXHJcblx0XHRcdFx0cmV0dXJuIGl0ZW1cclxuXHRcdFx0cmV0dXJuIHJlc3VsdFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gcmVzdWx0XHJcblxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gICdyZXBvcnRfZGF0YSc6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY29tcG91bmRGaWVsZHMsIGN1cnNvciwgZmllbGRzLCBmaWx0ZXJGaWVsZHMsIGZpbHRlcl9zY29wZSwgZmlsdGVycywgb2JqZWN0RmllbGRzLCBvYmplY3RfbmFtZSwgcmVmLCByZXN1bHQsIHNlbGVjdG9yLCBzcGFjZSwgdXNlcklkO1xuICAgIGNoZWNrKG9wdGlvbnMsIE9iamVjdCk7XG4gICAgc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICAgIGZpZWxkcyA9IG9wdGlvbnMuZmllbGRzO1xuICAgIG9iamVjdF9uYW1lID0gb3B0aW9ucy5vYmplY3RfbmFtZTtcbiAgICBmaWx0ZXJfc2NvcGUgPSBvcHRpb25zLmZpbHRlcl9zY29wZTtcbiAgICBmaWx0ZXJzID0gb3B0aW9ucy5maWx0ZXJzO1xuICAgIGZpbHRlckZpZWxkcyA9IHt9O1xuICAgIGNvbXBvdW5kRmllbGRzID0gW107XG4gICAgb2JqZWN0RmllbGRzID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDA7XG4gICAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgIHZhciBjaGlsZEtleSwgbmFtZSwgb2JqZWN0RmllbGQsIHNwbGl0cztcbiAgICAgIHNwbGl0cyA9IGl0ZW0uc3BsaXQoXCIuXCIpO1xuICAgICAgbmFtZSA9IHNwbGl0c1swXTtcbiAgICAgIG9iamVjdEZpZWxkID0gb2JqZWN0RmllbGRzW25hbWVdO1xuICAgICAgaWYgKHNwbGl0cy5sZW5ndGggPiAxICYmIG9iamVjdEZpZWxkKSB7XG4gICAgICAgIGNoaWxkS2V5ID0gaXRlbS5yZXBsYWNlKG5hbWUgKyBcIi5cIiwgXCJcIik7XG4gICAgICAgIGNvbXBvdW5kRmllbGRzLnB1c2goe1xuICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgY2hpbGRLZXk6IGNoaWxkS2V5LFxuICAgICAgICAgIGZpZWxkOiBvYmplY3RGaWVsZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmaWx0ZXJGaWVsZHNbbmFtZV0gPSAxO1xuICAgIH0pO1xuICAgIHNlbGVjdG9yID0ge307XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZTtcbiAgICBpZiAoZmlsdGVyX3Njb3BlID09PSBcInNwYWNleFwiKSB7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHtcbiAgICAgICAgJGluOiBbbnVsbCwgc3BhY2VdXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyX3Njb3BlID09PSBcIm1pbmVcIikge1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgfVxuICAgIGlmIChDcmVhdG9yLmlzQ29tbW9uU3BhY2Uoc3BhY2UpICYmIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlLCB0aGlzLnVzZXJJZCkpIHtcbiAgICAgIGRlbGV0ZSBzZWxlY3Rvci5zcGFjZTtcbiAgICB9XG4gICAgaWYgKGZpbHRlcnMgJiYgZmlsdGVycy5sZW5ndGggPiAwKSB7XG4gICAgICBzZWxlY3RvcltcIiRhbmRcIl0gPSBmaWx0ZXJzO1xuICAgIH1cbiAgICBjdXJzb3IgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IsIHtcbiAgICAgIGZpZWxkczogZmlsdGVyRmllbGRzLFxuICAgICAgc2tpcDogMCxcbiAgICAgIGxpbWl0OiAxMDAwMFxuICAgIH0pO1xuICAgIHJlc3VsdCA9IGN1cnNvci5mZXRjaCgpO1xuICAgIGlmIChjb21wb3VuZEZpZWxkcy5sZW5ndGgpIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5tYXAoZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgXy5lYWNoKGNvbXBvdW5kRmllbGRzLCBmdW5jdGlvbihjb21wb3VuZEZpZWxkSXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICB2YXIgY29tcG91bmRGaWx0ZXJGaWVsZHMsIGl0ZW1LZXksIGl0ZW1WYWx1ZSwgcmVmMSwgcmVmZXJlbmNlSXRlbSwgcmVmZXJlbmNlX3RvLCB0eXBlO1xuICAgICAgICAgIGl0ZW1LZXkgPSBjb21wb3VuZEZpZWxkSXRlbS5uYW1lICsgXCIqJSpcIiArIGNvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5LnJlcGxhY2UoL1xcLi9nLCBcIiolKlwiKTtcbiAgICAgICAgICBpdGVtVmFsdWUgPSBpdGVtW2NvbXBvdW5kRmllbGRJdGVtLm5hbWVdO1xuICAgICAgICAgIHR5cGUgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC50eXBlO1xuICAgICAgICAgIGlmIChbXCJsb29rdXBcIiwgXCJtYXN0ZXJfZGV0YWlsXCJdLmluZGV4T2YodHlwZSkgPiAtMSkge1xuICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgY29tcG91bmRGaWx0ZXJGaWVsZHMgPSB7fTtcbiAgICAgICAgICAgIGNvbXBvdW5kRmlsdGVyRmllbGRzW2NvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5XSA9IDE7XG4gICAgICAgICAgICByZWZlcmVuY2VJdGVtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bykuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogaXRlbVZhbHVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczogY29tcG91bmRGaWx0ZXJGaWVsZHNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZUl0ZW0pIHtcbiAgICAgICAgICAgICAgaXRlbVtpdGVtS2V5XSA9IHJlZmVyZW5jZUl0ZW1bY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgICAgICAgb3B0aW9ucyA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLm9wdGlvbnM7XG4gICAgICAgICAgICBpdGVtW2l0ZW1LZXldID0gKChyZWYxID0gXy5maW5kV2hlcmUob3B0aW9ucywge1xuICAgICAgICAgICAgICB2YWx1ZTogaXRlbVZhbHVlXG4gICAgICAgICAgICB9KSkgIT0gbnVsbCA/IHJlZjEubGFiZWwgOiB2b2lkIDApIHx8IGl0ZW1WYWx1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXRlbVtpdGVtS2V5XSA9IGl0ZW1WYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFpdGVtW2l0ZW1LZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbVtpdGVtS2V5XSA9IFwiLS1cIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH1cbn0pO1xuIiwiIyMjXHJcbiAgICB0eXBlOiBcInVzZXJcIlxyXG4gICAgb2JqZWN0X25hbWU6IFwib2JqZWN0X2xpc3R2aWV3c1wiXHJcbiAgICByZWNvcmRfaWQ6IFwie29iamVjdF9uYW1lfSx7bGlzdHZpZXdfaWR9XCJcclxuICAgIHNldHRpbmdzOlxyXG4gICAgICAgIGNvbHVtbl93aWR0aDogeyBmaWVsZF9hOiAxMDAsIGZpZWxkXzI6IDE1MCB9XHJcbiAgICAgICAgc29ydDogW1tcImZpZWxkX2FcIiwgXCJkZXNjXCJdXVxyXG4gICAgb3duZXI6IHt1c2VySWR9XHJcbiMjI1xyXG5cclxuTWV0ZW9yLm1ldGhvZHNcclxuICAgIFwidGFidWxhcl9zb3J0X3NldHRpbmdzXCI6IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBzb3J0KS0+XHJcbiAgICAgICAgdXNlcklkID0gdGhpcy51c2VySWRcclxuICAgICAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsIG93bmVyOiB1c2VySWR9KVxyXG4gICAgICAgIGlmIHNldHRpbmdcclxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LnNvcnRcIjogc29ydH19KVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZG9jID0gXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInVzZXJcIlxyXG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXHJcbiAgICAgICAgICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge31cclxuICAgICAgICAgICAgICAgIG93bmVyOiB1c2VySWRcclxuXHJcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge31cclxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnRcclxuXHJcbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYylcclxuXHJcbiAgICBcInRhYnVsYXJfY29sdW1uX3dpZHRoX3NldHRpbmdzXCI6IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5fd2lkdGgpLT5cclxuICAgICAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxyXG4gICAgICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIiwgb3duZXI6IHVzZXJJZH0pXHJcbiAgICAgICAgaWYgc2V0dGluZ1xyXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uY29sdW1uX3dpZHRoXCI6IGNvbHVtbl93aWR0aH19KVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZG9jID0gXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInVzZXJcIlxyXG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXHJcbiAgICAgICAgICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge31cclxuICAgICAgICAgICAgICAgIG93bmVyOiB1c2VySWRcclxuXHJcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge31cclxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoXHJcblxyXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpXHJcblxyXG4gICAgXCJncmlkX3NldHRpbmdzXCI6IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5fd2lkdGgsIHNvcnQpLT5cclxuICAgICAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxyXG4gICAgICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIiwgb3duZXI6IHVzZXJJZH0pXHJcbiAgICAgICAgaWYgc2V0dGluZ1xyXG4gICAgICAgICAgICAjIOavj+asoemDveW8uuWItuaUueWPmF9pZF9hY3Rpb25z5YiX55qE5a695bqm77yM5Lul6Kej5Yaz5b2T55So5oi35Y+q5pS55Y+Y5a2X5q615qyh5bqP6ICM5rKh5pyJ5pS55Y+Y5Lu75L2V5a2X5q615a695bqm5pe277yM5YmN56uv5rKh5pyJ6K6i6ZiF5Yiw5a2X5q615qyh5bqP5Y+Y5pu055qE5pWw5o2u55qE6Zeu6aKYXHJcbiAgICAgICAgICAgIGNvbHVtbl93aWR0aC5faWRfYWN0aW9ucyA9IGlmIHNldHRpbmcuc2V0dGluZ3NbXCIje2xpc3Rfdmlld19pZH1cIl0/LmNvbHVtbl93aWR0aD8uX2lkX2FjdGlvbnMgPT0gNDYgdGhlbiA0NyBlbHNlIDQ2XHJcbiAgICAgICAgICAgIGlmIHNvcnRcclxuICAgICAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5zb3J0XCI6IHNvcnQsIFwic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LmNvbHVtbl93aWR0aFwiOiBjb2x1bW5fd2lkdGh9fSlcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LmNvbHVtbl93aWR0aFwiOiBjb2x1bW5fd2lkdGh9fSlcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGRvYyA9XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInVzZXJcIlxyXG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXHJcbiAgICAgICAgICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge31cclxuICAgICAgICAgICAgICAgIG93bmVyOiB1c2VySWRcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge31cclxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoXHJcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0XHJcblxyXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpIiwiXG4vKlxuICAgIHR5cGU6IFwidXNlclwiXG4gICAgb2JqZWN0X25hbWU6IFwib2JqZWN0X2xpc3R2aWV3c1wiXG4gICAgcmVjb3JkX2lkOiBcIntvYmplY3RfbmFtZX0se2xpc3R2aWV3X2lkfVwiXG4gICAgc2V0dGluZ3M6XG4gICAgICAgIGNvbHVtbl93aWR0aDogeyBmaWVsZF9hOiAxMDAsIGZpZWxkXzI6IDE1MCB9XG4gICAgICAgIHNvcnQ6IFtbXCJmaWVsZF9hXCIsIFwiZGVzY1wiXV1cbiAgICBvd25lcjoge3VzZXJJZH1cbiAqL1xuTWV0ZW9yLm1ldGhvZHMoe1xuICBcInRhYnVsYXJfc29ydF9zZXR0aW5nc1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBzb3J0KSB7XG4gICAgdmFyIGRvYywgb2JqLCBzZXR0aW5nLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgb3duZXI6IHVzZXJJZFxuICAgIH0pO1xuICAgIGlmIChzZXR0aW5nKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IChcbiAgICAgICAgICBvYmogPSB7fSxcbiAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLnNvcnRcIl0gPSBzb3J0LFxuICAgICAgICAgIG9ialxuICAgICAgICApXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jID0ge1xuICAgICAgICB0eXBlOiBcInVzZXJcIixcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgICBzZXR0aW5nczoge30sXG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH07XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnQ7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH0sXG4gIFwidGFidWxhcl9jb2x1bW5fd2lkdGhfc2V0dGluZ3NcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoKSB7XG4gICAgdmFyIGRvYywgb2JqLCBzZXR0aW5nLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgb3duZXI6IHVzZXJJZFxuICAgIH0pO1xuICAgIGlmIChzZXR0aW5nKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IChcbiAgICAgICAgICBvYmogPSB7fSxcbiAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLmNvbHVtbl93aWR0aFwiXSA9IGNvbHVtbl93aWR0aCxcbiAgICAgICAgICBvYmpcbiAgICAgICAgKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYyA9IHtcbiAgICAgICAgdHlwZTogXCJ1c2VyXCIsXG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgICAgc2V0dGluZ3M6IHt9LFxuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aDtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpO1xuICAgIH1cbiAgfSxcbiAgXCJncmlkX3NldHRpbmdzXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbl93aWR0aCwgc29ydCkge1xuICAgIHZhciBkb2MsIG9iaiwgb2JqMSwgcmVmLCByZWYxLCBzZXR0aW5nLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiLFxuICAgICAgb3duZXI6IHVzZXJJZFxuICAgIH0pO1xuICAgIGlmIChzZXR0aW5nKSB7XG4gICAgICBjb2x1bW5fd2lkdGguX2lkX2FjdGlvbnMgPSAoKHJlZiA9IHNldHRpbmcuc2V0dGluZ3NbXCJcIiArIGxpc3Rfdmlld19pZF0pICE9IG51bGwgPyAocmVmMSA9IHJlZi5jb2x1bW5fd2lkdGgpICE9IG51bGwgPyByZWYxLl9pZF9hY3Rpb25zIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gNDYgPyA0NyA6IDQ2O1xuICAgICAgaWYgKHNvcnQpIHtcbiAgICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgICBvYmogPSB7fSxcbiAgICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuc29ydFwiXSA9IHNvcnQsXG4gICAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLmNvbHVtbl93aWR0aFwiXSA9IGNvbHVtbl93aWR0aCxcbiAgICAgICAgICAgIG9ialxuICAgICAgICAgIClcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IChcbiAgICAgICAgICAgIG9iajEgPSB7fSxcbiAgICAgICAgICAgIG9iajFbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLmNvbHVtbl93aWR0aFwiXSA9IGNvbHVtbl93aWR0aCxcbiAgICAgICAgICAgIG9iajFcbiAgICAgICAgICApXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2MgPSB7XG4gICAgICAgIHR5cGU6IFwidXNlclwiLFxuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCIsXG4gICAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge307XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5jb2x1bW5fd2lkdGggPSBjb2x1bW5fd2lkdGg7XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydDtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpO1xuICAgIH1cbiAgfVxufSk7XG4iLCJ4bWwyanMgPSByZXF1aXJlICd4bWwyanMnXHJcbmZzID0gcmVxdWlyZSAnZnMnXHJcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xyXG5ta2RpcnAgPSByZXF1aXJlICdta2RpcnAnXHJcblxyXG5sb2dnZXIgPSBuZXcgTG9nZ2VyICdFeHBvcnRfVE9fWE1MJ1xyXG5cclxuX3dyaXRlWG1sRmlsZSA9IChqc29uT2JqLG9iak5hbWUpIC0+XHJcblx0IyDovax4bWxcclxuXHRidWlsZGVyID0gbmV3IHhtbDJqcy5CdWlsZGVyKClcclxuXHR4bWwgPSBidWlsZGVyLmJ1aWxkT2JqZWN0IGpzb25PYmpcclxuXHJcblx0IyDovazkuLpidWZmZXJcclxuXHRzdHJlYW0gPSBuZXcgQnVmZmVyIHhtbFxyXG5cclxuXHQjIOagueaNruW9k+WkqeaXtumXtOeahOW5tOaciOaXpeS9nOS4uuWtmOWCqOi3r+W+hFxyXG5cdG5vdyA9IG5ldyBEYXRlXHJcblx0eWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXHJcblx0bW9udGggPSBub3cuZ2V0TW9udGgoKSArIDFcclxuXHRkYXkgPSBub3cuZ2V0RGF0ZSgpXHJcblxyXG5cdCMg5paH5Lu26Lev5b6EXHJcblx0ZmlsZVBhdGggPSBwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCcuLi8uLi8uLi9leHBvcnQvJyArIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGRheSArICcvJyArIG9iak5hbWUgKVxyXG5cdGZpbGVOYW1lID0ganNvbk9iaj8uX2lkICsgXCIueG1sXCJcclxuXHRmaWxlQWRkcmVzcyA9IHBhdGguam9pbiBmaWxlUGF0aCwgZmlsZU5hbWVcclxuXHJcblx0aWYgIWZzLmV4aXN0c1N5bmMgZmlsZVBhdGhcclxuXHRcdG1rZGlycC5zeW5jIGZpbGVQYXRoXHJcblxyXG5cdCMg5YaZ5YWl5paH5Lu2XHJcblx0ZnMud3JpdGVGaWxlIGZpbGVBZGRyZXNzLCBzdHJlYW0sIChlcnIpIC0+XHJcblx0XHRpZiBlcnJcclxuXHRcdFx0bG9nZ2VyLmVycm9yIFwiI3tqc29uT2JqLl9pZH3lhpnlhaV4bWzmlofku7blpLHotKVcIixlcnJcclxuXHRcclxuXHRyZXR1cm4gZmlsZVBhdGhcclxuXHJcblxyXG4jIOaVtOeQhkZpZWxkc+eahGpzb27mlbDmja5cclxuX21peEZpZWxkc0RhdGEgPSAob2JqLG9iak5hbWUpIC0+XHJcblx0IyDliJ3lp4vljJblr7nosaHmlbDmja5cclxuXHRqc29uT2JqID0ge31cclxuXHQjIOiOt+WPlmZpZWxkc1xyXG5cdG9iakZpZWxkcyA9IENyZWF0b3I/LmdldE9iamVjdChvYmpOYW1lKT8uZmllbGRzXHJcblxyXG5cdG1peERlZmF1bHQgPSAoZmllbGRfbmFtZSktPlxyXG5cdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IG9ialtmaWVsZF9uYW1lXSB8fCBcIlwiXHJcblxyXG5cdG1peERhdGUgPSAoZmllbGRfbmFtZSx0eXBlKS0+XHJcblx0XHRkYXRlID0gb2JqW2ZpZWxkX25hbWVdXHJcblx0XHRpZiB0eXBlID09IFwiZGF0ZVwiXHJcblx0XHRcdGZvcm1hdCA9IFwiWVlZWS1NTS1ERFwiXHJcblx0XHRlbHNlXHJcblx0XHRcdGZvcm1hdCA9IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiXHJcblx0XHRpZiBkYXRlPyBhbmQgZm9ybWF0P1xyXG5cdFx0XHRkYXRlU3RyID0gbW9tZW50KGRhdGUpLmZvcm1hdChmb3JtYXQpXHJcblx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gZGF0ZVN0ciB8fCBcIlwiXHJcblxyXG5cdG1peEJvb2wgPSAoZmllbGRfbmFtZSktPlxyXG5cdFx0aWYgb2JqW2ZpZWxkX25hbWVdID09IHRydWVcclxuXHRcdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5pivXCJcclxuXHRcdGVsc2UgaWYgb2JqW2ZpZWxkX25hbWVdID09IGZhbHNlXHJcblx0XHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuWQplwiXHJcblx0XHRlbHNlXHJcblx0XHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIlwiXHJcblxyXG5cdCMg5b6q546v5q+P5LiqZmllbGRzLOW5tuWIpOaWreWPluWAvFxyXG5cdF8uZWFjaCBvYmpGaWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG5cdFx0c3dpdGNoIGZpZWxkPy50eXBlXHJcblx0XHRcdHdoZW4gXCJkYXRlXCIsXCJkYXRldGltZVwiIHRoZW4gbWl4RGF0ZSBmaWVsZF9uYW1lLGZpZWxkLnR5cGVcclxuXHRcdFx0d2hlbiBcImJvb2xlYW5cIiB0aGVuIG1peEJvb2wgZmllbGRfbmFtZVxyXG5cdFx0XHRlbHNlIG1peERlZmF1bHQgZmllbGRfbmFtZVxyXG5cclxuXHRyZXR1cm4ganNvbk9ialxyXG5cclxuIyDojrflj5blrZDooajmlbTnkIbmlbDmja5cclxuX21peFJlbGF0ZWREYXRhID0gKG9iaixvYmpOYW1lKSAtPlxyXG5cdCMg5Yid5aeL5YyW5a+56LGh5pWw5o2uXHJcblx0cmVsYXRlZF9vYmplY3RzID0ge31cclxuXHJcblx0IyDojrflj5bnm7jlhbPooahcclxuXHRyZWxhdGVkT2JqTmFtZXMgPSBDcmVhdG9yPy5nZXRBbGxSZWxhdGVkT2JqZWN0cyBvYmpOYW1lXHJcblxyXG5cdCMg5b6q546v55u45YWz6KGoXHJcblx0cmVsYXRlZE9iak5hbWVzLmZvckVhY2ggKHJlbGF0ZWRPYmpOYW1lKSAtPlxyXG5cdFx0IyDmr4/kuKrooajlrprkuYnkuIDkuKrlr7nosaHmlbDnu4RcclxuXHRcdHJlbGF0ZWRUYWJsZURhdGEgPSBbXVxyXG5cclxuXHRcdCMgKuiuvue9ruWFs+iBlOaQnOe0ouafpeivoueahOWtl+autVxyXG5cdFx0IyDpmYTku7bnmoTlhbPogZTmkJzntKLlrZfmrrXmmK/lrprmrbvnmoRcclxuXHRcdGlmIHJlbGF0ZWRPYmpOYW1lID09IFwiY21zX2ZpbGVzXCJcclxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gXCJwYXJlbnQuaWRzXCJcclxuXHRcdGVsc2VcclxuXHRcdFx0IyDojrflj5ZmaWVsZHNcclxuXHRcdFx0ZmllbGRzID0gQ3JlYXRvcj8uT2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0/LmZpZWxkc1xyXG5cdFx0XHQjIOW+queOr+avj+S4qmZpZWxkLOaJvuWHunJlZmVyZW5jZV90b+eahOWFs+iBlOWtl+autVxyXG5cdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSBcIlwiXHJcblx0XHRcdF8uZWFjaCBmaWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG5cdFx0XHRcdGlmIGZpZWxkPy5yZWZlcmVuY2VfdG8gPT0gb2JqTmFtZVxyXG5cdFx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gZmllbGRfbmFtZVxyXG5cclxuXHRcdCMg5qC55o2u5om+5Ye655qE5YWz6IGU5a2X5q6177yM5p+l5a2Q6KGo5pWw5o2uXHJcblx0XHRpZiByZWxhdGVkX2ZpZWxkX25hbWVcclxuXHRcdFx0cmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iak5hbWUpXHJcblx0XHRcdCMg6I635Y+W5Yiw5omA5pyJ55qE5pWw5o2uXHJcblx0XHRcdHJlbGF0ZWRSZWNvcmRMaXN0ID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZCh7XCIje3JlbGF0ZWRfZmllbGRfbmFtZX1cIjpvYmouX2lkfSkuZmV0Y2goKVxyXG5cdFx0XHQjIOW+queOr+avj+S4gOadoeaVsOaNrlxyXG5cdFx0XHRyZWxhdGVkUmVjb3JkTGlzdC5mb3JFYWNoIChyZWxhdGVkT2JqKS0+XHJcblx0XHRcdFx0IyDmlbTlkIhmaWVsZHPmlbDmja5cclxuXHRcdFx0XHRmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEgcmVsYXRlZE9iaixyZWxhdGVkT2JqTmFtZVxyXG5cdFx0XHRcdCMg5oqK5LiA5p2h6K6w5b2V5o+S5YWl5Yiw5a+56LGh5pWw57uE5LitXHJcblx0XHRcdFx0cmVsYXRlZFRhYmxlRGF0YS5wdXNoIGZpZWxkc0RhdGFcclxuXHJcblx0XHQjIOaKiuS4gOS4quWtkOihqOeahOaJgOacieaVsOaNruaPkuWFpeWIsHJlbGF0ZWRfb2JqZWN0c+S4re+8jOWGjeW+queOr+S4i+S4gOS4qlxyXG5cdFx0cmVsYXRlZF9vYmplY3RzW3JlbGF0ZWRPYmpOYW1lXSA9IHJlbGF0ZWRUYWJsZURhdGFcclxuXHJcblx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xyXG5cclxuIyBDcmVhdG9yLkV4cG9ydDJ4bWwoKVxyXG5DcmVhdG9yLkV4cG9ydDJ4bWwgPSAob2JqTmFtZSwgcmVjb3JkTGlzdCkgLT5cclxuXHRsb2dnZXIuaW5mbyBcIlJ1biBDcmVhdG9yLkV4cG9ydDJ4bWxcIlxyXG5cclxuXHRjb25zb2xlLnRpbWUgXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIlxyXG5cclxuXHQjIOa1i+ivleaVsOaNrlxyXG5cdCMgb2JqTmFtZSA9IFwiYXJjaGl2ZV9yZWNvcmRzXCJcclxuXHJcblx0IyDmn6Xmib7lr7nosaHmlbDmja5cclxuXHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iak5hbWUpXHJcblx0IyDmtYvor5XmlbDmja5cclxuXHRyZWNvcmRMaXN0ID0gY29sbGVjdGlvbi5maW5kKHt9KS5mZXRjaCgpXHJcblxyXG5cdHJlY29yZExpc3QuZm9yRWFjaCAocmVjb3JkT2JqKS0+XHJcblx0XHRqc29uT2JqID0ge31cclxuXHRcdGpzb25PYmouX2lkID0gcmVjb3JkT2JqLl9pZFxyXG5cclxuXHRcdCMg5pW055CG5Li76KGo55qERmllbGRz5pWw5o2uXHJcblx0XHRmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEgcmVjb3JkT2JqLG9iak5hbWVcclxuXHRcdGpzb25PYmpbb2JqTmFtZV0gPSBmaWVsZHNEYXRhXHJcblxyXG5cdFx0IyDmlbTnkIbnm7jlhbPooajmlbDmja5cclxuXHRcdHJlbGF0ZWRfb2JqZWN0cyA9IF9taXhSZWxhdGVkRGF0YSByZWNvcmRPYmosb2JqTmFtZVxyXG5cclxuXHRcdGpzb25PYmpbXCJyZWxhdGVkX29iamVjdHNcIl0gPSByZWxhdGVkX29iamVjdHNcclxuXHJcblx0XHQjIOi9rOS4unhtbOS/neWtmOaWh+S7tlxyXG5cdFx0ZmlsZVBhdGggPSBfd3JpdGVYbWxGaWxlIGpzb25PYmosb2JqTmFtZVxyXG5cclxuXHRjb25zb2xlLnRpbWVFbmQgXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIlxyXG5cdHJldHVybiBmaWxlUGF0aCIsInZhciBfbWl4RmllbGRzRGF0YSwgX21peFJlbGF0ZWREYXRhLCBfd3JpdGVYbWxGaWxlLCBmcywgbG9nZ2VyLCBta2RpcnAsIHBhdGgsIHhtbDJqcztcblxueG1sMmpzID0gcmVxdWlyZSgneG1sMmpzJyk7XG5cbmZzID0gcmVxdWlyZSgnZnMnKTtcblxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxubWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJyk7XG5cbmxvZ2dlciA9IG5ldyBMb2dnZXIoJ0V4cG9ydF9UT19YTUwnKTtcblxuX3dyaXRlWG1sRmlsZSA9IGZ1bmN0aW9uKGpzb25PYmosIG9iak5hbWUpIHtcbiAgdmFyIGJ1aWxkZXIsIGRheSwgZmlsZUFkZHJlc3MsIGZpbGVOYW1lLCBmaWxlUGF0aCwgbW9udGgsIG5vdywgc3RyZWFtLCB4bWwsIHllYXI7XG4gIGJ1aWxkZXIgPSBuZXcgeG1sMmpzLkJ1aWxkZXIoKTtcbiAgeG1sID0gYnVpbGRlci5idWlsZE9iamVjdChqc29uT2JqKTtcbiAgc3RyZWFtID0gbmV3IEJ1ZmZlcih4bWwpO1xuICBub3cgPSBuZXcgRGF0ZTtcbiAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMTtcbiAgZGF5ID0gbm93LmdldERhdGUoKTtcbiAgZmlsZVBhdGggPSBwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCAnLi4vLi4vLi4vZXhwb3J0LycgKyB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBkYXkgKyAnLycgKyBvYmpOYW1lKTtcbiAgZmlsZU5hbWUgPSAoanNvbk9iaiAhPSBudWxsID8ganNvbk9iai5faWQgOiB2b2lkIDApICsgXCIueG1sXCI7XG4gIGZpbGVBZGRyZXNzID0gcGF0aC5qb2luKGZpbGVQYXRoLCBmaWxlTmFtZSk7XG4gIGlmICghZnMuZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcbiAgICBta2RpcnAuc3luYyhmaWxlUGF0aCk7XG4gIH1cbiAgZnMud3JpdGVGaWxlKGZpbGVBZGRyZXNzLCBzdHJlYW0sIGZ1bmN0aW9uKGVycikge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHJldHVybiBsb2dnZXIuZXJyb3IoanNvbk9iai5faWQgKyBcIuWGmeWFpXhtbOaWh+S7tuWksei0pVwiLCBlcnIpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmaWxlUGF0aDtcbn07XG5cbl9taXhGaWVsZHNEYXRhID0gZnVuY3Rpb24ob2JqLCBvYmpOYW1lKSB7XG4gIHZhciBqc29uT2JqLCBtaXhCb29sLCBtaXhEYXRlLCBtaXhEZWZhdWx0LCBvYmpGaWVsZHMsIHJlZjtcbiAganNvbk9iaiA9IHt9O1xuICBvYmpGaWVsZHMgPSB0eXBlb2YgQ3JlYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBDcmVhdG9yICE9PSBudWxsID8gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iak5hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgbWl4RGVmYXVsdCA9IGZ1bmN0aW9uKGZpZWxkX25hbWUpIHtcbiAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IG9ialtmaWVsZF9uYW1lXSB8fCBcIlwiO1xuICB9O1xuICBtaXhEYXRlID0gZnVuY3Rpb24oZmllbGRfbmFtZSwgdHlwZSkge1xuICAgIHZhciBkYXRlLCBkYXRlU3RyLCBmb3JtYXQ7XG4gICAgZGF0ZSA9IG9ialtmaWVsZF9uYW1lXTtcbiAgICBpZiAodHlwZSA9PT0gXCJkYXRlXCIpIHtcbiAgICAgIGZvcm1hdCA9IFwiWVlZWS1NTS1ERFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW06c3NcIjtcbiAgICB9XG4gICAgaWYgKChkYXRlICE9IG51bGwpICYmIChmb3JtYXQgIT0gbnVsbCkpIHtcbiAgICAgIGRhdGVTdHIgPSBtb21lbnQoZGF0ZSkuZm9ybWF0KGZvcm1hdCk7XG4gICAgfVxuICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gZGF0ZVN0ciB8fCBcIlwiO1xuICB9O1xuICBtaXhCb29sID0gZnVuY3Rpb24oZmllbGRfbmFtZSkge1xuICAgIGlmIChvYmpbZmllbGRfbmFtZV0gPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLmmK9cIjtcbiAgICB9IGVsc2UgaWYgKG9ialtmaWVsZF9uYW1lXSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLlkKZcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIlwiO1xuICAgIH1cbiAgfTtcbiAgXy5lYWNoKG9iakZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBzd2l0Y2ggKGZpZWxkICE9IG51bGwgPyBmaWVsZC50eXBlIDogdm9pZCAwKSB7XG4gICAgICBjYXNlIFwiZGF0ZVwiOlxuICAgICAgY2FzZSBcImRhdGV0aW1lXCI6XG4gICAgICAgIHJldHVybiBtaXhEYXRlKGZpZWxkX25hbWUsIGZpZWxkLnR5cGUpO1xuICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgcmV0dXJuIG1peEJvb2woZmllbGRfbmFtZSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbWl4RGVmYXVsdChmaWVsZF9uYW1lKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4ganNvbk9iajtcbn07XG5cbl9taXhSZWxhdGVkRGF0YSA9IGZ1bmN0aW9uKG9iaiwgb2JqTmFtZSkge1xuICB2YXIgcmVsYXRlZE9iak5hbWVzLCByZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IHt9O1xuICByZWxhdGVkT2JqTmFtZXMgPSB0eXBlb2YgQ3JlYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBDcmVhdG9yICE9PSBudWxsID8gQ3JlYXRvci5nZXRBbGxSZWxhdGVkT2JqZWN0cyhvYmpOYW1lKSA6IHZvaWQgMDtcbiAgcmVsYXRlZE9iak5hbWVzLmZvckVhY2goZnVuY3Rpb24ocmVsYXRlZE9iak5hbWUpIHtcbiAgICB2YXIgZmllbGRzLCBvYmoxLCByZWYsIHJlbGF0ZWRDb2xsZWN0aW9uLCByZWxhdGVkUmVjb3JkTGlzdCwgcmVsYXRlZFRhYmxlRGF0YSwgcmVsYXRlZF9maWVsZF9uYW1lO1xuICAgIHJlbGF0ZWRUYWJsZURhdGEgPSBbXTtcbiAgICBpZiAocmVsYXRlZE9iak5hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwicGFyZW50Lmlkc1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWVsZHMgPSB0eXBlb2YgQ3JlYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBDcmVhdG9yICE9PSBudWxsID8gKHJlZiA9IENyZWF0b3IuT2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0pICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gXCJcIjtcbiAgICAgIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgICAgIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnJlZmVyZW5jZV90byA6IHZvaWQgMCkgPT09IG9iak5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9maWVsZF9uYW1lID0gZmllbGRfbmFtZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChyZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgIHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmpOYW1lKTtcbiAgICAgIHJlbGF0ZWRSZWNvcmRMaXN0ID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZCgoXG4gICAgICAgIG9iajEgPSB7fSxcbiAgICAgICAgb2JqMVtcIlwiICsgcmVsYXRlZF9maWVsZF9uYW1lXSA9IG9iai5faWQsXG4gICAgICAgIG9iajFcbiAgICAgICkpLmZldGNoKCk7XG4gICAgICByZWxhdGVkUmVjb3JkTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHJlbGF0ZWRPYmopIHtcbiAgICAgICAgdmFyIGZpZWxkc0RhdGE7XG4gICAgICAgIGZpZWxkc0RhdGEgPSBfbWl4RmllbGRzRGF0YShyZWxhdGVkT2JqLCByZWxhdGVkT2JqTmFtZSk7XG4gICAgICAgIHJldHVybiByZWxhdGVkVGFibGVEYXRhLnB1c2goZmllbGRzRGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0gPSByZWxhdGVkVGFibGVEYXRhO1xuICB9KTtcbiAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbn07XG5cbkNyZWF0b3IuRXhwb3J0MnhtbCA9IGZ1bmN0aW9uKG9iak5hbWUsIHJlY29yZExpc3QpIHtcbiAgdmFyIGNvbGxlY3Rpb247XG4gIGxvZ2dlci5pbmZvKFwiUnVuIENyZWF0b3IuRXhwb3J0MnhtbFwiKTtcbiAgY29uc29sZS50aW1lKFwiQ3JlYXRvci5FeHBvcnQyeG1sXCIpO1xuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iak5hbWUpO1xuICByZWNvcmRMaXN0ID0gY29sbGVjdGlvbi5maW5kKHt9KS5mZXRjaCgpO1xuICByZWNvcmRMaXN0LmZvckVhY2goZnVuY3Rpb24ocmVjb3JkT2JqKSB7XG4gICAgdmFyIGZpZWxkc0RhdGEsIGZpbGVQYXRoLCBqc29uT2JqLCByZWxhdGVkX29iamVjdHM7XG4gICAganNvbk9iaiA9IHt9O1xuICAgIGpzb25PYmouX2lkID0gcmVjb3JkT2JqLl9pZDtcbiAgICBmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEocmVjb3JkT2JqLCBvYmpOYW1lKTtcbiAgICBqc29uT2JqW29iak5hbWVdID0gZmllbGRzRGF0YTtcbiAgICByZWxhdGVkX29iamVjdHMgPSBfbWl4UmVsYXRlZERhdGEocmVjb3JkT2JqLCBvYmpOYW1lKTtcbiAgICBqc29uT2JqW1wicmVsYXRlZF9vYmplY3RzXCJdID0gcmVsYXRlZF9vYmplY3RzO1xuICAgIHJldHVybiBmaWxlUGF0aCA9IF93cml0ZVhtbEZpbGUoanNvbk9iaiwgb2JqTmFtZSk7XG4gIH0pO1xuICBjb25zb2xlLnRpbWVFbmQoXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIik7XG4gIHJldHVybiBmaWxlUGF0aDtcbn07XG4iLCJNZXRlb3IubWV0aG9kcyBcclxuXHRyZWxhdGVkX29iamVjdHNfcmVjb3JkczogKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCktPlxyXG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcclxuXHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXHJcblx0XHRcdHNlbGVjdG9yID0ge1wibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZH1cclxuXHRcdGVsc2VcclxuXHRcdFx0c2VsZWN0b3IgPSB7c3BhY2U6IHNwYWNlSWR9XHJcblx0XHRcclxuXHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxyXG5cdFx0XHQjIOmZhOS7tueahOWFs+iBlOaQnOe0ouadoeS7tuaYr+Wumuatu+eahFxyXG5cdFx0XHRzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWVcclxuXHRcdFx0c2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF1cclxuXHRcdGVsc2VcclxuXHRcdFx0c2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZFxyXG5cclxuXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXHJcblx0XHRpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLmFsbG93UmVhZFxyXG5cdFx0XHRzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxyXG5cdFx0XHJcblx0XHRyZWxhdGVkX3JlY29yZHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3RvcilcclxuXHRcdHJldHVybiByZWxhdGVkX3JlY29yZHMuY291bnQoKSIsIk1ldGVvci5tZXRob2RzKHtcbiAgcmVsYXRlZF9vYmplY3RzX3JlY29yZHM6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCkge1xuICAgIHZhciBwZXJtaXNzaW9ucywgcmVsYXRlZF9yZWNvcmRzLCBzZWxlY3RvciwgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICBcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWRcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIHNlbGVjdG9yW1wicGFyZW50Lm9cIl0gPSBvYmplY3RfbmFtZTtcbiAgICAgIHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3RvcltyZWxhdGVkX2ZpZWxkX25hbWVdID0gcmVjb3JkX2lkO1xuICAgIH1cbiAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgICBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLmFsbG93UmVhZCkge1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgfVxuICAgIHJlbGF0ZWRfcmVjb3JkcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVsYXRlZF9yZWNvcmRzLmNvdW50KCk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRnZXRQZW5kaW5nU3BhY2VJbmZvOiAoaW52aXRlcklkLCBzcGFjZUlkKS0+XHJcblx0XHRpbnZpdGVyTmFtZSA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogaW52aXRlcklkfSkubmFtZVxyXG5cdFx0c3BhY2VOYW1lID0gZGIuc3BhY2VzLmZpbmRPbmUoe19pZDogc3BhY2VJZH0pLm5hbWVcclxuXHJcblx0XHRyZXR1cm4ge2ludml0ZXI6IGludml0ZXJOYW1lLCBzcGFjZTogc3BhY2VOYW1lfVxyXG5cclxuXHRyZWZ1c2VKb2luU3BhY2U6IChfaWQpLT5cclxuXHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogX2lkfSx7JHNldDoge2ludml0ZV9zdGF0ZTogXCJyZWZ1c2VkXCJ9fSlcclxuXHJcblx0YWNjZXB0Sm9pblNwYWNlOiAoX2lkKS0+XHJcblx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IF9pZH0seyRzZXQ6IHtpbnZpdGVfc3RhdGU6IFwiYWNjZXB0ZWRcIiwgdXNlcl9hY2NlcHRlZDogdHJ1ZX19KVxyXG5cclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBnZXRQZW5kaW5nU3BhY2VJbmZvOiBmdW5jdGlvbihpbnZpdGVySWQsIHNwYWNlSWQpIHtcbiAgICB2YXIgaW52aXRlck5hbWUsIHNwYWNlTmFtZTtcbiAgICBpbnZpdGVyTmFtZSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBpbnZpdGVySWRcbiAgICB9KS5uYW1lO1xuICAgIHNwYWNlTmFtZSA9IGRiLnNwYWNlcy5maW5kT25lKHtcbiAgICAgIF9pZDogc3BhY2VJZFxuICAgIH0pLm5hbWU7XG4gICAgcmV0dXJuIHtcbiAgICAgIGludml0ZXI6IGludml0ZXJOYW1lLFxuICAgICAgc3BhY2U6IHNwYWNlTmFtZVxuICAgIH07XG4gIH0sXG4gIHJlZnVzZUpvaW5TcGFjZTogZnVuY3Rpb24oX2lkKSB7XG4gICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGludml0ZV9zdGF0ZTogXCJyZWZ1c2VkXCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgYWNjZXB0Sm9pblNwYWNlOiBmdW5jdGlvbihfaWQpIHtcbiAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IF9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgaW52aXRlX3N0YXRlOiBcImFjY2VwdGVkXCIsXG4gICAgICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IucHVibGlzaCBcImNyZWF0b3Jfb2JqZWN0X3JlY29yZFwiLCAob2JqZWN0X25hbWUsIGlkLCBzcGFjZV9pZCktPlxyXG5cdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKVxyXG5cdGlmIGNvbGxlY3Rpb25cclxuXHRcdHJldHVybiBjb2xsZWN0aW9uLmZpbmQoe19pZDogaWR9KVxyXG5cclxuIiwiTWV0ZW9yLnB1Ymxpc2goXCJjcmVhdG9yX29iamVjdF9yZWNvcmRcIiwgZnVuY3Rpb24ob2JqZWN0X25hbWUsIGlkLCBzcGFjZV9pZCkge1xuICB2YXIgY29sbGVjdGlvbjtcbiAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpO1xuICBpZiAoY29sbGVjdGlvbikge1xuICAgIHJldHVybiBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgX2lkOiBpZFxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoQ29tcG9zaXRlIFwic3RlZWRvc19vYmplY3RfdGFidWxhclwiLCAodGFibGVOYW1lLCBpZHMsIGZpZWxkcywgc3BhY2VJZCktPlxyXG5cdHVubGVzcyB0aGlzLnVzZXJJZFxyXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRjaGVjayh0YWJsZU5hbWUsIFN0cmluZyk7XHJcblx0Y2hlY2soaWRzLCBBcnJheSk7XHJcblx0Y2hlY2soZmllbGRzLCBNYXRjaC5PcHRpb25hbChPYmplY3QpKTtcclxuXHJcblx0X29iamVjdF9uYW1lID0gdGFibGVOYW1lLnJlcGxhY2UoXCJjcmVhdG9yX1wiLFwiXCIpXHJcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9vYmplY3RfbmFtZSwgc3BhY2VJZClcclxuXHJcblx0aWYgc3BhY2VJZFxyXG5cdFx0X29iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRPYmplY3ROYW1lKF9vYmplY3QpXHJcblxyXG5cdG9iamVjdF9jb2xsZWNpdG9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKF9vYmplY3RfbmFtZSlcclxuXHJcblxyXG5cdF9maWVsZHMgPSBfb2JqZWN0Py5maWVsZHNcclxuXHRpZiAhX2ZpZWxkcyB8fCAhb2JqZWN0X2NvbGxlY2l0b25cclxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0cmVmZXJlbmNlX2ZpZWxkcyA9IF8uZmlsdGVyIF9maWVsZHMsIChmKS0+XHJcblx0XHRyZXR1cm4gXy5pc0Z1bmN0aW9uKGYucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KGYucmVmZXJlbmNlX3RvKVxyXG5cclxuXHRzZWxmID0gdGhpc1xyXG5cclxuXHRzZWxmLnVuYmxvY2soKTtcclxuXHJcblx0aWYgcmVmZXJlbmNlX2ZpZWxkcy5sZW5ndGggPiAwXHJcblx0XHRkYXRhID0ge1xyXG5cdFx0XHRmaW5kOiAoKS0+XHJcblx0XHRcdFx0c2VsZi51bmJsb2NrKCk7XHJcblx0XHRcdFx0ZmllbGRfa2V5cyA9IHt9XHJcblx0XHRcdFx0Xy5lYWNoIF8ua2V5cyhmaWVsZHMpLCAoZiktPlxyXG5cdFx0XHRcdFx0dW5sZXNzIC9cXHcrKFxcLlxcJCl7MX1cXHc/Ly50ZXN0KGYpXHJcblx0XHRcdFx0XHRcdGZpZWxkX2tleXNbZl0gPSAxXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0cmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe19pZDogeyRpbjogaWRzfX0sIHtmaWVsZHM6IGZpZWxkX2tleXN9KTtcclxuXHRcdH1cclxuXHJcblx0XHRkYXRhLmNoaWxkcmVuID0gW11cclxuXHJcblx0XHRrZXlzID0gXy5rZXlzKGZpZWxkcylcclxuXHJcblx0XHRpZiBrZXlzLmxlbmd0aCA8IDFcclxuXHRcdFx0a2V5cyA9IF8ua2V5cyhfZmllbGRzKVxyXG5cclxuXHRcdF9rZXlzID0gW11cclxuXHJcblx0XHRrZXlzLmZvckVhY2ggKGtleSktPlxyXG5cdFx0XHRpZiBfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddXHJcblx0XHRcdFx0X2tleXMgPSBfa2V5cy5jb25jYXQoXy5tYXAoX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXSwgKGspLT5cclxuXHRcdFx0XHRcdHJldHVybiBrZXkgKyAnLicgKyBrXHJcblx0XHRcdFx0KSlcclxuXHRcdFx0X2tleXMucHVzaChrZXkpXHJcblxyXG5cdFx0X2tleXMuZm9yRWFjaCAoa2V5KS0+XHJcblx0XHRcdHJlZmVyZW5jZV9maWVsZCA9IF9maWVsZHNba2V5XVxyXG5cclxuXHRcdFx0aWYgcmVmZXJlbmNlX2ZpZWxkICYmIChfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykgfHwgIV8uaXNFbXB0eShyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSkgICMgYW5kIENyZWF0b3IuQ29sbGVjdGlvbnNbcmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90b11cclxuXHRcdFx0XHRkYXRhLmNoaWxkcmVuLnB1c2gge1xyXG5cdFx0XHRcdFx0ZmluZDogKHBhcmVudCkgLT5cclxuXHRcdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdFx0c2VsZi51bmJsb2NrKCk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHF1ZXJ5ID0ge31cclxuXHJcblx0XHRcdFx0XHRcdFx0IyDooajmoLzlrZDlrZfmrrXnibnmrorlpITnkIZcclxuXHRcdFx0XHRcdFx0XHRpZiAvXFx3KyhcXC5cXCRcXC4pezF9XFx3Ky8udGVzdChrZXkpXHJcblx0XHRcdFx0XHRcdFx0XHRwX2sgPSBrZXkucmVwbGFjZSgvKFxcdyspXFwuXFwkXFwuXFx3Ky9pZywgXCIkMVwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0c19rID0ga2V5LnJlcGxhY2UoL1xcdytcXC5cXCRcXC4oXFx3KykvaWcsIFwiJDFcIilcclxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV9pZHMgPSBwYXJlbnRbcF9rXS5nZXRQcm9wZXJ0eShzX2spXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX2lkcyA9IGtleS5zcGxpdCgnLicpLnJlZHVjZSAobywgeCkgLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvP1t4XVxyXG5cdFx0XHRcdFx0XHRcdFx0LCBwYXJlbnRcclxuXHJcblx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90b1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvKClcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KHJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdFx0XHRcdGlmIF8uaXNPYmplY3QocmVmZXJlbmNlX2lkcykgJiYgIV8uaXNBcnJheShyZWZlcmVuY2VfaWRzKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfaWRzLm9cclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX2lkcyA9IHJlZmVyZW5jZV9pZHMuaWRzIHx8IFtdXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBbXVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkocmVmZXJlbmNlX2lkcylcclxuXHRcdFx0XHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHskaW46IHJlZmVyZW5jZV9pZHN9XHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0cXVlcnkuX2lkID0gcmVmZXJlbmNlX2lkc1xyXG5cclxuXHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG9fb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxyXG5cclxuXHRcdFx0XHRcdFx0XHRuYW1lX2ZpZWxkX2tleSA9IHJlZmVyZW5jZV90b19vYmplY3QuTkFNRV9GSUVMRF9LRVlcclxuXHJcblx0XHRcdFx0XHRcdFx0Y2hpbGRyZW5fZmllbGRzID0ge19pZDogMSwgc3BhY2U6IDF9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIG5hbWVfZmllbGRfa2V5XHJcblx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbl9maWVsZHNbbmFtZV9maWVsZF9rZXldID0gMVxyXG5cclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZChxdWVyeSwge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZmllbGRzOiBjaGlsZHJlbl9maWVsZHNcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlZmVyZW5jZV90bywgcGFyZW50LCBlKVxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBbXVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGF0YVxyXG5cdGVsc2VcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGZpbmQ6ICgpLT5cclxuXHRcdFx0XHRzZWxmLnVuYmxvY2soKTtcclxuXHRcdFx0XHRyZXR1cm4gb2JqZWN0X2NvbGxlY2l0b24uZmluZCh7X2lkOiB7JGluOiBpZHN9fSwge2ZpZWxkczogZmllbGRzfSlcclxuXHRcdH07XHJcblxyXG4iLCJNZXRlb3IucHVibGlzaENvbXBvc2l0ZShcInN0ZWVkb3Nfb2JqZWN0X3RhYnVsYXJcIiwgZnVuY3Rpb24odGFibGVOYW1lLCBpZHMsIGZpZWxkcywgc3BhY2VJZCkge1xuICB2YXIgX2ZpZWxkcywgX2tleXMsIF9vYmplY3QsIF9vYmplY3RfbmFtZSwgZGF0YSwga2V5cywgb2JqZWN0X2NvbGxlY2l0b24sIHJlZmVyZW5jZV9maWVsZHMsIHNlbGY7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIGNoZWNrKHRhYmxlTmFtZSwgU3RyaW5nKTtcbiAgY2hlY2soaWRzLCBBcnJheSk7XG4gIGNoZWNrKGZpZWxkcywgTWF0Y2guT3B0aW9uYWwoT2JqZWN0KSk7XG4gIF9vYmplY3RfbmFtZSA9IHRhYmxlTmFtZS5yZXBsYWNlKFwiY3JlYXRvcl9cIiwgXCJcIik7XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfb2JqZWN0X25hbWUsIHNwYWNlSWQpO1xuICBpZiAoc3BhY2VJZCkge1xuICAgIF9vYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0TmFtZShfb2JqZWN0KTtcbiAgfVxuICBvYmplY3RfY29sbGVjaXRvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihfb2JqZWN0X25hbWUpO1xuICBfZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIGlmICghX2ZpZWxkcyB8fCAhb2JqZWN0X2NvbGxlY2l0b24pIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJlZmVyZW5jZV9maWVsZHMgPSBfLmZpbHRlcihfZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbihmLnJlZmVyZW5jZV90bykgfHwgIV8uaXNFbXB0eShmLnJlZmVyZW5jZV90byk7XG4gIH0pO1xuICBzZWxmID0gdGhpcztcbiAgc2VsZi51bmJsb2NrKCk7XG4gIGlmIChyZWZlcmVuY2VfZmllbGRzLmxlbmd0aCA+IDApIHtcbiAgICBkYXRhID0ge1xuICAgICAgZmluZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmaWVsZF9rZXlzO1xuICAgICAgICBzZWxmLnVuYmxvY2soKTtcbiAgICAgICAgZmllbGRfa2V5cyA9IHt9O1xuICAgICAgICBfLmVhY2goXy5rZXlzKGZpZWxkcyksIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICBpZiAoIS9cXHcrKFxcLlxcJCl7MX1cXHc/Ly50ZXN0KGYpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmllbGRfa2V5c1tmXSA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe1xuICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgJGluOiBpZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkX2tleXNcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBkYXRhLmNoaWxkcmVuID0gW107XG4gICAga2V5cyA9IF8ua2V5cyhmaWVsZHMpO1xuICAgIGlmIChrZXlzLmxlbmd0aCA8IDEpIHtcbiAgICAgIGtleXMgPSBfLmtleXMoX2ZpZWxkcyk7XG4gICAgfVxuICAgIF9rZXlzID0gW107XG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ10pIHtcbiAgICAgICAgX2tleXMgPSBfa2V5cy5jb25jYXQoXy5tYXAoX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXSwgZnVuY3Rpb24oaykge1xuICAgICAgICAgIHJldHVybiBrZXkgKyAnLicgKyBrO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX2tleXMucHVzaChrZXkpO1xuICAgIH0pO1xuICAgIF9rZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgcmVmZXJlbmNlX2ZpZWxkO1xuICAgICAgcmVmZXJlbmNlX2ZpZWxkID0gX2ZpZWxkc1trZXldO1xuICAgICAgaWYgKHJlZmVyZW5jZV9maWVsZCAmJiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykpKSB7XG4gICAgICAgIHJldHVybiBkYXRhLmNoaWxkcmVuLnB1c2goe1xuICAgICAgICAgIGZpbmQ6IGZ1bmN0aW9uKHBhcmVudCkge1xuICAgICAgICAgICAgdmFyIGNoaWxkcmVuX2ZpZWxkcywgZSwgbmFtZV9maWVsZF9rZXksIHBfaywgcXVlcnksIHJlZmVyZW5jZV9pZHMsIHJlZmVyZW5jZV90bywgcmVmZXJlbmNlX3RvX29iamVjdCwgc19rO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICAgICAgICAgIHF1ZXJ5ID0ge307XG4gICAgICAgICAgICAgIGlmICgvXFx3KyhcXC5cXCRcXC4pezF9XFx3Ky8udGVzdChrZXkpKSB7XG4gICAgICAgICAgICAgICAgcF9rID0ga2V5LnJlcGxhY2UoLyhcXHcrKVxcLlxcJFxcLlxcdysvaWcsIFwiJDFcIik7XG4gICAgICAgICAgICAgICAgc19rID0ga2V5LnJlcGxhY2UoL1xcdytcXC5cXCRcXC4oXFx3KykvaWcsIFwiJDFcIik7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlX2lkcyA9IHBhcmVudFtwX2tdLmdldFByb3BlcnR5KHNfayk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlX2lkcyA9IGtleS5zcGxpdCgnLicpLnJlZHVjZShmdW5jdGlvbihvLCB4KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbyAhPSBudWxsID8gb1t4XSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICB9LCBwYXJlbnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90bygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChfLmlzQXJyYXkocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIGlmIChfLmlzT2JqZWN0KHJlZmVyZW5jZV9pZHMpICYmICFfLmlzQXJyYXkocmVmZXJlbmNlX2lkcykpIHtcbiAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9pZHMubztcbiAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZV9pZHMgPSByZWZlcmVuY2VfaWRzLmlkcyB8fCBbXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpKSB7XG4gICAgICAgICAgICAgICAgcXVlcnkuX2lkID0ge1xuICAgICAgICAgICAgICAgICAgJGluOiByZWZlcmVuY2VfaWRzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBxdWVyeS5faWQgPSByZWZlcmVuY2VfaWRzO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlZmVyZW5jZV90b19vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWZlcmVuY2VfdG8sIHNwYWNlSWQpO1xuICAgICAgICAgICAgICBuYW1lX2ZpZWxkX2tleSA9IHJlZmVyZW5jZV90b19vYmplY3QuTkFNRV9GSUVMRF9LRVk7XG4gICAgICAgICAgICAgIGNoaWxkcmVuX2ZpZWxkcyA9IHtcbiAgICAgICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICAgICAgc3BhY2U6IDFcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgaWYgKG5hbWVfZmllbGRfa2V5KSB7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW5fZmllbGRzW25hbWVfZmllbGRfa2V5XSA9IDE7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8sIHNwYWNlSWQpLmZpbmQocXVlcnksIHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IGNoaWxkcmVuX2ZpZWxkc1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVmZXJlbmNlX3RvLCBwYXJlbnQsIGUpO1xuICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgZmluZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYudW5ibG9jaygpO1xuICAgICAgICByZXR1cm4gb2JqZWN0X2NvbGxlY2l0b24uZmluZCh7XG4gICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAkaW46IGlkc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogZmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggXCJvYmplY3RfbGlzdHZpZXdzXCIsIChvYmplY3RfbmFtZSwgc3BhY2VJZCktPlxyXG4gICAgdXNlcklkID0gdGhpcy51c2VySWRcclxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc3BhY2U6IHNwYWNlSWQgLFwiJG9yXCI6W3tvd25lcjogdXNlcklkfSwge3NoYXJlZDogdHJ1ZX1dfSkiLCJNZXRlb3IucHVibGlzaCBcInVzZXJfdGFidWxhcl9zZXR0aW5nc1wiLCAob2JqZWN0X25hbWUpLT5cclxuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXHJcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kKHtvYmplY3RfbmFtZTogeyRpbjogb2JqZWN0X25hbWV9LCByZWNvcmRfaWQ6IHskaW46IFtcIm9iamVjdF9saXN0dmlld3NcIiwgXCJvYmplY3RfZ3JpZHZpZXdzXCJdfSwgb3duZXI6IHVzZXJJZH0pXHJcbiIsIk1ldGVvci5wdWJsaXNoIFwicmVsYXRlZF9vYmplY3RzX3JlY29yZHNcIiwgKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCktPlxyXG5cdHVzZXJJZCA9IHRoaXMudXNlcklkXHJcblx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJcclxuXHRcdHNlbGVjdG9yID0ge1wibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZH1cclxuXHRlbHNlXHJcblx0XHRzZWxlY3RvciA9IHtzcGFjZTogc3BhY2VJZH1cclxuXHRcclxuXHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcclxuXHRcdCMg6ZmE5Lu255qE5YWz6IGU5pCc57Si5p2h5Lu25piv5a6a5q2755qEXHJcblx0XHRzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWVcclxuXHRcdHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdXHJcblx0ZWxzZVxyXG5cdFx0c2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZFxyXG5cclxuXHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxyXG5cdGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMuYWxsb3dSZWFkXHJcblx0XHRzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxyXG5cdFxyXG5cdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3RvcikiLCJNZXRlb3IucHVibGlzaChcInJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzXCIsIGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCkge1xuICB2YXIgcGVybWlzc2lvbnMsIHNlbGVjdG9yLCB1c2VySWQ7XG4gIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiKSB7XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWRcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9O1xuICB9XG4gIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgc2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lO1xuICAgIHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdO1xuICB9IGVsc2Uge1xuICAgIHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWQ7XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMuYWxsb3dSZWFkKSB7XG4gICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gIH1cbiAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ3NwYWNlX3VzZXJfaW5mbycsIChzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZCh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0pIiwiXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cclxuXHRNZXRlb3IucHVibGlzaCAnY29udGFjdHNfdmlld19saW1pdHMnLCAoc3BhY2VJZCktPlxyXG5cclxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxyXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdFx0dW5sZXNzIHNwYWNlSWRcclxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRcdHNlbGVjdG9yID1cclxuXHRcdFx0c3BhY2U6IHNwYWNlSWRcclxuXHRcdFx0a2V5OiAnY29udGFjdHNfdmlld19saW1pdHMnXHJcblxyXG5cdFx0cmV0dXJuIGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoc2VsZWN0b3IpIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnY29udGFjdHNfdmlld19saW1pdHMnLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIHNlbGVjdG9yO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIGtleTogJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJ1xuICAgIH07XG4gICAgcmV0dXJuIGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoc2VsZWN0b3IpO1xuICB9KTtcbn1cbiIsIlxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHJcblx0TWV0ZW9yLnB1Ymxpc2ggJ2NvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzJywgKHNwYWNlSWQpLT5cclxuXHJcblx0XHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRcdHVubGVzcyBzcGFjZUlkXHJcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0XHRzZWxlY3RvciA9XHJcblx0XHRcdHNwYWNlOiBzcGFjZUlkXHJcblx0XHRcdGtleTogJ2NvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzJ1xyXG5cclxuXHRcdHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKSIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ2NvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBzZWxlY3RvcjtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBrZXk6ICdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycydcbiAgICB9O1xuICAgIHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKTtcbiAgfSk7XG59XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRNZXRlb3IucHVibGlzaCAnc3BhY2VfbmVlZF90b19jb25maXJtJywgKCktPlxyXG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcclxuXHRcdHJldHVybiBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VySWQsIGludml0ZV9zdGF0ZTogXCJwZW5kaW5nXCJ9KSIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ3NwYWNlX25lZWRfdG9fY29uZmlybScsIGZ1bmN0aW9uKCkge1xuICAgIHZhciB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgaW52aXRlX3N0YXRlOiBcInBlbmRpbmdcIlxuICAgIH0pO1xuICB9KTtcbn1cbiIsInBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge31cclxuXHJcbnBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3dQZXJtaXNzaW9ucyA9IChmbG93X2lkLCB1c2VyX2lkKSAtPlxyXG5cdCMg5qC55o2uOmZsb3dfaWTmn6XliLDlr7nlupTnmoRmbG93XHJcblx0ZmxvdyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyhmbG93X2lkKVxyXG5cdHNwYWNlX2lkID0gZmxvdy5zcGFjZVxyXG5cdCMg5qC55o2uc3BhY2VfaWTlkow6dXNlcl9pZOWIsG9yZ2FuaXphdGlvbnPooajkuK3mn6XliLDnlKjmiLfmiYDlsZ7miYDmnInnmoRvcmdfaWTvvIjljIXmi6zkuIrnuqfnu4RJRO+8iVxyXG5cdG9yZ19pZHMgPSBuZXcgQXJyYXlcclxuXHRvcmdhbml6YXRpb25zID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcclxuXHRcdHNwYWNlOiBzcGFjZV9pZCwgdXNlcnM6IHVzZXJfaWQgfSwgeyBmaWVsZHM6IHsgcGFyZW50czogMSB9IH0pLmZldGNoKClcclxuXHRfLmVhY2gob3JnYW5pemF0aW9ucywgKG9yZykgLT5cclxuXHRcdG9yZ19pZHMucHVzaChvcmcuX2lkKVxyXG5cdFx0aWYgb3JnLnBhcmVudHNcclxuXHRcdFx0Xy5lYWNoKG9yZy5wYXJlbnRzLCAocGFyZW50X2lkKSAtPlxyXG5cdFx0XHRcdG9yZ19pZHMucHVzaChwYXJlbnRfaWQpXHJcblx0XHRcdClcclxuXHQpXHJcblx0b3JnX2lkcyA9IF8udW5pcShvcmdfaWRzKVxyXG5cdG15X3Blcm1pc3Npb25zID0gbmV3IEFycmF5XHJcblx0aWYgZmxvdy5wZXJtc1xyXG5cdFx0IyDliKTmlq1mbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbuS4reaYr+WQpuWMheWQq+W9k+WJjeeUqOaIt++8jFxyXG5cdFx0IyDmiJbogIVmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZOaYr+WQpuWMheWQqzTmraXlvpfliLDnmoRvcmdfaWTmlbDnu4TkuK3nmoTku7vkvZXkuIDkuKrvvIxcclxuXHRcdCMg6Iul5piv77yM5YiZ5Zyo6L+U5Zue55qE5pWw57uE5Lit5Yqg5LiKYWRkXHJcblx0XHRpZiBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGRcclxuXHRcdFx0dXNlcnNfY2FuX2FkZCA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkZFxyXG5cdFx0XHRpZiB1c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJfaWQpXHJcblx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKVxyXG5cclxuXHRcdGlmIGZsb3cucGVybXMub3Jnc19jYW5fYWRkXHJcblx0XHRcdG9yZ3NfY2FuX2FkZCA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRkXHJcblx0XHRcdF8uZWFjaChvcmdfaWRzLCAob3JnX2lkKSAtPlxyXG5cdFx0XHRcdGlmIG9yZ3NfY2FuX2FkZC5pbmNsdWRlcyhvcmdfaWQpXHJcblx0XHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpXHJcblx0XHRcdClcclxuXHRcdCMg5Yik5patZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvcuS4reaYr+WQpuWMheWQq+W9k+WJjeeUqOaIt++8jFxyXG5cdFx0IyDmiJbogIVmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3LmmK/lkKbljIXlkKs05q2l5b6X5Yiw55qEb3JnX2lk5pWw57uE5Lit55qE5Lu75L2V5LiA5Liq77yMXHJcblx0XHQjIOiLpeaYr++8jOWImeWcqOi/lOWbnueahOaVsOe7hOS4reWKoOS4im1vbml0b3JcclxuXHRcdGlmIGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3JcclxuXHRcdFx0dXNlcnNfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yXHJcblx0XHRcdGlmIHVzZXJzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKHVzZXJfaWQpXHJcblx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIilcclxuXHJcblx0XHRpZiBmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3JcclxuXHRcdFx0b3Jnc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvclxyXG5cdFx0XHRfLmVhY2gob3JnX2lkcywgKG9yZ19pZCkgLT5cclxuXHRcdFx0XHRpZiBvcmdzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKG9yZ19pZClcclxuXHRcdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJtb25pdG9yXCIpXHJcblx0XHRcdClcclxuXHRcdCMg5Yik5patZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW7kuK3mmK/lkKbljIXlkKvlvZPliY3nlKjmiLfvvIxcclxuXHRcdCMg5oiW6ICFZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pbuaYr+WQpuWMheWQqzTmraXlvpfliLDnmoRvcmdfaWTmlbDnu4TkuK3nmoTku7vkvZXkuIDkuKrvvIxcclxuXHRcdCMg6Iul5piv77yM5YiZ5Zyo6L+U5Zue55qE5pWw57uE5Lit5Yqg5LiKYWRtaW5cclxuXHRcdGlmIGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluXHJcblx0XHRcdHVzZXJzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluXHJcblx0XHRcdGlmIHVzZXJzX2Nhbl9hZG1pbi5pbmNsdWRlcyh1c2VyX2lkKVxyXG5cdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKVxyXG5cclxuXHRcdGlmIGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW5cclxuXHRcdFx0b3Jnc19jYW5fYWRtaW4gPSBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluXHJcblx0XHRcdF8uZWFjaChvcmdfaWRzLCAob3JnX2lkKSAtPlxyXG5cdFx0XHRcdGlmIG9yZ3NfY2FuX2FkbWluLmluY2x1ZGVzKG9yZ19pZClcclxuXHRcdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKVxyXG5cdFx0XHQpXHJcblxyXG5cdG15X3Blcm1pc3Npb25zID0gXy51bmlxKG15X3Blcm1pc3Npb25zKVxyXG5cdHJldHVybiBteV9wZXJtaXNzaW9ucyIsIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxucGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwgPSB7fTtcblxucGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rmxvd1Blcm1pc3Npb25zID0gZnVuY3Rpb24oZmxvd19pZCwgdXNlcl9pZCkge1xuICB2YXIgZmxvdywgbXlfcGVybWlzc2lvbnMsIG9yZ19pZHMsIG9yZ2FuaXphdGlvbnMsIG9yZ3NfY2FuX2FkZCwgb3Jnc19jYW5fYWRtaW4sIG9yZ3NfY2FuX21vbml0b3IsIHNwYWNlX2lkLCB1c2Vyc19jYW5fYWRkLCB1c2Vyc19jYW5fYWRtaW4sIHVzZXJzX2Nhbl9tb25pdG9yO1xuICBmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpO1xuICBzcGFjZV9pZCA9IGZsb3cuc3BhY2U7XG4gIG9yZ19pZHMgPSBuZXcgQXJyYXk7XG4gIG9yZ2FuaXphdGlvbnMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB1c2VyczogdXNlcl9pZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBwYXJlbnRzOiAxXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBfLmVhY2gob3JnYW5pemF0aW9ucywgZnVuY3Rpb24ob3JnKSB7XG4gICAgb3JnX2lkcy5wdXNoKG9yZy5faWQpO1xuICAgIGlmIChvcmcucGFyZW50cykge1xuICAgICAgcmV0dXJuIF8uZWFjaChvcmcucGFyZW50cywgZnVuY3Rpb24ocGFyZW50X2lkKSB7XG4gICAgICAgIHJldHVybiBvcmdfaWRzLnB1c2gocGFyZW50X2lkKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIG9yZ19pZHMgPSBfLnVuaXEob3JnX2lkcyk7XG4gIG15X3Blcm1pc3Npb25zID0gbmV3IEFycmF5O1xuICBpZiAoZmxvdy5wZXJtcykge1xuICAgIGlmIChmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGQpIHtcbiAgICAgIHVzZXJzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGQ7XG4gICAgICBpZiAodXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VyX2lkKSkge1xuICAgICAgICBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGQpIHtcbiAgICAgIG9yZ3NfY2FuX2FkZCA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRkO1xuICAgICAgXy5lYWNoKG9yZ19pZHMsIGZ1bmN0aW9uKG9yZ19pZCkge1xuICAgICAgICBpZiAob3Jnc19jYW5fYWRkLmluY2x1ZGVzKG9yZ19pZCkpIHtcbiAgICAgICAgICByZXR1cm4gbXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yKSB7XG4gICAgICB1c2Vyc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3I7XG4gICAgICBpZiAodXNlcnNfY2FuX21vbml0b3IuaW5jbHVkZXModXNlcl9pZCkpIHtcbiAgICAgICAgbXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3IpIHtcbiAgICAgIG9yZ3NfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3I7XG4gICAgICBfLmVhY2gob3JnX2lkcywgZnVuY3Rpb24ob3JnX2lkKSB7XG4gICAgICAgIGlmIChvcmdzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKG9yZ19pZCkpIHtcbiAgICAgICAgICByZXR1cm4gbXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW4pIHtcbiAgICAgIHVzZXJzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluO1xuICAgICAgaWYgKHVzZXJzX2Nhbl9hZG1pbi5pbmNsdWRlcyh1c2VyX2lkKSkge1xuICAgICAgICBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluKSB7XG4gICAgICBvcmdzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW47XG4gICAgICBfLmVhY2gob3JnX2lkcywgZnVuY3Rpb24ob3JnX2lkKSB7XG4gICAgICAgIGlmIChvcmdzX2Nhbl9hZG1pbi5pbmNsdWRlcyhvcmdfaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIG15X3Blcm1pc3Npb25zID0gXy51bmlxKG15X3Blcm1pc3Npb25zKTtcbiAgcmV0dXJuIG15X3Blcm1pc3Npb25zO1xufTtcbiIsIl9ldmFsID0gcmVxdWlyZSgnZXZhbCcpXHJcbm9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwgPSB7fVxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja19hdXRob3JpemF0aW9uID0gKHJlcSkgLT5cclxuXHRxdWVyeSA9IHJlcS5xdWVyeVxyXG5cdHVzZXJJZCA9IHF1ZXJ5W1wiWC1Vc2VyLUlkXCJdXHJcblx0YXV0aFRva2VuID0gcXVlcnlbXCJYLUF1dGgtVG9rZW5cIl1cclxuXHJcblx0aWYgbm90IHVzZXJJZCBvciBub3QgYXV0aFRva2VuXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcclxuXHJcblx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxyXG5cdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxyXG5cdFx0X2lkOiB1c2VySWQsXHJcblx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxyXG5cclxuXHRpZiBub3QgdXNlclxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXHJcblxyXG5cdHJldHVybiB1c2VyXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlID0gKHNwYWNlX2lkKSAtPlxyXG5cdHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcclxuXHRpZiBub3Qgc3BhY2VcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwic3BhY2VfaWTmnInor6/miJbmraRzcGFjZeW3sue7j+iiq+WIoOmZpFwiKVxyXG5cdHJldHVybiBzcGFjZVxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93ID0gKGZsb3dfaWQpIC0+XHJcblx0ZmxvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZmxvd3MuZmluZE9uZShmbG93X2lkKVxyXG5cdGlmIG5vdCBmbG93XHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcImlk5pyJ6K+v5oiW5q2k5rWB56iL5bey57uP6KKr5Yig6ZmkXCIpXHJcblx0cmV0dXJuIGZsb3dcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyID0gKHNwYWNlX2lkLCB1c2VyX2lkKSAtPlxyXG5cdHNwYWNlX3VzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlX3VzZXJzLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJfaWQgfSlcclxuXHRpZiBub3Qgc3BhY2VfdXNlclxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJ1c2VyX2lk5a+55bqU55qE55So5oi35LiN5bGe5LqO5b2T5YmNc3BhY2VcIilcclxuXHRyZXR1cm4gc3BhY2VfdXNlclxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXJPcmdJbmZvID0gKHNwYWNlX3VzZXIpIC0+XHJcblx0aW5mbyA9IG5ldyBPYmplY3RcclxuXHRpbmZvLm9yZ2FuaXphdGlvbiA9IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uXHJcblx0b3JnID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vcmdhbml6YXRpb25zLmZpbmRPbmUoc3BhY2VfdXNlci5vcmdhbml6YXRpb24sIHsgZmllbGRzOiB7IG5hbWU6IDEgLCBmdWxsbmFtZTogMSB9IH0pXHJcblx0aW5mby5vcmdhbml6YXRpb25fbmFtZSA9IG9yZy5uYW1lXHJcblx0aW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBvcmcuZnVsbG5hbWVcclxuXHRyZXR1cm4gaW5mb1xyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dFbmFibGVkID0gKGZsb3cpIC0+XHJcblx0aWYgZmxvdy5zdGF0ZSBpc250IFwiZW5hYmxlZFwiXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+acquWQr+eUqCzmk43kvZzlpLHotKVcIilcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93U3BhY2VNYXRjaGVkID0gKGZsb3csIHNwYWNlX2lkKSAtPlxyXG5cdGlmIGZsb3cuc3BhY2UgaXNudCBzcGFjZV9pZFxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvlkozlt6XkvZzljLpJROS4jeWMuemFjVwiKVxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtID0gKGZvcm1faWQpIC0+XHJcblx0Zm9ybSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZm9ybXMuZmluZE9uZShmb3JtX2lkKVxyXG5cdGlmIG5vdCBmb3JtXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn6KGo5Y2VSUTmnInor6/miJbmraTooajljZXlt7Lnu4/ooqvliKDpmaQnKVxyXG5cclxuXHRyZXR1cm4gZm9ybVxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeSA9IChjYXRlZ29yeV9pZCkgLT5cclxuXHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5jYXRlZ29yaWVzLmZpbmRPbmUoY2F0ZWdvcnlfaWQpXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNyZWF0ZV9pbnN0YW5jZSA9IChpbnN0YW5jZV9mcm9tX2NsaWVudCwgdXNlcl9pbmZvKSAtPlxyXG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdLCBTdHJpbmdcclxuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdLCBTdHJpbmdcclxuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl0sIFN0cmluZ1xyXG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXSwgW3tvOiBTdHJpbmcsIGlkczogW1N0cmluZ119XVxyXG5cclxuXHQjIOagoemqjOaYr+WQpnJlY29yZOW3sue7j+WPkei1t+eahOeUs+ivt+i/mOWcqOWuoeaJueS4rVxyXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tJc0luQXBwcm92YWwoaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdWzBdLCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdKVxyXG5cclxuXHRzcGFjZV9pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl1cclxuXHRmbG93X2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdXHJcblx0dXNlcl9pZCA9IHVzZXJfaW5mby5faWRcclxuXHQjIOiOt+WPluWJjeWPsOaJgOS8oOeahHRyYWNlXHJcblx0dHJhY2VfZnJvbV9jbGllbnQgPSBudWxsXHJcblx0IyDojrflj5bliY3lj7DmiYDkvKDnmoRhcHByb3ZlXHJcblx0YXBwcm92ZV9mcm9tX2NsaWVudCA9IG51bGxcclxuXHRpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXSBhbmQgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1cclxuXHRcdHRyYWNlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1cclxuXHRcdGlmIHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl0gYW5kIHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl1bMF1cclxuXHRcdFx0YXBwcm92ZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdW1wiYXBwcm92ZXNcIl1bMF1cclxuXHJcblx0IyDojrflj5bkuIDkuKpzcGFjZVxyXG5cdHNwYWNlID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZShzcGFjZV9pZClcclxuXHQjIOiOt+WPluS4gOS4qmZsb3dcclxuXHRmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpXHJcblx0IyDojrflj5bkuIDkuKpzcGFjZeS4i+eahOS4gOS4qnVzZXJcclxuXHRzcGFjZV91c2VyID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXIoc3BhY2VfaWQsIHVzZXJfaWQpXHJcblx0IyDojrflj5ZzcGFjZV91c2Vy5omA5Zyo55qE6YOo6Zeo5L+h5oGvXHJcblx0c3BhY2VfdXNlcl9vcmdfaW5mbyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyhzcGFjZV91c2VyKVxyXG5cdCMg5Yik5pat5LiA5LiqZmxvd+aYr+WQpuS4uuWQr+eUqOeKtuaAgVxyXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZChmbG93KVxyXG5cdCMg5Yik5pat5LiA5LiqZmxvd+WSjHNwYWNlX2lk5piv5ZCm5Yy56YWNXHJcblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQoZmxvdywgc3BhY2VfaWQpXHJcblxyXG5cdGZvcm0gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZvcm0oZmxvdy5mb3JtKVxyXG5cclxuXHRwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93X2lkLCB1c2VyX2lkKVxyXG5cclxuXHRpZiBub3QgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZGRcIilcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5b2T5YmN55So5oi35rKh5pyJ5q2k5rWB56iL55qE5paw5bu65p2D6ZmQXCIpXHJcblxyXG5cdG5vdyA9IG5ldyBEYXRlXHJcblx0aW5zX29iaiA9IHt9XHJcblx0aW5zX29iai5faWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5fbWFrZU5ld0lEKClcclxuXHRpbnNfb2JqLnNwYWNlID0gc3BhY2VfaWRcclxuXHRpbnNfb2JqLmZsb3cgPSBmbG93X2lkXHJcblx0aW5zX29iai5mbG93X3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuX2lkXHJcblx0aW5zX29iai5mb3JtID0gZmxvdy5mb3JtXHJcblx0aW5zX29iai5mb3JtX3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuZm9ybV92ZXJzaW9uXHJcblx0aW5zX29iai5uYW1lID0gZmxvdy5uYW1lXHJcblx0aW5zX29iai5zdWJtaXR0ZXIgPSB1c2VyX2lkXHJcblx0aW5zX29iai5zdWJtaXR0ZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lXHJcblx0aW5zX29iai5hcHBsaWNhbnQgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIGVsc2UgdXNlcl9pZFxyXG5cdGluc19vYmouYXBwbGljYW50X25hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSBlbHNlIHVzZXJfaW5mby5uYW1lXHJcblx0aW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdIGVsc2Ugc3BhY2VfdXNlci5vcmdhbml6YXRpb25cclxuXHRpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gZWxzZSBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9uYW1lXHJcblx0aW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdIGVsc2UgIHNwYWNlX3VzZXJfb3JnX2luZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lXHJcblx0aW5zX29iai5hcHBsaWNhbnRfY29tcGFueSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdIGVsc2Ugc3BhY2VfdXNlci5jb21wYW55X2lkXHJcblx0aW5zX29iai5zdGF0ZSA9ICdkcmFmdCdcclxuXHRpbnNfb2JqLmNvZGUgPSAnJ1xyXG5cdGluc19vYmouaXNfYXJjaGl2ZWQgPSBmYWxzZVxyXG5cdGluc19vYmouaXNfZGVsZXRlZCA9IGZhbHNlXHJcblx0aW5zX29iai5jcmVhdGVkID0gbm93XHJcblx0aW5zX29iai5jcmVhdGVkX2J5ID0gdXNlcl9pZFxyXG5cdGluc19vYmoubW9kaWZpZWQgPSBub3dcclxuXHRpbnNfb2JqLm1vZGlmaWVkX2J5ID0gdXNlcl9pZFxyXG5cdGluc19vYmoudmFsdWVzID0gbmV3IE9iamVjdFxyXG5cclxuXHRpbnNfb2JqLnJlY29yZF9pZHMgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl1cclxuXHJcblx0aWYgc3BhY2VfdXNlci5jb21wYW55X2lkXHJcblx0XHRpbnNfb2JqLmNvbXBhbnlfaWQgPSBzcGFjZV91c2VyLmNvbXBhbnlfaWRcclxuXHJcblx0IyDmlrDlu7pUcmFjZVxyXG5cdHRyYWNlX29iaiA9IHt9XHJcblx0dHJhY2Vfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHJcclxuXHR0cmFjZV9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZFxyXG5cdHRyYWNlX29iai5pc19maW5pc2hlZCA9IGZhbHNlXHJcblx0IyDlvZPliY3mnIDmlrDniYhmbG935Lit5byA5aeL6IqC54K5XHJcblx0c3RhcnRfc3RlcCA9IF8uZmluZChmbG93LmN1cnJlbnQuc3RlcHMsIChzdGVwKSAtPlxyXG5cdFx0cmV0dXJuIHN0ZXAuc3RlcF90eXBlIGlzICdzdGFydCdcclxuXHQpXHJcblx0dHJhY2Vfb2JqLnN0ZXAgPSBzdGFydF9zdGVwLl9pZFxyXG5cdHRyYWNlX29iai5uYW1lID0gc3RhcnRfc3RlcC5uYW1lXHJcblxyXG5cdHRyYWNlX29iai5zdGFydF9kYXRlID0gbm93XHJcblx0IyDmlrDlu7pBcHByb3ZlXHJcblx0YXBwcl9vYmogPSB7fVxyXG5cdGFwcHJfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHJcclxuXHRhcHByX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkXHJcblx0YXBwcl9vYmoudHJhY2UgPSB0cmFjZV9vYmouX2lkXHJcblx0YXBwcl9vYmouaXNfZmluaXNoZWQgPSBmYWxzZVxyXG5cdGFwcHJfb2JqLnVzZXIgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIGVsc2UgdXNlcl9pZFxyXG5cdGFwcHJfb2JqLnVzZXJfbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIGVsc2UgdXNlcl9pbmZvLm5hbWVcclxuXHRhcHByX29iai5oYW5kbGVyID0gdXNlcl9pZFxyXG5cdGFwcHJfb2JqLmhhbmRsZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lXHJcblx0YXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvblxyXG5cdGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX25hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLm5hbWVcclxuXHRhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IHNwYWNlX3VzZXJfb3JnX2luZm8uZnVsbG5hbWVcclxuXHRhcHByX29iai50eXBlID0gJ2RyYWZ0J1xyXG5cdGFwcHJfb2JqLnN0YXJ0X2RhdGUgPSBub3dcclxuXHRhcHByX29iai5yZWFkX2RhdGUgPSBub3dcclxuXHRhcHByX29iai5pc19yZWFkID0gdHJ1ZVxyXG5cdGFwcHJfb2JqLmlzX2Vycm9yID0gZmFsc2VcclxuXHRhcHByX29iai5kZXNjcmlwdGlvbiA9ICcnXHJcblx0cmVsYXRlZFRhYmxlc0luZm8gPSB7fVxyXG5cdGFwcHJfb2JqLnZhbHVlcyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMoaW5zX29iai5yZWNvcmRfaWRzWzBdLCBmbG93X2lkLCBzcGFjZV9pZCwgZm9ybS5jdXJyZW50LmZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pXHJcblxyXG5cdHRyYWNlX29iai5hcHByb3ZlcyA9IFthcHByX29ial1cclxuXHRpbnNfb2JqLnRyYWNlcyA9IFt0cmFjZV9vYmpdXHJcblxyXG5cdGluc19vYmouaW5ib3hfdXNlcnMgPSBpbnN0YW5jZV9mcm9tX2NsaWVudC5pbmJveF91c2VycyB8fCBbXVxyXG5cclxuXHRpbnNfb2JqLmN1cnJlbnRfc3RlcF9uYW1lID0gc3RhcnRfc3RlcC5uYW1lXHJcblxyXG5cdGlmIGZsb3cuYXV0b19yZW1pbmQgaXMgdHJ1ZVxyXG5cdFx0aW5zX29iai5hdXRvX3JlbWluZCA9IHRydWVcclxuXHJcblx0IyDmlrDlu7rnlLPor7fljZXml7bvvIxpbnN0YW5jZXPorrDlvZXmtYHnqIvlkI3np7DjgIHmtYHnqIvliIbnsbvlkI3np7AgIzEzMTNcclxuXHRpbnNfb2JqLmZsb3dfbmFtZSA9IGZsb3cubmFtZVxyXG5cdGlmIGZvcm0uY2F0ZWdvcnlcclxuXHRcdGNhdGVnb3J5ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeShmb3JtLmNhdGVnb3J5KVxyXG5cdFx0aWYgY2F0ZWdvcnlcclxuXHRcdFx0aW5zX29iai5jYXRlZ29yeV9uYW1lID0gY2F0ZWdvcnkubmFtZVxyXG5cdFx0XHRpbnNfb2JqLmNhdGVnb3J5ID0gY2F0ZWdvcnkuX2lkXHJcblxyXG5cdG5ld19pbnNfaWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5pbnNlcnQoaW5zX29iailcclxuXHJcblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlY29yZEluc3RhbmNlSW5mbyhpbnNfb2JqLnJlY29yZF9pZHNbMF0sIG5ld19pbnNfaWQsIHNwYWNlX2lkKVxyXG5cclxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyhyZWxhdGVkVGFibGVzSW5mbywgbmV3X2luc19pZCwgc3BhY2VfaWQpXHJcblxyXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2goaW5zX29iai5yZWNvcmRfaWRzWzBdLCBzcGFjZV9pZCwgaW5zX29iai5faWQsIGFwcHJfb2JqLl9pZClcclxuXHJcblx0cmV0dXJuIG5ld19pbnNfaWRcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMgPSAocmVjb3JkSWRzLCBmbG93SWQsIHNwYWNlSWQsIGZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pIC0+XHJcblx0ZmllbGRDb2RlcyA9IFtdXHJcblx0Xy5lYWNoIGZpZWxkcywgKGYpIC0+XHJcblx0XHRpZiBmLnR5cGUgPT0gJ3NlY3Rpb24nXHJcblx0XHRcdF8uZWFjaCBmLmZpZWxkcywgKGZmKSAtPlxyXG5cdFx0XHRcdGZpZWxkQ29kZXMucHVzaCBmZi5jb2RlXHJcblx0XHRlbHNlXHJcblx0XHRcdGZpZWxkQ29kZXMucHVzaCBmLmNvZGVcclxuXHJcblx0dmFsdWVzID0ge31cclxuXHRvYmplY3ROYW1lID0gcmVjb3JkSWRzLm9cclxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3ROYW1lLCBzcGFjZUlkKVxyXG5cdHJlY29yZElkID0gcmVjb3JkSWRzLmlkc1swXVxyXG5cdG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3Rfd29ya2Zsb3dzLmZpbmRPbmUoe1xyXG5cdFx0b2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXHJcblx0XHRmbG93X2lkOiBmbG93SWRcclxuXHR9KVxyXG5cdHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKHJlY29yZElkKVxyXG5cdGZsb3cgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShmbG93SWQsIHsgZmllbGRzOiB7IGZvcm06IDEgfSB9KVxyXG5cdGlmIG93IGFuZCByZWNvcmRcclxuXHRcdGZvcm0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJmb3Jtc1wiKS5maW5kT25lKGZsb3cuZm9ybSlcclxuXHRcdGZvcm1GaWVsZHMgPSBmb3JtLmN1cnJlbnQuZmllbGRzIHx8IFtdXHJcblx0XHRyZWxhdGVkT2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0TmFtZSwgc3BhY2VJZClcclxuXHRcdHJlbGF0ZWRPYmplY3RzS2V5cyA9IF8ucGx1Y2socmVsYXRlZE9iamVjdHMsICdvYmplY3RfbmFtZScpXHJcblx0XHRmb3JtVGFibGVGaWVsZHMgPSBfLmZpbHRlciBmb3JtRmllbGRzLCAoZm9ybUZpZWxkKSAtPlxyXG5cdFx0XHRyZXR1cm4gZm9ybUZpZWxkLnR5cGUgPT0gJ3RhYmxlJ1xyXG5cdFx0Zm9ybVRhYmxlRmllbGRzQ29kZSA9IF8ucGx1Y2soZm9ybVRhYmxlRmllbGRzLCAnY29kZScpXHJcblxyXG5cdFx0Z2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSA9ICAoa2V5KSAtPlxyXG5cdFx0XHRyZXR1cm4gXy5maW5kIHJlbGF0ZWRPYmplY3RzS2V5cywgIChyZWxhdGVkT2JqZWN0c0tleSkgLT5cclxuXHRcdFx0XHRyZXR1cm4ga2V5LnN0YXJ0c1dpdGgocmVsYXRlZE9iamVjdHNLZXkgKyAnLicpXHJcblxyXG5cdFx0Z2V0Rm9ybVRhYmxlRmllbGRDb2RlID0gKGtleSkgLT5cclxuXHRcdFx0cmV0dXJuIF8uZmluZCBmb3JtVGFibGVGaWVsZHNDb2RlLCAgKGZvcm1UYWJsZUZpZWxkQ29kZSkgLT5cclxuXHRcdFx0XHRyZXR1cm4ga2V5LnN0YXJ0c1dpdGgoZm9ybVRhYmxlRmllbGRDb2RlICsgJy4nKVxyXG5cclxuXHRcdGdldEZvcm1UYWJsZUZpZWxkID0gKGtleSkgLT5cclxuXHRcdFx0cmV0dXJuIF8uZmluZCBmb3JtVGFibGVGaWVsZHMsICAoZikgLT5cclxuXHRcdFx0XHRyZXR1cm4gZi5jb2RlID09IGtleVxyXG5cclxuXHRcdGdldEZvcm1GaWVsZCA9IChrZXkpIC0+XHJcblx0XHRcdGZmID0gbnVsbFxyXG5cdFx0XHRfLmZvckVhY2ggZm9ybUZpZWxkcywgKGYpIC0+XHJcblx0XHRcdFx0aWYgZmZcclxuXHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRcdGlmIGYudHlwZSA9PSAnc2VjdGlvbidcclxuXHRcdFx0XHRcdGZmID0gXy5maW5kIGYuZmllbGRzLCAgKHNmKSAtPlxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gc2YuY29kZSA9PSBrZXlcclxuXHRcdFx0XHRlbHNlIGlmIGYuY29kZSA9PSBrZXlcclxuXHRcdFx0XHRcdGZmID0gZlxyXG5cclxuXHRcdFx0cmV0dXJuIGZmXHJcblxyXG5cdFx0Z2V0Rm9ybVRhYmxlU3ViRmllbGQgPSAodGFibGVGaWVsZCwgc3ViRmllbGRDb2RlKSAtPlxyXG5cdFx0XHRyZXR1cm4gXy5maW5kIHRhYmxlRmllbGQuZmllbGRzLCAgKGYpIC0+XHJcblx0XHRcdFx0cmV0dXJuIGYuY29kZSA9PSBzdWJGaWVsZENvZGVcclxuXHJcblx0XHRnZXRGaWVsZE9kYXRhVmFsdWUgPSAob2JqTmFtZSwgaWQpIC0+XHJcblx0XHRcdG9iaiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKVxyXG5cdFx0XHRvID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqTmFtZSwgc3BhY2VJZClcclxuXHRcdFx0bmFtZUtleSA9IG8uTkFNRV9GSUVMRF9LRVlcclxuXHRcdFx0aWYgIW9ialxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRpZiBfLmlzU3RyaW5nIGlkXHJcblx0XHRcdFx0X3JlY29yZCA9IG9iai5maW5kT25lKGlkKVxyXG5cdFx0XHRcdGlmIF9yZWNvcmRcclxuXHRcdFx0XHRcdF9yZWNvcmRbJ0BsYWJlbCddID0gX3JlY29yZFtuYW1lS2V5XVxyXG5cdFx0XHRcdFx0cmV0dXJuIF9yZWNvcmRcclxuXHRcdFx0ZWxzZSBpZiBfLmlzQXJyYXkgaWRcclxuXHRcdFx0XHRfcmVjb3JkcyA9IFtdXHJcblx0XHRcdFx0b2JqLmZpbmQoeyBfaWQ6IHsgJGluOiBpZCB9IH0pLmZvckVhY2ggKF9yZWNvcmQpIC0+XHJcblx0XHRcdFx0XHRfcmVjb3JkWydAbGFiZWwnXSA9IF9yZWNvcmRbbmFtZUtleV1cclxuXHRcdFx0XHRcdF9yZWNvcmRzLnB1c2ggX3JlY29yZFxyXG5cclxuXHRcdFx0XHRpZiAhXy5pc0VtcHR5IF9yZWNvcmRzXHJcblx0XHRcdFx0XHRyZXR1cm4gX3JlY29yZHNcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0Z2V0U2VsZWN0VXNlclZhbHVlID0gKHVzZXJJZCwgc3BhY2VJZCkgLT5cclxuXHRcdFx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSlcclxuXHRcdFx0c3UuaWQgPSB1c2VySWRcclxuXHRcdFx0cmV0dXJuIHN1XHJcblxyXG5cdFx0Z2V0U2VsZWN0VXNlclZhbHVlcyA9ICh1c2VySWRzLCBzcGFjZUlkKSAtPlxyXG5cdFx0XHRzdXMgPSBbXVxyXG5cdFx0XHRpZiBfLmlzQXJyYXkgdXNlcklkc1xyXG5cdFx0XHRcdF8uZWFjaCB1c2VySWRzLCAodXNlcklkKSAtPlxyXG5cdFx0XHRcdFx0c3UgPSBnZXRTZWxlY3RVc2VyVmFsdWUodXNlcklkLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0aWYgc3VcclxuXHRcdFx0XHRcdFx0c3VzLnB1c2goc3UpXHJcblx0XHRcdHJldHVybiBzdXNcclxuXHJcblx0XHRnZXRTZWxlY3RPcmdWYWx1ZSA9IChvcmdJZCwgc3BhY2VJZCkgLT5cclxuXHRcdFx0b3JnID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZE9uZShvcmdJZCwgeyBmaWVsZHM6IHsgX2lkOiAxLCBuYW1lOiAxLCBmdWxsbmFtZTogMSB9IH0pXHJcblx0XHRcdG9yZy5pZCA9IG9yZ0lkXHJcblx0XHRcdHJldHVybiBvcmdcclxuXHJcblx0XHRnZXRTZWxlY3RPcmdWYWx1ZXMgPSAob3JnSWRzLCBzcGFjZUlkKSAtPlxyXG5cdFx0XHRvcmdzID0gW11cclxuXHRcdFx0aWYgXy5pc0FycmF5IG9yZ0lkc1xyXG5cdFx0XHRcdF8uZWFjaCBvcmdJZHMsIChvcmdJZCkgLT5cclxuXHRcdFx0XHRcdG9yZyA9IGdldFNlbGVjdE9yZ1ZhbHVlKG9yZ0lkLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0aWYgb3JnXHJcblx0XHRcdFx0XHRcdG9yZ3MucHVzaChvcmcpXHJcblx0XHRcdHJldHVybiBvcmdzXHJcblxyXG5cdFx0dGFibGVGaWVsZENvZGVzID0gW11cclxuXHRcdHRhYmxlRmllbGRNYXAgPSBbXVxyXG5cdFx0dGFibGVUb1JlbGF0ZWRNYXAgPSB7fVxyXG5cclxuXHRcdG93LmZpZWxkX21hcD8uZm9yRWFjaCAoZm0pIC0+XHJcblx0XHRcdG9iamVjdF9maWVsZCA9IGZtLm9iamVjdF9maWVsZFxyXG5cdFx0XHR3b3JrZmxvd19maWVsZCA9IGZtLndvcmtmbG93X2ZpZWxkXHJcblx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZENvZGUgPSBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlKG9iamVjdF9maWVsZClcclxuXHRcdFx0Zm9ybVRhYmxlRmllbGRDb2RlID0gZ2V0Rm9ybVRhYmxlRmllbGRDb2RlKHdvcmtmbG93X2ZpZWxkKVxyXG5cdFx0XHRvYmpGaWVsZCA9IG9iamVjdC5maWVsZHNbb2JqZWN0X2ZpZWxkXVxyXG5cdFx0XHRmb3JtRmllbGQgPSBnZXRGb3JtRmllbGQod29ya2Zsb3dfZmllbGQpXHJcblx0XHRcdCMg5aSE55CG5a2Q6KGo5a2X5q61XHJcblx0XHRcdGlmIHJlbGF0ZWRPYmplY3RGaWVsZENvZGVcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRvVGFibGVDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF1cclxuXHRcdFx0XHRvVGFibGVGaWVsZENvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXVxyXG5cdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwS2V5ID0gb1RhYmxlQ29kZVxyXG5cdFx0XHRcdGlmICF0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1cclxuXHRcdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSA9IHt9XHJcblxyXG5cdFx0XHRcdGlmIGZvcm1UYWJsZUZpZWxkQ29kZVxyXG5cdFx0XHRcdFx0d1RhYmxlQ29kZSA9IHdvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMF1cclxuXHRcdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVsnX0ZST01fVEFCTEVfQ09ERSddID0gd1RhYmxlQ29kZVxyXG5cclxuXHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bb1RhYmxlRmllbGRDb2RlXSA9IHdvcmtmbG93X2ZpZWxkXHJcblx0XHRcdCMg5Yik5pat5piv5ZCm5piv6KGo5qC85a2X5q61XHJcblx0XHRcdGVsc2UgaWYgd29ya2Zsb3dfZmllbGQuaW5kZXhPZignLiQuJykgPiAwIGFuZCBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPiAwXHJcblx0XHRcdFx0d1RhYmxlQ29kZSA9IHdvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJC4nKVswXVxyXG5cdFx0XHRcdG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzBdXHJcblx0XHRcdFx0aWYgcmVjb3JkLmhhc093blByb3BlcnR5KG9UYWJsZUNvZGUpIGFuZCBfLmlzQXJyYXkocmVjb3JkW29UYWJsZUNvZGVdKVxyXG5cdFx0XHRcdFx0dGFibGVGaWVsZENvZGVzLnB1c2goSlNPTi5zdHJpbmdpZnkoe1xyXG5cdFx0XHRcdFx0XHR3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxyXG5cdFx0XHRcdFx0XHRvYmplY3RfdGFibGVfZmllbGRfY29kZTogb1RhYmxlQ29kZVxyXG5cdFx0XHRcdFx0fSkpXHJcblx0XHRcdFx0XHR0YWJsZUZpZWxkTWFwLnB1c2goZm0pXHJcblxyXG5cdFx0XHQjIOWkhOeQhmxvb2t1cOOAgW1hc3Rlcl9kZXRhaWznsbvlnovlrZfmrrVcclxuXHRcdFx0ZWxzZSBpZiBvYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gMCBhbmQgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID09IC0xXHJcblx0XHRcdFx0b2JqZWN0RmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF1cclxuXHRcdFx0XHRsb29rdXBGaWVsZE5hbWUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXVxyXG5cdFx0XHRcdGlmIG9iamVjdFxyXG5cdFx0XHRcdFx0b2JqZWN0RmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdEZpZWxkTmFtZV1cclxuXHRcdFx0XHRcdGlmIG9iamVjdEZpZWxkICYmIGZvcm1GaWVsZCAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqZWN0RmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRcdGZpZWxkc09iaiA9IHt9XHJcblx0XHRcdFx0XHRcdGZpZWxkc09ialtsb29rdXBGaWVsZE5hbWVdID0gMVxyXG5cdFx0XHRcdFx0XHRsb29rdXBPYmplY3RSZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kT25lKHJlY29yZFtvYmplY3RGaWVsZE5hbWVdLCB7IGZpZWxkczogZmllbGRzT2JqIH0pXHJcblx0XHRcdFx0XHRcdG9iamVjdEZpZWxkT2JqZWN0TmFtZSA9IG9iamVjdEZpZWxkLnJlZmVyZW5jZV90b1xyXG5cdFx0XHRcdFx0XHRsb29rdXBGaWVsZE9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdEZpZWxkT2JqZWN0TmFtZSwgc3BhY2VJZClcclxuXHRcdFx0XHRcdFx0b2JqZWN0TG9va3VwRmllbGQgPSBsb29rdXBGaWVsZE9iai5maWVsZHNbbG9va3VwRmllbGROYW1lXVxyXG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBsb29rdXBPYmplY3RSZWNvcmRbbG9va3VwRmllbGROYW1lXVxyXG5cdFx0XHRcdFx0XHRpZiBvYmplY3RMb29rdXBGaWVsZCAmJiBmb3JtRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqZWN0TG9va3VwRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmplY3RMb29rdXBGaWVsZC5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvXHJcblx0XHRcdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlXHJcblx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAhb2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBvZGF0YUZpZWxkVmFsdWVcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBsb29rdXBPYmplY3RSZWNvcmRbbG9va3VwRmllbGROYW1lXVxyXG5cclxuXHRcdFx0IyBsb29rdXDjgIFtYXN0ZXJfZGV0YWls5a2X5q615ZCM5q2l5Yiwb2RhdGHlrZfmrrVcclxuXHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqRmllbGQucmVmZXJlbmNlX3RvXHJcblx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdXHJcblx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlXHJcblx0XHRcdFx0aWYgb2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXHJcblx0XHRcdFx0ZWxzZSBpZiAhb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxyXG5cdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBvZGF0YUZpZWxkVmFsdWVcclxuXHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiBbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdXHJcblx0XHRcdFx0aWYgIV8uaXNFbXB0eShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXHJcblx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlXHJcblx0XHRcdFx0XHRpZiBmb3JtRmllbGQudHlwZSA9PSAndXNlcidcclxuXHRcdFx0XHRcdFx0aWYgb2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHRlbHNlIGlmICFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRlbHNlIGlmIGZvcm1GaWVsZC50eXBlID09ICdncm91cCdcclxuXHRcdFx0XHRcdFx0aWYgb2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3RcclxuXHRcdFx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0aWYgc2VsZWN0RmllbGRWYWx1ZVxyXG5cdFx0XHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gc2VsZWN0RmllbGRWYWx1ZVxyXG5cdFx0XHRlbHNlIGlmIHJlY29yZC5oYXNPd25Qcm9wZXJ0eShvYmplY3RfZmllbGQpXHJcblx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHJlY29yZFtvYmplY3RfZmllbGRdXHJcblxyXG5cdFx0IyDooajmoLzlrZfmrrVcclxuXHRcdF8udW5pcSh0YWJsZUZpZWxkQ29kZXMpLmZvckVhY2ggKHRmYykgLT5cclxuXHRcdFx0YyA9IEpTT04ucGFyc2UodGZjKVxyXG5cdFx0XHR2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXSA9IFtdXHJcblx0XHRcdHJlY29yZFtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXS5mb3JFYWNoICh0cikgLT5cclxuXHRcdFx0XHRuZXdUciA9IHt9XHJcblx0XHRcdFx0Xy5lYWNoIHRyLCAodiwgaykgLT5cclxuXHRcdFx0XHRcdHRhYmxlRmllbGRNYXAuZm9yRWFjaCAodGZtKSAtPlxyXG5cdFx0XHRcdFx0XHRpZiB0Zm0ub2JqZWN0X2ZpZWxkIGlzIChjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlICsgJy4kLicgKyBrKVxyXG5cdFx0XHRcdFx0XHRcdHdUZENvZGUgPSB0Zm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4kLicpWzFdXHJcblx0XHRcdFx0XHRcdFx0bmV3VHJbd1RkQ29kZV0gPSB2XHJcblx0XHRcdFx0aWYgbm90IF8uaXNFbXB0eShuZXdUcilcclxuXHRcdFx0XHRcdHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdLnB1c2gobmV3VHIpXHJcblxyXG5cdFx0IyDlkIzmraXlrZDooajmlbDmja7oh7PooajljZXooajmoLxcclxuXHRcdF8uZWFjaCB0YWJsZVRvUmVsYXRlZE1hcCwgIChtYXAsIGtleSkgLT5cclxuXHRcdFx0dGFibGVDb2RlID0gbWFwLl9GUk9NX1RBQkxFX0NPREVcclxuXHRcdFx0Zm9ybVRhYmxlRmllbGQgPSBnZXRGb3JtVGFibGVGaWVsZCh0YWJsZUNvZGUpXHJcblx0XHRcdGlmICF0YWJsZUNvZGVcclxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ3RhYmxlVG9SZWxhdGVkOiBbJyArIGtleSArICddIG1pc3NpbmcgY29ycmVzcG9uZGluZyB0YWJsZS4nKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmVsYXRlZE9iamVjdE5hbWUgPSBrZXlcclxuXHRcdFx0XHR0YWJsZVZhbHVlcyA9IFtdXHJcblx0XHRcdFx0cmVsYXRlZFRhYmxlSXRlbXMgPSBbXVxyXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZClcclxuXHRcdFx0XHRyZWxhdGVkRmllbGQgPSBfLmZpbmQgcmVsYXRlZE9iamVjdC5maWVsZHMsIChmKSAtPlxyXG5cdFx0XHRcdFx0cmV0dXJuIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhmLnR5cGUpICYmIGYucmVmZXJlbmNlX3RvID09IG9iamVjdE5hbWVcclxuXHJcblx0XHRcdFx0cmVsYXRlZEZpZWxkTmFtZSA9IHJlbGF0ZWRGaWVsZC5uYW1lXHJcblxyXG5cdFx0XHRcdHNlbGVjdG9yID0ge31cclxuXHRcdFx0XHRzZWxlY3RvcltyZWxhdGVkRmllbGROYW1lXSA9IHJlY29yZElkXHJcblx0XHRcdFx0cmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpXHJcblx0XHRcdFx0cmVsYXRlZFJlY29yZHMgPSByZWxhdGVkQ29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKVxyXG5cclxuXHRcdFx0XHRyZWxhdGVkUmVjb3Jkcy5mb3JFYWNoIChycikgLT5cclxuXHRcdFx0XHRcdHRhYmxlVmFsdWVJdGVtID0ge31cclxuXHRcdFx0XHRcdF8uZWFjaCBtYXAsICh2YWx1ZUtleSwgZmllbGRLZXkpIC0+XHJcblx0XHRcdFx0XHRcdGlmIGZpZWxkS2V5ICE9ICdfRlJPTV9UQUJMRV9DT0RFJ1xyXG5cdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZVxyXG5cdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleVxyXG5cdFx0XHRcdFx0XHRcdGlmIHZhbHVlS2V5LnN0YXJ0c1dpdGgodGFibGVDb2RlICsgJy4nKVxyXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkS2V5ID0gKHZhbHVlS2V5LnNwbGl0KFwiLlwiKVsxXSlcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXkgPSB2YWx1ZUtleVxyXG5cdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdGZvcm1GaWVsZCA9IGdldEZvcm1UYWJsZVN1YkZpZWxkKGZvcm1UYWJsZUZpZWxkLCBmb3JtRmllbGRLZXkpXHJcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkID0gcmVsYXRlZE9iamVjdC5maWVsZHNbZmllbGRLZXldXHJcblx0XHRcdFx0XHRcdFx0aWYgIWZvcm1GaWVsZCB8fCAhcmVsYXRlZE9iamVjdEZpZWxkXHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRcdFx0XHRpZiBmb3JtRmllbGQudHlwZSA9PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhyZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gcmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90b1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcnJbZmllbGRLZXldXHJcblx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKGZvcm1GaWVsZC50eXBlKSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV1cclxuXHRcdFx0XHRcdFx0XHRcdGlmICFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBmb3JtRmllbGQudHlwZSA9PSAndXNlcidcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmICFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQudHlwZSA9PSAnZ3JvdXAnXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmICFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XVxyXG5cdFx0XHRcdFx0XHRcdHRhYmxlVmFsdWVJdGVtW2Zvcm1GaWVsZEtleV0gPSB0YWJsZUZpZWxkVmFsdWVcclxuXHRcdFx0XHRcdGlmICFfLmlzRW1wdHkodGFibGVWYWx1ZUl0ZW0pXHJcblx0XHRcdFx0XHRcdHRhYmxlVmFsdWVJdGVtLl9pZCA9IHJyLl9pZFxyXG5cdFx0XHRcdFx0XHR0YWJsZVZhbHVlcy5wdXNoKHRhYmxlVmFsdWVJdGVtKVxyXG5cdFx0XHRcdFx0XHRyZWxhdGVkVGFibGVJdGVtcy5wdXNoKHsgX3RhYmxlOiB7IF9pZDogcnIuX2lkLCBfY29kZTogdGFibGVDb2RlIH0gfSApXHJcblxyXG5cdFx0XHRcdHZhbHVlc1t0YWJsZUNvZGVdID0gdGFibGVWYWx1ZXNcclxuXHRcdFx0XHRyZWxhdGVkVGFibGVzSW5mb1tyZWxhdGVkT2JqZWN0TmFtZV0gPSByZWxhdGVkVGFibGVJdGVtc1xyXG5cclxuXHRcdCMg5aaC5p6c6YWN572u5LqG6ISa5pys5YiZ5omn6KGM6ISa5pysXHJcblx0XHRpZiBvdy5maWVsZF9tYXBfc2NyaXB0XHJcblx0XHRcdF8uZXh0ZW5kKHZhbHVlcywgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5ldmFsRmllbGRNYXBTY3JpcHQob3cuZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgcmVjb3JkSWQpKVxyXG5cclxuXHQjIOi/h+a7pOaOiXZhbHVlc+S4reeahOmdnuazlWtleVxyXG5cdGZpbHRlclZhbHVlcyA9IHt9XHJcblx0Xy5lYWNoIF8ua2V5cyh2YWx1ZXMpLCAoaykgLT5cclxuXHRcdGlmIGZpZWxkQ29kZXMuaW5jbHVkZXMoaylcclxuXHRcdFx0ZmlsdGVyVmFsdWVzW2tdID0gdmFsdWVzW2tdXHJcblxyXG5cdHJldHVybiBmaWx0ZXJWYWx1ZXNcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0ID0gKGZpZWxkX21hcF9zY3JpcHQsIG9iamVjdE5hbWUsIHNwYWNlSWQsIG9iamVjdElkKSAtPlxyXG5cdHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKG9iamVjdElkKVxyXG5cdHNjcmlwdCA9IFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocmVjb3JkKSB7IFwiICsgZmllbGRfbWFwX3NjcmlwdCArIFwiIH1cIlxyXG5cdGZ1bmMgPSBfZXZhbChzY3JpcHQsIFwiZmllbGRfbWFwX3NjcmlwdFwiKVxyXG5cdHZhbHVlcyA9IGZ1bmMocmVjb3JkKVxyXG5cdGlmIF8uaXNPYmplY3QgdmFsdWVzXHJcblx0XHRyZXR1cm4gdmFsdWVzXHJcblx0ZWxzZVxyXG5cdFx0Y29uc29sZS5lcnJvciBcImV2YWxGaWVsZE1hcFNjcmlwdDog6ISa5pys6L+U5Zue5YC857G75Z6L5LiN5piv5a+56LGhXCJcclxuXHRyZXR1cm4ge31cclxuXHJcblxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZUF0dGFjaCA9IChyZWNvcmRJZHMsIHNwYWNlSWQsIGluc0lkLCBhcHByb3ZlSWQpIC0+XHJcblxyXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbJ2Ntc19maWxlcyddLmZpbmQoe1xyXG5cdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRwYXJlbnQ6IHJlY29yZElkc1xyXG5cdH0pLmZvckVhY2ggKGNmKSAtPlxyXG5cdFx0Xy5lYWNoIGNmLnZlcnNpb25zLCAodmVyc2lvbklkLCBpZHgpIC0+XHJcblx0XHRcdGYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zWydjZnMuZmlsZXMuZmlsZXJlY29yZCddLmZpbmRPbmUodmVyc2lvbklkKVxyXG5cdFx0XHRuZXdGaWxlID0gbmV3IEZTLkZpbGUoKVxyXG5cclxuXHRcdFx0bmV3RmlsZS5hdHRhY2hEYXRhIGYuY3JlYXRlUmVhZFN0cmVhbSgnZmlsZXMnKSwge1xyXG5cdFx0XHRcdFx0dHlwZTogZi5vcmlnaW5hbC50eXBlXHJcblx0XHRcdH0sIChlcnIpIC0+XHJcblx0XHRcdFx0aWYgKGVycilcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyLmVycm9yLCBlcnIucmVhc29uKVxyXG5cclxuXHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpXHJcblx0XHRcdFx0bmV3RmlsZS5zaXplKGYuc2l6ZSgpKVxyXG5cdFx0XHRcdG1ldGFkYXRhID0ge1xyXG5cdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRvd25lcl9uYW1lOiBmLm1ldGFkYXRhLm93bmVyX25hbWUsXHJcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFx0XHRcdGluc3RhbmNlOiBpbnNJZCxcclxuXHRcdFx0XHRcdGFwcHJvdmU6IGFwcHJvdmVJZFxyXG5cdFx0XHRcdFx0cGFyZW50OiBjZi5faWRcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIGlkeCBpcyAwXHJcblx0XHRcdFx0XHRtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZVxyXG5cclxuXHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGFcclxuXHRcdFx0XHRjZnMuaW5zdGFuY2VzLmluc2VydChuZXdGaWxlKVxyXG5cclxuXHRyZXR1cm5cclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8gPSAocmVjb3JkSWRzLCBpbnNJZCwgc3BhY2VJZCkgLT5cclxuXHRDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLnVwZGF0ZShyZWNvcmRJZHMuaWRzWzBdLCB7XHJcblx0XHQkcHVzaDoge1xyXG5cdFx0XHRpbnN0YW5jZXM6IHtcclxuXHRcdFx0XHQkZWFjaDogW3tcclxuXHRcdFx0XHRcdF9pZDogaW5zSWQsXHJcblx0XHRcdFx0XHRzdGF0ZTogJ2RyYWZ0J1xyXG5cdFx0XHRcdH1dLFxyXG5cdFx0XHRcdCRwb3NpdGlvbjogMFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0JHNldDoge1xyXG5cdFx0XHRsb2NrZWQ6IHRydWVcclxuXHRcdFx0aW5zdGFuY2Vfc3RhdGU6ICdkcmFmdCdcclxuXHRcdH1cclxuXHR9KVxyXG5cclxuXHRyZXR1cm5cclxuXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyA9IChyZWxhdGVkVGFibGVzSW5mbywgaW5zSWQsIHNwYWNlSWQpIC0+XHJcblx0Xy5lYWNoIHJlbGF0ZWRUYWJsZXNJbmZvLCAodGFibGVJdGVtcywgcmVsYXRlZE9iamVjdE5hbWUpIC0+XHJcblx0XHRyZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZClcclxuXHRcdF8uZWFjaCB0YWJsZUl0ZW1zLCAoaXRlbSkgLT5cclxuXHRcdFx0cmVsYXRlZENvbGxlY3Rpb24udXBkYXRlKGl0ZW0uX3RhYmxlLl9pZCwge1xyXG5cdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdGluc3RhbmNlczogW3tcclxuXHRcdFx0XHRcdFx0X2lkOiBpbnNJZCxcclxuXHRcdFx0XHRcdFx0c3RhdGU6ICdkcmFmdCdcclxuXHRcdFx0XHRcdH1dLFxyXG5cdFx0XHRcdFx0X3RhYmxlOiBpdGVtLl90YWJsZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHJcblx0cmV0dXJuXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsID0gKHJlY29yZElkcywgc3BhY2VJZCkgLT5cclxuXHRyZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLmZpbmRPbmUoe1xyXG5cdFx0X2lkOiByZWNvcmRJZHMuaWRzWzBdLCBpbnN0YW5jZXM6IHsgJGV4aXN0czogdHJ1ZSB9XHJcblx0fSwgeyBmaWVsZHM6IHsgaW5zdGFuY2VzOiAxIH0gfSlcclxuXHJcblx0aWYgcmVjb3JkIGFuZCByZWNvcmQuaW5zdGFuY2VzWzBdLnN0YXRlIGlzbnQgJ2NvbXBsZXRlZCcgYW5kIENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmZpbmQocmVjb3JkLmluc3RhbmNlc1swXS5faWQpLmNvdW50KCkgPiAwXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuatpOiusOW9leW3suWPkei1t+a1geeoi+ato+WcqOWuoeaJueS4re+8jOW+heWuoeaJuee7k+adn+aWueWPr+WPkei1t+S4i+S4gOasoeWuoeaJue+8gVwiKVxyXG5cclxuXHRyZXR1cm5cclxuXHJcbiIsInZhciBfZXZhbCwgb2JqZWN0cWw7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbl9ldmFsID0gcmVxdWlyZSgnZXZhbCcpO1xuXG5vYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJyk7XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwgPSB7fTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja19hdXRob3JpemF0aW9uID0gZnVuY3Rpb24ocmVxKSB7XG4gIHZhciBhdXRoVG9rZW4sIGhhc2hlZFRva2VuLCBxdWVyeSwgdXNlciwgdXNlcklkO1xuICBxdWVyeSA9IHJlcS5xdWVyeTtcbiAgdXNlcklkID0gcXVlcnlbXCJYLVVzZXItSWRcIl07XG4gIGF1dGhUb2tlbiA9IHF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdO1xuICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgIF9pZDogdXNlcklkLFxuICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gIH0pO1xuICBpZiAoIXVzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIHJldHVybiB1c2VyO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZSA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHZhciBzcGFjZTtcbiAgc3BhY2UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgaWYgKCFzcGFjZSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwic3BhY2VfaWTmnInor6/miJbmraRzcGFjZeW3sue7j+iiq+WIoOmZpFwiKTtcbiAgfVxuICByZXR1cm4gc3BhY2U7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3cgPSBmdW5jdGlvbihmbG93X2lkKSB7XG4gIHZhciBmbG93O1xuICBmbG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5mbG93cy5maW5kT25lKGZsb3dfaWQpO1xuICBpZiAoIWZsb3cpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcImlk5pyJ6K+v5oiW5q2k5rWB56iL5bey57uP6KKr5Yig6ZmkXCIpO1xuICB9XG4gIHJldHVybiBmbG93O1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXIgPSBmdW5jdGlvbihzcGFjZV9pZCwgdXNlcl9pZCkge1xuICB2YXIgc3BhY2VfdXNlcjtcbiAgc3BhY2VfdXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHVzZXI6IHVzZXJfaWRcbiAgfSk7XG4gIGlmICghc3BhY2VfdXNlcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwidXNlcl9pZOWvueW6lOeahOeUqOaIt+S4jeWxnuS6juW9k+WJjXNwYWNlXCIpO1xuICB9XG4gIHJldHVybiBzcGFjZV91c2VyO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXJPcmdJbmZvID0gZnVuY3Rpb24oc3BhY2VfdXNlcikge1xuICB2YXIgaW5mbywgb3JnO1xuICBpbmZvID0gbmV3IE9iamVjdDtcbiAgaW5mby5vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbjtcbiAgb3JnID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vcmdhbml6YXRpb25zLmZpbmRPbmUoc3BhY2VfdXNlci5vcmdhbml6YXRpb24sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIG5hbWU6IDEsXG4gICAgICBmdWxsbmFtZTogMVxuICAgIH1cbiAgfSk7XG4gIGluZm8ub3JnYW5pemF0aW9uX25hbWUgPSBvcmcubmFtZTtcbiAgaW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBvcmcuZnVsbG5hbWU7XG4gIHJldHVybiBpbmZvO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dFbmFibGVkID0gZnVuY3Rpb24oZmxvdykge1xuICBpZiAoZmxvdy5zdGF0ZSAhPT0gXCJlbmFibGVkXCIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+acquWQr+eUqCzmk43kvZzlpLHotKVcIik7XG4gIH1cbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93U3BhY2VNYXRjaGVkID0gZnVuY3Rpb24oZmxvdywgc3BhY2VfaWQpIHtcbiAgaWYgKGZsb3cuc3BhY2UgIT09IHNwYWNlX2lkKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvlkozlt6XkvZzljLpJROS4jeWMuemFjVwiKTtcbiAgfVxufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtID0gZnVuY3Rpb24oZm9ybV9pZCkge1xuICB2YXIgZm9ybTtcbiAgZm9ybSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZm9ybXMuZmluZE9uZShmb3JtX2lkKTtcbiAgaWYgKCFmb3JtKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+ihqOWNlUlE5pyJ6K+v5oiW5q2k6KGo5Y2V5bey57uP6KKr5Yig6ZmkJyk7XG4gIH1cbiAgcmV0dXJuIGZvcm07XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldENhdGVnb3J5ID0gZnVuY3Rpb24oY2F0ZWdvcnlfaWQpIHtcbiAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuY2F0ZWdvcmllcy5maW5kT25lKGNhdGVnb3J5X2lkKTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY3JlYXRlX2luc3RhbmNlID0gZnVuY3Rpb24oaW5zdGFuY2VfZnJvbV9jbGllbnQsIHVzZXJfaW5mbykge1xuICB2YXIgYXBwcl9vYmosIGFwcHJvdmVfZnJvbV9jbGllbnQsIGNhdGVnb3J5LCBmbG93LCBmbG93X2lkLCBmb3JtLCBpbnNfb2JqLCBuZXdfaW5zX2lkLCBub3csIHBlcm1pc3Npb25zLCByZWxhdGVkVGFibGVzSW5mbywgc3BhY2UsIHNwYWNlX2lkLCBzcGFjZV91c2VyLCBzcGFjZV91c2VyX29yZ19pbmZvLCBzdGFydF9zdGVwLCB0cmFjZV9mcm9tX2NsaWVudCwgdHJhY2Vfb2JqLCB1c2VyX2lkO1xuICBjaGVjayhpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSwgU3RyaW5nKTtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSwgU3RyaW5nKTtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdLCBTdHJpbmcpO1xuICBjaGVjayhpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl0sIFtcbiAgICB7XG4gICAgICBvOiBTdHJpbmcsXG4gICAgICBpZHM6IFtTdHJpbmddXG4gICAgfVxuICBdKTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja0lzSW5BcHByb3ZhbChpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl1bMF0sIGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0pO1xuICBzcGFjZV9pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl07XG4gIGZsb3dfaWQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl07XG4gIHVzZXJfaWQgPSB1c2VyX2luZm8uX2lkO1xuICB0cmFjZV9mcm9tX2NsaWVudCA9IG51bGw7XG4gIGFwcHJvdmVfZnJvbV9jbGllbnQgPSBudWxsO1xuICBpZiAoaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl0gJiYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF0pIHtcbiAgICB0cmFjZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdO1xuICAgIGlmICh0cmFjZV9mcm9tX2NsaWVudFtcImFwcHJvdmVzXCJdICYmIHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl1bMF0pIHtcbiAgICAgIGFwcHJvdmVfZnJvbV9jbGllbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXVtcImFwcHJvdmVzXCJdWzBdO1xuICAgIH1cbiAgfVxuICBzcGFjZSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2Uoc3BhY2VfaWQpO1xuICBmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpO1xuICBzcGFjZV91c2VyID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXIoc3BhY2VfaWQsIHVzZXJfaWQpO1xuICBzcGFjZV91c2VyX29yZ19pbmZvID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXJPcmdJbmZvKHNwYWNlX3VzZXIpO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd0VuYWJsZWQoZmxvdyk7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93U3BhY2VNYXRjaGVkKGZsb3csIHNwYWNlX2lkKTtcbiAgZm9ybSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybShmbG93LmZvcm0pO1xuICBwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93X2lkLCB1c2VyX2lkKTtcbiAgaWYgKCFwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkZFwiKSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5b2T5YmN55So5oi35rKh5pyJ5q2k5rWB56iL55qE5paw5bu65p2D6ZmQXCIpO1xuICB9XG4gIG5vdyA9IG5ldyBEYXRlO1xuICBpbnNfb2JqID0ge307XG4gIGluc19vYmouX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuX21ha2VOZXdJRCgpO1xuICBpbnNfb2JqLnNwYWNlID0gc3BhY2VfaWQ7XG4gIGluc19vYmouZmxvdyA9IGZsb3dfaWQ7XG4gIGluc19vYmouZmxvd192ZXJzaW9uID0gZmxvdy5jdXJyZW50Ll9pZDtcbiAgaW5zX29iai5mb3JtID0gZmxvdy5mb3JtO1xuICBpbnNfb2JqLmZvcm1fdmVyc2lvbiA9IGZsb3cuY3VycmVudC5mb3JtX3ZlcnNpb247XG4gIGluc19vYmoubmFtZSA9IGZsb3cubmFtZTtcbiAgaW5zX29iai5zdWJtaXR0ZXIgPSB1c2VyX2lkO1xuICBpbnNfb2JqLnN1Ym1pdHRlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWU7XG4gIGluc19vYmouYXBwbGljYW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA6IHVzZXJfaWQ7XG4gIGluc19vYmouYXBwbGljYW50X25hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA6IHVzZXJfaW5mby5uYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb24gPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25cIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25cIl0gOiBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbjtcbiAgaW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdIDogc3BhY2VfdXNlcl9vcmdfaW5mby5vcmdhbml6YXRpb25fbmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdIDogc3BhY2VfdXNlcl9vcmdfaW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWU7XG4gIGluc19vYmouYXBwbGljYW50X2NvbXBhbnkgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfY29tcGFueVwiXSA6IHNwYWNlX3VzZXIuY29tcGFueV9pZDtcbiAgaW5zX29iai5zdGF0ZSA9ICdkcmFmdCc7XG4gIGluc19vYmouY29kZSA9ICcnO1xuICBpbnNfb2JqLmlzX2FyY2hpdmVkID0gZmFsc2U7XG4gIGluc19vYmouaXNfZGVsZXRlZCA9IGZhbHNlO1xuICBpbnNfb2JqLmNyZWF0ZWQgPSBub3c7XG4gIGluc19vYmouY3JlYXRlZF9ieSA9IHVzZXJfaWQ7XG4gIGluc19vYmoubW9kaWZpZWQgPSBub3c7XG4gIGluc19vYmoubW9kaWZpZWRfYnkgPSB1c2VyX2lkO1xuICBpbnNfb2JqLnZhbHVlcyA9IG5ldyBPYmplY3Q7XG4gIGluc19vYmoucmVjb3JkX2lkcyA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXTtcbiAgaWYgKHNwYWNlX3VzZXIuY29tcGFueV9pZCkge1xuICAgIGluc19vYmouY29tcGFueV9pZCA9IHNwYWNlX3VzZXIuY29tcGFueV9pZDtcbiAgfVxuICB0cmFjZV9vYmogPSB7fTtcbiAgdHJhY2Vfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHI7XG4gIHRyYWNlX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkO1xuICB0cmFjZV9vYmouaXNfZmluaXNoZWQgPSBmYWxzZTtcbiAgc3RhcnRfc3RlcCA9IF8uZmluZChmbG93LmN1cnJlbnQuc3RlcHMsIGZ1bmN0aW9uKHN0ZXApIHtcbiAgICByZXR1cm4gc3RlcC5zdGVwX3R5cGUgPT09ICdzdGFydCc7XG4gIH0pO1xuICB0cmFjZV9vYmouc3RlcCA9IHN0YXJ0X3N0ZXAuX2lkO1xuICB0cmFjZV9vYmoubmFtZSA9IHN0YXJ0X3N0ZXAubmFtZTtcbiAgdHJhY2Vfb2JqLnN0YXJ0X2RhdGUgPSBub3c7XG4gIGFwcHJfb2JqID0ge307XG4gIGFwcHJfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHI7XG4gIGFwcHJfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWQ7XG4gIGFwcHJfb2JqLnRyYWNlID0gdHJhY2Vfb2JqLl9pZDtcbiAgYXBwcl9vYmouaXNfZmluaXNoZWQgPSBmYWxzZTtcbiAgYXBwcl9vYmoudXNlciA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gOiB1c2VyX2lkO1xuICBhcHByX29iai51c2VyX25hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA6IHVzZXJfaW5mby5uYW1lO1xuICBhcHByX29iai5oYW5kbGVyID0gdXNlcl9pZDtcbiAgYXBwcl9vYmouaGFuZGxlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWU7XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb247XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX25hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLm5hbWU7XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5mdWxsbmFtZTtcbiAgYXBwcl9vYmoudHlwZSA9ICdkcmFmdCc7XG4gIGFwcHJfb2JqLnN0YXJ0X2RhdGUgPSBub3c7XG4gIGFwcHJfb2JqLnJlYWRfZGF0ZSA9IG5vdztcbiAgYXBwcl9vYmouaXNfcmVhZCA9IHRydWU7XG4gIGFwcHJfb2JqLmlzX2Vycm9yID0gZmFsc2U7XG4gIGFwcHJfb2JqLmRlc2NyaXB0aW9uID0gJyc7XG4gIHJlbGF0ZWRUYWJsZXNJbmZvID0ge307XG4gIGFwcHJfb2JqLnZhbHVlcyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMoaW5zX29iai5yZWNvcmRfaWRzWzBdLCBmbG93X2lkLCBzcGFjZV9pZCwgZm9ybS5jdXJyZW50LmZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pO1xuICB0cmFjZV9vYmouYXBwcm92ZXMgPSBbYXBwcl9vYmpdO1xuICBpbnNfb2JqLnRyYWNlcyA9IFt0cmFjZV9vYmpdO1xuICBpbnNfb2JqLmluYm94X3VzZXJzID0gaW5zdGFuY2VfZnJvbV9jbGllbnQuaW5ib3hfdXNlcnMgfHwgW107XG4gIGluc19vYmouY3VycmVudF9zdGVwX25hbWUgPSBzdGFydF9zdGVwLm5hbWU7XG4gIGlmIChmbG93LmF1dG9fcmVtaW5kID09PSB0cnVlKSB7XG4gICAgaW5zX29iai5hdXRvX3JlbWluZCA9IHRydWU7XG4gIH1cbiAgaW5zX29iai5mbG93X25hbWUgPSBmbG93Lm5hbWU7XG4gIGlmIChmb3JtLmNhdGVnb3J5KSB7XG4gICAgY2F0ZWdvcnkgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldENhdGVnb3J5KGZvcm0uY2F0ZWdvcnkpO1xuICAgIGlmIChjYXRlZ29yeSkge1xuICAgICAgaW5zX29iai5jYXRlZ29yeV9uYW1lID0gY2F0ZWdvcnkubmFtZTtcbiAgICAgIGluc19vYmouY2F0ZWdvcnkgPSBjYXRlZ29yeS5faWQ7XG4gICAgfVxuICB9XG4gIG5ld19pbnNfaWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5pbnNlcnQoaW5zX29iaik7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8oaW5zX29iai5yZWNvcmRfaWRzWzBdLCBuZXdfaW5zX2lkLCBzcGFjZV9pZCk7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvKHJlbGF0ZWRUYWJsZXNJbmZvLCBuZXdfaW5zX2lkLCBzcGFjZV9pZCk7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2goaW5zX29iai5yZWNvcmRfaWRzWzBdLCBzcGFjZV9pZCwgaW5zX29iai5faWQsIGFwcHJfb2JqLl9pZCk7XG4gIHJldHVybiBuZXdfaW5zX2lkO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVZhbHVlcyA9IGZ1bmN0aW9uKHJlY29yZElkcywgZmxvd0lkLCBzcGFjZUlkLCBmaWVsZHMsIHJlbGF0ZWRUYWJsZXNJbmZvKSB7XG4gIHZhciBmaWVsZENvZGVzLCBmaWx0ZXJWYWx1ZXMsIGZsb3csIGZvcm0sIGZvcm1GaWVsZHMsIGZvcm1UYWJsZUZpZWxkcywgZm9ybVRhYmxlRmllbGRzQ29kZSwgZ2V0RmllbGRPZGF0YVZhbHVlLCBnZXRGb3JtRmllbGQsIGdldEZvcm1UYWJsZUZpZWxkLCBnZXRGb3JtVGFibGVGaWVsZENvZGUsIGdldEZvcm1UYWJsZVN1YkZpZWxkLCBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlLCBnZXRTZWxlY3RPcmdWYWx1ZSwgZ2V0U2VsZWN0T3JnVmFsdWVzLCBnZXRTZWxlY3RVc2VyVmFsdWUsIGdldFNlbGVjdFVzZXJWYWx1ZXMsIG9iamVjdCwgb2JqZWN0TmFtZSwgb3csIHJlY29yZCwgcmVjb3JkSWQsIHJlZiwgcmVsYXRlZE9iamVjdHMsIHJlbGF0ZWRPYmplY3RzS2V5cywgdGFibGVGaWVsZENvZGVzLCB0YWJsZUZpZWxkTWFwLCB0YWJsZVRvUmVsYXRlZE1hcCwgdmFsdWVzO1xuICBmaWVsZENvZGVzID0gW107XG4gIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICBpZiAoZi50eXBlID09PSAnc2VjdGlvbicpIHtcbiAgICAgIHJldHVybiBfLmVhY2goZi5maWVsZHMsIGZ1bmN0aW9uKGZmKSB7XG4gICAgICAgIHJldHVybiBmaWVsZENvZGVzLnB1c2goZmYuY29kZSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpZWxkQ29kZXMucHVzaChmLmNvZGUpO1xuICAgIH1cbiAgfSk7XG4gIHZhbHVlcyA9IHt9O1xuICBvYmplY3ROYW1lID0gcmVjb3JkSWRzLm87XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdE5hbWUsIHNwYWNlSWQpO1xuICByZWNvcmRJZCA9IHJlY29yZElkcy5pZHNbMF07XG4gIG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3Rfd29ya2Zsb3dzLmZpbmRPbmUoe1xuICAgIG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxuICAgIGZsb3dfaWQ6IGZsb3dJZFxuICB9KTtcbiAgcmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLmZpbmRPbmUocmVjb3JkSWQpO1xuICBmbG93ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoZmxvd0lkLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBmb3JtOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKG93ICYmIHJlY29yZCkge1xuICAgIGZvcm0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJmb3Jtc1wiKS5maW5kT25lKGZsb3cuZm9ybSk7XG4gICAgZm9ybUZpZWxkcyA9IGZvcm0uY3VycmVudC5maWVsZHMgfHwgW107XG4gICAgcmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdE5hbWUsIHNwYWNlSWQpO1xuICAgIHJlbGF0ZWRPYmplY3RzS2V5cyA9IF8ucGx1Y2socmVsYXRlZE9iamVjdHMsICdvYmplY3RfbmFtZScpO1xuICAgIGZvcm1UYWJsZUZpZWxkcyA9IF8uZmlsdGVyKGZvcm1GaWVsZHMsIGZ1bmN0aW9uKGZvcm1GaWVsZCkge1xuICAgICAgcmV0dXJuIGZvcm1GaWVsZC50eXBlID09PSAndGFibGUnO1xuICAgIH0pO1xuICAgIGZvcm1UYWJsZUZpZWxkc0NvZGUgPSBfLnBsdWNrKGZvcm1UYWJsZUZpZWxkcywgJ2NvZGUnKTtcbiAgICBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKHJlbGF0ZWRPYmplY3RzS2V5cywgZnVuY3Rpb24ocmVsYXRlZE9iamVjdHNLZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleS5zdGFydHNXaXRoKHJlbGF0ZWRPYmplY3RzS2V5ICsgJy4nKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlRmllbGRDb2RlID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKGZvcm1UYWJsZUZpZWxkc0NvZGUsIGZ1bmN0aW9uKGZvcm1UYWJsZUZpZWxkQ29kZSkge1xuICAgICAgICByZXR1cm4ga2V5LnN0YXJ0c1dpdGgoZm9ybVRhYmxlRmllbGRDb2RlICsgJy4nKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlRmllbGQgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBfLmZpbmQoZm9ybVRhYmxlRmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgIHJldHVybiBmLmNvZGUgPT09IGtleTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybUZpZWxkID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgZmY7XG4gICAgICBmZiA9IG51bGw7XG4gICAgICBfLmZvckVhY2goZm9ybUZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgICAgICBpZiAoZmYpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIGZmID0gXy5maW5kKGYuZmllbGRzLCBmdW5jdGlvbihzZikge1xuICAgICAgICAgICAgcmV0dXJuIHNmLmNvZGUgPT09IGtleTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChmLmNvZGUgPT09IGtleSkge1xuICAgICAgICAgIHJldHVybiBmZiA9IGY7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZmO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlU3ViRmllbGQgPSBmdW5jdGlvbih0YWJsZUZpZWxkLCBzdWJGaWVsZENvZGUpIHtcbiAgICAgIHJldHVybiBfLmZpbmQodGFibGVGaWVsZC5maWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgcmV0dXJuIGYuY29kZSA9PT0gc3ViRmllbGRDb2RlO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRGaWVsZE9kYXRhVmFsdWUgPSBmdW5jdGlvbihvYmpOYW1lLCBpZCkge1xuICAgICAgdmFyIF9yZWNvcmQsIF9yZWNvcmRzLCBuYW1lS2V5LCBvLCBvYmo7XG4gICAgICBvYmogPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqTmFtZSk7XG4gICAgICBvID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqTmFtZSwgc3BhY2VJZCk7XG4gICAgICBuYW1lS2V5ID0gby5OQU1FX0ZJRUxEX0tFWTtcbiAgICAgIGlmICghb2JqKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChfLmlzU3RyaW5nKGlkKSkge1xuICAgICAgICBfcmVjb3JkID0gb2JqLmZpbmRPbmUoaWQpO1xuICAgICAgICBpZiAoX3JlY29yZCkge1xuICAgICAgICAgIF9yZWNvcmRbJ0BsYWJlbCddID0gX3JlY29yZFtuYW1lS2V5XTtcbiAgICAgICAgICByZXR1cm4gX3JlY29yZDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChfLmlzQXJyYXkoaWQpKSB7XG4gICAgICAgIF9yZWNvcmRzID0gW107XG4gICAgICAgIG9iai5maW5kKHtcbiAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICRpbjogaWRcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24oX3JlY29yZCkge1xuICAgICAgICAgIF9yZWNvcmRbJ0BsYWJlbCddID0gX3JlY29yZFtuYW1lS2V5XTtcbiAgICAgICAgICByZXR1cm4gX3JlY29yZHMucHVzaChfcmVjb3JkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghXy5pc0VtcHR5KF9yZWNvcmRzKSkge1xuICAgICAgICAgIHJldHVybiBfcmVjb3JkcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgZ2V0U2VsZWN0VXNlclZhbHVlID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gICAgICB2YXIgc3U7XG4gICAgICBzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgICBzdS5pZCA9IHVzZXJJZDtcbiAgICAgIHJldHVybiBzdTtcbiAgICB9O1xuICAgIGdldFNlbGVjdFVzZXJWYWx1ZXMgPSBmdW5jdGlvbih1c2VySWRzLCBzcGFjZUlkKSB7XG4gICAgICB2YXIgc3VzO1xuICAgICAgc3VzID0gW107XG4gICAgICBpZiAoXy5pc0FycmF5KHVzZXJJZHMpKSB7XG4gICAgICAgIF8uZWFjaCh1c2VySWRzLCBmdW5jdGlvbih1c2VySWQpIHtcbiAgICAgICAgICB2YXIgc3U7XG4gICAgICAgICAgc3UgPSBnZXRTZWxlY3RVc2VyVmFsdWUodXNlcklkLCBzcGFjZUlkKTtcbiAgICAgICAgICBpZiAoc3UpIHtcbiAgICAgICAgICAgIHJldHVybiBzdXMucHVzaChzdSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdXM7XG4gICAgfTtcbiAgICBnZXRTZWxlY3RPcmdWYWx1ZSA9IGZ1bmN0aW9uKG9yZ0lkLCBzcGFjZUlkKSB7XG4gICAgICB2YXIgb3JnO1xuICAgICAgb3JnID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZE9uZShvcmdJZCwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICBmdWxsbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG9yZy5pZCA9IG9yZ0lkO1xuICAgICAgcmV0dXJuIG9yZztcbiAgICB9O1xuICAgIGdldFNlbGVjdE9yZ1ZhbHVlcyA9IGZ1bmN0aW9uKG9yZ0lkcywgc3BhY2VJZCkge1xuICAgICAgdmFyIG9yZ3M7XG4gICAgICBvcmdzID0gW107XG4gICAgICBpZiAoXy5pc0FycmF5KG9yZ0lkcykpIHtcbiAgICAgICAgXy5lYWNoKG9yZ0lkcywgZnVuY3Rpb24ob3JnSWQpIHtcbiAgICAgICAgICB2YXIgb3JnO1xuICAgICAgICAgIG9yZyA9IGdldFNlbGVjdE9yZ1ZhbHVlKG9yZ0lkLCBzcGFjZUlkKTtcbiAgICAgICAgICBpZiAob3JnKSB7XG4gICAgICAgICAgICByZXR1cm4gb3Jncy5wdXNoKG9yZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcmdzO1xuICAgIH07XG4gICAgdGFibGVGaWVsZENvZGVzID0gW107XG4gICAgdGFibGVGaWVsZE1hcCA9IFtdO1xuICAgIHRhYmxlVG9SZWxhdGVkTWFwID0ge307XG4gICAgaWYgKChyZWYgPSBvdy5maWVsZF9tYXApICE9IG51bGwpIHtcbiAgICAgIHJlZi5mb3JFYWNoKGZ1bmN0aW9uKGZtKSB7XG4gICAgICAgIHZhciBmaWVsZHNPYmosIGZvcm1GaWVsZCwgZm9ybVRhYmxlRmllbGRDb2RlLCBsb29rdXBGaWVsZE5hbWUsIGxvb2t1cEZpZWxkT2JqLCBsb29rdXBPYmplY3RSZWNvcmQsIG9UYWJsZUNvZGUsIG9UYWJsZUZpZWxkQ29kZSwgb2JqRmllbGQsIG9iamVjdEZpZWxkLCBvYmplY3RGaWVsZE5hbWUsIG9iamVjdEZpZWxkT2JqZWN0TmFtZSwgb2JqZWN0TG9va3VwRmllbGQsIG9iamVjdF9maWVsZCwgb2RhdGFGaWVsZFZhbHVlLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVsYXRlZE9iamVjdEZpZWxkQ29kZSwgc2VsZWN0RmllbGRWYWx1ZSwgdGFibGVUb1JlbGF0ZWRNYXBLZXksIHdUYWJsZUNvZGUsIHdvcmtmbG93X2ZpZWxkO1xuICAgICAgICBvYmplY3RfZmllbGQgPSBmbS5vYmplY3RfZmllbGQ7XG4gICAgICAgIHdvcmtmbG93X2ZpZWxkID0gZm0ud29ya2Zsb3dfZmllbGQ7XG4gICAgICAgIHJlbGF0ZWRPYmplY3RGaWVsZENvZGUgPSBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlKG9iamVjdF9maWVsZCk7XG4gICAgICAgIGZvcm1UYWJsZUZpZWxkQ29kZSA9IGdldEZvcm1UYWJsZUZpZWxkQ29kZSh3b3JrZmxvd19maWVsZCk7XG4gICAgICAgIG9iakZpZWxkID0gb2JqZWN0LmZpZWxkc1tvYmplY3RfZmllbGRdO1xuICAgICAgICBmb3JtRmllbGQgPSBnZXRGb3JtRmllbGQod29ya2Zsb3dfZmllbGQpO1xuICAgICAgICBpZiAocmVsYXRlZE9iamVjdEZpZWxkQ29kZSkge1xuICAgICAgICAgIG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICBvVGFibGVGaWVsZENvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICB0YWJsZVRvUmVsYXRlZE1hcEtleSA9IG9UYWJsZUNvZGU7XG4gICAgICAgICAgaWYgKCF0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0pIHtcbiAgICAgICAgICAgIHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZm9ybVRhYmxlRmllbGRDb2RlKSB7XG4gICAgICAgICAgICB3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVsnX0ZST01fVEFCTEVfQ09ERSddID0gd1RhYmxlQ29kZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVtvVGFibGVGaWVsZENvZGVdID0gd29ya2Zsb3dfZmllbGQ7XG4gICAgICAgIH0gZWxzZSBpZiAod29ya2Zsb3dfZmllbGQuaW5kZXhPZignLiQuJykgPiAwICYmIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA+IDApIHtcbiAgICAgICAgICB3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4kLicpWzBdO1xuICAgICAgICAgIG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzBdO1xuICAgICAgICAgIGlmIChyZWNvcmQuaGFzT3duUHJvcGVydHkob1RhYmxlQ29kZSkgJiYgXy5pc0FycmF5KHJlY29yZFtvVGFibGVDb2RlXSkpIHtcbiAgICAgICAgICAgIHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgd29ya2Zsb3dfdGFibGVfZmllbGRfY29kZTogd1RhYmxlQ29kZSxcbiAgICAgICAgICAgICAgb2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHJldHVybiB0YWJsZUZpZWxkTWFwLnB1c2goZm0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChvYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gMCAmJiBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPT09IC0xKSB7XG4gICAgICAgICAgb2JqZWN0RmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgbG9va3VwRmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgaWYgKG9iamVjdCkge1xuICAgICAgICAgICAgb2JqZWN0RmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdEZpZWxkTmFtZV07XG4gICAgICAgICAgICBpZiAob2JqZWN0RmllbGQgJiYgZm9ybUZpZWxkICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgZmllbGRzT2JqID0ge307XG4gICAgICAgICAgICAgIGZpZWxkc09ialtsb29rdXBGaWVsZE5hbWVdID0gMTtcbiAgICAgICAgICAgICAgbG9va3VwT2JqZWN0UmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZE9uZShyZWNvcmRbb2JqZWN0RmllbGROYW1lXSwge1xuICAgICAgICAgICAgICAgIGZpZWxkczogZmllbGRzT2JqXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBvYmplY3RGaWVsZE9iamVjdE5hbWUgPSBvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICAgIGxvb2t1cEZpZWxkT2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0RmllbGRPYmplY3ROYW1lLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgb2JqZWN0TG9va3VwRmllbGQgPSBsb29rdXBGaWVsZE9iai5maWVsZHNbbG9va3VwRmllbGROYW1lXTtcbiAgICAgICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gbG9va3VwT2JqZWN0UmVjb3JkW2xvb2t1cEZpZWxkTmFtZV07XG4gICAgICAgICAgICAgIGlmIChvYmplY3RMb29rdXBGaWVsZCAmJiBmb3JtRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9iamVjdExvb2t1cEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob2JqZWN0TG9va3VwRmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSA9IG9iamVjdExvb2t1cEZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IGxvb2t1cE9iamVjdFJlY29yZFtsb29rdXBGaWVsZE5hbWVdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqRmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvYmpGaWVsZC5uYW1lXTtcbiAgICAgICAgICBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgICAgaWYgKG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiBbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdO1xuICAgICAgICAgIGlmICghXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWU7XG4gICAgICAgICAgICBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICBpZiAob2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgICAgICBpZiAob2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxlY3RGaWVsZFZhbHVlKSB7XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gc2VsZWN0RmllbGRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLmhhc093blByb3BlcnR5KG9iamVjdF9maWVsZCkpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHJlY29yZFtvYmplY3RfZmllbGRdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgXy51bmlxKHRhYmxlRmllbGRDb2RlcykuZm9yRWFjaChmdW5jdGlvbih0ZmMpIHtcbiAgICAgIHZhciBjO1xuICAgICAgYyA9IEpTT04ucGFyc2UodGZjKTtcbiAgICAgIHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdID0gW107XG4gICAgICByZXR1cm4gcmVjb3JkW2Mub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGVdLmZvckVhY2goZnVuY3Rpb24odHIpIHtcbiAgICAgICAgdmFyIG5ld1RyO1xuICAgICAgICBuZXdUciA9IHt9O1xuICAgICAgICBfLmVhY2godHIsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgICByZXR1cm4gdGFibGVGaWVsZE1hcC5mb3JFYWNoKGZ1bmN0aW9uKHRmbSkge1xuICAgICAgICAgICAgdmFyIHdUZENvZGU7XG4gICAgICAgICAgICBpZiAodGZtLm9iamVjdF9maWVsZCA9PT0gKGMub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGUgKyAnLiQuJyArIGspKSB7XG4gICAgICAgICAgICAgIHdUZENvZGUgPSB0Zm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4kLicpWzFdO1xuICAgICAgICAgICAgICByZXR1cm4gbmV3VHJbd1RkQ29kZV0gPSB2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFfLmlzRW1wdHkobmV3VHIpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdLnB1c2gobmV3VHIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBfLmVhY2godGFibGVUb1JlbGF0ZWRNYXAsIGZ1bmN0aW9uKG1hcCwga2V5KSB7XG4gICAgICB2YXIgZm9ybVRhYmxlRmllbGQsIHJlbGF0ZWRDb2xsZWN0aW9uLCByZWxhdGVkRmllbGQsIHJlbGF0ZWRGaWVsZE5hbWUsIHJlbGF0ZWRPYmplY3QsIHJlbGF0ZWRPYmplY3ROYW1lLCByZWxhdGVkUmVjb3JkcywgcmVsYXRlZFRhYmxlSXRlbXMsIHNlbGVjdG9yLCB0YWJsZUNvZGUsIHRhYmxlVmFsdWVzO1xuICAgICAgdGFibGVDb2RlID0gbWFwLl9GUk9NX1RBQkxFX0NPREU7XG4gICAgICBmb3JtVGFibGVGaWVsZCA9IGdldEZvcm1UYWJsZUZpZWxkKHRhYmxlQ29kZSk7XG4gICAgICBpZiAoIXRhYmxlQ29kZSkge1xuICAgICAgICByZXR1cm4gY29uc29sZS53YXJuKCd0YWJsZVRvUmVsYXRlZDogWycgKyBrZXkgKyAnXSBtaXNzaW5nIGNvcnJlc3BvbmRpbmcgdGFibGUuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWxhdGVkT2JqZWN0TmFtZSA9IGtleTtcbiAgICAgICAgdGFibGVWYWx1ZXMgPSBbXTtcbiAgICAgICAgcmVsYXRlZFRhYmxlSXRlbXMgPSBbXTtcbiAgICAgICAgcmVsYXRlZE9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKTtcbiAgICAgICAgcmVsYXRlZEZpZWxkID0gXy5maW5kKHJlbGF0ZWRPYmplY3QuZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgcmV0dXJuIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhmLnR5cGUpICYmIGYucmVmZXJlbmNlX3RvID09PSBvYmplY3ROYW1lO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVsYXRlZEZpZWxkTmFtZSA9IHJlbGF0ZWRGaWVsZC5uYW1lO1xuICAgICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgICBzZWxlY3RvcltyZWxhdGVkRmllbGROYW1lXSA9IHJlY29yZElkO1xuICAgICAgICByZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCk7XG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZChzZWxlY3Rvcik7XG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2goZnVuY3Rpb24ocnIpIHtcbiAgICAgICAgICB2YXIgdGFibGVWYWx1ZUl0ZW07XG4gICAgICAgICAgdGFibGVWYWx1ZUl0ZW0gPSB7fTtcbiAgICAgICAgICBfLmVhY2gobWFwLCBmdW5jdGlvbih2YWx1ZUtleSwgZmllbGRLZXkpIHtcbiAgICAgICAgICAgIHZhciBmb3JtRmllbGQsIGZvcm1GaWVsZEtleSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlbGF0ZWRPYmplY3RGaWVsZCwgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKGZpZWxkS2V5ICE9PSAnX0ZST01fVEFCTEVfQ09ERScpIHtcbiAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICBmb3JtRmllbGRLZXk7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZUtleS5zdGFydHNXaXRoKHRhYmxlQ29kZSArICcuJykpIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSAodmFsdWVLZXkuc3BsaXQoXCIuXCIpWzFdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSB2YWx1ZUtleTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBmb3JtRmllbGQgPSBnZXRGb3JtVGFibGVTdWJGaWVsZChmb3JtVGFibGVGaWVsZCwgZm9ybUZpZWxkS2V5KTtcbiAgICAgICAgICAgICAgcmVsYXRlZE9iamVjdEZpZWxkID0gcmVsYXRlZE9iamVjdC5maWVsZHNbZmllbGRLZXldO1xuICAgICAgICAgICAgICBpZiAoIWZvcm1GaWVsZCB8fCAhcmVsYXRlZE9iamVjdEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb09iamVjdE5hbWUgPSByZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XTtcbiAgICAgICAgICAgICAgICBpZiAocmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV07XG4gICAgICAgICAgICAgICAgaWYgKCFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgaWYgKGZvcm1GaWVsZC50eXBlID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdncm91cCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gdGFibGVWYWx1ZUl0ZW1bZm9ybUZpZWxkS2V5XSA9IHRhYmxlRmllbGRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoIV8uaXNFbXB0eSh0YWJsZVZhbHVlSXRlbSkpIHtcbiAgICAgICAgICAgIHRhYmxlVmFsdWVJdGVtLl9pZCA9IHJyLl9pZDtcbiAgICAgICAgICAgIHRhYmxlVmFsdWVzLnB1c2godGFibGVWYWx1ZUl0ZW0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRUYWJsZUl0ZW1zLnB1c2goe1xuICAgICAgICAgICAgICBfdGFibGU6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IHJyLl9pZCxcbiAgICAgICAgICAgICAgICBfY29kZTogdGFibGVDb2RlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHZhbHVlc1t0YWJsZUNvZGVdID0gdGFibGVWYWx1ZXM7XG4gICAgICAgIHJldHVybiByZWxhdGVkVGFibGVzSW5mb1tyZWxhdGVkT2JqZWN0TmFtZV0gPSByZWxhdGVkVGFibGVJdGVtcztcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAob3cuZmllbGRfbWFwX3NjcmlwdCkge1xuICAgICAgXy5leHRlbmQodmFsdWVzLCB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmV2YWxGaWVsZE1hcFNjcmlwdChvdy5maWVsZF9tYXBfc2NyaXB0LCBvYmplY3ROYW1lLCBzcGFjZUlkLCByZWNvcmRJZCkpO1xuICAgIH1cbiAgfVxuICBmaWx0ZXJWYWx1ZXMgPSB7fTtcbiAgXy5lYWNoKF8ua2V5cyh2YWx1ZXMpLCBmdW5jdGlvbihrKSB7XG4gICAgaWYgKGZpZWxkQ29kZXMuaW5jbHVkZXMoaykpIHtcbiAgICAgIHJldHVybiBmaWx0ZXJWYWx1ZXNba10gPSB2YWx1ZXNba107XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZpbHRlclZhbHVlcztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0ID0gZnVuY3Rpb24oZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgb2JqZWN0SWQpIHtcbiAgdmFyIGZ1bmMsIHJlY29yZCwgc2NyaXB0LCB2YWx1ZXM7XG4gIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKG9iamVjdElkKTtcbiAgc2NyaXB0ID0gXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZWNvcmQpIHsgXCIgKyBmaWVsZF9tYXBfc2NyaXB0ICsgXCIgfVwiO1xuICBmdW5jID0gX2V2YWwoc2NyaXB0LCBcImZpZWxkX21hcF9zY3JpcHRcIik7XG4gIHZhbHVlcyA9IGZ1bmMocmVjb3JkKTtcbiAgaWYgKF8uaXNPYmplY3QodmFsdWVzKSkge1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcihcImV2YWxGaWVsZE1hcFNjcmlwdDog6ISa5pys6L+U5Zue5YC857G75Z6L5LiN5piv5a+56LGhXCIpO1xuICB9XG4gIHJldHVybiB7fTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2ggPSBmdW5jdGlvbihyZWNvcmRJZHMsIHNwYWNlSWQsIGluc0lkLCBhcHByb3ZlSWQpIHtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1snY21zX2ZpbGVzJ10uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgcGFyZW50OiByZWNvcmRJZHNcbiAgfSkuZm9yRWFjaChmdW5jdGlvbihjZikge1xuICAgIHJldHVybiBfLmVhY2goY2YudmVyc2lvbnMsIGZ1bmN0aW9uKHZlcnNpb25JZCwgaWR4KSB7XG4gICAgICB2YXIgZiwgbmV3RmlsZTtcbiAgICAgIGYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zWydjZnMuZmlsZXMuZmlsZXJlY29yZCddLmZpbmRPbmUodmVyc2lvbklkKTtcbiAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgICAgcmV0dXJuIG5ld0ZpbGUuYXR0YWNoRGF0YShmLmNyZWF0ZVJlYWRTdHJlYW0oJ2ZpbGVzJyksIHtcbiAgICAgICAgdHlwZTogZi5vcmlnaW5hbC50eXBlXG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdmFyIG1ldGFkYXRhO1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnIuZXJyb3IsIGVyci5yZWFzb24pO1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUubmFtZShmLm5hbWUoKSk7XG4gICAgICAgIG5ld0ZpbGUuc2l6ZShmLnNpemUoKSk7XG4gICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgIG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxuICAgICAgICAgIG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICBpbnN0YW5jZTogaW5zSWQsXG4gICAgICAgICAgYXBwcm92ZTogYXBwcm92ZUlkLFxuICAgICAgICAgIHBhcmVudDogY2YuX2lkXG4gICAgICAgIH07XG4gICAgICAgIGlmIChpZHggPT09IDApIHtcbiAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgIHJldHVybiBjZnMuaW5zdGFuY2VzLmluc2VydChuZXdGaWxlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8gPSBmdW5jdGlvbihyZWNvcmRJZHMsIGluc0lkLCBzcGFjZUlkKSB7XG4gIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkudXBkYXRlKHJlY29yZElkcy5pZHNbMF0sIHtcbiAgICAkcHVzaDoge1xuICAgICAgaW5zdGFuY2VzOiB7XG4gICAgICAgICRlYWNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgX2lkOiBpbnNJZCxcbiAgICAgICAgICAgIHN0YXRlOiAnZHJhZnQnXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICAkcG9zaXRpb246IDBcbiAgICAgIH1cbiAgICB9LFxuICAgICRzZXQ6IHtcbiAgICAgIGxvY2tlZDogdHJ1ZSxcbiAgICAgIGluc3RhbmNlX3N0YXRlOiAnZHJhZnQnXG4gICAgfVxuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvID0gZnVuY3Rpb24ocmVsYXRlZFRhYmxlc0luZm8sIGluc0lkLCBzcGFjZUlkKSB7XG4gIF8uZWFjaChyZWxhdGVkVGFibGVzSW5mbywgZnVuY3Rpb24odGFibGVJdGVtcywgcmVsYXRlZE9iamVjdE5hbWUpIHtcbiAgICB2YXIgcmVsYXRlZENvbGxlY3Rpb247XG4gICAgcmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpO1xuICAgIHJldHVybiBfLmVhY2godGFibGVJdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIHJlbGF0ZWRDb2xsZWN0aW9uLnVwZGF0ZShpdGVtLl90YWJsZS5faWQsIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGluc3RhbmNlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBfaWQ6IGluc0lkLFxuICAgICAgICAgICAgICBzdGF0ZTogJ2RyYWZ0J1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAgX3RhYmxlOiBpdGVtLl90YWJsZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsID0gZnVuY3Rpb24ocmVjb3JkSWRzLCBzcGFjZUlkKSB7XG4gIHZhciByZWNvcmQ7XG4gIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkuZmluZE9uZSh7XG4gICAgX2lkOiByZWNvcmRJZHMuaWRzWzBdLFxuICAgIGluc3RhbmNlczoge1xuICAgICAgJGV4aXN0czogdHJ1ZVxuICAgIH1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgaW5zdGFuY2VzOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKHJlY29yZCAmJiByZWNvcmQuaW5zdGFuY2VzWzBdLnN0YXRlICE9PSAnY29tcGxldGVkJyAmJiBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kKHJlY29yZC5pbnN0YW5jZXNbMF0uX2lkKS5jb3VudCgpID4gMCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5q2k6K6w5b2V5bey5Y+R6LW35rWB56iL5q2j5Zyo5a6h5om55Lit77yM5b6F5a6h5om557uT5p2f5pa55Y+v5Y+R6LW35LiL5LiA5qyh5a6h5om577yBXCIpO1xuICB9XG59O1xuIiwiSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL3MzL1wiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cclxuXHRKc29uUm91dGVzLnBhcnNlRmlsZXMgcmVxLCByZXMsICgpLT5cclxuXHRcdGNvbGxlY3Rpb24gPSBjZnMuZmlsZXNcclxuXHRcdGZpbGVDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRPYmplY3QoXCJjbXNfZmlsZXNcIikuZGJcclxuXHJcblx0XHRpZiByZXEuZmlsZXMgYW5kIHJlcS5maWxlc1swXVxyXG5cclxuXHRcdFx0bmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XHJcblx0XHRcdG5ld0ZpbGUuYXR0YWNoRGF0YSByZXEuZmlsZXNbMF0uZGF0YSwge3R5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZX0sIChlcnIpIC0+XHJcblx0XHRcdFx0ZmlsZW5hbWUgPSByZXEuZmlsZXNbMF0uZmlsZW5hbWVcclxuXHRcdFx0XHRleHRlbnRpb24gPSBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpXHJcblx0XHRcdFx0aWYgW1wiaW1hZ2UuanBnXCIsIFwiaW1hZ2UuZ2lmXCIsIFwiaW1hZ2UuanBlZ1wiLCBcImltYWdlLnBuZ1wiXS5pbmNsdWRlcyhmaWxlbmFtZS50b0xvd2VyQ2FzZSgpKVxyXG5cdFx0XHRcdFx0ZmlsZW5hbWUgPSBcImltYWdlLVwiICsgbW9tZW50KG5ldyBEYXRlKCkpLmZvcm1hdCgnWVlZWU1NRERISG1tc3MnKSArIFwiLlwiICsgZXh0ZW50aW9uXHJcblxyXG5cdFx0XHRcdGJvZHkgPSByZXEuYm9keVxyXG5cdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0aWYgYm9keSAmJiAoYm9keVsndXBsb2FkX2Zyb20nXSBpcyBcIklFXCIgb3IgYm9keVsndXBsb2FkX2Zyb20nXSBpcyBcIm5vZGVcIilcclxuXHRcdFx0XHRcdFx0ZmlsZW5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQoZmlsZW5hbWUpXHJcblx0XHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihmaWxlbmFtZSlcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZVxyXG5cdFx0XHRcdFx0ZmlsZW5hbWUgPSBmaWxlbmFtZS5yZXBsYWNlKC8lL2csIFwiLVwiKVxyXG5cclxuXHRcdFx0XHRuZXdGaWxlLm5hbWUoZmlsZW5hbWUpXHJcblxyXG5cdFx0XHRcdGlmIGJvZHkgJiYgYm9keVsnb3duZXInXSAmJiBib2R5WydzcGFjZSddICYmIGJvZHlbJ3JlY29yZF9pZCddICAmJiBib2R5WydvYmplY3RfbmFtZSddXHJcblx0XHRcdFx0XHRwYXJlbnQgPSBib2R5WydwYXJlbnQnXVxyXG5cdFx0XHRcdFx0b3duZXIgPSBib2R5Wydvd25lciddXHJcblx0XHRcdFx0XHRvd25lcl9uYW1lID0gYm9keVsnb3duZXJfbmFtZSddXHJcblx0XHRcdFx0XHRzcGFjZSA9IGJvZHlbJ3NwYWNlJ11cclxuXHRcdFx0XHRcdHJlY29yZF9pZCA9IGJvZHlbJ3JlY29yZF9pZCddXHJcblx0XHRcdFx0XHRvYmplY3RfbmFtZSA9IGJvZHlbJ29iamVjdF9uYW1lJ11cclxuXHRcdFx0XHRcdHBhcmVudCA9IGJvZHlbJ3BhcmVudCddXHJcblx0XHRcdFx0XHRtZXRhZGF0YSA9IHtvd25lcjpvd25lciwgb3duZXJfbmFtZTpvd25lcl9uYW1lLCBzcGFjZTpzcGFjZSwgcmVjb3JkX2lkOnJlY29yZF9pZCwgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lfVxyXG5cdFx0XHRcdFx0aWYgcGFyZW50XHJcblx0XHRcdFx0XHRcdG1ldGFkYXRhLnBhcmVudCA9IHBhcmVudFxyXG5cdFx0XHRcdFx0bmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhXHJcblx0XHRcdFx0XHRmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxyXG5cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxyXG5cclxuXHJcblx0XHRcdFx0c2l6ZSA9IGZpbGVPYmoub3JpZ2luYWwuc2l6ZVxyXG5cdFx0XHRcdGlmICFzaXplXHJcblx0XHRcdFx0XHRzaXplID0gMTAyNFxyXG5cdFx0XHRcdGlmIHBhcmVudFxyXG5cdFx0XHRcdFx0ZmlsZUNvbGxlY3Rpb24udXBkYXRlKHtfaWQ6cGFyZW50fSx7XHJcblx0XHRcdFx0XHRcdCRzZXQ6XHJcblx0XHRcdFx0XHRcdFx0ZXh0ZW50aW9uOiBleHRlbnRpb25cclxuXHRcdFx0XHRcdFx0XHRzaXplOiBzaXplXHJcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWQ6IChuZXcgRGF0ZSgpKVxyXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiBvd25lclxyXG5cdFx0XHRcdFx0XHQkcHVzaDpcclxuXHRcdFx0XHRcdFx0XHR2ZXJzaW9uczpcclxuXHRcdFx0XHRcdFx0XHRcdCRlYWNoOiBbIGZpbGVPYmouX2lkIF1cclxuXHRcdFx0XHRcdFx0XHRcdCRwb3NpdGlvbjogMFxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRuZXdGaWxlT2JqSWQgPSBmaWxlQ29sbGVjdGlvbi5kaXJlY3QuaW5zZXJ0IHtcclxuXHRcdFx0XHRcdFx0bmFtZTogZmlsZW5hbWVcclxuXHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246ICcnXHJcblx0XHRcdFx0XHRcdGV4dGVudGlvbjogZXh0ZW50aW9uXHJcblx0XHRcdFx0XHRcdHNpemU6IHNpemVcclxuXHRcdFx0XHRcdFx0dmVyc2lvbnM6IFtmaWxlT2JqLl9pZF1cclxuXHRcdFx0XHRcdFx0cGFyZW50OiB7bzpvYmplY3RfbmFtZSxpZHM6W3JlY29yZF9pZF19XHJcblx0XHRcdFx0XHRcdG93bmVyOiBvd25lclxyXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VcclxuXHRcdFx0XHRcdFx0Y3JlYXRlZDogKG5ldyBEYXRlKCkpXHJcblx0XHRcdFx0XHRcdGNyZWF0ZWRfYnk6IG93bmVyXHJcblx0XHRcdFx0XHRcdG1vZGlmaWVkOiAobmV3IERhdGUoKSlcclxuXHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IG93bmVyXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRmaWxlT2JqLnVwZGF0ZSh7JHNldDogeydtZXRhZGF0YS5wYXJlbnQnIDogbmV3RmlsZU9iaklkfX0pXHJcblxyXG5cdFx0XHRcdHJlc3AgPVxyXG5cdFx0XHRcdFx0dmVyc2lvbl9pZDogZmlsZU9iai5faWQsXHJcblx0XHRcdFx0XHRzaXplOiBzaXplXHJcblxyXG5cdFx0XHRcdHJlcy5zZXRIZWFkZXIoXCJ4LWFtei12ZXJzaW9uLWlkXCIsZmlsZU9iai5faWQpO1xyXG5cdFx0XHRcdHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXMuc3RhdHVzQ29kZSA9IDUwMDtcclxuXHRcdFx0cmVzLmVuZCgpO1xyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL3MzLzpjb2xsZWN0aW9uXCIsICAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0dHJ5XHJcblx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIHBlcm1pc3Npb25cIilcclxuXHJcblx0XHRjb2xsZWN0aW9uTmFtZSA9IHJlcS5wYXJhbXMuY29sbGVjdGlvblxyXG5cclxuXHRcdEpzb25Sb3V0ZXMucGFyc2VGaWxlcyByZXEsIHJlcywgKCktPlxyXG5cdFx0XHRjb2xsZWN0aW9uID0gY2ZzW2NvbGxlY3Rpb25OYW1lXVxyXG5cclxuXHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBDb2xsZWN0aW9uXCIpXHJcblxyXG5cdFx0XHRpZiByZXEuZmlsZXMgYW5kIHJlcS5maWxlc1swXVxyXG5cclxuXHRcdFx0XHRuZXdGaWxlID0gbmV3IEZTLkZpbGUoKVxyXG5cdFx0XHRcdG5ld0ZpbGUubmFtZShyZXEuZmlsZXNbMF0uZmlsZW5hbWUpXHJcblxyXG5cdFx0XHRcdGlmIHJlcS5ib2R5XHJcblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gcmVxLmJvZHlcclxuXHJcblx0XHRcdFx0bmV3RmlsZS5vd25lciA9IHVzZXJJZFxyXG5cdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEub3duZXIgPSB1c2VySWRcclxuXHJcblx0XHRcdFx0bmV3RmlsZS5hdHRhY2hEYXRhIHJlcS5maWxlc1swXS5kYXRhLCB7dHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlfVxyXG5cclxuXHRcdFx0XHRjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXHJcblxyXG5cdFx0XHRcdHJlc3VsdERhdGEgPSBjb2xsZWN0aW9uLmZpbGVzLmZpbmRPbmUobmV3RmlsZS5faWQpXHJcblx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRcdFx0ZGF0YTogcmVzdWx0RGF0YVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gRmlsZVwiKVxyXG5cclxuXHRcdHJldHVyblxyXG5cdGNhdGNoIGVcclxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRjb2RlOiBlLmVycm9yIHx8IDUwMFxyXG5cdFx0XHRkYXRhOiB7ZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2V9XHJcblx0XHR9XHJcblxyXG5cclxuXHJcbmdldFF1ZXJ5U3RyaW5nID0gKGFjY2Vzc0tleUlkLCBzZWNyZXRBY2Nlc3NLZXksIHF1ZXJ5LCBtZXRob2QpIC0+XHJcblx0Y29uc29sZS5sb2cgXCItLS0tdXVmbG93TWFuYWdlci5nZXRRdWVyeVN0cmluZy0tLS1cIlxyXG5cdEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKVxyXG5cdGRhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKVxyXG5cclxuXHRxdWVyeS5Gb3JtYXQgPSBcImpzb25cIlxyXG5cdHF1ZXJ5LlZlcnNpb24gPSBcIjIwMTctMDMtMjFcIlxyXG5cdHF1ZXJ5LkFjY2Vzc0tleUlkID0gYWNjZXNzS2V5SWRcclxuXHRxdWVyeS5TaWduYXR1cmVNZXRob2QgPSBcIkhNQUMtU0hBMVwiXHJcblx0cXVlcnkuVGltZXN0YW1wID0gQUxZLnV0aWwuZGF0ZS5pc284NjAxKGRhdGUpXHJcblx0cXVlcnkuU2lnbmF0dXJlVmVyc2lvbiA9IFwiMS4wXCJcclxuXHRxdWVyeS5TaWduYXR1cmVOb25jZSA9IFN0cmluZyhkYXRlLmdldFRpbWUoKSlcclxuXHJcblx0cXVlcnlLZXlzID0gT2JqZWN0LmtleXMocXVlcnkpXHJcblx0cXVlcnlLZXlzLnNvcnQoKVxyXG5cclxuXHRjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcgPSBcIlwiXHJcblx0cXVlcnlLZXlzLmZvckVhY2ggKG5hbWUpIC0+XHJcblx0XHRjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcgKz0gXCImXCIgKyBuYW1lICsgXCI9XCIgKyBBTFkudXRpbC5wb3BFc2NhcGUocXVlcnlbbmFtZV0pXHJcblxyXG5cdHN0cmluZ1RvU2lnbiA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpICsgJyYlMkYmJyArIEFMWS51dGlsLnBvcEVzY2FwZShjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcuc3Vic3RyKDEpKVxyXG5cclxuXHRxdWVyeS5TaWduYXR1cmUgPSBBTFkudXRpbC5jcnlwdG8uaG1hYyhzZWNyZXRBY2Nlc3NLZXkgKyAnJicsIHN0cmluZ1RvU2lnbiwgJ2Jhc2U2NCcsICdzaGExJylcclxuXHJcblx0cXVlcnlTdHIgPSBBTFkudXRpbC5xdWVyeVBhcmFtc1RvU3RyaW5nKHF1ZXJ5KVxyXG5cdGNvbnNvbGUubG9nIHF1ZXJ5U3RyXHJcblx0cmV0dXJuIHF1ZXJ5U3RyXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvczMvdm9kL3VwbG9hZFwiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0dXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKVxyXG5cdFx0aWYgIXVzZXJJZFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBwZXJtaXNzaW9uXCIpXHJcblxyXG5cdFx0Y29sbGVjdGlvbk5hbWUgPSBcInZpZGVvc1wiXHJcblxyXG5cdFx0QUxZID0gcmVxdWlyZSgnYWxpeXVuLXNkaycpXHJcblxyXG5cdFx0SnNvblJvdXRlcy5wYXJzZUZpbGVzIHJlcSwgcmVzLCAoKS0+XHJcblx0XHRcdGNvbGxlY3Rpb24gPSBjZnNbY29sbGVjdGlvbk5hbWVdXHJcblxyXG5cdFx0XHRpZiBub3QgY29sbGVjdGlvblxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIENvbGxlY3Rpb25cIilcclxuXHJcblx0XHRcdGlmIHJlcS5maWxlcyBhbmQgcmVxLmZpbGVzWzBdXHJcblxyXG5cdFx0XHRcdGlmIGNvbGxlY3Rpb25OYW1lIGlzICd2aWRlb3MnIGFuZCBNZXRlb3Iuc2V0dGluZ3MucHVibGljLmNmcz8uc3RvcmUgaXMgXCJPU1NcIlxyXG5cdFx0XHRcdFx0YWNjZXNzS2V5SWQgPSBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bj8uYWNjZXNzS2V5SWRcclxuXHRcdFx0XHRcdHNlY3JldEFjY2Vzc0tleSA9IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuPy5zZWNyZXRBY2Nlc3NLZXlcclxuXHJcblx0XHRcdFx0XHRkYXRlID0gQUxZLnV0aWwuZGF0ZS5nZXREYXRlKClcclxuXHJcblx0XHRcdFx0XHRxdWVyeSA9IHtcclxuXHRcdFx0XHRcdFx0QWN0aW9uOiBcIkNyZWF0ZVVwbG9hZFZpZGVvXCJcclxuXHRcdFx0XHRcdFx0VGl0bGU6IHJlcS5maWxlc1swXS5maWxlbmFtZVxyXG5cdFx0XHRcdFx0XHRGaWxlTmFtZTogcmVxLmZpbGVzWzBdLmZpbGVuYW1lXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dXJsID0gXCJodHRwOi8vdm9kLmNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS8/XCIgKyBnZXRRdWVyeVN0cmluZyhhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBxdWVyeSwgJ0dFVCcpXHJcblxyXG5cdFx0XHRcdFx0ciA9IEhUVFAuY2FsbCAnR0VUJywgdXJsXHJcblxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgclxyXG5cclxuXHRcdFx0XHRcdGlmIHIuZGF0YT8uVmlkZW9JZFxyXG5cdFx0XHRcdFx0XHR2aWRlb0lkID0gci5kYXRhLlZpZGVvSWRcclxuXHRcdFx0XHRcdFx0dXBsb2FkQWRkcmVzcyA9IEpTT04ucGFyc2UobmV3IEJ1ZmZlcihyLmRhdGEuVXBsb2FkQWRkcmVzcywgJ2Jhc2U2NCcpLnRvU3RyaW5nKCkpXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nIHVwbG9hZEFkZHJlc3NcclxuXHRcdFx0XHRcdFx0dXBsb2FkQXV0aCA9IEpTT04ucGFyc2UobmV3IEJ1ZmZlcihyLmRhdGEuVXBsb2FkQXV0aCwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCkpXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nIHVwbG9hZEF1dGhcclxuXHJcblx0XHRcdFx0XHRcdG9zcyA9IG5ldyBBTFkuT1NTKHtcclxuXHRcdFx0XHRcdFx0XHRcImFjY2Vzc0tleUlkXCI6IHVwbG9hZEF1dGguQWNjZXNzS2V5SWQsXHJcblx0XHRcdFx0XHRcdFx0XCJzZWNyZXRBY2Nlc3NLZXlcIjogdXBsb2FkQXV0aC5BY2Nlc3NLZXlTZWNyZXQsXHJcblx0XHRcdFx0XHRcdFx0XCJlbmRwb2ludFwiOiB1cGxvYWRBZGRyZXNzLkVuZHBvaW50LFxyXG5cdFx0XHRcdFx0XHRcdFwiYXBpVmVyc2lvblwiOiAnMjAxMy0xMC0xNScsXHJcblx0XHRcdFx0XHRcdFx0XCJzZWN1cml0eVRva2VuXCI6IHVwbG9hZEF1dGguU2VjdXJpdHlUb2tlblxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRcdFx0b3NzLnB1dE9iamVjdCB7XHJcblx0XHRcdFx0XHRcdFx0QnVja2V0OiB1cGxvYWRBZGRyZXNzLkJ1Y2tldCxcclxuXHRcdFx0XHRcdFx0XHRLZXk6IHVwbG9hZEFkZHJlc3MuRmlsZU5hbWUsXHJcblx0XHRcdFx0XHRcdFx0Qm9keTogcmVxLmZpbGVzWzBdLmRhdGEsXHJcblx0XHRcdFx0XHRcdFx0QWNjZXNzQ29udHJvbEFsbG93T3JpZ2luOiAnJyxcclxuXHRcdFx0XHRcdFx0XHRDb250ZW50VHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlLFxyXG5cdFx0XHRcdFx0XHRcdENhY2hlQ29udHJvbDogJ25vLWNhY2hlJyxcclxuXHRcdFx0XHRcdFx0XHRDb250ZW50RGlzcG9zaXRpb246ICcnLFxyXG5cdFx0XHRcdFx0XHRcdENvbnRlbnRFbmNvZGluZzogJ3V0Zi04JyxcclxuXHRcdFx0XHRcdFx0XHRTZXJ2ZXJTaWRlRW5jcnlwdGlvbjogJ0FFUzI1NicsXHJcblx0XHRcdFx0XHRcdFx0RXhwaXJlczogbnVsbFxyXG5cdFx0XHRcdFx0XHR9LCBNZXRlb3IuYmluZEVudmlyb25tZW50IChlcnIsIGRhdGEpIC0+XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIGVyclxyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ2Vycm9yOicsIGVycilcclxuXHRcdFx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlcnIubWVzc2FnZSlcclxuXHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ3N1Y2Nlc3M6JywgZGF0YSlcclxuXHJcblx0XHRcdFx0XHRcdFx0bmV3RGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpXHJcblxyXG5cdFx0XHRcdFx0XHRcdGdldFBsYXlJbmZvUXVlcnkgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRBY3Rpb246ICdHZXRQbGF5SW5mbydcclxuXHRcdFx0XHRcdFx0XHRcdFZpZGVvSWQ6IHZpZGVvSWRcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGdldFBsYXlJbmZvVXJsID0gXCJodHRwOi8vdm9kLmNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS8/XCIgKyBnZXRRdWVyeVN0cmluZyhhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBnZXRQbGF5SW5mb1F1ZXJ5LCAnR0VUJylcclxuXHJcblx0XHRcdFx0XHRcdFx0Z2V0UGxheUluZm9SZXN1bHQgPSBIVFRQLmNhbGwgJ0dFVCcsIGdldFBsYXlJbmZvVXJsXHJcblxyXG5cdFx0XHRcdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdFx0XHRcdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGE6IGdldFBsYXlJbmZvUmVzdWx0XHJcblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gRmlsZVwiKVxyXG5cclxuXHRcdHJldHVyblxyXG5cdGNhdGNoIGVcclxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRjb2RlOiBlLmVycm9yIHx8IDUwMFxyXG5cdFx0XHRkYXRhOiB7ZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2V9XHJcblx0XHR9IiwidmFyIGdldFF1ZXJ5U3RyaW5nO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvczMvXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHJldHVybiBKc29uUm91dGVzLnBhcnNlRmlsZXMocmVxLCByZXMsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb2xsZWN0aW9uLCBmaWxlQ29sbGVjdGlvbiwgbmV3RmlsZTtcbiAgICBjb2xsZWN0aW9uID0gY2ZzLmZpbGVzO1xuICAgIGZpbGVDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRPYmplY3QoXCJjbXNfZmlsZXNcIikuZGI7XG4gICAgaWYgKHJlcS5maWxlcyAmJiByZXEuZmlsZXNbMF0pIHtcbiAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgICAgcmV0dXJuIG5ld0ZpbGUuYXR0YWNoRGF0YShyZXEuZmlsZXNbMF0uZGF0YSwge1xuICAgICAgICB0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGVcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICB2YXIgYm9keSwgZSwgZXh0ZW50aW9uLCBmaWxlT2JqLCBmaWxlbmFtZSwgbWV0YWRhdGEsIG5ld0ZpbGVPYmpJZCwgb2JqZWN0X25hbWUsIG93bmVyLCBvd25lcl9uYW1lLCBwYXJlbnQsIHJlY29yZF9pZCwgcmVzcCwgc2l6ZSwgc3BhY2U7XG4gICAgICAgIGZpbGVuYW1lID0gcmVxLmZpbGVzWzBdLmZpbGVuYW1lO1xuICAgICAgICBleHRlbnRpb24gPSBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpO1xuICAgICAgICBpZiAoW1wiaW1hZ2UuanBnXCIsIFwiaW1hZ2UuZ2lmXCIsIFwiaW1hZ2UuanBlZ1wiLCBcImltYWdlLnBuZ1wiXS5pbmNsdWRlcyhmaWxlbmFtZS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgIGZpbGVuYW1lID0gXCJpbWFnZS1cIiArIG1vbWVudChuZXcgRGF0ZSgpKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzJykgKyBcIi5cIiArIGV4dGVudGlvbjtcbiAgICAgICAgfVxuICAgICAgICBib2R5ID0gcmVxLmJvZHk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKGJvZHkgJiYgKGJvZHlbJ3VwbG9hZF9mcm9tJ10gPT09IFwiSUVcIiB8fCBib2R5Wyd1cGxvYWRfZnJvbSddID09PSBcIm5vZGVcIikpIHtcbiAgICAgICAgICAgIGZpbGVuYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KGZpbGVuYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZmlsZW5hbWUpO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgZmlsZW5hbWUgPSBmaWxlbmFtZS5yZXBsYWNlKC8lL2csIFwiLVwiKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm5hbWUoZmlsZW5hbWUpO1xuICAgICAgICBpZiAoYm9keSAmJiBib2R5Wydvd25lciddICYmIGJvZHlbJ3NwYWNlJ10gJiYgYm9keVsncmVjb3JkX2lkJ10gJiYgYm9keVsnb2JqZWN0X25hbWUnXSkge1xuICAgICAgICAgIHBhcmVudCA9IGJvZHlbJ3BhcmVudCddO1xuICAgICAgICAgIG93bmVyID0gYm9keVsnb3duZXInXTtcbiAgICAgICAgICBvd25lcl9uYW1lID0gYm9keVsnb3duZXJfbmFtZSddO1xuICAgICAgICAgIHNwYWNlID0gYm9keVsnc3BhY2UnXTtcbiAgICAgICAgICByZWNvcmRfaWQgPSBib2R5WydyZWNvcmRfaWQnXTtcbiAgICAgICAgICBvYmplY3RfbmFtZSA9IGJvZHlbJ29iamVjdF9uYW1lJ107XG4gICAgICAgICAgcGFyZW50ID0gYm9keVsncGFyZW50J107XG4gICAgICAgICAgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICBvd25lcl9uYW1lOiBvd25lcl9uYW1lLFxuICAgICAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICAgICAgcmVjb3JkX2lkOiByZWNvcmRfaWQsXG4gICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgc2l6ZSA9IGZpbGVPYmoub3JpZ2luYWwuc2l6ZTtcbiAgICAgICAgaWYgKCFzaXplKSB7XG4gICAgICAgICAgc2l6ZSA9IDEwMjQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgIGZpbGVDb2xsZWN0aW9uLnVwZGF0ZSh7XG4gICAgICAgICAgICBfaWQ6IHBhcmVudFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgZXh0ZW50aW9uOiBleHRlbnRpb24sXG4gICAgICAgICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgICBtb2RpZmllZF9ieTogb3duZXJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICAgICB2ZXJzaW9uczoge1xuICAgICAgICAgICAgICAgICRlYWNoOiBbZmlsZU9iai5faWRdLFxuICAgICAgICAgICAgICAgICRwb3NpdGlvbjogMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3RmlsZU9iaklkID0gZmlsZUNvbGxlY3Rpb24uZGlyZWN0Lmluc2VydCh7XG4gICAgICAgICAgICBuYW1lOiBmaWxlbmFtZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgICAgIGV4dGVudGlvbjogZXh0ZW50aW9uLFxuICAgICAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgICAgIHZlcnNpb25zOiBbZmlsZU9iai5faWRdLFxuICAgICAgICAgICAgcGFyZW50OiB7XG4gICAgICAgICAgICAgIG86IG9iamVjdF9uYW1lLFxuICAgICAgICAgICAgICBpZHM6IFtyZWNvcmRfaWRdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIGNyZWF0ZWRfYnk6IG93bmVyLFxuICAgICAgICAgICAgbW9kaWZpZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBtb2RpZmllZF9ieTogb3duZXJcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBmaWxlT2JqLnVwZGF0ZSh7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICdtZXRhZGF0YS5wYXJlbnQnOiBuZXdGaWxlT2JqSWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXNwID0ge1xuICAgICAgICAgIHZlcnNpb25faWQ6IGZpbGVPYmouX2lkLFxuICAgICAgICAgIHNpemU6IHNpemVcbiAgICAgICAgfTtcbiAgICAgICAgcmVzLnNldEhlYWRlcihcIngtYW16LXZlcnNpb24taWRcIiwgZmlsZU9iai5faWQpO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgIHJldHVybiByZXMuZW5kKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvczMvOmNvbGxlY3Rpb25cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGNvbGxlY3Rpb25OYW1lLCBlLCB1c2VySWQ7XG4gIHRyeSB7XG4gICAgdXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKTtcbiAgICB9XG4gICAgY29sbGVjdGlvbk5hbWUgPSByZXEucGFyYW1zLmNvbGxlY3Rpb247XG4gICAgSnNvblJvdXRlcy5wYXJzZUZpbGVzKHJlcSwgcmVzLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uLCBuZXdGaWxlLCByZXN1bHREYXRhO1xuICAgICAgY29sbGVjdGlvbiA9IGNmc1tjb2xsZWN0aW9uTmFtZV07XG4gICAgICBpZiAoIWNvbGxlY3Rpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gQ29sbGVjdGlvblwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXEuZmlsZXMgJiYgcmVxLmZpbGVzWzBdKSB7XG4gICAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgICAgICBuZXdGaWxlLm5hbWUocmVxLmZpbGVzWzBdLmZpbGVuYW1lKTtcbiAgICAgICAgaWYgKHJlcS5ib2R5KSB7XG4gICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IHJlcS5ib2R5O1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUub3duZXIgPSB1c2VySWQ7XG4gICAgICAgIG5ld0ZpbGUubWV0YWRhdGEub3duZXIgPSB1c2VySWQ7XG4gICAgICAgIG5ld0ZpbGUuYXR0YWNoRGF0YShyZXEuZmlsZXNbMF0uZGF0YSwge1xuICAgICAgICAgIHR5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZVxuICAgICAgICB9KTtcbiAgICAgICAgY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgIHJlc3VsdERhdGEgPSBjb2xsZWN0aW9uLmZpbGVzLmZpbmRPbmUobmV3RmlsZS5faWQpO1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgIGRhdGE6IHJlc3VsdERhdGFcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBGaWxlXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiBlLmVycm9yIHx8IDUwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG5cbmdldFF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24oYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgcXVlcnksIG1ldGhvZCkge1xuICB2YXIgQUxZLCBjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcsIGRhdGUsIHF1ZXJ5S2V5cywgcXVlcnlTdHIsIHN0cmluZ1RvU2lnbjtcbiAgY29uc29sZS5sb2coXCItLS0tdXVmbG93TWFuYWdlci5nZXRRdWVyeVN0cmluZy0tLS1cIik7XG4gIEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKTtcbiAgZGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpO1xuICBxdWVyeS5Gb3JtYXQgPSBcImpzb25cIjtcbiAgcXVlcnkuVmVyc2lvbiA9IFwiMjAxNy0wMy0yMVwiO1xuICBxdWVyeS5BY2Nlc3NLZXlJZCA9IGFjY2Vzc0tleUlkO1xuICBxdWVyeS5TaWduYXR1cmVNZXRob2QgPSBcIkhNQUMtU0hBMVwiO1xuICBxdWVyeS5UaW1lc3RhbXAgPSBBTFkudXRpbC5kYXRlLmlzbzg2MDEoZGF0ZSk7XG4gIHF1ZXJ5LlNpZ25hdHVyZVZlcnNpb24gPSBcIjEuMFwiO1xuICBxdWVyeS5TaWduYXR1cmVOb25jZSA9IFN0cmluZyhkYXRlLmdldFRpbWUoKSk7XG4gIHF1ZXJ5S2V5cyA9IE9iamVjdC5rZXlzKHF1ZXJ5KTtcbiAgcXVlcnlLZXlzLnNvcnQoKTtcbiAgY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nID0gXCJcIjtcbiAgcXVlcnlLZXlzLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiBjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcgKz0gXCImXCIgKyBuYW1lICsgXCI9XCIgKyBBTFkudXRpbC5wb3BFc2NhcGUocXVlcnlbbmFtZV0pO1xuICB9KTtcbiAgc3RyaW5nVG9TaWduID0gbWV0aG9kLnRvVXBwZXJDYXNlKCkgKyAnJiUyRiYnICsgQUxZLnV0aWwucG9wRXNjYXBlKGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZy5zdWJzdHIoMSkpO1xuICBxdWVyeS5TaWduYXR1cmUgPSBBTFkudXRpbC5jcnlwdG8uaG1hYyhzZWNyZXRBY2Nlc3NLZXkgKyAnJicsIHN0cmluZ1RvU2lnbiwgJ2Jhc2U2NCcsICdzaGExJyk7XG4gIHF1ZXJ5U3RyID0gQUxZLnV0aWwucXVlcnlQYXJhbXNUb1N0cmluZyhxdWVyeSk7XG4gIGNvbnNvbGUubG9nKHF1ZXJ5U3RyKTtcbiAgcmV0dXJuIHF1ZXJ5U3RyO1xufTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL3MzL3ZvZC91cGxvYWRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIEFMWSwgY29sbGVjdGlvbk5hbWUsIGUsIHVzZXJJZDtcbiAgdHJ5IHtcbiAgICB1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBwZXJtaXNzaW9uXCIpO1xuICAgIH1cbiAgICBjb2xsZWN0aW9uTmFtZSA9IFwidmlkZW9zXCI7XG4gICAgQUxZID0gcmVxdWlyZSgnYWxpeXVuLXNkaycpO1xuICAgIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyhyZXEsIHJlcywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYWNjZXNzS2V5SWQsIGNvbGxlY3Rpb24sIGRhdGUsIG9zcywgcXVlcnksIHIsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgc2VjcmV0QWNjZXNzS2V5LCB1cGxvYWRBZGRyZXNzLCB1cGxvYWRBdXRoLCB1cmwsIHZpZGVvSWQ7XG4gICAgICBjb2xsZWN0aW9uID0gY2ZzW2NvbGxlY3Rpb25OYW1lXTtcbiAgICAgIGlmICghY29sbGVjdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBDb2xsZWN0aW9uXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHJlcS5maWxlcyAmJiByZXEuZmlsZXNbMF0pIHtcbiAgICAgICAgaWYgKGNvbGxlY3Rpb25OYW1lID09PSAndmlkZW9zJyAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS5jZnMpICE9IG51bGwgPyByZWYuc3RvcmUgOiB2b2lkIDApID09PSBcIk9TU1wiKSB7XG4gICAgICAgICAgYWNjZXNzS2V5SWQgPSAocmVmMSA9IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKSAhPSBudWxsID8gcmVmMS5hY2Nlc3NLZXlJZCA6IHZvaWQgMDtcbiAgICAgICAgICBzZWNyZXRBY2Nlc3NLZXkgPSAocmVmMiA9IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKSAhPSBudWxsID8gcmVmMi5zZWNyZXRBY2Nlc3NLZXkgOiB2b2lkIDA7XG4gICAgICAgICAgZGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpO1xuICAgICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgICAgQWN0aW9uOiBcIkNyZWF0ZVVwbG9hZFZpZGVvXCIsXG4gICAgICAgICAgICBUaXRsZTogcmVxLmZpbGVzWzBdLmZpbGVuYW1lLFxuICAgICAgICAgICAgRmlsZU5hbWU6IHJlcS5maWxlc1swXS5maWxlbmFtZVxuICAgICAgICAgIH07XG4gICAgICAgICAgdXJsID0gXCJodHRwOi8vdm9kLmNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS8/XCIgKyBnZXRRdWVyeVN0cmluZyhhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBxdWVyeSwgJ0dFVCcpO1xuICAgICAgICAgIHIgPSBIVFRQLmNhbGwoJ0dFVCcsIHVybCk7XG4gICAgICAgICAgY29uc29sZS5sb2cocik7XG4gICAgICAgICAgaWYgKChyZWYzID0gci5kYXRhKSAhPSBudWxsID8gcmVmMy5WaWRlb0lkIDogdm9pZCAwKSB7XG4gICAgICAgICAgICB2aWRlb0lkID0gci5kYXRhLlZpZGVvSWQ7XG4gICAgICAgICAgICB1cGxvYWRBZGRyZXNzID0gSlNPTi5wYXJzZShuZXcgQnVmZmVyKHIuZGF0YS5VcGxvYWRBZGRyZXNzLCAnYmFzZTY0JykudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1cGxvYWRBZGRyZXNzKTtcbiAgICAgICAgICAgIHVwbG9hZEF1dGggPSBKU09OLnBhcnNlKG5ldyBCdWZmZXIoci5kYXRhLlVwbG9hZEF1dGgsICdiYXNlNjQnKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVwbG9hZEF1dGgpO1xuICAgICAgICAgICAgb3NzID0gbmV3IEFMWS5PU1Moe1xuICAgICAgICAgICAgICBcImFjY2Vzc0tleUlkXCI6IHVwbG9hZEF1dGguQWNjZXNzS2V5SWQsXG4gICAgICAgICAgICAgIFwic2VjcmV0QWNjZXNzS2V5XCI6IHVwbG9hZEF1dGguQWNjZXNzS2V5U2VjcmV0LFxuICAgICAgICAgICAgICBcImVuZHBvaW50XCI6IHVwbG9hZEFkZHJlc3MuRW5kcG9pbnQsXG4gICAgICAgICAgICAgIFwiYXBpVmVyc2lvblwiOiAnMjAxMy0xMC0xNScsXG4gICAgICAgICAgICAgIFwic2VjdXJpdHlUb2tlblwiOiB1cGxvYWRBdXRoLlNlY3VyaXR5VG9rZW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG9zcy5wdXRPYmplY3Qoe1xuICAgICAgICAgICAgICBCdWNrZXQ6IHVwbG9hZEFkZHJlc3MuQnVja2V0LFxuICAgICAgICAgICAgICBLZXk6IHVwbG9hZEFkZHJlc3MuRmlsZU5hbWUsXG4gICAgICAgICAgICAgIEJvZHk6IHJlcS5maWxlc1swXS5kYXRhLFxuICAgICAgICAgICAgICBBY2Nlc3NDb250cm9sQWxsb3dPcmlnaW46ICcnLFxuICAgICAgICAgICAgICBDb250ZW50VHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlLFxuICAgICAgICAgICAgICBDYWNoZUNvbnRyb2w6ICduby1jYWNoZScsXG4gICAgICAgICAgICAgIENvbnRlbnREaXNwb3NpdGlvbjogJycsXG4gICAgICAgICAgICAgIENvbnRlbnRFbmNvZGluZzogJ3V0Zi04JyxcbiAgICAgICAgICAgICAgU2VydmVyU2lkZUVuY3J5cHRpb246ICdBRVMyNTYnLFxuICAgICAgICAgICAgICBFeHBpcmVzOiBudWxsXG4gICAgICAgICAgICB9LCBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgICB2YXIgZ2V0UGxheUluZm9RdWVyeSwgZ2V0UGxheUluZm9SZXN1bHQsIGdldFBsYXlJbmZvVXJsLCBuZXdEYXRlO1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yOicsIGVycik7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc3VjY2VzczonLCBkYXRhKTtcbiAgICAgICAgICAgICAgbmV3RGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpO1xuICAgICAgICAgICAgICBnZXRQbGF5SW5mb1F1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgIEFjdGlvbjogJ0dldFBsYXlJbmZvJyxcbiAgICAgICAgICAgICAgICBWaWRlb0lkOiB2aWRlb0lkXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGdldFBsYXlJbmZvVXJsID0gXCJodHRwOi8vdm9kLmNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS8/XCIgKyBnZXRRdWVyeVN0cmluZyhhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBnZXRQbGF5SW5mb1F1ZXJ5LCAnR0VUJyk7XG4gICAgICAgICAgICAgIGdldFBsYXlJbmZvUmVzdWx0ID0gSFRUUC5jYWxsKCdHRVQnLCBnZXRQbGF5SW5mb1VybCk7XG4gICAgICAgICAgICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGdldFBsYXlJbmZvUmVzdWx0XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gRmlsZVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogZS5lcnJvciB8fCA1MDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgJ3Bvc3QnLCAnL2FwaS9vYmplY3Qvd29ya2Zsb3cvZHJhZnRzJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxyXG5cdFx0Y3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkXHJcblxyXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxyXG5cclxuXHRcdGluc2VydGVkX2luc3RhbmNlcyA9IG5ldyBBcnJheVxyXG5cclxuXHRcdF8uZWFjaCBoYXNoRGF0YVsnSW5zdGFuY2VzJ10sIChpbnN0YW5jZV9mcm9tX2NsaWVudCkgLT5cclxuXHRcdFx0bmV3X2luc19pZCA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY3JlYXRlX2luc3RhbmNlKGluc3RhbmNlX2Zyb21fY2xpZW50LCBjdXJyZW50X3VzZXJfaW5mbylcclxuXHJcblx0XHRcdG5ld19pbnMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kT25lKHsgX2lkOiBuZXdfaW5zX2lkIH0sIHsgZmllbGRzOiB7IHNwYWNlOiAxLCBmbG93OiAxLCBmbG93X3ZlcnNpb246IDEsIGZvcm06IDEsIGZvcm1fdmVyc2lvbjogMSB9IH0pXHJcblxyXG5cdFx0XHRpbnNlcnRlZF9pbnN0YW5jZXMucHVzaChuZXdfaW5zKVxyXG5cclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdGRhdGE6IHsgaW5zZXJ0czogaW5zZXJ0ZWRfaW5zdGFuY2VzIH1cclxuXHRcdH1cclxuXHRjYXRjaCBlXHJcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbeyBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XSB9XHJcblx0XHR9XHJcblxyXG4iLCJKc29uUm91dGVzLmFkZCgncG9zdCcsICcvYXBpL29iamVjdC93b3JrZmxvdy9kcmFmdHMnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgY3VycmVudF91c2VyX2lkLCBjdXJyZW50X3VzZXJfaW5mbywgZSwgaGFzaERhdGEsIGluc2VydGVkX2luc3RhbmNlcztcbiAgdHJ5IHtcbiAgICBjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpO1xuICAgIGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZDtcbiAgICBoYXNoRGF0YSA9IHJlcS5ib2R5O1xuICAgIGluc2VydGVkX2luc3RhbmNlcyA9IG5ldyBBcnJheTtcbiAgICBfLmVhY2goaGFzaERhdGFbJ0luc3RhbmNlcyddLCBmdW5jdGlvbihpbnN0YW5jZV9mcm9tX2NsaWVudCkge1xuICAgICAgdmFyIG5ld19pbnMsIG5ld19pbnNfaWQ7XG4gICAgICBuZXdfaW5zX2lkID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UoaW5zdGFuY2VfZnJvbV9jbGllbnQsIGN1cnJlbnRfdXNlcl9pbmZvKTtcbiAgICAgIG5ld19pbnMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kT25lKHtcbiAgICAgICAgX2lkOiBuZXdfaW5zX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHNwYWNlOiAxLFxuICAgICAgICAgIGZsb3c6IDEsXG4gICAgICAgICAgZmxvd192ZXJzaW9uOiAxLFxuICAgICAgICAgIGZvcm06IDEsXG4gICAgICAgICAgZm9ybV92ZXJzaW9uOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGluc2VydGVkX2luc3RhbmNlcy5wdXNoKG5ld19pbnMpO1xuICAgIH0pO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGluc2VydHM6IGluc2VydGVkX2luc3RhbmNlc1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIl19
