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
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var ECMAScript = Package.ecmascript.ECMAScript;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var Restivus = Package['nimble:restivus'].Restivus;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var Tabular = Package['aldeed:tabular'].Tabular;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var Push = Package['raix:push'].Push;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var Logger = Package['steedos:logger'].Logger;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var HTML = Package.htmljs.HTML;
var meteorInstall = Package.modules.meteorInstall;
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:objects":{"i18n":{"en.i18n.json.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/i18n/en.i18n.json.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Package['universe:i18n'].i18n.addTranslations('en','',{});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"zh-CN.i18n.json.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/i18n/zh-CN.i18n.json.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Package['universe:i18n'].i18n.addTranslations('en','',{});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"core.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/core.coffee                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.db = {};

if (typeof Creator === "undefined" || Creator === null) {
  this.Creator = {};
}

Creator.Objects = {};
Creator.Collections = {};
Creator.Menus = [];
Creator.Apps = {};
Creator.Reports = {};
Creator.subs = {};
Creator.steedosSchema = {};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"loadStandardObjects.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/loadStandardObjects.coffee                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var e, steedosCore;

try {
  steedosCore = require('@steedos/core');

  if (Meteor.isDevelopment) {
    Meteor.startup(function () {
      var ex;

      try {
        return steedosCore.init();
      } catch (error) {
        ex = error;
        return console.log(ex);
      }
    });
  }
} catch (error) {
  e = error;
  console.log(e);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"coreSupport.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/coreSupport.coffee                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Fiber, path;
Creator.deps = {
  app: new Tracker.Dependency(),
  object: new Tracker.Dependency()
};
Creator._TEMPLATE = {
  Apps: {},
  Objects: {}
};
Meteor.startup(function () {
  SimpleSchema.extendOptions({
    filtersFunction: Match.Optional(Match.OneOf(Function, String))
  });
  SimpleSchema.extendOptions({
    optionsFunction: Match.Optional(Match.OneOf(Function, String))
  });
  return SimpleSchema.extendOptions({
    createFunction: Match.Optional(Match.OneOf(Function, String))
  });
});

if (Meteor.isServer) {
  Fiber = require('fibers');

  Creator.fiberLoadObjects = function (obj, object_name) {
    return Fiber(function () {
      return Creator.loadObjects(obj, object_name);
    }).run();
  };
}

Creator.loadObjects = function (obj, object_name) {
  if (!object_name) {
    object_name = obj.name;
  }

  if (!obj.list_views) {
    obj.list_views = {};
  }

  if (obj.space) {
    object_name = 'c_' + obj.space + '_' + obj.name;
  }

  Creator.convertObject(obj);
  new Creator.Object(obj);
  Creator.initTriggers(object_name);
  Creator.initListViews(object_name);
  return obj;
};

Creator.getObjectName = function (object) {
  if (object.space) {
    return "c_" + object.space + "_" + object.name;
  }

  return object.name;
};

Creator.getObject = function (object_name, space_id) {
  var obj, ref, ref1;

  if (_.isArray(object_name)) {
    return;
  }

  if (Meteor.isClient) {
    if ((ref = Creator.deps) != null) {
      if ((ref1 = ref.object) != null) {
        ref1.depend();
      }
    }
  }

  if (!object_name && Meteor.isClient) {
    object_name = Session.get("object_name");
  }

  if (!space_id && object_name) {
    if (Meteor.isClient && !object_name.startsWith('c_')) {
      space_id = Session.get("spaceId");
    }
  }

  if (object_name) {
    if (space_id) {
      obj = Creator.objectsByName["c_" + space_id + "_" + object_name];

      if (obj) {
        return obj;
      }
    }

    obj = _.find(Creator.objectsByName, function (o) {
      return o._collection_name === object_name;
    });

    if (obj) {
      return obj;
    }

    return Creator.objectsByName[object_name];
  }
};

Creator.getObjectById = function (object_id) {
  return _.findWhere(Creator.objectsByName, {
    _id: object_id
  });
};

Creator.removeObject = function (object_name) {
  console.log("removeObject", object_name);
  delete Creator.Objects[object_name];
  return delete Creator.objectsByName[object_name];
};

Creator.getCollection = function (object_name, spaceId) {
  var ref;

  if (!object_name) {
    object_name = Session.get("object_name");
  }

  if (object_name) {
    return Creator.Collections[(ref = Creator.getObject(object_name, spaceId)) != null ? ref._collection_name : void 0];
  }
};

Creator.removeCollection = function (object_name) {
  return delete Creator.Collections[object_name];
};

Creator.isSpaceAdmin = function (spaceId, userId) {
  var ref, ref1, space;

  if (Meteor.isClient) {
    if (!spaceId) {
      spaceId = Session.get("spaceId");
    }

    if (!userId) {
      userId = Meteor.userId();
    }
  }

  space = (ref = Creator.getObject("spaces")) != null ? (ref1 = ref.db) != null ? ref1.findOne(spaceId) : void 0 : void 0;

  if (space != null ? space.admins : void 0) {
    return space.admins.indexOf(userId) >= 0;
  }
};

Creator.evaluateFormula = function (formular, context, options) {
  if (!_.isString(formular)) {
    return formular;
  }

  if (Creator.Formular.checkFormula(formular)) {
    return Creator.Formular.run(formular, context, options);
  }

  return formular;
};

Creator.evaluateFilters = function (filters, context) {
  var selector;
  selector = {};

  _.each(filters, function (filter) {
    var action, name, value;

    if ((filter != null ? filter.length : void 0) === 3) {
      name = filter[0];
      action = filter[1];
      value = Creator.evaluateFormula(filter[2], context);
      selector[name] = {};
      return selector[name][action] = value;
    }
  });

  console.log("evaluateFilters-->selector", selector);
  return selector;
};

Creator.isCommonSpace = function (spaceId) {
  return spaceId === 'common';
}; /*
   	docs：待排序的文档数组
   	ids：_id集合
   	id_key: 默认为_id
   	return 按照ids的顺序返回新的文档集合
    */

Creator.getOrderlySetByIds = function (docs, ids, id_key, hit_first) {
  var values;

  if (!id_key) {
    id_key = "_id";
  }

  if (hit_first) {
    values = docs.getProperty(id_key);
    return _.sortBy(docs, function (doc) {
      var _index;

      _index = ids.indexOf(doc[id_key]);

      if (_index > -1) {
        return _index;
      } else {
        return ids.length + _.indexOf(values, doc[id_key]);
      }
    });
  } else {
    return _.sortBy(docs, function (doc) {
      return ids.indexOf(doc[id_key]);
    });
  }
}; /*
   	按用户所属本地化语言进行排序，支持中文、数值、日期等字段排序
   	对于Object类型，如果提供作用域中key属性，则取值为value[key]进行排序比较，反之整个Object.toString()后排序比较
    */

Creator.sortingMethod = function (value1, value2) {
  var isValue1Empty, isValue2Empty, locale;

  if (this.key) {
    value1 = value1[this.key];
    value2 = value2[this.key];
  }

  if (value1 instanceof Date) {
    value1 = value1.getTime();
  }

  if (value2 instanceof Date) {
    value2 = value2.getTime();
  }

  if (typeof value1 === "number" && typeof value2 === "number") {
    return value1 - value2;
  }

  isValue1Empty = value1 === null || value1 === void 0;
  isValue2Empty = value2 === null || value2 === void 0;

  if (isValue1Empty && !isValue2Empty) {
    return -1;
  }

  if (isValue1Empty && isValue2Empty) {
    return 0;
  }

  if (!isValue1Empty && isValue2Empty) {
    return 1;
  }

  locale = Steedos.locale();
  return value1.toString().localeCompare(value2.toString(), locale);
};

Creator.getObjectRelateds = function (object_name) {
  var _object, permissions, related_objects;

  if (Meteor.isClient) {
    if (!object_name) {
      object_name = Session.get("object_name");
    }
  }

  related_objects = [];
  _object = Creator.Objects[object_name];

  if (!_object) {
    return related_objects;
  }

  if (_object.enable_files) {
    related_objects.push({
      object_name: "cms_files",
      foreign_key: "parent"
    });
  }

  _.each(Creator.Objects, function (related_object, related_object_name) {
    return _.each(related_object.fields, function (related_field, related_field_name) {
      if (related_field.type === "master_detail" && related_field.reference_to && related_field.reference_to === object_name) {
        if (related_object_name === "object_fields") {
          return related_objects.splice(0, 0, {
            object_name: related_object_name,
            foreign_key: related_field_name
          });
        } else {
          return related_objects.push({
            object_name: related_object_name,
            foreign_key: related_field_name
          });
        }
      }
    });
  });

  if (_object.enable_tasks) {
    related_objects.push({
      object_name: "tasks",
      foreign_key: "related_to"
    });
  }

  if (_object.enable_notes) {
    related_objects.push({
      object_name: "notes",
      foreign_key: "related_to"
    });
  }

  if (_object.enable_events) {
    related_objects.push({
      object_name: "events",
      foreign_key: "related_to"
    });
  }

  if (_object.enable_instances) {
    related_objects.push({
      object_name: "instances",
      foreign_key: "record_ids"
    });
  }

  if (Meteor.isClient) {
    permissions = Creator.getPermissions(object_name);

    if (_object.enable_audit && (permissions != null ? permissions.modifyAllRecords : void 0)) {
      related_objects.push({
        object_name: "audit_records",
        foreign_key: "related_to"
      });
    }
  }

  return related_objects;
};

Creator.getUserContext = function (userId, spaceId, isUnSafeMode) {
  var USER_CONTEXT, ref, space_user_org, su, suFields;

  if (Meteor.isClient) {
    return Creator.USER_CONTEXT;
  } else {
    if (!(userId && spaceId)) {
      throw new Meteor.Error(500, "the params userId and spaceId is required for the function Creator.getUserContext");
      return null;
    }

    suFields = {
      name: 1,
      mobile: 1,
      position: 1,
      email: 1,
      company: 1,
      organization: 1,
      space: 1,
      company_id: 1,
      company_ids: 1
    };
    su = Creator.Collections["space_users"].findOne({
      space: spaceId,
      user: userId
    }, {
      fields: suFields
    });

    if (!su) {
      spaceId = null;
    }

    if (!spaceId) {
      if (isUnSafeMode) {
        su = Creator.Collections["space_users"].findOne({
          user: userId
        }, {
          fields: suFields
        });

        if (!su) {
          return null;
        }

        spaceId = su.space;
      } else {
        return null;
      }
    }

    USER_CONTEXT = {};
    USER_CONTEXT.userId = userId;
    USER_CONTEXT.spaceId = spaceId;
    USER_CONTEXT.user = {
      _id: userId,
      name: su.name,
      mobile: su.mobile,
      position: su.position,
      email: su.email,
      company: su.company,
      company_id: su.company_id,
      company_ids: su.company_ids
    };
    space_user_org = (ref = Creator.getCollection("organizations")) != null ? ref.findOne(su.organization) : void 0;

    if (space_user_org) {
      USER_CONTEXT.user.organization = {
        _id: space_user_org._id,
        name: space_user_org.name,
        fullname: space_user_org.fullname
      };
    }

    return USER_CONTEXT;
  }
};

Creator.getRelativeUrl = function (url) {
  if (url) {
    if (!/^\//.test(url)) {
      url = "/" + url;
    }

    return __meteor_runtime_config__.ROOT_URL_PATH_PREFIX + url;
  } else {
    return __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;
  }
};

Creator.getUserCompanyId = function (userId, spaceId) {
  var su;
  userId = userId || Meteor.userId();

  if (Meteor.isClient) {
    spaceId = spaceId || Session.get('spaceId');
  } else {
    if (!spaceId) {
      throw new Meteor.Error(400, 'miss spaceId');
    }
  }

  su = Creator.getCollection('space_users').findOne({
    space: spaceId,
    user: userId
  }, {
    fields: {
      company_id: 1
    }
  });
  return su.company_id;
};

Creator.getUserCompanyIds = function (userId, spaceId) {
  var su;
  userId = userId || Meteor.userId();

  if (Meteor.isClient) {
    spaceId = spaceId || Session.get('spaceId');
  } else {
    if (!spaceId) {
      throw new Meteor.Error(400, 'miss spaceId');
    }
  }

  su = Creator.getCollection('space_users').findOne({
    space: spaceId,
    user: userId
  }, {
    fields: {
      company_ids: 1
    }
  });
  return su != null ? su.company_ids : void 0;
};

Creator.processPermissions = function (po) {
  if (po.allowCreate) {
    po.allowRead = true;
  }

  if (po.allowEdit) {
    po.allowRead = true;
  }

  if (po.allowDelete) {
    po.allowEdit = true;
    po.allowRead = true;
  }

  if (po.viewAllRecords) {
    po.allowRead = true;
  }

  if (po.modifyAllRecords) {
    po.allowRead = true;
    po.allowEdit = true;
    po.allowDelete = true;
    po.viewAllRecords = true;
  }

  if (po.viewCompanyRecords) {
    po.allowRead = true;
  }

  if (po.modifyCompanyRecords) {
    po.allowRead = true;
    po.allowEdit = true;
    po.allowDelete = true;
    po.viewCompanyRecords = true;
  }

  return po;
};

if (Meteor.isServer) {
  if (process.env.STEEDOS_STORAGE_DIR) {
    Creator.steedosStorageDir = process.env.STEEDOS_STORAGE_DIR;
  } else {
    path = require('path');
    Creator.steedosStorageDir = path.resolve(path.join(__meteor_bootstrap__.serverDir, '../../../cfs'));
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"methods":{"object_options.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/server/methods/object_options.coffee                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  "creator.object_options": function (options) {
    var collection, e, name_field_key, object, options_limit, query, query_options, records, ref, ref1, results, searchTextQuery, selected, sort;

    if (options != null ? (ref = options.params) != null ? ref.reference_to : void 0 : void 0) {
      object = Creator.getObject(options.params.reference_to, options.params.space);
      name_field_key = object.NAME_FIELD_KEY;
      query = {};

      if (options.params.space) {
        query.space = options.params.space;
        sort = options != null ? options.sort : void 0;
        selected = (options != null ? options.selected : void 0) || [];
        options_limit = (options != null ? options.options_limit : void 0) || 10;

        if (options.searchText) {
          searchTextQuery = {};
          searchTextQuery[name_field_key] = {
            $regex: options.searchText
          };
        }

        if (options != null ? (ref1 = options.values) != null ? ref1.length : void 0 : void 0) {
          if (options.searchText) {
            query.$or = [{
              _id: {
                $in: options.values
              }
            }, searchTextQuery];
          } else {
            query.$or = [{
              _id: {
                $in: options.values
              }
            }];
          }
        } else {
          if (options.searchText) {
            _.extend(query, searchTextQuery);
          }

          query._id = {
            $nin: selected
          };
        }

        collection = object.db;

        if (options.filterQuery) {
          _.extend(query, options.filterQuery);
        }

        query_options = {
          limit: options_limit
        };

        if (sort && _.isObject(sort)) {
          query_options.sort = sort;
        }

        if (collection) {
          try {
            records = collection.find(query, query_options).fetch();
            results = [];

            _.each(records, function (record) {
              return results.push({
                label: record[name_field_key],
                value: record._id
              });
            });

            return results;
          } catch (error) {
            e = error;
            throw new Meteor.Error(500, e.message + "-->" + JSON.stringify(options));
          }
        }
      }
    }

    return [];
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"routes":{"api_workflow_view_instance.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/server/routes/api_workflow_view_instance.coffee                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
JsonRoutes.add('post', '/api/workflow/view/:instanceId', function (req, res, next) {
  var box, collection, current_user_id, current_user_info, e, flowId, hashData, ins, insId, object_name, permissions, record_id, redirect_url, ref, ref1, ref2, space, spaceId, space_id, workflowUrl, x_auth_token, x_user_id;

  try {
    current_user_info = uuflowManager.check_authorization(req);
    current_user_id = current_user_info._id;
    hashData = req.body;
    object_name = hashData.object_name;
    record_id = hashData.record_id;
    space_id = hashData.space_id;
    check(object_name, String);
    check(record_id, String);
    check(space_id, String);
    insId = req.params.instanceId;
    x_user_id = req.query['X-User-Id'];
    x_auth_token = req.query['X-Auth-Token'];
    redirect_url = "/";
    ins = Creator.getCollection('instances').findOne(insId);

    if (ins) {
      workflowUrl = Meteor.settings["public"].webservices.workflow.url;
      box = '';
      spaceId = ins.space;
      flowId = ins.flow;

      if (((ref = ins.inbox_users) != null ? ref.includes(current_user_id) : void 0) || ((ref1 = ins.cc_users) != null ? ref1.includes(current_user_id) : void 0)) {
        box = 'inbox';
      } else if ((ref2 = ins.outbox_users) != null ? ref2.includes(current_user_id) : void 0) {
        box = 'outbox';
      } else if (ins.state === 'draft' && ins.submitter === current_user_id) {
        box = 'draft';
      } else if (ins.state === 'pending' && (ins.submitter === current_user_id || ins.applicant === current_user_id)) {
        box = 'pending';
      } else if (ins.state === 'completed' && ins.submitter === current_user_id) {
        box = 'completed';
      } else {
        permissions = permissionManager.getFlowPermissions(flowId, current_user_id);
        space = db.spaces.findOne(spaceId, {
          fields: {
            admins: 1
          }
        });

        if (permissions.includes("admin") || space.admins.includes(current_user_id)) {
          box = 'monitor';
        }
      }

      if (box) {
        redirect_url = workflowUrl + ("workflow/space/" + spaceId + "/" + box + "/" + insId + "?X-User-Id=" + x_user_id + "&X-Auth-Token=" + x_auth_token);
      } else {
        redirect_url = workflowUrl + ("workflow/space/" + spaceId + "/print/" + insId + "?box=monitor&print_is_show_traces=1&print_is_show_attachments=1&X-User-Id=" + x_user_id + "&X-Auth-Token=" + x_auth_token);
      }

      JsonRoutes.sendResult(res, {
        code: 200,
        data: {
          redirect_url: redirect_url
        }
      });
    } else {
      collection = Creator.getCollection(object_name, space_id);

      if (collection) {
        collection.update(record_id, {
          $pull: {
            "instances": {
              "_id": insId
            }
          }
        });
        throw new Meteor.Error('error', '申请单已删除');
      }
    }
  } catch (error) {
    e = error;
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

}}},"lib":{"listviews.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/lib/listviews.coffee                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Creator.getInitWidthPercent = function (object_name, columns) {
  var _schema, column_num, init_width_percent, ref;

  _schema = (ref = Creator.getSchema(object_name)) != null ? ref._schema : void 0;
  column_num = 0;

  if (_schema) {
    _.each(columns, function (field_name) {
      var field, is_wide, ref1, ref2;
      field = _.pick(_schema, field_name);
      is_wide = (ref1 = field[field_name]) != null ? (ref2 = ref1.autoform) != null ? ref2.is_wide : void 0 : void 0;

      if (is_wide) {
        return column_num += 2;
      } else {
        return column_num += 1;
      }
    });

    init_width_percent = 100 / column_num;
    return init_width_percent;
  }
};

Creator.getFieldIsWide = function (object_name, field_name) {
  var _schema, field, is_wide, ref, ref1;

  _schema = Creator.getSchema(object_name)._schema;

  if (_schema) {
    field = _.pick(_schema, field_name);
    is_wide = (ref = field[field_name]) != null ? (ref1 = ref.autoform) != null ? ref1.is_wide : void 0 : void 0;
    return is_wide;
  }
};

Creator.getTabularOrder = function (object_name, list_view_id, columns) {
  var obj, ref, ref1, ref2, setting, sort;
  setting = (ref = Creator.Collections) != null ? (ref1 = ref.settings) != null ? ref1.findOne({
    object_name: object_name,
    record_id: "object_listviews"
  }) : void 0 : void 0;
  obj = Creator.getObject(object_name);
  columns = _.map(columns, function (column) {
    var field;
    field = obj.fields[column];

    if ((field != null ? field.type : void 0) && !field.hidden) {
      return column;
    } else {
      return void 0;
    }
  });
  columns = _.compact(columns);

  if (setting && setting.settings) {
    sort = ((ref2 = setting.settings[list_view_id]) != null ? ref2.sort : void 0) || [];
    sort = _.map(sort, function (order) {
      var index, key;
      key = order[0];
      index = _.indexOf(columns, key);
      order[0] = index + 1;
      return order;
    });
    return sort;
  }

  return [];
};

Creator.initListViews = function (object_name) {
  var columns, default_extra_columns, extra_columns, object, order, ref;
  object = Creator.getObject(object_name);
  columns = Creator.getObjectDefaultColumns(object_name) || ["name"];
  extra_columns = ["owner"];
  default_extra_columns = Creator.getObjectDefaultExtraColumns(object_name) || ["owner"];

  if (default_extra_columns) {
    extra_columns = _.union(extra_columns, default_extra_columns);
  }

  order = Creator.getObjectDefaultSort(object_name) || [];

  if (Meteor.isClient) {
    return (ref = Creator.TabularSelectedIds) != null ? ref[object_name] = [] : void 0;
  }
};

Creator.convertListView = function (default_columens, list_view, list_view_name) {
  var oitem;
  oitem = _.clone(list_view);

  if (!_.has(oitem, "name")) {
    oitem.name = list_view_name;
  }

  if (!oitem.columns) {
    if (default_columens) {
      oitem.columns = default_columens;
    }
  }

  if (!oitem.columns) {
    oitem.columns = ["name"];
  }

  if (!oitem.filter_scope) {
    oitem.filter_scope = "space";
  }

  if (!_.has(oitem, "_id")) {
    oitem._id = list_view_name;
  } else {
    oitem.label = oitem.label || list_view.name;
  }

  if (_.isString(oitem.options)) {
    oitem.options = JSON.parse(oitem.options);
  }

  _.forEach(oitem.filters, function (filter, _index) {
    if (!_.isArray(filter) && _.isObject(filter)) {
      if (Meteor.isServer) {
        if (_.isFunction(filter != null ? filter.value : void 0)) {
          return filter._value = filter.value.toString();
        }
      } else {
        if (_.isString(filter != null ? filter._value : void 0)) {
          return filter.value = Creator["eval"]("(" + filter._value + ")");
        }
      }
    }
  });

  return oitem;
};

if (Meteor.isClient) {
  Creator.getRelatedList = function (object_name) {
    var list, related_objects;
    list = [];
    related_objects = Creator.getRelatedObjects(object_name);

    _.each(related_objects, function (related_object_item) {
      var columns, order, related, related_field_name, related_object, related_object_name, tabular_order;
      related_object_name = related_object_item.object_name;
      related_field_name = related_object_item.foreign_key;
      related_object = Creator.getObject(related_object_name);

      if (!related_object) {
        return;
      }

      columns = Creator.getObjectDefaultColumns(related_object_name) || ["name"];
      columns = _.without(columns, related_field_name);
      order = Creator.getObjectDefaultSort(related_object_name);
      tabular_order = Creator.transformSortToTabular(order, columns);

      if (/\w+\.\$\.\w+/g.test(related_field_name)) {
        related_field_name = related_field_name.replace(/\$\./, "");
      }

      related = {
        object_name: related_object_name,
        columns: columns,
        related_field_name: related_field_name,
        is_file: related_object_name === "cms_files"
      };
      return list.push(related);
    });

    return list;
  };
}

Creator.getObjectFirstListView = function (object_name) {
  return _.first(Creator.getListViews(object_name));
}; /* 
   	取出list_view_id对应的视图，如果不存在或者没有权限，就返回第一个视图
   	exac为true时，需要强制按list_view_id精确查找，不默认返回第一个视图
    */

Creator.getListView = function (object_name, list_view_id, exac) {
  var listViews, list_view, object;

  if (Meteor.isClient) {
    if (!object_name) {
      object_name = Session.get("object_name");
    }

    if (!list_view_id) {
      list_view_id = Session.get("list_view_id");
    }
  }

  object = Creator.getObject(object_name);

  if (!object) {
    return;
  }

  listViews = Creator.getListViews(object_name);

  if (!(listViews != null ? listViews.length : void 0)) {
    return;
  }

  list_view = _.findWhere(listViews, {
    "_id": list_view_id
  });

  if (!list_view) {
    if (exac) {
      return;
    } else {
      list_view = listViews[0];
    }
  }

  return list_view;
};

Creator.getListViewIsRecent = function (object_name, list_view_id) {
  var listView, object;

  if (Meteor.isClient) {
    if (!object_name) {
      object_name = Session.get("object_name");
    }

    if (!list_view_id) {
      list_view_id = Session.get("list_view_id");
    }
  }

  if (typeof list_view_id === "string") {
    object = Creator.getObject(object_name);

    if (!object) {
      return;
    }

    listView = _.findWhere(object.list_views, {
      _id: list_view_id
    });
  } else {
    listView = list_view_id;
  }

  return (listView != null ? listView.name : void 0) === "recent";
}; /*
       获取默认视图
    */

Creator.getObjectDefaultView = function (object_name) {
  var defaultView, object, ref;
  object = Creator.getObject(object_name);

  if (!object) {
    object = Creator.Objects[object_name];
  }

  if (object != null ? (ref = object.list_views) != null ? ref["default"] : void 0 : void 0) {
    defaultView = object.list_views["default"];
  } else {
    _.each(object != null ? object.list_views : void 0, function (list_view, key) {
      if (list_view.name === "all" || key === "all") {
        return defaultView = list_view;
      }
    });
  }

  return defaultView;
}; /*
       获取对象的列表默认显示字段
    */

Creator.getObjectDefaultColumns = function (object_name) {
  var defaultView;
  defaultView = Creator.getObjectDefaultView(object_name);
  return defaultView != null ? defaultView.columns : void 0;
}; /*
   	获取对象的列表默认额外加载的字段
    */

Creator.getObjectDefaultExtraColumns = function (object_name) {
  var defaultView;
  defaultView = Creator.getObjectDefaultView(object_name);
  return defaultView != null ? defaultView.extra_columns : void 0;
}; /*
   	获取对象的默认排序
    */

Creator.getObjectDefaultSort = function (object_name) {
  var defaultView;
  defaultView = Creator.getObjectDefaultView(object_name);

  if (defaultView) {
    if (defaultView.sort) {
      return defaultView.sort;
    } else {
      return [["created", "desc"]];
    }
  }
}; /*
       判断是否All view
    */

Creator.isAllView = function (list_view) {
  return (list_view != null ? list_view.name : void 0) === "all";
}; /*
       判断是否最近查看 view
    */

Creator.isRecentView = function (list_view) {
  return (list_view != null ? list_view.name : void 0) === "recent";
}; /*
       将sort转换为Tabular控件所需要的格式
    */

Creator.transformSortToTabular = function (sort, tabularColumns) {
  var tabular_sort;
  tabular_sort = [];

  _.each(sort, function (item) {
    var column_index, field_name, order;

    if (_.isArray(item)) {
      if (item.length === 1) {
        column_index = tabularColumns.indexOf(item[0]);

        if (column_index > -1) {
          return tabular_sort.push([column_index, "asc"]);
        }
      } else if (item.length === 2) {
        column_index = tabularColumns.indexOf(item[0]);

        if (column_index > -1) {
          return tabular_sort.push([column_index, item[1]]);
        }
      }
    } else if (_.isObject(item)) {
      field_name = item.field_name;
      order = item.order;

      if (field_name && order) {
        column_index = tabularColumns.indexOf(field_name);

        if (column_index > -1) {
          return tabular_sort.push([column_index, order]);
        }
      }
    }
  });

  return tabular_sort;
}; /*
       将sort转换为DevExpress控件所需要的格式
    */

Creator.transformSortToDX = function (sort) {
  var dx_sort;
  dx_sort = [];

  _.each(sort, function (item) {
    var field_name, order;

    if (_.isArray(item)) {
      return dx_sort.push(item);
    } else if (_.isObject(item)) {
      field_name = item.field_name;
      order = item.order;

      if (field_name && order) {
        return dx_sort.push([field_name, order]);
      }
    }
  });

  return dx_sort;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"add_simple_schema_validation_error.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/lib/add_simple_schema_validation_error.coffee                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
SimpleSchema.RegEx.code = new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$');

if (Meteor.isClient) {
  Meteor.startup(function () {
    var _regExMessages;

    _regExMessages = SimpleSchema._globalMessages.regEx || [];

    _regExMessages.push({
      exp: SimpleSchema.RegEx.code,
      msg: "[label] 只能以字母、_开头，且只能包含字母、数字、_"
    });

    return SimpleSchema.messages({
      regEx: _regExMessages
    });
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"field_simple_schema_validation_error.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/lib/field_simple_schema_validation_error.coffee                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
SimpleSchema.RegEx.field = new RegExp('^[a-zA-Z_]\\w*(\\.\\$\\.\\w+)?[a-zA-Z0-9]*$');

if (Meteor.isClient) {
  Meteor.startup(function () {
    var _regExMessages;

    _regExMessages = SimpleSchema._globalMessages.regEx || [];

    _regExMessages.push({
      exp: SimpleSchema.RegEx.field,
      msg: "[label] 只能以字母、_开头，.$.前后必须包含字符"
    });

    return SimpleSchema.messages({
      regEx: _regExMessages
    });
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"eval.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/lib/eval.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// 因为meteor编译coffeescript会导致eval函数报错，所以单独写在一个js文件中。
Creator.evalInContext = function (js, context) {
  //# Return the results of the in-line anonymous function we .call with the passed context
  return function () {
    return eval(js);
  }.call(context);
};

Creator.eval = function (js) {
  return eval(js);
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"convert.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/lib/convert.coffee                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var getOption;

getOption = function (option) {
  var foo;
  foo = option.split(":");

  if (foo.length > 1) {
    return {
      label: foo[0],
      value: foo[1]
    };
  } else {
    return {
      label: foo[0],
      value: foo[0]
    };
  }
};

Creator.convertObject = function (object) {
  _.forEach(object.triggers, function (trigger, key) {
    var _todo, _todo_from_code, _todo_from_db;

    if (Meteor.isServer && trigger.on === "server" || Meteor.isClient && trigger.on === "client") {
      _todo_from_code = trigger != null ? trigger._todo : void 0;
      _todo_from_db = trigger.todo;

      if (_todo_from_code && _.isString(_todo_from_code)) {
        trigger.todo = Creator["eval"]("(" + _todo_from_code + ")");
      }

      if (_todo_from_db && _.isString(_todo_from_db)) {
        if (_todo_from_db.startsWith("function")) {
          trigger.todo = Creator["eval"]("(" + _todo_from_db + ")");
        } else {
          trigger.todo = Creator["eval"]("(function(userId, doc, fieldNames, modifier, options){" + _todo_from_db + "})");
        }
      }
    }

    if (Meteor.isServer && trigger.on === "client") {
      _todo = trigger.todo;

      if (_todo && _.isFunction(_todo)) {
        return trigger._todo = _todo.toString();
      }
    }
  });

  if (Meteor.isClient) {
    _.forEach(object.actions, function (action, key) {
      var _todo_from_code, _todo_from_db, _visible, error;

      _todo_from_code = action != null ? action._todo : void 0;
      _todo_from_db = action != null ? action.todo : void 0;

      if (_todo_from_code && _.isString(_todo_from_code)) {
        try {
          action.todo = Creator["eval"]("(" + _todo_from_code + ")");
        } catch (error1) {
          error = error1;
          console.error("todo_from_code", _todo_from_code);
        }
      }

      if (_todo_from_db && _.isString(_todo_from_db)) {
        try {
          if (_todo_from_db.startsWith("function")) {
            action.todo = Creator["eval"]("(" + _todo_from_db + ")");
          } else {
            if (_.isFunction(Creator.actionsByName[_todo_from_db])) {
              action.todo = _todo_from_db;
            } else {
              action.todo = Creator["eval"]("(function(){" + _todo_from_db + "})");
            }
          }
        } catch (error1) {
          error = error1;
          console.error("todo_from_db", _todo_from_db, error);
        }
      }

      _visible = action != null ? action._visible : void 0;

      if (_visible) {
        try {
          return action.visible = Creator["eval"]("(" + _visible + ")");
        } catch (error1) {
          error = error1;
          return console.error("action.visible to function error: ", error, _visible);
        }
      }
    });
  } else {
    _.forEach(object.actions, function (action, key) {
      var _todo, _visible;

      _todo = action != null ? action.todo : void 0;

      if (_todo && _.isFunction(_todo)) {
        action._todo = _todo.toString();
      }

      _visible = action != null ? action.visible : void 0;

      if (_visible && _.isFunction(_visible)) {
        return action._visible = _visible.toString();
      }
    });
  }

  _.forEach(object.fields, function (field, key) {
    var _options, _type, beforeOpenFunction, createFunction, defaultValue, error, filtersFunction, is_company_limited, options, optionsFunction, reference_to, regEx;

    if (field.options && _.isString(field.options)) {
      try {
        _options = [];

        _.forEach(field.options.split("\n"), function (option) {
          var options;

          if (option.indexOf(",")) {
            options = option.split(",");
            return _.forEach(options, function (_option) {
              return _options.push(getOption(_option));
            });
          } else {
            return _options.push(getOption(option));
          }
        });

        field.options = _options;
      } catch (error1) {
        error = error1;
        console.error("Creator.convertFieldsOptions", field.options, error);
      }
    } else if (field.options && !_.isFunction(field.options) && !_.isArray(field.options) && _.isObject(field.options)) {
      _options = [];

      _.each(field.options, function (v, k) {
        return _options.push({
          label: v,
          value: k
        });
      });

      field.options = _options;
    }

    if (Meteor.isServer) {
      options = field.options;

      if (options && _.isFunction(options)) {
        field._options = field.options.toString();
      }
    } else {
      options = field._options;

      if (options && _.isString(options)) {
        try {
          field.options = Creator["eval"]("(" + options + ")");
        } catch (error1) {
          error = error1;
          console.error("convert error " + object.name + " -> " + field.name, error);
        }
      }
    }

    if (Meteor.isServer) {
      regEx = field.regEx;

      if (regEx) {
        field._regEx = field.regEx.toString();
      }
    } else {
      regEx = field._regEx;

      if (regEx) {
        try {
          field.regEx = Creator["eval"]("(" + regEx + ")");
        } catch (error1) {
          error = error1;
          console.error("convert error " + object.name + " -> " + field.name, error);
        }
      }
    }

    if (Meteor.isServer) {
      if (field.autoform) {
        _type = field.autoform.type;

        if (_type && _.isFunction(_type) && _type !== Object && _type !== String && _type !== Number && _type !== Boolean && !_.isArray(_type)) {
          field.autoform._type = _type.toString();
        }
      }
    } else {
      if (field.autoform) {
        _type = field.autoform._type;

        if (_type && _.isString(_type)) {
          try {
            field.autoform.type = Creator["eval"]("(" + _type + ")");
          } catch (error1) {
            error = error1;
            console.error("convert field -> type error", field, error);
          }
        }
      }
    }

    if (Meteor.isServer) {
      optionsFunction = field.optionsFunction;
      reference_to = field.reference_to;
      createFunction = field.createFunction;
      beforeOpenFunction = field.beforeOpenFunction;
      filtersFunction = field.filtersFunction;

      if (optionsFunction && _.isFunction(optionsFunction)) {
        field._optionsFunction = optionsFunction.toString();
      }

      if (reference_to && _.isFunction(reference_to)) {
        field._reference_to = reference_to.toString();
      }

      if (createFunction && _.isFunction(createFunction)) {
        field._createFunction = createFunction.toString();
      }

      if (beforeOpenFunction && _.isFunction(beforeOpenFunction)) {
        field._beforeOpenFunction = beforeOpenFunction.toString();
      }

      if (filtersFunction && _.isFunction(filtersFunction)) {
        field._filtersFunction = filtersFunction.toString();
      }
    } else {
      optionsFunction = field._optionsFunction || field.optionsFunction;
      reference_to = field._reference_to;
      createFunction = field._createFunction;
      beforeOpenFunction = field._beforeOpenFunction;
      filtersFunction = field._filtersFunction;

      if (optionsFunction && _.isString(optionsFunction)) {
        field.optionsFunction = Creator["eval"]("(" + optionsFunction + ")");
      }

      if (reference_to && _.isString(reference_to)) {
        field.reference_to = Creator["eval"]("(" + reference_to + ")");
      }

      if (createFunction && _.isString(createFunction)) {
        field.createFunction = Creator["eval"]("(" + createFunction + ")");
      }

      if (beforeOpenFunction && _.isString(beforeOpenFunction)) {
        field.beforeOpenFunction = Creator["eval"]("(" + beforeOpenFunction + ")");
      }

      if (filtersFunction && _.isString(filtersFunction)) {
        field.filtersFunction = Creator["eval"]("(" + filtersFunction + ")");
      }
    }

    if (Meteor.isServer) {
      defaultValue = field.defaultValue;

      if (defaultValue && _.isFunction(defaultValue)) {
        field._defaultValue = field.defaultValue.toString();
      }
    } else {
      defaultValue = field._defaultValue;

      if (!defaultValue && _.isString(field.defaultValue) && field.defaultValue.startsWith("function")) {
        defaultValue = field.defaultValue;
      }

      if (defaultValue && _.isString(defaultValue)) {
        try {
          field.defaultValue = Creator["eval"]("(" + defaultValue + ")");
        } catch (error1) {
          error = error1;
          console.error("convert error " + object.name + " -> " + field.name, error);
        }
      }
    }

    if (Meteor.isServer) {
      is_company_limited = field.is_company_limited;

      if (is_company_limited && _.isFunction(is_company_limited)) {
        return field._is_company_limited = field.is_company_limited.toString();
      }
    } else {
      is_company_limited = field._is_company_limited;

      if (is_company_limited && _.isString(is_company_limited)) {
        try {
          return field.is_company_limited = Creator["eval"]("(" + is_company_limited + ")");
        } catch (error1) {
          error = error1;
          return console.error("convert error " + object.name + " -> " + field.name, error);
        }
      }
    }
  });

  _.forEach(object.list_views, function (list_view, key) {
    /*
    			视图过虑器需要支持function，后台转成字符串，前台eval成函数
    			让过虑器支持两种function方式：
    			1. 整个filters为function:
    			如：
    			filters: ()->
    				return [[["object_name","=","project_issues"],'or',["object_name","=","tasks"]]]
    			2. filters内的filter.value为function
    			如：
    			filters: [["object_name", "=", ()->
    				return "project_issues"
    			]]
    			或
    			filters: [{
    				"field": "object_name"
    				"operation": "="
    				"value": ()->
    					return "project_issues"
    			}]
     */if (_.isFunction(list_view.filters)) {
      if (Meteor.isServer) {
        return list_view._filters = list_view.filters.toString();
      }
    } else if (_.isString(list_view._filters)) {
      if (Meteor.isClient) {
        return list_view.filters = Creator["eval"]("(" + list_view._filters + ")");
      }
    } else {
      return _.forEach(list_view.filters, function (filter, _index) {
        if (_.isArray(filter)) {
          if (Meteor.isServer) {
            if (filter.length === 3 && _.isFunction(filter[2])) {
              filter[2] = filter[2].toString();
              return filter[3] = "FUNCTION";
            } else if (filter.length === 3 && _.isDate(filter[2])) {
              return filter[3] = "DATE";
            }
          } else {
            if (filter.length === 4 && _.isString(filter[2]) && filter[3] === "FUNCTION") {
              filter[2] = Creator["eval"]("(" + filter[2] + ")");
              filter.pop();
            }

            if (filter.length === 4 && _.isString(filter[2]) && filter[3] === "DATE") {
              filter[2] = new Date(filter[2]);
              return filter.pop();
            }
          }
        } else if (_.isObject(filter)) {
          if (Meteor.isServer) {
            if (_.isFunction(filter != null ? filter.value : void 0)) {
              return filter._value = filter.value.toString();
            } else if (_.isDate(filter != null ? filter.value : void 0)) {
              return filter._is_date = true;
            }
          } else {
            if (_.isString(filter != null ? filter._value : void 0)) {
              return filter.value = Creator["eval"]("(" + filter._value + ")");
            } else if (filter._is_date === true) {
              return filter.value = new Date(filter.value);
            }
          }
        }
      });
    }
  });

  return object;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"formular.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/lib/formular.coffee                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Creator.Formular = {};
Creator.Formular.PREFIX = "_VALUES";

Creator.Formular._prependPrefixForFormula = function (prefix, fieldVariable) {
  var reg, rev;
  reg = /(\{[^{}]*\})/g;
  rev = fieldVariable.replace(reg, function (m, $1) {
    return prefix + $1.replace(/\{\s*/, "[\"").replace(/\s*\}/, "\"]").replace(/\s*\.\s*/g, "\"][\"");
  });
  return rev;
};

Creator.Formular.checkFormula = function (formula_str) {
  if (_.isString(formula_str) && formula_str.indexOf("{") > -1 && formula_str.indexOf("}") > -1) {
    return true;
  }

  return false;
};

Creator.Formular.run = function (formula_str, _CONTEXT, options) {
  var _VALUES, data, e, extend;

  if (formula_str && _.isString(formula_str)) {
    if (!_.isBoolean(options != null ? options.extend : void 0)) {
      extend = true;
    }

    _VALUES = {};
    _VALUES = _.extend(_VALUES, _CONTEXT);

    if (extend) {
      _VALUES = _.extend(_VALUES, Creator.getUserContext(options != null ? options.userId : void 0, options != null ? options.spaceId : void 0));
    }

    formula_str = Creator.Formular._prependPrefixForFormula("this", formula_str);

    try {
      data = Creator.evalInContext(formula_str, _VALUES);
      return data;
    } catch (error) {
      e = error;
      console.error("Creator.Formular.run: " + formula_str, e);

      if (Meteor.isClient) {
        if (typeof toastr !== "undefined" && toastr !== null) {
          toastr.error("公式执行出错了，请检查公式配置是否正确！");
        }
      }

      throw new Meteor.Error(500, "Creator.Formular.run: " + formula_str + e);
    }
  }

  return formula_str;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"object.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/lib/object.coffee                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Creator.objectsByName = {};

Creator.formatObjectName = function (object_name) {
  if (object_name.startsWith('cfs.files.')) {
    object_name = object_name.replace(new RegExp('\\.', 'g'), '_');
  }

  return object_name;
};

Creator.Object = function (options) {
  var _db, defaultColumns, defaultListViewId, disabled_list_views, permissions, ref, ref1, ref2, ref3, schema, self;

  self = this;

  if (!options.name) {
    console.error(options);
    throw new Error('Creator.Object options must specify name');
  }

  self._id = options._id || options.name;
  self.space = options.space;
  self.name = options.name;
  self.label = options.label;
  self.icon = options.icon;
  self.description = options.description;
  self.is_view = options.is_view;

  if (!_.isBoolean(options.is_enable) || options.is_enable === true) {
    self.is_enable = true;
  } else {
    self.is_enable = false;
  }

  self.enable_search = options.enable_search;
  self.enable_files = options.enable_files;
  self.enable_tasks = options.enable_tasks;
  self.enable_notes = options.enable_notes;
  self.enable_audit = options.enable_audit;
  self.hidden = options.hidden;
  self.enable_api = options.enable_api === void 0 || options.enable_api;
  self.custom = options.custom;
  self.enable_share = options.enable_share;
  self.enable_instances = options.enable_instances;
  self.enable_tree = options.enable_tree;
  self.open_window = options.open_window;
  self.filter_company = options.filter_company;
  self.calendar = _.clone(options.calendar);
  self.sidebar = _.clone(options.sidebar);
  self.enable_chatter = options.enable_chatter;
  self.enable_trash = options.enable_trash;
  self.enable_space_global = options.enable_space_global;
  self.idFieldName = '_id';

  if (options.database_name) {
    self.database_name = options.database_name;
  }

  if (!options.fields) {
    console.error(options);
    throw new Error('Creator.Object options must specify name');
  }

  self.fields = _.clone(options.fields);

  _.each(self.fields, function (field, field_name) {
    if (field_name === 'name' || field.is_name) {
      self.NAME_FIELD_KEY = field_name;
    }

    if (field.primary) {
      return self.idFieldName = field_name;
    }
  });

  if (!options.database_name || options.database_name === 'meteor-mongo') {
    _.each(Creator.baseObject.fields, function (field, field_name) {
      if (!self.fields[field_name]) {
        self.fields[field_name] = {};
      }

      return self.fields[field_name] = _.extend(_.clone(field), self.fields[field_name]);
    });
  }

  self.list_views = {};
  defaultColumns = Creator.getObjectDefaultColumns(self.name);

  _.each(options.list_views, function (item, item_name) {
    var oitem;
    oitem = Creator.convertListView(defaultColumns, item, item_name);
    return self.list_views[item_name] = oitem;
  });

  self.triggers = _.clone(Creator.baseObject.triggers);

  _.each(options.triggers, function (item, item_name) {
    if (!self.triggers[item_name]) {
      self.triggers[item_name] = {};
    }

    self.triggers[item_name].name = item_name;
    return self.triggers[item_name] = _.extend(_.clone(self.triggers[item_name]), item);
  });

  self.actions = _.clone(Creator.baseObject.actions);

  _.each(options.actions, function (item, item_name) {
    var copyItem;

    if (!self.actions[item_name]) {
      self.actions[item_name] = {};
    }

    copyItem = _.clone(self.actions[item_name]);
    delete self.actions[item_name];
    return self.actions[item_name] = _.extend(copyItem, item);
  });

  _.each(self.actions, function (item, item_name) {
    return item.name = item_name;
  });

  self.related_objects = Creator.getObjectRelateds(self.name);
  self.permission_set = _.clone(Creator.baseObject.permission_set);

  if (!options.permission_set) {
    options.permission_set = {};
  }

  if (!((ref = options.permission_set) != null ? ref.admin : void 0)) {
    options.permission_set.admin = _.clone(self.permission_set["admin"]);
  }

  if (!((ref1 = options.permission_set) != null ? ref1.user : void 0)) {
    options.permission_set.user = _.clone(self.permission_set["user"]);
  }

  _.each(options.permission_set, function (item, item_name) {
    if (!self.permission_set[item_name]) {
      self.permission_set[item_name] = {};
    }

    return self.permission_set[item_name] = _.extend(_.clone(self.permission_set[item_name]), item);
  });

  if (Meteor.isClient) {
    permissions = options.permissions;
    disabled_list_views = permissions != null ? permissions.disabled_list_views : void 0;

    if (disabled_list_views != null ? disabled_list_views.length : void 0) {
      defaultListViewId = (ref2 = options.list_views) != null ? (ref3 = ref2.all) != null ? ref3._id : void 0 : void 0;

      if (defaultListViewId) {
        permissions.disabled_list_views = _.map(disabled_list_views, function (list_view_item) {
          if (defaultListViewId === list_view_item) {
            return "all";
          } else {
            return list_view_item;
          }
        });
      }
    }

    self.permissions = new ReactiveVar(permissions);

    _.each(self.fields, function (field, field_name) {
      if (field) {
        if (_.indexOf(permissions != null ? permissions.unreadable_fields : void 0, field_name) < 0) {
          if (field.hidden) {
            return;
          }

          if (_.indexOf(permissions != null ? permissions.uneditable_fields : void 0, field_name) > -1) {
            field.readonly = true;
            field.disabled = true;
            return field.required = false;
          }
        } else {
          return field.hidden = true;
        }
      }
    });
  } else {
    self.permissions = null;
  }

  _db = Creator.createCollection(options);
  Creator.Collections[_db._name] = _db;
  self.db = _db;
  self._collection_name = _db._name;
  schema = Creator.getObjectSchema(self);
  self.schema = new SimpleSchema(schema);

  if (self.name !== "users" && self.name !== "cfs.files.filerecord" && !self.is_view && !_.contains(["flows", "forms", "instances", "organizations"], self.name)) {
    if (Meteor.isClient) {
      _db.attachSchema(self.schema, {
        replace: true
      });
    } else {
      _db.attachSchema(self.schema, {
        replace: true
      });
    }
  }

  if (self.name === "users") {
    _db._simpleSchema = self.schema;
  }

  if (_.contains(["flows", "forms", "instances", "organizations"], self.name)) {
    if (Meteor.isClient) {
      _db.attachSchema(self.schema, {
        replace: true
      });
    }
  }

  Creator.objectsByName[self._collection_name] = self;
  return self;
};

Creator.Object.prototype.i18n = function () {
  var key, self;
  self = this;
  key = self.name;

  if (t(key) === key) {
    if (!self.label) {
      self.label = self.name;
    }
  } else {
    self.label = t(key);
  }

  _.each(self.fields, function (field, field_name) {
    var fkey, ref, ref1, ref2;
    fkey = self.name + "_" + field_name;

    if (t(fkey) === fkey) {
      if (!field.label) {
        field.label = field_name;
      }
    } else {
      field.label = t(fkey);
    }

    return (ref = self.schema) != null ? (ref1 = ref._schema) != null ? (ref2 = ref1[field_name]) != null ? ref2.label = field.label : void 0 : void 0 : void 0;
  });

  return _.each(self.list_views, function (item, item_name) {
    var i18n_key;
    i18n_key = self.name + "_listview_" + item_name;

    if (t(i18n_key) === i18n_key) {
      if (!item.label) {
        return item.label = item_name;
      }
    } else {
      return item.label = t(i18n_key);
    }
  });
};

Creator.getObjectODataRouterPrefix = function (object) {
  if (object) {
    if (!object.database_name || object.database_name === 'meteor-mongo') {
      return "/api/odata/v4";
    } else {
      return "/api/odata/" + object.database_name;
    }
  }
};

if (Meteor.isClient) {
  Meteor.startup(function () {
    return Tracker.autorun(function () {
      var ref;

      if (Session.get("steedos-locale") && ((ref = Creator.bootstrapLoaded) != null ? ref.get() : void 0)) {
        return _.each(Creator.objectsByName, function (object, object_name) {
          return object.i18n();
        });
      }
    });
  });
}

Meteor.startup(function () {
  if (!Creator.bootstrapLoaded && Creator.Objects) {
    return _.each(Creator.Objects, function (object) {
      return new Creator.Object(object);
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fields.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/lib/fields.coffee                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Creator.getObjectSchema = function (obj) {
  var fieldsArr, schema;
  schema = {};
  fieldsArr = [];

  _.each(obj.fields, function (field, field_name) {
    if (!_.has(field, "name")) {
      field.name = field_name;
    }

    return fieldsArr.push(field);
  });

  _.each(_.sortBy(fieldsArr, "sort_no"), function (field) {
    var _object, _ref_obj, _reference_to, autoform_type, field_name, fs, isUnLimited, permissions, ref, ref1, ref2, ref3;

    field_name = field.name;
    fs = {};

    if (field.regEx) {
      fs.regEx = field.regEx;
    }

    fs.autoform = {};
    fs.autoform.multiple = field.multiple;
    fs.autoform.reference_to = field.reference_to;
    autoform_type = (ref = field.autoform) != null ? ref.type : void 0;

    if (field.type === "text" || field.type === "phone") {
      fs.type = String;

      if (field.multiple) {
        fs.type = [String];
        fs.autoform.type = "tags";
      }
    } else if (field.type === "[text]" || field.type === "[phone]") {
      fs.type = [String];
      fs.autoform.type = "tags";
    } else if (field.type === 'code') {
      fs.type = String;
      fs.autoform.type = "widearea";
      fs.autoform.rows = field.rows || 12;

      if (field.language) {
        fs.autoform.language = field.language;
      }
    } else if (field.type === "textarea") {
      fs.type = String;
      fs.autoform.type = "widearea";
      fs.autoform.rows = field.rows || 6;
    } else if (field.type === "password") {
      fs.type = String;
      fs.autoform.type = "password";
    } else if (field.type === "date") {
      fs.type = Date;

      if (Meteor.isClient) {
        if (Steedos.isMobile() || Steedos.isPad()) {
          fs.autoform.afFieldInput = {
            type: "steedos-date-mobile",
            dateMobileOptions: {
              type: "date"
            }
          };
        } else {
          fs.autoform.outFormat = 'yyyy-MM-dd';
          fs.autoform.afFieldInput = {
            type: "dx-date-box",
            timezoneId: "utc",
            dxDateBoxOptions: {
              type: "date",
              displayFormat: "yyyy-MM-dd"
            }
          };
        }
      }
    } else if (field.type === "datetime") {
      fs.type = Date;

      if (Meteor.isClient) {
        if (Steedos.isMobile() || Steedos.isPad()) {
          fs.autoform.afFieldInput = {
            type: "steedos-date-mobile",
            dateMobileOptions: {
              type: "datetime"
            }
          };
        } else {
          fs.autoform.afFieldInput = {
            type: "dx-date-box",
            dxDateBoxOptions: {
              type: "datetime",
              displayFormat: "yyyy-MM-dd HH:mm"
            }
          };
        }
      }
    } else if (field.type === "[Object]") {
      fs.type = [Object];
    } else if (field.type === "html") {
      fs.type = String;
      fs.autoform.afFieldInput = {
        type: "summernote",
        "class": 'editor',
        settings: {
          height: 200,
          dialogsInBody: true,
          toolbar: [['font1', ['style']], ['font2', ['bold', 'underline', 'italic', 'clear']], ['font3', ['fontname']], ['color', ['color']], ['para', ['ul', 'ol', 'paragraph']], ['table', ['table']], ['insert', ['link', 'picture']], ['view', ['codeview']]],
          fontNames: ['Arial', 'Comic Sans MS', 'Courier New', 'Helvetica', 'Impact', '宋体', '黑体', '微软雅黑', '仿宋', '楷体', '隶书', '幼圆']
        }
      };
    } else if (field.type === "lookup" || field.type === "master_detail") {
      fs.type = String;

      if (field.multiple) {
        fs.type = [String];
      }

      if (!field.hidden) {
        fs.autoform.filters = field.filters;
        fs.autoform.dependOn = field.depend_on;

        if (field.beforeOpenFunction) {
          fs.beforeOpenFunction = field.beforeOpenFunction;
        }

        fs.filtersFunction = field.filtersFunction ? field.filtersFunction : Creator.evaluateFilters;

        if (field.optionsFunction) {
          fs.optionsFunction = field.optionsFunction;
        }

        if (field.reference_to) {
          if (Meteor.isClient) {
            if (field.createFunction && _.isFunction(field.createFunction)) {
              fs.createFunction = field.createFunction;
            } else {
              if (_.isString(field.reference_to)) {
                _ref_obj = Creator.Objects[field.reference_to];

                if (_ref_obj != null ? (ref1 = _ref_obj.permissions) != null ? ref1.allowCreate : void 0 : void 0) {
                  fs.autoform.create = true;

                  fs.createFunction = function (lookup_field) {
                    return Modal.show("CreatorObjectModal", {
                      collection: "Creator.Collections." + Creator.getCollection(field.reference_to)._name,
                      formId: "new" + field.reference_to.replace('.', '_'),
                      object_name: "" + field.reference_to,
                      operation: "insert",
                      onSuccess: function (operation, result) {
                        var object;
                        object = Creator.getObject(result.object_name);

                        if (result.object_name === "objects") {
                          return lookup_field.addItems([{
                            label: result.value.label,
                            value: result.value.name,
                            icon: result.value.icon
                          }], result.value.name);
                        } else {
                          return lookup_field.addItems([{
                            label: result.value[object.NAME_FIELD_KEY] || result.value.label || result.value.name,
                            value: result._id
                          }], result._id);
                        }
                      }
                    });
                  };
                } else {
                  fs.autoform.create = false;
                }
              }
            }
          }

          if (_.isBoolean(field.create)) {
            fs.autoform.create = field.create;
          }

          if (field.reference_sort) {
            fs.autoform.optionsSort = field.reference_sort;
          }

          if (field.reference_limit) {
            fs.autoform.optionsLimit = field.reference_limit;
          }

          if (field.reference_to === "users") {
            fs.autoform.type = "selectuser";

            if (!field.hidden && !field.omit) {
              if (field.is_company_limited === void 0) {
                if (Meteor.isClient) {
                  permissions = (ref2 = obj.permissions) != null ? ref2.get() : void 0;
                  isUnLimited = permissions != null ? permissions.viewAllRecords : void 0;

                  if (_.include(["organizations", "users", "space_users"], obj.name)) {
                    isUnLimited = permissions != null ? permissions.modifyAllRecords : void 0;
                  }

                  if (isUnLimited) {
                    fs.autoform.is_company_limited = false;
                  } else {
                    fs.autoform.is_company_limited = true;
                  }
                }
              } else if (_.isFunction(field.is_company_limited)) {
                if (Meteor.isClient) {
                  fs.autoform.is_company_limited = field.is_company_limited(obj.permissions);
                } else {
                  fs.autoform.is_company_limited = true;
                }
              } else {
                fs.autoform.is_company_limited = field.is_company_limited;
              }
            } else {
              fs.autoform.is_company_limited = field.is_company_limited;
            }
          } else if (field.reference_to === "organizations") {
            fs.autoform.type = "selectorg";

            if (!field.hidden && !field.omit) {
              if (field.is_company_limited === void 0) {
                if (Meteor.isClient) {
                  permissions = (ref3 = obj.permissions) != null ? ref3.get() : void 0;
                  isUnLimited = permissions != null ? permissions.viewAllRecords : void 0;

                  if (_.include(["organizations", "users", "space_users"], obj.name)) {
                    isUnLimited = permissions != null ? permissions.modifyAllRecords : void 0;
                  }

                  if (isUnLimited) {
                    fs.autoform.is_company_limited = false;
                  } else {
                    fs.autoform.is_company_limited = true;
                  }
                }
              } else if (_.isFunction(field.is_company_limited)) {
                if (Meteor.isClient) {
                  fs.autoform.is_company_limited = field.is_company_limited(obj.permissions);
                } else {
                  fs.autoform.is_company_limited = true;
                }
              } else {
                fs.autoform.is_company_limited = field.is_company_limited;
              }
            } else {
              fs.autoform.is_company_limited = field.is_company_limited;
            }
          } else {
            if (typeof field.reference_to === "function") {
              _reference_to = field.reference_to();
            } else {
              _reference_to = field.reference_to;
            }

            if (_.isArray(_reference_to)) {
              fs.type = Object;
              fs.blackbox = true;
              fs.autoform.objectSwitche = true;
              schema[field_name + ".o"] = {
                type: String,
                autoform: {
                  omit: true
                }
              };
              schema[field_name + ".ids"] = {
                type: [String],
                autoform: {
                  omit: true
                }
              };
            } else {
              _reference_to = [_reference_to];
            }

            _object = Creator.Objects[_reference_to[0]];

            if (_object && _object.enable_tree) {
              fs.autoform.type = "selectTree";
            } else {
              fs.autoform.type = "steedosLookups";
              fs.autoform.optionsMethod = field.optionsMethod || "creator.object_options";

              if (Meteor.isClient) {
                fs.autoform.optionsMethodParams = function () {
                  return {
                    space: Session.get("spaceId")
                  };
                };

                fs.autoform.references = [];

                _reference_to.forEach(function (_reference) {
                  _object = Creator.Objects[_reference];

                  if (_object) {
                    return fs.autoform.references.push({
                      object: _reference,
                      label: _object != null ? _object.label : void 0,
                      icon: _object != null ? _object.icon : void 0,
                      link: function () {
                        return "/app/" + Session.get('app_id') + "/" + _reference + "/view/";
                      }
                    });
                  } else {
                    return fs.autoform.references.push({
                      object: _reference,
                      link: function () {
                        return "/app/" + Session.get('app_id') + "/" + _reference + "/view/";
                      }
                    });
                  }
                });
              }
            }
          }
        } else {
          fs.autoform.type = "steedosLookups";
          fs.autoform.defaultIcon = field.defaultIcon;
        }
      }
    } else if (field.type === "select") {
      fs.type = String;

      if (field.multiple) {
        fs.type = [String];
        fs.autoform.type = "steedosLookups";
        fs.autoform.showIcon = false;
        fs.autoform.options = field.options;
      } else {
        fs.autoform.type = "select";
        fs.autoform.options = field.options;
        fs.autoform.firstOption = "";
      }
    } else if (field.type === "currency") {
      fs.type = Number;
      fs.autoform.type = "steedosNumber";
      fs.autoform.precision = field.precision || 18;

      if (field != null ? field.scale : void 0) {
        fs.autoform.scale = field.scale;
        fs.decimal = true;
      } else if ((field != null ? field.scale : void 0) !== 0) {
        fs.autoform.scale = 2;
        fs.decimal = true;
      }
    } else if (field.type === "number") {
      fs.type = Number;
      fs.autoform.type = "steedosNumber";
      fs.autoform.precision = field.precision || 18;

      if (field != null ? field.scale : void 0) {
        fs.autoform.scale = field.scale;
        fs.decimal = true;
      }
    } else if (field.type === "boolean") {
      fs.type = Boolean;
      fs.autoform.type = "steedos-boolean-checkbox";
    } else if (field.type === "reference") {
      fs.type = String;
    } else if (field.type === "checkbox") {
      fs.type = [String];
      fs.autoform.type = "select-checkbox";
      fs.autoform.options = field.options;
    } else if (field.type === "file" && field.collection) {
      if (field.multiple) {
        fs.type = [String];
        schema[field_name + ".$"] = {
          autoform: {
            type: 'fileUpload',
            collection: field.collection
          }
        };
      } else {
        fs.type = String;
        fs.autoform.type = 'fileUpload';
        fs.autoform.collection = field.collection;
      }
    } else if (field.type === "filesize") {
      fs.type = Number;
      fs.autoform.type = 'filesize';
    } else if (field.type === "Object" || field.type === "object") {
      fs.type = Object;
    } else if (field.type === "grid") {
      fs.type = Array;
      fs.autoform.editable = true;
      fs.autoform.type = "steedosGrid";
      schema[field_name + ".$"] = {
        type: Object
      };
    } else if (field.type === "image") {
      if (field.multiple) {
        fs.type = [String];
        schema[field_name + ".$"] = {
          autoform: {
            type: 'fileUpload',
            collection: 'images',
            accept: 'image/*'
          }
        };
      } else {
        fs.type = String;
        fs.autoform.type = 'fileUpload';
        fs.autoform.collection = 'images';
        fs.autoform.accept = 'image/*';
      }
    } else if (field.type === "avatar") {
      if (field.multiple) {
        fs.type = [String];
        schema[field_name + ".$"] = {
          autoform: {
            type: 'fileUpload',
            collection: 'avatars',
            accept: 'image/*'
          }
        };
      } else {
        fs.type = String;
        fs.autoform.type = 'fileUpload';
        fs.autoform.collection = 'avatars';
        fs.autoform.accept = 'image/*';
      }
    } else if (field.type === "audio") {
      if (field.multiple) {
        fs.type = [String];
        schema[field_name + ".$"] = {
          autoform: {
            type: 'fileUpload',
            collection: 'audios',
            accept: 'audio/*'
          }
        };
      } else {
        fs.type = String;
        fs.autoform.type = 'fileUpload';
        fs.autoform.collection = 'audios';
        fs.autoform.accept = 'audio/*';
      }
    } else if (field.type === "video") {
      if (field.multiple) {
        fs.type = [String];
        schema[field_name + ".$"] = {
          autoform: {
            type: 'fileUpload',
            collection: 'videos',
            accept: 'video/*'
          }
        };
      } else {
        fs.type = String;
        fs.autoform.type = 'fileUpload';
        fs.autoform.collection = 'videos';
        fs.autoform.accept = 'video/*';
      }
    } else if (field.type === "location") {
      fs.type = Object;
      fs.autoform.type = "location";
      fs.autoform.system = field.system || "wgs84";
      fs.blackbox = true;
    } else if (field.type === "markdown") {
      fs.type = String;
      fs.autoform.type = "steedos-markdown";
    } else if (field.type === 'url') {
      fs.type = String;
      fs.autoform.type = 'steedosUrl';
    } else if (field.type === 'email') {
      fs.type = String;
      fs.regEx = SimpleSchema.RegEx.Email;
      fs.autoform.type = 'steedosEmail';
    } else {
      fs.type = field.type;
    }

    if (field.label) {
      fs.label = field.label;
    }

    if (field.allowedValues) {
      fs.allowedValues = field.allowedValues;
    }

    if (!field.required) {
      fs.optional = true;
    }

    if (field.unique) {
      fs.unique = true;
    }

    if (field.omit) {
      fs.autoform.omit = true;
    }

    if (field.group) {
      fs.autoform.group = field.group;
    }

    if (field.is_wide) {
      fs.autoform.is_wide = true;
    }

    if (field.hidden) {
      fs.autoform.type = "hidden";
    }

    if (field.type === "select" || field.type === "lookup" || field.type === "master_detail") {
      if (typeof field.filterable === 'undefined') {
        field.filterable = true;
      }
    }

    if (field.name === 'name' || field.is_name) {
      if (typeof field.searchable === 'undefined') {
        field.searchable = true;
      }
    }

    if (autoform_type) {
      fs.autoform.type = autoform_type;
    }

    if (field.defaultValue) {
      if (Meteor.isClient && Creator.Formular.checkFormula(field.defaultValue)) {
        fs.autoform.defaultValue = function () {
          return Creator.Formular.run(field.defaultValue, {
            userId: Meteor.userId(),
            spaceId: Session.get("spaceId")
          });
        };
      } else {
        fs.autoform.defaultValue = field.defaultValue;

        if (!_.isFunction(field.defaultValue)) {
          fs.defaultValue = field.defaultValue;
        }
      }
    }

    if (field.readonly) {
      fs.autoform.readonly = true;
    }

    if (field.disabled) {
      fs.autoform.disabled = true;
    }

    if (field.inlineHelpText) {
      fs.autoform.inlineHelpText = field.inlineHelpText;
    }

    if (field.blackbox) {
      fs.blackbox = true;
    }

    if (Meteor.isProduction) {
      if (field.index) {
        fs.index = field.index;
      } else if (field.sortable) {
        fs.index = true;
      }
    }

    return schema[field_name] = fs;
  });

  return schema;
};

Creator.getFieldDisplayValue = function (object_name, field_name, field_value) {
  var field, html, object;
  html = field_value;
  object = Creator.getObject(object_name);

  if (!object) {
    return "";
  }

  field = object.fields(field_name);

  if (!field) {
    return "";
  }

  if (field.type === "datetime") {
    html = moment(this.val).format('YYYY-MM-DD H:mm');
  } else if (field.type === "date") {
    html = moment(this.val).format('YYYY-MM-DD');
  }

  return html;
};

Creator.checkFieldTypeSupportBetweenQuery = function (field_type) {
  return ["date", "datetime", "currency", "number"].includes(field_type);
};

Creator.pushBetweenBuiltinOptionals = function (field_type, operations) {
  var builtinValues;
  builtinValues = Creator.getBetweenBuiltinValues(field_type);

  if (builtinValues) {
    return _.forEach(builtinValues, function (builtinItem, key) {
      return operations.push({
        label: builtinItem.label,
        value: key
      });
    });
  }
};

Creator.getBetweenBuiltinValues = function (field_type, is_check_only) {
  if (["date", "datetime"].includes(field_type)) {
    return Creator.getBetweenTimeBuiltinValues(is_check_only, field_type);
  }
};

Creator.getBetweenBuiltinValueItem = function (field_type, key) {
  if (["date", "datetime"].includes(field_type)) {
    return Creator.getBetweenTimeBuiltinValueItem(field_type, key);
  }
};

Creator.getBetweenBuiltinOperation = function (field_type, value) {
  var betweenBuiltinValues, result;

  if (!_.isString(value)) {
    return;
  }

  betweenBuiltinValues = Creator.getBetweenBuiltinValues(field_type);

  if (!betweenBuiltinValues) {
    return;
  }

  result = null;

  _.each(betweenBuiltinValues, function (item, operation) {
    if (item.key === value) {
      return result = operation;
    }
  });

  return result;
};

Creator.getBetweenTimeBuiltinValues = function (is_check_only, field_type) {
  return {
    "between_time_last_year": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "last_year"),
    "between_time_this_year": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "this_year"),
    "between_time_next_year": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "next_year"),
    "between_time_last_quarter": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "last_quarter"),
    "between_time_this_quarter": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "this_quarter"),
    "between_time_next_quarter": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "next_quarter"),
    "between_time_last_month": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "last_month"),
    "between_time_this_month": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "this_month"),
    "between_time_next_month": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "next_month"),
    "between_time_last_week": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "last_week"),
    "between_time_this_week": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "this_week"),
    "between_time_next_week": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "next_week"),
    "between_time_yestday": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "yestday"),
    "between_time_today": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "today"),
    "between_time_tomorrow": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "tomorrow"),
    "between_time_last_7_days": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "last_7_days"),
    "between_time_last_30_days": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "last_30_days"),
    "between_time_last_60_days": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "last_60_days"),
    "between_time_last_90_days": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "last_90_days"),
    "between_time_last_120_days": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "last_120_days"),
    "between_time_next_7_days": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "next_7_days"),
    "between_time_next_30_days": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "next_30_days"),
    "between_time_next_60_days": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "next_60_days"),
    "between_time_next_90_days": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "next_90_days"),
    "between_time_next_120_days": is_check_only ? true : Creator.getBetweenTimeBuiltinValueItem(field_type, "next_120_days")
  };
};

Creator.getQuarterStartMonth = function (month) {
  if (!month) {
    month = new Date().getMonth();
  }

  if (month < 3) {
    return 0;
  } else if (month < 6) {
    return 3;
  } else if (month < 9) {
    return 6;
  }

  return 9;
};

Creator.getLastQuarterFirstDay = function (year, month) {
  if (!year) {
    year = new Date().getFullYear();
  }

  if (!month) {
    month = new Date().getMonth();
  }

  if (month < 3) {
    year--;
    month = 9;
  } else if (month < 6) {
    month = 0;
  } else if (month < 9) {
    month = 3;
  } else {
    month = 6;
  }

  return new Date(year, month, 1);
};

Creator.getNextQuarterFirstDay = function (year, month) {
  if (!year) {
    year = new Date().getFullYear();
  }

  if (!month) {
    month = new Date().getMonth();
  }

  if (month < 3) {
    month = 3;
  } else if (month < 6) {
    month = 6;
  } else if (month < 9) {
    month = 9;
  } else {
    year++;
    month = 0;
  }

  return new Date(year, month, 1);
};

Creator.getMonthDays = function (year, month) {
  var days, endDate, millisecond, startDate;

  if (month === 11) {
    return 31;
  }

  millisecond = 1000 * 60 * 60 * 24;
  startDate = new Date(year, month, 1);
  endDate = new Date(year, month + 1, 1);
  days = (endDate - startDate) / millisecond;
  return days;
};

Creator.getLastMonthFirstDay = function (year, month) {
  if (!year) {
    year = new Date().getFullYear();
  }

  if (!month) {
    month = new Date().getMonth();
  }

  if (month === 0) {
    month = 11;
    year--;
    return new Date(year, month, 1);
  }

  month--;
  return new Date(year, month, 1);
};

Creator.getBetweenTimeBuiltinValueItem = function (field_type, key) {
  var currentMonth, currentYear, endValue, firstDay, label, lastDay, lastMonday, lastMonthFinalDay, lastMonthFirstDay, lastQuarterEndDay, lastQuarterStartDay, lastSunday, last_120_days, last_30_days, last_60_days, last_7_days, last_90_days, millisecond, minusDay, monday, month, nextMonday, nextMonthFinalDay, nextMonthFirstDay, nextQuarterEndDay, nextQuarterStartDay, nextSunday, nextYear, next_120_days, next_30_days, next_60_days, next_7_days, next_90_days, now, previousYear, startValue, strEndDay, strFirstDay, strLastDay, strMonday, strStartDay, strSunday, strToday, strTomorrow, strYestday, sunday, thisQuarterEndDay, thisQuarterStartDay, tomorrow, values, week, year, yestday;
  now = new Date();
  millisecond = 1000 * 60 * 60 * 24;
  yestday = new Date(now.getTime() - millisecond);
  tomorrow = new Date(now.getTime() + millisecond);
  week = now.getDay();
  minusDay = week !== 0 ? week - 1 : 6;
  monday = new Date(now.getTime() - minusDay * millisecond);
  sunday = new Date(monday.getTime() + 6 * millisecond);
  lastSunday = new Date(monday.getTime() - millisecond);
  lastMonday = new Date(lastSunday.getTime() - millisecond * 6);
  nextMonday = new Date(sunday.getTime() + millisecond);
  nextSunday = new Date(nextMonday.getTime() + millisecond * 6);
  currentYear = now.getFullYear();
  previousYear = currentYear - 1;
  nextYear = currentYear + 1;
  currentMonth = now.getMonth();
  year = now.getFullYear();
  month = now.getMonth();
  firstDay = new Date(currentYear, currentMonth, 1);

  if (currentMonth === 11) {
    year++;
    month++;
  } else {
    month++;
  }

  nextMonthFirstDay = new Date(year, month, 1);
  nextMonthFinalDay = new Date(year, month, Creator.getMonthDays(year, month));
  lastDay = new Date(nextMonthFirstDay.getTime() - millisecond);
  lastMonthFirstDay = Creator.getLastMonthFirstDay(currentYear, currentMonth);
  lastMonthFinalDay = new Date(firstDay.getTime() - millisecond);
  thisQuarterStartDay = new Date(currentYear, Creator.getQuarterStartMonth(currentMonth), 1);
  thisQuarterEndDay = new Date(currentYear, Creator.getQuarterStartMonth(currentMonth) + 2, Creator.getMonthDays(currentYear, Creator.getQuarterStartMonth(currentMonth) + 2));
  lastQuarterStartDay = Creator.getLastQuarterFirstDay(currentYear, currentMonth);
  lastQuarterEndDay = new Date(lastQuarterStartDay.getFullYear(), lastQuarterStartDay.getMonth() + 2, Creator.getMonthDays(lastQuarterStartDay.getFullYear(), lastQuarterStartDay.getMonth() + 2));
  nextQuarterStartDay = Creator.getNextQuarterFirstDay(currentYear, currentMonth);
  nextQuarterEndDay = new Date(nextQuarterStartDay.getFullYear(), nextQuarterStartDay.getMonth() + 2, Creator.getMonthDays(nextQuarterStartDay.getFullYear(), nextQuarterStartDay.getMonth() + 2));
  last_7_days = new Date(now.getTime() - 6 * millisecond);
  last_30_days = new Date(now.getTime() - 29 * millisecond);
  last_60_days = new Date(now.getTime() - 59 * millisecond);
  last_90_days = new Date(now.getTime() - 89 * millisecond);
  last_120_days = new Date(now.getTime() - 119 * millisecond);
  next_7_days = new Date(now.getTime() + 6 * millisecond);
  next_30_days = new Date(now.getTime() + 29 * millisecond);
  next_60_days = new Date(now.getTime() + 59 * millisecond);
  next_90_days = new Date(now.getTime() + 89 * millisecond);
  next_120_days = new Date(now.getTime() + 119 * millisecond);

  switch (key) {
    case "last_year":
      label = t("creator_filter_operation_between_last_year");
      startValue = new Date(previousYear + "-01-01T00:00:00Z");
      endValue = new Date(previousYear + "-12-31T23:59:59Z");
      break;

    case "this_year":
      label = t("creator_filter_operation_between_this_year");
      startValue = new Date(currentYear + "-01-01T00:00:00Z");
      endValue = new Date(currentYear + "-12-31T23:59:59Z");
      break;

    case "next_year":
      label = t("creator_filter_operation_between_next_year");
      startValue = new Date(nextYear + "-01-01T00:00:00Z");
      endValue = new Date(nextYear + "-12-31T23:59:59Z");
      break;

    case "last_quarter":
      strFirstDay = moment(lastQuarterStartDay).format("YYYY-MM-DD");
      strLastDay = moment(lastQuarterEndDay).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_last_quarter");
      startValue = new Date(strFirstDay + "T00:00:00Z");
      endValue = new Date(strLastDay + "T23:59:59Z");
      break;

    case "this_quarter":
      strFirstDay = moment(thisQuarterStartDay).format("YYYY-MM-DD");
      strLastDay = moment(thisQuarterEndDay).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_this_quarter");
      startValue = new Date(strFirstDay + "T00:00:00Z");
      endValue = new Date(strLastDay + "T23:59:59Z");
      break;

    case "next_quarter":
      strFirstDay = moment(nextQuarterStartDay).format("YYYY-MM-DD");
      strLastDay = moment(nextQuarterEndDay).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_next_quarter");
      startValue = new Date(strFirstDay + "T00:00:00Z");
      endValue = new Date(strLastDay + "T23:59:59Z");
      break;

    case "last_month":
      strFirstDay = moment(lastMonthFirstDay).format("YYYY-MM-DD");
      strLastDay = moment(lastMonthFinalDay).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_last_month");
      startValue = new Date(strFirstDay + "T00:00:00Z");
      endValue = new Date(strLastDay + "T23:59:59Z");
      break;

    case "this_month":
      strFirstDay = moment(firstDay).format("YYYY-MM-DD");
      strLastDay = moment(lastDay).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_this_month");
      startValue = new Date(strFirstDay + "T00:00:00Z");
      endValue = new Date(strLastDay + "T23:59:59Z");
      break;

    case "next_month":
      strFirstDay = moment(nextMonthFirstDay).format("YYYY-MM-DD");
      strLastDay = moment(nextMonthFinalDay).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_next_month");
      startValue = new Date(strFirstDay + "T00:00:00Z");
      endValue = new Date(strLastDay + "T23:59:59Z");
      break;

    case "last_week":
      strMonday = moment(lastMonday).format("YYYY-MM-DD");
      strSunday = moment(lastSunday).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_last_week");
      startValue = new Date(strMonday + "T00:00:00Z");
      endValue = new Date(strSunday + "T23:59:59Z");
      break;

    case "this_week":
      strMonday = moment(monday).format("YYYY-MM-DD");
      strSunday = moment(sunday).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_this_week");
      startValue = new Date(strMonday + "T00:00:00Z");
      endValue = new Date(strSunday + "T23:59:59Z");
      break;

    case "next_week":
      strMonday = moment(nextMonday).format("YYYY-MM-DD");
      strSunday = moment(nextSunday).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_next_week");
      startValue = new Date(strMonday + "T00:00:00Z");
      endValue = new Date(strSunday + "T23:59:59Z");
      break;

    case "yestday":
      strYestday = moment(yestday).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_yestday");
      startValue = new Date(strYestday + "T00:00:00Z");
      endValue = new Date(strYestday + "T23:59:59Z");
      break;

    case "today":
      strToday = moment(now).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_today");
      startValue = new Date(strToday + "T00:00:00Z");
      endValue = new Date(strToday + "T23:59:59Z");
      break;

    case "tomorrow":
      strTomorrow = moment(tomorrow).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_tomorrow");
      startValue = new Date(strTomorrow + "T00:00:00Z");
      endValue = new Date(strTomorrow + "T23:59:59Z");
      break;

    case "last_7_days":
      strStartDay = moment(last_7_days).format("YYYY-MM-DD");
      strEndDay = moment(now).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_last_7_days");
      startValue = new Date(strStartDay + "T00:00:00Z");
      endValue = new Date(strEndDay + "T23:59:59Z");
      break;

    case "last_30_days":
      strStartDay = moment(last_30_days).format("YYYY-MM-DD");
      strEndDay = moment(now).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_last_30_days");
      startValue = new Date(strStartDay + "T00:00:00Z");
      endValue = new Date(strEndDay + "T23:59:59Z");
      break;

    case "last_60_days":
      strStartDay = moment(last_60_days).format("YYYY-MM-DD");
      strEndDay = moment(now).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_last_60_days");
      startValue = new Date(strStartDay + "T00:00:00Z");
      endValue = new Date(strEndDay + "T23:59:59Z");
      break;

    case "last_90_days":
      strStartDay = moment(last_90_days).format("YYYY-MM-DD");
      strEndDay = moment(now).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_last_90_days");
      startValue = new Date(strStartDay + "T00:00:00Z");
      endValue = new Date(strEndDay + "T23:59:59Z");
      break;

    case "last_120_days":
      strStartDay = moment(last_120_days).format("YYYY-MM-DD");
      strEndDay = moment(now).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_last_120_days");
      startValue = new Date(strStartDay + "T00:00:00Z");
      endValue = new Date(strEndDay + "T23:59:59Z");
      break;

    case "next_7_days":
      strStartDay = moment(now).format("YYYY-MM-DD");
      strEndDay = moment(next_7_days).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_next_7_days");
      startValue = new Date(strStartDay + "T00:00:00Z");
      endValue = new Date(strEndDay + "T23:59:59Z");
      break;

    case "next_30_days":
      strStartDay = moment(now).format("YYYY-MM-DD");
      strEndDay = moment(next_30_days).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_next_30_days");
      startValue = new Date(strStartDay + "T00:00:00Z");
      endValue = new Date(strEndDay + "T23:59:59Z");
      break;

    case "next_60_days":
      strStartDay = moment(now).format("YYYY-MM-DD");
      strEndDay = moment(next_60_days).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_next_60_days");
      startValue = new Date(strStartDay + "T00:00:00Z");
      endValue = new Date(strEndDay + "T23:59:59Z");
      break;

    case "next_90_days":
      strStartDay = moment(now).format("YYYY-MM-DD");
      strEndDay = moment(next_90_days).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_next_90_days");
      startValue = new Date(strStartDay + "T00:00:00Z");
      endValue = new Date(strEndDay + "T23:59:59Z");
      break;

    case "next_120_days":
      strStartDay = moment(now).format("YYYY-MM-DD");
      strEndDay = moment(next_120_days).format("YYYY-MM-DD");
      label = t("creator_filter_operation_between_next_120_days");
      startValue = new Date(strStartDay + "T00:00:00Z");
      endValue = new Date(strEndDay + "T23:59:59Z");
  }

  values = [startValue, endValue];

  if (field_type === "datetime") {
    _.forEach(values, function (fv) {
      if (fv) {
        return fv.setHours(fv.getHours() + fv.getTimezoneOffset() / 60);
      }
    });
  }

  return {
    label: label,
    key: key,
    values: values
  };
};

Creator.getFieldDefaultOperation = function (field_type) {
  if (field_type && Creator.checkFieldTypeSupportBetweenQuery(field_type)) {
    return 'between';
  } else if (["textarea", "text", "code"].includes(field_type)) {
    return 'contains';
  } else {
    return "=";
  }
};

Creator.getFieldOperation = function (field_type) {
  var operations, optionals;
  optionals = {
    equal: {
      label: t("creator_filter_operation_equal"),
      value: "="
    },
    unequal: {
      label: t("creator_filter_operation_unequal"),
      value: "<>"
    },
    less_than: {
      label: t("creator_filter_operation_less_than"),
      value: "<"
    },
    greater_than: {
      label: t("creator_filter_operation_greater_than"),
      value: ">"
    },
    less_or_equal: {
      label: t("creator_filter_operation_less_or_equal"),
      value: "<="
    },
    greater_or_equal: {
      label: t("creator_filter_operation_greater_or_equal"),
      value: ">="
    },
    contains: {
      label: t("creator_filter_operation_contains"),
      value: "contains"
    },
    not_contain: {
      label: t("creator_filter_operation_does_not_contain"),
      value: "notcontains"
    },
    starts_with: {
      label: t("creator_filter_operation_starts_with"),
      value: "startswith"
    },
    between: {
      label: t("creator_filter_operation_between"),
      value: "between"
    }
  };

  if (field_type === void 0) {
    return _.values(optionals);
  }

  operations = [];

  if (Creator.checkFieldTypeSupportBetweenQuery(field_type)) {
    operations.push(optionals.between);
    Creator.pushBetweenBuiltinOptionals(field_type, operations);
  } else if (field_type === "text" || field_type === "textarea" || field_type === "html" || field_type === "code") {
    operations.push(optionals.contains);
  } else if (field_type === "lookup" || field_type === "master_detail" || field_type === "select") {
    operations.push(optionals.equal, optionals.unequal);
  } else if (field_type === "currency" || field_type === "number") {
    operations.push(optionals.equal, optionals.unequal, optionals.less_than, optionals.greater_than, optionals.less_or_equal, optionals.greater_or_equal);
  } else if (field_type === "boolean") {
    operations.push(optionals.equal, optionals.unequal);
  } else if (field_type === "checkbox") {
    operations.push(optionals.equal, optionals.unequal);
  } else if (field_type === "[text]") {
    operations.push(optionals.equal, optionals.unequal);
  } else {
    operations.push(optionals.equal, optionals.unequal);
  }

  return operations;
}; /*
       先按照有排序号的小的在前，大的在后
       再将没有排序号的显示在
    */

Creator.getObjectFieldsName = function (object_name) {
  var fields, fieldsArr, fieldsName, ref;
  fields = (ref = Creator.getObject(object_name)) != null ? ref.fields : void 0;
  fieldsArr = [];

  _.each(fields, function (field) {
    return fieldsArr.push({
      name: field.name,
      sort_no: field.sort_no
    });
  });

  fieldsName = [];

  _.each(_.sortBy(fieldsArr, "sort_no"), function (field) {
    return fieldsName.push(field.name);
  });

  return fieldsName;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"triggers.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/lib/triggers.coffee                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var cleanTrigger, initTrigger;
Creator._trigger_hooks = {};

initTrigger = function (object_name, trigger) {
  var collection, error, todoWrapper;

  try {
    collection = Creator.getCollection(object_name);

    if (!trigger.todo) {
      return;
    }

    todoWrapper = function () {
      this.object_name = object_name;
      return trigger.todo.apply(this, arguments);
    };

    if (trigger.when === "before.insert") {
      return collection.before.insert(todoWrapper);
    } else if (trigger.when === "before.update") {
      return collection.before.update(todoWrapper);
    } else if (trigger.when === "before.remove") {
      return collection.before.remove(todoWrapper);
    } else if (trigger.when === "after.insert") {
      return collection.after.insert(todoWrapper);
    } else if (trigger.when === "after.update") {
      return collection.after.update(todoWrapper);
    } else if (trigger.when === "after.remove") {
      return collection.after.remove(todoWrapper);
    }
  } catch (error1) {
    error = error1;
    return console.error('initTrigger error', error);
  }
};

cleanTrigger = function (object_name) {
  /*
     	由于collection-hooks package 的remove函数是使用下标删除对象的，所以此处反转hooks集合后，再删除
     	因为一个数组元素删除后，其他元素的下标会发生变化
   */var ref;
  return (ref = Creator._trigger_hooks[object_name]) != null ? ref.reverse().forEach(function (_hook) {
    return _hook.remove();
  }) : void 0;
};

Creator.initTriggers = function (object_name) {
  var obj;
  obj = Creator.getObject(object_name);
  cleanTrigger(object_name);
  Creator._trigger_hooks[object_name] = [];
  return _.each(obj.triggers, function (trigger, trigger_name) {
    var _trigger_hook;

    if (Meteor.isServer && trigger.on === "server" && trigger.todo && trigger.when) {
      _trigger_hook = initTrigger(object_name, trigger);

      Creator._trigger_hooks[object_name].push(_trigger_hook);
    }

    if (Meteor.isClient && trigger.on === "client" && trigger.todo && trigger.when) {
      _trigger_hook = initTrigger(object_name, trigger);
      return Creator._trigger_hooks[object_name].push(_trigger_hook);
    }
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"permission_sets.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/lib/permission_sets.coffee                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var findOne_permission_object, find_permission_object, unionPlus;

Creator.getPermissions = function (object_name, spaceId, userId) {
  var obj;

  if (Meteor.isClient) {
    if (!object_name) {
      object_name = Session.get("object_name");
    }

    obj = Creator.getObject(object_name);

    if (!obj) {
      return;
    }

    return obj.permissions.get();
  } else if (Meteor.isServer) {
    return Creator.getObjectPermissions(spaceId, userId, object_name);
  }
};

Creator.getRecordPermissions = function (object_name, record, userId, spaceId) {
  var isOwner, permissions, record_company_id, ref, user_company_ids;

  if (!object_name && Meteor.isClient) {
    object_name = Session.get("object_name");
  }

  permissions = _.clone(Creator.getPermissions(object_name));

  if (record) {
    isOwner = record.owner === userId || ((ref = record.owner) != null ? ref._id : void 0) === userId;

    if (Meteor.isClient) {
      user_company_ids = Steedos.getUserCompanyIds();
    } else {
      user_company_ids = Creator.getUserCompanyIds(userId, spaceId);
    }

    record_company_id = record != null ? record.company_id : void 0;

    if (record_company_id && _.isObject(record_company_id) && record_company_id._id) {
      record_company_id = record_company_id._id;
    }

    if (!permissions.modifyAllRecords && !isOwner && !permissions.modifyCompanyRecords) {
      permissions.allowEdit = false;
      permissions.allowDelete = false;
    } else if (permissions.modifyCompanyRecords) {
      if (record_company_id && _.isString(record_company_id)) {
        if (user_company_ids && user_company_ids.length) {
          if (!_.include(user_company_ids, record_company_id)) {
            permissions.allowEdit = false;
            permissions.allowDelete = false;
          }
        } else {
          permissions.allowEdit = false;
          permissions.allowDelete = false;
        }
      }
    }

    if (record.locked && !permissions.modifyAllRecords) {
      permissions.allowEdit = false;
      permissions.allowDelete = false;
    }

    if (!permissions.viewAllRecords && !isOwner && !permissions.viewCompanyRecords) {
      permissions.allowRead = false;
    } else if (permissions.viewCompanyRecords) {
      if (record_company_id && _.isString(record_company_id)) {
        if (user_company_ids && user_company_ids.length) {
          if (!_.include(user_company_ids, record_company_id)) {
            permissions.allowRead = false;
          }
        } else {
          permissions.allowRead = false;
        }
      }
    }
  }

  return permissions;
};

if (Meteor.isServer) {
  Creator.getAllPermissions = function (spaceId, userId) {
    var _i, isOrganizationAdmin, isSpaceAdmin, isWorkflowAdmin, permissions, psets, psetsAdmin, psetsAdmin_pos, psetsCurrent, psetsCurrentNames, psetsCurrent_pos, psetsGuest, psetsGuest_pos, psetsMember, psetsMember_pos, psetsOrganizationAdmin, psetsOrganizationAdmin_pos, psetsUser, psetsUser_pos, psetsWorkflowAdmin, psetsWorkflowAdmin_pos, ref, ref1, set_ids, spaceUser;

    permissions = {
      objects: {},
      assigned_apps: []
    };
    psetsAdmin = Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'admin'
    }, {
      fields: {
        _id: 1,
        assigned_apps: 1
      }
    }) || null;
    psetsUser = Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'user'
    }, {
      fields: {
        _id: 1,
        assigned_apps: 1
      }
    }) || null;
    psetsMember = Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'member'
    }, {
      fields: {
        _id: 1,
        assigned_apps: 1
      }
    }) || null;
    psetsGuest = Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'guest'
    }, {
      fields: {
        _id: 1,
        assigned_apps: 1
      }
    }) || null;
    psetsWorkflowAdmin = Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'workflow_admin'
    }, {
      fields: {
        _id: 1,
        assigned_apps: 1,
        users: 1
      }
    }) || null;
    psetsOrganizationAdmin = Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'organization_admin'
    }, {
      fields: {
        _id: 1,
        assigned_apps: 1,
        users: 1
      }
    }) || null;
    psetsCurrent = Creator.getCollection("permission_set").find({
      users: userId,
      space: spaceId
    }, {
      fields: {
        _id: 1,
        assigned_apps: 1,
        name: 1
      }
    }).fetch();
    psetsAdmin_pos = null;
    psetsUser_pos = null;
    psetsMember_pos = null;
    psetsGuest_pos = null;
    psetsWorkflowAdmin_pos = null;
    psetsOrganizationAdmin_pos = null;
    psetsCurrent_pos = null;

    if (psetsAdmin != null ? psetsAdmin._id : void 0) {
      psetsAdmin_pos = Creator.getCollection("permission_objects").find({
        permission_set_id: psetsAdmin._id
      }, {
        fields: {
          created: 0,
          modified: 0,
          created_by: 0,
          modified_by: 0
        }
      }).fetch();
    }

    if (psetsUser != null ? psetsUser._id : void 0) {
      psetsUser_pos = Creator.getCollection("permission_objects").find({
        permission_set_id: psetsUser._id
      }, {
        fields: {
          created: 0,
          modified: 0,
          created_by: 0,
          modified_by: 0
        }
      }).fetch();
    }

    if (psetsMember != null ? psetsMember._id : void 0) {
      psetsMember_pos = Creator.getCollection("permission_objects").find({
        permission_set_id: psetsMember._id
      }, {
        fields: {
          created: 0,
          modified: 0,
          created_by: 0,
          modified_by: 0
        }
      }).fetch();
    }

    if (psetsGuest != null ? psetsGuest._id : void 0) {
      psetsGuest_pos = Creator.getCollection("permission_objects").find({
        permission_set_id: psetsGuest._id
      }, {
        fields: {
          created: 0,
          modified: 0,
          created_by: 0,
          modified_by: 0
        }
      }).fetch();
    }

    if (psetsWorkflowAdmin != null ? psetsWorkflowAdmin._id : void 0) {
      psetsWorkflowAdmin_pos = Creator.getCollection("permission_objects").find({
        permission_set_id: psetsWorkflowAdmin._id
      }, {
        fields: {
          created: 0,
          modified: 0,
          created_by: 0,
          modified_by: 0
        }
      }).fetch();
    }

    if (psetsOrganizationAdmin != null ? psetsOrganizationAdmin._id : void 0) {
      psetsOrganizationAdmin_pos = Creator.getCollection("permission_objects").find({
        permission_set_id: psetsOrganizationAdmin._id
      }, {
        fields: {
          created: 0,
          modified: 0,
          created_by: 0,
          modified_by: 0
        }
      }).fetch();
    }

    if (psetsCurrent.length > 0) {
      set_ids = _.pluck(psetsCurrent, "_id");
      psetsCurrent_pos = Creator.getCollection("permission_objects").find({
        permission_set_id: {
          $in: set_ids
        }
      }).fetch();
      psetsCurrentNames = _.pluck(psetsCurrent, "name");
    }

    isSpaceAdmin = false;
    spaceUser = null;

    if (userId) {
      isSpaceAdmin = Creator.isSpaceAdmin(spaceId, userId);
      isWorkflowAdmin = psetsWorkflowAdmin != null ? (ref = psetsWorkflowAdmin.users) != null ? ref.includes(userId) : void 0 : void 0;
      isOrganizationAdmin = psetsOrganizationAdmin != null ? (ref1 = psetsOrganizationAdmin.users) != null ? ref1.includes(userId) : void 0 : void 0;
      spaceUser = Creator.getCollection("space_users").findOne({
        space: spaceId,
        user: userId
      }, {
        fields: {
          profile: 1
        }
      });
    }

    psets = {
      psetsAdmin: psetsAdmin,
      psetsUser: psetsUser,
      psetsCurrent: psetsCurrent,
      psetsMember: psetsMember,
      psetsGuest: psetsGuest,
      psetsWorkflowAdmin: psetsWorkflowAdmin,
      psetsOrganizationAdmin: psetsOrganizationAdmin,
      isSpaceAdmin: isSpaceAdmin,
      isWorkflowAdmin: isWorkflowAdmin,
      isOrganizationAdmin: isOrganizationAdmin,
      spaceUser: spaceUser,
      psetsAdmin_pos: psetsAdmin_pos,
      psetsUser_pos: psetsUser_pos,
      psetsMember_pos: psetsMember_pos,
      psetsGuest_pos: psetsGuest_pos,
      psetsWorkflowAdmin_pos: psetsWorkflowAdmin_pos,
      psetsOrganizationAdmin_pos: psetsOrganizationAdmin_pos,
      psetsCurrent_pos: psetsCurrent_pos
    };
    permissions.assigned_apps = Creator.getAssignedApps.bind(psets)(spaceId, userId);
    permissions.assigned_menus = Creator.getAssignedMenus.bind(psets)(spaceId, userId);
    permissions.user_permission_sets = psetsCurrentNames;
    _i = 0;

    _.each(Creator.objectsByName, function (object, object_name) {
      _i++;

      if (!_.has(object, 'space') || !object.space || object.space === spaceId) {
        permissions.objects[object_name] = _.clone(Creator.convertObject(Creator.Objects[object_name]));
        return permissions.objects[object_name]["permissions"] = Creator.getObjectPermissions.bind(psets)(spaceId, userId, object_name);
      }
    });

    return permissions;
  };

  unionPlus = function (array, other) {
    if (!array && !other) {
      return void 0;
    }

    if (!array) {
      array = [];
    }

    if (!other) {
      other = [];
    }

    return _.union(array, other);
  };

  Creator.getAssignedApps = function (spaceId, userId) {
    var apps, isSpaceAdmin, psetBase, psets, psetsAdmin, psetsUser;
    psetsAdmin = this.psetsAdmin || Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'admin'
    }, {
      fields: {
        _id: 1,
        assigned_apps: 1
      }
    });
    psetsUser = this.psetsUser || Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'user'
    }, {
      fields: {
        _id: 1,
        assigned_apps: 1
      }
    });
    psets = this.psetsCurrent || Creator.getCollection("permission_set").find({
      users: userId,
      space: spaceId
    }, {
      fields: {
        _id: 1,
        assigned_apps: 1
      }
    }).fetch();
    isSpaceAdmin = _.isBoolean(this.isSpaceAdmin) ? this.isSpaceAdmin : Creator.isSpaceAdmin(spaceId, userId);
    apps = [];

    if (isSpaceAdmin) {
      return [];
    } else {
      psetBase = psetsUser;

      if (psetBase != null ? psetBase.assigned_apps : void 0) {
        apps = _.union(apps, psetBase.assigned_apps);
      }

      _.each(psets, function (pset) {
        if (!pset.assigned_apps) {
          return;
        }

        if (pset.name === "admin" || pset.name === "user") {
          return;
        }

        return apps = _.union(apps, pset.assigned_apps);
      });

      return _.without(_.uniq(apps), void 0, null);
    }
  };

  Creator.getAssignedMenus = function (spaceId, userId) {
    var aboutMenu, adminMenus, allMenus, currentPsetNames, isSpaceAdmin, menus, otherMenuApps, otherMenus, psets, ref;
    psets = this.psetsCurrent || Creator.getCollection("permission_set").find({
      users: userId,
      space: spaceId
    }, {
      fields: {
        _id: 1,
        name: 1
      }
    }).fetch();
    isSpaceAdmin = _.isBoolean(this.isSpaceAdmin) ? this.isSpaceAdmin : Creator.isSpaceAdmin(spaceId, userId);
    adminMenus = (ref = Creator.Apps.admin) != null ? ref.admin_menus : void 0;

    if (!adminMenus) {
      return [];
    }

    aboutMenu = adminMenus.find(function (n) {
      return n._id === 'about';
    });
    adminMenus = adminMenus.filter(function (n) {
      return n._id !== 'about';
    });
    otherMenuApps = _.sortBy(_.filter(_.values(Creator.Apps), function (n) {
      return n.admin_menus && n._id !== 'admin';
    }), 'sort');
    otherMenus = _.flatten(_.pluck(otherMenuApps, "admin_menus"));
    allMenus = _.union(adminMenus, otherMenus, [aboutMenu]);

    if (isSpaceAdmin) {
      return allMenus;
    } else {
      currentPsetNames = psets.map(function (n) {
        return n.name;
      });
      menus = allMenus.filter(function (menu) {
        var psetsMenu;
        psetsMenu = menu.permission_sets;

        if (psetsMenu && psetsMenu.indexOf("user") > -1) {
          return true;
        }

        return _.intersection(currentPsetNames, psetsMenu).length;
      });
      return menus;
    }
  };

  findOne_permission_object = function (permission_objects, object_name, permission_set_id) {
    if (_.isNull(permission_objects)) {
      return null;
    }

    if (_.isArray(permission_objects)) {
      return _.find(permission_objects, function (po) {
        return po.object_name === object_name;
      });
    }

    return Creator.getCollection("permission_objects").findOne({
      object_name: object_name,
      permission_set_id: permission_set_id
    });
  };

  find_permission_object = function (permission_objects, object_name, permission_set_ids) {
    if (_.isNull(permission_objects)) {
      return null;
    }

    if (_.isArray(permission_objects)) {
      return _.filter(permission_objects, function (po) {
        return po.object_name === object_name;
      });
    }

    return Creator.getCollection("permission_objects").find({
      object_name: object_name,
      permission_set_id: {
        $in: permission_set_ids
      }
    }).fetch();
  };

  Creator.getObjectPermissions = function (spaceId, userId, object_name) {
    var isOrganizationAdmin, isSpaceAdmin, isWorkflowAdmin, object, opsetAdmin, opsetGuest, opsetMember, opsetOrganizationAdmin, opsetUser, opsetWorkflowAdmin, permissions, pos, posAdmin, posGuest, posMember, posOrganizationAdmin, posUser, posWorkflowAdmin, prof, psets, psetsAdmin, psetsAdmin_pos, psetsCurrent_pos, psetsGuest, psetsGuest_pos, psetsMember, psetsMember_pos, psetsOrganizationAdmin, psetsOrganizationAdmin_pos, psetsUser, psetsUser_pos, psetsWorkflowAdmin, psetsWorkflowAdmin_pos, ref, ref1, set_ids, spaceUser;
    permissions = {};
    object = Creator.getObject(object_name, spaceId);

    if (spaceId === 'guest' || object_name === "users") {
      permissions = _.clone(object.permission_set.guest) || {};
      Creator.processPermissions(permissions);
      return permissions;
    }

    psetsAdmin = _.isNull(this.psetsAdmin) || this.psetsAdmin ? this.psetsAdmin : Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'admin'
    }, {
      fields: {
        _id: 1
      }
    });
    psetsUser = _.isNull(this.psetsUser) || this.psetsUser ? this.psetsUser : Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'user'
    }, {
      fields: {
        _id: 1
      }
    });
    psetsMember = _.isNull(this.psetsMember) || this.psetsMember ? this.psetsMember : Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'member'
    }, {
      fields: {
        _id: 1
      }
    });
    psetsGuest = _.isNull(this.psetsGuest) || this.psetsGuest ? this.psetsGuest : Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'guest'
    }, {
      fields: {
        _id: 1
      }
    });
    psetsWorkflowAdmin = _.isNull(this.psetsWorkflowAdmin) || this.psetsWorkflowAdmin ? this.psetsWorkflowAdmin : Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'workflow_admin'
    }, {
      fields: {
        _id: 1,
        users: 1
      }
    });
    psetsOrganizationAdmin = _.isNull(this.psetsOrganizationAdmin) || this.psetsOrganizationAdmin ? this.psetsOrganizationAdmin : Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'organization_admin'
    }, {
      fields: {
        _id: 1,
        users: 1
      }
    });
    psets = this.psetsCurrent || Creator.getCollection("permission_set").find({
      users: userId,
      space: spaceId
    }, {
      fields: {
        _id: 1
      }
    }).fetch();
    isSpaceAdmin = _.isBoolean(this.isSpaceAdmin) ? this.isSpaceAdmin : Creator.isSpaceAdmin(spaceId, userId);
    isWorkflowAdmin = _.isBoolean(this.isWorkflowAdmin) ? this.isWorkflowAdmin : psetsWorkflowAdmin != null ? (ref = psetsWorkflowAdmin.users) != null ? ref.includes(userId) : void 0 : void 0;
    isOrganizationAdmin = _.isBoolean(this.isOrganizationAdmin) ? this.isOrganizationAdmin : psetsOrganizationAdmin != null ? (ref1 = psetsOrganizationAdmin.users) != null ? ref1.includes(userId) : void 0 : void 0;
    psetsAdmin_pos = this.psetsAdmin_pos;
    psetsUser_pos = this.psetsUser_pos;
    psetsMember_pos = this.psetsMember_pos;
    psetsGuest_pos = this.psetsGuest_pos;
    psetsWorkflowAdmin_pos = this.psetsWorkflowAdmin_pos;
    psetsOrganizationAdmin_pos = this.psetsOrganizationAdmin_pos;
    psetsCurrent_pos = this.psetsCurrent_pos;
    opsetAdmin = _.clone(object.permission_set.admin) || {};
    opsetUser = _.clone(object.permission_set.user) || {};
    opsetMember = _.clone(object.permission_set.member) || {};
    opsetGuest = _.clone(object.permission_set.guest) || {};
    opsetWorkflowAdmin = _.clone(object.permission_set.workflow_admin) || {};
    opsetOrganizationAdmin = _.clone(object.permission_set.organization_admin) || {};

    if (psetsAdmin) {
      posAdmin = findOne_permission_object(psetsAdmin_pos, object_name, psetsAdmin._id);

      if (posAdmin) {
        opsetAdmin.allowCreate = posAdmin.allowCreate;
        opsetAdmin.allowDelete = posAdmin.allowDelete;
        opsetAdmin.allowEdit = posAdmin.allowEdit;
        opsetAdmin.allowRead = posAdmin.allowRead;
        opsetAdmin.modifyAllRecords = posAdmin.modifyAllRecords;
        opsetAdmin.viewAllRecords = posAdmin.viewAllRecords;
        opsetAdmin.modifyCompanyRecords = posAdmin.modifyCompanyRecords;
        opsetAdmin.viewCompanyRecords = posAdmin.viewCompanyRecords;
        opsetAdmin.disabled_list_views = posAdmin.disabled_list_views;
        opsetAdmin.disabled_actions = posAdmin.disabled_actions;
        opsetAdmin.unreadable_fields = posAdmin.unreadable_fields;
        opsetAdmin.uneditable_fields = posAdmin.uneditable_fields;
        opsetAdmin.unrelated_objects = posAdmin.unrelated_objects;
      }
    }

    if (psetsUser) {
      posUser = findOne_permission_object(psetsUser_pos, object_name, psetsUser._id);

      if (posUser) {
        opsetUser.allowCreate = posUser.allowCreate;
        opsetUser.allowDelete = posUser.allowDelete;
        opsetUser.allowEdit = posUser.allowEdit;
        opsetUser.allowRead = posUser.allowRead;
        opsetUser.modifyAllRecords = posUser.modifyAllRecords;
        opsetUser.viewAllRecords = posUser.viewAllRecords;
        opsetUser.modifyCompanyRecords = posUser.modifyCompanyRecords;
        opsetUser.viewCompanyRecords = posUser.viewCompanyRecords;
        opsetUser.disabled_list_views = posUser.disabled_list_views;
        opsetUser.disabled_actions = posUser.disabled_actions;
        opsetUser.unreadable_fields = posUser.unreadable_fields;
        opsetUser.uneditable_fields = posUser.uneditable_fields;
        opsetUser.unrelated_objects = posUser.unrelated_objects;
      }
    }

    if (psetsMember) {
      posMember = findOne_permission_object(psetsMember_pos, object_name, psetsMember._id);

      if (posMember) {
        opsetMember.allowCreate = posMember.allowCreate;
        opsetMember.allowDelete = posMember.allowDelete;
        opsetMember.allowEdit = posMember.allowEdit;
        opsetMember.allowRead = posMember.allowRead;
        opsetMember.modifyAllRecords = posMember.modifyAllRecords;
        opsetMember.viewAllRecords = posMember.viewAllRecords;
        opsetMember.modifyCompanyRecords = posMember.modifyCompanyRecords;
        opsetMember.viewCompanyRecords = posMember.viewCompanyRecords;
        opsetMember.disabled_list_views = posMember.disabled_list_views;
        opsetMember.disabled_actions = posMember.disabled_actions;
        opsetMember.unreadable_fields = posMember.unreadable_fields;
        opsetMember.uneditable_fields = posMember.uneditable_fields;
        opsetMember.unrelated_objects = posMember.unrelated_objects;
      }
    }

    if (psetsGuest) {
      posGuest = findOne_permission_object(psetsGuest_pos, object_name, psetsGuest._id);

      if (posGuest) {
        opsetGuest.allowCreate = posGuest.allowCreate;
        opsetGuest.allowDelete = posGuest.allowDelete;
        opsetGuest.allowEdit = posGuest.allowEdit;
        opsetGuest.allowRead = posGuest.allowRead;
        opsetGuest.modifyAllRecords = posGuest.modifyAllRecords;
        opsetGuest.viewAllRecords = posGuest.viewAllRecords;
        opsetGuest.modifyCompanyRecords = posGuest.modifyCompanyRecords;
        opsetGuest.viewCompanyRecords = posGuest.viewCompanyRecords;
        opsetGuest.disabled_list_views = posGuest.disabled_list_views;
        opsetGuest.disabled_actions = posGuest.disabled_actions;
        opsetGuest.unreadable_fields = posGuest.unreadable_fields;
        opsetGuest.uneditable_fields = posGuest.uneditable_fields;
        opsetGuest.unrelated_objects = posGuest.unrelated_objects;
      }
    }

    if (psetsWorkflowAdmin) {
      posWorkflowAdmin = findOne_permission_object(psetsWorkflowAdmin_pos, object_name, psetsWorkflowAdmin._id);

      if (posWorkflowAdmin) {
        opsetWorkflowAdmin.allowCreate = posWorkflowAdmin.allowCreate;
        opsetWorkflowAdmin.allowDelete = posWorkflowAdmin.allowDelete;
        opsetWorkflowAdmin.allowEdit = posWorkflowAdmin.allowEdit;
        opsetWorkflowAdmin.allowRead = posWorkflowAdmin.allowRead;
        opsetWorkflowAdmin.modifyAllRecords = posWorkflowAdmin.modifyAllRecords;
        opsetWorkflowAdmin.viewAllRecords = posWorkflowAdmin.viewAllRecords;
        opsetWorkflowAdmin.modifyCompanyRecords = posWorkflowAdmin.modifyCompanyRecords;
        opsetWorkflowAdmin.viewCompanyRecords = posWorkflowAdmin.viewCompanyRecords;
        opsetWorkflowAdmin.disabled_list_views = posWorkflowAdmin.disabled_list_views;
        opsetWorkflowAdmin.disabled_actions = posWorkflowAdmin.disabled_actions;
        opsetWorkflowAdmin.unreadable_fields = posWorkflowAdmin.unreadable_fields;
        opsetWorkflowAdmin.uneditable_fields = posWorkflowAdmin.uneditable_fields;
        opsetWorkflowAdmin.unrelated_objects = posWorkflowAdmin.unrelated_objects;
      }
    }

    if (psetsOrganizationAdmin) {
      posOrganizationAdmin = findOne_permission_object(psetsOrganizationAdmin_pos, object_name, psetsOrganizationAdmin._id);

      if (posOrganizationAdmin) {
        opsetOrganizationAdmin.allowCreate = posOrganizationAdmin.allowCreate;
        opsetOrganizationAdmin.allowDelete = posOrganizationAdmin.allowDelete;
        opsetOrganizationAdmin.allowEdit = posOrganizationAdmin.allowEdit;
        opsetOrganizationAdmin.allowRead = posOrganizationAdmin.allowRead;
        opsetOrganizationAdmin.modifyAllRecords = posOrganizationAdmin.modifyAllRecords;
        opsetOrganizationAdmin.viewAllRecords = posOrganizationAdmin.viewAllRecords;
        opsetOrganizationAdmin.modifyCompanyRecords = posOrganizationAdmin.modifyCompanyRecords;
        opsetOrganizationAdmin.viewCompanyRecords = posOrganizationAdmin.viewCompanyRecords;
        opsetOrganizationAdmin.disabled_list_views = posOrganizationAdmin.disabled_list_views;
        opsetOrganizationAdmin.disabled_actions = posOrganizationAdmin.disabled_actions;
        opsetOrganizationAdmin.unreadable_fields = posOrganizationAdmin.unreadable_fields;
        opsetOrganizationAdmin.uneditable_fields = posOrganizationAdmin.uneditable_fields;
        opsetOrganizationAdmin.unrelated_objects = posOrganizationAdmin.unrelated_objects;
      }
    }

    if (!userId) {
      permissions = opsetAdmin;
    } else {
      if (isSpaceAdmin) {
        permissions = opsetAdmin;
      } else {
        if (spaceId === 'common') {
          permissions = opsetUser;
        } else {
          spaceUser = _.isNull(this.spaceUser) || this.spaceUser ? this.spaceUser : Creator.getCollection("space_users").findOne({
            space: spaceId,
            user: userId
          }, {
            fields: {
              profile: 1
            }
          });

          if (spaceUser) {
            prof = spaceUser.profile;

            if (prof) {
              if (prof === 'user') {
                permissions = opsetUser;
              } else if (prof === 'member') {
                permissions = opsetMember;
              } else if (prof === 'guest') {
                permissions = opsetGuest;
              }
            } else {
              permissions = opsetUser;
            }
          } else {
            permissions = opsetGuest;
          }
        }
      }
    }

    if (psets.length > 0) {
      set_ids = _.pluck(psets, "_id");
      pos = find_permission_object(psetsCurrent_pos, object_name, set_ids);

      _.each(pos, function (po) {
        if (po.permission_set_id === (psetsAdmin != null ? psetsAdmin._id : void 0) || po.permission_set_id === (psetsUser != null ? psetsUser._id : void 0) || po.permission_set_id === (psetsMember != null ? psetsMember._id : void 0) || po.permission_set_id === (psetsGuest != null ? psetsGuest._id : void 0) || po.permission_set_id === (psetsWorkflowAdmin != null ? psetsWorkflowAdmin._id : void 0) || po.permission_set_id === (psetsOrganizationAdmin != null ? psetsOrganizationAdmin._id : void 0)) {
          return;
        }

        if (po.allowRead) {
          permissions.allowRead = true;
        }

        if (po.allowCreate) {
          permissions.allowCreate = true;
        }

        if (po.allowEdit) {
          permissions.allowEdit = true;
        }

        if (po.allowDelete) {
          permissions.allowDelete = true;
        }

        if (po.modifyAllRecords) {
          permissions.modifyAllRecords = true;
        }

        if (po.viewAllRecords) {
          permissions.viewAllRecords = true;
        }

        if (po.modifyCompanyRecords) {
          permissions.modifyCompanyRecords = true;
        }

        if (po.viewCompanyRecords) {
          permissions.viewCompanyRecords = true;
        }

        permissions.disabled_list_views = unionPlus(permissions.disabled_list_views, po.disabled_list_views);
        permissions.disabled_actions = unionPlus(permissions.disabled_actions, po.disabled_actions);
        permissions.unreadable_fields = unionPlus(permissions.unreadable_fields, po.unreadable_fields);
        permissions.uneditable_fields = unionPlus(permissions.uneditable_fields, po.uneditable_fields);
        return permissions.unrelated_objects = unionPlus(permissions.unrelated_objects, po.unrelated_objects);
      });

      if (isWorkflowAdmin) {
        if (opsetWorkflowAdmin.allowRead) {
          permissions.allowRead = true;
        }

        if (opsetWorkflowAdmin.allowCreate) {
          permissions.allowCreate = true;
        }

        if (opsetWorkflowAdmin.allowEdit) {
          permissions.allowEdit = true;
        }

        if (opsetWorkflowAdmin.allowDelete) {
          permissions.allowDelete = true;
        }

        if (opsetWorkflowAdmin.modifyAllRecords) {
          permissions.modifyAllRecords = true;
        }

        if (opsetWorkflowAdmin.viewAllRecords) {
          permissions.viewAllRecords = true;
        }

        if (opsetWorkflowAdmin.modifyCompanyRecords) {
          permissions.modifyCompanyRecords = true;
        }

        if (opsetWorkflowAdmin.viewCompanyRecords) {
          permissions.viewCompanyRecords = true;
        }

        permissions.disabled_list_views = unionPlus(permissions.disabled_list_views, opsetWorkflowAdmin.disabled_list_views);
        permissions.disabled_actions = unionPlus(permissions.disabled_actions, opsetWorkflowAdmin.disabled_actions);
        permissions.unreadable_fields = unionPlus(permissions.unreadable_fields, opsetWorkflowAdmin.unreadable_fields);
        permissions.uneditable_fields = unionPlus(permissions.uneditable_fields, opsetWorkflowAdmin.uneditable_fields);
        permissions.unrelated_objects = unionPlus(permissions.unrelated_objects, opsetWorkflowAdmin.unrelated_objects);
      }

      if (isOrganizationAdmin) {
        if (opsetOrganizationAdmin.allowRead) {
          permissions.allowRead = true;
        }

        if (opsetOrganizationAdmin.allowCreate) {
          permissions.allowCreate = true;
        }

        if (opsetOrganizationAdmin.allowEdit) {
          permissions.allowEdit = true;
        }

        if (opsetOrganizationAdmin.allowDelete) {
          permissions.allowDelete = true;
        }

        if (opsetOrganizationAdmin.modifyAllRecords) {
          permissions.modifyAllRecords = true;
        }

        if (opsetOrganizationAdmin.viewAllRecords) {
          permissions.viewAllRecords = true;
        }

        if (opsetOrganizationAdmin.modifyCompanyRecords) {
          permissions.modifyCompanyRecords = true;
        }

        if (opsetOrganizationAdmin.viewCompanyRecords) {
          permissions.viewCompanyRecords = true;
        }

        permissions.disabled_list_views = unionPlus(permissions.disabled_list_views, opsetOrganizationAdmin.disabled_list_views);
        permissions.disabled_actions = unionPlus(permissions.disabled_actions, opsetOrganizationAdmin.disabled_actions);
        permissions.unreadable_fields = unionPlus(permissions.unreadable_fields, opsetOrganizationAdmin.unreadable_fields);
        permissions.uneditable_fields = unionPlus(permissions.uneditable_fields, opsetOrganizationAdmin.uneditable_fields);
        permissions.unrelated_objects = unionPlus(permissions.unrelated_objects, opsetOrganizationAdmin.unrelated_objects);
      }
    }

    if (object.is_view) {
      permissions.allowCreate = false;
      permissions.allowEdit = false;
      permissions.allowDelete = false;
      permissions.modifyAllRecords = false;
      permissions.modifyCompanyRecords = false;
      permissions.disabled_actions = [];
    }

    Creator.processPermissions(permissions);
    return permissions;
  };

  Meteor.methods({
    "creator.object_permissions": function (spaceId) {
      return Creator.getAllPermissions(spaceId, this.userId);
    }
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"collections.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/lib/collections.coffee                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  var creator_db_url, oplog_url;

  if (Meteor.isServer) {
    creator_db_url = process.env.MONGO_URL_CREATOR;
    oplog_url = process.env.MONGO_OPLOG_URL_CREATOR;

    if (creator_db_url) {
      if (!oplog_url) {
        throw new Meteor.Error(500, "Please configure environment variables: MONGO_OPLOG_URL_CREATOR");
      }

      return Creator._CREATOR_DATASOURCE = {
        _driver: new MongoInternals.RemoteCollectionDriver(creator_db_url, {
          oplogUrl: oplog_url
        })
      };
    }
  }
});

Creator.createCollection = function (object) {
  var collection_key;
  collection_key = object.name;

  if (object.space) {
    collection_key = "c_" + object.space + "_" + object.name;
  }

  if (db[collection_key]) {
    return db[collection_key];
  } else if (object.db) {
    return object.db;
  }

  if (Creator.Collections[collection_key]) {
    return Creator.Collections[collection_key];
  } else {
    if (object.custom) {
      return new Meteor.Collection(collection_key, Creator._CREATOR_DATASOURCE);
    } else {
      return new Meteor.Collection(collection_key);
    }
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"actions.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/lib/actions.coffee                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Creator.actionsByName = {};

if (Meteor.isClient) {
  Creator.actions = function (actions) {
    return _.each(actions, function (todo, action_name) {
      return Creator.actionsByName[action_name] = todo;
    });
  };

  Creator.executeAction = function (object_name, action, record_id, item_element, list_view_id, record) {
    var moreArgs, obj, todo, todoArgs;
    obj = Creator.getObject(object_name);

    if (action != null ? action.todo : void 0) {
      if (typeof action.todo === "string") {
        todo = Creator.actionsByName[action.todo];
      } else if (typeof action.todo === "function") {
        todo = action.todo;
      }

      if (!record && object_name && record_id) {
        record = Creator.odata.get(object_name, record_id);
      }

      if (todo) {
        item_element = item_element ? item_element : "";
        moreArgs = Array.prototype.slice.call(arguments, 3);
        todoArgs = [object_name, record_id].concat(moreArgs);
        return todo.apply({
          object_name: object_name,
          record_id: record_id,
          object: obj,
          action: action,
          item_element: item_element,
          record: record
        }, todoArgs);
      }
    }
  };

  Creator.actions({
    "standard_query": function () {
      return Modal.show("standard_query_modal");
    },
    "standard_new": function (object_name, record_id, fields) {
      var doc, ids;
      ids = Creator.TabularSelectedIds[object_name];

      if (ids != null ? ids.length : void 0) {
        record_id = ids[0];
        doc = Creator.odata.get(object_name, record_id);
        Session.set('cmDoc', doc);
        Session.set('cmShowAgainDuplicated', true);
      }

      Meteor.defer(function () {
        return $(".creator-add").click();
      });
    },
    "standard_open_view": function (object_name, record_id, fields) {
      var href;
      href = Creator.getObjectUrl(object_name, record_id);
      window.open(href, '_blank', 'width=800, height=600, left=50, top= 50, toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes');
      return false;
    },
    "standard_open_view": function (object_name, record_id, fields) {
      var href;
      href = Creator.getObjectUrl(object_name, record_id);
      window.open(href, '_blank', 'width=800, height=600, left=50, top= 50, toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes');
      return false;
    },
    "standard_edit": function (object_name, record_id, fields) {
      if (record_id) {
        if (Steedos.isMobile() && false) {
          Session.set('action_object_name', object_name);
          Session.set('action_record_id', record_id);

          if (this.record) {
            Session.set('cmDoc', this.record);
          }

          return Meteor.defer(function () {
            return $(".btn-edit-record").click();
          });
        } else {
          Session.set('action_object_name', object_name);
          Session.set('action_record_id', record_id);

          if (this.record) {
            Session.set('cmDoc', this.record);
            return Meteor.defer(function () {
              return $(".btn.creator-edit").click();
            });
          }
        }
      }
    },
    "standard_delete": function (object_name, record_id, record_title, list_view_id, call_back) {
      var object, text;
      console.log("standard_delete", object_name, record_id, record_title, list_view_id);
      object = Creator.getObject(object_name);

      if (!_.isString(record_title) && (record_title != null ? record_title.name : void 0)) {
        record_title = record_title != null ? record_title.name : void 0;
      }

      if (record_title) {
        text = "是否确定要删除此" + object.label + "\"" + record_title + "\"";
      } else {
        text = "是否确定要删除此" + object.label;
      }

      return swal({
        title: "删除" + object.label,
        text: "<div class='delete-creator-warning'>" + text + "？</div>",
        html: true,
        showCancelButton: true,
        confirmButtonText: t('Delete'),
        cancelButtonText: t('Cancel')
      }, function (option) {
        if (option) {
          return Creator.odata["delete"](object_name, record_id, function () {
            var appid, dxDataGridInstance, gridContainer, gridObjectNameClass, info, isOpenerRemove;

            if (record_title) {
              info = object.label + ("\"" + record_title + "\"") + "已删除";
            } else {
              info = "删除成功";
            }

            toastr.success(info);
            gridObjectNameClass = object_name.replace(/\./g, "-");
            gridContainer = $(".gridContainer." + gridObjectNameClass);

            if (!(gridContainer != null ? gridContainer.length : void 0)) {
              if (window.opener) {
                isOpenerRemove = true;
                gridContainer = window.opener.$(".gridContainer." + gridObjectNameClass);
              }
            }

            if (gridContainer != null ? gridContainer.length : void 0) {
              if (object.enable_tree) {
                dxDataGridInstance = gridContainer.dxTreeList().dxTreeList('instance');
              } else {
                dxDataGridInstance = gridContainer.dxDataGrid().dxDataGrid('instance');
              }
            }

            if (dxDataGridInstance) {
              if (object.enable_tree) {
                dxDataGridInstance.refresh();
              } else {
                Template.creator_grid.refresh(dxDataGridInstance);
              }
            }

            if (isOpenerRemove || !dxDataGridInstance) {
              if (isOpenerRemove) {
                window.close();
              } else if (record_id === Session.get("record_id") && !Steedos.isMobile() && list_view_id !== 'calendar') {
                appid = Session.get("app_id");

                if (!list_view_id) {
                  list_view_id = Session.get("list_view_id");
                }

                if (!list_view_id) {
                  list_view_id = "all";
                }

                FlowRouter.go("/app/" + appid + "/" + object_name + "/grid/" + list_view_id);
              }
            }

            if (call_back && typeof call_back === "function") {
              return call_back();
            }
          });
        }
      });
    }
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".i18n.json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:objects/i18n/en.i18n.json.js");
require("/node_modules/meteor/steedos:objects/i18n/zh-CN.i18n.json.js");
require("/node_modules/meteor/steedos:objects/core.coffee");
require("/node_modules/meteor/steedos:objects/loadStandardObjects.coffee");
require("/node_modules/meteor/steedos:objects/coreSupport.coffee");
require("/node_modules/meteor/steedos:objects/server/methods/object_options.coffee");
require("/node_modules/meteor/steedos:objects/lib/listviews.coffee");
require("/node_modules/meteor/steedos:objects/lib/add_simple_schema_validation_error.coffee");
require("/node_modules/meteor/steedos:objects/lib/field_simple_schema_validation_error.coffee");
require("/node_modules/meteor/steedos:objects/lib/eval.js");
require("/node_modules/meteor/steedos:objects/lib/convert.coffee");
require("/node_modules/meteor/steedos:objects/lib/formular.coffee");
require("/node_modules/meteor/steedos:objects/lib/object.coffee");
require("/node_modules/meteor/steedos:objects/lib/fields.coffee");
require("/node_modules/meteor/steedos:objects/lib/triggers.coffee");
require("/node_modules/meteor/steedos:objects/lib/permission_sets.coffee");
require("/node_modules/meteor/steedos:objects/lib/collections.coffee");
require("/node_modules/meteor/steedos:objects/lib/actions.coffee");
require("/node_modules/meteor/steedos:objects/server/routes/api_workflow_view_instance.coffee");

/* Exports */
Package._define("steedos:objects");

})();

//# sourceURL=meteor://💻app/packages/steedos_objects.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJSZXBvcnRzIiwic3VicyIsInN0ZWVkb3NTY2hlbWEiLCJlIiwic3RlZWRvc0NvcmUiLCJyZXF1aXJlIiwiTWV0ZW9yIiwiaXNEZXZlbG9wbWVudCIsInN0YXJ0dXAiLCJleCIsImluaXQiLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJGaWJlciIsInBhdGgiLCJkZXBzIiwiYXBwIiwiVHJhY2tlciIsIkRlcGVuZGVuY3kiLCJvYmplY3QiLCJfVEVNUExBVEUiLCJTaW1wbGVTY2hlbWEiLCJleHRlbmRPcHRpb25zIiwiZmlsdGVyc0Z1bmN0aW9uIiwiTWF0Y2giLCJPcHRpb25hbCIsIk9uZU9mIiwiRnVuY3Rpb24iLCJTdHJpbmciLCJvcHRpb25zRnVuY3Rpb24iLCJjcmVhdGVGdW5jdGlvbiIsImlzU2VydmVyIiwiZmliZXJMb2FkT2JqZWN0cyIsIm9iaiIsIm9iamVjdF9uYW1lIiwibG9hZE9iamVjdHMiLCJydW4iLCJuYW1lIiwibGlzdF92aWV3cyIsInNwYWNlIiwiY29udmVydE9iamVjdCIsIk9iamVjdCIsImluaXRUcmlnZ2VycyIsImluaXRMaXN0Vmlld3MiLCJnZXRPYmplY3ROYW1lIiwiZ2V0T2JqZWN0Iiwic3BhY2VfaWQiLCJyZWYiLCJyZWYxIiwiXyIsImlzQXJyYXkiLCJpc0NsaWVudCIsImRlcGVuZCIsIlNlc3Npb24iLCJnZXQiLCJzdGFydHNXaXRoIiwib2JqZWN0c0J5TmFtZSIsImZpbmQiLCJvIiwiX2NvbGxlY3Rpb25fbmFtZSIsImdldE9iamVjdEJ5SWQiLCJvYmplY3RfaWQiLCJmaW5kV2hlcmUiLCJfaWQiLCJyZW1vdmVPYmplY3QiLCJnZXRDb2xsZWN0aW9uIiwic3BhY2VJZCIsInJlbW92ZUNvbGxlY3Rpb24iLCJpc1NwYWNlQWRtaW4iLCJ1c2VySWQiLCJmaW5kT25lIiwiYWRtaW5zIiwiaW5kZXhPZiIsImV2YWx1YXRlRm9ybXVsYSIsImZvcm11bGFyIiwiY29udGV4dCIsIm9wdGlvbnMiLCJpc1N0cmluZyIsIkZvcm11bGFyIiwiY2hlY2tGb3JtdWxhIiwiZXZhbHVhdGVGaWx0ZXJzIiwiZmlsdGVycyIsInNlbGVjdG9yIiwiZWFjaCIsImZpbHRlciIsImFjdGlvbiIsInZhbHVlIiwibGVuZ3RoIiwiaXNDb21tb25TcGFjZSIsImdldE9yZGVybHlTZXRCeUlkcyIsImRvY3MiLCJpZHMiLCJpZF9rZXkiLCJoaXRfZmlyc3QiLCJ2YWx1ZXMiLCJnZXRQcm9wZXJ0eSIsInNvcnRCeSIsImRvYyIsIl9pbmRleCIsInNvcnRpbmdNZXRob2QiLCJ2YWx1ZTEiLCJ2YWx1ZTIiLCJpc1ZhbHVlMUVtcHR5IiwiaXNWYWx1ZTJFbXB0eSIsImxvY2FsZSIsImtleSIsIkRhdGUiLCJnZXRUaW1lIiwiU3RlZWRvcyIsInRvU3RyaW5nIiwibG9jYWxlQ29tcGFyZSIsImdldE9iamVjdFJlbGF0ZWRzIiwiX29iamVjdCIsInBlcm1pc3Npb25zIiwicmVsYXRlZF9vYmplY3RzIiwiZW5hYmxlX2ZpbGVzIiwicHVzaCIsImZvcmVpZ25fa2V5IiwicmVsYXRlZF9vYmplY3QiLCJyZWxhdGVkX29iamVjdF9uYW1lIiwiZmllbGRzIiwicmVsYXRlZF9maWVsZCIsInJlbGF0ZWRfZmllbGRfbmFtZSIsInR5cGUiLCJyZWZlcmVuY2VfdG8iLCJzcGxpY2UiLCJlbmFibGVfdGFza3MiLCJlbmFibGVfbm90ZXMiLCJlbmFibGVfZXZlbnRzIiwiZW5hYmxlX2luc3RhbmNlcyIsImdldFBlcm1pc3Npb25zIiwiZW5hYmxlX2F1ZGl0IiwibW9kaWZ5QWxsUmVjb3JkcyIsImdldFVzZXJDb250ZXh0IiwiaXNVblNhZmVNb2RlIiwiVVNFUl9DT05URVhUIiwic3BhY2VfdXNlcl9vcmciLCJzdSIsInN1RmllbGRzIiwiRXJyb3IiLCJtb2JpbGUiLCJwb3NpdGlvbiIsImVtYWlsIiwiY29tcGFueSIsIm9yZ2FuaXphdGlvbiIsImNvbXBhbnlfaWQiLCJjb21wYW55X2lkcyIsInVzZXIiLCJmdWxsbmFtZSIsImdldFJlbGF0aXZlVXJsIiwidXJsIiwidGVzdCIsIl9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18iLCJST09UX1VSTF9QQVRIX1BSRUZJWCIsImdldFVzZXJDb21wYW55SWQiLCJnZXRVc2VyQ29tcGFueUlkcyIsInByb2Nlc3NQZXJtaXNzaW9ucyIsInBvIiwiYWxsb3dDcmVhdGUiLCJhbGxvd1JlYWQiLCJhbGxvd0VkaXQiLCJhbGxvd0RlbGV0ZSIsInZpZXdBbGxSZWNvcmRzIiwidmlld0NvbXBhbnlSZWNvcmRzIiwibW9kaWZ5Q29tcGFueVJlY29yZHMiLCJwcm9jZXNzIiwiZW52IiwiU1RFRURPU19TVE9SQUdFX0RJUiIsInN0ZWVkb3NTdG9yYWdlRGlyIiwicmVzb2x2ZSIsImpvaW4iLCJfX21ldGVvcl9ib290c3RyYXBfXyIsInNlcnZlckRpciIsIm1ldGhvZHMiLCJjb2xsZWN0aW9uIiwibmFtZV9maWVsZF9rZXkiLCJvcHRpb25zX2xpbWl0IiwicXVlcnkiLCJxdWVyeV9vcHRpb25zIiwicmVjb3JkcyIsInJlc3VsdHMiLCJzZWFyY2hUZXh0UXVlcnkiLCJzZWxlY3RlZCIsInNvcnQiLCJwYXJhbXMiLCJOQU1FX0ZJRUxEX0tFWSIsInNlYXJjaFRleHQiLCIkcmVnZXgiLCIkb3IiLCIkaW4iLCJleHRlbmQiLCIkbmluIiwiZmlsdGVyUXVlcnkiLCJsaW1pdCIsImlzT2JqZWN0IiwiZmV0Y2giLCJyZWNvcmQiLCJsYWJlbCIsIm1lc3NhZ2UiLCJKU09OIiwic3RyaW5naWZ5IiwiSnNvblJvdXRlcyIsImFkZCIsInJlcSIsInJlcyIsIm5leHQiLCJib3giLCJjdXJyZW50X3VzZXJfaWQiLCJjdXJyZW50X3VzZXJfaW5mbyIsImZsb3dJZCIsImhhc2hEYXRhIiwiaW5zIiwiaW5zSWQiLCJyZWNvcmRfaWQiLCJyZWRpcmVjdF91cmwiLCJyZWYyIiwid29ya2Zsb3dVcmwiLCJ4X2F1dGhfdG9rZW4iLCJ4X3VzZXJfaWQiLCJ1dWZsb3dNYW5hZ2VyIiwiY2hlY2tfYXV0aG9yaXphdGlvbiIsImJvZHkiLCJjaGVjayIsImluc3RhbmNlSWQiLCJzZXR0aW5ncyIsIndlYnNlcnZpY2VzIiwid29ya2Zsb3ciLCJmbG93IiwiaW5ib3hfdXNlcnMiLCJpbmNsdWRlcyIsImNjX3VzZXJzIiwib3V0Ym94X3VzZXJzIiwic3RhdGUiLCJzdWJtaXR0ZXIiLCJhcHBsaWNhbnQiLCJwZXJtaXNzaW9uTWFuYWdlciIsImdldEZsb3dQZXJtaXNzaW9ucyIsInNwYWNlcyIsInNlbmRSZXN1bHQiLCJjb2RlIiwiZGF0YSIsInVwZGF0ZSIsIiRwdWxsIiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwicmVhc29uIiwiZ2V0SW5pdFdpZHRoUGVyY2VudCIsImNvbHVtbnMiLCJfc2NoZW1hIiwiY29sdW1uX251bSIsImluaXRfd2lkdGhfcGVyY2VudCIsImdldFNjaGVtYSIsImZpZWxkX25hbWUiLCJmaWVsZCIsImlzX3dpZGUiLCJwaWNrIiwiYXV0b2Zvcm0iLCJnZXRGaWVsZElzV2lkZSIsImdldFRhYnVsYXJPcmRlciIsImxpc3Rfdmlld19pZCIsInNldHRpbmciLCJtYXAiLCJjb2x1bW4iLCJoaWRkZW4iLCJjb21wYWN0Iiwib3JkZXIiLCJpbmRleCIsImRlZmF1bHRfZXh0cmFfY29sdW1ucyIsImV4dHJhX2NvbHVtbnMiLCJnZXRPYmplY3REZWZhdWx0Q29sdW1ucyIsImdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMiLCJ1bmlvbiIsImdldE9iamVjdERlZmF1bHRTb3J0IiwiVGFidWxhclNlbGVjdGVkSWRzIiwiY29udmVydExpc3RWaWV3IiwiZGVmYXVsdF9jb2x1bWVucyIsImxpc3RfdmlldyIsImxpc3Rfdmlld19uYW1lIiwib2l0ZW0iLCJjbG9uZSIsImhhcyIsImZpbHRlcl9zY29wZSIsInBhcnNlIiwiZm9yRWFjaCIsImlzRnVuY3Rpb24iLCJfdmFsdWUiLCJnZXRSZWxhdGVkTGlzdCIsImxpc3QiLCJnZXRSZWxhdGVkT2JqZWN0cyIsInJlbGF0ZWRfb2JqZWN0X2l0ZW0iLCJyZWxhdGVkIiwidGFidWxhcl9vcmRlciIsIndpdGhvdXQiLCJ0cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyIiwicmVwbGFjZSIsImlzX2ZpbGUiLCJnZXRPYmplY3RGaXJzdExpc3RWaWV3IiwiZmlyc3QiLCJnZXRMaXN0Vmlld3MiLCJnZXRMaXN0VmlldyIsImV4YWMiLCJsaXN0Vmlld3MiLCJnZXRMaXN0Vmlld0lzUmVjZW50IiwibGlzdFZpZXciLCJnZXRPYmplY3REZWZhdWx0VmlldyIsImRlZmF1bHRWaWV3IiwiaXNBbGxWaWV3IiwiaXNSZWNlbnRWaWV3IiwidGFidWxhckNvbHVtbnMiLCJ0YWJ1bGFyX3NvcnQiLCJpdGVtIiwiY29sdW1uX2luZGV4IiwidHJhbnNmb3JtU29ydFRvRFgiLCJkeF9zb3J0IiwiUmVnRXgiLCJSZWdFeHAiLCJfcmVnRXhNZXNzYWdlcyIsIl9nbG9iYWxNZXNzYWdlcyIsInJlZ0V4IiwiZXhwIiwibXNnIiwibWVzc2FnZXMiLCJldmFsSW5Db250ZXh0IiwianMiLCJldmFsIiwiY2FsbCIsImdldE9wdGlvbiIsIm9wdGlvbiIsImZvbyIsInNwbGl0IiwidHJpZ2dlcnMiLCJ0cmlnZ2VyIiwiX3RvZG8iLCJfdG9kb19mcm9tX2NvZGUiLCJfdG9kb19mcm9tX2RiIiwib24iLCJ0b2RvIiwiYWN0aW9ucyIsIl92aXNpYmxlIiwiZXJyb3IxIiwiYWN0aW9uc0J5TmFtZSIsInZpc2libGUiLCJfb3B0aW9ucyIsIl90eXBlIiwiYmVmb3JlT3BlbkZ1bmN0aW9uIiwiZGVmYXVsdFZhbHVlIiwiaXNfY29tcGFueV9saW1pdGVkIiwiX29wdGlvbiIsInYiLCJrIiwiX3JlZ0V4IiwiTnVtYmVyIiwiQm9vbGVhbiIsIl9vcHRpb25zRnVuY3Rpb24iLCJfcmVmZXJlbmNlX3RvIiwiX2NyZWF0ZUZ1bmN0aW9uIiwiX2JlZm9yZU9wZW5GdW5jdGlvbiIsIl9maWx0ZXJzRnVuY3Rpb24iLCJfZGVmYXVsdFZhbHVlIiwiX2lzX2NvbXBhbnlfbGltaXRlZCIsIl9maWx0ZXJzIiwiaXNEYXRlIiwicG9wIiwiX2lzX2RhdGUiLCJQUkVGSVgiLCJfcHJlcGVuZFByZWZpeEZvckZvcm11bGEiLCJwcmVmaXgiLCJmaWVsZFZhcmlhYmxlIiwicmVnIiwicmV2IiwibSIsIiQxIiwiZm9ybXVsYV9zdHIiLCJfQ09OVEVYVCIsIl9WQUxVRVMiLCJpc0Jvb2xlYW4iLCJ0b2FzdHIiLCJmb3JtYXRPYmplY3ROYW1lIiwiX2RiIiwiZGVmYXVsdENvbHVtbnMiLCJkZWZhdWx0TGlzdFZpZXdJZCIsImRpc2FibGVkX2xpc3Rfdmlld3MiLCJyZWYzIiwic2NoZW1hIiwic2VsZiIsImljb24iLCJkZXNjcmlwdGlvbiIsImlzX3ZpZXciLCJpc19lbmFibGUiLCJlbmFibGVfc2VhcmNoIiwiZW5hYmxlX2FwaSIsImN1c3RvbSIsImVuYWJsZV9zaGFyZSIsImVuYWJsZV90cmVlIiwib3Blbl93aW5kb3ciLCJmaWx0ZXJfY29tcGFueSIsImNhbGVuZGFyIiwic2lkZWJhciIsImVuYWJsZV9jaGF0dGVyIiwiZW5hYmxlX3RyYXNoIiwiZW5hYmxlX3NwYWNlX2dsb2JhbCIsImlkRmllbGROYW1lIiwiZGF0YWJhc2VfbmFtZSIsImlzX25hbWUiLCJwcmltYXJ5IiwiYmFzZU9iamVjdCIsIml0ZW1fbmFtZSIsImNvcHlJdGVtIiwicGVybWlzc2lvbl9zZXQiLCJhZG1pbiIsImFsbCIsImxpc3Rfdmlld19pdGVtIiwiUmVhY3RpdmVWYXIiLCJ1bnJlYWRhYmxlX2ZpZWxkcyIsInVuZWRpdGFibGVfZmllbGRzIiwicmVhZG9ubHkiLCJkaXNhYmxlZCIsInJlcXVpcmVkIiwiY3JlYXRlQ29sbGVjdGlvbiIsIl9uYW1lIiwiZ2V0T2JqZWN0U2NoZW1hIiwiY29udGFpbnMiLCJhdHRhY2hTY2hlbWEiLCJfc2ltcGxlU2NoZW1hIiwicHJvdG90eXBlIiwiaTE4biIsInQiLCJma2V5IiwiaTE4bl9rZXkiLCJnZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCIsImF1dG9ydW4iLCJib290c3RyYXBMb2FkZWQiLCJmaWVsZHNBcnIiLCJfcmVmX29iaiIsImF1dG9mb3JtX3R5cGUiLCJmcyIsImlzVW5MaW1pdGVkIiwibXVsdGlwbGUiLCJyb3dzIiwibGFuZ3VhZ2UiLCJpc01vYmlsZSIsImlzUGFkIiwiYWZGaWVsZElucHV0IiwiZGF0ZU1vYmlsZU9wdGlvbnMiLCJvdXRGb3JtYXQiLCJ0aW1lem9uZUlkIiwiZHhEYXRlQm94T3B0aW9ucyIsImRpc3BsYXlGb3JtYXQiLCJoZWlnaHQiLCJkaWFsb2dzSW5Cb2R5IiwidG9vbGJhciIsImZvbnROYW1lcyIsImRlcGVuZE9uIiwiZGVwZW5kX29uIiwiY3JlYXRlIiwibG9va3VwX2ZpZWxkIiwiTW9kYWwiLCJzaG93IiwiZm9ybUlkIiwib3BlcmF0aW9uIiwib25TdWNjZXNzIiwicmVzdWx0IiwiYWRkSXRlbXMiLCJyZWZlcmVuY2Vfc29ydCIsIm9wdGlvbnNTb3J0IiwicmVmZXJlbmNlX2xpbWl0Iiwib3B0aW9uc0xpbWl0Iiwib21pdCIsImluY2x1ZGUiLCJibGFja2JveCIsIm9iamVjdFN3aXRjaGUiLCJvcHRpb25zTWV0aG9kIiwib3B0aW9uc01ldGhvZFBhcmFtcyIsInJlZmVyZW5jZXMiLCJfcmVmZXJlbmNlIiwibGluayIsImRlZmF1bHRJY29uIiwic2hvd0ljb24iLCJmaXJzdE9wdGlvbiIsInByZWNpc2lvbiIsInNjYWxlIiwiZGVjaW1hbCIsIkFycmF5IiwiZWRpdGFibGUiLCJhY2NlcHQiLCJzeXN0ZW0iLCJFbWFpbCIsImFsbG93ZWRWYWx1ZXMiLCJvcHRpb25hbCIsInVuaXF1ZSIsImdyb3VwIiwiZmlsdGVyYWJsZSIsInNlYXJjaGFibGUiLCJpbmxpbmVIZWxwVGV4dCIsImlzUHJvZHVjdGlvbiIsInNvcnRhYmxlIiwiZ2V0RmllbGREaXNwbGF5VmFsdWUiLCJmaWVsZF92YWx1ZSIsImh0bWwiLCJtb21lbnQiLCJ2YWwiLCJmb3JtYXQiLCJjaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkiLCJmaWVsZF90eXBlIiwicHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzIiwib3BlcmF0aW9ucyIsImJ1aWx0aW5WYWx1ZXMiLCJnZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyIsImJ1aWx0aW5JdGVtIiwiaXNfY2hlY2tfb25seSIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyIsImdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtIiwiZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtIiwiZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24iLCJiZXR3ZWVuQnVpbHRpblZhbHVlcyIsImdldFF1YXJ0ZXJTdGFydE1vbnRoIiwibW9udGgiLCJnZXRNb250aCIsImdldExhc3RRdWFydGVyRmlyc3REYXkiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJnZXROZXh0UXVhcnRlckZpcnN0RGF5IiwiZ2V0TW9udGhEYXlzIiwiZGF5cyIsImVuZERhdGUiLCJtaWxsaXNlY29uZCIsInN0YXJ0RGF0ZSIsImdldExhc3RNb250aEZpcnN0RGF5IiwiY3VycmVudE1vbnRoIiwiY3VycmVudFllYXIiLCJlbmRWYWx1ZSIsImZpcnN0RGF5IiwibGFzdERheSIsImxhc3RNb25kYXkiLCJsYXN0TW9udGhGaW5hbERheSIsImxhc3RNb250aEZpcnN0RGF5IiwibGFzdFF1YXJ0ZXJFbmREYXkiLCJsYXN0UXVhcnRlclN0YXJ0RGF5IiwibGFzdFN1bmRheSIsImxhc3RfMTIwX2RheXMiLCJsYXN0XzMwX2RheXMiLCJsYXN0XzYwX2RheXMiLCJsYXN0XzdfZGF5cyIsImxhc3RfOTBfZGF5cyIsIm1pbnVzRGF5IiwibW9uZGF5IiwibmV4dE1vbmRheSIsIm5leHRNb250aEZpbmFsRGF5IiwibmV4dE1vbnRoRmlyc3REYXkiLCJuZXh0UXVhcnRlckVuZERheSIsIm5leHRRdWFydGVyU3RhcnREYXkiLCJuZXh0U3VuZGF5IiwibmV4dFllYXIiLCJuZXh0XzEyMF9kYXlzIiwibmV4dF8zMF9kYXlzIiwibmV4dF82MF9kYXlzIiwibmV4dF83X2RheXMiLCJuZXh0XzkwX2RheXMiLCJub3ciLCJwcmV2aW91c1llYXIiLCJzdGFydFZhbHVlIiwic3RyRW5kRGF5Iiwic3RyRmlyc3REYXkiLCJzdHJMYXN0RGF5Iiwic3RyTW9uZGF5Iiwic3RyU3RhcnREYXkiLCJzdHJTdW5kYXkiLCJzdHJUb2RheSIsInN0clRvbW9ycm93Iiwic3RyWWVzdGRheSIsInN1bmRheSIsInRoaXNRdWFydGVyRW5kRGF5IiwidGhpc1F1YXJ0ZXJTdGFydERheSIsInRvbW9ycm93Iiwid2VlayIsInllc3RkYXkiLCJnZXREYXkiLCJmdiIsInNldEhvdXJzIiwiZ2V0SG91cnMiLCJnZXRUaW1lem9uZU9mZnNldCIsImdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiIsImdldEZpZWxkT3BlcmF0aW9uIiwib3B0aW9uYWxzIiwiZXF1YWwiLCJ1bmVxdWFsIiwibGVzc190aGFuIiwiZ3JlYXRlcl90aGFuIiwibGVzc19vcl9lcXVhbCIsImdyZWF0ZXJfb3JfZXF1YWwiLCJub3RfY29udGFpbiIsInN0YXJ0c193aXRoIiwiYmV0d2VlbiIsImdldE9iamVjdEZpZWxkc05hbWUiLCJmaWVsZHNOYW1lIiwic29ydF9ubyIsImNsZWFuVHJpZ2dlciIsImluaXRUcmlnZ2VyIiwiX3RyaWdnZXJfaG9va3MiLCJ0b2RvV3JhcHBlciIsImFwcGx5IiwiYXJndW1lbnRzIiwid2hlbiIsImJlZm9yZSIsImluc2VydCIsInJlbW92ZSIsImFmdGVyIiwicmV2ZXJzZSIsIl9ob29rIiwidHJpZ2dlcl9uYW1lIiwiX3RyaWdnZXJfaG9vayIsImZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QiLCJmaW5kX3Blcm1pc3Npb25fb2JqZWN0IiwidW5pb25QbHVzIiwiZ2V0T2JqZWN0UGVybWlzc2lvbnMiLCJnZXRSZWNvcmRQZXJtaXNzaW9ucyIsImlzT3duZXIiLCJyZWNvcmRfY29tcGFueV9pZCIsInVzZXJfY29tcGFueV9pZHMiLCJvd25lciIsImxvY2tlZCIsImdldEFsbFBlcm1pc3Npb25zIiwiX2kiLCJpc09yZ2FuaXphdGlvbkFkbWluIiwiaXNXb3JrZmxvd0FkbWluIiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNBZG1pbl9wb3MiLCJwc2V0c0N1cnJlbnQiLCJwc2V0c0N1cnJlbnROYW1lcyIsInBzZXRzQ3VycmVudF9wb3MiLCJwc2V0c0d1ZXN0IiwicHNldHNHdWVzdF9wb3MiLCJwc2V0c01lbWJlciIsInBzZXRzTWVtYmVyX3BvcyIsInBzZXRzT3JnYW5pemF0aW9uQWRtaW4iLCJwc2V0c09yZ2FuaXphdGlvbkFkbWluX3BvcyIsInBzZXRzVXNlciIsInBzZXRzVXNlcl9wb3MiLCJwc2V0c1dvcmtmbG93QWRtaW4iLCJwc2V0c1dvcmtmbG93QWRtaW5fcG9zIiwic2V0X2lkcyIsInNwYWNlVXNlciIsIm9iamVjdHMiLCJhc3NpZ25lZF9hcHBzIiwidXNlcnMiLCJwZXJtaXNzaW9uX3NldF9pZCIsImNyZWF0ZWQiLCJtb2RpZmllZCIsImNyZWF0ZWRfYnkiLCJtb2RpZmllZF9ieSIsInBsdWNrIiwicHJvZmlsZSIsImdldEFzc2lnbmVkQXBwcyIsImJpbmQiLCJhc3NpZ25lZF9tZW51cyIsImdldEFzc2lnbmVkTWVudXMiLCJ1c2VyX3Blcm1pc3Npb25fc2V0cyIsImFycmF5Iiwib3RoZXIiLCJhcHBzIiwicHNldEJhc2UiLCJwc2V0IiwidW5pcSIsImFib3V0TWVudSIsImFkbWluTWVudXMiLCJhbGxNZW51cyIsImN1cnJlbnRQc2V0TmFtZXMiLCJtZW51cyIsIm90aGVyTWVudUFwcHMiLCJvdGhlck1lbnVzIiwiYWRtaW5fbWVudXMiLCJuIiwiZmxhdHRlbiIsIm1lbnUiLCJwc2V0c01lbnUiLCJwZXJtaXNzaW9uX3NldHMiLCJpbnRlcnNlY3Rpb24iLCJwZXJtaXNzaW9uX29iamVjdHMiLCJpc051bGwiLCJwZXJtaXNzaW9uX3NldF9pZHMiLCJvcHNldEFkbWluIiwib3BzZXRHdWVzdCIsIm9wc2V0TWVtYmVyIiwib3BzZXRPcmdhbml6YXRpb25BZG1pbiIsIm9wc2V0VXNlciIsIm9wc2V0V29ya2Zsb3dBZG1pbiIsInBvcyIsInBvc0FkbWluIiwicG9zR3Vlc3QiLCJwb3NNZW1iZXIiLCJwb3NPcmdhbml6YXRpb25BZG1pbiIsInBvc1VzZXIiLCJwb3NXb3JrZmxvd0FkbWluIiwicHJvZiIsImd1ZXN0IiwibWVtYmVyIiwid29ya2Zsb3dfYWRtaW4iLCJvcmdhbml6YXRpb25fYWRtaW4iLCJkaXNhYmxlZF9hY3Rpb25zIiwidW5yZWxhdGVkX29iamVjdHMiLCJjcmVhdG9yX2RiX3VybCIsIm9wbG9nX3VybCIsIk1PTkdPX1VSTF9DUkVBVE9SIiwiTU9OR09fT1BMT0dfVVJMX0NSRUFUT1IiLCJfQ1JFQVRPUl9EQVRBU09VUkNFIiwiX2RyaXZlciIsIk1vbmdvSW50ZXJuYWxzIiwiUmVtb3RlQ29sbGVjdGlvbkRyaXZlciIsIm9wbG9nVXJsIiwiY29sbGVjdGlvbl9rZXkiLCJDb2xsZWN0aW9uIiwiYWN0aW9uX25hbWUiLCJleGVjdXRlQWN0aW9uIiwiaXRlbV9lbGVtZW50IiwibW9yZUFyZ3MiLCJ0b2RvQXJncyIsIm9kYXRhIiwic2xpY2UiLCJjb25jYXQiLCJzZXQiLCJkZWZlciIsIiQiLCJjbGljayIsImhyZWYiLCJnZXRPYmplY3RVcmwiLCJ3aW5kb3ciLCJvcGVuIiwicmVjb3JkX3RpdGxlIiwiY2FsbF9iYWNrIiwidGV4dCIsInN3YWwiLCJ0aXRsZSIsInNob3dDYW5jZWxCdXR0b24iLCJjb25maXJtQnV0dG9uVGV4dCIsImNhbmNlbEJ1dHRvblRleHQiLCJhcHBpZCIsImR4RGF0YUdyaWRJbnN0YW5jZSIsImdyaWRDb250YWluZXIiLCJncmlkT2JqZWN0TmFtZUNsYXNzIiwiaW5mbyIsImlzT3BlbmVyUmVtb3ZlIiwic3VjY2VzcyIsIm9wZW5lciIsImR4VHJlZUxpc3QiLCJkeERhdGFHcmlkIiwicmVmcmVzaCIsIlRlbXBs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TSxZQUFQO0FBQ0NBLGlDQUFlOU0sUUFBUUMsR0FBUixDQUFZLGNBQVosQ0FBZjtBQ01POztBRExSLHFCQUFPNk0sWUFBUDtBQUNDQSxpQ0FBZSxLQUFmO0FDT087O0FETlIyZSwyQkFBV0MsRUFBWCxDQUFjLFVBQVFmLEtBQVIsR0FBYyxHQUFkLEdBQWlCOXJCLFdBQWpCLEdBQTZCLFFBQTdCLEdBQXFDaU8sWUFBbkQ7QUFURjtBQ2tCTTs7QURSTixnQkFBR3NkLGFBQWMsT0FBT0EsU0FBUCxLQUFvQixVQUFyQztBQ1VPLHFCRFROQSxXQ1NNO0FBQ0Q7QUQ1Q1AsWUNGSTtBQWdERDtBRHZETixRQ0ZHO0FEaEVKO0FBQUEsR0FGRDtBQytIQSxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJAZGIgPSB7fVxyXG5pZiAhQ3JlYXRvcj9cclxuXHRAQ3JlYXRvciA9IHt9XHJcbkNyZWF0b3IuT2JqZWN0cyA9IHt9XHJcbkNyZWF0b3IuQ29sbGVjdGlvbnMgPSB7fVxyXG5DcmVhdG9yLk1lbnVzID0gW11cclxuQ3JlYXRvci5BcHBzID0ge31cclxuQ3JlYXRvci5SZXBvcnRzID0ge31cclxuQ3JlYXRvci5zdWJzID0ge31cclxuQ3JlYXRvci5zdGVlZG9zU2NoZW1hID0ge30iLCJ0aGlzLmRiID0ge307XG5cbmlmICh0eXBlb2YgQ3JlYXRvciA9PT0gXCJ1bmRlZmluZWRcIiB8fCBDcmVhdG9yID09PSBudWxsKSB7XG4gIHRoaXMuQ3JlYXRvciA9IHt9O1xufVxuXG5DcmVhdG9yLk9iamVjdHMgPSB7fTtcblxuQ3JlYXRvci5Db2xsZWN0aW9ucyA9IHt9O1xuXG5DcmVhdG9yLk1lbnVzID0gW107XG5cbkNyZWF0b3IuQXBwcyA9IHt9O1xuXG5DcmVhdG9yLlJlcG9ydHMgPSB7fTtcblxuQ3JlYXRvci5zdWJzID0ge307XG5cbkNyZWF0b3Iuc3RlZWRvc1NjaGVtYSA9IHt9O1xuIiwidHJ5XHJcblx0c3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJylcclxuXHRpZiBNZXRlb3IuaXNEZXZlbG9wbWVudFxyXG5cdFx0TWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRcdFx0dHJ5XHJcblx0XHRcdFx0c3RlZWRvc0NvcmUuaW5pdCgpXHJcblx0XHRcdGNhdGNoIGV4XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXgpXHJcbmNhdGNoIGVcclxuXHRjb25zb2xlLmxvZyhlKSIsInZhciBlLCBzdGVlZG9zQ29yZTtcblxudHJ5IHtcbiAgc3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJyk7XG4gIGlmIChNZXRlb3IuaXNEZXZlbG9wbWVudCkge1xuICAgIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGV4O1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHN0ZWVkb3NDb3JlLmluaXQoKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGV4ID0gZXJyb3I7XG4gICAgICAgIHJldHVybiBjb25zb2xlLmxvZyhleCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0gY2F0Y2ggKGVycm9yKSB7XG4gIGUgPSBlcnJvcjtcbiAgY29uc29sZS5sb2coZSk7XG59XG4iLCJDcmVhdG9yLmRlcHMgPSB7XHJcblx0YXBwOiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XHJcblx0b2JqZWN0OiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XHJcbn07XHJcblxyXG5DcmVhdG9yLl9URU1QTEFURSA9IHtcclxuXHRBcHBzOiB7fSxcclxuXHRPYmplY3RzOiB7fVxyXG59XHJcblxyXG5NZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtmaWx0ZXJzRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXHJcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe29wdGlvbnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpfSlcclxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7Y3JlYXRlRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXHJcblxyXG4jIENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyDkvptzdGVlZG9zLWNsaemhueebruS9v+eUqFxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpXHJcblx0Q3JlYXRvci5maWJlckxvYWRPYmplY3RzID0gKG9iaiwgb2JqZWN0X25hbWUpLT5cclxuXHRcdEZpYmVyKCgpLT5cclxuXHRcdFx0Q3JlYXRvci5sb2FkT2JqZWN0cyhvYmosIG9iamVjdF9uYW1lKVxyXG5cdFx0KS5ydW4oKVxyXG5cclxuQ3JlYXRvci5sb2FkT2JqZWN0cyA9IChvYmosIG9iamVjdF9uYW1lKS0+XHJcblx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRvYmplY3RfbmFtZSA9IG9iai5uYW1lXHJcblxyXG5cdGlmICFvYmoubGlzdF92aWV3c1xyXG5cdFx0b2JqLmxpc3Rfdmlld3MgPSB7fVxyXG5cclxuXHRpZiBvYmouc3BhY2VcclxuXHRcdG9iamVjdF9uYW1lID0gJ2NfJyArIG9iai5zcGFjZSArICdfJyArIG9iai5uYW1lXHJcblxyXG5cdENyZWF0b3IuY29udmVydE9iamVjdChvYmopXHJcblx0bmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XHJcblxyXG5cdENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKVxyXG5cdENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSlcclxuXHRyZXR1cm4gb2JqXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSAob2JqZWN0KSAtPlxyXG5cdGlmIG9iamVjdC5zcGFjZVxyXG5cdFx0cmV0dXJuIFwiY18je29iamVjdC5zcGFjZX1fI3tvYmplY3QubmFtZX1cIlxyXG5cdHJldHVybiBvYmplY3QubmFtZVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3QgPSAob2JqZWN0X25hbWUsIHNwYWNlX2lkKS0+XHJcblx0aWYgXy5pc0FycmF5KG9iamVjdF9uYW1lKVxyXG5cdFx0cmV0dXJuIDtcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdENyZWF0b3IuZGVwcz8ub2JqZWN0Py5kZXBlbmQoKVxyXG5cdGlmICFvYmplY3RfbmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRpZiAhc3BhY2VfaWQgJiYgb2JqZWN0X25hbWVcclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY18nKVxyXG5cdFx0XHRzcGFjZV9pZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxyXG5cclxuXHRpZiBvYmplY3RfbmFtZVxyXG5cdFx0aWYgc3BhY2VfaWRcclxuXHRcdFx0b2JqID0gQ3JlYXRvci5vYmplY3RzQnlOYW1lW1wiY18je3NwYWNlX2lkfV8je29iamVjdF9uYW1lfVwiXVxyXG5cdFx0XHRpZiBvYmpcclxuXHRcdFx0XHRyZXR1cm4gb2JqXHJcblxyXG5cdFx0b2JqID0gXy5maW5kIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG8pLT5cclxuXHRcdFx0XHRyZXR1cm4gby5fY29sbGVjdGlvbl9uYW1lID09IG9iamVjdF9uYW1lXHJcblx0XHRpZiBvYmpcclxuXHRcdFx0cmV0dXJuIG9ialxyXG5cclxuXHRcdHJldHVybiBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdEJ5SWQgPSAob2JqZWN0X2lkKS0+XHJcblx0cmV0dXJuIF8uZmluZFdoZXJlKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwge19pZDogb2JqZWN0X2lkfSlcclxuXHJcbkNyZWF0b3IucmVtb3ZlT2JqZWN0ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0Y29uc29sZS5sb2coXCJyZW1vdmVPYmplY3RcIiwgb2JqZWN0X25hbWUpXHJcblx0ZGVsZXRlIENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cclxuXHRkZWxldGUgQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXVxyXG5cclxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkKS0+XHJcblx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRpZiBvYmplY3RfbmFtZVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpPy5fY29sbGVjdGlvbl9uYW1lXVxyXG5cclxuQ3JlYXRvci5yZW1vdmVDb2xsZWN0aW9uID0gKG9iamVjdF9uYW1lKS0+XHJcblx0ZGVsZXRlIENyZWF0b3IuQ29sbGVjdGlvbnNbb2JqZWN0X25hbWVdXHJcblxyXG5DcmVhdG9yLmlzU3BhY2VBZG1pbiA9IChzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblxyXG5cdHNwYWNlID0gQ3JlYXRvci5nZXRPYmplY3QoXCJzcGFjZXNcIik/LmRiPy5maW5kT25lKHNwYWNlSWQpXHJcblx0aWYgc3BhY2U/LmFkbWluc1xyXG5cdFx0cmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMFxyXG5cclxuXHJcbkNyZWF0b3IuZXZhbHVhdGVGb3JtdWxhID0gKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKS0+XHJcblxyXG5cdGlmICFfLmlzU3RyaW5nKGZvcm11bGFyKVxyXG5cdFx0cmV0dXJuIGZvcm11bGFyXHJcblxyXG5cdGlmIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKVxyXG5cclxuXHRyZXR1cm4gZm9ybXVsYXJcclxuXHJcbkNyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzID0gKGZpbHRlcnMsIGNvbnRleHQpLT5cclxuXHRzZWxlY3RvciA9IHt9XHJcblx0Xy5lYWNoIGZpbHRlcnMsIChmaWx0ZXIpLT5cclxuXHRcdGlmIGZpbHRlcj8ubGVuZ3RoID09IDNcclxuXHRcdFx0bmFtZSA9IGZpbHRlclswXVxyXG5cdFx0XHRhY3Rpb24gPSBmaWx0ZXJbMV1cclxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIGNvbnRleHQpXHJcblx0XHRcdHNlbGVjdG9yW25hbWVdID0ge31cclxuXHRcdFx0c2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlXHJcblx0Y29uc29sZS5sb2coXCJldmFsdWF0ZUZpbHRlcnMtLT5zZWxlY3RvclwiLCBzZWxlY3RvcilcclxuXHRyZXR1cm4gc2VsZWN0b3JcclxuXHJcbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IChzcGFjZUlkKSAtPlxyXG5cdHJldHVybiBzcGFjZUlkID09ICdjb21tb24nXHJcblxyXG4jIyNcclxuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXHJcblx0aWRz77yaX2lk6ZuG5ZCIXHJcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcclxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXHJcbiMjI1xyXG5DcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyA9IChkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KS0+XHJcblxyXG5cdGlmICFpZF9rZXlcclxuXHRcdGlkX2tleSA9IFwiX2lkXCJcclxuXHJcblx0aWYgaGl0X2ZpcnN0XHJcblxyXG5cdFx0I+eUseS6juS4jeiDveS9v+eUqF8uZmluZEluZGV45Ye95pWw77yM5Zug5q2k5q2k5aSE5YWI5bCG5a+56LGh5pWw57uE6L2s5Li65pmu6YCa5pWw57uE57G75Z6L77yM5Zyo6I635Y+W5YW2aW5kZXhcclxuXHRcdHZhbHVlcyA9IGRvY3MuZ2V0UHJvcGVydHkoaWRfa2V5KVxyXG5cclxuXHRcdHJldHVyblx0Xy5zb3J0QnkgZG9jcywgKGRvYyktPlxyXG5cdFx0XHRcdFx0X2luZGV4ID0gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pXHJcblx0XHRcdFx0XHRpZiBfaW5kZXggPiAtMVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2luZGV4XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuXHRfLnNvcnRCeSBkb2NzLCAoZG9jKS0+XHJcblx0XHRcdHJldHVybiBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSlcclxuXHJcbiMjI1xyXG5cdOaMieeUqOaIt+aJgOWxnuacrOWcsOWMluivreiogOi/m+ihjOaOkuW6j++8jOaUr+aMgeS4reaWh+OAgeaVsOWAvOOAgeaXpeacn+etieWtl+auteaOkuW6j1xyXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xyXG4jIyNcclxuQ3JlYXRvci5zb3J0aW5nTWV0aG9kID0gKHZhbHVlMSwgdmFsdWUyKSAtPlxyXG5cdGlmIHRoaXMua2V5XHJcblx0XHR2YWx1ZTEgPSB2YWx1ZTFbdGhpcy5rZXldXHJcblx0XHR2YWx1ZTIgPSB2YWx1ZTJbdGhpcy5rZXldXHJcblx0aWYgdmFsdWUxIGluc3RhbmNlb2YgRGF0ZVxyXG5cdFx0dmFsdWUxID0gdmFsdWUxLmdldFRpbWUoKVxyXG5cdGlmIHZhbHVlMiBpbnN0YW5jZW9mIERhdGVcclxuXHRcdHZhbHVlMiA9IHZhbHVlMi5nZXRUaW1lKClcclxuXHRpZiB0eXBlb2YgdmFsdWUxIGlzIFwibnVtYmVyXCIgYW5kIHR5cGVvZiB2YWx1ZTIgaXMgXCJudW1iZXJcIlxyXG5cdFx0cmV0dXJuIHZhbHVlMSAtIHZhbHVlMlxyXG5cdCMgSGFuZGxpbmcgbnVsbCB2YWx1ZXNcclxuXHRpc1ZhbHVlMUVtcHR5ID0gdmFsdWUxID09IG51bGwgb3IgdmFsdWUxID09IHVuZGVmaW5lZFxyXG5cdGlzVmFsdWUyRW1wdHkgPSB2YWx1ZTIgPT0gbnVsbCBvciB2YWx1ZTIgPT0gdW5kZWZpbmVkXHJcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgIWlzVmFsdWUyRW1wdHlcclxuXHRcdHJldHVybiAtMVxyXG5cdGlmIGlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcclxuXHRcdHJldHVybiAwXHJcblx0aWYgIWlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcclxuXHRcdHJldHVybiAxXHJcblx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxyXG5cdHJldHVybiB2YWx1ZTEudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlIHZhbHVlMi50b1N0cmluZygpLCBsb2NhbGVcclxuXHJcblxyXG4jIOivpeWHveaVsOWPquWcqOWIneWni+WMlk9iamVjdOaXtu+8jOaKiuebuOWFs+WvueixoeeahOiuoeeul+e7k+aenOS/neWtmOWIsE9iamVjdOeahHJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4re+8jOWQjue7reWPr+S7peebtOaOpeS7jnJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4reWPluW+l+iuoeeul+e7k+aenOiAjOS4jeeUqOWGjeasoeiwg+eUqOivpeWHveaVsOadpeiuoeeul1xyXG5DcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzID0gKG9iamVjdF9uYW1lKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IFtdXHJcblx0IyBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0IyDlm6BDcmVhdG9yLmdldE9iamVjdOWHveaVsOWGhemDqOimgeiwg+eUqOivpeWHveaVsO+8jOaJgOS7pei/memHjOS4jeWPr+S7peiwg+eUqENyZWF0b3IuZ2V0T2JqZWN05Y+W5a+56LGh77yM5Y+q6IO96LCD55SoQ3JlYXRvci5PYmplY3Rz5p2l5Y+W5a+56LGhXHJcblx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cclxuXHRpZiAhX29iamVjdFxyXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xyXG5cclxuXHRpZiBfb2JqZWN0LmVuYWJsZV9maWxlc1xyXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiY21zX2ZpbGVzXCIsIGZvcmVpZ25fa2V5OiBcInBhcmVudFwifVxyXG5cclxuXHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cclxuXHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cclxuXHRcdFx0aWYgcmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWVcclxuXHRcdFx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwib2JqZWN0X2ZpZWxkc1wiXHJcblx0XHRcdFx0XHQjVE9ETyDlvoXnm7jlhbPliJfooajmlK/mjIHmjpLluo/lkI7vvIzliKDpmaTmraTliKTmlq1cclxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5zcGxpY2UoMCwgMCwge29iamVjdF9uYW1lOnJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWV9KVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpyZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lfVxyXG5cclxuXHRpZiBfb2JqZWN0LmVuYWJsZV90YXNrc1xyXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwidGFza3NcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxyXG5cdGlmIF9vYmplY3QuZW5hYmxlX25vdGVzXHJcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJub3Rlc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XHJcblx0aWYgX29iamVjdC5lbmFibGVfZXZlbnRzXHJcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJldmVudHNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxyXG5cdGlmIF9vYmplY3QuZW5hYmxlX2luc3RhbmNlc1xyXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiaW5zdGFuY2VzXCIsIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIn1cclxuXHQjcmVjb3JkIOivpue7huS4i+eahGF1ZGl0X3JlY29yZHPku4Vtb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5Y+v6KeBXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpXHJcblx0XHRpZiBfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cclxuXHJcblx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xyXG5cclxuQ3JlYXRvci5nZXRVc2VyQ29udGV4dCA9ICh1c2VySWQsIHNwYWNlSWQsIGlzVW5TYWZlTW9kZSktPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0cmV0dXJuIENyZWF0b3IuVVNFUl9DT05URVhUXHJcblx0ZWxzZVxyXG5cdFx0aWYgISh1c2VySWQgYW5kIHNwYWNlSWQpXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcInRoZSBwYXJhbXMgdXNlcklkIGFuZCBzcGFjZUlkIGlzIHJlcXVpcmVkIGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRVc2VyQ29udGV4dFwiXHJcblx0XHRcdHJldHVybiBudWxsXHJcblx0XHRzdUZpZWxkcyA9IHtuYW1lOiAxLCBtb2JpbGU6IDEsIHBvc2l0aW9uOiAxLCBlbWFpbDogMSwgY29tcGFueTogMSwgb3JnYW5pemF0aW9uOiAxLCBzcGFjZTogMSwgY29tcGFueV9pZDogMSwgY29tcGFueV9pZHM6IDF9XHJcblx0XHQjIGNoZWNrIGlmIHVzZXIgaW4gdGhlIHNwYWNlXHJcblx0XHRzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczogc3VGaWVsZHN9KVxyXG5cdFx0aWYgIXN1XHJcblx0XHRcdHNwYWNlSWQgPSBudWxsXHJcblxyXG5cdFx0IyBpZiBzcGFjZUlkIG5vdCBleGlzdHMsIGdldCB0aGUgZmlyc3Qgb25lLlxyXG5cdFx0aWYgIXNwYWNlSWRcclxuXHRcdFx0aWYgaXNVblNhZmVNb2RlXHJcblx0XHRcdFx0c3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7dXNlcjogdXNlcklkfSwge2ZpZWxkczogc3VGaWVsZHN9KVxyXG5cdFx0XHRcdGlmICFzdVxyXG5cdFx0XHRcdFx0cmV0dXJuIG51bGxcclxuXHRcdFx0XHRzcGFjZUlkID0gc3Uuc3BhY2VcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiBudWxsXHJcblxyXG5cdFx0VVNFUl9DT05URVhUID0ge31cclxuXHRcdFVTRVJfQ09OVEVYVC51c2VySWQgPSB1c2VySWRcclxuXHRcdFVTRVJfQ09OVEVYVC5zcGFjZUlkID0gc3BhY2VJZFxyXG5cdFx0VVNFUl9DT05URVhULnVzZXIgPSB7XHJcblx0XHRcdF9pZDogdXNlcklkXHJcblx0XHRcdG5hbWU6IHN1Lm5hbWUsXHJcblx0XHRcdG1vYmlsZTogc3UubW9iaWxlLFxyXG5cdFx0XHRwb3NpdGlvbjogc3UucG9zaXRpb24sXHJcblx0XHRcdGVtYWlsOiBzdS5lbWFpbFxyXG5cdFx0XHRjb21wYW55OiBzdS5jb21wYW55XHJcblx0XHRcdGNvbXBhbnlfaWQ6IHN1LmNvbXBhbnlfaWRcclxuXHRcdFx0Y29tcGFueV9pZHM6IHN1LmNvbXBhbnlfaWRzXHJcblx0XHR9XHJcblx0XHRzcGFjZV91c2VyX29yZyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9yZ2FuaXphdGlvbnNcIik/LmZpbmRPbmUoc3Uub3JnYW5pemF0aW9uKVxyXG5cdFx0aWYgc3BhY2VfdXNlcl9vcmdcclxuXHRcdFx0VVNFUl9DT05URVhULnVzZXIub3JnYW5pemF0aW9uID0ge1xyXG5cdFx0XHRcdF9pZDogc3BhY2VfdXNlcl9vcmcuX2lkLFxyXG5cdFx0XHRcdG5hbWU6IHNwYWNlX3VzZXJfb3JnLm5hbWUsXHJcblx0XHRcdFx0ZnVsbG5hbWU6IHNwYWNlX3VzZXJfb3JnLmZ1bGxuYW1lXHJcblx0XHRcdH1cclxuXHRcdHJldHVybiBVU0VSX0NPTlRFWFRcclxuXHJcbkNyZWF0b3IuZ2V0UmVsYXRpdmVVcmwgPSAodXJsKS0+XHJcblx0aWYgdXJsXHJcblx0XHQjIHVybOW8gOWktOayoeaciVwiL1wi77yM6ZyA6KaB5re75YqgXCIvXCJcclxuXHRcdGlmICEvXlxcLy8udGVzdCh1cmwpXHJcblx0XHRcdHVybCA9IFwiL1wiICsgdXJsXHJcblx0XHRyZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCArIHVybFxyXG5cdGVsc2VcclxuXHRcdHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYXHJcblxyXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWQgPSAodXNlcklkLCBzcGFjZUlkKS0+XHJcblx0dXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKVxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0c3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKVxyXG5cdGVsc2VcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJylcclxuXHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge2NvbXBhbnlfaWQ6MX19KVxyXG5cdHJldHVybiBzdS5jb21wYW55X2lkXHJcblxyXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWRzID0gKHVzZXJJZCwgc3BhY2VJZCktPlxyXG5cdHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKClcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJylcclxuXHRlbHNlXHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpXHJcblx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtjb21wYW55X2lkczoxfX0pXHJcblx0cmV0dXJuIHN1Py5jb21wYW55X2lkc1xyXG5cclxuQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgPSAocG8pLT5cclxuXHRpZiBwby5hbGxvd0NyZWF0ZVxyXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdGlmIHBvLmFsbG93RWRpdFxyXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdGlmIHBvLmFsbG93RGVsZXRlXHJcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0aWYgcG8udmlld0FsbFJlY29yZHNcclxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcclxuXHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXHJcblx0XHRwby5hbGxvd0RlbGV0ZSA9IHRydWVcclxuXHRcdHBvLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZVxyXG5cdGlmIHBvLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdGlmIHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXHJcblx0XHRwby5hbGxvd0RlbGV0ZSA9IHRydWVcclxuXHRcdHBvLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcclxuXHRyZXR1cm4gcG9cclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdGlmIHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVJcclxuXHRcdENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSXHJcblx0ZWxzZVxyXG5cdFx0cGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxyXG5cdFx0Q3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHBhdGgucmVzb2x2ZShwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCAnLi4vLi4vLi4vY2ZzJykpXHJcbiIsInZhciBGaWJlciwgcGF0aDtcblxuQ3JlYXRvci5kZXBzID0ge1xuICBhcHA6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3ksXG4gIG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxufTtcblxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XG4gIEFwcHM6IHt9LFxuICBPYmplY3RzOiB7fVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBmaWx0ZXJzRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbiAgU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIG9wdGlvbnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xuICByZXR1cm4gU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIGNyZWF0ZUZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG59KTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuICBDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMgPSBmdW5jdGlvbihvYmosIG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSk7XG4gICAgfSkucnVuKCk7XG4gIH07XG59XG5cbkNyZWF0b3IubG9hZE9iamVjdHMgPSBmdW5jdGlvbihvYmosIG9iamVjdF9uYW1lKSB7XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IG9iai5uYW1lO1xuICB9XG4gIGlmICghb2JqLmxpc3Rfdmlld3MpIHtcbiAgICBvYmoubGlzdF92aWV3cyA9IHt9O1xuICB9XG4gIGlmIChvYmouc3BhY2UpIHtcbiAgICBvYmplY3RfbmFtZSA9ICdjXycgKyBvYmouc3BhY2UgKyAnXycgKyBvYmoubmFtZTtcbiAgfVxuICBDcmVhdG9yLmNvbnZlcnRPYmplY3Qob2JqKTtcbiAgbmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XG4gIENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKTtcbiAgQ3JlYXRvci5pbml0TGlzdFZpZXdzKG9iamVjdF9uYW1lKTtcbiAgcmV0dXJuIG9iajtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0TmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0LnNwYWNlKSB7XG4gICAgcmV0dXJuIFwiY19cIiArIG9iamVjdC5zcGFjZSArIFwiX1wiICsgb2JqZWN0Lm5hbWU7XG4gIH1cbiAgcmV0dXJuIG9iamVjdC5uYW1lO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpIHtcbiAgdmFyIG9iaiwgcmVmLCByZWYxO1xuICBpZiAoXy5pc0FycmF5KG9iamVjdF9uYW1lKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKChyZWYgPSBDcmVhdG9yLmRlcHMpICE9IG51bGwpIHtcbiAgICAgIGlmICgocmVmMSA9IHJlZi5vYmplY3QpICE9IG51bGwpIHtcbiAgICAgICAgcmVmMS5kZXBlbmQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKCFzcGFjZV9pZCAmJiBvYmplY3RfbmFtZSkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgIW9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2NfJykpIHtcbiAgICAgIHNwYWNlX2lkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgfVxuICBpZiAob2JqZWN0X25hbWUpIHtcbiAgICBpZiAoc3BhY2VfaWQpIHtcbiAgICAgIG9iaiA9IENyZWF0b3Iub2JqZWN0c0J5TmFtZVtcImNfXCIgKyBzcGFjZV9pZCArIFwiX1wiICsgb2JqZWN0X25hbWVdO1xuICAgICAgaWYgKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuICAgIH1cbiAgICBvYmogPSBfLmZpbmQoQ3JlYXRvci5vYmplY3RzQnlOYW1lLCBmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5fY29sbGVjdGlvbl9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICB9KTtcbiAgICBpZiAob2JqKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RCeUlkID0gZnVuY3Rpb24ob2JqZWN0X2lkKSB7XG4gIHJldHVybiBfLmZpbmRXaGVyZShDcmVhdG9yLm9iamVjdHNCeU5hbWUsIHtcbiAgICBfaWQ6IG9iamVjdF9pZFxuICB9KTtcbn07XG5cbkNyZWF0b3IucmVtb3ZlT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgY29uc29sZS5sb2coXCJyZW1vdmVPYmplY3RcIiwgb2JqZWN0X25hbWUpO1xuICBkZWxldGUgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgcmV0dXJuIGRlbGV0ZSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdO1xufTtcblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1socmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpKSAhPSBudWxsID8gcmVmLl9jb2xsZWN0aW9uX25hbWUgOiB2b2lkIDBdO1xuICB9XG59O1xuXG5DcmVhdG9yLnJlbW92ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICByZXR1cm4gZGVsZXRlIENyZWF0b3IuQ29sbGVjdGlvbnNbb2JqZWN0X25hbWVdO1xufTtcblxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIHJlZiwgcmVmMSwgc3BhY2U7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIHNwYWNlID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KFwic3BhY2VzXCIpKSAhPSBudWxsID8gKHJlZjEgPSByZWYuZGIpICE9IG51bGwgPyByZWYxLmZpbmRPbmUoc3BhY2VJZCkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIGlmIChzcGFjZSAhPSBudWxsID8gc3BhY2UuYWRtaW5zIDogdm9pZCAwKSB7XG4gICAgcmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMDtcbiAgfVxufTtcblxuQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEgPSBmdW5jdGlvbihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucykge1xuICBpZiAoIV8uaXNTdHJpbmcoZm9ybXVsYXIpKSB7XG4gICAgcmV0dXJuIGZvcm11bGFyO1xuICB9XG4gIGlmIChDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmb3JtdWxhcikpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG4gIHJldHVybiBmb3JtdWxhcjtcbn07XG5cbkNyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzID0gZnVuY3Rpb24oZmlsdGVycywgY29udGV4dCkge1xuICB2YXIgc2VsZWN0b3I7XG4gIHNlbGVjdG9yID0ge307XG4gIF8uZWFjaChmaWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICB2YXIgYWN0aW9uLCBuYW1lLCB2YWx1ZTtcbiAgICBpZiAoKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLmxlbmd0aCA6IHZvaWQgMCkgPT09IDMpIHtcbiAgICAgIG5hbWUgPSBmaWx0ZXJbMF07XG4gICAgICBhY3Rpb24gPSBmaWx0ZXJbMV07XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgY29udGV4dCk7XG4gICAgICBzZWxlY3RvcltuYW1lXSA9IHt9O1xuICAgICAgcmV0dXJuIHNlbGVjdG9yW25hbWVdW2FjdGlvbl0gPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuICBjb25zb2xlLmxvZyhcImV2YWx1YXRlRmlsdGVycy0tPnNlbGVjdG9yXCIsIHNlbGVjdG9yKTtcbiAgcmV0dXJuIHNlbGVjdG9yO1xufTtcblxuQ3JlYXRvci5pc0NvbW1vblNwYWNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICByZXR1cm4gc3BhY2VJZCA9PT0gJ2NvbW1vbic7XG59O1xuXG5cbi8qXG5cdGRvY3PvvJrlvoXmjpLluo/nmoTmlofmoaPmlbDnu4Rcblx0aWRz77yaX2lk6ZuG5ZCIXG5cdGlkX2tleTog6buY6K6k5Li6X2lkXG5cdHJldHVybiDmjInnhadpZHPnmoTpobrluo/ov5Tlm57mlrDnmoTmlofmoaPpm4blkIhcbiAqL1xuXG5DcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyA9IGZ1bmN0aW9uKGRvY3MsIGlkcywgaWRfa2V5LCBoaXRfZmlyc3QpIHtcbiAgdmFyIHZhbHVlcztcbiAgaWYgKCFpZF9rZXkpIHtcbiAgICBpZF9rZXkgPSBcIl9pZFwiO1xuICB9XG4gIGlmIChoaXRfZmlyc3QpIHtcbiAgICB2YWx1ZXMgPSBkb2NzLmdldFByb3BlcnR5KGlkX2tleSk7XG4gICAgcmV0dXJuIF8uc29ydEJ5KGRvY3MsIGZ1bmN0aW9uKGRvYykge1xuICAgICAgdmFyIF9pbmRleDtcbiAgICAgIF9pbmRleCA9IGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKTtcbiAgICAgIGlmIChfaW5kZXggPiAtMSkge1xuICAgICAgICByZXR1cm4gX2luZGV4O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGlkcy5sZW5ndGggKyBfLmluZGV4T2YodmFsdWVzLCBkb2NbaWRfa2V5XSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF8uc29ydEJ5KGRvY3MsIGZ1bmN0aW9uKGRvYykge1xuICAgICAgcmV0dXJuIGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKTtcbiAgICB9KTtcbiAgfVxufTtcblxuXG4vKlxuXHTmjInnlKjmiLfmiYDlsZ7mnKzlnLDljJbor63oqIDov5vooYzmjpLluo/vvIzmlK/mjIHkuK3mlofjgIHmlbDlgLzjgIHml6XmnJ/nrYnlrZfmrrXmjpLluo9cblx05a+55LqOT2JqZWN057G75Z6L77yM5aaC5p6c5o+Q5L6b5L2c55So5Z+f5Lita2V55bGe5oCn77yM5YiZ5Y+W5YC85Li6dmFsdWVba2V5Xei/m+ihjOaOkuW6j+avlOi+g++8jOWPjeS5i+aVtOS4qk9iamVjdC50b1N0cmluZygp5ZCO5o6S5bqP5q+U6L6DXG4gKi9cblxuQ3JlYXRvci5zb3J0aW5nTWV0aG9kID0gZnVuY3Rpb24odmFsdWUxLCB2YWx1ZTIpIHtcbiAgdmFyIGlzVmFsdWUxRW1wdHksIGlzVmFsdWUyRW1wdHksIGxvY2FsZTtcbiAgaWYgKHRoaXMua2V5KSB7XG4gICAgdmFsdWUxID0gdmFsdWUxW3RoaXMua2V5XTtcbiAgICB2YWx1ZTIgPSB2YWx1ZTJbdGhpcy5rZXldO1xuICB9XG4gIGlmICh2YWx1ZTEgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgdmFsdWUxID0gdmFsdWUxLmdldFRpbWUoKTtcbiAgfVxuICBpZiAodmFsdWUyIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHZhbHVlMiA9IHZhbHVlMi5nZXRUaW1lKCk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZTEgPT09IFwibnVtYmVyXCIgJiYgdHlwZW9mIHZhbHVlMiA9PT0gXCJudW1iZXJcIikge1xuICAgIHJldHVybiB2YWx1ZTEgLSB2YWx1ZTI7XG4gIH1cbiAgaXNWYWx1ZTFFbXB0eSA9IHZhbHVlMSA9PT0gbnVsbCB8fCB2YWx1ZTEgPT09IHZvaWQgMDtcbiAgaXNWYWx1ZTJFbXB0eSA9IHZhbHVlMiA9PT0gbnVsbCB8fCB2YWx1ZTIgPT09IHZvaWQgMDtcbiAgaWYgKGlzVmFsdWUxRW1wdHkgJiYgIWlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgaWYgKGlzVmFsdWUxRW1wdHkgJiYgaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAwO1xuICB9XG4gIGlmICghaXNWYWx1ZTFFbXB0eSAmJiBpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgbG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKTtcbiAgcmV0dXJuIHZhbHVlMS50b1N0cmluZygpLmxvY2FsZUNvbXBhcmUodmFsdWUyLnRvU3RyaW5nKCksIGxvY2FsZSk7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIF9vYmplY3QsIHBlcm1pc3Npb25zLCByZWxhdGVkX29iamVjdHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICB9XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IFtdO1xuICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgaWYgKCFfb2JqZWN0KSB7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfZmlsZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiXG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICBpZiAocmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PT0gb2JqZWN0X25hbWUpIHtcbiAgICAgICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwib2JqZWN0X2ZpZWxkc1wiKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cy5zcGxpY2UoMCwgMCwge1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBpZiAoX29iamVjdC5lbmFibGVfdGFza3MpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJ0YXNrc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX25vdGVzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwibm90ZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9ldmVudHMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJldmVudHNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9pbnN0YW5jZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIlxuICAgIH0pO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpO1xuICAgIGlmIChfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiAocGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDApKSB7XG4gICAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImF1ZGl0X3JlY29yZHNcIixcbiAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbnRleHQgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIGlzVW5TYWZlTW9kZSkge1xuICB2YXIgVVNFUl9DT05URVhULCByZWYsIHNwYWNlX3VzZXJfb3JnLCBzdSwgc3VGaWVsZHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5VU0VSX0NPTlRFWFQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCEodXNlcklkICYmIHNwYWNlSWQpKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJ0aGUgcGFyYW1zIHVzZXJJZCBhbmQgc3BhY2VJZCBpcyByZXF1aXJlZCBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0VXNlckNvbnRleHRcIik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgc3VGaWVsZHMgPSB7XG4gICAgICBuYW1lOiAxLFxuICAgICAgbW9iaWxlOiAxLFxuICAgICAgcG9zaXRpb246IDEsXG4gICAgICBlbWFpbDogMSxcbiAgICAgIGNvbXBhbnk6IDEsXG4gICAgICBvcmdhbml6YXRpb246IDEsXG4gICAgICBzcGFjZTogMSxcbiAgICAgIGNvbXBhbnlfaWQ6IDEsXG4gICAgICBjb21wYW55X2lkczogMVxuICAgIH07XG4gICAgc3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczogc3VGaWVsZHNcbiAgICB9KTtcbiAgICBpZiAoIXN1KSB7XG4gICAgICBzcGFjZUlkID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBpZiAoaXNVblNhZmVNb2RlKSB7XG4gICAgICAgIHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBzdUZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFzdSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHNwYWNlSWQgPSBzdS5zcGFjZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBVU0VSX0NPTlRFWFQgPSB7fTtcbiAgICBVU0VSX0NPTlRFWFQudXNlcklkID0gdXNlcklkO1xuICAgIFVTRVJfQ09OVEVYVC5zcGFjZUlkID0gc3BhY2VJZDtcbiAgICBVU0VSX0NPTlRFWFQudXNlciA9IHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgbmFtZTogc3UubmFtZSxcbiAgICAgIG1vYmlsZTogc3UubW9iaWxlLFxuICAgICAgcG9zaXRpb246IHN1LnBvc2l0aW9uLFxuICAgICAgZW1haWw6IHN1LmVtYWlsLFxuICAgICAgY29tcGFueTogc3UuY29tcGFueSxcbiAgICAgIGNvbXBhbnlfaWQ6IHN1LmNvbXBhbnlfaWQsXG4gICAgICBjb21wYW55X2lkczogc3UuY29tcGFueV9pZHNcbiAgICB9O1xuICAgIHNwYWNlX3VzZXJfb3JnID0gKHJlZiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9yZ2FuaXphdGlvbnNcIikpICE9IG51bGwgPyByZWYuZmluZE9uZShzdS5vcmdhbml6YXRpb24pIDogdm9pZCAwO1xuICAgIGlmIChzcGFjZV91c2VyX29yZykge1xuICAgICAgVVNFUl9DT05URVhULnVzZXIub3JnYW5pemF0aW9uID0ge1xuICAgICAgICBfaWQ6IHNwYWNlX3VzZXJfb3JnLl9pZCxcbiAgICAgICAgbmFtZTogc3BhY2VfdXNlcl9vcmcubmFtZSxcbiAgICAgICAgZnVsbG5hbWU6IHNwYWNlX3VzZXJfb3JnLmZ1bGxuYW1lXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gVVNFUl9DT05URVhUO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0aXZlVXJsID0gZnVuY3Rpb24odXJsKSB7XG4gIGlmICh1cmwpIHtcbiAgICBpZiAoIS9eXFwvLy50ZXN0KHVybCkpIHtcbiAgICAgIHVybCA9IFwiL1wiICsgdXJsO1xuICAgIH1cbiAgICByZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCArIHVybDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBzdTtcbiAgdXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJyk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpO1xuICAgIH1cbiAgfVxuICBzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICB1c2VyOiB1c2VySWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY29tcGFueV9pZDogMVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzdS5jb21wYW55X2lkO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgc3U7XG4gIHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKCk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpO1xuICB9IGVsc2Uge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKTtcbiAgICB9XG4gIH1cbiAgc3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNvbXBhbnlfaWRzOiAxXG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHN1ICE9IG51bGwgPyBzdS5jb21wYW55X2lkcyA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zID0gZnVuY3Rpb24ocG8pIHtcbiAgaWYgKHBvLmFsbG93Q3JlYXRlKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dFZGl0KSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dEZWxldGUpIHtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLnZpZXdBbGxSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd0RlbGV0ZSA9IHRydWU7XG4gICAgcG8udmlld0FsbFJlY29yZHMgPSB0cnVlO1xuICB9XG4gIGlmIChwby52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd0RlbGV0ZSA9IHRydWU7XG4gICAgcG8udmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcG87XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIGlmIChwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSKSB7XG4gICAgQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVI7XG4gIH0gZWxzZSB7XG4gICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgICBDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyID0gcGF0aC5yZXNvbHZlKHBhdGguam9pbihfX21ldGVvcl9ib290c3RyYXBfXy5zZXJ2ZXJEaXIsICcuLi8uLi8uLi9jZnMnKSk7XG4gIH1cbn1cbiIsIk1ldGVvci5tZXRob2RzXHJcblx0IyDnlKjmiLfojrflj5Zsb29rdXAg44CBbWFzdGVyX2RldGFpbOexu+Wei+Wtl+auteeahOmAiemhueWAvFxyXG5cdFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiOiAob3B0aW9ucyktPlxyXG5cdFx0aWYgb3B0aW9ucz8ucGFyYW1zPy5yZWZlcmVuY2VfdG9cclxuXHJcblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9wdGlvbnMucGFyYW1zLnJlZmVyZW5jZV90bywgb3B0aW9ucy5wYXJhbXMuc3BhY2UpXHJcblxyXG5cdFx0XHRuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWVxyXG5cclxuXHRcdFx0cXVlcnkgPSB7fVxyXG5cdFx0XHRpZiBvcHRpb25zLnBhcmFtcy5zcGFjZVxyXG5cdFx0XHRcdHF1ZXJ5LnNwYWNlID0gb3B0aW9ucy5wYXJhbXMuc3BhY2VcclxuXHJcblx0XHRcdFx0c29ydCA9IG9wdGlvbnM/LnNvcnRcclxuXHJcblx0XHRcdFx0c2VsZWN0ZWQgPSBvcHRpb25zPy5zZWxlY3RlZCB8fCBbXVxyXG5cclxuXHRcdFx0XHRvcHRpb25zX2xpbWl0ID0gb3B0aW9ucz8ub3B0aW9uc19saW1pdCB8fCAxMFxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcclxuXHRcdFx0XHRcdHNlYXJjaFRleHRRdWVyeSA9IHt9XHJcblx0XHRcdFx0XHRzZWFyY2hUZXh0UXVlcnlbbmFtZV9maWVsZF9rZXldID0geyRyZWdleDogb3B0aW9ucy5zZWFyY2hUZXh0fVxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zPy52YWx1ZXM/Lmxlbmd0aFxyXG5cdFx0XHRcdFx0aWYgb3B0aW9ucy5zZWFyY2hUZXh0XHJcblx0XHRcdFx0XHRcdHF1ZXJ5LiRvciA9IFt7X2lkOiB7JGluOiBvcHRpb25zLnZhbHVlc319LCBzZWFyY2hUZXh0UXVlcnldXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHF1ZXJ5LiRvciA9IFt7X2lkOiB7JGluOiBvcHRpb25zLnZhbHVlc319XVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxyXG5cdFx0XHRcdFx0XHRfLmV4dGVuZChxdWVyeSwgc2VhcmNoVGV4dFF1ZXJ5KVxyXG5cdFx0XHRcdFx0cXVlcnkuX2lkID0geyRuaW46IHNlbGVjdGVkfVxyXG5cclxuXHRcdFx0XHRjb2xsZWN0aW9uID0gb2JqZWN0LmRiXHJcblxyXG5cdFx0XHRcdGlmIG9wdGlvbnMuZmlsdGVyUXVlcnlcclxuXHRcdFx0XHRcdF8uZXh0ZW5kIHF1ZXJ5LCBvcHRpb25zLmZpbHRlclF1ZXJ5XHJcblxyXG5cdFx0XHRcdHF1ZXJ5X29wdGlvbnMgPSB7bGltaXQ6IG9wdGlvbnNfbGltaXR9XHJcblxyXG5cdFx0XHRcdGlmIHNvcnQgJiYgXy5pc09iamVjdChzb3J0KVxyXG5cdFx0XHRcdFx0cXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydFxyXG5cclxuXHRcdFx0XHRpZiBjb2xsZWN0aW9uXHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0cmVjb3JkcyA9IGNvbGxlY3Rpb24uZmluZChxdWVyeSwgcXVlcnlfb3B0aW9ucykuZmV0Y2goKVxyXG5cdFx0XHRcdFx0XHRyZXN1bHRzID0gW11cclxuXHRcdFx0XHRcdFx0Xy5lYWNoIHJlY29yZHMsIChyZWNvcmQpLT5cclxuXHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2hcclxuXHRcdFx0XHRcdFx0XHRcdGxhYmVsOiByZWNvcmRbbmFtZV9maWVsZF9rZXldXHJcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogcmVjb3JkLl9pZFxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0c1xyXG5cdFx0XHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgZS5tZXNzYWdlICsgXCItLT5cIiArIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpXHJcblx0XHRyZXR1cm4gW10gIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBjb2xsZWN0aW9uLCBlLCBuYW1lX2ZpZWxkX2tleSwgb2JqZWN0LCBvcHRpb25zX2xpbWl0LCBxdWVyeSwgcXVlcnlfb3B0aW9ucywgcmVjb3JkcywgcmVmLCByZWYxLCByZXN1bHRzLCBzZWFyY2hUZXh0UXVlcnksIHNlbGVjdGVkLCBzb3J0O1xuICAgIGlmIChvcHRpb25zICE9IG51bGwgPyAocmVmID0gb3B0aW9ucy5wYXJhbXMpICE9IG51bGwgPyByZWYucmVmZXJlbmNlX3RvIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvcHRpb25zLnBhcmFtcy5yZWZlcmVuY2VfdG8sIG9wdGlvbnMucGFyYW1zLnNwYWNlKTtcbiAgICAgIG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICAgICAgcXVlcnkgPSB7fTtcbiAgICAgIGlmIChvcHRpb25zLnBhcmFtcy5zcGFjZSkge1xuICAgICAgICBxdWVyeS5zcGFjZSA9IG9wdGlvbnMucGFyYW1zLnNwYWNlO1xuICAgICAgICBzb3J0ID0gb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zb3J0IDogdm9pZCAwO1xuICAgICAgICBzZWxlY3RlZCA9IChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNlbGVjdGVkIDogdm9pZCAwKSB8fCBbXTtcbiAgICAgICAgb3B0aW9uc19saW1pdCA9IChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLm9wdGlvbnNfbGltaXQgOiB2b2lkIDApIHx8IDEwO1xuICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgc2VhcmNoVGV4dFF1ZXJ5ID0ge307XG4gICAgICAgICAgc2VhcmNoVGV4dFF1ZXJ5W25hbWVfZmllbGRfa2V5XSA9IHtcbiAgICAgICAgICAgICRyZWdleDogb3B0aW9ucy5zZWFyY2hUZXh0XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucyAhPSBudWxsID8gKHJlZjEgPSBvcHRpb25zLnZhbHVlcykgIT0gbnVsbCA/IHJlZjEubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgcXVlcnkuJG9yID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAkaW46IG9wdGlvbnMudmFsdWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LCBzZWFyY2hUZXh0UXVlcnlcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHF1ZXJ5LiRvciA9IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgJGluOiBvcHRpb25zLnZhbHVlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgXy5leHRlbmQocXVlcnksIHNlYXJjaFRleHRRdWVyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHF1ZXJ5Ll9pZCA9IHtcbiAgICAgICAgICAgICRuaW46IHNlbGVjdGVkXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBjb2xsZWN0aW9uID0gb2JqZWN0LmRiO1xuICAgICAgICBpZiAob3B0aW9ucy5maWx0ZXJRdWVyeSkge1xuICAgICAgICAgIF8uZXh0ZW5kKHF1ZXJ5LCBvcHRpb25zLmZpbHRlclF1ZXJ5KTtcbiAgICAgICAgfVxuICAgICAgICBxdWVyeV9vcHRpb25zID0ge1xuICAgICAgICAgIGxpbWl0OiBvcHRpb25zX2xpbWl0XG4gICAgICAgIH07XG4gICAgICAgIGlmIChzb3J0ICYmIF8uaXNPYmplY3Qoc29ydCkpIHtcbiAgICAgICAgICBxdWVyeV9vcHRpb25zLnNvcnQgPSBzb3J0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlY29yZHMgPSBjb2xsZWN0aW9uLmZpbmQocXVlcnksIHF1ZXJ5X29wdGlvbnMpLmZldGNoKCk7XG4gICAgICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgICAgICBfLmVhY2gocmVjb3JkcywgZnVuY3Rpb24ocmVjb3JkKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgICAgIGxhYmVsOiByZWNvcmRbbmFtZV9maWVsZF9rZXldLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuX2lkXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIGUubWVzc2FnZSArIFwiLS0+XCIgKyBKU09OLnN0cmluZ2lmeShvcHRpb25zKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxufSk7XG4iLCJKc29uUm91dGVzLmFkZCAncG9zdCcsICcvYXBpL3dvcmtmbG93L3ZpZXcvOmluc3RhbmNlSWQnLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0dHJ5XHJcblx0XHRjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpXHJcblx0XHRjdXJyZW50X3VzZXJfaWQgPSBjdXJyZW50X3VzZXJfaW5mby5faWRcclxuXHJcblx0XHRoYXNoRGF0YSA9IHJlcS5ib2R5XHJcblx0XHRvYmplY3RfbmFtZSA9IGhhc2hEYXRhLm9iamVjdF9uYW1lXHJcblx0XHRyZWNvcmRfaWQgPSBoYXNoRGF0YS5yZWNvcmRfaWRcclxuXHRcdHNwYWNlX2lkID0gaGFzaERhdGEuc3BhY2VfaWRcclxuXHJcblx0XHRjaGVjayBvYmplY3RfbmFtZSwgU3RyaW5nXHJcblx0XHRjaGVjayByZWNvcmRfaWQsIFN0cmluZ1xyXG5cdFx0Y2hlY2sgc3BhY2VfaWQsIFN0cmluZ1xyXG5cclxuXHRcdGluc0lkID0gcmVxLnBhcmFtcy5pbnN0YW5jZUlkXHJcblx0XHR4X3VzZXJfaWQgPSByZXEucXVlcnlbJ1gtVXNlci1JZCddXHJcblx0XHR4X2F1dGhfdG9rZW4gPSByZXEucXVlcnlbJ1gtQXV0aC1Ub2tlbiddXHJcblxyXG5cdFx0cmVkaXJlY3RfdXJsID0gXCIvXCJcclxuXHRcdGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZClcclxuXHRcdCMgLSDmiJHnmoTojYnnqL/lsLHot7Povazoh7PojYnnqL/nrrFcclxuXHRcdCMgLSDmiJHnmoTlvoXlrqHmoLjlsLHot7Povazoh7PlvoXlrqHmoLhcclxuXHRcdCMgLSDkuI3mmK/miJHnmoTnlLPor7fljZXliJnot7Povazoh7PmiZPljbDpobXpnaJcclxuXHRcdCMgLSDlpoLnlLPor7fljZXkuI3lrZjlnKjliJnmj5DnpLrnlKjmiLfnlLPor7fljZXlt7LliKDpmaTvvIzlubbkuJTmm7TmlrByZWNvcmTnmoTnirbmgIHvvIzkvb/nlKjmiLflj6/ku6Xph43mlrDlj5HotbflrqHmiblcclxuXHRcdGlmIGluc1xyXG5cdFx0XHR3b3JrZmxvd1VybCA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMud29ya2Zsb3cudXJsXHJcblx0XHRcdGJveCA9ICcnXHJcblx0XHRcdHNwYWNlSWQgPSBpbnMuc3BhY2VcclxuXHRcdFx0Zmxvd0lkID0gaW5zLmZsb3dcclxuXHJcblx0XHRcdGlmIChpbnMuaW5ib3hfdXNlcnM/LmluY2x1ZGVzIGN1cnJlbnRfdXNlcl9pZCkgb3IgKGlucy5jY191c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkKVxyXG5cdFx0XHRcdGJveCA9ICdpbmJveCdcclxuXHRcdFx0ZWxzZSBpZiBpbnMub3V0Ym94X3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWRcclxuXHRcdFx0XHRib3ggPSAnb3V0Ym94J1xyXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAnZHJhZnQnIGFuZCBpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZFxyXG5cdFx0XHRcdGJveCA9ICdkcmFmdCdcclxuXHRcdFx0ZWxzZSBpZiBpbnMuc3RhdGUgaXMgJ3BlbmRpbmcnIGFuZCAoaW5zLnN1Ym1pdHRlciBpcyBjdXJyZW50X3VzZXJfaWQgb3IgaW5zLmFwcGxpY2FudCBpcyBjdXJyZW50X3VzZXJfaWQpXHJcblx0XHRcdFx0Ym94ID0gJ3BlbmRpbmcnXHJcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdjb21wbGV0ZWQnIGFuZCBpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZFxyXG5cdFx0XHRcdGJveCA9ICdjb21wbGV0ZWQnXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHQjIOmqjOivgWxvZ2luIHVzZXJfaWTlr7nor6XmtYHnqIvmnInnrqHnkIbnlLPor7fljZXnmoTmnYPpmZBcclxuXHRcdFx0XHRwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93SWQsIGN1cnJlbnRfdXNlcl9pZClcclxuXHRcdFx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQsIHsgZmllbGRzOiB7IGFkbWluczogMSB9IH0pXHJcblx0XHRcdFx0aWYgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZG1pblwiKSBvciBzcGFjZS5hZG1pbnMuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKVxyXG5cdFx0XHRcdFx0Ym94ID0gJ21vbml0b3InXHJcblxyXG5cdFx0XHRpZiBib3hcclxuXHRcdFx0XHRyZWRpcmVjdF91cmwgPSB3b3JrZmxvd1VybCArIFwid29ya2Zsb3cvc3BhY2UvI3tzcGFjZUlkfS8je2JveH0vI3tpbnNJZH0/WC1Vc2VyLUlkPSN7eF91c2VyX2lkfSZYLUF1dGgtVG9rZW49I3t4X2F1dGhfdG9rZW59XCJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJlZGlyZWN0X3VybCA9IHdvcmtmbG93VXJsICsgXCJ3b3JrZmxvdy9zcGFjZS8je3NwYWNlSWR9L3ByaW50LyN7aW5zSWR9P2JveD1tb25pdG9yJnByaW50X2lzX3Nob3dfdHJhY2VzPTEmcHJpbnRfaXNfc2hvd19hdHRhY2htZW50cz0xJlgtVXNlci1JZD0je3hfdXNlcl9pZH0mWC1BdXRoLVRva2VuPSN7eF9hdXRoX3Rva2VufVwiXHJcblxyXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdFx0ZGF0YTogeyByZWRpcmVjdF91cmw6IHJlZGlyZWN0X3VybCB9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuXHJcblx0XHRlbHNlXHJcblx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKVxyXG5cdFx0XHRpZiBjb2xsZWN0aW9uXHJcblx0XHRcdFx0Y29sbGVjdGlvbi51cGRhdGUocmVjb3JkX2lkLCB7XHJcblx0XHRcdFx0XHQkcHVsbDoge1xyXG5cdFx0XHRcdFx0XHRcImluc3RhbmNlc1wiOiB7XHJcblx0XHRcdFx0XHRcdFx0XCJfaWRcIjogaW5zSWRcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yJywgJ+eUs+ivt+WNleW3suWIoOmZpCcpXHJcblxyXG5cdGNhdGNoIGVcclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbeyBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XSB9XHJcblx0XHR9XHJcblxyXG4iLCJKc29uUm91dGVzLmFkZCgncG9zdCcsICcvYXBpL3dvcmtmbG93L3ZpZXcvOmluc3RhbmNlSWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYm94LCBjb2xsZWN0aW9uLCBjdXJyZW50X3VzZXJfaWQsIGN1cnJlbnRfdXNlcl9pbmZvLCBlLCBmbG93SWQsIGhhc2hEYXRhLCBpbnMsIGluc0lkLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbnMsIHJlY29yZF9pZCwgcmVkaXJlY3RfdXJsLCByZWYsIHJlZjEsIHJlZjIsIHNwYWNlLCBzcGFjZUlkLCBzcGFjZV9pZCwgd29ya2Zsb3dVcmwsIHhfYXV0aF90b2tlbiwgeF91c2VyX2lkO1xuICB0cnkge1xuICAgIGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSk7XG4gICAgY3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkO1xuICAgIGhhc2hEYXRhID0gcmVxLmJvZHk7XG4gICAgb2JqZWN0X25hbWUgPSBoYXNoRGF0YS5vYmplY3RfbmFtZTtcbiAgICByZWNvcmRfaWQgPSBoYXNoRGF0YS5yZWNvcmRfaWQ7XG4gICAgc3BhY2VfaWQgPSBoYXNoRGF0YS5zcGFjZV9pZDtcbiAgICBjaGVjayhvYmplY3RfbmFtZSwgU3RyaW5nKTtcbiAgICBjaGVjayhyZWNvcmRfaWQsIFN0cmluZyk7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgaW5zSWQgPSByZXEucGFyYW1zLmluc3RhbmNlSWQ7XG4gICAgeF91c2VyX2lkID0gcmVxLnF1ZXJ5WydYLVVzZXItSWQnXTtcbiAgICB4X2F1dGhfdG9rZW4gPSByZXEucXVlcnlbJ1gtQXV0aC1Ub2tlbiddO1xuICAgIHJlZGlyZWN0X3VybCA9IFwiL1wiO1xuICAgIGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZCk7XG4gICAgaWYgKGlucykge1xuICAgICAgd29ya2Zsb3dVcmwgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMud29ya2Zsb3cudXJsO1xuICAgICAgYm94ID0gJyc7XG4gICAgICBzcGFjZUlkID0gaW5zLnNwYWNlO1xuICAgICAgZmxvd0lkID0gaW5zLmZsb3c7XG4gICAgICBpZiAoKChyZWYgPSBpbnMuaW5ib3hfdXNlcnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkgfHwgKChyZWYxID0gaW5zLmNjX3VzZXJzKSAhPSBudWxsID8gcmVmMS5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSkge1xuICAgICAgICBib3ggPSAnaW5ib3gnO1xuICAgICAgfSBlbHNlIGlmICgocmVmMiA9IGlucy5vdXRib3hfdXNlcnMpICE9IG51bGwgPyByZWYyLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApIHtcbiAgICAgICAgYm94ID0gJ291dGJveCc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ2RyYWZ0JyAmJiBpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQpIHtcbiAgICAgICAgYm94ID0gJ2RyYWZ0JztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAncGVuZGluZycgJiYgKGlucy5zdWJtaXR0ZXIgPT09IGN1cnJlbnRfdXNlcl9pZCB8fCBpbnMuYXBwbGljYW50ID09PSBjdXJyZW50X3VzZXJfaWQpKSB7XG4gICAgICAgIGJveCA9ICdwZW5kaW5nJztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQpIHtcbiAgICAgICAgYm94ID0gJ2NvbXBsZXRlZCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93SWQsIGN1cnJlbnRfdXNlcl9pZCk7XG4gICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgYWRtaW5zOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRtaW5cIikgfHwgc3BhY2UuYWRtaW5zLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkpIHtcbiAgICAgICAgICBib3ggPSAnbW9uaXRvcic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChib3gpIHtcbiAgICAgICAgcmVkaXJlY3RfdXJsID0gd29ya2Zsb3dVcmwgKyAoXCJ3b3JrZmxvdy9zcGFjZS9cIiArIHNwYWNlSWQgKyBcIi9cIiArIGJveCArIFwiL1wiICsgaW5zSWQgKyBcIj9YLVVzZXItSWQ9XCIgKyB4X3VzZXJfaWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyB4X2F1dGhfdG9rZW4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVkaXJlY3RfdXJsID0gd29ya2Zsb3dVcmwgKyAoXCJ3b3JrZmxvdy9zcGFjZS9cIiArIHNwYWNlSWQgKyBcIi9wcmludC9cIiArIGluc0lkICsgXCI/Ym94PW1vbml0b3ImcHJpbnRfaXNfc2hvd190cmFjZXM9MSZwcmludF9pc19zaG93X2F0dGFjaG1lbnRzPTEmWC1Vc2VyLUlkPVwiICsgeF91c2VyX2lkICsgXCImWC1BdXRoLVRva2VuPVwiICsgeF9hdXRoX3Rva2VuKTtcbiAgICAgIH1cbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogMjAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVkaXJlY3RfdXJsOiByZWRpcmVjdF91cmxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKTtcbiAgICAgIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgICAgIGNvbGxlY3Rpb24udXBkYXRlKHJlY29yZF9pZCwge1xuICAgICAgICAgICRwdWxsOiB7XG4gICAgICAgICAgICBcImluc3RhbmNlc1wiOiB7XG4gICAgICAgICAgICAgIFwiX2lkXCI6IGluc0lkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3InLCAn55Sz6K+35Y2V5bey5Yig6ZmkJyk7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0SW5pdFdpZHRoUGVyY2VudCA9IChvYmplY3RfbmFtZSwgY29sdW1ucykgLT5cclxuXHRfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpPy5fc2NoZW1hXHJcblx0Y29sdW1uX251bSA9IDBcclxuXHRpZiBfc2NoZW1hXHJcblx0XHRfLmVhY2ggY29sdW1ucywgKGZpZWxkX25hbWUpIC0+XHJcblx0XHRcdGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpXHJcblx0XHRcdGlzX3dpZGUgPSBmaWVsZFtmaWVsZF9uYW1lXT8uYXV0b2Zvcm0/LmlzX3dpZGVcclxuXHRcdFx0aWYgaXNfd2lkZVxyXG5cdFx0XHRcdGNvbHVtbl9udW0gKz0gMlxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Y29sdW1uX251bSArPSAxXHJcblxyXG5cdFx0aW5pdF93aWR0aF9wZXJjZW50ID0gMTAwIC8gY29sdW1uX251bVxyXG5cdFx0cmV0dXJuIGluaXRfd2lkdGhfcGVyY2VudFxyXG5cclxuQ3JlYXRvci5nZXRGaWVsZElzV2lkZSA9IChvYmplY3RfbmFtZSwgZmllbGRfbmFtZSkgLT5cclxuXHRfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpLl9zY2hlbWFcclxuXHRpZiBfc2NoZW1hXHJcblx0XHRmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKVxyXG5cdFx0aXNfd2lkZSA9IGZpZWxkW2ZpZWxkX25hbWVdPy5hdXRvZm9ybT8uaXNfd2lkZVxyXG5cdFx0cmV0dXJuIGlzX3dpZGVcclxuXHJcbkNyZWF0b3IuZ2V0VGFidWxhck9yZGVyID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbnMpIC0+XHJcblx0c2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnM/LnNldHRpbmdzPy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJ9KVxyXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGNvbHVtbnMgPSBfLm1hcCBjb2x1bW5zLCAoY29sdW1uKS0+XHJcblx0XHRmaWVsZCA9IG9iai5maWVsZHNbY29sdW1uXVxyXG5cdFx0aWYgZmllbGQ/LnR5cGUgYW5kICFmaWVsZC5oaWRkZW5cclxuXHRcdFx0cmV0dXJuIGNvbHVtblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkXHJcblx0Y29sdW1ucyA9IF8uY29tcGFjdCBjb2x1bW5zXHJcblx0aWYgc2V0dGluZyBhbmQgc2V0dGluZy5zZXR0aW5nc1xyXG5cdFx0c29ydCA9IHNldHRpbmcuc2V0dGluZ3NbbGlzdF92aWV3X2lkXT8uc29ydCB8fCBbXVxyXG5cdFx0c29ydCA9IF8ubWFwIHNvcnQsIChvcmRlciktPlxyXG5cdFx0XHRrZXkgPSBvcmRlclswXVxyXG5cdFx0XHRpbmRleCA9IF8uaW5kZXhPZihjb2x1bW5zLCBrZXkpXHJcblx0XHRcdG9yZGVyWzBdID0gaW5kZXggKyAxXHJcblx0XHRcdHJldHVybiBvcmRlclxyXG5cdFx0cmV0dXJuIHNvcnRcclxuXHRyZXR1cm4gW11cclxuXHJcblxyXG5DcmVhdG9yLmluaXRMaXN0Vmlld3MgPSAob2JqZWN0X25hbWUpLT5cclxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXVxyXG5cdGV4dHJhX2NvbHVtbnMgPSBbXCJvd25lclwiXVxyXG5cdGRlZmF1bHRfZXh0cmFfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wib3duZXJcIl1cclxuXHRpZiBkZWZhdWx0X2V4dHJhX2NvbHVtbnNcclxuXHRcdGV4dHJhX2NvbHVtbnMgPSBfLnVuaW9uIGV4dHJhX2NvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1uc1xyXG5cclxuXHRvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQob2JqZWN0X25hbWUpIHx8IFtdXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRDcmVhdG9yLlRhYnVsYXJTZWxlY3RlZElkcz9bb2JqZWN0X25hbWVdID0gW11cclxuXHJcbkNyZWF0b3IuY29udmVydExpc3RWaWV3ID0gKGRlZmF1bHRfY29sdW1lbnMsIGxpc3RfdmlldywgbGlzdF92aWV3X25hbWUpLT5cclxuXHRvaXRlbSA9IF8uY2xvbmUobGlzdF92aWV3KVxyXG5cdGlmICFfLmhhcyhvaXRlbSwgXCJuYW1lXCIpXHJcblx0XHRvaXRlbS5uYW1lID0gbGlzdF92aWV3X25hbWVcclxuXHRpZiAhb2l0ZW0uY29sdW1uc1xyXG5cdFx0aWYgZGVmYXVsdF9jb2x1bWVuc1xyXG5cdFx0XHRvaXRlbS5jb2x1bW5zID0gZGVmYXVsdF9jb2x1bWVuc1xyXG5cdGlmICFvaXRlbS5jb2x1bW5zXHJcblx0XHRvaXRlbS5jb2x1bW5zID0gW1wibmFtZVwiXVxyXG5cdGlmICFvaXRlbS5maWx0ZXJfc2NvcGVcclxuXHRcdCMgbGlzdHZpZXfop4blm77nmoRmaWx0ZXJfc2NvcGXpu5jorqTlgLzmlLnkuLpzcGFjZSAjMTMxXHJcblx0XHRvaXRlbS5maWx0ZXJfc2NvcGUgPSBcInNwYWNlXCJcclxuXHJcblx0aWYgIV8uaGFzKG9pdGVtLCBcIl9pZFwiKVxyXG5cdFx0b2l0ZW0uX2lkID0gbGlzdF92aWV3X25hbWVcclxuXHRlbHNlXHJcblx0XHRvaXRlbS5sYWJlbCA9IG9pdGVtLmxhYmVsIHx8IGxpc3Rfdmlldy5uYW1lXHJcblxyXG5cdGlmIF8uaXNTdHJpbmcob2l0ZW0ub3B0aW9ucylcclxuXHRcdG9pdGVtLm9wdGlvbnMgPSBKU09OLnBhcnNlKG9pdGVtLm9wdGlvbnMpXHJcblxyXG5cdF8uZm9yRWFjaCBvaXRlbS5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cclxuXHRcdGlmICFfLmlzQXJyYXkoZmlsdGVyKSAmJiBfLmlzT2JqZWN0KGZpbHRlcilcclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpbHRlcj8udmFsdWUpXHJcblx0XHRcdFx0XHRmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcoZmlsdGVyPy5fdmFsdWUpXHJcblx0XHRcdFx0XHRmaWx0ZXIudmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXIuX3ZhbHVlfSlcIilcclxuXHRyZXR1cm4gb2l0ZW1cclxuXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRDcmVhdG9yLmdldFJlbGF0ZWRMaXN0ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0XHRsaXN0ID0gW11cclxuXHRcdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpXHJcblxyXG5cdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0X2l0ZW0pIC0+XHJcblx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lXHJcblx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uZm9yZWlnbl9rZXlcclxuXHRcdFx0cmVsYXRlZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkX29iamVjdF9uYW1lKVxyXG5cdFx0XHR1bmxlc3MgcmVsYXRlZF9vYmplY3RcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0Y29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXVxyXG5cdFx0XHRjb2x1bW5zID0gXy53aXRob3V0KGNvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSlcclxuXHJcblx0XHRcdG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChyZWxhdGVkX29iamVjdF9uYW1lKVxyXG5cdFx0XHR0YWJ1bGFyX29yZGVyID0gQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyKG9yZGVyLCBjb2x1bW5zKVxyXG5cclxuXHRcdFx0aWYgL1xcdytcXC5cXCRcXC5cXHcrL2cudGVzdChyZWxhdGVkX2ZpZWxkX25hbWUpXHJcblx0XHRcdFx0IyBvYmplY3TnsbvlnovluKblrZDlsZ7mgKfnmoRyZWxhdGVkX2ZpZWxkX25hbWXopoHljrvmjonkuK3pl7TnmoTnvo7lhYPnrKblj7fvvIzlkKbliJnmmL7npLrkuI3lh7rlrZfmrrXlgLxcclxuXHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX2ZpZWxkX25hbWUucmVwbGFjZSgvXFwkXFwuLyxcIlwiKVxyXG5cdFx0XHRyZWxhdGVkID1cclxuXHRcdFx0XHRvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZVxyXG5cdFx0XHRcdGNvbHVtbnM6IGNvbHVtbnNcclxuXHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWU6IHJlbGF0ZWRfZmllbGRfbmFtZVxyXG5cdFx0XHRcdGlzX2ZpbGU6IHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxyXG5cclxuXHRcdFx0bGlzdC5wdXNoIHJlbGF0ZWRcclxuXHJcblx0XHRyZXR1cm4gbGlzdFxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0cmV0dXJuIF8uZmlyc3QoQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpKVxyXG5cclxuIyMjIFxyXG5cdOWPluWHumxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvu+8jOWmguaenOS4jeWtmOWcqOaIluiAheayoeacieadg+mZkO+8jOWwsei/lOWbnuesrOS4gOS4quinhuWbvlxyXG5cdGV4YWPkuLp0cnVl5pe277yM6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5LiN6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+XHJcbiMjI1xyXG5DcmVhdG9yLmdldExpc3RWaWV3ID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGV4YWMpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFsaXN0X3ZpZXdfaWRcclxuXHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcclxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRpZiAhb2JqZWN0XHJcblx0XHRyZXR1cm5cclxuXHRsaXN0Vmlld3MgPSBDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSlcclxuXHR1bmxlc3MgbGlzdFZpZXdzPy5sZW5ndGhcclxuXHRcdHJldHVyblxyXG5cdGxpc3RfdmlldyA9IF8uZmluZFdoZXJlKGxpc3RWaWV3cyx7XCJfaWRcIjpsaXN0X3ZpZXdfaWR9KVxyXG5cdHVubGVzcyBsaXN0X3ZpZXdcclxuXHRcdCMg5aaC5p6c5LiN6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5YiZ6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+77yM5Y+N5LmL6L+U5Zue56m6XHJcblx0XHRpZiBleGFjXHJcblx0XHRcdHJldHVyblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRsaXN0X3ZpZXcgPSBsaXN0Vmlld3NbMF1cclxuXHRyZXR1cm4gbGlzdF92aWV3XHJcblxyXG4j6I635Y+WbGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+5piv5ZCm5piv5pyA6L+R5p+l55yL6KeG5Zu+XHJcbkNyZWF0b3IuZ2V0TGlzdFZpZXdJc1JlY2VudCA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0XHRpZiAhbGlzdF92aWV3X2lkXHJcblx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXHJcblx0aWYgdHlwZW9mKGxpc3Rfdmlld19pZCkgPT0gXCJzdHJpbmdcIlxyXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0XHRpZiAhb2JqZWN0XHJcblx0XHRcdHJldHVyblxyXG5cdFx0bGlzdFZpZXcgPSBfLmZpbmRXaGVyZShvYmplY3QubGlzdF92aWV3cyx7X2lkOiBsaXN0X3ZpZXdfaWR9KVxyXG5cdGVsc2VcclxuXHRcdGxpc3RWaWV3ID0gbGlzdF92aWV3X2lkXHJcblx0cmV0dXJuIGxpc3RWaWV3Py5uYW1lID09IFwicmVjZW50XCJcclxuXHJcblxyXG4jIyNcclxuICAgIOiOt+WPlum7mOiupOinhuWbvlxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyA9IChvYmplY3RfbmFtZSktPlxyXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGlmICFvYmplY3RcclxuXHRcdG9iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cclxuXHRpZiBvYmplY3Q/Lmxpc3Rfdmlld3M/LmRlZmF1bHRcclxuXHRcdCNUT0RPIOatpOS7o+eggeWPquaYr+aaguaXtuWFvOWuueS7peWJjWNvZGXkuK3lrprkuYnnmoRkZWZhdWx06KeG5Zu+77yM5b6FY29kZeS4reeahGRlZmF1bHTmuIXnkIblrozmiJDlkI7vvIzpnIDopoHliKDpmaTmraTku6PnoIFcclxuXHRcdGRlZmF1bHRWaWV3ID0gb2JqZWN0Lmxpc3Rfdmlld3MuZGVmYXVsdFxyXG5cdGVsc2VcclxuXHRcdF8uZWFjaCBvYmplY3Q/Lmxpc3Rfdmlld3MsIChsaXN0X3ZpZXcsIGtleSktPlxyXG5cdFx0XHRpZiBsaXN0X3ZpZXcubmFtZSA9PSBcImFsbFwiIHx8IGtleSA9PSBcImFsbFwiXHJcblx0XHRcdFx0ZGVmYXVsdFZpZXcgPSBsaXN0X3ZpZXdcclxuXHRyZXR1cm4gZGVmYXVsdFZpZXc7XHJcblxyXG4jIyNcclxuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOaYvuekuuWtl+autVxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IChvYmplY3RfbmFtZSktPlxyXG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcclxuXHRyZXR1cm4gZGVmYXVsdFZpZXc/LmNvbHVtbnNcclxuXHJcbiMjI1xyXG5cdOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOmineWkluWKoOi9veeahOWtl+autVxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zID0gKG9iamVjdF9uYW1lKS0+XHJcblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxyXG5cdHJldHVybiBkZWZhdWx0Vmlldz8uZXh0cmFfY29sdW1uc1xyXG5cclxuIyMjXHJcblx06I635Y+W5a+56LGh55qE6buY6K6k5o6S5bqPXHJcbiMjI1xyXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxyXG5cdGlmIGRlZmF1bHRWaWV3XHJcblx0XHRpZiBkZWZhdWx0Vmlldy5zb3J0XHJcblx0XHRcdHJldHVybiBkZWZhdWx0Vmlldy5zb3J0XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBbW1wiY3JlYXRlZFwiLCBcImRlc2NcIl1dXHJcblxyXG5cclxuIyMjXHJcbiAgICDliKTmlq3mmK/lkKZBbGwgdmlld1xyXG4jIyNcclxuQ3JlYXRvci5pc0FsbFZpZXcgPSAobGlzdF92aWV3KS0+XHJcblx0cmV0dXJuIGxpc3Rfdmlldz8ubmFtZSA9PSBcImFsbFwiXHJcblxyXG4jIyNcclxuICAgIOWIpOaWreaYr+WQpuacgOi/keafpeeciyB2aWV3XHJcbiMjI1xyXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IChsaXN0X3ZpZXcpLT5cclxuXHRyZXR1cm4gbGlzdF92aWV3Py5uYW1lID09IFwicmVjZW50XCJcclxuXHJcbiMjI1xyXG4gICAg5bCGc29ydOi9rOaNouS4ulRhYnVsYXLmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cclxuIyMjXHJcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhciA9IChzb3J0LCB0YWJ1bGFyQ29sdW1ucyktPlxyXG5cdHRhYnVsYXJfc29ydCA9IFtdXHJcblx0Xy5lYWNoIHNvcnQsIChpdGVtKS0+XHJcblx0XHRpZiBfLmlzQXJyYXkoaXRlbSlcclxuXHRcdFx0IyDlhbzlrrnml6fnmoTmlbDmja7moLzlvI9bW1wiZmllbGRfbmFtZVwiLCBcIm9yZGVyXCJdXVxyXG5cdFx0XHRpZiBpdGVtLmxlbmd0aCA9PSAxXHJcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxyXG5cdFx0XHRcdGlmIGNvbHVtbl9pbmRleCA+IC0xXHJcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBcImFzY1wiXVxyXG5cdFx0XHRlbHNlIGlmIGl0ZW0ubGVuZ3RoID09IDJcclxuXHRcdFx0XHRjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pXHJcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcclxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dXHJcblx0XHRlbHNlIGlmIF8uaXNPYmplY3QoaXRlbSlcclxuXHRcdFx0I+aWsOaVsOaNruagvOW8j++8mlt7ZmllbGRfbmFtZTogLCBvcmRlcjogfV1cclxuXHRcdFx0ZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZVxyXG5cdFx0XHRvcmRlciA9IGl0ZW0ub3JkZXJcclxuXHRcdFx0aWYgZmllbGRfbmFtZSAmJiBvcmRlclxyXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSlcclxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxyXG5cdFx0XHRcdFx0dGFidWxhcl9zb3J0LnB1c2ggW2NvbHVtbl9pbmRleCwgb3JkZXJdXHJcblxyXG5cdHJldHVybiB0YWJ1bGFyX3NvcnRcclxuXHJcbiMjI1xyXG4gICAg5bCGc29ydOi9rOaNouS4ukRldkV4cHJlc3Pmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cclxuIyMjXHJcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSAoc29ydCktPlxyXG5cdGR4X3NvcnQgPSBbXVxyXG5cdF8uZWFjaCBzb3J0LCAoaXRlbSktPlxyXG5cdFx0aWYgXy5pc0FycmF5KGl0ZW0pXHJcblx0XHRcdCPlhbzlrrnml6fmoLzlvI/vvJpbW1wiZmllbGRfbmFtZVwiLCBcIm9yZGVyXCJdXVxyXG5cdFx0XHRkeF9zb3J0LnB1c2goaXRlbSlcclxuXHRcdGVsc2UgaWYgXy5pc09iamVjdChpdGVtKVxyXG5cdFx0XHQj5paw5pWw5o2u5qC85byP77yaW3tmaWVsZF9uYW1lOiAsIG9yZGVyOiB9XVxyXG5cdFx0XHRmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lXHJcblx0XHRcdG9yZGVyID0gaXRlbS5vcmRlclxyXG5cdFx0XHRpZiBmaWVsZF9uYW1lICYmIG9yZGVyXHJcblx0XHRcdFx0ZHhfc29ydC5wdXNoIFtmaWVsZF9uYW1lLCBvcmRlcl1cclxuXHJcblx0cmV0dXJuIGR4X3NvcnRcclxuIiwiQ3JlYXRvci5nZXRJbml0V2lkdGhQZXJjZW50ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGNvbHVtbnMpIHtcbiAgdmFyIF9zY2hlbWEsIGNvbHVtbl9udW0sIGluaXRfd2lkdGhfcGVyY2VudCwgcmVmO1xuICBfc2NoZW1hID0gKHJlZiA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5fc2NoZW1hIDogdm9pZCAwO1xuICBjb2x1bW5fbnVtID0gMDtcbiAgaWYgKF9zY2hlbWEpIHtcbiAgICBfLmVhY2goY29sdW1ucywgZnVuY3Rpb24oZmllbGRfbmFtZSkge1xuICAgICAgdmFyIGZpZWxkLCBpc193aWRlLCByZWYxLCByZWYyO1xuICAgICAgZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSk7XG4gICAgICBpc193aWRlID0gKHJlZjEgPSBmaWVsZFtmaWVsZF9uYW1lXSkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjIuaXNfd2lkZSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChpc193aWRlKSB7XG4gICAgICAgIHJldHVybiBjb2x1bW5fbnVtICs9IDI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY29sdW1uX251bSArPSAxO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGluaXRfd2lkdGhfcGVyY2VudCA9IDEwMCAvIGNvbHVtbl9udW07XG4gICAgcmV0dXJuIGluaXRfd2lkdGhfcGVyY2VudDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRGaWVsZElzV2lkZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lKSB7XG4gIHZhciBfc2NoZW1hLCBmaWVsZCwgaXNfd2lkZSwgcmVmLCByZWYxO1xuICBfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpLl9zY2hlbWE7XG4gIGlmIChfc2NoZW1hKSB7XG4gICAgZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSk7XG4gICAgaXNfd2lkZSA9IChyZWYgPSBmaWVsZFtmaWVsZF9uYW1lXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMS5pc193aWRlIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIHJldHVybiBpc193aWRlO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFRhYnVsYXJPcmRlciA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbnMpIHtcbiAgdmFyIG9iaiwgcmVmLCByZWYxLCByZWYyLCBzZXR0aW5nLCBzb3J0O1xuICBzZXR0aW5nID0gKHJlZiA9IENyZWF0b3IuQ29sbGVjdGlvbnMpICE9IG51bGwgPyAocmVmMSA9IHJlZi5zZXR0aW5ncykgIT0gbnVsbCA/IHJlZjEuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgfSkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IF8ubWFwKGNvbHVtbnMsIGZ1bmN0aW9uKGNvbHVtbikge1xuICAgIHZhciBmaWVsZDtcbiAgICBmaWVsZCA9IG9iai5maWVsZHNbY29sdW1uXTtcbiAgICBpZiAoKGZpZWxkICE9IG51bGwgPyBmaWVsZC50eXBlIDogdm9pZCAwKSAmJiAhZmllbGQuaGlkZGVuKSB7XG4gICAgICByZXR1cm4gY29sdW1uO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgfSk7XG4gIGNvbHVtbnMgPSBfLmNvbXBhY3QoY29sdW1ucyk7XG4gIGlmIChzZXR0aW5nICYmIHNldHRpbmcuc2V0dGluZ3MpIHtcbiAgICBzb3J0ID0gKChyZWYyID0gc2V0dGluZy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdKSAhPSBudWxsID8gcmVmMi5zb3J0IDogdm9pZCAwKSB8fCBbXTtcbiAgICBzb3J0ID0gXy5tYXAoc29ydCwgZnVuY3Rpb24ob3JkZXIpIHtcbiAgICAgIHZhciBpbmRleCwga2V5O1xuICAgICAga2V5ID0gb3JkZXJbMF07XG4gICAgICBpbmRleCA9IF8uaW5kZXhPZihjb2x1bW5zLCBrZXkpO1xuICAgICAgb3JkZXJbMF0gPSBpbmRleCArIDE7XG4gICAgICByZXR1cm4gb3JkZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNvcnQ7XG4gIH1cbiAgcmV0dXJuIFtdO1xufTtcblxuQ3JlYXRvci5pbml0TGlzdFZpZXdzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGNvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1ucywgZXh0cmFfY29sdW1ucywgb2JqZWN0LCBvcmRlciwgcmVmO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdO1xuICBleHRyYV9jb2x1bW5zID0gW1wib3duZXJcIl07XG4gIGRlZmF1bHRfZXh0cmFfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wib3duZXJcIl07XG4gIGlmIChkZWZhdWx0X2V4dHJhX2NvbHVtbnMpIHtcbiAgICBleHRyYV9jb2x1bW5zID0gXy51bmlvbihleHRyYV9jb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnMpO1xuICB9XG4gIG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChvYmplY3RfbmFtZSkgfHwgW107XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gKHJlZiA9IENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzKSAhPSBudWxsID8gcmVmW29iamVjdF9uYW1lXSA9IFtdIDogdm9pZCAwO1xuICB9XG59O1xuXG5DcmVhdG9yLmNvbnZlcnRMaXN0VmlldyA9IGZ1bmN0aW9uKGRlZmF1bHRfY29sdW1lbnMsIGxpc3RfdmlldywgbGlzdF92aWV3X25hbWUpIHtcbiAgdmFyIG9pdGVtO1xuICBvaXRlbSA9IF8uY2xvbmUobGlzdF92aWV3KTtcbiAgaWYgKCFfLmhhcyhvaXRlbSwgXCJuYW1lXCIpKSB7XG4gICAgb2l0ZW0ubmFtZSA9IGxpc3Rfdmlld19uYW1lO1xuICB9XG4gIGlmICghb2l0ZW0uY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0X2NvbHVtZW5zKSB7XG4gICAgICBvaXRlbS5jb2x1bW5zID0gZGVmYXVsdF9jb2x1bWVucztcbiAgICB9XG4gIH1cbiAgaWYgKCFvaXRlbS5jb2x1bW5zKSB7XG4gICAgb2l0ZW0uY29sdW1ucyA9IFtcIm5hbWVcIl07XG4gIH1cbiAgaWYgKCFvaXRlbS5maWx0ZXJfc2NvcGUpIHtcbiAgICBvaXRlbS5maWx0ZXJfc2NvcGUgPSBcInNwYWNlXCI7XG4gIH1cbiAgaWYgKCFfLmhhcyhvaXRlbSwgXCJfaWRcIikpIHtcbiAgICBvaXRlbS5faWQgPSBsaXN0X3ZpZXdfbmFtZTtcbiAgfSBlbHNlIHtcbiAgICBvaXRlbS5sYWJlbCA9IG9pdGVtLmxhYmVsIHx8IGxpc3Rfdmlldy5uYW1lO1xuICB9XG4gIGlmIChfLmlzU3RyaW5nKG9pdGVtLm9wdGlvbnMpKSB7XG4gICAgb2l0ZW0ub3B0aW9ucyA9IEpTT04ucGFyc2Uob2l0ZW0ub3B0aW9ucyk7XG4gIH1cbiAgXy5mb3JFYWNoKG9pdGVtLmZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlciwgX2luZGV4KSB7XG4gICAgaWYgKCFfLmlzQXJyYXkoZmlsdGVyKSAmJiBfLmlzT2JqZWN0KGZpbHRlcikpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci52YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm4gZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoXy5pc1N0cmluZyhmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci5fdmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyLl92YWx1ZSArIFwiKVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvaXRlbTtcbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5nZXRSZWxhdGVkTGlzdCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIGxpc3QsIHJlbGF0ZWRfb2JqZWN0cztcbiAgICBsaXN0ID0gW107XG4gICAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSk7XG4gICAgXy5lYWNoKHJlbGF0ZWRfb2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3RfaXRlbSkge1xuICAgICAgdmFyIGNvbHVtbnMsIG9yZGVyLCByZWxhdGVkLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lLCB0YWJ1bGFyX29yZGVyO1xuICAgICAgcmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ub2JqZWN0X25hbWU7XG4gICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLmZvcmVpZ25fa2V5O1xuICAgICAgcmVsYXRlZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICAgIGlmICghcmVsYXRlZF9vYmplY3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXTtcbiAgICAgIGNvbHVtbnMgPSBfLndpdGhvdXQoY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKTtcbiAgICAgIG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChyZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICAgIHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpO1xuICAgICAgaWYgKC9cXHcrXFwuXFwkXFwuXFx3Ky9nLnRlc3QocmVsYXRlZF9maWVsZF9uYW1lKSkge1xuICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX2ZpZWxkX25hbWUucmVwbGFjZSgvXFwkXFwuLywgXCJcIik7XG4gICAgICB9XG4gICAgICByZWxhdGVkID0ge1xuICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgY29sdW1uczogY29sdW1ucyxcbiAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lOiByZWxhdGVkX2ZpZWxkX25hbWUsXG4gICAgICAgIGlzX2ZpbGU6IHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCJcbiAgICAgIH07XG4gICAgICByZXR1cm4gbGlzdC5wdXNoKHJlbGF0ZWQpO1xuICAgIH0pO1xuICAgIHJldHVybiBsaXN0O1xuICB9O1xufVxuXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICByZXR1cm4gXy5maXJzdChDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSkpO1xufTtcblxuXG4vKiBcblx05Y+W5Ye6bGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+77yM5aaC5p6c5LiN5a2Y5Zyo5oiW6ICF5rKh5pyJ5p2D6ZmQ77yM5bCx6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG5cdGV4YWPkuLp0cnVl5pe277yM6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5LiN6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG4gKi9cblxuQ3JlYXRvci5nZXRMaXN0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGV4YWMpIHtcbiAgdmFyIGxpc3RWaWV3cywgbGlzdF92aWV3LCBvYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICB9XG4gIH1cbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsaXN0Vmlld3MgPSBDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSk7XG4gIGlmICghKGxpc3RWaWV3cyAhPSBudWxsID8gbGlzdFZpZXdzLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGlzdF92aWV3ID0gXy5maW5kV2hlcmUobGlzdFZpZXdzLCB7XG4gICAgXCJfaWRcIjogbGlzdF92aWV3X2lkXG4gIH0pO1xuICBpZiAoIWxpc3Rfdmlldykge1xuICAgIGlmIChleGFjKSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3RfdmlldyA9IGxpc3RWaWV3c1swXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxpc3Rfdmlldztcbn07XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdJc1JlY2VudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQpIHtcbiAgdmFyIGxpc3RWaWV3LCBvYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICB9XG4gIH1cbiAgaWYgKHR5cGVvZiBsaXN0X3ZpZXdfaWQgPT09IFwic3RyaW5nXCIpIHtcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKCFvYmplY3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGlzdFZpZXcgPSBfLmZpbmRXaGVyZShvYmplY3QubGlzdF92aWV3cywge1xuICAgICAgX2lkOiBsaXN0X3ZpZXdfaWRcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBsaXN0VmlldyA9IGxpc3Rfdmlld19pZDtcbiAgfVxuICByZXR1cm4gKGxpc3RWaWV3ICE9IG51bGwgPyBsaXN0Vmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJyZWNlbnRcIjtcbn07XG5cblxuLypcbiAgICDojrflj5bpu5jorqTop4blm75cbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRWaWV3LCBvYmplY3QsIHJlZjtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIG9iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gIH1cbiAgaWYgKG9iamVjdCAhPSBudWxsID8gKHJlZiA9IG9iamVjdC5saXN0X3ZpZXdzKSAhPSBudWxsID8gcmVmW1wiZGVmYXVsdFwiXSA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgIGRlZmF1bHRWaWV3ID0gb2JqZWN0Lmxpc3Rfdmlld3NbXCJkZWZhdWx0XCJdO1xuICB9IGVsc2Uge1xuICAgIF8uZWFjaChvYmplY3QgIT0gbnVsbCA/IG9iamVjdC5saXN0X3ZpZXdzIDogdm9pZCAwLCBmdW5jdGlvbihsaXN0X3ZpZXcsIGtleSkge1xuICAgICAgaWYgKGxpc3Rfdmlldy5uYW1lID09PSBcImFsbFwiIHx8IGtleSA9PT0gXCJhbGxcIikge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFZpZXcgPSBsaXN0X3ZpZXc7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWaWV3O1xufTtcblxuXG4vKlxuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOaYvuekuuWtl+autVxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIHJldHVybiBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuY29sdW1ucyA6IHZvaWQgMDtcbn07XG5cblxuLypcblx06I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k6aKd5aSW5Yqg6L2955qE5a2X5q61XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICByZXR1cm4gZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3LmV4dHJhX2NvbHVtbnMgOiB2b2lkIDA7XG59O1xuXG5cbi8qXG5cdOiOt+WPluWvueixoeeahOm7mOiupOaOkuW6j1xuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIGlmIChkZWZhdWx0Vmlldykge1xuICAgIGlmIChkZWZhdWx0Vmlldy5zb3J0KSB7XG4gICAgICByZXR1cm4gZGVmYXVsdFZpZXcuc29ydDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtbXCJjcmVhdGVkXCIsIFwiZGVzY1wiXV07XG4gICAgfVxuICB9XG59O1xuXG5cbi8qXG4gICAg5Yik5pat5piv5ZCmQWxsIHZpZXdcbiAqL1xuXG5DcmVhdG9yLmlzQWxsVmlldyA9IGZ1bmN0aW9uKGxpc3Rfdmlldykge1xuICByZXR1cm4gKGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Lm5hbWUgOiB2b2lkIDApID09PSBcImFsbFwiO1xufTtcblxuXG4vKlxuICAgIOWIpOaWreaYr+WQpuacgOi/keafpeeciyB2aWV3XG4gKi9cblxuQ3JlYXRvci5pc1JlY2VudFZpZXcgPSBmdW5jdGlvbihsaXN0X3ZpZXcpIHtcbiAgcmV0dXJuIChsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJyZWNlbnRcIjtcbn07XG5cblxuLypcbiAgICDlsIZzb3J06L2s5o2i5Li6VGFidWxhcuaOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuICovXG5cbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhciA9IGZ1bmN0aW9uKHNvcnQsIHRhYnVsYXJDb2x1bW5zKSB7XG4gIHZhciB0YWJ1bGFyX3NvcnQ7XG4gIHRhYnVsYXJfc29ydCA9IFtdO1xuICBfLmVhY2goc29ydCwgZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciBjb2x1bW5faW5kZXgsIGZpZWxkX25hbWUsIG9yZGVyO1xuICAgIGlmIChfLmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIGlmIChpdGVtLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pO1xuICAgICAgICBpZiAoY29sdW1uX2luZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGFidWxhcl9zb3J0LnB1c2goW2NvbHVtbl9pbmRleCwgXCJhc2NcIl0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGl0ZW0ubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBpdGVtWzFdXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWU7XG4gICAgICBvcmRlciA9IGl0ZW0ub3JkZXI7XG4gICAgICBpZiAoZmllbGRfbmFtZSAmJiBvcmRlcikge1xuICAgICAgICBjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGZpZWxkX25hbWUpO1xuICAgICAgICBpZiAoY29sdW1uX2luZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGFidWxhcl9zb3J0LnB1c2goW2NvbHVtbl9pbmRleCwgb3JkZXJdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0YWJ1bGFyX3NvcnQ7XG59O1xuXG5cbi8qXG4gICAg5bCGc29ydOi9rOaNouS4ukRldkV4cHJlc3Pmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cbiAqL1xuXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb0RYID0gZnVuY3Rpb24oc29ydCkge1xuICB2YXIgZHhfc29ydDtcbiAgZHhfc29ydCA9IFtdO1xuICBfLmVhY2goc29ydCwgZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciBmaWVsZF9uYW1lLCBvcmRlcjtcbiAgICBpZiAoXy5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gZHhfc29ydC5wdXNoKGl0ZW0pO1xuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZTtcbiAgICAgIG9yZGVyID0gaXRlbS5vcmRlcjtcbiAgICAgIGlmIChmaWVsZF9uYW1lICYmIG9yZGVyKSB7XG4gICAgICAgIHJldHVybiBkeF9zb3J0LnB1c2goW2ZpZWxkX25hbWUsIG9yZGVyXSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGR4X3NvcnQ7XG59O1xuIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dW2EtekEtWjAtOV9dKiQnKVxyXG5cclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0TWV0ZW9yLnN0YXJ0dXAgKCktPlxyXG5cdFx0X3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdXHJcblx0XHRfcmVnRXhNZXNzYWdlcy5wdXNoIHtleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlLCBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yM5LiU5Y+q6IO95YyF5ZCr5a2X5q+N44CB5pWw5a2X44CBX1wifVxyXG5cdFx0U2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcclxuXHRcdFx0cmVnRXg6IF9yZWdFeE1lc3NhZ2VzLFxyXG5cdFx0fSkiLCJTaW1wbGVTY2hlbWEuUmVnRXguY29kZSA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11bYS16QS1aMC05X10qJCcpO1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHZhciBfcmVnRXhNZXNzYWdlcztcbiAgICBfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW107XG4gICAgX3JlZ0V4TWVzc2FnZXMucHVzaCh7XG4gICAgICBleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlLFxuICAgICAgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jOS4lOWPquiDveWMheWQq+Wtl+avjeOAgeaVsOWtl+OAgV9cIlxuICAgIH0pO1xuICAgIHJldHVybiBTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuICAgICAgcmVnRXg6IF9yZWdFeE1lc3NhZ2VzXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVxcXFx3KihcXFxcLlxcXFwkXFxcXC5cXFxcdyspP1thLXpBLVowLTldKiQnKVxyXG5cclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0TWV0ZW9yLnN0YXJ0dXAgKCktPlxyXG5cdFx0X3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdXHJcblx0XHRfcmVnRXhNZXNzYWdlcy5wdXNoIHtleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCwgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jC4kLuWJjeWQjuW/hemhu+WMheWQq+Wtl+esplwifVxyXG5cdFx0U2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcclxuXHRcdFx0cmVnRXg6IF9yZWdFeE1lc3NhZ2VzLFxyXG5cdFx0fSkiLCJTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dXFxcXHcqKFxcXFwuXFxcXCRcXFxcLlxcXFx3Kyk/W2EtekEtWjAtOV0qJCcpO1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHZhciBfcmVnRXhNZXNzYWdlcztcbiAgICBfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW107XG4gICAgX3JlZ0V4TWVzc2FnZXMucHVzaCh7XG4gICAgICBleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCxcbiAgICAgIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIwuJC7liY3lkI7lv4XpobvljIXlkKvlrZfnrKZcIlxuICAgIH0pO1xuICAgIHJldHVybiBTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuICAgICAgcmVnRXg6IF9yZWdFeE1lc3NhZ2VzXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiLy8g5Zug5Li6bWV0ZW9y57yW6K+RY29mZmVlc2NyaXB05Lya5a+86Ie0ZXZhbOWHveaVsOaKpemUme+8jOaJgOS7peWNleeLrOWGmeWcqOS4gOS4qmpz5paH5Lu25Lit44CCXHJcbkNyZWF0b3IuZXZhbEluQ29udGV4dCA9IGZ1bmN0aW9uKGpzLCBjb250ZXh0KSB7XHJcbiAgICAvLyMgUmV0dXJuIHRoZSByZXN1bHRzIG9mIHRoZSBpbi1saW5lIGFub255bW91cyBmdW5jdGlvbiB3ZSAuY2FsbCB3aXRoIHRoZSBwYXNzZWQgY29udGV4dFxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkgeyBcclxuICAgIFx0cmV0dXJuIGV2YWwoanMpOyBcclxuXHR9LmNhbGwoY29udGV4dCk7XHJcbn1cclxuXHJcblxyXG5DcmVhdG9yLmV2YWwgPSBmdW5jdGlvbihqcyl7XHJcblx0cmV0dXJuIGV2YWwoanMpXHJcbn0iLCJcdGdldE9wdGlvbiA9IChvcHRpb24pLT5cclxuXHRcdGZvbyA9IG9wdGlvbi5zcGxpdChcIjpcIilcclxuXHRcdGlmIGZvby5sZW5ndGggPiAxXHJcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1sxXX1cclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzBdfVxyXG5cclxuXHRDcmVhdG9yLmNvbnZlcnRPYmplY3QgPSAob2JqZWN0KS0+XHJcblx0XHRfLmZvckVhY2ggb2JqZWN0LnRyaWdnZXJzLCAodHJpZ2dlciwga2V5KS0+XHJcblxyXG5cdFx0XHRpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT0gXCJzZXJ2ZXJcIikgfHwgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCIpXHJcblx0XHRcdFx0X3RvZG9fZnJvbV9jb2RlID0gdHJpZ2dlcj8uX3RvZG9cclxuXHRcdFx0XHRfdG9kb19mcm9tX2RiID0gdHJpZ2dlci50b2RvXHJcblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKVxyXG5cdFx0XHRcdFx0dHJpZ2dlci50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9jb2RlfSlcIilcclxuXHJcblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpXHJcblx0XHRcdFx0XHQj5Y+q5pyJdXBkYXRl5pe277yMIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zIOaJjeacieWAvFxyXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YeP77yM5bCk5YW25pivQ29sbGVjdGlvblxyXG5cdFx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcclxuXHRcdFx0XHRcdFx0dHJpZ2dlci50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9kYn0pXCIpXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIihmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpeyN7X3RvZG9fZnJvbV9kYn19KVwiKVxyXG5cclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT0gXCJjbGllbnRcIlxyXG5cdFx0XHRcdF90b2RvID0gdHJpZ2dlci50b2RvXHJcblx0XHRcdFx0aWYgX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKVxyXG5cdFx0XHRcdFx0dHJpZ2dlci5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKClcclxuXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5hY3Rpb25zLCAoYWN0aW9uLCBrZXkpLT5cclxuXHRcdFx0XHRfdG9kb19mcm9tX2NvZGUgPSBhY3Rpb24/Ll90b2RvXHJcblx0XHRcdFx0X3RvZG9fZnJvbV9kYiA9IGFjdGlvbj8udG9kb1xyXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSlcclxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj1xyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9jb2RlfSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0b2RvX2Zyb21fY29kZVwiLCBfdG9kb19mcm9tX2NvZGVcclxuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYilcclxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj1xyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXHJcblx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2RifSlcIilcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihDcmVhdG9yLmFjdGlvbnNCeU5hbWVbX3RvZG9fZnJvbV9kYl0pXHJcblx0XHRcdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IF90b2RvX2Zyb21fZGJcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIihmdW5jdGlvbigpeyN7X3RvZG9fZnJvbV9kYn19KVwiKVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcInRvZG9fZnJvbV9kYlwiLCBfdG9kb19mcm9tX2RiLCBlcnJvclxyXG5cclxuXHRcdFx0XHRfdmlzaWJsZSA9IGFjdGlvbj8uX3Zpc2libGVcclxuXHRcdFx0XHRpZiBfdmlzaWJsZVxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGFjdGlvbi52aXNpYmxlID0gQ3JlYXRvci5ldmFsKFwiKCN7X3Zpc2libGV9KVwiKVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImFjdGlvbi52aXNpYmxlIHRvIGZ1bmN0aW9uIGVycm9yOiBcIiwgZXJyb3IsIF92aXNpYmxlXHJcblx0XHRlbHNlXHJcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XHJcblx0XHRcdFx0X3RvZG8gPSBhY3Rpb24/LnRvZG9cclxuXHRcdFx0XHRpZiBfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pXHJcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cclxuXHRcdFx0XHRcdGFjdGlvbi5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKClcclxuXHJcblx0XHRcdFx0X3Zpc2libGUgPSBhY3Rpb24/LnZpc2libGVcclxuXHJcblx0XHRcdFx0aWYgX3Zpc2libGUgJiYgXy5pc0Z1bmN0aW9uKF92aXNpYmxlKVxyXG5cdFx0XHRcdFx0YWN0aW9uLl92aXNpYmxlID0gX3Zpc2libGUudG9TdHJpbmcoKVxyXG5cclxuXHRcdF8uZm9yRWFjaCBvYmplY3QuZmllbGRzLCAoZmllbGQsIGtleSktPlxyXG5cdFx0XHRpZiBmaWVsZC5vcHRpb25zICYmIF8uaXNTdHJpbmcoZmllbGQub3B0aW9ucylcclxuXHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdF9vcHRpb25zID0gW11cclxuXHRcdFx0XHRcdCPmlK/mjIFcXG7miJbogIXoi7HmlofpgJflj7fliIblibIsXHJcblx0XHRcdFx0XHRfLmZvckVhY2ggZmllbGQub3B0aW9ucy5zcGxpdChcIlxcblwiKSwgKG9wdGlvbiktPlxyXG5cdFx0XHRcdFx0XHRpZiBvcHRpb24uaW5kZXhPZihcIixcIilcclxuXHRcdFx0XHRcdFx0XHRvcHRpb25zID0gb3B0aW9uLnNwbGl0KFwiLFwiKVxyXG5cdFx0XHRcdFx0XHRcdF8uZm9yRWFjaCBvcHRpb25zLCAoX29wdGlvbiktPlxyXG5cdFx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24oX29wdGlvbikpXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKVxyXG5cdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXHJcblx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yXHJcblxyXG5cdFx0XHRlbHNlIGlmIGZpZWxkLm9wdGlvbnMgJiYgIV8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zKSAmJiAhXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpICYmIF8uaXNPYmplY3QoZmllbGQub3B0aW9ucylcclxuXHRcdFx0XHRfb3B0aW9ucyA9IFtdXHJcblx0XHRcdFx0Xy5lYWNoIGZpZWxkLm9wdGlvbnMsICh2LCBrKS0+XHJcblx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogdiwgdmFsdWU6IGt9XHJcblx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRvcHRpb25zID0gZmllbGQub3B0aW9uc1xyXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnMpXHJcblx0XHRcdFx0XHRmaWVsZC5fb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnMudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0b3B0aW9ucyA9IGZpZWxkLl9vcHRpb25zXHJcblx0XHRcdFx0aWYgb3B0aW9ucyAmJiBfLmlzU3RyaW5nKG9wdGlvbnMpXHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IENyZWF0b3IuZXZhbChcIigje29wdGlvbnN9KVwiKVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxyXG5cclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0cmVnRXggPSBmaWVsZC5yZWdFeFxyXG5cdFx0XHRcdGlmIHJlZ0V4XHJcblx0XHRcdFx0XHRmaWVsZC5fcmVnRXggPSBmaWVsZC5yZWdFeC50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLl9yZWdFeFxyXG5cdFx0XHRcdGlmIHJlZ0V4XHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0ZmllbGQucmVnRXggPSBDcmVhdG9yLmV2YWwoXCIoI3tyZWdFeH0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRpZiBmaWVsZC5hdXRvZm9ybVxyXG5cdFx0XHRcdFx0X3R5cGUgPSBmaWVsZC5hdXRvZm9ybS50eXBlXHJcblx0XHRcdFx0XHRpZiBfdHlwZSAmJiBfLmlzRnVuY3Rpb24oX3R5cGUpICYmIF90eXBlICE9IE9iamVjdCAmJiBfdHlwZSAhPSBTdHJpbmcgJiYgX3R5cGUgIT0gTnVtYmVyICYmIF90eXBlICE9IEJvb2xlYW4gJiYgIV8uaXNBcnJheShfdHlwZSlcclxuXHRcdFx0XHRcdFx0ZmllbGQuYXV0b2Zvcm0uX3R5cGUgPSBfdHlwZS50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiBmaWVsZC5hdXRvZm9ybVxyXG5cdFx0XHRcdFx0X3R5cGUgPSBmaWVsZC5hdXRvZm9ybS5fdHlwZVxyXG5cdFx0XHRcdFx0aWYgX3R5cGUgJiYgXy5pc1N0cmluZyhfdHlwZSlcclxuXHRcdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdFx0ZmllbGQuYXV0b2Zvcm0udHlwZSA9IENyZWF0b3IuZXZhbChcIigje190eXBlfSlcIilcclxuXHRcdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBmaWVsZCAtPiB0eXBlIGVycm9yXCIsIGZpZWxkLCBlcnJvclxyXG5cclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblxyXG5cdFx0XHRcdG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxyXG5cdFx0XHRcdHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xyXG5cdFx0XHRcdGNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb25cclxuXHRcdFx0XHRiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cclxuXHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5maWx0ZXJzRnVuY3Rpb25cclxuXHJcblx0XHRcdFx0aWYgb3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihvcHRpb25zRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uID0gb3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKClcclxuXHJcblx0XHRcdFx0aWYgcmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRmaWVsZC5fcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvLnRvU3RyaW5nKClcclxuXHJcblx0XHRcdFx0aWYgY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGNyZWF0ZUZ1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuX2NyZWF0ZUZ1bmN0aW9uID0gY3JlYXRlRnVuY3Rpb24udG9TdHJpbmcoKVxyXG5cdFx0XHRcdGlmIGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oYmVmb3JlT3BlbkZ1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvbiA9IGJlZm9yZU9wZW5GdW5jdGlvbi50b1N0cmluZygpXHJcblxyXG5cdFx0XHRcdGlmIGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmlsdGVyc0Z1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHJcblx0XHRcdFx0b3B0aW9uc0Z1bmN0aW9uID0gZmllbGQuX29wdGlvbnNGdW5jdGlvbiB8fCBmaWVsZC5vcHRpb25zRnVuY3Rpb25cclxuXHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBmaWVsZC5fcmVmZXJlbmNlX3RvXHJcblx0XHRcdFx0Y3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5fY3JlYXRlRnVuY3Rpb25cclxuXHRcdFx0XHRiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uXHJcblx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuX2ZpbHRlcnNGdW5jdGlvblxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhvcHRpb25zRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tvcHRpb25zRnVuY3Rpb259KVwiKVxyXG5cclxuXHRcdFx0XHRpZiByZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRmaWVsZC5yZWZlcmVuY2VfdG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tyZWZlcmVuY2VfdG99KVwiKVxyXG5cclxuXHRcdFx0XHRpZiBjcmVhdGVGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGNyZWF0ZUZ1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tjcmVhdGVGdW5jdGlvbn0pXCIpXHJcblxyXG5cdFx0XHRcdGlmIGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGJlZm9yZU9wZW5GdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2JlZm9yZU9wZW5GdW5jdGlvbn0pXCIpXHJcblxyXG5cdFx0XHRcdGlmIGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGZpbHRlcnNGdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlcnNGdW5jdGlvbn0pXCIpXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcclxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSlcclxuXHRcdFx0XHRcdGZpZWxkLl9kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWUudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZGVmYXVsdFZhbHVlID0gZmllbGQuX2RlZmF1bHRWYWx1ZVxyXG5cclxuXHRcdFx0XHRpZiAhZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZmllbGQuZGVmYXVsdFZhbHVlKSAmJiBmaWVsZC5kZWZhdWx0VmFsdWUuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXHJcblx0XHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcclxuXHJcblx0XHRcdFx0aWYgZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZGVmYXVsdFZhbHVlKVxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLmRlZmF1bHRWYWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2RlZmF1bHRWYWx1ZX0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXHJcblx0XHRcdFxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRpZiBpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc0Z1bmN0aW9uKGlzX2NvbXBhbnlfbGltaXRlZClcclxuXHRcdFx0XHRcdGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdGlmIGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzU3RyaW5nKGlzX2NvbXBhbnlfbGltaXRlZClcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPSBDcmVhdG9yLmV2YWwoXCIoI3tpc19jb21wYW55X2xpbWl0ZWR9KVwiKVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxyXG5cclxuXHRcdF8uZm9yRWFjaCBvYmplY3QubGlzdF92aWV3cywgKGxpc3Rfdmlldywga2V5KSAtPlxyXG5cdFx0XHQjIyNcclxuXHRcdFx06KeG5Zu+6L+H6JmR5Zmo6ZyA6KaB5pSv5oyBZnVuY3Rpb27vvIzlkI7lj7DovazmiJDlrZfnrKbkuLLvvIzliY3lj7BldmFs5oiQ5Ye95pWwXHJcblx0XHRcdOiuqei/h+iZkeWZqOaUr+aMgeS4pOenjWZ1bmN0aW9u5pa55byP77yaXHJcblx0XHRcdDEuIOaVtOS4qmZpbHRlcnPkuLpmdW5jdGlvbjpcclxuXHRcdFx05aaC77yaXHJcblx0XHRcdGZpbHRlcnM6ICgpLT5cclxuXHRcdFx0XHRyZXR1cm4gW1tbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwicHJvamVjdF9pc3N1ZXNcIl0sJ29yJyxbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwidGFza3NcIl1dXVxyXG5cdFx0XHQyLiBmaWx0ZXJz5YaF55qEZmlsdGVyLnZhbHVl5Li6ZnVuY3Rpb25cclxuXHRcdFx05aaC77yaXHJcblx0XHRcdGZpbHRlcnM6IFtbXCJvYmplY3RfbmFtZVwiLCBcIj1cIiwgKCktPlxyXG5cdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcclxuXHRcdFx0XV1cclxuXHRcdFx05oiWXHJcblx0XHRcdGZpbHRlcnM6IFt7XHJcblx0XHRcdFx0XCJmaWVsZFwiOiBcIm9iamVjdF9uYW1lXCJcclxuXHRcdFx0XHRcIm9wZXJhdGlvblwiOiBcIj1cIlxyXG5cdFx0XHRcdFwidmFsdWVcIjogKCktPlxyXG5cdFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxyXG5cdFx0XHR9XVxyXG5cdFx0XHQjIyNcclxuXHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGxpc3Rfdmlldy5maWx0ZXJzKVxyXG5cdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdFx0bGlzdF92aWV3Ll9maWx0ZXJzID0gbGlzdF92aWV3LmZpbHRlcnMudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlIGlmIF8uaXNTdHJpbmcobGlzdF92aWV3Ll9maWx0ZXJzKVxyXG5cdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdFx0bGlzdF92aWV3LmZpbHRlcnMgPSBDcmVhdG9yLmV2YWwoXCIoI3tsaXN0X3ZpZXcuX2ZpbHRlcnN9KVwiKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Xy5mb3JFYWNoIGxpc3Rfdmlldy5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cclxuXHRcdFx0XHRcdGlmIF8uaXNBcnJheShmaWx0ZXIpXHJcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0Z1bmN0aW9uKGZpbHRlclsyXSlcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IGZpbHRlclsyXS50b1N0cmluZygpXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkZVTkNUSU9OXCJcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0RhdGUoZmlsdGVyWzJdKVxyXG5cdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpzmmK9EYXRl57G75Z6L77yM5YiZZmlsdGVyWzJd5YC85Yiw5YmN56uv5Lya6Ieq5Yqo6L2s5oiQ5a2X56ym5Liy77yM5qC85byP77yaXCIyMDE4LTAzLTI5VDAzOjQzOjIxLjc4N1pcIlxyXG5cdFx0XHRcdFx0XHRcdFx0IyDljIXmi6xncmlk5YiX6KGo6K+35rGC55qE5o6l5Y+j5Zyo5YaF55qE5omA5pyJT0RhdGHmjqXlj6PvvIxEYXRl57G75Z6L5a2X5q616YO95Lya5Lul5LiK6L+w5qC85byP6L+U5ZueXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkRBVEVcIlxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0aWYgZmlsdGVyLmxlbmd0aCA9PSA0IGFuZCBfLmlzU3RyaW5nKGZpbHRlclsyXSkgYW5kIGZpbHRlclszXSA9PSBcIkZVTkNUSU9OXCJcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlclsyXX0pXCIpXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIucG9wKClcclxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDQgYW5kIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSBhbmQgZmlsdGVyWzNdID09IFwiREFURVwiXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBuZXcgRGF0ZShmaWx0ZXJbMl0pXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIucG9wKClcclxuXHRcdFx0XHRcdGVsc2UgaWYgXy5pc09iamVjdChmaWx0ZXIpXHJcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihmaWx0ZXI/LnZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRGF0ZShmaWx0ZXI/LnZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLl9pc19kYXRlID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWx0ZXI/Ll92YWx1ZSlcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlci5fdmFsdWV9KVwiKVxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgZmlsdGVyLl9pc19kYXRlID09IHRydWVcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSlcclxuXHRcdHJldHVybiBvYmplY3RcclxuXHJcblxyXG4iLCJ2YXIgZ2V0T3B0aW9uO1xuXG5nZXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgdmFyIGZvbztcbiAgZm9vID0gb3B0aW9uLnNwbGl0KFwiOlwiKTtcbiAgaWYgKGZvby5sZW5ndGggPiAxKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzFdXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMF1cbiAgICB9O1xuICB9XG59O1xuXG5DcmVhdG9yLmNvbnZlcnRPYmplY3QgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgXy5mb3JFYWNoKG9iamVjdC50cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlciwga2V5KSB7XG4gICAgdmFyIF90b2RvLCBfdG9kb19mcm9tX2NvZGUsIF90b2RvX2Zyb21fZGI7XG4gICAgaWYgKChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJzZXJ2ZXJcIikgfHwgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiKSkge1xuICAgICAgX3RvZG9fZnJvbV9jb2RlID0gdHJpZ2dlciAhPSBudWxsID8gdHJpZ2dlci5fdG9kbyA6IHZvaWQgMDtcbiAgICAgIF90b2RvX2Zyb21fZGIgPSB0cmlnZ2VyLnRvZG87XG4gICAgICBpZiAoX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKSkge1xuICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fY29kZSArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYikpIHtcbiAgICAgICAgaWYgKF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2RiICsgXCIpXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKGZ1bmN0aW9uKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyl7XCIgKyBfdG9kb19mcm9tX2RiICsgXCJ9KVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIpIHtcbiAgICAgIF90b2RvID0gdHJpZ2dlci50b2RvO1xuICAgICAgaWYgKF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbykpIHtcbiAgICAgICAgcmV0dXJuIHRyaWdnZXIuX3RvZG8gPSBfdG9kby50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LmFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbiwga2V5KSB7XG4gICAgICB2YXIgX3RvZG9fZnJvbV9jb2RlLCBfdG9kb19mcm9tX2RiLCBfdmlzaWJsZSwgZXJyb3I7XG4gICAgICBfdG9kb19mcm9tX2NvZGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi5fdG9kbyA6IHZvaWQgMDtcbiAgICAgIF90b2RvX2Zyb21fZGIgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwO1xuICAgICAgaWYgKF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9jb2RlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwidG9kb19mcm9tX2NvZGVcIiwgX3RvZG9fZnJvbV9jb2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fZGIgKyBcIilcIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oQ3JlYXRvci5hY3Rpb25zQnlOYW1lW190b2RvX2Zyb21fZGJdKSkge1xuICAgICAgICAgICAgICBhY3Rpb24udG9kbyA9IF90b2RvX2Zyb21fZGI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKGZ1bmN0aW9uKCl7XCIgKyBfdG9kb19mcm9tX2RiICsgXCJ9KVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0b2RvX2Zyb21fZGJcIiwgX3RvZG9fZnJvbV9kYiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBfdmlzaWJsZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLl92aXNpYmxlIDogdm9pZCAwO1xuICAgICAgaWYgKF92aXNpYmxlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGFjdGlvbi52aXNpYmxlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdmlzaWJsZSArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJhY3Rpb24udmlzaWJsZSB0byBmdW5jdGlvbiBlcnJvcjogXCIsIGVycm9yLCBfdmlzaWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LmFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbiwga2V5KSB7XG4gICAgICB2YXIgX3RvZG8sIF92aXNpYmxlO1xuICAgICAgX3RvZG8gPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwO1xuICAgICAgaWYgKF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbykpIHtcbiAgICAgICAgYWN0aW9uLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIF92aXNpYmxlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udmlzaWJsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChfdmlzaWJsZSAmJiBfLmlzRnVuY3Rpb24oX3Zpc2libGUpKSB7XG4gICAgICAgIHJldHVybiBhY3Rpb24uX3Zpc2libGUgPSBfdmlzaWJsZS50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIF8uZm9yRWFjaChvYmplY3QuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwga2V5KSB7XG4gICAgdmFyIF9vcHRpb25zLCBfdHlwZSwgYmVmb3JlT3BlbkZ1bmN0aW9uLCBjcmVhdGVGdW5jdGlvbiwgZGVmYXVsdFZhbHVlLCBlcnJvciwgZmlsdGVyc0Z1bmN0aW9uLCBpc19jb21wYW55X2xpbWl0ZWQsIG9wdGlvbnMsIG9wdGlvbnNGdW5jdGlvbiwgcmVmZXJlbmNlX3RvLCByZWdFeDtcbiAgICBpZiAoZmllbGQub3B0aW9ucyAmJiBfLmlzU3RyaW5nKGZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goZmllbGQub3B0aW9ucy5zcGxpdChcIlxcblwiKSwgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgdmFyIG9wdGlvbnM7XG4gICAgICAgICAgaWYgKG9wdGlvbi5pbmRleE9mKFwiLFwiKSkge1xuICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbi5zcGxpdChcIixcIik7XG4gICAgICAgICAgICByZXR1cm4gXy5mb3JFYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKF9vcHRpb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKF9vcHRpb24pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmllbGQub3B0aW9ucyA9IF9vcHRpb25zO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC5vcHRpb25zICYmICFfLmlzRnVuY3Rpb24oZmllbGQub3B0aW9ucykgJiYgIV8uaXNBcnJheShmaWVsZC5vcHRpb25zKSAmJiBfLmlzT2JqZWN0KGZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgXy5lYWNoKGZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiB2LFxuICAgICAgICAgIHZhbHVlOiBrXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgaWYgKG9wdGlvbnMgJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnMpKSB7XG4gICAgICAgIGZpZWxkLl9vcHRpb25zID0gZmllbGQub3B0aW9ucy50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zID0gZmllbGQuX29wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzU3RyaW5nKG9wdGlvbnMpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQub3B0aW9ucyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgb3B0aW9ucyArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIHJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgICBpZiAocmVnRXgpIHtcbiAgICAgICAgZmllbGQuX3JlZ0V4ID0gZmllbGQucmVnRXgudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVnRXggPSBmaWVsZC5fcmVnRXg7XG4gICAgICBpZiAocmVnRXgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5yZWdFeCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgcmVnRXggKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBpZiAoZmllbGQuYXV0b2Zvcm0pIHtcbiAgICAgICAgX3R5cGUgPSBmaWVsZC5hdXRvZm9ybS50eXBlO1xuICAgICAgICBpZiAoX3R5cGUgJiYgXy5pc0Z1bmN0aW9uKF90eXBlKSAmJiBfdHlwZSAhPT0gT2JqZWN0ICYmIF90eXBlICE9PSBTdHJpbmcgJiYgX3R5cGUgIT09IE51bWJlciAmJiBfdHlwZSAhPT0gQm9vbGVhbiAmJiAhXy5pc0FycmF5KF90eXBlKSkge1xuICAgICAgICAgIGZpZWxkLmF1dG9mb3JtLl90eXBlID0gX3R5cGUudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZmllbGQuYXV0b2Zvcm0pIHtcbiAgICAgICAgX3R5cGUgPSBmaWVsZC5hdXRvZm9ybS5fdHlwZTtcbiAgICAgICAgaWYgKF90eXBlICYmIF8uaXNTdHJpbmcoX3R5cGUpKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZpZWxkLmF1dG9mb3JtLnR5cGUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90eXBlICsgXCIpXCIpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBmaWVsZCAtPiB0eXBlIGVycm9yXCIsIGZpZWxkLCBlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgIHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgIGNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb247XG4gICAgICBiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICBmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5maWx0ZXJzRnVuY3Rpb247XG4gICAgICBpZiAob3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihvcHRpb25zRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9vcHRpb25zRnVuY3Rpb24gPSBvcHRpb25zRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZWZlcmVuY2VfdG8gJiYgXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgZmllbGQuX3JlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90by50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihjcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX2NyZWF0ZUZ1bmN0aW9uID0gY3JlYXRlRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGJlZm9yZU9wZW5GdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvbiA9IGJlZm9yZU9wZW5GdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmlsdGVyc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uID0gZmlsdGVyc0Z1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLl9vcHRpb25zRnVuY3Rpb24gfHwgZmllbGQub3B0aW9uc0Z1bmN0aW9uO1xuICAgICAgcmVmZXJlbmNlX3RvID0gZmllbGQuX3JlZmVyZW5jZV90bztcbiAgICAgIGNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuX2NyZWF0ZUZ1bmN0aW9uO1xuICAgICAgYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgIGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLl9maWx0ZXJzRnVuY3Rpb247XG4gICAgICBpZiAob3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcob3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5vcHRpb25zRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIG9wdGlvbnNGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIGZpZWxkLnJlZmVyZW5jZV90byA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgcmVmZXJlbmNlX3RvICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmNyZWF0ZUZ1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBjcmVhdGVGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhiZWZvcmVPcGVuRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgYmVmb3JlT3BlbkZ1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGZpbHRlcnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuZmlsdGVyc0Z1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXJzRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgIGlmIChkZWZhdWx0VmFsdWUgJiYgXy5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgZmllbGQuX2RlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZS50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5fZGVmYXVsdFZhbHVlO1xuICAgICAgaWYgKCFkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhmaWVsZC5kZWZhdWx0VmFsdWUpICYmIGZpZWxkLmRlZmF1bHRWYWx1ZS5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGRlZmF1bHRWYWx1ZSArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgIGlmIChpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc0Z1bmN0aW9uKGlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgIGlmIChpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc1N0cmluZyhpc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgaXNfY29tcGFueV9saW1pdGVkICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgXy5mb3JFYWNoKG9iamVjdC5saXN0X3ZpZXdzLCBmdW5jdGlvbihsaXN0X3ZpZXcsIGtleSkge1xuXG4gICAgLypcbiAgICBcdFx0XHTop4blm77ov4fomZHlmajpnIDopoHmlK/mjIFmdW5jdGlvbu+8jOWQjuWPsOi9rOaIkOWtl+espuS4su+8jOWJjeWPsGV2YWzmiJDlh73mlbBcbiAgICBcdFx0XHTorqnov4fomZHlmajmlK/mjIHkuKTnp41mdW5jdGlvbuaWueW8j++8mlxuICAgIFx0XHRcdDEuIOaVtOS4qmZpbHRlcnPkuLpmdW5jdGlvbjpcbiAgICBcdFx0XHTlpoLvvJpcbiAgICBcdFx0XHRmaWx0ZXJzOiAoKS0+XG4gICAgXHRcdFx0XHRyZXR1cm4gW1tbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwicHJvamVjdF9pc3N1ZXNcIl0sJ29yJyxbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwidGFza3NcIl1dXVxuICAgIFx0XHRcdDIuIGZpbHRlcnPlhoXnmoRmaWx0ZXIudmFsdWXkuLpmdW5jdGlvblxuICAgIFx0XHRcdOWmgu+8mlxuICAgIFx0XHRcdGZpbHRlcnM6IFtbXCJvYmplY3RfbmFtZVwiLCBcIj1cIiwgKCktPlxuICAgIFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuICAgIFx0XHRcdF1dXG4gICAgXHRcdFx05oiWXG4gICAgXHRcdFx0ZmlsdGVyczogW3tcbiAgICBcdFx0XHRcdFwiZmllbGRcIjogXCJvYmplY3RfbmFtZVwiXG4gICAgXHRcdFx0XHRcIm9wZXJhdGlvblwiOiBcIj1cIlxuICAgIFx0XHRcdFx0XCJ2YWx1ZVwiOiAoKS0+XG4gICAgXHRcdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcbiAgICBcdFx0XHR9XVxuICAgICAqL1xuICAgIGlmIChfLmlzRnVuY3Rpb24obGlzdF92aWV3LmZpbHRlcnMpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXcuX2ZpbHRlcnMgPSBsaXN0X3ZpZXcuZmlsdGVycy50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXy5pc1N0cmluZyhsaXN0X3ZpZXcuX2ZpbHRlcnMpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXcuZmlsdGVycyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbGlzdF92aWV3Ll9maWx0ZXJzICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXy5mb3JFYWNoKGxpc3Rfdmlldy5maWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIsIF9pbmRleCkge1xuICAgICAgICBpZiAoXy5pc0FycmF5KGZpbHRlcikpIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gMyAmJiBfLmlzRnVuY3Rpb24oZmlsdGVyWzJdKSkge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBmaWx0ZXJbMl0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlclszXSA9IFwiRlVOQ1RJT05cIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gMyAmJiBfLmlzRGF0ZShmaWx0ZXJbMl0pKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXJbM10gPSBcIkRBVEVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZpbHRlci5sZW5ndGggPT09IDQgJiYgXy5pc1N0cmluZyhmaWx0ZXJbMl0pICYmIGZpbHRlclszXSA9PT0gXCJGVU5DVElPTlwiKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyWzJdICsgXCIpXCIpO1xuICAgICAgICAgICAgICBmaWx0ZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gNCAmJiBfLmlzU3RyaW5nKGZpbHRlclsyXSkgJiYgZmlsdGVyWzNdID09PSBcIkRBVEVcIikge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBuZXcgRGF0ZShmaWx0ZXJbMl0pO1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGZpbHRlcikpIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRGF0ZShmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci52YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5faXNfZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChfLmlzU3RyaW5nKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLl92YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyLl92YWx1ZSArIFwiKVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLl9pc19kYXRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBuZXcgRGF0ZShmaWx0ZXIudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJDcmVhdG9yLkZvcm11bGFyID0ge31cclxuXHJcbkNyZWF0b3IuRm9ybXVsYXIuUFJFRklYID0gXCJfVkFMVUVTXCJcclxuXHJcbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gKHByZWZpeCxmaWVsZFZhcmlhYmxlKS0+XHJcblx0cmVnID0gLyhcXHtbXnt9XSpcXH0pL2c7XHJcblxyXG5cdHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZSByZWcsIChtLCAkMSktPlxyXG5cdFx0cmV0dXJuIHByZWZpeCArICQxLnJlcGxhY2UoL1xce1xccyovLFwiW1xcXCJcIikucmVwbGFjZSgvXFxzKlxcfS8sXCJcXFwiXVwiKS5yZXBsYWNlKC9cXHMqXFwuXFxzKi9nLFwiXFxcIl1bXFxcIlwiKTtcclxuXHJcblx0cmV0dXJuIHJldlxyXG5cclxuQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEgPSAoZm9ybXVsYV9zdHIpLT5cclxuXHRpZiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTFcclxuXHRcdHJldHVybiB0cnVlXHJcblx0cmV0dXJuIGZhbHNlXHJcblxyXG5DcmVhdG9yLkZvcm11bGFyLnJ1biA9IChmb3JtdWxhX3N0ciwgX0NPTlRFWFQsIG9wdGlvbnMpLT5cclxuXHRpZiBmb3JtdWxhX3N0ciAmJiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKVxyXG5cclxuXHRcdGlmICFfLmlzQm9vbGVhbihvcHRpb25zPy5leHRlbmQpXHJcblx0XHRcdGV4dGVuZCA9IHRydWVcclxuXHJcblx0XHRfVkFMVUVTID0ge31cclxuXHRcdF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBfQ09OVEVYVClcclxuXHRcdGlmIGV4dGVuZFxyXG5cdFx0XHRfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgQ3JlYXRvci5nZXRVc2VyQ29udGV4dChvcHRpb25zPy51c2VySWQsIG9wdGlvbnM/LnNwYWNlSWQpKVxyXG5cdFx0Zm9ybXVsYV9zdHIgPSBDcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYShcInRoaXNcIiwgZm9ybXVsYV9zdHIpXHJcblxyXG5cdFx0dHJ5XHJcblx0XHRcdGRhdGEgPSBDcmVhdG9yLmV2YWxJbkNvbnRleHQoZm9ybXVsYV9zdHIsIF9WQUxVRVMpICAgIyDmraTlpITkuI3og73nlKh3aW5kb3cuZXZhbCDvvIzkvJrlr7zoh7Tlj5jph4/kvZznlKjln5/lvILluLhcclxuXHRcdFx0cmV0dXJuIGRhdGFcclxuXHRcdGNhdGNoIGVcclxuXHRcdFx0Y29uc29sZS5lcnJvcihcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiAje2Zvcm11bGFfc3RyfVwiLCBlKVxyXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHR0b2FzdHI/LmVycm9yKFwi5YWs5byP5omn6KGM5Ye66ZSZ5LqG77yM6K+35qOA5p+l5YWs5byP6YWN572u5piv5ZCm5q2j56Gu77yBXCIpXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiAje2Zvcm11bGFfc3RyfSN7ZX1cIlxyXG5cclxuXHRyZXR1cm4gZm9ybXVsYV9zdHJcclxuIiwiQ3JlYXRvci5Gb3JtdWxhciA9IHt9O1xuXG5DcmVhdG9yLkZvcm11bGFyLlBSRUZJWCA9IFwiX1ZBTFVFU1wiO1xuXG5DcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYSA9IGZ1bmN0aW9uKHByZWZpeCwgZmllbGRWYXJpYWJsZSkge1xuICB2YXIgcmVnLCByZXY7XG4gIHJlZyA9IC8oXFx7W157fV0qXFx9KS9nO1xuICByZXYgPSBmaWVsZFZhcmlhYmxlLnJlcGxhY2UocmVnLCBmdW5jdGlvbihtLCAkMSkge1xuICAgIHJldHVybiBwcmVmaXggKyAkMS5yZXBsYWNlKC9cXHtcXHMqLywgXCJbXFxcIlwiKS5yZXBsYWNlKC9cXHMqXFx9LywgXCJcXFwiXVwiKS5yZXBsYWNlKC9cXHMqXFwuXFxzKi9nLCBcIlxcXCJdW1xcXCJcIik7XG4gIH0pO1xuICByZXR1cm4gcmV2O1xufTtcblxuQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEgPSBmdW5jdGlvbihmb3JtdWxhX3N0cikge1xuICBpZiAoXy5pc1N0cmluZyhmb3JtdWxhX3N0cikgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIntcIikgPiAtMSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwifVwiKSA+IC0xKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5Gb3JtdWxhci5ydW4gPSBmdW5jdGlvbihmb3JtdWxhX3N0ciwgX0NPTlRFWFQsIG9wdGlvbnMpIHtcbiAgdmFyIF9WQUxVRVMsIGRhdGEsIGUsIGV4dGVuZDtcbiAgaWYgKGZvcm11bGFfc3RyICYmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpKSB7XG4gICAgaWYgKCFfLmlzQm9vbGVhbihvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLmV4dGVuZCA6IHZvaWQgMCkpIHtcbiAgICAgIGV4dGVuZCA9IHRydWU7XG4gICAgfVxuICAgIF9WQUxVRVMgPSB7fTtcbiAgICBfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgX0NPTlRFWFQpO1xuICAgIGlmIChleHRlbmQpIHtcbiAgICAgIF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBDcmVhdG9yLmdldFVzZXJDb250ZXh0KG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMudXNlcklkIDogdm9pZCAwLCBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNwYWNlSWQgOiB2b2lkIDApKTtcbiAgICB9XG4gICAgZm9ybXVsYV9zdHIgPSBDcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYShcInRoaXNcIiwgZm9ybXVsYV9zdHIpO1xuICAgIHRyeSB7XG4gICAgICBkYXRhID0gQ3JlYXRvci5ldmFsSW5Db250ZXh0KGZvcm11bGFfc3RyLCBfVkFMVUVTKTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlID0gZXJyb3I7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46IFwiICsgZm9ybXVsYV9zdHIsIGUpO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBpZiAodHlwZW9mIHRvYXN0ciAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0b2FzdHIgIT09IG51bGwpIHtcbiAgICAgICAgICB0b2FzdHIuZXJyb3IoXCLlhazlvI/miafooYzlh7rplJnkuobvvIzor7fmo4Dmn6XlhazlvI/phY3nva7mmK/lkKbmraPnoa7vvIFcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiBcIiArIGZvcm11bGFfc3RyICsgZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBmb3JtdWxhX3N0cjtcbn07XG4iLCJcclxuQ3JlYXRvci5vYmplY3RzQnlOYW1lID0ge30gICAjIOatpOWvueixoeWPquiDveWcqOehruS/neaJgOaciU9iamVjdOWIneWni+WMluWujOaIkOWQjuiwg+eUqO+8jCDlkKbliJnojrflj5bliLDnmoRvYmplY3TkuI3lhahcclxuXHJcbkNyZWF0b3IuZm9ybWF0T2JqZWN0TmFtZSA9IChvYmplY3RfbmFtZSktPlxyXG5cdGlmIG9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2Nmcy5maWxlcy4nKVxyXG5cdFx0b2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFwuJywgJ2cnKSwgJ18nKVxyXG5cdHJldHVybiBvYmplY3RfbmFtZVxyXG5cclxuQ3JlYXRvci5PYmplY3QgPSAob3B0aW9ucyktPlxyXG5cdHNlbGYgPSB0aGlzXHJcblx0aWYgKCFvcHRpb25zLm5hbWUpXHJcblx0XHRjb25zb2xlLmVycm9yKG9wdGlvbnMpXHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IG5hbWUnKTtcclxuXHJcblx0c2VsZi5faWQgPSBvcHRpb25zLl9pZCB8fCBvcHRpb25zLm5hbWVcclxuXHRzZWxmLnNwYWNlID0gb3B0aW9ucy5zcGFjZVxyXG5cdHNlbGYubmFtZSA9IG9wdGlvbnMubmFtZVxyXG5cdHNlbGYubGFiZWwgPSBvcHRpb25zLmxhYmVsXHJcblx0c2VsZi5pY29uID0gb3B0aW9ucy5pY29uXHJcblx0c2VsZi5kZXNjcmlwdGlvbiA9IG9wdGlvbnMuZGVzY3JpcHRpb25cclxuXHRzZWxmLmlzX3ZpZXcgPSBvcHRpb25zLmlzX3ZpZXdcclxuXHRpZiAhXy5pc0Jvb2xlYW4ob3B0aW9ucy5pc19lbmFibGUpICB8fCBvcHRpb25zLmlzX2VuYWJsZSA9PSB0cnVlXHJcblx0XHRzZWxmLmlzX2VuYWJsZSA9IHRydWVcclxuXHRlbHNlXHJcblx0XHRzZWxmLmlzX2VuYWJsZSA9IGZhbHNlXHJcblx0c2VsZi5lbmFibGVfc2VhcmNoID0gb3B0aW9ucy5lbmFibGVfc2VhcmNoXHJcblx0c2VsZi5lbmFibGVfZmlsZXMgPSBvcHRpb25zLmVuYWJsZV9maWxlc1xyXG5cdHNlbGYuZW5hYmxlX3Rhc2tzID0gb3B0aW9ucy5lbmFibGVfdGFza3NcclxuXHRzZWxmLmVuYWJsZV9ub3RlcyA9IG9wdGlvbnMuZW5hYmxlX25vdGVzXHJcblx0c2VsZi5lbmFibGVfYXVkaXQgPSBvcHRpb25zLmVuYWJsZV9hdWRpdFxyXG5cdHNlbGYuaGlkZGVuID0gb3B0aW9ucy5oaWRkZW5cclxuXHRzZWxmLmVuYWJsZV9hcGkgPSAob3B0aW9ucy5lbmFibGVfYXBpID09IHVuZGVmaW5lZCkgb3Igb3B0aW9ucy5lbmFibGVfYXBpXHJcblx0c2VsZi5jdXN0b20gPSBvcHRpb25zLmN1c3RvbVxyXG5cdHNlbGYuZW5hYmxlX3NoYXJlID0gb3B0aW9ucy5lbmFibGVfc2hhcmVcclxuXHRzZWxmLmVuYWJsZV9pbnN0YW5jZXMgPSBvcHRpb25zLmVuYWJsZV9pbnN0YW5jZXNcclxuXHRzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZVxyXG5cdHNlbGYub3Blbl93aW5kb3cgPSBvcHRpb25zLm9wZW5fd2luZG93XHJcblx0c2VsZi5maWx0ZXJfY29tcGFueSA9IG9wdGlvbnMuZmlsdGVyX2NvbXBhbnlcclxuXHRzZWxmLmNhbGVuZGFyID0gXy5jbG9uZShvcHRpb25zLmNhbGVuZGFyKVxyXG5cdHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKVxyXG5cdHNlbGYuZW5hYmxlX2NoYXR0ZXIgPSBvcHRpb25zLmVuYWJsZV9jaGF0dGVyXHJcblx0c2VsZi5lbmFibGVfdHJhc2ggPSBvcHRpb25zLmVuYWJsZV90cmFzaFxyXG5cdHNlbGYuZW5hYmxlX3NwYWNlX2dsb2JhbCA9IG9wdGlvbnMuZW5hYmxlX3NwYWNlX2dsb2JhbFxyXG5cdHNlbGYuaWRGaWVsZE5hbWUgPSAnX2lkJ1xyXG5cdGlmIG9wdGlvbnMuZGF0YWJhc2VfbmFtZVxyXG5cdFx0c2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lXHJcblx0aWYgKCFvcHRpb25zLmZpZWxkcylcclxuXHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucylcclxuXHRcdHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xyXG5cclxuXHRzZWxmLmZpZWxkcyA9IF8uY2xvbmUob3B0aW9ucy5maWVsZHMpXHJcblxyXG5cdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblx0XHRpZiBmaWVsZF9uYW1lID09ICduYW1lJyB8fCBmaWVsZC5pc19uYW1lXHJcblx0XHRcdHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lXHJcblx0XHRpZiBmaWVsZC5wcmltYXJ5XHJcblx0XHRcdHNlbGYuaWRGaWVsZE5hbWUgPSBmaWVsZF9uYW1lXHJcblxyXG5cdGlmICFvcHRpb25zLmRhdGFiYXNlX25hbWUgfHwgb3B0aW9ucy5kYXRhYmFzZV9uYW1lID09ICdtZXRlb3ItbW9uZ28nXHJcblx0XHRfLmVhY2ggQ3JlYXRvci5iYXNlT2JqZWN0LmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblx0XHRcdGlmICFzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXVxyXG5cdFx0XHRcdHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0ge31cclxuXHRcdFx0c2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKGZpZWxkKSwgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pXHJcblxyXG5cdHNlbGYubGlzdF92aWV3cyA9IHt9XHJcblx0ZGVmYXVsdENvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKHNlbGYubmFtZSlcclxuXHRfLmVhY2ggb3B0aW9ucy5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0XHRvaXRlbSA9IENyZWF0b3IuY29udmVydExpc3RWaWV3KGRlZmF1bHRDb2x1bW5zLCBpdGVtLCBpdGVtX25hbWUpXHJcblx0XHRzZWxmLmxpc3Rfdmlld3NbaXRlbV9uYW1lXSA9IG9pdGVtXHJcblxyXG5cdHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKENyZWF0b3IuYmFzZU9iamVjdC50cmlnZ2VycylcclxuXHRfLmVhY2ggb3B0aW9ucy50cmlnZ2VycywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxyXG5cdFx0aWYgIXNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXVxyXG5cdFx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSB7fVxyXG5cdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdLm5hbWUgPSBpdGVtX25hbWVcclxuXHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSlcclxuXHJcblx0c2VsZi5hY3Rpb25zID0gXy5jbG9uZShDcmVhdG9yLmJhc2VPYmplY3QuYWN0aW9ucylcclxuXHRfLmVhY2ggb3B0aW9ucy5hY3Rpb25zLCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0XHRpZiAhc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV1cclxuXHRcdFx0c2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSB7fVxyXG5cdFx0Y29weUl0ZW0gPSBfLmNsb25lKHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKVxyXG5cdFx0ZGVsZXRlIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdICPlhYjliKDpmaTnm7jlhbPlsZ7mgKflho3ph43lu7rmiY3og73kv53or4HlkI7nu63ph43lpI3lrprkuYnnmoTlsZ7mgKfpobrluo/nlJ/mlYhcclxuXHRcdHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0gXy5leHRlbmQoY29weUl0ZW0sIGl0ZW0pXHJcblxyXG5cdF8uZWFjaCBzZWxmLmFjdGlvbnMsIChpdGVtLCBpdGVtX25hbWUpLT5cclxuXHRcdGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZVxyXG5cclxuXHRzZWxmLnJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoc2VsZi5uYW1lKVxyXG5cclxuXHQjIOiuqeaJgOaciW9iamVjdOm7mOiupOacieaJgOaciWxpc3Rfdmlld3MvYWN0aW9ucy9yZWxhdGVkX29iamVjdHMvcmVhZGFibGVfZmllbGRzL2VkaXRhYmxlX2ZpZWxkc+WujOaVtOadg+mZkO+8jOivpeadg+mZkOWPr+iDveiiq+aVsOaNruW6k+S4reiuvue9rueahGFkbWluL3VzZXLmnYPpmZDopobnm5ZcclxuXHRzZWxmLnBlcm1pc3Npb25fc2V0ID0gXy5jbG9uZShDcmVhdG9yLmJhc2VPYmplY3QucGVybWlzc2lvbl9zZXQpXHJcblx0IyBkZWZhdWx0TGlzdFZpZXdzID0gXy5rZXlzKHNlbGYubGlzdF92aWV3cylcclxuXHQjIGRlZmF1bHRBY3Rpb25zID0gXy5rZXlzKHNlbGYuYWN0aW9ucylcclxuXHQjIGRlZmF1bHRSZWxhdGVkT2JqZWN0cyA9IF8ucGx1Y2soc2VsZi5yZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxyXG5cdCMgZGVmYXVsdFJlYWRhYmxlRmllbGRzID0gW11cclxuXHQjIGRlZmF1bHRFZGl0YWJsZUZpZWxkcyA9IFtdXHJcblx0IyBfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG5cdCMgXHRpZiAhKGZpZWxkLmhpZGRlbikgICAgIzIzMSBvbWl05a2X5q615pSv5oyB5Zyo6Z2e57yW6L6R6aG16Z2i5p+l55yLLCDlm6DmraTliKDpmaTkuobmraTlpITlr7lvbWl055qE5Yik5patXHJcblx0IyBcdFx0ZGVmYXVsdFJlYWRhYmxlRmllbGRzLnB1c2ggZmllbGRfbmFtZVxyXG5cdCMgXHRcdGlmICFmaWVsZC5yZWFkb25seVxyXG5cdCMgXHRcdFx0ZGVmYXVsdEVkaXRhYmxlRmllbGRzLnB1c2ggZmllbGRfbmFtZVxyXG5cclxuXHQjIF8uZWFjaCBzZWxmLnBlcm1pc3Npb25fc2V0LCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0IyBcdGlmIGl0ZW1fbmFtZSA9PSBcIm5vbmVcIlxyXG5cdCMgXHRcdHJldHVyblxyXG5cdCMgXHRpZiBzZWxmLmxpc3Rfdmlld3NcclxuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ubGlzdF92aWV3cyA9IGRlZmF1bHRMaXN0Vmlld3NcclxuXHQjIFx0aWYgc2VsZi5hY3Rpb25zXHJcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmFjdGlvbnMgPSBkZWZhdWx0QWN0aW9uc1xyXG5cdCMgXHRpZiBzZWxmLnJlbGF0ZWRfb2JqZWN0c1xyXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5yZWxhdGVkX29iamVjdHMgPSBkZWZhdWx0UmVsYXRlZE9iamVjdHNcclxuXHQjIFx0aWYgc2VsZi5maWVsZHNcclxuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ucmVhZGFibGVfZmllbGRzID0gZGVmYXVsdFJlYWRhYmxlRmllbGRzXHJcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmVkaXRhYmxlX2ZpZWxkcyA9IGRlZmF1bHRFZGl0YWJsZUZpZWxkc1xyXG5cdHVubGVzcyBvcHRpb25zLnBlcm1pc3Npb25fc2V0XHJcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0ID0ge31cclxuXHRpZiAhKG9wdGlvbnMucGVybWlzc2lvbl9zZXQ/LmFkbWluKVxyXG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldC5hZG1pbiA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcImFkbWluXCJdKVxyXG5cdGlmICEob3B0aW9ucy5wZXJtaXNzaW9uX3NldD8udXNlcilcclxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQudXNlciA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcInVzZXJcIl0pXHJcblx0Xy5lYWNoIG9wdGlvbnMucGVybWlzc2lvbl9zZXQsIChpdGVtLCBpdGVtX25hbWUpLT5cclxuXHRcdGlmICFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV1cclxuXHRcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0ge31cclxuXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdKSwgaXRlbSlcclxuXHJcblx0IyDliY3nq6/moLnmja5wZXJtaXNzaW9uc+aUueWGmWZpZWxk55u45YWz5bGe5oCn77yM5ZCO56uv5Y+q6KaB6LWw6buY6K6k5bGe5oCn5bCx6KGM77yM5LiN6ZyA6KaB5pS55YaZXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnNcclxuXHRcdGRpc2FibGVkX2xpc3Rfdmlld3MgPSBwZXJtaXNzaW9ucz8uZGlzYWJsZWRfbGlzdF92aWV3c1xyXG5cdFx0aWYgZGlzYWJsZWRfbGlzdF92aWV3cz8ubGVuZ3RoXHJcblx0XHRcdGRlZmF1bHRMaXN0Vmlld0lkID0gb3B0aW9ucy5saXN0X3ZpZXdzPy5hbGw/Ll9pZFxyXG5cdFx0XHRpZiBkZWZhdWx0TGlzdFZpZXdJZFxyXG5cdFx0XHRcdCMg5oqK6KeG5Zu+5p2D6ZmQ6YWN572u5Lit6buY6K6k55qEYWxs6KeG5Zu+aWTovazmjaLmiJBhbGzlhbPplK7lrZdcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAgZGlzYWJsZWRfbGlzdF92aWV3cywgKGxpc3Rfdmlld19pdGVtKSAtPlxyXG5cdFx0XHRcdFx0cmV0dXJuIGlmIGRlZmF1bHRMaXN0Vmlld0lkID09IGxpc3Rfdmlld19pdGVtIHRoZW4gXCJhbGxcIiBlbHNlIGxpc3Rfdmlld19pdGVtXHJcblx0XHRzZWxmLnBlcm1pc3Npb25zID0gbmV3IFJlYWN0aXZlVmFyKHBlcm1pc3Npb25zKVxyXG5cdFx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cclxuXHRcdFx0aWYgZmllbGRcclxuXHRcdFx0XHRpZiBfLmluZGV4T2YocGVybWlzc2lvbnM/LnVucmVhZGFibGVfZmllbGRzLCBmaWVsZF9uYW1lKSA8IDBcclxuXHRcdFx0XHRcdGlmIGZpZWxkLmhpZGRlblxyXG5cdFx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRcdGlmIF8uaW5kZXhPZihwZXJtaXNzaW9ucz8udW5lZGl0YWJsZV9maWVsZHMsIGZpZWxkX25hbWUpID4gLTFcclxuXHRcdFx0XHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXHJcblx0XHRcdFx0XHRcdGZpZWxkLmRpc2FibGVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHQjIOW9k+WPquivu+aXtu+8jOWmguaenOS4jeWOu+aOieW/heWhq+Wtl+aute+8jGF1dG9mb3Jt5piv5Lya5oql6ZSZ55qEXHJcblx0XHRcdFx0XHRcdGZpZWxkLnJlcXVpcmVkID0gZmFsc2VcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRmaWVsZC5oaWRkZW4gPSB0cnVlXHJcblx0ZWxzZVxyXG5cdFx0c2VsZi5wZXJtaXNzaW9ucyA9IG51bGxcclxuXHJcblx0X2RiID0gQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uKG9wdGlvbnMpXHJcblxyXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbX2RiLl9uYW1lXSA9IF9kYlxyXG5cclxuXHRzZWxmLmRiID0gX2RiXHJcblxyXG5cdHNlbGYuX2NvbGxlY3Rpb25fbmFtZSA9IF9kYi5fbmFtZVxyXG5cclxuXHRzY2hlbWEgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYShzZWxmKVxyXG5cdHNlbGYuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYShzY2hlbWEpXHJcblx0aWYgc2VsZi5uYW1lICE9IFwidXNlcnNcIiBhbmQgc2VsZi5uYW1lICE9IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIiAmJiAhc2VsZi5pc192aWV3ICYmICFfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXHJcblx0aWYgc2VsZi5uYW1lID09IFwidXNlcnNcIlxyXG5cdFx0X2RiLl9zaW1wbGVTY2hlbWEgPSBzZWxmLnNjaGVtYVxyXG5cclxuXHRpZiBfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxyXG5cclxuXHRDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGZcclxuXHJcblx0cmV0dXJuIHNlbGZcclxuXHJcbkNyZWF0b3IuT2JqZWN0LnByb3RvdHlwZS5pMThuID0gKCktPlxyXG5cdCMgc2V0IG9iamVjdCBsYWJlbFxyXG5cdHNlbGYgPSB0aGlzXHJcblxyXG5cdGtleSA9IHNlbGYubmFtZVxyXG5cdGlmIHQoa2V5KSA9PSBrZXlcclxuXHRcdGlmICFzZWxmLmxhYmVsXHJcblx0XHRcdHNlbGYubGFiZWwgPSBzZWxmLm5hbWVcclxuXHRlbHNlXHJcblx0XHRzZWxmLmxhYmVsID0gdChrZXkpXHJcblxyXG5cdCMgc2V0IGZpZWxkIGxhYmVsc1xyXG5cdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblx0XHRma2V5ID0gc2VsZi5uYW1lICsgXCJfXCIgKyBmaWVsZF9uYW1lXHJcblx0XHRpZiB0KGZrZXkpID09IGZrZXlcclxuXHRcdFx0aWYgIWZpZWxkLmxhYmVsXHJcblx0XHRcdFx0ZmllbGQubGFiZWwgPSBmaWVsZF9uYW1lXHJcblx0XHRlbHNlXHJcblx0XHRcdGZpZWxkLmxhYmVsID0gdChma2V5KVxyXG5cdFx0c2VsZi5zY2hlbWE/Ll9zY2hlbWE/W2ZpZWxkX25hbWVdPy5sYWJlbCA9IGZpZWxkLmxhYmVsXHJcblxyXG5cclxuXHQjIHNldCBsaXN0dmlldyBsYWJlbHNcclxuXHRfLmVhY2ggc2VsZi5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0XHRpMThuX2tleSA9IHNlbGYubmFtZSArIFwiX2xpc3R2aWV3X1wiICsgaXRlbV9uYW1lXHJcblx0XHRpZiB0KGkxOG5fa2V5KSA9PSBpMThuX2tleVxyXG5cdFx0XHRpZiAhaXRlbS5sYWJlbFxyXG5cdFx0XHRcdGl0ZW0ubGFiZWwgPSBpdGVtX25hbWVcclxuXHRcdGVsc2VcclxuXHRcdFx0aXRlbS5sYWJlbCA9IHQoaTE4bl9rZXkpXHJcblxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCA9IChvYmplY3QpLT5cclxuXHRpZiBvYmplY3RcclxuXHRcdGlmICFvYmplY3QuZGF0YWJhc2VfbmFtZSB8fCBvYmplY3QuZGF0YWJhc2VfbmFtZSA9PSAnbWV0ZW9yLW1vbmdvJ1xyXG5cdFx0XHRyZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCJcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIFwiL2FwaS9vZGF0YS8je29iamVjdC5kYXRhYmFzZV9uYW1lfVwiXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHJcblx0TWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRcdFRyYWNrZXIuYXV0b3J1biAtPlxyXG5cdFx0XHRpZiBTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICYmIENyZWF0b3IuYm9vdHN0cmFwTG9hZGVkPy5nZXQoKVxyXG5cdFx0XHRcdF8uZWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvYmplY3QsIG9iamVjdF9uYW1lKS0+XHJcblx0XHRcdFx0XHRvYmplY3QuaTE4bigpXHJcblxyXG5NZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdGlmICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZCAmJiBDcmVhdG9yLk9iamVjdHNcclxuXHRcdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChvYmplY3QpLT5cclxuXHRcdFx0bmV3IENyZWF0b3IuT2JqZWN0KG9iamVjdClcclxuXHJcbiIsIkNyZWF0b3Iub2JqZWN0c0J5TmFtZSA9IHt9O1xuXG5DcmVhdG9yLmZvcm1hdE9iamVjdE5hbWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICBpZiAob2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY2ZzLmZpbGVzLicpKSB7XG4gICAgb2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFwuJywgJ2cnKSwgJ18nKTtcbiAgfVxuICByZXR1cm4gb2JqZWN0X25hbWU7XG59O1xuXG5DcmVhdG9yLk9iamVjdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgdmFyIF9kYiwgZGVmYXVsdENvbHVtbnMsIGRlZmF1bHRMaXN0Vmlld0lkLCBkaXNhYmxlZF9saXN0X3ZpZXdzLCBwZXJtaXNzaW9ucywgcmVmLCByZWYxLCByZWYyLCByZWYzLCBzY2hlbWEsIHNlbGY7XG4gIHNlbGYgPSB0aGlzO1xuICBpZiAoIW9wdGlvbnMubmFtZSkge1xuICAgIGNvbnNvbGUuZXJyb3Iob3B0aW9ucyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XG4gIH1cbiAgc2VsZi5faWQgPSBvcHRpb25zLl9pZCB8fCBvcHRpb25zLm5hbWU7XG4gIHNlbGYuc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICBzZWxmLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gIHNlbGYubGFiZWwgPSBvcHRpb25zLmxhYmVsO1xuICBzZWxmLmljb24gPSBvcHRpb25zLmljb247XG4gIHNlbGYuZGVzY3JpcHRpb24gPSBvcHRpb25zLmRlc2NyaXB0aW9uO1xuICBzZWxmLmlzX3ZpZXcgPSBvcHRpb25zLmlzX3ZpZXc7XG4gIGlmICghXy5pc0Jvb2xlYW4ob3B0aW9ucy5pc19lbmFibGUpIHx8IG9wdGlvbnMuaXNfZW5hYmxlID09PSB0cnVlKSB7XG4gICAgc2VsZi5pc19lbmFibGUgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHNlbGYuaXNfZW5hYmxlID0gZmFsc2U7XG4gIH1cbiAgc2VsZi5lbmFibGVfc2VhcmNoID0gb3B0aW9ucy5lbmFibGVfc2VhcmNoO1xuICBzZWxmLmVuYWJsZV9maWxlcyA9IG9wdGlvbnMuZW5hYmxlX2ZpbGVzO1xuICBzZWxmLmVuYWJsZV90YXNrcyA9IG9wdGlvbnMuZW5hYmxlX3Rhc2tzO1xuICBzZWxmLmVuYWJsZV9ub3RlcyA9IG9wdGlvbnMuZW5hYmxlX25vdGVzO1xuICBzZWxmLmVuYWJsZV9hdWRpdCA9IG9wdGlvbnMuZW5hYmxlX2F1ZGl0O1xuICBzZWxmLmhpZGRlbiA9IG9wdGlvbnMuaGlkZGVuO1xuICBzZWxmLmVuYWJsZV9hcGkgPSAob3B0aW9ucy5lbmFibGVfYXBpID09PSB2b2lkIDApIHx8IG9wdGlvbnMuZW5hYmxlX2FwaTtcbiAgc2VsZi5jdXN0b20gPSBvcHRpb25zLmN1c3RvbTtcbiAgc2VsZi5lbmFibGVfc2hhcmUgPSBvcHRpb25zLmVuYWJsZV9zaGFyZTtcbiAgc2VsZi5lbmFibGVfaW5zdGFuY2VzID0gb3B0aW9ucy5lbmFibGVfaW5zdGFuY2VzO1xuICBzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZTtcbiAgc2VsZi5vcGVuX3dpbmRvdyA9IG9wdGlvbnMub3Blbl93aW5kb3c7XG4gIHNlbGYuZmlsdGVyX2NvbXBhbnkgPSBvcHRpb25zLmZpbHRlcl9jb21wYW55O1xuICBzZWxmLmNhbGVuZGFyID0gXy5jbG9uZShvcHRpb25zLmNhbGVuZGFyKTtcbiAgc2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpO1xuICBzZWxmLmVuYWJsZV9jaGF0dGVyID0gb3B0aW9ucy5lbmFibGVfY2hhdHRlcjtcbiAgc2VsZi5lbmFibGVfdHJhc2ggPSBvcHRpb25zLmVuYWJsZV90cmFzaDtcbiAgc2VsZi5lbmFibGVfc3BhY2VfZ2xvYmFsID0gb3B0aW9ucy5lbmFibGVfc3BhY2VfZ2xvYmFsO1xuICBzZWxmLmlkRmllbGROYW1lID0gJ19pZCc7XG4gIGlmIChvcHRpb25zLmRhdGFiYXNlX25hbWUpIHtcbiAgICBzZWxmLmRhdGFiYXNlX25hbWUgPSBvcHRpb25zLmRhdGFiYXNlX25hbWU7XG4gIH1cbiAgaWYgKCFvcHRpb25zLmZpZWxkcykge1xuICAgIGNvbnNvbGUuZXJyb3Iob3B0aW9ucyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XG4gIH1cbiAgc2VsZi5maWVsZHMgPSBfLmNsb25lKG9wdGlvbnMuZmllbGRzKTtcbiAgXy5lYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmIChmaWVsZF9uYW1lID09PSAnbmFtZScgfHwgZmllbGQuaXNfbmFtZSkge1xuICAgICAgc2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5wcmltYXJ5KSB7XG4gICAgICByZXR1cm4gc2VsZi5pZEZpZWxkTmFtZSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICB9KTtcbiAgaWYgKCFvcHRpb25zLmRhdGFiYXNlX25hbWUgfHwgb3B0aW9ucy5kYXRhYmFzZV9uYW1lID09PSAnbWV0ZW9yLW1vbmdvJykge1xuICAgIF8uZWFjaChDcmVhdG9yLmJhc2VPYmplY3QuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgICAgaWYgKCFzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSkge1xuICAgICAgICBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IHt9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShmaWVsZCksIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdKTtcbiAgICB9KTtcbiAgfVxuICBzZWxmLmxpc3Rfdmlld3MgPSB7fTtcbiAgZGVmYXVsdENvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKHNlbGYubmFtZSk7XG4gIF8uZWFjaChvcHRpb25zLmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHZhciBvaXRlbTtcbiAgICBvaXRlbSA9IENyZWF0b3IuY29udmVydExpc3RWaWV3KGRlZmF1bHRDb2x1bW5zLCBpdGVtLCBpdGVtX25hbWUpO1xuICAgIHJldHVybiBzZWxmLmxpc3Rfdmlld3NbaXRlbV9uYW1lXSA9IG9pdGVtO1xuICB9KTtcbiAgc2VsZi50cmlnZ2VycyA9IF8uY2xvbmUoQ3JlYXRvci5iYXNlT2JqZWN0LnRyaWdnZXJzKTtcbiAgXy5lYWNoKG9wdGlvbnMudHJpZ2dlcnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIGlmICghc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdLm5hbWUgPSBpdGVtX25hbWU7XG4gICAgcmV0dXJuIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSk7XG4gIH0pO1xuICBzZWxmLmFjdGlvbnMgPSBfLmNsb25lKENyZWF0b3IuYmFzZU9iamVjdC5hY3Rpb25zKTtcbiAgXy5lYWNoKG9wdGlvbnMuYWN0aW9ucywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgdmFyIGNvcHlJdGVtO1xuICAgIGlmICghc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIGNvcHlJdGVtID0gXy5jbG9uZShzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSk7XG4gICAgZGVsZXRlIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdO1xuICAgIHJldHVybiBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKGNvcHlJdGVtLCBpdGVtKTtcbiAgfSk7XG4gIF8uZWFjaChzZWxmLmFjdGlvbnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHJldHVybiBpdGVtLm5hbWUgPSBpdGVtX25hbWU7XG4gIH0pO1xuICBzZWxmLnJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoc2VsZi5uYW1lKTtcbiAgc2VsZi5wZXJtaXNzaW9uX3NldCA9IF8uY2xvbmUoQ3JlYXRvci5iYXNlT2JqZWN0LnBlcm1pc3Npb25fc2V0KTtcbiAgaWYgKCFvcHRpb25zLnBlcm1pc3Npb25fc2V0KSB7XG4gICAgb3B0aW9ucy5wZXJtaXNzaW9uX3NldCA9IHt9O1xuICB9XG4gIGlmICghKChyZWYgPSBvcHRpb25zLnBlcm1pc3Npb25fc2V0KSAhPSBudWxsID8gcmVmLmFkbWluIDogdm9pZCAwKSkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQuYWRtaW4gPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJhZG1pblwiXSk7XG4gIH1cbiAgaWYgKCEoKHJlZjEgPSBvcHRpb25zLnBlcm1pc3Npb25fc2V0KSAhPSBudWxsID8gcmVmMS51c2VyIDogdm9pZCAwKSkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQudXNlciA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcInVzZXJcIl0pO1xuICB9XG4gIF8uZWFjaChvcHRpb25zLnBlcm1pc3Npb25fc2V0LCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICBpZiAoIXNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIHJldHVybiBzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSksIGl0ZW0pO1xuICB9KTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHBlcm1pc3Npb25zID0gb3B0aW9ucy5wZXJtaXNzaW9ucztcbiAgICBkaXNhYmxlZF9saXN0X3ZpZXdzID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgOiB2b2lkIDA7XG4gICAgaWYgKGRpc2FibGVkX2xpc3Rfdmlld3MgIT0gbnVsbCA/IGRpc2FibGVkX2xpc3Rfdmlld3MubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICBkZWZhdWx0TGlzdFZpZXdJZCA9IChyZWYyID0gb3B0aW9ucy5saXN0X3ZpZXdzKSAhPSBudWxsID8gKHJlZjMgPSByZWYyLmFsbCkgIT0gbnVsbCA/IHJlZjMuX2lkIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGRlZmF1bHRMaXN0Vmlld0lkKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBfLm1hcChkaXNhYmxlZF9saXN0X3ZpZXdzLCBmdW5jdGlvbihsaXN0X3ZpZXdfaXRlbSkge1xuICAgICAgICAgIGlmIChkZWZhdWx0TGlzdFZpZXdJZCA9PT0gbGlzdF92aWV3X2l0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBcImFsbFwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdF92aWV3X2l0ZW07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2VsZi5wZXJtaXNzaW9ucyA9IG5ldyBSZWFjdGl2ZVZhcihwZXJtaXNzaW9ucyk7XG4gICAgXy5lYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgICAgaWYgKGZpZWxkKSB7XG4gICAgICAgIGlmIChfLmluZGV4T2YocGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzIDogdm9pZCAwLCBmaWVsZF9uYW1lKSA8IDApIHtcbiAgICAgICAgICBpZiAoZmllbGQuaGlkZGVuKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChfLmluZGV4T2YocGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzIDogdm9pZCAwLCBmaWVsZF9uYW1lKSA+IC0xKSB7XG4gICAgICAgICAgICBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgICAgICAgICBmaWVsZC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gZmllbGQucmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZpZWxkLmhpZGRlbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBzZWxmLnBlcm1pc3Npb25zID0gbnVsbDtcbiAgfVxuICBfZGIgPSBDcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24ob3B0aW9ucyk7XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbX2RiLl9uYW1lXSA9IF9kYjtcbiAgc2VsZi5kYiA9IF9kYjtcbiAgc2VsZi5fY29sbGVjdGlvbl9uYW1lID0gX2RiLl9uYW1lO1xuICBzY2hlbWEgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYShzZWxmKTtcbiAgc2VsZi5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHNjaGVtYSk7XG4gIGlmIChzZWxmLm5hbWUgIT09IFwidXNlcnNcIiAmJiBzZWxmLm5hbWUgIT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIiAmJiAhc2VsZi5pc192aWV3ICYmICFfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgX2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge1xuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgX2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge1xuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKHNlbGYubmFtZSA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgX2RiLl9zaW1wbGVTY2hlbWEgPSBzZWxmLnNjaGVtYTtcbiAgfVxuICBpZiAoXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiXSwgc2VsZi5uYW1lKSkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtzZWxmLl9jb2xsZWN0aW9uX25hbWVdID0gc2VsZjtcbiAgcmV0dXJuIHNlbGY7XG59O1xuXG5DcmVhdG9yLk9iamVjdC5wcm90b3R5cGUuaTE4biA9IGZ1bmN0aW9uKCkge1xuICB2YXIga2V5LCBzZWxmO1xuICBzZWxmID0gdGhpcztcbiAga2V5ID0gc2VsZi5uYW1lO1xuICBpZiAodChrZXkpID09PSBrZXkpIHtcbiAgICBpZiAoIXNlbGYubGFiZWwpIHtcbiAgICAgIHNlbGYubGFiZWwgPSBzZWxmLm5hbWU7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNlbGYubGFiZWwgPSB0KGtleSk7XG4gIH1cbiAgXy5lYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIHZhciBma2V5LCByZWYsIHJlZjEsIHJlZjI7XG4gICAgZmtleSA9IHNlbGYubmFtZSArIFwiX1wiICsgZmllbGRfbmFtZTtcbiAgICBpZiAodChma2V5KSA9PT0gZmtleSkge1xuICAgICAgaWYgKCFmaWVsZC5sYWJlbCkge1xuICAgICAgICBmaWVsZC5sYWJlbCA9IGZpZWxkX25hbWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpZWxkLmxhYmVsID0gdChma2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIChyZWYgPSBzZWxmLnNjaGVtYSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLl9zY2hlbWEpICE9IG51bGwgPyAocmVmMiA9IHJlZjFbZmllbGRfbmFtZV0pICE9IG51bGwgPyByZWYyLmxhYmVsID0gZmllbGQubGFiZWwgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIH0pO1xuICByZXR1cm4gXy5lYWNoKHNlbGYubGlzdF92aWV3cywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgdmFyIGkxOG5fa2V5O1xuICAgIGkxOG5fa2V5ID0gc2VsZi5uYW1lICsgXCJfbGlzdHZpZXdfXCIgKyBpdGVtX25hbWU7XG4gICAgaWYgKHQoaTE4bl9rZXkpID09PSBpMThuX2tleSkge1xuICAgICAgaWYgKCFpdGVtLmxhYmVsKSB7XG4gICAgICAgIHJldHVybiBpdGVtLmxhYmVsID0gaXRlbV9uYW1lO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXRlbS5sYWJlbCA9IHQoaTE4bl9rZXkpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdE9EYXRhUm91dGVyUHJlZml4ID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QpIHtcbiAgICBpZiAoIW9iamVjdC5kYXRhYmFzZV9uYW1lIHx8IG9iamVjdC5kYXRhYmFzZV9uYW1lID09PSAnbWV0ZW9yLW1vbmdvJykge1xuICAgICAgcmV0dXJuIFwiL2FwaS9vZGF0YS92NFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCIvYXBpL29kYXRhL1wiICsgb2JqZWN0LmRhdGFiYXNlX25hbWU7XG4gICAgfVxuICB9XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBUcmFja2VyLmF1dG9ydW4oZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVmO1xuICAgICAgaWYgKFNlc3Npb24uZ2V0KFwic3RlZWRvcy1sb2NhbGVcIikgJiYgKChyZWYgPSBDcmVhdG9yLmJvb3RzdHJhcExvYWRlZCkgIT0gbnVsbCA/IHJlZi5nZXQoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmV0dXJuIF8uZWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKG9iamVjdCwgb2JqZWN0X25hbWUpIHtcbiAgICAgICAgICByZXR1cm4gb2JqZWN0LmkxOG4oKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgaWYgKCFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZCAmJiBDcmVhdG9yLk9iamVjdHMpIHtcbiAgICByZXR1cm4gXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICByZXR1cm4gbmV3IENyZWF0b3IuT2JqZWN0KG9iamVjdCk7XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEgPSAob2JqKSAtPlxyXG5cdHNjaGVtYSA9IHt9XHJcblxyXG5cdGZpZWxkc0FyciA9IFtdXHJcblxyXG5cdF8uZWFjaCBvYmouZmllbGRzICwgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblx0XHRpZiAhXy5oYXMoZmllbGQsIFwibmFtZVwiKVxyXG5cdFx0XHRmaWVsZC5uYW1lID0gZmllbGRfbmFtZVxyXG5cdFx0ZmllbGRzQXJyLnB1c2ggZmllbGRcclxuXHJcblx0Xy5lYWNoIF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCAoZmllbGQpLT5cclxuXHJcblx0XHRmaWVsZF9uYW1lID0gZmllbGQubmFtZVxyXG5cclxuXHRcdGZzID0ge31cclxuXHRcdGlmIGZpZWxkLnJlZ0V4XHJcblx0XHRcdGZzLnJlZ0V4ID0gZmllbGQucmVnRXhcclxuXHRcdGZzLmF1dG9mb3JtID0ge31cclxuXHRcdGZzLmF1dG9mb3JtLm11bHRpcGxlID0gZmllbGQubXVsdGlwbGVcclxuXHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xyXG5cclxuXHRcdGF1dG9mb3JtX3R5cGUgPSBmaWVsZC5hdXRvZm9ybT8udHlwZVxyXG5cclxuXHRcdGlmIGZpZWxkLnR5cGUgPT0gXCJ0ZXh0XCIgb3IgZmllbGQudHlwZSA9PSBcInBob25lXCJcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiW3RleHRdXCIgb3IgZmllbGQudHlwZSA9PSBcIltwaG9uZV1cIlxyXG5cdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2NvZGUnXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIlxyXG5cdFx0XHRmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAxMlxyXG5cdFx0XHRpZiBmaWVsZC5sYW5ndWFnZVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmxhbmd1YWdlID0gZmllbGQubGFuZ3VhZ2VcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInRleHRhcmVhXCJcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiXHJcblx0XHRcdGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDZcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInBhc3N3b3JkXCJcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJwYXNzd29yZFwiXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRlXCJcclxuXHRcdFx0ZnMudHlwZSA9IERhdGVcclxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKVxyXG5cdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XHJcblx0XHRcdFx0XHRcdHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiXHJcblx0XHRcdFx0XHRcdGRhdGVNb2JpbGVPcHRpb25zOlxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3V0Rm9ybWF0ID0gJ3l5eXktTU0tZGQnO1xyXG5cdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XHJcblx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxyXG5cdFx0XHRcdFx0XHR0aW1lem9uZUlkOiBcInV0Y1wiXHJcblx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XHJcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcclxuXHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIlxyXG5cclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGV0aW1lXCJcclxuXHRcdFx0ZnMudHlwZSA9IERhdGVcclxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKVxyXG5cdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XHJcblx0XHRcdFx0XHRcdHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiXHJcblx0XHRcdFx0XHRcdGRhdGVNb2JpbGVPcHRpb25zOlxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXHJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcclxuXHRcdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcclxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcclxuXHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGQgSEg6bW1cIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiW09iamVjdF1cIlxyXG5cdFx0XHRmcy50eXBlID0gW09iamVjdF1cclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImh0bWxcIlxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XHJcblx0XHRcdFx0dHlwZTogXCJzdW1tZXJub3RlXCJcclxuXHRcdFx0XHRjbGFzczogJ2VkaXRvcidcclxuXHRcdFx0XHRzZXR0aW5nczpcclxuXHRcdFx0XHRcdGhlaWdodDogMjAwXHJcblx0XHRcdFx0XHRkaWFsb2dzSW5Cb2R5OiB0cnVlXHJcblx0XHRcdFx0XHR0b29sYmFyOiAgW1xyXG5cdFx0XHRcdFx0XHRbJ2ZvbnQxJywgWydzdHlsZSddXSxcclxuXHRcdFx0XHRcdFx0Wydmb250MicsIFsnYm9sZCcsICd1bmRlcmxpbmUnLCAnaXRhbGljJywgJ2NsZWFyJ11dLFxyXG5cdFx0XHRcdFx0XHRbJ2ZvbnQzJywgWydmb250bmFtZSddXSxcclxuXHRcdFx0XHRcdFx0Wydjb2xvcicsIFsnY29sb3InXV0sXHJcblx0XHRcdFx0XHRcdFsncGFyYScsIFsndWwnLCAnb2wnLCAncGFyYWdyYXBoJ11dLFxyXG5cdFx0XHRcdFx0XHRbJ3RhYmxlJywgWyd0YWJsZSddXSxcclxuXHRcdFx0XHRcdFx0WydpbnNlcnQnLCBbJ2xpbmsnLCAncGljdHVyZSddXSxcclxuXHRcdFx0XHRcdFx0Wyd2aWV3JywgWydjb2RldmlldyddXVxyXG5cdFx0XHRcdFx0XVxyXG5cdFx0XHRcdFx0Zm9udE5hbWVzOiBbJ0FyaWFsJywgJ0NvbWljIFNhbnMgTVMnLCAnQ291cmllciBOZXcnLCAnSGVsdmV0aWNhJywgJ0ltcGFjdCcsICflrovkvZMnLCfpu5HkvZMnLCflvq7ova/pm4Xpu5EnLCfku7/lrosnLCfmpbfkvZMnLCfpmrbkuaYnLCflubzlnIYnXVxyXG5cclxuXHRcdGVsc2UgaWYgKGZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIiBvciBmaWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKVxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblxyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cclxuXHRcdFx0aWYgIWZpZWxkLmhpZGRlblxyXG5cclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5maWx0ZXJzID0gZmllbGQuZmlsdGVyc1xyXG5cclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZXBlbmRPbiA9IGZpZWxkLmRlcGVuZF9vblxyXG5cclxuXHRcdFx0XHRpZiBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cclxuXHRcdFx0XHRcdGZzLmJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxyXG5cclxuXHRcdFx0XHRmcy5maWx0ZXJzRnVuY3Rpb24gPSBpZiBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gdGhlbiBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gZWxzZSBDcmVhdG9yLmV2YWx1YXRlRmlsdGVyc1xyXG5cclxuXHRcdFx0XHRpZiBmaWVsZC5vcHRpb25zRnVuY3Rpb25cclxuXHRcdFx0XHRcdGZzLm9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxyXG5cclxuXHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfdG9cclxuXHJcblx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHRcdFx0aWYgZmllbGQuY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uKVxyXG5cdFx0XHRcdFx0XHRcdGZzLmNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb25cclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcoZmllbGQucmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0XHRcdFx0X3JlZl9vYmogPSBDcmVhdG9yLk9iamVjdHNbZmllbGQucmVmZXJlbmNlX3RvXVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgX3JlZl9vYmo/LnBlcm1pc3Npb25zPy5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5jcmVhdGUgPSB0cnVlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmNyZWF0ZUZ1bmN0aW9uID0gKGxvb2t1cF9maWVsZCktPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdE1vZGFsLnNob3coXCJDcmVhdG9yT2JqZWN0TW9kYWxcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogXCJDcmVhdG9yLkNvbGxlY3Rpb25zLiN7Q3JlYXRvci5nZXRDb2xsZWN0aW9uKGZpZWxkLnJlZmVyZW5jZV90bykuX25hbWV9XCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3JtSWQ6IFwibmV3I3tmaWVsZC5yZWZlcmVuY2VfdG8ucmVwbGFjZSgnLicsJ18nKX1cIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBcIiN7ZmllbGQucmVmZXJlbmNlX3RvfVwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b3BlcmF0aW9uOiBcImluc2VydFwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b25TdWNjZXNzOiAob3BlcmF0aW9uLCByZXN1bHQpLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVzdWx0Lm9iamVjdF9uYW1lKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiByZXN1bHQub2JqZWN0X25hbWUgPT0gXCJvYmplY3RzXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBfZmllbGQuYWRkSXRlbXMoW3tsYWJlbDogcmVzdWx0LnZhbHVlLmxhYmVsLCB2YWx1ZTogcmVzdWx0LnZhbHVlLm5hbWUsIGljb246IHJlc3VsdC52YWx1ZS5pY29ufV0sIHJlc3VsdC52YWx1ZS5uYW1lKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFt7bGFiZWw6IHJlc3VsdC52YWx1ZVtvYmplY3QuTkFNRV9GSUVMRF9LRVldIHx8IHJlc3VsdC52YWx1ZS5sYWJlbCB8fCByZXN1bHQudmFsdWUubmFtZSwgdmFsdWU6IHJlc3VsdC5faWR9XSwgcmVzdWx0Ll9pZClcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5jcmVhdGUgPSBmYWxzZVxyXG5cclxuXHRcdFx0XHRcdGlmIF8uaXNCb29sZWFuKGZpZWxkLmNyZWF0ZSlcclxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmllbGQuY3JlYXRlXHJcblxyXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3NvcnRcclxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc1NvcnQgPSBmaWVsZC5yZWZlcmVuY2Vfc29ydFxyXG5cclxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV9saW1pdFxyXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTGltaXQgPSBmaWVsZC5yZWZlcmVuY2VfbGltaXRcclxuXHJcblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT0gXCJ1c2Vyc1wiXHJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdHVzZXJcIlxyXG5cdFx0XHRcdFx0XHRpZiAhZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0XHJcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTooajnpLrov4fmu6TmlbDmja7ml7bmmK/lkKblj6rmmL7npLrmnKzljZXkvY3kuIvnmoTmlbDmja5cclxuXHRcdFx0XHRcdFx0XHQjIGlzX2NvbXBhbnlfbGltaXRlZOWPr+S7peiiq+aUueWGmeimhuebluaIkHRydWUvZmFsc2XmiJblhbbku5ZmdW5jdGlvblxyXG5cdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PSB1bmRlZmluZWRcclxuXHRcdFx0XHRcdFx0XHRcdCMg5pyq5a6a5LmJaXNfY29tcGFueV9saW1pdGVk5bGe5oCn5pe26buY6K6k5aSE55CG6YC76L6R77yaXHJcblx0XHRcdFx0XHRcdFx0XHQjIOWvueW9k+WJjeWvueixoeaciXZpZXdBbGxSZWNvcmRz5p2D6ZmQ5YiZ5LiN6ZmQ5Yi25omA5bGe5Y2V5L2N5YiX6KGo5p+l55yL5p2D6ZmQ77yM5ZCm5YiZ5Y+q5pi+56S65b2T5YmN5omA5bGe5Y2V5L2NXHJcblx0XHRcdFx0XHRcdFx0XHQjIOazqOaEj+S4jeaYr3JlZmVyZW5jZV90b+WvueixoeeahHZpZXdBbGxSZWNvcmRz5p2D6ZmQ77yM6ICM5piv5b2T5YmN5a+56LGh55qEXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvYmoucGVybWlzc2lvbnM/LmdldCgpXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/LnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpzlrZfmrrXmiYDlsZ7lr7nosaHmmK/nlKjmiLfmiJbnu4Tnu4fvvIzliJnmmK/lkKbpmZDliLbmmL7npLrmiYDlsZ7ljZXkvY3pg6jpl6jkuI5tb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5YWz6IGUXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBpc1VuTGltaXRlZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRnVuY3Rpb24gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0IyDkvKDlhaXlvZPliY3lr7nosaHnmoTmnYPpmZDvvIzlnKjlh73mlbDkuK3moLnmja7mnYPpmZDorqHnrpfmmK/lkKbopoHpmZDliLblj6rmn6XnnIvmnKzljZXkvY1cclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucylcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0IyDmnI3liqHnq6/nlKjkuI3liLBpc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRlbHNlIGlmIGZpZWxkLnJlZmVyZW5jZV90byA9PSBcIm9yZ2FuaXphdGlvbnNcIlxyXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RvcmdcIlxyXG5cdFx0XHRcdFx0XHRpZiAhZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0XHJcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTooajnpLrov4fmu6TmlbDmja7ml7bmmK/lkKblj6rmmL7npLrmnKzljZXkvY3kuIvnmoTmlbDmja5cclxuXHRcdFx0XHRcdFx0XHQjIGlzX2NvbXBhbnlfbGltaXRlZOWPr+S7peiiq+aUueWGmeimhuebluaIkHRydWUvZmFsc2XmiJblhbbku5ZmdW5jdGlvblxyXG5cdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PSB1bmRlZmluZWRcclxuXHRcdFx0XHRcdFx0XHRcdCMg5pyq5a6a5LmJaXNfY29tcGFueV9saW1pdGVk5bGe5oCn5pe26buY6K6k5aSE55CG6YC76L6R77yaXHJcblx0XHRcdFx0XHRcdFx0XHQjIOWvueW9k+WJjeWvueixoeaciXZpZXdBbGxSZWNvcmRz5p2D6ZmQ5YiZ5LiN6ZmQ5Yi25omA5bGe5Y2V5L2N5YiX6KGo5p+l55yL5p2D6ZmQ77yM5ZCm5YiZ5Y+q5pi+56S65b2T5YmN5omA5bGe5Y2V5L2NXHJcblx0XHRcdFx0XHRcdFx0XHQjIOazqOaEj+S4jeaYr3JlZmVyZW5jZV90b+WvueixoeeahHZpZXdBbGxSZWNvcmRz5p2D6ZmQ77yM6ICM5piv5b2T5YmN5a+56LGh55qEXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvYmoucGVybWlzc2lvbnM/LmdldCgpXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/LnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpzlrZfmrrXmiYDlsZ7lr7nosaHmmK/nlKjmiLfmiJbnu4Tnu4fvvIzliJnmmK/lkKbpmZDliLbmmL7npLrmiYDlsZ7ljZXkvY3pg6jpl6jkuI5tb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5YWz6IGUXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBpc1VuTGltaXRlZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRnVuY3Rpb24gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0IyDkvKDlhaXlvZPliY3lr7nosaHnmoTmnYPpmZDvvIzlnKjlh73mlbDkuK3moLnmja7mnYPpmZDorqHnrpfmmK/lkKbopoHpmZDliLblj6rmn6XnnIvmnKzljZXkvY1cclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucylcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0IyDmnI3liqHnq6/nlKjkuI3liLBpc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdGlmIHR5cGVvZihmaWVsZC5yZWZlcmVuY2VfdG8pID09IFwiZnVuY3Rpb25cIlxyXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG8oKVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KF9yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRcdFx0ZnMudHlwZSA9IE9iamVjdFxyXG5cdFx0XHRcdFx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9iamVjdFN3aXRjaGUgPSB0cnVlXHJcblxyXG5cdFx0XHRcdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIub1wiXSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFN0cmluZ1xyXG5cdFx0XHRcdFx0XHRcdFx0YXV0b2Zvcm06IHtvbWl0OiB0cnVlfVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5pZHNcIl0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBbU3RyaW5nXVxyXG5cdFx0XHRcdFx0XHRcdFx0YXV0b2Zvcm06IHtvbWl0OiB0cnVlfVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gW19yZWZlcmVuY2VfdG9dXHJcblxyXG5cdFx0XHRcdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VfdG9bMF1dXHJcblx0XHRcdFx0XHRcdGlmIF9vYmplY3QgYW5kIF9vYmplY3QuZW5hYmxlX3RyZWVcclxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RUcmVlXCJcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCJcclxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kID0gZmllbGQub3B0aW9uc01ldGhvZCB8fCBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIlxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2RQYXJhbXMgPSAoKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB7c3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKX1cclxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMgPSBbXVxyXG5cdFx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90by5mb3JFYWNoIChfcmVmZXJlbmNlKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV1cclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgX29iamVjdFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3Q6IF9yZWZlcmVuY2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsOiBfb2JqZWN0Py5sYWJlbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogX29iamVjdD8uaWNvblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGluazogKCktPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCIvYXBwLyN7U2Vzc2lvbi5nZXQoJ2FwcF9pZCcpfS8je19yZWZlcmVuY2V9L3ZpZXcvXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2gge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsaW5rOiAoKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIi9hcHAvI3tTZXNzaW9uLmdldCgnYXBwX2lkJyl9LyN7X3JlZmVyZW5jZX0vdmlldy9cIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxyXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVmYXVsdEljb24gPSBmaWVsZC5kZWZhdWx0SWNvblxyXG5cclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInNlbGVjdFwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmYWxzZVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RcIlxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBcIlwiXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJjdXJyZW5jeVwiXHJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXHJcblx0XHRcdGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxOFxyXG5cdFx0XHRpZiBmaWVsZD8uc2NhbGVcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlXHJcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcclxuXHRcdFx0ZWxzZSBpZiBmaWVsZD8uc2NhbGUgIT0gMFxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gMlxyXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJudW1iZXJcIlxyXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxyXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcclxuXHRcdFx0aWYgZmllbGQ/LnNjYWxlXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZVxyXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJib29sZWFuXCJcclxuXHRcdFx0ZnMudHlwZSA9IEJvb2xlYW5cclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLWNoZWNrYm94XCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInJlZmVyZW5jZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImNoZWNrYm94XCJcclxuXHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdC1jaGVja2JveFwiXHJcblx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJmaWxlXCIgYW5kIGZpZWxkLmNvbGxlY3Rpb25cclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxyXG5cdFx0XHRcdFx0YXV0b2Zvcm06XHJcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiBmaWVsZC5jb2xsZWN0aW9uXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSBmaWVsZC5jb2xsZWN0aW9uXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJmaWxlc2l6ZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlc2l6ZSdcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIk9iamVjdFwiIHx8IGZpZWxkLnR5cGUgPT0gXCJvYmplY3RcIlxyXG5cdFx0XHRmcy50eXBlID0gT2JqZWN0XHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJncmlkXCJcclxuXHRcdFx0ZnMudHlwZSA9IEFycmF5XHJcblx0XHRcdGZzLmF1dG9mb3JtLmVkaXRhYmxlID0gdHJ1ZVxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zR3JpZFwiXHJcblxyXG5cdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxyXG5cdFx0XHRcdHR5cGU6IE9iamVjdFxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiaW1hZ2VcIlxyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XHJcblx0XHRcdFx0XHRhdXRvZm9ybTpcclxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdpbWFnZXMnXHJcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2ltYWdlLyonXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnaW1hZ2VzJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYXZhdGFyXCJcclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxyXG5cdFx0XHRcdFx0YXV0b2Zvcm06XHJcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnYXZhdGFycydcclxuXHRcdFx0XHRcdFx0YWNjZXB0OiAnaW1hZ2UvKidcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdmF0YXJzJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYXVkaW9cIlxyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XHJcblx0XHRcdFx0XHRhdXRvZm9ybTpcclxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdhdWRpb3MnXHJcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2F1ZGlvLyonXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXVkaW9zJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdhdWRpby8qJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidmlkZW9cIlxyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XHJcblx0XHRcdFx0XHRhdXRvZm9ybTpcclxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICd2aWRlb3MnXHJcblx0XHRcdFx0XHRcdGFjY2VwdDogJ3ZpZGVvLyonXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAndmlkZW9zJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICd2aWRlby8qJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibG9jYXRpb25cIlxyXG5cdFx0XHRmcy50eXBlID0gT2JqZWN0XHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcImxvY2F0aW9uXCJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uc3lzdGVtID0gZmllbGQuc3lzdGVtIHx8IFwid2dzODRcIlxyXG5cdFx0XHRmcy5ibGFja2JveCA9IHRydWVcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIm1hcmtkb3duXCJcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLW1hcmtkb3duXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAndXJsJ1xyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdCMgZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguVXJsXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc1VybCdcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZW1haWwnXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0ZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zRW1haWwnXHJcblx0XHRlbHNlXHJcblx0XHRcdGZzLnR5cGUgPSBmaWVsZC50eXBlXHJcblxyXG5cdFx0aWYgZmllbGQubGFiZWxcclxuXHRcdFx0ZnMubGFiZWwgPSBmaWVsZC5sYWJlbFxyXG5cclxuXHRcdGlmIGZpZWxkLmFsbG93ZWRWYWx1ZXNcclxuXHRcdFx0ZnMuYWxsb3dlZFZhbHVlcyA9IGZpZWxkLmFsbG93ZWRWYWx1ZXNcclxuXHJcblx0XHRpZiAhZmllbGQucmVxdWlyZWRcclxuXHRcdFx0ZnMub3B0aW9uYWwgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQudW5pcXVlXHJcblx0XHRcdGZzLnVuaXF1ZSA9IHRydWVcclxuXHJcblx0XHRpZiBmaWVsZC5vbWl0XHJcblx0XHRcdGZzLmF1dG9mb3JtLm9taXQgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQuZ3JvdXBcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uZ3JvdXAgPSBmaWVsZC5ncm91cFxyXG5cclxuXHRcdGlmIGZpZWxkLmlzX3dpZGVcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uaXNfd2lkZSA9IHRydWVcclxuXHJcblx0XHRpZiBmaWVsZC5oaWRkZW5cclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwiaGlkZGVuXCJcclxuXHJcblx0XHRpZiAoZmllbGQudHlwZSA9PSBcInNlbGVjdFwiKSBvciAoZmllbGQudHlwZSA9PSBcImxvb2t1cFwiKSBvciAoZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIilcclxuXHRcdFx0aWYgdHlwZW9mKGZpZWxkLmZpbHRlcmFibGUpID09ICd1bmRlZmluZWQnXHJcblx0XHRcdFx0ZmllbGQuZmlsdGVyYWJsZSA9IHRydWVcclxuXHRcdGlmIGZpZWxkLm5hbWUgPT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWVcclxuXHRcdFx0aWYgdHlwZW9mKGZpZWxkLnNlYXJjaGFibGUpID09ICd1bmRlZmluZWQnXHJcblx0XHRcdFx0ZmllbGQuc2VhcmNoYWJsZSA9IHRydWVcclxuXHJcblx0XHRpZiBhdXRvZm9ybV90eXBlXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBhdXRvZm9ybV90eXBlXHJcblxyXG5cdFx0aWYgZmllbGQuZGVmYXVsdFZhbHVlXHJcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudCBhbmQgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZmllbGQuZGVmYXVsdFZhbHVlKVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9ICgpLT5cclxuXHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmaWVsZC5kZWZhdWx0VmFsdWUsIHt1c2VySWQ6IE1ldGVvci51c2VySWQoKSwgc3BhY2VJZDogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpfSlcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxyXG5cdFx0XHRcdGlmICFfLmlzRnVuY3Rpb24oZmllbGQuZGVmYXVsdFZhbHVlKVxyXG5cdFx0XHRcdFx0ZnMuZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlXHJcblxyXG5cdFx0aWYgZmllbGQucmVhZG9ubHlcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ucmVhZG9ubHkgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQuZGlzYWJsZWRcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQuaW5saW5lSGVscFRleHRcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uaW5saW5lSGVscFRleHQgPSBmaWVsZC5pbmxpbmVIZWxwVGV4dFxyXG5cclxuXHRcdGlmIGZpZWxkLmJsYWNrYm94XHJcblx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxyXG5cclxuXHRcdCMg5Y+q5pyJ55Sf5Lqn546v5aKD5omN6YeN5bu657Si5byVXHJcblx0XHRpZiBNZXRlb3IuaXNQcm9kdWN0aW9uXHJcblx0XHRcdGlmIGZpZWxkLmluZGV4XHJcblx0XHRcdFx0ZnMuaW5kZXggPSBmaWVsZC5pbmRleFxyXG5cdFx0XHRlbHNlIGlmIGZpZWxkLnNvcnRhYmxlXHJcblx0XHRcdFx0ZnMuaW5kZXggPSB0cnVlXHJcblxyXG5cdFx0c2NoZW1hW2ZpZWxkX25hbWVdID0gZnNcclxuXHJcblx0cmV0dXJuIHNjaGVtYVxyXG5cclxuXHJcbkNyZWF0b3IuZ2V0RmllbGREaXNwbGF5VmFsdWUgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlKS0+XHJcblx0aHRtbCA9IGZpZWxkX3ZhbHVlXHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0aWYgIW9iamVjdFxyXG5cdFx0cmV0dXJuIFwiXCJcclxuXHRmaWVsZCA9IG9iamVjdC5maWVsZHMoZmllbGRfbmFtZSlcclxuXHRpZiAhZmllbGRcclxuXHRcdHJldHVybiBcIlwiXHJcblxyXG5cdGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRldGltZVwiXHJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQgSDptbScpXHJcblx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZVwiXHJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQnKVxyXG5cclxuXHRyZXR1cm4gaHRtbFxyXG5cclxuQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkgPSAoZmllbGRfdHlwZSktPlxyXG5cdHJldHVybiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIiwgXCJjdXJyZW5jeVwiLCBcIm51bWJlclwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxyXG5cclxuQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMgPSAoZmllbGRfdHlwZSwgb3BlcmF0aW9ucyktPlxyXG5cdGJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpXHJcblx0aWYgYnVpbHRpblZhbHVlc1xyXG5cdFx0Xy5mb3JFYWNoIGJ1aWx0aW5WYWx1ZXMsIChidWlsdGluSXRlbSwga2V5KS0+XHJcblx0XHRcdG9wZXJhdGlvbnMucHVzaCh7bGFiZWw6IGJ1aWx0aW5JdGVtLmxhYmVsLCB2YWx1ZToga2V5fSlcclxuXHJcbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSAoZmllbGRfdHlwZSwgaXNfY2hlY2tfb25seSktPlxyXG5cdCMg6L+H5ruk5Zmo5a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XHJcblx0aWYgW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSlcclxuXHJcbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0gPSAoZmllbGRfdHlwZSwga2V5KS0+XHJcblx0IyDov4fmu6TlmajlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcclxuXHRpZiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcclxuXHRcdHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBrZXkpXHJcblxyXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uID0gKGZpZWxkX3R5cGUsIHZhbHVlKS0+XHJcblx0IyDmoLnmja7ov4fmu6TlmajnmoTov4fmu6TlgLzvvIzojrflj5blr7nlupTnmoTlhoXnva7ov5DnrpfnrKZcclxuXHQjIOavlOWmgnZhbHVl5Li6bGFzdF95ZWFy77yM6L+U5ZueYmV0d2Vlbl90aW1lX2xhc3RfeWVhclxyXG5cdHVubGVzcyBfLmlzU3RyaW5nKHZhbHVlKVxyXG5cdFx0cmV0dXJuXHJcblx0YmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpXHJcblx0dW5sZXNzIGJldHdlZW5CdWlsdGluVmFsdWVzXHJcblx0XHRyZXR1cm5cclxuXHRyZXN1bHQgPSBudWxsXHJcblx0Xy5lYWNoIGJldHdlZW5CdWlsdGluVmFsdWVzLCAoaXRlbSwgb3BlcmF0aW9uKS0+XHJcblx0XHRpZiBpdGVtLmtleSA9PSB2YWx1ZVxyXG5cdFx0XHRyZXN1bHQgPSBvcGVyYXRpb25cclxuXHRyZXR1cm4gcmVzdWx0XHJcblxyXG4jIOWmguaenOWPquaYr+S4uuWIpOaWrW9wZXJhdGlvbuaYr+WQpuWtmOWcqO+8jOWImeayoeW/heimgeiuoeeul3ZhbHVlc++8jOS8oOWFpWlzX2NoZWNrX29ubHnkuLp0cnVl5Y2z5Y+vXHJcbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzID0gKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpLT5cclxuXHQjIOi/h+a7pOWZqOaXtumXtOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxyXG5cdHJldHVybiB7XHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfeWVhclwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc195ZWFyXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF95ZWFyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3llYXJcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfcXVhcnRlclwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19xdWFydGVyXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF9xdWFydGVyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3F1YXJ0ZXJcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X21vbnRoXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc19tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19tb250aFwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfbW9udGhcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3Rfd2Vla1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc193ZWVrXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF93ZWVrXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3dlZWtcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV95ZXN0ZGF5XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ5ZXN0ZGF5XCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9kYXlcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvZGF5XCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9tb3Jyb3dcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvbW9ycm93XCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF83X2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfN19kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8zMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzMwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzYwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfNjBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfOTBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF85MF9kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8xMjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8xMjBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfN19kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzdfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfMzBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8zMF9kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzYwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzkwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfOTBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfMTIwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMTIwX2RheXNcIilcclxuXHR9XHJcblxyXG5DcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoID0gKG1vbnRoKS0+XHJcblx0aWYgIW1vbnRoXHJcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxyXG5cdFxyXG5cdGlmIG1vbnRoIDwgM1xyXG5cdFx0cmV0dXJuIDBcclxuXHRlbHNlIGlmIG1vbnRoIDwgNlxyXG5cdFx0cmV0dXJuIDNcclxuXHRlbHNlIGlmIG1vbnRoIDwgOVxyXG5cdFx0cmV0dXJuIDZcclxuXHRcclxuXHRyZXR1cm4gOVxyXG5cclxuXHJcbkNyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSA9ICh5ZWFyLG1vbnRoKS0+XHJcblx0aWYgIXllYXJcclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcclxuXHRpZiAhbW9udGhcclxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXHJcblx0XHJcblx0aWYgbW9udGggPCAzXHJcblx0XHR5ZWFyLS1cclxuXHRcdG1vbnRoID0gOVxyXG5cdGVsc2UgaWYgbW9udGggPCA2XHJcblx0XHRtb250aCA9IDBcclxuXHRlbHNlIGlmIG1vbnRoIDwgOVxyXG5cdFx0bW9udGggPSAzXHJcblx0ZWxzZSBcclxuXHRcdG1vbnRoID0gNlxyXG5cdFxyXG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcclxuXHRcclxuXHJcbkNyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSA9ICh5ZWFyLG1vbnRoKS0+XHJcblx0aWYgIXllYXJcclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcclxuXHRpZiAhbW9udGhcclxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXHJcblx0XHJcblx0aWYgbW9udGggPCAzXHJcblx0XHRtb250aCA9IDNcclxuXHRlbHNlIGlmIG1vbnRoIDwgNlxyXG5cdFx0bW9udGggPSA2XHJcblx0ZWxzZSBpZiBtb250aCA8IDlcclxuXHRcdG1vbnRoID0gOVxyXG5cdGVsc2VcclxuXHRcdHllYXIrK1xyXG5cdFx0bW9udGggPSAwXHJcblx0XHJcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxyXG5cclxuQ3JlYXRvci5nZXRNb250aERheXMgPSAoeWVhcixtb250aCktPlxyXG5cdGlmIG1vbnRoID09IDExXHJcblx0XHRyZXR1cm4gMzFcclxuXHRcclxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcclxuXHRzdGFydERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcclxuXHRlbmREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgrMSwgMSlcclxuXHRkYXlzID0gKGVuZERhdGUtc3RhcnREYXRlKS9taWxsaXNlY29uZFxyXG5cdHJldHVybiBkYXlzXHJcblxyXG5DcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5ID0gKHllYXIsIG1vbnRoKS0+XHJcblx0aWYgIXllYXJcclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcclxuXHRpZiAhbW9udGhcclxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXHJcblx0XHJcblx0IyDmnIjku73kuLow5Luj6KGo5pys5bm055qE56ys5LiA5pyIXHJcblx0aWYgbW9udGggPT0gMFxyXG5cdFx0bW9udGggPSAxMVxyXG5cdFx0eWVhci0tXHJcblx0XHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0XHJcblx0IyDlkKbliJks5Y+q5YeP5Y675pyI5Lu9XHJcblx0bW9udGgtLTtcclxuXHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0XHJcbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtID0gKGZpZWxkX3R5cGUsIGtleSktPlxyXG5cdCMg6L+H5ruk5ZmoYmV0d2Vlbui/kOeul+espu+8jOeOsOeul+aXpeacny/ml6XmnJ/ml7bpl7TnsbvlnovlrZfmrrXnmoR2YWx1ZXPlgLxcclxuXHRub3cgPSBuZXcgRGF0ZSgpXHJcblx0IyDkuIDlpKnnmoTmr6vnp5LmlbBcclxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcclxuXHR5ZXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxyXG5cdHRvbW9ycm93ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKVxyXG5cdCMg5LiA5ZGo5Lit55qE5p+Q5LiA5aSpXHJcblx0d2VlayA9IG5vdy5nZXREYXkoKVxyXG5cdCMg5YeP5Y6755qE5aSp5pWwXHJcblx0bWludXNEYXkgPSBpZiB3ZWVrICE9IDAgdGhlbiB3ZWVrIC0gMSBlbHNlIDZcclxuXHRtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKVxyXG5cdHN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOS4iuWRqOaXpVxyXG5cdGxhc3RTdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXHJcblx0IyDkuIrlkajkuIBcclxuXHRsYXN0TW9uZGF5ID0gbmV3IERhdGUobGFzdFN1bmRheS5nZXRUaW1lKCkgLSAobWlsbGlzZWNvbmQgKiA2KSlcclxuXHQjIOS4i+WRqOS4gFxyXG5cdG5leHRNb25kYXkgPSBuZXcgRGF0ZShzdW5kYXkuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpXHJcblx0IyDkuIvlkajml6VcclxuXHRuZXh0U3VuZGF5ID0gbmV3IERhdGUobmV4dE1vbmRheS5nZXRUaW1lKCkgKyAobWlsbGlzZWNvbmQgKiA2KSlcclxuXHRjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXHJcblx0cHJldmlvdXNZZWFyID0gY3VycmVudFllYXIgLSAxXHJcblx0bmV4dFllYXIgPSBjdXJyZW50WWVhciArIDFcclxuXHQjIOW9k+WJjeaciOS7vVxyXG5cdGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpXHJcblx0IyDorqHmlbDlubTjgIHmnIhcclxuXHR5ZWFyID0gbm93LmdldEZ1bGxZZWFyKClcclxuXHRtb250aCA9IG5vdy5nZXRNb250aCgpXHJcblx0IyDmnKzmnIjnrKzkuIDlpKlcclxuXHRmaXJzdERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aCwxKVxyXG5cclxuXHQjIOW9k+S4ujEy5pyI55qE5pe25YCZ5bm05Lu96ZyA6KaB5YqgMVxyXG5cdCMg5pyI5Lu96ZyA6KaB5pu05paw5Li6MCDkuZ/lsLHmmK/kuIvkuIDlubTnmoTnrKzkuIDkuKrmnIhcclxuXHRpZiBjdXJyZW50TW9udGggPT0gMTFcclxuXHRcdHllYXIrK1xyXG5cdFx0bW9udGgrK1xyXG5cdGVsc2VcclxuXHRcdG1vbnRoKytcclxuXHRcclxuXHQjIOS4i+aciOesrOS4gOWkqVxyXG5cdG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0IyDkuIvmnIjmnIDlkI7kuIDlpKlcclxuXHRuZXh0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKHllYXIsbW9udGgsQ3JlYXRvci5nZXRNb250aERheXMoeWVhcixtb250aCkpXHJcblx0IyDmnKzmnIjmnIDlkI7kuIDlpKlcclxuXHRsYXN0RGF5ID0gbmV3IERhdGUobmV4dE1vbnRoRmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXHJcblx0IyDkuIrmnIjnrKzkuIDlpKlcclxuXHRsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxyXG5cdCMg5LiK5pyI5pyA5ZCO5LiA5aSpXHJcblx0bGFzdE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZShmaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcclxuXHQjIOacrOWto+W6puW8gOWni+aXpVxyXG5cdHRoaXNRdWFydGVyU3RhcnREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCksMSlcclxuXHQjIOacrOWto+W6pue7k+adn+aXpVxyXG5cdHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIsQ3JlYXRvci5nZXRNb250aERheXMoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIpKVxyXG5cdCMg5LiK5a2j5bqm5byA5aeL5pelXHJcblx0bGFzdFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXHJcblx0IyDkuIrlraPluqbnu5PmnZ/ml6VcclxuXHRsYXN0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIpKVxyXG5cdCMg5LiL5a2j5bqm5byA5aeL5pelXHJcblx0bmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXHJcblx0IyDkuIvlraPluqbnu5PmnZ/ml6VcclxuXHRuZXh0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIpKVxyXG5cdCMg6L+H5Y67N+WkqSBcclxuXHRsYXN0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNiAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzMw5aSpXHJcblx0bGFzdF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgyOSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzYw5aSpXHJcblx0bGFzdF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg1OSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzkw5aSpXHJcblx0bGFzdF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg4OSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzEyMOWkqVxyXG5cdGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOacquadpTflpKkgXHJcblx0bmV4dF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaUzMOWkqVxyXG5cdG5leHRfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMjkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaU2MOWkqVxyXG5cdG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaU5MOWkqVxyXG5cdG5leHRfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoODkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaUxMjDlpKlcclxuXHRuZXh0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgxMTkgKiBtaWxsaXNlY29uZCkpXHJcblxyXG5cdHN3aXRjaCBrZXlcclxuXHRcdHdoZW4gXCJsYXN0X3llYXJcIlxyXG5cdFx0XHQj5Y675bm0XHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfeWVhclwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3ByZXZpb3VzWWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3ByZXZpb3VzWWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwidGhpc195ZWFyXCJcclxuXHRcdFx0I+S7iuW5tFxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3llYXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje2N1cnJlbnRZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0X3llYXJcIlxyXG5cdFx0XHQj5piO5bm0XHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfeWVhclwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje25leHRZZWFyfS0wMS0wMVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7bmV4dFllYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfcXVhcnRlclwiXHJcblx0XHRcdCPkuIrlraPluqZcclxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfcXVhcnRlclwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwidGhpc19xdWFydGVyXCJcclxuXHRcdFx0I+acrOWto+W6plxyXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19xdWFydGVyXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0X3F1YXJ0ZXJcIlxyXG5cdFx0XHQj5LiL5a2j5bqmXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3F1YXJ0ZXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfbW9udGhcIlxyXG5cdFx0XHQj5LiK5pyIXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9tb250aFwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwidGhpc19tb250aFwiXHJcblx0XHRcdCPmnKzmnIhcclxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQoZmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfbW9udGhcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfbW9udGhcIlxyXG5cdFx0XHQj5LiL5pyIXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9tb250aFwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibGFzdF93ZWVrXCJcclxuXHRcdFx0I+S4iuWRqFxyXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobGFzdE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobGFzdFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3dlZWtcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRoaXNfd2Vla1wiXHJcblx0XHRcdCPmnKzlkahcclxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KG1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQoc3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfd2Vla1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ck1vbmRheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN1bmRheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF93ZWVrXCJcclxuXHRcdFx0I+S4i+WRqFxyXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobmV4dE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3dlZWtcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInllc3RkYXlcIlxyXG5cdFx0XHQj5pio5aSpXHJcblx0XHRcdHN0clllc3RkYXkgPSBtb21lbnQoeWVzdGRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl95ZXN0ZGF5XCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyWWVzdGRheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clllc3RkYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRvZGF5XCJcclxuXHRcdFx0I+S7iuWkqVxyXG5cdFx0XHRzdHJUb2RheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9kYXlcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb2RheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvZGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJ0b21vcnJvd1wiXHJcblx0XHRcdCPmmI7lpKlcclxuXHRcdFx0c3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9tb3Jyb3dcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb21vcnJvd31UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvbW9ycm93fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0XzdfZGF5c1wiXHJcblx0XHRcdCPov4fljrs35aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpIFxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfN19kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfMzBfZGF5c1wiXHJcblx0XHRcdCPov4fljrszMOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzMwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibGFzdF82MF9kYXlzXCJcclxuXHRcdFx0I+i/h+WOuzYw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfNjBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0XzkwX2RheXNcIlxyXG5cdFx0XHQj6L+H5Y67OTDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF85MF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfMTIwX2RheXNcIlxyXG5cdFx0XHQj6L+H5Y67MTIw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfN19kYXlzXCJcclxuXHRcdFx0I+acquadpTflpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzdfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0XzMwX2RheXNcIlxyXG5cdFx0XHQj5pyq5p2lMzDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8zMF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfNjBfZGF5c1wiXHJcblx0XHRcdCPmnKrmnaU2MOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzYwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF85MF9kYXlzXCJcclxuXHRcdFx0I+acquadpTkw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfOTBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0XzEyMF9kYXlzXCJcclxuXHRcdFx0I+acquadpTEyMOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8xMjBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcclxuXHR2YWx1ZXMgPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdXHJcblx0aWYgZmllbGRfdHlwZSA9PSBcImRhdGV0aW1lXCJcclxuXHRcdCMg5pe26Ze057G75Z6L5a2X5q6177yM5YaF572u5pe26Ze06IyD5Zu05bqU6K+l6ICD6JmR5YGP56e75pe25Yy65YC877yM5ZCm5YiZ6L+H5ruk5pWw5o2u5a2Y5Zyo5YGP5beuXHJcblx0XHQjIOmdnuWGhee9ruaXtumXtOiMg+WbtOaXtu+8jOeUqOaIt+mAmui/h+aXtumXtOaOp+S7tumAieaLqeeahOiMg+WbtO+8jOS8muiHquWKqOWkhOeQhuaXtuWMuuWBj+W3ruaDheWGtVxyXG5cdFx0IyDml6XmnJ/nsbvlnovlrZfmrrXvvIzmlbDmja7lupPmnKzmnaXlsLHlrZjnmoTmmK9VVEPnmoQw54K577yM5LiN5a2Y5Zyo5YGP5beuXHJcblx0XHRfLmZvckVhY2ggdmFsdWVzLCAoZnYpLT5cclxuXHRcdFx0aWYgZnZcclxuXHRcdFx0XHRmdi5zZXRIb3Vycyhmdi5nZXRIb3VycygpICsgZnYuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwIClcclxuXHRcclxuXHRyZXR1cm4ge1xyXG5cdFx0bGFiZWw6IGxhYmVsXHJcblx0XHRrZXk6IGtleVxyXG5cdFx0dmFsdWVzOiB2YWx1ZXNcclxuXHR9XHJcblxyXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IChmaWVsZF90eXBlKS0+XHJcblx0aWYgZmllbGRfdHlwZSAmJiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKVxyXG5cdFx0cmV0dXJuICdiZXR3ZWVuJ1xyXG5cdGVsc2UgaWYgW1widGV4dGFyZWFcIiwgXCJ0ZXh0XCIsIFwiY29kZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxyXG5cdFx0cmV0dXJuICdjb250YWlucydcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gXCI9XCJcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRPcGVyYXRpb24gPSAoZmllbGRfdHlwZSkgLT5cclxuXHQjIOaXpeacn+exu+WeizogZGF0ZSwgZGF0ZXRpbWUgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxyXG5cdCMg5paH5pys57G75Z6LOiB0ZXh0LCB0ZXh0YXJlYSwgaHRtbCAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiLCBcImNvbnRhaW5zXCIsIFwibm90Y29udGFpbnNcIiwgXCJzdGFydHN3aXRoXCJcclxuXHQjIOmAieaLqeexu+WeizogbG9va3VwLCBtYXN0ZXJfZGV0YWlsLCBzZWxlY3Qg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXHJcblx0IyDmlbDlgLznsbvlnos6IGN1cnJlbmN5LCBudW1iZXIgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxyXG5cdCMg5biD5bCU57G75Z6LOiBib29sZWFuICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcclxuXHQjIOaVsOe7hOexu+WeizogY2hlY2tib3gsIFt0ZXh0XSAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXHJcblxyXG5cdG9wdGlvbmFscyA9IHtcclxuXHRcdGVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZXF1YWxcIiksIHZhbHVlOiBcIj1cIn0sXHJcblx0XHR1bmVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fdW5lcXVhbFwiKSwgdmFsdWU6IFwiPD5cIn0sXHJcblx0XHRsZXNzX3RoYW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX3RoYW5cIiksIHZhbHVlOiBcIjxcIn0sXHJcblx0XHRncmVhdGVyX3RoYW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX3RoYW5cIiksIHZhbHVlOiBcIj5cIn0sXHJcblx0XHRsZXNzX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc19vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPD1cIn0sXHJcblx0XHRncmVhdGVyX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl9vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPj1cIn0sXHJcblx0XHRjb250YWluczoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2NvbnRhaW5zXCIpLCB2YWx1ZTogXCJjb250YWluc1wifSxcclxuXHRcdG5vdF9jb250YWluOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZG9lc19ub3RfY29udGFpblwiKSwgdmFsdWU6IFwibm90Y29udGFpbnNcIn0sXHJcblx0XHRzdGFydHNfd2l0aDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3N0YXJ0c193aXRoXCIpLCB2YWx1ZTogXCJzdGFydHN3aXRoXCJ9LFxyXG5cdFx0YmV0d2Vlbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5cIiksIHZhbHVlOiBcImJldHdlZW5cIn0sXHJcblx0fVxyXG5cclxuXHRpZiBmaWVsZF90eXBlID09IHVuZGVmaW5lZFxyXG5cdFx0cmV0dXJuIF8udmFsdWVzKG9wdGlvbmFscylcclxuXHJcblx0b3BlcmF0aW9ucyA9IFtdXHJcblxyXG5cdGlmIENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmJldHdlZW4pXHJcblx0XHRDcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyhmaWVsZF90eXBlLCBvcGVyYXRpb25zKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcInRleHRcIiBvciBmaWVsZF90eXBlID09IFwidGV4dGFyZWFcIiBvciBmaWVsZF90eXBlID09IFwiaHRtbFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJjb2RlXCJcclxuI1x0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmNvbnRhaW5zLCBvcHRpb25hbHMubm90X2NvbnRhaW4sIG9wdGlvbmFscy5zdGFydHNfd2l0aClcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuY29udGFpbnMpXHJcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwibG9va3VwXCIgb3IgZmllbGRfdHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiBvciBmaWVsZF90eXBlID09IFwic2VsZWN0XCJcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImN1cnJlbmN5XCIgb3IgZmllbGRfdHlwZSA9PSBcIm51bWJlclwiXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmxlc3NfdGhhbiwgb3B0aW9uYWxzLmdyZWF0ZXJfdGhhbiwgb3B0aW9uYWxzLmxlc3Nfb3JfZXF1YWwsIG9wdGlvbmFscy5ncmVhdGVyX29yX2VxdWFsKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImJvb2xlYW5cIlxyXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXHJcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiY2hlY2tib3hcIlxyXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXHJcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiW3RleHRdXCJcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cdGVsc2VcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cclxuXHRyZXR1cm4gb3BlcmF0aW9uc1xyXG5cclxuIyMjXHJcbiAgICDlhYjmjInnhafmnInmjpLluo/lj7fnmoTlsI/nmoTlnKjliY3vvIzlpKfnmoTlnKjlkI5cclxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lID0gKG9iamVjdF9uYW1lKS0+XHJcblx0ZmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5maWVsZHNcclxuXHRmaWVsZHNBcnIgPSBbXVxyXG5cclxuXHRfLmVhY2ggZmllbGRzLCAoZmllbGQpLT5cclxuXHRcdGZpZWxkc0Fyci5wdXNoIHtuYW1lOiBmaWVsZC5uYW1lLCBzb3J0X25vOiBmaWVsZC5zb3J0X25vfVxyXG5cclxuXHRmaWVsZHNOYW1lID0gW11cclxuXHRfLmVhY2ggXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIChmaWVsZCktPlxyXG5cdFx0ZmllbGRzTmFtZS5wdXNoKGZpZWxkLm5hbWUpXHJcblx0cmV0dXJuIGZpZWxkc05hbWVcclxuIiwiQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIGZpZWxkc0Fyciwgc2NoZW1hO1xuICBzY2hlbWEgPSB7fTtcbiAgZmllbGRzQXJyID0gW107XG4gIF8uZWFjaChvYmouZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmICghXy5oYXMoZmllbGQsIFwibmFtZVwiKSkge1xuICAgICAgZmllbGQubmFtZSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHNBcnIucHVzaChmaWVsZCk7XG4gIH0pO1xuICBfLmVhY2goXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgdmFyIF9vYmplY3QsIF9yZWZfb2JqLCBfcmVmZXJlbmNlX3RvLCBhdXRvZm9ybV90eXBlLCBmaWVsZF9uYW1lLCBmcywgaXNVbkxpbWl0ZWQsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjM7XG4gICAgZmllbGRfbmFtZSA9IGZpZWxkLm5hbWU7XG4gICAgZnMgPSB7fTtcbiAgICBpZiAoZmllbGQucmVnRXgpIHtcbiAgICAgIGZzLnJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgfVxuICAgIGZzLmF1dG9mb3JtID0ge307XG4gICAgZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZTtcbiAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgYXV0b2Zvcm1fdHlwZSA9IChyZWYgPSBmaWVsZC5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwO1xuICAgIGlmIChmaWVsZC50eXBlID09PSBcInRleHRcIiB8fCBmaWVsZC50eXBlID09PSBcInBob25lXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIlt0ZXh0XVwiIHx8IGZpZWxkLnR5cGUgPT09IFwiW3Bob25lXVwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnY29kZScpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTI7XG4gICAgICBpZiAoZmllbGQubGFuZ3VhZ2UpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCI7XG4gICAgICBmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCA2O1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJwYXNzd29yZFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5vdXRGb3JtYXQgPSAneXl5eS1NTS1kZCc7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgdGltZXpvbmVJZDogXCJ1dGNcIixcbiAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJbT2JqZWN0XVwiKSB7XG4gICAgICBmcy50eXBlID0gW09iamVjdF07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImh0bWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgdHlwZTogXCJzdW1tZXJub3RlXCIsXG4gICAgICAgIFwiY2xhc3NcIjogJ2VkaXRvcicsXG4gICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICAgICAgZGlhbG9nc0luQm9keTogdHJ1ZSxcbiAgICAgICAgICB0b29sYmFyOiBbWydmb250MScsIFsnc3R5bGUnXV0sIFsnZm9udDInLCBbJ2JvbGQnLCAndW5kZXJsaW5lJywgJ2l0YWxpYycsICdjbGVhciddXSwgWydmb250MycsIFsnZm9udG5hbWUnXV0sIFsnY29sb3InLCBbJ2NvbG9yJ11dLCBbJ3BhcmEnLCBbJ3VsJywgJ29sJywgJ3BhcmFncmFwaCddXSwgWyd0YWJsZScsIFsndGFibGUnXV0sIFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sIFsndmlldycsIFsnY29kZXZpZXcnXV1dLFxuICAgICAgICAgIGZvbnROYW1lczogWydBcmlhbCcsICdDb21pYyBTYW5zIE1TJywgJ0NvdXJpZXIgTmV3JywgJ0hlbHZldGljYScsICdJbXBhY3QnLCAn5a6L5L2TJywgJ+m7keS9kycsICflvq7ova/pm4Xpu5EnLCAn5Lu/5a6LJywgJ+alt+S9kycsICfpmrbkuaYnLCAn5bm85ZyGJ11cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIgfHwgZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgfVxuICAgICAgaWYgKCFmaWVsZC5oaWRkZW4pIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZmlsdGVycyA9IGZpZWxkLmZpbHRlcnM7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlcGVuZE9uID0gZmllbGQuZGVwZW5kX29uO1xuICAgICAgICBpZiAoZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uKSB7XG4gICAgICAgICAgZnMuYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGZzLmZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA/IGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA6IENyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzO1xuICAgICAgICBpZiAoZmllbGQub3B0aW9uc0Z1bmN0aW9uKSB7XG4gICAgICAgICAgZnMub3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8pIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICBpZiAoZmllbGQuY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICAgICAgICBmcy5jcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIF9yZWZfb2JqID0gQ3JlYXRvci5PYmplY3RzW2ZpZWxkLnJlZmVyZW5jZV90b107XG4gICAgICAgICAgICAgICAgaWYgKF9yZWZfb2JqICE9IG51bGwgPyAocmVmMSA9IF9yZWZfb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMS5hbGxvd0NyZWF0ZSA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIGZzLmNyZWF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24obG9va3VwX2ZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNb2RhbC5zaG93KFwiQ3JlYXRvck9iamVjdE1vZGFsXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uOiBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuXCIgKyAoQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGZpZWxkLnJlZmVyZW5jZV90bykuX25hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgIGZvcm1JZDogXCJuZXdcIiArIChmaWVsZC5yZWZlcmVuY2VfdG8ucmVwbGFjZSgnLicsICdfJykpLFxuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBcIlwiICsgZmllbGQucmVmZXJlbmNlX3RvLFxuICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJpbnNlcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICBvblN1Y2Nlc3M6IGZ1bmN0aW9uKG9wZXJhdGlvbiwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqZWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVzdWx0Lm9iamVjdF9uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQub2JqZWN0X25hbWUgPT09IFwib2JqZWN0c1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb29rdXBfZmllbGQuYWRkSXRlbXMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiByZXN1bHQudmFsdWUubGFiZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0LnZhbHVlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiByZXN1bHQudmFsdWUuaWNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgcmVzdWx0LnZhbHVlLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHJlc3VsdC52YWx1ZVtvYmplY3QuTkFNRV9GSUVMRF9LRVldIHx8IHJlc3VsdC52YWx1ZS5sYWJlbCB8fCByZXN1bHQudmFsdWUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQuX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLCByZXN1bHQuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChfLmlzQm9vbGVhbihmaWVsZC5jcmVhdGUpKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSBmaWVsZC5jcmVhdGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2Vfc29ydCkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc1NvcnQgPSBmaWVsZC5yZWZlcmVuY2Vfc29ydDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV9saW1pdCkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc0xpbWl0ID0gZmllbGQucmVmZXJlbmNlX2xpbWl0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3RvID09PSBcInVzZXJzXCIpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdHVzZXJcIjtcbiAgICAgICAgICAgIGlmICghZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0KSB7XG4gICAgICAgICAgICAgIGlmIChmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gKHJlZjIgPSBvYmoucGVybWlzc2lvbnMpICE9IG51bGwgPyByZWYyLmdldCgpIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChpc1VuTGltaXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNGdW5jdGlvbihmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQucmVmZXJlbmNlX3RvID09PSBcIm9yZ2FuaXphdGlvbnNcIikge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0b3JnXCI7XG4gICAgICAgICAgICBpZiAoIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdCkge1xuICAgICAgICAgICAgICBpZiAoZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IChyZWYzID0gb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMy5nZXQoKSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoaXNVbkxpbWl0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24oZmllbGQuaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF8uaXNBcnJheShfcmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgICAgICAgICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9iamVjdFN3aXRjaGUgPSB0cnVlO1xuICAgICAgICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLm9cIl0gPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICAgICAgICBvbWl0OiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLmlkc1wiXSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBbU3RyaW5nXSxcbiAgICAgICAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgICAgICAgb21pdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBbX3JlZmVyZW5jZV90b107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VfdG9bMF1dO1xuICAgICAgICAgICAgaWYgKF9vYmplY3QgJiYgX29iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RUcmVlXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kID0gZmllbGQub3B0aW9uc01ldGhvZCB8fCBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjtcbiAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2RQYXJhbXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzID0gW107XG4gICAgICAgICAgICAgICAgX3JlZmVyZW5jZV90by5mb3JFYWNoKGZ1bmN0aW9uKF9yZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICAgIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV07XG4gICAgICAgICAgICAgICAgICBpZiAoX29iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IF9yZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QubGFiZWwgOiB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgICAgaWNvbjogX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIChTZXNzaW9uLmdldCgnYXBwX2lkJykpICsgXCIvXCIgKyBfcmVmZXJlbmNlICsgXCIvdmlldy9cIjtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBfcmVmZXJlbmNlLFxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIChTZXNzaW9uLmdldCgnYXBwX2lkJykpICsgXCIvXCIgKyBfcmVmZXJlbmNlICsgXCIvdmlldy9cIjtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdEljb24gPSBmaWVsZC5kZWZhdWx0SWNvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmFsc2U7XG4gICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0XCI7XG4gICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgICBmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IFwiXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImN1cnJlbmN5XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGU7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSAhPT0gMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IDI7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZTtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgICAgZnMudHlwZSA9IEJvb2xlYW47XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tY2hlY2tib3hcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwicmVmZXJlbmNlXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdC1jaGVja2JveFwiO1xuICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImZpbGVcIiAmJiBmaWVsZC5jb2xsZWN0aW9uKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246IGZpZWxkLmNvbGxlY3Rpb25cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gZmllbGQuY29sbGVjdGlvbjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZmlsZXNpemVcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZXNpemUnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJPYmplY3RcIiB8fCBmaWVsZC50eXBlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJncmlkXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBBcnJheTtcbiAgICAgIGZzLmF1dG9mb3JtLmVkaXRhYmxlID0gdHJ1ZTtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NHcmlkXCI7XG4gICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiaW1hZ2VcIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnaW1hZ2VzJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ2ltYWdlLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdpbWFnZXMnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImF2YXRhclwiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICdhdmF0YXJzJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ2ltYWdlLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdmF0YXJzJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJhdWRpb1wiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICdhdWRpb3MnLFxuICAgICAgICAgICAgYWNjZXB0OiAnYXVkaW8vKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F1ZGlvcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdhdWRpby8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidmlkZW9cIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAndmlkZW9zJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ3ZpZGVvLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICd2aWRlb3MnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAndmlkZW8vKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImxvY2F0aW9uXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBPYmplY3Q7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJsb2NhdGlvblwiO1xuICAgICAgZnMuYXV0b2Zvcm0uc3lzdGVtID0gZmllbGQuc3lzdGVtIHx8IFwid2dzODRcIjtcbiAgICAgIGZzLmJsYWNrYm94ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibWFya2Rvd25cIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtbWFya2Rvd25cIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICd1cmwnKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zVXJsJztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdlbWFpbCcpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbDtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc0VtYWlsJztcbiAgICB9IGVsc2Uge1xuICAgICAgZnMudHlwZSA9IGZpZWxkLnR5cGU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5sYWJlbCkge1xuICAgICAgZnMubGFiZWwgPSBmaWVsZC5sYWJlbDtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmFsbG93ZWRWYWx1ZXMpIHtcbiAgICAgIGZzLmFsbG93ZWRWYWx1ZXMgPSBmaWVsZC5hbGxvd2VkVmFsdWVzO1xuICAgIH1cbiAgICBpZiAoIWZpZWxkLnJlcXVpcmVkKSB7XG4gICAgICBmcy5vcHRpb25hbCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC51bmlxdWUpIHtcbiAgICAgIGZzLnVuaXF1ZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5vbWl0KSB7XG4gICAgICBmcy5hdXRvZm9ybS5vbWl0ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmdyb3VwKSB7XG4gICAgICBmcy5hdXRvZm9ybS5ncm91cCA9IGZpZWxkLmdyb3VwO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaXNfd2lkZSkge1xuICAgICAgZnMuYXV0b2Zvcm0uaXNfd2lkZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5oaWRkZW4pIHtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcImhpZGRlblwiO1xuICAgIH1cbiAgICBpZiAoKGZpZWxkLnR5cGUgPT09IFwic2VsZWN0XCIpIHx8IChmaWVsZC50eXBlID09PSBcImxvb2t1cFwiKSB8fCAoZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpKSB7XG4gICAgICBpZiAodHlwZW9mIGZpZWxkLmZpbHRlcmFibGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmllbGQubmFtZSA9PT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgZmllbGQuc2VhcmNoYWJsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmllbGQuc2VhcmNoYWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChhdXRvZm9ybV90eXBlKSB7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gYXV0b2Zvcm1fdHlwZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmRlZmF1bHRWYWx1ZSkge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmaWVsZC5kZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmaWVsZC5kZWZhdWx0VmFsdWUsIHtcbiAgICAgICAgICAgIHVzZXJJZDogTWV0ZW9yLnVzZXJJZCgpLFxuICAgICAgICAgICAgc3BhY2VJZDogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKGZpZWxkLmRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgICBmcy5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpZWxkLnJlYWRvbmx5KSB7XG4gICAgICBmcy5hdXRvZm9ybS5yZWFkb25seSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5kaXNhYmxlZCkge1xuICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaW5saW5lSGVscFRleHQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmlubGluZUhlbHBUZXh0ID0gZmllbGQuaW5saW5lSGVscFRleHQ7XG4gICAgfVxuICAgIGlmIChmaWVsZC5ibGFja2JveCkge1xuICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzUHJvZHVjdGlvbikge1xuICAgICAgaWYgKGZpZWxkLmluZGV4KSB7XG4gICAgICAgIGZzLmluZGV4ID0gZmllbGQuaW5kZXg7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkLnNvcnRhYmxlKSB7XG4gICAgICAgIGZzLmluZGV4ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNjaGVtYVtmaWVsZF9uYW1lXSA9IGZzO1xuICB9KTtcbiAgcmV0dXJuIHNjaGVtYTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGREaXNwbGF5VmFsdWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGRfdmFsdWUpIHtcbiAgdmFyIGZpZWxkLCBodG1sLCBvYmplY3Q7XG4gIGh0bWwgPSBmaWVsZF92YWx1ZTtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG4gIGZpZWxkID0gb2JqZWN0LmZpZWxkcyhmaWVsZF9uYW1lKTtcbiAgaWYgKCFmaWVsZCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG4gIGlmIChmaWVsZC50eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICBodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQgSDptbScpO1xuICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgaHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gIH1cbiAgcmV0dXJuIGh0bWw7XG59O1xuXG5DcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgcmV0dXJuIFtcImRhdGVcIiwgXCJkYXRldGltZVwiLCBcImN1cnJlbmN5XCIsIFwibnVtYmVyXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpO1xufTtcblxuQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMgPSBmdW5jdGlvbihmaWVsZF90eXBlLCBvcGVyYXRpb25zKSB7XG4gIHZhciBidWlsdGluVmFsdWVzO1xuICBidWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKTtcbiAgaWYgKGJ1aWx0aW5WYWx1ZXMpIHtcbiAgICByZXR1cm4gXy5mb3JFYWNoKGJ1aWx0aW5WYWx1ZXMsIGZ1bmN0aW9uKGJ1aWx0aW5JdGVtLCBrZXkpIHtcbiAgICAgIHJldHVybiBvcGVyYXRpb25zLnB1c2goe1xuICAgICAgICBsYWJlbDogYnVpbHRpbkl0ZW0ubGFiZWwsXG4gICAgICAgIHZhbHVlOiBrZXlcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgaXNfY2hlY2tfb25seSkge1xuICBpZiAoW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtID0gZnVuY3Rpb24oZmllbGRfdHlwZSwga2V5KSB7XG4gIGlmIChbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwga2V5KTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpbk9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIHZhbHVlKSB7XG4gIHZhciBiZXR3ZWVuQnVpbHRpblZhbHVlcywgcmVzdWx0O1xuICBpZiAoIV8uaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGJldHdlZW5CdWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKTtcbiAgaWYgKCFiZXR3ZWVuQnVpbHRpblZhbHVlcykge1xuICAgIHJldHVybjtcbiAgfVxuICByZXN1bHQgPSBudWxsO1xuICBfLmVhY2goYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIGZ1bmN0aW9uKGl0ZW0sIG9wZXJhdGlvbikge1xuICAgIGlmIChpdGVtLmtleSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiByZXN1bHQgPSBvcGVyYXRpb247XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzID0gZnVuY3Rpb24oaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSkge1xuICByZXR1cm4ge1xuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF95ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc195ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF95ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc19tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3Rfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF93ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc193ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF93ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3llc3RkYXlcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInllc3RkYXlcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdG9kYXlcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvZGF5XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RvbW9ycm93XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b21vcnJvd1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzdfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF83X2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF8zMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzMwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF82MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzYwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF85MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzkwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF8xMjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8xMjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzdfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF83X2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF8zMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzMwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF82MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzYwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF85MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzkwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF8xMjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8xMjBfZGF5c1wiKVxuICB9O1xufTtcblxuQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aCA9IGZ1bmN0aW9uKG1vbnRoKSB7XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgcmV0dXJuIDM7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgcmV0dXJuIDY7XG4gIH1cbiAgcmV0dXJuIDk7XG59O1xuXG5DcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgeWVhci0tO1xuICAgIG1vbnRoID0gOTtcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICBtb250aCA9IDA7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgbW9udGggPSAzO1xuICB9IGVsc2Uge1xuICAgIG1vbnRoID0gNjtcbiAgfVxuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIG1vbnRoID0gMztcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICBtb250aCA9IDY7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgbW9udGggPSA5O1xuICB9IGVsc2Uge1xuICAgIHllYXIrKztcbiAgICBtb250aCA9IDA7XG4gIH1cbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0TW9udGhEYXlzID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgdmFyIGRheXMsIGVuZERhdGUsIG1pbGxpc2Vjb25kLCBzdGFydERhdGU7XG4gIGlmIChtb250aCA9PT0gMTEpIHtcbiAgICByZXR1cm4gMzE7XG4gIH1cbiAgbWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuICBzdGFydERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIGVuZERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIDEpO1xuICBkYXlzID0gKGVuZERhdGUgLSBzdGFydERhdGUpIC8gbWlsbGlzZWNvbmQ7XG4gIHJldHVybiBkYXlzO1xufTtcblxuQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA9PT0gMCkge1xuICAgIG1vbnRoID0gMTE7XG4gICAgeWVhci0tO1xuICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIH1cbiAgbW9udGgtLTtcbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtID0gZnVuY3Rpb24oZmllbGRfdHlwZSwga2V5KSB7XG4gIHZhciBjdXJyZW50TW9udGgsIGN1cnJlbnRZZWFyLCBlbmRWYWx1ZSwgZmlyc3REYXksIGxhYmVsLCBsYXN0RGF5LCBsYXN0TW9uZGF5LCBsYXN0TW9udGhGaW5hbERheSwgbGFzdE1vbnRoRmlyc3REYXksIGxhc3RRdWFydGVyRW5kRGF5LCBsYXN0UXVhcnRlclN0YXJ0RGF5LCBsYXN0U3VuZGF5LCBsYXN0XzEyMF9kYXlzLCBsYXN0XzMwX2RheXMsIGxhc3RfNjBfZGF5cywgbGFzdF83X2RheXMsIGxhc3RfOTBfZGF5cywgbWlsbGlzZWNvbmQsIG1pbnVzRGF5LCBtb25kYXksIG1vbnRoLCBuZXh0TW9uZGF5LCBuZXh0TW9udGhGaW5hbERheSwgbmV4dE1vbnRoRmlyc3REYXksIG5leHRRdWFydGVyRW5kRGF5LCBuZXh0UXVhcnRlclN0YXJ0RGF5LCBuZXh0U3VuZGF5LCBuZXh0WWVhciwgbmV4dF8xMjBfZGF5cywgbmV4dF8zMF9kYXlzLCBuZXh0XzYwX2RheXMsIG5leHRfN19kYXlzLCBuZXh0XzkwX2RheXMsIG5vdywgcHJldmlvdXNZZWFyLCBzdGFydFZhbHVlLCBzdHJFbmREYXksIHN0ckZpcnN0RGF5LCBzdHJMYXN0RGF5LCBzdHJNb25kYXksIHN0clN0YXJ0RGF5LCBzdHJTdW5kYXksIHN0clRvZGF5LCBzdHJUb21vcnJvdywgc3RyWWVzdGRheSwgc3VuZGF5LCB0aGlzUXVhcnRlckVuZERheSwgdGhpc1F1YXJ0ZXJTdGFydERheSwgdG9tb3Jyb3csIHZhbHVlcywgd2VlaywgeWVhciwgeWVzdGRheTtcbiAgbm93ID0gbmV3IERhdGUoKTtcbiAgbWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuICB5ZXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgdG9tb3Jyb3cgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpO1xuICB3ZWVrID0gbm93LmdldERheSgpO1xuICBtaW51c0RheSA9IHdlZWsgIT09IDAgPyB3ZWVrIC0gMSA6IDY7XG4gIG1vbmRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAobWludXNEYXkgKiBtaWxsaXNlY29uZCkpO1xuICBzdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0U3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgbGFzdE1vbmRheSA9IG5ldyBEYXRlKGxhc3RTdW5kYXkuZ2V0VGltZSgpIC0gKG1pbGxpc2Vjb25kICogNikpO1xuICBuZXh0TW9uZGF5ID0gbmV3IERhdGUoc3VuZGF5LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKTtcbiAgbmV4dFN1bmRheSA9IG5ldyBEYXRlKG5leHRNb25kYXkuZ2V0VGltZSgpICsgKG1pbGxpc2Vjb25kICogNikpO1xuICBjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBwcmV2aW91c1llYXIgPSBjdXJyZW50WWVhciAtIDE7XG4gIG5leHRZZWFyID0gY3VycmVudFllYXIgKyAxO1xuICBjdXJyZW50TW9udGggPSBub3cuZ2V0TW9udGgoKTtcbiAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBtb250aCA9IG5vdy5nZXRNb250aCgpO1xuICBmaXJzdERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgsIDEpO1xuICBpZiAoY3VycmVudE1vbnRoID09PSAxMSkge1xuICAgIHllYXIrKztcbiAgICBtb250aCsrO1xuICB9IGVsc2Uge1xuICAgIG1vbnRoKys7XG4gIH1cbiAgbmV4dE1vbnRoRmlyc3REYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIG5leHRNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIENyZWF0b3IuZ2V0TW9udGhEYXlzKHllYXIsIG1vbnRoKSk7XG4gIGxhc3REYXkgPSBuZXcgRGF0ZShuZXh0TW9udGhGaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIGxhc3RNb250aEZpcnN0RGF5ID0gQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbGFzdE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZShmaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIHRoaXNRdWFydGVyU3RhcnREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpLCAxKTtcbiAgdGhpc1F1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSArIDIpKTtcbiAgbGFzdFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbGFzdFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMikpO1xuICBuZXh0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBuZXh0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyKSk7XG4gIGxhc3RfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgyOSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNTkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDg5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMTE5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDI5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg1OSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoODkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgxMTkgKiBtaWxsaXNlY29uZCkpO1xuICBzd2l0Y2ggKGtleSkge1xuICAgIGNhc2UgXCJsYXN0X3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShwcmV2aW91c1llYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHByZXZpb3VzWWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShjdXJyZW50WWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoY3VycmVudFllYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF95ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUobmV4dFllYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKG5leHRZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc19xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc19tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQoZmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChuZXh0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF93ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobGFzdE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChsYXN0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF93ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KG1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChzdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF93ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobmV4dE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChuZXh0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF93ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInllc3RkYXlcIjpcbiAgICAgIHN0clllc3RkYXkgPSBtb21lbnQoeWVzdGRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3llc3RkYXlcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyWWVzdGRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyWWVzdGRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0b2RheVwiOlxuICAgICAgc3RyVG9kYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9kYXlcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyVG9kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRvbW9ycm93XCI6XG4gICAgICBzdHJUb21vcnJvdyA9IG1vbWVudCh0b21vcnJvdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvbW9ycm93XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvbW9ycm93ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJUb21vcnJvdyArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzdfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF83X2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzMwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzMwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzYwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzYwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzkwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzkwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzEyMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMTIwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzdfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF83X2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzMwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzMwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzYwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzYwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzkwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzkwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzEyMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMTIwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgfVxuICB2YWx1ZXMgPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdO1xuICBpZiAoZmllbGRfdHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgXy5mb3JFYWNoKHZhbHVlcywgZnVuY3Rpb24oZnYpIHtcbiAgICAgIGlmIChmdikge1xuICAgICAgICByZXR1cm4gZnYuc2V0SG91cnMoZnYuZ2V0SG91cnMoKSArIGZ2LmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBsYWJlbDogbGFiZWwsXG4gICAga2V5OiBrZXksXG4gICAgdmFsdWVzOiB2YWx1ZXNcbiAgfTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGREZWZhdWx0T3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSkge1xuICBpZiAoZmllbGRfdHlwZSAmJiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiAnYmV0d2Vlbic7XG4gIH0gZWxzZSBpZiAoW1widGV4dGFyZWFcIiwgXCJ0ZXh0XCIsIFwiY29kZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiAnY29udGFpbnMnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBcIj1cIjtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRGaWVsZE9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgdmFyIG9wZXJhdGlvbnMsIG9wdGlvbmFscztcbiAgb3B0aW9uYWxzID0ge1xuICAgIGVxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIj1cIlxuICAgIH0sXG4gICAgdW5lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fdW5lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIjw+XCJcbiAgICB9LFxuICAgIGxlc3NfdGhhbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc190aGFuXCIpLFxuICAgICAgdmFsdWU6IFwiPFwiXG4gICAgfSxcbiAgICBncmVhdGVyX3RoYW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfdGhhblwiKSxcbiAgICAgIHZhbHVlOiBcIj5cIlxuICAgIH0sXG4gICAgbGVzc19vcl9lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc19vcl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIjw9XCJcbiAgICB9LFxuICAgIGdyZWF0ZXJfb3JfZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfb3JfZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI+PVwiXG4gICAgfSxcbiAgICBjb250YWluczoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fY29udGFpbnNcIiksXG4gICAgICB2YWx1ZTogXCJjb250YWluc1wiXG4gICAgfSxcbiAgICBub3RfY29udGFpbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZG9lc19ub3RfY29udGFpblwiKSxcbiAgICAgIHZhbHVlOiBcIm5vdGNvbnRhaW5zXCJcbiAgICB9LFxuICAgIHN0YXJ0c193aXRoOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9zdGFydHNfd2l0aFwiKSxcbiAgICAgIHZhbHVlOiBcInN0YXJ0c3dpdGhcIlxuICAgIH0sXG4gICAgYmV0d2Vlbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2VlblwiKSxcbiAgICAgIHZhbHVlOiBcImJldHdlZW5cIlxuICAgIH1cbiAgfTtcbiAgaWYgKGZpZWxkX3R5cGUgPT09IHZvaWQgMCkge1xuICAgIHJldHVybiBfLnZhbHVlcyhvcHRpb25hbHMpO1xuICB9XG4gIG9wZXJhdGlvbnMgPSBbXTtcbiAgaWYgKENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5iZXR3ZWVuKTtcbiAgICBDcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyhmaWVsZF90eXBlLCBvcGVyYXRpb25zKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcInRleHRcIiB8fCBmaWVsZF90eXBlID09PSBcInRleHRhcmVhXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJodG1sXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJjb2RlXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmNvbnRhaW5zKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImxvb2t1cFwiIHx8IGZpZWxkX3R5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiIHx8IGZpZWxkX3R5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJjdXJyZW5jeVwiIHx8IGZpZWxkX3R5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmxlc3NfdGhhbiwgb3B0aW9uYWxzLmdyZWF0ZXJfdGhhbiwgb3B0aW9uYWxzLmxlc3Nfb3JfZXF1YWwsIG9wdGlvbmFscy5ncmVhdGVyX29yX2VxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJbdGV4dF1cIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH1cbiAgcmV0dXJuIG9wZXJhdGlvbnM7XG59O1xuXG5cbi8qXG4gICAg5YWI5oyJ54Wn5pyJ5o6S5bqP5Y+355qE5bCP55qE5Zyo5YmN77yM5aSn55qE5Zyo5ZCOXG4gICAg5YaN5bCG5rKh5pyJ5o6S5bqP5Y+355qE5pi+56S65ZyoXG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGZpZWxkcywgZmllbGRzQXJyLCBmaWVsZHNOYW1lLCByZWY7XG4gIGZpZWxkcyA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwO1xuICBmaWVsZHNBcnIgPSBbXTtcbiAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGRzQXJyLnB1c2goe1xuICAgICAgbmFtZTogZmllbGQubmFtZSxcbiAgICAgIHNvcnRfbm86IGZpZWxkLnNvcnRfbm9cbiAgICB9KTtcbiAgfSk7XG4gIGZpZWxkc05hbWUgPSBbXTtcbiAgXy5lYWNoKF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZHNOYW1lLnB1c2goZmllbGQubmFtZSk7XG4gIH0pO1xuICByZXR1cm4gZmllbGRzTmFtZTtcbn07XG4iLCJDcmVhdG9yLl90cmlnZ2VyX2hvb2tzID0ge31cclxuXHJcbmluaXRUcmlnZ2VyID0gKG9iamVjdF9uYW1lLCB0cmlnZ2VyKS0+XHJcblx0dHJ5XHJcblx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxyXG5cdFx0aWYgIXRyaWdnZXIudG9kb1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdHRvZG9XcmFwcGVyID0gKCktPlxyXG5cdFx0XHQgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZVxyXG5cdFx0XHQgIHJldHVybiB0cmlnZ2VyLnRvZG8uYXBwbHkodGhpcywgYXJndW1lbnRzKVxyXG5cdFx0aWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLmluc2VydFwiXHJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24uYmVmb3JlLmluc2VydCh0b2RvV3JhcHBlcilcclxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUudXBkYXRlXCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbi5iZWZvcmUudXBkYXRlKHRvZG9XcmFwcGVyKVxyXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImJlZm9yZS5yZW1vdmVcIlxyXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uLmJlZm9yZS5yZW1vdmUodG9kb1dyYXBwZXIpXHJcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIuaW5zZXJ0XCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbi5hZnRlci5pbnNlcnQodG9kb1dyYXBwZXIpXHJcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIudXBkYXRlXCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbi5hZnRlci51cGRhdGUodG9kb1dyYXBwZXIpXHJcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIucmVtb3ZlXCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbi5hZnRlci5yZW1vdmUodG9kb1dyYXBwZXIpXHJcblx0Y2F0Y2ggZXJyb3JcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpXHJcblxyXG5jbGVhblRyaWdnZXIgPSAob2JqZWN0X25hbWUpLT5cclxuXHQjIyNcclxuICAgIFx055Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsOaYr+S9v+eUqOS4i+agh+WIoOmZpOWvueixoeeahO+8jOaJgOS7peatpOWkhOWPjei9rGhvb2tz6ZuG5ZCI5ZCO77yM5YaN5Yig6ZmkXHJcbiAgICBcdOWboOS4uuS4gOS4quaVsOe7hOWFg+e0oOWIoOmZpOWQju+8jOWFtuS7luWFg+e0oOeahOS4i+agh+S8muWPkeeUn+WPmOWMllxyXG5cdCMjI1xyXG4gICAgI1RPRE8g55Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsGJ1Z1xyXG5cdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdPy5yZXZlcnNlKCkuZm9yRWFjaCAoX2hvb2spLT5cclxuXHRcdF9ob29rLnJlbW92ZSgpXHJcblxyXG5DcmVhdG9yLmluaXRUcmlnZ2VycyA9IChvYmplY3RfbmFtZSktPlxyXG4jXHRjb25zb2xlLmxvZygnQ3JlYXRvci5pbml0VHJpZ2dlcnMgb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSlcclxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHJcblx0Y2xlYW5UcmlnZ2VyKG9iamVjdF9uYW1lKVxyXG5cclxuXHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdXHJcblxyXG5cdF8uZWFjaCBvYmoudHJpZ2dlcnMsICh0cmlnZ2VyLCB0cmlnZ2VyX25hbWUpLT5cclxuXHRcdGlmIE1ldGVvci5pc1NlcnZlciBhbmQgdHJpZ2dlci5vbiA9PSBcInNlcnZlclwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxyXG5cdFx0XHRfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIgb2JqZWN0X25hbWUsIHRyaWdnZXJcclxuXHRcdFx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKVxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50IGFuZCB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCIgYW5kIHRyaWdnZXIudG9kbyBhbmQgdHJpZ2dlci53aGVuXHJcblx0XHRcdF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlciBvYmplY3RfbmFtZSwgdHJpZ2dlclxyXG5cdFx0XHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spIiwidmFyIGNsZWFuVHJpZ2dlciwgaW5pdFRyaWdnZXI7XG5cbkNyZWF0b3IuX3RyaWdnZXJfaG9va3MgPSB7fTtcblxuaW5pdFRyaWdnZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgdHJpZ2dlcikge1xuICB2YXIgY29sbGVjdGlvbiwgZXJyb3IsIHRvZG9XcmFwcGVyO1xuICB0cnkge1xuICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpO1xuICAgIGlmICghdHJpZ2dlci50b2RvKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRvZG9XcmFwcGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm9iamVjdF9uYW1lID0gb2JqZWN0X25hbWU7XG4gICAgICByZXR1cm4gdHJpZ2dlci50b2RvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS5pbnNlcnRcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uYmVmb3JlLmluc2VydCh0b2RvV3JhcHBlcik7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLnVwZGF0ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbi5iZWZvcmUudXBkYXRlKHRvZG9XcmFwcGVyKTtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJiZWZvcmUucmVtb3ZlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uLmJlZm9yZS5yZW1vdmUodG9kb1dyYXBwZXIpO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLmluc2VydFwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbi5hZnRlci5pbnNlcnQodG9kb1dyYXBwZXIpO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLnVwZGF0ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbi5hZnRlci51cGRhdGUodG9kb1dyYXBwZXIpO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLnJlbW92ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbi5hZnRlci5yZW1vdmUodG9kb1dyYXBwZXIpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpO1xuICB9XG59O1xuXG5jbGVhblRyaWdnZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuXG4gIC8qXG4gICAgIFx055Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsOaYr+S9v+eUqOS4i+agh+WIoOmZpOWvueixoeeahO+8jOaJgOS7peatpOWkhOWPjei9rGhvb2tz6ZuG5ZCI5ZCO77yM5YaN5Yig6ZmkXG4gICAgIFx05Zug5Li65LiA5Liq5pWw57uE5YWD57Sg5Yig6Zmk5ZCO77yM5YW25LuW5YWD57Sg55qE5LiL5qCH5Lya5Y+R55Sf5Y+Y5YyWXG4gICAqL1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdKSAhPSBudWxsID8gcmVmLnJldmVyc2UoKS5mb3JFYWNoKGZ1bmN0aW9uKF9ob29rKSB7XG4gICAgcmV0dXJuIF9ob29rLnJlbW92ZSgpO1xuICB9KSA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuaW5pdFRyaWdnZXJzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIG9iajtcbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjbGVhblRyaWdnZXIob2JqZWN0X25hbWUpO1xuICBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdO1xuICByZXR1cm4gXy5lYWNoKG9iai50cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlciwgdHJpZ2dlcl9uYW1lKSB7XG4gICAgdmFyIF90cmlnZ2VyX2hvb2s7XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcInNlcnZlclwiICYmIHRyaWdnZXIudG9kbyAmJiB0cmlnZ2VyLndoZW4pIHtcbiAgICAgIF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlcihvYmplY3RfbmFtZSwgdHJpZ2dlcik7XG4gICAgICBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIgJiYgdHJpZ2dlci50b2RvICYmIHRyaWdnZXIud2hlbikge1xuICAgICAgX3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyKG9iamVjdF9uYW1lLCB0cmlnZ2VyKTtcbiAgICAgIHJldHVybiBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRcdGlmICFvYmpcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRyZXR1cm4gb2JqLnBlcm1pc3Npb25zLmdldCgpXHJcblx0ZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcclxuXHJcbkNyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUsIHJlY29yZCwgdXNlcklkLCBzcGFjZUlkKS0+XHJcblx0aWYgIW9iamVjdF9uYW1lIGFuZCBNZXRlb3IuaXNDbGllbnRcclxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cclxuXHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUoQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSkpXHJcblxyXG5cdGlmIHJlY29yZFxyXG5cdFx0aXNPd25lciA9IHJlY29yZC5vd25lciA9PSB1c2VySWQgfHwgcmVjb3JkLm93bmVyPy5faWQgPT0gdXNlcklkXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0dXNlcl9jb21wYW55X2lkcyA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR1c2VyX2NvbXBhbnlfaWRzID0gQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyh1c2VySWQsIHNwYWNlSWQpXHJcblx0XHRyZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZD8uY29tcGFueV9pZFxyXG5cdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWQgYW5kIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWQpIGFuZCByZWNvcmRfY29tcGFueV9pZC5faWRcclxuXHRcdFx0IyDlm6ByZWNvcmRfY29tcGFueV9pZOaYr2xvb2t1cOexu+Wei++8jOacieWPr+iDvWR45o6n5Lu25Lya5oqK5a6D5pig5bCE6L2s5Li65a+55bqU55qEb2JqZWN077yM5omA5Lul6L+Z6YeM5Y+W5Ye65YW2X2lk5YC8XHJcblx0XHRcdHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkX2NvbXBhbnlfaWQuX2lkXHJcblx0XHRpZiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBhbmQgIWlzT3duZXIgYW5kICFwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXHJcblx0XHRlbHNlIGlmIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkIGFuZCBfLmlzU3RyaW5nKHJlY29yZF9jb21wYW55X2lkKVxyXG5cdFx0XHRcdGlmIHVzZXJfY29tcGFueV9pZHMgYW5kIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoXHJcblx0XHRcdFx0XHRpZiAhXy5pbmNsdWRlKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkKVxyXG5cdFx0XHRcdFx0XHQjIOiusOW9leeahGNvbXBhbnlfaWTlsZ7mgKfkuI3lnKjlvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz6IyD5Zu05YaF5pe277yM6K6k5Li65peg5p2D5L+u5pS5XHJcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2VcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQjIOiusOW9leaciWNvbXBhbnlfaWTlsZ7mgKfvvIzkvYbmmK/lvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz5Li656m65pe277yM6K6k5Li65peg5p2D5L+u5pS5XHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxyXG5cdFx0XHJcblx0XHRpZiByZWNvcmQubG9ja2VkIGFuZCAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXHJcblxyXG5cdFx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCAhaXNPd25lciBhbmQgIXBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxyXG5cdFx0ZWxzZSBpZiBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWQgYW5kIF8uaXNTdHJpbmcocmVjb3JkX2NvbXBhbnlfaWQpXHJcblx0XHRcdFx0aWYgdXNlcl9jb21wYW55X2lkcyBhbmQgdXNlcl9jb21wYW55X2lkcy5sZW5ndGhcclxuXHRcdFx0XHRcdGlmICFfLmluY2x1ZGUodXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWQpXHJcblx0XHRcdFx0XHRcdCMg6K6w5b2V55qEY29tcGFueV9pZOWxnuaAp+S4jeWcqOW9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPojIPlm7TlhoXml7bvvIzorqTkuLrml6DmnYPmn6XnnItcclxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2VcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQjIOiusOW9leaciWNvbXBhbnlfaWTlsZ7mgKfvvIzkvYbmmK/lvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz5Li656m65pe277yM6K6k5Li65peg5p2D5p+l55yLXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxyXG5cclxuXHRyZXR1cm4gcGVybWlzc2lvbnNcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cclxuXHRDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zID0gKHNwYWNlSWQsIHVzZXJJZCkgLT5cclxuXHRcdHBlcm1pc3Npb25zID1cclxuXHRcdFx0b2JqZWN0czoge31cclxuXHRcdFx0YXNzaWduZWRfYXBwczogW11cclxuXHRcdHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cdFx0cHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cdFx0cHNldHNNZW1iZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ21lbWJlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHRcdHBzZXRzR3Vlc3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cdFx0cHNldHNXb3JrZmxvd0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd3b3JrZmxvd19hZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCB1c2VyczoxfX0pIHx8IG51bGxcclxuXHRcdHBzZXRzT3JnYW5pemF0aW9uQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ29yZ2FuaXphdGlvbl9hZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCB1c2VyczoxfX0pIHx8IG51bGxcclxuXHRcdHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcclxuXHJcblx0XHRwc2V0c0FkbWluX3BvcyA9IG51bGxcclxuXHRcdHBzZXRzVXNlcl9wb3MgPSBudWxsXHJcblx0XHRwc2V0c01lbWJlcl9wb3MgPSBudWxsXHJcblx0XHRwc2V0c0d1ZXN0X3BvcyA9IG51bGxcclxuXHRcdHBzZXRzV29ya2Zsb3dBZG1pbl9wb3MgPSBudWxsXHJcblx0XHRwc2V0c09yZ2FuaXphdGlvbkFkbWluX3BvcyA9IG51bGxcclxuXHRcdHBzZXRzQ3VycmVudF9wb3MgPSBudWxsXHJcblxyXG5cdFx0aWYgcHNldHNBZG1pbj8uX2lkXHJcblx0XHRcdHBzZXRzQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0FkbWluLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxyXG5cdFx0aWYgcHNldHNVc2VyPy5faWRcclxuXHRcdFx0cHNldHNVc2VyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxyXG5cdFx0aWYgcHNldHNNZW1iZXI/Ll9pZFxyXG5cdFx0XHRwc2V0c01lbWJlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzTWVtYmVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxyXG5cdFx0aWYgcHNldHNHdWVzdD8uX2lkXHJcblx0XHRcdHBzZXRzR3Vlc3RfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0d1ZXN0Ll9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxyXG5cdFx0aWYgcHNldHNXb3JrZmxvd0FkbWluPy5faWRcclxuXHRcdFx0cHNldHNXb3JrZmxvd0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNXb3JrZmxvd0FkbWluLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxyXG5cdFx0aWYgcHNldHNPcmdhbml6YXRpb25BZG1pbj8uX2lkXHJcblx0XHRcdHBzZXRzT3JnYW5pemF0aW9uQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c09yZ2FuaXphdGlvbkFkbWluLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxyXG5cdFx0aWYgcHNldHNDdXJyZW50Lmxlbmd0aCA+IDBcclxuXHRcdFx0c2V0X2lkcyA9IF8ucGx1Y2sgcHNldHNDdXJyZW50LCBcIl9pZFwiXHJcblx0XHRcdHBzZXRzQ3VycmVudF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHskaW46IHNldF9pZHN9fSkuZmV0Y2goKVxyXG5cdFx0XHRwc2V0c0N1cnJlbnROYW1lcyA9IF8ucGx1Y2sgcHNldHNDdXJyZW50LCBcIm5hbWVcIlxyXG5cdFx0aXNTcGFjZUFkbWluID0gZmFsc2VcclxuXHRcdHNwYWNlVXNlciA9IG51bGxcclxuXHRcdGlmIHVzZXJJZFxyXG5cdFx0XHRpc1NwYWNlQWRtaW4gPSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXHJcblx0XHRcdGlzV29ya2Zsb3dBZG1pbiA9IHBzZXRzV29ya2Zsb3dBZG1pbj8udXNlcnM/LmluY2x1ZGVzKHVzZXJJZClcclxuXHRcdFx0aXNPcmdhbml6YXRpb25BZG1pbiA9IHBzZXRzT3JnYW5pemF0aW9uQWRtaW4/LnVzZXJzPy5pbmNsdWRlcyh1c2VySWQpXHJcblx0XHRcdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxyXG5cclxuXHRcdHBzZXRzID0geyBcclxuXHRcdFx0cHNldHNBZG1pbiwgXHJcblx0XHRcdHBzZXRzVXNlciwgXHJcblx0XHRcdHBzZXRzQ3VycmVudCwgXHJcblx0XHRcdHBzZXRzTWVtYmVyLCBcclxuXHRcdFx0cHNldHNHdWVzdCwgXHJcblx0XHRcdHBzZXRzV29ya2Zsb3dBZG1pbiwgXHJcblx0XHRcdHBzZXRzT3JnYW5pemF0aW9uQWRtaW4sIFxyXG5cdFx0XHRpc1NwYWNlQWRtaW4sIFxyXG5cdFx0XHRpc1dvcmtmbG93QWRtaW4sXHJcblx0XHRcdGlzT3JnYW5pemF0aW9uQWRtaW4sXHJcblx0XHRcdHNwYWNlVXNlciwgXHJcblx0XHRcdHBzZXRzQWRtaW5fcG9zLCBcclxuXHRcdFx0cHNldHNVc2VyX3BvcywgXHJcblx0XHRcdHBzZXRzTWVtYmVyX3BvcywgXHJcblx0XHRcdHBzZXRzR3Vlc3RfcG9zLCBcclxuXHRcdFx0cHNldHNXb3JrZmxvd0FkbWluX3BvcywgXHJcblx0XHRcdHBzZXRzT3JnYW5pemF0aW9uQWRtaW5fcG9zLCBcclxuXHRcdFx0cHNldHNDdXJyZW50X3Bvc1xyXG5cdFx0fVxyXG5cdFx0cGVybWlzc2lvbnMuYXNzaWduZWRfYXBwcyA9IENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZClcclxuXHRcdHBlcm1pc3Npb25zLmFzc2lnbmVkX21lbnVzID0gQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZClcclxuXHRcdHBlcm1pc3Npb25zLnVzZXJfcGVybWlzc2lvbl9zZXRzID0gcHNldHNDdXJyZW50TmFtZXNcclxuXHRcdF9pID0gMFxyXG5cdFx0Xy5lYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG9iamVjdCwgb2JqZWN0X25hbWUpLT5cclxuXHRcdFx0X2krK1xyXG5cdFx0XHRpZiAhXy5oYXMob2JqZWN0LCAnc3BhY2UnKSB8fCAhb2JqZWN0LnNwYWNlIHx8IG9iamVjdC5zcGFjZSA9PSBzcGFjZUlkXHJcblx0XHRcdFx0cGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV0gPSBfLmNsb25lIENyZWF0b3IuY29udmVydE9iamVjdChDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdKVxyXG5cdFx0XHRcdHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdW1wicGVybWlzc2lvbnNcIl0gPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXHJcblx0XHRyZXR1cm4gcGVybWlzc2lvbnNcclxuXHJcblx0dW5pb25QbHVzID0gKGFycmF5LCBvdGhlcikgLT5cclxuXHRcdGlmICFhcnJheSBhbmQgIW90aGVyXHJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcclxuXHRcdGlmICFhcnJheVxyXG5cdFx0XHRhcnJheSA9IFtdXHJcblx0XHRpZiAhb3RoZXJcclxuXHRcdFx0b3RoZXIgPSBbXVxyXG5cdFx0cmV0dXJuIF8udW5pb24oYXJyYXksIG90aGVyKVxyXG5cclxuXHRDcmVhdG9yLmdldEFzc2lnbmVkQXBwcyA9IChzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRcdHBzZXRzQWRtaW4gPSB0aGlzLnBzZXRzQWRtaW4gfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXHJcblx0XHRwc2V0c1VzZXIgPSB0aGlzLnBzZXRzVXNlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0IyBwc2V0c01lbWJlciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0IyBwc2V0c0d1ZXN0ID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0cHNldHMgPSAgdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pLmZldGNoKClcclxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxyXG5cdFx0YXBwcyA9IFtdXHJcblx0XHRpZiBpc1NwYWNlQWRtaW5cclxuXHRcdFx0cmV0dXJuIFtdXHJcblx0XHRlbHNlXHJcblx0XHRcdHBzZXRCYXNlID0gcHNldHNVc2VyXHJcblx0XHRcdGlmIHBzZXRCYXNlPy5hc3NpZ25lZF9hcHBzXHJcblx0XHRcdFx0YXBwcyA9IF8udW5pb24gYXBwcywgcHNldEJhc2UuYXNzaWduZWRfYXBwc1xyXG5cdFx0XHRfLmVhY2ggcHNldHMsIChwc2V0KS0+XHJcblx0XHRcdFx0aWYgIXBzZXQuYXNzaWduZWRfYXBwc1xyXG5cdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdFx0aWYgcHNldC5uYW1lID09IFwiYWRtaW5cIiB8fCAgcHNldC5uYW1lID09IFwidXNlclwiXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRhcHBzID0gXy51bmlvbiBhcHBzLCBwc2V0LmFzc2lnbmVkX2FwcHNcclxuXHRcdFx0cmV0dXJuIF8ud2l0aG91dChfLnVuaXEoYXBwcyksdW5kZWZpbmVkLG51bGwpXHJcblxyXG5cdENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cyA9IChzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRcdHBzZXRzID0gIHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIG5hbWU6MX19KS5mZXRjaCgpXHJcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcclxuXHRcdGFkbWluTWVudXMgPSBDcmVhdG9yLkFwcHMuYWRtaW4/LmFkbWluX21lbnVzXHJcblx0XHQjIOWmguaenOayoeaciWFkbWlu6I+c5Y2V6K+05piO5LiN6ZyA6KaB55u45YWz5Yqf6IO977yM55u05o6l6L+U5Zue56m6XHJcblx0XHR1bmxlc3MgYWRtaW5NZW51c1xyXG5cdFx0XHRyZXR1cm4gW11cclxuXHRcdGFib3V0TWVudSA9IGFkbWluTWVudXMuZmluZCAobikgLT5cclxuXHRcdFx0bi5faWQgPT0gJ2Fib3V0J1xyXG5cdFx0YWRtaW5NZW51cyA9IGFkbWluTWVudXMuZmlsdGVyIChuKSAtPlxyXG5cdFx0XHRuLl9pZCAhPSAnYWJvdXQnXHJcblx0XHRvdGhlck1lbnVBcHBzID0gXy5zb3J0QnkgXy5maWx0ZXIoXy52YWx1ZXMoQ3JlYXRvci5BcHBzKSwgKG4pIC0+XHJcblx0XHRcdHJldHVybiBuLmFkbWluX21lbnVzIGFuZCBuLl9pZCAhPSAnYWRtaW4nXHJcblx0XHQpLCAnc29ydCdcclxuXHRcdG90aGVyTWVudXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhvdGhlck1lbnVBcHBzLCBcImFkbWluX21lbnVzXCIpKVxyXG5cdFx0IyDoj5zljZXmnInkuInpg6jliIbnu4TmiJDorr7nva5BUFDoj5zljZXjgIHlhbbku5ZBUFDoj5zljZXku6Xlj4phYm91dOiPnOWNlVxyXG5cdFx0YWxsTWVudXMgPSBfLnVuaW9uKGFkbWluTWVudXMsIG90aGVyTWVudXMsIFthYm91dE1lbnVdKVxyXG5cdFx0aWYgaXNTcGFjZUFkbWluXHJcblx0XHRcdCMg5bel5L2c5Yy6566h55CG5ZGY5pyJ5YWo6YOo6I+c5Y2V5Yqf6IO9XHJcblx0XHRcdHJldHVybiBhbGxNZW51c1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRjdXJyZW50UHNldE5hbWVzID0gcHNldHMubWFwIChuKSAtPlxyXG5cdFx0XHRcdHJldHVybiBuLm5hbWVcclxuXHRcdFx0bWVudXMgPSBhbGxNZW51cy5maWx0ZXIgKG1lbnUpLT5cclxuXHRcdFx0XHRwc2V0c01lbnUgPSBtZW51LnBlcm1pc3Npb25fc2V0c1xyXG5cdFx0XHRcdCMg5aaC5p6c5pmu6YCa55So5oi35pyJ5p2D6ZmQ77yM5YiZ55u05o6l6L+U5ZuedHJ1ZVxyXG5cdFx0XHRcdGlmIHBzZXRzTWVudSAmJiBwc2V0c01lbnUuaW5kZXhPZihcInVzZXJcIikgPiAtMVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0XHQjIOWQpuWImeWPluW9k+WJjeeUqOaIt+eahOadg+mZkOmbhuS4jm1lbnXoj5zljZXopoHmsYLnmoTmnYPpmZDpm4blr7nmr5TvvIzlpoLmnpzkuqTpm4blpKfkuo4x5Liq5YiZ6L+U5ZuedHJ1ZVxyXG5cdFx0XHRcdHJldHVybiBfLmludGVyc2VjdGlvbihjdXJyZW50UHNldE5hbWVzLCBwc2V0c01lbnUpLmxlbmd0aFxyXG5cdFx0XHRyZXR1cm4gbWVudXNcclxuXHJcblx0ZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCA9IChwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZCktPlxyXG5cclxuXHRcdGlmIF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cylcclxuXHRcdFx0cmV0dXJuIG51bGxcclxuXHRcdGlmIF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpXHJcblx0XHRcdHJldHVybiBfLmZpbmQgcGVybWlzc2lvbl9vYmplY3RzLCAocG8pLT5cclxuXHRcdFx0XHRcdHJldHVybiBwby5vYmplY3RfbmFtZSA9PSBvYmplY3RfbmFtZVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkOiBwZXJtaXNzaW9uX3NldF9pZH0pXHJcblxyXG5cdGZpbmRfcGVybWlzc2lvbl9vYmplY3QgPSAocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWRzKS0+XHJcblx0XHRpZiBfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpXHJcblx0XHRcdHJldHVybiBudWxsXHJcblx0XHRpZiBfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKVxyXG5cdFx0XHRyZXR1cm4gXy5maWx0ZXIgcGVybWlzc2lvbl9vYmplY3RzLCAocG8pLT5cclxuXHRcdFx0XHRyZXR1cm4gcG8ub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcclxuXHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkOiB7JGluOiBwZXJtaXNzaW9uX3NldF9pZHN9fSkuZmV0Y2goKVxyXG5cclxuXHRDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zID0gKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpLT5cclxuXHRcdHBlcm1pc3Npb25zID0ge31cclxuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKVxyXG5cclxuXHRcdGlmIHNwYWNlSWQgaXMgJ2d1ZXN0JyB8fCBvYmplY3RfbmFtZSA9PSBcInVzZXJzXCJcclxuXHRcdFx0cGVybWlzc2lvbnMgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge31cclxuXHRcdFx0Q3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgcGVybWlzc2lvbnNcclxuXHRcdFx0cmV0dXJuIHBlcm1pc3Npb25zXHJcblx0XHRwc2V0c0FkbWluID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0FkbWluKSBvciB0aGlzLnBzZXRzQWRtaW4gdGhlbiB0aGlzLnBzZXRzQWRtaW4gZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxfX0pXHJcblx0XHRwc2V0c1VzZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzVXNlcikgb3IgdGhpcy5wc2V0c1VzZXIgdGhlbiB0aGlzLnBzZXRzVXNlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MX19KVxyXG5cdFx0cHNldHNNZW1iZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzTWVtYmVyKSBvciB0aGlzLnBzZXRzTWVtYmVyIHRoZW4gdGhpcy5wc2V0c01lbWJlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXHJcblx0XHRwc2V0c0d1ZXN0ID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0d1ZXN0KSBvciB0aGlzLnBzZXRzR3Vlc3QgdGhlbiB0aGlzLnBzZXRzR3Vlc3QgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxfX0pXHJcblx0XHRwc2V0c1dvcmtmbG93QWRtaW4gPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzV29ya2Zsb3dBZG1pbikgb3IgdGhpcy5wc2V0c1dvcmtmbG93QWRtaW4gdGhlbiB0aGlzLnBzZXRzV29ya2Zsb3dBZG1pbiBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnd29ya2Zsb3dfYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIHVzZXJzOjF9fSlcclxuXHRcdHBzZXRzT3JnYW5pemF0aW9uQWRtaW4gPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzT3JnYW5pemF0aW9uQWRtaW4pIG9yIHRoaXMucHNldHNPcmdhbml6YXRpb25BZG1pbiB0aGVuIHRoaXMucHNldHNPcmdhbml6YXRpb25BZG1pbiBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnb3JnYW5pemF0aW9uX2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCB1c2VyczoxfX0pXHJcblx0XHRwc2V0cyA9ICB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxfX0pLmZldGNoKClcclxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxyXG5cdFx0aXNXb3JrZmxvd0FkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1dvcmtmbG93QWRtaW4pIHRoZW4gdGhpcy5pc1dvcmtmbG93QWRtaW4gZWxzZSBwc2V0c1dvcmtmbG93QWRtaW4/LnVzZXJzPy5pbmNsdWRlcyh1c2VySWQpXHJcblx0XHRpc09yZ2FuaXphdGlvbkFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc09yZ2FuaXphdGlvbkFkbWluKSB0aGVuIHRoaXMuaXNPcmdhbml6YXRpb25BZG1pbiBlbHNlIHBzZXRzT3JnYW5pemF0aW9uQWRtaW4/LnVzZXJzPy5pbmNsdWRlcyh1c2VySWQpXHJcblxyXG5cdFx0cHNldHNBZG1pbl9wb3MgPSB0aGlzLnBzZXRzQWRtaW5fcG9zXHJcblx0XHRwc2V0c1VzZXJfcG9zID0gdGhpcy5wc2V0c1VzZXJfcG9zXHJcblx0XHRwc2V0c01lbWJlcl9wb3MgPSB0aGlzLnBzZXRzTWVtYmVyX3Bvc1xyXG5cdFx0cHNldHNHdWVzdF9wb3MgPSB0aGlzLnBzZXRzR3Vlc3RfcG9zXHJcblx0XHRwc2V0c1dvcmtmbG93QWRtaW5fcG9zID0gdGhpcy5wc2V0c1dvcmtmbG93QWRtaW5fcG9zXHJcblx0XHRwc2V0c09yZ2FuaXphdGlvbkFkbWluX3BvcyA9IHRoaXMucHNldHNPcmdhbml6YXRpb25BZG1pbl9wb3NcclxuXHRcdHBzZXRzQ3VycmVudF9wb3MgPSB0aGlzLnBzZXRzQ3VycmVudF9wb3NcclxuXHJcblx0XHRvcHNldEFkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuYWRtaW4pIHx8IHt9XHJcblx0XHRvcHNldFVzZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC51c2VyKSB8fCB7fVxyXG5cdFx0b3BzZXRNZW1iZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5tZW1iZXIpIHx8IHt9XHJcblx0XHRvcHNldEd1ZXN0ID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9XHJcblx0XHRvcHNldFdvcmtmbG93QWRtaW4gPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC53b3JrZmxvd19hZG1pbikgfHwge31cclxuXHRcdG9wc2V0T3JnYW5pemF0aW9uQWRtaW4gPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5vcmdhbml6YXRpb25fYWRtaW4pIHx8IHt9XHJcblx0XHQjIHNoYXJlZExpc3RWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X2xpc3R2aWV3cycpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNoYXJlZDogdHJ1ZX0sIHtmaWVsZHM6e19pZDoxfX0pLmZldGNoKClcclxuXHRcdCMgc2hhcmVkTGlzdFZpZXdzID0gXy5wbHVjayhzaGFyZWRMaXN0Vmlld3MsXCJfaWRcIilcclxuXHRcdCMgaWYgc2hhcmVkTGlzdFZpZXdzLmxlbmd0aFxyXG5cdFx0IyBcdHVubGVzcyBvcHNldEFkbWluLmxpc3Rfdmlld3NcclxuXHRcdCMgXHRcdG9wc2V0QWRtaW4ubGlzdF92aWV3cyA9IFtdXHJcblx0XHQjIFx0b3BzZXRBZG1pbi5saXN0X3ZpZXdzID0gXy51bmlvbiBvcHNldEFkbWluLmxpc3Rfdmlld3MsIHNoYXJlZExpc3RWaWV3c1xyXG5cdFx0IyBcdHVubGVzcyBvcHNldFVzZXIubGlzdF92aWV3c1xyXG5cdFx0IyBcdFx0b3BzZXRVc2VyLmxpc3Rfdmlld3MgPSBbXVxyXG5cdFx0IyBcdG9wc2V0VXNlci5saXN0X3ZpZXdzID0gXy51bmlvbiBvcHNldFVzZXIubGlzdF92aWV3cywgc2hhcmVkTGlzdFZpZXdzXHJcblx0XHQjIOaVsOaNruW6k+S4reWmguaenOmFjee9ruS6hum7mOiupOeahGFkbWluL3VzZXLmnYPpmZDpm4borr7nva7vvIzlupTor6Xopobnm5bku6PnoIHkuK1hZG1pbi91c2Vy55qE5p2D6ZmQ6ZuG6K6+572uXHJcblx0XHRpZiBwc2V0c0FkbWluXHJcblx0XHRcdHBvc0FkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0FkbWluX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQWRtaW4uX2lkKVxyXG5cdFx0XHRpZiBwb3NBZG1pblxyXG5cdFx0XHRcdG9wc2V0QWRtaW4uYWxsb3dDcmVhdGUgPSBwb3NBZG1pbi5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdG9wc2V0QWRtaW4uYWxsb3dEZWxldGUgPSBwb3NBZG1pbi5hbGxvd0RlbGV0ZVxyXG5cdFx0XHRcdG9wc2V0QWRtaW4uYWxsb3dFZGl0ID0gcG9zQWRtaW4uYWxsb3dFZGl0XHJcblx0XHRcdFx0b3BzZXRBZG1pbi5hbGxvd1JlYWQgPSBwb3NBZG1pbi5hbGxvd1JlYWRcclxuXHRcdFx0XHRvcHNldEFkbWluLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NBZG1pbi5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi52aWV3QWxsUmVjb3JkcyA9IHBvc0FkbWluLnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0FkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NBZG1pbi52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldEFkbWluLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi5kaXNhYmxlZF9hY3Rpb25zID0gcG9zQWRtaW4uZGlzYWJsZWRfYWN0aW9uc1xyXG5cdFx0XHRcdG9wc2V0QWRtaW4udW5yZWFkYWJsZV9maWVsZHMgPSBwb3NBZG1pbi51bnJlYWRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0QWRtaW4udW5lZGl0YWJsZV9maWVsZHMgPSBwb3NBZG1pbi51bmVkaXRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0QWRtaW4udW5yZWxhdGVkX29iamVjdHMgPSBwb3NBZG1pbi51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdFx0aWYgcHNldHNVc2VyXHJcblx0XHRcdHBvc1VzZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzVXNlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1VzZXIuX2lkKVxyXG5cdFx0XHRpZiBwb3NVc2VyXHJcblx0XHRcdFx0b3BzZXRVc2VyLmFsbG93Q3JlYXRlID0gcG9zVXNlci5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdG9wc2V0VXNlci5hbGxvd0RlbGV0ZSA9IHBvc1VzZXIuYWxsb3dEZWxldGVcclxuXHRcdFx0XHRvcHNldFVzZXIuYWxsb3dFZGl0ID0gcG9zVXNlci5hbGxvd0VkaXRcclxuXHRcdFx0XHRvcHNldFVzZXIuYWxsb3dSZWFkID0gcG9zVXNlci5hbGxvd1JlYWRcclxuXHRcdFx0XHRvcHNldFVzZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0VXNlci52aWV3QWxsUmVjb3JkcyA9IHBvc1VzZXIudmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldFVzZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NVc2VyLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRVc2VyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIudmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRVc2VyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NVc2VyLmRpc2FibGVkX2xpc3Rfdmlld3NcclxuXHRcdFx0XHRvcHNldFVzZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc1VzZXIuZGlzYWJsZWRfYWN0aW9uc1xyXG5cdFx0XHRcdG9wc2V0VXNlci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1VzZXIudW5yZWFkYWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldFVzZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NVc2VyLnVuZWRpdGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRVc2VyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zVXNlci51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdFx0aWYgcHNldHNNZW1iZXJcclxuXHRcdFx0cG9zTWVtYmVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c01lbWJlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c01lbWJlci5faWQpXHJcblx0XHRcdGlmIHBvc01lbWJlclxyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmFsbG93Q3JlYXRlID0gcG9zTWVtYmVyLmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuYWxsb3dEZWxldGUgPSBwb3NNZW1iZXIuYWxsb3dEZWxldGVcclxuXHRcdFx0XHRvcHNldE1lbWJlci5hbGxvd0VkaXQgPSBwb3NNZW1iZXIuYWxsb3dFZGl0XHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuYWxsb3dSZWFkID0gcG9zTWVtYmVyLmFsbG93UmVhZFxyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NNZW1iZXIubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnZpZXdBbGxSZWNvcmRzID0gcG9zTWVtYmVyLnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NNZW1iZXIubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldE1lbWJlci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NNZW1iZXIudmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc01lbWJlci5kaXNhYmxlZF9saXN0X3ZpZXdzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc01lbWJlci5kaXNhYmxlZF9hY3Rpb25zXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NNZW1iZXIudW5yZWFkYWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldE1lbWJlci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc01lbWJlci51bmVkaXRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zTWVtYmVyLnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRpZiBwc2V0c0d1ZXN0XHJcblx0XHRcdHBvc0d1ZXN0ID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0d1ZXN0X3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzR3Vlc3QuX2lkKVxyXG5cdFx0XHRpZiBwb3NHdWVzdFxyXG5cdFx0XHRcdG9wc2V0R3Vlc3QuYWxsb3dDcmVhdGUgPSBwb3NHdWVzdC5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdG9wc2V0R3Vlc3QuYWxsb3dEZWxldGUgPSBwb3NHdWVzdC5hbGxvd0RlbGV0ZVxyXG5cdFx0XHRcdG9wc2V0R3Vlc3QuYWxsb3dFZGl0ID0gcG9zR3Vlc3QuYWxsb3dFZGl0XHJcblx0XHRcdFx0b3BzZXRHdWVzdC5hbGxvd1JlYWQgPSBwb3NHdWVzdC5hbGxvd1JlYWRcclxuXHRcdFx0XHRvcHNldEd1ZXN0Lm1vZGlmeUFsbFJlY29yZHMgPSBwb3NHdWVzdC5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC52aWV3QWxsUmVjb3JkcyA9IHBvc0d1ZXN0LnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0d1ZXN0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NHdWVzdC52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldEd1ZXN0LmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NHdWVzdC5kaXNhYmxlZF9saXN0X3ZpZXdzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC5kaXNhYmxlZF9hY3Rpb25zID0gcG9zR3Vlc3QuZGlzYWJsZWRfYWN0aW9uc1xyXG5cdFx0XHRcdG9wc2V0R3Vlc3QudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NHdWVzdC51bnJlYWRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0R3Vlc3QudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NHdWVzdC51bmVkaXRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0R3Vlc3QudW5yZWxhdGVkX29iamVjdHMgPSBwb3NHdWVzdC51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdFx0aWYgcHNldHNXb3JrZmxvd0FkbWluXHJcblx0XHRcdHBvc1dvcmtmbG93QWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzV29ya2Zsb3dBZG1pbl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1dvcmtmbG93QWRtaW4uX2lkKVxyXG5cdFx0XHRpZiBwb3NXb3JrZmxvd0FkbWluXHJcblx0XHRcdFx0b3BzZXRXb3JrZmxvd0FkbWluLmFsbG93Q3JlYXRlID0gcG9zV29ya2Zsb3dBZG1pbi5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdG9wc2V0V29ya2Zsb3dBZG1pbi5hbGxvd0RlbGV0ZSA9IHBvc1dvcmtmbG93QWRtaW4uYWxsb3dEZWxldGVcclxuXHRcdFx0XHRvcHNldFdvcmtmbG93QWRtaW4uYWxsb3dFZGl0ID0gcG9zV29ya2Zsb3dBZG1pbi5hbGxvd0VkaXRcclxuXHRcdFx0XHRvcHNldFdvcmtmbG93QWRtaW4uYWxsb3dSZWFkID0gcG9zV29ya2Zsb3dBZG1pbi5hbGxvd1JlYWRcclxuXHRcdFx0XHRvcHNldFdvcmtmbG93QWRtaW4ubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1dvcmtmbG93QWRtaW4ubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0V29ya2Zsb3dBZG1pbi52aWV3QWxsUmVjb3JkcyA9IHBvc1dvcmtmbG93QWRtaW4udmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldFdvcmtmbG93QWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NXb3JrZmxvd0FkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRXb3JrZmxvd0FkbWluLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1dvcmtmbG93QWRtaW4udmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRXb3JrZmxvd0FkbWluLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NXb3JrZmxvd0FkbWluLmRpc2FibGVkX2xpc3Rfdmlld3NcclxuXHRcdFx0XHRvcHNldFdvcmtmbG93QWRtaW4uZGlzYWJsZWRfYWN0aW9ucyA9IHBvc1dvcmtmbG93QWRtaW4uZGlzYWJsZWRfYWN0aW9uc1xyXG5cdFx0XHRcdG9wc2V0V29ya2Zsb3dBZG1pbi51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1dvcmtmbG93QWRtaW4udW5yZWFkYWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldFdvcmtmbG93QWRtaW4udW5lZGl0YWJsZV9maWVsZHMgPSBwb3NXb3JrZmxvd0FkbWluLnVuZWRpdGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRXb3JrZmxvd0FkbWluLnVucmVsYXRlZF9vYmplY3RzID0gcG9zV29ya2Zsb3dBZG1pbi51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdFx0aWYgcHNldHNPcmdhbml6YXRpb25BZG1pblxyXG5cdFx0XHRwb3NPcmdhbml6YXRpb25BZG1pbiA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNPcmdhbml6YXRpb25BZG1pbl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c09yZ2FuaXphdGlvbkFkbWluLl9pZClcclxuXHRcdFx0aWYgcG9zT3JnYW5pemF0aW9uQWRtaW5cclxuXHRcdFx0XHRvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93Q3JlYXRlID0gcG9zT3JnYW5pemF0aW9uQWRtaW4uYWxsb3dDcmVhdGVcclxuXHRcdFx0XHRvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93RGVsZXRlID0gcG9zT3JnYW5pemF0aW9uQWRtaW4uYWxsb3dEZWxldGVcclxuXHRcdFx0XHRvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93RWRpdCA9IHBvc09yZ2FuaXphdGlvbkFkbWluLmFsbG93RWRpdFxyXG5cdFx0XHRcdG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uYWxsb3dSZWFkID0gcG9zT3JnYW5pemF0aW9uQWRtaW4uYWxsb3dSZWFkXHJcblx0XHRcdFx0b3BzZXRPcmdhbml6YXRpb25BZG1pbi5tb2RpZnlBbGxSZWNvcmRzID0gcG9zT3JnYW5pemF0aW9uQWRtaW4ubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0T3JnYW5pemF0aW9uQWRtaW4udmlld0FsbFJlY29yZHMgPSBwb3NPcmdhbml6YXRpb25BZG1pbi52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0T3JnYW5pemF0aW9uQWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NPcmdhbml6YXRpb25BZG1pbi5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0T3JnYW5pemF0aW9uQWRtaW4udmlld0NvbXBhbnlSZWNvcmRzID0gcG9zT3JnYW5pemF0aW9uQWRtaW4udmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRPcmdhbml6YXRpb25BZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zT3JnYW5pemF0aW9uQWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3c1xyXG5cdFx0XHRcdG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uZGlzYWJsZWRfYWN0aW9ucyA9IHBvc09yZ2FuaXphdGlvbkFkbWluLmRpc2FibGVkX2FjdGlvbnNcclxuXHRcdFx0XHRvcHNldE9yZ2FuaXphdGlvbkFkbWluLnVucmVhZGFibGVfZmllbGRzID0gcG9zT3JnYW5pemF0aW9uQWRtaW4udW5yZWFkYWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldE9yZ2FuaXphdGlvbkFkbWluLnVuZWRpdGFibGVfZmllbGRzID0gcG9zT3JnYW5pemF0aW9uQWRtaW4udW5lZGl0YWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldE9yZ2FuaXphdGlvbkFkbWluLnVucmVsYXRlZF9vYmplY3RzID0gcG9zT3JnYW5pemF0aW9uQWRtaW4udW5yZWxhdGVkX29iamVjdHNcclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEFkbWluXHJcblx0XHRlbHNlXHJcblx0XHRcdGlmIGlzU3BhY2VBZG1pblxyXG5cdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRBZG1pblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aWYgc3BhY2VJZCBpcyAnY29tbW9uJ1xyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRzcGFjZVVzZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnNwYWNlVXNlcikgb3IgdGhpcy5zcGFjZVVzZXIgdGhlbiB0aGlzLnNwYWNlVXNlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxyXG5cdFx0XHRcdFx0aWYgc3BhY2VVc2VyXHJcblx0XHRcdFx0XHRcdHByb2YgPSBzcGFjZVVzZXIucHJvZmlsZVxyXG5cdFx0XHRcdFx0XHRpZiBwcm9mXHJcblx0XHRcdFx0XHRcdFx0aWYgcHJvZiBpcyAndXNlcidcclxuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdtZW1iZXInXHJcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0TWVtYmVyXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdndWVzdCdcclxuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdFxyXG5cdFx0XHRcdFx0XHRlbHNlICMg5rKh5pyJcHJvZmlsZeWImeiupOS4uuaYr3VzZXLmnYPpmZBcclxuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3RcclxuXHJcblx0XHRpZiBwc2V0cy5sZW5ndGggPiAwXHJcblx0XHRcdHNldF9pZHMgPSBfLnBsdWNrIHBzZXRzLCBcIl9pZFwiXHJcblx0XHRcdHBvcyA9IGZpbmRfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXJyZW50X3Bvcywgb2JqZWN0X25hbWUsIHNldF9pZHMpXHJcblx0XHRcdF8uZWFjaCBwb3MsIChwbyktPlxyXG5cdFx0XHRcdGlmIHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzQWRtaW4/Ll9pZCBvciBcclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c1VzZXI/Ll9pZCBvciBcclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c01lbWJlcj8uX2lkIG9yIFxyXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzR3Vlc3Q/Ll9pZCBvciBcclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c1dvcmtmbG93QWRtaW4/Ll9pZCBvciBcclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c09yZ2FuaXphdGlvbkFkbWluPy5faWRcclxuXHRcdFx0XHRcdCMg6buY6K6k55qEYWRtaW4vdXNlcuadg+mZkOWAvOWPquWunuihjOS4iumdoueahOm7mOiupOWAvOimhueblu+8jOS4jeWBmueul+azleWIpOaWrVxyXG5cdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdFx0aWYgcG8uYWxsb3dSZWFkXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSB0cnVlXHJcblx0XHRcdFx0aWYgcG8uYWxsb3dDcmVhdGVcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIHBvLmFsbG93RWRpdFxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIHBvLmFsbG93RGVsZXRlXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHRydWVcclxuXHRcdFx0XHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIHBvLnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA9IHRydWVcclxuXHRcdFx0XHRpZiBwby5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSB0cnVlXHJcblx0XHRcdFx0aWYgcG8udmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlXHJcblxyXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSB1bmlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cywgcG8uZGlzYWJsZWRfbGlzdF92aWV3cylcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMsIHBvLmRpc2FibGVkX2FjdGlvbnMpXHJcblx0XHRcdFx0cGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIHBvLnVucmVhZGFibGVfZmllbGRzKVxyXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBwby51bmVkaXRhYmxlX2ZpZWxkcylcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cywgcG8udW5yZWxhdGVkX29iamVjdHMpXHJcblxyXG5cdFx0XHRpZiBpc1dvcmtmbG93QWRtaW5cclxuXHRcdFx0XHRpZiBvcHNldFdvcmtmbG93QWRtaW4uYWxsb3dSZWFkXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSB0cnVlXHJcblx0XHRcdFx0aWYgb3BzZXRXb3JrZmxvd0FkbWluLmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHRydWVcclxuXHRcdFx0XHRpZiBvcHNldFdvcmtmbG93QWRtaW4uYWxsb3dFZGl0XHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSB0cnVlXHJcblx0XHRcdFx0aWYgb3BzZXRXb3JrZmxvd0FkbWluLmFsbG93RGVsZXRlXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHRydWVcclxuXHRcdFx0XHRpZiBvcHNldFdvcmtmbG93QWRtaW4ubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IHRydWVcclxuXHRcdFx0XHRpZiBvcHNldFdvcmtmbG93QWRtaW4udmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIG9wc2V0V29ya2Zsb3dBZG1pbi5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSB0cnVlXHJcblx0XHRcdFx0aWYgb3BzZXRXb3JrZmxvd0FkbWluLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZVxyXG5cclxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIG9wc2V0V29ya2Zsb3dBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzKVxyXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgb3BzZXRXb3JrZmxvd0FkbWluLmRpc2FibGVkX2FjdGlvbnMpXHJcblx0XHRcdFx0cGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIG9wc2V0V29ya2Zsb3dBZG1pbi51bnJlYWRhYmxlX2ZpZWxkcylcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgb3BzZXRXb3JrZmxvd0FkbWluLnVuZWRpdGFibGVfZmllbGRzKVxyXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBvcHNldFdvcmtmbG93QWRtaW4udW5yZWxhdGVkX29iamVjdHMpXHJcblxyXG5cdFx0XHRpZiBpc09yZ2FuaXphdGlvbkFkbWluXHJcblx0XHRcdFx0aWYgb3BzZXRPcmdhbml6YXRpb25BZG1pbi5hbGxvd1JlYWRcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHRydWVcclxuXHRcdFx0XHRpZiBvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHRydWVcclxuXHRcdFx0XHRpZiBvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93RWRpdFxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uYWxsb3dEZWxldGVcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4ubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IHRydWVcclxuXHRcdFx0XHRpZiBvcHNldE9yZ2FuaXphdGlvbkFkbWluLnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA9IHRydWVcclxuXHRcdFx0XHRpZiBvcHNldE9yZ2FuaXphdGlvbkFkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHRydWVcclxuXHRcdFx0XHRpZiBvcHNldE9yZ2FuaXphdGlvbkFkbWluLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZVxyXG5cclxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cylcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMsIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uZGlzYWJsZWRfYWN0aW9ucylcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgb3BzZXRPcmdhbml6YXRpb25BZG1pbi51bnJlYWRhYmxlX2ZpZWxkcylcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgb3BzZXRPcmdhbml6YXRpb25BZG1pbi51bmVkaXRhYmxlX2ZpZWxkcylcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cywgb3BzZXRPcmdhbml6YXRpb25BZG1pbi51bnJlbGF0ZWRfb2JqZWN0cylcclxuXHRcdFxyXG5cdFx0aWYgb2JqZWN0LmlzX3ZpZXdcclxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBmYWxzZVxyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXHJcblx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSBmYWxzZVxyXG5cdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IGZhbHNlXHJcblx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBbXVxyXG5cdFx0Q3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgcGVybWlzc2lvbnNcclxuXHRcdHJldHVybiBwZXJtaXNzaW9uc1xyXG5cclxuXHJcblx0IyBDcmVhdG9yLmluaXRQZXJtaXNzaW9ucyA9IChvYmplY3RfbmFtZSkgLT5cclxuXHJcblx0XHQjICMg5bqU6K+l5oqK6K6h566X5Ye65p2l55qEXHJcblx0XHQjIENyZWF0b3IuQ29sbGVjdGlvbnNbb2JqZWN0X25hbWVdLmFsbG93XHJcblx0XHQjIFx0aW5zZXJ0OiAodXNlcklkLCBkb2MpIC0+XHJcblx0XHQjIFx0XHRpZiAhdXNlcklkXHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHQgICAgXHQjIFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoZG9jLnNwYWNlLCB1c2VySWQsIG9iamVjdF9uYW1lKVxyXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93Q3JlYXRlXHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHRcdCMgXHRcdHJldHVybiB0cnVlXHJcblx0XHQjIFx0dXBkYXRlOiAodXNlcklkLCBkb2MpIC0+XHJcblx0XHQjIFx0XHRpZiAhdXNlcklkXHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXHJcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dFZGl0XHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcclxuXHRcdCMgXHRyZW1vdmU6ICh1c2VySWQsIGRvYykgLT5cclxuXHRcdCMgXHRcdGlmICF1c2VySWRcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQjIFx0XHRpZiAhZG9jLnNwYWNlXHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcclxuXHRcdCMgXHRcdGlmICFwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZVxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdCMgXHRcdHJldHVybiB0cnVlXHJcblxyXG5cdE1ldGVvci5tZXRob2RzXHJcblx0XHQjIENhbGN1bGF0ZSBQZXJtaXNzaW9ucyBvbiBTZXJ2ZXJcclxuXHRcdFwiY3JlYXRvci5vYmplY3RfcGVybWlzc2lvbnNcIjogKHNwYWNlSWQpLT5cclxuXHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdGhpcy51c2VySWQpXHJcbiIsInZhciBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0LCBmaW5kX3Blcm1pc3Npb25fb2JqZWN0LCB1bmlvblBsdXM7XG5cbkNyZWF0b3IuZ2V0UGVybWlzc2lvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBvYmo7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoIW9iaikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gb2JqLnBlcm1pc3Npb25zLmdldCgpO1xuICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIHJldHVybiBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZCwgdXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBpc093bmVyLCBwZXJtaXNzaW9ucywgcmVjb3JkX2NvbXBhbnlfaWQsIHJlZiwgdXNlcl9jb21wYW55X2lkcztcbiAgaWYgKCFvYmplY3RfbmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBfLmNsb25lKENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpKTtcbiAgaWYgKHJlY29yZCkge1xuICAgIGlzT3duZXIgPSByZWNvcmQub3duZXIgPT09IHVzZXJJZCB8fCAoKHJlZiA9IHJlY29yZC5vd25lcikgIT0gbnVsbCA/IHJlZi5faWQgOiB2b2lkIDApID09PSB1c2VySWQ7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdXNlcl9jb21wYW55X2lkcyA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlcl9jb21wYW55X2lkcyA9IENyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHModXNlcklkLCBzcGFjZUlkKTtcbiAgICB9XG4gICAgcmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5jb21wYW55X2lkIDogdm9pZCAwO1xuICAgIGlmIChyZWNvcmRfY29tcGFueV9pZCAmJiBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkKSAmJiByZWNvcmRfY29tcGFueV9pZC5faWQpIHtcbiAgICAgIHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkX2NvbXBhbnlfaWQuX2lkO1xuICAgIH1cbiAgICBpZiAoIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgJiYgIWlzT3duZXIgJiYgIXBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkICYmIF8uaXNTdHJpbmcocmVjb3JkX2NvbXBhbnlfaWQpKSB7XG4gICAgICAgIGlmICh1c2VyX2NvbXBhbnlfaWRzICYmIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFfLmluY2x1ZGUodXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWQpKSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJlY29yZC5sb2NrZWQgJiYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiAhaXNPd25lciAmJiAhcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkICYmIF8uaXNTdHJpbmcocmVjb3JkX2NvbXBhbnlfaWQpKSB7XG4gICAgICAgIGlmICh1c2VyX2NvbXBhbnlfaWRzICYmIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFfLmluY2x1ZGUodXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWQpKSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBlcm1pc3Npb25zO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIF9pLCBpc09yZ2FuaXphdGlvbkFkbWluLCBpc1NwYWNlQWRtaW4sIGlzV29ya2Zsb3dBZG1pbiwgcGVybWlzc2lvbnMsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0FkbWluX3BvcywgcHNldHNDdXJyZW50LCBwc2V0c0N1cnJlbnROYW1lcywgcHNldHNDdXJyZW50X3BvcywgcHNldHNHdWVzdCwgcHNldHNHdWVzdF9wb3MsIHBzZXRzTWVtYmVyLCBwc2V0c01lbWJlcl9wb3MsIHBzZXRzT3JnYW5pemF0aW9uQWRtaW4sIHBzZXRzT3JnYW5pemF0aW9uQWRtaW5fcG9zLCBwc2V0c1VzZXIsIHBzZXRzVXNlcl9wb3MsIHBzZXRzV29ya2Zsb3dBZG1pbiwgcHNldHNXb3JrZmxvd0FkbWluX3BvcywgcmVmLCByZWYxLCBzZXRfaWRzLCBzcGFjZVVzZXI7XG4gICAgcGVybWlzc2lvbnMgPSB7XG4gICAgICBvYmplY3RzOiB7fSxcbiAgICAgIGFzc2lnbmVkX2FwcHM6IFtdXG4gICAgfTtcbiAgICBwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNNZW1iZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ21lbWJlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c0d1ZXN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdndWVzdCdcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c1dvcmtmbG93QWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3dvcmtmbG93X2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgIHVzZXJzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c09yZ2FuaXphdGlvbkFkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdvcmdhbml6YXRpb25fYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgdXNlcnM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgbmFtZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgcHNldHNBZG1pbl9wb3MgPSBudWxsO1xuICAgIHBzZXRzVXNlcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzTWVtYmVyX3BvcyA9IG51bGw7XG4gICAgcHNldHNHdWVzdF9wb3MgPSBudWxsO1xuICAgIHBzZXRzV29ya2Zsb3dBZG1pbl9wb3MgPSBudWxsO1xuICAgIHBzZXRzT3JnYW5pemF0aW9uQWRtaW5fcG9zID0gbnVsbDtcbiAgICBwc2V0c0N1cnJlbnRfcG9zID0gbnVsbDtcbiAgICBpZiAocHNldHNBZG1pbiAhPSBudWxsID8gcHNldHNBZG1pbi5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1VzZXIgIT0gbnVsbCA/IHBzZXRzVXNlci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c1VzZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNNZW1iZXIgIT0gbnVsbCA/IHBzZXRzTWVtYmVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNNZW1iZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNHdWVzdCAhPSBudWxsID8gcHNldHNHdWVzdC5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzR3Vlc3RfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1dvcmtmbG93QWRtaW4gIT0gbnVsbCA/IHBzZXRzV29ya2Zsb3dBZG1pbi5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzV29ya2Zsb3dBZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c1dvcmtmbG93QWRtaW4uX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNPcmdhbml6YXRpb25BZG1pbiAhPSBudWxsID8gcHNldHNPcmdhbml6YXRpb25BZG1pbi5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzT3JnYW5pemF0aW9uQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNPcmdhbml6YXRpb25BZG1pbi5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1cnJlbnQubGVuZ3RoID4gMCkge1xuICAgICAgc2V0X2lkcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIl9pZFwiKTtcbiAgICAgIHBzZXRzQ3VycmVudF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiB7XG4gICAgICAgICAgJGluOiBzZXRfaWRzXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBwc2V0c0N1cnJlbnROYW1lcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIm5hbWVcIik7XG4gICAgfVxuICAgIGlzU3BhY2VBZG1pbiA9IGZhbHNlO1xuICAgIHNwYWNlVXNlciA9IG51bGw7XG4gICAgaWYgKHVzZXJJZCkge1xuICAgICAgaXNTcGFjZUFkbWluID0gQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICAgIGlzV29ya2Zsb3dBZG1pbiA9IHBzZXRzV29ya2Zsb3dBZG1pbiAhPSBudWxsID8gKHJlZiA9IHBzZXRzV29ya2Zsb3dBZG1pbi51c2VycykgIT0gbnVsbCA/IHJlZi5pbmNsdWRlcyh1c2VySWQpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaXNPcmdhbml6YXRpb25BZG1pbiA9IHBzZXRzT3JnYW5pemF0aW9uQWRtaW4gIT0gbnVsbCA/IChyZWYxID0gcHNldHNPcmdhbml6YXRpb25BZG1pbi51c2VycykgIT0gbnVsbCA/IHJlZjEuaW5jbHVkZXModXNlcklkKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHBzZXRzID0ge1xuICAgICAgcHNldHNBZG1pbjogcHNldHNBZG1pbixcbiAgICAgIHBzZXRzVXNlcjogcHNldHNVc2VyLFxuICAgICAgcHNldHNDdXJyZW50OiBwc2V0c0N1cnJlbnQsXG4gICAgICBwc2V0c01lbWJlcjogcHNldHNNZW1iZXIsXG4gICAgICBwc2V0c0d1ZXN0OiBwc2V0c0d1ZXN0LFxuICAgICAgcHNldHNXb3JrZmxvd0FkbWluOiBwc2V0c1dvcmtmbG93QWRtaW4sXG4gICAgICBwc2V0c09yZ2FuaXphdGlvbkFkbWluOiBwc2V0c09yZ2FuaXphdGlvbkFkbWluLFxuICAgICAgaXNTcGFjZUFkbWluOiBpc1NwYWNlQWRtaW4sXG4gICAgICBpc1dvcmtmbG93QWRtaW46IGlzV29ya2Zsb3dBZG1pbixcbiAgICAgIGlzT3JnYW5pemF0aW9uQWRtaW46IGlzT3JnYW5pemF0aW9uQWRtaW4sXG4gICAgICBzcGFjZVVzZXI6IHNwYWNlVXNlcixcbiAgICAgIHBzZXRzQWRtaW5fcG9zOiBwc2V0c0FkbWluX3BvcyxcbiAgICAgIHBzZXRzVXNlcl9wb3M6IHBzZXRzVXNlcl9wb3MsXG4gICAgICBwc2V0c01lbWJlcl9wb3M6IHBzZXRzTWVtYmVyX3BvcyxcbiAgICAgIHBzZXRzR3Vlc3RfcG9zOiBwc2V0c0d1ZXN0X3BvcyxcbiAgICAgIHBzZXRzV29ya2Zsb3dBZG1pbl9wb3M6IHBzZXRzV29ya2Zsb3dBZG1pbl9wb3MsXG4gICAgICBwc2V0c09yZ2FuaXphdGlvbkFkbWluX3BvczogcHNldHNPcmdhbml6YXRpb25BZG1pbl9wb3MsXG4gICAgICBwc2V0c0N1cnJlbnRfcG9zOiBwc2V0c0N1cnJlbnRfcG9zXG4gICAgfTtcbiAgICBwZXJtaXNzaW9ucy5hc3NpZ25lZF9hcHBzID0gQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwZXJtaXNzaW9ucy5hc3NpZ25lZF9tZW51cyA9IENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBlcm1pc3Npb25zLnVzZXJfcGVybWlzc2lvbl9zZXRzID0gcHNldHNDdXJyZW50TmFtZXM7XG4gICAgX2kgPSAwO1xuICAgIF8uZWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKG9iamVjdCwgb2JqZWN0X25hbWUpIHtcbiAgICAgIF9pKys7XG4gICAgICBpZiAoIV8uaGFzKG9iamVjdCwgJ3NwYWNlJykgfHwgIW9iamVjdC5zcGFjZSB8fCBvYmplY3Quc3BhY2UgPT09IHNwYWNlSWQpIHtcbiAgICAgICAgcGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV0gPSBfLmNsb25lKENyZWF0b3IuY29udmVydE9iamVjdChDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdKSk7XG4gICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXVtcInBlcm1pc3Npb25zXCJdID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gIH07XG4gIHVuaW9uUGx1cyA9IGZ1bmN0aW9uKGFycmF5LCBvdGhlcikge1xuICAgIGlmICghYXJyYXkgJiYgIW90aGVyKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAoIWFycmF5KSB7XG4gICAgICBhcnJheSA9IFtdO1xuICAgIH1cbiAgICBpZiAoIW90aGVyKSB7XG4gICAgICBvdGhlciA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gXy51bmlvbihhcnJheSwgb3RoZXIpO1xuICB9O1xuICBDcmVhdG9yLmdldEFzc2lnbmVkQXBwcyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBhcHBzLCBpc1NwYWNlQWRtaW4sIHBzZXRCYXNlLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNVc2VyO1xuICAgIHBzZXRzQWRtaW4gPSB0aGlzLnBzZXRzQWRtaW4gfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gdGhpcy5wc2V0c1VzZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGFwcHMgPSBbXTtcbiAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHBzZXRCYXNlID0gcHNldHNVc2VyO1xuICAgICAgaWYgKHBzZXRCYXNlICE9IG51bGwgPyBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzIDogdm9pZCAwKSB7XG4gICAgICAgIGFwcHMgPSBfLnVuaW9uKGFwcHMsIHBzZXRCYXNlLmFzc2lnbmVkX2FwcHMpO1xuICAgICAgfVxuICAgICAgXy5lYWNoKHBzZXRzLCBmdW5jdGlvbihwc2V0KSB7XG4gICAgICAgIGlmICghcHNldC5hc3NpZ25lZF9hcHBzKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwc2V0Lm5hbWUgPT09IFwiYWRtaW5cIiB8fCBwc2V0Lm5hbWUgPT09IFwidXNlclwiKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcHBzID0gXy51bmlvbihhcHBzLCBwc2V0LmFzc2lnbmVkX2FwcHMpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy53aXRob3V0KF8udW5pcShhcHBzKSwgdm9pZCAwLCBudWxsKTtcbiAgICB9XG4gIH07XG4gIENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBhYm91dE1lbnUsIGFkbWluTWVudXMsIGFsbE1lbnVzLCBjdXJyZW50UHNldE5hbWVzLCBpc1NwYWNlQWRtaW4sIG1lbnVzLCBvdGhlck1lbnVBcHBzLCBvdGhlck1lbnVzLCBwc2V0cywgcmVmO1xuICAgIHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICB1c2VyczogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBuYW1lOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgYWRtaW5NZW51cyA9IChyZWYgPSBDcmVhdG9yLkFwcHMuYWRtaW4pICE9IG51bGwgPyByZWYuYWRtaW5fbWVudXMgOiB2b2lkIDA7XG4gICAgaWYgKCFhZG1pbk1lbnVzKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGFib3V0TWVudSA9IGFkbWluTWVudXMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5faWQgPT09ICdhYm91dCc7XG4gICAgfSk7XG4gICAgYWRtaW5NZW51cyA9IGFkbWluTWVudXMuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLl9pZCAhPT0gJ2Fib3V0JztcbiAgICB9KTtcbiAgICBvdGhlck1lbnVBcHBzID0gXy5zb3J0QnkoXy5maWx0ZXIoXy52YWx1ZXMoQ3JlYXRvci5BcHBzKSwgZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uYWRtaW5fbWVudXMgJiYgbi5faWQgIT09ICdhZG1pbic7XG4gICAgfSksICdzb3J0Jyk7XG4gICAgb3RoZXJNZW51cyA9IF8uZmxhdHRlbihfLnBsdWNrKG90aGVyTWVudUFwcHMsIFwiYWRtaW5fbWVudXNcIikpO1xuICAgIGFsbE1lbnVzID0gXy51bmlvbihhZG1pbk1lbnVzLCBvdGhlck1lbnVzLCBbYWJvdXRNZW51XSk7XG4gICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgcmV0dXJuIGFsbE1lbnVzO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50UHNldE5hbWVzID0gcHNldHMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4ubmFtZTtcbiAgICAgIH0pO1xuICAgICAgbWVudXMgPSBhbGxNZW51cy5maWx0ZXIoZnVuY3Rpb24obWVudSkge1xuICAgICAgICB2YXIgcHNldHNNZW51O1xuICAgICAgICBwc2V0c01lbnUgPSBtZW51LnBlcm1pc3Npb25fc2V0cztcbiAgICAgICAgaWYgKHBzZXRzTWVudSAmJiBwc2V0c01lbnUuaW5kZXhPZihcInVzZXJcIikgPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfLmludGVyc2VjdGlvbihjdXJyZW50UHNldE5hbWVzLCBwc2V0c01lbnUpLmxlbmd0aDtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG1lbnVzO1xuICAgIH1cbiAgfTtcbiAgZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCA9IGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkKSB7XG4gICAgaWYgKF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBfLmZpbmQocGVybWlzc2lvbl9vYmplY3RzLCBmdW5jdGlvbihwbykge1xuICAgICAgICByZXR1cm4gcG8ub2JqZWN0X25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICBwZXJtaXNzaW9uX3NldF9pZDogcGVybWlzc2lvbl9zZXRfaWRcbiAgICB9KTtcbiAgfTtcbiAgZmluZF9wZXJtaXNzaW9uX29iamVjdCA9IGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkcykge1xuICAgIGlmIChfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gXy5maWx0ZXIocGVybWlzc2lvbl9vYmplY3RzLCBmdW5jdGlvbihwbykge1xuICAgICAgICByZXR1cm4gcG8ub2JqZWN0X25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICBwZXJtaXNzaW9uX3NldF9pZDoge1xuICAgICAgICAkaW46IHBlcm1pc3Npb25fc2V0X2lkc1xuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gIH07XG4gIENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIGlzT3JnYW5pemF0aW9uQWRtaW4sIGlzU3BhY2VBZG1pbiwgaXNXb3JrZmxvd0FkbWluLCBvYmplY3QsIG9wc2V0QWRtaW4sIG9wc2V0R3Vlc3QsIG9wc2V0TWVtYmVyLCBvcHNldE9yZ2FuaXphdGlvbkFkbWluLCBvcHNldFVzZXIsIG9wc2V0V29ya2Zsb3dBZG1pbiwgcGVybWlzc2lvbnMsIHBvcywgcG9zQWRtaW4sIHBvc0d1ZXN0LCBwb3NNZW1iZXIsIHBvc09yZ2FuaXphdGlvbkFkbWluLCBwb3NVc2VyLCBwb3NXb3JrZmxvd0FkbWluLCBwcm9mLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNBZG1pbl9wb3MsIHBzZXRzQ3VycmVudF9wb3MsIHBzZXRzR3Vlc3QsIHBzZXRzR3Vlc3RfcG9zLCBwc2V0c01lbWJlciwgcHNldHNNZW1iZXJfcG9zLCBwc2V0c09yZ2FuaXphdGlvbkFkbWluLCBwc2V0c09yZ2FuaXphdGlvbkFkbWluX3BvcywgcHNldHNVc2VyLCBwc2V0c1VzZXJfcG9zLCBwc2V0c1dvcmtmbG93QWRtaW4sIHBzZXRzV29ya2Zsb3dBZG1pbl9wb3MsIHJlZiwgcmVmMSwgc2V0X2lkcywgc3BhY2VVc2VyO1xuICAgIHBlcm1pc3Npb25zID0ge307XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpO1xuICAgIGlmIChzcGFjZUlkID09PSAnZ3Vlc3QnIHx8IG9iamVjdF9uYW1lID09PSBcInVzZXJzXCIpIHtcbiAgICAgIHBlcm1pc3Npb25zID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9O1xuICAgICAgQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMocGVybWlzc2lvbnMpO1xuICAgICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICAgIH1cbiAgICBwc2V0c0FkbWluID0gXy5pc051bGwodGhpcy5wc2V0c0FkbWluKSB8fCB0aGlzLnBzZXRzQWRtaW4gPyB0aGlzLnBzZXRzQWRtaW4gOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1VzZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzVXNlcikgfHwgdGhpcy5wc2V0c1VzZXIgPyB0aGlzLnBzZXRzVXNlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNNZW1iZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzTWVtYmVyKSB8fCB0aGlzLnBzZXRzTWVtYmVyID8gdGhpcy5wc2V0c01lbWJlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnbWVtYmVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0d1ZXN0ID0gXy5pc051bGwodGhpcy5wc2V0c0d1ZXN0KSB8fCB0aGlzLnBzZXRzR3Vlc3QgPyB0aGlzLnBzZXRzR3Vlc3QgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2d1ZXN0J1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1dvcmtmbG93QWRtaW4gPSBfLmlzTnVsbCh0aGlzLnBzZXRzV29ya2Zsb3dBZG1pbikgfHwgdGhpcy5wc2V0c1dvcmtmbG93QWRtaW4gPyB0aGlzLnBzZXRzV29ya2Zsb3dBZG1pbiA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnd29ya2Zsb3dfYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgdXNlcnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c09yZ2FuaXphdGlvbkFkbWluID0gXy5pc051bGwodGhpcy5wc2V0c09yZ2FuaXphdGlvbkFkbWluKSB8fCB0aGlzLnBzZXRzT3JnYW5pemF0aW9uQWRtaW4gPyB0aGlzLnBzZXRzT3JnYW5pemF0aW9uQWRtaW4gOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ29yZ2FuaXphdGlvbl9hZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICB1c2VyczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICB1c2VyczogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgaXNXb3JrZmxvd0FkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1dvcmtmbG93QWRtaW4pID8gdGhpcy5pc1dvcmtmbG93QWRtaW4gOiBwc2V0c1dvcmtmbG93QWRtaW4gIT0gbnVsbCA/IChyZWYgPSBwc2V0c1dvcmtmbG93QWRtaW4udXNlcnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXModXNlcklkKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICBpc09yZ2FuaXphdGlvbkFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc09yZ2FuaXphdGlvbkFkbWluKSA/IHRoaXMuaXNPcmdhbml6YXRpb25BZG1pbiA6IHBzZXRzT3JnYW5pemF0aW9uQWRtaW4gIT0gbnVsbCA/IChyZWYxID0gcHNldHNPcmdhbml6YXRpb25BZG1pbi51c2VycykgIT0gbnVsbCA/IHJlZjEuaW5jbHVkZXModXNlcklkKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICBwc2V0c0FkbWluX3BvcyA9IHRoaXMucHNldHNBZG1pbl9wb3M7XG4gICAgcHNldHNVc2VyX3BvcyA9IHRoaXMucHNldHNVc2VyX3BvcztcbiAgICBwc2V0c01lbWJlcl9wb3MgPSB0aGlzLnBzZXRzTWVtYmVyX3BvcztcbiAgICBwc2V0c0d1ZXN0X3BvcyA9IHRoaXMucHNldHNHdWVzdF9wb3M7XG4gICAgcHNldHNXb3JrZmxvd0FkbWluX3BvcyA9IHRoaXMucHNldHNXb3JrZmxvd0FkbWluX3BvcztcbiAgICBwc2V0c09yZ2FuaXphdGlvbkFkbWluX3BvcyA9IHRoaXMucHNldHNPcmdhbml6YXRpb25BZG1pbl9wb3M7XG4gICAgcHNldHNDdXJyZW50X3BvcyA9IHRoaXMucHNldHNDdXJyZW50X3BvcztcbiAgICBvcHNldEFkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuYWRtaW4pIHx8IHt9O1xuICAgIG9wc2V0VXNlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnVzZXIpIHx8IHt9O1xuICAgIG9wc2V0TWVtYmVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQubWVtYmVyKSB8fCB7fTtcbiAgICBvcHNldEd1ZXN0ID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9O1xuICAgIG9wc2V0V29ya2Zsb3dBZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LndvcmtmbG93X2FkbWluKSB8fCB7fTtcbiAgICBvcHNldE9yZ2FuaXphdGlvbkFkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQub3JnYW5pemF0aW9uX2FkbWluKSB8fCB7fTtcbiAgICBpZiAocHNldHNBZG1pbikge1xuICAgICAgcG9zQWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNBZG1pbi5faWQpO1xuICAgICAgaWYgKHBvc0FkbWluKSB7XG4gICAgICAgIG9wc2V0QWRtaW4uYWxsb3dDcmVhdGUgPSBwb3NBZG1pbi5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRBZG1pbi5hbGxvd0RlbGV0ZSA9IHBvc0FkbWluLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldEFkbWluLmFsbG93RWRpdCA9IHBvc0FkbWluLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRBZG1pbi5hbGxvd1JlYWQgPSBwb3NBZG1pbi5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0QWRtaW4ubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0FkbWluLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0QWRtaW4udmlld0FsbFJlY29yZHMgPSBwb3NBZG1pbi52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRBZG1pbi5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0FkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEFkbWluLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0FkbWluLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zQWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRBZG1pbi5kaXNhYmxlZF9hY3Rpb25zID0gcG9zQWRtaW4uZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRBZG1pbi51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0FkbWluLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEFkbWluLnVuZWRpdGFibGVfZmllbGRzID0gcG9zQWRtaW4udW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0QWRtaW4udW5yZWxhdGVkX29iamVjdHMgPSBwb3NBZG1pbi51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzVXNlcikge1xuICAgICAgcG9zVXNlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNVc2VyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzVXNlci5faWQpO1xuICAgICAgaWYgKHBvc1VzZXIpIHtcbiAgICAgICAgb3BzZXRVc2VyLmFsbG93Q3JlYXRlID0gcG9zVXNlci5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRVc2VyLmFsbG93RGVsZXRlID0gcG9zVXNlci5hbGxvd0RlbGV0ZTtcbiAgICAgICAgb3BzZXRVc2VyLmFsbG93RWRpdCA9IHBvc1VzZXIuYWxsb3dFZGl0O1xuICAgICAgICBvcHNldFVzZXIuYWxsb3dSZWFkID0gcG9zVXNlci5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0VXNlci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zVXNlci5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldFVzZXIudmlld0FsbFJlY29yZHMgPSBwb3NVc2VyLnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldFVzZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NVc2VyLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldFVzZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zVXNlci52aWV3Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0VXNlci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zVXNlci5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldFVzZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc1VzZXIuZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRVc2VyLnVucmVhZGFibGVfZmllbGRzID0gcG9zVXNlci51bnJlYWRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRVc2VyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zVXNlci51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRVc2VyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zVXNlci51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzTWVtYmVyKSB7XG4gICAgICBwb3NNZW1iZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzTWVtYmVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzTWVtYmVyLl9pZCk7XG4gICAgICBpZiAocG9zTWVtYmVyKSB7XG4gICAgICAgIG9wc2V0TWVtYmVyLmFsbG93Q3JlYXRlID0gcG9zTWVtYmVyLmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldE1lbWJlci5hbGxvd0RlbGV0ZSA9IHBvc01lbWJlci5hbGxvd0RlbGV0ZTtcbiAgICAgICAgb3BzZXRNZW1iZXIuYWxsb3dFZGl0ID0gcG9zTWVtYmVyLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRNZW1iZXIuYWxsb3dSZWFkID0gcG9zTWVtYmVyLmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRNZW1iZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc01lbWJlci5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldE1lbWJlci52aWV3QWxsUmVjb3JkcyA9IHBvc01lbWJlci52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRNZW1iZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NNZW1iZXIubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc01lbWJlci52aWV3Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NNZW1iZXIuZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRNZW1iZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc01lbWJlci5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldE1lbWJlci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc01lbWJlci51bnJlYWRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRNZW1iZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NNZW1iZXIudW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zTWVtYmVyLnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNHdWVzdCkge1xuICAgICAgcG9zR3Vlc3QgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzR3Vlc3RfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNHdWVzdC5faWQpO1xuICAgICAgaWYgKHBvc0d1ZXN0KSB7XG4gICAgICAgIG9wc2V0R3Vlc3QuYWxsb3dDcmVhdGUgPSBwb3NHdWVzdC5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRHdWVzdC5hbGxvd0RlbGV0ZSA9IHBvc0d1ZXN0LmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldEd1ZXN0LmFsbG93RWRpdCA9IHBvc0d1ZXN0LmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRHdWVzdC5hbGxvd1JlYWQgPSBwb3NHdWVzdC5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0R3Vlc3QubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0d1ZXN0Lm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0R3Vlc3Qudmlld0FsbFJlY29yZHMgPSBwb3NHdWVzdC52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRHdWVzdC5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0d1ZXN0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEd1ZXN0LnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0d1ZXN0LnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRHdWVzdC5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zR3Vlc3QuZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRHdWVzdC5kaXNhYmxlZF9hY3Rpb25zID0gcG9zR3Vlc3QuZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRHdWVzdC51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0d1ZXN0LnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEd1ZXN0LnVuZWRpdGFibGVfZmllbGRzID0gcG9zR3Vlc3QudW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0R3Vlc3QudW5yZWxhdGVkX29iamVjdHMgPSBwb3NHdWVzdC51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzV29ya2Zsb3dBZG1pbikge1xuICAgICAgcG9zV29ya2Zsb3dBZG1pbiA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNXb3JrZmxvd0FkbWluX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzV29ya2Zsb3dBZG1pbi5faWQpO1xuICAgICAgaWYgKHBvc1dvcmtmbG93QWRtaW4pIHtcbiAgICAgICAgb3BzZXRXb3JrZmxvd0FkbWluLmFsbG93Q3JlYXRlID0gcG9zV29ya2Zsb3dBZG1pbi5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRXb3JrZmxvd0FkbWluLmFsbG93RGVsZXRlID0gcG9zV29ya2Zsb3dBZG1pbi5hbGxvd0RlbGV0ZTtcbiAgICAgICAgb3BzZXRXb3JrZmxvd0FkbWluLmFsbG93RWRpdCA9IHBvc1dvcmtmbG93QWRtaW4uYWxsb3dFZGl0O1xuICAgICAgICBvcHNldFdvcmtmbG93QWRtaW4uYWxsb3dSZWFkID0gcG9zV29ya2Zsb3dBZG1pbi5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0V29ya2Zsb3dBZG1pbi5tb2RpZnlBbGxSZWNvcmRzID0gcG9zV29ya2Zsb3dBZG1pbi5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldFdvcmtmbG93QWRtaW4udmlld0FsbFJlY29yZHMgPSBwb3NXb3JrZmxvd0FkbWluLnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldFdvcmtmbG93QWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NXb3JrZmxvd0FkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldFdvcmtmbG93QWRtaW4udmlld0NvbXBhbnlSZWNvcmRzID0gcG9zV29ya2Zsb3dBZG1pbi52aWV3Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0V29ya2Zsb3dBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zV29ya2Zsb3dBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldFdvcmtmbG93QWRtaW4uZGlzYWJsZWRfYWN0aW9ucyA9IHBvc1dvcmtmbG93QWRtaW4uZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRXb3JrZmxvd0FkbWluLnVucmVhZGFibGVfZmllbGRzID0gcG9zV29ya2Zsb3dBZG1pbi51bnJlYWRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRXb3JrZmxvd0FkbWluLnVuZWRpdGFibGVfZmllbGRzID0gcG9zV29ya2Zsb3dBZG1pbi51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRXb3JrZmxvd0FkbWluLnVucmVsYXRlZF9vYmplY3RzID0gcG9zV29ya2Zsb3dBZG1pbi51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzT3JnYW5pemF0aW9uQWRtaW4pIHtcbiAgICAgIHBvc09yZ2FuaXphdGlvbkFkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c09yZ2FuaXphdGlvbkFkbWluX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzT3JnYW5pemF0aW9uQWRtaW4uX2lkKTtcbiAgICAgIGlmIChwb3NPcmdhbml6YXRpb25BZG1pbikge1xuICAgICAgICBvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93Q3JlYXRlID0gcG9zT3JnYW5pemF0aW9uQWRtaW4uYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uYWxsb3dEZWxldGUgPSBwb3NPcmdhbml6YXRpb25BZG1pbi5hbGxvd0RlbGV0ZTtcbiAgICAgICAgb3BzZXRPcmdhbml6YXRpb25BZG1pbi5hbGxvd0VkaXQgPSBwb3NPcmdhbml6YXRpb25BZG1pbi5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uYWxsb3dSZWFkID0gcG9zT3JnYW5pemF0aW9uQWRtaW4uYWxsb3dSZWFkO1xuICAgICAgICBvcHNldE9yZ2FuaXphdGlvbkFkbWluLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NPcmdhbml6YXRpb25BZG1pbi5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldE9yZ2FuaXphdGlvbkFkbWluLnZpZXdBbGxSZWNvcmRzID0gcG9zT3JnYW5pemF0aW9uQWRtaW4udmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NPcmdhbml6YXRpb25BZG1pbi5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRPcmdhbml6YXRpb25BZG1pbi52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NPcmdhbml6YXRpb25BZG1pbi52aWV3Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc09yZ2FuaXphdGlvbkFkbWluLmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uZGlzYWJsZWRfYWN0aW9ucyA9IHBvc09yZ2FuaXphdGlvbkFkbWluLmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4udW5yZWFkYWJsZV9maWVsZHMgPSBwb3NPcmdhbml6YXRpb25BZG1pbi51bnJlYWRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRPcmdhbml6YXRpb25BZG1pbi51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc09yZ2FuaXphdGlvbkFkbWluLnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldE9yZ2FuaXphdGlvbkFkbWluLnVucmVsYXRlZF9vYmplY3RzID0gcG9zT3JnYW5pemF0aW9uQWRtaW4udW5yZWxhdGVkX29iamVjdHM7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW47XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEFkbWluO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHNwYWNlSWQgPT09ICdjb21tb24nKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BhY2VVc2VyID0gXy5pc051bGwodGhpcy5zcGFjZVVzZXIpIHx8IHRoaXMuc3BhY2VVc2VyID8gdGhpcy5zcGFjZVVzZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoc3BhY2VVc2VyKSB7XG4gICAgICAgICAgICBwcm9mID0gc3BhY2VVc2VyLnByb2ZpbGU7XG4gICAgICAgICAgICBpZiAocHJvZikge1xuICAgICAgICAgICAgICBpZiAocHJvZiA9PT0gJ3VzZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ21lbWJlcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0TWVtYmVyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdndWVzdCcpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Q7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Q7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICBzZXRfaWRzID0gXy5wbHVjayhwc2V0cywgXCJfaWRcIik7XG4gICAgICBwb3MgPSBmaW5kX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VycmVudF9wb3MsIG9iamVjdF9uYW1lLCBzZXRfaWRzKTtcbiAgICAgIF8uZWFjaChwb3MsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIGlmIChwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzQWRtaW4gIT0gbnVsbCA/IHBzZXRzQWRtaW4uX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzVXNlciAhPSBudWxsID8gcHNldHNVc2VyLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c01lbWJlciAhPSBudWxsID8gcHNldHNNZW1iZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzR3Vlc3QgIT0gbnVsbCA/IHBzZXRzR3Vlc3QuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzV29ya2Zsb3dBZG1pbiAhPSBudWxsID8gcHNldHNXb3JrZmxvd0FkbWluLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c09yZ2FuaXphdGlvbkFkbWluICE9IG51bGwgPyBwc2V0c09yZ2FuaXphdGlvbkFkbWluLl9pZCA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLmFsbG93UmVhZCkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLmFsbG93Q3JlYXRlKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5hbGxvd0VkaXQpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5hbGxvd0RlbGV0ZSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8ubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby52aWV3QWxsUmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8ubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzLCBwby5kaXNhYmxlZF9saXN0X3ZpZXdzKTtcbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zLCBwby5kaXNhYmxlZF9hY3Rpb25zKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIHBvLnVucmVhZGFibGVfZmllbGRzKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIHBvLnVuZWRpdGFibGVfZmllbGRzKTtcbiAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBwby51bnJlbGF0ZWRfb2JqZWN0cyk7XG4gICAgICB9KTtcbiAgICAgIGlmIChpc1dvcmtmbG93QWRtaW4pIHtcbiAgICAgICAgaWYgKG9wc2V0V29ya2Zsb3dBZG1pbi5hbGxvd1JlYWQpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHNldFdvcmtmbG93QWRtaW4uYWxsb3dDcmVhdGUpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wc2V0V29ya2Zsb3dBZG1pbi5hbGxvd0VkaXQpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHNldFdvcmtmbG93QWRtaW4uYWxsb3dEZWxldGUpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wc2V0V29ya2Zsb3dBZG1pbi5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wc2V0V29ya2Zsb3dBZG1pbi52aWV3QWxsUmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3BzZXRXb3JrZmxvd0FkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHNldFdvcmtmbG93QWRtaW4udmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIG9wc2V0V29ya2Zsb3dBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzKTtcbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zLCBvcHNldFdvcmtmbG93QWRtaW4uZGlzYWJsZWRfYWN0aW9ucyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBvcHNldFdvcmtmbG93QWRtaW4udW5yZWFkYWJsZV9maWVsZHMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgb3BzZXRXb3JrZmxvd0FkbWluLnVuZWRpdGFibGVfZmllbGRzKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMsIG9wc2V0V29ya2Zsb3dBZG1pbi51bnJlbGF0ZWRfb2JqZWN0cyk7XG4gICAgICB9XG4gICAgICBpZiAoaXNPcmdhbml6YXRpb25BZG1pbikge1xuICAgICAgICBpZiAob3BzZXRPcmdhbml6YXRpb25BZG1pbi5hbGxvd1JlYWQpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93Q3JlYXRlKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93RWRpdCkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uYWxsb3dEZWxldGUpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wc2V0T3JnYW5pemF0aW9uQWRtaW4ubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHNldE9yZ2FuaXphdGlvbkFkbWluLnZpZXdBbGxSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHNldE9yZ2FuaXphdGlvbkFkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHNldE9yZ2FuaXphdGlvbkFkbWluLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzLCBvcHNldE9yZ2FuaXphdGlvbkFkbWluLmRpc2FibGVkX2xpc3Rfdmlld3MpO1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMsIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uZGlzYWJsZWRfYWN0aW9ucyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBvcHNldE9yZ2FuaXphdGlvbkFkbWluLnVucmVhZGFibGVfZmllbGRzKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4udW5lZGl0YWJsZV9maWVsZHMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cywgb3BzZXRPcmdhbml6YXRpb25BZG1pbi51bnJlbGF0ZWRfb2JqZWN0cyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvYmplY3QuaXNfdmlldykge1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gW107XG4gICAgfVxuICAgIENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zKHBlcm1pc3Npb25zKTtcbiAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gIH07XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICBcImNyZWF0b3Iub2JqZWN0X3Blcm1pc3Npb25zXCI6IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHRoaXMudXNlcklkKTtcbiAgICB9XG4gIH0pO1xufVxuIiwiTWV0ZW9yLnN0YXJ0dXAgKCktPlxyXG5cdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0Y3JlYXRvcl9kYl91cmwgPSBwcm9jZXNzLmVudi5NT05HT19VUkxfQ1JFQVRPUlxyXG5cdFx0b3Bsb2dfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BMT0dfVVJMX0NSRUFUT1JcclxuXHRcdGlmIGNyZWF0b3JfZGJfdXJsXHJcblx0XHRcdGlmICFvcGxvZ191cmxcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJQbGVhc2UgY29uZmlndXJlIGVudmlyb25tZW50IHZhcmlhYmxlczogTU9OR09fT1BMT0dfVVJMX0NSRUFUT1JcIilcclxuXHRcdFx0Q3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFID0ge19kcml2ZXI6IG5ldyBNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyKGNyZWF0b3JfZGJfdXJsLCB7b3Bsb2dVcmw6IG9wbG9nX3VybH0pfVxyXG5cclxuQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uID0gKG9iamVjdCktPlxyXG5cdGNvbGxlY3Rpb25fa2V5ID0gb2JqZWN0Lm5hbWVcclxuXHRpZiBvYmplY3Quc3BhY2UgI29iamVjdC5jdXN0b20gJiZcclxuXHRcdGNvbGxlY3Rpb25fa2V5ID0gXCJjX1wiICsgb2JqZWN0LnNwYWNlICsgXCJfXCIgKyBvYmplY3QubmFtZVxyXG5cclxuXHRpZiBkYltjb2xsZWN0aW9uX2tleV1cclxuXHRcdHJldHVybiBkYltjb2xsZWN0aW9uX2tleV1cclxuXHRlbHNlIGlmIG9iamVjdC5kYlxyXG5cdFx0cmV0dXJuIG9iamVjdC5kYlxyXG5cclxuXHRpZiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldXHJcblx0ZWxzZVxyXG5cdFx0aWYgb2JqZWN0LmN1c3RvbVxyXG5cdFx0XHRyZXR1cm4gbmV3IE1ldGVvci5Db2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5LCBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UpXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBuZXcgTWV0ZW9yLkNvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXkpXHJcblxyXG5cclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBjcmVhdG9yX2RiX3VybCwgb3Bsb2dfdXJsO1xuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgY3JlYXRvcl9kYl91cmwgPSBwcm9jZXNzLmVudi5NT05HT19VUkxfQ1JFQVRPUjtcbiAgICBvcGxvZ191cmwgPSBwcm9jZXNzLmVudi5NT05HT19PUExPR19VUkxfQ1JFQVRPUjtcbiAgICBpZiAoY3JlYXRvcl9kYl91cmwpIHtcbiAgICAgIGlmICghb3Bsb2dfdXJsKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIlBsZWFzZSBjb25maWd1cmUgZW52aXJvbm1lbnQgdmFyaWFibGVzOiBNT05HT19PUExPR19VUkxfQ1JFQVRPUlwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UgPSB7XG4gICAgICAgIF9kcml2ZXI6IG5ldyBNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyKGNyZWF0b3JfZGJfdXJsLCB7XG4gICAgICAgICAgb3Bsb2dVcmw6IG9wbG9nX3VybFxuICAgICAgICB9KVxuICAgICAgfTtcbiAgICB9XG4gIH1cbn0pO1xuXG5DcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIGNvbGxlY3Rpb25fa2V5O1xuICBjb2xsZWN0aW9uX2tleSA9IG9iamVjdC5uYW1lO1xuICBpZiAob2JqZWN0LnNwYWNlKSB7XG4gICAgY29sbGVjdGlvbl9rZXkgPSBcImNfXCIgKyBvYmplY3Quc3BhY2UgKyBcIl9cIiArIG9iamVjdC5uYW1lO1xuICB9XG4gIGlmIChkYltjb2xsZWN0aW9uX2tleV0pIHtcbiAgICByZXR1cm4gZGJbY29sbGVjdGlvbl9rZXldO1xuICB9IGVsc2UgaWYgKG9iamVjdC5kYikge1xuICAgIHJldHVybiBvYmplY3QuZGI7XG4gIH1cbiAgaWYgKENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3QuY3VzdG9tKSB7XG4gICAgICByZXR1cm4gbmV3IE1ldGVvci5Db2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5LCBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IE1ldGVvci5Db2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5KTtcbiAgICB9XG4gIH1cbn07XG4iLCJDcmVhdG9yLmFjdGlvbnNCeU5hbWUgPSB7fVxyXG5cclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcblxyXG5cdCMg5a6a5LmJ5YWo5bGAIGFjdGlvbnMg5Ye95pWwXHRcclxuXHRDcmVhdG9yLmFjdGlvbnMgPSAoYWN0aW9ucyktPlxyXG5cdFx0Xy5lYWNoIGFjdGlvbnMsICh0b2RvLCBhY3Rpb25fbmFtZSktPlxyXG5cdFx0XHRDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uX25hbWVdID0gdG9kbyBcclxuXHJcblx0Q3JlYXRvci5leGVjdXRlQWN0aW9uID0gKG9iamVjdF9uYW1lLCBhY3Rpb24sIHJlY29yZF9pZCwgaXRlbV9lbGVtZW50LCBsaXN0X3ZpZXdfaWQsIHJlY29yZCktPlxyXG5cdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0XHRpZiBhY3Rpb24/LnRvZG9cclxuXHRcdFx0aWYgdHlwZW9mIGFjdGlvbi50b2RvID09IFwic3RyaW5nXCJcclxuXHRcdFx0XHR0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXVxyXG5cdFx0XHRlbHNlIGlmIHR5cGVvZiBhY3Rpb24udG9kbyA9PSBcImZ1bmN0aW9uXCJcclxuXHRcdFx0XHR0b2RvID0gYWN0aW9uLnRvZG9cdFxyXG5cdFx0XHRpZiAhcmVjb3JkICYmIG9iamVjdF9uYW1lICYmIHJlY29yZF9pZFxyXG5cdFx0XHRcdHJlY29yZCA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXHJcblx0XHRcdGlmIHRvZG9cclxuXHRcdFx0XHQjIGl0ZW1fZWxlbWVudOS4uuepuuaXtuW6lOivpeiuvue9rum7mOiupOWAvO+8iOWvueixoeeahG5hbWXlrZfmrrXvvInvvIzlkKbliJltb3JlQXJnc+aLv+WIsOeahOWQjue7reWPguaVsOS9jee9ruWwseS4jeWvuVxyXG5cdFx0XHRcdGl0ZW1fZWxlbWVudCA9IGlmIGl0ZW1fZWxlbWVudCB0aGVuIGl0ZW1fZWxlbWVudCBlbHNlIFwiXCJcclxuXHRcdFx0XHRtb3JlQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMylcclxuXHRcdFx0XHR0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpXHJcblx0XHRcdFx0dG9kby5hcHBseSB7XHJcblx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcclxuXHRcdFx0XHRcdHJlY29yZF9pZDogcmVjb3JkX2lkXHJcblx0XHRcdFx0XHRvYmplY3Q6IG9ialxyXG5cdFx0XHRcdFx0YWN0aW9uOiBhY3Rpb25cclxuXHRcdFx0XHRcdGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50XHJcblx0XHRcdFx0XHRyZWNvcmQ6IHJlY29yZFxyXG5cdFx0XHRcdH0sIHRvZG9BcmdzXHJcblx0XHRcdFx0XHJcblxyXG5cdENyZWF0b3IuYWN0aW9ucyBcclxuXHRcdCMg5Zyo5q2k5a6a5LmJ5YWo5bGAIGFjdGlvbnNcclxuXHRcdFwic3RhbmRhcmRfcXVlcnlcIjogKCktPlxyXG5cdFx0XHRNb2RhbC5zaG93KFwic3RhbmRhcmRfcXVlcnlfbW9kYWxcIilcclxuXHJcblx0XHRcInN0YW5kYXJkX25ld1wiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XHJcblx0XHRcdGlkcyA9IENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzW29iamVjdF9uYW1lXVxyXG5cdFx0XHRpZiBpZHM/Lmxlbmd0aFxyXG5cdFx0XHRcdCMg5YiX6KGo5pyJ6YCJ5Lit6aG55pe277yM5Y+W56ys5LiA5Liq6YCJ5Lit6aG577yM5aSN5Yi25YW25YaF5a655Yiw5paw5bu656qX5Y+j5LitXHJcblx0XHRcdFx0IyDov5nnmoTnrKzkuIDkuKrmjIfnmoTmmK/nrKzkuIDmrKHli77pgInnmoTpgInkuK3pobnvvIzogIzkuI3mmK/liJfooajkuK3lt7Lli77pgInnmoTnrKzkuIDpoblcclxuXHRcdFx0XHRyZWNvcmRfaWQgPSBpZHNbMF1cclxuXHRcdFx0XHRkb2MgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxyXG5cdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIGRvY1xyXG5cdFx0XHRcdCMg4oCc5L+d5a2Y5bm25paw5bu64oCd5pON5L2c5Lit6Ieq5Yqo5omT5byA55qE5paw56qX5Y+j5Lit6ZyA6KaB5YaN5qyh5aSN5Yi25pyA5paw55qEZG9j5YaF5a655Yiw5paw56qX5Y+j5LitXHJcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWVcclxuXHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cclxuXHRcdFx0XHQkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKClcclxuXHRcdFx0cmV0dXJuIFxyXG5cdFx0XHRcclxuXHRcdFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cclxuXHRcdFx0aHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXHJcblx0XHRcdHdpbmRvdy5vcGVuKFxyXG5cdFx0XHRcdGhyZWYsXHJcblx0XHRcdFx0J19ibGFuaycsXHJcblx0XHRcdFx0J3dpZHRoPTgwMCwgaGVpZ2h0PTYwMCwgbGVmdD01MCwgdG9wPSA1MCwgdG9vbGJhcj1ubywgc3RhdHVzPW5vLCBtZW51YmFyPW5vLCByZXNpemFibGU9eWVzLCBzY3JvbGxiYXJzPXllcydcclxuXHRcdFx0KVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0XHRcInN0YW5kYXJkX29wZW5fdmlld1wiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XHJcblx0XHRcdGhyZWYgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxyXG5cdFx0XHR3aW5kb3cub3BlbihcclxuXHRcdFx0XHRocmVmLFxyXG5cdFx0XHRcdCdfYmxhbmsnLFxyXG5cdFx0XHRcdCd3aWR0aD04MDAsIGhlaWdodD02MDAsIGxlZnQ9NTAsIHRvcD0gNTAsIHRvb2xiYXI9bm8sIHN0YXR1cz1ubywgbWVudWJhcj1ubywgcmVzaXphYmxlPXllcywgc2Nyb2xsYmFycz15ZXMnXHJcblx0XHRcdClcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdFx0XCJzdGFuZGFyZF9lZGl0XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cclxuXHRcdFx0aWYgcmVjb3JkX2lkXHJcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpICYmIGZhbHNlXHJcbiNcdFx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcclxuI1x0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCByZWNvcmRcclxuI1x0XHRcdFx0XHRTZXNzaW9uLnNldCAncmVsb2FkX2R4bGlzdCcsIGZhbHNlXHJcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcclxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkXHJcblx0XHRcdFx0XHRpZiB0aGlzLnJlY29yZFxyXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxyXG5cdFx0XHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cclxuXHRcdFx0XHRcdFx0JChcIi5idG4tZWRpdC1yZWNvcmRcIikuY2xpY2soKVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZVxyXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWRcclxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXHJcblx0XHRcdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIHRoaXMucmVjb3JkXHJcblx0XHRcdFx0XHRcdE1ldGVvci5kZWZlciAoKS0+XHJcblx0XHRcdFx0XHRcdFx0JChcIi5idG4uY3JlYXRvci1lZGl0XCIpLmNsaWNrKClcclxuXHJcblx0XHRcInN0YW5kYXJkX2RlbGV0ZVwiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIGNhbGxfYmFjayktPlxyXG5cdFx0XHRjb25zb2xlLmxvZyhcInN0YW5kYXJkX2RlbGV0ZVwiLCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZClcclxuXHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblxyXG5cdFx0XHRpZighXy5pc1N0cmluZyhyZWNvcmRfdGl0bGUpICYmIHJlY29yZF90aXRsZT8ubmFtZSlcclxuXHRcdFx0XHRyZWNvcmRfdGl0bGUgPSByZWNvcmRfdGl0bGU/Lm5hbWVcclxuXHJcblx0XHRcdGlmIHJlY29yZF90aXRsZVxyXG5cdFx0XHRcdHRleHQgPSBcIuaYr+WQpuehruWumuimgeWIoOmZpOatpCN7b2JqZWN0LmxhYmVsfVxcXCIje3JlY29yZF90aXRsZX1cXFwiXCJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHRleHQgPSBcIuaYr+WQpuehruWumuimgeWIoOmZpOatpCN7b2JqZWN0LmxhYmVsfVwiXHJcblx0XHRcdHN3YWxcclxuXHRcdFx0XHR0aXRsZTogXCLliKDpmaQje29iamVjdC5sYWJlbH1cIlxyXG5cdFx0XHRcdHRleHQ6IFwiPGRpdiBjbGFzcz0nZGVsZXRlLWNyZWF0b3Itd2FybmluZyc+I3t0ZXh0fe+8nzwvZGl2PlwiXHJcblx0XHRcdFx0aHRtbDogdHJ1ZVxyXG5cdFx0XHRcdHNob3dDYW5jZWxCdXR0b246dHJ1ZVxyXG5cdFx0XHRcdGNvbmZpcm1CdXR0b25UZXh0OiB0KCdEZWxldGUnKVxyXG5cdFx0XHRcdGNhbmNlbEJ1dHRvblRleHQ6IHQoJ0NhbmNlbCcpXHJcblx0XHRcdFx0KG9wdGlvbikgLT5cclxuXHRcdFx0XHRcdGlmIG9wdGlvblxyXG5cdFx0XHRcdFx0XHRDcmVhdG9yLm9kYXRhLmRlbGV0ZSBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCAoKS0+XHJcblx0XHRcdFx0XHRcdFx0aWYgcmVjb3JkX3RpdGxlXHJcblx0XHRcdFx0XHRcdFx0XHRpbmZvID0gb2JqZWN0LmxhYmVsICsgXCJcXFwiI3tyZWNvcmRfdGl0bGV9XFxcIlwiICsgXCLlt7LliKDpmaRcIlxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGluZm8gPSBcIuWIoOmZpOaIkOWKn1wiXHJcblx0XHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MgaW5mb1xyXG5cdFx0XHRcdFx0XHRcdCMg5paH5Lu254mI5pys5Li6XCJjZnMuZmlsZXMuZmlsZXJlY29yZFwi77yM6ZyA6KaB5pu/5o2i5Li6XCJjZnMtZmlsZXMtZmlsZXJlY29yZFwiXHJcblx0XHRcdFx0XHRcdFx0Z3JpZE9iamVjdE5hbWVDbGFzcyA9IG9iamVjdF9uYW1lLnJlcGxhY2UoL1xcLi9nLFwiLVwiKVxyXG5cdFx0XHRcdFx0XHRcdGdyaWRDb250YWluZXIgPSAkKFwiLmdyaWRDb250YWluZXIuI3tncmlkT2JqZWN0TmFtZUNsYXNzfVwiKVxyXG5cdFx0XHRcdFx0XHRcdHVubGVzcyBncmlkQ29udGFpbmVyPy5sZW5ndGhcclxuXHRcdFx0XHRcdFx0XHRcdGlmIHdpbmRvdy5vcGVuZXJcclxuXHRcdFx0XHRcdFx0XHRcdFx0aXNPcGVuZXJSZW1vdmUgPSB0cnVlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGdyaWRDb250YWluZXIgPSB3aW5kb3cub3BlbmVyLiQoXCIuZ3JpZENvbnRhaW5lci4je2dyaWRPYmplY3ROYW1lQ2xhc3N9XCIpXHJcblx0XHRcdFx0XHRcdFx0aWYgZ3JpZENvbnRhaW5lcj8ubGVuZ3RoXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3QuZW5hYmxlX3RyZWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keFRyZWVMaXN0KCkuZHhUcmVlTGlzdCgnaW5zdGFuY2UnKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4RGF0YUdyaWQoKS5keERhdGFHcmlkKCdpbnN0YW5jZScpXHJcblx0XHRcdFx0XHRcdFx0aWYgZHhEYXRhR3JpZEluc3RhbmNlXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3QuZW5hYmxlX3RyZWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZHhEYXRhR3JpZEluc3RhbmNlLnJlZnJlc2goKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRUZW1wbGF0ZS5jcmVhdG9yX2dyaWQucmVmcmVzaChkeERhdGFHcmlkSW5zdGFuY2UpXHJcblx0XHRcdFx0XHRcdFx0aWYgaXNPcGVuZXJSZW1vdmUgb3IgIWR4RGF0YUdyaWRJbnN0YW5jZVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgaXNPcGVuZXJSZW1vdmVcclxuXHRcdFx0XHRcdFx0XHRcdFx0d2luZG93LmNsb3NlKClcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgcmVjb3JkX2lkID09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpIGFuZCAhU3RlZWRvcy5pc01vYmlsZSgpIGFuZCBsaXN0X3ZpZXdfaWQgIT0gJ2NhbGVuZGFyJ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhcHBpZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXHJcblx0XHRcdFx0XHRcdFx0XHRcdHVubGVzcyBsaXN0X3ZpZXdfaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR1bmxlc3MgbGlzdF92aWV3X2lkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGlzdF92aWV3X2lkID0gXCJhbGxcIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLmdvIFwiL2FwcC8je2FwcGlkfS8je29iamVjdF9uYW1lfS9ncmlkLyN7bGlzdF92aWV3X2lkfVwiXHJcblx0XHRcdFx0XHRcdFx0aWYgY2FsbF9iYWNrIGFuZCB0eXBlb2YgY2FsbF9iYWNrID09IFwiZnVuY3Rpb25cIlxyXG5cdFx0XHRcdFx0XHRcdFx0Y2FsbF9iYWNrKClcclxuIiwiQ3JlYXRvci5hY3Rpb25zQnlOYW1lID0ge307XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5hY3Rpb25zID0gZnVuY3Rpb24oYWN0aW9ucykge1xuICAgIHJldHVybiBfLmVhY2goYWN0aW9ucywgZnVuY3Rpb24odG9kbywgYWN0aW9uX25hbWUpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uX25hbWVdID0gdG9kbztcbiAgICB9KTtcbiAgfTtcbiAgQ3JlYXRvci5leGVjdXRlQWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkKSB7XG4gICAgdmFyIG1vcmVBcmdzLCBvYmosIHRvZG8sIHRvZG9BcmdzO1xuICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMCkge1xuICAgICAgaWYgKHR5cGVvZiBhY3Rpb24udG9kbyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFjdGlvbi50b2RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdG9kbyA9IGFjdGlvbi50b2RvO1xuICAgICAgfVxuICAgICAgaWYgKCFyZWNvcmQgJiYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgICAgIHJlY29yZCA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgfVxuICAgICAgaWYgKHRvZG8pIHtcbiAgICAgICAgaXRlbV9lbGVtZW50ID0gaXRlbV9lbGVtZW50ID8gaXRlbV9lbGVtZW50IDogXCJcIjtcbiAgICAgICAgbW9yZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuICAgICAgICB0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpO1xuICAgICAgICByZXR1cm4gdG9kby5hcHBseSh7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICAgIHJlY29yZF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgIG9iamVjdDogb2JqLFxuICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgIGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50LFxuICAgICAgICAgIHJlY29yZDogcmVjb3JkXG4gICAgICAgIH0sIHRvZG9BcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIENyZWF0b3IuYWN0aW9ucyh7XG4gICAgXCJzdGFuZGFyZF9xdWVyeVwiOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBNb2RhbC5zaG93KFwic3RhbmRhcmRfcXVlcnlfbW9kYWxcIik7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX25ld1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpIHtcbiAgICAgIHZhciBkb2MsIGlkcztcbiAgICAgIGlkcyA9IENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzW29iamVjdF9uYW1lXTtcbiAgICAgIGlmIChpZHMgIT0gbnVsbCA/IGlkcy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgcmVjb3JkX2lkID0gaWRzWzBdO1xuICAgICAgICBkb2MgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgZG9jKTtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWUpO1xuICAgICAgfVxuICAgICAgTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJChcIi5jcmVhdG9yLWFkZFwiKS5jbGljaygpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX29wZW5fdmlld1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpIHtcbiAgICAgIHZhciBocmVmO1xuICAgICAgaHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgd2luZG93Lm9wZW4oaHJlZiwgJ19ibGFuaycsICd3aWR0aD04MDAsIGhlaWdodD02MDAsIGxlZnQ9NTAsIHRvcD0gNTAsIHRvb2xiYXI9bm8sIHN0YXR1cz1ubywgbWVudWJhcj1ubywgcmVzaXphYmxlPXllcywgc2Nyb2xsYmFycz15ZXMnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGhyZWY7XG4gICAgICBocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICB3aW5kb3cub3BlbihocmVmLCAnX2JsYW5rJywgJ3dpZHRoPTgwMCwgaGVpZ2h0PTYwMCwgbGVmdD01MCwgdG9wPSA1MCwgdG9vbGJhcj1ubywgc3RhdHVzPW5vLCBtZW51YmFyPW5vLCByZXNpemFibGU9eWVzLCBzY3JvbGxiYXJzPXllcycpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9lZGl0XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIGZhbHNlKSB7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZCk7XG4gICAgICAgICAgaWYgKHRoaXMucmVjb3JkKSB7XG4gICAgICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCB0aGlzLnJlY29yZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIi5idG4tZWRpdC1yZWNvcmRcIikuY2xpY2soKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIHRoaXMucmVjb3JkKTtcbiAgICAgICAgICAgIHJldHVybiBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiAkKFwiLmJ0bi5jcmVhdG9yLWVkaXRcIikuY2xpY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9kZWxldGVcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIGNhbGxfYmFjaykge1xuICAgICAgdmFyIG9iamVjdCwgdGV4dDtcbiAgICAgIGNvbnNvbGUubG9nKFwic3RhbmRhcmRfZGVsZXRlXCIsIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkKTtcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICAgIGlmICghXy5pc1N0cmluZyhyZWNvcmRfdGl0bGUpICYmIChyZWNvcmRfdGl0bGUgIT0gbnVsbCA/IHJlY29yZF90aXRsZS5uYW1lIDogdm9pZCAwKSkge1xuICAgICAgICByZWNvcmRfdGl0bGUgPSByZWNvcmRfdGl0bGUgIT0gbnVsbCA/IHJlY29yZF90aXRsZS5uYW1lIDogdm9pZCAwO1xuICAgICAgfVxuICAgICAgaWYgKHJlY29yZF90aXRsZSkge1xuICAgICAgICB0ZXh0ID0gXCLmmK/lkKbnoa7lrpropoHliKDpmaTmraRcIiArIG9iamVjdC5sYWJlbCArIFwiXFxcIlwiICsgcmVjb3JkX3RpdGxlICsgXCJcXFwiXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0ID0gXCLmmK/lkKbnoa7lrpropoHliKDpmaTmraRcIiArIG9iamVjdC5sYWJlbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzd2FsKHtcbiAgICAgICAgdGl0bGU6IFwi5Yig6ZmkXCIgKyBvYmplY3QubGFiZWwsXG4gICAgICAgIHRleHQ6IFwiPGRpdiBjbGFzcz0nZGVsZXRlLWNyZWF0b3Itd2FybmluZyc+XCIgKyB0ZXh0ICsgXCLvvJ88L2Rpdj5cIixcbiAgICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IHQoJ0RlbGV0ZScpLFxuICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiB0KCdDYW5jZWwnKVxuICAgICAgfSwgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIGlmIChvcHRpb24pIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvci5vZGF0YVtcImRlbGV0ZVwiXShvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhcHBpZCwgZHhEYXRhR3JpZEluc3RhbmNlLCBncmlkQ29udGFpbmVyLCBncmlkT2JqZWN0TmFtZUNsYXNzLCBpbmZvLCBpc09wZW5lclJlbW92ZTtcbiAgICAgICAgICAgIGlmIChyZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgICAgICAgaW5mbyA9IG9iamVjdC5sYWJlbCArIChcIlxcXCJcIiArIHJlY29yZF90aXRsZSArIFwiXFxcIlwiKSArIFwi5bey5Yig6ZmkXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpbmZvID0gXCLliKDpmaTmiJDlip9cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKGluZm8pO1xuICAgICAgICAgICAgZ3JpZE9iamVjdE5hbWVDbGFzcyA9IG9iamVjdF9uYW1lLnJlcGxhY2UoL1xcLi9nLCBcIi1cIik7XG4gICAgICAgICAgICBncmlkQ29udGFpbmVyID0gJChcIi5ncmlkQ29udGFpbmVyLlwiICsgZ3JpZE9iamVjdE5hbWVDbGFzcyk7XG4gICAgICAgICAgICBpZiAoIShncmlkQ29udGFpbmVyICE9IG51bGwgPyBncmlkQ29udGFpbmVyLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgaWYgKHdpbmRvdy5vcGVuZXIpIHtcbiAgICAgICAgICAgICAgICBpc09wZW5lclJlbW92ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgZ3JpZENvbnRhaW5lciA9IHdpbmRvdy5vcGVuZXIuJChcIi5ncmlkQ29udGFpbmVyLlwiICsgZ3JpZE9iamVjdE5hbWVDbGFzcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChncmlkQ29udGFpbmVyICE9IG51bGwgPyBncmlkQ29udGFpbmVyLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgICBpZiAob2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keFRyZWVMaXN0KCkuZHhUcmVlTGlzdCgnaW5zdGFuY2UnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4RGF0YUdyaWQoKS5keERhdGFHcmlkKCdpbnN0YW5jZScpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZHhEYXRhR3JpZEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgIGlmIChvYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UucmVmcmVzaCgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFRlbXBsYXRlLmNyZWF0b3JfZ3JpZC5yZWZyZXNoKGR4RGF0YUdyaWRJbnN0YW5jZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc09wZW5lclJlbW92ZSB8fCAhZHhEYXRhR3JpZEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgIGlmIChpc09wZW5lclJlbW92ZSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlY29yZF9pZCA9PT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBsaXN0X3ZpZXdfaWQgIT09ICdjYWxlbmRhcicpIHtcbiAgICAgICAgICAgICAgICBhcHBpZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICAgICAgICAgICAgICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICAgICAgICAgICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgICAgICAgICAgICAgIGxpc3Rfdmlld19pZCA9IFwiYWxsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvYXBwL1wiICsgYXBwaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjYWxsX2JhY2sgJiYgdHlwZW9mIGNhbGxfYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYWxsX2JhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==
