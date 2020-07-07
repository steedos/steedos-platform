(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:audit":{"lib":{"audit_records.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/steedos_audit/lib/audit_records.coffee                                                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var clone, getLookupFieldModifier, getLookupFieldValue, insertRecord, transformFieldValue, updateRecord;
clone = require("clone");
Creator.AuditRecords = {};

getLookupFieldValue = function (reference_to, value, space_id) {
  var name_field_key, obj, previous_ids, reference_to_object, values;

  if (_.isArray(reference_to) && _.isObject(value)) {
    reference_to = value.o;
    previous_ids = value.ids;
  }

  if (!_.isArray(previous_ids)) {
    previous_ids = value ? [value] : [];
  }

  reference_to_object = Creator.getObject(reference_to, space_id);
  name_field_key = reference_to_object.NAME_FIELD_KEY;
  values = Creator.getCollection(reference_to, space_id).find({
    _id: {
      $in: previous_ids
    }
  }, {
    fields: (obj = {
      _id: 1
    }, obj["" + name_field_key] = 1, obj)
  }).fetch();
  values = Creator.getOrderlySetByIds(values, previous_ids);
  return _.pluck(values, name_field_key).join(',');
};

getLookupFieldModifier = function (field, value, space_id) {
  var reference_to;
  reference_to = field.reference_to;

  if (_.isFunction(reference_to)) {
    reference_to = reference_to();
  }

  if (_.isFunction(field.optionsFunction)) {
    if (_.isString(reference_to)) {
      if (value) {
        return getLookupFieldValue(reference_to, value, space_id);
      }
    } else {
      return '';
    }
  } else {
    return getLookupFieldValue(reference_to, value, space_id);
  }
}; /*
   字段值转换规则:
   1 日期 格式存储为 (String): 2018-01-02
   2 时间 格式存储为 (String): 2018-01-02 23:12
   2 lookup 和下拉框，都是对应的显示名称 (name | label)
   3 boolean 就存是/否
   4 多行文本\grid\lookup有optionsFunction并且没有reference_to时 不记录新旧值, 只记录修改时间, 修改人, 修改的字段显示名
    */

transformFieldValue = function (field, value, options) {
  var selected_value, space_id, utcOffset;

  if (_.isNull(value) || _.isUndefined(value)) {
    return;
  }

  utcOffset = options.utcOffset;
  space_id = options.space_id;

  switch (field.type) {
    case 'date':
      return moment.utc(value).format('YYYY-MM-DD');

    case 'datetime':
      return moment(value).utcOffset(utcOffset).format('YYYY-MM-DD HH:mm');

    case 'boolean':
      if (_.isBoolean(value)) {
        if (value) {
          return '是';
        } else {
          return '否';
        }
      }

      break;

    case 'select':
      if (_.isString(value)) {
        value = [value];
      }

      selected_value = _.map(field.options, function (option) {
        if (_.contains(value, option.value)) {
          return option.label;
        }
      });
      return _.compact(selected_value).join(',');

    case 'checkbox':
      if (_.isString(value)) {
        value = [value];
      }

      selected_value = _.map(field.options, function (option) {
        if (_.contains(value, option.value)) {
          return option.label;
        }
      });
      return _.compact(selected_value).join(',');

    case 'lookup':
      return getLookupFieldModifier(field, value, space_id);

    case 'master_detail':
      return getLookupFieldModifier(field, value, space_id);

    case 'textarea':
      return '';

    case 'code':
      return '';

    case 'html':
      return '';

    case 'markdown':
      return '';

    case 'grid':
      return '';

    default:
      return value;
  }
};

insertRecord = function (userId, object_name, new_doc) {
  var collection, doc, record_id, space_id;
  collection = Creator.getCollection("audit_records");
  space_id = new_doc.space;
  record_id = new_doc._id;
  doc = {
    _id: collection._makeNewID(),
    space: space_id,
    field_name: "已创建。",
    related_to: {
      o: object_name,
      ids: [record_id]
    }
  };
  return collection.insert(doc);
};

updateRecord = function (userId, object_name, new_doc, previous_doc, modifier) {
  var fields, modifierSet, modifierUnset, options, record_id, ref, space_id, utcOffset;
  space_id = new_doc.space;
  record_id = new_doc._id;
  fields = (ref = Creator.convertObject(clone(Creator.getObject(object_name, space_id)), space_id)) != null ? ref.fields : void 0;
  modifierSet = modifier.$set;
  modifierUnset = modifier.$unset; /* TODO utcOffset 应该来自数据库,待 #984 处理后 调整
                                   
                                      utcOffset = Creator.getCollection("users").findOne({_id: userId})?.utcOffset
                                   
                                   	if !_.isNumber(utcOffset)
                                   		utcOffset = 8
                                    */
  utcOffset = 8;
  options = {
    utcOffset: utcOffset,
    space_id: space_id
  };

  _.each(modifierSet, function (v, k) {
    var collection, db_new_value, db_previous_value, doc, field, new_value, previous_value;
    field = fields != null ? fields[k] : void 0;
    previous_value = previous_doc[k];
    new_value = v;
    db_previous_value = null;
    db_new_value = null;

    switch (field.type) {
      case 'date':
        if ((new_value != null ? new_value.toString() : void 0) !== (previous_value != null ? previous_value.toString() : void 0)) {
          if (new_value) {
            db_new_value = transformFieldValue(field, new_value, options);
          }

          if (previous_value) {
            db_previous_value = transformFieldValue(field, previous_value, options);
          }
        }

        break;

      case 'datetime':
        if ((new_value != null ? new_value.toString() : void 0) !== (previous_value != null ? previous_value.toString() : void 0)) {
          if (new_value) {
            db_new_value = transformFieldValue(field, new_value, options);
          }

          if (previous_value) {
            db_previous_value = transformFieldValue(field, previous_value, options);
          }
        }

        break;

      case 'textarea':
        if (previous_value !== new_value) {
          db_previous_value = transformFieldValue(field, previous_value, options);
          db_new_value = transformFieldValue(field, new_value, options);
        }

        break;

      case 'code':
        if (previous_value !== new_value) {
          db_previous_value = transformFieldValue(field, previous_value, options);
          db_new_value = transformFieldValue(field, new_value, options);
        }

        break;

      case 'html':
        if (previous_value !== new_value) {
          db_previous_value = transformFieldValue(field, previous_value, options);
          db_new_value = transformFieldValue(field, new_value, options);
        }

        break;

      case 'markdown':
        if (previous_value !== new_value) {
          db_previous_value = transformFieldValue(field, previous_value, options);
          db_new_value = transformFieldValue(field, new_value, options);
        }

        break;

      case 'grid':
        if (JSON.stringify(previous_value) !== JSON.stringify(new_value)) {
          db_previous_value = transformFieldValue(field, previous_value, options);
          db_new_value = transformFieldValue(field, new_value, options);
        }

        break;

      case 'boolean':
        if (previous_value !== new_value) {
          db_previous_value = transformFieldValue(field, previous_value, options);
          db_new_value = transformFieldValue(field, new_value, options);
        }

        break;

      case 'select':
        if ((previous_value != null ? previous_value.toString() : void 0) !== (new_value != null ? new_value.toString() : void 0)) {
          db_previous_value = transformFieldValue(field, previous_value, options);
          db_new_value = transformFieldValue(field, new_value, options);
        }

        break;

      case 'checkbox':
        if ((previous_value != null ? previous_value.toString() : void 0) !== (new_value != null ? new_value.toString() : void 0)) {
          db_previous_value = transformFieldValue(field, previous_value, options);
          db_new_value = transformFieldValue(field, new_value, options);
        }

        break;

      case 'lookup':
        if (JSON.stringify(previous_value) !== JSON.stringify(new_value)) {
          if (previous_value) {
            db_previous_value = transformFieldValue(field, previous_value, options);
          }

          if (new_value) {
            db_new_value = transformFieldValue(field, new_value, options);
          }
        }

        break;

      case 'master_detail':
        if (JSON.stringify(previous_value) !== JSON.stringify(new_value)) {
          if (previous_value) {
            db_previous_value = transformFieldValue(field, previous_value, options);
          }

          if (new_value) {
            db_new_value = transformFieldValue(field, new_value, options);
          }
        }

        break;

      default:
        if (new_value !== previous_value) {
          db_previous_value = previous_value;
          db_new_value = new_value;
        }

    }

    if (db_new_value !== null || db_previous_value !== null) {
      collection = Creator.getCollection("audit_records");
      doc = {
        _id: collection._makeNewID(),
        space: space_id,
        field_name: field.label || field.name,
        previous_value: db_previous_value,
        new_value: db_new_value,
        related_to: {
          o: object_name,
          ids: [record_id]
        }
      };
      return collection.insert(doc);
    }
  });

  return _.each(modifierUnset, function (v, k) {
    var collection, db_previous_value, doc, field, previous_value;
    field = fields != null ? fields[k] : void 0;
    previous_value = previous_doc[k];

    if (previous_value || _.isBoolean(previous_value)) {
      collection = Creator.getCollection("audit_records");
      db_previous_value = transformFieldValue(field, previous_value, options);
      doc = {
        _id: collection._makeNewID(),
        space: space_id,
        field_name: field.label || field.name,
        previous_value: db_previous_value,
        related_to: {
          o: object_name,
          ids: [record_id]
        }
      };
      return collection.insert(doc);
    }
  });
};

Creator.AuditRecords.add = function (action, userId, object_name, new_doc, previous_doc, modifier) {
  if (action === 'update') {
    return updateRecord(userId, object_name, new_doc, previous_doc, modifier);
  } else if (action === 'insert') {
    return insertRecord(userId, object_name, new_doc);
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"models":{"audit_records.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/steedos_audit/models/audit_records.coffee                                                              //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Creator.Objects.audit_records = {
  name: "audit_records",
  label: "字段历史",
  icon: "record",
  fields: {
    related_to: {
      label: "相关项",
      type: "lookup",
      index: true,
      reference_to: function () {
        var o;
        o = [];

        _.each(Creator.Objects, function (object, object_name) {
          if (object.enable_audit) {
            return o.push(object.name);
          }
        });

        return o;
      },
      filterable: true,
      is_name: true
    },
    created: {
      label: "时间",
      filterable: true
    },
    field_name: {
      label: "字段",
      type: "text",
      required: true,
      is_wide: true
    },
    created_by: {
      label: "用户"
    },
    previous_value: {
      label: "原始值",
      type: "text"
    },
    new_value: {
      label: "新值",
      type: "text"
    }
  },
  list_views: {
    all: {
      label: "全部",
      filter_scope: "space",
      columns: ["related_to", "created", "field_name", "created_by", "previous_value", "new_value"],
      filter_fields: ["related_to"]
    },
    recent: {
      label: "最近查看",
      filter_scope: "space"
    }
  },
  permission_set: {
    user: {
      allowCreate: false,
      allowDelete: false,
      allowEdit: false,
      allowRead: true,
      modifyAllRecords: false,
      viewAllRecords: false
    },
    admin: {
      allowCreate: false,
      allowDelete: false,
      allowEdit: false,
      allowRead: true,
      modifyAllRecords: false,
      viewAllRecords: true
    }
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"audit_login.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/steedos_audit/models/audit_login.coffee                                                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Creator.Objects.audit_login = {
  name: "audit_login",
  label: "登录日志",
  icon: "record",
  fields: {
    username: {
      label: "用户名",
      type: "text",
      is_name: true
    },
    login_time: {
      label: "登录时间",
      type: "datetime"
    },
    source_ip: {
      label: "IP地址",
      type: "text"
    },
    location: {
      label: "位置",
      type: "text"
    },
    login_type: {
      label: "登录方式",
      type: "text"
    },
    status: {
      label: "状态",
      type: "text"
    },
    browser: {
      label: "浏览器",
      type: "text"
    },
    platform: {
      label: "系统",
      type: "text"
    },
    application: {
      label: "应用",
      type: "text"
    },
    client_version: {
      label: "客户端版本",
      type: "text"
    },
    api_type: {
      label: "api类型",
      type: "text"
    },
    api_version: {
      label: "api版本",
      type: "text"
    },
    login_url: {
      label: "登录URL",
      type: "text"
    }
  },
  list_views: {
    all: {
      label: "全部",
      filter_scope: "space",
      columns: ["username", "login_time", "source_ip", "location", "login_type", "status", "browser", "platform", "application", "client_version", "api_type", "api_version", "login_url"]
    },
    recent: {
      label: "最近查看",
      filter_scope: "space"
    }
  },
  permission_set: {
    user: {
      allowCreate: false,
      allowDelete: false,
      allowEdit: false,
      allowRead: true,
      modifyAllRecords: false,
      viewAllRecords: false
    },
    admin: {
      allowCreate: false,
      allowDelete: false,
      allowEdit: false,
      allowRead: true,
      modifyAllRecords: false,
      viewAllRecords: true
    }
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:audit/lib/audit_records.coffee");
require("/node_modules/meteor/steedos:audit/models/audit_records.coffee");
require("/node_modules/meteor/steedos:audit/models/audit_login.coffee");

/* Exports */
Package._define("steedos:audit");

})();

//# sourceURL=meteor://💻app/packages/steedos_audit.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdWRpdC9saWIvYXVkaXRfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hdWRpdF9yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdWRpdC9tb2RlbHMvYXVkaXRfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9hdWRpdF9yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdWRpdC9tb2RlbHMvYXVkaXRfbG9naW4uY29mZmVlIl0sIm5hbWVzIjpbImNsb25lIiwiZ2V0TG9va3VwRmllbGRNb2RpZmllciIsImdldExvb2t1cEZpZWxkVmFsdWUiLCJpbnNlcnRSZWNvcmQiLCJ0cmFuc2Zvcm1GaWVsZFZhbHVlIiwidXBkYXRlUmVjb3JkIiwicmVxdWlyZSIsIkNyZWF0b3IiLCJBdWRpdFJlY29yZHMiLCJyZWZlcmVuY2VfdG8iLCJ2YWx1ZSIsInNwYWNlX2lkIiwibmFtZV9maWVsZF9rZXkiLCJvYmoiLCJwcmV2aW91c19pZHMiLCJyZWZlcmVuY2VfdG9fb2JqZWN0IiwidmFsdWVzIiwiXyIsImlzQXJyYXkiLCJpc09iamVjdCIsIm8iLCJpZHMiLCJnZXRPYmplY3QiLCJOQU1FX0ZJRUxEX0tFWSIsImdldENvbGxlY3Rpb24iLCJmaW5kIiwiX2lkIiwiJGluIiwiZmllbGRzIiwiZmV0Y2giLCJnZXRPcmRlcmx5U2V0QnlJZHMiLCJwbHVjayIsImpvaW4iLCJmaWVsZCIsImlzRnVuY3Rpb24iLCJvcHRpb25zRnVuY3Rpb24iLCJpc1N0cmluZyIsIm9wdGlvbnMiLCJzZWxlY3RlZF92YWx1ZSIsInV0Y09mZnNldCIsImlzTnVsbCIsImlzVW5kZWZpbmVkIiwidHlwZSIsIm1vbWVudCIsInV0YyIsImZvcm1hdCIsImlzQm9vbGVhbiIsIm1hcCIsIm9wdGlvbiIsImNvbnRhaW5zIiwibGFiZWwiLCJjb21wYWN0IiwidXNlcklkIiwib2JqZWN0X25hbWUiLCJuZXdfZG9jIiwiY29sbGVjdGlvbiIsImRvYyIsInJlY29yZF9pZCIsInNwYWNlIiwiX21ha2VOZXdJRCIsImZpZWxkX25hbWUiLCJyZWxhdGVkX3RvIiwiaW5zZXJ0IiwicHJldmlvdXNfZG9jIiwibW9kaWZpZXIiLCJtb2RpZmllclNldCIsIm1vZGlmaWVyVW5zZXQiLCJyZWYiLCJjb252ZXJ0T2JqZWN0IiwiJHNldCIsIiR1bnNldCIsImVhY2giLCJ2IiwiayIsImRiX25ld192YWx1ZSIsImRiX3ByZXZpb3VzX3ZhbHVlIiwibmV3X3ZhbHVlIiwicHJldmlvdXNfdmFsdWUiLCJ0b1N0cmluZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJuYW1lIiwiYWRkIiwiYWN0aW9uIiwiT2JqZWN0cyIsImF1ZGl0X3JlY29yZHMiLCJpY29uIiwiaW5kZXgiLCJvYmplY3QiLCJlbmFibGVfYXVkaXQiLCJwdXNoIiwiZmlsdGVyYWJsZSIsImlzX25hbWUiLCJjcmVhdGVkIiwicmVxdWlyZWQiLCJpc193aWRlIiwiY3JlYXRlZF9ieSIsImxpc3Rfdmlld3MiLCJhbGwiLCJmaWx0ZXJfc2NvcGUiLCJjb2x1bW5zIiwiZmlsdGVyX2ZpZWxkcyIsInJlY2VudCIsInBlcm1pc3Npb25fc2V0IiwidXNlciIsImFsbG93Q3JlYXRlIiwiYWxsb3dEZWxldGUiLCJhbGxvd0VkaXQiLCJhbGxvd1JlYWQiLCJtb2RpZnlBbGxSZWNvcmRzIiwidmlld0FsbFJlY29yZHMiLCJhZG1pbiIsImF1ZGl0X2xvZ2luIiwidXNlcm5hbWUiLCJsb2dpbl90aW1lIiwic291cmNlX2lwIiwibG9jYXRpb24iLCJsb2dpbl90eXBlIiwic3RhdHVzIiwiYnJvd3NlciIsInBsYXRmb3JtIiwiYXBwbGljYXRpb24iLCJjbGllbnRfdmVyc2lvbiIsImFwaV90eXBlIiwiYXBpX3ZlcnNpb24iLCJsb2dpbl91cmwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7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QUMsd0JBQWtCLEtBSmxCO0FBS0FDLHNCQUFnQjtBQUxoQixLQUREO0FBT0FDLFdBQ0M7QUFBQU4sbUJBQWEsS0FBYjtBQUNBQyxtQkFBYSxLQURiO0FBRUFDLGlCQUFXLEtBRlg7QUFHQUMsaUJBQVcsSUFIWDtBQUlBQyx3QkFBa0IsS0FKbEI7QUFLQUMsc0JBQWdCO0FBTGhCO0FBUkQ7QUFuRUQsQ0FERCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2F1ZGl0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xvbmUgPSByZXF1aXJlKFwiY2xvbmVcIik7XHJcbkNyZWF0b3IuQXVkaXRSZWNvcmRzID0ge31cclxuXHJcbmdldExvb2t1cEZpZWxkVmFsdWUgPSAocmVmZXJlbmNlX3RvLCB2YWx1ZSwgc3BhY2VfaWQpLT5cclxuXHRpZiBfLmlzQXJyYXkocmVmZXJlbmNlX3RvKSAmJiBfLmlzT2JqZWN0KHZhbHVlKVxyXG5cdFx0cmVmZXJlbmNlX3RvID0gdmFsdWUub1xyXG5cdFx0cHJldmlvdXNfaWRzID0gdmFsdWUuaWRzXHJcblx0aWYgIV8uaXNBcnJheShwcmV2aW91c19pZHMpXHJcblx0XHRwcmV2aW91c19pZHMgPSBpZiB2YWx1ZSB0aGVuIFt2YWx1ZV0gZWxzZSBbXVxyXG5cdHJlZmVyZW5jZV90b19vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWZlcmVuY2VfdG8sIHNwYWNlX2lkKVxyXG5cdG5hbWVfZmllbGRfa2V5ID0gcmVmZXJlbmNlX3RvX29iamVjdC5OQU1FX0ZJRUxEX0tFWVxyXG5cdHZhbHVlcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8sIHNwYWNlX2lkKS5maW5kKHtfaWQ6IHskaW46IHByZXZpb3VzX2lkc319LCB7ZmllbGRzOiB7X2lkOjEsIFwiI3tuYW1lX2ZpZWxkX2tleX1cIjogMX19KS5mZXRjaCgpXHJcblx0dmFsdWVzID0gQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHModmFsdWVzLCBwcmV2aW91c19pZHMpXHJcblx0cmV0dXJuIChfLnBsdWNrIHZhbHVlcywgbmFtZV9maWVsZF9rZXkpLmpvaW4oJywnKVxyXG5cclxuZ2V0TG9va3VwRmllbGRNb2RpZmllciA9IChmaWVsZCwgdmFsdWUsIHNwYWNlX2lkKS0+XHJcblx0cmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXHJcblx0aWYgXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bylcclxuXHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90bygpXHJcblx0aWYgXy5pc0Z1bmN0aW9uKGZpZWxkLm9wdGlvbnNGdW5jdGlvbilcclxuXHRcdGlmIF8uaXNTdHJpbmcocmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRpZiB2YWx1ZVxyXG5cdFx0XHRcdHJldHVybiBnZXRMb29rdXBGaWVsZFZhbHVlKHJlZmVyZW5jZV90bywgdmFsdWUsIHNwYWNlX2lkKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gJydcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gZ2V0TG9va3VwRmllbGRWYWx1ZShyZWZlcmVuY2VfdG8sIHZhbHVlLCBzcGFjZV9pZClcclxuXHJcbiMjI1xyXG7lrZfmrrXlgLzovazmjaLop4TliJk6XHJcbjEg5pel5pyfIOagvOW8j+WtmOWCqOS4uiAoU3RyaW5nKTogMjAxOC0wMS0wMlxyXG4yIOaXtumXtCDmoLzlvI/lrZjlgqjkuLogKFN0cmluZyk6IDIwMTgtMDEtMDIgMjM6MTJcclxuMiBsb29rdXAg5ZKM5LiL5ouJ5qGG77yM6YO95piv5a+55bqU55qE5pi+56S65ZCN56ewIChuYW1lIHwgbGFiZWwpXHJcbjMgYm9vbGVhbiDlsLHlrZjmmK8v5ZCmXHJcbjQg5aSa6KGM5paH5pysXFxncmlkXFxsb29rdXDmnIlvcHRpb25zRnVuY3Rpb27lubbkuJTmsqHmnIlyZWZlcmVuY2VfdG/ml7Yg5LiN6K6w5b2V5paw5pen5YC8LCDlj6rorrDlvZXkv67mlLnml7bpl7QsIOS/ruaUueS6uiwg5L+u5pS555qE5a2X5q615pi+56S65ZCNXHJcbiMjI1xyXG50cmFuc2Zvcm1GaWVsZFZhbHVlID0gKGZpZWxkLCB2YWx1ZSwgb3B0aW9ucyktPlxyXG5cclxuXHRpZiBfLmlzTnVsbCh2YWx1ZSkgfHwgXy5pc1VuZGVmaW5lZCh2YWx1ZSlcclxuXHRcdHJldHVyblxyXG5cclxuXHR1dGNPZmZzZXQgPSBvcHRpb25zLnV0Y09mZnNldFxyXG5cdHNwYWNlX2lkID0gb3B0aW9ucy5zcGFjZV9pZFxyXG5cclxuXHRzd2l0Y2ggZmllbGQudHlwZVxyXG5cdFx0d2hlbiAnZGF0ZSdcclxuXHRcdFx0cmV0dXJuIG1vbWVudC51dGModmFsdWUpLmZvcm1hdCgnWVlZWS1NTS1ERCcpXHJcblx0XHR3aGVuICdkYXRldGltZSdcclxuXHRcdFx0cmV0dXJuIG1vbWVudCh2YWx1ZSkudXRjT2Zmc2V0KHV0Y09mZnNldCkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJylcclxuXHRcdHdoZW4gJ2Jvb2xlYW4nXHJcblx0XHRcdGlmIF8uaXNCb29sZWFuKHZhbHVlKVxyXG5cdFx0XHRcdGlmIHZhbHVlXHJcblx0XHRcdFx0XHRyZXR1cm4gJ+aYrydcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRyZXR1cm4gJ+WQpidcclxuXHRcdHdoZW4gJ3NlbGVjdCdcclxuXHRcdFx0aWYgXy5pc1N0cmluZyh2YWx1ZSlcclxuXHRcdFx0XHR2YWx1ZSA9IFt2YWx1ZV1cclxuXHRcdFx0c2VsZWN0ZWRfdmFsdWUgPSBfLm1hcCBmaWVsZC5vcHRpb25zLCAob3B0aW9uKS0+XHJcblx0XHRcdFx0aWYgXy5jb250YWlucyh2YWx1ZSwgb3B0aW9uLnZhbHVlKVxyXG5cdFx0XHRcdFx0cmV0dXJuIG9wdGlvbi5sYWJlbFxyXG5cdFx0XHRyZXR1cm4gXy5jb21wYWN0KHNlbGVjdGVkX3ZhbHVlKS5qb2luKCcsJylcclxuXHRcdHdoZW4gJ2NoZWNrYm94J1xyXG5cdFx0XHRpZiBfLmlzU3RyaW5nKHZhbHVlKVxyXG5cdFx0XHRcdHZhbHVlID0gW3ZhbHVlXVxyXG5cdFx0XHRzZWxlY3RlZF92YWx1ZSA9IF8ubWFwIGZpZWxkLm9wdGlvbnMsIChvcHRpb24pLT5cclxuXHRcdFx0XHRpZiBfLmNvbnRhaW5zKHZhbHVlLCBvcHRpb24udmFsdWUpXHJcblx0XHRcdFx0XHRyZXR1cm4gb3B0aW9uLmxhYmVsXHJcblx0XHRcdHJldHVybiBfLmNvbXBhY3Qoc2VsZWN0ZWRfdmFsdWUpLmpvaW4oJywnKVxyXG5cdFx0d2hlbiAnbG9va3VwJ1xyXG5cdFx0XHRyZXR1cm4gZ2V0TG9va3VwRmllbGRNb2RpZmllcihmaWVsZCwgdmFsdWUsIHNwYWNlX2lkKVxyXG5cdFx0d2hlbiAnbWFzdGVyX2RldGFpbCdcclxuXHRcdFx0cmV0dXJuIGdldExvb2t1cEZpZWxkTW9kaWZpZXIoZmllbGQsIHZhbHVlLCBzcGFjZV9pZClcclxuXHRcdHdoZW4gJ3RleHRhcmVhJ1xyXG5cdFx0XHRyZXR1cm4gJydcclxuXHRcdHdoZW4gJ2NvZGUnXHJcblx0XHRcdHJldHVybiAnJ1xyXG5cdFx0d2hlbiAnaHRtbCdcclxuXHRcdFx0cmV0dXJuICcnXHJcblx0XHR3aGVuICdtYXJrZG93bidcclxuXHRcdFx0cmV0dXJuICcnXHJcblx0XHR3aGVuICdncmlkJ1xyXG5cdFx0XHRyZXR1cm4gJydcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHZhbHVlXHJcblxyXG4jIOaWsOW7uuaXtiwg5LiN6K6w5b2V5piO57uGXHJcbmluc2VydFJlY29yZCA9ICh1c2VySWQsIG9iamVjdF9uYW1lLCBuZXdfZG9jKS0+XHJcbiNcdGlmICF1c2VySWRcclxuI1x0XHRyZXR1cm5cclxuXHJcblx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImF1ZGl0X3JlY29yZHNcIilcclxuXHRzcGFjZV9pZCA9IG5ld19kb2Muc3BhY2VcclxuXHRyZWNvcmRfaWQgPSBuZXdfZG9jLl9pZFxyXG5cdGRvYyA9IHtcclxuXHRcdF9pZDogY29sbGVjdGlvbi5fbWFrZU5ld0lEKClcclxuXHRcdHNwYWNlOiBzcGFjZV9pZFxyXG5cdFx0ZmllbGRfbmFtZTogXCLlt7LliJvlu7rjgIJcIlxyXG5cdFx0cmVsYXRlZF90bzoge1xyXG5cdFx0XHRvOiBvYmplY3RfbmFtZVxyXG5cdFx0XHRpZHM6IFtyZWNvcmRfaWRdXHJcblx0XHR9XHJcblx0fVxyXG5cdGNvbGxlY3Rpb24uaW5zZXJ0IGRvY1xyXG5cclxuIyDkv67mlLnml7YsIOiusOW9leWtl+auteWPmOabtOaYjue7hlxyXG51cGRhdGVSZWNvcmQgPSAodXNlcklkLCBvYmplY3RfbmFtZSwgbmV3X2RvYywgcHJldmlvdXNfZG9jLCBtb2RpZmllciktPlxyXG4jXHRpZiAhdXNlcklkXHJcbiNcdFx0cmV0dXJuXHJcblx0c3BhY2VfaWQgPSBuZXdfZG9jLnNwYWNlXHJcblx0cmVjb3JkX2lkID0gbmV3X2RvYy5faWRcclxuXHJcblx0ZmllbGRzID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZV9pZCkpLCBzcGFjZV9pZCk/LmZpZWxkc1xyXG5cclxuXHRtb2RpZmllclNldCA9IG1vZGlmaWVyLiRzZXRcclxuXHJcblx0bW9kaWZpZXJVbnNldCA9IG1vZGlmaWVyLiR1bnNldFxyXG5cclxuXHQjIyMgVE9ETyB1dGNPZmZzZXQg5bqU6K+l5p2l6Ieq5pWw5o2u5bqTLOW+hSAjOTg0IOWkhOeQhuWQjiDosIPmlbRcclxuXHJcbiAgICB1dGNPZmZzZXQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJ1c2Vyc1wiKS5maW5kT25lKHtfaWQ6IHVzZXJJZH0pPy51dGNPZmZzZXRcclxuXHJcblx0aWYgIV8uaXNOdW1iZXIodXRjT2Zmc2V0KVxyXG5cdFx0dXRjT2Zmc2V0ID0gOFxyXG5cdCMjI1xyXG5cclxuXHR1dGNPZmZzZXQgPSA4XHJcblxyXG5cdG9wdGlvbnMgPSB7dXRjT2Zmc2V0OiB1dGNPZmZzZXQsIHNwYWNlX2lkOiBzcGFjZV9pZH1cclxuXHJcblx0Xy5lYWNoIG1vZGlmaWVyU2V0LCAodiwgayktPlxyXG5cdFx0ZmllbGQgPSBmaWVsZHM/W2tdXHJcblx0XHRwcmV2aW91c192YWx1ZSA9IHByZXZpb3VzX2RvY1trXVxyXG5cdFx0bmV3X3ZhbHVlID0gdlxyXG5cclxuXHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gbnVsbFxyXG5cdFx0ZGJfbmV3X3ZhbHVlID0gbnVsbFxyXG5cclxuXHRcdHN3aXRjaCBmaWVsZC50eXBlXHJcblx0XHRcdHdoZW4gJ2RhdGUnXHJcblx0XHRcdFx0aWYgbmV3X3ZhbHVlPy50b1N0cmluZygpICE9IHByZXZpb3VzX3ZhbHVlPy50b1N0cmluZygpXHJcblx0XHRcdFx0XHRpZiBuZXdfdmFsdWVcclxuXHRcdFx0XHRcdFx0ZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKVxyXG5cdFx0XHRcdFx0aWYgcHJldmlvdXNfdmFsdWVcclxuXHRcdFx0XHRcdFx0ZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucylcclxuXHRcdFx0d2hlbiAnZGF0ZXRpbWUnXHJcblx0XHRcdFx0aWYgbmV3X3ZhbHVlPy50b1N0cmluZygpICE9IHByZXZpb3VzX3ZhbHVlPy50b1N0cmluZygpXHJcblx0XHRcdFx0XHRpZiBuZXdfdmFsdWVcclxuXHRcdFx0XHRcdFx0ZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKVxyXG5cdFx0XHRcdFx0aWYgcHJldmlvdXNfdmFsdWVcclxuXHRcdFx0XHRcdFx0ZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucylcclxuXHRcdFx0d2hlbiAndGV4dGFyZWEnXHJcblx0XHRcdFx0aWYgcHJldmlvdXNfdmFsdWUgIT0gbmV3X3ZhbHVlXHJcblx0XHRcdFx0XHRkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKVxyXG5cdFx0XHRcdFx0ZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKVxyXG5cdFx0XHR3aGVuICdjb2RlJ1xyXG5cdFx0XHRcdGlmIHByZXZpb3VzX3ZhbHVlICE9IG5ld192YWx1ZVxyXG5cdFx0XHRcdFx0ZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucylcclxuXHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucylcclxuXHRcdFx0d2hlbiAnaHRtbCdcclxuXHRcdFx0XHRpZiBwcmV2aW91c192YWx1ZSAhPSBuZXdfdmFsdWVcclxuXHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdFx0XHRkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdHdoZW4gJ21hcmtkb3duJ1xyXG5cdFx0XHRcdGlmIHByZXZpb3VzX3ZhbHVlICE9IG5ld192YWx1ZVxyXG5cdFx0XHRcdFx0ZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucylcclxuXHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucylcclxuXHRcdFx0d2hlbiAnZ3JpZCdcclxuXHRcdFx0XHRpZiBKU09OLnN0cmluZ2lmeShwcmV2aW91c192YWx1ZSkgIT0gSlNPTi5zdHJpbmdpZnkobmV3X3ZhbHVlKVxyXG5cdFx0XHRcdFx0ZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucylcclxuXHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucylcclxuXHRcdFx0d2hlbiAnYm9vbGVhbidcclxuXHRcdFx0XHRpZiBwcmV2aW91c192YWx1ZSAhPSBuZXdfdmFsdWVcclxuXHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdFx0XHRkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdHdoZW4gJ3NlbGVjdCdcclxuXHRcdFx0XHRpZiBwcmV2aW91c192YWx1ZT8udG9TdHJpbmcoKSAhPSBuZXdfdmFsdWU/LnRvU3RyaW5nKClcclxuXHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdFx0XHRkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdHdoZW4gJ2NoZWNrYm94J1xyXG5cdFx0XHRcdGlmIHByZXZpb3VzX3ZhbHVlPy50b1N0cmluZygpICE9IG5ld192YWx1ZT8udG9TdHJpbmcoKVxyXG5cdFx0XHRcdFx0ZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucylcclxuXHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucylcclxuXHRcdFx0d2hlbiAnbG9va3VwJ1xyXG5cdFx0XHRcdGlmIEpTT04uc3RyaW5naWZ5KHByZXZpb3VzX3ZhbHVlKSAhPSBKU09OLnN0cmluZ2lmeShuZXdfdmFsdWUpXHJcblx0XHRcdFx0XHRpZiBwcmV2aW91c192YWx1ZVxyXG5cdFx0XHRcdFx0XHRkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKVxyXG5cdFx0XHRcdFx0aWYgbmV3X3ZhbHVlXHJcblx0XHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucylcclxuXHRcdFx0d2hlbiAnbWFzdGVyX2RldGFpbCdcclxuXHRcdFx0XHRpZiBKU09OLnN0cmluZ2lmeShwcmV2aW91c192YWx1ZSkgIT0gSlNPTi5zdHJpbmdpZnkobmV3X3ZhbHVlKVxyXG5cdFx0XHRcdFx0aWYgcHJldmlvdXNfdmFsdWVcclxuXHRcdFx0XHRcdFx0ZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucylcclxuXHRcdFx0XHRcdGlmIG5ld192YWx1ZVxyXG5cdFx0XHRcdFx0XHRkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiBuZXdfdmFsdWUgIT0gcHJldmlvdXNfdmFsdWVcclxuXHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gcHJldmlvdXNfdmFsdWVcclxuXHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IG5ld192YWx1ZVxyXG5cclxuXHJcblx0XHRpZiBkYl9uZXdfdmFsdWUgIT0gbnVsbCB8fCBkYl9wcmV2aW91c192YWx1ZSAhPSBudWxsXHJcblx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhdWRpdF9yZWNvcmRzXCIpXHJcblx0XHRcdGRvYyA9IHtcclxuXHRcdFx0XHRfaWQ6IGNvbGxlY3Rpb24uX21ha2VOZXdJRCgpXHJcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkXHJcblx0XHRcdFx0ZmllbGRfbmFtZTogZmllbGQubGFiZWwgfHwgZmllbGQubmFtZVxyXG5cdFx0XHRcdHByZXZpb3VzX3ZhbHVlOiBkYl9wcmV2aW91c192YWx1ZVxyXG5cdFx0XHRcdG5ld192YWx1ZTogZGJfbmV3X3ZhbHVlXHJcblx0XHRcdFx0cmVsYXRlZF90bzoge1xyXG5cdFx0XHRcdFx0bzogb2JqZWN0X25hbWVcclxuXHRcdFx0XHRcdGlkczogW3JlY29yZF9pZF1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Y29sbGVjdGlvbi5pbnNlcnQgZG9jXHJcblxyXG5cdF8uZWFjaCBtb2RpZmllclVuc2V0LCAodiwgayktPlxyXG5cdFx0ZmllbGQgPSBmaWVsZHM/W2tdXHJcblx0XHRwcmV2aW91c192YWx1ZSA9IHByZXZpb3VzX2RvY1trXVxyXG5cdFx0aWYgcHJldmlvdXNfdmFsdWUgfHwgXy5pc0Jvb2xlYW4ocHJldmlvdXNfdmFsdWUpXHJcblx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhdWRpdF9yZWNvcmRzXCIpXHJcblx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdGRvYyA9IHtcclxuXHRcdFx0XHRfaWQ6IGNvbGxlY3Rpb24uX21ha2VOZXdJRCgpXHJcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkXHJcblx0XHRcdFx0ZmllbGRfbmFtZTogZmllbGQubGFiZWwgfHwgZmllbGQubmFtZVxyXG5cdFx0XHRcdHByZXZpb3VzX3ZhbHVlOiBkYl9wcmV2aW91c192YWx1ZVxyXG5cdFx0XHRcdHJlbGF0ZWRfdG86IHtcclxuXHRcdFx0XHRcdG86IG9iamVjdF9uYW1lXHJcblx0XHRcdFx0XHRpZHM6IFtyZWNvcmRfaWRdXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGNvbGxlY3Rpb24uaW5zZXJ0IGRvY1xyXG5cclxuQ3JlYXRvci5BdWRpdFJlY29yZHMuYWRkID0gKGFjdGlvbiwgdXNlcklkLCBvYmplY3RfbmFtZSwgbmV3X2RvYywgcHJldmlvdXNfZG9jLCBtb2RpZmllciktPlxyXG5cdGlmIGFjdGlvbiA9PSAndXBkYXRlJ1xyXG5cdFx0dXBkYXRlUmVjb3JkKHVzZXJJZCwgb2JqZWN0X25hbWUsIG5ld19kb2MsIHByZXZpb3VzX2RvYywgbW9kaWZpZXIpXHJcblx0ZWxzZSBpZiBhY3Rpb24gPT0gJ2luc2VydCdcclxuXHRcdGluc2VydFJlY29yZCh1c2VySWQsIG9iamVjdF9uYW1lLCBuZXdfZG9jKVxyXG4iLCJ2YXIgY2xvbmUsIGdldExvb2t1cEZpZWxkTW9kaWZpZXIsIGdldExvb2t1cEZpZWxkVmFsdWUsIGluc2VydFJlY29yZCwgdHJhbnNmb3JtRmllbGRWYWx1ZSwgdXBkYXRlUmVjb3JkO1xuXG5jbG9uZSA9IHJlcXVpcmUoXCJjbG9uZVwiKTtcblxuQ3JlYXRvci5BdWRpdFJlY29yZHMgPSB7fTtcblxuZ2V0TG9va3VwRmllbGRWYWx1ZSA9IGZ1bmN0aW9uKHJlZmVyZW5jZV90bywgdmFsdWUsIHNwYWNlX2lkKSB7XG4gIHZhciBuYW1lX2ZpZWxkX2tleSwgb2JqLCBwcmV2aW91c19pZHMsIHJlZmVyZW5jZV90b19vYmplY3QsIHZhbHVlcztcbiAgaWYgKF8uaXNBcnJheShyZWZlcmVuY2VfdG8pICYmIF8uaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmVmZXJlbmNlX3RvID0gdmFsdWUubztcbiAgICBwcmV2aW91c19pZHMgPSB2YWx1ZS5pZHM7XG4gIH1cbiAgaWYgKCFfLmlzQXJyYXkocHJldmlvdXNfaWRzKSkge1xuICAgIHByZXZpb3VzX2lkcyA9IHZhbHVlID8gW3ZhbHVlXSA6IFtdO1xuICB9XG4gIHJlZmVyZW5jZV90b19vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWZlcmVuY2VfdG8sIHNwYWNlX2lkKTtcbiAgbmFtZV9maWVsZF9rZXkgPSByZWZlcmVuY2VfdG9fb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICB2YWx1ZXMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvLCBzcGFjZV9pZCkuZmluZCh7XG4gICAgX2lkOiB7XG4gICAgICAkaW46IHByZXZpb3VzX2lkc1xuICAgIH1cbiAgfSwge1xuICAgIGZpZWxkczogKFxuICAgICAgb2JqID0ge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH0sXG4gICAgICBvYmpbXCJcIiArIG5hbWVfZmllbGRfa2V5XSA9IDEsXG4gICAgICBvYmpcbiAgICApXG4gIH0pLmZldGNoKCk7XG4gIHZhbHVlcyA9IENyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzKHZhbHVlcywgcHJldmlvdXNfaWRzKTtcbiAgcmV0dXJuIChfLnBsdWNrKHZhbHVlcywgbmFtZV9maWVsZF9rZXkpKS5qb2luKCcsJyk7XG59O1xuXG5nZXRMb29rdXBGaWVsZE1vZGlmaWVyID0gZnVuY3Rpb24oZmllbGQsIHZhbHVlLCBzcGFjZV9pZCkge1xuICB2YXIgcmVmZXJlbmNlX3RvO1xuICByZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gIGlmIChfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKSkge1xuICAgIHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90bygpO1xuICB9XG4gIGlmIChfLmlzRnVuY3Rpb24oZmllbGQub3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgIGlmIChfLmlzU3RyaW5nKHJlZmVyZW5jZV90bykpIHtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZ2V0TG9va3VwRmllbGRWYWx1ZShyZWZlcmVuY2VfdG8sIHZhbHVlLCBzcGFjZV9pZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGdldExvb2t1cEZpZWxkVmFsdWUocmVmZXJlbmNlX3RvLCB2YWx1ZSwgc3BhY2VfaWQpO1xuICB9XG59O1xuXG5cbi8qXG7lrZfmrrXlgLzovazmjaLop4TliJk6XG4xIOaXpeacnyDmoLzlvI/lrZjlgqjkuLogKFN0cmluZyk6IDIwMTgtMDEtMDJcbjIg5pe26Ze0IOagvOW8j+WtmOWCqOS4uiAoU3RyaW5nKTogMjAxOC0wMS0wMiAyMzoxMlxuMiBsb29rdXAg5ZKM5LiL5ouJ5qGG77yM6YO95piv5a+55bqU55qE5pi+56S65ZCN56ewIChuYW1lIHwgbGFiZWwpXG4zIGJvb2xlYW4g5bCx5a2Y5pivL+WQplxuNCDlpJrooYzmlofmnKxcXGdyaWRcXGxvb2t1cOaciW9wdGlvbnNGdW5jdGlvbuW5tuS4lOayoeaciXJlZmVyZW5jZV90b+aXtiDkuI3orrDlvZXmlrDml6flgLwsIOWPquiusOW9leS/ruaUueaXtumXtCwg5L+u5pS55Lq6LCDkv67mlLnnmoTlrZfmrrXmmL7npLrlkI1cbiAqL1xuXG50cmFuc2Zvcm1GaWVsZFZhbHVlID0gZnVuY3Rpb24oZmllbGQsIHZhbHVlLCBvcHRpb25zKSB7XG4gIHZhciBzZWxlY3RlZF92YWx1ZSwgc3BhY2VfaWQsIHV0Y09mZnNldDtcbiAgaWYgKF8uaXNOdWxsKHZhbHVlKSB8fCBfLmlzVW5kZWZpbmVkKHZhbHVlKSkge1xuICAgIHJldHVybjtcbiAgfVxuICB1dGNPZmZzZXQgPSBvcHRpb25zLnV0Y09mZnNldDtcbiAgc3BhY2VfaWQgPSBvcHRpb25zLnNwYWNlX2lkO1xuICBzd2l0Y2ggKGZpZWxkLnR5cGUpIHtcbiAgICBjYXNlICdkYXRlJzpcbiAgICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgICBjYXNlICdkYXRldGltZSc6XG4gICAgICByZXR1cm4gbW9tZW50KHZhbHVlKS51dGNPZmZzZXQodXRjT2Zmc2V0KS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW0nKTtcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIGlmIChfLmlzQm9vbGVhbih2YWx1ZSkpIHtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuICfmmK8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAn5ZCmJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgIGlmIChfLmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9IFt2YWx1ZV07XG4gICAgICB9XG4gICAgICBzZWxlY3RlZF92YWx1ZSA9IF8ubWFwKGZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICBpZiAoXy5jb250YWlucyh2YWx1ZSwgb3B0aW9uLnZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiBvcHRpb24ubGFiZWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8uY29tcGFjdChzZWxlY3RlZF92YWx1ZSkuam9pbignLCcpO1xuICAgIGNhc2UgJ2NoZWNrYm94JzpcbiAgICAgIGlmIChfLmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9IFt2YWx1ZV07XG4gICAgICB9XG4gICAgICBzZWxlY3RlZF92YWx1ZSA9IF8ubWFwKGZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICBpZiAoXy5jb250YWlucyh2YWx1ZSwgb3B0aW9uLnZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiBvcHRpb24ubGFiZWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8uY29tcGFjdChzZWxlY3RlZF92YWx1ZSkuam9pbignLCcpO1xuICAgIGNhc2UgJ2xvb2t1cCc6XG4gICAgICByZXR1cm4gZ2V0TG9va3VwRmllbGRNb2RpZmllcihmaWVsZCwgdmFsdWUsIHNwYWNlX2lkKTtcbiAgICBjYXNlICdtYXN0ZXJfZGV0YWlsJzpcbiAgICAgIHJldHVybiBnZXRMb29rdXBGaWVsZE1vZGlmaWVyKGZpZWxkLCB2YWx1ZSwgc3BhY2VfaWQpO1xuICAgIGNhc2UgJ3RleHRhcmVhJzpcbiAgICAgIHJldHVybiAnJztcbiAgICBjYXNlICdjb2RlJzpcbiAgICAgIHJldHVybiAnJztcbiAgICBjYXNlICdodG1sJzpcbiAgICAgIHJldHVybiAnJztcbiAgICBjYXNlICdtYXJrZG93bic6XG4gICAgICByZXR1cm4gJyc7XG4gICAgY2FzZSAnZ3JpZCc6XG4gICAgICByZXR1cm4gJyc7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufTtcblxuaW5zZXJ0UmVjb3JkID0gZnVuY3Rpb24odXNlcklkLCBvYmplY3RfbmFtZSwgbmV3X2RvYykge1xuICB2YXIgY29sbGVjdGlvbiwgZG9jLCByZWNvcmRfaWQsIHNwYWNlX2lkO1xuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXVkaXRfcmVjb3Jkc1wiKTtcbiAgc3BhY2VfaWQgPSBuZXdfZG9jLnNwYWNlO1xuICByZWNvcmRfaWQgPSBuZXdfZG9jLl9pZDtcbiAgZG9jID0ge1xuICAgIF9pZDogY29sbGVjdGlvbi5fbWFrZU5ld0lEKCksXG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGZpZWxkX25hbWU6IFwi5bey5Yib5bu644CCXCIsXG4gICAgcmVsYXRlZF90bzoge1xuICAgICAgbzogb2JqZWN0X25hbWUsXG4gICAgICBpZHM6IFtyZWNvcmRfaWRdXG4gICAgfVxuICB9O1xuICByZXR1cm4gY29sbGVjdGlvbi5pbnNlcnQoZG9jKTtcbn07XG5cbnVwZGF0ZVJlY29yZCA9IGZ1bmN0aW9uKHVzZXJJZCwgb2JqZWN0X25hbWUsIG5ld19kb2MsIHByZXZpb3VzX2RvYywgbW9kaWZpZXIpIHtcbiAgdmFyIGZpZWxkcywgbW9kaWZpZXJTZXQsIG1vZGlmaWVyVW5zZXQsIG9wdGlvbnMsIHJlY29yZF9pZCwgcmVmLCBzcGFjZV9pZCwgdXRjT2Zmc2V0O1xuICBzcGFjZV9pZCA9IG5ld19kb2Muc3BhY2U7XG4gIHJlY29yZF9pZCA9IG5ld19kb2MuX2lkO1xuICBmaWVsZHMgPSAocmVmID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZV9pZCkpLCBzcGFjZV9pZCkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwO1xuICBtb2RpZmllclNldCA9IG1vZGlmaWVyLiRzZXQ7XG4gIG1vZGlmaWVyVW5zZXQgPSBtb2RpZmllci4kdW5zZXQ7XG5cbiAgLyogVE9ETyB1dGNPZmZzZXQg5bqU6K+l5p2l6Ieq5pWw5o2u5bqTLOW+hSAjOTg0IOWkhOeQhuWQjiDosIPmlbRcbiAgXG4gICAgIHV0Y09mZnNldCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInVzZXJzXCIpLmZpbmRPbmUoe19pZDogdXNlcklkfSk/LnV0Y09mZnNldFxuICBcbiAgXHRpZiAhXy5pc051bWJlcih1dGNPZmZzZXQpXG4gIFx0XHR1dGNPZmZzZXQgPSA4XG4gICAqL1xuICB1dGNPZmZzZXQgPSA4O1xuICBvcHRpb25zID0ge1xuICAgIHV0Y09mZnNldDogdXRjT2Zmc2V0LFxuICAgIHNwYWNlX2lkOiBzcGFjZV9pZFxuICB9O1xuICBfLmVhY2gobW9kaWZpZXJTZXQsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZGJfbmV3X3ZhbHVlLCBkYl9wcmV2aW91c192YWx1ZSwgZG9jLCBmaWVsZCwgbmV3X3ZhbHVlLCBwcmV2aW91c192YWx1ZTtcbiAgICBmaWVsZCA9IGZpZWxkcyAhPSBudWxsID8gZmllbGRzW2tdIDogdm9pZCAwO1xuICAgIHByZXZpb3VzX3ZhbHVlID0gcHJldmlvdXNfZG9jW2tdO1xuICAgIG5ld192YWx1ZSA9IHY7XG4gICAgZGJfcHJldmlvdXNfdmFsdWUgPSBudWxsO1xuICAgIGRiX25ld192YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChmaWVsZC50eXBlKSB7XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgaWYgKChuZXdfdmFsdWUgIT0gbnVsbCA/IG5ld192YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKSAhPT0gKHByZXZpb3VzX3ZhbHVlICE9IG51bGwgPyBwcmV2aW91c192YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKSkge1xuICAgICAgICAgIGlmIChuZXdfdmFsdWUpIHtcbiAgICAgICAgICAgIGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwcmV2aW91c192YWx1ZSkge1xuICAgICAgICAgICAgZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGF0ZXRpbWUnOlxuICAgICAgICBpZiAoKG5ld192YWx1ZSAhPSBudWxsID8gbmV3X3ZhbHVlLnRvU3RyaW5nKCkgOiB2b2lkIDApICE9PSAocHJldmlvdXNfdmFsdWUgIT0gbnVsbCA/IHByZXZpb3VzX3ZhbHVlLnRvU3RyaW5nKCkgOiB2b2lkIDApKSB7XG4gICAgICAgICAgaWYgKG5ld192YWx1ZSkge1xuICAgICAgICAgICAgZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHByZXZpb3VzX3ZhbHVlKSB7XG4gICAgICAgICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICAgIGlmIChwcmV2aW91c192YWx1ZSAhPT0gbmV3X3ZhbHVlKSB7XG4gICAgICAgICAgZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvZGUnOlxuICAgICAgICBpZiAocHJldmlvdXNfdmFsdWUgIT09IG5ld192YWx1ZSkge1xuICAgICAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdodG1sJzpcbiAgICAgICAgaWYgKHByZXZpb3VzX3ZhbHVlICE9PSBuZXdfdmFsdWUpIHtcbiAgICAgICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbWFya2Rvd24nOlxuICAgICAgICBpZiAocHJldmlvdXNfdmFsdWUgIT09IG5ld192YWx1ZSkge1xuICAgICAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdncmlkJzpcbiAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KHByZXZpb3VzX3ZhbHVlKSAhPT0gSlNPTi5zdHJpbmdpZnkobmV3X3ZhbHVlKSkge1xuICAgICAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgaWYgKHByZXZpb3VzX3ZhbHVlICE9PSBuZXdfdmFsdWUpIHtcbiAgICAgICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgaWYgKChwcmV2aW91c192YWx1ZSAhPSBudWxsID8gcHJldmlvdXNfdmFsdWUudG9TdHJpbmcoKSA6IHZvaWQgMCkgIT09IChuZXdfdmFsdWUgIT0gbnVsbCA/IG5ld192YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKSkge1xuICAgICAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjaGVja2JveCc6XG4gICAgICAgIGlmICgocHJldmlvdXNfdmFsdWUgIT0gbnVsbCA/IHByZXZpb3VzX3ZhbHVlLnRvU3RyaW5nKCkgOiB2b2lkIDApICE9PSAobmV3X3ZhbHVlICE9IG51bGwgPyBuZXdfdmFsdWUudG9TdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbG9va3VwJzpcbiAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KHByZXZpb3VzX3ZhbHVlKSAhPT0gSlNPTi5zdHJpbmdpZnkobmV3X3ZhbHVlKSkge1xuICAgICAgICAgIGlmIChwcmV2aW91c192YWx1ZSkge1xuICAgICAgICAgICAgZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChuZXdfdmFsdWUpIHtcbiAgICAgICAgICAgIGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbWFzdGVyX2RldGFpbCc6XG4gICAgICAgIGlmIChKU09OLnN0cmluZ2lmeShwcmV2aW91c192YWx1ZSkgIT09IEpTT04uc3RyaW5naWZ5KG5ld192YWx1ZSkpIHtcbiAgICAgICAgICBpZiAocHJldmlvdXNfdmFsdWUpIHtcbiAgICAgICAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobmV3X3ZhbHVlKSB7XG4gICAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChuZXdfdmFsdWUgIT09IHByZXZpb3VzX3ZhbHVlKSB7XG4gICAgICAgICAgZGJfcHJldmlvdXNfdmFsdWUgPSBwcmV2aW91c192YWx1ZTtcbiAgICAgICAgICBkYl9uZXdfdmFsdWUgPSBuZXdfdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGRiX25ld192YWx1ZSAhPT0gbnVsbCB8fCBkYl9wcmV2aW91c192YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImF1ZGl0X3JlY29yZHNcIik7XG4gICAgICBkb2MgPSB7XG4gICAgICAgIF9pZDogY29sbGVjdGlvbi5fbWFrZU5ld0lEKCksXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgZmllbGRfbmFtZTogZmllbGQubGFiZWwgfHwgZmllbGQubmFtZSxcbiAgICAgICAgcHJldmlvdXNfdmFsdWU6IGRiX3ByZXZpb3VzX3ZhbHVlLFxuICAgICAgICBuZXdfdmFsdWU6IGRiX25ld192YWx1ZSxcbiAgICAgICAgcmVsYXRlZF90bzoge1xuICAgICAgICAgIG86IG9iamVjdF9uYW1lLFxuICAgICAgICAgIGlkczogW3JlY29yZF9pZF1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uLmluc2VydChkb2MpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBfLmVhY2gobW9kaWZpZXJVbnNldCwgZnVuY3Rpb24odiwgaykge1xuICAgIHZhciBjb2xsZWN0aW9uLCBkYl9wcmV2aW91c192YWx1ZSwgZG9jLCBmaWVsZCwgcHJldmlvdXNfdmFsdWU7XG4gICAgZmllbGQgPSBmaWVsZHMgIT0gbnVsbCA/IGZpZWxkc1trXSA6IHZvaWQgMDtcbiAgICBwcmV2aW91c192YWx1ZSA9IHByZXZpb3VzX2RvY1trXTtcbiAgICBpZiAocHJldmlvdXNfdmFsdWUgfHwgXy5pc0Jvb2xlYW4ocHJldmlvdXNfdmFsdWUpKSB7XG4gICAgICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXVkaXRfcmVjb3Jkc1wiKTtcbiAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgZG9jID0ge1xuICAgICAgICBfaWQ6IGNvbGxlY3Rpb24uX21ha2VOZXdJRCgpLFxuICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgIGZpZWxkX25hbWU6IGZpZWxkLmxhYmVsIHx8IGZpZWxkLm5hbWUsXG4gICAgICAgIHByZXZpb3VzX3ZhbHVlOiBkYl9wcmV2aW91c192YWx1ZSxcbiAgICAgICAgcmVsYXRlZF90bzoge1xuICAgICAgICAgIG86IG9iamVjdF9uYW1lLFxuICAgICAgICAgIGlkczogW3JlY29yZF9pZF1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uLmluc2VydChkb2MpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5DcmVhdG9yLkF1ZGl0UmVjb3Jkcy5hZGQgPSBmdW5jdGlvbihhY3Rpb24sIHVzZXJJZCwgb2JqZWN0X25hbWUsIG5ld19kb2MsIHByZXZpb3VzX2RvYywgbW9kaWZpZXIpIHtcbiAgaWYgKGFjdGlvbiA9PT0gJ3VwZGF0ZScpIHtcbiAgICByZXR1cm4gdXBkYXRlUmVjb3JkKHVzZXJJZCwgb2JqZWN0X25hbWUsIG5ld19kb2MsIHByZXZpb3VzX2RvYywgbW9kaWZpZXIpO1xuICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJ2luc2VydCcpIHtcbiAgICByZXR1cm4gaW5zZXJ0UmVjb3JkKHVzZXJJZCwgb2JqZWN0X25hbWUsIG5ld19kb2MpO1xuICB9XG59O1xuIiwiQ3JlYXRvci5PYmplY3RzLmF1ZGl0X3JlY29yZHMgPVxyXG5cdG5hbWU6IFwiYXVkaXRfcmVjb3Jkc1wiXHJcblx0bGFiZWw6IFwi5a2X5q615Y6G5Y+yXCJcclxuXHRpY29uOiBcInJlY29yZFwiXHJcblx0ZmllbGRzOlxyXG5cdFx0cmVsYXRlZF90bzpcclxuXHRcdFx0bGFiZWw6IFwi55u45YWz6aG5XCJcclxuXHRcdFx0dHlwZTogXCJsb29rdXBcIlxyXG5cdFx0XHRpbmRleDogdHJ1ZVxyXG5cdFx0XHRyZWZlcmVuY2VfdG86ICgpLT5cclxuXHRcdFx0XHRvID0gW11cclxuXHRcdFx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAob2JqZWN0LCBvYmplY3RfbmFtZSktPlxyXG5cdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV9hdWRpdFxyXG5cdFx0XHRcdFx0XHRvLnB1c2ggb2JqZWN0Lm5hbWVcclxuXHRcdFx0XHRyZXR1cm4gb1xyXG5cdFx0XHRmaWx0ZXJhYmxlOnRydWVcclxuXHRcdFx0aXNfbmFtZTogdHJ1ZVxyXG5cdFx0Y3JlYXRlZDpcclxuXHRcdFx0bGFiZWw6XCLml7bpl7RcIlxyXG5cdFx0XHRmaWx0ZXJhYmxlOnRydWVcclxuXHRcdGZpZWxkX25hbWU6XHJcblx0XHRcdGxhYmVsOiBcIuWtl+autVwiXHJcblx0XHRcdHR5cGU6IFwidGV4dFwiXHJcblx0XHRcdHJlcXVpcmVkOiB0cnVlXHJcblx0XHRcdGlzX3dpZGU6IHRydWVcclxuXHRcdGNyZWF0ZWRfYnk6XHJcblx0XHRcdGxhYmVsOlwi55So5oi3XCJcclxuXHRcdHByZXZpb3VzX3ZhbHVlOlxyXG5cdFx0XHRsYWJlbDogXCLljp/lp4vlgLxcIlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cdFx0bmV3X3ZhbHVlOlxyXG5cdFx0XHRsYWJlbDogXCLmlrDlgLxcIlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cclxuXHJcblx0bGlzdF92aWV3czpcclxuXHRcdGFsbDpcclxuXHRcdFx0bGFiZWw6IFwi5YWo6YOoXCJcclxuXHRcdFx0ZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcclxuXHRcdFx0Y29sdW1uczogW1wicmVsYXRlZF90b1wiLCBcImNyZWF0ZWRcIiwgXCJmaWVsZF9uYW1lXCIsIFwiY3JlYXRlZF9ieVwiLCBcInByZXZpb3VzX3ZhbHVlXCIsIFwibmV3X3ZhbHVlXCJdXHJcblx0XHRcdGZpbHRlcl9maWVsZHM6IFtcInJlbGF0ZWRfdG9cIl1cclxuXHRcdHJlY2VudDpcclxuXHRcdFx0bGFiZWw6IFwi5pyA6L+R5p+l55yLXCJcclxuXHRcdFx0ZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcclxuXHJcblx0cGVybWlzc2lvbl9zZXQ6XHJcblx0XHR1c2VyOlxyXG5cdFx0XHRhbGxvd0NyZWF0ZTogZmFsc2VcclxuXHRcdFx0YWxsb3dEZWxldGU6IGZhbHNlXHJcblx0XHRcdGFsbG93RWRpdDogZmFsc2VcclxuXHRcdFx0YWxsb3dSZWFkOiB0cnVlXHJcblx0XHRcdG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlXHJcblx0XHRcdHZpZXdBbGxSZWNvcmRzOiBmYWxzZVxyXG5cdFx0YWRtaW46XHJcblx0XHRcdGFsbG93Q3JlYXRlOiBmYWxzZVxyXG5cdFx0XHRhbGxvd0RlbGV0ZTogZmFsc2VcclxuXHRcdFx0YWxsb3dFZGl0OiBmYWxzZVxyXG5cdFx0XHRhbGxvd1JlYWQ6IHRydWVcclxuXHRcdFx0bW9kaWZ5QWxsUmVjb3JkczogZmFsc2VcclxuXHRcdFx0dmlld0FsbFJlY29yZHM6IHRydWUiLCJDcmVhdG9yLk9iamVjdHMuYXVkaXRfcmVjb3JkcyA9IHtcbiAgbmFtZTogXCJhdWRpdF9yZWNvcmRzXCIsXG4gIGxhYmVsOiBcIuWtl+auteWOhuWPslwiLFxuICBpY29uOiBcInJlY29yZFwiLFxuICBmaWVsZHM6IHtcbiAgICByZWxhdGVkX3RvOiB7XG4gICAgICBsYWJlbDogXCLnm7jlhbPpoblcIixcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICBpbmRleDogdHJ1ZSxcbiAgICAgIHJlZmVyZW5jZV90bzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvO1xuICAgICAgICBvID0gW107XG4gICAgICAgIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKG9iamVjdCwgb2JqZWN0X25hbWUpIHtcbiAgICAgICAgICBpZiAob2JqZWN0LmVuYWJsZV9hdWRpdCkge1xuICAgICAgICAgICAgcmV0dXJuIG8ucHVzaChvYmplY3QubmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG87XG4gICAgICB9LFxuICAgICAgZmlsdGVyYWJsZTogdHJ1ZSxcbiAgICAgIGlzX25hbWU6IHRydWVcbiAgICB9LFxuICAgIGNyZWF0ZWQ6IHtcbiAgICAgIGxhYmVsOiBcIuaXtumXtFwiLFxuICAgICAgZmlsdGVyYWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgZmllbGRfbmFtZToge1xuICAgICAgbGFiZWw6IFwi5a2X5q61XCIsXG4gICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaXNfd2lkZTogdHJ1ZVxuICAgIH0sXG4gICAgY3JlYXRlZF9ieToge1xuICAgICAgbGFiZWw6IFwi55So5oi3XCJcbiAgICB9LFxuICAgIHByZXZpb3VzX3ZhbHVlOiB7XG4gICAgICBsYWJlbDogXCLljp/lp4vlgLxcIixcbiAgICAgIHR5cGU6IFwidGV4dFwiXG4gICAgfSxcbiAgICBuZXdfdmFsdWU6IHtcbiAgICAgIGxhYmVsOiBcIuaWsOWAvFwiLFxuICAgICAgdHlwZTogXCJ0ZXh0XCJcbiAgICB9XG4gIH0sXG4gIGxpc3Rfdmlld3M6IHtcbiAgICBhbGw6IHtcbiAgICAgIGxhYmVsOiBcIuWFqOmDqFwiLFxuICAgICAgZmlsdGVyX3Njb3BlOiBcInNwYWNlXCIsXG4gICAgICBjb2x1bW5zOiBbXCJyZWxhdGVkX3RvXCIsIFwiY3JlYXRlZFwiLCBcImZpZWxkX25hbWVcIiwgXCJjcmVhdGVkX2J5XCIsIFwicHJldmlvdXNfdmFsdWVcIiwgXCJuZXdfdmFsdWVcIl0sXG4gICAgICBmaWx0ZXJfZmllbGRzOiBbXCJyZWxhdGVkX3RvXCJdXG4gICAgfSxcbiAgICByZWNlbnQ6IHtcbiAgICAgIGxhYmVsOiBcIuacgOi/keafpeeci1wiLFxuICAgICAgZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcbiAgICB9XG4gIH0sXG4gIHBlcm1pc3Npb25fc2V0OiB7XG4gICAgdXNlcjoge1xuICAgICAgYWxsb3dDcmVhdGU6IGZhbHNlLFxuICAgICAgYWxsb3dEZWxldGU6IGZhbHNlLFxuICAgICAgYWxsb3dFZGl0OiBmYWxzZSxcbiAgICAgIGFsbG93UmVhZDogdHJ1ZSxcbiAgICAgIG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlLFxuICAgICAgdmlld0FsbFJlY29yZHM6IGZhbHNlXG4gICAgfSxcbiAgICBhZG1pbjoge1xuICAgICAgYWxsb3dDcmVhdGU6IGZhbHNlLFxuICAgICAgYWxsb3dEZWxldGU6IGZhbHNlLFxuICAgICAgYWxsb3dFZGl0OiBmYWxzZSxcbiAgICAgIGFsbG93UmVhZDogdHJ1ZSxcbiAgICAgIG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlLFxuICAgICAgdmlld0FsbFJlY29yZHM6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJDcmVhdG9yLk9iamVjdHMuYXVkaXRfbG9naW4gPVxyXG5cdG5hbWU6IFwiYXVkaXRfbG9naW5cIlxyXG5cdGxhYmVsOiBcIueZu+W9leaXpeW/l1wiXHJcblx0aWNvbjogXCJyZWNvcmRcIlxyXG5cdGZpZWxkczpcclxuXHRcdHVzZXJuYW1lOlxyXG5cdFx0XHRsYWJlbDogXCLnlKjmiLflkI1cIlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cdFx0XHRpc19uYW1lOiB0cnVlXHJcblxyXG5cdFx0bG9naW5fdGltZTpcclxuXHRcdFx0bGFiZWw6XCLnmbvlvZXml7bpl7RcIlxyXG5cdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcclxuXHJcblx0XHRzb3VyY2VfaXA6XHJcblx0XHRcdGxhYmVsOiBcIklQ5Zyw5Z2AXCJcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHJcblx0XHRsb2NhdGlvbjpcclxuXHRcdFx0bGFiZWw6XCLkvY3nva5cIlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cclxuXHRcdGxvZ2luX3R5cGU6XHJcblx0XHRcdGxhYmVsOiBcIueZu+W9leaWueW8j1wiXHJcblx0XHRcdHR5cGU6IFwidGV4dFwiXHJcblxyXG5cdFx0c3RhdHVzOlxyXG5cdFx0XHRsYWJlbDogXCLnirbmgIFcIlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cclxuXHRcdGJyb3dzZXI6XHJcblx0XHRcdGxhYmVsOiBcIua1j+iniOWZqFwiXHJcblx0XHRcdHR5cGU6IFwidGV4dFwiXHJcblxyXG5cdFx0cGxhdGZvcm06XHJcblx0XHRcdGxhYmVsOiBcIuezu+e7n1wiXHJcblx0XHRcdHR5cGU6IFwidGV4dFwiXHJcblxyXG5cdFx0YXBwbGljYXRpb246XHJcblx0XHRcdGxhYmVsOiBcIuW6lOeUqFwiXHJcblx0XHRcdHR5cGU6IFwidGV4dFwiXHJcblxyXG5cdFx0Y2xpZW50X3ZlcnNpb246XHJcblx0XHRcdGxhYmVsOiBcIuWuouaIt+err+eJiOacrFwiXHJcblx0XHRcdHR5cGU6IFwidGV4dFwiXHJcblxyXG5cdFx0YXBpX3R5cGU6XHJcblx0XHRcdGxhYmVsOiBcImFwaeexu+Wei1wiXHJcblx0XHRcdHR5cGU6IFwidGV4dFwiXHJcblxyXG5cdFx0YXBpX3ZlcnNpb246XHJcblx0XHRcdGxhYmVsOiBcImFwaeeJiOacrFwiXHJcblx0XHRcdHR5cGU6IFwidGV4dFwiXHJcblxyXG5cdFx0bG9naW5fdXJsOlxyXG5cdFx0XHRsYWJlbDogXCLnmbvlvZVVUkxcIlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cclxuXHRsaXN0X3ZpZXdzOlxyXG5cdFx0YWxsOlxyXG5cdFx0XHRsYWJlbDogXCLlhajpg6hcIlxyXG5cdFx0XHRmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxyXG5cdFx0XHRjb2x1bW5zOiBbXCJ1c2VybmFtZVwiLCBcImxvZ2luX3RpbWVcIiwgXCJzb3VyY2VfaXBcIiwgXCJsb2NhdGlvblwiLCBcImxvZ2luX3R5cGVcIiwgXCJzdGF0dXNcIiwgXCJicm93c2VyXCIsIFwicGxhdGZvcm1cIiwgXCJhcHBsaWNhdGlvblwiLCBcImNsaWVudF92ZXJzaW9uXCIsIFwiYXBpX3R5cGVcIiwgXCJhcGlfdmVyc2lvblwiLCBcImxvZ2luX3VybFwiXVxyXG5cdFx0cmVjZW50OlxyXG5cdFx0XHRsYWJlbDogXCLmnIDov5Hmn6XnnItcIlxyXG5cdFx0XHRmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxyXG5cclxuXHRwZXJtaXNzaW9uX3NldDpcclxuXHRcdHVzZXI6XHJcblx0XHRcdGFsbG93Q3JlYXRlOiBmYWxzZVxyXG5cdFx0XHRhbGxvd0RlbGV0ZTogZmFsc2VcclxuXHRcdFx0YWxsb3dFZGl0OiBmYWxzZVxyXG5cdFx0XHRhbGxvd1JlYWQ6IHRydWVcclxuXHRcdFx0bW9kaWZ5QWxsUmVjb3JkczogZmFsc2VcclxuXHRcdFx0dmlld0FsbFJlY29yZHM6IGZhbHNlXHJcblx0XHRhZG1pbjpcclxuXHRcdFx0YWxsb3dDcmVhdGU6IGZhbHNlXHJcblx0XHRcdGFsbG93RGVsZXRlOiBmYWxzZVxyXG5cdFx0XHRhbGxvd0VkaXQ6IGZhbHNlXHJcblx0XHRcdGFsbG93UmVhZDogdHJ1ZVxyXG5cdFx0XHRtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZVxyXG5cdFx0XHR2aWV3QWxsUmVjb3JkczogdHJ1ZSJdfQ==
