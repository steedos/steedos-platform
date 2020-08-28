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
      return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name + "/grid/" + list_view_id);
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
    name_field_key = (ref = Creator.getObject(object_name)) != null ? ref.NAME_FIELD_KEY : void 0;

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
        var fieldsObj, formField, formTableFieldCode, lookupFieldName, lookupObject, oTableCode, oTableFieldCode, objField, objectField, objectFieldName, object_field, odataFieldValue, referenceToFieldValue, referenceToObjectName, relatedObjectFieldCode, selectFieldValue, tableToRelatedMapKey, wTableCode, workflow_field;
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

            if (objectField && (objectField.type === "lookup" || objectField.type === "master_detail") && !objectField.multiple) {
              fieldsObj = {};
              fieldsObj[lookupFieldName] = 1;
              lookupObject = Creator.getCollection(objectField.reference_to, spaceId).findOne(record[objectFieldName], {
                fields: fieldsObj
              });

              if (lookupObject) {
                return values[workflow_field] = lookupObject[lookupFieldName];
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjcmVhdG9yL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvbGliL2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvb2JqZWN0X3JlY2VudF92aWV3ZWQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3ZpZXdlZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3JlY29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9yZWNlbnRfcmVjb3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9yZXBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3JlcG9ydF9kYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfZXhwb3J0MnhtbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9leHBvcnQyeG1sLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3JlbGF0ZWRfb2JqZWN0c19yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvcGVuZGluZ19zcGFjZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3BlbmRpbmdfc3BhY2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF90YWJ1bGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF9saXN0dmlld3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy91c2VyX3RhYnVsYXJfc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9yZWxhdGVkX29iamVjdHNfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV91c2VyX2luZm8uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c192aWV3X2xpbWl0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfdmlld19saW1pdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c19ub19mb3JjZV9waG9uZV91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9uZWVkX3RvX2NvbmZpcm0uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX25lZWRfdG9fY29uZmlybS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbGliL3Blcm1pc3Npb25fbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvcGVybWlzc2lvbl9tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9zMy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImJ1c2JveSIsIm1rZGlycCIsIk1ldGVvciIsInNldHRpbmdzIiwiY2ZzIiwiYWxpeXVuIiwiQ3JlYXRvciIsImdldFNjaGVtYSIsIm9iamVjdF9uYW1lIiwicmVmIiwiZ2V0T2JqZWN0Iiwic2NoZW1hIiwiZ2V0T2JqZWN0VXJsIiwicmVjb3JkX2lkIiwiYXBwX2lkIiwibGlzdF92aWV3IiwibGlzdF92aWV3X2lkIiwiU2Vzc2lvbiIsImdldCIsImdldExpc3RWaWV3IiwiX2lkIiwiZ2V0UmVsYXRpdmVVcmwiLCJnZXRPYmplY3RBYnNvbHV0ZVVybCIsIlN0ZWVkb3MiLCJhYnNvbHV0ZVVybCIsImdldE9iamVjdFJvdXRlclVybCIsImdldExpc3RWaWV3VXJsIiwidXJsIiwiZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybCIsImdldFN3aXRjaExpc3RVcmwiLCJnZXRSZWxhdGVkT2JqZWN0VXJsIiwicmVsYXRlZF9vYmplY3RfbmFtZSIsImdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyIsImlzX2RlZXAiLCJpc19za2lwX2hpZGUiLCJpc19yZWxhdGVkIiwiX29iamVjdCIsIl9vcHRpb25zIiwiZmllbGRzIiwiaWNvbiIsInJlbGF0ZWRPYmplY3RzIiwiXyIsImZvckVhY2giLCJmIiwiayIsImhpZGRlbiIsInR5cGUiLCJwdXNoIiwibGFiZWwiLCJ2YWx1ZSIsInJfb2JqZWN0IiwicmVmZXJlbmNlX3RvIiwiaXNTdHJpbmciLCJmMiIsImsyIiwiZ2V0UmVsYXRlZE9iamVjdHMiLCJlYWNoIiwiX3RoaXMiLCJfcmVsYXRlZE9iamVjdCIsInJlbGF0ZWRPYmplY3QiLCJyZWxhdGVkT3B0aW9ucyIsInJlbGF0ZWRPcHRpb24iLCJmb3JlaWduX2tleSIsIm5hbWUiLCJnZXRPYmplY3RGaWx0ZXJGaWVsZE9wdGlvbnMiLCJwZXJtaXNzaW9uX2ZpZWxkcyIsImdldEZpZWxkcyIsImluY2x1ZGUiLCJ0ZXN0IiwiaW5kZXhPZiIsImdldE9iamVjdEZpZWxkT3B0aW9ucyIsImdldEZpbHRlcnNXaXRoRmlsdGVyRmllbGRzIiwiZmlsdGVycyIsImZpbHRlcl9maWVsZHMiLCJsZW5ndGgiLCJuIiwiZmllbGQiLCJyZXF1aXJlZCIsImZpbmRXaGVyZSIsImlzX2RlZmF1bHQiLCJpc19yZXF1aXJlZCIsImZpbHRlckl0ZW0iLCJtYXRjaEZpZWxkIiwiZmluZCIsImdldE9iamVjdFJlY29yZCIsInNlbGVjdF9maWVsZHMiLCJleHBhbmQiLCJjb2xsZWN0aW9uIiwicmVjb3JkIiwicmVmMSIsInJlZjIiLCJpc0NsaWVudCIsIlRlbXBsYXRlIiwiaW5zdGFuY2UiLCJvZGF0YSIsImdldENvbGxlY3Rpb24iLCJmaW5kT25lIiwiZ2V0T2JqZWN0UmVjb3JkTmFtZSIsIm5hbWVfZmllbGRfa2V5IiwiTkFNRV9GSUVMRF9LRVkiLCJnZXRBcHAiLCJhcHAiLCJBcHBzIiwiZGVwcyIsImRlcGVuZCIsImdldEFwcERhc2hib2FyZCIsImRhc2hib2FyZCIsIkRhc2hib2FyZHMiLCJhcHBzIiwiZ2V0QXBwRGFzaGJvYXJkQ29tcG9uZW50IiwiUmVhY3RTdGVlZG9zIiwicGx1Z2luQ29tcG9uZW50U2VsZWN0b3IiLCJzdG9yZSIsImdldFN0YXRlIiwiZ2V0QXBwT2JqZWN0TmFtZXMiLCJhcHBPYmplY3RzIiwiaXNNb2JpbGUiLCJvYmplY3RzIiwibW9iaWxlX29iamVjdHMiLCJvYmoiLCJwZXJtaXNzaW9ucyIsImFsbG93UmVhZCIsImdldFZpc2libGVBcHBzIiwiaW5jbHVkZUFkbWluIiwiY2hhbmdlQXBwIiwiX3N1YkFwcCIsImVudGl0aWVzIiwiT2JqZWN0IiwiYXNzaWduIiwidmlzaWJsZUFwcHNTZWxlY3RvciIsImdldFZpc2libGVBcHBzT2JqZWN0cyIsInZpc2libGVPYmplY3ROYW1lcyIsImZsYXR0ZW4iLCJwbHVjayIsImZpbHRlciIsIk9iamVjdHMiLCJzb3J0Iiwic29ydGluZ01ldGhvZCIsImJpbmQiLCJrZXkiLCJ1bmlxIiwiZ2V0QXBwc09iamVjdHMiLCJ0ZW1wT2JqZWN0cyIsImNvbmNhdCIsInZhbGlkYXRlRmlsdGVycyIsImxvZ2ljIiwiZSIsImVycm9yTXNnIiwiZmlsdGVyX2l0ZW1zIiwiZmlsdGVyX2xlbmd0aCIsImZsYWciLCJpbmRleCIsIndvcmQiLCJtYXAiLCJpc0VtcHR5IiwiY29tcGFjdCIsInJlcGxhY2UiLCJtYXRjaCIsImkiLCJpbmNsdWRlcyIsInciLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJ0b2FzdHIiLCJmb3JtYXRGaWx0ZXJzVG9Nb25nbyIsIm9wdGlvbnMiLCJzZWxlY3RvciIsIkFycmF5Iiwib3BlcmF0aW9uIiwib3B0aW9uIiwicmVnIiwic3ViX3NlbGVjdG9yIiwiZXZhbHVhdGVGb3JtdWxhIiwiUmVnRXhwIiwiaXNCZXR3ZWVuRmlsdGVyT3BlcmF0aW9uIiwiZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzIiwiZm9ybWF0RmlsdGVyc1RvRGV2IiwibG9naWNUZW1wRmlsdGVycyIsInN0ZWVkb3NGaWx0ZXJzIiwicmVxdWlyZSIsImlzX2xvZ2ljX29yIiwicG9wIiwiVVNFUl9DT05URVhUIiwiZm9ybWF0TG9naWNGaWx0ZXJzVG9EZXYiLCJmaWx0ZXJfbG9naWMiLCJmb3JtYXRfbG9naWMiLCJ4IiwiX2YiLCJpc0FycmF5IiwiSlNPTiIsInN0cmluZ2lmeSIsInNwYWNlSWQiLCJ1c2VySWQiLCJyZWxhdGVkX29iamVjdF9uYW1lcyIsInJlbGF0ZWRfb2JqZWN0cyIsInVucmVsYXRlZF9vYmplY3RzIiwiZ2V0T2JqZWN0UmVsYXRlZHMiLCJfY29sbGVjdGlvbl9uYW1lIiwiZ2V0UGVybWlzc2lvbnMiLCJkaWZmZXJlbmNlIiwicmVsYXRlZF9vYmplY3QiLCJpc0FjdGl2ZSIsImdldFJlbGF0ZWRPYmplY3ROYW1lcyIsImdldEFjdGlvbnMiLCJhY3Rpb25zIiwiZGlzYWJsZWRfYWN0aW9ucyIsInNvcnRCeSIsInZhbHVlcyIsImhhcyIsImFjdGlvbiIsImFsbG93X2FjdGlvbnMiLCJvbiIsImdldExpc3RWaWV3cyIsImRpc2FibGVkX2xpc3Rfdmlld3MiLCJsaXN0X3ZpZXdzIiwib2JqZWN0IiwiaXRlbSIsIml0ZW1fbmFtZSIsIm93bmVyIiwiZmllbGRzTmFtZSIsInVucmVhZGFibGVfZmllbGRzIiwiZ2V0T2JqZWN0RmllbGRzTmFtZSIsImlzbG9hZGluZyIsImJvb3RzdHJhcExvYWRlZCIsImNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyIiwic3RyIiwiZ2V0RGlzYWJsZWRGaWVsZHMiLCJmaWVsZE5hbWUiLCJhdXRvZm9ybSIsImRpc2FibGVkIiwib21pdCIsImdldEhpZGRlbkZpZWxkcyIsImdldEZpZWxkc1dpdGhOb0dyb3VwIiwiZ3JvdXAiLCJnZXRTb3J0ZWRGaWVsZEdyb3VwTmFtZXMiLCJuYW1lcyIsInVuaXF1ZSIsImdldEZpZWxkc0Zvckdyb3VwIiwiZ3JvdXBOYW1lIiwiZ2V0RmllbGRzV2l0aG91dE9taXQiLCJrZXlzIiwicGljayIsImdldEZpZWxkc0luRmlyc3RMZXZlbCIsImZpcnN0TGV2ZWxLZXlzIiwiZ2V0RmllbGRzRm9yUmVvcmRlciIsImlzU2luZ2xlIiwiX2tleXMiLCJjaGlsZEtleXMiLCJpc193aWRlXzEiLCJpc193aWRlXzIiLCJzY18xIiwic2NfMiIsImVuZHNXaXRoIiwiaXNfd2lkZSIsInNsaWNlIiwiaXNGaWx0ZXJWYWx1ZUVtcHR5IiwiTnVtYmVyIiwiaXNOYU4iLCJpc1NlcnZlciIsImdldEFsbFJlbGF0ZWRPYmplY3RzIiwicmVsYXRlZF9maWVsZCIsInJlbGF0ZWRfZmllbGRfbmFtZSIsImVuYWJsZV9maWxlcyIsImFwcHNCeU5hbWUiLCJtZXRob2RzIiwic3BhY2VfaWQiLCJjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQiLCJjdXJyZW50X3JlY2VudF92aWV3ZWQiLCJkb2MiLCJzcGFjZSIsInVwZGF0ZSIsIiRpbmMiLCJjb3VudCIsIiRzZXQiLCJtb2RpZmllZCIsIkRhdGUiLCJtb2RpZmllZF9ieSIsImluc2VydCIsIl9tYWtlTmV3SUQiLCJvIiwiaWRzIiwiY3JlYXRlZCIsImNyZWF0ZWRfYnkiLCJhc3luY19yZWNlbnRfYWdncmVnYXRlIiwicmVjZW50X2FnZ3JlZ2F0ZSIsInNlYXJjaF9vYmplY3QiLCJfcmVjb3JkcyIsImNhbGxiYWNrIiwiQ29sbGVjdGlvbnMiLCJvYmplY3RfcmVjZW50X3ZpZXdlZCIsInJhd0NvbGxlY3Rpb24iLCJhZ2dyZWdhdGUiLCIkbWF0Y2giLCIkZ3JvdXAiLCJtYXhDcmVhdGVkIiwiJG1heCIsIiRzb3J0IiwiJGxpbWl0IiwidG9BcnJheSIsImVyciIsImRhdGEiLCJFcnJvciIsImlzRnVuY3Rpb24iLCJ3cmFwQXN5bmMiLCJzZWFyY2hUZXh0IiwiX29iamVjdF9jb2xsZWN0aW9uIiwiX29iamVjdF9uYW1lX2tleSIsInF1ZXJ5IiwicXVlcnlfYW5kIiwicmVjb3JkcyIsInNlYXJjaF9LZXl3b3JkcyIsInNwbGl0Iiwia2V5d29yZCIsInN1YnF1ZXJ5IiwiJHJlZ2V4IiwidHJpbSIsIiRhbmQiLCIkaW4iLCJsaW1pdCIsIl9uYW1lIiwiX29iamVjdF9uYW1lIiwicmVjb3JkX29iamVjdCIsInJlY29yZF9vYmplY3RfY29sbGVjdGlvbiIsInNlbGYiLCJvYmplY3RzQnlOYW1lIiwib2JqZWN0X3JlY29yZCIsImVuYWJsZV9zZWFyY2giLCJ1cGRhdGVfZmlsdGVycyIsImxpc3R2aWV3X2lkIiwiZmlsdGVyX3Njb3BlIiwib2JqZWN0X2xpc3R2aWV3cyIsImRpcmVjdCIsInVwZGF0ZV9jb2x1bW5zIiwiY29sdW1ucyIsImNoZWNrIiwiY29tcG91bmRGaWVsZHMiLCJjdXJzb3IiLCJmaWx0ZXJGaWVsZHMiLCJvYmplY3RGaWVsZHMiLCJyZXN1bHQiLCJjaGlsZEtleSIsIm9iamVjdEZpZWxkIiwic3BsaXRzIiwiaXNDb21tb25TcGFjZSIsImlzU3BhY2VBZG1pbiIsInNraXAiLCJmZXRjaCIsImNvbXBvdW5kRmllbGRJdGVtIiwiY29tcG91bmRGaWx0ZXJGaWVsZHMiLCJpdGVtS2V5IiwiaXRlbVZhbHVlIiwicmVmZXJlbmNlSXRlbSIsInNldHRpbmciLCJjb2x1bW5fd2lkdGgiLCJvYmoxIiwiX2lkX2FjdGlvbnMiLCJfbWl4RmllbGRzRGF0YSIsIl9taXhSZWxhdGVkRGF0YSIsIl93cml0ZVhtbEZpbGUiLCJmcyIsImxvZ2dlciIsInBhdGgiLCJ4bWwyanMiLCJMb2dnZXIiLCJqc29uT2JqIiwib2JqTmFtZSIsImJ1aWxkZXIiLCJkYXkiLCJmaWxlQWRkcmVzcyIsImZpbGVOYW1lIiwiZmlsZVBhdGgiLCJtb250aCIsIm5vdyIsInN0cmVhbSIsInhtbCIsInllYXIiLCJCdWlsZGVyIiwiYnVpbGRPYmplY3QiLCJCdWZmZXIiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsImpvaW4iLCJfX21ldGVvcl9ib290c3RyYXBfXyIsInNlcnZlckRpciIsImV4aXN0c1N5bmMiLCJzeW5jIiwid3JpdGVGaWxlIiwibWl4Qm9vbCIsIm1peERhdGUiLCJtaXhEZWZhdWx0Iiwib2JqRmllbGRzIiwiZmllbGRfbmFtZSIsImRhdGUiLCJkYXRlU3RyIiwiZm9ybWF0IiwibW9tZW50IiwicmVsYXRlZE9iak5hbWVzIiwicmVsYXRlZE9iak5hbWUiLCJyZWxhdGVkQ29sbGVjdGlvbiIsInJlbGF0ZWRSZWNvcmRMaXN0IiwicmVsYXRlZFRhYmxlRGF0YSIsInJlbGF0ZWRPYmoiLCJmaWVsZHNEYXRhIiwiRXhwb3J0MnhtbCIsInJlY29yZExpc3QiLCJpbmZvIiwidGltZSIsInJlY29yZE9iaiIsInRpbWVFbmQiLCJyZWxhdGVkX29iamVjdHNfcmVjb3JkcyIsInJlbGF0ZWRfcmVjb3JkcyIsInZpZXdBbGxSZWNvcmRzIiwiZ2V0UGVuZGluZ1NwYWNlSW5mbyIsImludml0ZXJJZCIsImludml0ZXJOYW1lIiwic3BhY2VOYW1lIiwiZGIiLCJ1c2VycyIsInNwYWNlcyIsImludml0ZXIiLCJyZWZ1c2VKb2luU3BhY2UiLCJzcGFjZV91c2VycyIsImludml0ZV9zdGF0ZSIsImFjY2VwdEpvaW5TcGFjZSIsInVzZXJfYWNjZXB0ZWQiLCJwdWJsaXNoIiwiaWQiLCJwdWJsaXNoQ29tcG9zaXRlIiwidGFibGVOYW1lIiwiX2ZpZWxkcyIsIm9iamVjdF9jb2xsZWNpdG9uIiwicmVmZXJlbmNlX2ZpZWxkcyIsInJlYWR5IiwiU3RyaW5nIiwiTWF0Y2giLCJPcHRpb25hbCIsImdldE9iamVjdE5hbWUiLCJ1bmJsb2NrIiwiZmllbGRfa2V5cyIsImNoaWxkcmVuIiwiX29iamVjdEtleXMiLCJyZWZlcmVuY2VfZmllbGQiLCJwYXJlbnQiLCJjaGlsZHJlbl9maWVsZHMiLCJwX2siLCJyZWZlcmVuY2VfaWRzIiwicmVmZXJlbmNlX3RvX29iamVjdCIsInNfayIsImdldFByb3BlcnR5IiwicmVkdWNlIiwiaXNPYmplY3QiLCJzaGFyZWQiLCJ1c2VyIiwic3BhY2Vfc2V0dGluZ3MiLCJwZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbCIsImdldEZsb3dQZXJtaXNzaW9ucyIsImZsb3dfaWQiLCJ1c2VyX2lkIiwiZmxvdyIsIm15X3Blcm1pc3Npb25zIiwib3JnX2lkcyIsIm9yZ2FuaXphdGlvbnMiLCJvcmdzX2Nhbl9hZGQiLCJvcmdzX2Nhbl9hZG1pbiIsIm9yZ3NfY2FuX21vbml0b3IiLCJ1c2Vyc19jYW5fYWRkIiwidXNlcnNfY2FuX2FkbWluIiwidXNlcnNfY2FuX21vbml0b3IiLCJ1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsIiwiZ2V0RmxvdyIsInBhcmVudHMiLCJvcmciLCJwYXJlbnRfaWQiLCJwZXJtcyIsIm9yZ19pZCIsIl9ldmFsIiwiY2hlY2tfYXV0aG9yaXphdGlvbiIsInJlcSIsImF1dGhUb2tlbiIsImhhc2hlZFRva2VuIiwiQWNjb3VudHMiLCJfaGFzaExvZ2luVG9rZW4iLCJnZXRTcGFjZSIsImZsb3dzIiwiZ2V0U3BhY2VVc2VyIiwic3BhY2VfdXNlciIsImdldFNwYWNlVXNlck9yZ0luZm8iLCJvcmdhbml6YXRpb24iLCJmdWxsbmFtZSIsIm9yZ2FuaXphdGlvbl9uYW1lIiwib3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwiaXNGbG93RW5hYmxlZCIsInN0YXRlIiwiaXNGbG93U3BhY2VNYXRjaGVkIiwiZ2V0Rm9ybSIsImZvcm1faWQiLCJmb3JtIiwiZm9ybXMiLCJnZXRDYXRlZ29yeSIsImNhdGVnb3J5X2lkIiwiY2F0ZWdvcmllcyIsImNyZWF0ZV9pbnN0YW5jZSIsImluc3RhbmNlX2Zyb21fY2xpZW50IiwidXNlcl9pbmZvIiwiYXBwcl9vYmoiLCJhcHByb3ZlX2Zyb21fY2xpZW50IiwiY2F0ZWdvcnkiLCJpbnNfb2JqIiwibmV3X2luc19pZCIsInJlbGF0ZWRUYWJsZXNJbmZvIiwic3BhY2VfdXNlcl9vcmdfaW5mbyIsInN0YXJ0X3N0ZXAiLCJ0cmFjZV9mcm9tX2NsaWVudCIsInRyYWNlX29iaiIsImNoZWNrSXNJbkFwcHJvdmFsIiwicGVybWlzc2lvbk1hbmFnZXIiLCJpbnN0YW5jZXMiLCJmbG93X3ZlcnNpb24iLCJjdXJyZW50IiwiZm9ybV92ZXJzaW9uIiwic3VibWl0dGVyIiwic3VibWl0dGVyX25hbWUiLCJhcHBsaWNhbnQiLCJhcHBsaWNhbnRfbmFtZSIsImFwcGxpY2FudF9vcmdhbml6YXRpb24iLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUiLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwiYXBwbGljYW50X2NvbXBhbnkiLCJjb21wYW55X2lkIiwiY29kZSIsImlzX2FyY2hpdmVkIiwiaXNfZGVsZXRlZCIsInJlY29yZF9pZHMiLCJNb25nbyIsIk9iamVjdElEIiwiX3N0ciIsImlzX2ZpbmlzaGVkIiwic3RlcHMiLCJzdGVwIiwic3RlcF90eXBlIiwic3RhcnRfZGF0ZSIsInRyYWNlIiwidXNlcl9uYW1lIiwiaGFuZGxlciIsImhhbmRsZXJfbmFtZSIsImhhbmRsZXJfb3JnYW5pemF0aW9uIiwiaGFuZGxlcl9vcmdhbml6YXRpb25fbmFtZSIsImhhbmRsZXJfb3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwicmVhZF9kYXRlIiwiaXNfcmVhZCIsImlzX2Vycm9yIiwiZGVzY3JpcHRpb24iLCJpbml0aWF0ZVZhbHVlcyIsImFwcHJvdmVzIiwidHJhY2VzIiwiaW5ib3hfdXNlcnMiLCJjdXJyZW50X3N0ZXBfbmFtZSIsImF1dG9fcmVtaW5kIiwiZmxvd19uYW1lIiwiY2F0ZWdvcnlfbmFtZSIsImluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvIiwiaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvIiwiaW5pdGlhdGVBdHRhY2giLCJyZWNvcmRJZHMiLCJmbG93SWQiLCJmaWVsZENvZGVzIiwiZmlsdGVyVmFsdWVzIiwiZm9ybUZpZWxkcyIsImZvcm1UYWJsZUZpZWxkcyIsImZvcm1UYWJsZUZpZWxkc0NvZGUiLCJnZXRGaWVsZE9kYXRhVmFsdWUiLCJnZXRGb3JtRmllbGQiLCJnZXRGb3JtVGFibGVGaWVsZCIsImdldEZvcm1UYWJsZUZpZWxkQ29kZSIsImdldEZvcm1UYWJsZVN1YkZpZWxkIiwiZ2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSIsImdldFNlbGVjdE9yZ1ZhbHVlIiwiZ2V0U2VsZWN0T3JnVmFsdWVzIiwiZ2V0U2VsZWN0VXNlclZhbHVlIiwiZ2V0U2VsZWN0VXNlclZhbHVlcyIsIm9iamVjdE5hbWUiLCJvdyIsInJlY29yZElkIiwicmVsYXRlZE9iamVjdHNLZXlzIiwidGFibGVGaWVsZENvZGVzIiwidGFibGVGaWVsZE1hcCIsInRhYmxlVG9SZWxhdGVkTWFwIiwiZmYiLCJvYmplY3Rfd29ya2Zsb3dzIiwiZm9ybUZpZWxkIiwicmVsYXRlZE9iamVjdHNLZXkiLCJzdGFydHNXaXRoIiwiZm9ybVRhYmxlRmllbGRDb2RlIiwidGFibGVGaWVsZCIsInN1YkZpZWxkQ29kZSIsIl9yZWNvcmQiLCJzdSIsInVzZXJJZHMiLCJzdXMiLCJvcmdJZCIsIm9yZ0lkcyIsIm9yZ3MiLCJmaWVsZF9tYXAiLCJmbSIsImZpZWxkc09iaiIsImxvb2t1cEZpZWxkTmFtZSIsImxvb2t1cE9iamVjdCIsIm9UYWJsZUNvZGUiLCJvVGFibGVGaWVsZENvZGUiLCJvYmpGaWVsZCIsIm9iamVjdEZpZWxkTmFtZSIsIm9iamVjdF9maWVsZCIsIm9kYXRhRmllbGRWYWx1ZSIsInJlZmVyZW5jZVRvRmllbGRWYWx1ZSIsInJlZmVyZW5jZVRvT2JqZWN0TmFtZSIsInJlbGF0ZWRPYmplY3RGaWVsZENvZGUiLCJzZWxlY3RGaWVsZFZhbHVlIiwidGFibGVUb1JlbGF0ZWRNYXBLZXkiLCJ3VGFibGVDb2RlIiwid29ya2Zsb3dfZmllbGQiLCJoYXNPd25Qcm9wZXJ0eSIsIndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGUiLCJvYmplY3RfdGFibGVfZmllbGRfY29kZSIsIm11bHRpcGxlIiwiaXNfbXVsdGlzZWxlY3QiLCJ0ZmMiLCJjIiwicGFyc2UiLCJ0ciIsIm5ld1RyIiwidGZtIiwid1RkQ29kZSIsImZvcm1UYWJsZUZpZWxkIiwicmVsYXRlZEZpZWxkIiwicmVsYXRlZEZpZWxkTmFtZSIsInJlbGF0ZWRPYmplY3ROYW1lIiwicmVsYXRlZFJlY29yZHMiLCJyZWxhdGVkVGFibGVJdGVtcyIsInRhYmxlQ29kZSIsInRhYmxlVmFsdWVzIiwiX0ZST01fVEFCTEVfQ09ERSIsIndhcm4iLCJyciIsInRhYmxlVmFsdWVJdGVtIiwidmFsdWVLZXkiLCJmaWVsZEtleSIsImZvcm1GaWVsZEtleSIsInJlbGF0ZWRPYmplY3RGaWVsZCIsInRhYmxlRmllbGRWYWx1ZSIsIl90YWJsZSIsIl9jb2RlIiwiZmllbGRfbWFwX3NjcmlwdCIsImV4dGVuZCIsImV2YWxGaWVsZE1hcFNjcmlwdCIsIm9iamVjdElkIiwiZnVuYyIsInNjcmlwdCIsImluc0lkIiwiYXBwcm92ZUlkIiwiY2YiLCJ2ZXJzaW9ucyIsInZlcnNpb25JZCIsImlkeCIsIm5ld0ZpbGUiLCJGUyIsIkZpbGUiLCJhdHRhY2hEYXRhIiwiY3JlYXRlUmVhZFN0cmVhbSIsIm9yaWdpbmFsIiwibWV0YWRhdGEiLCJyZWFzb24iLCJzaXplIiwib3duZXJfbmFtZSIsImFwcHJvdmUiLCIkcHVzaCIsIiRlYWNoIiwiJHBvc2l0aW9uIiwibG9ja2VkIiwiaW5zdGFuY2Vfc3RhdGUiLCJ0YWJsZUl0ZW1zIiwiJGV4aXN0cyIsImdldFF1ZXJ5U3RyaW5nIiwiSnNvblJvdXRlcyIsImFkZCIsInJlcyIsIm5leHQiLCJwYXJzZUZpbGVzIiwiZmlsZUNvbGxlY3Rpb24iLCJmaWxlcyIsIm1pbWVUeXBlIiwiYm9keSIsImV4dGVudGlvbiIsImZpbGVPYmoiLCJmaWxlbmFtZSIsIm5ld0ZpbGVPYmpJZCIsInJlc3AiLCJ0b0xvd2VyQ2FzZSIsImRlY29kZVVSSUNvbXBvbmVudCIsInZlcnNpb25faWQiLCJzZXRIZWFkZXIiLCJlbmQiLCJzdGF0dXNDb2RlIiwiY29sbGVjdGlvbk5hbWUiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwicGFyYW1zIiwicmVzdWx0RGF0YSIsInNlbmRSZXN1bHQiLCJzdGFjayIsImVycm9ycyIsIm1lc3NhZ2UiLCJhY2Nlc3NLZXlJZCIsInNlY3JldEFjY2Vzc0tleSIsIm1ldGhvZCIsIkFMWSIsImNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyIsInF1ZXJ5S2V5cyIsInF1ZXJ5U3RyIiwic3RyaW5nVG9TaWduIiwidXRpbCIsIkZvcm1hdCIsIlZlcnNpb24iLCJBY2Nlc3NLZXlJZCIsIlNpZ25hdHVyZU1ldGhvZCIsIlRpbWVzdGFtcCIsImlzbzg2MDEiLCJTaWduYXR1cmVWZXJzaW9uIiwiU2lnbmF0dXJlTm9uY2UiLCJnZXRUaW1lIiwicG9wRXNjYXBlIiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJTaWduYXR1cmUiLCJjcnlwdG8iLCJobWFjIiwicXVlcnlQYXJhbXNUb1N0cmluZyIsIm9zcyIsInIiLCJyZWYzIiwidXBsb2FkQWRkcmVzcyIsInVwbG9hZEF1dGgiLCJ2aWRlb0lkIiwiQWN0aW9uIiwiVGl0bGUiLCJGaWxlTmFtZSIsIkhUVFAiLCJjYWxsIiwiVmlkZW9JZCIsIlVwbG9hZEFkZHJlc3MiLCJ0b1N0cmluZyIsIlVwbG9hZEF1dGgiLCJPU1MiLCJBY2Nlc3NLZXlTZWNyZXQiLCJFbmRwb2ludCIsIlNlY3VyaXR5VG9rZW4iLCJwdXRPYmplY3QiLCJCdWNrZXQiLCJLZXkiLCJCb2R5IiwiQWNjZXNzQ29udHJvbEFsbG93T3JpZ2luIiwiQ29udGVudFR5cGUiLCJDYWNoZUNvbnRyb2wiLCJDb250ZW50RGlzcG9zaXRpb24iLCJDb250ZW50RW5jb2RpbmciLCJTZXJ2ZXJTaWRlRW5jcnlwdGlvbiIsIkV4cGlyZXMiLCJiaW5kRW52aXJvbm1lbnQiLCJnZXRQbGF5SW5mb1F1ZXJ5IiwiZ2V0UGxheUluZm9SZXN1bHQiLCJnZXRQbGF5SW5mb1VybCIsIm5ld0RhdGUiLCJjdXJyZW50X3VzZXJfaWQiLCJjdXJyZW50X3VzZXJfaW5mbyIsImhhc2hEYXRhIiwiaW5zZXJ0ZWRfaW5zdGFuY2VzIiwibmV3X2lucyIsImluc2VydHMiLCJlcnJvck1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJ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b0JBQTdDLEVBQW1FNlEsaUJBQW5FLENBQWI7QUFFQUcsZ0JBQVVsd0IsUUFBUTJSLFdBQVIsQ0FBb0JxTyxTQUFwQixDQUE4QnRhLE9BQTlCLENBQXNDO0FBQUU1RSxhQUFLMGU7QUFBUCxPQUF0QyxFQUEyRDtBQUFFeGQsZ0JBQVE7QUFBRXdPLGlCQUFPLENBQVQ7QUFBWThMLGdCQUFNLENBQWxCO0FBQXFCMkQsd0JBQWMsQ0FBbkM7QUFBc0NyQixnQkFBTSxDQUE1QztBQUErQ3VCLHdCQUFjO0FBQTdEO0FBQVYsT0FBM0QsQ0FBVjtBQ1NHLGFEUEg4UCxtQkFBbUJ4dEIsSUFBbkIsQ0FBd0J5dEIsT0FBeEIsQ0NPRztBRFpKOztBQ2NFLFdEUEY1RixXQUFXd0IsVUFBWCxDQUFzQnRCLEdBQXRCLEVBQTJCO0FBQzFCM0osWUFBTSxHQURvQjtBQUUxQnRPLFlBQU07QUFBRTRkLGlCQUFTRjtBQUFYO0FBRm9CLEtBQTNCLENDT0U7QUR0QkgsV0FBQXRtQixLQUFBO0FBbUJNZixRQUFBZSxLQUFBO0FBQ0xDLFlBQVFELEtBQVIsQ0FBY2YsRUFBRW1qQixLQUFoQjtBQ1dFLFdEVkZ6QixXQUFXd0IsVUFBWCxDQUFzQnRCLEdBQXRCLEVBQTJCO0FBQzFCM0osWUFBTSxHQURvQjtBQUUxQnRPLFlBQU07QUFBRXlaLGdCQUFRLENBQUM7QUFBRW9FLHdCQUFjeG5CLEVBQUU4Z0IsTUFBRixJQUFZOWdCLEVBQUVxakI7QUFBOUIsU0FBRDtBQUFWO0FBRm9CLEtBQTNCLENDVUU7QUFVRDtBRDFDSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG5cdGNoZWNrTnBtVmVyc2lvbnNcclxufSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0YnVzYm95OiBcIl4wLjIuMTNcIixcclxuXHRta2RpcnA6IFwiXjAuMy41XCIsXHJcblx0XCJ4bWwyanNcIjogXCJeMC40LjE5XCIsXHJcblx0XCJub2RlLXhsc3hcIjogXCJeMC4xMi4wXCJcclxufSwgJ3N0ZWVkb3M6Y3JlYXRvcicpO1xyXG5cclxuaWYgKE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzICYmIE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKSB7XHJcblx0Y2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0XHRcImFsaXl1bi1zZGtcIjogXCJeMS4xMS4xMlwiXHJcblx0fSwgJ3N0ZWVkb3M6Y3JlYXRvcicpO1xyXG59IiwiXHJcblx0IyBDcmVhdG9yLmluaXRBcHBzKClcclxuXHJcblxyXG4jIENyZWF0b3IuaW5pdEFwcHMgPSAoKS0+XHJcbiMgXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuIyBcdFx0Xy5lYWNoIENyZWF0b3IuQXBwcywgKGFwcCwgYXBwX2lkKS0+XHJcbiMgXHRcdFx0ZGJfYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcclxuIyBcdFx0XHRpZiAhZGJfYXBwXHJcbiMgXHRcdFx0XHRhcHAuX2lkID0gYXBwX2lkXHJcbiMgXHRcdFx0XHRkYi5hcHBzLmluc2VydChhcHApXHJcbiMgZWxzZVxyXG4jIFx0YXBwLl9pZCA9IGFwcF9pZFxyXG4jIFx0ZGIuYXBwcy51cGRhdGUoe19pZDogYXBwX2lkfSwgYXBwKVxyXG5cclxuQ3JlYXRvci5nZXRTY2hlbWEgPSAob2JqZWN0X25hbWUpLT5cclxuXHRyZXR1cm4gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5zY2hlbWFcclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0VXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cclxuXHRpZiAhYXBwX2lkXHJcblx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXHJcblx0bGlzdF92aWV3X2lkID0gbGlzdF92aWV3Py5faWRcclxuXHJcblx0aWYgcmVjb3JkX2lkXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZClcclxuXHRlbHNlXHJcblx0XHRpZiBvYmplY3RfbmFtZSBpcyBcIm1lZXRpbmdcIlxyXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCIpXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RBYnNvbHV0ZVVybCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIC0+XHJcblx0aWYgIWFwcF9pZFxyXG5cdFx0YXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcclxuXHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cclxuXHRsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKVxyXG5cdGxpc3Rfdmlld19pZCA9IGxpc3Rfdmlldz8uX2lkXHJcblxyXG5cdGlmIHJlY29yZF9pZFxyXG5cdFx0cmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQsIHRydWUpXHJcblx0ZWxzZVxyXG5cdFx0aWYgb2JqZWN0X25hbWUgaXMgXCJtZWV0aW5nXCJcclxuXHRcdFx0cmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiLCB0cnVlKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCwgdHJ1ZSlcclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0Um91dGVyVXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cclxuXHRpZiAhYXBwX2lkXHJcblx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXHJcblx0bGlzdF92aWV3X2lkID0gbGlzdF92aWV3Py5faWRcclxuXHJcblx0aWYgcmVjb3JkX2lkXHJcblx0XHRyZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWRcclxuXHRlbHNlXHJcblx0XHRpZiBvYmplY3RfbmFtZSBpcyBcIm1lZXRpbmdcIlxyXG5cdFx0XHRyZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZFxyXG5cclxuQ3JlYXRvci5nZXRMaXN0Vmlld1VybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIC0+XHJcblx0dXJsID0gQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZClcclxuXHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCh1cmwpXHJcblxyXG5DcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwgPSAob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSAtPlxyXG5cdGlmIGxpc3Rfdmlld19pZCBpcyBcImNhbGVuZGFyXCJcclxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCJcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWRcclxuXHJcbkNyZWF0b3IuZ2V0U3dpdGNoTGlzdFVybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIC0+XHJcblx0aWYgbGlzdF92aWV3X2lkXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi9saXN0XCIpXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2xpc3Qvc3dpdGNoXCIpXHJcblxyXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RVcmwgPSAob2JqZWN0X25hbWUsIGFwcF9pZCwgcmVjb3JkX2lkLCByZWxhdGVkX29iamVjdF9uYW1lKSAtPlxyXG5cdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIHJlY29yZF9pZCArIFwiL1wiICsgcmVsYXRlZF9vYmplY3RfbmFtZSArIFwiL2dyaWRcIilcclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0TG9va3VwRmllbGRPcHRpb25zID0gKG9iamVjdF9uYW1lLCBpc19kZWVwLCBpc19za2lwX2hpZGUsIGlzX3JlbGF0ZWQpLT5cclxuXHRfb3B0aW9ucyA9IFtdXHJcblx0dW5sZXNzIG9iamVjdF9uYW1lXHJcblx0XHRyZXR1cm4gX29wdGlvbnNcclxuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0ZmllbGRzID0gX29iamVjdD8uZmllbGRzXHJcblx0aWNvbiA9IF9vYmplY3Q/Lmljb25cclxuXHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxyXG5cdFx0aWYgaXNfc2tpcF9oaWRlIGFuZCBmLmhpZGRlblxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdGlmIGYudHlwZSA9PSBcInNlbGVjdFwiXHJcblx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7Zi5sYWJlbCB8fCBrfVwiLCB2YWx1ZTogXCIje2t9XCIsIGljb246IGljb259XHJcblx0XHRlbHNlXHJcblx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBmLmxhYmVsIHx8IGssIHZhbHVlOiBrLCBpY29uOiBpY29ufVxyXG5cdGlmIGlzX2RlZXBcclxuXHRcdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XHJcblx0XHRcdGlmIGlzX3NraXBfaGlkZSBhbmQgZi5oaWRkZW5cclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0aWYgKGYudHlwZSA9PSBcImxvb2t1cFwiIHx8IGYudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIikgJiYgZi5yZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhmLnJlZmVyZW5jZV90bylcclxuXHRcdFx0XHQjIOS4jeaUr+aMgWYucmVmZXJlbmNlX3Rv5Li6ZnVuY3Rpb27nmoTmg4XlhrXvvIzmnInpnIDmsYLlho3or7RcclxuXHRcdFx0XHRyX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGYucmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdGlmIHJfb2JqZWN0XHJcblx0XHRcdFx0XHRfLmZvckVhY2ggcl9vYmplY3QuZmllbGRzLCAoZjIsIGsyKS0+XHJcblx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7Zi5sYWJlbCB8fCBrfT0+I3tmMi5sYWJlbCB8fCBrMn1cIiwgdmFsdWU6IFwiI3trfS4je2syfVwiLCBpY29uOiByX29iamVjdD8uaWNvbn1cclxuXHRpZiBpc19yZWxhdGVkXHJcblx0XHRyZWxhdGVkT2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpXHJcblx0XHRfLmVhY2ggcmVsYXRlZE9iamVjdHMsIChfcmVsYXRlZE9iamVjdCk9PlxyXG5cdFx0XHRyZWxhdGVkT3B0aW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0TG9va3VwRmllbGRPcHRpb25zKF9yZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lLCBmYWxzZSwgZmFsc2UsIGZhbHNlKVxyXG5cdFx0XHRyZWxhdGVkT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUpXHJcblx0XHRcdF8uZWFjaCByZWxhdGVkT3B0aW9ucywgKHJlbGF0ZWRPcHRpb24pLT5cclxuXHRcdFx0XHRpZiBfcmVsYXRlZE9iamVjdC5mb3JlaWduX2tleSAhPSByZWxhdGVkT3B0aW9uLnZhbHVlXHJcblx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogXCIje3JlbGF0ZWRPYmplY3QubGFiZWwgfHwgcmVsYXRlZE9iamVjdC5uYW1lfT0+I3tyZWxhdGVkT3B0aW9uLmxhYmVsfVwiLCB2YWx1ZTogXCIje3JlbGF0ZWRPYmplY3QubmFtZX0uI3tyZWxhdGVkT3B0aW9uLnZhbHVlfVwiLCBpY29uOiByZWxhdGVkT2JqZWN0Py5pY29ufVxyXG5cdHJldHVybiBfb3B0aW9uc1xyXG5cclxuIyDnu5/kuIDkuLrlr7nosaFvYmplY3RfbmFtZeaPkOS+m+WPr+eUqOS6jui/h+iZkeWZqOi/h+iZkeWtl+autVxyXG5DcmVhdG9yLmdldE9iamVjdEZpbHRlckZpZWxkT3B0aW9ucyA9IChvYmplY3RfbmFtZSktPlxyXG5cdF9vcHRpb25zID0gW11cclxuXHR1bmxlc3Mgb2JqZWN0X25hbWVcclxuXHRcdHJldHVybiBfb3B0aW9uc1xyXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRmaWVsZHMgPSBfb2JqZWN0Py5maWVsZHNcclxuXHRwZXJtaXNzaW9uX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKG9iamVjdF9uYW1lKVxyXG5cdGljb24gPSBfb2JqZWN0Py5pY29uXHJcblx0Xy5mb3JFYWNoIGZpZWxkcywgKGYsIGspLT5cclxuXHRcdCMgaGlkZGVuLGdyaWTnrYnnsbvlnovnmoTlrZfmrrXvvIzkuI3pnIDopoHov4fmu6RcclxuXHRcdGlmICFfLmluY2x1ZGUoW1wiZ3JpZFwiLFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiLCBcImF2YXRhclwiLCBcImltYWdlXCIsIFwibWFya2Rvd25cIiwgXCJodG1sXCJdLCBmLnR5cGUpIGFuZCAhZi5oaWRkZW5cclxuXHRcdFx0IyBmaWx0ZXJzLiQuZmllbGTlj4pmbG93LmN1cnJlbnTnrYnlrZDlrZfmrrXkuZ/kuI3pnIDopoHov4fmu6RcclxuXHRcdFx0aWYgIS9cXHcrXFwuLy50ZXN0KGspIGFuZCBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTFcclxuXHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogZi5sYWJlbCB8fCBrLCB2YWx1ZTogaywgaWNvbjogaWNvbn1cclxuXHJcblx0cmV0dXJuIF9vcHRpb25zXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkT3B0aW9ucyA9IChvYmplY3RfbmFtZSktPlxyXG5cdF9vcHRpb25zID0gW11cclxuXHR1bmxlc3Mgb2JqZWN0X25hbWVcclxuXHRcdHJldHVybiBfb3B0aW9uc1xyXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRmaWVsZHMgPSBfb2JqZWN0Py5maWVsZHNcclxuXHRwZXJtaXNzaW9uX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKG9iamVjdF9uYW1lKVxyXG5cdGljb24gPSBfb2JqZWN0Py5pY29uXHJcblx0Xy5mb3JFYWNoIGZpZWxkcywgKGYsIGspLT5cclxuXHRcdGlmICFfLmluY2x1ZGUoW1wiZ3JpZFwiLFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiLCBcImF2YXRhclwiLCBcImltYWdlXCIsIFwibWFya2Rvd25cIiwgXCJodG1sXCJdLCBmLnR5cGUpXHJcblx0XHRcdGlmICEvXFx3K1xcLi8udGVzdChrKSBhbmQgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xXHJcblx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XHJcblx0cmV0dXJuIF9vcHRpb25zXHJcblxyXG4jIyNcclxuZmlsdGVyczog6KaB6L2s5o2i55qEZmlsdGVyc1xyXG5maWVsZHM6IOWvueixoeWtl+autVxyXG5maWx0ZXJfZmllbGRzOiDpu5jorqTov4fmu6TlrZfmrrXvvIzmlK/mjIHlrZfnrKbkuLLmlbDnu4Tlkozlr7nosaHmlbDnu4TkuKTnp43moLzlvI/vvIzlpoI6WydmaWxlZF9uYW1lMScsJ2ZpbGVkX25hbWUyJ10sW3tmaWVsZDonZmlsZWRfbmFtZTEnLHJlcXVpcmVkOnRydWV9XVxyXG7lpITnkIbpgLvovpE6IOaKimZpbHRlcnPkuK3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25aKe5Yqg5q+P6aG555qEaXNfZGVmYXVsdOOAgWlzX3JlcXVpcmVk5bGe5oCn77yM5LiN5a2Y5Zyo5LqOZmlsdGVyX2ZpZWxkc+eahOi/h+a7pOadoeS7tuWvueW6lOeahOenu+mZpOavj+mhueeahOebuOWFs+WxnuaAp1xyXG7ov5Tlm57nu5Pmnpw6IOWkhOeQhuWQjueahGZpbHRlcnNcclxuIyMjXHJcbkNyZWF0b3IuZ2V0RmlsdGVyc1dpdGhGaWx0ZXJGaWVsZHMgPSAoZmlsdGVycywgZmllbGRzLCBmaWx0ZXJfZmllbGRzKS0+XHJcblx0dW5sZXNzIGZpbHRlcnNcclxuXHRcdGZpbHRlcnMgPSBbXVxyXG5cdHVubGVzcyBmaWx0ZXJfZmllbGRzXHJcblx0XHRmaWx0ZXJfZmllbGRzID0gW11cclxuXHRpZiBmaWx0ZXJfZmllbGRzPy5sZW5ndGhcclxuXHRcdGZpbHRlcl9maWVsZHMuZm9yRWFjaCAobiktPlxyXG5cdFx0XHRpZiBfLmlzU3RyaW5nKG4pXHJcblx0XHRcdFx0biA9IFxyXG5cdFx0XHRcdFx0ZmllbGQ6IG4sXHJcblx0XHRcdFx0XHRyZXF1aXJlZDogZmFsc2VcclxuXHRcdFx0aWYgZmllbGRzW24uZmllbGRdIGFuZCAhXy5maW5kV2hlcmUoZmlsdGVycyx7ZmllbGQ6bi5maWVsZH0pXHJcblx0XHRcdFx0ZmlsdGVycy5wdXNoXHJcblx0XHRcdFx0XHRmaWVsZDogbi5maWVsZCxcclxuXHRcdFx0XHRcdGlzX2RlZmF1bHQ6IHRydWUsXHJcblx0XHRcdFx0XHRpc19yZXF1aXJlZDogbi5yZXF1aXJlZFxyXG5cdGZpbHRlcnMuZm9yRWFjaCAoZmlsdGVySXRlbSktPlxyXG5cdFx0bWF0Y2hGaWVsZCA9IGZpbHRlcl9maWVsZHMuZmluZCAobiktPiByZXR1cm4gbiA9PSBmaWx0ZXJJdGVtLmZpZWxkIG9yIG4uZmllbGQgPT0gZmlsdGVySXRlbS5maWVsZFxyXG5cdFx0aWYgXy5pc1N0cmluZyhtYXRjaEZpZWxkKVxyXG5cdFx0XHRtYXRjaEZpZWxkID0gXHJcblx0XHRcdFx0ZmllbGQ6IG1hdGNoRmllbGQsXHJcblx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlXHJcblx0XHRpZiBtYXRjaEZpZWxkXHJcblx0XHRcdGZpbHRlckl0ZW0uaXNfZGVmYXVsdCA9IHRydWVcclxuXHRcdFx0ZmlsdGVySXRlbS5pc19yZXF1aXJlZCA9IG1hdGNoRmllbGQucmVxdWlyZWRcclxuXHRcdGVsc2VcclxuXHRcdFx0ZGVsZXRlIGZpbHRlckl0ZW0uaXNfZGVmYXVsdFxyXG5cdFx0XHRkZWxldGUgZmlsdGVySXRlbS5pc19yZXF1aXJlZFxyXG5cdHJldHVybiBmaWx0ZXJzXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpLT5cclxuXHJcblx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHJcblx0aWYgIXJlY29yZF9pZFxyXG5cdFx0cmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmIG9iamVjdF9uYW1lID09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikgJiYgIHJlY29yZF9pZCA9PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKVxyXG5cdFx0XHRpZiBUZW1wbGF0ZS5pbnN0YW5jZSgpPy5yZWNvcmRcclxuXHRcdFx0XHRyZXR1cm4gVGVtcGxhdGUuaW5zdGFuY2UoKT8ucmVjb3JkPy5nZXQoKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKVxyXG5cclxuXHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxyXG5cdGlmIGNvbGxlY3Rpb25cclxuXHRcdHJlY29yZCA9IGNvbGxlY3Rpb24uZmluZE9uZShyZWNvcmRfaWQpXHJcblx0XHRyZXR1cm4gcmVjb3JkXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZE5hbWUgPSAocmVjb3JkLCBvYmplY3RfbmFtZSktPlxyXG5cdHVubGVzcyByZWNvcmRcclxuXHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKClcclxuXHRpZiByZWNvcmRcclxuXHRcdG5hbWVfZmllbGRfa2V5ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5OQU1FX0ZJRUxEX0tFWVxyXG5cdFx0aWYgcmVjb3JkIGFuZCBuYW1lX2ZpZWxkX2tleVxyXG5cdFx0XHRyZXR1cm4gcmVjb3JkLmxhYmVsIHx8IHJlY29yZFtuYW1lX2ZpZWxkX2tleV1cclxuXHJcbkNyZWF0b3IuZ2V0QXBwID0gKGFwcF9pZCktPlxyXG5cdGlmICFhcHBfaWRcclxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXHJcblx0YXBwID0gQ3JlYXRvci5BcHBzW2FwcF9pZF1cclxuXHRDcmVhdG9yLmRlcHM/LmFwcD8uZGVwZW5kKClcclxuXHRyZXR1cm4gYXBwXHJcblxyXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZCA9IChhcHBfaWQpLT5cclxuXHRhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpXHJcblx0aWYgIWFwcFxyXG5cdFx0cmV0dXJuXHJcblx0ZGFzaGJvYXJkID0gbnVsbFxyXG5cdF8uZWFjaCBDcmVhdG9yLkRhc2hib2FyZHMsICh2LCBrKS0+XHJcblx0XHRpZiB2LmFwcHM/LmluZGV4T2YoYXBwLl9pZCkgPiAtMVxyXG5cdFx0XHRkYXNoYm9hcmQgPSB2O1xyXG5cdHJldHVybiBkYXNoYm9hcmQ7XHJcblxyXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZENvbXBvbmVudCA9IChhcHBfaWQpLT5cclxuXHRhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpXHJcblx0aWYgIWFwcFxyXG5cdFx0cmV0dXJuXHJcblx0cmV0dXJuIFJlYWN0U3RlZWRvcy5wbHVnaW5Db21wb25lbnRTZWxlY3RvcihSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKSwgXCJEYXNoYm9hcmRcIiwgYXBwLl9pZCk7XHJcblxyXG5DcmVhdG9yLmdldEFwcE9iamVjdE5hbWVzID0gKGFwcF9pZCktPlxyXG5cdGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZClcclxuXHRpZiAhYXBwXHJcblx0XHRyZXR1cm5cclxuXHRpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKVxyXG5cdGFwcE9iamVjdHMgPSBpZiBpc01vYmlsZSB0aGVuIGFwcC5tb2JpbGVfb2JqZWN0cyBlbHNlIGFwcC5vYmplY3RzXHJcblx0b2JqZWN0cyA9IFtdXHJcblx0aWYgYXBwXHJcblx0XHRfLmVhY2ggYXBwT2JqZWN0cywgKHYpLT5cclxuXHRcdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3QodilcclxuXHRcdFx0aWYgb2JqPy5wZXJtaXNzaW9ucy5nZXQoKS5hbGxvd1JlYWRcclxuXHRcdFx0XHRvYmplY3RzLnB1c2ggdlxyXG5cdHJldHVybiBvYmplY3RzXHJcblxyXG5DcmVhdG9yLmdldFZpc2libGVBcHBzID0gKGluY2x1ZGVBZG1pbiktPlxyXG5cdGNoYW5nZUFwcCA9IENyZWF0b3IuX3N1YkFwcC5nZXQoKTtcclxuXHRSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKS5lbnRpdGllcy5hcHBzID0gT2JqZWN0LmFzc2lnbih7fSwgUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCkuZW50aXRpZXMuYXBwcywge2FwcHM6IGNoYW5nZUFwcH0pO1xyXG5cdHJldHVybiBSZWFjdFN0ZWVkb3MudmlzaWJsZUFwcHNTZWxlY3RvcihSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKSwgaW5jbHVkZUFkbWluKVxyXG5cclxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwc09iamVjdHMgPSAoKS0+XHJcblx0YXBwcyA9IENyZWF0b3IuZ2V0VmlzaWJsZUFwcHMoKVxyXG5cdHZpc2libGVPYmplY3ROYW1lcyA9IF8uZmxhdHRlbihfLnBsdWNrKGFwcHMsJ29iamVjdHMnKSlcclxuXHRvYmplY3RzID0gXy5maWx0ZXIgQ3JlYXRvci5PYmplY3RzLCAob2JqKS0+XHJcblx0XHRpZiB2aXNpYmxlT2JqZWN0TmFtZXMuaW5kZXhPZihvYmoubmFtZSkgPCAwXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdG9iamVjdHMgPSBvYmplY3RzLnNvcnQoQ3JlYXRvci5zb3J0aW5nTWV0aG9kLmJpbmQoe2tleTpcImxhYmVsXCJ9KSlcclxuXHRvYmplY3RzID0gXy5wbHVjayhvYmplY3RzLCduYW1lJylcclxuXHRyZXR1cm4gXy51bmlxIG9iamVjdHNcclxuXHJcbkNyZWF0b3IuZ2V0QXBwc09iamVjdHMgPSAoKS0+XHJcblx0b2JqZWN0cyA9IFtdXHJcblx0dGVtcE9iamVjdHMgPSBbXVxyXG5cdF8uZm9yRWFjaCBDcmVhdG9yLkFwcHMsIChhcHApLT5cclxuXHRcdHRlbXBPYmplY3RzID0gXy5maWx0ZXIgYXBwLm9iamVjdHMsIChvYmopLT5cclxuXHRcdFx0cmV0dXJuICFvYmouaGlkZGVuXHJcblx0XHRvYmplY3RzID0gb2JqZWN0cy5jb25jYXQodGVtcE9iamVjdHMpXHJcblx0cmV0dXJuIF8udW5pcSBvYmplY3RzXHJcblxyXG5DcmVhdG9yLnZhbGlkYXRlRmlsdGVycyA9IChmaWx0ZXJzLCBsb2dpYyktPlxyXG5cdGZpbHRlcl9pdGVtcyA9IF8ubWFwIGZpbHRlcnMsIChvYmopIC0+XHJcblx0XHRpZiBfLmlzRW1wdHkob2JqKVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIG9ialxyXG5cdGZpbHRlcl9pdGVtcyA9IF8uY29tcGFjdChmaWx0ZXJfaXRlbXMpXHJcblx0ZXJyb3JNc2cgPSBcIlwiXHJcblx0ZmlsdGVyX2xlbmd0aCA9IGZpbHRlcl9pdGVtcy5sZW5ndGhcclxuXHRpZiBsb2dpY1xyXG5cdFx0IyDmoLzlvI/ljJZmaWx0ZXJcclxuXHRcdGxvZ2ljID0gbG9naWMucmVwbGFjZSgvXFxuL2csIFwiXCIpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpXHJcblxyXG5cdFx0IyDliKTmlq3nibnmrorlrZfnrKZcclxuXHRcdGlmIC9bLl9cXC0hK10rL2lnLnRlc3QobG9naWMpXHJcblx0XHRcdGVycm9yTXNnID0gXCLlkKvmnInnibnmrorlrZfnrKbjgIJcIlxyXG5cclxuXHRcdGlmICFlcnJvck1zZ1xyXG5cdFx0XHRpbmRleCA9IGxvZ2ljLm1hdGNoKC9cXGQrL2lnKVxyXG5cdFx0XHRpZiAhaW5kZXhcclxuXHRcdFx0XHRlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGluZGV4LmZvckVhY2ggKGkpLT5cclxuXHRcdFx0XHRcdGlmIGkgPCAxIG9yIGkgPiBmaWx0ZXJfbGVuZ3RoXHJcblx0XHRcdFx0XHRcdGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInmnaHku7blvJXnlKjkuobmnKrlrprkuYnnmoTnrZvpgInlmajvvJoje2l944CCXCJcclxuXHJcblx0XHRcdFx0ZmxhZyA9IDFcclxuXHRcdFx0XHR3aGlsZSBmbGFnIDw9IGZpbHRlcl9sZW5ndGhcclxuXHRcdFx0XHRcdGlmICFpbmRleC5pbmNsdWRlcyhcIiN7ZmxhZ31cIilcclxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBcIuacieS6m+etm+mAieadoeS7tui/m+ihjOS6huWumuS5ie+8jOS9huacquWcqOmrmOe6p+etm+mAieadoeS7tuS4reiiq+W8leeUqOOAglwiXHJcblx0XHRcdFx0XHRmbGFnKys7XHJcblxyXG5cdFx0aWYgIWVycm9yTXNnXHJcblx0XHRcdCMg5Yik5pat5piv5ZCm5pyJ6Z2e5rOV6Iux5paH5a2X56ymXHJcblx0XHRcdHdvcmQgPSBsb2dpYy5tYXRjaCgvW2EtekEtWl0rL2lnKVxyXG5cdFx0XHRpZiB3b3JkXHJcblx0XHRcdFx0d29yZC5mb3JFYWNoICh3KS0+XHJcblx0XHRcdFx0XHRpZiAhL14oYW5kfG9yKSQvaWcudGVzdCh3KVxyXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IFwi5qOA5p+l5oKo55qE6auY57qn562b6YCJ5p2h5Lu25Lit55qE5ou85YaZ44CCXCJcclxuXHJcblx0XHRpZiAhZXJyb3JNc2dcclxuXHRcdFx0IyDliKTmlq3moLzlvI/mmK/lkKbmraPnoa5cclxuXHRcdFx0dHJ5XHJcblx0XHRcdFx0Q3JlYXRvci5ldmFsKGxvZ2ljLnJlcGxhY2UoL2FuZC9pZywgXCImJlwiKS5yZXBsYWNlKC9vci9pZywgXCJ8fFwiKSlcclxuXHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajkuK3lkKvmnInnibnmrorlrZfnrKZcIlxyXG5cclxuXHRcdFx0aWYgLyhBTkQpW14oKV0rKE9SKS9pZy50ZXN0KGxvZ2ljKSB8fCAgLyhPUilbXigpXSsoQU5EKS9pZy50ZXN0KGxvZ2ljKVxyXG5cdFx0XHRcdGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajlv4XpobvlnKjov57nu63mgKfnmoQgQU5EIOWSjCBPUiDooajovr7lvI/liY3lkI7kvb/nlKjmi6zlj7fjgIJcIlxyXG5cdGlmIGVycm9yTXNnXHJcblx0XHRjb25zb2xlLmxvZyBcImVycm9yXCIsIGVycm9yTXNnXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0dG9hc3RyLmVycm9yKGVycm9yTXNnKVxyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHJcbiMgXCI9XCIsIFwiPD5cIiwgXCI+XCIsIFwiPj1cIiwgXCI8XCIsIFwiPD1cIiwgXCJzdGFydHN3aXRoXCIsIFwiY29udGFpbnNcIiwgXCJub3Rjb250YWluc1wiLlxyXG4jIyNcclxub3B0aW9uc+WPguaVsO+8mlxyXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxyXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xyXG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcclxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxyXG4jIyNcclxuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9Nb25nbyA9IChmaWx0ZXJzLCBvcHRpb25zKS0+XHJcblx0dW5sZXNzIGZpbHRlcnM/Lmxlbmd0aFxyXG5cdFx0cmV0dXJuXHJcblx0IyDlvZNmaWx0ZXJz5LiN5pivW0FycmF5Xeexu+Wei+iAjOaYr1tPYmplY3Rd57G75Z6L5pe277yM6L+b6KGM5qC85byP6L2s5o2iXHJcblx0dW5sZXNzIGZpbHRlcnNbMF0gaW5zdGFuY2VvZiBBcnJheVxyXG5cdFx0ZmlsdGVycyA9IF8ubWFwIGZpbHRlcnMsIChvYmopLT5cclxuXHRcdFx0cmV0dXJuIFtvYmouZmllbGQsIG9iai5vcGVyYXRpb24sIG9iai52YWx1ZV1cclxuXHRzZWxlY3RvciA9IFtdXHJcblx0Xy5lYWNoIGZpbHRlcnMsIChmaWx0ZXIpLT5cclxuXHRcdGZpZWxkID0gZmlsdGVyWzBdXHJcblx0XHRvcHRpb24gPSBmaWx0ZXJbMV1cclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSlcclxuXHRcdGVsc2VcclxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIG51bGwsIG9wdGlvbnMpXHJcblx0XHRzdWJfc2VsZWN0b3IgPSB7fVxyXG5cdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXSA9IHt9XHJcblx0XHRpZiBvcHRpb24gPT0gXCI9XCJcclxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRlcVwiXSA9IHZhbHVlXHJcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIjw+XCJcclxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRuZVwiXSA9IHZhbHVlXHJcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIj5cIlxyXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGd0XCJdID0gdmFsdWVcclxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPj1cIlxyXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGd0ZVwiXSA9IHZhbHVlXHJcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIjxcIlxyXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGx0XCJdID0gdmFsdWVcclxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPD1cIlxyXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGx0ZVwiXSA9IHZhbHVlXHJcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcInN0YXJ0c3dpdGhcIlxyXG5cdFx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXlwiICsgdmFsdWUsIFwiaVwiKVxyXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnXHJcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcImNvbnRhaW5zXCJcclxuXHRcdFx0cmVnID0gbmV3IFJlZ0V4cCh2YWx1ZSwgXCJpXCIpXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWdcclxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwibm90Y29udGFpbnNcIlxyXG5cdFx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXigoPyFcIiArIHZhbHVlICsgXCIpLikqJFwiLCBcImlcIilcclxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZ1xyXG5cdFx0c2VsZWN0b3IucHVzaCBzdWJfc2VsZWN0b3JcclxuXHRyZXR1cm4gc2VsZWN0b3JcclxuXHJcbkNyZWF0b3IuaXNCZXR3ZWVuRmlsdGVyT3BlcmF0aW9uID0gKG9wZXJhdGlvbiktPlxyXG5cdHJldHVybiBvcGVyYXRpb24gPT0gXCJiZXR3ZWVuXCIgb3IgISFDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyh0cnVlKT9bb3BlcmF0aW9uXVxyXG5cclxuIyMjXHJcbm9wdGlvbnPlj4LmlbDvvJpcclxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcclxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcclxuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XHJcblx0ZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxyXG4jIyNcclxuQ3JlYXRvci5mb3JtYXRGaWx0ZXJzVG9EZXYgPSAoZmlsdGVycywgb2JqZWN0X25hbWUsIG9wdGlvbnMpLT5cclxuXHRzdGVlZG9zRmlsdGVycyA9IHJlcXVpcmUoXCJAc3RlZWRvcy9maWx0ZXJzXCIpO1xyXG5cdHVubGVzcyBmaWx0ZXJzLmxlbmd0aFxyXG5cdFx0cmV0dXJuXHJcblx0aWYgb3B0aW9ucz8uaXNfbG9naWNfb3JcclxuXHRcdCMg5aaC5p6caXNfbG9naWNfb3LkuLp0cnVl77yM5Li6ZmlsdGVyc+esrOS4gOWxguWFg+e0oOWinuWKoG9y6Ze06ZqUXHJcblx0XHRsb2dpY1RlbXBGaWx0ZXJzID0gW11cclxuXHRcdGZpbHRlcnMuZm9yRWFjaCAobiktPlxyXG5cdFx0XHRsb2dpY1RlbXBGaWx0ZXJzLnB1c2gobilcclxuXHRcdFx0bG9naWNUZW1wRmlsdGVycy5wdXNoKFwib3JcIilcclxuXHRcdGxvZ2ljVGVtcEZpbHRlcnMucG9wKClcclxuXHRcdGZpbHRlcnMgPSBsb2dpY1RlbXBGaWx0ZXJzXHJcblx0c2VsZWN0b3IgPSBzdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9EZXYoZmlsdGVycywgQ3JlYXRvci5VU0VSX0NPTlRFWFQpXHJcblx0cmV0dXJuIHNlbGVjdG9yXHJcblxyXG4jIyNcclxub3B0aW9uc+WPguaVsO+8mlxyXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxyXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xyXG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcclxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxyXG4jIyNcclxuQ3JlYXRvci5mb3JtYXRMb2dpY0ZpbHRlcnNUb0RldiA9IChmaWx0ZXJzLCBmaWx0ZXJfbG9naWMsIG9wdGlvbnMpLT5cclxuXHRmb3JtYXRfbG9naWMgPSBmaWx0ZXJfbG9naWMucmVwbGFjZSgvXFwoXFxzKy9pZywgXCIoXCIpLnJlcGxhY2UoL1xccytcXCkvaWcsIFwiKVwiKS5yZXBsYWNlKC9cXCgvZywgXCJbXCIpLnJlcGxhY2UoL1xcKS9nLCBcIl1cIikucmVwbGFjZSgvXFxzKy9nLCBcIixcIikucmVwbGFjZSgvKGFuZHxvcikvaWcsIFwiJyQxJ1wiKVxyXG5cdGZvcm1hdF9sb2dpYyA9IGZvcm1hdF9sb2dpYy5yZXBsYWNlKC8oXFxkKSsvaWcsICh4KS0+XHJcblx0XHRfZiA9IGZpbHRlcnNbeC0xXVxyXG5cdFx0ZmllbGQgPSBfZi5maWVsZFxyXG5cdFx0b3B0aW9uID0gX2Yub3BlcmF0aW9uXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShfZi52YWx1ZSlcclxuXHRcdGVsc2VcclxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShfZi52YWx1ZSwgbnVsbCwgb3B0aW9ucylcclxuXHRcdHN1Yl9zZWxlY3RvciA9IFtdXHJcblx0XHRpZiBfLmlzQXJyYXkodmFsdWUpID09IHRydWVcclxuXHRcdFx0aWYgb3B0aW9uID09IFwiPVwiXHJcblx0XHRcdFx0Xy5lYWNoIHZhbHVlLCAodiktPlxyXG5cdFx0XHRcdFx0c3ViX3NlbGVjdG9yLnB1c2ggW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCJcclxuXHRcdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8PlwiXHJcblx0XHRcdFx0Xy5lYWNoIHZhbHVlLCAodiktPlxyXG5cdFx0XHRcdFx0c3ViX3NlbGVjdG9yLnB1c2ggW2ZpZWxkLCBvcHRpb24sIHZdLCBcImFuZFwiXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRfLmVhY2ggdmFsdWUsICh2KS0+XHJcblx0XHRcdFx0XHRzdWJfc2VsZWN0b3IucHVzaCBbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIlxyXG5cdFx0XHRpZiBzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09IFwiYW5kXCIgfHwgc3ViX3NlbGVjdG9yW3N1Yl9zZWxlY3Rvci5sZW5ndGggLSAxXSA9PSBcIm9yXCJcclxuXHRcdFx0XHRzdWJfc2VsZWN0b3IucG9wKClcclxuXHRcdGVsc2VcclxuXHRcdFx0c3ViX3NlbGVjdG9yID0gW2ZpZWxkLCBvcHRpb24sIHZhbHVlXVxyXG5cdFx0Y29uc29sZS5sb2cgXCJzdWJfc2VsZWN0b3JcIiwgc3ViX3NlbGVjdG9yXHJcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3ViX3NlbGVjdG9yKVxyXG5cdClcclxuXHRmb3JtYXRfbG9naWMgPSBcIlsje2Zvcm1hdF9sb2dpY31dXCJcclxuXHRyZXR1cm4gQ3JlYXRvci5ldmFsKGZvcm1hdF9sb2dpYylcclxuXHJcbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cdFx0aWYgIXNwYWNlSWRcclxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxyXG5cdFx0aWYgIXVzZXJJZFxyXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHJcblx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBbXVxyXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHJcblx0aWYgIV9vYmplY3RcclxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lc1xyXG5cclxuI1x0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKF9vYmplY3QucmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcclxuXHJcblx0cmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhfb2JqZWN0Ll9jb2xsZWN0aW9uX25hbWUpXHJcblxyXG5cdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxyXG5cdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWVzPy5sZW5ndGggPT0gMFxyXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzXHJcblxyXG5cdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxyXG5cdHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHNcclxuXHJcblx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLmRpZmZlcmVuY2UgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHVucmVsYXRlZF9vYmplY3RzXHJcblx0cmV0dXJuIF8uZmlsdGVyIHJlbGF0ZWRfb2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0KS0+XHJcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3Qub2JqZWN0X25hbWVcclxuXHRcdGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xXHJcblx0XHRhbGxvd1JlYWQgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk/LmFsbG93UmVhZFxyXG5cdFx0cmV0dXJuIGlzQWN0aXZlIGFuZCBhbGxvd1JlYWRcclxuXHJcbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdE5hbWVzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRyZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXHJcblx0cmV0dXJuIF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcclxuXHJcbkNyZWF0b3IuZ2V0QWN0aW9ucyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cclxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHJcblx0aWYgIW9ialxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxyXG5cdGRpc2FibGVkX2FjdGlvbnMgPSBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zXHJcblx0YWN0aW9ucyA9IF8uc29ydEJ5KF8udmFsdWVzKG9iai5hY3Rpb25zKSAsICdzb3J0Jyk7XHJcblxyXG5cdGlmIF8uaGFzKG9iaiwgJ2FsbG93X2FjdGlvbnMnKVxyXG5cdFx0YWN0aW9ucyA9IF8uZmlsdGVyIGFjdGlvbnMsIChhY3Rpb24pLT5cclxuXHRcdFx0cmV0dXJuIF8uaW5jbHVkZShvYmouYWxsb3dfYWN0aW9ucywgYWN0aW9uLm5hbWUpXHJcblxyXG5cdF8uZWFjaCBhY3Rpb25zLCAoYWN0aW9uKS0+XHJcblx0XHQjIOaJi+acuuS4iuWPquaYvuekuue8lui+keaMiemSru+8jOWFtuS7lueahOaUvuWIsOaKmOWPoOS4i+aLieiPnOWNleS4rVxyXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcInJlY29yZFwiLCBcInJlY29yZF9vbmx5XCJdLmluZGV4T2YoYWN0aW9uLm9uKSA+IC0xICYmIGFjdGlvbi5uYW1lICE9ICdzdGFuZGFyZF9lZGl0J1xyXG5cdFx0XHRpZiBhY3Rpb24ub24gPT0gXCJyZWNvcmRfb25seVwiXHJcblx0XHRcdFx0YWN0aW9uLm9uID0gJ3JlY29yZF9vbmx5X21vcmUnXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRhY3Rpb24ub24gPSAncmVjb3JkX21vcmUnXHJcblxyXG5cdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJjbXNfZmlsZXNcIiwgXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXS5pbmRleE9mKG9iamVjdF9uYW1lKSA+IC0xXHJcblx0XHQjIOmZhOS7tueJueauiuWkhOeQhu+8jOS4i+i9veaMiemSruaUvuWcqOS4u+iPnOWNle+8jOe8lui+keaMiemSruaUvuWIsOW6leS4i+aKmOWPoOS4i+aLieiPnOWNleS4rVxyXG5cdFx0YWN0aW9ucy5maW5kKChuKS0+IHJldHVybiBuLm5hbWUgPT0gXCJzdGFuZGFyZF9lZGl0XCIpPy5vbiA9IFwicmVjb3JkX21vcmVcIlxyXG5cdFx0YWN0aW9ucy5maW5kKChuKS0+IHJldHVybiBuLm5hbWUgPT0gXCJkb3dubG9hZFwiKT8ub24gPSBcInJlY29yZFwiXHJcblxyXG5cdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XHJcblx0XHRyZXR1cm4gXy5pbmRleE9mKGRpc2FibGVkX2FjdGlvbnMsIGFjdGlvbi5uYW1lKSA8IDBcclxuXHJcblx0cmV0dXJuIGFjdGlvbnNcclxuXHJcbi8vL1xyXG5cdOi/lOWbnuW9k+WJjeeUqOaIt+acieadg+mZkOiuv+mXrueahOaJgOaciWxpc3Rfdmlld++8jOWMheaLrOWIhuS6q+eahO+8jOeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahO+8iOmZpOmdnm93bmVy5Y+Y5LqG77yJ77yM5Lul5Y+K6buY6K6k55qE5YW25LuW6KeG5Zu+XHJcblx05rOo5oSPQ3JlYXRvci5nZXRQZXJtaXNzaW9uc+WHveaVsOS4reaYr+S4jeS8muacieeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahOinhuWbvueahO+8jOaJgOS7pUNyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mi7/liLDnmoTnu5PmnpzkuI3lhajvvIzlubbkuI3mmK/lvZPliY3nlKjmiLfog73nnIvliLDmiYDmnInop4blm75cclxuLy8vXHJcbkNyZWF0b3IuZ2V0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHJcblx0dW5sZXNzIG9iamVjdF9uYW1lXHJcblx0XHRyZXR1cm5cclxuXHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblxyXG5cdGlmICFvYmplY3RcclxuXHRcdHJldHVyblxyXG5cclxuXHRkaXNhYmxlZF9saXN0X3ZpZXdzID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8uZGlzYWJsZWRfbGlzdF92aWV3cyB8fCBbXVxyXG5cclxuXHRsaXN0X3ZpZXdzID0gW11cclxuXHJcblx0aXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHJcblx0Xy5lYWNoIG9iamVjdC5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0XHRpZiBpc01vYmlsZSBhbmQgaXRlbS50eXBlID09IFwiY2FsZW5kYXJcIlxyXG5cdFx0XHQjIOaJi+acuuS4iuWFiOS4jeaYvuekuuaXpeWOhuinhuWbvlxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdGlmIGl0ZW1fbmFtZSAhPSBcImRlZmF1bHRcIlxyXG5cdFx0XHRpZiBfLmluZGV4T2YoZGlzYWJsZWRfbGlzdF92aWV3cywgaXRlbV9uYW1lKSA8IDAgfHwgaXRlbS5vd25lciA9PSB1c2VySWRcclxuXHRcdFx0XHRsaXN0X3ZpZXdzLnB1c2ggaXRlbVxyXG5cclxuXHRyZXR1cm4gbGlzdF92aWV3c1xyXG5cclxuIyDliY3lj7DnkIborrrkuIrkuI3lupTor6XosIPnlKjor6Xlh73mlbDvvIzlm6DkuLrlrZfmrrXnmoTmnYPpmZDpg73lnKhDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZmllbGRz55qE55u45YWz5bGe5oCn5Lit5pyJ5qCH6K+G5LqGXHJcbkNyZWF0b3IuZ2V0RmllbGRzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblxyXG5cdGZpZWxkc05hbWUgPSBDcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUob2JqZWN0X25hbWUpXHJcblx0dW5yZWFkYWJsZV9maWVsZHMgPSAgQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8udW5yZWFkYWJsZV9maWVsZHNcclxuXHRyZXR1cm4gXy5kaWZmZXJlbmNlKGZpZWxkc05hbWUsIHVucmVhZGFibGVfZmllbGRzKVxyXG5cclxuQ3JlYXRvci5pc2xvYWRpbmcgPSAoKS0+XHJcblx0cmV0dXJuICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZC5nZXQoKVxyXG5cclxuQ3JlYXRvci5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IChzdHIpLT5cclxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpXHJcblxyXG4jIOiuoeeul2ZpZWxkc+ebuOWFs+WHveaVsFxyXG4jIFNUQVJUXHJcbkNyZWF0b3IuZ2V0RGlzYWJsZWRGaWVsZHMgPSAoc2NoZW1hKS0+XHJcblx0ZmllbGRzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQsIGZpZWxkTmFtZSkgLT5cclxuXHRcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0uZGlzYWJsZWQgYW5kICFmaWVsZC5hdXRvZm9ybS5vbWl0IGFuZCBmaWVsZE5hbWVcclxuXHQpXHJcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcclxuXHRyZXR1cm4gZmllbGRzXHJcblxyXG5DcmVhdG9yLmdldEhpZGRlbkZpZWxkcyA9IChzY2hlbWEpLT5cclxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxyXG5cdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS50eXBlID09IFwiaGlkZGVuXCIgYW5kICFmaWVsZC5hdXRvZm9ybS5vbWl0IGFuZCBmaWVsZE5hbWVcclxuXHQpXHJcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcclxuXHRyZXR1cm4gZmllbGRzXHJcblxyXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhOb0dyb3VwID0gKHNjaGVtYSktPlxyXG5cdGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkLCBmaWVsZE5hbWUpIC0+XHJcblx0XHRyZXR1cm4gKCFmaWVsZC5hdXRvZm9ybSBvciAhZmllbGQuYXV0b2Zvcm0uZ3JvdXAgb3IgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT0gXCItXCIpIGFuZCAoIWZpZWxkLmF1dG9mb3JtIG9yIGZpZWxkLmF1dG9mb3JtLnR5cGUgIT0gXCJoaWRkZW5cIikgYW5kIGZpZWxkTmFtZVxyXG5cdClcclxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxyXG5cdHJldHVybiBmaWVsZHNcclxuXHJcbkNyZWF0b3IuZ2V0U29ydGVkRmllbGRHcm91cE5hbWVzID0gKHNjaGVtYSktPlxyXG5cdG5hbWVzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQpIC0+XHJcbiBcdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS5ncm91cCAhPSBcIi1cIiBhbmQgZmllbGQuYXV0b2Zvcm0uZ3JvdXBcclxuXHQpXHJcblx0bmFtZXMgPSBfLmNvbXBhY3QobmFtZXMpXHJcblx0bmFtZXMgPSBfLnVuaXF1ZShuYW1lcylcclxuXHRyZXR1cm4gbmFtZXNcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRzRm9yR3JvdXAgPSAoc2NoZW1hLCBncm91cE5hbWUpIC0+XHJcbiAgXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxyXG4gICAgXHRyZXR1cm4gZmllbGQuYXV0b2Zvcm0gYW5kIGZpZWxkLmF1dG9mb3JtLmdyb3VwID09IGdyb3VwTmFtZSBhbmQgZmllbGQuYXV0b2Zvcm0udHlwZSAhPSBcImhpZGRlblwiIGFuZCBmaWVsZE5hbWVcclxuICBcdClcclxuICBcdGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpXHJcbiAgXHRyZXR1cm4gZmllbGRzXHJcblxyXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRPbWl0ID0gKHNjaGVtYSwga2V5cykgLT5cclxuXHRrZXlzID0gXy5tYXAoa2V5cywgKGtleSkgLT5cclxuXHRcdGZpZWxkID0gXy5waWNrKHNjaGVtYSwga2V5KVxyXG5cdFx0aWYgZmllbGRba2V5XS5hdXRvZm9ybT8ub21pdFxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIGtleVxyXG5cdClcclxuXHRrZXlzID0gXy5jb21wYWN0KGtleXMpXHJcblx0cmV0dXJuIGtleXNcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRzSW5GaXJzdExldmVsID0gKGZpcnN0TGV2ZWxLZXlzLCBrZXlzKSAtPlxyXG5cdGtleXMgPSBfLm1hcChrZXlzLCAoa2V5KSAtPlxyXG5cdFx0aWYgXy5pbmRleE9mKGZpcnN0TGV2ZWxLZXlzLCBrZXkpID4gLTFcclxuXHRcdFx0cmV0dXJuIGtleVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHQpXHJcblx0a2V5cyA9IF8uY29tcGFjdChrZXlzKVxyXG5cdHJldHVybiBrZXlzXHJcblxyXG5DcmVhdG9yLmdldEZpZWxkc0ZvclJlb3JkZXIgPSAoc2NoZW1hLCBrZXlzLCBpc1NpbmdsZSkgLT5cclxuXHRmaWVsZHMgPSBbXVxyXG5cdGkgPSAwXHJcblx0X2tleXMgPSBfLmZpbHRlcihrZXlzLCAoa2V5KS0+XHJcblx0XHRyZXR1cm4gIWtleS5lbmRzV2l0aCgnX2VuZExpbmUnKVxyXG5cdCk7XHJcblx0d2hpbGUgaSA8IF9rZXlzLmxlbmd0aFxyXG5cdFx0c2NfMSA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2ldKVxyXG5cdFx0c2NfMiA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2krMV0pXHJcblxyXG5cdFx0aXNfd2lkZV8xID0gZmFsc2VcclxuXHRcdGlzX3dpZGVfMiA9IGZhbHNlXHJcblxyXG4jXHRcdGlzX3JhbmdlXzEgPSBmYWxzZVxyXG4jXHRcdGlzX3JhbmdlXzIgPSBmYWxzZVxyXG5cclxuXHRcdF8uZWFjaCBzY18xLCAodmFsdWUpIC0+XHJcblx0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc193aWRlIHx8IHZhbHVlLmF1dG9mb3JtPy50eXBlID09IFwidGFibGVcIlxyXG5cdFx0XHRcdGlzX3dpZGVfMSA9IHRydWVcclxuXHJcbiNcdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfcmFuZ2VcclxuI1x0XHRcdFx0aXNfcmFuZ2VfMSA9IHRydWVcclxuXHJcblx0XHRfLmVhY2ggc2NfMiwgKHZhbHVlKSAtPlxyXG5cdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfd2lkZSB8fCB2YWx1ZS5hdXRvZm9ybT8udHlwZSA9PSBcInRhYmxlXCJcclxuXHRcdFx0XHRpc193aWRlXzIgPSB0cnVlXHJcblxyXG4jXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3JhbmdlXHJcbiNcdFx0XHRcdGlzX3JhbmdlXzIgPSB0cnVlXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdGlzX3dpZGVfMSA9IHRydWVcclxuXHRcdFx0aXNfd2lkZV8yID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGlzU2luZ2xlXHJcblx0XHRcdGZpZWxkcy5wdXNoIF9rZXlzLnNsaWNlKGksIGkrMSlcclxuXHRcdFx0aSArPSAxXHJcblx0XHRlbHNlXHJcbiNcdFx0XHRpZiAhaXNfcmFuZ2VfMSAmJiBpc19yYW5nZV8yXHJcbiNcdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcclxuI1x0XHRcdFx0Y2hpbGRLZXlzLnB1c2ggdW5kZWZpbmVkXHJcbiNcdFx0XHRcdGZpZWxkcy5wdXNoIGNoaWxkS2V5c1xyXG4jXHRcdFx0XHRpICs9IDFcclxuI1x0XHRcdGVsc2VcclxuXHRcdFx0aWYgaXNfd2lkZV8xXHJcblx0XHRcdFx0ZmllbGRzLnB1c2ggX2tleXMuc2xpY2UoaSwgaSsxKVxyXG5cdFx0XHRcdGkgKz0gMVxyXG5cdFx0XHRlbHNlIGlmICFpc193aWRlXzEgYW5kIGlzX3dpZGVfMlxyXG5cdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcclxuXHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcclxuXHRcdFx0XHRmaWVsZHMucHVzaCBjaGlsZEtleXNcclxuXHRcdFx0XHRpICs9IDFcclxuXHRcdFx0ZWxzZSBpZiAhaXNfd2lkZV8xIGFuZCAhaXNfd2lkZV8yXHJcblx0XHRcdFx0Y2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSsxKVxyXG5cdFx0XHRcdGlmIF9rZXlzW2krMV1cclxuXHRcdFx0XHRcdGNoaWxkS2V5cy5wdXNoIF9rZXlzW2krMV1cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcclxuXHRcdFx0XHRmaWVsZHMucHVzaCBjaGlsZEtleXNcclxuXHRcdFx0XHRpICs9IDJcclxuXHJcblx0cmV0dXJuIGZpZWxkc1xyXG5cclxuQ3JlYXRvci5pc0ZpbHRlclZhbHVlRW1wdHkgPSAodikgLT5cclxuXHRyZXR1cm4gdHlwZW9mIHYgPT0gXCJ1bmRlZmluZWRcIiB8fCB2ID09IG51bGwgfHwgTnVtYmVyLmlzTmFOKHYpIHx8IHYubGVuZ3RoID09IDBcclxuXHJcbiMgRU5EXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRDcmVhdG9yLmdldEFsbFJlbGF0ZWRPYmplY3RzID0gKG9iamVjdF9uYW1lKS0+XHJcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdXHJcblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cclxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSktPlxyXG5cdFx0XHRcdGlmIHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lXHJcblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoIHJlbGF0ZWRfb2JqZWN0X25hbWVcclxuXHJcblx0XHRpZiBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZW5hYmxlX2ZpbGVzXHJcblx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzLnB1c2ggXCJjbXNfZmlsZXNcIlxyXG5cclxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcyIsIkNyZWF0b3IuZ2V0U2NoZW1hID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuc2NoZW1hIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIHtcbiAgdmFyIGxpc3RfdmlldywgbGlzdF92aWV3X2lkO1xuICBpZiAoIWFwcF9pZCkge1xuICAgIGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICB9XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgbGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbCk7XG4gIGxpc3Rfdmlld19pZCA9IGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Ll9pZCA6IHZvaWQgMDtcbiAgaWYgKHJlY29yZF9pZCkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkX2lkKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwibWVldGluZ1wiKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCk7XG4gICAgfVxuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEFic29sdXRlVXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSB7XG4gIHZhciBsaXN0X3ZpZXcsIGxpc3Rfdmlld19pZDtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpO1xuICBsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5faWQgOiB2b2lkIDA7XG4gIGlmIChyZWNvcmRfaWQpIHtcbiAgICByZXR1cm4gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZCwgdHJ1ZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBcIm1lZXRpbmdcIikge1xuICAgICAgcmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQsIHRydWUpO1xuICAgIH1cbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSb3V0ZXJVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIHtcbiAgdmFyIGxpc3RfdmlldywgbGlzdF92aWV3X2lkO1xuICBpZiAoIWFwcF9pZCkge1xuICAgIGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICB9XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgbGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbCk7XG4gIGxpc3Rfdmlld19pZCA9IGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Ll9pZCA6IHZvaWQgMDtcbiAgaWYgKHJlY29yZF9pZCkge1xuICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZDtcbiAgfSBlbHNlIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwibWVldGluZ1wiKSB7XG4gICAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQ7XG4gICAgfVxuICB9XG59O1xuXG5DcmVhdG9yLmdldExpc3RWaWV3VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSB7XG4gIHZhciB1cmw7XG4gIHVybCA9IENyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpO1xuICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCh1cmwpO1xufTtcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSB7XG4gIGlmIChsaXN0X3ZpZXdfaWQgPT09IFwiY2FsZW5kYXJcIikge1xuICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFN3aXRjaExpc3RVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIHtcbiAgaWYgKGxpc3Rfdmlld19pZCkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIGxpc3Rfdmlld19pZCArIFwiL2xpc3RcIik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2xpc3Qvc3dpdGNoXCIpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYXBwX2lkLCByZWNvcmRfaWQsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgcmVjb3JkX2lkICsgXCIvXCIgKyByZWxhdGVkX29iamVjdF9uYW1lICsgXCIvZ3JpZFwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0TG9va3VwRmllbGRPcHRpb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGlzX2RlZXAsIGlzX3NraXBfaGlkZSwgaXNfcmVsYXRlZCkge1xuICB2YXIgX29iamVjdCwgX29wdGlvbnMsIGZpZWxkcywgaWNvbiwgcmVsYXRlZE9iamVjdHM7XG4gIF9vcHRpb25zID0gW107XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gX29wdGlvbnM7XG4gIH1cbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIGljb24gPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDA7XG4gIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICBpZiAoaXNfc2tpcF9oaWRlICYmIGYuaGlkZGVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChmLnR5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgbGFiZWw6IFwiXCIgKyAoZi5sYWJlbCB8fCBrKSxcbiAgICAgICAgdmFsdWU6IFwiXCIgKyBrLFxuICAgICAgICBpY29uOiBpY29uXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICBsYWJlbDogZi5sYWJlbCB8fCBrLFxuICAgICAgICB2YWx1ZTogayxcbiAgICAgICAgaWNvbjogaWNvblxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgaWYgKGlzX2RlZXApIHtcbiAgICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgICB2YXIgcl9vYmplY3Q7XG4gICAgICBpZiAoaXNfc2tpcF9oaWRlICYmIGYuaGlkZGVuKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICgoZi50eXBlID09PSBcImxvb2t1cFwiIHx8IGYudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpICYmIGYucmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcoZi5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIHJfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoZi5yZWZlcmVuY2VfdG8pO1xuICAgICAgICBpZiAocl9vYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZjIsIGsyKSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiAoZi5sYWJlbCB8fCBrKSArIFwiPT5cIiArIChmMi5sYWJlbCB8fCBrMiksXG4gICAgICAgICAgICAgIHZhbHVlOiBrICsgXCIuXCIgKyBrMixcbiAgICAgICAgICAgICAgaWNvbjogcl9vYmplY3QgIT0gbnVsbCA/IHJfb2JqZWN0Lmljb24gOiB2b2lkIDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaWYgKGlzX3JlbGF0ZWQpIHtcbiAgICByZWxhdGVkT2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpO1xuICAgIF8uZWFjaChyZWxhdGVkT2JqZWN0cywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oX3JlbGF0ZWRPYmplY3QpIHtcbiAgICAgICAgdmFyIHJlbGF0ZWRPYmplY3QsIHJlbGF0ZWRPcHRpb25zO1xuICAgICAgICByZWxhdGVkT3B0aW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0TG9va3VwRmllbGRPcHRpb25zKF9yZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcmVsYXRlZE9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9yZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lKTtcbiAgICAgICAgcmV0dXJuIF8uZWFjaChyZWxhdGVkT3B0aW9ucywgZnVuY3Rpb24ocmVsYXRlZE9wdGlvbikge1xuICAgICAgICAgIGlmIChfcmVsYXRlZE9iamVjdC5mb3JlaWduX2tleSAhPT0gcmVsYXRlZE9wdGlvbi52YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgICBsYWJlbDogKHJlbGF0ZWRPYmplY3QubGFiZWwgfHwgcmVsYXRlZE9iamVjdC5uYW1lKSArIFwiPT5cIiArIHJlbGF0ZWRPcHRpb24ubGFiZWwsXG4gICAgICAgICAgICAgIHZhbHVlOiByZWxhdGVkT2JqZWN0Lm5hbWUgKyBcIi5cIiArIHJlbGF0ZWRPcHRpb24udmFsdWUsXG4gICAgICAgICAgICAgIGljb246IHJlbGF0ZWRPYmplY3QgIT0gbnVsbCA/IHJlbGF0ZWRPYmplY3QuaWNvbiA6IHZvaWQgMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9XG4gIHJldHVybiBfb3B0aW9ucztcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmlsdGVyRmllbGRPcHRpb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIF9vYmplY3QsIF9vcHRpb25zLCBmaWVsZHMsIGljb24sIHBlcm1pc3Npb25fZmllbGRzO1xuICBfb3B0aW9ucyA9IFtdO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIF9vcHRpb25zO1xuICB9XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZmllbGRzIDogdm9pZCAwO1xuICBwZXJtaXNzaW9uX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKG9iamVjdF9uYW1lKTtcbiAgaWNvbiA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMDtcbiAgXy5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZiwgaykge1xuICAgIGlmICghXy5pbmNsdWRlKFtcImdyaWRcIiwgXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwiYXZhdGFyXCIsIFwiaW1hZ2VcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSkgJiYgIWYuaGlkZGVuKSB7XG4gICAgICBpZiAoIS9cXHcrXFwuLy50ZXN0KGspICYmIF8uaW5kZXhPZihwZXJtaXNzaW9uX2ZpZWxkcywgaykgPiAtMSkge1xuICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgbGFiZWw6IGYubGFiZWwgfHwgayxcbiAgICAgICAgICB2YWx1ZTogayxcbiAgICAgICAgICBpY29uOiBpY29uXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBfb3B0aW9ucztcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRPcHRpb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIF9vYmplY3QsIF9vcHRpb25zLCBmaWVsZHMsIGljb24sIHBlcm1pc3Npb25fZmllbGRzO1xuICBfb3B0aW9ucyA9IFtdO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIF9vcHRpb25zO1xuICB9XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZmllbGRzIDogdm9pZCAwO1xuICBwZXJtaXNzaW9uX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKG9iamVjdF9uYW1lKTtcbiAgaWNvbiA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMDtcbiAgXy5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZiwgaykge1xuICAgIGlmICghXy5pbmNsdWRlKFtcImdyaWRcIiwgXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwiYXZhdGFyXCIsIFwiaW1hZ2VcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSkpIHtcbiAgICAgIGlmICghL1xcdytcXC4vLnRlc3QoaykgJiYgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICBsYWJlbDogZi5sYWJlbCB8fCBrLFxuICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgIGljb246IGljb25cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIF9vcHRpb25zO1xufTtcblxuXG4vKlxuZmlsdGVyczog6KaB6L2s5o2i55qEZmlsdGVyc1xuZmllbGRzOiDlr7nosaHlrZfmrrVcbmZpbHRlcl9maWVsZHM6IOm7mOiupOi/h+a7pOWtl+aute+8jOaUr+aMgeWtl+espuS4suaVsOe7hOWSjOWvueixoeaVsOe7hOS4pOenjeagvOW8j++8jOWmgjpbJ2ZpbGVkX25hbWUxJywnZmlsZWRfbmFtZTInXSxbe2ZpZWxkOidmaWxlZF9uYW1lMScscmVxdWlyZWQ6dHJ1ZX1dXG7lpITnkIbpgLvovpE6IOaKimZpbHRlcnPkuK3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25aKe5Yqg5q+P6aG555qEaXNfZGVmYXVsdOOAgWlzX3JlcXVpcmVk5bGe5oCn77yM5LiN5a2Y5Zyo5LqOZmlsdGVyX2ZpZWxkc+eahOi/h+a7pOadoeS7tuWvueW6lOeahOenu+mZpOavj+mhueeahOebuOWFs+WxnuaAp1xu6L+U5Zue57uT5p6cOiDlpITnkIblkI7nmoRmaWx0ZXJzXG4gKi9cblxuQ3JlYXRvci5nZXRGaWx0ZXJzV2l0aEZpbHRlckZpZWxkcyA9IGZ1bmN0aW9uKGZpbHRlcnMsIGZpZWxkcywgZmlsdGVyX2ZpZWxkcykge1xuICBpZiAoIWZpbHRlcnMpIHtcbiAgICBmaWx0ZXJzID0gW107XG4gIH1cbiAgaWYgKCFmaWx0ZXJfZmllbGRzKSB7XG4gICAgZmlsdGVyX2ZpZWxkcyA9IFtdO1xuICB9XG4gIGlmIChmaWx0ZXJfZmllbGRzICE9IG51bGwgPyBmaWx0ZXJfZmllbGRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgIGZpbHRlcl9maWVsZHMuZm9yRWFjaChmdW5jdGlvbihuKSB7XG4gICAgICBpZiAoXy5pc1N0cmluZyhuKSkge1xuICAgICAgICBuID0ge1xuICAgICAgICAgIGZpZWxkOiBuLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKGZpZWxkc1tuLmZpZWxkXSAmJiAhXy5maW5kV2hlcmUoZmlsdGVycywge1xuICAgICAgICBmaWVsZDogbi5maWVsZFxuICAgICAgfSkpIHtcbiAgICAgICAgcmV0dXJuIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgZmllbGQ6IG4uZmllbGQsXG4gICAgICAgICAgaXNfZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICBpc19yZXF1aXJlZDogbi5yZXF1aXJlZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBmaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24oZmlsdGVySXRlbSkge1xuICAgIHZhciBtYXRjaEZpZWxkO1xuICAgIG1hdGNoRmllbGQgPSBmaWx0ZXJfZmllbGRzLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4gPT09IGZpbHRlckl0ZW0uZmllbGQgfHwgbi5maWVsZCA9PT0gZmlsdGVySXRlbS5maWVsZDtcbiAgICB9KTtcbiAgICBpZiAoXy5pc1N0cmluZyhtYXRjaEZpZWxkKSkge1xuICAgICAgbWF0Y2hGaWVsZCA9IHtcbiAgICAgICAgZmllbGQ6IG1hdGNoRmllbGQsXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKG1hdGNoRmllbGQpIHtcbiAgICAgIGZpbHRlckl0ZW0uaXNfZGVmYXVsdCA9IHRydWU7XG4gICAgICByZXR1cm4gZmlsdGVySXRlbS5pc19yZXF1aXJlZCA9IG1hdGNoRmllbGQucmVxdWlyZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBmaWx0ZXJJdGVtLmlzX2RlZmF1bHQ7XG4gICAgICByZXR1cm4gZGVsZXRlIGZpbHRlckl0ZW0uaXNfcmVxdWlyZWQ7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZpbHRlcnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJlY29yZCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZCkge1xuICB2YXIgY29sbGVjdGlvbiwgcmVjb3JkLCByZWYsIHJlZjEsIHJlZjI7XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKCFyZWNvcmRfaWQpIHtcbiAgICByZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpICYmIHJlY29yZF9pZCA9PT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikpIHtcbiAgICAgIGlmICgocmVmID0gVGVtcGxhdGUuaW5zdGFuY2UoKSkgIT0gbnVsbCA/IHJlZi5yZWNvcmQgOiB2b2lkIDApIHtcbiAgICAgICAgcmV0dXJuIChyZWYxID0gVGVtcGxhdGUuaW5zdGFuY2UoKSkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5yZWNvcmQpICE9IG51bGwgPyByZWYyLmdldCgpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKTtcbiAgICB9XG4gIH1cbiAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSk7XG4gIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgcmVjb3JkID0gY29sbGVjdGlvbi5maW5kT25lKHJlY29yZF9pZCk7XG4gICAgcmV0dXJuIHJlY29yZDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSZWNvcmROYW1lID0gZnVuY3Rpb24ocmVjb3JkLCBvYmplY3RfbmFtZSkge1xuICB2YXIgbmFtZV9maWVsZF9rZXksIHJlZjtcbiAgaWYgKCFyZWNvcmQpIHtcbiAgICByZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpO1xuICB9XG4gIGlmIChyZWNvcmQpIHtcbiAgICBuYW1lX2ZpZWxkX2tleSA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuTkFNRV9GSUVMRF9LRVkgOiB2b2lkIDA7XG4gICAgaWYgKHJlY29yZCAmJiBuYW1lX2ZpZWxkX2tleSkge1xuICAgICAgcmV0dXJuIHJlY29yZC5sYWJlbCB8fCByZWNvcmRbbmFtZV9maWVsZF9rZXldO1xuICAgIH1cbiAgfVxufTtcblxuQ3JlYXRvci5nZXRBcHAgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgdmFyIGFwcCwgcmVmLCByZWYxO1xuICBpZiAoIWFwcF9pZCkge1xuICAgIGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICB9XG4gIGFwcCA9IENyZWF0b3IuQXBwc1thcHBfaWRdO1xuICBpZiAoKHJlZiA9IENyZWF0b3IuZGVwcykgIT0gbnVsbCkge1xuICAgIGlmICgocmVmMSA9IHJlZi5hcHApICE9IG51bGwpIHtcbiAgICAgIHJlZjEuZGVwZW5kKCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcHA7XG59O1xuXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwLCBkYXNoYm9hcmQ7XG4gIGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZCk7XG4gIGlmICghYXBwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGRhc2hib2FyZCA9IG51bGw7XG4gIF8uZWFjaChDcmVhdG9yLkRhc2hib2FyZHMsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICB2YXIgcmVmO1xuICAgIGlmICgoKHJlZiA9IHYuYXBwcykgIT0gbnVsbCA/IHJlZi5pbmRleE9mKGFwcC5faWQpIDogdm9pZCAwKSA+IC0xKSB7XG4gICAgICByZXR1cm4gZGFzaGJvYXJkID0gdjtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZGFzaGJvYXJkO1xufTtcblxuQ3JlYXRvci5nZXRBcHBEYXNoYm9hcmRDb21wb25lbnQgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgdmFyIGFwcDtcbiAgYXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKTtcbiAgaWYgKCFhcHApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmV0dXJuIFJlYWN0U3RlZWRvcy5wbHVnaW5Db21wb25lbnRTZWxlY3RvcihSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKSwgXCJEYXNoYm9hcmRcIiwgYXBwLl9pZCk7XG59O1xuXG5DcmVhdG9yLmdldEFwcE9iamVjdE5hbWVzID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIGFwcE9iamVjdHMsIGlzTW9iaWxlLCBvYmplY3RzO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBpZiAoIWFwcCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKTtcbiAgYXBwT2JqZWN0cyA9IGlzTW9iaWxlID8gYXBwLm1vYmlsZV9vYmplY3RzIDogYXBwLm9iamVjdHM7XG4gIG9iamVjdHMgPSBbXTtcbiAgaWYgKGFwcCkge1xuICAgIF8uZWFjaChhcHBPYmplY3RzLCBmdW5jdGlvbih2KSB7XG4gICAgICB2YXIgb2JqO1xuICAgICAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qodik7XG4gICAgICBpZiAob2JqICE9IG51bGwgPyBvYmoucGVybWlzc2lvbnMuZ2V0KCkuYWxsb3dSZWFkIDogdm9pZCAwKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RzLnB1c2godik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdHM7XG59O1xuXG5DcmVhdG9yLmdldFZpc2libGVBcHBzID0gZnVuY3Rpb24oaW5jbHVkZUFkbWluKSB7XG4gIHZhciBjaGFuZ2VBcHA7XG4gIGNoYW5nZUFwcCA9IENyZWF0b3IuX3N1YkFwcC5nZXQoKTtcbiAgUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCkuZW50aXRpZXMuYXBwcyA9IE9iamVjdC5hc3NpZ24oe30sIFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLmVudGl0aWVzLmFwcHMsIHtcbiAgICBhcHBzOiBjaGFuZ2VBcHBcbiAgfSk7XG4gIHJldHVybiBSZWFjdFN0ZWVkb3MudmlzaWJsZUFwcHNTZWxlY3RvcihSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKSwgaW5jbHVkZUFkbWluKTtcbn07XG5cbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHNPYmplY3RzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBhcHBzLCBvYmplY3RzLCB2aXNpYmxlT2JqZWN0TmFtZXM7XG4gIGFwcHMgPSBDcmVhdG9yLmdldFZpc2libGVBcHBzKCk7XG4gIHZpc2libGVPYmplY3ROYW1lcyA9IF8uZmxhdHRlbihfLnBsdWNrKGFwcHMsICdvYmplY3RzJykpO1xuICBvYmplY3RzID0gXy5maWx0ZXIoQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAodmlzaWJsZU9iamVjdE5hbWVzLmluZGV4T2Yob2JqLm5hbWUpIDwgMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICBvYmplY3RzID0gb2JqZWN0cy5zb3J0KENyZWF0b3Iuc29ydGluZ01ldGhvZC5iaW5kKHtcbiAgICBrZXk6IFwibGFiZWxcIlxuICB9KSk7XG4gIG9iamVjdHMgPSBfLnBsdWNrKG9iamVjdHMsICduYW1lJyk7XG4gIHJldHVybiBfLnVuaXEob2JqZWN0cyk7XG59O1xuXG5DcmVhdG9yLmdldEFwcHNPYmplY3RzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBvYmplY3RzLCB0ZW1wT2JqZWN0cztcbiAgb2JqZWN0cyA9IFtdO1xuICB0ZW1wT2JqZWN0cyA9IFtdO1xuICBfLmZvckVhY2goQ3JlYXRvci5BcHBzLCBmdW5jdGlvbihhcHApIHtcbiAgICB0ZW1wT2JqZWN0cyA9IF8uZmlsdGVyKGFwcC5vYmplY3RzLCBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiAhb2JqLmhpZGRlbjtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqZWN0cyA9IG9iamVjdHMuY29uY2F0KHRlbXBPYmplY3RzKTtcbiAgfSk7XG4gIHJldHVybiBfLnVuaXEob2JqZWN0cyk7XG59O1xuXG5DcmVhdG9yLnZhbGlkYXRlRmlsdGVycyA9IGZ1bmN0aW9uKGZpbHRlcnMsIGxvZ2ljKSB7XG4gIHZhciBlLCBlcnJvck1zZywgZmlsdGVyX2l0ZW1zLCBmaWx0ZXJfbGVuZ3RoLCBmbGFnLCBpbmRleCwgd29yZDtcbiAgZmlsdGVyX2l0ZW1zID0gXy5tYXAoZmlsdGVycywgZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKF8uaXNFbXB0eShvYmopKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICB9KTtcbiAgZmlsdGVyX2l0ZW1zID0gXy5jb21wYWN0KGZpbHRlcl9pdGVtcyk7XG4gIGVycm9yTXNnID0gXCJcIjtcbiAgZmlsdGVyX2xlbmd0aCA9IGZpbHRlcl9pdGVtcy5sZW5ndGg7XG4gIGlmIChsb2dpYykge1xuICAgIGxvZ2ljID0gbG9naWMucmVwbGFjZSgvXFxuL2csIFwiXCIpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpO1xuICAgIGlmICgvWy5fXFwtIStdKy9pZy50ZXN0KGxvZ2ljKSkge1xuICAgICAgZXJyb3JNc2cgPSBcIuWQq+acieeJueauiuWtl+espuOAglwiO1xuICAgIH1cbiAgICBpZiAoIWVycm9yTXNnKSB7XG4gICAgICBpbmRleCA9IGxvZ2ljLm1hdGNoKC9cXGQrL2lnKTtcbiAgICAgIGlmICghaW5kZXgpIHtcbiAgICAgICAgZXJyb3JNc2cgPSBcIuacieS6m+etm+mAieadoeS7tui/m+ihjOS6huWumuS5ie+8jOS9huacquWcqOmrmOe6p+etm+mAieadoeS7tuS4reiiq+W8leeUqOOAglwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5kZXguZm9yRWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgaWYgKGkgPCAxIHx8IGkgPiBmaWx0ZXJfbGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieadoeS7tuW8leeUqOS6huacquWumuS5ieeahOetm+mAieWZqO+8mlwiICsgaSArIFwi44CCXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmxhZyA9IDE7XG4gICAgICAgIHdoaWxlIChmbGFnIDw9IGZpbHRlcl9sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoIWluZGV4LmluY2x1ZGVzKFwiXCIgKyBmbGFnKSkge1xuICAgICAgICAgICAgZXJyb3JNc2cgPSBcIuacieS6m+etm+mAieadoeS7tui/m+ihjOS6huWumuS5ie+8jOS9huacquWcqOmrmOe6p+etm+mAieadoeS7tuS4reiiq+W8leeUqOOAglwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmbGFnKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFlcnJvck1zZykge1xuICAgICAgd29yZCA9IGxvZ2ljLm1hdGNoKC9bYS16QS1aXSsvaWcpO1xuICAgICAgaWYgKHdvcmQpIHtcbiAgICAgICAgd29yZC5mb3JFYWNoKGZ1bmN0aW9uKHcpIHtcbiAgICAgICAgICBpZiAoIS9eKGFuZHxvcikkL2lnLnRlc3QodykpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvck1zZyA9IFwi5qOA5p+l5oKo55qE6auY57qn562b6YCJ5p2h5Lu25Lit55qE5ou85YaZ44CCXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFlcnJvck1zZykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgQ3JlYXRvcltcImV2YWxcIl0obG9naWMucmVwbGFjZSgvYW5kL2lnLCBcIiYmXCIpLnJlcGxhY2UoL29yL2lnLCBcInx8XCIpKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOS4reWQq+acieeJueauiuWtl+esplwiO1xuICAgICAgfVxuICAgICAgaWYgKC8oQU5EKVteKCldKyhPUikvaWcudGVzdChsb2dpYykgfHwgLyhPUilbXigpXSsoQU5EKS9pZy50ZXN0KGxvZ2ljKSkge1xuICAgICAgICBlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5b+F6aG75Zyo6L+e57ut5oCn55qEIEFORCDlkowgT1Ig6KGo6L6+5byP5YmN5ZCO5L2/55So5ous5Y+344CCXCI7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChlcnJvck1zZykge1xuICAgIGNvbnNvbGUubG9nKFwiZXJyb3JcIiwgZXJyb3JNc2cpO1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHRvYXN0ci5lcnJvcihlcnJvck1zZyk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxuXG4vKlxub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcbmV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcbiAqL1xuXG5DcmVhdG9yLmZvcm1hdEZpbHRlcnNUb01vbmdvID0gZnVuY3Rpb24oZmlsdGVycywgb3B0aW9ucykge1xuICB2YXIgc2VsZWN0b3I7XG4gIGlmICghKGZpbHRlcnMgIT0gbnVsbCA/IGZpbHRlcnMubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIShmaWx0ZXJzWzBdIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgZmlsdGVycyA9IF8ubWFwKGZpbHRlcnMsIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIFtvYmouZmllbGQsIG9iai5vcGVyYXRpb24sIG9iai52YWx1ZV07XG4gICAgfSk7XG4gIH1cbiAgc2VsZWN0b3IgPSBbXTtcbiAgXy5lYWNoKGZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlcikge1xuICAgIHZhciBmaWVsZCwgb3B0aW9uLCByZWcsIHN1Yl9zZWxlY3RvciwgdmFsdWU7XG4gICAgZmllbGQgPSBmaWx0ZXJbMF07XG4gICAgb3B0aW9uID0gZmlsdGVyWzFdO1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIG51bGwsIG9wdGlvbnMpO1xuICAgIH1cbiAgICBzdWJfc2VsZWN0b3IgPSB7fTtcbiAgICBzdWJfc2VsZWN0b3JbZmllbGRdID0ge307XG4gICAgaWYgKG9wdGlvbiA9PT0gXCI9XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZXFcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI8PlwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJG5lXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPlwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGd0XCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiPj1cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndGVcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI8XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI8PVwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGx0ZVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcInN0YXJ0c3dpdGhcIikge1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cChcIl5cIiArIHZhbHVlLCBcImlcIik7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcImNvbnRhaW5zXCIpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAodmFsdWUsIFwiaVwiKTtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWc7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwibm90Y29udGFpbnNcIikge1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cChcIl4oKD8hXCIgKyB2YWx1ZSArIFwiKS4pKiRcIiwgXCJpXCIpO1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZztcbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdG9yLnB1c2goc3ViX3NlbGVjdG9yKTtcbiAgfSk7XG4gIHJldHVybiBzZWxlY3Rvcjtcbn07XG5cbkNyZWF0b3IuaXNCZXR3ZWVuRmlsdGVyT3BlcmF0aW9uID0gZnVuY3Rpb24ob3BlcmF0aW9uKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiBvcGVyYXRpb24gPT09IFwiYmV0d2VlblwiIHx8ICEhKChyZWYgPSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyh0cnVlKSkgIT0gbnVsbCA/IHJlZltvcGVyYXRpb25dIDogdm9pZCAwKTtcbn07XG5cblxuLypcbm9wdGlvbnPlj4LmlbDvvJpcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XG5cdGV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcbiAqL1xuXG5DcmVhdG9yLmZvcm1hdEZpbHRlcnNUb0RldiA9IGZ1bmN0aW9uKGZpbHRlcnMsIG9iamVjdF9uYW1lLCBvcHRpb25zKSB7XG4gIHZhciBsb2dpY1RlbXBGaWx0ZXJzLCBzZWxlY3Rvciwgc3RlZWRvc0ZpbHRlcnM7XG4gIHN0ZWVkb3NGaWx0ZXJzID0gcmVxdWlyZShcIkBzdGVlZG9zL2ZpbHRlcnNcIik7XG4gIGlmICghZmlsdGVycy5sZW5ndGgpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuaXNfbG9naWNfb3IgOiB2b2lkIDApIHtcbiAgICBsb2dpY1RlbXBGaWx0ZXJzID0gW107XG4gICAgZmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uKG4pIHtcbiAgICAgIGxvZ2ljVGVtcEZpbHRlcnMucHVzaChuKTtcbiAgICAgIHJldHVybiBsb2dpY1RlbXBGaWx0ZXJzLnB1c2goXCJvclwiKTtcbiAgICB9KTtcbiAgICBsb2dpY1RlbXBGaWx0ZXJzLnBvcCgpO1xuICAgIGZpbHRlcnMgPSBsb2dpY1RlbXBGaWx0ZXJzO1xuICB9XG4gIHNlbGVjdG9yID0gc3RlZWRvc0ZpbHRlcnMuZm9ybWF0RmlsdGVyc1RvRGV2KGZpbHRlcnMsIENyZWF0b3IuVVNFUl9DT05URVhUKTtcbiAgcmV0dXJuIHNlbGVjdG9yO1xufTtcblxuXG4vKlxub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcbmV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcbiAqL1xuXG5DcmVhdG9yLmZvcm1hdExvZ2ljRmlsdGVyc1RvRGV2ID0gZnVuY3Rpb24oZmlsdGVycywgZmlsdGVyX2xvZ2ljLCBvcHRpb25zKSB7XG4gIHZhciBmb3JtYXRfbG9naWM7XG4gIGZvcm1hdF9sb2dpYyA9IGZpbHRlcl9sb2dpYy5yZXBsYWNlKC9cXChcXHMrL2lnLCBcIihcIikucmVwbGFjZSgvXFxzK1xcKS9pZywgXCIpXCIpLnJlcGxhY2UoL1xcKC9nLCBcIltcIikucmVwbGFjZSgvXFwpL2csIFwiXVwiKS5yZXBsYWNlKC9cXHMrL2csIFwiLFwiKS5yZXBsYWNlKC8oYW5kfG9yKS9pZywgXCInJDEnXCIpO1xuICBmb3JtYXRfbG9naWMgPSBmb3JtYXRfbG9naWMucmVwbGFjZSgvKFxcZCkrL2lnLCBmdW5jdGlvbih4KSB7XG4gICAgdmFyIF9mLCBmaWVsZCwgb3B0aW9uLCBzdWJfc2VsZWN0b3IsIHZhbHVlO1xuICAgIF9mID0gZmlsdGVyc1t4IC0gMV07XG4gICAgZmllbGQgPSBfZi5maWVsZDtcbiAgICBvcHRpb24gPSBfZi5vcGVyYXRpb247XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShfZi52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUsIG51bGwsIG9wdGlvbnMpO1xuICAgIH1cbiAgICBzdWJfc2VsZWN0b3IgPSBbXTtcbiAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKG9wdGlvbiA9PT0gXCI9XCIpIHtcbiAgICAgICAgXy5lYWNoKHZhbHVlLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIHN1Yl9zZWxlY3Rvci5wdXNoKFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI8PlwiKSB7XG4gICAgICAgIF8uZWFjaCh2YWx1ZSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBzdWJfc2VsZWN0b3IucHVzaChbZmllbGQsIG9wdGlvbiwgdl0sIFwiYW5kXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF8uZWFjaCh2YWx1ZSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBzdWJfc2VsZWN0b3IucHVzaChbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT09IFwiYW5kXCIgfHwgc3ViX3NlbGVjdG9yW3N1Yl9zZWxlY3Rvci5sZW5ndGggLSAxXSA9PT0gXCJvclwiKSB7XG4gICAgICAgIHN1Yl9zZWxlY3Rvci5wb3AoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3ViX3NlbGVjdG9yID0gW2ZpZWxkLCBvcHRpb24sIHZhbHVlXTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJzdWJfc2VsZWN0b3JcIiwgc3ViX3NlbGVjdG9yKTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3ViX3NlbGVjdG9yKTtcbiAgfSk7XG4gIGZvcm1hdF9sb2dpYyA9IFwiW1wiICsgZm9ybWF0X2xvZ2ljICsgXCJdXCI7XG4gIHJldHVybiBDcmVhdG9yW1wiZXZhbFwiXShmb3JtYXRfbG9naWMpO1xufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIF9vYmplY3QsIHBlcm1pc3Npb25zLCByZWxhdGVkX29iamVjdF9uYW1lcywgcmVsYXRlZF9vYmplY3RzLCB1bnJlbGF0ZWRfb2JqZWN0cztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICByZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdO1xuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIV9vYmplY3QpIHtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXM7XG4gIH1cbiAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhfb2JqZWN0Ll9jb2xsZWN0aW9uX25hbWUpO1xuICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLCBcIm9iamVjdF9uYW1lXCIpO1xuICBpZiAoKHJlbGF0ZWRfb2JqZWN0X25hbWVzICE9IG51bGwgPyByZWxhdGVkX29iamVjdF9uYW1lcy5sZW5ndGggOiB2b2lkIDApID09PSAwKSB7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICB9XG4gIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgdW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cztcbiAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLmRpZmZlcmVuY2UocmVsYXRlZF9vYmplY3RfbmFtZXMsIHVucmVsYXRlZF9vYmplY3RzKTtcbiAgcmV0dXJuIF8uZmlsdGVyKHJlbGF0ZWRfb2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QpIHtcbiAgICB2YXIgYWxsb3dSZWFkLCBpc0FjdGl2ZSwgcmVmLCByZWxhdGVkX29iamVjdF9uYW1lO1xuICAgIHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdC5vYmplY3RfbmFtZTtcbiAgICBpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMTtcbiAgICBhbGxvd1JlYWQgPSAocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKSAhPSBudWxsID8gcmVmLmFsbG93UmVhZCA6IHZvaWQgMDtcbiAgICByZXR1cm4gaXNBY3RpdmUgJiYgYWxsb3dSZWFkO1xuICB9KTtcbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdE5hbWVzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgcmVsYXRlZF9vYmplY3RzO1xuICByZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICByZXR1cm4gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsIFwib2JqZWN0X25hbWVcIik7XG59O1xuXG5DcmVhdG9yLmdldEFjdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBhY3Rpb25zLCBkaXNhYmxlZF9hY3Rpb25zLCBvYmosIHBlcm1pc3Npb25zLCByZWYsIHJlZjE7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIGRpc2FibGVkX2FjdGlvbnMgPSBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zO1xuICBhY3Rpb25zID0gXy5zb3J0QnkoXy52YWx1ZXMob2JqLmFjdGlvbnMpLCAnc29ydCcpO1xuICBpZiAoXy5oYXMob2JqLCAnYWxsb3dfYWN0aW9ucycpKSB7XG4gICAgYWN0aW9ucyA9IF8uZmlsdGVyKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgICAgcmV0dXJuIF8uaW5jbHVkZShvYmouYWxsb3dfYWN0aW9ucywgYWN0aW9uLm5hbWUpO1xuICAgIH0pO1xuICB9XG4gIF8uZWFjaChhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIFtcInJlY29yZFwiLCBcInJlY29yZF9vbmx5XCJdLmluZGV4T2YoYWN0aW9uLm9uKSA+IC0xICYmIGFjdGlvbi5uYW1lICE9PSAnc3RhbmRhcmRfZWRpdCcpIHtcbiAgICAgIGlmIChhY3Rpb24ub24gPT09IFwicmVjb3JkX29ubHlcIikge1xuICAgICAgICByZXR1cm4gYWN0aW9uLm9uID0gJ3JlY29yZF9vbmx5X21vcmUnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi5vbiA9ICdyZWNvcmRfbW9yZSc7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBbXCJjbXNfZmlsZXNcIiwgXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXS5pbmRleE9mKG9iamVjdF9uYW1lKSA+IC0xKSB7XG4gICAgaWYgKChyZWYgPSBhY3Rpb25zLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4ubmFtZSA9PT0gXCJzdGFuZGFyZF9lZGl0XCI7XG4gICAgfSkpICE9IG51bGwpIHtcbiAgICAgIHJlZi5vbiA9IFwicmVjb3JkX21vcmVcIjtcbiAgICB9XG4gICAgaWYgKChyZWYxID0gYWN0aW9ucy5maW5kKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLm5hbWUgPT09IFwiZG93bmxvYWRcIjtcbiAgICB9KSkgIT0gbnVsbCkge1xuICAgICAgcmVmMS5vbiA9IFwicmVjb3JkXCI7XG4gICAgfVxuICB9XG4gIGFjdGlvbnMgPSBfLmZpbHRlcihhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICByZXR1cm4gXy5pbmRleE9mKGRpc2FibGVkX2FjdGlvbnMsIGFjdGlvbi5uYW1lKSA8IDA7XG4gIH0pO1xuICByZXR1cm4gYWN0aW9ucztcbn07XG5cbi/ov5Tlm57lvZPliY3nlKjmiLfmnInmnYPpmZDorr/pl67nmoTmiYDmnIlsaXN0X3ZpZXfvvIzljIXmi6zliIbkuqvnmoTvvIznlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTvvIjpmaTpnZ5vd25lcuWPmOS6hu+8ie+8jOS7peWPium7mOiupOeahOWFtuS7luinhuWbvuazqOaEj0NyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mmK/kuI3kvJrmnInnlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTop4blm77nmoTvvIzmiYDku6VDcmVhdG9yLmdldFBlcm1pc3Npb25z5Ye95pWw5Lit5ou/5Yiw55qE57uT5p6c5LiN5YWo77yM5bm25LiN5piv5b2T5YmN55So5oi36IO955yL5Yiw5omA5pyJ6KeG5Zu+LztcblxuQ3JlYXRvci5nZXRMaXN0Vmlld3MgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBkaXNhYmxlZF9saXN0X3ZpZXdzLCBpc01vYmlsZSwgbGlzdF92aWV3cywgb2JqZWN0LCByZWY7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGRpc2FibGVkX2xpc3Rfdmlld3MgPSAoKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYuZGlzYWJsZWRfbGlzdF92aWV3cyA6IHZvaWQgMCkgfHwgW107XG4gIGxpc3Rfdmlld3MgPSBbXTtcbiAgaXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKCk7XG4gIF8uZWFjaChvYmplY3QubGlzdF92aWV3cywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgaWYgKGlzTW9iaWxlICYmIGl0ZW0udHlwZSA9PT0gXCJjYWxlbmRhclwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpdGVtX25hbWUgIT09IFwiZGVmYXVsdFwiKSB7XG4gICAgICBpZiAoXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW1fbmFtZSkgPCAwIHx8IGl0ZW0ub3duZXIgPT09IHVzZXJJZCkge1xuICAgICAgICByZXR1cm4gbGlzdF92aWV3cy5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBsaXN0X3ZpZXdzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBmaWVsZHNOYW1lLCByZWYsIHVucmVhZGFibGVfZmllbGRzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIGZpZWxkc05hbWUgPSBDcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUob2JqZWN0X25hbWUpO1xuICB1bnJlYWRhYmxlX2ZpZWxkcyA9IChyZWYgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKSAhPSBudWxsID8gcmVmLnVucmVhZGFibGVfZmllbGRzIDogdm9pZCAwO1xuICByZXR1cm4gXy5kaWZmZXJlbmNlKGZpZWxkc05hbWUsIHVucmVhZGFibGVfZmllbGRzKTtcbn07XG5cbkNyZWF0b3IuaXNsb2FkaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhQ3JlYXRvci5ib290c3RyYXBMb2FkZWQuZ2V0KCk7XG59O1xuXG5DcmVhdG9yLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIik7XG59O1xuXG5DcmVhdG9yLmdldERpc2FibGVkRmllbGRzID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBmaWVsZHM7XG4gIGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQsIGZpZWxkTmFtZSkge1xuICAgIHJldHVybiBmaWVsZC5hdXRvZm9ybSAmJiBmaWVsZC5hdXRvZm9ybS5kaXNhYmxlZCAmJiAhZmllbGQuYXV0b2Zvcm0ub21pdCAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0SGlkZGVuRmllbGRzID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBmaWVsZHM7XG4gIGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQsIGZpZWxkTmFtZSkge1xuICAgIHJldHVybiBmaWVsZC5hdXRvZm9ybSAmJiBmaWVsZC5hdXRvZm9ybS50eXBlID09PSBcImhpZGRlblwiICYmICFmaWVsZC5hdXRvZm9ybS5vbWl0ICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNXaXRoTm9Hcm91cCA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gKCFmaWVsZC5hdXRvZm9ybSB8fCAhZmllbGQuYXV0b2Zvcm0uZ3JvdXAgfHwgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT09IFwiLVwiKSAmJiAoIWZpZWxkLmF1dG9mb3JtIHx8IGZpZWxkLmF1dG9mb3JtLnR5cGUgIT09IFwiaGlkZGVuXCIpICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRTb3J0ZWRGaWVsZEdyb3VwTmFtZXMgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIG5hbWVzO1xuICBuYW1lcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgIT09IFwiLVwiICYmIGZpZWxkLmF1dG9mb3JtLmdyb3VwO1xuICB9KTtcbiAgbmFtZXMgPSBfLmNvbXBhY3QobmFtZXMpO1xuICBuYW1lcyA9IF8udW5pcXVlKG5hbWVzKTtcbiAgcmV0dXJuIG5hbWVzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNGb3JHcm91cCA9IGZ1bmN0aW9uKHNjaGVtYSwgZ3JvdXBOYW1lKSB7XG4gIHZhciBmaWVsZHM7XG4gIGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgZnVuY3Rpb24oZmllbGQsIGZpZWxkTmFtZSkge1xuICAgIHJldHVybiBmaWVsZC5hdXRvZm9ybSAmJiBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PT0gZ3JvdXBOYW1lICYmIGZpZWxkLmF1dG9mb3JtLnR5cGUgIT09IFwiaGlkZGVuXCIgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRPbWl0ID0gZnVuY3Rpb24oc2NoZW1hLCBrZXlzKSB7XG4gIGtleXMgPSBfLm1hcChrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgZmllbGQsIHJlZjtcbiAgICBmaWVsZCA9IF8ucGljayhzY2hlbWEsIGtleSk7XG4gICAgaWYgKChyZWYgPSBmaWVsZFtrZXldLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmLm9taXQgOiB2b2lkIDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gIH0pO1xuICBrZXlzID0gXy5jb21wYWN0KGtleXMpO1xuICByZXR1cm4ga2V5cztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzSW5GaXJzdExldmVsID0gZnVuY3Rpb24oZmlyc3RMZXZlbEtleXMsIGtleXMpIHtcbiAga2V5cyA9IF8ubWFwKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgIGlmIChfLmluZGV4T2YoZmlyc3RMZXZlbEtleXMsIGtleSkgPiAtMSkge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSk7XG4gIGtleXMgPSBfLmNvbXBhY3Qoa2V5cyk7XG4gIHJldHVybiBrZXlzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNGb3JSZW9yZGVyID0gZnVuY3Rpb24oc2NoZW1hLCBrZXlzLCBpc1NpbmdsZSkge1xuICB2YXIgX2tleXMsIGNoaWxkS2V5cywgZmllbGRzLCBpLCBpc193aWRlXzEsIGlzX3dpZGVfMiwgc2NfMSwgc2NfMjtcbiAgZmllbGRzID0gW107XG4gIGkgPSAwO1xuICBfa2V5cyA9IF8uZmlsdGVyKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiAha2V5LmVuZHNXaXRoKCdfZW5kTGluZScpO1xuICB9KTtcbiAgd2hpbGUgKGkgPCBfa2V5cy5sZW5ndGgpIHtcbiAgICBzY18xID0gXy5waWNrKHNjaGVtYSwgX2tleXNbaV0pO1xuICAgIHNjXzIgPSBfLnBpY2soc2NoZW1hLCBfa2V5c1tpICsgMV0pO1xuICAgIGlzX3dpZGVfMSA9IGZhbHNlO1xuICAgIGlzX3dpZGVfMiA9IGZhbHNlO1xuICAgIF8uZWFjaChzY18xLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIHJlZiwgcmVmMTtcbiAgICAgIGlmICgoKHJlZiA9IHZhbHVlLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmLmlzX3dpZGUgOiB2b2lkIDApIHx8ICgocmVmMSA9IHZhbHVlLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMS50eXBlIDogdm9pZCAwKSA9PT0gXCJ0YWJsZVwiKSB7XG4gICAgICAgIHJldHVybiBpc193aWRlXzEgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIF8uZWFjaChzY18yLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIHJlZiwgcmVmMTtcbiAgICAgIGlmICgoKHJlZiA9IHZhbHVlLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmLmlzX3dpZGUgOiB2b2lkIDApIHx8ICgocmVmMSA9IHZhbHVlLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMS50eXBlIDogdm9pZCAwKSA9PT0gXCJ0YWJsZVwiKSB7XG4gICAgICAgIHJldHVybiBpc193aWRlXzIgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgIGlzX3dpZGVfMSA9IHRydWU7XG4gICAgICBpc193aWRlXzIgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoaXNTaW5nbGUpIHtcbiAgICAgIGZpZWxkcy5wdXNoKF9rZXlzLnNsaWNlKGksIGkgKyAxKSk7XG4gICAgICBpICs9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc193aWRlXzEpIHtcbiAgICAgICAgZmllbGRzLnB1c2goX2tleXMuc2xpY2UoaSwgaSArIDEpKTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgfSBlbHNlIGlmICghaXNfd2lkZV8xICYmIGlzX3dpZGVfMikge1xuICAgICAgICBjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpICsgMSk7XG4gICAgICAgIGNoaWxkS2V5cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIGZpZWxkcy5wdXNoKGNoaWxkS2V5cyk7XG4gICAgICAgIGkgKz0gMTtcbiAgICAgIH0gZWxzZSBpZiAoIWlzX3dpZGVfMSAmJiAhaXNfd2lkZV8yKSB7XG4gICAgICAgIGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkgKyAxKTtcbiAgICAgICAgaWYgKF9rZXlzW2kgKyAxXSkge1xuICAgICAgICAgIGNoaWxkS2V5cy5wdXNoKF9rZXlzW2kgKyAxXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2hpbGRLZXlzLnB1c2godm9pZCAwKTtcbiAgICAgICAgfVxuICAgICAgICBmaWVsZHMucHVzaChjaGlsZEtleXMpO1xuICAgICAgICBpICs9IDI7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmlzRmlsdGVyVmFsdWVFbXB0eSA9IGZ1bmN0aW9uKHYpIHtcbiAgcmV0dXJuIHR5cGVvZiB2ID09PSBcInVuZGVmaW5lZFwiIHx8IHYgPT09IG51bGwgfHwgTnVtYmVyLmlzTmFOKHYpIHx8IHYubGVuZ3RoID09PSAwO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDcmVhdG9yLmdldEFsbFJlbGF0ZWRPYmplY3RzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgcmVsYXRlZF9vYmplY3RfbmFtZXM7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBbXTtcbiAgICBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgICAgcmV0dXJuIF8uZWFjaChyZWxhdGVkX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgICAgICBpZiAocmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PT0gb2JqZWN0X25hbWUpIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXMucHVzaChyZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKS5lbmFibGVfZmlsZXMpIHtcbiAgICAgIHJlbGF0ZWRfb2JqZWN0X25hbWVzLnB1c2goXCJjbXNfZmlsZXNcIik7XG4gICAgfVxuICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgfTtcbn1cbiIsIkNyZWF0b3IuYXBwc0J5TmFtZSA9IHt9XHJcblxyXG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlX2lkKS0+XHJcblx0XHRpZiAhdGhpcy51c2VySWRcclxuXHRcdFx0cmV0dXJuIG51bGxcclxuXHJcblx0XHRpZiBvYmplY3RfbmFtZSA9PSBcIm9iamVjdF9yZWNlbnRfdmlld2VkXCJcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRpZiBvYmplY3RfbmFtZSBhbmQgcmVjb3JkX2lkXHJcblx0XHRcdGlmICFzcGFjZV9pZFxyXG5cdFx0XHRcdGRvYyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZE9uZSh7X2lkOiByZWNvcmRfaWR9LCB7ZmllbGRzOiB7c3BhY2U6IDF9fSlcclxuXHRcdFx0XHRzcGFjZV9pZCA9IGRvYz8uc3BhY2VcclxuXHJcblx0XHRcdGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9yZWNlbnRfdmlld2VkXCIpXHJcblx0XHRcdGZpbHRlcnMgPSB7IG93bmVyOiB0aGlzLnVzZXJJZCwgc3BhY2U6IHNwYWNlX2lkLCAncmVjb3JkLm8nOiBvYmplY3RfbmFtZSwgJ3JlY29yZC5pZHMnOiBbcmVjb3JkX2lkXX1cclxuXHRcdFx0Y3VycmVudF9yZWNlbnRfdmlld2VkID0gY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLmZpbmRPbmUoZmlsdGVycylcclxuXHRcdFx0aWYgY3VycmVudF9yZWNlbnRfdmlld2VkXHJcblx0XHRcdFx0Y29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLnVwZGF0ZShcclxuXHRcdFx0XHRcdGN1cnJlbnRfcmVjZW50X3ZpZXdlZC5faWQsXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdCRpbmM6IHtcclxuXHRcdFx0XHRcdFx0XHRjb3VudDogMVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWQ6IG5ldyBEYXRlKClcclxuXHRcdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogdGhpcy51c2VySWRcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5pbnNlcnQoXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdF9pZDogY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLl9tYWtlTmV3SUQoKVxyXG5cdFx0XHRcdFx0XHRvd25lcjogdGhpcy51c2VySWRcclxuXHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkXHJcblx0XHRcdFx0XHRcdHJlY29yZDoge286IG9iamVjdF9uYW1lLCBpZHM6IFtyZWNvcmRfaWRdfVxyXG5cdFx0XHRcdFx0XHRjb3VudDogMVxyXG5cdFx0XHRcdFx0XHRjcmVhdGVkOiBuZXcgRGF0ZSgpXHJcblx0XHRcdFx0XHRcdGNyZWF0ZWRfYnk6IHRoaXMudXNlcklkXHJcblx0XHRcdFx0XHRcdG1vZGlmaWVkOiBuZXcgRGF0ZSgpXHJcblx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdClcclxuXHRcdFx0cmV0dXJuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBcIm9iamVjdF9yZWNlbnRfdmlld2VkXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlX2lkKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZCwgY3VycmVudF9yZWNlbnRfdmlld2VkLCBkb2MsIGZpbHRlcnM7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChvYmplY3RfbmFtZSAmJiByZWNvcmRfaWQpIHtcbiAgICAgIGlmICghc3BhY2VfaWQpIHtcbiAgICAgICAgZG9jID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kT25lKHtcbiAgICAgICAgICBfaWQ6IHJlY29yZF9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBzcGFjZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHNwYWNlX2lkID0gZG9jICE9IG51bGwgPyBkb2Muc3BhY2UgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgICBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiKTtcbiAgICAgIGZpbHRlcnMgPSB7XG4gICAgICAgIG93bmVyOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAncmVjb3JkLm8nOiBvYmplY3RfbmFtZSxcbiAgICAgICAgJ3JlY29yZC5pZHMnOiBbcmVjb3JkX2lkXVxuICAgICAgfTtcbiAgICAgIGN1cnJlbnRfcmVjZW50X3ZpZXdlZCA9IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5maW5kT25lKGZpbHRlcnMpO1xuICAgICAgaWYgKGN1cnJlbnRfcmVjZW50X3ZpZXdlZCkge1xuICAgICAgICBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQudXBkYXRlKGN1cnJlbnRfcmVjZW50X3ZpZXdlZC5faWQsIHtcbiAgICAgICAgICAkaW5jOiB7XG4gICAgICAgICAgICBjb3VudDogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgbW9kaWZpZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBtb2RpZmllZF9ieTogdGhpcy51c2VySWRcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLmluc2VydCh7XG4gICAgICAgICAgX2lkOiBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuX21ha2VOZXdJRCgpLFxuICAgICAgICAgIG93bmVyOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgcmVjb3JkOiB7XG4gICAgICAgICAgICBvOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGlkczogW3JlY29yZF9pZF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvdW50OiAxLFxuICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgY3JlYXRlZF9ieTogdGhpcy51c2VySWQsXG4gICAgICAgICAgbW9kaWZpZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG4iLCJyZWNlbnRfYWdncmVnYXRlID0gKGNyZWF0ZWRfYnksIHNwYWNlSWQsIF9yZWNvcmRzLCBjYWxsYmFjayktPlxyXG5cdENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3JlY2VudF92aWV3ZWQucmF3Q29sbGVjdGlvbigpLmFnZ3JlZ2F0ZShbXHJcblx0XHR7JG1hdGNoOiB7Y3JlYXRlZF9ieTogY3JlYXRlZF9ieSwgc3BhY2U6IHNwYWNlSWR9fSxcclxuXHRcdHskZ3JvdXA6IHtfaWQ6IHtvYmplY3RfbmFtZTogXCIkcmVjb3JkLm9cIiwgcmVjb3JkX2lkOiBcIiRyZWNvcmQuaWRzXCIsIHNwYWNlOiBcIiRzcGFjZVwifSwgbWF4Q3JlYXRlZDogeyRtYXg6IFwiJGNyZWF0ZWRcIn19fSxcclxuXHRcdHskc29ydDoge21heENyZWF0ZWQ6IC0xfX0sXHJcblx0XHR7JGxpbWl0OiAxMH1cclxuXHRdKS50b0FycmF5IChlcnIsIGRhdGEpLT5cclxuXHRcdGlmIGVyclxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyKVxyXG5cclxuXHRcdGRhdGEuZm9yRWFjaCAoZG9jKSAtPlxyXG5cdFx0XHRfcmVjb3Jkcy5wdXNoIGRvYy5faWRcclxuXHJcblx0XHRpZiBjYWxsYmFjayAmJiBfLmlzRnVuY3Rpb24oY2FsbGJhY2spXHJcblx0XHRcdGNhbGxiYWNrKClcclxuXHJcblx0XHRyZXR1cm5cclxuXHJcbmFzeW5jX3JlY2VudF9hZ2dyZWdhdGUgPSBNZXRlb3Iud3JhcEFzeW5jKHJlY2VudF9hZ2dyZWdhdGUpXHJcblxyXG5zZWFyY2hfb2JqZWN0ID0gKHNwYWNlLCBvYmplY3RfbmFtZSx1c2VySWQsIHNlYXJjaFRleHQpLT5cclxuXHRkYXRhID0gbmV3IEFycmF5KClcclxuXHJcblx0aWYgc2VhcmNoVGV4dFxyXG5cclxuXHRcdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHJcblx0XHRfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpXHJcblx0XHRfb2JqZWN0X25hbWVfa2V5ID0gX29iamVjdD8uTkFNRV9GSUVMRF9LRVlcclxuXHRcdGlmIF9vYmplY3QgJiYgX29iamVjdF9jb2xsZWN0aW9uICYmIF9vYmplY3RfbmFtZV9rZXlcclxuXHRcdFx0cXVlcnkgPSB7fVxyXG5cdFx0XHRzZWFyY2hfS2V5d29yZHMgPSBzZWFyY2hUZXh0LnNwbGl0KFwiIFwiKVxyXG5cdFx0XHRxdWVyeV9hbmQgPSBbXVxyXG5cdFx0XHRzZWFyY2hfS2V5d29yZHMuZm9yRWFjaCAoa2V5d29yZCktPlxyXG5cdFx0XHRcdHN1YnF1ZXJ5ID0ge31cclxuXHRcdFx0XHRzdWJxdWVyeVtfb2JqZWN0X25hbWVfa2V5XSA9IHskcmVnZXg6IGtleXdvcmQudHJpbSgpfVxyXG5cdFx0XHRcdHF1ZXJ5X2FuZC5wdXNoIHN1YnF1ZXJ5XHJcblxyXG5cdFx0XHRxdWVyeS4kYW5kID0gcXVlcnlfYW5kXHJcblx0XHRcdHF1ZXJ5LnNwYWNlID0geyRpbjogW3NwYWNlXX1cclxuXHJcblx0XHRcdGZpZWxkcyA9IHtfaWQ6IDF9XHJcblx0XHRcdGZpZWxkc1tfb2JqZWN0X25hbWVfa2V5XSA9IDFcclxuXHJcblx0XHRcdHJlY29yZHMgPSBfb2JqZWN0X2NvbGxlY3Rpb24uZmluZChxdWVyeSwge2ZpZWxkczogZmllbGRzLCBzb3J0OiB7bW9kaWZpZWQ6IDF9LCBsaW1pdDogNX0pXHJcblxyXG5cdFx0XHRyZWNvcmRzLmZvckVhY2ggKHJlY29yZCktPlxyXG5cdFx0XHRcdGRhdGEucHVzaCB7X2lkOiByZWNvcmQuX2lkLCBfbmFtZTogcmVjb3JkW19vYmplY3RfbmFtZV9rZXldLCBfb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lfVxyXG5cdFxyXG5cdHJldHVybiBkYXRhXHJcblxyXG5NZXRlb3IubWV0aG9kc1xyXG5cdCdvYmplY3RfcmVjZW50X3JlY29yZCc6IChzcGFjZUlkKS0+XHJcblx0XHRkYXRhID0gbmV3IEFycmF5KClcclxuXHRcdHJlY29yZHMgPSBuZXcgQXJyYXkoKVxyXG5cdFx0YXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSh0aGlzLnVzZXJJZCwgc3BhY2VJZCwgcmVjb3JkcylcclxuXHRcdHJlY29yZHMuZm9yRWFjaCAoaXRlbSktPlxyXG5cdFx0XHRyZWNvcmRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSlcclxuXHJcblx0XHRcdGlmICFyZWNvcmRfb2JqZWN0XHJcblx0XHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0XHRyZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSlcclxuXHJcblx0XHRcdGlmIHJlY29yZF9vYmplY3QgJiYgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uXHJcblx0XHRcdFx0ZmllbGRzID0ge19pZDogMX1cclxuXHJcblx0XHRcdFx0ZmllbGRzW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldID0gMVxyXG5cclxuXHRcdFx0XHRyZWNvcmQgPSByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24uZmluZE9uZShpdGVtLnJlY29yZF9pZFswXSwge2ZpZWxkczogZmllbGRzfSlcclxuXHRcdFx0XHRpZiByZWNvcmRcclxuXHRcdFx0XHRcdGRhdGEucHVzaCB7X2lkOiByZWNvcmQuX2lkLCBfbmFtZTogcmVjb3JkW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldLCBfb2JqZWN0X25hbWU6IGl0ZW0ub2JqZWN0X25hbWV9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGFcclxuXHJcblx0J29iamVjdF9yZWNvcmRfc2VhcmNoJzogKG9wdGlvbnMpLT5cclxuXHRcdHNlbGYgPSB0aGlzXHJcblxyXG5cdFx0ZGF0YSA9IG5ldyBBcnJheSgpXHJcblxyXG5cdFx0c2VhcmNoVGV4dCA9IG9wdGlvbnMuc2VhcmNoVGV4dFxyXG5cdFx0c3BhY2UgPSBvcHRpb25zLnNwYWNlXHJcblxyXG5cdFx0Xy5mb3JFYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKF9vYmplY3QsIG5hbWUpLT5cclxuXHRcdFx0aWYgX29iamVjdC5lbmFibGVfc2VhcmNoXHJcblx0XHRcdFx0b2JqZWN0X3JlY29yZCA9IHNlYXJjaF9vYmplY3Qoc3BhY2UsIF9vYmplY3QubmFtZSwgc2VsZi51c2VySWQsIHNlYXJjaFRleHQpXHJcblx0XHRcdFx0ZGF0YSA9IGRhdGEuY29uY2F0KG9iamVjdF9yZWNvcmQpXHJcblxyXG5cdFx0cmV0dXJuIGRhdGFcclxuIiwidmFyIGFzeW5jX3JlY2VudF9hZ2dyZWdhdGUsIHJlY2VudF9hZ2dyZWdhdGUsIHNlYXJjaF9vYmplY3Q7XG5cbnJlY2VudF9hZ2dyZWdhdGUgPSBmdW5jdGlvbihjcmVhdGVkX2J5LCBzcGFjZUlkLCBfcmVjb3JkcywgY2FsbGJhY2spIHtcbiAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3JlY2VudF92aWV3ZWQucmF3Q29sbGVjdGlvbigpLmFnZ3JlZ2F0ZShbXG4gICAge1xuICAgICAgJG1hdGNoOiB7XG4gICAgICAgIGNyZWF0ZWRfYnk6IGNyZWF0ZWRfYnksXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgJGdyb3VwOiB7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBcIiRyZWNvcmQub1wiLFxuICAgICAgICAgIHJlY29yZF9pZDogXCIkcmVjb3JkLmlkc1wiLFxuICAgICAgICAgIHNwYWNlOiBcIiRzcGFjZVwiXG4gICAgICAgIH0sXG4gICAgICAgIG1heENyZWF0ZWQ6IHtcbiAgICAgICAgICAkbWF4OiBcIiRjcmVhdGVkXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgICRzb3J0OiB7XG4gICAgICAgIG1heENyZWF0ZWQ6IC0xXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgJGxpbWl0OiAxMFxuICAgIH1cbiAgXSkudG9BcnJheShmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyKTtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGRvYykge1xuICAgICAgcmV0dXJuIF9yZWNvcmRzLnB1c2goZG9jLl9pZCk7XG4gICAgfSk7XG4gICAgaWYgKGNhbGxiYWNrICYmIF8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9KTtcbn07XG5cbmFzeW5jX3JlY2VudF9hZ2dyZWdhdGUgPSBNZXRlb3Iud3JhcEFzeW5jKHJlY2VudF9hZ2dyZWdhdGUpO1xuXG5zZWFyY2hfb2JqZWN0ID0gZnVuY3Rpb24oc3BhY2UsIG9iamVjdF9uYW1lLCB1c2VySWQsIHNlYXJjaFRleHQpIHtcbiAgdmFyIF9vYmplY3QsIF9vYmplY3RfY29sbGVjdGlvbiwgX29iamVjdF9uYW1lX2tleSwgZGF0YSwgZmllbGRzLCBxdWVyeSwgcXVlcnlfYW5kLCByZWNvcmRzLCBzZWFyY2hfS2V5d29yZHM7XG4gIGRhdGEgPSBuZXcgQXJyYXkoKTtcbiAgaWYgKHNlYXJjaFRleHQpIHtcbiAgICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIF9vYmplY3RfY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSk7XG4gICAgX29iamVjdF9uYW1lX2tleSA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuTkFNRV9GSUVMRF9LRVkgOiB2b2lkIDA7XG4gICAgaWYgKF9vYmplY3QgJiYgX29iamVjdF9jb2xsZWN0aW9uICYmIF9vYmplY3RfbmFtZV9rZXkpIHtcbiAgICAgIHF1ZXJ5ID0ge307XG4gICAgICBzZWFyY2hfS2V5d29yZHMgPSBzZWFyY2hUZXh0LnNwbGl0KFwiIFwiKTtcbiAgICAgIHF1ZXJ5X2FuZCA9IFtdO1xuICAgICAgc2VhcmNoX0tleXdvcmRzLmZvckVhY2goZnVuY3Rpb24oa2V5d29yZCkge1xuICAgICAgICB2YXIgc3VicXVlcnk7XG4gICAgICAgIHN1YnF1ZXJ5ID0ge307XG4gICAgICAgIHN1YnF1ZXJ5W19vYmplY3RfbmFtZV9rZXldID0ge1xuICAgICAgICAgICRyZWdleDoga2V5d29yZC50cmltKClcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHF1ZXJ5X2FuZC5wdXNoKHN1YnF1ZXJ5KTtcbiAgICAgIH0pO1xuICAgICAgcXVlcnkuJGFuZCA9IHF1ZXJ5X2FuZDtcbiAgICAgIHF1ZXJ5LnNwYWNlID0ge1xuICAgICAgICAkaW46IFtzcGFjZV1cbiAgICAgIH07XG4gICAgICBmaWVsZHMgPSB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfTtcbiAgICAgIGZpZWxkc1tfb2JqZWN0X25hbWVfa2V5XSA9IDE7XG4gICAgICByZWNvcmRzID0gX29iamVjdF9jb2xsZWN0aW9uLmZpbmQocXVlcnksIHtcbiAgICAgICAgZmllbGRzOiBmaWVsZHMsXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBtb2RpZmllZDogMVxuICAgICAgICB9LFxuICAgICAgICBsaW1pdDogNVxuICAgICAgfSk7XG4gICAgICByZWNvcmRzLmZvckVhY2goZnVuY3Rpb24ocmVjb3JkKSB7XG4gICAgICAgIHJldHVybiBkYXRhLnB1c2goe1xuICAgICAgICAgIF9pZDogcmVjb3JkLl9pZCxcbiAgICAgICAgICBfbmFtZTogcmVjb3JkW19vYmplY3RfbmFtZV9rZXldLFxuICAgICAgICAgIF9vYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gICdvYmplY3RfcmVjZW50X3JlY29yZCc6IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgZGF0YSwgcmVjb3JkcztcbiAgICBkYXRhID0gbmV3IEFycmF5KCk7XG4gICAgcmVjb3JkcyA9IG5ldyBBcnJheSgpO1xuICAgIGFzeW5jX3JlY2VudF9hZ2dyZWdhdGUodGhpcy51c2VySWQsIHNwYWNlSWQsIHJlY29yZHMpO1xuICAgIHJlY29yZHMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICB2YXIgZmllbGRzLCByZWNvcmQsIHJlY29yZF9vYmplY3QsIHJlY29yZF9vYmplY3RfY29sbGVjdGlvbjtcbiAgICAgIHJlY29yZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChpdGVtLm9iamVjdF9uYW1lLCBpdGVtLnNwYWNlKTtcbiAgICAgIGlmICghcmVjb3JkX29iamVjdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSk7XG4gICAgICBpZiAocmVjb3JkX29iamVjdCAmJiByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24pIHtcbiAgICAgICAgZmllbGRzID0ge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9O1xuICAgICAgICBmaWVsZHNbcmVjb3JkX29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gPSAxO1xuICAgICAgICByZWNvcmQgPSByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24uZmluZE9uZShpdGVtLnJlY29yZF9pZFswXSwge1xuICAgICAgICAgIGZpZWxkczogZmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGEucHVzaCh7XG4gICAgICAgICAgICBfaWQ6IHJlY29yZC5faWQsXG4gICAgICAgICAgICBfbmFtZTogcmVjb3JkW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldLFxuICAgICAgICAgICAgX29iamVjdF9uYW1lOiBpdGVtLm9iamVjdF9uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfSxcbiAgJ29iamVjdF9yZWNvcmRfc2VhcmNoJzogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBkYXRhLCBzZWFyY2hUZXh0LCBzZWxmLCBzcGFjZTtcbiAgICBzZWxmID0gdGhpcztcbiAgICBkYXRhID0gbmV3IEFycmF5KCk7XG4gICAgc2VhcmNoVGV4dCA9IG9wdGlvbnMuc2VhcmNoVGV4dDtcbiAgICBzcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gICAgXy5mb3JFYWNoKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgZnVuY3Rpb24oX29iamVjdCwgbmFtZSkge1xuICAgICAgdmFyIG9iamVjdF9yZWNvcmQ7XG4gICAgICBpZiAoX29iamVjdC5lbmFibGVfc2VhcmNoKSB7XG4gICAgICAgIG9iamVjdF9yZWNvcmQgPSBzZWFyY2hfb2JqZWN0KHNwYWNlLCBfb2JqZWN0Lm5hbWUsIHNlbGYudXNlcklkLCBzZWFyY2hUZXh0KTtcbiAgICAgICAgcmV0dXJuIGRhdGEgPSBkYXRhLmNvbmNhdChvYmplY3RfcmVjb3JkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG4gICAgdXBkYXRlX2ZpbHRlcnM6IChsaXN0dmlld19pZCwgZmlsdGVycywgZmlsdGVyX3Njb3BlLCBmaWx0ZXJfbG9naWMpLT5cclxuICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MuZGlyZWN0LnVwZGF0ZSh7X2lkOiBsaXN0dmlld19pZH0sIHskc2V0OiB7ZmlsdGVyczogZmlsdGVycywgZmlsdGVyX3Njb3BlOiBmaWx0ZXJfc2NvcGUsIGZpbHRlcl9sb2dpYzogZmlsdGVyX2xvZ2ljfX0pXHJcblxyXG4gICAgdXBkYXRlX2NvbHVtbnM6IChsaXN0dmlld19pZCwgY29sdW1ucyktPlxyXG4gICAgICAgIGNoZWNrKGNvbHVtbnMsIEFycmF5KVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIGNvbHVtbnMubGVuZ3RoIDwgMVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMCwgXCJTZWxlY3QgYXQgbGVhc3Qgb25lIGZpZWxkIHRvIGRpc3BsYXlcIlxyXG4gICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy51cGRhdGUoe19pZDogbGlzdHZpZXdfaWR9LCB7JHNldDoge2NvbHVtbnM6IGNvbHVtbnN9fSlcclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICB1cGRhdGVfZmlsdGVyczogZnVuY3Rpb24obGlzdHZpZXdfaWQsIGZpbHRlcnMsIGZpbHRlcl9zY29wZSwgZmlsdGVyX2xvZ2ljKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogbGlzdHZpZXdfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGZpbHRlcnM6IGZpbHRlcnMsXG4gICAgICAgIGZpbHRlcl9zY29wZTogZmlsdGVyX3Njb3BlLFxuICAgICAgICBmaWx0ZXJfbG9naWM6IGZpbHRlcl9sb2dpY1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICB1cGRhdGVfY29sdW1uczogZnVuY3Rpb24obGlzdHZpZXdfaWQsIGNvbHVtbnMpIHtcbiAgICBjaGVjayhjb2x1bW5zLCBBcnJheSk7XG4gICAgaWYgKGNvbHVtbnMubGVuZ3RoIDwgMSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwiU2VsZWN0IGF0IGxlYXN0IG9uZSBmaWVsZCB0byBkaXNwbGF5XCIpO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfbGlzdHZpZXdzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IGxpc3R2aWV3X2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHQncmVwb3J0X2RhdGEnOiAob3B0aW9ucyktPlxyXG5cdFx0Y2hlY2sob3B0aW9ucywgT2JqZWN0KVxyXG5cdFx0c3BhY2UgPSBvcHRpb25zLnNwYWNlXHJcblx0XHRmaWVsZHMgPSBvcHRpb25zLmZpZWxkc1xyXG5cdFx0b2JqZWN0X25hbWUgPSBvcHRpb25zLm9iamVjdF9uYW1lXHJcblx0XHRmaWx0ZXJfc2NvcGUgPSBvcHRpb25zLmZpbHRlcl9zY29wZVxyXG5cdFx0ZmlsdGVycyA9IG9wdGlvbnMuZmlsdGVyc1xyXG5cdFx0ZmlsdGVyRmllbGRzID0ge31cclxuXHRcdGNvbXBvdW5kRmllbGRzID0gW11cclxuXHRcdG9iamVjdEZpZWxkcyA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKT8uZmllbGRzXHJcblx0XHRfLmVhY2ggZmllbGRzLCAoaXRlbSwgaW5kZXgpLT5cclxuXHRcdFx0c3BsaXRzID0gaXRlbS5zcGxpdChcIi5cIilcclxuXHRcdFx0bmFtZSA9IHNwbGl0c1swXVxyXG5cdFx0XHRvYmplY3RGaWVsZCA9IG9iamVjdEZpZWxkc1tuYW1lXVxyXG5cdFx0XHRpZiBzcGxpdHMubGVuZ3RoID4gMSBhbmQgb2JqZWN0RmllbGRcclxuXHRcdFx0XHRjaGlsZEtleSA9IGl0ZW0ucmVwbGFjZSBuYW1lICsgXCIuXCIsIFwiXCJcclxuXHRcdFx0XHRjb21wb3VuZEZpZWxkcy5wdXNoKHtuYW1lOiBuYW1lLCBjaGlsZEtleTogY2hpbGRLZXksIGZpZWxkOiBvYmplY3RGaWVsZH0pXHJcblx0XHRcdGZpbHRlckZpZWxkc1tuYW1lXSA9IDFcclxuXHJcblx0XHRzZWxlY3RvciA9IHt9XHJcblx0XHR1c2VySWQgPSB0aGlzLnVzZXJJZFxyXG5cdFx0c2VsZWN0b3Iuc3BhY2UgPSBzcGFjZVxyXG5cdFx0aWYgZmlsdGVyX3Njb3BlID09IFwic3BhY2V4XCJcclxuXHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSBcclxuXHRcdFx0XHQkaW46IFtudWxsLHNwYWNlXVxyXG5cdFx0ZWxzZSBpZiBmaWx0ZXJfc2NvcGUgPT0gXCJtaW5lXCJcclxuXHRcdFx0c2VsZWN0b3Iub3duZXIgPSB1c2VySWRcclxuXHJcblx0XHRpZiBDcmVhdG9yLmlzQ29tbW9uU3BhY2Uoc3BhY2UpICYmIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlLCBAdXNlcklkKVxyXG5cdFx0XHRkZWxldGUgc2VsZWN0b3Iuc3BhY2VcclxuXHJcblx0XHRpZiBmaWx0ZXJzIGFuZCBmaWx0ZXJzLmxlbmd0aCA+IDBcclxuXHRcdFx0c2VsZWN0b3JbXCIkYW5kXCJdID0gZmlsdGVyc1xyXG5cclxuXHRcdGN1cnNvciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvciwge2ZpZWxkczogZmlsdGVyRmllbGRzLCBza2lwOiAwLCBsaW1pdDogMTAwMDB9KVxyXG4jXHRcdGlmIGN1cnNvci5jb3VudCgpID4gMTAwMDBcclxuI1x0XHRcdHJldHVybiBbXVxyXG5cdFx0cmVzdWx0ID0gY3Vyc29yLmZldGNoKClcclxuXHRcdGlmIGNvbXBvdW5kRmllbGRzLmxlbmd0aFxyXG5cdFx0XHRyZXN1bHQgPSByZXN1bHQubWFwIChpdGVtLGluZGV4KS0+XHJcblx0XHRcdFx0Xy5lYWNoIGNvbXBvdW5kRmllbGRzLCAoY29tcG91bmRGaWVsZEl0ZW0sIGluZGV4KS0+XHJcblx0XHRcdFx0XHRpdGVtS2V5ID0gY29tcG91bmRGaWVsZEl0ZW0ubmFtZSArIFwiKiUqXCIgKyBjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleS5yZXBsYWNlKC9cXC4vZywgXCIqJSpcIilcclxuXHRcdFx0XHRcdGl0ZW1WYWx1ZSA9IGl0ZW1bY29tcG91bmRGaWVsZEl0ZW0ubmFtZV1cclxuXHRcdFx0XHRcdHR5cGUgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC50eXBlXHJcblx0XHRcdFx0XHRpZiBbXCJsb29rdXBcIiwgXCJtYXN0ZXJfZGV0YWlsXCJdLmluZGV4T2YodHlwZSkgPiAtMVxyXG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5yZWZlcmVuY2VfdG9cclxuXHRcdFx0XHRcdFx0Y29tcG91bmRGaWx0ZXJGaWVsZHMgPSB7fVxyXG5cdFx0XHRcdFx0XHRjb21wb3VuZEZpbHRlckZpZWxkc1tjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV0gPSAxXHJcblx0XHRcdFx0XHRcdHJlZmVyZW5jZUl0ZW0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvKS5maW5kT25lIHtfaWQ6IGl0ZW1WYWx1ZX0sIGZpZWxkczogY29tcG91bmRGaWx0ZXJGaWVsZHNcclxuXHRcdFx0XHRcdFx0aWYgcmVmZXJlbmNlSXRlbVxyXG5cdFx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSByZWZlcmVuY2VJdGVtW2NvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5XVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiB0eXBlID09IFwic2VsZWN0XCJcclxuXHRcdFx0XHRcdFx0b3B0aW9ucyA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLm9wdGlvbnNcclxuXHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IF8uZmluZFdoZXJlKG9wdGlvbnMsIHt2YWx1ZTogaXRlbVZhbHVlfSk/LmxhYmVsIG9yIGl0ZW1WYWx1ZVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gaXRlbVZhbHVlXHJcblx0XHRcdFx0XHR1bmxlc3MgaXRlbVtpdGVtS2V5XVxyXG5cdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gXCItLVwiXHJcblx0XHRcdFx0cmV0dXJuIGl0ZW1cclxuXHRcdFx0cmV0dXJuIHJlc3VsdFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gcmVzdWx0XHJcblxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gICdyZXBvcnRfZGF0YSc6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY29tcG91bmRGaWVsZHMsIGN1cnNvciwgZmllbGRzLCBmaWx0ZXJGaWVsZHMsIGZpbHRlcl9zY29wZSwgZmlsdGVycywgb2JqZWN0RmllbGRzLCBvYmplY3RfbmFtZSwgcmVmLCByZXN1bHQsIHNlbGVjdG9yLCBzcGFjZSwgdXNlcklkO1xuICAgIGNoZWNrKG9wdGlvbnMsIE9iamVjdCk7XG4gICAgc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICAgIGZpZWxkcyA9IG9wdGlvbnMuZmllbGRzO1xuICAgIG9iamVjdF9uYW1lID0gb3B0aW9ucy5vYmplY3RfbmFtZTtcbiAgICBmaWx0ZXJfc2NvcGUgPSBvcHRpb25zLmZpbHRlcl9zY29wZTtcbiAgICBmaWx0ZXJzID0gb3B0aW9ucy5maWx0ZXJzO1xuICAgIGZpbHRlckZpZWxkcyA9IHt9O1xuICAgIGNvbXBvdW5kRmllbGRzID0gW107XG4gICAgb2JqZWN0RmllbGRzID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDA7XG4gICAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgIHZhciBjaGlsZEtleSwgbmFtZSwgb2JqZWN0RmllbGQsIHNwbGl0cztcbiAgICAgIHNwbGl0cyA9IGl0ZW0uc3BsaXQoXCIuXCIpO1xuICAgICAgbmFtZSA9IHNwbGl0c1swXTtcbiAgICAgIG9iamVjdEZpZWxkID0gb2JqZWN0RmllbGRzW25hbWVdO1xuICAgICAgaWYgKHNwbGl0cy5sZW5ndGggPiAxICYmIG9iamVjdEZpZWxkKSB7XG4gICAgICAgIGNoaWxkS2V5ID0gaXRlbS5yZXBsYWNlKG5hbWUgKyBcIi5cIiwgXCJcIik7XG4gICAgICAgIGNvbXBvdW5kRmllbGRzLnB1c2goe1xuICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgY2hpbGRLZXk6IGNoaWxkS2V5LFxuICAgICAgICAgIGZpZWxkOiBvYmplY3RGaWVsZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmaWx0ZXJGaWVsZHNbbmFtZV0gPSAxO1xuICAgIH0pO1xuICAgIHNlbGVjdG9yID0ge307XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZTtcbiAgICBpZiAoZmlsdGVyX3Njb3BlID09PSBcInNwYWNleFwiKSB7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHtcbiAgICAgICAgJGluOiBbbnVsbCwgc3BhY2VdXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyX3Njb3BlID09PSBcIm1pbmVcIikge1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgfVxuICAgIGlmIChDcmVhdG9yLmlzQ29tbW9uU3BhY2Uoc3BhY2UpICYmIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlLCB0aGlzLnVzZXJJZCkpIHtcbiAgICAgIGRlbGV0ZSBzZWxlY3Rvci5zcGFjZTtcbiAgICB9XG4gICAgaWYgKGZpbHRlcnMgJiYgZmlsdGVycy5sZW5ndGggPiAwKSB7XG4gICAgICBzZWxlY3RvcltcIiRhbmRcIl0gPSBmaWx0ZXJzO1xuICAgIH1cbiAgICBjdXJzb3IgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IsIHtcbiAgICAgIGZpZWxkczogZmlsdGVyRmllbGRzLFxuICAgICAgc2tpcDogMCxcbiAgICAgIGxpbWl0OiAxMDAwMFxuICAgIH0pO1xuICAgIHJlc3VsdCA9IGN1cnNvci5mZXRjaCgpO1xuICAgIGlmIChjb21wb3VuZEZpZWxkcy5sZW5ndGgpIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5tYXAoZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgXy5lYWNoKGNvbXBvdW5kRmllbGRzLCBmdW5jdGlvbihjb21wb3VuZEZpZWxkSXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICB2YXIgY29tcG91bmRGaWx0ZXJGaWVsZHMsIGl0ZW1LZXksIGl0ZW1WYWx1ZSwgcmVmMSwgcmVmZXJlbmNlSXRlbSwgcmVmZXJlbmNlX3RvLCB0eXBlO1xuICAgICAgICAgIGl0ZW1LZXkgPSBjb21wb3VuZEZpZWxkSXRlbS5uYW1lICsgXCIqJSpcIiArIGNvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5LnJlcGxhY2UoL1xcLi9nLCBcIiolKlwiKTtcbiAgICAgICAgICBpdGVtVmFsdWUgPSBpdGVtW2NvbXBvdW5kRmllbGRJdGVtLm5hbWVdO1xuICAgICAgICAgIHR5cGUgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC50eXBlO1xuICAgICAgICAgIGlmIChbXCJsb29rdXBcIiwgXCJtYXN0ZXJfZGV0YWlsXCJdLmluZGV4T2YodHlwZSkgPiAtMSkge1xuICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgY29tcG91bmRGaWx0ZXJGaWVsZHMgPSB7fTtcbiAgICAgICAgICAgIGNvbXBvdW5kRmlsdGVyRmllbGRzW2NvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5XSA9IDE7XG4gICAgICAgICAgICByZWZlcmVuY2VJdGVtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bykuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogaXRlbVZhbHVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczogY29tcG91bmRGaWx0ZXJGaWVsZHNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZUl0ZW0pIHtcbiAgICAgICAgICAgICAgaXRlbVtpdGVtS2V5XSA9IHJlZmVyZW5jZUl0ZW1bY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgICAgICAgb3B0aW9ucyA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLm9wdGlvbnM7XG4gICAgICAgICAgICBpdGVtW2l0ZW1LZXldID0gKChyZWYxID0gXy5maW5kV2hlcmUob3B0aW9ucywge1xuICAgICAgICAgICAgICB2YWx1ZTogaXRlbVZhbHVlXG4gICAgICAgICAgICB9KSkgIT0gbnVsbCA/IHJlZjEubGFiZWwgOiB2b2lkIDApIHx8IGl0ZW1WYWx1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXRlbVtpdGVtS2V5XSA9IGl0ZW1WYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFpdGVtW2l0ZW1LZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbVtpdGVtS2V5XSA9IFwiLS1cIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH1cbn0pO1xuIiwiIyMjXHJcbiAgICB0eXBlOiBcInVzZXJcIlxyXG4gICAgb2JqZWN0X25hbWU6IFwib2JqZWN0X2xpc3R2aWV3c1wiXHJcbiAgICByZWNvcmRfaWQ6IFwie29iamVjdF9uYW1lfSx7bGlzdHZpZXdfaWR9XCJcclxuICAgIHNldHRpbmdzOlxyXG4gICAgICAgIGNvbHVtbl93aWR0aDogeyBmaWVsZF9hOiAxMDAsIGZpZWxkXzI6IDE1MCB9XHJcbiAgICAgICAgc29ydDogW1tcImZpZWxkX2FcIiwgXCJkZXNjXCJdXVxyXG4gICAgb3duZXI6IHt1c2VySWR9XHJcbiMjI1xyXG5cclxuTWV0ZW9yLm1ldGhvZHNcclxuICAgIFwidGFidWxhcl9zb3J0X3NldHRpbmdzXCI6IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBzb3J0KS0+XHJcbiAgICAgICAgdXNlcklkID0gdGhpcy51c2VySWRcclxuICAgICAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsIG93bmVyOiB1c2VySWR9KVxyXG4gICAgICAgIGlmIHNldHRpbmdcclxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LnNvcnRcIjogc29ydH19KVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZG9jID0gXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInVzZXJcIlxyXG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXHJcbiAgICAgICAgICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge31cclxuICAgICAgICAgICAgICAgIG93bmVyOiB1c2VySWRcclxuXHJcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge31cclxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnRcclxuXHJcbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYylcclxuXHJcbiAgICBcInRhYnVsYXJfY29sdW1uX3dpZHRoX3NldHRpbmdzXCI6IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5fd2lkdGgpLT5cclxuICAgICAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxyXG4gICAgICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIiwgb3duZXI6IHVzZXJJZH0pXHJcbiAgICAgICAgaWYgc2V0dGluZ1xyXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uY29sdW1uX3dpZHRoXCI6IGNvbHVtbl93aWR0aH19KVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZG9jID0gXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInVzZXJcIlxyXG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXHJcbiAgICAgICAgICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge31cclxuICAgICAgICAgICAgICAgIG93bmVyOiB1c2VySWRcclxuXHJcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge31cclxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoXHJcblxyXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpXHJcblxyXG4gICAgXCJncmlkX3NldHRpbmdzXCI6IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5fd2lkdGgsIHNvcnQpLT5cclxuICAgICAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxyXG4gICAgICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIiwgb3duZXI6IHVzZXJJZH0pXHJcbiAgICAgICAgaWYgc2V0dGluZ1xyXG4gICAgICAgICAgICAjIOavj+asoemDveW8uuWItuaUueWPmF9pZF9hY3Rpb25z5YiX55qE5a695bqm77yM5Lul6Kej5Yaz5b2T55So5oi35Y+q5pS55Y+Y5a2X5q615qyh5bqP6ICM5rKh5pyJ5pS55Y+Y5Lu75L2V5a2X5q615a695bqm5pe277yM5YmN56uv5rKh5pyJ6K6i6ZiF5Yiw5a2X5q615qyh5bqP5Y+Y5pu055qE5pWw5o2u55qE6Zeu6aKYXHJcbiAgICAgICAgICAgIGNvbHVtbl93aWR0aC5faWRfYWN0aW9ucyA9IGlmIHNldHRpbmcuc2V0dGluZ3NbXCIje2xpc3Rfdmlld19pZH1cIl0/LmNvbHVtbl93aWR0aD8uX2lkX2FjdGlvbnMgPT0gNDYgdGhlbiA0NyBlbHNlIDQ2XHJcbiAgICAgICAgICAgIGlmIHNvcnRcclxuICAgICAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5zb3J0XCI6IHNvcnQsIFwic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LmNvbHVtbl93aWR0aFwiOiBjb2x1bW5fd2lkdGh9fSlcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LmNvbHVtbl93aWR0aFwiOiBjb2x1bW5fd2lkdGh9fSlcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGRvYyA9XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInVzZXJcIlxyXG4gICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXHJcbiAgICAgICAgICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge31cclxuICAgICAgICAgICAgICAgIG93bmVyOiB1c2VySWRcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge31cclxuICAgICAgICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoXHJcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0XHJcblxyXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpIiwiXG4vKlxuICAgIHR5cGU6IFwidXNlclwiXG4gICAgb2JqZWN0X25hbWU6IFwib2JqZWN0X2xpc3R2aWV3c1wiXG4gICAgcmVjb3JkX2lkOiBcIntvYmplY3RfbmFtZX0se2xpc3R2aWV3X2lkfVwiXG4gICAgc2V0dGluZ3M6XG4gICAgICAgIGNvbHVtbl93aWR0aDogeyBmaWVsZF9hOiAxMDAsIGZpZWxkXzI6IDE1MCB9XG4gICAgICAgIHNvcnQ6IFtbXCJmaWVsZF9hXCIsIFwiZGVzY1wiXV1cbiAgICBvd25lcjoge3VzZXJJZH1cbiAqL1xuTWV0ZW9yLm1ldGhvZHMoe1xuICBcInRhYnVsYXJfc29ydF9zZXR0aW5nc1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBzb3J0KSB7XG4gICAgdmFyIGRvYywgb2JqLCBzZXR0aW5nLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgb3duZXI6IHVzZXJJZFxuICAgIH0pO1xuICAgIGlmIChzZXR0aW5nKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IChcbiAgICAgICAgICBvYmogPSB7fSxcbiAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLnNvcnRcIl0gPSBzb3J0LFxuICAgICAgICAgIG9ialxuICAgICAgICApXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jID0ge1xuICAgICAgICB0eXBlOiBcInVzZXJcIixcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgICBzZXR0aW5nczoge30sXG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH07XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnQ7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH0sXG4gIFwidGFidWxhcl9jb2x1bW5fd2lkdGhfc2V0dGluZ3NcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoKSB7XG4gICAgdmFyIGRvYywgb2JqLCBzZXR0aW5nLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLFxuICAgICAgb3duZXI6IHVzZXJJZFxuICAgIH0pO1xuICAgIGlmIChzZXR0aW5nKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IChcbiAgICAgICAgICBvYmogPSB7fSxcbiAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLmNvbHVtbl93aWR0aFwiXSA9IGNvbHVtbl93aWR0aCxcbiAgICAgICAgICBvYmpcbiAgICAgICAgKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYyA9IHtcbiAgICAgICAgdHlwZTogXCJ1c2VyXCIsXG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgICAgc2V0dGluZ3M6IHt9LFxuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aDtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpO1xuICAgIH1cbiAgfSxcbiAgXCJncmlkX3NldHRpbmdzXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbl93aWR0aCwgc29ydCkge1xuICAgIHZhciBkb2MsIG9iaiwgb2JqMSwgcmVmLCByZWYxLCBzZXR0aW5nLCB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiLFxuICAgICAgb3duZXI6IHVzZXJJZFxuICAgIH0pO1xuICAgIGlmIChzZXR0aW5nKSB7XG4gICAgICBjb2x1bW5fd2lkdGguX2lkX2FjdGlvbnMgPSAoKHJlZiA9IHNldHRpbmcuc2V0dGluZ3NbXCJcIiArIGxpc3Rfdmlld19pZF0pICE9IG51bGwgPyAocmVmMSA9IHJlZi5jb2x1bW5fd2lkdGgpICE9IG51bGwgPyByZWYxLl9pZF9hY3Rpb25zIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gNDYgPyA0NyA6IDQ2O1xuICAgICAgaWYgKHNvcnQpIHtcbiAgICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgICBvYmogPSB7fSxcbiAgICAgICAgICAgIG9ialtcInNldHRpbmdzLlwiICsgbGlzdF92aWV3X2lkICsgXCIuc29ydFwiXSA9IHNvcnQsXG4gICAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLmNvbHVtbl93aWR0aFwiXSA9IGNvbHVtbl93aWR0aCxcbiAgICAgICAgICAgIG9ialxuICAgICAgICAgIClcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe1xuICAgICAgICAgIF9pZDogc2V0dGluZy5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IChcbiAgICAgICAgICAgIG9iajEgPSB7fSxcbiAgICAgICAgICAgIG9iajFbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLmNvbHVtbl93aWR0aFwiXSA9IGNvbHVtbl93aWR0aCxcbiAgICAgICAgICAgIG9iajFcbiAgICAgICAgICApXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2MgPSB7XG4gICAgICAgIHR5cGU6IFwidXNlclwiLFxuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCIsXG4gICAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge307XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5jb2x1bW5fd2lkdGggPSBjb2x1bW5fd2lkdGg7XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydDtcbiAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpO1xuICAgIH1cbiAgfVxufSk7XG4iLCJ4bWwyanMgPSByZXF1aXJlICd4bWwyanMnXHJcbmZzID0gcmVxdWlyZSAnZnMnXHJcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xyXG5ta2RpcnAgPSByZXF1aXJlICdta2RpcnAnXHJcblxyXG5sb2dnZXIgPSBuZXcgTG9nZ2VyICdFeHBvcnRfVE9fWE1MJ1xyXG5cclxuX3dyaXRlWG1sRmlsZSA9IChqc29uT2JqLG9iak5hbWUpIC0+XHJcblx0IyDovax4bWxcclxuXHRidWlsZGVyID0gbmV3IHhtbDJqcy5CdWlsZGVyKClcclxuXHR4bWwgPSBidWlsZGVyLmJ1aWxkT2JqZWN0IGpzb25PYmpcclxuXHJcblx0IyDovazkuLpidWZmZXJcclxuXHRzdHJlYW0gPSBuZXcgQnVmZmVyIHhtbFxyXG5cclxuXHQjIOagueaNruW9k+WkqeaXtumXtOeahOW5tOaciOaXpeS9nOS4uuWtmOWCqOi3r+W+hFxyXG5cdG5vdyA9IG5ldyBEYXRlXHJcblx0eWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXHJcblx0bW9udGggPSBub3cuZ2V0TW9udGgoKSArIDFcclxuXHRkYXkgPSBub3cuZ2V0RGF0ZSgpXHJcblxyXG5cdCMg5paH5Lu26Lev5b6EXHJcblx0ZmlsZVBhdGggPSBwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCcuLi8uLi8uLi9leHBvcnQvJyArIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGRheSArICcvJyArIG9iak5hbWUgKVxyXG5cdGZpbGVOYW1lID0ganNvbk9iaj8uX2lkICsgXCIueG1sXCJcclxuXHRmaWxlQWRkcmVzcyA9IHBhdGguam9pbiBmaWxlUGF0aCwgZmlsZU5hbWVcclxuXHJcblx0aWYgIWZzLmV4aXN0c1N5bmMgZmlsZVBhdGhcclxuXHRcdG1rZGlycC5zeW5jIGZpbGVQYXRoXHJcblxyXG5cdCMg5YaZ5YWl5paH5Lu2XHJcblx0ZnMud3JpdGVGaWxlIGZpbGVBZGRyZXNzLCBzdHJlYW0sIChlcnIpIC0+XHJcblx0XHRpZiBlcnJcclxuXHRcdFx0bG9nZ2VyLmVycm9yIFwiI3tqc29uT2JqLl9pZH3lhpnlhaV4bWzmlofku7blpLHotKVcIixlcnJcclxuXHRcclxuXHRyZXR1cm4gZmlsZVBhdGhcclxuXHJcblxyXG4jIOaVtOeQhkZpZWxkc+eahGpzb27mlbDmja5cclxuX21peEZpZWxkc0RhdGEgPSAob2JqLG9iak5hbWUpIC0+XHJcblx0IyDliJ3lp4vljJblr7nosaHmlbDmja5cclxuXHRqc29uT2JqID0ge31cclxuXHQjIOiOt+WPlmZpZWxkc1xyXG5cdG9iakZpZWxkcyA9IENyZWF0b3I/LmdldE9iamVjdChvYmpOYW1lKT8uZmllbGRzXHJcblxyXG5cdG1peERlZmF1bHQgPSAoZmllbGRfbmFtZSktPlxyXG5cdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IG9ialtmaWVsZF9uYW1lXSB8fCBcIlwiXHJcblxyXG5cdG1peERhdGUgPSAoZmllbGRfbmFtZSx0eXBlKS0+XHJcblx0XHRkYXRlID0gb2JqW2ZpZWxkX25hbWVdXHJcblx0XHRpZiB0eXBlID09IFwiZGF0ZVwiXHJcblx0XHRcdGZvcm1hdCA9IFwiWVlZWS1NTS1ERFwiXHJcblx0XHRlbHNlXHJcblx0XHRcdGZvcm1hdCA9IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiXHJcblx0XHRpZiBkYXRlPyBhbmQgZm9ybWF0P1xyXG5cdFx0XHRkYXRlU3RyID0gbW9tZW50KGRhdGUpLmZvcm1hdChmb3JtYXQpXHJcblx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gZGF0ZVN0ciB8fCBcIlwiXHJcblxyXG5cdG1peEJvb2wgPSAoZmllbGRfbmFtZSktPlxyXG5cdFx0aWYgb2JqW2ZpZWxkX25hbWVdID09IHRydWVcclxuXHRcdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5pivXCJcclxuXHRcdGVsc2UgaWYgb2JqW2ZpZWxkX25hbWVdID09IGZhbHNlXHJcblx0XHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuWQplwiXHJcblx0XHRlbHNlXHJcblx0XHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIlwiXHJcblxyXG5cdCMg5b6q546v5q+P5LiqZmllbGRzLOW5tuWIpOaWreWPluWAvFxyXG5cdF8uZWFjaCBvYmpGaWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG5cdFx0c3dpdGNoIGZpZWxkPy50eXBlXHJcblx0XHRcdHdoZW4gXCJkYXRlXCIsXCJkYXRldGltZVwiIHRoZW4gbWl4RGF0ZSBmaWVsZF9uYW1lLGZpZWxkLnR5cGVcclxuXHRcdFx0d2hlbiBcImJvb2xlYW5cIiB0aGVuIG1peEJvb2wgZmllbGRfbmFtZVxyXG5cdFx0XHRlbHNlIG1peERlZmF1bHQgZmllbGRfbmFtZVxyXG5cclxuXHRyZXR1cm4ganNvbk9ialxyXG5cclxuIyDojrflj5blrZDooajmlbTnkIbmlbDmja5cclxuX21peFJlbGF0ZWREYXRhID0gKG9iaixvYmpOYW1lKSAtPlxyXG5cdCMg5Yid5aeL5YyW5a+56LGh5pWw5o2uXHJcblx0cmVsYXRlZF9vYmplY3RzID0ge31cclxuXHJcblx0IyDojrflj5bnm7jlhbPooahcclxuXHRyZWxhdGVkT2JqTmFtZXMgPSBDcmVhdG9yPy5nZXRBbGxSZWxhdGVkT2JqZWN0cyBvYmpOYW1lXHJcblxyXG5cdCMg5b6q546v55u45YWz6KGoXHJcblx0cmVsYXRlZE9iak5hbWVzLmZvckVhY2ggKHJlbGF0ZWRPYmpOYW1lKSAtPlxyXG5cdFx0IyDmr4/kuKrooajlrprkuYnkuIDkuKrlr7nosaHmlbDnu4RcclxuXHRcdHJlbGF0ZWRUYWJsZURhdGEgPSBbXVxyXG5cclxuXHRcdCMgKuiuvue9ruWFs+iBlOaQnOe0ouafpeivoueahOWtl+autVxyXG5cdFx0IyDpmYTku7bnmoTlhbPogZTmkJzntKLlrZfmrrXmmK/lrprmrbvnmoRcclxuXHRcdGlmIHJlbGF0ZWRPYmpOYW1lID09IFwiY21zX2ZpbGVzXCJcclxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gXCJwYXJlbnQuaWRzXCJcclxuXHRcdGVsc2VcclxuXHRcdFx0IyDojrflj5ZmaWVsZHNcclxuXHRcdFx0ZmllbGRzID0gQ3JlYXRvcj8uT2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0/LmZpZWxkc1xyXG5cdFx0XHQjIOW+queOr+avj+S4qmZpZWxkLOaJvuWHunJlZmVyZW5jZV90b+eahOWFs+iBlOWtl+autVxyXG5cdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSBcIlwiXHJcblx0XHRcdF8uZWFjaCBmaWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG5cdFx0XHRcdGlmIGZpZWxkPy5yZWZlcmVuY2VfdG8gPT0gb2JqTmFtZVxyXG5cdFx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gZmllbGRfbmFtZVxyXG5cclxuXHRcdCMg5qC55o2u5om+5Ye655qE5YWz6IGU5a2X5q6177yM5p+l5a2Q6KGo5pWw5o2uXHJcblx0XHRpZiByZWxhdGVkX2ZpZWxkX25hbWVcclxuXHRcdFx0cmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iak5hbWUpXHJcblx0XHRcdCMg6I635Y+W5Yiw5omA5pyJ55qE5pWw5o2uXHJcblx0XHRcdHJlbGF0ZWRSZWNvcmRMaXN0ID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZCh7XCIje3JlbGF0ZWRfZmllbGRfbmFtZX1cIjpvYmouX2lkfSkuZmV0Y2goKVxyXG5cdFx0XHQjIOW+queOr+avj+S4gOadoeaVsOaNrlxyXG5cdFx0XHRyZWxhdGVkUmVjb3JkTGlzdC5mb3JFYWNoIChyZWxhdGVkT2JqKS0+XHJcblx0XHRcdFx0IyDmlbTlkIhmaWVsZHPmlbDmja5cclxuXHRcdFx0XHRmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEgcmVsYXRlZE9iaixyZWxhdGVkT2JqTmFtZVxyXG5cdFx0XHRcdCMg5oqK5LiA5p2h6K6w5b2V5o+S5YWl5Yiw5a+56LGh5pWw57uE5LitXHJcblx0XHRcdFx0cmVsYXRlZFRhYmxlRGF0YS5wdXNoIGZpZWxkc0RhdGFcclxuXHJcblx0XHQjIOaKiuS4gOS4quWtkOihqOeahOaJgOacieaVsOaNruaPkuWFpeWIsHJlbGF0ZWRfb2JqZWN0c+S4re+8jOWGjeW+queOr+S4i+S4gOS4qlxyXG5cdFx0cmVsYXRlZF9vYmplY3RzW3JlbGF0ZWRPYmpOYW1lXSA9IHJlbGF0ZWRUYWJsZURhdGFcclxuXHJcblx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xyXG5cclxuIyBDcmVhdG9yLkV4cG9ydDJ4bWwoKVxyXG5DcmVhdG9yLkV4cG9ydDJ4bWwgPSAob2JqTmFtZSwgcmVjb3JkTGlzdCkgLT5cclxuXHRsb2dnZXIuaW5mbyBcIlJ1biBDcmVhdG9yLkV4cG9ydDJ4bWxcIlxyXG5cclxuXHRjb25zb2xlLnRpbWUgXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIlxyXG5cclxuXHQjIOa1i+ivleaVsOaNrlxyXG5cdCMgb2JqTmFtZSA9IFwiYXJjaGl2ZV9yZWNvcmRzXCJcclxuXHJcblx0IyDmn6Xmib7lr7nosaHmlbDmja5cclxuXHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iak5hbWUpXHJcblx0IyDmtYvor5XmlbDmja5cclxuXHRyZWNvcmRMaXN0ID0gY29sbGVjdGlvbi5maW5kKHt9KS5mZXRjaCgpXHJcblxyXG5cdHJlY29yZExpc3QuZm9yRWFjaCAocmVjb3JkT2JqKS0+XHJcblx0XHRqc29uT2JqID0ge31cclxuXHRcdGpzb25PYmouX2lkID0gcmVjb3JkT2JqLl9pZFxyXG5cclxuXHRcdCMg5pW055CG5Li76KGo55qERmllbGRz5pWw5o2uXHJcblx0XHRmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEgcmVjb3JkT2JqLG9iak5hbWVcclxuXHRcdGpzb25PYmpbb2JqTmFtZV0gPSBmaWVsZHNEYXRhXHJcblxyXG5cdFx0IyDmlbTnkIbnm7jlhbPooajmlbDmja5cclxuXHRcdHJlbGF0ZWRfb2JqZWN0cyA9IF9taXhSZWxhdGVkRGF0YSByZWNvcmRPYmosb2JqTmFtZVxyXG5cclxuXHRcdGpzb25PYmpbXCJyZWxhdGVkX29iamVjdHNcIl0gPSByZWxhdGVkX29iamVjdHNcclxuXHJcblx0XHQjIOi9rOS4unhtbOS/neWtmOaWh+S7tlxyXG5cdFx0ZmlsZVBhdGggPSBfd3JpdGVYbWxGaWxlIGpzb25PYmosb2JqTmFtZVxyXG5cclxuXHRjb25zb2xlLnRpbWVFbmQgXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIlxyXG5cdHJldHVybiBmaWxlUGF0aCIsInZhciBfbWl4RmllbGRzRGF0YSwgX21peFJlbGF0ZWREYXRhLCBfd3JpdGVYbWxGaWxlLCBmcywgbG9nZ2VyLCBta2RpcnAsIHBhdGgsIHhtbDJqcztcblxueG1sMmpzID0gcmVxdWlyZSgneG1sMmpzJyk7XG5cbmZzID0gcmVxdWlyZSgnZnMnKTtcblxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxubWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJyk7XG5cbmxvZ2dlciA9IG5ldyBMb2dnZXIoJ0V4cG9ydF9UT19YTUwnKTtcblxuX3dyaXRlWG1sRmlsZSA9IGZ1bmN0aW9uKGpzb25PYmosIG9iak5hbWUpIHtcbiAgdmFyIGJ1aWxkZXIsIGRheSwgZmlsZUFkZHJlc3MsIGZpbGVOYW1lLCBmaWxlUGF0aCwgbW9udGgsIG5vdywgc3RyZWFtLCB4bWwsIHllYXI7XG4gIGJ1aWxkZXIgPSBuZXcgeG1sMmpzLkJ1aWxkZXIoKTtcbiAgeG1sID0gYnVpbGRlci5idWlsZE9iamVjdChqc29uT2JqKTtcbiAgc3RyZWFtID0gbmV3IEJ1ZmZlcih4bWwpO1xuICBub3cgPSBuZXcgRGF0ZTtcbiAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMTtcbiAgZGF5ID0gbm93LmdldERhdGUoKTtcbiAgZmlsZVBhdGggPSBwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCAnLi4vLi4vLi4vZXhwb3J0LycgKyB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBkYXkgKyAnLycgKyBvYmpOYW1lKTtcbiAgZmlsZU5hbWUgPSAoanNvbk9iaiAhPSBudWxsID8ganNvbk9iai5faWQgOiB2b2lkIDApICsgXCIueG1sXCI7XG4gIGZpbGVBZGRyZXNzID0gcGF0aC5qb2luKGZpbGVQYXRoLCBmaWxlTmFtZSk7XG4gIGlmICghZnMuZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcbiAgICBta2RpcnAuc3luYyhmaWxlUGF0aCk7XG4gIH1cbiAgZnMud3JpdGVGaWxlKGZpbGVBZGRyZXNzLCBzdHJlYW0sIGZ1bmN0aW9uKGVycikge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHJldHVybiBsb2dnZXIuZXJyb3IoanNvbk9iai5faWQgKyBcIuWGmeWFpXhtbOaWh+S7tuWksei0pVwiLCBlcnIpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmaWxlUGF0aDtcbn07XG5cbl9taXhGaWVsZHNEYXRhID0gZnVuY3Rpb24ob2JqLCBvYmpOYW1lKSB7XG4gIHZhciBqc29uT2JqLCBtaXhCb29sLCBtaXhEYXRlLCBtaXhEZWZhdWx0LCBvYmpGaWVsZHMsIHJlZjtcbiAganNvbk9iaiA9IHt9O1xuICBvYmpGaWVsZHMgPSB0eXBlb2YgQ3JlYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBDcmVhdG9yICE9PSBudWxsID8gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iak5hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgbWl4RGVmYXVsdCA9IGZ1bmN0aW9uKGZpZWxkX25hbWUpIHtcbiAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IG9ialtmaWVsZF9uYW1lXSB8fCBcIlwiO1xuICB9O1xuICBtaXhEYXRlID0gZnVuY3Rpb24oZmllbGRfbmFtZSwgdHlwZSkge1xuICAgIHZhciBkYXRlLCBkYXRlU3RyLCBmb3JtYXQ7XG4gICAgZGF0ZSA9IG9ialtmaWVsZF9uYW1lXTtcbiAgICBpZiAodHlwZSA9PT0gXCJkYXRlXCIpIHtcbiAgICAgIGZvcm1hdCA9IFwiWVlZWS1NTS1ERFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW06c3NcIjtcbiAgICB9XG4gICAgaWYgKChkYXRlICE9IG51bGwpICYmIChmb3JtYXQgIT0gbnVsbCkpIHtcbiAgICAgIGRhdGVTdHIgPSBtb21lbnQoZGF0ZSkuZm9ybWF0KGZvcm1hdCk7XG4gICAgfVxuICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gZGF0ZVN0ciB8fCBcIlwiO1xuICB9O1xuICBtaXhCb29sID0gZnVuY3Rpb24oZmllbGRfbmFtZSkge1xuICAgIGlmIChvYmpbZmllbGRfbmFtZV0gPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLmmK9cIjtcbiAgICB9IGVsc2UgaWYgKG9ialtmaWVsZF9uYW1lXSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLlkKZcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIlwiO1xuICAgIH1cbiAgfTtcbiAgXy5lYWNoKG9iakZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBzd2l0Y2ggKGZpZWxkICE9IG51bGwgPyBmaWVsZC50eXBlIDogdm9pZCAwKSB7XG4gICAgICBjYXNlIFwiZGF0ZVwiOlxuICAgICAgY2FzZSBcImRhdGV0aW1lXCI6XG4gICAgICAgIHJldHVybiBtaXhEYXRlKGZpZWxkX25hbWUsIGZpZWxkLnR5cGUpO1xuICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgcmV0dXJuIG1peEJvb2woZmllbGRfbmFtZSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbWl4RGVmYXVsdChmaWVsZF9uYW1lKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4ganNvbk9iajtcbn07XG5cbl9taXhSZWxhdGVkRGF0YSA9IGZ1bmN0aW9uKG9iaiwgb2JqTmFtZSkge1xuICB2YXIgcmVsYXRlZE9iak5hbWVzLCByZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IHt9O1xuICByZWxhdGVkT2JqTmFtZXMgPSB0eXBlb2YgQ3JlYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBDcmVhdG9yICE9PSBudWxsID8gQ3JlYXRvci5nZXRBbGxSZWxhdGVkT2JqZWN0cyhvYmpOYW1lKSA6IHZvaWQgMDtcbiAgcmVsYXRlZE9iak5hbWVzLmZvckVhY2goZnVuY3Rpb24ocmVsYXRlZE9iak5hbWUpIHtcbiAgICB2YXIgZmllbGRzLCBvYmoxLCByZWYsIHJlbGF0ZWRDb2xsZWN0aW9uLCByZWxhdGVkUmVjb3JkTGlzdCwgcmVsYXRlZFRhYmxlRGF0YSwgcmVsYXRlZF9maWVsZF9uYW1lO1xuICAgIHJlbGF0ZWRUYWJsZURhdGEgPSBbXTtcbiAgICBpZiAocmVsYXRlZE9iak5hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwicGFyZW50Lmlkc1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWVsZHMgPSB0eXBlb2YgQ3JlYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBDcmVhdG9yICE9PSBudWxsID8gKHJlZiA9IENyZWF0b3IuT2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0pICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gXCJcIjtcbiAgICAgIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgICAgIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnJlZmVyZW5jZV90byA6IHZvaWQgMCkgPT09IG9iak5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9maWVsZF9uYW1lID0gZmllbGRfbmFtZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChyZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgIHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmpOYW1lKTtcbiAgICAgIHJlbGF0ZWRSZWNvcmRMaXN0ID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZCgoXG4gICAgICAgIG9iajEgPSB7fSxcbiAgICAgICAgb2JqMVtcIlwiICsgcmVsYXRlZF9maWVsZF9uYW1lXSA9IG9iai5faWQsXG4gICAgICAgIG9iajFcbiAgICAgICkpLmZldGNoKCk7XG4gICAgICByZWxhdGVkUmVjb3JkTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHJlbGF0ZWRPYmopIHtcbiAgICAgICAgdmFyIGZpZWxkc0RhdGE7XG4gICAgICAgIGZpZWxkc0RhdGEgPSBfbWl4RmllbGRzRGF0YShyZWxhdGVkT2JqLCByZWxhdGVkT2JqTmFtZSk7XG4gICAgICAgIHJldHVybiByZWxhdGVkVGFibGVEYXRhLnB1c2goZmllbGRzRGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0gPSByZWxhdGVkVGFibGVEYXRhO1xuICB9KTtcbiAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbn07XG5cbkNyZWF0b3IuRXhwb3J0MnhtbCA9IGZ1bmN0aW9uKG9iak5hbWUsIHJlY29yZExpc3QpIHtcbiAgdmFyIGNvbGxlY3Rpb247XG4gIGxvZ2dlci5pbmZvKFwiUnVuIENyZWF0b3IuRXhwb3J0MnhtbFwiKTtcbiAgY29uc29sZS50aW1lKFwiQ3JlYXRvci5FeHBvcnQyeG1sXCIpO1xuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iak5hbWUpO1xuICByZWNvcmRMaXN0ID0gY29sbGVjdGlvbi5maW5kKHt9KS5mZXRjaCgpO1xuICByZWNvcmRMaXN0LmZvckVhY2goZnVuY3Rpb24ocmVjb3JkT2JqKSB7XG4gICAgdmFyIGZpZWxkc0RhdGEsIGZpbGVQYXRoLCBqc29uT2JqLCByZWxhdGVkX29iamVjdHM7XG4gICAganNvbk9iaiA9IHt9O1xuICAgIGpzb25PYmouX2lkID0gcmVjb3JkT2JqLl9pZDtcbiAgICBmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEocmVjb3JkT2JqLCBvYmpOYW1lKTtcbiAgICBqc29uT2JqW29iak5hbWVdID0gZmllbGRzRGF0YTtcbiAgICByZWxhdGVkX29iamVjdHMgPSBfbWl4UmVsYXRlZERhdGEocmVjb3JkT2JqLCBvYmpOYW1lKTtcbiAgICBqc29uT2JqW1wicmVsYXRlZF9vYmplY3RzXCJdID0gcmVsYXRlZF9vYmplY3RzO1xuICAgIHJldHVybiBmaWxlUGF0aCA9IF93cml0ZVhtbEZpbGUoanNvbk9iaiwgb2JqTmFtZSk7XG4gIH0pO1xuICBjb25zb2xlLnRpbWVFbmQoXCJDcmVhdG9yLkV4cG9ydDJ4bWxcIik7XG4gIHJldHVybiBmaWxlUGF0aDtcbn07XG4iLCJNZXRlb3IubWV0aG9kcyBcclxuXHRyZWxhdGVkX29iamVjdHNfcmVjb3JkczogKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCktPlxyXG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcclxuXHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXHJcblx0XHRcdHNlbGVjdG9yID0ge1wibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZH1cclxuXHRcdGVsc2VcclxuXHRcdFx0c2VsZWN0b3IgPSB7c3BhY2U6IHNwYWNlSWR9XHJcblx0XHRcclxuXHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxyXG5cdFx0XHQjIOmZhOS7tueahOWFs+iBlOaQnOe0ouadoeS7tuaYr+Wumuatu+eahFxyXG5cdFx0XHRzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWVcclxuXHRcdFx0c2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF1cclxuXHRcdGVsc2VcclxuXHRcdFx0c2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZFxyXG5cclxuXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXHJcblx0XHRpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLmFsbG93UmVhZFxyXG5cdFx0XHRzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxyXG5cdFx0XHJcblx0XHRyZWxhdGVkX3JlY29yZHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3RvcilcclxuXHRcdHJldHVybiByZWxhdGVkX3JlY29yZHMuY291bnQoKSIsIk1ldGVvci5tZXRob2RzKHtcbiAgcmVsYXRlZF9vYmplY3RzX3JlY29yZHM6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCkge1xuICAgIHZhciBwZXJtaXNzaW9ucywgcmVsYXRlZF9yZWNvcmRzLCBzZWxlY3RvciwgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICBcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWRcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIHNlbGVjdG9yW1wicGFyZW50Lm9cIl0gPSBvYmplY3RfbmFtZTtcbiAgICAgIHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3RvcltyZWxhdGVkX2ZpZWxkX25hbWVdID0gcmVjb3JkX2lkO1xuICAgIH1cbiAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgICBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLmFsbG93UmVhZCkge1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgfVxuICAgIHJlbGF0ZWRfcmVjb3JkcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVsYXRlZF9yZWNvcmRzLmNvdW50KCk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRnZXRQZW5kaW5nU3BhY2VJbmZvOiAoaW52aXRlcklkLCBzcGFjZUlkKS0+XHJcblx0XHRpbnZpdGVyTmFtZSA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogaW52aXRlcklkfSkubmFtZVxyXG5cdFx0c3BhY2VOYW1lID0gZGIuc3BhY2VzLmZpbmRPbmUoe19pZDogc3BhY2VJZH0pLm5hbWVcclxuXHJcblx0XHRyZXR1cm4ge2ludml0ZXI6IGludml0ZXJOYW1lLCBzcGFjZTogc3BhY2VOYW1lfVxyXG5cclxuXHRyZWZ1c2VKb2luU3BhY2U6IChfaWQpLT5cclxuXHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogX2lkfSx7JHNldDoge2ludml0ZV9zdGF0ZTogXCJyZWZ1c2VkXCJ9fSlcclxuXHJcblx0YWNjZXB0Sm9pblNwYWNlOiAoX2lkKS0+XHJcblx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IF9pZH0seyRzZXQ6IHtpbnZpdGVfc3RhdGU6IFwiYWNjZXB0ZWRcIiwgdXNlcl9hY2NlcHRlZDogdHJ1ZX19KVxyXG5cclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBnZXRQZW5kaW5nU3BhY2VJbmZvOiBmdW5jdGlvbihpbnZpdGVySWQsIHNwYWNlSWQpIHtcbiAgICB2YXIgaW52aXRlck5hbWUsIHNwYWNlTmFtZTtcbiAgICBpbnZpdGVyTmFtZSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBpbnZpdGVySWRcbiAgICB9KS5uYW1lO1xuICAgIHNwYWNlTmFtZSA9IGRiLnNwYWNlcy5maW5kT25lKHtcbiAgICAgIF9pZDogc3BhY2VJZFxuICAgIH0pLm5hbWU7XG4gICAgcmV0dXJuIHtcbiAgICAgIGludml0ZXI6IGludml0ZXJOYW1lLFxuICAgICAgc3BhY2U6IHNwYWNlTmFtZVxuICAgIH07XG4gIH0sXG4gIHJlZnVzZUpvaW5TcGFjZTogZnVuY3Rpb24oX2lkKSB7XG4gICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGludml0ZV9zdGF0ZTogXCJyZWZ1c2VkXCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgYWNjZXB0Sm9pblNwYWNlOiBmdW5jdGlvbihfaWQpIHtcbiAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IF9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgaW52aXRlX3N0YXRlOiBcImFjY2VwdGVkXCIsXG4gICAgICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IucHVibGlzaCBcImNyZWF0b3Jfb2JqZWN0X3JlY29yZFwiLCAob2JqZWN0X25hbWUsIGlkLCBzcGFjZV9pZCktPlxyXG5cdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKVxyXG5cdGlmIGNvbGxlY3Rpb25cclxuXHRcdHJldHVybiBjb2xsZWN0aW9uLmZpbmQoe19pZDogaWR9KVxyXG5cclxuIiwiTWV0ZW9yLnB1Ymxpc2goXCJjcmVhdG9yX29iamVjdF9yZWNvcmRcIiwgZnVuY3Rpb24ob2JqZWN0X25hbWUsIGlkLCBzcGFjZV9pZCkge1xuICB2YXIgY29sbGVjdGlvbjtcbiAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpO1xuICBpZiAoY29sbGVjdGlvbikge1xuICAgIHJldHVybiBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgX2lkOiBpZFxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoQ29tcG9zaXRlIFwic3RlZWRvc19vYmplY3RfdGFidWxhclwiLCAodGFibGVOYW1lLCBpZHMsIGZpZWxkcywgc3BhY2VJZCktPlxyXG5cdHVubGVzcyB0aGlzLnVzZXJJZFxyXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRjaGVjayh0YWJsZU5hbWUsIFN0cmluZyk7XHJcblx0Y2hlY2soaWRzLCBBcnJheSk7XHJcblx0Y2hlY2soZmllbGRzLCBNYXRjaC5PcHRpb25hbChPYmplY3QpKTtcclxuXHJcblx0X29iamVjdF9uYW1lID0gdGFibGVOYW1lLnJlcGxhY2UoXCJjcmVhdG9yX1wiLFwiXCIpXHJcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9vYmplY3RfbmFtZSwgc3BhY2VJZClcclxuXHJcblx0aWYgc3BhY2VJZFxyXG5cdFx0X29iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRPYmplY3ROYW1lKF9vYmplY3QpXHJcblxyXG5cdG9iamVjdF9jb2xsZWNpdG9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKF9vYmplY3RfbmFtZSlcclxuXHJcblxyXG5cdF9maWVsZHMgPSBfb2JqZWN0Py5maWVsZHNcclxuXHRpZiAhX2ZpZWxkcyB8fCAhb2JqZWN0X2NvbGxlY2l0b25cclxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0cmVmZXJlbmNlX2ZpZWxkcyA9IF8uZmlsdGVyIF9maWVsZHMsIChmKS0+XHJcblx0XHRyZXR1cm4gXy5pc0Z1bmN0aW9uKGYucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KGYucmVmZXJlbmNlX3RvKVxyXG5cclxuXHRzZWxmID0gdGhpc1xyXG5cclxuXHRzZWxmLnVuYmxvY2soKTtcclxuXHJcblx0aWYgcmVmZXJlbmNlX2ZpZWxkcy5sZW5ndGggPiAwXHJcblx0XHRkYXRhID0ge1xyXG5cdFx0XHRmaW5kOiAoKS0+XHJcblx0XHRcdFx0c2VsZi51bmJsb2NrKCk7XHJcblx0XHRcdFx0ZmllbGRfa2V5cyA9IHt9XHJcblx0XHRcdFx0Xy5lYWNoIF8ua2V5cyhmaWVsZHMpLCAoZiktPlxyXG5cdFx0XHRcdFx0dW5sZXNzIC9cXHcrKFxcLlxcJCl7MX1cXHc/Ly50ZXN0KGYpXHJcblx0XHRcdFx0XHRcdGZpZWxkX2tleXNbZl0gPSAxXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0cmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe19pZDogeyRpbjogaWRzfX0sIHtmaWVsZHM6IGZpZWxkX2tleXN9KTtcclxuXHRcdH1cclxuXHJcblx0XHRkYXRhLmNoaWxkcmVuID0gW11cclxuXHJcblx0XHRrZXlzID0gXy5rZXlzKGZpZWxkcylcclxuXHJcblx0XHRpZiBrZXlzLmxlbmd0aCA8IDFcclxuXHRcdFx0a2V5cyA9IF8ua2V5cyhfZmllbGRzKVxyXG5cclxuXHRcdF9rZXlzID0gW11cclxuXHJcblx0XHRrZXlzLmZvckVhY2ggKGtleSktPlxyXG5cdFx0XHRpZiBfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddXHJcblx0XHRcdFx0X2tleXMgPSBfa2V5cy5jb25jYXQoXy5tYXAoX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXSwgKGspLT5cclxuXHRcdFx0XHRcdHJldHVybiBrZXkgKyAnLicgKyBrXHJcblx0XHRcdFx0KSlcclxuXHRcdFx0X2tleXMucHVzaChrZXkpXHJcblxyXG5cdFx0X2tleXMuZm9yRWFjaCAoa2V5KS0+XHJcblx0XHRcdHJlZmVyZW5jZV9maWVsZCA9IF9maWVsZHNba2V5XVxyXG5cclxuXHRcdFx0aWYgcmVmZXJlbmNlX2ZpZWxkICYmIChfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykgfHwgIV8uaXNFbXB0eShyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSkgICMgYW5kIENyZWF0b3IuQ29sbGVjdGlvbnNbcmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90b11cclxuXHRcdFx0XHRkYXRhLmNoaWxkcmVuLnB1c2gge1xyXG5cdFx0XHRcdFx0ZmluZDogKHBhcmVudCkgLT5cclxuXHRcdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdFx0c2VsZi51bmJsb2NrKCk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHF1ZXJ5ID0ge31cclxuXHJcblx0XHRcdFx0XHRcdFx0IyDooajmoLzlrZDlrZfmrrXnibnmrorlpITnkIZcclxuXHRcdFx0XHRcdFx0XHRpZiAvXFx3KyhcXC5cXCRcXC4pezF9XFx3Ky8udGVzdChrZXkpXHJcblx0XHRcdFx0XHRcdFx0XHRwX2sgPSBrZXkucmVwbGFjZSgvKFxcdyspXFwuXFwkXFwuXFx3Ky9pZywgXCIkMVwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0c19rID0ga2V5LnJlcGxhY2UoL1xcdytcXC5cXCRcXC4oXFx3KykvaWcsIFwiJDFcIilcclxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV9pZHMgPSBwYXJlbnRbcF9rXS5nZXRQcm9wZXJ0eShzX2spXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX2lkcyA9IGtleS5zcGxpdCgnLicpLnJlZHVjZSAobywgeCkgLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvP1t4XVxyXG5cdFx0XHRcdFx0XHRcdFx0LCBwYXJlbnRcclxuXHJcblx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90b1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvKClcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KHJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdFx0XHRcdGlmIF8uaXNPYmplY3QocmVmZXJlbmNlX2lkcykgJiYgIV8uaXNBcnJheShyZWZlcmVuY2VfaWRzKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfaWRzLm9cclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX2lkcyA9IHJlZmVyZW5jZV9pZHMuaWRzIHx8IFtdXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBbXVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkocmVmZXJlbmNlX2lkcylcclxuXHRcdFx0XHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHskaW46IHJlZmVyZW5jZV9pZHN9XHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0cXVlcnkuX2lkID0gcmVmZXJlbmNlX2lkc1xyXG5cclxuXHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG9fb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxyXG5cclxuXHRcdFx0XHRcdFx0XHRuYW1lX2ZpZWxkX2tleSA9IHJlZmVyZW5jZV90b19vYmplY3QuTkFNRV9GSUVMRF9LRVlcclxuXHJcblx0XHRcdFx0XHRcdFx0Y2hpbGRyZW5fZmllbGRzID0ge19pZDogMSwgc3BhY2U6IDF9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIG5hbWVfZmllbGRfa2V5XHJcblx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbl9maWVsZHNbbmFtZV9maWVsZF9rZXldID0gMVxyXG5cclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZChxdWVyeSwge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZmllbGRzOiBjaGlsZHJlbl9maWVsZHNcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlZmVyZW5jZV90bywgcGFyZW50LCBlKVxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBbXVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGF0YVxyXG5cdGVsc2VcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGZpbmQ6ICgpLT5cclxuXHRcdFx0XHRzZWxmLnVuYmxvY2soKTtcclxuXHRcdFx0XHRyZXR1cm4gb2JqZWN0X2NvbGxlY2l0b24uZmluZCh7X2lkOiB7JGluOiBpZHN9fSwge2ZpZWxkczogZmllbGRzfSlcclxuXHRcdH07XHJcblxyXG4iLCJNZXRlb3IucHVibGlzaENvbXBvc2l0ZShcInN0ZWVkb3Nfb2JqZWN0X3RhYnVsYXJcIiwgZnVuY3Rpb24odGFibGVOYW1lLCBpZHMsIGZpZWxkcywgc3BhY2VJZCkge1xuICB2YXIgX2ZpZWxkcywgX2tleXMsIF9vYmplY3QsIF9vYmplY3RfbmFtZSwgZGF0YSwga2V5cywgb2JqZWN0X2NvbGxlY2l0b24sIHJlZmVyZW5jZV9maWVsZHMsIHNlbGY7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIGNoZWNrKHRhYmxlTmFtZSwgU3RyaW5nKTtcbiAgY2hlY2soaWRzLCBBcnJheSk7XG4gIGNoZWNrKGZpZWxkcywgTWF0Y2guT3B0aW9uYWwoT2JqZWN0KSk7XG4gIF9vYmplY3RfbmFtZSA9IHRhYmxlTmFtZS5yZXBsYWNlKFwiY3JlYXRvcl9cIiwgXCJcIik7XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfb2JqZWN0X25hbWUsIHNwYWNlSWQpO1xuICBpZiAoc3BhY2VJZCkge1xuICAgIF9vYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0TmFtZShfb2JqZWN0KTtcbiAgfVxuICBvYmplY3RfY29sbGVjaXRvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihfb2JqZWN0X25hbWUpO1xuICBfZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIGlmICghX2ZpZWxkcyB8fCAhb2JqZWN0X2NvbGxlY2l0b24pIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJlZmVyZW5jZV9maWVsZHMgPSBfLmZpbHRlcihfZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbihmLnJlZmVyZW5jZV90bykgfHwgIV8uaXNFbXB0eShmLnJlZmVyZW5jZV90byk7XG4gIH0pO1xuICBzZWxmID0gdGhpcztcbiAgc2VsZi51bmJsb2NrKCk7XG4gIGlmIChyZWZlcmVuY2VfZmllbGRzLmxlbmd0aCA+IDApIHtcbiAgICBkYXRhID0ge1xuICAgICAgZmluZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmaWVsZF9rZXlzO1xuICAgICAgICBzZWxmLnVuYmxvY2soKTtcbiAgICAgICAgZmllbGRfa2V5cyA9IHt9O1xuICAgICAgICBfLmVhY2goXy5rZXlzKGZpZWxkcyksIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICBpZiAoIS9cXHcrKFxcLlxcJCl7MX1cXHc/Ly50ZXN0KGYpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmllbGRfa2V5c1tmXSA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe1xuICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgJGluOiBpZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkX2tleXNcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBkYXRhLmNoaWxkcmVuID0gW107XG4gICAga2V5cyA9IF8ua2V5cyhmaWVsZHMpO1xuICAgIGlmIChrZXlzLmxlbmd0aCA8IDEpIHtcbiAgICAgIGtleXMgPSBfLmtleXMoX2ZpZWxkcyk7XG4gICAgfVxuICAgIF9rZXlzID0gW107XG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ10pIHtcbiAgICAgICAgX2tleXMgPSBfa2V5cy5jb25jYXQoXy5tYXAoX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXSwgZnVuY3Rpb24oaykge1xuICAgICAgICAgIHJldHVybiBrZXkgKyAnLicgKyBrO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX2tleXMucHVzaChrZXkpO1xuICAgIH0pO1xuICAgIF9rZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgcmVmZXJlbmNlX2ZpZWxkO1xuICAgICAgcmVmZXJlbmNlX2ZpZWxkID0gX2ZpZWxkc1trZXldO1xuICAgICAgaWYgKHJlZmVyZW5jZV9maWVsZCAmJiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykpKSB7XG4gICAgICAgIHJldHVybiBkYXRhLmNoaWxkcmVuLnB1c2goe1xuICAgICAgICAgIGZpbmQ6IGZ1bmN0aW9uKHBhcmVudCkge1xuICAgICAgICAgICAgdmFyIGNoaWxkcmVuX2ZpZWxkcywgZSwgbmFtZV9maWVsZF9rZXksIHBfaywgcXVlcnksIHJlZmVyZW5jZV9pZHMsIHJlZmVyZW5jZV90bywgcmVmZXJlbmNlX3RvX29iamVjdCwgc19rO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICAgICAgICAgIHF1ZXJ5ID0ge307XG4gICAgICAgICAgICAgIGlmICgvXFx3KyhcXC5cXCRcXC4pezF9XFx3Ky8udGVzdChrZXkpKSB7XG4gICAgICAgICAgICAgICAgcF9rID0ga2V5LnJlcGxhY2UoLyhcXHcrKVxcLlxcJFxcLlxcdysvaWcsIFwiJDFcIik7XG4gICAgICAgICAgICAgICAgc19rID0ga2V5LnJlcGxhY2UoL1xcdytcXC5cXCRcXC4oXFx3KykvaWcsIFwiJDFcIik7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlX2lkcyA9IHBhcmVudFtwX2tdLmdldFByb3BlcnR5KHNfayk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlX2lkcyA9IGtleS5zcGxpdCgnLicpLnJlZHVjZShmdW5jdGlvbihvLCB4KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbyAhPSBudWxsID8gb1t4XSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICB9LCBwYXJlbnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90bygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChfLmlzQXJyYXkocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIGlmIChfLmlzT2JqZWN0KHJlZmVyZW5jZV9pZHMpICYmICFfLmlzQXJyYXkocmVmZXJlbmNlX2lkcykpIHtcbiAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9pZHMubztcbiAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZV9pZHMgPSByZWZlcmVuY2VfaWRzLmlkcyB8fCBbXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpKSB7XG4gICAgICAgICAgICAgICAgcXVlcnkuX2lkID0ge1xuICAgICAgICAgICAgICAgICAgJGluOiByZWZlcmVuY2VfaWRzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBxdWVyeS5faWQgPSByZWZlcmVuY2VfaWRzO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlZmVyZW5jZV90b19vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWZlcmVuY2VfdG8sIHNwYWNlSWQpO1xuICAgICAgICAgICAgICBuYW1lX2ZpZWxkX2tleSA9IHJlZmVyZW5jZV90b19vYmplY3QuTkFNRV9GSUVMRF9LRVk7XG4gICAgICAgICAgICAgIGNoaWxkcmVuX2ZpZWxkcyA9IHtcbiAgICAgICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICAgICAgc3BhY2U6IDFcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgaWYgKG5hbWVfZmllbGRfa2V5KSB7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW5fZmllbGRzW25hbWVfZmllbGRfa2V5XSA9IDE7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8sIHNwYWNlSWQpLmZpbmQocXVlcnksIHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IGNoaWxkcmVuX2ZpZWxkc1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVmZXJlbmNlX3RvLCBwYXJlbnQsIGUpO1xuICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgZmluZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYudW5ibG9jaygpO1xuICAgICAgICByZXR1cm4gb2JqZWN0X2NvbGxlY2l0b24uZmluZCh7XG4gICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAkaW46IGlkc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogZmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggXCJvYmplY3RfbGlzdHZpZXdzXCIsIChvYmplY3RfbmFtZSwgc3BhY2VJZCktPlxyXG4gICAgdXNlcklkID0gdGhpcy51c2VySWRcclxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc3BhY2U6IHNwYWNlSWQgLFwiJG9yXCI6W3tvd25lcjogdXNlcklkfSwge3NoYXJlZDogdHJ1ZX1dfSkiLCJNZXRlb3IucHVibGlzaCBcInVzZXJfdGFidWxhcl9zZXR0aW5nc1wiLCAob2JqZWN0X25hbWUpLT5cclxuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXHJcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kKHtvYmplY3RfbmFtZTogeyRpbjogb2JqZWN0X25hbWV9LCByZWNvcmRfaWQ6IHskaW46IFtcIm9iamVjdF9saXN0dmlld3NcIiwgXCJvYmplY3RfZ3JpZHZpZXdzXCJdfSwgb3duZXI6IHVzZXJJZH0pXHJcbiIsIk1ldGVvci5wdWJsaXNoIFwicmVsYXRlZF9vYmplY3RzX3JlY29yZHNcIiwgKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCktPlxyXG5cdHVzZXJJZCA9IHRoaXMudXNlcklkXHJcblx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJcclxuXHRcdHNlbGVjdG9yID0ge1wibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZH1cclxuXHRlbHNlXHJcblx0XHRzZWxlY3RvciA9IHtzcGFjZTogc3BhY2VJZH1cclxuXHRcclxuXHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcclxuXHRcdCMg6ZmE5Lu255qE5YWz6IGU5pCc57Si5p2h5Lu25piv5a6a5q2755qEXHJcblx0XHRzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWVcclxuXHRcdHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdXHJcblx0ZWxzZVxyXG5cdFx0c2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZFxyXG5cclxuXHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxyXG5cdGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMuYWxsb3dSZWFkXHJcblx0XHRzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxyXG5cdFxyXG5cdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3RvcikiLCJNZXRlb3IucHVibGlzaChcInJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzXCIsIGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWxhdGVkX29iamVjdF9uYW1lLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlY29yZF9pZCwgc3BhY2VJZCkge1xuICB2YXIgcGVybWlzc2lvbnMsIHNlbGVjdG9yLCB1c2VySWQ7XG4gIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiKSB7XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWRcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9O1xuICB9XG4gIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgc2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lO1xuICAgIHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdO1xuICB9IGVsc2Uge1xuICAgIHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWQ7XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMuYWxsb3dSZWFkKSB7XG4gICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gIH1cbiAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ3NwYWNlX3VzZXJfaW5mbycsIChzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZCh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0pIiwiXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cclxuXHRNZXRlb3IucHVibGlzaCAnY29udGFjdHNfdmlld19saW1pdHMnLCAoc3BhY2VJZCktPlxyXG5cclxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxyXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdFx0dW5sZXNzIHNwYWNlSWRcclxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRcdHNlbGVjdG9yID1cclxuXHRcdFx0c3BhY2U6IHNwYWNlSWRcclxuXHRcdFx0a2V5OiAnY29udGFjdHNfdmlld19saW1pdHMnXHJcblxyXG5cdFx0cmV0dXJuIGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoc2VsZWN0b3IpIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnY29udGFjdHNfdmlld19saW1pdHMnLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIHNlbGVjdG9yO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIGtleTogJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJ1xuICAgIH07XG4gICAgcmV0dXJuIGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoc2VsZWN0b3IpO1xuICB9KTtcbn1cbiIsIlxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHJcblx0TWV0ZW9yLnB1Ymxpc2ggJ2NvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzJywgKHNwYWNlSWQpLT5cclxuXHJcblx0XHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRcdHVubGVzcyBzcGFjZUlkXHJcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0XHRzZWxlY3RvciA9XHJcblx0XHRcdHNwYWNlOiBzcGFjZUlkXHJcblx0XHRcdGtleTogJ2NvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzJ1xyXG5cclxuXHRcdHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKSIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ2NvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBzZWxlY3RvcjtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBrZXk6ICdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycydcbiAgICB9O1xuICAgIHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKTtcbiAgfSk7XG59XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRNZXRlb3IucHVibGlzaCAnc3BhY2VfbmVlZF90b19jb25maXJtJywgKCktPlxyXG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcclxuXHRcdHJldHVybiBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VySWQsIGludml0ZV9zdGF0ZTogXCJwZW5kaW5nXCJ9KSIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ3NwYWNlX25lZWRfdG9fY29uZmlybScsIGZ1bmN0aW9uKCkge1xuICAgIHZhciB1c2VySWQ7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgaW52aXRlX3N0YXRlOiBcInBlbmRpbmdcIlxuICAgIH0pO1xuICB9KTtcbn1cbiIsInBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge31cclxuXHJcbnBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3dQZXJtaXNzaW9ucyA9IChmbG93X2lkLCB1c2VyX2lkKSAtPlxyXG5cdCMg5qC55o2uOmZsb3dfaWTmn6XliLDlr7nlupTnmoRmbG93XHJcblx0ZmxvdyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyhmbG93X2lkKVxyXG5cdHNwYWNlX2lkID0gZmxvdy5zcGFjZVxyXG5cdCMg5qC55o2uc3BhY2VfaWTlkow6dXNlcl9pZOWIsG9yZ2FuaXphdGlvbnPooajkuK3mn6XliLDnlKjmiLfmiYDlsZ7miYDmnInnmoRvcmdfaWTvvIjljIXmi6zkuIrnuqfnu4RJRO+8iVxyXG5cdG9yZ19pZHMgPSBuZXcgQXJyYXlcclxuXHRvcmdhbml6YXRpb25zID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcclxuXHRcdHNwYWNlOiBzcGFjZV9pZCwgdXNlcnM6IHVzZXJfaWQgfSwgeyBmaWVsZHM6IHsgcGFyZW50czogMSB9IH0pLmZldGNoKClcclxuXHRfLmVhY2gob3JnYW5pemF0aW9ucywgKG9yZykgLT5cclxuXHRcdG9yZ19pZHMucHVzaChvcmcuX2lkKVxyXG5cdFx0aWYgb3JnLnBhcmVudHNcclxuXHRcdFx0Xy5lYWNoKG9yZy5wYXJlbnRzLCAocGFyZW50X2lkKSAtPlxyXG5cdFx0XHRcdG9yZ19pZHMucHVzaChwYXJlbnRfaWQpXHJcblx0XHRcdClcclxuXHQpXHJcblx0b3JnX2lkcyA9IF8udW5pcShvcmdfaWRzKVxyXG5cdG15X3Blcm1pc3Npb25zID0gbmV3IEFycmF5XHJcblx0aWYgZmxvdy5wZXJtc1xyXG5cdFx0IyDliKTmlq1mbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbuS4reaYr+WQpuWMheWQq+W9k+WJjeeUqOaIt++8jFxyXG5cdFx0IyDmiJbogIVmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZOaYr+WQpuWMheWQqzTmraXlvpfliLDnmoRvcmdfaWTmlbDnu4TkuK3nmoTku7vkvZXkuIDkuKrvvIxcclxuXHRcdCMg6Iul5piv77yM5YiZ5Zyo6L+U5Zue55qE5pWw57uE5Lit5Yqg5LiKYWRkXHJcblx0XHRpZiBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGRcclxuXHRcdFx0dXNlcnNfY2FuX2FkZCA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkZFxyXG5cdFx0XHRpZiB1c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJfaWQpXHJcblx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKVxyXG5cclxuXHRcdGlmIGZsb3cucGVybXMub3Jnc19jYW5fYWRkXHJcblx0XHRcdG9yZ3NfY2FuX2FkZCA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRkXHJcblx0XHRcdF8uZWFjaChvcmdfaWRzLCAob3JnX2lkKSAtPlxyXG5cdFx0XHRcdGlmIG9yZ3NfY2FuX2FkZC5pbmNsdWRlcyhvcmdfaWQpXHJcblx0XHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpXHJcblx0XHRcdClcclxuXHRcdCMg5Yik5patZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvcuS4reaYr+WQpuWMheWQq+W9k+WJjeeUqOaIt++8jFxyXG5cdFx0IyDmiJbogIVmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3LmmK/lkKbljIXlkKs05q2l5b6X5Yiw55qEb3JnX2lk5pWw57uE5Lit55qE5Lu75L2V5LiA5Liq77yMXHJcblx0XHQjIOiLpeaYr++8jOWImeWcqOi/lOWbnueahOaVsOe7hOS4reWKoOS4im1vbml0b3JcclxuXHRcdGlmIGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3JcclxuXHRcdFx0dXNlcnNfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yXHJcblx0XHRcdGlmIHVzZXJzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKHVzZXJfaWQpXHJcblx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIilcclxuXHJcblx0XHRpZiBmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3JcclxuXHRcdFx0b3Jnc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvclxyXG5cdFx0XHRfLmVhY2gob3JnX2lkcywgKG9yZ19pZCkgLT5cclxuXHRcdFx0XHRpZiBvcmdzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKG9yZ19pZClcclxuXHRcdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJtb25pdG9yXCIpXHJcblx0XHRcdClcclxuXHRcdCMg5Yik5patZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW7kuK3mmK/lkKbljIXlkKvlvZPliY3nlKjmiLfvvIxcclxuXHRcdCMg5oiW6ICFZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pbuaYr+WQpuWMheWQqzTmraXlvpfliLDnmoRvcmdfaWTmlbDnu4TkuK3nmoTku7vkvZXkuIDkuKrvvIxcclxuXHRcdCMg6Iul5piv77yM5YiZ5Zyo6L+U5Zue55qE5pWw57uE5Lit5Yqg5LiKYWRtaW5cclxuXHRcdGlmIGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluXHJcblx0XHRcdHVzZXJzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluXHJcblx0XHRcdGlmIHVzZXJzX2Nhbl9hZG1pbi5pbmNsdWRlcyh1c2VyX2lkKVxyXG5cdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKVxyXG5cclxuXHRcdGlmIGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW5cclxuXHRcdFx0b3Jnc19jYW5fYWRtaW4gPSBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluXHJcblx0XHRcdF8uZWFjaChvcmdfaWRzLCAob3JnX2lkKSAtPlxyXG5cdFx0XHRcdGlmIG9yZ3NfY2FuX2FkbWluLmluY2x1ZGVzKG9yZ19pZClcclxuXHRcdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKVxyXG5cdFx0XHQpXHJcblxyXG5cdG15X3Blcm1pc3Npb25zID0gXy51bmlxKG15X3Blcm1pc3Npb25zKVxyXG5cdHJldHVybiBteV9wZXJtaXNzaW9ucyIsIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxucGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwgPSB7fTtcblxucGVybWlzc2lvbk1hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rmxvd1Blcm1pc3Npb25zID0gZnVuY3Rpb24oZmxvd19pZCwgdXNlcl9pZCkge1xuICB2YXIgZmxvdywgbXlfcGVybWlzc2lvbnMsIG9yZ19pZHMsIG9yZ2FuaXphdGlvbnMsIG9yZ3NfY2FuX2FkZCwgb3Jnc19jYW5fYWRtaW4sIG9yZ3NfY2FuX21vbml0b3IsIHNwYWNlX2lkLCB1c2Vyc19jYW5fYWRkLCB1c2Vyc19jYW5fYWRtaW4sIHVzZXJzX2Nhbl9tb25pdG9yO1xuICBmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpO1xuICBzcGFjZV9pZCA9IGZsb3cuc3BhY2U7XG4gIG9yZ19pZHMgPSBuZXcgQXJyYXk7XG4gIG9yZ2FuaXphdGlvbnMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB1c2VyczogdXNlcl9pZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBwYXJlbnRzOiAxXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBfLmVhY2gob3JnYW5pemF0aW9ucywgZnVuY3Rpb24ob3JnKSB7XG4gICAgb3JnX2lkcy5wdXNoKG9yZy5faWQpO1xuICAgIGlmIChvcmcucGFyZW50cykge1xuICAgICAgcmV0dXJuIF8uZWFjaChvcmcucGFyZW50cywgZnVuY3Rpb24ocGFyZW50X2lkKSB7XG4gICAgICAgIHJldHVybiBvcmdfaWRzLnB1c2gocGFyZW50X2lkKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIG9yZ19pZHMgPSBfLnVuaXEob3JnX2lkcyk7XG4gIG15X3Blcm1pc3Npb25zID0gbmV3IEFycmF5O1xuICBpZiAoZmxvdy5wZXJtcykge1xuICAgIGlmIChmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGQpIHtcbiAgICAgIHVzZXJzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGQ7XG4gICAgICBpZiAodXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VyX2lkKSkge1xuICAgICAgICBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGQpIHtcbiAgICAgIG9yZ3NfY2FuX2FkZCA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRkO1xuICAgICAgXy5lYWNoKG9yZ19pZHMsIGZ1bmN0aW9uKG9yZ19pZCkge1xuICAgICAgICBpZiAob3Jnc19jYW5fYWRkLmluY2x1ZGVzKG9yZ19pZCkpIHtcbiAgICAgICAgICByZXR1cm4gbXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yKSB7XG4gICAgICB1c2Vyc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3I7XG4gICAgICBpZiAodXNlcnNfY2FuX21vbml0b3IuaW5jbHVkZXModXNlcl9pZCkpIHtcbiAgICAgICAgbXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3IpIHtcbiAgICAgIG9yZ3NfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3I7XG4gICAgICBfLmVhY2gob3JnX2lkcywgZnVuY3Rpb24ob3JnX2lkKSB7XG4gICAgICAgIGlmIChvcmdzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKG9yZ19pZCkpIHtcbiAgICAgICAgICByZXR1cm4gbXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW4pIHtcbiAgICAgIHVzZXJzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluO1xuICAgICAgaWYgKHVzZXJzX2Nhbl9hZG1pbi5pbmNsdWRlcyh1c2VyX2lkKSkge1xuICAgICAgICBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluKSB7XG4gICAgICBvcmdzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW47XG4gICAgICBfLmVhY2gob3JnX2lkcywgZnVuY3Rpb24ob3JnX2lkKSB7XG4gICAgICAgIGlmIChvcmdzX2Nhbl9hZG1pbi5pbmNsdWRlcyhvcmdfaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIG15X3Blcm1pc3Npb25zID0gXy51bmlxKG15X3Blcm1pc3Npb25zKTtcbiAgcmV0dXJuIG15X3Blcm1pc3Npb25zO1xufTtcbiIsIl9ldmFsID0gcmVxdWlyZSgnZXZhbCcpXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwgPSB7fVxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja19hdXRob3JpemF0aW9uID0gKHJlcSkgLT5cclxuXHRxdWVyeSA9IHJlcS5xdWVyeVxyXG5cdHVzZXJJZCA9IHF1ZXJ5W1wiWC1Vc2VyLUlkXCJdXHJcblx0YXV0aFRva2VuID0gcXVlcnlbXCJYLUF1dGgtVG9rZW5cIl1cclxuXHJcblx0aWYgbm90IHVzZXJJZCBvciBub3QgYXV0aFRva2VuXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcclxuXHJcblx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxyXG5cdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxyXG5cdFx0X2lkOiB1c2VySWQsXHJcblx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxyXG5cclxuXHRpZiBub3QgdXNlclxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXHJcblxyXG5cdHJldHVybiB1c2VyXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlID0gKHNwYWNlX2lkKSAtPlxyXG5cdHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcclxuXHRpZiBub3Qgc3BhY2VcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwic3BhY2VfaWTmnInor6/miJbmraRzcGFjZeW3sue7j+iiq+WIoOmZpFwiKVxyXG5cdHJldHVybiBzcGFjZVxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93ID0gKGZsb3dfaWQpIC0+XHJcblx0ZmxvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZmxvd3MuZmluZE9uZShmbG93X2lkKVxyXG5cdGlmIG5vdCBmbG93XHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcImlk5pyJ6K+v5oiW5q2k5rWB56iL5bey57uP6KKr5Yig6ZmkXCIpXHJcblx0cmV0dXJuIGZsb3dcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyID0gKHNwYWNlX2lkLCB1c2VyX2lkKSAtPlxyXG5cdHNwYWNlX3VzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlX3VzZXJzLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJfaWQgfSlcclxuXHRpZiBub3Qgc3BhY2VfdXNlclxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJ1c2VyX2lk5a+55bqU55qE55So5oi35LiN5bGe5LqO5b2T5YmNc3BhY2VcIilcclxuXHRyZXR1cm4gc3BhY2VfdXNlclxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXJPcmdJbmZvID0gKHNwYWNlX3VzZXIpIC0+XHJcblx0aW5mbyA9IG5ldyBPYmplY3RcclxuXHRpbmZvLm9yZ2FuaXphdGlvbiA9IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uXHJcblx0b3JnID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vcmdhbml6YXRpb25zLmZpbmRPbmUoc3BhY2VfdXNlci5vcmdhbml6YXRpb24sIHsgZmllbGRzOiB7IG5hbWU6IDEgLCBmdWxsbmFtZTogMSB9IH0pXHJcblx0aW5mby5vcmdhbml6YXRpb25fbmFtZSA9IG9yZy5uYW1lXHJcblx0aW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBvcmcuZnVsbG5hbWVcclxuXHRyZXR1cm4gaW5mb1xyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dFbmFibGVkID0gKGZsb3cpIC0+XHJcblx0aWYgZmxvdy5zdGF0ZSBpc250IFwiZW5hYmxlZFwiXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+acquWQr+eUqCzmk43kvZzlpLHotKVcIilcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93U3BhY2VNYXRjaGVkID0gKGZsb3csIHNwYWNlX2lkKSAtPlxyXG5cdGlmIGZsb3cuc3BhY2UgaXNudCBzcGFjZV9pZFxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvlkozlt6XkvZzljLpJROS4jeWMuemFjVwiKVxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtID0gKGZvcm1faWQpIC0+XHJcblx0Zm9ybSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZm9ybXMuZmluZE9uZShmb3JtX2lkKVxyXG5cdGlmIG5vdCBmb3JtXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn6KGo5Y2VSUTmnInor6/miJbmraTooajljZXlt7Lnu4/ooqvliKDpmaQnKVxyXG5cclxuXHRyZXR1cm4gZm9ybVxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeSA9IChjYXRlZ29yeV9pZCkgLT5cclxuXHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5jYXRlZ29yaWVzLmZpbmRPbmUoY2F0ZWdvcnlfaWQpXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNyZWF0ZV9pbnN0YW5jZSA9IChpbnN0YW5jZV9mcm9tX2NsaWVudCwgdXNlcl9pbmZvKSAtPlxyXG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdLCBTdHJpbmdcclxuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdLCBTdHJpbmdcclxuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl0sIFN0cmluZ1xyXG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXSwgW3tvOiBTdHJpbmcsIGlkczogW1N0cmluZ119XVxyXG5cclxuXHQjIOagoemqjOaYr+WQpnJlY29yZOW3sue7j+WPkei1t+eahOeUs+ivt+i/mOWcqOWuoeaJueS4rVxyXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tJc0luQXBwcm92YWwoaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdWzBdLCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdKVxyXG5cclxuXHRzcGFjZV9pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl1cclxuXHRmbG93X2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdXHJcblx0dXNlcl9pZCA9IHVzZXJfaW5mby5faWRcclxuXHQjIOiOt+WPluWJjeWPsOaJgOS8oOeahHRyYWNlXHJcblx0dHJhY2VfZnJvbV9jbGllbnQgPSBudWxsXHJcblx0IyDojrflj5bliY3lj7DmiYDkvKDnmoRhcHByb3ZlXHJcblx0YXBwcm92ZV9mcm9tX2NsaWVudCA9IG51bGxcclxuXHRpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXSBhbmQgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1cclxuXHRcdHRyYWNlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1cclxuXHRcdGlmIHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl0gYW5kIHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl1bMF1cclxuXHRcdFx0YXBwcm92ZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdW1wiYXBwcm92ZXNcIl1bMF1cclxuXHJcblx0IyDojrflj5bkuIDkuKpzcGFjZVxyXG5cdHNwYWNlID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZShzcGFjZV9pZClcclxuXHQjIOiOt+WPluS4gOS4qmZsb3dcclxuXHRmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpXHJcblx0IyDojrflj5bkuIDkuKpzcGFjZeS4i+eahOS4gOS4qnVzZXJcclxuXHRzcGFjZV91c2VyID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXIoc3BhY2VfaWQsIHVzZXJfaWQpXHJcblx0IyDojrflj5ZzcGFjZV91c2Vy5omA5Zyo55qE6YOo6Zeo5L+h5oGvXHJcblx0c3BhY2VfdXNlcl9vcmdfaW5mbyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyhzcGFjZV91c2VyKVxyXG5cdCMg5Yik5pat5LiA5LiqZmxvd+aYr+WQpuS4uuWQr+eUqOeKtuaAgVxyXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZChmbG93KVxyXG5cdCMg5Yik5pat5LiA5LiqZmxvd+WSjHNwYWNlX2lk5piv5ZCm5Yy56YWNXHJcblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQoZmxvdywgc3BhY2VfaWQpXHJcblxyXG5cdGZvcm0gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZvcm0oZmxvdy5mb3JtKVxyXG5cclxuXHRwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93X2lkLCB1c2VyX2lkKVxyXG5cclxuXHRpZiBub3QgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZGRcIilcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5b2T5YmN55So5oi35rKh5pyJ5q2k5rWB56iL55qE5paw5bu65p2D6ZmQXCIpXHJcblxyXG5cdG5vdyA9IG5ldyBEYXRlXHJcblx0aW5zX29iaiA9IHt9XHJcblx0aW5zX29iai5faWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5fbWFrZU5ld0lEKClcclxuXHRpbnNfb2JqLnNwYWNlID0gc3BhY2VfaWRcclxuXHRpbnNfb2JqLmZsb3cgPSBmbG93X2lkXHJcblx0aW5zX29iai5mbG93X3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuX2lkXHJcblx0aW5zX29iai5mb3JtID0gZmxvdy5mb3JtXHJcblx0aW5zX29iai5mb3JtX3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuZm9ybV92ZXJzaW9uXHJcblx0aW5zX29iai5uYW1lID0gZmxvdy5uYW1lXHJcblx0aW5zX29iai5zdWJtaXR0ZXIgPSB1c2VyX2lkXHJcblx0aW5zX29iai5zdWJtaXR0ZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lXHJcblx0aW5zX29iai5hcHBsaWNhbnQgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIGVsc2UgdXNlcl9pZFxyXG5cdGluc19vYmouYXBwbGljYW50X25hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSBlbHNlIHVzZXJfaW5mby5uYW1lXHJcblx0aW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdIGVsc2Ugc3BhY2VfdXNlci5vcmdhbml6YXRpb25cclxuXHRpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gZWxzZSBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9uYW1lXHJcblx0aW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdIGVsc2UgIHNwYWNlX3VzZXJfb3JnX2luZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lXHJcblx0aW5zX29iai5hcHBsaWNhbnRfY29tcGFueSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdIGVsc2Ugc3BhY2VfdXNlci5jb21wYW55X2lkXHJcblx0aW5zX29iai5zdGF0ZSA9ICdkcmFmdCdcclxuXHRpbnNfb2JqLmNvZGUgPSAnJ1xyXG5cdGluc19vYmouaXNfYXJjaGl2ZWQgPSBmYWxzZVxyXG5cdGluc19vYmouaXNfZGVsZXRlZCA9IGZhbHNlXHJcblx0aW5zX29iai5jcmVhdGVkID0gbm93XHJcblx0aW5zX29iai5jcmVhdGVkX2J5ID0gdXNlcl9pZFxyXG5cdGluc19vYmoubW9kaWZpZWQgPSBub3dcclxuXHRpbnNfb2JqLm1vZGlmaWVkX2J5ID0gdXNlcl9pZFxyXG5cdGluc19vYmoudmFsdWVzID0gbmV3IE9iamVjdFxyXG5cclxuXHRpbnNfb2JqLnJlY29yZF9pZHMgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl1cclxuXHJcblx0aWYgc3BhY2VfdXNlci5jb21wYW55X2lkXHJcblx0XHRpbnNfb2JqLmNvbXBhbnlfaWQgPSBzcGFjZV91c2VyLmNvbXBhbnlfaWRcclxuXHJcblx0IyDmlrDlu7pUcmFjZVxyXG5cdHRyYWNlX29iaiA9IHt9XHJcblx0dHJhY2Vfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHJcclxuXHR0cmFjZV9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZFxyXG5cdHRyYWNlX29iai5pc19maW5pc2hlZCA9IGZhbHNlXHJcblx0IyDlvZPliY3mnIDmlrDniYhmbG935Lit5byA5aeL6IqC54K5XHJcblx0c3RhcnRfc3RlcCA9IF8uZmluZChmbG93LmN1cnJlbnQuc3RlcHMsIChzdGVwKSAtPlxyXG5cdFx0cmV0dXJuIHN0ZXAuc3RlcF90eXBlIGlzICdzdGFydCdcclxuXHQpXHJcblx0dHJhY2Vfb2JqLnN0ZXAgPSBzdGFydF9zdGVwLl9pZFxyXG5cdHRyYWNlX29iai5uYW1lID0gc3RhcnRfc3RlcC5uYW1lXHJcblxyXG5cdHRyYWNlX29iai5zdGFydF9kYXRlID0gbm93XHJcblx0IyDmlrDlu7pBcHByb3ZlXHJcblx0YXBwcl9vYmogPSB7fVxyXG5cdGFwcHJfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHJcclxuXHRhcHByX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkXHJcblx0YXBwcl9vYmoudHJhY2UgPSB0cmFjZV9vYmouX2lkXHJcblx0YXBwcl9vYmouaXNfZmluaXNoZWQgPSBmYWxzZVxyXG5cdGFwcHJfb2JqLnVzZXIgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIGVsc2UgdXNlcl9pZFxyXG5cdGFwcHJfb2JqLnVzZXJfbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIGVsc2UgdXNlcl9pbmZvLm5hbWVcclxuXHRhcHByX29iai5oYW5kbGVyID0gdXNlcl9pZFxyXG5cdGFwcHJfb2JqLmhhbmRsZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lXHJcblx0YXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvblxyXG5cdGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX25hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLm5hbWVcclxuXHRhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IHNwYWNlX3VzZXJfb3JnX2luZm8uZnVsbG5hbWVcclxuXHRhcHByX29iai50eXBlID0gJ2RyYWZ0J1xyXG5cdGFwcHJfb2JqLnN0YXJ0X2RhdGUgPSBub3dcclxuXHRhcHByX29iai5yZWFkX2RhdGUgPSBub3dcclxuXHRhcHByX29iai5pc19yZWFkID0gdHJ1ZVxyXG5cdGFwcHJfb2JqLmlzX2Vycm9yID0gZmFsc2VcclxuXHRhcHByX29iai5kZXNjcmlwdGlvbiA9ICcnXHJcblx0cmVsYXRlZFRhYmxlc0luZm8gPSB7fVxyXG5cdGFwcHJfb2JqLnZhbHVlcyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMoaW5zX29iai5yZWNvcmRfaWRzWzBdLCBmbG93X2lkLCBzcGFjZV9pZCwgZm9ybS5jdXJyZW50LmZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pXHJcblxyXG5cdHRyYWNlX29iai5hcHByb3ZlcyA9IFthcHByX29ial1cclxuXHRpbnNfb2JqLnRyYWNlcyA9IFt0cmFjZV9vYmpdXHJcblxyXG5cdGluc19vYmouaW5ib3hfdXNlcnMgPSBpbnN0YW5jZV9mcm9tX2NsaWVudC5pbmJveF91c2VycyB8fCBbXVxyXG5cclxuXHRpbnNfb2JqLmN1cnJlbnRfc3RlcF9uYW1lID0gc3RhcnRfc3RlcC5uYW1lXHJcblxyXG5cdGlmIGZsb3cuYXV0b19yZW1pbmQgaXMgdHJ1ZVxyXG5cdFx0aW5zX29iai5hdXRvX3JlbWluZCA9IHRydWVcclxuXHJcblx0IyDmlrDlu7rnlLPor7fljZXml7bvvIxpbnN0YW5jZXPorrDlvZXmtYHnqIvlkI3np7DjgIHmtYHnqIvliIbnsbvlkI3np7AgIzEzMTNcclxuXHRpbnNfb2JqLmZsb3dfbmFtZSA9IGZsb3cubmFtZVxyXG5cdGlmIGZvcm0uY2F0ZWdvcnlcclxuXHRcdGNhdGVnb3J5ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRDYXRlZ29yeShmb3JtLmNhdGVnb3J5KVxyXG5cdFx0aWYgY2F0ZWdvcnlcclxuXHRcdFx0aW5zX29iai5jYXRlZ29yeV9uYW1lID0gY2F0ZWdvcnkubmFtZVxyXG5cdFx0XHRpbnNfb2JqLmNhdGVnb3J5ID0gY2F0ZWdvcnkuX2lkXHJcblxyXG5cdG5ld19pbnNfaWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5pbnNlcnQoaW5zX29iailcclxuXHJcblx0dXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVJlY29yZEluc3RhbmNlSW5mbyhpbnNfb2JqLnJlY29yZF9pZHNbMF0sIG5ld19pbnNfaWQsIHNwYWNlX2lkKVxyXG5cclxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyhyZWxhdGVkVGFibGVzSW5mbywgbmV3X2luc19pZCwgc3BhY2VfaWQpXHJcblxyXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2goaW5zX29iai5yZWNvcmRfaWRzWzBdLCBzcGFjZV9pZCwgaW5zX29iai5faWQsIGFwcHJfb2JqLl9pZClcclxuXHJcblx0cmV0dXJuIG5ld19pbnNfaWRcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMgPSAocmVjb3JkSWRzLCBmbG93SWQsIHNwYWNlSWQsIGZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pIC0+XHJcblx0ZmllbGRDb2RlcyA9IFtdXHJcblx0Xy5lYWNoIGZpZWxkcywgKGYpIC0+XHJcblx0XHRpZiBmLnR5cGUgPT0gJ3NlY3Rpb24nXHJcblx0XHRcdF8uZWFjaCBmLmZpZWxkcywgKGZmKSAtPlxyXG5cdFx0XHRcdGZpZWxkQ29kZXMucHVzaCBmZi5jb2RlXHJcblx0XHRlbHNlXHJcblx0XHRcdGZpZWxkQ29kZXMucHVzaCBmLmNvZGVcclxuXHJcblx0dmFsdWVzID0ge31cclxuXHRvYmplY3ROYW1lID0gcmVjb3JkSWRzLm9cclxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3ROYW1lLCBzcGFjZUlkKVxyXG5cdHJlY29yZElkID0gcmVjb3JkSWRzLmlkc1swXVxyXG5cdG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3Rfd29ya2Zsb3dzLmZpbmRPbmUoe1xyXG5cdFx0b2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXHJcblx0XHRmbG93X2lkOiBmbG93SWRcclxuXHR9KVxyXG5cdHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKHJlY29yZElkKVxyXG5cdGZsb3cgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShmbG93SWQsIHsgZmllbGRzOiB7IGZvcm06IDEgfSB9KVxyXG5cdGlmIG93IGFuZCByZWNvcmRcclxuXHRcdGZvcm0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJmb3Jtc1wiKS5maW5kT25lKGZsb3cuZm9ybSlcclxuXHRcdGZvcm1GaWVsZHMgPSBmb3JtLmN1cnJlbnQuZmllbGRzIHx8IFtdXHJcblx0XHRyZWxhdGVkT2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0TmFtZSwgc3BhY2VJZClcclxuXHRcdHJlbGF0ZWRPYmplY3RzS2V5cyA9IF8ucGx1Y2socmVsYXRlZE9iamVjdHMsICdvYmplY3RfbmFtZScpXHJcblx0XHRmb3JtVGFibGVGaWVsZHMgPSBfLmZpbHRlciBmb3JtRmllbGRzLCAoZm9ybUZpZWxkKSAtPlxyXG5cdFx0XHRyZXR1cm4gZm9ybUZpZWxkLnR5cGUgPT0gJ3RhYmxlJ1xyXG5cdFx0Zm9ybVRhYmxlRmllbGRzQ29kZSA9IF8ucGx1Y2soZm9ybVRhYmxlRmllbGRzLCAnY29kZScpXHJcblxyXG5cdFx0Z2V0UmVsYXRlZE9iamVjdEZpZWxkQ29kZSA9ICAoa2V5KSAtPlxyXG5cdFx0XHRyZXR1cm4gXy5maW5kIHJlbGF0ZWRPYmplY3RzS2V5cywgIChyZWxhdGVkT2JqZWN0c0tleSkgLT5cclxuXHRcdFx0XHRyZXR1cm4ga2V5LnN0YXJ0c1dpdGgocmVsYXRlZE9iamVjdHNLZXkgKyAnLicpXHJcblxyXG5cdFx0Z2V0Rm9ybVRhYmxlRmllbGRDb2RlID0gKGtleSkgLT5cclxuXHRcdFx0cmV0dXJuIF8uZmluZCBmb3JtVGFibGVGaWVsZHNDb2RlLCAgKGZvcm1UYWJsZUZpZWxkQ29kZSkgLT5cclxuXHRcdFx0XHRyZXR1cm4ga2V5LnN0YXJ0c1dpdGgoZm9ybVRhYmxlRmllbGRDb2RlICsgJy4nKVxyXG5cclxuXHRcdGdldEZvcm1UYWJsZUZpZWxkID0gKGtleSkgLT5cclxuXHRcdFx0cmV0dXJuIF8uZmluZCBmb3JtVGFibGVGaWVsZHMsICAoZikgLT5cclxuXHRcdFx0XHRyZXR1cm4gZi5jb2RlID09IGtleVxyXG5cclxuXHRcdGdldEZvcm1GaWVsZCA9IChrZXkpIC0+XHJcblx0XHRcdHJldHVybiBfLmZpbmQgZm9ybUZpZWxkcywgIChmKSAtPlxyXG5cdFx0XHRcdHJldHVybiBmLmNvZGUgPT0ga2V5XHJcblxyXG5cdFx0Z2V0Rm9ybVRhYmxlU3ViRmllbGQgPSAodGFibGVGaWVsZCwgc3ViRmllbGRDb2RlKSAtPlxyXG5cdFx0XHRyZXR1cm4gXy5maW5kIHRhYmxlRmllbGQuZmllbGRzLCAgKGYpIC0+XHJcblx0XHRcdFx0cmV0dXJuIGYuY29kZSA9PSBzdWJGaWVsZENvZGVcclxuXHJcblx0XHRnZXRGaWVsZE9kYXRhVmFsdWUgPSAob2JqTmFtZSwgaWQpIC0+XHJcblx0XHRcdG9iaiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKVxyXG5cdFx0XHRpZiAhb2JqXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdGlmIF8uaXNTdHJpbmcgaWRcclxuXHRcdFx0XHRfcmVjb3JkID0gb2JqLmZpbmRPbmUoaWQpXHJcblx0XHRcdFx0aWYgX3JlY29yZFxyXG5cdFx0XHRcdFx0X3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkLm5hbWVcclxuXHRcdFx0XHRcdHJldHVybiBfcmVjb3JkXHJcblx0XHRcdGVsc2UgaWYgXy5pc0FycmF5IGlkXHJcblx0XHRcdFx0X3JlY29yZHMgPSBbXVxyXG5cdFx0XHRcdG9iai5maW5kKHsgX2lkOiB7ICRpbjogaWQgfSB9KS5mb3JFYWNoIChfcmVjb3JkKSAtPlxyXG5cdFx0XHRcdFx0X3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkLm5hbWVcclxuXHRcdFx0XHRcdF9yZWNvcmRzLnB1c2ggX3JlY29yZFxyXG5cclxuXHRcdFx0XHRpZiAhXy5pc0VtcHR5IF9yZWNvcmRzXHJcblx0XHRcdFx0XHRyZXR1cm4gX3JlY29yZHNcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0Z2V0U2VsZWN0VXNlclZhbHVlID0gKHVzZXJJZCwgc3BhY2VJZCkgLT5cclxuXHRcdFx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSlcclxuXHRcdFx0c3UuaWQgPSB1c2VySWRcclxuXHRcdFx0cmV0dXJuIHN1XHJcblxyXG5cdFx0Z2V0U2VsZWN0VXNlclZhbHVlcyA9ICh1c2VySWRzLCBzcGFjZUlkKSAtPlxyXG5cdFx0XHRzdXMgPSBbXVxyXG5cdFx0XHRpZiBfLmlzQXJyYXkgdXNlcklkc1xyXG5cdFx0XHRcdF8uZWFjaCB1c2VySWRzLCAodXNlcklkKSAtPlxyXG5cdFx0XHRcdFx0c3UgPSBnZXRTZWxlY3RVc2VyVmFsdWUodXNlcklkLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0aWYgc3VcclxuXHRcdFx0XHRcdFx0c3VzLnB1c2goc3UpXHJcblx0XHRcdHJldHVybiBzdXNcclxuXHJcblx0XHRnZXRTZWxlY3RPcmdWYWx1ZSA9IChvcmdJZCwgc3BhY2VJZCkgLT5cclxuXHRcdFx0b3JnID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZE9uZShvcmdJZCwgeyBmaWVsZHM6IHsgX2lkOiAxLCBuYW1lOiAxLCBmdWxsbmFtZTogMSB9IH0pXHJcblx0XHRcdG9yZy5pZCA9IG9yZ0lkXHJcblx0XHRcdHJldHVybiBvcmdcclxuXHJcblx0XHRnZXRTZWxlY3RPcmdWYWx1ZXMgPSAob3JnSWRzLCBzcGFjZUlkKSAtPlxyXG5cdFx0XHRvcmdzID0gW11cclxuXHRcdFx0aWYgXy5pc0FycmF5IG9yZ0lkc1xyXG5cdFx0XHRcdF8uZWFjaCBvcmdJZHMsIChvcmdJZCkgLT5cclxuXHRcdFx0XHRcdG9yZyA9IGdldFNlbGVjdE9yZ1ZhbHVlKG9yZ0lkLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0aWYgb3JnXHJcblx0XHRcdFx0XHRcdG9yZ3MucHVzaChvcmcpXHJcblx0XHRcdHJldHVybiBvcmdzXHJcblxyXG5cdFx0dGFibGVGaWVsZENvZGVzID0gW11cclxuXHRcdHRhYmxlRmllbGRNYXAgPSBbXVxyXG5cdFx0dGFibGVUb1JlbGF0ZWRNYXAgPSB7fVxyXG5cclxuXHRcdG93LmZpZWxkX21hcD8uZm9yRWFjaCAoZm0pIC0+XHJcblx0XHRcdG9iamVjdF9maWVsZCA9IGZtLm9iamVjdF9maWVsZFxyXG5cdFx0XHR3b3JrZmxvd19maWVsZCA9IGZtLndvcmtmbG93X2ZpZWxkXHJcblx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZENvZGUgPSBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlKG9iamVjdF9maWVsZClcclxuXHRcdFx0Zm9ybVRhYmxlRmllbGRDb2RlID0gZ2V0Rm9ybVRhYmxlRmllbGRDb2RlKHdvcmtmbG93X2ZpZWxkKVxyXG5cdFx0XHRvYmpGaWVsZCA9IG9iamVjdC5maWVsZHNbb2JqZWN0X2ZpZWxkXVxyXG5cdFx0XHRmb3JtRmllbGQgPSBnZXRGb3JtRmllbGQod29ya2Zsb3dfZmllbGQpXHJcblx0XHRcdCMg5aSE55CG5a2Q6KGo5a2X5q61XHJcblx0XHRcdGlmIHJlbGF0ZWRPYmplY3RGaWVsZENvZGVcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRvVGFibGVDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF1cclxuXHRcdFx0XHRvVGFibGVGaWVsZENvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXVxyXG5cdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwS2V5ID0gb1RhYmxlQ29kZVxyXG5cdFx0XHRcdGlmICF0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1cclxuXHRcdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSA9IHt9XHJcblxyXG5cdFx0XHRcdGlmIGZvcm1UYWJsZUZpZWxkQ29kZVxyXG5cdFx0XHRcdFx0d1RhYmxlQ29kZSA9IHdvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMF1cclxuXHRcdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVsnX0ZST01fVEFCTEVfQ09ERSddID0gd1RhYmxlQ29kZVxyXG5cclxuXHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bb1RhYmxlRmllbGRDb2RlXSA9IHdvcmtmbG93X2ZpZWxkXHJcblx0XHRcdCMg5Yik5pat5piv5ZCm5piv6KGo5qC85a2X5q61XHJcblx0XHRcdGVsc2UgaWYgd29ya2Zsb3dfZmllbGQuaW5kZXhPZignLiQuJykgPiAwIGFuZCBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPiAwXHJcblx0XHRcdFx0d1RhYmxlQ29kZSA9IHdvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJC4nKVswXVxyXG5cdFx0XHRcdG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzBdXHJcblx0XHRcdFx0aWYgcmVjb3JkLmhhc093blByb3BlcnR5KG9UYWJsZUNvZGUpIGFuZCBfLmlzQXJyYXkocmVjb3JkW29UYWJsZUNvZGVdKVxyXG5cdFx0XHRcdFx0dGFibGVGaWVsZENvZGVzLnB1c2goSlNPTi5zdHJpbmdpZnkoe1xyXG5cdFx0XHRcdFx0XHR3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxyXG5cdFx0XHRcdFx0XHRvYmplY3RfdGFibGVfZmllbGRfY29kZTogb1RhYmxlQ29kZVxyXG5cdFx0XHRcdFx0fSkpXHJcblx0XHRcdFx0XHR0YWJsZUZpZWxkTWFwLnB1c2goZm0pXHJcblxyXG5cdFx0XHQjIOWkhOeQhmxvb2t1cOOAgW1hc3Rlcl9kZXRhaWznsbvlnovlrZfmrrVcclxuXHRcdFx0ZWxzZSBpZiBvYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gMCBhbmQgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID09IC0xXHJcblx0XHRcdFx0b2JqZWN0RmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF1cclxuXHRcdFx0XHRsb29rdXBGaWVsZE5hbWUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXVxyXG5cdFx0XHRcdGlmIG9iamVjdFxyXG5cdFx0XHRcdFx0b2JqZWN0RmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdEZpZWxkTmFtZV1cclxuXHRcdFx0XHRcdGlmIG9iamVjdEZpZWxkICYmIChvYmplY3RGaWVsZC50eXBlID09IFwibG9va3VwXCIgfHwgb2JqZWN0RmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIikgJiYgIW9iamVjdEZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0XHRcdGZpZWxkc09iaiA9IHt9XHJcblx0XHRcdFx0XHRcdGZpZWxkc09ialtsb29rdXBGaWVsZE5hbWVdID0gMVxyXG5cdFx0XHRcdFx0XHRsb29rdXBPYmplY3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kT25lKHJlY29yZFtvYmplY3RGaWVsZE5hbWVdLCB7IGZpZWxkczogZmllbGRzT2JqIH0pXHJcblx0XHRcdFx0XHRcdGlmIGxvb2t1cE9iamVjdFxyXG5cdFx0XHRcdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBsb29rdXBPYmplY3RbbG9va3VwRmllbGROYW1lXVxyXG5cclxuXHRcdFx0IyBsb29rdXDjgIFtYXN0ZXJfZGV0YWls5a2X5q615ZCM5q2l5Yiwb2RhdGHlrZfmrrVcclxuXHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqRmllbGQucmVmZXJlbmNlX3RvXHJcblx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdXHJcblx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlXHJcblx0XHRcdFx0aWYgb2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXHJcblx0XHRcdFx0ZWxzZSBpZiAhb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxyXG5cdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBvZGF0YUZpZWxkVmFsdWVcclxuXHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiBbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdXHJcblx0XHRcdFx0aWYgIV8uaXNFbXB0eShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXHJcblx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlXHJcblx0XHRcdFx0XHRpZiBmb3JtRmllbGQudHlwZSA9PSAndXNlcidcclxuXHRcdFx0XHRcdFx0aWYgb2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHRlbHNlIGlmICFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRlbHNlIGlmIGZvcm1GaWVsZC50eXBlID09ICdncm91cCdcclxuXHRcdFx0XHRcdFx0aWYgb2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0c2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgIW9iakZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3RcclxuXHRcdFx0XHRcdFx0XHRzZWxlY3RGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0aWYgc2VsZWN0RmllbGRWYWx1ZVxyXG5cdFx0XHRcdFx0XHR2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gc2VsZWN0RmllbGRWYWx1ZVxyXG5cdFx0XHRlbHNlIGlmIHJlY29yZC5oYXNPd25Qcm9wZXJ0eShvYmplY3RfZmllbGQpXHJcblx0XHRcdFx0dmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHJlY29yZFtvYmplY3RfZmllbGRdXHJcblxyXG5cdFx0IyDooajmoLzlrZfmrrVcclxuXHRcdF8udW5pcSh0YWJsZUZpZWxkQ29kZXMpLmZvckVhY2ggKHRmYykgLT5cclxuXHRcdFx0YyA9IEpTT04ucGFyc2UodGZjKVxyXG5cdFx0XHR2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXSA9IFtdXHJcblx0XHRcdHJlY29yZFtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXS5mb3JFYWNoICh0cikgLT5cclxuXHRcdFx0XHRuZXdUciA9IHt9XHJcblx0XHRcdFx0Xy5lYWNoIHRyLCAodiwgaykgLT5cclxuXHRcdFx0XHRcdHRhYmxlRmllbGRNYXAuZm9yRWFjaCAodGZtKSAtPlxyXG5cdFx0XHRcdFx0XHRpZiB0Zm0ub2JqZWN0X2ZpZWxkIGlzIChjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlICsgJy4kLicgKyBrKVxyXG5cdFx0XHRcdFx0XHRcdHdUZENvZGUgPSB0Zm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4kLicpWzFdXHJcblx0XHRcdFx0XHRcdFx0bmV3VHJbd1RkQ29kZV0gPSB2XHJcblx0XHRcdFx0aWYgbm90IF8uaXNFbXB0eShuZXdUcilcclxuXHRcdFx0XHRcdHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdLnB1c2gobmV3VHIpXHJcblxyXG5cdFx0IyDlkIzmraXlrZDooajmlbDmja7oh7PooajljZXooajmoLxcclxuXHRcdF8uZWFjaCB0YWJsZVRvUmVsYXRlZE1hcCwgIChtYXAsIGtleSkgLT5cclxuXHRcdFx0dGFibGVDb2RlID0gbWFwLl9GUk9NX1RBQkxFX0NPREVcclxuXHRcdFx0Zm9ybVRhYmxlRmllbGQgPSBnZXRGb3JtVGFibGVGaWVsZCh0YWJsZUNvZGUpXHJcblx0XHRcdGlmICF0YWJsZUNvZGVcclxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ3RhYmxlVG9SZWxhdGVkOiBbJyArIGtleSArICddIG1pc3NpbmcgY29ycmVzcG9uZGluZyB0YWJsZS4nKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmVsYXRlZE9iamVjdE5hbWUgPSBrZXlcclxuXHRcdFx0XHR0YWJsZVZhbHVlcyA9IFtdXHJcblx0XHRcdFx0cmVsYXRlZFRhYmxlSXRlbXMgPSBbXVxyXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZClcclxuXHRcdFx0XHRyZWxhdGVkRmllbGQgPSBfLmZpbmQgcmVsYXRlZE9iamVjdC5maWVsZHMsIChmKSAtPlxyXG5cdFx0XHRcdFx0cmV0dXJuIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhmLnR5cGUpICYmIGYucmVmZXJlbmNlX3RvID09IG9iamVjdE5hbWVcclxuXHJcblx0XHRcdFx0cmVsYXRlZEZpZWxkTmFtZSA9IHJlbGF0ZWRGaWVsZC5uYW1lXHJcblxyXG5cdFx0XHRcdHNlbGVjdG9yID0ge31cclxuXHRcdFx0XHRzZWxlY3RvcltyZWxhdGVkRmllbGROYW1lXSA9IHJlY29yZElkXHJcblx0XHRcdFx0cmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpXHJcblx0XHRcdFx0cmVsYXRlZFJlY29yZHMgPSByZWxhdGVkQ29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKVxyXG5cclxuXHRcdFx0XHRyZWxhdGVkUmVjb3Jkcy5mb3JFYWNoIChycikgLT5cclxuXHRcdFx0XHRcdHRhYmxlVmFsdWVJdGVtID0ge31cclxuXHRcdFx0XHRcdF8uZWFjaCBtYXAsICh2YWx1ZUtleSwgZmllbGRLZXkpIC0+XHJcblx0XHRcdFx0XHRcdGlmIGZpZWxkS2V5ICE9ICdfRlJPTV9UQUJMRV9DT0RFJ1xyXG5cdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZVxyXG5cdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleVxyXG5cdFx0XHRcdFx0XHRcdGlmIHZhbHVlS2V5LnN0YXJ0c1dpdGgodGFibGVDb2RlICsgJy4nKVxyXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkS2V5ID0gKHZhbHVlS2V5LnNwbGl0KFwiLlwiKVsxXSlcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXkgPSB2YWx1ZUtleVxyXG5cdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdGZvcm1GaWVsZCA9IGdldEZvcm1UYWJsZVN1YkZpZWxkKGZvcm1UYWJsZUZpZWxkLCBmb3JtRmllbGRLZXkpXHJcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkID0gcmVsYXRlZE9iamVjdC5maWVsZHNbZmllbGRLZXldXHJcblx0XHRcdFx0XHRcdFx0aWYgIWZvcm1GaWVsZCB8fCAhcmVsYXRlZE9iamVjdEZpZWxkXHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRcdFx0XHRpZiBmb3JtRmllbGQudHlwZSA9PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhyZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gcmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90b1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcnJbZmllbGRLZXldXHJcblx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKGZvcm1GaWVsZC50eXBlKSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV1cclxuXHRcdFx0XHRcdFx0XHRcdGlmICFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBmb3JtRmllbGQudHlwZSA9PSAndXNlcidcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmICFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQudHlwZSA9PSAnZ3JvdXAnXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZClcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmICFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0T3JnVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XVxyXG5cdFx0XHRcdFx0XHRcdHRhYmxlVmFsdWVJdGVtW2Zvcm1GaWVsZEtleV0gPSB0YWJsZUZpZWxkVmFsdWVcclxuXHRcdFx0XHRcdGlmICFfLmlzRW1wdHkodGFibGVWYWx1ZUl0ZW0pXHJcblx0XHRcdFx0XHRcdHRhYmxlVmFsdWVJdGVtLl9pZCA9IHJyLl9pZFxyXG5cdFx0XHRcdFx0XHR0YWJsZVZhbHVlcy5wdXNoKHRhYmxlVmFsdWVJdGVtKVxyXG5cdFx0XHRcdFx0XHRyZWxhdGVkVGFibGVJdGVtcy5wdXNoKHsgX3RhYmxlOiB7IF9pZDogcnIuX2lkLCBfY29kZTogdGFibGVDb2RlIH0gfSApXHJcblxyXG5cdFx0XHRcdHZhbHVlc1t0YWJsZUNvZGVdID0gdGFibGVWYWx1ZXNcclxuXHRcdFx0XHRyZWxhdGVkVGFibGVzSW5mb1tyZWxhdGVkT2JqZWN0TmFtZV0gPSByZWxhdGVkVGFibGVJdGVtc1xyXG5cclxuXHRcdCMg5aaC5p6c6YWN572u5LqG6ISa5pys5YiZ5omn6KGM6ISa5pysXHJcblx0XHRpZiBvdy5maWVsZF9tYXBfc2NyaXB0XHJcblx0XHRcdF8uZXh0ZW5kKHZhbHVlcywgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5ldmFsRmllbGRNYXBTY3JpcHQob3cuZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgcmVjb3JkSWQpKVxyXG5cclxuXHQjIOi/h+a7pOaOiXZhbHVlc+S4reeahOmdnuazlWtleVxyXG5cdGZpbHRlclZhbHVlcyA9IHt9XHJcblx0Xy5lYWNoIF8ua2V5cyh2YWx1ZXMpLCAoaykgLT5cclxuXHRcdGlmIGZpZWxkQ29kZXMuaW5jbHVkZXMoaylcclxuXHRcdFx0ZmlsdGVyVmFsdWVzW2tdID0gdmFsdWVzW2tdXHJcblxyXG5cdHJldHVybiBmaWx0ZXJWYWx1ZXNcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0ID0gKGZpZWxkX21hcF9zY3JpcHQsIG9iamVjdE5hbWUsIHNwYWNlSWQsIG9iamVjdElkKSAtPlxyXG5cdHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKG9iamVjdElkKVxyXG5cdHNjcmlwdCA9IFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocmVjb3JkKSB7IFwiICsgZmllbGRfbWFwX3NjcmlwdCArIFwiIH1cIlxyXG5cdGZ1bmMgPSBfZXZhbChzY3JpcHQsIFwiZmllbGRfbWFwX3NjcmlwdFwiKVxyXG5cdHZhbHVlcyA9IGZ1bmMocmVjb3JkKVxyXG5cdGlmIF8uaXNPYmplY3QgdmFsdWVzXHJcblx0XHRyZXR1cm4gdmFsdWVzXHJcblx0ZWxzZVxyXG5cdFx0Y29uc29sZS5lcnJvciBcImV2YWxGaWVsZE1hcFNjcmlwdDog6ISa5pys6L+U5Zue5YC857G75Z6L5LiN5piv5a+56LGhXCJcclxuXHRyZXR1cm4ge31cclxuXHJcblxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZUF0dGFjaCA9IChyZWNvcmRJZHMsIHNwYWNlSWQsIGluc0lkLCBhcHByb3ZlSWQpIC0+XHJcblxyXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbJ2Ntc19maWxlcyddLmZpbmQoe1xyXG5cdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRwYXJlbnQ6IHJlY29yZElkc1xyXG5cdH0pLmZvckVhY2ggKGNmKSAtPlxyXG5cdFx0Xy5lYWNoIGNmLnZlcnNpb25zLCAodmVyc2lvbklkLCBpZHgpIC0+XHJcblx0XHRcdGYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zWydjZnMuZmlsZXMuZmlsZXJlY29yZCddLmZpbmRPbmUodmVyc2lvbklkKVxyXG5cdFx0XHRuZXdGaWxlID0gbmV3IEZTLkZpbGUoKVxyXG5cclxuXHRcdFx0bmV3RmlsZS5hdHRhY2hEYXRhIGYuY3JlYXRlUmVhZFN0cmVhbSgnZmlsZXMnKSwge1xyXG5cdFx0XHRcdFx0dHlwZTogZi5vcmlnaW5hbC50eXBlXHJcblx0XHRcdH0sIChlcnIpIC0+XHJcblx0XHRcdFx0aWYgKGVycilcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyLmVycm9yLCBlcnIucmVhc29uKVxyXG5cclxuXHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpXHJcblx0XHRcdFx0bmV3RmlsZS5zaXplKGYuc2l6ZSgpKVxyXG5cdFx0XHRcdG1ldGFkYXRhID0ge1xyXG5cdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRvd25lcl9uYW1lOiBmLm1ldGFkYXRhLm93bmVyX25hbWUsXHJcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFx0XHRcdGluc3RhbmNlOiBpbnNJZCxcclxuXHRcdFx0XHRcdGFwcHJvdmU6IGFwcHJvdmVJZFxyXG5cdFx0XHRcdFx0cGFyZW50OiBjZi5faWRcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIGlkeCBpcyAwXHJcblx0XHRcdFx0XHRtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZVxyXG5cclxuXHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGFcclxuXHRcdFx0XHRjZnMuaW5zdGFuY2VzLmluc2VydChuZXdGaWxlKVxyXG5cclxuXHRyZXR1cm5cclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8gPSAocmVjb3JkSWRzLCBpbnNJZCwgc3BhY2VJZCkgLT5cclxuXHRDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLnVwZGF0ZShyZWNvcmRJZHMuaWRzWzBdLCB7XHJcblx0XHQkcHVzaDoge1xyXG5cdFx0XHRpbnN0YW5jZXM6IHtcclxuXHRcdFx0XHQkZWFjaDogW3tcclxuXHRcdFx0XHRcdF9pZDogaW5zSWQsXHJcblx0XHRcdFx0XHRzdGF0ZTogJ2RyYWZ0J1xyXG5cdFx0XHRcdH1dLFxyXG5cdFx0XHRcdCRwb3NpdGlvbjogMFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0JHNldDoge1xyXG5cdFx0XHRsb2NrZWQ6IHRydWVcclxuXHRcdFx0aW5zdGFuY2Vfc3RhdGU6ICdkcmFmdCdcclxuXHRcdH1cclxuXHR9KVxyXG5cclxuXHRyZXR1cm5cclxuXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlUmVsYXRlZFJlY29yZEluc3RhbmNlSW5mbyA9IChyZWxhdGVkVGFibGVzSW5mbywgaW5zSWQsIHNwYWNlSWQpIC0+XHJcblx0Xy5lYWNoIHJlbGF0ZWRUYWJsZXNJbmZvLCAodGFibGVJdGVtcywgcmVsYXRlZE9iamVjdE5hbWUpIC0+XHJcblx0XHRyZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZClcclxuXHRcdF8uZWFjaCB0YWJsZUl0ZW1zLCAoaXRlbSkgLT5cclxuXHRcdFx0cmVsYXRlZENvbGxlY3Rpb24udXBkYXRlKGl0ZW0uX3RhYmxlLl9pZCwge1xyXG5cdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdGluc3RhbmNlczogW3tcclxuXHRcdFx0XHRcdFx0X2lkOiBpbnNJZCxcclxuXHRcdFx0XHRcdFx0c3RhdGU6ICdkcmFmdCdcclxuXHRcdFx0XHRcdH1dLFxyXG5cdFx0XHRcdFx0X3RhYmxlOiBpdGVtLl90YWJsZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHJcblx0cmV0dXJuXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsID0gKHJlY29yZElkcywgc3BhY2VJZCkgLT5cclxuXHRyZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLmZpbmRPbmUoe1xyXG5cdFx0X2lkOiByZWNvcmRJZHMuaWRzWzBdLCBpbnN0YW5jZXM6IHsgJGV4aXN0czogdHJ1ZSB9XHJcblx0fSwgeyBmaWVsZHM6IHsgaW5zdGFuY2VzOiAxIH0gfSlcclxuXHJcblx0aWYgcmVjb3JkIGFuZCByZWNvcmQuaW5zdGFuY2VzWzBdLnN0YXRlIGlzbnQgJ2NvbXBsZXRlZCcgYW5kIENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmZpbmQocmVjb3JkLmluc3RhbmNlc1swXS5faWQpLmNvdW50KCkgPiAwXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuatpOiusOW9leW3suWPkei1t+a1geeoi+ato+WcqOWuoeaJueS4re+8jOW+heWuoeaJuee7k+adn+aWueWPr+WPkei1t+S4i+S4gOasoeWuoeaJue+8gVwiKVxyXG5cclxuXHRyZXR1cm5cclxuXHJcbiIsInZhciBfZXZhbDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuX2V2YWwgPSByZXF1aXJlKCdldmFsJyk7XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwgPSB7fTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja19hdXRob3JpemF0aW9uID0gZnVuY3Rpb24ocmVxKSB7XG4gIHZhciBhdXRoVG9rZW4sIGhhc2hlZFRva2VuLCBxdWVyeSwgdXNlciwgdXNlcklkO1xuICBxdWVyeSA9IHJlcS5xdWVyeTtcbiAgdXNlcklkID0gcXVlcnlbXCJYLVVzZXItSWRcIl07XG4gIGF1dGhUb2tlbiA9IHF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdO1xuICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgIF9pZDogdXNlcklkLFxuICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gIH0pO1xuICBpZiAoIXVzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIHJldHVybiB1c2VyO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZSA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHZhciBzcGFjZTtcbiAgc3BhY2UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgaWYgKCFzcGFjZSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwic3BhY2VfaWTmnInor6/miJbmraRzcGFjZeW3sue7j+iiq+WIoOmZpFwiKTtcbiAgfVxuICByZXR1cm4gc3BhY2U7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3cgPSBmdW5jdGlvbihmbG93X2lkKSB7XG4gIHZhciBmbG93O1xuICBmbG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5mbG93cy5maW5kT25lKGZsb3dfaWQpO1xuICBpZiAoIWZsb3cpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcImlk5pyJ6K+v5oiW5q2k5rWB56iL5bey57uP6KKr5Yig6ZmkXCIpO1xuICB9XG4gIHJldHVybiBmbG93O1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXIgPSBmdW5jdGlvbihzcGFjZV9pZCwgdXNlcl9pZCkge1xuICB2YXIgc3BhY2VfdXNlcjtcbiAgc3BhY2VfdXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHVzZXI6IHVzZXJfaWRcbiAgfSk7XG4gIGlmICghc3BhY2VfdXNlcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwidXNlcl9pZOWvueW6lOeahOeUqOaIt+S4jeWxnuS6juW9k+WJjXNwYWNlXCIpO1xuICB9XG4gIHJldHVybiBzcGFjZV91c2VyO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXJPcmdJbmZvID0gZnVuY3Rpb24oc3BhY2VfdXNlcikge1xuICB2YXIgaW5mbywgb3JnO1xuICBpbmZvID0gbmV3IE9iamVjdDtcbiAgaW5mby5vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbjtcbiAgb3JnID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vcmdhbml6YXRpb25zLmZpbmRPbmUoc3BhY2VfdXNlci5vcmdhbml6YXRpb24sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIG5hbWU6IDEsXG4gICAgICBmdWxsbmFtZTogMVxuICAgIH1cbiAgfSk7XG4gIGluZm8ub3JnYW5pemF0aW9uX25hbWUgPSBvcmcubmFtZTtcbiAgaW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBvcmcuZnVsbG5hbWU7XG4gIHJldHVybiBpbmZvO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dFbmFibGVkID0gZnVuY3Rpb24oZmxvdykge1xuICBpZiAoZmxvdy5zdGF0ZSAhPT0gXCJlbmFibGVkXCIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+acquWQr+eUqCzmk43kvZzlpLHotKVcIik7XG4gIH1cbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93U3BhY2VNYXRjaGVkID0gZnVuY3Rpb24oZmxvdywgc3BhY2VfaWQpIHtcbiAgaWYgKGZsb3cuc3BhY2UgIT09IHNwYWNlX2lkKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvlkozlt6XkvZzljLpJROS4jeWMuemFjVwiKTtcbiAgfVxufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtID0gZnVuY3Rpb24oZm9ybV9pZCkge1xuICB2YXIgZm9ybTtcbiAgZm9ybSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZm9ybXMuZmluZE9uZShmb3JtX2lkKTtcbiAgaWYgKCFmb3JtKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+ihqOWNlUlE5pyJ6K+v5oiW5q2k6KGo5Y2V5bey57uP6KKr5Yig6ZmkJyk7XG4gIH1cbiAgcmV0dXJuIGZvcm07XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldENhdGVnb3J5ID0gZnVuY3Rpb24oY2F0ZWdvcnlfaWQpIHtcbiAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuY2F0ZWdvcmllcy5maW5kT25lKGNhdGVnb3J5X2lkKTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY3JlYXRlX2luc3RhbmNlID0gZnVuY3Rpb24oaW5zdGFuY2VfZnJvbV9jbGllbnQsIHVzZXJfaW5mbykge1xuICB2YXIgYXBwcl9vYmosIGFwcHJvdmVfZnJvbV9jbGllbnQsIGNhdGVnb3J5LCBmbG93LCBmbG93X2lkLCBmb3JtLCBpbnNfb2JqLCBuZXdfaW5zX2lkLCBub3csIHBlcm1pc3Npb25zLCByZWxhdGVkVGFibGVzSW5mbywgc3BhY2UsIHNwYWNlX2lkLCBzcGFjZV91c2VyLCBzcGFjZV91c2VyX29yZ19pbmZvLCBzdGFydF9zdGVwLCB0cmFjZV9mcm9tX2NsaWVudCwgdHJhY2Vfb2JqLCB1c2VyX2lkO1xuICBjaGVjayhpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSwgU3RyaW5nKTtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSwgU3RyaW5nKTtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdLCBTdHJpbmcpO1xuICBjaGVjayhpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl0sIFtcbiAgICB7XG4gICAgICBvOiBTdHJpbmcsXG4gICAgICBpZHM6IFtTdHJpbmddXG4gICAgfVxuICBdKTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja0lzSW5BcHByb3ZhbChpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl1bMF0sIGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0pO1xuICBzcGFjZV9pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl07XG4gIGZsb3dfaWQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl07XG4gIHVzZXJfaWQgPSB1c2VyX2luZm8uX2lkO1xuICB0cmFjZV9mcm9tX2NsaWVudCA9IG51bGw7XG4gIGFwcHJvdmVfZnJvbV9jbGllbnQgPSBudWxsO1xuICBpZiAoaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl0gJiYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF0pIHtcbiAgICB0cmFjZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdO1xuICAgIGlmICh0cmFjZV9mcm9tX2NsaWVudFtcImFwcHJvdmVzXCJdICYmIHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl1bMF0pIHtcbiAgICAgIGFwcHJvdmVfZnJvbV9jbGllbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXVtcImFwcHJvdmVzXCJdWzBdO1xuICAgIH1cbiAgfVxuICBzcGFjZSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2Uoc3BhY2VfaWQpO1xuICBmbG93ID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93KGZsb3dfaWQpO1xuICBzcGFjZV91c2VyID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXIoc3BhY2VfaWQsIHVzZXJfaWQpO1xuICBzcGFjZV91c2VyX29yZ19pbmZvID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZVVzZXJPcmdJbmZvKHNwYWNlX3VzZXIpO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd0VuYWJsZWQoZmxvdyk7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93U3BhY2VNYXRjaGVkKGZsb3csIHNwYWNlX2lkKTtcbiAgZm9ybSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybShmbG93LmZvcm0pO1xuICBwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93X2lkLCB1c2VyX2lkKTtcbiAgaWYgKCFwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkZFwiKSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5b2T5YmN55So5oi35rKh5pyJ5q2k5rWB56iL55qE5paw5bu65p2D6ZmQXCIpO1xuICB9XG4gIG5vdyA9IG5ldyBEYXRlO1xuICBpbnNfb2JqID0ge307XG4gIGluc19vYmouX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuX21ha2VOZXdJRCgpO1xuICBpbnNfb2JqLnNwYWNlID0gc3BhY2VfaWQ7XG4gIGluc19vYmouZmxvdyA9IGZsb3dfaWQ7XG4gIGluc19vYmouZmxvd192ZXJzaW9uID0gZmxvdy5jdXJyZW50Ll9pZDtcbiAgaW5zX29iai5mb3JtID0gZmxvdy5mb3JtO1xuICBpbnNfb2JqLmZvcm1fdmVyc2lvbiA9IGZsb3cuY3VycmVudC5mb3JtX3ZlcnNpb247XG4gIGluc19vYmoubmFtZSA9IGZsb3cubmFtZTtcbiAgaW5zX29iai5zdWJtaXR0ZXIgPSB1c2VyX2lkO1xuICBpbnNfb2JqLnN1Ym1pdHRlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWU7XG4gIGluc19vYmouYXBwbGljYW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA6IHVzZXJfaWQ7XG4gIGluc19vYmouYXBwbGljYW50X25hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA6IHVzZXJfaW5mby5uYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb24gPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25cIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25cIl0gOiBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbjtcbiAgaW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdIDogc3BhY2VfdXNlcl9vcmdfaW5mby5vcmdhbml6YXRpb25fbmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdIDogc3BhY2VfdXNlcl9vcmdfaW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWU7XG4gIGluc19vYmouYXBwbGljYW50X2NvbXBhbnkgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfY29tcGFueVwiXSA6IHNwYWNlX3VzZXIuY29tcGFueV9pZDtcbiAgaW5zX29iai5zdGF0ZSA9ICdkcmFmdCc7XG4gIGluc19vYmouY29kZSA9ICcnO1xuICBpbnNfb2JqLmlzX2FyY2hpdmVkID0gZmFsc2U7XG4gIGluc19vYmouaXNfZGVsZXRlZCA9IGZhbHNlO1xuICBpbnNfb2JqLmNyZWF0ZWQgPSBub3c7XG4gIGluc19vYmouY3JlYXRlZF9ieSA9IHVzZXJfaWQ7XG4gIGluc19vYmoubW9kaWZpZWQgPSBub3c7XG4gIGluc19vYmoubW9kaWZpZWRfYnkgPSB1c2VyX2lkO1xuICBpbnNfb2JqLnZhbHVlcyA9IG5ldyBPYmplY3Q7XG4gIGluc19vYmoucmVjb3JkX2lkcyA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXTtcbiAgaWYgKHNwYWNlX3VzZXIuY29tcGFueV9pZCkge1xuICAgIGluc19vYmouY29tcGFueV9pZCA9IHNwYWNlX3VzZXIuY29tcGFueV9pZDtcbiAgfVxuICB0cmFjZV9vYmogPSB7fTtcbiAgdHJhY2Vfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHI7XG4gIHRyYWNlX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkO1xuICB0cmFjZV9vYmouaXNfZmluaXNoZWQgPSBmYWxzZTtcbiAgc3RhcnRfc3RlcCA9IF8uZmluZChmbG93LmN1cnJlbnQuc3RlcHMsIGZ1bmN0aW9uKHN0ZXApIHtcbiAgICByZXR1cm4gc3RlcC5zdGVwX3R5cGUgPT09ICdzdGFydCc7XG4gIH0pO1xuICB0cmFjZV9vYmouc3RlcCA9IHN0YXJ0X3N0ZXAuX2lkO1xuICB0cmFjZV9vYmoubmFtZSA9IHN0YXJ0X3N0ZXAubmFtZTtcbiAgdHJhY2Vfb2JqLnN0YXJ0X2RhdGUgPSBub3c7XG4gIGFwcHJfb2JqID0ge307XG4gIGFwcHJfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHI7XG4gIGFwcHJfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWQ7XG4gIGFwcHJfb2JqLnRyYWNlID0gdHJhY2Vfb2JqLl9pZDtcbiAgYXBwcl9vYmouaXNfZmluaXNoZWQgPSBmYWxzZTtcbiAgYXBwcl9vYmoudXNlciA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gOiB1c2VyX2lkO1xuICBhcHByX29iai51c2VyX25hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA6IHVzZXJfaW5mby5uYW1lO1xuICBhcHByX29iai5oYW5kbGVyID0gdXNlcl9pZDtcbiAgYXBwcl9vYmouaGFuZGxlcl9uYW1lID0gdXNlcl9pbmZvLm5hbWU7XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb247XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX25hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLm5hbWU7XG4gIGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5mdWxsbmFtZTtcbiAgYXBwcl9vYmoudHlwZSA9ICdkcmFmdCc7XG4gIGFwcHJfb2JqLnN0YXJ0X2RhdGUgPSBub3c7XG4gIGFwcHJfb2JqLnJlYWRfZGF0ZSA9IG5vdztcbiAgYXBwcl9vYmouaXNfcmVhZCA9IHRydWU7XG4gIGFwcHJfb2JqLmlzX2Vycm9yID0gZmFsc2U7XG4gIGFwcHJfb2JqLmRlc2NyaXB0aW9uID0gJyc7XG4gIHJlbGF0ZWRUYWJsZXNJbmZvID0ge307XG4gIGFwcHJfb2JqLnZhbHVlcyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMoaW5zX29iai5yZWNvcmRfaWRzWzBdLCBmbG93X2lkLCBzcGFjZV9pZCwgZm9ybS5jdXJyZW50LmZpZWxkcywgcmVsYXRlZFRhYmxlc0luZm8pO1xuICB0cmFjZV9vYmouYXBwcm92ZXMgPSBbYXBwcl9vYmpdO1xuICBpbnNfb2JqLnRyYWNlcyA9IFt0cmFjZV9vYmpdO1xuICBpbnNfb2JqLmluYm94X3VzZXJzID0gaW5zdGFuY2VfZnJvbV9jbGllbnQuaW5ib3hfdXNlcnMgfHwgW107XG4gIGluc19vYmouY3VycmVudF9zdGVwX25hbWUgPSBzdGFydF9zdGVwLm5hbWU7XG4gIGlmIChmbG93LmF1dG9fcmVtaW5kID09PSB0cnVlKSB7XG4gICAgaW5zX29iai5hdXRvX3JlbWluZCA9IHRydWU7XG4gIH1cbiAgaW5zX29iai5mbG93X25hbWUgPSBmbG93Lm5hbWU7XG4gIGlmIChmb3JtLmNhdGVnb3J5KSB7XG4gICAgY2F0ZWdvcnkgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldENhdGVnb3J5KGZvcm0uY2F0ZWdvcnkpO1xuICAgIGlmIChjYXRlZ29yeSkge1xuICAgICAgaW5zX29iai5jYXRlZ29yeV9uYW1lID0gY2F0ZWdvcnkubmFtZTtcbiAgICAgIGluc19vYmouY2F0ZWdvcnkgPSBjYXRlZ29yeS5faWQ7XG4gICAgfVxuICB9XG4gIG5ld19pbnNfaWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5pbnNlcnQoaW5zX29iaik7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8oaW5zX29iai5yZWNvcmRfaWRzWzBdLCBuZXdfaW5zX2lkLCBzcGFjZV9pZCk7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvKHJlbGF0ZWRUYWJsZXNJbmZvLCBuZXdfaW5zX2lkLCBzcGFjZV9pZCk7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2goaW5zX29iai5yZWNvcmRfaWRzWzBdLCBzcGFjZV9pZCwgaW5zX29iai5faWQsIGFwcHJfb2JqLl9pZCk7XG4gIHJldHVybiBuZXdfaW5zX2lkO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVZhbHVlcyA9IGZ1bmN0aW9uKHJlY29yZElkcywgZmxvd0lkLCBzcGFjZUlkLCBmaWVsZHMsIHJlbGF0ZWRUYWJsZXNJbmZvKSB7XG4gIHZhciBmaWVsZENvZGVzLCBmaWx0ZXJWYWx1ZXMsIGZsb3csIGZvcm0sIGZvcm1GaWVsZHMsIGZvcm1UYWJsZUZpZWxkcywgZm9ybVRhYmxlRmllbGRzQ29kZSwgZ2V0RmllbGRPZGF0YVZhbHVlLCBnZXRGb3JtRmllbGQsIGdldEZvcm1UYWJsZUZpZWxkLCBnZXRGb3JtVGFibGVGaWVsZENvZGUsIGdldEZvcm1UYWJsZVN1YkZpZWxkLCBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlLCBnZXRTZWxlY3RPcmdWYWx1ZSwgZ2V0U2VsZWN0T3JnVmFsdWVzLCBnZXRTZWxlY3RVc2VyVmFsdWUsIGdldFNlbGVjdFVzZXJWYWx1ZXMsIG9iamVjdCwgb2JqZWN0TmFtZSwgb3csIHJlY29yZCwgcmVjb3JkSWQsIHJlZiwgcmVsYXRlZE9iamVjdHMsIHJlbGF0ZWRPYmplY3RzS2V5cywgdGFibGVGaWVsZENvZGVzLCB0YWJsZUZpZWxkTWFwLCB0YWJsZVRvUmVsYXRlZE1hcCwgdmFsdWVzO1xuICBmaWVsZENvZGVzID0gW107XG4gIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICBpZiAoZi50eXBlID09PSAnc2VjdGlvbicpIHtcbiAgICAgIHJldHVybiBfLmVhY2goZi5maWVsZHMsIGZ1bmN0aW9uKGZmKSB7XG4gICAgICAgIHJldHVybiBmaWVsZENvZGVzLnB1c2goZmYuY29kZSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpZWxkQ29kZXMucHVzaChmLmNvZGUpO1xuICAgIH1cbiAgfSk7XG4gIHZhbHVlcyA9IHt9O1xuICBvYmplY3ROYW1lID0gcmVjb3JkSWRzLm87XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdE5hbWUsIHNwYWNlSWQpO1xuICByZWNvcmRJZCA9IHJlY29yZElkcy5pZHNbMF07XG4gIG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3Rfd29ya2Zsb3dzLmZpbmRPbmUoe1xuICAgIG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxuICAgIGZsb3dfaWQ6IGZsb3dJZFxuICB9KTtcbiAgcmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLmZpbmRPbmUocmVjb3JkSWQpO1xuICBmbG93ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoZmxvd0lkLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBmb3JtOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKG93ICYmIHJlY29yZCkge1xuICAgIGZvcm0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJmb3Jtc1wiKS5maW5kT25lKGZsb3cuZm9ybSk7XG4gICAgZm9ybUZpZWxkcyA9IGZvcm0uY3VycmVudC5maWVsZHMgfHwgW107XG4gICAgcmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdE5hbWUsIHNwYWNlSWQpO1xuICAgIHJlbGF0ZWRPYmplY3RzS2V5cyA9IF8ucGx1Y2socmVsYXRlZE9iamVjdHMsICdvYmplY3RfbmFtZScpO1xuICAgIGZvcm1UYWJsZUZpZWxkcyA9IF8uZmlsdGVyKGZvcm1GaWVsZHMsIGZ1bmN0aW9uKGZvcm1GaWVsZCkge1xuICAgICAgcmV0dXJuIGZvcm1GaWVsZC50eXBlID09PSAndGFibGUnO1xuICAgIH0pO1xuICAgIGZvcm1UYWJsZUZpZWxkc0NvZGUgPSBfLnBsdWNrKGZvcm1UYWJsZUZpZWxkcywgJ2NvZGUnKTtcbiAgICBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKHJlbGF0ZWRPYmplY3RzS2V5cywgZnVuY3Rpb24ocmVsYXRlZE9iamVjdHNLZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleS5zdGFydHNXaXRoKHJlbGF0ZWRPYmplY3RzS2V5ICsgJy4nKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlRmllbGRDb2RlID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKGZvcm1UYWJsZUZpZWxkc0NvZGUsIGZ1bmN0aW9uKGZvcm1UYWJsZUZpZWxkQ29kZSkge1xuICAgICAgICByZXR1cm4ga2V5LnN0YXJ0c1dpdGgoZm9ybVRhYmxlRmllbGRDb2RlICsgJy4nKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlRmllbGQgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBfLmZpbmQoZm9ybVRhYmxlRmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgIHJldHVybiBmLmNvZGUgPT09IGtleTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybUZpZWxkID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKGZvcm1GaWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgcmV0dXJuIGYuY29kZSA9PT0ga2V5O1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRGb3JtVGFibGVTdWJGaWVsZCA9IGZ1bmN0aW9uKHRhYmxlRmllbGQsIHN1YkZpZWxkQ29kZSkge1xuICAgICAgcmV0dXJuIF8uZmluZCh0YWJsZUZpZWxkLmZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgICAgICByZXR1cm4gZi5jb2RlID09PSBzdWJGaWVsZENvZGU7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGdldEZpZWxkT2RhdGFWYWx1ZSA9IGZ1bmN0aW9uKG9iak5hbWUsIGlkKSB7XG4gICAgICB2YXIgX3JlY29yZCwgX3JlY29yZHMsIG9iajtcbiAgICAgIG9iaiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKTtcbiAgICAgIGlmICghb2JqKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChfLmlzU3RyaW5nKGlkKSkge1xuICAgICAgICBfcmVjb3JkID0gb2JqLmZpbmRPbmUoaWQpO1xuICAgICAgICBpZiAoX3JlY29yZCkge1xuICAgICAgICAgIF9yZWNvcmRbJ0BsYWJlbCddID0gX3JlY29yZC5uYW1lO1xuICAgICAgICAgIHJldHVybiBfcmVjb3JkO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKF8uaXNBcnJheShpZCkpIHtcbiAgICAgICAgX3JlY29yZHMgPSBbXTtcbiAgICAgICAgb2JqLmZpbmQoe1xuICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgJGluOiBpZFxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihfcmVjb3JkKSB7XG4gICAgICAgICAgX3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkLm5hbWU7XG4gICAgICAgICAgcmV0dXJuIF9yZWNvcmRzLnB1c2goX3JlY29yZCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIV8uaXNFbXB0eShfcmVjb3JkcykpIHtcbiAgICAgICAgICByZXR1cm4gX3JlY29yZHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGdldFNlbGVjdFVzZXJWYWx1ZSA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICAgICAgdmFyIHN1O1xuICAgICAgc3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0pO1xuICAgICAgc3UuaWQgPSB1c2VySWQ7XG4gICAgICByZXR1cm4gc3U7XG4gICAgfTtcbiAgICBnZXRTZWxlY3RVc2VyVmFsdWVzID0gZnVuY3Rpb24odXNlcklkcywgc3BhY2VJZCkge1xuICAgICAgdmFyIHN1cztcbiAgICAgIHN1cyA9IFtdO1xuICAgICAgaWYgKF8uaXNBcnJheSh1c2VySWRzKSkge1xuICAgICAgICBfLmVhY2godXNlcklkcywgZnVuY3Rpb24odXNlcklkKSB7XG4gICAgICAgICAgdmFyIHN1O1xuICAgICAgICAgIHN1ID0gZ2V0U2VsZWN0VXNlclZhbHVlKHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgICAgICAgaWYgKHN1KSB7XG4gICAgICAgICAgICByZXR1cm4gc3VzLnB1c2goc3UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VzO1xuICAgIH07XG4gICAgZ2V0U2VsZWN0T3JnVmFsdWUgPSBmdW5jdGlvbihvcmdJZCwgc3BhY2VJZCkge1xuICAgICAgdmFyIG9yZztcbiAgICAgIG9yZyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmRPbmUob3JnSWQsIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBvcmcuaWQgPSBvcmdJZDtcbiAgICAgIHJldHVybiBvcmc7XG4gICAgfTtcbiAgICBnZXRTZWxlY3RPcmdWYWx1ZXMgPSBmdW5jdGlvbihvcmdJZHMsIHNwYWNlSWQpIHtcbiAgICAgIHZhciBvcmdzO1xuICAgICAgb3JncyA9IFtdO1xuICAgICAgaWYgKF8uaXNBcnJheShvcmdJZHMpKSB7XG4gICAgICAgIF8uZWFjaChvcmdJZHMsIGZ1bmN0aW9uKG9yZ0lkKSB7XG4gICAgICAgICAgdmFyIG9yZztcbiAgICAgICAgICBvcmcgPSBnZXRTZWxlY3RPcmdWYWx1ZShvcmdJZCwgc3BhY2VJZCk7XG4gICAgICAgICAgaWYgKG9yZykge1xuICAgICAgICAgICAgcmV0dXJuIG9yZ3MucHVzaChvcmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3JncztcbiAgICB9O1xuICAgIHRhYmxlRmllbGRDb2RlcyA9IFtdO1xuICAgIHRhYmxlRmllbGRNYXAgPSBbXTtcbiAgICB0YWJsZVRvUmVsYXRlZE1hcCA9IHt9O1xuICAgIGlmICgocmVmID0gb3cuZmllbGRfbWFwKSAhPSBudWxsKSB7XG4gICAgICByZWYuZm9yRWFjaChmdW5jdGlvbihmbSkge1xuICAgICAgICB2YXIgZmllbGRzT2JqLCBmb3JtRmllbGQsIGZvcm1UYWJsZUZpZWxkQ29kZSwgbG9va3VwRmllbGROYW1lLCBsb29rdXBPYmplY3QsIG9UYWJsZUNvZGUsIG9UYWJsZUZpZWxkQ29kZSwgb2JqRmllbGQsIG9iamVjdEZpZWxkLCBvYmplY3RGaWVsZE5hbWUsIG9iamVjdF9maWVsZCwgb2RhdGFGaWVsZFZhbHVlLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVsYXRlZE9iamVjdEZpZWxkQ29kZSwgc2VsZWN0RmllbGRWYWx1ZSwgdGFibGVUb1JlbGF0ZWRNYXBLZXksIHdUYWJsZUNvZGUsIHdvcmtmbG93X2ZpZWxkO1xuICAgICAgICBvYmplY3RfZmllbGQgPSBmbS5vYmplY3RfZmllbGQ7XG4gICAgICAgIHdvcmtmbG93X2ZpZWxkID0gZm0ud29ya2Zsb3dfZmllbGQ7XG4gICAgICAgIHJlbGF0ZWRPYmplY3RGaWVsZENvZGUgPSBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlKG9iamVjdF9maWVsZCk7XG4gICAgICAgIGZvcm1UYWJsZUZpZWxkQ29kZSA9IGdldEZvcm1UYWJsZUZpZWxkQ29kZSh3b3JrZmxvd19maWVsZCk7XG4gICAgICAgIG9iakZpZWxkID0gb2JqZWN0LmZpZWxkc1tvYmplY3RfZmllbGRdO1xuICAgICAgICBmb3JtRmllbGQgPSBnZXRGb3JtRmllbGQod29ya2Zsb3dfZmllbGQpO1xuICAgICAgICBpZiAocmVsYXRlZE9iamVjdEZpZWxkQ29kZSkge1xuICAgICAgICAgIG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICBvVGFibGVGaWVsZENvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICB0YWJsZVRvUmVsYXRlZE1hcEtleSA9IG9UYWJsZUNvZGU7XG4gICAgICAgICAgaWYgKCF0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0pIHtcbiAgICAgICAgICAgIHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZm9ybVRhYmxlRmllbGRDb2RlKSB7XG4gICAgICAgICAgICB3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVsnX0ZST01fVEFCTEVfQ09ERSddID0gd1RhYmxlQ29kZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVtvVGFibGVGaWVsZENvZGVdID0gd29ya2Zsb3dfZmllbGQ7XG4gICAgICAgIH0gZWxzZSBpZiAod29ya2Zsb3dfZmllbGQuaW5kZXhPZignLiQuJykgPiAwICYmIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA+IDApIHtcbiAgICAgICAgICB3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4kLicpWzBdO1xuICAgICAgICAgIG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzBdO1xuICAgICAgICAgIGlmIChyZWNvcmQuaGFzT3duUHJvcGVydHkob1RhYmxlQ29kZSkgJiYgXy5pc0FycmF5KHJlY29yZFtvVGFibGVDb2RlXSkpIHtcbiAgICAgICAgICAgIHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgd29ya2Zsb3dfdGFibGVfZmllbGRfY29kZTogd1RhYmxlQ29kZSxcbiAgICAgICAgICAgICAgb2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHJldHVybiB0YWJsZUZpZWxkTWFwLnB1c2goZm0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChvYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gMCAmJiBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPT09IC0xKSB7XG4gICAgICAgICAgb2JqZWN0RmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgbG9va3VwRmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgaWYgKG9iamVjdCkge1xuICAgICAgICAgICAgb2JqZWN0RmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdEZpZWxkTmFtZV07XG4gICAgICAgICAgICBpZiAob2JqZWN0RmllbGQgJiYgKG9iamVjdEZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIgfHwgb2JqZWN0RmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpICYmICFvYmplY3RGaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICAgICAgICBmaWVsZHNPYmogPSB7fTtcbiAgICAgICAgICAgICAgZmllbGRzT2JqW2xvb2t1cEZpZWxkTmFtZV0gPSAxO1xuICAgICAgICAgICAgICBsb29rdXBPYmplY3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kT25lKHJlY29yZFtvYmplY3RGaWVsZE5hbWVdLCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiBmaWVsZHNPYmpcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmIChsb29rdXBPYmplY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IGxvb2t1cE9iamVjdFtsb29rdXBGaWVsZE5hbWVdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqRmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvYmpGaWVsZC5uYW1lXTtcbiAgICAgICAgICBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgICAgaWYgKG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvYmpGaWVsZC50eXBlKSAmJiBbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgcmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdO1xuICAgICAgICAgIGlmICghXy5pc0VtcHR5KHJlZmVyZW5jZVRvRmllbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWU7XG4gICAgICAgICAgICBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICBpZiAob2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdFVzZXJWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICghb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWUocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgICAgICBpZiAob2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlcyhyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0RmllbGRWYWx1ZSA9IGdldFNlbGVjdE9yZ1ZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxlY3RGaWVsZFZhbHVlKSB7XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gc2VsZWN0RmllbGRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLmhhc093blByb3BlcnR5KG9iamVjdF9maWVsZCkpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IHJlY29yZFtvYmplY3RfZmllbGRdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgXy51bmlxKHRhYmxlRmllbGRDb2RlcykuZm9yRWFjaChmdW5jdGlvbih0ZmMpIHtcbiAgICAgIHZhciBjO1xuICAgICAgYyA9IEpTT04ucGFyc2UodGZjKTtcbiAgICAgIHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdID0gW107XG4gICAgICByZXR1cm4gcmVjb3JkW2Mub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGVdLmZvckVhY2goZnVuY3Rpb24odHIpIHtcbiAgICAgICAgdmFyIG5ld1RyO1xuICAgICAgICBuZXdUciA9IHt9O1xuICAgICAgICBfLmVhY2godHIsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgICByZXR1cm4gdGFibGVGaWVsZE1hcC5mb3JFYWNoKGZ1bmN0aW9uKHRmbSkge1xuICAgICAgICAgICAgdmFyIHdUZENvZGU7XG4gICAgICAgICAgICBpZiAodGZtLm9iamVjdF9maWVsZCA9PT0gKGMub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGUgKyAnLiQuJyArIGspKSB7XG4gICAgICAgICAgICAgIHdUZENvZGUgPSB0Zm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4kLicpWzFdO1xuICAgICAgICAgICAgICByZXR1cm4gbmV3VHJbd1RkQ29kZV0gPSB2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFfLmlzRW1wdHkobmV3VHIpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdLnB1c2gobmV3VHIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBfLmVhY2godGFibGVUb1JlbGF0ZWRNYXAsIGZ1bmN0aW9uKG1hcCwga2V5KSB7XG4gICAgICB2YXIgZm9ybVRhYmxlRmllbGQsIHJlbGF0ZWRDb2xsZWN0aW9uLCByZWxhdGVkRmllbGQsIHJlbGF0ZWRGaWVsZE5hbWUsIHJlbGF0ZWRPYmplY3QsIHJlbGF0ZWRPYmplY3ROYW1lLCByZWxhdGVkUmVjb3JkcywgcmVsYXRlZFRhYmxlSXRlbXMsIHNlbGVjdG9yLCB0YWJsZUNvZGUsIHRhYmxlVmFsdWVzO1xuICAgICAgdGFibGVDb2RlID0gbWFwLl9GUk9NX1RBQkxFX0NPREU7XG4gICAgICBmb3JtVGFibGVGaWVsZCA9IGdldEZvcm1UYWJsZUZpZWxkKHRhYmxlQ29kZSk7XG4gICAgICBpZiAoIXRhYmxlQ29kZSkge1xuICAgICAgICByZXR1cm4gY29uc29sZS53YXJuKCd0YWJsZVRvUmVsYXRlZDogWycgKyBrZXkgKyAnXSBtaXNzaW5nIGNvcnJlc3BvbmRpbmcgdGFibGUuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWxhdGVkT2JqZWN0TmFtZSA9IGtleTtcbiAgICAgICAgdGFibGVWYWx1ZXMgPSBbXTtcbiAgICAgICAgcmVsYXRlZFRhYmxlSXRlbXMgPSBbXTtcbiAgICAgICAgcmVsYXRlZE9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKTtcbiAgICAgICAgcmVsYXRlZEZpZWxkID0gXy5maW5kKHJlbGF0ZWRPYmplY3QuZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgcmV0dXJuIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhmLnR5cGUpICYmIGYucmVmZXJlbmNlX3RvID09PSBvYmplY3ROYW1lO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVsYXRlZEZpZWxkTmFtZSA9IHJlbGF0ZWRGaWVsZC5uYW1lO1xuICAgICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgICBzZWxlY3RvcltyZWxhdGVkRmllbGROYW1lXSA9IHJlY29yZElkO1xuICAgICAgICByZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCk7XG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzID0gcmVsYXRlZENvbGxlY3Rpb24uZmluZChzZWxlY3Rvcik7XG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2goZnVuY3Rpb24ocnIpIHtcbiAgICAgICAgICB2YXIgdGFibGVWYWx1ZUl0ZW07XG4gICAgICAgICAgdGFibGVWYWx1ZUl0ZW0gPSB7fTtcbiAgICAgICAgICBfLmVhY2gobWFwLCBmdW5jdGlvbih2YWx1ZUtleSwgZmllbGRLZXkpIHtcbiAgICAgICAgICAgIHZhciBmb3JtRmllbGQsIGZvcm1GaWVsZEtleSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlbGF0ZWRPYmplY3RGaWVsZCwgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKGZpZWxkS2V5ICE9PSAnX0ZST01fVEFCTEVfQ09ERScpIHtcbiAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICBmb3JtRmllbGRLZXk7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZUtleS5zdGFydHNXaXRoKHRhYmxlQ29kZSArICcuJykpIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSAodmFsdWVLZXkuc3BsaXQoXCIuXCIpWzFdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSB2YWx1ZUtleTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBmb3JtRmllbGQgPSBnZXRGb3JtVGFibGVTdWJGaWVsZChmb3JtVGFibGVGaWVsZCwgZm9ybUZpZWxkS2V5KTtcbiAgICAgICAgICAgICAgcmVsYXRlZE9iamVjdEZpZWxkID0gcmVsYXRlZE9iamVjdC5maWVsZHNbZmllbGRLZXldO1xuICAgICAgICAgICAgICBpZiAoIWZvcm1GaWVsZCB8fCAhcmVsYXRlZE9iamVjdEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChmb3JtRmllbGQudHlwZSA9PT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb09iamVjdE5hbWUgPSByZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XTtcbiAgICAgICAgICAgICAgICBpZiAocmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV07XG4gICAgICAgICAgICAgICAgaWYgKCFfLmlzRW1wdHkocmVmZXJlbmNlVG9GaWVsZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgaWYgKGZvcm1GaWVsZC50eXBlID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RVc2VyVmFsdWVzKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlID0gZ2V0U2VsZWN0VXNlclZhbHVlKHJlZmVyZW5jZVRvRmllbGRWYWx1ZSwgc3BhY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdncm91cCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZXMocmVmZXJlbmNlVG9GaWVsZFZhbHVlLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YWJsZUZpZWxkVmFsdWUgPSBnZXRTZWxlY3RPcmdWYWx1ZShyZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHNwYWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gdGFibGVWYWx1ZUl0ZW1bZm9ybUZpZWxkS2V5XSA9IHRhYmxlRmllbGRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoIV8uaXNFbXB0eSh0YWJsZVZhbHVlSXRlbSkpIHtcbiAgICAgICAgICAgIHRhYmxlVmFsdWVJdGVtLl9pZCA9IHJyLl9pZDtcbiAgICAgICAgICAgIHRhYmxlVmFsdWVzLnB1c2godGFibGVWYWx1ZUl0ZW0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRUYWJsZUl0ZW1zLnB1c2goe1xuICAgICAgICAgICAgICBfdGFibGU6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IHJyLl9pZCxcbiAgICAgICAgICAgICAgICBfY29kZTogdGFibGVDb2RlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHZhbHVlc1t0YWJsZUNvZGVdID0gdGFibGVWYWx1ZXM7XG4gICAgICAgIHJldHVybiByZWxhdGVkVGFibGVzSW5mb1tyZWxhdGVkT2JqZWN0TmFtZV0gPSByZWxhdGVkVGFibGVJdGVtcztcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAob3cuZmllbGRfbWFwX3NjcmlwdCkge1xuICAgICAgXy5leHRlbmQodmFsdWVzLCB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmV2YWxGaWVsZE1hcFNjcmlwdChvdy5maWVsZF9tYXBfc2NyaXB0LCBvYmplY3ROYW1lLCBzcGFjZUlkLCByZWNvcmRJZCkpO1xuICAgIH1cbiAgfVxuICBmaWx0ZXJWYWx1ZXMgPSB7fTtcbiAgXy5lYWNoKF8ua2V5cyh2YWx1ZXMpLCBmdW5jdGlvbihrKSB7XG4gICAgaWYgKGZpZWxkQ29kZXMuaW5jbHVkZXMoaykpIHtcbiAgICAgIHJldHVybiBmaWx0ZXJWYWx1ZXNba10gPSB2YWx1ZXNba107XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZpbHRlclZhbHVlcztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0ID0gZnVuY3Rpb24oZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgb2JqZWN0SWQpIHtcbiAgdmFyIGZ1bmMsIHJlY29yZCwgc2NyaXB0LCB2YWx1ZXM7XG4gIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKG9iamVjdElkKTtcbiAgc2NyaXB0ID0gXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZWNvcmQpIHsgXCIgKyBmaWVsZF9tYXBfc2NyaXB0ICsgXCIgfVwiO1xuICBmdW5jID0gX2V2YWwoc2NyaXB0LCBcImZpZWxkX21hcF9zY3JpcHRcIik7XG4gIHZhbHVlcyA9IGZ1bmMocmVjb3JkKTtcbiAgaWYgKF8uaXNPYmplY3QodmFsdWVzKSkge1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcihcImV2YWxGaWVsZE1hcFNjcmlwdDog6ISa5pys6L+U5Zue5YC857G75Z6L5LiN5piv5a+56LGhXCIpO1xuICB9XG4gIHJldHVybiB7fTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2ggPSBmdW5jdGlvbihyZWNvcmRJZHMsIHNwYWNlSWQsIGluc0lkLCBhcHByb3ZlSWQpIHtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1snY21zX2ZpbGVzJ10uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgcGFyZW50OiByZWNvcmRJZHNcbiAgfSkuZm9yRWFjaChmdW5jdGlvbihjZikge1xuICAgIHJldHVybiBfLmVhY2goY2YudmVyc2lvbnMsIGZ1bmN0aW9uKHZlcnNpb25JZCwgaWR4KSB7XG4gICAgICB2YXIgZiwgbmV3RmlsZTtcbiAgICAgIGYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zWydjZnMuZmlsZXMuZmlsZXJlY29yZCddLmZpbmRPbmUodmVyc2lvbklkKTtcbiAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgICAgcmV0dXJuIG5ld0ZpbGUuYXR0YWNoRGF0YShmLmNyZWF0ZVJlYWRTdHJlYW0oJ2ZpbGVzJyksIHtcbiAgICAgICAgdHlwZTogZi5vcmlnaW5hbC50eXBlXG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdmFyIG1ldGFkYXRhO1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnIuZXJyb3IsIGVyci5yZWFzb24pO1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUubmFtZShmLm5hbWUoKSk7XG4gICAgICAgIG5ld0ZpbGUuc2l6ZShmLnNpemUoKSk7XG4gICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgIG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxuICAgICAgICAgIG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICBpbnN0YW5jZTogaW5zSWQsXG4gICAgICAgICAgYXBwcm92ZTogYXBwcm92ZUlkLFxuICAgICAgICAgIHBhcmVudDogY2YuX2lkXG4gICAgICAgIH07XG4gICAgICAgIGlmIChpZHggPT09IDApIHtcbiAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgIHJldHVybiBjZnMuaW5zdGFuY2VzLmluc2VydChuZXdGaWxlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8gPSBmdW5jdGlvbihyZWNvcmRJZHMsIGluc0lkLCBzcGFjZUlkKSB7XG4gIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkudXBkYXRlKHJlY29yZElkcy5pZHNbMF0sIHtcbiAgICAkcHVzaDoge1xuICAgICAgaW5zdGFuY2VzOiB7XG4gICAgICAgICRlYWNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgX2lkOiBpbnNJZCxcbiAgICAgICAgICAgIHN0YXRlOiAnZHJhZnQnXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICAkcG9zaXRpb246IDBcbiAgICAgIH1cbiAgICB9LFxuICAgICRzZXQ6IHtcbiAgICAgIGxvY2tlZDogdHJ1ZSxcbiAgICAgIGluc3RhbmNlX3N0YXRlOiAnZHJhZnQnXG4gICAgfVxuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWxhdGVkUmVjb3JkSW5zdGFuY2VJbmZvID0gZnVuY3Rpb24ocmVsYXRlZFRhYmxlc0luZm8sIGluc0lkLCBzcGFjZUlkKSB7XG4gIF8uZWFjaChyZWxhdGVkVGFibGVzSW5mbywgZnVuY3Rpb24odGFibGVJdGVtcywgcmVsYXRlZE9iamVjdE5hbWUpIHtcbiAgICB2YXIgcmVsYXRlZENvbGxlY3Rpb247XG4gICAgcmVsYXRlZENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpO1xuICAgIHJldHVybiBfLmVhY2godGFibGVJdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIHJlbGF0ZWRDb2xsZWN0aW9uLnVwZGF0ZShpdGVtLl90YWJsZS5faWQsIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGluc3RhbmNlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBfaWQ6IGluc0lkLFxuICAgICAgICAgICAgICBzdGF0ZTogJ2RyYWZ0J1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAgX3RhYmxlOiBpdGVtLl90YWJsZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsID0gZnVuY3Rpb24ocmVjb3JkSWRzLCBzcGFjZUlkKSB7XG4gIHZhciByZWNvcmQ7XG4gIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkuZmluZE9uZSh7XG4gICAgX2lkOiByZWNvcmRJZHMuaWRzWzBdLFxuICAgIGluc3RhbmNlczoge1xuICAgICAgJGV4aXN0czogdHJ1ZVxuICAgIH1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgaW5zdGFuY2VzOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKHJlY29yZCAmJiByZWNvcmQuaW5zdGFuY2VzWzBdLnN0YXRlICE9PSAnY29tcGxldGVkJyAmJiBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kKHJlY29yZC5pbnN0YW5jZXNbMF0uX2lkKS5jb3VudCgpID4gMCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5q2k6K6w5b2V5bey5Y+R6LW35rWB56iL5q2j5Zyo5a6h5om55Lit77yM5b6F5a6h5om557uT5p2f5pa55Y+v5Y+R6LW35LiL5LiA5qyh5a6h5om577yBXCIpO1xuICB9XG59O1xuIiwiSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL3MzL1wiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cclxuXHRKc29uUm91dGVzLnBhcnNlRmlsZXMgcmVxLCByZXMsICgpLT5cclxuXHRcdGNvbGxlY3Rpb24gPSBjZnMuZmlsZXNcclxuXHRcdGZpbGVDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRPYmplY3QoXCJjbXNfZmlsZXNcIikuZGJcclxuXHJcblx0XHRpZiByZXEuZmlsZXMgYW5kIHJlcS5maWxlc1swXVxyXG5cclxuXHRcdFx0bmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XHJcblx0XHRcdG5ld0ZpbGUuYXR0YWNoRGF0YSByZXEuZmlsZXNbMF0uZGF0YSwge3R5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZX0sIChlcnIpIC0+XHJcblx0XHRcdFx0ZmlsZW5hbWUgPSByZXEuZmlsZXNbMF0uZmlsZW5hbWVcclxuXHRcdFx0XHRleHRlbnRpb24gPSBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpXHJcblx0XHRcdFx0aWYgW1wiaW1hZ2UuanBnXCIsIFwiaW1hZ2UuZ2lmXCIsIFwiaW1hZ2UuanBlZ1wiLCBcImltYWdlLnBuZ1wiXS5pbmNsdWRlcyhmaWxlbmFtZS50b0xvd2VyQ2FzZSgpKVxyXG5cdFx0XHRcdFx0ZmlsZW5hbWUgPSBcImltYWdlLVwiICsgbW9tZW50KG5ldyBEYXRlKCkpLmZvcm1hdCgnWVlZWU1NRERISG1tc3MnKSArIFwiLlwiICsgZXh0ZW50aW9uXHJcblxyXG5cdFx0XHRcdGJvZHkgPSByZXEuYm9keVxyXG5cdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0aWYgYm9keSAmJiAoYm9keVsndXBsb2FkX2Zyb20nXSBpcyBcIklFXCIgb3IgYm9keVsndXBsb2FkX2Zyb20nXSBpcyBcIm5vZGVcIilcclxuXHRcdFx0XHRcdFx0ZmlsZW5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQoZmlsZW5hbWUpXHJcblx0XHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihmaWxlbmFtZSlcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZVxyXG5cdFx0XHRcdFx0ZmlsZW5hbWUgPSBmaWxlbmFtZS5yZXBsYWNlKC8lL2csIFwiLVwiKVxyXG5cclxuXHRcdFx0XHRuZXdGaWxlLm5hbWUoZmlsZW5hbWUpXHJcblxyXG5cdFx0XHRcdGlmIGJvZHkgJiYgYm9keVsnb3duZXInXSAmJiBib2R5WydzcGFjZSddICYmIGJvZHlbJ3JlY29yZF9pZCddICAmJiBib2R5WydvYmplY3RfbmFtZSddXHJcblx0XHRcdFx0XHRwYXJlbnQgPSBib2R5WydwYXJlbnQnXVxyXG5cdFx0XHRcdFx0b3duZXIgPSBib2R5Wydvd25lciddXHJcblx0XHRcdFx0XHRvd25lcl9uYW1lID0gYm9keVsnb3duZXJfbmFtZSddXHJcblx0XHRcdFx0XHRzcGFjZSA9IGJvZHlbJ3NwYWNlJ11cclxuXHRcdFx0XHRcdHJlY29yZF9pZCA9IGJvZHlbJ3JlY29yZF9pZCddXHJcblx0XHRcdFx0XHRvYmplY3RfbmFtZSA9IGJvZHlbJ29iamVjdF9uYW1lJ11cclxuXHRcdFx0XHRcdHBhcmVudCA9IGJvZHlbJ3BhcmVudCddXHJcblx0XHRcdFx0XHRtZXRhZGF0YSA9IHtvd25lcjpvd25lciwgb3duZXJfbmFtZTpvd25lcl9uYW1lLCBzcGFjZTpzcGFjZSwgcmVjb3JkX2lkOnJlY29yZF9pZCwgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lfVxyXG5cdFx0XHRcdFx0aWYgcGFyZW50XHJcblx0XHRcdFx0XHRcdG1ldGFkYXRhLnBhcmVudCA9IHBhcmVudFxyXG5cdFx0XHRcdFx0bmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhXHJcblx0XHRcdFx0XHRmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxyXG5cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxyXG5cclxuXHJcblx0XHRcdFx0c2l6ZSA9IGZpbGVPYmoub3JpZ2luYWwuc2l6ZVxyXG5cdFx0XHRcdGlmICFzaXplXHJcblx0XHRcdFx0XHRzaXplID0gMTAyNFxyXG5cdFx0XHRcdGlmIHBhcmVudFxyXG5cdFx0XHRcdFx0ZmlsZUNvbGxlY3Rpb24udXBkYXRlKHtfaWQ6cGFyZW50fSx7XHJcblx0XHRcdFx0XHRcdCRzZXQ6XHJcblx0XHRcdFx0XHRcdFx0ZXh0ZW50aW9uOiBleHRlbnRpb25cclxuXHRcdFx0XHRcdFx0XHRzaXplOiBzaXplXHJcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWQ6IChuZXcgRGF0ZSgpKVxyXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiBvd25lclxyXG5cdFx0XHRcdFx0XHQkcHVzaDpcclxuXHRcdFx0XHRcdFx0XHR2ZXJzaW9uczpcclxuXHRcdFx0XHRcdFx0XHRcdCRlYWNoOiBbIGZpbGVPYmouX2lkIF1cclxuXHRcdFx0XHRcdFx0XHRcdCRwb3NpdGlvbjogMFxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRuZXdGaWxlT2JqSWQgPSBmaWxlQ29sbGVjdGlvbi5kaXJlY3QuaW5zZXJ0IHtcclxuXHRcdFx0XHRcdFx0bmFtZTogZmlsZW5hbWVcclxuXHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246ICcnXHJcblx0XHRcdFx0XHRcdGV4dGVudGlvbjogZXh0ZW50aW9uXHJcblx0XHRcdFx0XHRcdHNpemU6IHNpemVcclxuXHRcdFx0XHRcdFx0dmVyc2lvbnM6IFtmaWxlT2JqLl9pZF1cclxuXHRcdFx0XHRcdFx0cGFyZW50OiB7bzpvYmplY3RfbmFtZSxpZHM6W3JlY29yZF9pZF19XHJcblx0XHRcdFx0XHRcdG93bmVyOiBvd25lclxyXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VcclxuXHRcdFx0XHRcdFx0Y3JlYXRlZDogKG5ldyBEYXRlKCkpXHJcblx0XHRcdFx0XHRcdGNyZWF0ZWRfYnk6IG93bmVyXHJcblx0XHRcdFx0XHRcdG1vZGlmaWVkOiAobmV3IERhdGUoKSlcclxuXHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IG93bmVyXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRmaWxlT2JqLnVwZGF0ZSh7JHNldDogeydtZXRhZGF0YS5wYXJlbnQnIDogbmV3RmlsZU9iaklkfX0pXHJcblxyXG5cdFx0XHRcdHJlc3AgPVxyXG5cdFx0XHRcdFx0dmVyc2lvbl9pZDogZmlsZU9iai5faWQsXHJcblx0XHRcdFx0XHRzaXplOiBzaXplXHJcblxyXG5cdFx0XHRcdHJlcy5zZXRIZWFkZXIoXCJ4LWFtei12ZXJzaW9uLWlkXCIsZmlsZU9iai5faWQpO1xyXG5cdFx0XHRcdHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXMuc3RhdHVzQ29kZSA9IDUwMDtcclxuXHRcdFx0cmVzLmVuZCgpO1xyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL3MzLzpjb2xsZWN0aW9uXCIsICAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0dHJ5XHJcblx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIHBlcm1pc3Npb25cIilcclxuXHJcblx0XHRjb2xsZWN0aW9uTmFtZSA9IHJlcS5wYXJhbXMuY29sbGVjdGlvblxyXG5cclxuXHRcdEpzb25Sb3V0ZXMucGFyc2VGaWxlcyByZXEsIHJlcywgKCktPlxyXG5cdFx0XHRjb2xsZWN0aW9uID0gY2ZzW2NvbGxlY3Rpb25OYW1lXVxyXG5cclxuXHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBDb2xsZWN0aW9uXCIpXHJcblxyXG5cdFx0XHRpZiByZXEuZmlsZXMgYW5kIHJlcS5maWxlc1swXVxyXG5cclxuXHRcdFx0XHRuZXdGaWxlID0gbmV3IEZTLkZpbGUoKVxyXG5cdFx0XHRcdG5ld0ZpbGUubmFtZShyZXEuZmlsZXNbMF0uZmlsZW5hbWUpXHJcblxyXG5cdFx0XHRcdGlmIHJlcS5ib2R5XHJcblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gcmVxLmJvZHlcclxuXHJcblx0XHRcdFx0bmV3RmlsZS5vd25lciA9IHVzZXJJZFxyXG5cdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEub3duZXIgPSB1c2VySWRcclxuXHJcblx0XHRcdFx0bmV3RmlsZS5hdHRhY2hEYXRhIHJlcS5maWxlc1swXS5kYXRhLCB7dHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlfVxyXG5cclxuXHRcdFx0XHRjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXHJcblxyXG5cdFx0XHRcdHJlc3VsdERhdGEgPSBjb2xsZWN0aW9uLmZpbGVzLmZpbmRPbmUobmV3RmlsZS5faWQpXHJcblx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRcdFx0ZGF0YTogcmVzdWx0RGF0YVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gRmlsZVwiKVxyXG5cclxuXHRcdHJldHVyblxyXG5cdGNhdGNoIGVcclxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRjb2RlOiBlLmVycm9yIHx8IDUwMFxyXG5cdFx0XHRkYXRhOiB7ZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2V9XHJcblx0XHR9XHJcblxyXG5cclxuXHJcbmdldFF1ZXJ5U3RyaW5nID0gKGFjY2Vzc0tleUlkLCBzZWNyZXRBY2Nlc3NLZXksIHF1ZXJ5LCBtZXRob2QpIC0+XHJcblx0Y29uc29sZS5sb2cgXCItLS0tdXVmbG93TWFuYWdlci5nZXRRdWVyeVN0cmluZy0tLS1cIlxyXG5cdEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKVxyXG5cdGRhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKVxyXG5cclxuXHRxdWVyeS5Gb3JtYXQgPSBcImpzb25cIlxyXG5cdHF1ZXJ5LlZlcnNpb24gPSBcIjIwMTctMDMtMjFcIlxyXG5cdHF1ZXJ5LkFjY2Vzc0tleUlkID0gYWNjZXNzS2V5SWRcclxuXHRxdWVyeS5TaWduYXR1cmVNZXRob2QgPSBcIkhNQUMtU0hBMVwiXHJcblx0cXVlcnkuVGltZXN0YW1wID0gQUxZLnV0aWwuZGF0ZS5pc284NjAxKGRhdGUpXHJcblx0cXVlcnkuU2lnbmF0dXJlVmVyc2lvbiA9IFwiMS4wXCJcclxuXHRxdWVyeS5TaWduYXR1cmVOb25jZSA9IFN0cmluZyhkYXRlLmdldFRpbWUoKSlcclxuXHJcblx0cXVlcnlLZXlzID0gT2JqZWN0LmtleXMocXVlcnkpXHJcblx0cXVlcnlLZXlzLnNvcnQoKVxyXG5cclxuXHRjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcgPSBcIlwiXHJcblx0cXVlcnlLZXlzLmZvckVhY2ggKG5hbWUpIC0+XHJcblx0XHRjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcgKz0gXCImXCIgKyBuYW1lICsgXCI9XCIgKyBBTFkudXRpbC5wb3BFc2NhcGUocXVlcnlbbmFtZV0pXHJcblxyXG5cdHN0cmluZ1RvU2lnbiA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpICsgJyYlMkYmJyArIEFMWS51dGlsLnBvcEVzY2FwZShjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcuc3Vic3RyKDEpKVxyXG5cclxuXHRxdWVyeS5TaWduYXR1cmUgPSBBTFkudXRpbC5jcnlwdG8uaG1hYyhzZWNyZXRBY2Nlc3NLZXkgKyAnJicsIHN0cmluZ1RvU2lnbiwgJ2Jhc2U2NCcsICdzaGExJylcclxuXHJcblx0cXVlcnlTdHIgPSBBTFkudXRpbC5xdWVyeVBhcmFtc1RvU3RyaW5nKHF1ZXJ5KVxyXG5cdGNvbnNvbGUubG9nIHF1ZXJ5U3RyXHJcblx0cmV0dXJuIHF1ZXJ5U3RyXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvczMvdm9kL3VwbG9hZFwiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0dXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKVxyXG5cdFx0aWYgIXVzZXJJZFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBwZXJtaXNzaW9uXCIpXHJcblxyXG5cdFx0Y29sbGVjdGlvbk5hbWUgPSBcInZpZGVvc1wiXHJcblxyXG5cdFx0QUxZID0gcmVxdWlyZSgnYWxpeXVuLXNkaycpXHJcblxyXG5cdFx0SnNvblJvdXRlcy5wYXJzZUZpbGVzIHJlcSwgcmVzLCAoKS0+XHJcblx0XHRcdGNvbGxlY3Rpb24gPSBjZnNbY29sbGVjdGlvbk5hbWVdXHJcblxyXG5cdFx0XHRpZiBub3QgY29sbGVjdGlvblxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIENvbGxlY3Rpb25cIilcclxuXHJcblx0XHRcdGlmIHJlcS5maWxlcyBhbmQgcmVxLmZpbGVzWzBdXHJcblxyXG5cdFx0XHRcdGlmIGNvbGxlY3Rpb25OYW1lIGlzICd2aWRlb3MnIGFuZCBNZXRlb3Iuc2V0dGluZ3MucHVibGljLmNmcz8uc3RvcmUgaXMgXCJPU1NcIlxyXG5cdFx0XHRcdFx0YWNjZXNzS2V5SWQgPSBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bj8uYWNjZXNzS2V5SWRcclxuXHRcdFx0XHRcdHNlY3JldEFjY2Vzc0tleSA9IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuPy5zZWNyZXRBY2Nlc3NLZXlcclxuXHJcblx0XHRcdFx0XHRkYXRlID0gQUxZLnV0aWwuZGF0ZS5nZXREYXRlKClcclxuXHJcblx0XHRcdFx0XHRxdWVyeSA9IHtcclxuXHRcdFx0XHRcdFx0QWN0aW9uOiBcIkNyZWF0ZVVwbG9hZFZpZGVvXCJcclxuXHRcdFx0XHRcdFx0VGl0bGU6IHJlcS5maWxlc1swXS5maWxlbmFtZVxyXG5cdFx0XHRcdFx0XHRGaWxlTmFtZTogcmVxLmZpbGVzWzBdLmZpbGVuYW1lXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dXJsID0gXCJodHRwOi8vdm9kLmNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS8/XCIgKyBnZXRRdWVyeVN0cmluZyhhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBxdWVyeSwgJ0dFVCcpXHJcblxyXG5cdFx0XHRcdFx0ciA9IEhUVFAuY2FsbCAnR0VUJywgdXJsXHJcblxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgclxyXG5cclxuXHRcdFx0XHRcdGlmIHIuZGF0YT8uVmlkZW9JZFxyXG5cdFx0XHRcdFx0XHR2aWRlb0lkID0gci5kYXRhLlZpZGVvSWRcclxuXHRcdFx0XHRcdFx0dXBsb2FkQWRkcmVzcyA9IEpTT04ucGFyc2UobmV3IEJ1ZmZlcihyLmRhdGEuVXBsb2FkQWRkcmVzcywgJ2Jhc2U2NCcpLnRvU3RyaW5nKCkpXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nIHVwbG9hZEFkZHJlc3NcclxuXHRcdFx0XHRcdFx0dXBsb2FkQXV0aCA9IEpTT04ucGFyc2UobmV3IEJ1ZmZlcihyLmRhdGEuVXBsb2FkQXV0aCwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCkpXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nIHVwbG9hZEF1dGhcclxuXHJcblx0XHRcdFx0XHRcdG9zcyA9IG5ldyBBTFkuT1NTKHtcclxuXHRcdFx0XHRcdFx0XHRcImFjY2Vzc0tleUlkXCI6IHVwbG9hZEF1dGguQWNjZXNzS2V5SWQsXHJcblx0XHRcdFx0XHRcdFx0XCJzZWNyZXRBY2Nlc3NLZXlcIjogdXBsb2FkQXV0aC5BY2Nlc3NLZXlTZWNyZXQsXHJcblx0XHRcdFx0XHRcdFx0XCJlbmRwb2ludFwiOiB1cGxvYWRBZGRyZXNzLkVuZHBvaW50LFxyXG5cdFx0XHRcdFx0XHRcdFwiYXBpVmVyc2lvblwiOiAnMjAxMy0xMC0xNScsXHJcblx0XHRcdFx0XHRcdFx0XCJzZWN1cml0eVRva2VuXCI6IHVwbG9hZEF1dGguU2VjdXJpdHlUb2tlblxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRcdFx0b3NzLnB1dE9iamVjdCB7XHJcblx0XHRcdFx0XHRcdFx0QnVja2V0OiB1cGxvYWRBZGRyZXNzLkJ1Y2tldCxcclxuXHRcdFx0XHRcdFx0XHRLZXk6IHVwbG9hZEFkZHJlc3MuRmlsZU5hbWUsXHJcblx0XHRcdFx0XHRcdFx0Qm9keTogcmVxLmZpbGVzWzBdLmRhdGEsXHJcblx0XHRcdFx0XHRcdFx0QWNjZXNzQ29udHJvbEFsbG93T3JpZ2luOiAnJyxcclxuXHRcdFx0XHRcdFx0XHRDb250ZW50VHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlLFxyXG5cdFx0XHRcdFx0XHRcdENhY2hlQ29udHJvbDogJ25vLWNhY2hlJyxcclxuXHRcdFx0XHRcdFx0XHRDb250ZW50RGlzcG9zaXRpb246ICcnLFxyXG5cdFx0XHRcdFx0XHRcdENvbnRlbnRFbmNvZGluZzogJ3V0Zi04JyxcclxuXHRcdFx0XHRcdFx0XHRTZXJ2ZXJTaWRlRW5jcnlwdGlvbjogJ0FFUzI1NicsXHJcblx0XHRcdFx0XHRcdFx0RXhwaXJlczogbnVsbFxyXG5cdFx0XHRcdFx0XHR9LCBNZXRlb3IuYmluZEVudmlyb25tZW50IChlcnIsIGRhdGEpIC0+XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIGVyclxyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ2Vycm9yOicsIGVycilcclxuXHRcdFx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlcnIubWVzc2FnZSlcclxuXHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ3N1Y2Nlc3M6JywgZGF0YSlcclxuXHJcblx0XHRcdFx0XHRcdFx0bmV3RGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpXHJcblxyXG5cdFx0XHRcdFx0XHRcdGdldFBsYXlJbmZvUXVlcnkgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRBY3Rpb246ICdHZXRQbGF5SW5mbydcclxuXHRcdFx0XHRcdFx0XHRcdFZpZGVvSWQ6IHZpZGVvSWRcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGdldFBsYXlJbmZvVXJsID0gXCJodHRwOi8vdm9kLmNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS8/XCIgKyBnZXRRdWVyeVN0cmluZyhhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBnZXRQbGF5SW5mb1F1ZXJ5LCAnR0VUJylcclxuXHJcblx0XHRcdFx0XHRcdFx0Z2V0UGxheUluZm9SZXN1bHQgPSBIVFRQLmNhbGwgJ0dFVCcsIGdldFBsYXlJbmZvVXJsXHJcblxyXG5cdFx0XHRcdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdFx0XHRcdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGE6IGdldFBsYXlJbmZvUmVzdWx0XHJcblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gRmlsZVwiKVxyXG5cclxuXHRcdHJldHVyblxyXG5cdGNhdGNoIGVcclxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRjb2RlOiBlLmVycm9yIHx8IDUwMFxyXG5cdFx0XHRkYXRhOiB7ZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2V9XHJcblx0XHR9IiwidmFyIGdldFF1ZXJ5U3RyaW5nO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvczMvXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHJldHVybiBKc29uUm91dGVzLnBhcnNlRmlsZXMocmVxLCByZXMsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb2xsZWN0aW9uLCBmaWxlQ29sbGVjdGlvbiwgbmV3RmlsZTtcbiAgICBjb2xsZWN0aW9uID0gY2ZzLmZpbGVzO1xuICAgIGZpbGVDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRPYmplY3QoXCJjbXNfZmlsZXNcIikuZGI7XG4gICAgaWYgKHJlcS5maWxlcyAmJiByZXEuZmlsZXNbMF0pIHtcbiAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgICAgcmV0dXJuIG5ld0ZpbGUuYXR0YWNoRGF0YShyZXEuZmlsZXNbMF0uZGF0YSwge1xuICAgICAgICB0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGVcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICB2YXIgYm9keSwgZSwgZXh0ZW50aW9uLCBmaWxlT2JqLCBmaWxlbmFtZSwgbWV0YWRhdGEsIG5ld0ZpbGVPYmpJZCwgb2JqZWN0X25hbWUsIG93bmVyLCBvd25lcl9uYW1lLCBwYXJlbnQsIHJlY29yZF9pZCwgcmVzcCwgc2l6ZSwgc3BhY2U7XG4gICAgICAgIGZpbGVuYW1lID0gcmVxLmZpbGVzWzBdLmZpbGVuYW1lO1xuICAgICAgICBleHRlbnRpb24gPSBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpO1xuICAgICAgICBpZiAoW1wiaW1hZ2UuanBnXCIsIFwiaW1hZ2UuZ2lmXCIsIFwiaW1hZ2UuanBlZ1wiLCBcImltYWdlLnBuZ1wiXS5pbmNsdWRlcyhmaWxlbmFtZS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgIGZpbGVuYW1lID0gXCJpbWFnZS1cIiArIG1vbWVudChuZXcgRGF0ZSgpKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzJykgKyBcIi5cIiArIGV4dGVudGlvbjtcbiAgICAgICAgfVxuICAgICAgICBib2R5ID0gcmVxLmJvZHk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKGJvZHkgJiYgKGJvZHlbJ3VwbG9hZF9mcm9tJ10gPT09IFwiSUVcIiB8fCBib2R5Wyd1cGxvYWRfZnJvbSddID09PSBcIm5vZGVcIikpIHtcbiAgICAgICAgICAgIGZpbGVuYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KGZpbGVuYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZmlsZW5hbWUpO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgZmlsZW5hbWUgPSBmaWxlbmFtZS5yZXBsYWNlKC8lL2csIFwiLVwiKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm5hbWUoZmlsZW5hbWUpO1xuICAgICAgICBpZiAoYm9keSAmJiBib2R5Wydvd25lciddICYmIGJvZHlbJ3NwYWNlJ10gJiYgYm9keVsncmVjb3JkX2lkJ10gJiYgYm9keVsnb2JqZWN0X25hbWUnXSkge1xuICAgICAgICAgIHBhcmVudCA9IGJvZHlbJ3BhcmVudCddO1xuICAgICAgICAgIG93bmVyID0gYm9keVsnb3duZXInXTtcbiAgICAgICAgICBvd25lcl9uYW1lID0gYm9keVsnb3duZXJfbmFtZSddO1xuICAgICAgICAgIHNwYWNlID0gYm9keVsnc3BhY2UnXTtcbiAgICAgICAgICByZWNvcmRfaWQgPSBib2R5WydyZWNvcmRfaWQnXTtcbiAgICAgICAgICBvYmplY3RfbmFtZSA9IGJvZHlbJ29iamVjdF9uYW1lJ107XG4gICAgICAgICAgcGFyZW50ID0gYm9keVsncGFyZW50J107XG4gICAgICAgICAgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICBvd25lcl9uYW1lOiBvd25lcl9uYW1lLFxuICAgICAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICAgICAgcmVjb3JkX2lkOiByZWNvcmRfaWQsXG4gICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgc2l6ZSA9IGZpbGVPYmoub3JpZ2luYWwuc2l6ZTtcbiAgICAgICAgaWYgKCFzaXplKSB7XG4gICAgICAgICAgc2l6ZSA9IDEwMjQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgIGZpbGVDb2xsZWN0aW9uLnVwZGF0ZSh7XG4gICAgICAgICAgICBfaWQ6IHBhcmVudFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgZXh0ZW50aW9uOiBleHRlbnRpb24sXG4gICAgICAgICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgICBtb2RpZmllZF9ieTogb3duZXJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICAgICB2ZXJzaW9uczoge1xuICAgICAgICAgICAgICAgICRlYWNoOiBbZmlsZU9iai5faWRdLFxuICAgICAgICAgICAgICAgICRwb3NpdGlvbjogMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3RmlsZU9iaklkID0gZmlsZUNvbGxlY3Rpb24uZGlyZWN0Lmluc2VydCh7XG4gICAgICAgICAgICBuYW1lOiBmaWxlbmFtZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgICAgIGV4dGVudGlvbjogZXh0ZW50aW9uLFxuICAgICAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgICAgIHZlcnNpb25zOiBbZmlsZU9iai5faWRdLFxuICAgICAgICAgICAgcGFyZW50OiB7XG4gICAgICAgICAgICAgIG86IG9iamVjdF9uYW1lLFxuICAgICAgICAgICAgICBpZHM6IFtyZWNvcmRfaWRdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIGNyZWF0ZWRfYnk6IG93bmVyLFxuICAgICAgICAgICAgbW9kaWZpZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBtb2RpZmllZF9ieTogb3duZXJcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBmaWxlT2JqLnVwZGF0ZSh7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICdtZXRhZGF0YS5wYXJlbnQnOiBuZXdGaWxlT2JqSWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXNwID0ge1xuICAgICAgICAgIHZlcnNpb25faWQ6IGZpbGVPYmouX2lkLFxuICAgICAgICAgIHNpemU6IHNpemVcbiAgICAgICAgfTtcbiAgICAgICAgcmVzLnNldEhlYWRlcihcIngtYW16LXZlcnNpb24taWRcIiwgZmlsZU9iai5faWQpO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgIHJldHVybiByZXMuZW5kKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvczMvOmNvbGxlY3Rpb25cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGNvbGxlY3Rpb25OYW1lLCBlLCB1c2VySWQ7XG4gIHRyeSB7XG4gICAgdXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKTtcbiAgICB9XG4gICAgY29sbGVjdGlvbk5hbWUgPSByZXEucGFyYW1zLmNvbGxlY3Rpb247XG4gICAgSnNvblJvdXRlcy5wYXJzZUZpbGVzKHJlcSwgcmVzLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uLCBuZXdGaWxlLCByZXN1bHREYXRhO1xuICAgICAgY29sbGVjdGlvbiA9IGNmc1tjb2xsZWN0aW9uTmFtZV07XG4gICAgICBpZiAoIWNvbGxlY3Rpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gQ29sbGVjdGlvblwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXEuZmlsZXMgJiYgcmVxLmZpbGVzWzBdKSB7XG4gICAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgICAgICBuZXdGaWxlLm5hbWUocmVxLmZpbGVzWzBdLmZpbGVuYW1lKTtcbiAgICAgICAgaWYgKHJlcS5ib2R5KSB7XG4gICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IHJlcS5ib2R5O1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUub3duZXIgPSB1c2VySWQ7XG4gICAgICAgIG5ld0ZpbGUubWV0YWRhdGEub3duZXIgPSB1c2VySWQ7XG4gICAgICAgIG5ld0ZpbGUuYXR0YWNoRGF0YShyZXEuZmlsZXNbMF0uZGF0YSwge1xuICAgICAgICAgIHR5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZVxuICAgICAgICB9KTtcbiAgICAgICAgY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgIHJlc3VsdERhdGEgPSBjb2xsZWN0aW9uLmZpbGVzLmZpbmRPbmUobmV3RmlsZS5faWQpO1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgIGRhdGE6IHJlc3VsdERhdGFcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBGaWxlXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiBlLmVycm9yIHx8IDUwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG5cbmdldFF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24oYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgcXVlcnksIG1ldGhvZCkge1xuICB2YXIgQUxZLCBjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcsIGRhdGUsIHF1ZXJ5S2V5cywgcXVlcnlTdHIsIHN0cmluZ1RvU2lnbjtcbiAgY29uc29sZS5sb2coXCItLS0tdXVmbG93TWFuYWdlci5nZXRRdWVyeVN0cmluZy0tLS1cIik7XG4gIEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKTtcbiAgZGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpO1xuICBxdWVyeS5Gb3JtYXQgPSBcImpzb25cIjtcbiAgcXVlcnkuVmVyc2lvbiA9IFwiMjAxNy0wMy0yMVwiO1xuICBxdWVyeS5BY2Nlc3NLZXlJZCA9IGFjY2Vzc0tleUlkO1xuICBxdWVyeS5TaWduYXR1cmVNZXRob2QgPSBcIkhNQUMtU0hBMVwiO1xuICBxdWVyeS5UaW1lc3RhbXAgPSBBTFkudXRpbC5kYXRlLmlzbzg2MDEoZGF0ZSk7XG4gIHF1ZXJ5LlNpZ25hdHVyZVZlcnNpb24gPSBcIjEuMFwiO1xuICBxdWVyeS5TaWduYXR1cmVOb25jZSA9IFN0cmluZyhkYXRlLmdldFRpbWUoKSk7XG4gIHF1ZXJ5S2V5cyA9IE9iamVjdC5rZXlzKHF1ZXJ5KTtcbiAgcXVlcnlLZXlzLnNvcnQoKTtcbiAgY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nID0gXCJcIjtcbiAgcXVlcnlLZXlzLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiBjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcgKz0gXCImXCIgKyBuYW1lICsgXCI9XCIgKyBBTFkudXRpbC5wb3BFc2NhcGUocXVlcnlbbmFtZV0pO1xuICB9KTtcbiAgc3RyaW5nVG9TaWduID0gbWV0aG9kLnRvVXBwZXJDYXNlKCkgKyAnJiUyRiYnICsgQUxZLnV0aWwucG9wRXNjYXBlKGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZy5zdWJzdHIoMSkpO1xuICBxdWVyeS5TaWduYXR1cmUgPSBBTFkudXRpbC5jcnlwdG8uaG1hYyhzZWNyZXRBY2Nlc3NLZXkgKyAnJicsIHN0cmluZ1RvU2lnbiwgJ2Jhc2U2NCcsICdzaGExJyk7XG4gIHF1ZXJ5U3RyID0gQUxZLnV0aWwucXVlcnlQYXJhbXNUb1N0cmluZyhxdWVyeSk7XG4gIGNvbnNvbGUubG9nKHF1ZXJ5U3RyKTtcbiAgcmV0dXJuIHF1ZXJ5U3RyO1xufTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL3MzL3ZvZC91cGxvYWRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIEFMWSwgY29sbGVjdGlvbk5hbWUsIGUsIHVzZXJJZDtcbiAgdHJ5IHtcbiAgICB1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBwZXJtaXNzaW9uXCIpO1xuICAgIH1cbiAgICBjb2xsZWN0aW9uTmFtZSA9IFwidmlkZW9zXCI7XG4gICAgQUxZID0gcmVxdWlyZSgnYWxpeXVuLXNkaycpO1xuICAgIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyhyZXEsIHJlcywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYWNjZXNzS2V5SWQsIGNvbGxlY3Rpb24sIGRhdGUsIG9zcywgcXVlcnksIHIsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgc2VjcmV0QWNjZXNzS2V5LCB1cGxvYWRBZGRyZXNzLCB1cGxvYWRBdXRoLCB1cmwsIHZpZGVvSWQ7XG4gICAgICBjb2xsZWN0aW9uID0gY2ZzW2NvbGxlY3Rpb25OYW1lXTtcbiAgICAgIGlmICghY29sbGVjdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBDb2xsZWN0aW9uXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHJlcS5maWxlcyAmJiByZXEuZmlsZXNbMF0pIHtcbiAgICAgICAgaWYgKGNvbGxlY3Rpb25OYW1lID09PSAndmlkZW9zJyAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS5jZnMpICE9IG51bGwgPyByZWYuc3RvcmUgOiB2b2lkIDApID09PSBcIk9TU1wiKSB7XG4gICAgICAgICAgYWNjZXNzS2V5SWQgPSAocmVmMSA9IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKSAhPSBudWxsID8gcmVmMS5hY2Nlc3NLZXlJZCA6IHZvaWQgMDtcbiAgICAgICAgICBzZWNyZXRBY2Nlc3NLZXkgPSAocmVmMiA9IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKSAhPSBudWxsID8gcmVmMi5zZWNyZXRBY2Nlc3NLZXkgOiB2b2lkIDA7XG4gICAgICAgICAgZGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpO1xuICAgICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgICAgQWN0aW9uOiBcIkNyZWF0ZVVwbG9hZFZpZGVvXCIsXG4gICAgICAgICAgICBUaXRsZTogcmVxLmZpbGVzWzBdLmZpbGVuYW1lLFxuICAgICAgICAgICAgRmlsZU5hbWU6IHJlcS5maWxlc1swXS5maWxlbmFtZVxuICAgICAgICAgIH07XG4gICAgICAgICAgdXJsID0gXCJodHRwOi8vdm9kLmNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS8/XCIgKyBnZXRRdWVyeVN0cmluZyhhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBxdWVyeSwgJ0dFVCcpO1xuICAgICAgICAgIHIgPSBIVFRQLmNhbGwoJ0dFVCcsIHVybCk7XG4gICAgICAgICAgY29uc29sZS5sb2cocik7XG4gICAgICAgICAgaWYgKChyZWYzID0gci5kYXRhKSAhPSBudWxsID8gcmVmMy5WaWRlb0lkIDogdm9pZCAwKSB7XG4gICAgICAgICAgICB2aWRlb0lkID0gci5kYXRhLlZpZGVvSWQ7XG4gICAgICAgICAgICB1cGxvYWRBZGRyZXNzID0gSlNPTi5wYXJzZShuZXcgQnVmZmVyKHIuZGF0YS5VcGxvYWRBZGRyZXNzLCAnYmFzZTY0JykudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1cGxvYWRBZGRyZXNzKTtcbiAgICAgICAgICAgIHVwbG9hZEF1dGggPSBKU09OLnBhcnNlKG5ldyBCdWZmZXIoci5kYXRhLlVwbG9hZEF1dGgsICdiYXNlNjQnKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVwbG9hZEF1dGgpO1xuICAgICAgICAgICAgb3NzID0gbmV3IEFMWS5PU1Moe1xuICAgICAgICAgICAgICBcImFjY2Vzc0tleUlkXCI6IHVwbG9hZEF1dGguQWNjZXNzS2V5SWQsXG4gICAgICAgICAgICAgIFwic2VjcmV0QWNjZXNzS2V5XCI6IHVwbG9hZEF1dGguQWNjZXNzS2V5U2VjcmV0LFxuICAgICAgICAgICAgICBcImVuZHBvaW50XCI6IHVwbG9hZEFkZHJlc3MuRW5kcG9pbnQsXG4gICAgICAgICAgICAgIFwiYXBpVmVyc2lvblwiOiAnMjAxMy0xMC0xNScsXG4gICAgICAgICAgICAgIFwic2VjdXJpdHlUb2tlblwiOiB1cGxvYWRBdXRoLlNlY3VyaXR5VG9rZW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG9zcy5wdXRPYmplY3Qoe1xuICAgICAgICAgICAgICBCdWNrZXQ6IHVwbG9hZEFkZHJlc3MuQnVja2V0LFxuICAgICAgICAgICAgICBLZXk6IHVwbG9hZEFkZHJlc3MuRmlsZU5hbWUsXG4gICAgICAgICAgICAgIEJvZHk6IHJlcS5maWxlc1swXS5kYXRhLFxuICAgICAgICAgICAgICBBY2Nlc3NDb250cm9sQWxsb3dPcmlnaW46ICcnLFxuICAgICAgICAgICAgICBDb250ZW50VHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlLFxuICAgICAgICAgICAgICBDYWNoZUNvbnRyb2w6ICduby1jYWNoZScsXG4gICAgICAgICAgICAgIENvbnRlbnREaXNwb3NpdGlvbjogJycsXG4gICAgICAgICAgICAgIENvbnRlbnRFbmNvZGluZzogJ3V0Zi04JyxcbiAgICAgICAgICAgICAgU2VydmVyU2lkZUVuY3J5cHRpb246ICdBRVMyNTYnLFxuICAgICAgICAgICAgICBFeHBpcmVzOiBudWxsXG4gICAgICAgICAgICB9LCBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgICB2YXIgZ2V0UGxheUluZm9RdWVyeSwgZ2V0UGxheUluZm9SZXN1bHQsIGdldFBsYXlJbmZvVXJsLCBuZXdEYXRlO1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yOicsIGVycik7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc3VjY2VzczonLCBkYXRhKTtcbiAgICAgICAgICAgICAgbmV3RGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpO1xuICAgICAgICAgICAgICBnZXRQbGF5SW5mb1F1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgIEFjdGlvbjogJ0dldFBsYXlJbmZvJyxcbiAgICAgICAgICAgICAgICBWaWRlb0lkOiB2aWRlb0lkXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGdldFBsYXlJbmZvVXJsID0gXCJodHRwOi8vdm9kLmNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS8/XCIgKyBnZXRRdWVyeVN0cmluZyhhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBnZXRQbGF5SW5mb1F1ZXJ5LCAnR0VUJyk7XG4gICAgICAgICAgICAgIGdldFBsYXlJbmZvUmVzdWx0ID0gSFRUUC5jYWxsKCdHRVQnLCBnZXRQbGF5SW5mb1VybCk7XG4gICAgICAgICAgICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGdldFBsYXlJbmZvUmVzdWx0XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gRmlsZVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogZS5lcnJvciB8fCA1MDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgJ3Bvc3QnLCAnL2FwaS9vYmplY3Qvd29ya2Zsb3cvZHJhZnRzJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxyXG5cdFx0Y3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkXHJcblxyXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxyXG5cclxuXHRcdGluc2VydGVkX2luc3RhbmNlcyA9IG5ldyBBcnJheVxyXG5cclxuXHRcdF8uZWFjaCBoYXNoRGF0YVsnSW5zdGFuY2VzJ10sIChpbnN0YW5jZV9mcm9tX2NsaWVudCkgLT5cclxuXHRcdFx0bmV3X2luc19pZCA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY3JlYXRlX2luc3RhbmNlKGluc3RhbmNlX2Zyb21fY2xpZW50LCBjdXJyZW50X3VzZXJfaW5mbylcclxuXHJcblx0XHRcdG5ld19pbnMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kT25lKHsgX2lkOiBuZXdfaW5zX2lkIH0sIHsgZmllbGRzOiB7IHNwYWNlOiAxLCBmbG93OiAxLCBmbG93X3ZlcnNpb246IDEsIGZvcm06IDEsIGZvcm1fdmVyc2lvbjogMSB9IH0pXHJcblxyXG5cdFx0XHRpbnNlcnRlZF9pbnN0YW5jZXMucHVzaChuZXdfaW5zKVxyXG5cclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdGRhdGE6IHsgaW5zZXJ0czogaW5zZXJ0ZWRfaW5zdGFuY2VzIH1cclxuXHRcdH1cclxuXHRjYXRjaCBlXHJcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbeyBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XSB9XHJcblx0XHR9XHJcblxyXG4iLCJKc29uUm91dGVzLmFkZCgncG9zdCcsICcvYXBpL29iamVjdC93b3JrZmxvdy9kcmFmdHMnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgY3VycmVudF91c2VyX2lkLCBjdXJyZW50X3VzZXJfaW5mbywgZSwgaGFzaERhdGEsIGluc2VydGVkX2luc3RhbmNlcztcbiAgdHJ5IHtcbiAgICBjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpO1xuICAgIGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZDtcbiAgICBoYXNoRGF0YSA9IHJlcS5ib2R5O1xuICAgIGluc2VydGVkX2luc3RhbmNlcyA9IG5ldyBBcnJheTtcbiAgICBfLmVhY2goaGFzaERhdGFbJ0luc3RhbmNlcyddLCBmdW5jdGlvbihpbnN0YW5jZV9mcm9tX2NsaWVudCkge1xuICAgICAgdmFyIG5ld19pbnMsIG5ld19pbnNfaWQ7XG4gICAgICBuZXdfaW5zX2lkID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UoaW5zdGFuY2VfZnJvbV9jbGllbnQsIGN1cnJlbnRfdXNlcl9pbmZvKTtcbiAgICAgIG5ld19pbnMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kT25lKHtcbiAgICAgICAgX2lkOiBuZXdfaW5zX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHNwYWNlOiAxLFxuICAgICAgICAgIGZsb3c6IDEsXG4gICAgICAgICAgZmxvd192ZXJzaW9uOiAxLFxuICAgICAgICAgIGZvcm06IDEsXG4gICAgICAgICAgZm9ybV92ZXJzaW9uOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGluc2VydGVkX2luc3RhbmNlcy5wdXNoKG5ld19pbnMpO1xuICAgIH0pO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGluc2VydHM6IGluc2VydGVkX2luc3RhbmNlc1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIl19
