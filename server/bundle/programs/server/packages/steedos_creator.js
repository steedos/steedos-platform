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
var ServerSession = Package['steedos:base'].ServerSession;
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
var __coffeescriptShare, permissionManager, uuflowManager;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:creator":{"i18n":{"en.i18n.json.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/i18n/en.i18n.json.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Package['universe:i18n'].i18n.addTranslations('en','',{"Steedos Creator":"Creator","Refresh":"Refresh","Confirm":"Confirm","list_view_recent":"Recent","list_view_all":"All","list_view_mine":"Mine","list_view_no_records":"No items to display.","please_select":"Please select ","list_view":"List View","creator_list_item_counts":"%s items","creator_list_new_list_view":"New","creator_list_delete_list_view":"Delete","creator_list_select_fields":"Select Fields to Display","creator_available_fields":"Available Fields","creator_visible_fields":"Visible Fields","creator_list_filter":"Filter","creator_list_filter_cancel":"Cancel","creator_list_filter_save_as":"Save as","creator_list_filter_save":"Save","creator_list_new_filter":"New Filter","creator_list_add_filter":"Add Filter","creator_list_remove_all_filters":"Remove All","creator_list_matching_all_filters":"Matching all these filters","creator_list_view_controls":"LIST VIEW CONTROLS","creator_list_export_list_view":"Export list view","creator_list_copy_list_view":"Copy list view","reset_column_width":"Reset column width","creator_list_edit":"Edit List View","creator_filter_option_field":"field","creator_filter_option_operation":"operation","creator_filter_option_value":"value","creator_filter_option_start_value":"start value","creator_filter_option_end_value":"end value","creator_filter_option_start_end_error":"The starting value cannot be greater than the ending value","creator_filter_option_done":"Done","creator_filter_operation_required_error":"operation is required","creator_filter_operation_equal":"equal","creator_filter_operation_unequal":"not equal","creator_filter_operation_less_than":"less than","creator_filter_operation_greater_than":"greater than","creator_filter_operation_less_or_equal":"less or equal","creator_filter_operation_greater_or_equal":"greater or equal","creator_filter_operation_contains":"contains","creator_filter_operation_does_not_contain":"not contain","creator_filter_operation_starts_with":"starts with","creator_app_launcher":"App Launcher","creator_app_launcher_all_apps":"App Apps","creator_app_launcher_all_items":"All Items","creator_filter_operation_between":"Range","creator_filter_operation_between_last_year":"Last Year","creator_filter_operation_between_this_year":"This Year","creator_filter_operation_between_next_year":"Next Year","creator_filter_operation_between_today":"Today","creator_filter_operation_between_yestday":"Yestday","creator_filter_operation_between_last_quarter":"Last Quarter","creator_filter_operation_between_this_quarter":"This Quarter","creator_filter_operation_between_next_quarter":"Next Quarter","creator_filter_operation_between_tomorrow":"Tomorrow","creator_filter_operation_between_this_week":"This Week","creator_filter_operation_between_last_week":"Last Week","creator_filter_operation_between_next_week":"Next Week","creator_filter_operation_between_this_month":"This Month","creator_filter_operation_between_last_month":"Last Month","creator_filter_operation_between_next_month":"Next Month","creator_filter_operation_between_last_7_days":"Last 7 Days","creator_filter_operation_between_last_30_days":"Last 30 Days","creator_filter_operation_between_last_60_days":"Last 60 Days","creator_filter_operation_between_last_90_days":"Last 90 Days","creator_filter_operation_between_last_120_days":"Last 120 Days","creator_filter_operation_between_next_7_days":"Next 7 Days","creator_filter_operation_between_next_30_days":"Next 30 Days","creator_filter_operation_between_next_60_days":"Next 60 Days","creator_filter_operation_between_next_90_days":"Next 90 Days","creator_filter_operation_between_next_120_days":"Next 120 Days","creator_filter_close_filter_panel":"Close Filter Panel","creator_header_search":"Search in %s and more...","creator_header_search_recent_items":"Recent Items","creator_view_related_objects":"RELATED","creator_view_details":"DETAILS","creator_actions_upload_file":"Upload","creator_home_apps":"Steedos Office","creator_detail_info":"DETAILS","creator_detail_related":"RELATED","creator_new":"New","creator_change_view":"Change view","creator_edit_list":"Edit List","creator_refresh":"Refresh","creator_charts":"Charts","creator_filters":"Filters","true":"YES","false":"NO"});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"zh-CN.i18n.json.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/i18n/zh-CN.i18n.json.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Package['universe:i18n'].i18n.addTranslations('zh-CN','',{"Steedos Creator":"开发平台","Refresh":"刷新","Confirm":"确定","list_view_recent":"最近访问","list_view_all":"全部","list_view_mine":"我的","list_view_no_records":"没有可显示的项目.","please_select":"请选择","list_view":"列表视图","creator_list_item_counts":"%s个项目","creator_list_new_list_view":"新建","creator_list_delete_list_view":"删除","creator_list_select_fields":"选择要显示的字段","creator_available_fields":"可利用字段","creator_visible_fields":"已显示字段","creator_list_filter":"筛选条件","creator_list_filter_cancel":"取消","creator_list_filter_save_as":"另存为","creator_list_filter_save":"保存","creator_list_new_filter":"新建筛选条件","creator_list_add_filter":"添加筛选条件","creator_list_remove_all_filters":"清空","creator_list_matching_all_filters":"匹配所有筛选条件","creator_list_view_controls":"列表视图设置","creator_list_export_list_view":"导出Excel","creator_list_copy_list_view":"复制视图","reset_column_width":"重置列宽","creator_list_edit":"编辑视图","creator_filter_option_field":"字段","creator_filter_option_operation":"运算符","creator_filter_operation_equal":"等于","creator_filter_operation_unequal":"不等于","creator_filter_operation_less_than":"小于","creator_filter_operation_greater_than":"大于","creator_filter_operation_less_or_equal":"小于或等于","creator_filter_operation_greater_or_equal":"大于或等于","creator_filter_operation_contains":"包含","creator_filter_operation_does_not_contain":"不包含","creator_filter_operation_starts_with":"起始字符","creator_filter_option_value":"值","creator_filter_option_start_value":"起始值","creator_filter_option_end_value":"结束值","creator_filter_option_start_end_error":"起始值不能大于结束值","creator_filter_option_done":"完成","creator_filter_operation_required_error":"请选择运算符","creator_filter_operation_between":"范围","creator_filter_operation_between_last_year":"去年","creator_filter_operation_between_this_year":"今年","creator_filter_operation_between_next_year":"明年","creator_filter_operation_between_today":"今天","creator_filter_operation_between_yestday":"昨天","creator_filter_operation_between_last_quarter":"上季度","creator_filter_operation_between_this_quarter":"本季度","creator_filter_operation_between_next_quarter":"下季度","creator_filter_operation_between_tomorrow":"明天","creator_filter_operation_between_this_week":"本周","creator_filter_operation_between_last_week":"上周","creator_filter_operation_between_next_week":"下周","creator_filter_operation_between_this_month":"本月","creator_filter_operation_between_last_month":"上月","creator_filter_operation_between_next_month":"下月","creator_filter_operation_between_last_7_days":"过去7天","creator_filter_operation_between_last_30_days":"过去30天","creator_filter_operation_between_last_60_days":"过去60天","creator_filter_operation_between_last_90_days":"过去90天","creator_filter_operation_between_last_120_days":"过去120天","creator_filter_operation_between_next_7_days":"未来7天","creator_filter_operation_between_next_30_days":"未来30天","creator_filter_operation_between_next_60_days":"未来60天","creator_filter_operation_between_next_90_days":"未来90天","creator_filter_operation_between_next_120_days":"未来120天","creator_filter_close_filter_panel":"关闭过滤面板","creator_app_launcher":"应用程序启动器","creator_app_launcher_all_apps":"所有应用程序","creator_app_launcher_all_items":"所有项目","creator_header_search":"搜索 %s 和更多...","creator_header_search_recent_items":"最近项目","creator_view_related_objects":"相关","creator_view_details":"详细信息","creator_actions_upload_file":"上传","creator_home_apps":"华炎办公","creator_detail_info":"详细信息","creator_detail_related":"相关","creator_new":"新建","creator_change_view":"修改视图","creator_edit_list":"编辑列表","creator_refresh":"刷新","creator_charts":"图表","creator_filters":"过滤器","true":"是","false":"否"});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"checkNpm.js":function(require,exports,module){

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

Creator.getObjectFirstListViewUrl = function (object_name) {
  var app_id, list_view, list_view_id;
  list_view = Creator.getObjectFirstListView(object_name);
  list_view_id = list_view != null ? list_view._id : void 0;
  app_id = Session.get("app_id");

  if (object_name === "meeting") {
    return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name + "/calendar/");
  } else {
    return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name + "/grid/" + list_view_id);
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

Creator.getObjectLookupFieldOptions = function (object_name, is_deep, is_skip_hide) {
  var _object, _options, fields, icon;

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

      if ((f.type === "lookup" || f.type === "master_detail") && f.reference_to) {
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
    if (!_.include(["grid", "object", "[Object]", "[object]", "Object"], f.type) && !f.hidden) {
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

Creator.getAppObjectNames = function (app_id) {
  var app, objects;
  app = Creator.getApp(app_id);
  objects = [];

  if (app) {
    _.each(app.objects, function (v) {
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
  var apps;
  apps = [];

  _.each(Creator.Apps, function (v, k) {
    if (v.visible !== false && v._id !== "admin" || includeAdmin && v._id === "admin") {
      return apps.push(v);
    }
  });

  return apps;
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
  var childKeys, fields, i, is_range_1, is_range_2, is_wide_1, is_wide_2, sc_1, sc_2;
  fields = [];
  i = 0;

  while (i < keys.length) {
    sc_1 = _.pick(schema, keys[i]);
    sc_2 = _.pick(schema, keys[i + 1]);
    is_wide_1 = false;
    is_wide_2 = false;
    is_range_1 = false;
    is_range_2 = false;

    _.each(sc_1, function (value) {
      var ref, ref1, ref2;

      if (((ref = value.autoform) != null ? ref.is_wide : void 0) || ((ref1 = value.autoform) != null ? ref1.type : void 0) === "table") {
        is_wide_1 = true;
      }

      if ((ref2 = value.autoform) != null ? ref2.is_range : void 0) {
        return is_range_1 = true;
      }
    });

    _.each(sc_2, function (value) {
      var ref, ref1, ref2;

      if (((ref = value.autoform) != null ? ref.is_wide : void 0) || ((ref1 = value.autoform) != null ? ref1.type : void 0) === "table") {
        is_wide_2 = true;
      }

      if ((ref2 = value.autoform) != null ? ref2.is_range : void 0) {
        return is_range_2 = true;
      }
    });

    if (isSingle) {
      fields.push(keys.slice(i, i + 1));
      i += 1;
    } else {
      if (!is_range_1 && is_range_2) {
        childKeys = keys.slice(i, i + 1);
        childKeys.push(void 0);
        fields.push(childKeys);
        i += 1;
      } else if (is_wide_1) {
        fields.push(keys.slice(i, i + 1));
        i += 1;
      } else if (!is_wide_1 && is_wide_2) {
        childKeys = keys.slice(i, i + 1);
        childKeys.push(void 0);
        fields.push(childKeys);
        i += 1;
      } else if (!is_wide_1 && !is_wide_2) {
        childKeys = keys.slice(i, i + 1);

        if (keys[i + 1]) {
          childKeys.push(keys[i + 1]);
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
  "object_recent_viewed": function (object_name, record_id) {
    var collection_recent_viewed, current_recent_viewed, doc, filters, spaceId;

    if (!this.userId) {
      return null;
    }

    if (object_name === "object_recent_viewed") {
      return;
    }

    if (object_name && record_id) {
      doc = Creator.getCollection(object_name).findOne({
        _id: record_id
      }, {
        fields: {
          space: 1
        }
      });
      spaceId = doc.space;
      collection_recent_viewed = Creator.getCollection("object_recent_viewed");
      filters = {
        owner: this.userId,
        space: spaceId,
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
          space: spaceId,
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

}},"lib":{"permission_manager.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/lib/permission_manager.coffee                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
permissionManager = {};

permissionManager.getFlowPermissions = function (flow_id, user_id) {
  var flow, my_permissions, org_ids, organizations, orgs_can_add, orgs_can_admin, orgs_can_monitor, space_id, users_can_add, users_can_admin, users_can_monitor;
  flow = uuflowManager.getFlow(flow_id);
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

},"uuflow_manager.coffee":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_creator/server/lib/uuflow_manager.coffee                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _eval;

_eval = require('eval');
uuflowManager = {};

uuflowManager.check_authorization = function (req) {
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

uuflowManager.getSpace = function (space_id) {
  var space;
  space = Creator.Collections.spaces.findOne(space_id);

  if (!space) {
    throw new Meteor.Error('error!', "space_id有误或此space已经被删除");
  }

  return space;
};

uuflowManager.getFlow = function (flow_id) {
  var flow;
  flow = Creator.Collections.flows.findOne(flow_id);

  if (!flow) {
    throw new Meteor.Error('error!', "id有误或此流程已经被删除");
  }

  return flow;
};

uuflowManager.getSpaceUser = function (space_id, user_id) {
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

uuflowManager.getSpaceUserOrgInfo = function (space_user) {
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

uuflowManager.isFlowEnabled = function (flow) {
  if (flow.state !== "enabled") {
    throw new Meteor.Error('error!', "流程未启用,操作失败");
  }
};

uuflowManager.isFlowSpaceMatched = function (flow, space_id) {
  if (flow.space !== space_id) {
    throw new Meteor.Error('error!', "流程和工作区ID不匹配");
  }
};

uuflowManager.getForm = function (form_id) {
  var form;
  form = Creator.Collections.forms.findOne(form_id);

  if (!form) {
    throw new Meteor.Error('error!', '表单ID有误或此表单已经被删除');
  }

  return form;
};

uuflowManager.getCategory = function (category_id) {
  return Creator.Collections.categories.findOne(category_id);
};

uuflowManager.create_instance = function (instance_from_client, user_info) {
  var appr_obj, approve_from_client, category, flow, flow_id, form, ins_obj, new_ins_id, now, permissions, space, space_id, space_user, space_user_org_info, start_step, trace_from_client, trace_obj, user_id;
  check(instance_from_client["applicant"], String);
  check(instance_from_client["space"], String);
  check(instance_from_client["flow"], String);
  check(instance_from_client["record_ids"], [{
    o: String,
    ids: [String]
  }]);
  uuflowManager.checkIsInApproval(instance_from_client["record_ids"][0], instance_from_client["space"]);
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

  space = uuflowManager.getSpace(space_id);
  flow = uuflowManager.getFlow(flow_id);
  space_user = uuflowManager.getSpaceUser(space_id, user_id);
  space_user_org_info = uuflowManager.getSpaceUserOrgInfo(space_user);
  uuflowManager.isFlowEnabled(flow);
  uuflowManager.isFlowSpaceMatched(flow, space_id);
  form = uuflowManager.getForm(flow.form);
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
  appr_obj.values = uuflowManager.initiateValues(ins_obj.record_ids[0], flow_id, space_id, form.current.fields);
  trace_obj.approves = [appr_obj];
  ins_obj.traces = [trace_obj];
  ins_obj.inbox_users = instance_from_client.inbox_users || [];
  ins_obj.current_step_name = start_step.name;

  if (flow.auto_remind === true) {
    ins_obj.auto_remind = true;
  }

  ins_obj.flow_name = flow.name;

  if (form.category) {
    category = uuflowManager.getCategory(form.category);

    if (category) {
      ins_obj.category_name = category.name;
      ins_obj.category = category._id;
    }
  }

  new_ins_id = Creator.Collections.instances.insert(ins_obj);
  uuflowManager.initiateAttach(ins_obj.record_ids[0], space_id, ins_obj._id, appr_obj._id);
  uuflowManager.initiateRecordInstanceInfo(ins_obj.record_ids[0], new_ins_id, space_id);
  return new_ins_id;
};

uuflowManager.initiateValues = function (recordIds, flowId, spaceId, fields) {
  var fieldCodes, filterValues, ow, record, tableFieldCodes, tableFieldMap, values;
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
  ow = Creator.Collections.object_workflows.findOne({
    object_name: recordIds.o,
    flow_id: flowId
  });
  record = Creator.getCollection(recordIds.o, spaceId).findOne(recordIds.ids[0]);

  if (ow && record) {
    tableFieldCodes = [];
    tableFieldMap = [];
    ow.field_map.forEach(function (fm) {
      var fieldsObj, lookupFieldName, lookupObject, oTableCode, object, objectField, objectFieldName, wTableCode;

      if (fm.workflow_field.indexOf('.$.') > 0 && fm.object_field.indexOf('.$.') > 0) {
        wTableCode = fm.workflow_field.split('.$.')[0];
        oTableCode = fm.object_field.split('.$.')[0];

        if (record.hasOwnProperty(oTableCode) && _.isArray(record[oTableCode])) {
          tableFieldCodes.push(JSON.stringify({
            workflow_table_field_code: wTableCode,
            object_table_field_code: oTableCode
          }));
          return tableFieldMap.push(fm);
        }
      } else if (fm.object_field.indexOf('.') > 0 && fm.object_field.indexOf('.$.') === -1) {
        objectFieldName = fm.object_field.split('.')[0];
        lookupFieldName = fm.object_field.split('.')[1];
        object = Creator.getObject(recordIds.o, spaceId);

        if (object) {
          objectField = object.fields[objectFieldName];

          if (objectField && (objectField.type === "lookup" || objectField.type === "master_detail") && !objectField.multiple) {
            fieldsObj = {};
            fieldsObj[lookupFieldName] = 1;
            lookupObject = Creator.getCollection(objectField.reference_to, spaceId).findOne(record[objectFieldName], {
              fields: fieldsObj
            });

            if (lookupObject) {
              return values[fm.workflow_field] = lookupObject[lookupFieldName];
            }
          }
        }
      } else if (record.hasOwnProperty(fm.object_field)) {
        return values[fm.workflow_field] = record[fm.object_field];
      }
    });

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

    if (ow.field_map_script) {
      _.extend(values, uuflowManager.evalFieldMapScript(ow.field_map_script, recordIds.o, spaceId, recordIds.ids[0]));
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

uuflowManager.evalFieldMapScript = function (field_map_script, objectName, spaceId, objectId) {
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

uuflowManager.initiateAttach = function (recordIds, spaceId, insId, approveId) {
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

uuflowManager.initiateRecordInstanceInfo = function (recordIds, insId, spaceId) {
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

uuflowManager.checkIsInApproval = function (recordIds, spaceId) {
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
var Busboy, Fiber, getQueryString;
Busboy = require('busboy');
Fiber = require('fibers');

JsonRoutes.parseFiles = function (req, res, next) {
  var busboy, files, image;
  files = [];
  image = {};

  if (req.method === "POST") {
    busboy = new Busboy({
      headers: req.headers
    });
    busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
      var buffers;
      image.mimeType = mimetype;
      image.encoding = encoding;
      image.filename = filename;
      buffers = [];
      file.on('data', function (data) {
        return buffers.push(data);
      });
      return file.on('end', function () {
        image.data = Buffer.concat(buffers);
        return files.push(image);
      });
    });
    busboy.on("field", function (fieldname, value) {
      return req.body[fieldname] = value;
    });
    busboy.on("finish", function () {
      req.files = files;
      return Fiber(function () {
        return next();
      }).run();
    });
    return req.pipe(busboy);
  } else {
    return next();
  }
};

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
JsonRoutes.add('post', '/api/workflow/drafts', function (req, res, next) {
  var current_user_id, current_user_info, e, hashData, inserted_instances;

  try {
    current_user_info = uuflowManager.check_authorization(req);
    current_user_id = current_user_info._id;
    hashData = req.body;
    inserted_instances = new Array();

    _.each(hashData['Instances'], function (instance_from_client) {
      var new_ins, new_ins_id;
      new_ins_id = uuflowManager.create_instance(instance_from_client, current_user_info);
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
    ".i18n.json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:creator/i18n/en.i18n.json.js");
require("/node_modules/meteor/steedos:creator/i18n/zh-CN.i18n.json.js");
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
require("/node_modules/meteor/steedos:creator/server/publications/object.coffee");
require("/node_modules/meteor/steedos:creator/server/publications/object_tabular.coffee");
require("/node_modules/meteor/steedos:creator/server/publications/object_listviews.coffee");
require("/node_modules/meteor/steedos:creator/server/publications/user_tabular_settings.coffee");
require("/node_modules/meteor/steedos:creator/server/publications/related_objects_records.coffee");
require("/node_modules/meteor/steedos:creator/server/publications/space_user_info.coffee");
require("/node_modules/meteor/steedos:creator/server/publications/contacts_view_limits.coffee");
require("/node_modules/meteor/steedos:creator/server/publications/contacts_no_force_phone_users.coffee");
require("/node_modules/meteor/steedos:creator/server/lib/permission_manager.coffee");
require("/node_modules/meteor/steedos:creator/server/lib/uuflow_manager.coffee");
require("/node_modules/meteor/steedos:creator/server/routes/s3.coffee");
require("/node_modules/meteor/steedos:creator/server/routes/api_workflow_drafts.coffee");

/* Exports */
Package._define("steedos:creator", {
  uuflowManager: uuflowManager,
  permissionManager: permissionManager
});

})();

//# sourceURL=meteor://💻app/packages/steedos_creator.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjcmVhdG9yL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IvbGliL2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL21ldGhvZHMvb2JqZWN0X3JlY2VudF92aWV3ZWQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3ZpZXdlZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfcmVjZW50X3JlY29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9yZWNlbnRfcmVjb3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9saXN0dmlld3Nfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9yZXBvcnRfZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3JlcG9ydF9kYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfdGFidWxhcl9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbWV0aG9kcy9vYmplY3RfZXhwb3J0MnhtbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF9leHBvcnQyeG1sLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yL3NlcnZlci9tZXRob2RzL3JlbGF0ZWRfb2JqZWN0c19yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF90YWJ1bGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcHVibGljYXRpb25zL29iamVjdF9saXN0dmlld3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy91c2VyX3RhYnVsYXJfc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9yZWxhdGVkX29iamVjdHNfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvcmVsYXRlZF9vYmplY3RzX3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV91c2VyX2luZm8uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c192aWV3X2xpbWl0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfdmlld19saW1pdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL3B1YmxpY2F0aW9ucy9jb250YWN0c19ub19mb3JjZV9waG9uZV91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3Ivc2VydmVyL2xpYi9wZXJtaXNzaW9uX21hbmFnZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbGliL3Blcm1pc3Npb25fbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvbGliL3V1Zmxvd19tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2xpYi91dWZsb3dfbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9zMy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfY3JlYXRvci9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd19kcmFmdHMuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImJ1c2JveSIsIm1rZGlycCIsIk1ldGVvciIsInNldHRpbmdzIiwiY2ZzIiwiYWxpeXVuIiwiQ3JlYXRvciIsImdldFNjaGVtYSIsIm9iamVjdF9uYW1lIiwicmVmIiwiZ2V0T2JqZWN0Iiwic2NoZW1hIiwiZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld1VybCIsImFwcF9pZCIsImxpc3RfdmlldyIsImxpc3Rfdmlld19pZCIsImdldE9iamVjdEZpcnN0TGlzdFZpZXciLCJfaWQiLCJTZXNzaW9uIiwiZ2V0IiwiZ2V0UmVsYXRpdmVVcmwiLCJnZXRPYmplY3RVcmwiLCJyZWNvcmRfaWQiLCJnZXRMaXN0VmlldyIsImdldE9iamVjdFJvdXRlclVybCIsImdldExpc3RWaWV3VXJsIiwidXJsIiwiZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybCIsImdldFN3aXRjaExpc3RVcmwiLCJnZXRSZWxhdGVkT2JqZWN0VXJsIiwicmVsYXRlZF9vYmplY3RfbmFtZSIsImdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyIsImlzX2RlZXAiLCJpc19za2lwX2hpZGUiLCJfb2JqZWN0IiwiX29wdGlvbnMiLCJmaWVsZHMiLCJpY29uIiwiXyIsImZvckVhY2giLCJmIiwiayIsImhpZGRlbiIsInR5cGUiLCJwdXNoIiwibGFiZWwiLCJ2YWx1ZSIsInJfb2JqZWN0IiwicmVmZXJlbmNlX3RvIiwiZjIiLCJrMiIsImdldE9iamVjdEZpbHRlckZpZWxkT3B0aW9ucyIsInBlcm1pc3Npb25fZmllbGRzIiwiZ2V0RmllbGRzIiwiaW5jbHVkZSIsInRlc3QiLCJpbmRleE9mIiwiZ2V0RmlsdGVyc1dpdGhGaWx0ZXJGaWVsZHMiLCJmaWx0ZXJzIiwiZmlsdGVyX2ZpZWxkcyIsImxlbmd0aCIsIm4iLCJpc1N0cmluZyIsImZpZWxkIiwicmVxdWlyZWQiLCJmaW5kV2hlcmUiLCJpc19kZWZhdWx0IiwiaXNfcmVxdWlyZWQiLCJmaWx0ZXJJdGVtIiwibWF0Y2hGaWVsZCIsImZpbmQiLCJnZXRPYmplY3RSZWNvcmQiLCJzZWxlY3RfZmllbGRzIiwiZXhwYW5kIiwiY29sbGVjdGlvbiIsInJlY29yZCIsInJlZjEiLCJyZWYyIiwiaXNDbGllbnQiLCJUZW1wbGF0ZSIsImluc3RhbmNlIiwib2RhdGEiLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsImdldEFwcCIsImFwcCIsIkFwcHMiLCJkZXBzIiwiZGVwZW5kIiwiZ2V0QXBwT2JqZWN0TmFtZXMiLCJvYmplY3RzIiwiZWFjaCIsIm9iaiIsInBlcm1pc3Npb25zIiwiYWxsb3dSZWFkIiwiZ2V0VmlzaWJsZUFwcHMiLCJpbmNsdWRlQWRtaW4iLCJhcHBzIiwidmlzaWJsZSIsImdldFZpc2libGVBcHBzT2JqZWN0cyIsInZpc2libGVPYmplY3ROYW1lcyIsImZsYXR0ZW4iLCJwbHVjayIsImZpbHRlciIsIk9iamVjdHMiLCJuYW1lIiwic29ydCIsInNvcnRpbmdNZXRob2QiLCJiaW5kIiwia2V5IiwidW5pcSIsImdldEFwcHNPYmplY3RzIiwidGVtcE9iamVjdHMiLCJjb25jYXQiLCJ2YWxpZGF0ZUZpbHRlcnMiLCJsb2dpYyIsImUiLCJlcnJvck1zZyIsImZpbHRlcl9pdGVtcyIsImZpbHRlcl9sZW5ndGgiLCJmbGFnIiwiaW5kZXgiLCJ3b3JkIiwibWFwIiwiaXNFbXB0eSIsImNvbXBhY3QiLCJyZXBsYWNlIiwibWF0Y2giLCJpIiwiaW5jbHVkZXMiLCJ3IiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwidG9hc3RyIiwiZm9ybWF0RmlsdGVyc1RvTW9uZ28iLCJvcHRpb25zIiwic2VsZWN0b3IiLCJBcnJheSIsIm9wZXJhdGlvbiIsIm9wdGlvbiIsInJlZyIsInN1Yl9zZWxlY3RvciIsImV2YWx1YXRlRm9ybXVsYSIsIlJlZ0V4cCIsImlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyIsImZvcm1hdEZpbHRlcnNUb0RldiIsImxvZ2ljVGVtcEZpbHRlcnMiLCJzdGVlZG9zRmlsdGVycyIsInJlcXVpcmUiLCJpc19sb2dpY19vciIsInBvcCIsIlVTRVJfQ09OVEVYVCIsImZvcm1hdExvZ2ljRmlsdGVyc1RvRGV2IiwiZmlsdGVyX2xvZ2ljIiwiZm9ybWF0X2xvZ2ljIiwieCIsIl9mIiwiaXNBcnJheSIsIkpTT04iLCJzdHJpbmdpZnkiLCJnZXRSZWxhdGVkT2JqZWN0cyIsInNwYWNlSWQiLCJ1c2VySWQiLCJyZWxhdGVkX29iamVjdF9uYW1lcyIsInJlbGF0ZWRfb2JqZWN0cyIsInVucmVsYXRlZF9vYmplY3RzIiwiZ2V0T2JqZWN0UmVsYXRlZHMiLCJfY29sbGVjdGlvbl9uYW1lIiwiZ2V0UGVybWlzc2lvbnMiLCJkaWZmZXJlbmNlIiwicmVsYXRlZF9vYmplY3QiLCJpc0FjdGl2ZSIsImdldFJlbGF0ZWRPYmplY3ROYW1lcyIsImdldEFjdGlvbnMiLCJhY3Rpb25zIiwiZGlzYWJsZWRfYWN0aW9ucyIsInNvcnRCeSIsInZhbHVlcyIsImFjdGlvbiIsIlN0ZWVkb3MiLCJpc01vYmlsZSIsIm9uIiwiZ2V0TGlzdFZpZXdzIiwiZGlzYWJsZWRfbGlzdF92aWV3cyIsImxpc3Rfdmlld3MiLCJvYmplY3QiLCJpdGVtIiwiaXRlbV9uYW1lIiwib3duZXIiLCJmaWVsZHNOYW1lIiwidW5yZWFkYWJsZV9maWVsZHMiLCJnZXRPYmplY3RGaWVsZHNOYW1lIiwiaXNsb2FkaW5nIiwiYm9vdHN0cmFwTG9hZGVkIiwiY29udmVydFNwZWNpYWxDaGFyYWN0ZXIiLCJzdHIiLCJnZXREaXNhYmxlZEZpZWxkcyIsImZpZWxkTmFtZSIsImF1dG9mb3JtIiwiZGlzYWJsZWQiLCJvbWl0IiwiZ2V0SGlkZGVuRmllbGRzIiwiZ2V0RmllbGRzV2l0aE5vR3JvdXAiLCJncm91cCIsImdldFNvcnRlZEZpZWxkR3JvdXBOYW1lcyIsIm5hbWVzIiwidW5pcXVlIiwiZ2V0RmllbGRzRm9yR3JvdXAiLCJncm91cE5hbWUiLCJnZXRGaWVsZHNXaXRob3V0T21pdCIsImtleXMiLCJwaWNrIiwiZ2V0RmllbGRzSW5GaXJzdExldmVsIiwiZmlyc3RMZXZlbEtleXMiLCJnZXRGaWVsZHNGb3JSZW9yZGVyIiwiaXNTaW5nbGUiLCJjaGlsZEtleXMiLCJpc19yYW5nZV8xIiwiaXNfcmFuZ2VfMiIsImlzX3dpZGVfMSIsImlzX3dpZGVfMiIsInNjXzEiLCJzY18yIiwiaXNfd2lkZSIsImlzX3JhbmdlIiwic2xpY2UiLCJpc1NlcnZlciIsImdldEFsbFJlbGF0ZWRPYmplY3RzIiwicmVsYXRlZF9maWVsZCIsInJlbGF0ZWRfZmllbGRfbmFtZSIsImVuYWJsZV9maWxlcyIsImFwcHNCeU5hbWUiLCJtZXRob2RzIiwiY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkIiwiY3VycmVudF9yZWNlbnRfdmlld2VkIiwiZG9jIiwic3BhY2UiLCJ1cGRhdGUiLCIkaW5jIiwiY291bnQiLCIkc2V0IiwibW9kaWZpZWQiLCJEYXRlIiwibW9kaWZpZWRfYnkiLCJpbnNlcnQiLCJfbWFrZU5ld0lEIiwibyIsImlkcyIsImNyZWF0ZWQiLCJjcmVhdGVkX2J5IiwiYXN5bmNfcmVjZW50X2FnZ3JlZ2F0ZSIsInJlY2VudF9hZ2dyZWdhdGUiLCJzZWFyY2hfb2JqZWN0IiwiX3JlY29yZHMiLCJjYWxsYmFjayIsIkNvbGxlY3Rpb25zIiwib2JqZWN0X3JlY2VudF92aWV3ZWQiLCJyYXdDb2xsZWN0aW9uIiwiYWdncmVnYXRlIiwiJG1hdGNoIiwiJGdyb3VwIiwibWF4Q3JlYXRlZCIsIiRtYXgiLCIkc29ydCIsIiRsaW1pdCIsInRvQXJyYXkiLCJlcnIiLCJkYXRhIiwiRXJyb3IiLCJpc0Z1bmN0aW9uIiwid3JhcEFzeW5jIiwic2VhcmNoVGV4dCIsIl9vYmplY3RfY29sbGVjdGlvbiIsIl9vYmplY3RfbmFtZV9rZXkiLCJxdWVyeSIsInF1ZXJ5X2FuZCIsInJlY29yZHMiLCJzZWFyY2hfS2V5d29yZHMiLCJOQU1FX0ZJRUxEX0tFWSIsInNwbGl0Iiwia2V5d29yZCIsInN1YnF1ZXJ5IiwiJHJlZ2V4IiwidHJpbSIsIiRhbmQiLCIkaW4iLCJsaW1pdCIsIl9uYW1lIiwiX29iamVjdF9uYW1lIiwicmVjb3JkX29iamVjdCIsInJlY29yZF9vYmplY3RfY29sbGVjdGlvbiIsInNlbGYiLCJvYmplY3RzQnlOYW1lIiwib2JqZWN0X3JlY29yZCIsImVuYWJsZV9zZWFyY2giLCJ1cGRhdGVfZmlsdGVycyIsImxpc3R2aWV3X2lkIiwiZmlsdGVyX3Njb3BlIiwib2JqZWN0X2xpc3R2aWV3cyIsImRpcmVjdCIsInVwZGF0ZV9jb2x1bW5zIiwiY29sdW1ucyIsImNoZWNrIiwiY29tcG91bmRGaWVsZHMiLCJjdXJzb3IiLCJmaWx0ZXJGaWVsZHMiLCJvYmplY3RGaWVsZHMiLCJyZXN1bHQiLCJPYmplY3QiLCJjaGlsZEtleSIsIm9iamVjdEZpZWxkIiwic3BsaXRzIiwiaXNDb21tb25TcGFjZSIsImlzU3BhY2VBZG1pbiIsInNraXAiLCJmZXRjaCIsImNvbXBvdW5kRmllbGRJdGVtIiwiY29tcG91bmRGaWx0ZXJGaWVsZHMiLCJpdGVtS2V5IiwiaXRlbVZhbHVlIiwicmVmZXJlbmNlSXRlbSIsInNldHRpbmciLCJjb2x1bW5fd2lkdGgiLCJvYmoxIiwiX2lkX2FjdGlvbnMiLCJfbWl4RmllbGRzRGF0YSIsIl9taXhSZWxhdGVkRGF0YSIsIl93cml0ZVhtbEZpbGUiLCJmcyIsImxvZ2dlciIsInBhdGgiLCJ4bWwyanMiLCJMb2dnZXIiLCJqc29uT2JqIiwib2JqTmFtZSIsImJ1aWxkZXIiLCJkYXkiLCJmaWxlQWRkcmVzcyIsImZpbGVOYW1lIiwiZmlsZVBhdGgiLCJtb250aCIsIm5vdyIsInN0cmVhbSIsInhtbCIsInllYXIiLCJCdWlsZGVyIiwiYnVpbGRPYmplY3QiLCJCdWZmZXIiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsImpvaW4iLCJfX21ldGVvcl9ib290c3RyYXBfXyIsInNlcnZlckRpciIsImV4aXN0c1N5bmMiLCJzeW5jIiwid3JpdGVGaWxlIiwibWl4Qm9vbCIsIm1peERhdGUiLCJtaXhEZWZhdWx0Iiwib2JqRmllbGRzIiwiZmllbGRfbmFtZSIsImRhdGUiLCJkYXRlU3RyIiwiZm9ybWF0IiwibW9tZW50IiwicmVsYXRlZE9iak5hbWVzIiwicmVsYXRlZE9iak5hbWUiLCJyZWxhdGVkQ29sbGVjdGlvbiIsInJlbGF0ZWRSZWNvcmRMaXN0IiwicmVsYXRlZFRhYmxlRGF0YSIsInJlbGF0ZWRPYmoiLCJmaWVsZHNEYXRhIiwiRXhwb3J0MnhtbCIsInJlY29yZExpc3QiLCJpbmZvIiwidGltZSIsInJlY29yZE9iaiIsInRpbWVFbmQiLCJyZWxhdGVkX29iamVjdHNfcmVjb3JkcyIsInJlbGF0ZWRfcmVjb3JkcyIsInZpZXdBbGxSZWNvcmRzIiwicHVibGlzaCIsImlkIiwic3BhY2VfaWQiLCJwdWJsaXNoQ29tcG9zaXRlIiwidGFibGVOYW1lIiwiX2ZpZWxkcyIsIl9rZXlzIiwib2JqZWN0X2NvbGxlY2l0b24iLCJyZWZlcmVuY2VfZmllbGRzIiwicmVhZHkiLCJTdHJpbmciLCJNYXRjaCIsIk9wdGlvbmFsIiwiZ2V0T2JqZWN0TmFtZSIsInVuYmxvY2siLCJmaWVsZF9rZXlzIiwiY2hpbGRyZW4iLCJfb2JqZWN0S2V5cyIsInJlZmVyZW5jZV9maWVsZCIsInBhcmVudCIsImNoaWxkcmVuX2ZpZWxkcyIsIm5hbWVfZmllbGRfa2V5IiwicF9rIiwicmVmZXJlbmNlX2lkcyIsInJlZmVyZW5jZV90b19vYmplY3QiLCJzX2siLCJnZXRQcm9wZXJ0eSIsInJlZHVjZSIsImlzT2JqZWN0Iiwic2hhcmVkIiwidXNlciIsImRiIiwic3BhY2Vfc2V0dGluZ3MiLCJwZXJtaXNzaW9uTWFuYWdlciIsImdldEZsb3dQZXJtaXNzaW9ucyIsImZsb3dfaWQiLCJ1c2VyX2lkIiwiZmxvdyIsIm15X3Blcm1pc3Npb25zIiwib3JnX2lkcyIsIm9yZ2FuaXphdGlvbnMiLCJvcmdzX2Nhbl9hZGQiLCJvcmdzX2Nhbl9hZG1pbiIsIm9yZ3NfY2FuX21vbml0b3IiLCJ1c2Vyc19jYW5fYWRkIiwidXNlcnNfY2FuX2FkbWluIiwidXNlcnNfY2FuX21vbml0b3IiLCJ1dWZsb3dNYW5hZ2VyIiwiZ2V0RmxvdyIsInVzZXJzIiwicGFyZW50cyIsIm9yZyIsInBhcmVudF9pZCIsInBlcm1zIiwib3JnX2lkIiwiX2V2YWwiLCJjaGVja19hdXRob3JpemF0aW9uIiwicmVxIiwiYXV0aFRva2VuIiwiaGFzaGVkVG9rZW4iLCJBY2NvdW50cyIsIl9oYXNoTG9naW5Ub2tlbiIsImdldFNwYWNlIiwic3BhY2VzIiwiZmxvd3MiLCJnZXRTcGFjZVVzZXIiLCJzcGFjZV91c2VyIiwic3BhY2VfdXNlcnMiLCJnZXRTcGFjZVVzZXJPcmdJbmZvIiwib3JnYW5pemF0aW9uIiwiZnVsbG5hbWUiLCJvcmdhbml6YXRpb25fbmFtZSIsIm9yZ2FuaXphdGlvbl9mdWxsbmFtZSIsImlzRmxvd0VuYWJsZWQiLCJzdGF0ZSIsImlzRmxvd1NwYWNlTWF0Y2hlZCIsImdldEZvcm0iLCJmb3JtX2lkIiwiZm9ybSIsImZvcm1zIiwiZ2V0Q2F0ZWdvcnkiLCJjYXRlZ29yeV9pZCIsImNhdGVnb3JpZXMiLCJjcmVhdGVfaW5zdGFuY2UiLCJpbnN0YW5jZV9mcm9tX2NsaWVudCIsInVzZXJfaW5mbyIsImFwcHJfb2JqIiwiYXBwcm92ZV9mcm9tX2NsaWVudCIsImNhdGVnb3J5IiwiaW5zX29iaiIsIm5ld19pbnNfaWQiLCJzcGFjZV91c2VyX29yZ19pbmZvIiwic3RhcnRfc3RlcCIsInRyYWNlX2Zyb21fY2xpZW50IiwidHJhY2Vfb2JqIiwiY2hlY2tJc0luQXBwcm92YWwiLCJpbnN0YW5jZXMiLCJmbG93X3ZlcnNpb24iLCJjdXJyZW50IiwiZm9ybV92ZXJzaW9uIiwic3VibWl0dGVyIiwic3VibWl0dGVyX25hbWUiLCJhcHBsaWNhbnQiLCJhcHBsaWNhbnRfbmFtZSIsImFwcGxpY2FudF9vcmdhbml6YXRpb24iLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUiLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwiYXBwbGljYW50X2NvbXBhbnkiLCJjb21wYW55X2lkIiwiY29kZSIsImlzX2FyY2hpdmVkIiwiaXNfZGVsZXRlZCIsInJlY29yZF9pZHMiLCJNb25nbyIsIk9iamVjdElEIiwiX3N0ciIsImlzX2ZpbmlzaGVkIiwic3RlcHMiLCJzdGVwIiwic3RlcF90eXBlIiwic3RhcnRfZGF0ZSIsInRyYWNlIiwidXNlcl9uYW1lIiwiaGFuZGxlciIsImhhbmRsZXJfbmFtZSIsImhhbmRsZXJfb3JnYW5pemF0aW9uIiwiaGFuZGxlcl9vcmdhbml6YXRpb25fbmFtZSIsImhhbmRsZXJfb3JnYW5pemF0aW9uX2Z1bGxuYW1lIiwicmVhZF9kYXRlIiwiaXNfcmVhZCIsImlzX2Vycm9yIiwiZGVzY3JpcHRpb24iLCJpbml0aWF0ZVZhbHVlcyIsImFwcHJvdmVzIiwidHJhY2VzIiwiaW5ib3hfdXNlcnMiLCJjdXJyZW50X3N0ZXBfbmFtZSIsImF1dG9fcmVtaW5kIiwiZmxvd19uYW1lIiwiY2F0ZWdvcnlfbmFtZSIsImluaXRpYXRlQXR0YWNoIiwiaW5pdGlhdGVSZWNvcmRJbnN0YW5jZUluZm8iLCJyZWNvcmRJZHMiLCJmbG93SWQiLCJmaWVsZENvZGVzIiwiZmlsdGVyVmFsdWVzIiwib3ciLCJ0YWJsZUZpZWxkQ29kZXMiLCJ0YWJsZUZpZWxkTWFwIiwiZmYiLCJvYmplY3Rfd29ya2Zsb3dzIiwiZmllbGRfbWFwIiwiZm0iLCJmaWVsZHNPYmoiLCJsb29rdXBGaWVsZE5hbWUiLCJsb29rdXBPYmplY3QiLCJvVGFibGVDb2RlIiwib2JqZWN0RmllbGROYW1lIiwid1RhYmxlQ29kZSIsIndvcmtmbG93X2ZpZWxkIiwib2JqZWN0X2ZpZWxkIiwiaGFzT3duUHJvcGVydHkiLCJ3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlIiwib2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGUiLCJtdWx0aXBsZSIsInRmYyIsImMiLCJwYXJzZSIsInRyIiwibmV3VHIiLCJ0Zm0iLCJ3VGRDb2RlIiwiZmllbGRfbWFwX3NjcmlwdCIsImV4dGVuZCIsImV2YWxGaWVsZE1hcFNjcmlwdCIsIm9iamVjdE5hbWUiLCJvYmplY3RJZCIsImZ1bmMiLCJzY3JpcHQiLCJpbnNJZCIsImFwcHJvdmVJZCIsImNmIiwidmVyc2lvbnMiLCJ2ZXJzaW9uSWQiLCJpZHgiLCJuZXdGaWxlIiwiRlMiLCJGaWxlIiwiYXR0YWNoRGF0YSIsImNyZWF0ZVJlYWRTdHJlYW0iLCJvcmlnaW5hbCIsIm1ldGFkYXRhIiwicmVhc29uIiwic2l6ZSIsIm93bmVyX25hbWUiLCJhcHByb3ZlIiwiJHB1c2giLCIkZWFjaCIsIiRwb3NpdGlvbiIsImxvY2tlZCIsImluc3RhbmNlX3N0YXRlIiwiJGV4aXN0cyIsIkJ1c2JveSIsIkZpYmVyIiwiZ2V0UXVlcnlTdHJpbmciLCJKc29uUm91dGVzIiwicGFyc2VGaWxlcyIsInJlcyIsIm5leHQiLCJmaWxlcyIsImltYWdlIiwibWV0aG9kIiwiaGVhZGVycyIsImZpZWxkbmFtZSIsImZpbGUiLCJmaWxlbmFtZSIsImVuY29kaW5nIiwibWltZXR5cGUiLCJidWZmZXJzIiwibWltZVR5cGUiLCJib2R5IiwicnVuIiwicGlwZSIsImFkZCIsImZpbGVDb2xsZWN0aW9uIiwiZXh0ZW50aW9uIiwiZmlsZU9iaiIsIm5ld0ZpbGVPYmpJZCIsInJlc3AiLCJ0b0xvd2VyQ2FzZSIsImRlY29kZVVSSUNvbXBvbmVudCIsInZlcnNpb25faWQiLCJzZXRIZWFkZXIiLCJlbmQiLCJzdGF0dXNDb2RlIiwiY29sbGVjdGlvbk5hbWUiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwicGFyYW1zIiwicmVzdWx0RGF0YSIsInNlbmRSZXN1bHQiLCJzdGFjayIsImVycm9ycyIsIm1lc3NhZ2UiLCJhY2Nlc3NLZXlJZCIsInNlY3JldEFjY2Vzc0tleSIsIkFMWSIsImNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyIsInF1ZXJ5S2V5cyIsInF1ZXJ5U3RyIiwic3RyaW5nVG9TaWduIiwidXRpbCIsIkZvcm1hdCIsIlZlcnNpb24iLCJBY2Nlc3NLZXlJZCIsIlNpZ25hdHVyZU1ldGhvZCIsIlRpbWVzdGFtcCIsImlzbzg2MDEiLCJTaWduYXR1cmVWZXJzaW9uIiwiU2lnbmF0dXJlTm9uY2UiLCJnZXRUaW1lIiwicG9wRXNjYXBlIiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJTaWduYXR1cmUiLCJjcnlwdG8iLCJobWFjIiwicXVlcnlQYXJhbXNUb1N0cmluZyIsIm9zcyIsInIiLCJyZWYzIiwidXBsb2FkQWRkcmVzcyIsInVwbG9hZEF1dGgiLCJ2aWRlb0lkIiwic3RvcmUiLCJBY3Rpb24iLCJUaXRsZSIsIkZpbGVOYW1lIiwiSFRUUCIsImNhbGwiLCJWaWRlb0lkIiwiVXBsb2FkQWRkcmVzcyIsInRvU3RyaW5nIiwiVXBsb2FkQXV0aCIsIk9TUyIsIkFjY2Vzc0tleVNlY3JldCIsIkVuZHBvaW50IiwiU2VjdXJpdHlUb2tlbiIsInB1dE9iamVjdCIsIkJ1Y2tldCIsIktleSIsIkJvZHkiLCJBY2Nlc3NDb250cm9sQWxsb3dPcmlnaW4iLCJDb250ZW50VHlwZSIsIkNhY2hlQ29udHJvbCIsIkNvbnRlbnREaXNwb3NpdGlvbiIsIkNvbnRlbnRFbmNvZGluZyIsIlNlcnZlclNpZGVFbmNyeXB0aW9uIiwiRXhwaXJlcyIsImJpbmRFbnZpcm9ubWVudCIsImdldFBsYXlJbmZvUXVlcnkiLCJnZXRQbGF5SW5mb1Jlc3VsdCIsImdldFBsYXlJbmZvVXJsIiwibmV3RGF0ZSIsImN1cnJlbnRfdXNlcl9pZCIsImN1cnJlbnRfdXNlcl9pbmZvIiwiaGFzaERhdGEiLCJpbnNlcnRlZF9pbnN0YW5jZXMiLCJuZXdfaW5zIiwiaW5zZXJ0cyIsImVycm9yTWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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VUFBWCxDQUFzQmhDLEdBQXRCLEVBQTJCO0FBQzFCbEcsWUFBTSxHQURvQjtBQUUxQmhPLFlBQU07QUFBRW9XLGdCQUFRLENBQUM7QUFBRW9FLHdCQUFjamtCLEVBQUU0YyxNQUFGLElBQVk1YyxFQUFFOGY7QUFBOUIsU0FBRDtBQUFWO0FBRm9CLEtBQTNCLENDVUU7QUFVRDtBRDFDSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2NyZWF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG5cdGNoZWNrTnBtVmVyc2lvbnNcclxufSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0YnVzYm95OiBcIl4wLjIuMTNcIixcclxuXHRta2RpcnA6IFwiXjAuMy41XCIsXHJcblx0XCJ4bWwyanNcIjogXCJeMC40LjE5XCIsXHJcblx0XCJub2RlLXhsc3hcIjogXCJeMC4xMi4wXCJcclxufSwgJ3N0ZWVkb3M6Y3JlYXRvcicpO1xyXG5cclxuaWYgKE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzICYmIE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKSB7XHJcblx0Y2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0XHRcImFsaXl1bi1zZGtcIjogXCJeMS4xMS4xMlwiXHJcblx0fSwgJ3N0ZWVkb3M6Y3JlYXRvcicpO1xyXG59IiwiXHJcblx0IyBDcmVhdG9yLmluaXRBcHBzKClcclxuXHJcblxyXG4jIENyZWF0b3IuaW5pdEFwcHMgPSAoKS0+XHJcbiMgXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuIyBcdFx0Xy5lYWNoIENyZWF0b3IuQXBwcywgKGFwcCwgYXBwX2lkKS0+XHJcbiMgXHRcdFx0ZGJfYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcclxuIyBcdFx0XHRpZiAhZGJfYXBwXHJcbiMgXHRcdFx0XHRhcHAuX2lkID0gYXBwX2lkXHJcbiMgXHRcdFx0XHRkYi5hcHBzLmluc2VydChhcHApXHJcbiMgZWxzZVxyXG4jIFx0YXBwLl9pZCA9IGFwcF9pZFxyXG4jIFx0ZGIuYXBwcy51cGRhdGUoe19pZDogYXBwX2lkfSwgYXBwKVxyXG5cclxuQ3JlYXRvci5nZXRTY2hlbWEgPSAob2JqZWN0X25hbWUpLT5cclxuXHRyZXR1cm4gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5zY2hlbWFcclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld1VybCA9IChvYmplY3RfbmFtZSktPlxyXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyhvYmplY3RfbmFtZSlcclxuXHRsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXc/Ll9pZFxyXG5cdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXHJcblx0aWYgb2JqZWN0X25hbWUgaXMgXCJtZWV0aW5nXCJcclxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIilcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZClcclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0VXJsID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkgLT5cclxuXHRpZiAhYXBwX2lkXHJcblx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpXHJcblx0bGlzdF92aWV3X2lkID0gbGlzdF92aWV3Py5faWRcclxuXHJcblx0aWYgcmVjb3JkX2lkXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZClcclxuXHRlbHNlXHJcblx0XHRpZiBvYmplY3RfbmFtZSBpcyBcIm1lZXRpbmdcIlxyXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCIpXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RSb3V0ZXJVcmwgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSAtPlxyXG5cdGlmICFhcHBfaWRcclxuXHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXHJcblx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHJcblx0bGlzdF92aWV3ID0gQ3JlYXRvci5nZXRMaXN0VmlldyhvYmplY3RfbmFtZSwgbnVsbClcclxuXHRsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXc/Ll9pZFxyXG5cclxuXHRpZiByZWNvcmRfaWRcclxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZF9pZFxyXG5cdGVsc2VcclxuXHRcdGlmIG9iamVjdF9uYW1lIGlzIFwibWVldGluZ1wiXHJcblx0XHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvY2FsZW5kYXIvXCJcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkXHJcblxyXG5DcmVhdG9yLmdldExpc3RWaWV3VXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cclxuXHR1cmwgPSBDcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKVxyXG5cdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKHVybClcclxuXHJcbkNyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCBsaXN0X3ZpZXdfaWQpIC0+XHJcblx0aWYgbGlzdF92aWV3X2lkIGlzIFwiY2FsZW5kYXJcIlxyXG5cdFx0cmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIlxyXG5cdGVsc2VcclxuXHRcdHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZFxyXG5cclxuQ3JlYXRvci5nZXRTd2l0Y2hMaXN0VXJsID0gKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkgLT5cclxuXHRpZiBsaXN0X3ZpZXdfaWRcclxuXHRcdHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIGxpc3Rfdmlld19pZCArIFwiL2xpc3RcIilcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvbGlzdC9zd2l0Y2hcIilcclxuXHJcbkNyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdFVybCA9IChvYmplY3RfbmFtZSwgYXBwX2lkLCByZWNvcmRfaWQsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIC0+XHJcblx0cmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL1wiICsgcmVjb3JkX2lkICsgXCIvXCIgKyByZWxhdGVkX29iamVjdF9uYW1lICsgXCIvZ3JpZFwiKVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RMb29rdXBGaWVsZE9wdGlvbnMgPSAob2JqZWN0X25hbWUsIGlzX2RlZXAsIGlzX3NraXBfaGlkZSktPlxyXG5cdF9vcHRpb25zID0gW11cclxuXHR1bmxlc3Mgb2JqZWN0X25hbWVcclxuXHRcdHJldHVybiBfb3B0aW9uc1xyXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRmaWVsZHMgPSBfb2JqZWN0Py5maWVsZHNcclxuXHRpY29uID0gX29iamVjdD8uaWNvblxyXG5cdF8uZm9yRWFjaCBmaWVsZHMsIChmLCBrKS0+XHJcblx0XHRpZiBpc19za2lwX2hpZGUgYW5kIGYuaGlkZGVuXHJcblx0XHRcdHJldHVyblxyXG5cdFx0aWYgZi50eXBlID09IFwic2VsZWN0XCJcclxuXHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IFwiI3tmLmxhYmVsIHx8IGt9XCIsIHZhbHVlOiBcIiN7a31cIiwgaWNvbjogaWNvbn1cclxuXHRcdGVsc2VcclxuXHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XHJcblx0aWYgaXNfZGVlcFxyXG5cdFx0Xy5mb3JFYWNoIGZpZWxkcywgKGYsIGspLT5cclxuXHRcdFx0aWYgaXNfc2tpcF9oaWRlIGFuZCBmLmhpZGRlblxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRpZiAoZi50eXBlID09IFwibG9va3VwXCIgfHwgZi50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKSAmJiBmLnJlZmVyZW5jZV90b1xyXG5cdFx0XHRcdHJfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoZi5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0aWYgcl9vYmplY3RcclxuXHRcdFx0XHRcdF8uZm9yRWFjaCByX29iamVjdC5maWVsZHMsIChmMiwgazIpLT5cclxuXHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IFwiI3tmLmxhYmVsIHx8IGt9PT4je2YyLmxhYmVsIHx8IGsyfVwiLCB2YWx1ZTogXCIje2t9LiN7azJ9XCIsIGljb246IHJfb2JqZWN0Py5pY29ufVxyXG5cdHJldHVybiBfb3B0aW9uc1xyXG5cclxuIyDnu5/kuIDkuLrlr7nosaFvYmplY3RfbmFtZeaPkOS+m+WPr+eUqOS6jui/h+iZkeWZqOi/h+iZkeWtl+autVxyXG5DcmVhdG9yLmdldE9iamVjdEZpbHRlckZpZWxkT3B0aW9ucyA9IChvYmplY3RfbmFtZSktPlxyXG5cdF9vcHRpb25zID0gW11cclxuXHR1bmxlc3Mgb2JqZWN0X25hbWVcclxuXHRcdHJldHVybiBfb3B0aW9uc1xyXG5cdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRmaWVsZHMgPSBfb2JqZWN0Py5maWVsZHNcclxuXHRwZXJtaXNzaW9uX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKG9iamVjdF9uYW1lKVxyXG5cdGljb24gPSBfb2JqZWN0Py5pY29uXHJcblx0Xy5mb3JFYWNoIGZpZWxkcywgKGYsIGspLT5cclxuXHRcdCMgaGlkZGVuLGdyaWTnrYnnsbvlnovnmoTlrZfmrrXvvIzkuI3pnIDopoHov4fmu6RcclxuXHRcdGlmICFfLmluY2x1ZGUoW1wiZ3JpZFwiLFwib2JqZWN0XCIsIFwiW09iamVjdF1cIiwgXCJbb2JqZWN0XVwiLCBcIk9iamVjdFwiXSwgZi50eXBlKSBhbmQgIWYuaGlkZGVuXHJcblx0XHRcdCMgZmlsdGVycy4kLmZpZWxk5Y+KZmxvdy5jdXJyZW50562J5a2Q5a2X5q615Lmf5LiN6ZyA6KaB6L+H5rukXHJcblx0XHRcdGlmICEvXFx3K1xcLi8udGVzdChrKSBhbmQgXy5pbmRleE9mKHBlcm1pc3Npb25fZmllbGRzLCBrKSA+IC0xXHJcblx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IGYubGFiZWwgfHwgaywgdmFsdWU6IGssIGljb246IGljb259XHJcblxyXG5cdHJldHVybiBfb3B0aW9uc1xyXG5cclxuIyMjXHJcbmZpbHRlcnM6IOimgei9rOaNoueahGZpbHRlcnNcclxuZmllbGRzOiDlr7nosaHlrZfmrrVcclxuZmlsdGVyX2ZpZWxkczog6buY6K6k6L+H5ruk5a2X5q6177yM5pSv5oyB5a2X56ym5Liy5pWw57uE5ZKM5a+56LGh5pWw57uE5Lik56eN5qC85byP77yM5aaCOlsnZmlsZWRfbmFtZTEnLCdmaWxlZF9uYW1lMiddLFt7ZmllbGQ6J2ZpbGVkX25hbWUxJyxyZXF1aXJlZDp0cnVlfV1cclxu5aSE55CG6YC76L6ROiDmiopmaWx0ZXJz5Lit5a2Y5Zyo5LqOZmlsdGVyX2ZpZWxkc+eahOi/h+a7pOadoeS7tuWinuWKoOavj+mhueeahGlzX2RlZmF1bHTjgIFpc19yZXF1aXJlZOWxnuaAp++8jOS4jeWtmOWcqOS6jmZpbHRlcl9maWVsZHPnmoTov4fmu6TmnaHku7blr7nlupTnmoTnp7vpmaTmr4/pobnnmoTnm7jlhbPlsZ7mgKdcclxu6L+U5Zue57uT5p6cOiDlpITnkIblkI7nmoRmaWx0ZXJzXHJcbiMjI1xyXG5DcmVhdG9yLmdldEZpbHRlcnNXaXRoRmlsdGVyRmllbGRzID0gKGZpbHRlcnMsIGZpZWxkcywgZmlsdGVyX2ZpZWxkcyktPlxyXG5cdHVubGVzcyBmaWx0ZXJzXHJcblx0XHRmaWx0ZXJzID0gW11cclxuXHR1bmxlc3MgZmlsdGVyX2ZpZWxkc1xyXG5cdFx0ZmlsdGVyX2ZpZWxkcyA9IFtdXHJcblx0aWYgZmlsdGVyX2ZpZWxkcz8ubGVuZ3RoXHJcblx0XHRmaWx0ZXJfZmllbGRzLmZvckVhY2ggKG4pLT5cclxuXHRcdFx0aWYgXy5pc1N0cmluZyhuKVxyXG5cdFx0XHRcdG4gPSBcclxuXHRcdFx0XHRcdGZpZWxkOiBuLFxyXG5cdFx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlXHJcblx0XHRcdGlmIGZpZWxkc1tuLmZpZWxkXSBhbmQgIV8uZmluZFdoZXJlKGZpbHRlcnMse2ZpZWxkOm4uZmllbGR9KVxyXG5cdFx0XHRcdGZpbHRlcnMucHVzaFxyXG5cdFx0XHRcdFx0ZmllbGQ6IG4uZmllbGQsXHJcblx0XHRcdFx0XHRpc19kZWZhdWx0OiB0cnVlLFxyXG5cdFx0XHRcdFx0aXNfcmVxdWlyZWQ6IG4ucmVxdWlyZWRcclxuXHRmaWx0ZXJzLmZvckVhY2ggKGZpbHRlckl0ZW0pLT5cclxuXHRcdG1hdGNoRmllbGQgPSBmaWx0ZXJfZmllbGRzLmZpbmQgKG4pLT4gcmV0dXJuIG4gPT0gZmlsdGVySXRlbS5maWVsZCBvciBuLmZpZWxkID09IGZpbHRlckl0ZW0uZmllbGRcclxuXHRcdGlmIF8uaXNTdHJpbmcobWF0Y2hGaWVsZClcclxuXHRcdFx0bWF0Y2hGaWVsZCA9IFxyXG5cdFx0XHRcdGZpZWxkOiBtYXRjaEZpZWxkLFxyXG5cdFx0XHRcdHJlcXVpcmVkOiBmYWxzZVxyXG5cdFx0aWYgbWF0Y2hGaWVsZFxyXG5cdFx0XHRmaWx0ZXJJdGVtLmlzX2RlZmF1bHQgPSB0cnVlXHJcblx0XHRcdGZpbHRlckl0ZW0uaXNfcmVxdWlyZWQgPSBtYXRjaEZpZWxkLnJlcXVpcmVkXHJcblx0XHRlbHNlXHJcblx0XHRcdGRlbGV0ZSBmaWx0ZXJJdGVtLmlzX2RlZmF1bHRcclxuXHRcdFx0ZGVsZXRlIGZpbHRlckl0ZW0uaXNfcmVxdWlyZWRcclxuXHRyZXR1cm4gZmlsdGVyc1xyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0X2ZpZWxkcywgZXhwYW5kKS0+XHJcblxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdGlmICFyZWNvcmRfaWRcclxuXHRcdHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiBvYmplY3RfbmFtZSA9PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpICYmICByZWNvcmRfaWQgPT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcclxuXHRcdFx0aWYgVGVtcGxhdGUuaW5zdGFuY2UoKT8ucmVjb3JkXHJcblx0XHRcdFx0cmV0dXJuIFRlbXBsYXRlLmluc3RhbmNlKCk/LnJlY29yZD8uZ2V0KClcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZClcclxuXHJcblx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSlcclxuXHRpZiBjb2xsZWN0aW9uXHJcblx0XHRyZWNvcmQgPSBjb2xsZWN0aW9uLmZpbmRPbmUocmVjb3JkX2lkKVxyXG5cdFx0cmV0dXJuIHJlY29yZFxyXG5cclxuQ3JlYXRvci5nZXRBcHAgPSAoYXBwX2lkKS0+XHJcblx0aWYgIWFwcF9pZFxyXG5cdFx0YXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcclxuXHRhcHAgPSBDcmVhdG9yLkFwcHNbYXBwX2lkXVxyXG5cdENyZWF0b3IuZGVwcz8uYXBwPy5kZXBlbmQoKVxyXG5cdHJldHVybiBhcHBcclxuXHJcblxyXG5DcmVhdG9yLmdldEFwcE9iamVjdE5hbWVzID0gKGFwcF9pZCktPlxyXG5cdGFwcCA9IENyZWF0b3IuZ2V0QXBwKGFwcF9pZClcclxuXHJcblx0b2JqZWN0cyA9IFtdXHJcblx0aWYgYXBwXHJcblx0XHRfLmVhY2ggYXBwLm9iamVjdHMsICh2KS0+XHJcblx0XHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KHYpXHJcblx0XHRcdGlmIG9iaj8ucGVybWlzc2lvbnMuZ2V0KCkuYWxsb3dSZWFkIGFuZCAhb2JqLmhpZGRlblxyXG5cdFx0XHRcdG9iamVjdHMucHVzaCB2XHJcblx0cmV0dXJuIG9iamVjdHNcclxuXHJcbkNyZWF0b3IuZ2V0VmlzaWJsZUFwcHMgPSAoaW5jbHVkZUFkbWluKS0+XHJcblx0YXBwcyA9IFtdXHJcblx0Xy5lYWNoIENyZWF0b3IuQXBwcywgKHYsIGspLT5cclxuXHRcdGlmICh2LnZpc2libGUgIT0gZmFsc2UgYW5kIHYuX2lkICE9IFwiYWRtaW5cIikgb3IgKGluY2x1ZGVBZG1pbiBhbmQgdi5faWQgPT0gXCJhZG1pblwiKVxyXG5cdFx0XHRhcHBzLnB1c2ggdlxyXG5cdHJldHVybiBhcHBzO1xyXG5cclxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwc09iamVjdHMgPSAoKS0+XHJcblx0YXBwcyA9IENyZWF0b3IuZ2V0VmlzaWJsZUFwcHMoKVxyXG5cdHZpc2libGVPYmplY3ROYW1lcyA9IF8uZmxhdHRlbihfLnBsdWNrKGFwcHMsJ29iamVjdHMnKSlcclxuXHRvYmplY3RzID0gXy5maWx0ZXIgQ3JlYXRvci5PYmplY3RzLCAob2JqKS0+XHJcblx0XHRpZiB2aXNpYmxlT2JqZWN0TmFtZXMuaW5kZXhPZihvYmoubmFtZSkgPCAwXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gIW9iai5oaWRkZW5cclxuXHRvYmplY3RzID0gb2JqZWN0cy5zb3J0KENyZWF0b3Iuc29ydGluZ01ldGhvZC5iaW5kKHtrZXk6XCJsYWJlbFwifSkpXHJcblx0b2JqZWN0cyA9IF8ucGx1Y2sob2JqZWN0cywnbmFtZScpXHJcblx0cmV0dXJuIF8udW5pcSBvYmplY3RzXHJcblxyXG5DcmVhdG9yLmdldEFwcHNPYmplY3RzID0gKCktPlxyXG5cdG9iamVjdHMgPSBbXVxyXG5cdHRlbXBPYmplY3RzID0gW11cclxuXHRfLmZvckVhY2ggQ3JlYXRvci5BcHBzLCAoYXBwKS0+XHJcblx0XHR0ZW1wT2JqZWN0cyA9IF8uZmlsdGVyIGFwcC5vYmplY3RzLCAob2JqKS0+XHJcblx0XHRcdHJldHVybiAhb2JqLmhpZGRlblxyXG5cdFx0b2JqZWN0cyA9IG9iamVjdHMuY29uY2F0KHRlbXBPYmplY3RzKVxyXG5cdHJldHVybiBfLnVuaXEgb2JqZWN0c1xyXG5cclxuQ3JlYXRvci52YWxpZGF0ZUZpbHRlcnMgPSAoZmlsdGVycywgbG9naWMpLT5cclxuXHRmaWx0ZXJfaXRlbXMgPSBfLm1hcCBmaWx0ZXJzLCAob2JqKSAtPlxyXG5cdFx0aWYgXy5pc0VtcHR5KG9iailcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBvYmpcclxuXHRmaWx0ZXJfaXRlbXMgPSBfLmNvbXBhY3QoZmlsdGVyX2l0ZW1zKVxyXG5cdGVycm9yTXNnID0gXCJcIlxyXG5cdGZpbHRlcl9sZW5ndGggPSBmaWx0ZXJfaXRlbXMubGVuZ3RoXHJcblx0aWYgbG9naWNcclxuXHRcdCMg5qC85byP5YyWZmlsdGVyXHJcblx0XHRsb2dpYyA9IGxvZ2ljLnJlcGxhY2UoL1xcbi9nLCBcIlwiKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKVxyXG5cclxuXHRcdCMg5Yik5pat54m55q6K5a2X56ymXHJcblx0XHRpZiAvWy5fXFwtIStdKy9pZy50ZXN0KGxvZ2ljKVxyXG5cdFx0XHRlcnJvck1zZyA9IFwi5ZCr5pyJ54m55q6K5a2X56ym44CCXCJcclxuXHJcblx0XHRpZiAhZXJyb3JNc2dcclxuXHRcdFx0aW5kZXggPSBsb2dpYy5tYXRjaCgvXFxkKy9pZylcclxuXHRcdFx0aWYgIWluZGV4XHJcblx0XHRcdFx0ZXJyb3JNc2cgPSBcIuacieS6m+etm+mAieadoeS7tui/m+ihjOS6huWumuS5ie+8jOS9huacquWcqOmrmOe6p+etm+mAieadoeS7tuS4reiiq+W8leeUqOOAglwiXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpbmRleC5mb3JFYWNoIChpKS0+XHJcblx0XHRcdFx0XHRpZiBpIDwgMSBvciBpID4gZmlsdGVyX2xlbmd0aFxyXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5p2h5Lu25byV55So5LqG5pyq5a6a5LmJ55qE562b6YCJ5Zmo77yaI3tpfeOAglwiXHJcblxyXG5cdFx0XHRcdGZsYWcgPSAxXHJcblx0XHRcdFx0d2hpbGUgZmxhZyA8PSBmaWx0ZXJfbGVuZ3RoXHJcblx0XHRcdFx0XHRpZiAhaW5kZXguaW5jbHVkZXMoXCIje2ZsYWd9XCIpXHJcblx0XHRcdFx0XHRcdGVycm9yTXNnID0gXCLmnInkupvnrZvpgInmnaHku7bov5vooYzkuoblrprkuYnvvIzkvYbmnKrlnKjpq5jnuqfnrZvpgInmnaHku7bkuK3ooqvlvJXnlKjjgIJcIlxyXG5cdFx0XHRcdFx0ZmxhZysrO1xyXG5cclxuXHRcdGlmICFlcnJvck1zZ1xyXG5cdFx0XHQjIOWIpOaWreaYr+WQpuaciemdnuazleiLseaWh+Wtl+esplxyXG5cdFx0XHR3b3JkID0gbG9naWMubWF0Y2goL1thLXpBLVpdKy9pZylcclxuXHRcdFx0aWYgd29yZFxyXG5cdFx0XHRcdHdvcmQuZm9yRWFjaCAodyktPlxyXG5cdFx0XHRcdFx0aWYgIS9eKGFuZHxvcikkL2lnLnRlc3QodylcclxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBcIuajgOafpeaCqOeahOmrmOe6p+etm+mAieadoeS7tuS4reeahOaLvOWGmeOAglwiXHJcblxyXG5cdFx0aWYgIWVycm9yTXNnXHJcblx0XHRcdCMg5Yik5pat5qC85byP5piv5ZCm5q2j56GuXHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdENyZWF0b3IuZXZhbChsb2dpYy5yZXBsYWNlKC9hbmQvaWcsIFwiJiZcIikucmVwbGFjZSgvb3IvaWcsIFwifHxcIikpXHJcblx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5Lit5ZCr5pyJ54m55q6K5a2X56ymXCJcclxuXHJcblx0XHRcdGlmIC8oQU5EKVteKCldKyhPUikvaWcudGVzdChsb2dpYykgfHwgIC8oT1IpW14oKV0rKEFORCkvaWcudGVzdChsb2dpYylcclxuXHRcdFx0XHRlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5b+F6aG75Zyo6L+e57ut5oCn55qEIEFORCDlkowgT1Ig6KGo6L6+5byP5YmN5ZCO5L2/55So5ous5Y+344CCXCJcclxuXHRpZiBlcnJvck1zZ1xyXG5cdFx0Y29uc29sZS5sb2cgXCJlcnJvclwiLCBlcnJvck1zZ1xyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdHRvYXN0ci5lcnJvcihlcnJvck1zZylcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdGVsc2VcclxuXHRcdHJldHVybiB0cnVlXHJcblxyXG4jIFwiPVwiLCBcIjw+XCIsIFwiPlwiLCBcIj49XCIsIFwiPFwiLCBcIjw9XCIsIFwic3RhcnRzd2l0aFwiLCBcImNvbnRhaW5zXCIsIFwibm90Y29udGFpbnNcIi5cclxuIyMjXHJcbm9wdGlvbnPlj4LmlbDvvJpcclxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcclxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcclxuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XHJcbmV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcclxuIyMjXHJcbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvTW9uZ28gPSAoZmlsdGVycywgb3B0aW9ucyktPlxyXG5cdHVubGVzcyBmaWx0ZXJzPy5sZW5ndGhcclxuXHRcdHJldHVyblxyXG5cdCMg5b2TZmlsdGVyc+S4jeaYr1tBcnJheV3nsbvlnovogIzmmK9bT2JqZWN0Xeexu+Wei+aXtu+8jOi/m+ihjOagvOW8j+i9rOaNolxyXG5cdHVubGVzcyBmaWx0ZXJzWzBdIGluc3RhbmNlb2YgQXJyYXlcclxuXHRcdGZpbHRlcnMgPSBfLm1hcCBmaWx0ZXJzLCAob2JqKS0+XHJcblx0XHRcdHJldHVybiBbb2JqLmZpZWxkLCBvYmoub3BlcmF0aW9uLCBvYmoudmFsdWVdXHJcblx0c2VsZWN0b3IgPSBbXVxyXG5cdF8uZWFjaCBmaWx0ZXJzLCAoZmlsdGVyKS0+XHJcblx0XHRmaWVsZCA9IGZpbHRlclswXVxyXG5cdFx0b3B0aW9uID0gZmlsdGVyWzFdXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0pXHJcblx0XHRlbHNlXHJcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBudWxsLCBvcHRpb25zKVxyXG5cdFx0c3ViX3NlbGVjdG9yID0ge31cclxuXHRcdHN1Yl9zZWxlY3RvcltmaWVsZF0gPSB7fVxyXG5cdFx0aWYgb3B0aW9uID09IFwiPVwiXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZXFcIl0gPSB2YWx1ZVxyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8PlwiXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbmVcIl0gPSB2YWx1ZVxyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI+XCJcclxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndFwiXSA9IHZhbHVlXHJcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIj49XCJcclxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRndGVcIl0gPSB2YWx1ZVxyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCI8XCJcclxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdFwiXSA9IHZhbHVlXHJcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIjw9XCJcclxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdGVcIl0gPSB2YWx1ZVxyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCJzdGFydHN3aXRoXCJcclxuXHRcdFx0cmVnID0gbmV3IFJlZ0V4cChcIl5cIiArIHZhbHVlLCBcImlcIilcclxuXHRcdFx0c3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZ1xyXG5cdFx0ZWxzZSBpZiBvcHRpb24gPT0gXCJjb250YWluc1wiXHJcblx0XHRcdHJlZyA9IG5ldyBSZWdFeHAodmFsdWUsIFwiaVwiKVxyXG5cdFx0XHRzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnXHJcblx0XHRlbHNlIGlmIG9wdGlvbiA9PSBcIm5vdGNvbnRhaW5zXCJcclxuXHRcdFx0cmVnID0gbmV3IFJlZ0V4cChcIl4oKD8hXCIgKyB2YWx1ZSArIFwiKS4pKiRcIiwgXCJpXCIpXHJcblx0XHRcdHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWdcclxuXHRcdHNlbGVjdG9yLnB1c2ggc3ViX3NlbGVjdG9yXHJcblx0cmV0dXJuIHNlbGVjdG9yXHJcblxyXG5DcmVhdG9yLmlzQmV0d2VlbkZpbHRlck9wZXJhdGlvbiA9IChvcGVyYXRpb24pLT5cclxuXHRyZXR1cm4gb3BlcmF0aW9uID09IFwiYmV0d2VlblwiIG9yICEhQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXModHJ1ZSk/W29wZXJhdGlvbl1cclxuXHJcbiMjI1xyXG5vcHRpb25z5Y+C5pWw77yaXHJcblx0ZXh0ZW5kLS0g5piv5ZCm6ZyA6KaB5oqK5b2T5YmN55So5oi35Z+65pys5L+h5oGv5Yqg5YWl5YWs5byP77yM5Y2z6K6p5YWs5byP5pSv5oyBQ3JlYXRvci5VU0VSX0NPTlRFWFTkuK3nmoTlgLzvvIzpu5jorqTkuLp0cnVlXHJcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XHJcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxyXG5cdGV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcclxuIyMjXHJcbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvRGV2ID0gKGZpbHRlcnMsIG9iamVjdF9uYW1lLCBvcHRpb25zKS0+XHJcblx0c3RlZWRvc0ZpbHRlcnMgPSByZXF1aXJlKFwiQHN0ZWVkb3MvZmlsdGVyc1wiKTtcclxuXHR1bmxlc3MgZmlsdGVycy5sZW5ndGhcclxuXHRcdHJldHVyblxyXG5cdGlmIG9wdGlvbnM/LmlzX2xvZ2ljX29yXHJcblx0XHQjIOWmguaenGlzX2xvZ2ljX29y5Li6dHJ1Ze+8jOS4umZpbHRlcnPnrKzkuIDlsYLlhYPntKDlop7liqBvcumXtOmalFxyXG5cdFx0bG9naWNUZW1wRmlsdGVycyA9IFtdXHJcblx0XHRmaWx0ZXJzLmZvckVhY2ggKG4pLT5cclxuXHRcdFx0bG9naWNUZW1wRmlsdGVycy5wdXNoKG4pXHJcblx0XHRcdGxvZ2ljVGVtcEZpbHRlcnMucHVzaChcIm9yXCIpXHJcblx0XHRsb2dpY1RlbXBGaWx0ZXJzLnBvcCgpXHJcblx0XHRmaWx0ZXJzID0gbG9naWNUZW1wRmlsdGVyc1xyXG5cdHNlbGVjdG9yID0gc3RlZWRvc0ZpbHRlcnMuZm9ybWF0RmlsdGVyc1RvRGV2KGZpbHRlcnMsIENyZWF0b3IuVVNFUl9DT05URVhUKVxyXG5cdHJldHVybiBzZWxlY3RvclxyXG5cclxuIyMjXHJcbm9wdGlvbnPlj4LmlbDvvJpcclxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcclxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcclxuXHRzcGFjZUlkLS0g5b2T5YmN5omA5Zyo5bel5L2c5Yy6XHJcbmV4dGVuZOS4unRydWXml7bvvIzlkI7nq6/pnIDopoHpop3lpJbkvKDlhaV1c2VySWTlj4pzcGFjZUlk55So5LqO5oqT5Y+WQ3JlYXRvci5VU0VSX0NPTlRFWFTlr7nlupTnmoTlgLxcclxuIyMjXHJcbkNyZWF0b3IuZm9ybWF0TG9naWNGaWx0ZXJzVG9EZXYgPSAoZmlsdGVycywgZmlsdGVyX2xvZ2ljLCBvcHRpb25zKS0+XHJcblx0Zm9ybWF0X2xvZ2ljID0gZmlsdGVyX2xvZ2ljLnJlcGxhY2UoL1xcKFxccysvaWcsIFwiKFwiKS5yZXBsYWNlKC9cXHMrXFwpL2lnLCBcIilcIikucmVwbGFjZSgvXFwoL2csIFwiW1wiKS5yZXBsYWNlKC9cXCkvZywgXCJdXCIpLnJlcGxhY2UoL1xccysvZywgXCIsXCIpLnJlcGxhY2UoLyhhbmR8b3IpL2lnLCBcIickMSdcIilcclxuXHRmb3JtYXRfbG9naWMgPSBmb3JtYXRfbG9naWMucmVwbGFjZSgvKFxcZCkrL2lnLCAoeCktPlxyXG5cdFx0X2YgPSBmaWx0ZXJzW3gtMV1cclxuXHRcdGZpZWxkID0gX2YuZmllbGRcclxuXHRcdG9wdGlvbiA9IF9mLm9wZXJhdGlvblxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUpXHJcblx0XHRlbHNlXHJcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoX2YudmFsdWUsIG51bGwsIG9wdGlvbnMpXHJcblx0XHRzdWJfc2VsZWN0b3IgPSBbXVxyXG5cdFx0aWYgXy5pc0FycmF5KHZhbHVlKSA9PSB0cnVlXHJcblx0XHRcdGlmIG9wdGlvbiA9PSBcIj1cIlxyXG5cdFx0XHRcdF8uZWFjaCB2YWx1ZSwgKHYpLT5cclxuXHRcdFx0XHRcdHN1Yl9zZWxlY3Rvci5wdXNoIFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiXHJcblx0XHRcdGVsc2UgaWYgb3B0aW9uID09IFwiPD5cIlxyXG5cdFx0XHRcdF8uZWFjaCB2YWx1ZSwgKHYpLT5cclxuXHRcdFx0XHRcdHN1Yl9zZWxlY3Rvci5wdXNoIFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJhbmRcIlxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Xy5lYWNoIHZhbHVlLCAodiktPlxyXG5cdFx0XHRcdFx0c3ViX3NlbGVjdG9yLnB1c2ggW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCJcclxuXHRcdFx0aWYgc3ViX3NlbGVjdG9yW3N1Yl9zZWxlY3Rvci5sZW5ndGggLSAxXSA9PSBcImFuZFwiIHx8IHN1Yl9zZWxlY3RvcltzdWJfc2VsZWN0b3IubGVuZ3RoIC0gMV0gPT0gXCJvclwiXHJcblx0XHRcdFx0c3ViX3NlbGVjdG9yLnBvcCgpXHJcblx0XHRlbHNlXHJcblx0XHRcdHN1Yl9zZWxlY3RvciA9IFtmaWVsZCwgb3B0aW9uLCB2YWx1ZV1cclxuXHRcdGNvbnNvbGUubG9nIFwic3ViX3NlbGVjdG9yXCIsIHN1Yl9zZWxlY3RvclxyXG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHN1Yl9zZWxlY3RvcilcclxuXHQpXHJcblx0Zm9ybWF0X2xvZ2ljID0gXCJbI3tmb3JtYXRfbG9naWN9XVwiXHJcblx0cmV0dXJuIENyZWF0b3IuZXZhbChmb3JtYXRfbG9naWMpXHJcblxyXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblxyXG5cdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW11cclxuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblxyXG5cdGlmICFfb2JqZWN0XHJcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXNcclxuXHJcbiNcdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhfb2JqZWN0LnJlbGF0ZWRfb2JqZWN0cyxcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoX29iamVjdC5fY29sbGVjdGlvbl9uYW1lKVxyXG5cclxuXHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2socmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcclxuXHRpZiByZWxhdGVkX29iamVjdF9uYW1lcz8ubGVuZ3RoID09IDBcclxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lc1xyXG5cclxuXHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcclxuXHR1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzXHJcblxyXG5cdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdHJldHVybiBfLmZpbHRlciByZWxhdGVkX29iamVjdHMsIChyZWxhdGVkX29iamVjdCktPlxyXG5cdFx0cmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0Lm9iamVjdF9uYW1lXHJcblx0XHRpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMVxyXG5cdFx0YWxsb3dSZWFkID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy5hbGxvd1JlYWRcclxuXHRcdHJldHVybiBpc0FjdGl2ZSBhbmQgYWxsb3dSZWFkXHJcblxyXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3ROYW1lcyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0cmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxyXG5cdHJldHVybiBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cyxcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5DcmVhdG9yLmdldEFjdGlvbnMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cdFx0aWYgIXNwYWNlSWRcclxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxyXG5cdFx0aWYgIXVzZXJJZFxyXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHJcblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblxyXG5cdGlmICFvYmpcclxuXHRcdHJldHVyblxyXG5cclxuXHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcclxuXHRkaXNhYmxlZF9hY3Rpb25zID0gcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9uc1xyXG5cdGFjdGlvbnMgPSBfLnNvcnRCeShfLnZhbHVlcyhvYmouYWN0aW9ucykgLCAnc29ydCcpO1xyXG5cclxuXHRfLmVhY2ggYWN0aW9ucywgKGFjdGlvbiktPlxyXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpICYmIGFjdGlvbi5vbiA9PSBcInJlY29yZFwiICYmIGFjdGlvbi5uYW1lICE9ICdzdGFuZGFyZF9lZGl0J1xyXG5cdFx0XHRhY3Rpb24ub24gPSAncmVjb3JkX21vcmUnXHJcblxyXG5cdGFjdGlvbnMgPSBfLmZpbHRlciBhY3Rpb25zLCAoYWN0aW9uKS0+XHJcblx0XHRyZXR1cm4gXy5pbmRleE9mKGRpc2FibGVkX2FjdGlvbnMsIGFjdGlvbi5uYW1lKSA8IDBcclxuXHJcblx0cmV0dXJuIGFjdGlvbnNcclxuXHJcbi8vL1xyXG5cdOi/lOWbnuW9k+WJjeeUqOaIt+acieadg+mZkOiuv+mXrueahOaJgOaciWxpc3Rfdmlld++8jOWMheaLrOWIhuS6q+eahO+8jOeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahO+8iOmZpOmdnm93bmVy5Y+Y5LqG77yJ77yM5Lul5Y+K6buY6K6k55qE5YW25LuW6KeG5Zu+XHJcblx05rOo5oSPQ3JlYXRvci5nZXRQZXJtaXNzaW9uc+WHveaVsOS4reaYr+S4jeS8muacieeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahOinhuWbvueahO+8jOaJgOS7pUNyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mi7/liLDnmoTnu5PmnpzkuI3lhajvvIzlubbkuI3mmK/lvZPliY3nlKjmiLfog73nnIvliLDmiYDmnInop4blm75cclxuLy8vXHJcbkNyZWF0b3IuZ2V0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblxyXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cclxuXHRpZiAhb2JqZWN0XHJcblx0XHRyZXR1cm5cclxuXHJcblx0ZGlzYWJsZWRfbGlzdF92aWV3cyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkuZGlzYWJsZWRfbGlzdF92aWV3cyB8fCBbXVxyXG5cclxuXHRsaXN0X3ZpZXdzID0gW11cclxuXHJcblx0aXNNb2JpbGUgPSBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHJcblx0Xy5lYWNoIG9iamVjdC5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0XHRpZiBpc01vYmlsZSBhbmQgaXRlbS50eXBlID09IFwiY2FsZW5kYXJcIlxyXG5cdFx0XHQjIOaJi+acuuS4iuWFiOS4jeaYvuekuuaXpeWOhuinhuWbvlxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdGlmIGl0ZW1fbmFtZSAhPSBcImRlZmF1bHRcIlxyXG5cdFx0XHRpZiBfLmluZGV4T2YoZGlzYWJsZWRfbGlzdF92aWV3cywgaXRlbV9uYW1lKSA8IDAgfHwgaXRlbS5vd25lciA9PSB1c2VySWRcclxuXHRcdFx0XHRsaXN0X3ZpZXdzLnB1c2ggaXRlbVxyXG5cclxuXHRyZXR1cm4gbGlzdF92aWV3c1xyXG5cclxuIyDliY3lj7DnkIborrrkuIrkuI3lupTor6XosIPnlKjor6Xlh73mlbDvvIzlm6DkuLrlrZfmrrXnmoTmnYPpmZDpg73lnKhDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZmllbGRz55qE55u45YWz5bGe5oCn5Lit5pyJ5qCH6K+G5LqGXHJcbkNyZWF0b3IuZ2V0RmllbGRzID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblxyXG5cdGZpZWxkc05hbWUgPSBDcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUob2JqZWN0X25hbWUpXHJcblx0dW5yZWFkYWJsZV9maWVsZHMgPSAgQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS51bnJlYWRhYmxlX2ZpZWxkc1xyXG5cdHJldHVybiBfLmRpZmZlcmVuY2UoZmllbGRzTmFtZSwgdW5yZWFkYWJsZV9maWVsZHMpXHJcblxyXG5DcmVhdG9yLmlzbG9hZGluZyA9ICgpLT5cclxuXHRyZXR1cm4gIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkLmdldCgpXHJcblxyXG5DcmVhdG9yLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxyXG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIilcclxuXHJcbiMg6K6h566XZmllbGRz55u45YWz5Ye95pWwXHJcbiMgU1RBUlRcclxuQ3JlYXRvci5nZXREaXNhYmxlZEZpZWxkcyA9IChzY2hlbWEpLT5cclxuXHRmaWVsZHMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCwgZmllbGROYW1lKSAtPlxyXG5cdFx0cmV0dXJuIGZpZWxkLmF1dG9mb3JtIGFuZCBmaWVsZC5hdXRvZm9ybS5kaXNhYmxlZCBhbmQgIWZpZWxkLmF1dG9mb3JtLm9taXQgYW5kIGZpZWxkTmFtZVxyXG5cdClcclxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxyXG5cdHJldHVybiBmaWVsZHNcclxuXHJcbkNyZWF0b3IuZ2V0SGlkZGVuRmllbGRzID0gKHNjaGVtYSktPlxyXG5cdGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkLCBmaWVsZE5hbWUpIC0+XHJcblx0XHRyZXR1cm4gZmllbGQuYXV0b2Zvcm0gYW5kIGZpZWxkLmF1dG9mb3JtLnR5cGUgPT0gXCJoaWRkZW5cIiBhbmQgIWZpZWxkLmF1dG9mb3JtLm9taXQgYW5kIGZpZWxkTmFtZVxyXG5cdClcclxuXHRmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKVxyXG5cdHJldHVybiBmaWVsZHNcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRzV2l0aE5vR3JvdXAgPSAoc2NoZW1hKS0+XHJcblx0ZmllbGRzID0gXy5tYXAoc2NoZW1hLCAoZmllbGQsIGZpZWxkTmFtZSkgLT5cclxuXHRcdHJldHVybiAoIWZpZWxkLmF1dG9mb3JtIG9yICFmaWVsZC5hdXRvZm9ybS5ncm91cCBvciBmaWVsZC5hdXRvZm9ybS5ncm91cCA9PSBcIi1cIikgYW5kICghZmllbGQuYXV0b2Zvcm0gb3IgZmllbGQuYXV0b2Zvcm0udHlwZSAhPSBcImhpZGRlblwiKSBhbmQgZmllbGROYW1lXHJcblx0KVxyXG5cdGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpXHJcblx0cmV0dXJuIGZpZWxkc1xyXG5cclxuQ3JlYXRvci5nZXRTb3J0ZWRGaWVsZEdyb3VwTmFtZXMgPSAoc2NoZW1hKS0+XHJcblx0bmFtZXMgPSBfLm1hcChzY2hlbWEsIChmaWVsZCkgLT5cclxuIFx0XHRyZXR1cm4gZmllbGQuYXV0b2Zvcm0gYW5kIGZpZWxkLmF1dG9mb3JtLmdyb3VwICE9IFwiLVwiIGFuZCBmaWVsZC5hdXRvZm9ybS5ncm91cFxyXG5cdClcclxuXHRuYW1lcyA9IF8uY29tcGFjdChuYW1lcylcclxuXHRuYW1lcyA9IF8udW5pcXVlKG5hbWVzKVxyXG5cdHJldHVybiBuYW1lc1xyXG5cclxuQ3JlYXRvci5nZXRGaWVsZHNGb3JHcm91cCA9IChzY2hlbWEsIGdyb3VwTmFtZSkgLT5cclxuICBcdGZpZWxkcyA9IF8ubWFwKHNjaGVtYSwgKGZpZWxkLCBmaWVsZE5hbWUpIC0+XHJcbiAgICBcdHJldHVybiBmaWVsZC5hdXRvZm9ybSBhbmQgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT0gZ3JvdXBOYW1lIGFuZCBmaWVsZC5hdXRvZm9ybS50eXBlICE9IFwiaGlkZGVuXCIgYW5kIGZpZWxkTmFtZVxyXG4gIFx0KVxyXG4gIFx0ZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcylcclxuICBcdHJldHVybiBmaWVsZHNcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRzV2l0aG91dE9taXQgPSAoc2NoZW1hLCBrZXlzKSAtPlxyXG5cdGtleXMgPSBfLm1hcChrZXlzLCAoa2V5KSAtPlxyXG5cdFx0ZmllbGQgPSBfLnBpY2soc2NoZW1hLCBrZXkpXHJcblx0XHRpZiBmaWVsZFtrZXldLmF1dG9mb3JtPy5vbWl0XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ga2V5XHJcblx0KVxyXG5cdGtleXMgPSBfLmNvbXBhY3Qoa2V5cylcclxuXHRyZXR1cm4ga2V5c1xyXG5cclxuQ3JlYXRvci5nZXRGaWVsZHNJbkZpcnN0TGV2ZWwgPSAoZmlyc3RMZXZlbEtleXMsIGtleXMpIC0+XHJcblx0a2V5cyA9IF8ubWFwKGtleXMsIChrZXkpIC0+XHJcblx0XHRpZiBfLmluZGV4T2YoZmlyc3RMZXZlbEtleXMsIGtleSkgPiAtMVxyXG5cdFx0XHRyZXR1cm4ga2V5XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdClcclxuXHRrZXlzID0gXy5jb21wYWN0KGtleXMpXHJcblx0cmV0dXJuIGtleXNcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRzRm9yUmVvcmRlciA9IChzY2hlbWEsIGtleXMsIGlzU2luZ2xlKSAtPlxyXG5cdGZpZWxkcyA9IFtdXHJcblx0aSA9IDBcclxuXHR3aGlsZSBpIDwga2V5cy5sZW5ndGhcclxuXHRcdHNjXzEgPSBfLnBpY2soc2NoZW1hLCBrZXlzW2ldKVxyXG5cdFx0c2NfMiA9IF8ucGljayhzY2hlbWEsIGtleXNbaSsxXSlcclxuXHJcblx0XHRpc193aWRlXzEgPSBmYWxzZVxyXG5cdFx0aXNfd2lkZV8yID0gZmFsc2VcclxuXHJcblx0XHRpc19yYW5nZV8xID0gZmFsc2VcclxuXHRcdGlzX3JhbmdlXzIgPSBmYWxzZVxyXG5cclxuXHRcdF8uZWFjaCBzY18xLCAodmFsdWUpIC0+XHJcblx0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc193aWRlIHx8IHZhbHVlLmF1dG9mb3JtPy50eXBlID09IFwidGFibGVcIlxyXG5cdFx0XHRcdGlzX3dpZGVfMSA9IHRydWVcclxuXHJcblx0XHRcdGlmIHZhbHVlLmF1dG9mb3JtPy5pc19yYW5nZVxyXG5cdFx0XHRcdGlzX3JhbmdlXzEgPSB0cnVlXHJcblxyXG5cdFx0Xy5lYWNoIHNjXzIsICh2YWx1ZSkgLT5cclxuXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3dpZGUgfHwgdmFsdWUuYXV0b2Zvcm0/LnR5cGUgPT0gXCJ0YWJsZVwiXHJcblx0XHRcdFx0aXNfd2lkZV8yID0gdHJ1ZVxyXG5cclxuXHRcdFx0aWYgdmFsdWUuYXV0b2Zvcm0/LmlzX3JhbmdlXHJcblx0XHRcdFx0aXNfcmFuZ2VfMiA9IHRydWVcclxuXHJcblx0XHRpZiBpc1NpbmdsZVxyXG5cdFx0XHRmaWVsZHMucHVzaCBrZXlzLnNsaWNlKGksIGkrMSlcclxuXHRcdFx0aSArPSAxXHJcblx0XHRlbHNlXHJcblx0XHRcdGlmICFpc19yYW5nZV8xICYmIGlzX3JhbmdlXzJcclxuXHRcdFx0XHRjaGlsZEtleXMgPSBrZXlzLnNsaWNlKGksIGkrMSlcclxuXHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcclxuXHRcdFx0XHRmaWVsZHMucHVzaCBjaGlsZEtleXNcclxuXHRcdFx0XHRpICs9IDFcclxuXHRcdFx0ZWxzZSBpZiBpc193aWRlXzFcclxuXHRcdFx0XHRmaWVsZHMucHVzaCBrZXlzLnNsaWNlKGksIGkrMSlcclxuXHRcdFx0XHRpICs9IDFcclxuXHRcdFx0ZWxzZSBpZiAhaXNfd2lkZV8xIGFuZCBpc193aWRlXzJcclxuXHRcdFx0XHRjaGlsZEtleXMgPSBrZXlzLnNsaWNlKGksIGkrMSlcclxuXHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcclxuXHRcdFx0XHRmaWVsZHMucHVzaCBjaGlsZEtleXNcclxuXHRcdFx0XHRpICs9IDFcclxuXHRcdFx0ZWxzZSBpZiAhaXNfd2lkZV8xIGFuZCAhaXNfd2lkZV8yXHJcblx0XHRcdFx0Y2hpbGRLZXlzID0ga2V5cy5zbGljZShpLCBpKzEpXHJcblx0XHRcdFx0aWYga2V5c1tpKzFdXHJcblx0XHRcdFx0XHRjaGlsZEtleXMucHVzaCBrZXlzW2krMV1cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRjaGlsZEtleXMucHVzaCB1bmRlZmluZWRcclxuXHRcdFx0XHRmaWVsZHMucHVzaCBjaGlsZEtleXNcclxuXHRcdFx0XHRpICs9IDJcclxuXHJcblx0cmV0dXJuIGZpZWxkc1xyXG5cclxuIyBFTkRcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdENyZWF0b3IuZ2V0QWxsUmVsYXRlZE9iamVjdHMgPSAob2JqZWN0X25hbWUpLT5cclxuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW11cclxuXHRcdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSktPlxyXG5cdFx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3QuZmllbGRzLCAocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKS0+XHJcblx0XHRcdFx0aWYgcmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWVcclxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzLnB1c2ggcmVsYXRlZF9vYmplY3RfbmFtZVxyXG5cclxuXHRcdGlmIENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKS5lbmFibGVfZmlsZXNcclxuXHRcdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMucHVzaCBcImNtc19maWxlc1wiXHJcblxyXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzIiwiQ3JlYXRvci5nZXRTY2hlbWEgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5zY2hlbWEgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdVcmwgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgYXBwX2lkLCBsaXN0X3ZpZXcsIGxpc3Rfdmlld19pZDtcbiAgbGlzdF92aWV3ID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3KG9iamVjdF9uYW1lKTtcbiAgbGlzdF92aWV3X2lkID0gbGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcuX2lkIDogdm9pZCAwO1xuICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgaWYgKG9iamVjdF9uYW1lID09PSBcIm1lZXRpbmdcIikge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGFwcF9pZCkge1xuICB2YXIgbGlzdF92aWV3LCBsaXN0X3ZpZXdfaWQ7XG4gIGlmICghYXBwX2lkKSB7XG4gICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBsaXN0X3ZpZXcgPSBDcmVhdG9yLmdldExpc3RWaWV3KG9iamVjdF9uYW1lLCBudWxsKTtcbiAgbGlzdF92aWV3X2lkID0gbGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcuX2lkIDogdm9pZCAwO1xuICBpZiAocmVjb3JkX2lkKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQpO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJtZWV0aW5nXCIpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKTtcbiAgICB9XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0Um91dGVyVXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgYXBwX2lkKSB7XG4gIHZhciBsaXN0X3ZpZXcsIGxpc3Rfdmlld19pZDtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGxpc3RfdmlldyA9IENyZWF0b3IuZ2V0TGlzdFZpZXcob2JqZWN0X25hbWUsIG51bGwpO1xuICBsaXN0X3ZpZXdfaWQgPSBsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5faWQgOiB2b2lkIDA7XG4gIGlmIChyZWNvcmRfaWQpIHtcbiAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmRfaWQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBcIm1lZXRpbmdcIikge1xuICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9jYWxlbmRhci9cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkO1xuICAgIH1cbiAgfVxufTtcblxuQ3JlYXRvci5nZXRMaXN0Vmlld1VybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkge1xuICB2YXIgdXJsO1xuICB1cmwgPSBDcmVhdG9yLmdldExpc3RWaWV3UmVsYXRpdmVVcmwob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKTtcbiAgcmV0dXJuIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwodXJsKTtcbn07XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdSZWxhdGl2ZVVybCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhcHBfaWQsIGxpc3Rfdmlld19pZCkge1xuICBpZiAobGlzdF92aWV3X2lkID09PSBcImNhbGVuZGFyXCIpIHtcbiAgICByZXR1cm4gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2NhbGVuZGFyL1wiO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRTd2l0Y2hMaXN0VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgbGlzdF92aWV3X2lkKSB7XG4gIGlmIChsaXN0X3ZpZXdfaWQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi9saXN0XCIpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9saXN0L3N3aXRjaFwiKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0VXJsID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFwcF9pZCwgcmVjb3JkX2lkLCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gIHJldHVybiBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9cIiArIHJlY29yZF9pZCArIFwiL1wiICsgcmVsYXRlZF9vYmplY3RfbmFtZSArIFwiL2dyaWRcIik7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdExvb2t1cEZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBpc19kZWVwLCBpc19za2lwX2hpZGUpIHtcbiAgdmFyIF9vYmplY3QsIF9vcHRpb25zLCBmaWVsZHMsIGljb247XG4gIF9vcHRpb25zID0gW107XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gX29wdGlvbnM7XG4gIH1cbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIGljb24gPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDA7XG4gIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICBpZiAoaXNfc2tpcF9oaWRlICYmIGYuaGlkZGVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChmLnR5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgbGFiZWw6IFwiXCIgKyAoZi5sYWJlbCB8fCBrKSxcbiAgICAgICAgdmFsdWU6IFwiXCIgKyBrLFxuICAgICAgICBpY29uOiBpY29uXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICBsYWJlbDogZi5sYWJlbCB8fCBrLFxuICAgICAgICB2YWx1ZTogayxcbiAgICAgICAgaWNvbjogaWNvblxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgaWYgKGlzX2RlZXApIHtcbiAgICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgICB2YXIgcl9vYmplY3Q7XG4gICAgICBpZiAoaXNfc2tpcF9oaWRlICYmIGYuaGlkZGVuKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICgoZi50eXBlID09PSBcImxvb2t1cFwiIHx8IGYudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpICYmIGYucmVmZXJlbmNlX3RvKSB7XG4gICAgICAgIHJfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoZi5yZWZlcmVuY2VfdG8pO1xuICAgICAgICBpZiAocl9vYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZjIsIGsyKSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiAoZi5sYWJlbCB8fCBrKSArIFwiPT5cIiArIChmMi5sYWJlbCB8fCBrMiksXG4gICAgICAgICAgICAgIHZhbHVlOiBrICsgXCIuXCIgKyBrMixcbiAgICAgICAgICAgICAgaWNvbjogcl9vYmplY3QgIT0gbnVsbCA/IHJfb2JqZWN0Lmljb24gOiB2b2lkIDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIF9vcHRpb25zO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RGaWx0ZXJGaWVsZE9wdGlvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgX29wdGlvbnMsIGZpZWxkcywgaWNvbiwgcGVybWlzc2lvbl9maWVsZHM7XG4gIF9vcHRpb25zID0gW107XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gX29wdGlvbnM7XG4gIH1cbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5maWVsZHMgOiB2b2lkIDA7XG4gIHBlcm1pc3Npb25fZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMob2JqZWN0X25hbWUpO1xuICBpY29uID0gX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwO1xuICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgaWYgKCFfLmluY2x1ZGUoW1wiZ3JpZFwiLCBcIm9iamVjdFwiLCBcIltPYmplY3RdXCIsIFwiW29iamVjdF1cIiwgXCJPYmplY3RcIl0sIGYudHlwZSkgJiYgIWYuaGlkZGVuKSB7XG4gICAgICBpZiAoIS9cXHcrXFwuLy50ZXN0KGspICYmIF8uaW5kZXhPZihwZXJtaXNzaW9uX2ZpZWxkcywgaykgPiAtMSkge1xuICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgbGFiZWw6IGYubGFiZWwgfHwgayxcbiAgICAgICAgICB2YWx1ZTogayxcbiAgICAgICAgICBpY29uOiBpY29uXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBfb3B0aW9ucztcbn07XG5cblxuLypcbmZpbHRlcnM6IOimgei9rOaNoueahGZpbHRlcnNcbmZpZWxkczog5a+56LGh5a2X5q61XG5maWx0ZXJfZmllbGRzOiDpu5jorqTov4fmu6TlrZfmrrXvvIzmlK/mjIHlrZfnrKbkuLLmlbDnu4Tlkozlr7nosaHmlbDnu4TkuKTnp43moLzlvI/vvIzlpoI6WydmaWxlZF9uYW1lMScsJ2ZpbGVkX25hbWUyJ10sW3tmaWVsZDonZmlsZWRfbmFtZTEnLHJlcXVpcmVkOnRydWV9XVxu5aSE55CG6YC76L6ROiDmiopmaWx0ZXJz5Lit5a2Y5Zyo5LqOZmlsdGVyX2ZpZWxkc+eahOi/h+a7pOadoeS7tuWinuWKoOavj+mhueeahGlzX2RlZmF1bHTjgIFpc19yZXF1aXJlZOWxnuaAp++8jOS4jeWtmOWcqOS6jmZpbHRlcl9maWVsZHPnmoTov4fmu6TmnaHku7blr7nlupTnmoTnp7vpmaTmr4/pobnnmoTnm7jlhbPlsZ7mgKdcbui/lOWbnue7k+aenDog5aSE55CG5ZCO55qEZmlsdGVyc1xuICovXG5cbkNyZWF0b3IuZ2V0RmlsdGVyc1dpdGhGaWx0ZXJGaWVsZHMgPSBmdW5jdGlvbihmaWx0ZXJzLCBmaWVsZHMsIGZpbHRlcl9maWVsZHMpIHtcbiAgaWYgKCFmaWx0ZXJzKSB7XG4gICAgZmlsdGVycyA9IFtdO1xuICB9XG4gIGlmICghZmlsdGVyX2ZpZWxkcykge1xuICAgIGZpbHRlcl9maWVsZHMgPSBbXTtcbiAgfVxuICBpZiAoZmlsdGVyX2ZpZWxkcyAhPSBudWxsID8gZmlsdGVyX2ZpZWxkcy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICBmaWx0ZXJfZmllbGRzLmZvckVhY2goZnVuY3Rpb24obikge1xuICAgICAgaWYgKF8uaXNTdHJpbmcobikpIHtcbiAgICAgICAgbiA9IHtcbiAgICAgICAgICBmaWVsZDogbixcbiAgICAgICAgICByZXF1aXJlZDogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWVsZHNbbi5maWVsZF0gJiYgIV8uZmluZFdoZXJlKGZpbHRlcnMsIHtcbiAgICAgICAgZmllbGQ6IG4uZmllbGRcbiAgICAgIH0pKSB7XG4gICAgICAgIHJldHVybiBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgIGZpZWxkOiBuLmZpZWxkLFxuICAgICAgICAgIGlzX2RlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgaXNfcmVxdWlyZWQ6IG4ucmVxdWlyZWRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgZmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uKGZpbHRlckl0ZW0pIHtcbiAgICB2YXIgbWF0Y2hGaWVsZDtcbiAgICBtYXRjaEZpZWxkID0gZmlsdGVyX2ZpZWxkcy5maW5kKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuID09PSBmaWx0ZXJJdGVtLmZpZWxkIHx8IG4uZmllbGQgPT09IGZpbHRlckl0ZW0uZmllbGQ7XG4gICAgfSk7XG4gICAgaWYgKF8uaXNTdHJpbmcobWF0Y2hGaWVsZCkpIHtcbiAgICAgIG1hdGNoRmllbGQgPSB7XG4gICAgICAgIGZpZWxkOiBtYXRjaEZpZWxkLFxuICAgICAgICByZXF1aXJlZDogZmFsc2VcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChtYXRjaEZpZWxkKSB7XG4gICAgICBmaWx0ZXJJdGVtLmlzX2RlZmF1bHQgPSB0cnVlO1xuICAgICAgcmV0dXJuIGZpbHRlckl0ZW0uaXNfcmVxdWlyZWQgPSBtYXRjaEZpZWxkLnJlcXVpcmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgZmlsdGVySXRlbS5pc19kZWZhdWx0O1xuICAgICAgcmV0dXJuIGRlbGV0ZSBmaWx0ZXJJdGVtLmlzX3JlcXVpcmVkO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmaWx0ZXJzO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3RfZmllbGRzLCBleHBhbmQpIHtcbiAgdmFyIGNvbGxlY3Rpb24sIHJlY29yZCwgcmVmLCByZWYxLCByZWYyO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmICghcmVjb3JkX2lkKSB7XG4gICAgcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIik7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSAmJiByZWNvcmRfaWQgPT09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpKSB7XG4gICAgICBpZiAoKHJlZiA9IFRlbXBsYXRlLmluc3RhbmNlKCkpICE9IG51bGwgPyByZWYucmVjb3JkIDogdm9pZCAwKSB7XG4gICAgICAgIHJldHVybiAocmVmMSA9IFRlbXBsYXRlLmluc3RhbmNlKCkpICE9IG51bGwgPyAocmVmMiA9IHJlZjEucmVjb3JkKSAhPSBudWxsID8gcmVmMi5nZXQoKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdF9maWVsZHMsIGV4cGFuZCk7XG4gICAgfVxuICB9XG4gIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpO1xuICBpZiAoY29sbGVjdGlvbikge1xuICAgIHJlY29yZCA9IGNvbGxlY3Rpb24uZmluZE9uZShyZWNvcmRfaWQpO1xuICAgIHJldHVybiByZWNvcmQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QXBwID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gIHZhciBhcHAsIHJlZiwgcmVmMTtcbiAgaWYgKCFhcHBfaWQpIHtcbiAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgfVxuICBhcHAgPSBDcmVhdG9yLkFwcHNbYXBwX2lkXTtcbiAgaWYgKChyZWYgPSBDcmVhdG9yLmRlcHMpICE9IG51bGwpIHtcbiAgICBpZiAoKHJlZjEgPSByZWYuYXBwKSAhPSBudWxsKSB7XG4gICAgICByZWYxLmRlcGVuZCgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXBwO1xufTtcblxuQ3JlYXRvci5nZXRBcHBPYmplY3ROYW1lcyA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICB2YXIgYXBwLCBvYmplY3RzO1xuICBhcHAgPSBDcmVhdG9yLmdldEFwcChhcHBfaWQpO1xuICBvYmplY3RzID0gW107XG4gIGlmIChhcHApIHtcbiAgICBfLmVhY2goYXBwLm9iamVjdHMsIGZ1bmN0aW9uKHYpIHtcbiAgICAgIHZhciBvYmo7XG4gICAgICBvYmogPSBDcmVhdG9yLmdldE9iamVjdCh2KTtcbiAgICAgIGlmICgob2JqICE9IG51bGwgPyBvYmoucGVybWlzc2lvbnMuZ2V0KCkuYWxsb3dSZWFkIDogdm9pZCAwKSAmJiAhb2JqLmhpZGRlbikge1xuICAgICAgICByZXR1cm4gb2JqZWN0cy5wdXNoKHYpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3RzO1xufTtcblxuQ3JlYXRvci5nZXRWaXNpYmxlQXBwcyA9IGZ1bmN0aW9uKGluY2x1ZGVBZG1pbikge1xuICB2YXIgYXBwcztcbiAgYXBwcyA9IFtdO1xuICBfLmVhY2goQ3JlYXRvci5BcHBzLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgaWYgKCh2LnZpc2libGUgIT09IGZhbHNlICYmIHYuX2lkICE9PSBcImFkbWluXCIpIHx8IChpbmNsdWRlQWRtaW4gJiYgdi5faWQgPT09IFwiYWRtaW5cIikpIHtcbiAgICAgIHJldHVybiBhcHBzLnB1c2godik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGFwcHM7XG59O1xuXG5DcmVhdG9yLmdldFZpc2libGVBcHBzT2JqZWN0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXBwcywgb2JqZWN0cywgdmlzaWJsZU9iamVjdE5hbWVzO1xuICBhcHBzID0gQ3JlYXRvci5nZXRWaXNpYmxlQXBwcygpO1xuICB2aXNpYmxlT2JqZWN0TmFtZXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhhcHBzLCAnb2JqZWN0cycpKTtcbiAgb2JqZWN0cyA9IF8uZmlsdGVyKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKHZpc2libGVPYmplY3ROYW1lcy5pbmRleE9mKG9iai5uYW1lKSA8IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICFvYmouaGlkZGVuO1xuICAgIH1cbiAgfSk7XG4gIG9iamVjdHMgPSBvYmplY3RzLnNvcnQoQ3JlYXRvci5zb3J0aW5nTWV0aG9kLmJpbmQoe1xuICAgIGtleTogXCJsYWJlbFwiXG4gIH0pKTtcbiAgb2JqZWN0cyA9IF8ucGx1Y2sob2JqZWN0cywgJ25hbWUnKTtcbiAgcmV0dXJuIF8udW5pcShvYmplY3RzKTtcbn07XG5cbkNyZWF0b3IuZ2V0QXBwc09iamVjdHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG9iamVjdHMsIHRlbXBPYmplY3RzO1xuICBvYmplY3RzID0gW107XG4gIHRlbXBPYmplY3RzID0gW107XG4gIF8uZm9yRWFjaChDcmVhdG9yLkFwcHMsIGZ1bmN0aW9uKGFwcCkge1xuICAgIHRlbXBPYmplY3RzID0gXy5maWx0ZXIoYXBwLm9iamVjdHMsIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuICFvYmouaGlkZGVuO1xuICAgIH0pO1xuICAgIHJldHVybiBvYmplY3RzID0gb2JqZWN0cy5jb25jYXQodGVtcE9iamVjdHMpO1xuICB9KTtcbiAgcmV0dXJuIF8udW5pcShvYmplY3RzKTtcbn07XG5cbkNyZWF0b3IudmFsaWRhdGVGaWx0ZXJzID0gZnVuY3Rpb24oZmlsdGVycywgbG9naWMpIHtcbiAgdmFyIGUsIGVycm9yTXNnLCBmaWx0ZXJfaXRlbXMsIGZpbHRlcl9sZW5ndGgsIGZsYWcsIGluZGV4LCB3b3JkO1xuICBmaWx0ZXJfaXRlbXMgPSBfLm1hcChmaWx0ZXJzLCBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoXy5pc0VtcHR5KG9iaikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gIH0pO1xuICBmaWx0ZXJfaXRlbXMgPSBfLmNvbXBhY3QoZmlsdGVyX2l0ZW1zKTtcbiAgZXJyb3JNc2cgPSBcIlwiO1xuICBmaWx0ZXJfbGVuZ3RoID0gZmlsdGVyX2l0ZW1zLmxlbmd0aDtcbiAgaWYgKGxvZ2ljKSB7XG4gICAgbG9naWMgPSBsb2dpYy5yZXBsYWNlKC9cXG4vZywgXCJcIikucmVwbGFjZSgvXFxzKy9nLCBcIiBcIik7XG4gICAgaWYgKC9bLl9cXC0hK10rL2lnLnRlc3QobG9naWMpKSB7XG4gICAgICBlcnJvck1zZyA9IFwi5ZCr5pyJ54m55q6K5a2X56ym44CCXCI7XG4gICAgfVxuICAgIGlmICghZXJyb3JNc2cpIHtcbiAgICAgIGluZGV4ID0gbG9naWMubWF0Y2goL1xcZCsvaWcpO1xuICAgICAgaWYgKCFpbmRleCkge1xuICAgICAgICBlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleC5mb3JFYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICBpZiAoaSA8IDEgfHwgaSA+IGZpbHRlcl9sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5p2h5Lu25byV55So5LqG5pyq5a6a5LmJ55qE562b6YCJ5Zmo77yaXCIgKyBpICsgXCLjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmbGFnID0gMTtcbiAgICAgICAgd2hpbGUgKGZsYWcgPD0gZmlsdGVyX2xlbmd0aCkge1xuICAgICAgICAgIGlmICghaW5kZXguaW5jbHVkZXMoXCJcIiArIGZsYWcpKSB7XG4gICAgICAgICAgICBlcnJvck1zZyA9IFwi5pyJ5Lqb562b6YCJ5p2h5Lu26L+b6KGM5LqG5a6a5LmJ77yM5L2G5pyq5Zyo6auY57qn562b6YCJ5p2h5Lu25Lit6KKr5byV55So44CCXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZsYWcrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWVycm9yTXNnKSB7XG4gICAgICB3b3JkID0gbG9naWMubWF0Y2goL1thLXpBLVpdKy9pZyk7XG4gICAgICBpZiAod29yZCkge1xuICAgICAgICB3b3JkLmZvckVhY2goZnVuY3Rpb24odykge1xuICAgICAgICAgIGlmICghL14oYW5kfG9yKSQvaWcudGVzdCh3KSkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yTXNnID0gXCLmo4Dmn6XmgqjnmoTpq5jnuqfnrZvpgInmnaHku7bkuK3nmoTmi7zlhpnjgIJcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWVycm9yTXNnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBDcmVhdG9yW1wiZXZhbFwiXShsb2dpYy5yZXBsYWNlKC9hbmQvaWcsIFwiJiZcIikucmVwbGFjZSgvb3IvaWcsIFwifHxcIikpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBlcnJvck1zZyA9IFwi5oKo55qE562b6YCJ5Zmo5Lit5ZCr5pyJ54m55q6K5a2X56ymXCI7XG4gICAgICB9XG4gICAgICBpZiAoLyhBTkQpW14oKV0rKE9SKS9pZy50ZXN0KGxvZ2ljKSB8fCAvKE9SKVteKCldKyhBTkQpL2lnLnRlc3QobG9naWMpKSB7XG4gICAgICAgIGVycm9yTXNnID0gXCLmgqjnmoTnrZvpgInlmajlv4XpobvlnKjov57nu63mgKfnmoQgQU5EIOWSjCBPUiDooajovr7lvI/liY3lkI7kvb/nlKjmi6zlj7fjgIJcIjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKGVycm9yTXNnKSB7XG4gICAgY29uc29sZS5sb2coXCJlcnJvclwiLCBlcnJvck1zZyk7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdG9hc3RyLmVycm9yKGVycm9yTXNnKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuICovXG5cbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvTW9uZ28gPSBmdW5jdGlvbihmaWx0ZXJzLCBvcHRpb25zKSB7XG4gIHZhciBzZWxlY3RvcjtcbiAgaWYgKCEoZmlsdGVycyAhPSBudWxsID8gZmlsdGVycy5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghKGZpbHRlcnNbMF0gaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICBmaWx0ZXJzID0gXy5tYXAoZmlsdGVycywgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gW29iai5maWVsZCwgb2JqLm9wZXJhdGlvbiwgb2JqLnZhbHVlXTtcbiAgICB9KTtcbiAgfVxuICBzZWxlY3RvciA9IFtdO1xuICBfLmVhY2goZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIGZpZWxkLCBvcHRpb24sIHJlZywgc3ViX3NlbGVjdG9yLCB2YWx1ZTtcbiAgICBmaWVsZCA9IGZpbHRlclswXTtcbiAgICBvcHRpb24gPSBmaWx0ZXJbMV07XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgbnVsbCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHN1Yl9zZWxlY3RvciA9IHt9O1xuICAgIHN1Yl9zZWxlY3RvcltmaWVsZF0gPSB7fTtcbiAgICBpZiAob3B0aW9uID09PSBcIj1cIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRlcVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjw+XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbmVcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI+XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkZ3RcIl0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCI+PVwiKSB7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJGd0ZVwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjxcIikge1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRsdFwiXSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjw9XCIpIHtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkbHRlXCJdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwic3RhcnRzd2l0aFwiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKFwiXlwiICsgdmFsdWUsIFwiaVwiKTtcbiAgICAgIHN1Yl9zZWxlY3RvcltmaWVsZF1bXCIkcmVnZXhcIl0gPSByZWc7XG4gICAgfSBlbHNlIGlmIChvcHRpb24gPT09IFwiY29udGFpbnNcIikge1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cCh2YWx1ZSwgXCJpXCIpO1xuICAgICAgc3ViX3NlbGVjdG9yW2ZpZWxkXVtcIiRyZWdleFwiXSA9IHJlZztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gXCJub3Rjb250YWluc1wiKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKFwiXigoPyFcIiArIHZhbHVlICsgXCIpLikqJFwiLCBcImlcIik7XG4gICAgICBzdWJfc2VsZWN0b3JbZmllbGRdW1wiJHJlZ2V4XCJdID0gcmVnO1xuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3IucHVzaChzdWJfc2VsZWN0b3IpO1xuICB9KTtcbiAgcmV0dXJuIHNlbGVjdG9yO1xufTtcblxuQ3JlYXRvci5pc0JldHdlZW5GaWx0ZXJPcGVyYXRpb24gPSBmdW5jdGlvbihvcGVyYXRpb24pIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIG9wZXJhdGlvbiA9PT0gXCJiZXR3ZWVuXCIgfHwgISEoKHJlZiA9IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKHRydWUpKSAhPSBudWxsID8gcmVmW29wZXJhdGlvbl0gOiB2b2lkIDApO1xufTtcblxuXG4vKlxub3B0aW9uc+WPguaVsO+8mlxuXHRleHRlbmQtLSDmmK/lkKbpnIDopoHmiorlvZPliY3nlKjmiLfln7rmnKzkv6Hmga/liqDlhaXlhazlvI/vvIzljbPorqnlhazlvI/mlK/mjIFDcmVhdG9yLlVTRVJfQ09OVEVYVOS4reeahOWAvO+8jOm7mOiupOS4unRydWVcblx0dXNlcklkLS0g5b2T5YmN55m75b2V55So5oi3XG5cdHNwYWNlSWQtLSDlvZPliY3miYDlnKjlt6XkvZzljLpcblx0ZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuICovXG5cbkNyZWF0b3IuZm9ybWF0RmlsdGVyc1RvRGV2ID0gZnVuY3Rpb24oZmlsdGVycywgb2JqZWN0X25hbWUsIG9wdGlvbnMpIHtcbiAgdmFyIGxvZ2ljVGVtcEZpbHRlcnMsIHNlbGVjdG9yLCBzdGVlZG9zRmlsdGVycztcbiAgc3RlZWRvc0ZpbHRlcnMgPSByZXF1aXJlKFwiQHN0ZWVkb3MvZmlsdGVyc1wiKTtcbiAgaWYgKCFmaWx0ZXJzLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5pc19sb2dpY19vciA6IHZvaWQgMCkge1xuICAgIGxvZ2ljVGVtcEZpbHRlcnMgPSBbXTtcbiAgICBmaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24obikge1xuICAgICAgbG9naWNUZW1wRmlsdGVycy5wdXNoKG4pO1xuICAgICAgcmV0dXJuIGxvZ2ljVGVtcEZpbHRlcnMucHVzaChcIm9yXCIpO1xuICAgIH0pO1xuICAgIGxvZ2ljVGVtcEZpbHRlcnMucG9wKCk7XG4gICAgZmlsdGVycyA9IGxvZ2ljVGVtcEZpbHRlcnM7XG4gIH1cbiAgc2VsZWN0b3IgPSBzdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9EZXYoZmlsdGVycywgQ3JlYXRvci5VU0VSX0NPTlRFWFQpO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5cbi8qXG5vcHRpb25z5Y+C5pWw77yaXG5cdGV4dGVuZC0tIOaYr+WQpumcgOimgeaKiuW9k+WJjeeUqOaIt+WfuuacrOS/oeaBr+WKoOWFpeWFrOW8j++8jOWNs+iuqeWFrOW8j+aUr+aMgUNyZWF0b3IuVVNFUl9DT05URVhU5Lit55qE5YC877yM6buY6K6k5Li6dHJ1ZVxuXHR1c2VySWQtLSDlvZPliY3nmbvlvZXnlKjmiLdcblx0c3BhY2VJZC0tIOW9k+WJjeaJgOWcqOW3peS9nOWMulxuZXh0ZW5k5Li6dHJ1ZeaXtu+8jOWQjuerr+mcgOimgemineWkluS8oOWFpXVzZXJJZOWPinNwYWNlSWTnlKjkuo7mipPlj5ZDcmVhdG9yLlVTRVJfQ09OVEVYVOWvueW6lOeahOWAvFxuICovXG5cbkNyZWF0b3IuZm9ybWF0TG9naWNGaWx0ZXJzVG9EZXYgPSBmdW5jdGlvbihmaWx0ZXJzLCBmaWx0ZXJfbG9naWMsIG9wdGlvbnMpIHtcbiAgdmFyIGZvcm1hdF9sb2dpYztcbiAgZm9ybWF0X2xvZ2ljID0gZmlsdGVyX2xvZ2ljLnJlcGxhY2UoL1xcKFxccysvaWcsIFwiKFwiKS5yZXBsYWNlKC9cXHMrXFwpL2lnLCBcIilcIikucmVwbGFjZSgvXFwoL2csIFwiW1wiKS5yZXBsYWNlKC9cXCkvZywgXCJdXCIpLnJlcGxhY2UoL1xccysvZywgXCIsXCIpLnJlcGxhY2UoLyhhbmR8b3IpL2lnLCBcIickMSdcIik7XG4gIGZvcm1hdF9sb2dpYyA9IGZvcm1hdF9sb2dpYy5yZXBsYWNlKC8oXFxkKSsvaWcsIGZ1bmN0aW9uKHgpIHtcbiAgICB2YXIgX2YsIGZpZWxkLCBvcHRpb24sIHN1Yl9zZWxlY3RvciwgdmFsdWU7XG4gICAgX2YgPSBmaWx0ZXJzW3ggLSAxXTtcbiAgICBmaWVsZCA9IF9mLmZpZWxkO1xuICAgIG9wdGlvbiA9IF9mLm9wZXJhdGlvbjtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKF9mLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShfZi52YWx1ZSwgbnVsbCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHN1Yl9zZWxlY3RvciA9IFtdO1xuICAgIGlmIChfLmlzQXJyYXkodmFsdWUpID09PSB0cnVlKSB7XG4gICAgICBpZiAob3B0aW9uID09PSBcIj1cIikge1xuICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4gc3ViX3NlbGVjdG9yLnB1c2goW2ZpZWxkLCBvcHRpb24sIHZdLCBcIm9yXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSBcIjw+XCIpIHtcbiAgICAgICAgXy5lYWNoKHZhbHVlLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIHN1Yl9zZWxlY3Rvci5wdXNoKFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJhbmRcIik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgXy5lYWNoKHZhbHVlLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIHN1Yl9zZWxlY3Rvci5wdXNoKFtmaWVsZCwgb3B0aW9uLCB2XSwgXCJvclwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoc3ViX3NlbGVjdG9yW3N1Yl9zZWxlY3Rvci5sZW5ndGggLSAxXSA9PT0gXCJhbmRcIiB8fCBzdWJfc2VsZWN0b3Jbc3ViX3NlbGVjdG9yLmxlbmd0aCAtIDFdID09PSBcIm9yXCIpIHtcbiAgICAgICAgc3ViX3NlbGVjdG9yLnBvcCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdWJfc2VsZWN0b3IgPSBbZmllbGQsIG9wdGlvbiwgdmFsdWVdO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcInN1Yl9zZWxlY3RvclwiLCBzdWJfc2VsZWN0b3IpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzdWJfc2VsZWN0b3IpO1xuICB9KTtcbiAgZm9ybWF0X2xvZ2ljID0gXCJbXCIgKyBmb3JtYXRfbG9naWMgKyBcIl1cIjtcbiAgcmV0dXJuIENyZWF0b3JbXCJldmFsXCJdKGZvcm1hdF9sb2dpYyk7XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgX29iamVjdCwgcGVybWlzc2lvbnMsIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCByZWxhdGVkX29iamVjdHMsIHVucmVsYXRlZF9vYmplY3RzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW107XG4gIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghX29iamVjdCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdF9uYW1lcztcbiAgfVxuICByZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKF9vYmplY3QuX2NvbGxlY3Rpb25fbmFtZSk7XG4gIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhyZWxhdGVkX29iamVjdHMsIFwib2JqZWN0X25hbWVcIik7XG4gIGlmICgocmVsYXRlZF9vYmplY3RfbmFtZXMgIT0gbnVsbCA/IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmxlbmd0aCA6IHZvaWQgMCkgPT09IDApIHtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXM7XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICB1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzO1xuICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZShyZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHMpO1xuICByZXR1cm4gXy5maWx0ZXIocmVsYXRlZF9vYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCkge1xuICAgIHZhciBhbGxvd1JlYWQsIGlzQWN0aXZlLCByZWYsIHJlbGF0ZWRfb2JqZWN0X25hbWU7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0Lm9iamVjdF9uYW1lO1xuICAgIGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xO1xuICAgIGFsbG93UmVhZCA9IChyZWYgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYuYWxsb3dSZWFkIDogdm9pZCAwO1xuICAgIHJldHVybiBpc0FjdGl2ZSAmJiBhbGxvd1JlYWQ7XG4gIH0pO1xufTtcblxuQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0TmFtZXMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciByZWxhdGVkX29iamVjdHM7XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIHJldHVybiBfLnBsdWNrKHJlbGF0ZWRfb2JqZWN0cywgXCJvYmplY3RfbmFtZVwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0QWN0aW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGFjdGlvbnMsIGRpc2FibGVkX2FjdGlvbnMsIG9iaiwgcGVybWlzc2lvbnM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIGRpc2FibGVkX2FjdGlvbnMgPSBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zO1xuICBhY3Rpb25zID0gXy5zb3J0QnkoXy52YWx1ZXMob2JqLmFjdGlvbnMpLCAnc29ydCcpO1xuICBfLmVhY2goYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBhY3Rpb24ub24gPT09IFwicmVjb3JkXCIgJiYgYWN0aW9uLm5hbWUgIT09ICdzdGFuZGFyZF9lZGl0Jykge1xuICAgICAgcmV0dXJuIGFjdGlvbi5vbiA9ICdyZWNvcmRfbW9yZSc7XG4gICAgfVxuICB9KTtcbiAgYWN0aW9ucyA9IF8uZmlsdGVyKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIHJldHVybiBfLmluZGV4T2YoZGlzYWJsZWRfYWN0aW9ucywgYWN0aW9uLm5hbWUpIDwgMDtcbiAgfSk7XG4gIHJldHVybiBhY3Rpb25zO1xufTtcblxuL+i/lOWbnuW9k+WJjeeUqOaIt+acieadg+mZkOiuv+mXrueahOaJgOaciWxpc3Rfdmlld++8jOWMheaLrOWIhuS6q+eahO+8jOeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahO+8iOmZpOmdnm93bmVy5Y+Y5LqG77yJ77yM5Lul5Y+K6buY6K6k55qE5YW25LuW6KeG5Zu+5rOo5oSPQ3JlYXRvci5nZXRQZXJtaXNzaW9uc+WHveaVsOS4reaYr+S4jeS8muacieeUqOaIt+iHquWumuS5iemdnuWIhuS6q+eahOinhuWbvueahO+8jOaJgOS7pUNyZWF0b3IuZ2V0UGVybWlzc2lvbnPlh73mlbDkuK3mi7/liLDnmoTnu5PmnpzkuI3lhajvvIzlubbkuI3mmK/lvZPliY3nlKjmiLfog73nnIvliLDmiYDmnInop4blm74vO1xuXG5DcmVhdG9yLmdldExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIGRpc2FibGVkX2xpc3Rfdmlld3MsIGlzTW9iaWxlLCBsaXN0X3ZpZXdzLCBvYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBkaXNhYmxlZF9saXN0X3ZpZXdzID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS5kaXNhYmxlZF9saXN0X3ZpZXdzIHx8IFtdO1xuICBsaXN0X3ZpZXdzID0gW107XG4gIGlzTW9iaWxlID0gU3RlZWRvcy5pc01vYmlsZSgpO1xuICBfLmVhY2gob2JqZWN0Lmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIGlmIChpc01vYmlsZSAmJiBpdGVtLnR5cGUgPT09IFwiY2FsZW5kYXJcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXRlbV9uYW1lICE9PSBcImRlZmF1bHRcIikge1xuICAgICAgaWYgKF8uaW5kZXhPZihkaXNhYmxlZF9saXN0X3ZpZXdzLCBpdGVtX25hbWUpIDwgMCB8fCBpdGVtLm93bmVyID09PSB1c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlld3MucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbGlzdF92aWV3cztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgZmllbGRzTmFtZSwgdW5yZWFkYWJsZV9maWVsZHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgZmllbGRzTmFtZSA9IENyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZShvYmplY3RfbmFtZSk7XG4gIHVucmVhZGFibGVfZmllbGRzID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS51bnJlYWRhYmxlX2ZpZWxkcztcbiAgcmV0dXJuIF8uZGlmZmVyZW5jZShmaWVsZHNOYW1lLCB1bnJlYWRhYmxlX2ZpZWxkcyk7XG59O1xuXG5DcmVhdG9yLmlzbG9hZGluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkLmdldCgpO1xufTtcblxuQ3JlYXRvci5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpO1xufTtcblxuQ3JlYXRvci5nZXREaXNhYmxlZEZpZWxkcyA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0uZGlzYWJsZWQgJiYgIWZpZWxkLmF1dG9mb3JtLm9taXQgJiYgZmllbGROYW1lO1xuICB9KTtcbiAgZmllbGRzID0gXy5jb21wYWN0KGZpZWxkcyk7XG4gIHJldHVybiBmaWVsZHM7XG59O1xuXG5DcmVhdG9yLmdldEhpZGRlbkZpZWxkcyA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0udHlwZSA9PT0gXCJoaWRkZW5cIiAmJiAhZmllbGQuYXV0b2Zvcm0ub21pdCAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzV2l0aE5vR3JvdXAgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIGZpZWxkcztcbiAgZmllbGRzID0gXy5tYXAoc2NoZW1hLCBmdW5jdGlvbihmaWVsZCwgZmllbGROYW1lKSB7XG4gICAgcmV0dXJuICghZmllbGQuYXV0b2Zvcm0gfHwgIWZpZWxkLmF1dG9mb3JtLmdyb3VwIHx8IGZpZWxkLmF1dG9mb3JtLmdyb3VwID09PSBcIi1cIikgJiYgKCFmaWVsZC5hdXRvZm9ybSB8fCBmaWVsZC5hdXRvZm9ybS50eXBlICE9PSBcImhpZGRlblwiKSAmJiBmaWVsZE5hbWU7XG4gIH0pO1xuICBmaWVsZHMgPSBfLmNvbXBhY3QoZmllbGRzKTtcbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbkNyZWF0b3IuZ2V0U29ydGVkRmllbGRHcm91cE5hbWVzID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciBuYW1lcztcbiAgbmFtZXMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkLmF1dG9mb3JtICYmIGZpZWxkLmF1dG9mb3JtLmdyb3VwICE9PSBcIi1cIiAmJiBmaWVsZC5hdXRvZm9ybS5ncm91cDtcbiAgfSk7XG4gIG5hbWVzID0gXy5jb21wYWN0KG5hbWVzKTtcbiAgbmFtZXMgPSBfLnVuaXF1ZShuYW1lcyk7XG4gIHJldHVybiBuYW1lcztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzRm9yR3JvdXAgPSBmdW5jdGlvbihzY2hlbWEsIGdyb3VwTmFtZSkge1xuICB2YXIgZmllbGRzO1xuICBmaWVsZHMgPSBfLm1hcChzY2hlbWEsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZE5hbWUpIHtcbiAgICByZXR1cm4gZmllbGQuYXV0b2Zvcm0gJiYgZmllbGQuYXV0b2Zvcm0uZ3JvdXAgPT09IGdyb3VwTmFtZSAmJiBmaWVsZC5hdXRvZm9ybS50eXBlICE9PSBcImhpZGRlblwiICYmIGZpZWxkTmFtZTtcbiAgfSk7XG4gIGZpZWxkcyA9IF8uY29tcGFjdChmaWVsZHMpO1xuICByZXR1cm4gZmllbGRzO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZHNXaXRob3V0T21pdCA9IGZ1bmN0aW9uKHNjaGVtYSwga2V5cykge1xuICBrZXlzID0gXy5tYXAoa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIGZpZWxkLCByZWY7XG4gICAgZmllbGQgPSBfLnBpY2soc2NoZW1hLCBrZXkpO1xuICAgIGlmICgocmVmID0gZmllbGRba2V5XS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi5vbWl0IDogdm9pZCAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICB9KTtcbiAga2V5cyA9IF8uY29tcGFjdChrZXlzKTtcbiAgcmV0dXJuIGtleXM7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkc0luRmlyc3RMZXZlbCA9IGZ1bmN0aW9uKGZpcnN0TGV2ZWxLZXlzLCBrZXlzKSB7XG4gIGtleXMgPSBfLm1hcChrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoXy5pbmRleE9mKGZpcnN0TGV2ZWxLZXlzLCBrZXkpID4gLTEpIHtcbiAgICAgIHJldHVybiBrZXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuICBrZXlzID0gXy5jb21wYWN0KGtleXMpO1xuICByZXR1cm4ga2V5cztcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRzRm9yUmVvcmRlciA9IGZ1bmN0aW9uKHNjaGVtYSwga2V5cywgaXNTaW5nbGUpIHtcbiAgdmFyIGNoaWxkS2V5cywgZmllbGRzLCBpLCBpc19yYW5nZV8xLCBpc19yYW5nZV8yLCBpc193aWRlXzEsIGlzX3dpZGVfMiwgc2NfMSwgc2NfMjtcbiAgZmllbGRzID0gW107XG4gIGkgPSAwO1xuICB3aGlsZSAoaSA8IGtleXMubGVuZ3RoKSB7XG4gICAgc2NfMSA9IF8ucGljayhzY2hlbWEsIGtleXNbaV0pO1xuICAgIHNjXzIgPSBfLnBpY2soc2NoZW1hLCBrZXlzW2kgKyAxXSk7XG4gICAgaXNfd2lkZV8xID0gZmFsc2U7XG4gICAgaXNfd2lkZV8yID0gZmFsc2U7XG4gICAgaXNfcmFuZ2VfMSA9IGZhbHNlO1xuICAgIGlzX3JhbmdlXzIgPSBmYWxzZTtcbiAgICBfLmVhY2goc2NfMSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciByZWYsIHJlZjEsIHJlZjI7XG4gICAgICBpZiAoKChyZWYgPSB2YWx1ZS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi5pc193aWRlIDogdm9pZCAwKSB8fCAoKHJlZjEgPSB2YWx1ZS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjEudHlwZSA6IHZvaWQgMCkgPT09IFwidGFibGVcIikge1xuICAgICAgICBpc193aWRlXzEgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKChyZWYyID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYyLmlzX3JhbmdlIDogdm9pZCAwKSB7XG4gICAgICAgIHJldHVybiBpc19yYW5nZV8xID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBfLmVhY2goc2NfMiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciByZWYsIHJlZjEsIHJlZjI7XG4gICAgICBpZiAoKChyZWYgPSB2YWx1ZS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi5pc193aWRlIDogdm9pZCAwKSB8fCAoKHJlZjEgPSB2YWx1ZS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjEudHlwZSA6IHZvaWQgMCkgPT09IFwidGFibGVcIikge1xuICAgICAgICBpc193aWRlXzIgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKChyZWYyID0gdmFsdWUuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYyLmlzX3JhbmdlIDogdm9pZCAwKSB7XG4gICAgICAgIHJldHVybiBpc19yYW5nZV8yID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoaXNTaW5nbGUpIHtcbiAgICAgIGZpZWxkcy5wdXNoKGtleXMuc2xpY2UoaSwgaSArIDEpKTtcbiAgICAgIGkgKz0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFpc19yYW5nZV8xICYmIGlzX3JhbmdlXzIpIHtcbiAgICAgICAgY2hpbGRLZXlzID0ga2V5cy5zbGljZShpLCBpICsgMSk7XG4gICAgICAgIGNoaWxkS2V5cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIGZpZWxkcy5wdXNoKGNoaWxkS2V5cyk7XG4gICAgICAgIGkgKz0gMTtcbiAgICAgIH0gZWxzZSBpZiAoaXNfd2lkZV8xKSB7XG4gICAgICAgIGZpZWxkcy5wdXNoKGtleXMuc2xpY2UoaSwgaSArIDEpKTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgfSBlbHNlIGlmICghaXNfd2lkZV8xICYmIGlzX3dpZGVfMikge1xuICAgICAgICBjaGlsZEtleXMgPSBrZXlzLnNsaWNlKGksIGkgKyAxKTtcbiAgICAgICAgY2hpbGRLZXlzLnB1c2godm9pZCAwKTtcbiAgICAgICAgZmllbGRzLnB1c2goY2hpbGRLZXlzKTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgfSBlbHNlIGlmICghaXNfd2lkZV8xICYmICFpc193aWRlXzIpIHtcbiAgICAgICAgY2hpbGRLZXlzID0ga2V5cy5zbGljZShpLCBpICsgMSk7XG4gICAgICAgIGlmIChrZXlzW2kgKyAxXSkge1xuICAgICAgICAgIGNoaWxkS2V5cy5wdXNoKGtleXNbaSArIDFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGlsZEtleXMucHVzaCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICAgIGZpZWxkcy5wdXNoKGNoaWxkS2V5cyk7XG4gICAgICAgIGkgKz0gMjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpZWxkcztcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ3JlYXRvci5nZXRBbGxSZWxhdGVkT2JqZWN0cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIHJlbGF0ZWRfb2JqZWN0X25hbWVzO1xuICAgIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gW107XG4gICAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICAgIHJldHVybiBfLmVhY2gocmVsYXRlZF9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgICAgaWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT09IG9iamVjdF9uYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0X25hbWVzLnB1c2gocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkuZW5hYmxlX2ZpbGVzKSB7XG4gICAgICByZWxhdGVkX29iamVjdF9uYW1lcy5wdXNoKFwiY21zX2ZpbGVzXCIpO1xuICAgIH1cbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RfbmFtZXM7XG4gIH07XG59XG4iLCJDcmVhdG9yLmFwcHNCeU5hbWUgPSB7fVxyXG5cclxuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRcIm9iamVjdF9yZWNlbnRfdmlld2VkXCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKS0+XHJcblxyXG5cdFx0aWYgIXRoaXMudXNlcklkXHJcblx0XHRcdHJldHVybiBudWxsXHJcblxyXG5cdFx0aWYgb2JqZWN0X25hbWUgPT0gXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiXHJcblx0XHRcdHJldHVyblxyXG5cdFx0aWYgb2JqZWN0X25hbWUgYW5kIHJlY29yZF9pZFxyXG5cclxuXHRcdFx0ZG9jID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kT25lKHtfaWQ6IHJlY29yZF9pZH0sIHtmaWVsZHM6IHtzcGFjZTogMX19KVxyXG5cdFx0XHRzcGFjZUlkID0gZG9jLnNwYWNlXHJcblxyXG5cdFx0XHRjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiKVxyXG5cdFx0XHRmaWx0ZXJzID0geyBvd25lcjogdGhpcy51c2VySWQsIHNwYWNlOiBzcGFjZUlkLCAncmVjb3JkLm8nOiBvYmplY3RfbmFtZSwgJ3JlY29yZC5pZHMnOiBbcmVjb3JkX2lkXX1cclxuXHRcdFx0Y3VycmVudF9yZWNlbnRfdmlld2VkID0gY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLmZpbmRPbmUoZmlsdGVycylcclxuXHRcdFx0aWYgY3VycmVudF9yZWNlbnRfdmlld2VkXHJcblx0XHRcdFx0Y29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLnVwZGF0ZShcclxuXHRcdFx0XHRcdGN1cnJlbnRfcmVjZW50X3ZpZXdlZC5faWQsXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdCRpbmM6IHtcclxuXHRcdFx0XHRcdFx0XHRjb3VudDogMVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWQ6IG5ldyBEYXRlKClcclxuXHRcdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogdGhpcy51c2VySWRcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5pbnNlcnQoXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdF9pZDogY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLl9tYWtlTmV3SUQoKVxyXG5cdFx0XHRcdFx0XHRvd25lcjogdGhpcy51c2VySWRcclxuXHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWRcclxuXHRcdFx0XHRcdFx0cmVjb3JkOiB7bzogb2JqZWN0X25hbWUsIGlkczogW3JlY29yZF9pZF19XHJcblx0XHRcdFx0XHRcdGNvdW50OiAxXHJcblx0XHRcdFx0XHRcdGNyZWF0ZWQ6IG5ldyBEYXRlKClcclxuXHRcdFx0XHRcdFx0Y3JlYXRlZF9ieTogdGhpcy51c2VySWRcclxuXHRcdFx0XHRcdFx0bW9kaWZpZWQ6IG5ldyBEYXRlKClcclxuXHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IHRoaXMudXNlcklkXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0KVxyXG5cdFx0XHRyZXR1cm4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCkge1xuICAgIHZhciBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQsIGN1cnJlbnRfcmVjZW50X3ZpZXdlZCwgZG9jLCBmaWx0ZXJzLCBzcGFjZUlkO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwib2JqZWN0X3JlY2VudF92aWV3ZWRcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAob2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgICBkb2MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHJlY29yZF9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBzcGFjZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHNwYWNlSWQgPSBkb2Muc3BhY2U7XG4gICAgICBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiKTtcbiAgICAgIGZpbHRlcnMgPSB7XG4gICAgICAgIG93bmVyOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICdyZWNvcmQubyc6IG9iamVjdF9uYW1lLFxuICAgICAgICAncmVjb3JkLmlkcyc6IFtyZWNvcmRfaWRdXG4gICAgICB9O1xuICAgICAgY3VycmVudF9yZWNlbnRfdmlld2VkID0gY29sbGVjdGlvbl9yZWNlbnRfdmlld2VkLmZpbmRPbmUoZmlsdGVycyk7XG4gICAgICBpZiAoY3VycmVudF9yZWNlbnRfdmlld2VkKSB7XG4gICAgICAgIGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC51cGRhdGUoY3VycmVudF9yZWNlbnRfdmlld2VkLl9pZCwge1xuICAgICAgICAgICRpbmM6IHtcbiAgICAgICAgICAgIGNvdW50OiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2xsZWN0aW9uX3JlY2VudF92aWV3ZWQuaW5zZXJ0KHtcbiAgICAgICAgICBfaWQ6IGNvbGxlY3Rpb25fcmVjZW50X3ZpZXdlZC5fbWFrZU5ld0lEKCksXG4gICAgICAgICAgb3duZXI6IHRoaXMudXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgIHJlY29yZDoge1xuICAgICAgICAgICAgbzogb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBpZHM6IFtyZWNvcmRfaWRdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IHRoaXMudXNlcklkLFxuICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiB0aGlzLnVzZXJJZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuIiwicmVjZW50X2FnZ3JlZ2F0ZSA9IChjcmVhdGVkX2J5LCBzcGFjZUlkLCBfcmVjb3JkcywgY2FsbGJhY2spLT5cclxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9yZWNlbnRfdmlld2VkLnJhd0NvbGxlY3Rpb24oKS5hZ2dyZWdhdGUoW1xyXG5cdFx0eyRtYXRjaDoge2NyZWF0ZWRfYnk6IGNyZWF0ZWRfYnksIHNwYWNlOiBzcGFjZUlkfX0sXHJcblx0XHR7JGdyb3VwOiB7X2lkOiB7b2JqZWN0X25hbWU6IFwiJHJlY29yZC5vXCIsIHJlY29yZF9pZDogXCIkcmVjb3JkLmlkc1wiLCBzcGFjZTogXCIkc3BhY2VcIn0sIG1heENyZWF0ZWQ6IHskbWF4OiBcIiRjcmVhdGVkXCJ9fX0sXHJcblx0XHR7JHNvcnQ6IHttYXhDcmVhdGVkOiAtMX19LFxyXG5cdFx0eyRsaW1pdDogMTB9XHJcblx0XSkudG9BcnJheSAoZXJyLCBkYXRhKS0+XHJcblx0XHRpZiBlcnJcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycilcclxuXHJcblx0XHRkYXRhLmZvckVhY2ggKGRvYykgLT5cclxuXHRcdFx0X3JlY29yZHMucHVzaCBkb2MuX2lkXHJcblxyXG5cdFx0aWYgY2FsbGJhY2sgJiYgXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKVxyXG5cdFx0XHRjYWxsYmFjaygpXHJcblxyXG5cdFx0cmV0dXJuXHJcblxyXG5hc3luY19yZWNlbnRfYWdncmVnYXRlID0gTWV0ZW9yLndyYXBBc3luYyhyZWNlbnRfYWdncmVnYXRlKVxyXG5cclxuc2VhcmNoX29iamVjdCA9IChzcGFjZSwgb2JqZWN0X25hbWUsdXNlcklkLCBzZWFyY2hUZXh0KS0+XHJcblx0ZGF0YSA9IG5ldyBBcnJheSgpXHJcblxyXG5cdGlmIHNlYXJjaFRleHRcclxuXHJcblx0XHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblxyXG5cdFx0X29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxyXG5cdFx0X29iamVjdF9uYW1lX2tleSA9IF9vYmplY3Q/Lk5BTUVfRklFTERfS0VZXHJcblx0XHRpZiBfb2JqZWN0ICYmIF9vYmplY3RfY29sbGVjdGlvbiAmJiBfb2JqZWN0X25hbWVfa2V5XHJcblx0XHRcdHF1ZXJ5ID0ge31cclxuXHRcdFx0c2VhcmNoX0tleXdvcmRzID0gc2VhcmNoVGV4dC5zcGxpdChcIiBcIilcclxuXHRcdFx0cXVlcnlfYW5kID0gW11cclxuXHRcdFx0c2VhcmNoX0tleXdvcmRzLmZvckVhY2ggKGtleXdvcmQpLT5cclxuXHRcdFx0XHRzdWJxdWVyeSA9IHt9XHJcblx0XHRcdFx0c3VicXVlcnlbX29iamVjdF9uYW1lX2tleV0gPSB7JHJlZ2V4OiBrZXl3b3JkLnRyaW0oKX1cclxuXHRcdFx0XHRxdWVyeV9hbmQucHVzaCBzdWJxdWVyeVxyXG5cclxuXHRcdFx0cXVlcnkuJGFuZCA9IHF1ZXJ5X2FuZFxyXG5cdFx0XHRxdWVyeS5zcGFjZSA9IHskaW46IFtzcGFjZV19XHJcblxyXG5cdFx0XHRmaWVsZHMgPSB7X2lkOiAxfVxyXG5cdFx0XHRmaWVsZHNbX29iamVjdF9uYW1lX2tleV0gPSAxXHJcblxyXG5cdFx0XHRyZWNvcmRzID0gX29iamVjdF9jb2xsZWN0aW9uLmZpbmQocXVlcnksIHtmaWVsZHM6IGZpZWxkcywgc29ydDoge21vZGlmaWVkOiAxfSwgbGltaXQ6IDV9KVxyXG5cclxuXHRcdFx0cmVjb3Jkcy5mb3JFYWNoIChyZWNvcmQpLT5cclxuXHRcdFx0XHRkYXRhLnB1c2gge19pZDogcmVjb3JkLl9pZCwgX25hbWU6IHJlY29yZFtfb2JqZWN0X25hbWVfa2V5XSwgX29iamVjdF9uYW1lOiBvYmplY3RfbmFtZX1cclxuXHRcclxuXHRyZXR1cm4gZGF0YVxyXG5cclxuTWV0ZW9yLm1ldGhvZHNcclxuXHQnb2JqZWN0X3JlY2VudF9yZWNvcmQnOiAoc3BhY2VJZCktPlxyXG5cdFx0ZGF0YSA9IG5ldyBBcnJheSgpXHJcblx0XHRyZWNvcmRzID0gbmV3IEFycmF5KClcclxuXHRcdGFzeW5jX3JlY2VudF9hZ2dyZWdhdGUodGhpcy51c2VySWQsIHNwYWNlSWQsIHJlY29yZHMpXHJcblx0XHRyZWNvcmRzLmZvckVhY2ggKGl0ZW0pLT5cclxuXHRcdFx0cmVjb3JkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpXHJcblxyXG5cdFx0XHRpZiAhcmVjb3JkX29iamVjdFxyXG5cdFx0XHRcdHJldHVyblxyXG5cclxuXHRcdFx0cmVjb3JkX29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpXHJcblxyXG5cdFx0XHRpZiByZWNvcmRfb2JqZWN0ICYmIHJlY29yZF9vYmplY3RfY29sbGVjdGlvblxyXG5cdFx0XHRcdGZpZWxkcyA9IHtfaWQ6IDF9XHJcblxyXG5cdFx0XHRcdGZpZWxkc1tyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSA9IDFcclxuXHJcblx0XHRcdFx0cmVjb3JkID0gcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uLmZpbmRPbmUoaXRlbS5yZWNvcmRfaWRbMF0sIHtmaWVsZHM6IGZpZWxkc30pXHJcblx0XHRcdFx0aWYgcmVjb3JkXHJcblx0XHRcdFx0XHRkYXRhLnB1c2gge19pZDogcmVjb3JkLl9pZCwgX25hbWU6IHJlY29yZFtyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSwgX29iamVjdF9uYW1lOiBpdGVtLm9iamVjdF9uYW1lfVxyXG5cclxuXHRcdHJldHVybiBkYXRhXHJcblxyXG5cdCdvYmplY3RfcmVjb3JkX3NlYXJjaCc6IChvcHRpb25zKS0+XHJcblx0XHRzZWxmID0gdGhpc1xyXG5cclxuXHRcdGRhdGEgPSBuZXcgQXJyYXkoKVxyXG5cclxuXHRcdHNlYXJjaFRleHQgPSBvcHRpb25zLnNlYXJjaFRleHRcclxuXHRcdHNwYWNlID0gb3B0aW9ucy5zcGFjZVxyXG5cclxuXHRcdF8uZm9yRWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChfb2JqZWN0LCBuYW1lKS0+XHJcblx0XHRcdGlmIF9vYmplY3QuZW5hYmxlX3NlYXJjaFxyXG5cdFx0XHRcdG9iamVjdF9yZWNvcmQgPSBzZWFyY2hfb2JqZWN0KHNwYWNlLCBfb2JqZWN0Lm5hbWUsIHNlbGYudXNlcklkLCBzZWFyY2hUZXh0KVxyXG5cdFx0XHRcdGRhdGEgPSBkYXRhLmNvbmNhdChvYmplY3RfcmVjb3JkKVxyXG5cclxuXHRcdHJldHVybiBkYXRhXHJcbiIsInZhciBhc3luY19yZWNlbnRfYWdncmVnYXRlLCByZWNlbnRfYWdncmVnYXRlLCBzZWFyY2hfb2JqZWN0O1xuXG5yZWNlbnRfYWdncmVnYXRlID0gZnVuY3Rpb24oY3JlYXRlZF9ieSwgc3BhY2VJZCwgX3JlY29yZHMsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9yZWNlbnRfdmlld2VkLnJhd0NvbGxlY3Rpb24oKS5hZ2dyZWdhdGUoW1xuICAgIHtcbiAgICAgICRtYXRjaDoge1xuICAgICAgICBjcmVhdGVkX2J5OiBjcmVhdGVkX2J5LFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgICRncm91cDoge1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogXCIkcmVjb3JkLm9cIixcbiAgICAgICAgICByZWNvcmRfaWQ6IFwiJHJlY29yZC5pZHNcIixcbiAgICAgICAgICBzcGFjZTogXCIkc3BhY2VcIlxuICAgICAgICB9LFxuICAgICAgICBtYXhDcmVhdGVkOiB7XG4gICAgICAgICAgJG1heDogXCIkY3JlYXRlZFwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAkc29ydDoge1xuICAgICAgICBtYXhDcmVhdGVkOiAtMVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgICRsaW1pdDogMTBcbiAgICB9XG4gIF0pLnRvQXJyYXkoZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihkb2MpIHtcbiAgICAgIHJldHVybiBfcmVjb3Jkcy5wdXNoKGRvYy5faWQpO1xuICAgIH0pO1xuICAgIGlmIChjYWxsYmFjayAmJiBfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5hc3luY19yZWNlbnRfYWdncmVnYXRlID0gTWV0ZW9yLndyYXBBc3luYyhyZWNlbnRfYWdncmVnYXRlKTtcblxuc2VhcmNoX29iamVjdCA9IGZ1bmN0aW9uKHNwYWNlLCBvYmplY3RfbmFtZSwgdXNlcklkLCBzZWFyY2hUZXh0KSB7XG4gIHZhciBfb2JqZWN0LCBfb2JqZWN0X2NvbGxlY3Rpb24sIF9vYmplY3RfbmFtZV9rZXksIGRhdGEsIGZpZWxkcywgcXVlcnksIHF1ZXJ5X2FuZCwgcmVjb3Jkcywgc2VhcmNoX0tleXdvcmRzO1xuICBkYXRhID0gbmV3IEFycmF5KCk7XG4gIGlmIChzZWFyY2hUZXh0KSB7XG4gICAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBfb2JqZWN0X2NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpO1xuICAgIF9vYmplY3RfbmFtZV9rZXkgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lk5BTUVfRklFTERfS0VZIDogdm9pZCAwO1xuICAgIGlmIChfb2JqZWN0ICYmIF9vYmplY3RfY29sbGVjdGlvbiAmJiBfb2JqZWN0X25hbWVfa2V5KSB7XG4gICAgICBxdWVyeSA9IHt9O1xuICAgICAgc2VhcmNoX0tleXdvcmRzID0gc2VhcmNoVGV4dC5zcGxpdChcIiBcIik7XG4gICAgICBxdWVyeV9hbmQgPSBbXTtcbiAgICAgIHNlYXJjaF9LZXl3b3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKGtleXdvcmQpIHtcbiAgICAgICAgdmFyIHN1YnF1ZXJ5O1xuICAgICAgICBzdWJxdWVyeSA9IHt9O1xuICAgICAgICBzdWJxdWVyeVtfb2JqZWN0X25hbWVfa2V5XSA9IHtcbiAgICAgICAgICAkcmVnZXg6IGtleXdvcmQudHJpbSgpXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBxdWVyeV9hbmQucHVzaChzdWJxdWVyeSk7XG4gICAgICB9KTtcbiAgICAgIHF1ZXJ5LiRhbmQgPSBxdWVyeV9hbmQ7XG4gICAgICBxdWVyeS5zcGFjZSA9IHtcbiAgICAgICAgJGluOiBbc3BhY2VdXG4gICAgICB9O1xuICAgICAgZmllbGRzID0ge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH07XG4gICAgICBmaWVsZHNbX29iamVjdF9uYW1lX2tleV0gPSAxO1xuICAgICAgcmVjb3JkcyA9IF9vYmplY3RfY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCB7XG4gICAgICAgIGZpZWxkczogZmllbGRzLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgbW9kaWZpZWQ6IDFcbiAgICAgICAgfSxcbiAgICAgICAgbGltaXQ6IDVcbiAgICAgIH0pO1xuICAgICAgcmVjb3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICByZXR1cm4gZGF0YS5wdXNoKHtcbiAgICAgICAgICBfaWQ6IHJlY29yZC5faWQsXG4gICAgICAgICAgX25hbWU6IHJlY29yZFtfb2JqZWN0X25hbWVfa2V5XSxcbiAgICAgICAgICBfb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkYXRhO1xufTtcblxuTWV0ZW9yLm1ldGhvZHMoe1xuICAnb2JqZWN0X3JlY2VudF9yZWNvcmQnOiBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIGRhdGEsIHJlY29yZHM7XG4gICAgZGF0YSA9IG5ldyBBcnJheSgpO1xuICAgIHJlY29yZHMgPSBuZXcgQXJyYXkoKTtcbiAgICBhc3luY19yZWNlbnRfYWdncmVnYXRlKHRoaXMudXNlcklkLCBzcGFjZUlkLCByZWNvcmRzKTtcbiAgICByZWNvcmRzLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgdmFyIGZpZWxkcywgcmVjb3JkLCByZWNvcmRfb2JqZWN0LCByZWNvcmRfb2JqZWN0X2NvbGxlY3Rpb247XG4gICAgICByZWNvcmRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoaXRlbS5vYmplY3RfbmFtZSwgaXRlbS5zcGFjZSk7XG4gICAgICBpZiAoIXJlY29yZF9vYmplY3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGl0ZW0ub2JqZWN0X25hbWUsIGl0ZW0uc3BhY2UpO1xuICAgICAgaWYgKHJlY29yZF9vYmplY3QgJiYgcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uKSB7XG4gICAgICAgIGZpZWxkcyA9IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfTtcbiAgICAgICAgZmllbGRzW3JlY29yZF9vYmplY3QuTkFNRV9GSUVMRF9LRVldID0gMTtcbiAgICAgICAgcmVjb3JkID0gcmVjb3JkX29iamVjdF9jb2xsZWN0aW9uLmZpbmRPbmUoaXRlbS5yZWNvcmRfaWRbMF0sIHtcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICAgIHJldHVybiBkYXRhLnB1c2goe1xuICAgICAgICAgICAgX2lkOiByZWNvcmQuX2lkLFxuICAgICAgICAgICAgX25hbWU6IHJlY29yZFtyZWNvcmRfb2JqZWN0Lk5BTUVfRklFTERfS0VZXSxcbiAgICAgICAgICAgIF9vYmplY3RfbmFtZTogaXRlbS5vYmplY3RfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH0sXG4gICdvYmplY3RfcmVjb3JkX3NlYXJjaCc6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgZGF0YSwgc2VhcmNoVGV4dCwgc2VsZiwgc3BhY2U7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgZGF0YSA9IG5ldyBBcnJheSgpO1xuICAgIHNlYXJjaFRleHQgPSBvcHRpb25zLnNlYXJjaFRleHQ7XG4gICAgc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICAgIF8uZm9yRWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKF9vYmplY3QsIG5hbWUpIHtcbiAgICAgIHZhciBvYmplY3RfcmVjb3JkO1xuICAgICAgaWYgKF9vYmplY3QuZW5hYmxlX3NlYXJjaCkge1xuICAgICAgICBvYmplY3RfcmVjb3JkID0gc2VhcmNoX29iamVjdChzcGFjZSwgX29iamVjdC5uYW1lLCBzZWxmLnVzZXJJZCwgc2VhcmNoVGV4dCk7XG4gICAgICAgIHJldHVybiBkYXRhID0gZGF0YS5jb25jYXQob2JqZWN0X3JlY29yZCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuICAgIHVwZGF0ZV9maWx0ZXJzOiAobGlzdHZpZXdfaWQsIGZpbHRlcnMsIGZpbHRlcl9zY29wZSwgZmlsdGVyX2xvZ2ljKS0+XHJcbiAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3RfbGlzdHZpZXdzLmRpcmVjdC51cGRhdGUoe19pZDogbGlzdHZpZXdfaWR9LCB7JHNldDoge2ZpbHRlcnM6IGZpbHRlcnMsIGZpbHRlcl9zY29wZTogZmlsdGVyX3Njb3BlLCBmaWx0ZXJfbG9naWM6IGZpbHRlcl9sb2dpY319KVxyXG5cclxuICAgIHVwZGF0ZV9jb2x1bW5zOiAobGlzdHZpZXdfaWQsIGNvbHVtbnMpLT5cclxuICAgICAgICBjaGVjayhjb2x1bW5zLCBBcnJheSlcclxuICAgICAgICBcclxuICAgICAgICBpZiBjb2x1bW5zLmxlbmd0aCA8IDFcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDAsIFwiU2VsZWN0IGF0IGxlYXN0IG9uZSBmaWVsZCB0byBkaXNwbGF5XCJcclxuICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MudXBkYXRlKHtfaWQ6IGxpc3R2aWV3X2lkfSwgeyRzZXQ6IHtjb2x1bW5zOiBjb2x1bW5zfX0pXHJcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgdXBkYXRlX2ZpbHRlcnM6IGZ1bmN0aW9uKGxpc3R2aWV3X2lkLCBmaWx0ZXJzLCBmaWx0ZXJfc2NvcGUsIGZpbHRlcl9sb2dpYykge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLm9iamVjdF9saXN0dmlld3MuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IGxpc3R2aWV3X2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBmaWx0ZXJzOiBmaWx0ZXJzLFxuICAgICAgICBmaWx0ZXJfc2NvcGU6IGZpbHRlcl9zY29wZSxcbiAgICAgICAgZmlsdGVyX2xvZ2ljOiBmaWx0ZXJfbG9naWNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlX2NvbHVtbnM6IGZ1bmN0aW9uKGxpc3R2aWV3X2lkLCBjb2x1bW5zKSB7XG4gICAgY2hlY2soY29sdW1ucywgQXJyYXkpO1xuICAgIGlmIChjb2x1bW5zLmxlbmd0aCA8IDEpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIlNlbGVjdCBhdCBsZWFzdCBvbmUgZmllbGQgdG8gZGlzcGxheVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X2xpc3R2aWV3cy51cGRhdGUoe1xuICAgICAgX2lkOiBsaXN0dmlld19pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgY29sdW1uczogY29sdW1uc1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0J3JlcG9ydF9kYXRhJzogKG9wdGlvbnMpLT5cclxuXHRcdGNoZWNrKG9wdGlvbnMsIE9iamVjdClcclxuXHRcdHNwYWNlID0gb3B0aW9ucy5zcGFjZVxyXG5cdFx0ZmllbGRzID0gb3B0aW9ucy5maWVsZHNcclxuXHRcdG9iamVjdF9uYW1lID0gb3B0aW9ucy5vYmplY3RfbmFtZVxyXG5cdFx0ZmlsdGVyX3Njb3BlID0gb3B0aW9ucy5maWx0ZXJfc2NvcGVcclxuXHRcdGZpbHRlcnMgPSBvcHRpb25zLmZpbHRlcnNcclxuXHRcdGZpbHRlckZpZWxkcyA9IHt9XHJcblx0XHRjb21wb3VuZEZpZWxkcyA9IFtdXHJcblx0XHRvYmplY3RGaWVsZHMgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk/LmZpZWxkc1xyXG5cdFx0Xy5lYWNoIGZpZWxkcywgKGl0ZW0sIGluZGV4KS0+XHJcblx0XHRcdHNwbGl0cyA9IGl0ZW0uc3BsaXQoXCIuXCIpXHJcblx0XHRcdG5hbWUgPSBzcGxpdHNbMF1cclxuXHRcdFx0b2JqZWN0RmllbGQgPSBvYmplY3RGaWVsZHNbbmFtZV1cclxuXHRcdFx0aWYgc3BsaXRzLmxlbmd0aCA+IDEgYW5kIG9iamVjdEZpZWxkXHJcblx0XHRcdFx0Y2hpbGRLZXkgPSBpdGVtLnJlcGxhY2UgbmFtZSArIFwiLlwiLCBcIlwiXHJcblx0XHRcdFx0Y29tcG91bmRGaWVsZHMucHVzaCh7bmFtZTogbmFtZSwgY2hpbGRLZXk6IGNoaWxkS2V5LCBmaWVsZDogb2JqZWN0RmllbGR9KVxyXG5cdFx0XHRmaWx0ZXJGaWVsZHNbbmFtZV0gPSAxXHJcblxyXG5cdFx0c2VsZWN0b3IgPSB7fVxyXG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcclxuXHRcdHNlbGVjdG9yLnNwYWNlID0gc3BhY2VcclxuXHRcdGlmIGZpbHRlcl9zY29wZSA9PSBcInNwYWNleFwiXHJcblx0XHRcdHNlbGVjdG9yLnNwYWNlID0gXHJcblx0XHRcdFx0JGluOiBbbnVsbCxzcGFjZV1cclxuXHRcdGVsc2UgaWYgZmlsdGVyX3Njb3BlID09IFwibWluZVwiXHJcblx0XHRcdHNlbGVjdG9yLm93bmVyID0gdXNlcklkXHJcblxyXG5cdFx0aWYgQ3JlYXRvci5pc0NvbW1vblNwYWNlKHNwYWNlKSAmJiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZSwgQHVzZXJJZClcclxuXHRcdFx0ZGVsZXRlIHNlbGVjdG9yLnNwYWNlXHJcblxyXG5cdFx0aWYgZmlsdGVycyBhbmQgZmlsdGVycy5sZW5ndGggPiAwXHJcblx0XHRcdHNlbGVjdG9yW1wiJGFuZFwiXSA9IGZpbHRlcnNcclxuXHJcblx0XHRjdXJzb3IgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IsIHtmaWVsZHM6IGZpbHRlckZpZWxkcywgc2tpcDogMCwgbGltaXQ6IDEwMDAwfSlcclxuI1x0XHRpZiBjdXJzb3IuY291bnQoKSA+IDEwMDAwXHJcbiNcdFx0XHRyZXR1cm4gW11cclxuXHRcdHJlc3VsdCA9IGN1cnNvci5mZXRjaCgpXHJcblx0XHRpZiBjb21wb3VuZEZpZWxkcy5sZW5ndGhcclxuXHRcdFx0cmVzdWx0ID0gcmVzdWx0Lm1hcCAoaXRlbSxpbmRleCktPlxyXG5cdFx0XHRcdF8uZWFjaCBjb21wb3VuZEZpZWxkcywgKGNvbXBvdW5kRmllbGRJdGVtLCBpbmRleCktPlxyXG5cdFx0XHRcdFx0aXRlbUtleSA9IGNvbXBvdW5kRmllbGRJdGVtLm5hbWUgKyBcIiolKlwiICsgY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXkucmVwbGFjZSgvXFwuL2csIFwiKiUqXCIpXHJcblx0XHRcdFx0XHRpdGVtVmFsdWUgPSBpdGVtW2NvbXBvdW5kRmllbGRJdGVtLm5hbWVdXHJcblx0XHRcdFx0XHR0eXBlID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQudHlwZVxyXG5cdFx0XHRcdFx0aWYgW1wibG9va3VwXCIsIFwibWFzdGVyX2RldGFpbFwiXS5pbmRleE9mKHR5cGUpID4gLTFcclxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQucmVmZXJlbmNlX3RvXHJcblx0XHRcdFx0XHRcdGNvbXBvdW5kRmlsdGVyRmllbGRzID0ge31cclxuXHRcdFx0XHRcdFx0Y29tcG91bmRGaWx0ZXJGaWVsZHNbY29tcG91bmRGaWVsZEl0ZW0uY2hpbGRLZXldID0gMVxyXG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VJdGVtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bykuZmluZE9uZSB7X2lkOiBpdGVtVmFsdWV9LCBmaWVsZHM6IGNvbXBvdW5kRmlsdGVyRmllbGRzXHJcblx0XHRcdFx0XHRcdGlmIHJlZmVyZW5jZUl0ZW1cclxuXHRcdFx0XHRcdFx0XHRpdGVtW2l0ZW1LZXldID0gcmVmZXJlbmNlSXRlbVtjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV1cclxuXHRcdFx0XHRcdGVsc2UgaWYgdHlwZSA9PSBcInNlbGVjdFwiXHJcblx0XHRcdFx0XHRcdG9wdGlvbnMgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5vcHRpb25zXHJcblx0XHRcdFx0XHRcdGl0ZW1baXRlbUtleV0gPSBfLmZpbmRXaGVyZShvcHRpb25zLCB7dmFsdWU6IGl0ZW1WYWx1ZX0pPy5sYWJlbCBvciBpdGVtVmFsdWVcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IGl0ZW1WYWx1ZVxyXG5cdFx0XHRcdFx0dW5sZXNzIGl0ZW1baXRlbUtleV1cclxuXHRcdFx0XHRcdFx0aXRlbVtpdGVtS2V5XSA9IFwiLS1cIlxyXG5cdFx0XHRcdHJldHVybiBpdGVtXHJcblx0XHRcdHJldHVybiByZXN1bHRcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHJlc3VsdFxyXG5cclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICAncmVwb3J0X2RhdGEnOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGNvbXBvdW5kRmllbGRzLCBjdXJzb3IsIGZpZWxkcywgZmlsdGVyRmllbGRzLCBmaWx0ZXJfc2NvcGUsIGZpbHRlcnMsIG9iamVjdEZpZWxkcywgb2JqZWN0X25hbWUsIHJlZiwgcmVzdWx0LCBzZWxlY3Rvciwgc3BhY2UsIHVzZXJJZDtcbiAgICBjaGVjayhvcHRpb25zLCBPYmplY3QpO1xuICAgIHNwYWNlID0gb3B0aW9ucy5zcGFjZTtcbiAgICBmaWVsZHMgPSBvcHRpb25zLmZpZWxkcztcbiAgICBvYmplY3RfbmFtZSA9IG9wdGlvbnMub2JqZWN0X25hbWU7XG4gICAgZmlsdGVyX3Njb3BlID0gb3B0aW9ucy5maWx0ZXJfc2NvcGU7XG4gICAgZmlsdGVycyA9IG9wdGlvbnMuZmlsdGVycztcbiAgICBmaWx0ZXJGaWVsZHMgPSB7fTtcbiAgICBjb21wb3VuZEZpZWxkcyA9IFtdO1xuICAgIG9iamVjdEZpZWxkcyA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwO1xuICAgIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICB2YXIgY2hpbGRLZXksIG5hbWUsIG9iamVjdEZpZWxkLCBzcGxpdHM7XG4gICAgICBzcGxpdHMgPSBpdGVtLnNwbGl0KFwiLlwiKTtcbiAgICAgIG5hbWUgPSBzcGxpdHNbMF07XG4gICAgICBvYmplY3RGaWVsZCA9IG9iamVjdEZpZWxkc1tuYW1lXTtcbiAgICAgIGlmIChzcGxpdHMubGVuZ3RoID4gMSAmJiBvYmplY3RGaWVsZCkge1xuICAgICAgICBjaGlsZEtleSA9IGl0ZW0ucmVwbGFjZShuYW1lICsgXCIuXCIsIFwiXCIpO1xuICAgICAgICBjb21wb3VuZEZpZWxkcy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgIGNoaWxkS2V5OiBjaGlsZEtleSxcbiAgICAgICAgICBmaWVsZDogb2JqZWN0RmllbGRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmlsdGVyRmllbGRzW25hbWVdID0gMTtcbiAgICB9KTtcbiAgICBzZWxlY3RvciA9IHt9O1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2U7XG4gICAgaWYgKGZpbHRlcl9zY29wZSA9PT0gXCJzcGFjZXhcIikge1xuICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAgICRpbjogW251bGwsIHNwYWNlXVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGZpbHRlcl9zY29wZSA9PT0gXCJtaW5lXCIpIHtcbiAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICAgIH1cbiAgICBpZiAoQ3JlYXRvci5pc0NvbW1vblNwYWNlKHNwYWNlKSAmJiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZSwgdGhpcy51c2VySWQpKSB7XG4gICAgICBkZWxldGUgc2VsZWN0b3Iuc3BhY2U7XG4gICAgfVxuICAgIGlmIChmaWx0ZXJzICYmIGZpbHRlcnMubGVuZ3RoID4gMCkge1xuICAgICAgc2VsZWN0b3JbXCIkYW5kXCJdID0gZmlsdGVycztcbiAgICB9XG4gICAgY3Vyc29yID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yLCB7XG4gICAgICBmaWVsZHM6IGZpbHRlckZpZWxkcyxcbiAgICAgIHNraXA6IDAsXG4gICAgICBsaW1pdDogMTAwMDBcbiAgICB9KTtcbiAgICByZXN1bHQgPSBjdXJzb3IuZmV0Y2goKTtcbiAgICBpZiAoY29tcG91bmRGaWVsZHMubGVuZ3RoKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHQubWFwKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgIF8uZWFjaChjb21wb3VuZEZpZWxkcywgZnVuY3Rpb24oY29tcG91bmRGaWVsZEl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgdmFyIGNvbXBvdW5kRmlsdGVyRmllbGRzLCBpdGVtS2V5LCBpdGVtVmFsdWUsIHJlZjEsIHJlZmVyZW5jZUl0ZW0sIHJlZmVyZW5jZV90bywgdHlwZTtcbiAgICAgICAgICBpdGVtS2V5ID0gY29tcG91bmRGaWVsZEl0ZW0ubmFtZSArIFwiKiUqXCIgKyBjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleS5yZXBsYWNlKC9cXC4vZywgXCIqJSpcIik7XG4gICAgICAgICAgaXRlbVZhbHVlID0gaXRlbVtjb21wb3VuZEZpZWxkSXRlbS5uYW1lXTtcbiAgICAgICAgICB0eXBlID0gY29tcG91bmRGaWVsZEl0ZW0uZmllbGQudHlwZTtcbiAgICAgICAgICBpZiAoW1wibG9va3VwXCIsIFwibWFzdGVyX2RldGFpbFwiXS5pbmRleE9mKHR5cGUpID4gLTEpIHtcbiAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IGNvbXBvdW5kRmllbGRJdGVtLmZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgIGNvbXBvdW5kRmlsdGVyRmllbGRzID0ge307XG4gICAgICAgICAgICBjb21wb3VuZEZpbHRlckZpZWxkc1tjb21wb3VuZEZpZWxkSXRlbS5jaGlsZEtleV0gPSAxO1xuICAgICAgICAgICAgcmVmZXJlbmNlSXRlbSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8pLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IGl0ZW1WYWx1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IGNvbXBvdW5kRmlsdGVyRmllbGRzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyZWZlcmVuY2VJdGVtKSB7XG4gICAgICAgICAgICAgIGl0ZW1baXRlbUtleV0gPSByZWZlcmVuY2VJdGVtW2NvbXBvdW5kRmllbGRJdGVtLmNoaWxkS2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBjb21wb3VuZEZpZWxkSXRlbS5maWVsZC5vcHRpb25zO1xuICAgICAgICAgICAgaXRlbVtpdGVtS2V5XSA9ICgocmVmMSA9IF8uZmluZFdoZXJlKG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgdmFsdWU6IGl0ZW1WYWx1ZVxuICAgICAgICAgICAgfSkpICE9IG51bGwgPyByZWYxLmxhYmVsIDogdm9pZCAwKSB8fCBpdGVtVmFsdWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl0ZW1baXRlbUtleV0gPSBpdGVtVmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghaXRlbVtpdGVtS2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW1baXRlbUtleV0gPSBcIi0tXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG59KTtcbiIsIiMjI1xyXG4gICAgdHlwZTogXCJ1c2VyXCJcclxuICAgIG9iamVjdF9uYW1lOiBcIm9iamVjdF9saXN0dmlld3NcIlxyXG4gICAgcmVjb3JkX2lkOiBcIntvYmplY3RfbmFtZX0se2xpc3R2aWV3X2lkfVwiXHJcbiAgICBzZXR0aW5nczpcclxuICAgICAgICBjb2x1bW5fd2lkdGg6IHsgZmllbGRfYTogMTAwLCBmaWVsZF8yOiAxNTAgfVxyXG4gICAgICAgIHNvcnQ6IFtbXCJmaWVsZF9hXCIsIFwiZGVzY1wiXV1cclxuICAgIG93bmVyOiB7dXNlcklkfVxyXG4jIyNcclxuXHJcbk1ldGVvci5tZXRob2RzXHJcbiAgICBcInRhYnVsYXJfc29ydF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgc29ydCktPlxyXG4gICAgICAgIHVzZXJJZCA9IHRoaXMudXNlcklkXHJcbiAgICAgICAgc2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiLCBvd25lcjogdXNlcklkfSlcclxuICAgICAgICBpZiBzZXR0aW5nXHJcbiAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5zb3J0XCI6IHNvcnR9fSlcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGRvYyA9IFxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJ1c2VyXCJcclxuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxyXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHt9XHJcbiAgICAgICAgICAgICAgICBvd25lcjogdXNlcklkXHJcblxyXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9XHJcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0XHJcblxyXG4gICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmluc2VydChkb2MpXHJcblxyXG4gICAgXCJ0YWJ1bGFyX2NvbHVtbl93aWR0aF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoKS0+XHJcbiAgICAgICAgdXNlcklkID0gdGhpcy51c2VySWRcclxuICAgICAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsIG93bmVyOiB1c2VySWR9KVxyXG4gICAgICAgIGlmIHNldHRpbmdcclxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy51cGRhdGUoe19pZDogc2V0dGluZy5faWR9LCB7JHNldDoge1wic2V0dGluZ3MuI3tsaXN0X3ZpZXdfaWR9LmNvbHVtbl93aWR0aFwiOiBjb2x1bW5fd2lkdGh9fSlcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGRvYyA9IFxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJ1c2VyXCJcclxuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxyXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHt9XHJcbiAgICAgICAgICAgICAgICBvd25lcjogdXNlcklkXHJcblxyXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9XHJcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aFxyXG5cclxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKVxyXG5cclxuICAgIFwiZ3JpZF9zZXR0aW5nc1wiOiAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1uX3dpZHRoLCBzb3J0KS0+XHJcbiAgICAgICAgdXNlcklkID0gdGhpcy51c2VySWRcclxuICAgICAgICBzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfZ3JpZHZpZXdzXCIsIG93bmVyOiB1c2VySWR9KVxyXG4gICAgICAgIGlmIHNldHRpbmdcclxuICAgICAgICAgICAgIyDmr4/mrKHpg73lvLrliLbmlLnlj5hfaWRfYWN0aW9uc+WIl+eahOWuveW6pu+8jOS7peino+WGs+W9k+eUqOaIt+WPquaUueWPmOWtl+auteasoeW6j+iAjOayoeacieaUueWPmOS7u+S9leWtl+auteWuveW6puaXtu+8jOWJjeerr+ayoeacieiuoumYheWIsOWtl+auteasoeW6j+WPmOabtOeahOaVsOaNrueahOmXrumimFxyXG4gICAgICAgICAgICBjb2x1bW5fd2lkdGguX2lkX2FjdGlvbnMgPSBpZiBzZXR0aW5nLnNldHRpbmdzW1wiI3tsaXN0X3ZpZXdfaWR9XCJdPy5jb2x1bW5fd2lkdGg/Ll9pZF9hY3Rpb25zID09IDQ2IHRoZW4gNDcgZWxzZSA0NlxyXG4gICAgICAgICAgICBpZiBzb3J0XHJcbiAgICAgICAgICAgICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7X2lkOiBzZXR0aW5nLl9pZH0sIHskc2V0OiB7XCJzZXR0aW5ncy4je2xpc3Rfdmlld19pZH0uc29ydFwiOiBzb3J0LCBcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5jb2x1bW5fd2lkdGhcIjogY29sdW1uX3dpZHRofX0pXHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtfaWQ6IHNldHRpbmcuX2lkfSwgeyRzZXQ6IHtcInNldHRpbmdzLiN7bGlzdF92aWV3X2lkfS5jb2x1bW5fd2lkdGhcIjogY29sdW1uX3dpZHRofX0pXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBkb2MgPVxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJ1c2VyXCJcclxuICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxyXG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIlxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHt9XHJcbiAgICAgICAgICAgICAgICBvd25lcjogdXNlcklkXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9XHJcbiAgICAgICAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLmNvbHVtbl93aWR0aCA9IGNvbHVtbl93aWR0aFxyXG4gICAgICAgICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5zb3J0ID0gc29ydFxyXG5cclxuICAgICAgICAgICAgQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKSIsIlxuLypcbiAgICB0eXBlOiBcInVzZXJcIlxuICAgIG9iamVjdF9uYW1lOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICAgIHJlY29yZF9pZDogXCJ7b2JqZWN0X25hbWV9LHtsaXN0dmlld19pZH1cIlxuICAgIHNldHRpbmdzOlxuICAgICAgICBjb2x1bW5fd2lkdGg6IHsgZmllbGRfYTogMTAwLCBmaWVsZF8yOiAxNTAgfVxuICAgICAgICBzb3J0OiBbW1wiZmllbGRfYVwiLCBcImRlc2NcIl1dXG4gICAgb3duZXI6IHt1c2VySWR9XG4gKi9cbk1ldGVvci5tZXRob2RzKHtcbiAgXCJ0YWJ1bGFyX3NvcnRfc2V0dGluZ3NcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgc29ydCkge1xuICAgIHZhciBkb2MsIG9iaiwgc2V0dGluZywgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgIG93bmVyOiB1c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc2V0dGluZykge1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgb2JqID0ge30sXG4gICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5zb3J0XCJdID0gc29ydCxcbiAgICAgICAgICBvYmpcbiAgICAgICAgKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYyA9IHtcbiAgICAgICAgdHlwZTogXCJ1c2VyXCIsXG4gICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgICAgc2V0dGluZ3M6IHt9LFxuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0gPSB7fTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdLnNvcnQgPSBzb3J0O1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MuaW5zZXJ0KGRvYyk7XG4gICAgfVxuICB9LFxuICBcInRhYnVsYXJfY29sdW1uX3dpZHRoX3NldHRpbmdzXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbl93aWR0aCkge1xuICAgIHZhciBkb2MsIG9iaiwgc2V0dGluZywgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIixcbiAgICAgIG93bmVyOiB1c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc2V0dGluZykge1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgb2JqID0ge30sXG4gICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5jb2x1bW5fd2lkdGhcIl0gPSBjb2x1bW5fd2lkdGgsXG4gICAgICAgICAgb2JqXG4gICAgICAgIClcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2MgPSB7XG4gICAgICAgIHR5cGU6IFwidXNlclwiLFxuICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCIsXG4gICAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfTtcbiAgICAgIGRvYy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdID0ge307XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXS5jb2x1bW5fd2lkdGggPSBjb2x1bW5fd2lkdGg7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH0sXG4gIFwiZ3JpZF9zZXR0aW5nc1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5fd2lkdGgsIHNvcnQpIHtcbiAgICB2YXIgZG9jLCBvYmosIG9iajEsIHJlZiwgcmVmMSwgc2V0dGluZywgdXNlcklkO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcmVjb3JkX2lkOiBcIm9iamVjdF9ncmlkdmlld3NcIixcbiAgICAgIG93bmVyOiB1c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc2V0dGluZykge1xuICAgICAgY29sdW1uX3dpZHRoLl9pZF9hY3Rpb25zID0gKChyZWYgPSBzZXR0aW5nLnNldHRpbmdzW1wiXCIgKyBsaXN0X3ZpZXdfaWRdKSAhPSBudWxsID8gKHJlZjEgPSByZWYuY29sdW1uX3dpZHRoKSAhPSBudWxsID8gcmVmMS5faWRfYWN0aW9ucyA6IHZvaWQgMCA6IHZvaWQgMCkgPT09IDQ2ID8gNDcgOiA0NjtcbiAgICAgIGlmIChzb3J0KSB7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiBzZXR0aW5nLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDogKFxuICAgICAgICAgICAgb2JqID0ge30sXG4gICAgICAgICAgICBvYmpbXCJzZXR0aW5ncy5cIiArIGxpc3Rfdmlld19pZCArIFwiLnNvcnRcIl0gPSBzb3J0LFxuICAgICAgICAgICAgb2JqW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5jb2x1bW5fd2lkdGhcIl0gPSBjb2x1bW5fd2lkdGgsXG4gICAgICAgICAgICBvYmpcbiAgICAgICAgICApXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuc2V0dGluZ3MudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHNldHRpbmcuX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiAoXG4gICAgICAgICAgICBvYmoxID0ge30sXG4gICAgICAgICAgICBvYmoxW1wic2V0dGluZ3MuXCIgKyBsaXN0X3ZpZXdfaWQgKyBcIi5jb2x1bW5fd2lkdGhcIl0gPSBjb2x1bW5fd2lkdGgsXG4gICAgICAgICAgICBvYmoxXG4gICAgICAgICAgKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZG9jID0ge1xuICAgICAgICB0eXBlOiBcInVzZXJcIixcbiAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2dyaWR2aWV3c1wiLFxuICAgICAgICBzZXR0aW5nczoge30sXG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH07XG4gICAgICBkb2Muc2V0dGluZ3NbbGlzdF92aWV3X2lkXSA9IHt9O1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uY29sdW1uX3dpZHRoID0gY29sdW1uX3dpZHRoO1xuICAgICAgZG9jLnNldHRpbmdzW2xpc3Rfdmlld19pZF0uc29ydCA9IHNvcnQ7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5zZXR0aW5ncy5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH1cbn0pO1xuIiwieG1sMmpzID0gcmVxdWlyZSAneG1sMmpzJ1xyXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xyXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcclxubWtkaXJwID0gcmVxdWlyZSAnbWtkaXJwJ1xyXG5cclxubG9nZ2VyID0gbmV3IExvZ2dlciAnRXhwb3J0X1RPX1hNTCdcclxuXHJcbl93cml0ZVhtbEZpbGUgPSAoanNvbk9iaixvYmpOYW1lKSAtPlxyXG5cdCMg6L2seG1sXHJcblx0YnVpbGRlciA9IG5ldyB4bWwyanMuQnVpbGRlcigpXHJcblx0eG1sID0gYnVpbGRlci5idWlsZE9iamVjdCBqc29uT2JqXHJcblxyXG5cdCMg6L2s5Li6YnVmZmVyXHJcblx0c3RyZWFtID0gbmV3IEJ1ZmZlciB4bWxcclxuXHJcblx0IyDmoLnmja7lvZPlpKnml7bpl7TnmoTlubTmnIjml6XkvZzkuLrlrZjlgqjot6/lvoRcclxuXHRub3cgPSBuZXcgRGF0ZVxyXG5cdHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxyXG5cdG1vbnRoID0gbm93LmdldE1vbnRoKCkgKyAxXHJcblx0ZGF5ID0gbm93LmdldERhdGUoKVxyXG5cclxuXHQjIOaWh+S7tui3r+W+hFxyXG5cdGZpbGVQYXRoID0gcGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwnLi4vLi4vLi4vZXhwb3J0LycgKyB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBkYXkgKyAnLycgKyBvYmpOYW1lIClcclxuXHRmaWxlTmFtZSA9IGpzb25PYmo/Ll9pZCArIFwiLnhtbFwiXHJcblx0ZmlsZUFkZHJlc3MgPSBwYXRoLmpvaW4gZmlsZVBhdGgsIGZpbGVOYW1lXHJcblxyXG5cdGlmICFmcy5leGlzdHNTeW5jIGZpbGVQYXRoXHJcblx0XHRta2RpcnAuc3luYyBmaWxlUGF0aFxyXG5cclxuXHQjIOWGmeWFpeaWh+S7tlxyXG5cdGZzLndyaXRlRmlsZSBmaWxlQWRkcmVzcywgc3RyZWFtLCAoZXJyKSAtPlxyXG5cdFx0aWYgZXJyXHJcblx0XHRcdGxvZ2dlci5lcnJvciBcIiN7anNvbk9iai5faWR95YaZ5YWleG1s5paH5Lu25aSx6LSlXCIsZXJyXHJcblx0XHJcblx0cmV0dXJuIGZpbGVQYXRoXHJcblxyXG5cclxuIyDmlbTnkIZGaWVsZHPnmoRqc29u5pWw5o2uXHJcbl9taXhGaWVsZHNEYXRhID0gKG9iaixvYmpOYW1lKSAtPlxyXG5cdCMg5Yid5aeL5YyW5a+56LGh5pWw5o2uXHJcblx0anNvbk9iaiA9IHt9XHJcblx0IyDojrflj5ZmaWVsZHNcclxuXHRvYmpGaWVsZHMgPSBDcmVhdG9yPy5nZXRPYmplY3Qob2JqTmFtZSk/LmZpZWxkc1xyXG5cclxuXHRtaXhEZWZhdWx0ID0gKGZpZWxkX25hbWUpLT5cclxuXHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBvYmpbZmllbGRfbmFtZV0gfHwgXCJcIlxyXG5cclxuXHRtaXhEYXRlID0gKGZpZWxkX25hbWUsdHlwZSktPlxyXG5cdFx0ZGF0ZSA9IG9ialtmaWVsZF9uYW1lXVxyXG5cdFx0aWYgdHlwZSA9PSBcImRhdGVcIlxyXG5cdFx0XHRmb3JtYXQgPSBcIllZWVktTU0tRERcIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW06c3NcIlxyXG5cdFx0aWYgZGF0ZT8gYW5kIGZvcm1hdD9cclxuXHRcdFx0ZGF0ZVN0ciA9IG1vbWVudChkYXRlKS5mb3JtYXQoZm9ybWF0KVxyXG5cdFx0anNvbk9ialtmaWVsZF9uYW1lXSA9IGRhdGVTdHIgfHwgXCJcIlxyXG5cclxuXHRtaXhCb29sID0gKGZpZWxkX25hbWUpLT5cclxuXHRcdGlmIG9ialtmaWVsZF9uYW1lXSA9PSB0cnVlXHJcblx0XHRcdGpzb25PYmpbZmllbGRfbmFtZV0gPSBcIuaYr1wiXHJcblx0XHRlbHNlIGlmIG9ialtmaWVsZF9uYW1lXSA9PSBmYWxzZVxyXG5cdFx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gXCLlkKZcIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRqc29uT2JqW2ZpZWxkX25hbWVdID0gXCJcIlxyXG5cclxuXHQjIOW+queOr+avj+S4qmZpZWxkcyzlubbliKTmlq3lj5blgLxcclxuXHRfLmVhY2ggb2JqRmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cclxuXHRcdHN3aXRjaCBmaWVsZD8udHlwZVxyXG5cdFx0XHR3aGVuIFwiZGF0ZVwiLFwiZGF0ZXRpbWVcIiB0aGVuIG1peERhdGUgZmllbGRfbmFtZSxmaWVsZC50eXBlXHJcblx0XHRcdHdoZW4gXCJib29sZWFuXCIgdGhlbiBtaXhCb29sIGZpZWxkX25hbWVcclxuXHRcdFx0ZWxzZSBtaXhEZWZhdWx0IGZpZWxkX25hbWVcclxuXHJcblx0cmV0dXJuIGpzb25PYmpcclxuXHJcbiMg6I635Y+W5a2Q6KGo5pW055CG5pWw5o2uXHJcbl9taXhSZWxhdGVkRGF0YSA9IChvYmosb2JqTmFtZSkgLT5cclxuXHQjIOWIneWni+WMluWvueixoeaVsOaNrlxyXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IHt9XHJcblxyXG5cdCMg6I635Y+W55u45YWz6KGoXHJcblx0cmVsYXRlZE9iak5hbWVzID0gQ3JlYXRvcj8uZ2V0QWxsUmVsYXRlZE9iamVjdHMgb2JqTmFtZVxyXG5cclxuXHQjIOW+queOr+ebuOWFs+ihqFxyXG5cdHJlbGF0ZWRPYmpOYW1lcy5mb3JFYWNoIChyZWxhdGVkT2JqTmFtZSkgLT5cclxuXHRcdCMg5q+P5Liq6KGo5a6a5LmJ5LiA5Liq5a+56LGh5pWw57uEXHJcblx0XHRyZWxhdGVkVGFibGVEYXRhID0gW11cclxuXHJcblx0XHQjICrorr7nva7lhbPogZTmkJzntKLmn6Xor6LnmoTlrZfmrrVcclxuXHRcdCMg6ZmE5Lu255qE5YWz6IGU5pCc57Si5a2X5q615piv5a6a5q2755qEXHJcblx0XHRpZiByZWxhdGVkT2JqTmFtZSA9PSBcImNtc19maWxlc1wiXHJcblx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwicGFyZW50Lmlkc1wiXHJcblx0XHRlbHNlXHJcblx0XHRcdCMg6I635Y+WZmllbGRzXHJcblx0XHRcdGZpZWxkcyA9IENyZWF0b3I/Lk9iamVjdHNbcmVsYXRlZE9iak5hbWVdPy5maWVsZHNcclxuXHRcdFx0IyDlvqrnjq/mr4/kuKpmaWVsZCzmib7lh7pyZWZlcmVuY2VfdG/nmoTlhbPogZTlrZfmrrVcclxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gXCJcIlxyXG5cdFx0XHRfLmVhY2ggZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cclxuXHRcdFx0XHRpZiBmaWVsZD8ucmVmZXJlbmNlX3RvID09IG9iak5hbWVcclxuXHRcdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IGZpZWxkX25hbWVcclxuXHJcblx0XHQjIOagueaNruaJvuWHuueahOWFs+iBlOWtl+aute+8jOafpeWtkOihqOaVsOaNrlxyXG5cdFx0aWYgcmVsYXRlZF9maWVsZF9uYW1lXHJcblx0XHRcdHJlbGF0ZWRDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmpOYW1lKVxyXG5cdFx0XHQjIOiOt+WPluWIsOaJgOacieeahOaVsOaNrlxyXG5cdFx0XHRyZWxhdGVkUmVjb3JkTGlzdCA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoe1wiI3tyZWxhdGVkX2ZpZWxkX25hbWV9XCI6b2JqLl9pZH0pLmZldGNoKClcclxuXHRcdFx0IyDlvqrnjq/mr4/kuIDmnaHmlbDmja5cclxuXHRcdFx0cmVsYXRlZFJlY29yZExpc3QuZm9yRWFjaCAocmVsYXRlZE9iaiktPlxyXG5cdFx0XHRcdCMg5pW05ZCIZmllbGRz5pWw5o2uXHJcblx0XHRcdFx0ZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhIHJlbGF0ZWRPYmoscmVsYXRlZE9iak5hbWVcclxuXHRcdFx0XHQjIOaKiuS4gOadoeiusOW9leaPkuWFpeWIsOWvueixoeaVsOe7hOS4rVxyXG5cdFx0XHRcdHJlbGF0ZWRUYWJsZURhdGEucHVzaCBmaWVsZHNEYXRhXHJcblxyXG5cdFx0IyDmiorkuIDkuKrlrZDooajnmoTmiYDmnInmlbDmja7mj5LlhaXliLByZWxhdGVkX29iamVjdHPkuK3vvIzlho3lvqrnjq/kuIvkuIDkuKpcclxuXHRcdHJlbGF0ZWRfb2JqZWN0c1tyZWxhdGVkT2JqTmFtZV0gPSByZWxhdGVkVGFibGVEYXRhXHJcblxyXG5cdHJldHVybiByZWxhdGVkX29iamVjdHNcclxuXHJcbiMgQ3JlYXRvci5FeHBvcnQyeG1sKClcclxuQ3JlYXRvci5FeHBvcnQyeG1sID0gKG9iak5hbWUsIHJlY29yZExpc3QpIC0+XHJcblx0bG9nZ2VyLmluZm8gXCJSdW4gQ3JlYXRvci5FeHBvcnQyeG1sXCJcclxuXHJcblx0Y29uc29sZS50aW1lIFwiQ3JlYXRvci5FeHBvcnQyeG1sXCJcclxuXHJcblx0IyDmtYvor5XmlbDmja5cclxuXHQjIG9iak5hbWUgPSBcImFyY2hpdmVfcmVjb3Jkc1wiXHJcblxyXG5cdCMg5p+l5om+5a+56LGh5pWw5o2uXHJcblx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKVxyXG5cdCMg5rWL6K+V5pWw5o2uXHJcblx0cmVjb3JkTGlzdCA9IGNvbGxlY3Rpb24uZmluZCh7fSkuZmV0Y2goKVxyXG5cclxuXHRyZWNvcmRMaXN0LmZvckVhY2ggKHJlY29yZE9iaiktPlxyXG5cdFx0anNvbk9iaiA9IHt9XHJcblx0XHRqc29uT2JqLl9pZCA9IHJlY29yZE9iai5faWRcclxuXHJcblx0XHQjIOaVtOeQhuS4u+ihqOeahEZpZWxkc+aVsOaNrlxyXG5cdFx0ZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhIHJlY29yZE9iaixvYmpOYW1lXHJcblx0XHRqc29uT2JqW29iak5hbWVdID0gZmllbGRzRGF0YVxyXG5cclxuXHRcdCMg5pW055CG55u45YWz6KGo5pWw5o2uXHJcblx0XHRyZWxhdGVkX29iamVjdHMgPSBfbWl4UmVsYXRlZERhdGEgcmVjb3JkT2JqLG9iak5hbWVcclxuXHJcblx0XHRqc29uT2JqW1wicmVsYXRlZF9vYmplY3RzXCJdID0gcmVsYXRlZF9vYmplY3RzXHJcblxyXG5cdFx0IyDovazkuLp4bWzkv53lrZjmlofku7ZcclxuXHRcdGZpbGVQYXRoID0gX3dyaXRlWG1sRmlsZSBqc29uT2JqLG9iak5hbWVcclxuXHJcblx0Y29uc29sZS50aW1lRW5kIFwiQ3JlYXRvci5FeHBvcnQyeG1sXCJcclxuXHRyZXR1cm4gZmlsZVBhdGgiLCJ2YXIgX21peEZpZWxkc0RhdGEsIF9taXhSZWxhdGVkRGF0YSwgX3dyaXRlWG1sRmlsZSwgZnMsIGxvZ2dlciwgbWtkaXJwLCBwYXRoLCB4bWwyanM7XG5cbnhtbDJqcyA9IHJlcXVpcmUoJ3htbDJqcycpO1xuXG5mcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cbnBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbm1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpO1xuXG5sb2dnZXIgPSBuZXcgTG9nZ2VyKCdFeHBvcnRfVE9fWE1MJyk7XG5cbl93cml0ZVhtbEZpbGUgPSBmdW5jdGlvbihqc29uT2JqLCBvYmpOYW1lKSB7XG4gIHZhciBidWlsZGVyLCBkYXksIGZpbGVBZGRyZXNzLCBmaWxlTmFtZSwgZmlsZVBhdGgsIG1vbnRoLCBub3csIHN0cmVhbSwgeG1sLCB5ZWFyO1xuICBidWlsZGVyID0gbmV3IHhtbDJqcy5CdWlsZGVyKCk7XG4gIHhtbCA9IGJ1aWxkZXIuYnVpbGRPYmplY3QoanNvbk9iaik7XG4gIHN0cmVhbSA9IG5ldyBCdWZmZXIoeG1sKTtcbiAgbm93ID0gbmV3IERhdGU7XG4gIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgbW9udGggPSBub3cuZ2V0TW9udGgoKSArIDE7XG4gIGRheSA9IG5vdy5nZXREYXRlKCk7XG4gIGZpbGVQYXRoID0gcGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwgJy4uLy4uLy4uL2V4cG9ydC8nICsgeWVhciArICcvJyArIG1vbnRoICsgJy8nICsgZGF5ICsgJy8nICsgb2JqTmFtZSk7XG4gIGZpbGVOYW1lID0gKGpzb25PYmogIT0gbnVsbCA/IGpzb25PYmouX2lkIDogdm9pZCAwKSArIFwiLnhtbFwiO1xuICBmaWxlQWRkcmVzcyA9IHBhdGguam9pbihmaWxlUGF0aCwgZmlsZU5hbWUpO1xuICBpZiAoIWZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XG4gICAgbWtkaXJwLnN5bmMoZmlsZVBhdGgpO1xuICB9XG4gIGZzLndyaXRlRmlsZShmaWxlQWRkcmVzcywgc3RyZWFtLCBmdW5jdGlvbihlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICByZXR1cm4gbG9nZ2VyLmVycm9yKGpzb25PYmouX2lkICsgXCLlhpnlhaV4bWzmlofku7blpLHotKVcIiwgZXJyKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmlsZVBhdGg7XG59O1xuXG5fbWl4RmllbGRzRGF0YSA9IGZ1bmN0aW9uKG9iaiwgb2JqTmFtZSkge1xuICB2YXIganNvbk9iaiwgbWl4Qm9vbCwgbWl4RGF0ZSwgbWl4RGVmYXVsdCwgb2JqRmllbGRzLCByZWY7XG4gIGpzb25PYmogPSB7fTtcbiAgb2JqRmllbGRzID0gdHlwZW9mIENyZWF0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgQ3JlYXRvciAhPT0gbnVsbCA/IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmpOYW1lKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIG1peERlZmF1bHQgPSBmdW5jdGlvbihmaWVsZF9uYW1lKSB7XG4gICAgcmV0dXJuIGpzb25PYmpbZmllbGRfbmFtZV0gPSBvYmpbZmllbGRfbmFtZV0gfHwgXCJcIjtcbiAgfTtcbiAgbWl4RGF0ZSA9IGZ1bmN0aW9uKGZpZWxkX25hbWUsIHR5cGUpIHtcbiAgICB2YXIgZGF0ZSwgZGF0ZVN0ciwgZm9ybWF0O1xuICAgIGRhdGUgPSBvYmpbZmllbGRfbmFtZV07XG4gICAgaWYgKHR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICBmb3JtYXQgPSBcIllZWVktTU0tRERcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9ybWF0ID0gXCJZWVlZLU1NLUREIEhIOm1tOnNzXCI7XG4gICAgfVxuICAgIGlmICgoZGF0ZSAhPSBudWxsKSAmJiAoZm9ybWF0ICE9IG51bGwpKSB7XG4gICAgICBkYXRlU3RyID0gbW9tZW50KGRhdGUpLmZvcm1hdChmb3JtYXQpO1xuICAgIH1cbiAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IGRhdGVTdHIgfHwgXCJcIjtcbiAgfTtcbiAgbWl4Qm9vbCA9IGZ1bmN0aW9uKGZpZWxkX25hbWUpIHtcbiAgICBpZiAob2JqW2ZpZWxkX25hbWVdID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5pivXCI7XG4gICAgfSBlbHNlIGlmIChvYmpbZmllbGRfbmFtZV0gPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4ganNvbk9ialtmaWVsZF9uYW1lXSA9IFwi5ZCmXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBqc29uT2JqW2ZpZWxkX25hbWVdID0gXCJcIjtcbiAgICB9XG4gIH07XG4gIF8uZWFjaChvYmpGaWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgc3dpdGNoIChmaWVsZCAhPSBudWxsID8gZmllbGQudHlwZSA6IHZvaWQgMCkge1xuICAgICAgY2FzZSBcImRhdGVcIjpcbiAgICAgIGNhc2UgXCJkYXRldGltZVwiOlxuICAgICAgICByZXR1cm4gbWl4RGF0ZShmaWVsZF9uYW1lLCBmaWVsZC50eXBlKTtcbiAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgIHJldHVybiBtaXhCb29sKGZpZWxkX25hbWUpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG1peERlZmF1bHQoZmllbGRfbmFtZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGpzb25PYmo7XG59O1xuXG5fbWl4UmVsYXRlZERhdGEgPSBmdW5jdGlvbihvYmosIG9iak5hbWUpIHtcbiAgdmFyIHJlbGF0ZWRPYmpOYW1lcywgcmVsYXRlZF9vYmplY3RzO1xuICByZWxhdGVkX29iamVjdHMgPSB7fTtcbiAgcmVsYXRlZE9iak5hbWVzID0gdHlwZW9mIENyZWF0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgQ3JlYXRvciAhPT0gbnVsbCA/IENyZWF0b3IuZ2V0QWxsUmVsYXRlZE9iamVjdHMob2JqTmFtZSkgOiB2b2lkIDA7XG4gIHJlbGF0ZWRPYmpOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKHJlbGF0ZWRPYmpOYW1lKSB7XG4gICAgdmFyIGZpZWxkcywgb2JqMSwgcmVmLCByZWxhdGVkQ29sbGVjdGlvbiwgcmVsYXRlZFJlY29yZExpc3QsIHJlbGF0ZWRUYWJsZURhdGEsIHJlbGF0ZWRfZmllbGRfbmFtZTtcbiAgICByZWxhdGVkVGFibGVEYXRhID0gW107XG4gICAgaWYgKHJlbGF0ZWRPYmpOYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSBcInBhcmVudC5pZHNcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZmllbGRzID0gdHlwZW9mIENyZWF0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgQ3JlYXRvciAhPT0gbnVsbCA/IChyZWYgPSBDcmVhdG9yLk9iamVjdHNbcmVsYXRlZE9iak5hbWVdKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IFwiXCI7XG4gICAgICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgICAgICBpZiAoKGZpZWxkICE9IG51bGwgPyBmaWVsZC5yZWZlcmVuY2VfdG8gOiB2b2lkIDApID09PSBvYmpOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfZmllbGRfbmFtZSA9IGZpZWxkX25hbWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAocmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICByZWxhdGVkQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqTmFtZSk7XG4gICAgICByZWxhdGVkUmVjb3JkTGlzdCA9IHJlbGF0ZWRDb2xsZWN0aW9uLmZpbmQoKFxuICAgICAgICBvYmoxID0ge30sXG4gICAgICAgIG9iajFbXCJcIiArIHJlbGF0ZWRfZmllbGRfbmFtZV0gPSBvYmouX2lkLFxuICAgICAgICBvYmoxXG4gICAgICApKS5mZXRjaCgpO1xuICAgICAgcmVsYXRlZFJlY29yZExpc3QuZm9yRWFjaChmdW5jdGlvbihyZWxhdGVkT2JqKSB7XG4gICAgICAgIHZhciBmaWVsZHNEYXRhO1xuICAgICAgICBmaWVsZHNEYXRhID0gX21peEZpZWxkc0RhdGEocmVsYXRlZE9iaiwgcmVsYXRlZE9iak5hbWUpO1xuICAgICAgICByZXR1cm4gcmVsYXRlZFRhYmxlRGF0YS5wdXNoKGZpZWxkc0RhdGEpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZWxhdGVkX29iamVjdHNbcmVsYXRlZE9iak5hbWVdID0gcmVsYXRlZFRhYmxlRGF0YTtcbiAgfSk7XG4gIHJldHVybiByZWxhdGVkX29iamVjdHM7XG59O1xuXG5DcmVhdG9yLkV4cG9ydDJ4bWwgPSBmdW5jdGlvbihvYmpOYW1lLCByZWNvcmRMaXN0KSB7XG4gIHZhciBjb2xsZWN0aW9uO1xuICBsb2dnZXIuaW5mbyhcIlJ1biBDcmVhdG9yLkV4cG9ydDJ4bWxcIik7XG4gIGNvbnNvbGUudGltZShcIkNyZWF0b3IuRXhwb3J0MnhtbFwiKTtcbiAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmpOYW1lKTtcbiAgcmVjb3JkTGlzdCA9IGNvbGxlY3Rpb24uZmluZCh7fSkuZmV0Y2goKTtcbiAgcmVjb3JkTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHJlY29yZE9iaikge1xuICAgIHZhciBmaWVsZHNEYXRhLCBmaWxlUGF0aCwganNvbk9iaiwgcmVsYXRlZF9vYmplY3RzO1xuICAgIGpzb25PYmogPSB7fTtcbiAgICBqc29uT2JqLl9pZCA9IHJlY29yZE9iai5faWQ7XG4gICAgZmllbGRzRGF0YSA9IF9taXhGaWVsZHNEYXRhKHJlY29yZE9iaiwgb2JqTmFtZSk7XG4gICAganNvbk9ialtvYmpOYW1lXSA9IGZpZWxkc0RhdGE7XG4gICAgcmVsYXRlZF9vYmplY3RzID0gX21peFJlbGF0ZWREYXRhKHJlY29yZE9iaiwgb2JqTmFtZSk7XG4gICAganNvbk9ialtcInJlbGF0ZWRfb2JqZWN0c1wiXSA9IHJlbGF0ZWRfb2JqZWN0cztcbiAgICByZXR1cm4gZmlsZVBhdGggPSBfd3JpdGVYbWxGaWxlKGpzb25PYmosIG9iak5hbWUpO1xuICB9KTtcbiAgY29uc29sZS50aW1lRW5kKFwiQ3JlYXRvci5FeHBvcnQyeG1sXCIpO1xuICByZXR1cm4gZmlsZVBhdGg7XG59O1xuIiwiTWV0ZW9yLm1ldGhvZHMgXHJcblx0cmVsYXRlZF9vYmplY3RzX3JlY29yZHM6IChvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpLT5cclxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXHJcblx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIlxyXG5cdFx0XHRzZWxlY3RvciA9IHtcIm1ldGFkYXRhLnNwYWNlXCI6IHNwYWNlSWR9XHJcblx0XHRlbHNlXHJcblx0XHRcdHNlbGVjdG9yID0ge3NwYWNlOiBzcGFjZUlkfVxyXG5cdFx0XHJcblx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcclxuXHRcdFx0IyDpmYTku7bnmoTlhbPogZTmkJzntKLmnaHku7bmmK/lrprmrbvnmoRcclxuXHRcdFx0c2VsZWN0b3JbXCJwYXJlbnQub1wiXSA9IG9iamVjdF9uYW1lXHJcblx0XHRcdHNlbGVjdG9yW1wicGFyZW50Lmlkc1wiXSA9IFtyZWNvcmRfaWRdXHJcblx0XHRlbHNlXHJcblx0XHRcdHNlbGVjdG9yW3JlbGF0ZWRfZmllbGRfbmFtZV0gPSByZWNvcmRfaWRcclxuXHJcblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxyXG5cdFx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcclxuXHRcdFx0c2VsZWN0b3Iub3duZXIgPSB1c2VySWRcclxuXHRcdFxyXG5cdFx0cmVsYXRlZF9yZWNvcmRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpXHJcblx0XHRyZXR1cm4gcmVsYXRlZF9yZWNvcmRzLmNvdW50KCkiLCJNZXRlb3IubWV0aG9kcyh7XG4gIHJlbGF0ZWRfb2JqZWN0c19yZWNvcmRzOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVsYXRlZF9vYmplY3RfbmFtZSwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWNvcmRfaWQsIHNwYWNlSWQpIHtcbiAgICB2YXIgcGVybWlzc2lvbnMsIHJlbGF0ZWRfcmVjb3Jkcywgc2VsZWN0b3IsIHVzZXJJZDtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiKSB7XG4gICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgXCJtZXRhZGF0YS5zcGFjZVwiOiBzcGFjZUlkXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgICBzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWU7XG4gICAgICBzZWxlY3RvcltcInBhcmVudC5pZHNcIl0gPSBbcmVjb3JkX2lkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZDtcbiAgICB9XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy5hbGxvd1JlYWQpIHtcbiAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICAgIH1cbiAgICByZWxhdGVkX3JlY29yZHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkuZmluZChzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlbGF0ZWRfcmVjb3Jkcy5jb3VudCgpO1xuICB9XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoIFwiY3JlYXRvcl9vYmplY3RfcmVjb3JkXCIsIChvYmplY3RfbmFtZSwgaWQsIHNwYWNlX2lkKS0+XHJcblx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpXHJcblx0aWYgY29sbGVjdGlvblxyXG5cdFx0cmV0dXJuIGNvbGxlY3Rpb24uZmluZCh7X2lkOiBpZH0pXHJcblxyXG4iLCJNZXRlb3IucHVibGlzaChcImNyZWF0b3Jfb2JqZWN0X3JlY29yZFwiLCBmdW5jdGlvbihvYmplY3RfbmFtZSwgaWQsIHNwYWNlX2lkKSB7XG4gIHZhciBjb2xsZWN0aW9uO1xuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCk7XG4gIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICBfaWQ6IGlkXG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUgXCJzdGVlZG9zX29iamVjdF90YWJ1bGFyXCIsICh0YWJsZU5hbWUsIGlkcywgZmllbGRzLCBzcGFjZUlkKS0+XHJcblx0dW5sZXNzIHRoaXMudXNlcklkXHJcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdGNoZWNrKHRhYmxlTmFtZSwgU3RyaW5nKTtcclxuXHRjaGVjayhpZHMsIEFycmF5KTtcclxuXHRjaGVjayhmaWVsZHMsIE1hdGNoLk9wdGlvbmFsKE9iamVjdCkpO1xyXG5cclxuXHRfb2JqZWN0X25hbWUgPSB0YWJsZU5hbWUucmVwbGFjZShcImNyZWF0b3JfXCIsXCJcIilcclxuXHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX29iamVjdF9uYW1lLCBzcGFjZUlkKVxyXG5cclxuXHRpZiBzcGFjZUlkXHJcblx0XHRfb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldE9iamVjdE5hbWUoX29iamVjdClcclxuXHJcblx0b2JqZWN0X2NvbGxlY2l0b24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oX29iamVjdF9uYW1lKVxyXG5cclxuXHJcblx0X2ZpZWxkcyA9IF9vYmplY3Q/LmZpZWxkc1xyXG5cdGlmICFfZmllbGRzIHx8ICFvYmplY3RfY29sbGVjaXRvblxyXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRyZWZlcmVuY2VfZmllbGRzID0gXy5maWx0ZXIgX2ZpZWxkcywgKGYpLT5cclxuXHRcdHJldHVybiBfLmlzRnVuY3Rpb24oZi5yZWZlcmVuY2VfdG8pIHx8ICFfLmlzRW1wdHkoZi5yZWZlcmVuY2VfdG8pXHJcblxyXG5cdHNlbGYgPSB0aGlzXHJcblxyXG5cdHNlbGYudW5ibG9jaygpO1xyXG5cclxuXHRpZiByZWZlcmVuY2VfZmllbGRzLmxlbmd0aCA+IDBcclxuXHRcdGRhdGEgPSB7XHJcblx0XHRcdGZpbmQ6ICgpLT5cclxuXHRcdFx0XHRzZWxmLnVuYmxvY2soKTtcclxuXHRcdFx0XHRmaWVsZF9rZXlzID0ge31cclxuXHRcdFx0XHRfLmVhY2ggXy5rZXlzKGZpZWxkcyksIChmKS0+XHJcblx0XHRcdFx0XHR1bmxlc3MgL1xcdysoXFwuXFwkKXsxfVxcdz8vLnRlc3QoZilcclxuXHRcdFx0XHRcdFx0ZmllbGRfa2V5c1tmXSA9IDFcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRyZXR1cm4gb2JqZWN0X2NvbGxlY2l0b24uZmluZCh7X2lkOiB7JGluOiBpZHN9fSwge2ZpZWxkczogZmllbGRfa2V5c30pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGRhdGEuY2hpbGRyZW4gPSBbXVxyXG5cclxuXHRcdGtleXMgPSBfLmtleXMoZmllbGRzKVxyXG5cclxuXHRcdGlmIGtleXMubGVuZ3RoIDwgMVxyXG5cdFx0XHRrZXlzID0gXy5rZXlzKF9maWVsZHMpXHJcblxyXG5cdFx0X2tleXMgPSBbXVxyXG5cclxuXHRcdGtleXMuZm9yRWFjaCAoa2V5KS0+XHJcblx0XHRcdGlmIF9vYmplY3Quc2NoZW1hLl9vYmplY3RLZXlzW2tleSArICcuJ11cclxuXHRcdFx0XHRfa2V5cyA9IF9rZXlzLmNvbmNhdChfLm1hcChfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddLCAoayktPlxyXG5cdFx0XHRcdFx0cmV0dXJuIGtleSArICcuJyArIGtcclxuXHRcdFx0XHQpKVxyXG5cdFx0XHRfa2V5cy5wdXNoKGtleSlcclxuXHJcblx0XHRfa2V5cy5mb3JFYWNoIChrZXkpLT5cclxuXHRcdFx0cmVmZXJlbmNlX2ZpZWxkID0gX2ZpZWxkc1trZXldXHJcblxyXG5cdFx0XHRpZiByZWZlcmVuY2VfZmllbGQgJiYgKF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KHJlZmVyZW5jZV9maWVsZC5yZWZlcmVuY2VfdG8pKSAgIyBhbmQgQ3JlYXRvci5Db2xsZWN0aW9uc1tyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvXVxyXG5cdFx0XHRcdGRhdGEuY2hpbGRyZW4ucHVzaCB7XHJcblx0XHRcdFx0XHRmaW5kOiAocGFyZW50KSAtPlxyXG5cdFx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0XHRzZWxmLnVuYmxvY2soKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0cXVlcnkgPSB7fVxyXG5cclxuXHRcdFx0XHRcdFx0XHQjIOihqOagvOWtkOWtl+auteeJueauiuWkhOeQhlxyXG5cdFx0XHRcdFx0XHRcdGlmIC9cXHcrKFxcLlxcJFxcLil7MX1cXHcrLy50ZXN0KGtleSlcclxuXHRcdFx0XHRcdFx0XHRcdHBfayA9IGtleS5yZXBsYWNlKC8oXFx3KylcXC5cXCRcXC5cXHcrL2lnLCBcIiQxXCIpXHJcblx0XHRcdFx0XHRcdFx0XHRzX2sgPSBrZXkucmVwbGFjZSgvXFx3K1xcLlxcJFxcLihcXHcrKS9pZywgXCIkMVwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlX2lkcyA9IHBhcmVudFtwX2tdLmdldFByb3BlcnR5KHNfaylcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfaWRzID0ga2V5LnNwbGl0KCcuJykucmVkdWNlIChvLCB4KSAtPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG8/W3hdXHJcblx0XHRcdFx0XHRcdFx0XHQsIHBhcmVudFxyXG5cclxuXHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvXHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8oKVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkocmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgXy5pc09iamVjdChyZWZlcmVuY2VfaWRzKSAmJiAhXy5pc0FycmF5KHJlZmVyZW5jZV9pZHMpXHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV9pZHMub1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VfaWRzID0gcmVmZXJlbmNlX2lkcy5pZHMgfHwgW11cclxuXHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFtdXHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShyZWZlcmVuY2VfaWRzKVxyXG5cdFx0XHRcdFx0XHRcdFx0cXVlcnkuX2lkID0geyRpbjogcmVmZXJlbmNlX2lkc31cclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRxdWVyeS5faWQgPSByZWZlcmVuY2VfaWRzXHJcblxyXG5cdFx0XHRcdFx0XHRcdHJlZmVyZW5jZV90b19vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWZlcmVuY2VfdG8sIHNwYWNlSWQpXHJcblxyXG5cdFx0XHRcdFx0XHRcdG5hbWVfZmllbGRfa2V5ID0gcmVmZXJlbmNlX3RvX29iamVjdC5OQU1FX0ZJRUxEX0tFWVxyXG5cclxuXHRcdFx0XHRcdFx0XHRjaGlsZHJlbl9maWVsZHMgPSB7X2lkOiAxLCBzcGFjZTogMX1cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgbmFtZV9maWVsZF9rZXlcclxuXHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuX2ZpZWxkc1tuYW1lX2ZpZWxkX2tleV0gPSAxXHJcblxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvLCBzcGFjZUlkKS5maW5kKHF1ZXJ5LCB7XHJcblx0XHRcdFx0XHRcdFx0XHRmaWVsZHM6IGNoaWxkcmVuX2ZpZWxkc1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2cocmVmZXJlbmNlX3RvLCBwYXJlbnQsIGUpXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFtdXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZmluZDogKCktPlxyXG5cdFx0XHRcdHNlbGYudW5ibG9jaygpO1xyXG5cdFx0XHRcdHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtfaWQ6IHskaW46IGlkc319LCB7ZmllbGRzOiBmaWVsZHN9KVxyXG5cdFx0fTtcclxuXHJcbiIsIk1ldGVvci5wdWJsaXNoQ29tcG9zaXRlKFwic3RlZWRvc19vYmplY3RfdGFidWxhclwiLCBmdW5jdGlvbih0YWJsZU5hbWUsIGlkcywgZmllbGRzLCBzcGFjZUlkKSB7XG4gIHZhciBfZmllbGRzLCBfa2V5cywgX29iamVjdCwgX29iamVjdF9uYW1lLCBkYXRhLCBrZXlzLCBvYmplY3RfY29sbGVjaXRvbiwgcmVmZXJlbmNlX2ZpZWxkcywgc2VsZjtcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgY2hlY2sodGFibGVOYW1lLCBTdHJpbmcpO1xuICBjaGVjayhpZHMsIEFycmF5KTtcbiAgY2hlY2soZmllbGRzLCBNYXRjaC5PcHRpb25hbChPYmplY3QpKTtcbiAgX29iamVjdF9uYW1lID0gdGFibGVOYW1lLnJlcGxhY2UoXCJjcmVhdG9yX1wiLCBcIlwiKTtcbiAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9vYmplY3RfbmFtZSwgc3BhY2VJZCk7XG4gIGlmIChzcGFjZUlkKSB7XG4gICAgX29iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRPYmplY3ROYW1lKF9vYmplY3QpO1xuICB9XG4gIG9iamVjdF9jb2xsZWNpdG9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKF9vYmplY3RfbmFtZSk7XG4gIF9maWVsZHMgPSBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmZpZWxkcyA6IHZvaWQgMDtcbiAgaWYgKCFfZmllbGRzIHx8ICFvYmplY3RfY29sbGVjaXRvbikge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmVmZXJlbmNlX2ZpZWxkcyA9IF8uZmlsdGVyKF9maWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKGYucmVmZXJlbmNlX3RvKSB8fCAhXy5pc0VtcHR5KGYucmVmZXJlbmNlX3RvKTtcbiAgfSk7XG4gIHNlbGYgPSB0aGlzO1xuICBzZWxmLnVuYmxvY2soKTtcbiAgaWYgKHJlZmVyZW5jZV9maWVsZHMubGVuZ3RoID4gMCkge1xuICAgIGRhdGEgPSB7XG4gICAgICBmaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZpZWxkX2tleXM7XG4gICAgICAgIHNlbGYudW5ibG9jaygpO1xuICAgICAgICBmaWVsZF9rZXlzID0ge307XG4gICAgICAgIF8uZWFjaChfLmtleXMoZmllbGRzKSwgZnVuY3Rpb24oZikge1xuICAgICAgICAgIGlmICghL1xcdysoXFwuXFwkKXsxfVxcdz8vLnRlc3QoZikpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZF9rZXlzW2ZdID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb2JqZWN0X2NvbGxlY2l0b24uZmluZCh7XG4gICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAkaW46IGlkc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogZmllbGRfa2V5c1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGRhdGEuY2hpbGRyZW4gPSBbXTtcbiAgICBrZXlzID0gXy5rZXlzKGZpZWxkcyk7XG4gICAgaWYgKGtleXMubGVuZ3RoIDwgMSkge1xuICAgICAga2V5cyA9IF8ua2V5cyhfZmllbGRzKTtcbiAgICB9XG4gICAgX2tleXMgPSBbXTtcbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoX29iamVjdC5zY2hlbWEuX29iamVjdEtleXNba2V5ICsgJy4nXSkge1xuICAgICAgICBfa2V5cyA9IF9rZXlzLmNvbmNhdChfLm1hcChfb2JqZWN0LnNjaGVtYS5fb2JqZWN0S2V5c1trZXkgKyAnLiddLCBmdW5jdGlvbihrKSB7XG4gICAgICAgICAgcmV0dXJuIGtleSArICcuJyArIGs7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfa2V5cy5wdXNoKGtleSk7XG4gICAgfSk7XG4gICAgX2tleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciByZWZlcmVuY2VfZmllbGQ7XG4gICAgICByZWZlcmVuY2VfZmllbGQgPSBfZmllbGRzW2tleV07XG4gICAgICBpZiAocmVmZXJlbmNlX2ZpZWxkICYmIChfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bykgfHwgIV8uaXNFbXB0eShyZWZlcmVuY2VfZmllbGQucmVmZXJlbmNlX3RvKSkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuY2hpbGRyZW4ucHVzaCh7XG4gICAgICAgICAgZmluZDogZnVuY3Rpb24ocGFyZW50KSB7XG4gICAgICAgICAgICB2YXIgY2hpbGRyZW5fZmllbGRzLCBlLCBuYW1lX2ZpZWxkX2tleSwgcF9rLCBxdWVyeSwgcmVmZXJlbmNlX2lkcywgcmVmZXJlbmNlX3RvLCByZWZlcmVuY2VfdG9fb2JqZWN0LCBzX2s7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBzZWxmLnVuYmxvY2soKTtcbiAgICAgICAgICAgICAgcXVlcnkgPSB7fTtcbiAgICAgICAgICAgICAgaWYgKC9cXHcrKFxcLlxcJFxcLil7MX1cXHcrLy50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICBwX2sgPSBrZXkucmVwbGFjZSgvKFxcdyspXFwuXFwkXFwuXFx3Ky9pZywgXCIkMVwiKTtcbiAgICAgICAgICAgICAgICBzX2sgPSBrZXkucmVwbGFjZSgvXFx3K1xcLlxcJFxcLihcXHcrKS9pZywgXCIkMVwiKTtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VfaWRzID0gcGFyZW50W3Bfa10uZ2V0UHJvcGVydHkoc19rKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VfaWRzID0ga2V5LnNwbGl0KCcuJykucmVkdWNlKGZ1bmN0aW9uKG8sIHgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBvICE9IG51bGwgPyBvW3hdIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgIH0sIHBhcmVudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX2ZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKF8uaXNBcnJheShyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QocmVmZXJlbmNlX2lkcykgJiYgIV8uaXNBcnJheShyZWZlcmVuY2VfaWRzKSkge1xuICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX2lkcy5vO1xuICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlX2lkcyA9IHJlZmVyZW5jZV9pZHMuaWRzIHx8IFtdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChfLmlzQXJyYXkocmVmZXJlbmNlX2lkcykpIHtcbiAgICAgICAgICAgICAgICBxdWVyeS5faWQgPSB7XG4gICAgICAgICAgICAgICAgICAkaW46IHJlZmVyZW5jZV9pZHNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHF1ZXJ5Ll9pZCA9IHJlZmVyZW5jZV9pZHM7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVmZXJlbmNlX3RvX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlZmVyZW5jZV90bywgc3BhY2VJZCk7XG4gICAgICAgICAgICAgIG5hbWVfZmllbGRfa2V5ID0gcmVmZXJlbmNlX3RvX29iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgICAgICAgICAgICAgY2hpbGRyZW5fZmllbGRzID0ge1xuICAgICAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgICAgICBzcGFjZTogMVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBpZiAobmFtZV9maWVsZF9rZXkpIHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbl9maWVsZHNbbmFtZV9maWVsZF9rZXldID0gMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZChxdWVyeSwge1xuICAgICAgICAgICAgICAgIGZpZWxkczogY2hpbGRyZW5fZmllbGRzXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZWZlcmVuY2VfdG8sIHBhcmVudCwgZSk7XG4gICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBmaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICAgIHJldHVybiBvYmplY3RfY29sbGVjaXRvbi5maW5kKHtcbiAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICRpbjogaWRzXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBmaWVsZHNcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufSk7XG4iLCJNZXRlb3IucHVibGlzaCBcIm9iamVjdF9saXN0dmlld3NcIiwgKG9iamVjdF9uYW1lLCBzcGFjZUlkKS0+XHJcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZFxyXG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBzcGFjZTogc3BhY2VJZCAsXCIkb3JcIjpbe293bmVyOiB1c2VySWR9LCB7c2hhcmVkOiB0cnVlfV19KSIsIk1ldGVvci5wdWJsaXNoIFwidXNlcl90YWJ1bGFyX3NldHRpbmdzXCIsIChvYmplY3RfbmFtZSktPlxyXG4gICAgdXNlcklkID0gdGhpcy51c2VySWRcclxuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zLnNldHRpbmdzLmZpbmQoe29iamVjdF9uYW1lOiB7JGluOiBvYmplY3RfbmFtZX0sIHJlY29yZF9pZDogeyRpbjogW1wib2JqZWN0X2xpc3R2aWV3c1wiLCBcIm9iamVjdF9ncmlkdmlld3NcIl19LCBvd25lcjogdXNlcklkfSlcclxuIiwiTWV0ZW9yLnB1Ymxpc2ggXCJyZWxhdGVkX29iamVjdHNfcmVjb3Jkc1wiLCAob2JqZWN0X25hbWUsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZUlkKS0+XHJcblx0dXNlcklkID0gdGhpcy51c2VySWRcclxuXHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIlxyXG5cdFx0c2VsZWN0b3IgPSB7XCJtZXRhZGF0YS5zcGFjZVwiOiBzcGFjZUlkfVxyXG5cdGVsc2VcclxuXHRcdHNlbGVjdG9yID0ge3NwYWNlOiBzcGFjZUlkfVxyXG5cdFxyXG5cdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxyXG5cdFx0IyDpmYTku7bnmoTlhbPogZTmkJzntKLmnaHku7bmmK/lrprmrbvnmoRcclxuXHRcdHNlbGVjdG9yW1wicGFyZW50Lm9cIl0gPSBvYmplY3RfbmFtZVxyXG5cdFx0c2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF1cclxuXHRlbHNlXHJcblx0XHRzZWxlY3RvcltyZWxhdGVkX2ZpZWxkX25hbWVdID0gcmVjb3JkX2lkXHJcblxyXG5cdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXHJcblx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcclxuXHRcdHNlbGVjdG9yLm93bmVyID0gdXNlcklkXHJcblx0XHJcblx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKS5maW5kKHNlbGVjdG9yKSIsIk1ldGVvci5wdWJsaXNoKFwicmVsYXRlZF9vYmplY3RzX3JlY29yZHNcIiwgZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVjb3JkX2lkLCBzcGFjZUlkKSB7XG4gIHZhciBwZXJtaXNzaW9ucywgc2VsZWN0b3IsIHVzZXJJZDtcbiAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpIHtcbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIFwibWV0YWRhdGEuc3BhY2VcIjogc3BhY2VJZFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH07XG4gIH1cbiAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICBzZWxlY3RvcltcInBhcmVudC5vXCJdID0gb2JqZWN0X25hbWU7XG4gICAgc2VsZWN0b3JbXCJwYXJlbnQuaWRzXCJdID0gW3JlY29yZF9pZF07XG4gIH0gZWxzZSB7XG4gICAgc2VsZWN0b3JbcmVsYXRlZF9maWVsZF9uYW1lXSA9IHJlY29yZF9pZDtcbiAgfVxuICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy5hbGxvd1JlYWQpIHtcbiAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZDtcbiAgfVxuICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpLmZpbmQoc2VsZWN0b3IpO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCAnc3BhY2VfdXNlcl9pbmZvJywgKHNwYWNlSWQsIHVzZXJJZCktPlxyXG5cdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSkiLCJcclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblxyXG5cdE1ldGVvci5wdWJsaXNoICdjb250YWN0c192aWV3X2xpbWl0cycsIChzcGFjZUlkKS0+XHJcblxyXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXHJcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0XHR1bmxlc3Mgc3BhY2VJZFxyXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdFx0c2VsZWN0b3IgPVxyXG5cdFx0XHRzcGFjZTogc3BhY2VJZFxyXG5cdFx0XHRrZXk6ICdjb250YWN0c192aWV3X2xpbWl0cydcclxuXHJcblx0XHRyZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3RvcikiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdjb250YWN0c192aWV3X2xpbWl0cycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAga2V5OiAnY29udGFjdHNfdmlld19saW1pdHMnXG4gICAgfTtcbiAgICByZXR1cm4gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZChzZWxlY3Rvcik7XG4gIH0pO1xufVxuIiwiXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cclxuXHRNZXRlb3IucHVibGlzaCAnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnLCAoc3BhY2VJZCktPlxyXG5cclxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxyXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdFx0dW5sZXNzIHNwYWNlSWRcclxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRcdHNlbGVjdG9yID1cclxuXHRcdFx0c3BhY2U6IHNwYWNlSWRcclxuXHRcdFx0a2V5OiAnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnXHJcblxyXG5cdFx0cmV0dXJuIGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoc2VsZWN0b3IpIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnMnLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIHNlbGVjdG9yO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIGtleTogJ2NvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzJ1xuICAgIH07XG4gICAgcmV0dXJuIGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoc2VsZWN0b3IpO1xuICB9KTtcbn1cbiIsInBlcm1pc3Npb25NYW5hZ2VyID0ge31cclxuXHJcbnBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyA9IChmbG93X2lkLCB1c2VyX2lkKSAtPlxyXG5cdCMg5qC55o2uOmZsb3dfaWTmn6XliLDlr7nlupTnmoRmbG93XHJcblx0ZmxvdyA9IHV1Zmxvd01hbmFnZXIuZ2V0RmxvdyhmbG93X2lkKVxyXG5cdHNwYWNlX2lkID0gZmxvdy5zcGFjZVxyXG5cdCMg5qC55o2uc3BhY2VfaWTlkow6dXNlcl9pZOWIsG9yZ2FuaXphdGlvbnPooajkuK3mn6XliLDnlKjmiLfmiYDlsZ7miYDmnInnmoRvcmdfaWTvvIjljIXmi6zkuIrnuqfnu4RJRO+8iVxyXG5cdG9yZ19pZHMgPSBuZXcgQXJyYXlcclxuXHRvcmdhbml6YXRpb25zID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcclxuXHRcdHNwYWNlOiBzcGFjZV9pZCwgdXNlcnM6IHVzZXJfaWQgfSwgeyBmaWVsZHM6IHsgcGFyZW50czogMSB9IH0pLmZldGNoKClcclxuXHRfLmVhY2gob3JnYW5pemF0aW9ucywgKG9yZykgLT5cclxuXHRcdG9yZ19pZHMucHVzaChvcmcuX2lkKVxyXG5cdFx0aWYgb3JnLnBhcmVudHNcclxuXHRcdFx0Xy5lYWNoKG9yZy5wYXJlbnRzLCAocGFyZW50X2lkKSAtPlxyXG5cdFx0XHRcdG9yZ19pZHMucHVzaChwYXJlbnRfaWQpXHJcblx0XHRcdClcclxuXHQpXHJcblx0b3JnX2lkcyA9IF8udW5pcShvcmdfaWRzKVxyXG5cdG15X3Blcm1pc3Npb25zID0gbmV3IEFycmF5XHJcblx0aWYgZmxvdy5wZXJtc1xyXG5cdFx0IyDliKTmlq1mbG93LnBlcm1zLnVzZXJzX2Nhbl9hZG1pbuS4reaYr+WQpuWMheWQq+W9k+WJjeeUqOaIt++8jFxyXG5cdFx0IyDmiJbogIVmbG93LnBlcm1zLm9yZ3NfY2FuX2FkZOaYr+WQpuWMheWQqzTmraXlvpfliLDnmoRvcmdfaWTmlbDnu4TkuK3nmoTku7vkvZXkuIDkuKrvvIxcclxuXHRcdCMg6Iul5piv77yM5YiZ5Zyo6L+U5Zue55qE5pWw57uE5Lit5Yqg5LiKYWRkXHJcblx0XHRpZiBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGRcclxuXHRcdFx0dXNlcnNfY2FuX2FkZCA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkZFxyXG5cdFx0XHRpZiB1c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJfaWQpXHJcblx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKVxyXG5cclxuXHRcdGlmIGZsb3cucGVybXMub3Jnc19jYW5fYWRkXHJcblx0XHRcdG9yZ3NfY2FuX2FkZCA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRkXHJcblx0XHRcdF8uZWFjaChvcmdfaWRzLCAob3JnX2lkKSAtPlxyXG5cdFx0XHRcdGlmIG9yZ3NfY2FuX2FkZC5pbmNsdWRlcyhvcmdfaWQpXHJcblx0XHRcdFx0XHRteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpXHJcblx0XHRcdClcclxuXHRcdCMg5Yik5patZmxvdy5wZXJtcy51c2Vyc19jYW5fbW9uaXRvcuS4reaYr+WQpuWMheWQq+W9k+WJjeeUqOaIt++8jFxyXG5cdFx0IyDmiJbogIVmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3LmmK/lkKbljIXlkKs05q2l5b6X5Yiw55qEb3JnX2lk5pWw57uE5Lit55qE5Lu75L2V5LiA5Liq77yMXHJcblx0XHQjIOiLpeaYr++8jOWImeWcqOi/lOWbnueahOaVsOe7hOS4reWKoOS4im1vbml0b3JcclxuXHRcdGlmIGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3JcclxuXHRcdFx0dXNlcnNfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yXHJcblx0XHRcdGlmIHVzZXJzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKHVzZXJfaWQpXHJcblx0XHRcdFx0bXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIilcclxuXHJcblx0XHRpZiBmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3JcclxuXHRcdFx0b3Jnc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMub3Jnc19jYW5fbW9uaXRvclxyXG5cdFx0XHRfLmVhY2gob3JnX2lkcywgKG9yZ19pZCkgLT5cclxuXHRcdFx0XHRpZiBvcmdzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKG9yZ19pZClcclxuXHRcdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJtb25pdG9yXCIpXHJcblx0XHRcdClcclxuXHRcdCMg5Yik5patZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW7kuK3mmK/lkKbljIXlkKvlvZPliY3nlKjmiLfvvIxcclxuXHRcdCMg5oiW6ICFZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZG1pbuaYr+WQpuWMheWQqzTmraXlvpfliLDnmoRvcmdfaWTmlbDnu4TkuK3nmoTku7vkvZXkuIDkuKrvvIxcclxuXHRcdCMg6Iul5piv77yM5YiZ5Zyo6L+U5Zue55qE5pWw57uE5Lit5Yqg5LiKYWRtaW5cclxuXHRcdGlmIGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluXHJcblx0XHRcdHVzZXJzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluXHJcblx0XHRcdGlmIHVzZXJzX2Nhbl9hZG1pbi5pbmNsdWRlcyh1c2VyX2lkKVxyXG5cdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKVxyXG5cclxuXHRcdGlmIGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW5cclxuXHRcdFx0b3Jnc19jYW5fYWRtaW4gPSBmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluXHJcblx0XHRcdF8uZWFjaChvcmdfaWRzLCAob3JnX2lkKSAtPlxyXG5cdFx0XHRcdGlmIG9yZ3NfY2FuX2FkbWluLmluY2x1ZGVzKG9yZ19pZClcclxuXHRcdFx0XHRcdG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKVxyXG5cdFx0XHQpXHJcblxyXG5cdG15X3Blcm1pc3Npb25zID0gXy51bmlxKG15X3Blcm1pc3Npb25zKVxyXG5cdHJldHVybiBteV9wZXJtaXNzaW9ucyIsIiAgICAgICAgICAgICAgICAgICAgICBcblxucGVybWlzc2lvbk1hbmFnZXIgPSB7fTtcblxucGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zID0gZnVuY3Rpb24oZmxvd19pZCwgdXNlcl9pZCkge1xuICB2YXIgZmxvdywgbXlfcGVybWlzc2lvbnMsIG9yZ19pZHMsIG9yZ2FuaXphdGlvbnMsIG9yZ3NfY2FuX2FkZCwgb3Jnc19jYW5fYWRtaW4sIG9yZ3NfY2FuX21vbml0b3IsIHNwYWNlX2lkLCB1c2Vyc19jYW5fYWRkLCB1c2Vyc19jYW5fYWRtaW4sIHVzZXJzX2Nhbl9tb25pdG9yO1xuICBmbG93ID0gdXVmbG93TWFuYWdlci5nZXRGbG93KGZsb3dfaWQpO1xuICBzcGFjZV9pZCA9IGZsb3cuc3BhY2U7XG4gIG9yZ19pZHMgPSBuZXcgQXJyYXk7XG4gIG9yZ2FuaXphdGlvbnMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB1c2VyczogdXNlcl9pZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBwYXJlbnRzOiAxXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBfLmVhY2gob3JnYW5pemF0aW9ucywgZnVuY3Rpb24ob3JnKSB7XG4gICAgb3JnX2lkcy5wdXNoKG9yZy5faWQpO1xuICAgIGlmIChvcmcucGFyZW50cykge1xuICAgICAgcmV0dXJuIF8uZWFjaChvcmcucGFyZW50cywgZnVuY3Rpb24ocGFyZW50X2lkKSB7XG4gICAgICAgIHJldHVybiBvcmdfaWRzLnB1c2gocGFyZW50X2lkKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIG9yZ19pZHMgPSBfLnVuaXEob3JnX2lkcyk7XG4gIG15X3Blcm1pc3Npb25zID0gbmV3IEFycmF5O1xuICBpZiAoZmxvdy5wZXJtcykge1xuICAgIGlmIChmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGQpIHtcbiAgICAgIHVzZXJzX2Nhbl9hZGQgPSBmbG93LnBlcm1zLnVzZXJzX2Nhbl9hZGQ7XG4gICAgICBpZiAodXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VyX2lkKSkge1xuICAgICAgICBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRkXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy5vcmdzX2Nhbl9hZGQpIHtcbiAgICAgIG9yZ3NfY2FuX2FkZCA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRkO1xuICAgICAgXy5lYWNoKG9yZ19pZHMsIGZ1bmN0aW9uKG9yZ19pZCkge1xuICAgICAgICBpZiAob3Jnc19jYW5fYWRkLmluY2x1ZGVzKG9yZ19pZCkpIHtcbiAgICAgICAgICByZXR1cm4gbXlfcGVybWlzc2lvbnMucHVzaChcImFkZFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLnVzZXJzX2Nhbl9tb25pdG9yKSB7XG4gICAgICB1c2Vyc19jYW5fbW9uaXRvciA9IGZsb3cucGVybXMudXNlcnNfY2FuX21vbml0b3I7XG4gICAgICBpZiAodXNlcnNfY2FuX21vbml0b3IuaW5jbHVkZXModXNlcl9pZCkpIHtcbiAgICAgICAgbXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3IpIHtcbiAgICAgIG9yZ3NfY2FuX21vbml0b3IgPSBmbG93LnBlcm1zLm9yZ3NfY2FuX21vbml0b3I7XG4gICAgICBfLmVhY2gob3JnX2lkcywgZnVuY3Rpb24ob3JnX2lkKSB7XG4gICAgICAgIGlmIChvcmdzX2Nhbl9tb25pdG9yLmluY2x1ZGVzKG9yZ19pZCkpIHtcbiAgICAgICAgICByZXR1cm4gbXlfcGVybWlzc2lvbnMucHVzaChcIm1vbml0b3JcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZmxvdy5wZXJtcy51c2Vyc19jYW5fYWRtaW4pIHtcbiAgICAgIHVzZXJzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMudXNlcnNfY2FuX2FkbWluO1xuICAgICAgaWYgKHVzZXJzX2Nhbl9hZG1pbi5pbmNsdWRlcyh1c2VyX2lkKSkge1xuICAgICAgICBteV9wZXJtaXNzaW9ucy5wdXNoKFwiYWRtaW5cIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbG93LnBlcm1zLm9yZ3NfY2FuX2FkbWluKSB7XG4gICAgICBvcmdzX2Nhbl9hZG1pbiA9IGZsb3cucGVybXMub3Jnc19jYW5fYWRtaW47XG4gICAgICBfLmVhY2gob3JnX2lkcywgZnVuY3Rpb24ob3JnX2lkKSB7XG4gICAgICAgIGlmIChvcmdzX2Nhbl9hZG1pbi5pbmNsdWRlcyhvcmdfaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIG15X3Blcm1pc3Npb25zLnB1c2goXCJhZG1pblwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIG15X3Blcm1pc3Npb25zID0gXy51bmlxKG15X3Blcm1pc3Npb25zKTtcbiAgcmV0dXJuIG15X3Blcm1pc3Npb25zO1xufTtcbiIsIl9ldmFsID0gcmVxdWlyZSgnZXZhbCcpXHJcbnV1Zmxvd01hbmFnZXIgPSB7fVxyXG5cclxudXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uID0gKHJlcSkgLT5cclxuXHRxdWVyeSA9IHJlcS5xdWVyeVxyXG5cdHVzZXJJZCA9IHF1ZXJ5W1wiWC1Vc2VyLUlkXCJdXHJcblx0YXV0aFRva2VuID0gcXVlcnlbXCJYLUF1dGgtVG9rZW5cIl1cclxuXHJcblx0aWYgbm90IHVzZXJJZCBvciBub3QgYXV0aFRva2VuXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcclxuXHJcblx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxyXG5cdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxyXG5cdFx0X2lkOiB1c2VySWQsXHJcblx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxyXG5cclxuXHRpZiBub3QgdXNlclxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXHJcblxyXG5cdHJldHVybiB1c2VyXHJcblxyXG51dWZsb3dNYW5hZ2VyLmdldFNwYWNlID0gKHNwYWNlX2lkKSAtPlxyXG5cdHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcclxuXHRpZiBub3Qgc3BhY2VcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwic3BhY2VfaWTmnInor6/miJbmraRzcGFjZeW3sue7j+iiq+WIoOmZpFwiKVxyXG5cdHJldHVybiBzcGFjZVxyXG5cclxudXVmbG93TWFuYWdlci5nZXRGbG93ID0gKGZsb3dfaWQpIC0+XHJcblx0ZmxvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZmxvd3MuZmluZE9uZShmbG93X2lkKVxyXG5cdGlmIG5vdCBmbG93XHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcImlk5pyJ6K+v5oiW5q2k5rWB56iL5bey57uP6KKr5Yig6ZmkXCIpXHJcblx0cmV0dXJuIGZsb3dcclxuXHJcbnV1Zmxvd01hbmFnZXIuZ2V0U3BhY2VVc2VyID0gKHNwYWNlX2lkLCB1c2VyX2lkKSAtPlxyXG5cdHNwYWNlX3VzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlX3VzZXJzLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJfaWQgfSlcclxuXHRpZiBub3Qgc3BhY2VfdXNlclxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCJ1c2VyX2lk5a+55bqU55qE55So5oi35LiN5bGe5LqO5b2T5YmNc3BhY2VcIilcclxuXHRyZXR1cm4gc3BhY2VfdXNlclxyXG5cclxudXVmbG93TWFuYWdlci5nZXRTcGFjZVVzZXJPcmdJbmZvID0gKHNwYWNlX3VzZXIpIC0+XHJcblx0aW5mbyA9IG5ldyBPYmplY3RcclxuXHRpbmZvLm9yZ2FuaXphdGlvbiA9IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uXHJcblx0b3JnID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vcmdhbml6YXRpb25zLmZpbmRPbmUoc3BhY2VfdXNlci5vcmdhbml6YXRpb24sIHsgZmllbGRzOiB7IG5hbWU6IDEgLCBmdWxsbmFtZTogMSB9IH0pXHJcblx0aW5mby5vcmdhbml6YXRpb25fbmFtZSA9IG9yZy5uYW1lXHJcblx0aW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBvcmcuZnVsbG5hbWVcclxuXHRyZXR1cm4gaW5mb1xyXG5cclxudXVmbG93TWFuYWdlci5pc0Zsb3dFbmFibGVkID0gKGZsb3cpIC0+XHJcblx0aWYgZmxvdy5zdGF0ZSBpc250IFwiZW5hYmxlZFwiXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+acquWQr+eUqCzmk43kvZzlpLHotKVcIilcclxuXHJcbnV1Zmxvd01hbmFnZXIuaXNGbG93U3BhY2VNYXRjaGVkID0gKGZsb3csIHNwYWNlX2lkKSAtPlxyXG5cdGlmIGZsb3cuc3BhY2UgaXNudCBzcGFjZV9pZFxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvlkozlt6XkvZzljLpJROS4jeWMuemFjVwiKVxyXG5cclxudXVmbG93TWFuYWdlci5nZXRGb3JtID0gKGZvcm1faWQpIC0+XHJcblx0Zm9ybSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZm9ybXMuZmluZE9uZShmb3JtX2lkKVxyXG5cdGlmIG5vdCBmb3JtXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCAn6KGo5Y2VSUTmnInor6/miJbmraTooajljZXlt7Lnu4/ooqvliKDpmaQnKVxyXG5cclxuXHRyZXR1cm4gZm9ybVxyXG5cclxudXVmbG93TWFuYWdlci5nZXRDYXRlZ29yeSA9IChjYXRlZ29yeV9pZCkgLT5cclxuXHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9ucy5jYXRlZ29yaWVzLmZpbmRPbmUoY2F0ZWdvcnlfaWQpXHJcblxyXG51dWZsb3dNYW5hZ2VyLmNyZWF0ZV9pbnN0YW5jZSA9IChpbnN0YW5jZV9mcm9tX2NsaWVudCwgdXNlcl9pbmZvKSAtPlxyXG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdLCBTdHJpbmdcclxuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdLCBTdHJpbmdcclxuXHRjaGVjayBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl0sIFN0cmluZ1xyXG5cdGNoZWNrIGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXSwgW3tvOiBTdHJpbmcsIGlkczogW1N0cmluZ119XVxyXG5cclxuXHQjIOagoemqjOaYr+WQpnJlY29yZOW3sue7j+WPkei1t+eahOeUs+ivt+i/mOWcqOWuoeaJueS4rVxyXG5cdHV1Zmxvd01hbmFnZXIuY2hlY2tJc0luQXBwcm92YWwoaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdWzBdLCBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdKVxyXG5cclxuXHRzcGFjZV9pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wic3BhY2VcIl1cclxuXHRmbG93X2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJmbG93XCJdXHJcblx0dXNlcl9pZCA9IHVzZXJfaW5mby5faWRcclxuXHQjIOiOt+WPluWJjeWPsOaJgOS8oOeahHRyYWNlXHJcblx0dHJhY2VfZnJvbV9jbGllbnQgPSBudWxsXHJcblx0IyDojrflj5bliY3lj7DmiYDkvKDnmoRhcHByb3ZlXHJcblx0YXBwcm92ZV9mcm9tX2NsaWVudCA9IG51bGxcclxuXHRpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXSBhbmQgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1cclxuXHRcdHRyYWNlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF1cclxuXHRcdGlmIHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl0gYW5kIHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl1bMF1cclxuXHRcdFx0YXBwcm92ZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdW1wiYXBwcm92ZXNcIl1bMF1cclxuXHJcblx0IyDojrflj5bkuIDkuKpzcGFjZVxyXG5cdHNwYWNlID0gdXVmbG93TWFuYWdlci5nZXRTcGFjZShzcGFjZV9pZClcclxuXHQjIOiOt+WPluS4gOS4qmZsb3dcclxuXHRmbG93ID0gdXVmbG93TWFuYWdlci5nZXRGbG93KGZsb3dfaWQpXHJcblx0IyDojrflj5bkuIDkuKpzcGFjZeS4i+eahOS4gOS4qnVzZXJcclxuXHRzcGFjZV91c2VyID0gdXVmbG93TWFuYWdlci5nZXRTcGFjZVVzZXIoc3BhY2VfaWQsIHVzZXJfaWQpXHJcblx0IyDojrflj5ZzcGFjZV91c2Vy5omA5Zyo55qE6YOo6Zeo5L+h5oGvXHJcblx0c3BhY2VfdXNlcl9vcmdfaW5mbyA9IHV1Zmxvd01hbmFnZXIuZ2V0U3BhY2VVc2VyT3JnSW5mbyhzcGFjZV91c2VyKVxyXG5cdCMg5Yik5pat5LiA5LiqZmxvd+aYr+WQpuS4uuWQr+eUqOeKtuaAgVxyXG5cdHV1Zmxvd01hbmFnZXIuaXNGbG93RW5hYmxlZChmbG93KVxyXG5cdCMg5Yik5pat5LiA5LiqZmxvd+WSjHNwYWNlX2lk5piv5ZCm5Yy56YWNXHJcblx0dXVmbG93TWFuYWdlci5pc0Zsb3dTcGFjZU1hdGNoZWQoZmxvdywgc3BhY2VfaWQpXHJcblxyXG5cdGZvcm0gPSB1dWZsb3dNYW5hZ2VyLmdldEZvcm0oZmxvdy5mb3JtKVxyXG5cclxuXHRwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93X2lkLCB1c2VyX2lkKVxyXG5cclxuXHRpZiBub3QgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZGRcIilcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5b2T5YmN55So5oi35rKh5pyJ5q2k5rWB56iL55qE5paw5bu65p2D6ZmQXCIpXHJcblxyXG5cdG5vdyA9IG5ldyBEYXRlXHJcblx0aW5zX29iaiA9IHt9XHJcblx0aW5zX29iai5faWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5fbWFrZU5ld0lEKClcclxuXHRpbnNfb2JqLnNwYWNlID0gc3BhY2VfaWRcclxuXHRpbnNfb2JqLmZsb3cgPSBmbG93X2lkXHJcblx0aW5zX29iai5mbG93X3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuX2lkXHJcblx0aW5zX29iai5mb3JtID0gZmxvdy5mb3JtXHJcblx0aW5zX29iai5mb3JtX3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuZm9ybV92ZXJzaW9uXHJcblx0aW5zX29iai5uYW1lID0gZmxvdy5uYW1lXHJcblx0aW5zX29iai5zdWJtaXR0ZXIgPSB1c2VyX2lkXHJcblx0aW5zX29iai5zdWJtaXR0ZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lXHJcblx0aW5zX29iai5hcHBsaWNhbnQgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIGVsc2UgdXNlcl9pZFxyXG5cdGluc19vYmouYXBwbGljYW50X25hbWUgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfbmFtZVwiXSBlbHNlIHVzZXJfaW5mby5uYW1lXHJcblx0aW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uXCJdIGVsc2Ugc3BhY2VfdXNlci5vcmdhbml6YXRpb25cclxuXHRpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gZWxzZSBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9uYW1lXHJcblx0aW5zX29iai5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lID0gaWYgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdIHRoZW4gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lXCJdIGVsc2UgIHNwYWNlX3VzZXJfb3JnX2luZm8ub3JnYW5pemF0aW9uX2Z1bGxuYW1lXHJcblx0aW5zX29iai5hcHBsaWNhbnRfY29tcGFueSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdIGVsc2Ugc3BhY2VfdXNlci5jb21wYW55X2lkXHJcblx0aW5zX29iai5zdGF0ZSA9ICdkcmFmdCdcclxuXHRpbnNfb2JqLmNvZGUgPSAnJ1xyXG5cdGluc19vYmouaXNfYXJjaGl2ZWQgPSBmYWxzZVxyXG5cdGluc19vYmouaXNfZGVsZXRlZCA9IGZhbHNlXHJcblx0aW5zX29iai5jcmVhdGVkID0gbm93XHJcblx0aW5zX29iai5jcmVhdGVkX2J5ID0gdXNlcl9pZFxyXG5cdGluc19vYmoubW9kaWZpZWQgPSBub3dcclxuXHRpbnNfb2JqLm1vZGlmaWVkX2J5ID0gdXNlcl9pZFxyXG5cdGluc19vYmoudmFsdWVzID0gbmV3IE9iamVjdFxyXG5cclxuXHRpbnNfb2JqLnJlY29yZF9pZHMgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInJlY29yZF9pZHNcIl1cclxuXHJcblx0aWYgc3BhY2VfdXNlci5jb21wYW55X2lkXHJcblx0XHRpbnNfb2JqLmNvbXBhbnlfaWQgPSBzcGFjZV91c2VyLmNvbXBhbnlfaWRcclxuXHJcblx0IyDmlrDlu7pUcmFjZVxyXG5cdHRyYWNlX29iaiA9IHt9XHJcblx0dHJhY2Vfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHJcclxuXHR0cmFjZV9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZFxyXG5cdHRyYWNlX29iai5pc19maW5pc2hlZCA9IGZhbHNlXHJcblx0IyDlvZPliY3mnIDmlrDniYhmbG935Lit5byA5aeL6IqC54K5XHJcblx0c3RhcnRfc3RlcCA9IF8uZmluZChmbG93LmN1cnJlbnQuc3RlcHMsIChzdGVwKSAtPlxyXG5cdFx0cmV0dXJuIHN0ZXAuc3RlcF90eXBlIGlzICdzdGFydCdcclxuXHQpXHJcblx0dHJhY2Vfb2JqLnN0ZXAgPSBzdGFydF9zdGVwLl9pZFxyXG5cdHRyYWNlX29iai5uYW1lID0gc3RhcnRfc3RlcC5uYW1lXHJcblxyXG5cdHRyYWNlX29iai5zdGFydF9kYXRlID0gbm93XHJcblx0IyDmlrDlu7pBcHByb3ZlXHJcblx0YXBwcl9vYmogPSB7fVxyXG5cdGFwcHJfb2JqLl9pZCA9IG5ldyBNb25nby5PYmplY3RJRCgpLl9zdHJcclxuXHRhcHByX29iai5pbnN0YW5jZSA9IGluc19vYmouX2lkXHJcblx0YXBwcl9vYmoudHJhY2UgPSB0cmFjZV9vYmouX2lkXHJcblx0YXBwcl9vYmouaXNfZmluaXNoZWQgPSBmYWxzZVxyXG5cdGFwcHJfb2JqLnVzZXIgPSBpZiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSB0aGVuIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIGVsc2UgdXNlcl9pZFxyXG5cdGFwcHJfb2JqLnVzZXJfbmFtZSA9IGlmIGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gdGhlbiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIGVsc2UgdXNlcl9pbmZvLm5hbWVcclxuXHRhcHByX29iai5oYW5kbGVyID0gdXNlcl9pZFxyXG5cdGFwcHJfb2JqLmhhbmRsZXJfbmFtZSA9IHVzZXJfaW5mby5uYW1lXHJcblx0YXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvblxyXG5cdGFwcHJfb2JqLmhhbmRsZXJfb3JnYW5pemF0aW9uX25hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLm5hbWVcclxuXHRhcHByX29iai5oYW5kbGVyX29yZ2FuaXphdGlvbl9mdWxsbmFtZSA9IHNwYWNlX3VzZXJfb3JnX2luZm8uZnVsbG5hbWVcclxuXHRhcHByX29iai50eXBlID0gJ2RyYWZ0J1xyXG5cdGFwcHJfb2JqLnN0YXJ0X2RhdGUgPSBub3dcclxuXHRhcHByX29iai5yZWFkX2RhdGUgPSBub3dcclxuXHRhcHByX29iai5pc19yZWFkID0gdHJ1ZVxyXG5cdGFwcHJfb2JqLmlzX2Vycm9yID0gZmFsc2VcclxuXHRhcHByX29iai5kZXNjcmlwdGlvbiA9ICcnXHJcblx0YXBwcl9vYmoudmFsdWVzID0gdXVmbG93TWFuYWdlci5pbml0aWF0ZVZhbHVlcyhpbnNfb2JqLnJlY29yZF9pZHNbMF0sIGZsb3dfaWQsIHNwYWNlX2lkLCBmb3JtLmN1cnJlbnQuZmllbGRzKVxyXG5cclxuXHR0cmFjZV9vYmouYXBwcm92ZXMgPSBbYXBwcl9vYmpdXHJcblx0aW5zX29iai50cmFjZXMgPSBbdHJhY2Vfb2JqXVxyXG5cclxuXHRpbnNfb2JqLmluYm94X3VzZXJzID0gaW5zdGFuY2VfZnJvbV9jbGllbnQuaW5ib3hfdXNlcnMgfHwgW11cclxuXHJcblx0aW5zX29iai5jdXJyZW50X3N0ZXBfbmFtZSA9IHN0YXJ0X3N0ZXAubmFtZVxyXG5cclxuXHRpZiBmbG93LmF1dG9fcmVtaW5kIGlzIHRydWVcclxuXHRcdGluc19vYmouYXV0b19yZW1pbmQgPSB0cnVlXHJcblxyXG5cdCMg5paw5bu655Sz6K+35Y2V5pe277yMaW5zdGFuY2Vz6K6w5b2V5rWB56iL5ZCN56ew44CB5rWB56iL5YiG57G75ZCN56ewICMxMzEzXHJcblx0aW5zX29iai5mbG93X25hbWUgPSBmbG93Lm5hbWVcclxuXHRpZiBmb3JtLmNhdGVnb3J5XHJcblx0XHRjYXRlZ29yeSA9IHV1Zmxvd01hbmFnZXIuZ2V0Q2F0ZWdvcnkoZm9ybS5jYXRlZ29yeSlcclxuXHRcdGlmIGNhdGVnb3J5XHJcblx0XHRcdGluc19vYmouY2F0ZWdvcnlfbmFtZSA9IGNhdGVnb3J5Lm5hbWVcclxuXHRcdFx0aW5zX29iai5jYXRlZ29yeSA9IGNhdGVnb3J5Ll9pZFxyXG5cclxuXHRuZXdfaW5zX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuaW5zZXJ0KGluc19vYmopXHJcblxyXG5cdHV1Zmxvd01hbmFnZXIuaW5pdGlhdGVBdHRhY2goaW5zX29iai5yZWNvcmRfaWRzWzBdLCBzcGFjZV9pZCwgaW5zX29iai5faWQsIGFwcHJfb2JqLl9pZClcclxuXHJcblx0dXVmbG93TWFuYWdlci5pbml0aWF0ZVJlY29yZEluc3RhbmNlSW5mbyhpbnNfb2JqLnJlY29yZF9pZHNbMF0sIG5ld19pbnNfaWQsIHNwYWNlX2lkKVxyXG5cclxuXHRyZXR1cm4gbmV3X2luc19pZFxyXG5cclxudXVmbG93TWFuYWdlci5pbml0aWF0ZVZhbHVlcyA9IChyZWNvcmRJZHMsIGZsb3dJZCwgc3BhY2VJZCwgZmllbGRzKSAtPlxyXG5cdGZpZWxkQ29kZXMgPSBbXVxyXG5cdF8uZWFjaCBmaWVsZHMsIChmKS0+XHJcblx0XHRpZiBmLnR5cGUgPT0gJ3NlY3Rpb24nXHJcblx0XHRcdF8uZWFjaCBmLmZpZWxkcywgKGZmKS0+XHJcblx0XHRcdFx0ZmllbGRDb2Rlcy5wdXNoIGZmLmNvZGVcclxuXHRcdGVsc2VcclxuXHRcdFx0ZmllbGRDb2Rlcy5wdXNoIGYuY29kZVxyXG5cclxuXHR2YWx1ZXMgPSB7fVxyXG5cdG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vYmplY3Rfd29ya2Zsb3dzLmZpbmRPbmUoe1xyXG5cdFx0b2JqZWN0X25hbWU6IHJlY29yZElkcy5vLFxyXG5cdFx0Zmxvd19pZDogZmxvd0lkXHJcblx0fSlcclxuXHRyZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLmZpbmRPbmUocmVjb3JkSWRzLmlkc1swXSlcclxuXHRpZiBvdyBhbmQgcmVjb3JkXHJcblx0XHR0YWJsZUZpZWxkQ29kZXMgPSBbXVxyXG5cdFx0dGFibGVGaWVsZE1hcCA9IFtdXHJcblxyXG5cdFx0b3cuZmllbGRfbWFwLmZvckVhY2ggKGZtKSAtPlxyXG5cdFx0XHQjIOWIpOaWreaYr+WQpuaYr+WtkOihqOWtl+autVxyXG5cdFx0XHRpZiBmbS53b3JrZmxvd19maWVsZC5pbmRleE9mKCcuJC4nKSA+IDAgYW5kIGZtLm9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA+IDBcclxuXHRcdFx0XHR3VGFibGVDb2RlID0gZm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4kLicpWzBdXHJcblx0XHRcdFx0b1RhYmxlQ29kZSA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLiQuJylbMF1cclxuXHRcdFx0XHRpZiByZWNvcmQuaGFzT3duUHJvcGVydHkob1RhYmxlQ29kZSkgYW5kIF8uaXNBcnJheShyZWNvcmRbb1RhYmxlQ29kZV0pXHJcblx0XHRcdFx0XHR0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XHJcblx0XHRcdFx0XHRcdHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXHJcblx0XHRcdFx0XHRcdG9iamVjdF90YWJsZV9maWVsZF9jb2RlOiBvVGFibGVDb2RlXHJcblx0XHRcdFx0XHR9KSlcclxuXHRcdFx0XHRcdHRhYmxlRmllbGRNYXAucHVzaChmbSlcclxuXHJcblx0XHRcdCMg5aSE55CGbG9va3Vw57G75Z6L5a2X5q61XHJcblx0XHRcdGVsc2UgaWYgZm0ub2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4nKSA+IDAgYW5kIGZtLm9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA9PSAtMVxyXG5cdFx0XHRcdG9iamVjdEZpZWxkTmFtZSA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdXHJcblx0XHRcdFx0bG9va3VwRmllbGROYW1lID0gZm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV1cclxuXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWNvcmRJZHMubywgc3BhY2VJZClcclxuXHRcdFx0XHRpZiBvYmplY3RcclxuXHRcdFx0XHRcdG9iamVjdEZpZWxkID0gb2JqZWN0LmZpZWxkc1tvYmplY3RGaWVsZE5hbWVdXHJcblx0XHRcdFx0XHRpZiBvYmplY3RGaWVsZCAmJiAob2JqZWN0RmllbGQudHlwZSA9PSBcImxvb2t1cFwiIHx8IG9iamVjdEZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpICYmICFvYmplY3RGaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdFx0XHRmaWVsZHNPYmogPSB7fVxyXG5cdFx0XHRcdFx0XHRmaWVsZHNPYmpbbG9va3VwRmllbGROYW1lXSA9IDFcclxuXHRcdFx0XHRcdFx0bG9va3VwT2JqZWN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdEZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZCkuZmluZE9uZShyZWNvcmRbb2JqZWN0RmllbGROYW1lXSwgeyBmaWVsZHM6IGZpZWxkc09iaiB9KVxyXG5cdFx0XHRcdFx0XHRpZiBsb29rdXBPYmplY3RcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdID0gbG9va3VwT2JqZWN0W2xvb2t1cEZpZWxkTmFtZV1cclxuXHJcblx0XHRcdGVsc2UgaWYgcmVjb3JkLmhhc093blByb3BlcnR5KGZtLm9iamVjdF9maWVsZClcclxuXHRcdFx0XHR2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdID0gcmVjb3JkW2ZtLm9iamVjdF9maWVsZF1cclxuXHJcblx0XHRfLnVuaXEodGFibGVGaWVsZENvZGVzKS5mb3JFYWNoICh0ZmMpIC0+XHJcblx0XHRcdGMgPSBKU09OLnBhcnNlKHRmYylcclxuXHRcdFx0dmFsdWVzW2Mud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZV0gPSBbXVxyXG5cdFx0XHRyZWNvcmRbYy5vYmplY3RfdGFibGVfZmllbGRfY29kZV0uZm9yRWFjaCAodHIpIC0+XHJcblx0XHRcdFx0bmV3VHIgPSB7fVxyXG5cdFx0XHRcdF8uZWFjaCB0ciwgKHYsIGspIC0+XHJcblx0XHRcdFx0XHR0YWJsZUZpZWxkTWFwLmZvckVhY2ggKHRmbSkgLT5cclxuXHRcdFx0XHRcdFx0aWYgdGZtLm9iamVjdF9maWVsZCBpcyAoYy5vYmplY3RfdGFibGVfZmllbGRfY29kZSArICcuJC4nICsgaylcclxuXHRcdFx0XHRcdFx0XHR3VGRDb2RlID0gdGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJC4nKVsxXVxyXG5cdFx0XHRcdFx0XHRcdG5ld1RyW3dUZENvZGVdID0gdlxyXG5cdFx0XHRcdGlmIG5vdCBfLmlzRW1wdHkobmV3VHIpXHJcblx0XHRcdFx0XHR2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXS5wdXNoKG5ld1RyKVxyXG5cclxuXHRcdCMg5aaC5p6c6YWN572u5LqG6ISa5pys5YiZ5omn6KGM6ISa5pysXHJcblx0XHRpZiBvdy5maWVsZF9tYXBfc2NyaXB0XHJcblx0XHRcdF8uZXh0ZW5kKHZhbHVlcywgdXVmbG93TWFuYWdlci5ldmFsRmllbGRNYXBTY3JpcHQob3cuZmllbGRfbWFwX3NjcmlwdCwgcmVjb3JkSWRzLm8sIHNwYWNlSWQsIHJlY29yZElkcy5pZHNbMF0pKVxyXG5cclxuXHQjIOi/h+a7pOaOiXZhbHVlc+S4reeahOmdnuazlWtleVxyXG5cdGZpbHRlclZhbHVlcyA9IHt9XHJcblx0Xy5lYWNoIF8ua2V5cyh2YWx1ZXMpLCAoayktPlxyXG5cdFx0aWYgZmllbGRDb2Rlcy5pbmNsdWRlcyhrKVxyXG5cdFx0XHRmaWx0ZXJWYWx1ZXNba10gPSB2YWx1ZXNba11cclxuXHJcblx0cmV0dXJuIGZpbHRlclZhbHVlc1xyXG5cclxudXVmbG93TWFuYWdlci5ldmFsRmllbGRNYXBTY3JpcHQgPSAoZmllbGRfbWFwX3NjcmlwdCwgb2JqZWN0TmFtZSwgc3BhY2VJZCwgb2JqZWN0SWQpLT5cclxuXHRyZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0TmFtZSwgc3BhY2VJZCkuZmluZE9uZShvYmplY3RJZClcclxuXHRzY3JpcHQgPSBcIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJlY29yZCkgeyBcIiArIGZpZWxkX21hcF9zY3JpcHQgKyBcIiB9XCJcclxuXHRmdW5jID0gX2V2YWwoc2NyaXB0LCBcImZpZWxkX21hcF9zY3JpcHRcIilcclxuXHR2YWx1ZXMgPSBmdW5jKHJlY29yZClcclxuXHRpZiBfLmlzT2JqZWN0IHZhbHVlc1xyXG5cdFx0cmV0dXJuIHZhbHVlc1xyXG5cdGVsc2VcclxuXHRcdGNvbnNvbGUuZXJyb3IgXCJldmFsRmllbGRNYXBTY3JpcHQ6IOiEmuacrOi/lOWbnuWAvOexu+Wei+S4jeaYr+WvueixoVwiXHJcblx0cmV0dXJuIHt9XHJcblxyXG5cclxuXHJcbnV1Zmxvd01hbmFnZXIuaW5pdGlhdGVBdHRhY2ggPSAocmVjb3JkSWRzLCBzcGFjZUlkLCBpbnNJZCwgYXBwcm92ZUlkKSAtPlxyXG5cclxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zWydjbXNfZmlsZXMnXS5maW5kKHtcclxuXHRcdHNwYWNlOiBzcGFjZUlkLFxyXG5cdFx0cGFyZW50OiByZWNvcmRJZHNcclxuXHR9KS5mb3JFYWNoIChjZikgLT5cclxuXHRcdF8uZWFjaCBjZi52ZXJzaW9ucywgKHZlcnNpb25JZCwgaWR4KSAtPlxyXG5cdFx0XHRmID0gQ3JlYXRvci5Db2xsZWN0aW9uc1snY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXS5maW5kT25lKHZlcnNpb25JZClcclxuXHRcdFx0bmV3RmlsZSA9IG5ldyBGUy5GaWxlKClcclxuXHJcblx0XHRcdG5ld0ZpbGUuYXR0YWNoRGF0YSBmLmNyZWF0ZVJlYWRTdHJlYW0oJ2ZpbGVzJyksIHtcclxuXHRcdFx0XHRcdHR5cGU6IGYub3JpZ2luYWwudHlwZVxyXG5cdFx0XHR9LCAoZXJyKSAtPlxyXG5cdFx0XHRcdGlmIChlcnIpXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbilcclxuXHJcblx0XHRcdFx0bmV3RmlsZS5uYW1lKGYubmFtZSgpKVxyXG5cdFx0XHRcdG5ld0ZpbGUuc2l6ZShmLnNpemUoKSlcclxuXHRcdFx0XHRtZXRhZGF0YSA9IHtcclxuXHRcdFx0XHRcdG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxyXG5cdFx0XHRcdFx0b3duZXJfbmFtZTogZi5tZXRhZGF0YS5vd25lcl9uYW1lLFxyXG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcdFx0XHRpbnN0YW5jZTogaW5zSWQsXHJcblx0XHRcdFx0XHRhcHByb3ZlOiBhcHByb3ZlSWRcclxuXHRcdFx0XHRcdHBhcmVudDogY2YuX2lkXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiBpZHggaXMgMFxyXG5cdFx0XHRcdFx0bWV0YWRhdGEuY3VycmVudCA9IHRydWVcclxuXHJcblx0XHRcdFx0bmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhXHJcblx0XHRcdFx0Y2ZzLmluc3RhbmNlcy5pbnNlcnQobmV3RmlsZSlcclxuXHJcblx0cmV0dXJuXHJcblxyXG51dWZsb3dNYW5hZ2VyLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvID0gKHJlY29yZElkcywgaW5zSWQsIHNwYWNlSWQpIC0+XHJcblx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlY29yZElkcy5vLCBzcGFjZUlkKS51cGRhdGUocmVjb3JkSWRzLmlkc1swXSwge1xyXG5cdFx0JHB1c2g6IHtcclxuXHRcdFx0aW5zdGFuY2VzOiB7XHJcblx0XHRcdFx0JGVhY2g6IFt7XHJcblx0XHRcdFx0XHRfaWQ6IGluc0lkLFxyXG5cdFx0XHRcdFx0c3RhdGU6ICdkcmFmdCdcclxuXHRcdFx0XHR9XSxcclxuXHRcdFx0XHQkcG9zaXRpb246IDBcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdCRzZXQ6IHtcclxuXHRcdFx0bG9ja2VkOiB0cnVlXHJcblx0XHRcdGluc3RhbmNlX3N0YXRlOiAnZHJhZnQnXHJcblx0XHR9XHJcblx0fSlcclxuXHJcblx0cmV0dXJuXHJcblxyXG51dWZsb3dNYW5hZ2VyLmNoZWNrSXNJbkFwcHJvdmFsID0gKHJlY29yZElkcywgc3BhY2VJZCkgLT5cclxuXHRyZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLmZpbmRPbmUoe1xyXG5cdFx0X2lkOiByZWNvcmRJZHMuaWRzWzBdLCBpbnN0YW5jZXM6IHsgJGV4aXN0czogdHJ1ZSB9XHJcblx0fSwgeyBmaWVsZHM6IHsgaW5zdGFuY2VzOiAxIH0gfSlcclxuXHJcblx0aWYgcmVjb3JkIGFuZCByZWNvcmQuaW5zdGFuY2VzWzBdLnN0YXRlIGlzbnQgJ2NvbXBsZXRlZCcgYW5kIENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmZpbmQocmVjb3JkLmluc3RhbmNlc1swXS5faWQpLmNvdW50KCkgPiAwXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuatpOiusOW9leW3suWPkei1t+a1geeoi+ato+WcqOWuoeaJueS4re+8jOW+heWuoeaJuee7k+adn+aWueWPr+WPkei1t+S4i+S4gOasoeWuoeaJue+8gVwiKVxyXG5cclxuXHRyZXR1cm5cclxuXHJcbiIsInZhciBfZXZhbDsgICAgICAgICAgICAgICBcblxuX2V2YWwgPSByZXF1aXJlKCdldmFsJyk7XG5cbnV1Zmxvd01hbmFnZXIgPSB7fTtcblxudXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uID0gZnVuY3Rpb24ocmVxKSB7XG4gIHZhciBhdXRoVG9rZW4sIGhhc2hlZFRva2VuLCBxdWVyeSwgdXNlciwgdXNlcklkO1xuICBxdWVyeSA9IHJlcS5xdWVyeTtcbiAgdXNlcklkID0gcXVlcnlbXCJYLVVzZXItSWRcIl07XG4gIGF1dGhUb2tlbiA9IHF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdO1xuICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgIF9pZDogdXNlcklkLFxuICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gIH0pO1xuICBpZiAoIXVzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIHJldHVybiB1c2VyO1xufTtcblxudXVmbG93TWFuYWdlci5nZXRTcGFjZSA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHZhciBzcGFjZTtcbiAgc3BhY2UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgaWYgKCFzcGFjZSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwic3BhY2VfaWTmnInor6/miJbmraRzcGFjZeW3sue7j+iiq+WIoOmZpFwiKTtcbiAgfVxuICByZXR1cm4gc3BhY2U7XG59O1xuXG51dWZsb3dNYW5hZ2VyLmdldEZsb3cgPSBmdW5jdGlvbihmbG93X2lkKSB7XG4gIHZhciBmbG93O1xuICBmbG93ID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5mbG93cy5maW5kT25lKGZsb3dfaWQpO1xuICBpZiAoIWZsb3cpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcImlk5pyJ6K+v5oiW5q2k5rWB56iL5bey57uP6KKr5Yig6ZmkXCIpO1xuICB9XG4gIHJldHVybiBmbG93O1xufTtcblxudXVmbG93TWFuYWdlci5nZXRTcGFjZVVzZXIgPSBmdW5jdGlvbihzcGFjZV9pZCwgdXNlcl9pZCkge1xuICB2YXIgc3BhY2VfdXNlcjtcbiAgc3BhY2VfdXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnMuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHVzZXI6IHVzZXJfaWRcbiAgfSk7XG4gIGlmICghc3BhY2VfdXNlcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwidXNlcl9pZOWvueW6lOeahOeUqOaIt+S4jeWxnuS6juW9k+WJjXNwYWNlXCIpO1xuICB9XG4gIHJldHVybiBzcGFjZV91c2VyO1xufTtcblxudXVmbG93TWFuYWdlci5nZXRTcGFjZVVzZXJPcmdJbmZvID0gZnVuY3Rpb24oc3BhY2VfdXNlcikge1xuICB2YXIgaW5mbywgb3JnO1xuICBpbmZvID0gbmV3IE9iamVjdDtcbiAgaW5mby5vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbjtcbiAgb3JnID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5vcmdhbml6YXRpb25zLmZpbmRPbmUoc3BhY2VfdXNlci5vcmdhbml6YXRpb24sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIG5hbWU6IDEsXG4gICAgICBmdWxsbmFtZTogMVxuICAgIH1cbiAgfSk7XG4gIGluZm8ub3JnYW5pemF0aW9uX25hbWUgPSBvcmcubmFtZTtcbiAgaW5mby5vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBvcmcuZnVsbG5hbWU7XG4gIHJldHVybiBpbmZvO1xufTtcblxudXVmbG93TWFuYWdlci5pc0Zsb3dFbmFibGVkID0gZnVuY3Rpb24oZmxvdykge1xuICBpZiAoZmxvdy5zdGF0ZSAhPT0gXCJlbmFibGVkXCIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIua1geeoi+acquWQr+eUqCzmk43kvZzlpLHotKVcIik7XG4gIH1cbn07XG5cbnV1Zmxvd01hbmFnZXIuaXNGbG93U3BhY2VNYXRjaGVkID0gZnVuY3Rpb24oZmxvdywgc3BhY2VfaWQpIHtcbiAgaWYgKGZsb3cuc3BhY2UgIT09IHNwYWNlX2lkKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLmtYHnqIvlkozlt6XkvZzljLpJROS4jeWMuemFjVwiKTtcbiAgfVxufTtcblxudXVmbG93TWFuYWdlci5nZXRGb3JtID0gZnVuY3Rpb24oZm9ybV9pZCkge1xuICB2YXIgZm9ybTtcbiAgZm9ybSA9IENyZWF0b3IuQ29sbGVjdGlvbnMuZm9ybXMuZmluZE9uZShmb3JtX2lkKTtcbiAgaWYgKCFmb3JtKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgJ+ihqOWNlUlE5pyJ6K+v5oiW5q2k6KGo5Y2V5bey57uP6KKr5Yig6ZmkJyk7XG4gIH1cbiAgcmV0dXJuIGZvcm07XG59O1xuXG51dWZsb3dNYW5hZ2VyLmdldENhdGVnb3J5ID0gZnVuY3Rpb24oY2F0ZWdvcnlfaWQpIHtcbiAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnMuY2F0ZWdvcmllcy5maW5kT25lKGNhdGVnb3J5X2lkKTtcbn07XG5cbnV1Zmxvd01hbmFnZXIuY3JlYXRlX2luc3RhbmNlID0gZnVuY3Rpb24oaW5zdGFuY2VfZnJvbV9jbGllbnQsIHVzZXJfaW5mbykge1xuICB2YXIgYXBwcl9vYmosIGFwcHJvdmVfZnJvbV9jbGllbnQsIGNhdGVnb3J5LCBmbG93LCBmbG93X2lkLCBmb3JtLCBpbnNfb2JqLCBuZXdfaW5zX2lkLCBub3csIHBlcm1pc3Npb25zLCBzcGFjZSwgc3BhY2VfaWQsIHNwYWNlX3VzZXIsIHNwYWNlX3VzZXJfb3JnX2luZm8sIHN0YXJ0X3N0ZXAsIHRyYWNlX2Zyb21fY2xpZW50LCB0cmFjZV9vYmosIHVzZXJfaWQ7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdLCBTdHJpbmcpO1xuICBjaGVjayhpbnN0YW5jZV9mcm9tX2NsaWVudFtcInNwYWNlXCJdLCBTdHJpbmcpO1xuICBjaGVjayhpbnN0YW5jZV9mcm9tX2NsaWVudFtcImZsb3dcIl0sIFN0cmluZyk7XG4gIGNoZWNrKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXSwgW1xuICAgIHtcbiAgICAgIG86IFN0cmluZyxcbiAgICAgIGlkczogW1N0cmluZ11cbiAgICB9XG4gIF0pO1xuICB1dWZsb3dNYW5hZ2VyLmNoZWNrSXNJbkFwcHJvdmFsKGluc3RhbmNlX2Zyb21fY2xpZW50W1wicmVjb3JkX2lkc1wiXVswXSwgaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXSk7XG4gIHNwYWNlX2lkID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJzcGFjZVwiXTtcbiAgZmxvd19pZCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiZmxvd1wiXTtcbiAgdXNlcl9pZCA9IHVzZXJfaW5mby5faWQ7XG4gIHRyYWNlX2Zyb21fY2xpZW50ID0gbnVsbDtcbiAgYXBwcm92ZV9mcm9tX2NsaWVudCA9IG51bGw7XG4gIGlmIChpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXSAmJiBpbnN0YW5jZV9mcm9tX2NsaWVudFtcInRyYWNlc1wiXVswXSkge1xuICAgIHRyYWNlX2Zyb21fY2xpZW50ID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJ0cmFjZXNcIl1bMF07XG4gICAgaWYgKHRyYWNlX2Zyb21fY2xpZW50W1wiYXBwcm92ZXNcIl0gJiYgdHJhY2VfZnJvbV9jbGllbnRbXCJhcHByb3Zlc1wiXVswXSkge1xuICAgICAgYXBwcm92ZV9mcm9tX2NsaWVudCA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1widHJhY2VzXCJdWzBdW1wiYXBwcm92ZXNcIl1bMF07XG4gICAgfVxuICB9XG4gIHNwYWNlID0gdXVmbG93TWFuYWdlci5nZXRTcGFjZShzcGFjZV9pZCk7XG4gIGZsb3cgPSB1dWZsb3dNYW5hZ2VyLmdldEZsb3coZmxvd19pZCk7XG4gIHNwYWNlX3VzZXIgPSB1dWZsb3dNYW5hZ2VyLmdldFNwYWNlVXNlcihzcGFjZV9pZCwgdXNlcl9pZCk7XG4gIHNwYWNlX3VzZXJfb3JnX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmdldFNwYWNlVXNlck9yZ0luZm8oc3BhY2VfdXNlcik7XG4gIHV1Zmxvd01hbmFnZXIuaXNGbG93RW5hYmxlZChmbG93KTtcbiAgdXVmbG93TWFuYWdlci5pc0Zsb3dTcGFjZU1hdGNoZWQoZmxvdywgc3BhY2VfaWQpO1xuICBmb3JtID0gdXVmbG93TWFuYWdlci5nZXRGb3JtKGZsb3cuZm9ybSk7XG4gIHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dfaWQsIHVzZXJfaWQpO1xuICBpZiAoIXBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRkXCIpKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLlvZPliY3nlKjmiLfmsqHmnInmraTmtYHnqIvnmoTmlrDlu7rmnYPpmZBcIik7XG4gIH1cbiAgbm93ID0gbmV3IERhdGU7XG4gIGluc19vYmogPSB7fTtcbiAgaW5zX29iai5faWQgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5fbWFrZU5ld0lEKCk7XG4gIGluc19vYmouc3BhY2UgPSBzcGFjZV9pZDtcbiAgaW5zX29iai5mbG93ID0gZmxvd19pZDtcbiAgaW5zX29iai5mbG93X3ZlcnNpb24gPSBmbG93LmN1cnJlbnQuX2lkO1xuICBpbnNfb2JqLmZvcm0gPSBmbG93LmZvcm07XG4gIGluc19vYmouZm9ybV92ZXJzaW9uID0gZmxvdy5jdXJyZW50LmZvcm1fdmVyc2lvbjtcbiAgaW5zX29iai5uYW1lID0gZmxvdy5uYW1lO1xuICBpbnNfb2JqLnN1Ym1pdHRlciA9IHVzZXJfaWQ7XG4gIGluc19vYmouc3VibWl0dGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnQgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50XCJdIDogdXNlcl9pZDtcbiAgaW5zX29iai5hcHBsaWNhbnRfbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIDogdXNlcl9pbmZvLm5hbWU7XG4gIGluc19vYmouYXBwbGljYW50X29yZ2FuaXphdGlvbiA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSA/IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvblwiXSA6IHNwYWNlX3VzZXIub3JnYW5pemF0aW9uO1xuICBpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lXCJdID8gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWVcIl0gOiBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9uYW1lO1xuICBpbnNfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWVcIl0gOiBzcGFjZV91c2VyX29yZ19pbmZvLm9yZ2FuaXphdGlvbl9mdWxsbmFtZTtcbiAgaW5zX29iai5hcHBsaWNhbnRfY29tcGFueSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X2NvbXBhbnlcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9jb21wYW55XCJdIDogc3BhY2VfdXNlci5jb21wYW55X2lkO1xuICBpbnNfb2JqLnN0YXRlID0gJ2RyYWZ0JztcbiAgaW5zX29iai5jb2RlID0gJyc7XG4gIGluc19vYmouaXNfYXJjaGl2ZWQgPSBmYWxzZTtcbiAgaW5zX29iai5pc19kZWxldGVkID0gZmFsc2U7XG4gIGluc19vYmouY3JlYXRlZCA9IG5vdztcbiAgaW5zX29iai5jcmVhdGVkX2J5ID0gdXNlcl9pZDtcbiAgaW5zX29iai5tb2RpZmllZCA9IG5vdztcbiAgaW5zX29iai5tb2RpZmllZF9ieSA9IHVzZXJfaWQ7XG4gIGluc19vYmoudmFsdWVzID0gbmV3IE9iamVjdDtcbiAgaW5zX29iai5yZWNvcmRfaWRzID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJyZWNvcmRfaWRzXCJdO1xuICBpZiAoc3BhY2VfdXNlci5jb21wYW55X2lkKSB7XG4gICAgaW5zX29iai5jb21wYW55X2lkID0gc3BhY2VfdXNlci5jb21wYW55X2lkO1xuICB9XG4gIHRyYWNlX29iaiA9IHt9O1xuICB0cmFjZV9vYmouX2lkID0gbmV3IE1vbmdvLk9iamVjdElEKCkuX3N0cjtcbiAgdHJhY2Vfb2JqLmluc3RhbmNlID0gaW5zX29iai5faWQ7XG4gIHRyYWNlX29iai5pc19maW5pc2hlZCA9IGZhbHNlO1xuICBzdGFydF9zdGVwID0gXy5maW5kKGZsb3cuY3VycmVudC5zdGVwcywgZnVuY3Rpb24oc3RlcCkge1xuICAgIHJldHVybiBzdGVwLnN0ZXBfdHlwZSA9PT0gJ3N0YXJ0JztcbiAgfSk7XG4gIHRyYWNlX29iai5zdGVwID0gc3RhcnRfc3RlcC5faWQ7XG4gIHRyYWNlX29iai5uYW1lID0gc3RhcnRfc3RlcC5uYW1lO1xuICB0cmFjZV9vYmouc3RhcnRfZGF0ZSA9IG5vdztcbiAgYXBwcl9vYmogPSB7fTtcbiAgYXBwcl9vYmouX2lkID0gbmV3IE1vbmdvLk9iamVjdElEKCkuX3N0cjtcbiAgYXBwcl9vYmouaW5zdGFuY2UgPSBpbnNfb2JqLl9pZDtcbiAgYXBwcl9vYmoudHJhY2UgPSB0cmFjZV9vYmouX2lkO1xuICBhcHByX29iai5pc19maW5pc2hlZCA9IGZhbHNlO1xuICBhcHByX29iai51c2VyID0gaW5zdGFuY2VfZnJvbV9jbGllbnRbXCJhcHBsaWNhbnRcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudFwiXSA6IHVzZXJfaWQ7XG4gIGFwcHJfb2JqLnVzZXJfbmFtZSA9IGluc3RhbmNlX2Zyb21fY2xpZW50W1wiYXBwbGljYW50X25hbWVcIl0gPyBpbnN0YW5jZV9mcm9tX2NsaWVudFtcImFwcGxpY2FudF9uYW1lXCJdIDogdXNlcl9pbmZvLm5hbWU7XG4gIGFwcHJfb2JqLmhhbmRsZXIgPSB1c2VyX2lkO1xuICBhcHByX29iai5oYW5kbGVyX25hbWUgPSB1c2VyX2luZm8ubmFtZTtcbiAgYXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb24gPSBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbjtcbiAgYXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb25fbmFtZSA9IHNwYWNlX3VzZXJfb3JnX2luZm8ubmFtZTtcbiAgYXBwcl9vYmouaGFuZGxlcl9vcmdhbml6YXRpb25fZnVsbG5hbWUgPSBzcGFjZV91c2VyX29yZ19pbmZvLmZ1bGxuYW1lO1xuICBhcHByX29iai50eXBlID0gJ2RyYWZ0JztcbiAgYXBwcl9vYmouc3RhcnRfZGF0ZSA9IG5vdztcbiAgYXBwcl9vYmoucmVhZF9kYXRlID0gbm93O1xuICBhcHByX29iai5pc19yZWFkID0gdHJ1ZTtcbiAgYXBwcl9vYmouaXNfZXJyb3IgPSBmYWxzZTtcbiAgYXBwcl9vYmouZGVzY3JpcHRpb24gPSAnJztcbiAgYXBwcl9vYmoudmFsdWVzID0gdXVmbG93TWFuYWdlci5pbml0aWF0ZVZhbHVlcyhpbnNfb2JqLnJlY29yZF9pZHNbMF0sIGZsb3dfaWQsIHNwYWNlX2lkLCBmb3JtLmN1cnJlbnQuZmllbGRzKTtcbiAgdHJhY2Vfb2JqLmFwcHJvdmVzID0gW2FwcHJfb2JqXTtcbiAgaW5zX29iai50cmFjZXMgPSBbdHJhY2Vfb2JqXTtcbiAgaW5zX29iai5pbmJveF91c2VycyA9IGluc3RhbmNlX2Zyb21fY2xpZW50LmluYm94X3VzZXJzIHx8IFtdO1xuICBpbnNfb2JqLmN1cnJlbnRfc3RlcF9uYW1lID0gc3RhcnRfc3RlcC5uYW1lO1xuICBpZiAoZmxvdy5hdXRvX3JlbWluZCA9PT0gdHJ1ZSkge1xuICAgIGluc19vYmouYXV0b19yZW1pbmQgPSB0cnVlO1xuICB9XG4gIGluc19vYmouZmxvd19uYW1lID0gZmxvdy5uYW1lO1xuICBpZiAoZm9ybS5jYXRlZ29yeSkge1xuICAgIGNhdGVnb3J5ID0gdXVmbG93TWFuYWdlci5nZXRDYXRlZ29yeShmb3JtLmNhdGVnb3J5KTtcbiAgICBpZiAoY2F0ZWdvcnkpIHtcbiAgICAgIGluc19vYmouY2F0ZWdvcnlfbmFtZSA9IGNhdGVnb3J5Lm5hbWU7XG4gICAgICBpbnNfb2JqLmNhdGVnb3J5ID0gY2F0ZWdvcnkuX2lkO1xuICAgIH1cbiAgfVxuICBuZXdfaW5zX2lkID0gQ3JlYXRvci5Db2xsZWN0aW9ucy5pbnN0YW5jZXMuaW5zZXJ0KGluc19vYmopO1xuICB1dWZsb3dNYW5hZ2VyLmluaXRpYXRlQXR0YWNoKGluc19vYmoucmVjb3JkX2lkc1swXSwgc3BhY2VfaWQsIGluc19vYmouX2lkLCBhcHByX29iai5faWQpO1xuICB1dWZsb3dNYW5hZ2VyLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvKGluc19vYmoucmVjb3JkX2lkc1swXSwgbmV3X2luc19pZCwgc3BhY2VfaWQpO1xuICByZXR1cm4gbmV3X2luc19pZDtcbn07XG5cbnV1Zmxvd01hbmFnZXIuaW5pdGlhdGVWYWx1ZXMgPSBmdW5jdGlvbihyZWNvcmRJZHMsIGZsb3dJZCwgc3BhY2VJZCwgZmllbGRzKSB7XG4gIHZhciBmaWVsZENvZGVzLCBmaWx0ZXJWYWx1ZXMsIG93LCByZWNvcmQsIHRhYmxlRmllbGRDb2RlcywgdGFibGVGaWVsZE1hcCwgdmFsdWVzO1xuICBmaWVsZENvZGVzID0gW107XG4gIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICBpZiAoZi50eXBlID09PSAnc2VjdGlvbicpIHtcbiAgICAgIHJldHVybiBfLmVhY2goZi5maWVsZHMsIGZ1bmN0aW9uKGZmKSB7XG4gICAgICAgIHJldHVybiBmaWVsZENvZGVzLnB1c2goZmYuY29kZSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpZWxkQ29kZXMucHVzaChmLmNvZGUpO1xuICAgIH1cbiAgfSk7XG4gIHZhbHVlcyA9IHt9O1xuICBvdyA9IENyZWF0b3IuQ29sbGVjdGlvbnMub2JqZWN0X3dvcmtmbG93cy5maW5kT25lKHtcbiAgICBvYmplY3RfbmFtZTogcmVjb3JkSWRzLm8sXG4gICAgZmxvd19pZDogZmxvd0lkXG4gIH0pO1xuICByZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLmZpbmRPbmUocmVjb3JkSWRzLmlkc1swXSk7XG4gIGlmIChvdyAmJiByZWNvcmQpIHtcbiAgICB0YWJsZUZpZWxkQ29kZXMgPSBbXTtcbiAgICB0YWJsZUZpZWxkTWFwID0gW107XG4gICAgb3cuZmllbGRfbWFwLmZvckVhY2goZnVuY3Rpb24oZm0pIHtcbiAgICAgIHZhciBmaWVsZHNPYmosIGxvb2t1cEZpZWxkTmFtZSwgbG9va3VwT2JqZWN0LCBvVGFibGVDb2RlLCBvYmplY3QsIG9iamVjdEZpZWxkLCBvYmplY3RGaWVsZE5hbWUsIHdUYWJsZUNvZGU7XG4gICAgICBpZiAoZm0ud29ya2Zsb3dfZmllbGQuaW5kZXhPZignLiQuJykgPiAwICYmIGZtLm9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA+IDApIHtcbiAgICAgICAgd1RhYmxlQ29kZSA9IGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJC4nKVswXTtcbiAgICAgICAgb1RhYmxlQ29kZSA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLiQuJylbMF07XG4gICAgICAgIGlmIChyZWNvcmQuaGFzT3duUHJvcGVydHkob1RhYmxlQ29kZSkgJiYgXy5pc0FycmF5KHJlY29yZFtvVGFibGVDb2RlXSkpIHtcbiAgICAgICAgICB0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxuICAgICAgICAgICAgb2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcbiAgICAgICAgICB9KSk7XG4gICAgICAgICAgcmV0dXJuIHRhYmxlRmllbGRNYXAucHVzaChmbSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZm0ub2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4nKSA+IDAgJiYgZm0ub2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID09PSAtMSkge1xuICAgICAgICBvYmplY3RGaWVsZE5hbWUgPSBmbS5vYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgbG9va3VwRmllbGROYW1lID0gZm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV07XG4gICAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlY29yZElkcy5vLCBzcGFjZUlkKTtcbiAgICAgICAgaWYgKG9iamVjdCkge1xuICAgICAgICAgIG9iamVjdEZpZWxkID0gb2JqZWN0LmZpZWxkc1tvYmplY3RGaWVsZE5hbWVdO1xuICAgICAgICAgIGlmIChvYmplY3RGaWVsZCAmJiAob2JqZWN0RmllbGQudHlwZSA9PT0gXCJsb29rdXBcIiB8fCBvYmplY3RGaWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikgJiYgIW9iamVjdEZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgICAgICBmaWVsZHNPYmogPSB7fTtcbiAgICAgICAgICAgIGZpZWxkc09ialtsb29rdXBGaWVsZE5hbWVdID0gMTtcbiAgICAgICAgICAgIGxvb2t1cE9iamVjdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpLmZpbmRPbmUocmVjb3JkW29iamVjdEZpZWxkTmFtZV0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiBmaWVsZHNPYmpcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGxvb2t1cE9iamVjdCkge1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXSA9IGxvb2t1cE9iamVjdFtsb29rdXBGaWVsZE5hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChyZWNvcmQuaGFzT3duUHJvcGVydHkoZm0ub2JqZWN0X2ZpZWxkKSkge1xuICAgICAgICByZXR1cm4gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXSA9IHJlY29yZFtmbS5vYmplY3RfZmllbGRdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIF8udW5pcSh0YWJsZUZpZWxkQ29kZXMpLmZvckVhY2goZnVuY3Rpb24odGZjKSB7XG4gICAgICB2YXIgYztcbiAgICAgIGMgPSBKU09OLnBhcnNlKHRmYyk7XG4gICAgICB2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXSA9IFtdO1xuICAgICAgcmV0dXJuIHJlY29yZFtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXS5mb3JFYWNoKGZ1bmN0aW9uKHRyKSB7XG4gICAgICAgIHZhciBuZXdUcjtcbiAgICAgICAgbmV3VHIgPSB7fTtcbiAgICAgICAgXy5lYWNoKHRyLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYmxlRmllbGRNYXAuZm9yRWFjaChmdW5jdGlvbih0Zm0pIHtcbiAgICAgICAgICAgIHZhciB3VGRDb2RlO1xuICAgICAgICAgICAgaWYgKHRmbS5vYmplY3RfZmllbGQgPT09IChjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlICsgJy4kLicgKyBrKSkge1xuICAgICAgICAgICAgICB3VGRDb2RlID0gdGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJC4nKVsxXTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5ld1RyW3dUZENvZGVdID0gdjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghXy5pc0VtcHR5KG5ld1RyKSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXS5wdXNoKG5ld1RyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKG93LmZpZWxkX21hcF9zY3JpcHQpIHtcbiAgICAgIF8uZXh0ZW5kKHZhbHVlcywgdXVmbG93TWFuYWdlci5ldmFsRmllbGRNYXBTY3JpcHQob3cuZmllbGRfbWFwX3NjcmlwdCwgcmVjb3JkSWRzLm8sIHNwYWNlSWQsIHJlY29yZElkcy5pZHNbMF0pKTtcbiAgICB9XG4gIH1cbiAgZmlsdGVyVmFsdWVzID0ge307XG4gIF8uZWFjaChfLmtleXModmFsdWVzKSwgZnVuY3Rpb24oaykge1xuICAgIGlmIChmaWVsZENvZGVzLmluY2x1ZGVzKGspKSB7XG4gICAgICByZXR1cm4gZmlsdGVyVmFsdWVzW2tdID0gdmFsdWVzW2tdO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmaWx0ZXJWYWx1ZXM7XG59O1xuXG51dWZsb3dNYW5hZ2VyLmV2YWxGaWVsZE1hcFNjcmlwdCA9IGZ1bmN0aW9uKGZpZWxkX21hcF9zY3JpcHQsIG9iamVjdE5hbWUsIHNwYWNlSWQsIG9iamVjdElkKSB7XG4gIHZhciBmdW5jLCByZWNvcmQsIHNjcmlwdCwgdmFsdWVzO1xuICByZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0TmFtZSwgc3BhY2VJZCkuZmluZE9uZShvYmplY3RJZCk7XG4gIHNjcmlwdCA9IFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocmVjb3JkKSB7IFwiICsgZmllbGRfbWFwX3NjcmlwdCArIFwiIH1cIjtcbiAgZnVuYyA9IF9ldmFsKHNjcmlwdCwgXCJmaWVsZF9tYXBfc2NyaXB0XCIpO1xuICB2YWx1ZXMgPSBmdW5jKHJlY29yZCk7XG4gIGlmIChfLmlzT2JqZWN0KHZhbHVlcykpIHtcbiAgICByZXR1cm4gdmFsdWVzO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJldmFsRmllbGRNYXBTY3JpcHQ6IOiEmuacrOi/lOWbnuWAvOexu+Wei+S4jeaYr+WvueixoVwiKTtcbiAgfVxuICByZXR1cm4ge307XG59O1xuXG51dWZsb3dNYW5hZ2VyLmluaXRpYXRlQXR0YWNoID0gZnVuY3Rpb24ocmVjb3JkSWRzLCBzcGFjZUlkLCBpbnNJZCwgYXBwcm92ZUlkKSB7XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbJ2Ntc19maWxlcyddLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHBhcmVudDogcmVjb3JkSWRzXG4gIH0pLmZvckVhY2goZnVuY3Rpb24oY2YpIHtcbiAgICByZXR1cm4gXy5lYWNoKGNmLnZlcnNpb25zLCBmdW5jdGlvbih2ZXJzaW9uSWQsIGlkeCkge1xuICAgICAgdmFyIGYsIG5ld0ZpbGU7XG4gICAgICBmID0gQ3JlYXRvci5Db2xsZWN0aW9uc1snY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXS5maW5kT25lKHZlcnNpb25JZCk7XG4gICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgIHJldHVybiBuZXdGaWxlLmF0dGFjaERhdGEoZi5jcmVhdGVSZWFkU3RyZWFtKCdmaWxlcycpLCB7XG4gICAgICAgIHR5cGU6IGYub3JpZ2luYWwudHlwZVxuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIHZhciBtZXRhZGF0YTtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyLmVycm9yLCBlcnIucmVhc29uKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm5hbWUoZi5uYW1lKCkpO1xuICAgICAgICBuZXdGaWxlLnNpemUoZi5zaXplKCkpO1xuICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICBvd25lcjogZi5tZXRhZGF0YS5vd25lcixcbiAgICAgICAgICBvd25lcl9uYW1lOiBmLm1ldGFkYXRhLm93bmVyX25hbWUsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgaW5zdGFuY2U6IGluc0lkLFxuICAgICAgICAgIGFwcHJvdmU6IGFwcHJvdmVJZCxcbiAgICAgICAgICBwYXJlbnQ6IGNmLl9pZFxuICAgICAgICB9O1xuICAgICAgICBpZiAoaWR4ID09PSAwKSB7XG4gICAgICAgICAgbWV0YWRhdGEuY3VycmVudCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICByZXR1cm4gY2ZzLmluc3RhbmNlcy5pbnNlcnQobmV3RmlsZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG51dWZsb3dNYW5hZ2VyLmluaXRpYXRlUmVjb3JkSW5zdGFuY2VJbmZvID0gZnVuY3Rpb24ocmVjb3JkSWRzLCBpbnNJZCwgc3BhY2VJZCkge1xuICBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVjb3JkSWRzLm8sIHNwYWNlSWQpLnVwZGF0ZShyZWNvcmRJZHMuaWRzWzBdLCB7XG4gICAgJHB1c2g6IHtcbiAgICAgIGluc3RhbmNlczoge1xuICAgICAgICAkZWFjaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIF9pZDogaW5zSWQsXG4gICAgICAgICAgICBzdGF0ZTogJ2RyYWZ0J1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgJHBvc2l0aW9uOiAwXG4gICAgICB9XG4gICAgfSxcbiAgICAkc2V0OiB7XG4gICAgICBsb2NrZWQ6IHRydWUsXG4gICAgICBpbnN0YW5jZV9zdGF0ZTogJ2RyYWZ0J1xuICAgIH1cbiAgfSk7XG59O1xuXG51dWZsb3dNYW5hZ2VyLmNoZWNrSXNJbkFwcHJvdmFsID0gZnVuY3Rpb24ocmVjb3JkSWRzLCBzcGFjZUlkKSB7XG4gIHZhciByZWNvcmQ7XG4gIHJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWNvcmRJZHMubywgc3BhY2VJZCkuZmluZE9uZSh7XG4gICAgX2lkOiByZWNvcmRJZHMuaWRzWzBdLFxuICAgIGluc3RhbmNlczoge1xuICAgICAgJGV4aXN0czogdHJ1ZVxuICAgIH1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgaW5zdGFuY2VzOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKHJlY29yZCAmJiByZWNvcmQuaW5zdGFuY2VzWzBdLnN0YXRlICE9PSAnY29tcGxldGVkJyAmJiBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kKHJlY29yZC5pbnN0YW5jZXNbMF0uX2lkKS5jb3VudCgpID4gMCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5q2k6K6w5b2V5bey5Y+R6LW35rWB56iL5q2j5Zyo5a6h5om55Lit77yM5b6F5a6h5om557uT5p2f5pa55Y+v5Y+R6LW35LiL5LiA5qyh5a6h5om577yBXCIpO1xuICB9XG59O1xuIiwiQnVzYm95ID0gcmVxdWlyZSgnYnVzYm95Jyk7XHJcbkZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XHJcblxyXG5Kc29uUm91dGVzLnBhcnNlRmlsZXMgPSAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0XHRmaWxlcyA9IFtdOyAjIFN0b3JlIGZpbGVzIGluIGFuIGFycmF5IGFuZCB0aGVuIHBhc3MgdGhlbSB0byByZXF1ZXN0LlxyXG5cdFx0aW1hZ2UgPSB7fTsgIyBjcmF0ZSBhbiBpbWFnZSBvYmplY3RcclxuXHJcblx0XHRpZiAocmVxLm1ldGhvZCA9PSBcIlBPU1RcIilcclxuXHRcdFx0YnVzYm95ID0gbmV3IEJ1c2JveSh7IGhlYWRlcnM6IHJlcS5oZWFkZXJzIH0pO1xyXG5cdFx0XHRidXNib3kub24gXCJmaWxlXCIsICAoZmllbGRuYW1lLCBmaWxlLCBmaWxlbmFtZSwgZW5jb2RpbmcsIG1pbWV0eXBlKSAtPlxyXG5cdFx0XHRcdGltYWdlLm1pbWVUeXBlID0gbWltZXR5cGU7XHJcblx0XHRcdFx0aW1hZ2UuZW5jb2RpbmcgPSBlbmNvZGluZztcclxuXHRcdFx0XHRpbWFnZS5maWxlbmFtZSA9IGZpbGVuYW1lO1xyXG5cclxuXHRcdFx0XHQjIGJ1ZmZlciB0aGUgcmVhZCBjaHVua3NcclxuXHRcdFx0XHRidWZmZXJzID0gW107XHJcblxyXG5cdFx0XHRcdGZpbGUub24gJ2RhdGEnLCAoZGF0YSkgLT5cclxuXHRcdFx0XHRcdGJ1ZmZlcnMucHVzaChkYXRhKTtcclxuXHJcblx0XHRcdFx0ZmlsZS5vbiAnZW5kJywgKCkgLT5cclxuXHRcdFx0XHRcdCMgY29uY2F0IHRoZSBjaHVua3NcclxuXHRcdFx0XHRcdGltYWdlLmRhdGEgPSBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMpO1xyXG5cdFx0XHRcdFx0IyBwdXNoIHRoZSBpbWFnZSBvYmplY3QgdG8gdGhlIGZpbGUgYXJyYXlcclxuXHRcdFx0XHRcdGZpbGVzLnB1c2goaW1hZ2UpO1xyXG5cclxuXHJcblx0XHRcdGJ1c2JveS5vbiBcImZpZWxkXCIsIChmaWVsZG5hbWUsIHZhbHVlKSAtPlxyXG5cdFx0XHRcdHJlcS5ib2R5W2ZpZWxkbmFtZV0gPSB2YWx1ZTtcclxuXHJcblx0XHRcdGJ1c2JveS5vbiBcImZpbmlzaFwiLCAgKCkgLT5cclxuXHRcdFx0XHQjIFBhc3MgdGhlIGZpbGUgYXJyYXkgdG9nZXRoZXIgd2l0aCB0aGUgcmVxdWVzdFxyXG5cdFx0XHRcdHJlcS5maWxlcyA9IGZpbGVzO1xyXG5cclxuXHRcdFx0XHRGaWJlciAoKS0+XHJcblx0XHRcdFx0XHRuZXh0KCk7XHJcblx0XHRcdFx0LnJ1bigpO1xyXG5cclxuXHRcdFx0IyBQYXNzIHJlcXVlc3QgdG8gYnVzYm95XHJcblx0XHRcdHJlcS5waXBlKGJ1c2JveSk7XHJcblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRuZXh0KCk7XHJcblxyXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvczMvXCIsICAocmVxLCByZXMsIG5leHQpIC0+XHJcblxyXG5cdEpzb25Sb3V0ZXMucGFyc2VGaWxlcyByZXEsIHJlcywgKCktPlxyXG5cdFx0Y29sbGVjdGlvbiA9IGNmcy5maWxlc1xyXG5cdFx0ZmlsZUNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldE9iamVjdChcImNtc19maWxlc1wiKS5kYlxyXG5cclxuXHRcdGlmIHJlcS5maWxlcyBhbmQgcmVxLmZpbGVzWzBdXHJcblxyXG5cdFx0XHRuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcclxuXHRcdFx0bmV3RmlsZS5hdHRhY2hEYXRhIHJlcS5maWxlc1swXS5kYXRhLCB7dHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlfSwgKGVycikgLT5cclxuXHRcdFx0XHRmaWxlbmFtZSA9IHJlcS5maWxlc1swXS5maWxlbmFtZVxyXG5cdFx0XHRcdGV4dGVudGlvbiA9IGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKClcclxuXHRcdFx0XHRpZiBbXCJpbWFnZS5qcGdcIiwgXCJpbWFnZS5naWZcIiwgXCJpbWFnZS5qcGVnXCIsIFwiaW1hZ2UucG5nXCJdLmluY2x1ZGVzKGZpbGVuYW1lLnRvTG93ZXJDYXNlKCkpXHJcblx0XHRcdFx0XHRmaWxlbmFtZSA9IFwiaW1hZ2UtXCIgKyBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KCdZWVlZTU1EREhIbW1zcycpICsgXCIuXCIgKyBleHRlbnRpb25cclxuXHJcblx0XHRcdFx0Ym9keSA9IHJlcS5ib2R5XHJcblx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRpZiBib2R5ICYmIChib2R5Wyd1cGxvYWRfZnJvbSddIGlzIFwiSUVcIiBvciBib2R5Wyd1cGxvYWRfZnJvbSddIGlzIFwibm9kZVwiKVxyXG5cdFx0XHRcdFx0XHRmaWxlbmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudChmaWxlbmFtZSlcclxuXHRcdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGZpbGVuYW1lKVxyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlXHJcblx0XHRcdFx0XHRmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoLyUvZywgXCItXCIpXHJcblxyXG5cdFx0XHRcdG5ld0ZpbGUubmFtZShmaWxlbmFtZSlcclxuXHJcblx0XHRcdFx0aWYgYm9keSAmJiBib2R5Wydvd25lciddICYmIGJvZHlbJ3NwYWNlJ10gJiYgYm9keVsncmVjb3JkX2lkJ10gICYmIGJvZHlbJ29iamVjdF9uYW1lJ11cclxuXHRcdFx0XHRcdHBhcmVudCA9IGJvZHlbJ3BhcmVudCddXHJcblx0XHRcdFx0XHRvd25lciA9IGJvZHlbJ293bmVyJ11cclxuXHRcdFx0XHRcdG93bmVyX25hbWUgPSBib2R5Wydvd25lcl9uYW1lJ11cclxuXHRcdFx0XHRcdHNwYWNlID0gYm9keVsnc3BhY2UnXVxyXG5cdFx0XHRcdFx0cmVjb3JkX2lkID0gYm9keVsncmVjb3JkX2lkJ11cclxuXHRcdFx0XHRcdG9iamVjdF9uYW1lID0gYm9keVsnb2JqZWN0X25hbWUnXVxyXG5cdFx0XHRcdFx0cGFyZW50ID0gYm9keVsncGFyZW50J11cclxuXHRcdFx0XHRcdG1ldGFkYXRhID0ge293bmVyOm93bmVyLCBvd25lcl9uYW1lOm93bmVyX25hbWUsIHNwYWNlOnNwYWNlLCByZWNvcmRfaWQ6cmVjb3JkX2lkLCBvYmplY3RfbmFtZTogb2JqZWN0X25hbWV9XHJcblx0XHRcdFx0XHRpZiBwYXJlbnRcclxuXHRcdFx0XHRcdFx0bWV0YWRhdGEucGFyZW50ID0gcGFyZW50XHJcblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGFcclxuXHRcdFx0XHRcdGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXHJcblxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXHJcblxyXG5cclxuXHRcdFx0XHRzaXplID0gZmlsZU9iai5vcmlnaW5hbC5zaXplXHJcblx0XHRcdFx0aWYgIXNpemVcclxuXHRcdFx0XHRcdHNpemUgPSAxMDI0XHJcblx0XHRcdFx0aWYgcGFyZW50XHJcblx0XHRcdFx0XHRmaWxlQ29sbGVjdGlvbi51cGRhdGUoe19pZDpwYXJlbnR9LHtcclxuXHRcdFx0XHRcdFx0JHNldDpcclxuXHRcdFx0XHRcdFx0XHRleHRlbnRpb246IGV4dGVudGlvblxyXG5cdFx0XHRcdFx0XHRcdHNpemU6IHNpemVcclxuXHRcdFx0XHRcdFx0XHRtb2RpZmllZDogKG5ldyBEYXRlKCkpXHJcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IG93bmVyXHJcblx0XHRcdFx0XHRcdCRwdXNoOlxyXG5cdFx0XHRcdFx0XHRcdHZlcnNpb25zOlxyXG5cdFx0XHRcdFx0XHRcdFx0JGVhY2g6IFsgZmlsZU9iai5faWQgXVxyXG5cdFx0XHRcdFx0XHRcdFx0JHBvc2l0aW9uOiAwXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdG5ld0ZpbGVPYmpJZCA9IGZpbGVDb2xsZWN0aW9uLmRpcmVjdC5pbnNlcnQge1xyXG5cdFx0XHRcdFx0XHRuYW1lOiBmaWxlbmFtZVxyXG5cdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogJydcclxuXHRcdFx0XHRcdFx0ZXh0ZW50aW9uOiBleHRlbnRpb25cclxuXHRcdFx0XHRcdFx0c2l6ZTogc2l6ZVxyXG5cdFx0XHRcdFx0XHR2ZXJzaW9uczogW2ZpbGVPYmouX2lkXVxyXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IHtvOm9iamVjdF9uYW1lLGlkczpbcmVjb3JkX2lkXX1cclxuXHRcdFx0XHRcdFx0b3duZXI6IG93bmVyXHJcblx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZVxyXG5cdFx0XHRcdFx0XHRjcmVhdGVkOiAobmV3IERhdGUoKSlcclxuXHRcdFx0XHRcdFx0Y3JlYXRlZF9ieTogb3duZXJcclxuXHRcdFx0XHRcdFx0bW9kaWZpZWQ6IChuZXcgRGF0ZSgpKVxyXG5cdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogb3duZXJcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGZpbGVPYmoudXBkYXRlKHskc2V0OiB7J21ldGFkYXRhLnBhcmVudCcgOiBuZXdGaWxlT2JqSWR9fSlcclxuXHJcblx0XHRcdFx0cmVzcCA9XHJcblx0XHRcdFx0XHR2ZXJzaW9uX2lkOiBmaWxlT2JqLl9pZCxcclxuXHRcdFx0XHRcdHNpemU6IHNpemVcclxuXHJcblx0XHRcdFx0cmVzLnNldEhlYWRlcihcIngtYW16LXZlcnNpb24taWRcIixmaWxlT2JqLl9pZCk7XHJcblx0XHRcdFx0cmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwKSk7XHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRlbHNlXHJcblx0XHRcdHJlcy5zdGF0dXNDb2RlID0gNTAwO1xyXG5cdFx0XHRyZXMuZW5kKCk7XHJcblxyXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvczMvOmNvbGxlY3Rpb25cIiwgIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHR0cnlcclxuXHRcdHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcylcclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKVxyXG5cclxuXHRcdGNvbGxlY3Rpb25OYW1lID0gcmVxLnBhcmFtcy5jb2xsZWN0aW9uXHJcblxyXG5cdFx0SnNvblJvdXRlcy5wYXJzZUZpbGVzIHJlcSwgcmVzLCAoKS0+XHJcblx0XHRcdGNvbGxlY3Rpb24gPSBjZnNbY29sbGVjdGlvbk5hbWVdXHJcblxyXG5cdFx0XHRpZiBub3QgY29sbGVjdGlvblxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIENvbGxlY3Rpb25cIilcclxuXHJcblx0XHRcdGlmIHJlcS5maWxlcyBhbmQgcmVxLmZpbGVzWzBdXHJcblxyXG5cdFx0XHRcdG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpXHJcblx0XHRcdFx0bmV3RmlsZS5uYW1lKHJlcS5maWxlc1swXS5maWxlbmFtZSlcclxuXHJcblx0XHRcdFx0aWYgcmVxLmJvZHlcclxuXHRcdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEgPSByZXEuYm9keVxyXG5cclxuXHRcdFx0XHRuZXdGaWxlLm93bmVyID0gdXNlcklkXHJcblx0XHRcdFx0bmV3RmlsZS5tZXRhZGF0YS5vd25lciA9IHVzZXJJZFxyXG5cclxuXHRcdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEgcmVxLmZpbGVzWzBdLmRhdGEsIHt0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGV9XHJcblxyXG5cdFx0XHRcdGNvbGxlY3Rpb24uaW5zZXJ0IG5ld0ZpbGVcclxuXHJcblx0XHRcdFx0cmVzdWx0RGF0YSA9IGNvbGxlY3Rpb24uZmlsZXMuZmluZE9uZShuZXdGaWxlLl9pZClcclxuXHRcdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdFx0XHRkYXRhOiByZXN1bHREYXRhXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBGaWxlXCIpXHJcblxyXG5cdFx0cmV0dXJuXHJcblx0Y2F0Y2ggZVxyXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdGNvZGU6IGUuZXJyb3IgfHwgNTAwXHJcblx0XHRcdGRhdGE6IHtlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZX1cclxuXHRcdH1cclxuXHJcblxyXG5cclxuZ2V0UXVlcnlTdHJpbmcgPSAoYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgcXVlcnksIG1ldGhvZCkgLT5cclxuXHRjb25zb2xlLmxvZyBcIi0tLS11dWZsb3dNYW5hZ2VyLmdldFF1ZXJ5U3RyaW5nLS0tLVwiXHJcblx0QUxZID0gcmVxdWlyZSgnYWxpeXVuLXNkaycpXHJcblx0ZGF0ZSA9IEFMWS51dGlsLmRhdGUuZ2V0RGF0ZSgpXHJcblxyXG5cdHF1ZXJ5LkZvcm1hdCA9IFwianNvblwiXHJcblx0cXVlcnkuVmVyc2lvbiA9IFwiMjAxNy0wMy0yMVwiXHJcblx0cXVlcnkuQWNjZXNzS2V5SWQgPSBhY2Nlc3NLZXlJZFxyXG5cdHF1ZXJ5LlNpZ25hdHVyZU1ldGhvZCA9IFwiSE1BQy1TSEExXCJcclxuXHRxdWVyeS5UaW1lc3RhbXAgPSBBTFkudXRpbC5kYXRlLmlzbzg2MDEoZGF0ZSlcclxuXHRxdWVyeS5TaWduYXR1cmVWZXJzaW9uID0gXCIxLjBcIlxyXG5cdHF1ZXJ5LlNpZ25hdHVyZU5vbmNlID0gU3RyaW5nKGRhdGUuZ2V0VGltZSgpKVxyXG5cclxuXHRxdWVyeUtleXMgPSBPYmplY3Qua2V5cyhxdWVyeSlcclxuXHRxdWVyeUtleXMuc29ydCgpXHJcblxyXG5cdGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyA9IFwiXCJcclxuXHRxdWVyeUtleXMuZm9yRWFjaCAobmFtZSkgLT5cclxuXHRcdGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyArPSBcIiZcIiArIG5hbWUgKyBcIj1cIiArIEFMWS51dGlsLnBvcEVzY2FwZShxdWVyeVtuYW1lXSlcclxuXHJcblx0c3RyaW5nVG9TaWduID0gbWV0aG9kLnRvVXBwZXJDYXNlKCkgKyAnJiUyRiYnICsgQUxZLnV0aWwucG9wRXNjYXBlKGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZy5zdWJzdHIoMSkpXHJcblxyXG5cdHF1ZXJ5LlNpZ25hdHVyZSA9IEFMWS51dGlsLmNyeXB0by5obWFjKHNlY3JldEFjY2Vzc0tleSArICcmJywgc3RyaW5nVG9TaWduLCAnYmFzZTY0JywgJ3NoYTEnKVxyXG5cclxuXHRxdWVyeVN0ciA9IEFMWS51dGlsLnF1ZXJ5UGFyYW1zVG9TdHJpbmcocXVlcnkpXHJcblx0Y29uc29sZS5sb2cgcXVlcnlTdHJcclxuXHRyZXR1cm4gcXVlcnlTdHJcclxuXHJcbkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9zMy92b2QvdXBsb2FkXCIsICAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0dHJ5XHJcblx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIHBlcm1pc3Npb25cIilcclxuXHJcblx0XHRjb2xsZWN0aW9uTmFtZSA9IFwidmlkZW9zXCJcclxuXHJcblx0XHRBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJylcclxuXHJcblx0XHRKc29uUm91dGVzLnBhcnNlRmlsZXMgcmVxLCByZXMsICgpLT5cclxuXHRcdFx0Y29sbGVjdGlvbiA9IGNmc1tjb2xsZWN0aW9uTmFtZV1cclxuXHJcblx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gQ29sbGVjdGlvblwiKVxyXG5cclxuXHRcdFx0aWYgcmVxLmZpbGVzIGFuZCByZXEuZmlsZXNbMF1cclxuXHJcblx0XHRcdFx0aWYgY29sbGVjdGlvbk5hbWUgaXMgJ3ZpZGVvcycgYW5kIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuY2ZzPy5zdG9yZSBpcyBcIk9TU1wiXHJcblx0XHRcdFx0XHRhY2Nlc3NLZXlJZCA9IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuPy5hY2Nlc3NLZXlJZFxyXG5cdFx0XHRcdFx0c2VjcmV0QWNjZXNzS2V5ID0gTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4/LnNlY3JldEFjY2Vzc0tleVxyXG5cclxuXHRcdFx0XHRcdGRhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKVxyXG5cclxuXHRcdFx0XHRcdHF1ZXJ5ID0ge1xyXG5cdFx0XHRcdFx0XHRBY3Rpb246IFwiQ3JlYXRlVXBsb2FkVmlkZW9cIlxyXG5cdFx0XHRcdFx0XHRUaXRsZTogcmVxLmZpbGVzWzBdLmZpbGVuYW1lXHJcblx0XHRcdFx0XHRcdEZpbGVOYW1lOiByZXEuZmlsZXNbMF0uZmlsZW5hbWVcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR1cmwgPSBcImh0dHA6Ly92b2QuY24tc2hhbmdoYWkuYWxpeXVuY3MuY29tLz9cIiArIGdldFF1ZXJ5U3RyaW5nKGFjY2Vzc0tleUlkLCBzZWNyZXRBY2Nlc3NLZXksIHF1ZXJ5LCAnR0VUJylcclxuXHJcblx0XHRcdFx0XHRyID0gSFRUUC5jYWxsICdHRVQnLCB1cmxcclxuXHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyByXHJcblxyXG5cdFx0XHRcdFx0aWYgci5kYXRhPy5WaWRlb0lkXHJcblx0XHRcdFx0XHRcdHZpZGVvSWQgPSByLmRhdGEuVmlkZW9JZFxyXG5cdFx0XHRcdFx0XHR1cGxvYWRBZGRyZXNzID0gSlNPTi5wYXJzZShuZXcgQnVmZmVyKHIuZGF0YS5VcGxvYWRBZGRyZXNzLCAnYmFzZTY0JykudG9TdHJpbmcoKSlcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cgdXBsb2FkQWRkcmVzc1xyXG5cdFx0XHRcdFx0XHR1cGxvYWRBdXRoID0gSlNPTi5wYXJzZShuZXcgQnVmZmVyKHIuZGF0YS5VcGxvYWRBdXRoLCAnYmFzZTY0JykudG9TdHJpbmcoKSlcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cgdXBsb2FkQXV0aFxyXG5cclxuXHRcdFx0XHRcdFx0b3NzID0gbmV3IEFMWS5PU1Moe1xyXG5cdFx0XHRcdFx0XHRcdFwiYWNjZXNzS2V5SWRcIjogdXBsb2FkQXV0aC5BY2Nlc3NLZXlJZCxcclxuXHRcdFx0XHRcdFx0XHRcInNlY3JldEFjY2Vzc0tleVwiOiB1cGxvYWRBdXRoLkFjY2Vzc0tleVNlY3JldCxcclxuXHRcdFx0XHRcdFx0XHRcImVuZHBvaW50XCI6IHVwbG9hZEFkZHJlc3MuRW5kcG9pbnQsXHJcblx0XHRcdFx0XHRcdFx0XCJhcGlWZXJzaW9uXCI6ICcyMDEzLTEwLTE1JyxcclxuXHRcdFx0XHRcdFx0XHRcInNlY3VyaXR5VG9rZW5cIjogdXBsb2FkQXV0aC5TZWN1cml0eVRva2VuXHJcblx0XHRcdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdFx0XHRvc3MucHV0T2JqZWN0IHtcclxuXHRcdFx0XHRcdFx0XHRCdWNrZXQ6IHVwbG9hZEFkZHJlc3MuQnVja2V0LFxyXG5cdFx0XHRcdFx0XHRcdEtleTogdXBsb2FkQWRkcmVzcy5GaWxlTmFtZSxcclxuXHRcdFx0XHRcdFx0XHRCb2R5OiByZXEuZmlsZXNbMF0uZGF0YSxcclxuXHRcdFx0XHRcdFx0XHRBY2Nlc3NDb250cm9sQWxsb3dPcmlnaW46ICcnLFxyXG5cdFx0XHRcdFx0XHRcdENvbnRlbnRUeXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGUsXHJcblx0XHRcdFx0XHRcdFx0Q2FjaGVDb250cm9sOiAnbm8tY2FjaGUnLFxyXG5cdFx0XHRcdFx0XHRcdENvbnRlbnREaXNwb3NpdGlvbjogJycsXHJcblx0XHRcdFx0XHRcdFx0Q29udGVudEVuY29kaW5nOiAndXRmLTgnLFxyXG5cdFx0XHRcdFx0XHRcdFNlcnZlclNpZGVFbmNyeXB0aW9uOiAnQUVTMjU2JyxcclxuXHRcdFx0XHRcdFx0XHRFeHBpcmVzOiBudWxsXHJcblx0XHRcdFx0XHRcdH0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQgKGVyciwgZGF0YSkgLT5cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgZXJyXHJcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnZXJyb3I6JywgZXJyKVxyXG5cdFx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIGVyci5tZXNzYWdlKVxyXG5cclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnc3VjY2VzczonLCBkYXRhKVxyXG5cclxuXHRcdFx0XHRcdFx0XHRuZXdEYXRlID0gQUxZLnV0aWwuZGF0ZS5nZXREYXRlKClcclxuXHJcblx0XHRcdFx0XHRcdFx0Z2V0UGxheUluZm9RdWVyeSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdEFjdGlvbjogJ0dldFBsYXlJbmZvJ1xyXG5cdFx0XHRcdFx0XHRcdFx0VmlkZW9JZDogdmlkZW9JZFxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Z2V0UGxheUluZm9VcmwgPSBcImh0dHA6Ly92b2QuY24tc2hhbmdoYWkuYWxpeXVuY3MuY29tLz9cIiArIGdldFF1ZXJ5U3RyaW5nKGFjY2Vzc0tleUlkLCBzZWNyZXRBY2Nlc3NLZXksIGdldFBsYXlJbmZvUXVlcnksICdHRVQnKVxyXG5cclxuXHRcdFx0XHRcdFx0XHRnZXRQbGF5SW5mb1Jlc3VsdCA9IEhUVFAuY2FsbCAnR0VUJywgZ2V0UGxheUluZm9VcmxcclxuXHJcblx0XHRcdFx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0XHRcdFx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YTogZ2V0UGxheUluZm9SZXN1bHRcclxuXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBGaWxlXCIpXHJcblxyXG5cdFx0cmV0dXJuXHJcblx0Y2F0Y2ggZVxyXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdGNvZGU6IGUuZXJyb3IgfHwgNTAwXHJcblx0XHRcdGRhdGE6IHtlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZX1cclxuXHRcdH0iLCJ2YXIgQnVzYm95LCBGaWJlciwgZ2V0UXVlcnlTdHJpbmc7XG5cbkJ1c2JveSA9IHJlcXVpcmUoJ2J1c2JveScpO1xuXG5GaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuXG5Kc29uUm91dGVzLnBhcnNlRmlsZXMgPSBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYnVzYm95LCBmaWxlcywgaW1hZ2U7XG4gIGZpbGVzID0gW107XG4gIGltYWdlID0ge307XG4gIGlmIChyZXEubWV0aG9kID09PSBcIlBPU1RcIikge1xuICAgIGJ1c2JveSA9IG5ldyBCdXNib3koe1xuICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnNcbiAgICB9KTtcbiAgICBidXNib3kub24oXCJmaWxlXCIsIGZ1bmN0aW9uKGZpZWxkbmFtZSwgZmlsZSwgZmlsZW5hbWUsIGVuY29kaW5nLCBtaW1ldHlwZSkge1xuICAgICAgdmFyIGJ1ZmZlcnM7XG4gICAgICBpbWFnZS5taW1lVHlwZSA9IG1pbWV0eXBlO1xuICAgICAgaW1hZ2UuZW5jb2RpbmcgPSBlbmNvZGluZztcbiAgICAgIGltYWdlLmZpbGVuYW1lID0gZmlsZW5hbWU7XG4gICAgICBidWZmZXJzID0gW107XG4gICAgICBmaWxlLm9uKCdkYXRhJywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICByZXR1cm4gYnVmZmVycy5wdXNoKGRhdGEpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZmlsZS5vbignZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGltYWdlLmRhdGEgPSBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMpO1xuICAgICAgICByZXR1cm4gZmlsZXMucHVzaChpbWFnZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBidXNib3kub24oXCJmaWVsZFwiLCBmdW5jdGlvbihmaWVsZG5hbWUsIHZhbHVlKSB7XG4gICAgICByZXR1cm4gcmVxLmJvZHlbZmllbGRuYW1lXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIGJ1c2JveS5vbihcImZpbmlzaFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHJlcS5maWxlcyA9IGZpbGVzO1xuICAgICAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgfSkucnVuKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcS5waXBlKGJ1c2JveSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5leHQoKTtcbiAgfVxufTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL3MzL1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5wYXJzZUZpbGVzKHJlcSwgcmVzLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZmlsZUNvbGxlY3Rpb24sIG5ld0ZpbGU7XG4gICAgY29sbGVjdGlvbiA9IGNmcy5maWxlcztcbiAgICBmaWxlQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0T2JqZWN0KFwiY21zX2ZpbGVzXCIpLmRiO1xuICAgIGlmIChyZXEuZmlsZXMgJiYgcmVxLmZpbGVzWzBdKSB7XG4gICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgIHJldHVybiBuZXdGaWxlLmF0dGFjaERhdGEocmVxLmZpbGVzWzBdLmRhdGEsIHtcbiAgICAgICAgdHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlXG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdmFyIGJvZHksIGUsIGV4dGVudGlvbiwgZmlsZU9iaiwgZmlsZW5hbWUsIG1ldGFkYXRhLCBuZXdGaWxlT2JqSWQsIG9iamVjdF9uYW1lLCBvd25lciwgb3duZXJfbmFtZSwgcGFyZW50LCByZWNvcmRfaWQsIHJlc3AsIHNpemUsIHNwYWNlO1xuICAgICAgICBmaWxlbmFtZSA9IHJlcS5maWxlc1swXS5maWxlbmFtZTtcbiAgICAgICAgZXh0ZW50aW9uID0gZmlsZW5hbWUuc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgICAgaWYgKFtcImltYWdlLmpwZ1wiLCBcImltYWdlLmdpZlwiLCBcImltYWdlLmpwZWdcIiwgXCJpbWFnZS5wbmdcIl0uaW5jbHVkZXMoZmlsZW5hbWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICBmaWxlbmFtZSA9IFwiaW1hZ2UtXCIgKyBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KCdZWVlZTU1EREhIbW1zcycpICsgXCIuXCIgKyBleHRlbnRpb247XG4gICAgICAgIH1cbiAgICAgICAgYm9keSA9IHJlcS5ib2R5O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChib2R5ICYmIChib2R5Wyd1cGxvYWRfZnJvbSddID09PSBcIklFXCIgfHwgYm9keVsndXBsb2FkX2Zyb20nXSA9PT0gXCJub2RlXCIpKSB7XG4gICAgICAgICAgICBmaWxlbmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudChmaWxlbmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGZpbGVuYW1lKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUucmVwbGFjZSgvJS9nLCBcIi1cIik7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RmlsZS5uYW1lKGZpbGVuYW1lKTtcbiAgICAgICAgaWYgKGJvZHkgJiYgYm9keVsnb3duZXInXSAmJiBib2R5WydzcGFjZSddICYmIGJvZHlbJ3JlY29yZF9pZCddICYmIGJvZHlbJ29iamVjdF9uYW1lJ10pIHtcbiAgICAgICAgICBwYXJlbnQgPSBib2R5WydwYXJlbnQnXTtcbiAgICAgICAgICBvd25lciA9IGJvZHlbJ293bmVyJ107XG4gICAgICAgICAgb3duZXJfbmFtZSA9IGJvZHlbJ293bmVyX25hbWUnXTtcbiAgICAgICAgICBzcGFjZSA9IGJvZHlbJ3NwYWNlJ107XG4gICAgICAgICAgcmVjb3JkX2lkID0gYm9keVsncmVjb3JkX2lkJ107XG4gICAgICAgICAgb2JqZWN0X25hbWUgPSBib2R5WydvYmplY3RfbmFtZSddO1xuICAgICAgICAgIHBhcmVudCA9IGJvZHlbJ3BhcmVudCddO1xuICAgICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgICAgICAgb3duZXJfbmFtZTogb3duZXJfbmFtZSxcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgICAgIHJlY29yZF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIHNpemUgPSBmaWxlT2JqLm9yaWdpbmFsLnNpemU7XG4gICAgICAgIGlmICghc2l6ZSkge1xuICAgICAgICAgIHNpemUgPSAxMDI0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICBmaWxlQ29sbGVjdGlvbi51cGRhdGUoe1xuICAgICAgICAgICAgX2lkOiBwYXJlbnRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgIGV4dGVudGlvbjogZXh0ZW50aW9uLFxuICAgICAgICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgbW9kaWZpZWRfYnk6IG93bmVyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJHB1c2g6IHtcbiAgICAgICAgICAgICAgdmVyc2lvbnM6IHtcbiAgICAgICAgICAgICAgICAkZWFjaDogW2ZpbGVPYmouX2lkXSxcbiAgICAgICAgICAgICAgICAkcG9zaXRpb246IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld0ZpbGVPYmpJZCA9IGZpbGVDb2xsZWN0aW9uLmRpcmVjdC5pbnNlcnQoe1xuICAgICAgICAgICAgbmFtZTogZmlsZW5hbWUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICBleHRlbnRpb246IGV4dGVudGlvbixcbiAgICAgICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgICAgICB2ZXJzaW9uczogW2ZpbGVPYmouX2lkXSxcbiAgICAgICAgICAgIHBhcmVudDoge1xuICAgICAgICAgICAgICBvOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICAgICAgaWRzOiBbcmVjb3JkX2lkXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBjcmVhdGVkX2J5OiBvd25lcixcbiAgICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IG93bmVyXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZmlsZU9iai51cGRhdGUoe1xuICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAnbWV0YWRhdGEucGFyZW50JzogbmV3RmlsZU9iaklkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzcCA9IHtcbiAgICAgICAgICB2ZXJzaW9uX2lkOiBmaWxlT2JqLl9pZCxcbiAgICAgICAgICBzaXplOiBzaXplXG4gICAgICAgIH07XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoXCJ4LWFtei12ZXJzaW9uLWlkXCIsIGZpbGVPYmouX2lkKTtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwKSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG4gICAgICByZXR1cm4gcmVzLmVuZCgpO1xuICAgIH1cbiAgfSk7XG59KTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL3MzLzpjb2xsZWN0aW9uXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBjb2xsZWN0aW9uTmFtZSwgZSwgdXNlcklkO1xuICB0cnkge1xuICAgIHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcyk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIHBlcm1pc3Npb25cIik7XG4gICAgfVxuICAgIGNvbGxlY3Rpb25OYW1lID0gcmVxLnBhcmFtcy5jb2xsZWN0aW9uO1xuICAgIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyhyZXEsIHJlcywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgbmV3RmlsZSwgcmVzdWx0RGF0YTtcbiAgICAgIGNvbGxlY3Rpb24gPSBjZnNbY29sbGVjdGlvbk5hbWVdO1xuICAgICAgaWYgKCFjb2xsZWN0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIENvbGxlY3Rpb25cIik7XG4gICAgICB9XG4gICAgICBpZiAocmVxLmZpbGVzICYmIHJlcS5maWxlc1swXSkge1xuICAgICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgICAgbmV3RmlsZS5uYW1lKHJlcS5maWxlc1swXS5maWxlbmFtZSk7XG4gICAgICAgIGlmIChyZXEuYm9keSkge1xuICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSByZXEuYm9keTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm93bmVyID0gdXNlcklkO1xuICAgICAgICBuZXdGaWxlLm1ldGFkYXRhLm93bmVyID0gdXNlcklkO1xuICAgICAgICBuZXdGaWxlLmF0dGFjaERhdGEocmVxLmZpbGVzWzBdLmRhdGEsIHtcbiAgICAgICAgICB0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGVcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbGxlY3Rpb24uaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgICByZXN1bHREYXRhID0gY29sbGVjdGlvbi5maWxlcy5maW5kT25lKG5ld0ZpbGUuX2lkKTtcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICBkYXRhOiByZXN1bHREYXRhXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gRmlsZVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogZS5lcnJvciB8fCA1MDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuXG5nZXRRdWVyeVN0cmluZyA9IGZ1bmN0aW9uKGFjY2Vzc0tleUlkLCBzZWNyZXRBY2Nlc3NLZXksIHF1ZXJ5LCBtZXRob2QpIHtcbiAgdmFyIEFMWSwgY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nLCBkYXRlLCBxdWVyeUtleXMsIHF1ZXJ5U3RyLCBzdHJpbmdUb1NpZ247XG4gIGNvbnNvbGUubG9nKFwiLS0tLXV1Zmxvd01hbmFnZXIuZ2V0UXVlcnlTdHJpbmctLS0tXCIpO1xuICBBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJyk7XG4gIGRhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKTtcbiAgcXVlcnkuRm9ybWF0ID0gXCJqc29uXCI7XG4gIHF1ZXJ5LlZlcnNpb24gPSBcIjIwMTctMDMtMjFcIjtcbiAgcXVlcnkuQWNjZXNzS2V5SWQgPSBhY2Nlc3NLZXlJZDtcbiAgcXVlcnkuU2lnbmF0dXJlTWV0aG9kID0gXCJITUFDLVNIQTFcIjtcbiAgcXVlcnkuVGltZXN0YW1wID0gQUxZLnV0aWwuZGF0ZS5pc284NjAxKGRhdGUpO1xuICBxdWVyeS5TaWduYXR1cmVWZXJzaW9uID0gXCIxLjBcIjtcbiAgcXVlcnkuU2lnbmF0dXJlTm9uY2UgPSBTdHJpbmcoZGF0ZS5nZXRUaW1lKCkpO1xuICBxdWVyeUtleXMgPSBPYmplY3Qua2V5cyhxdWVyeSk7XG4gIHF1ZXJ5S2V5cy5zb3J0KCk7XG4gIGNhbm9uaWNhbGl6ZWRRdWVyeVN0cmluZyA9IFwiXCI7XG4gIHF1ZXJ5S2V5cy5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gY2Fub25pY2FsaXplZFF1ZXJ5U3RyaW5nICs9IFwiJlwiICsgbmFtZSArIFwiPVwiICsgQUxZLnV0aWwucG9wRXNjYXBlKHF1ZXJ5W25hbWVdKTtcbiAgfSk7XG4gIHN0cmluZ1RvU2lnbiA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpICsgJyYlMkYmJyArIEFMWS51dGlsLnBvcEVzY2FwZShjYW5vbmljYWxpemVkUXVlcnlTdHJpbmcuc3Vic3RyKDEpKTtcbiAgcXVlcnkuU2lnbmF0dXJlID0gQUxZLnV0aWwuY3J5cHRvLmhtYWMoc2VjcmV0QWNjZXNzS2V5ICsgJyYnLCBzdHJpbmdUb1NpZ24sICdiYXNlNjQnLCAnc2hhMScpO1xuICBxdWVyeVN0ciA9IEFMWS51dGlsLnF1ZXJ5UGFyYW1zVG9TdHJpbmcocXVlcnkpO1xuICBjb25zb2xlLmxvZyhxdWVyeVN0cik7XG4gIHJldHVybiBxdWVyeVN0cjtcbn07XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9zMy92b2QvdXBsb2FkXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBBTFksIGNvbGxlY3Rpb25OYW1lLCBlLCB1c2VySWQ7XG4gIHRyeSB7XG4gICAgdXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKTtcbiAgICB9XG4gICAgY29sbGVjdGlvbk5hbWUgPSBcInZpZGVvc1wiO1xuICAgIEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKTtcbiAgICBKc29uUm91dGVzLnBhcnNlRmlsZXMocmVxLCByZXMsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFjY2Vzc0tleUlkLCBjb2xsZWN0aW9uLCBkYXRlLCBvc3MsIHF1ZXJ5LCByLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHNlY3JldEFjY2Vzc0tleSwgdXBsb2FkQWRkcmVzcywgdXBsb2FkQXV0aCwgdXJsLCB2aWRlb0lkO1xuICAgICAgY29sbGVjdGlvbiA9IGNmc1tjb2xsZWN0aW9uTmFtZV07XG4gICAgICBpZiAoIWNvbGxlY3Rpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gQ29sbGVjdGlvblwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXEuZmlsZXMgJiYgcmVxLmZpbGVzWzBdKSB7XG4gICAgICAgIGlmIChjb2xsZWN0aW9uTmFtZSA9PT0gJ3ZpZGVvcycgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0uY2ZzKSAhPSBudWxsID8gcmVmLnN0b3JlIDogdm9pZCAwKSA9PT0gXCJPU1NcIikge1xuICAgICAgICAgIGFjY2Vzc0tleUlkID0gKHJlZjEgPSBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bikgIT0gbnVsbCA/IHJlZjEuYWNjZXNzS2V5SWQgOiB2b2lkIDA7XG4gICAgICAgICAgc2VjcmV0QWNjZXNzS2V5ID0gKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bikgIT0gbnVsbCA/IHJlZjIuc2VjcmV0QWNjZXNzS2V5IDogdm9pZCAwO1xuICAgICAgICAgIGRhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKTtcbiAgICAgICAgICBxdWVyeSA9IHtcbiAgICAgICAgICAgIEFjdGlvbjogXCJDcmVhdGVVcGxvYWRWaWRlb1wiLFxuICAgICAgICAgICAgVGl0bGU6IHJlcS5maWxlc1swXS5maWxlbmFtZSxcbiAgICAgICAgICAgIEZpbGVOYW1lOiByZXEuZmlsZXNbMF0uZmlsZW5hbWVcbiAgICAgICAgICB9O1xuICAgICAgICAgIHVybCA9IFwiaHR0cDovL3ZvZC5jbi1zaGFuZ2hhaS5hbGl5dW5jcy5jb20vP1wiICsgZ2V0UXVlcnlTdHJpbmcoYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgcXVlcnksICdHRVQnKTtcbiAgICAgICAgICByID0gSFRUUC5jYWxsKCdHRVQnLCB1cmwpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHIpO1xuICAgICAgICAgIGlmICgocmVmMyA9IHIuZGF0YSkgIT0gbnVsbCA/IHJlZjMuVmlkZW9JZCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgdmlkZW9JZCA9IHIuZGF0YS5WaWRlb0lkO1xuICAgICAgICAgICAgdXBsb2FkQWRkcmVzcyA9IEpTT04ucGFyc2UobmV3IEJ1ZmZlcihyLmRhdGEuVXBsb2FkQWRkcmVzcywgJ2Jhc2U2NCcpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codXBsb2FkQWRkcmVzcyk7XG4gICAgICAgICAgICB1cGxvYWRBdXRoID0gSlNPTi5wYXJzZShuZXcgQnVmZmVyKHIuZGF0YS5VcGxvYWRBdXRoLCAnYmFzZTY0JykudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1cGxvYWRBdXRoKTtcbiAgICAgICAgICAgIG9zcyA9IG5ldyBBTFkuT1NTKHtcbiAgICAgICAgICAgICAgXCJhY2Nlc3NLZXlJZFwiOiB1cGxvYWRBdXRoLkFjY2Vzc0tleUlkLFxuICAgICAgICAgICAgICBcInNlY3JldEFjY2Vzc0tleVwiOiB1cGxvYWRBdXRoLkFjY2Vzc0tleVNlY3JldCxcbiAgICAgICAgICAgICAgXCJlbmRwb2ludFwiOiB1cGxvYWRBZGRyZXNzLkVuZHBvaW50LFxuICAgICAgICAgICAgICBcImFwaVZlcnNpb25cIjogJzIwMTMtMTAtMTUnLFxuICAgICAgICAgICAgICBcInNlY3VyaXR5VG9rZW5cIjogdXBsb2FkQXV0aC5TZWN1cml0eVRva2VuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBvc3MucHV0T2JqZWN0KHtcbiAgICAgICAgICAgICAgQnVja2V0OiB1cGxvYWRBZGRyZXNzLkJ1Y2tldCxcbiAgICAgICAgICAgICAgS2V5OiB1cGxvYWRBZGRyZXNzLkZpbGVOYW1lLFxuICAgICAgICAgICAgICBCb2R5OiByZXEuZmlsZXNbMF0uZGF0YSxcbiAgICAgICAgICAgICAgQWNjZXNzQ29udHJvbEFsbG93T3JpZ2luOiAnJyxcbiAgICAgICAgICAgICAgQ29udGVudFR5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZSxcbiAgICAgICAgICAgICAgQ2FjaGVDb250cm9sOiAnbm8tY2FjaGUnLFxuICAgICAgICAgICAgICBDb250ZW50RGlzcG9zaXRpb246ICcnLFxuICAgICAgICAgICAgICBDb250ZW50RW5jb2Rpbmc6ICd1dGYtOCcsXG4gICAgICAgICAgICAgIFNlcnZlclNpZGVFbmNyeXB0aW9uOiAnQUVTMjU2JyxcbiAgICAgICAgICAgICAgRXhwaXJlczogbnVsbFxuICAgICAgICAgICAgfSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgICAgdmFyIGdldFBsYXlJbmZvUXVlcnksIGdldFBsYXlJbmZvUmVzdWx0LCBnZXRQbGF5SW5mb1VybCwgbmV3RGF0ZTtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjonLCBlcnIpO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3N1Y2Nlc3M6JywgZGF0YSk7XG4gICAgICAgICAgICAgIG5ld0RhdGUgPSBBTFkudXRpbC5kYXRlLmdldERhdGUoKTtcbiAgICAgICAgICAgICAgZ2V0UGxheUluZm9RdWVyeSA9IHtcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdHZXRQbGF5SW5mbycsXG4gICAgICAgICAgICAgICAgVmlkZW9JZDogdmlkZW9JZFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBnZXRQbGF5SW5mb1VybCA9IFwiaHR0cDovL3ZvZC5jbi1zaGFuZ2hhaS5hbGl5dW5jcy5jb20vP1wiICsgZ2V0UXVlcnlTdHJpbmcoYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgZ2V0UGxheUluZm9RdWVyeSwgJ0dFVCcpO1xuICAgICAgICAgICAgICBnZXRQbGF5SW5mb1Jlc3VsdCA9IEhUVFAuY2FsbCgnR0VUJywgZ2V0UGxheUluZm9VcmwpO1xuICAgICAgICAgICAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBnZXRQbGF5SW5mb1Jlc3VsdFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIEZpbGVcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IGUuZXJyb3IgfHwgNTAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvd29ya2Zsb3cvZHJhZnRzJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxyXG5cdFx0Y3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkXHJcblxyXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxyXG5cclxuXHRcdGluc2VydGVkX2luc3RhbmNlcyA9IG5ldyBBcnJheVxyXG5cclxuXHRcdF8uZWFjaCBoYXNoRGF0YVsnSW5zdGFuY2VzJ10sIChpbnN0YW5jZV9mcm9tX2NsaWVudCkgLT5cclxuXHRcdFx0bmV3X2luc19pZCA9IHV1Zmxvd01hbmFnZXIuY3JlYXRlX2luc3RhbmNlKGluc3RhbmNlX2Zyb21fY2xpZW50LCBjdXJyZW50X3VzZXJfaW5mbylcclxuXHJcblx0XHRcdG5ld19pbnMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zLmluc3RhbmNlcy5maW5kT25lKHsgX2lkOiBuZXdfaW5zX2lkIH0sIHsgZmllbGRzOiB7IHNwYWNlOiAxLCBmbG93OiAxLCBmbG93X3ZlcnNpb246IDEsIGZvcm06IDEsIGZvcm1fdmVyc2lvbjogMSB9IH0pXHJcblxyXG5cdFx0XHRpbnNlcnRlZF9pbnN0YW5jZXMucHVzaChuZXdfaW5zKVxyXG5cclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdGRhdGE6IHsgaW5zZXJ0czogaW5zZXJ0ZWRfaW5zdGFuY2VzIH1cclxuXHRcdH1cclxuXHRjYXRjaCBlXHJcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbeyBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XSB9XHJcblx0XHR9XHJcblxyXG4iLCJKc29uUm91dGVzLmFkZCgncG9zdCcsICcvYXBpL3dvcmtmbG93L2RyYWZ0cycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBjdXJyZW50X3VzZXJfaWQsIGN1cnJlbnRfdXNlcl9pbmZvLCBlLCBoYXNoRGF0YSwgaW5zZXJ0ZWRfaW5zdGFuY2VzO1xuICB0cnkge1xuICAgIGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSk7XG4gICAgY3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkO1xuICAgIGhhc2hEYXRhID0gcmVxLmJvZHk7XG4gICAgaW5zZXJ0ZWRfaW5zdGFuY2VzID0gbmV3IEFycmF5O1xuICAgIF8uZWFjaChoYXNoRGF0YVsnSW5zdGFuY2VzJ10sIGZ1bmN0aW9uKGluc3RhbmNlX2Zyb21fY2xpZW50KSB7XG4gICAgICB2YXIgbmV3X2lucywgbmV3X2luc19pZDtcbiAgICAgIG5ld19pbnNfaWQgPSB1dWZsb3dNYW5hZ2VyLmNyZWF0ZV9pbnN0YW5jZShpbnN0YW5jZV9mcm9tX2NsaWVudCwgY3VycmVudF91c2VyX2luZm8pO1xuICAgICAgbmV3X2lucyA9IENyZWF0b3IuQ29sbGVjdGlvbnMuaW5zdGFuY2VzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IG5ld19pbnNfaWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgc3BhY2U6IDEsXG4gICAgICAgICAgZmxvdzogMSxcbiAgICAgICAgICBmbG93X3ZlcnNpb246IDEsXG4gICAgICAgICAgZm9ybTogMSxcbiAgICAgICAgICBmb3JtX3ZlcnNpb246IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gaW5zZXJ0ZWRfaW5zdGFuY2VzLnB1c2gobmV3X2lucyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgaW5zZXJ0czogaW5zZXJ0ZWRfaW5zdGFuY2VzXG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iXX0=
