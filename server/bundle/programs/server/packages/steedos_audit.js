(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:audit":{"lib":{"audit_records.coffee":function module(require){

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

    if (db_new_value !== null && db_new_value !== void 0 || db_previous_value !== null && db_previous_value !== void 0) {
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

}},"models":{"audit_records.coffee":function module(){

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

},"audit_login.coffee":function module(){

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdWRpdC9saWIvYXVkaXRfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hdWRpdF9yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdWRpdC9tb2RlbHMvYXVkaXRfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9hdWRpdF9yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdWRpdC9tb2RlbHMvYXVkaXRfbG9naW4uY29mZmVlIl0sIm5hbWVzIjpbImNsb25lIiwiZ2V0TG9va3VwRmllbGRNb2RpZmllciIsImdldExvb2t1cEZpZWxkVmFsdWUiLCJpbnNlcnRSZWNvcmQiLCJ0cmFuc2Zvcm1GaWVsZFZhbHVlIiwidXBkYXRlUmVjb3JkIiwicmVxdWlyZSIsIkNyZWF0b3IiLCJBdWRpdFJlY29yZHMiLCJyZWZlcmVuY2VfdG8iLCJ2YWx1ZSIsInNwYWNlX2lkIiwibmFtZV9maWVsZF9rZXkiLCJvYmoiLCJwcmV2aW91c19pZHMiLCJyZWZlcmVuY2VfdG9fb2JqZWN0IiwidmFsdWVzIiwiXyIsImlzQXJyYXkiLCJpc09iamVjdCIsIm8iLCJpZHMiLCJnZXRPYmplY3QiLCJOQU1FX0ZJRUxEX0tFWSIsImdldENvbGxlY3Rpb24iLCJmaW5kIiwiX2lkIiwiJGluIiwiZmllbGRzIiwiZmV0Y2giLCJnZXRPcmRlcmx5U2V0QnlJZHMiLCJwbHVjayIsImpvaW4iLCJmaWVsZCIsImlzRnVuY3Rpb24iLCJvcHRpb25zRnVuY3Rpb24iLCJpc1N0cmluZyIsIm9wdGlvbnMiLCJzZWxlY3RlZF92YWx1ZSIsInV0Y09mZnNldCIsImlzTnVsbCIsImlzVW5kZWZpbmVkIiwidHlwZSIsIm1vbWVudCIsInV0YyIsImZvcm1hdCIsImlzQm9vbGVhbiIsIm1hcCIsIm9wdGlvbiIsImNvbnRhaW5zIiwibGFiZWwiLCJjb21wYWN0IiwidXNlcklkIiwib2JqZWN0X25hbWUiLCJuZXdfZG9jIiwiY29sbGVjdGlvbiIsImRvYyIsInJlY29yZF9pZCIsInNwYWNlIiwiX21ha2VOZXdJRCIsImZpZWxkX25hbWUiLCJyZWxhdGVkX3RvIiwiaW5zZXJ0IiwicHJldmlvdXNfZG9jIiwibW9kaWZpZXIiLCJtb2RpZmllclNldCIsIm1vZGlmaWVyVW5zZXQiLCJyZWYiLCJjb252ZXJ0T2JqZWN0IiwiJHNldCIsIiR1bnNldCIsImVhY2giLCJ2IiwiayIsImRiX25ld192YWx1ZSIsImRiX3ByZXZpb3VzX3ZhbHVlIiwibmV3X3ZhbHVlIiwicHJldmlvdXNfdmFsdWUiLCJ0b1N0cmluZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJuYW1lIiwiYWRkIiwiYWN0aW9uIiwiT2JqZWN0cyIsImF1ZGl0X3JlY29yZHMiLCJpY29uIiwiaW5kZXgiLCJvYmplY3QiLCJlbmFibGVfYXVkaXQiLCJwdXNoIiwiZmlsdGVyYWJsZSIsImlzX25hbWUiLCJjcmVhdGVkIiwicmVxdWlyZWQiLCJpc193aWRlIiwiY3JlYXRlZF9ieSIsImxpc3Rfdmlld3MiLCJhbGwiLCJmaWx0ZXJfc2NvcGUiLCJjb2x1bW5zIiwiZmlsdGVyX2ZpZWxkcyIsInJlY2VudCIsInBlcm1pc3Npb25fc2V0IiwidXNlciIsImFsbG93Q3JlYXRlIiwiYWxsb3dEZWxldGUiLCJhbGxvd0VkaXQiLCJhbGxvd1JlYWQiLCJtb2RpZnlBbGxSZWNvcmRzIiwidmlld0FsbFJlY29yZHMiLCJhZG1pbiIsImF1ZGl0X2xvZ2luIiwidXNlcm5hbWUiLCJsb2dpbl90aW1lIiwic291cmNlX2lwIiwibG9jYXRpb24iLCJsb2dpbl90eXBlIiwic3RhdHVzIiwiYnJvd3NlciIsInBsYXRmb3JtIiwiYXBwbGljYXRpb24iLCJjbGllbnRfdmVyc2lvbiIsImFwaV90eXBlIiwiYXBpX3ZlcnNpb24iLCJsb2dpbl91cmwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7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YjtBQUVBQyxpQkFBVyxLQUZYO0FBR0FDLGlCQUFXLElBSFg7QUFJQUMsd0JBQWtCLEtBSmxCO0FBS0FDLHNCQUFnQjtBQUxoQixLQUREO0FBT0FDLFdBQ0M7QUFBQU4sbUJBQWEsS0FBYjtBQUNBQyxtQkFBYSxLQURiO0FBRUFDLGlCQUFXLEtBRlg7QUFHQUMsaUJBQVcsSUFIWDtBQUlBQyx3QkFBa0IsS0FKbEI7QUFLQUMsc0JBQWdCO0FBTGhCO0FBUkQ7QUFuRUQsQ0FERCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2F1ZGl0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xvbmUgPSByZXF1aXJlKFwiY2xvbmVcIik7XG5DcmVhdG9yLkF1ZGl0UmVjb3JkcyA9IHt9XG5cbmdldExvb2t1cEZpZWxkVmFsdWUgPSAocmVmZXJlbmNlX3RvLCB2YWx1ZSwgc3BhY2VfaWQpLT5cblx0aWYgXy5pc0FycmF5KHJlZmVyZW5jZV90bykgJiYgXy5pc09iamVjdCh2YWx1ZSlcblx0XHRyZWZlcmVuY2VfdG8gPSB2YWx1ZS5vXG5cdFx0cHJldmlvdXNfaWRzID0gdmFsdWUuaWRzXG5cdGlmICFfLmlzQXJyYXkocHJldmlvdXNfaWRzKVxuXHRcdHByZXZpb3VzX2lkcyA9IGlmIHZhbHVlIHRoZW4gW3ZhbHVlXSBlbHNlIFtdXG5cdHJlZmVyZW5jZV90b19vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWZlcmVuY2VfdG8sIHNwYWNlX2lkKVxuXHRuYW1lX2ZpZWxkX2tleSA9IHJlZmVyZW5jZV90b19vYmplY3QuTkFNRV9GSUVMRF9LRVlcblx0dmFsdWVzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bywgc3BhY2VfaWQpLmZpbmQoe19pZDogeyRpbjogcHJldmlvdXNfaWRzfX0sIHtmaWVsZHM6IHtfaWQ6MSwgXCIje25hbWVfZmllbGRfa2V5fVwiOiAxfX0pLmZldGNoKClcblx0dmFsdWVzID0gQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHModmFsdWVzLCBwcmV2aW91c19pZHMpXG5cdHJldHVybiAoXy5wbHVjayB2YWx1ZXMsIG5hbWVfZmllbGRfa2V5KS5qb2luKCcsJylcblxuZ2V0TG9va3VwRmllbGRNb2RpZmllciA9IChmaWVsZCwgdmFsdWUsIHNwYWNlX2lkKS0+XG5cdHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xuXHRpZiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKVxuXHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90bygpXG5cdGlmIF8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zRnVuY3Rpb24pXG5cdFx0aWYgXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pXG5cdFx0XHRpZiB2YWx1ZVxuXHRcdFx0XHRyZXR1cm4gZ2V0TG9va3VwRmllbGRWYWx1ZShyZWZlcmVuY2VfdG8sIHZhbHVlLCBzcGFjZV9pZClcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gJydcblx0ZWxzZVxuXHRcdHJldHVybiBnZXRMb29rdXBGaWVsZFZhbHVlKHJlZmVyZW5jZV90bywgdmFsdWUsIHNwYWNlX2lkKVxuXG4jIyNcbuWtl+auteWAvOi9rOaNouinhOWImTpcbjEg5pel5pyfIOagvOW8j+WtmOWCqOS4uiAoU3RyaW5nKTogMjAxOC0wMS0wMlxuMiDml7bpl7Qg5qC85byP5a2Y5YKo5Li6IChTdHJpbmcpOiAyMDE4LTAxLTAyIDIzOjEyXG4yIGxvb2t1cCDlkozkuIvmi4nmoYbvvIzpg73mmK/lr7nlupTnmoTmmL7npLrlkI3np7AgKG5hbWUgfCBsYWJlbClcbjMgYm9vbGVhbiDlsLHlrZjmmK8v5ZCmXG40IOWkmuihjOaWh+acrFxcZ3JpZFxcbG9va3Vw5pyJb3B0aW9uc0Z1bmN0aW9u5bm25LiU5rKh5pyJcmVmZXJlbmNlX3Rv5pe2IOS4jeiusOW9leaWsOaXp+WAvCwg5Y+q6K6w5b2V5L+u5pS55pe26Ze0LCDkv67mlLnkurosIOS/ruaUueeahOWtl+auteaYvuekuuWQjVxuIyMjXG50cmFuc2Zvcm1GaWVsZFZhbHVlID0gKGZpZWxkLCB2YWx1ZSwgb3B0aW9ucyktPlxuXG5cdGlmIF8uaXNOdWxsKHZhbHVlKSB8fCBfLmlzVW5kZWZpbmVkKHZhbHVlKVxuXHRcdHJldHVyblxuXG5cdHV0Y09mZnNldCA9IG9wdGlvbnMudXRjT2Zmc2V0XG5cdHNwYWNlX2lkID0gb3B0aW9ucy5zcGFjZV9pZFxuXG5cdHN3aXRjaCBmaWVsZC50eXBlXG5cdFx0d2hlbiAnZGF0ZSdcblx0XHRcdHJldHVybiBtb21lbnQudXRjKHZhbHVlKS5mb3JtYXQoJ1lZWVktTU0tREQnKVxuXHRcdHdoZW4gJ2RhdGV0aW1lJ1xuXHRcdFx0cmV0dXJuIG1vbWVudCh2YWx1ZSkudXRjT2Zmc2V0KHV0Y09mZnNldCkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJylcblx0XHR3aGVuICdib29sZWFuJ1xuXHRcdFx0aWYgXy5pc0Jvb2xlYW4odmFsdWUpXG5cdFx0XHRcdGlmIHZhbHVlXG5cdFx0XHRcdFx0cmV0dXJuICfmmK8nXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm4gJ+WQpidcblx0XHR3aGVuICdzZWxlY3QnXG5cdFx0XHRpZiBfLmlzU3RyaW5nKHZhbHVlKVxuXHRcdFx0XHR2YWx1ZSA9IFt2YWx1ZV1cblx0XHRcdHNlbGVjdGVkX3ZhbHVlID0gXy5tYXAgZmllbGQub3B0aW9ucywgKG9wdGlvbiktPlxuXHRcdFx0XHRpZiBfLmNvbnRhaW5zKHZhbHVlLCBvcHRpb24udmFsdWUpXG5cdFx0XHRcdFx0cmV0dXJuIG9wdGlvbi5sYWJlbFxuXHRcdFx0cmV0dXJuIF8uY29tcGFjdChzZWxlY3RlZF92YWx1ZSkuam9pbignLCcpXG5cdFx0d2hlbiAnY2hlY2tib3gnXG5cdFx0XHRpZiBfLmlzU3RyaW5nKHZhbHVlKVxuXHRcdFx0XHR2YWx1ZSA9IFt2YWx1ZV1cblx0XHRcdHNlbGVjdGVkX3ZhbHVlID0gXy5tYXAgZmllbGQub3B0aW9ucywgKG9wdGlvbiktPlxuXHRcdFx0XHRpZiBfLmNvbnRhaW5zKHZhbHVlLCBvcHRpb24udmFsdWUpXG5cdFx0XHRcdFx0cmV0dXJuIG9wdGlvbi5sYWJlbFxuXHRcdFx0cmV0dXJuIF8uY29tcGFjdChzZWxlY3RlZF92YWx1ZSkuam9pbignLCcpXG5cdFx0d2hlbiAnbG9va3VwJ1xuXHRcdFx0cmV0dXJuIGdldExvb2t1cEZpZWxkTW9kaWZpZXIoZmllbGQsIHZhbHVlLCBzcGFjZV9pZClcblx0XHR3aGVuICdtYXN0ZXJfZGV0YWlsJ1xuXHRcdFx0cmV0dXJuIGdldExvb2t1cEZpZWxkTW9kaWZpZXIoZmllbGQsIHZhbHVlLCBzcGFjZV9pZClcblx0XHR3aGVuICd0ZXh0YXJlYSdcblx0XHRcdHJldHVybiAnJ1xuXHRcdHdoZW4gJ2NvZGUnXG5cdFx0XHRyZXR1cm4gJydcblx0XHR3aGVuICdodG1sJ1xuXHRcdFx0cmV0dXJuICcnXG5cdFx0d2hlbiAnbWFya2Rvd24nXG5cdFx0XHRyZXR1cm4gJydcblx0XHR3aGVuICdncmlkJ1xuXHRcdFx0cmV0dXJuICcnXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHZhbHVlXG5cbiMg5paw5bu65pe2LCDkuI3orrDlvZXmmI7nu4Zcbmluc2VydFJlY29yZCA9ICh1c2VySWQsIG9iamVjdF9uYW1lLCBuZXdfZG9jKS0+XG4jXHRpZiAhdXNlcklkXG4jXHRcdHJldHVyblxuXG5cdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhdWRpdF9yZWNvcmRzXCIpXG5cdHNwYWNlX2lkID0gbmV3X2RvYy5zcGFjZVxuXHRyZWNvcmRfaWQgPSBuZXdfZG9jLl9pZFxuXHRkb2MgPSB7XG5cdFx0X2lkOiBjb2xsZWN0aW9uLl9tYWtlTmV3SUQoKVxuXHRcdHNwYWNlOiBzcGFjZV9pZFxuXHRcdGZpZWxkX25hbWU6IFwi5bey5Yib5bu644CCXCJcblx0XHRyZWxhdGVkX3RvOiB7XG5cdFx0XHRvOiBvYmplY3RfbmFtZVxuXHRcdFx0aWRzOiBbcmVjb3JkX2lkXVxuXHRcdH1cblx0fVxuXHRjb2xsZWN0aW9uLmluc2VydCBkb2NcblxuIyDkv67mlLnml7YsIOiusOW9leWtl+auteWPmOabtOaYjue7hlxudXBkYXRlUmVjb3JkID0gKHVzZXJJZCwgb2JqZWN0X25hbWUsIG5ld19kb2MsIHByZXZpb3VzX2RvYywgbW9kaWZpZXIpLT5cbiNcdGlmICF1c2VySWRcbiNcdFx0cmV0dXJuXG5cdHNwYWNlX2lkID0gbmV3X2RvYy5zcGFjZVxuXHRyZWNvcmRfaWQgPSBuZXdfZG9jLl9pZFxuXG5cdGZpZWxkcyA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VfaWQpKSwgc3BhY2VfaWQpPy5maWVsZHNcblxuXHRtb2RpZmllclNldCA9IG1vZGlmaWVyLiRzZXRcblxuXHRtb2RpZmllclVuc2V0ID0gbW9kaWZpZXIuJHVuc2V0XG5cblx0IyMjIFRPRE8gdXRjT2Zmc2V0IOW6lOivpeadpeiHquaVsOaNruW6kyzlvoUgIzk4NCDlpITnkIblkI4g6LCD5pW0XG5cbiAgICB1dGNPZmZzZXQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJ1c2Vyc1wiKS5maW5kT25lKHtfaWQ6IHVzZXJJZH0pPy51dGNPZmZzZXRcblxuXHRpZiAhXy5pc051bWJlcih1dGNPZmZzZXQpXG5cdFx0dXRjT2Zmc2V0ID0gOFxuXHQjIyNcblxuXHR1dGNPZmZzZXQgPSA4XG5cblx0b3B0aW9ucyA9IHt1dGNPZmZzZXQ6IHV0Y09mZnNldCwgc3BhY2VfaWQ6IHNwYWNlX2lkfVxuXG5cdF8uZWFjaCBtb2RpZmllclNldCwgKHYsIGspLT5cblx0XHRmaWVsZCA9IGZpZWxkcz9ba11cblx0XHRwcmV2aW91c192YWx1ZSA9IHByZXZpb3VzX2RvY1trXVxuXHRcdG5ld192YWx1ZSA9IHZcblxuXHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gbnVsbFxuXHRcdGRiX25ld192YWx1ZSA9IG51bGxcblxuXHRcdHN3aXRjaCBmaWVsZC50eXBlXG5cdFx0XHR3aGVuICdkYXRlJ1xuXHRcdFx0XHRpZiBuZXdfdmFsdWU/LnRvU3RyaW5nKCkgIT0gcHJldmlvdXNfdmFsdWU/LnRvU3RyaW5nKClcblx0XHRcdFx0XHRpZiBuZXdfdmFsdWVcblx0XHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucylcblx0XHRcdFx0XHRpZiBwcmV2aW91c192YWx1ZVxuXHRcdFx0XHRcdFx0ZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucylcblx0XHRcdHdoZW4gJ2RhdGV0aW1lJ1xuXHRcdFx0XHRpZiBuZXdfdmFsdWU/LnRvU3RyaW5nKCkgIT0gcHJldmlvdXNfdmFsdWU/LnRvU3RyaW5nKClcblx0XHRcdFx0XHRpZiBuZXdfdmFsdWVcblx0XHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucylcblx0XHRcdFx0XHRpZiBwcmV2aW91c192YWx1ZVxuXHRcdFx0XHRcdFx0ZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucylcblx0XHRcdHdoZW4gJ3RleHRhcmVhJ1xuXHRcdFx0XHRpZiBwcmV2aW91c192YWx1ZSAhPSBuZXdfdmFsdWVcblx0XHRcdFx0XHRkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKVxuXHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucylcblx0XHRcdHdoZW4gJ2NvZGUnXG5cdFx0XHRcdGlmIHByZXZpb3VzX3ZhbHVlICE9IG5ld192YWx1ZVxuXHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXG5cdFx0XHRcdFx0ZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKVxuXHRcdFx0d2hlbiAnaHRtbCdcblx0XHRcdFx0aWYgcHJldmlvdXNfdmFsdWUgIT0gbmV3X3ZhbHVlXG5cdFx0XHRcdFx0ZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucylcblx0XHRcdFx0XHRkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpXG5cdFx0XHR3aGVuICdtYXJrZG93bidcblx0XHRcdFx0aWYgcHJldmlvdXNfdmFsdWUgIT0gbmV3X3ZhbHVlXG5cdFx0XHRcdFx0ZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucylcblx0XHRcdFx0XHRkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpXG5cdFx0XHR3aGVuICdncmlkJ1xuXHRcdFx0XHRpZiBKU09OLnN0cmluZ2lmeShwcmV2aW91c192YWx1ZSkgIT0gSlNPTi5zdHJpbmdpZnkobmV3X3ZhbHVlKVxuXHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXG5cdFx0XHRcdFx0ZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKVxuXHRcdFx0d2hlbiAnYm9vbGVhbidcblx0XHRcdFx0aWYgcHJldmlvdXNfdmFsdWUgIT0gbmV3X3ZhbHVlXG5cdFx0XHRcdFx0ZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucylcblx0XHRcdFx0XHRkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpXG5cdFx0XHR3aGVuICdzZWxlY3QnXG5cdFx0XHRcdGlmIHByZXZpb3VzX3ZhbHVlPy50b1N0cmluZygpICE9IG5ld192YWx1ZT8udG9TdHJpbmcoKVxuXHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXG5cdFx0XHRcdFx0ZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKVxuXHRcdFx0d2hlbiAnY2hlY2tib3gnXG5cdFx0XHRcdGlmIHByZXZpb3VzX3ZhbHVlPy50b1N0cmluZygpICE9IG5ld192YWx1ZT8udG9TdHJpbmcoKVxuXHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXG5cdFx0XHRcdFx0ZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKVxuXHRcdFx0d2hlbiAnbG9va3VwJ1xuXHRcdFx0XHRpZiBKU09OLnN0cmluZ2lmeShwcmV2aW91c192YWx1ZSkgIT0gSlNPTi5zdHJpbmdpZnkobmV3X3ZhbHVlKVxuXHRcdFx0XHRcdGlmIHByZXZpb3VzX3ZhbHVlXG5cdFx0XHRcdFx0XHRkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKVxuXHRcdFx0XHRcdGlmIG5ld192YWx1ZVxuXHRcdFx0XHRcdFx0ZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKVxuXHRcdFx0d2hlbiAnbWFzdGVyX2RldGFpbCdcblx0XHRcdFx0aWYgSlNPTi5zdHJpbmdpZnkocHJldmlvdXNfdmFsdWUpICE9IEpTT04uc3RyaW5naWZ5KG5ld192YWx1ZSlcblx0XHRcdFx0XHRpZiBwcmV2aW91c192YWx1ZVxuXHRcdFx0XHRcdFx0ZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucylcblx0XHRcdFx0XHRpZiBuZXdfdmFsdWVcblx0XHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucylcblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgbmV3X3ZhbHVlICE9IHByZXZpb3VzX3ZhbHVlXG5cdFx0XHRcdFx0ZGJfcHJldmlvdXNfdmFsdWUgPSBwcmV2aW91c192YWx1ZVxuXHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IG5ld192YWx1ZVxuXG5cdFx0aWYgKGRiX25ld192YWx1ZSAhPSBudWxsICYmIGRiX25ld192YWx1ZSAhPSB1bmRlZmluZWQpIHx8IChkYl9wcmV2aW91c192YWx1ZSAhPSBudWxsICYmIGRiX3ByZXZpb3VzX3ZhbHVlICE9IHVuZGVmaW5lZClcblx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhdWRpdF9yZWNvcmRzXCIpXG5cdFx0XHRkb2MgPSB7XG5cdFx0XHRcdF9pZDogY29sbGVjdGlvbi5fbWFrZU5ld0lEKClcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkXG5cdFx0XHRcdGZpZWxkX25hbWU6IGZpZWxkLmxhYmVsIHx8IGZpZWxkLm5hbWVcblx0XHRcdFx0cHJldmlvdXNfdmFsdWU6IGRiX3ByZXZpb3VzX3ZhbHVlXG5cdFx0XHRcdG5ld192YWx1ZTogZGJfbmV3X3ZhbHVlXG5cdFx0XHRcdHJlbGF0ZWRfdG86IHtcblx0XHRcdFx0XHRvOiBvYmplY3RfbmFtZVxuXHRcdFx0XHRcdGlkczogW3JlY29yZF9pZF1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Y29sbGVjdGlvbi5pbnNlcnQgZG9jXG5cblx0Xy5lYWNoIG1vZGlmaWVyVW5zZXQsICh2LCBrKS0+XG5cdFx0ZmllbGQgPSBmaWVsZHM/W2tdXG5cdFx0cHJldmlvdXNfdmFsdWUgPSBwcmV2aW91c19kb2Nba11cblx0XHRpZiBwcmV2aW91c192YWx1ZSB8fCBfLmlzQm9vbGVhbihwcmV2aW91c192YWx1ZSlcblx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhdWRpdF9yZWNvcmRzXCIpXG5cdFx0XHRkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKVxuXHRcdFx0ZG9jID0ge1xuXHRcdFx0XHRfaWQ6IGNvbGxlY3Rpb24uX21ha2VOZXdJRCgpXG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZFxuXHRcdFx0XHRmaWVsZF9uYW1lOiBmaWVsZC5sYWJlbCB8fCBmaWVsZC5uYW1lXG5cdFx0XHRcdHByZXZpb3VzX3ZhbHVlOiBkYl9wcmV2aW91c192YWx1ZVxuXHRcdFx0XHRyZWxhdGVkX3RvOiB7XG5cdFx0XHRcdFx0bzogb2JqZWN0X25hbWVcblx0XHRcdFx0XHRpZHM6IFtyZWNvcmRfaWRdXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNvbGxlY3Rpb24uaW5zZXJ0IGRvY1xuXG5DcmVhdG9yLkF1ZGl0UmVjb3Jkcy5hZGQgPSAoYWN0aW9uLCB1c2VySWQsIG9iamVjdF9uYW1lLCBuZXdfZG9jLCBwcmV2aW91c19kb2MsIG1vZGlmaWVyKS0+XG5cdGlmIGFjdGlvbiA9PSAndXBkYXRlJ1xuXHRcdHVwZGF0ZVJlY29yZCh1c2VySWQsIG9iamVjdF9uYW1lLCBuZXdfZG9jLCBwcmV2aW91c19kb2MsIG1vZGlmaWVyKVxuXHRlbHNlIGlmIGFjdGlvbiA9PSAnaW5zZXJ0J1xuXHRcdGluc2VydFJlY29yZCh1c2VySWQsIG9iamVjdF9uYW1lLCBuZXdfZG9jKVxuIiwidmFyIGNsb25lLCBnZXRMb29rdXBGaWVsZE1vZGlmaWVyLCBnZXRMb29rdXBGaWVsZFZhbHVlLCBpbnNlcnRSZWNvcmQsIHRyYW5zZm9ybUZpZWxkVmFsdWUsIHVwZGF0ZVJlY29yZDtcblxuY2xvbmUgPSByZXF1aXJlKFwiY2xvbmVcIik7XG5cbkNyZWF0b3IuQXVkaXRSZWNvcmRzID0ge307XG5cbmdldExvb2t1cEZpZWxkVmFsdWUgPSBmdW5jdGlvbihyZWZlcmVuY2VfdG8sIHZhbHVlLCBzcGFjZV9pZCkge1xuICB2YXIgbmFtZV9maWVsZF9rZXksIG9iaiwgcHJldmlvdXNfaWRzLCByZWZlcmVuY2VfdG9fb2JqZWN0LCB2YWx1ZXM7XG4gIGlmIChfLmlzQXJyYXkocmVmZXJlbmNlX3RvKSAmJiBfLmlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJlZmVyZW5jZV90byA9IHZhbHVlLm87XG4gICAgcHJldmlvdXNfaWRzID0gdmFsdWUuaWRzO1xuICB9XG4gIGlmICghXy5pc0FycmF5KHByZXZpb3VzX2lkcykpIHtcbiAgICBwcmV2aW91c19pZHMgPSB2YWx1ZSA/IFt2YWx1ZV0gOiBbXTtcbiAgfVxuICByZWZlcmVuY2VfdG9fb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVmZXJlbmNlX3RvLCBzcGFjZV9pZCk7XG4gIG5hbWVfZmllbGRfa2V5ID0gcmVmZXJlbmNlX3RvX29iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgdmFsdWVzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bywgc3BhY2VfaWQpLmZpbmQoe1xuICAgIF9pZDoge1xuICAgICAgJGluOiBwcmV2aW91c19pZHNcbiAgICB9XG4gIH0sIHtcbiAgICBmaWVsZHM6IChcbiAgICAgIG9iaiA9IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9LFxuICAgICAgb2JqW1wiXCIgKyBuYW1lX2ZpZWxkX2tleV0gPSAxLFxuICAgICAgb2JqXG4gICAgKVxuICB9KS5mZXRjaCgpO1xuICB2YWx1ZXMgPSBDcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyh2YWx1ZXMsIHByZXZpb3VzX2lkcyk7XG4gIHJldHVybiAoXy5wbHVjayh2YWx1ZXMsIG5hbWVfZmllbGRfa2V5KSkuam9pbignLCcpO1xufTtcblxuZ2V0TG9va3VwRmllbGRNb2RpZmllciA9IGZ1bmN0aW9uKGZpZWxkLCB2YWx1ZSwgc3BhY2VfaWQpIHtcbiAgdmFyIHJlZmVyZW5jZV90bztcbiAgcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICBpZiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bykpIHtcbiAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8oKTtcbiAgfVxuICBpZiAoXy5pc0Z1bmN0aW9uKGZpZWxkLm9wdGlvbnNGdW5jdGlvbikpIHtcbiAgICBpZiAoXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pKSB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGdldExvb2t1cEZpZWxkVmFsdWUocmVmZXJlbmNlX3RvLCB2YWx1ZSwgc3BhY2VfaWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBnZXRMb29rdXBGaWVsZFZhbHVlKHJlZmVyZW5jZV90bywgdmFsdWUsIHNwYWNlX2lkKTtcbiAgfVxufTtcblxuXG4vKlxu5a2X5q615YC86L2s5o2i6KeE5YiZOlxuMSDml6XmnJ8g5qC85byP5a2Y5YKo5Li6IChTdHJpbmcpOiAyMDE4LTAxLTAyXG4yIOaXtumXtCDmoLzlvI/lrZjlgqjkuLogKFN0cmluZyk6IDIwMTgtMDEtMDIgMjM6MTJcbjIgbG9va3VwIOWSjOS4i+aLieahhu+8jOmDveaYr+WvueW6lOeahOaYvuekuuWQjeensCAobmFtZSB8IGxhYmVsKVxuMyBib29sZWFuIOWwseWtmOaYry/lkKZcbjQg5aSa6KGM5paH5pysXFxncmlkXFxsb29rdXDmnIlvcHRpb25zRnVuY3Rpb27lubbkuJTmsqHmnIlyZWZlcmVuY2VfdG/ml7Yg5LiN6K6w5b2V5paw5pen5YC8LCDlj6rorrDlvZXkv67mlLnml7bpl7QsIOS/ruaUueS6uiwg5L+u5pS555qE5a2X5q615pi+56S65ZCNXG4gKi9cblxudHJhbnNmb3JtRmllbGRWYWx1ZSA9IGZ1bmN0aW9uKGZpZWxkLCB2YWx1ZSwgb3B0aW9ucykge1xuICB2YXIgc2VsZWN0ZWRfdmFsdWUsIHNwYWNlX2lkLCB1dGNPZmZzZXQ7XG4gIGlmIChfLmlzTnVsbCh2YWx1ZSkgfHwgXy5pc1VuZGVmaW5lZCh2YWx1ZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdXRjT2Zmc2V0ID0gb3B0aW9ucy51dGNPZmZzZXQ7XG4gIHNwYWNlX2lkID0gb3B0aW9ucy5zcGFjZV9pZDtcbiAgc3dpdGNoIChmaWVsZC50eXBlKSB7XG4gICAgY2FzZSAnZGF0ZSc6XG4gICAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gICAgY2FzZSAnZGF0ZXRpbWUnOlxuICAgICAgcmV0dXJuIG1vbWVudCh2YWx1ZSkudXRjT2Zmc2V0KHV0Y09mZnNldCkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyk7XG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICBpZiAoXy5pc0Jvb2xlYW4odmFsdWUpKSB7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiAn5pivJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJ+WQpic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICBpZiAoXy5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSBbdmFsdWVdO1xuICAgICAgfVxuICAgICAgc2VsZWN0ZWRfdmFsdWUgPSBfLm1hcChmaWVsZC5vcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgaWYgKF8uY29udGFpbnModmFsdWUsIG9wdGlvbi52YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gb3B0aW9uLmxhYmVsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLmNvbXBhY3Qoc2VsZWN0ZWRfdmFsdWUpLmpvaW4oJywnKTtcbiAgICBjYXNlICdjaGVja2JveCc6XG4gICAgICBpZiAoXy5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSBbdmFsdWVdO1xuICAgICAgfVxuICAgICAgc2VsZWN0ZWRfdmFsdWUgPSBfLm1hcChmaWVsZC5vcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgaWYgKF8uY29udGFpbnModmFsdWUsIG9wdGlvbi52YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gb3B0aW9uLmxhYmVsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLmNvbXBhY3Qoc2VsZWN0ZWRfdmFsdWUpLmpvaW4oJywnKTtcbiAgICBjYXNlICdsb29rdXAnOlxuICAgICAgcmV0dXJuIGdldExvb2t1cEZpZWxkTW9kaWZpZXIoZmllbGQsIHZhbHVlLCBzcGFjZV9pZCk7XG4gICAgY2FzZSAnbWFzdGVyX2RldGFpbCc6XG4gICAgICByZXR1cm4gZ2V0TG9va3VwRmllbGRNb2RpZmllcihmaWVsZCwgdmFsdWUsIHNwYWNlX2lkKTtcbiAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICByZXR1cm4gJyc7XG4gICAgY2FzZSAnY29kZSc6XG4gICAgICByZXR1cm4gJyc7XG4gICAgY2FzZSAnaHRtbCc6XG4gICAgICByZXR1cm4gJyc7XG4gICAgY2FzZSAnbWFya2Rvd24nOlxuICAgICAgcmV0dXJuICcnO1xuICAgIGNhc2UgJ2dyaWQnOlxuICAgICAgcmV0dXJuICcnO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn07XG5cbmluc2VydFJlY29yZCA9IGZ1bmN0aW9uKHVzZXJJZCwgb2JqZWN0X25hbWUsIG5ld19kb2MpIHtcbiAgdmFyIGNvbGxlY3Rpb24sIGRvYywgcmVjb3JkX2lkLCBzcGFjZV9pZDtcbiAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImF1ZGl0X3JlY29yZHNcIik7XG4gIHNwYWNlX2lkID0gbmV3X2RvYy5zcGFjZTtcbiAgcmVjb3JkX2lkID0gbmV3X2RvYy5faWQ7XG4gIGRvYyA9IHtcbiAgICBfaWQ6IGNvbGxlY3Rpb24uX21ha2VOZXdJRCgpLFxuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBmaWVsZF9uYW1lOiBcIuW3suWIm+W7uuOAglwiLFxuICAgIHJlbGF0ZWRfdG86IHtcbiAgICAgIG86IG9iamVjdF9uYW1lLFxuICAgICAgaWRzOiBbcmVjb3JkX2lkXVxuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGNvbGxlY3Rpb24uaW5zZXJ0KGRvYyk7XG59O1xuXG51cGRhdGVSZWNvcmQgPSBmdW5jdGlvbih1c2VySWQsIG9iamVjdF9uYW1lLCBuZXdfZG9jLCBwcmV2aW91c19kb2MsIG1vZGlmaWVyKSB7XG4gIHZhciBmaWVsZHMsIG1vZGlmaWVyU2V0LCBtb2RpZmllclVuc2V0LCBvcHRpb25zLCByZWNvcmRfaWQsIHJlZiwgc3BhY2VfaWQsIHV0Y09mZnNldDtcbiAgc3BhY2VfaWQgPSBuZXdfZG9jLnNwYWNlO1xuICByZWNvcmRfaWQgPSBuZXdfZG9jLl9pZDtcbiAgZmllbGRzID0gKHJlZiA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VfaWQpKSwgc3BhY2VfaWQpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMDtcbiAgbW9kaWZpZXJTZXQgPSBtb2RpZmllci4kc2V0O1xuICBtb2RpZmllclVuc2V0ID0gbW9kaWZpZXIuJHVuc2V0O1xuXG4gIC8qIFRPRE8gdXRjT2Zmc2V0IOW6lOivpeadpeiHquaVsOaNruW6kyzlvoUgIzk4NCDlpITnkIblkI4g6LCD5pW0XG4gIFxuICAgICB1dGNPZmZzZXQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJ1c2Vyc1wiKS5maW5kT25lKHtfaWQ6IHVzZXJJZH0pPy51dGNPZmZzZXRcbiAgXG4gIFx0aWYgIV8uaXNOdW1iZXIodXRjT2Zmc2V0KVxuICBcdFx0dXRjT2Zmc2V0ID0gOFxuICAgKi9cbiAgdXRjT2Zmc2V0ID0gODtcbiAgb3B0aW9ucyA9IHtcbiAgICB1dGNPZmZzZXQ6IHV0Y09mZnNldCxcbiAgICBzcGFjZV9pZDogc3BhY2VfaWRcbiAgfTtcbiAgXy5lYWNoKG1vZGlmaWVyU2V0LCBmdW5jdGlvbih2LCBrKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGRiX25ld192YWx1ZSwgZGJfcHJldmlvdXNfdmFsdWUsIGRvYywgZmllbGQsIG5ld192YWx1ZSwgcHJldmlvdXNfdmFsdWU7XG4gICAgZmllbGQgPSBmaWVsZHMgIT0gbnVsbCA/IGZpZWxkc1trXSA6IHZvaWQgMDtcbiAgICBwcmV2aW91c192YWx1ZSA9IHByZXZpb3VzX2RvY1trXTtcbiAgICBuZXdfdmFsdWUgPSB2O1xuICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gbnVsbDtcbiAgICBkYl9uZXdfdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoZmllbGQudHlwZSkge1xuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgIGlmICgobmV3X3ZhbHVlICE9IG51bGwgPyBuZXdfdmFsdWUudG9TdHJpbmcoKSA6IHZvaWQgMCkgIT09IChwcmV2aW91c192YWx1ZSAhPSBudWxsID8gcHJldmlvdXNfdmFsdWUudG9TdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICBpZiAobmV3X3ZhbHVlKSB7XG4gICAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocHJldmlvdXNfdmFsdWUpIHtcbiAgICAgICAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RhdGV0aW1lJzpcbiAgICAgICAgaWYgKChuZXdfdmFsdWUgIT0gbnVsbCA/IG5ld192YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKSAhPT0gKHByZXZpb3VzX3ZhbHVlICE9IG51bGwgPyBwcmV2aW91c192YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKSkge1xuICAgICAgICAgIGlmIChuZXdfdmFsdWUpIHtcbiAgICAgICAgICAgIGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwcmV2aW91c192YWx1ZSkge1xuICAgICAgICAgICAgZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgICBpZiAocHJldmlvdXNfdmFsdWUgIT09IG5ld192YWx1ZSkge1xuICAgICAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2RlJzpcbiAgICAgICAgaWYgKHByZXZpb3VzX3ZhbHVlICE9PSBuZXdfdmFsdWUpIHtcbiAgICAgICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaHRtbCc6XG4gICAgICAgIGlmIChwcmV2aW91c192YWx1ZSAhPT0gbmV3X3ZhbHVlKSB7XG4gICAgICAgICAgZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21hcmtkb3duJzpcbiAgICAgICAgaWYgKHByZXZpb3VzX3ZhbHVlICE9PSBuZXdfdmFsdWUpIHtcbiAgICAgICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZ3JpZCc6XG4gICAgICAgIGlmIChKU09OLnN0cmluZ2lmeShwcmV2aW91c192YWx1ZSkgIT09IEpTT04uc3RyaW5naWZ5KG5ld192YWx1ZSkpIHtcbiAgICAgICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIGlmIChwcmV2aW91c192YWx1ZSAhPT0gbmV3X3ZhbHVlKSB7XG4gICAgICAgICAgZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICAgIGlmICgocHJldmlvdXNfdmFsdWUgIT0gbnVsbCA/IHByZXZpb3VzX3ZhbHVlLnRvU3RyaW5nKCkgOiB2b2lkIDApICE9PSAobmV3X3ZhbHVlICE9IG51bGwgPyBuZXdfdmFsdWUudG9TdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgICBpZiAoKHByZXZpb3VzX3ZhbHVlICE9IG51bGwgPyBwcmV2aW91c192YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKSAhPT0gKG5ld192YWx1ZSAhPSBudWxsID8gbmV3X3ZhbHVlLnRvU3RyaW5nKCkgOiB2b2lkIDApKSB7XG4gICAgICAgICAgZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xvb2t1cCc6XG4gICAgICAgIGlmIChKU09OLnN0cmluZ2lmeShwcmV2aW91c192YWx1ZSkgIT09IEpTT04uc3RyaW5naWZ5KG5ld192YWx1ZSkpIHtcbiAgICAgICAgICBpZiAocHJldmlvdXNfdmFsdWUpIHtcbiAgICAgICAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobmV3X3ZhbHVlKSB7XG4gICAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21hc3Rlcl9kZXRhaWwnOlxuICAgICAgICBpZiAoSlNPTi5zdHJpbmdpZnkocHJldmlvdXNfdmFsdWUpICE9PSBKU09OLnN0cmluZ2lmeShuZXdfdmFsdWUpKSB7XG4gICAgICAgICAgaWYgKHByZXZpb3VzX3ZhbHVlKSB7XG4gICAgICAgICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG5ld192YWx1ZSkge1xuICAgICAgICAgICAgZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobmV3X3ZhbHVlICE9PSBwcmV2aW91c192YWx1ZSkge1xuICAgICAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gcHJldmlvdXNfdmFsdWU7XG4gICAgICAgICAgZGJfbmV3X3ZhbHVlID0gbmV3X3ZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICgoZGJfbmV3X3ZhbHVlICE9PSBudWxsICYmIGRiX25ld192YWx1ZSAhPT0gdm9pZCAwKSB8fCAoZGJfcHJldmlvdXNfdmFsdWUgIT09IG51bGwgJiYgZGJfcHJldmlvdXNfdmFsdWUgIT09IHZvaWQgMCkpIHtcbiAgICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhdWRpdF9yZWNvcmRzXCIpO1xuICAgICAgZG9jID0ge1xuICAgICAgICBfaWQ6IGNvbGxlY3Rpb24uX21ha2VOZXdJRCgpLFxuICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgIGZpZWxkX25hbWU6IGZpZWxkLmxhYmVsIHx8IGZpZWxkLm5hbWUsXG4gICAgICAgIHByZXZpb3VzX3ZhbHVlOiBkYl9wcmV2aW91c192YWx1ZSxcbiAgICAgICAgbmV3X3ZhbHVlOiBkYl9uZXdfdmFsdWUsXG4gICAgICAgIHJlbGF0ZWRfdG86IHtcbiAgICAgICAgICBvOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICBpZHM6IFtyZWNvcmRfaWRdXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gY29sbGVjdGlvbi5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gXy5lYWNoKG1vZGlmaWVyVW5zZXQsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZGJfcHJldmlvdXNfdmFsdWUsIGRvYywgZmllbGQsIHByZXZpb3VzX3ZhbHVlO1xuICAgIGZpZWxkID0gZmllbGRzICE9IG51bGwgPyBmaWVsZHNba10gOiB2b2lkIDA7XG4gICAgcHJldmlvdXNfdmFsdWUgPSBwcmV2aW91c19kb2Nba107XG4gICAgaWYgKHByZXZpb3VzX3ZhbHVlIHx8IF8uaXNCb29sZWFuKHByZXZpb3VzX3ZhbHVlKSkge1xuICAgICAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImF1ZGl0X3JlY29yZHNcIik7XG4gICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgIGRvYyA9IHtcbiAgICAgICAgX2lkOiBjb2xsZWN0aW9uLl9tYWtlTmV3SUQoKSxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICBmaWVsZF9uYW1lOiBmaWVsZC5sYWJlbCB8fCBmaWVsZC5uYW1lLFxuICAgICAgICBwcmV2aW91c192YWx1ZTogZGJfcHJldmlvdXNfdmFsdWUsXG4gICAgICAgIHJlbGF0ZWRfdG86IHtcbiAgICAgICAgICBvOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICBpZHM6IFtyZWNvcmRfaWRdXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gY29sbGVjdGlvbi5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH0pO1xufTtcblxuQ3JlYXRvci5BdWRpdFJlY29yZHMuYWRkID0gZnVuY3Rpb24oYWN0aW9uLCB1c2VySWQsIG9iamVjdF9uYW1lLCBuZXdfZG9jLCBwcmV2aW91c19kb2MsIG1vZGlmaWVyKSB7XG4gIGlmIChhY3Rpb24gPT09ICd1cGRhdGUnKSB7XG4gICAgcmV0dXJuIHVwZGF0ZVJlY29yZCh1c2VySWQsIG9iamVjdF9uYW1lLCBuZXdfZG9jLCBwcmV2aW91c19kb2MsIG1vZGlmaWVyKTtcbiAgfSBlbHNlIGlmIChhY3Rpb24gPT09ICdpbnNlcnQnKSB7XG4gICAgcmV0dXJuIGluc2VydFJlY29yZCh1c2VySWQsIG9iamVjdF9uYW1lLCBuZXdfZG9jKTtcbiAgfVxufTtcbiIsIkNyZWF0b3IuT2JqZWN0cy5hdWRpdF9yZWNvcmRzID1cblx0bmFtZTogXCJhdWRpdF9yZWNvcmRzXCJcblx0bGFiZWw6IFwi5a2X5q615Y6G5Y+yXCJcblx0aWNvbjogXCJyZWNvcmRcIlxuXHRmaWVsZHM6XG5cdFx0cmVsYXRlZF90bzpcblx0XHRcdGxhYmVsOiBcIuebuOWFs+mhuVwiXG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXG5cdFx0XHRpbmRleDogdHJ1ZVxuXHRcdFx0cmVmZXJlbmNlX3RvOiAoKS0+XG5cdFx0XHRcdG8gPSBbXVxuXHRcdFx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAob2JqZWN0LCBvYmplY3RfbmFtZSktPlxuXHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfYXVkaXRcblx0XHRcdFx0XHRcdG8ucHVzaCBvYmplY3QubmFtZVxuXHRcdFx0XHRyZXR1cm4gb1xuXHRcdFx0ZmlsdGVyYWJsZTp0cnVlXG5cdFx0XHRpc19uYW1lOiB0cnVlXG5cdFx0Y3JlYXRlZDpcblx0XHRcdGxhYmVsOlwi5pe26Ze0XCJcblx0XHRcdGZpbHRlcmFibGU6dHJ1ZVxuXHRcdGZpZWxkX25hbWU6XG5cdFx0XHRsYWJlbDogXCLlrZfmrrVcIlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblx0XHRcdHJlcXVpcmVkOiB0cnVlXG5cdFx0XHRpc193aWRlOiB0cnVlXG5cdFx0Y3JlYXRlZF9ieTpcblx0XHRcdGxhYmVsOlwi55So5oi3XCJcblx0XHRwcmV2aW91c192YWx1ZTpcblx0XHRcdGxhYmVsOiBcIuWOn+Wni+WAvFwiXG5cdFx0XHR0eXBlOiBcInRleHRcIlxuXHRcdG5ld192YWx1ZTpcblx0XHRcdGxhYmVsOiBcIuaWsOWAvFwiXG5cdFx0XHR0eXBlOiBcInRleHRcIlxuXG5cblx0bGlzdF92aWV3czpcblx0XHRhbGw6XG5cdFx0XHRsYWJlbDogXCLlhajpg6hcIlxuXHRcdFx0ZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcblx0XHRcdGNvbHVtbnM6IFtcInJlbGF0ZWRfdG9cIiwgXCJjcmVhdGVkXCIsIFwiZmllbGRfbmFtZVwiLCBcImNyZWF0ZWRfYnlcIiwgXCJwcmV2aW91c192YWx1ZVwiLCBcIm5ld192YWx1ZVwiXVxuXHRcdFx0ZmlsdGVyX2ZpZWxkczogW1wicmVsYXRlZF90b1wiXVxuXHRcdHJlY2VudDpcblx0XHRcdGxhYmVsOiBcIuacgOi/keafpeeci1wiXG5cdFx0XHRmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxuXG5cdHBlcm1pc3Npb25fc2V0OlxuXHRcdHVzZXI6XG5cdFx0XHRhbGxvd0NyZWF0ZTogZmFsc2Vcblx0XHRcdGFsbG93RGVsZXRlOiBmYWxzZVxuXHRcdFx0YWxsb3dFZGl0OiBmYWxzZVxuXHRcdFx0YWxsb3dSZWFkOiB0cnVlXG5cdFx0XHRtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZVxuXHRcdFx0dmlld0FsbFJlY29yZHM6IGZhbHNlXG5cdFx0YWRtaW46XG5cdFx0XHRhbGxvd0NyZWF0ZTogZmFsc2Vcblx0XHRcdGFsbG93RGVsZXRlOiBmYWxzZVxuXHRcdFx0YWxsb3dFZGl0OiBmYWxzZVxuXHRcdFx0YWxsb3dSZWFkOiB0cnVlXG5cdFx0XHRtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZVxuXHRcdFx0dmlld0FsbFJlY29yZHM6IHRydWUiLCJDcmVhdG9yLk9iamVjdHMuYXVkaXRfcmVjb3JkcyA9IHtcbiAgbmFtZTogXCJhdWRpdF9yZWNvcmRzXCIsXG4gIGxhYmVsOiBcIuWtl+auteWOhuWPslwiLFxuICBpY29uOiBcInJlY29yZFwiLFxuICBmaWVsZHM6IHtcbiAgICByZWxhdGVkX3RvOiB7XG4gICAgICBsYWJlbDogXCLnm7jlhbPpoblcIixcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICBpbmRleDogdHJ1ZSxcbiAgICAgIHJlZmVyZW5jZV90bzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvO1xuICAgICAgICBvID0gW107XG4gICAgICAgIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKG9iamVjdCwgb2JqZWN0X25hbWUpIHtcbiAgICAgICAgICBpZiAob2JqZWN0LmVuYWJsZV9hdWRpdCkge1xuICAgICAgICAgICAgcmV0dXJuIG8ucHVzaChvYmplY3QubmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG87XG4gICAgICB9LFxuICAgICAgZmlsdGVyYWJsZTogdHJ1ZSxcbiAgICAgIGlzX25hbWU6IHRydWVcbiAgICB9LFxuICAgIGNyZWF0ZWQ6IHtcbiAgICAgIGxhYmVsOiBcIuaXtumXtFwiLFxuICAgICAgZmlsdGVyYWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgZmllbGRfbmFtZToge1xuICAgICAgbGFiZWw6IFwi5a2X5q61XCIsXG4gICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaXNfd2lkZTogdHJ1ZVxuICAgIH0sXG4gICAgY3JlYXRlZF9ieToge1xuICAgICAgbGFiZWw6IFwi55So5oi3XCJcbiAgICB9LFxuICAgIHByZXZpb3VzX3ZhbHVlOiB7XG4gICAgICBsYWJlbDogXCLljp/lp4vlgLxcIixcbiAgICAgIHR5cGU6IFwidGV4dFwiXG4gICAgfSxcbiAgICBuZXdfdmFsdWU6IHtcbiAgICAgIGxhYmVsOiBcIuaWsOWAvFwiLFxuICAgICAgdHlwZTogXCJ0ZXh0XCJcbiAgICB9XG4gIH0sXG4gIGxpc3Rfdmlld3M6IHtcbiAgICBhbGw6IHtcbiAgICAgIGxhYmVsOiBcIuWFqOmDqFwiLFxuICAgICAgZmlsdGVyX3Njb3BlOiBcInNwYWNlXCIsXG4gICAgICBjb2x1bW5zOiBbXCJyZWxhdGVkX3RvXCIsIFwiY3JlYXRlZFwiLCBcImZpZWxkX25hbWVcIiwgXCJjcmVhdGVkX2J5XCIsIFwicHJldmlvdXNfdmFsdWVcIiwgXCJuZXdfdmFsdWVcIl0sXG4gICAgICBmaWx0ZXJfZmllbGRzOiBbXCJyZWxhdGVkX3RvXCJdXG4gICAgfSxcbiAgICByZWNlbnQ6IHtcbiAgICAgIGxhYmVsOiBcIuacgOi/keafpeeci1wiLFxuICAgICAgZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcbiAgICB9XG4gIH0sXG4gIHBlcm1pc3Npb25fc2V0OiB7XG4gICAgdXNlcjoge1xuICAgICAgYWxsb3dDcmVhdGU6IGZhbHNlLFxuICAgICAgYWxsb3dEZWxldGU6IGZhbHNlLFxuICAgICAgYWxsb3dFZGl0OiBmYWxzZSxcbiAgICAgIGFsbG93UmVhZDogdHJ1ZSxcbiAgICAgIG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlLFxuICAgICAgdmlld0FsbFJlY29yZHM6IGZhbHNlXG4gICAgfSxcbiAgICBhZG1pbjoge1xuICAgICAgYWxsb3dDcmVhdGU6IGZhbHNlLFxuICAgICAgYWxsb3dEZWxldGU6IGZhbHNlLFxuICAgICAgYWxsb3dFZGl0OiBmYWxzZSxcbiAgICAgIGFsbG93UmVhZDogdHJ1ZSxcbiAgICAgIG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlLFxuICAgICAgdmlld0FsbFJlY29yZHM6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJDcmVhdG9yLk9iamVjdHMuYXVkaXRfbG9naW4gPVxuXHRuYW1lOiBcImF1ZGl0X2xvZ2luXCJcblx0bGFiZWw6IFwi55m75b2V5pel5b+XXCJcblx0aWNvbjogXCJyZWNvcmRcIlxuXHRmaWVsZHM6XG5cdFx0dXNlcm5hbWU6XG5cdFx0XHRsYWJlbDogXCLnlKjmiLflkI1cIlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblx0XHRcdGlzX25hbWU6IHRydWVcblxuXHRcdGxvZ2luX3RpbWU6XG5cdFx0XHRsYWJlbDpcIueZu+W9leaXtumXtFwiXG5cdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcblxuXHRcdHNvdXJjZV9pcDpcblx0XHRcdGxhYmVsOiBcIklQ5Zyw5Z2AXCJcblx0XHRcdHR5cGU6IFwidGV4dFwiXG5cblx0XHRsb2NhdGlvbjpcblx0XHRcdGxhYmVsOlwi5L2N572uXCJcblx0XHRcdHR5cGU6IFwidGV4dFwiXG5cblx0XHRsb2dpbl90eXBlOlxuXHRcdFx0bGFiZWw6IFwi55m75b2V5pa55byPXCJcblx0XHRcdHR5cGU6IFwidGV4dFwiXG5cblx0XHRzdGF0dXM6XG5cdFx0XHRsYWJlbDogXCLnirbmgIFcIlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblxuXHRcdGJyb3dzZXI6XG5cdFx0XHRsYWJlbDogXCLmtY/op4jlmahcIlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblxuXHRcdHBsYXRmb3JtOlxuXHRcdFx0bGFiZWw6IFwi57O757ufXCJcblx0XHRcdHR5cGU6IFwidGV4dFwiXG5cblx0XHRhcHBsaWNhdGlvbjpcblx0XHRcdGxhYmVsOiBcIuW6lOeUqFwiXG5cdFx0XHR0eXBlOiBcInRleHRcIlxuXG5cdFx0Y2xpZW50X3ZlcnNpb246XG5cdFx0XHRsYWJlbDogXCLlrqLmiLfnq6/niYjmnKxcIlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblxuXHRcdGFwaV90eXBlOlxuXHRcdFx0bGFiZWw6IFwiYXBp57G75Z6LXCJcblx0XHRcdHR5cGU6IFwidGV4dFwiXG5cblx0XHRhcGlfdmVyc2lvbjpcblx0XHRcdGxhYmVsOiBcImFwaeeJiOacrFwiXG5cdFx0XHR0eXBlOiBcInRleHRcIlxuXG5cdFx0bG9naW5fdXJsOlxuXHRcdFx0bGFiZWw6IFwi55m75b2VVVJMXCJcblx0XHRcdHR5cGU6IFwidGV4dFwiXG5cblx0bGlzdF92aWV3czpcblx0XHRhbGw6XG5cdFx0XHRsYWJlbDogXCLlhajpg6hcIlxuXHRcdFx0ZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcblx0XHRcdGNvbHVtbnM6IFtcInVzZXJuYW1lXCIsIFwibG9naW5fdGltZVwiLCBcInNvdXJjZV9pcFwiLCBcImxvY2F0aW9uXCIsIFwibG9naW5fdHlwZVwiLCBcInN0YXR1c1wiLCBcImJyb3dzZXJcIiwgXCJwbGF0Zm9ybVwiLCBcImFwcGxpY2F0aW9uXCIsIFwiY2xpZW50X3ZlcnNpb25cIiwgXCJhcGlfdHlwZVwiLCBcImFwaV92ZXJzaW9uXCIsIFwibG9naW5fdXJsXCJdXG5cdFx0cmVjZW50OlxuXHRcdFx0bGFiZWw6IFwi5pyA6L+R5p+l55yLXCJcblx0XHRcdGZpbHRlcl9zY29wZTogXCJzcGFjZVwiXG5cblx0cGVybWlzc2lvbl9zZXQ6XG5cdFx0dXNlcjpcblx0XHRcdGFsbG93Q3JlYXRlOiBmYWxzZVxuXHRcdFx0YWxsb3dEZWxldGU6IGZhbHNlXG5cdFx0XHRhbGxvd0VkaXQ6IGZhbHNlXG5cdFx0XHRhbGxvd1JlYWQ6IHRydWVcblx0XHRcdG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlXG5cdFx0XHR2aWV3QWxsUmVjb3JkczogZmFsc2Vcblx0XHRhZG1pbjpcblx0XHRcdGFsbG93Q3JlYXRlOiBmYWxzZVxuXHRcdFx0YWxsb3dEZWxldGU6IGZhbHNlXG5cdFx0XHRhbGxvd0VkaXQ6IGZhbHNlXG5cdFx0XHRhbGxvd1JlYWQ6IHRydWVcblx0XHRcdG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlXG5cdFx0XHR2aWV3QWxsUmVjb3JkczogdHJ1ZSJdfQ==
