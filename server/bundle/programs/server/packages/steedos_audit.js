(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/steedos_audit/lib/audit_records.coffee                                                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var getLookupFieldModifier, getLookupFieldValue, insertRecord, transformFieldValue, updateRecord;
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
  fields = (ref = Creator.getObject(object_name, space_id)) != null ? ref.fields : void 0;
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

}).call(this);






(function(){

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

}).call(this);






(function(){

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

}).call(this);


/* Exports */
Package._define("steedos:audit");

})();

//# sourceURL=meteor://💻app/packages/steedos_audit.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdWRpdC9saWIvYXVkaXRfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hdWRpdF9yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdWRpdC9tb2RlbHMvYXVkaXRfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9hdWRpdF9yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdWRpdC9tb2RlbHMvYXVkaXRfbG9naW4uY29mZmVlIl0sIm5hbWVzIjpbImdldExvb2t1cEZpZWxkTW9kaWZpZXIiLCJnZXRMb29rdXBGaWVsZFZhbHVlIiwiaW5zZXJ0UmVjb3JkIiwidHJhbnNmb3JtRmllbGRWYWx1ZSIsInVwZGF0ZVJlY29yZCIsIkNyZWF0b3IiLCJBdWRpdFJlY29yZHMiLCJyZWZlcmVuY2VfdG8iLCJ2YWx1ZSIsInNwYWNlX2lkIiwibmFtZV9maWVsZF9rZXkiLCJvYmoiLCJwcmV2aW91c19pZHMiLCJyZWZlcmVuY2VfdG9fb2JqZWN0IiwidmFsdWVzIiwiXyIsImlzQXJyYXkiLCJpc09iamVjdCIsIm8iLCJpZHMiLCJnZXRPYmplY3QiLCJOQU1FX0ZJRUxEX0tFWSIsImdldENvbGxlY3Rpb24iLCJmaW5kIiwiX2lkIiwiJGluIiwiZmllbGRzIiwiZmV0Y2giLCJnZXRPcmRlcmx5U2V0QnlJZHMiLCJwbHVjayIsImpvaW4iLCJmaWVsZCIsImlzRnVuY3Rpb24iLCJvcHRpb25zRnVuY3Rpb24iLCJpc1N0cmluZyIsIm9wdGlvbnMiLCJzZWxlY3RlZF92YWx1ZSIsInV0Y09mZnNldCIsImlzTnVsbCIsImlzVW5kZWZpbmVkIiwidHlwZSIsIm1vbWVudCIsInV0YyIsImZvcm1hdCIsImlzQm9vbGVhbiIsIm1hcCIsIm9wdGlvbiIsImNvbnRhaW5zIiwibGFiZWwiLCJjb21wYWN0IiwidXNlcklkIiwib2JqZWN0X25hbWUiLCJuZXdfZG9jIiwiY29sbGVjdGlvbiIsImRvYyIsInJlY29yZF9pZCIsInNwYWNlIiwiX21ha2VOZXdJRCIsImZpZWxkX25hbWUiLCJyZWxhdGVkX3RvIiwiaW5zZXJ0IiwicHJldmlvdXNfZG9jIiwibW9kaWZpZXIiLCJtb2RpZmllclNldCIsIm1vZGlmaWVyVW5zZXQiLCJyZWYiLCIkc2V0IiwiJHVuc2V0IiwiZWFjaCIsInYiLCJrIiwiZGJfbmV3X3ZhbHVlIiwiZGJfcHJldmlvdXNfdmFsdWUiLCJuZXdfdmFsdWUiLCJwcmV2aW91c192YWx1ZSIsInRvU3RyaW5nIiwiSlNPTiIsInN0cmluZ2lmeSIsIm5hbWUiLCJhZGQiLCJhY3Rpb24iLCJPYmplY3RzIiwiYXVkaXRfcmVjb3JkcyIsImljb24iLCJpbmRleCIsIm9iamVjdCIsImVuYWJsZV9hdWRpdCIsInB1c2giLCJmaWx0ZXJhYmxlIiwiaXNfbmFtZSIsImNyZWF0ZWQiLCJyZXF1aXJlZCIsImlzX3dpZGUiLCJjcmVhdGVkX2J5IiwibGlzdF92aWV3cyIsImFsbCIsImZpbHRlcl9zY29wZSIsImNvbHVtbnMiLCJmaWx0ZXJfZmllbGRzIiwicmVjZW50IiwicGVybWlzc2lvbl9zZXQiLCJ1c2VyIiwiYWxsb3dDcmVhdGUiLCJhbGxvd0RlbGV0ZSIsImFsbG93RWRpdCIsImFsbG93UmVhZCIsIm1vZGlmeUFsbFJlY29yZHMiLCJ2aWV3QWxsUmVjb3JkcyIsImFkbWluIiwiYXVkaXRfbG9naW4iLCJ1c2VybmFtZSIsImxvZ2luX3RpbWUiLCJzb3VyY2VfaXAiLCJsb2NhdGlvbiIsImxvZ2luX3R5cGUiLCJzdGF0dXMiLCJicm93c2VyIiwicGxhdGZvcm0iLCJhcHBsaWNhdGlvbiIsImNsaWVudF92ZXJzaW9uIiwiYXBpX3R5cGUiLCJhcGlfdmVyc2lvbiIsImxvZ2luX3VybCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEsc0JBQUEsRUFBQUMsbUJBQUEs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S0FGWDtBQUdBQyxpQkFBVyxJQUhYO0FBSUFDLHdCQUFrQixLQUpsQjtBQUtBQyxzQkFBZ0I7QUFMaEI7QUFSRDtBQW5FRCxDQURELEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYXVkaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJDcmVhdG9yLkF1ZGl0UmVjb3JkcyA9IHt9XG5cbmdldExvb2t1cEZpZWxkVmFsdWUgPSAocmVmZXJlbmNlX3RvLCB2YWx1ZSwgc3BhY2VfaWQpLT5cblx0aWYgXy5pc0FycmF5KHJlZmVyZW5jZV90bykgJiYgXy5pc09iamVjdCh2YWx1ZSlcblx0XHRyZWZlcmVuY2VfdG8gPSB2YWx1ZS5vXG5cdFx0cHJldmlvdXNfaWRzID0gdmFsdWUuaWRzXG5cdGlmICFfLmlzQXJyYXkocHJldmlvdXNfaWRzKVxuXHRcdHByZXZpb3VzX2lkcyA9IGlmIHZhbHVlIHRoZW4gW3ZhbHVlXSBlbHNlIFtdXG5cdHJlZmVyZW5jZV90b19vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWZlcmVuY2VfdG8sIHNwYWNlX2lkKVxuXHRuYW1lX2ZpZWxkX2tleSA9IHJlZmVyZW5jZV90b19vYmplY3QuTkFNRV9GSUVMRF9LRVlcblx0dmFsdWVzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bywgc3BhY2VfaWQpLmZpbmQoe19pZDogeyRpbjogcHJldmlvdXNfaWRzfX0sIHtmaWVsZHM6IHtfaWQ6MSwgXCIje25hbWVfZmllbGRfa2V5fVwiOiAxfX0pLmZldGNoKClcblx0dmFsdWVzID0gQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHModmFsdWVzLCBwcmV2aW91c19pZHMpXG5cdHJldHVybiAoXy5wbHVjayB2YWx1ZXMsIG5hbWVfZmllbGRfa2V5KS5qb2luKCcsJylcblxuZ2V0TG9va3VwRmllbGRNb2RpZmllciA9IChmaWVsZCwgdmFsdWUsIHNwYWNlX2lkKS0+XG5cdHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xuXHRpZiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKVxuXHRcdHJlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90bygpXG5cdGlmIF8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zRnVuY3Rpb24pXG5cdFx0aWYgXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pXG5cdFx0XHRpZiB2YWx1ZVxuXHRcdFx0XHRyZXR1cm4gZ2V0TG9va3VwRmllbGRWYWx1ZShyZWZlcmVuY2VfdG8sIHZhbHVlLCBzcGFjZV9pZClcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gJydcblx0ZWxzZVxuXHRcdHJldHVybiBnZXRMb29rdXBGaWVsZFZhbHVlKHJlZmVyZW5jZV90bywgdmFsdWUsIHNwYWNlX2lkKVxuXG4jIyNcbuWtl+auteWAvOi9rOaNouinhOWImTpcbjEg5pel5pyfIOagvOW8j+WtmOWCqOS4uiAoU3RyaW5nKTogMjAxOC0wMS0wMlxuMiDml7bpl7Qg5qC85byP5a2Y5YKo5Li6IChTdHJpbmcpOiAyMDE4LTAxLTAyIDIzOjEyXG4yIGxvb2t1cCDlkozkuIvmi4nmoYbvvIzpg73mmK/lr7nlupTnmoTmmL7npLrlkI3np7AgKG5hbWUgfCBsYWJlbClcbjMgYm9vbGVhbiDlsLHlrZjmmK8v5ZCmXG40IOWkmuihjOaWh+acrFxcZ3JpZFxcbG9va3Vw5pyJb3B0aW9uc0Z1bmN0aW9u5bm25LiU5rKh5pyJcmVmZXJlbmNlX3Rv5pe2IOS4jeiusOW9leaWsOaXp+WAvCwg5Y+q6K6w5b2V5L+u5pS55pe26Ze0LCDkv67mlLnkurosIOS/ruaUueeahOWtl+auteaYvuekuuWQjVxuIyMjXG50cmFuc2Zvcm1GaWVsZFZhbHVlID0gKGZpZWxkLCB2YWx1ZSwgb3B0aW9ucyktPlxuXG5cdGlmIF8uaXNOdWxsKHZhbHVlKSB8fCBfLmlzVW5kZWZpbmVkKHZhbHVlKVxuXHRcdHJldHVyblxuXG5cdHV0Y09mZnNldCA9IG9wdGlvbnMudXRjT2Zmc2V0XG5cdHNwYWNlX2lkID0gb3B0aW9ucy5zcGFjZV9pZFxuXG5cdHN3aXRjaCBmaWVsZC50eXBlXG5cdFx0d2hlbiAnZGF0ZSdcblx0XHRcdHJldHVybiBtb21lbnQudXRjKHZhbHVlKS5mb3JtYXQoJ1lZWVktTU0tREQnKVxuXHRcdHdoZW4gJ2RhdGV0aW1lJ1xuXHRcdFx0cmV0dXJuIG1vbWVudCh2YWx1ZSkudXRjT2Zmc2V0KHV0Y09mZnNldCkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJylcblx0XHR3aGVuICdib29sZWFuJ1xuXHRcdFx0aWYgXy5pc0Jvb2xlYW4odmFsdWUpXG5cdFx0XHRcdGlmIHZhbHVlXG5cdFx0XHRcdFx0cmV0dXJuICfmmK8nXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm4gJ+WQpidcblx0XHR3aGVuICdzZWxlY3QnXG5cdFx0XHRpZiBfLmlzU3RyaW5nKHZhbHVlKVxuXHRcdFx0XHR2YWx1ZSA9IFt2YWx1ZV1cblx0XHRcdHNlbGVjdGVkX3ZhbHVlID0gXy5tYXAgZmllbGQub3B0aW9ucywgKG9wdGlvbiktPlxuXHRcdFx0XHRpZiBfLmNvbnRhaW5zKHZhbHVlLCBvcHRpb24udmFsdWUpXG5cdFx0XHRcdFx0cmV0dXJuIG9wdGlvbi5sYWJlbFxuXHRcdFx0cmV0dXJuIF8uY29tcGFjdChzZWxlY3RlZF92YWx1ZSkuam9pbignLCcpXG5cdFx0d2hlbiAnY2hlY2tib3gnXG5cdFx0XHRpZiBfLmlzU3RyaW5nKHZhbHVlKVxuXHRcdFx0XHR2YWx1ZSA9IFt2YWx1ZV1cblx0XHRcdHNlbGVjdGVkX3ZhbHVlID0gXy5tYXAgZmllbGQub3B0aW9ucywgKG9wdGlvbiktPlxuXHRcdFx0XHRpZiBfLmNvbnRhaW5zKHZhbHVlLCBvcHRpb24udmFsdWUpXG5cdFx0XHRcdFx0cmV0dXJuIG9wdGlvbi5sYWJlbFxuXHRcdFx0cmV0dXJuIF8uY29tcGFjdChzZWxlY3RlZF92YWx1ZSkuam9pbignLCcpXG5cdFx0d2hlbiAnbG9va3VwJ1xuXHRcdFx0cmV0dXJuIGdldExvb2t1cEZpZWxkTW9kaWZpZXIoZmllbGQsIHZhbHVlLCBzcGFjZV9pZClcblx0XHR3aGVuICdtYXN0ZXJfZGV0YWlsJ1xuXHRcdFx0cmV0dXJuIGdldExvb2t1cEZpZWxkTW9kaWZpZXIoZmllbGQsIHZhbHVlLCBzcGFjZV9pZClcblx0XHR3aGVuICd0ZXh0YXJlYSdcblx0XHRcdHJldHVybiAnJ1xuXHRcdHdoZW4gJ2NvZGUnXG5cdFx0XHRyZXR1cm4gJydcblx0XHR3aGVuICdodG1sJ1xuXHRcdFx0cmV0dXJuICcnXG5cdFx0d2hlbiAnbWFya2Rvd24nXG5cdFx0XHRyZXR1cm4gJydcblx0XHR3aGVuICdncmlkJ1xuXHRcdFx0cmV0dXJuICcnXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHZhbHVlXG5cbiMg5paw5bu65pe2LCDkuI3orrDlvZXmmI7nu4Zcbmluc2VydFJlY29yZCA9ICh1c2VySWQsIG9iamVjdF9uYW1lLCBuZXdfZG9jKS0+XG4jXHRpZiAhdXNlcklkXG4jXHRcdHJldHVyblxuXG5cdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhdWRpdF9yZWNvcmRzXCIpXG5cdHNwYWNlX2lkID0gbmV3X2RvYy5zcGFjZVxuXHRyZWNvcmRfaWQgPSBuZXdfZG9jLl9pZFxuXHRkb2MgPSB7XG5cdFx0X2lkOiBjb2xsZWN0aW9uLl9tYWtlTmV3SUQoKVxuXHRcdHNwYWNlOiBzcGFjZV9pZFxuXHRcdGZpZWxkX25hbWU6IFwi5bey5Yib5bu644CCXCJcblx0XHRyZWxhdGVkX3RvOiB7XG5cdFx0XHRvOiBvYmplY3RfbmFtZVxuXHRcdFx0aWRzOiBbcmVjb3JkX2lkXVxuXHRcdH1cblx0fVxuXHRjb2xsZWN0aW9uLmluc2VydCBkb2NcblxuIyDkv67mlLnml7YsIOiusOW9leWtl+auteWPmOabtOaYjue7hlxudXBkYXRlUmVjb3JkID0gKHVzZXJJZCwgb2JqZWN0X25hbWUsIG5ld19kb2MsIHByZXZpb3VzX2RvYywgbW9kaWZpZXIpLT5cbiNcdGlmICF1c2VySWRcbiNcdFx0cmV0dXJuXG5cblx0c3BhY2VfaWQgPSBuZXdfZG9jLnNwYWNlXG5cdHJlY29yZF9pZCA9IG5ld19kb2MuX2lkXG5cblx0ZmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlX2lkKT8uZmllbGRzXG5cblx0bW9kaWZpZXJTZXQgPSBtb2RpZmllci4kc2V0XG5cblx0bW9kaWZpZXJVbnNldCA9IG1vZGlmaWVyLiR1bnNldFxuXG5cdCMjIyBUT0RPIHV0Y09mZnNldCDlupTor6XmnaXoh6rmlbDmja7lupMs5b6FICM5ODQg5aSE55CG5ZCOIOiwg+aVtFxuXG4gICAgdXRjT2Zmc2V0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwidXNlcnNcIikuZmluZE9uZSh7X2lkOiB1c2VySWR9KT8udXRjT2Zmc2V0XG5cblx0aWYgIV8uaXNOdW1iZXIodXRjT2Zmc2V0KVxuXHRcdHV0Y09mZnNldCA9IDhcblx0IyMjXG5cblx0dXRjT2Zmc2V0ID0gOFxuXG5cdG9wdGlvbnMgPSB7dXRjT2Zmc2V0OiB1dGNPZmZzZXQsIHNwYWNlX2lkOiBzcGFjZV9pZH1cblxuXHRfLmVhY2ggbW9kaWZpZXJTZXQsICh2LCBrKS0+XG5cdFx0ZmllbGQgPSBmaWVsZHM/W2tdXG5cdFx0cHJldmlvdXNfdmFsdWUgPSBwcmV2aW91c19kb2Nba11cblx0XHRuZXdfdmFsdWUgPSB2XG5cblx0XHRkYl9wcmV2aW91c192YWx1ZSA9IG51bGxcblx0XHRkYl9uZXdfdmFsdWUgPSBudWxsXG5cblx0XHRzd2l0Y2ggZmllbGQudHlwZVxuXHRcdFx0d2hlbiAnZGF0ZSdcblx0XHRcdFx0aWYgbmV3X3ZhbHVlPy50b1N0cmluZygpICE9IHByZXZpb3VzX3ZhbHVlPy50b1N0cmluZygpXG5cdFx0XHRcdFx0aWYgbmV3X3ZhbHVlXG5cdFx0XHRcdFx0XHRkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpXG5cdFx0XHRcdFx0aWYgcHJldmlvdXNfdmFsdWVcblx0XHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXG5cdFx0XHR3aGVuICdkYXRldGltZSdcblx0XHRcdFx0aWYgbmV3X3ZhbHVlPy50b1N0cmluZygpICE9IHByZXZpb3VzX3ZhbHVlPy50b1N0cmluZygpXG5cdFx0XHRcdFx0aWYgbmV3X3ZhbHVlXG5cdFx0XHRcdFx0XHRkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpXG5cdFx0XHRcdFx0aWYgcHJldmlvdXNfdmFsdWVcblx0XHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXG5cdFx0XHR3aGVuICd0ZXh0YXJlYSdcblx0XHRcdFx0aWYgcHJldmlvdXNfdmFsdWUgIT0gbmV3X3ZhbHVlXG5cdFx0XHRcdFx0ZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucylcblx0XHRcdFx0XHRkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpXG5cdFx0XHR3aGVuICdjb2RlJ1xuXHRcdFx0XHRpZiBwcmV2aW91c192YWx1ZSAhPSBuZXdfdmFsdWVcblx0XHRcdFx0XHRkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKVxuXHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucylcblx0XHRcdHdoZW4gJ2h0bWwnXG5cdFx0XHRcdGlmIHByZXZpb3VzX3ZhbHVlICE9IG5ld192YWx1ZVxuXHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXG5cdFx0XHRcdFx0ZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKVxuXHRcdFx0d2hlbiAnbWFya2Rvd24nXG5cdFx0XHRcdGlmIHByZXZpb3VzX3ZhbHVlICE9IG5ld192YWx1ZVxuXHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXG5cdFx0XHRcdFx0ZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKVxuXHRcdFx0d2hlbiAnZ3JpZCdcblx0XHRcdFx0aWYgSlNPTi5zdHJpbmdpZnkocHJldmlvdXNfdmFsdWUpICE9IEpTT04uc3RyaW5naWZ5KG5ld192YWx1ZSlcblx0XHRcdFx0XHRkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKVxuXHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucylcblx0XHRcdHdoZW4gJ2Jvb2xlYW4nXG5cdFx0XHRcdGlmIHByZXZpb3VzX3ZhbHVlICE9IG5ld192YWx1ZVxuXHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXG5cdFx0XHRcdFx0ZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKVxuXHRcdFx0d2hlbiAnc2VsZWN0J1xuXHRcdFx0XHRpZiBwcmV2aW91c192YWx1ZT8udG9TdHJpbmcoKSAhPSBuZXdfdmFsdWU/LnRvU3RyaW5nKClcblx0XHRcdFx0XHRkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKVxuXHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucylcblx0XHRcdHdoZW4gJ2NoZWNrYm94J1xuXHRcdFx0XHRpZiBwcmV2aW91c192YWx1ZT8udG9TdHJpbmcoKSAhPSBuZXdfdmFsdWU/LnRvU3RyaW5nKClcblx0XHRcdFx0XHRkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKVxuXHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucylcblx0XHRcdHdoZW4gJ2xvb2t1cCdcblx0XHRcdFx0aWYgSlNPTi5zdHJpbmdpZnkocHJldmlvdXNfdmFsdWUpICE9IEpTT04uc3RyaW5naWZ5KG5ld192YWx1ZSlcblx0XHRcdFx0XHRpZiBwcmV2aW91c192YWx1ZVxuXHRcdFx0XHRcdFx0ZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucylcblx0XHRcdFx0XHRpZiBuZXdfdmFsdWVcblx0XHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucylcblx0XHRcdHdoZW4gJ21hc3Rlcl9kZXRhaWwnXG5cdFx0XHRcdGlmIEpTT04uc3RyaW5naWZ5KHByZXZpb3VzX3ZhbHVlKSAhPSBKU09OLnN0cmluZ2lmeShuZXdfdmFsdWUpXG5cdFx0XHRcdFx0aWYgcHJldmlvdXNfdmFsdWVcblx0XHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXG5cdFx0XHRcdFx0aWYgbmV3X3ZhbHVlXG5cdFx0XHRcdFx0XHRkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIG5ld192YWx1ZSAhPSBwcmV2aW91c192YWx1ZVxuXHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gcHJldmlvdXNfdmFsdWVcblx0XHRcdFx0XHRkYl9uZXdfdmFsdWUgPSBuZXdfdmFsdWVcblxuXG5cdFx0aWYgZGJfbmV3X3ZhbHVlICE9IG51bGwgfHwgZGJfcHJldmlvdXNfdmFsdWUgIT0gbnVsbFxuXHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImF1ZGl0X3JlY29yZHNcIilcblx0XHRcdGRvYyA9IHtcblx0XHRcdFx0X2lkOiBjb2xsZWN0aW9uLl9tYWtlTmV3SUQoKVxuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWRcblx0XHRcdFx0ZmllbGRfbmFtZTogZmllbGQubGFiZWwgfHwgZmllbGQubmFtZVxuXHRcdFx0XHRwcmV2aW91c192YWx1ZTogZGJfcHJldmlvdXNfdmFsdWVcblx0XHRcdFx0bmV3X3ZhbHVlOiBkYl9uZXdfdmFsdWVcblx0XHRcdFx0cmVsYXRlZF90bzoge1xuXHRcdFx0XHRcdG86IG9iamVjdF9uYW1lXG5cdFx0XHRcdFx0aWRzOiBbcmVjb3JkX2lkXVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjb2xsZWN0aW9uLmluc2VydCBkb2NcblxuXHRfLmVhY2ggbW9kaWZpZXJVbnNldCwgKHYsIGspLT5cblx0XHRmaWVsZCA9IGZpZWxkcz9ba11cblx0XHRwcmV2aW91c192YWx1ZSA9IHByZXZpb3VzX2RvY1trXVxuXHRcdGlmIHByZXZpb3VzX3ZhbHVlIHx8IF8uaXNCb29sZWFuKHByZXZpb3VzX3ZhbHVlKVxuXHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImF1ZGl0X3JlY29yZHNcIilcblx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXG5cdFx0XHRkb2MgPSB7XG5cdFx0XHRcdF9pZDogY29sbGVjdGlvbi5fbWFrZU5ld0lEKClcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkXG5cdFx0XHRcdGZpZWxkX25hbWU6IGZpZWxkLmxhYmVsIHx8IGZpZWxkLm5hbWVcblx0XHRcdFx0cHJldmlvdXNfdmFsdWU6IGRiX3ByZXZpb3VzX3ZhbHVlXG5cdFx0XHRcdHJlbGF0ZWRfdG86IHtcblx0XHRcdFx0XHRvOiBvYmplY3RfbmFtZVxuXHRcdFx0XHRcdGlkczogW3JlY29yZF9pZF1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Y29sbGVjdGlvbi5pbnNlcnQgZG9jXG5cbkNyZWF0b3IuQXVkaXRSZWNvcmRzLmFkZCA9IChhY3Rpb24sIHVzZXJJZCwgb2JqZWN0X25hbWUsIG5ld19kb2MsIHByZXZpb3VzX2RvYywgbW9kaWZpZXIpLT5cblx0aWYgYWN0aW9uID09ICd1cGRhdGUnXG5cdFx0dXBkYXRlUmVjb3JkKHVzZXJJZCwgb2JqZWN0X25hbWUsIG5ld19kb2MsIHByZXZpb3VzX2RvYywgbW9kaWZpZXIpXG5cdGVsc2UgaWYgYWN0aW9uID09ICdpbnNlcnQnXG5cdFx0aW5zZXJ0UmVjb3JkKHVzZXJJZCwgb2JqZWN0X25hbWUsIG5ld19kb2MpXG4iLCJ2YXIgZ2V0TG9va3VwRmllbGRNb2RpZmllciwgZ2V0TG9va3VwRmllbGRWYWx1ZSwgaW5zZXJ0UmVjb3JkLCB0cmFuc2Zvcm1GaWVsZFZhbHVlLCB1cGRhdGVSZWNvcmQ7XG5cbkNyZWF0b3IuQXVkaXRSZWNvcmRzID0ge307XG5cbmdldExvb2t1cEZpZWxkVmFsdWUgPSBmdW5jdGlvbihyZWZlcmVuY2VfdG8sIHZhbHVlLCBzcGFjZV9pZCkge1xuICB2YXIgbmFtZV9maWVsZF9rZXksIG9iaiwgcHJldmlvdXNfaWRzLCByZWZlcmVuY2VfdG9fb2JqZWN0LCB2YWx1ZXM7XG4gIGlmIChfLmlzQXJyYXkocmVmZXJlbmNlX3RvKSAmJiBfLmlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJlZmVyZW5jZV90byA9IHZhbHVlLm87XG4gICAgcHJldmlvdXNfaWRzID0gdmFsdWUuaWRzO1xuICB9XG4gIGlmICghXy5pc0FycmF5KHByZXZpb3VzX2lkcykpIHtcbiAgICBwcmV2aW91c19pZHMgPSB2YWx1ZSA/IFt2YWx1ZV0gOiBbXTtcbiAgfVxuICByZWZlcmVuY2VfdG9fb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVmZXJlbmNlX3RvLCBzcGFjZV9pZCk7XG4gIG5hbWVfZmllbGRfa2V5ID0gcmVmZXJlbmNlX3RvX29iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgdmFsdWVzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlZmVyZW5jZV90bywgc3BhY2VfaWQpLmZpbmQoe1xuICAgIF9pZDoge1xuICAgICAgJGluOiBwcmV2aW91c19pZHNcbiAgICB9XG4gIH0sIHtcbiAgICBmaWVsZHM6IChcbiAgICAgIG9iaiA9IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9LFxuICAgICAgb2JqW1wiXCIgKyBuYW1lX2ZpZWxkX2tleV0gPSAxLFxuICAgICAgb2JqXG4gICAgKVxuICB9KS5mZXRjaCgpO1xuICB2YWx1ZXMgPSBDcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyh2YWx1ZXMsIHByZXZpb3VzX2lkcyk7XG4gIHJldHVybiAoXy5wbHVjayh2YWx1ZXMsIG5hbWVfZmllbGRfa2V5KSkuam9pbignLCcpO1xufTtcblxuZ2V0TG9va3VwRmllbGRNb2RpZmllciA9IGZ1bmN0aW9uKGZpZWxkLCB2YWx1ZSwgc3BhY2VfaWQpIHtcbiAgdmFyIHJlZmVyZW5jZV90bztcbiAgcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICBpZiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bykpIHtcbiAgICByZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8oKTtcbiAgfVxuICBpZiAoXy5pc0Z1bmN0aW9uKGZpZWxkLm9wdGlvbnNGdW5jdGlvbikpIHtcbiAgICBpZiAoXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pKSB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGdldExvb2t1cEZpZWxkVmFsdWUocmVmZXJlbmNlX3RvLCB2YWx1ZSwgc3BhY2VfaWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBnZXRMb29rdXBGaWVsZFZhbHVlKHJlZmVyZW5jZV90bywgdmFsdWUsIHNwYWNlX2lkKTtcbiAgfVxufTtcblxuXG4vKlxu5a2X5q615YC86L2s5o2i6KeE5YiZOlxuMSDml6XmnJ8g5qC85byP5a2Y5YKo5Li6IChTdHJpbmcpOiAyMDE4LTAxLTAyXG4yIOaXtumXtCDmoLzlvI/lrZjlgqjkuLogKFN0cmluZyk6IDIwMTgtMDEtMDIgMjM6MTJcbjIgbG9va3VwIOWSjOS4i+aLieahhu+8jOmDveaYr+WvueW6lOeahOaYvuekuuWQjeensCAobmFtZSB8IGxhYmVsKVxuMyBib29sZWFuIOWwseWtmOaYry/lkKZcbjQg5aSa6KGM5paH5pysXFxncmlkXFxsb29rdXDmnIlvcHRpb25zRnVuY3Rpb27lubbkuJTmsqHmnIlyZWZlcmVuY2VfdG/ml7Yg5LiN6K6w5b2V5paw5pen5YC8LCDlj6rorrDlvZXkv67mlLnml7bpl7QsIOS/ruaUueS6uiwg5L+u5pS555qE5a2X5q615pi+56S65ZCNXG4gKi9cblxudHJhbnNmb3JtRmllbGRWYWx1ZSA9IGZ1bmN0aW9uKGZpZWxkLCB2YWx1ZSwgb3B0aW9ucykge1xuICB2YXIgc2VsZWN0ZWRfdmFsdWUsIHNwYWNlX2lkLCB1dGNPZmZzZXQ7XG4gIGlmIChfLmlzTnVsbCh2YWx1ZSkgfHwgXy5pc1VuZGVmaW5lZCh2YWx1ZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdXRjT2Zmc2V0ID0gb3B0aW9ucy51dGNPZmZzZXQ7XG4gIHNwYWNlX2lkID0gb3B0aW9ucy5zcGFjZV9pZDtcbiAgc3dpdGNoIChmaWVsZC50eXBlKSB7XG4gICAgY2FzZSAnZGF0ZSc6XG4gICAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gICAgY2FzZSAnZGF0ZXRpbWUnOlxuICAgICAgcmV0dXJuIG1vbWVudCh2YWx1ZSkudXRjT2Zmc2V0KHV0Y09mZnNldCkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tJyk7XG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICBpZiAoXy5pc0Jvb2xlYW4odmFsdWUpKSB7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiAn5pivJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJ+WQpic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICBpZiAoXy5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSBbdmFsdWVdO1xuICAgICAgfVxuICAgICAgc2VsZWN0ZWRfdmFsdWUgPSBfLm1hcChmaWVsZC5vcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgaWYgKF8uY29udGFpbnModmFsdWUsIG9wdGlvbi52YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gb3B0aW9uLmxhYmVsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLmNvbXBhY3Qoc2VsZWN0ZWRfdmFsdWUpLmpvaW4oJywnKTtcbiAgICBjYXNlICdjaGVja2JveCc6XG4gICAgICBpZiAoXy5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSBbdmFsdWVdO1xuICAgICAgfVxuICAgICAgc2VsZWN0ZWRfdmFsdWUgPSBfLm1hcChmaWVsZC5vcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgaWYgKF8uY29udGFpbnModmFsdWUsIG9wdGlvbi52YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gb3B0aW9uLmxhYmVsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLmNvbXBhY3Qoc2VsZWN0ZWRfdmFsdWUpLmpvaW4oJywnKTtcbiAgICBjYXNlICdsb29rdXAnOlxuICAgICAgcmV0dXJuIGdldExvb2t1cEZpZWxkTW9kaWZpZXIoZmllbGQsIHZhbHVlLCBzcGFjZV9pZCk7XG4gICAgY2FzZSAnbWFzdGVyX2RldGFpbCc6XG4gICAgICByZXR1cm4gZ2V0TG9va3VwRmllbGRNb2RpZmllcihmaWVsZCwgdmFsdWUsIHNwYWNlX2lkKTtcbiAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICByZXR1cm4gJyc7XG4gICAgY2FzZSAnY29kZSc6XG4gICAgICByZXR1cm4gJyc7XG4gICAgY2FzZSAnaHRtbCc6XG4gICAgICByZXR1cm4gJyc7XG4gICAgY2FzZSAnbWFya2Rvd24nOlxuICAgICAgcmV0dXJuICcnO1xuICAgIGNhc2UgJ2dyaWQnOlxuICAgICAgcmV0dXJuICcnO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn07XG5cbmluc2VydFJlY29yZCA9IGZ1bmN0aW9uKHVzZXJJZCwgb2JqZWN0X25hbWUsIG5ld19kb2MpIHtcbiAgdmFyIGNvbGxlY3Rpb24sIGRvYywgcmVjb3JkX2lkLCBzcGFjZV9pZDtcbiAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImF1ZGl0X3JlY29yZHNcIik7XG4gIHNwYWNlX2lkID0gbmV3X2RvYy5zcGFjZTtcbiAgcmVjb3JkX2lkID0gbmV3X2RvYy5faWQ7XG4gIGRvYyA9IHtcbiAgICBfaWQ6IGNvbGxlY3Rpb24uX21ha2VOZXdJRCgpLFxuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBmaWVsZF9uYW1lOiBcIuW3suWIm+W7uuOAglwiLFxuICAgIHJlbGF0ZWRfdG86IHtcbiAgICAgIG86IG9iamVjdF9uYW1lLFxuICAgICAgaWRzOiBbcmVjb3JkX2lkXVxuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGNvbGxlY3Rpb24uaW5zZXJ0KGRvYyk7XG59O1xuXG51cGRhdGVSZWNvcmQgPSBmdW5jdGlvbih1c2VySWQsIG9iamVjdF9uYW1lLCBuZXdfZG9jLCBwcmV2aW91c19kb2MsIG1vZGlmaWVyKSB7XG4gIHZhciBmaWVsZHMsIG1vZGlmaWVyU2V0LCBtb2RpZmllclVuc2V0LCBvcHRpb25zLCByZWNvcmRfaWQsIHJlZiwgc3BhY2VfaWQsIHV0Y09mZnNldDtcbiAgc3BhY2VfaWQgPSBuZXdfZG9jLnNwYWNlO1xuICByZWNvcmRfaWQgPSBuZXdfZG9jLl9pZDtcbiAgZmllbGRzID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZV9pZCkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwO1xuICBtb2RpZmllclNldCA9IG1vZGlmaWVyLiRzZXQ7XG4gIG1vZGlmaWVyVW5zZXQgPSBtb2RpZmllci4kdW5zZXQ7XG5cbiAgLyogVE9ETyB1dGNPZmZzZXQg5bqU6K+l5p2l6Ieq5pWw5o2u5bqTLOW+hSAjOTg0IOWkhOeQhuWQjiDosIPmlbRcbiAgXG4gICAgIHV0Y09mZnNldCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInVzZXJzXCIpLmZpbmRPbmUoe19pZDogdXNlcklkfSk/LnV0Y09mZnNldFxuICBcbiAgXHRpZiAhXy5pc051bWJlcih1dGNPZmZzZXQpXG4gIFx0XHR1dGNPZmZzZXQgPSA4XG4gICAqL1xuICB1dGNPZmZzZXQgPSA4O1xuICBvcHRpb25zID0ge1xuICAgIHV0Y09mZnNldDogdXRjT2Zmc2V0LFxuICAgIHNwYWNlX2lkOiBzcGFjZV9pZFxuICB9O1xuICBfLmVhY2gobW9kaWZpZXJTZXQsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZGJfbmV3X3ZhbHVlLCBkYl9wcmV2aW91c192YWx1ZSwgZG9jLCBmaWVsZCwgbmV3X3ZhbHVlLCBwcmV2aW91c192YWx1ZTtcbiAgICBmaWVsZCA9IGZpZWxkcyAhPSBudWxsID8gZmllbGRzW2tdIDogdm9pZCAwO1xuICAgIHByZXZpb3VzX3ZhbHVlID0gcHJldmlvdXNfZG9jW2tdO1xuICAgIG5ld192YWx1ZSA9IHY7XG4gICAgZGJfcHJldmlvdXNfdmFsdWUgPSBudWxsO1xuICAgIGRiX25ld192YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChmaWVsZC50eXBlKSB7XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgaWYgKChuZXdfdmFsdWUgIT0gbnVsbCA/IG5ld192YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKSAhPT0gKHByZXZpb3VzX3ZhbHVlICE9IG51bGwgPyBwcmV2aW91c192YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKSkge1xuICAgICAgICAgIGlmIChuZXdfdmFsdWUpIHtcbiAgICAgICAgICAgIGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwcmV2aW91c192YWx1ZSkge1xuICAgICAgICAgICAgZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGF0ZXRpbWUnOlxuICAgICAgICBpZiAoKG5ld192YWx1ZSAhPSBudWxsID8gbmV3X3ZhbHVlLnRvU3RyaW5nKCkgOiB2b2lkIDApICE9PSAocHJldmlvdXNfdmFsdWUgIT0gbnVsbCA/IHByZXZpb3VzX3ZhbHVlLnRvU3RyaW5nKCkgOiB2b2lkIDApKSB7XG4gICAgICAgICAgaWYgKG5ld192YWx1ZSkge1xuICAgICAgICAgICAgZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHByZXZpb3VzX3ZhbHVlKSB7XG4gICAgICAgICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICAgIGlmIChwcmV2aW91c192YWx1ZSAhPT0gbmV3X3ZhbHVlKSB7XG4gICAgICAgICAgZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvZGUnOlxuICAgICAgICBpZiAocHJldmlvdXNfdmFsdWUgIT09IG5ld192YWx1ZSkge1xuICAgICAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdodG1sJzpcbiAgICAgICAgaWYgKHByZXZpb3VzX3ZhbHVlICE9PSBuZXdfdmFsdWUpIHtcbiAgICAgICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbWFya2Rvd24nOlxuICAgICAgICBpZiAocHJldmlvdXNfdmFsdWUgIT09IG5ld192YWx1ZSkge1xuICAgICAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdncmlkJzpcbiAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KHByZXZpb3VzX3ZhbHVlKSAhPT0gSlNPTi5zdHJpbmdpZnkobmV3X3ZhbHVlKSkge1xuICAgICAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgaWYgKHByZXZpb3VzX3ZhbHVlICE9PSBuZXdfdmFsdWUpIHtcbiAgICAgICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgaWYgKChwcmV2aW91c192YWx1ZSAhPSBudWxsID8gcHJldmlvdXNfdmFsdWUudG9TdHJpbmcoKSA6IHZvaWQgMCkgIT09IChuZXdfdmFsdWUgIT0gbnVsbCA/IG5ld192YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKSkge1xuICAgICAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjaGVja2JveCc6XG4gICAgICAgIGlmICgocHJldmlvdXNfdmFsdWUgIT0gbnVsbCA/IHByZXZpb3VzX3ZhbHVlLnRvU3RyaW5nKCkgOiB2b2lkIDApICE9PSAobmV3X3ZhbHVlICE9IG51bGwgPyBuZXdfdmFsdWUudG9TdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbG9va3VwJzpcbiAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KHByZXZpb3VzX3ZhbHVlKSAhPT0gSlNPTi5zdHJpbmdpZnkobmV3X3ZhbHVlKSkge1xuICAgICAgICAgIGlmIChwcmV2aW91c192YWx1ZSkge1xuICAgICAgICAgICAgZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChuZXdfdmFsdWUpIHtcbiAgICAgICAgICAgIGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbWFzdGVyX2RldGFpbCc6XG4gICAgICAgIGlmIChKU09OLnN0cmluZ2lmeShwcmV2aW91c192YWx1ZSkgIT09IEpTT04uc3RyaW5naWZ5KG5ld192YWx1ZSkpIHtcbiAgICAgICAgICBpZiAocHJldmlvdXNfdmFsdWUpIHtcbiAgICAgICAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobmV3X3ZhbHVlKSB7XG4gICAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChuZXdfdmFsdWUgIT09IHByZXZpb3VzX3ZhbHVlKSB7XG4gICAgICAgICAgZGJfcHJldmlvdXNfdmFsdWUgPSBwcmV2aW91c192YWx1ZTtcbiAgICAgICAgICBkYl9uZXdfdmFsdWUgPSBuZXdfdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGRiX25ld192YWx1ZSAhPT0gbnVsbCB8fCBkYl9wcmV2aW91c192YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImF1ZGl0X3JlY29yZHNcIik7XG4gICAgICBkb2MgPSB7XG4gICAgICAgIF9pZDogY29sbGVjdGlvbi5fbWFrZU5ld0lEKCksXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgZmllbGRfbmFtZTogZmllbGQubGFiZWwgfHwgZmllbGQubmFtZSxcbiAgICAgICAgcHJldmlvdXNfdmFsdWU6IGRiX3ByZXZpb3VzX3ZhbHVlLFxuICAgICAgICBuZXdfdmFsdWU6IGRiX25ld192YWx1ZSxcbiAgICAgICAgcmVsYXRlZF90bzoge1xuICAgICAgICAgIG86IG9iamVjdF9uYW1lLFxuICAgICAgICAgIGlkczogW3JlY29yZF9pZF1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uLmluc2VydChkb2MpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBfLmVhY2gobW9kaWZpZXJVbnNldCwgZnVuY3Rpb24odiwgaykge1xuICAgIHZhciBjb2xsZWN0aW9uLCBkYl9wcmV2aW91c192YWx1ZSwgZG9jLCBmaWVsZCwgcHJldmlvdXNfdmFsdWU7XG4gICAgZmllbGQgPSBmaWVsZHMgIT0gbnVsbCA/IGZpZWxkc1trXSA6IHZvaWQgMDtcbiAgICBwcmV2aW91c192YWx1ZSA9IHByZXZpb3VzX2RvY1trXTtcbiAgICBpZiAocHJldmlvdXNfdmFsdWUgfHwgXy5pc0Jvb2xlYW4ocHJldmlvdXNfdmFsdWUpKSB7XG4gICAgICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXVkaXRfcmVjb3Jkc1wiKTtcbiAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgZG9jID0ge1xuICAgICAgICBfaWQ6IGNvbGxlY3Rpb24uX21ha2VOZXdJRCgpLFxuICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgIGZpZWxkX25hbWU6IGZpZWxkLmxhYmVsIHx8IGZpZWxkLm5hbWUsXG4gICAgICAgIHByZXZpb3VzX3ZhbHVlOiBkYl9wcmV2aW91c192YWx1ZSxcbiAgICAgICAgcmVsYXRlZF90bzoge1xuICAgICAgICAgIG86IG9iamVjdF9uYW1lLFxuICAgICAgICAgIGlkczogW3JlY29yZF9pZF1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uLmluc2VydChkb2MpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5DcmVhdG9yLkF1ZGl0UmVjb3Jkcy5hZGQgPSBmdW5jdGlvbihhY3Rpb24sIHVzZXJJZCwgb2JqZWN0X25hbWUsIG5ld19kb2MsIHByZXZpb3VzX2RvYywgbW9kaWZpZXIpIHtcbiAgaWYgKGFjdGlvbiA9PT0gJ3VwZGF0ZScpIHtcbiAgICByZXR1cm4gdXBkYXRlUmVjb3JkKHVzZXJJZCwgb2JqZWN0X25hbWUsIG5ld19kb2MsIHByZXZpb3VzX2RvYywgbW9kaWZpZXIpO1xuICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJ2luc2VydCcpIHtcbiAgICByZXR1cm4gaW5zZXJ0UmVjb3JkKHVzZXJJZCwgb2JqZWN0X25hbWUsIG5ld19kb2MpO1xuICB9XG59O1xuIiwiQ3JlYXRvci5PYmplY3RzLmF1ZGl0X3JlY29yZHMgPVxuXHRuYW1lOiBcImF1ZGl0X3JlY29yZHNcIlxuXHRsYWJlbDogXCLlrZfmrrXljoblj7JcIlxuXHRpY29uOiBcInJlY29yZFwiXG5cdGZpZWxkczpcblx0XHRyZWxhdGVkX3RvOlxuXHRcdFx0bGFiZWw6IFwi55u45YWz6aG5XCJcblx0XHRcdHR5cGU6IFwibG9va3VwXCJcblx0XHRcdGluZGV4OiB0cnVlXG5cdFx0XHRyZWZlcmVuY2VfdG86ICgpLT5cblx0XHRcdFx0byA9IFtdXG5cdFx0XHRcdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChvYmplY3QsIG9iamVjdF9uYW1lKS0+XG5cdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV9hdWRpdFxuXHRcdFx0XHRcdFx0by5wdXNoIG9iamVjdC5uYW1lXG5cdFx0XHRcdHJldHVybiBvXG5cdFx0XHRmaWx0ZXJhYmxlOnRydWVcblx0XHRcdGlzX25hbWU6IHRydWVcblx0XHRjcmVhdGVkOlxuXHRcdFx0bGFiZWw6XCLml7bpl7RcIlxuXHRcdFx0ZmlsdGVyYWJsZTp0cnVlXG5cdFx0ZmllbGRfbmFtZTpcblx0XHRcdGxhYmVsOiBcIuWtl+autVwiXG5cdFx0XHR0eXBlOiBcInRleHRcIlxuXHRcdFx0cmVxdWlyZWQ6IHRydWVcblx0XHRcdGlzX3dpZGU6IHRydWVcblx0XHRjcmVhdGVkX2J5OlxuXHRcdFx0bGFiZWw6XCLnlKjmiLdcIlxuXHRcdHByZXZpb3VzX3ZhbHVlOlxuXHRcdFx0bGFiZWw6IFwi5Y6f5aeL5YC8XCJcblx0XHRcdHR5cGU6IFwidGV4dFwiXG5cdFx0bmV3X3ZhbHVlOlxuXHRcdFx0bGFiZWw6IFwi5paw5YC8XCJcblx0XHRcdHR5cGU6IFwidGV4dFwiXG5cblxuXHRsaXN0X3ZpZXdzOlxuXHRcdGFsbDpcblx0XHRcdGxhYmVsOiBcIuWFqOmDqFwiXG5cdFx0XHRmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxuXHRcdFx0Y29sdW1uczogW1wicmVsYXRlZF90b1wiLCBcImNyZWF0ZWRcIiwgXCJmaWVsZF9uYW1lXCIsIFwiY3JlYXRlZF9ieVwiLCBcInByZXZpb3VzX3ZhbHVlXCIsIFwibmV3X3ZhbHVlXCJdXG5cdFx0XHRmaWx0ZXJfZmllbGRzOiBbXCJyZWxhdGVkX3RvXCJdXG5cdFx0cmVjZW50OlxuXHRcdFx0bGFiZWw6IFwi5pyA6L+R5p+l55yLXCJcblx0XHRcdGZpbHRlcl9zY29wZTogXCJzcGFjZVwiXG5cblx0cGVybWlzc2lvbl9zZXQ6XG5cdFx0dXNlcjpcblx0XHRcdGFsbG93Q3JlYXRlOiBmYWxzZVxuXHRcdFx0YWxsb3dEZWxldGU6IGZhbHNlXG5cdFx0XHRhbGxvd0VkaXQ6IGZhbHNlXG5cdFx0XHRhbGxvd1JlYWQ6IHRydWVcblx0XHRcdG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlXG5cdFx0XHR2aWV3QWxsUmVjb3JkczogZmFsc2Vcblx0XHRhZG1pbjpcblx0XHRcdGFsbG93Q3JlYXRlOiBmYWxzZVxuXHRcdFx0YWxsb3dEZWxldGU6IGZhbHNlXG5cdFx0XHRhbGxvd0VkaXQ6IGZhbHNlXG5cdFx0XHRhbGxvd1JlYWQ6IHRydWVcblx0XHRcdG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlXG5cdFx0XHR2aWV3QWxsUmVjb3JkczogdHJ1ZSIsIkNyZWF0b3IuT2JqZWN0cy5hdWRpdF9yZWNvcmRzID0ge1xuICBuYW1lOiBcImF1ZGl0X3JlY29yZHNcIixcbiAgbGFiZWw6IFwi5a2X5q615Y6G5Y+yXCIsXG4gIGljb246IFwicmVjb3JkXCIsXG4gIGZpZWxkczoge1xuICAgIHJlbGF0ZWRfdG86IHtcbiAgICAgIGxhYmVsOiBcIuebuOWFs+mhuVwiLFxuICAgICAgdHlwZTogXCJsb29rdXBcIixcbiAgICAgIGluZGV4OiB0cnVlLFxuICAgICAgcmVmZXJlbmNlX3RvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG87XG4gICAgICAgIG8gPSBbXTtcbiAgICAgICAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ob2JqZWN0LCBvYmplY3RfbmFtZSkge1xuICAgICAgICAgIGlmIChvYmplY3QuZW5hYmxlX2F1ZGl0KSB7XG4gICAgICAgICAgICByZXR1cm4gby5wdXNoKG9iamVjdC5uYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbztcbiAgICAgIH0sXG4gICAgICBmaWx0ZXJhYmxlOiB0cnVlLFxuICAgICAgaXNfbmFtZTogdHJ1ZVxuICAgIH0sXG4gICAgY3JlYXRlZDoge1xuICAgICAgbGFiZWw6IFwi5pe26Ze0XCIsXG4gICAgICBmaWx0ZXJhYmxlOiB0cnVlXG4gICAgfSxcbiAgICBmaWVsZF9uYW1lOiB7XG4gICAgICBsYWJlbDogXCLlrZfmrrVcIixcbiAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBpc193aWRlOiB0cnVlXG4gICAgfSxcbiAgICBjcmVhdGVkX2J5OiB7XG4gICAgICBsYWJlbDogXCLnlKjmiLdcIlxuICAgIH0sXG4gICAgcHJldmlvdXNfdmFsdWU6IHtcbiAgICAgIGxhYmVsOiBcIuWOn+Wni+WAvFwiLFxuICAgICAgdHlwZTogXCJ0ZXh0XCJcbiAgICB9LFxuICAgIG5ld192YWx1ZToge1xuICAgICAgbGFiZWw6IFwi5paw5YC8XCIsXG4gICAgICB0eXBlOiBcInRleHRcIlxuICAgIH1cbiAgfSxcbiAgbGlzdF92aWV3czoge1xuICAgIGFsbDoge1xuICAgICAgbGFiZWw6IFwi5YWo6YOoXCIsXG4gICAgICBmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIixcbiAgICAgIGNvbHVtbnM6IFtcInJlbGF0ZWRfdG9cIiwgXCJjcmVhdGVkXCIsIFwiZmllbGRfbmFtZVwiLCBcImNyZWF0ZWRfYnlcIiwgXCJwcmV2aW91c192YWx1ZVwiLCBcIm5ld192YWx1ZVwiXSxcbiAgICAgIGZpbHRlcl9maWVsZHM6IFtcInJlbGF0ZWRfdG9cIl1cbiAgICB9LFxuICAgIHJlY2VudDoge1xuICAgICAgbGFiZWw6IFwi5pyA6L+R5p+l55yLXCIsXG4gICAgICBmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxuICAgIH1cbiAgfSxcbiAgcGVybWlzc2lvbl9zZXQ6IHtcbiAgICB1c2VyOiB7XG4gICAgICBhbGxvd0NyZWF0ZTogZmFsc2UsXG4gICAgICBhbGxvd0RlbGV0ZTogZmFsc2UsXG4gICAgICBhbGxvd0VkaXQ6IGZhbHNlLFxuICAgICAgYWxsb3dSZWFkOiB0cnVlLFxuICAgICAgbW9kaWZ5QWxsUmVjb3JkczogZmFsc2UsXG4gICAgICB2aWV3QWxsUmVjb3JkczogZmFsc2VcbiAgICB9LFxuICAgIGFkbWluOiB7XG4gICAgICBhbGxvd0NyZWF0ZTogZmFsc2UsXG4gICAgICBhbGxvd0RlbGV0ZTogZmFsc2UsXG4gICAgICBhbGxvd0VkaXQ6IGZhbHNlLFxuICAgICAgYWxsb3dSZWFkOiB0cnVlLFxuICAgICAgbW9kaWZ5QWxsUmVjb3JkczogZmFsc2UsXG4gICAgICB2aWV3QWxsUmVjb3JkczogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsIkNyZWF0b3IuT2JqZWN0cy5hdWRpdF9sb2dpbiA9XG5cdG5hbWU6IFwiYXVkaXRfbG9naW5cIlxuXHRsYWJlbDogXCLnmbvlvZXml6Xlv5dcIlxuXHRpY29uOiBcInJlY29yZFwiXG5cdGZpZWxkczpcblx0XHR1c2VybmFtZTpcblx0XHRcdGxhYmVsOiBcIueUqOaIt+WQjVwiXG5cdFx0XHR0eXBlOiBcInRleHRcIlxuXHRcdFx0aXNfbmFtZTogdHJ1ZVxuXG5cdFx0bG9naW5fdGltZTpcblx0XHRcdGxhYmVsOlwi55m75b2V5pe26Ze0XCJcblx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxuXG5cdFx0c291cmNlX2lwOlxuXHRcdFx0bGFiZWw6IFwiSVDlnLDlnYBcIlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblxuXHRcdGxvY2F0aW9uOlxuXHRcdFx0bGFiZWw6XCLkvY3nva5cIlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblxuXHRcdGxvZ2luX3R5cGU6XG5cdFx0XHRsYWJlbDogXCLnmbvlvZXmlrnlvI9cIlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblxuXHRcdHN0YXR1czpcblx0XHRcdGxhYmVsOiBcIueKtuaAgVwiXG5cdFx0XHR0eXBlOiBcInRleHRcIlxuXG5cdFx0YnJvd3Nlcjpcblx0XHRcdGxhYmVsOiBcIua1j+iniOWZqFwiXG5cdFx0XHR0eXBlOiBcInRleHRcIlxuXG5cdFx0cGxhdGZvcm06XG5cdFx0XHRsYWJlbDogXCLns7vnu59cIlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblxuXHRcdGFwcGxpY2F0aW9uOlxuXHRcdFx0bGFiZWw6IFwi5bqU55SoXCJcblx0XHRcdHR5cGU6IFwidGV4dFwiXG5cblx0XHRjbGllbnRfdmVyc2lvbjpcblx0XHRcdGxhYmVsOiBcIuWuouaIt+err+eJiOacrFwiXG5cdFx0XHR0eXBlOiBcInRleHRcIlxuXG5cdFx0YXBpX3R5cGU6XG5cdFx0XHRsYWJlbDogXCJhcGnnsbvlnotcIlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblxuXHRcdGFwaV92ZXJzaW9uOlxuXHRcdFx0bGFiZWw6IFwiYXBp54mI5pysXCJcblx0XHRcdHR5cGU6IFwidGV4dFwiXG5cblx0XHRsb2dpbl91cmw6XG5cdFx0XHRsYWJlbDogXCLnmbvlvZVVUkxcIlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblxuXHRsaXN0X3ZpZXdzOlxuXHRcdGFsbDpcblx0XHRcdGxhYmVsOiBcIuWFqOmDqFwiXG5cdFx0XHRmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxuXHRcdFx0Y29sdW1uczogW1widXNlcm5hbWVcIiwgXCJsb2dpbl90aW1lXCIsIFwic291cmNlX2lwXCIsIFwibG9jYXRpb25cIiwgXCJsb2dpbl90eXBlXCIsIFwic3RhdHVzXCIsIFwiYnJvd3NlclwiLCBcInBsYXRmb3JtXCIsIFwiYXBwbGljYXRpb25cIiwgXCJjbGllbnRfdmVyc2lvblwiLCBcImFwaV90eXBlXCIsIFwiYXBpX3ZlcnNpb25cIiwgXCJsb2dpbl91cmxcIl1cblx0XHRyZWNlbnQ6XG5cdFx0XHRsYWJlbDogXCLmnIDov5Hmn6XnnItcIlxuXHRcdFx0ZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcblxuXHRwZXJtaXNzaW9uX3NldDpcblx0XHR1c2VyOlxuXHRcdFx0YWxsb3dDcmVhdGU6IGZhbHNlXG5cdFx0XHRhbGxvd0RlbGV0ZTogZmFsc2Vcblx0XHRcdGFsbG93RWRpdDogZmFsc2Vcblx0XHRcdGFsbG93UmVhZDogdHJ1ZVxuXHRcdFx0bW9kaWZ5QWxsUmVjb3JkczogZmFsc2Vcblx0XHRcdHZpZXdBbGxSZWNvcmRzOiBmYWxzZVxuXHRcdGFkbWluOlxuXHRcdFx0YWxsb3dDcmVhdGU6IGZhbHNlXG5cdFx0XHRhbGxvd0RlbGV0ZTogZmFsc2Vcblx0XHRcdGFsbG93RWRpdDogZmFsc2Vcblx0XHRcdGFsbG93UmVhZDogdHJ1ZVxuXHRcdFx0bW9kaWZ5QWxsUmVjb3JkczogZmFsc2Vcblx0XHRcdHZpZXdBbGxSZWNvcmRzOiB0cnVlIl19
