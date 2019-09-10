(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Random = Package.random.Random;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var check = Package.check.check;
var Match = Package.check.Match;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var Restivus = Package['nimble:restivus'].Restivus;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var Tabular = Package['aldeed:tabular'].Tabular;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var SubsManager = Package['meteorhacks:subs-manager'].SubsManager;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/steedos_object-database/i18n/en.i18n.json.js                                               //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
Package['universe:i18n'].i18n.addTranslations('en','',{"is_enable":"已启用","objects":"对象","objects_name":"对象名","objects_label":"显示名称","objects_icon":"图标","objects_is_view":"视图","objects_is_enable":"已启用","objects_enable_search":"允许搜索","objects_enable_files":"允许上传附件","objects_enable_tasks":"允许添加任务","objects_enable_notes":"允许添加备注","objects_enable_events":"允许添加事件","objects_enable_chatter":"允许添加评论","objects_enable_audit":"记录字段历史","objects_enable_api":"允许 API 访问","objects_enable_share":"允许共享记录","objects_enable_instances":"允许查看申请单","objects_description":"描述","object_fields":"字段","object_fields_name":"字段名","object_fields_label":"显示名称","object_fields_object":"所属对象","object_fields_type":"字段类型","object_fields_group":"字段分组","object_fields_defaultValue":"默认值","object_fields_allowedValues":"允许的值","object_fields_multiple":"多选","object_fields_required":"必填","object_fields_is_wide":"宽字段","object_fields_readonly":"只读","object_fields_disabled":"禁用","object_fields_omit":"忽略","object_fields_index":"创建索引","object_fields_sortable":"可排序","object_fields_reference_to":"引用对象","object_fields_rows":"多行文本行数","object_fields_precision":"精度(数字长度)","object_fields_scale":"小数位数","object_fields_options":"选择项","object_fields_description":"描述","object_fields_searchable":"可搜索","object_triggers":"触发器","object_triggers_name":"名称","object_triggers_label":"显示名称","object_triggers_object":"所属对象","object_triggers_on":"运行于","object_triggers_when":"运行时","object_triggers_is_enable":"已启用","object_triggers_todo":"执行的脚本","object_actions":"操作","object_actions_name":"名称","object_actions_label":"显示名称","object_actions_object":"所属对象","object_actions_is_enable":"已启用","object_actions_visible":"visible","object_actions_on":"显示位置","object_actions_todo":"执行的脚本"});
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/steedos_object-database/i18n/zh-CN.i18n.json.js                                            //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
Package['universe:i18n'].i18n.addTranslations('zh-CN','',{"is_enable":"已启用","objects":"对象","objects_name":"对象名","objects_label":"显示名称","objects_icon":"图标","objects_is_view":"视图","objects_is_enable":"已启用","objects_enable_search":"允许搜索","objects_enable_files":"允许上传附件","objects_enable_tasks":"允许添加任务","objects_enable_notes":"允许添加备注","objects_enable_events":"允许添加事件","objects_enable_chatter":"允许添加评论","objects_enable_audit":"记录字段历史","objects_enable_api":"允许 API 访问","objects_enable_share":"允许共享记录","objects_enable_instances":"允许查看申请单","objects_description":"描述","object_fields":"字段","object_fields_name":"字段名","object_fields_label":"显示名称","object_fields_object":"所属对象","object_fields_type":"字段类型","object_fields_group":"字段分组","object_fields_defaultValue":"默认值","object_fields_allowedValues":"允许的值","object_fields_multiple":"多选","object_fields_required":"必填","object_fields_is_wide":"宽字段","object_fields_readonly":"只读","object_fields_disabled":"禁用","object_fields_omit":"忽略","object_fields_index":"创建索引","object_fields_sortable":"可排序","object_fields_reference_to":"引用对象","object_fields_rows":"多行文本行数","object_fields_precision":"精度(数字长度)","object_fields_scale":"小数位数","object_fields_options":"选择项","object_fields_description":"描述","object_fields_searchable":"可搜索","object_triggers":"触发器","object_triggers_name":"名称","object_triggers_label":"显示名称","object_triggers_object":"所属对象","object_triggers_on":"运行于","object_triggers_when":"运行时","object_triggers_is_enable":"已启用","object_triggers_todo":"执行的脚本","object_actions":"操作","object_actions_name":"名称","object_actions_label":"显示名称","object_actions_object":"所属对象","object_actions_is_enable":"已启用","object_actions_visible":"visible","object_actions_on":"显示位置","object_actions_todo":"执行的脚本"});
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/steedos_object-database/models/object.coffee                                               //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var isRepeatedName;

isRepeatedName = function (doc) {
  var other;
  other = Creator.getCollection("objects").find({
    _id: {
      $ne: doc._id
    },
    space: doc.space,
    name: doc.name
  }, {
    fields: {
      _id: 1
    }
  });

  if (other.count() > 0) {
    return true;
  }

  return false;
};

Creator.Objects.objects = {
  name: "objects",
  icon: "orders",
  label: "对象",
  fields: {
    name: {
      type: "text",
      searchable: true,
      index: true,
      required: true,
      regEx: SimpleSchema.RegEx.code
    },
    label: {
      type: "text",
      required: true
    },
    icon: {
      type: "lookup",
      optionsFunction: function () {
        var options;
        options = [];

        _.forEach(Creator.resources.sldsIcons.standard, function (svg) {
          return options.push({
            value: svg,
            label: svg,
            icon: svg
          });
        });

        return options;
      }
    },
    is_enable: {
      type: "boolean",
      defaultValue: true
    },
    enable_search: {
      type: "boolean"
    },
    enable_files: {
      type: "boolean"
    },
    enable_tasks: {
      type: "boolean"
    },
    enable_notes: {
      type: "boolean"
    },
    enable_events: {
      type: "boolean"
    },
    enable_api: {
      type: "boolean",
      defaultValue: true,
      hidden: true
    },
    enable_share: {
      type: "boolean",
      defaultValue: false
    },
    enable_instances: {
      type: "boolean"
    },
    enable_chatter: {
      type: "boolean"
    },
    enable_audit: {
      type: "boolean"
    },
    enable_trash: {
      type: "boolean"
    },
    enable_space_global: {
      type: "boolean",
      defaultValue: false
    },
    is_view: {
      type: 'boolean',
      defaultValue: false,
      omit: true
    },
    hidden: {
      label: "隐藏",
      type: "boolean",
      omit: true
    },
    description: {
      label: "Description",
      type: "textarea",
      is_wide: true
    },
    sidebar: {
      type: "object",
      label: "左侧列表",
      blackbox: true,
      omit: true,
      hidden: true
    },
    fields: {
      type: "object",
      label: "字段",
      blackbox: true,
      omit: true,
      hidden: true
    },
    list_views: {
      type: "object",
      label: "列表视图",
      blackbox: true,
      omit: true,
      hidden: true
    },
    actions: {
      type: "object",
      label: "操作",
      blackbox: true,
      omit: true,
      hidden: true
    },
    permission_set: {
      type: "object",
      label: "权限设置",
      blackbox: true,
      omit: true,
      hidden: true
    },
    triggers: {
      type: "object",
      label: "触发器",
      blackbox: true,
      omit: true,
      hidden: true
    },
    custom: {
      label: "规则",
      type: "boolean",
      omit: true
    },
    owner: {
      type: "lookup",
      hidden: true
    },
    app_unique_id: {
      type: 'text',
      hidden: true
    },
    app_version: {
      type: 'text',
      hidden: true
    }
  },
  list_views: {
    all: {
      columns: ["name", "label", "is_enable", "modified"],
      label: "全部",
      filter_scope: "space"
    }
  },
  permission_set: {
    user: {
      allowCreate: false,
      allowDelete: false,
      allowEdit: false,
      allowRead: false,
      modifyAllRecords: false,
      viewAllRecords: false
    },
    admin: {
      allowCreate: true,
      allowDelete: true,
      allowEdit: true,
      allowRead: true,
      modifyAllRecords: true,
      viewAllRecords: true
    }
  },
  actions: {
    copy_odata: {
      label: "复制OData网址",
      visible: true,
      on: "record",
      todo: function (object_name, record_id, item_element) {
        var clipboard, o_name, path, record;
        record = Creator.getObjectById(record_id);

        if ((record != null ? record.enable_api : void 0) || true) {
          o_name = record != null ? record.name : void 0;
          path = SteedosOData.getODataPath(Session.get("spaceId"), o_name);
          item_element.attr('data-clipboard-text', path);

          if (!item_element.attr('data-clipboard-new')) {
            clipboard = new Clipboard(item_element[0]);
            item_element.attr('data-clipboard-new', true);
            clipboard.on('success', function (e) {
              return toastr.success('复制成功');
            });
            clipboard.on('error', function (e) {
              toastr.error('复制失败');
              return console.error("e");
            });

            if (item_element[0].tagName === 'LI' || item_element.hasClass('view-action')) {
              return item_element.trigger("click");
            }
          }
        } else {
          return toastr.error('复制失败: 未启用API');
        }
      }
    }
  },
  triggers: {
    "before.insert.server.objects": {
      on: "server",
      when: "before.insert",
      todo: function (userId, doc) {
        if (isRepeatedName(doc)) {
          console.log("object对象名称不能重复" + doc.name);
          throw new Meteor.Error(500, "对象名称不能重复");
        }

        return doc.custom = true;
      }
    },
    "before.update.server.objects": {
      on: "server",
      when: "before.update",
      todo: function (userId, doc, fieldNames, modifier, options) {
        var ref;

        if ((modifier != null ? (ref = modifier.$set) != null ? ref.name : void 0 : void 0) && doc.name !== modifier.$set.name) {
          console.log("不能修改name");
          throw new Meteor.Error(500, "不能修改对象名");
        }

        if (modifier.$set) {
          modifier.$set.custom = true;
        }

        if (modifier.$unset && modifier.$unset.custom) {
          return delete modifier.$unset.custom;
        }
      }
    },
    "after.insert.server.objects": {
      on: "server",
      when: "after.insert",
      todo: function (userId, doc) {
        Creator.getCollection("object_fields").insert({
          object: doc.name,
          owner: userId,
          name: "name",
          space: doc.space,
          type: "text",
          required: true,
          index: true,
          searchable: true
        });
        Creator.getCollection("object_listviews").insert({
          name: "all",
          space: doc.space,
          owner: userId,
          object_name: doc.name,
          shared: true,
          filter_scope: "space",
          columns: ["name"]
        });
        return Creator.getCollection("object_listviews").insert({
          name: "recent",
          space: doc.space,
          owner: userId,
          object_name: doc.name,
          shared: true,
          filter_scope: "space",
          columns: ["name"]
        });
      }
    },
    "before.remove.server.objects": {
      on: "server",
      when: "before.remove",
      todo: function (userId, doc) {
        var documents, object_collections;

        if (doc.app_unique_id && doc.app_version) {
          return;
        }

        object_collections = Creator.getCollection(doc.name, doc.space);
        documents = object_collections.find({}, {
          fields: {
            _id: 1
          }
        });

        if (documents.count() > 0) {
          throw new Meteor.Error(500, "对象(" + doc.name + ")中已经有记录，请先删除记录后， 再删除此对象");
        }
      }
    },
    "after.remove.server.objects": {
      on: "server",
      when: "after.remove",
      todo: function (userId, doc) {
        var e;
        Creator.getCollection("object_fields").direct.remove({
          object: doc.name,
          space: doc.space
        });
        Creator.getCollection("object_actions").direct.remove({
          object: doc.name,
          space: doc.space
        });
        Creator.getCollection("object_triggers").direct.remove({
          object: doc.name,
          space: doc.space
        });
        Creator.getCollection("permission_objects").direct.remove({
          object_name: doc.name,
          space: doc.space
        });
        Creator.getCollection("object_listviews").direct.remove({
          object_name: doc.name,
          space: doc.space
        });
        console.log("drop collection", doc.name);

        try {
          return Creator.Collections["c_" + doc.space + "_" + doc.name]._collection.dropCollection();
        } catch (error) {
          e = error;
          console.error("c_" + doc.space + "_" + doc.name, "" + e.stack);
          throw new Meteor.Error(500, "对象(" + doc.name + ")不存在或已被删除");
        }
      }
    }
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/steedos_object-database/models/object_fields.coffee                                        //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _syncToObject, isRepeatedName;

_syncToObject = function (doc) {
  var fields, object_fields, table_fields;
  object_fields = Creator.getCollection("object_fields").find({
    space: doc.space,
    object: doc.object
  }, {
    fields: {
      created: 0,
      modified: 0,
      owner: 0,
      created_by: 0,
      modified_by: 0
    }
  }).fetch();
  fields = {};
  table_fields = {};

  _.forEach(object_fields, function (f) {
    var cf_arr, child_fields;

    if (/^[a-zA-Z_]\w*(\.\$\.\w+){1}[a-zA-Z0-9]*$/.test(f.name)) {
      cf_arr = f.name.split(".$.");
      child_fields = {};
      child_fields[cf_arr[1]] = f;

      if (!_.size(table_fields[cf_arr[0]])) {
        table_fields[cf_arr[0]] = {};
      }

      return _.extend(table_fields[cf_arr[0]], child_fields);
    } else {
      return fields[f.name] = f;
    }
  });

  _.each(table_fields, function (f, k) {
    if (fields[k].type === "grid") {
      if (!_.size(fields[k].fields)) {
        fields[k].fields = {};
      }

      return _.extend(fields[k].fields, f);
    }
  });

  return Creator.getCollection("objects").update({
    space: doc.space,
    name: doc.object
  }, {
    $set: {
      fields: fields
    }
  });
};

isRepeatedName = function (doc, name) {
  var other;
  other = Creator.getCollection("object_fields").find({
    object: doc.object,
    space: doc.space,
    _id: {
      $ne: doc._id
    },
    name: name || doc.name
  }, {
    fields: {
      _id: 1
    }
  });

  if (other.count() > 0) {
    return true;
  }

  return false;
};

Creator.Objects.object_fields = {
  name: "object_fields",
  icon: "orders",
  enable_api: true,
  label: "字段",
  fields: {
    name: {
      type: "text",
      searchable: true,
      index: true,
      required: true,
      regEx: SimpleSchema.RegEx.field
    },
    label: {
      type: "text"
    },
    is_name: {
      type: "boolean",
      hidden: true
    },
    object: {
      type: "master_detail",
      reference_to: "objects",
      required: true,
      optionsFunction: function () {
        var _options;

        _options = [];

        _.forEach(Creator.objectsByName, function (o, k) {
          return _options.push({
            label: o.label,
            value: k,
            icon: o.icon
          });
        });

        return _options;
      }
    },
    type: {
      type: "select",
      options: {
        text: "文本",
        textarea: "长文本",
        html: "Html文本",
        select: "选择框",
        boolean: "Checkbox",
        date: "日期",
        datetime: "日期时间",
        number: "数值",
        currency: "金额",
        password: "密码",
        lookup: "相关表",
        master_detail: "主表/子表",
        grid: "表格",
        url: "网址",
        email: "邮件地址"
      }
    },
    sort_no: {
      label: "排序号",
      type: "number",
      defaultValue: 100,
      scale: 0,
      sortable: true
    },
    group: {
      type: "text"
    },
    defaultValue: {
      type: "text"
    },
    allowedValues: {
      type: "text",
      multiple: true
    },
    multiple: {
      type: "boolean"
    },
    required: {
      type: "boolean"
    },
    is_wide: {
      type: "boolean"
    },
    readonly: {
      type: "boolean"
    },
    hidden: {
      type: "boolean"
    },
    omit: {
      type: "boolean"
    },
    index: {
      type: "boolean"
    },
    searchable: {
      type: "boolean"
    },
    sortable: {
      type: "boolean"
    },
    precision: {
      type: "currency",
      defaultValue: 18
    },
    scale: {
      type: "currency",
      defaultValue: 2
    },
    reference_to: {
      type: "lookup",
      optionsFunction: function () {
        var _options;

        _options = [];

        _.forEach(Creator.Objects, function (o, k) {
          return _options.push({
            label: o.label,
            value: k,
            icon: o.icon
          });
        });

        return _options;
      }
    },
    rows: {
      type: "currency"
    },
    options: {
      type: "textarea",
      is_wide: true
    },
    description: {
      label: "Description",
      type: "text",
      is_wide: true
    }
  },
  list_views: {
    all: {
      columns: ["name", "label", "type", "object", "sort_no", "modified"],
      sort: [{
        field_name: "sort_no",
        order: "asc"
      }],
      filter_scope: "space"
    }
  },
  permission_set: {
    user: {
      allowCreate: false,
      allowDelete: false,
      allowEdit: false,
      allowRead: false,
      modifyAllRecords: false,
      viewAllRecords: false
    },
    admin: {
      allowCreate: true,
      allowDelete: true,
      allowEdit: true,
      allowRead: true,
      modifyAllRecords: true,
      viewAllRecords: true
    }
  },
  triggers: {
    "after.insert.server.object_fields": {
      on: "server",
      when: "after.insert",
      todo: function (userId, doc) {
        return _syncToObject(doc);
      }
    },
    "after.update.server.object_fields": {
      on: "server",
      when: "after.update",
      todo: function (userId, doc) {
        return _syncToObject(doc);
      }
    },
    "after.remove.server.object_fields": {
      on: "server",
      when: "after.remove",
      todo: function (userId, doc) {
        return _syncToObject(doc);
      }
    },
    "before.update.server.object_fields": {
      on: "server",
      when: "before.update",
      todo: function (userId, doc, fieldNames, modifier, options) {
        var _reference_to, object, object_documents, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;

        if (doc.name === 'name' && (modifier != null ? (ref = modifier.$set) != null ? ref.name : void 0 : void 0) && doc.name !== modifier.$set.name) {
          throw new Meteor.Error(500, "不能修改此纪录的name属性");
        }

        if ((modifier != null ? (ref1 = modifier.$set) != null ? ref1.name : void 0 : void 0) && isRepeatedName(doc, modifier.$set.name)) {
          console.log("update fields对象名称不能重复" + doc.name);
          throw new Meteor.Error(500, "对象名称不能重复");
        }

        if (modifier != null ? (ref2 = modifier.$set) != null ? ref2.reference_to : void 0 : void 0) {
          if (modifier.$set.reference_to.length === 1) {
            _reference_to = modifier.$set.reference_to[0];
          } else {
            _reference_to = modifier.$set.reference_to;
          }
        }

        if ((modifier != null ? (ref3 = modifier.$set) != null ? ref3.index : void 0 : void 0) && ((modifier != null ? (ref4 = modifier.$set) != null ? ref4.type : void 0 : void 0) === 'textarea' || (modifier != null ? (ref5 = modifier.$set) != null ? ref5.type : void 0 : void 0) === 'html')) {
          throw new Meteor.Error(500, "多行文本不支持建立索引");
        }

        object = Creator.getCollection("objects").findOne({
          _id: doc.object
        }, {
          fields: {
            name: 1,
            label: 1
          }
        });

        if (object) {
          object_documents = Creator.getCollection(object.name).find();

          if ((modifier != null ? (ref6 = modifier.$set) != null ? ref6.reference_to : void 0 : void 0) && doc.reference_to !== _reference_to && object_documents.count() > 0) {
            throw new Meteor.Error(500, "对象" + object.label + "中已经有记录，不能修改reference_to字段");
          }

          if ((modifier != null ? (ref7 = modifier.$unset) != null ? ref7.reference_to : void 0 : void 0) && doc.reference_to !== _reference_to && object_documents.count() > 0) {
            throw new Meteor.Error(500, "对象" + object.label + "中已经有记录，不能修改reference_to字段");
          }
        }
      }
    },
    "before.insert.server.object_fields": {
      on: "server",
      when: "before.insert",
      todo: function (userId, doc) {
        if (isRepeatedName(doc)) {
          console.log("insert fields对象名称不能重复" + doc.name);
          throw new Meteor.Error(500, "对象名称不能重复");
        }

        if ((doc != null ? doc.index : void 0) && ((doc != null ? doc.type : void 0) === 'textarea' || (doc != null ? doc.type : void 0) === 'html')) {
          throw new Meteor.Error(500, '多行文本不支持建立索引');
        }
      }
    },
    "before.remove.server.object_fields": {
      on: "server",
      when: "before.remove",
      todo: function (userId, doc) {
        if (doc.name === "name") {
          throw new Meteor.Error(500, "不能删除此纪录");
        }
      }
    }
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/steedos_object-database/models/object_triggers.coffee                                      //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _syncToObject, check, isRepeatedName;

_syncToObject = function (doc) {
  var object_triggers, triggers;
  object_triggers = Creator.getCollection("object_triggers").find({
    space: doc.space,
    object: doc.object,
    is_enable: true
  }, {
    fields: {
      created: 0,
      modified: 0,
      owner: 0,
      created_by: 0,
      modified_by: 0
    }
  }).fetch();
  triggers = {};

  _.forEach(object_triggers, function (f) {
    return triggers[f.name] = f;
  });

  return Creator.getCollection("objects").update({
    space: doc.space,
    name: doc.object
  }, {
    $set: {
      triggers: triggers
    }
  });
};

isRepeatedName = function (doc, name) {
  var other;
  other = Creator.getCollection("object_triggers").find({
    object: doc.object,
    space: doc.space,
    _id: {
      $ne: doc._id
    },
    name: name || doc.name
  }, {
    fields: {
      _id: 1
    }
  });

  if (other.count() > 0) {
    return true;
  }

  return false;
};

check = function (userId, doc) {
  if (Steedos.isSpaceAdmin(userId, doc.space)) {
    throw new Meteor.Error(500, "只有工作去管理员才能配置触发器");
  }

  if (doc.on === 'server' && !Steedos.isLegalVersion(doc.space, "workflow.enterprise")) {
    throw new Meteor.Error(500, "只有企业版支持配置服务端的触发器");
  }
};

Creator.Objects.object_triggers = {
  name: "object_triggers",
  icon: "asset_relationship",
  label: "触发器",
  fields: {
    name: {
      type: "text",
      searchable: true,
      index: true,
      required: true,
      regEx: SimpleSchema.RegEx.code
    },
    label: {
      type: "text"
    },
    object: {
      type: "master_detail",
      reference_to: "objects",
      required: true,
      optionsFunction: function () {
        var _options;

        _options = [];

        _.forEach(Creator.objectsByName, function (o, k) {
          return _options.push({
            label: o.label,
            value: k,
            icon: o.icon
          });
        });

        return _options;
      }
    },
    on: {
      type: "lookup",
      required: true,
      optionsFunction: function () {
        return [{
          label: "客户端",
          value: "client",
          icon: "address"
        }, {
          label: "服务端",
          value: "server",
          icon: "address"
        }];
      }
    },
    when: {
      type: "lookup",
      required: true,
      optionsFunction: function () {
        return [{
          label: "新增记录之前",
          value: "before.insert",
          icon: "asset_relationship"
        }, {
          label: "新增记录之后",
          value: "after.insert",
          icon: "asset_relationship"
        }, {
          label: "修改记录之前",
          value: "before.update",
          icon: "asset_relationship"
        }, {
          label: "修改记录之后",
          value: "after.update",
          icon: "asset_relationship"
        }, {
          label: "删除记录之前",
          value: "before.remove",
          icon: "asset_relationship"
        }, {
          label: "删除记录之后",
          value: "after.remove",
          icon: "asset_relationship"
        }];
      }
    },
    is_enable: {
      type: "boolean"
    },
    todo: {
      type: "textarea",
      required: true,
      is_wide: true
    }
  },
  list_views: {
    all: {
      columns: ["name", "label", "object", "on", "when", "is_enable"],
      filter_scope: "space"
    }
  },
  permission_set: {
    user: {
      allowCreate: false,
      allowDelete: false,
      allowEdit: false,
      allowRead: false,
      modifyAllRecords: false,
      viewAllRecords: false
    },
    admin: {
      allowCreate: true,
      allowDelete: true,
      allowEdit: true,
      allowRead: true,
      modifyAllRecords: true,
      viewAllRecords: true
    }
  },
  triggers: {
    "after.insert.server.object_triggers": {
      on: "server",
      when: "after.insert",
      todo: function (userId, doc) {
        return _syncToObject(doc);
      }
    },
    "after.update.server.object_triggers": {
      on: "server",
      when: "after.update",
      todo: function (userId, doc) {
        return _syncToObject(doc);
      }
    },
    "after.remove.server.object_triggers": {
      on: "server",
      when: "after.remove",
      todo: function (userId, doc) {
        return _syncToObject(doc);
      }
    },
    "before.delete.server.object_triggers": {
      on: "server",
      when: "before.remove",
      todo: function (userId, doc) {
        return check(userId, doc);
      }
    },
    "before.update.server.object_triggers": {
      on: "server",
      when: "before.update",
      todo: function (userId, doc, fieldNames, modifier, options) {
        var ref;
        check(userId, doc);

        if ((modifier != null ? (ref = modifier.$set) != null ? ref.name : void 0 : void 0) && isRepeatedName(doc, modifier.$set.name)) {
          console.log("update triggers对象名称不能重复" + doc.name);
          throw new Meteor.Error(500, "对象名称不能重复" + doc.name);
        }
      }
    },
    "before.insert.server.object_triggers": {
      on: "server",
      when: "before.insert",
      todo: function (userId, doc) {
        check(userId, doc);

        if (isRepeatedName(doc)) {
          console.log("insert triggers对象名称不能重复" + doc.name);
          throw new Meteor.Error(500, "对象名称不能重复");
        }
      }
    }
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/steedos_object-database/models/object_actions.coffee                                       //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _syncToObject, isRepeatedName;

_syncToObject = function (doc) {
  var actions, object_actions;
  object_actions = Creator.getCollection("object_actions").find({
    object: doc.object,
    space: doc.space,
    is_enable: true
  }, {
    fields: {
      created: 0,
      modified: 0,
      owner: 0,
      created_by: 0,
      modified_by: 0
    }
  }).fetch();
  actions = {};

  _.forEach(object_actions, function (f) {
    return actions[f.name] = f;
  });

  return Creator.getCollection("objects").update({
    space: doc.space,
    name: doc.object
  }, {
    $set: {
      actions: actions
    }
  });
};

isRepeatedName = function (doc, name) {
  var other;
  other = Creator.getCollection("object_actions").find({
    object: doc.object,
    space: doc.space,
    _id: {
      $ne: doc._id
    },
    name: name || doc.name
  }, {
    fields: {
      _id: 1
    }
  });

  if (other.count() > 0) {
    return true;
  }

  return false;
};

Creator.Objects.object_actions = {
  name: "object_actions",
  label: "对象操作",
  icon: "marketing_actions",
  fields: {
    object: {
      type: "master_detail",
      reference_to: "objects",
      required: true,
      optionsFunction: function () {
        var _options;

        _options = [];

        _.forEach(Creator.objectsByName, function (o, k) {
          return _options.push({
            label: o.label,
            value: k,
            icon: o.icon
          });
        });

        return _options;
      }
    },
    name: {
      type: "text",
      searchable: true,
      index: true,
      required: true,
      regEx: SimpleSchema.RegEx.code
    },
    label: {
      type: "text"
    },
    is_enable: {
      type: "boolean"
    },
    visible: {
      type: "boolean",
      omit: true
    },
    on: {
      type: "lookup",
      is_wide: true,
      required: true,
      optionsFunction: function () {
        return [{
          label: "显示在列表右上角",
          value: "list",
          icon: "contact_list"
        }, {
          label: "显示在记录查看页右上角",
          value: "record",
          icon: "contract"
        }];
      }
    },
    todo: {
      label: "执行的脚本",
      type: "textarea",
      required: true,
      is_wide: true
    }
  },
  list_views: {
    all: {
      columns: ["name", "label", "object", "on", "is_enable", "modified"],
      filter_scope: "space"
    }
  },
  permission_set: {
    user: {
      allowCreate: false,
      allowDelete: false,
      allowEdit: false,
      allowRead: false,
      modifyAllRecords: false,
      viewAllRecords: false
    },
    admin: {
      allowCreate: true,
      allowDelete: true,
      allowEdit: true,
      allowRead: true,
      modifyAllRecords: true,
      viewAllRecords: true
    }
  },
  triggers: {
    "after.insert.server.object_actions": {
      on: "server",
      when: "after.insert",
      todo: function (userId, doc) {
        return _syncToObject(doc);
      }
    },
    "after.update.server.object_actions": {
      on: "server",
      when: "after.update",
      todo: function (userId, doc) {
        return _syncToObject(doc);
      }
    },
    "after.remove.server.object_actions": {
      on: "server",
      when: "after.remove",
      todo: function (userId, doc) {
        return _syncToObject(doc);
      }
    },
    "before.update.server.object_actions": {
      on: "server",
      when: "before.update",
      todo: function (userId, doc, fieldNames, modifier, options) {
        var ref;

        if ((modifier != null ? (ref = modifier.$set) != null ? ref.name : void 0 : void 0) && isRepeatedName(doc, modifier.$set.name)) {
          console.log("update actions对象名称不能重复" + doc.name);
          throw new Meteor.Error(500, "对象名称不能重复");
        }
      }
    },
    "before.insert.server.object_actions": {
      on: "server",
      when: "before.insert",
      todo: function (userId, doc) {
        doc.visible = true;

        if (isRepeatedName(doc)) {
          console.log("insert actions对象名称不能重复" + doc.name);
          throw new Meteor.Error(500, "对象名称不能重复" + doc.name);
        }
      }
    }
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("steedos:object-database");

})();

//# sourceURL=meteor://💻app/packages/steedos_object-database.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2UvbW9kZWxzL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdC1kYXRhYmFzZS9tb2RlbHMvb2JqZWN0X2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9vYmplY3RfZmllbGRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2UvbW9kZWxzL29iamVjdF90cmlnZ2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9vYmplY3RfdHJpZ2dlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdC1kYXRhYmFzZS9tb2RlbHMvb2JqZWN0X2FjdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9tb2RlbHMvb2JqZWN0X2FjdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbImlzUmVwZWF0ZWROYW1lIiwiZG9jIiwib3RoZXIiLCJDcmVhdG9yIiwiZ2V0Q29sbGVjdGlvbiIsImZpbmQiLCJfaWQiLCIkbmUiLCJzcGFjZSIsIm5hbWUiLCJmaWVsZHMiLCJjb3VudCIsIk9iamVjdHMiLCJvYmplY3RzIiwiaWNvbiIsImxhYmVsIiwidHlwZSIsInNlYXJjaGFibGUiLCJpbmRleCIsInJlcXVpcmVkIiwicmVnRXgiLCJTaW1wbGVTY2hlbWEiLCJSZWdFeCIsImNvZGUiLCJvcHRpb25zRnVuY3Rpb24iLCJvcHRpb25zIiwiXyIsImZvckVhY2giLCJyZXNvdXJjZXMiLCJzbGRzSWNvbnMiLCJzdGFuZGFyZCIsInN2ZyIsInB1c2giLCJ2YWx1ZSIsImlzX2VuYWJsZSIsImRlZmF1bHRWYWx1ZSIsImVuYWJsZV9zZWFyY2giLCJlbmFibGVfZmlsZXMiLCJlbmFibGVfdGFza3MiLCJlbmFibGVfbm90ZXMiLCJlbmFibGVfZXZlbnRzIiwiZW5hYmxlX2FwaSIsImhpZGRlbiIsImVuYWJsZV9zaGFyZSIsImVuYWJsZV9pbnN0YW5jZXMiLCJlbmFibGVfY2hhdHRlciIsImVuYWJsZV9hdWRpdCIsImVuYWJsZV90cmFzaCIsImVuYWJsZV9zcGFjZV9nbG9iYWwiLCJpc192aWV3Iiwib21pdCIsImRlc2NyaXB0aW9uIiwiaXNfd2lkZSIsInNpZGViYXIiLCJibGFja2JveCIsImxpc3Rfdmlld3MiLCJhY3Rpb25zIiwicGVybWlzc2lvbl9zZXQiLCJ0cmlnZ2VycyIsImN1c3RvbSIsIm93bmVyIiwiYXBwX3VuaXF1ZV9pZCIsImFwcF92ZXJzaW9uIiwiYWxsIiwiY29sdW1ucyIsImZpbHRlcl9zY29wZSIsInVzZXIiLCJhbGxvd0NyZWF0ZSIsImFsbG93RGVsZXRlIiwiYWxsb3dFZGl0IiwiYWxsb3dSZWFkIiwibW9kaWZ5QWxsUmVjb3JkcyIsInZpZXdBbGxSZWNvcmRzIiwiYWRtaW4iLCJjb3B5X29kYXRhIiwidmlzaWJsZSIsIm9uIiwidG9kbyIsIm9iamVjdF9uYW1lIiwicmVjb3JkX2lkIiwiaXRlbV9lbGVtZW50IiwiY2xpcGJvYXJkIiwib19uYW1lIiwicGF0aCIsInJlY29yZCIsImdldE9iamVjdEJ5SWQiLCJTdGVlZG9zT0RhdGEiLCJnZXRPRGF0YVBhdGgiLCJTZXNzaW9uIiwiZ2V0IiwiYXR0ciIsIkNsaXBib2FyZCIsImUiLCJ0b2FzdHIiLCJzdWNjZXNzIiwiZXJyb3IiLCJjb25zb2xlIiwidGFnTmFtZSIsImhhc0NsYXNzIiwidHJpZ2dlciIsIndoZW4iLCJ1c2VySWQiLCJsb2ciLCJNZXRlb3IiLCJFcnJvciIsImZpZWxkTmFtZXMiLCJtb2RpZmllciIsInJlZiIsIiRzZXQiLCIkdW5zZXQiLCJpbnNlcnQiLCJvYmplY3QiLCJzaGFyZWQiLCJkb2N1bWVudHMiLCJvYmplY3RfY29sbGVjdGlvbnMiLCJkaXJlY3QiLCJyZW1vdmUiLCJDb2xsZWN0aW9ucyIsIl9jb2xsZWN0aW9uIiwiZHJvcENvbGxlY3Rpb24iLCJzdGFjayIsIl9zeW5jVG9PYmplY3QiLCJvYmplY3RfZmllbGRzIiwidGFibGVfZmllbGRzIiwiY3JlYXRlZCIsIm1vZGlmaWVkIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkX2J5IiwiZmV0Y2giLCJmIiwiY2ZfYXJyIiwiY2hpbGRfZmllbGRzIiwidGVzdCIsInNwbGl0Iiwic2l6ZSIsImV4dGVuZCIsImVhY2giLCJrIiwidXBkYXRlIiwiZmllbGQiLCJpc19uYW1lIiwicmVmZXJlbmNlX3RvIiwiX29wdGlvbnMiLCJvYmplY3RzQnlOYW1lIiwibyIsInRleHQiLCJ0ZXh0YXJlYSIsImh0bWwiLCJzZWxlY3QiLCJib29sZWFuIiwiZGF0ZSIsImRhdGV0aW1lIiwibnVtYmVyIiwiY3VycmVuY3kiLCJwYXNzd29yZCIsImxvb2t1cCIsIm1hc3Rlcl9kZXRhaWwiLCJncmlkIiwidXJsIiwiZW1haWwiLCJzb3J0X25vIiwic2NhbGUiLCJzb3J0YWJsZSIsImdyb3VwIiwiYWxsb3dlZFZhbHVlcyIsIm11bHRpcGxlIiwicmVhZG9ubHkiLCJwcmVjaXNpb24iLCJyb3dzIiwic29ydCIsImZpZWxkX25hbWUiLCJvcmRlciIsIl9yZWZlcmVuY2VfdG8iLCJvYmplY3RfZG9jdW1lbnRzIiwicmVmMSIsInJlZjIiLCJyZWYzIiwicmVmNCIsInJlZjUiLCJyZWY2IiwicmVmNyIsImxlbmd0aCIsImZpbmRPbmUiLCJjaGVjayIsIm9iamVjdF90cmlnZ2VycyIsIlN0ZWVkb3MiLCJpc1NwYWNlQWRtaW4iLCJpc0xlZ2FsVmVyc2lvbiIsIm9iamVjdF9hY3Rpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFBQSxjQUFBOztBQUFBQSxpQkFBaUIsVUFBQ0MsR0FBRDtBQUNoQixNQUFBQyxLQUFBO0FBQUFBLFVBQVFDLFFBQVFDLGFBQVIsQ0FBc0IsU0FBdEIsRUFBaUNDLElBQWpDLENBQXNDO0FBQUNDLFNBQUs7QUFBQ0MsV0FBS04sSUFBSUs7QUFBVixLQUFOO0FBQXNCRSxXQUFPUCxJQUFJTyxLQUFqQztBQUF3Q0MsVUFBTVIsSUFBSVE7QUFBbEQsR0FBdEMsRUFBK0Y7QUFBQ0MsWUFBTztBQUFDSixXQUFLO0FBQU47QUFBUixHQUEvRixDQUFSOztBQUNBLE1BQUdKLE1BQU1TLEtBQU4sS0FBZ0IsQ0FBbkI7QUFDQyxXQUFPLElBQVA7QUNhQzs7QURaRixTQUFPLEtBQVA7QUFKZ0IsQ0FBakI7O0FBTUFSLFFBQVFTLE9BQVIsQ0FBZ0JDLE9BQWhCLEdBQ0M7QUFBQUosUUFBTSxTQUFOO0FBQ0FLLFFBQU0sUUFETjtBQUVBQyxTQUFPLElBRlA7QUFHQUwsVUFDQztBQUFBRCxVQUNDO0FBQUFPLFlBQU0sTUFBTjtBQUNBQyxrQkFBVyxJQURYO0FBRUFDLGFBQU0sSUFGTjtBQUdBQyxnQkFBVSxJQUhWO0FBSUFDLGFBQU9DLGFBQWFDLEtBQWIsQ0FBbUJDO0FBSjFCLEtBREQ7QUFNQVIsV0FDQztBQUFBQyxZQUFNLE1BQU47QUFDQUcsZ0JBQVU7QUFEVixLQVBEO0FBU0FMLFVBQ0M7QUFBQUUsWUFBTSxRQUFOO0FBQ0FRLHVCQUFpQjtBQUNoQixZQUFBQyxPQUFBO0FBQUFBLGtCQUFVLEVBQVY7O0FBQ0FDLFVBQUVDLE9BQUYsQ0FBVXhCLFFBQVF5QixTQUFSLENBQWtCQyxTQUFsQixDQUE0QkMsUUFBdEMsRUFBZ0QsVUFBQ0MsR0FBRDtBQ2tCMUMsaUJEakJMTixRQUFRTyxJQUFSLENBQWE7QUFBQ0MsbUJBQU9GLEdBQVI7QUFBYWhCLG1CQUFPZ0IsR0FBcEI7QUFBeUJqQixrQkFBTWlCO0FBQS9CLFdBQWIsQ0NpQks7QURsQk47O0FBRUEsZUFBT04sT0FBUDtBQUxEO0FBQUEsS0FWRDtBQWdCQVMsZUFDQztBQUFBbEIsWUFBTSxTQUFOO0FBQ0FtQixvQkFBYztBQURkLEtBakJEO0FBbUJBQyxtQkFDQztBQUFBcEIsWUFBTTtBQUFOLEtBcEJEO0FBcUJBcUIsa0JBQ0M7QUFBQXJCLFlBQU07QUFBTixLQXRCRDtBQXVCQXNCLGtCQUNDO0FBQUF0QixZQUFNO0FBQU4sS0F4QkQ7QUF5QkF1QixrQkFDQztBQUFBdkIsWUFBTTtBQUFOLEtBMUJEO0FBMkJBd0IsbUJBQ0M7QUFBQXhCLFlBQU07QUFBTixLQTVCRDtBQTZCQXlCLGdCQUNDO0FBQUF6QixZQUFNLFNBQU47QUFDQW1CLG9CQUFjLElBRGQ7QUFFQU8sY0FBUTtBQUZSLEtBOUJEO0FBaUNBQyxrQkFDQztBQUFBM0IsWUFBTSxTQUFOO0FBQ0FtQixvQkFBYztBQURkLEtBbENEO0FBb0NBUyxzQkFDQztBQUFBNUIsWUFBTTtBQUFOLEtBckNEO0FBc0NBNkIsb0JBQ0M7QUFBQTdCLFlBQU07QUFBTixLQXZDRDtBQXdDQThCLGtCQUNDO0FBQUE5QixZQUFNO0FBQU4sS0F6Q0Q7QUEwQ0ErQixrQkFDQztBQUFBL0IsWUFBTTtBQUFOLEtBM0NEO0FBNENBZ0MseUJBQ0M7QUFBQWhDLFlBQU0sU0FBTjtBQUNBbUIsb0JBQWM7QUFEZCxLQTdDRDtBQStDQWMsYUFDQztBQUFBakMsWUFBTSxTQUFOO0FBQ0FtQixvQkFBYyxLQURkO0FBRUFlLFlBQU07QUFGTixLQWhERDtBQW1EQVIsWUFDQztBQUFBM0IsYUFBTyxJQUFQO0FBQ0FDLFlBQU0sU0FETjtBQUVBa0MsWUFBTTtBQUZOLEtBcEREO0FBdURBQyxpQkFDQztBQUFBcEMsYUFBTyxhQUFQO0FBQ0FDLFlBQU0sVUFETjtBQUVBb0MsZUFBUztBQUZULEtBeEREO0FBMkRBQyxhQUNDO0FBQUFyQyxZQUFNLFFBQU47QUFDQUQsYUFBTyxNQURQO0FBRUF1QyxnQkFBVSxJQUZWO0FBR0FKLFlBQU0sSUFITjtBQUlBUixjQUFRO0FBSlIsS0E1REQ7QUFpRUFoQyxZQUNDO0FBQUFNLFlBQU0sUUFBTjtBQUNBRCxhQUFPLElBRFA7QUFFQXVDLGdCQUFVLElBRlY7QUFHQUosWUFBTSxJQUhOO0FBSUFSLGNBQVE7QUFKUixLQWxFRDtBQXVFQWEsZ0JBQ0M7QUFBQXZDLFlBQU0sUUFBTjtBQUNBRCxhQUFPLE1BRFA7QUFFQXVDLGdCQUFVLElBRlY7QUFHQUosWUFBTSxJQUhOO0FBSUFSLGNBQVE7QUFKUixLQXhFRDtBQTZFQWMsYUFDQztBQUFBeEMsWUFBTSxRQUFOO0FBQ0FELGFBQU8sSUFEUDtBQUVBdUMsZ0JBQVUsSUFGVjtBQUdBSixZQUFNLElBSE47QUFJQVIsY0FBUTtBQUpSLEtBOUVEO0FBbUZBZSxvQkFDQztBQUFBekMsWUFBTSxRQUFOO0FBQ0FELGFBQU8sTUFEUDtBQUVBdUMsZ0JBQVUsSUFGVjtBQUdBSixZQUFNLElBSE47QUFJQVIsY0FBUTtBQUpSLEtBcEZEO0FBeUZBZ0IsY0FDQztBQUFBMUMsWUFBTSxRQUFOO0FBQ0FELGFBQU8sS0FEUDtBQUVBdUMsZ0JBQVUsSUFGVjtBQUdBSixZQUFNLElBSE47QUFJQVIsY0FBUTtBQUpSLEtBMUZEO0FBK0ZBaUIsWUFDQztBQUFBNUMsYUFBTyxJQUFQO0FBQ0FDLFlBQU0sU0FETjtBQUVBa0MsWUFBTTtBQUZOLEtBaEdEO0FBbUdBVSxXQUNDO0FBQUE1QyxZQUFNLFFBQU47QUFDQTBCLGNBQVE7QUFEUixLQXBHRDtBQXNHQW1CLG1CQUNDO0FBQUE3QyxZQUFNLE1BQU47QUFDQTBCLGNBQVE7QUFEUixLQXZHRDtBQXlHQW9CLGlCQUNDO0FBQUE5QyxZQUFNLE1BQU47QUFDQTBCLGNBQVE7QUFEUjtBQTFHRCxHQUpEO0FBaUhBYSxjQUNDO0FBQUFRLFNBQ0M7QUFBQUMsZUFBUyxDQUFDLE1BQUQsRUFBUyxPQUFULEVBQWtCLFdBQWxCLEVBQStCLFVBQS9CLENBQVQ7QUFDQWpELGFBQU0sSUFETjtBQUVBa0Qsb0JBQWM7QUFGZDtBQURELEdBbEhEO0FBdUhBUixrQkFDQztBQUFBUyxVQUNDO0FBQUFDLG1CQUFhLEtBQWI7QUFDQUMsbUJBQWEsS0FEYjtBQUVBQyxpQkFBVyxLQUZYO0FBR0FDLGlCQUFXLEtBSFg7QUFJQUMsd0JBQWtCLEtBSmxCO0FBS0FDLHNCQUFnQjtBQUxoQixLQUREO0FBT0FDLFdBQ0M7QUFBQU4sbUJBQWEsSUFBYjtBQUNBQyxtQkFBYSxJQURiO0FBRUFDLGlCQUFXLElBRlg7QUFHQUMsaUJBQVcsSUFIWDtBQUlBQyx3QkFBa0IsSUFKbEI7QUFLQUMsc0JBQWdCO0FBTGhCO0FBUkQsR0F4SEQ7QUF1SUFoQixXQUNDO0FBQUFrQixnQkFDQztBQUFBM0QsYUFBTyxXQUFQO0FBQ0E0RCxlQUFTLElBRFQ7QUFFQUMsVUFBSSxRQUZKO0FBR0FDLFlBQU0sVUFBQ0MsV0FBRCxFQUFjQyxTQUFkLEVBQXlCQyxZQUF6QjtBQUNMLFlBQUFDLFNBQUEsRUFBQUMsTUFBQSxFQUFBQyxJQUFBLEVBQUFDLE1BQUE7QUFBQUEsaUJBQVNqRixRQUFRa0YsYUFBUixDQUFzQk4sU0FBdEIsQ0FBVDs7QUFFQSxhQUFBSyxVQUFBLE9BQUdBLE9BQVEzQyxVQUFYLEdBQVcsTUFBWCxLQUF5QixJQUF6QjtBQUNDeUMsbUJBQUFFLFVBQUEsT0FBU0EsT0FBUTNFLElBQWpCLEdBQWlCLE1BQWpCO0FBQ0EwRSxpQkFBT0csYUFBYUMsWUFBYixDQUEwQkMsUUFBUUMsR0FBUixDQUFZLFNBQVosQ0FBMUIsRUFBa0RQLE1BQWxELENBQVA7QUFDQUYsdUJBQWFVLElBQWIsQ0FBa0IscUJBQWxCLEVBQXlDUCxJQUF6Qzs7QUFDQSxjQUFHLENBQUNILGFBQWFVLElBQWIsQ0FBa0Isb0JBQWxCLENBQUo7QUFDQ1Qsd0JBQVksSUFBSVUsU0FBSixDQUFjWCxhQUFhLENBQWIsQ0FBZCxDQUFaO0FBQ0FBLHlCQUFhVSxJQUFiLENBQWtCLG9CQUFsQixFQUF3QyxJQUF4QztBQUVBVCxzQkFBVUwsRUFBVixDQUFhLFNBQWIsRUFBeUIsVUFBQ2dCLENBQUQ7QUNxRGpCLHFCRHBEUEMsT0FBT0MsT0FBUCxDQUFlLE1BQWYsQ0NvRE87QURyRFI7QUFHQWIsc0JBQVVMLEVBQVYsQ0FBYSxPQUFiLEVBQXVCLFVBQUNnQixDQUFEO0FBQ3RCQyxxQkFBT0UsS0FBUCxDQUFhLE1BQWI7QUNxRE8scUJEcERQQyxRQUFRRCxLQUFSLENBQWMsR0FBZCxDQ29ETztBRHREUjs7QUFLQSxnQkFBR2YsYUFBYSxDQUFiLEVBQWdCaUIsT0FBaEIsS0FBMkIsSUFBM0IsSUFBbUNqQixhQUFha0IsUUFBYixDQUFzQixhQUF0QixDQUF0QztBQ29EUSxxQkRuRFBsQixhQUFhbUIsT0FBYixDQUFxQixPQUFyQixDQ21ETztBRGhFVDtBQUpEO0FBQUE7QUN3RU0saUJEckRMTixPQUFPRSxLQUFQLENBQWEsY0FBYixDQ3FESztBQUNEO0FEL0VOO0FBQUE7QUFERCxHQXhJRDtBQXFLQXJDLFlBQ0M7QUFBQSxvQ0FDQztBQUFBa0IsVUFBSSxRQUFKO0FBQ0F3QixZQUFNLGVBRE47QUFFQXZCLFlBQU0sVUFBQ3dCLE1BQUQsRUFBU3BHLEdBQVQ7QUFDTCxZQUFHRCxlQUFlQyxHQUFmLENBQUg7QUFDQytGLGtCQUFRTSxHQUFSLENBQVksbUJBQWlCckcsSUFBSVEsSUFBakM7QUFDQSxnQkFBTSxJQUFJOEYsT0FBT0MsS0FBWCxDQUFpQixHQUFqQixFQUFzQixVQUF0QixDQUFOO0FDd0RJOztBQUNELGVEeERKdkcsSUFBSTBELE1BQUosR0FBYSxJQ3dEVDtBRDlETDtBQUFBLEtBREQ7QUFTQSxvQ0FDQztBQUFBaUIsVUFBSSxRQUFKO0FBQ0F3QixZQUFNLGVBRE47QUFFQXZCLFlBQU0sVUFBQ3dCLE1BQUQsRUFBU3BHLEdBQVQsRUFBY3dHLFVBQWQsRUFBMEJDLFFBQTFCLEVBQW9DakYsT0FBcEM7QUFDTCxZQUFBa0YsR0FBQTs7QUFBQSxhQUFBRCxZQUFBLFFBQUFDLE1BQUFELFNBQUFFLElBQUEsWUFBQUQsSUFBbUJsRyxJQUFuQixHQUFtQixNQUFuQixHQUFtQixNQUFuQixLQUEyQlIsSUFBSVEsSUFBSixLQUFZaUcsU0FBU0UsSUFBVCxDQUFjbkcsSUFBckQ7QUFDQ3VGLGtCQUFRTSxHQUFSLENBQVksVUFBWjtBQUNBLGdCQUFNLElBQUlDLE9BQU9DLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsU0FBdEIsQ0FBTjtBQzJESTs7QUQxREwsWUFBR0UsU0FBU0UsSUFBWjtBQUNDRixtQkFBU0UsSUFBVCxDQUFjakQsTUFBZCxHQUF1QixJQUF2QjtBQzRESTs7QUQxREwsWUFBRytDLFNBQVNHLE1BQVQsSUFBbUJILFNBQVNHLE1BQVQsQ0FBZ0JsRCxNQUF0QztBQzRETSxpQkQzREwsT0FBTytDLFNBQVNHLE1BQVQsQ0FBZ0JsRCxNQzJEbEI7QUFDRDtBRHRFTjtBQUFBLEtBVkQ7QUF1QkEsbUNBQ0M7QUFBQWlCLFVBQUksUUFBSjtBQUNBd0IsWUFBTSxjQUROO0FBRUF2QixZQUFNLFVBQUN3QixNQUFELEVBQVNwRyxHQUFUO0FBRUxFLGdCQUFRQyxhQUFSLENBQXNCLGVBQXRCLEVBQXVDMEcsTUFBdkMsQ0FBOEM7QUFBQ0Msa0JBQVE5RyxJQUFJUSxJQUFiO0FBQW1CbUQsaUJBQU95QyxNQUExQjtBQUFrQzVGLGdCQUFNLE1BQXhDO0FBQWdERCxpQkFBT1AsSUFBSU8sS0FBM0Q7QUFBa0VRLGdCQUFNLE1BQXhFO0FBQWdGRyxvQkFBVSxJQUExRjtBQUFnR0QsaUJBQU8sSUFBdkc7QUFBNkdELHNCQUFZO0FBQXpILFNBQTlDO0FBQ0FkLGdCQUFRQyxhQUFSLENBQXNCLGtCQUF0QixFQUEwQzBHLE1BQTFDLENBQWlEO0FBQUNyRyxnQkFBTSxLQUFQO0FBQWNELGlCQUFPUCxJQUFJTyxLQUF6QjtBQUFnQ29ELGlCQUFPeUMsTUFBdkM7QUFBK0N2Qix1QkFBYTdFLElBQUlRLElBQWhFO0FBQXNFdUcsa0JBQVEsSUFBOUU7QUFBb0YvQyx3QkFBYyxPQUFsRztBQUEyR0QsbUJBQVMsQ0FBQyxNQUFEO0FBQXBILFNBQWpEO0FDNkVJLGVENUVKN0QsUUFBUUMsYUFBUixDQUFzQixrQkFBdEIsRUFBMEMwRyxNQUExQyxDQUFpRDtBQUFDckcsZ0JBQU0sUUFBUDtBQUFpQkQsaUJBQU9QLElBQUlPLEtBQTVCO0FBQW1Db0QsaUJBQU95QyxNQUExQztBQUFrRHZCLHVCQUFhN0UsSUFBSVEsSUFBbkU7QUFBeUV1RyxrQkFBUSxJQUFqRjtBQUF1Ri9DLHdCQUFjLE9BQXJHO0FBQThHRCxtQkFBUyxDQUFDLE1BQUQ7QUFBdkgsU0FBakQsQ0M0RUk7QURsRkw7QUFBQSxLQXhCRDtBQWdDQSxvQ0FDQztBQUFBWSxVQUFJLFFBQUo7QUFDQXdCLFlBQU0sZUFETjtBQUVBdkIsWUFBTSxVQUFDd0IsTUFBRCxFQUFTcEcsR0FBVDtBQUVMLFlBQUFnSCxTQUFBLEVBQUFDLGtCQUFBOztBQUFBLFlBQUdqSCxJQUFJNEQsYUFBSixJQUFxQjVELElBQUk2RCxXQUE1QjtBQUNDO0FDc0ZJOztBRHBGTG9ELDZCQUFxQi9HLFFBQVFDLGFBQVIsQ0FBc0JILElBQUlRLElBQTFCLEVBQWdDUixJQUFJTyxLQUFwQyxDQUFyQjtBQUVBeUcsb0JBQVlDLG1CQUFtQjdHLElBQW5CLENBQXdCLEVBQXhCLEVBQTJCO0FBQUNLLGtCQUFRO0FBQUNKLGlCQUFLO0FBQU47QUFBVCxTQUEzQixDQUFaOztBQUVBLFlBQUcyRyxVQUFVdEcsS0FBVixLQUFvQixDQUF2QjtBQUNDLGdCQUFNLElBQUk0RixPQUFPQyxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLFFBQU12RyxJQUFJUSxJQUFWLEdBQWUseUJBQXJDLENBQU47QUN3Rkk7QURwR047QUFBQSxLQWpDRDtBQStDQSxtQ0FDQztBQUFBbUUsVUFBSSxRQUFKO0FBQ0F3QixZQUFNLGNBRE47QUFFQXZCLFlBQU0sVUFBQ3dCLE1BQUQsRUFBU3BHLEdBQVQ7QUFFTCxZQUFBMkYsQ0FBQTtBQUFBekYsZ0JBQVFDLGFBQVIsQ0FBc0IsZUFBdEIsRUFBdUMrRyxNQUF2QyxDQUE4Q0MsTUFBOUMsQ0FBcUQ7QUFBQ0wsa0JBQVE5RyxJQUFJUSxJQUFiO0FBQW1CRCxpQkFBT1AsSUFBSU87QUFBOUIsU0FBckQ7QUFFQUwsZ0JBQVFDLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDK0csTUFBeEMsQ0FBK0NDLE1BQS9DLENBQXNEO0FBQUNMLGtCQUFROUcsSUFBSVEsSUFBYjtBQUFtQkQsaUJBQU9QLElBQUlPO0FBQTlCLFNBQXREO0FBRUFMLGdCQUFRQyxhQUFSLENBQXNCLGlCQUF0QixFQUF5QytHLE1BQXpDLENBQWdEQyxNQUFoRCxDQUF1RDtBQUFDTCxrQkFBUTlHLElBQUlRLElBQWI7QUFBbUJELGlCQUFPUCxJQUFJTztBQUE5QixTQUF2RDtBQUVBTCxnQkFBUUMsYUFBUixDQUFzQixvQkFBdEIsRUFBNEMrRyxNQUE1QyxDQUFtREMsTUFBbkQsQ0FBMEQ7QUFBQ3RDLHVCQUFhN0UsSUFBSVEsSUFBbEI7QUFBd0JELGlCQUFPUCxJQUFJTztBQUFuQyxTQUExRDtBQUVBTCxnQkFBUUMsYUFBUixDQUFzQixrQkFBdEIsRUFBMEMrRyxNQUExQyxDQUFpREMsTUFBakQsQ0FBd0Q7QUFBQ3RDLHVCQUFhN0UsSUFBSVEsSUFBbEI7QUFBd0JELGlCQUFPUCxJQUFJTztBQUFuQyxTQUF4RDtBQUdBd0YsZ0JBQVFNLEdBQVIsQ0FBWSxpQkFBWixFQUErQnJHLElBQUlRLElBQW5DOztBQUNBO0FDbUdNLGlCRGpHTE4sUUFBUWtILFdBQVIsQ0FBb0IsT0FBS3BILElBQUlPLEtBQVQsR0FBZSxHQUFmLEdBQWtCUCxJQUFJUSxJQUExQyxFQUFrRDZHLFdBQWxELENBQThEQyxjQUE5RCxFQ2lHSztBRG5HTixpQkFBQXhCLEtBQUE7QUFHTUgsY0FBQUcsS0FBQTtBQUNMQyxrQkFBUUQsS0FBUixDQUFjLE9BQUs5RixJQUFJTyxLQUFULEdBQWUsR0FBZixHQUFrQlAsSUFBSVEsSUFBcEMsRUFBNEMsS0FBR21GLEVBQUU0QixLQUFqRDtBQUNBLGdCQUFNLElBQUlqQixPQUFPQyxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLFFBQU12RyxJQUFJUSxJQUFWLEdBQWUsV0FBckMsQ0FBTjtBQ21HSTtBRHhITjtBQUFBO0FBaEREO0FBdEtELENBREQsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRVBBLElBQUFnSCxhQUFBLEVBQUF6SCxjQUFBOztBQUFBeUgsZ0JBQWdCLFVBQUN4SCxHQUFEO0FBQ2YsTUFBQVMsTUFBQSxFQUFBZ0gsYUFBQSxFQUFBQyxZQUFBO0FBQUFELGtCQUFnQnZILFFBQVFDLGFBQVIsQ0FBc0IsZUFBdEIsRUFBdUNDLElBQXZDLENBQTRDO0FBQUNHLFdBQU9QLElBQUlPLEtBQVo7QUFBbUJ1RyxZQUFROUcsSUFBSThHO0FBQS9CLEdBQTVDLEVBQW9GO0FBQ25HckcsWUFBUTtBQUNQa0gsZUFBUyxDQURGO0FBRVBDLGdCQUFVLENBRkg7QUFHUGpFLGFBQU8sQ0FIQTtBQUlQa0Usa0JBQVksQ0FKTDtBQUtQQyxtQkFBYTtBQUxOO0FBRDJGLEdBQXBGLEVBUWJDLEtBUmEsRUFBaEI7QUFVQXRILFdBQVMsRUFBVDtBQUVBaUgsaUJBQWUsRUFBZjs7QUFFQWpHLElBQUVDLE9BQUYsQ0FBVStGLGFBQVYsRUFBeUIsVUFBQ08sQ0FBRDtBQUN4QixRQUFBQyxNQUFBLEVBQUFDLFlBQUE7O0FBQUEsUUFBRywyQ0FBMkNDLElBQTNDLENBQWdESCxFQUFFeEgsSUFBbEQsQ0FBSDtBQUNDeUgsZUFBU0QsRUFBRXhILElBQUYsQ0FBTzRILEtBQVAsQ0FBYSxLQUFiLENBQVQ7QUFDQUYscUJBQWUsRUFBZjtBQUNBQSxtQkFBYUQsT0FBTyxDQUFQLENBQWIsSUFBMEJELENBQTFCOztBQUNBLFVBQUcsQ0FBQ3ZHLEVBQUU0RyxJQUFGLENBQU9YLGFBQWFPLE9BQU8sQ0FBUCxDQUFiLENBQVAsQ0FBSjtBQUNDUCxxQkFBYU8sT0FBTyxDQUFQLENBQWIsSUFBMEIsRUFBMUI7QUNLRzs7QUFDRCxhRExIeEcsRUFBRTZHLE1BQUYsQ0FBU1osYUFBYU8sT0FBTyxDQUFQLENBQWIsQ0FBVCxFQUFrQ0MsWUFBbEMsQ0NLRztBRFhKO0FDYUksYURMSHpILE9BQU91SCxFQUFFeEgsSUFBVCxJQUFpQndILENDS2Q7QUFDRDtBRGZKOztBQVdBdkcsSUFBRThHLElBQUYsQ0FBT2IsWUFBUCxFQUFxQixVQUFDTSxDQUFELEVBQUlRLENBQUo7QUFDcEIsUUFBRy9ILE9BQU8rSCxDQUFQLEVBQVV6SCxJQUFWLEtBQWtCLE1BQXJCO0FBQ0MsVUFBRyxDQUFDVSxFQUFFNEcsSUFBRixDQUFPNUgsT0FBTytILENBQVAsRUFBVS9ILE1BQWpCLENBQUo7QUFDQ0EsZUFBTytILENBQVAsRUFBVS9ILE1BQVYsR0FBbUIsRUFBbkI7QUNPRzs7QUFDRCxhRFBIZ0IsRUFBRTZHLE1BQUYsQ0FBUzdILE9BQU8rSCxDQUFQLEVBQVUvSCxNQUFuQixFQUEyQnVILENBQTNCLENDT0c7QUFDRDtBRFpKOztBQ2NDLFNEUkQ5SCxRQUFRQyxhQUFSLENBQXNCLFNBQXRCLEVBQWlDc0ksTUFBakMsQ0FBd0M7QUFBQ2xJLFdBQU9QLElBQUlPLEtBQVo7QUFBbUJDLFVBQU1SLElBQUk4RztBQUE3QixHQUF4QyxFQUE4RTtBQUM3RUgsVUFDQztBQUFBbEcsY0FBUUE7QUFBUjtBQUY0RSxHQUE5RSxDQ1FDO0FEeENjLENBQWhCOztBQXFDQVYsaUJBQWlCLFVBQUNDLEdBQUQsRUFBTVEsSUFBTjtBQUNoQixNQUFBUCxLQUFBO0FBQUFBLFVBQVFDLFFBQVFDLGFBQVIsQ0FBc0IsZUFBdEIsRUFBdUNDLElBQXZDLENBQTRDO0FBQUMwRyxZQUFROUcsSUFBSThHLE1BQWI7QUFBc0J2RyxXQUFPUCxJQUFJTyxLQUFqQztBQUF3Q0YsU0FBSztBQUFDQyxXQUFLTixJQUFJSztBQUFWLEtBQTdDO0FBQTZERyxVQUFNQSxRQUFRUixJQUFJUTtBQUEvRSxHQUE1QyxFQUFrSTtBQUFDQyxZQUFPO0FBQUNKLFdBQUs7QUFBTjtBQUFSLEdBQWxJLENBQVI7O0FBQ0EsTUFBR0osTUFBTVMsS0FBTixLQUFnQixDQUFuQjtBQUNDLFdBQU8sSUFBUDtBQzBCQzs7QUR6QkYsU0FBTyxLQUFQO0FBSmdCLENBQWpCOztBQU1BUixRQUFRUyxPQUFSLENBQWdCOEcsYUFBaEIsR0FDQztBQUFBakgsUUFBTSxlQUFOO0FBQ0FLLFFBQU0sUUFETjtBQUVBMkIsY0FBWSxJQUZaO0FBR0ExQixTQUFNLElBSE47QUFJQUwsVUFDQztBQUFBRCxVQUNDO0FBQUFPLFlBQU0sTUFBTjtBQUNBQyxrQkFBWSxJQURaO0FBRUFDLGFBQU8sSUFGUDtBQUdBQyxnQkFBVSxJQUhWO0FBSUFDLGFBQU9DLGFBQWFDLEtBQWIsQ0FBbUJxSDtBQUoxQixLQUREO0FBTUE1SCxXQUNDO0FBQUFDLFlBQU07QUFBTixLQVBEO0FBUUE0SCxhQUNDO0FBQUE1SCxZQUFNLFNBQU47QUFDQTBCLGNBQVE7QUFEUixLQVREO0FBV0FxRSxZQUNDO0FBQUEvRixZQUFNLGVBQU47QUFDQTZILG9CQUFjLFNBRGQ7QUFFQTFILGdCQUFVLElBRlY7QUFHQUssdUJBQWlCO0FBQ2hCLFlBQUFzSCxRQUFBOztBQUFBQSxtQkFBVyxFQUFYOztBQUNBcEgsVUFBRUMsT0FBRixDQUFVeEIsUUFBUTRJLGFBQWxCLEVBQWlDLFVBQUNDLENBQUQsRUFBSVAsQ0FBSjtBQ2dDM0IsaUJEL0JMSyxTQUFTOUcsSUFBVCxDQUFjO0FBQUNqQixtQkFBT2lJLEVBQUVqSSxLQUFWO0FBQWlCa0IsbUJBQU93RyxDQUF4QjtBQUEyQjNILGtCQUFNa0ksRUFBRWxJO0FBQW5DLFdBQWQsQ0MrQks7QURoQ047O0FBRUEsZUFBT2dJLFFBQVA7QUFQRDtBQUFBLEtBWkQ7QUFvQkE5SCxVQUNDO0FBQUFBLFlBQU0sUUFBTjtBQUVBUyxlQUNDO0FBQUF3SCxjQUFNLElBQU47QUFDQUMsa0JBQVUsS0FEVjtBQUVBQyxjQUFNLFFBRk47QUFHQUMsZ0JBQVEsS0FIUjtBQUlBQyxpQkFBUyxVQUpUO0FBS0FDLGNBQU0sSUFMTjtBQU1BQyxrQkFBVSxNQU5WO0FBT0FDLGdCQUFRLElBUFI7QUFRQUMsa0JBQVUsSUFSVjtBQVNBQyxrQkFBVSxJQVRWO0FBVUFDLGdCQUFRLEtBVlI7QUFXQUMsdUJBQWUsT0FYZjtBQVlBQyxjQUFNLElBWk47QUFhQUMsYUFBSyxJQWJMO0FBY0FDLGVBQU87QUFkUDtBQUhELEtBckJEO0FBdUNBQyxhQUNDO0FBQUFqSixhQUFPLEtBQVA7QUFDQUMsWUFBTSxRQUROO0FBRUFtQixvQkFBYyxHQUZkO0FBR0E4SCxhQUFPLENBSFA7QUFJQUMsZ0JBQVU7QUFKVixLQXhDRDtBQThDQUMsV0FDQztBQUFBbkosWUFBTTtBQUFOLEtBL0NEO0FBaURBbUIsa0JBQ0M7QUFBQW5CLFlBQU07QUFBTixLQWxERDtBQW9EQW9KLG1CQUNDO0FBQUFwSixZQUFNLE1BQU47QUFDQXFKLGdCQUFVO0FBRFYsS0FyREQ7QUF3REFBLGNBQ0M7QUFBQXJKLFlBQU07QUFBTixLQXpERDtBQTJEQUcsY0FDQztBQUFBSCxZQUFNO0FBQU4sS0E1REQ7QUE4REFvQyxhQUNDO0FBQUFwQyxZQUFNO0FBQU4sS0EvREQ7QUFpRUFzSixjQUNDO0FBQUF0SixZQUFNO0FBQU4sS0FsRUQ7QUFzRUEwQixZQUNDO0FBQUExQixZQUFNO0FBQU4sS0F2RUQ7QUF5RUFrQyxVQUNDO0FBQUFsQyxZQUFNO0FBQU4sS0ExRUQ7QUE0RUFFLFdBQ0M7QUFBQUYsWUFBTTtBQUFOLEtBN0VEO0FBK0VBQyxnQkFDQztBQUFBRCxZQUFNO0FBQU4sS0FoRkQ7QUFrRkFrSixjQUNDO0FBQUFsSixZQUFNO0FBQU4sS0FuRkQ7QUFxRkF1SixlQUNDO0FBQUF2SixZQUFNLFVBQU47QUFDQW1CLG9CQUFjO0FBRGQsS0F0RkQ7QUF5RkE4SCxXQUNDO0FBQUFqSixZQUFNLFVBQU47QUFDQW1CLG9CQUFjO0FBRGQsS0ExRkQ7QUE2RkEwRyxrQkFDQztBQUFBN0gsWUFBTSxRQUFOO0FBQ0FRLHVCQUFpQjtBQUNoQixZQUFBc0gsUUFBQTs7QUFBQUEsbUJBQVcsRUFBWDs7QUFDQXBILFVBQUVDLE9BQUYsQ0FBVXhCLFFBQVFTLE9BQWxCLEVBQTJCLFVBQUNvSSxDQUFELEVBQUlQLENBQUo7QUN1Q3JCLGlCRHRDTEssU0FBUzlHLElBQVQsQ0FBYztBQUFDakIsbUJBQU9pSSxFQUFFakksS0FBVjtBQUFpQmtCLG1CQUFPd0csQ0FBeEI7QUFBMkIzSCxrQkFBTWtJLEVBQUVsSTtBQUFuQyxXQUFkLENDc0NLO0FEdkNOOztBQUVBLGVBQU9nSSxRQUFQO0FBTEQ7QUFBQSxLQTlGRDtBQXNHQTBCLFVBQ0M7QUFBQXhKLFlBQU07QUFBTixLQXZHRDtBQXlHQVMsYUFDQztBQUFBVCxZQUFNLFVBQU47QUFDQW9DLGVBQVM7QUFEVCxLQTFHRDtBQTZHQUQsaUJBQ0M7QUFBQXBDLGFBQU8sYUFBUDtBQUNBQyxZQUFNLE1BRE47QUFFQW9DLGVBQVM7QUFGVDtBQTlHRCxHQUxEO0FBdUhBRyxjQUNDO0FBQUFRLFNBQ0M7QUFBQUMsZUFBUyxDQUFDLE1BQUQsRUFBUyxPQUFULEVBQWtCLE1BQWxCLEVBQTBCLFFBQTFCLEVBQW9DLFNBQXBDLEVBQStDLFVBQS9DLENBQVQ7QUFDQXlHLFlBQU0sQ0FBQztBQUFDQyxvQkFBWSxTQUFiO0FBQXdCQyxlQUFPO0FBQS9CLE9BQUQsQ0FETjtBQUVBMUcsb0JBQWM7QUFGZDtBQURELEdBeEhEO0FBNkhBUixrQkFDQztBQUFBUyxVQUNDO0FBQUFDLG1CQUFhLEtBQWI7QUFDQUMsbUJBQWEsS0FEYjtBQUVBQyxpQkFBVyxLQUZYO0FBR0FDLGlCQUFXLEtBSFg7QUFJQUMsd0JBQWtCLEtBSmxCO0FBS0FDLHNCQUFnQjtBQUxoQixLQUREO0FBT0FDLFdBQ0M7QUFBQU4sbUJBQWEsSUFBYjtBQUNBQyxtQkFBYSxJQURiO0FBRUFDLGlCQUFXLElBRlg7QUFHQUMsaUJBQVcsSUFIWDtBQUlBQyx3QkFBa0IsSUFKbEI7QUFLQUMsc0JBQWdCO0FBTGhCO0FBUkQsR0E5SEQ7QUE2SUFkLFlBQ0M7QUFBQSx5Q0FDQztBQUFBa0IsVUFBSSxRQUFKO0FBQ0F3QixZQUFNLGNBRE47QUFFQXZCLFlBQU0sVUFBQ3dCLE1BQUQsRUFBU3BHLEdBQVQ7QUNxREQsZURwREp3SCxjQUFjeEgsR0FBZCxDQ29ESTtBRHZETDtBQUFBLEtBREQ7QUFLQSx5Q0FDQztBQUFBMkUsVUFBSSxRQUFKO0FBQ0F3QixZQUFNLGNBRE47QUFFQXZCLFlBQU0sVUFBQ3dCLE1BQUQsRUFBU3BHLEdBQVQ7QUN1REQsZUR0REp3SCxjQUFjeEgsR0FBZCxDQ3NESTtBRHpETDtBQUFBLEtBTkQ7QUFVQSx5Q0FDQztBQUFBMkUsVUFBSSxRQUFKO0FBQ0F3QixZQUFNLGNBRE47QUFFQXZCLFlBQU0sVUFBQ3dCLE1BQUQsRUFBU3BHLEdBQVQ7QUN5REQsZUR4REp3SCxjQUFjeEgsR0FBZCxDQ3dESTtBRDNETDtBQUFBLEtBWEQ7QUFlQSwwQ0FDQztBQUFBMkUsVUFBSSxRQUFKO0FBQ0F3QixZQUFNLGVBRE47QUFFQXZCLFlBQU0sVUFBQ3dCLE1BQUQsRUFBU3BHLEdBQVQsRUFBY3dHLFVBQWQsRUFBMEJDLFFBQTFCLEVBQW9DakYsT0FBcEM7QUFDTCxZQUFBbUosYUFBQSxFQUFBN0QsTUFBQSxFQUFBOEQsZ0JBQUEsRUFBQWxFLEdBQUEsRUFBQW1FLElBQUEsRUFBQUMsSUFBQSxFQUFBQyxJQUFBLEVBQUFDLElBQUEsRUFBQUMsSUFBQSxFQUFBQyxJQUFBLEVBQUFDLElBQUE7O0FBQUEsWUFBR25MLElBQUlRLElBQUosS0FBWSxNQUFaLEtBQUFpRyxZQUFBLFFBQUFDLE1BQUFELFNBQUFFLElBQUEsWUFBQUQsSUFBc0NsRyxJQUF0QyxHQUFzQyxNQUF0QyxHQUFzQyxNQUF0QyxLQUE4Q1IsSUFBSVEsSUFBSixLQUFZaUcsU0FBU0UsSUFBVCxDQUFjbkcsSUFBM0U7QUFDQyxnQkFBTSxJQUFJOEYsT0FBT0MsS0FBWCxDQUFpQixHQUFqQixFQUFzQixnQkFBdEIsQ0FBTjtBQzRESTs7QUQzREwsYUFBQUUsWUFBQSxRQUFBb0UsT0FBQXBFLFNBQUFFLElBQUEsWUFBQWtFLEtBQW1CckssSUFBbkIsR0FBbUIsTUFBbkIsR0FBbUIsTUFBbkIsS0FBMkJULGVBQWVDLEdBQWYsRUFBb0J5RyxTQUFTRSxJQUFULENBQWNuRyxJQUFsQyxDQUEzQjtBQUNDdUYsa0JBQVFNLEdBQVIsQ0FBWSwwQkFBd0JyRyxJQUFJUSxJQUF4QztBQUNBLGdCQUFNLElBQUk4RixPQUFPQyxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLFVBQXRCLENBQU47QUM2REk7O0FEM0RMLFlBQUFFLFlBQUEsUUFBQXFFLE9BQUFyRSxTQUFBRSxJQUFBLFlBQUFtRSxLQUFtQmxDLFlBQW5CLEdBQW1CLE1BQW5CLEdBQW1CLE1BQW5CO0FBQ0MsY0FBR25DLFNBQVNFLElBQVQsQ0FBY2lDLFlBQWQsQ0FBMkJ3QyxNQUEzQixLQUFxQyxDQUF4QztBQUNDVCw0QkFBZ0JsRSxTQUFTRSxJQUFULENBQWNpQyxZQUFkLENBQTJCLENBQTNCLENBQWhCO0FBREQ7QUFHQytCLDRCQUFnQmxFLFNBQVNFLElBQVQsQ0FBY2lDLFlBQTlCO0FBSkY7QUNrRUs7O0FEN0RMLGFBQUFuQyxZQUFBLFFBQUFzRSxPQUFBdEUsU0FBQUUsSUFBQSxZQUFBb0UsS0FBbUI5SixLQUFuQixHQUFtQixNQUFuQixHQUFtQixNQUFuQixNQUE2QixDQUFBd0YsWUFBQSxRQUFBdUUsT0FBQXZFLFNBQUFFLElBQUEsWUFBQXFFLEtBQWlCakssSUFBakIsR0FBaUIsTUFBakIsR0FBaUIsTUFBakIsTUFBeUIsVUFBekIsSUFBQyxDQUFBMEYsWUFBQSxRQUFBd0UsT0FBQXhFLFNBQUFFLElBQUEsWUFBQXNFLEtBQXNEbEssSUFBdEQsR0FBc0QsTUFBdEQsR0FBc0QsTUFBdEQsTUFBOEQsTUFBNUY7QUFDQyxnQkFBTSxJQUFJdUYsT0FBT0MsS0FBWCxDQUFpQixHQUFqQixFQUFzQixhQUF0QixDQUFOO0FDK0RJOztBRDlETE8saUJBQVM1RyxRQUFRQyxhQUFSLENBQXNCLFNBQXRCLEVBQWlDa0wsT0FBakMsQ0FBeUM7QUFBQ2hMLGVBQUtMLElBQUk4RztBQUFWLFNBQXpDLEVBQTREO0FBQUNyRyxrQkFBUTtBQUFDRCxrQkFBTSxDQUFQO0FBQVVNLG1CQUFPO0FBQWpCO0FBQVQsU0FBNUQsQ0FBVDs7QUFFQSxZQUFHZ0csTUFBSDtBQUVDOEQsNkJBQW1CMUssUUFBUUMsYUFBUixDQUFzQjJHLE9BQU90RyxJQUE3QixFQUFtQ0osSUFBbkMsRUFBbkI7O0FBQ0EsZUFBQXFHLFlBQUEsUUFBQXlFLE9BQUF6RSxTQUFBRSxJQUFBLFlBQUF1RSxLQUFtQnRDLFlBQW5CLEdBQW1CLE1BQW5CLEdBQW1CLE1BQW5CLEtBQW1DNUksSUFBSTRJLFlBQUosS0FBb0IrQixhQUF2RCxJQUF3RUMsaUJBQWlCbEssS0FBakIsS0FBMkIsQ0FBbkc7QUFDQyxrQkFBTSxJQUFJNEYsT0FBT0MsS0FBWCxDQUFpQixHQUFqQixFQUFzQixPQUFLTyxPQUFPaEcsS0FBWixHQUFrQiwyQkFBeEMsQ0FBTjtBQ3FFSzs7QURuRU4sZUFBQTJGLFlBQUEsUUFBQTBFLE9BQUExRSxTQUFBRyxNQUFBLFlBQUF1RSxLQUFxQnZDLFlBQXJCLEdBQXFCLE1BQXJCLEdBQXFCLE1BQXJCLEtBQXFDNUksSUFBSTRJLFlBQUosS0FBb0IrQixhQUF6RCxJQUEwRUMsaUJBQWlCbEssS0FBakIsS0FBMkIsQ0FBckc7QUFDQyxrQkFBTSxJQUFJNEYsT0FBT0MsS0FBWCxDQUFpQixHQUFqQixFQUFzQixPQUFLTyxPQUFPaEcsS0FBWixHQUFrQiwyQkFBeEMsQ0FBTjtBQVBGO0FDNkVLO0FEL0ZOO0FBQUEsS0FoQkQ7QUE4Q0EsMENBQ0M7QUFBQTZELFVBQUksUUFBSjtBQUNBd0IsWUFBTSxlQUROO0FBRUF2QixZQUFNLFVBQUN3QixNQUFELEVBQVNwRyxHQUFUO0FBS0wsWUFBR0QsZUFBZUMsR0FBZixDQUFIO0FBQ0MrRixrQkFBUU0sR0FBUixDQUFZLDBCQUF3QnJHLElBQUlRLElBQXhDO0FBQ0EsZ0JBQU0sSUFBSThGLE9BQU9DLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsVUFBdEIsQ0FBTjtBQ2lFSTs7QURoRUwsYUFBQXZHLE9BQUEsT0FBR0EsSUFBS2lCLEtBQVIsR0FBUSxNQUFSLE1BQWtCLENBQUFqQixPQUFBLE9BQUNBLElBQUtlLElBQU4sR0FBTSxNQUFOLE1BQWMsVUFBZCxJQUFDLENBQUFmLE9BQUEsT0FBMkJBLElBQUtlLElBQWhDLEdBQWdDLE1BQWhDLE1BQXdDLE1BQTNEO0FBQ0MsZ0JBQU0sSUFBSXVGLE9BQU9DLEtBQVgsQ0FBaUIsR0FBakIsRUFBcUIsYUFBckIsQ0FBTjtBQ2tFSTtBRDdFTjtBQUFBLEtBL0NEO0FBMkRBLDBDQUNDO0FBQUE1QixVQUFJLFFBQUo7QUFDQXdCLFlBQU0sZUFETjtBQUVBdkIsWUFBTSxVQUFDd0IsTUFBRCxFQUFTcEcsR0FBVDtBQUNMLFlBQUdBLElBQUlRLElBQUosS0FBWSxNQUFmO0FBQ0MsZ0JBQU0sSUFBSThGLE9BQU9DLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsU0FBdEIsQ0FBTjtBQ3FFSTtBRHpFTjtBQUFBO0FBNUREO0FBOUlELENBREQsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRTNDQSxJQUFBaUIsYUFBQSxFQUFBOEQsS0FBQSxFQUFBdkwsY0FBQTs7QUFBQXlILGdCQUFnQixVQUFDeEgsR0FBRDtBQUNmLE1BQUF1TCxlQUFBLEVBQUE5SCxRQUFBO0FBQUE4SCxvQkFBa0JyTCxRQUFRQyxhQUFSLENBQXNCLGlCQUF0QixFQUF5Q0MsSUFBekMsQ0FBOEM7QUFBQ0csV0FBT1AsSUFBSU8sS0FBWjtBQUFtQnVHLFlBQVE5RyxJQUFJOEcsTUFBL0I7QUFBdUM3RSxlQUFXO0FBQWxELEdBQTlDLEVBQXVHO0FBQ3hIeEIsWUFBUTtBQUNQa0gsZUFBUyxDQURGO0FBRVBDLGdCQUFVLENBRkg7QUFHUGpFLGFBQU8sQ0FIQTtBQUlQa0Usa0JBQVksQ0FKTDtBQUtQQyxtQkFBYTtBQUxOO0FBRGdILEdBQXZHLEVBUWZDLEtBUmUsRUFBbEI7QUFVQXRFLGFBQVcsRUFBWDs7QUFFQWhDLElBQUVDLE9BQUYsQ0FBVTZKLGVBQVYsRUFBMkIsVUFBQ3ZELENBQUQ7QUNNeEIsV0RMRnZFLFNBQVN1RSxFQUFFeEgsSUFBWCxJQUFtQndILENDS2pCO0FETkg7O0FDUUMsU0RMRDlILFFBQVFDLGFBQVIsQ0FBc0IsU0FBdEIsRUFBaUNzSSxNQUFqQyxDQUF3QztBQUFDbEksV0FBT1AsSUFBSU8sS0FBWjtBQUFtQkMsVUFBTVIsSUFBSThHO0FBQTdCLEdBQXhDLEVBQThFO0FBQzdFSCxVQUNDO0FBQUFsRCxnQkFBVUE7QUFBVjtBQUY0RSxHQUE5RSxDQ0tDO0FEckJjLENBQWhCOztBQXFCQTFELGlCQUFpQixVQUFDQyxHQUFELEVBQU1RLElBQU47QUFDaEIsTUFBQVAsS0FBQTtBQUFBQSxVQUFRQyxRQUFRQyxhQUFSLENBQXNCLGlCQUF0QixFQUF5Q0MsSUFBekMsQ0FBOEM7QUFBQzBHLFlBQVE5RyxJQUFJOEcsTUFBYjtBQUFzQnZHLFdBQU9QLElBQUlPLEtBQWpDO0FBQXdDRixTQUFLO0FBQUNDLFdBQUtOLElBQUlLO0FBQVYsS0FBN0M7QUFBNkRHLFVBQU1BLFFBQVFSLElBQUlRO0FBQS9FLEdBQTlDLEVBQW9JO0FBQUNDLFlBQU87QUFBQ0osV0FBSztBQUFOO0FBQVIsR0FBcEksQ0FBUjs7QUFDQSxNQUFHSixNQUFNUyxLQUFOLEtBQWdCLENBQW5CO0FBQ0MsV0FBTyxJQUFQO0FDdUJDOztBRHRCRixTQUFPLEtBQVA7QUFKZ0IsQ0FBakI7O0FBTUE0SyxRQUFRLFVBQUNsRixNQUFELEVBQVNwRyxHQUFUO0FBQ1AsTUFBR3dMLFFBQVFDLFlBQVIsQ0FBcUJyRixNQUFyQixFQUE2QnBHLElBQUlPLEtBQWpDLENBQUg7QUFDQyxVQUFNLElBQUkrRixPQUFPQyxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGlCQUF0QixDQUFOO0FDeUJDOztBRHRCRixNQUFHdkcsSUFBSTJFLEVBQUosS0FBVSxRQUFWLElBQXNCLENBQUM2RyxRQUFRRSxjQUFSLENBQXVCMUwsSUFBSU8sS0FBM0IsRUFBaUMscUJBQWpDLENBQTFCO0FBQ0MsVUFBTSxJQUFJK0YsT0FBT0MsS0FBWCxDQUFpQixHQUFqQixFQUFzQixrQkFBdEIsQ0FBTjtBQ3dCQztBRDlCSyxDQUFSOztBQVFBckcsUUFBUVMsT0FBUixDQUFnQjRLLGVBQWhCLEdBQ0M7QUFBQS9LLFFBQU0saUJBQU47QUFDQUssUUFBTSxvQkFETjtBQUVBQyxTQUFNLEtBRk47QUFHQUwsVUFDQztBQUFBRCxVQUNDO0FBQUFPLFlBQU0sTUFBTjtBQUNBQyxrQkFBWSxJQURaO0FBRUFDLGFBQU8sSUFGUDtBQUdBQyxnQkFBVSxJQUhWO0FBSUFDLGFBQU9DLGFBQWFDLEtBQWIsQ0FBbUJDO0FBSjFCLEtBREQ7QUFNQVIsV0FDQztBQUFBQyxZQUFNO0FBQU4sS0FQRDtBQVFBK0YsWUFDQztBQUFBL0YsWUFBTSxlQUFOO0FBQ0E2SCxvQkFBYyxTQURkO0FBRUExSCxnQkFBVSxJQUZWO0FBR0FLLHVCQUFpQjtBQUNoQixZQUFBc0gsUUFBQTs7QUFBQUEsbUJBQVcsRUFBWDs7QUFDQXBILFVBQUVDLE9BQUYsQ0FBVXhCLFFBQVE0SSxhQUFsQixFQUFpQyxVQUFDQyxDQUFELEVBQUlQLENBQUo7QUM2QjNCLGlCRDVCTEssU0FBUzlHLElBQVQsQ0FBYztBQUFDakIsbUJBQU9pSSxFQUFFakksS0FBVjtBQUFpQmtCLG1CQUFPd0csQ0FBeEI7QUFBMkIzSCxrQkFBTWtJLEVBQUVsSTtBQUFuQyxXQUFkLENDNEJLO0FEN0JOOztBQUVBLGVBQU9nSSxRQUFQO0FBUEQ7QUFBQSxLQVREO0FBaUJBbEUsUUFDQztBQUFBNUQsWUFBTSxRQUFOO0FBQ0FHLGdCQUFVLElBRFY7QUFFQUssdUJBQWlCO0FBQ2hCLGVBQU8sQ0FBQztBQUFDVCxpQkFBTyxLQUFSO0FBQWVrQixpQkFBTyxRQUF0QjtBQUFnQ25CLGdCQUFNO0FBQXRDLFNBQUQsRUFBbUQ7QUFBQ0MsaUJBQU8sS0FBUjtBQUFla0IsaUJBQU8sUUFBdEI7QUFBZ0NuQixnQkFBTTtBQUF0QyxTQUFuRCxDQUFQO0FBSEQ7QUFBQSxLQWxCRDtBQXNCQXNGLFVBQ0M7QUFBQXBGLFlBQU0sUUFBTjtBQUNBRyxnQkFBVSxJQURWO0FBRUFLLHVCQUFpQjtBQ2dEWixlRC9DSixDQUNDO0FBQUNULGlCQUFPLFFBQVI7QUFBa0JrQixpQkFBTyxlQUF6QjtBQUEwQ25CLGdCQUFNO0FBQWhELFNBREQsRUFFQztBQUFDQyxpQkFBTyxRQUFSO0FBQWtCa0IsaUJBQU8sY0FBekI7QUFBeUNuQixnQkFBTTtBQUEvQyxTQUZELEVBR0M7QUFBQ0MsaUJBQU8sUUFBUjtBQUFrQmtCLGlCQUFPLGVBQXpCO0FBQTBDbkIsZ0JBQU07QUFBaEQsU0FIRCxFQUlDO0FBQUNDLGlCQUFPLFFBQVI7QUFBa0JrQixpQkFBTyxjQUF6QjtBQUF5Q25CLGdCQUFNO0FBQS9DLFNBSkQsRUFLQztBQUFDQyxpQkFBTyxRQUFSO0FBQWtCa0IsaUJBQU8sZUFBekI7QUFBMENuQixnQkFBTTtBQUFoRCxTQUxELEVBTUM7QUFBQ0MsaUJBQU8sUUFBUjtBQUFrQmtCLGlCQUFPLGNBQXpCO0FBQXlDbkIsZ0JBQU07QUFBL0MsU0FORCxDQytDSTtBRGxETDtBQUFBLEtBdkJEO0FBa0NBb0IsZUFDQztBQUFBbEIsWUFBTTtBQUFOLEtBbkNEO0FBb0NBNkQsVUFDQztBQUFBN0QsWUFBTSxVQUFOO0FBQ0FHLGdCQUFVLElBRFY7QUFFQWlDLGVBQVE7QUFGUjtBQXJDRCxHQUpEO0FBNkNBRyxjQUNDO0FBQUFRLFNBQ0M7QUFBQUMsZUFBUyxDQUFDLE1BQUQsRUFBUyxPQUFULEVBQWtCLFFBQWxCLEVBQTRCLElBQTVCLEVBQWtDLE1BQWxDLEVBQTBDLFdBQTFDLENBQVQ7QUFDQUMsb0JBQWM7QUFEZDtBQURELEdBOUNEO0FBa0RBUixrQkFDQztBQUFBUyxVQUNDO0FBQUFDLG1CQUFhLEtBQWI7QUFDQUMsbUJBQWEsS0FEYjtBQUVBQyxpQkFBVyxLQUZYO0FBR0FDLGlCQUFXLEtBSFg7QUFJQUMsd0JBQWtCLEtBSmxCO0FBS0FDLHNCQUFnQjtBQUxoQixLQUREO0FBT0FDLFdBQ0M7QUFBQU4sbUJBQWEsSUFBYjtBQUNBQyxtQkFBYSxJQURiO0FBRUFDLGlCQUFXLElBRlg7QUFHQUMsaUJBQVcsSUFIWDtBQUlBQyx3QkFBa0IsSUFKbEI7QUFLQUMsc0JBQWdCO0FBTGhCO0FBUkQsR0FuREQ7QUFrRUFkLFlBQ0M7QUFBQSwyQ0FDQztBQUFBa0IsVUFBSSxRQUFKO0FBQ0F3QixZQUFNLGNBRE47QUFFQXZCLFlBQU0sVUFBQ3dCLE1BQUQsRUFBU3BHLEdBQVQ7QUMwRUQsZUR6RUp3SCxjQUFjeEgsR0FBZCxDQ3lFSTtBRDVFTDtBQUFBLEtBREQ7QUFLQSwyQ0FDQztBQUFBMkUsVUFBSSxRQUFKO0FBQ0F3QixZQUFNLGNBRE47QUFFQXZCLFlBQU0sVUFBQ3dCLE1BQUQsRUFBU3BHLEdBQVQ7QUM0RUQsZUQzRUp3SCxjQUFjeEgsR0FBZCxDQzJFSTtBRDlFTDtBQUFBLEtBTkQ7QUFVQSwyQ0FDQztBQUFBMkUsVUFBSSxRQUFKO0FBQ0F3QixZQUFNLGNBRE47QUFFQXZCLFlBQU0sVUFBQ3dCLE1BQUQsRUFBU3BHLEdBQVQ7QUM4RUQsZUQ3RUp3SCxjQUFjeEgsR0FBZCxDQzZFSTtBRGhGTDtBQUFBLEtBWEQ7QUFnQkEsNENBQ0M7QUFBQTJFLFVBQUksUUFBSjtBQUNBd0IsWUFBTSxlQUROO0FBRUF2QixZQUFNLFVBQUN3QixNQUFELEVBQVNwRyxHQUFUO0FDK0VELGVEOUVKc0wsTUFBTWxGLE1BQU4sRUFBY3BHLEdBQWQsQ0M4RUk7QURqRkw7QUFBQSxLQWpCRDtBQXNCQSw0Q0FDQztBQUFBMkUsVUFBSSxRQUFKO0FBQ0F3QixZQUFNLGVBRE47QUFFQXZCLFlBQU0sVUFBQ3dCLE1BQUQsRUFBU3BHLEdBQVQsRUFBY3dHLFVBQWQsRUFBMEJDLFFBQTFCLEVBQW9DakYsT0FBcEM7QUFDTCxZQUFBa0YsR0FBQTtBQUFBNEUsY0FBTWxGLE1BQU4sRUFBY3BHLEdBQWQ7O0FBQ0EsYUFBQXlHLFlBQUEsUUFBQUMsTUFBQUQsU0FBQUUsSUFBQSxZQUFBRCxJQUFtQmxHLElBQW5CLEdBQW1CLE1BQW5CLEdBQW1CLE1BQW5CLEtBQTJCVCxlQUFlQyxHQUFmLEVBQW9CeUcsU0FBU0UsSUFBVCxDQUFjbkcsSUFBbEMsQ0FBM0I7QUFDQ3VGLGtCQUFRTSxHQUFSLENBQVksNEJBQTBCckcsSUFBSVEsSUFBMUM7QUFDQSxnQkFBTSxJQUFJOEYsT0FBT0MsS0FBWCxDQUFpQixHQUFqQixFQUFzQixhQUFXdkcsSUFBSVEsSUFBckMsQ0FBTjtBQ2lGSTtBRHZGTjtBQUFBLEtBdkJEO0FBK0JBLDRDQUNDO0FBQUFtRSxVQUFJLFFBQUo7QUFDQXdCLFlBQU0sZUFETjtBQUVBdkIsWUFBTSxVQUFDd0IsTUFBRCxFQUFTcEcsR0FBVDtBQUNMc0wsY0FBTWxGLE1BQU4sRUFBY3BHLEdBQWQ7O0FBQ0EsWUFBR0QsZUFBZUMsR0FBZixDQUFIO0FBQ0MrRixrQkFBUU0sR0FBUixDQUFZLDRCQUEwQnJHLElBQUlRLElBQTFDO0FBQ0EsZ0JBQU0sSUFBSThGLE9BQU9DLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsVUFBdEIsQ0FBTjtBQ21GSTtBRHpGTjtBQUFBO0FBaENEO0FBbkVELENBREQsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRW5DQSxJQUFBaUIsYUFBQSxFQUFBekgsY0FBQTs7QUFBQXlILGdCQUFnQixVQUFDeEgsR0FBRDtBQUNmLE1BQUF1RCxPQUFBLEVBQUFvSSxjQUFBO0FBQUFBLG1CQUFpQnpMLFFBQVFDLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDQyxJQUF4QyxDQUE2QztBQUFDMEcsWUFBUTlHLElBQUk4RyxNQUFiO0FBQXFCdkcsV0FBT1AsSUFBSU8sS0FBaEM7QUFBdUMwQixlQUFXO0FBQWxELEdBQTdDLEVBQXNHO0FBQ3RIeEIsWUFBUTtBQUNQa0gsZUFBUyxDQURGO0FBRVBDLGdCQUFVLENBRkg7QUFHUGpFLGFBQU8sQ0FIQTtBQUlQa0Usa0JBQVksQ0FKTDtBQUtQQyxtQkFBYTtBQUxOO0FBRDhHLEdBQXRHLEVBUWRDLEtBUmMsRUFBakI7QUFVQXhFLFlBQVUsRUFBVjs7QUFFQTlCLElBQUVDLE9BQUYsQ0FBVWlLLGNBQVYsRUFBMEIsVUFBQzNELENBQUQ7QUNNdkIsV0RMRnpFLFFBQVF5RSxFQUFFeEgsSUFBVixJQUFrQndILENDS2hCO0FETkg7O0FDUUMsU0RMRDlILFFBQVFDLGFBQVIsQ0FBc0IsU0FBdEIsRUFBaUNzSSxNQUFqQyxDQUF3QztBQUFDbEksV0FBT1AsSUFBSU8sS0FBWjtBQUFtQkMsVUFBTVIsSUFBSThHO0FBQTdCLEdBQXhDLEVBQThFO0FBQzdFSCxVQUNDO0FBQUFwRCxlQUFTQTtBQUFUO0FBRjRFLEdBQTlFLENDS0M7QURyQmMsQ0FBaEI7O0FBb0JBeEQsaUJBQWlCLFVBQUNDLEdBQUQsRUFBTVEsSUFBTjtBQUNoQixNQUFBUCxLQUFBO0FBQUFBLFVBQVFDLFFBQVFDLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDQyxJQUF4QyxDQUE2QztBQUFDMEcsWUFBUTlHLElBQUk4RyxNQUFiO0FBQXNCdkcsV0FBT1AsSUFBSU8sS0FBakM7QUFBd0NGLFNBQUs7QUFBQ0MsV0FBS04sSUFBSUs7QUFBVixLQUE3QztBQUE2REcsVUFBTUEsUUFBUVIsSUFBSVE7QUFBL0UsR0FBN0MsRUFBbUk7QUFBQ0MsWUFBTztBQUFDSixXQUFLO0FBQU47QUFBUixHQUFuSSxDQUFSOztBQUNBLE1BQUdKLE1BQU1TLEtBQU4sS0FBZ0IsQ0FBbkI7QUFDQyxXQUFPLElBQVA7QUN3QkM7O0FEdkJGLFNBQU8sS0FBUDtBQUpnQixDQUFqQjs7QUFLQVIsUUFBUVMsT0FBUixDQUFnQmdMLGNBQWhCLEdBQ0M7QUFBQW5MLFFBQU0sZ0JBQU47QUFDQU0sU0FBTyxNQURQO0FBRUFELFFBQU0sbUJBRk47QUFHQUosVUFDQztBQUFBcUcsWUFDQztBQUFBL0YsWUFBTSxlQUFOO0FBQ0E2SCxvQkFBYyxTQURkO0FBRUExSCxnQkFBVSxJQUZWO0FBR0FLLHVCQUFpQjtBQUNoQixZQUFBc0gsUUFBQTs7QUFBQUEsbUJBQVcsRUFBWDs7QUFDQXBILFVBQUVDLE9BQUYsQ0FBVXhCLFFBQVE0SSxhQUFsQixFQUFpQyxVQUFDQyxDQUFELEVBQUlQLENBQUo7QUM0QjNCLGlCRDNCTEssU0FBUzlHLElBQVQsQ0FBYztBQUFDakIsbUJBQU9pSSxFQUFFakksS0FBVjtBQUFpQmtCLG1CQUFPd0csQ0FBeEI7QUFBMkIzSCxrQkFBTWtJLEVBQUVsSTtBQUFuQyxXQUFkLENDMkJLO0FENUJOOztBQUVBLGVBQU9nSSxRQUFQO0FBUEQ7QUFBQSxLQUREO0FBU0FySSxVQUNDO0FBQUFPLFlBQU0sTUFBTjtBQUNBQyxrQkFBVyxJQURYO0FBRUFDLGFBQU0sSUFGTjtBQUdBQyxnQkFBVSxJQUhWO0FBSUFDLGFBQU9DLGFBQWFDLEtBQWIsQ0FBbUJDO0FBSjFCLEtBVkQ7QUFlQVIsV0FDQztBQUFBQyxZQUFNO0FBQU4sS0FoQkQ7QUFpQkFrQixlQUNDO0FBQUFsQixZQUFNO0FBQU4sS0FsQkQ7QUFtQkEyRCxhQUNDO0FBQUEzRCxZQUFNLFNBQU47QUFDQWtDLFlBQU07QUFETixLQXBCRDtBQXNCQTBCLFFBQ0M7QUFBQTVELFlBQU0sUUFBTjtBQUNBb0MsZUFBUSxJQURSO0FBRUFqQyxnQkFBVSxJQUZWO0FBR0FLLHVCQUFpQjtBQ3VDWixlRHRDSixDQUNDO0FBQUNULGlCQUFPLFVBQVI7QUFBb0JrQixpQkFBTyxNQUEzQjtBQUFtQ25CLGdCQUFNO0FBQXpDLFNBREQsRUFFQztBQUFDQyxpQkFBTyxhQUFSO0FBQXVCa0IsaUJBQU8sUUFBOUI7QUFBd0NuQixnQkFBTTtBQUE5QyxTQUZELENDc0NJO0FEMUNMO0FBQUEsS0F2QkQ7QUErQkErRCxVQUNDO0FBQUE5RCxhQUFPLE9BQVA7QUFDQUMsWUFBTSxVQUROO0FBRUFHLGdCQUFVLElBRlY7QUFHQWlDLGVBQVE7QUFIUjtBQWhDRCxHQUpEO0FBMENBRyxjQUNDO0FBQUFRLFNBQ0M7QUFBQUMsZUFBUyxDQUFDLE1BQUQsRUFBUyxPQUFULEVBQWtCLFFBQWxCLEVBQTRCLElBQTVCLEVBQWtDLFdBQWxDLEVBQStDLFVBQS9DLENBQVQ7QUFDQUMsb0JBQWM7QUFEZDtBQURELEdBM0NEO0FBK0NBUixrQkFDQztBQUFBUyxVQUNDO0FBQUFDLG1CQUFhLEtBQWI7QUFDQUMsbUJBQWEsS0FEYjtBQUVBQyxpQkFBVyxLQUZYO0FBR0FDLGlCQUFXLEtBSFg7QUFJQUMsd0JBQWtCLEtBSmxCO0FBS0FDLHNCQUFnQjtBQUxoQixLQUREO0FBT0FDLFdBQ0M7QUFBQU4sbUJBQWEsSUFBYjtBQUNBQyxtQkFBYSxJQURiO0FBRUFDLGlCQUFXLElBRlg7QUFHQUMsaUJBQVcsSUFIWDtBQUlBQyx3QkFBa0IsSUFKbEI7QUFLQUMsc0JBQWdCO0FBTGhCO0FBUkQsR0FoREQ7QUErREFkLFlBQ0M7QUFBQSwwQ0FDQztBQUFBa0IsVUFBSSxRQUFKO0FBQ0F3QixZQUFNLGNBRE47QUFFQXZCLFlBQU0sVUFBQ3dCLE1BQUQsRUFBU3BHLEdBQVQ7QUNtREQsZURsREp3SCxjQUFjeEgsR0FBZCxDQ2tESTtBRHJETDtBQUFBLEtBREQ7QUFLQSwwQ0FDQztBQUFBMkUsVUFBSSxRQUFKO0FBQ0F3QixZQUFNLGNBRE47QUFFQXZCLFlBQU0sVUFBQ3dCLE1BQUQsRUFBU3BHLEdBQVQ7QUNxREQsZURwREp3SCxjQUFjeEgsR0FBZCxDQ29ESTtBRHZETDtBQUFBLEtBTkQ7QUFVQSwwQ0FDQztBQUFBMkUsVUFBSSxRQUFKO0FBQ0F3QixZQUFNLGNBRE47QUFFQXZCLFlBQU0sVUFBQ3dCLE1BQUQsRUFBU3BHLEdBQVQ7QUN1REQsZUR0REp3SCxjQUFjeEgsR0FBZCxDQ3NESTtBRHpETDtBQUFBLEtBWEQ7QUFnQkEsMkNBQ0M7QUFBQTJFLFVBQUksUUFBSjtBQUNBd0IsWUFBTSxlQUROO0FBRUF2QixZQUFNLFVBQUN3QixNQUFELEVBQVNwRyxHQUFULEVBQWN3RyxVQUFkLEVBQTBCQyxRQUExQixFQUFvQ2pGLE9BQXBDO0FBQ0wsWUFBQWtGLEdBQUE7O0FBQUEsYUFBQUQsWUFBQSxRQUFBQyxNQUFBRCxTQUFBRSxJQUFBLFlBQUFELElBQW1CbEcsSUFBbkIsR0FBbUIsTUFBbkIsR0FBbUIsTUFBbkIsS0FBMkJULGVBQWVDLEdBQWYsRUFBb0J5RyxTQUFTRSxJQUFULENBQWNuRyxJQUFsQyxDQUEzQjtBQUNDdUYsa0JBQVFNLEdBQVIsQ0FBWSwyQkFBeUJyRyxJQUFJUSxJQUF6QztBQUNBLGdCQUFNLElBQUk4RixPQUFPQyxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLFVBQXRCLENBQU47QUN5REk7QUQ5RE47QUFBQSxLQWpCRDtBQXdCQSwyQ0FDQztBQUFBNUIsVUFBSSxRQUFKO0FBQ0F3QixZQUFNLGVBRE47QUFFQXZCLFlBQU0sVUFBQ3dCLE1BQUQsRUFBU3BHLEdBQVQ7QUFDTEEsWUFBSTBFLE9BQUosR0FBYyxJQUFkOztBQUNBLFlBQUczRSxlQUFlQyxHQUFmLENBQUg7QUFDQytGLGtCQUFRTSxHQUFSLENBQVksMkJBQXlCckcsSUFBSVEsSUFBekM7QUFDQSxnQkFBTSxJQUFJOEYsT0FBT0MsS0FBWCxDQUFpQixHQUFqQixFQUFzQixhQUFXdkcsSUFBSVEsSUFBckMsQ0FBTjtBQzJESTtBRGpFTjtBQUFBO0FBekJEO0FBaEVELENBREQsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIjVE9ETyBvYmplY3TnmoRuYW1l5LiN6IO96YeN5aSN77yM6ZyA6KaB6ICD6JmR5Yiw57O757uf6KGoXG5pc1JlcGVhdGVkTmFtZSA9IChkb2MpLT5cblx0b3RoZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLmZpbmQoe19pZDogeyRuZTogZG9jLl9pZH0sIHNwYWNlOiBkb2Muc3BhY2UsIG5hbWU6IGRvYy5uYW1lfSwge2ZpZWxkczp7X2lkOiAxfX0pXG5cdGlmIG90aGVyLmNvdW50KCkgPiAwXG5cdFx0cmV0dXJuIHRydWVcblx0cmV0dXJuIGZhbHNlXG5cbkNyZWF0b3IuT2JqZWN0cy5vYmplY3RzID1cblx0bmFtZTogXCJvYmplY3RzXCJcblx0aWNvbjogXCJvcmRlcnNcIlxuXHRsYWJlbDogXCLlr7nosaFcIlxuXHRmaWVsZHM6XG5cdFx0bmFtZTpcblx0XHRcdHR5cGU6IFwidGV4dFwiXG5cdFx0XHRzZWFyY2hhYmxlOnRydWVcblx0XHRcdGluZGV4OnRydWVcblx0XHRcdHJlcXVpcmVkOiB0cnVlXG5cdFx0XHRyZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGVcblx0XHRsYWJlbDpcblx0XHRcdHR5cGU6IFwidGV4dFwiXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZVxuXHRcdGljb246XG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXG5cdFx0XHRvcHRpb25zRnVuY3Rpb246ICgpLT5cblx0XHRcdFx0b3B0aW9ucyA9IFtdXG5cdFx0XHRcdF8uZm9yRWFjaCBDcmVhdG9yLnJlc291cmNlcy5zbGRzSWNvbnMuc3RhbmRhcmQsIChzdmcpLT5cblx0XHRcdFx0XHRvcHRpb25zLnB1c2gge3ZhbHVlOiBzdmcsIGxhYmVsOiBzdmcsIGljb246IHN2Z31cblx0XHRcdFx0cmV0dXJuIG9wdGlvbnNcblx0XHRpc19lbmFibGU6XG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxuXHRcdFx0ZGVmYXVsdFZhbHVlOiB0cnVlXG5cdFx0ZW5hYmxlX3NlYXJjaDpcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cdFx0ZW5hYmxlX2ZpbGVzOlxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcblx0XHRlbmFibGVfdGFza3M6XG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxuXHRcdGVuYWJsZV9ub3Rlczpcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cdFx0ZW5hYmxlX2V2ZW50czpcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cdFx0ZW5hYmxlX2FwaTpcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cdFx0XHRkZWZhdWx0VmFsdWU6IHRydWVcblx0XHRcdGhpZGRlbjogdHJ1ZVxuXHRcdGVuYWJsZV9zaGFyZTpcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cdFx0XHRkZWZhdWx0VmFsdWU6IGZhbHNlXG5cdFx0ZW5hYmxlX2luc3RhbmNlczpcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cdFx0ZW5hYmxlX2NoYXR0ZXI6XG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxuXHRcdGVuYWJsZV9hdWRpdDpcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cdFx0ZW5hYmxlX3RyYXNoOlxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcblx0XHRlbmFibGVfc3BhY2VfZ2xvYmFsOlxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcblx0XHRcdGRlZmF1bHRWYWx1ZTogZmFsc2Vcblx0XHRpc192aWV3OlxuXHRcdFx0dHlwZTogJ2Jvb2xlYW4nXG5cdFx0XHRkZWZhdWx0VmFsdWU6IGZhbHNlXG5cdFx0XHRvbWl0OiB0cnVlXG5cdFx0aGlkZGVuOlxuXHRcdFx0bGFiZWw6IFwi6ZqQ6JePXCJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cdFx0XHRvbWl0OiB0cnVlXG5cdFx0ZGVzY3JpcHRpb246XG5cdFx0XHRsYWJlbDogXCJEZXNjcmlwdGlvblwiXG5cdFx0XHR0eXBlOiBcInRleHRhcmVhXCJcblx0XHRcdGlzX3dpZGU6IHRydWVcblx0XHRzaWRlYmFyOlxuXHRcdFx0dHlwZTogXCJvYmplY3RcIlxuXHRcdFx0bGFiZWw6IFwi5bem5L6n5YiX6KGoXCJcblx0XHRcdGJsYWNrYm94OiB0cnVlXG5cdFx0XHRvbWl0OiB0cnVlXG5cdFx0XHRoaWRkZW46IHRydWVcblx0XHRmaWVsZHM6XG5cdFx0XHR0eXBlOiBcIm9iamVjdFwiXG5cdFx0XHRsYWJlbDogXCLlrZfmrrVcIlxuXHRcdFx0YmxhY2tib3g6IHRydWVcblx0XHRcdG9taXQ6IHRydWVcblx0XHRcdGhpZGRlbjogdHJ1ZVxuXHRcdGxpc3Rfdmlld3M6XG5cdFx0XHR0eXBlOiBcIm9iamVjdFwiXG5cdFx0XHRsYWJlbDogXCLliJfooajop4blm75cIlxuXHRcdFx0YmxhY2tib3g6IHRydWVcblx0XHRcdG9taXQ6IHRydWVcblx0XHRcdGhpZGRlbjogdHJ1ZVxuXHRcdGFjdGlvbnM6XG5cdFx0XHR0eXBlOiBcIm9iamVjdFwiXG5cdFx0XHRsYWJlbDogXCLmk43kvZxcIlxuXHRcdFx0YmxhY2tib3g6IHRydWVcblx0XHRcdG9taXQ6IHRydWVcblx0XHRcdGhpZGRlbjogdHJ1ZVxuXHRcdHBlcm1pc3Npb25fc2V0OlxuXHRcdFx0dHlwZTogXCJvYmplY3RcIlxuXHRcdFx0bGFiZWw6IFwi5p2D6ZmQ6K6+572uXCJcblx0XHRcdGJsYWNrYm94OiB0cnVlXG5cdFx0XHRvbWl0OiB0cnVlXG5cdFx0XHRoaWRkZW46IHRydWVcblx0XHR0cmlnZ2Vyczpcblx0XHRcdHR5cGU6IFwib2JqZWN0XCJcblx0XHRcdGxhYmVsOiBcIuinpuWPkeWZqFwiXG5cdFx0XHRibGFja2JveDogdHJ1ZVxuXHRcdFx0b21pdDogdHJ1ZVxuXHRcdFx0aGlkZGVuOiB0cnVlXG5cdFx0Y3VzdG9tOlxuXHRcdFx0bGFiZWw6IFwi6KeE5YiZXCJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cdFx0XHRvbWl0OiB0cnVlXG5cdFx0b3duZXI6XG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXG5cdFx0XHRoaWRkZW46IHRydWVcblx0XHRhcHBfdW5pcXVlX2lkOlxuXHRcdFx0dHlwZTogJ3RleHQnXG5cdFx0XHRoaWRkZW46IHRydWVcblx0XHRhcHBfdmVyc2lvbjpcblx0XHRcdHR5cGU6ICd0ZXh0Jyxcblx0XHRcdGhpZGRlbjogdHJ1ZVxuXG5cdGxpc3Rfdmlld3M6XG5cdFx0YWxsOlxuXHRcdFx0Y29sdW1uczogW1wibmFtZVwiLCBcImxhYmVsXCIsIFwiaXNfZW5hYmxlXCIsIFwibW9kaWZpZWRcIl1cblx0XHRcdGxhYmVsOlwi5YWo6YOoXCJcblx0XHRcdGZpbHRlcl9zY29wZTogXCJzcGFjZVwiXG5cblx0cGVybWlzc2lvbl9zZXQ6XG5cdFx0dXNlcjpcblx0XHRcdGFsbG93Q3JlYXRlOiBmYWxzZVxuXHRcdFx0YWxsb3dEZWxldGU6IGZhbHNlXG5cdFx0XHRhbGxvd0VkaXQ6IGZhbHNlXG5cdFx0XHRhbGxvd1JlYWQ6IGZhbHNlXG5cdFx0XHRtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZVxuXHRcdFx0dmlld0FsbFJlY29yZHM6IGZhbHNlXG5cdFx0YWRtaW46XG5cdFx0XHRhbGxvd0NyZWF0ZTogdHJ1ZVxuXHRcdFx0YWxsb3dEZWxldGU6IHRydWVcblx0XHRcdGFsbG93RWRpdDogdHJ1ZVxuXHRcdFx0YWxsb3dSZWFkOiB0cnVlXG5cdFx0XHRtb2RpZnlBbGxSZWNvcmRzOiB0cnVlXG5cdFx0XHR2aWV3QWxsUmVjb3JkczogdHJ1ZVxuXG5cdGFjdGlvbnM6XG5cdFx0Y29weV9vZGF0YTpcblx0XHRcdGxhYmVsOiBcIuWkjeWItk9EYXRh572R5Z2AXCJcblx0XHRcdHZpc2libGU6IHRydWVcblx0XHRcdG9uOiBcInJlY29yZFwiXG5cdFx0XHR0b2RvOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgaXRlbV9lbGVtZW50KS0+XG5cdFx0XHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0QnlJZChyZWNvcmRfaWQpXG5cdFx0XHRcdCNlbmFibGVfYXBpIOWxnuaAp+acquW8gOaUvlxuXHRcdFx0XHRpZiByZWNvcmQ/LmVuYWJsZV9hcGkgfHwgdHJ1ZVxuXHRcdFx0XHRcdG9fbmFtZSA9IHJlY29yZD8ubmFtZVxuXHRcdFx0XHRcdHBhdGggPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFQYXRoKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSwgb19uYW1lKVxuXHRcdFx0XHRcdGl0ZW1fZWxlbWVudC5hdHRyKCdkYXRhLWNsaXBib2FyZC10ZXh0JywgcGF0aCk7XG5cdFx0XHRcdFx0aWYgIWl0ZW1fZWxlbWVudC5hdHRyKCdkYXRhLWNsaXBib2FyZC1uZXcnKVxuXHRcdFx0XHRcdFx0Y2xpcGJvYXJkID0gbmV3IENsaXBib2FyZChpdGVtX2VsZW1lbnRbMF0pO1xuXHRcdFx0XHRcdFx0aXRlbV9lbGVtZW50LmF0dHIoJ2RhdGEtY2xpcGJvYXJkLW5ldycsIHRydWUpXG5cblx0XHRcdFx0XHRcdGNsaXBib2FyZC5vbignc3VjY2VzcycsICAoZSkgLT5cblx0XHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MoJ+WkjeWItuaIkOWKnycpO1xuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0Y2xpcGJvYXJkLm9uKCdlcnJvcicsICAoZSkgLT5cblx0XHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKCflpI3liLblpLHotKUnKTtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImVcIlxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdCNmaXgg6K+m57uG6aG16Z2iKOe9kemhtUxJIOaJi+acuueJiHZpZXctYWN0aW9uKeesrOS4gOasoeeCueWHu+WkjeWItuS4jeaJp+ihjFxuXHRcdFx0XHRcdFx0aWYgaXRlbV9lbGVtZW50WzBdLnRhZ05hbWUgPT0gJ0xJJyB8fCBpdGVtX2VsZW1lbnQuaGFzQ2xhc3MoJ3ZpZXctYWN0aW9uJylcblx0XHRcdFx0XHRcdFx0aXRlbV9lbGVtZW50LnRyaWdnZXIoXCJjbGlja1wiKTtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHRvYXN0ci5lcnJvcign5aSN5Yi25aSx6LSlOiDmnKrlkK/nlKhBUEknKTtcblxuXG5cdHRyaWdnZXJzOlxuXHRcdFwiYmVmb3JlLmluc2VydC5zZXJ2ZXIub2JqZWN0c1wiOlxuXHRcdFx0b246IFwic2VydmVyXCJcblx0XHRcdHdoZW46IFwiYmVmb3JlLmluc2VydFwiXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MpLT5cblx0XHRcdFx0aWYgaXNSZXBlYXRlZE5hbWUoZG9jKVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwib2JqZWN05a+56LGh5ZCN56ew5LiN6IO96YeN5aSNI3tkb2MubmFtZX1cIilcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCLlr7nosaHlkI3np7DkuI3og73ph43lpI1cIlxuXHRcdFx0XHRkb2MuY3VzdG9tID0gdHJ1ZVxuXG5cdFx0XCJiZWZvcmUudXBkYXRlLnNlcnZlci5vYmplY3RzXCI6XG5cdFx0XHRvbjogXCJzZXJ2ZXJcIlxuXHRcdFx0d2hlbjogXCJiZWZvcmUudXBkYXRlXCJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpLT5cblx0XHRcdFx0aWYgbW9kaWZpZXI/LiRzZXQ/Lm5hbWUgJiYgZG9jLm5hbWUgIT0gbW9kaWZpZXIuJHNldC5uYW1lXG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgXCLkuI3og73kv67mlLluYW1lXCJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCLkuI3og73kv67mlLnlr7nosaHlkI1cIlxuXHRcdFx0XHRpZiBtb2RpZmllci4kc2V0XG5cdFx0XHRcdFx0bW9kaWZpZXIuJHNldC5jdXN0b20gPSB0cnVlXG5cblx0XHRcdFx0aWYgbW9kaWZpZXIuJHVuc2V0ICYmIG1vZGlmaWVyLiR1bnNldC5jdXN0b21cblx0XHRcdFx0XHRkZWxldGUgbW9kaWZpZXIuJHVuc2V0LmN1c3RvbVxuXG5cblx0XHRcImFmdGVyLmluc2VydC5zZXJ2ZXIub2JqZWN0c1wiOlxuXHRcdFx0b246IFwic2VydmVyXCJcblx0XHRcdHdoZW46IFwiYWZ0ZXIuaW5zZXJ0XCJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxuXHRcdFx0XHQj5paw5aKeb2JqZWN05pe277yM6buY6K6k5paw5bu65LiA5LiqbmFtZeWtl+autVxuXHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfZmllbGRzXCIpLmluc2VydCh7b2JqZWN0OiBkb2MubmFtZSwgb3duZXI6IHVzZXJJZCwgbmFtZTogXCJuYW1lXCIsIHNwYWNlOiBkb2Muc3BhY2UsIHR5cGU6IFwidGV4dFwiLCByZXF1aXJlZDogdHJ1ZSwgaW5kZXg6IHRydWUsIHNlYXJjaGFibGU6IHRydWV9KVxuXHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmluc2VydCh7bmFtZTogXCJhbGxcIiwgc3BhY2U6IGRvYy5zcGFjZSwgb3duZXI6IHVzZXJJZCwgb2JqZWN0X25hbWU6IGRvYy5uYW1lLCBzaGFyZWQ6IHRydWUsIGZpbHRlcl9zY29wZTogXCJzcGFjZVwiLCBjb2x1bW5zOiBbXCJuYW1lXCJdfSlcblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5pbnNlcnQoe25hbWU6IFwicmVjZW50XCIsIHNwYWNlOiBkb2Muc3BhY2UsIG93bmVyOiB1c2VySWQsIG9iamVjdF9uYW1lOiBkb2MubmFtZSwgc2hhcmVkOiB0cnVlLCBmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIiwgY29sdW1uczogW1wibmFtZVwiXX0pXG5cblx0XHRcImJlZm9yZS5yZW1vdmUuc2VydmVyLm9iamVjdHNcIjpcblx0XHRcdG9uOiBcInNlcnZlclwiXG5cdFx0XHR3aGVuOiBcImJlZm9yZS5yZW1vdmVcIlxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jKS0+XG5cblx0XHRcdFx0aWYgZG9jLmFwcF91bmlxdWVfaWQgJiYgZG9jLmFwcF92ZXJzaW9uXG5cdFx0XHRcdFx0cmV0dXJuXG5cblx0XHRcdFx0b2JqZWN0X2NvbGxlY3Rpb25zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGRvYy5uYW1lLCBkb2Muc3BhY2UpXG5cblx0XHRcdFx0ZG9jdW1lbnRzID0gb2JqZWN0X2NvbGxlY3Rpb25zLmZpbmQoe30se2ZpZWxkczoge19pZDogMX19KVxuXG5cdFx0XHRcdGlmIGRvY3VtZW50cy5jb3VudCgpID4gMFxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuWvueixoSgje2RvYy5uYW1lfSnkuK3lt7Lnu4/mnInorrDlvZXvvIzor7flhYjliKDpmaTorrDlvZXlkI7vvIwg5YaN5Yig6Zmk5q2k5a+56LGhXCJcblxuXHRcdFwiYWZ0ZXIucmVtb3ZlLnNlcnZlci5vYmplY3RzXCI6XG5cdFx0XHRvbjogXCJzZXJ2ZXJcIlxuXHRcdFx0d2hlbjogXCJhZnRlci5yZW1vdmVcIlxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jKS0+XG5cdFx0XHRcdCPliKDpmaRvYmplY3Qg5ZCO77yM6Ieq5Yqo5Yig6ZmkZmllbGRz44CBYWN0aW9uc+OAgXRyaWdnZXJz44CBcGVybWlzc2lvbl9vYmplY3RzXG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9maWVsZHNcIikuZGlyZWN0LnJlbW92ZSh7b2JqZWN0OiBkb2MubmFtZSwgc3BhY2U6IGRvYy5zcGFjZX0pXG5cblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2FjdGlvbnNcIikuZGlyZWN0LnJlbW92ZSh7b2JqZWN0OiBkb2MubmFtZSwgc3BhY2U6IGRvYy5zcGFjZX0pXG5cblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3RyaWdnZXJzXCIpLmRpcmVjdC5yZW1vdmUoe29iamVjdDogZG9jLm5hbWUsIHNwYWNlOiBkb2Muc3BhY2V9KVxuXG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5kaXJlY3QucmVtb3ZlKHtvYmplY3RfbmFtZTogZG9jLm5hbWUsIHNwYWNlOiBkb2Muc3BhY2V9KVxuXG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZGlyZWN0LnJlbW92ZSh7b2JqZWN0X25hbWU6IGRvYy5uYW1lLCBzcGFjZTogZG9jLnNwYWNlfSlcblxuXHRcdFx0XHQjZHJvcCBjb2xsZWN0aW9uXG5cdFx0XHRcdGNvbnNvbGUubG9nIFwiZHJvcCBjb2xsZWN0aW9uXCIsIGRvYy5uYW1lXG5cdFx0XHRcdHRyeVxuI1x0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oZG9jLm5hbWUpLl9jb2xsZWN0aW9uLmRyb3BDb2xsZWN0aW9uKClcblx0XHRcdFx0XHRDcmVhdG9yLkNvbGxlY3Rpb25zW1wiY18je2RvYy5zcGFjZX1fI3tkb2MubmFtZX1cIl0uX2NvbGxlY3Rpb24uZHJvcENvbGxlY3Rpb24oKVxuXHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcImNfI3tkb2Muc3BhY2V9XyN7ZG9jLm5hbWV9XCIsIFwiI3tlLnN0YWNrfVwiKVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuWvueixoSgje2RvYy5uYW1lfSnkuI3lrZjlnKjmiJblt7LooqvliKDpmaRcIiIsInZhciBpc1JlcGVhdGVkTmFtZTtcblxuaXNSZXBlYXRlZE5hbWUgPSBmdW5jdGlvbihkb2MpIHtcbiAgdmFyIG90aGVyO1xuICBvdGhlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikuZmluZCh7XG4gICAgX2lkOiB7XG4gICAgICAkbmU6IGRvYy5faWRcbiAgICB9LFxuICAgIHNwYWNlOiBkb2Muc3BhY2UsXG4gICAgbmFtZTogZG9jLm5hbWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgX2lkOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKG90aGVyLmNvdW50KCkgPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5PYmplY3RzLm9iamVjdHMgPSB7XG4gIG5hbWU6IFwib2JqZWN0c1wiLFxuICBpY29uOiBcIm9yZGVyc1wiLFxuICBsYWJlbDogXCLlr7nosaFcIixcbiAgZmllbGRzOiB7XG4gICAgbmFtZToge1xuICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICBzZWFyY2hhYmxlOiB0cnVlLFxuICAgICAgaW5kZXg6IHRydWUsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZVxuICAgIH0sXG4gICAgbGFiZWw6IHtcbiAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICB9LFxuICAgIGljb246IHtcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICBvcHRpb25zRnVuY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3B0aW9ucztcbiAgICAgICAgb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goQ3JlYXRvci5yZXNvdXJjZXMuc2xkc0ljb25zLnN0YW5kYXJkLCBmdW5jdGlvbihzdmcpIHtcbiAgICAgICAgICByZXR1cm4gb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgIHZhbHVlOiBzdmcsXG4gICAgICAgICAgICBsYWJlbDogc3ZnLFxuICAgICAgICAgICAgaWNvbjogc3ZnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICAgIH1cbiAgICB9LFxuICAgIGlzX2VuYWJsZToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0VmFsdWU6IHRydWVcbiAgICB9LFxuICAgIGVuYWJsZV9zZWFyY2g6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfZmlsZXM6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfdGFza3M6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfbm90ZXM6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfZXZlbnRzOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIH0sXG4gICAgZW5hYmxlX2FwaToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0VmFsdWU6IHRydWUsXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LFxuICAgIGVuYWJsZV9zaGFyZToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0VmFsdWU6IGZhbHNlXG4gICAgfSxcbiAgICBlbmFibGVfaW5zdGFuY2VzOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIH0sXG4gICAgZW5hYmxlX2NoYXR0ZXI6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfYXVkaXQ6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfdHJhc2g6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfc3BhY2VfZ2xvYmFsOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHRWYWx1ZTogZmFsc2VcbiAgICB9LFxuICAgIGlzX3ZpZXc6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgICBvbWl0OiB0cnVlXG4gICAgfSxcbiAgICBoaWRkZW46IHtcbiAgICAgIGxhYmVsOiBcIumakOiXj1wiLFxuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBvbWl0OiB0cnVlXG4gICAgfSxcbiAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgbGFiZWw6IFwiRGVzY3JpcHRpb25cIixcbiAgICAgIHR5cGU6IFwidGV4dGFyZWFcIixcbiAgICAgIGlzX3dpZGU6IHRydWVcbiAgICB9LFxuICAgIHNpZGViYXI6IHtcbiAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICBsYWJlbDogXCLlt6bkvqfliJfooahcIixcbiAgICAgIGJsYWNrYm94OiB0cnVlLFxuICAgICAgb21pdDogdHJ1ZSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0sXG4gICAgZmllbGRzOiB7XG4gICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgbGFiZWw6IFwi5a2X5q61XCIsXG4gICAgICBibGFja2JveDogdHJ1ZSxcbiAgICAgIG9taXQ6IHRydWUsXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LFxuICAgIGxpc3Rfdmlld3M6IHtcbiAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICBsYWJlbDogXCLliJfooajop4blm75cIixcbiAgICAgIGJsYWNrYm94OiB0cnVlLFxuICAgICAgb21pdDogdHJ1ZSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0sXG4gICAgYWN0aW9uczoge1xuICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgIGxhYmVsOiBcIuaTjeS9nFwiLFxuICAgICAgYmxhY2tib3g6IHRydWUsXG4gICAgICBvbWl0OiB0cnVlLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSxcbiAgICBwZXJtaXNzaW9uX3NldDoge1xuICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgIGxhYmVsOiBcIuadg+mZkOiuvue9rlwiLFxuICAgICAgYmxhY2tib3g6IHRydWUsXG4gICAgICBvbWl0OiB0cnVlLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSxcbiAgICB0cmlnZ2Vyczoge1xuICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgIGxhYmVsOiBcIuinpuWPkeWZqFwiLFxuICAgICAgYmxhY2tib3g6IHRydWUsXG4gICAgICBvbWl0OiB0cnVlLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSxcbiAgICBjdXN0b206IHtcbiAgICAgIGxhYmVsOiBcIuinhOWImVwiLFxuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBvbWl0OiB0cnVlXG4gICAgfSxcbiAgICBvd25lcjoge1xuICAgICAgdHlwZTogXCJsb29rdXBcIixcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0sXG4gICAgYXBwX3VuaXF1ZV9pZDoge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSxcbiAgICBhcHBfdmVyc2lvbjoge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfVxuICB9LFxuICBsaXN0X3ZpZXdzOiB7XG4gICAgYWxsOiB7XG4gICAgICBjb2x1bW5zOiBbXCJuYW1lXCIsIFwibGFiZWxcIiwgXCJpc19lbmFibGVcIiwgXCJtb2RpZmllZFwiXSxcbiAgICAgIGxhYmVsOiBcIuWFqOmDqFwiLFxuICAgICAgZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcbiAgICB9XG4gIH0sXG4gIHBlcm1pc3Npb25fc2V0OiB7XG4gICAgdXNlcjoge1xuICAgICAgYWxsb3dDcmVhdGU6IGZhbHNlLFxuICAgICAgYWxsb3dEZWxldGU6IGZhbHNlLFxuICAgICAgYWxsb3dFZGl0OiBmYWxzZSxcbiAgICAgIGFsbG93UmVhZDogZmFsc2UsXG4gICAgICBtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZSxcbiAgICAgIHZpZXdBbGxSZWNvcmRzOiBmYWxzZVxuICAgIH0sXG4gICAgYWRtaW46IHtcbiAgICAgIGFsbG93Q3JlYXRlOiB0cnVlLFxuICAgICAgYWxsb3dEZWxldGU6IHRydWUsXG4gICAgICBhbGxvd0VkaXQ6IHRydWUsXG4gICAgICBhbGxvd1JlYWQ6IHRydWUsXG4gICAgICBtb2RpZnlBbGxSZWNvcmRzOiB0cnVlLFxuICAgICAgdmlld0FsbFJlY29yZHM6IHRydWVcbiAgICB9XG4gIH0sXG4gIGFjdGlvbnM6IHtcbiAgICBjb3B5X29kYXRhOiB7XG4gICAgICBsYWJlbDogXCLlpI3liLZPRGF0Yee9keWdgFwiLFxuICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgIG9uOiBcInJlY29yZFwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgaXRlbV9lbGVtZW50KSB7XG4gICAgICAgIHZhciBjbGlwYm9hcmQsIG9fbmFtZSwgcGF0aCwgcmVjb3JkO1xuICAgICAgICByZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdEJ5SWQocmVjb3JkX2lkKTtcbiAgICAgICAgaWYgKChyZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5lbmFibGVfYXBpIDogdm9pZCAwKSB8fCB0cnVlKSB7XG4gICAgICAgICAgb19uYW1lID0gcmVjb3JkICE9IG51bGwgPyByZWNvcmQubmFtZSA6IHZvaWQgMDtcbiAgICAgICAgICBwYXRoID0gU3RlZWRvc09EYXRhLmdldE9EYXRhUGF0aChTZXNzaW9uLmdldChcInNwYWNlSWRcIiksIG9fbmFtZSk7XG4gICAgICAgICAgaXRlbV9lbGVtZW50LmF0dHIoJ2RhdGEtY2xpcGJvYXJkLXRleHQnLCBwYXRoKTtcbiAgICAgICAgICBpZiAoIWl0ZW1fZWxlbWVudC5hdHRyKCdkYXRhLWNsaXBib2FyZC1uZXcnKSkge1xuICAgICAgICAgICAgY2xpcGJvYXJkID0gbmV3IENsaXBib2FyZChpdGVtX2VsZW1lbnRbMF0pO1xuICAgICAgICAgICAgaXRlbV9lbGVtZW50LmF0dHIoJ2RhdGEtY2xpcGJvYXJkLW5ldycsIHRydWUpO1xuICAgICAgICAgICAgY2xpcGJvYXJkLm9uKCdzdWNjZXNzJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICByZXR1cm4gdG9hc3RyLnN1Y2Nlc3MoJ+WkjeWItuaIkOWKnycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjbGlwYm9hcmQub24oJ2Vycm9yJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ+WkjeWItuWksei0pScpO1xuICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImVcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChpdGVtX2VsZW1lbnRbMF0udGFnTmFtZSA9PT0gJ0xJJyB8fCBpdGVtX2VsZW1lbnQuaGFzQ2xhc3MoJ3ZpZXctYWN0aW9uJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1fZWxlbWVudC50cmlnZ2VyKFwiY2xpY2tcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0b2FzdHIuZXJyb3IoJ+WkjeWItuWksei0pTog5pyq5ZCv55SoQVBJJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHRyaWdnZXJzOiB7XG4gICAgXCJiZWZvcmUuaW5zZXJ0LnNlcnZlci5vYmplY3RzXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJiZWZvcmUuaW5zZXJ0XCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICBpZiAoaXNSZXBlYXRlZE5hbWUoZG9jKSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwib2JqZWN05a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCIgKyBkb2MubmFtZSk7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkb2MuY3VzdG9tID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYmVmb3JlLnVwZGF0ZS5zZXJ2ZXIub2JqZWN0c1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYmVmb3JlLnVwZGF0ZVwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciByZWY7XG4gICAgICAgIGlmICgobW9kaWZpZXIgIT0gbnVsbCA/IChyZWYgPSBtb2RpZmllci4kc2V0KSAhPSBudWxsID8gcmVmLm5hbWUgOiB2b2lkIDAgOiB2b2lkIDApICYmIGRvYy5uYW1lICE9PSBtb2RpZmllci4kc2V0Lm5hbWUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIuS4jeiDveS/ruaUuW5hbWVcIik7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5LiN6IO95L+u5pS55a+56LGh5ZCNXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtb2RpZmllci4kc2V0KSB7XG4gICAgICAgICAgbW9kaWZpZXIuJHNldC5jdXN0b20gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtb2RpZmllci4kdW5zZXQgJiYgbW9kaWZpZXIuJHVuc2V0LmN1c3RvbSkge1xuICAgICAgICAgIHJldHVybiBkZWxldGUgbW9kaWZpZXIuJHVuc2V0LmN1c3RvbTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJhZnRlci5pbnNlcnQuc2VydmVyLm9iamVjdHNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImFmdGVyLmluc2VydFwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS5pbnNlcnQoe1xuICAgICAgICAgIG9iamVjdDogZG9jLm5hbWUsXG4gICAgICAgICAgb3duZXI6IHVzZXJJZCxcbiAgICAgICAgICBuYW1lOiBcIm5hbWVcIixcbiAgICAgICAgICBzcGFjZTogZG9jLnNwYWNlLFxuICAgICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIGluZGV4OiB0cnVlLFxuICAgICAgICAgIHNlYXJjaGFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuaW5zZXJ0KHtcbiAgICAgICAgICBuYW1lOiBcImFsbFwiLFxuICAgICAgICAgIHNwYWNlOiBkb2Muc3BhY2UsXG4gICAgICAgICAgb3duZXI6IHVzZXJJZCxcbiAgICAgICAgICBvYmplY3RfbmFtZTogZG9jLm5hbWUsXG4gICAgICAgICAgc2hhcmVkOiB0cnVlLFxuICAgICAgICAgIGZpbHRlcl9zY29wZTogXCJzcGFjZVwiLFxuICAgICAgICAgIGNvbHVtbnM6IFtcIm5hbWVcIl1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmluc2VydCh7XG4gICAgICAgICAgbmFtZTogXCJyZWNlbnRcIixcbiAgICAgICAgICBzcGFjZTogZG9jLnNwYWNlLFxuICAgICAgICAgIG93bmVyOiB1c2VySWQsXG4gICAgICAgICAgb2JqZWN0X25hbWU6IGRvYy5uYW1lLFxuICAgICAgICAgIHNoYXJlZDogdHJ1ZSxcbiAgICAgICAgICBmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIixcbiAgICAgICAgICBjb2x1bW5zOiBbXCJuYW1lXCJdXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJiZWZvcmUucmVtb3ZlLnNlcnZlci5vYmplY3RzXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJiZWZvcmUucmVtb3ZlXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICB2YXIgZG9jdW1lbnRzLCBvYmplY3RfY29sbGVjdGlvbnM7XG4gICAgICAgIGlmIChkb2MuYXBwX3VuaXF1ZV9pZCAmJiBkb2MuYXBwX3ZlcnNpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgb2JqZWN0X2NvbGxlY3Rpb25zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGRvYy5uYW1lLCBkb2Muc3BhY2UpO1xuICAgICAgICBkb2N1bWVudHMgPSBvYmplY3RfY29sbGVjdGlvbnMuZmluZCh7fSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGRvY3VtZW50cy5jb3VudCgpID4gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuWvueixoShcIiArIGRvYy5uYW1lICsgXCIp5Lit5bey57uP5pyJ6K6w5b2V77yM6K+35YWI5Yig6Zmk6K6w5b2V5ZCO77yMIOWGjeWIoOmZpOatpOWvueixoVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJhZnRlci5yZW1vdmUuc2VydmVyLm9iamVjdHNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImFmdGVyLnJlbW92ZVwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgdmFyIGU7XG4gICAgICAgIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9maWVsZHNcIikuZGlyZWN0LnJlbW92ZSh7XG4gICAgICAgICAgb2JqZWN0OiBkb2MubmFtZSxcbiAgICAgICAgICBzcGFjZTogZG9jLnNwYWNlXG4gICAgICAgIH0pO1xuICAgICAgICBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfYWN0aW9uc1wiKS5kaXJlY3QucmVtb3ZlKHtcbiAgICAgICAgICBvYmplY3Q6IGRvYy5uYW1lLFxuICAgICAgICAgIHNwYWNlOiBkb2Muc3BhY2VcbiAgICAgICAgfSk7XG4gICAgICAgIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF90cmlnZ2Vyc1wiKS5kaXJlY3QucmVtb3ZlKHtcbiAgICAgICAgICBvYmplY3Q6IGRvYy5uYW1lLFxuICAgICAgICAgIHNwYWNlOiBkb2Muc3BhY2VcbiAgICAgICAgfSk7XG4gICAgICAgIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5kaXJlY3QucmVtb3ZlKHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogZG9jLm5hbWUsXG4gICAgICAgICAgc3BhY2U6IGRvYy5zcGFjZVxuICAgICAgICB9KTtcbiAgICAgICAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5kaXJlY3QucmVtb3ZlKHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogZG9jLm5hbWUsXG4gICAgICAgICAgc3BhY2U6IGRvYy5zcGFjZVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJkcm9wIGNvbGxlY3Rpb25cIiwgZG9jLm5hbWUpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiY19cIiArIGRvYy5zcGFjZSArIFwiX1wiICsgZG9jLm5hbWVdLl9jb2xsZWN0aW9uLmRyb3BDb2xsZWN0aW9uKCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjX1wiICsgZG9jLnNwYWNlICsgXCJfXCIgKyBkb2MubmFtZSwgXCJcIiArIGUuc3RhY2spO1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuWvueixoShcIiArIGRvYy5uYW1lICsgXCIp5LiN5a2Y5Zyo5oiW5bey6KKr5Yig6ZmkXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIiwiX3N5bmNUb09iamVjdCA9IChkb2MpIC0+XG5cdG9iamVjdF9maWVsZHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfZmllbGRzXCIpLmZpbmQoe3NwYWNlOiBkb2Muc3BhY2UsIG9iamVjdDogZG9jLm9iamVjdH0sIHtcblx0XHRmaWVsZHM6IHtcblx0XHRcdGNyZWF0ZWQ6IDAsXG5cdFx0XHRtb2RpZmllZDogMCxcblx0XHRcdG93bmVyOiAwLFxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcblx0XHRcdG1vZGlmaWVkX2J5OiAwXG5cdFx0fVxuXHR9KS5mZXRjaCgpXG5cblx0ZmllbGRzID0ge31cblxuXHR0YWJsZV9maWVsZHMgPSB7fVxuXG5cdF8uZm9yRWFjaCBvYmplY3RfZmllbGRzLCAoZiktPlxuXHRcdGlmIC9eW2EtekEtWl9dXFx3KihcXC5cXCRcXC5cXHcrKXsxfVthLXpBLVowLTldKiQvLnRlc3QoZi5uYW1lKVxuXHRcdFx0Y2ZfYXJyID0gZi5uYW1lLnNwbGl0KFwiLiQuXCIpXG5cdFx0XHRjaGlsZF9maWVsZHMgPSB7fVxuXHRcdFx0Y2hpbGRfZmllbGRzW2NmX2FyclsxXV0gPSBmXG5cdFx0XHRpZiAhXy5zaXplKHRhYmxlX2ZpZWxkc1tjZl9hcnJbMF1dKVxuXHRcdFx0XHR0YWJsZV9maWVsZHNbY2ZfYXJyWzBdXSA9IHt9XG5cdFx0XHRfLmV4dGVuZCh0YWJsZV9maWVsZHNbY2ZfYXJyWzBdXSwgY2hpbGRfZmllbGRzKVxuXHRcdGVsc2Vcblx0XHRcdGZpZWxkc1tmLm5hbWVdID0gZlxuXG5cdF8uZWFjaCB0YWJsZV9maWVsZHMsIChmLCBrKS0+XG5cdFx0aWYgZmllbGRzW2tdLnR5cGUgPT0gXCJncmlkXCJcblx0XHRcdGlmICFfLnNpemUoZmllbGRzW2tdLmZpZWxkcylcblx0XHRcdFx0ZmllbGRzW2tdLmZpZWxkcyA9IHt9XG5cdFx0XHRfLmV4dGVuZChmaWVsZHNba10uZmllbGRzLCBmKVxuXG5cdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikudXBkYXRlKHtzcGFjZTogZG9jLnNwYWNlLCBuYW1lOiBkb2Mub2JqZWN0fSwge1xuXHRcdCRzZXQ6XG5cdFx0XHRmaWVsZHM6IGZpZWxkc1xuXHR9KVxuXG5pc1JlcGVhdGVkTmFtZSA9IChkb2MsIG5hbWUpLT5cblx0b3RoZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfZmllbGRzXCIpLmZpbmQoe29iamVjdDogZG9jLm9iamVjdCwgIHNwYWNlOiBkb2Muc3BhY2UsIF9pZDogeyRuZTogZG9jLl9pZH0sIG5hbWU6IG5hbWUgfHwgZG9jLm5hbWV9LCB7ZmllbGRzOntfaWQ6IDF9fSlcblx0aWYgb3RoZXIuY291bnQoKSA+IDBcblx0XHRyZXR1cm4gdHJ1ZVxuXHRyZXR1cm4gZmFsc2VcblxuQ3JlYXRvci5PYmplY3RzLm9iamVjdF9maWVsZHMgPVxuXHRuYW1lOiBcIm9iamVjdF9maWVsZHNcIlxuXHRpY29uOiBcIm9yZGVyc1wiXG5cdGVuYWJsZV9hcGk6IHRydWVcblx0bGFiZWw6XCLlrZfmrrVcIlxuXHRmaWVsZHM6XG5cdFx0bmFtZTpcblx0XHRcdHR5cGU6IFwidGV4dFwiXG5cdFx0XHRzZWFyY2hhYmxlOiB0cnVlXG5cdFx0XHRpbmRleDogdHJ1ZVxuXHRcdFx0cmVxdWlyZWQ6IHRydWVcblx0XHRcdHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguZmllbGRcblx0XHRsYWJlbDpcblx0XHRcdHR5cGU6IFwidGV4dFwiXG5cdFx0aXNfbmFtZTpcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cdFx0XHRoaWRkZW46IHRydWVcblx0XHRvYmplY3Q6XG5cdFx0XHR0eXBlOiBcIm1hc3Rlcl9kZXRhaWxcIlxuXHRcdFx0cmVmZXJlbmNlX3RvOiBcIm9iamVjdHNcIlxuXHRcdFx0cmVxdWlyZWQ6IHRydWVcblx0XHRcdG9wdGlvbnNGdW5jdGlvbjogKCktPlxuXHRcdFx0XHRfb3B0aW9ucyA9IFtdXG5cdFx0XHRcdF8uZm9yRWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvLCBrKS0+XG5cdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IG8ubGFiZWwsIHZhbHVlOiBrLCBpY29uOiBvLmljb259XG5cdFx0XHRcdHJldHVybiBfb3B0aW9uc1xuXHRcdHR5cGU6XG5cdFx0XHR0eXBlOiBcInNlbGVjdFwiXG4jXHRcdFx0cmVxdWlyZWQ6IHRydWVcblx0XHRcdG9wdGlvbnM6XG5cdFx0XHRcdHRleHQ6IFwi5paH5pysXCIsXG5cdFx0XHRcdHRleHRhcmVhOiBcIumVv+aWh+acrFwiXG5cdFx0XHRcdGh0bWw6IFwiSHRtbOaWh+acrFwiLFxuXHRcdFx0XHRzZWxlY3Q6IFwi6YCJ5oup5qGGXCIsXG5cdFx0XHRcdGJvb2xlYW46IFwiQ2hlY2tib3hcIlxuXHRcdFx0XHRkYXRlOiBcIuaXpeacn1wiXG5cdFx0XHRcdGRhdGV0aW1lOiBcIuaXpeacn+aXtumXtFwiXG5cdFx0XHRcdG51bWJlcjogXCLmlbDlgLxcIlxuXHRcdFx0XHRjdXJyZW5jeTogXCLph5Hpop1cIlxuXHRcdFx0XHRwYXNzd29yZDogXCLlr4bnoIFcIlxuXHRcdFx0XHRsb29rdXA6IFwi55u45YWz6KGoXCJcblx0XHRcdFx0bWFzdGVyX2RldGFpbDogXCLkuLvooagv5a2Q6KGoXCJcblx0XHRcdFx0Z3JpZDogXCLooajmoLxcIlxuXHRcdFx0XHR1cmw6IFwi572R5Z2AXCJcblx0XHRcdFx0ZW1haWw6IFwi6YKu5Lu25Zyw5Z2AXCJcblx0XHRzb3J0X25vOlxuXHRcdFx0bGFiZWw6IFwi5o6S5bqP5Y+3XCJcblx0XHRcdHR5cGU6IFwibnVtYmVyXCJcblx0XHRcdGRlZmF1bHRWYWx1ZTogMTAwXG5cdFx0XHRzY2FsZTogMFxuXHRcdFx0c29ydGFibGU6IHRydWVcblxuXHRcdGdyb3VwOlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblxuXHRcdGRlZmF1bHRWYWx1ZTpcblx0XHRcdHR5cGU6IFwidGV4dFwiXG5cblx0XHRhbGxvd2VkVmFsdWVzOlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblx0XHRcdG11bHRpcGxlOiB0cnVlXG5cblx0XHRtdWx0aXBsZTpcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cblx0XHRyZXF1aXJlZDpcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cblx0XHRpc193aWRlOlxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcblxuXHRcdHJlYWRvbmx5OlxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcblxuI1x0XHRkaXNhYmxlZDpcbiNcdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxuXHRcdGhpZGRlbjpcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cdFx0I1RPRE8g5bCG5q2k5Yqf6IO95byA5pS+57uZ55So5oi35pe277yM6ZyA6KaB5YWz6Zet5q2k5bGe5oCnXG5cdFx0b21pdDpcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cblx0XHRpbmRleDpcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cblx0XHRzZWFyY2hhYmxlOlxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcblxuXHRcdHNvcnRhYmxlOlxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcblxuXHRcdHByZWNpc2lvbjpcblx0XHRcdHR5cGU6IFwiY3VycmVuY3lcIlxuXHRcdFx0ZGVmYXVsdFZhbHVlOiAxOFxuXG5cdFx0c2NhbGU6XG5cdFx0XHR0eXBlOiBcImN1cnJlbmN5XCJcblx0XHRcdGRlZmF1bHRWYWx1ZTogMlxuXG5cdFx0cmVmZXJlbmNlX3RvOiAj5Zyo5pyN5Yqh56uv5aSE55CG5q2k5a2X5q615YC877yM5aaC5p6c5bCP5LqOMuS4qu+8jOWImeWtmOWCqOS4uuWtl+espuS4su+8jOWQpuWImeWtmOWCqOS4uuaVsOe7hFxuXHRcdFx0dHlwZTogXCJsb29rdXBcIlxuXHRcdFx0b3B0aW9uc0Z1bmN0aW9uOiAoKS0+XG5cdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0Xy5mb3JFYWNoIENyZWF0b3IuT2JqZWN0cywgKG8sIGspLT5cblx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogby5sYWJlbCwgdmFsdWU6IGssIGljb246IG8uaWNvbn1cblx0XHRcdFx0cmV0dXJuIF9vcHRpb25zXG4jXHRcdFx0bXVsdGlwbGU6IHRydWUgI+WFiOS/ruaUueS4uuWNlemAiVxuXG5cdFx0cm93czpcblx0XHRcdHR5cGU6IFwiY3VycmVuY3lcIlxuXG5cdFx0b3B0aW9uczpcblx0XHRcdHR5cGU6IFwidGV4dGFyZWFcIlxuXHRcdFx0aXNfd2lkZTogdHJ1ZVxuXG5cdFx0ZGVzY3JpcHRpb246XG5cdFx0XHRsYWJlbDogXCJEZXNjcmlwdGlvblwiXG5cdFx0XHR0eXBlOiBcInRleHRcIlxuXHRcdFx0aXNfd2lkZTogdHJ1ZVxuXG5cdGxpc3Rfdmlld3M6XG5cdFx0YWxsOlxuXHRcdFx0Y29sdW1uczogW1wibmFtZVwiLCBcImxhYmVsXCIsIFwidHlwZVwiLCBcIm9iamVjdFwiLCBcInNvcnRfbm9cIiwgXCJtb2RpZmllZFwiXVxuXHRcdFx0c29ydDogW3tmaWVsZF9uYW1lOiBcInNvcnRfbm9cIiwgb3JkZXI6IFwiYXNjXCJ9XVxuXHRcdFx0ZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcblxuXHRwZXJtaXNzaW9uX3NldDpcblx0XHR1c2VyOlxuXHRcdFx0YWxsb3dDcmVhdGU6IGZhbHNlXG5cdFx0XHRhbGxvd0RlbGV0ZTogZmFsc2Vcblx0XHRcdGFsbG93RWRpdDogZmFsc2Vcblx0XHRcdGFsbG93UmVhZDogZmFsc2Vcblx0XHRcdG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlXG5cdFx0XHR2aWV3QWxsUmVjb3JkczogZmFsc2Vcblx0XHRhZG1pbjpcblx0XHRcdGFsbG93Q3JlYXRlOiB0cnVlXG5cdFx0XHRhbGxvd0RlbGV0ZTogdHJ1ZVxuXHRcdFx0YWxsb3dFZGl0OiB0cnVlXG5cdFx0XHRhbGxvd1JlYWQ6IHRydWVcblx0XHRcdG1vZGlmeUFsbFJlY29yZHM6IHRydWVcblx0XHRcdHZpZXdBbGxSZWNvcmRzOiB0cnVlXG5cblx0dHJpZ2dlcnM6XHRcdFx0XHRcblx0XHRcImFmdGVyLmluc2VydC5zZXJ2ZXIub2JqZWN0X2ZpZWxkc1wiOlxuXHRcdFx0b246IFwic2VydmVyXCJcblx0XHRcdHdoZW46IFwiYWZ0ZXIuaW5zZXJ0XCJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxuXHRcdFx0XHRfc3luY1RvT2JqZWN0KGRvYylcblx0XHRcImFmdGVyLnVwZGF0ZS5zZXJ2ZXIub2JqZWN0X2ZpZWxkc1wiOlxuXHRcdFx0b246IFwic2VydmVyXCJcblx0XHRcdHdoZW46IFwiYWZ0ZXIudXBkYXRlXCJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxuXHRcdFx0XHRfc3luY1RvT2JqZWN0KGRvYylcblx0XHRcImFmdGVyLnJlbW92ZS5zZXJ2ZXIub2JqZWN0X2ZpZWxkc1wiOlxuXHRcdFx0b246IFwic2VydmVyXCJcblx0XHRcdHdoZW46IFwiYWZ0ZXIucmVtb3ZlXCJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxuXHRcdFx0XHRfc3luY1RvT2JqZWN0KGRvYylcblx0XHRcImJlZm9yZS51cGRhdGUuc2VydmVyLm9iamVjdF9maWVsZHNcIjpcblx0XHRcdG9uOiBcInNlcnZlclwiXG5cdFx0XHR3aGVuOiBcImJlZm9yZS51cGRhdGVcIlxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyktPlxuXHRcdFx0XHRpZiBkb2MubmFtZSA9PSAnbmFtZScgJiYgbW9kaWZpZXI/LiRzZXQ/Lm5hbWUgJiYgZG9jLm5hbWUgIT0gbW9kaWZpZXIuJHNldC5uYW1lXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5LiN6IO95L+u5pS55q2k57qq5b2V55qEbmFtZeWxnuaAp1wiXG5cdFx0XHRcdGlmIG1vZGlmaWVyPy4kc2V0Py5uYW1lICYmIGlzUmVwZWF0ZWROYW1lKGRvYywgbW9kaWZpZXIuJHNldC5uYW1lKVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwidXBkYXRlIGZpZWxkc+WvueixoeWQjeensOS4jeiDvemHjeWkjSN7ZG9jLm5hbWV9XCIpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCJcblxuXHRcdFx0XHRpZiBtb2RpZmllcj8uJHNldD8ucmVmZXJlbmNlX3RvXG5cdFx0XHRcdFx0aWYgbW9kaWZpZXIuJHNldC5yZWZlcmVuY2VfdG8ubGVuZ3RoID09IDFcblx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBtb2RpZmllci4kc2V0LnJlZmVyZW5jZV90b1swXVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBtb2RpZmllci4kc2V0LnJlZmVyZW5jZV90b1xuXHRcdFx0XHRpZiBtb2RpZmllcj8uJHNldD8uaW5kZXggYW5kIChtb2RpZmllcj8uJHNldD8udHlwZSA9PSAndGV4dGFyZWEnIG9yIG1vZGlmaWVyPy4kc2V0Py50eXBlID09ICdodG1sJylcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCLlpJrooYzmlofmnKzkuI3mlK/mjIHlu7rnq4vntKLlvJVcIlxuXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLmZpbmRPbmUoe19pZDogZG9jLm9iamVjdH0sIHtmaWVsZHM6IHtuYW1lOiAxLCBsYWJlbDogMX19KVxuXG5cdFx0XHRcdGlmIG9iamVjdFxuXG5cdFx0XHRcdFx0b2JqZWN0X2RvY3VtZW50cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3QubmFtZSkuZmluZCgpXG5cdFx0XHRcdFx0aWYgbW9kaWZpZXI/LiRzZXQ/LnJlZmVyZW5jZV90byAmJiBkb2MucmVmZXJlbmNlX3RvICE9IF9yZWZlcmVuY2VfdG8gJiYgb2JqZWN0X2RvY3VtZW50cy5jb3VudCgpID4gMFxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5a+56LGhI3tvYmplY3QubGFiZWx95Lit5bey57uP5pyJ6K6w5b2V77yM5LiN6IO95L+u5pS5cmVmZXJlbmNlX3Rv5a2X5q61XCJcblxuXHRcdFx0XHRcdGlmIG1vZGlmaWVyPy4kdW5zZXQ/LnJlZmVyZW5jZV90byAmJiBkb2MucmVmZXJlbmNlX3RvICE9IF9yZWZlcmVuY2VfdG8gJiYgb2JqZWN0X2RvY3VtZW50cy5jb3VudCgpID4gMFxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5a+56LGhI3tvYmplY3QubGFiZWx95Lit5bey57uP5pyJ6K6w5b2V77yM5LiN6IO95L+u5pS5cmVmZXJlbmNlX3Rv5a2X5q61XCJcbiNcdFx0XHRcdFx0aWYgbW9kaWZpZXI/LiRzZXQ/LnJlZmVyZW5jZV90b1xuI1x0XHRcdFx0XHRcdGlmIG1vZGlmaWVyLiRzZXQucmVmZXJlbmNlX3RvLmxlbmd0aCA9PSAxXG4jXHRcdFx0XHRcdFx0XHRtb2RpZmllci4kc2V0LnJlZmVyZW5jZV90byA9IG1vZGlmaWVyLiRzZXQucmVmZXJlbmNlX3RvWzBdXG5cblx0XHRcImJlZm9yZS5pbnNlcnQuc2VydmVyLm9iamVjdF9maWVsZHNcIjpcblx0XHRcdG9uOiBcInNlcnZlclwiXG5cdFx0XHR3aGVuOiBcImJlZm9yZS5pbnNlcnRcIlxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jKS0+XG5cbiNcdFx0XHRcdGlmIGRvYy5yZWZlcmVuY2VfdG8/Lmxlbmd0aCA9PSAxXG4jXHRcdFx0XHRcdGRvYy5yZWZlcmVuY2VfdG8gPSBkb2MucmVmZXJlbmNlX3RvWzBdXG5cblx0XHRcdFx0aWYgaXNSZXBlYXRlZE5hbWUoZG9jKVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiaW5zZXJ0IGZpZWxkc+WvueixoeWQjeensOS4jeiDvemHjeWkjSN7ZG9jLm5hbWV9XCIpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCJcblx0XHRcdFx0aWYgZG9jPy5pbmRleCBhbmQgKGRvYz8udHlwZSA9PSAndGV4dGFyZWEnIG9yIGRvYz8udHlwZSA9PSAnaHRtbCcpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsJ+WkmuihjOaWh+acrOS4jeaUr+aMgeW7uueri+e0ouW8lSdcblx0XHRcImJlZm9yZS5yZW1vdmUuc2VydmVyLm9iamVjdF9maWVsZHNcIjpcblx0XHRcdG9uOiBcInNlcnZlclwiXG5cdFx0XHR3aGVuOiBcImJlZm9yZS5yZW1vdmVcIlxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jKS0+XG5cdFx0XHRcdGlmIGRvYy5uYW1lID09IFwibmFtZVwiXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5LiN6IO95Yig6Zmk5q2k57qq5b2VXCJcblxuXG4iLCJ2YXIgX3N5bmNUb09iamVjdCwgaXNSZXBlYXRlZE5hbWU7XG5cbl9zeW5jVG9PYmplY3QgPSBmdW5jdGlvbihkb2MpIHtcbiAgdmFyIGZpZWxkcywgb2JqZWN0X2ZpZWxkcywgdGFibGVfZmllbGRzO1xuICBvYmplY3RfZmllbGRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS5maW5kKHtcbiAgICBzcGFjZTogZG9jLnNwYWNlLFxuICAgIG9iamVjdDogZG9jLm9iamVjdFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBvd25lcjogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkuZmV0Y2goKTtcbiAgZmllbGRzID0ge307XG4gIHRhYmxlX2ZpZWxkcyA9IHt9O1xuICBfLmZvckVhY2gob2JqZWN0X2ZpZWxkcywgZnVuY3Rpb24oZikge1xuICAgIHZhciBjZl9hcnIsIGNoaWxkX2ZpZWxkcztcbiAgICBpZiAoL15bYS16QS1aX11cXHcqKFxcLlxcJFxcLlxcdyspezF9W2EtekEtWjAtOV0qJC8udGVzdChmLm5hbWUpKSB7XG4gICAgICBjZl9hcnIgPSBmLm5hbWUuc3BsaXQoXCIuJC5cIik7XG4gICAgICBjaGlsZF9maWVsZHMgPSB7fTtcbiAgICAgIGNoaWxkX2ZpZWxkc1tjZl9hcnJbMV1dID0gZjtcbiAgICAgIGlmICghXy5zaXplKHRhYmxlX2ZpZWxkc1tjZl9hcnJbMF1dKSkge1xuICAgICAgICB0YWJsZV9maWVsZHNbY2ZfYXJyWzBdXSA9IHt9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHRhYmxlX2ZpZWxkc1tjZl9hcnJbMF1dLCBjaGlsZF9maWVsZHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmllbGRzW2YubmFtZV0gPSBmO1xuICAgIH1cbiAgfSk7XG4gIF8uZWFjaCh0YWJsZV9maWVsZHMsIGZ1bmN0aW9uKGYsIGspIHtcbiAgICBpZiAoZmllbGRzW2tdLnR5cGUgPT09IFwiZ3JpZFwiKSB7XG4gICAgICBpZiAoIV8uc2l6ZShmaWVsZHNba10uZmllbGRzKSkge1xuICAgICAgICBmaWVsZHNba10uZmllbGRzID0ge307XG4gICAgICB9XG4gICAgICByZXR1cm4gXy5leHRlbmQoZmllbGRzW2tdLmZpZWxkcywgZik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikudXBkYXRlKHtcbiAgICBzcGFjZTogZG9jLnNwYWNlLFxuICAgIG5hbWU6IGRvYy5vYmplY3RcbiAgfSwge1xuICAgICRzZXQ6IHtcbiAgICAgIGZpZWxkczogZmllbGRzXG4gICAgfVxuICB9KTtcbn07XG5cbmlzUmVwZWF0ZWROYW1lID0gZnVuY3Rpb24oZG9jLCBuYW1lKSB7XG4gIHZhciBvdGhlcjtcbiAgb3RoZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfZmllbGRzXCIpLmZpbmQoe1xuICAgIG9iamVjdDogZG9jLm9iamVjdCxcbiAgICBzcGFjZTogZG9jLnNwYWNlLFxuICAgIF9pZDoge1xuICAgICAgJG5lOiBkb2MuX2lkXG4gICAgfSxcbiAgICBuYW1lOiBuYW1lIHx8IGRvYy5uYW1lXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIF9pZDogMVxuICAgIH1cbiAgfSk7XG4gIGlmIChvdGhlci5jb3VudCgpID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkNyZWF0b3IuT2JqZWN0cy5vYmplY3RfZmllbGRzID0ge1xuICBuYW1lOiBcIm9iamVjdF9maWVsZHNcIixcbiAgaWNvbjogXCJvcmRlcnNcIixcbiAgZW5hYmxlX2FwaTogdHJ1ZSxcbiAgbGFiZWw6IFwi5a2X5q61XCIsXG4gIGZpZWxkczoge1xuICAgIG5hbWU6IHtcbiAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgc2VhcmNoYWJsZTogdHJ1ZSxcbiAgICAgIGluZGV4OiB0cnVlLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkXG4gICAgfSxcbiAgICBsYWJlbDoge1xuICAgICAgdHlwZTogXCJ0ZXh0XCJcbiAgICB9LFxuICAgIGlzX25hbWU6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSxcbiAgICBvYmplY3Q6IHtcbiAgICAgIHR5cGU6IFwibWFzdGVyX2RldGFpbFwiLFxuICAgICAgcmVmZXJlbmNlX3RvOiBcIm9iamVjdHNcIixcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgb3B0aW9uc0Z1bmN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9vcHRpb25zO1xuICAgICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goQ3JlYXRvci5vYmplY3RzQnlOYW1lLCBmdW5jdGlvbihvLCBrKSB7XG4gICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgbGFiZWw6IG8ubGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogayxcbiAgICAgICAgICAgIGljb246IG8uaWNvblxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zO1xuICAgICAgfVxuICAgIH0sXG4gICAgdHlwZToge1xuICAgICAgdHlwZTogXCJzZWxlY3RcIixcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgdGV4dDogXCLmlofmnKxcIixcbiAgICAgICAgdGV4dGFyZWE6IFwi6ZW/5paH5pysXCIsXG4gICAgICAgIGh0bWw6IFwiSHRtbOaWh+acrFwiLFxuICAgICAgICBzZWxlY3Q6IFwi6YCJ5oup5qGGXCIsXG4gICAgICAgIGJvb2xlYW46IFwiQ2hlY2tib3hcIixcbiAgICAgICAgZGF0ZTogXCLml6XmnJ9cIixcbiAgICAgICAgZGF0ZXRpbWU6IFwi5pel5pyf5pe26Ze0XCIsXG4gICAgICAgIG51bWJlcjogXCLmlbDlgLxcIixcbiAgICAgICAgY3VycmVuY3k6IFwi6YeR6aKdXCIsXG4gICAgICAgIHBhc3N3b3JkOiBcIuWvhueggVwiLFxuICAgICAgICBsb29rdXA6IFwi55u45YWz6KGoXCIsXG4gICAgICAgIG1hc3Rlcl9kZXRhaWw6IFwi5Li76KGoL+WtkOihqFwiLFxuICAgICAgICBncmlkOiBcIuihqOagvFwiLFxuICAgICAgICB1cmw6IFwi572R5Z2AXCIsXG4gICAgICAgIGVtYWlsOiBcIumCruS7tuWcsOWdgFwiXG4gICAgICB9XG4gICAgfSxcbiAgICBzb3J0X25vOiB7XG4gICAgICBsYWJlbDogXCLmjpLluo/lj7dcIixcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0VmFsdWU6IDEwMCxcbiAgICAgIHNjYWxlOiAwLFxuICAgICAgc29ydGFibGU6IHRydWVcbiAgICB9LFxuICAgIGdyb3VwOiB7XG4gICAgICB0eXBlOiBcInRleHRcIlxuICAgIH0sXG4gICAgZGVmYXVsdFZhbHVlOiB7XG4gICAgICB0eXBlOiBcInRleHRcIlxuICAgIH0sXG4gICAgYWxsb3dlZFZhbHVlczoge1xuICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICBtdWx0aXBsZTogdHJ1ZVxuICAgIH0sXG4gICAgbXVsdGlwbGU6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICByZXF1aXJlZDoge1xuICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICB9LFxuICAgIGlzX3dpZGU6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICByZWFkb25seToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICB9LFxuICAgIGhpZGRlbjoge1xuICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICB9LFxuICAgIG9taXQ6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBpbmRleDoge1xuICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICB9LFxuICAgIHNlYXJjaGFibGU6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBzb3J0YWJsZToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICB9LFxuICAgIHByZWNpc2lvbjoge1xuICAgICAgdHlwZTogXCJjdXJyZW5jeVwiLFxuICAgICAgZGVmYXVsdFZhbHVlOiAxOFxuICAgIH0sXG4gICAgc2NhbGU6IHtcbiAgICAgIHR5cGU6IFwiY3VycmVuY3lcIixcbiAgICAgIGRlZmF1bHRWYWx1ZTogMlxuICAgIH0sXG4gICAgcmVmZXJlbmNlX3RvOiB7XG4gICAgICB0eXBlOiBcImxvb2t1cFwiLFxuICAgICAgb3B0aW9uc0Z1bmN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9vcHRpb25zO1xuICAgICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihvLCBrKSB7XG4gICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgbGFiZWw6IG8ubGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogayxcbiAgICAgICAgICAgIGljb246IG8uaWNvblxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zO1xuICAgICAgfVxuICAgIH0sXG4gICAgcm93czoge1xuICAgICAgdHlwZTogXCJjdXJyZW5jeVwiXG4gICAgfSxcbiAgICBvcHRpb25zOiB7XG4gICAgICB0eXBlOiBcInRleHRhcmVhXCIsXG4gICAgICBpc193aWRlOiB0cnVlXG4gICAgfSxcbiAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgbGFiZWw6IFwiRGVzY3JpcHRpb25cIixcbiAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgaXNfd2lkZTogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgbGlzdF92aWV3czoge1xuICAgIGFsbDoge1xuICAgICAgY29sdW1uczogW1wibmFtZVwiLCBcImxhYmVsXCIsIFwidHlwZVwiLCBcIm9iamVjdFwiLCBcInNvcnRfbm9cIiwgXCJtb2RpZmllZFwiXSxcbiAgICAgIHNvcnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkX25hbWU6IFwic29ydF9ub1wiLFxuICAgICAgICAgIG9yZGVyOiBcImFzY1wiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxuICAgIH1cbiAgfSxcbiAgcGVybWlzc2lvbl9zZXQ6IHtcbiAgICB1c2VyOiB7XG4gICAgICBhbGxvd0NyZWF0ZTogZmFsc2UsXG4gICAgICBhbGxvd0RlbGV0ZTogZmFsc2UsXG4gICAgICBhbGxvd0VkaXQ6IGZhbHNlLFxuICAgICAgYWxsb3dSZWFkOiBmYWxzZSxcbiAgICAgIG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlLFxuICAgICAgdmlld0FsbFJlY29yZHM6IGZhbHNlXG4gICAgfSxcbiAgICBhZG1pbjoge1xuICAgICAgYWxsb3dDcmVhdGU6IHRydWUsXG4gICAgICBhbGxvd0RlbGV0ZTogdHJ1ZSxcbiAgICAgIGFsbG93RWRpdDogdHJ1ZSxcbiAgICAgIGFsbG93UmVhZDogdHJ1ZSxcbiAgICAgIG1vZGlmeUFsbFJlY29yZHM6IHRydWUsXG4gICAgICB2aWV3QWxsUmVjb3JkczogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgdHJpZ2dlcnM6IHtcbiAgICBcImFmdGVyLmluc2VydC5zZXJ2ZXIub2JqZWN0X2ZpZWxkc1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYWZ0ZXIuaW5zZXJ0XCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICByZXR1cm4gX3N5bmNUb09iamVjdChkb2MpO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJhZnRlci51cGRhdGUuc2VydmVyLm9iamVjdF9maWVsZHNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImFmdGVyLnVwZGF0ZVwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgcmV0dXJuIF9zeW5jVG9PYmplY3QoZG9jKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYWZ0ZXIucmVtb3ZlLnNlcnZlci5vYmplY3RfZmllbGRzXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJhZnRlci5yZW1vdmVcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICAgIHJldHVybiBfc3luY1RvT2JqZWN0KGRvYyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcImJlZm9yZS51cGRhdGUuc2VydmVyLm9iamVjdF9maWVsZHNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImJlZm9yZS51cGRhdGVcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucykge1xuICAgICAgICB2YXIgX3JlZmVyZW5jZV90bywgb2JqZWN0LCBvYmplY3RfZG9jdW1lbnRzLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHJlZjYsIHJlZjc7XG4gICAgICAgIGlmIChkb2MubmFtZSA9PT0gJ25hbWUnICYmIChtb2RpZmllciAhPSBudWxsID8gKHJlZiA9IG1vZGlmaWVyLiRzZXQpICE9IG51bGwgPyByZWYubmFtZSA6IHZvaWQgMCA6IHZvaWQgMCkgJiYgZG9jLm5hbWUgIT09IG1vZGlmaWVyLiRzZXQubmFtZSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuS4jeiDveS/ruaUueatpOe6quW9leeahG5hbWXlsZ7mgKdcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChtb2RpZmllciAhPSBudWxsID8gKHJlZjEgPSBtb2RpZmllci4kc2V0KSAhPSBudWxsID8gcmVmMS5uYW1lIDogdm9pZCAwIDogdm9pZCAwKSAmJiBpc1JlcGVhdGVkTmFtZShkb2MsIG1vZGlmaWVyLiRzZXQubmFtZSkpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInVwZGF0ZSBmaWVsZHPlr7nosaHlkI3np7DkuI3og73ph43lpI1cIiArIGRvYy5uYW1lKTtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLlr7nosaHlkI3np7DkuI3og73ph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vZGlmaWVyICE9IG51bGwgPyAocmVmMiA9IG1vZGlmaWVyLiRzZXQpICE9IG51bGwgPyByZWYyLnJlZmVyZW5jZV90byA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgIGlmIChtb2RpZmllci4kc2V0LnJlZmVyZW5jZV90by5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBtb2RpZmllci4kc2V0LnJlZmVyZW5jZV90b1swXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IG1vZGlmaWVyLiRzZXQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoKG1vZGlmaWVyICE9IG51bGwgPyAocmVmMyA9IG1vZGlmaWVyLiRzZXQpICE9IG51bGwgPyByZWYzLmluZGV4IDogdm9pZCAwIDogdm9pZCAwKSAmJiAoKG1vZGlmaWVyICE9IG51bGwgPyAocmVmNCA9IG1vZGlmaWVyLiRzZXQpICE9IG51bGwgPyByZWY0LnR5cGUgOiB2b2lkIDAgOiB2b2lkIDApID09PSAndGV4dGFyZWEnIHx8IChtb2RpZmllciAhPSBudWxsID8gKHJlZjUgPSBtb2RpZmllci4kc2V0KSAhPSBudWxsID8gcmVmNS50eXBlIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gJ2h0bWwnKSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuWkmuihjOaWh+acrOS4jeaUr+aMgeW7uueri+e0ouW8lVwiKTtcbiAgICAgICAgfVxuICAgICAgICBvYmplY3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLmZpbmRPbmUoe1xuICAgICAgICAgIF9pZDogZG9jLm9iamVjdFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgICAgbGFiZWw6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgICAgb2JqZWN0X2RvY3VtZW50cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3QubmFtZSkuZmluZCgpO1xuICAgICAgICAgIGlmICgobW9kaWZpZXIgIT0gbnVsbCA/IChyZWY2ID0gbW9kaWZpZXIuJHNldCkgIT0gbnVsbCA/IHJlZjYucmVmZXJlbmNlX3RvIDogdm9pZCAwIDogdm9pZCAwKSAmJiBkb2MucmVmZXJlbmNlX3RvICE9PSBfcmVmZXJlbmNlX3RvICYmIG9iamVjdF9kb2N1bWVudHMuY291bnQoKSA+IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuWvueixoVwiICsgb2JqZWN0LmxhYmVsICsgXCLkuK3lt7Lnu4/mnInorrDlvZXvvIzkuI3og73kv67mlLlyZWZlcmVuY2VfdG/lrZfmrrVcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgobW9kaWZpZXIgIT0gbnVsbCA/IChyZWY3ID0gbW9kaWZpZXIuJHVuc2V0KSAhPSBudWxsID8gcmVmNy5yZWZlcmVuY2VfdG8gOiB2b2lkIDAgOiB2b2lkIDApICYmIGRvYy5yZWZlcmVuY2VfdG8gIT09IF9yZWZlcmVuY2VfdG8gJiYgb2JqZWN0X2RvY3VtZW50cy5jb3VudCgpID4gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5a+56LGhXCIgKyBvYmplY3QubGFiZWwgKyBcIuS4reW3sue7j+acieiusOW9le+8jOS4jeiDveS/ruaUuXJlZmVyZW5jZV90b+Wtl+autVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYmVmb3JlLmluc2VydC5zZXJ2ZXIub2JqZWN0X2ZpZWxkc1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYmVmb3JlLmluc2VydFwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgaWYgKGlzUmVwZWF0ZWROYW1lKGRvYykpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImluc2VydCBmaWVsZHPlr7nosaHlkI3np7DkuI3og73ph43lpI1cIiArIGRvYy5uYW1lKTtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLlr7nosaHlkI3np7DkuI3og73ph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChkb2MgIT0gbnVsbCA/IGRvYy5pbmRleCA6IHZvaWQgMCkgJiYgKChkb2MgIT0gbnVsbCA/IGRvYy50eXBlIDogdm9pZCAwKSA9PT0gJ3RleHRhcmVhJyB8fCAoZG9jICE9IG51bGwgPyBkb2MudHlwZSA6IHZvaWQgMCkgPT09ICdodG1sJykpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgJ+WkmuihjOaWh+acrOS4jeaUr+aMgeW7uueri+e0ouW8lScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcImJlZm9yZS5yZW1vdmUuc2VydmVyLm9iamVjdF9maWVsZHNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImJlZm9yZS5yZW1vdmVcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICAgIGlmIChkb2MubmFtZSA9PT0gXCJuYW1lXCIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLkuI3og73liKDpmaTmraTnuqrlvZVcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iLCJfc3luY1RvT2JqZWN0ID0gKGRvYykgLT5cblx0b2JqZWN0X3RyaWdnZXJzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3RyaWdnZXJzXCIpLmZpbmQoe3NwYWNlOiBkb2Muc3BhY2UsIG9iamVjdDogZG9jLm9iamVjdCwgaXNfZW5hYmxlOiB0cnVlfSwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0Y3JlYXRlZDogMCxcblx0XHRcdG1vZGlmaWVkOiAwLFxuXHRcdFx0b3duZXI6IDAsXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcblx0XHR9XG5cdH0pLmZldGNoKClcblxuXHR0cmlnZ2VycyA9IHt9XG5cblx0Xy5mb3JFYWNoIG9iamVjdF90cmlnZ2VycywgKGYpLT5cblx0XHR0cmlnZ2Vyc1tmLm5hbWVdID0gZlxuXG5cdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikudXBkYXRlKHtzcGFjZTogZG9jLnNwYWNlLCBuYW1lOiBkb2Mub2JqZWN0fSwge1xuXHRcdCRzZXQ6XG5cdFx0XHR0cmlnZ2VyczogdHJpZ2dlcnNcblx0fSlcblxuaXNSZXBlYXRlZE5hbWUgPSAoZG9jLCBuYW1lKS0+XG5cdG90aGVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3RyaWdnZXJzXCIpLmZpbmQoe29iamVjdDogZG9jLm9iamVjdCwgIHNwYWNlOiBkb2Muc3BhY2UsIF9pZDogeyRuZTogZG9jLl9pZH0sIG5hbWU6IG5hbWUgfHwgZG9jLm5hbWV9LCB7ZmllbGRzOntfaWQ6IDF9fSlcblx0aWYgb3RoZXIuY291bnQoKSA+IDBcblx0XHRyZXR1cm4gdHJ1ZVxuXHRyZXR1cm4gZmFsc2VcblxuY2hlY2sgPSAodXNlcklkLCBkb2MpLT5cblx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4odXNlcklkLCBkb2Muc3BhY2UpXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5Y+q5pyJ5bel5L2c5Y67566h55CG5ZGY5omN6IO96YWN572u6Kem5Y+R5ZmoXCJcblxuXHQjVE9ETyDmoKHpqozlhbPplK7lrZfvvJpyZW1vdmXjgIEgZHJvcOOAgWRlbGV0ZeOAgWRi44CBY29sbGVjdGlvbuOAgWV2YWznrYnvvIznhLblkI7lj5bmtogg5LyB5Lia54mI54mI6ZmQ5Yi2XG5cdGlmIGRvYy5vbiA9PSAnc2VydmVyJyAmJiAhU3RlZWRvcy5pc0xlZ2FsVmVyc2lvbihkb2Muc3BhY2UsXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIpXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5Y+q5pyJ5LyB5Lia54mI5pSv5oyB6YWN572u5pyN5Yqh56uv55qE6Kem5Y+R5ZmoXCJcblxuQ3JlYXRvci5PYmplY3RzLm9iamVjdF90cmlnZ2VycyA9XG5cdG5hbWU6IFwib2JqZWN0X3RyaWdnZXJzXCJcblx0aWNvbjogXCJhc3NldF9yZWxhdGlvbnNoaXBcIlxuXHRsYWJlbDpcIuinpuWPkeWZqFwiXG5cdGZpZWxkczpcblx0XHRuYW1lOlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblx0XHRcdHNlYXJjaGFibGU6IHRydWVcblx0XHRcdGluZGV4OiB0cnVlXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZVxuXHRcdFx0cmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlXG5cdFx0bGFiZWw6XG5cdFx0XHR0eXBlOiBcInRleHRcIlxuXHRcdG9iamVjdDpcblx0XHRcdHR5cGU6IFwibWFzdGVyX2RldGFpbFwiXG5cdFx0XHRyZWZlcmVuY2VfdG86IFwib2JqZWN0c1wiXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZVxuXHRcdFx0b3B0aW9uc0Z1bmN0aW9uOiAoKS0+XG5cdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0Xy5mb3JFYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG8sIGspLT5cblx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogby5sYWJlbCwgdmFsdWU6IGssIGljb246IG8uaWNvbn1cblx0XHRcdFx0cmV0dXJuIF9vcHRpb25zXG5cdFx0b246XG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZVxuXHRcdFx0b3B0aW9uc0Z1bmN0aW9uOiAoKS0+XG5cdFx0XHRcdHJldHVybiBbe2xhYmVsOiBcIuWuouaIt+err1wiLCB2YWx1ZTogXCJjbGllbnRcIiwgaWNvbjogXCJhZGRyZXNzXCJ9LCB7bGFiZWw6IFwi5pyN5Yqh56uvXCIsIHZhbHVlOiBcInNlcnZlclwiLCBpY29uOiBcImFkZHJlc3NcIn1dXG5cdFx0d2hlbjpcblx0XHRcdHR5cGU6IFwibG9va3VwXCJcblx0XHRcdHJlcXVpcmVkOiB0cnVlXG5cdFx0XHRvcHRpb25zRnVuY3Rpb246ICgpLT5cblx0XHRcdFx0W1xuXHRcdFx0XHRcdHtsYWJlbDogXCLmlrDlop7orrDlvZXkuYvliY1cIiwgdmFsdWU6IFwiYmVmb3JlLmluc2VydFwiLCBpY29uOiBcImFzc2V0X3JlbGF0aW9uc2hpcFwifVxuXHRcdFx0XHRcdHtsYWJlbDogXCLmlrDlop7orrDlvZXkuYvlkI5cIiwgdmFsdWU6IFwiYWZ0ZXIuaW5zZXJ0XCIsIGljb246IFwiYXNzZXRfcmVsYXRpb25zaGlwXCJ9XG5cdFx0XHRcdFx0e2xhYmVsOiBcIuS/ruaUueiusOW9leS5i+WJjVwiLCB2YWx1ZTogXCJiZWZvcmUudXBkYXRlXCIsIGljb246IFwiYXNzZXRfcmVsYXRpb25zaGlwXCJ9XG5cdFx0XHRcdFx0e2xhYmVsOiBcIuS/ruaUueiusOW9leS5i+WQjlwiLCB2YWx1ZTogXCJhZnRlci51cGRhdGVcIiwgaWNvbjogXCJhc3NldF9yZWxhdGlvbnNoaXBcIn1cblx0XHRcdFx0XHR7bGFiZWw6IFwi5Yig6Zmk6K6w5b2V5LmL5YmNXCIsIHZhbHVlOiBcImJlZm9yZS5yZW1vdmVcIiwgaWNvbjogXCJhc3NldF9yZWxhdGlvbnNoaXBcIn1cblx0XHRcdFx0XHR7bGFiZWw6IFwi5Yig6Zmk6K6w5b2V5LmL5ZCOXCIsIHZhbHVlOiBcImFmdGVyLnJlbW92ZVwiLCBpY29uOiBcImFzc2V0X3JlbGF0aW9uc2hpcFwifVxuXHRcdFx0XHRdXG5cdFx0aXNfZW5hYmxlOlxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcblx0XHR0b2RvOlxuXHRcdFx0dHlwZTogXCJ0ZXh0YXJlYVwiXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZVxuXHRcdFx0aXNfd2lkZTp0cnVlXG5cblx0bGlzdF92aWV3czpcblx0XHRhbGw6XG5cdFx0XHRjb2x1bW5zOiBbXCJuYW1lXCIsIFwibGFiZWxcIiwgXCJvYmplY3RcIiwgXCJvblwiLCBcIndoZW5cIiwgXCJpc19lbmFibGVcIl1cblx0XHRcdGZpbHRlcl9zY29wZTogXCJzcGFjZVwiXG5cblx0cGVybWlzc2lvbl9zZXQ6XG5cdFx0dXNlcjpcblx0XHRcdGFsbG93Q3JlYXRlOiBmYWxzZVxuXHRcdFx0YWxsb3dEZWxldGU6IGZhbHNlXG5cdFx0XHRhbGxvd0VkaXQ6IGZhbHNlXG5cdFx0XHRhbGxvd1JlYWQ6IGZhbHNlXG5cdFx0XHRtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZVxuXHRcdFx0dmlld0FsbFJlY29yZHM6IGZhbHNlXG5cdFx0YWRtaW46XG5cdFx0XHRhbGxvd0NyZWF0ZTogdHJ1ZVxuXHRcdFx0YWxsb3dEZWxldGU6IHRydWVcblx0XHRcdGFsbG93RWRpdDogdHJ1ZVxuXHRcdFx0YWxsb3dSZWFkOiB0cnVlXG5cdFx0XHRtb2RpZnlBbGxSZWNvcmRzOiB0cnVlXG5cdFx0XHR2aWV3QWxsUmVjb3JkczogdHJ1ZVxuXG5cdHRyaWdnZXJzOlxuXHRcdFwiYWZ0ZXIuaW5zZXJ0LnNlcnZlci5vYmplY3RfdHJpZ2dlcnNcIjpcblx0XHRcdG9uOiBcInNlcnZlclwiXG5cdFx0XHR3aGVuOiBcImFmdGVyLmluc2VydFwiXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MpLT5cblx0XHRcdFx0X3N5bmNUb09iamVjdChkb2MpXG5cdFx0XCJhZnRlci51cGRhdGUuc2VydmVyLm9iamVjdF90cmlnZ2Vyc1wiOlxuXHRcdFx0b246IFwic2VydmVyXCJcblx0XHRcdHdoZW46IFwiYWZ0ZXIudXBkYXRlXCJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxuXHRcdFx0XHRfc3luY1RvT2JqZWN0KGRvYylcblx0XHRcImFmdGVyLnJlbW92ZS5zZXJ2ZXIub2JqZWN0X3RyaWdnZXJzXCI6XG5cdFx0XHRvbjogXCJzZXJ2ZXJcIlxuXHRcdFx0d2hlbjogXCJhZnRlci5yZW1vdmVcIlxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jKS0+XG5cdFx0XHRcdF9zeW5jVG9PYmplY3QoZG9jKVxuXG5cdFx0XCJiZWZvcmUuZGVsZXRlLnNlcnZlci5vYmplY3RfdHJpZ2dlcnNcIjpcblx0XHRcdG9uOiBcInNlcnZlclwiXG5cdFx0XHR3aGVuOiBcImJlZm9yZS5yZW1vdmVcIlxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jKS0+XG5cdFx0XHRcdGNoZWNrKHVzZXJJZCwgZG9jKVxuXG5cdFx0XCJiZWZvcmUudXBkYXRlLnNlcnZlci5vYmplY3RfdHJpZ2dlcnNcIjpcblx0XHRcdG9uOiBcInNlcnZlclwiXG5cdFx0XHR3aGVuOiBcImJlZm9yZS51cGRhdGVcIlxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyktPlxuXHRcdFx0XHRjaGVjayh1c2VySWQsIGRvYylcblx0XHRcdFx0aWYgbW9kaWZpZXI/LiRzZXQ/Lm5hbWUgJiYgaXNSZXBlYXRlZE5hbWUoZG9jLCBtb2RpZmllci4kc2V0Lm5hbWUpXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJ1cGRhdGUgdHJpZ2dlcnPlr7nosaHlkI3np7DkuI3og73ph43lpI0je2RvYy5uYW1lfVwiKVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuWvueixoeWQjeensOS4jeiDvemHjeWkjSN7ZG9jLm5hbWV9XCJcblxuXHRcdFwiYmVmb3JlLmluc2VydC5zZXJ2ZXIub2JqZWN0X3RyaWdnZXJzXCI6XG5cdFx0XHRvbjogXCJzZXJ2ZXJcIlxuXHRcdFx0d2hlbjogXCJiZWZvcmUuaW5zZXJ0XCJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxuXHRcdFx0XHRjaGVjayh1c2VySWQsIGRvYylcblx0XHRcdFx0aWYgaXNSZXBlYXRlZE5hbWUoZG9jKVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiaW5zZXJ0IHRyaWdnZXJz5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNI3tkb2MubmFtZX1cIilcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCLlr7nosaHlkI3np7DkuI3og73ph43lpI1cIiIsInZhciBfc3luY1RvT2JqZWN0LCBjaGVjaywgaXNSZXBlYXRlZE5hbWU7XG5cbl9zeW5jVG9PYmplY3QgPSBmdW5jdGlvbihkb2MpIHtcbiAgdmFyIG9iamVjdF90cmlnZ2VycywgdHJpZ2dlcnM7XG4gIG9iamVjdF90cmlnZ2VycyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF90cmlnZ2Vyc1wiKS5maW5kKHtcbiAgICBzcGFjZTogZG9jLnNwYWNlLFxuICAgIG9iamVjdDogZG9jLm9iamVjdCxcbiAgICBpc19lbmFibGU6IHRydWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgb3duZXI6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZldGNoKCk7XG4gIHRyaWdnZXJzID0ge307XG4gIF8uZm9yRWFjaChvYmplY3RfdHJpZ2dlcnMsIGZ1bmN0aW9uKGYpIHtcbiAgICByZXR1cm4gdHJpZ2dlcnNbZi5uYW1lXSA9IGY7XG4gIH0pO1xuICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS51cGRhdGUoe1xuICAgIHNwYWNlOiBkb2Muc3BhY2UsXG4gICAgbmFtZTogZG9jLm9iamVjdFxuICB9LCB7XG4gICAgJHNldDoge1xuICAgICAgdHJpZ2dlcnM6IHRyaWdnZXJzXG4gICAgfVxuICB9KTtcbn07XG5cbmlzUmVwZWF0ZWROYW1lID0gZnVuY3Rpb24oZG9jLCBuYW1lKSB7XG4gIHZhciBvdGhlcjtcbiAgb3RoZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfdHJpZ2dlcnNcIikuZmluZCh7XG4gICAgb2JqZWN0OiBkb2Mub2JqZWN0LFxuICAgIHNwYWNlOiBkb2Muc3BhY2UsXG4gICAgX2lkOiB7XG4gICAgICAkbmU6IGRvYy5faWRcbiAgICB9LFxuICAgIG5hbWU6IG5hbWUgfHwgZG9jLm5hbWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgX2lkOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKG90aGVyLmNvdW50KCkgPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuY2hlY2sgPSBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4odXNlcklkLCBkb2Muc3BhY2UpKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5Y+q5pyJ5bel5L2c5Y67566h55CG5ZGY5omN6IO96YWN572u6Kem5Y+R5ZmoXCIpO1xuICB9XG4gIGlmIChkb2Mub24gPT09ICdzZXJ2ZXInICYmICFTdGVlZG9zLmlzTGVnYWxWZXJzaW9uKGRvYy5zcGFjZSwgXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIpKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5Y+q5pyJ5LyB5Lia54mI5pSv5oyB6YWN572u5pyN5Yqh56uv55qE6Kem5Y+R5ZmoXCIpO1xuICB9XG59O1xuXG5DcmVhdG9yLk9iamVjdHMub2JqZWN0X3RyaWdnZXJzID0ge1xuICBuYW1lOiBcIm9iamVjdF90cmlnZ2Vyc1wiLFxuICBpY29uOiBcImFzc2V0X3JlbGF0aW9uc2hpcFwiLFxuICBsYWJlbDogXCLop6blj5HlmahcIixcbiAgZmllbGRzOiB7XG4gICAgbmFtZToge1xuICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICBzZWFyY2hhYmxlOiB0cnVlLFxuICAgICAgaW5kZXg6IHRydWUsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZVxuICAgIH0sXG4gICAgbGFiZWw6IHtcbiAgICAgIHR5cGU6IFwidGV4dFwiXG4gICAgfSxcbiAgICBvYmplY3Q6IHtcbiAgICAgIHR5cGU6IFwibWFzdGVyX2RldGFpbFwiLFxuICAgICAgcmVmZXJlbmNlX3RvOiBcIm9iamVjdHNcIixcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgb3B0aW9uc0Z1bmN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9vcHRpb25zO1xuICAgICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goQ3JlYXRvci5vYmplY3RzQnlOYW1lLCBmdW5jdGlvbihvLCBrKSB7XG4gICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgbGFiZWw6IG8ubGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogayxcbiAgICAgICAgICAgIGljb246IG8uaWNvblxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zO1xuICAgICAgfVxuICAgIH0sXG4gICAgb246IHtcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIG9wdGlvbnNGdW5jdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6IFwi5a6i5oi356uvXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCJjbGllbnRcIixcbiAgICAgICAgICAgIGljb246IFwiYWRkcmVzc1wiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbGFiZWw6IFwi5pyN5Yqh56uvXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCJzZXJ2ZXJcIixcbiAgICAgICAgICAgIGljb246IFwiYWRkcmVzc1wiXG4gICAgICAgICAgfVxuICAgICAgICBdO1xuICAgICAgfVxuICAgIH0sXG4gICAgd2hlbjoge1xuICAgICAgdHlwZTogXCJsb29rdXBcIixcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgb3B0aW9uc0Z1bmN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogXCLmlrDlop7orrDlvZXkuYvliY1cIixcbiAgICAgICAgICAgIHZhbHVlOiBcImJlZm9yZS5pbnNlcnRcIixcbiAgICAgICAgICAgIGljb246IFwiYXNzZXRfcmVsYXRpb25zaGlwXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBsYWJlbDogXCLmlrDlop7orrDlvZXkuYvlkI5cIixcbiAgICAgICAgICAgIHZhbHVlOiBcImFmdGVyLmluc2VydFwiLFxuICAgICAgICAgICAgaWNvbjogXCJhc3NldF9yZWxhdGlvbnNoaXBcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxhYmVsOiBcIuS/ruaUueiusOW9leS5i+WJjVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwiYmVmb3JlLnVwZGF0ZVwiLFxuICAgICAgICAgICAgaWNvbjogXCJhc3NldF9yZWxhdGlvbnNoaXBcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxhYmVsOiBcIuS/ruaUueiusOW9leS5i+WQjlwiLFxuICAgICAgICAgICAgdmFsdWU6IFwiYWZ0ZXIudXBkYXRlXCIsXG4gICAgICAgICAgICBpY29uOiBcImFzc2V0X3JlbGF0aW9uc2hpcFwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbGFiZWw6IFwi5Yig6Zmk6K6w5b2V5LmL5YmNXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCJiZWZvcmUucmVtb3ZlXCIsXG4gICAgICAgICAgICBpY29uOiBcImFzc2V0X3JlbGF0aW9uc2hpcFwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbGFiZWw6IFwi5Yig6Zmk6K6w5b2V5LmL5ZCOXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCJhZnRlci5yZW1vdmVcIixcbiAgICAgICAgICAgIGljb246IFwiYXNzZXRfcmVsYXRpb25zaGlwXCJcbiAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgICB9XG4gICAgfSxcbiAgICBpc19lbmFibGU6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICB0b2RvOiB7XG4gICAgICB0eXBlOiBcInRleHRhcmVhXCIsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGlzX3dpZGU6IHRydWVcbiAgICB9XG4gIH0sXG4gIGxpc3Rfdmlld3M6IHtcbiAgICBhbGw6IHtcbiAgICAgIGNvbHVtbnM6IFtcIm5hbWVcIiwgXCJsYWJlbFwiLCBcIm9iamVjdFwiLCBcIm9uXCIsIFwid2hlblwiLCBcImlzX2VuYWJsZVwiXSxcbiAgICAgIGZpbHRlcl9zY29wZTogXCJzcGFjZVwiXG4gICAgfVxuICB9LFxuICBwZXJtaXNzaW9uX3NldDoge1xuICAgIHVzZXI6IHtcbiAgICAgIGFsbG93Q3JlYXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RGVsZXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RWRpdDogZmFsc2UsXG4gICAgICBhbGxvd1JlYWQ6IGZhbHNlLFxuICAgICAgbW9kaWZ5QWxsUmVjb3JkczogZmFsc2UsXG4gICAgICB2aWV3QWxsUmVjb3JkczogZmFsc2VcbiAgICB9LFxuICAgIGFkbWluOiB7XG4gICAgICBhbGxvd0NyZWF0ZTogdHJ1ZSxcbiAgICAgIGFsbG93RGVsZXRlOiB0cnVlLFxuICAgICAgYWxsb3dFZGl0OiB0cnVlLFxuICAgICAgYWxsb3dSZWFkOiB0cnVlLFxuICAgICAgbW9kaWZ5QWxsUmVjb3JkczogdHJ1ZSxcbiAgICAgIHZpZXdBbGxSZWNvcmRzOiB0cnVlXG4gICAgfVxuICB9LFxuICB0cmlnZ2Vyczoge1xuICAgIFwiYWZ0ZXIuaW5zZXJ0LnNlcnZlci5vYmplY3RfdHJpZ2dlcnNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImFmdGVyLmluc2VydFwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgcmV0dXJuIF9zeW5jVG9PYmplY3QoZG9jKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYWZ0ZXIudXBkYXRlLnNlcnZlci5vYmplY3RfdHJpZ2dlcnNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImFmdGVyLnVwZGF0ZVwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgcmV0dXJuIF9zeW5jVG9PYmplY3QoZG9jKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYWZ0ZXIucmVtb3ZlLnNlcnZlci5vYmplY3RfdHJpZ2dlcnNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImFmdGVyLnJlbW92ZVwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgcmV0dXJuIF9zeW5jVG9PYmplY3QoZG9jKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYmVmb3JlLmRlbGV0ZS5zZXJ2ZXIub2JqZWN0X3RyaWdnZXJzXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJiZWZvcmUucmVtb3ZlXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICByZXR1cm4gY2hlY2sodXNlcklkLCBkb2MpO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJiZWZvcmUudXBkYXRlLnNlcnZlci5vYmplY3RfdHJpZ2dlcnNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImJlZm9yZS51cGRhdGVcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucykge1xuICAgICAgICB2YXIgcmVmO1xuICAgICAgICBjaGVjayh1c2VySWQsIGRvYyk7XG4gICAgICAgIGlmICgobW9kaWZpZXIgIT0gbnVsbCA/IChyZWYgPSBtb2RpZmllci4kc2V0KSAhPSBudWxsID8gcmVmLm5hbWUgOiB2b2lkIDAgOiB2b2lkIDApICYmIGlzUmVwZWF0ZWROYW1lKGRvYywgbW9kaWZpZXIuJHNldC5uYW1lKSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwidXBkYXRlIHRyaWdnZXJz5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCIgKyBkb2MubmFtZSk7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCIgKyBkb2MubmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYmVmb3JlLmluc2VydC5zZXJ2ZXIub2JqZWN0X3RyaWdnZXJzXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJiZWZvcmUuaW5zZXJ0XCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICBjaGVjayh1c2VySWQsIGRvYyk7XG4gICAgICAgIGlmIChpc1JlcGVhdGVkTmFtZShkb2MpKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJpbnNlcnQgdHJpZ2dlcnPlr7nosaHlkI3np7DkuI3og73ph43lpI1cIiArIGRvYy5uYW1lKTtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLlr7nosaHlkI3np7DkuI3og73ph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iLCJfc3luY1RvT2JqZWN0ID0gKGRvYykgLT5cblx0b2JqZWN0X2FjdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfYWN0aW9uc1wiKS5maW5kKHtvYmplY3Q6IGRvYy5vYmplY3QsIHNwYWNlOiBkb2Muc3BhY2UsIGlzX2VuYWJsZTogdHJ1ZX0sIHtcblx0XHRmaWVsZHM6IHtcblx0XHRcdGNyZWF0ZWQ6IDAsXG5cdFx0XHRtb2RpZmllZDogMCxcblx0XHRcdG93bmVyOiAwLFxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcblx0XHRcdG1vZGlmaWVkX2J5OiAwXG5cdFx0fVxuXHR9KS5mZXRjaCgpXG5cblx0YWN0aW9ucyA9IHt9XG5cblx0Xy5mb3JFYWNoIG9iamVjdF9hY3Rpb25zLCAoZiktPlxuXHRcdGFjdGlvbnNbZi5uYW1lXSA9IGZcblxuXHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLnVwZGF0ZSh7c3BhY2U6IGRvYy5zcGFjZSwgbmFtZTogZG9jLm9iamVjdH0sIHtcblx0XHQkc2V0OlxuXHRcdFx0YWN0aW9uczogYWN0aW9uc1xuXHR9KVxuaXNSZXBlYXRlZE5hbWUgPSAoZG9jLCBuYW1lKS0+XG5cdG90aGVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2FjdGlvbnNcIikuZmluZCh7b2JqZWN0OiBkb2Mub2JqZWN0LCAgc3BhY2U6IGRvYy5zcGFjZSwgX2lkOiB7JG5lOiBkb2MuX2lkfSwgbmFtZTogbmFtZSB8fCBkb2MubmFtZX0sIHtmaWVsZHM6e19pZDogMX19KVxuXHRpZiBvdGhlci5jb3VudCgpID4gMFxuXHRcdHJldHVybiB0cnVlXG5cdHJldHVybiBmYWxzZVxuQ3JlYXRvci5PYmplY3RzLm9iamVjdF9hY3Rpb25zID1cblx0bmFtZTogXCJvYmplY3RfYWN0aW9uc1wiXG5cdGxhYmVsOiBcIuWvueixoeaTjeS9nFwiXG5cdGljb246IFwibWFya2V0aW5nX2FjdGlvbnNcIlxuXHRmaWVsZHM6XG5cdFx0b2JqZWN0OlxuXHRcdFx0dHlwZTogXCJtYXN0ZXJfZGV0YWlsXCJcblx0XHRcdHJlZmVyZW5jZV90bzogXCJvYmplY3RzXCJcblx0XHRcdHJlcXVpcmVkOiB0cnVlXG5cdFx0XHRvcHRpb25zRnVuY3Rpb246ICgpLT5cblx0XHRcdFx0X29wdGlvbnMgPSBbXVxuXHRcdFx0XHRfLmZvckVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAobywgayktPlxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBvLmxhYmVsLCB2YWx1ZTogaywgaWNvbjogby5pY29ufVxuXHRcdFx0XHRyZXR1cm4gX29wdGlvbnNcblx0XHRuYW1lOlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblx0XHRcdHNlYXJjaGFibGU6dHJ1ZVxuXHRcdFx0aW5kZXg6dHJ1ZVxuXHRcdFx0cmVxdWlyZWQ6IHRydWVcblx0XHRcdHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZVxuXHRcdGxhYmVsOlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblx0XHRpc19lbmFibGU6XG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxuXHRcdHZpc2libGU6XG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxuXHRcdFx0b21pdDogdHJ1ZVxuXHRcdG9uOlxuXHRcdFx0dHlwZTogXCJsb29rdXBcIlxuXHRcdFx0aXNfd2lkZTp0cnVlXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZVxuXHRcdFx0b3B0aW9uc0Z1bmN0aW9uOiAoKS0+XG5cdFx0XHRcdFtcblx0XHRcdFx0XHR7bGFiZWw6IFwi5pi+56S65Zyo5YiX6KGo5Y+z5LiK6KeSXCIsIHZhbHVlOiBcImxpc3RcIiwgaWNvbjogXCJjb250YWN0X2xpc3RcIn1cblx0XHRcdFx0XHR7bGFiZWw6IFwi5pi+56S65Zyo6K6w5b2V5p+l55yL6aG15Y+z5LiK6KeSXCIsIHZhbHVlOiBcInJlY29yZFwiLCBpY29uOiBcImNvbnRyYWN0XCJ9XG5cdFx0XHRcdF1cblx0XHR0b2RvOlxuXHRcdFx0bGFiZWw6IFwi5omn6KGM55qE6ISa5pysXCJcblx0XHRcdHR5cGU6IFwidGV4dGFyZWFcIlxuXHRcdFx0cmVxdWlyZWQ6IHRydWVcblx0XHRcdGlzX3dpZGU6dHJ1ZVxuXG5cblx0bGlzdF92aWV3czpcblx0XHRhbGw6XG5cdFx0XHRjb2x1bW5zOiBbXCJuYW1lXCIsIFwibGFiZWxcIiwgXCJvYmplY3RcIiwgXCJvblwiLCBcImlzX2VuYWJsZVwiLCBcIm1vZGlmaWVkXCJdXG5cdFx0XHRmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxuXG5cdHBlcm1pc3Npb25fc2V0OlxuXHRcdHVzZXI6XG5cdFx0XHRhbGxvd0NyZWF0ZTogZmFsc2Vcblx0XHRcdGFsbG93RGVsZXRlOiBmYWxzZVxuXHRcdFx0YWxsb3dFZGl0OiBmYWxzZVxuXHRcdFx0YWxsb3dSZWFkOiBmYWxzZVxuXHRcdFx0bW9kaWZ5QWxsUmVjb3JkczogZmFsc2Vcblx0XHRcdHZpZXdBbGxSZWNvcmRzOiBmYWxzZVxuXHRcdGFkbWluOlxuXHRcdFx0YWxsb3dDcmVhdGU6IHRydWVcblx0XHRcdGFsbG93RGVsZXRlOiB0cnVlXG5cdFx0XHRhbGxvd0VkaXQ6IHRydWVcblx0XHRcdGFsbG93UmVhZDogdHJ1ZVxuXHRcdFx0bW9kaWZ5QWxsUmVjb3JkczogdHJ1ZVxuXHRcdFx0dmlld0FsbFJlY29yZHM6IHRydWVcblxuXHR0cmlnZ2Vyczpcblx0XHRcImFmdGVyLmluc2VydC5zZXJ2ZXIub2JqZWN0X2FjdGlvbnNcIjpcblx0XHRcdG9uOiBcInNlcnZlclwiXG5cdFx0XHR3aGVuOiBcImFmdGVyLmluc2VydFwiXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MpLT5cblx0XHRcdFx0X3N5bmNUb09iamVjdChkb2MpXG5cdFx0XCJhZnRlci51cGRhdGUuc2VydmVyLm9iamVjdF9hY3Rpb25zXCI6XG5cdFx0XHRvbjogXCJzZXJ2ZXJcIlxuXHRcdFx0d2hlbjogXCJhZnRlci51cGRhdGVcIlxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jKS0+XG5cdFx0XHRcdF9zeW5jVG9PYmplY3QoZG9jKVxuXHRcdFwiYWZ0ZXIucmVtb3ZlLnNlcnZlci5vYmplY3RfYWN0aW9uc1wiOlxuXHRcdFx0b246IFwic2VydmVyXCJcblx0XHRcdHdoZW46IFwiYWZ0ZXIucmVtb3ZlXCJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxuXHRcdFx0XHRfc3luY1RvT2JqZWN0KGRvYylcblxuXHRcdFwiYmVmb3JlLnVwZGF0ZS5zZXJ2ZXIub2JqZWN0X2FjdGlvbnNcIjpcblx0XHRcdG9uOiBcInNlcnZlclwiXG5cdFx0XHR3aGVuOiBcImJlZm9yZS51cGRhdGVcIlxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyktPlxuXHRcdFx0XHRpZiBtb2RpZmllcj8uJHNldD8ubmFtZSAmJiBpc1JlcGVhdGVkTmFtZShkb2MsIG1vZGlmaWVyLiRzZXQubmFtZSlcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcInVwZGF0ZSBhY3Rpb25z5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNI3tkb2MubmFtZX1cIilcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCLlr7nosaHlkI3np7DkuI3og73ph43lpI1cIlxuXG5cdFx0XCJiZWZvcmUuaW5zZXJ0LnNlcnZlci5vYmplY3RfYWN0aW9uc1wiOlxuXHRcdFx0b246IFwic2VydmVyXCJcblx0XHRcdHdoZW46IFwiYmVmb3JlLmluc2VydFwiXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MpLT5cblx0XHRcdFx0ZG9jLnZpc2libGUgPSB0cnVlXG5cdFx0XHRcdGlmIGlzUmVwZWF0ZWROYW1lKGRvYylcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcImluc2VydCBhY3Rpb25z5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNI3tkb2MubmFtZX1cIilcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCLlr7nosaHlkI3np7DkuI3og73ph43lpI0je2RvYy5uYW1lfVwiIiwidmFyIF9zeW5jVG9PYmplY3QsIGlzUmVwZWF0ZWROYW1lO1xuXG5fc3luY1RvT2JqZWN0ID0gZnVuY3Rpb24oZG9jKSB7XG4gIHZhciBhY3Rpb25zLCBvYmplY3RfYWN0aW9ucztcbiAgb2JqZWN0X2FjdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfYWN0aW9uc1wiKS5maW5kKHtcbiAgICBvYmplY3Q6IGRvYy5vYmplY3QsXG4gICAgc3BhY2U6IGRvYy5zcGFjZSxcbiAgICBpc19lbmFibGU6IHRydWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgb3duZXI6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZldGNoKCk7XG4gIGFjdGlvbnMgPSB7fTtcbiAgXy5mb3JFYWNoKG9iamVjdF9hY3Rpb25zLCBmdW5jdGlvbihmKSB7XG4gICAgcmV0dXJuIGFjdGlvbnNbZi5uYW1lXSA9IGY7XG4gIH0pO1xuICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS51cGRhdGUoe1xuICAgIHNwYWNlOiBkb2Muc3BhY2UsXG4gICAgbmFtZTogZG9jLm9iamVjdFxuICB9LCB7XG4gICAgJHNldDoge1xuICAgICAgYWN0aW9uczogYWN0aW9uc1xuICAgIH1cbiAgfSk7XG59O1xuXG5pc1JlcGVhdGVkTmFtZSA9IGZ1bmN0aW9uKGRvYywgbmFtZSkge1xuICB2YXIgb3RoZXI7XG4gIG90aGVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2FjdGlvbnNcIikuZmluZCh7XG4gICAgb2JqZWN0OiBkb2Mub2JqZWN0LFxuICAgIHNwYWNlOiBkb2Muc3BhY2UsXG4gICAgX2lkOiB7XG4gICAgICAkbmU6IGRvYy5faWRcbiAgICB9LFxuICAgIG5hbWU6IG5hbWUgfHwgZG9jLm5hbWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgX2lkOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKG90aGVyLmNvdW50KCkgPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5PYmplY3RzLm9iamVjdF9hY3Rpb25zID0ge1xuICBuYW1lOiBcIm9iamVjdF9hY3Rpb25zXCIsXG4gIGxhYmVsOiBcIuWvueixoeaTjeS9nFwiLFxuICBpY29uOiBcIm1hcmtldGluZ19hY3Rpb25zXCIsXG4gIGZpZWxkczoge1xuICAgIG9iamVjdDoge1xuICAgICAgdHlwZTogXCJtYXN0ZXJfZGV0YWlsXCIsXG4gICAgICByZWZlcmVuY2VfdG86IFwib2JqZWN0c1wiLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBvcHRpb25zRnVuY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX29wdGlvbnM7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKG8sIGspIHtcbiAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICBsYWJlbDogby5sYWJlbCxcbiAgICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgICAgaWNvbjogby5pY29uXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gX29wdGlvbnM7XG4gICAgICB9XG4gICAgfSxcbiAgICBuYW1lOiB7XG4gICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgIHNlYXJjaGFibGU6IHRydWUsXG4gICAgICBpbmRleDogdHJ1ZSxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlXG4gICAgfSxcbiAgICBsYWJlbDoge1xuICAgICAgdHlwZTogXCJ0ZXh0XCJcbiAgICB9LFxuICAgIGlzX2VuYWJsZToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICB9LFxuICAgIHZpc2libGU6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgb21pdDogdHJ1ZVxuICAgIH0sXG4gICAgb246IHtcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICBpc193aWRlOiB0cnVlLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBvcHRpb25zRnVuY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiBcIuaYvuekuuWcqOWIl+ihqOWPs+S4iuinklwiLFxuICAgICAgICAgICAgdmFsdWU6IFwibGlzdFwiLFxuICAgICAgICAgICAgaWNvbjogXCJjb250YWN0X2xpc3RcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxhYmVsOiBcIuaYvuekuuWcqOiusOW9leafpeeci+mhteWPs+S4iuinklwiLFxuICAgICAgICAgICAgdmFsdWU6IFwicmVjb3JkXCIsXG4gICAgICAgICAgICBpY29uOiBcImNvbnRyYWN0XCJcbiAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgICB9XG4gICAgfSxcbiAgICB0b2RvOiB7XG4gICAgICBsYWJlbDogXCLmiafooYznmoTohJrmnKxcIixcbiAgICAgIHR5cGU6IFwidGV4dGFyZWFcIixcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaXNfd2lkZTogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgbGlzdF92aWV3czoge1xuICAgIGFsbDoge1xuICAgICAgY29sdW1uczogW1wibmFtZVwiLCBcImxhYmVsXCIsIFwib2JqZWN0XCIsIFwib25cIiwgXCJpc19lbmFibGVcIiwgXCJtb2RpZmllZFwiXSxcbiAgICAgIGZpbHRlcl9zY29wZTogXCJzcGFjZVwiXG4gICAgfVxuICB9LFxuICBwZXJtaXNzaW9uX3NldDoge1xuICAgIHVzZXI6IHtcbiAgICAgIGFsbG93Q3JlYXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RGVsZXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RWRpdDogZmFsc2UsXG4gICAgICBhbGxvd1JlYWQ6IGZhbHNlLFxuICAgICAgbW9kaWZ5QWxsUmVjb3JkczogZmFsc2UsXG4gICAgICB2aWV3QWxsUmVjb3JkczogZmFsc2VcbiAgICB9LFxuICAgIGFkbWluOiB7XG4gICAgICBhbGxvd0NyZWF0ZTogdHJ1ZSxcbiAgICAgIGFsbG93RGVsZXRlOiB0cnVlLFxuICAgICAgYWxsb3dFZGl0OiB0cnVlLFxuICAgICAgYWxsb3dSZWFkOiB0cnVlLFxuICAgICAgbW9kaWZ5QWxsUmVjb3JkczogdHJ1ZSxcbiAgICAgIHZpZXdBbGxSZWNvcmRzOiB0cnVlXG4gICAgfVxuICB9LFxuICB0cmlnZ2Vyczoge1xuICAgIFwiYWZ0ZXIuaW5zZXJ0LnNlcnZlci5vYmplY3RfYWN0aW9uc1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYWZ0ZXIuaW5zZXJ0XCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICByZXR1cm4gX3N5bmNUb09iamVjdChkb2MpO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJhZnRlci51cGRhdGUuc2VydmVyLm9iamVjdF9hY3Rpb25zXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJhZnRlci51cGRhdGVcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICAgIHJldHVybiBfc3luY1RvT2JqZWN0KGRvYyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcImFmdGVyLnJlbW92ZS5zZXJ2ZXIub2JqZWN0X2FjdGlvbnNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImFmdGVyLnJlbW92ZVwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgcmV0dXJuIF9zeW5jVG9PYmplY3QoZG9jKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYmVmb3JlLnVwZGF0ZS5zZXJ2ZXIub2JqZWN0X2FjdGlvbnNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImJlZm9yZS51cGRhdGVcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucykge1xuICAgICAgICB2YXIgcmVmO1xuICAgICAgICBpZiAoKG1vZGlmaWVyICE9IG51bGwgPyAocmVmID0gbW9kaWZpZXIuJHNldCkgIT0gbnVsbCA/IHJlZi5uYW1lIDogdm9pZCAwIDogdm9pZCAwKSAmJiBpc1JlcGVhdGVkTmFtZShkb2MsIG1vZGlmaWVyLiRzZXQubmFtZSkpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInVwZGF0ZSBhY3Rpb25z5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCIgKyBkb2MubmFtZSk7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcImJlZm9yZS5pbnNlcnQuc2VydmVyLm9iamVjdF9hY3Rpb25zXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJiZWZvcmUuaW5zZXJ0XCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICBkb2MudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIGlmIChpc1JlcGVhdGVkTmFtZShkb2MpKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJpbnNlcnQgYWN0aW9uc+WvueixoeWQjeensOS4jeiDvemHjeWkjVwiICsgZG9jLm5hbWUpO1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuWvueixoeWQjeensOS4jeiDvemHjeWkjVwiICsgZG9jLm5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIl19
