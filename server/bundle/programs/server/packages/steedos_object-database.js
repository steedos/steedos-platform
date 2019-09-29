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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2UvbW9kZWxzL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdC1kYXRhYmFzZS9tb2RlbHMvb2JqZWN0X2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9vYmplY3RfZmllbGRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2UvbW9kZWxzL29iamVjdF90cmlnZ2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9vYmplY3RfdHJpZ2dlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdC1kYXRhYmFzZS9tb2RlbHMvb2JqZWN0X2FjdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9tb2RlbHMvb2JqZWN0X2FjdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbImlzUmVwZWF0ZWROYW1lIiwiZG9jIiwib3RoZXIiLCJDcmVhdG9yIiwiZ2V0Q29sbGVjdGlvbiIsImZpbmQiLCJfaWQiLCIkbmUiLCJzcGFjZSIsIm5hbWUiLCJmaWVsZHMiLCJjb3VudCIsIk9iamVjdHMiLCJvYmplY3RzIiwiaWNvbiIsImxhYmVsIiwidHlwZSIsInNlYXJjaGFibGUiLCJpbmRleCIsInJlcXVpcmVkIiwicmVnRXgiLCJTaW1wbGVTY2hlbWEiLCJSZWdFeCIsImNvZGUiLCJvcHRpb25zRnVuY3Rpb24iLCJvcHRpb25zIiwiXyIsImZvckVhY2giLCJyZXNvdXJjZXMiLCJzbGRzSWNvbnMiLCJzdGFuZGFyZCIsInN2ZyIsInB1c2giLCJ2YWx1ZSIsImlzX2VuYWJsZSIsImRlZmF1bHRWYWx1ZSIsImVuYWJsZV9zZWFyY2giLCJlbmFibGVfZmlsZXMiLCJlbmFibGVfdGFza3MiLCJlbmFibGVfbm90ZXMiLCJlbmFibGVfZXZlbnRzIiwiZW5hYmxlX2FwaSIsImhpZGRlbiIsImVuYWJsZV9zaGFyZSIsImVuYWJsZV9pbnN0YW5jZXMiLCJlbmFibGVfY2hhdHRlciIsImVuYWJsZV9hdWRpdCIsImVuYWJsZV90cmFzaCIsImVuYWJsZV9zcGFjZV9nbG9iYWwiLCJpc192aWV3Iiwib21pdCIsImRlc2NyaXB0aW9uIiwiaXNfd2lkZSIsInNpZGViYXIiLCJibGFja2JveCIsImxpc3Rfdmlld3MiLCJhY3Rpb25zIiwicGVybWlzc2lvbl9zZXQiLCJ0cmlnZ2VycyIsImN1c3RvbSIsIm93bmVyIiwiYXBwX3VuaXF1ZV9pZCIsImFwcF92ZXJzaW9uIiwiYWxsIiwiY29sdW1ucyIsImZpbHRlcl9zY29wZSIsInVzZXIiLCJhbGxvd0NyZWF0ZSIsImFsbG93RGVsZXRlIiwiYWxsb3dFZGl0IiwiYWxsb3dSZWFkIiwibW9kaWZ5QWxsUmVjb3JkcyIsInZpZXdBbGxSZWNvcmRzIiwiYWRtaW4iLCJjb3B5X29kYXRhIiwidmlzaWJsZSIsIm9uIiwidG9kbyIsIm9iamVjdF9uYW1lIiwicmVjb3JkX2lkIiwiaXRlbV9lbGVtZW50IiwiY2xpcGJvYXJkIiwib19uYW1lIiwicGF0aCIsInJlY29yZCIsImdldE9iamVjdEJ5SWQiLCJTdGVlZG9zT0RhdGEiLCJnZXRPRGF0YVBhdGgiLCJTZXNzaW9uIiwiZ2V0IiwiYXR0ciIsIkNsaXBib2FyZCIsImUiLCJ0b2FzdHIiLCJzdWNjZXNzIiwiZXJyb3IiLCJjb25zb2xlIiwidGFnTmFtZSIsImhhc0NsYXNzIiwidHJpZ2dlciIsIndoZW4iLCJ1c2VySWQiLCJsb2ciLCJNZXRlb3IiLCJFcnJvciIsImZpZWxkTmFtZXMiLCJtb2RpZmllciIsInJlZiIsIiRzZXQiLCIkdW5zZXQiLCJpbnNlcnQiLCJvYmplY3QiLCJzaGFyZWQiLCJkb2N1bWVudHMiLCJvYmplY3RfY29sbGVjdGlvbnMiLCJkaXJlY3QiLCJyZW1vdmUiLCJDb2xsZWN0aW9ucyIsIl9jb2xsZWN0aW9uIiwiZHJvcENvbGxlY3Rpb24iLCJzdGFjayIsIl9zeW5jVG9PYmplY3QiLCJvYmplY3RfZmllbGRzIiwidGFibGVfZmllbGRzIiwiY3JlYXRlZCIsIm1vZGlmaWVkIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkX2J5IiwiZmV0Y2giLCJmIiwiY2ZfYXJyIiwiY2hpbGRfZmllbGRzIiwidGVzdCIsInNwbGl0Iiwic2l6ZSIsImV4dGVuZCIsImVhY2giLCJrIiwidXBkYXRlIiwiZmllbGQiLCJpc19uYW1lIiwicmVmZXJlbmNlX3RvIiwiX29wdGlvbnMiLCJvYmplY3RzQnlOYW1lIiwibyIsInRleHQiLCJ0ZXh0YXJlYSIsImh0bWwiLCJzZWxlY3QiLCJib29sZWFuIiwiZGF0ZSIsImRhdGV0aW1lIiwibnVtYmVyIiwiY3VycmVuY3kiLCJwYXNzd29yZCIsImxvb2t1cCIsIm1hc3Rlcl9kZXRhaWwiLCJncmlkIiwidXJsIiwiZW1haWwiLCJzb3J0X25vIiwic2NhbGUiLCJzb3J0YWJsZSIsImdyb3VwIiwiYWxsb3dlZFZhbHVlcyIsIm11bHRpcGxlIiwicmVhZG9ubHkiLCJwcmVjaXNpb24iLCJyb3dzIiwic29ydCIsImZpZWxkX25hbWUiLCJvcmRlciIsIl9yZWZlcmVuY2VfdG8iLCJvYmplY3RfZG9jdW1lbnRzIiwicmVmMSIsInJlZjIiLCJyZWYzIiwicmVmNCIsInJlZjUiLCJyZWY2IiwicmVmNyIsImxlbmd0aCIsImZpbmRPbmUiLCJjaGVjayIsIm9iamVjdF90cmlnZ2VycyIsIlN0ZWVkb3MiLCJpc1NwYWNlQWRtaW4iLCJpc0xlZ2FsVmVyc2lvbiIsIm9iamVjdF9hY3Rpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFBQSxjQUFBOztBQUFBQSxpQkFBaUIsVUFBQ0MsR0FBRDtBQUNoQixNQUFBQyxL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QixhQUFXdkcsSUFBSVEsSUFBckMsQ0FBTjtBQzJESTtBRGpFTjtBQUFBO0FBekJEO0FBaEVELENBREQsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIjVE9ETyBvYmplY3TnmoRuYW1l5LiN6IO96YeN5aSN77yM6ZyA6KaB6ICD6JmR5Yiw57O757uf6KGoXHJcbmlzUmVwZWF0ZWROYW1lID0gKGRvYyktPlxyXG5cdG90aGVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS5maW5kKHtfaWQ6IHskbmU6IGRvYy5faWR9LCBzcGFjZTogZG9jLnNwYWNlLCBuYW1lOiBkb2MubmFtZX0sIHtmaWVsZHM6e19pZDogMX19KVxyXG5cdGlmIG90aGVyLmNvdW50KCkgPiAwXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdHJldHVybiBmYWxzZVxyXG5cclxuQ3JlYXRvci5PYmplY3RzLm9iamVjdHMgPVxyXG5cdG5hbWU6IFwib2JqZWN0c1wiXHJcblx0aWNvbjogXCJvcmRlcnNcIlxyXG5cdGxhYmVsOiBcIuWvueixoVwiXHJcblx0ZmllbGRzOlxyXG5cdFx0bmFtZTpcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHRcdFx0c2VhcmNoYWJsZTp0cnVlXHJcblx0XHRcdGluZGV4OnRydWVcclxuXHRcdFx0cmVxdWlyZWQ6IHRydWVcclxuXHRcdFx0cmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlXHJcblx0XHRsYWJlbDpcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHRcdFx0cmVxdWlyZWQ6IHRydWVcclxuXHRcdGljb246XHJcblx0XHRcdHR5cGU6IFwibG9va3VwXCJcclxuXHRcdFx0b3B0aW9uc0Z1bmN0aW9uOiAoKS0+XHJcblx0XHRcdFx0b3B0aW9ucyA9IFtdXHJcblx0XHRcdFx0Xy5mb3JFYWNoIENyZWF0b3IucmVzb3VyY2VzLnNsZHNJY29ucy5zdGFuZGFyZCwgKHN2ZyktPlxyXG5cdFx0XHRcdFx0b3B0aW9ucy5wdXNoIHt2YWx1ZTogc3ZnLCBsYWJlbDogc3ZnLCBpY29uOiBzdmd9XHJcblx0XHRcdFx0cmV0dXJuIG9wdGlvbnNcclxuXHRcdGlzX2VuYWJsZTpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHRcdFx0ZGVmYXVsdFZhbHVlOiB0cnVlXHJcblx0XHRlbmFibGVfc2VhcmNoOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0ZW5hYmxlX2ZpbGVzOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0ZW5hYmxlX3Rhc2tzOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0ZW5hYmxlX25vdGVzOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0ZW5hYmxlX2V2ZW50czpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHRcdGVuYWJsZV9hcGk6XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXHJcblx0XHRcdGRlZmF1bHRWYWx1ZTogdHJ1ZVxyXG5cdFx0XHRoaWRkZW46IHRydWVcclxuXHRcdGVuYWJsZV9zaGFyZTpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHRcdFx0ZGVmYXVsdFZhbHVlOiBmYWxzZVxyXG5cdFx0ZW5hYmxlX2luc3RhbmNlczpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHRcdGVuYWJsZV9jaGF0dGVyOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0ZW5hYmxlX2F1ZGl0OlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0ZW5hYmxlX3RyYXNoOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0ZW5hYmxlX3NwYWNlX2dsb2JhbDpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHRcdFx0ZGVmYXVsdFZhbHVlOiBmYWxzZVxyXG5cdFx0aXNfdmlldzpcclxuXHRcdFx0dHlwZTogJ2Jvb2xlYW4nXHJcblx0XHRcdGRlZmF1bHRWYWx1ZTogZmFsc2VcclxuXHRcdFx0b21pdDogdHJ1ZVxyXG5cdFx0aGlkZGVuOlxyXG5cdFx0XHRsYWJlbDogXCLpmpDol49cIlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0XHRvbWl0OiB0cnVlXHJcblx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0bGFiZWw6IFwiRGVzY3JpcHRpb25cIlxyXG5cdFx0XHR0eXBlOiBcInRleHRhcmVhXCJcclxuXHRcdFx0aXNfd2lkZTogdHJ1ZVxyXG5cdFx0c2lkZWJhcjpcclxuXHRcdFx0dHlwZTogXCJvYmplY3RcIlxyXG5cdFx0XHRsYWJlbDogXCLlt6bkvqfliJfooahcIlxyXG5cdFx0XHRibGFja2JveDogdHJ1ZVxyXG5cdFx0XHRvbWl0OiB0cnVlXHJcblx0XHRcdGhpZGRlbjogdHJ1ZVxyXG5cdFx0ZmllbGRzOlxyXG5cdFx0XHR0eXBlOiBcIm9iamVjdFwiXHJcblx0XHRcdGxhYmVsOiBcIuWtl+autVwiXHJcblx0XHRcdGJsYWNrYm94OiB0cnVlXHJcblx0XHRcdG9taXQ6IHRydWVcclxuXHRcdFx0aGlkZGVuOiB0cnVlXHJcblx0XHRsaXN0X3ZpZXdzOlxyXG5cdFx0XHR0eXBlOiBcIm9iamVjdFwiXHJcblx0XHRcdGxhYmVsOiBcIuWIl+ihqOinhuWbvlwiXHJcblx0XHRcdGJsYWNrYm94OiB0cnVlXHJcblx0XHRcdG9taXQ6IHRydWVcclxuXHRcdFx0aGlkZGVuOiB0cnVlXHJcblx0XHRhY3Rpb25zOlxyXG5cdFx0XHR0eXBlOiBcIm9iamVjdFwiXHJcblx0XHRcdGxhYmVsOiBcIuaTjeS9nFwiXHJcblx0XHRcdGJsYWNrYm94OiB0cnVlXHJcblx0XHRcdG9taXQ6IHRydWVcclxuXHRcdFx0aGlkZGVuOiB0cnVlXHJcblx0XHRwZXJtaXNzaW9uX3NldDpcclxuXHRcdFx0dHlwZTogXCJvYmplY3RcIlxyXG5cdFx0XHRsYWJlbDogXCLmnYPpmZDorr7nva5cIlxyXG5cdFx0XHRibGFja2JveDogdHJ1ZVxyXG5cdFx0XHRvbWl0OiB0cnVlXHJcblx0XHRcdGhpZGRlbjogdHJ1ZVxyXG5cdFx0dHJpZ2dlcnM6XHJcblx0XHRcdHR5cGU6IFwib2JqZWN0XCJcclxuXHRcdFx0bGFiZWw6IFwi6Kem5Y+R5ZmoXCJcclxuXHRcdFx0YmxhY2tib3g6IHRydWVcclxuXHRcdFx0b21pdDogdHJ1ZVxyXG5cdFx0XHRoaWRkZW46IHRydWVcclxuXHRcdGN1c3RvbTpcclxuXHRcdFx0bGFiZWw6IFwi6KeE5YiZXCJcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHRcdFx0b21pdDogdHJ1ZVxyXG5cdFx0b3duZXI6XHJcblx0XHRcdHR5cGU6IFwibG9va3VwXCJcclxuXHRcdFx0aGlkZGVuOiB0cnVlXHJcblx0XHRhcHBfdW5pcXVlX2lkOlxyXG5cdFx0XHR0eXBlOiAndGV4dCdcclxuXHRcdFx0aGlkZGVuOiB0cnVlXHJcblx0XHRhcHBfdmVyc2lvbjpcclxuXHRcdFx0dHlwZTogJ3RleHQnLFxyXG5cdFx0XHRoaWRkZW46IHRydWVcclxuXHJcblx0bGlzdF92aWV3czpcclxuXHRcdGFsbDpcclxuXHRcdFx0Y29sdW1uczogW1wibmFtZVwiLCBcImxhYmVsXCIsIFwiaXNfZW5hYmxlXCIsIFwibW9kaWZpZWRcIl1cclxuXHRcdFx0bGFiZWw6XCLlhajpg6hcIlxyXG5cdFx0XHRmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxyXG5cclxuXHRwZXJtaXNzaW9uX3NldDpcclxuXHRcdHVzZXI6XHJcblx0XHRcdGFsbG93Q3JlYXRlOiBmYWxzZVxyXG5cdFx0XHRhbGxvd0RlbGV0ZTogZmFsc2VcclxuXHRcdFx0YWxsb3dFZGl0OiBmYWxzZVxyXG5cdFx0XHRhbGxvd1JlYWQ6IGZhbHNlXHJcblx0XHRcdG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlXHJcblx0XHRcdHZpZXdBbGxSZWNvcmRzOiBmYWxzZVxyXG5cdFx0YWRtaW46XHJcblx0XHRcdGFsbG93Q3JlYXRlOiB0cnVlXHJcblx0XHRcdGFsbG93RGVsZXRlOiB0cnVlXHJcblx0XHRcdGFsbG93RWRpdDogdHJ1ZVxyXG5cdFx0XHRhbGxvd1JlYWQ6IHRydWVcclxuXHRcdFx0bW9kaWZ5QWxsUmVjb3JkczogdHJ1ZVxyXG5cdFx0XHR2aWV3QWxsUmVjb3JkczogdHJ1ZVxyXG5cclxuXHRhY3Rpb25zOlxyXG5cdFx0Y29weV9vZGF0YTpcclxuXHRcdFx0bGFiZWw6IFwi5aSN5Yi2T0RhdGHnvZHlnYBcIlxyXG5cdFx0XHR2aXNpYmxlOiB0cnVlXHJcblx0XHRcdG9uOiBcInJlY29yZFwiXHJcblx0XHRcdHRvZG86IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQpLT5cclxuXHRcdFx0XHRyZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdEJ5SWQocmVjb3JkX2lkKVxyXG5cdFx0XHRcdCNlbmFibGVfYXBpIOWxnuaAp+acquW8gOaUvlxyXG5cdFx0XHRcdGlmIHJlY29yZD8uZW5hYmxlX2FwaSB8fCB0cnVlXHJcblx0XHRcdFx0XHRvX25hbWUgPSByZWNvcmQ/Lm5hbWVcclxuXHRcdFx0XHRcdHBhdGggPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFQYXRoKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSwgb19uYW1lKVxyXG5cdFx0XHRcdFx0aXRlbV9lbGVtZW50LmF0dHIoJ2RhdGEtY2xpcGJvYXJkLXRleHQnLCBwYXRoKTtcclxuXHRcdFx0XHRcdGlmICFpdGVtX2VsZW1lbnQuYXR0cignZGF0YS1jbGlwYm9hcmQtbmV3JylcclxuXHRcdFx0XHRcdFx0Y2xpcGJvYXJkID0gbmV3IENsaXBib2FyZChpdGVtX2VsZW1lbnRbMF0pO1xyXG5cdFx0XHRcdFx0XHRpdGVtX2VsZW1lbnQuYXR0cignZGF0YS1jbGlwYm9hcmQtbmV3JywgdHJ1ZSlcclxuXHJcblx0XHRcdFx0XHRcdGNsaXBib2FyZC5vbignc3VjY2VzcycsICAoZSkgLT5cclxuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2Vzcygn5aSN5Yi25oiQ5YqfJyk7XHJcblx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0Y2xpcGJvYXJkLm9uKCdlcnJvcicsICAoZSkgLT5cclxuXHRcdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoJ+WkjeWItuWksei0pScpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJlXCJcclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFx0I2ZpeCDor6bnu4bpobXpnaIo572R6aG1TEkg5omL5py654mIdmlldy1hY3Rpb24p56ys5LiA5qyh54K55Ye75aSN5Yi25LiN5omn6KGMXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW1fZWxlbWVudFswXS50YWdOYW1lID09ICdMSScgfHwgaXRlbV9lbGVtZW50Lmhhc0NsYXNzKCd2aWV3LWFjdGlvbicpXHJcblx0XHRcdFx0XHRcdFx0aXRlbV9lbGVtZW50LnRyaWdnZXIoXCJjbGlja1wiKTtcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoJ+WkjeWItuWksei0pTog5pyq5ZCv55SoQVBJJyk7XHJcblxyXG5cclxuXHR0cmlnZ2VyczpcclxuXHRcdFwiYmVmb3JlLmluc2VydC5zZXJ2ZXIub2JqZWN0c1wiOlxyXG5cdFx0XHRvbjogXCJzZXJ2ZXJcIlxyXG5cdFx0XHR3aGVuOiBcImJlZm9yZS5pbnNlcnRcIlxyXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MpLT5cclxuXHRcdFx0XHRpZiBpc1JlcGVhdGVkTmFtZShkb2MpXHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIm9iamVjdOWvueixoeWQjeensOS4jeiDvemHjeWkjSN7ZG9jLm5hbWV9XCIpXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCLlr7nosaHlkI3np7DkuI3og73ph43lpI1cIlxyXG5cdFx0XHRcdGRvYy5jdXN0b20gPSB0cnVlXHJcblxyXG5cdFx0XCJiZWZvcmUudXBkYXRlLnNlcnZlci5vYmplY3RzXCI6XHJcblx0XHRcdG9uOiBcInNlcnZlclwiXHJcblx0XHRcdHdoZW46IFwiYmVmb3JlLnVwZGF0ZVwiXHJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpLT5cclxuXHRcdFx0XHRpZiBtb2RpZmllcj8uJHNldD8ubmFtZSAmJiBkb2MubmFtZSAhPSBtb2RpZmllci4kc2V0Lm5hbWVcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nIFwi5LiN6IO95L+u5pS5bmFtZVwiXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCLkuI3og73kv67mlLnlr7nosaHlkI1cIlxyXG5cdFx0XHRcdGlmIG1vZGlmaWVyLiRzZXRcclxuXHRcdFx0XHRcdG1vZGlmaWVyLiRzZXQuY3VzdG9tID0gdHJ1ZVxyXG5cclxuXHRcdFx0XHRpZiBtb2RpZmllci4kdW5zZXQgJiYgbW9kaWZpZXIuJHVuc2V0LmN1c3RvbVxyXG5cdFx0XHRcdFx0ZGVsZXRlIG1vZGlmaWVyLiR1bnNldC5jdXN0b21cclxuXHJcblxyXG5cdFx0XCJhZnRlci5pbnNlcnQuc2VydmVyLm9iamVjdHNcIjpcclxuXHRcdFx0b246IFwic2VydmVyXCJcclxuXHRcdFx0d2hlbjogXCJhZnRlci5pbnNlcnRcIlxyXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MpLT5cclxuXHRcdFx0XHQj5paw5aKeb2JqZWN05pe277yM6buY6K6k5paw5bu65LiA5LiqbmFtZeWtl+autVxyXG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9maWVsZHNcIikuaW5zZXJ0KHtvYmplY3Q6IGRvYy5uYW1lLCBvd25lcjogdXNlcklkLCBuYW1lOiBcIm5hbWVcIiwgc3BhY2U6IGRvYy5zcGFjZSwgdHlwZTogXCJ0ZXh0XCIsIHJlcXVpcmVkOiB0cnVlLCBpbmRleDogdHJ1ZSwgc2VhcmNoYWJsZTogdHJ1ZX0pXHJcblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5pbnNlcnQoe25hbWU6IFwiYWxsXCIsIHNwYWNlOiBkb2Muc3BhY2UsIG93bmVyOiB1c2VySWQsIG9iamVjdF9uYW1lOiBkb2MubmFtZSwgc2hhcmVkOiB0cnVlLCBmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIiwgY29sdW1uczogW1wibmFtZVwiXX0pXHJcblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5pbnNlcnQoe25hbWU6IFwicmVjZW50XCIsIHNwYWNlOiBkb2Muc3BhY2UsIG93bmVyOiB1c2VySWQsIG9iamVjdF9uYW1lOiBkb2MubmFtZSwgc2hhcmVkOiB0cnVlLCBmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIiwgY29sdW1uczogW1wibmFtZVwiXX0pXHJcblxyXG5cdFx0XCJiZWZvcmUucmVtb3ZlLnNlcnZlci5vYmplY3RzXCI6XHJcblx0XHRcdG9uOiBcInNlcnZlclwiXHJcblx0XHRcdHdoZW46IFwiYmVmb3JlLnJlbW92ZVwiXHJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxyXG5cclxuXHRcdFx0XHRpZiBkb2MuYXBwX3VuaXF1ZV9pZCAmJiBkb2MuYXBwX3ZlcnNpb25cclxuXHRcdFx0XHRcdHJldHVyblxyXG5cclxuXHRcdFx0XHRvYmplY3RfY29sbGVjdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oZG9jLm5hbWUsIGRvYy5zcGFjZSlcclxuXHJcblx0XHRcdFx0ZG9jdW1lbnRzID0gb2JqZWN0X2NvbGxlY3Rpb25zLmZpbmQoe30se2ZpZWxkczoge19pZDogMX19KVxyXG5cclxuXHRcdFx0XHRpZiBkb2N1bWVudHMuY291bnQoKSA+IDBcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuWvueixoSgje2RvYy5uYW1lfSnkuK3lt7Lnu4/mnInorrDlvZXvvIzor7flhYjliKDpmaTorrDlvZXlkI7vvIwg5YaN5Yig6Zmk5q2k5a+56LGhXCJcclxuXHJcblx0XHRcImFmdGVyLnJlbW92ZS5zZXJ2ZXIub2JqZWN0c1wiOlxyXG5cdFx0XHRvbjogXCJzZXJ2ZXJcIlxyXG5cdFx0XHR3aGVuOiBcImFmdGVyLnJlbW92ZVwiXHJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxyXG5cdFx0XHRcdCPliKDpmaRvYmplY3Qg5ZCO77yM6Ieq5Yqo5Yig6ZmkZmllbGRz44CBYWN0aW9uc+OAgXRyaWdnZXJz44CBcGVybWlzc2lvbl9vYmplY3RzXHJcblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS5kaXJlY3QucmVtb3ZlKHtvYmplY3Q6IGRvYy5uYW1lLCBzcGFjZTogZG9jLnNwYWNlfSlcclxuXHJcblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2FjdGlvbnNcIikuZGlyZWN0LnJlbW92ZSh7b2JqZWN0OiBkb2MubmFtZSwgc3BhY2U6IGRvYy5zcGFjZX0pXHJcblxyXG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF90cmlnZ2Vyc1wiKS5kaXJlY3QucmVtb3ZlKHtvYmplY3Q6IGRvYy5uYW1lLCBzcGFjZTogZG9jLnNwYWNlfSlcclxuXHJcblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmRpcmVjdC5yZW1vdmUoe29iamVjdF9uYW1lOiBkb2MubmFtZSwgc3BhY2U6IGRvYy5zcGFjZX0pXHJcblxyXG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZGlyZWN0LnJlbW92ZSh7b2JqZWN0X25hbWU6IGRvYy5uYW1lLCBzcGFjZTogZG9jLnNwYWNlfSlcclxuXHJcblx0XHRcdFx0I2Ryb3AgY29sbGVjdGlvblxyXG5cdFx0XHRcdGNvbnNvbGUubG9nIFwiZHJvcCBjb2xsZWN0aW9uXCIsIGRvYy5uYW1lXHJcblx0XHRcdFx0dHJ5XHJcbiNcdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKGRvYy5uYW1lKS5fY29sbGVjdGlvbi5kcm9wQ29sbGVjdGlvbigpXHJcblx0XHRcdFx0XHRDcmVhdG9yLkNvbGxlY3Rpb25zW1wiY18je2RvYy5zcGFjZX1fI3tkb2MubmFtZX1cIl0uX2NvbGxlY3Rpb24uZHJvcENvbGxlY3Rpb24oKVxyXG5cdFx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJjXyN7ZG9jLnNwYWNlfV8je2RvYy5uYW1lfVwiLCBcIiN7ZS5zdGFja31cIilcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuWvueixoSgje2RvYy5uYW1lfSnkuI3lrZjlnKjmiJblt7LooqvliKDpmaRcIiIsInZhciBpc1JlcGVhdGVkTmFtZTtcblxuaXNSZXBlYXRlZE5hbWUgPSBmdW5jdGlvbihkb2MpIHtcbiAgdmFyIG90aGVyO1xuICBvdGhlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikuZmluZCh7XG4gICAgX2lkOiB7XG4gICAgICAkbmU6IGRvYy5faWRcbiAgICB9LFxuICAgIHNwYWNlOiBkb2Muc3BhY2UsXG4gICAgbmFtZTogZG9jLm5hbWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgX2lkOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKG90aGVyLmNvdW50KCkgPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5PYmplY3RzLm9iamVjdHMgPSB7XG4gIG5hbWU6IFwib2JqZWN0c1wiLFxuICBpY29uOiBcIm9yZGVyc1wiLFxuICBsYWJlbDogXCLlr7nosaFcIixcbiAgZmllbGRzOiB7XG4gICAgbmFtZToge1xuICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICBzZWFyY2hhYmxlOiB0cnVlLFxuICAgICAgaW5kZXg6IHRydWUsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZVxuICAgIH0sXG4gICAgbGFiZWw6IHtcbiAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICB9LFxuICAgIGljb246IHtcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICBvcHRpb25zRnVuY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3B0aW9ucztcbiAgICAgICAgb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goQ3JlYXRvci5yZXNvdXJjZXMuc2xkc0ljb25zLnN0YW5kYXJkLCBmdW5jdGlvbihzdmcpIHtcbiAgICAgICAgICByZXR1cm4gb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgIHZhbHVlOiBzdmcsXG4gICAgICAgICAgICBsYWJlbDogc3ZnLFxuICAgICAgICAgICAgaWNvbjogc3ZnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICAgIH1cbiAgICB9LFxuICAgIGlzX2VuYWJsZToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0VmFsdWU6IHRydWVcbiAgICB9LFxuICAgIGVuYWJsZV9zZWFyY2g6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfZmlsZXM6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfdGFza3M6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfbm90ZXM6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfZXZlbnRzOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIH0sXG4gICAgZW5hYmxlX2FwaToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0VmFsdWU6IHRydWUsXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LFxuICAgIGVuYWJsZV9zaGFyZToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0VmFsdWU6IGZhbHNlXG4gICAgfSxcbiAgICBlbmFibGVfaW5zdGFuY2VzOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIH0sXG4gICAgZW5hYmxlX2NoYXR0ZXI6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfYXVkaXQ6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfdHJhc2g6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfc3BhY2VfZ2xvYmFsOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHRWYWx1ZTogZmFsc2VcbiAgICB9LFxuICAgIGlzX3ZpZXc6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgICBvbWl0OiB0cnVlXG4gICAgfSxcbiAgICBoaWRkZW46IHtcbiAgICAgIGxhYmVsOiBcIumakOiXj1wiLFxuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBvbWl0OiB0cnVlXG4gICAgfSxcbiAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgbGFiZWw6IFwiRGVzY3JpcHRpb25cIixcbiAgICAgIHR5cGU6IFwidGV4dGFyZWFcIixcbiAgICAgIGlzX3dpZGU6IHRydWVcbiAgICB9LFxuICAgIHNpZGViYXI6IHtcbiAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICBsYWJlbDogXCLlt6bkvqfliJfooahcIixcbiAgICAgIGJsYWNrYm94OiB0cnVlLFxuICAgICAgb21pdDogdHJ1ZSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0sXG4gICAgZmllbGRzOiB7XG4gICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgbGFiZWw6IFwi5a2X5q61XCIsXG4gICAgICBibGFja2JveDogdHJ1ZSxcbiAgICAgIG9taXQ6IHRydWUsXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LFxuICAgIGxpc3Rfdmlld3M6IHtcbiAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICBsYWJlbDogXCLliJfooajop4blm75cIixcbiAgICAgIGJsYWNrYm94OiB0cnVlLFxuICAgICAgb21pdDogdHJ1ZSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0sXG4gICAgYWN0aW9uczoge1xuICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgIGxhYmVsOiBcIuaTjeS9nFwiLFxuICAgICAgYmxhY2tib3g6IHRydWUsXG4gICAgICBvbWl0OiB0cnVlLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSxcbiAgICBwZXJtaXNzaW9uX3NldDoge1xuICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgIGxhYmVsOiBcIuadg+mZkOiuvue9rlwiLFxuICAgICAgYmxhY2tib3g6IHRydWUsXG4gICAgICBvbWl0OiB0cnVlLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSxcbiAgICB0cmlnZ2Vyczoge1xuICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgIGxhYmVsOiBcIuinpuWPkeWZqFwiLFxuICAgICAgYmxhY2tib3g6IHRydWUsXG4gICAgICBvbWl0OiB0cnVlLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSxcbiAgICBjdXN0b206IHtcbiAgICAgIGxhYmVsOiBcIuinhOWImVwiLFxuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBvbWl0OiB0cnVlXG4gICAgfSxcbiAgICBvd25lcjoge1xuICAgICAgdHlwZTogXCJsb29rdXBcIixcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0sXG4gICAgYXBwX3VuaXF1ZV9pZDoge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSxcbiAgICBhcHBfdmVyc2lvbjoge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfVxuICB9LFxuICBsaXN0X3ZpZXdzOiB7XG4gICAgYWxsOiB7XG4gICAgICBjb2x1bW5zOiBbXCJuYW1lXCIsIFwibGFiZWxcIiwgXCJpc19lbmFibGVcIiwgXCJtb2RpZmllZFwiXSxcbiAgICAgIGxhYmVsOiBcIuWFqOmDqFwiLFxuICAgICAgZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcbiAgICB9XG4gIH0sXG4gIHBlcm1pc3Npb25fc2V0OiB7XG4gICAgdXNlcjoge1xuICAgICAgYWxsb3dDcmVhdGU6IGZhbHNlLFxuICAgICAgYWxsb3dEZWxldGU6IGZhbHNlLFxuICAgICAgYWxsb3dFZGl0OiBmYWxzZSxcbiAgICAgIGFsbG93UmVhZDogZmFsc2UsXG4gICAgICBtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZSxcbiAgICAgIHZpZXdBbGxSZWNvcmRzOiBmYWxzZVxuICAgIH0sXG4gICAgYWRtaW46IHtcbiAgICAgIGFsbG93Q3JlYXRlOiB0cnVlLFxuICAgICAgYWxsb3dEZWxldGU6IHRydWUsXG4gICAgICBhbGxvd0VkaXQ6IHRydWUsXG4gICAgICBhbGxvd1JlYWQ6IHRydWUsXG4gICAgICBtb2RpZnlBbGxSZWNvcmRzOiB0cnVlLFxuICAgICAgdmlld0FsbFJlY29yZHM6IHRydWVcbiAgICB9XG4gIH0sXG4gIGFjdGlvbnM6IHtcbiAgICBjb3B5X29kYXRhOiB7XG4gICAgICBsYWJlbDogXCLlpI3liLZPRGF0Yee9keWdgFwiLFxuICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgIG9uOiBcInJlY29yZFwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgaXRlbV9lbGVtZW50KSB7XG4gICAgICAgIHZhciBjbGlwYm9hcmQsIG9fbmFtZSwgcGF0aCwgcmVjb3JkO1xuICAgICAgICByZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdEJ5SWQocmVjb3JkX2lkKTtcbiAgICAgICAgaWYgKChyZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5lbmFibGVfYXBpIDogdm9pZCAwKSB8fCB0cnVlKSB7XG4gICAgICAgICAgb19uYW1lID0gcmVjb3JkICE9IG51bGwgPyByZWNvcmQubmFtZSA6IHZvaWQgMDtcbiAgICAgICAgICBwYXRoID0gU3RlZWRvc09EYXRhLmdldE9EYXRhUGF0aChTZXNzaW9uLmdldChcInNwYWNlSWRcIiksIG9fbmFtZSk7XG4gICAgICAgICAgaXRlbV9lbGVtZW50LmF0dHIoJ2RhdGEtY2xpcGJvYXJkLXRleHQnLCBwYXRoKTtcbiAgICAgICAgICBpZiAoIWl0ZW1fZWxlbWVudC5hdHRyKCdkYXRhLWNsaXBib2FyZC1uZXcnKSkge1xuICAgICAgICAgICAgY2xpcGJvYXJkID0gbmV3IENsaXBib2FyZChpdGVtX2VsZW1lbnRbMF0pO1xuICAgICAgICAgICAgaXRlbV9lbGVtZW50LmF0dHIoJ2RhdGEtY2xpcGJvYXJkLW5ldycsIHRydWUpO1xuICAgICAgICAgICAgY2xpcGJvYXJkLm9uKCdzdWNjZXNzJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICByZXR1cm4gdG9hc3RyLnN1Y2Nlc3MoJ+WkjeWItuaIkOWKnycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjbGlwYm9hcmQub24oJ2Vycm9yJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ+WkjeWItuWksei0pScpO1xuICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImVcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChpdGVtX2VsZW1lbnRbMF0udGFnTmFtZSA9PT0gJ0xJJyB8fCBpdGVtX2VsZW1lbnQuaGFzQ2xhc3MoJ3ZpZXctYWN0aW9uJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1fZWxlbWVudC50cmlnZ2VyKFwiY2xpY2tcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0b2FzdHIuZXJyb3IoJ+WkjeWItuWksei0pTog5pyq5ZCv55SoQVBJJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHRyaWdnZXJzOiB7XG4gICAgXCJiZWZvcmUuaW5zZXJ0LnNlcnZlci5vYmplY3RzXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJiZWZvcmUuaW5zZXJ0XCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICBpZiAoaXNSZXBlYXRlZE5hbWUoZG9jKSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwib2JqZWN05a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCIgKyBkb2MubmFtZSk7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkb2MuY3VzdG9tID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYmVmb3JlLnVwZGF0ZS5zZXJ2ZXIub2JqZWN0c1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYmVmb3JlLnVwZGF0ZVwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciByZWY7XG4gICAgICAgIGlmICgobW9kaWZpZXIgIT0gbnVsbCA/IChyZWYgPSBtb2RpZmllci4kc2V0KSAhPSBudWxsID8gcmVmLm5hbWUgOiB2b2lkIDAgOiB2b2lkIDApICYmIGRvYy5uYW1lICE9PSBtb2RpZmllci4kc2V0Lm5hbWUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIuS4jeiDveS/ruaUuW5hbWVcIik7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5LiN6IO95L+u5pS55a+56LGh5ZCNXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtb2RpZmllci4kc2V0KSB7XG4gICAgICAgICAgbW9kaWZpZXIuJHNldC5jdXN0b20gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtb2RpZmllci4kdW5zZXQgJiYgbW9kaWZpZXIuJHVuc2V0LmN1c3RvbSkge1xuICAgICAgICAgIHJldHVybiBkZWxldGUgbW9kaWZpZXIuJHVuc2V0LmN1c3RvbTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJhZnRlci5pbnNlcnQuc2VydmVyLm9iamVjdHNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImFmdGVyLmluc2VydFwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS5pbnNlcnQoe1xuICAgICAgICAgIG9iamVjdDogZG9jLm5hbWUsXG4gICAgICAgICAgb3duZXI6IHVzZXJJZCxcbiAgICAgICAgICBuYW1lOiBcIm5hbWVcIixcbiAgICAgICAgICBzcGFjZTogZG9jLnNwYWNlLFxuICAgICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIGluZGV4OiB0cnVlLFxuICAgICAgICAgIHNlYXJjaGFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuaW5zZXJ0KHtcbiAgICAgICAgICBuYW1lOiBcImFsbFwiLFxuICAgICAgICAgIHNwYWNlOiBkb2Muc3BhY2UsXG4gICAgICAgICAgb3duZXI6IHVzZXJJZCxcbiAgICAgICAgICBvYmplY3RfbmFtZTogZG9jLm5hbWUsXG4gICAgICAgICAgc2hhcmVkOiB0cnVlLFxuICAgICAgICAgIGZpbHRlcl9zY29wZTogXCJzcGFjZVwiLFxuICAgICAgICAgIGNvbHVtbnM6IFtcIm5hbWVcIl1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmluc2VydCh7XG4gICAgICAgICAgbmFtZTogXCJyZWNlbnRcIixcbiAgICAgICAgICBzcGFjZTogZG9jLnNwYWNlLFxuICAgICAgICAgIG93bmVyOiB1c2VySWQsXG4gICAgICAgICAgb2JqZWN0X25hbWU6IGRvYy5uYW1lLFxuICAgICAgICAgIHNoYXJlZDogdHJ1ZSxcbiAgICAgICAgICBmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIixcbiAgICAgICAgICBjb2x1bW5zOiBbXCJuYW1lXCJdXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJiZWZvcmUucmVtb3ZlLnNlcnZlci5vYmplY3RzXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJiZWZvcmUucmVtb3ZlXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICB2YXIgZG9jdW1lbnRzLCBvYmplY3RfY29sbGVjdGlvbnM7XG4gICAgICAgIGlmIChkb2MuYXBwX3VuaXF1ZV9pZCAmJiBkb2MuYXBwX3ZlcnNpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgb2JqZWN0X2NvbGxlY3Rpb25zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGRvYy5uYW1lLCBkb2Muc3BhY2UpO1xuICAgICAgICBkb2N1bWVudHMgPSBvYmplY3RfY29sbGVjdGlvbnMuZmluZCh7fSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGRvY3VtZW50cy5jb3VudCgpID4gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuWvueixoShcIiArIGRvYy5uYW1lICsgXCIp5Lit5bey57uP5pyJ6K6w5b2V77yM6K+35YWI5Yig6Zmk6K6w5b2V5ZCO77yMIOWGjeWIoOmZpOatpOWvueixoVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJhZnRlci5yZW1vdmUuc2VydmVyLm9iamVjdHNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImFmdGVyLnJlbW92ZVwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgdmFyIGU7XG4gICAgICAgIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9maWVsZHNcIikuZGlyZWN0LnJlbW92ZSh7XG4gICAgICAgICAgb2JqZWN0OiBkb2MubmFtZSxcbiAgICAgICAgICBzcGFjZTogZG9jLnNwYWNlXG4gICAgICAgIH0pO1xuICAgICAgICBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfYWN0aW9uc1wiKS5kaXJlY3QucmVtb3ZlKHtcbiAgICAgICAgICBvYmplY3Q6IGRvYy5uYW1lLFxuICAgICAgICAgIHNwYWNlOiBkb2Muc3BhY2VcbiAgICAgICAgfSk7XG4gICAgICAgIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF90cmlnZ2Vyc1wiKS5kaXJlY3QucmVtb3ZlKHtcbiAgICAgICAgICBvYmplY3Q6IGRvYy5uYW1lLFxuICAgICAgICAgIHNwYWNlOiBkb2Muc3BhY2VcbiAgICAgICAgfSk7XG4gICAgICAgIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5kaXJlY3QucmVtb3ZlKHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogZG9jLm5hbWUsXG4gICAgICAgICAgc3BhY2U6IGRvYy5zcGFjZVxuICAgICAgICB9KTtcbiAgICAgICAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5kaXJlY3QucmVtb3ZlKHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogZG9jLm5hbWUsXG4gICAgICAgICAgc3BhY2U6IGRvYy5zcGFjZVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJkcm9wIGNvbGxlY3Rpb25cIiwgZG9jLm5hbWUpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiY19cIiArIGRvYy5zcGFjZSArIFwiX1wiICsgZG9jLm5hbWVdLl9jb2xsZWN0aW9uLmRyb3BDb2xsZWN0aW9uKCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjX1wiICsgZG9jLnNwYWNlICsgXCJfXCIgKyBkb2MubmFtZSwgXCJcIiArIGUuc3RhY2spO1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuWvueixoShcIiArIGRvYy5uYW1lICsgXCIp5LiN5a2Y5Zyo5oiW5bey6KKr5Yig6ZmkXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIiwiX3N5bmNUb09iamVjdCA9IChkb2MpIC0+XHJcblx0b2JqZWN0X2ZpZWxkcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9maWVsZHNcIikuZmluZCh7c3BhY2U6IGRvYy5zcGFjZSwgb2JqZWN0OiBkb2Mub2JqZWN0fSwge1xyXG5cdFx0ZmllbGRzOiB7XHJcblx0XHRcdGNyZWF0ZWQ6IDAsXHJcblx0XHRcdG1vZGlmaWVkOiAwLFxyXG5cdFx0XHRvd25lcjogMCxcclxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcclxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcclxuXHRcdH1cclxuXHR9KS5mZXRjaCgpXHJcblxyXG5cdGZpZWxkcyA9IHt9XHJcblxyXG5cdHRhYmxlX2ZpZWxkcyA9IHt9XHJcblxyXG5cdF8uZm9yRWFjaCBvYmplY3RfZmllbGRzLCAoZiktPlxyXG5cdFx0aWYgL15bYS16QS1aX11cXHcqKFxcLlxcJFxcLlxcdyspezF9W2EtekEtWjAtOV0qJC8udGVzdChmLm5hbWUpXHJcblx0XHRcdGNmX2FyciA9IGYubmFtZS5zcGxpdChcIi4kLlwiKVxyXG5cdFx0XHRjaGlsZF9maWVsZHMgPSB7fVxyXG5cdFx0XHRjaGlsZF9maWVsZHNbY2ZfYXJyWzFdXSA9IGZcclxuXHRcdFx0aWYgIV8uc2l6ZSh0YWJsZV9maWVsZHNbY2ZfYXJyWzBdXSlcclxuXHRcdFx0XHR0YWJsZV9maWVsZHNbY2ZfYXJyWzBdXSA9IHt9XHJcblx0XHRcdF8uZXh0ZW5kKHRhYmxlX2ZpZWxkc1tjZl9hcnJbMF1dLCBjaGlsZF9maWVsZHMpXHJcblx0XHRlbHNlXHJcblx0XHRcdGZpZWxkc1tmLm5hbWVdID0gZlxyXG5cclxuXHRfLmVhY2ggdGFibGVfZmllbGRzLCAoZiwgayktPlxyXG5cdFx0aWYgZmllbGRzW2tdLnR5cGUgPT0gXCJncmlkXCJcclxuXHRcdFx0aWYgIV8uc2l6ZShmaWVsZHNba10uZmllbGRzKVxyXG5cdFx0XHRcdGZpZWxkc1trXS5maWVsZHMgPSB7fVxyXG5cdFx0XHRfLmV4dGVuZChmaWVsZHNba10uZmllbGRzLCBmKVxyXG5cclxuXHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLnVwZGF0ZSh7c3BhY2U6IGRvYy5zcGFjZSwgbmFtZTogZG9jLm9iamVjdH0sIHtcclxuXHRcdCRzZXQ6XHJcblx0XHRcdGZpZWxkczogZmllbGRzXHJcblx0fSlcclxuXHJcbmlzUmVwZWF0ZWROYW1lID0gKGRvYywgbmFtZSktPlxyXG5cdG90aGVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS5maW5kKHtvYmplY3Q6IGRvYy5vYmplY3QsICBzcGFjZTogZG9jLnNwYWNlLCBfaWQ6IHskbmU6IGRvYy5faWR9LCBuYW1lOiBuYW1lIHx8IGRvYy5uYW1lfSwge2ZpZWxkczp7X2lkOiAxfX0pXHJcblx0aWYgb3RoZXIuY291bnQoKSA+IDBcclxuXHRcdHJldHVybiB0cnVlXHJcblx0cmV0dXJuIGZhbHNlXHJcblxyXG5DcmVhdG9yLk9iamVjdHMub2JqZWN0X2ZpZWxkcyA9XHJcblx0bmFtZTogXCJvYmplY3RfZmllbGRzXCJcclxuXHRpY29uOiBcIm9yZGVyc1wiXHJcblx0ZW5hYmxlX2FwaTogdHJ1ZVxyXG5cdGxhYmVsOlwi5a2X5q61XCJcclxuXHRmaWVsZHM6XHJcblx0XHRuYW1lOlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cdFx0XHRzZWFyY2hhYmxlOiB0cnVlXHJcblx0XHRcdGluZGV4OiB0cnVlXHJcblx0XHRcdHJlcXVpcmVkOiB0cnVlXHJcblx0XHRcdHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguZmllbGRcclxuXHRcdGxhYmVsOlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cdFx0aXNfbmFtZTpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHRcdFx0aGlkZGVuOiB0cnVlXHJcblx0XHRvYmplY3Q6XHJcblx0XHRcdHR5cGU6IFwibWFzdGVyX2RldGFpbFwiXHJcblx0XHRcdHJlZmVyZW5jZV90bzogXCJvYmplY3RzXCJcclxuXHRcdFx0cmVxdWlyZWQ6IHRydWVcclxuXHRcdFx0b3B0aW9uc0Z1bmN0aW9uOiAoKS0+XHJcblx0XHRcdFx0X29wdGlvbnMgPSBbXVxyXG5cdFx0XHRcdF8uZm9yRWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvLCBrKS0+XHJcblx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogby5sYWJlbCwgdmFsdWU6IGssIGljb246IG8uaWNvbn1cclxuXHRcdFx0XHRyZXR1cm4gX29wdGlvbnNcclxuXHRcdHR5cGU6XHJcblx0XHRcdHR5cGU6IFwic2VsZWN0XCJcclxuI1x0XHRcdHJlcXVpcmVkOiB0cnVlXHJcblx0XHRcdG9wdGlvbnM6XHJcblx0XHRcdFx0dGV4dDogXCLmlofmnKxcIixcclxuXHRcdFx0XHR0ZXh0YXJlYTogXCLplb/mlofmnKxcIlxyXG5cdFx0XHRcdGh0bWw6IFwiSHRtbOaWh+acrFwiLFxyXG5cdFx0XHRcdHNlbGVjdDogXCLpgInmi6nmoYZcIixcclxuXHRcdFx0XHRib29sZWFuOiBcIkNoZWNrYm94XCJcclxuXHRcdFx0XHRkYXRlOiBcIuaXpeacn1wiXHJcblx0XHRcdFx0ZGF0ZXRpbWU6IFwi5pel5pyf5pe26Ze0XCJcclxuXHRcdFx0XHRudW1iZXI6IFwi5pWw5YC8XCJcclxuXHRcdFx0XHRjdXJyZW5jeTogXCLph5Hpop1cIlxyXG5cdFx0XHRcdHBhc3N3b3JkOiBcIuWvhueggVwiXHJcblx0XHRcdFx0bG9va3VwOiBcIuebuOWFs+ihqFwiXHJcblx0XHRcdFx0bWFzdGVyX2RldGFpbDogXCLkuLvooagv5a2Q6KGoXCJcclxuXHRcdFx0XHRncmlkOiBcIuihqOagvFwiXHJcblx0XHRcdFx0dXJsOiBcIue9keWdgFwiXHJcblx0XHRcdFx0ZW1haWw6IFwi6YKu5Lu25Zyw5Z2AXCJcclxuXHRcdHNvcnRfbm86XHJcblx0XHRcdGxhYmVsOiBcIuaOkuW6j+WPt1wiXHJcblx0XHRcdHR5cGU6IFwibnVtYmVyXCJcclxuXHRcdFx0ZGVmYXVsdFZhbHVlOiAxMDBcclxuXHRcdFx0c2NhbGU6IDBcclxuXHRcdFx0c29ydGFibGU6IHRydWVcclxuXHJcblx0XHRncm91cDpcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHJcblx0XHRkZWZhdWx0VmFsdWU6XHJcblx0XHRcdHR5cGU6IFwidGV4dFwiXHJcblxyXG5cdFx0YWxsb3dlZFZhbHVlczpcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHRcdFx0bXVsdGlwbGU6IHRydWVcclxuXHJcblx0XHRtdWx0aXBsZTpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHJcblx0XHRyZXF1aXJlZDpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHJcblx0XHRpc193aWRlOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cclxuXHRcdHJlYWRvbmx5OlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cclxuI1x0XHRkaXNhYmxlZDpcclxuI1x0XHRcdHR5cGU6IFwiYm9vbGVhblwiXHJcblx0XHRoaWRkZW46XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXHJcblx0XHQjVE9ETyDlsIbmraTlip/og73lvIDmlL7nu5nnlKjmiLfml7bvvIzpnIDopoHlhbPpl63mraTlsZ7mgKdcclxuXHRcdG9taXQ6XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXHJcblxyXG5cdFx0aW5kZXg6XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXHJcblxyXG5cdFx0c2VhcmNoYWJsZTpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHJcblx0XHRzb3J0YWJsZTpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHJcblx0XHRwcmVjaXNpb246XHJcblx0XHRcdHR5cGU6IFwiY3VycmVuY3lcIlxyXG5cdFx0XHRkZWZhdWx0VmFsdWU6IDE4XHJcblxyXG5cdFx0c2NhbGU6XHJcblx0XHRcdHR5cGU6IFwiY3VycmVuY3lcIlxyXG5cdFx0XHRkZWZhdWx0VmFsdWU6IDJcclxuXHJcblx0XHRyZWZlcmVuY2VfdG86ICPlnKjmnI3liqHnq6/lpITnkIbmraTlrZfmrrXlgLzvvIzlpoLmnpzlsI/kuo4y5Liq77yM5YiZ5a2Y5YKo5Li65a2X56ym5Liy77yM5ZCm5YiZ5a2Y5YKo5Li65pWw57uEXHJcblx0XHRcdHR5cGU6IFwibG9va3VwXCJcclxuXHRcdFx0b3B0aW9uc0Z1bmN0aW9uOiAoKS0+XHJcblx0XHRcdFx0X29wdGlvbnMgPSBbXVxyXG5cdFx0XHRcdF8uZm9yRWFjaCBDcmVhdG9yLk9iamVjdHMsIChvLCBrKS0+XHJcblx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogby5sYWJlbCwgdmFsdWU6IGssIGljb246IG8uaWNvbn1cclxuXHRcdFx0XHRyZXR1cm4gX29wdGlvbnNcclxuI1x0XHRcdG11bHRpcGxlOiB0cnVlICPlhYjkv67mlLnkuLrljZXpgIlcclxuXHJcblx0XHRyb3dzOlxyXG5cdFx0XHR0eXBlOiBcImN1cnJlbmN5XCJcclxuXHJcblx0XHRvcHRpb25zOlxyXG5cdFx0XHR0eXBlOiBcInRleHRhcmVhXCJcclxuXHRcdFx0aXNfd2lkZTogdHJ1ZVxyXG5cclxuXHRcdGRlc2NyaXB0aW9uOlxyXG5cdFx0XHRsYWJlbDogXCJEZXNjcmlwdGlvblwiXHJcblx0XHRcdHR5cGU6IFwidGV4dFwiXHJcblx0XHRcdGlzX3dpZGU6IHRydWVcclxuXHJcblx0bGlzdF92aWV3czpcclxuXHRcdGFsbDpcclxuXHRcdFx0Y29sdW1uczogW1wibmFtZVwiLCBcImxhYmVsXCIsIFwidHlwZVwiLCBcIm9iamVjdFwiLCBcInNvcnRfbm9cIiwgXCJtb2RpZmllZFwiXVxyXG5cdFx0XHRzb3J0OiBbe2ZpZWxkX25hbWU6IFwic29ydF9ub1wiLCBvcmRlcjogXCJhc2NcIn1dXHJcblx0XHRcdGZpbHRlcl9zY29wZTogXCJzcGFjZVwiXHJcblxyXG5cdHBlcm1pc3Npb25fc2V0OlxyXG5cdFx0dXNlcjpcclxuXHRcdFx0YWxsb3dDcmVhdGU6IGZhbHNlXHJcblx0XHRcdGFsbG93RGVsZXRlOiBmYWxzZVxyXG5cdFx0XHRhbGxvd0VkaXQ6IGZhbHNlXHJcblx0XHRcdGFsbG93UmVhZDogZmFsc2VcclxuXHRcdFx0bW9kaWZ5QWxsUmVjb3JkczogZmFsc2VcclxuXHRcdFx0dmlld0FsbFJlY29yZHM6IGZhbHNlXHJcblx0XHRhZG1pbjpcclxuXHRcdFx0YWxsb3dDcmVhdGU6IHRydWVcclxuXHRcdFx0YWxsb3dEZWxldGU6IHRydWVcclxuXHRcdFx0YWxsb3dFZGl0OiB0cnVlXHJcblx0XHRcdGFsbG93UmVhZDogdHJ1ZVxyXG5cdFx0XHRtb2RpZnlBbGxSZWNvcmRzOiB0cnVlXHJcblx0XHRcdHZpZXdBbGxSZWNvcmRzOiB0cnVlXHJcblxyXG5cdHRyaWdnZXJzOlx0XHRcdFx0XHJcblx0XHRcImFmdGVyLmluc2VydC5zZXJ2ZXIub2JqZWN0X2ZpZWxkc1wiOlxyXG5cdFx0XHRvbjogXCJzZXJ2ZXJcIlxyXG5cdFx0XHR3aGVuOiBcImFmdGVyLmluc2VydFwiXHJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxyXG5cdFx0XHRcdF9zeW5jVG9PYmplY3QoZG9jKVxyXG5cdFx0XCJhZnRlci51cGRhdGUuc2VydmVyLm9iamVjdF9maWVsZHNcIjpcclxuXHRcdFx0b246IFwic2VydmVyXCJcclxuXHRcdFx0d2hlbjogXCJhZnRlci51cGRhdGVcIlxyXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MpLT5cclxuXHRcdFx0XHRfc3luY1RvT2JqZWN0KGRvYylcclxuXHRcdFwiYWZ0ZXIucmVtb3ZlLnNlcnZlci5vYmplY3RfZmllbGRzXCI6XHJcblx0XHRcdG9uOiBcInNlcnZlclwiXHJcblx0XHRcdHdoZW46IFwiYWZ0ZXIucmVtb3ZlXCJcclxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jKS0+XHJcblx0XHRcdFx0X3N5bmNUb09iamVjdChkb2MpXHJcblx0XHRcImJlZm9yZS51cGRhdGUuc2VydmVyLm9iamVjdF9maWVsZHNcIjpcclxuXHRcdFx0b246IFwic2VydmVyXCJcclxuXHRcdFx0d2hlbjogXCJiZWZvcmUudXBkYXRlXCJcclxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyktPlxyXG5cdFx0XHRcdGlmIGRvYy5uYW1lID09ICduYW1lJyAmJiBtb2RpZmllcj8uJHNldD8ubmFtZSAmJiBkb2MubmFtZSAhPSBtb2RpZmllci4kc2V0Lm5hbWVcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuS4jeiDveS/ruaUueatpOe6quW9leeahG5hbWXlsZ7mgKdcIlxyXG5cdFx0XHRcdGlmIG1vZGlmaWVyPy4kc2V0Py5uYW1lICYmIGlzUmVwZWF0ZWROYW1lKGRvYywgbW9kaWZpZXIuJHNldC5uYW1lKVxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJ1cGRhdGUgZmllbGRz5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNI3tkb2MubmFtZX1cIilcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuWvueixoeWQjeensOS4jeiDvemHjeWkjVwiXHJcblxyXG5cdFx0XHRcdGlmIG1vZGlmaWVyPy4kc2V0Py5yZWZlcmVuY2VfdG9cclxuXHRcdFx0XHRcdGlmIG1vZGlmaWVyLiRzZXQucmVmZXJlbmNlX3RvLmxlbmd0aCA9PSAxXHJcblx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBtb2RpZmllci4kc2V0LnJlZmVyZW5jZV90b1swXVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gbW9kaWZpZXIuJHNldC5yZWZlcmVuY2VfdG9cclxuXHRcdFx0XHRpZiBtb2RpZmllcj8uJHNldD8uaW5kZXggYW5kIChtb2RpZmllcj8uJHNldD8udHlwZSA9PSAndGV4dGFyZWEnIG9yIG1vZGlmaWVyPy4kc2V0Py50eXBlID09ICdodG1sJylcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuWkmuihjOaWh+acrOS4jeaUr+aMgeW7uueri+e0ouW8lVwiXHJcblx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS5maW5kT25lKHtfaWQ6IGRvYy5vYmplY3R9LCB7ZmllbGRzOiB7bmFtZTogMSwgbGFiZWw6IDF9fSlcclxuXHJcblx0XHRcdFx0aWYgb2JqZWN0XHJcblxyXG5cdFx0XHRcdFx0b2JqZWN0X2RvY3VtZW50cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3QubmFtZSkuZmluZCgpXHJcblx0XHRcdFx0XHRpZiBtb2RpZmllcj8uJHNldD8ucmVmZXJlbmNlX3RvICYmIGRvYy5yZWZlcmVuY2VfdG8gIT0gX3JlZmVyZW5jZV90byAmJiBvYmplY3RfZG9jdW1lbnRzLmNvdW50KCkgPiAwXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuWvueixoSN7b2JqZWN0LmxhYmVsfeS4reW3sue7j+acieiusOW9le+8jOS4jeiDveS/ruaUuXJlZmVyZW5jZV90b+Wtl+autVwiXHJcblxyXG5cdFx0XHRcdFx0aWYgbW9kaWZpZXI/LiR1bnNldD8ucmVmZXJlbmNlX3RvICYmIGRvYy5yZWZlcmVuY2VfdG8gIT0gX3JlZmVyZW5jZV90byAmJiBvYmplY3RfZG9jdW1lbnRzLmNvdW50KCkgPiAwXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuWvueixoSN7b2JqZWN0LmxhYmVsfeS4reW3sue7j+acieiusOW9le+8jOS4jeiDveS/ruaUuXJlZmVyZW5jZV90b+Wtl+autVwiXHJcbiNcdFx0XHRcdFx0aWYgbW9kaWZpZXI/LiRzZXQ/LnJlZmVyZW5jZV90b1xyXG4jXHRcdFx0XHRcdFx0aWYgbW9kaWZpZXIuJHNldC5yZWZlcmVuY2VfdG8ubGVuZ3RoID09IDFcclxuI1x0XHRcdFx0XHRcdFx0bW9kaWZpZXIuJHNldC5yZWZlcmVuY2VfdG8gPSBtb2RpZmllci4kc2V0LnJlZmVyZW5jZV90b1swXVxyXG5cclxuXHRcdFwiYmVmb3JlLmluc2VydC5zZXJ2ZXIub2JqZWN0X2ZpZWxkc1wiOlxyXG5cdFx0XHRvbjogXCJzZXJ2ZXJcIlxyXG5cdFx0XHR3aGVuOiBcImJlZm9yZS5pbnNlcnRcIlxyXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MpLT5cclxuXHJcbiNcdFx0XHRcdGlmIGRvYy5yZWZlcmVuY2VfdG8/Lmxlbmd0aCA9PSAxXHJcbiNcdFx0XHRcdFx0ZG9jLnJlZmVyZW5jZV90byA9IGRvYy5yZWZlcmVuY2VfdG9bMF1cclxuXHJcblx0XHRcdFx0aWYgaXNSZXBlYXRlZE5hbWUoZG9jKVxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJpbnNlcnQgZmllbGRz5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNI3tkb2MubmFtZX1cIilcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuWvueixoeWQjeensOS4jeiDvemHjeWkjVwiXHJcblx0XHRcdFx0aWYgZG9jPy5pbmRleCBhbmQgKGRvYz8udHlwZSA9PSAndGV4dGFyZWEnIG9yIGRvYz8udHlwZSA9PSAnaHRtbCcpXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwn5aSa6KGM5paH5pys5LiN5pSv5oyB5bu656uL57Si5byVJ1xyXG5cdFx0XCJiZWZvcmUucmVtb3ZlLnNlcnZlci5vYmplY3RfZmllbGRzXCI6XHJcblx0XHRcdG9uOiBcInNlcnZlclwiXHJcblx0XHRcdHdoZW46IFwiYmVmb3JlLnJlbW92ZVwiXHJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxyXG5cdFx0XHRcdGlmIGRvYy5uYW1lID09IFwibmFtZVwiXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCLkuI3og73liKDpmaTmraTnuqrlvZVcIlxyXG5cclxuXHJcbiIsInZhciBfc3luY1RvT2JqZWN0LCBpc1JlcGVhdGVkTmFtZTtcblxuX3N5bmNUb09iamVjdCA9IGZ1bmN0aW9uKGRvYykge1xuICB2YXIgZmllbGRzLCBvYmplY3RfZmllbGRzLCB0YWJsZV9maWVsZHM7XG4gIG9iamVjdF9maWVsZHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfZmllbGRzXCIpLmZpbmQoe1xuICAgIHNwYWNlOiBkb2Muc3BhY2UsXG4gICAgb2JqZWN0OiBkb2Mub2JqZWN0XG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIG93bmVyOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBmaWVsZHMgPSB7fTtcbiAgdGFibGVfZmllbGRzID0ge307XG4gIF8uZm9yRWFjaChvYmplY3RfZmllbGRzLCBmdW5jdGlvbihmKSB7XG4gICAgdmFyIGNmX2FyciwgY2hpbGRfZmllbGRzO1xuICAgIGlmICgvXlthLXpBLVpfXVxcdyooXFwuXFwkXFwuXFx3Kyl7MX1bYS16QS1aMC05XSokLy50ZXN0KGYubmFtZSkpIHtcbiAgICAgIGNmX2FyciA9IGYubmFtZS5zcGxpdChcIi4kLlwiKTtcbiAgICAgIGNoaWxkX2ZpZWxkcyA9IHt9O1xuICAgICAgY2hpbGRfZmllbGRzW2NmX2FyclsxXV0gPSBmO1xuICAgICAgaWYgKCFfLnNpemUodGFibGVfZmllbGRzW2NmX2FyclswXV0pKSB7XG4gICAgICAgIHRhYmxlX2ZpZWxkc1tjZl9hcnJbMF1dID0ge307XG4gICAgICB9XG4gICAgICByZXR1cm4gXy5leHRlbmQodGFibGVfZmllbGRzW2NmX2FyclswXV0sIGNoaWxkX2ZpZWxkcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaWVsZHNbZi5uYW1lXSA9IGY7XG4gICAgfVxuICB9KTtcbiAgXy5lYWNoKHRhYmxlX2ZpZWxkcywgZnVuY3Rpb24oZiwgaykge1xuICAgIGlmIChmaWVsZHNba10udHlwZSA9PT0gXCJncmlkXCIpIHtcbiAgICAgIGlmICghXy5zaXplKGZpZWxkc1trXS5maWVsZHMpKSB7XG4gICAgICAgIGZpZWxkc1trXS5maWVsZHMgPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfLmV4dGVuZChmaWVsZHNba10uZmllbGRzLCBmKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS51cGRhdGUoe1xuICAgIHNwYWNlOiBkb2Muc3BhY2UsXG4gICAgbmFtZTogZG9jLm9iamVjdFxuICB9LCB7XG4gICAgJHNldDoge1xuICAgICAgZmllbGRzOiBmaWVsZHNcbiAgICB9XG4gIH0pO1xufTtcblxuaXNSZXBlYXRlZE5hbWUgPSBmdW5jdGlvbihkb2MsIG5hbWUpIHtcbiAgdmFyIG90aGVyO1xuICBvdGhlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9maWVsZHNcIikuZmluZCh7XG4gICAgb2JqZWN0OiBkb2Mub2JqZWN0LFxuICAgIHNwYWNlOiBkb2Muc3BhY2UsXG4gICAgX2lkOiB7XG4gICAgICAkbmU6IGRvYy5faWRcbiAgICB9LFxuICAgIG5hbWU6IG5hbWUgfHwgZG9jLm5hbWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgX2lkOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKG90aGVyLmNvdW50KCkgPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5PYmplY3RzLm9iamVjdF9maWVsZHMgPSB7XG4gIG5hbWU6IFwib2JqZWN0X2ZpZWxkc1wiLFxuICBpY29uOiBcIm9yZGVyc1wiLFxuICBlbmFibGVfYXBpOiB0cnVlLFxuICBsYWJlbDogXCLlrZfmrrVcIixcbiAgZmllbGRzOiB7XG4gICAgbmFtZToge1xuICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICBzZWFyY2hhYmxlOiB0cnVlLFxuICAgICAgaW5kZXg6IHRydWUsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguZmllbGRcbiAgICB9LFxuICAgIGxhYmVsOiB7XG4gICAgICB0eXBlOiBcInRleHRcIlxuICAgIH0sXG4gICAgaXNfbmFtZToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LFxuICAgIG9iamVjdDoge1xuICAgICAgdHlwZTogXCJtYXN0ZXJfZGV0YWlsXCIsXG4gICAgICByZWZlcmVuY2VfdG86IFwib2JqZWN0c1wiLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBvcHRpb25zRnVuY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX29wdGlvbnM7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKG8sIGspIHtcbiAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICBsYWJlbDogby5sYWJlbCxcbiAgICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgICAgaWNvbjogby5pY29uXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gX29wdGlvbnM7XG4gICAgICB9XG4gICAgfSxcbiAgICB0eXBlOiB7XG4gICAgICB0eXBlOiBcInNlbGVjdFwiLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICB0ZXh0OiBcIuaWh+acrFwiLFxuICAgICAgICB0ZXh0YXJlYTogXCLplb/mlofmnKxcIixcbiAgICAgICAgaHRtbDogXCJIdG1s5paH5pysXCIsXG4gICAgICAgIHNlbGVjdDogXCLpgInmi6nmoYZcIixcbiAgICAgICAgYm9vbGVhbjogXCJDaGVja2JveFwiLFxuICAgICAgICBkYXRlOiBcIuaXpeacn1wiLFxuICAgICAgICBkYXRldGltZTogXCLml6XmnJ/ml7bpl7RcIixcbiAgICAgICAgbnVtYmVyOiBcIuaVsOWAvFwiLFxuICAgICAgICBjdXJyZW5jeTogXCLph5Hpop1cIixcbiAgICAgICAgcGFzc3dvcmQ6IFwi5a+G56CBXCIsXG4gICAgICAgIGxvb2t1cDogXCLnm7jlhbPooahcIixcbiAgICAgICAgbWFzdGVyX2RldGFpbDogXCLkuLvooagv5a2Q6KGoXCIsXG4gICAgICAgIGdyaWQ6IFwi6KGo5qC8XCIsXG4gICAgICAgIHVybDogXCLnvZHlnYBcIixcbiAgICAgICAgZW1haWw6IFwi6YKu5Lu25Zyw5Z2AXCJcbiAgICAgIH1cbiAgICB9LFxuICAgIHNvcnRfbm86IHtcbiAgICAgIGxhYmVsOiBcIuaOkuW6j+WPt1wiLFxuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHRWYWx1ZTogMTAwLFxuICAgICAgc2NhbGU6IDAsXG4gICAgICBzb3J0YWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgZ3JvdXA6IHtcbiAgICAgIHR5cGU6IFwidGV4dFwiXG4gICAgfSxcbiAgICBkZWZhdWx0VmFsdWU6IHtcbiAgICAgIHR5cGU6IFwidGV4dFwiXG4gICAgfSxcbiAgICBhbGxvd2VkVmFsdWVzOiB7XG4gICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgIG11bHRpcGxlOiB0cnVlXG4gICAgfSxcbiAgICBtdWx0aXBsZToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICB9LFxuICAgIHJlcXVpcmVkOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIH0sXG4gICAgaXNfd2lkZToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICB9LFxuICAgIHJlYWRvbmx5OiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIH0sXG4gICAgaGlkZGVuOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIH0sXG4gICAgb21pdDoge1xuICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICB9LFxuICAgIGluZGV4OiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIH0sXG4gICAgc2VhcmNoYWJsZToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICB9LFxuICAgIHNvcnRhYmxlOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIH0sXG4gICAgcHJlY2lzaW9uOiB7XG4gICAgICB0eXBlOiBcImN1cnJlbmN5XCIsXG4gICAgICBkZWZhdWx0VmFsdWU6IDE4XG4gICAgfSxcbiAgICBzY2FsZToge1xuICAgICAgdHlwZTogXCJjdXJyZW5jeVwiLFxuICAgICAgZGVmYXVsdFZhbHVlOiAyXG4gICAgfSxcbiAgICByZWZlcmVuY2VfdG86IHtcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICBvcHRpb25zRnVuY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX29wdGlvbnM7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKG8sIGspIHtcbiAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICBsYWJlbDogby5sYWJlbCxcbiAgICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgICAgaWNvbjogby5pY29uXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gX29wdGlvbnM7XG4gICAgICB9XG4gICAgfSxcbiAgICByb3dzOiB7XG4gICAgICB0eXBlOiBcImN1cnJlbmN5XCJcbiAgICB9LFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHR5cGU6IFwidGV4dGFyZWFcIixcbiAgICAgIGlzX3dpZGU6IHRydWVcbiAgICB9LFxuICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICBsYWJlbDogXCJEZXNjcmlwdGlvblwiLFxuICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICBpc193aWRlOiB0cnVlXG4gICAgfVxuICB9LFxuICBsaXN0X3ZpZXdzOiB7XG4gICAgYWxsOiB7XG4gICAgICBjb2x1bW5zOiBbXCJuYW1lXCIsIFwibGFiZWxcIiwgXCJ0eXBlXCIsIFwib2JqZWN0XCIsIFwic29ydF9ub1wiLCBcIm1vZGlmaWVkXCJdLFxuICAgICAgc29ydDogW1xuICAgICAgICB7XG4gICAgICAgICAgZmllbGRfbmFtZTogXCJzb3J0X25vXCIsXG4gICAgICAgICAgb3JkZXI6IFwiYXNjXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZpbHRlcl9zY29wZTogXCJzcGFjZVwiXG4gICAgfVxuICB9LFxuICBwZXJtaXNzaW9uX3NldDoge1xuICAgIHVzZXI6IHtcbiAgICAgIGFsbG93Q3JlYXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RGVsZXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RWRpdDogZmFsc2UsXG4gICAgICBhbGxvd1JlYWQ6IGZhbHNlLFxuICAgICAgbW9kaWZ5QWxsUmVjb3JkczogZmFsc2UsXG4gICAgICB2aWV3QWxsUmVjb3JkczogZmFsc2VcbiAgICB9LFxuICAgIGFkbWluOiB7XG4gICAgICBhbGxvd0NyZWF0ZTogdHJ1ZSxcbiAgICAgIGFsbG93RGVsZXRlOiB0cnVlLFxuICAgICAgYWxsb3dFZGl0OiB0cnVlLFxuICAgICAgYWxsb3dSZWFkOiB0cnVlLFxuICAgICAgbW9kaWZ5QWxsUmVjb3JkczogdHJ1ZSxcbiAgICAgIHZpZXdBbGxSZWNvcmRzOiB0cnVlXG4gICAgfVxuICB9LFxuICB0cmlnZ2Vyczoge1xuICAgIFwiYWZ0ZXIuaW5zZXJ0LnNlcnZlci5vYmplY3RfZmllbGRzXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJhZnRlci5pbnNlcnRcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICAgIHJldHVybiBfc3luY1RvT2JqZWN0KGRvYyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcImFmdGVyLnVwZGF0ZS5zZXJ2ZXIub2JqZWN0X2ZpZWxkc1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYWZ0ZXIudXBkYXRlXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICByZXR1cm4gX3N5bmNUb09iamVjdChkb2MpO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJhZnRlci5yZW1vdmUuc2VydmVyLm9iamVjdF9maWVsZHNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImFmdGVyLnJlbW92ZVwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgcmV0dXJuIF9zeW5jVG9PYmplY3QoZG9jKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYmVmb3JlLnVwZGF0ZS5zZXJ2ZXIub2JqZWN0X2ZpZWxkc1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYmVmb3JlLnVwZGF0ZVwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBfcmVmZXJlbmNlX3RvLCBvYmplY3QsIG9iamVjdF9kb2N1bWVudHMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVmNSwgcmVmNiwgcmVmNztcbiAgICAgICAgaWYgKGRvYy5uYW1lID09PSAnbmFtZScgJiYgKG1vZGlmaWVyICE9IG51bGwgPyAocmVmID0gbW9kaWZpZXIuJHNldCkgIT0gbnVsbCA/IHJlZi5uYW1lIDogdm9pZCAwIDogdm9pZCAwKSAmJiBkb2MubmFtZSAhPT0gbW9kaWZpZXIuJHNldC5uYW1lKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5LiN6IO95L+u5pS55q2k57qq5b2V55qEbmFtZeWxnuaAp1wiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKG1vZGlmaWVyICE9IG51bGwgPyAocmVmMSA9IG1vZGlmaWVyLiRzZXQpICE9IG51bGwgPyByZWYxLm5hbWUgOiB2b2lkIDAgOiB2b2lkIDApICYmIGlzUmVwZWF0ZWROYW1lKGRvYywgbW9kaWZpZXIuJHNldC5uYW1lKSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwidXBkYXRlIGZpZWxkc+WvueixoeWQjeensOS4jeiDvemHjeWkjVwiICsgZG9jLm5hbWUpO1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuWvueixoeWQjeensOS4jeiDvemHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobW9kaWZpZXIgIT0gbnVsbCA/IChyZWYyID0gbW9kaWZpZXIuJHNldCkgIT0gbnVsbCA/IHJlZjIucmVmZXJlbmNlX3RvIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgaWYgKG1vZGlmaWVyLiRzZXQucmVmZXJlbmNlX3RvLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IG1vZGlmaWVyLiRzZXQucmVmZXJlbmNlX3RvWzBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gbW9kaWZpZXIuJHNldC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICgobW9kaWZpZXIgIT0gbnVsbCA/IChyZWYzID0gbW9kaWZpZXIuJHNldCkgIT0gbnVsbCA/IHJlZjMuaW5kZXggOiB2b2lkIDAgOiB2b2lkIDApICYmICgobW9kaWZpZXIgIT0gbnVsbCA/IChyZWY0ID0gbW9kaWZpZXIuJHNldCkgIT0gbnVsbCA/IHJlZjQudHlwZSA6IHZvaWQgMCA6IHZvaWQgMCkgPT09ICd0ZXh0YXJlYScgfHwgKG1vZGlmaWVyICE9IG51bGwgPyAocmVmNSA9IG1vZGlmaWVyLiRzZXQpICE9IG51bGwgPyByZWY1LnR5cGUgOiB2b2lkIDAgOiB2b2lkIDApID09PSAnaHRtbCcpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5aSa6KGM5paH5pys5LiN5pSv5oyB5bu656uL57Si5byVXCIpO1xuICAgICAgICB9XG4gICAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikuZmluZE9uZSh7XG4gICAgICAgICAgX2lkOiBkb2Mub2JqZWN0XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgICBsYWJlbDogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChvYmplY3QpIHtcbiAgICAgICAgICBvYmplY3RfZG9jdW1lbnRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdC5uYW1lKS5maW5kKCk7XG4gICAgICAgICAgaWYgKChtb2RpZmllciAhPSBudWxsID8gKHJlZjYgPSBtb2RpZmllci4kc2V0KSAhPSBudWxsID8gcmVmNi5yZWZlcmVuY2VfdG8gOiB2b2lkIDAgOiB2b2lkIDApICYmIGRvYy5yZWZlcmVuY2VfdG8gIT09IF9yZWZlcmVuY2VfdG8gJiYgb2JqZWN0X2RvY3VtZW50cy5jb3VudCgpID4gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5a+56LGhXCIgKyBvYmplY3QubGFiZWwgKyBcIuS4reW3sue7j+acieiusOW9le+8jOS4jeiDveS/ruaUuXJlZmVyZW5jZV90b+Wtl+autVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKChtb2RpZmllciAhPSBudWxsID8gKHJlZjcgPSBtb2RpZmllci4kdW5zZXQpICE9IG51bGwgPyByZWY3LnJlZmVyZW5jZV90byA6IHZvaWQgMCA6IHZvaWQgMCkgJiYgZG9jLnJlZmVyZW5jZV90byAhPT0gX3JlZmVyZW5jZV90byAmJiBvYmplY3RfZG9jdW1lbnRzLmNvdW50KCkgPiAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLlr7nosaFcIiArIG9iamVjdC5sYWJlbCArIFwi5Lit5bey57uP5pyJ6K6w5b2V77yM5LiN6IO95L+u5pS5cmVmZXJlbmNlX3Rv5a2X5q61XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJiZWZvcmUuaW5zZXJ0LnNlcnZlci5vYmplY3RfZmllbGRzXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJiZWZvcmUuaW5zZXJ0XCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICBpZiAoaXNSZXBlYXRlZE5hbWUoZG9jKSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5zZXJ0IGZpZWxkc+WvueixoeWQjeensOS4jeiDvemHjeWkjVwiICsgZG9jLm5hbWUpO1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuWvueixoeWQjeensOS4jeiDvemHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKGRvYyAhPSBudWxsID8gZG9jLmluZGV4IDogdm9pZCAwKSAmJiAoKGRvYyAhPSBudWxsID8gZG9jLnR5cGUgOiB2b2lkIDApID09PSAndGV4dGFyZWEnIHx8IChkb2MgIT0gbnVsbCA/IGRvYy50eXBlIDogdm9pZCAwKSA9PT0gJ2h0bWwnKSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCAn5aSa6KGM5paH5pys5LiN5pSv5oyB5bu656uL57Si5byVJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYmVmb3JlLnJlbW92ZS5zZXJ2ZXIub2JqZWN0X2ZpZWxkc1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYmVmb3JlLnJlbW92ZVwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgaWYgKGRvYy5uYW1lID09PSBcIm5hbWVcIikge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuS4jeiDveWIoOmZpOatpOe6quW9lVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiIsIl9zeW5jVG9PYmplY3QgPSAoZG9jKSAtPlxyXG5cdG9iamVjdF90cmlnZ2VycyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF90cmlnZ2Vyc1wiKS5maW5kKHtzcGFjZTogZG9jLnNwYWNlLCBvYmplY3Q6IGRvYy5vYmplY3QsIGlzX2VuYWJsZTogdHJ1ZX0sIHtcclxuXHRcdGZpZWxkczoge1xyXG5cdFx0XHRjcmVhdGVkOiAwLFxyXG5cdFx0XHRtb2RpZmllZDogMCxcclxuXHRcdFx0b3duZXI6IDAsXHJcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXHJcblx0XHRcdG1vZGlmaWVkX2J5OiAwXHJcblx0XHR9XHJcblx0fSkuZmV0Y2goKVxyXG5cclxuXHR0cmlnZ2VycyA9IHt9XHJcblxyXG5cdF8uZm9yRWFjaCBvYmplY3RfdHJpZ2dlcnMsIChmKS0+XHJcblx0XHR0cmlnZ2Vyc1tmLm5hbWVdID0gZlxyXG5cclxuXHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLnVwZGF0ZSh7c3BhY2U6IGRvYy5zcGFjZSwgbmFtZTogZG9jLm9iamVjdH0sIHtcclxuXHRcdCRzZXQ6XHJcblx0XHRcdHRyaWdnZXJzOiB0cmlnZ2Vyc1xyXG5cdH0pXHJcblxyXG5pc1JlcGVhdGVkTmFtZSA9IChkb2MsIG5hbWUpLT5cclxuXHRvdGhlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF90cmlnZ2Vyc1wiKS5maW5kKHtvYmplY3Q6IGRvYy5vYmplY3QsICBzcGFjZTogZG9jLnNwYWNlLCBfaWQ6IHskbmU6IGRvYy5faWR9LCBuYW1lOiBuYW1lIHx8IGRvYy5uYW1lfSwge2ZpZWxkczp7X2lkOiAxfX0pXHJcblx0aWYgb3RoZXIuY291bnQoKSA+IDBcclxuXHRcdHJldHVybiB0cnVlXHJcblx0cmV0dXJuIGZhbHNlXHJcblxyXG5jaGVjayA9ICh1c2VySWQsIGRvYyktPlxyXG5cdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKHVzZXJJZCwgZG9jLnNwYWNlKVxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5Y+q5pyJ5bel5L2c5Y67566h55CG5ZGY5omN6IO96YWN572u6Kem5Y+R5ZmoXCJcclxuXHJcblx0I1RPRE8g5qCh6aqM5YWz6ZSu5a2X77yacmVtb3Zl44CBIGRyb3DjgIFkZWxldGXjgIFkYuOAgWNvbGxlY3Rpb27jgIFldmFs562J77yM54S25ZCO5Y+W5raIIOS8geS4mueJiOeJiOmZkOWItlxyXG5cdGlmIGRvYy5vbiA9PSAnc2VydmVyJyAmJiAhU3RlZWRvcy5pc0xlZ2FsVmVyc2lvbihkb2Muc3BhY2UsXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIpXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCLlj6rmnInkvIHkuJrniYjmlK/mjIHphY3nva7mnI3liqHnq6/nmoTop6blj5HlmahcIlxyXG5cclxuQ3JlYXRvci5PYmplY3RzLm9iamVjdF90cmlnZ2VycyA9XHJcblx0bmFtZTogXCJvYmplY3RfdHJpZ2dlcnNcIlxyXG5cdGljb246IFwiYXNzZXRfcmVsYXRpb25zaGlwXCJcclxuXHRsYWJlbDpcIuinpuWPkeWZqFwiXHJcblx0ZmllbGRzOlxyXG5cdFx0bmFtZTpcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHRcdFx0c2VhcmNoYWJsZTogdHJ1ZVxyXG5cdFx0XHRpbmRleDogdHJ1ZVxyXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZVxyXG5cdFx0XHRyZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGVcclxuXHRcdGxhYmVsOlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cdFx0b2JqZWN0OlxyXG5cdFx0XHR0eXBlOiBcIm1hc3Rlcl9kZXRhaWxcIlxyXG5cdFx0XHRyZWZlcmVuY2VfdG86IFwib2JqZWN0c1wiXHJcblx0XHRcdHJlcXVpcmVkOiB0cnVlXHJcblx0XHRcdG9wdGlvbnNGdW5jdGlvbjogKCktPlxyXG5cdFx0XHRcdF9vcHRpb25zID0gW11cclxuXHRcdFx0XHRfLmZvckVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAobywgayktPlxyXG5cdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IG8ubGFiZWwsIHZhbHVlOiBrLCBpY29uOiBvLmljb259XHJcblx0XHRcdFx0cmV0dXJuIF9vcHRpb25zXHJcblx0XHRvbjpcclxuXHRcdFx0dHlwZTogXCJsb29rdXBcIlxyXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZVxyXG5cdFx0XHRvcHRpb25zRnVuY3Rpb246ICgpLT5cclxuXHRcdFx0XHRyZXR1cm4gW3tsYWJlbDogXCLlrqLmiLfnq69cIiwgdmFsdWU6IFwiY2xpZW50XCIsIGljb246IFwiYWRkcmVzc1wifSwge2xhYmVsOiBcIuacjeWKoeerr1wiLCB2YWx1ZTogXCJzZXJ2ZXJcIiwgaWNvbjogXCJhZGRyZXNzXCJ9XVxyXG5cdFx0d2hlbjpcclxuXHRcdFx0dHlwZTogXCJsb29rdXBcIlxyXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZVxyXG5cdFx0XHRvcHRpb25zRnVuY3Rpb246ICgpLT5cclxuXHRcdFx0XHRbXHJcblx0XHRcdFx0XHR7bGFiZWw6IFwi5paw5aKe6K6w5b2V5LmL5YmNXCIsIHZhbHVlOiBcImJlZm9yZS5pbnNlcnRcIiwgaWNvbjogXCJhc3NldF9yZWxhdGlvbnNoaXBcIn1cclxuXHRcdFx0XHRcdHtsYWJlbDogXCLmlrDlop7orrDlvZXkuYvlkI5cIiwgdmFsdWU6IFwiYWZ0ZXIuaW5zZXJ0XCIsIGljb246IFwiYXNzZXRfcmVsYXRpb25zaGlwXCJ9XHJcblx0XHRcdFx0XHR7bGFiZWw6IFwi5L+u5pS56K6w5b2V5LmL5YmNXCIsIHZhbHVlOiBcImJlZm9yZS51cGRhdGVcIiwgaWNvbjogXCJhc3NldF9yZWxhdGlvbnNoaXBcIn1cclxuXHRcdFx0XHRcdHtsYWJlbDogXCLkv67mlLnorrDlvZXkuYvlkI5cIiwgdmFsdWU6IFwiYWZ0ZXIudXBkYXRlXCIsIGljb246IFwiYXNzZXRfcmVsYXRpb25zaGlwXCJ9XHJcblx0XHRcdFx0XHR7bGFiZWw6IFwi5Yig6Zmk6K6w5b2V5LmL5YmNXCIsIHZhbHVlOiBcImJlZm9yZS5yZW1vdmVcIiwgaWNvbjogXCJhc3NldF9yZWxhdGlvbnNoaXBcIn1cclxuXHRcdFx0XHRcdHtsYWJlbDogXCLliKDpmaTorrDlvZXkuYvlkI5cIiwgdmFsdWU6IFwiYWZ0ZXIucmVtb3ZlXCIsIGljb246IFwiYXNzZXRfcmVsYXRpb25zaGlwXCJ9XHJcblx0XHRcdFx0XVxyXG5cdFx0aXNfZW5hYmxlOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0dG9kbzpcclxuXHRcdFx0dHlwZTogXCJ0ZXh0YXJlYVwiXHJcblx0XHRcdHJlcXVpcmVkOiB0cnVlXHJcblx0XHRcdGlzX3dpZGU6dHJ1ZVxyXG5cclxuXHRsaXN0X3ZpZXdzOlxyXG5cdFx0YWxsOlxyXG5cdFx0XHRjb2x1bW5zOiBbXCJuYW1lXCIsIFwibGFiZWxcIiwgXCJvYmplY3RcIiwgXCJvblwiLCBcIndoZW5cIiwgXCJpc19lbmFibGVcIl1cclxuXHRcdFx0ZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcclxuXHJcblx0cGVybWlzc2lvbl9zZXQ6XHJcblx0XHR1c2VyOlxyXG5cdFx0XHRhbGxvd0NyZWF0ZTogZmFsc2VcclxuXHRcdFx0YWxsb3dEZWxldGU6IGZhbHNlXHJcblx0XHRcdGFsbG93RWRpdDogZmFsc2VcclxuXHRcdFx0YWxsb3dSZWFkOiBmYWxzZVxyXG5cdFx0XHRtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZVxyXG5cdFx0XHR2aWV3QWxsUmVjb3JkczogZmFsc2VcclxuXHRcdGFkbWluOlxyXG5cdFx0XHRhbGxvd0NyZWF0ZTogdHJ1ZVxyXG5cdFx0XHRhbGxvd0RlbGV0ZTogdHJ1ZVxyXG5cdFx0XHRhbGxvd0VkaXQ6IHRydWVcclxuXHRcdFx0YWxsb3dSZWFkOiB0cnVlXHJcblx0XHRcdG1vZGlmeUFsbFJlY29yZHM6IHRydWVcclxuXHRcdFx0dmlld0FsbFJlY29yZHM6IHRydWVcclxuXHJcblx0dHJpZ2dlcnM6XHJcblx0XHRcImFmdGVyLmluc2VydC5zZXJ2ZXIub2JqZWN0X3RyaWdnZXJzXCI6XHJcblx0XHRcdG9uOiBcInNlcnZlclwiXHJcblx0XHRcdHdoZW46IFwiYWZ0ZXIuaW5zZXJ0XCJcclxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jKS0+XHJcblx0XHRcdFx0X3N5bmNUb09iamVjdChkb2MpXHJcblx0XHRcImFmdGVyLnVwZGF0ZS5zZXJ2ZXIub2JqZWN0X3RyaWdnZXJzXCI6XHJcblx0XHRcdG9uOiBcInNlcnZlclwiXHJcblx0XHRcdHdoZW46IFwiYWZ0ZXIudXBkYXRlXCJcclxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jKS0+XHJcblx0XHRcdFx0X3N5bmNUb09iamVjdChkb2MpXHJcblx0XHRcImFmdGVyLnJlbW92ZS5zZXJ2ZXIub2JqZWN0X3RyaWdnZXJzXCI6XHJcblx0XHRcdG9uOiBcInNlcnZlclwiXHJcblx0XHRcdHdoZW46IFwiYWZ0ZXIucmVtb3ZlXCJcclxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jKS0+XHJcblx0XHRcdFx0X3N5bmNUb09iamVjdChkb2MpXHJcblxyXG5cdFx0XCJiZWZvcmUuZGVsZXRlLnNlcnZlci5vYmplY3RfdHJpZ2dlcnNcIjpcclxuXHRcdFx0b246IFwic2VydmVyXCJcclxuXHRcdFx0d2hlbjogXCJiZWZvcmUucmVtb3ZlXCJcclxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jKS0+XHJcblx0XHRcdFx0Y2hlY2sodXNlcklkLCBkb2MpXHJcblxyXG5cdFx0XCJiZWZvcmUudXBkYXRlLnNlcnZlci5vYmplY3RfdHJpZ2dlcnNcIjpcclxuXHRcdFx0b246IFwic2VydmVyXCJcclxuXHRcdFx0d2hlbjogXCJiZWZvcmUudXBkYXRlXCJcclxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyktPlxyXG5cdFx0XHRcdGNoZWNrKHVzZXJJZCwgZG9jKVxyXG5cdFx0XHRcdGlmIG1vZGlmaWVyPy4kc2V0Py5uYW1lICYmIGlzUmVwZWF0ZWROYW1lKGRvYywgbW9kaWZpZXIuJHNldC5uYW1lKVxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJ1cGRhdGUgdHJpZ2dlcnPlr7nosaHlkI3np7DkuI3og73ph43lpI0je2RvYy5uYW1lfVwiKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNI3tkb2MubmFtZX1cIlxyXG5cclxuXHRcdFwiYmVmb3JlLmluc2VydC5zZXJ2ZXIub2JqZWN0X3RyaWdnZXJzXCI6XHJcblx0XHRcdG9uOiBcInNlcnZlclwiXHJcblx0XHRcdHdoZW46IFwiYmVmb3JlLmluc2VydFwiXHJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxyXG5cdFx0XHRcdGNoZWNrKHVzZXJJZCwgZG9jKVxyXG5cdFx0XHRcdGlmIGlzUmVwZWF0ZWROYW1lKGRvYylcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiaW5zZXJ0IHRyaWdnZXJz5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNI3tkb2MubmFtZX1cIilcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuWvueixoeWQjeensOS4jeiDvemHjeWkjVwiIiwidmFyIF9zeW5jVG9PYmplY3QsIGNoZWNrLCBpc1JlcGVhdGVkTmFtZTtcblxuX3N5bmNUb09iamVjdCA9IGZ1bmN0aW9uKGRvYykge1xuICB2YXIgb2JqZWN0X3RyaWdnZXJzLCB0cmlnZ2VycztcbiAgb2JqZWN0X3RyaWdnZXJzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3RyaWdnZXJzXCIpLmZpbmQoe1xuICAgIHNwYWNlOiBkb2Muc3BhY2UsXG4gICAgb2JqZWN0OiBkb2Mub2JqZWN0LFxuICAgIGlzX2VuYWJsZTogdHJ1ZVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBvd25lcjogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkuZmV0Y2goKTtcbiAgdHJpZ2dlcnMgPSB7fTtcbiAgXy5mb3JFYWNoKG9iamVjdF90cmlnZ2VycywgZnVuY3Rpb24oZikge1xuICAgIHJldHVybiB0cmlnZ2Vyc1tmLm5hbWVdID0gZjtcbiAgfSk7XG4gIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLnVwZGF0ZSh7XG4gICAgc3BhY2U6IGRvYy5zcGFjZSxcbiAgICBuYW1lOiBkb2Mub2JqZWN0XG4gIH0sIHtcbiAgICAkc2V0OiB7XG4gICAgICB0cmlnZ2VyczogdHJpZ2dlcnNcbiAgICB9XG4gIH0pO1xufTtcblxuaXNSZXBlYXRlZE5hbWUgPSBmdW5jdGlvbihkb2MsIG5hbWUpIHtcbiAgdmFyIG90aGVyO1xuICBvdGhlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF90cmlnZ2Vyc1wiKS5maW5kKHtcbiAgICBvYmplY3Q6IGRvYy5vYmplY3QsXG4gICAgc3BhY2U6IGRvYy5zcGFjZSxcbiAgICBfaWQ6IHtcbiAgICAgICRuZTogZG9jLl9pZFxuICAgIH0sXG4gICAgbmFtZTogbmFtZSB8fCBkb2MubmFtZVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBfaWQ6IDFcbiAgICB9XG4gIH0pO1xuICBpZiAob3RoZXIuY291bnQoKSA+IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5jaGVjayA9IGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbih1c2VySWQsIGRvYy5zcGFjZSkpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLlj6rmnInlt6XkvZzljrvnrqHnkIblkZjmiY3og73phY3nva7op6blj5HlmahcIik7XG4gIH1cbiAgaWYgKGRvYy5vbiA9PT0gJ3NlcnZlcicgJiYgIVN0ZWVkb3MuaXNMZWdhbFZlcnNpb24oZG9jLnNwYWNlLCBcIndvcmtmbG93LmVudGVycHJpc2VcIikpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLlj6rmnInkvIHkuJrniYjmlK/mjIHphY3nva7mnI3liqHnq6/nmoTop6blj5HlmahcIik7XG4gIH1cbn07XG5cbkNyZWF0b3IuT2JqZWN0cy5vYmplY3RfdHJpZ2dlcnMgPSB7XG4gIG5hbWU6IFwib2JqZWN0X3RyaWdnZXJzXCIsXG4gIGljb246IFwiYXNzZXRfcmVsYXRpb25zaGlwXCIsXG4gIGxhYmVsOiBcIuinpuWPkeWZqFwiLFxuICBmaWVsZHM6IHtcbiAgICBuYW1lOiB7XG4gICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgIHNlYXJjaGFibGU6IHRydWUsXG4gICAgICBpbmRleDogdHJ1ZSxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlXG4gICAgfSxcbiAgICBsYWJlbDoge1xuICAgICAgdHlwZTogXCJ0ZXh0XCJcbiAgICB9LFxuICAgIG9iamVjdDoge1xuICAgICAgdHlwZTogXCJtYXN0ZXJfZGV0YWlsXCIsXG4gICAgICByZWZlcmVuY2VfdG86IFwib2JqZWN0c1wiLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBvcHRpb25zRnVuY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX29wdGlvbnM7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKG8sIGspIHtcbiAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICBsYWJlbDogby5sYWJlbCxcbiAgICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgICAgaWNvbjogby5pY29uXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gX29wdGlvbnM7XG4gICAgICB9XG4gICAgfSxcbiAgICBvbjoge1xuICAgICAgdHlwZTogXCJsb29rdXBcIixcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgb3B0aW9uc0Z1bmN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogXCLlrqLmiLfnq69cIixcbiAgICAgICAgICAgIHZhbHVlOiBcImNsaWVudFwiLFxuICAgICAgICAgICAgaWNvbjogXCJhZGRyZXNzXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBsYWJlbDogXCLmnI3liqHnq69cIixcbiAgICAgICAgICAgIHZhbHVlOiBcInNlcnZlclwiLFxuICAgICAgICAgICAgaWNvbjogXCJhZGRyZXNzXCJcbiAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgICB9XG4gICAgfSxcbiAgICB3aGVuOiB7XG4gICAgICB0eXBlOiBcImxvb2t1cFwiLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBvcHRpb25zRnVuY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiBcIuaWsOWinuiusOW9leS5i+WJjVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwiYmVmb3JlLmluc2VydFwiLFxuICAgICAgICAgICAgaWNvbjogXCJhc3NldF9yZWxhdGlvbnNoaXBcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxhYmVsOiBcIuaWsOWinuiusOW9leS5i+WQjlwiLFxuICAgICAgICAgICAgdmFsdWU6IFwiYWZ0ZXIuaW5zZXJ0XCIsXG4gICAgICAgICAgICBpY29uOiBcImFzc2V0X3JlbGF0aW9uc2hpcFwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbGFiZWw6IFwi5L+u5pS56K6w5b2V5LmL5YmNXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCJiZWZvcmUudXBkYXRlXCIsXG4gICAgICAgICAgICBpY29uOiBcImFzc2V0X3JlbGF0aW9uc2hpcFwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbGFiZWw6IFwi5L+u5pS56K6w5b2V5LmL5ZCOXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCJhZnRlci51cGRhdGVcIixcbiAgICAgICAgICAgIGljb246IFwiYXNzZXRfcmVsYXRpb25zaGlwXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBsYWJlbDogXCLliKDpmaTorrDlvZXkuYvliY1cIixcbiAgICAgICAgICAgIHZhbHVlOiBcImJlZm9yZS5yZW1vdmVcIixcbiAgICAgICAgICAgIGljb246IFwiYXNzZXRfcmVsYXRpb25zaGlwXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBsYWJlbDogXCLliKDpmaTorrDlvZXkuYvlkI5cIixcbiAgICAgICAgICAgIHZhbHVlOiBcImFmdGVyLnJlbW92ZVwiLFxuICAgICAgICAgICAgaWNvbjogXCJhc3NldF9yZWxhdGlvbnNoaXBcIlxuICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGlzX2VuYWJsZToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICB9LFxuICAgIHRvZG86IHtcbiAgICAgIHR5cGU6IFwidGV4dGFyZWFcIixcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaXNfd2lkZTogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgbGlzdF92aWV3czoge1xuICAgIGFsbDoge1xuICAgICAgY29sdW1uczogW1wibmFtZVwiLCBcImxhYmVsXCIsIFwib2JqZWN0XCIsIFwib25cIiwgXCJ3aGVuXCIsIFwiaXNfZW5hYmxlXCJdLFxuICAgICAgZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcbiAgICB9XG4gIH0sXG4gIHBlcm1pc3Npb25fc2V0OiB7XG4gICAgdXNlcjoge1xuICAgICAgYWxsb3dDcmVhdGU6IGZhbHNlLFxuICAgICAgYWxsb3dEZWxldGU6IGZhbHNlLFxuICAgICAgYWxsb3dFZGl0OiBmYWxzZSxcbiAgICAgIGFsbG93UmVhZDogZmFsc2UsXG4gICAgICBtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZSxcbiAgICAgIHZpZXdBbGxSZWNvcmRzOiBmYWxzZVxuICAgIH0sXG4gICAgYWRtaW46IHtcbiAgICAgIGFsbG93Q3JlYXRlOiB0cnVlLFxuICAgICAgYWxsb3dEZWxldGU6IHRydWUsXG4gICAgICBhbGxvd0VkaXQ6IHRydWUsXG4gICAgICBhbGxvd1JlYWQ6IHRydWUsXG4gICAgICBtb2RpZnlBbGxSZWNvcmRzOiB0cnVlLFxuICAgICAgdmlld0FsbFJlY29yZHM6IHRydWVcbiAgICB9XG4gIH0sXG4gIHRyaWdnZXJzOiB7XG4gICAgXCJhZnRlci5pbnNlcnQuc2VydmVyLm9iamVjdF90cmlnZ2Vyc1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYWZ0ZXIuaW5zZXJ0XCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICByZXR1cm4gX3N5bmNUb09iamVjdChkb2MpO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJhZnRlci51cGRhdGUuc2VydmVyLm9iamVjdF90cmlnZ2Vyc1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYWZ0ZXIudXBkYXRlXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICByZXR1cm4gX3N5bmNUb09iamVjdChkb2MpO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJhZnRlci5yZW1vdmUuc2VydmVyLm9iamVjdF90cmlnZ2Vyc1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYWZ0ZXIucmVtb3ZlXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICByZXR1cm4gX3N5bmNUb09iamVjdChkb2MpO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJiZWZvcmUuZGVsZXRlLnNlcnZlci5vYmplY3RfdHJpZ2dlcnNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImJlZm9yZS5yZW1vdmVcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICAgIHJldHVybiBjaGVjayh1c2VySWQsIGRvYyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcImJlZm9yZS51cGRhdGUuc2VydmVyLm9iamVjdF90cmlnZ2Vyc1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYmVmb3JlLnVwZGF0ZVwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciByZWY7XG4gICAgICAgIGNoZWNrKHVzZXJJZCwgZG9jKTtcbiAgICAgICAgaWYgKChtb2RpZmllciAhPSBudWxsID8gKHJlZiA9IG1vZGlmaWVyLiRzZXQpICE9IG51bGwgPyByZWYubmFtZSA6IHZvaWQgMCA6IHZvaWQgMCkgJiYgaXNSZXBlYXRlZE5hbWUoZG9jLCBtb2RpZmllci4kc2V0Lm5hbWUpKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJ1cGRhdGUgdHJpZ2dlcnPlr7nosaHlkI3np7DkuI3og73ph43lpI1cIiArIGRvYy5uYW1lKTtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLlr7nosaHlkI3np7DkuI3og73ph43lpI1cIiArIGRvYy5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJiZWZvcmUuaW5zZXJ0LnNlcnZlci5vYmplY3RfdHJpZ2dlcnNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImJlZm9yZS5pbnNlcnRcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICAgIGNoZWNrKHVzZXJJZCwgZG9jKTtcbiAgICAgICAgaWYgKGlzUmVwZWF0ZWROYW1lKGRvYykpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImluc2VydCB0cmlnZ2Vyc+WvueixoeWQjeensOS4jeiDvemHjeWkjVwiICsgZG9jLm5hbWUpO1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuWvueixoeWQjeensOS4jeiDvemHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiIsIl9zeW5jVG9PYmplY3QgPSAoZG9jKSAtPlxyXG5cdG9iamVjdF9hY3Rpb25zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2FjdGlvbnNcIikuZmluZCh7b2JqZWN0OiBkb2Mub2JqZWN0LCBzcGFjZTogZG9jLnNwYWNlLCBpc19lbmFibGU6IHRydWV9LCB7XHJcblx0XHRmaWVsZHM6IHtcclxuXHRcdFx0Y3JlYXRlZDogMCxcclxuXHRcdFx0bW9kaWZpZWQ6IDAsXHJcblx0XHRcdG93bmVyOiAwLFxyXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxyXG5cdFx0XHRtb2RpZmllZF9ieTogMFxyXG5cdFx0fVxyXG5cdH0pLmZldGNoKClcclxuXHJcblx0YWN0aW9ucyA9IHt9XHJcblxyXG5cdF8uZm9yRWFjaCBvYmplY3RfYWN0aW9ucywgKGYpLT5cclxuXHRcdGFjdGlvbnNbZi5uYW1lXSA9IGZcclxuXHJcblx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS51cGRhdGUoe3NwYWNlOiBkb2Muc3BhY2UsIG5hbWU6IGRvYy5vYmplY3R9LCB7XHJcblx0XHQkc2V0OlxyXG5cdFx0XHRhY3Rpb25zOiBhY3Rpb25zXHJcblx0fSlcclxuaXNSZXBlYXRlZE5hbWUgPSAoZG9jLCBuYW1lKS0+XHJcblx0b3RoZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfYWN0aW9uc1wiKS5maW5kKHtvYmplY3Q6IGRvYy5vYmplY3QsICBzcGFjZTogZG9jLnNwYWNlLCBfaWQ6IHskbmU6IGRvYy5faWR9LCBuYW1lOiBuYW1lIHx8IGRvYy5uYW1lfSwge2ZpZWxkczp7X2lkOiAxfX0pXHJcblx0aWYgb3RoZXIuY291bnQoKSA+IDBcclxuXHRcdHJldHVybiB0cnVlXHJcblx0cmV0dXJuIGZhbHNlXHJcbkNyZWF0b3IuT2JqZWN0cy5vYmplY3RfYWN0aW9ucyA9XHJcblx0bmFtZTogXCJvYmplY3RfYWN0aW9uc1wiXHJcblx0bGFiZWw6IFwi5a+56LGh5pON5L2cXCJcclxuXHRpY29uOiBcIm1hcmtldGluZ19hY3Rpb25zXCJcclxuXHRmaWVsZHM6XHJcblx0XHRvYmplY3Q6XHJcblx0XHRcdHR5cGU6IFwibWFzdGVyX2RldGFpbFwiXHJcblx0XHRcdHJlZmVyZW5jZV90bzogXCJvYmplY3RzXCJcclxuXHRcdFx0cmVxdWlyZWQ6IHRydWVcclxuXHRcdFx0b3B0aW9uc0Z1bmN0aW9uOiAoKS0+XHJcblx0XHRcdFx0X29wdGlvbnMgPSBbXVxyXG5cdFx0XHRcdF8uZm9yRWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvLCBrKS0+XHJcblx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogby5sYWJlbCwgdmFsdWU6IGssIGljb246IG8uaWNvbn1cclxuXHRcdFx0XHRyZXR1cm4gX29wdGlvbnNcclxuXHRcdG5hbWU6XHJcblx0XHRcdHR5cGU6IFwidGV4dFwiXHJcblx0XHRcdHNlYXJjaGFibGU6dHJ1ZVxyXG5cdFx0XHRpbmRleDp0cnVlXHJcblx0XHRcdHJlcXVpcmVkOiB0cnVlXHJcblx0XHRcdHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZVxyXG5cdFx0bGFiZWw6XHJcblx0XHRcdHR5cGU6IFwidGV4dFwiXHJcblx0XHRpc19lbmFibGU6XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXHJcblx0XHR2aXNpYmxlOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0XHRvbWl0OiB0cnVlXHJcblx0XHRvbjpcclxuXHRcdFx0dHlwZTogXCJsb29rdXBcIlxyXG5cdFx0XHRpc193aWRlOnRydWVcclxuXHRcdFx0cmVxdWlyZWQ6IHRydWVcclxuXHRcdFx0b3B0aW9uc0Z1bmN0aW9uOiAoKS0+XHJcblx0XHRcdFx0W1xyXG5cdFx0XHRcdFx0e2xhYmVsOiBcIuaYvuekuuWcqOWIl+ihqOWPs+S4iuinklwiLCB2YWx1ZTogXCJsaXN0XCIsIGljb246IFwiY29udGFjdF9saXN0XCJ9XHJcblx0XHRcdFx0XHR7bGFiZWw6IFwi5pi+56S65Zyo6K6w5b2V5p+l55yL6aG15Y+z5LiK6KeSXCIsIHZhbHVlOiBcInJlY29yZFwiLCBpY29uOiBcImNvbnRyYWN0XCJ9XHJcblx0XHRcdFx0XVxyXG5cdFx0dG9kbzpcclxuXHRcdFx0bGFiZWw6IFwi5omn6KGM55qE6ISa5pysXCJcclxuXHRcdFx0dHlwZTogXCJ0ZXh0YXJlYVwiXHJcblx0XHRcdHJlcXVpcmVkOiB0cnVlXHJcblx0XHRcdGlzX3dpZGU6dHJ1ZVxyXG5cclxuXHJcblx0bGlzdF92aWV3czpcclxuXHRcdGFsbDpcclxuXHRcdFx0Y29sdW1uczogW1wibmFtZVwiLCBcImxhYmVsXCIsIFwib2JqZWN0XCIsIFwib25cIiwgXCJpc19lbmFibGVcIiwgXCJtb2RpZmllZFwiXVxyXG5cdFx0XHRmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxyXG5cclxuXHRwZXJtaXNzaW9uX3NldDpcclxuXHRcdHVzZXI6XHJcblx0XHRcdGFsbG93Q3JlYXRlOiBmYWxzZVxyXG5cdFx0XHRhbGxvd0RlbGV0ZTogZmFsc2VcclxuXHRcdFx0YWxsb3dFZGl0OiBmYWxzZVxyXG5cdFx0XHRhbGxvd1JlYWQ6IGZhbHNlXHJcblx0XHRcdG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlXHJcblx0XHRcdHZpZXdBbGxSZWNvcmRzOiBmYWxzZVxyXG5cdFx0YWRtaW46XHJcblx0XHRcdGFsbG93Q3JlYXRlOiB0cnVlXHJcblx0XHRcdGFsbG93RGVsZXRlOiB0cnVlXHJcblx0XHRcdGFsbG93RWRpdDogdHJ1ZVxyXG5cdFx0XHRhbGxvd1JlYWQ6IHRydWVcclxuXHRcdFx0bW9kaWZ5QWxsUmVjb3JkczogdHJ1ZVxyXG5cdFx0XHR2aWV3QWxsUmVjb3JkczogdHJ1ZVxyXG5cclxuXHR0cmlnZ2VyczpcclxuXHRcdFwiYWZ0ZXIuaW5zZXJ0LnNlcnZlci5vYmplY3RfYWN0aW9uc1wiOlxyXG5cdFx0XHRvbjogXCJzZXJ2ZXJcIlxyXG5cdFx0XHR3aGVuOiBcImFmdGVyLmluc2VydFwiXHJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxyXG5cdFx0XHRcdF9zeW5jVG9PYmplY3QoZG9jKVxyXG5cdFx0XCJhZnRlci51cGRhdGUuc2VydmVyLm9iamVjdF9hY3Rpb25zXCI6XHJcblx0XHRcdG9uOiBcInNlcnZlclwiXHJcblx0XHRcdHdoZW46IFwiYWZ0ZXIudXBkYXRlXCJcclxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jKS0+XHJcblx0XHRcdFx0X3N5bmNUb09iamVjdChkb2MpXHJcblx0XHRcImFmdGVyLnJlbW92ZS5zZXJ2ZXIub2JqZWN0X2FjdGlvbnNcIjpcclxuXHRcdFx0b246IFwic2VydmVyXCJcclxuXHRcdFx0d2hlbjogXCJhZnRlci5yZW1vdmVcIlxyXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MpLT5cclxuXHRcdFx0XHRfc3luY1RvT2JqZWN0KGRvYylcclxuXHJcblx0XHRcImJlZm9yZS51cGRhdGUuc2VydmVyLm9iamVjdF9hY3Rpb25zXCI6XHJcblx0XHRcdG9uOiBcInNlcnZlclwiXHJcblx0XHRcdHdoZW46IFwiYmVmb3JlLnVwZGF0ZVwiXHJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpLT5cclxuXHRcdFx0XHRpZiBtb2RpZmllcj8uJHNldD8ubmFtZSAmJiBpc1JlcGVhdGVkTmFtZShkb2MsIG1vZGlmaWVyLiRzZXQubmFtZSlcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwidXBkYXRlIGFjdGlvbnPlr7nosaHlkI3np7DkuI3og73ph43lpI0je2RvYy5uYW1lfVwiKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCJcclxuXHJcblx0XHRcImJlZm9yZS5pbnNlcnQuc2VydmVyLm9iamVjdF9hY3Rpb25zXCI6XHJcblx0XHRcdG9uOiBcInNlcnZlclwiXHJcblx0XHRcdHdoZW46IFwiYmVmb3JlLmluc2VydFwiXHJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxyXG5cdFx0XHRcdGRvYy52aXNpYmxlID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIGlzUmVwZWF0ZWROYW1lKGRvYylcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiaW5zZXJ0IGFjdGlvbnPlr7nosaHlkI3np7DkuI3og73ph43lpI0je2RvYy5uYW1lfVwiKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNI3tkb2MubmFtZX1cIiIsInZhciBfc3luY1RvT2JqZWN0LCBpc1JlcGVhdGVkTmFtZTtcblxuX3N5bmNUb09iamVjdCA9IGZ1bmN0aW9uKGRvYykge1xuICB2YXIgYWN0aW9ucywgb2JqZWN0X2FjdGlvbnM7XG4gIG9iamVjdF9hY3Rpb25zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2FjdGlvbnNcIikuZmluZCh7XG4gICAgb2JqZWN0OiBkb2Mub2JqZWN0LFxuICAgIHNwYWNlOiBkb2Muc3BhY2UsXG4gICAgaXNfZW5hYmxlOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIG93bmVyOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBhY3Rpb25zID0ge307XG4gIF8uZm9yRWFjaChvYmplY3RfYWN0aW9ucywgZnVuY3Rpb24oZikge1xuICAgIHJldHVybiBhY3Rpb25zW2YubmFtZV0gPSBmO1xuICB9KTtcbiAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikudXBkYXRlKHtcbiAgICBzcGFjZTogZG9jLnNwYWNlLFxuICAgIG5hbWU6IGRvYy5vYmplY3RcbiAgfSwge1xuICAgICRzZXQ6IHtcbiAgICAgIGFjdGlvbnM6IGFjdGlvbnNcbiAgICB9XG4gIH0pO1xufTtcblxuaXNSZXBlYXRlZE5hbWUgPSBmdW5jdGlvbihkb2MsIG5hbWUpIHtcbiAgdmFyIG90aGVyO1xuICBvdGhlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9hY3Rpb25zXCIpLmZpbmQoe1xuICAgIG9iamVjdDogZG9jLm9iamVjdCxcbiAgICBzcGFjZTogZG9jLnNwYWNlLFxuICAgIF9pZDoge1xuICAgICAgJG5lOiBkb2MuX2lkXG4gICAgfSxcbiAgICBuYW1lOiBuYW1lIHx8IGRvYy5uYW1lXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIF9pZDogMVxuICAgIH1cbiAgfSk7XG4gIGlmIChvdGhlci5jb3VudCgpID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkNyZWF0b3IuT2JqZWN0cy5vYmplY3RfYWN0aW9ucyA9IHtcbiAgbmFtZTogXCJvYmplY3RfYWN0aW9uc1wiLFxuICBsYWJlbDogXCLlr7nosaHmk43kvZxcIixcbiAgaWNvbjogXCJtYXJrZXRpbmdfYWN0aW9uc1wiLFxuICBmaWVsZHM6IHtcbiAgICBvYmplY3Q6IHtcbiAgICAgIHR5cGU6IFwibWFzdGVyX2RldGFpbFwiLFxuICAgICAgcmVmZXJlbmNlX3RvOiBcIm9iamVjdHNcIixcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgb3B0aW9uc0Z1bmN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9vcHRpb25zO1xuICAgICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goQ3JlYXRvci5vYmplY3RzQnlOYW1lLCBmdW5jdGlvbihvLCBrKSB7XG4gICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgbGFiZWw6IG8ubGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogayxcbiAgICAgICAgICAgIGljb246IG8uaWNvblxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zO1xuICAgICAgfVxuICAgIH0sXG4gICAgbmFtZToge1xuICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICBzZWFyY2hhYmxlOiB0cnVlLFxuICAgICAgaW5kZXg6IHRydWUsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZVxuICAgIH0sXG4gICAgbGFiZWw6IHtcbiAgICAgIHR5cGU6IFwidGV4dFwiXG4gICAgfSxcbiAgICBpc19lbmFibGU6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICB2aXNpYmxlOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIG9taXQ6IHRydWVcbiAgICB9LFxuICAgIG9uOiB7XG4gICAgICB0eXBlOiBcImxvb2t1cFwiLFxuICAgICAgaXNfd2lkZTogdHJ1ZSxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgb3B0aW9uc0Z1bmN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogXCLmmL7npLrlnKjliJfooajlj7PkuIrop5JcIixcbiAgICAgICAgICAgIHZhbHVlOiBcImxpc3RcIixcbiAgICAgICAgICAgIGljb246IFwiY29udGFjdF9saXN0XCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBsYWJlbDogXCLmmL7npLrlnKjorrDlvZXmn6XnnIvpobXlj7PkuIrop5JcIixcbiAgICAgICAgICAgIHZhbHVlOiBcInJlY29yZFwiLFxuICAgICAgICAgICAgaWNvbjogXCJjb250cmFjdFwiXG4gICAgICAgICAgfVxuICAgICAgICBdO1xuICAgICAgfVxuICAgIH0sXG4gICAgdG9kbzoge1xuICAgICAgbGFiZWw6IFwi5omn6KGM55qE6ISa5pysXCIsXG4gICAgICB0eXBlOiBcInRleHRhcmVhXCIsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGlzX3dpZGU6IHRydWVcbiAgICB9XG4gIH0sXG4gIGxpc3Rfdmlld3M6IHtcbiAgICBhbGw6IHtcbiAgICAgIGNvbHVtbnM6IFtcIm5hbWVcIiwgXCJsYWJlbFwiLCBcIm9iamVjdFwiLCBcIm9uXCIsIFwiaXNfZW5hYmxlXCIsIFwibW9kaWZpZWRcIl0sXG4gICAgICBmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxuICAgIH1cbiAgfSxcbiAgcGVybWlzc2lvbl9zZXQ6IHtcbiAgICB1c2VyOiB7XG4gICAgICBhbGxvd0NyZWF0ZTogZmFsc2UsXG4gICAgICBhbGxvd0RlbGV0ZTogZmFsc2UsXG4gICAgICBhbGxvd0VkaXQ6IGZhbHNlLFxuICAgICAgYWxsb3dSZWFkOiBmYWxzZSxcbiAgICAgIG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlLFxuICAgICAgdmlld0FsbFJlY29yZHM6IGZhbHNlXG4gICAgfSxcbiAgICBhZG1pbjoge1xuICAgICAgYWxsb3dDcmVhdGU6IHRydWUsXG4gICAgICBhbGxvd0RlbGV0ZTogdHJ1ZSxcbiAgICAgIGFsbG93RWRpdDogdHJ1ZSxcbiAgICAgIGFsbG93UmVhZDogdHJ1ZSxcbiAgICAgIG1vZGlmeUFsbFJlY29yZHM6IHRydWUsXG4gICAgICB2aWV3QWxsUmVjb3JkczogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgdHJpZ2dlcnM6IHtcbiAgICBcImFmdGVyLmluc2VydC5zZXJ2ZXIub2JqZWN0X2FjdGlvbnNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImFmdGVyLmluc2VydFwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgcmV0dXJuIF9zeW5jVG9PYmplY3QoZG9jKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYWZ0ZXIudXBkYXRlLnNlcnZlci5vYmplY3RfYWN0aW9uc1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYWZ0ZXIudXBkYXRlXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICByZXR1cm4gX3N5bmNUb09iamVjdChkb2MpO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJhZnRlci5yZW1vdmUuc2VydmVyLm9iamVjdF9hY3Rpb25zXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJhZnRlci5yZW1vdmVcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICAgIHJldHVybiBfc3luY1RvT2JqZWN0KGRvYyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcImJlZm9yZS51cGRhdGUuc2VydmVyLm9iamVjdF9hY3Rpb25zXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJiZWZvcmUudXBkYXRlXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHJlZjtcbiAgICAgICAgaWYgKChtb2RpZmllciAhPSBudWxsID8gKHJlZiA9IG1vZGlmaWVyLiRzZXQpICE9IG51bGwgPyByZWYubmFtZSA6IHZvaWQgMCA6IHZvaWQgMCkgJiYgaXNSZXBlYXRlZE5hbWUoZG9jLCBtb2RpZmllci4kc2V0Lm5hbWUpKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJ1cGRhdGUgYWN0aW9uc+WvueixoeWQjeensOS4jeiDvemHjeWkjVwiICsgZG9jLm5hbWUpO1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuWvueixoeWQjeensOS4jeiDvemHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJiZWZvcmUuaW5zZXJ0LnNlcnZlci5vYmplY3RfYWN0aW9uc1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYmVmb3JlLmluc2VydFwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgZG9jLnZpc2libGUgPSB0cnVlO1xuICAgICAgICBpZiAoaXNSZXBlYXRlZE5hbWUoZG9jKSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5zZXJ0IGFjdGlvbnPlr7nosaHlkI3np7DkuI3og73ph43lpI1cIiArIGRvYy5uYW1lKTtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLlr7nosaHlkI3np7DkuI3og73ph43lpI1cIiArIGRvYy5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiJdfQ==
