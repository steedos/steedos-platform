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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdWRpdC9saWIvYXVkaXRfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hdWRpdF9yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdWRpdC9tb2RlbHMvYXVkaXRfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL21vZGVscy9hdWRpdF9yZWNvcmRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdWRpdC9tb2RlbHMvYXVkaXRfbG9naW4uY29mZmVlIl0sIm5hbWVzIjpbImdldExvb2t1cEZpZWxkTW9kaWZpZXIiLCJnZXRMb29rdXBGaWVsZFZhbHVlIiwiaW5zZXJ0UmVjb3JkIiwidHJhbnNmb3JtRmllbGRWYWx1ZSIsInVwZGF0ZVJlY29yZCIsIkNyZWF0b3IiLCJBdWRpdFJlY29yZHMiLCJyZWZlcmVuY2VfdG8iLCJ2YWx1ZSIsInNwYWNlX2lkIiwibmFtZV9maWVsZF9rZXkiLCJvYmoiLCJwcmV2aW91c19pZHMiLCJyZWZlcmVuY2VfdG9fb2JqZWN0IiwidmFsdWVzIiwiXyIsImlzQXJyYXkiLCJpc09iamVjdCIsIm8iLCJpZHMiLCJnZXRPYmplY3QiLCJOQU1FX0ZJRUxEX0tFWSIsImdldENvbGxlY3Rpb24iLCJmaW5kIiwiX2lkIiwiJGluIiwiZmllbGRzIiwiZmV0Y2giLCJnZXRPcmRlcmx5U2V0QnlJZHMiLCJwbHVjayIsImpvaW4iLCJmaWVsZCIsImlzRnVuY3Rpb24iLCJvcHRpb25zRnVuY3Rpb24iLCJpc1N0cmluZyIsIm9wdGlvbnMiLCJzZWxlY3RlZF92YWx1ZSIsInV0Y09mZnNldCIsImlzTnVsbCIsImlzVW5kZWZpbmVkIiwidHlwZSIsIm1vbWVudCIsInV0YyIsImZvcm1hdCIsImlzQm9vbGVhbiIsIm1hcCIsIm9wdGlvbiIsImNvbnRhaW5zIiwibGFiZWwiLCJjb21wYWN0IiwidXNlcklkIiwib2JqZWN0X25hbWUiLCJuZXdfZG9jIiwiY29sbGVjdGlvbiIsImRvYyIsInJlY29yZF9pZCIsInNwYWNlIiwiX21ha2VOZXdJRCIsImZpZWxkX25hbWUiLCJyZWxhdGVkX3RvIiwiaW5zZXJ0IiwicHJldmlvdXNfZG9jIiwibW9kaWZpZXIiLCJtb2RpZmllclNldCIsIm1vZGlmaWVyVW5zZXQiLCJyZWYiLCIkc2V0IiwiJHVuc2V0IiwiZWFjaCIsInYiLCJrIiwiZGJfbmV3X3ZhbHVlIiwiZGJfcHJldmlvdXNfdmFsdWUiLCJuZXdfdmFsdWUiLCJwcmV2aW91c192YWx1ZSIsInRvU3RyaW5nIiwiSlNPTiIsInN0cmluZ2lmeSIsIm5hbWUiLCJhZGQiLCJhY3Rpb24iLCJPYmplY3RzIiwiYXVkaXRfcmVjb3JkcyIsImljb24iLCJpbmRleCIsIm9iamVjdCIsImVuYWJsZV9hdWRpdCIsInB1c2giLCJmaWx0ZXJhYmxlIiwiaXNfbmFtZSIsImNyZWF0ZWQiLCJyZXF1aXJlZCIsImlzX3dpZGUiLCJjcmVhdGVkX2J5IiwibGlzdF92aWV3cyIsImFsbCIsImZpbHRlcl9zY29wZSIsImNvbHVtbnMiLCJmaWx0ZXJfZmllbGRzIiwicmVjZW50IiwicGVybWlzc2lvbl9zZXQiLCJ1c2VyIiwiYWxsb3dDcmVhdGUiLCJhbGxvd0RlbGV0ZSIsImFsbG93RWRpdCIsImFsbG93UmVhZCIsIm1vZGlmeUFsbFJlY29yZHMiLCJ2aWV3QWxsUmVjb3JkcyIsImFkbWluIiwiYXVkaXRfbG9naW4iLCJ1c2VybmFtZSIsImxvZ2luX3RpbWUiLCJzb3VyY2VfaXAiLCJsb2NhdGlvbiIsImxvZ2luX3R5cGUiLCJzdGF0dXMiLCJicm93c2VyIiwicGxhdGZvcm0iLCJhcHBsaWNhdGlvbiIsImNsaWVudF92ZXJzaW9uIiwiYXBpX3R5cGUiLCJhcGlfdmVyc2lvbiIsImxvZ2luX3VybCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEsc0JBQUEsRUFBQUMsbUJBQUEs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S0FGWDtBQUdBQyxpQkFBVyxJQUhYO0FBSUFDLHdCQUFrQixLQUpsQjtBQUtBQyxzQkFBZ0I7QUFMaEI7QUFSRDtBQW5FRCxDQURELEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYXVkaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJDcmVhdG9yLkF1ZGl0UmVjb3JkcyA9IHt9XHJcblxyXG5nZXRMb29rdXBGaWVsZFZhbHVlID0gKHJlZmVyZW5jZV90bywgdmFsdWUsIHNwYWNlX2lkKS0+XHJcblx0aWYgXy5pc0FycmF5KHJlZmVyZW5jZV90bykgJiYgXy5pc09iamVjdCh2YWx1ZSlcclxuXHRcdHJlZmVyZW5jZV90byA9IHZhbHVlLm9cclxuXHRcdHByZXZpb3VzX2lkcyA9IHZhbHVlLmlkc1xyXG5cdGlmICFfLmlzQXJyYXkocHJldmlvdXNfaWRzKVxyXG5cdFx0cHJldmlvdXNfaWRzID0gaWYgdmFsdWUgdGhlbiBbdmFsdWVdIGVsc2UgW11cclxuXHRyZWZlcmVuY2VfdG9fb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVmZXJlbmNlX3RvLCBzcGFjZV9pZClcclxuXHRuYW1lX2ZpZWxkX2tleSA9IHJlZmVyZW5jZV90b19vYmplY3QuTkFNRV9GSUVMRF9LRVlcclxuXHR2YWx1ZXMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVmZXJlbmNlX3RvLCBzcGFjZV9pZCkuZmluZCh7X2lkOiB7JGluOiBwcmV2aW91c19pZHN9fSwge2ZpZWxkczoge19pZDoxLCBcIiN7bmFtZV9maWVsZF9rZXl9XCI6IDF9fSkuZmV0Y2goKVxyXG5cdHZhbHVlcyA9IENyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzKHZhbHVlcywgcHJldmlvdXNfaWRzKVxyXG5cdHJldHVybiAoXy5wbHVjayB2YWx1ZXMsIG5hbWVfZmllbGRfa2V5KS5qb2luKCcsJylcclxuXHJcbmdldExvb2t1cEZpZWxkTW9kaWZpZXIgPSAoZmllbGQsIHZhbHVlLCBzcGFjZV9pZCktPlxyXG5cdHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xyXG5cdGlmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pXHJcblx0XHRyZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8oKVxyXG5cdGlmIF8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zRnVuY3Rpb24pXHJcblx0XHRpZiBfLmlzU3RyaW5nKHJlZmVyZW5jZV90bylcclxuXHRcdFx0aWYgdmFsdWVcclxuXHRcdFx0XHRyZXR1cm4gZ2V0TG9va3VwRmllbGRWYWx1ZShyZWZlcmVuY2VfdG8sIHZhbHVlLCBzcGFjZV9pZClcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuICcnXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuIGdldExvb2t1cEZpZWxkVmFsdWUocmVmZXJlbmNlX3RvLCB2YWx1ZSwgc3BhY2VfaWQpXHJcblxyXG4jIyNcclxu5a2X5q615YC86L2s5o2i6KeE5YiZOlxyXG4xIOaXpeacnyDmoLzlvI/lrZjlgqjkuLogKFN0cmluZyk6IDIwMTgtMDEtMDJcclxuMiDml7bpl7Qg5qC85byP5a2Y5YKo5Li6IChTdHJpbmcpOiAyMDE4LTAxLTAyIDIzOjEyXHJcbjIgbG9va3VwIOWSjOS4i+aLieahhu+8jOmDveaYr+WvueW6lOeahOaYvuekuuWQjeensCAobmFtZSB8IGxhYmVsKVxyXG4zIGJvb2xlYW4g5bCx5a2Y5pivL+WQplxyXG40IOWkmuihjOaWh+acrFxcZ3JpZFxcbG9va3Vw5pyJb3B0aW9uc0Z1bmN0aW9u5bm25LiU5rKh5pyJcmVmZXJlbmNlX3Rv5pe2IOS4jeiusOW9leaWsOaXp+WAvCwg5Y+q6K6w5b2V5L+u5pS55pe26Ze0LCDkv67mlLnkurosIOS/ruaUueeahOWtl+auteaYvuekuuWQjVxyXG4jIyNcclxudHJhbnNmb3JtRmllbGRWYWx1ZSA9IChmaWVsZCwgdmFsdWUsIG9wdGlvbnMpLT5cclxuXHJcblx0aWYgXy5pc051bGwodmFsdWUpIHx8IF8uaXNVbmRlZmluZWQodmFsdWUpXHJcblx0XHRyZXR1cm5cclxuXHJcblx0dXRjT2Zmc2V0ID0gb3B0aW9ucy51dGNPZmZzZXRcclxuXHRzcGFjZV9pZCA9IG9wdGlvbnMuc3BhY2VfaWRcclxuXHJcblx0c3dpdGNoIGZpZWxkLnR5cGVcclxuXHRcdHdoZW4gJ2RhdGUnXHJcblx0XHRcdHJldHVybiBtb21lbnQudXRjKHZhbHVlKS5mb3JtYXQoJ1lZWVktTU0tREQnKVxyXG5cdFx0d2hlbiAnZGF0ZXRpbWUnXHJcblx0XHRcdHJldHVybiBtb21lbnQodmFsdWUpLnV0Y09mZnNldCh1dGNPZmZzZXQpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbScpXHJcblx0XHR3aGVuICdib29sZWFuJ1xyXG5cdFx0XHRpZiBfLmlzQm9vbGVhbih2YWx1ZSlcclxuXHRcdFx0XHRpZiB2YWx1ZVxyXG5cdFx0XHRcdFx0cmV0dXJuICfmmK8nXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0cmV0dXJuICflkKYnXHJcblx0XHR3aGVuICdzZWxlY3QnXHJcblx0XHRcdGlmIF8uaXNTdHJpbmcodmFsdWUpXHJcblx0XHRcdFx0dmFsdWUgPSBbdmFsdWVdXHJcblx0XHRcdHNlbGVjdGVkX3ZhbHVlID0gXy5tYXAgZmllbGQub3B0aW9ucywgKG9wdGlvbiktPlxyXG5cdFx0XHRcdGlmIF8uY29udGFpbnModmFsdWUsIG9wdGlvbi52YWx1ZSlcclxuXHRcdFx0XHRcdHJldHVybiBvcHRpb24ubGFiZWxcclxuXHRcdFx0cmV0dXJuIF8uY29tcGFjdChzZWxlY3RlZF92YWx1ZSkuam9pbignLCcpXHJcblx0XHR3aGVuICdjaGVja2JveCdcclxuXHRcdFx0aWYgXy5pc1N0cmluZyh2YWx1ZSlcclxuXHRcdFx0XHR2YWx1ZSA9IFt2YWx1ZV1cclxuXHRcdFx0c2VsZWN0ZWRfdmFsdWUgPSBfLm1hcCBmaWVsZC5vcHRpb25zLCAob3B0aW9uKS0+XHJcblx0XHRcdFx0aWYgXy5jb250YWlucyh2YWx1ZSwgb3B0aW9uLnZhbHVlKVxyXG5cdFx0XHRcdFx0cmV0dXJuIG9wdGlvbi5sYWJlbFxyXG5cdFx0XHRyZXR1cm4gXy5jb21wYWN0KHNlbGVjdGVkX3ZhbHVlKS5qb2luKCcsJylcclxuXHRcdHdoZW4gJ2xvb2t1cCdcclxuXHRcdFx0cmV0dXJuIGdldExvb2t1cEZpZWxkTW9kaWZpZXIoZmllbGQsIHZhbHVlLCBzcGFjZV9pZClcclxuXHRcdHdoZW4gJ21hc3Rlcl9kZXRhaWwnXHJcblx0XHRcdHJldHVybiBnZXRMb29rdXBGaWVsZE1vZGlmaWVyKGZpZWxkLCB2YWx1ZSwgc3BhY2VfaWQpXHJcblx0XHR3aGVuICd0ZXh0YXJlYSdcclxuXHRcdFx0cmV0dXJuICcnXHJcblx0XHR3aGVuICdjb2RlJ1xyXG5cdFx0XHRyZXR1cm4gJydcclxuXHRcdHdoZW4gJ2h0bWwnXHJcblx0XHRcdHJldHVybiAnJ1xyXG5cdFx0d2hlbiAnbWFya2Rvd24nXHJcblx0XHRcdHJldHVybiAnJ1xyXG5cdFx0d2hlbiAnZ3JpZCdcclxuXHRcdFx0cmV0dXJuICcnXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB2YWx1ZVxyXG5cclxuIyDmlrDlu7rml7YsIOS4jeiusOW9leaYjue7hlxyXG5pbnNlcnRSZWNvcmQgPSAodXNlcklkLCBvYmplY3RfbmFtZSwgbmV3X2RvYyktPlxyXG4jXHRpZiAhdXNlcklkXHJcbiNcdFx0cmV0dXJuXHJcblxyXG5cdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhdWRpdF9yZWNvcmRzXCIpXHJcblx0c3BhY2VfaWQgPSBuZXdfZG9jLnNwYWNlXHJcblx0cmVjb3JkX2lkID0gbmV3X2RvYy5faWRcclxuXHRkb2MgPSB7XHJcblx0XHRfaWQ6IGNvbGxlY3Rpb24uX21ha2VOZXdJRCgpXHJcblx0XHRzcGFjZTogc3BhY2VfaWRcclxuXHRcdGZpZWxkX25hbWU6IFwi5bey5Yib5bu644CCXCJcclxuXHRcdHJlbGF0ZWRfdG86IHtcclxuXHRcdFx0bzogb2JqZWN0X25hbWVcclxuXHRcdFx0aWRzOiBbcmVjb3JkX2lkXVxyXG5cdFx0fVxyXG5cdH1cclxuXHRjb2xsZWN0aW9uLmluc2VydCBkb2NcclxuXHJcbiMg5L+u5pS55pe2LCDorrDlvZXlrZfmrrXlj5jmm7TmmI7nu4ZcclxudXBkYXRlUmVjb3JkID0gKHVzZXJJZCwgb2JqZWN0X25hbWUsIG5ld19kb2MsIHByZXZpb3VzX2RvYywgbW9kaWZpZXIpLT5cclxuI1x0aWYgIXVzZXJJZFxyXG4jXHRcdHJldHVyblxyXG5cclxuXHRzcGFjZV9pZCA9IG5ld19kb2Muc3BhY2VcclxuXHRyZWNvcmRfaWQgPSBuZXdfZG9jLl9pZFxyXG5cclxuXHRmaWVsZHMgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VfaWQpPy5maWVsZHNcclxuXHJcblx0bW9kaWZpZXJTZXQgPSBtb2RpZmllci4kc2V0XHJcblxyXG5cdG1vZGlmaWVyVW5zZXQgPSBtb2RpZmllci4kdW5zZXRcclxuXHJcblx0IyMjIFRPRE8gdXRjT2Zmc2V0IOW6lOivpeadpeiHquaVsOaNruW6kyzlvoUgIzk4NCDlpITnkIblkI4g6LCD5pW0XHJcblxyXG4gICAgdXRjT2Zmc2V0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwidXNlcnNcIikuZmluZE9uZSh7X2lkOiB1c2VySWR9KT8udXRjT2Zmc2V0XHJcblxyXG5cdGlmICFfLmlzTnVtYmVyKHV0Y09mZnNldClcclxuXHRcdHV0Y09mZnNldCA9IDhcclxuXHQjIyNcclxuXHJcblx0dXRjT2Zmc2V0ID0gOFxyXG5cclxuXHRvcHRpb25zID0ge3V0Y09mZnNldDogdXRjT2Zmc2V0LCBzcGFjZV9pZDogc3BhY2VfaWR9XHJcblxyXG5cdF8uZWFjaCBtb2RpZmllclNldCwgKHYsIGspLT5cclxuXHRcdGZpZWxkID0gZmllbGRzP1trXVxyXG5cdFx0cHJldmlvdXNfdmFsdWUgPSBwcmV2aW91c19kb2Nba11cclxuXHRcdG5ld192YWx1ZSA9IHZcclxuXHJcblx0XHRkYl9wcmV2aW91c192YWx1ZSA9IG51bGxcclxuXHRcdGRiX25ld192YWx1ZSA9IG51bGxcclxuXHJcblx0XHRzd2l0Y2ggZmllbGQudHlwZVxyXG5cdFx0XHR3aGVuICdkYXRlJ1xyXG5cdFx0XHRcdGlmIG5ld192YWx1ZT8udG9TdHJpbmcoKSAhPSBwcmV2aW91c192YWx1ZT8udG9TdHJpbmcoKVxyXG5cdFx0XHRcdFx0aWYgbmV3X3ZhbHVlXHJcblx0XHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucylcclxuXHRcdFx0XHRcdGlmIHByZXZpb3VzX3ZhbHVlXHJcblx0XHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdHdoZW4gJ2RhdGV0aW1lJ1xyXG5cdFx0XHRcdGlmIG5ld192YWx1ZT8udG9TdHJpbmcoKSAhPSBwcmV2aW91c192YWx1ZT8udG9TdHJpbmcoKVxyXG5cdFx0XHRcdFx0aWYgbmV3X3ZhbHVlXHJcblx0XHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucylcclxuXHRcdFx0XHRcdGlmIHByZXZpb3VzX3ZhbHVlXHJcblx0XHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdHdoZW4gJ3RleHRhcmVhJ1xyXG5cdFx0XHRcdGlmIHByZXZpb3VzX3ZhbHVlICE9IG5ld192YWx1ZVxyXG5cdFx0XHRcdFx0ZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucylcclxuXHRcdFx0XHRcdGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucylcclxuXHRcdFx0d2hlbiAnY29kZSdcclxuXHRcdFx0XHRpZiBwcmV2aW91c192YWx1ZSAhPSBuZXdfdmFsdWVcclxuXHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdFx0XHRkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdHdoZW4gJ2h0bWwnXHJcblx0XHRcdFx0aWYgcHJldmlvdXNfdmFsdWUgIT0gbmV3X3ZhbHVlXHJcblx0XHRcdFx0XHRkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKVxyXG5cdFx0XHRcdFx0ZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKVxyXG5cdFx0XHR3aGVuICdtYXJrZG93bidcclxuXHRcdFx0XHRpZiBwcmV2aW91c192YWx1ZSAhPSBuZXdfdmFsdWVcclxuXHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdFx0XHRkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdHdoZW4gJ2dyaWQnXHJcblx0XHRcdFx0aWYgSlNPTi5zdHJpbmdpZnkocHJldmlvdXNfdmFsdWUpICE9IEpTT04uc3RyaW5naWZ5KG5ld192YWx1ZSlcclxuXHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdFx0XHRkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdHdoZW4gJ2Jvb2xlYW4nXHJcblx0XHRcdFx0aWYgcHJldmlvdXNfdmFsdWUgIT0gbmV3X3ZhbHVlXHJcblx0XHRcdFx0XHRkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKVxyXG5cdFx0XHRcdFx0ZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKVxyXG5cdFx0XHR3aGVuICdzZWxlY3QnXHJcblx0XHRcdFx0aWYgcHJldmlvdXNfdmFsdWU/LnRvU3RyaW5nKCkgIT0gbmV3X3ZhbHVlPy50b1N0cmluZygpXHJcblx0XHRcdFx0XHRkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKVxyXG5cdFx0XHRcdFx0ZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKVxyXG5cdFx0XHR3aGVuICdjaGVja2JveCdcclxuXHRcdFx0XHRpZiBwcmV2aW91c192YWx1ZT8udG9TdHJpbmcoKSAhPSBuZXdfdmFsdWU/LnRvU3RyaW5nKClcclxuXHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdFx0XHRkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdHdoZW4gJ2xvb2t1cCdcclxuXHRcdFx0XHRpZiBKU09OLnN0cmluZ2lmeShwcmV2aW91c192YWx1ZSkgIT0gSlNPTi5zdHJpbmdpZnkobmV3X3ZhbHVlKVxyXG5cdFx0XHRcdFx0aWYgcHJldmlvdXNfdmFsdWVcclxuXHRcdFx0XHRcdFx0ZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucylcclxuXHRcdFx0XHRcdGlmIG5ld192YWx1ZVxyXG5cdFx0XHRcdFx0XHRkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdHdoZW4gJ21hc3Rlcl9kZXRhaWwnXHJcblx0XHRcdFx0aWYgSlNPTi5zdHJpbmdpZnkocHJldmlvdXNfdmFsdWUpICE9IEpTT04uc3RyaW5naWZ5KG5ld192YWx1ZSlcclxuXHRcdFx0XHRcdGlmIHByZXZpb3VzX3ZhbHVlXHJcblx0XHRcdFx0XHRcdGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpXHJcblx0XHRcdFx0XHRpZiBuZXdfdmFsdWVcclxuXHRcdFx0XHRcdFx0ZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aWYgbmV3X3ZhbHVlICE9IHByZXZpb3VzX3ZhbHVlXHJcblx0XHRcdFx0XHRkYl9wcmV2aW91c192YWx1ZSA9IHByZXZpb3VzX3ZhbHVlXHJcblx0XHRcdFx0XHRkYl9uZXdfdmFsdWUgPSBuZXdfdmFsdWVcclxuXHJcblxyXG5cdFx0aWYgZGJfbmV3X3ZhbHVlICE9IG51bGwgfHwgZGJfcHJldmlvdXNfdmFsdWUgIT0gbnVsbFxyXG5cdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXVkaXRfcmVjb3Jkc1wiKVxyXG5cdFx0XHRkb2MgPSB7XHJcblx0XHRcdFx0X2lkOiBjb2xsZWN0aW9uLl9tYWtlTmV3SUQoKVxyXG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZFxyXG5cdFx0XHRcdGZpZWxkX25hbWU6IGZpZWxkLmxhYmVsIHx8IGZpZWxkLm5hbWVcclxuXHRcdFx0XHRwcmV2aW91c192YWx1ZTogZGJfcHJldmlvdXNfdmFsdWVcclxuXHRcdFx0XHRuZXdfdmFsdWU6IGRiX25ld192YWx1ZVxyXG5cdFx0XHRcdHJlbGF0ZWRfdG86IHtcclxuXHRcdFx0XHRcdG86IG9iamVjdF9uYW1lXHJcblx0XHRcdFx0XHRpZHM6IFtyZWNvcmRfaWRdXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGNvbGxlY3Rpb24uaW5zZXJ0IGRvY1xyXG5cclxuXHRfLmVhY2ggbW9kaWZpZXJVbnNldCwgKHYsIGspLT5cclxuXHRcdGZpZWxkID0gZmllbGRzP1trXVxyXG5cdFx0cHJldmlvdXNfdmFsdWUgPSBwcmV2aW91c19kb2Nba11cclxuXHRcdGlmIHByZXZpb3VzX3ZhbHVlIHx8IF8uaXNCb29sZWFuKHByZXZpb3VzX3ZhbHVlKVxyXG5cdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiYXVkaXRfcmVjb3Jkc1wiKVxyXG5cdFx0XHRkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKVxyXG5cdFx0XHRkb2MgPSB7XHJcblx0XHRcdFx0X2lkOiBjb2xsZWN0aW9uLl9tYWtlTmV3SUQoKVxyXG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZFxyXG5cdFx0XHRcdGZpZWxkX25hbWU6IGZpZWxkLmxhYmVsIHx8IGZpZWxkLm5hbWVcclxuXHRcdFx0XHRwcmV2aW91c192YWx1ZTogZGJfcHJldmlvdXNfdmFsdWVcclxuXHRcdFx0XHRyZWxhdGVkX3RvOiB7XHJcblx0XHRcdFx0XHRvOiBvYmplY3RfbmFtZVxyXG5cdFx0XHRcdFx0aWRzOiBbcmVjb3JkX2lkXVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRjb2xsZWN0aW9uLmluc2VydCBkb2NcclxuXHJcbkNyZWF0b3IuQXVkaXRSZWNvcmRzLmFkZCA9IChhY3Rpb24sIHVzZXJJZCwgb2JqZWN0X25hbWUsIG5ld19kb2MsIHByZXZpb3VzX2RvYywgbW9kaWZpZXIpLT5cclxuXHRpZiBhY3Rpb24gPT0gJ3VwZGF0ZSdcclxuXHRcdHVwZGF0ZVJlY29yZCh1c2VySWQsIG9iamVjdF9uYW1lLCBuZXdfZG9jLCBwcmV2aW91c19kb2MsIG1vZGlmaWVyKVxyXG5cdGVsc2UgaWYgYWN0aW9uID09ICdpbnNlcnQnXHJcblx0XHRpbnNlcnRSZWNvcmQodXNlcklkLCBvYmplY3RfbmFtZSwgbmV3X2RvYylcclxuIiwidmFyIGdldExvb2t1cEZpZWxkTW9kaWZpZXIsIGdldExvb2t1cEZpZWxkVmFsdWUsIGluc2VydFJlY29yZCwgdHJhbnNmb3JtRmllbGRWYWx1ZSwgdXBkYXRlUmVjb3JkO1xuXG5DcmVhdG9yLkF1ZGl0UmVjb3JkcyA9IHt9O1xuXG5nZXRMb29rdXBGaWVsZFZhbHVlID0gZnVuY3Rpb24ocmVmZXJlbmNlX3RvLCB2YWx1ZSwgc3BhY2VfaWQpIHtcbiAgdmFyIG5hbWVfZmllbGRfa2V5LCBvYmosIHByZXZpb3VzX2lkcywgcmVmZXJlbmNlX3RvX29iamVjdCwgdmFsdWVzO1xuICBpZiAoXy5pc0FycmF5KHJlZmVyZW5jZV90bykgJiYgXy5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZWZlcmVuY2VfdG8gPSB2YWx1ZS5vO1xuICAgIHByZXZpb3VzX2lkcyA9IHZhbHVlLmlkcztcbiAgfVxuICBpZiAoIV8uaXNBcnJheShwcmV2aW91c19pZHMpKSB7XG4gICAgcHJldmlvdXNfaWRzID0gdmFsdWUgPyBbdmFsdWVdIDogW107XG4gIH1cbiAgcmVmZXJlbmNlX3RvX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlZmVyZW5jZV90bywgc3BhY2VfaWQpO1xuICBuYW1lX2ZpZWxkX2tleSA9IHJlZmVyZW5jZV90b19vYmplY3QuTkFNRV9GSUVMRF9LRVk7XG4gIHZhbHVlcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWZlcmVuY2VfdG8sIHNwYWNlX2lkKS5maW5kKHtcbiAgICBfaWQ6IHtcbiAgICAgICRpbjogcHJldmlvdXNfaWRzXG4gICAgfVxuICB9LCB7XG4gICAgZmllbGRzOiAoXG4gICAgICBvYmogPSB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfSxcbiAgICAgIG9ialtcIlwiICsgbmFtZV9maWVsZF9rZXldID0gMSxcbiAgICAgIG9ialxuICAgIClcbiAgfSkuZmV0Y2goKTtcbiAgdmFsdWVzID0gQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHModmFsdWVzLCBwcmV2aW91c19pZHMpO1xuICByZXR1cm4gKF8ucGx1Y2sodmFsdWVzLCBuYW1lX2ZpZWxkX2tleSkpLmpvaW4oJywnKTtcbn07XG5cbmdldExvb2t1cEZpZWxkTW9kaWZpZXIgPSBmdW5jdGlvbihmaWVsZCwgdmFsdWUsIHNwYWNlX2lkKSB7XG4gIHZhciByZWZlcmVuY2VfdG87XG4gIHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgaWYgKF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pKSB7XG4gICAgcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvKCk7XG4gIH1cbiAgaWYgKF8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zRnVuY3Rpb24pKSB7XG4gICAgaWYgKF8uaXNTdHJpbmcocmVmZXJlbmNlX3RvKSkge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBnZXRMb29rdXBGaWVsZFZhbHVlKHJlZmVyZW5jZV90bywgdmFsdWUsIHNwYWNlX2lkKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZ2V0TG9va3VwRmllbGRWYWx1ZShyZWZlcmVuY2VfdG8sIHZhbHVlLCBzcGFjZV9pZCk7XG4gIH1cbn07XG5cblxuLypcbuWtl+auteWAvOi9rOaNouinhOWImTpcbjEg5pel5pyfIOagvOW8j+WtmOWCqOS4uiAoU3RyaW5nKTogMjAxOC0wMS0wMlxuMiDml7bpl7Qg5qC85byP5a2Y5YKo5Li6IChTdHJpbmcpOiAyMDE4LTAxLTAyIDIzOjEyXG4yIGxvb2t1cCDlkozkuIvmi4nmoYbvvIzpg73mmK/lr7nlupTnmoTmmL7npLrlkI3np7AgKG5hbWUgfCBsYWJlbClcbjMgYm9vbGVhbiDlsLHlrZjmmK8v5ZCmXG40IOWkmuihjOaWh+acrFxcZ3JpZFxcbG9va3Vw5pyJb3B0aW9uc0Z1bmN0aW9u5bm25LiU5rKh5pyJcmVmZXJlbmNlX3Rv5pe2IOS4jeiusOW9leaWsOaXp+WAvCwg5Y+q6K6w5b2V5L+u5pS55pe26Ze0LCDkv67mlLnkurosIOS/ruaUueeahOWtl+auteaYvuekuuWQjVxuICovXG5cbnRyYW5zZm9ybUZpZWxkVmFsdWUgPSBmdW5jdGlvbihmaWVsZCwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGVjdGVkX3ZhbHVlLCBzcGFjZV9pZCwgdXRjT2Zmc2V0O1xuICBpZiAoXy5pc051bGwodmFsdWUpIHx8IF8uaXNVbmRlZmluZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHV0Y09mZnNldCA9IG9wdGlvbnMudXRjT2Zmc2V0O1xuICBzcGFjZV9pZCA9IG9wdGlvbnMuc3BhY2VfaWQ7XG4gIHN3aXRjaCAoZmllbGQudHlwZSkge1xuICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICAgIGNhc2UgJ2RhdGV0aW1lJzpcbiAgICAgIHJldHVybiBtb21lbnQodmFsdWUpLnV0Y09mZnNldCh1dGNPZmZzZXQpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbScpO1xuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgaWYgKF8uaXNCb29sZWFuKHZhbHVlKSkge1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gJ+aYryc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICflkKYnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgaWYgKF8uaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gW3ZhbHVlXTtcbiAgICAgIH1cbiAgICAgIHNlbGVjdGVkX3ZhbHVlID0gXy5tYXAoZmllbGQub3B0aW9ucywgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIGlmIChfLmNvbnRhaW5zKHZhbHVlLCBvcHRpb24udmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIG9wdGlvbi5sYWJlbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5jb21wYWN0KHNlbGVjdGVkX3ZhbHVlKS5qb2luKCcsJyk7XG4gICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgaWYgKF8uaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gW3ZhbHVlXTtcbiAgICAgIH1cbiAgICAgIHNlbGVjdGVkX3ZhbHVlID0gXy5tYXAoZmllbGQub3B0aW9ucywgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIGlmIChfLmNvbnRhaW5zKHZhbHVlLCBvcHRpb24udmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIG9wdGlvbi5sYWJlbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5jb21wYWN0KHNlbGVjdGVkX3ZhbHVlKS5qb2luKCcsJyk7XG4gICAgY2FzZSAnbG9va3VwJzpcbiAgICAgIHJldHVybiBnZXRMb29rdXBGaWVsZE1vZGlmaWVyKGZpZWxkLCB2YWx1ZSwgc3BhY2VfaWQpO1xuICAgIGNhc2UgJ21hc3Rlcl9kZXRhaWwnOlxuICAgICAgcmV0dXJuIGdldExvb2t1cEZpZWxkTW9kaWZpZXIoZmllbGQsIHZhbHVlLCBzcGFjZV9pZCk7XG4gICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgcmV0dXJuICcnO1xuICAgIGNhc2UgJ2NvZGUnOlxuICAgICAgcmV0dXJuICcnO1xuICAgIGNhc2UgJ2h0bWwnOlxuICAgICAgcmV0dXJuICcnO1xuICAgIGNhc2UgJ21hcmtkb3duJzpcbiAgICAgIHJldHVybiAnJztcbiAgICBjYXNlICdncmlkJzpcbiAgICAgIHJldHVybiAnJztcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHZhbHVlO1xuICB9XG59O1xuXG5pbnNlcnRSZWNvcmQgPSBmdW5jdGlvbih1c2VySWQsIG9iamVjdF9uYW1lLCBuZXdfZG9jKSB7XG4gIHZhciBjb2xsZWN0aW9uLCBkb2MsIHJlY29yZF9pZCwgc3BhY2VfaWQ7XG4gIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhdWRpdF9yZWNvcmRzXCIpO1xuICBzcGFjZV9pZCA9IG5ld19kb2Muc3BhY2U7XG4gIHJlY29yZF9pZCA9IG5ld19kb2MuX2lkO1xuICBkb2MgPSB7XG4gICAgX2lkOiBjb2xsZWN0aW9uLl9tYWtlTmV3SUQoKSxcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgZmllbGRfbmFtZTogXCLlt7LliJvlu7rjgIJcIixcbiAgICByZWxhdGVkX3RvOiB7XG4gICAgICBvOiBvYmplY3RfbmFtZSxcbiAgICAgIGlkczogW3JlY29yZF9pZF1cbiAgICB9XG4gIH07XG4gIHJldHVybiBjb2xsZWN0aW9uLmluc2VydChkb2MpO1xufTtcblxudXBkYXRlUmVjb3JkID0gZnVuY3Rpb24odXNlcklkLCBvYmplY3RfbmFtZSwgbmV3X2RvYywgcHJldmlvdXNfZG9jLCBtb2RpZmllcikge1xuICB2YXIgZmllbGRzLCBtb2RpZmllclNldCwgbW9kaWZpZXJVbnNldCwgb3B0aW9ucywgcmVjb3JkX2lkLCByZWYsIHNwYWNlX2lkLCB1dGNPZmZzZXQ7XG4gIHNwYWNlX2lkID0gbmV3X2RvYy5zcGFjZTtcbiAgcmVjb3JkX2lkID0gbmV3X2RvYy5faWQ7XG4gIGZpZWxkcyA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VfaWQpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMDtcbiAgbW9kaWZpZXJTZXQgPSBtb2RpZmllci4kc2V0O1xuICBtb2RpZmllclVuc2V0ID0gbW9kaWZpZXIuJHVuc2V0O1xuXG4gIC8qIFRPRE8gdXRjT2Zmc2V0IOW6lOivpeadpeiHquaVsOaNruW6kyzlvoUgIzk4NCDlpITnkIblkI4g6LCD5pW0XG4gIFxuICAgICB1dGNPZmZzZXQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJ1c2Vyc1wiKS5maW5kT25lKHtfaWQ6IHVzZXJJZH0pPy51dGNPZmZzZXRcbiAgXG4gIFx0aWYgIV8uaXNOdW1iZXIodXRjT2Zmc2V0KVxuICBcdFx0dXRjT2Zmc2V0ID0gOFxuICAgKi9cbiAgdXRjT2Zmc2V0ID0gODtcbiAgb3B0aW9ucyA9IHtcbiAgICB1dGNPZmZzZXQ6IHV0Y09mZnNldCxcbiAgICBzcGFjZV9pZDogc3BhY2VfaWRcbiAgfTtcbiAgXy5lYWNoKG1vZGlmaWVyU2V0LCBmdW5jdGlvbih2LCBrKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGRiX25ld192YWx1ZSwgZGJfcHJldmlvdXNfdmFsdWUsIGRvYywgZmllbGQsIG5ld192YWx1ZSwgcHJldmlvdXNfdmFsdWU7XG4gICAgZmllbGQgPSBmaWVsZHMgIT0gbnVsbCA/IGZpZWxkc1trXSA6IHZvaWQgMDtcbiAgICBwcmV2aW91c192YWx1ZSA9IHByZXZpb3VzX2RvY1trXTtcbiAgICBuZXdfdmFsdWUgPSB2O1xuICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gbnVsbDtcbiAgICBkYl9uZXdfdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoZmllbGQudHlwZSkge1xuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgIGlmICgobmV3X3ZhbHVlICE9IG51bGwgPyBuZXdfdmFsdWUudG9TdHJpbmcoKSA6IHZvaWQgMCkgIT09IChwcmV2aW91c192YWx1ZSAhPSBudWxsID8gcHJldmlvdXNfdmFsdWUudG9TdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICBpZiAobmV3X3ZhbHVlKSB7XG4gICAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocHJldmlvdXNfdmFsdWUpIHtcbiAgICAgICAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RhdGV0aW1lJzpcbiAgICAgICAgaWYgKChuZXdfdmFsdWUgIT0gbnVsbCA/IG5ld192YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKSAhPT0gKHByZXZpb3VzX3ZhbHVlICE9IG51bGwgPyBwcmV2aW91c192YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKSkge1xuICAgICAgICAgIGlmIChuZXdfdmFsdWUpIHtcbiAgICAgICAgICAgIGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwcmV2aW91c192YWx1ZSkge1xuICAgICAgICAgICAgZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgICBpZiAocHJldmlvdXNfdmFsdWUgIT09IG5ld192YWx1ZSkge1xuICAgICAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIGRiX25ld192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIG5ld192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2RlJzpcbiAgICAgICAgaWYgKHByZXZpb3VzX3ZhbHVlICE9PSBuZXdfdmFsdWUpIHtcbiAgICAgICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaHRtbCc6XG4gICAgICAgIGlmIChwcmV2aW91c192YWx1ZSAhPT0gbmV3X3ZhbHVlKSB7XG4gICAgICAgICAgZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21hcmtkb3duJzpcbiAgICAgICAgaWYgKHByZXZpb3VzX3ZhbHVlICE9PSBuZXdfdmFsdWUpIHtcbiAgICAgICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZ3JpZCc6XG4gICAgICAgIGlmIChKU09OLnN0cmluZ2lmeShwcmV2aW91c192YWx1ZSkgIT09IEpTT04uc3RyaW5naWZ5KG5ld192YWx1ZSkpIHtcbiAgICAgICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIGlmIChwcmV2aW91c192YWx1ZSAhPT0gbmV3X3ZhbHVlKSB7XG4gICAgICAgICAgZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICAgIGlmICgocHJldmlvdXNfdmFsdWUgIT0gbnVsbCA/IHByZXZpb3VzX3ZhbHVlLnRvU3RyaW5nKCkgOiB2b2lkIDApICE9PSAobmV3X3ZhbHVlICE9IG51bGwgPyBuZXdfdmFsdWUudG9TdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgICBpZiAoKHByZXZpb3VzX3ZhbHVlICE9IG51bGwgPyBwcmV2aW91c192YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKSAhPT0gKG5ld192YWx1ZSAhPSBudWxsID8gbmV3X3ZhbHVlLnRvU3RyaW5nKCkgOiB2b2lkIDApKSB7XG4gICAgICAgICAgZGJfcHJldmlvdXNfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBwcmV2aW91c192YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xvb2t1cCc6XG4gICAgICAgIGlmIChKU09OLnN0cmluZ2lmeShwcmV2aW91c192YWx1ZSkgIT09IEpTT04uc3RyaW5naWZ5KG5ld192YWx1ZSkpIHtcbiAgICAgICAgICBpZiAocHJldmlvdXNfdmFsdWUpIHtcbiAgICAgICAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgcHJldmlvdXNfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobmV3X3ZhbHVlKSB7XG4gICAgICAgICAgICBkYl9uZXdfdmFsdWUgPSB0cmFuc2Zvcm1GaWVsZFZhbHVlKGZpZWxkLCBuZXdfdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21hc3Rlcl9kZXRhaWwnOlxuICAgICAgICBpZiAoSlNPTi5zdHJpbmdpZnkocHJldmlvdXNfdmFsdWUpICE9PSBKU09OLnN0cmluZ2lmeShuZXdfdmFsdWUpKSB7XG4gICAgICAgICAgaWYgKHByZXZpb3VzX3ZhbHVlKSB7XG4gICAgICAgICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG5ld192YWx1ZSkge1xuICAgICAgICAgICAgZGJfbmV3X3ZhbHVlID0gdHJhbnNmb3JtRmllbGRWYWx1ZShmaWVsZCwgbmV3X3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobmV3X3ZhbHVlICE9PSBwcmV2aW91c192YWx1ZSkge1xuICAgICAgICAgIGRiX3ByZXZpb3VzX3ZhbHVlID0gcHJldmlvdXNfdmFsdWU7XG4gICAgICAgICAgZGJfbmV3X3ZhbHVlID0gbmV3X3ZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChkYl9uZXdfdmFsdWUgIT09IG51bGwgfHwgZGJfcHJldmlvdXNfdmFsdWUgIT09IG51bGwpIHtcbiAgICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJhdWRpdF9yZWNvcmRzXCIpO1xuICAgICAgZG9jID0ge1xuICAgICAgICBfaWQ6IGNvbGxlY3Rpb24uX21ha2VOZXdJRCgpLFxuICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgIGZpZWxkX25hbWU6IGZpZWxkLmxhYmVsIHx8IGZpZWxkLm5hbWUsXG4gICAgICAgIHByZXZpb3VzX3ZhbHVlOiBkYl9wcmV2aW91c192YWx1ZSxcbiAgICAgICAgbmV3X3ZhbHVlOiBkYl9uZXdfdmFsdWUsXG4gICAgICAgIHJlbGF0ZWRfdG86IHtcbiAgICAgICAgICBvOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICBpZHM6IFtyZWNvcmRfaWRdXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gY29sbGVjdGlvbi5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gXy5lYWNoKG1vZGlmaWVyVW5zZXQsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZGJfcHJldmlvdXNfdmFsdWUsIGRvYywgZmllbGQsIHByZXZpb3VzX3ZhbHVlO1xuICAgIGZpZWxkID0gZmllbGRzICE9IG51bGwgPyBmaWVsZHNba10gOiB2b2lkIDA7XG4gICAgcHJldmlvdXNfdmFsdWUgPSBwcmV2aW91c19kb2Nba107XG4gICAgaWYgKHByZXZpb3VzX3ZhbHVlIHx8IF8uaXNCb29sZWFuKHByZXZpb3VzX3ZhbHVlKSkge1xuICAgICAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImF1ZGl0X3JlY29yZHNcIik7XG4gICAgICBkYl9wcmV2aW91c192YWx1ZSA9IHRyYW5zZm9ybUZpZWxkVmFsdWUoZmllbGQsIHByZXZpb3VzX3ZhbHVlLCBvcHRpb25zKTtcbiAgICAgIGRvYyA9IHtcbiAgICAgICAgX2lkOiBjb2xsZWN0aW9uLl9tYWtlTmV3SUQoKSxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICBmaWVsZF9uYW1lOiBmaWVsZC5sYWJlbCB8fCBmaWVsZC5uYW1lLFxuICAgICAgICBwcmV2aW91c192YWx1ZTogZGJfcHJldmlvdXNfdmFsdWUsXG4gICAgICAgIHJlbGF0ZWRfdG86IHtcbiAgICAgICAgICBvOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICBpZHM6IFtyZWNvcmRfaWRdXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gY29sbGVjdGlvbi5pbnNlcnQoZG9jKTtcbiAgICB9XG4gIH0pO1xufTtcblxuQ3JlYXRvci5BdWRpdFJlY29yZHMuYWRkID0gZnVuY3Rpb24oYWN0aW9uLCB1c2VySWQsIG9iamVjdF9uYW1lLCBuZXdfZG9jLCBwcmV2aW91c19kb2MsIG1vZGlmaWVyKSB7XG4gIGlmIChhY3Rpb24gPT09ICd1cGRhdGUnKSB7XG4gICAgcmV0dXJuIHVwZGF0ZVJlY29yZCh1c2VySWQsIG9iamVjdF9uYW1lLCBuZXdfZG9jLCBwcmV2aW91c19kb2MsIG1vZGlmaWVyKTtcbiAgfSBlbHNlIGlmIChhY3Rpb24gPT09ICdpbnNlcnQnKSB7XG4gICAgcmV0dXJuIGluc2VydFJlY29yZCh1c2VySWQsIG9iamVjdF9uYW1lLCBuZXdfZG9jKTtcbiAgfVxufTtcbiIsIkNyZWF0b3IuT2JqZWN0cy5hdWRpdF9yZWNvcmRzID1cclxuXHRuYW1lOiBcImF1ZGl0X3JlY29yZHNcIlxyXG5cdGxhYmVsOiBcIuWtl+auteWOhuWPslwiXHJcblx0aWNvbjogXCJyZWNvcmRcIlxyXG5cdGZpZWxkczpcclxuXHRcdHJlbGF0ZWRfdG86XHJcblx0XHRcdGxhYmVsOiBcIuebuOWFs+mhuVwiXHJcblx0XHRcdHR5cGU6IFwibG9va3VwXCJcclxuXHRcdFx0aW5kZXg6IHRydWVcclxuXHRcdFx0cmVmZXJlbmNlX3RvOiAoKS0+XHJcblx0XHRcdFx0byA9IFtdXHJcblx0XHRcdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKG9iamVjdCwgb2JqZWN0X25hbWUpLT5cclxuXHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfYXVkaXRcclxuXHRcdFx0XHRcdFx0by5wdXNoIG9iamVjdC5uYW1lXHJcblx0XHRcdFx0cmV0dXJuIG9cclxuXHRcdFx0ZmlsdGVyYWJsZTp0cnVlXHJcblx0XHRcdGlzX25hbWU6IHRydWVcclxuXHRcdGNyZWF0ZWQ6XHJcblx0XHRcdGxhYmVsOlwi5pe26Ze0XCJcclxuXHRcdFx0ZmlsdGVyYWJsZTp0cnVlXHJcblx0XHRmaWVsZF9uYW1lOlxyXG5cdFx0XHRsYWJlbDogXCLlrZfmrrVcIlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZVxyXG5cdFx0XHRpc193aWRlOiB0cnVlXHJcblx0XHRjcmVhdGVkX2J5OlxyXG5cdFx0XHRsYWJlbDpcIueUqOaIt1wiXHJcblx0XHRwcmV2aW91c192YWx1ZTpcclxuXHRcdFx0bGFiZWw6IFwi5Y6f5aeL5YC8XCJcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHRcdG5ld192YWx1ZTpcclxuXHRcdFx0bGFiZWw6IFwi5paw5YC8XCJcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHJcblxyXG5cdGxpc3Rfdmlld3M6XHJcblx0XHRhbGw6XHJcblx0XHRcdGxhYmVsOiBcIuWFqOmDqFwiXHJcblx0XHRcdGZpbHRlcl9zY29wZTogXCJzcGFjZVwiXHJcblx0XHRcdGNvbHVtbnM6IFtcInJlbGF0ZWRfdG9cIiwgXCJjcmVhdGVkXCIsIFwiZmllbGRfbmFtZVwiLCBcImNyZWF0ZWRfYnlcIiwgXCJwcmV2aW91c192YWx1ZVwiLCBcIm5ld192YWx1ZVwiXVxyXG5cdFx0XHRmaWx0ZXJfZmllbGRzOiBbXCJyZWxhdGVkX3RvXCJdXHJcblx0XHRyZWNlbnQ6XHJcblx0XHRcdGxhYmVsOiBcIuacgOi/keafpeeci1wiXHJcblx0XHRcdGZpbHRlcl9zY29wZTogXCJzcGFjZVwiXHJcblxyXG5cdHBlcm1pc3Npb25fc2V0OlxyXG5cdFx0dXNlcjpcclxuXHRcdFx0YWxsb3dDcmVhdGU6IGZhbHNlXHJcblx0XHRcdGFsbG93RGVsZXRlOiBmYWxzZVxyXG5cdFx0XHRhbGxvd0VkaXQ6IGZhbHNlXHJcblx0XHRcdGFsbG93UmVhZDogdHJ1ZVxyXG5cdFx0XHRtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZVxyXG5cdFx0XHR2aWV3QWxsUmVjb3JkczogZmFsc2VcclxuXHRcdGFkbWluOlxyXG5cdFx0XHRhbGxvd0NyZWF0ZTogZmFsc2VcclxuXHRcdFx0YWxsb3dEZWxldGU6IGZhbHNlXHJcblx0XHRcdGFsbG93RWRpdDogZmFsc2VcclxuXHRcdFx0YWxsb3dSZWFkOiB0cnVlXHJcblx0XHRcdG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlXHJcblx0XHRcdHZpZXdBbGxSZWNvcmRzOiB0cnVlIiwiQ3JlYXRvci5PYmplY3RzLmF1ZGl0X3JlY29yZHMgPSB7XG4gIG5hbWU6IFwiYXVkaXRfcmVjb3Jkc1wiLFxuICBsYWJlbDogXCLlrZfmrrXljoblj7JcIixcbiAgaWNvbjogXCJyZWNvcmRcIixcbiAgZmllbGRzOiB7XG4gICAgcmVsYXRlZF90bzoge1xuICAgICAgbGFiZWw6IFwi55u45YWz6aG5XCIsXG4gICAgICB0eXBlOiBcImxvb2t1cFwiLFxuICAgICAgaW5kZXg6IHRydWUsXG4gICAgICByZWZlcmVuY2VfdG86IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbztcbiAgICAgICAgbyA9IFtdO1xuICAgICAgICBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihvYmplY3QsIG9iamVjdF9uYW1lKSB7XG4gICAgICAgICAgaWYgKG9iamVjdC5lbmFibGVfYXVkaXQpIHtcbiAgICAgICAgICAgIHJldHVybiBvLnB1c2gob2JqZWN0Lm5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvO1xuICAgICAgfSxcbiAgICAgIGZpbHRlcmFibGU6IHRydWUsXG4gICAgICBpc19uYW1lOiB0cnVlXG4gICAgfSxcbiAgICBjcmVhdGVkOiB7XG4gICAgICBsYWJlbDogXCLml7bpl7RcIixcbiAgICAgIGZpbHRlcmFibGU6IHRydWVcbiAgICB9LFxuICAgIGZpZWxkX25hbWU6IHtcbiAgICAgIGxhYmVsOiBcIuWtl+autVwiLFxuICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGlzX3dpZGU6IHRydWVcbiAgICB9LFxuICAgIGNyZWF0ZWRfYnk6IHtcbiAgICAgIGxhYmVsOiBcIueUqOaIt1wiXG4gICAgfSxcbiAgICBwcmV2aW91c192YWx1ZToge1xuICAgICAgbGFiZWw6IFwi5Y6f5aeL5YC8XCIsXG4gICAgICB0eXBlOiBcInRleHRcIlxuICAgIH0sXG4gICAgbmV3X3ZhbHVlOiB7XG4gICAgICBsYWJlbDogXCLmlrDlgLxcIixcbiAgICAgIHR5cGU6IFwidGV4dFwiXG4gICAgfVxuICB9LFxuICBsaXN0X3ZpZXdzOiB7XG4gICAgYWxsOiB7XG4gICAgICBsYWJlbDogXCLlhajpg6hcIixcbiAgICAgIGZpbHRlcl9zY29wZTogXCJzcGFjZVwiLFxuICAgICAgY29sdW1uczogW1wicmVsYXRlZF90b1wiLCBcImNyZWF0ZWRcIiwgXCJmaWVsZF9uYW1lXCIsIFwiY3JlYXRlZF9ieVwiLCBcInByZXZpb3VzX3ZhbHVlXCIsIFwibmV3X3ZhbHVlXCJdLFxuICAgICAgZmlsdGVyX2ZpZWxkczogW1wicmVsYXRlZF90b1wiXVxuICAgIH0sXG4gICAgcmVjZW50OiB7XG4gICAgICBsYWJlbDogXCLmnIDov5Hmn6XnnItcIixcbiAgICAgIGZpbHRlcl9zY29wZTogXCJzcGFjZVwiXG4gICAgfVxuICB9LFxuICBwZXJtaXNzaW9uX3NldDoge1xuICAgIHVzZXI6IHtcbiAgICAgIGFsbG93Q3JlYXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RGVsZXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RWRpdDogZmFsc2UsXG4gICAgICBhbGxvd1JlYWQ6IHRydWUsXG4gICAgICBtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZSxcbiAgICAgIHZpZXdBbGxSZWNvcmRzOiBmYWxzZVxuICAgIH0sXG4gICAgYWRtaW46IHtcbiAgICAgIGFsbG93Q3JlYXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RGVsZXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RWRpdDogZmFsc2UsXG4gICAgICBhbGxvd1JlYWQ6IHRydWUsXG4gICAgICBtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZSxcbiAgICAgIHZpZXdBbGxSZWNvcmRzOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiQ3JlYXRvci5PYmplY3RzLmF1ZGl0X2xvZ2luID1cclxuXHRuYW1lOiBcImF1ZGl0X2xvZ2luXCJcclxuXHRsYWJlbDogXCLnmbvlvZXml6Xlv5dcIlxyXG5cdGljb246IFwicmVjb3JkXCJcclxuXHRmaWVsZHM6XHJcblx0XHR1c2VybmFtZTpcclxuXHRcdFx0bGFiZWw6IFwi55So5oi35ZCNXCJcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHRcdFx0aXNfbmFtZTogdHJ1ZVxyXG5cclxuXHRcdGxvZ2luX3RpbWU6XHJcblx0XHRcdGxhYmVsOlwi55m75b2V5pe26Ze0XCJcclxuXHRcdFx0dHlwZTogXCJkYXRldGltZVwiXHJcblxyXG5cdFx0c291cmNlX2lwOlxyXG5cdFx0XHRsYWJlbDogXCJJUOWcsOWdgFwiXHJcblx0XHRcdHR5cGU6IFwidGV4dFwiXHJcblxyXG5cdFx0bG9jYXRpb246XHJcblx0XHRcdGxhYmVsOlwi5L2N572uXCJcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHJcblx0XHRsb2dpbl90eXBlOlxyXG5cdFx0XHRsYWJlbDogXCLnmbvlvZXmlrnlvI9cIlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cclxuXHRcdHN0YXR1czpcclxuXHRcdFx0bGFiZWw6IFwi54q25oCBXCJcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHJcblx0XHRicm93c2VyOlxyXG5cdFx0XHRsYWJlbDogXCLmtY/op4jlmahcIlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cclxuXHRcdHBsYXRmb3JtOlxyXG5cdFx0XHRsYWJlbDogXCLns7vnu59cIlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cclxuXHRcdGFwcGxpY2F0aW9uOlxyXG5cdFx0XHRsYWJlbDogXCLlupTnlKhcIlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cclxuXHRcdGNsaWVudF92ZXJzaW9uOlxyXG5cdFx0XHRsYWJlbDogXCLlrqLmiLfnq6/niYjmnKxcIlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cclxuXHRcdGFwaV90eXBlOlxyXG5cdFx0XHRsYWJlbDogXCJhcGnnsbvlnotcIlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cclxuXHRcdGFwaV92ZXJzaW9uOlxyXG5cdFx0XHRsYWJlbDogXCJhcGnniYjmnKxcIlxyXG5cdFx0XHR0eXBlOiBcInRleHRcIlxyXG5cclxuXHRcdGxvZ2luX3VybDpcclxuXHRcdFx0bGFiZWw6IFwi55m75b2VVVJMXCJcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHJcblx0bGlzdF92aWV3czpcclxuXHRcdGFsbDpcclxuXHRcdFx0bGFiZWw6IFwi5YWo6YOoXCJcclxuXHRcdFx0ZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcclxuXHRcdFx0Y29sdW1uczogW1widXNlcm5hbWVcIiwgXCJsb2dpbl90aW1lXCIsIFwic291cmNlX2lwXCIsIFwibG9jYXRpb25cIiwgXCJsb2dpbl90eXBlXCIsIFwic3RhdHVzXCIsIFwiYnJvd3NlclwiLCBcInBsYXRmb3JtXCIsIFwiYXBwbGljYXRpb25cIiwgXCJjbGllbnRfdmVyc2lvblwiLCBcImFwaV90eXBlXCIsIFwiYXBpX3ZlcnNpb25cIiwgXCJsb2dpbl91cmxcIl1cclxuXHRcdHJlY2VudDpcclxuXHRcdFx0bGFiZWw6IFwi5pyA6L+R5p+l55yLXCJcclxuXHRcdFx0ZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcclxuXHJcblx0cGVybWlzc2lvbl9zZXQ6XHJcblx0XHR1c2VyOlxyXG5cdFx0XHRhbGxvd0NyZWF0ZTogZmFsc2VcclxuXHRcdFx0YWxsb3dEZWxldGU6IGZhbHNlXHJcblx0XHRcdGFsbG93RWRpdDogZmFsc2VcclxuXHRcdFx0YWxsb3dSZWFkOiB0cnVlXHJcblx0XHRcdG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlXHJcblx0XHRcdHZpZXdBbGxSZWNvcmRzOiBmYWxzZVxyXG5cdFx0YWRtaW46XHJcblx0XHRcdGFsbG93Q3JlYXRlOiBmYWxzZVxyXG5cdFx0XHRhbGxvd0RlbGV0ZTogZmFsc2VcclxuXHRcdFx0YWxsb3dFZGl0OiBmYWxzZVxyXG5cdFx0XHRhbGxvd1JlYWQ6IHRydWVcclxuXHRcdFx0bW9kaWZ5QWxsUmVjb3JkczogZmFsc2VcclxuXHRcdFx0dmlld0FsbFJlY29yZHM6IHRydWUiXX0=
