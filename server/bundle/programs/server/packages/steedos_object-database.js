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
    enable_approvals: {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2UvbW9kZWxzL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdC1kYXRhYmFzZS9tb2RlbHMvb2JqZWN0X2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9vYmplY3RfZmllbGRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2UvbW9kZWxzL29iamVjdF90cmlnZ2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9vYmplY3RfdHJpZ2dlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdC1kYXRhYmFzZS9tb2RlbHMvb2JqZWN0X2FjdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9tb2RlbHMvb2JqZWN0X2FjdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbImlzUmVwZWF0ZWROYW1lIiwiZG9jIiwib3RoZXIiLCJDcmVhdG9yIiwiZ2V0Q29sbGVjdGlvbiIsImZpbmQiLCJfaWQiLCIkbmUiLCJzcGFjZSIsIm5hbWUiLCJmaWVsZHMiLCJjb3VudCIsIk9iamVjdHMiLCJvYmplY3RzIiwiaWNvbiIsImxhYmVsIiwidHlwZSIsInNlYXJjaGFibGUiLCJpbmRleCIsInJlcXVpcmVkIiwicmVnRXgiLCJTaW1wbGVTY2hlbWEiLCJSZWdFeCIsImNvZGUiLCJvcHRpb25zRnVuY3Rpb24iLCJvcHRpb25zIiwiXyIsImZvckVhY2giLCJyZXNvdXJjZXMiLCJzbGRzSWNvbnMiLCJzdGFuZGFyZCIsInN2ZyIsInB1c2giLCJ2YWx1ZSIsImlzX2VuYWJsZSIsImRlZmF1bHRWYWx1ZSIsImVuYWJsZV9zZWFyY2giLCJlbmFibGVfZmlsZXMiLCJlbmFibGVfdGFza3MiLCJlbmFibGVfbm90ZXMiLCJlbmFibGVfZXZlbnRzIiwiZW5hYmxlX2FwaSIsImhpZGRlbiIsImVuYWJsZV9zaGFyZSIsImVuYWJsZV9pbnN0YW5jZXMiLCJlbmFibGVfY2hhdHRlciIsImVuYWJsZV9hdWRpdCIsImVuYWJsZV90cmFzaCIsImVuYWJsZV9zcGFjZV9nbG9iYWwiLCJlbmFibGVfYXBwcm92YWxzIiwiaXNfdmlldyIsIm9taXQiLCJkZXNjcmlwdGlvbiIsImlzX3dpZGUiLCJzaWRlYmFyIiwiYmxhY2tib3giLCJsaXN0X3ZpZXdzIiwiYWN0aW9ucyIsInBlcm1pc3Npb25fc2V0IiwidHJpZ2dlcnMiLCJjdXN0b20iLCJvd25lciIsImFwcF91bmlxdWVfaWQiLCJhcHBfdmVyc2lvbiIsImFsbCIsImNvbHVtbnMiLCJmaWx0ZXJfc2NvcGUiLCJ1c2VyIiwiYWxsb3dDcmVhdGUiLCJhbGxvd0RlbGV0ZSIsImFsbG93RWRpdCIsImFsbG93UmVhZCIsIm1vZGlmeUFsbFJlY29yZHMiLCJ2aWV3QWxsUmVjb3JkcyIsImFkbWluIiwiY29weV9vZGF0YSIsInZpc2libGUiLCJvbiIsInRvZG8iLCJvYmplY3RfbmFtZSIsInJlY29yZF9pZCIsIml0ZW1fZWxlbWVudCIsImNsaXBib2FyZCIsIm9fbmFtZSIsInBhdGgiLCJyZWNvcmQiLCJnZXRPYmplY3RCeUlkIiwiU3RlZWRvc09EYXRhIiwiZ2V0T0RhdGFQYXRoIiwiU2Vzc2lvbiIsImdldCIsImF0dHIiLCJDbGlwYm9hcmQiLCJlIiwidG9hc3RyIiwic3VjY2VzcyIsImVycm9yIiwiY29uc29sZSIsInRhZ05hbWUiLCJoYXNDbGFzcyIsInRyaWdnZXIiLCJ3aGVuIiwidXNlcklkIiwibG9nIiwiTWV0ZW9yIiwiRXJyb3IiLCJmaWVsZE5hbWVzIiwibW9kaWZpZXIiLCJyZWYiLCIkc2V0IiwiJHVuc2V0IiwiaW5zZXJ0Iiwib2JqZWN0Iiwic2hhcmVkIiwiZG9jdW1lbnRzIiwib2JqZWN0X2NvbGxlY3Rpb25zIiwiZGlyZWN0IiwicmVtb3ZlIiwiQ29sbGVjdGlvbnMiLCJfY29sbGVjdGlvbiIsImRyb3BDb2xsZWN0aW9uIiwic3RhY2siLCJfc3luY1RvT2JqZWN0Iiwib2JqZWN0X2ZpZWxkcyIsInRhYmxlX2ZpZWxkcyIsImNyZWF0ZWQiLCJtb2RpZmllZCIsImNyZWF0ZWRfYnkiLCJtb2RpZmllZF9ieSIsImZldGNoIiwiZiIsImNmX2FyciIsImNoaWxkX2ZpZWxkcyIsInRlc3QiLCJzcGxpdCIsInNpemUiLCJleHRlbmQiLCJlYWNoIiwiayIsInVwZGF0ZSIsImZpZWxkIiwiaXNfbmFtZSIsInJlZmVyZW5jZV90byIsIl9vcHRpb25zIiwib2JqZWN0c0J5TmFtZSIsIm8iLCJ0ZXh0IiwidGV4dGFyZWEiLCJodG1sIiwic2VsZWN0IiwiYm9vbGVhbiIsImRhdGUiLCJkYXRldGltZSIsIm51bWJlciIsImN1cnJlbmN5IiwicGFzc3dvcmQiLCJsb29rdXAiLCJtYXN0ZXJfZGV0YWlsIiwiZ3JpZCIsInVybCIsImVtYWlsIiwic29ydF9ubyIsInNjYWxlIiwic29ydGFibGUiLCJncm91cCIsImFsbG93ZWRWYWx1ZXMiLCJtdWx0aXBsZSIsInJlYWRvbmx5IiwicHJlY2lzaW9uIiwicm93cyIsInNvcnQiLCJmaWVsZF9uYW1lIiwib3JkZXIiLCJfcmVmZXJlbmNlX3RvIiwib2JqZWN0X2RvY3VtZW50cyIsInJlZjEiLCJyZWYyIiwicmVmMyIsInJlZjQiLCJyZWY1IiwicmVmNiIsInJlZjciLCJsZW5ndGgiLCJmaW5kT25lIiwiY2hlY2siLCJvYmplY3RfdHJpZ2dlcnMiLCJTdGVlZG9zIiwiaXNTcGFjZUFkbWluIiwiaXNMZWdhbFZlcnNpb24iLCJvYmplY3RfYWN0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBQUEsY0FBQTs7QUFBQUEsaUJBQWlCLFVBQUND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QUFSLENBQVksMkJBQXlCdEcsSUFBSVEsSUFBekM7QUFDQSxnQkFBTSxJQUFJK0YsT0FBT0MsS0FBWCxDQUFpQixHQUFqQixFQUFzQixhQUFXeEcsSUFBSVEsSUFBckMsQ0FBTjtBQzJESTtBRGpFTjtBQUFBO0FBekJEO0FBaEVELENBREQsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIjVE9ETyBvYmplY3TnmoRuYW1l5LiN6IO96YeN5aSN77yM6ZyA6KaB6ICD6JmR5Yiw57O757uf6KGoXHJcbmlzUmVwZWF0ZWROYW1lID0gKGRvYyktPlxyXG5cdG90aGVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS5maW5kKHtfaWQ6IHskbmU6IGRvYy5faWR9LCBzcGFjZTogZG9jLnNwYWNlLCBuYW1lOiBkb2MubmFtZX0sIHtmaWVsZHM6e19pZDogMX19KVxyXG5cdGlmIG90aGVyLmNvdW50KCkgPiAwXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdHJldHVybiBmYWxzZVxyXG5cclxuQ3JlYXRvci5PYmplY3RzLm9iamVjdHMgPVxyXG5cdG5hbWU6IFwib2JqZWN0c1wiXHJcblx0aWNvbjogXCJvcmRlcnNcIlxyXG5cdGxhYmVsOiBcIuWvueixoVwiXHJcblx0ZmllbGRzOlxyXG5cdFx0bmFtZTpcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHRcdFx0c2VhcmNoYWJsZTp0cnVlXHJcblx0XHRcdGluZGV4OnRydWVcclxuXHRcdFx0cmVxdWlyZWQ6IHRydWVcclxuXHRcdFx0cmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlXHJcblx0XHRsYWJlbDpcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHRcdFx0cmVxdWlyZWQ6IHRydWVcclxuXHRcdGljb246XHJcblx0XHRcdHR5cGU6IFwibG9va3VwXCJcclxuXHRcdFx0b3B0aW9uc0Z1bmN0aW9uOiAoKS0+XHJcblx0XHRcdFx0b3B0aW9ucyA9IFtdXHJcblx0XHRcdFx0Xy5mb3JFYWNoIENyZWF0b3IucmVzb3VyY2VzLnNsZHNJY29ucy5zdGFuZGFyZCwgKHN2ZyktPlxyXG5cdFx0XHRcdFx0b3B0aW9ucy5wdXNoIHt2YWx1ZTogc3ZnLCBsYWJlbDogc3ZnLCBpY29uOiBzdmd9XHJcblx0XHRcdFx0cmV0dXJuIG9wdGlvbnNcclxuXHRcdGlzX2VuYWJsZTpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHRcdFx0ZGVmYXVsdFZhbHVlOiB0cnVlXHJcblx0XHRlbmFibGVfc2VhcmNoOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0ZW5hYmxlX2ZpbGVzOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0ZW5hYmxlX3Rhc2tzOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0ZW5hYmxlX25vdGVzOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0ZW5hYmxlX2V2ZW50czpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHRcdGVuYWJsZV9hcGk6XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXHJcblx0XHRcdGRlZmF1bHRWYWx1ZTogdHJ1ZVxyXG5cdFx0XHRoaWRkZW46IHRydWVcclxuXHRcdGVuYWJsZV9zaGFyZTpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHRcdFx0ZGVmYXVsdFZhbHVlOiBmYWxzZVxyXG5cdFx0ZW5hYmxlX2luc3RhbmNlczpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHRcdGVuYWJsZV9jaGF0dGVyOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0ZW5hYmxlX2F1ZGl0OlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0ZW5hYmxlX3RyYXNoOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0ZW5hYmxlX3NwYWNlX2dsb2JhbDpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHRcdFx0ZGVmYXVsdFZhbHVlOiBmYWxzZVxyXG5cdFx0ZW5hYmxlX2FwcHJvdmFsczpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHRcdFx0ZGVmYXVsdFZhbHVlOiBmYWxzZVxyXG5cdFx0aXNfdmlldzpcclxuXHRcdFx0dHlwZTogJ2Jvb2xlYW4nXHJcblx0XHRcdGRlZmF1bHRWYWx1ZTogZmFsc2VcclxuXHRcdFx0b21pdDogdHJ1ZVxyXG5cdFx0aGlkZGVuOlxyXG5cdFx0XHRsYWJlbDogXCLpmpDol49cIlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0XHRvbWl0OiB0cnVlXHJcblx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0bGFiZWw6IFwiRGVzY3JpcHRpb25cIlxyXG5cdFx0XHR0eXBlOiBcInRleHRhcmVhXCJcclxuXHRcdFx0aXNfd2lkZTogdHJ1ZVxyXG5cdFx0c2lkZWJhcjpcclxuXHRcdFx0dHlwZTogXCJvYmplY3RcIlxyXG5cdFx0XHRsYWJlbDogXCLlt6bkvqfliJfooahcIlxyXG5cdFx0XHRibGFja2JveDogdHJ1ZVxyXG5cdFx0XHRvbWl0OiB0cnVlXHJcblx0XHRcdGhpZGRlbjogdHJ1ZVxyXG5cdFx0ZmllbGRzOlxyXG5cdFx0XHR0eXBlOiBcIm9iamVjdFwiXHJcblx0XHRcdGxhYmVsOiBcIuWtl+autVwiXHJcblx0XHRcdGJsYWNrYm94OiB0cnVlXHJcblx0XHRcdG9taXQ6IHRydWVcclxuXHRcdFx0aGlkZGVuOiB0cnVlXHJcblx0XHRsaXN0X3ZpZXdzOlxyXG5cdFx0XHR0eXBlOiBcIm9iamVjdFwiXHJcblx0XHRcdGxhYmVsOiBcIuWIl+ihqOinhuWbvlwiXHJcblx0XHRcdGJsYWNrYm94OiB0cnVlXHJcblx0XHRcdG9taXQ6IHRydWVcclxuXHRcdFx0aGlkZGVuOiB0cnVlXHJcblx0XHRhY3Rpb25zOlxyXG5cdFx0XHR0eXBlOiBcIm9iamVjdFwiXHJcblx0XHRcdGxhYmVsOiBcIuaTjeS9nFwiXHJcblx0XHRcdGJsYWNrYm94OiB0cnVlXHJcblx0XHRcdG9taXQ6IHRydWVcclxuXHRcdFx0aGlkZGVuOiB0cnVlXHJcblx0XHRwZXJtaXNzaW9uX3NldDpcclxuXHRcdFx0dHlwZTogXCJvYmplY3RcIlxyXG5cdFx0XHRsYWJlbDogXCLmnYPpmZDorr7nva5cIlxyXG5cdFx0XHRibGFja2JveDogdHJ1ZVxyXG5cdFx0XHRvbWl0OiB0cnVlXHJcblx0XHRcdGhpZGRlbjogdHJ1ZVxyXG5cdFx0dHJpZ2dlcnM6XHJcblx0XHRcdHR5cGU6IFwib2JqZWN0XCJcclxuXHRcdFx0bGFiZWw6IFwi6Kem5Y+R5ZmoXCJcclxuXHRcdFx0YmxhY2tib3g6IHRydWVcclxuXHRcdFx0b21pdDogdHJ1ZVxyXG5cdFx0XHRoaWRkZW46IHRydWVcclxuXHRcdGN1c3RvbTpcclxuXHRcdFx0bGFiZWw6IFwi6KeE5YiZXCJcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHRcdFx0b21pdDogdHJ1ZVxyXG5cdFx0b3duZXI6XHJcblx0XHRcdHR5cGU6IFwibG9va3VwXCJcclxuXHRcdFx0aGlkZGVuOiB0cnVlXHJcblx0XHRhcHBfdW5pcXVlX2lkOlxyXG5cdFx0XHR0eXBlOiAndGV4dCdcclxuXHRcdFx0aGlkZGVuOiB0cnVlXHJcblx0XHRhcHBfdmVyc2lvbjpcclxuXHRcdFx0dHlwZTogJ3RleHQnLFxyXG5cdFx0XHRoaWRkZW46IHRydWVcclxuXHJcblx0bGlzdF92aWV3czpcclxuXHRcdGFsbDpcclxuXHRcdFx0Y29sdW1uczogW1wibmFtZVwiLCBcImxhYmVsXCIsIFwiaXNfZW5hYmxlXCIsIFwibW9kaWZpZWRcIl1cclxuXHRcdFx0bGFiZWw6XCLlhajpg6hcIlxyXG5cdFx0XHRmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxyXG5cclxuXHRwZXJtaXNzaW9uX3NldDpcclxuXHRcdHVzZXI6XHJcblx0XHRcdGFsbG93Q3JlYXRlOiBmYWxzZVxyXG5cdFx0XHRhbGxvd0RlbGV0ZTogZmFsc2VcclxuXHRcdFx0YWxsb3dFZGl0OiBmYWxzZVxyXG5cdFx0XHRhbGxvd1JlYWQ6IGZhbHNlXHJcblx0XHRcdG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlXHJcblx0XHRcdHZpZXdBbGxSZWNvcmRzOiBmYWxzZVxyXG5cdFx0YWRtaW46XHJcblx0XHRcdGFsbG93Q3JlYXRlOiB0cnVlXHJcblx0XHRcdGFsbG93RGVsZXRlOiB0cnVlXHJcblx0XHRcdGFsbG93RWRpdDogdHJ1ZVxyXG5cdFx0XHRhbGxvd1JlYWQ6IHRydWVcclxuXHRcdFx0bW9kaWZ5QWxsUmVjb3JkczogdHJ1ZVxyXG5cdFx0XHR2aWV3QWxsUmVjb3JkczogdHJ1ZVxyXG5cclxuXHRhY3Rpb25zOlxyXG5cdFx0Y29weV9vZGF0YTpcclxuXHRcdFx0bGFiZWw6IFwi5aSN5Yi2T0RhdGHnvZHlnYBcIlxyXG5cdFx0XHR2aXNpYmxlOiB0cnVlXHJcblx0XHRcdG9uOiBcInJlY29yZFwiXHJcblx0XHRcdHRvZG86IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQpLT5cclxuXHRcdFx0XHRyZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdEJ5SWQocmVjb3JkX2lkKVxyXG5cdFx0XHRcdCNlbmFibGVfYXBpIOWxnuaAp+acquW8gOaUvlxyXG5cdFx0XHRcdGlmIHJlY29yZD8uZW5hYmxlX2FwaSB8fCB0cnVlXHJcblx0XHRcdFx0XHRvX25hbWUgPSByZWNvcmQ/Lm5hbWVcclxuXHRcdFx0XHRcdHBhdGggPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFQYXRoKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSwgb19uYW1lKVxyXG5cdFx0XHRcdFx0aXRlbV9lbGVtZW50LmF0dHIoJ2RhdGEtY2xpcGJvYXJkLXRleHQnLCBwYXRoKTtcclxuXHRcdFx0XHRcdGlmICFpdGVtX2VsZW1lbnQuYXR0cignZGF0YS1jbGlwYm9hcmQtbmV3JylcclxuXHRcdFx0XHRcdFx0Y2xpcGJvYXJkID0gbmV3IENsaXBib2FyZChpdGVtX2VsZW1lbnRbMF0pO1xyXG5cdFx0XHRcdFx0XHRpdGVtX2VsZW1lbnQuYXR0cignZGF0YS1jbGlwYm9hcmQtbmV3JywgdHJ1ZSlcclxuXHJcblx0XHRcdFx0XHRcdGNsaXBib2FyZC5vbignc3VjY2VzcycsICAoZSkgLT5cclxuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2Vzcygn5aSN5Yi25oiQ5YqfJyk7XHJcblx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0Y2xpcGJvYXJkLm9uKCdlcnJvcicsICAoZSkgLT5cclxuXHRcdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoJ+WkjeWItuWksei0pScpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJlXCJcclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFx0I2ZpeCDor6bnu4bpobXpnaIo572R6aG1TEkg5omL5py654mIdmlldy1hY3Rpb24p56ys5LiA5qyh54K55Ye75aSN5Yi25LiN5omn6KGMXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW1fZWxlbWVudFswXS50YWdOYW1lID09ICdMSScgfHwgaXRlbV9lbGVtZW50Lmhhc0NsYXNzKCd2aWV3LWFjdGlvbicpXHJcblx0XHRcdFx0XHRcdFx0aXRlbV9lbGVtZW50LnRyaWdnZXIoXCJjbGlja1wiKTtcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHR0b2FzdHIuZXJyb3IoJ+WkjeWItuWksei0pTog5pyq5ZCv55SoQVBJJyk7XHJcblxyXG5cclxuXHR0cmlnZ2VyczpcclxuXHRcdFwiYmVmb3JlLmluc2VydC5zZXJ2ZXIub2JqZWN0c1wiOlxyXG5cdFx0XHRvbjogXCJzZXJ2ZXJcIlxyXG5cdFx0XHR3aGVuOiBcImJlZm9yZS5pbnNlcnRcIlxyXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MpLT5cclxuXHRcdFx0XHRpZiBpc1JlcGVhdGVkTmFtZShkb2MpXHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIm9iamVjdOWvueixoeWQjeensOS4jeiDvemHjeWkjSN7ZG9jLm5hbWV9XCIpXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCLlr7nosaHlkI3np7DkuI3og73ph43lpI1cIlxyXG5cdFx0XHRcdGRvYy5jdXN0b20gPSB0cnVlXHJcblxyXG5cdFx0XCJiZWZvcmUudXBkYXRlLnNlcnZlci5vYmplY3RzXCI6XHJcblx0XHRcdG9uOiBcInNlcnZlclwiXHJcblx0XHRcdHdoZW46IFwiYmVmb3JlLnVwZGF0ZVwiXHJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpLT5cclxuXHRcdFx0XHRpZiBtb2RpZmllcj8uJHNldD8ubmFtZSAmJiBkb2MubmFtZSAhPSBtb2RpZmllci4kc2V0Lm5hbWVcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nIFwi5LiN6IO95L+u5pS5bmFtZVwiXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCLkuI3og73kv67mlLnlr7nosaHlkI1cIlxyXG5cdFx0XHRcdGlmIG1vZGlmaWVyLiRzZXRcclxuXHRcdFx0XHRcdG1vZGlmaWVyLiRzZXQuY3VzdG9tID0gdHJ1ZVxyXG5cclxuXHRcdFx0XHRpZiBtb2RpZmllci4kdW5zZXQgJiYgbW9kaWZpZXIuJHVuc2V0LmN1c3RvbVxyXG5cdFx0XHRcdFx0ZGVsZXRlIG1vZGlmaWVyLiR1bnNldC5jdXN0b21cclxuXHJcblxyXG5cdFx0XCJhZnRlci5pbnNlcnQuc2VydmVyLm9iamVjdHNcIjpcclxuXHRcdFx0b246IFwic2VydmVyXCJcclxuXHRcdFx0d2hlbjogXCJhZnRlci5pbnNlcnRcIlxyXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MpLT5cclxuXHRcdFx0XHQj5paw5aKeb2JqZWN05pe277yM6buY6K6k5paw5bu65LiA5LiqbmFtZeWtl+autVxyXG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9maWVsZHNcIikuaW5zZXJ0KHtvYmplY3Q6IGRvYy5uYW1lLCBvd25lcjogdXNlcklkLCBuYW1lOiBcIm5hbWVcIiwgc3BhY2U6IGRvYy5zcGFjZSwgdHlwZTogXCJ0ZXh0XCIsIHJlcXVpcmVkOiB0cnVlLCBpbmRleDogdHJ1ZSwgc2VhcmNoYWJsZTogdHJ1ZX0pXHJcblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5pbnNlcnQoe25hbWU6IFwiYWxsXCIsIHNwYWNlOiBkb2Muc3BhY2UsIG93bmVyOiB1c2VySWQsIG9iamVjdF9uYW1lOiBkb2MubmFtZSwgc2hhcmVkOiB0cnVlLCBmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIiwgY29sdW1uczogW1wibmFtZVwiXX0pXHJcblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5pbnNlcnQoe25hbWU6IFwicmVjZW50XCIsIHNwYWNlOiBkb2Muc3BhY2UsIG93bmVyOiB1c2VySWQsIG9iamVjdF9uYW1lOiBkb2MubmFtZSwgc2hhcmVkOiB0cnVlLCBmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIiwgY29sdW1uczogW1wibmFtZVwiXX0pXHJcblxyXG5cdFx0XCJiZWZvcmUucmVtb3ZlLnNlcnZlci5vYmplY3RzXCI6XHJcblx0XHRcdG9uOiBcInNlcnZlclwiXHJcblx0XHRcdHdoZW46IFwiYmVmb3JlLnJlbW92ZVwiXHJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxyXG5cclxuXHRcdFx0XHRpZiBkb2MuYXBwX3VuaXF1ZV9pZCAmJiBkb2MuYXBwX3ZlcnNpb25cclxuXHRcdFx0XHRcdHJldHVyblxyXG5cclxuXHRcdFx0XHRvYmplY3RfY29sbGVjdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oZG9jLm5hbWUsIGRvYy5zcGFjZSlcclxuXHJcblx0XHRcdFx0ZG9jdW1lbnRzID0gb2JqZWN0X2NvbGxlY3Rpb25zLmZpbmQoe30se2ZpZWxkczoge19pZDogMX19KVxyXG5cclxuXHRcdFx0XHRpZiBkb2N1bWVudHMuY291bnQoKSA+IDBcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuWvueixoSgje2RvYy5uYW1lfSnkuK3lt7Lnu4/mnInorrDlvZXvvIzor7flhYjliKDpmaTorrDlvZXlkI7vvIwg5YaN5Yig6Zmk5q2k5a+56LGhXCJcclxuXHJcblx0XHRcImFmdGVyLnJlbW92ZS5zZXJ2ZXIub2JqZWN0c1wiOlxyXG5cdFx0XHRvbjogXCJzZXJ2ZXJcIlxyXG5cdFx0XHR3aGVuOiBcImFmdGVyLnJlbW92ZVwiXHJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxyXG5cdFx0XHRcdCPliKDpmaRvYmplY3Qg5ZCO77yM6Ieq5Yqo5Yig6ZmkZmllbGRz44CBYWN0aW9uc+OAgXRyaWdnZXJz44CBcGVybWlzc2lvbl9vYmplY3RzXHJcblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS5kaXJlY3QucmVtb3ZlKHtvYmplY3Q6IGRvYy5uYW1lLCBzcGFjZTogZG9jLnNwYWNlfSlcclxuXHJcblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2FjdGlvbnNcIikuZGlyZWN0LnJlbW92ZSh7b2JqZWN0OiBkb2MubmFtZSwgc3BhY2U6IGRvYy5zcGFjZX0pXHJcblxyXG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF90cmlnZ2Vyc1wiKS5kaXJlY3QucmVtb3ZlKHtvYmplY3Q6IGRvYy5uYW1lLCBzcGFjZTogZG9jLnNwYWNlfSlcclxuXHJcblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmRpcmVjdC5yZW1vdmUoe29iamVjdF9uYW1lOiBkb2MubmFtZSwgc3BhY2U6IGRvYy5zcGFjZX0pXHJcblxyXG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZGlyZWN0LnJlbW92ZSh7b2JqZWN0X25hbWU6IGRvYy5uYW1lLCBzcGFjZTogZG9jLnNwYWNlfSlcclxuXHJcblx0XHRcdFx0I2Ryb3AgY29sbGVjdGlvblxyXG5cdFx0XHRcdGNvbnNvbGUubG9nIFwiZHJvcCBjb2xsZWN0aW9uXCIsIGRvYy5uYW1lXHJcblx0XHRcdFx0dHJ5XHJcbiNcdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKGRvYy5uYW1lKS5fY29sbGVjdGlvbi5kcm9wQ29sbGVjdGlvbigpXHJcblx0XHRcdFx0XHRDcmVhdG9yLkNvbGxlY3Rpb25zW1wiY18je2RvYy5zcGFjZX1fI3tkb2MubmFtZX1cIl0uX2NvbGxlY3Rpb24uZHJvcENvbGxlY3Rpb24oKVxyXG5cdFx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJjXyN7ZG9jLnNwYWNlfV8je2RvYy5uYW1lfVwiLCBcIiN7ZS5zdGFja31cIilcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuWvueixoSgje2RvYy5uYW1lfSnkuI3lrZjlnKjmiJblt7LooqvliKDpmaRcIiIsInZhciBpc1JlcGVhdGVkTmFtZTtcblxuaXNSZXBlYXRlZE5hbWUgPSBmdW5jdGlvbihkb2MpIHtcbiAgdmFyIG90aGVyO1xuICBvdGhlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikuZmluZCh7XG4gICAgX2lkOiB7XG4gICAgICAkbmU6IGRvYy5faWRcbiAgICB9LFxuICAgIHNwYWNlOiBkb2Muc3BhY2UsXG4gICAgbmFtZTogZG9jLm5hbWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgX2lkOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKG90aGVyLmNvdW50KCkgPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5PYmplY3RzLm9iamVjdHMgPSB7XG4gIG5hbWU6IFwib2JqZWN0c1wiLFxuICBpY29uOiBcIm9yZGVyc1wiLFxuICBsYWJlbDogXCLlr7nosaFcIixcbiAgZmllbGRzOiB7XG4gICAgbmFtZToge1xuICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICBzZWFyY2hhYmxlOiB0cnVlLFxuICAgICAgaW5kZXg6IHRydWUsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZVxuICAgIH0sXG4gICAgbGFiZWw6IHtcbiAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICB9LFxuICAgIGljb246IHtcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICBvcHRpb25zRnVuY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3B0aW9ucztcbiAgICAgICAgb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goQ3JlYXRvci5yZXNvdXJjZXMuc2xkc0ljb25zLnN0YW5kYXJkLCBmdW5jdGlvbihzdmcpIHtcbiAgICAgICAgICByZXR1cm4gb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgIHZhbHVlOiBzdmcsXG4gICAgICAgICAgICBsYWJlbDogc3ZnLFxuICAgICAgICAgICAgaWNvbjogc3ZnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICAgIH1cbiAgICB9LFxuICAgIGlzX2VuYWJsZToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0VmFsdWU6IHRydWVcbiAgICB9LFxuICAgIGVuYWJsZV9zZWFyY2g6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfZmlsZXM6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfdGFza3M6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfbm90ZXM6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfZXZlbnRzOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIH0sXG4gICAgZW5hYmxlX2FwaToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0VmFsdWU6IHRydWUsXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LFxuICAgIGVuYWJsZV9zaGFyZToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0VmFsdWU6IGZhbHNlXG4gICAgfSxcbiAgICBlbmFibGVfaW5zdGFuY2VzOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIH0sXG4gICAgZW5hYmxlX2NoYXR0ZXI6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfYXVkaXQ6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfdHJhc2g6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBlbmFibGVfc3BhY2VfZ2xvYmFsOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHRWYWx1ZTogZmFsc2VcbiAgICB9LFxuICAgIGVuYWJsZV9hcHByb3ZhbHM6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdFZhbHVlOiBmYWxzZVxuICAgIH0sXG4gICAgaXNfdmlldzoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICAgIG9taXQ6IHRydWVcbiAgICB9LFxuICAgIGhpZGRlbjoge1xuICAgICAgbGFiZWw6IFwi6ZqQ6JePXCIsXG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIG9taXQ6IHRydWVcbiAgICB9LFxuICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICBsYWJlbDogXCJEZXNjcmlwdGlvblwiLFxuICAgICAgdHlwZTogXCJ0ZXh0YXJlYVwiLFxuICAgICAgaXNfd2lkZTogdHJ1ZVxuICAgIH0sXG4gICAgc2lkZWJhcjoge1xuICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgIGxhYmVsOiBcIuW3puS+p+WIl+ihqFwiLFxuICAgICAgYmxhY2tib3g6IHRydWUsXG4gICAgICBvbWl0OiB0cnVlLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSxcbiAgICBmaWVsZHM6IHtcbiAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICBsYWJlbDogXCLlrZfmrrVcIixcbiAgICAgIGJsYWNrYm94OiB0cnVlLFxuICAgICAgb21pdDogdHJ1ZSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0sXG4gICAgbGlzdF92aWV3czoge1xuICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgIGxhYmVsOiBcIuWIl+ihqOinhuWbvlwiLFxuICAgICAgYmxhY2tib3g6IHRydWUsXG4gICAgICBvbWl0OiB0cnVlLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSxcbiAgICBhY3Rpb25zOiB7XG4gICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgbGFiZWw6IFwi5pON5L2cXCIsXG4gICAgICBibGFja2JveDogdHJ1ZSxcbiAgICAgIG9taXQ6IHRydWUsXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LFxuICAgIHBlcm1pc3Npb25fc2V0OiB7XG4gICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgbGFiZWw6IFwi5p2D6ZmQ6K6+572uXCIsXG4gICAgICBibGFja2JveDogdHJ1ZSxcbiAgICAgIG9taXQ6IHRydWUsXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LFxuICAgIHRyaWdnZXJzOiB7XG4gICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgbGFiZWw6IFwi6Kem5Y+R5ZmoXCIsXG4gICAgICBibGFja2JveDogdHJ1ZSxcbiAgICAgIG9taXQ6IHRydWUsXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LFxuICAgIGN1c3RvbToge1xuICAgICAgbGFiZWw6IFwi6KeE5YiZXCIsXG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIG9taXQ6IHRydWVcbiAgICB9LFxuICAgIG93bmVyOiB7XG4gICAgICB0eXBlOiBcImxvb2t1cFwiLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSxcbiAgICBhcHBfdW5pcXVlX2lkOiB7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LFxuICAgIGFwcF92ZXJzaW9uOiB7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9XG4gIH0sXG4gIGxpc3Rfdmlld3M6IHtcbiAgICBhbGw6IHtcbiAgICAgIGNvbHVtbnM6IFtcIm5hbWVcIiwgXCJsYWJlbFwiLCBcImlzX2VuYWJsZVwiLCBcIm1vZGlmaWVkXCJdLFxuICAgICAgbGFiZWw6IFwi5YWo6YOoXCIsXG4gICAgICBmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxuICAgIH1cbiAgfSxcbiAgcGVybWlzc2lvbl9zZXQ6IHtcbiAgICB1c2VyOiB7XG4gICAgICBhbGxvd0NyZWF0ZTogZmFsc2UsXG4gICAgICBhbGxvd0RlbGV0ZTogZmFsc2UsXG4gICAgICBhbGxvd0VkaXQ6IGZhbHNlLFxuICAgICAgYWxsb3dSZWFkOiBmYWxzZSxcbiAgICAgIG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlLFxuICAgICAgdmlld0FsbFJlY29yZHM6IGZhbHNlXG4gICAgfSxcbiAgICBhZG1pbjoge1xuICAgICAgYWxsb3dDcmVhdGU6IHRydWUsXG4gICAgICBhbGxvd0RlbGV0ZTogdHJ1ZSxcbiAgICAgIGFsbG93RWRpdDogdHJ1ZSxcbiAgICAgIGFsbG93UmVhZDogdHJ1ZSxcbiAgICAgIG1vZGlmeUFsbFJlY29yZHM6IHRydWUsXG4gICAgICB2aWV3QWxsUmVjb3JkczogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgYWN0aW9uczoge1xuICAgIGNvcHlfb2RhdGE6IHtcbiAgICAgIGxhYmVsOiBcIuWkjeWItk9EYXRh572R5Z2AXCIsXG4gICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgb246IFwicmVjb3JkXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQpIHtcbiAgICAgICAgdmFyIGNsaXBib2FyZCwgb19uYW1lLCBwYXRoLCByZWNvcmQ7XG4gICAgICAgIHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0QnlJZChyZWNvcmRfaWQpO1xuICAgICAgICBpZiAoKHJlY29yZCAhPSBudWxsID8gcmVjb3JkLmVuYWJsZV9hcGkgOiB2b2lkIDApIHx8IHRydWUpIHtcbiAgICAgICAgICBvX25hbWUgPSByZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5uYW1lIDogdm9pZCAwO1xuICAgICAgICAgIHBhdGggPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFQYXRoKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSwgb19uYW1lKTtcbiAgICAgICAgICBpdGVtX2VsZW1lbnQuYXR0cignZGF0YS1jbGlwYm9hcmQtdGV4dCcsIHBhdGgpO1xuICAgICAgICAgIGlmICghaXRlbV9lbGVtZW50LmF0dHIoJ2RhdGEtY2xpcGJvYXJkLW5ldycpKSB7XG4gICAgICAgICAgICBjbGlwYm9hcmQgPSBuZXcgQ2xpcGJvYXJkKGl0ZW1fZWxlbWVudFswXSk7XG4gICAgICAgICAgICBpdGVtX2VsZW1lbnQuYXR0cignZGF0YS1jbGlwYm9hcmQtbmV3JywgdHJ1ZSk7XG4gICAgICAgICAgICBjbGlwYm9hcmQub24oJ3N1Y2Nlc3MnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0b2FzdHIuc3VjY2Vzcygn5aSN5Yi25oiQ5YqfJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNsaXBib2FyZC5vbignZXJyb3InLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgIHRvYXN0ci5lcnJvcign5aSN5Yi25aSx6LSlJyk7XG4gICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiZVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGl0ZW1fZWxlbWVudFswXS50YWdOYW1lID09PSAnTEknIHx8IGl0ZW1fZWxlbWVudC5oYXNDbGFzcygndmlldy1hY3Rpb24nKSkge1xuICAgICAgICAgICAgICByZXR1cm4gaXRlbV9lbGVtZW50LnRyaWdnZXIoXCJjbGlja1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcign5aSN5Yi25aSx6LSlOiDmnKrlkK/nlKhBUEknKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgdHJpZ2dlcnM6IHtcbiAgICBcImJlZm9yZS5pbnNlcnQuc2VydmVyLm9iamVjdHNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImJlZm9yZS5pbnNlcnRcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICAgIGlmIChpc1JlcGVhdGVkTmFtZShkb2MpKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJvYmplY3Tlr7nosaHlkI3np7DkuI3og73ph43lpI1cIiArIGRvYy5uYW1lKTtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLlr7nosaHlkI3np7DkuI3og73ph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRvYy5jdXN0b20gPSB0cnVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJiZWZvcmUudXBkYXRlLnNlcnZlci5vYmplY3RzXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJiZWZvcmUudXBkYXRlXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHJlZjtcbiAgICAgICAgaWYgKChtb2RpZmllciAhPSBudWxsID8gKHJlZiA9IG1vZGlmaWVyLiRzZXQpICE9IG51bGwgPyByZWYubmFtZSA6IHZvaWQgMCA6IHZvaWQgMCkgJiYgZG9jLm5hbWUgIT09IG1vZGlmaWVyLiRzZXQubmFtZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwi5LiN6IO95L+u5pS5bmFtZVwiKTtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLkuI3og73kv67mlLnlr7nosaHlkI1cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vZGlmaWVyLiRzZXQpIHtcbiAgICAgICAgICBtb2RpZmllci4kc2V0LmN1c3RvbSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vZGlmaWVyLiR1bnNldCAmJiBtb2RpZmllci4kdW5zZXQuY3VzdG9tKSB7XG4gICAgICAgICAgcmV0dXJuIGRlbGV0ZSBtb2RpZmllci4kdW5zZXQuY3VzdG9tO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcImFmdGVyLmluc2VydC5zZXJ2ZXIub2JqZWN0c1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYWZ0ZXIuaW5zZXJ0XCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfZmllbGRzXCIpLmluc2VydCh7XG4gICAgICAgICAgb2JqZWN0OiBkb2MubmFtZSxcbiAgICAgICAgICBvd25lcjogdXNlcklkLFxuICAgICAgICAgIG5hbWU6IFwibmFtZVwiLFxuICAgICAgICAgIHNwYWNlOiBkb2Muc3BhY2UsXG4gICAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgaW5kZXg6IHRydWUsXG4gICAgICAgICAgc2VhcmNoYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5pbnNlcnQoe1xuICAgICAgICAgIG5hbWU6IFwiYWxsXCIsXG4gICAgICAgICAgc3BhY2U6IGRvYy5zcGFjZSxcbiAgICAgICAgICBvd25lcjogdXNlcklkLFxuICAgICAgICAgIG9iamVjdF9uYW1lOiBkb2MubmFtZSxcbiAgICAgICAgICBzaGFyZWQ6IHRydWUsXG4gICAgICAgICAgZmlsdGVyX3Njb3BlOiBcInNwYWNlXCIsXG4gICAgICAgICAgY29sdW1uczogW1wibmFtZVwiXVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuaW5zZXJ0KHtcbiAgICAgICAgICBuYW1lOiBcInJlY2VudFwiLFxuICAgICAgICAgIHNwYWNlOiBkb2Muc3BhY2UsXG4gICAgICAgICAgb3duZXI6IHVzZXJJZCxcbiAgICAgICAgICBvYmplY3RfbmFtZTogZG9jLm5hbWUsXG4gICAgICAgICAgc2hhcmVkOiB0cnVlLFxuICAgICAgICAgIGZpbHRlcl9zY29wZTogXCJzcGFjZVwiLFxuICAgICAgICAgIGNvbHVtbnM6IFtcIm5hbWVcIl1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcImJlZm9yZS5yZW1vdmUuc2VydmVyLm9iamVjdHNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImJlZm9yZS5yZW1vdmVcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICAgIHZhciBkb2N1bWVudHMsIG9iamVjdF9jb2xsZWN0aW9ucztcbiAgICAgICAgaWYgKGRvYy5hcHBfdW5pcXVlX2lkICYmIGRvYy5hcHBfdmVyc2lvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBvYmplY3RfY29sbGVjdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oZG9jLm5hbWUsIGRvYy5zcGFjZSk7XG4gICAgICAgIGRvY3VtZW50cyA9IG9iamVjdF9jb2xsZWN0aW9ucy5maW5kKHt9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZG9jdW1lbnRzLmNvdW50KCkgPiAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5a+56LGhKFwiICsgZG9jLm5hbWUgKyBcIinkuK3lt7Lnu4/mnInorrDlvZXvvIzor7flhYjliKDpmaTorrDlvZXlkI7vvIwg5YaN5Yig6Zmk5q2k5a+56LGhXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcImFmdGVyLnJlbW92ZS5zZXJ2ZXIub2JqZWN0c1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYWZ0ZXIucmVtb3ZlXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICB2YXIgZTtcbiAgICAgICAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS5kaXJlY3QucmVtb3ZlKHtcbiAgICAgICAgICBvYmplY3Q6IGRvYy5uYW1lLFxuICAgICAgICAgIHNwYWNlOiBkb2Muc3BhY2VcbiAgICAgICAgfSk7XG4gICAgICAgIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9hY3Rpb25zXCIpLmRpcmVjdC5yZW1vdmUoe1xuICAgICAgICAgIG9iamVjdDogZG9jLm5hbWUsXG4gICAgICAgICAgc3BhY2U6IGRvYy5zcGFjZVxuICAgICAgICB9KTtcbiAgICAgICAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3RyaWdnZXJzXCIpLmRpcmVjdC5yZW1vdmUoe1xuICAgICAgICAgIG9iamVjdDogZG9jLm5hbWUsXG4gICAgICAgICAgc3BhY2U6IGRvYy5zcGFjZVxuICAgICAgICB9KTtcbiAgICAgICAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmRpcmVjdC5yZW1vdmUoe1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBkb2MubmFtZSxcbiAgICAgICAgICBzcGFjZTogZG9jLnNwYWNlXG4gICAgICAgIH0pO1xuICAgICAgICBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmRpcmVjdC5yZW1vdmUoe1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBkb2MubmFtZSxcbiAgICAgICAgICBzcGFjZTogZG9jLnNwYWNlXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhcImRyb3AgY29sbGVjdGlvblwiLCBkb2MubmFtZSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbXCJjX1wiICsgZG9jLnNwYWNlICsgXCJfXCIgKyBkb2MubmFtZV0uX2NvbGxlY3Rpb24uZHJvcENvbGxlY3Rpb24oKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNfXCIgKyBkb2Muc3BhY2UgKyBcIl9cIiArIGRvYy5uYW1lLCBcIlwiICsgZS5zdGFjayk7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5a+56LGhKFwiICsgZG9jLm5hbWUgKyBcIinkuI3lrZjlnKjmiJblt7LooqvliKDpmaRcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iLCJfc3luY1RvT2JqZWN0ID0gKGRvYykgLT5cclxuXHRvYmplY3RfZmllbGRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS5maW5kKHtzcGFjZTogZG9jLnNwYWNlLCBvYmplY3Q6IGRvYy5vYmplY3R9LCB7XHJcblx0XHRmaWVsZHM6IHtcclxuXHRcdFx0Y3JlYXRlZDogMCxcclxuXHRcdFx0bW9kaWZpZWQ6IDAsXHJcblx0XHRcdG93bmVyOiAwLFxyXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxyXG5cdFx0XHRtb2RpZmllZF9ieTogMFxyXG5cdFx0fVxyXG5cdH0pLmZldGNoKClcclxuXHJcblx0ZmllbGRzID0ge31cclxuXHJcblx0dGFibGVfZmllbGRzID0ge31cclxuXHJcblx0Xy5mb3JFYWNoIG9iamVjdF9maWVsZHMsIChmKS0+XHJcblx0XHRpZiAvXlthLXpBLVpfXVxcdyooXFwuXFwkXFwuXFx3Kyl7MX1bYS16QS1aMC05XSokLy50ZXN0KGYubmFtZSlcclxuXHRcdFx0Y2ZfYXJyID0gZi5uYW1lLnNwbGl0KFwiLiQuXCIpXHJcblx0XHRcdGNoaWxkX2ZpZWxkcyA9IHt9XHJcblx0XHRcdGNoaWxkX2ZpZWxkc1tjZl9hcnJbMV1dID0gZlxyXG5cdFx0XHRpZiAhXy5zaXplKHRhYmxlX2ZpZWxkc1tjZl9hcnJbMF1dKVxyXG5cdFx0XHRcdHRhYmxlX2ZpZWxkc1tjZl9hcnJbMF1dID0ge31cclxuXHRcdFx0Xy5leHRlbmQodGFibGVfZmllbGRzW2NmX2FyclswXV0sIGNoaWxkX2ZpZWxkcylcclxuXHRcdGVsc2VcclxuXHRcdFx0ZmllbGRzW2YubmFtZV0gPSBmXHJcblxyXG5cdF8uZWFjaCB0YWJsZV9maWVsZHMsIChmLCBrKS0+XHJcblx0XHRpZiBmaWVsZHNba10udHlwZSA9PSBcImdyaWRcIlxyXG5cdFx0XHRpZiAhXy5zaXplKGZpZWxkc1trXS5maWVsZHMpXHJcblx0XHRcdFx0ZmllbGRzW2tdLmZpZWxkcyA9IHt9XHJcblx0XHRcdF8uZXh0ZW5kKGZpZWxkc1trXS5maWVsZHMsIGYpXHJcblxyXG5cdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikudXBkYXRlKHtzcGFjZTogZG9jLnNwYWNlLCBuYW1lOiBkb2Mub2JqZWN0fSwge1xyXG5cdFx0JHNldDpcclxuXHRcdFx0ZmllbGRzOiBmaWVsZHNcclxuXHR9KVxyXG5cclxuaXNSZXBlYXRlZE5hbWUgPSAoZG9jLCBuYW1lKS0+XHJcblx0b3RoZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfZmllbGRzXCIpLmZpbmQoe29iamVjdDogZG9jLm9iamVjdCwgIHNwYWNlOiBkb2Muc3BhY2UsIF9pZDogeyRuZTogZG9jLl9pZH0sIG5hbWU6IG5hbWUgfHwgZG9jLm5hbWV9LCB7ZmllbGRzOntfaWQ6IDF9fSlcclxuXHRpZiBvdGhlci5jb3VudCgpID4gMFxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHRyZXR1cm4gZmFsc2VcclxuXHJcbkNyZWF0b3IuT2JqZWN0cy5vYmplY3RfZmllbGRzID1cclxuXHRuYW1lOiBcIm9iamVjdF9maWVsZHNcIlxyXG5cdGljb246IFwib3JkZXJzXCJcclxuXHRlbmFibGVfYXBpOiB0cnVlXHJcblx0bGFiZWw6XCLlrZfmrrVcIlxyXG5cdGZpZWxkczpcclxuXHRcdG5hbWU6XHJcblx0XHRcdHR5cGU6IFwidGV4dFwiXHJcblx0XHRcdHNlYXJjaGFibGU6IHRydWVcclxuXHRcdFx0aW5kZXg6IHRydWVcclxuXHRcdFx0cmVxdWlyZWQ6IHRydWVcclxuXHRcdFx0cmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZFxyXG5cdFx0bGFiZWw6XHJcblx0XHRcdHR5cGU6IFwidGV4dFwiXHJcblx0XHRpc19uYW1lOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cdFx0XHRoaWRkZW46IHRydWVcclxuXHRcdG9iamVjdDpcclxuXHRcdFx0dHlwZTogXCJtYXN0ZXJfZGV0YWlsXCJcclxuXHRcdFx0cmVmZXJlbmNlX3RvOiBcIm9iamVjdHNcIlxyXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZVxyXG5cdFx0XHRvcHRpb25zRnVuY3Rpb246ICgpLT5cclxuXHRcdFx0XHRfb3B0aW9ucyA9IFtdXHJcblx0XHRcdFx0Xy5mb3JFYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG8sIGspLT5cclxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBvLmxhYmVsLCB2YWx1ZTogaywgaWNvbjogby5pY29ufVxyXG5cdFx0XHRcdHJldHVybiBfb3B0aW9uc1xyXG5cdFx0dHlwZTpcclxuXHRcdFx0dHlwZTogXCJzZWxlY3RcIlxyXG4jXHRcdFx0cmVxdWlyZWQ6IHRydWVcclxuXHRcdFx0b3B0aW9uczpcclxuXHRcdFx0XHR0ZXh0OiBcIuaWh+acrFwiLFxyXG5cdFx0XHRcdHRleHRhcmVhOiBcIumVv+aWh+acrFwiXHJcblx0XHRcdFx0aHRtbDogXCJIdG1s5paH5pysXCIsXHJcblx0XHRcdFx0c2VsZWN0OiBcIumAieaLqeahhlwiLFxyXG5cdFx0XHRcdGJvb2xlYW46IFwiQ2hlY2tib3hcIlxyXG5cdFx0XHRcdGRhdGU6IFwi5pel5pyfXCJcclxuXHRcdFx0XHRkYXRldGltZTogXCLml6XmnJ/ml7bpl7RcIlxyXG5cdFx0XHRcdG51bWJlcjogXCLmlbDlgLxcIlxyXG5cdFx0XHRcdGN1cnJlbmN5OiBcIumHkeminVwiXHJcblx0XHRcdFx0cGFzc3dvcmQ6IFwi5a+G56CBXCJcclxuXHRcdFx0XHRsb29rdXA6IFwi55u45YWz6KGoXCJcclxuXHRcdFx0XHRtYXN0ZXJfZGV0YWlsOiBcIuS4u+ihqC/lrZDooahcIlxyXG5cdFx0XHRcdGdyaWQ6IFwi6KGo5qC8XCJcclxuXHRcdFx0XHR1cmw6IFwi572R5Z2AXCJcclxuXHRcdFx0XHRlbWFpbDogXCLpgq7ku7blnLDlnYBcIlxyXG5cdFx0c29ydF9ubzpcclxuXHRcdFx0bGFiZWw6IFwi5o6S5bqP5Y+3XCJcclxuXHRcdFx0dHlwZTogXCJudW1iZXJcIlxyXG5cdFx0XHRkZWZhdWx0VmFsdWU6IDEwMFxyXG5cdFx0XHRzY2FsZTogMFxyXG5cdFx0XHRzb3J0YWJsZTogdHJ1ZVxyXG5cclxuXHRcdGdyb3VwOlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cclxuXHRcdGRlZmF1bHRWYWx1ZTpcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHJcblx0XHRhbGxvd2VkVmFsdWVzOlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cdFx0XHRtdWx0aXBsZTogdHJ1ZVxyXG5cclxuXHRcdG11bHRpcGxlOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cclxuXHRcdHJlcXVpcmVkOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cclxuXHRcdGlzX3dpZGU6XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXHJcblxyXG5cdFx0cmVhZG9ubHk6XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXHJcblxyXG4jXHRcdGRpc2FibGVkOlxyXG4jXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHRcdGhpZGRlbjpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHRcdCNUT0RPIOWwhuatpOWKn+iDveW8gOaUvue7meeUqOaIt+aXtu+8jOmcgOimgeWFs+mXreatpOWxnuaAp1xyXG5cdFx0b21pdDpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHJcblx0XHRpbmRleDpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHJcblx0XHRzZWFyY2hhYmxlOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cclxuXHRcdHNvcnRhYmxlOlxyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxyXG5cclxuXHRcdHByZWNpc2lvbjpcclxuXHRcdFx0dHlwZTogXCJjdXJyZW5jeVwiXHJcblx0XHRcdGRlZmF1bHRWYWx1ZTogMThcclxuXHJcblx0XHRzY2FsZTpcclxuXHRcdFx0dHlwZTogXCJjdXJyZW5jeVwiXHJcblx0XHRcdGRlZmF1bHRWYWx1ZTogMlxyXG5cclxuXHRcdHJlZmVyZW5jZV90bzogI+WcqOacjeWKoeerr+WkhOeQhuatpOWtl+auteWAvO+8jOWmguaenOWwj+S6jjLkuKrvvIzliJnlrZjlgqjkuLrlrZfnrKbkuLLvvIzlkKbliJnlrZjlgqjkuLrmlbDnu4RcclxuXHRcdFx0dHlwZTogXCJsb29rdXBcIlxyXG5cdFx0XHRvcHRpb25zRnVuY3Rpb246ICgpLT5cclxuXHRcdFx0XHRfb3B0aW9ucyA9IFtdXHJcblx0XHRcdFx0Xy5mb3JFYWNoIENyZWF0b3IuT2JqZWN0cywgKG8sIGspLT5cclxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBvLmxhYmVsLCB2YWx1ZTogaywgaWNvbjogby5pY29ufVxyXG5cdFx0XHRcdHJldHVybiBfb3B0aW9uc1xyXG4jXHRcdFx0bXVsdGlwbGU6IHRydWUgI+WFiOS/ruaUueS4uuWNlemAiVxyXG5cclxuXHRcdHJvd3M6XHJcblx0XHRcdHR5cGU6IFwiY3VycmVuY3lcIlxyXG5cclxuXHRcdG9wdGlvbnM6XHJcblx0XHRcdHR5cGU6IFwidGV4dGFyZWFcIlxyXG5cdFx0XHRpc193aWRlOiB0cnVlXHJcblxyXG5cdFx0ZGVzY3JpcHRpb246XHJcblx0XHRcdGxhYmVsOiBcIkRlc2NyaXB0aW9uXCJcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHRcdFx0aXNfd2lkZTogdHJ1ZVxyXG5cclxuXHRsaXN0X3ZpZXdzOlxyXG5cdFx0YWxsOlxyXG5cdFx0XHRjb2x1bW5zOiBbXCJuYW1lXCIsIFwibGFiZWxcIiwgXCJ0eXBlXCIsIFwib2JqZWN0XCIsIFwic29ydF9ub1wiLCBcIm1vZGlmaWVkXCJdXHJcblx0XHRcdHNvcnQ6IFt7ZmllbGRfbmFtZTogXCJzb3J0X25vXCIsIG9yZGVyOiBcImFzY1wifV1cclxuXHRcdFx0ZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcclxuXHJcblx0cGVybWlzc2lvbl9zZXQ6XHJcblx0XHR1c2VyOlxyXG5cdFx0XHRhbGxvd0NyZWF0ZTogZmFsc2VcclxuXHRcdFx0YWxsb3dEZWxldGU6IGZhbHNlXHJcblx0XHRcdGFsbG93RWRpdDogZmFsc2VcclxuXHRcdFx0YWxsb3dSZWFkOiBmYWxzZVxyXG5cdFx0XHRtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZVxyXG5cdFx0XHR2aWV3QWxsUmVjb3JkczogZmFsc2VcclxuXHRcdGFkbWluOlxyXG5cdFx0XHRhbGxvd0NyZWF0ZTogdHJ1ZVxyXG5cdFx0XHRhbGxvd0RlbGV0ZTogdHJ1ZVxyXG5cdFx0XHRhbGxvd0VkaXQ6IHRydWVcclxuXHRcdFx0YWxsb3dSZWFkOiB0cnVlXHJcblx0XHRcdG1vZGlmeUFsbFJlY29yZHM6IHRydWVcclxuXHRcdFx0dmlld0FsbFJlY29yZHM6IHRydWVcclxuXHJcblx0dHJpZ2dlcnM6XHRcdFx0XHRcclxuXHRcdFwiYWZ0ZXIuaW5zZXJ0LnNlcnZlci5vYmplY3RfZmllbGRzXCI6XHJcblx0XHRcdG9uOiBcInNlcnZlclwiXHJcblx0XHRcdHdoZW46IFwiYWZ0ZXIuaW5zZXJ0XCJcclxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jKS0+XHJcblx0XHRcdFx0X3N5bmNUb09iamVjdChkb2MpXHJcblx0XHRcImFmdGVyLnVwZGF0ZS5zZXJ2ZXIub2JqZWN0X2ZpZWxkc1wiOlxyXG5cdFx0XHRvbjogXCJzZXJ2ZXJcIlxyXG5cdFx0XHR3aGVuOiBcImFmdGVyLnVwZGF0ZVwiXHJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxyXG5cdFx0XHRcdF9zeW5jVG9PYmplY3QoZG9jKVxyXG5cdFx0XCJhZnRlci5yZW1vdmUuc2VydmVyLm9iamVjdF9maWVsZHNcIjpcclxuXHRcdFx0b246IFwic2VydmVyXCJcclxuXHRcdFx0d2hlbjogXCJhZnRlci5yZW1vdmVcIlxyXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MpLT5cclxuXHRcdFx0XHRfc3luY1RvT2JqZWN0KGRvYylcclxuXHRcdFwiYmVmb3JlLnVwZGF0ZS5zZXJ2ZXIub2JqZWN0X2ZpZWxkc1wiOlxyXG5cdFx0XHRvbjogXCJzZXJ2ZXJcIlxyXG5cdFx0XHR3aGVuOiBcImJlZm9yZS51cGRhdGVcIlxyXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKS0+XHJcblx0XHRcdFx0aWYgZG9jLm5hbWUgPT0gJ25hbWUnICYmIG1vZGlmaWVyPy4kc2V0Py5uYW1lICYmIGRvYy5uYW1lICE9IG1vZGlmaWVyLiRzZXQubmFtZVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5LiN6IO95L+u5pS55q2k57qq5b2V55qEbmFtZeWxnuaAp1wiXHJcblx0XHRcdFx0aWYgbW9kaWZpZXI/LiRzZXQ/Lm5hbWUgJiYgaXNSZXBlYXRlZE5hbWUoZG9jLCBtb2RpZmllci4kc2V0Lm5hbWUpXHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcInVwZGF0ZSBmaWVsZHPlr7nosaHlkI3np7DkuI3og73ph43lpI0je2RvYy5uYW1lfVwiKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCJcclxuXHJcblx0XHRcdFx0aWYgbW9kaWZpZXI/LiRzZXQ/LnJlZmVyZW5jZV90b1xyXG5cdFx0XHRcdFx0aWYgbW9kaWZpZXIuJHNldC5yZWZlcmVuY2VfdG8ubGVuZ3RoID09IDFcclxuXHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90byA9IG1vZGlmaWVyLiRzZXQucmVmZXJlbmNlX3RvWzBdXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBtb2RpZmllci4kc2V0LnJlZmVyZW5jZV90b1xyXG5cdFx0XHRcdGlmIG1vZGlmaWVyPy4kc2V0Py5pbmRleCBhbmQgKG1vZGlmaWVyPy4kc2V0Py50eXBlID09ICd0ZXh0YXJlYScgb3IgbW9kaWZpZXI/LiRzZXQ/LnR5cGUgPT0gJ2h0bWwnKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5aSa6KGM5paH5pys5LiN5pSv5oyB5bu656uL57Si5byVXCJcclxuXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLmZpbmRPbmUoe19pZDogZG9jLm9iamVjdH0sIHtmaWVsZHM6IHtuYW1lOiAxLCBsYWJlbDogMX19KVxyXG5cclxuXHRcdFx0XHRpZiBvYmplY3RcclxuXHJcblx0XHRcdFx0XHRvYmplY3RfZG9jdW1lbnRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdC5uYW1lKS5maW5kKClcclxuXHRcdFx0XHRcdGlmIG1vZGlmaWVyPy4kc2V0Py5yZWZlcmVuY2VfdG8gJiYgZG9jLnJlZmVyZW5jZV90byAhPSBfcmVmZXJlbmNlX3RvICYmIG9iamVjdF9kb2N1bWVudHMuY291bnQoKSA+IDBcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5a+56LGhI3tvYmplY3QubGFiZWx95Lit5bey57uP5pyJ6K6w5b2V77yM5LiN6IO95L+u5pS5cmVmZXJlbmNlX3Rv5a2X5q61XCJcclxuXHJcblx0XHRcdFx0XHRpZiBtb2RpZmllcj8uJHVuc2V0Py5yZWZlcmVuY2VfdG8gJiYgZG9jLnJlZmVyZW5jZV90byAhPSBfcmVmZXJlbmNlX3RvICYmIG9iamVjdF9kb2N1bWVudHMuY291bnQoKSA+IDBcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5a+56LGhI3tvYmplY3QubGFiZWx95Lit5bey57uP5pyJ6K6w5b2V77yM5LiN6IO95L+u5pS5cmVmZXJlbmNlX3Rv5a2X5q61XCJcclxuI1x0XHRcdFx0XHRpZiBtb2RpZmllcj8uJHNldD8ucmVmZXJlbmNlX3RvXHJcbiNcdFx0XHRcdFx0XHRpZiBtb2RpZmllci4kc2V0LnJlZmVyZW5jZV90by5sZW5ndGggPT0gMVxyXG4jXHRcdFx0XHRcdFx0XHRtb2RpZmllci4kc2V0LnJlZmVyZW5jZV90byA9IG1vZGlmaWVyLiRzZXQucmVmZXJlbmNlX3RvWzBdXHJcblxyXG5cdFx0XCJiZWZvcmUuaW5zZXJ0LnNlcnZlci5vYmplY3RfZmllbGRzXCI6XHJcblx0XHRcdG9uOiBcInNlcnZlclwiXHJcblx0XHRcdHdoZW46IFwiYmVmb3JlLmluc2VydFwiXHJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxyXG5cclxuI1x0XHRcdFx0aWYgZG9jLnJlZmVyZW5jZV90bz8ubGVuZ3RoID09IDFcclxuI1x0XHRcdFx0XHRkb2MucmVmZXJlbmNlX3RvID0gZG9jLnJlZmVyZW5jZV90b1swXVxyXG5cclxuXHRcdFx0XHRpZiBpc1JlcGVhdGVkTmFtZShkb2MpXHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcImluc2VydCBmaWVsZHPlr7nosaHlkI3np7DkuI3og73ph43lpI0je2RvYy5uYW1lfVwiKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCJcclxuXHRcdFx0XHRpZiBkb2M/LmluZGV4IGFuZCAoZG9jPy50eXBlID09ICd0ZXh0YXJlYScgb3IgZG9jPy50eXBlID09ICdodG1sJylcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCflpJrooYzmlofmnKzkuI3mlK/mjIHlu7rnq4vntKLlvJUnXHJcblx0XHRcImJlZm9yZS5yZW1vdmUuc2VydmVyLm9iamVjdF9maWVsZHNcIjpcclxuXHRcdFx0b246IFwic2VydmVyXCJcclxuXHRcdFx0d2hlbjogXCJiZWZvcmUucmVtb3ZlXCJcclxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jKS0+XHJcblx0XHRcdFx0aWYgZG9jLm5hbWUgPT0gXCJuYW1lXCJcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuS4jeiDveWIoOmZpOatpOe6quW9lVwiXHJcblxyXG5cclxuIiwidmFyIF9zeW5jVG9PYmplY3QsIGlzUmVwZWF0ZWROYW1lO1xuXG5fc3luY1RvT2JqZWN0ID0gZnVuY3Rpb24oZG9jKSB7XG4gIHZhciBmaWVsZHMsIG9iamVjdF9maWVsZHMsIHRhYmxlX2ZpZWxkcztcbiAgb2JqZWN0X2ZpZWxkcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9maWVsZHNcIikuZmluZCh7XG4gICAgc3BhY2U6IGRvYy5zcGFjZSxcbiAgICBvYmplY3Q6IGRvYy5vYmplY3RcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgb3duZXI6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZldGNoKCk7XG4gIGZpZWxkcyA9IHt9O1xuICB0YWJsZV9maWVsZHMgPSB7fTtcbiAgXy5mb3JFYWNoKG9iamVjdF9maWVsZHMsIGZ1bmN0aW9uKGYpIHtcbiAgICB2YXIgY2ZfYXJyLCBjaGlsZF9maWVsZHM7XG4gICAgaWYgKC9eW2EtekEtWl9dXFx3KihcXC5cXCRcXC5cXHcrKXsxfVthLXpBLVowLTldKiQvLnRlc3QoZi5uYW1lKSkge1xuICAgICAgY2ZfYXJyID0gZi5uYW1lLnNwbGl0KFwiLiQuXCIpO1xuICAgICAgY2hpbGRfZmllbGRzID0ge307XG4gICAgICBjaGlsZF9maWVsZHNbY2ZfYXJyWzFdXSA9IGY7XG4gICAgICBpZiAoIV8uc2l6ZSh0YWJsZV9maWVsZHNbY2ZfYXJyWzBdXSkpIHtcbiAgICAgICAgdGFibGVfZmllbGRzW2NmX2FyclswXV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfLmV4dGVuZCh0YWJsZV9maWVsZHNbY2ZfYXJyWzBdXSwgY2hpbGRfZmllbGRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpZWxkc1tmLm5hbWVdID0gZjtcbiAgICB9XG4gIH0pO1xuICBfLmVhY2godGFibGVfZmllbGRzLCBmdW5jdGlvbihmLCBrKSB7XG4gICAgaWYgKGZpZWxkc1trXS50eXBlID09PSBcImdyaWRcIikge1xuICAgICAgaWYgKCFfLnNpemUoZmllbGRzW2tdLmZpZWxkcykpIHtcbiAgICAgICAgZmllbGRzW2tdLmZpZWxkcyA9IHt9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIF8uZXh0ZW5kKGZpZWxkc1trXS5maWVsZHMsIGYpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLnVwZGF0ZSh7XG4gICAgc3BhY2U6IGRvYy5zcGFjZSxcbiAgICBuYW1lOiBkb2Mub2JqZWN0XG4gIH0sIHtcbiAgICAkc2V0OiB7XG4gICAgICBmaWVsZHM6IGZpZWxkc1xuICAgIH1cbiAgfSk7XG59O1xuXG5pc1JlcGVhdGVkTmFtZSA9IGZ1bmN0aW9uKGRvYywgbmFtZSkge1xuICB2YXIgb3RoZXI7XG4gIG90aGVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2ZpZWxkc1wiKS5maW5kKHtcbiAgICBvYmplY3Q6IGRvYy5vYmplY3QsXG4gICAgc3BhY2U6IGRvYy5zcGFjZSxcbiAgICBfaWQ6IHtcbiAgICAgICRuZTogZG9jLl9pZFxuICAgIH0sXG4gICAgbmFtZTogbmFtZSB8fCBkb2MubmFtZVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBfaWQ6IDFcbiAgICB9XG4gIH0pO1xuICBpZiAob3RoZXIuY291bnQoKSA+IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5DcmVhdG9yLk9iamVjdHMub2JqZWN0X2ZpZWxkcyA9IHtcbiAgbmFtZTogXCJvYmplY3RfZmllbGRzXCIsXG4gIGljb246IFwib3JkZXJzXCIsXG4gIGVuYWJsZV9hcGk6IHRydWUsXG4gIGxhYmVsOiBcIuWtl+autVwiLFxuICBmaWVsZHM6IHtcbiAgICBuYW1lOiB7XG4gICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgIHNlYXJjaGFibGU6IHRydWUsXG4gICAgICBpbmRleDogdHJ1ZSxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZFxuICAgIH0sXG4gICAgbGFiZWw6IHtcbiAgICAgIHR5cGU6IFwidGV4dFwiXG4gICAgfSxcbiAgICBpc19uYW1lOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0sXG4gICAgb2JqZWN0OiB7XG4gICAgICB0eXBlOiBcIm1hc3Rlcl9kZXRhaWxcIixcbiAgICAgIHJlZmVyZW5jZV90bzogXCJvYmplY3RzXCIsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIG9wdGlvbnNGdW5jdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfb3B0aW9ucztcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgZnVuY3Rpb24obywgaykge1xuICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgIGxhYmVsOiBvLmxhYmVsLFxuICAgICAgICAgICAgdmFsdWU6IGssXG4gICAgICAgICAgICBpY29uOiBvLmljb25cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucztcbiAgICAgIH1cbiAgICB9LFxuICAgIHR5cGU6IHtcbiAgICAgIHR5cGU6IFwic2VsZWN0XCIsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIHRleHQ6IFwi5paH5pysXCIsXG4gICAgICAgIHRleHRhcmVhOiBcIumVv+aWh+acrFwiLFxuICAgICAgICBodG1sOiBcIkh0bWzmlofmnKxcIixcbiAgICAgICAgc2VsZWN0OiBcIumAieaLqeahhlwiLFxuICAgICAgICBib29sZWFuOiBcIkNoZWNrYm94XCIsXG4gICAgICAgIGRhdGU6IFwi5pel5pyfXCIsXG4gICAgICAgIGRhdGV0aW1lOiBcIuaXpeacn+aXtumXtFwiLFxuICAgICAgICBudW1iZXI6IFwi5pWw5YC8XCIsXG4gICAgICAgIGN1cnJlbmN5OiBcIumHkeminVwiLFxuICAgICAgICBwYXNzd29yZDogXCLlr4bnoIFcIixcbiAgICAgICAgbG9va3VwOiBcIuebuOWFs+ihqFwiLFxuICAgICAgICBtYXN0ZXJfZGV0YWlsOiBcIuS4u+ihqC/lrZDooahcIixcbiAgICAgICAgZ3JpZDogXCLooajmoLxcIixcbiAgICAgICAgdXJsOiBcIue9keWdgFwiLFxuICAgICAgICBlbWFpbDogXCLpgq7ku7blnLDlnYBcIlxuICAgICAgfVxuICAgIH0sXG4gICAgc29ydF9ubzoge1xuICAgICAgbGFiZWw6IFwi5o6S5bqP5Y+3XCIsXG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdFZhbHVlOiAxMDAsXG4gICAgICBzY2FsZTogMCxcbiAgICAgIHNvcnRhYmxlOiB0cnVlXG4gICAgfSxcbiAgICBncm91cDoge1xuICAgICAgdHlwZTogXCJ0ZXh0XCJcbiAgICB9LFxuICAgIGRlZmF1bHRWYWx1ZToge1xuICAgICAgdHlwZTogXCJ0ZXh0XCJcbiAgICB9LFxuICAgIGFsbG93ZWRWYWx1ZXM6IHtcbiAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgbXVsdGlwbGU6IHRydWVcbiAgICB9LFxuICAgIG11bHRpcGxlOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIH0sXG4gICAgcmVxdWlyZWQ6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBpc193aWRlOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIH0sXG4gICAgcmVhZG9ubHk6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBoaWRkZW46IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBvbWl0OiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIH0sXG4gICAgaW5kZXg6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBzZWFyY2hhYmxlOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIH0sXG4gICAgc29ydGFibGU6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgfSxcbiAgICBwcmVjaXNpb246IHtcbiAgICAgIHR5cGU6IFwiY3VycmVuY3lcIixcbiAgICAgIGRlZmF1bHRWYWx1ZTogMThcbiAgICB9LFxuICAgIHNjYWxlOiB7XG4gICAgICB0eXBlOiBcImN1cnJlbmN5XCIsXG4gICAgICBkZWZhdWx0VmFsdWU6IDJcbiAgICB9LFxuICAgIHJlZmVyZW5jZV90bzoge1xuICAgICAgdHlwZTogXCJsb29rdXBcIixcbiAgICAgIG9wdGlvbnNGdW5jdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfb3B0aW9ucztcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24obywgaykge1xuICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgIGxhYmVsOiBvLmxhYmVsLFxuICAgICAgICAgICAgdmFsdWU6IGssXG4gICAgICAgICAgICBpY29uOiBvLmljb25cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucztcbiAgICAgIH1cbiAgICB9LFxuICAgIHJvd3M6IHtcbiAgICAgIHR5cGU6IFwiY3VycmVuY3lcIlxuICAgIH0sXG4gICAgb3B0aW9uczoge1xuICAgICAgdHlwZTogXCJ0ZXh0YXJlYVwiLFxuICAgICAgaXNfd2lkZTogdHJ1ZVxuICAgIH0sXG4gICAgZGVzY3JpcHRpb246IHtcbiAgICAgIGxhYmVsOiBcIkRlc2NyaXB0aW9uXCIsXG4gICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgIGlzX3dpZGU6IHRydWVcbiAgICB9XG4gIH0sXG4gIGxpc3Rfdmlld3M6IHtcbiAgICBhbGw6IHtcbiAgICAgIGNvbHVtbnM6IFtcIm5hbWVcIiwgXCJsYWJlbFwiLCBcInR5cGVcIiwgXCJvYmplY3RcIiwgXCJzb3J0X25vXCIsIFwibW9kaWZpZWRcIl0sXG4gICAgICBzb3J0OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmaWVsZF9uYW1lOiBcInNvcnRfbm9cIixcbiAgICAgICAgICBvcmRlcjogXCJhc2NcIlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcbiAgICB9XG4gIH0sXG4gIHBlcm1pc3Npb25fc2V0OiB7XG4gICAgdXNlcjoge1xuICAgICAgYWxsb3dDcmVhdGU6IGZhbHNlLFxuICAgICAgYWxsb3dEZWxldGU6IGZhbHNlLFxuICAgICAgYWxsb3dFZGl0OiBmYWxzZSxcbiAgICAgIGFsbG93UmVhZDogZmFsc2UsXG4gICAgICBtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZSxcbiAgICAgIHZpZXdBbGxSZWNvcmRzOiBmYWxzZVxuICAgIH0sXG4gICAgYWRtaW46IHtcbiAgICAgIGFsbG93Q3JlYXRlOiB0cnVlLFxuICAgICAgYWxsb3dEZWxldGU6IHRydWUsXG4gICAgICBhbGxvd0VkaXQ6IHRydWUsXG4gICAgICBhbGxvd1JlYWQ6IHRydWUsXG4gICAgICBtb2RpZnlBbGxSZWNvcmRzOiB0cnVlLFxuICAgICAgdmlld0FsbFJlY29yZHM6IHRydWVcbiAgICB9XG4gIH0sXG4gIHRyaWdnZXJzOiB7XG4gICAgXCJhZnRlci5pbnNlcnQuc2VydmVyLm9iamVjdF9maWVsZHNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImFmdGVyLmluc2VydFwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgcmV0dXJuIF9zeW5jVG9PYmplY3QoZG9jKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYWZ0ZXIudXBkYXRlLnNlcnZlci5vYmplY3RfZmllbGRzXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJhZnRlci51cGRhdGVcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICAgIHJldHVybiBfc3luY1RvT2JqZWN0KGRvYyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcImFmdGVyLnJlbW92ZS5zZXJ2ZXIub2JqZWN0X2ZpZWxkc1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYWZ0ZXIucmVtb3ZlXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICByZXR1cm4gX3N5bmNUb09iamVjdChkb2MpO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJiZWZvcmUudXBkYXRlLnNlcnZlci5vYmplY3RfZmllbGRzXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJiZWZvcmUudXBkYXRlXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIF9yZWZlcmVuY2VfdG8sIG9iamVjdCwgb2JqZWN0X2RvY3VtZW50cywgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZWY1LCByZWY2LCByZWY3O1xuICAgICAgICBpZiAoZG9jLm5hbWUgPT09ICduYW1lJyAmJiAobW9kaWZpZXIgIT0gbnVsbCA/IChyZWYgPSBtb2RpZmllci4kc2V0KSAhPSBudWxsID8gcmVmLm5hbWUgOiB2b2lkIDAgOiB2b2lkIDApICYmIGRvYy5uYW1lICE9PSBtb2RpZmllci4kc2V0Lm5hbWUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLkuI3og73kv67mlLnmraTnuqrlvZXnmoRuYW1l5bGe5oCnXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgobW9kaWZpZXIgIT0gbnVsbCA/IChyZWYxID0gbW9kaWZpZXIuJHNldCkgIT0gbnVsbCA/IHJlZjEubmFtZSA6IHZvaWQgMCA6IHZvaWQgMCkgJiYgaXNSZXBlYXRlZE5hbWUoZG9jLCBtb2RpZmllci4kc2V0Lm5hbWUpKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJ1cGRhdGUgZmllbGRz5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCIgKyBkb2MubmFtZSk7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtb2RpZmllciAhPSBudWxsID8gKHJlZjIgPSBtb2RpZmllci4kc2V0KSAhPSBudWxsID8gcmVmMi5yZWZlcmVuY2VfdG8gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICBpZiAobW9kaWZpZXIuJHNldC5yZWZlcmVuY2VfdG8ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gbW9kaWZpZXIuJHNldC5yZWZlcmVuY2VfdG9bMF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBtb2RpZmllci4kc2V0LnJlZmVyZW5jZV90bztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChtb2RpZmllciAhPSBudWxsID8gKHJlZjMgPSBtb2RpZmllci4kc2V0KSAhPSBudWxsID8gcmVmMy5pbmRleCA6IHZvaWQgMCA6IHZvaWQgMCkgJiYgKChtb2RpZmllciAhPSBudWxsID8gKHJlZjQgPSBtb2RpZmllci4kc2V0KSAhPSBudWxsID8gcmVmNC50eXBlIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gJ3RleHRhcmVhJyB8fCAobW9kaWZpZXIgIT0gbnVsbCA/IChyZWY1ID0gbW9kaWZpZXIuJHNldCkgIT0gbnVsbCA/IHJlZjUudHlwZSA6IHZvaWQgMCA6IHZvaWQgMCkgPT09ICdodG1sJykpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLlpJrooYzmlofmnKzkuI3mlK/mjIHlu7rnq4vntKLlvJVcIik7XG4gICAgICAgIH1cbiAgICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS5maW5kT25lKHtcbiAgICAgICAgICBfaWQ6IGRvYy5vYmplY3RcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICAgIGxhYmVsOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG9iamVjdCkge1xuICAgICAgICAgIG9iamVjdF9kb2N1bWVudHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0Lm5hbWUpLmZpbmQoKTtcbiAgICAgICAgICBpZiAoKG1vZGlmaWVyICE9IG51bGwgPyAocmVmNiA9IG1vZGlmaWVyLiRzZXQpICE9IG51bGwgPyByZWY2LnJlZmVyZW5jZV90byA6IHZvaWQgMCA6IHZvaWQgMCkgJiYgZG9jLnJlZmVyZW5jZV90byAhPT0gX3JlZmVyZW5jZV90byAmJiBvYmplY3RfZG9jdW1lbnRzLmNvdW50KCkgPiAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLlr7nosaFcIiArIG9iamVjdC5sYWJlbCArIFwi5Lit5bey57uP5pyJ6K6w5b2V77yM5LiN6IO95L+u5pS5cmVmZXJlbmNlX3Rv5a2X5q61XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoKG1vZGlmaWVyICE9IG51bGwgPyAocmVmNyA9IG1vZGlmaWVyLiR1bnNldCkgIT0gbnVsbCA/IHJlZjcucmVmZXJlbmNlX3RvIDogdm9pZCAwIDogdm9pZCAwKSAmJiBkb2MucmVmZXJlbmNlX3RvICE9PSBfcmVmZXJlbmNlX3RvICYmIG9iamVjdF9kb2N1bWVudHMuY291bnQoKSA+IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuWvueixoVwiICsgb2JqZWN0LmxhYmVsICsgXCLkuK3lt7Lnu4/mnInorrDlvZXvvIzkuI3og73kv67mlLlyZWZlcmVuY2VfdG/lrZfmrrVcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcImJlZm9yZS5pbnNlcnQuc2VydmVyLm9iamVjdF9maWVsZHNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImJlZm9yZS5pbnNlcnRcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICAgIGlmIChpc1JlcGVhdGVkTmFtZShkb2MpKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJpbnNlcnQgZmllbGRz5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCIgKyBkb2MubmFtZSk7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgoZG9jICE9IG51bGwgPyBkb2MuaW5kZXggOiB2b2lkIDApICYmICgoZG9jICE9IG51bGwgPyBkb2MudHlwZSA6IHZvaWQgMCkgPT09ICd0ZXh0YXJlYScgfHwgKGRvYyAhPSBudWxsID8gZG9jLnR5cGUgOiB2b2lkIDApID09PSAnaHRtbCcpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsICflpJrooYzmlofmnKzkuI3mlK/mjIHlu7rnq4vntKLlvJUnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJiZWZvcmUucmVtb3ZlLnNlcnZlci5vYmplY3RfZmllbGRzXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJiZWZvcmUucmVtb3ZlXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICBpZiAoZG9jLm5hbWUgPT09IFwibmFtZVwiKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5LiN6IO95Yig6Zmk5q2k57qq5b2VXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIiwiX3N5bmNUb09iamVjdCA9IChkb2MpIC0+XHJcblx0b2JqZWN0X3RyaWdnZXJzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3RyaWdnZXJzXCIpLmZpbmQoe3NwYWNlOiBkb2Muc3BhY2UsIG9iamVjdDogZG9jLm9iamVjdCwgaXNfZW5hYmxlOiB0cnVlfSwge1xyXG5cdFx0ZmllbGRzOiB7XHJcblx0XHRcdGNyZWF0ZWQ6IDAsXHJcblx0XHRcdG1vZGlmaWVkOiAwLFxyXG5cdFx0XHRvd25lcjogMCxcclxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcclxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcclxuXHRcdH1cclxuXHR9KS5mZXRjaCgpXHJcblxyXG5cdHRyaWdnZXJzID0ge31cclxuXHJcblx0Xy5mb3JFYWNoIG9iamVjdF90cmlnZ2VycywgKGYpLT5cclxuXHRcdHRyaWdnZXJzW2YubmFtZV0gPSBmXHJcblxyXG5cdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikudXBkYXRlKHtzcGFjZTogZG9jLnNwYWNlLCBuYW1lOiBkb2Mub2JqZWN0fSwge1xyXG5cdFx0JHNldDpcclxuXHRcdFx0dHJpZ2dlcnM6IHRyaWdnZXJzXHJcblx0fSlcclxuXHJcbmlzUmVwZWF0ZWROYW1lID0gKGRvYywgbmFtZSktPlxyXG5cdG90aGVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3RyaWdnZXJzXCIpLmZpbmQoe29iamVjdDogZG9jLm9iamVjdCwgIHNwYWNlOiBkb2Muc3BhY2UsIF9pZDogeyRuZTogZG9jLl9pZH0sIG5hbWU6IG5hbWUgfHwgZG9jLm5hbWV9LCB7ZmllbGRzOntfaWQ6IDF9fSlcclxuXHRpZiBvdGhlci5jb3VudCgpID4gMFxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHRyZXR1cm4gZmFsc2VcclxuXHJcbmNoZWNrID0gKHVzZXJJZCwgZG9jKS0+XHJcblx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4odXNlcklkLCBkb2Muc3BhY2UpXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCLlj6rmnInlt6XkvZzljrvnrqHnkIblkZjmiY3og73phY3nva7op6blj5HlmahcIlxyXG5cclxuXHQjVE9ETyDmoKHpqozlhbPplK7lrZfvvJpyZW1vdmXjgIEgZHJvcOOAgWRlbGV0ZeOAgWRi44CBY29sbGVjdGlvbuOAgWV2YWznrYnvvIznhLblkI7lj5bmtogg5LyB5Lia54mI54mI6ZmQ5Yi2XHJcblx0aWYgZG9jLm9uID09ICdzZXJ2ZXInICYmICFTdGVlZG9zLmlzTGVnYWxWZXJzaW9uKGRvYy5zcGFjZSxcIndvcmtmbG93LmVudGVycHJpc2VcIilcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIuWPquacieS8geS4mueJiOaUr+aMgemFjee9ruacjeWKoeerr+eahOinpuWPkeWZqFwiXHJcblxyXG5DcmVhdG9yLk9iamVjdHMub2JqZWN0X3RyaWdnZXJzID1cclxuXHRuYW1lOiBcIm9iamVjdF90cmlnZ2Vyc1wiXHJcblx0aWNvbjogXCJhc3NldF9yZWxhdGlvbnNoaXBcIlxyXG5cdGxhYmVsOlwi6Kem5Y+R5ZmoXCJcclxuXHRmaWVsZHM6XHJcblx0XHRuYW1lOlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cdFx0XHRzZWFyY2hhYmxlOiB0cnVlXHJcblx0XHRcdGluZGV4OiB0cnVlXHJcblx0XHRcdHJlcXVpcmVkOiB0cnVlXHJcblx0XHRcdHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZVxyXG5cdFx0bGFiZWw6XHJcblx0XHRcdHR5cGU6IFwidGV4dFwiXHJcblx0XHRvYmplY3Q6XHJcblx0XHRcdHR5cGU6IFwibWFzdGVyX2RldGFpbFwiXHJcblx0XHRcdHJlZmVyZW5jZV90bzogXCJvYmplY3RzXCJcclxuXHRcdFx0cmVxdWlyZWQ6IHRydWVcclxuXHRcdFx0b3B0aW9uc0Z1bmN0aW9uOiAoKS0+XHJcblx0XHRcdFx0X29wdGlvbnMgPSBbXVxyXG5cdFx0XHRcdF8uZm9yRWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvLCBrKS0+XHJcblx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogby5sYWJlbCwgdmFsdWU6IGssIGljb246IG8uaWNvbn1cclxuXHRcdFx0XHRyZXR1cm4gX29wdGlvbnNcclxuXHRcdG9uOlxyXG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXHJcblx0XHRcdHJlcXVpcmVkOiB0cnVlXHJcblx0XHRcdG9wdGlvbnNGdW5jdGlvbjogKCktPlxyXG5cdFx0XHRcdHJldHVybiBbe2xhYmVsOiBcIuWuouaIt+err1wiLCB2YWx1ZTogXCJjbGllbnRcIiwgaWNvbjogXCJhZGRyZXNzXCJ9LCB7bGFiZWw6IFwi5pyN5Yqh56uvXCIsIHZhbHVlOiBcInNlcnZlclwiLCBpY29uOiBcImFkZHJlc3NcIn1dXHJcblx0XHR3aGVuOlxyXG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXHJcblx0XHRcdHJlcXVpcmVkOiB0cnVlXHJcblx0XHRcdG9wdGlvbnNGdW5jdGlvbjogKCktPlxyXG5cdFx0XHRcdFtcclxuXHRcdFx0XHRcdHtsYWJlbDogXCLmlrDlop7orrDlvZXkuYvliY1cIiwgdmFsdWU6IFwiYmVmb3JlLmluc2VydFwiLCBpY29uOiBcImFzc2V0X3JlbGF0aW9uc2hpcFwifVxyXG5cdFx0XHRcdFx0e2xhYmVsOiBcIuaWsOWinuiusOW9leS5i+WQjlwiLCB2YWx1ZTogXCJhZnRlci5pbnNlcnRcIiwgaWNvbjogXCJhc3NldF9yZWxhdGlvbnNoaXBcIn1cclxuXHRcdFx0XHRcdHtsYWJlbDogXCLkv67mlLnorrDlvZXkuYvliY1cIiwgdmFsdWU6IFwiYmVmb3JlLnVwZGF0ZVwiLCBpY29uOiBcImFzc2V0X3JlbGF0aW9uc2hpcFwifVxyXG5cdFx0XHRcdFx0e2xhYmVsOiBcIuS/ruaUueiusOW9leS5i+WQjlwiLCB2YWx1ZTogXCJhZnRlci51cGRhdGVcIiwgaWNvbjogXCJhc3NldF9yZWxhdGlvbnNoaXBcIn1cclxuXHRcdFx0XHRcdHtsYWJlbDogXCLliKDpmaTorrDlvZXkuYvliY1cIiwgdmFsdWU6IFwiYmVmb3JlLnJlbW92ZVwiLCBpY29uOiBcImFzc2V0X3JlbGF0aW9uc2hpcFwifVxyXG5cdFx0XHRcdFx0e2xhYmVsOiBcIuWIoOmZpOiusOW9leS5i+WQjlwiLCB2YWx1ZTogXCJhZnRlci5yZW1vdmVcIiwgaWNvbjogXCJhc3NldF9yZWxhdGlvbnNoaXBcIn1cclxuXHRcdFx0XHRdXHJcblx0XHRpc19lbmFibGU6XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXHJcblx0XHR0b2RvOlxyXG5cdFx0XHR0eXBlOiBcInRleHRhcmVhXCJcclxuXHRcdFx0cmVxdWlyZWQ6IHRydWVcclxuXHRcdFx0aXNfd2lkZTp0cnVlXHJcblxyXG5cdGxpc3Rfdmlld3M6XHJcblx0XHRhbGw6XHJcblx0XHRcdGNvbHVtbnM6IFtcIm5hbWVcIiwgXCJsYWJlbFwiLCBcIm9iamVjdFwiLCBcIm9uXCIsIFwid2hlblwiLCBcImlzX2VuYWJsZVwiXVxyXG5cdFx0XHRmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxyXG5cclxuXHRwZXJtaXNzaW9uX3NldDpcclxuXHRcdHVzZXI6XHJcblx0XHRcdGFsbG93Q3JlYXRlOiBmYWxzZVxyXG5cdFx0XHRhbGxvd0RlbGV0ZTogZmFsc2VcclxuXHRcdFx0YWxsb3dFZGl0OiBmYWxzZVxyXG5cdFx0XHRhbGxvd1JlYWQ6IGZhbHNlXHJcblx0XHRcdG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlXHJcblx0XHRcdHZpZXdBbGxSZWNvcmRzOiBmYWxzZVxyXG5cdFx0YWRtaW46XHJcblx0XHRcdGFsbG93Q3JlYXRlOiB0cnVlXHJcblx0XHRcdGFsbG93RGVsZXRlOiB0cnVlXHJcblx0XHRcdGFsbG93RWRpdDogdHJ1ZVxyXG5cdFx0XHRhbGxvd1JlYWQ6IHRydWVcclxuXHRcdFx0bW9kaWZ5QWxsUmVjb3JkczogdHJ1ZVxyXG5cdFx0XHR2aWV3QWxsUmVjb3JkczogdHJ1ZVxyXG5cclxuXHR0cmlnZ2VyczpcclxuXHRcdFwiYWZ0ZXIuaW5zZXJ0LnNlcnZlci5vYmplY3RfdHJpZ2dlcnNcIjpcclxuXHRcdFx0b246IFwic2VydmVyXCJcclxuXHRcdFx0d2hlbjogXCJhZnRlci5pbnNlcnRcIlxyXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MpLT5cclxuXHRcdFx0XHRfc3luY1RvT2JqZWN0KGRvYylcclxuXHRcdFwiYWZ0ZXIudXBkYXRlLnNlcnZlci5vYmplY3RfdHJpZ2dlcnNcIjpcclxuXHRcdFx0b246IFwic2VydmVyXCJcclxuXHRcdFx0d2hlbjogXCJhZnRlci51cGRhdGVcIlxyXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MpLT5cclxuXHRcdFx0XHRfc3luY1RvT2JqZWN0KGRvYylcclxuXHRcdFwiYWZ0ZXIucmVtb3ZlLnNlcnZlci5vYmplY3RfdHJpZ2dlcnNcIjpcclxuXHRcdFx0b246IFwic2VydmVyXCJcclxuXHRcdFx0d2hlbjogXCJhZnRlci5yZW1vdmVcIlxyXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MpLT5cclxuXHRcdFx0XHRfc3luY1RvT2JqZWN0KGRvYylcclxuXHJcblx0XHRcImJlZm9yZS5kZWxldGUuc2VydmVyLm9iamVjdF90cmlnZ2Vyc1wiOlxyXG5cdFx0XHRvbjogXCJzZXJ2ZXJcIlxyXG5cdFx0XHR3aGVuOiBcImJlZm9yZS5yZW1vdmVcIlxyXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MpLT5cclxuXHRcdFx0XHRjaGVjayh1c2VySWQsIGRvYylcclxuXHJcblx0XHRcImJlZm9yZS51cGRhdGUuc2VydmVyLm9iamVjdF90cmlnZ2Vyc1wiOlxyXG5cdFx0XHRvbjogXCJzZXJ2ZXJcIlxyXG5cdFx0XHR3aGVuOiBcImJlZm9yZS51cGRhdGVcIlxyXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKS0+XHJcblx0XHRcdFx0Y2hlY2sodXNlcklkLCBkb2MpXHJcblx0XHRcdFx0aWYgbW9kaWZpZXI/LiRzZXQ/Lm5hbWUgJiYgaXNSZXBlYXRlZE5hbWUoZG9jLCBtb2RpZmllci4kc2V0Lm5hbWUpXHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcInVwZGF0ZSB0cmlnZ2Vyc+WvueixoeWQjeensOS4jeiDvemHjeWkjSN7ZG9jLm5hbWV9XCIpXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCLlr7nosaHlkI3np7DkuI3og73ph43lpI0je2RvYy5uYW1lfVwiXHJcblxyXG5cdFx0XCJiZWZvcmUuaW5zZXJ0LnNlcnZlci5vYmplY3RfdHJpZ2dlcnNcIjpcclxuXHRcdFx0b246IFwic2VydmVyXCJcclxuXHRcdFx0d2hlbjogXCJiZWZvcmUuaW5zZXJ0XCJcclxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jKS0+XHJcblx0XHRcdFx0Y2hlY2sodXNlcklkLCBkb2MpXHJcblx0XHRcdFx0aWYgaXNSZXBlYXRlZE5hbWUoZG9jKVxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJpbnNlcnQgdHJpZ2dlcnPlr7nosaHlkI3np7DkuI3og73ph43lpI0je2RvYy5uYW1lfVwiKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwi5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCIiLCJ2YXIgX3N5bmNUb09iamVjdCwgY2hlY2ssIGlzUmVwZWF0ZWROYW1lO1xuXG5fc3luY1RvT2JqZWN0ID0gZnVuY3Rpb24oZG9jKSB7XG4gIHZhciBvYmplY3RfdHJpZ2dlcnMsIHRyaWdnZXJzO1xuICBvYmplY3RfdHJpZ2dlcnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfdHJpZ2dlcnNcIikuZmluZCh7XG4gICAgc3BhY2U6IGRvYy5zcGFjZSxcbiAgICBvYmplY3Q6IGRvYy5vYmplY3QsXG4gICAgaXNfZW5hYmxlOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIG93bmVyOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICB0cmlnZ2VycyA9IHt9O1xuICBfLmZvckVhY2gob2JqZWN0X3RyaWdnZXJzLCBmdW5jdGlvbihmKSB7XG4gICAgcmV0dXJuIHRyaWdnZXJzW2YubmFtZV0gPSBmO1xuICB9KTtcbiAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikudXBkYXRlKHtcbiAgICBzcGFjZTogZG9jLnNwYWNlLFxuICAgIG5hbWU6IGRvYy5vYmplY3RcbiAgfSwge1xuICAgICRzZXQ6IHtcbiAgICAgIHRyaWdnZXJzOiB0cmlnZ2Vyc1xuICAgIH1cbiAgfSk7XG59O1xuXG5pc1JlcGVhdGVkTmFtZSA9IGZ1bmN0aW9uKGRvYywgbmFtZSkge1xuICB2YXIgb3RoZXI7XG4gIG90aGVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X3RyaWdnZXJzXCIpLmZpbmQoe1xuICAgIG9iamVjdDogZG9jLm9iamVjdCxcbiAgICBzcGFjZTogZG9jLnNwYWNlLFxuICAgIF9pZDoge1xuICAgICAgJG5lOiBkb2MuX2lkXG4gICAgfSxcbiAgICBuYW1lOiBuYW1lIHx8IGRvYy5uYW1lXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIF9pZDogMVxuICAgIH1cbiAgfSk7XG4gIGlmIChvdGhlci5jb3VudCgpID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNoZWNrID0gZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKHVzZXJJZCwgZG9jLnNwYWNlKSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuWPquacieW3peS9nOWOu+euoeeQhuWRmOaJjeiDvemFjee9ruinpuWPkeWZqFwiKTtcbiAgfVxuICBpZiAoZG9jLm9uID09PSAnc2VydmVyJyAmJiAhU3RlZWRvcy5pc0xlZ2FsVmVyc2lvbihkb2Muc3BhY2UsIFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiKSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuWPquacieS8geS4mueJiOaUr+aMgemFjee9ruacjeWKoeerr+eahOinpuWPkeWZqFwiKTtcbiAgfVxufTtcblxuQ3JlYXRvci5PYmplY3RzLm9iamVjdF90cmlnZ2VycyA9IHtcbiAgbmFtZTogXCJvYmplY3RfdHJpZ2dlcnNcIixcbiAgaWNvbjogXCJhc3NldF9yZWxhdGlvbnNoaXBcIixcbiAgbGFiZWw6IFwi6Kem5Y+R5ZmoXCIsXG4gIGZpZWxkczoge1xuICAgIG5hbWU6IHtcbiAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgc2VhcmNoYWJsZTogdHJ1ZSxcbiAgICAgIGluZGV4OiB0cnVlLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGVcbiAgICB9LFxuICAgIGxhYmVsOiB7XG4gICAgICB0eXBlOiBcInRleHRcIlxuICAgIH0sXG4gICAgb2JqZWN0OiB7XG4gICAgICB0eXBlOiBcIm1hc3Rlcl9kZXRhaWxcIixcbiAgICAgIHJlZmVyZW5jZV90bzogXCJvYmplY3RzXCIsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIG9wdGlvbnNGdW5jdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfb3B0aW9ucztcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgZnVuY3Rpb24obywgaykge1xuICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgIGxhYmVsOiBvLmxhYmVsLFxuICAgICAgICAgICAgdmFsdWU6IGssXG4gICAgICAgICAgICBpY29uOiBvLmljb25cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucztcbiAgICAgIH1cbiAgICB9LFxuICAgIG9uOiB7XG4gICAgICB0eXBlOiBcImxvb2t1cFwiLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBvcHRpb25zRnVuY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiBcIuWuouaIt+err1wiLFxuICAgICAgICAgICAgdmFsdWU6IFwiY2xpZW50XCIsXG4gICAgICAgICAgICBpY29uOiBcImFkZHJlc3NcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxhYmVsOiBcIuacjeWKoeerr1wiLFxuICAgICAgICAgICAgdmFsdWU6IFwic2VydmVyXCIsXG4gICAgICAgICAgICBpY29uOiBcImFkZHJlc3NcIlxuICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHdoZW46IHtcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIG9wdGlvbnNGdW5jdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6IFwi5paw5aKe6K6w5b2V5LmL5YmNXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCJiZWZvcmUuaW5zZXJ0XCIsXG4gICAgICAgICAgICBpY29uOiBcImFzc2V0X3JlbGF0aW9uc2hpcFwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbGFiZWw6IFwi5paw5aKe6K6w5b2V5LmL5ZCOXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCJhZnRlci5pbnNlcnRcIixcbiAgICAgICAgICAgIGljb246IFwiYXNzZXRfcmVsYXRpb25zaGlwXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBsYWJlbDogXCLkv67mlLnorrDlvZXkuYvliY1cIixcbiAgICAgICAgICAgIHZhbHVlOiBcImJlZm9yZS51cGRhdGVcIixcbiAgICAgICAgICAgIGljb246IFwiYXNzZXRfcmVsYXRpb25zaGlwXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBsYWJlbDogXCLkv67mlLnorrDlvZXkuYvlkI5cIixcbiAgICAgICAgICAgIHZhbHVlOiBcImFmdGVyLnVwZGF0ZVwiLFxuICAgICAgICAgICAgaWNvbjogXCJhc3NldF9yZWxhdGlvbnNoaXBcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxhYmVsOiBcIuWIoOmZpOiusOW9leS5i+WJjVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwiYmVmb3JlLnJlbW92ZVwiLFxuICAgICAgICAgICAgaWNvbjogXCJhc3NldF9yZWxhdGlvbnNoaXBcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxhYmVsOiBcIuWIoOmZpOiusOW9leS5i+WQjlwiLFxuICAgICAgICAgICAgdmFsdWU6IFwiYWZ0ZXIucmVtb3ZlXCIsXG4gICAgICAgICAgICBpY29uOiBcImFzc2V0X3JlbGF0aW9uc2hpcFwiXG4gICAgICAgICAgfVxuICAgICAgICBdO1xuICAgICAgfVxuICAgIH0sXG4gICAgaXNfZW5hYmxlOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgIH0sXG4gICAgdG9kbzoge1xuICAgICAgdHlwZTogXCJ0ZXh0YXJlYVwiLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBpc193aWRlOiB0cnVlXG4gICAgfVxuICB9LFxuICBsaXN0X3ZpZXdzOiB7XG4gICAgYWxsOiB7XG4gICAgICBjb2x1bW5zOiBbXCJuYW1lXCIsIFwibGFiZWxcIiwgXCJvYmplY3RcIiwgXCJvblwiLCBcIndoZW5cIiwgXCJpc19lbmFibGVcIl0sXG4gICAgICBmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxuICAgIH1cbiAgfSxcbiAgcGVybWlzc2lvbl9zZXQ6IHtcbiAgICB1c2VyOiB7XG4gICAgICBhbGxvd0NyZWF0ZTogZmFsc2UsXG4gICAgICBhbGxvd0RlbGV0ZTogZmFsc2UsXG4gICAgICBhbGxvd0VkaXQ6IGZhbHNlLFxuICAgICAgYWxsb3dSZWFkOiBmYWxzZSxcbiAgICAgIG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlLFxuICAgICAgdmlld0FsbFJlY29yZHM6IGZhbHNlXG4gICAgfSxcbiAgICBhZG1pbjoge1xuICAgICAgYWxsb3dDcmVhdGU6IHRydWUsXG4gICAgICBhbGxvd0RlbGV0ZTogdHJ1ZSxcbiAgICAgIGFsbG93RWRpdDogdHJ1ZSxcbiAgICAgIGFsbG93UmVhZDogdHJ1ZSxcbiAgICAgIG1vZGlmeUFsbFJlY29yZHM6IHRydWUsXG4gICAgICB2aWV3QWxsUmVjb3JkczogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgdHJpZ2dlcnM6IHtcbiAgICBcImFmdGVyLmluc2VydC5zZXJ2ZXIub2JqZWN0X3RyaWdnZXJzXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJhZnRlci5pbnNlcnRcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICAgIHJldHVybiBfc3luY1RvT2JqZWN0KGRvYyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcImFmdGVyLnVwZGF0ZS5zZXJ2ZXIub2JqZWN0X3RyaWdnZXJzXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJhZnRlci51cGRhdGVcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICAgIHJldHVybiBfc3luY1RvT2JqZWN0KGRvYyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcImFmdGVyLnJlbW92ZS5zZXJ2ZXIub2JqZWN0X3RyaWdnZXJzXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJhZnRlci5yZW1vdmVcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICAgIHJldHVybiBfc3luY1RvT2JqZWN0KGRvYyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcImJlZm9yZS5kZWxldGUuc2VydmVyLm9iamVjdF90cmlnZ2Vyc1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYmVmb3JlLnJlbW92ZVwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgcmV0dXJuIGNoZWNrKHVzZXJJZCwgZG9jKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYmVmb3JlLnVwZGF0ZS5zZXJ2ZXIub2JqZWN0X3RyaWdnZXJzXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJiZWZvcmUudXBkYXRlXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHJlZjtcbiAgICAgICAgY2hlY2sodXNlcklkLCBkb2MpO1xuICAgICAgICBpZiAoKG1vZGlmaWVyICE9IG51bGwgPyAocmVmID0gbW9kaWZpZXIuJHNldCkgIT0gbnVsbCA/IHJlZi5uYW1lIDogdm9pZCAwIDogdm9pZCAwKSAmJiBpc1JlcGVhdGVkTmFtZShkb2MsIG1vZGlmaWVyLiRzZXQubmFtZSkpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInVwZGF0ZSB0cmlnZ2Vyc+WvueixoeWQjeensOS4jeiDvemHjeWkjVwiICsgZG9jLm5hbWUpO1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuWvueixoeWQjeensOS4jeiDvemHjeWkjVwiICsgZG9jLm5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcImJlZm9yZS5pbnNlcnQuc2VydmVyLm9iamVjdF90cmlnZ2Vyc1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYmVmb3JlLmluc2VydFwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgY2hlY2sodXNlcklkLCBkb2MpO1xuICAgICAgICBpZiAoaXNSZXBlYXRlZE5hbWUoZG9jKSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5zZXJ0IHRyaWdnZXJz5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCIgKyBkb2MubmFtZSk7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIiwiX3N5bmNUb09iamVjdCA9IChkb2MpIC0+XHJcblx0b2JqZWN0X2FjdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfYWN0aW9uc1wiKS5maW5kKHtvYmplY3Q6IGRvYy5vYmplY3QsIHNwYWNlOiBkb2Muc3BhY2UsIGlzX2VuYWJsZTogdHJ1ZX0sIHtcclxuXHRcdGZpZWxkczoge1xyXG5cdFx0XHRjcmVhdGVkOiAwLFxyXG5cdFx0XHRtb2RpZmllZDogMCxcclxuXHRcdFx0b3duZXI6IDAsXHJcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXHJcblx0XHRcdG1vZGlmaWVkX2J5OiAwXHJcblx0XHR9XHJcblx0fSkuZmV0Y2goKVxyXG5cclxuXHRhY3Rpb25zID0ge31cclxuXHJcblx0Xy5mb3JFYWNoIG9iamVjdF9hY3Rpb25zLCAoZiktPlxyXG5cdFx0YWN0aW9uc1tmLm5hbWVdID0gZlxyXG5cclxuXHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLnVwZGF0ZSh7c3BhY2U6IGRvYy5zcGFjZSwgbmFtZTogZG9jLm9iamVjdH0sIHtcclxuXHRcdCRzZXQ6XHJcblx0XHRcdGFjdGlvbnM6IGFjdGlvbnNcclxuXHR9KVxyXG5pc1JlcGVhdGVkTmFtZSA9IChkb2MsIG5hbWUpLT5cclxuXHRvdGhlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9hY3Rpb25zXCIpLmZpbmQoe29iamVjdDogZG9jLm9iamVjdCwgIHNwYWNlOiBkb2Muc3BhY2UsIF9pZDogeyRuZTogZG9jLl9pZH0sIG5hbWU6IG5hbWUgfHwgZG9jLm5hbWV9LCB7ZmllbGRzOntfaWQ6IDF9fSlcclxuXHRpZiBvdGhlci5jb3VudCgpID4gMFxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHRyZXR1cm4gZmFsc2VcclxuQ3JlYXRvci5PYmplY3RzLm9iamVjdF9hY3Rpb25zID1cclxuXHRuYW1lOiBcIm9iamVjdF9hY3Rpb25zXCJcclxuXHRsYWJlbDogXCLlr7nosaHmk43kvZxcIlxyXG5cdGljb246IFwibWFya2V0aW5nX2FjdGlvbnNcIlxyXG5cdGZpZWxkczpcclxuXHRcdG9iamVjdDpcclxuXHRcdFx0dHlwZTogXCJtYXN0ZXJfZGV0YWlsXCJcclxuXHRcdFx0cmVmZXJlbmNlX3RvOiBcIm9iamVjdHNcIlxyXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZVxyXG5cdFx0XHRvcHRpb25zRnVuY3Rpb246ICgpLT5cclxuXHRcdFx0XHRfb3B0aW9ucyA9IFtdXHJcblx0XHRcdFx0Xy5mb3JFYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG8sIGspLT5cclxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiBvLmxhYmVsLCB2YWx1ZTogaywgaWNvbjogby5pY29ufVxyXG5cdFx0XHRcdHJldHVybiBfb3B0aW9uc1xyXG5cdFx0bmFtZTpcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHRcdFx0c2VhcmNoYWJsZTp0cnVlXHJcblx0XHRcdGluZGV4OnRydWVcclxuXHRcdFx0cmVxdWlyZWQ6IHRydWVcclxuXHRcdFx0cmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlXHJcblx0XHRsYWJlbDpcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHRcdGlzX2VuYWJsZTpcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuXHRcdHZpc2libGU6XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXHJcblx0XHRcdG9taXQ6IHRydWVcclxuXHRcdG9uOlxyXG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXHJcblx0XHRcdGlzX3dpZGU6dHJ1ZVxyXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZVxyXG5cdFx0XHRvcHRpb25zRnVuY3Rpb246ICgpLT5cclxuXHRcdFx0XHRbXHJcblx0XHRcdFx0XHR7bGFiZWw6IFwi5pi+56S65Zyo5YiX6KGo5Y+z5LiK6KeSXCIsIHZhbHVlOiBcImxpc3RcIiwgaWNvbjogXCJjb250YWN0X2xpc3RcIn1cclxuXHRcdFx0XHRcdHtsYWJlbDogXCLmmL7npLrlnKjorrDlvZXmn6XnnIvpobXlj7PkuIrop5JcIiwgdmFsdWU6IFwicmVjb3JkXCIsIGljb246IFwiY29udHJhY3RcIn1cclxuXHRcdFx0XHRdXHJcblx0XHR0b2RvOlxyXG5cdFx0XHRsYWJlbDogXCLmiafooYznmoTohJrmnKxcIlxyXG5cdFx0XHR0eXBlOiBcInRleHRhcmVhXCJcclxuXHRcdFx0cmVxdWlyZWQ6IHRydWVcclxuXHRcdFx0aXNfd2lkZTp0cnVlXHJcblxyXG5cclxuXHRsaXN0X3ZpZXdzOlxyXG5cdFx0YWxsOlxyXG5cdFx0XHRjb2x1bW5zOiBbXCJuYW1lXCIsIFwibGFiZWxcIiwgXCJvYmplY3RcIiwgXCJvblwiLCBcImlzX2VuYWJsZVwiLCBcIm1vZGlmaWVkXCJdXHJcblx0XHRcdGZpbHRlcl9zY29wZTogXCJzcGFjZVwiXHJcblxyXG5cdHBlcm1pc3Npb25fc2V0OlxyXG5cdFx0dXNlcjpcclxuXHRcdFx0YWxsb3dDcmVhdGU6IGZhbHNlXHJcblx0XHRcdGFsbG93RGVsZXRlOiBmYWxzZVxyXG5cdFx0XHRhbGxvd0VkaXQ6IGZhbHNlXHJcblx0XHRcdGFsbG93UmVhZDogZmFsc2VcclxuXHRcdFx0bW9kaWZ5QWxsUmVjb3JkczogZmFsc2VcclxuXHRcdFx0dmlld0FsbFJlY29yZHM6IGZhbHNlXHJcblx0XHRhZG1pbjpcclxuXHRcdFx0YWxsb3dDcmVhdGU6IHRydWVcclxuXHRcdFx0YWxsb3dEZWxldGU6IHRydWVcclxuXHRcdFx0YWxsb3dFZGl0OiB0cnVlXHJcblx0XHRcdGFsbG93UmVhZDogdHJ1ZVxyXG5cdFx0XHRtb2RpZnlBbGxSZWNvcmRzOiB0cnVlXHJcblx0XHRcdHZpZXdBbGxSZWNvcmRzOiB0cnVlXHJcblxyXG5cdHRyaWdnZXJzOlxyXG5cdFx0XCJhZnRlci5pbnNlcnQuc2VydmVyLm9iamVjdF9hY3Rpb25zXCI6XHJcblx0XHRcdG9uOiBcInNlcnZlclwiXHJcblx0XHRcdHdoZW46IFwiYWZ0ZXIuaW5zZXJ0XCJcclxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jKS0+XHJcblx0XHRcdFx0X3N5bmNUb09iamVjdChkb2MpXHJcblx0XHRcImFmdGVyLnVwZGF0ZS5zZXJ2ZXIub2JqZWN0X2FjdGlvbnNcIjpcclxuXHRcdFx0b246IFwic2VydmVyXCJcclxuXHRcdFx0d2hlbjogXCJhZnRlci51cGRhdGVcIlxyXG5cdFx0XHR0b2RvOiAodXNlcklkLCBkb2MpLT5cclxuXHRcdFx0XHRfc3luY1RvT2JqZWN0KGRvYylcclxuXHRcdFwiYWZ0ZXIucmVtb3ZlLnNlcnZlci5vYmplY3RfYWN0aW9uc1wiOlxyXG5cdFx0XHRvbjogXCJzZXJ2ZXJcIlxyXG5cdFx0XHR3aGVuOiBcImFmdGVyLnJlbW92ZVwiXHJcblx0XHRcdHRvZG86ICh1c2VySWQsIGRvYyktPlxyXG5cdFx0XHRcdF9zeW5jVG9PYmplY3QoZG9jKVxyXG5cclxuXHRcdFwiYmVmb3JlLnVwZGF0ZS5zZXJ2ZXIub2JqZWN0X2FjdGlvbnNcIjpcclxuXHRcdFx0b246IFwic2VydmVyXCJcclxuXHRcdFx0d2hlbjogXCJiZWZvcmUudXBkYXRlXCJcclxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyktPlxyXG5cdFx0XHRcdGlmIG1vZGlmaWVyPy4kc2V0Py5uYW1lICYmIGlzUmVwZWF0ZWROYW1lKGRvYywgbW9kaWZpZXIuJHNldC5uYW1lKVxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJ1cGRhdGUgYWN0aW9uc+WvueixoeWQjeensOS4jeiDvemHjeWkjSN7ZG9jLm5hbWV9XCIpXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCLlr7nosaHlkI3np7DkuI3og73ph43lpI1cIlxyXG5cclxuXHRcdFwiYmVmb3JlLmluc2VydC5zZXJ2ZXIub2JqZWN0X2FjdGlvbnNcIjpcclxuXHRcdFx0b246IFwic2VydmVyXCJcclxuXHRcdFx0d2hlbjogXCJiZWZvcmUuaW5zZXJ0XCJcclxuXHRcdFx0dG9kbzogKHVzZXJJZCwgZG9jKS0+XHJcblx0XHRcdFx0ZG9jLnZpc2libGUgPSB0cnVlXHJcblx0XHRcdFx0aWYgaXNSZXBlYXRlZE5hbWUoZG9jKVxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJpbnNlcnQgYWN0aW9uc+WvueixoeWQjeensOS4jeiDvemHjeWkjSN7ZG9jLm5hbWV9XCIpXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCLlr7nosaHlkI3np7DkuI3og73ph43lpI0je2RvYy5uYW1lfVwiIiwidmFyIF9zeW5jVG9PYmplY3QsIGlzUmVwZWF0ZWROYW1lO1xuXG5fc3luY1RvT2JqZWN0ID0gZnVuY3Rpb24oZG9jKSB7XG4gIHZhciBhY3Rpb25zLCBvYmplY3RfYWN0aW9ucztcbiAgb2JqZWN0X2FjdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfYWN0aW9uc1wiKS5maW5kKHtcbiAgICBvYmplY3Q6IGRvYy5vYmplY3QsXG4gICAgc3BhY2U6IGRvYy5zcGFjZSxcbiAgICBpc19lbmFibGU6IHRydWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgb3duZXI6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZldGNoKCk7XG4gIGFjdGlvbnMgPSB7fTtcbiAgXy5mb3JFYWNoKG9iamVjdF9hY3Rpb25zLCBmdW5jdGlvbihmKSB7XG4gICAgcmV0dXJuIGFjdGlvbnNbZi5uYW1lXSA9IGY7XG4gIH0pO1xuICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS51cGRhdGUoe1xuICAgIHNwYWNlOiBkb2Muc3BhY2UsXG4gICAgbmFtZTogZG9jLm9iamVjdFxuICB9LCB7XG4gICAgJHNldDoge1xuICAgICAgYWN0aW9uczogYWN0aW9uc1xuICAgIH1cbiAgfSk7XG59O1xuXG5pc1JlcGVhdGVkTmFtZSA9IGZ1bmN0aW9uKGRvYywgbmFtZSkge1xuICB2YXIgb3RoZXI7XG4gIG90aGVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2FjdGlvbnNcIikuZmluZCh7XG4gICAgb2JqZWN0OiBkb2Mub2JqZWN0LFxuICAgIHNwYWNlOiBkb2Muc3BhY2UsXG4gICAgX2lkOiB7XG4gICAgICAkbmU6IGRvYy5faWRcbiAgICB9LFxuICAgIG5hbWU6IG5hbWUgfHwgZG9jLm5hbWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgX2lkOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKG90aGVyLmNvdW50KCkgPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5PYmplY3RzLm9iamVjdF9hY3Rpb25zID0ge1xuICBuYW1lOiBcIm9iamVjdF9hY3Rpb25zXCIsXG4gIGxhYmVsOiBcIuWvueixoeaTjeS9nFwiLFxuICBpY29uOiBcIm1hcmtldGluZ19hY3Rpb25zXCIsXG4gIGZpZWxkczoge1xuICAgIG9iamVjdDoge1xuICAgICAgdHlwZTogXCJtYXN0ZXJfZGV0YWlsXCIsXG4gICAgICByZWZlcmVuY2VfdG86IFwib2JqZWN0c1wiLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBvcHRpb25zRnVuY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX29wdGlvbnM7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKG8sIGspIHtcbiAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICBsYWJlbDogby5sYWJlbCxcbiAgICAgICAgICAgIHZhbHVlOiBrLFxuICAgICAgICAgICAgaWNvbjogby5pY29uXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gX29wdGlvbnM7XG4gICAgICB9XG4gICAgfSxcbiAgICBuYW1lOiB7XG4gICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgIHNlYXJjaGFibGU6IHRydWUsXG4gICAgICBpbmRleDogdHJ1ZSxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlXG4gICAgfSxcbiAgICBsYWJlbDoge1xuICAgICAgdHlwZTogXCJ0ZXh0XCJcbiAgICB9LFxuICAgIGlzX2VuYWJsZToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICB9LFxuICAgIHZpc2libGU6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgb21pdDogdHJ1ZVxuICAgIH0sXG4gICAgb246IHtcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICBpc193aWRlOiB0cnVlLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBvcHRpb25zRnVuY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiBcIuaYvuekuuWcqOWIl+ihqOWPs+S4iuinklwiLFxuICAgICAgICAgICAgdmFsdWU6IFwibGlzdFwiLFxuICAgICAgICAgICAgaWNvbjogXCJjb250YWN0X2xpc3RcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxhYmVsOiBcIuaYvuekuuWcqOiusOW9leafpeeci+mhteWPs+S4iuinklwiLFxuICAgICAgICAgICAgdmFsdWU6IFwicmVjb3JkXCIsXG4gICAgICAgICAgICBpY29uOiBcImNvbnRyYWN0XCJcbiAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgICB9XG4gICAgfSxcbiAgICB0b2RvOiB7XG4gICAgICBsYWJlbDogXCLmiafooYznmoTohJrmnKxcIixcbiAgICAgIHR5cGU6IFwidGV4dGFyZWFcIixcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaXNfd2lkZTogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgbGlzdF92aWV3czoge1xuICAgIGFsbDoge1xuICAgICAgY29sdW1uczogW1wibmFtZVwiLCBcImxhYmVsXCIsIFwib2JqZWN0XCIsIFwib25cIiwgXCJpc19lbmFibGVcIiwgXCJtb2RpZmllZFwiXSxcbiAgICAgIGZpbHRlcl9zY29wZTogXCJzcGFjZVwiXG4gICAgfVxuICB9LFxuICBwZXJtaXNzaW9uX3NldDoge1xuICAgIHVzZXI6IHtcbiAgICAgIGFsbG93Q3JlYXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RGVsZXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RWRpdDogZmFsc2UsXG4gICAgICBhbGxvd1JlYWQ6IGZhbHNlLFxuICAgICAgbW9kaWZ5QWxsUmVjb3JkczogZmFsc2UsXG4gICAgICB2aWV3QWxsUmVjb3JkczogZmFsc2VcbiAgICB9LFxuICAgIGFkbWluOiB7XG4gICAgICBhbGxvd0NyZWF0ZTogdHJ1ZSxcbiAgICAgIGFsbG93RGVsZXRlOiB0cnVlLFxuICAgICAgYWxsb3dFZGl0OiB0cnVlLFxuICAgICAgYWxsb3dSZWFkOiB0cnVlLFxuICAgICAgbW9kaWZ5QWxsUmVjb3JkczogdHJ1ZSxcbiAgICAgIHZpZXdBbGxSZWNvcmRzOiB0cnVlXG4gICAgfVxuICB9LFxuICB0cmlnZ2Vyczoge1xuICAgIFwiYWZ0ZXIuaW5zZXJ0LnNlcnZlci5vYmplY3RfYWN0aW9uc1wiOiB7XG4gICAgICBvbjogXCJzZXJ2ZXJcIixcbiAgICAgIHdoZW46IFwiYWZ0ZXIuaW5zZXJ0XCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICByZXR1cm4gX3N5bmNUb09iamVjdChkb2MpO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJhZnRlci51cGRhdGUuc2VydmVyLm9iamVjdF9hY3Rpb25zXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJhZnRlci51cGRhdGVcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICAgIHJldHVybiBfc3luY1RvT2JqZWN0KGRvYyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcImFmdGVyLnJlbW92ZS5zZXJ2ZXIub2JqZWN0X2FjdGlvbnNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImFmdGVyLnJlbW92ZVwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgcmV0dXJuIF9zeW5jVG9PYmplY3QoZG9jKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYmVmb3JlLnVwZGF0ZS5zZXJ2ZXIub2JqZWN0X2FjdGlvbnNcIjoge1xuICAgICAgb246IFwic2VydmVyXCIsXG4gICAgICB3aGVuOiBcImJlZm9yZS51cGRhdGVcIixcbiAgICAgIHRvZG86IGZ1bmN0aW9uKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucykge1xuICAgICAgICB2YXIgcmVmO1xuICAgICAgICBpZiAoKG1vZGlmaWVyICE9IG51bGwgPyAocmVmID0gbW9kaWZpZXIuJHNldCkgIT0gbnVsbCA/IHJlZi5uYW1lIDogdm9pZCAwIDogdm9pZCAwKSAmJiBpc1JlcGVhdGVkTmFtZShkb2MsIG1vZGlmaWVyLiRzZXQubmFtZSkpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInVwZGF0ZSBhY3Rpb25z5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCIgKyBkb2MubmFtZSk7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5a+56LGh5ZCN56ew5LiN6IO96YeN5aSNXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcImJlZm9yZS5pbnNlcnQuc2VydmVyLm9iamVjdF9hY3Rpb25zXCI6IHtcbiAgICAgIG9uOiBcInNlcnZlclwiLFxuICAgICAgd2hlbjogXCJiZWZvcmUuaW5zZXJ0XCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICBkb2MudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIGlmIChpc1JlcGVhdGVkTmFtZShkb2MpKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJpbnNlcnQgYWN0aW9uc+WvueixoeWQjeensOS4jeiDvemHjeWkjVwiICsgZG9jLm5hbWUpO1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuWvueixoeWQjeensOS4jeiDvemHjeWkjVwiICsgZG9jLm5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIl19
