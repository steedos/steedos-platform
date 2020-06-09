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
  return ReactSteedos.pluginComponentSelector(ReactSteedos.store.getState(), "Dashboard", app._id);
};

Creator.getAppObjectNames = function (app_id) {
  var app, appObjects, isMobile, objects;
  app = Creator.getApp(app_id);
  isMobile = Steedos.isMobile();
  appObjects = isMobile ? app.mobile_objects : app.objects;
  objects = [];

  if (app) {
    _.each(appObjects, function (v) {
      var obj;
      obj = Creator.getObject(v);

      if ((obj != null ? obj.permissions.get().allowRead : void 0) && !obj.hidden) {
        return objects.push(v);
      }
    });
  }

  return objects;
};

Creator.getVisibleApps = function (includeAdmin) {
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
      return !obj.hidden;
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
  var actions, disabled_actions, obj, permissions;

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

  _.each(actions, function (action) {
    if (Steedos.isMobile() && action.on === "record" && action.name !== 'standard_edit') {
      return action.on = 'record_more';
    }
  });

  actions = _.filter(actions, function (action) {
    return _.indexOf(disabled_actions, action.name) < 0;
  });
  return actions;
};

/返回当前用户有权限访问的所有list_view，包括分享的，用户自定义非分享的（除非owner变了），以及默认的其他视图注意Creator.getPermissions函数中是不会有用户自定义非分享的视图的，所以Creator.getPermissions函数中拿到的结果不全，并不是当前用户能看到所有视图/;

Creator.getListViews = function (object_name, spaceId, userId) {
  var disabled_list_views, isMobile, list_views, object;

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

  object = Creator.getObject(object_name);

  if (!object) {
    return;
  }

  disabled_list_views = Creator.getPermissions(object_name, spaceId, userId).disabled_list_views || [];
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
  var fieldsName, unreadable_fields;

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
  unreadable_fields = Creator.getPermissions(object_name, spaceId, userId).unreadable_fields;
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
  var appr_obj, approve_from_client, category, flow, flow_id, form, ins_obj, new_ins_id, now, permissions, space, space_id, space_user, space_user_org_info, start_step, trace_from_client, trace_obj, user_id;
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
  appr_obj.values = uuflowManagerForInitApproval.initiateValues(ins_obj.record_ids[0], flow_id, space_id, form.current.fields);
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
  uuflowManagerForInitApproval.initiateAttach(ins_obj.record_ids[0], space_id, ins_obj._id, appr_obj._id);
  uuflowManagerForInitApproval.initiateRecordInstanceInfo(ins_obj.record_ids[0], new_ins_id, space_id);
  return new_ins_id;
};

uuflowManagerForInitApproval.initiateValues = function (recordIds, flowId, spaceId, fields) {
  var fieldCodes, filterValues, flow, form, formFields, formTableFields, formTableFieldsCode, getFieldOdataValue, getFormField, getFormTableField, getFormTableFieldCode, getFormTableSubField, getRelatedObjectFieldCode, object, objectName, ow, record, recordId, ref, relatedObjects, relatedObjectsKeys, tableFieldCodes, tableFieldMap, tableToRelatedMap, values;
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

    tableFieldCodes = [];
    tableFieldMap = [];
    tableToRelatedMap = {};

    if ((ref = ow.field_map) != null) {
      ref.forEach(function (fm) {
        var fieldsObj, formField, formTableFieldCode, lookupFieldName, lookupObject, oTableCode, oTableFieldCode, objField, objectField, objectFieldName, object_field, odataFieldValue, referenceToFieldValue, referenceToObjectName, relatedObjectFieldCode, tableToRelatedMapKey, wTableCode, workflow_field;
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
      var formTableField, relatedField, relatedFieldName, relatedObject, relatedObjectName, relatedRecords, selector, tableCode, tableValues;
      tableCode = map._FROM_TABLE_CODE;
      formTableField = getFormTableField(tableCode);

      if (!tableCode) {
        return console.warn('tableToRelated: [' + key + '] missing corresponding table.');
      } else {
        relatedObjectName = key;
        tableValues = [];
        relatedObject = Creator.getObject(relatedObjectName, spaceId);
        relatedField = _.find(relatedObject.fields, function (f) {
          return ['lookup', 'master_detail'].includes(f.type) && f.reference_to === objectName;
        });
        relatedFieldName = relatedField.name;
        selector = {};
        selector[relatedFieldName] = recordId;
        relatedRecords = Creator.getCollection(relatedObjectName).find(selector);
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

              if (formField.type === 'odata' && ['lookup', 'master_detail'].includes(relatedObjectField.type) && _.isString(relatedObjectField.reference_to)) {
                referenceToObjectName = relatedObjectField.reference_to;
                referenceToFieldValue = rr[fieldKey];

                if (relatedObjectField.multiple && formField.is_multiselect) {
                  tableFieldValue = getFieldOdataValue(referenceToObjectName, referenceToFieldValue);
                } else if (!relatedObjectField.multiple && !formField.is_multiselect) {
                  tableFieldValue = getFieldOdataValue(referenceToObjectName, referenceToFieldValue);
                }
              } else {
                tableFieldValue = rr[fieldKey];
              }

              return tableValueItem[formFieldKey] = tableFieldValue;
            }
          });

          return tableValues.push(tableValueItem);
        });
        return values[tableCode] = tableValues;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjcmVhdG9yL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvbGliL2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvb2JqZWN0X3JlY2VudF92aWV3ZWQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3ZpZXdlZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3JlY29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9yZWNlbnRfcmVjb3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9yZXBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3JlcG9ydF9kYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfZXhwb3J0MnhtbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9leHBvcnQyeG1sLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3JlbGF0ZWRfb2JqZWN0c19yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvcGVuZGluZ19zcGFjZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3BlbmRpbmdfc3BhY2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF90YWJ1bGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF9saXN0dmlld3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy91c2VyX3RhYnVsYXJfc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9yZWxhdGVkX29iamVjdHNfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV91c2VyX2luZm8uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c192aWV3X2xpbWl0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfdmlld19saW1pdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c19ub19mb3JjZV9waG9uZV91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9uZWVkX3RvX2NvbmZpcm0uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX25lZWRfdG9fY29uZmlybS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbGliL3Blcm1pc3Npb25fbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvcGVybWlzc2lvbl9tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9zMy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImJ1c2JveSIsIm1rZGlycCIsIk1ldGVvciIsInNldHRpbmdzIiwiY2ZzIiwiYWxpeXVuIiwiQ3JlYXRvciIsImdldFNjaGVtYSIsIm9iamVjdF9uYW1lIiwicmVmIiwiZ2V0T2JqZWN0Iiwic2NoZW1hIiwiZ2V0T2JqZWN0VXJsIiwicmVjb3JkX2lkIiwiYXBwX2lkIiwibGlzdF92aWV3IiwibGlzdF92aWV3X2lkIiwiU2Vzc2lvbiIsImdldCIsImdldExpc3RWaWV3IiwiX2lkIiwiZ2V0UmVsYXRpdmVVcmwiLCJnZXRPYmplY3RSb3V0ZXJVcmwiLCJnZXRMaXN0Vmlld1VybCIsInVybCIsImdldExpc3RWaWV3UmVsYXRpdmVVcmwiLCJnZXRTd2l0Y2hMaXN0VXJsIiwiZ2V0UmVsYXRlZE9iamVjdFVybCIsInJlbGF0ZWRfb2JqZWN0X25hbWUiLCJnZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMiLCJpc19kZWVwIiwiaXNfc2tpcF9oaWRlIiwiaXNfcmVsYXRlZCIsIl9vYmplY3QiLCJfb3B0aW9ucyIsImZpZWxkcyIsImljb24iLCJyZWxhdGVkT2JqZWN0cyIsIl8iLCJmb3JFYWNoIiwiZiIsImsiLCJoaWRkZW4iLCJ0eXBlIiwicHVzaCIsImxhYmVsIiwidmFsdWUiLCJyX29iamVjdCIsInJlZmVyZW5jZV90byIsImlzU3RyaW5nIiwiZjIiLCJrMiIsImdldFJlbGF0ZWRPYmplY3RzIiwiZWFjaCIsIl90aGlzIiwiX3JlbGF0ZWRPYmplY3QiLCJyZWxhdGVkT2JqZWN0IiwicmVsYXRlZE9wdGlvbnMiLCJyZWxhdGVkT3B0aW9uIiwiZm9yZWlnbl9rZXkiLCJuYW1lIiwiZ2V0T2JqZWN0RmlsdGVyRmllbGRPcHRpb25zIiwicGVybWlzc2lvbl9maWVsZHMiLCJnZXRGaWVsZHMiLCJpbmNsdWRlIiwidGVzdCIsImluZGV4T2YiLCJnZXRPYmplY3RGaWVsZE9wdGlvbnMiLCJnZXRGaWx0ZXJzV2l0aEZpbHRlckZpZWxkcyIsImZpbHRlcnMiLCJmaWx0ZXJfZmllbGRzIiwibGVuZ3RoIiwibiIsImZpZWxkIiwicmVxdWlyZWQiLCJmaW5kV2hlcmUiLCJpc19kZWZhdWx0IiwiaXNfcmVxdWlyZWQiLCJmaWx0ZXJJdGVtIiwibWF0Y2hGaWVsZCIsImZpbmQiLCJnZXRPYmplY3RSZWNvcmQiLCJzZWxlY3RfZmllbGRzIiwiZXhwYW5kIiwiY29sbGVjdGlvbiIsInJlY29yZCIsInJlZjEiLCJyZWYyIiwiaXNDbGllbnQiLCJUZW1wbGF0ZSIsImluc3RhbmNlIiwib2RhdGEiLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsImdldEFwcCIsImFwcCIsIkFwcHMiLCJkZXBzIiwiZGVwZW5kIiwiZ2V0QXBwRGFzaGJvYXJkIiwiZGFzaGJvYXJkIiwiRGFzaGJvYXJkcyIsImFwcHMiLCJnZXRBcHBEYXNoYm9hcmRDb21wb25lbnQiLCJSZWFjdFN0ZWVkb3MiLCJwbHVnaW5Db21wb25lbnRTZWxlY3RvciIsInN0b3JlIiwiZ2V0U3RhdGUiLCJnZXRBcHBPYmplY3ROYW1lcyIsImFwcE9iamVjdHMiLCJpc01vYmlsZSIsIm9iamVjdHMiLCJTdGVlZG9zIiwibW9iaWxlX29iamVjdHMiLCJvYmoiLCJwZXJtaXNzaW9ucyIsImFsbG93UmVhZCIsImdldFZpc2libGVBcHBzIiwiaW5jbHVkZUFkbWluIiwidmlzaWJsZUFwcHNTZWxlY3RvciIsImdldFZpc2libGVBcHBzT2JqZWN0cyIsInZpc2libGVPYmplY3ROYW1lcyIsImZsYXR0ZW4iLCJwbHVjayIsImZpbHRlciIsIk9iamVjdHMiLCJzb3J0Iiwic29ydGluZ01ldGhvZCIsImJpbmQiLCJrZXkiLCJ1bmlxIiwiZ2V0QXBwc09iamVjdHMiLCJ0ZW1wT2JqZWN0cyIsImNvbmNhdCIsInZhbGlkYXRlRmlsdGVycyIsImxvZ2ljIiwiZSIsImVycm9yTXNnIiwiZmlsdGVyX2l0ZW1zIiwiZmlsdGVyX2xlbmd0aCIsImZsYWciLCJpbmRleCIsIndvcmQiLCJtYXAiLCJpc0VtcHR5IiwiY29tcGFjdCIsInJlcGxhY2UiLCJtYXRjaCIsImkiLCJpbmNsdWRlcyIsInciLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJ0b2FzdHIiLCJmb3JtYXRGaWx0ZXJzVG9Nb25nbyIsIm9wdGlvbnMiLCJzZWxlY3RvciIsIkFycmF5Iiwib3BlcmF0aW9uIiwib3B0aW9uIiwicmVnIiwic3ViX3NlbGVjdG9yIiwiZXZhbHVhdGVGb3JtdWxhIiwiUmVnRXhwIiwiaXNCZXR3ZWVuRmlsdGVyT3BlcmF0aW9uIiwiZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzIiwiZm9ybWF0RmlsdGVyc1RvRGV2IiwibG9naWNUZW1wRmlsdGVycyIsInN0ZWVkb3NGaWx0ZXJzIiwicmVxdWlyZSIsImlzX2xvZ2ljX29yIiwicG9wIiwiVVNFUl9DT05URVhUIiwiZm9ybWF0TG9naWNGaWx0ZXJzVG9EZXYiLCJmaWx0ZXJfbG9naWMiLCJmb3JtYXRfbG9naWMiLCJ4IiwiX2YiLCJpc0FycmF5IiwiSlNPTiIsInN0cmluZ2lmeSIsInNwYWNlSWQiLCJ1c2VySWQiLCJyZWxhdGVkX29iamVjdF9uYW1lcyIsInJlbGF0ZWRfb2JqZWN0cyIsInVucmVsYXRlZF9vYmplY3RzIiwiZ2V0T2JqZWN0UmVsYXRlZHMiLCJfY29sbGVjdGlvbl9uYW1lIiwiZ2V0UGVybWlzc2lvbnMiLCJkaWZmZXJlbmNlIiwicmVsYXRlZF9vYmplY3QiLCJpc0FjdGl2ZSIsImdldFJlbGF0ZWRPYmplY3ROYW1lcyIsImdldEFjdGlvbnMiLCJhY3Rpb25zIiwiZGlzYWJsZWRfYWN0aW9ucyIsInNvcnRCeSIsInZhbHVlcyIsImFjdGlvbiIsIm9uIiwiZ2V0TGlzdFZpZXdzIiwiZGlzYWJsZWRfbGlzdF92aWV3cyIsImxpc3Rfdmlld3MiLCJvYmplY3QiLCJpdGVtIiwiaXRlbV9uYW1lIiwib3duZXIiLCJmaWVsZHNOYW1lIiwidW5yZWFkYWJsZV9maWVsZHMiLCJnZXRPYmplY3RGaWVsZHNOYW1lIiwiaXNsb2FkaW5nIiwiYm9vdHN0cmFwTG9hZGVkIiwiY29udmVydFNwZWNpYWxDaGFyYWN0ZXIiLCJzdHIiLCJnZXREaXNhYmxlZEZpZWxkcyIsImZpZWxkTmFtZSIsImF1dG9mb3JtIiwiZGlzYWJsZWQiLCJvbWl0IiwiZ2V0SGlkZGVuRmllbGRzIiwiZ2V0RmllbGRzV2l0aE5vR3JvdXAiLCJncm91cCIsImdldFNvcnRlZEZpZWxkR3JvdXBOYW1lcyIsIm5hbWVzIiwidW5pcXVlIiwiZ2V0RmllbGRzRm9yR3JvdXAiLCJncm91cE5hbWUiLCJnZXRGaWVsZHNXaXRob3V0T21pdCIsImtleXMiLCJwaWNrIiwiZ2V0RmllbGRzSW5GaXJzdExldmVsIiwiZmlyc3RMZXZlbEtleXMiLCJnZXRGaWVsZHNGb3JSZW9yZGVyIiwiaXNTaW5nbGUiLCJfa2V5cyIsImNoaWxkS2V5cyIsImlzX3dpZGVfMSIsImlzX3dpZGVfMiIsInNjXzEiLCJzY18yIiwiZW5kc1dpdGgiLCJpc193aWRlIiwic2xpY2UiLCJpc0ZpbHRlclZhbHVlRW1wdHkiLCJOdW1iZXIiLCJpc05hTiIsImlzU2VydmVyIiwiZ2V0QWxsUmVsYXRlZE9iamVjdHMiLCJyZWxhdGVkX2ZpZWxkIiwicmVsYXRlZF9maWVsZF9uYW1lIiwiZW5hYmxlX2ZpbGVzIiwiYXBwc0J5TmFtZSIsIm1ldGhvZHMiLCJzcGFjZV9pZCIsImNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZCIsImN1cnJlbnRfcmVjZW50X3ZpZXdlZCIsImRvYyIsInNwYWNlIiwidXBkYXRlIiwiJGluYyIsImNvdW50IiwiJHNldCIsIm1vZGlmaWVkIiwiRGF0ZSIsIm1vZGlmaWVkX2J5IiwiaW5zZXJ0IiwiX21ha2VOZXdJRCIsIm8iLCJpZHMiLCJjcmVhdGVkIiwiY3JlYXRlZF9ieSIsImFzeW5jX3JlY2VudF9hZ2dyZWdhdGUiLCJyZWNlbnRfYWdncmVnYXRlIiwic2VhcmNoX29iamVjdCIsIl9yZWNvcmRzIiwiY2FsbGJhY2siLCJDb2xsZWN0aW9ucyIsIm9iamVjdF9yZWNlbnRfdmlld2VkIiwicmF3Q29sbGVjdGlvbiIsImFnZ3JlZ2F0ZSIsIiRtYXRjaCIsIiRncm91cCIsIm1heENyZWF0ZWQiLCIkbWF4IiwiJHNvcnQiLCIkbGltaXQiLCJ0b0FycmF5IiwiZXJyIiwiZGF0YSIsIkVycm9yIiwiaXNGdW5jdGlvbiIsIndyYXBBc3luYyIsInNlYXJjaFRleHQiLCJfb2JqZWN0X2NvbGxlY3Rpb24iLCJfb2JqZWN0X25hbWVfa2V5IiwicXVlcnkiLCJxdWVyeV9hbmQiLCJyZWNvcmRzIiwic2VhcmNoX0tleXdvcmRzIiwiTkFNRV9GSUVMRF9LRVkiLCJzcGxpdCIsImtleXdvcmQiLCJzdWJxdWVyeSIsIiRyZWdleCIsInRyaW0iLCIkYW5kIiwiJGluIiwibGltaXQiLCJfbmFtZSIsIl9vYmplY3RfbmFtZSIsInJlY29yZF9vYmplY3QiLCJyZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb24iLCJzZWxmIiwib2JqZWN0c0J5TmFtZSIsIm9iamVjdF9yZWNvcmQiLCJlbmFibGVfc2VhcmNoIiwidXBkYXRlX2ZpbHRlcnMiLCJsaXN0dmlld19pZCIsImZpbHRlcl9zY29wZSIsIm9iamVjdF9saXN0dmlld3MiLCJkaXJlY3QiLCJ1cGRhdGVfY29sdW1ucyIsImNvbHVtbnMiLCJjaGVjayIsImNvbXBvdW5kRmllbGRzIiwiY3Vyc29yIiwiZmlsdGVyRmllbGRzIiwib2JqZWN0RmllbGRzIiwicmVzdWx0IiwiT2JqZWN0IiwiY2hpbGRLZXkiLCJvYmplY3RGaWVsZCIsInNwbGl0cyIsImlzQ29tbW9uU3BhY2UiLCJpc1NwYWNlQWRtaW4iLCJza2lwIiwiZmV0Y2giLCJjb21wb3VuZEZpZWxkSXRlbSIsImNvbXBvdW5kRmlsdGVyRmllbGRzIiwiaXRlbUtleSIsIml0ZW1WYWx1ZSIsInJlZmVyZW5jZUl0ZW0iLCJzZXR0aW5nIiwiY29sdW1uX3dpZHRoIiwib2JqMSIsIl9pZF9hY3Rpb25zIiwiX21peEZpZWxkc0RhdGEiLCJfbWl4UmVsYXRlZERhdGEiLCJfd3JpdGVYbWxGaWxlIiwiZnMiLCJsb2dnZXIiLCJwYXRoIiwieG1sMmpzIiwiTG9nZ2VyIiwianNvbk9iaiIsIm9iak5hbWUiLCJidWlsZGVyIiwiZGF5IiwiZmlsZUFkZHJlc3MiLCJmaWxlTmFtZSIsImZpbGVQYXRoIiwibW9udGgiLCJub3ciLCJzdHJlYW0iLCJ4bWwiLCJ5ZWFyIiwiQnVpbGRlciIsImJ1aWxkT2JqZWN0IiwiQnVmZmVyIiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsImdldERhdGUiLCJqb2luIiwiX19tZXRlb3JfYm9vdHN0cmFwX18iLCJzZXJ2ZXJEaXIiLCJleGlzdHNTeW5jIiwic3luYyIsIndyaXRlRmlsZSIsIm1peEJvb2wiLCJtaXhEYXRlIiwibWl4RGVmYXVsdCIsIm9iakZpZWxkcyIsImZpZWxkX25hbWUiLCJkYXRlIiwiZGF0ZVN0ciIsImZvcm1hdCIsIm1vbWVudCIsInJlbGF0ZWRPYmpOYW1lcyIsInJlbGF0ZWRPYmpOYW1lIiwicmVsYXRlZENvbGxlY3Rpb24iLCJyZWxhdGVkUmVjb3JkTGlzdCIsInJlbGF0ZWRUYWJsZURhdGEiLCJyZWxhdGVkT2JqIiwiZmllbGRzRGF0YSIsIkV4cG9ydDJ4bWwiLCJyZWNvcmRMaXN0IiwiaW5mbyIsInRpbWUiLCJyZWNvcmRPYmoiLCJ0aW1lRW5kIiwicmVsYXRlZF9vYmplY3RzX3JlY29yZHMiLCJyZWxhdGVkX3JlY29yZHMiLCJ2aWV3QWxsUmVjb3JkcyIsImdldFBlbmRpbmdTcGFjZUluZm8iLCJpbnZpdGVySWQiLCJpbnZpdGVyTmFtZSIsInNwYWNlTmFtZSIsImRiIiwidXNlcnMiLCJzcGFjZXMiLCJpbnZpdGVyIiwicmVmdXNlSm9pblNwYWNlIiwic3BhY2VfdXNlcnMiLCJpbnZpdGVfc3RhdGUiLCJhY2NlcHRKb2luU3BhY2UiLCJ1c2VyX2FjY2VwdGVkIiwicHVibGlzaCIsImlkIiwicHVibGlzaENvbXBvc2l0ZSIsInRhYmxlTmFtZSIsIl9maWVsZHMiLCJvYmplY3RfY29sbGVjaXRvbiIsInJlZmVyZW5jZV9maWVsZHMiLCJyZWFkeSIsIlN0cmluZyIsIk1hdGNoIiwiT3B0aW9uYWwiLCJnZXRPYmplY3ROYW1lIiwidW5ibG9jayIsImZpZWxkX2tleXMiLCJjaGlsZHJlbiIsIl9vYmplY3RLZXlzIiwicmVmZXJlbmNlX2ZpZWxkIiwicGFyZW50IiwiY2hpbGRyZW5fZmllbGRzIiwibmFtZV9maWVsZF9rZXkiLCJwX2siLCJyZWZlcmVuY2VfaWRzIiwicmVmZXJlbmNlX3RvX29iamVjdCIsInNfayIsImdldFByb3BlcnR5IiwicmVkdWNlIiwiaXNPYmplY3QiLCJzaGFyZWQiLCJ1c2VyIiwic3BhY2Vfc2V0dGluZ3MiLCJwZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbCIsImdldEZsb3dQZXJtaXNzaW9ucyIsImZsb3dfaWQiLCJ1c2VyX2lkIiwiZmxvdyIsIm15X3Blcm1pc3Npb25zIiwib3JnX2lkcyIsIm9yZ2FuaXphdGlvbnMiLCJvcmdzX2Nhbl9hZGQiLCJvcmdzX2Nhbl9hZG1pbiIsIm9yZ3NfY2FuX21vbml0b3IiLCJ1c2Vyc19jYW5fYWRkIiwidXNlcnNfY2FuX2FkbWluIiwidXNlcnNfY2FuX21vbml0b3IiLCJ1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsIiwiZ2V0RmxvdyIsInBhcmVudHMiLCJvcmciLCJwYXJlbnRfaWQiLCJwZXJtcyIsIm9yZ19pZCIsIl9ldmFsIiwiY2hlY2tfYXV0aG9yaXphdGlvbiIsInJlcSIsImF1dGhUb2tlbiIsImhhc2hlZFRva2VuIiwiQWNjb3VudHMiLCJfaGFzaExvZ2luVG9rZW4iLCJnZXRTcGFjZSIsImZsb3dzIiwiZ2V0U3BhY2VVc2VyIiwic3BhY2VfdXNlciIsImdldFNwYWNlVXNlck9yZ0luZm8iLCJvcmdhbml6YXRpb24iLCJmdWxsbmFtZSIsIm9yZ2FuaXphdGlvbl9uYW1lIiwib3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwiaXNGbG93RW5hYmxlZCIsInN0YXRlIiwiaXNGbG93U3BhY2VNYXRjaGVkIiwiZ2V0Rm9ybSIsImZvcm1faWQiLCJmb3JtIiwiZm9ybXMiLCJnZXRDYXRlZ29yeSIsImNhdGVnb3J5X2lkIiwiY2F0ZWdvcmllcyIsImNyZWF0ZV9pbnN0YW5jZSIsImluc3RhbmNlX2Zyb21fY2xpZW50IiwidXNlcl9pbmZvIiwiYXBwcl9vYmoiLCJhcHByb3ZlX2Zyb21fY2xpZW50IiwiY2F0ZWdvcnkiLCJpbnNfb2JqIiwibmV3X2luc19pZCIsInNwYWNlX3VzZXJfb3JnX2luZm8iLCJzdGFydF9zdGVwIiwidHJhY2VfZnJvbV9jbGllbnQiLCJ0cmFjZV9vYmoiLCJjaGVja0lzSW5BcHByb3ZhbCIsInBlcm1pc3Npb25NYW5hZ2VyIiwiaW5zdGFuY2VzIiwiZmxvd192ZXJzaW9uIiwiY3VycmVudCIsImZvcm1fdmVyc2lvbiIsInN1Ym1pdHRlciIsInN1Ym1pdHRlcl9uYW1lIiwiYXBwbGljYW50IiwiYXBwbGljYW50X25hbWUiLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uIiwiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lIiwiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZSIsImFwcGxpY2FudF9jb21wYW55IiwiY29tcGFueV9pZCIsImNvZGUiLCJpc19hcmNoaXZlZCIsImlzX2RlbGV0ZWQiLCJyZWNvcmRfaWRzIiwiTW9uZ28iLCJPYmplY3RJRCIsIl9zdHIiLCJpc19maW5pc2hlZCIsInN0ZXBzIiwic3RlcCIsInN0ZXBfdHlwZSIsInN0YXJ0X2RhdGUiLCJ0cmFjZSIsInVzZXJfbmFtZSIsImhhbmRsZXIiLCJoYW5kbGVyX25hbWUiLCJoYW5kbGVyX29yZ2FuaXphdGlvbiIsImhhbmRsZXJfb3JnYW5pemF0aW9uX25hbWUiLCJoYW5kbGVyX29yZ2FuaXphdGlvbl9mdWxsbmFtZSIsInJlYWRfZGF0ZSIsImlzX3JlYWQiLCJpc19lcnJvciIsImRlc2NyaXB0aW9uIiwiaW5pdGlhdGVWYWx1ZXMiLCJhcHByb3ZlcyIsInRyYWNlcyIsImluYm94X3VzZXJzIiwiY3VycmVudF9zdGVwX25hbWUiLCJhdXRvX3JlbWluZCIsImZsb3dfbmFtZSIsImNhdGVnb3J5X25hbWUiLCJpbml0aWF0ZUF0dGFjaCIsImluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvIiwicmVjb3JkSWRzIiwiZmxvd0lkIiwiZmllbGRDb2RlcyIsImZpbHRlclZhbHVlcyIsImZvcm1GaWVsZHMiLCJmb3JtVGFibGVGaWVsZHMiLCJmb3JtVGFibGVGaWVsZHNDb2RlIiwiZ2V0RmllbGRPZGF0YVZhbHVlIiwiZ2V0Rm9ybUZpZWxkIiwiZ2V0Rm9ybVRhYmxlRmllbGQiLCJnZXRGb3JtVGFibGVGaWVsZENvZGUiLCJnZXRGb3JtVGFibGVTdWJGaWVsZCIsImdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUiLCJvYmplY3ROYW1lIiwib3ciLCJyZWNvcmRJZCIsInJlbGF0ZWRPYmplY3RzS2V5cyIsInRhYmxlRmllbGRDb2RlcyIsInRhYmxlRmllbGRNYXAiLCJ0YWJsZVRvUmVsYXRlZE1hcCIsImZmIiwib2JqZWN0X3dvcmtmbG93cyIsImZvcm1GaWVsZCIsInJlbGF0ZWRPYmplY3RzS2V5Iiwic3RhcnRzV2l0aCIsImZvcm1UYWJsZUZpZWxkQ29kZSIsInRhYmxlRmllbGQiLCJzdWJGaWVsZENvZGUiLCJfcmVjb3JkIiwiZmllbGRfbWFwIiwiZm0iLCJmaWVsZHNPYmoiLCJsb29rdXBGaWVsZE5hbWUiLCJsb29rdXBPYmplY3QiLCJvVGFibGVDb2RlIiwib1RhYmxlRmllbGRDb2RlIiwib2JqRmllbGQiLCJvYmplY3RGaWVsZE5hbWUiLCJvYmplY3RfZmllbGQiLCJvZGF0YUZpZWxkVmFsdWUiLCJyZWZlcmVuY2VUb0ZpZWxkVmFsdWUiLCJyZWZlcmVuY2VUb09iamVjdE5hbWUiLCJyZWxhdGVkT2JqZWN0RmllbGRDb2RlIiwidGFibGVUb1JlbGF0ZWRNYXBLZXkiLCJ3VGFibGVDb2RlIiwid29ya2Zsb3dfZmllbGQiLCJoYXNPd25Qcm9wZXJ0eSIsIndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGUiLCJvYmplY3RfdGFibGVfZmllbGRfY29kZSIsIm11bHRpcGxlIiwiaXNfbXVsdGlzZWxlY3QiLCJ0ZmMiLCJjIiwicGFyc2UiLCJ0ciIsIm5ld1RyIiwidGZtIiwid1RkQ29kZSIsImZvcm1UYWJsZUZpZWxkIiwicmVsYXRlZEZpZWxkIiwicmVsYXRlZEZpZWxkTmFtZSIsInJlbGF0ZWRPYmplY3ROYW1lIiwicmVsYXRlZFJlY29yZHMiLCJ0YWJsZUNvZGUiLCJ0YWJsZVZhbHVlcyIsIl9GUk9NX1RBQkxFX0NPREUiLCJ3YXJuIiwicnIiLCJ0YWJsZVZhbHVlSXRlbSIsInZhbHVlS2V5IiwiZmllbGRLZXkiLCJmb3JtRmllbGRLZXkiLCJyZWxhdGVkT2JqZWN0RmllbGQiLCJ0YWJsZUZpZWxkVmFsdWUiLCJmaWVsZF9tYXBfc2NyaXB0IiwiZXh0ZW5kIiwiZXZhbEZpZWxkTWFwU2NyaXB0Iiwib2JqZWN0SWQiLCJmdW5jIiwic2NyaXB0IiwiaW5zSWQiLCJhcHByb3ZlSWQiLCJjZiIsInZlcnNpb25zIiwidmVyc2lvbklkIiwiaWR4IiwibmV3RmlsZSIsIkZTIiwiRmlsZSIsImF0dGFjaERhdGEiLCJjcmVhdGVSZWFkU3RyZWFtIiwib3JpZ2luYWwiLCJtZXRhZGF0YSIsInJlYXNvbiIsInNpemUiLCJvd25lcl9uYW1lIiwiYXBwcm92ZSIsIiRwdXNoIiwiJGVhY2giLCIkcG9zaXRpb24iLCJsb2NrZWQiLCJpbnN0YW5jZV9zdGF0ZSIsIiRleGlzdHMiLCJnZXRRdWVyeVN0cmluZyIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXMiLCJuZXh0IiwicGFyc2VGaWxlcyIsImZpbGVDb2xsZWN0aW9uIiwiZmlsZXMiLCJtaW1lVHlwZSIsImJvZHkiLCJleHRlbnRpb24iLCJmaWxlT2JqIiwiZmlsZW5hbWUiLCJuZXdGaWxlT2JqSWQiLCJyZXNwIiwidG9Mb3dlckNhc2UiLCJkZWNvZGVVUklDb21wb25lbnQiLCJ2ZXJzaW9uX2lkIiwic2V0SGVhZGVyIiwiZW5kIiwic3RhdHVzQ29kZSIsImNvbGxlY3Rpb25OYW1lIiwiZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiIsInBhcmFtcyIsInJlc3VsdERhdGEiLCJzZW5kUmVzdWx0Iiwic3RhY2siLCJlcnJvcnMiLCJtZXNzYWdlIiwiYWNjZXNzS2V5SWQiLCJzZWNyZXRBY2Nlc3NLZXkiLCJtZXRob2QiLCJBTFkiLCJjYW5vbmljYWxpemVkUXVlcnlTdHJpbmciLCJxdWVyeUtleXMiLCJxdWVyeVN0ciIsInN0cmluZ1RvU2lnbiIsInV0aWwiLCJGb3JtYXQiLCJWZXJzaW9uIiwiQWNjZXNzS2V5SWQiLCJTaWduYXR1cmVNZXRob2QiLCJUaW1lc3RhbXAiLCJpc284NjAxIiwiU2lnbmF0dXJlVmVyc2lvbiIsIlNpZ25hdHVyZU5vbmNlIiwiZ2V0VGltZSIsInBvcEVzY2FwZSIsInRvVXBwZXJDYXNlIiwic3Vic3RyIiwiU2lnbmF0dXJlIiwiY3J5cHRvIiwiaG1hYyIsInF1ZXJ5UGFyYW1zVG9TdHJpbmciLCJvc3MiLCJyIiwicmVmMyIsInVwbG9hZEFkZHJlc3MiLCJ1cGxvYWRBdXRoIiwidmlkZW9JZCIsIkFjdGlvbiIsIlRpdGxlIiwiRmlsZU5hbWUiLCJIVFRQIiwiY2FsbCIsIlZpZGVvSWQiLCJVcGxvYWRBZGRyZXNzIiwidG9TdHJpbmciLCJVcGxvYWRBdXRoIiwiT1NTIiwiQWNjZXNzS2V5U2VjcmV0IiwiRW5kcG9pbnQiLCJTZWN1cml0eVRva2VuIiwicHV0T2JqZWN0IiwiQnVja2V0IiwiS2V5IiwiQm9keSIsIkFjY2Vzc0NvbnRyb2xBbGxvd09yaWdpbiIsIkNvbnRlbnRUeXBlIiwiQ2FjaGVDb250cm9sIiwiQ29udGVudERpc3Bvc2l0aW9uIiwiQ29udGVudEVuY29kaW5nIiwiU2VydmVyU2lkZUVuY3J5cHRpb24iLCJFeHBpcmVzIiwiYmluZEVudmlyb25tZW50IiwiZ2V0UGxheUluZm9RdWVyeSIsImdldFBsYXlJbmZvUmVzdWx0IiwiZ2V0UGxheUluZm9VcmwiLCJuZXdEYXRlIiwiY3VycmVudF91c2VyX2lkIiwiY3VycmVudF91c2VyX2luZm8iLCJoYXNoRGF0YSIsImluc2VydGVkX2luc3RhbmNlcyIsIm5ld19pbnMiLCJpbnNlcnRzIiwiZXJyb3JNZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUdyQkgsZ0JBQWdCLENBQUM7QUFDaEJJLFFBQU0sRUFBRSxTQURRO0FBRWhCQyxRQUFNLEVBQUUsUUFGUTtBQUdoQixZQUFVLFNBSE07QUFJaEIsZUFBYTtBQUpHLENBQUQsRUFLYixpQkFMYSxDQUFoQjs7QUFPQSxJQUFJQyxNQUFNLENBQUNDLFFBQVAsSUFBbUJELE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsR0FBbkMsSUFBMENGLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0JDLE1BQWxFLEVBQTBFO0FBQ3pFVCxrQkFBZ0IsQ0FBQztBQUNoQixrQkFBYztBQURFLEdBQUQsRUFFYixpQkFGYSxDQUFoQjtBQUdBLEM7Ozs7Ozs7Ozs7OztBQ0NEVSxRQUFRQyxTQUFSLEdBQW9CLFVBQUNDLFdBQUQ7QUFDbkIsTUFBQUMsR0FBQTtBQUFBLFVBQUFBLE1BQUFILFFBQUFJLFNBQUEsQ0FBQUYsV0FBQSxhQUFBQyxJQUF1Q0UsTUFBdkMsR0FBdUMsTUFBdkM7QUFEbUIsQ0FBcEI7O0FBR0FMLFFBQVFNLFlBQVIsR0FBdUIsVUFBQ0osV0FBRCxFQUFjSyxTQUFkLEVBQXlCQyxNQUF6QjtBQUN0QixNQUFBQyxTQUFBLEVBQUFDLFlBQUE7O0FBQUEsTUFBRyxDQUFDRixNQUFKO0FBQ0NBLGFBQVNHLFFBQVFDLEdBQVIsQ0FBWSxRQUFaLENBQVQ7QUNYQzs7QURZRixNQUFHLENBQUNWLFdBQUo7QUFDQ0Esa0JBQWNTLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUNWQzs7QURZRkgsY0FBWVQsUUFBUWEsV0FBUixDQUFvQlgsV0FBcEIsRUFBaUMsSUFBakMsQ0FBWjtBQUNBUSxpQkFBQUQsYUFBQSxPQUFlQSxVQUFXSyxHQUExQixHQUEwQixNQUExQjs7QUFFQSxNQUFHUCxTQUFIO0FBQ0MsV0FBT1AsUUFBUWUsY0FBUixDQUF1QixVQUFVUCxNQUFWLEdBQW1CLEdBQW5CLEdBQXlCTixXQUF6QixHQUF1QyxRQUF2QyxHQUFrREssU0FBekUsQ0FBUDtBQUREO0FBR0MsUUFBR0wsZ0JBQWUsU0FBbEI7QUFDQyxhQUFPRixRQUFRZSxjQUFSLENBQXVCLFVBQVVQLE1BQVYsR0FBbUIsR0FBbkIsR0FBeUJOLFdBQXpCLEdBQXVDLFlBQTlELENBQVA7QUFERDtBQUdDLGFBQU9GLFFBQVFlLGNBQVIsQ0FBdUIsVUFBVVAsTUFBVixHQUFtQixHQUFuQixHQUF5Qk4sV0FBekIsR0FBdUMsUUFBdkMsR0FBa0RRLFlBQXpFLENBQVA7QUFORjtBQ0pFO0FETG9CLENBQXZCOztBQWlCQVYsUUFBUWdCLGtCQUFSLEdBQTZCLFVBQUNkLFdBQUQsRUFBY0ssU0FBZCxFQUF5QkMsTUFBekI7QUFDNUIsTUFBQUMsU0FBQSxFQUFBQyxZQUFBOztBQUFBLE1BQUcsQ0FBQ0YsTUFBSjtBQUNDQSxhQUFTRyxRQUFRQyxHQUFSLENBQVksUUFBWixDQUFUO0FDUEM7O0FEUUYsTUFBRyxDQUFDVixXQUFKO0FBQ0NBLGtCQUFjUyxRQUFRQyxHQUFSLENBQVksYUFBWixDQUFkO0FDTkM7O0FEUUZILGNBQVlULFFBQVFhLFdBQVIsQ0FBb0JYLFdBQXBCLEVBQWlDLElBQWpDLENBQVo7QUFDQVEsaUJBQUFELGFBQUEsT0FBZUEsVUFBV0ssR0FBMUIsR0FBMEIsTUFBMUI7O0FBRUEsTUFBR1AsU0FBSDtBQUNDLFdBQU8sVUFBVUMsTUFBVixHQUFtQixHQUFuQixHQUF5Qk4sV0FBekIsR0FBdUMsUUFBdkMsR0FBa0RLLFNBQXpEO0FBREQ7QUFHQyxRQUFHTCxnQkFBZSxTQUFsQjtBQUNDLGFBQU8sVUFBVU0sTUFBVixHQUFtQixHQUFuQixHQUF5Qk4sV0FBekIsR0FBdUMsWUFBOUM7QUFERDtBQUdDLGFBQU8sVUFBVU0sTUFBVixHQUFtQixHQUFuQixHQUF5Qk4sV0FBekIsR0FBdUMsUUFBdkMsR0FBa0RRLFlBQXpEO0FBTkY7QUNBRTtBRFQwQixDQUE3Qjs7QUFpQkFWLFFBQVFpQixjQUFSLEdBQXlCLFVBQUNmLFdBQUQsRUFBY00sTUFBZCxFQUFzQkUsWUFBdEI7QUFDeEIsTUFBQVEsR0FBQTtBQUFBQSxRQUFNbEIsUUFBUW1CLHNCQUFSLENBQStCakIsV0FBL0IsRUFBNENNLE1BQTVDLEVBQW9ERSxZQUFwRCxDQUFOO0FBQ0EsU0FBT1YsUUFBUWUsY0FBUixDQUF1QkcsR0FBdkIsQ0FBUDtBQUZ3QixDQUF6Qjs7QUFJQWxCLFFBQVFtQixzQkFBUixHQUFpQyxVQUFDakIsV0FBRCxFQUFjTSxNQUFkLEVBQXNCRSxZQUF0QjtBQUNoQyxNQUFHQSxpQkFBZ0IsVUFBbkI7QUFDQyxXQUFPLFVBQVVGLE1BQVYsR0FBbUIsR0FBbkIsR0FBeUJOLFdBQXpCLEdBQXVDLFlBQTlDO0FBREQ7QUFHQyxXQUFPLFVBQVVNLE1BQVYsR0FBbUIsR0FBbkIsR0FBeUJOLFdBQXpCLEdBQXVDLFFBQXZDLEdBQWtEUSxZQUF6RDtBQ0ZDO0FERjhCLENBQWpDOztBQU1BVixRQUFRb0IsZ0JBQVIsR0FBMkIsVUFBQ2xCLFdBQUQsRUFBY00sTUFBZCxFQUFzQkUsWUFBdEI7QUFDMUIsTUFBR0EsWUFBSDtBQUNDLFdBQU9WLFFBQVFlLGNBQVIsQ0FBdUIsVUFBVVAsTUFBVixHQUFtQixHQUFuQixHQUF5Qk4sV0FBekIsR0FBdUMsR0FBdkMsR0FBNkNRLFlBQTdDLEdBQTRELE9BQW5GLENBQVA7QUFERDtBQUdDLFdBQU9WLFFBQVFlLGNBQVIsQ0FBdUIsVUFBVVAsTUFBVixHQUFtQixHQUFuQixHQUF5Qk4sV0FBekIsR0FBdUMsY0FBOUQsQ0FBUDtBQ0FDO0FESndCLENBQTNCOztBQU1BRixRQUFRcUIsbUJBQVIsR0FBOEIsVUFBQ25CLFdBQUQsRUFBY00sTUFBZCxFQUFzQkQsU0FBdEIsRUFBaUNlLG1CQUFqQztBQUM3QixTQUFPdEIsUUFBUWUsY0FBUixDQUF1QixVQUFVUCxNQUFWLEdBQW1CLEdBQW5CLEdBQXlCTixXQUF6QixHQUF1QyxHQUF2QyxHQUE2Q0ssU0FBN0MsR0FBeUQsR0FBekQsR0FBK0RlLG1CQUEvRCxHQUFxRixPQUE1RyxDQUFQO0FBRDZCLENBQTlCOztBQUdBdEIsUUFBUXVCLDJCQUFSLEdBQXNDLFVBQUNyQixXQUFELEVBQWNzQixPQUFkLEVBQXVCQyxZQUF2QixFQUFxQ0MsVUFBckM7QUFDckMsTUFBQUMsT0FBQSxFQUFBQyxRQUFBLEVBQUFDLE1BQUEsRUFBQUMsSUFBQSxFQUFBQyxjQUFBOztBQUFBSCxhQUFXLEVBQVg7O0FBQ0EsT0FBTzFCLFdBQVA7QUFDQyxXQUFPMEIsUUFBUDtBQ0lDOztBREhGRCxZQUFVM0IsUUFBUUksU0FBUixDQUFrQkYsV0FBbEIsQ0FBVjtBQUNBMkIsV0FBQUYsV0FBQSxPQUFTQSxRQUFTRSxNQUFsQixHQUFrQixNQUFsQjtBQUNBQyxTQUFBSCxXQUFBLE9BQU9BLFFBQVNHLElBQWhCLEdBQWdCLE1BQWhCOztBQUNBRSxJQUFFQyxPQUFGLENBQVVKLE1BQVYsRUFBa0IsVUFBQ0ssQ0FBRCxFQUFJQyxDQUFKO0FBQ2pCLFFBQUdWLGdCQUFpQlMsRUFBRUUsTUFBdEI7QUFDQztBQ0tFOztBREpILFFBQUdGLEVBQUVHLElBQUYsS0FBVSxRQUFiO0FDTUksYURMSFQsU0FBU1UsSUFBVCxDQUFjO0FBQUNDLGVBQU8sTUFBR0wsRUFBRUssS0FBRixJQUFXSixDQUFkLENBQVI7QUFBMkJLLGVBQU8sS0FBR0wsQ0FBckM7QUFBMENMLGNBQU1BO0FBQWhELE9BQWQsQ0NLRztBRE5KO0FDWUksYURUSEYsU0FBU1UsSUFBVCxDQUFjO0FBQUNDLGVBQU9MLEVBQUVLLEtBQUYsSUFBV0osQ0FBbkI7QUFBc0JLLGVBQU9MLENBQTdCO0FBQWdDTCxjQUFNQTtBQUF0QyxPQUFkLENDU0c7QUFLRDtBRHBCSjs7QUFPQSxNQUFHTixPQUFIO0FBQ0NRLE1BQUVDLE9BQUYsQ0FBVUosTUFBVixFQUFrQixVQUFDSyxDQUFELEVBQUlDLENBQUo7QUFDakIsVUFBQU0sUUFBQTs7QUFBQSxVQUFHaEIsZ0JBQWlCUyxFQUFFRSxNQUF0QjtBQUNDO0FDaUJHOztBRGhCSixVQUFHLENBQUNGLEVBQUVHLElBQUYsS0FBVSxRQUFWLElBQXNCSCxFQUFFRyxJQUFGLEtBQVUsZUFBakMsS0FBcURILEVBQUVRLFlBQXZELElBQXVFVixFQUFFVyxRQUFGLENBQVdULEVBQUVRLFlBQWIsQ0FBMUU7QUFFQ0QsbUJBQVd6QyxRQUFRSSxTQUFSLENBQWtCOEIsRUFBRVEsWUFBcEIsQ0FBWDs7QUFDQSxZQUFHRCxRQUFIO0FDaUJNLGlCRGhCTFQsRUFBRUMsT0FBRixDQUFVUSxTQUFTWixNQUFuQixFQUEyQixVQUFDZSxFQUFELEVBQUtDLEVBQUw7QUNpQnBCLG1CRGhCTmpCLFNBQVNVLElBQVQsQ0FBYztBQUFDQyxxQkFBUyxDQUFDTCxFQUFFSyxLQUFGLElBQVdKLENBQVosSUFBYyxJQUFkLElBQWtCUyxHQUFHTCxLQUFILElBQVlNLEVBQTlCLENBQVY7QUFBOENMLHFCQUFVTCxJQUFFLEdBQUYsR0FBS1UsRUFBN0Q7QUFBbUVmLG9CQUFBVyxZQUFBLE9BQU1BLFNBQVVYLElBQWhCLEdBQWdCO0FBQW5GLGFBQWQsQ0NnQk07QURqQlAsWUNnQks7QURwQlA7QUM0Qkk7QUQvQkw7QUNpQ0M7O0FEeEJGLE1BQUdKLFVBQUg7QUFDQ0sscUJBQWlCL0IsUUFBUThDLGlCQUFSLENBQTBCNUMsV0FBMUIsQ0FBakI7O0FBQ0E4QixNQUFFZSxJQUFGLENBQU9oQixjQUFQLEVBQXVCLFVBQUFpQixLQUFBO0FDMEJuQixhRDFCbUIsVUFBQ0MsY0FBRDtBQUN0QixZQUFBQyxhQUFBLEVBQUFDLGNBQUE7QUFBQUEseUJBQWlCbkQsUUFBUXVCLDJCQUFSLENBQW9DMEIsZUFBZS9DLFdBQW5ELEVBQWdFLEtBQWhFLEVBQXVFLEtBQXZFLEVBQThFLEtBQTlFLENBQWpCO0FBQ0FnRCx3QkFBZ0JsRCxRQUFRSSxTQUFSLENBQWtCNkMsZUFBZS9DLFdBQWpDLENBQWhCO0FDNEJLLGVEM0JMOEIsRUFBRWUsSUFBRixDQUFPSSxjQUFQLEVBQXVCLFVBQUNDLGFBQUQ7QUFDdEIsY0FBR0gsZUFBZUksV0FBZixLQUE4QkQsY0FBY1osS0FBL0M7QUM0QlEsbUJEM0JQWixTQUFTVSxJQUFULENBQWM7QUFBQ0MscUJBQVMsQ0FBQ1csY0FBY1gsS0FBZCxJQUF1QlcsY0FBY0ksSUFBdEMsSUFBMkMsSUFBM0MsR0FBK0NGLGNBQWNiLEtBQXZFO0FBQWdGQyxxQkFBVVUsY0FBY0ksSUFBZCxHQUFtQixHQUFuQixHQUFzQkYsY0FBY1osS0FBOUg7QUFBdUlWLG9CQUFBb0IsaUJBQUEsT0FBTUEsY0FBZXBCLElBQXJCLEdBQXFCO0FBQTVKLGFBQWQsQ0MyQk87QUFLRDtBRGxDUixVQzJCSztBRDlCaUIsT0MwQm5CO0FEMUJtQixXQUF2QjtBQ3lDQzs7QURuQ0YsU0FBT0YsUUFBUDtBQWhDcUMsQ0FBdEM7O0FBbUNBNUIsUUFBUXVELDJCQUFSLEdBQXNDLFVBQUNyRCxXQUFEO0FBQ3JDLE1BQUF5QixPQUFBLEVBQUFDLFFBQUEsRUFBQUMsTUFBQSxFQUFBQyxJQUFBLEVBQUEwQixpQkFBQTs7QUFBQTVCLGFBQVcsRUFBWDs7QUFDQSxPQUFPMUIsV0FBUDtBQUNDLFdBQU8wQixRQUFQO0FDc0NDOztBRHJDRkQsWUFBVTNCLFFBQVFJLFNBQVIsQ0FBa0JGLFdBQWxCLENBQVY7QUFDQTJCLFdBQUFGLFdBQUEsT0FBU0EsUUFBU0UsTUFBbEIsR0FBa0IsTUFBbEI7QUFDQTJCLHNCQUFvQnhELFFBQVF5RCxTQUFSLENBQWtCdkQsV0FBbEIsQ0FBcEI7QUFDQTRCLFNBQUFILFdBQUEsT0FBT0EsUUFBU0csSUFBaEIsR0FBZ0IsTUFBaEI7O0FBQ0FFLElBQUVDLE9BQUYsQ0FBVUosTUFBVixFQUFrQixVQUFDSyxDQUFELEVBQUlDLENBQUo7QUFFakIsUUFBRyxDQUFDSCxFQUFFMEIsT0FBRixDQUFVLENBQUMsTUFBRCxFQUFRLFFBQVIsRUFBa0IsVUFBbEIsRUFBOEIsVUFBOUIsRUFBMEMsUUFBMUMsRUFBb0QsUUFBcEQsRUFBOEQsT0FBOUQsRUFBdUUsVUFBdkUsRUFBbUYsTUFBbkYsQ0FBVixFQUFzR3hCLEVBQUVHLElBQXhHLENBQUQsSUFBbUgsQ0FBQ0gsRUFBRUUsTUFBekg7QUFFQyxVQUFHLENBQUMsUUFBUXVCLElBQVIsQ0FBYXhCLENBQWIsQ0FBRCxJQUFxQkgsRUFBRTRCLE9BQUYsQ0FBVUosaUJBQVYsRUFBNkJyQixDQUE3QixJQUFrQyxDQUFDLENBQTNEO0FDcUNLLGVEcENKUCxTQUFTVSxJQUFULENBQWM7QUFBQ0MsaUJBQU9MLEVBQUVLLEtBQUYsSUFBV0osQ0FBbkI7QUFBc0JLLGlCQUFPTCxDQUE3QjtBQUFnQ0wsZ0JBQU1BO0FBQXRDLFNBQWQsQ0NvQ0k7QUR2Q047QUM2Q0c7QUQvQ0o7O0FBT0EsU0FBT0YsUUFBUDtBQWZxQyxDQUF0Qzs7QUFpQkE1QixRQUFRNkQscUJBQVIsR0FBZ0MsVUFBQzNELFdBQUQ7QUFDL0IsTUFBQXlCLE9BQUEsRUFBQUMsUUFBQSxFQUFBQyxNQUFBLEVBQUFDLElBQUEsRUFBQTBCLGlCQUFBOztBQUFBNUIsYUFBVyxFQUFYOztBQUNBLE9BQU8xQixXQUFQO0FBQ0MsV0FBTzBCLFFBQVA7QUM2Q0M7O0FENUNGRCxZQUFVM0IsUUFBUUksU0FBUixDQUFrQkYsV0FBbEIsQ0FBVjtBQUNBMkIsV0FBQUYsV0FBQSxPQUFTQSxRQUFTRSxNQUFsQixHQUFrQixNQUFsQjtBQUNBMkIsc0JBQW9CeEQsUUFBUXlELFNBQVIsQ0FBa0J2RCxXQUFsQixDQUFwQjtBQUNBNEIsU0FBQUgsV0FBQSxPQUFPQSxRQUFTRyxJQUFoQixHQUFnQixNQUFoQjs7QUFDQUUsSUFBRUMsT0FBRixDQUFVSixNQUFWLEVBQWtCLFVBQUNLLENBQUQsRUFBSUMsQ0FBSjtBQUNqQixRQUFHLENBQUNILEVBQUUwQixPQUFGLENBQVUsQ0FBQyxNQUFELEVBQVEsUUFBUixFQUFrQixVQUFsQixFQUE4QixVQUE5QixFQUEwQyxRQUExQyxFQUFvRCxRQUFwRCxFQUE4RCxPQUE5RCxFQUF1RSxVQUF2RSxFQUFtRixNQUFuRixDQUFWLEVBQXNHeEIsRUFBRUcsSUFBeEcsQ0FBSjtBQUNDLFVBQUcsQ0FBQyxRQUFRc0IsSUFBUixDQUFheEIsQ0FBYixDQUFELElBQXFCSCxFQUFFNEIsT0FBRixDQUFVSixpQkFBVixFQUE2QnJCLENBQTdCLElBQWtDLENBQUMsQ0FBM0Q7QUM4Q0ssZUQ3Q0pQLFNBQVNVLElBQVQsQ0FBYztBQUFDQyxpQkFBT0wsRUFBRUssS0FBRixJQUFXSixDQUFuQjtBQUFzQkssaUJBQU9MLENBQTdCO0FBQWdDTCxnQkFBTUE7QUFBdEMsU0FBZCxDQzZDSTtBRC9DTjtBQ3FERztBRHRESjs7QUFJQSxTQUFPRixRQUFQO0FBWitCLENBQWhDLEMsQ0FjQTs7Ozs7Ozs7QUFPQTVCLFFBQVE4RCwwQkFBUixHQUFxQyxVQUFDQyxPQUFELEVBQVVsQyxNQUFWLEVBQWtCbUMsYUFBbEI7QUFDcEMsT0FBT0QsT0FBUDtBQUNDQSxjQUFVLEVBQVY7QUN3REM7O0FEdkRGLE9BQU9DLGFBQVA7QUFDQ0Esb0JBQWdCLEVBQWhCO0FDeURDOztBRHhERixNQUFBQSxpQkFBQSxPQUFHQSxjQUFlQyxNQUFsQixHQUFrQixNQUFsQjtBQUNDRCxrQkFBYy9CLE9BQWQsQ0FBc0IsVUFBQ2lDLENBQUQ7QUFDckIsVUFBR2xDLEVBQUVXLFFBQUYsQ0FBV3VCLENBQVgsQ0FBSDtBQUNDQSxZQUNDO0FBQUFDLGlCQUFPRCxDQUFQO0FBQ0FFLG9CQUFVO0FBRFYsU0FERDtBQzZERzs7QUQxREosVUFBR3ZDLE9BQU9xQyxFQUFFQyxLQUFULEtBQW9CLENBQUNuQyxFQUFFcUMsU0FBRixDQUFZTixPQUFaLEVBQW9CO0FBQUNJLGVBQU1ELEVBQUVDO0FBQVQsT0FBcEIsQ0FBeEI7QUM4REssZUQ3REpKLFFBQVF6QixJQUFSLENBQ0M7QUFBQTZCLGlCQUFPRCxFQUFFQyxLQUFUO0FBQ0FHLHNCQUFZLElBRFo7QUFFQUMsdUJBQWFMLEVBQUVFO0FBRmYsU0FERCxDQzZESTtBQUtEO0FEeEVMO0FDMEVDOztBRGhFRkwsVUFBUTlCLE9BQVIsQ0FBZ0IsVUFBQ3VDLFVBQUQ7QUFDZixRQUFBQyxVQUFBO0FBQUFBLGlCQUFhVCxjQUFjVSxJQUFkLENBQW1CLFVBQUNSLENBQUQ7QUFBTSxhQUFPQSxNQUFLTSxXQUFXTCxLQUFoQixJQUF5QkQsRUFBRUMsS0FBRixLQUFXSyxXQUFXTCxLQUF0RDtBQUF6QixNQUFiOztBQUNBLFFBQUduQyxFQUFFVyxRQUFGLENBQVc4QixVQUFYLENBQUg7QUFDQ0EsbUJBQ0M7QUFBQU4sZUFBT00sVUFBUDtBQUNBTCxrQkFBVTtBQURWLE9BREQ7QUN3RUU7O0FEckVILFFBQUdLLFVBQUg7QUFDQ0QsaUJBQVdGLFVBQVgsR0FBd0IsSUFBeEI7QUN1RUcsYUR0RUhFLFdBQVdELFdBQVgsR0FBeUJFLFdBQVdMLFFDc0VqQztBRHhFSjtBQUlDLGFBQU9JLFdBQVdGLFVBQWxCO0FDdUVHLGFEdEVILE9BQU9FLFdBQVdELFdDc0VmO0FBQ0Q7QURsRko7QUFZQSxTQUFPUixPQUFQO0FBNUJvQyxDQUFyQzs7QUE4QkEvRCxRQUFRMkUsZUFBUixHQUEwQixVQUFDekUsV0FBRCxFQUFjSyxTQUFkLEVBQXlCcUUsYUFBekIsRUFBd0NDLE1BQXhDO0FBRXpCLE1BQUFDLFVBQUEsRUFBQUMsTUFBQSxFQUFBNUUsR0FBQSxFQUFBNkUsSUFBQSxFQUFBQyxJQUFBOztBQUFBLE1BQUcsQ0FBQy9FLFdBQUo7QUFDQ0Esa0JBQWNTLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUMwRUM7O0FEeEVGLE1BQUcsQ0FBQ0wsU0FBSjtBQUNDQSxnQkFBWUksUUFBUUMsR0FBUixDQUFZLFdBQVosQ0FBWjtBQzBFQzs7QUR6RUYsTUFBR2hCLE9BQU9zRixRQUFWO0FBQ0MsUUFBR2hGLGdCQUFlUyxRQUFRQyxHQUFSLENBQVksYUFBWixDQUFmLElBQThDTCxjQUFhSSxRQUFRQyxHQUFSLENBQVksV0FBWixDQUE5RDtBQUNDLFdBQUFULE1BQUFnRixTQUFBQyxRQUFBLGNBQUFqRixJQUF3QjRFLE1BQXhCLEdBQXdCLE1BQXhCO0FBQ0MsZ0JBQUFDLE9BQUFHLFNBQUFDLFFBQUEsZUFBQUgsT0FBQUQsS0FBQUQsTUFBQSxZQUFBRSxLQUFvQ3JFLEdBQXBDLEtBQU8sTUFBUCxHQUFPLE1BQVA7QUFGRjtBQUFBO0FBSUMsYUFBT1osUUFBUXFGLEtBQVIsQ0FBY3pFLEdBQWQsQ0FBa0JWLFdBQWxCLEVBQStCSyxTQUEvQixFQUEwQ3FFLGFBQTFDLEVBQXlEQyxNQUF6RCxDQUFQO0FBTEY7QUNrRkU7O0FEM0VGQyxlQUFhOUUsUUFBUXNGLGFBQVIsQ0FBc0JwRixXQUF0QixDQUFiOztBQUNBLE1BQUc0RSxVQUFIO0FBQ0NDLGFBQVNELFdBQVdTLE9BQVgsQ0FBbUJoRixTQUFuQixDQUFUO0FBQ0EsV0FBT3dFLE1BQVA7QUM2RUM7QUQ5RnVCLENBQTFCOztBQW1CQS9FLFFBQVF3RixNQUFSLEdBQWlCLFVBQUNoRixNQUFEO0FBQ2hCLE1BQUFpRixHQUFBLEVBQUF0RixHQUFBLEVBQUE2RSxJQUFBOztBQUFBLE1BQUcsQ0FBQ3hFLE1BQUo7QUFDQ0EsYUFBU0csUUFBUUMsR0FBUixDQUFZLFFBQVosQ0FBVDtBQ2dGQzs7QUQvRUY2RSxRQUFNekYsUUFBUTBGLElBQVIsQ0FBYWxGLE1BQWIsQ0FBTjs7QUNpRkMsTUFBSSxDQUFDTCxNQUFNSCxRQUFRMkYsSUFBZixLQUF3QixJQUE1QixFQUFrQztBQUNoQyxRQUFJLENBQUNYLE9BQU83RSxJQUFJc0YsR0FBWixLQUFvQixJQUF4QixFQUE4QjtBQUM1QlQsV0RsRmNZLE1Da0ZkO0FBQ0Q7QUFDRjs7QURuRkYsU0FBT0gsR0FBUDtBQUxnQixDQUFqQjs7QUFPQXpGLFFBQVE2RixlQUFSLEdBQTBCLFVBQUNyRixNQUFEO0FBQ3pCLE1BQUFpRixHQUFBLEVBQUFLLFNBQUE7QUFBQUwsUUFBTXpGLFFBQVF3RixNQUFSLENBQWVoRixNQUFmLENBQU47QUFDQXNGLGNBQVksSUFBWjs7QUFDQTlELElBQUVlLElBQUYsQ0FBTy9DLFFBQVErRixVQUFmLEVBQTJCLFVBQUN0RyxDQUFELEVBQUkwQyxDQUFKO0FBQzFCLFFBQUFoQyxHQUFBOztBQUFBLFVBQUFBLE1BQUFWLEVBQUF1RyxJQUFBLFlBQUE3RixJQUFXeUQsT0FBWCxDQUFtQjZCLElBQUkzRSxHQUF2QixJQUFHLE1BQUgsSUFBOEIsQ0FBQyxDQUEvQjtBQ3dGSSxhRHZGSGdGLFlBQVlyRyxDQ3VGVDtBQUNEO0FEMUZKOztBQUdBLFNBQU9xRyxTQUFQO0FBTnlCLENBQTFCOztBQVFBOUYsUUFBUWlHLHdCQUFSLEdBQW1DLFVBQUN6RixNQUFEO0FBQ2xDLE1BQUFpRixHQUFBO0FBQUFBLFFBQU16RixRQUFRd0YsTUFBUixDQUFlaEYsTUFBZixDQUFOO0FBQ0EsU0FBTzBGLGFBQWFDLHVCQUFiLENBQXFDRCxhQUFhRSxLQUFiLENBQW1CQyxRQUFuQixFQUFyQyxFQUFvRSxXQUFwRSxFQUFpRlosSUFBSTNFLEdBQXJGLENBQVA7QUFGa0MsQ0FBbkM7O0FBSUFkLFFBQVFzRyxpQkFBUixHQUE0QixVQUFDOUYsTUFBRDtBQUMzQixNQUFBaUYsR0FBQSxFQUFBYyxVQUFBLEVBQUFDLFFBQUEsRUFBQUMsT0FBQTtBQUFBaEIsUUFBTXpGLFFBQVF3RixNQUFSLENBQWVoRixNQUFmLENBQU47QUFDQWdHLGFBQVdFLFFBQVFGLFFBQVIsRUFBWDtBQUNBRCxlQUFnQkMsV0FBY2YsSUFBSWtCLGNBQWxCLEdBQXNDbEIsSUFBSWdCLE9BQTFEO0FBQ0FBLFlBQVUsRUFBVjs7QUFDQSxNQUFHaEIsR0FBSDtBQUNDekQsTUFBRWUsSUFBRixDQUFPd0QsVUFBUCxFQUFtQixVQUFDOUcsQ0FBRDtBQUNsQixVQUFBbUgsR0FBQTtBQUFBQSxZQUFNNUcsUUFBUUksU0FBUixDQUFrQlgsQ0FBbEIsQ0FBTjs7QUFDQSxXQUFBbUgsT0FBQSxPQUFHQSxJQUFLQyxXQUFMLENBQWlCakcsR0FBakIsR0FBdUJrRyxTQUExQixHQUEwQixNQUExQixLQUF3QyxDQUFDRixJQUFJeEUsTUFBN0M7QUMrRkssZUQ5RkpxRSxRQUFRbkUsSUFBUixDQUFhN0MsQ0FBYixDQzhGSTtBQUNEO0FEbEdMO0FDb0dDOztBRGhHRixTQUFPZ0gsT0FBUDtBQVYyQixDQUE1Qjs7QUFZQXpHLFFBQVErRyxjQUFSLEdBQXlCLFVBQUNDLFlBQUQ7QUFDeEIsU0FBT2QsYUFBYWUsbUJBQWIsQ0FBaUNmLGFBQWFFLEtBQWIsQ0FBbUJDLFFBQW5CLEVBQWpDLEVBQWdFVyxZQUFoRSxDQUFQO0FBRHdCLENBQXpCOztBQUdBaEgsUUFBUWtILHFCQUFSLEdBQWdDO0FBQy9CLE1BQUFsQixJQUFBLEVBQUFTLE9BQUEsRUFBQVUsa0JBQUE7QUFBQW5CLFNBQU9oRyxRQUFRK0csY0FBUixFQUFQO0FBQ0FJLHVCQUFxQm5GLEVBQUVvRixPQUFGLENBQVVwRixFQUFFcUYsS0FBRixDQUFRckIsSUFBUixFQUFhLFNBQWIsQ0FBVixDQUFyQjtBQUNBUyxZQUFVekUsRUFBRXNGLE1BQUYsQ0FBU3RILFFBQVF1SCxPQUFqQixFQUEwQixVQUFDWCxHQUFEO0FBQ25DLFFBQUdPLG1CQUFtQnZELE9BQW5CLENBQTJCZ0QsSUFBSXRELElBQS9CLElBQXVDLENBQTFDO0FBQ0MsYUFBTyxLQUFQO0FBREQ7QUFHQyxhQUFPLENBQUNzRCxJQUFJeEUsTUFBWjtBQ3FHRTtBRHpHTSxJQUFWO0FBS0FxRSxZQUFVQSxRQUFRZSxJQUFSLENBQWF4SCxRQUFReUgsYUFBUixDQUFzQkMsSUFBdEIsQ0FBMkI7QUFBQ0MsU0FBSTtBQUFMLEdBQTNCLENBQWIsQ0FBVjtBQUNBbEIsWUFBVXpFLEVBQUVxRixLQUFGLENBQVFaLE9BQVIsRUFBZ0IsTUFBaEIsQ0FBVjtBQUNBLFNBQU96RSxFQUFFNEYsSUFBRixDQUFPbkIsT0FBUCxDQUFQO0FBVitCLENBQWhDOztBQVlBekcsUUFBUTZILGNBQVIsR0FBeUI7QUFDeEIsTUFBQXBCLE9BQUEsRUFBQXFCLFdBQUE7QUFBQXJCLFlBQVUsRUFBVjtBQUNBcUIsZ0JBQWMsRUFBZDs7QUFDQTlGLElBQUVDLE9BQUYsQ0FBVWpDLFFBQVEwRixJQUFsQixFQUF3QixVQUFDRCxHQUFEO0FBQ3ZCcUMsa0JBQWM5RixFQUFFc0YsTUFBRixDQUFTN0IsSUFBSWdCLE9BQWIsRUFBc0IsVUFBQ0csR0FBRDtBQUNuQyxhQUFPLENBQUNBLElBQUl4RSxNQUFaO0FBRGEsTUFBZDtBQzZHRSxXRDNHRnFFLFVBQVVBLFFBQVFzQixNQUFSLENBQWVELFdBQWYsQ0MyR1I7QUQ5R0g7O0FBSUEsU0FBTzlGLEVBQUU0RixJQUFGLENBQU9uQixPQUFQLENBQVA7QUFQd0IsQ0FBekI7O0FBU0F6RyxRQUFRZ0ksZUFBUixHQUEwQixVQUFDakUsT0FBRCxFQUFVa0UsS0FBVjtBQUN6QixNQUFBQyxDQUFBLEVBQUFDLFFBQUEsRUFBQUMsWUFBQSxFQUFBQyxhQUFBLEVBQUFDLElBQUEsRUFBQUMsS0FBQSxFQUFBQyxJQUFBO0FBQUFKLGlCQUFlcEcsRUFBRXlHLEdBQUYsQ0FBTTFFLE9BQU4sRUFBZSxVQUFDNkMsR0FBRDtBQUM3QixRQUFHNUUsRUFBRTBHLE9BQUYsQ0FBVTlCLEdBQVYsQ0FBSDtBQUNDLGFBQU8sS0FBUDtBQUREO0FBR0MsYUFBT0EsR0FBUDtBQytHRTtBRG5IVyxJQUFmO0FBS0F3QixpQkFBZXBHLEVBQUUyRyxPQUFGLENBQVVQLFlBQVYsQ0FBZjtBQUNBRCxhQUFXLEVBQVg7QUFDQUUsa0JBQWdCRCxhQUFhbkUsTUFBN0I7O0FBQ0EsTUFBR2dFLEtBQUg7QUFFQ0EsWUFBUUEsTUFBTVcsT0FBTixDQUFjLEtBQWQsRUFBcUIsRUFBckIsRUFBeUJBLE9BQXpCLENBQWlDLE1BQWpDLEVBQXlDLEdBQXpDLENBQVI7O0FBR0EsUUFBRyxjQUFjakYsSUFBZCxDQUFtQnNFLEtBQW5CLENBQUg7QUFDQ0UsaUJBQVcsU0FBWDtBQzhHRTs7QUQ1R0gsUUFBRyxDQUFDQSxRQUFKO0FBQ0NJLGNBQVFOLE1BQU1ZLEtBQU4sQ0FBWSxPQUFaLENBQVI7O0FBQ0EsVUFBRyxDQUFDTixLQUFKO0FBQ0NKLG1CQUFXLDRCQUFYO0FBREQ7QUFHQ0ksY0FBTXRHLE9BQU4sQ0FBYyxVQUFDNkcsQ0FBRDtBQUNiLGNBQUdBLElBQUksQ0FBSixJQUFTQSxJQUFJVCxhQUFoQjtBQzhHTyxtQkQ3R05GLFdBQVcsc0JBQW9CVyxDQUFwQixHQUFzQixHQzZHM0I7QUFDRDtBRGhIUDtBQUlBUixlQUFPLENBQVA7O0FBQ0EsZUFBTUEsUUFBUUQsYUFBZDtBQUNDLGNBQUcsQ0FBQ0UsTUFBTVEsUUFBTixDQUFlLEtBQUdULElBQWxCLENBQUo7QUFDQ0gsdUJBQVcsNEJBQVg7QUMrR0s7O0FEOUdORztBQVhGO0FBRkQ7QUMrSEc7O0FEaEhILFFBQUcsQ0FBQ0gsUUFBSjtBQUVDSyxhQUFPUCxNQUFNWSxLQUFOLENBQVksYUFBWixDQUFQOztBQUNBLFVBQUdMLElBQUg7QUFDQ0EsYUFBS3ZHLE9BQUwsQ0FBYSxVQUFDK0csQ0FBRDtBQUNaLGNBQUcsQ0FBQyxlQUFlckYsSUFBZixDQUFvQnFGLENBQXBCLENBQUo7QUNpSE8sbUJEaEhOYixXQUFXLGlCQ2dITDtBQUNEO0FEbkhQO0FBSkY7QUMwSEc7O0FEbEhILFFBQUcsQ0FBQ0EsUUFBSjtBQUVDO0FBQ0NuSSxnQkFBTyxNQUFQLEVBQWFpSSxNQUFNVyxPQUFOLENBQWMsT0FBZCxFQUF1QixJQUF2QixFQUE2QkEsT0FBN0IsQ0FBcUMsTUFBckMsRUFBNkMsSUFBN0MsQ0FBYjtBQURELGVBQUFLLEtBQUE7QUFFTWYsWUFBQWUsS0FBQTtBQUNMZCxtQkFBVyxjQUFYO0FDb0hHOztBRGxISixVQUFHLG9CQUFvQnhFLElBQXBCLENBQXlCc0UsS0FBekIsS0FBb0Msb0JBQW9CdEUsSUFBcEIsQ0FBeUJzRSxLQUF6QixDQUF2QztBQUNDRSxtQkFBVyxrQ0FBWDtBQVJGO0FBL0JEO0FDNkpFOztBRHJIRixNQUFHQSxRQUFIO0FBQ0NlLFlBQVFDLEdBQVIsQ0FBWSxPQUFaLEVBQXFCaEIsUUFBckI7O0FBQ0EsUUFBR3ZJLE9BQU9zRixRQUFWO0FBQ0NrRSxhQUFPSCxLQUFQLENBQWFkLFFBQWI7QUN1SEU7O0FEdEhILFdBQU8sS0FBUDtBQUpEO0FBTUMsV0FBTyxJQUFQO0FDd0hDO0FEL0t1QixDQUExQixDLENBMERBOzs7Ozs7OztBQU9BbkksUUFBUXFKLG9CQUFSLEdBQStCLFVBQUN0RixPQUFELEVBQVV1RixPQUFWO0FBQzlCLE1BQUFDLFFBQUE7O0FBQUEsUUFBQXhGLFdBQUEsT0FBT0EsUUFBU0UsTUFBaEIsR0FBZ0IsTUFBaEI7QUFDQztBQzRIQzs7QUQxSEYsUUFBT0YsUUFBUSxDQUFSLGFBQXNCeUYsS0FBN0I7QUFDQ3pGLGNBQVUvQixFQUFFeUcsR0FBRixDQUFNMUUsT0FBTixFQUFlLFVBQUM2QyxHQUFEO0FBQ3hCLGFBQU8sQ0FBQ0EsSUFBSXpDLEtBQUwsRUFBWXlDLElBQUk2QyxTQUFoQixFQUEyQjdDLElBQUlwRSxLQUEvQixDQUFQO0FBRFMsTUFBVjtBQzhIQzs7QUQ1SEYrRyxhQUFXLEVBQVg7O0FBQ0F2SCxJQUFFZSxJQUFGLENBQU9nQixPQUFQLEVBQWdCLFVBQUN1RCxNQUFEO0FBQ2YsUUFBQW5ELEtBQUEsRUFBQXVGLE1BQUEsRUFBQUMsR0FBQSxFQUFBQyxZQUFBLEVBQUFwSCxLQUFBO0FBQUEyQixZQUFRbUQsT0FBTyxDQUFQLENBQVI7QUFDQW9DLGFBQVNwQyxPQUFPLENBQVAsQ0FBVDs7QUFDQSxRQUFHMUgsT0FBT3NGLFFBQVY7QUFDQzFDLGNBQVF4QyxRQUFRNkosZUFBUixDQUF3QnZDLE9BQU8sQ0FBUCxDQUF4QixDQUFSO0FBREQ7QUFHQzlFLGNBQVF4QyxRQUFRNkosZUFBUixDQUF3QnZDLE9BQU8sQ0FBUCxDQUF4QixFQUFtQyxJQUFuQyxFQUF5Q2dDLE9BQXpDLENBQVI7QUMrSEU7O0FEOUhITSxtQkFBZSxFQUFmO0FBQ0FBLGlCQUFhekYsS0FBYixJQUFzQixFQUF0Qjs7QUFDQSxRQUFHdUYsV0FBVSxHQUFiO0FBQ0NFLG1CQUFhekYsS0FBYixFQUFvQixLQUFwQixJQUE2QjNCLEtBQTdCO0FBREQsV0FFSyxJQUFHa0gsV0FBVSxJQUFiO0FBQ0pFLG1CQUFhekYsS0FBYixFQUFvQixLQUFwQixJQUE2QjNCLEtBQTdCO0FBREksV0FFQSxJQUFHa0gsV0FBVSxHQUFiO0FBQ0pFLG1CQUFhekYsS0FBYixFQUFvQixLQUFwQixJQUE2QjNCLEtBQTdCO0FBREksV0FFQSxJQUFHa0gsV0FBVSxJQUFiO0FBQ0pFLG1CQUFhekYsS0FBYixFQUFvQixNQUFwQixJQUE4QjNCLEtBQTlCO0FBREksV0FFQSxJQUFHa0gsV0FBVSxHQUFiO0FBQ0pFLG1CQUFhekYsS0FBYixFQUFvQixLQUFwQixJQUE2QjNCLEtBQTdCO0FBREksV0FFQSxJQUFHa0gsV0FBVSxJQUFiO0FBQ0pFLG1CQUFhekYsS0FBYixFQUFvQixNQUFwQixJQUE4QjNCLEtBQTlCO0FBREksV0FFQSxJQUFHa0gsV0FBVSxZQUFiO0FBQ0pDLFlBQU0sSUFBSUcsTUFBSixDQUFXLE1BQU10SCxLQUFqQixFQUF3QixHQUF4QixDQUFOO0FBQ0FvSCxtQkFBYXpGLEtBQWIsRUFBb0IsUUFBcEIsSUFBZ0N3RixHQUFoQztBQUZJLFdBR0EsSUFBR0QsV0FBVSxVQUFiO0FBQ0pDLFlBQU0sSUFBSUcsTUFBSixDQUFXdEgsS0FBWCxFQUFrQixHQUFsQixDQUFOO0FBQ0FvSCxtQkFBYXpGLEtBQWIsRUFBb0IsUUFBcEIsSUFBZ0N3RixHQUFoQztBQUZJLFdBR0EsSUFBR0QsV0FBVSxhQUFiO0FBQ0pDLFlBQU0sSUFBSUcsTUFBSixDQUFXLFVBQVV0SCxLQUFWLEdBQWtCLE9BQTdCLEVBQXNDLEdBQXRDLENBQU47QUFDQW9ILG1CQUFhekYsS0FBYixFQUFvQixRQUFwQixJQUFnQ3dGLEdBQWhDO0FDZ0lFOztBQUNELFdEaElGSixTQUFTakgsSUFBVCxDQUFjc0gsWUFBZCxDQ2dJRTtBRDlKSDs7QUErQkEsU0FBT0wsUUFBUDtBQXZDOEIsQ0FBL0I7O0FBeUNBdkosUUFBUStKLHdCQUFSLEdBQW1DLFVBQUNOLFNBQUQ7QUFDbEMsTUFBQXRKLEdBQUE7QUFBQSxTQUFPc0osY0FBYSxTQUFiLElBQTBCLENBQUMsR0FBQXRKLE1BQUFILFFBQUFnSywyQkFBQSxrQkFBQTdKLElBQTRDc0osU0FBNUMsSUFBNEMsTUFBNUMsQ0FBbEM7QUFEa0MsQ0FBbkMsQyxDQUdBOzs7Ozs7OztBQU9BekosUUFBUWlLLGtCQUFSLEdBQTZCLFVBQUNsRyxPQUFELEVBQVU3RCxXQUFWLEVBQXVCb0osT0FBdkI7QUFDNUIsTUFBQVksZ0JBQUEsRUFBQVgsUUFBQSxFQUFBWSxjQUFBO0FBQUFBLG1CQUFpQkMsUUFBUSxrQkFBUixDQUFqQjs7QUFDQSxPQUFPckcsUUFBUUUsTUFBZjtBQUNDO0FDd0lDOztBRHZJRixNQUFBcUYsV0FBQSxPQUFHQSxRQUFTZSxXQUFaLEdBQVksTUFBWjtBQUVDSCx1QkFBbUIsRUFBbkI7QUFDQW5HLFlBQVE5QixPQUFSLENBQWdCLFVBQUNpQyxDQUFEO0FBQ2ZnRyx1QkFBaUI1SCxJQUFqQixDQUFzQjRCLENBQXRCO0FDd0lHLGFEdklIZ0csaUJBQWlCNUgsSUFBakIsQ0FBc0IsSUFBdEIsQ0N1SUc7QUR6SUo7QUFHQTRILHFCQUFpQkksR0FBakI7QUFDQXZHLGNBQVVtRyxnQkFBVjtBQ3lJQzs7QUR4SUZYLGFBQVdZLGVBQWVGLGtCQUFmLENBQWtDbEcsT0FBbEMsRUFBMkMvRCxRQUFRdUssWUFBbkQsQ0FBWDtBQUNBLFNBQU9oQixRQUFQO0FBYjRCLENBQTdCLEMsQ0FlQTs7Ozs7Ozs7QUFPQXZKLFFBQVF3Syx1QkFBUixHQUFrQyxVQUFDekcsT0FBRCxFQUFVMEcsWUFBVixFQUF3Qm5CLE9BQXhCO0FBQ2pDLE1BQUFvQixZQUFBO0FBQUFBLGlCQUFlRCxhQUFhN0IsT0FBYixDQUFxQixTQUFyQixFQUFnQyxHQUFoQyxFQUFxQ0EsT0FBckMsQ0FBNkMsU0FBN0MsRUFBd0QsR0FBeEQsRUFBNkRBLE9BQTdELENBQXFFLEtBQXJFLEVBQTRFLEdBQTVFLEVBQWlGQSxPQUFqRixDQUF5RixLQUF6RixFQUFnRyxHQUFoRyxFQUFxR0EsT0FBckcsQ0FBNkcsTUFBN0csRUFBcUgsR0FBckgsRUFBMEhBLE9BQTFILENBQWtJLFlBQWxJLEVBQWdKLE1BQWhKLENBQWY7QUFDQThCLGlCQUFlQSxhQUFhOUIsT0FBYixDQUFxQixTQUFyQixFQUFnQyxVQUFDK0IsQ0FBRDtBQUM5QyxRQUFBQyxFQUFBLEVBQUF6RyxLQUFBLEVBQUF1RixNQUFBLEVBQUFFLFlBQUEsRUFBQXBILEtBQUE7O0FBQUFvSSxTQUFLN0csUUFBUTRHLElBQUUsQ0FBVixDQUFMO0FBQ0F4RyxZQUFReUcsR0FBR3pHLEtBQVg7QUFDQXVGLGFBQVNrQixHQUFHbkIsU0FBWjs7QUFDQSxRQUFHN0osT0FBT3NGLFFBQVY7QUFDQzFDLGNBQVF4QyxRQUFRNkosZUFBUixDQUF3QmUsR0FBR3BJLEtBQTNCLENBQVI7QUFERDtBQUdDQSxjQUFReEMsUUFBUTZKLGVBQVIsQ0FBd0JlLEdBQUdwSSxLQUEzQixFQUFrQyxJQUFsQyxFQUF3QzhHLE9BQXhDLENBQVI7QUMrSUU7O0FEOUlITSxtQkFBZSxFQUFmOztBQUNBLFFBQUc1SCxFQUFFNkksT0FBRixDQUFVckksS0FBVixNQUFvQixJQUF2QjtBQUNDLFVBQUdrSCxXQUFVLEdBQWI7QUFDQzFILFVBQUVlLElBQUYsQ0FBT1AsS0FBUCxFQUFjLFVBQUMvQyxDQUFEO0FDZ0pSLGlCRC9JTG1LLGFBQWF0SCxJQUFiLENBQWtCLENBQUM2QixLQUFELEVBQVF1RixNQUFSLEVBQWdCakssQ0FBaEIsQ0FBbEIsRUFBc0MsSUFBdEMsQ0MrSUs7QURoSk47QUFERCxhQUdLLElBQUdpSyxXQUFVLElBQWI7QUFDSjFILFVBQUVlLElBQUYsQ0FBT1AsS0FBUCxFQUFjLFVBQUMvQyxDQUFEO0FDaUpSLGlCRGhKTG1LLGFBQWF0SCxJQUFiLENBQWtCLENBQUM2QixLQUFELEVBQVF1RixNQUFSLEVBQWdCakssQ0FBaEIsQ0FBbEIsRUFBc0MsS0FBdEMsQ0NnSks7QURqSk47QUFESTtBQUlKdUMsVUFBRWUsSUFBRixDQUFPUCxLQUFQLEVBQWMsVUFBQy9DLENBQUQ7QUNrSlIsaUJEakpMbUssYUFBYXRILElBQWIsQ0FBa0IsQ0FBQzZCLEtBQUQsRUFBUXVGLE1BQVIsRUFBZ0JqSyxDQUFoQixDQUFsQixFQUFzQyxJQUF0QyxDQ2lKSztBRGxKTjtBQ29KRzs7QURsSkosVUFBR21LLGFBQWFBLGFBQWEzRixNQUFiLEdBQXNCLENBQW5DLE1BQXlDLEtBQXpDLElBQWtEMkYsYUFBYUEsYUFBYTNGLE1BQWIsR0FBc0IsQ0FBbkMsTUFBeUMsSUFBOUY7QUFDQzJGLHFCQUFhVSxHQUFiO0FBWEY7QUFBQTtBQWFDVixxQkFBZSxDQUFDekYsS0FBRCxFQUFRdUYsTUFBUixFQUFnQmxILEtBQWhCLENBQWY7QUNxSkU7O0FEcEpIMEcsWUFBUUMsR0FBUixDQUFZLGNBQVosRUFBNEJTLFlBQTVCO0FBQ0EsV0FBT2tCLEtBQUtDLFNBQUwsQ0FBZW5CLFlBQWYsQ0FBUDtBQXhCYyxJQUFmO0FBMEJBYyxpQkFBZSxNQUFJQSxZQUFKLEdBQWlCLEdBQWhDO0FBQ0EsU0FBTzFLLFFBQU8sTUFBUCxFQUFhMEssWUFBYixDQUFQO0FBN0JpQyxDQUFsQzs7QUErQkExSyxRQUFROEMsaUJBQVIsR0FBNEIsVUFBQzVDLFdBQUQsRUFBYzhLLE9BQWQsRUFBdUJDLE1BQXZCO0FBQzNCLE1BQUF0SixPQUFBLEVBQUFrRixXQUFBLEVBQUFxRSxvQkFBQSxFQUFBQyxlQUFBLEVBQUFDLGlCQUFBOztBQUFBLE1BQUd4TCxPQUFPc0YsUUFBVjtBQUNDLFFBQUcsQ0FBQ2hGLFdBQUo7QUFDQ0Esb0JBQWNTLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUN3SkU7O0FEdkpILFFBQUcsQ0FBQ29LLE9BQUo7QUFDQ0EsZ0JBQVVySyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFWO0FDeUpFOztBRHhKSCxRQUFHLENBQUNxSyxNQUFKO0FBQ0NBLGVBQVNyTCxPQUFPcUwsTUFBUCxFQUFUO0FBTkY7QUNpS0U7O0FEekpGQyx5QkFBdUIsRUFBdkI7QUFDQXZKLFlBQVUzQixRQUFRSSxTQUFSLENBQWtCRixXQUFsQixDQUFWOztBQUVBLE1BQUcsQ0FBQ3lCLE9BQUo7QUFDQyxXQUFPdUosb0JBQVA7QUMwSkM7O0FEdEpGQyxvQkFBa0JuTCxRQUFRcUwsaUJBQVIsQ0FBMEIxSixRQUFRMkosZ0JBQWxDLENBQWxCO0FBRUFKLHlCQUF1QmxKLEVBQUVxRixLQUFGLENBQVE4RCxlQUFSLEVBQXdCLGFBQXhCLENBQXZCOztBQUNBLE9BQUFELHdCQUFBLE9BQUdBLHFCQUFzQmpILE1BQXpCLEdBQXlCLE1BQXpCLE1BQW1DLENBQW5DO0FBQ0MsV0FBT2lILG9CQUFQO0FDdUpDOztBRHJKRnJFLGdCQUFjN0csUUFBUXVMLGNBQVIsQ0FBdUJyTCxXQUF2QixFQUFvQzhLLE9BQXBDLEVBQTZDQyxNQUE3QyxDQUFkO0FBQ0FHLHNCQUFvQnZFLFlBQVl1RSxpQkFBaEM7QUFFQUYseUJBQXVCbEosRUFBRXdKLFVBQUYsQ0FBYU4sb0JBQWIsRUFBbUNFLGlCQUFuQyxDQUF2QjtBQUNBLFNBQU9wSixFQUFFc0YsTUFBRixDQUFTNkQsZUFBVCxFQUEwQixVQUFDTSxjQUFEO0FBQ2hDLFFBQUEzRSxTQUFBLEVBQUE0RSxRQUFBLEVBQUF2TCxHQUFBLEVBQUFtQixtQkFBQTtBQUFBQSwwQkFBc0JtSyxlQUFldkwsV0FBckM7QUFDQXdMLGVBQVdSLHFCQUFxQnRILE9BQXJCLENBQTZCdEMsbUJBQTdCLElBQW9ELENBQUMsQ0FBaEU7QUFDQXdGLGdCQUFBLENBQUEzRyxNQUFBSCxRQUFBdUwsY0FBQSxDQUFBakssbUJBQUEsRUFBQTBKLE9BQUEsRUFBQUMsTUFBQSxhQUFBOUssSUFBMEUyRyxTQUExRSxHQUEwRSxNQUExRTtBQUNBLFdBQU80RSxZQUFhNUUsU0FBcEI7QUFKTSxJQUFQO0FBM0IyQixDQUE1Qjs7QUFpQ0E5RyxRQUFRMkwscUJBQVIsR0FBZ0MsVUFBQ3pMLFdBQUQsRUFBYzhLLE9BQWQsRUFBdUJDLE1BQXZCO0FBQy9CLE1BQUFFLGVBQUE7QUFBQUEsb0JBQWtCbkwsUUFBUThDLGlCQUFSLENBQTBCNUMsV0FBMUIsRUFBdUM4SyxPQUF2QyxFQUFnREMsTUFBaEQsQ0FBbEI7QUFDQSxTQUFPakosRUFBRXFGLEtBQUYsQ0FBUThELGVBQVIsRUFBd0IsYUFBeEIsQ0FBUDtBQUYrQixDQUFoQzs7QUFJQW5MLFFBQVE0TCxVQUFSLEdBQXFCLFVBQUMxTCxXQUFELEVBQWM4SyxPQUFkLEVBQXVCQyxNQUF2QjtBQUNwQixNQUFBWSxPQUFBLEVBQUFDLGdCQUFBLEVBQUFsRixHQUFBLEVBQUFDLFdBQUE7O0FBQUEsTUFBR2pILE9BQU9zRixRQUFWO0FBQ0MsUUFBRyxDQUFDaEYsV0FBSjtBQUNDQSxvQkFBY1MsUUFBUUMsR0FBUixDQUFZLGFBQVosQ0FBZDtBQzRKRTs7QUQzSkgsUUFBRyxDQUFDb0ssT0FBSjtBQUNDQSxnQkFBVXJLLFFBQVFDLEdBQVIsQ0FBWSxTQUFaLENBQVY7QUM2SkU7O0FENUpILFFBQUcsQ0FBQ3FLLE1BQUo7QUFDQ0EsZUFBU3JMLE9BQU9xTCxNQUFQLEVBQVQ7QUFORjtBQ3FLRTs7QUQ3SkZyRSxRQUFNNUcsUUFBUUksU0FBUixDQUFrQkYsV0FBbEIsQ0FBTjs7QUFFQSxNQUFHLENBQUMwRyxHQUFKO0FBQ0M7QUM4SkM7O0FENUpGQyxnQkFBYzdHLFFBQVF1TCxjQUFSLENBQXVCckwsV0FBdkIsRUFBb0M4SyxPQUFwQyxFQUE2Q0MsTUFBN0MsQ0FBZDtBQUNBYSxxQkFBbUJqRixZQUFZaUYsZ0JBQS9CO0FBQ0FELFlBQVU3SixFQUFFK0osTUFBRixDQUFTL0osRUFBRWdLLE1BQUYsQ0FBU3BGLElBQUlpRixPQUFiLENBQVQsRUFBaUMsTUFBakMsQ0FBVjs7QUFFQTdKLElBQUVlLElBQUYsQ0FBTzhJLE9BQVAsRUFBZ0IsVUFBQ0ksTUFBRDtBQUNmLFFBQUd2RixRQUFRRixRQUFSLE1BQXNCeUYsT0FBT0MsRUFBUCxLQUFhLFFBQW5DLElBQStDRCxPQUFPM0ksSUFBUCxLQUFlLGVBQWpFO0FDNkpJLGFENUpIMkksT0FBT0MsRUFBUCxHQUFZLGFDNEpUO0FBQ0Q7QUQvSko7O0FBSUFMLFlBQVU3SixFQUFFc0YsTUFBRixDQUFTdUUsT0FBVCxFQUFrQixVQUFDSSxNQUFEO0FBQzNCLFdBQU9qSyxFQUFFNEIsT0FBRixDQUFVa0ksZ0JBQVYsRUFBNEJHLE9BQU8zSSxJQUFuQyxJQUEyQyxDQUFsRDtBQURTLElBQVY7QUFHQSxTQUFPdUksT0FBUDtBQXpCb0IsQ0FBckI7O0FBMkJBOztBQUlBN0wsUUFBUW1NLFlBQVIsR0FBdUIsVUFBQ2pNLFdBQUQsRUFBYzhLLE9BQWQsRUFBdUJDLE1BQXZCO0FBQ3RCLE1BQUFtQixtQkFBQSxFQUFBNUYsUUFBQSxFQUFBNkYsVUFBQSxFQUFBQyxNQUFBOztBQUFBLE1BQUcxTSxPQUFPc0YsUUFBVjtBQUNDLFFBQUcsQ0FBQ2hGLFdBQUo7QUFDQ0Esb0JBQWNTLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUM4SkU7O0FEN0pILFFBQUcsQ0FBQ29LLE9BQUo7QUFDQ0EsZ0JBQVVySyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFWO0FDK0pFOztBRDlKSCxRQUFHLENBQUNxSyxNQUFKO0FBQ0NBLGVBQVNyTCxPQUFPcUwsTUFBUCxFQUFUO0FBTkY7QUN1S0U7O0FEL0pGcUIsV0FBU3RNLFFBQVFJLFNBQVIsQ0FBa0JGLFdBQWxCLENBQVQ7O0FBRUEsTUFBRyxDQUFDb00sTUFBSjtBQUNDO0FDZ0tDOztBRDlKRkYsd0JBQXNCcE0sUUFBUXVMLGNBQVIsQ0FBdUJyTCxXQUF2QixFQUFvQzhLLE9BQXBDLEVBQTZDQyxNQUE3QyxFQUFxRG1CLG1CQUFyRCxJQUE0RSxFQUFsRztBQUVBQyxlQUFhLEVBQWI7QUFFQTdGLGFBQVdFLFFBQVFGLFFBQVIsRUFBWDs7QUFFQXhFLElBQUVlLElBQUYsQ0FBT3VKLE9BQU9ELFVBQWQsRUFBMEIsVUFBQ0UsSUFBRCxFQUFPQyxTQUFQO0FBQ3pCLFFBQUdoRyxZQUFhK0YsS0FBS2xLLElBQUwsS0FBYSxVQUE3QjtBQUVDO0FDNEpFOztBRDNKSCxRQUFHbUssY0FBYSxTQUFoQjtBQUNDLFVBQUd4SyxFQUFFNEIsT0FBRixDQUFVd0ksbUJBQVYsRUFBK0JJLFNBQS9CLElBQTRDLENBQTVDLElBQWlERCxLQUFLRSxLQUFMLEtBQWN4QixNQUFsRTtBQzZKSyxlRDVKSm9CLFdBQVcvSixJQUFYLENBQWdCaUssSUFBaEIsQ0M0Skk7QUQ5Sk47QUNnS0c7QURwS0o7O0FBUUEsU0FBT0YsVUFBUDtBQTVCc0IsQ0FBdkI7O0FBK0JBck0sUUFBUXlELFNBQVIsR0FBb0IsVUFBQ3ZELFdBQUQsRUFBYzhLLE9BQWQsRUFBdUJDLE1BQXZCO0FBQ25CLE1BQUF5QixVQUFBLEVBQUFDLGlCQUFBOztBQUFBLE1BQUcvTSxPQUFPc0YsUUFBVjtBQUNDLFFBQUcsQ0FBQ2hGLFdBQUo7QUFDQ0Esb0JBQWNTLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUNnS0U7O0FEL0pILFFBQUcsQ0FBQ29LLE9BQUo7QUFDQ0EsZ0JBQVVySyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFWO0FDaUtFOztBRGhLSCxRQUFHLENBQUNxSyxNQUFKO0FBQ0NBLGVBQVNyTCxPQUFPcUwsTUFBUCxFQUFUO0FBTkY7QUN5S0U7O0FEaktGeUIsZUFBYTFNLFFBQVE0TSxtQkFBUixDQUE0QjFNLFdBQTVCLENBQWI7QUFDQXlNLHNCQUFxQjNNLFFBQVF1TCxjQUFSLENBQXVCckwsV0FBdkIsRUFBb0M4SyxPQUFwQyxFQUE2Q0MsTUFBN0MsRUFBcUQwQixpQkFBMUU7QUFDQSxTQUFPM0ssRUFBRXdKLFVBQUYsQ0FBYWtCLFVBQWIsRUFBeUJDLGlCQUF6QixDQUFQO0FBWG1CLENBQXBCOztBQWFBM00sUUFBUTZNLFNBQVIsR0FBb0I7QUFDbkIsU0FBTyxDQUFDN00sUUFBUThNLGVBQVIsQ0FBd0JsTSxHQUF4QixFQUFSO0FBRG1CLENBQXBCOztBQUdBWixRQUFRK00sdUJBQVIsR0FBa0MsVUFBQ0MsR0FBRDtBQUNqQyxTQUFPQSxJQUFJcEUsT0FBSixDQUFZLG1DQUFaLEVBQWlELE1BQWpELENBQVA7QUFEaUMsQ0FBbEM7O0FBS0E1SSxRQUFRaU4saUJBQVIsR0FBNEIsVUFBQzVNLE1BQUQ7QUFDM0IsTUFBQXdCLE1BQUE7QUFBQUEsV0FBU0csRUFBRXlHLEdBQUYsQ0FBTXBJLE1BQU4sRUFBYyxVQUFDOEQsS0FBRCxFQUFRK0ksU0FBUjtBQUN0QixXQUFPL0ksTUFBTWdKLFFBQU4sSUFBbUJoSixNQUFNZ0osUUFBTixDQUFlQyxRQUFsQyxJQUErQyxDQUFDakosTUFBTWdKLFFBQU4sQ0FBZUUsSUFBL0QsSUFBd0VILFNBQS9FO0FBRFEsSUFBVDtBQUdBckwsV0FBU0csRUFBRTJHLE9BQUYsQ0FBVTlHLE1BQVYsQ0FBVDtBQUNBLFNBQU9BLE1BQVA7QUFMMkIsQ0FBNUI7O0FBT0E3QixRQUFRc04sZUFBUixHQUEwQixVQUFDak4sTUFBRDtBQUN6QixNQUFBd0IsTUFBQTtBQUFBQSxXQUFTRyxFQUFFeUcsR0FBRixDQUFNcEksTUFBTixFQUFjLFVBQUM4RCxLQUFELEVBQVErSSxTQUFSO0FBQ3RCLFdBQU8vSSxNQUFNZ0osUUFBTixJQUFtQmhKLE1BQU1nSixRQUFOLENBQWU5SyxJQUFmLEtBQXVCLFFBQTFDLElBQXVELENBQUM4QixNQUFNZ0osUUFBTixDQUFlRSxJQUF2RSxJQUFnRkgsU0FBdkY7QUFEUSxJQUFUO0FBR0FyTCxXQUFTRyxFQUFFMkcsT0FBRixDQUFVOUcsTUFBVixDQUFUO0FBQ0EsU0FBT0EsTUFBUDtBQUx5QixDQUExQjs7QUFPQTdCLFFBQVF1TixvQkFBUixHQUErQixVQUFDbE4sTUFBRDtBQUM5QixNQUFBd0IsTUFBQTtBQUFBQSxXQUFTRyxFQUFFeUcsR0FBRixDQUFNcEksTUFBTixFQUFjLFVBQUM4RCxLQUFELEVBQVErSSxTQUFSO0FBQ3RCLFdBQU8sQ0FBQyxDQUFDL0ksTUFBTWdKLFFBQVAsSUFBbUIsQ0FBQ2hKLE1BQU1nSixRQUFOLENBQWVLLEtBQW5DLElBQTRDckosTUFBTWdKLFFBQU4sQ0FBZUssS0FBZixLQUF3QixHQUFyRSxNQUErRSxDQUFDckosTUFBTWdKLFFBQVAsSUFBbUJoSixNQUFNZ0osUUFBTixDQUFlOUssSUFBZixLQUF1QixRQUF6SCxLQUF1STZLLFNBQTlJO0FBRFEsSUFBVDtBQUdBckwsV0FBU0csRUFBRTJHLE9BQUYsQ0FBVTlHLE1BQVYsQ0FBVDtBQUNBLFNBQU9BLE1BQVA7QUFMOEIsQ0FBL0I7O0FBT0E3QixRQUFReU4sd0JBQVIsR0FBbUMsVUFBQ3BOLE1BQUQ7QUFDbEMsTUFBQXFOLEtBQUE7QUFBQUEsVUFBUTFMLEVBQUV5RyxHQUFGLENBQU1wSSxNQUFOLEVBQWMsVUFBQzhELEtBQUQ7QUFDcEIsV0FBT0EsTUFBTWdKLFFBQU4sSUFBbUJoSixNQUFNZ0osUUFBTixDQUFlSyxLQUFmLEtBQXdCLEdBQTNDLElBQW1EckosTUFBTWdKLFFBQU4sQ0FBZUssS0FBekU7QUFETSxJQUFSO0FBR0FFLFVBQVExTCxFQUFFMkcsT0FBRixDQUFVK0UsS0FBVixDQUFSO0FBQ0FBLFVBQVExTCxFQUFFMkwsTUFBRixDQUFTRCxLQUFULENBQVI7QUFDQSxTQUFPQSxLQUFQO0FBTmtDLENBQW5DOztBQVFBMU4sUUFBUTROLGlCQUFSLEdBQTRCLFVBQUN2TixNQUFELEVBQVN3TixTQUFUO0FBQ3pCLE1BQUFoTSxNQUFBO0FBQUFBLFdBQVNHLEVBQUV5RyxHQUFGLENBQU1wSSxNQUFOLEVBQWMsVUFBQzhELEtBQUQsRUFBUStJLFNBQVI7QUFDckIsV0FBTy9JLE1BQU1nSixRQUFOLElBQW1CaEosTUFBTWdKLFFBQU4sQ0FBZUssS0FBZixLQUF3QkssU0FBM0MsSUFBeUQxSixNQUFNZ0osUUFBTixDQUFlOUssSUFBZixLQUF1QixRQUFoRixJQUE2RjZLLFNBQXBHO0FBRE8sSUFBVDtBQUdBckwsV0FBU0csRUFBRTJHLE9BQUYsQ0FBVTlHLE1BQVYsQ0FBVDtBQUNBLFNBQU9BLE1BQVA7QUFMeUIsQ0FBNUI7O0FBT0E3QixRQUFROE4sb0JBQVIsR0FBK0IsVUFBQ3pOLE1BQUQsRUFBUzBOLElBQVQ7QUFDOUJBLFNBQU8vTCxFQUFFeUcsR0FBRixDQUFNc0YsSUFBTixFQUFZLFVBQUNwRyxHQUFEO0FBQ2xCLFFBQUF4RCxLQUFBLEVBQUFoRSxHQUFBO0FBQUFnRSxZQUFRbkMsRUFBRWdNLElBQUYsQ0FBTzNOLE1BQVAsRUFBZXNILEdBQWYsQ0FBUjs7QUFDQSxTQUFBeEgsTUFBQWdFLE1BQUF3RCxHQUFBLEVBQUF3RixRQUFBLFlBQUFoTixJQUF3QmtOLElBQXhCLEdBQXdCLE1BQXhCO0FBQ0MsYUFBTyxLQUFQO0FBREQ7QUFHQyxhQUFPMUYsR0FBUDtBQytLRTtBRHBMRyxJQUFQO0FBT0FvRyxTQUFPL0wsRUFBRTJHLE9BQUYsQ0FBVW9GLElBQVYsQ0FBUDtBQUNBLFNBQU9BLElBQVA7QUFUOEIsQ0FBL0I7O0FBV0EvTixRQUFRaU8scUJBQVIsR0FBZ0MsVUFBQ0MsY0FBRCxFQUFpQkgsSUFBakI7QUFDL0JBLFNBQU8vTCxFQUFFeUcsR0FBRixDQUFNc0YsSUFBTixFQUFZLFVBQUNwRyxHQUFEO0FBQ2xCLFFBQUczRixFQUFFNEIsT0FBRixDQUFVc0ssY0FBVixFQUEwQnZHLEdBQTFCLElBQWlDLENBQUMsQ0FBckM7QUFDQyxhQUFPQSxHQUFQO0FBREQ7QUFHQyxhQUFPLEtBQVA7QUNpTEU7QURyTEcsSUFBUDtBQU1Bb0csU0FBTy9MLEVBQUUyRyxPQUFGLENBQVVvRixJQUFWLENBQVA7QUFDQSxTQUFPQSxJQUFQO0FBUitCLENBQWhDOztBQVVBL04sUUFBUW1PLG1CQUFSLEdBQThCLFVBQUM5TixNQUFELEVBQVMwTixJQUFULEVBQWVLLFFBQWY7QUFDN0IsTUFBQUMsS0FBQSxFQUFBQyxTQUFBLEVBQUF6TSxNQUFBLEVBQUFpSCxDQUFBLEVBQUF5RixTQUFBLEVBQUFDLFNBQUEsRUFBQUMsSUFBQSxFQUFBQyxJQUFBOztBQUFBN00sV0FBUyxFQUFUO0FBQ0FpSCxNQUFJLENBQUo7QUFDQXVGLFVBQVFyTSxFQUFFc0YsTUFBRixDQUFTeUcsSUFBVCxFQUFlLFVBQUNwRyxHQUFEO0FBQ3RCLFdBQU8sQ0FBQ0EsSUFBSWdILFFBQUosQ0FBYSxVQUFiLENBQVI7QUFETyxJQUFSOztBQUdBLFNBQU03RixJQUFJdUYsTUFBTXBLLE1BQWhCO0FBQ0N3SyxXQUFPek0sRUFBRWdNLElBQUYsQ0FBTzNOLE1BQVAsRUFBZWdPLE1BQU12RixDQUFOLENBQWYsQ0FBUDtBQUNBNEYsV0FBTzFNLEVBQUVnTSxJQUFGLENBQU8zTixNQUFQLEVBQWVnTyxNQUFNdkYsSUFBRSxDQUFSLENBQWYsQ0FBUDtBQUVBeUYsZ0JBQVksS0FBWjtBQUNBQyxnQkFBWSxLQUFaOztBQUtBeE0sTUFBRWUsSUFBRixDQUFPMEwsSUFBUCxFQUFhLFVBQUNqTSxLQUFEO0FBQ1osVUFBQXJDLEdBQUEsRUFBQTZFLElBQUE7O0FBQUEsWUFBQTdFLE1BQUFxQyxNQUFBMkssUUFBQSxZQUFBaE4sSUFBbUJ5TyxPQUFuQixHQUFtQixNQUFuQixLQUFHLEVBQUE1SixPQUFBeEMsTUFBQTJLLFFBQUEsWUFBQW5JLEtBQTJDM0MsSUFBM0MsR0FBMkMsTUFBM0MsTUFBbUQsT0FBdEQ7QUNnTEssZUQvS0prTSxZQUFZLElDK0tSO0FBQ0Q7QURsTEw7O0FBT0F2TSxNQUFFZSxJQUFGLENBQU8yTCxJQUFQLEVBQWEsVUFBQ2xNLEtBQUQ7QUFDWixVQUFBckMsR0FBQSxFQUFBNkUsSUFBQTs7QUFBQSxZQUFBN0UsTUFBQXFDLE1BQUEySyxRQUFBLFlBQUFoTixJQUFtQnlPLE9BQW5CLEdBQW1CLE1BQW5CLEtBQUcsRUFBQTVKLE9BQUF4QyxNQUFBMkssUUFBQSxZQUFBbkksS0FBMkMzQyxJQUEzQyxHQUEyQyxNQUEzQyxNQUFtRCxPQUF0RDtBQytLSyxlRDlLSm1NLFlBQVksSUM4S1I7QUFDRDtBRGpMTDs7QUFPQSxRQUFHOUgsUUFBUUYsUUFBUixFQUFIO0FBQ0MrSCxrQkFBWSxJQUFaO0FBQ0FDLGtCQUFZLElBQVo7QUM2S0U7O0FEM0tILFFBQUdKLFFBQUg7QUFDQ3ZNLGFBQU9TLElBQVAsQ0FBWStMLE1BQU1RLEtBQU4sQ0FBWS9GLENBQVosRUFBZUEsSUFBRSxDQUFqQixDQUFaO0FBQ0FBLFdBQUssQ0FBTDtBQUZEO0FBVUMsVUFBR3lGLFNBQUg7QUFDQzFNLGVBQU9TLElBQVAsQ0FBWStMLE1BQU1RLEtBQU4sQ0FBWS9GLENBQVosRUFBZUEsSUFBRSxDQUFqQixDQUFaO0FBQ0FBLGFBQUssQ0FBTDtBQUZELGFBR0ssSUFBRyxDQUFDeUYsU0FBRCxJQUFlQyxTQUFsQjtBQUNKRixvQkFBWUQsTUFBTVEsS0FBTixDQUFZL0YsQ0FBWixFQUFlQSxJQUFFLENBQWpCLENBQVo7QUFDQXdGLGtCQUFVaE0sSUFBVixDQUFlLE1BQWY7QUFDQVQsZUFBT1MsSUFBUCxDQUFZZ00sU0FBWjtBQUNBeEYsYUFBSyxDQUFMO0FBSkksYUFLQSxJQUFHLENBQUN5RixTQUFELElBQWUsQ0FBQ0MsU0FBbkI7QUFDSkYsb0JBQVlELE1BQU1RLEtBQU4sQ0FBWS9GLENBQVosRUFBZUEsSUFBRSxDQUFqQixDQUFaOztBQUNBLFlBQUd1RixNQUFNdkYsSUFBRSxDQUFSLENBQUg7QUFDQ3dGLG9CQUFVaE0sSUFBVixDQUFlK0wsTUFBTXZGLElBQUUsQ0FBUixDQUFmO0FBREQ7QUFHQ3dGLG9CQUFVaE0sSUFBVixDQUFlLE1BQWY7QUN1S0k7O0FEdEtMVCxlQUFPUyxJQUFQLENBQVlnTSxTQUFaO0FBQ0F4RixhQUFLLENBQUw7QUF6QkY7QUNrTUc7QUQ5Tko7O0FBdURBLFNBQU9qSCxNQUFQO0FBN0Q2QixDQUE5Qjs7QUErREE3QixRQUFROE8sa0JBQVIsR0FBNkIsVUFBQ3JQLENBQUQ7QUFDNUIsU0FBTyxPQUFPQSxDQUFQLEtBQVksV0FBWixJQUEyQkEsTUFBSyxJQUFoQyxJQUF3Q3NQLE9BQU9DLEtBQVAsQ0FBYXZQLENBQWIsQ0FBeEMsSUFBMkRBLEVBQUV3RSxNQUFGLEtBQVksQ0FBOUU7QUFENEIsQ0FBN0I7O0FBS0EsSUFBR3JFLE9BQU9xUCxRQUFWO0FBQ0NqUCxVQUFRa1Asb0JBQVIsR0FBK0IsVUFBQ2hQLFdBQUQ7QUFDOUIsUUFBQWdMLG9CQUFBO0FBQUFBLDJCQUF1QixFQUF2Qjs7QUFDQWxKLE1BQUVlLElBQUYsQ0FBTy9DLFFBQVF1SCxPQUFmLEVBQXdCLFVBQUNrRSxjQUFELEVBQWlCbkssbUJBQWpCO0FDMktwQixhRDFLSFUsRUFBRWUsSUFBRixDQUFPMEksZUFBZTVKLE1BQXRCLEVBQThCLFVBQUNzTixhQUFELEVBQWdCQyxrQkFBaEI7QUFDN0IsWUFBR0QsY0FBYzlNLElBQWQsS0FBc0IsZUFBdEIsSUFBMEM4TSxjQUFjek0sWUFBeEQsSUFBeUV5TSxjQUFjek0sWUFBZCxLQUE4QnhDLFdBQTFHO0FDMktNLGlCRDFLTGdMLHFCQUFxQjVJLElBQXJCLENBQTBCaEIsbUJBQTFCLENDMEtLO0FBQ0Q7QUQ3S04sUUMwS0c7QUQzS0o7O0FBS0EsUUFBR3RCLFFBQVFJLFNBQVIsQ0FBa0JGLFdBQWxCLEVBQStCbVAsWUFBbEM7QUFDQ25FLDJCQUFxQjVJLElBQXJCLENBQTBCLFdBQTFCO0FDNktFOztBRDNLSCxXQUFPNEksb0JBQVA7QUFWOEIsR0FBL0I7QUN3TEEsQzs7Ozs7Ozs7Ozs7O0FDLzBCRGxMLFFBQVFzUCxVQUFSLEdBQXFCLEVBQXJCLEM7Ozs7Ozs7Ozs7OztBQ0FBMVAsT0FBTzJQLE9BQVAsQ0FDQztBQUFBLDBCQUF3QixVQUFDclAsV0FBRCxFQUFjSyxTQUFkLEVBQXlCaVAsUUFBekI7QUFDdkIsUUFBQUMsd0JBQUEsRUFBQUMscUJBQUEsRUFBQUMsR0FBQSxFQUFBNUwsT0FBQTs7QUFBQSxRQUFHLENBQUMsS0FBS2tILE1BQVQ7QUFDQyxhQUFPLElBQVA7QUNFRTs7QURBSCxRQUFHL0ssZ0JBQWUsc0JBQWxCO0FBQ0M7QUNFRTs7QURESCxRQUFHQSxlQUFnQkssU0FBbkI7QUFDQyxVQUFHLENBQUNpUCxRQUFKO0FBQ0NHLGNBQU0zUCxRQUFRc0YsYUFBUixDQUFzQnBGLFdBQXRCLEVBQW1DcUYsT0FBbkMsQ0FBMkM7QUFBQ3pFLGVBQUtQO0FBQU4sU0FBM0MsRUFBNkQ7QUFBQ3NCLGtCQUFRO0FBQUMrTixtQkFBTztBQUFSO0FBQVQsU0FBN0QsQ0FBTjtBQUNBSixtQkFBQUcsT0FBQSxPQUFXQSxJQUFLQyxLQUFoQixHQUFnQixNQUFoQjtBQ1NHOztBRFBKSCxpQ0FBMkJ6UCxRQUFRc0YsYUFBUixDQUFzQixzQkFBdEIsQ0FBM0I7QUFDQXZCLGdCQUFVO0FBQUUwSSxlQUFPLEtBQUt4QixNQUFkO0FBQXNCMkUsZUFBT0osUUFBN0I7QUFBdUMsb0JBQVl0UCxXQUFuRDtBQUFnRSxzQkFBYyxDQUFDSyxTQUFEO0FBQTlFLE9BQVY7QUFDQW1QLDhCQUF3QkQseUJBQXlCbEssT0FBekIsQ0FBaUN4QixPQUFqQyxDQUF4Qjs7QUFDQSxVQUFHMkwscUJBQUg7QUFDQ0QsaUNBQXlCSSxNQUF6QixDQUNDSCxzQkFBc0I1TyxHQUR2QixFQUVDO0FBQ0NnUCxnQkFBTTtBQUNMQyxtQkFBTztBQURGLFdBRFA7QUFJQ0MsZ0JBQU07QUFDTEMsc0JBQVUsSUFBSUMsSUFBSixFQURMO0FBRUxDLHlCQUFhLEtBQUtsRjtBQUZiO0FBSlAsU0FGRDtBQUREO0FBY0N3RSxpQ0FBeUJXLE1BQXpCLENBQ0M7QUFDQ3RQLGVBQUsyTyx5QkFBeUJZLFVBQXpCLEVBRE47QUFFQzVELGlCQUFPLEtBQUt4QixNQUZiO0FBR0MyRSxpQkFBT0osUUFIUjtBQUlDekssa0JBQVE7QUFBQ3VMLGVBQUdwUSxXQUFKO0FBQWlCcVEsaUJBQUssQ0FBQ2hRLFNBQUQ7QUFBdEIsV0FKVDtBQUtDd1AsaUJBQU8sQ0FMUjtBQU1DUyxtQkFBUyxJQUFJTixJQUFKLEVBTlY7QUFPQ08sc0JBQVksS0FBS3hGLE1BUGxCO0FBUUNnRixvQkFBVSxJQUFJQyxJQUFKLEVBUlg7QUFTQ0MsdUJBQWEsS0FBS2xGO0FBVG5CLFNBREQ7QUF0QkY7QUMrQ0c7QURyREo7QUFBQSxDQURELEU7Ozs7Ozs7Ozs7OztBRUFBLElBQUF5RixzQkFBQSxFQUFBQyxnQkFBQSxFQUFBQyxhQUFBOztBQUFBRCxtQkFBbUIsVUFBQ0YsVUFBRCxFQUFhekYsT0FBYixFQUFzQjZGLFFBQXRCLEVBQWdDQyxRQUFoQztBQ0dqQixTREZEOVEsUUFBUStRLFdBQVIsQ0FBb0JDLG9CQUFwQixDQUF5Q0MsYUFBekMsR0FBeURDLFNBQXpELENBQW1FLENBQ2xFO0FBQUNDLFlBQVE7QUFBQ1Ysa0JBQVlBLFVBQWI7QUFBeUJiLGFBQU81RTtBQUFoQztBQUFULEdBRGtFLEVBRWxFO0FBQUNvRyxZQUFRO0FBQUN0USxXQUFLO0FBQUNaLHFCQUFhLFdBQWQ7QUFBMkJLLG1CQUFXLGFBQXRDO0FBQXFEcVAsZUFBTztBQUE1RCxPQUFOO0FBQTZFeUIsa0JBQVk7QUFBQ0MsY0FBTTtBQUFQO0FBQXpGO0FBQVQsR0FGa0UsRUFHbEU7QUFBQ0MsV0FBTztBQUFDRixrQkFBWSxDQUFDO0FBQWQ7QUFBUixHQUhrRSxFQUlsRTtBQUFDRyxZQUFRO0FBQVQsR0FKa0UsQ0FBbkUsRUFLR0MsT0FMSCxDQUtXLFVBQUNDLEdBQUQsRUFBTUMsSUFBTjtBQUNWLFFBQUdELEdBQUg7QUFDQyxZQUFNLElBQUlFLEtBQUosQ0FBVUYsR0FBVixDQUFOO0FDc0JFOztBRHBCSEMsU0FBSzFQLE9BQUwsQ0FBYSxVQUFDME4sR0FBRDtBQ3NCVCxhRHJCSGtCLFNBQVN2TyxJQUFULENBQWNxTixJQUFJN08sR0FBbEIsQ0NxQkc7QUR0Qko7O0FBR0EsUUFBR2dRLFlBQVk5TyxFQUFFNlAsVUFBRixDQUFhZixRQUFiLENBQWY7QUFDQ0E7QUNzQkU7QURuQ0osSUNFQztBREhpQixDQUFuQjs7QUFrQkFKLHlCQUF5QjlRLE9BQU9rUyxTQUFQLENBQWlCbkIsZ0JBQWpCLENBQXpCOztBQUVBQyxnQkFBZ0IsVUFBQ2hCLEtBQUQsRUFBUTFQLFdBQVIsRUFBb0IrSyxNQUFwQixFQUE0QjhHLFVBQTVCO0FBQ2YsTUFBQXBRLE9BQUEsRUFBQXFRLGtCQUFBLEVBQUFDLGdCQUFBLEVBQUFOLElBQUEsRUFBQTlQLE1BQUEsRUFBQXFRLEtBQUEsRUFBQUMsU0FBQSxFQUFBQyxPQUFBLEVBQUFDLGVBQUE7O0FBQUFWLFNBQU8sSUFBSW5JLEtBQUosRUFBUDs7QUFFQSxNQUFHdUksVUFBSDtBQUVDcFEsY0FBVTNCLFFBQVFJLFNBQVIsQ0FBa0JGLFdBQWxCLENBQVY7QUFFQThSLHlCQUFxQmhTLFFBQVFzRixhQUFSLENBQXNCcEYsV0FBdEIsQ0FBckI7QUFDQStSLHVCQUFBdFEsV0FBQSxPQUFtQkEsUUFBUzJRLGNBQTVCLEdBQTRCLE1BQTVCOztBQUNBLFFBQUczUSxXQUFXcVEsa0JBQVgsSUFBaUNDLGdCQUFwQztBQUNDQyxjQUFRLEVBQVI7QUFDQUcsd0JBQWtCTixXQUFXUSxLQUFYLENBQWlCLEdBQWpCLENBQWxCO0FBQ0FKLGtCQUFZLEVBQVo7QUFDQUUsc0JBQWdCcFEsT0FBaEIsQ0FBd0IsVUFBQ3VRLE9BQUQ7QUFDdkIsWUFBQUMsUUFBQTtBQUFBQSxtQkFBVyxFQUFYO0FBQ0FBLGlCQUFTUixnQkFBVCxJQUE2QjtBQUFDUyxrQkFBUUYsUUFBUUcsSUFBUjtBQUFULFNBQTdCO0FDd0JJLGVEdkJKUixVQUFVN1AsSUFBVixDQUFlbVEsUUFBZixDQ3VCSTtBRDFCTDtBQUtBUCxZQUFNVSxJQUFOLEdBQWFULFNBQWI7QUFDQUQsWUFBTXRDLEtBQU4sR0FBYztBQUFDaUQsYUFBSyxDQUFDakQsS0FBRDtBQUFOLE9BQWQ7QUFFQS9OLGVBQVM7QUFBQ2YsYUFBSztBQUFOLE9BQVQ7QUFDQWUsYUFBT29RLGdCQUFQLElBQTJCLENBQTNCO0FBRUFHLGdCQUFVSixtQkFBbUJ0TixJQUFuQixDQUF3QndOLEtBQXhCLEVBQStCO0FBQUNyUSxnQkFBUUEsTUFBVDtBQUFpQjJGLGNBQU07QUFBQ3lJLG9CQUFVO0FBQVgsU0FBdkI7QUFBc0M2QyxlQUFPO0FBQTdDLE9BQS9CLENBQVY7QUFFQVYsY0FBUW5RLE9BQVIsQ0FBZ0IsVUFBQzhDLE1BQUQ7QUMrQlgsZUQ5Qko0TSxLQUFLclAsSUFBTCxDQUFVO0FBQUN4QixlQUFLaUUsT0FBT2pFLEdBQWI7QUFBa0JpUyxpQkFBT2hPLE9BQU9rTixnQkFBUCxDQUF6QjtBQUFtRGUsd0JBQWM5UztBQUFqRSxTQUFWLENDOEJJO0FEL0JMO0FBdkJGO0FDNkRFOztBRG5DRixTQUFPeVIsSUFBUDtBQTdCZSxDQUFoQjs7QUErQkEvUixPQUFPMlAsT0FBUCxDQUNDO0FBQUEsMEJBQXdCLFVBQUN2RSxPQUFEO0FBQ3ZCLFFBQUEyRyxJQUFBLEVBQUFTLE9BQUE7QUFBQVQsV0FBTyxJQUFJbkksS0FBSixFQUFQO0FBQ0E0SSxjQUFVLElBQUk1SSxLQUFKLEVBQVY7QUFDQWtILDJCQUF1QixLQUFLekYsTUFBNUIsRUFBb0NELE9BQXBDLEVBQTZDb0gsT0FBN0M7QUFDQUEsWUFBUW5RLE9BQVIsQ0FBZ0IsVUFBQ3NLLElBQUQ7QUFDZixVQUFBMUssTUFBQSxFQUFBa0QsTUFBQSxFQUFBa08sYUFBQSxFQUFBQyx3QkFBQTtBQUFBRCxzQkFBZ0JqVCxRQUFRSSxTQUFSLENBQWtCbU0sS0FBS3JNLFdBQXZCLEVBQW9DcU0sS0FBS3FELEtBQXpDLENBQWhCOztBQUVBLFVBQUcsQ0FBQ3FELGFBQUo7QUFDQztBQ3VDRzs7QURyQ0pDLGlDQUEyQmxULFFBQVFzRixhQUFSLENBQXNCaUgsS0FBS3JNLFdBQTNCLEVBQXdDcU0sS0FBS3FELEtBQTdDLENBQTNCOztBQUVBLFVBQUdxRCxpQkFBaUJDLHdCQUFwQjtBQUNDclIsaUJBQVM7QUFBQ2YsZUFBSztBQUFOLFNBQVQ7QUFFQWUsZUFBT29SLGNBQWNYLGNBQXJCLElBQXVDLENBQXZDO0FBRUF2TixpQkFBU21PLHlCQUF5QjNOLE9BQXpCLENBQWlDZ0gsS0FBS2hNLFNBQUwsQ0FBZSxDQUFmLENBQWpDLEVBQW9EO0FBQUNzQixrQkFBUUE7QUFBVCxTQUFwRCxDQUFUOztBQUNBLFlBQUdrRCxNQUFIO0FDd0NNLGlCRHZDTDRNLEtBQUtyUCxJQUFMLENBQVU7QUFBQ3hCLGlCQUFLaUUsT0FBT2pFLEdBQWI7QUFBa0JpUyxtQkFBT2hPLE9BQU9rTyxjQUFjWCxjQUFyQixDQUF6QjtBQUErRFUsMEJBQWN6RyxLQUFLck07QUFBbEYsV0FBVixDQ3VDSztBRDlDUDtBQ29ESTtBRDVETDtBQWlCQSxXQUFPeVIsSUFBUDtBQXJCRDtBQXVCQSwwQkFBd0IsVUFBQ3JJLE9BQUQ7QUFDdkIsUUFBQXFJLElBQUEsRUFBQUksVUFBQSxFQUFBb0IsSUFBQSxFQUFBdkQsS0FBQTtBQUFBdUQsV0FBTyxJQUFQO0FBRUF4QixXQUFPLElBQUluSSxLQUFKLEVBQVA7QUFFQXVJLGlCQUFhekksUUFBUXlJLFVBQXJCO0FBQ0FuQyxZQUFRdEcsUUFBUXNHLEtBQWhCOztBQUVBNU4sTUFBRUMsT0FBRixDQUFVakMsUUFBUW9ULGFBQWxCLEVBQWlDLFVBQUN6UixPQUFELEVBQVUyQixJQUFWO0FBQ2hDLFVBQUErUCxhQUFBOztBQUFBLFVBQUcxUixRQUFRMlIsYUFBWDtBQUNDRCx3QkFBZ0J6QyxjQUFjaEIsS0FBZCxFQUFxQmpPLFFBQVEyQixJQUE3QixFQUFtQzZQLEtBQUtsSSxNQUF4QyxFQUFnRDhHLFVBQWhELENBQWhCO0FDNkNJLGVENUNKSixPQUFPQSxLQUFLNUosTUFBTCxDQUFZc0wsYUFBWixDQzRDSDtBQUNEO0FEaERMOztBQUtBLFdBQU8xQixJQUFQO0FBcENEO0FBQUEsQ0FERCxFOzs7Ozs7Ozs7Ozs7QUVuREEvUixPQUFPMlAsT0FBUCxDQUNJO0FBQUFnRSxrQkFBZ0IsVUFBQ0MsV0FBRCxFQUFjelAsT0FBZCxFQUF1QjBQLFlBQXZCLEVBQXFDaEosWUFBckM7QUNDaEIsV0RBSXpLLFFBQVErUSxXQUFSLENBQW9CMkMsZ0JBQXBCLENBQXFDQyxNQUFyQyxDQUE0QzlELE1BQTVDLENBQW1EO0FBQUMvTyxXQUFLMFM7QUFBTixLQUFuRCxFQUF1RTtBQUFDeEQsWUFBTTtBQUFDak0saUJBQVNBLE9BQVY7QUFBbUIwUCxzQkFBY0EsWUFBakM7QUFBK0NoSixzQkFBY0E7QUFBN0Q7QUFBUCxLQUF2RSxDQ0FKO0FEREE7QUFHQW1KLGtCQUFnQixVQUFDSixXQUFELEVBQWNLLE9BQWQ7QUFDWkMsVUFBTUQsT0FBTixFQUFlckssS0FBZjs7QUFFQSxRQUFHcUssUUFBUTVQLE1BQVIsR0FBaUIsQ0FBcEI7QUFDSSxZQUFNLElBQUlyRSxPQUFPZ1MsS0FBWCxDQUFpQixHQUFqQixFQUFzQixzQ0FBdEIsQ0FBTjtBQ1FQOztBQUNELFdEUkk1UixRQUFRK1EsV0FBUixDQUFvQjJDLGdCQUFwQixDQUFxQzdELE1BQXJDLENBQTRDO0FBQUMvTyxXQUFLMFM7QUFBTixLQUE1QyxFQUFnRTtBQUFDeEQsWUFBTTtBQUFDNkQsaUJBQVNBO0FBQVY7QUFBUCxLQUFoRSxDQ1FKO0FEaEJBO0FBQUEsQ0FESixFOzs7Ozs7Ozs7Ozs7QUVBQWpVLE9BQU8yUCxPQUFQLENBQ0M7QUFBQSxpQkFBZSxVQUFDakcsT0FBRDtBQUNkLFFBQUF5SyxjQUFBLEVBQUFDLE1BQUEsRUFBQW5TLE1BQUEsRUFBQW9TLFlBQUEsRUFBQVIsWUFBQSxFQUFBMVAsT0FBQSxFQUFBbVEsWUFBQSxFQUFBaFUsV0FBQSxFQUFBQyxHQUFBLEVBQUFnVSxNQUFBLEVBQUE1SyxRQUFBLEVBQUFxRyxLQUFBLEVBQUEzRSxNQUFBO0FBQUE2SSxVQUFNeEssT0FBTixFQUFlOEssTUFBZjtBQUNBeEUsWUFBUXRHLFFBQVFzRyxLQUFoQjtBQUNBL04sYUFBU3lILFFBQVF6SCxNQUFqQjtBQUNBM0Isa0JBQWNvSixRQUFRcEosV0FBdEI7QUFDQXVULG1CQUFlbkssUUFBUW1LLFlBQXZCO0FBQ0ExUCxjQUFVdUYsUUFBUXZGLE9BQWxCO0FBQ0FrUSxtQkFBZSxFQUFmO0FBQ0FGLHFCQUFpQixFQUFqQjtBQUNBRyxtQkFBQSxDQUFBL1QsTUFBQUgsUUFBQUksU0FBQSxDQUFBRixXQUFBLGFBQUFDLElBQStDMEIsTUFBL0MsR0FBK0MsTUFBL0M7O0FBQ0FHLE1BQUVlLElBQUYsQ0FBT2xCLE1BQVAsRUFBZSxVQUFDMEssSUFBRCxFQUFPaEUsS0FBUDtBQUNkLFVBQUE4TCxRQUFBLEVBQUEvUSxJQUFBLEVBQUFnUixXQUFBLEVBQUFDLE1BQUE7QUFBQUEsZUFBU2hJLEtBQUtnRyxLQUFMLENBQVcsR0FBWCxDQUFUO0FBQ0FqUCxhQUFPaVIsT0FBTyxDQUFQLENBQVA7QUFDQUQsb0JBQWNKLGFBQWE1USxJQUFiLENBQWQ7O0FBQ0EsVUFBR2lSLE9BQU90USxNQUFQLEdBQWdCLENBQWhCLElBQXNCcVEsV0FBekI7QUFDQ0QsbUJBQVc5SCxLQUFLM0QsT0FBTCxDQUFhdEYsT0FBTyxHQUFwQixFQUF5QixFQUF6QixDQUFYO0FBQ0F5USx1QkFBZXpSLElBQWYsQ0FBb0I7QUFBQ2dCLGdCQUFNQSxJQUFQO0FBQWErUSxvQkFBVUEsUUFBdkI7QUFBaUNsUSxpQkFBT21RO0FBQXhDLFNBQXBCO0FDT0c7O0FBQ0QsYURQSEwsYUFBYTNRLElBQWIsSUFBcUIsQ0NPbEI7QURkSjs7QUFTQWlHLGVBQVcsRUFBWDtBQUNBMEIsYUFBUyxLQUFLQSxNQUFkO0FBQ0ExQixhQUFTcUcsS0FBVCxHQUFpQkEsS0FBakI7O0FBQ0EsUUFBRzZELGlCQUFnQixRQUFuQjtBQUNDbEssZUFBU3FHLEtBQVQsR0FDQztBQUFBaUQsYUFBSyxDQUFDLElBQUQsRUFBTWpELEtBQU47QUFBTCxPQUREO0FBREQsV0FHSyxJQUFHNkQsaUJBQWdCLE1BQW5CO0FBQ0psSyxlQUFTa0QsS0FBVCxHQUFpQnhCLE1BQWpCO0FDU0U7O0FEUEgsUUFBR2pMLFFBQVF3VSxhQUFSLENBQXNCNUUsS0FBdEIsS0FBZ0M1UCxRQUFReVUsWUFBUixDQUFxQjdFLEtBQXJCLEVBQTRCLEtBQUMzRSxNQUE3QixDQUFuQztBQUNDLGFBQU8xQixTQUFTcUcsS0FBaEI7QUNTRTs7QURQSCxRQUFHN0wsV0FBWUEsUUFBUUUsTUFBUixHQUFpQixDQUFoQztBQUNDc0YsZUFBUyxNQUFULElBQW1CeEYsT0FBbkI7QUNTRTs7QURQSGlRLGFBQVNoVSxRQUFRc0YsYUFBUixDQUFzQnBGLFdBQXRCLEVBQW1Dd0UsSUFBbkMsQ0FBd0M2RSxRQUF4QyxFQUFrRDtBQUFDMUgsY0FBUW9TLFlBQVQ7QUFBdUJTLFlBQU0sQ0FBN0I7QUFBZ0M1QixhQUFPO0FBQXZDLEtBQWxELENBQVQ7QUFHQXFCLGFBQVNILE9BQU9XLEtBQVAsRUFBVDs7QUFDQSxRQUFHWixlQUFlOVAsTUFBbEI7QUFDQ2tRLGVBQVNBLE9BQU8xTCxHQUFQLENBQVcsVUFBQzhELElBQUQsRUFBTWhFLEtBQU47QUFDbkJ2RyxVQUFFZSxJQUFGLENBQU9nUixjQUFQLEVBQXVCLFVBQUNhLGlCQUFELEVBQW9Cck0sS0FBcEI7QUFDdEIsY0FBQXNNLG9CQUFBLEVBQUFDLE9BQUEsRUFBQUMsU0FBQSxFQUFBL1AsSUFBQSxFQUFBZ1EsYUFBQSxFQUFBdFMsWUFBQSxFQUFBTCxJQUFBO0FBQUF5UyxvQkFBVUYsa0JBQWtCdFIsSUFBbEIsR0FBeUIsS0FBekIsR0FBaUNzUixrQkFBa0JQLFFBQWxCLENBQTJCekwsT0FBM0IsQ0FBbUMsS0FBbkMsRUFBMEMsS0FBMUMsQ0FBM0M7QUFDQW1NLHNCQUFZeEksS0FBS3FJLGtCQUFrQnRSLElBQXZCLENBQVo7QUFDQWpCLGlCQUFPdVMsa0JBQWtCelEsS0FBbEIsQ0FBd0I5QixJQUEvQjs7QUFDQSxjQUFHLENBQUMsUUFBRCxFQUFXLGVBQVgsRUFBNEJ1QixPQUE1QixDQUFvQ3ZCLElBQXBDLElBQTRDLENBQUMsQ0FBaEQ7QUFDQ0ssMkJBQWVrUyxrQkFBa0J6USxLQUFsQixDQUF3QnpCLFlBQXZDO0FBQ0FtUyxtQ0FBdUIsRUFBdkI7QUFDQUEsaUNBQXFCRCxrQkFBa0JQLFFBQXZDLElBQW1ELENBQW5EO0FBQ0FXLDRCQUFnQmhWLFFBQVFzRixhQUFSLENBQXNCNUMsWUFBdEIsRUFBb0M2QyxPQUFwQyxDQUE0QztBQUFDekUsbUJBQUtpVTtBQUFOLGFBQTVDLEVBQThEO0FBQUFsVCxzQkFBUWdUO0FBQVIsYUFBOUQsQ0FBaEI7O0FBQ0EsZ0JBQUdHLGFBQUg7QUFDQ3pJLG1CQUFLdUksT0FBTCxJQUFnQkUsY0FBY0osa0JBQWtCUCxRQUFoQyxDQUFoQjtBQU5GO0FBQUEsaUJBT0ssSUFBR2hTLFNBQVEsUUFBWDtBQUNKaUgsc0JBQVVzTCxrQkFBa0J6USxLQUFsQixDQUF3Qm1GLE9BQWxDO0FBQ0FpRCxpQkFBS3VJLE9BQUwsTUFBQTlQLE9BQUFoRCxFQUFBcUMsU0FBQSxDQUFBaUYsT0FBQTtBQ2lCUTlHLHFCQUFPdVM7QURqQmYsbUJDa0JhLElEbEJiLEdDa0JvQi9QLEtEbEJzQ3pDLEtBQTFELEdBQTBELE1BQTFELEtBQW1Fd1MsU0FBbkU7QUFGSTtBQUlKeEksaUJBQUt1SSxPQUFMLElBQWdCQyxTQUFoQjtBQ21CSzs7QURsQk4sZUFBT3hJLEtBQUt1SSxPQUFMLENBQVA7QUNvQk8sbUJEbkJOdkksS0FBS3VJLE9BQUwsSUFBZ0IsSUNtQlY7QUFDRDtBRHJDUDs7QUFrQkEsZUFBT3ZJLElBQVA7QUFuQlEsUUFBVDtBQW9CQSxhQUFPNEgsTUFBUDtBQXJCRDtBQXVCQyxhQUFPQSxNQUFQO0FDdUJFO0FEcEZKO0FBQUEsQ0FERCxFOzs7Ozs7Ozs7Ozs7QUVBQTs7Ozs7Ozs7R0FVQXZVLE9BQU8yUCxPQUFQLENBQ0k7QUFBQSwyQkFBeUIsVUFBQ3JQLFdBQUQsRUFBY1EsWUFBZCxFQUE0QjhHLElBQTVCO0FBQ3JCLFFBQUFtSSxHQUFBLEVBQUEvSSxHQUFBLEVBQUFxTyxPQUFBLEVBQUFoSyxNQUFBO0FBQUFBLGFBQVMsS0FBS0EsTUFBZDtBQUNBZ0ssY0FBVWpWLFFBQVErUSxXQUFSLENBQW9CbFIsUUFBcEIsQ0FBNkIwRixPQUE3QixDQUFxQztBQUFDckYsbUJBQWFBLFdBQWQ7QUFBMkJLLGlCQUFXLGtCQUF0QztBQUEwRGtNLGFBQU94QjtBQUFqRSxLQUFyQyxDQUFWOztBQUNBLFFBQUdnSyxPQUFIO0FDTUYsYURMTWpWLFFBQVErUSxXQUFSLENBQW9CbFIsUUFBcEIsQ0FBNkJnUSxNQUE3QixDQUFvQztBQUFDL08sYUFBS21VLFFBQVFuVTtBQUFkLE9BQXBDLEVBQXdEO0FBQUNrUCxlQ1MzRHBKLE1EVGlFLEVDU2pFLEVBQ0FBLElEVmtFLGNBQVlsRyxZQUFaLEdBQXlCLE9DVTNGLElEVm1HOEcsSUNTbkcsRUFFQVosR0RYMkQ7QUFBRCxPQUF4RCxDQ0tOO0FETkU7QUFHSStJLFlBQ0k7QUFBQXROLGNBQU0sTUFBTjtBQUNBbkMscUJBQWFBLFdBRGI7QUFFQUssbUJBQVcsa0JBRlg7QUFHQVYsa0JBQVUsRUFIVjtBQUlBNE0sZUFBT3hCO0FBSlAsT0FESjtBQU9BMEUsVUFBSTlQLFFBQUosQ0FBYWEsWUFBYixJQUE2QixFQUE3QjtBQUNBaVAsVUFBSTlQLFFBQUosQ0FBYWEsWUFBYixFQUEyQjhHLElBQTNCLEdBQWtDQSxJQUFsQztBQ2NOLGFEWk14SCxRQUFRK1EsV0FBUixDQUFvQmxSLFFBQXBCLENBQTZCdVEsTUFBN0IsQ0FBb0NULEdBQXBDLENDWU47QUFDRDtBRDdCRDtBQWtCQSxtQ0FBaUMsVUFBQ3pQLFdBQUQsRUFBY1EsWUFBZCxFQUE0QndVLFlBQTVCO0FBQzdCLFFBQUF2RixHQUFBLEVBQUEvSSxHQUFBLEVBQUFxTyxPQUFBLEVBQUFoSyxNQUFBO0FBQUFBLGFBQVMsS0FBS0EsTUFBZDtBQUNBZ0ssY0FBVWpWLFFBQVErUSxXQUFSLENBQW9CbFIsUUFBcEIsQ0FBNkIwRixPQUE3QixDQUFxQztBQUFDckYsbUJBQWFBLFdBQWQ7QUFBMkJLLGlCQUFXLGtCQUF0QztBQUEwRGtNLGFBQU94QjtBQUFqRSxLQUFyQyxDQUFWOztBQUNBLFFBQUdnSyxPQUFIO0FDbUJGLGFEbEJNalYsUUFBUStRLFdBQVIsQ0FBb0JsUixRQUFwQixDQUE2QmdRLE1BQTdCLENBQW9DO0FBQUMvTyxhQUFLbVUsUUFBUW5VO0FBQWQsT0FBcEMsRUFBd0Q7QUFBQ2tQLGVDc0IzRHBKLE1EdEJpRSxFQ3NCakUsRUFDQUEsSUR2QmtFLGNBQVlsRyxZQUFaLEdBQXlCLGVDdUIzRixJRHZCMkd3VSxZQ3NCM0csRUFFQXRPLEdEeEIyRDtBQUFELE9BQXhELENDa0JOO0FEbkJFO0FBR0krSSxZQUNJO0FBQUF0TixjQUFNLE1BQU47QUFDQW5DLHFCQUFhQSxXQURiO0FBRUFLLG1CQUFXLGtCQUZYO0FBR0FWLGtCQUFVLEVBSFY7QUFJQTRNLGVBQU94QjtBQUpQLE9BREo7QUFPQTBFLFVBQUk5UCxRQUFKLENBQWFhLFlBQWIsSUFBNkIsRUFBN0I7QUFDQWlQLFVBQUk5UCxRQUFKLENBQWFhLFlBQWIsRUFBMkJ3VSxZQUEzQixHQUEwQ0EsWUFBMUM7QUMyQk4sYUR6Qk1sVixRQUFRK1EsV0FBUixDQUFvQmxSLFFBQXBCLENBQTZCdVEsTUFBN0IsQ0FBb0NULEdBQXBDLENDeUJOO0FBQ0Q7QUQ1REQ7QUFvQ0EsbUJBQWlCLFVBQUN6UCxXQUFELEVBQWNRLFlBQWQsRUFBNEJ3VSxZQUE1QixFQUEwQzFOLElBQTFDO0FBQ2IsUUFBQW1JLEdBQUEsRUFBQS9JLEdBQUEsRUFBQXVPLElBQUEsRUFBQWhWLEdBQUEsRUFBQTZFLElBQUEsRUFBQWlRLE9BQUEsRUFBQWhLLE1BQUE7QUFBQUEsYUFBUyxLQUFLQSxNQUFkO0FBQ0FnSyxjQUFValYsUUFBUStRLFdBQVIsQ0FBb0JsUixRQUFwQixDQUE2QjBGLE9BQTdCLENBQXFDO0FBQUNyRixtQkFBYUEsV0FBZDtBQUEyQkssaUJBQVcsa0JBQXRDO0FBQTBEa00sYUFBT3hCO0FBQWpFLEtBQXJDLENBQVY7O0FBQ0EsUUFBR2dLLE9BQUg7QUFFSUMsbUJBQWFFLFdBQWIsS0FBQWpWLE1BQUE4VSxRQUFBcFYsUUFBQSxNQUFBYSxZQUFBLGNBQUFzRSxPQUFBN0UsSUFBQStVLFlBQUEsWUFBQWxRLEtBQWlGb1EsV0FBakYsR0FBaUYsTUFBakYsR0FBaUYsTUFBakYsTUFBZ0csRUFBaEcsR0FBd0csRUFBeEcsR0FBZ0gsRUFBaEg7O0FBQ0EsVUFBRzVOLElBQUg7QUMrQkosZUQ5QlF4SCxRQUFRK1EsV0FBUixDQUFvQmxSLFFBQXBCLENBQTZCZ1EsTUFBN0IsQ0FBb0M7QUFBQy9PLGVBQUttVSxRQUFRblU7QUFBZCxTQUFwQyxFQUF3RDtBQUFDa1AsaUJDa0M3RHBKLE1EbENtRSxFQ2tDbkUsRUFDQUEsSURuQ29FLGNBQVlsRyxZQUFaLEdBQXlCLE9DbUM3RixJRG5DcUc4RyxJQ2tDckcsRUFFQVosSURwQzJHLGNBQVlsRyxZQUFaLEdBQXlCLGVDb0NwSSxJRHBDb0p3VSxZQ2tDcEosRUFHQXRPLEdEckM2RDtBQUFELFNBQXhELENDOEJSO0FEL0JJO0FDMENKLGVEdkNRNUcsUUFBUStRLFdBQVIsQ0FBb0JsUixRQUFwQixDQUE2QmdRLE1BQTdCLENBQW9DO0FBQUMvTyxlQUFLbVUsUUFBUW5VO0FBQWQsU0FBcEMsRUFBd0Q7QUFBQ2tQLGlCQzJDN0RtRixPRDNDbUUsRUMyQ25FLEVBQ0FBLEtENUNvRSxjQUFZelUsWUFBWixHQUF5QixlQzRDN0YsSUQ1QzZHd1UsWUMyQzdHLEVBRUFDLElEN0M2RDtBQUFELFNBQXhELENDdUNSO0FEN0NBO0FBQUE7QUFRSXhGLFlBQ0k7QUFBQXROLGNBQU0sTUFBTjtBQUNBbkMscUJBQWFBLFdBRGI7QUFFQUssbUJBQVcsa0JBRlg7QUFHQVYsa0JBQVUsRUFIVjtBQUlBNE0sZUFBT3hCO0FBSlAsT0FESjtBQU9BMEUsVUFBSTlQLFFBQUosQ0FBYWEsWUFBYixJQUE2QixFQUE3QjtBQUNBaVAsVUFBSTlQLFFBQUosQ0FBYWEsWUFBYixFQUEyQndVLFlBQTNCLEdBQTBDQSxZQUExQztBQUNBdkYsVUFBSTlQLFFBQUosQ0FBYWEsWUFBYixFQUEyQjhHLElBQTNCLEdBQWtDQSxJQUFsQztBQ2lETixhRC9DTXhILFFBQVErUSxXQUFSLENBQW9CbFIsUUFBcEIsQ0FBNkJ1USxNQUE3QixDQUFvQ1QsR0FBcEMsQ0MrQ047QUFDRDtBRDFHRDtBQUFBLENBREosRTs7Ozs7Ozs7Ozs7O0FFVkEsSUFBQTBGLGNBQUEsRUFBQUMsZUFBQSxFQUFBQyxhQUFBLEVBQUFDLEVBQUEsRUFBQUMsTUFBQSxFQUFBOVYsTUFBQSxFQUFBK1YsSUFBQSxFQUFBQyxNQUFBOztBQUFBQSxTQUFTdkwsUUFBUSxRQUFSLENBQVQ7QUFDQW9MLEtBQUtwTCxRQUFRLElBQVIsQ0FBTDtBQUNBc0wsT0FBT3RMLFFBQVEsTUFBUixDQUFQO0FBQ0F6SyxTQUFTeUssUUFBUSxRQUFSLENBQVQ7QUFFQXFMLFNBQVMsSUFBSUcsTUFBSixDQUFXLGVBQVgsQ0FBVDs7QUFFQUwsZ0JBQWdCLFVBQUNNLE9BQUQsRUFBU0MsT0FBVDtBQUVmLE1BQUFDLE9BQUEsRUFBQUMsR0FBQSxFQUFBQyxXQUFBLEVBQUFDLFFBQUEsRUFBQUMsUUFBQSxFQUFBQyxLQUFBLEVBQUFDLEdBQUEsRUFBQUMsTUFBQSxFQUFBQyxHQUFBLEVBQUFDLElBQUE7QUFBQVQsWUFBVSxJQUFJSixPQUFPYyxPQUFYLEVBQVY7QUFDQUYsUUFBTVIsUUFBUVcsV0FBUixDQUFvQmIsT0FBcEIsQ0FBTjtBQUdBUyxXQUFTLElBQUlLLE1BQUosQ0FBV0osR0FBWCxDQUFUO0FBR0FGLFFBQU0sSUFBSW5HLElBQUosRUFBTjtBQUNBc0csU0FBT0gsSUFBSU8sV0FBSixFQUFQO0FBQ0FSLFVBQVFDLElBQUlRLFFBQUosS0FBaUIsQ0FBekI7QUFDQWIsUUFBTUssSUFBSVMsT0FBSixFQUFOO0FBR0FYLGFBQVdULEtBQUtxQixJQUFMLENBQVVDLHFCQUFxQkMsU0FBL0IsRUFBeUMscUJBQXFCVCxJQUFyQixHQUE0QixHQUE1QixHQUFrQ0osS0FBbEMsR0FBMEMsR0FBMUMsR0FBZ0RKLEdBQWhELEdBQXNELEdBQXRELEdBQTRERixPQUFyRyxDQUFYO0FBQ0FJLGFBQUEsQ0FBQUwsV0FBQSxPQUFXQSxRQUFTL1UsR0FBcEIsR0FBb0IsTUFBcEIsSUFBMEIsTUFBMUI7QUFDQW1WLGdCQUFjUCxLQUFLcUIsSUFBTCxDQUFVWixRQUFWLEVBQW9CRCxRQUFwQixDQUFkOztBQUVBLE1BQUcsQ0FBQ1YsR0FBRzBCLFVBQUgsQ0FBY2YsUUFBZCxDQUFKO0FBQ0N4VyxXQUFPd1gsSUFBUCxDQUFZaEIsUUFBWjtBQ0RDOztBRElGWCxLQUFHNEIsU0FBSCxDQUFhbkIsV0FBYixFQUEwQkssTUFBMUIsRUFBa0MsVUFBQzVFLEdBQUQ7QUFDakMsUUFBR0EsR0FBSDtBQ0ZJLGFER0grRCxPQUFPeE0sS0FBUCxDQUFnQjRNLFFBQVEvVSxHQUFSLEdBQVksV0FBNUIsRUFBdUM0USxHQUF2QyxDQ0hHO0FBQ0Q7QURBSjtBQUlBLFNBQU95RSxRQUFQO0FBM0JlLENBQWhCOztBQStCQWQsaUJBQWlCLFVBQUN6TyxHQUFELEVBQUtrUCxPQUFMO0FBRWhCLE1BQUFELE9BQUEsRUFBQXdCLE9BQUEsRUFBQUMsT0FBQSxFQUFBQyxVQUFBLEVBQUFDLFNBQUEsRUFBQXJYLEdBQUE7QUFBQTBWLFlBQVUsRUFBVjtBQUVBMkIsY0FBQSxPQUFBeFgsT0FBQSxvQkFBQUEsWUFBQSxRQUFBRyxNQUFBSCxRQUFBSSxTQUFBLENBQUEwVixPQUFBLGFBQUEzVixJQUF5QzBCLE1BQXpDLEdBQXlDLE1BQXpDLEdBQXlDLE1BQXpDOztBQUVBMFYsZUFBYSxVQUFDRSxVQUFEO0FDSlYsV0RLRjVCLFFBQVE0QixVQUFSLElBQXNCN1EsSUFBSTZRLFVBQUosS0FBbUIsRUNMdkM7QURJVSxHQUFiOztBQUdBSCxZQUFVLFVBQUNHLFVBQUQsRUFBWXBWLElBQVo7QUFDVCxRQUFBcVYsSUFBQSxFQUFBQyxPQUFBLEVBQUFDLE1BQUE7QUFBQUYsV0FBTzlRLElBQUk2USxVQUFKLENBQVA7O0FBQ0EsUUFBR3BWLFNBQVEsTUFBWDtBQUNDdVYsZUFBUyxZQUFUO0FBREQ7QUFHQ0EsZUFBUyxxQkFBVDtBQ0hFOztBRElILFFBQUdGLFFBQUEsUUFBVUUsVUFBQSxJQUFiO0FBQ0NELGdCQUFVRSxPQUFPSCxJQUFQLEVBQWFFLE1BQWIsQ0FBb0JBLE1BQXBCLENBQVY7QUNGRTs7QUFDRCxXREVGL0IsUUFBUTRCLFVBQVIsSUFBc0JFLFdBQVcsRUNGL0I7QUROTyxHQUFWOztBQVVBTixZQUFVLFVBQUNJLFVBQUQ7QUFDVCxRQUFHN1EsSUFBSTZRLFVBQUosTUFBbUIsSUFBdEI7QUNESSxhREVINUIsUUFBUTRCLFVBQVIsSUFBc0IsR0NGbkI7QURDSixXQUVLLElBQUc3USxJQUFJNlEsVUFBSixNQUFtQixLQUF0QjtBQ0RELGFERUg1QixRQUFRNEIsVUFBUixJQUFzQixHQ0ZuQjtBRENDO0FDQ0QsYURFSDVCLFFBQVE0QixVQUFSLElBQXNCLEVDRm5CO0FBQ0Q7QURMTSxHQUFWOztBQVNBelYsSUFBRWUsSUFBRixDQUFPeVUsU0FBUCxFQUFrQixVQUFDclQsS0FBRCxFQUFRc1QsVUFBUjtBQUNqQixZQUFBdFQsU0FBQSxPQUFPQSxNQUFPOUIsSUFBZCxHQUFjLE1BQWQ7QUFBQSxXQUNNLE1BRE47QUFBQSxXQUNhLFVBRGI7QUNDTSxlREF1QmlWLFFBQVFHLFVBQVIsRUFBbUJ0VCxNQUFNOUIsSUFBekIsQ0NBdkI7O0FERE4sV0FFTSxTQUZOO0FDR00sZUREZWdWLFFBQVFJLFVBQVIsQ0NDZjs7QURITjtBQ0tNLGVERkFGLFdBQVdFLFVBQVgsQ0NFQTtBRExOO0FBREQ7O0FBTUEsU0FBTzVCLE9BQVA7QUFsQ2dCLENBQWpCOztBQXFDQVAsa0JBQWtCLFVBQUMxTyxHQUFELEVBQUtrUCxPQUFMO0FBRWpCLE1BQUFnQyxlQUFBLEVBQUEzTSxlQUFBO0FBQUFBLG9CQUFrQixFQUFsQjtBQUdBMk0sb0JBQUEsT0FBQTlYLE9BQUEsb0JBQUFBLFlBQUEsT0FBa0JBLFFBQVNrUCxvQkFBVCxDQUE4QjRHLE9BQTlCLENBQWxCLEdBQWtCLE1BQWxCO0FBR0FnQyxrQkFBZ0I3VixPQUFoQixDQUF3QixVQUFDOFYsY0FBRDtBQUV2QixRQUFBbFcsTUFBQSxFQUFBc1QsSUFBQSxFQUFBaFYsR0FBQSxFQUFBNlgsaUJBQUEsRUFBQUMsaUJBQUEsRUFBQUMsZ0JBQUEsRUFBQTlJLGtCQUFBO0FBQUE4SSx1QkFBbUIsRUFBbkI7O0FBSUEsUUFBR0gsbUJBQWtCLFdBQXJCO0FBQ0MzSSwyQkFBcUIsWUFBckI7QUFERDtBQUlDdk4sZUFBQSxPQUFBN0IsT0FBQSxvQkFBQUEsWUFBQSxRQUFBRyxNQUFBSCxRQUFBdUgsT0FBQSxDQUFBd1EsY0FBQSxhQUFBNVgsSUFBMkMwQixNQUEzQyxHQUEyQyxNQUEzQyxHQUEyQyxNQUEzQztBQUVBdU4sMkJBQXFCLEVBQXJCOztBQUNBcE4sUUFBRWUsSUFBRixDQUFPbEIsTUFBUCxFQUFlLFVBQUNzQyxLQUFELEVBQVFzVCxVQUFSO0FBQ2QsYUFBQXRULFNBQUEsT0FBR0EsTUFBT3pCLFlBQVYsR0FBVSxNQUFWLE1BQTBCb1QsT0FBMUI7QUNMTSxpQkRNTDFHLHFCQUFxQnFJLFVDTmhCO0FBQ0Q7QURHTjtBQ0RFOztBRE1ILFFBQUdySSxrQkFBSDtBQUNDNEksMEJBQW9CaFksUUFBUXNGLGFBQVIsQ0FBc0J5UyxjQUF0QixDQUFwQjtBQUVBRSwwQkFBb0JELGtCQUFrQnRULElBQWxCLEVDTGZ5USxPREtzQyxFQ0x0QyxFQUNBQSxLREl1QyxLQUFHL0Ysa0JDSjFDLElESStEeEksSUFBSTlGLEdDTG5FLEVBRUFxVSxJREdlLEdBQTBEUixLQUExRCxFQUFwQjtBQUVBc0Qsd0JBQWtCaFcsT0FBbEIsQ0FBMEIsVUFBQ2tXLFVBQUQ7QUFFekIsWUFBQUMsVUFBQTtBQUFBQSxxQkFBYS9DLGVBQWU4QyxVQUFmLEVBQTBCSixjQUExQixDQUFiO0FDRkksZURJSkcsaUJBQWlCNVYsSUFBakIsQ0FBc0I4VixVQUF0QixDQ0pJO0FEQUw7QUNFRTs7QUFDRCxXRElGak4sZ0JBQWdCNE0sY0FBaEIsSUFBa0NHLGdCQ0poQztBRDFCSDtBQWdDQSxTQUFPL00sZUFBUDtBQXhDaUIsQ0FBbEI7O0FBMkNBbkwsUUFBUXFZLFVBQVIsR0FBcUIsVUFBQ3ZDLE9BQUQsRUFBVXdDLFVBQVY7QUFDcEIsTUFBQXhULFVBQUE7QUFBQTJRLFNBQU84QyxJQUFQLENBQVksd0JBQVo7QUFFQXJQLFVBQVFzUCxJQUFSLENBQWEsb0JBQWI7QUFNQTFULGVBQWE5RSxRQUFRc0YsYUFBUixDQUFzQndRLE9BQXRCLENBQWI7QUFFQXdDLGVBQWF4VCxXQUFXSixJQUFYLENBQWdCLEVBQWhCLEVBQW9CaVEsS0FBcEIsRUFBYjtBQUVBMkQsYUFBV3JXLE9BQVgsQ0FBbUIsVUFBQ3dXLFNBQUQ7QUFDbEIsUUFBQUwsVUFBQSxFQUFBakMsUUFBQSxFQUFBTixPQUFBLEVBQUExSyxlQUFBO0FBQUEwSyxjQUFVLEVBQVY7QUFDQUEsWUFBUS9VLEdBQVIsR0FBYzJYLFVBQVUzWCxHQUF4QjtBQUdBc1gsaUJBQWEvQyxlQUFlb0QsU0FBZixFQUF5QjNDLE9BQXpCLENBQWI7QUFDQUQsWUFBUUMsT0FBUixJQUFtQnNDLFVBQW5CO0FBR0FqTixzQkFBa0JtSyxnQkFBZ0JtRCxTQUFoQixFQUEwQjNDLE9BQTFCLENBQWxCO0FBRUFELFlBQVEsaUJBQVIsSUFBNkIxSyxlQUE3QjtBQ2RFLFdEaUJGZ0wsV0FBV1osY0FBY00sT0FBZCxFQUFzQkMsT0FBdEIsQ0NqQlQ7QURHSDtBQWdCQTVNLFVBQVF3UCxPQUFSLENBQWdCLG9CQUFoQjtBQUNBLFNBQU92QyxRQUFQO0FBOUJvQixDQUFyQixDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUV0SEF2VyxPQUFPMlAsT0FBUCxDQUNDO0FBQUFvSiwyQkFBeUIsVUFBQ3pZLFdBQUQsRUFBY29CLG1CQUFkLEVBQW1DOE4sa0JBQW5DLEVBQXVEN08sU0FBdkQsRUFBa0V5SyxPQUFsRTtBQUN4QixRQUFBbkUsV0FBQSxFQUFBK1IsZUFBQSxFQUFBclAsUUFBQSxFQUFBMEIsTUFBQTtBQUFBQSxhQUFTLEtBQUtBLE1BQWQ7O0FBQ0EsUUFBRzNKLHdCQUF1QixzQkFBMUI7QUFDQ2lJLGlCQUFXO0FBQUMsMEJBQWtCeUI7QUFBbkIsT0FBWDtBQUREO0FBR0N6QixpQkFBVztBQUFDcUcsZUFBTzVFO0FBQVIsT0FBWDtBQ01FOztBREpILFFBQUcxSix3QkFBdUIsV0FBMUI7QUFFQ2lJLGVBQVMsVUFBVCxJQUF1QnJKLFdBQXZCO0FBQ0FxSixlQUFTLFlBQVQsSUFBeUIsQ0FBQ2hKLFNBQUQsQ0FBekI7QUFIRDtBQUtDZ0osZUFBUzZGLGtCQUFULElBQStCN08sU0FBL0I7QUNLRTs7QURISHNHLGtCQUFjN0csUUFBUXVMLGNBQVIsQ0FBdUJqSyxtQkFBdkIsRUFBNEMwSixPQUE1QyxFQUFxREMsTUFBckQsQ0FBZDs7QUFDQSxRQUFHLENBQUNwRSxZQUFZZ1MsY0FBYixJQUFnQ2hTLFlBQVlDLFNBQS9DO0FBQ0N5QyxlQUFTa0QsS0FBVCxHQUFpQnhCLE1BQWpCO0FDS0U7O0FESEgyTixzQkFBa0I1WSxRQUFRc0YsYUFBUixDQUFzQmhFLG1CQUF0QixFQUEyQ29ELElBQTNDLENBQWdENkUsUUFBaEQsQ0FBbEI7QUFDQSxXQUFPcVAsZ0JBQWdCN0ksS0FBaEIsRUFBUDtBQW5CRDtBQUFBLENBREQsRTs7Ozs7Ozs7Ozs7O0FFQUFuUSxPQUFPMlAsT0FBUCxDQUNDO0FBQUF1Six1QkFBcUIsVUFBQ0MsU0FBRCxFQUFZL04sT0FBWjtBQUNwQixRQUFBZ08sV0FBQSxFQUFBQyxTQUFBO0FBQUFELGtCQUFjRSxHQUFHQyxLQUFILENBQVM1VCxPQUFULENBQWlCO0FBQUN6RSxXQUFLaVk7QUFBTixLQUFqQixFQUFtQ3pWLElBQWpEO0FBQ0EyVixnQkFBWUMsR0FBR0UsTUFBSCxDQUFVN1QsT0FBVixDQUFrQjtBQUFDekUsV0FBS2tLO0FBQU4sS0FBbEIsRUFBa0MxSCxJQUE5QztBQUVBLFdBQU87QUFBQytWLGVBQVNMLFdBQVY7QUFBdUJwSixhQUFPcUo7QUFBOUIsS0FBUDtBQUpEO0FBTUFLLG1CQUFpQixVQUFDeFksR0FBRDtBQ1FkLFdEUEZvWSxHQUFHSyxXQUFILENBQWU1RixNQUFmLENBQXNCOUQsTUFBdEIsQ0FBNkI7QUFBQy9PLFdBQUtBO0FBQU4sS0FBN0IsRUFBd0M7QUFBQ2tQLFlBQU07QUFBQ3dKLHNCQUFjO0FBQWY7QUFBUCxLQUF4QyxDQ09FO0FEZEg7QUFTQUMsbUJBQWlCLFVBQUMzWSxHQUFEO0FDY2QsV0RiRm9ZLEdBQUdLLFdBQUgsQ0FBZTVGLE1BQWYsQ0FBc0I5RCxNQUF0QixDQUE2QjtBQUFDL08sV0FBS0E7QUFBTixLQUE3QixFQUF3QztBQUFDa1AsWUFBTTtBQUFDd0osc0JBQWMsVUFBZjtBQUEyQkUsdUJBQWU7QUFBMUM7QUFBUCxLQUF4QyxDQ2FFO0FEdkJIO0FBQUEsQ0FERCxFOzs7Ozs7Ozs7Ozs7QUVBQTlaLE9BQU8rWixPQUFQLENBQWUsdUJBQWYsRUFBd0MsVUFBQ3paLFdBQUQsRUFBYzBaLEVBQWQsRUFBa0JwSyxRQUFsQjtBQUN2QyxNQUFBMUssVUFBQTtBQUFBQSxlQUFhOUUsUUFBUXNGLGFBQVIsQ0FBc0JwRixXQUF0QixFQUFtQ3NQLFFBQW5DLENBQWI7O0FBQ0EsTUFBRzFLLFVBQUg7QUFDQyxXQUFPQSxXQUFXSixJQUFYLENBQWdCO0FBQUM1RCxXQUFLOFk7QUFBTixLQUFoQixDQUFQO0FDSUM7QURQSCxHOzs7Ozs7Ozs7Ozs7QUVBQWhhLE9BQU9pYSxnQkFBUCxDQUF3Qix3QkFBeEIsRUFBa0QsVUFBQ0MsU0FBRCxFQUFZdkosR0FBWixFQUFpQjFPLE1BQWpCLEVBQXlCbUosT0FBekI7QUFDakQsTUFBQStPLE9BQUEsRUFBQTFMLEtBQUEsRUFBQTFNLE9BQUEsRUFBQXFSLFlBQUEsRUFBQXJCLElBQUEsRUFBQTVELElBQUEsRUFBQWlNLGlCQUFBLEVBQUFDLGdCQUFBLEVBQUE5RyxJQUFBOztBQUFBLE9BQU8sS0FBS2xJLE1BQVo7QUFDQyxXQUFPLEtBQUtpUCxLQUFMLEVBQVA7QUNFQzs7QURBRnBHLFFBQU1nRyxTQUFOLEVBQWlCSyxNQUFqQjtBQUNBckcsUUFBTXZELEdBQU4sRUFBVy9HLEtBQVg7QUFDQXNLLFFBQU1qUyxNQUFOLEVBQWN1WSxNQUFNQyxRQUFOLENBQWVqRyxNQUFmLENBQWQ7QUFFQXBCLGlCQUFlOEcsVUFBVWxSLE9BQVYsQ0FBa0IsVUFBbEIsRUFBNkIsRUFBN0IsQ0FBZjtBQUNBakgsWUFBVTNCLFFBQVFJLFNBQVIsQ0FBa0I0UyxZQUFsQixFQUFnQ2hJLE9BQWhDLENBQVY7O0FBRUEsTUFBR0EsT0FBSDtBQUNDZ0ksbUJBQWVoVCxRQUFRc2EsYUFBUixDQUFzQjNZLE9BQXRCLENBQWY7QUNBQzs7QURFRnFZLHNCQUFvQmhhLFFBQVFzRixhQUFSLENBQXNCME4sWUFBdEIsQ0FBcEI7QUFHQStHLFlBQUFwWSxXQUFBLE9BQVVBLFFBQVNFLE1BQW5CLEdBQW1CLE1BQW5COztBQUNBLE1BQUcsQ0FBQ2tZLE9BQUQsSUFBWSxDQUFDQyxpQkFBaEI7QUFDQyxXQUFPLEtBQUtFLEtBQUwsRUFBUDtBQ0ZDOztBRElGRCxxQkFBbUJqWSxFQUFFc0YsTUFBRixDQUFTeVMsT0FBVCxFQUFrQixVQUFDN1gsQ0FBRDtBQUNwQyxXQUFPRixFQUFFNlAsVUFBRixDQUFhM1AsRUFBRVEsWUFBZixLQUFnQyxDQUFDVixFQUFFMEcsT0FBRixDQUFVeEcsRUFBRVEsWUFBWixDQUF4QztBQURrQixJQUFuQjtBQUdBeVEsU0FBTyxJQUFQO0FBRUFBLE9BQUtvSCxPQUFMOztBQUVBLE1BQUdOLGlCQUFpQmhXLE1BQWpCLEdBQTBCLENBQTdCO0FBQ0MwTixXQUFPO0FBQ05qTixZQUFNO0FBQ0wsWUFBQThWLFVBQUE7QUFBQXJILGFBQUtvSCxPQUFMO0FBQ0FDLHFCQUFhLEVBQWI7O0FBQ0F4WSxVQUFFZSxJQUFGLENBQU9mLEVBQUUrTCxJQUFGLENBQU9sTSxNQUFQLENBQVAsRUFBdUIsVUFBQ0ssQ0FBRDtBQUN0QixlQUFPLGtCQUFrQnlCLElBQWxCLENBQXVCekIsQ0FBdkIsQ0FBUDtBQ0hPLG1CRElOc1ksV0FBV3RZLENBQVgsSUFBZ0IsQ0NKVjtBQUNEO0FEQ1A7O0FBSUEsZUFBTzhYLGtCQUFrQnRWLElBQWxCLENBQXVCO0FBQUM1RCxlQUFLO0FBQUMrUixpQkFBS3RDO0FBQU47QUFBTixTQUF2QixFQUEwQztBQUFDMU8sa0JBQVEyWTtBQUFULFNBQTFDLENBQVA7QUFSSztBQUFBLEtBQVA7QUFXQTdJLFNBQUs4SSxRQUFMLEdBQWdCLEVBQWhCO0FBRUExTSxXQUFPL0wsRUFBRStMLElBQUYsQ0FBT2xNLE1BQVAsQ0FBUDs7QUFFQSxRQUFHa00sS0FBSzlKLE1BQUwsR0FBYyxDQUFqQjtBQUNDOEosYUFBTy9MLEVBQUUrTCxJQUFGLENBQU9nTSxPQUFQLENBQVA7QUNFRTs7QURBSDFMLFlBQVEsRUFBUjtBQUVBTixTQUFLOUwsT0FBTCxDQUFhLFVBQUMwRixHQUFEO0FBQ1osVUFBR2hHLFFBQVF0QixNQUFSLENBQWVxYSxXQUFmLENBQTJCL1MsTUFBTSxHQUFqQyxDQUFIO0FBQ0MwRyxnQkFBUUEsTUFBTXRHLE1BQU4sQ0FBYS9GLEVBQUV5RyxHQUFGLENBQU05RyxRQUFRdEIsTUFBUixDQUFlcWEsV0FBZixDQUEyQi9TLE1BQU0sR0FBakMsQ0FBTixFQUE2QyxVQUFDeEYsQ0FBRDtBQUNqRSxpQkFBT3dGLE1BQU0sR0FBTixHQUFZeEYsQ0FBbkI7QUFEb0IsVUFBYixDQUFSO0FDR0c7O0FBQ0QsYURESGtNLE1BQU0vTCxJQUFOLENBQVdxRixHQUFYLENDQ0c7QUROSjs7QUFPQTBHLFVBQU1wTSxPQUFOLENBQWMsVUFBQzBGLEdBQUQ7QUFDYixVQUFBZ1QsZUFBQTtBQUFBQSx3QkFBa0JaLFFBQVFwUyxHQUFSLENBQWxCOztBQUVBLFVBQUdnVCxvQkFBb0IzWSxFQUFFNlAsVUFBRixDQUFhOEksZ0JBQWdCalksWUFBN0IsS0FBOEMsQ0FBQ1YsRUFBRTBHLE9BQUYsQ0FBVWlTLGdCQUFnQmpZLFlBQTFCLENBQW5FLENBQUg7QUNFSyxlRERKaVAsS0FBSzhJLFFBQUwsQ0FBY25ZLElBQWQsQ0FBbUI7QUFDbEJvQyxnQkFBTSxVQUFDa1csTUFBRDtBQUNMLGdCQUFBQyxlQUFBLEVBQUEzUyxDQUFBLEVBQUE0UyxjQUFBLEVBQUFDLEdBQUEsRUFBQTdJLEtBQUEsRUFBQThJLGFBQUEsRUFBQXRZLFlBQUEsRUFBQXVZLG1CQUFBLEVBQUFDLEdBQUE7O0FBQUE7QUFDQy9ILG1CQUFLb0gsT0FBTDtBQUVBckksc0JBQVEsRUFBUjs7QUFHQSxrQkFBRyxvQkFBb0J2TyxJQUFwQixDQUF5QmdFLEdBQXpCLENBQUg7QUFDQ29ULHNCQUFNcFQsSUFBSWlCLE9BQUosQ0FBWSxrQkFBWixFQUFnQyxJQUFoQyxDQUFOO0FBQ0FzUyxzQkFBTXZULElBQUlpQixPQUFKLENBQVksa0JBQVosRUFBZ0MsSUFBaEMsQ0FBTjtBQUNBb1MsZ0NBQWdCSixPQUFPRyxHQUFQLEVBQVlJLFdBQVosQ0FBd0JELEdBQXhCLENBQWhCO0FBSEQ7QUFLQ0YsZ0NBQWdCclQsSUFBSTRLLEtBQUosQ0FBVSxHQUFWLEVBQWU2SSxNQUFmLENBQXNCLFVBQUM5SyxDQUFELEVBQUkzRixDQUFKO0FDQTVCLHlCQUFPMkYsS0FBSyxJQUFMLEdEQ2ZBLEVBQUczRixDQUFILENDRGUsR0RDWixNQ0RLO0FEQU0sbUJBRWRpUSxNQUZjLENBQWhCO0FDRU87O0FERVJsWSw2QkFBZWlZLGdCQUFnQmpZLFlBQS9COztBQUVBLGtCQUFHVixFQUFFNlAsVUFBRixDQUFhblAsWUFBYixDQUFIO0FBQ0NBLCtCQUFlQSxjQUFmO0FDRE87O0FER1Isa0JBQUdWLEVBQUU2SSxPQUFGLENBQVVuSSxZQUFWLENBQUg7QUFDQyxvQkFBR1YsRUFBRXFaLFFBQUYsQ0FBV0wsYUFBWCxLQUE2QixDQUFDaFosRUFBRTZJLE9BQUYsQ0FBVW1RLGFBQVYsQ0FBakM7QUFDQ3RZLGlDQUFlc1ksY0FBYzFLLENBQTdCO0FBQ0EwSyxrQ0FBZ0JBLGNBQWN6SyxHQUFkLElBQXFCLEVBQXJDO0FBRkQ7QUFJQyx5QkFBTyxFQUFQO0FBTEY7QUNLUTs7QURFUixrQkFBR3ZPLEVBQUU2SSxPQUFGLENBQVVtUSxhQUFWLENBQUg7QUFDQzlJLHNCQUFNcFIsR0FBTixHQUFZO0FBQUMrUix1QkFBS21JO0FBQU4saUJBQVo7QUFERDtBQUdDOUksc0JBQU1wUixHQUFOLEdBQVlrYSxhQUFaO0FDRU87O0FEQVJDLG9DQUFzQmpiLFFBQVFJLFNBQVIsQ0FBa0JzQyxZQUFsQixFQUFnQ3NJLE9BQWhDLENBQXRCO0FBRUE4UCwrQkFBaUJHLG9CQUFvQjNJLGNBQXJDO0FBRUF1SSxnQ0FBa0I7QUFBQy9aLHFCQUFLLENBQU47QUFBUzhPLHVCQUFPO0FBQWhCLGVBQWxCOztBQUVBLGtCQUFHa0wsY0FBSDtBQUNDRCxnQ0FBZ0JDLGNBQWhCLElBQWtDLENBQWxDO0FDRU87O0FEQVIscUJBQU85YSxRQUFRc0YsYUFBUixDQUFzQjVDLFlBQXRCLEVBQW9Dc0ksT0FBcEMsRUFBNkN0RyxJQUE3QyxDQUFrRHdOLEtBQWxELEVBQXlEO0FBQy9EclEsd0JBQVFnWjtBQUR1RCxlQUF6RCxDQUFQO0FBekNELHFCQUFBNVIsS0FBQTtBQTRDTWYsa0JBQUFlLEtBQUE7QUFDTEMsc0JBQVFDLEdBQVIsQ0FBWXpHLFlBQVosRUFBMEJrWSxNQUExQixFQUFrQzFTLENBQWxDO0FBQ0EscUJBQU8sRUFBUDtBQ0dNO0FEbkRVO0FBQUEsU0FBbkIsQ0NDSTtBQXFERDtBRDFETDs7QUF1REEsV0FBT3lKLElBQVA7QUFuRkQ7QUFxRkMsV0FBTztBQUNOak4sWUFBTTtBQUNMeU8sYUFBS29ILE9BQUw7QUFDQSxlQUFPUCxrQkFBa0J0VixJQUFsQixDQUF1QjtBQUFDNUQsZUFBSztBQUFDK1IsaUJBQUt0QztBQUFOO0FBQU4sU0FBdkIsRUFBMEM7QUFBQzFPLGtCQUFRQTtBQUFULFNBQTFDLENBQVA7QUFISztBQUFBLEtBQVA7QUNpQkM7QURsSUgsRzs7Ozs7Ozs7Ozs7O0FFQUFqQyxPQUFPK1osT0FBUCxDQUFlLGtCQUFmLEVBQW1DLFVBQUN6WixXQUFELEVBQWM4SyxPQUFkO0FBQy9CLE1BQUFDLE1BQUE7QUFBQUEsV0FBUyxLQUFLQSxNQUFkO0FBQ0EsU0FBT2pMLFFBQVFzRixhQUFSLENBQXNCLGtCQUF0QixFQUEwQ1osSUFBMUMsQ0FBK0M7QUFBQ3hFLGlCQUFhQSxXQUFkO0FBQTJCMFAsV0FBTzVFLE9BQWxDO0FBQTJDLFdBQU0sQ0FBQztBQUFDeUIsYUFBT3hCO0FBQVIsS0FBRCxFQUFrQjtBQUFDcVEsY0FBUTtBQUFULEtBQWxCO0FBQWpELEdBQS9DLENBQVA7QUFGSixHOzs7Ozs7Ozs7Ozs7QUNBQTFiLE9BQU8rWixPQUFQLENBQWUsdUJBQWYsRUFBd0MsVUFBQ3paLFdBQUQ7QUFDcEMsTUFBQStLLE1BQUE7QUFBQUEsV0FBUyxLQUFLQSxNQUFkO0FBQ0EsU0FBT2pMLFFBQVErUSxXQUFSLENBQW9CbFIsUUFBcEIsQ0FBNkI2RSxJQUE3QixDQUFrQztBQUFDeEUsaUJBQWE7QUFBQzJTLFdBQUszUztBQUFOLEtBQWQ7QUFBa0NLLGVBQVc7QUFBQ3NTLFdBQUssQ0FBQyxrQkFBRCxFQUFxQixrQkFBckI7QUFBTixLQUE3QztBQUE4RnBHLFdBQU94QjtBQUFyRyxHQUFsQyxDQUFQO0FBRkosRzs7Ozs7Ozs7Ozs7O0FDQUFyTCxPQUFPK1osT0FBUCxDQUFlLHlCQUFmLEVBQTBDLFVBQUN6WixXQUFELEVBQWNvQixtQkFBZCxFQUFtQzhOLGtCQUFuQyxFQUF1RDdPLFNBQXZELEVBQWtFeUssT0FBbEU7QUFDekMsTUFBQW5FLFdBQUEsRUFBQTBDLFFBQUEsRUFBQTBCLE1BQUE7QUFBQUEsV0FBUyxLQUFLQSxNQUFkOztBQUNBLE1BQUczSix3QkFBdUIsc0JBQTFCO0FBQ0NpSSxlQUFXO0FBQUMsd0JBQWtCeUI7QUFBbkIsS0FBWDtBQUREO0FBR0N6QixlQUFXO0FBQUNxRyxhQUFPNUU7QUFBUixLQUFYO0FDTUM7O0FESkYsTUFBRzFKLHdCQUF1QixXQUExQjtBQUVDaUksYUFBUyxVQUFULElBQXVCckosV0FBdkI7QUFDQXFKLGFBQVMsWUFBVCxJQUF5QixDQUFDaEosU0FBRCxDQUF6QjtBQUhEO0FBS0NnSixhQUFTNkYsa0JBQVQsSUFBK0I3TyxTQUEvQjtBQ0tDOztBREhGc0csZ0JBQWM3RyxRQUFRdUwsY0FBUixDQUF1QmpLLG1CQUF2QixFQUE0QzBKLE9BQTVDLEVBQXFEQyxNQUFyRCxDQUFkOztBQUNBLE1BQUcsQ0FBQ3BFLFlBQVlnUyxjQUFiLElBQWdDaFMsWUFBWUMsU0FBL0M7QUFDQ3lDLGFBQVNrRCxLQUFULEdBQWlCeEIsTUFBakI7QUNLQzs7QURIRixTQUFPakwsUUFBUXNGLGFBQVIsQ0FBc0JoRSxtQkFBdEIsRUFBMkNvRCxJQUEzQyxDQUFnRDZFLFFBQWhELENBQVA7QUFsQkQsRzs7Ozs7Ozs7Ozs7O0FFQUEzSixPQUFPK1osT0FBUCxDQUFlLGlCQUFmLEVBQWtDLFVBQUMzTyxPQUFELEVBQVVDLE1BQVY7QUFDakMsU0FBT2pMLFFBQVFzRixhQUFSLENBQXNCLGFBQXRCLEVBQXFDWixJQUFyQyxDQUEwQztBQUFDa0wsV0FBTzVFLE9BQVI7QUFBaUJ1USxVQUFNdFE7QUFBdkIsR0FBMUMsQ0FBUDtBQURELEc7Ozs7Ozs7Ozs7OztBQ0NBLElBQUdyTCxPQUFPcVAsUUFBVjtBQUVDclAsU0FBTytaLE9BQVAsQ0FBZSxzQkFBZixFQUF1QyxVQUFDM08sT0FBRDtBQUV0QyxRQUFBekIsUUFBQTs7QUFBQSxTQUFPLEtBQUswQixNQUFaO0FBQ0MsYUFBTyxLQUFLaVAsS0FBTCxFQUFQO0FDREU7O0FER0gsU0FBT2xQLE9BQVA7QUFDQyxhQUFPLEtBQUtrUCxLQUFMLEVBQVA7QUNERTs7QURHSDNRLGVBQ0M7QUFBQXFHLGFBQU81RSxPQUFQO0FBQ0FyRCxXQUFLO0FBREwsS0FERDtBQUlBLFdBQU91UixHQUFHc0MsY0FBSCxDQUFrQjlXLElBQWxCLENBQXVCNkUsUUFBdkIsQ0FBUDtBQVpEO0FDWUEsQzs7Ozs7Ozs7Ozs7O0FDZEQsSUFBRzNKLE9BQU9xUCxRQUFWO0FBRUNyUCxTQUFPK1osT0FBUCxDQUFlLCtCQUFmLEVBQWdELFVBQUMzTyxPQUFEO0FBRS9DLFFBQUF6QixRQUFBOztBQUFBLFNBQU8sS0FBSzBCLE1BQVo7QUFDQyxhQUFPLEtBQUtpUCxLQUFMLEVBQVA7QUNERTs7QURHSCxTQUFPbFAsT0FBUDtBQUNDLGFBQU8sS0FBS2tQLEtBQUwsRUFBUDtBQ0RFOztBREdIM1EsZUFDQztBQUFBcUcsYUFBTzVFLE9BQVA7QUFDQXJELFdBQUs7QUFETCxLQUREO0FBSUEsV0FBT3VSLEdBQUdzQyxjQUFILENBQWtCOVcsSUFBbEIsQ0FBdUI2RSxRQUF2QixDQUFQO0FBWkQ7QUNZQSxDOzs7Ozs7Ozs7Ozs7QUNmRCxJQUFHM0osT0FBT3FQLFFBQVY7QUFDQ3JQLFNBQU8rWixPQUFQLENBQWUsdUJBQWYsRUFBd0M7QUFDdkMsUUFBQTFPLE1BQUE7QUFBQUEsYUFBUyxLQUFLQSxNQUFkO0FBQ0EsV0FBT2lPLEdBQUdLLFdBQUgsQ0FBZTdVLElBQWYsQ0FBb0I7QUFBQzZXLFlBQU10USxNQUFQO0FBQWV1TyxvQkFBYztBQUE3QixLQUFwQixDQUFQO0FBRkQ7QUNRQSxDOzs7Ozs7Ozs7Ozs7QUNURGlDLG1DQUFtQyxFQUFuQzs7QUFFQUEsaUNBQWlDQyxrQkFBakMsR0FBc0QsVUFBQ0MsT0FBRCxFQUFVQyxPQUFWO0FBRXJELE1BQUFDLElBQUEsRUFBQUMsY0FBQSxFQUFBQyxPQUFBLEVBQUFDLGFBQUEsRUFBQUMsWUFBQSxFQUFBQyxjQUFBLEVBQUFDLGdCQUFBLEVBQUEzTSxRQUFBLEVBQUE0TSxhQUFBLEVBQUFDLGVBQUEsRUFBQUMsaUJBQUE7QUFBQVQsU0FBT1UsNkJBQTZCQyxPQUE3QixDQUFxQ2IsT0FBckMsQ0FBUDtBQUNBbk0sYUFBV3FNLEtBQUtqTSxLQUFoQjtBQUVBbU0sWUFBVSxJQUFJdlMsS0FBSixFQUFWO0FBQ0F3UyxrQkFBZ0I5QyxHQUFHOEMsYUFBSCxDQUFpQnRYLElBQWpCLENBQXNCO0FBQ3JDa0wsV0FBT0osUUFEOEI7QUFDcEIySixXQUFPeUM7QUFEYSxHQUF0QixFQUNvQjtBQUFFL1osWUFBUTtBQUFFNGEsZUFBUztBQUFYO0FBQVYsR0FEcEIsRUFDZ0Q5SCxLQURoRCxFQUFoQjs7QUFFQTNTLElBQUVlLElBQUYsQ0FBT2laLGFBQVAsRUFBc0IsVUFBQ1UsR0FBRDtBQUNyQlgsWUFBUXpaLElBQVIsQ0FBYW9hLElBQUk1YixHQUFqQjs7QUFDQSxRQUFHNGIsSUFBSUQsT0FBUDtBQ1FJLGFEUEh6YSxFQUFFZSxJQUFGLENBQU8yWixJQUFJRCxPQUFYLEVBQW9CLFVBQUNFLFNBQUQ7QUNRZixlRFBKWixRQUFRelosSUFBUixDQUFhcWEsU0FBYixDQ09JO0FEUkwsUUNPRztBQUdEO0FEYko7O0FBT0FaLFlBQVUvWixFQUFFNEYsSUFBRixDQUFPbVUsT0FBUCxDQUFWO0FBQ0FELG1CQUFpQixJQUFJdFMsS0FBSixFQUFqQjs7QUFDQSxNQUFHcVMsS0FBS2UsS0FBUjtBQUlDLFFBQUdmLEtBQUtlLEtBQUwsQ0FBV1IsYUFBZDtBQUNDQSxzQkFBZ0JQLEtBQUtlLEtBQUwsQ0FBV1IsYUFBM0I7O0FBQ0EsVUFBR0EsY0FBY3JULFFBQWQsQ0FBdUI2UyxPQUF2QixDQUFIO0FBQ0NFLHVCQUFleFosSUFBZixDQUFvQixLQUFwQjtBQUhGO0FDVUc7O0FETEgsUUFBR3VaLEtBQUtlLEtBQUwsQ0FBV1gsWUFBZDtBQUNDQSxxQkFBZUosS0FBS2UsS0FBTCxDQUFXWCxZQUExQjs7QUFDQWphLFFBQUVlLElBQUYsQ0FBT2daLE9BQVAsRUFBZ0IsVUFBQ2MsTUFBRDtBQUNmLFlBQUdaLGFBQWFsVCxRQUFiLENBQXNCOFQsTUFBdEIsQ0FBSDtBQ09NLGlCRE5MZixlQUFleFosSUFBZixDQUFvQixLQUFwQixDQ01LO0FBQ0Q7QURUTjtBQ1dFOztBREpILFFBQUd1WixLQUFLZSxLQUFMLENBQVdOLGlCQUFkO0FBQ0NBLDBCQUFvQlQsS0FBS2UsS0FBTCxDQUFXTixpQkFBL0I7O0FBQ0EsVUFBR0Esa0JBQWtCdlQsUUFBbEIsQ0FBMkI2UyxPQUEzQixDQUFIO0FBQ0NFLHVCQUFleFosSUFBZixDQUFvQixTQUFwQjtBQUhGO0FDVUc7O0FETEgsUUFBR3VaLEtBQUtlLEtBQUwsQ0FBV1QsZ0JBQWQ7QUFDQ0EseUJBQW1CTixLQUFLZSxLQUFMLENBQVdULGdCQUE5Qjs7QUFDQW5hLFFBQUVlLElBQUYsQ0FBT2daLE9BQVAsRUFBZ0IsVUFBQ2MsTUFBRDtBQUNmLFlBQUdWLGlCQUFpQnBULFFBQWpCLENBQTBCOFQsTUFBMUIsQ0FBSDtBQ09NLGlCRE5MZixlQUFleFosSUFBZixDQUFvQixTQUFwQixDQ01LO0FBQ0Q7QURUTjtBQ1dFOztBREpILFFBQUd1WixLQUFLZSxLQUFMLENBQVdQLGVBQWQ7QUFDQ0Esd0JBQWtCUixLQUFLZSxLQUFMLENBQVdQLGVBQTdCOztBQUNBLFVBQUdBLGdCQUFnQnRULFFBQWhCLENBQXlCNlMsT0FBekIsQ0FBSDtBQUNDRSx1QkFBZXhaLElBQWYsQ0FBb0IsT0FBcEI7QUFIRjtBQ1VHOztBRExILFFBQUd1WixLQUFLZSxLQUFMLENBQVdWLGNBQWQ7QUFDQ0EsdUJBQWlCTCxLQUFLZSxLQUFMLENBQVdWLGNBQTVCOztBQUNBbGEsUUFBRWUsSUFBRixDQUFPZ1osT0FBUCxFQUFnQixVQUFDYyxNQUFEO0FBQ2YsWUFBR1gsZUFBZW5ULFFBQWYsQ0FBd0I4VCxNQUF4QixDQUFIO0FDT00saUJETkxmLGVBQWV4WixJQUFmLENBQW9CLE9BQXBCLENDTUs7QUFDRDtBRFROO0FBdkNGO0FDbURFOztBRFBGd1osbUJBQWlCOVosRUFBRTRGLElBQUYsQ0FBT2tVLGNBQVAsQ0FBakI7QUFDQSxTQUFPQSxjQUFQO0FBOURxRCxDQUF0RCxDOzs7Ozs7Ozs7Ozs7QUVGQSxJQUFBZ0IsS0FBQTs7QUFBQUEsUUFBUTFTLFFBQVEsTUFBUixDQUFSO0FBQ0FtUywrQkFBK0IsRUFBL0I7O0FBRUFBLDZCQUE2QlEsbUJBQTdCLEdBQW1ELFVBQUNDLEdBQUQ7QUFDbEQsTUFBQUMsU0FBQSxFQUFBQyxXQUFBLEVBQUFoTCxLQUFBLEVBQUFxSixJQUFBLEVBQUF0USxNQUFBO0FBQUFpSCxVQUFROEssSUFBSTlLLEtBQVo7QUFDQWpILFdBQVNpSCxNQUFNLFdBQU4sQ0FBVDtBQUNBK0ssY0FBWS9LLE1BQU0sY0FBTixDQUFaOztBQUVBLE1BQUcsQ0FBSWpILE1BQUosSUFBYyxDQUFJZ1MsU0FBckI7QUFDQyxVQUFNLElBQUlyZCxPQUFPZ1MsS0FBWCxDQUFpQixHQUFqQixFQUFzQixjQUF0QixDQUFOO0FDSUM7O0FERkZzTCxnQkFBY0MsU0FBU0MsZUFBVCxDQUF5QkgsU0FBekIsQ0FBZDtBQUNBMUIsU0FBTzNiLE9BQU91WixLQUFQLENBQWE1VCxPQUFiLENBQ047QUFBQXpFLFNBQUttSyxNQUFMO0FBQ0EsK0NBQTJDaVM7QUFEM0MsR0FETSxDQUFQOztBQUlBLE1BQUcsQ0FBSTNCLElBQVA7QUFDQyxVQUFNLElBQUkzYixPQUFPZ1MsS0FBWCxDQUFpQixHQUFqQixFQUFzQixjQUF0QixDQUFOO0FDSUM7O0FERkYsU0FBTzJKLElBQVA7QUFoQmtELENBQW5EOztBQWtCQWdCLDZCQUE2QmMsUUFBN0IsR0FBd0MsVUFBQzdOLFFBQUQ7QUFDdkMsTUFBQUksS0FBQTtBQUFBQSxVQUFRNVAsUUFBUStRLFdBQVIsQ0FBb0JxSSxNQUFwQixDQUEyQjdULE9BQTNCLENBQW1DaUssUUFBbkMsQ0FBUjs7QUFDQSxNQUFHLENBQUlJLEtBQVA7QUFDQyxVQUFNLElBQUloUSxPQUFPZ1MsS0FBWCxDQUFpQixRQUFqQixFQUEyQix3QkFBM0IsQ0FBTjtBQ01DOztBRExGLFNBQU9oQyxLQUFQO0FBSnVDLENBQXhDOztBQU1BMk0sNkJBQTZCQyxPQUE3QixHQUF1QyxVQUFDYixPQUFEO0FBQ3RDLE1BQUFFLElBQUE7QUFBQUEsU0FBTzdiLFFBQVErUSxXQUFSLENBQW9CdU0sS0FBcEIsQ0FBMEIvWCxPQUExQixDQUFrQ29XLE9BQWxDLENBQVA7O0FBQ0EsTUFBRyxDQUFJRSxJQUFQO0FBQ0MsVUFBTSxJQUFJamMsT0FBT2dTLEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsZUFBM0IsQ0FBTjtBQ1NDOztBRFJGLFNBQU9pSyxJQUFQO0FBSnNDLENBQXZDOztBQU1BVSw2QkFBNkJnQixZQUE3QixHQUE0QyxVQUFDL04sUUFBRCxFQUFXb00sT0FBWDtBQUMzQyxNQUFBNEIsVUFBQTtBQUFBQSxlQUFheGQsUUFBUStRLFdBQVIsQ0FBb0J3SSxXQUFwQixDQUFnQ2hVLE9BQWhDLENBQXdDO0FBQUVxSyxXQUFPSixRQUFUO0FBQW1CK0wsVUFBTUs7QUFBekIsR0FBeEMsQ0FBYjs7QUFDQSxNQUFHLENBQUk0QixVQUFQO0FBQ0MsVUFBTSxJQUFJNWQsT0FBT2dTLEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsd0JBQTNCLENBQU47QUNlQzs7QURkRixTQUFPNEwsVUFBUDtBQUoyQyxDQUE1Qzs7QUFNQWpCLDZCQUE2QmtCLG1CQUE3QixHQUFtRCxVQUFDRCxVQUFEO0FBQ2xELE1BQUFqRixJQUFBLEVBQUFtRSxHQUFBO0FBQUFuRSxTQUFPLElBQUluRSxNQUFKLEVBQVA7QUFDQW1FLE9BQUttRixZQUFMLEdBQW9CRixXQUFXRSxZQUEvQjtBQUNBaEIsUUFBTTFjLFFBQVErUSxXQUFSLENBQW9CaUwsYUFBcEIsQ0FBa0N6VyxPQUFsQyxDQUEwQ2lZLFdBQVdFLFlBQXJELEVBQW1FO0FBQUU3YixZQUFRO0FBQUV5QixZQUFNLENBQVI7QUFBWXFhLGdCQUFVO0FBQXRCO0FBQVYsR0FBbkUsQ0FBTjtBQUNBcEYsT0FBS3FGLGlCQUFMLEdBQXlCbEIsSUFBSXBaLElBQTdCO0FBQ0FpVixPQUFLc0YscUJBQUwsR0FBNkJuQixJQUFJaUIsUUFBakM7QUFDQSxTQUFPcEYsSUFBUDtBQU5rRCxDQUFuRDs7QUFRQWdFLDZCQUE2QnVCLGFBQTdCLEdBQTZDLFVBQUNqQyxJQUFEO0FBQzVDLE1BQUdBLEtBQUtrQyxLQUFMLEtBQWdCLFNBQW5CO0FBQ0MsVUFBTSxJQUFJbmUsT0FBT2dTLEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsWUFBM0IsQ0FBTjtBQ3dCQztBRDFCMEMsQ0FBN0M7O0FBSUEySyw2QkFBNkJ5QixrQkFBN0IsR0FBa0QsVUFBQ25DLElBQUQsRUFBT3JNLFFBQVA7QUFDakQsTUFBR3FNLEtBQUtqTSxLQUFMLEtBQWdCSixRQUFuQjtBQUNDLFVBQU0sSUFBSTVQLE9BQU9nUyxLQUFYLENBQWlCLFFBQWpCLEVBQTJCLGFBQTNCLENBQU47QUMwQkM7QUQ1QitDLENBQWxEOztBQUlBMkssNkJBQTZCMEIsT0FBN0IsR0FBdUMsVUFBQ0MsT0FBRDtBQUN0QyxNQUFBQyxJQUFBO0FBQUFBLFNBQU9uZSxRQUFRK1EsV0FBUixDQUFvQnFOLEtBQXBCLENBQTBCN1ksT0FBMUIsQ0FBa0MyWSxPQUFsQyxDQUFQOztBQUNBLE1BQUcsQ0FBSUMsSUFBUDtBQUNDLFVBQU0sSUFBSXZlLE9BQU9nUyxLQUFYLENBQWlCLFFBQWpCLEVBQTJCLGlCQUEzQixDQUFOO0FDNkJDOztBRDNCRixTQUFPdU0sSUFBUDtBQUxzQyxDQUF2Qzs7QUFPQTVCLDZCQUE2QjhCLFdBQTdCLEdBQTJDLFVBQUNDLFdBQUQ7QUFDMUMsU0FBT3RlLFFBQVErUSxXQUFSLENBQW9Cd04sVUFBcEIsQ0FBK0JoWixPQUEvQixDQUF1QytZLFdBQXZDLENBQVA7QUFEMEMsQ0FBM0M7O0FBR0EvQiw2QkFBNkJpQyxlQUE3QixHQUErQyxVQUFDQyxvQkFBRCxFQUF1QkMsU0FBdkI7QUFDOUMsTUFBQUMsUUFBQSxFQUFBQyxtQkFBQSxFQUFBQyxRQUFBLEVBQUFoRCxJQUFBLEVBQUFGLE9BQUEsRUFBQXdDLElBQUEsRUFBQVcsT0FBQSxFQUFBQyxVQUFBLEVBQUExSSxHQUFBLEVBQUF4UCxXQUFBLEVBQUErSSxLQUFBLEVBQUFKLFFBQUEsRUFBQWdPLFVBQUEsRUFBQXdCLG1CQUFBLEVBQUFDLFVBQUEsRUFBQUMsaUJBQUEsRUFBQUMsU0FBQSxFQUFBdkQsT0FBQTtBQUFBOUgsUUFBTTJLLHFCQUFxQixXQUFyQixDQUFOLEVBQXlDdEUsTUFBekM7QUFDQXJHLFFBQU0ySyxxQkFBcUIsT0FBckIsQ0FBTixFQUFxQ3RFLE1BQXJDO0FBQ0FyRyxRQUFNMksscUJBQXFCLE1BQXJCLENBQU4sRUFBb0N0RSxNQUFwQztBQUNBckcsUUFBTTJLLHFCQUFxQixZQUFyQixDQUFOLEVBQTBDLENBQUM7QUFBQ25PLE9BQUc2SixNQUFKO0FBQVk1SixTQUFLLENBQUM0SixNQUFEO0FBQWpCLEdBQUQsQ0FBMUM7QUFHQW9DLCtCQUE2QjZDLGlCQUE3QixDQUErQ1gscUJBQXFCLFlBQXJCLEVBQW1DLENBQW5DLENBQS9DLEVBQXNGQSxxQkFBcUIsT0FBckIsQ0FBdEY7QUFFQWpQLGFBQVdpUCxxQkFBcUIsT0FBckIsQ0FBWDtBQUNBOUMsWUFBVThDLHFCQUFxQixNQUFyQixDQUFWO0FBQ0E3QyxZQUFVOEMsVUFBVTVkLEdBQXBCO0FBRUFvZSxzQkFBb0IsSUFBcEI7QUFFQU4sd0JBQXNCLElBQXRCOztBQUNBLE1BQUdILHFCQUFxQixRQUFyQixLQUFtQ0EscUJBQXFCLFFBQXJCLEVBQStCLENBQS9CLENBQXRDO0FBQ0NTLHdCQUFvQlQscUJBQXFCLFFBQXJCLEVBQStCLENBQS9CLENBQXBCOztBQUNBLFFBQUdTLGtCQUFrQixVQUFsQixLQUFrQ0Esa0JBQWtCLFVBQWxCLEVBQThCLENBQTlCLENBQXJDO0FBQ0NOLDRCQUFzQkgscUJBQXFCLFFBQXJCLEVBQStCLENBQS9CLEVBQWtDLFVBQWxDLEVBQThDLENBQTlDLENBQXRCO0FBSEY7QUNvQ0U7O0FEOUJGN08sVUFBUTJNLDZCQUE2QmMsUUFBN0IsQ0FBc0M3TixRQUF0QyxDQUFSO0FBRUFxTSxTQUFPVSw2QkFBNkJDLE9BQTdCLENBQXFDYixPQUFyQyxDQUFQO0FBRUE2QixlQUFhakIsNkJBQTZCZ0IsWUFBN0IsQ0FBMEMvTixRQUExQyxFQUFvRG9NLE9BQXBELENBQWI7QUFFQW9ELHdCQUFzQnpDLDZCQUE2QmtCLG1CQUE3QixDQUFpREQsVUFBakQsQ0FBdEI7QUFFQWpCLCtCQUE2QnVCLGFBQTdCLENBQTJDakMsSUFBM0M7QUFFQVUsK0JBQTZCeUIsa0JBQTdCLENBQWdEbkMsSUFBaEQsRUFBc0RyTSxRQUF0RDtBQUVBMk8sU0FBTzVCLDZCQUE2QjBCLE9BQTdCLENBQXFDcEMsS0FBS3NDLElBQTFDLENBQVA7QUFFQXRYLGdCQUFjd1ksa0JBQWtCM0Qsa0JBQWxCLENBQXFDQyxPQUFyQyxFQUE4Q0MsT0FBOUMsQ0FBZDs7QUFFQSxNQUFHLENBQUkvVSxZQUFZa0MsUUFBWixDQUFxQixLQUFyQixDQUFQO0FBQ0MsVUFBTSxJQUFJbkosT0FBT2dTLEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsZ0JBQTNCLENBQU47QUN3QkM7O0FEdEJGeUUsUUFBTSxJQUFJbkcsSUFBSixFQUFOO0FBQ0E0TyxZQUFVLEVBQVY7QUFDQUEsVUFBUWhlLEdBQVIsR0FBY2QsUUFBUStRLFdBQVIsQ0FBb0J1TyxTQUFwQixDQUE4QmpQLFVBQTlCLEVBQWQ7QUFDQXlPLFVBQVFsUCxLQUFSLEdBQWdCSixRQUFoQjtBQUNBc1AsVUFBUWpELElBQVIsR0FBZUYsT0FBZjtBQUNBbUQsVUFBUVMsWUFBUixHQUF1QjFELEtBQUsyRCxPQUFMLENBQWExZSxHQUFwQztBQUNBZ2UsVUFBUVgsSUFBUixHQUFldEMsS0FBS3NDLElBQXBCO0FBQ0FXLFVBQVFXLFlBQVIsR0FBdUI1RCxLQUFLMkQsT0FBTCxDQUFhQyxZQUFwQztBQUNBWCxVQUFReGIsSUFBUixHQUFldVksS0FBS3ZZLElBQXBCO0FBQ0F3YixVQUFRWSxTQUFSLEdBQW9COUQsT0FBcEI7QUFDQWtELFVBQVFhLGNBQVIsR0FBeUJqQixVQUFVcGIsSUFBbkM7QUFDQXdiLFVBQVFjLFNBQVIsR0FBdUJuQixxQkFBcUIsV0FBckIsSUFBdUNBLHFCQUFxQixXQUFyQixDQUF2QyxHQUE4RTdDLE9BQXJHO0FBQ0FrRCxVQUFRZSxjQUFSLEdBQTRCcEIscUJBQXFCLGdCQUFyQixJQUE0Q0EscUJBQXFCLGdCQUFyQixDQUE1QyxHQUF3RkMsVUFBVXBiLElBQTlIO0FBQ0F3YixVQUFRZ0Isc0JBQVIsR0FBb0NyQixxQkFBcUIsd0JBQXJCLElBQW9EQSxxQkFBcUIsd0JBQXJCLENBQXBELEdBQXdHakIsV0FBV0UsWUFBdko7QUFDQW9CLFVBQVFpQiwyQkFBUixHQUF5Q3RCLHFCQUFxQiw2QkFBckIsSUFBeURBLHFCQUFxQiw2QkFBckIsQ0FBekQsR0FBa0hPLG9CQUFvQnBCLGlCQUEvSztBQUNBa0IsVUFBUWtCLCtCQUFSLEdBQTZDdkIscUJBQXFCLGlDQUFyQixJQUE2REEscUJBQXFCLGlDQUFyQixDQUE3RCxHQUEySE8sb0JBQW9CbkIscUJBQTVMO0FBQ0FpQixVQUFRbUIsaUJBQVIsR0FBK0J4QixxQkFBcUIsbUJBQXJCLElBQStDQSxxQkFBcUIsbUJBQXJCLENBQS9DLEdBQThGakIsV0FBVzBDLFVBQXhJO0FBQ0FwQixVQUFRZixLQUFSLEdBQWdCLE9BQWhCO0FBQ0FlLFVBQVFxQixJQUFSLEdBQWUsRUFBZjtBQUNBckIsVUFBUXNCLFdBQVIsR0FBc0IsS0FBdEI7QUFDQXRCLFVBQVF1QixVQUFSLEdBQXFCLEtBQXJCO0FBQ0F2QixVQUFRdE8sT0FBUixHQUFrQjZGLEdBQWxCO0FBQ0F5SSxVQUFRck8sVUFBUixHQUFxQm1MLE9BQXJCO0FBQ0FrRCxVQUFRN08sUUFBUixHQUFtQm9HLEdBQW5CO0FBQ0F5SSxVQUFRM08sV0FBUixHQUFzQnlMLE9BQXRCO0FBQ0FrRCxVQUFROVMsTUFBUixHQUFpQixJQUFJb0ksTUFBSixFQUFqQjtBQUVBMEssVUFBUXdCLFVBQVIsR0FBcUI3QixxQkFBcUIsWUFBckIsQ0FBckI7O0FBRUEsTUFBR2pCLFdBQVcwQyxVQUFkO0FBQ0NwQixZQUFRb0IsVUFBUixHQUFxQjFDLFdBQVcwQyxVQUFoQztBQ3NCQzs7QURuQkZmLGNBQVksRUFBWjtBQUNBQSxZQUFVcmUsR0FBVixHQUFnQixJQUFJeWYsTUFBTUMsUUFBVixHQUFxQkMsSUFBckM7QUFDQXRCLFlBQVUvWixRQUFWLEdBQXFCMFosUUFBUWhlLEdBQTdCO0FBQ0FxZSxZQUFVdUIsV0FBVixHQUF3QixLQUF4QjtBQUVBekIsZUFBYWpkLEVBQUUwQyxJQUFGLENBQU9tWCxLQUFLMkQsT0FBTCxDQUFhbUIsS0FBcEIsRUFBMkIsVUFBQ0MsSUFBRDtBQUN2QyxXQUFPQSxLQUFLQyxTQUFMLEtBQWtCLE9BQXpCO0FBRFksSUFBYjtBQUdBMUIsWUFBVXlCLElBQVYsR0FBaUIzQixXQUFXbmUsR0FBNUI7QUFDQXFlLFlBQVU3YixJQUFWLEdBQWlCMmIsV0FBVzNiLElBQTVCO0FBRUE2YixZQUFVMkIsVUFBVixHQUF1QnpLLEdBQXZCO0FBRUFzSSxhQUFXLEVBQVg7QUFDQUEsV0FBUzdkLEdBQVQsR0FBZSxJQUFJeWYsTUFBTUMsUUFBVixHQUFxQkMsSUFBcEM7QUFDQTlCLFdBQVN2WixRQUFULEdBQW9CMFosUUFBUWhlLEdBQTVCO0FBQ0E2ZCxXQUFTb0MsS0FBVCxHQUFpQjVCLFVBQVVyZSxHQUEzQjtBQUNBNmQsV0FBUytCLFdBQVQsR0FBdUIsS0FBdkI7QUFDQS9CLFdBQVNwRCxJQUFULEdBQW1Ca0QscUJBQXFCLFdBQXJCLElBQXVDQSxxQkFBcUIsV0FBckIsQ0FBdkMsR0FBOEU3QyxPQUFqRztBQUNBK0MsV0FBU3FDLFNBQVQsR0FBd0J2QyxxQkFBcUIsZ0JBQXJCLElBQTRDQSxxQkFBcUIsZ0JBQXJCLENBQTVDLEdBQXdGQyxVQUFVcGIsSUFBMUg7QUFDQXFiLFdBQVNzQyxPQUFULEdBQW1CckYsT0FBbkI7QUFDQStDLFdBQVN1QyxZQUFULEdBQXdCeEMsVUFBVXBiLElBQWxDO0FBQ0FxYixXQUFTd0Msb0JBQVQsR0FBZ0MzRCxXQUFXRSxZQUEzQztBQUNBaUIsV0FBU3lDLHlCQUFULEdBQXFDcEMsb0JBQW9CMWIsSUFBekQ7QUFDQXFiLFdBQVMwQyw2QkFBVCxHQUF5Q3JDLG9CQUFvQnJCLFFBQTdEO0FBQ0FnQixXQUFTdGMsSUFBVCxHQUFnQixPQUFoQjtBQUNBc2MsV0FBU21DLFVBQVQsR0FBc0J6SyxHQUF0QjtBQUNBc0ksV0FBUzJDLFNBQVQsR0FBcUJqTCxHQUFyQjtBQUNBc0ksV0FBUzRDLE9BQVQsR0FBbUIsSUFBbkI7QUFDQTVDLFdBQVM2QyxRQUFULEdBQW9CLEtBQXBCO0FBQ0E3QyxXQUFTOEMsV0FBVCxHQUF1QixFQUF2QjtBQUNBOUMsV0FBUzNTLE1BQVQsR0FBa0J1USw2QkFBNkJtRixjQUE3QixDQUE0QzVDLFFBQVF3QixVQUFSLENBQW1CLENBQW5CLENBQTVDLEVBQW1FM0UsT0FBbkUsRUFBNEVuTSxRQUE1RSxFQUFzRjJPLEtBQUtxQixPQUFMLENBQWEzZCxNQUFuRyxDQUFsQjtBQUVBc2QsWUFBVXdDLFFBQVYsR0FBcUIsQ0FBQ2hELFFBQUQsQ0FBckI7QUFDQUcsVUFBUThDLE1BQVIsR0FBaUIsQ0FBQ3pDLFNBQUQsQ0FBakI7QUFFQUwsVUFBUStDLFdBQVIsR0FBc0JwRCxxQkFBcUJvRCxXQUFyQixJQUFvQyxFQUExRDtBQUVBL0MsVUFBUWdELGlCQUFSLEdBQTRCN0MsV0FBVzNiLElBQXZDOztBQUVBLE1BQUd1WSxLQUFLa0csV0FBTCxLQUFvQixJQUF2QjtBQUNDakQsWUFBUWlELFdBQVIsR0FBc0IsSUFBdEI7QUNjQzs7QURYRmpELFVBQVFrRCxTQUFSLEdBQW9CbkcsS0FBS3ZZLElBQXpCOztBQUNBLE1BQUc2YSxLQUFLVSxRQUFSO0FBQ0NBLGVBQVd0Qyw2QkFBNkI4QixXQUE3QixDQUF5Q0YsS0FBS1UsUUFBOUMsQ0FBWDs7QUFDQSxRQUFHQSxRQUFIO0FBQ0NDLGNBQVFtRCxhQUFSLEdBQXdCcEQsU0FBU3ZiLElBQWpDO0FBQ0F3YixjQUFRRCxRQUFSLEdBQW1CQSxTQUFTL2QsR0FBNUI7QUFKRjtBQ2tCRTs7QURaRmllLGVBQWEvZSxRQUFRK1EsV0FBUixDQUFvQnVPLFNBQXBCLENBQThCbFAsTUFBOUIsQ0FBcUMwTyxPQUFyQyxDQUFiO0FBRUF2QywrQkFBNkIyRixjQUE3QixDQUE0Q3BELFFBQVF3QixVQUFSLENBQW1CLENBQW5CLENBQTVDLEVBQW1FOVEsUUFBbkUsRUFBNkVzUCxRQUFRaGUsR0FBckYsRUFBMEY2ZCxTQUFTN2QsR0FBbkc7QUFFQXliLCtCQUE2QjRGLDBCQUE3QixDQUF3RHJELFFBQVF3QixVQUFSLENBQW1CLENBQW5CLENBQXhELEVBQStFdkIsVUFBL0UsRUFBMkZ2UCxRQUEzRjtBQUVBLFNBQU91UCxVQUFQO0FBbkk4QyxDQUEvQzs7QUFxSUF4Qyw2QkFBNkJtRixjQUE3QixHQUE4QyxVQUFDVSxTQUFELEVBQVlDLE1BQVosRUFBb0JyWCxPQUFwQixFQUE2Qm5KLE1BQTdCO0FBQzdDLE1BQUF5Z0IsVUFBQSxFQUFBQyxZQUFBLEVBQUExRyxJQUFBLEVBQUFzQyxJQUFBLEVBQUFxRSxVQUFBLEVBQUFDLGVBQUEsRUFBQUMsbUJBQUEsRUFBQUMsa0JBQUEsRUFBQUMsWUFBQSxFQUFBQyxpQkFBQSxFQUFBQyxxQkFBQSxFQUFBQyxvQkFBQSxFQUFBQyx5QkFBQSxFQUFBMVcsTUFBQSxFQUFBMlcsVUFBQSxFQUFBQyxFQUFBLEVBQUFuZSxNQUFBLEVBQUFvZSxRQUFBLEVBQUFoakIsR0FBQSxFQUFBNEIsY0FBQSxFQUFBcWhCLGtCQUFBLEVBQUFDLGVBQUEsRUFBQUMsYUFBQSxFQUFBQyxpQkFBQSxFQUFBdlgsTUFBQTtBQUFBc1csZUFBYSxFQUFiOztBQUNBdGdCLElBQUVlLElBQUYsQ0FBT2xCLE1BQVAsRUFBZSxVQUFDSyxDQUFEO0FBQ2QsUUFBR0EsRUFBRUcsSUFBRixLQUFVLFNBQWI7QUNhSSxhRFpITCxFQUFFZSxJQUFGLENBQU9iLEVBQUVMLE1BQVQsRUFBaUIsVUFBQzJoQixFQUFEO0FDYVosZURaSmxCLFdBQVdoZ0IsSUFBWCxDQUFnQmtoQixHQUFHckQsSUFBbkIsQ0NZSTtBRGJMLFFDWUc7QURiSjtBQ2lCSSxhRGJIbUMsV0FBV2hnQixJQUFYLENBQWdCSixFQUFFaWUsSUFBbEIsQ0NhRztBQUNEO0FEbkJKOztBQU9BblUsV0FBUyxFQUFUO0FBQ0FpWCxlQUFhYixVQUFVOVIsQ0FBdkI7QUFDQWhFLFdBQVN0TSxRQUFRSSxTQUFSLENBQWtCNmlCLFVBQWxCLEVBQThCalksT0FBOUIsQ0FBVDtBQUNBbVksYUFBV2YsVUFBVTdSLEdBQVYsQ0FBYyxDQUFkLENBQVg7QUFDQTJTLE9BQUtsakIsUUFBUStRLFdBQVIsQ0FBb0IwUyxnQkFBcEIsQ0FBcUNsZSxPQUFyQyxDQUE2QztBQUNqRHJGLGlCQUFhK2lCLFVBRG9DO0FBRWpEdEgsYUFBUzBHO0FBRndDLEdBQTdDLENBQUw7QUFJQXRkLFdBQVMvRSxRQUFRc0YsYUFBUixDQUFzQjJkLFVBQXRCLEVBQWtDalksT0FBbEMsRUFBMkN6RixPQUEzQyxDQUFtRDRkLFFBQW5ELENBQVQ7QUFDQXRILFNBQU83YixRQUFRc0YsYUFBUixDQUFzQixPQUF0QixFQUErQkMsT0FBL0IsQ0FBdUM4YyxNQUF2QyxFQUErQztBQUFFeGdCLFlBQVE7QUFBRXNjLFlBQU07QUFBUjtBQUFWLEdBQS9DLENBQVA7O0FBQ0EsTUFBRytFLE1BQU9uZSxNQUFWO0FBQ0NvWixXQUFPbmUsUUFBUXNGLGFBQVIsQ0FBc0IsT0FBdEIsRUFBK0JDLE9BQS9CLENBQXVDc1csS0FBS3NDLElBQTVDLENBQVA7QUFDQXFFLGlCQUFhckUsS0FBS3FCLE9BQUwsQ0FBYTNkLE1BQWIsSUFBdUIsRUFBcEM7QUFDQUUscUJBQWlCL0IsUUFBUThDLGlCQUFSLENBQTBCbWdCLFVBQTFCLEVBQXNDalksT0FBdEMsQ0FBakI7QUFDQW9ZLHlCQUFxQnBoQixFQUFFcUYsS0FBRixDQUFRdEYsY0FBUixFQUF3QixhQUF4QixDQUFyQjtBQUNBMGdCLHNCQUFrQnpnQixFQUFFc0YsTUFBRixDQUFTa2IsVUFBVCxFQUFxQixVQUFDa0IsU0FBRDtBQUN0QyxhQUFPQSxVQUFVcmhCLElBQVYsS0FBa0IsT0FBekI7QUFEaUIsTUFBbEI7QUFFQXFnQiwwQkFBc0IxZ0IsRUFBRXFGLEtBQUYsQ0FBUW9iLGVBQVIsRUFBeUIsTUFBekIsQ0FBdEI7O0FBRUFPLGdDQUE2QixVQUFDcmIsR0FBRDtBQUM1QixhQUFPM0YsRUFBRTBDLElBQUYsQ0FBTzBlLGtCQUFQLEVBQTRCLFVBQUNPLGlCQUFEO0FBQ2xDLGVBQU9oYyxJQUFJaWMsVUFBSixDQUFlRCxvQkFBb0IsR0FBbkMsQ0FBUDtBQURNLFFBQVA7QUFENEIsS0FBN0I7O0FBSUFiLDRCQUF3QixVQUFDbmIsR0FBRDtBQUN2QixhQUFPM0YsRUFBRTBDLElBQUYsQ0FBT2dlLG1CQUFQLEVBQTZCLFVBQUNtQixrQkFBRDtBQUNuQyxlQUFPbGMsSUFBSWljLFVBQUosQ0FBZUMscUJBQXFCLEdBQXBDLENBQVA7QUFETSxRQUFQO0FBRHVCLEtBQXhCOztBQUlBaEIsd0JBQW9CLFVBQUNsYixHQUFEO0FBQ25CLGFBQU8zRixFQUFFMEMsSUFBRixDQUFPK2QsZUFBUCxFQUF5QixVQUFDdmdCLENBQUQ7QUFDL0IsZUFBT0EsRUFBRWllLElBQUYsS0FBVXhZLEdBQWpCO0FBRE0sUUFBUDtBQURtQixLQUFwQjs7QUFJQWliLG1CQUFlLFVBQUNqYixHQUFEO0FBQ2QsYUFBTzNGLEVBQUUwQyxJQUFGLENBQU84ZCxVQUFQLEVBQW9CLFVBQUN0Z0IsQ0FBRDtBQUMxQixlQUFPQSxFQUFFaWUsSUFBRixLQUFVeFksR0FBakI7QUFETSxRQUFQO0FBRGMsS0FBZjs7QUFJQW9iLDJCQUF1QixVQUFDZSxVQUFELEVBQWFDLFlBQWI7QUFDdEIsYUFBTy9oQixFQUFFMEMsSUFBRixDQUFPb2YsV0FBV2ppQixNQUFsQixFQUEyQixVQUFDSyxDQUFEO0FBQ2pDLGVBQU9BLEVBQUVpZSxJQUFGLEtBQVU0RCxZQUFqQjtBQURNLFFBQVA7QUFEc0IsS0FBdkI7O0FBSUFwQix5QkFBcUIsVUFBQzdNLE9BQUQsRUFBVThELEVBQVY7QUFDcEIsVUFBQW9LLE9BQUEsRUFBQW5ULFFBQUEsRUFBQWpLLEdBQUE7O0FBQUFBLFlBQU01RyxRQUFRc0YsYUFBUixDQUFzQndRLE9BQXRCLENBQU47O0FBQ0EsVUFBRyxDQUFDbFAsR0FBSjtBQUNDO0FDeUJHOztBRHhCSixVQUFHNUUsRUFBRVcsUUFBRixDQUFXaVgsRUFBWCxDQUFIO0FBQ0NvSyxrQkFBVXBkLElBQUlyQixPQUFKLENBQVlxVSxFQUFaLENBQVY7O0FBQ0EsWUFBR29LLE9BQUg7QUFDQ0Esa0JBQVEsUUFBUixJQUFvQkEsUUFBUTFnQixJQUE1QjtBQUNBLGlCQUFPMGdCLE9BQVA7QUFKRjtBQUFBLGFBS0ssSUFBR2hpQixFQUFFNkksT0FBRixDQUFVK08sRUFBVixDQUFIO0FBQ0ovSSxtQkFBVyxFQUFYO0FBQ0FqSyxZQUFJbEMsSUFBSixDQUFTO0FBQUU1RCxlQUFLO0FBQUUrUixpQkFBSytHO0FBQVA7QUFBUCxTQUFULEVBQStCM1gsT0FBL0IsQ0FBdUMsVUFBQytoQixPQUFEO0FBQ3RDQSxrQkFBUSxRQUFSLElBQW9CQSxRQUFRMWdCLElBQTVCO0FDK0JLLGlCRDlCTHVOLFNBQVN2TyxJQUFULENBQWMwaEIsT0FBZCxDQzhCSztBRGhDTjs7QUFJQSxZQUFHLENBQUNoaUIsRUFBRTBHLE9BQUYsQ0FBVW1JLFFBQVYsQ0FBSjtBQUNDLGlCQUFPQSxRQUFQO0FBUEc7QUN1Q0Q7QURoRGdCLEtBQXJCOztBQW1CQXdTLHNCQUFrQixFQUFsQjtBQUNBQyxvQkFBZ0IsRUFBaEI7QUFDQUMsd0JBQW9CLEVBQXBCOztBQ2dDRSxRQUFJLENBQUNwakIsTUFBTStpQixHQUFHZSxTQUFWLEtBQXdCLElBQTVCLEVBQWtDO0FBQ2hDOWpCLFVEL0JVOEIsT0MrQlYsQ0QvQmtCLFVBQUNpaUIsRUFBRDtBQUNyQixZQUFBQyxTQUFBLEVBQUFULFNBQUEsRUFBQUcsa0JBQUEsRUFBQU8sZUFBQSxFQUFBQyxZQUFBLEVBQUFDLFVBQUEsRUFBQUMsZUFBQSxFQUFBQyxRQUFBLEVBQUFsUSxXQUFBLEVBQUFtUSxlQUFBLEVBQUFDLFlBQUEsRUFBQUMsZUFBQSxFQUFBQyxxQkFBQSxFQUFBQyxxQkFBQSxFQUFBQyxzQkFBQSxFQUFBQyxvQkFBQSxFQUFBQyxVQUFBLEVBQUFDLGNBQUE7QUFBQVAsdUJBQWVSLEdBQUdRLFlBQWxCO0FBQ0FPLHlCQUFpQmYsR0FBR2UsY0FBcEI7QUFDQUgsaUNBQXlCOUIsMEJBQTBCMEIsWUFBMUIsQ0FBekI7QUFDQWIsNkJBQXFCZixzQkFBc0JtQyxjQUF0QixDQUFyQjtBQUNBVCxtQkFBV2xZLE9BQU96SyxNQUFQLENBQWM2aUIsWUFBZCxDQUFYO0FBQ0FoQixvQkFBWWQsYUFBYXFDLGNBQWIsQ0FBWjs7QUFFQSxZQUFHSCxzQkFBSDtBQUVDUix1QkFBYUksYUFBYW5TLEtBQWIsQ0FBbUIsR0FBbkIsRUFBd0IsQ0FBeEIsQ0FBYjtBQUNBZ1MsNEJBQWtCRyxhQUFhblMsS0FBYixDQUFtQixHQUFuQixFQUF3QixDQUF4QixDQUFsQjtBQUNBd1MsaUNBQXVCVCxVQUF2Qjs7QUFDQSxjQUFHLENBQUNmLGtCQUFrQndCLG9CQUFsQixDQUFKO0FBQ0N4Qiw4QkFBa0J3QixvQkFBbEIsSUFBMEMsRUFBMUM7QUMrQk07O0FEN0JQLGNBQUdsQixrQkFBSDtBQUNDbUIseUJBQWFDLGVBQWUxUyxLQUFmLENBQXFCLEdBQXJCLEVBQTBCLENBQTFCLENBQWI7QUFDQWdSLDhCQUFrQndCLG9CQUFsQixFQUF3QyxrQkFBeEMsSUFBOERDLFVBQTlEO0FDK0JNOztBQUNELGlCRDlCTnpCLGtCQUFrQndCLG9CQUFsQixFQUF3Q1IsZUFBeEMsSUFBMkRVLGNDOEJyRDtBRDFDUCxlQWNLLElBQUdBLGVBQWVyaEIsT0FBZixDQUF1QixLQUF2QixJQUFnQyxDQUFoQyxJQUFzQzhnQixhQUFhOWdCLE9BQWIsQ0FBcUIsS0FBckIsSUFBOEIsQ0FBdkU7QUFDSm9oQix1QkFBYUMsZUFBZTFTLEtBQWYsQ0FBcUIsS0FBckIsRUFBNEIsQ0FBNUIsQ0FBYjtBQUNBK1IsdUJBQWFJLGFBQWFuUyxLQUFiLENBQW1CLEtBQW5CLEVBQTBCLENBQTFCLENBQWI7O0FBQ0EsY0FBR3hOLE9BQU9tZ0IsY0FBUCxDQUFzQlosVUFBdEIsS0FBc0N0aUIsRUFBRTZJLE9BQUYsQ0FBVTlGLE9BQU91ZixVQUFQLENBQVYsQ0FBekM7QUFDQ2pCLDRCQUFnQi9nQixJQUFoQixDQUFxQndJLEtBQUtDLFNBQUwsQ0FBZTtBQUNuQ29hLHlDQUEyQkgsVUFEUTtBQUVuQ0ksdUNBQXlCZDtBQUZVLGFBQWYsQ0FBckI7QUNpQ08sbUJEN0JQaEIsY0FBY2hoQixJQUFkLENBQW1CNGhCLEVBQW5CLENDNkJPO0FEckNKO0FBQUEsZUFXQSxJQUFHUSxhQUFhOWdCLE9BQWIsQ0FBcUIsR0FBckIsSUFBNEIsQ0FBNUIsSUFBa0M4Z0IsYUFBYTlnQixPQUFiLENBQXFCLEtBQXJCLE1BQStCLENBQUMsQ0FBckU7QUFDSjZnQiw0QkFBa0JDLGFBQWFuUyxLQUFiLENBQW1CLEdBQW5CLEVBQXdCLENBQXhCLENBQWxCO0FBQ0E2Uiw0QkFBa0JNLGFBQWFuUyxLQUFiLENBQW1CLEdBQW5CLEVBQXdCLENBQXhCLENBQWxCOztBQUNBLGNBQUdqRyxNQUFIO0FBQ0NnSSwwQkFBY2hJLE9BQU96SyxNQUFQLENBQWM0aUIsZUFBZCxDQUFkOztBQUNBLGdCQUFHblEsZ0JBQWdCQSxZQUFZalMsSUFBWixLQUFvQixRQUFwQixJQUFnQ2lTLFlBQVlqUyxJQUFaLEtBQW9CLGVBQXBFLEtBQXdGLENBQUNpUyxZQUFZK1EsUUFBeEc7QUFDQ2xCLDBCQUFZLEVBQVo7QUFDQUEsd0JBQVVDLGVBQVYsSUFBNkIsQ0FBN0I7QUFDQUMsNkJBQWVya0IsUUFBUXNGLGFBQVIsQ0FBc0JnUCxZQUFZNVIsWUFBbEMsRUFBZ0RzSSxPQUFoRCxFQUF5RHpGLE9BQXpELENBQWlFUixPQUFPMGYsZUFBUCxDQUFqRSxFQUEwRjtBQUFFNWlCLHdCQUFRc2lCO0FBQVYsZUFBMUYsQ0FBZjs7QUFDQSxrQkFBR0UsWUFBSDtBQytCVSx1QkQ5QlRyWSxPQUFPaVosY0FBUCxJQUF5QlosYUFBYUQsZUFBYixDQzhCaEI7QURuQ1g7QUFGRDtBQUhJO0FBQUEsZUFhQSxJQUFHVixhQUFhYyxRQUFiLElBQXlCZCxVQUFVcmhCLElBQVYsS0FBa0IsT0FBM0MsSUFBc0QsQ0FBQyxRQUFELEVBQVcsZUFBWCxFQUE0QjBHLFFBQTVCLENBQXFDeWIsU0FBU25pQixJQUE5QyxDQUF0RCxJQUE2R0wsRUFBRVcsUUFBRixDQUFXNmhCLFNBQVM5aEIsWUFBcEIsQ0FBaEg7QUFDSm1pQixrQ0FBd0JMLFNBQVM5aEIsWUFBakM7QUFDQWtpQixrQ0FBd0I3ZixPQUFPeWYsU0FBU2xoQixJQUFoQixDQUF4QjtBQUNBcWhCOztBQUNBLGNBQUdILFNBQVNhLFFBQVQsSUFBcUIzQixVQUFVNEIsY0FBbEM7QUFDQ1gsOEJBQWtCaEMsbUJBQW1Ca0MscUJBQW5CLEVBQTBDRCxxQkFBMUMsQ0FBbEI7QUFERCxpQkFFSyxJQUFHLENBQUNKLFNBQVNhLFFBQVYsSUFBc0IsQ0FBQzNCLFVBQVU0QixjQUFwQztBQUNKWCw4QkFBa0JoQyxtQkFBbUJrQyxxQkFBbkIsRUFBMENELHFCQUExQyxDQUFsQjtBQ2dDTTs7QUFDRCxpQkRoQ041WSxPQUFPaVosY0FBUCxJQUF5Qk4sZUNnQ25CO0FEeENGLGVBU0EsSUFBRzVmLE9BQU9tZ0IsY0FBUCxDQUFzQlIsWUFBdEIsQ0FBSDtBQ2lDRSxpQkRoQ04xWSxPQUFPaVosY0FBUCxJQUF5QmxnQixPQUFPMmYsWUFBUCxDQ2dDbkI7QUFDRDtBRHpGUCxPQytCSTtBQTRERDs7QURoQ0gxaUIsTUFBRTRGLElBQUYsQ0FBT3liLGVBQVAsRUFBd0JwaEIsT0FBeEIsQ0FBZ0MsVUFBQ3NqQixHQUFEO0FBQy9CLFVBQUFDLENBQUE7QUFBQUEsVUFBSTFhLEtBQUsyYSxLQUFMLENBQVdGLEdBQVgsQ0FBSjtBQUNBdlosYUFBT3daLEVBQUVMLHlCQUFULElBQXNDLEVBQXRDO0FDbUNHLGFEbENIcGdCLE9BQU95Z0IsRUFBRUosdUJBQVQsRUFBa0NuakIsT0FBbEMsQ0FBMEMsVUFBQ3lqQixFQUFEO0FBQ3pDLFlBQUFDLEtBQUE7QUFBQUEsZ0JBQVEsRUFBUjs7QUFDQTNqQixVQUFFZSxJQUFGLENBQU8yaUIsRUFBUCxFQUFXLFVBQUNqbUIsQ0FBRCxFQUFJMEMsQ0FBSjtBQ29DTCxpQkRuQ0xtaEIsY0FBY3JoQixPQUFkLENBQXNCLFVBQUMyakIsR0FBRDtBQUNyQixnQkFBQUMsT0FBQTs7QUFBQSxnQkFBR0QsSUFBSWxCLFlBQUosS0FBcUJjLEVBQUVKLHVCQUFGLEdBQTRCLEtBQTVCLEdBQW9DampCLENBQTVEO0FBQ0MwakIsd0JBQVVELElBQUlYLGNBQUosQ0FBbUIxUyxLQUFuQixDQUF5QixLQUF6QixFQUFnQyxDQUFoQyxDQUFWO0FDcUNPLHFCRHBDUG9ULE1BQU1FLE9BQU4sSUFBaUJwbUIsQ0NvQ1Y7QUFDRDtBRHhDUixZQ21DSztBRHBDTjs7QUFLQSxZQUFHLENBQUl1QyxFQUFFMEcsT0FBRixDQUFVaWQsS0FBVixDQUFQO0FDd0NNLGlCRHZDTDNaLE9BQU93WixFQUFFTCx5QkFBVCxFQUFvQzdpQixJQUFwQyxDQUF5Q3FqQixLQUF6QyxDQ3VDSztBQUNEO0FEaEROLFFDa0NHO0FEckNKOztBQWNBM2pCLE1BQUVlLElBQUYsQ0FBT3dnQixpQkFBUCxFQUEyQixVQUFDOWEsR0FBRCxFQUFNZCxHQUFOO0FBQzFCLFVBQUFtZSxjQUFBLEVBQUFDLFlBQUEsRUFBQUMsZ0JBQUEsRUFBQTlpQixhQUFBLEVBQUEraUIsaUJBQUEsRUFBQUMsY0FBQSxFQUFBM2MsUUFBQSxFQUFBNGMsU0FBQSxFQUFBQyxXQUFBO0FBQUFELGtCQUFZMWQsSUFBSTRkLGdCQUFoQjtBQUNBUCx1QkFBaUJqRCxrQkFBa0JzRCxTQUFsQixDQUFqQjs7QUFDQSxVQUFHLENBQUNBLFNBQUo7QUMwQ0ssZUR6Q0pqZCxRQUFRb2QsSUFBUixDQUFhLHNCQUFzQjNlLEdBQXRCLEdBQTRCLGdDQUF6QyxDQ3lDSTtBRDFDTDtBQUdDc2UsNEJBQW9CdGUsR0FBcEI7QUFDQXllLHNCQUFjLEVBQWQ7QUFDQWxqQix3QkFBZ0JsRCxRQUFRSSxTQUFSLENBQWtCNmxCLGlCQUFsQixFQUFxQ2piLE9BQXJDLENBQWhCO0FBQ0ErYSx1QkFBZS9qQixFQUFFMEMsSUFBRixDQUFPeEIsY0FBY3JCLE1BQXJCLEVBQTZCLFVBQUNLLENBQUQ7QUFDM0MsaUJBQU8sQ0FBQyxRQUFELEVBQVcsZUFBWCxFQUE0QjZHLFFBQTVCLENBQXFDN0csRUFBRUcsSUFBdkMsS0FBZ0RILEVBQUVRLFlBQUYsS0FBa0J1Z0IsVUFBekU7QUFEYyxVQUFmO0FBR0ErQywyQkFBbUJELGFBQWF6aUIsSUFBaEM7QUFFQWlHLG1CQUFXLEVBQVg7QUFDQUEsaUJBQVN5YyxnQkFBVCxJQUE2QjdDLFFBQTdCO0FBQ0ErQyx5QkFBaUJsbUIsUUFBUXNGLGFBQVIsQ0FBc0IyZ0IsaUJBQXRCLEVBQXlDdmhCLElBQXpDLENBQThDNkUsUUFBOUMsQ0FBakI7QUFFQTJjLHVCQUFlamtCLE9BQWYsQ0FBdUIsVUFBQ3NrQixFQUFEO0FBQ3RCLGNBQUFDLGNBQUE7QUFBQUEsMkJBQWlCLEVBQWpCOztBQUNBeGtCLFlBQUVlLElBQUYsQ0FBTzBGLEdBQVAsRUFBWSxVQUFDZ2UsUUFBRCxFQUFXQyxRQUFYO0FBQ1gsZ0JBQUFoRCxTQUFBLEVBQUFpRCxZQUFBLEVBQUEvQixxQkFBQSxFQUFBQyxxQkFBQSxFQUFBK0Isa0JBQUEsRUFBQUMsZUFBQTs7QUFBQSxnQkFBR0gsYUFBWSxrQkFBZjtBQUNDRztBQUNBRjs7QUFDQSxrQkFBR0YsU0FBUzdDLFVBQVQsQ0FBb0J1QyxZQUFZLEdBQWhDLENBQUg7QUFDQ1EsK0JBQWdCRixTQUFTbFUsS0FBVCxDQUFlLEdBQWYsRUFBb0IsQ0FBcEIsQ0FBaEI7QUFERDtBQUdDb1UsK0JBQWVGLFFBQWY7QUMwQ087O0FEeENSL0MsMEJBQVlYLHFCQUFxQitDLGNBQXJCLEVBQXFDYSxZQUFyQyxDQUFaO0FBQ0FDLG1DQUFxQjFqQixjQUFjckIsTUFBZCxDQUFxQjZrQixRQUFyQixDQUFyQjs7QUFDQSxrQkFBR2hELFVBQVVyaEIsSUFBVixLQUFrQixPQUFsQixJQUE2QixDQUFDLFFBQUQsRUFBVyxlQUFYLEVBQTRCMEcsUUFBNUIsQ0FBcUM2ZCxtQkFBbUJ2a0IsSUFBeEQsQ0FBN0IsSUFBOEZMLEVBQUVXLFFBQUYsQ0FBV2lrQixtQkFBbUJsa0IsWUFBOUIsQ0FBakc7QUFDQ21pQix3Q0FBd0IrQixtQkFBbUJsa0IsWUFBM0M7QUFDQWtpQix3Q0FBd0IyQixHQUFHRyxRQUFILENBQXhCOztBQUNBLG9CQUFHRSxtQkFBbUJ2QixRQUFuQixJQUErQjNCLFVBQVU0QixjQUE1QztBQUNDdUIsb0NBQWtCbEUsbUJBQW1Ca0MscUJBQW5CLEVBQTBDRCxxQkFBMUMsQ0FBbEI7QUFERCx1QkFFSyxJQUFHLENBQUNnQyxtQkFBbUJ2QixRQUFwQixJQUFnQyxDQUFDM0IsVUFBVTRCLGNBQTlDO0FBQ0p1QixvQ0FBa0JsRSxtQkFBbUJrQyxxQkFBbkIsRUFBMENELHFCQUExQyxDQUFsQjtBQU5GO0FBQUE7QUFRQ2lDLGtDQUFrQk4sR0FBR0csUUFBSCxDQUFsQjtBQzJDTzs7QUFDRCxxQkQzQ1BGLGVBQWVHLFlBQWYsSUFBK0JFLGVDMkN4QjtBQUNEO0FEaEVSOztBQ2tFSyxpQkQ1Q0xULFlBQVk5akIsSUFBWixDQUFpQmtrQixjQUFqQixDQzRDSztBRHBFTjtBQ3NFSSxlRDVDSnhhLE9BQU9tYSxTQUFQLElBQW9CQyxXQzRDaEI7QUFDRDtBRHpGTDs7QUErQ0EsUUFBR2xELEdBQUc0RCxnQkFBTjtBQUNDOWtCLFFBQUUra0IsTUFBRixDQUFTL2EsTUFBVCxFQUFpQnVRLDZCQUE2QnlLLGtCQUE3QixDQUFnRDlELEdBQUc0RCxnQkFBbkQsRUFBcUU3RCxVQUFyRSxFQUFpRmpZLE9BQWpGLEVBQTBGbVksUUFBMUYsQ0FBakI7QUE3S0Y7QUMyTkU7O0FEM0NGWixpQkFBZSxFQUFmOztBQUNBdmdCLElBQUVlLElBQUYsQ0FBT2YsRUFBRStMLElBQUYsQ0FBTy9CLE1BQVAsQ0FBUCxFQUF1QixVQUFDN0osQ0FBRDtBQUN0QixRQUFHbWdCLFdBQVd2WixRQUFYLENBQW9CNUcsQ0FBcEIsQ0FBSDtBQzZDSSxhRDVDSG9nQixhQUFhcGdCLENBQWIsSUFBa0I2SixPQUFPN0osQ0FBUCxDQzRDZjtBQUNEO0FEL0NKOztBQUlBLFNBQU9vZ0IsWUFBUDtBQXhNNkMsQ0FBOUM7O0FBME1BaEcsNkJBQTZCeUssa0JBQTdCLEdBQWtELFVBQUNGLGdCQUFELEVBQW1CN0QsVUFBbkIsRUFBK0JqWSxPQUEvQixFQUF3Q2ljLFFBQXhDO0FBQ2pELE1BQUFDLElBQUEsRUFBQW5pQixNQUFBLEVBQUFvaUIsTUFBQSxFQUFBbmIsTUFBQTtBQUFBakgsV0FBUy9FLFFBQVFzRixhQUFSLENBQXNCMmQsVUFBdEIsRUFBa0NqWSxPQUFsQyxFQUEyQ3pGLE9BQTNDLENBQW1EMGhCLFFBQW5ELENBQVQ7QUFDQUUsV0FBUywwQ0FBMENMLGdCQUExQyxHQUE2RCxJQUF0RTtBQUNBSSxTQUFPcEssTUFBTXFLLE1BQU4sRUFBYyxrQkFBZCxDQUFQO0FBQ0FuYixXQUFTa2IsS0FBS25pQixNQUFMLENBQVQ7O0FBQ0EsTUFBRy9DLEVBQUVxWixRQUFGLENBQVdyUCxNQUFYLENBQUg7QUFDQyxXQUFPQSxNQUFQO0FBREQ7QUFHQzlDLFlBQVFELEtBQVIsQ0FBYyxpQ0FBZDtBQ2dEQzs7QUQvQ0YsU0FBTyxFQUFQO0FBVGlELENBQWxEOztBQWFBc1QsNkJBQTZCMkYsY0FBN0IsR0FBOEMsVUFBQ0UsU0FBRCxFQUFZcFgsT0FBWixFQUFxQm9jLEtBQXJCLEVBQTRCQyxTQUE1QjtBQUU3Q3JuQixVQUFRK1EsV0FBUixDQUFvQixXQUFwQixFQUFpQ3JNLElBQWpDLENBQXNDO0FBQ3JDa0wsV0FBTzVFLE9BRDhCO0FBRXJDNFAsWUFBUXdIO0FBRjZCLEdBQXRDLEVBR0duZ0IsT0FISCxDQUdXLFVBQUNxbEIsRUFBRDtBQytDUixXRDlDRnRsQixFQUFFZSxJQUFGLENBQU91a0IsR0FBR0MsUUFBVixFQUFvQixVQUFDQyxTQUFELEVBQVlDLEdBQVo7QUFDbkIsVUFBQXZsQixDQUFBLEVBQUF3bEIsT0FBQTtBQUFBeGxCLFVBQUlsQyxRQUFRK1EsV0FBUixDQUFvQixzQkFBcEIsRUFBNEN4TCxPQUE1QyxDQUFvRGlpQixTQUFwRCxDQUFKO0FBQ0FFLGdCQUFVLElBQUlDLEdBQUdDLElBQVAsRUFBVjtBQ2dERyxhRDlDSEYsUUFBUUcsVUFBUixDQUFtQjNsQixFQUFFNGxCLGdCQUFGLENBQW1CLE9BQW5CLENBQW5CLEVBQWdEO0FBQzlDemxCLGNBQU1ILEVBQUU2bEIsUUFBRixDQUFXMWxCO0FBRDZCLE9BQWhELEVBRUcsVUFBQ3FQLEdBQUQ7QUFDRixZQUFBc1csUUFBQTs7QUFBQSxZQUFJdFcsR0FBSjtBQUNDLGdCQUFNLElBQUk5UixPQUFPZ1MsS0FBWCxDQUFpQkYsSUFBSXpJLEtBQXJCLEVBQTRCeUksSUFBSXVXLE1BQWhDLENBQU47QUNnREk7O0FEOUNMUCxnQkFBUXBrQixJQUFSLENBQWFwQixFQUFFb0IsSUFBRixFQUFiO0FBQ0Fva0IsZ0JBQVFRLElBQVIsQ0FBYWhtQixFQUFFZ21CLElBQUYsRUFBYjtBQUNBRixtQkFBVztBQUNWdmIsaUJBQU92SyxFQUFFOGxCLFFBQUYsQ0FBV3ZiLEtBRFI7QUFFVjBiLHNCQUFZam1CLEVBQUU4bEIsUUFBRixDQUFXRyxVQUZiO0FBR1Z2WSxpQkFBTzVFLE9BSEc7QUFJVjVGLG9CQUFVZ2lCLEtBSkE7QUFLVmdCLG1CQUFTZixTQUxDO0FBTVZ6TSxrQkFBUTBNLEdBQUd4bUI7QUFORCxTQUFYOztBQVNBLFlBQUcybUIsUUFBTyxDQUFWO0FBQ0NPLG1CQUFTeEksT0FBVCxHQUFtQixJQUFuQjtBQytDSTs7QUQ3Q0xrSSxnQkFBUU0sUUFBUixHQUFtQkEsUUFBbkI7QUMrQ0ksZUQ5Q0psb0IsSUFBSXdmLFNBQUosQ0FBY2xQLE1BQWQsQ0FBcUJzWCxPQUFyQixDQzhDSTtBRG5FTCxRQzhDRztBRGxESixNQzhDRTtBRGxESDtBQUY2QyxDQUE5Qzs7QUFtQ0FuTCw2QkFBNkI0RiwwQkFBN0IsR0FBMEQsVUFBQ0MsU0FBRCxFQUFZZ0YsS0FBWixFQUFtQnBjLE9BQW5CO0FBQ3pEaEwsVUFBUXNGLGFBQVIsQ0FBc0I4YyxVQUFVOVIsQ0FBaEMsRUFBbUN0RixPQUFuQyxFQUE0QzZFLE1BQTVDLENBQW1EdVMsVUFBVTdSLEdBQVYsQ0FBYyxDQUFkLENBQW5ELEVBQXFFO0FBQ3BFOFgsV0FBTztBQUNOL0ksaUJBQVc7QUFDVmdKLGVBQU8sQ0FBQztBQUNQeG5CLGVBQUtzbUIsS0FERTtBQUVQckosaUJBQU87QUFGQSxTQUFELENBREc7QUFLVndLLG1CQUFXO0FBTEQ7QUFETCxLQUQ2RDtBQVVwRXZZLFVBQU07QUFDTHdZLGNBQVEsSUFESDtBQUVMQyxzQkFBZ0I7QUFGWDtBQVY4RCxHQUFyRTtBQUR5RCxDQUExRDs7QUFtQkFsTSw2QkFBNkI2QyxpQkFBN0IsR0FBaUQsVUFBQ2dELFNBQUQsRUFBWXBYLE9BQVo7QUFDaEQsTUFBQWpHLE1BQUE7QUFBQUEsV0FBUy9FLFFBQVFzRixhQUFSLENBQXNCOGMsVUFBVTlSLENBQWhDLEVBQW1DdEYsT0FBbkMsRUFBNEN6RixPQUE1QyxDQUFvRDtBQUM1RHpFLFNBQUtzaEIsVUFBVTdSLEdBQVYsQ0FBYyxDQUFkLENBRHVEO0FBQ3JDK08sZUFBVztBQUFFb0osZUFBUztBQUFYO0FBRDBCLEdBQXBELEVBRU47QUFBRTdtQixZQUFRO0FBQUV5ZCxpQkFBVztBQUFiO0FBQVYsR0FGTSxDQUFUOztBQUlBLE1BQUd2YSxVQUFXQSxPQUFPdWEsU0FBUCxDQUFpQixDQUFqQixFQUFvQnZCLEtBQXBCLEtBQStCLFdBQTFDLElBQTBEL2QsUUFBUStRLFdBQVIsQ0FBb0J1TyxTQUFwQixDQUE4QjVhLElBQTlCLENBQW1DSyxPQUFPdWEsU0FBUCxDQUFpQixDQUFqQixFQUFvQnhlLEdBQXZELEVBQTREaVAsS0FBNUQsS0FBc0UsQ0FBbkk7QUFDQyxVQUFNLElBQUluUSxPQUFPZ1MsS0FBWCxDQUFpQixRQUFqQixFQUEyQiwrQkFBM0IsQ0FBTjtBQ3lEQztBRC9EOEMsQ0FBakQsQzs7Ozs7Ozs7Ozs7O0FFbmRBLElBQUErVyxjQUFBO0FBQUFDLFdBQVdDLEdBQVgsQ0FBZSxNQUFmLEVBQXVCLE1BQXZCLEVBQWdDLFVBQUM3TCxHQUFELEVBQU04TCxHQUFOLEVBQVdDLElBQVg7QUNHOUIsU0REREgsV0FBV0ksVUFBWCxDQUFzQmhNLEdBQXRCLEVBQTJCOEwsR0FBM0IsRUFBZ0M7QUFDL0IsUUFBQWhrQixVQUFBLEVBQUFta0IsY0FBQSxFQUFBdkIsT0FBQTtBQUFBNWlCLGlCQUFhaEYsSUFBSW9wQixLQUFqQjtBQUNBRCxxQkFBaUJqcEIsUUFBUUksU0FBUixDQUFrQixXQUFsQixFQUErQjhZLEVBQWhEOztBQUVBLFFBQUc4RCxJQUFJa00sS0FBSixJQUFjbE0sSUFBSWtNLEtBQUosQ0FBVSxDQUFWLENBQWpCO0FBRUN4QixnQkFBVSxJQUFJQyxHQUFHQyxJQUFQLEVBQVY7QUNDRyxhREFIRixRQUFRRyxVQUFSLENBQW1CN0ssSUFBSWtNLEtBQUosQ0FBVSxDQUFWLEVBQWF2WCxJQUFoQyxFQUFzQztBQUFDdFAsY0FBTTJhLElBQUlrTSxLQUFKLENBQVUsQ0FBVixFQUFhQztBQUFwQixPQUF0QyxFQUFxRSxVQUFDelgsR0FBRDtBQUNwRSxZQUFBMFgsSUFBQSxFQUFBbGhCLENBQUEsRUFBQW1oQixTQUFBLEVBQUFDLE9BQUEsRUFBQUMsUUFBQSxFQUFBdkIsUUFBQSxFQUFBd0IsWUFBQSxFQUFBdHBCLFdBQUEsRUFBQXVNLEtBQUEsRUFBQTBiLFVBQUEsRUFBQXZOLE1BQUEsRUFBQXJhLFNBQUEsRUFBQWtwQixJQUFBLEVBQUF2QixJQUFBLEVBQUF0WSxLQUFBO0FBQUEyWixtQkFBV3ZNLElBQUlrTSxLQUFKLENBQVUsQ0FBVixFQUFhSyxRQUF4QjtBQUNBRixvQkFBWUUsU0FBU2hYLEtBQVQsQ0FBZSxHQUFmLEVBQW9CakksR0FBcEIsRUFBWjs7QUFDQSxZQUFHLENBQUMsV0FBRCxFQUFjLFdBQWQsRUFBMkIsWUFBM0IsRUFBeUMsV0FBekMsRUFBc0R2QixRQUF0RCxDQUErRHdnQixTQUFTRyxXQUFULEVBQS9ELENBQUg7QUFDQ0gscUJBQVcsV0FBVzFSLE9BQU8sSUFBSTNILElBQUosRUFBUCxFQUFtQjBILE1BQW5CLENBQTBCLGdCQUExQixDQUFYLEdBQXlELEdBQXpELEdBQStEeVIsU0FBMUU7QUNJSTs7QURGTEQsZUFBT3BNLElBQUlvTSxJQUFYOztBQUNBO0FBQ0MsY0FBR0EsU0FBU0EsS0FBSyxhQUFMLE1BQXVCLElBQXZCLElBQStCQSxLQUFLLGFBQUwsTUFBdUIsTUFBL0QsQ0FBSDtBQUNDRyx1QkFBV0ksbUJBQW1CSixRQUFuQixDQUFYO0FBRkY7QUFBQSxpQkFBQXRnQixLQUFBO0FBR01mLGNBQUFlLEtBQUE7QUFDTEMsa0JBQVFELEtBQVIsQ0FBY3NnQixRQUFkO0FBQ0FyZ0Isa0JBQVFELEtBQVIsQ0FBY2YsQ0FBZDtBQUNBcWhCLHFCQUFXQSxTQUFTM2dCLE9BQVQsQ0FBaUIsSUFBakIsRUFBdUIsR0FBdkIsQ0FBWDtBQ01JOztBREpMOGUsZ0JBQVFwa0IsSUFBUixDQUFhaW1CLFFBQWI7O0FBRUEsWUFBR0gsUUFBUUEsS0FBSyxPQUFMLENBQVIsSUFBeUJBLEtBQUssT0FBTCxDQUF6QixJQUEwQ0EsS0FBSyxXQUFMLENBQTFDLElBQWdFQSxLQUFLLGFBQUwsQ0FBbkU7QUFDQ3hPLG1CQUFTd08sS0FBSyxRQUFMLENBQVQ7QUFDQTNjLGtCQUFRMmMsS0FBSyxPQUFMLENBQVI7QUFDQWpCLHVCQUFhaUIsS0FBSyxZQUFMLENBQWI7QUFDQXhaLGtCQUFRd1osS0FBSyxPQUFMLENBQVI7QUFDQTdvQixzQkFBWTZvQixLQUFLLFdBQUwsQ0FBWjtBQUNBbHBCLHdCQUFja3BCLEtBQUssYUFBTCxDQUFkO0FBQ0F4TyxtQkFBU3dPLEtBQUssUUFBTCxDQUFUO0FBQ0FwQixxQkFBVztBQUFDdmIsbUJBQU1BLEtBQVA7QUFBYzBiLHdCQUFXQSxVQUF6QjtBQUFxQ3ZZLG1CQUFNQSxLQUEzQztBQUFrRHJQLHVCQUFVQSxTQUE1RDtBQUF1RUwseUJBQWFBO0FBQXBGLFdBQVg7O0FBQ0EsY0FBRzBhLE1BQUg7QUFDQ29OLHFCQUFTcE4sTUFBVCxHQUFrQkEsTUFBbEI7QUNXSzs7QURWTjhNLGtCQUFRTSxRQUFSLEdBQW1CQSxRQUFuQjtBQUNBc0Isb0JBQVV4a0IsV0FBV3NMLE1BQVgsQ0FBa0JzWCxPQUFsQixDQUFWO0FBWkQ7QUFlQzRCLG9CQUFVeGtCLFdBQVdzTCxNQUFYLENBQWtCc1gsT0FBbEIsQ0FBVjtBQ1dJOztBRFJMUSxlQUFPb0IsUUFBUXZCLFFBQVIsQ0FBaUJHLElBQXhCOztBQUNBLFlBQUcsQ0FBQ0EsSUFBSjtBQUNDQSxpQkFBTyxJQUFQO0FDVUk7O0FEVEwsWUFBR3ROLE1BQUg7QUFDQ3FPLHlCQUFlcFosTUFBZixDQUFzQjtBQUFDL08saUJBQUk4WjtBQUFMLFdBQXRCLEVBQW1DO0FBQ2xDNUssa0JBQ0M7QUFBQXFaLHlCQUFXQSxTQUFYO0FBQ0FuQixvQkFBTUEsSUFETjtBQUVBalksd0JBQVcsSUFBSUMsSUFBSixFQUZYO0FBR0FDLDJCQUFhMUQ7QUFIYixhQUZpQztBQU1sQzRiLG1CQUNDO0FBQUFkLHdCQUNDO0FBQUFlLHVCQUFPLENBQUVnQixRQUFReG9CLEdBQVYsQ0FBUDtBQUNBeW5CLDJCQUFXO0FBRFg7QUFERDtBQVBpQyxXQUFuQztBQUREO0FBYUNpQix5QkFBZVAsZUFBZXRWLE1BQWYsQ0FBc0J2RCxNQUF0QixDQUE2QjtBQUMzQzlNLGtCQUFNaW1CLFFBRHFDO0FBRTNDOUgseUJBQWEsRUFGOEI7QUFHM0M0SCx1QkFBV0EsU0FIZ0M7QUFJM0NuQixrQkFBTUEsSUFKcUM7QUFLM0NYLHNCQUFVLENBQUMrQixRQUFReG9CLEdBQVQsQ0FMaUM7QUFNM0M4WixvQkFBUTtBQUFDdEssaUJBQUVwUSxXQUFIO0FBQWVxUSxtQkFBSSxDQUFDaFEsU0FBRDtBQUFuQixhQU5tQztBQU8zQ2tNLG1CQUFPQSxLQVBvQztBQVEzQ21ELG1CQUFPQSxLQVJvQztBQVMzQ1kscUJBQVUsSUFBSU4sSUFBSixFQVRpQztBQVUzQ08sd0JBQVloRSxLQVYrQjtBQVczQ3dELHNCQUFXLElBQUlDLElBQUosRUFYZ0M7QUFZM0NDLHlCQUFhMUQ7QUFaOEIsV0FBN0IsQ0FBZjtBQWNBNmMsa0JBQVF6WixNQUFSLENBQWU7QUFBQ0csa0JBQU07QUFBQyxpQ0FBb0J3WjtBQUFyQjtBQUFQLFdBQWY7QUN1Qkk7O0FEckJMQyxlQUNDO0FBQUFHLHNCQUFZTixRQUFReG9CLEdBQXBCO0FBQ0FvbkIsZ0JBQU1BO0FBRE4sU0FERDtBQUlBWSxZQUFJZSxTQUFKLENBQWMsa0JBQWQsRUFBaUNQLFFBQVF4b0IsR0FBekM7QUFDQWdvQixZQUFJZ0IsR0FBSixDQUFRaGYsS0FBS0MsU0FBTCxDQUFlMGUsSUFBZixDQUFSO0FBeEVELFFDQUc7QURISjtBQThFQ1gsVUFBSWlCLFVBQUosR0FBaUIsR0FBakI7QUN1QkcsYUR0QkhqQixJQUFJZ0IsR0FBSixFQ3NCRztBQUNEO0FEMUdKLElDQ0M7QURIRjtBQXVGQWxCLFdBQVdDLEdBQVgsQ0FBZSxNQUFmLEVBQXVCLGlCQUF2QixFQUEyQyxVQUFDN0wsR0FBRCxFQUFNOEwsR0FBTixFQUFXQyxJQUFYO0FBQzFDLE1BQUFpQixjQUFBLEVBQUE5aEIsQ0FBQSxFQUFBK0MsTUFBQTs7QUFBQTtBQUNDQSxhQUFTdkUsUUFBUXVqQixzQkFBUixDQUErQmpOLEdBQS9CLEVBQW9DOEwsR0FBcEMsQ0FBVDs7QUFDQSxRQUFHLENBQUM3ZCxNQUFKO0FBQ0MsWUFBTSxJQUFJckwsT0FBT2dTLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsZUFBdEIsQ0FBTjtBQzJCRTs7QUR6QkhvWSxxQkFBaUJoTixJQUFJa04sTUFBSixDQUFXcGxCLFVBQTVCO0FBRUE4akIsZUFBV0ksVUFBWCxDQUFzQmhNLEdBQXRCLEVBQTJCOEwsR0FBM0IsRUFBZ0M7QUFDL0IsVUFBQWhrQixVQUFBLEVBQUE0aUIsT0FBQSxFQUFBeUMsVUFBQTtBQUFBcmxCLG1CQUFhaEYsSUFBSWtxQixjQUFKLENBQWI7O0FBRUEsVUFBRyxDQUFJbGxCLFVBQVA7QUFDQyxjQUFNLElBQUlsRixPQUFPZ1MsS0FBWCxDQUFpQixHQUFqQixFQUFzQixlQUF0QixDQUFOO0FDMEJHOztBRHhCSixVQUFHb0wsSUFBSWtNLEtBQUosSUFBY2xNLElBQUlrTSxLQUFKLENBQVUsQ0FBVixDQUFqQjtBQUVDeEIsa0JBQVUsSUFBSUMsR0FBR0MsSUFBUCxFQUFWO0FBQ0FGLGdCQUFRcGtCLElBQVIsQ0FBYTBaLElBQUlrTSxLQUFKLENBQVUsQ0FBVixFQUFhSyxRQUExQjs7QUFFQSxZQUFHdk0sSUFBSW9NLElBQVA7QUFDQzFCLGtCQUFRTSxRQUFSLEdBQW1CaEwsSUFBSW9NLElBQXZCO0FDd0JJOztBRHRCTDFCLGdCQUFRamIsS0FBUixHQUFnQnhCLE1BQWhCO0FBQ0F5YyxnQkFBUU0sUUFBUixDQUFpQnZiLEtBQWpCLEdBQXlCeEIsTUFBekI7QUFFQXljLGdCQUFRRyxVQUFSLENBQW1CN0ssSUFBSWtNLEtBQUosQ0FBVSxDQUFWLEVBQWF2WCxJQUFoQyxFQUFzQztBQUFDdFAsZ0JBQU0yYSxJQUFJa00sS0FBSixDQUFVLENBQVYsRUFBYUM7QUFBcEIsU0FBdEM7QUFFQXJrQixtQkFBV3NMLE1BQVgsQ0FBa0JzWCxPQUFsQjtBQUVBeUMscUJBQWFybEIsV0FBV29rQixLQUFYLENBQWlCM2pCLE9BQWpCLENBQXlCbWlCLFFBQVE1bUIsR0FBakMsQ0FBYjtBQUNBOG5CLG1CQUFXd0IsVUFBWCxDQUFzQnRCLEdBQXRCLEVBQ0M7QUFBQTNJLGdCQUFNLEdBQU47QUFDQXhPLGdCQUFNd1k7QUFETixTQUREO0FBaEJEO0FBcUJDLGNBQU0sSUFBSXZxQixPQUFPZ1MsS0FBWCxDQUFpQixHQUFqQixFQUFzQixTQUF0QixDQUFOO0FDdUJHO0FEbERMO0FBUEQsV0FBQTNJLEtBQUE7QUFxQ01mLFFBQUFlLEtBQUE7QUFDTEMsWUFBUUQsS0FBUixDQUFjZixFQUFFbWlCLEtBQWhCO0FDd0JFLFdEdkJGekIsV0FBV3dCLFVBQVgsQ0FBc0J0QixHQUF0QixFQUEyQjtBQUMxQjNJLFlBQU1qWSxFQUFFZSxLQUFGLElBQVcsR0FEUztBQUUxQjBJLFlBQU07QUFBQzJZLGdCQUFRcGlCLEVBQUUrZixNQUFGLElBQVkvZixFQUFFcWlCO0FBQXZCO0FBRm9CLEtBQTNCLENDdUJFO0FBTUQ7QURyRUg7O0FBK0NBNUIsaUJBQWlCLFVBQUM2QixXQUFELEVBQWNDLGVBQWQsRUFBK0J2WSxLQUEvQixFQUFzQ3dZLE1BQXRDO0FBQ2hCLE1BQUFDLEdBQUEsRUFBQUMsd0JBQUEsRUFBQWxULElBQUEsRUFBQW1ULFNBQUEsRUFBQUMsUUFBQSxFQUFBQyxZQUFBO0FBQUE3aEIsVUFBUUMsR0FBUixDQUFZLHNDQUFaO0FBQ0F3aEIsUUFBTXZnQixRQUFRLFlBQVIsQ0FBTjtBQUNBc04sU0FBT2lULElBQUlLLElBQUosQ0FBU3RULElBQVQsQ0FBY1osT0FBZCxFQUFQO0FBRUE1RSxRQUFNK1ksTUFBTixHQUFlLE1BQWY7QUFDQS9ZLFFBQU1nWixPQUFOLEdBQWdCLFlBQWhCO0FBQ0FoWixRQUFNaVosV0FBTixHQUFvQlgsV0FBcEI7QUFDQXRZLFFBQU1rWixlQUFOLEdBQXdCLFdBQXhCO0FBQ0FsWixRQUFNbVosU0FBTixHQUFrQlYsSUFBSUssSUFBSixDQUFTdFQsSUFBVCxDQUFjNFQsT0FBZCxDQUFzQjVULElBQXRCLENBQWxCO0FBQ0F4RixRQUFNcVosZ0JBQU4sR0FBeUIsS0FBekI7QUFDQXJaLFFBQU1zWixjQUFOLEdBQXVCclIsT0FBT3pDLEtBQUsrVCxPQUFMLEVBQVAsQ0FBdkI7QUFFQVosY0FBWXpXLE9BQU9yRyxJQUFQLENBQVltRSxLQUFaLENBQVo7QUFDQTJZLFlBQVVyakIsSUFBVjtBQUVBb2pCLDZCQUEyQixFQUEzQjtBQUNBQyxZQUFVNW9CLE9BQVYsQ0FBa0IsVUFBQ3FCLElBQUQ7QUN3QmYsV0R2QkZzbkIsNEJBQTRCLE1BQU10bkIsSUFBTixHQUFhLEdBQWIsR0FBbUJxbkIsSUFBSUssSUFBSixDQUFTVSxTQUFULENBQW1CeFosTUFBTTVPLElBQU4sQ0FBbkIsQ0N1QjdDO0FEeEJIO0FBR0F5bkIsaUJBQWVMLE9BQU9pQixXQUFQLEtBQXVCLE9BQXZCLEdBQWlDaEIsSUFBSUssSUFBSixDQUFTVSxTQUFULENBQW1CZCx5QkFBeUJnQixNQUF6QixDQUFnQyxDQUFoQyxDQUFuQixDQUFoRDtBQUVBMVosUUFBTTJaLFNBQU4sR0FBa0JsQixJQUFJSyxJQUFKLENBQVNjLE1BQVQsQ0FBZ0JDLElBQWhCLENBQXFCdEIsa0JBQWtCLEdBQXZDLEVBQTRDTSxZQUE1QyxFQUEwRCxRQUExRCxFQUFvRSxNQUFwRSxDQUFsQjtBQUVBRCxhQUFXSCxJQUFJSyxJQUFKLENBQVNnQixtQkFBVCxDQUE2QjlaLEtBQTdCLENBQVg7QUFDQWhKLFVBQVFDLEdBQVIsQ0FBWTJoQixRQUFaO0FBQ0EsU0FBT0EsUUFBUDtBQTFCZ0IsQ0FBakI7O0FBNEJBbEMsV0FBV0MsR0FBWCxDQUFlLE1BQWYsRUFBdUIsZ0JBQXZCLEVBQTBDLFVBQUM3TCxHQUFELEVBQU04TCxHQUFOLEVBQVdDLElBQVg7QUFDekMsTUFBQTRCLEdBQUEsRUFBQVgsY0FBQSxFQUFBOWhCLENBQUEsRUFBQStDLE1BQUE7O0FBQUE7QUFDQ0EsYUFBU3ZFLFFBQVF1akIsc0JBQVIsQ0FBK0JqTixHQUEvQixFQUFvQzhMLEdBQXBDLENBQVQ7O0FBQ0EsUUFBRyxDQUFDN2QsTUFBSjtBQUNDLFlBQU0sSUFBSXJMLE9BQU9nUyxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGVBQXRCLENBQU47QUN3QkU7O0FEdEJIb1kscUJBQWlCLFFBQWpCO0FBRUFXLFVBQU12Z0IsUUFBUSxZQUFSLENBQU47QUFFQXdlLGVBQVdJLFVBQVgsQ0FBc0JoTSxHQUF0QixFQUEyQjhMLEdBQTNCLEVBQWdDO0FBQy9CLFVBQUEwQixXQUFBLEVBQUExbEIsVUFBQSxFQUFBNFMsSUFBQSxFQUFBdVUsR0FBQSxFQUFBL1osS0FBQSxFQUFBZ2EsQ0FBQSxFQUFBL3JCLEdBQUEsRUFBQTZFLElBQUEsRUFBQUMsSUFBQSxFQUFBa25CLElBQUEsRUFBQTFCLGVBQUEsRUFBQTJCLGFBQUEsRUFBQUMsVUFBQSxFQUFBbnJCLEdBQUEsRUFBQW9yQixPQUFBO0FBQUF4bkIsbUJBQWFoRixJQUFJa3FCLGNBQUosQ0FBYjs7QUFFQSxVQUFHLENBQUlsbEIsVUFBUDtBQUNDLGNBQU0sSUFBSWxGLE9BQU9nUyxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGVBQXRCLENBQU47QUNzQkc7O0FEcEJKLFVBQUdvTCxJQUFJa00sS0FBSixJQUFjbE0sSUFBSWtNLEtBQUosQ0FBVSxDQUFWLENBQWpCO0FBRUMsWUFBR2MsbUJBQWtCLFFBQWxCLE1BQUE3cEIsTUFBQVAsT0FBQUMsUUFBQSxXQUFBQyxHQUFBLFlBQUFLLElBQTJEaUcsS0FBM0QsR0FBMkQsTUFBM0QsTUFBb0UsS0FBdkU7QUFDQ29rQix3QkFBQSxDQUFBeGxCLE9BQUFwRixPQUFBQyxRQUFBLENBQUFDLEdBQUEsQ0FBQUMsTUFBQSxZQUFBaUYsS0FBMEN3bEIsV0FBMUMsR0FBMEMsTUFBMUM7QUFDQUMsNEJBQUEsQ0FBQXhsQixPQUFBckYsT0FBQUMsUUFBQSxDQUFBQyxHQUFBLENBQUFDLE1BQUEsWUFBQWtGLEtBQThDd2xCLGVBQTlDLEdBQThDLE1BQTlDO0FBRUEvUyxpQkFBT2lULElBQUlLLElBQUosQ0FBU3RULElBQVQsQ0FBY1osT0FBZCxFQUFQO0FBRUE1RSxrQkFBUTtBQUNQcWEsb0JBQVEsbUJBREQ7QUFFUEMsbUJBQU94UCxJQUFJa00sS0FBSixDQUFVLENBQVYsRUFBYUssUUFGYjtBQUdQa0Qsc0JBQVV6UCxJQUFJa00sS0FBSixDQUFVLENBQVYsRUFBYUs7QUFIaEIsV0FBUjtBQU1Bcm9CLGdCQUFNLDBDQUEwQ3luQixlQUFlNkIsV0FBZixFQUE0QkMsZUFBNUIsRUFBNkN2WSxLQUE3QyxFQUFvRCxLQUFwRCxDQUFoRDtBQUVBZ2EsY0FBSVEsS0FBS0MsSUFBTCxDQUFVLEtBQVYsRUFBaUJ6ckIsR0FBakIsQ0FBSjtBQUVBZ0ksa0JBQVFDLEdBQVIsQ0FBWStpQixDQUFaOztBQUVBLGVBQUFDLE9BQUFELEVBQUF2YSxJQUFBLFlBQUF3YSxLQUFXUyxPQUFYLEdBQVcsTUFBWDtBQUNDTixzQkFBVUosRUFBRXZhLElBQUYsQ0FBT2liLE9BQWpCO0FBQ0FSLDRCQUFnQnRoQixLQUFLMmEsS0FBTCxDQUFXLElBQUk5TyxNQUFKLENBQVd1VixFQUFFdmEsSUFBRixDQUFPa2IsYUFBbEIsRUFBaUMsUUFBakMsRUFBMkNDLFFBQTNDLEVBQVgsQ0FBaEI7QUFDQTVqQixvQkFBUUMsR0FBUixDQUFZaWpCLGFBQVo7QUFDQUMseUJBQWF2aEIsS0FBSzJhLEtBQUwsQ0FBVyxJQUFJOU8sTUFBSixDQUFXdVYsRUFBRXZhLElBQUYsQ0FBT29iLFVBQWxCLEVBQThCLFFBQTlCLEVBQXdDRCxRQUF4QyxFQUFYLENBQWI7QUFDQTVqQixvQkFBUUMsR0FBUixDQUFZa2pCLFVBQVo7QUFFQUosa0JBQU0sSUFBSXRCLElBQUlxQyxHQUFSLENBQVk7QUFDakIsNkJBQWVYLFdBQVdsQixXQURUO0FBRWpCLGlDQUFtQmtCLFdBQVdZLGVBRmI7QUFHakIsMEJBQVliLGNBQWNjLFFBSFQ7QUFJakIsNEJBQWMsWUFKRztBQUtqQiwrQkFBaUJiLFdBQVdjO0FBTFgsYUFBWixDQUFOO0FDb0JNLG1CRFpObEIsSUFBSW1CLFNBQUosQ0FBYztBQUNiQyxzQkFBUWpCLGNBQWNpQixNQURUO0FBRWJDLG1CQUFLbEIsY0FBY0ssUUFGTjtBQUdiYyxvQkFBTXZRLElBQUlrTSxLQUFKLENBQVUsQ0FBVixFQUFhdlgsSUFITjtBQUliNmIsd0NBQTBCLEVBSmI7QUFLYkMsMkJBQWF6USxJQUFJa00sS0FBSixDQUFVLENBQVYsRUFBYUMsUUFMYjtBQU1idUUsNEJBQWMsVUFORDtBQU9iQyxrQ0FBb0IsRUFQUDtBQVFiQywrQkFBaUIsT0FSSjtBQVNiQyxvQ0FBc0IsUUFUVDtBQVViQyx1QkFBUztBQVZJLGFBQWQsRUFXR2x1QixPQUFPbXVCLGVBQVAsQ0FBdUIsVUFBQ3JjLEdBQUQsRUFBTUMsSUFBTjtBQUV6QixrQkFBQXFjLGdCQUFBLEVBQUFDLGlCQUFBLEVBQUFDLGNBQUEsRUFBQUMsT0FBQTs7QUFBQSxrQkFBR3pjLEdBQUg7QUFDQ3hJLHdCQUFRQyxHQUFSLENBQVksUUFBWixFQUFzQnVJLEdBQXRCO0FBQ0Esc0JBQU0sSUFBSTlSLE9BQU9nUyxLQUFYLENBQWlCLEdBQWpCLEVBQXNCRixJQUFJNlksT0FBMUIsQ0FBTjtBQ2FPOztBRFhScmhCLHNCQUFRQyxHQUFSLENBQVksVUFBWixFQUF3QndJLElBQXhCO0FBRUF3Yyx3QkFBVXhELElBQUlLLElBQUosQ0FBU3RULElBQVQsQ0FBY1osT0FBZCxFQUFWO0FBRUFrWCxpQ0FBbUI7QUFDbEJ6Qix3QkFBUSxhQURVO0FBRWxCSyx5QkFBU047QUFGUyxlQUFuQjtBQUtBNEIsK0JBQWlCLDBDQUEwQ3ZGLGVBQWU2QixXQUFmLEVBQTRCQyxlQUE1QixFQUE2Q3VELGdCQUE3QyxFQUErRCxLQUEvRCxDQUEzRDtBQUVBQyxrQ0FBb0J2QixLQUFLQyxJQUFMLENBQVUsS0FBVixFQUFpQnVCLGNBQWpCLENBQXBCO0FDU08scUJEUFB0RixXQUFXd0IsVUFBWCxDQUFzQnRCLEdBQXRCLEVBQ0M7QUFBQTNJLHNCQUFNLEdBQU47QUFDQXhPLHNCQUFNc2M7QUFETixlQURELENDT087QUQxQkwsY0FYSCxDQ1lNO0FEN0NSO0FBRkQ7QUFBQTtBQXNFQyxjQUFNLElBQUlydUIsT0FBT2dTLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsU0FBdEIsQ0FBTjtBQ1dHO0FEdkZMO0FBVEQsV0FBQTNJLEtBQUE7QUF3Rk1mLFFBQUFlLEtBQUE7QUFDTEMsWUFBUUQsS0FBUixDQUFjZixFQUFFbWlCLEtBQWhCO0FDWUUsV0RYRnpCLFdBQVd3QixVQUFYLENBQXNCdEIsR0FBdEIsRUFBMkI7QUFDMUIzSSxZQUFNalksRUFBRWUsS0FBRixJQUFXLEdBRFM7QUFFMUIwSSxZQUFNO0FBQUMyWSxnQkFBUXBpQixFQUFFK2YsTUFBRixJQUFZL2YsRUFBRXFpQjtBQUF2QjtBQUZvQixLQUEzQixDQ1dFO0FBTUQ7QUQ1R0gsRzs7Ozs7Ozs7Ozs7O0FFbEtBM0IsV0FBV0MsR0FBWCxDQUFlLE1BQWYsRUFBdUIsNkJBQXZCLEVBQXNELFVBQUM3TCxHQUFELEVBQU04TCxHQUFOLEVBQVdDLElBQVg7QUFDckQsTUFBQXFGLGVBQUEsRUFBQUMsaUJBQUEsRUFBQW5tQixDQUFBLEVBQUFvbUIsUUFBQSxFQUFBQyxrQkFBQTs7QUFBQTtBQUNDRix3QkFBb0I5Uiw2QkFBNkJRLG1CQUE3QixDQUFpREMsR0FBakQsQ0FBcEI7QUFDQW9SLHNCQUFrQkMsa0JBQWtCdnRCLEdBQXBDO0FBRUF3dEIsZUFBV3RSLElBQUlvTSxJQUFmO0FBRUFtRix5QkFBcUIsSUFBSS9rQixLQUFKLEVBQXJCOztBQUVBeEgsTUFBRWUsSUFBRixDQUFPdXJCLFNBQVMsV0FBVCxDQUFQLEVBQThCLFVBQUM3UCxvQkFBRDtBQUM3QixVQUFBK1AsT0FBQSxFQUFBelAsVUFBQTtBQUFBQSxtQkFBYXhDLDZCQUE2QmlDLGVBQTdCLENBQTZDQyxvQkFBN0MsRUFBbUU0UCxpQkFBbkUsQ0FBYjtBQUVBRyxnQkFBVXh1QixRQUFRK1EsV0FBUixDQUFvQnVPLFNBQXBCLENBQThCL1osT0FBOUIsQ0FBc0M7QUFBRXpFLGFBQUtpZTtBQUFQLE9BQXRDLEVBQTJEO0FBQUVsZCxnQkFBUTtBQUFFK04saUJBQU8sQ0FBVDtBQUFZaU0sZ0JBQU0sQ0FBbEI7QUFBcUIwRCx3QkFBYyxDQUFuQztBQUFzQ3BCLGdCQUFNLENBQTVDO0FBQStDc0Isd0JBQWM7QUFBN0Q7QUFBVixPQUEzRCxDQUFWO0FDU0csYURQSDhPLG1CQUFtQmpzQixJQUFuQixDQUF3QmtzQixPQUF4QixDQ09HO0FEWko7O0FDY0UsV0RQRjVGLFdBQVd3QixVQUFYLENBQXNCdEIsR0FBdEIsRUFBMkI7QUFDMUIzSSxZQUFNLEdBRG9CO0FBRTFCeE8sWUFBTTtBQUFFOGMsaUJBQVNGO0FBQVg7QUFGb0IsS0FBM0IsQ0NPRTtBRHRCSCxXQUFBdGxCLEtBQUE7QUFtQk1mLFFBQUFlLEtBQUE7QUFDTEMsWUFBUUQsS0FBUixDQUFjZixFQUFFbWlCLEtBQWhCO0FDV0UsV0RWRnpCLFdBQVd3QixVQUFYLENBQXNCdEIsR0FBdEIsRUFBMkI7QUFDMUIzSSxZQUFNLEdBRG9CO0FBRTFCeE8sWUFBTTtBQUFFMlksZ0JBQVEsQ0FBQztBQUFFb0Usd0JBQWN4bUIsRUFBRStmLE1BQUYsSUFBWS9mLEVBQUVxaUI7QUFBOUIsU0FBRDtBQUFWO0FBRm9CLEtBQTNCLENDVUU7QUFVRDtBRDFDSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG5cdGNoZWNrTnBtVmVyc2lvbnNcclxufSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0YnVzYm95OiBcIl4wLjIuMTNcIixcclxuXHRta2RpcnA6IFwiXjAuMy41XCIsXHJcblx0XCJ4bWwyanNcIjogXCJeMC40LjE5XCIsXHJcblx0XCJub2RlLXhsc3hcIjogXCJeMC4xMi4wXCJcclxufSwgJ3N0ZWVkb3M6Y3JlYXRvcicpO1xyXG5cclxuaWYgKE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzICYmIE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKSB7XHJcblx0Y2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0XHRcImFsaXl1bi1zZGtcIjogXCJeMS4xMS4xMlwiXHJcblx0fSwgJ3N0ZWVkb3M6Y3JlYXRvcicpO1xyXG59IiwiXHJcblx0IyBDcmVhdG9yLmluaXRBcHBzKClcclxuXHJcblxyXG4jIENyZWF0b3IuaW5pdEFwcHMgPSAoKS0+XHJcbiMgXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuIyBcdFx0Xy5lYWNoIENyZWF0b3IuQXBwcywgKGFwcCwgYXBwX2lkKS0+XHJcbiMgXHRcdFx0ZGJfYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcclxuIyBcdFx0XHRpZiAhZGJfYXBwXHJcbiMgXHRcdFx0XHRhcHAuX2lkID0gYXBwX2lkXHJcbiMgXHRcdFx0XHRkYi5hcHBzLmluc2VydChhcHApXHJcbiMgZWxzZVxyXG4jIFx0YXBwLl9pZCA9IGFwcF9pZFxyXG4jIFx0ZGIuYXBwcy51cGRhdGUoe19pZDogYXBwX2lkfSwgYXBwKVxyXG5cclxuQ3JlYXRvci5nZXRTY2hlbWEgPSAob2JqZWN0X25hbWUpLT5cclxuXHRyZXR1cm4gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5zY2hlbWFcclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0VXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cclxuXHRpZiAhYXBwX2lkXHJcblx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXHJcblx0bGlzdF92aWV3X2lkID0gbGlzdF92aWV3Py5faWRcclxuXHJcblx0aWYgcmVjb3JkX2lkXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZClcclxuXHRlbHNlXHJcblx0XHRpZiBvYmplY3RfbmFtZSBpcyBcIm1lZXRpbmdcIlxyXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCIpXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RSb3V0ZXJVcmwgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSAtPlxyXG5cdGlmICFhcHBfaWRcclxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXHJcblx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHJcblx0bGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbClcclxuXHRsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXc/Ll9pZFxyXG5cclxuXHRpZiByZWNvcmRfaWRcclxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZFxyXG5cdGVsc2VcclxuXHRcdGlmIG9iamVjdF9uYW1lIGlzIFwibWVldGluZ1wiXHJcblx0XHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCJcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkXHJcblxyXG5DcmVhdG9yLmdldExpc3RWaWV3VXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cclxuXHR1cmwgPSBDcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKVxyXG5cdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKHVybClcclxuXHJcbkNyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIC0+XHJcblx0aWYgbGlzdF92aWV3X2lkIGlzIFwiY2FsZW5kYXJcIlxyXG5cdFx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIlxyXG5cdGVsc2VcclxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZFxyXG5cclxuQ3JlYXRvci5nZXRTd2l0Y2hMaXN0VXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cclxuXHRpZiBsaXN0X3ZpZXdfaWRcclxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIGxpc3Rfdmlld19pZCArIFwiL2xpc3RcIilcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvbGlzdC9zd2l0Y2hcIilcclxuXHJcbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdFVybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCByZWNvcmRfaWQsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIC0+XHJcblx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgcmVjb3JkX2lkICsgXCIvXCIgKyByZWxhdGVkX29iamVjdF9uYW1lICsgXCIvZ3JpZFwiKVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMgPSAob2JqZWN0X25hbWUsIGlzX2RlZXAsIGlzX3NraXBfaGlkZSwgaXNfcmVsYXRlZCktPlxyXG5cdF9vcHRpb25zID0gW11cclxuXHR1bmxlc3Mgb2JqZWN0X25hbWVcclxuXHRcdHJldHVybiBfb3B0aW9uc1xyXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRmaWVsZHMgPSBfb2JqZWN0Py5maWVsZHNcclxuXHRpY29uID0gX29iamVjdD8uaWNvblxyXG5cdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XHJcblx0XHRpZiBpc19za2lwX2hpZGUgYW5kIGYuaGlkZGVuXHJcblx0XHRcdHJldHVyblxyXG5cdFx0aWYgZi50eXBlID09IFwic2VsZWN0XCJcclxuXHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IFwiI3tmLmxhYmVsIHx8IGt9XCIsIHZhbHVlOiBcIiN7a31cIiwgaWNvbjogaWNvbn1cclxuXHRcdGVsc2VcclxuXHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XHJcblx0aWYgaXNfZGVlcFxyXG5cdFx0Xy5mb3JFYWNoIGZpZWxkcywgKGYsIGspLT5cclxuXHRcdFx0aWYgaXNfc2tpcF9oaWRlIGFuZCBmLmhpZGRlblxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRpZiAoZi50eXBlID09IFwibG9va3VwXCIgfHwgZi50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKSAmJiBmLnJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKGYucmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdCMg5LiN5pSv5oyBZi5yZWZlcmVuY2VfdG/kuLpmdW5jdGlvbueahOaDheWGte+8jOaciemcgOaxguWGjeivtFxyXG5cdFx0XHRcdHJfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoZi5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0aWYgcl9vYmplY3RcclxuXHRcdFx0XHRcdF8uZm9yRWFjaCByX29iamVjdC5maWVsZHMsIChmMiwgazIpLT5cclxuXHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IFwiI3tmLmxhYmVsIHx8IGt9PT4je2YyLmxhYmVsIHx8IGsyfVwiLCB2YWx1ZTogXCIje2t9LiN7azJ9XCIsIGljb246IHJfb2JqZWN0Py5pY29ufVxyXG5cdGlmIGlzX3JlbGF0ZWRcclxuXHRcdHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSlcclxuXHRcdF8uZWFjaCByZWxhdGVkT2JqZWN0cywgKF9yZWxhdGVkT2JqZWN0KT0+XHJcblx0XHRcdHJlbGF0ZWRPcHRpb25zID0gQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMoX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UpXHJcblx0XHRcdHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSlcclxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRPcHRpb25zLCAocmVsYXRlZE9wdGlvbiktPlxyXG5cdFx0XHRcdGlmIF9yZWxhdGVkT2JqZWN0LmZvcmVpZ25fa2V5ICE9IHJlbGF0ZWRPcHRpb24udmFsdWVcclxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBcIiN7cmVsYXRlZE9iamVjdC5sYWJlbCB8fCByZWxhdGVkT2JqZWN0Lm5hbWV9PT4je3JlbGF0ZWRPcHRpb24ubGFiZWx9XCIsIHZhbHVlOiBcIiN7cmVsYXRlZE9iamVjdC5uYW1lfS4je3JlbGF0ZWRPcHRpb24udmFsdWV9XCIsIGljb246IHJlbGF0ZWRPYmplY3Q/Lmljb259XHJcblx0cmV0dXJuIF9vcHRpb25zXHJcblxyXG4jIOe7n+S4gOS4uuWvueixoW9iamVjdF9uYW1l5o+Q5L6b5Y+v55So5LqO6L+H6JmR5Zmo6L+H6JmR5a2X5q61XHJcbkNyZWF0b3IuZ2V0T2JqZWN0RmlsdGVyRmllbGRPcHRpb25zID0gKG9iamVjdF9uYW1lKS0+XHJcblx0X29wdGlvbnMgPSBbXVxyXG5cdHVubGVzcyBvYmplY3RfbmFtZVxyXG5cdFx0cmV0dXJuIF9vcHRpb25zXHJcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xyXG5cdHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpXHJcblx0aWNvbiA9IF9vYmplY3Q/Lmljb25cclxuXHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxyXG5cdFx0IyBoaWRkZW4sZ3JpZOetieexu+Wei+eahOWtl+aute+8jOS4jemcgOimgei/h+a7pFxyXG5cdFx0aWYgIV8uaW5jbHVkZShbXCJncmlkXCIsXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwiYXZhdGFyXCIsIFwiaW1hZ2VcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSkgYW5kICFmLmhpZGRlblxyXG5cdFx0XHQjIGZpbHRlcnMuJC5maWVsZOWPimZsb3cuY3VycmVudOetieWtkOWtl+auteS5n+S4jemcgOimgei/h+a7pFxyXG5cdFx0XHRpZiAhL1xcdytcXC4vLnRlc3QoaykgYW5kIF8uaW5kZXhPZihwZXJtaXNzaW9uX2ZpZWxkcywgaykgPiAtMVxyXG5cdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBmLmxhYmVsIHx8IGssIHZhbHVlOiBrLCBpY29uOiBpY29ufVxyXG5cclxuXHRyZXR1cm4gX29wdGlvbnNcclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRPcHRpb25zID0gKG9iamVjdF9uYW1lKS0+XHJcblx0X29wdGlvbnMgPSBbXVxyXG5cdHVubGVzcyBvYmplY3RfbmFtZVxyXG5cdFx0cmV0dXJuIF9vcHRpb25zXHJcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xyXG5cdHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpXHJcblx0aWNvbiA9IF9vYmplY3Q/Lmljb25cclxuXHRfLmZvckVhY2ggZmllbGRzLCAoZiwgayktPlxyXG5cdFx0aWYgIV8uaW5jbHVkZShbXCJncmlkXCIsXCJvYmplY3RcIiwgXCJbT2JqZWN0XVwiLCBcIltvYmplY3RdXCIsIFwiT2JqZWN0XCIsIFwiYXZhdGFyXCIsIFwiaW1hZ2VcIiwgXCJtYXJrZG93blwiLCBcImh0bWxcIl0sIGYudHlwZSlcclxuXHRcdFx0aWYgIS9cXHcrXFwuLy50ZXN0KGspIGFuZCBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTFcclxuXHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogZi5sYWJlbCB8fCBrLCB2YWx1ZTogaywgaWNvbjogaWNvbn1cclxuXHRyZXR1cm4gX29wdGlvbnNcclxuXHJcbiMjI1xyXG5maWx0ZXJzOiDopoHovazmjaLnmoRmaWx0ZXJzXHJcbmZpZWxkczog5a+56LGh5a2X5q61XHJcbmZpbHRlcl9maWVsZHM6IOm7mOiupOi/h+a7pOWtl+aute+8jOaUr+aMgeWtl+espuS4suaVsOe7hOWSjOWvueixoeaVsOe7hOS4pOenjeagvOW8j++8jOWmgjpbJ2ZpbGVkX25hbWUxJywnZmlsZWRfbmFtZTInXSxbe2ZpZWxkOidmaWxlZF9uYW1lMScscmVxdWlyZWQ6dHJ1ZX1dXHJcbuWkhOeQhumAu+i+kTog5oqKZmlsdGVyc+S4reWtmOWcqOS6jmZpbHRlcl9maWVsZHPnmoTov4fmu6TmnaHku7blop7liqDmr4/pobnnmoRpc19kZWZhdWx044CBaXNfcmVxdWlyZWTlsZ7mgKfvvIzkuI3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25a+55bqU55qE56e76Zmk5q+P6aG555qE55u45YWz5bGe5oCnXHJcbui/lOWbnue7k+aenDog5aSE55CG5ZCO55qEZmlsdGVyc1xyXG4jIyNcclxuQ3JlYXRvci5nZXRGaWx0ZXJzV2l0aEZpbHRlckZpZWxkcyA9IChmaWx0ZXJzLCBmaWVsZHMsIGZpbHRlcl9maWVsZHMpLT5cclxuXHR1bmxlc3MgZmlsdGVyc1xyXG5cdFx0ZmlsdGVycyA9IFtdXHJcblx0dW5sZXNzIGZpbHRlcl9maWVsZHNcclxuXHRcdGZpbHRlcl9maWVsZHMgPSBbXVxyXG5cdGlmIGZpbHRlcl9maWVsZHM/Lmxlbmd0aFxyXG5cdFx0ZmlsdGVyX2ZpZWxkcy5mb3JFYWNoIChuKS0+XHJcblx0XHRcdGlmIF8uaXNTdHJpbmcobilcclxuXHRcdFx0XHRuID0gXHJcblx0XHRcdFx0XHRmaWVsZDogbixcclxuXHRcdFx0XHRcdHJlcXVpcmVkOiBmYWxzZVxyXG5cdFx0XHRpZiBmaWVsZHNbbi5maWVsZF0gYW5kICFfLmZpbmRXaGVyZShmaWx0ZXJzLHtmaWVsZDpuLmZpZWxkfSlcclxuXHRcdFx0XHRmaWx0ZXJzLnB1c2hcclxuXHRcdFx0XHRcdGZpZWxkOiBuLmZpZWxkLFxyXG5cdFx0XHRcdFx0aXNfZGVmYXVsdDogdHJ1ZSxcclxuXHRcdFx0XHRcdGlzX3JlcXVpcmVkOiBuLnJlcXVpcmVkXHJcblx0ZmlsdGVycy5mb3JFYWNoIChmaWx0ZXJJdGVtKS0+XHJcblx0XHRtYXRjaEZpZWxkID0gZmlsdGVyX2ZpZWxkcy5maW5kIChuKS0+IHJldHVybiBuID09IGZpbHRlckl0ZW0uZmllbGQgb3Igbi5maWVsZCA9PSBmaWx0ZXJJdGVtLmZpZWxkXHJcblx0XHRpZiBfLmlzU3RyaW5nKG1hdGNoRmllbGQpXHJcblx0XHRcdG1hdGNoRmllbGQgPSBcclxuXHRcdFx0XHRmaWVsZDogbWF0Y2hGaWVsZCxcclxuXHRcdFx0XHRyZXF1aXJlZDogZmFsc2VcclxuXHRcdGlmIG1hdGNoRmllbGRcclxuXHRcdFx0ZmlsdGVySXRlbS5pc19kZWZhdWx0ID0gdHJ1ZVxyXG5cdFx0XHRmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkID0gbWF0Y2hGaWVsZC5yZXF1aXJlZFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRkZWxldGUgZmlsdGVySXRlbS5pc19kZWZhdWx0XHJcblx0XHRcdGRlbGV0ZSBmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkXHJcblx0cmV0dXJuIGZpbHRlcnNcclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZCktPlxyXG5cclxuXHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cclxuXHRpZiAhcmVjb3JkX2lkXHJcblx0XHRyZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKVxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgb2JqZWN0X25hbWUgPT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSAmJiAgcmVjb3JkX2lkID09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpXHJcblx0XHRcdGlmIFRlbXBsYXRlLmluc3RhbmNlKCk/LnJlY29yZFxyXG5cdFx0XHRcdHJldHVybiBUZW1wbGF0ZS5pbnN0YW5jZSgpPy5yZWNvcmQ/LmdldCgpXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpXHJcblxyXG5cdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpXHJcblx0aWYgY29sbGVjdGlvblxyXG5cdFx0cmVjb3JkID0gY29sbGVjdGlvbi5maW5kT25lKHJlY29yZF9pZClcclxuXHRcdHJldHVybiByZWNvcmRcclxuXHJcbkNyZWF0b3IuZ2V0QXBwID0gKGFwcF9pZCktPlxyXG5cdGlmICFhcHBfaWRcclxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXHJcblx0YXBwID0gQ3JlYXRvci5BcHBzW2FwcF9pZF1cclxuXHRDcmVhdG9yLmRlcHM/LmFwcD8uZGVwZW5kKClcclxuXHRyZXR1cm4gYXBwXHJcblxyXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZCA9IChhcHBfaWQpLT5cclxuXHRhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpXHJcblx0ZGFzaGJvYXJkID0gbnVsbFxyXG5cdF8uZWFjaCBDcmVhdG9yLkRhc2hib2FyZHMsICh2LCBrKS0+XHJcblx0XHRpZiB2LmFwcHM/LmluZGV4T2YoYXBwLl9pZCkgPiAtMVxyXG5cdFx0XHRkYXNoYm9hcmQgPSB2O1xyXG5cdHJldHVybiBkYXNoYm9hcmQ7XHJcblxyXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZENvbXBvbmVudCA9IChhcHBfaWQpLT5cclxuXHRhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpXHJcblx0cmV0dXJuIFJlYWN0U3RlZWRvcy5wbHVnaW5Db21wb25lbnRTZWxlY3RvcihSZWFjdFN0ZWVkb3Muc3RvcmUuZ2V0U3RhdGUoKSwgXCJEYXNoYm9hcmRcIiwgYXBwLl9pZCk7XHJcblxyXG5DcmVhdG9yLmdldEFwcE9iamVjdE5hbWVzID0gKGFwcF9pZCktPlxyXG5cdGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZClcclxuXHRpc01vYmlsZSA9IFN0ZWVkb3MuaXNNb2JpbGUoKVxyXG5cdGFwcE9iamVjdHMgPSBpZiBpc01vYmlsZSB0aGVuIGFwcC5tb2JpbGVfb2JqZWN0cyBlbHNlIGFwcC5vYmplY3RzXHJcblx0b2JqZWN0cyA9IFtdXHJcblx0aWYgYXBwXHJcblx0XHRfLmVhY2ggYXBwT2JqZWN0cywgKHYpLT5cclxuXHRcdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3QodilcclxuXHRcdFx0aWYgb2JqPy5wZXJtaXNzaW9ucy5nZXQoKS5hbGxvd1JlYWQgYW5kICFvYmouaGlkZGVuXHJcblx0XHRcdFx0b2JqZWN0cy5wdXNoIHZcclxuXHRyZXR1cm4gb2JqZWN0c1xyXG5cclxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwcyA9IChpbmNsdWRlQWRtaW4pLT5cclxuXHRyZXR1cm4gUmVhY3RTdGVlZG9zLnZpc2libGVBcHBzU2VsZWN0b3IoUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCksIGluY2x1ZGVBZG1pbilcclxuXHJcbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHNPYmplY3RzID0gKCktPlxyXG5cdGFwcHMgPSBDcmVhdG9yLmdldFZpc2libGVBcHBzKClcclxuXHR2aXNpYmxlT2JqZWN0TmFtZXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhhcHBzLCdvYmplY3RzJykpXHJcblx0b2JqZWN0cyA9IF8uZmlsdGVyIENyZWF0b3IuT2JqZWN0cywgKG9iaiktPlxyXG5cdFx0aWYgdmlzaWJsZU9iamVjdE5hbWVzLmluZGV4T2Yob2JqLm5hbWUpIDwgMFxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuICFvYmouaGlkZGVuXHJcblx0b2JqZWN0cyA9IG9iamVjdHMuc29ydChDcmVhdG9yLnNvcnRpbmdNZXRob2QuYmluZCh7a2V5OlwibGFiZWxcIn0pKVxyXG5cdG9iamVjdHMgPSBfLnBsdWNrKG9iamVjdHMsJ25hbWUnKVxyXG5cdHJldHVybiBfLnVuaXEgb2JqZWN0c1xyXG5cclxuQ3JlYXRvci5nZXRBcHBzT2JqZWN0cyA9ICgpLT5cclxuXHRvYmplY3RzID0gW11cclxuXHR0ZW1wT2JqZWN0cyA9IFtdXHJcblx0Xy5mb3JFYWNoIENyZWF0b3IuQXBwcywgKGFwcCktPlxyXG5cdFx0dGVtcE9iamVjdHMgPSBfLmZpbHRlciBhcHAub2JqZWN0cywgKG9iaiktPlxyXG5cdFx0XHRyZXR1cm4gIW9iai5oaWRkZW5cclxuXHRcdG9iamVjdHMgPSBvYmplY3RzLmNvbmNhdCh0ZW1wT2JqZWN0cylcclxuXHRyZXR1cm4gXy51bmlxIG9iamVjdHNcclxuXHJcbkNyZWF0b3IudmFsaWRhdGVGaWx0ZXJzID0gKGZpbHRlcnMsIGxvZ2ljKS0+XHJcblx0ZmlsdGVyX2l0ZW1zID0gXy5tYXAgZmlsdGVycywgKG9iaikgLT5cclxuXHRcdGlmIF8uaXNFbXB0eShvYmopXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gb2JqXHJcblx0ZmlsdGVyX2l0ZW1zID0gXy5jb21wYWN0KGZpbHRlcl9pdGVtcylcclxuXHRlcnJvck1zZyA9IFwiXCJcclxuXHRmaWx0ZXJfbGVuZ3RoID0gZmlsdGVyX2l0ZW1zLmxlbmd0aFxyXG5cdGlmIGxvZ2ljXHJcblx0XHQjIOagvOW8j+WMlmZpbHRlclxyXG5cdFx0bG9naWMgPSBsb2dpYy5yZXBsYWNlKC9cXG4vZywgXCJcIikucmVwbGFjZSgvXFxzKy9nLCBcIiBcIilcclxuXHJcblx0XHQjIOWIpOaWreeJueauiuWtl+esplxyXG5cdFx0aWYgL1suX1xcLSErXSsvaWcudGVzdChsb2dpYylcclxuXHRcdFx0ZXJyb3JNc2cgPSBcIuWQq+acieeJueauiuWtl+espuOAglwiXHJcblxyXG5cdFx0aWYgIWVycm9yTXNnXHJcblx0XHRcdGluZGV4ID0gbG9naWMubWF0Y2goL1xcZCsvaWcpXHJcblx0XHRcdGlmICFpbmRleFxyXG5cdFx0XHRcdGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIlxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aW5kZXguZm9yRWFjaCAoaSktPlxyXG5cdFx0XHRcdFx0aWYgaSA8IDEgb3IgaSA+IGZpbHRlcl9sZW5ndGhcclxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieadoeS7tuW8leeUqOS6huacquWumuS5ieeahOetm+mAieWZqO+8miN7aX3jgIJcIlxyXG5cclxuXHRcdFx0XHRmbGFnID0gMVxyXG5cdFx0XHRcdHdoaWxlIGZsYWcgPD0gZmlsdGVyX2xlbmd0aFxyXG5cdFx0XHRcdFx0aWYgIWluZGV4LmluY2x1ZGVzKFwiI3tmbGFnfVwiKVxyXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCJcclxuXHRcdFx0XHRcdGZsYWcrKztcclxuXHJcblx0XHRpZiAhZXJyb3JNc2dcclxuXHRcdFx0IyDliKTmlq3mmK/lkKbmnInpnZ7ms5Xoi7HmloflrZfnrKZcclxuXHRcdFx0d29yZCA9IGxvZ2ljLm1hdGNoKC9bYS16QS1aXSsvaWcpXHJcblx0XHRcdGlmIHdvcmRcclxuXHRcdFx0XHR3b3JkLmZvckVhY2ggKHcpLT5cclxuXHRcdFx0XHRcdGlmICEvXihhbmR8b3IpJC9pZy50ZXN0KHcpXHJcblx0XHRcdFx0XHRcdGVycm9yTXNnID0gXCLmo4Dmn6XmgqjnmoTpq5jnuqfnrZvpgInmnaHku7bkuK3nmoTmi7zlhpnjgIJcIlxyXG5cclxuXHRcdGlmICFlcnJvck1zZ1xyXG5cdFx0XHQjIOWIpOaWreagvOW8j+aYr+WQpuato+ehrlxyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHRDcmVhdG9yLmV2YWwobG9naWMucmVwbGFjZSgvYW5kL2lnLCBcIiYmXCIpLnJlcGxhY2UoL29yL2lnLCBcInx8XCIpKVxyXG5cdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0ZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOS4reWQq+acieeJueauiuWtl+esplwiXHJcblxyXG5cdFx0XHRpZiAvKEFORClbXigpXSsoT1IpL2lnLnRlc3QobG9naWMpIHx8ICAvKE9SKVteKCldKyhBTkQpL2lnLnRlc3QobG9naWMpXHJcblx0XHRcdFx0ZXJyb3JNc2cgPSBcIuaCqOeahOetm+mAieWZqOW/hemhu+WcqOi/nue7reaAp+eahCBBTkQg5ZKMIE9SIOihqOi+vuW8j+WJjeWQjuS9v+eUqOaLrOWPt+OAglwiXHJcblx0aWYgZXJyb3JNc2dcclxuXHRcdGNvbnNvbGUubG9nIFwiZXJyb3JcIiwgZXJyb3JNc2dcclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHR0b2FzdHIuZXJyb3IoZXJyb3JNc2cpXHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuIyBcIj1cIiwgXCI8PlwiLCBcIj5cIiwgXCI+PVwiLCBcIjxcIiwgXCI8PVwiLCBcInN0YXJ0c3dpdGhcIiwgXCJjb250YWluc1wiLCBcIm5vdGNvbnRhaW5zXCIuXHJcbiMjI1xyXG5vcHRpb25z5Y+C5pWw77yaXHJcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXHJcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XHJcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxyXG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XHJcbiMjI1xyXG5DcmVhdG9yLmZvcm1hdEZpbHRlcnNUb01vbmdvID0gKGZpbHRlcnMsIG9wdGlvbnMpLT5cclxuXHR1bmxlc3MgZmlsdGVycz8ubGVuZ3RoXHJcblx0XHRyZXR1cm5cclxuXHQjIOW9k2ZpbHRlcnPkuI3mmK9bQXJyYXld57G75Z6L6ICM5pivW09iamVjdF3nsbvlnovml7bvvIzov5vooYzmoLzlvI/ovazmjaJcclxuXHR1bmxlc3MgZmlsdGVyc1swXSBpbnN0YW5jZW9mIEFycmF5XHJcblx0XHRmaWx0ZXJzID0gXy5tYXAgZmlsdGVycywgKG9iaiktPlxyXG5cdFx0XHRyZXR1cm4gW29iai5maWVsZCwgb2JqLm9wZXJhdGlvbiwgb2JqLnZhbHVlXVxyXG5cdHNlbGVjdG9yID0gW11cclxuXHRfLmVhY2ggZmlsdGVycywgKGZpbHRlciktPlxyXG5cdFx0ZmllbGQgPSBmaWx0ZXJbMF1cclxuXHRcdG9wdGlvbiA9IGZpbHRlclsxXVxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgbnVsbCwgb3B0aW9ucylcclxuXHRcdHN1Yl9zZWxlY3RvciA9IHt9XHJcblx0XHRzdWJfc2VsZWN0b3JbZmllbGRdID0ge31cclxuXHRcdGlmIG9wdGlvbiA9PSBcIj1cIlxyXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGVxXCJdID0gdmFsdWVcclxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPD5cIlxyXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJG5lXCJdID0gdmFsdWVcclxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPlwiXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RcIl0gPSB2YWx1ZVxyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI+PVwiXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RlXCJdID0gdmFsdWVcclxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPFwiXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRcIl0gPSB2YWx1ZVxyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8PVwiXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRlXCJdID0gdmFsdWVcclxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwic3RhcnRzd2l0aFwiXHJcblx0XHRcdHJlZyA9IG5ldyBSZWdFeHAoXCJeXCIgKyB2YWx1ZSwgXCJpXCIpXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWdcclxuXHRcdGVsc2UgaWYgb3B0aW9uID09IFwiY29udGFpbnNcIlxyXG5cdFx0XHRyZWcgPSBuZXcgUmVnRXhwKHZhbHVlLCBcImlcIilcclxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZ1xyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCJub3Rjb250YWluc1wiXHJcblx0XHRcdHJlZyA9IG5ldyBSZWdFeHAoXCJeKCg/IVwiICsgdmFsdWUgKyBcIikuKSokXCIsIFwiaVwiKVxyXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnXHJcblx0XHRzZWxlY3Rvci5wdXNoIHN1Yl9zZWxlY3RvclxyXG5cdHJldHVybiBzZWxlY3RvclxyXG5cclxuQ3JlYXRvci5pc0JldHdlZW5GaWx0ZXJPcGVyYXRpb24gPSAob3BlcmF0aW9uKS0+XHJcblx0cmV0dXJuIG9wZXJhdGlvbiA9PSBcImJldHdlZW5cIiBvciAhIUNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKHRydWUpP1tvcGVyYXRpb25dXHJcblxyXG4jIyNcclxub3B0aW9uc+WPguaVsO+8mlxyXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxyXG5cdHVzZXJJZC0tIOW9k+WJjeeZu+W9leeUqOaIt1xyXG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcclxuXHRleHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XHJcbiMjI1xyXG5DcmVhdG9yLmZvcm1hdEZpbHRlcnNUb0RldiA9IChmaWx0ZXJzLCBvYmplY3RfbmFtZSwgb3B0aW9ucyktPlxyXG5cdHN0ZWVkb3NGaWx0ZXJzID0gcmVxdWlyZShcIkBzdGVlZG9zL2ZpbHRlcnNcIik7XHJcblx0dW5sZXNzIGZpbHRlcnMubGVuZ3RoXHJcblx0XHRyZXR1cm5cclxuXHRpZiBvcHRpb25zPy5pc19sb2dpY19vclxyXG5cdFx0IyDlpoLmnpxpc19sb2dpY19vcuS4unRydWXvvIzkuLpmaWx0ZXJz56ys5LiA5bGC5YWD57Sg5aKe5Yqgb3Lpl7TpmpRcclxuXHRcdGxvZ2ljVGVtcEZpbHRlcnMgPSBbXVxyXG5cdFx0ZmlsdGVycy5mb3JFYWNoIChuKS0+XHJcblx0XHRcdGxvZ2ljVGVtcEZpbHRlcnMucHVzaChuKVxyXG5cdFx0XHRsb2dpY1RlbXBGaWx0ZXJzLnB1c2goXCJvclwiKVxyXG5cdFx0bG9naWNUZW1wRmlsdGVycy5wb3AoKVxyXG5cdFx0ZmlsdGVycyA9IGxvZ2ljVGVtcEZpbHRlcnNcclxuXHRzZWxlY3RvciA9IHN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb0RldihmaWx0ZXJzLCBDcmVhdG9yLlVTRVJfQ09OVEVYVClcclxuXHRyZXR1cm4gc2VsZWN0b3JcclxuXHJcbiMjI1xyXG5vcHRpb25z5Y+C5pWw77yaXHJcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXHJcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XHJcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxyXG5leHRlbmTkuLp0cnVl5pe277yM5ZCO56uv6ZyA6KaB6aKd5aSW5Lyg5YWldXNlcklk5Y+Kc3BhY2VJZOeUqOS6juaKk+WPlkNyZWF0b3IuVVNFUl9DT05URVhU5a+55bqU55qE5YC8XHJcbiMjI1xyXG5DcmVhdG9yLmZvcm1hdExvZ2ljRmlsdGVyc1RvRGV2ID0gKGZpbHRlcnMsIGZpbHRlcl9sb2dpYywgb3B0aW9ucyktPlxyXG5cdGZvcm1hdF9sb2dpYyA9IGZpbHRlcl9sb2dpYy5yZXBsYWNlKC9cXChcXHMrL2lnLCBcIihcIikucmVwbGFjZSgvXFxzK1xcKS9pZywgXCIpXCIpLnJlcGxhY2UoL1xcKC9nLCBcIltcIikucmVwbGFjZSgvXFwpL2csIFwiXVwiKS5yZXBsYWNlKC9cXHMrL2csIFwiLFwiKS5yZXBsYWNlKC8oYW5kfG9yKS9pZywgXCInJDEnXCIpXHJcblx0Zm9ybWF0X2xvZ2ljID0gZm9ybWF0X2xvZ2ljLnJlcGxhY2UoLyhcXGQpKy9pZywgKHgpLT5cclxuXHRcdF9mID0gZmlsdGVyc1t4LTFdXHJcblx0XHRmaWVsZCA9IF9mLmZpZWxkXHJcblx0XHRvcHRpb24gPSBfZi5vcGVyYXRpb25cclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlLCBudWxsLCBvcHRpb25zKVxyXG5cdFx0c3ViX3NlbGVjdG9yID0gW11cclxuXHRcdGlmIF8uaXNBcnJheSh2YWx1ZSkgPT0gdHJ1ZVxyXG5cdFx0XHRpZiBvcHRpb24gPT0gXCI9XCJcclxuXHRcdFx0XHRfLmVhY2ggdmFsdWUsICh2KS0+XHJcblx0XHRcdFx0XHRzdWJfc2VsZWN0b3IucHVzaCBbZmllbGQsIG9wdGlvbiwgdl0sIFwib3JcIlxyXG5cdFx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIjw+XCJcclxuXHRcdFx0XHRfLmVhY2ggdmFsdWUsICh2KS0+XHJcblx0XHRcdFx0XHRzdWJfc2VsZWN0b3IucHVzaCBbZmllbGQsIG9wdGlvbiwgdl0sIFwiYW5kXCJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdF8uZWFjaCB2YWx1ZSwgKHYpLT5cclxuXHRcdFx0XHRcdHN1Yl9zZWxlY3Rvci5wdXNoIFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiXHJcblx0XHRcdGlmIHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT0gXCJhbmRcIiB8fCBzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09IFwib3JcIlxyXG5cdFx0XHRcdHN1Yl9zZWxlY3Rvci5wb3AoKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRzdWJfc2VsZWN0b3IgPSBbZmllbGQsIG9wdGlvbiwgdmFsdWVdXHJcblx0XHRjb25zb2xlLmxvZyBcInN1Yl9zZWxlY3RvclwiLCBzdWJfc2VsZWN0b3JcclxuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShzdWJfc2VsZWN0b3IpXHJcblx0KVxyXG5cdGZvcm1hdF9sb2dpYyA9IFwiWyN7Zm9ybWF0X2xvZ2ljfV1cIlxyXG5cdHJldHVybiBDcmVhdG9yLmV2YWwoZm9ybWF0X2xvZ2ljKVxyXG5cclxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cclxuXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdXHJcblx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cclxuXHRpZiAhX29iamVjdFxyXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzXHJcblxyXG4jXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soX29iamVjdC5yZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxyXG5cclxuXHRyZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKF9vYmplY3QuX2NvbGxlY3Rpb25fbmFtZSlcclxuXHJcblx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cyxcIm9iamVjdF9uYW1lXCIpXHJcblx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZXM/Lmxlbmd0aCA9PSAwXHJcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXNcclxuXHJcblx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXHJcblx0dW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cclxuXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZSByZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHNcclxuXHRyZXR1cm4gXy5maWx0ZXIgcmVsYXRlZF9vYmplY3RzLCAocmVsYXRlZF9vYmplY3QpLT5cclxuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdC5vYmplY3RfbmFtZVxyXG5cdFx0aXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTFcclxuXHRcdGFsbG93UmVhZCA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8uYWxsb3dSZWFkXHJcblx0XHRyZXR1cm4gaXNBY3RpdmUgYW5kIGFsbG93UmVhZFxyXG5cclxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0TmFtZXMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxyXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcclxuXHRyZXR1cm4gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxyXG5cclxuQ3JlYXRvci5nZXRBY3Rpb25zID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblxyXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cclxuXHRpZiAhb2JqXHJcblx0XHRyZXR1cm5cclxuXHJcblx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXHJcblx0ZGlzYWJsZWRfYWN0aW9ucyA9IHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnNcclxuXHRhY3Rpb25zID0gXy5zb3J0QnkoXy52YWx1ZXMob2JqLmFjdGlvbnMpICwgJ3NvcnQnKTtcclxuXHJcblx0Xy5lYWNoIGFjdGlvbnMsIChhY3Rpb24pLT5cclxuXHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBhY3Rpb24ub24gPT0gXCJyZWNvcmRcIiAmJiBhY3Rpb24ubmFtZSAhPSAnc3RhbmRhcmRfZWRpdCdcclxuXHRcdFx0YWN0aW9uLm9uID0gJ3JlY29yZF9tb3JlJ1xyXG5cclxuXHRhY3Rpb25zID0gXy5maWx0ZXIgYWN0aW9ucywgKGFjdGlvbiktPlxyXG5cdFx0cmV0dXJuIF8uaW5kZXhPZihkaXNhYmxlZF9hY3Rpb25zLCBhY3Rpb24ubmFtZSkgPCAwXHJcblxyXG5cdHJldHVybiBhY3Rpb25zXHJcblxyXG4vLy9cclxuXHTov5Tlm57lvZPliY3nlKjmiLfmnInmnYPpmZDorr/pl67nmoTmiYDmnIlsaXN0X3ZpZXfvvIzljIXmi6zliIbkuqvnmoTvvIznlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTvvIjpmaTpnZ5vd25lcuWPmOS6hu+8ie+8jOS7peWPium7mOiupOeahOWFtuS7luinhuWbvlxyXG5cdOazqOaEj0NyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mmK/kuI3kvJrmnInnlKjmiLfoh6rlrprkuYnpnZ7liIbkuqvnmoTop4blm77nmoTvvIzmiYDku6VDcmVhdG9yLmdldFBlcm1pc3Npb25z5Ye95pWw5Lit5ou/5Yiw55qE57uT5p6c5LiN5YWo77yM5bm25LiN5piv5b2T5YmN55So5oi36IO955yL5Yiw5omA5pyJ6KeG5Zu+XHJcbi8vL1xyXG5DcmVhdG9yLmdldExpc3RWaWV3cyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cclxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHJcblx0aWYgIW9iamVjdFxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdGRpc2FibGVkX2xpc3Rfdmlld3MgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLmRpc2FibGVkX2xpc3Rfdmlld3MgfHwgW11cclxuXHJcblx0bGlzdF92aWV3cyA9IFtdXHJcblxyXG5cdGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpXHJcblxyXG5cdF8uZWFjaCBvYmplY3QubGlzdF92aWV3cywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxyXG5cdFx0aWYgaXNNb2JpbGUgYW5kIGl0ZW0udHlwZSA9PSBcImNhbGVuZGFyXCJcclxuXHRcdFx0IyDmiYvmnLrkuIrlhYjkuI3mmL7npLrml6Xljobop4blm75cclxuXHRcdFx0cmV0dXJuXHJcblx0XHRpZiBpdGVtX25hbWUgIT0gXCJkZWZhdWx0XCJcclxuXHRcdFx0aWYgXy5pbmRleE9mKGRpc2FibGVkX2xpc3Rfdmlld3MsIGl0ZW1fbmFtZSkgPCAwIHx8IGl0ZW0ub3duZXIgPT0gdXNlcklkXHJcblx0XHRcdFx0bGlzdF92aWV3cy5wdXNoIGl0ZW1cclxuXHJcblx0cmV0dXJuIGxpc3Rfdmlld3NcclxuXHJcbiMg5YmN5Y+w55CG6K665LiK5LiN5bqU6K+l6LCD55So6K+l5Ye95pWw77yM5Zug5Li65a2X5q6155qE5p2D6ZmQ6YO95ZyoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpLmZpZWxkc+eahOebuOWFs+WxnuaAp+S4reacieagh+ivhuS6hlxyXG5DcmVhdG9yLmdldEZpZWxkcyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cclxuXHRmaWVsZHNOYW1lID0gQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lKG9iamVjdF9uYW1lKVxyXG5cdHVucmVhZGFibGVfZmllbGRzID0gIENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkudW5yZWFkYWJsZV9maWVsZHNcclxuXHRyZXR1cm4gXy5kaWZmZXJlbmNlKGZpZWxkc05hbWUsIHVucmVhZGFibGVfZmllbGRzKVxyXG5cclxuQ3JlYXRvci5pc2xvYWRpbmcgPSAoKS0+XHJcblx0cmV0dXJuICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZC5nZXQoKVxyXG5cclxuQ3JlYXRvci5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IChzdHIpLT5cclxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpXHJcblxyXG4jIOiuoeeul2ZpZWxkc+ebuOWFs+WHveaVsFxyXG4jIFNUQVJUXHJcbkNyZWF0b3IuZ2V0RGlzYWJsZWRGaWVsZHMgPSAoc2NoZW1hKS0+XHJcblx0ZmllbGRzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQsIGZpZWxkTmFtZSkgLT5cclxuXHRcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0uZGlzYWJsZWQgYW5kICFmaWVsZC5hdXRvZm9ybS5vbWl0IGFuZCBmaWVsZE5hbWVcclxuXHQpXHJcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcclxuXHRyZXR1cm4gZmllbGRzXHJcblxyXG5DcmVhdG9yLmdldEhpZGRlbkZpZWxkcyA9IChzY2hlbWEpLT5cclxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxyXG5cdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS50eXBlID09IFwiaGlkZGVuXCIgYW5kICFmaWVsZC5hdXRvZm9ybS5vbWl0IGFuZCBmaWVsZE5hbWVcclxuXHQpXHJcblx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcclxuXHRyZXR1cm4gZmllbGRzXHJcblxyXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhOb0dyb3VwID0gKHNjaGVtYSktPlxyXG5cdGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkLCBmaWVsZE5hbWUpIC0+XHJcblx0XHRyZXR1cm4gKCFmaWVsZC5hdXRvZm9ybSBvciAhZmllbGQuYXV0b2Zvcm0uZ3JvdXAgb3IgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT0gXCItXCIpIGFuZCAoIWZpZWxkLmF1dG9mb3JtIG9yIGZpZWxkLmF1dG9mb3JtLnR5cGUgIT0gXCJoaWRkZW5cIikgYW5kIGZpZWxkTmFtZVxyXG5cdClcclxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxyXG5cdHJldHVybiBmaWVsZHNcclxuXHJcbkNyZWF0b3IuZ2V0U29ydGVkRmllbGRHcm91cE5hbWVzID0gKHNjaGVtYSktPlxyXG5cdG5hbWVzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQpIC0+XHJcbiBcdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS5ncm91cCAhPSBcIi1cIiBhbmQgZmllbGQuYXV0b2Zvcm0uZ3JvdXBcclxuXHQpXHJcblx0bmFtZXMgPSBfLmNvbXBhY3QobmFtZXMpXHJcblx0bmFtZXMgPSBfLnVuaXF1ZShuYW1lcylcclxuXHRyZXR1cm4gbmFtZXNcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRzRm9yR3JvdXAgPSAoc2NoZW1hLCBncm91cE5hbWUpIC0+XHJcbiAgXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxyXG4gICAgXHRyZXR1cm4gZmllbGQuYXV0b2Zvcm0gYW5kIGZpZWxkLmF1dG9mb3JtLmdyb3VwID09IGdyb3VwTmFtZSBhbmQgZmllbGQuYXV0b2Zvcm0udHlwZSAhPSBcImhpZGRlblwiIGFuZCBmaWVsZE5hbWVcclxuICBcdClcclxuICBcdGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpXHJcbiAgXHRyZXR1cm4gZmllbGRzXHJcblxyXG5DcmVhdG9yLmdldEZpZWxkc1dpdGhvdXRPbWl0ID0gKHNjaGVtYSwga2V5cykgLT5cclxuXHRrZXlzID0gXy5tYXAoa2V5cywgKGtleSkgLT5cclxuXHRcdGZpZWxkID0gXy5waWNrKHNjaGVtYSwga2V5KVxyXG5cdFx0aWYgZmllbGRba2V5XS5hdXRvZm9ybT8ub21pdFxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIGtleVxyXG5cdClcclxuXHRrZXlzID0gXy5jb21wYWN0KGtleXMpXHJcblx0cmV0dXJuIGtleXNcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRzSW5GaXJzdExldmVsID0gKGZpcnN0TGV2ZWxLZXlzLCBrZXlzKSAtPlxyXG5cdGtleXMgPSBfLm1hcChrZXlzLCAoa2V5KSAtPlxyXG5cdFx0aWYgXy5pbmRleE9mKGZpcnN0TGV2ZWxLZXlzLCBrZXkpID4gLTFcclxuXHRcdFx0cmV0dXJuIGtleVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHQpXHJcblx0a2V5cyA9IF8uY29tcGFjdChrZXlzKVxyXG5cdHJldHVybiBrZXlzXHJcblxyXG5DcmVhdG9yLmdldEZpZWxkc0ZvclJlb3JkZXIgPSAoc2NoZW1hLCBrZXlzLCBpc1NpbmdsZSkgLT5cclxuXHRmaWVsZHMgPSBbXVxyXG5cdGkgPSAwXHJcblx0X2tleXMgPSBfLmZpbHRlcihrZXlzLCAoa2V5KS0+XHJcblx0XHRyZXR1cm4gIWtleS5lbmRzV2l0aCgnX2VuZExpbmUnKVxyXG5cdCk7XHJcblx0d2hpbGUgaSA8IF9rZXlzLmxlbmd0aFxyXG5cdFx0c2NfMSA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2ldKVxyXG5cdFx0c2NfMiA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2krMV0pXHJcblxyXG5cdFx0aXNfd2lkZV8xID0gZmFsc2VcclxuXHRcdGlzX3dpZGVfMiA9IGZhbHNlXHJcblxyXG4jXHRcdGlzX3JhbmdlXzEgPSBmYWxzZVxyXG4jXHRcdGlzX3JhbmdlXzIgPSBmYWxzZVxyXG5cclxuXHRcdF8uZWFjaCBzY18xLCAodmFsdWUpIC0+XHJcblx0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc193aWRlIHx8IHZhbHVlLmF1dG9mb3JtPy50eXBlID09IFwidGFibGVcIlxyXG5cdFx0XHRcdGlzX3dpZGVfMSA9IHRydWVcclxuXHJcbiNcdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfcmFuZ2VcclxuI1x0XHRcdFx0aXNfcmFuZ2VfMSA9IHRydWVcclxuXHJcblx0XHRfLmVhY2ggc2NfMiwgKHZhbHVlKSAtPlxyXG5cdFx0XHRpZiB2YWx1ZS5hdXRvZm9ybT8uaXNfd2lkZSB8fCB2YWx1ZS5hdXRvZm9ybT8udHlwZSA9PSBcInRhYmxlXCJcclxuXHRcdFx0XHRpc193aWRlXzIgPSB0cnVlXHJcblxyXG4jXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3JhbmdlXHJcbiNcdFx0XHRcdGlzX3JhbmdlXzIgPSB0cnVlXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdGlzX3dpZGVfMSA9IHRydWVcclxuXHRcdFx0aXNfd2lkZV8yID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGlzU2luZ2xlXHJcblx0XHRcdGZpZWxkcy5wdXNoIF9rZXlzLnNsaWNlKGksIGkrMSlcclxuXHRcdFx0aSArPSAxXHJcblx0XHRlbHNlXHJcbiNcdFx0XHRpZiAhaXNfcmFuZ2VfMSAmJiBpc19yYW5nZV8yXHJcbiNcdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcclxuI1x0XHRcdFx0Y2hpbGRLZXlzLnB1c2ggdW5kZWZpbmVkXHJcbiNcdFx0XHRcdGZpZWxkcy5wdXNoIGNoaWxkS2V5c1xyXG4jXHRcdFx0XHRpICs9IDFcclxuI1x0XHRcdGVsc2VcclxuXHRcdFx0aWYgaXNfd2lkZV8xXHJcblx0XHRcdFx0ZmllbGRzLnB1c2ggX2tleXMuc2xpY2UoaSwgaSsxKVxyXG5cdFx0XHRcdGkgKz0gMVxyXG5cdFx0XHRlbHNlIGlmICFpc193aWRlXzEgYW5kIGlzX3dpZGVfMlxyXG5cdFx0XHRcdGNoaWxkS2V5cyA9IF9rZXlzLnNsaWNlKGksIGkrMSlcclxuXHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcclxuXHRcdFx0XHRmaWVsZHMucHVzaCBjaGlsZEtleXNcclxuXHRcdFx0XHRpICs9IDFcclxuXHRcdFx0ZWxzZSBpZiAhaXNfd2lkZV8xIGFuZCAhaXNfd2lkZV8yXHJcblx0XHRcdFx0Y2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSsxKVxyXG5cdFx0XHRcdGlmIF9rZXlzW2krMV1cclxuXHRcdFx0XHRcdGNoaWxkS2V5cy5wdXNoIF9rZXlzW2krMV1cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcclxuXHRcdFx0XHRmaWVsZHMucHVzaCBjaGlsZEtleXNcclxuXHRcdFx0XHRpICs9IDJcclxuXHJcblx0cmV0dXJuIGZpZWxkc1xyXG5cclxuQ3JlYXRvci5pc0ZpbHRlclZhbHVlRW1wdHkgPSAodikgLT5cclxuXHRyZXR1cm4gdHlwZW9mIHYgPT0gXCJ1bmRlZmluZWRcIiB8fCB2ID09IG51bGwgfHwgTnVtYmVyLmlzTmFOKHYpIHx8IHYubGVuZ3RoID09IDBcclxuXHJcbiMgRU5EXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRDcmVhdG9yLmdldEFsbFJlbGF0ZWRPYmplY3RzID0gKG9iamVjdF9uYW1lKS0+XHJcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IFtdXHJcblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cclxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSktPlxyXG5cdFx0XHRcdGlmIHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lXHJcblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoIHJlbGF0ZWRfb2JqZWN0X25hbWVcclxuXHJcblx0XHRpZiBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZW5hYmxlX2ZpbGVzXHJcblx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzLnB1c2ggXCJjbXNfZmlsZXNcIlxyXG5cclxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcyIsIkNyZWF0b3IuZ2V0U2NoZW1hID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuc2NoZW1hIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBhcHBfaWQpIHtcbiAgdmFyIGxpc3RfdmlldywgbGlzdF92aWV3X2lkO1xuICBpZiAoIWFwcF9pZCkge1xuICAgIGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICB9XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgbGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbCk7XG4gIGxpc3Rfdmlld19pZCA9IGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Ll9pZCA6IHZvaWQgMDtcbiAgaWYgKHJlY29yZF9pZCkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkX2lkKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwibWVldGluZ1wiKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCk7XG4gICAgfVxuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJvdXRlclVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkge1xuICB2YXIgbGlzdF92aWV3LCBsaXN0X3ZpZXdfaWQ7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKTtcbiAgbGlzdF92aWV3X2lkID0gbGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcuX2lkIDogdm9pZCAwO1xuICBpZiAocmVjb3JkX2lkKSB7XG4gICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkX2lkO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJtZWV0aW5nXCIpIHtcbiAgICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZDtcbiAgICB9XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIHtcbiAgdmFyIHVybDtcbiAgdXJsID0gQ3JlYXRvci5nZXRMaXN0Vmlld1JlbGF0aXZlVXJsKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCk7XG4gIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKHVybCk7XG59O1xuXG5DcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIHtcbiAgaWYgKGxpc3Rfdmlld19pZCA9PT0gXCJjYWxlbmRhclwiKSB7XG4gICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0U3dpdGNoTGlzdFVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkge1xuICBpZiAobGlzdF92aWV3X2lkKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgbGlzdF92aWV3X2lkICsgXCIvbGlzdFwiKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvbGlzdC9zd2l0Y2hcIik7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdFVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIHJlY29yZF9pZCwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyByZWNvcmRfaWQgKyBcIi9cIiArIHJlbGF0ZWRfb2JqZWN0X25hbWUgKyBcIi9ncmlkXCIpO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgaXNfZGVlcCwgaXNfc2tpcF9oaWRlLCBpc19yZWxhdGVkKSB7XG4gIHZhciBfb2JqZWN0LCBfb3B0aW9ucywgZmllbGRzLCBpY29uLCByZWxhdGVkT2JqZWN0cztcbiAgX29wdGlvbnMgPSBbXTtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfb3B0aW9ucztcbiAgfVxuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgaWNvbiA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMDtcbiAgXy5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZiwgaykge1xuICAgIGlmIChpc19za2lwX2hpZGUgJiYgZi5oaWRkZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGYudHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICBsYWJlbDogXCJcIiArIChmLmxhYmVsIHx8IGspLFxuICAgICAgICB2YWx1ZTogXCJcIiArIGssXG4gICAgICAgIGljb246IGljb25cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgIGxhYmVsOiBmLmxhYmVsIHx8IGssXG4gICAgICAgIHZhbHVlOiBrLFxuICAgICAgICBpY29uOiBpY29uXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBpZiAoaXNfZGVlcCkge1xuICAgIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICAgIHZhciByX29iamVjdDtcbiAgICAgIGlmIChpc19za2lwX2hpZGUgJiYgZi5oaWRkZW4pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKChmLnR5cGUgPT09IFwibG9va3VwXCIgfHwgZi50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikgJiYgZi5yZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhmLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgcl9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChmLnJlZmVyZW5jZV90byk7XG4gICAgICAgIGlmIChyX29iamVjdCkge1xuICAgICAgICAgIHJldHVybiBfLmZvckVhY2gocl9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihmMiwgazIpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgbGFiZWw6IChmLmxhYmVsIHx8IGspICsgXCI9PlwiICsgKGYyLmxhYmVsIHx8IGsyKSxcbiAgICAgICAgICAgICAgdmFsdWU6IGsgKyBcIi5cIiArIGsyLFxuICAgICAgICAgICAgICBpY29uOiByX29iamVjdCAhPSBudWxsID8gcl9vYmplY3QuaWNvbiA6IHZvaWQgMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpZiAoaXNfcmVsYXRlZCkge1xuICAgIHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSk7XG4gICAgXy5lYWNoKHJlbGF0ZWRPYmplY3RzLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihfcmVsYXRlZE9iamVjdCkge1xuICAgICAgICB2YXIgcmVsYXRlZE9iamVjdCwgcmVsYXRlZE9wdGlvbnM7XG4gICAgICAgIHJlbGF0ZWRPcHRpb25zID0gQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMoX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICByZWxhdGVkT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUpO1xuICAgICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRPcHRpb25zLCBmdW5jdGlvbihyZWxhdGVkT3B0aW9uKSB7XG4gICAgICAgICAgaWYgKF9yZWxhdGVkT2JqZWN0LmZvcmVpZ25fa2V5ICE9PSByZWxhdGVkT3B0aW9uLnZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiAocmVsYXRlZE9iamVjdC5sYWJlbCB8fCByZWxhdGVkT2JqZWN0Lm5hbWUpICsgXCI9PlwiICsgcmVsYXRlZE9wdGlvbi5sYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHJlbGF0ZWRPYmplY3QubmFtZSArIFwiLlwiICsgcmVsYXRlZE9wdGlvbi52YWx1ZSxcbiAgICAgICAgICAgICAgaWNvbjogcmVsYXRlZE9iamVjdCAhPSBudWxsID8gcmVsYXRlZE9iamVjdC5pY29uIDogdm9pZCAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH1cbiAgcmV0dXJuIF9vcHRpb25zO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RGaWx0ZXJGaWVsZE9wdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgX29wdGlvbnMsIGZpZWxkcywgaWNvbiwgcGVybWlzc2lvbl9maWVsZHM7XG4gIF9vcHRpb25zID0gW107XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gX29wdGlvbnM7XG4gIH1cbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpO1xuICBpY29uID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwO1xuICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgaWYgKCFfLmluY2x1ZGUoW1wiZ3JpZFwiLCBcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJhdmF0YXJcIiwgXCJpbWFnZVwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKSAmJiAhZi5oaWRkZW4pIHtcbiAgICAgIGlmICghL1xcdytcXC4vLnRlc3QoaykgJiYgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICBsYWJlbDogZi5sYWJlbCB8fCBrLFxuICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgIGljb246IGljb25cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIF9vcHRpb25zO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZE9wdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgX29wdGlvbnMsIGZpZWxkcywgaWNvbiwgcGVybWlzc2lvbl9maWVsZHM7XG4gIF9vcHRpb25zID0gW107XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gX29wdGlvbnM7XG4gIH1cbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpO1xuICBpY29uID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwO1xuICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgaWYgKCFfLmluY2x1ZGUoW1wiZ3JpZFwiLCBcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIiwgXCJhdmF0YXJcIiwgXCJpbWFnZVwiLCBcIm1hcmtkb3duXCIsIFwiaHRtbFwiXSwgZi50eXBlKSkge1xuICAgICAgaWYgKCEvXFx3K1xcLi8udGVzdChrKSAmJiBfLmluZGV4T2YocGVybWlzc2lvbl9maWVsZHMsIGspID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiBmLmxhYmVsIHx8IGssXG4gICAgICAgICAgdmFsdWU6IGssXG4gICAgICAgICAgaWNvbjogaWNvblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gX29wdGlvbnM7XG59O1xuXG5cbi8qXG5maWx0ZXJzOiDopoHovazmjaLnmoRmaWx0ZXJzXG5maWVsZHM6IOWvueixoeWtl+autVxuZmlsdGVyX2ZpZWxkczog6buY6K6k6L+H5ruk5a2X5q6177yM5pSv5oyB5a2X56ym5Liy5pWw57uE5ZKM5a+56LGh5pWw57uE5Lik56eN5qC85byP77yM5aaCOlsnZmlsZWRfbmFtZTEnLCdmaWxlZF9uYW1lMiddLFt7ZmllbGQ6J2ZpbGVkX25hbWUxJyxyZXF1aXJlZDp0cnVlfV1cbuWkhOeQhumAu+i+kTog5oqKZmlsdGVyc+S4reWtmOWcqOS6jmZpbHRlcl9maWVsZHPnmoTov4fmu6TmnaHku7blop7liqDmr4/pobnnmoRpc19kZWZhdWx044CBaXNfcmVxdWlyZWTlsZ7mgKfvvIzkuI3lrZjlnKjkuo5maWx0ZXJfZmllbGRz55qE6L+H5ruk5p2h5Lu25a+55bqU55qE56e76Zmk5q+P6aG555qE55u45YWz5bGe5oCnXG7ov5Tlm57nu5Pmnpw6IOWkhOeQhuWQjueahGZpbHRlcnNcbiAqL1xuXG5DcmVhdG9yLmdldEZpbHRlcnNXaXRoRmlsdGVyRmllbGRzID0gZnVuY3Rpb24oZmlsdGVycywgZmllbGRzLCBmaWx0ZXJfZmllbGRzKSB7XG4gIGlmICghZmlsdGVycykge1xuICAgIGZpbHRlcnMgPSBbXTtcbiAgfVxuICBpZiAoIWZpbHRlcl9maWVsZHMpIHtcbiAgICBmaWx0ZXJfZmllbGRzID0gW107XG4gIH1cbiAgaWYgKGZpbHRlcl9maWVsZHMgIT0gbnVsbCA/IGZpbHRlcl9maWVsZHMubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgZmlsdGVyX2ZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uKG4pIHtcbiAgICAgIGlmIChfLmlzU3RyaW5nKG4pKSB7XG4gICAgICAgIG4gPSB7XG4gICAgICAgICAgZmllbGQ6IG4sXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoZmllbGRzW24uZmllbGRdICYmICFfLmZpbmRXaGVyZShmaWx0ZXJzLCB7XG4gICAgICAgIGZpZWxkOiBuLmZpZWxkXG4gICAgICB9KSkge1xuICAgICAgICByZXR1cm4gZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICBmaWVsZDogbi5maWVsZCxcbiAgICAgICAgICBpc19kZWZhdWx0OiB0cnVlLFxuICAgICAgICAgIGlzX3JlcXVpcmVkOiBuLnJlcXVpcmVkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbihmaWx0ZXJJdGVtKSB7XG4gICAgdmFyIG1hdGNoRmllbGQ7XG4gICAgbWF0Y2hGaWVsZCA9IGZpbHRlcl9maWVsZHMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbiA9PT0gZmlsdGVySXRlbS5maWVsZCB8fCBuLmZpZWxkID09PSBmaWx0ZXJJdGVtLmZpZWxkO1xuICAgIH0pO1xuICAgIGlmIChfLmlzU3RyaW5nKG1hdGNoRmllbGQpKSB7XG4gICAgICBtYXRjaEZpZWxkID0ge1xuICAgICAgICBmaWVsZDogbWF0Y2hGaWVsZCxcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAobWF0Y2hGaWVsZCkge1xuICAgICAgZmlsdGVySXRlbS5pc19kZWZhdWx0ID0gdHJ1ZTtcbiAgICAgIHJldHVybiBmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkID0gbWF0Y2hGaWVsZC5yZXF1aXJlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGZpbHRlckl0ZW0uaXNfZGVmYXVsdDtcbiAgICAgIHJldHVybiBkZWxldGUgZmlsdGVySXRlbS5pc19yZXF1aXJlZDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmlsdGVycztcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKSB7XG4gIHZhciBjb2xsZWN0aW9uLCByZWNvcmQsIHJlZiwgcmVmMSwgcmVmMjtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAoIXJlY29yZF9pZCkge1xuICAgIHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikgJiYgcmVjb3JkX2lkID09PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSkge1xuICAgICAgaWYgKChyZWYgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpKSAhPSBudWxsID8gcmVmLnJlY29yZCA6IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gKHJlZjEgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLnJlY29yZCkgIT0gbnVsbCA/IHJlZjIuZ2V0KCkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpO1xuICAgIH1cbiAgfVxuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKTtcbiAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICByZWNvcmQgPSBjb2xsZWN0aW9uLmZpbmRPbmUocmVjb3JkX2lkKTtcbiAgICByZXR1cm4gcmVjb3JkO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEFwcCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwLCByZWYsIHJlZjE7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgYXBwID0gQ3JlYXRvci5BcHBzW2FwcF9pZF07XG4gIGlmICgocmVmID0gQ3JlYXRvci5kZXBzKSAhPSBudWxsKSB7XG4gICAgaWYgKChyZWYxID0gcmVmLmFwcCkgIT0gbnVsbCkge1xuICAgICAgcmVmMS5kZXBlbmQoKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFwcDtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwRGFzaGJvYXJkID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIGRhc2hib2FyZDtcbiAgYXBwID0gQ3JlYXRvci5nZXRBcHAoYXBwX2lkKTtcbiAgZGFzaGJvYXJkID0gbnVsbDtcbiAgXy5lYWNoKENyZWF0b3IuRGFzaGJvYXJkcywgZnVuY3Rpb24odiwgaykge1xuICAgIHZhciByZWY7XG4gICAgaWYgKCgocmVmID0gdi5hcHBzKSAhPSBudWxsID8gcmVmLmluZGV4T2YoYXBwLl9pZCkgOiB2b2lkIDApID4gLTEpIHtcbiAgICAgIHJldHVybiBkYXNoYm9hcmQgPSB2O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkYXNoYm9hcmQ7XG59O1xuXG5DcmVhdG9yLmdldEFwcERhc2hib2FyZENvbXBvbmVudCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICByZXR1cm4gUmVhY3RTdGVlZG9zLnBsdWdpbkNvbXBvbmVudFNlbGVjdG9yKFJlYWN0U3RlZWRvcy5zdG9yZS5nZXRTdGF0ZSgpLCBcIkRhc2hib2FyZFwiLCBhcHAuX2lkKTtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwT2JqZWN0TmFtZXMgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgdmFyIGFwcCwgYXBwT2JqZWN0cywgaXNNb2JpbGUsIG9iamVjdHM7XG4gIGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZCk7XG4gIGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpO1xuICBhcHBPYmplY3RzID0gaXNNb2JpbGUgPyBhcHAubW9iaWxlX29iamVjdHMgOiBhcHAub2JqZWN0cztcbiAgb2JqZWN0cyA9IFtdO1xuICBpZiAoYXBwKSB7XG4gICAgXy5lYWNoKGFwcE9iamVjdHMsIGZ1bmN0aW9uKHYpIHtcbiAgICAgIHZhciBvYmo7XG4gICAgICBvYmogPSBDcmVhdG9yLmdldE9iamVjdCh2KTtcbiAgICAgIGlmICgob2JqICE9IG51bGwgPyBvYmoucGVybWlzc2lvbnMuZ2V0KCkuYWxsb3dSZWFkIDogdm9pZCAwKSAmJiAhb2JqLmhpZGRlbikge1xuICAgICAgICByZXR1cm4gb2JqZWN0cy5wdXNoKHYpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3RzO1xufTtcblxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwcyA9IGZ1bmN0aW9uKGluY2x1ZGVBZG1pbikge1xuICByZXR1cm4gUmVhY3RTdGVlZG9zLnZpc2libGVBcHBzU2VsZWN0b3IoUmVhY3RTdGVlZG9zLnN0b3JlLmdldFN0YXRlKCksIGluY2x1ZGVBZG1pbik7XG59O1xuXG5DcmVhdG9yLmdldFZpc2libGVBcHBzT2JqZWN0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXBwcywgb2JqZWN0cywgdmlzaWJsZU9iamVjdE5hbWVzO1xuICBhcHBzID0gQ3JlYXRvci5nZXRWaXNpYmxlQXBwcygpO1xuICB2aXNpYmxlT2JqZWN0TmFtZXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhhcHBzLCAnb2JqZWN0cycpKTtcbiAgb2JqZWN0cyA9IF8uZmlsdGVyKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKHZpc2libGVPYmplY3ROYW1lcy5pbmRleE9mKG9iai5uYW1lKSA8IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICFvYmouaGlkZGVuO1xuICAgIH1cbiAgfSk7XG4gIG9iamVjdHMgPSBvYmplY3RzLnNvcnQoQ3JlYXRvci5zb3J0aW5nTWV0aG9kLmJpbmQoe1xuICAgIGtleTogXCJsYWJlbFwiXG4gIH0pKTtcbiAgb2JqZWN0cyA9IF8ucGx1Y2sob2JqZWN0cywgJ25hbWUnKTtcbiAgcmV0dXJuIF8udW5pcShvYmplY3RzKTtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwc09iamVjdHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG9iamVjdHMsIHRlbXBPYmplY3RzO1xuICBvYmplY3RzID0gW107XG4gIHRlbXBPYmplY3RzID0gW107XG4gIF8uZm9yRWFjaChDcmVhdG9yLkFwcHMsIGZ1bmN0aW9uKGFwcCkge1xuICAgIHRlbXBPYmplY3RzID0gXy5maWx0ZXIoYXBwLm9iamVjdHMsIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuICFvYmouaGlkZGVuO1xuICAgIH0pO1xuICAgIHJldHVybiBvYmplY3RzID0gb2JqZWN0cy5jb25jYXQodGVtcE9iamVjdHMpO1xuICB9KTtcbiAgcmV0dXJuIF8udW5pcShvYmplY3RzKTtcbn07XG5cbkNyZWF0b3IudmFsaWRhdGVGaWx0ZXJzID0gZnVuY3Rpb24oZmlsdGVycywgbG9naWMpIHtcbiAgdmFyIGUsIGVycm9yTXNnLCBmaWx0ZXJfaXRlbXMsIGZpbHRlcl9sZW5ndGgsIGZsYWcsIGluZGV4LCB3b3JkO1xuICBmaWx0ZXJfaXRlbXMgPSBfLm1hcChmaWx0ZXJzLCBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoXy5pc0VtcHR5KG9iaikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gIH0pO1xuICBmaWx0ZXJfaXRlbXMgPSBfLmNvbXBhY3QoZmlsdGVyX2l0ZW1zKTtcbiAgZXJyb3JNc2cgPSBcIlwiO1xuICBmaWx0ZXJfbGVuZ3RoID0gZmlsdGVyX2l0ZW1zLmxlbmd0aDtcbiAgaWYgKGxvZ2ljKSB7XG4gICAgbG9naWMgPSBsb2dpYy5yZXBsYWNlKC9cXG4vZywgXCJcIikucmVwbGFjZSgvXFxzKy9nLCBcIiBcIik7XG4gICAgaWYgKC9bLl9cXC0hK10rL2lnLnRlc3QobG9naWMpKSB7XG4gICAgICBlcnJvck1zZyA9IFwi5ZCr5pyJ54m55q6K5a2X56ym44CCXCI7XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIGluZGV4ID0gbG9naWMubWF0Y2goL1xcZCsvaWcpO1xuICAgICAgaWYgKCFpbmRleCkge1xuICAgICAgICBlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleC5mb3JFYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICBpZiAoaSA8IDEgfHwgaSA+IGZpbHRlcl9sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5p2h5Lu25byV55So5LqG5pyq5a6a5LmJ55qE562b6YCJ5Zmo77yaXCIgKyBpICsgXCLjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmbGFnID0gMTtcbiAgICAgICAgd2hpbGUgKGZsYWcgPD0gZmlsdGVyX2xlbmd0aCkge1xuICAgICAgICAgIGlmICghaW5kZXguaW5jbHVkZXMoXCJcIiArIGZsYWcpKSB7XG4gICAgICAgICAgICBlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZsYWcrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWVycm9yTXNnKSB7XG4gICAgICB3b3JkID0gbG9naWMubWF0Y2goL1thLXpBLVpdKy9pZyk7XG4gICAgICBpZiAod29yZCkge1xuICAgICAgICB3b3JkLmZvckVhY2goZnVuY3Rpb24odykge1xuICAgICAgICAgIGlmICghL14oYW5kfG9yKSQvaWcudGVzdCh3KSkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yTXNnID0gXCLmo4Dmn6XmgqjnmoTpq5jnuqfnrZvpgInmnaHku7bkuK3nmoTmi7zlhpnjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWVycm9yTXNnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBDcmVhdG9yW1wiZXZhbFwiXShsb2dpYy5yZXBsYWNlKC9hbmQvaWcsIFwiJiZcIikucmVwbGFjZSgvb3IvaWcsIFwifHxcIikpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5Lit5ZCr5pyJ54m55q6K5a2X56ymXCI7XG4gICAgICB9XG4gICAgICBpZiAoLyhBTkQpW14oKV0rKE9SKS9pZy50ZXN0KGxvZ2ljKSB8fCAvKE9SKVteKCldKyhBTkQpL2lnLnRlc3QobG9naWMpKSB7XG4gICAgICAgIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajlv4XpobvlnKjov57nu63mgKfnmoQgQU5EIOWSjCBPUiDooajovr7lvI/liY3lkI7kvb/nlKjmi6zlj7fjgIJcIjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKGVycm9yTXNnKSB7XG4gICAgY29uc29sZS5sb2coXCJlcnJvclwiLCBlcnJvck1zZyk7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdG9hc3RyLmVycm9yKGVycm9yTXNnKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuICovXG5cbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvTW9uZ28gPSBmdW5jdGlvbihmaWx0ZXJzLCBvcHRpb25zKSB7XG4gIHZhciBzZWxlY3RvcjtcbiAgaWYgKCEoZmlsdGVycyAhPSBudWxsID8gZmlsdGVycy5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghKGZpbHRlcnNbMF0gaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICBmaWx0ZXJzID0gXy5tYXAoZmlsdGVycywgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gW29iai5maWVsZCwgb2JqLm9wZXJhdGlvbiwgb2JqLnZhbHVlXTtcbiAgICB9KTtcbiAgfVxuICBzZWxlY3RvciA9IFtdO1xuICBfLmVhY2goZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIGZpZWxkLCBvcHRpb24sIHJlZywgc3ViX3NlbGVjdG9yLCB2YWx1ZTtcbiAgICBmaWVsZCA9IGZpbHRlclswXTtcbiAgICBvcHRpb24gPSBmaWx0ZXJbMV07XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgbnVsbCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHN1Yl9zZWxlY3RvciA9IHt9O1xuICAgIHN1Yl9zZWxlY3RvcltmaWVsZF0gPSB7fTtcbiAgICBpZiAob3B0aW9uID09PSBcIj1cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRlcVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjw+XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbmVcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI+XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI+PVwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGd0ZVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjxcIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdFwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjw9XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRlXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwic3RhcnRzd2l0aFwiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKFwiXlwiICsgdmFsdWUsIFwiaVwiKTtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWc7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiY29udGFpbnNcIikge1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cCh2YWx1ZSwgXCJpXCIpO1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJub3Rjb250YWluc1wiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKFwiXigoPyFcIiArIHZhbHVlICsgXCIpLikqJFwiLCBcImlcIik7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnO1xuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3IucHVzaChzdWJfc2VsZWN0b3IpO1xuICB9KTtcbiAgcmV0dXJuIHNlbGVjdG9yO1xufTtcblxuQ3JlYXRvci5pc0JldHdlZW5GaWx0ZXJPcGVyYXRpb24gPSBmdW5jdGlvbihvcGVyYXRpb24pIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIG9wZXJhdGlvbiA9PT0gXCJiZXR3ZWVuXCIgfHwgISEoKHJlZiA9IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKHRydWUpKSAhPSBudWxsID8gcmVmW29wZXJhdGlvbl0gOiB2b2lkIDApO1xufTtcblxuXG4vKlxub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcblx0ZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuICovXG5cbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvRGV2ID0gZnVuY3Rpb24oZmlsdGVycywgb2JqZWN0X25hbWUsIG9wdGlvbnMpIHtcbiAgdmFyIGxvZ2ljVGVtcEZpbHRlcnMsIHNlbGVjdG9yLCBzdGVlZG9zRmlsdGVycztcbiAgc3RlZWRvc0ZpbHRlcnMgPSByZXF1aXJlKFwiQHN0ZWVkb3MvZmlsdGVyc1wiKTtcbiAgaWYgKCFmaWx0ZXJzLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5pc19sb2dpY19vciA6IHZvaWQgMCkge1xuICAgIGxvZ2ljVGVtcEZpbHRlcnMgPSBbXTtcbiAgICBmaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24obikge1xuICAgICAgbG9naWNUZW1wRmlsdGVycy5wdXNoKG4pO1xuICAgICAgcmV0dXJuIGxvZ2ljVGVtcEZpbHRlcnMucHVzaChcIm9yXCIpO1xuICAgIH0pO1xuICAgIGxvZ2ljVGVtcEZpbHRlcnMucG9wKCk7XG4gICAgZmlsdGVycyA9IGxvZ2ljVGVtcEZpbHRlcnM7XG4gIH1cbiAgc2VsZWN0b3IgPSBzdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9EZXYoZmlsdGVycywgQ3JlYXRvci5VU0VSX0NPTlRFWFQpO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuICovXG5cbkNyZWF0b3IuZm9ybWF0TG9naWNGaWx0ZXJzVG9EZXYgPSBmdW5jdGlvbihmaWx0ZXJzLCBmaWx0ZXJfbG9naWMsIG9wdGlvbnMpIHtcbiAgdmFyIGZvcm1hdF9sb2dpYztcbiAgZm9ybWF0X2xvZ2ljID0gZmlsdGVyX2xvZ2ljLnJlcGxhY2UoL1xcKFxccysvaWcsIFwiKFwiKS5yZXBsYWNlKC9cXHMrXFwpL2lnLCBcIilcIikucmVwbGFjZSgvXFwoL2csIFwiW1wiKS5yZXBsYWNlKC9cXCkvZywgXCJdXCIpLnJlcGxhY2UoL1xccysvZywgXCIsXCIpLnJlcGxhY2UoLyhhbmR8b3IpL2lnLCBcIickMSdcIik7XG4gIGZvcm1hdF9sb2dpYyA9IGZvcm1hdF9sb2dpYy5yZXBsYWNlKC8oXFxkKSsvaWcsIGZ1bmN0aW9uKHgpIHtcbiAgICB2YXIgX2YsIGZpZWxkLCBvcHRpb24sIHN1Yl9zZWxlY3RvciwgdmFsdWU7XG4gICAgX2YgPSBmaWx0ZXJzW3ggLSAxXTtcbiAgICBmaWVsZCA9IF9mLmZpZWxkO1xuICAgIG9wdGlvbiA9IF9mLm9wZXJhdGlvbjtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShfZi52YWx1ZSwgbnVsbCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHN1Yl9zZWxlY3RvciA9IFtdO1xuICAgIGlmIChfLmlzQXJyYXkodmFsdWUpID09PSB0cnVlKSB7XG4gICAgICBpZiAob3B0aW9uID09PSBcIj1cIikge1xuICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4gc3ViX3NlbGVjdG9yLnB1c2goW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjw+XCIpIHtcbiAgICAgICAgXy5lYWNoKHZhbHVlLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIHN1Yl9zZWxlY3Rvci5wdXNoKFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJhbmRcIik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgXy5lYWNoKHZhbHVlLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIHN1Yl9zZWxlY3Rvci5wdXNoKFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoc3ViX3NlbGVjdG9yW3N1Yl9zZWxlY3Rvci5sZW5ndGggLSAxXSA9PT0gXCJhbmRcIiB8fCBzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09PSBcIm9yXCIpIHtcbiAgICAgICAgc3ViX3NlbGVjdG9yLnBvcCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdWJfc2VsZWN0b3IgPSBbZmllbGQsIG9wdGlvbiwgdmFsdWVdO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcInN1Yl9zZWxlY3RvclwiLCBzdWJfc2VsZWN0b3IpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzdWJfc2VsZWN0b3IpO1xuICB9KTtcbiAgZm9ybWF0X2xvZ2ljID0gXCJbXCIgKyBmb3JtYXRfbG9naWMgKyBcIl1cIjtcbiAgcmV0dXJuIENyZWF0b3JbXCJldmFsXCJdKGZvcm1hdF9sb2dpYyk7XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgX29iamVjdCwgcGVybWlzc2lvbnMsIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCByZWxhdGVkX29iamVjdHMsIHVucmVsYXRlZF9vYmplY3RzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW107XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghX29iamVjdCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgfVxuICByZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKF9vYmplY3QuX2NvbGxlY3Rpb25fbmFtZSk7XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsIFwib2JqZWN0X25hbWVcIik7XG4gIGlmICgocmVsYXRlZF9vYmplY3RfbmFtZXMgIT0gbnVsbCA/IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmxlbmd0aCA6IHZvaWQgMCkgPT09IDApIHtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXM7XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICB1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzO1xuICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZShyZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHMpO1xuICByZXR1cm4gXy5maWx0ZXIocmVsYXRlZF9vYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCkge1xuICAgIHZhciBhbGxvd1JlYWQsIGlzQWN0aXZlLCByZWYsIHJlbGF0ZWRfb2JqZWN0X25hbWU7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0Lm9iamVjdF9uYW1lO1xuICAgIGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xO1xuICAgIGFsbG93UmVhZCA9IChyZWYgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYuYWxsb3dSZWFkIDogdm9pZCAwO1xuICAgIHJldHVybiBpc0FjdGl2ZSAmJiBhbGxvd1JlYWQ7XG4gIH0pO1xufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0TmFtZXMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciByZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIHJldHVybiBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cywgXCJvYmplY3RfbmFtZVwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0QWN0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGFjdGlvbnMsIGRpc2FibGVkX2FjdGlvbnMsIG9iaiwgcGVybWlzc2lvbnM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIGRpc2FibGVkX2FjdGlvbnMgPSBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zO1xuICBhY3Rpb25zID0gXy5zb3J0QnkoXy52YWx1ZXMob2JqLmFjdGlvbnMpLCAnc29ydCcpO1xuICBfLmVhY2goYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBhY3Rpb24ub24gPT09IFwicmVjb3JkXCIgJiYgYWN0aW9uLm5hbWUgIT09ICdzdGFuZGFyZF9lZGl0Jykge1xuICAgICAgcmV0dXJuIGFjdGlvbi5vbiA9ICdyZWNvcmRfbW9yZSc7XG4gICAgfVxuICB9KTtcbiAgYWN0aW9ucyA9IF8uZmlsdGVyKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIHJldHVybiBfLmluZGV4T2YoZGlzYWJsZWRfYWN0aW9ucywgYWN0aW9uLm5hbWUpIDwgMDtcbiAgfSk7XG4gIHJldHVybiBhY3Rpb25zO1xufTtcblxuL+i/lOWbnuW9k+WJjeeUqOaIt+acieadg+mZkOiuv+mXrueahOaJgOaciWxpc3Rfdmlld++8jOWMheaLrOWIhuS6q+eahO+8jOeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahO+8iOmZpOmdnm93bmVy5Y+Y5LqG77yJ77yM5Lul5Y+K6buY6K6k55qE5YW25LuW6KeG5Zu+5rOo5oSPQ3JlYXRvci5nZXRQZXJtaXNzaW9uc+WHveaVsOS4reaYr+S4jeS8muacieeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahOinhuWbvueahO+8jOaJgOS7pUNyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mi7/liLDnmoTnu5PmnpzkuI3lhajvvIzlubbkuI3mmK/lvZPliY3nlKjmiLfog73nnIvliLDmiYDmnInop4blm74vO1xuXG5DcmVhdG9yLmdldExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGRpc2FibGVkX2xpc3Rfdmlld3MsIGlzTW9iaWxlLCBsaXN0X3ZpZXdzLCBvYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBkaXNhYmxlZF9saXN0X3ZpZXdzID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS5kaXNhYmxlZF9saXN0X3ZpZXdzIHx8IFtdO1xuICBsaXN0X3ZpZXdzID0gW107XG4gIGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpO1xuICBfLmVhY2gob2JqZWN0Lmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIGlmIChpc01vYmlsZSAmJiBpdGVtLnR5cGUgPT09IFwiY2FsZW5kYXJcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXRlbV9uYW1lICE9PSBcImRlZmF1bHRcIikge1xuICAgICAgaWYgKF8uaW5kZXhPZihkaXNhYmxlZF9saXN0X3ZpZXdzLCBpdGVtX25hbWUpIDwgMCB8fCBpdGVtLm93bmVyID09PSB1c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlld3MucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbGlzdF92aWV3cztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgZmllbGRzTmFtZSwgdW5yZWFkYWJsZV9maWVsZHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgZmllbGRzTmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZShvYmplY3RfbmFtZSk7XG4gIHVucmVhZGFibGVfZmllbGRzID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS51bnJlYWRhYmxlX2ZpZWxkcztcbiAgcmV0dXJuIF8uZGlmZmVyZW5jZShmaWVsZHNOYW1lLCB1bnJlYWRhYmxlX2ZpZWxkcyk7XG59O1xuXG5DcmVhdG9yLmlzbG9hZGluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkLmdldCgpO1xufTtcblxuQ3JlYXRvci5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpO1xufTtcblxuQ3JlYXRvci5nZXREaXNhYmxlZEZpZWxkcyA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0uZGlzYWJsZWQgJiYgIWZpZWxkLmF1dG9mb3JtLm9taXQgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldEhpZGRlbkZpZWxkcyA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0udHlwZSA9PT0gXCJoaWRkZW5cIiAmJiAhZmllbGQuYXV0b2Zvcm0ub21pdCAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aE5vR3JvdXAgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuICghZmllbGQuYXV0b2Zvcm0gfHwgIWZpZWxkLmF1dG9mb3JtLmdyb3VwIHx8IGZpZWxkLmF1dG9mb3JtLmdyb3VwID09PSBcIi1cIikgJiYgKCFmaWVsZC5hdXRvZm9ybSB8fCBmaWVsZC5hdXRvZm9ybS50eXBlICE9PSBcImhpZGRlblwiKSAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0U29ydGVkRmllbGRHcm91cE5hbWVzID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBuYW1lcztcbiAgbmFtZXMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLmdyb3VwICE9PSBcIi1cIiAmJiBmaWVsZC5hdXRvZm9ybS5ncm91cDtcbiAgfSk7XG4gIG5hbWVzID0gXy5jb21wYWN0KG5hbWVzKTtcbiAgbmFtZXMgPSBfLnVuaXF1ZShuYW1lcyk7XG4gIHJldHVybiBuYW1lcztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzRm9yR3JvdXAgPSBmdW5jdGlvbihzY2hlbWEsIGdyb3VwTmFtZSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT09IGdyb3VwTmFtZSAmJiBmaWVsZC5hdXRvZm9ybS50eXBlICE9PSBcImhpZGRlblwiICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNXaXRob3V0T21pdCA9IGZ1bmN0aW9uKHNjaGVtYSwga2V5cykge1xuICBrZXlzID0gXy5tYXAoa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIGZpZWxkLCByZWY7XG4gICAgZmllbGQgPSBfLnBpY2soc2NoZW1hLCBrZXkpO1xuICAgIGlmICgocmVmID0gZmllbGRba2V5XS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi5vbWl0IDogdm9pZCAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICB9KTtcbiAga2V5cyA9IF8uY29tcGFjdChrZXlzKTtcbiAgcmV0dXJuIGtleXM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc0luRmlyc3RMZXZlbCA9IGZ1bmN0aW9uKGZpcnN0TGV2ZWxLZXlzLCBrZXlzKSB7XG4gIGtleXMgPSBfLm1hcChrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoXy5pbmRleE9mKGZpcnN0TGV2ZWxLZXlzLCBrZXkpID4gLTEpIHtcbiAgICAgIHJldHVybiBrZXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuICBrZXlzID0gXy5jb21wYWN0KGtleXMpO1xuICByZXR1cm4ga2V5cztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzRm9yUmVvcmRlciA9IGZ1bmN0aW9uKHNjaGVtYSwga2V5cywgaXNTaW5nbGUpIHtcbiAgdmFyIF9rZXlzLCBjaGlsZEtleXMsIGZpZWxkcywgaSwgaXNfd2lkZV8xLCBpc193aWRlXzIsIHNjXzEsIHNjXzI7XG4gIGZpZWxkcyA9IFtdO1xuICBpID0gMDtcbiAgX2tleXMgPSBfLmZpbHRlcihrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gIWtleS5lbmRzV2l0aCgnX2VuZExpbmUnKTtcbiAgfSk7XG4gIHdoaWxlIChpIDwgX2tleXMubGVuZ3RoKSB7XG4gICAgc2NfMSA9IF8ucGljayhzY2hlbWEsIF9rZXlzW2ldKTtcbiAgICBzY18yID0gXy5waWNrKHNjaGVtYSwgX2tleXNbaSArIDFdKTtcbiAgICBpc193aWRlXzEgPSBmYWxzZTtcbiAgICBpc193aWRlXzIgPSBmYWxzZTtcbiAgICBfLmVhY2goc2NfMSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciByZWYsIHJlZjE7XG4gICAgICBpZiAoKChyZWYgPSB2YWx1ZS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi5pc193aWRlIDogdm9pZCAwKSB8fCAoKHJlZjEgPSB2YWx1ZS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjEudHlwZSA6IHZvaWQgMCkgPT09IFwidGFibGVcIikge1xuICAgICAgICByZXR1cm4gaXNfd2lkZV8xID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBfLmVhY2goc2NfMiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciByZWYsIHJlZjE7XG4gICAgICBpZiAoKChyZWYgPSB2YWx1ZS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi5pc193aWRlIDogdm9pZCAwKSB8fCAoKHJlZjEgPSB2YWx1ZS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjEudHlwZSA6IHZvaWQgMCkgPT09IFwidGFibGVcIikge1xuICAgICAgICByZXR1cm4gaXNfd2lkZV8yID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICBpc193aWRlXzEgPSB0cnVlO1xuICAgICAgaXNfd2lkZV8yID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGlzU2luZ2xlKSB7XG4gICAgICBmaWVsZHMucHVzaChfa2V5cy5zbGljZShpLCBpICsgMSkpO1xuICAgICAgaSArPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNfd2lkZV8xKSB7XG4gICAgICAgIGZpZWxkcy5wdXNoKF9rZXlzLnNsaWNlKGksIGkgKyAxKSk7XG4gICAgICAgIGkgKz0gMTtcbiAgICAgIH0gZWxzZSBpZiAoIWlzX3dpZGVfMSAmJiBpc193aWRlXzIpIHtcbiAgICAgICAgY2hpbGRLZXlzID0gX2tleXMuc2xpY2UoaSwgaSArIDEpO1xuICAgICAgICBjaGlsZEtleXMucHVzaCh2b2lkIDApO1xuICAgICAgICBmaWVsZHMucHVzaChjaGlsZEtleXMpO1xuICAgICAgICBpICs9IDE7XG4gICAgICB9IGVsc2UgaWYgKCFpc193aWRlXzEgJiYgIWlzX3dpZGVfMikge1xuICAgICAgICBjaGlsZEtleXMgPSBfa2V5cy5zbGljZShpLCBpICsgMSk7XG4gICAgICAgIGlmIChfa2V5c1tpICsgMV0pIHtcbiAgICAgICAgICBjaGlsZEtleXMucHVzaChfa2V5c1tpICsgMV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNoaWxkS2V5cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIH1cbiAgICAgICAgZmllbGRzLnB1c2goY2hpbGRLZXlzKTtcbiAgICAgICAgaSArPSAyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5pc0ZpbHRlclZhbHVlRW1wdHkgPSBmdW5jdGlvbih2KSB7XG4gIHJldHVybiB0eXBlb2YgdiA9PT0gXCJ1bmRlZmluZWRcIiB8fCB2ID09PSBudWxsIHx8IE51bWJlci5pc05hTih2KSB8fCB2Lmxlbmd0aCA9PT0gMDtcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ3JlYXRvci5nZXRBbGxSZWxhdGVkT2JqZWN0cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICAgIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW107XG4gICAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICAgIHJldHVybiBfLmVhY2gocmVsYXRlZF9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgICAgaWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT09IG9iamVjdF9uYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzLnB1c2gocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZW5hYmxlX2ZpbGVzKSB7XG4gICAgICByZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoKFwiY21zX2ZpbGVzXCIpO1xuICAgIH1cbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXM7XG4gIH07XG59XG4iLCJDcmVhdG9yLmFwcHNCeU5hbWUgPSB7fVxyXG5cclxuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRcIm9iamVjdF9yZWNlbnRfdmlld2VkXCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZV9pZCktPlxyXG5cdFx0aWYgIXRoaXMudXNlcklkXHJcblx0XHRcdHJldHVybiBudWxsXHJcblxyXG5cdFx0aWYgb2JqZWN0X25hbWUgPT0gXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiXHJcblx0XHRcdHJldHVyblxyXG5cdFx0aWYgb2JqZWN0X25hbWUgYW5kIHJlY29yZF9pZFxyXG5cdFx0XHRpZiAhc3BhY2VfaWRcclxuXHRcdFx0XHRkb2MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmRPbmUoe19pZDogcmVjb3JkX2lkfSwge2ZpZWxkczoge3NwYWNlOiAxfX0pXHJcblx0XHRcdFx0c3BhY2VfaWQgPSBkb2M/LnNwYWNlXHJcblxyXG5cdFx0XHRjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiKVxyXG5cdFx0XHRmaWx0ZXJzID0geyBvd25lcjogdGhpcy51c2VySWQsIHNwYWNlOiBzcGFjZV9pZCwgJ3JlY29yZC5vJzogb2JqZWN0X25hbWUsICdyZWNvcmQuaWRzJzogW3JlY29yZF9pZF19XHJcblx0XHRcdGN1cnJlbnRfcmVjZW50X3ZpZXdlZCA9IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5maW5kT25lKGZpbHRlcnMpXHJcblx0XHRcdGlmIGN1cnJlbnRfcmVjZW50X3ZpZXdlZFxyXG5cdFx0XHRcdGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC51cGRhdGUoXHJcblx0XHRcdFx0XHRjdXJyZW50X3JlY2VudF92aWV3ZWQuX2lkLFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHQkaW5jOiB7XHJcblx0XHRcdFx0XHRcdFx0Y291bnQ6IDFcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkOiBuZXcgRGF0ZSgpXHJcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHQpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuaW5zZXJ0KFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRfaWQ6IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5fbWFrZU5ld0lEKClcclxuXHRcdFx0XHRcdFx0b3duZXI6IHRoaXMudXNlcklkXHJcblx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZV9pZFxyXG5cdFx0XHRcdFx0XHRyZWNvcmQ6IHtvOiBvYmplY3RfbmFtZSwgaWRzOiBbcmVjb3JkX2lkXX1cclxuXHRcdFx0XHRcdFx0Y291bnQ6IDFcclxuXHRcdFx0XHRcdFx0Y3JlYXRlZDogbmV3IERhdGUoKVxyXG5cdFx0XHRcdFx0XHRjcmVhdGVkX2J5OiB0aGlzLnVzZXJJZFxyXG5cdFx0XHRcdFx0XHRtb2RpZmllZDogbmV3IERhdGUoKVxyXG5cdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogdGhpcy51c2VySWRcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHQpXHJcblx0XHRcdHJldHVybiIsIk1ldGVvci5tZXRob2RzKHtcbiAgXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZV9pZCkge1xuICAgIHZhciBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQsIGN1cnJlbnRfcmVjZW50X3ZpZXdlZCwgZG9jLCBmaWx0ZXJzO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAob2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgICBpZiAoIXNwYWNlX2lkKSB7XG4gICAgICAgIGRvYyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZE9uZSh7XG4gICAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgc3BhY2U6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzcGFjZV9pZCA9IGRvYyAhPSBudWxsID8gZG9jLnNwYWNlIDogdm9pZCAwO1xuICAgICAgfVxuICAgICAgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIik7XG4gICAgICBmaWx0ZXJzID0ge1xuICAgICAgICBvd25lcjogdGhpcy51c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgJ3JlY29yZC5vJzogb2JqZWN0X25hbWUsXG4gICAgICAgICdyZWNvcmQuaWRzJzogW3JlY29yZF9pZF1cbiAgICAgIH07XG4gICAgICBjdXJyZW50X3JlY2VudF92aWV3ZWQgPSBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuZmluZE9uZShmaWx0ZXJzKTtcbiAgICAgIGlmIChjdXJyZW50X3JlY2VudF92aWV3ZWQpIHtcbiAgICAgICAgY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLnVwZGF0ZShjdXJyZW50X3JlY2VudF92aWV3ZWQuX2lkLCB7XG4gICAgICAgICAgJGluYzoge1xuICAgICAgICAgICAgY291bnQ6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5pbnNlcnQoe1xuICAgICAgICAgIF9pZDogY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLl9tYWtlTmV3SUQoKSxcbiAgICAgICAgICBvd25lcjogdGhpcy51c2VySWQsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIHJlY29yZDoge1xuICAgICAgICAgICAgbzogb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBpZHM6IFtyZWNvcmRfaWRdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IHRoaXMudXNlcklkLFxuICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuIiwicmVjZW50X2FnZ3JlZ2F0ZSA9IChjcmVhdGVkX2J5LCBzcGFjZUlkLCBfcmVjb3JkcywgY2FsbGJhY2spLT5cclxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9yZWNlbnRfdmlld2VkLnJhd0NvbGxlY3Rpb24oKS5hZ2dyZWdhdGUoW1xyXG5cdFx0eyRtYXRjaDoge2NyZWF0ZWRfYnk6IGNyZWF0ZWRfYnksIHNwYWNlOiBzcGFjZUlkfX0sXHJcblx0XHR7JGdyb3VwOiB7X2lkOiB7b2JqZWN0X25hbWU6IFwiJHJlY29yZC5vXCIsIHJlY29yZF9pZDogXCIkcmVjb3JkLmlkc1wiLCBzcGFjZTogXCIkc3BhY2VcIn0sIG1heENyZWF0ZWQ6IHskbWF4OiBcIiRjcmVhdGVkXCJ9fX0sXHJcblx0XHR7JHNvcnQ6IHttYXhDcmVhdGVkOiAtMX19LFxyXG5cdFx0eyRsaW1pdDogMTB9XHJcblx0XSkudG9BcnJheSAoZXJyLCBkYXRhKS0+XHJcblx0XHRpZiBlcnJcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycilcclxuXHJcblx0XHRkYXRhLmZvckVhY2ggKGRvYykgLT5cclxuXHRcdFx0X3JlY29yZHMucHVzaCBkb2MuX2lkXHJcblxyXG5cdFx0aWYgY2FsbGJhY2sgJiYgXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKVxyXG5cdFx0XHRjYWxsYmFjaygpXHJcblxyXG5cdFx0cmV0dXJuXHJcblxyXG5hc3luY19yZWNlbnRfYWdncmVnYXRlID0gTWV0ZW9yLndyYXBBc3luYyhyZWNlbnRfYWdncmVnYXRlKVxyXG5cclxuc2VhcmNoX29iamVjdCA9IChzcGFjZSwgb2JqZWN0X25hbWUsdXNlcklkLCBzZWFyY2hUZXh0KS0+XHJcblx0ZGF0YSA9IG5ldyBBcnJheSgpXHJcblxyXG5cdGlmIHNlYXJjaFRleHRcclxuXHJcblx0XHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblxyXG5cdFx0X29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxyXG5cdFx0X29iamVjdF9uYW1lX2tleSA9IF9vYmplY3Q/Lk5BTUVfRklFTERfS0VZXHJcblx0XHRpZiBfb2JqZWN0ICYmIF9vYmplY3RfY29sbGVjdGlvbiAmJiBfb2JqZWN0X25hbWVfa2V5XHJcblx0XHRcdHF1ZXJ5ID0ge31cclxuXHRcdFx0c2VhcmNoX0tleXdvcmRzID0gc2VhcmNoVGV4dC5zcGxpdChcIiBcIilcclxuXHRcdFx0cXVlcnlfYW5kID0gW11cclxuXHRcdFx0c2VhcmNoX0tleXdvcmRzLmZvckVhY2ggKGtleXdvcmQpLT5cclxuXHRcdFx0XHRzdWJxdWVyeSA9IHt9XHJcblx0XHRcdFx0c3VicXVlcnlbX29iamVjdF9uYW1lX2tleV0gPSB7JHJlZ2V4OiBrZXl3b3JkLnRyaW0oKX1cclxuXHRcdFx0XHRxdWVyeV9hbmQucHVzaCBzdWJxdWVyeVxyXG5cclxuXHRcdFx0cXVlcnkuJGFuZCA9IHF1ZXJ5X2FuZFxyXG5cdFx0XHRxdWVyeS5zcGFjZSA9IHskaW46IFtzcGFjZV19XHJcblxyXG5cdFx0XHRmaWVsZHMgPSB7X2lkOiAxfVxyXG5cdFx0XHRmaWVsZHNbX29iamVjdF9uYW1lX2tleV0gPSAxXHJcblxyXG5cdFx0XHRyZWNvcmRzID0gX29iamVjdF9jb2xsZWN0aW9uLmZpbmQocXVlcnksIHtmaWVsZHM6IGZpZWxkcywgc29ydDoge21vZGlmaWVkOiAxfSwgbGltaXQ6IDV9KVxyXG5cclxuXHRcdFx0cmVjb3Jkcy5mb3JFYWNoIChyZWNvcmQpLT5cclxuXHRcdFx0XHRkYXRhLnB1c2gge19pZDogcmVjb3JkLl9pZCwgX25hbWU6IHJlY29yZFtfb2JqZWN0X25hbWVfa2V5XSwgX29iamVjdF9uYW1lOiBvYmplY3RfbmFtZX1cclxuXHRcclxuXHRyZXR1cm4gZGF0YVxyXG5cclxuTWV0ZW9yLm1ldGhvZHNcclxuXHQnb2JqZWN0X3JlY2VudF9yZWNvcmQnOiAoc3BhY2VJZCktPlxyXG5cdFx0ZGF0YSA9IG5ldyBBcnJheSgpXHJcblx0XHRyZWNvcmRzID0gbmV3IEFycmF5KClcclxuXHRcdGFzeW5jX3JlY2VudF9hZ2dyZWdhdGUodGhpcy51c2VySWQsIHNwYWNlSWQsIHJlY29yZHMpXHJcblx0XHRyZWNvcmRzLmZvckVhY2ggKGl0ZW0pLT5cclxuXHRcdFx0cmVjb3JkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpXHJcblxyXG5cdFx0XHRpZiAhcmVjb3JkX29iamVjdFxyXG5cdFx0XHRcdHJldHVyblxyXG5cclxuXHRcdFx0cmVjb3JkX29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpXHJcblxyXG5cdFx0XHRpZiByZWNvcmRfb2JqZWN0ICYmIHJlY29yZF9vYmplY3RfY29sbGVjdGlvblxyXG5cdFx0XHRcdGZpZWxkcyA9IHtfaWQ6IDF9XHJcblxyXG5cdFx0XHRcdGZpZWxkc1tyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSA9IDFcclxuXHJcblx0XHRcdFx0cmVjb3JkID0gcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uLmZpbmRPbmUoaXRlbS5yZWNvcmRfaWRbMF0sIHtmaWVsZHM6IGZpZWxkc30pXHJcblx0XHRcdFx0aWYgcmVjb3JkXHJcblx0XHRcdFx0XHRkYXRhLnB1c2gge19pZDogcmVjb3JkLl9pZCwgX25hbWU6IHJlY29yZFtyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSwgX29iamVjdF9uYW1lOiBpdGVtLm9iamVjdF9uYW1lfVxyXG5cclxuXHRcdHJldHVybiBkYXRhXHJcblxyXG5cdCdvYmplY3RfcmVjb3JkX3NlYXJjaCc6IChvcHRpb25zKS0+XHJcblx0XHRzZWxmID0gdGhpc1xyXG5cclxuXHRcdGRhdGEgPSBuZXcgQXJyYXkoKVxyXG5cclxuXHRcdHNlYXJjaFRleHQgPSBvcHRpb25zLnNlYXJjaFRleHRcclxuXHRcdHNwYWNlID0gb3B0aW9ucy5zcGFjZVxyXG5cclxuXHRcdF8uZm9yRWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChfb2JqZWN0LCBuYW1lKS0+XHJcblx0XHRcdGlmIF9vYmplY3QuZW5hYmxlX3NlYXJjaFxyXG5cdFx0XHRcdG9iamVjdF9yZWNvcmQgPSBzZWFyY2hfb2JqZWN0KHNwYWNlLCBfb2JqZWN0Lm5hbWUsIHNlbGYudXNlcklkLCBzZWFyY2hUZXh0KVxyXG5cdFx0XHRcdGRhdGEgPSBkYXRhLmNvbmNhdChvYmplY3RfcmVjb3JkKVxyXG5cclxuXHRcdHJldHVybiBkYXRhXHJcbiIsInZhciBhc3luY19yZWNlbnRfYWdncmVnYXRlLCByZWNlbnRfYWdncmVnYXRlLCBzZWFyY2hfb2JqZWN0O1xuXG5yZWNlbnRfYWdncmVnYXRlID0gZnVuY3Rpb24oY3JlYXRlZF9ieSwgc3BhY2VJZCwgX3JlY29yZHMsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9yZWNlbnRfdmlld2VkLnJhd0NvbGxlY3Rpb24oKS5hZ2dyZWdhdGUoW1xuICAgIHtcbiAgICAgICRtYXRjaDoge1xuICAgICAgICBjcmVhdGVkX2J5OiBjcmVhdGVkX2J5LFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgICRncm91cDoge1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogXCIkcmVjb3JkLm9cIixcbiAgICAgICAgICByZWNvcmRfaWQ6IFwiJHJlY29yZC5pZHNcIixcbiAgICAgICAgICBzcGFjZTogXCIkc3BhY2VcIlxuICAgICAgICB9LFxuICAgICAgICBtYXhDcmVhdGVkOiB7XG4gICAgICAgICAgJG1heDogXCIkY3JlYXRlZFwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAkc29ydDoge1xuICAgICAgICBtYXhDcmVhdGVkOiAtMVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgICRsaW1pdDogMTBcbiAgICB9XG4gIF0pLnRvQXJyYXkoZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihkb2MpIHtcbiAgICAgIHJldHVybiBfcmVjb3Jkcy5wdXNoKGRvYy5faWQpO1xuICAgIH0pO1xuICAgIGlmIChjYWxsYmFjayAmJiBfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5hc3luY19yZWNlbnRfYWdncmVnYXRlID0gTWV0ZW9yLndyYXBBc3luYyhyZWNlbnRfYWdncmVnYXRlKTtcblxuc2VhcmNoX29iamVjdCA9IGZ1bmN0aW9uKHNwYWNlLCBvYmplY3RfbmFtZSwgdXNlcklkLCBzZWFyY2hUZXh0KSB7XG4gIHZhciBfb2JqZWN0LCBfb2JqZWN0X2NvbGxlY3Rpb24sIF9vYmplY3RfbmFtZV9rZXksIGRhdGEsIGZpZWxkcywgcXVlcnksIHF1ZXJ5X2FuZCwgcmVjb3Jkcywgc2VhcmNoX0tleXdvcmRzO1xuICBkYXRhID0gbmV3IEFycmF5KCk7XG4gIGlmIChzZWFyY2hUZXh0KSB7XG4gICAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpO1xuICAgIF9vYmplY3RfbmFtZV9rZXkgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lk5BTUVfRklFTERfS0VZIDogdm9pZCAwO1xuICAgIGlmIChfb2JqZWN0ICYmIF9vYmplY3RfY29sbGVjdGlvbiAmJiBfb2JqZWN0X25hbWVfa2V5KSB7XG4gICAgICBxdWVyeSA9IHt9O1xuICAgICAgc2VhcmNoX0tleXdvcmRzID0gc2VhcmNoVGV4dC5zcGxpdChcIiBcIik7XG4gICAgICBxdWVyeV9hbmQgPSBbXTtcbiAgICAgIHNlYXJjaF9LZXl3b3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKGtleXdvcmQpIHtcbiAgICAgICAgdmFyIHN1YnF1ZXJ5O1xuICAgICAgICBzdWJxdWVyeSA9IHt9O1xuICAgICAgICBzdWJxdWVyeVtfb2JqZWN0X25hbWVfa2V5XSA9IHtcbiAgICAgICAgICAkcmVnZXg6IGtleXdvcmQudHJpbSgpXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBxdWVyeV9hbmQucHVzaChzdWJxdWVyeSk7XG4gICAgICB9KTtcbiAgICAgIHF1ZXJ5LiRhbmQgPSBxdWVyeV9hbmQ7XG4gICAgICBxdWVyeS5zcGFjZSA9IHtcbiAgICAgICAgJGluOiBbc3BhY2VdXG4gICAgICB9O1xuICAgICAgZmllbGRzID0ge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH07XG4gICAgICBmaWVsZHNbX29iamVjdF9uYW1lX2tleV0gPSAxO1xuICAgICAgcmVjb3JkcyA9IF9vYmplY3RfY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCB7XG4gICAgICAgIGZpZWxkczogZmllbGRzLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgbW9kaWZpZWQ6IDFcbiAgICAgICAgfSxcbiAgICAgICAgbGltaXQ6IDVcbiAgICAgIH0pO1xuICAgICAgcmVjb3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICByZXR1cm4gZGF0YS5wdXNoKHtcbiAgICAgICAgICBfaWQ6IHJlY29yZC5faWQsXG4gICAgICAgICAgX25hbWU6IHJlY29yZFtfb2JqZWN0X25hbWVfa2V5XSxcbiAgICAgICAgICBfb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkYXRhO1xufTtcblxuTWV0ZW9yLm1ldGhvZHMoe1xuICAnb2JqZWN0X3JlY2VudF9yZWNvcmQnOiBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIGRhdGEsIHJlY29yZHM7XG4gICAgZGF0YSA9IG5ldyBBcnJheSgpO1xuICAgIHJlY29yZHMgPSBuZXcgQXJyYXkoKTtcbiAgICBhc3luY19yZWNlbnRfYWdncmVnYXRlKHRoaXMudXNlcklkLCBzcGFjZUlkLCByZWNvcmRzKTtcbiAgICByZWNvcmRzLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgdmFyIGZpZWxkcywgcmVjb3JkLCByZWNvcmRfb2JqZWN0LCByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb247XG4gICAgICByZWNvcmRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSk7XG4gICAgICBpZiAoIXJlY29yZF9vYmplY3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpO1xuICAgICAgaWYgKHJlY29yZF9vYmplY3QgJiYgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uKSB7XG4gICAgICAgIGZpZWxkcyA9IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfTtcbiAgICAgICAgZmllbGRzW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldID0gMTtcbiAgICAgICAgcmVjb3JkID0gcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uLmZpbmRPbmUoaXRlbS5yZWNvcmRfaWRbMF0sIHtcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICAgIHJldHVybiBkYXRhLnB1c2goe1xuICAgICAgICAgICAgX2lkOiByZWNvcmQuX2lkLFxuICAgICAgICAgICAgX25hbWU6IHJlY29yZFtyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSxcbiAgICAgICAgICAgIF9vYmplY3RfbmFtZTogaXRlbS5vYmplY3RfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH0sXG4gICdvYmplY3RfcmVjb3JkX3NlYXJjaCc6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgZGF0YSwgc2VhcmNoVGV4dCwgc2VsZiwgc3BhY2U7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgZGF0YSA9IG5ldyBBcnJheSgpO1xuICAgIHNlYXJjaFRleHQgPSBvcHRpb25zLnNlYXJjaFRleHQ7XG4gICAgc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICAgIF8uZm9yRWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKF9vYmplY3QsIG5hbWUpIHtcbiAgICAgIHZhciBvYmplY3RfcmVjb3JkO1xuICAgICAgaWYgKF9vYmplY3QuZW5hYmxlX3NlYXJjaCkge1xuICAgICAgICBvYmplY3RfcmVjb3JkID0gc2VhcmNoX29iamVjdChzcGFjZSwgX29iamVjdC5uYW1lLCBzZWxmLnVzZXJJZCwgc2VhcmNoVGV4dCk7XG4gICAgICAgIHJldHVybiBkYXRhID0gZGF0YS5jb25jYXQob2JqZWN0X3JlY29yZCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuICAgIHVwZGF0ZV9maWx0ZXJzOiAobGlzdHZpZXdfaWQsIGZpbHRlcnMsIGZpbHRlcl9zY29wZSwgZmlsdGVyX2xvZ2ljKS0+XHJcbiAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfbGlzdHZpZXdzLmRpcmVjdC51cGRhdGUoe19pZDogbGlzdHZpZXdfaWR9LCB7JHNldDoge2ZpbHRlcnM6IGZpbHRlcnMsIGZpbHRlcl9zY29wZTogZmlsdGVyX3Njb3BlLCBmaWx0ZXJfbG9naWM6IGZpbHRlcl9sb2dpY319KVxyXG5cclxuICAgIHVwZGF0ZV9jb2x1bW5zOiAobGlzdHZpZXdfaWQsIGNvbHVtbnMpLT5cclxuICAgICAgICBjaGVjayhjb2x1bW5zLCBBcnJheSlcclxuICAgICAgICBcclxuICAgICAgICBpZiBjb2x1bW5zLmxlbmd0aCA8IDFcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDAsIFwiU2VsZWN0IGF0IGxlYXN0IG9uZSBmaWVsZCB0byBkaXNwbGF5XCJcclxuICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MudXBkYXRlKHtfaWQ6IGxpc3R2aWV3X2lkfSwgeyRzZXQ6IHtjb2x1bW5zOiBjb2x1bW5zfX0pXHJcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgdXBkYXRlX2ZpbHRlcnM6IGZ1bmN0aW9uKGxpc3R2aWV3X2lkLCBmaWx0ZXJzLCBmaWx0ZXJfc2NvcGUsIGZpbHRlcl9sb2dpYykge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IGxpc3R2aWV3X2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBmaWx0ZXJzOiBmaWx0ZXJzLFxuICAgICAgICBmaWx0ZXJfc2NvcGU6IGZpbHRlcl9zY29wZSxcbiAgICAgICAgZmlsdGVyX2xvZ2ljOiBmaWx0ZXJfbG9naWNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlX2NvbHVtbnM6IGZ1bmN0aW9uKGxpc3R2aWV3X2lkLCBjb2x1bW5zKSB7XG4gICAgY2hlY2soY29sdW1ucywgQXJyYXkpO1xuICAgIGlmIChjb2x1bW5zLmxlbmd0aCA8IDEpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIlNlbGVjdCBhdCBsZWFzdCBvbmUgZmllbGQgdG8gZGlzcGxheVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy51cGRhdGUoe1xuICAgICAgX2lkOiBsaXN0dmlld19pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgY29sdW1uczogY29sdW1uc1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0J3JlcG9ydF9kYXRhJzogKG9wdGlvbnMpLT5cclxuXHRcdGNoZWNrKG9wdGlvbnMsIE9iamVjdClcclxuXHRcdHNwYWNlID0gb3B0aW9ucy5zcGFjZVxyXG5cdFx0ZmllbGRzID0gb3B0aW9ucy5maWVsZHNcclxuXHRcdG9iamVjdF9uYW1lID0gb3B0aW9ucy5vYmplY3RfbmFtZVxyXG5cdFx0ZmlsdGVyX3Njb3BlID0gb3B0aW9ucy5maWx0ZXJfc2NvcGVcclxuXHRcdGZpbHRlcnMgPSBvcHRpb25zLmZpbHRlcnNcclxuXHRcdGZpbHRlckZpZWxkcyA9IHt9XHJcblx0XHRjb21wb3VuZEZpZWxkcyA9IFtdXHJcblx0XHRvYmplY3RGaWVsZHMgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk/LmZpZWxkc1xyXG5cdFx0Xy5lYWNoIGZpZWxkcywgKGl0ZW0sIGluZGV4KS0+XHJcblx0XHRcdHNwbGl0cyA9IGl0ZW0uc3BsaXQoXCIuXCIpXHJcblx0XHRcdG5hbWUgPSBzcGxpdHNbMF1cclxuXHRcdFx0b2JqZWN0RmllbGQgPSBvYmplY3RGaWVsZHNbbmFtZV1cclxuXHRcdFx0aWYgc3BsaXRzLmxlbmd0aCA+IDEgYW5kIG9iamVjdEZpZWxkXHJcblx0XHRcdFx0Y2hpbGRLZXkgPSBpdGVtLnJlcGxhY2UgbmFtZSArIFwiLlwiLCBcIlwiXHJcblx0XHRcdFx0Y29tcG91bmRGaWVsZHMucHVzaCh7bmFtZTogbmFtZSwgY2hpbGRLZXk6IGNoaWxkS2V5LCBmaWVsZDogb2JqZWN0RmllbGR9KVxyXG5cdFx0XHRmaWx0ZXJGaWVsZHNbbmFtZV0gPSAxXHJcblxyXG5cdFx0c2VsZWN0b3IgPSB7fVxyXG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcclxuXHRcdHNlbGVjdG9yLnNwYWNlID0gc3BhY2VcclxuXHRcdGlmIGZpbHRlcl9zY29wZSA9PSBcInNwYWNleFwiXHJcblx0XHRcdHNlbGVjdG9yLnNwYWNlID0gXHJcblx0XHRcdFx0JGluOiBbbnVsbCxzcGFjZV1cclxuXHRcdGVsc2UgaWYgZmlsdGVyX3Njb3BlID09IFwibWluZVwiXHJcblx0XHRcdHNlbGVjdG9yLm93bmVyID0gdXNlcklkXHJcblxyXG5cdFx0aWYgQ3JlYXRvci5pc0NvbW1vblNwYWNlKHNwYWNlKSAmJiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZSwgQHVzZXJJZClcclxuXHRcdFx0ZGVsZXRlIHNlbGVjdG9yLnNwYWNlXHJcblxyXG5cdFx0aWYgZmlsdGVycyBhbmQgZmlsdGVycy5sZW5ndGggPiAwXHJcblx0XHRcdHNlbGVjdG9yW1wiJGFuZFwiXSA9IGZpbHRlcnNcclxuXHJcblx0XHRjdXJzb3IgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IsIHtmaWVsZHM6IGZpbHRlckZpZWxkcywgc2tpcDogMCwgbGltaXQ6IDEwMDAwfSlcclxuI1x0XHRpZiBjdXJzb3IuY291bnQoKSA+IDEwMDAwXHJcbiNcdFx0XHRyZXR1cm4gW11cclxuXHRcdHJlc3VsdCA9IGN1cnNvci5mZXRjaCgpXHJcblx0XHRpZiBjb21wb3VuZEZpZWxkcy5sZW5ndGhcclxuXHRcdFx0cmVzdWx0ID0gcmVzdWx0Lm1hcCAoaXRlbSxpbmRleCktPlxyXG5cdFx0XHRcdF8uZWFjaCBjb21wb3VuZEZpZWxkcywgKGNvbXBvdW5kRmllbGRJdGVtLCBpbmRleCktPlxyXG5cdFx0XHRcdFx0aXRlbUtleSA9IGNvbXBvdW5kRmllbGRJdGVtLm5hbWUgKyBcIiolKlwiICsgY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXkucmVwbGFjZSgvXFwuL2csIFwiKiUqXCIpXHJcblx0XHRcdFx0XHRpdGVtVmFsdWUgPSBpdGVtW2NvbXBvdW5kRmllbGRJdGVtLm5hbWVdXHJcblx0XHRcdFx0XHR0eXBlID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQudHlwZVxyXG5cdFx0XHRcdFx0aWYgW1wibG9va3VwXCIsIFwibWFzdGVyX2RldGFpbFwiXS5pbmRleE9mKHR5cGUpID4gLTFcclxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQucmVmZXJlbmNlX3RvXHJcblx0XHRcdFx0XHRcdGNvbXBvdW5kRmlsdGVyRmllbGRzID0ge31cclxuXHRcdFx0XHRcdFx0Y29tcG91bmRGaWx0ZXJGaWVsZHNbY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldID0gMVxyXG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VJdGVtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bykuZmluZE9uZSB7X2lkOiBpdGVtVmFsdWV9LCBmaWVsZHM6IGNvbXBvdW5kRmlsdGVyRmllbGRzXHJcblx0XHRcdFx0XHRcdGlmIHJlZmVyZW5jZUl0ZW1cclxuXHRcdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gcmVmZXJlbmNlSXRlbVtjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV1cclxuXHRcdFx0XHRcdGVsc2UgaWYgdHlwZSA9PSBcInNlbGVjdFwiXHJcblx0XHRcdFx0XHRcdG9wdGlvbnMgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5vcHRpb25zXHJcblx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSBfLmZpbmRXaGVyZShvcHRpb25zLCB7dmFsdWU6IGl0ZW1WYWx1ZX0pPy5sYWJlbCBvciBpdGVtVmFsdWVcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IGl0ZW1WYWx1ZVxyXG5cdFx0XHRcdFx0dW5sZXNzIGl0ZW1baXRlbUtleV1cclxuXHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IFwiLS1cIlxyXG5cdFx0XHRcdHJldHVybiBpdGVtXHJcblx0XHRcdHJldHVybiByZXN1bHRcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHJlc3VsdFxyXG5cclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICAncmVwb3J0X2RhdGEnOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGNvbXBvdW5kRmllbGRzLCBjdXJzb3IsIGZpZWxkcywgZmlsdGVyRmllbGRzLCBmaWx0ZXJfc2NvcGUsIGZpbHRlcnMsIG9iamVjdEZpZWxkcywgb2JqZWN0X25hbWUsIHJlZiwgcmVzdWx0LCBzZWxlY3Rvciwgc3BhY2UsIHVzZXJJZDtcbiAgICBjaGVjayhvcHRpb25zLCBPYmplY3QpO1xuICAgIHNwYWNlID0gb3B0aW9ucy5zcGFjZTtcbiAgICBmaWVsZHMgPSBvcHRpb25zLmZpZWxkcztcbiAgICBvYmplY3RfbmFtZSA9IG9wdGlvbnMub2JqZWN0X25hbWU7XG4gICAgZmlsdGVyX3Njb3BlID0gb3B0aW9ucy5maWx0ZXJfc2NvcGU7XG4gICAgZmlsdGVycyA9IG9wdGlvbnMuZmlsdGVycztcbiAgICBmaWx0ZXJGaWVsZHMgPSB7fTtcbiAgICBjb21wb3VuZEZpZWxkcyA9IFtdO1xuICAgIG9iamVjdEZpZWxkcyA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwO1xuICAgIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICB2YXIgY2hpbGRLZXksIG5hbWUsIG9iamVjdEZpZWxkLCBzcGxpdHM7XG4gICAgICBzcGxpdHMgPSBpdGVtLnNwbGl0KFwiLlwiKTtcbiAgICAgIG5hbWUgPSBzcGxpdHNbMF07XG4gICAgICBvYmplY3RGaWVsZCA9IG9iamVjdEZpZWxkc1tuYW1lXTtcbiAgICAgIGlmIChzcGxpdHMubGVuZ3RoID4gMSAmJiBvYmplY3RGaWVsZCkge1xuICAgICAgICBjaGlsZEtleSA9IGl0ZW0ucmVwbGFjZShuYW1lICsgXCIuXCIsIFwiXCIpO1xuICAgICAgICBjb21wb3VuZEZpZWxkcy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgIGNoaWxkS2V5OiBjaGlsZEtleSxcbiAgICAgICAgICBmaWVsZDogb2JqZWN0RmllbGRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmlsdGVyRmllbGRzW25hbWVdID0gMTtcbiAgICB9KTtcbiAgICBzZWxlY3RvciA9IHt9O1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2U7XG4gICAgaWYgKGZpbHRlcl9zY29wZSA9PT0gXCJzcGFjZXhcIikge1xuICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAgICRpbjogW251bGwsIHNwYWNlXVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGZpbHRlcl9zY29wZSA9PT0gXCJtaW5lXCIpIHtcbiAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICAgIH1cbiAgICBpZiAoQ3JlYXRvci5pc0NvbW1vblNwYWNlKHNwYWNlKSAmJiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZSwgdGhpcy51c2VySWQpKSB7XG4gICAgICBkZWxldGUgc2VsZWN0b3Iuc3BhY2U7XG4gICAgfVxuICAgIGlmIChmaWx0ZXJzICYmIGZpbHRlcnMubGVuZ3RoID4gMCkge1xuICAgICAgc2VsZWN0b3JbXCIkYW5kXCJdID0gZmlsdGVycztcbiAgICB9XG4gICAgY3Vyc29yID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yLCB7XG4gICAgICBmaWVsZHM6IGZpbHRlckZpZWxkcyxcbiAgICAgIHNraXA6IDAsXG4gICAgICBsaW1pdDogMTAwMDBcbiAgICB9KTtcbiAgICByZXN1bHQgPSBjdXJzb3IuZmV0Y2goKTtcbiAgICBpZiAoY29tcG91bmRGaWVsZHMubGVuZ3RoKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHQubWFwKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgIF8uZWFjaChjb21wb3VuZEZpZWxkcywgZnVuY3Rpb24oY29tcG91bmRGaWVsZEl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgdmFyIGNvbXBvdW5kRmlsdGVyRmllbGRzLCBpdGVtS2V5LCBpdGVtVmFsdWUsIHJlZjEsIHJlZmVyZW5jZUl0ZW0sIHJlZmVyZW5jZV90bywgdHlwZTtcbiAgICAgICAgICBpdGVtS2V5ID0gY29tcG91bmRGaWVsZEl0ZW0ubmFtZSArIFwiKiUqXCIgKyBjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleS5yZXBsYWNlKC9cXC4vZywgXCIqJSpcIik7XG4gICAgICAgICAgaXRlbVZhbHVlID0gaXRlbVtjb21wb3VuZEZpZWxkSXRlbS5uYW1lXTtcbiAgICAgICAgICB0eXBlID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQudHlwZTtcbiAgICAgICAgICBpZiAoW1wibG9va3VwXCIsIFwibWFzdGVyX2RldGFpbFwiXS5pbmRleE9mKHR5cGUpID4gLTEpIHtcbiAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgIGNvbXBvdW5kRmlsdGVyRmllbGRzID0ge307XG4gICAgICAgICAgICBjb21wb3VuZEZpbHRlckZpZWxkc1tjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV0gPSAxO1xuICAgICAgICAgICAgcmVmZXJlbmNlSXRlbSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8pLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IGl0ZW1WYWx1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IGNvbXBvdW5kRmlsdGVyRmllbGRzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyZWZlcmVuY2VJdGVtKSB7XG4gICAgICAgICAgICAgIGl0ZW1baXRlbUtleV0gPSByZWZlcmVuY2VJdGVtW2NvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5vcHRpb25zO1xuICAgICAgICAgICAgaXRlbVtpdGVtS2V5XSA9ICgocmVmMSA9IF8uZmluZFdoZXJlKG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgdmFsdWU6IGl0ZW1WYWx1ZVxuICAgICAgICAgICAgfSkpICE9IG51bGwgPyByZWYxLmxhYmVsIDogdm9pZCAwKSB8fCBpdGVtVmFsdWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl0ZW1baXRlbUtleV0gPSBpdGVtVmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghaXRlbVtpdGVtS2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW1baXRlbUtleV0gPSBcIi0tXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG59KTtcbiIsIiMjI1xyXG4gICAgdHlwZTogXCJ1c2VyXCJcclxuICAgIG9iamVjdF9uYW1lOiBcIm9iamVjdF9saXN0dmlld3NcIlxyXG4gICAgcmVjb3JkX2lkOiBcIntvYmplY3RfbmFtZX0se2xpc3R2aWV3X2lkfVwiXHJcbiAgICBzZXR0aW5nczpcclxuICAgICAgICBjb2x1bW5fd2lkdGg6IHsgZmllbGRfYTogMTAwLCBmaWVsZF8yOiAxNTAgfVxyXG4gICAgICAgIHNvcnQ6IFtbXCJmaWVsZF9hXCIsIFwiZGVzY1wiXV1cclxuICAgIG93bmVyOiB7dXNlcklkfVxyXG4jIyNcclxuXHJcbk1ldGVvci5tZXRob2RzXHJcbiAgICBcInRhYnVsYXJfc29ydF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgc29ydCktPlxyXG4gICAgICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXHJcbiAgICAgICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLCBvd25lcjogdXNlcklkfSlcclxuICAgICAgICBpZiBzZXR0aW5nXHJcbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5zb3J0XCI6IHNvcnR9fSlcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGRvYyA9IFxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJ1c2VyXCJcclxuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxyXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHt9XHJcbiAgICAgICAgICAgICAgICBvd25lcjogdXNlcklkXHJcblxyXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9XHJcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0XHJcblxyXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpXHJcblxyXG4gICAgXCJ0YWJ1bGFyX2NvbHVtbl93aWR0aF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoKS0+XHJcbiAgICAgICAgdXNlcklkID0gdGhpcy51c2VySWRcclxuICAgICAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsIG93bmVyOiB1c2VySWR9KVxyXG4gICAgICAgIGlmIHNldHRpbmdcclxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LmNvbHVtbl93aWR0aFwiOiBjb2x1bW5fd2lkdGh9fSlcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGRvYyA9IFxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJ1c2VyXCJcclxuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxyXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHt9XHJcbiAgICAgICAgICAgICAgICBvd25lcjogdXNlcklkXHJcblxyXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9XHJcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aFxyXG5cclxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKVxyXG5cclxuICAgIFwiZ3JpZF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoLCBzb3J0KS0+XHJcbiAgICAgICAgdXNlcklkID0gdGhpcy51c2VySWRcclxuICAgICAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCIsIG93bmVyOiB1c2VySWR9KVxyXG4gICAgICAgIGlmIHNldHRpbmdcclxuICAgICAgICAgICAgIyDmr4/mrKHpg73lvLrliLbmlLnlj5hfaWRfYWN0aW9uc+WIl+eahOWuveW6pu+8jOS7peino+WGs+W9k+eUqOaIt+WPquaUueWPmOWtl+auteasoeW6j+iAjOayoeacieaUueWPmOS7u+S9leWtl+auteWuveW6puaXtu+8jOWJjeerr+ayoeacieiuoumYheWIsOWtl+auteasoeW6j+WPmOabtOeahOaVsOaNrueahOmXrumimFxyXG4gICAgICAgICAgICBjb2x1bW5fd2lkdGguX2lkX2FjdGlvbnMgPSBpZiBzZXR0aW5nLnNldHRpbmdzW1wiI3tsaXN0X3ZpZXdfaWR9XCJdPy5jb2x1bW5fd2lkdGg/Ll9pZF9hY3Rpb25zID09IDQ2IHRoZW4gNDcgZWxzZSA0NlxyXG4gICAgICAgICAgICBpZiBzb3J0XHJcbiAgICAgICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uc29ydFwiOiBzb3J0LCBcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5jb2x1bW5fd2lkdGhcIjogY29sdW1uX3dpZHRofX0pXHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5jb2x1bW5fd2lkdGhcIjogY29sdW1uX3dpZHRofX0pXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBkb2MgPVxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJ1c2VyXCJcclxuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxyXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIlxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHt9XHJcbiAgICAgICAgICAgICAgICBvd25lcjogdXNlcklkXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9XHJcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aFxyXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydFxyXG5cclxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKSIsIlxuLypcbiAgICB0eXBlOiBcInVzZXJcIlxuICAgIG9iamVjdF9uYW1lOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICAgIHJlY29yZF9pZDogXCJ7b2JqZWN0X25hbWV9LHtsaXN0dmlld19pZH1cIlxuICAgIHNldHRpbmdzOlxuICAgICAgICBjb2x1bW5fd2lkdGg6IHsgZmllbGRfYTogMTAwLCBmaWVsZF8yOiAxNTAgfVxuICAgICAgICBzb3J0OiBbW1wiZmllbGRfYVwiLCBcImRlc2NcIl1dXG4gICAgb3duZXI6IHt1c2VySWR9XG4gKi9cbk1ldGVvci5tZXRob2RzKHtcbiAgXCJ0YWJ1bGFyX3NvcnRfc2V0dGluZ3NcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgc29ydCkge1xuICAgIHZhciBkb2MsIG9iaiwgc2V0dGluZywgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgIG93bmVyOiB1c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc2V0dGluZykge1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgb2JqID0ge30sXG4gICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5zb3J0XCJdID0gc29ydCxcbiAgICAgICAgICBvYmpcbiAgICAgICAgKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYyA9IHtcbiAgICAgICAgdHlwZTogXCJ1c2VyXCIsXG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgICAgc2V0dGluZ3M6IHt9LFxuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0O1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYyk7XG4gICAgfVxuICB9LFxuICBcInRhYnVsYXJfY29sdW1uX3dpZHRoX3NldHRpbmdzXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbl93aWR0aCkge1xuICAgIHZhciBkb2MsIG9iaiwgc2V0dGluZywgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgIG93bmVyOiB1c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc2V0dGluZykge1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgb2JqID0ge30sXG4gICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5jb2x1bW5fd2lkdGhcIl0gPSBjb2x1bW5fd2lkdGgsXG4gICAgICAgICAgb2JqXG4gICAgICAgIClcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2MgPSB7XG4gICAgICAgIHR5cGU6IFwidXNlclwiLFxuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge307XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5jb2x1bW5fd2lkdGggPSBjb2x1bW5fd2lkdGg7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH0sXG4gIFwiZ3JpZF9zZXR0aW5nc1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5fd2lkdGgsIHNvcnQpIHtcbiAgICB2YXIgZG9jLCBvYmosIG9iajEsIHJlZiwgcmVmMSwgc2V0dGluZywgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIixcbiAgICAgIG93bmVyOiB1c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc2V0dGluZykge1xuICAgICAgY29sdW1uX3dpZHRoLl9pZF9hY3Rpb25zID0gKChyZWYgPSBzZXR0aW5nLnNldHRpbmdzW1wiXCIgKyBsaXN0X3ZpZXdfaWRdKSAhPSBudWxsID8gKHJlZjEgPSByZWYuY29sdW1uX3dpZHRoKSAhPSBudWxsID8gcmVmMS5faWRfYWN0aW9ucyA6IHZvaWQgMCA6IHZvaWQgMCkgPT09IDQ2ID8gNDcgOiA0NjtcbiAgICAgIGlmIChzb3J0KSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDogKFxuICAgICAgICAgICAgb2JqID0ge30sXG4gICAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLnNvcnRcIl0gPSBzb3J0LFxuICAgICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5jb2x1bW5fd2lkdGhcIl0gPSBjb2x1bW5fd2lkdGgsXG4gICAgICAgICAgICBvYmpcbiAgICAgICAgICApXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgICBvYmoxID0ge30sXG4gICAgICAgICAgICBvYmoxW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5jb2x1bW5fd2lkdGhcIl0gPSBjb2x1bW5fd2lkdGgsXG4gICAgICAgICAgICBvYmoxXG4gICAgICAgICAgKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZG9jID0ge1xuICAgICAgICB0eXBlOiBcInVzZXJcIixcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiLFxuICAgICAgICBzZXR0aW5nczoge30sXG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH07XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoO1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnQ7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH1cbn0pO1xuIiwieG1sMmpzID0gcmVxdWlyZSAneG1sMmpzJ1xyXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xyXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcclxubWtkaXJwID0gcmVxdWlyZSAnbWtkaXJwJ1xyXG5cclxubG9nZ2VyID0gbmV3IExvZ2dlciAnRXhwb3J0X1RPX1hNTCdcclxuXHJcbl93cml0ZVhtbEZpbGUgPSAoanNvbk9iaixvYmpOYW1lKSAtPlxyXG5cdCMg6L2seG1sXHJcblx0YnVpbGRlciA9IG5ldyB4bWwyanMuQnVpbGRlcigpXHJcblx0eG1sID0gYnVpbGRlci5idWlsZE9iamVjdCBqc29uT2JqXHJcblxyXG5cdCMg6L2s5Li6YnVmZmVyXHJcblx0c3RyZWFtID0gbmV3IEJ1ZmZlciB4bWxcclxuXHJcblx0IyDmoLnmja7lvZPlpKnml7bpl7TnmoTlubTmnIjml6XkvZzkuLrlrZjlgqjot6/lvoRcclxuXHRub3cgPSBuZXcgRGF0ZVxyXG5cdHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxyXG5cdG1vbnRoID0gbm93LmdldE1vbnRoKCkgKyAxXHJcblx0ZGF5ID0gbm93LmdldERhdGUoKVxyXG5cclxuXHQjIOaWh+S7tui3r+W+hFxyXG5cdGZpbGVQYXRoID0gcGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwnLi4vLi4vLi4vZXhwb3J0LycgKyB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBkYXkgKyAnLycgKyBvYmpOYW1lIClcclxuXHRmaWxlTmFtZSA9IGpzb25PYmo/Ll9pZCArIFwiLnhtbFwiXHJcblx0ZmlsZUFkZHJlc3MgPSBwYXRoLmpvaW4gZmlsZVBhdGgsIGZpbGVOYW1lXHJcblxyXG5cdGlmICFmcy5leGlzdHNTeW5jIGZpbGVQYXRoXHJcblx0XHRta2RpcnAuc3luYyBmaWxlUGF0aFxyXG5cclxuXHQjIOWGmeWFpeaWh+S7tlxyXG5cdGZzLndyaXRlRmlsZSBmaWxlQWRkcmVzcywgc3RyZWFtLCAoZXJyKSAtPlxyXG5cdFx0aWYgZXJyXHJcblx0XHRcdGxvZ2dlci5lcnJvciBcIiN7anNvbk9iai5faWR95YaZ5YWleG1s5paH5Lu25aSx6LSlXCIsZXJyXHJcblx0XHJcblx0cmV0dXJuIGZpbGVQYXRoXHJcblxyXG5cclxuIyDmlbTnkIZGaWVsZHPnmoRqc29u5pWw5o2uXHJcbl9taXhGaWVsZHNEYXRhID0gKG9iaixvYmpOYW1lKSAtPlxyXG5cdCMg5Yid5aeL5YyW5a+56LGh5pWw5o2uXHJcblx0anNvbk9iaiA9IHt9XHJcblx0IyDojrflj5ZmaWVsZHNcclxuXHRvYmpGaWVsZHMgPSBDcmVhdG9yPy5nZXRPYmplY3Qob2JqTmFtZSk/LmZpZWxkc1xyXG5cclxuXHRtaXhEZWZhdWx0ID0gKGZpZWxkX25hbWUpLT5cclxuXHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBvYmpbZmllbGRfbmFtZV0gfHwgXCJcIlxyXG5cclxuXHRtaXhEYXRlID0gKGZpZWxkX25hbWUsdHlwZSktPlxyXG5cdFx0ZGF0ZSA9IG9ialtmaWVsZF9uYW1lXVxyXG5cdFx0aWYgdHlwZSA9PSBcImRhdGVcIlxyXG5cdFx0XHRmb3JtYXQgPSBcIllZWVktTU0tRERcIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW06c3NcIlxyXG5cdFx0aWYgZGF0ZT8gYW5kIGZvcm1hdD9cclxuXHRcdFx0ZGF0ZVN0ciA9IG1vbWVudChkYXRlKS5mb3JtYXQoZm9ybWF0KVxyXG5cdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IGRhdGVTdHIgfHwgXCJcIlxyXG5cclxuXHRtaXhCb29sID0gKGZpZWxkX25hbWUpLT5cclxuXHRcdGlmIG9ialtmaWVsZF9uYW1lXSA9PSB0cnVlXHJcblx0XHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuaYr1wiXHJcblx0XHRlbHNlIGlmIG9ialtmaWVsZF9uYW1lXSA9PSBmYWxzZVxyXG5cdFx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLlkKZcIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gXCJcIlxyXG5cclxuXHQjIOW+queOr+avj+S4qmZpZWxkcyzlubbliKTmlq3lj5blgLxcclxuXHRfLmVhY2ggb2JqRmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cclxuXHRcdHN3aXRjaCBmaWVsZD8udHlwZVxyXG5cdFx0XHR3aGVuIFwiZGF0ZVwiLFwiZGF0ZXRpbWVcIiB0aGVuIG1peERhdGUgZmllbGRfbmFtZSxmaWVsZC50eXBlXHJcblx0XHRcdHdoZW4gXCJib29sZWFuXCIgdGhlbiBtaXhCb29sIGZpZWxkX25hbWVcclxuXHRcdFx0ZWxzZSBtaXhEZWZhdWx0IGZpZWxkX25hbWVcclxuXHJcblx0cmV0dXJuIGpzb25PYmpcclxuXHJcbiMg6I635Y+W5a2Q6KGo5pW055CG5pWw5o2uXHJcbl9taXhSZWxhdGVkRGF0YSA9IChvYmosb2JqTmFtZSkgLT5cclxuXHQjIOWIneWni+WMluWvueixoeaVsOaNrlxyXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IHt9XHJcblxyXG5cdCMg6I635Y+W55u45YWz6KGoXHJcblx0cmVsYXRlZE9iak5hbWVzID0gQ3JlYXRvcj8uZ2V0QWxsUmVsYXRlZE9iamVjdHMgb2JqTmFtZVxyXG5cclxuXHQjIOW+queOr+ebuOWFs+ihqFxyXG5cdHJlbGF0ZWRPYmpOYW1lcy5mb3JFYWNoIChyZWxhdGVkT2JqTmFtZSkgLT5cclxuXHRcdCMg5q+P5Liq6KGo5a6a5LmJ5LiA5Liq5a+56LGh5pWw57uEXHJcblx0XHRyZWxhdGVkVGFibGVEYXRhID0gW11cclxuXHJcblx0XHQjICrorr7nva7lhbPogZTmkJzntKLmn6Xor6LnmoTlrZfmrrVcclxuXHRcdCMg6ZmE5Lu255qE5YWz6IGU5pCc57Si5a2X5q615piv5a6a5q2755qEXHJcblx0XHRpZiByZWxhdGVkT2JqTmFtZSA9PSBcImNtc19maWxlc1wiXHJcblx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwicGFyZW50Lmlkc1wiXHJcblx0XHRlbHNlXHJcblx0XHRcdCMg6I635Y+WZmllbGRzXHJcblx0XHRcdGZpZWxkcyA9IENyZWF0b3I/Lk9iamVjdHNbcmVsYXRlZE9iak5hbWVdPy5maWVsZHNcclxuXHRcdFx0IyDlvqrnjq/mr4/kuKpmaWVsZCzmib7lh7pyZWZlcmVuY2VfdG/nmoTlhbPogZTlrZfmrrVcclxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gXCJcIlxyXG5cdFx0XHRfLmVhY2ggZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cclxuXHRcdFx0XHRpZiBmaWVsZD8ucmVmZXJlbmNlX3RvID09IG9iak5hbWVcclxuXHRcdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IGZpZWxkX25hbWVcclxuXHJcblx0XHQjIOagueaNruaJvuWHuueahOWFs+iBlOWtl+aute+8jOafpeWtkOihqOaVsOaNrlxyXG5cdFx0aWYgcmVsYXRlZF9maWVsZF9uYW1lXHJcblx0XHRcdHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmpOYW1lKVxyXG5cdFx0XHQjIOiOt+WPluWIsOaJgOacieeahOaVsOaNrlxyXG5cdFx0XHRyZWxhdGVkUmVjb3JkTGlzdCA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoe1wiI3tyZWxhdGVkX2ZpZWxkX25hbWV9XCI6b2JqLl9pZH0pLmZldGNoKClcclxuXHRcdFx0IyDlvqrnjq/mr4/kuIDmnaHmlbDmja5cclxuXHRcdFx0cmVsYXRlZFJlY29yZExpc3QuZm9yRWFjaCAocmVsYXRlZE9iaiktPlxyXG5cdFx0XHRcdCMg5pW05ZCIZmllbGRz5pWw5o2uXHJcblx0XHRcdFx0ZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhIHJlbGF0ZWRPYmoscmVsYXRlZE9iak5hbWVcclxuXHRcdFx0XHQjIOaKiuS4gOadoeiusOW9leaPkuWFpeWIsOWvueixoeaVsOe7hOS4rVxyXG5cdFx0XHRcdHJlbGF0ZWRUYWJsZURhdGEucHVzaCBmaWVsZHNEYXRhXHJcblxyXG5cdFx0IyDmiorkuIDkuKrlrZDooajnmoTmiYDmnInmlbDmja7mj5LlhaXliLByZWxhdGVkX29iamVjdHPkuK3vvIzlho3lvqrnjq/kuIvkuIDkuKpcclxuXHRcdHJlbGF0ZWRfb2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0gPSByZWxhdGVkVGFibGVEYXRhXHJcblxyXG5cdHJldHVybiByZWxhdGVkX29iamVjdHNcclxuXHJcbiMgQ3JlYXRvci5FeHBvcnQyeG1sKClcclxuQ3JlYXRvci5FeHBvcnQyeG1sID0gKG9iak5hbWUsIHJlY29yZExpc3QpIC0+XHJcblx0bG9nZ2VyLmluZm8gXCJSdW4gQ3JlYXRvci5FeHBvcnQyeG1sXCJcclxuXHJcblx0Y29uc29sZS50aW1lIFwiQ3JlYXRvci5FeHBvcnQyeG1sXCJcclxuXHJcblx0IyDmtYvor5XmlbDmja5cclxuXHQjIG9iak5hbWUgPSBcImFyY2hpdmVfcmVjb3Jkc1wiXHJcblxyXG5cdCMg5p+l5om+5a+56LGh5pWw5o2uXHJcblx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKVxyXG5cdCMg5rWL6K+V5pWw5o2uXHJcblx0cmVjb3JkTGlzdCA9IGNvbGxlY3Rpb24uZmluZCh7fSkuZmV0Y2goKVxyXG5cclxuXHRyZWNvcmRMaXN0LmZvckVhY2ggKHJlY29yZE9iaiktPlxyXG5cdFx0anNvbk9iaiA9IHt9XHJcblx0XHRqc29uT2JqLl9pZCA9IHJlY29yZE9iai5faWRcclxuXHJcblx0XHQjIOaVtOeQhuS4u+ihqOeahEZpZWxkc+aVsOaNrlxyXG5cdFx0ZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhIHJlY29yZE9iaixvYmpOYW1lXHJcblx0XHRqc29uT2JqW29iak5hbWVdID0gZmllbGRzRGF0YVxyXG5cclxuXHRcdCMg5pW055CG55u45YWz6KGo5pWw5o2uXHJcblx0XHRyZWxhdGVkX29iamVjdHMgPSBfbWl4UmVsYXRlZERhdGEgcmVjb3JkT2JqLG9iak5hbWVcclxuXHJcblx0XHRqc29uT2JqW1wicmVsYXRlZF9vYmplY3RzXCJdID0gcmVsYXRlZF9vYmplY3RzXHJcblxyXG5cdFx0IyDovazkuLp4bWzkv53lrZjmlofku7ZcclxuXHRcdGZpbGVQYXRoID0gX3dyaXRlWG1sRmlsZSBqc29uT2JqLG9iak5hbWVcclxuXHJcblx0Y29uc29sZS50aW1lRW5kIFwiQ3JlYXRvci5FeHBvcnQyeG1sXCJcclxuXHRyZXR1cm4gZmlsZVBhdGgiLCJ2YXIgX21peEZpZWxkc0RhdGEsIF9taXhSZWxhdGVkRGF0YSwgX3dyaXRlWG1sRmlsZSwgZnMsIGxvZ2dlciwgbWtkaXJwLCBwYXRoLCB4bWwyanM7XG5cbnhtbDJqcyA9IHJlcXVpcmUoJ3htbDJqcycpO1xuXG5mcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cbnBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbm1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpO1xuXG5sb2dnZXIgPSBuZXcgTG9nZ2VyKCdFeHBvcnRfVE9fWE1MJyk7XG5cbl93cml0ZVhtbEZpbGUgPSBmdW5jdGlvbihqc29uT2JqLCBvYmpOYW1lKSB7XG4gIHZhciBidWlsZGVyLCBkYXksIGZpbGVBZGRyZXNzLCBmaWxlTmFtZSwgZmlsZVBhdGgsIG1vbnRoLCBub3csIHN0cmVhbSwgeG1sLCB5ZWFyO1xuICBidWlsZGVyID0gbmV3IHhtbDJqcy5CdWlsZGVyKCk7XG4gIHhtbCA9IGJ1aWxkZXIuYnVpbGRPYmplY3QoanNvbk9iaik7XG4gIHN0cmVhbSA9IG5ldyBCdWZmZXIoeG1sKTtcbiAgbm93ID0gbmV3IERhdGU7XG4gIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgbW9udGggPSBub3cuZ2V0TW9udGgoKSArIDE7XG4gIGRheSA9IG5vdy5nZXREYXRlKCk7XG4gIGZpbGVQYXRoID0gcGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwgJy4uLy4uLy4uL2V4cG9ydC8nICsgeWVhciArICcvJyArIG1vbnRoICsgJy8nICsgZGF5ICsgJy8nICsgb2JqTmFtZSk7XG4gIGZpbGVOYW1lID0gKGpzb25PYmogIT0gbnVsbCA/IGpzb25PYmouX2lkIDogdm9pZCAwKSArIFwiLnhtbFwiO1xuICBmaWxlQWRkcmVzcyA9IHBhdGguam9pbihmaWxlUGF0aCwgZmlsZU5hbWUpO1xuICBpZiAoIWZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XG4gICAgbWtkaXJwLnN5bmMoZmlsZVBhdGgpO1xuICB9XG4gIGZzLndyaXRlRmlsZShmaWxlQWRkcmVzcywgc3RyZWFtLCBmdW5jdGlvbihlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICByZXR1cm4gbG9nZ2VyLmVycm9yKGpzb25PYmouX2lkICsgXCLlhpnlhaV4bWzmlofku7blpLHotKVcIiwgZXJyKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmlsZVBhdGg7XG59O1xuXG5fbWl4RmllbGRzRGF0YSA9IGZ1bmN0aW9uKG9iaiwgb2JqTmFtZSkge1xuICB2YXIganNvbk9iaiwgbWl4Qm9vbCwgbWl4RGF0ZSwgbWl4RGVmYXVsdCwgb2JqRmllbGRzLCByZWY7XG4gIGpzb25PYmogPSB7fTtcbiAgb2JqRmllbGRzID0gdHlwZW9mIENyZWF0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgQ3JlYXRvciAhPT0gbnVsbCA/IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmpOYW1lKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIG1peERlZmF1bHQgPSBmdW5jdGlvbihmaWVsZF9uYW1lKSB7XG4gICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBvYmpbZmllbGRfbmFtZV0gfHwgXCJcIjtcbiAgfTtcbiAgbWl4RGF0ZSA9IGZ1bmN0aW9uKGZpZWxkX25hbWUsIHR5cGUpIHtcbiAgICB2YXIgZGF0ZSwgZGF0ZVN0ciwgZm9ybWF0O1xuICAgIGRhdGUgPSBvYmpbZmllbGRfbmFtZV07XG4gICAgaWYgKHR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICBmb3JtYXQgPSBcIllZWVktTU0tRERcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9ybWF0ID0gXCJZWVlZLU1NLUREIEhIOm1tOnNzXCI7XG4gICAgfVxuICAgIGlmICgoZGF0ZSAhPSBudWxsKSAmJiAoZm9ybWF0ICE9IG51bGwpKSB7XG4gICAgICBkYXRlU3RyID0gbW9tZW50KGRhdGUpLmZvcm1hdChmb3JtYXQpO1xuICAgIH1cbiAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IGRhdGVTdHIgfHwgXCJcIjtcbiAgfTtcbiAgbWl4Qm9vbCA9IGZ1bmN0aW9uKGZpZWxkX25hbWUpIHtcbiAgICBpZiAob2JqW2ZpZWxkX25hbWVdID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5pivXCI7XG4gICAgfSBlbHNlIGlmIChvYmpbZmllbGRfbmFtZV0gPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5ZCmXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gXCJcIjtcbiAgICB9XG4gIH07XG4gIF8uZWFjaChvYmpGaWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgc3dpdGNoIChmaWVsZCAhPSBudWxsID8gZmllbGQudHlwZSA6IHZvaWQgMCkge1xuICAgICAgY2FzZSBcImRhdGVcIjpcbiAgICAgIGNhc2UgXCJkYXRldGltZVwiOlxuICAgICAgICByZXR1cm4gbWl4RGF0ZShmaWVsZF9uYW1lLCBmaWVsZC50eXBlKTtcbiAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgIHJldHVybiBtaXhCb29sKGZpZWxkX25hbWUpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG1peERlZmF1bHQoZmllbGRfbmFtZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGpzb25PYmo7XG59O1xuXG5fbWl4UmVsYXRlZERhdGEgPSBmdW5jdGlvbihvYmosIG9iak5hbWUpIHtcbiAgdmFyIHJlbGF0ZWRPYmpOYW1lcywgcmVsYXRlZF9vYmplY3RzO1xuICByZWxhdGVkX29iamVjdHMgPSB7fTtcbiAgcmVsYXRlZE9iak5hbWVzID0gdHlwZW9mIENyZWF0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgQ3JlYXRvciAhPT0gbnVsbCA/IENyZWF0b3IuZ2V0QWxsUmVsYXRlZE9iamVjdHMob2JqTmFtZSkgOiB2b2lkIDA7XG4gIHJlbGF0ZWRPYmpOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKHJlbGF0ZWRPYmpOYW1lKSB7XG4gICAgdmFyIGZpZWxkcywgb2JqMSwgcmVmLCByZWxhdGVkQ29sbGVjdGlvbiwgcmVsYXRlZFJlY29yZExpc3QsIHJlbGF0ZWRUYWJsZURhdGEsIHJlbGF0ZWRfZmllbGRfbmFtZTtcbiAgICByZWxhdGVkVGFibGVEYXRhID0gW107XG4gICAgaWYgKHJlbGF0ZWRPYmpOYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSBcInBhcmVudC5pZHNcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZmllbGRzID0gdHlwZW9mIENyZWF0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgQ3JlYXRvciAhPT0gbnVsbCA/IChyZWYgPSBDcmVhdG9yLk9iamVjdHNbcmVsYXRlZE9iak5hbWVdKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwiXCI7XG4gICAgICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgICAgICBpZiAoKGZpZWxkICE9IG51bGwgPyBmaWVsZC5yZWZlcmVuY2VfdG8gOiB2b2lkIDApID09PSBvYmpOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfZmllbGRfbmFtZSA9IGZpZWxkX25hbWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAocmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICByZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqTmFtZSk7XG4gICAgICByZWxhdGVkUmVjb3JkTGlzdCA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoKFxuICAgICAgICBvYmoxID0ge30sXG4gICAgICAgIG9iajFbXCJcIiArIHJlbGF0ZWRfZmllbGRfbmFtZV0gPSBvYmouX2lkLFxuICAgICAgICBvYmoxXG4gICAgICApKS5mZXRjaCgpO1xuICAgICAgcmVsYXRlZFJlY29yZExpc3QuZm9yRWFjaChmdW5jdGlvbihyZWxhdGVkT2JqKSB7XG4gICAgICAgIHZhciBmaWVsZHNEYXRhO1xuICAgICAgICBmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEocmVsYXRlZE9iaiwgcmVsYXRlZE9iak5hbWUpO1xuICAgICAgICByZXR1cm4gcmVsYXRlZFRhYmxlRGF0YS5wdXNoKGZpZWxkc0RhdGEpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZWxhdGVkX29iamVjdHNbcmVsYXRlZE9iak5hbWVdID0gcmVsYXRlZFRhYmxlRGF0YTtcbiAgfSk7XG4gIHJldHVybiByZWxhdGVkX29iamVjdHM7XG59O1xuXG5DcmVhdG9yLkV4cG9ydDJ4bWwgPSBmdW5jdGlvbihvYmpOYW1lLCByZWNvcmRMaXN0KSB7XG4gIHZhciBjb2xsZWN0aW9uO1xuICBsb2dnZXIuaW5mbyhcIlJ1biBDcmVhdG9yLkV4cG9ydDJ4bWxcIik7XG4gIGNvbnNvbGUudGltZShcIkNyZWF0b3IuRXhwb3J0MnhtbFwiKTtcbiAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKTtcbiAgcmVjb3JkTGlzdCA9IGNvbGxlY3Rpb24uZmluZCh7fSkuZmV0Y2goKTtcbiAgcmVjb3JkTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHJlY29yZE9iaikge1xuICAgIHZhciBmaWVsZHNEYXRhLCBmaWxlUGF0aCwganNvbk9iaiwgcmVsYXRlZF9vYmplY3RzO1xuICAgIGpzb25PYmogPSB7fTtcbiAgICBqc29uT2JqLl9pZCA9IHJlY29yZE9iai5faWQ7XG4gICAgZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhKHJlY29yZE9iaiwgb2JqTmFtZSk7XG4gICAganNvbk9ialtvYmpOYW1lXSA9IGZpZWxkc0RhdGE7XG4gICAgcmVsYXRlZF9vYmplY3RzID0gX21peFJlbGF0ZWREYXRhKHJlY29yZE9iaiwgb2JqTmFtZSk7XG4gICAganNvbk9ialtcInJlbGF0ZWRfb2JqZWN0c1wiXSA9IHJlbGF0ZWRfb2JqZWN0cztcbiAgICByZXR1cm4gZmlsZVBhdGggPSBfd3JpdGVYbWxGaWxlKGpzb25PYmosIG9iak5hbWUpO1xuICB9KTtcbiAgY29uc29sZS50aW1lRW5kKFwiQ3JlYXRvci5FeHBvcnQyeG1sXCIpO1xuICByZXR1cm4gZmlsZVBhdGg7XG59O1xuIiwiTWV0ZW9yLm1ldGhvZHMgXHJcblx0cmVsYXRlZF9vYmplY3RzX3JlY29yZHM6IChvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpLT5cclxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXHJcblx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIlxyXG5cdFx0XHRzZWxlY3RvciA9IHtcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWR9XHJcblx0XHRlbHNlXHJcblx0XHRcdHNlbGVjdG9yID0ge3NwYWNlOiBzcGFjZUlkfVxyXG5cdFx0XHJcblx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcclxuXHRcdFx0IyDpmYTku7bnmoTlhbPogZTmkJzntKLmnaHku7bmmK/lrprmrbvnmoRcclxuXHRcdFx0c2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lXHJcblx0XHRcdHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdXHJcblx0XHRlbHNlXHJcblx0XHRcdHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWRcclxuXHJcblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxyXG5cdFx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcclxuXHRcdFx0c2VsZWN0b3Iub3duZXIgPSB1c2VySWRcclxuXHRcdFxyXG5cdFx0cmVsYXRlZF9yZWNvcmRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpXHJcblx0XHRyZXR1cm4gcmVsYXRlZF9yZWNvcmRzLmNvdW50KCkiLCJNZXRlb3IubWV0aG9kcyh7XG4gIHJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpIHtcbiAgICB2YXIgcGVybWlzc2lvbnMsIHJlbGF0ZWRfcmVjb3Jkcywgc2VsZWN0b3IsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiKSB7XG4gICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgXCJtZXRhZGF0YS5zcGFjZVwiOiBzcGFjZUlkXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgICBzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWU7XG4gICAgICBzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZDtcbiAgICB9XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy5hbGxvd1JlYWQpIHtcbiAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICAgIH1cbiAgICByZWxhdGVkX3JlY29yZHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlbGF0ZWRfcmVjb3Jkcy5jb3VudCgpO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0Z2V0UGVuZGluZ1NwYWNlSW5mbzogKGludml0ZXJJZCwgc3BhY2VJZCktPlxyXG5cdFx0aW52aXRlck5hbWUgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IGludml0ZXJJZH0pLm5hbWVcclxuXHRcdHNwYWNlTmFtZSA9IGRiLnNwYWNlcy5maW5kT25lKHtfaWQ6IHNwYWNlSWR9KS5uYW1lXHJcblxyXG5cdFx0cmV0dXJuIHtpbnZpdGVyOiBpbnZpdGVyTmFtZSwgc3BhY2U6IHNwYWNlTmFtZX1cclxuXHJcblx0cmVmdXNlSm9pblNwYWNlOiAoX2lkKS0+XHJcblx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IF9pZH0seyRzZXQ6IHtpbnZpdGVfc3RhdGU6IFwicmVmdXNlZFwifX0pXHJcblxyXG5cdGFjY2VwdEpvaW5TcGFjZTogKF9pZCktPlxyXG5cdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBfaWR9LHskc2V0OiB7aW52aXRlX3N0YXRlOiBcImFjY2VwdGVkXCIsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9fSlcclxuXHJcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgZ2V0UGVuZGluZ1NwYWNlSW5mbzogZnVuY3Rpb24oaW52aXRlcklkLCBzcGFjZUlkKSB7XG4gICAgdmFyIGludml0ZXJOYW1lLCBzcGFjZU5hbWU7XG4gICAgaW52aXRlck5hbWUgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogaW52aXRlcklkXG4gICAgfSkubmFtZTtcbiAgICBzcGFjZU5hbWUgPSBkYi5zcGFjZXMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHNwYWNlSWRcbiAgICB9KS5uYW1lO1xuICAgIHJldHVybiB7XG4gICAgICBpbnZpdGVyOiBpbnZpdGVyTmFtZSxcbiAgICAgIHNwYWNlOiBzcGFjZU5hbWVcbiAgICB9O1xuICB9LFxuICByZWZ1c2VKb2luU3BhY2U6IGZ1bmN0aW9uKF9pZCkge1xuICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBpbnZpdGVfc3RhdGU6IFwicmVmdXNlZFwiXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIGFjY2VwdEpvaW5TcGFjZTogZnVuY3Rpb24oX2lkKSB7XG4gICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGludml0ZV9zdGF0ZTogXCJhY2NlcHRlZFwiLFxuICAgICAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggXCJjcmVhdG9yX29iamVjdF9yZWNvcmRcIiwgKG9iamVjdF9uYW1lLCBpZCwgc3BhY2VfaWQpLT5cclxuXHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZClcclxuXHRpZiBjb2xsZWN0aW9uXHJcblx0XHRyZXR1cm4gY29sbGVjdGlvbi5maW5kKHtfaWQ6IGlkfSlcclxuXHJcbiIsIk1ldGVvci5wdWJsaXNoKFwiY3JlYXRvcl9vYmplY3RfcmVjb3JkXCIsIGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBpZCwgc3BhY2VfaWQpIHtcbiAgdmFyIGNvbGxlY3Rpb247XG4gIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKTtcbiAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5maW5kKHtcbiAgICAgIF9pZDogaWRcbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IucHVibGlzaENvbXBvc2l0ZSBcInN0ZWVkb3Nfb2JqZWN0X3RhYnVsYXJcIiwgKHRhYmxlTmFtZSwgaWRzLCBmaWVsZHMsIHNwYWNlSWQpLT5cclxuXHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0Y2hlY2sodGFibGVOYW1lLCBTdHJpbmcpO1xyXG5cdGNoZWNrKGlkcywgQXJyYXkpO1xyXG5cdGNoZWNrKGZpZWxkcywgTWF0Y2guT3B0aW9uYWwoT2JqZWN0KSk7XHJcblxyXG5cdF9vYmplY3RfbmFtZSA9IHRhYmxlTmFtZS5yZXBsYWNlKFwiY3JlYXRvcl9cIixcIlwiKVxyXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfb2JqZWN0X25hbWUsIHNwYWNlSWQpXHJcblxyXG5cdGlmIHNwYWNlSWRcclxuXHRcdF9vYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0TmFtZShfb2JqZWN0KVxyXG5cclxuXHRvYmplY3RfY29sbGVjaXRvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihfb2JqZWN0X25hbWUpXHJcblxyXG5cclxuXHRfZmllbGRzID0gX29iamVjdD8uZmllbGRzXHJcblx0aWYgIV9maWVsZHMgfHwgIW9iamVjdF9jb2xsZWNpdG9uXHJcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdHJlZmVyZW5jZV9maWVsZHMgPSBfLmZpbHRlciBfZmllbGRzLCAoZiktPlxyXG5cdFx0cmV0dXJuIF8uaXNGdW5jdGlvbihmLnJlZmVyZW5jZV90bykgfHwgIV8uaXNFbXB0eShmLnJlZmVyZW5jZV90bylcclxuXHJcblx0c2VsZiA9IHRoaXNcclxuXHJcblx0c2VsZi51bmJsb2NrKCk7XHJcblxyXG5cdGlmIHJlZmVyZW5jZV9maWVsZHMubGVuZ3RoID4gMFxyXG5cdFx0ZGF0YSA9IHtcclxuXHRcdFx0ZmluZDogKCktPlxyXG5cdFx0XHRcdHNlbGYudW5ibG9jaygpO1xyXG5cdFx0XHRcdGZpZWxkX2tleXMgPSB7fVxyXG5cdFx0XHRcdF8uZWFjaCBfLmtleXMoZmllbGRzKSwgKGYpLT5cclxuXHRcdFx0XHRcdHVubGVzcyAvXFx3KyhcXC5cXCQpezF9XFx3Py8udGVzdChmKVxyXG5cdFx0XHRcdFx0XHRmaWVsZF9rZXlzW2ZdID0gMVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtfaWQ6IHskaW46IGlkc319LCB7ZmllbGRzOiBmaWVsZF9rZXlzfSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZGF0YS5jaGlsZHJlbiA9IFtdXHJcblxyXG5cdFx0a2V5cyA9IF8ua2V5cyhmaWVsZHMpXHJcblxyXG5cdFx0aWYga2V5cy5sZW5ndGggPCAxXHJcblx0XHRcdGtleXMgPSBfLmtleXMoX2ZpZWxkcylcclxuXHJcblx0XHRfa2V5cyA9IFtdXHJcblxyXG5cdFx0a2V5cy5mb3JFYWNoIChrZXkpLT5cclxuXHRcdFx0aWYgX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXVxyXG5cdFx0XHRcdF9rZXlzID0gX2tleXMuY29uY2F0KF8ubWFwKF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ10sIChrKS0+XHJcblx0XHRcdFx0XHRyZXR1cm4ga2V5ICsgJy4nICsga1xyXG5cdFx0XHRcdCkpXHJcblx0XHRcdF9rZXlzLnB1c2goa2V5KVxyXG5cclxuXHRcdF9rZXlzLmZvckVhY2ggKGtleSktPlxyXG5cdFx0XHRyZWZlcmVuY2VfZmllbGQgPSBfZmllbGRzW2tleV1cclxuXHJcblx0XHRcdGlmIHJlZmVyZW5jZV9maWVsZCAmJiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykpICAjIGFuZCBDcmVhdG9yLkNvbGxlY3Rpb25zW3JlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG9dXHJcblx0XHRcdFx0ZGF0YS5jaGlsZHJlbi5wdXNoIHtcclxuXHRcdFx0XHRcdGZpbmQ6IChwYXJlbnQpIC0+XHJcblx0XHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRcdHNlbGYudW5ibG9jaygpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRxdWVyeSA9IHt9XHJcblxyXG5cdFx0XHRcdFx0XHRcdCMg6KGo5qC85a2Q5a2X5q6154m55q6K5aSE55CGXHJcblx0XHRcdFx0XHRcdFx0aWYgL1xcdysoXFwuXFwkXFwuKXsxfVxcdysvLnRlc3Qoa2V5KVxyXG5cdFx0XHRcdFx0XHRcdFx0cF9rID0ga2V5LnJlcGxhY2UoLyhcXHcrKVxcLlxcJFxcLlxcdysvaWcsIFwiJDFcIilcclxuXHRcdFx0XHRcdFx0XHRcdHNfayA9IGtleS5yZXBsYWNlKC9cXHcrXFwuXFwkXFwuKFxcdyspL2lnLCBcIiQxXCIpXHJcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfaWRzID0gcGFyZW50W3Bfa10uZ2V0UHJvcGVydHkoc19rKVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV9pZHMgPSBrZXkuc3BsaXQoJy4nKS5yZWR1Y2UgKG8sIHgpIC0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bz9beF1cclxuXHRcdFx0XHRcdFx0XHRcdCwgcGFyZW50XHJcblxyXG5cdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG9cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90bygpXHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShyZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBfLmlzT2JqZWN0KHJlZmVyZW5jZV9pZHMpICYmICFfLmlzQXJyYXkocmVmZXJlbmNlX2lkcylcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX2lkcy5vXHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV9pZHMgPSByZWZlcmVuY2VfaWRzLmlkcyB8fCBbXVxyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gW11cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpXHJcblx0XHRcdFx0XHRcdFx0XHRxdWVyeS5faWQgPSB7JGluOiByZWZlcmVuY2VfaWRzfVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHJlZmVyZW5jZV9pZHNcclxuXHJcblx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlZmVyZW5jZV90bywgc3BhY2VJZClcclxuXHJcblx0XHRcdFx0XHRcdFx0bmFtZV9maWVsZF9rZXkgPSByZWZlcmVuY2VfdG9fb2JqZWN0Lk5BTUVfRklFTERfS0VZXHJcblxyXG5cdFx0XHRcdFx0XHRcdGNoaWxkcmVuX2ZpZWxkcyA9IHtfaWQ6IDEsIHNwYWNlOiAxfVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiBuYW1lX2ZpZWxkX2tleVxyXG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW5fZmllbGRzW25hbWVfZmllbGRfa2V5XSA9IDFcclxuXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8sIHNwYWNlSWQpLmZpbmQocXVlcnksIHtcclxuXHRcdFx0XHRcdFx0XHRcdGZpZWxkczogY2hpbGRyZW5fZmllbGRzXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhyZWZlcmVuY2VfdG8sIHBhcmVudCwgZSlcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gW11cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGFcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRmaW5kOiAoKS0+XHJcblx0XHRcdFx0c2VsZi51bmJsb2NrKCk7XHJcblx0XHRcdFx0cmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe19pZDogeyRpbjogaWRzfX0sIHtmaWVsZHM6IGZpZWxkc30pXHJcblx0XHR9O1xyXG5cclxuIiwiTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUoXCJzdGVlZG9zX29iamVjdF90YWJ1bGFyXCIsIGZ1bmN0aW9uKHRhYmxlTmFtZSwgaWRzLCBmaWVsZHMsIHNwYWNlSWQpIHtcbiAgdmFyIF9maWVsZHMsIF9rZXlzLCBfb2JqZWN0LCBfb2JqZWN0X25hbWUsIGRhdGEsIGtleXMsIG9iamVjdF9jb2xsZWNpdG9uLCByZWZlcmVuY2VfZmllbGRzLCBzZWxmO1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBjaGVjayh0YWJsZU5hbWUsIFN0cmluZyk7XG4gIGNoZWNrKGlkcywgQXJyYXkpO1xuICBjaGVjayhmaWVsZHMsIE1hdGNoLk9wdGlvbmFsKE9iamVjdCkpO1xuICBfb2JqZWN0X25hbWUgPSB0YWJsZU5hbWUucmVwbGFjZShcImNyZWF0b3JfXCIsIFwiXCIpO1xuICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX29iamVjdF9uYW1lLCBzcGFjZUlkKTtcbiAgaWYgKHNwYWNlSWQpIHtcbiAgICBfb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldE9iamVjdE5hbWUoX29iamVjdCk7XG4gIH1cbiAgb2JqZWN0X2NvbGxlY2l0b24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oX29iamVjdF9uYW1lKTtcbiAgX2ZpZWxkcyA9IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZmllbGRzIDogdm9pZCAwO1xuICBpZiAoIV9maWVsZHMgfHwgIW9iamVjdF9jb2xsZWNpdG9uKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZWZlcmVuY2VfZmllbGRzID0gXy5maWx0ZXIoX2ZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgIHJldHVybiBfLmlzRnVuY3Rpb24oZi5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkoZi5yZWZlcmVuY2VfdG8pO1xuICB9KTtcbiAgc2VsZiA9IHRoaXM7XG4gIHNlbGYudW5ibG9jaygpO1xuICBpZiAocmVmZXJlbmNlX2ZpZWxkcy5sZW5ndGggPiAwKSB7XG4gICAgZGF0YSA9IHtcbiAgICAgIGZpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZmllbGRfa2V5cztcbiAgICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICAgIGZpZWxkX2tleXMgPSB7fTtcbiAgICAgICAgXy5lYWNoKF8ua2V5cyhmaWVsZHMpLCBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgaWYgKCEvXFx3KyhcXC5cXCQpezF9XFx3Py8udGVzdChmKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkX2tleXNbZl0gPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtcbiAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICRpbjogaWRzXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBmaWVsZF9rZXlzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgZGF0YS5jaGlsZHJlbiA9IFtdO1xuICAgIGtleXMgPSBfLmtleXMoZmllbGRzKTtcbiAgICBpZiAoa2V5cy5sZW5ndGggPCAxKSB7XG4gICAgICBrZXlzID0gXy5rZXlzKF9maWVsZHMpO1xuICAgIH1cbiAgICBfa2V5cyA9IFtdO1xuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmIChfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddKSB7XG4gICAgICAgIF9rZXlzID0gX2tleXMuY29uY2F0KF8ubWFwKF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ10sIGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICByZXR1cm4ga2V5ICsgJy4nICsgaztcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9rZXlzLnB1c2goa2V5KTtcbiAgICB9KTtcbiAgICBfa2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIHJlZmVyZW5jZV9maWVsZDtcbiAgICAgIHJlZmVyZW5jZV9maWVsZCA9IF9maWVsZHNba2V5XTtcbiAgICAgIGlmIChyZWZlcmVuY2VfZmllbGQgJiYgKF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pKSkge1xuICAgICAgICByZXR1cm4gZGF0YS5jaGlsZHJlbi5wdXNoKHtcbiAgICAgICAgICBmaW5kOiBmdW5jdGlvbihwYXJlbnQpIHtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbl9maWVsZHMsIGUsIG5hbWVfZmllbGRfa2V5LCBwX2ssIHF1ZXJ5LCByZWZlcmVuY2VfaWRzLCByZWZlcmVuY2VfdG8sIHJlZmVyZW5jZV90b19vYmplY3QsIHNfaztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHNlbGYudW5ibG9jaygpO1xuICAgICAgICAgICAgICBxdWVyeSA9IHt9O1xuICAgICAgICAgICAgICBpZiAoL1xcdysoXFwuXFwkXFwuKXsxfVxcdysvLnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgIHBfayA9IGtleS5yZXBsYWNlKC8oXFx3KylcXC5cXCRcXC5cXHcrL2lnLCBcIiQxXCIpO1xuICAgICAgICAgICAgICAgIHNfayA9IGtleS5yZXBsYWNlKC9cXHcrXFwuXFwkXFwuKFxcdyspL2lnLCBcIiQxXCIpO1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZV9pZHMgPSBwYXJlbnRbcF9rXS5nZXRQcm9wZXJ0eShzX2spO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZV9pZHMgPSBrZXkuc3BsaXQoJy4nKS5yZWR1Y2UoZnVuY3Rpb24obywgeCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIG8gIT0gbnVsbCA/IG9beF0gOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgfSwgcGFyZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8oKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChyZWZlcmVuY2VfaWRzKSAmJiAhXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpKSB7XG4gICAgICAgICAgICAgICAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfaWRzLm87XG4gICAgICAgICAgICAgICAgICByZWZlcmVuY2VfaWRzID0gcmVmZXJlbmNlX2lkcy5pZHMgfHwgW107XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKF8uaXNBcnJheShyZWZlcmVuY2VfaWRzKSkge1xuICAgICAgICAgICAgICAgIHF1ZXJ5Ll9pZCA9IHtcbiAgICAgICAgICAgICAgICAgICRpbjogcmVmZXJlbmNlX2lkc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcXVlcnkuX2lkID0gcmVmZXJlbmNlX2lkcztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWZlcmVuY2VfdG9fb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVmZXJlbmNlX3RvLCBzcGFjZUlkKTtcbiAgICAgICAgICAgICAgbmFtZV9maWVsZF9rZXkgPSByZWZlcmVuY2VfdG9fb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICAgICAgICAgICAgICBjaGlsZHJlbl9maWVsZHMgPSB7XG4gICAgICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgICAgIHNwYWNlOiAxXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGlmIChuYW1lX2ZpZWxkX2tleSkge1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuX2ZpZWxkc1tuYW1lX2ZpZWxkX2tleV0gPSAxO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kKHF1ZXJ5LCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiBjaGlsZHJlbl9maWVsZHNcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlZmVyZW5jZV90bywgcGFyZW50LCBlKTtcbiAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLnVuYmxvY2soKTtcbiAgICAgICAgcmV0dXJuIG9iamVjdF9jb2xsZWNpdG9uLmZpbmQoe1xuICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgJGluOiBpZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoIFwib2JqZWN0X2xpc3R2aWV3c1wiLCAob2JqZWN0X25hbWUsIHNwYWNlSWQpLT5cclxuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXHJcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNwYWNlOiBzcGFjZUlkICxcIiRvclwiOlt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XX0pIiwiTWV0ZW9yLnB1Ymxpc2ggXCJ1c2VyX3RhYnVsYXJfc2V0dGluZ3NcIiwgKG9iamVjdF9uYW1lKS0+XHJcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxyXG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZCh7b2JqZWN0X25hbWU6IHskaW46IG9iamVjdF9uYW1lfSwgcmVjb3JkX2lkOiB7JGluOiBbXCJvYmplY3RfbGlzdHZpZXdzXCIsIFwib2JqZWN0X2dyaWR2aWV3c1wiXX0sIG93bmVyOiB1c2VySWR9KVxyXG4iLCJNZXRlb3IucHVibGlzaCBcInJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzXCIsIChvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpLT5cclxuXHR1c2VySWQgPSB0aGlzLnVzZXJJZFxyXG5cdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXHJcblx0XHRzZWxlY3RvciA9IHtcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWR9XHJcblx0ZWxzZVxyXG5cdFx0c2VsZWN0b3IgPSB7c3BhY2U6IHNwYWNlSWR9XHJcblx0XHJcblx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXHJcblx0XHQjIOmZhOS7tueahOWFs+iBlOaQnOe0ouadoeS7tuaYr+Wumuatu+eahFxyXG5cdFx0c2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lXHJcblx0XHRzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXVxyXG5cdGVsc2VcclxuXHRcdHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWRcclxuXHJcblx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcclxuXHRpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLmFsbG93UmVhZFxyXG5cdFx0c2VsZWN0b3Iub3duZXIgPSB1c2VySWRcclxuXHRcclxuXHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpIiwiTWV0ZW9yLnB1Ymxpc2goXCJyZWxhdGVkX29iamVjdHNfcmVjb3Jkc1wiLCBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpIHtcbiAgdmFyIHBlcm1pc3Npb25zLCBzZWxlY3RvciwgdXNlcklkO1xuICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIikge1xuICAgIHNlbGVjdG9yID0ge1xuICAgICAgXCJtZXRhZGF0YS5zcGFjZVwiOiBzcGFjZUlkXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfTtcbiAgfVxuICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIikge1xuICAgIHNlbGVjdG9yW1wicGFyZW50Lm9cIl0gPSBvYmplY3RfbmFtZTtcbiAgICBzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXTtcbiAgfSBlbHNlIHtcbiAgICBzZWxlY3RvcltyZWxhdGVkX2ZpZWxkX25hbWVdID0gcmVjb3JkX2lkO1xuICB9XG4gIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLmFsbG93UmVhZCkge1xuICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICB9XG4gIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvcik7XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoICdzcGFjZV91c2VyX2luZm8nLCAoc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9KSIsIlxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHJcblx0TWV0ZW9yLnB1Ymxpc2ggJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJywgKHNwYWNlSWQpLT5cclxuXHJcblx0XHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRcdHVubGVzcyBzcGFjZUlkXHJcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0XHRzZWxlY3RvciA9XHJcblx0XHRcdHNwYWNlOiBzcGFjZUlkXHJcblx0XHRcdGtleTogJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJ1xyXG5cclxuXHRcdHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKSIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ2NvbnRhY3RzX3ZpZXdfbGltaXRzJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBzZWxlY3RvcjtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBrZXk6ICdjb250YWN0c192aWV3X2xpbWl0cydcbiAgICB9O1xuICAgIHJldHVybiBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHNlbGVjdG9yKTtcbiAgfSk7XG59XG4iLCJcclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblxyXG5cdE1ldGVvci5wdWJsaXNoICdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycycsIChzcGFjZUlkKS0+XHJcblxyXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXHJcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0XHR1bmxlc3Mgc3BhY2VJZFxyXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdFx0c2VsZWN0b3IgPVxyXG5cdFx0XHRzcGFjZTogc3BhY2VJZFxyXG5cdFx0XHRrZXk6ICdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycydcclxuXHJcblx0XHRyZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3RvcikiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdjb250YWN0c19ub19mb3JjZV9waG9uZV91c2VycycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAga2V5OiAnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnXG4gICAgfTtcbiAgICByZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3Rvcik7XG4gIH0pO1xufVxuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0TWV0ZW9yLnB1Ymxpc2ggJ3NwYWNlX25lZWRfdG9fY29uZmlybScsICgpLT5cclxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXHJcblx0XHRyZXR1cm4gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdXNlcklkLCBpbnZpdGVfc3RhdGU6IFwicGVuZGluZ1wifSkiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdzcGFjZV9uZWVkX3RvX2NvbmZpcm0nLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIGludml0ZV9zdGF0ZTogXCJwZW5kaW5nXCJcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJwZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9XHJcblxyXG5wZXJtaXNzaW9uTWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGbG93UGVybWlzc2lvbnMgPSAoZmxvd19pZCwgdXNlcl9pZCkgLT5cclxuXHQjIOagueaNrjpmbG93X2lk5p+l5Yiw5a+55bqU55qEZmxvd1xyXG5cdGZsb3cgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3coZmxvd19pZClcclxuXHRzcGFjZV9pZCA9IGZsb3cuc3BhY2VcclxuXHQjIOagueaNrnNwYWNlX2lk5ZKMOnVzZXJfaWTliLBvcmdhbml6YXRpb25z6KGo5Lit5p+l5Yiw55So5oi35omA5bGe5omA5pyJ55qEb3JnX2lk77yI5YyF5ous5LiK57qn57uESUTvvIlcclxuXHRvcmdfaWRzID0gbmV3IEFycmF5XHJcblx0b3JnYW5pemF0aW9ucyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XHJcblx0XHRzcGFjZTogc3BhY2VfaWQsIHVzZXJzOiB1c2VyX2lkIH0sIHsgZmllbGRzOiB7IHBhcmVudHM6IDEgfSB9KS5mZXRjaCgpXHJcblx0Xy5lYWNoKG9yZ2FuaXphdGlvbnMsIChvcmcpIC0+XHJcblx0XHRvcmdfaWRzLnB1c2gob3JnLl9pZClcclxuXHRcdGlmIG9yZy5wYXJlbnRzXHJcblx0XHRcdF8uZWFjaChvcmcucGFyZW50cywgKHBhcmVudF9pZCkgLT5cclxuXHRcdFx0XHRvcmdfaWRzLnB1c2gocGFyZW50X2lkKVxyXG5cdFx0XHQpXHJcblx0KVxyXG5cdG9yZ19pZHMgPSBfLnVuaXEob3JnX2lkcylcclxuXHRteV9wZXJtaXNzaW9ucyA9IG5ldyBBcnJheVxyXG5cdGlmIGZsb3cucGVybXNcclxuXHRcdCMg5Yik5patZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW7kuK3mmK/lkKbljIXlkKvlvZPliY3nlKjmiLfvvIxcclxuXHRcdCMg5oiW6ICFZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGTmmK/lkKbljIXlkKs05q2l5b6X5Yiw55qEb3JnX2lk5pWw57uE5Lit55qE5Lu75L2V5LiA5Liq77yMXHJcblx0XHQjIOiLpeaYr++8jOWImeWcqOi/lOWbnueahOaVsOe7hOS4reWKoOS4imFkZFxyXG5cdFx0aWYgZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRkXHJcblx0XHRcdHVzZXJzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGRcclxuXHRcdFx0aWYgdXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VyX2lkKVxyXG5cdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJhZGRcIilcclxuXHJcblx0XHRpZiBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZFxyXG5cdFx0XHRvcmdzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZFxyXG5cdFx0XHRfLmVhY2gob3JnX2lkcywgKG9yZ19pZCkgLT5cclxuXHRcdFx0XHRpZiBvcmdzX2Nhbl9hZGQuaW5jbHVkZXMob3JnX2lkKVxyXG5cdFx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKVxyXG5cdFx0XHQpXHJcblx0XHQjIOWIpOaWrWZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3LkuK3mmK/lkKbljIXlkKvlvZPliY3nlKjmiLfvvIxcclxuXHRcdCMg5oiW6ICFZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9y5piv5ZCm5YyF5ZCrNOatpeW+l+WIsOeahG9yZ19pZOaVsOe7hOS4reeahOS7u+S9leS4gOS4qu+8jFxyXG5cdFx0IyDoi6XmmK/vvIzliJnlnKjov5Tlm57nmoTmlbDnu4TkuK3liqDkuIptb25pdG9yXHJcblx0XHRpZiBmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yXHJcblx0XHRcdHVzZXJzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvclxyXG5cdFx0XHRpZiB1c2Vyc19jYW5fbW9uaXRvci5pbmNsdWRlcyh1c2VyX2lkKVxyXG5cdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJtb25pdG9yXCIpXHJcblxyXG5cdFx0aWYgZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yXHJcblx0XHRcdG9yZ3NfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3JcclxuXHRcdFx0Xy5lYWNoKG9yZ19pZHMsIChvcmdfaWQpIC0+XHJcblx0XHRcdFx0aWYgb3Jnc19jYW5fbW9uaXRvci5pbmNsdWRlcyhvcmdfaWQpXHJcblx0XHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwibW9uaXRvclwiKVxyXG5cdFx0XHQpXHJcblx0XHQjIOWIpOaWrWZsb3cucGVybXMudXNlcnNfY2FuX2FkbWlu5Lit5piv5ZCm5YyF5ZCr5b2T5YmN55So5oi377yMXHJcblx0XHQjIOaIluiAhWZsb3cucGVybXMub3Jnc19jYW5fYWRtaW7mmK/lkKbljIXlkKs05q2l5b6X5Yiw55qEb3JnX2lk5pWw57uE5Lit55qE5Lu75L2V5LiA5Liq77yMXHJcblx0XHQjIOiLpeaYr++8jOWImeWcqOi/lOWbnueahOaVsOe7hOS4reWKoOS4imFkbWluXHJcblx0XHRpZiBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pblxyXG5cdFx0XHR1c2Vyc19jYW5fYWRtaW4gPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pblxyXG5cdFx0XHRpZiB1c2Vyc19jYW5fYWRtaW4uaW5jbHVkZXModXNlcl9pZClcclxuXHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIilcclxuXHJcblx0XHRpZiBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluXHJcblx0XHRcdG9yZ3NfY2FuX2FkbWluID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pblxyXG5cdFx0XHRfLmVhY2gob3JnX2lkcywgKG9yZ19pZCkgLT5cclxuXHRcdFx0XHRpZiBvcmdzX2Nhbl9hZG1pbi5pbmNsdWRlcyhvcmdfaWQpXHJcblx0XHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIilcclxuXHRcdFx0KVxyXG5cclxuXHRteV9wZXJtaXNzaW9ucyA9IF8udW5pcShteV9wZXJtaXNzaW9ucylcclxuXHRyZXR1cm4gbXlfcGVybWlzc2lvbnMiLCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbnBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge307XG5cbnBlcm1pc3Npb25NYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZsb3dQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKGZsb3dfaWQsIHVzZXJfaWQpIHtcbiAgdmFyIGZsb3csIG15X3Blcm1pc3Npb25zLCBvcmdfaWRzLCBvcmdhbml6YXRpb25zLCBvcmdzX2Nhbl9hZGQsIG9yZ3NfY2FuX2FkbWluLCBvcmdzX2Nhbl9tb25pdG9yLCBzcGFjZV9pZCwgdXNlcnNfY2FuX2FkZCwgdXNlcnNfY2FuX2FkbWluLCB1c2Vyc19jYW5fbW9uaXRvcjtcbiAgZmxvdyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyhmbG93X2lkKTtcbiAgc3BhY2VfaWQgPSBmbG93LnNwYWNlO1xuICBvcmdfaWRzID0gbmV3IEFycmF5O1xuICBvcmdhbml6YXRpb25zID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdXNlcnM6IHVzZXJfaWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgcGFyZW50czogMVxuICAgIH1cbiAgfSkuZmV0Y2goKTtcbiAgXy5lYWNoKG9yZ2FuaXphdGlvbnMsIGZ1bmN0aW9uKG9yZykge1xuICAgIG9yZ19pZHMucHVzaChvcmcuX2lkKTtcbiAgICBpZiAob3JnLnBhcmVudHMpIHtcbiAgICAgIHJldHVybiBfLmVhY2gob3JnLnBhcmVudHMsIGZ1bmN0aW9uKHBhcmVudF9pZCkge1xuICAgICAgICByZXR1cm4gb3JnX2lkcy5wdXNoKHBhcmVudF9pZCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBvcmdfaWRzID0gXy51bmlxKG9yZ19pZHMpO1xuICBteV9wZXJtaXNzaW9ucyA9IG5ldyBBcnJheTtcbiAgaWYgKGZsb3cucGVybXMpIHtcbiAgICBpZiAoZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRkKSB7XG4gICAgICB1c2Vyc19jYW5fYWRkID0gZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRkO1xuICAgICAgaWYgKHVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcl9pZCkpIHtcbiAgICAgICAgbXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMub3Jnc19jYW5fYWRkKSB7XG4gICAgICBvcmdzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZDtcbiAgICAgIF8uZWFjaChvcmdfaWRzLCBmdW5jdGlvbihvcmdfaWQpIHtcbiAgICAgICAgaWYgKG9yZ3NfY2FuX2FkZC5pbmNsdWRlcyhvcmdfaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZGRcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvcikge1xuICAgICAgdXNlcnNfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yO1xuICAgICAgaWYgKHVzZXJzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKHVzZXJfaWQpKSB7XG4gICAgICAgIG15X3Blcm1pc3Npb25zLnB1c2goXCJtb25pdG9yXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yKSB7XG4gICAgICBvcmdzX2Nhbl9tb25pdG9yID0gZmxvdy5wZXJtcy5vcmdzX2Nhbl9tb25pdG9yO1xuICAgICAgXy5lYWNoKG9yZ19pZHMsIGZ1bmN0aW9uKG9yZ19pZCkge1xuICAgICAgICBpZiAob3Jnc19jYW5fbW9uaXRvci5pbmNsdWRlcyhvcmdfaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIG15X3Blcm1pc3Npb25zLnB1c2goXCJtb25pdG9yXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluKSB7XG4gICAgICB1c2Vyc19jYW5fYWRtaW4gPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbjtcbiAgICAgIGlmICh1c2Vyc19jYW5fYWRtaW4uaW5jbHVkZXModXNlcl9pZCkpIHtcbiAgICAgICAgbXlfcGVybWlzc2lvbnMucHVzaChcImFkbWluXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pbikge1xuICAgICAgb3Jnc19jYW5fYWRtaW4gPSBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluO1xuICAgICAgXy5lYWNoKG9yZ19pZHMsIGZ1bmN0aW9uKG9yZ19pZCkge1xuICAgICAgICBpZiAob3Jnc19jYW5fYWRtaW4uaW5jbHVkZXMob3JnX2lkKSkge1xuICAgICAgICAgIHJldHVybiBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBteV9wZXJtaXNzaW9ucyA9IF8udW5pcShteV9wZXJtaXNzaW9ucyk7XG4gIHJldHVybiBteV9wZXJtaXNzaW9ucztcbn07XG4iLCJfZXZhbCA9IHJlcXVpcmUoJ2V2YWwnKVxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsID0ge31cclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbiA9IChyZXEpIC0+XHJcblx0cXVlcnkgPSByZXEucXVlcnlcclxuXHR1c2VySWQgPSBxdWVyeVtcIlgtVXNlci1JZFwiXVxyXG5cdGF1dGhUb2tlbiA9IHF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG5cdGlmIG5vdCB1c2VySWQgb3Igbm90IGF1dGhUb2tlblxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXHJcblxyXG5cdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcclxuXHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcclxuXHRcdF9pZDogdXNlcklkLFxyXG5cdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cclxuXHJcblx0aWYgbm90IHVzZXJcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xyXG5cclxuXHRyZXR1cm4gdXNlclxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRTcGFjZSA9IChzcGFjZV9pZCkgLT5cclxuXHRzcGFjZSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpXHJcblx0aWYgbm90IHNwYWNlXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcInNwYWNlX2lk5pyJ6K+v5oiW5q2kc3BhY2Xlt7Lnu4/ooqvliKDpmaRcIilcclxuXHRyZXR1cm4gc3BhY2VcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyA9IChmbG93X2lkKSAtPlxyXG5cdGZsb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZsb3dzLmZpbmRPbmUoZmxvd19pZClcclxuXHRpZiBub3QgZmxvd1xyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJpZOacieivr+aIluatpOa1geeoi+W3sue7j+iiq+WIoOmZpFwiKVxyXG5cdHJldHVybiBmbG93XHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlciA9IChzcGFjZV9pZCwgdXNlcl9pZCkgLT5cclxuXHRzcGFjZV91c2VyID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZV91c2Vycy5maW5kT25lKHsgc3BhY2U6IHNwYWNlX2lkLCB1c2VyOiB1c2VyX2lkIH0pXHJcblx0aWYgbm90IHNwYWNlX3VzZXJcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwidXNlcl9pZOWvueW6lOeahOeUqOaIt+S4jeWxnuS6juW9k+WJjXNwYWNlXCIpXHJcblx0cmV0dXJuIHNwYWNlX3VzZXJcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyA9IChzcGFjZV91c2VyKSAtPlxyXG5cdGluZm8gPSBuZXcgT2JqZWN0XHJcblx0aW5mby5vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvblxyXG5cdG9yZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub3JnYW5pemF0aW9ucy5maW5kT25lKHNwYWNlX3VzZXIub3JnYW5pemF0aW9uLCB7IGZpZWxkczogeyBuYW1lOiAxICwgZnVsbG5hbWU6IDEgfSB9KVxyXG5cdGluZm8ub3JnYW5pemF0aW9uX25hbWUgPSBvcmcubmFtZVxyXG5cdGluZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gb3JnLmZ1bGxuYW1lXHJcblx0cmV0dXJuIGluZm9cclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93RW5hYmxlZCA9IChmbG93KSAtPlxyXG5cdGlmIGZsb3cuc3RhdGUgaXNudCBcImVuYWJsZWRcIlxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvmnKrlkK/nlKgs5pON5L2c5aSx6LSlXCIpXHJcblxyXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZCA9IChmbG93LCBzcGFjZV9pZCkgLT5cclxuXHRpZiBmbG93LnNwYWNlIGlzbnQgc3BhY2VfaWRcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5ZKM5bel5L2c5Yy6SUTkuI3ljLnphY1cIilcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Rm9ybSA9IChmb3JtX2lkKSAtPlxyXG5cdGZvcm0gPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZvcm1zLmZpbmRPbmUoZm9ybV9pZClcclxuXHRpZiBub3QgZm9ybVxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+ihqOWNlUlE5pyJ6K+v5oiW5q2k6KGo5Y2V5bey57uP6KKr5Yig6ZmkJylcclxuXHJcblx0cmV0dXJuIGZvcm1cclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Q2F0ZWdvcnkgPSAoY2F0ZWdvcnlfaWQpIC0+XHJcblx0cmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuY2F0ZWdvcmllcy5maW5kT25lKGNhdGVnb3J5X2lkKVxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UgPSAoaW5zdGFuY2VfZnJvbV9jbGllbnQsIHVzZXJfaW5mbykgLT5cclxuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSwgU3RyaW5nXHJcblx0Y2hlY2sgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSwgU3RyaW5nXHJcblx0Y2hlY2sgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdLCBTdHJpbmdcclxuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl0sIFt7bzogU3RyaW5nLCBpZHM6IFtTdHJpbmddfV1cclxuXHJcblx0IyDmoKHpqozmmK/lkKZyZWNvcmTlt7Lnu4/lj5HotbfnmoTnlLPor7fov5jlnKjlrqHmibnkuK1cclxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrSXNJbkFwcHJvdmFsKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVswXSwgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSlcclxuXHJcblx0c3BhY2VfaWQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdXHJcblx0Zmxvd19pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXVxyXG5cdHVzZXJfaWQgPSB1c2VyX2luZm8uX2lkXHJcblx0IyDojrflj5bliY3lj7DmiYDkvKDnmoR0cmFjZVxyXG5cdHRyYWNlX2Zyb21fY2xpZW50ID0gbnVsbFxyXG5cdCMg6I635Y+W5YmN5Y+w5omA5Lyg55qEYXBwcm92ZVxyXG5cdGFwcHJvdmVfZnJvbV9jbGllbnQgPSBudWxsXHJcblx0aWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl0gYW5kIGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdXHJcblx0XHR0cmFjZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdXHJcblx0XHRpZiB0cmFjZV9mcm9tX2NsaWVudFtcImFwcHJvdmVzXCJdIGFuZCB0cmFjZV9mcm9tX2NsaWVudFtcImFwcHJvdmVzXCJdWzBdXHJcblx0XHRcdGFwcHJvdmVfZnJvbV9jbGllbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXVtcImFwcHJvdmVzXCJdWzBdXHJcblxyXG5cdCMg6I635Y+W5LiA5Liqc3BhY2VcclxuXHRzcGFjZSA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2Uoc3BhY2VfaWQpXHJcblx0IyDojrflj5bkuIDkuKpmbG93XHJcblx0ZmxvdyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyhmbG93X2lkKVxyXG5cdCMg6I635Y+W5LiA5Liqc3BhY2XkuIvnmoTkuIDkuKp1c2VyXHJcblx0c3BhY2VfdXNlciA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyKHNwYWNlX2lkLCB1c2VyX2lkKVxyXG5cdCMg6I635Y+Wc3BhY2VfdXNlcuaJgOWcqOeahOmDqOmXqOS/oeaBr1xyXG5cdHNwYWNlX3VzZXJfb3JnX2luZm8gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8oc3BhY2VfdXNlcilcclxuXHQjIOWIpOaWreS4gOS4qmZsb3fmmK/lkKbkuLrlkK/nlKjnirbmgIFcclxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd0VuYWJsZWQoZmxvdylcclxuXHQjIOWIpOaWreS4gOS4qmZsb3flkoxzcGFjZV9pZOaYr+WQpuWMuemFjVxyXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaXNGbG93U3BhY2VNYXRjaGVkKGZsb3csIHNwYWNlX2lkKVxyXG5cclxuXHRmb3JtID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5nZXRGb3JtKGZsb3cuZm9ybSlcclxuXHJcblx0cGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd19pZCwgdXNlcl9pZClcclxuXHJcblx0aWYgbm90IHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRkXCIpXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuW9k+WJjeeUqOaIt+ayoeacieatpOa1geeoi+eahOaWsOW7uuadg+mZkFwiKVxyXG5cclxuXHRub3cgPSBuZXcgRGF0ZVxyXG5cdGluc19vYmogPSB7fVxyXG5cdGluc19vYmouX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuX21ha2VOZXdJRCgpXHJcblx0aW5zX29iai5zcGFjZSA9IHNwYWNlX2lkXHJcblx0aW5zX29iai5mbG93ID0gZmxvd19pZFxyXG5cdGluc19vYmouZmxvd192ZXJzaW9uID0gZmxvdy5jdXJyZW50Ll9pZFxyXG5cdGluc19vYmouZm9ybSA9IGZsb3cuZm9ybVxyXG5cdGluc19vYmouZm9ybV92ZXJzaW9uID0gZmxvdy5jdXJyZW50LmZvcm1fdmVyc2lvblxyXG5cdGluc19vYmoubmFtZSA9IGZsb3cubmFtZVxyXG5cdGluc19vYmouc3VibWl0dGVyID0gdXNlcl9pZFxyXG5cdGluc19vYmouc3VibWl0dGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZVxyXG5cdGluc19vYmouYXBwbGljYW50ID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSBlbHNlIHVzZXJfaWRcclxuXHRpbnNfb2JqLmFwcGxpY2FudF9uYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gZWxzZSB1c2VyX2luZm8ubmFtZVxyXG5cdGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbiA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSBlbHNlIHNwYWNlX3VzZXIub3JnYW5pemF0aW9uXHJcblx0aW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdIGVsc2Ugc3BhY2VfdXNlcl9vcmdfaW5mby5vcmdhbml6YXRpb25fbmFtZVxyXG5cdGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZVwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZVwiXSBlbHNlICBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZVxyXG5cdGluc19vYmouYXBwbGljYW50X2NvbXBhbnkgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfY29tcGFueVwiXSBlbHNlIHNwYWNlX3VzZXIuY29tcGFueV9pZFxyXG5cdGluc19vYmouc3RhdGUgPSAnZHJhZnQnXHJcblx0aW5zX29iai5jb2RlID0gJydcclxuXHRpbnNfb2JqLmlzX2FyY2hpdmVkID0gZmFsc2VcclxuXHRpbnNfb2JqLmlzX2RlbGV0ZWQgPSBmYWxzZVxyXG5cdGluc19vYmouY3JlYXRlZCA9IG5vd1xyXG5cdGluc19vYmouY3JlYXRlZF9ieSA9IHVzZXJfaWRcclxuXHRpbnNfb2JqLm1vZGlmaWVkID0gbm93XHJcblx0aW5zX29iai5tb2RpZmllZF9ieSA9IHVzZXJfaWRcclxuXHRpbnNfb2JqLnZhbHVlcyA9IG5ldyBPYmplY3RcclxuXHJcblx0aW5zX29iai5yZWNvcmRfaWRzID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdXHJcblxyXG5cdGlmIHNwYWNlX3VzZXIuY29tcGFueV9pZFxyXG5cdFx0aW5zX29iai5jb21wYW55X2lkID0gc3BhY2VfdXNlci5jb21wYW55X2lkXHJcblxyXG5cdCMg5paw5bu6VHJhY2VcclxuXHR0cmFjZV9vYmogPSB7fVxyXG5cdHRyYWNlX29iai5faWQgPSBuZXcgTW9uZ28uT2JqZWN0SUQoKS5fc3RyXHJcblx0dHJhY2Vfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWRcclxuXHR0cmFjZV9vYmouaXNfZmluaXNoZWQgPSBmYWxzZVxyXG5cdCMg5b2T5YmN5pyA5paw54mIZmxvd+S4reW8gOWni+iKgueCuVxyXG5cdHN0YXJ0X3N0ZXAgPSBfLmZpbmQoZmxvdy5jdXJyZW50LnN0ZXBzLCAoc3RlcCkgLT5cclxuXHRcdHJldHVybiBzdGVwLnN0ZXBfdHlwZSBpcyAnc3RhcnQnXHJcblx0KVxyXG5cdHRyYWNlX29iai5zdGVwID0gc3RhcnRfc3RlcC5faWRcclxuXHR0cmFjZV9vYmoubmFtZSA9IHN0YXJ0X3N0ZXAubmFtZVxyXG5cclxuXHR0cmFjZV9vYmouc3RhcnRfZGF0ZSA9IG5vd1xyXG5cdCMg5paw5bu6QXBwcm92ZVxyXG5cdGFwcHJfb2JqID0ge31cclxuXHRhcHByX29iai5faWQgPSBuZXcgTW9uZ28uT2JqZWN0SUQoKS5fc3RyXHJcblx0YXBwcl9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZFxyXG5cdGFwcHJfb2JqLnRyYWNlID0gdHJhY2Vfb2JqLl9pZFxyXG5cdGFwcHJfb2JqLmlzX2ZpbmlzaGVkID0gZmFsc2VcclxuXHRhcHByX29iai51c2VyID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSBlbHNlIHVzZXJfaWRcclxuXHRhcHByX29iai51c2VyX25hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSBlbHNlIHVzZXJfaW5mby5uYW1lXHJcblx0YXBwcl9vYmouaGFuZGxlciA9IHVzZXJfaWRcclxuXHRhcHByX29iai5oYW5kbGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZVxyXG5cdGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uID0gc3BhY2VfdXNlci5vcmdhbml6YXRpb25cclxuXHRhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9uYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5uYW1lXHJcblx0YXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLmZ1bGxuYW1lXHJcblx0YXBwcl9vYmoudHlwZSA9ICdkcmFmdCdcclxuXHRhcHByX29iai5zdGFydF9kYXRlID0gbm93XHJcblx0YXBwcl9vYmoucmVhZF9kYXRlID0gbm93XHJcblx0YXBwcl9vYmouaXNfcmVhZCA9IHRydWVcclxuXHRhcHByX29iai5pc19lcnJvciA9IGZhbHNlXHJcblx0YXBwcl9vYmouZGVzY3JpcHRpb24gPSAnJ1xyXG5cdGFwcHJfb2JqLnZhbHVlcyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMoaW5zX29iai5yZWNvcmRfaWRzWzBdLCBmbG93X2lkLCBzcGFjZV9pZCwgZm9ybS5jdXJyZW50LmZpZWxkcylcclxuXHJcblx0dHJhY2Vfb2JqLmFwcHJvdmVzID0gW2FwcHJfb2JqXVxyXG5cdGluc19vYmoudHJhY2VzID0gW3RyYWNlX29ial1cclxuXHJcblx0aW5zX29iai5pbmJveF91c2VycyA9IGluc3RhbmNlX2Zyb21fY2xpZW50LmluYm94X3VzZXJzIHx8IFtdXHJcblxyXG5cdGluc19vYmouY3VycmVudF9zdGVwX25hbWUgPSBzdGFydF9zdGVwLm5hbWVcclxuXHJcblx0aWYgZmxvdy5hdXRvX3JlbWluZCBpcyB0cnVlXHJcblx0XHRpbnNfb2JqLmF1dG9fcmVtaW5kID0gdHJ1ZVxyXG5cclxuXHQjIOaWsOW7uueUs+ivt+WNleaXtu+8jGluc3RhbmNlc+iusOW9lea1geeoi+WQjeensOOAgea1geeoi+WIhuexu+WQjeensCAjMTMxM1xyXG5cdGluc19vYmouZmxvd19uYW1lID0gZmxvdy5uYW1lXHJcblx0aWYgZm9ybS5jYXRlZ29yeVxyXG5cdFx0Y2F0ZWdvcnkgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldENhdGVnb3J5KGZvcm0uY2F0ZWdvcnkpXHJcblx0XHRpZiBjYXRlZ29yeVxyXG5cdFx0XHRpbnNfb2JqLmNhdGVnb3J5X25hbWUgPSBjYXRlZ29yeS5uYW1lXHJcblx0XHRcdGluc19vYmouY2F0ZWdvcnkgPSBjYXRlZ29yeS5faWRcclxuXHJcblx0bmV3X2luc19pZCA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmluc2VydChpbnNfb2JqKVxyXG5cclxuXHR1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlQXR0YWNoKGluc19vYmoucmVjb3JkX2lkc1swXSwgc3BhY2VfaWQsIGluc19vYmouX2lkLCBhcHByX29iai5faWQpXHJcblxyXG5cdHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8oaW5zX29iai5yZWNvcmRfaWRzWzBdLCBuZXdfaW5zX2lkLCBzcGFjZV9pZClcclxuXHJcblx0cmV0dXJuIG5ld19pbnNfaWRcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVWYWx1ZXMgPSAocmVjb3JkSWRzLCBmbG93SWQsIHNwYWNlSWQsIGZpZWxkcykgLT5cclxuXHRmaWVsZENvZGVzID0gW11cclxuXHRfLmVhY2ggZmllbGRzLCAoZikgLT5cclxuXHRcdGlmIGYudHlwZSA9PSAnc2VjdGlvbidcclxuXHRcdFx0Xy5lYWNoIGYuZmllbGRzLCAoZmYpIC0+XHJcblx0XHRcdFx0ZmllbGRDb2Rlcy5wdXNoIGZmLmNvZGVcclxuXHRcdGVsc2VcclxuXHRcdFx0ZmllbGRDb2Rlcy5wdXNoIGYuY29kZVxyXG5cclxuXHR2YWx1ZXMgPSB7fVxyXG5cdG9iamVjdE5hbWUgPSByZWNvcmRJZHMub1xyXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdE5hbWUsIHNwYWNlSWQpXHJcblx0cmVjb3JkSWQgPSByZWNvcmRJZHMuaWRzWzBdXHJcblx0b3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF93b3JrZmxvd3MuZmluZE9uZSh7XHJcblx0XHRvYmplY3RfbmFtZTogb2JqZWN0TmFtZSxcclxuXHRcdGZsb3dfaWQ6IGZsb3dJZFxyXG5cdH0pXHJcblx0cmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLmZpbmRPbmUocmVjb3JkSWQpXHJcblx0ZmxvdyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignZmxvd3MnKS5maW5kT25lKGZsb3dJZCwgeyBmaWVsZHM6IHsgZm9ybTogMSB9IH0pXHJcblx0aWYgb3cgYW5kIHJlY29yZFxyXG5cdFx0Zm9ybSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImZvcm1zXCIpLmZpbmRPbmUoZmxvdy5mb3JtKVxyXG5cdFx0Zm9ybUZpZWxkcyA9IGZvcm0uY3VycmVudC5maWVsZHMgfHwgW11cclxuXHRcdHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3ROYW1lLCBzcGFjZUlkKVxyXG5cdFx0cmVsYXRlZE9iamVjdHNLZXlzID0gXy5wbHVjayhyZWxhdGVkT2JqZWN0cywgJ29iamVjdF9uYW1lJylcclxuXHRcdGZvcm1UYWJsZUZpZWxkcyA9IF8uZmlsdGVyIGZvcm1GaWVsZHMsIChmb3JtRmllbGQpIC0+XHJcblx0XHRcdHJldHVybiBmb3JtRmllbGQudHlwZSA9PSAndGFibGUnXHJcblx0XHRmb3JtVGFibGVGaWVsZHNDb2RlID0gXy5wbHVjayhmb3JtVGFibGVGaWVsZHMsICdjb2RlJylcclxuXHJcblx0XHRnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gIChrZXkpIC0+XHJcblx0XHRcdHJldHVybiBfLmZpbmQgcmVsYXRlZE9iamVjdHNLZXlzLCAgKHJlbGF0ZWRPYmplY3RzS2V5KSAtPlxyXG5cdFx0XHRcdHJldHVybiBrZXkuc3RhcnRzV2l0aChyZWxhdGVkT2JqZWN0c0tleSArICcuJylcclxuXHJcblx0XHRnZXRGb3JtVGFibGVGaWVsZENvZGUgPSAoa2V5KSAtPlxyXG5cdFx0XHRyZXR1cm4gXy5maW5kIGZvcm1UYWJsZUZpZWxkc0NvZGUsICAoZm9ybVRhYmxlRmllbGRDb2RlKSAtPlxyXG5cdFx0XHRcdHJldHVybiBrZXkuc3RhcnRzV2l0aChmb3JtVGFibGVGaWVsZENvZGUgKyAnLicpXHJcblxyXG5cdFx0Z2V0Rm9ybVRhYmxlRmllbGQgPSAoa2V5KSAtPlxyXG5cdFx0XHRyZXR1cm4gXy5maW5kIGZvcm1UYWJsZUZpZWxkcywgIChmKSAtPlxyXG5cdFx0XHRcdHJldHVybiBmLmNvZGUgPT0ga2V5XHJcblx0XHRcclxuXHRcdGdldEZvcm1GaWVsZCA9IChrZXkpIC0+XHJcblx0XHRcdHJldHVybiBfLmZpbmQgZm9ybUZpZWxkcywgIChmKSAtPlxyXG5cdFx0XHRcdHJldHVybiBmLmNvZGUgPT0ga2V5XHJcblxyXG5cdFx0Z2V0Rm9ybVRhYmxlU3ViRmllbGQgPSAodGFibGVGaWVsZCwgc3ViRmllbGRDb2RlKSAtPlxyXG5cdFx0XHRyZXR1cm4gXy5maW5kIHRhYmxlRmllbGQuZmllbGRzLCAgKGYpIC0+XHJcblx0XHRcdFx0cmV0dXJuIGYuY29kZSA9PSBzdWJGaWVsZENvZGVcclxuXHJcblx0XHRnZXRGaWVsZE9kYXRhVmFsdWUgPSAob2JqTmFtZSwgaWQpIC0+XHJcblx0XHRcdG9iaiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKVxyXG5cdFx0XHRpZiAhb2JqXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdGlmIF8uaXNTdHJpbmcgaWRcclxuXHRcdFx0XHRfcmVjb3JkID0gb2JqLmZpbmRPbmUoaWQpXHJcblx0XHRcdFx0aWYgX3JlY29yZFxyXG5cdFx0XHRcdFx0X3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkLm5hbWVcclxuXHRcdFx0XHRcdHJldHVybiBfcmVjb3JkXHJcblx0XHRcdGVsc2UgaWYgXy5pc0FycmF5IGlkXHJcblx0XHRcdFx0X3JlY29yZHMgPSBbXVxyXG5cdFx0XHRcdG9iai5maW5kKHsgX2lkOiB7ICRpbjogaWQgfSB9KS5mb3JFYWNoIChfcmVjb3JkKSAtPlxyXG5cdFx0XHRcdFx0X3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkLm5hbWVcclxuXHRcdFx0XHRcdF9yZWNvcmRzLnB1c2ggX3JlY29yZFxyXG5cclxuXHRcdFx0XHRpZiAhXy5pc0VtcHR5IF9yZWNvcmRzXHJcblx0XHRcdFx0XHRyZXR1cm4gX3JlY29yZHNcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0dGFibGVGaWVsZENvZGVzID0gW11cclxuXHRcdHRhYmxlRmllbGRNYXAgPSBbXVxyXG5cdFx0dGFibGVUb1JlbGF0ZWRNYXAgPSB7fVxyXG5cclxuXHRcdG93LmZpZWxkX21hcD8uZm9yRWFjaCAoZm0pIC0+XHJcblx0XHRcdG9iamVjdF9maWVsZCA9IGZtLm9iamVjdF9maWVsZFxyXG5cdFx0XHR3b3JrZmxvd19maWVsZCA9IGZtLndvcmtmbG93X2ZpZWxkXHJcblx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZENvZGUgPSBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlKG9iamVjdF9maWVsZClcclxuXHRcdFx0Zm9ybVRhYmxlRmllbGRDb2RlID0gZ2V0Rm9ybVRhYmxlRmllbGRDb2RlKHdvcmtmbG93X2ZpZWxkKVxyXG5cdFx0XHRvYmpGaWVsZCA9IG9iamVjdC5maWVsZHNbb2JqZWN0X2ZpZWxkXVxyXG5cdFx0XHRmb3JtRmllbGQgPSBnZXRGb3JtRmllbGQod29ya2Zsb3dfZmllbGQpXHJcblx0XHRcdCMg5aSE55CG5a2Q6KGo5a2X5q61XHJcblx0XHRcdGlmIHJlbGF0ZWRPYmplY3RGaWVsZENvZGVcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRvVGFibGVDb2RlID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF1cclxuXHRcdFx0XHRvVGFibGVGaWVsZENvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXVxyXG5cdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwS2V5ID0gb1RhYmxlQ29kZVxyXG5cdFx0XHRcdGlmICF0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1cclxuXHRcdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSA9IHt9XHJcblxyXG5cdFx0XHRcdGlmIGZvcm1UYWJsZUZpZWxkQ29kZVxyXG5cdFx0XHRcdFx0d1RhYmxlQ29kZSA9IHdvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMF1cclxuXHRcdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVsnX0ZST01fVEFCTEVfQ09ERSddID0gd1RhYmxlQ29kZVxyXG5cclxuXHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bb1RhYmxlRmllbGRDb2RlXSA9IHdvcmtmbG93X2ZpZWxkXHJcblx0XHRcdCMg5Yik5pat5piv5ZCm5piv6KGo5qC85a2X5q61XHJcblx0XHRcdGVsc2UgaWYgd29ya2Zsb3dfZmllbGQuaW5kZXhPZignLiQuJykgPiAwIGFuZCBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPiAwXHJcblx0XHRcdFx0d1RhYmxlQ29kZSA9IHdvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJC4nKVswXVxyXG5cdFx0XHRcdG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzBdXHJcblx0XHRcdFx0aWYgcmVjb3JkLmhhc093blByb3BlcnR5KG9UYWJsZUNvZGUpIGFuZCBfLmlzQXJyYXkocmVjb3JkW29UYWJsZUNvZGVdKVxyXG5cdFx0XHRcdFx0dGFibGVGaWVsZENvZGVzLnB1c2goSlNPTi5zdHJpbmdpZnkoe1xyXG5cdFx0XHRcdFx0XHR3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxyXG5cdFx0XHRcdFx0XHRvYmplY3RfdGFibGVfZmllbGRfY29kZTogb1RhYmxlQ29kZVxyXG5cdFx0XHRcdFx0fSkpXHJcblx0XHRcdFx0XHR0YWJsZUZpZWxkTWFwLnB1c2goZm0pXHJcblxyXG5cdFx0XHQjIOWkhOeQhmxvb2t1cOOAgW1hc3Rlcl9kZXRhaWznsbvlnovlrZfmrrVcclxuXHRcdFx0ZWxzZSBpZiBvYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gMCBhbmQgb2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID09IC0xXHJcblx0XHRcdFx0b2JqZWN0RmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF1cclxuXHRcdFx0XHRsb29rdXBGaWVsZE5hbWUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXVxyXG5cdFx0XHRcdGlmIG9iamVjdFxyXG5cdFx0XHRcdFx0b2JqZWN0RmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdEZpZWxkTmFtZV1cclxuXHRcdFx0XHRcdGlmIG9iamVjdEZpZWxkICYmIChvYmplY3RGaWVsZC50eXBlID09IFwibG9va3VwXCIgfHwgb2JqZWN0RmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIikgJiYgIW9iamVjdEZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0XHRcdGZpZWxkc09iaiA9IHt9XHJcblx0XHRcdFx0XHRcdGZpZWxkc09ialtsb29rdXBGaWVsZE5hbWVdID0gMVxyXG5cdFx0XHRcdFx0XHRsb29rdXBPYmplY3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kT25lKHJlY29yZFtvYmplY3RGaWVsZE5hbWVdLCB7IGZpZWxkczogZmllbGRzT2JqIH0pXHJcblx0XHRcdFx0XHRcdGlmIGxvb2t1cE9iamVjdFxyXG5cdFx0XHRcdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBsb29rdXBPYmplY3RbbG9va3VwRmllbGROYW1lXVxyXG5cclxuXHRcdFx0IyBsb29rdXDjgIFtYXN0ZXJfZGV0YWls5a2X5q615ZCM5q2l5Yiwb2RhdGHlrZfmrrVcclxuXHRcdFx0ZWxzZSBpZiBmb3JtRmllbGQgJiYgb2JqRmllbGQgJiYgZm9ybUZpZWxkLnR5cGUgPT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqRmllbGQucmVmZXJlbmNlX3RvXHJcblx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcmVjb3JkW29iakZpZWxkLm5hbWVdXHJcblx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlXHJcblx0XHRcdFx0aWYgb2JqRmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpXHJcblx0XHRcdFx0ZWxzZSBpZiAhb2JqRmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdFxyXG5cdFx0XHRcdFx0b2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKVxyXG5cdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSBvZGF0YUZpZWxkVmFsdWVcclxuXHRcdFx0ZWxzZSBpZiByZWNvcmQuaGFzT3duUHJvcGVydHkob2JqZWN0X2ZpZWxkKVxyXG5cdFx0XHRcdHZhbHVlc1t3b3JrZmxvd19maWVsZF0gPSByZWNvcmRbb2JqZWN0X2ZpZWxkXVxyXG5cclxuXHRcdCMg6KGo5qC85a2X5q61XHJcblx0XHRfLnVuaXEodGFibGVGaWVsZENvZGVzKS5mb3JFYWNoICh0ZmMpIC0+XHJcblx0XHRcdGMgPSBKU09OLnBhcnNlKHRmYylcclxuXHRcdFx0dmFsdWVzW2Mud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZV0gPSBbXVxyXG5cdFx0XHRyZWNvcmRbYy5vYmplY3RfdGFibGVfZmllbGRfY29kZV0uZm9yRWFjaCAodHIpIC0+XHJcblx0XHRcdFx0bmV3VHIgPSB7fVxyXG5cdFx0XHRcdF8uZWFjaCB0ciwgKHYsIGspIC0+XHJcblx0XHRcdFx0XHR0YWJsZUZpZWxkTWFwLmZvckVhY2ggKHRmbSkgLT5cclxuXHRcdFx0XHRcdFx0aWYgdGZtLm9iamVjdF9maWVsZCBpcyAoYy5vYmplY3RfdGFibGVfZmllbGRfY29kZSArICcuJC4nICsgaylcclxuXHRcdFx0XHRcdFx0XHR3VGRDb2RlID0gdGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJC4nKVsxXVxyXG5cdFx0XHRcdFx0XHRcdG5ld1RyW3dUZENvZGVdID0gdlxyXG5cdFx0XHRcdGlmIG5vdCBfLmlzRW1wdHkobmV3VHIpXHJcblx0XHRcdFx0XHR2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXS5wdXNoKG5ld1RyKVxyXG5cclxuXHRcdCMg5ZCM5q2l5a2Q6KGo5pWw5o2u6Iez6KGo5Y2V6KGo5qC8XHJcblx0XHRfLmVhY2ggdGFibGVUb1JlbGF0ZWRNYXAsICAobWFwLCBrZXkpIC0+XHJcblx0XHRcdHRhYmxlQ29kZSA9IG1hcC5fRlJPTV9UQUJMRV9DT0RFXHJcblx0XHRcdGZvcm1UYWJsZUZpZWxkID0gZ2V0Rm9ybVRhYmxlRmllbGQodGFibGVDb2RlKVxyXG5cdFx0XHRpZiAhdGFibGVDb2RlXHJcblx0XHRcdFx0Y29uc29sZS53YXJuKCd0YWJsZVRvUmVsYXRlZDogWycgKyBrZXkgKyAnXSBtaXNzaW5nIGNvcnJlc3BvbmRpbmcgdGFibGUuJylcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3ROYW1lID0ga2V5XHJcblx0XHRcdFx0dGFibGVWYWx1ZXMgPSBbXVxyXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZClcclxuXHRcdFx0XHRyZWxhdGVkRmllbGQgPSBfLmZpbmQgcmVsYXRlZE9iamVjdC5maWVsZHMsIChmKSAtPlxyXG5cdFx0XHRcdFx0cmV0dXJuIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhmLnR5cGUpICYmIGYucmVmZXJlbmNlX3RvID09IG9iamVjdE5hbWVcclxuXHJcblx0XHRcdFx0cmVsYXRlZEZpZWxkTmFtZSA9IHJlbGF0ZWRGaWVsZC5uYW1lXHJcblxyXG5cdFx0XHRcdHNlbGVjdG9yID0ge31cclxuXHRcdFx0XHRzZWxlY3RvcltyZWxhdGVkRmllbGROYW1lXSA9IHJlY29yZElkXHJcblx0XHRcdFx0cmVsYXRlZFJlY29yZHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdE5hbWUpLmZpbmQoc2VsZWN0b3IpXHJcblxyXG5cdFx0XHRcdHJlbGF0ZWRSZWNvcmRzLmZvckVhY2ggKHJyKSAtPlxyXG5cdFx0XHRcdFx0dGFibGVWYWx1ZUl0ZW0gPSB7fVxyXG5cdFx0XHRcdFx0Xy5lYWNoIG1hcCwgKHZhbHVlS2V5LCBmaWVsZEtleSkgLT5cclxuXHRcdFx0XHRcdFx0aWYgZmllbGRLZXkgIT0gJ19GUk9NX1RBQkxFX0NPREUnXHJcblx0XHRcdFx0XHRcdFx0dGFibGVGaWVsZFZhbHVlXHJcblx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkS2V5XHJcblx0XHRcdFx0XHRcdFx0aWYgdmFsdWVLZXkuc3RhcnRzV2l0aCh0YWJsZUNvZGUgKyAnLicpXHJcblx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXkgPSAodmFsdWVLZXkuc3BsaXQoXCIuXCIpWzFdKVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleSA9IHZhbHVlS2V5XHJcblx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkID0gZ2V0Rm9ybVRhYmxlU3ViRmllbGQoZm9ybVRhYmxlRmllbGQsIGZvcm1GaWVsZEtleSlcclxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0RmllbGQgPSByZWxhdGVkT2JqZWN0LmZpZWxkc1tmaWVsZEtleV1cclxuXHRcdFx0XHRcdFx0XHRpZiBmb3JtRmllbGQudHlwZSA9PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhyZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9PYmplY3ROYW1lID0gcmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90b1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9GaWVsZFZhbHVlID0gcnJbZmllbGRLZXldXHJcblx0XHRcdFx0XHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSlcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHR0YWJsZUZpZWxkVmFsdWUgPSBycltmaWVsZEtleV1cclxuXHRcdFx0XHRcdFx0XHR0YWJsZVZhbHVlSXRlbVtmb3JtRmllbGRLZXldID0gdGFibGVGaWVsZFZhbHVlXHJcblxyXG5cdFx0XHRcdFx0dGFibGVWYWx1ZXMucHVzaCh0YWJsZVZhbHVlSXRlbSlcclxuXHJcblx0XHRcdFx0dmFsdWVzW3RhYmxlQ29kZV0gPSB0YWJsZVZhbHVlc1xyXG5cclxuXHRcdCMg5aaC5p6c6YWN572u5LqG6ISa5pys5YiZ5omn6KGM6ISa5pysXHJcblx0XHRpZiBvdy5maWVsZF9tYXBfc2NyaXB0XHJcblx0XHRcdF8uZXh0ZW5kKHZhbHVlcywgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5ldmFsRmllbGRNYXBTY3JpcHQob3cuZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgcmVjb3JkSWQpKVxyXG5cclxuXHQjIOi/h+a7pOaOiXZhbHVlc+S4reeahOmdnuazlWtleVxyXG5cdGZpbHRlclZhbHVlcyA9IHt9XHJcblx0Xy5lYWNoIF8ua2V5cyh2YWx1ZXMpLCAoaykgLT5cclxuXHRcdGlmIGZpZWxkQ29kZXMuaW5jbHVkZXMoaylcclxuXHRcdFx0ZmlsdGVyVmFsdWVzW2tdID0gdmFsdWVzW2tdXHJcblxyXG5cdHJldHVybiBmaWx0ZXJWYWx1ZXNcclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0ID0gKGZpZWxkX21hcF9zY3JpcHQsIG9iamVjdE5hbWUsIHNwYWNlSWQsIG9iamVjdElkKSAtPlxyXG5cdHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKG9iamVjdElkKVxyXG5cdHNjcmlwdCA9IFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocmVjb3JkKSB7IFwiICsgZmllbGRfbWFwX3NjcmlwdCArIFwiIH1cIlxyXG5cdGZ1bmMgPSBfZXZhbChzY3JpcHQsIFwiZmllbGRfbWFwX3NjcmlwdFwiKVxyXG5cdHZhbHVlcyA9IGZ1bmMocmVjb3JkKVxyXG5cdGlmIF8uaXNPYmplY3QgdmFsdWVzXHJcblx0XHRyZXR1cm4gdmFsdWVzXHJcblx0ZWxzZVxyXG5cdFx0Y29uc29sZS5lcnJvciBcImV2YWxGaWVsZE1hcFNjcmlwdDog6ISa5pys6L+U5Zue5YC857G75Z6L5LiN5piv5a+56LGhXCJcclxuXHRyZXR1cm4ge31cclxuXHJcblxyXG5cclxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZUF0dGFjaCA9IChyZWNvcmRJZHMsIHNwYWNlSWQsIGluc0lkLCBhcHByb3ZlSWQpIC0+XHJcblxyXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbJ2Ntc19maWxlcyddLmZpbmQoe1xyXG5cdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRwYXJlbnQ6IHJlY29yZElkc1xyXG5cdH0pLmZvckVhY2ggKGNmKSAtPlxyXG5cdFx0Xy5lYWNoIGNmLnZlcnNpb25zLCAodmVyc2lvbklkLCBpZHgpIC0+XHJcblx0XHRcdGYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zWydjZnMuZmlsZXMuZmlsZXJlY29yZCddLmZpbmRPbmUodmVyc2lvbklkKVxyXG5cdFx0XHRuZXdGaWxlID0gbmV3IEZTLkZpbGUoKVxyXG5cclxuXHRcdFx0bmV3RmlsZS5hdHRhY2hEYXRhIGYuY3JlYXRlUmVhZFN0cmVhbSgnZmlsZXMnKSwge1xyXG5cdFx0XHRcdFx0dHlwZTogZi5vcmlnaW5hbC50eXBlXHJcblx0XHRcdH0sIChlcnIpIC0+XHJcblx0XHRcdFx0aWYgKGVycilcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyLmVycm9yLCBlcnIucmVhc29uKVxyXG5cclxuXHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpXHJcblx0XHRcdFx0bmV3RmlsZS5zaXplKGYuc2l6ZSgpKVxyXG5cdFx0XHRcdG1ldGFkYXRhID0ge1xyXG5cdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRvd25lcl9uYW1lOiBmLm1ldGFkYXRhLm93bmVyX25hbWUsXHJcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFx0XHRcdGluc3RhbmNlOiBpbnNJZCxcclxuXHRcdFx0XHRcdGFwcHJvdmU6IGFwcHJvdmVJZFxyXG5cdFx0XHRcdFx0cGFyZW50OiBjZi5faWRcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIGlkeCBpcyAwXHJcblx0XHRcdFx0XHRtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZVxyXG5cclxuXHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGFcclxuXHRcdFx0XHRjZnMuaW5zdGFuY2VzLmluc2VydChuZXdGaWxlKVxyXG5cclxuXHRyZXR1cm5cclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8gPSAocmVjb3JkSWRzLCBpbnNJZCwgc3BhY2VJZCkgLT5cclxuXHRDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLnVwZGF0ZShyZWNvcmRJZHMuaWRzWzBdLCB7XHJcblx0XHQkcHVzaDoge1xyXG5cdFx0XHRpbnN0YW5jZXM6IHtcclxuXHRcdFx0XHQkZWFjaDogW3tcclxuXHRcdFx0XHRcdF9pZDogaW5zSWQsXHJcblx0XHRcdFx0XHRzdGF0ZTogJ2RyYWZ0J1xyXG5cdFx0XHRcdH1dLFxyXG5cdFx0XHRcdCRwb3NpdGlvbjogMFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0JHNldDoge1xyXG5cdFx0XHRsb2NrZWQ6IHRydWVcclxuXHRcdFx0aW5zdGFuY2Vfc3RhdGU6ICdkcmFmdCdcclxuXHRcdH1cclxuXHR9KVxyXG5cclxuXHRyZXR1cm5cclxuXHJcbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tJc0luQXBwcm92YWwgPSAocmVjb3JkSWRzLCBzcGFjZUlkKSAtPlxyXG5cdHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkuZmluZE9uZSh7XHJcblx0XHRfaWQ6IHJlY29yZElkcy5pZHNbMF0sIGluc3RhbmNlczogeyAkZXhpc3RzOiB0cnVlIH1cclxuXHR9LCB7IGZpZWxkczogeyBpbnN0YW5jZXM6IDEgfSB9KVxyXG5cclxuXHRpZiByZWNvcmQgYW5kIHJlY29yZC5pbnN0YW5jZXNbMF0uc3RhdGUgaXNudCAnY29tcGxldGVkJyBhbmQgQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuZmluZChyZWNvcmQuaW5zdGFuY2VzWzBdLl9pZCkuY291bnQoKSA+IDBcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5q2k6K6w5b2V5bey5Y+R6LW35rWB56iL5q2j5Zyo5a6h5om55Lit77yM5b6F5a6h5om557uT5p2f5pa55Y+v5Y+R6LW35LiL5LiA5qyh5a6h5om577yBXCIpXHJcblxyXG5cdHJldHVyblxyXG5cclxuIiwidmFyIF9ldmFsOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5fZXZhbCA9IHJlcXVpcmUoJ2V2YWwnKTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbCA9IHt9O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNoZWNrX2F1dGhvcml6YXRpb24gPSBmdW5jdGlvbihyZXEpIHtcbiAgdmFyIGF1dGhUb2tlbiwgaGFzaGVkVG9rZW4sIHF1ZXJ5LCB1c2VyLCB1c2VySWQ7XG4gIHF1ZXJ5ID0gcmVxLnF1ZXJ5O1xuICB1c2VySWQgPSBxdWVyeVtcIlgtVXNlci1JZFwiXTtcbiAgYXV0aFRva2VuID0gcXVlcnlbXCJYLUF1dGgtVG9rZW5cIl07XG4gIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgX2lkOiB1c2VySWQsXG4gICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgfSk7XG4gIGlmICghdXNlcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgcmV0dXJuIHVzZXI7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgdmFyIHNwYWNlO1xuICBzcGFjZSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpO1xuICBpZiAoIXNwYWNlKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJzcGFjZV9pZOacieivr+aIluatpHNwYWNl5bey57uP6KKr5Yig6ZmkXCIpO1xuICB9XG4gIHJldHVybiBzcGFjZTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyA9IGZ1bmN0aW9uKGZsb3dfaWQpIHtcbiAgdmFyIGZsb3c7XG4gIGZsb3cgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmZsb3dzLmZpbmRPbmUoZmxvd19pZCk7XG4gIGlmICghZmxvdykge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwiaWTmnInor6/miJbmraTmtYHnqIvlt7Lnu4/ooqvliKDpmaRcIik7XG4gIH1cbiAgcmV0dXJuIGZsb3c7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlciA9IGZ1bmN0aW9uKHNwYWNlX2lkLCB1c2VyX2lkKSB7XG4gIHZhciBzcGFjZV91c2VyO1xuICBzcGFjZV91c2VyID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdXNlcjogdXNlcl9pZFxuICB9KTtcbiAgaWYgKCFzcGFjZV91c2VyKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJ1c2VyX2lk5a+55bqU55qE55So5oi35LiN5bGe5LqO5b2T5YmNc3BhY2VcIik7XG4gIH1cbiAgcmV0dXJuIHNwYWNlX3VzZXI7XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlVXNlck9yZ0luZm8gPSBmdW5jdGlvbihzcGFjZV91c2VyKSB7XG4gIHZhciBpbmZvLCBvcmc7XG4gIGluZm8gPSBuZXcgT2JqZWN0O1xuICBpbmZvLm9yZ2FuaXphdGlvbiA9IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uO1xuICBvcmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLm9yZ2FuaXphdGlvbnMuZmluZE9uZShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbiwge1xuICAgIGZpZWxkczoge1xuICAgICAgbmFtZTogMSxcbiAgICAgIGZ1bGxuYW1lOiAxXG4gICAgfVxuICB9KTtcbiAgaW5mby5vcmdhbml6YXRpb25fbmFtZSA9IG9yZy5uYW1lO1xuICBpbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IG9yZy5mdWxsbmFtZTtcbiAgcmV0dXJuIGluZm87XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd0VuYWJsZWQgPSBmdW5jdGlvbihmbG93KSB7XG4gIGlmIChmbG93LnN0YXRlICE9PSBcImVuYWJsZWRcIikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5rWB56iL5pyq5ZCv55SoLOaTjeS9nOWksei0pVwiKTtcbiAgfVxufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dTcGFjZU1hdGNoZWQgPSBmdW5jdGlvbihmbG93LCBzcGFjZV9pZCkge1xuICBpZiAoZmxvdy5zcGFjZSAhPT0gc3BhY2VfaWQpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+WSjOW3peS9nOWMuklE5LiN5Yy56YWNXCIpO1xuICB9XG59O1xuXG51dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZvcm0gPSBmdW5jdGlvbihmb3JtX2lkKSB7XG4gIHZhciBmb3JtO1xuICBmb3JtID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5mb3Jtcy5maW5kT25lKGZvcm1faWQpO1xuICBpZiAoIWZvcm0pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn6KGo5Y2VSUTmnInor6/miJbmraTooajljZXlt7Lnu4/ooqvliKDpmaQnKTtcbiAgfVxuICByZXR1cm4gZm9ybTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0Q2F0ZWdvcnkgPSBmdW5jdGlvbihjYXRlZ29yeV9pZCkge1xuICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5jYXRlZ29yaWVzLmZpbmRPbmUoY2F0ZWdvcnlfaWQpO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UgPSBmdW5jdGlvbihpbnN0YW5jZV9mcm9tX2NsaWVudCwgdXNlcl9pbmZvKSB7XG4gIHZhciBhcHByX29iaiwgYXBwcm92ZV9mcm9tX2NsaWVudCwgY2F0ZWdvcnksIGZsb3csIGZsb3dfaWQsIGZvcm0sIGluc19vYmosIG5ld19pbnNfaWQsIG5vdywgcGVybWlzc2lvbnMsIHNwYWNlLCBzcGFjZV9pZCwgc3BhY2VfdXNlciwgc3BhY2VfdXNlcl9vcmdfaW5mbywgc3RhcnRfc3RlcCwgdHJhY2VfZnJvbV9jbGllbnQsIHRyYWNlX29iaiwgdXNlcl9pZDtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0sIFN0cmluZyk7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl0sIFN0cmluZyk7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXSwgU3RyaW5nKTtcbiAgY2hlY2soaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdLCBbXG4gICAge1xuICAgICAgbzogU3RyaW5nLFxuICAgICAgaWRzOiBbU3RyaW5nXVxuICAgIH1cbiAgXSk7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tJc0luQXBwcm92YWwoaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdWzBdLCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdKTtcbiAgc3BhY2VfaWQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdO1xuICBmbG93X2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdO1xuICB1c2VyX2lkID0gdXNlcl9pbmZvLl9pZDtcbiAgdHJhY2VfZnJvbV9jbGllbnQgPSBudWxsO1xuICBhcHByb3ZlX2Zyb21fY2xpZW50ID0gbnVsbDtcbiAgaWYgKGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdICYmIGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdKSB7XG4gICAgdHJhY2VfZnJvbV9jbGllbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXTtcbiAgICBpZiAodHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXSAmJiB0cmFjZV9mcm9tX2NsaWVudFtcImFwcHJvdmVzXCJdWzBdKSB7XG4gICAgICBhcHByb3ZlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1bXCJhcHByb3Zlc1wiXVswXTtcbiAgICB9XG4gIH1cbiAgc3BhY2UgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldFNwYWNlKHNwYWNlX2lkKTtcbiAgZmxvdyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0RmxvdyhmbG93X2lkKTtcbiAgc3BhY2VfdXNlciA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyKHNwYWNlX2lkLCB1c2VyX2lkKTtcbiAgc3BhY2VfdXNlcl9vcmdfaW5mbyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZ2V0U3BhY2VVc2VyT3JnSW5mbyhzcGFjZV91c2VyKTtcbiAgdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pc0Zsb3dFbmFibGVkKGZsb3cpO1xuICB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmlzRmxvd1NwYWNlTWF0Y2hlZChmbG93LCBzcGFjZV9pZCk7XG4gIGZvcm0gPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldEZvcm0oZmxvdy5mb3JtKTtcbiAgcGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd19pZCwgdXNlcl9pZCk7XG4gIGlmICghcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZGRcIikpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuW9k+WJjeeUqOaIt+ayoeacieatpOa1geeoi+eahOaWsOW7uuadg+mZkFwiKTtcbiAgfVxuICBub3cgPSBuZXcgRGF0ZTtcbiAgaW5zX29iaiA9IHt9O1xuICBpbnNfb2JqLl9pZCA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLl9tYWtlTmV3SUQoKTtcbiAgaW5zX29iai5zcGFjZSA9IHNwYWNlX2lkO1xuICBpbnNfb2JqLmZsb3cgPSBmbG93X2lkO1xuICBpbnNfb2JqLmZsb3dfdmVyc2lvbiA9IGZsb3cuY3VycmVudC5faWQ7XG4gIGluc19vYmouZm9ybSA9IGZsb3cuZm9ybTtcbiAgaW5zX29iai5mb3JtX3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuZm9ybV92ZXJzaW9uO1xuICBpbnNfb2JqLm5hbWUgPSBmbG93Lm5hbWU7XG4gIGluc19vYmouc3VibWl0dGVyID0gdXNlcl9pZDtcbiAgaW5zX29iai5zdWJtaXR0ZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gOiB1c2VyX2lkO1xuICBpbnNfb2JqLmFwcGxpY2FudF9uYW1lID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gOiB1c2VyX2luZm8ubmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdIDogc3BhY2VfdXNlci5vcmdhbml6YXRpb247XG4gIGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZVwiXSA6IHNwYWNlX3VzZXJfb3JnX2luZm8ub3JnYW5pemF0aW9uX25hbWU7XG4gIGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZVwiXSA6IHNwYWNlX3VzZXJfb3JnX2luZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudF9jb21wYW55ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfY29tcGFueVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gOiBzcGFjZV91c2VyLmNvbXBhbnlfaWQ7XG4gIGluc19vYmouc3RhdGUgPSAnZHJhZnQnO1xuICBpbnNfb2JqLmNvZGUgPSAnJztcbiAgaW5zX29iai5pc19hcmNoaXZlZCA9IGZhbHNlO1xuICBpbnNfb2JqLmlzX2RlbGV0ZWQgPSBmYWxzZTtcbiAgaW5zX29iai5jcmVhdGVkID0gbm93O1xuICBpbnNfb2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkO1xuICBpbnNfb2JqLm1vZGlmaWVkID0gbm93O1xuICBpbnNfb2JqLm1vZGlmaWVkX2J5ID0gdXNlcl9pZDtcbiAgaW5zX29iai52YWx1ZXMgPSBuZXcgT2JqZWN0O1xuICBpbnNfb2JqLnJlY29yZF9pZHMgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl07XG4gIGlmIChzcGFjZV91c2VyLmNvbXBhbnlfaWQpIHtcbiAgICBpbnNfb2JqLmNvbXBhbnlfaWQgPSBzcGFjZV91c2VyLmNvbXBhbnlfaWQ7XG4gIH1cbiAgdHJhY2Vfb2JqID0ge307XG4gIHRyYWNlX29iai5faWQgPSBuZXcgTW9uZ28uT2JqZWN0SUQoKS5fc3RyO1xuICB0cmFjZV9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZDtcbiAgdHJhY2Vfb2JqLmlzX2ZpbmlzaGVkID0gZmFsc2U7XG4gIHN0YXJ0X3N0ZXAgPSBfLmZpbmQoZmxvdy5jdXJyZW50LnN0ZXBzLCBmdW5jdGlvbihzdGVwKSB7XG4gICAgcmV0dXJuIHN0ZXAuc3RlcF90eXBlID09PSAnc3RhcnQnO1xuICB9KTtcbiAgdHJhY2Vfb2JqLnN0ZXAgPSBzdGFydF9zdGVwLl9pZDtcbiAgdHJhY2Vfb2JqLm5hbWUgPSBzdGFydF9zdGVwLm5hbWU7XG4gIHRyYWNlX29iai5zdGFydF9kYXRlID0gbm93O1xuICBhcHByX29iaiA9IHt9O1xuICBhcHByX29iai5faWQgPSBuZXcgTW9uZ28uT2JqZWN0SUQoKS5fc3RyO1xuICBhcHByX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkO1xuICBhcHByX29iai50cmFjZSA9IHRyYWNlX29iai5faWQ7XG4gIGFwcHJfb2JqLmlzX2ZpbmlzaGVkID0gZmFsc2U7XG4gIGFwcHJfb2JqLnVzZXIgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIDogdXNlcl9pZDtcbiAgYXBwcl9vYmoudXNlcl9uYW1lID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gOiB1c2VyX2luZm8ubmFtZTtcbiAgYXBwcl9vYmouaGFuZGxlciA9IHVzZXJfaWQ7XG4gIGFwcHJfb2JqLmhhbmRsZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lO1xuICBhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbiA9IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uO1xuICBhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9uYW1lID0gc3BhY2VfdXNlcl9vcmdfaW5mby5uYW1lO1xuICBhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IHNwYWNlX3VzZXJfb3JnX2luZm8uZnVsbG5hbWU7XG4gIGFwcHJfb2JqLnR5cGUgPSAnZHJhZnQnO1xuICBhcHByX29iai5zdGFydF9kYXRlID0gbm93O1xuICBhcHByX29iai5yZWFkX2RhdGUgPSBub3c7XG4gIGFwcHJfb2JqLmlzX3JlYWQgPSB0cnVlO1xuICBhcHByX29iai5pc19lcnJvciA9IGZhbHNlO1xuICBhcHByX29iai5kZXNjcmlwdGlvbiA9ICcnO1xuICBhcHByX29iai52YWx1ZXMgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmluaXRpYXRlVmFsdWVzKGluc19vYmoucmVjb3JkX2lkc1swXSwgZmxvd19pZCwgc3BhY2VfaWQsIGZvcm0uY3VycmVudC5maWVsZHMpO1xuICB0cmFjZV9vYmouYXBwcm92ZXMgPSBbYXBwcl9vYmpdO1xuICBpbnNfb2JqLnRyYWNlcyA9IFt0cmFjZV9vYmpdO1xuICBpbnNfb2JqLmluYm94X3VzZXJzID0gaW5zdGFuY2VfZnJvbV9jbGllbnQuaW5ib3hfdXNlcnMgfHwgW107XG4gIGluc19vYmouY3VycmVudF9zdGVwX25hbWUgPSBzdGFydF9zdGVwLm5hbWU7XG4gIGlmIChmbG93LmF1dG9fcmVtaW5kID09PSB0cnVlKSB7XG4gICAgaW5zX29iai5hdXRvX3JlbWluZCA9IHRydWU7XG4gIH1cbiAgaW5zX29iai5mbG93X25hbWUgPSBmbG93Lm5hbWU7XG4gIGlmIChmb3JtLmNhdGVnb3J5KSB7XG4gICAgY2F0ZWdvcnkgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmdldENhdGVnb3J5KGZvcm0uY2F0ZWdvcnkpO1xuICAgIGlmIChjYXRlZ29yeSkge1xuICAgICAgaW5zX29iai5jYXRlZ29yeV9uYW1lID0gY2F0ZWdvcnkubmFtZTtcbiAgICAgIGluc19vYmouY2F0ZWdvcnkgPSBjYXRlZ29yeS5faWQ7XG4gICAgfVxuICB9XG4gIG5ld19pbnNfaWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5pbnNlcnQoaW5zX29iaik7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2goaW5zX29iai5yZWNvcmRfaWRzWzBdLCBzcGFjZV9pZCwgaW5zX29iai5faWQsIGFwcHJfb2JqLl9pZCk7XG4gIHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8oaW5zX29iai5yZWNvcmRfaWRzWzBdLCBuZXdfaW5zX2lkLCBzcGFjZV9pZCk7XG4gIHJldHVybiBuZXdfaW5zX2lkO1xufTtcblxudXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5pbml0aWF0ZVZhbHVlcyA9IGZ1bmN0aW9uKHJlY29yZElkcywgZmxvd0lkLCBzcGFjZUlkLCBmaWVsZHMpIHtcbiAgdmFyIGZpZWxkQ29kZXMsIGZpbHRlclZhbHVlcywgZmxvdywgZm9ybSwgZm9ybUZpZWxkcywgZm9ybVRhYmxlRmllbGRzLCBmb3JtVGFibGVGaWVsZHNDb2RlLCBnZXRGaWVsZE9kYXRhVmFsdWUsIGdldEZvcm1GaWVsZCwgZ2V0Rm9ybVRhYmxlRmllbGQsIGdldEZvcm1UYWJsZUZpZWxkQ29kZSwgZ2V0Rm9ybVRhYmxlU3ViRmllbGQsIGdldFJlbGF0ZWRPYmplY3RGaWVsZENvZGUsIG9iamVjdCwgb2JqZWN0TmFtZSwgb3csIHJlY29yZCwgcmVjb3JkSWQsIHJlZiwgcmVsYXRlZE9iamVjdHMsIHJlbGF0ZWRPYmplY3RzS2V5cywgdGFibGVGaWVsZENvZGVzLCB0YWJsZUZpZWxkTWFwLCB0YWJsZVRvUmVsYXRlZE1hcCwgdmFsdWVzO1xuICBmaWVsZENvZGVzID0gW107XG4gIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICBpZiAoZi50eXBlID09PSAnc2VjdGlvbicpIHtcbiAgICAgIHJldHVybiBfLmVhY2goZi5maWVsZHMsIGZ1bmN0aW9uKGZmKSB7XG4gICAgICAgIHJldHVybiBmaWVsZENvZGVzLnB1c2goZmYuY29kZSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpZWxkQ29kZXMucHVzaChmLmNvZGUpO1xuICAgIH1cbiAgfSk7XG4gIHZhbHVlcyA9IHt9O1xuICBvYmplY3ROYW1lID0gcmVjb3JkSWRzLm87XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdE5hbWUsIHNwYWNlSWQpO1xuICByZWNvcmRJZCA9IHJlY29yZElkcy5pZHNbMF07XG4gIG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3Rfd29ya2Zsb3dzLmZpbmRPbmUoe1xuICAgIG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxuICAgIGZsb3dfaWQ6IGZsb3dJZFxuICB9KTtcbiAgcmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLmZpbmRPbmUocmVjb3JkSWQpO1xuICBmbG93ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoZmxvd0lkLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBmb3JtOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKG93ICYmIHJlY29yZCkge1xuICAgIGZvcm0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJmb3Jtc1wiKS5maW5kT25lKGZsb3cuZm9ybSk7XG4gICAgZm9ybUZpZWxkcyA9IGZvcm0uY3VycmVudC5maWVsZHMgfHwgW107XG4gICAgcmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdE5hbWUsIHNwYWNlSWQpO1xuICAgIHJlbGF0ZWRPYmplY3RzS2V5cyA9IF8ucGx1Y2socmVsYXRlZE9iamVjdHMsICdvYmplY3RfbmFtZScpO1xuICAgIGZvcm1UYWJsZUZpZWxkcyA9IF8uZmlsdGVyKGZvcm1GaWVsZHMsIGZ1bmN0aW9uKGZvcm1GaWVsZCkge1xuICAgICAgcmV0dXJuIGZvcm1GaWVsZC50eXBlID09PSAndGFibGUnO1xuICAgIH0pO1xuICAgIGZvcm1UYWJsZUZpZWxkc0NvZGUgPSBfLnBsdWNrKGZvcm1UYWJsZUZpZWxkcywgJ2NvZGUnKTtcbiAgICBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKHJlbGF0ZWRPYmplY3RzS2V5cywgZnVuY3Rpb24ocmVsYXRlZE9iamVjdHNLZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleS5zdGFydHNXaXRoKHJlbGF0ZWRPYmplY3RzS2V5ICsgJy4nKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlRmllbGRDb2RlID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKGZvcm1UYWJsZUZpZWxkc0NvZGUsIGZ1bmN0aW9uKGZvcm1UYWJsZUZpZWxkQ29kZSkge1xuICAgICAgICByZXR1cm4ga2V5LnN0YXJ0c1dpdGgoZm9ybVRhYmxlRmllbGRDb2RlICsgJy4nKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybVRhYmxlRmllbGQgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBfLmZpbmQoZm9ybVRhYmxlRmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgIHJldHVybiBmLmNvZGUgPT09IGtleTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Rm9ybUZpZWxkID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gXy5maW5kKGZvcm1GaWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgcmV0dXJuIGYuY29kZSA9PT0ga2V5O1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRGb3JtVGFibGVTdWJGaWVsZCA9IGZ1bmN0aW9uKHRhYmxlRmllbGQsIHN1YkZpZWxkQ29kZSkge1xuICAgICAgcmV0dXJuIF8uZmluZCh0YWJsZUZpZWxkLmZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgICAgICByZXR1cm4gZi5jb2RlID09PSBzdWJGaWVsZENvZGU7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGdldEZpZWxkT2RhdGFWYWx1ZSA9IGZ1bmN0aW9uKG9iak5hbWUsIGlkKSB7XG4gICAgICB2YXIgX3JlY29yZCwgX3JlY29yZHMsIG9iajtcbiAgICAgIG9iaiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKTtcbiAgICAgIGlmICghb2JqKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChfLmlzU3RyaW5nKGlkKSkge1xuICAgICAgICBfcmVjb3JkID0gb2JqLmZpbmRPbmUoaWQpO1xuICAgICAgICBpZiAoX3JlY29yZCkge1xuICAgICAgICAgIF9yZWNvcmRbJ0BsYWJlbCddID0gX3JlY29yZC5uYW1lO1xuICAgICAgICAgIHJldHVybiBfcmVjb3JkO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKF8uaXNBcnJheShpZCkpIHtcbiAgICAgICAgX3JlY29yZHMgPSBbXTtcbiAgICAgICAgb2JqLmZpbmQoe1xuICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgJGluOiBpZFxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihfcmVjb3JkKSB7XG4gICAgICAgICAgX3JlY29yZFsnQGxhYmVsJ10gPSBfcmVjb3JkLm5hbWU7XG4gICAgICAgICAgcmV0dXJuIF9yZWNvcmRzLnB1c2goX3JlY29yZCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIV8uaXNFbXB0eShfcmVjb3JkcykpIHtcbiAgICAgICAgICByZXR1cm4gX3JlY29yZHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHRhYmxlRmllbGRDb2RlcyA9IFtdO1xuICAgIHRhYmxlRmllbGRNYXAgPSBbXTtcbiAgICB0YWJsZVRvUmVsYXRlZE1hcCA9IHt9O1xuICAgIGlmICgocmVmID0gb3cuZmllbGRfbWFwKSAhPSBudWxsKSB7XG4gICAgICByZWYuZm9yRWFjaChmdW5jdGlvbihmbSkge1xuICAgICAgICB2YXIgZmllbGRzT2JqLCBmb3JtRmllbGQsIGZvcm1UYWJsZUZpZWxkQ29kZSwgbG9va3VwRmllbGROYW1lLCBsb29rdXBPYmplY3QsIG9UYWJsZUNvZGUsIG9UYWJsZUZpZWxkQ29kZSwgb2JqRmllbGQsIG9iamVjdEZpZWxkLCBvYmplY3RGaWVsZE5hbWUsIG9iamVjdF9maWVsZCwgb2RhdGFGaWVsZFZhbHVlLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUsIHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVsYXRlZE9iamVjdEZpZWxkQ29kZSwgdGFibGVUb1JlbGF0ZWRNYXBLZXksIHdUYWJsZUNvZGUsIHdvcmtmbG93X2ZpZWxkO1xuICAgICAgICBvYmplY3RfZmllbGQgPSBmbS5vYmplY3RfZmllbGQ7XG4gICAgICAgIHdvcmtmbG93X2ZpZWxkID0gZm0ud29ya2Zsb3dfZmllbGQ7XG4gICAgICAgIHJlbGF0ZWRPYmplY3RGaWVsZENvZGUgPSBnZXRSZWxhdGVkT2JqZWN0RmllbGRDb2RlKG9iamVjdF9maWVsZCk7XG4gICAgICAgIGZvcm1UYWJsZUZpZWxkQ29kZSA9IGdldEZvcm1UYWJsZUZpZWxkQ29kZSh3b3JrZmxvd19maWVsZCk7XG4gICAgICAgIG9iakZpZWxkID0gb2JqZWN0LmZpZWxkc1tvYmplY3RfZmllbGRdO1xuICAgICAgICBmb3JtRmllbGQgPSBnZXRGb3JtRmllbGQod29ya2Zsb3dfZmllbGQpO1xuICAgICAgICBpZiAocmVsYXRlZE9iamVjdEZpZWxkQ29kZSkge1xuICAgICAgICAgIG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICBvVGFibGVGaWVsZENvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICB0YWJsZVRvUmVsYXRlZE1hcEtleSA9IG9UYWJsZUNvZGU7XG4gICAgICAgICAgaWYgKCF0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0pIHtcbiAgICAgICAgICAgIHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZm9ybVRhYmxlRmllbGRDb2RlKSB7XG4gICAgICAgICAgICB3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVsnX0ZST01fVEFCTEVfQ09ERSddID0gd1RhYmxlQ29kZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVtvVGFibGVGaWVsZENvZGVdID0gd29ya2Zsb3dfZmllbGQ7XG4gICAgICAgIH0gZWxzZSBpZiAod29ya2Zsb3dfZmllbGQuaW5kZXhPZignLiQuJykgPiAwICYmIG9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA+IDApIHtcbiAgICAgICAgICB3VGFibGVDb2RlID0gd29ya2Zsb3dfZmllbGQuc3BsaXQoJy4kLicpWzBdO1xuICAgICAgICAgIG9UYWJsZUNvZGUgPSBvYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzBdO1xuICAgICAgICAgIGlmIChyZWNvcmQuaGFzT3duUHJvcGVydHkob1RhYmxlQ29kZSkgJiYgXy5pc0FycmF5KHJlY29yZFtvVGFibGVDb2RlXSkpIHtcbiAgICAgICAgICAgIHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgd29ya2Zsb3dfdGFibGVfZmllbGRfY29kZTogd1RhYmxlQ29kZSxcbiAgICAgICAgICAgICAgb2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHJldHVybiB0YWJsZUZpZWxkTWFwLnB1c2goZm0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChvYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gMCAmJiBvYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPT09IC0xKSB7XG4gICAgICAgICAgb2JqZWN0RmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgbG9va3VwRmllbGROYW1lID0gb2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgaWYgKG9iamVjdCkge1xuICAgICAgICAgICAgb2JqZWN0RmllbGQgPSBvYmplY3QuZmllbGRzW29iamVjdEZpZWxkTmFtZV07XG4gICAgICAgICAgICBpZiAob2JqZWN0RmllbGQgJiYgKG9iamVjdEZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIgfHwgb2JqZWN0RmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpICYmICFvYmplY3RGaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICAgICAgICBmaWVsZHNPYmogPSB7fTtcbiAgICAgICAgICAgICAgZmllbGRzT2JqW2xvb2t1cEZpZWxkTmFtZV0gPSAxO1xuICAgICAgICAgICAgICBsb29rdXBPYmplY3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0RmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kT25lKHJlY29yZFtvYmplY3RGaWVsZE5hbWVdLCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiBmaWVsZHNPYmpcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmIChsb29rdXBPYmplY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IGxvb2t1cE9iamVjdFtsb29rdXBGaWVsZE5hbWVdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZvcm1GaWVsZCAmJiBvYmpGaWVsZCAmJiBmb3JtRmllbGQudHlwZSA9PT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob2JqRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvYmpGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gb2JqRmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSA9IHJlY29yZFtvYmpGaWVsZC5uYW1lXTtcbiAgICAgICAgICBvZGF0YUZpZWxkVmFsdWU7XG4gICAgICAgICAgaWYgKG9iakZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuICAgICAgICAgICAgb2RhdGFGaWVsZFZhbHVlID0gZ2V0RmllbGRPZGF0YVZhbHVlKHJlZmVyZW5jZVRvT2JqZWN0TmFtZSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCFvYmpGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG4gICAgICAgICAgICBvZGF0YUZpZWxkVmFsdWUgPSBnZXRGaWVsZE9kYXRhVmFsdWUocmVmZXJlbmNlVG9PYmplY3ROYW1lLCByZWZlcmVuY2VUb0ZpZWxkVmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdmFsdWVzW3dvcmtmbG93X2ZpZWxkXSA9IG9kYXRhRmllbGRWYWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQuaGFzT3duUHJvcGVydHkob2JqZWN0X2ZpZWxkKSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZXNbd29ya2Zsb3dfZmllbGRdID0gcmVjb3JkW29iamVjdF9maWVsZF07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBfLnVuaXEodGFibGVGaWVsZENvZGVzKS5mb3JFYWNoKGZ1bmN0aW9uKHRmYykge1xuICAgICAgdmFyIGM7XG4gICAgICBjID0gSlNPTi5wYXJzZSh0ZmMpO1xuICAgICAgdmFsdWVzW2Mud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZV0gPSBbXTtcbiAgICAgIHJldHVybiByZWNvcmRbYy5vYmplY3RfdGFibGVfZmllbGRfY29kZV0uZm9yRWFjaChmdW5jdGlvbih0cikge1xuICAgICAgICB2YXIgbmV3VHI7XG4gICAgICAgIG5ld1RyID0ge307XG4gICAgICAgIF8uZWFjaCh0ciwgZnVuY3Rpb24odiwgaykge1xuICAgICAgICAgIHJldHVybiB0YWJsZUZpZWxkTWFwLmZvckVhY2goZnVuY3Rpb24odGZtKSB7XG4gICAgICAgICAgICB2YXIgd1RkQ29kZTtcbiAgICAgICAgICAgIGlmICh0Zm0ub2JqZWN0X2ZpZWxkID09PSAoYy5vYmplY3RfdGFibGVfZmllbGRfY29kZSArICcuJC4nICsgaykpIHtcbiAgICAgICAgICAgICAgd1RkQ29kZSA9IHRmbS53b3JrZmxvd19maWVsZC5zcGxpdCgnLiQuJylbMV07XG4gICAgICAgICAgICAgIHJldHVybiBuZXdUclt3VGRDb2RlXSA9IHY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIV8uaXNFbXB0eShuZXdUcikpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWVzW2Mud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZV0ucHVzaChuZXdUcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIF8uZWFjaCh0YWJsZVRvUmVsYXRlZE1hcCwgZnVuY3Rpb24obWFwLCBrZXkpIHtcbiAgICAgIHZhciBmb3JtVGFibGVGaWVsZCwgcmVsYXRlZEZpZWxkLCByZWxhdGVkRmllbGROYW1lLCByZWxhdGVkT2JqZWN0LCByZWxhdGVkT2JqZWN0TmFtZSwgcmVsYXRlZFJlY29yZHMsIHNlbGVjdG9yLCB0YWJsZUNvZGUsIHRhYmxlVmFsdWVzO1xuICAgICAgdGFibGVDb2RlID0gbWFwLl9GUk9NX1RBQkxFX0NPREU7XG4gICAgICBmb3JtVGFibGVGaWVsZCA9IGdldEZvcm1UYWJsZUZpZWxkKHRhYmxlQ29kZSk7XG4gICAgICBpZiAoIXRhYmxlQ29kZSkge1xuICAgICAgICByZXR1cm4gY29uc29sZS53YXJuKCd0YWJsZVRvUmVsYXRlZDogWycgKyBrZXkgKyAnXSBtaXNzaW5nIGNvcnJlc3BvbmRpbmcgdGFibGUuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWxhdGVkT2JqZWN0TmFtZSA9IGtleTtcbiAgICAgICAgdGFibGVWYWx1ZXMgPSBbXTtcbiAgICAgICAgcmVsYXRlZE9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKTtcbiAgICAgICAgcmVsYXRlZEZpZWxkID0gXy5maW5kKHJlbGF0ZWRPYmplY3QuZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgcmV0dXJuIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhmLnR5cGUpICYmIGYucmVmZXJlbmNlX3RvID09PSBvYmplY3ROYW1lO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVsYXRlZEZpZWxkTmFtZSA9IHJlbGF0ZWRGaWVsZC5uYW1lO1xuICAgICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgICBzZWxlY3RvcltyZWxhdGVkRmllbGROYW1lXSA9IHJlY29yZElkO1xuICAgICAgICByZWxhdGVkUmVjb3JkcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0TmFtZSkuZmluZChzZWxlY3Rvcik7XG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2goZnVuY3Rpb24ocnIpIHtcbiAgICAgICAgICB2YXIgdGFibGVWYWx1ZUl0ZW07XG4gICAgICAgICAgdGFibGVWYWx1ZUl0ZW0gPSB7fTtcbiAgICAgICAgICBfLmVhY2gobWFwLCBmdW5jdGlvbih2YWx1ZUtleSwgZmllbGRLZXkpIHtcbiAgICAgICAgICAgIHZhciBmb3JtRmllbGQsIGZvcm1GaWVsZEtleSwgcmVmZXJlbmNlVG9GaWVsZFZhbHVlLCByZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlbGF0ZWRPYmplY3RGaWVsZCwgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgaWYgKGZpZWxkS2V5ICE9PSAnX0ZST01fVEFCTEVfQ09ERScpIHtcbiAgICAgICAgICAgICAgdGFibGVGaWVsZFZhbHVlO1xuICAgICAgICAgICAgICBmb3JtRmllbGRLZXk7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZUtleS5zdGFydHNXaXRoKHRhYmxlQ29kZSArICcuJykpIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSAodmFsdWVLZXkuc3BsaXQoXCIuXCIpWzFdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtRmllbGRLZXkgPSB2YWx1ZUtleTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBmb3JtRmllbGQgPSBnZXRGb3JtVGFibGVTdWJGaWVsZChmb3JtVGFibGVGaWVsZCwgZm9ybUZpZWxkS2V5KTtcbiAgICAgICAgICAgICAgcmVsYXRlZE9iamVjdEZpZWxkID0gcmVsYXRlZE9iamVjdC5maWVsZHNbZmllbGRLZXldO1xuICAgICAgICAgICAgICBpZiAoZm9ybUZpZWxkLnR5cGUgPT09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlVG9PYmplY3ROYW1lID0gcmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VUb0ZpZWxkVmFsdWUgPSBycltmaWVsZEtleV07XG4gICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IGdldEZpZWxkT2RhdGFWYWx1ZShyZWZlcmVuY2VUb09iamVjdE5hbWUsIHJlZmVyZW5jZVRvRmllbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhYmxlRmllbGRWYWx1ZSA9IHJyW2ZpZWxkS2V5XTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gdGFibGVWYWx1ZUl0ZW1bZm9ybUZpZWxkS2V5XSA9IHRhYmxlRmllbGRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gdGFibGVWYWx1ZXMucHVzaCh0YWJsZVZhbHVlSXRlbSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdmFsdWVzW3RhYmxlQ29kZV0gPSB0YWJsZVZhbHVlcztcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAob3cuZmllbGRfbWFwX3NjcmlwdCkge1xuICAgICAgXy5leHRlbmQodmFsdWVzLCB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmV2YWxGaWVsZE1hcFNjcmlwdChvdy5maWVsZF9tYXBfc2NyaXB0LCBvYmplY3ROYW1lLCBzcGFjZUlkLCByZWNvcmRJZCkpO1xuICAgIH1cbiAgfVxuICBmaWx0ZXJWYWx1ZXMgPSB7fTtcbiAgXy5lYWNoKF8ua2V5cyh2YWx1ZXMpLCBmdW5jdGlvbihrKSB7XG4gICAgaWYgKGZpZWxkQ29kZXMuaW5jbHVkZXMoaykpIHtcbiAgICAgIHJldHVybiBmaWx0ZXJWYWx1ZXNba10gPSB2YWx1ZXNba107XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZpbHRlclZhbHVlcztcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuZXZhbEZpZWxkTWFwU2NyaXB0ID0gZnVuY3Rpb24oZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgb2JqZWN0SWQpIHtcbiAgdmFyIGZ1bmMsIHJlY29yZCwgc2NyaXB0LCB2YWx1ZXM7XG4gIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKS5maW5kT25lKG9iamVjdElkKTtcbiAgc2NyaXB0ID0gXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZWNvcmQpIHsgXCIgKyBmaWVsZF9tYXBfc2NyaXB0ICsgXCIgfVwiO1xuICBmdW5jID0gX2V2YWwoc2NyaXB0LCBcImZpZWxkX21hcF9zY3JpcHRcIik7XG4gIHZhbHVlcyA9IGZ1bmMocmVjb3JkKTtcbiAgaWYgKF8uaXNPYmplY3QodmFsdWVzKSkge1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcihcImV2YWxGaWVsZE1hcFNjcmlwdDog6ISa5pys6L+U5Zue5YC857G75Z6L5LiN5piv5a+56LGhXCIpO1xuICB9XG4gIHJldHVybiB7fTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVBdHRhY2ggPSBmdW5jdGlvbihyZWNvcmRJZHMsIHNwYWNlSWQsIGluc0lkLCBhcHByb3ZlSWQpIHtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1snY21zX2ZpbGVzJ10uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgcGFyZW50OiByZWNvcmRJZHNcbiAgfSkuZm9yRWFjaChmdW5jdGlvbihjZikge1xuICAgIHJldHVybiBfLmVhY2goY2YudmVyc2lvbnMsIGZ1bmN0aW9uKHZlcnNpb25JZCwgaWR4KSB7XG4gICAgICB2YXIgZiwgbmV3RmlsZTtcbiAgICAgIGYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zWydjZnMuZmlsZXMuZmlsZXJlY29yZCddLmZpbmRPbmUodmVyc2lvbklkKTtcbiAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgICAgcmV0dXJuIG5ld0ZpbGUuYXR0YWNoRGF0YShmLmNyZWF0ZVJlYWRTdHJlYW0oJ2ZpbGVzJyksIHtcbiAgICAgICAgdHlwZTogZi5vcmlnaW5hbC50eXBlXG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdmFyIG1ldGFkYXRhO1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnIuZXJyb3IsIGVyci5yZWFzb24pO1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUubmFtZShmLm5hbWUoKSk7XG4gICAgICAgIG5ld0ZpbGUuc2l6ZShmLnNpemUoKSk7XG4gICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgIG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxuICAgICAgICAgIG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICBpbnN0YW5jZTogaW5zSWQsXG4gICAgICAgICAgYXBwcm92ZTogYXBwcm92ZUlkLFxuICAgICAgICAgIHBhcmVudDogY2YuX2lkXG4gICAgICAgIH07XG4gICAgICAgIGlmIChpZHggPT09IDApIHtcbiAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgIHJldHVybiBjZnMuaW5zdGFuY2VzLmluc2VydChuZXdGaWxlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8gPSBmdW5jdGlvbihyZWNvcmRJZHMsIGluc0lkLCBzcGFjZUlkKSB7XG4gIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkudXBkYXRlKHJlY29yZElkcy5pZHNbMF0sIHtcbiAgICAkcHVzaDoge1xuICAgICAgaW5zdGFuY2VzOiB7XG4gICAgICAgICRlYWNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgX2lkOiBpbnNJZCxcbiAgICAgICAgICAgIHN0YXRlOiAnZHJhZnQnXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICAkcG9zaXRpb246IDBcbiAgICAgIH1cbiAgICB9LFxuICAgICRzZXQ6IHtcbiAgICAgIGxvY2tlZDogdHJ1ZSxcbiAgICAgIGluc3RhbmNlX3N0YXRlOiAnZHJhZnQnXG4gICAgfVxuICB9KTtcbn07XG5cbnV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tJc0luQXBwcm92YWwgPSBmdW5jdGlvbihyZWNvcmRJZHMsIHNwYWNlSWQpIHtcbiAgdmFyIHJlY29yZDtcbiAgcmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlY29yZElkcy5vLCBzcGFjZUlkKS5maW5kT25lKHtcbiAgICBfaWQ6IHJlY29yZElkcy5pZHNbMF0sXG4gICAgaW5zdGFuY2VzOiB7XG4gICAgICAkZXhpc3RzOiB0cnVlXG4gICAgfVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBpbnN0YW5jZXM6IDFcbiAgICB9XG4gIH0pO1xuICBpZiAocmVjb3JkICYmIHJlY29yZC5pbnN0YW5jZXNbMF0uc3RhdGUgIT09ICdjb21wbGV0ZWQnICYmIENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmZpbmQocmVjb3JkLmluc3RhbmNlc1swXS5faWQpLmNvdW50KCkgPiAwKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmraTorrDlvZXlt7Llj5HotbfmtYHnqIvmraPlnKjlrqHmibnkuK3vvIzlvoXlrqHmibnnu5PmnZ/mlrnlj6/lj5HotbfkuIvkuIDmrKHlrqHmibnvvIFcIik7XG4gIH1cbn07XG4iLCJKc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvczMvXCIsICAocmVxLCByZXMsIG5leHQpIC0+XHJcblxyXG5cdEpzb25Sb3V0ZXMucGFyc2VGaWxlcyByZXEsIHJlcywgKCktPlxyXG5cdFx0Y29sbGVjdGlvbiA9IGNmcy5maWxlc1xyXG5cdFx0ZmlsZUNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldE9iamVjdChcImNtc19maWxlc1wiKS5kYlxyXG5cclxuXHRcdGlmIHJlcS5maWxlcyBhbmQgcmVxLmZpbGVzWzBdXHJcblxyXG5cdFx0XHRuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcclxuXHRcdFx0bmV3RmlsZS5hdHRhY2hEYXRhIHJlcS5maWxlc1swXS5kYXRhLCB7dHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlfSwgKGVycikgLT5cclxuXHRcdFx0XHRmaWxlbmFtZSA9IHJlcS5maWxlc1swXS5maWxlbmFtZVxyXG5cdFx0XHRcdGV4dGVudGlvbiA9IGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKClcclxuXHRcdFx0XHRpZiBbXCJpbWFnZS5qcGdcIiwgXCJpbWFnZS5naWZcIiwgXCJpbWFnZS5qcGVnXCIsIFwiaW1hZ2UucG5nXCJdLmluY2x1ZGVzKGZpbGVuYW1lLnRvTG93ZXJDYXNlKCkpXHJcblx0XHRcdFx0XHRmaWxlbmFtZSA9IFwiaW1hZ2UtXCIgKyBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KCdZWVlZTU1EREhIbW1zcycpICsgXCIuXCIgKyBleHRlbnRpb25cclxuXHJcblx0XHRcdFx0Ym9keSA9IHJlcS5ib2R5XHJcblx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRpZiBib2R5ICYmIChib2R5Wyd1cGxvYWRfZnJvbSddIGlzIFwiSUVcIiBvciBib2R5Wyd1cGxvYWRfZnJvbSddIGlzIFwibm9kZVwiKVxyXG5cdFx0XHRcdFx0XHRmaWxlbmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudChmaWxlbmFtZSlcclxuXHRcdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGZpbGVuYW1lKVxyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlXHJcblx0XHRcdFx0XHRmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoLyUvZywgXCItXCIpXHJcblxyXG5cdFx0XHRcdG5ld0ZpbGUubmFtZShmaWxlbmFtZSlcclxuXHJcblx0XHRcdFx0aWYgYm9keSAmJiBib2R5Wydvd25lciddICYmIGJvZHlbJ3NwYWNlJ10gJiYgYm9keVsncmVjb3JkX2lkJ10gICYmIGJvZHlbJ29iamVjdF9uYW1lJ11cclxuXHRcdFx0XHRcdHBhcmVudCA9IGJvZHlbJ3BhcmVudCddXHJcblx0XHRcdFx0XHRvd25lciA9IGJvZHlbJ293bmVyJ11cclxuXHRcdFx0XHRcdG93bmVyX25hbWUgPSBib2R5Wydvd25lcl9uYW1lJ11cclxuXHRcdFx0XHRcdHNwYWNlID0gYm9keVsnc3BhY2UnXVxyXG5cdFx0XHRcdFx0cmVjb3JkX2lkID0gYm9keVsncmVjb3JkX2lkJ11cclxuXHRcdFx0XHRcdG9iamVjdF9uYW1lID0gYm9keVsnb2JqZWN0X25hbWUnXVxyXG5cdFx0XHRcdFx0cGFyZW50ID0gYm9keVsncGFyZW50J11cclxuXHRcdFx0XHRcdG1ldGFkYXRhID0ge293bmVyOm93bmVyLCBvd25lcl9uYW1lOm93bmVyX25hbWUsIHNwYWNlOnNwYWNlLCByZWNvcmRfaWQ6cmVjb3JkX2lkLCBvYmplY3RfbmFtZTogb2JqZWN0X25hbWV9XHJcblx0XHRcdFx0XHRpZiBwYXJlbnRcclxuXHRcdFx0XHRcdFx0bWV0YWRhdGEucGFyZW50ID0gcGFyZW50XHJcblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGFcclxuXHRcdFx0XHRcdGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXHJcblxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXHJcblxyXG5cclxuXHRcdFx0XHRzaXplID0gZmlsZU9iai5vcmlnaW5hbC5zaXplXHJcblx0XHRcdFx0aWYgIXNpemVcclxuXHRcdFx0XHRcdHNpemUgPSAxMDI0XHJcblx0XHRcdFx0aWYgcGFyZW50XHJcblx0XHRcdFx0XHRmaWxlQ29sbGVjdGlvbi51cGRhdGUoe19pZDpwYXJlbnR9LHtcclxuXHRcdFx0XHRcdFx0JHNldDpcclxuXHRcdFx0XHRcdFx0XHRleHRlbnRpb246IGV4dGVudGlvblxyXG5cdFx0XHRcdFx0XHRcdHNpemU6IHNpemVcclxuXHRcdFx0XHRcdFx0XHRtb2RpZmllZDogKG5ldyBEYXRlKCkpXHJcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IG93bmVyXHJcblx0XHRcdFx0XHRcdCRwdXNoOlxyXG5cdFx0XHRcdFx0XHRcdHZlcnNpb25zOlxyXG5cdFx0XHRcdFx0XHRcdFx0JGVhY2g6IFsgZmlsZU9iai5faWQgXVxyXG5cdFx0XHRcdFx0XHRcdFx0JHBvc2l0aW9uOiAwXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdG5ld0ZpbGVPYmpJZCA9IGZpbGVDb2xsZWN0aW9uLmRpcmVjdC5pbnNlcnQge1xyXG5cdFx0XHRcdFx0XHRuYW1lOiBmaWxlbmFtZVxyXG5cdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogJydcclxuXHRcdFx0XHRcdFx0ZXh0ZW50aW9uOiBleHRlbnRpb25cclxuXHRcdFx0XHRcdFx0c2l6ZTogc2l6ZVxyXG5cdFx0XHRcdFx0XHR2ZXJzaW9uczogW2ZpbGVPYmouX2lkXVxyXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IHtvOm9iamVjdF9uYW1lLGlkczpbcmVjb3JkX2lkXX1cclxuXHRcdFx0XHRcdFx0b3duZXI6IG93bmVyXHJcblx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZVxyXG5cdFx0XHRcdFx0XHRjcmVhdGVkOiAobmV3IERhdGUoKSlcclxuXHRcdFx0XHRcdFx0Y3JlYXRlZF9ieTogb3duZXJcclxuXHRcdFx0XHRcdFx0bW9kaWZpZWQ6IChuZXcgRGF0ZSgpKVxyXG5cdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogb3duZXJcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGZpbGVPYmoudXBkYXRlKHskc2V0OiB7J21ldGFkYXRhLnBhcmVudCcgOiBuZXdGaWxlT2JqSWR9fSlcclxuXHJcblx0XHRcdFx0cmVzcCA9XHJcblx0XHRcdFx0XHR2ZXJzaW9uX2lkOiBmaWxlT2JqLl9pZCxcclxuXHRcdFx0XHRcdHNpemU6IHNpemVcclxuXHJcblx0XHRcdFx0cmVzLnNldEhlYWRlcihcIngtYW16LXZlcnNpb24taWRcIixmaWxlT2JqLl9pZCk7XHJcblx0XHRcdFx0cmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwKSk7XHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRlbHNlXHJcblx0XHRcdHJlcy5zdGF0dXNDb2RlID0gNTAwO1xyXG5cdFx0XHRyZXMuZW5kKCk7XHJcblxyXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvczMvOmNvbGxlY3Rpb25cIiwgIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHR0cnlcclxuXHRcdHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcylcclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKVxyXG5cclxuXHRcdGNvbGxlY3Rpb25OYW1lID0gcmVxLnBhcmFtcy5jb2xsZWN0aW9uXHJcblxyXG5cdFx0SnNvblJvdXRlcy5wYXJzZUZpbGVzIHJlcSwgcmVzLCAoKS0+XHJcblx0XHRcdGNvbGxlY3Rpb24gPSBjZnNbY29sbGVjdGlvbk5hbWVdXHJcblxyXG5cdFx0XHRpZiBub3QgY29sbGVjdGlvblxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIENvbGxlY3Rpb25cIilcclxuXHJcblx0XHRcdGlmIHJlcS5maWxlcyBhbmQgcmVxLmZpbGVzWzBdXHJcblxyXG5cdFx0XHRcdG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpXHJcblx0XHRcdFx0bmV3RmlsZS5uYW1lKHJlcS5maWxlc1swXS5maWxlbmFtZSlcclxuXHJcblx0XHRcdFx0aWYgcmVxLmJvZHlcclxuXHRcdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEgPSByZXEuYm9keVxyXG5cclxuXHRcdFx0XHRuZXdGaWxlLm93bmVyID0gdXNlcklkXHJcblx0XHRcdFx0bmV3RmlsZS5tZXRhZGF0YS5vd25lciA9IHVzZXJJZFxyXG5cclxuXHRcdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEgcmVxLmZpbGVzWzBdLmRhdGEsIHt0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGV9XHJcblxyXG5cdFx0XHRcdGNvbGxlY3Rpb24uaW5zZXJ0IG5ld0ZpbGVcclxuXHJcblx0XHRcdFx0cmVzdWx0RGF0YSA9IGNvbGxlY3Rpb24uZmlsZXMuZmluZE9uZShuZXdGaWxlLl9pZClcclxuXHRcdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdFx0XHRkYXRhOiByZXN1bHREYXRhXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBGaWxlXCIpXHJcblxyXG5cdFx0cmV0dXJuXHJcblx0Y2F0Y2ggZVxyXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdGNvZGU6IGUuZXJyb3IgfHwgNTAwXHJcblx0XHRcdGRhdGE6IHtlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZX1cclxuXHRcdH1cclxuXHJcblxyXG5cclxuZ2V0UXVlcnlTdHJpbmcgPSAoYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgcXVlcnksIG1ldGhvZCkgLT5cclxuXHRjb25zb2xlLmxvZyBcIi0tLS11dWZsb3dNYW5hZ2VyLmdldFF1ZXJ5U3RyaW5nLS0tLVwiXHJcblx0QUxZID0gcmVxdWlyZSgnYWxpeXVuLXNkaycpXHJcblx0ZGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpXHJcblxyXG5cdHF1ZXJ5LkZvcm1hdCA9IFwianNvblwiXHJcblx0cXVlcnkuVmVyc2lvbiA9IFwiMjAxNy0wMy0yMVwiXHJcblx0cXVlcnkuQWNjZXNzS2V5SWQgPSBhY2Nlc3NLZXlJZFxyXG5cdHF1ZXJ5LlNpZ25hdHVyZU1ldGhvZCA9IFwiSE1BQy1TSEExXCJcclxuXHRxdWVyeS5UaW1lc3RhbXAgPSBBTFkudXRpbC5kYXRlLmlzbzg2MDEoZGF0ZSlcclxuXHRxdWVyeS5TaWduYXR1cmVWZXJzaW9uID0gXCIxLjBcIlxyXG5cdHF1ZXJ5LlNpZ25hdHVyZU5vbmNlID0gU3RyaW5nKGRhdGUuZ2V0VGltZSgpKVxyXG5cclxuXHRxdWVyeUtleXMgPSBPYmplY3Qua2V5cyhxdWVyeSlcclxuXHRxdWVyeUtleXMuc29ydCgpXHJcblxyXG5cdGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyA9IFwiXCJcclxuXHRxdWVyeUtleXMuZm9yRWFjaCAobmFtZSkgLT5cclxuXHRcdGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyArPSBcIiZcIiArIG5hbWUgKyBcIj1cIiArIEFMWS51dGlsLnBvcEVzY2FwZShxdWVyeVtuYW1lXSlcclxuXHJcblx0c3RyaW5nVG9TaWduID0gbWV0aG9kLnRvVXBwZXJDYXNlKCkgKyAnJiUyRiYnICsgQUxZLnV0aWwucG9wRXNjYXBlKGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZy5zdWJzdHIoMSkpXHJcblxyXG5cdHF1ZXJ5LlNpZ25hdHVyZSA9IEFMWS51dGlsLmNyeXB0by5obWFjKHNlY3JldEFjY2Vzc0tleSArICcmJywgc3RyaW5nVG9TaWduLCAnYmFzZTY0JywgJ3NoYTEnKVxyXG5cclxuXHRxdWVyeVN0ciA9IEFMWS51dGlsLnF1ZXJ5UGFyYW1zVG9TdHJpbmcocXVlcnkpXHJcblx0Y29uc29sZS5sb2cgcXVlcnlTdHJcclxuXHRyZXR1cm4gcXVlcnlTdHJcclxuXHJcbkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9zMy92b2QvdXBsb2FkXCIsICAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0dHJ5XHJcblx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIHBlcm1pc3Npb25cIilcclxuXHJcblx0XHRjb2xsZWN0aW9uTmFtZSA9IFwidmlkZW9zXCJcclxuXHJcblx0XHRBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJylcclxuXHJcblx0XHRKc29uUm91dGVzLnBhcnNlRmlsZXMgcmVxLCByZXMsICgpLT5cclxuXHRcdFx0Y29sbGVjdGlvbiA9IGNmc1tjb2xsZWN0aW9uTmFtZV1cclxuXHJcblx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gQ29sbGVjdGlvblwiKVxyXG5cclxuXHRcdFx0aWYgcmVxLmZpbGVzIGFuZCByZXEuZmlsZXNbMF1cclxuXHJcblx0XHRcdFx0aWYgY29sbGVjdGlvbk5hbWUgaXMgJ3ZpZGVvcycgYW5kIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuY2ZzPy5zdG9yZSBpcyBcIk9TU1wiXHJcblx0XHRcdFx0XHRhY2Nlc3NLZXlJZCA9IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuPy5hY2Nlc3NLZXlJZFxyXG5cdFx0XHRcdFx0c2VjcmV0QWNjZXNzS2V5ID0gTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4/LnNlY3JldEFjY2Vzc0tleVxyXG5cclxuXHRcdFx0XHRcdGRhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKVxyXG5cclxuXHRcdFx0XHRcdHF1ZXJ5ID0ge1xyXG5cdFx0XHRcdFx0XHRBY3Rpb246IFwiQ3JlYXRlVXBsb2FkVmlkZW9cIlxyXG5cdFx0XHRcdFx0XHRUaXRsZTogcmVxLmZpbGVzWzBdLmZpbGVuYW1lXHJcblx0XHRcdFx0XHRcdEZpbGVOYW1lOiByZXEuZmlsZXNbMF0uZmlsZW5hbWVcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR1cmwgPSBcImh0dHA6Ly92b2QuY24tc2hhbmdoYWkuYWxpeXVuY3MuY29tLz9cIiArIGdldFF1ZXJ5U3RyaW5nKGFjY2Vzc0tleUlkLCBzZWNyZXRBY2Nlc3NLZXksIHF1ZXJ5LCAnR0VUJylcclxuXHJcblx0XHRcdFx0XHRyID0gSFRUUC5jYWxsICdHRVQnLCB1cmxcclxuXHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyByXHJcblxyXG5cdFx0XHRcdFx0aWYgci5kYXRhPy5WaWRlb0lkXHJcblx0XHRcdFx0XHRcdHZpZGVvSWQgPSByLmRhdGEuVmlkZW9JZFxyXG5cdFx0XHRcdFx0XHR1cGxvYWRBZGRyZXNzID0gSlNPTi5wYXJzZShuZXcgQnVmZmVyKHIuZGF0YS5VcGxvYWRBZGRyZXNzLCAnYmFzZTY0JykudG9TdHJpbmcoKSlcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cgdXBsb2FkQWRkcmVzc1xyXG5cdFx0XHRcdFx0XHR1cGxvYWRBdXRoID0gSlNPTi5wYXJzZShuZXcgQnVmZmVyKHIuZGF0YS5VcGxvYWRBdXRoLCAnYmFzZTY0JykudG9TdHJpbmcoKSlcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cgdXBsb2FkQXV0aFxyXG5cclxuXHRcdFx0XHRcdFx0b3NzID0gbmV3IEFMWS5PU1Moe1xyXG5cdFx0XHRcdFx0XHRcdFwiYWNjZXNzS2V5SWRcIjogdXBsb2FkQXV0aC5BY2Nlc3NLZXlJZCxcclxuXHRcdFx0XHRcdFx0XHRcInNlY3JldEFjY2Vzc0tleVwiOiB1cGxvYWRBdXRoLkFjY2Vzc0tleVNlY3JldCxcclxuXHRcdFx0XHRcdFx0XHRcImVuZHBvaW50XCI6IHVwbG9hZEFkZHJlc3MuRW5kcG9pbnQsXHJcblx0XHRcdFx0XHRcdFx0XCJhcGlWZXJzaW9uXCI6ICcyMDEzLTEwLTE1JyxcclxuXHRcdFx0XHRcdFx0XHRcInNlY3VyaXR5VG9rZW5cIjogdXBsb2FkQXV0aC5TZWN1cml0eVRva2VuXHJcblx0XHRcdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdFx0XHRvc3MucHV0T2JqZWN0IHtcclxuXHRcdFx0XHRcdFx0XHRCdWNrZXQ6IHVwbG9hZEFkZHJlc3MuQnVja2V0LFxyXG5cdFx0XHRcdFx0XHRcdEtleTogdXBsb2FkQWRkcmVzcy5GaWxlTmFtZSxcclxuXHRcdFx0XHRcdFx0XHRCb2R5OiByZXEuZmlsZXNbMF0uZGF0YSxcclxuXHRcdFx0XHRcdFx0XHRBY2Nlc3NDb250cm9sQWxsb3dPcmlnaW46ICcnLFxyXG5cdFx0XHRcdFx0XHRcdENvbnRlbnRUeXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGUsXHJcblx0XHRcdFx0XHRcdFx0Q2FjaGVDb250cm9sOiAnbm8tY2FjaGUnLFxyXG5cdFx0XHRcdFx0XHRcdENvbnRlbnREaXNwb3NpdGlvbjogJycsXHJcblx0XHRcdFx0XHRcdFx0Q29udGVudEVuY29kaW5nOiAndXRmLTgnLFxyXG5cdFx0XHRcdFx0XHRcdFNlcnZlclNpZGVFbmNyeXB0aW9uOiAnQUVTMjU2JyxcclxuXHRcdFx0XHRcdFx0XHRFeHBpcmVzOiBudWxsXHJcblx0XHRcdFx0XHRcdH0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQgKGVyciwgZGF0YSkgLT5cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgZXJyXHJcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnZXJyb3I6JywgZXJyKVxyXG5cdFx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIGVyci5tZXNzYWdlKVxyXG5cclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnc3VjY2VzczonLCBkYXRhKVxyXG5cclxuXHRcdFx0XHRcdFx0XHRuZXdEYXRlID0gQUxZLnV0aWwuZGF0ZS5nZXREYXRlKClcclxuXHJcblx0XHRcdFx0XHRcdFx0Z2V0UGxheUluZm9RdWVyeSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdEFjdGlvbjogJ0dldFBsYXlJbmZvJ1xyXG5cdFx0XHRcdFx0XHRcdFx0VmlkZW9JZDogdmlkZW9JZFxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Z2V0UGxheUluZm9VcmwgPSBcImh0dHA6Ly92b2QuY24tc2hhbmdoYWkuYWxpeXVuY3MuY29tLz9cIiArIGdldFF1ZXJ5U3RyaW5nKGFjY2Vzc0tleUlkLCBzZWNyZXRBY2Nlc3NLZXksIGdldFBsYXlJbmZvUXVlcnksICdHRVQnKVxyXG5cclxuXHRcdFx0XHRcdFx0XHRnZXRQbGF5SW5mb1Jlc3VsdCA9IEhUVFAuY2FsbCAnR0VUJywgZ2V0UGxheUluZm9VcmxcclxuXHJcblx0XHRcdFx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0XHRcdFx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YTogZ2V0UGxheUluZm9SZXN1bHRcclxuXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBGaWxlXCIpXHJcblxyXG5cdFx0cmV0dXJuXHJcblx0Y2F0Y2ggZVxyXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdGNvZGU6IGUuZXJyb3IgfHwgNTAwXHJcblx0XHRcdGRhdGE6IHtlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZX1cclxuXHRcdH0iLCJ2YXIgZ2V0UXVlcnlTdHJpbmc7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9zMy9cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyhyZXEsIHJlcywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGZpbGVDb2xsZWN0aW9uLCBuZXdGaWxlO1xuICAgIGNvbGxlY3Rpb24gPSBjZnMuZmlsZXM7XG4gICAgZmlsZUNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldE9iamVjdChcImNtc19maWxlc1wiKS5kYjtcbiAgICBpZiAocmVxLmZpbGVzICYmIHJlcS5maWxlc1swXSkge1xuICAgICAgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XG4gICAgICByZXR1cm4gbmV3RmlsZS5hdHRhY2hEYXRhKHJlcS5maWxlc1swXS5kYXRhLCB7XG4gICAgICAgIHR5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZVxuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIHZhciBib2R5LCBlLCBleHRlbnRpb24sIGZpbGVPYmosIGZpbGVuYW1lLCBtZXRhZGF0YSwgbmV3RmlsZU9iaklkLCBvYmplY3RfbmFtZSwgb3duZXIsIG93bmVyX25hbWUsIHBhcmVudCwgcmVjb3JkX2lkLCByZXNwLCBzaXplLCBzcGFjZTtcbiAgICAgICAgZmlsZW5hbWUgPSByZXEuZmlsZXNbMF0uZmlsZW5hbWU7XG4gICAgICAgIGV4dGVudGlvbiA9IGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICAgIGlmIChbXCJpbWFnZS5qcGdcIiwgXCJpbWFnZS5naWZcIiwgXCJpbWFnZS5qcGVnXCIsIFwiaW1hZ2UucG5nXCJdLmluY2x1ZGVzKGZpbGVuYW1lLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgZmlsZW5hbWUgPSBcImltYWdlLVwiICsgbW9tZW50KG5ldyBEYXRlKCkpLmZvcm1hdCgnWVlZWU1NRERISG1tc3MnKSArIFwiLlwiICsgZXh0ZW50aW9uO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkgPSByZXEuYm9keTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoYm9keSAmJiAoYm9keVsndXBsb2FkX2Zyb20nXSA9PT0gXCJJRVwiIHx8IGJvZHlbJ3VwbG9hZF9mcm9tJ10gPT09IFwibm9kZVwiKSkge1xuICAgICAgICAgICAgZmlsZW5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQoZmlsZW5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihmaWxlbmFtZSk7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoLyUvZywgXCItXCIpO1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUubmFtZShmaWxlbmFtZSk7XG4gICAgICAgIGlmIChib2R5ICYmIGJvZHlbJ293bmVyJ10gJiYgYm9keVsnc3BhY2UnXSAmJiBib2R5WydyZWNvcmRfaWQnXSAmJiBib2R5WydvYmplY3RfbmFtZSddKSB7XG4gICAgICAgICAgcGFyZW50ID0gYm9keVsncGFyZW50J107XG4gICAgICAgICAgb3duZXIgPSBib2R5Wydvd25lciddO1xuICAgICAgICAgIG93bmVyX25hbWUgPSBib2R5Wydvd25lcl9uYW1lJ107XG4gICAgICAgICAgc3BhY2UgPSBib2R5WydzcGFjZSddO1xuICAgICAgICAgIHJlY29yZF9pZCA9IGJvZHlbJ3JlY29yZF9pZCddO1xuICAgICAgICAgIG9iamVjdF9uYW1lID0gYm9keVsnb2JqZWN0X25hbWUnXTtcbiAgICAgICAgICBwYXJlbnQgPSBib2R5WydwYXJlbnQnXTtcbiAgICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgIG93bmVyX25hbWU6IG93bmVyX25hbWUsXG4gICAgICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgICAgICByZWNvcmRfaWQ6IHJlY29yZF9pZCxcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgbWV0YWRhdGEucGFyZW50ID0gcGFyZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgfVxuICAgICAgICBzaXplID0gZmlsZU9iai5vcmlnaW5hbC5zaXplO1xuICAgICAgICBpZiAoIXNpemUpIHtcbiAgICAgICAgICBzaXplID0gMTAyNDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgZmlsZUNvbGxlY3Rpb24udXBkYXRlKHtcbiAgICAgICAgICAgIF9pZDogcGFyZW50XG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICBleHRlbnRpb246IGV4dGVudGlvbixcbiAgICAgICAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgICAgICAgbW9kaWZpZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICAgIG1vZGlmaWVkX2J5OiBvd25lclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICRwdXNoOiB7XG4gICAgICAgICAgICAgIHZlcnNpb25zOiB7XG4gICAgICAgICAgICAgICAgJGVhY2g6IFtmaWxlT2JqLl9pZF0sXG4gICAgICAgICAgICAgICAgJHBvc2l0aW9uOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdGaWxlT2JqSWQgPSBmaWxlQ29sbGVjdGlvbi5kaXJlY3QuaW5zZXJ0KHtcbiAgICAgICAgICAgIG5hbWU6IGZpbGVuYW1lLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICAgICAgZXh0ZW50aW9uOiBleHRlbnRpb24sXG4gICAgICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICAgICAgdmVyc2lvbnM6IFtmaWxlT2JqLl9pZF0sXG4gICAgICAgICAgICBwYXJlbnQ6IHtcbiAgICAgICAgICAgICAgbzogb2JqZWN0X25hbWUsXG4gICAgICAgICAgICAgIGlkczogW3JlY29yZF9pZF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgY3JlYXRlZF9ieTogb3duZXIsXG4gICAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIG1vZGlmaWVkX2J5OiBvd25lclxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZpbGVPYmoudXBkYXRlKHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgJ21ldGFkYXRhLnBhcmVudCc6IG5ld0ZpbGVPYmpJZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJlc3AgPSB7XG4gICAgICAgICAgdmVyc2lvbl9pZDogZmlsZU9iai5faWQsXG4gICAgICAgICAgc2l6ZTogc2l6ZVxuICAgICAgICB9O1xuICAgICAgICByZXMuc2V0SGVhZGVyKFwieC1hbXotdmVyc2lvbi1pZFwiLCBmaWxlT2JqLl9pZCk7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuICAgICAgcmV0dXJuIHJlcy5lbmQoKTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9zMy86Y29sbGVjdGlvblwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgY29sbGVjdGlvbk5hbWUsIGUsIHVzZXJJZDtcbiAgdHJ5IHtcbiAgICB1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBwZXJtaXNzaW9uXCIpO1xuICAgIH1cbiAgICBjb2xsZWN0aW9uTmFtZSA9IHJlcS5wYXJhbXMuY29sbGVjdGlvbjtcbiAgICBKc29uUm91dGVzLnBhcnNlRmlsZXMocmVxLCByZXMsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbGxlY3Rpb24sIG5ld0ZpbGUsIHJlc3VsdERhdGE7XG4gICAgICBjb2xsZWN0aW9uID0gY2ZzW2NvbGxlY3Rpb25OYW1lXTtcbiAgICAgIGlmICghY29sbGVjdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBDb2xsZWN0aW9uXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHJlcS5maWxlcyAmJiByZXEuZmlsZXNbMF0pIHtcbiAgICAgICAgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XG4gICAgICAgIG5ld0ZpbGUubmFtZShyZXEuZmlsZXNbMF0uZmlsZW5hbWUpO1xuICAgICAgICBpZiAocmVxLmJvZHkpIHtcbiAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gcmVxLmJvZHk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RmlsZS5vd25lciA9IHVzZXJJZDtcbiAgICAgICAgbmV3RmlsZS5tZXRhZGF0YS5vd25lciA9IHVzZXJJZDtcbiAgICAgICAgbmV3RmlsZS5hdHRhY2hEYXRhKHJlcS5maWxlc1swXS5kYXRhLCB7XG4gICAgICAgICAgdHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlXG4gICAgICAgIH0pO1xuICAgICAgICBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgcmVzdWx0RGF0YSA9IGNvbGxlY3Rpb24uZmlsZXMuZmluZE9uZShuZXdGaWxlLl9pZCk7XG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgZGF0YTogcmVzdWx0RGF0YVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIEZpbGVcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IGUuZXJyb3IgfHwgNTAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcblxuZ2V0UXVlcnlTdHJpbmcgPSBmdW5jdGlvbihhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBxdWVyeSwgbWV0aG9kKSB7XG4gIHZhciBBTFksIGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZywgZGF0ZSwgcXVlcnlLZXlzLCBxdWVyeVN0ciwgc3RyaW5nVG9TaWduO1xuICBjb25zb2xlLmxvZyhcIi0tLS11dWZsb3dNYW5hZ2VyLmdldFF1ZXJ5U3RyaW5nLS0tLVwiKTtcbiAgQUxZID0gcmVxdWlyZSgnYWxpeXVuLXNkaycpO1xuICBkYXRlID0gQUxZLnV0aWwuZGF0ZS5nZXREYXRlKCk7XG4gIHF1ZXJ5LkZvcm1hdCA9IFwianNvblwiO1xuICBxdWVyeS5WZXJzaW9uID0gXCIyMDE3LTAzLTIxXCI7XG4gIHF1ZXJ5LkFjY2Vzc0tleUlkID0gYWNjZXNzS2V5SWQ7XG4gIHF1ZXJ5LlNpZ25hdHVyZU1ldGhvZCA9IFwiSE1BQy1TSEExXCI7XG4gIHF1ZXJ5LlRpbWVzdGFtcCA9IEFMWS51dGlsLmRhdGUuaXNvODYwMShkYXRlKTtcbiAgcXVlcnkuU2lnbmF0dXJlVmVyc2lvbiA9IFwiMS4wXCI7XG4gIHF1ZXJ5LlNpZ25hdHVyZU5vbmNlID0gU3RyaW5nKGRhdGUuZ2V0VGltZSgpKTtcbiAgcXVlcnlLZXlzID0gT2JqZWN0LmtleXMocXVlcnkpO1xuICBxdWVyeUtleXMuc29ydCgpO1xuICBjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcgPSBcIlwiO1xuICBxdWVyeUtleXMuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyArPSBcIiZcIiArIG5hbWUgKyBcIj1cIiArIEFMWS51dGlsLnBvcEVzY2FwZShxdWVyeVtuYW1lXSk7XG4gIH0pO1xuICBzdHJpbmdUb1NpZ24gPSBtZXRob2QudG9VcHBlckNhc2UoKSArICcmJTJGJicgKyBBTFkudXRpbC5wb3BFc2NhcGUoY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nLnN1YnN0cigxKSk7XG4gIHF1ZXJ5LlNpZ25hdHVyZSA9IEFMWS51dGlsLmNyeXB0by5obWFjKHNlY3JldEFjY2Vzc0tleSArICcmJywgc3RyaW5nVG9TaWduLCAnYmFzZTY0JywgJ3NoYTEnKTtcbiAgcXVlcnlTdHIgPSBBTFkudXRpbC5xdWVyeVBhcmFtc1RvU3RyaW5nKHF1ZXJ5KTtcbiAgY29uc29sZS5sb2cocXVlcnlTdHIpO1xuICByZXR1cm4gcXVlcnlTdHI7XG59O1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvczMvdm9kL3VwbG9hZFwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgQUxZLCBjb2xsZWN0aW9uTmFtZSwgZSwgdXNlcklkO1xuICB0cnkge1xuICAgIHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcyk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIHBlcm1pc3Npb25cIik7XG4gICAgfVxuICAgIGNvbGxlY3Rpb25OYW1lID0gXCJ2aWRlb3NcIjtcbiAgICBBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJyk7XG4gICAgSnNvblJvdXRlcy5wYXJzZUZpbGVzKHJlcSwgcmVzLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhY2Nlc3NLZXlJZCwgY29sbGVjdGlvbiwgZGF0ZSwgb3NzLCBxdWVyeSwgciwgcmVmLCByZWYxLCByZWYyLCByZWYzLCBzZWNyZXRBY2Nlc3NLZXksIHVwbG9hZEFkZHJlc3MsIHVwbG9hZEF1dGgsIHVybCwgdmlkZW9JZDtcbiAgICAgIGNvbGxlY3Rpb24gPSBjZnNbY29sbGVjdGlvbk5hbWVdO1xuICAgICAgaWYgKCFjb2xsZWN0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIENvbGxlY3Rpb25cIik7XG4gICAgICB9XG4gICAgICBpZiAocmVxLmZpbGVzICYmIHJlcS5maWxlc1swXSkge1xuICAgICAgICBpZiAoY29sbGVjdGlvbk5hbWUgPT09ICd2aWRlb3MnICYmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLmNmcykgIT0gbnVsbCA/IHJlZi5zdG9yZSA6IHZvaWQgMCkgPT09IFwiT1NTXCIpIHtcbiAgICAgICAgICBhY2Nlc3NLZXlJZCA9IChyZWYxID0gTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4pICE9IG51bGwgPyByZWYxLmFjY2Vzc0tleUlkIDogdm9pZCAwO1xuICAgICAgICAgIHNlY3JldEFjY2Vzc0tleSA9IChyZWYyID0gTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4pICE9IG51bGwgPyByZWYyLnNlY3JldEFjY2Vzc0tleSA6IHZvaWQgMDtcbiAgICAgICAgICBkYXRlID0gQUxZLnV0aWwuZGF0ZS5nZXREYXRlKCk7XG4gICAgICAgICAgcXVlcnkgPSB7XG4gICAgICAgICAgICBBY3Rpb246IFwiQ3JlYXRlVXBsb2FkVmlkZW9cIixcbiAgICAgICAgICAgIFRpdGxlOiByZXEuZmlsZXNbMF0uZmlsZW5hbWUsXG4gICAgICAgICAgICBGaWxlTmFtZTogcmVxLmZpbGVzWzBdLmZpbGVuYW1lXG4gICAgICAgICAgfTtcbiAgICAgICAgICB1cmwgPSBcImh0dHA6Ly92b2QuY24tc2hhbmdoYWkuYWxpeXVuY3MuY29tLz9cIiArIGdldFF1ZXJ5U3RyaW5nKGFjY2Vzc0tleUlkLCBzZWNyZXRBY2Nlc3NLZXksIHF1ZXJ5LCAnR0VUJyk7XG4gICAgICAgICAgciA9IEhUVFAuY2FsbCgnR0VUJywgdXJsKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyKTtcbiAgICAgICAgICBpZiAoKHJlZjMgPSByLmRhdGEpICE9IG51bGwgPyByZWYzLlZpZGVvSWQgOiB2b2lkIDApIHtcbiAgICAgICAgICAgIHZpZGVvSWQgPSByLmRhdGEuVmlkZW9JZDtcbiAgICAgICAgICAgIHVwbG9hZEFkZHJlc3MgPSBKU09OLnBhcnNlKG5ldyBCdWZmZXIoci5kYXRhLlVwbG9hZEFkZHJlc3MsICdiYXNlNjQnKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVwbG9hZEFkZHJlc3MpO1xuICAgICAgICAgICAgdXBsb2FkQXV0aCA9IEpTT04ucGFyc2UobmV3IEJ1ZmZlcihyLmRhdGEuVXBsb2FkQXV0aCwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codXBsb2FkQXV0aCk7XG4gICAgICAgICAgICBvc3MgPSBuZXcgQUxZLk9TUyh7XG4gICAgICAgICAgICAgIFwiYWNjZXNzS2V5SWRcIjogdXBsb2FkQXV0aC5BY2Nlc3NLZXlJZCxcbiAgICAgICAgICAgICAgXCJzZWNyZXRBY2Nlc3NLZXlcIjogdXBsb2FkQXV0aC5BY2Nlc3NLZXlTZWNyZXQsXG4gICAgICAgICAgICAgIFwiZW5kcG9pbnRcIjogdXBsb2FkQWRkcmVzcy5FbmRwb2ludCxcbiAgICAgICAgICAgICAgXCJhcGlWZXJzaW9uXCI6ICcyMDEzLTEwLTE1JyxcbiAgICAgICAgICAgICAgXCJzZWN1cml0eVRva2VuXCI6IHVwbG9hZEF1dGguU2VjdXJpdHlUb2tlblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gb3NzLnB1dE9iamVjdCh7XG4gICAgICAgICAgICAgIEJ1Y2tldDogdXBsb2FkQWRkcmVzcy5CdWNrZXQsXG4gICAgICAgICAgICAgIEtleTogdXBsb2FkQWRkcmVzcy5GaWxlTmFtZSxcbiAgICAgICAgICAgICAgQm9keTogcmVxLmZpbGVzWzBdLmRhdGEsXG4gICAgICAgICAgICAgIEFjY2Vzc0NvbnRyb2xBbGxvd09yaWdpbjogJycsXG4gICAgICAgICAgICAgIENvbnRlbnRUeXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGUsXG4gICAgICAgICAgICAgIENhY2hlQ29udHJvbDogJ25vLWNhY2hlJyxcbiAgICAgICAgICAgICAgQ29udGVudERpc3Bvc2l0aW9uOiAnJyxcbiAgICAgICAgICAgICAgQ29udGVudEVuY29kaW5nOiAndXRmLTgnLFxuICAgICAgICAgICAgICBTZXJ2ZXJTaWRlRW5jcnlwdGlvbjogJ0FFUzI1NicsXG4gICAgICAgICAgICAgIEV4cGlyZXM6IG51bGxcbiAgICAgICAgICAgIH0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgICAgICAgIHZhciBnZXRQbGF5SW5mb1F1ZXJ5LCBnZXRQbGF5SW5mb1Jlc3VsdCwgZ2V0UGxheUluZm9VcmwsIG5ld0RhdGU7XG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3I6JywgZXJyKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdWNjZXNzOicsIGRhdGEpO1xuICAgICAgICAgICAgICBuZXdEYXRlID0gQUxZLnV0aWwuZGF0ZS5nZXREYXRlKCk7XG4gICAgICAgICAgICAgIGdldFBsYXlJbmZvUXVlcnkgPSB7XG4gICAgICAgICAgICAgICAgQWN0aW9uOiAnR2V0UGxheUluZm8nLFxuICAgICAgICAgICAgICAgIFZpZGVvSWQ6IHZpZGVvSWRcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgZ2V0UGxheUluZm9VcmwgPSBcImh0dHA6Ly92b2QuY24tc2hhbmdoYWkuYWxpeXVuY3MuY29tLz9cIiArIGdldFF1ZXJ5U3RyaW5nKGFjY2Vzc0tleUlkLCBzZWNyZXRBY2Nlc3NLZXksIGdldFBsYXlJbmZvUXVlcnksICdHRVQnKTtcbiAgICAgICAgICAgICAgZ2V0UGxheUluZm9SZXN1bHQgPSBIVFRQLmNhbGwoJ0dFVCcsIGdldFBsYXlJbmZvVXJsKTtcbiAgICAgICAgICAgICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogZ2V0UGxheUluZm9SZXN1bHRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBGaWxlXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiBlLmVycm9yIHx8IDUwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJKc29uUm91dGVzLmFkZCAncG9zdCcsICcvYXBpL29iamVjdC93b3JrZmxvdy9kcmFmdHMnLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0dHJ5XHJcblx0XHRjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXJGb3JJbml0QXBwcm92YWwuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpXHJcblx0XHRjdXJyZW50X3VzZXJfaWQgPSBjdXJyZW50X3VzZXJfaW5mby5faWRcclxuXHJcblx0XHRoYXNoRGF0YSA9IHJlcS5ib2R5XHJcblxyXG5cdFx0aW5zZXJ0ZWRfaW5zdGFuY2VzID0gbmV3IEFycmF5XHJcblxyXG5cdFx0Xy5lYWNoIGhhc2hEYXRhWydJbnN0YW5jZXMnXSwgKGluc3RhbmNlX2Zyb21fY2xpZW50KSAtPlxyXG5cdFx0XHRuZXdfaW5zX2lkID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jcmVhdGVfaW5zdGFuY2UoaW5zdGFuY2VfZnJvbV9jbGllbnQsIGN1cnJlbnRfdXNlcl9pbmZvKVxyXG5cclxuXHRcdFx0bmV3X2lucyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmZpbmRPbmUoeyBfaWQ6IG5ld19pbnNfaWQgfSwgeyBmaWVsZHM6IHsgc3BhY2U6IDEsIGZsb3c6IDEsIGZsb3dfdmVyc2lvbjogMSwgZm9ybTogMSwgZm9ybV92ZXJzaW9uOiAxIH0gfSlcclxuXHJcblx0XHRcdGluc2VydGVkX2luc3RhbmNlcy5wdXNoKG5ld19pbnMpXHJcblxyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0ZGF0YTogeyBpbnNlcnRzOiBpbnNlcnRlZF9pbnN0YW5jZXMgfVxyXG5cdFx0fVxyXG5cdGNhdGNoIGVcclxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0ZGF0YTogeyBlcnJvcnM6IFt7IGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlIH1dIH1cclxuXHRcdH1cclxuXHJcbiIsIkpzb25Sb3V0ZXMuYWRkKCdwb3N0JywgJy9hcGkvb2JqZWN0L3dvcmtmbG93L2RyYWZ0cycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBjdXJyZW50X3VzZXJfaWQsIGN1cnJlbnRfdXNlcl9pbmZvLCBlLCBoYXNoRGF0YSwgaW5zZXJ0ZWRfaW5zdGFuY2VzO1xuICB0cnkge1xuICAgIGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlckZvckluaXRBcHByb3ZhbC5jaGVja19hdXRob3JpemF0aW9uKHJlcSk7XG4gICAgY3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkO1xuICAgIGhhc2hEYXRhID0gcmVxLmJvZHk7XG4gICAgaW5zZXJ0ZWRfaW5zdGFuY2VzID0gbmV3IEFycmF5O1xuICAgIF8uZWFjaChoYXNoRGF0YVsnSW5zdGFuY2VzJ10sIGZ1bmN0aW9uKGluc3RhbmNlX2Zyb21fY2xpZW50KSB7XG4gICAgICB2YXIgbmV3X2lucywgbmV3X2luc19pZDtcbiAgICAgIG5ld19pbnNfaWQgPSB1dWZsb3dNYW5hZ2VyRm9ySW5pdEFwcHJvdmFsLmNyZWF0ZV9pbnN0YW5jZShpbnN0YW5jZV9mcm9tX2NsaWVudCwgY3VycmVudF91c2VyX2luZm8pO1xuICAgICAgbmV3X2lucyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IG5ld19pbnNfaWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgc3BhY2U6IDEsXG4gICAgICAgICAgZmxvdzogMSxcbiAgICAgICAgICBmbG93X3ZlcnNpb246IDEsXG4gICAgICAgICAgZm9ybTogMSxcbiAgICAgICAgICBmb3JtX3ZlcnNpb246IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gaW5zZXJ0ZWRfaW5zdGFuY2VzLnB1c2gobmV3X2lucyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgaW5zZXJ0czogaW5zZXJ0ZWRfaW5zdGFuY2VzXG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iXX0=
