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

  if (_object.enable_approvals) {
    related_objects.push({
      object_name: "approvals",
      foreign_key: "related_to"
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
  self.enable_approvals = options.enable_approvals;
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
    } else if (field.type === 'autonumber') {
      fs.type = String;
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
    var apps, isSpaceAdmin, psetBase, psets, psetsAdmin, psetsUser, ref;
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

      if (psetBase != null ? (ref = psetBase.assigned_apps) != null ? ref.length : void 0 : void 0) {
        apps = _.union(apps, psetBase.assigned_apps);
      } else {
        return [];
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJSZXBvcnRzIiwic3VicyIsInN0ZWVkb3NTY2hlbWEiLCJlIiwic3RlZWRvc0NvcmUiLCJyZXF1aXJlIiwiTWV0ZW9yIiwiaXNEZXZlbG9wbWVudCIsInN0YXJ0dXAiLCJleCIsImluaXQiLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJGaWJlciIsInBhdGgiLCJkZXBzIiwiYXBwIiwiVHJhY2tlciIsIkRlcGVuZGVuY3kiLCJvYmplY3QiLCJfVEVNUExBVEUiLCJTaW1wbGVTY2hlbWEiLCJleHRlbmRPcHRpb25zIiwiZmlsdGVyc0Z1bmN0aW9uIiwiTWF0Y2giLCJPcHRpb25hbCIsIk9uZU9mIiwiRnVuY3Rpb24iLCJTdHJpbmciLCJvcHRpb25zRnVuY3Rpb24iLCJjcmVhdGVGdW5jdGlvbiIsImlzU2VydmVyIiwiZmliZXJMb2FkT2JqZWN0cyIsIm9iaiIsIm9iamVjdF9uYW1lIiwibG9hZE9iamVjdHMiLCJydW4iLCJuYW1lIiwibGlzdF92aWV3cyIsInNwYWNlIiwiY29udmVydE9iamVjdCIsIk9iamVjdCIsImluaXRUcmlnZ2VycyIsImluaXRMaXN0Vmlld3MiLCJnZXRPYmplY3ROYW1lIiwiZ2V0T2JqZWN0Iiwic3BhY2VfaWQiLCJyZWYiLCJyZWYxIiwiXyIsImlzQXJyYXkiLCJpc0NsaWVudCIsImRlcGVuZCIsIlNlc3Npb24iLCJnZXQiLCJzdGFydHNXaXRoIiwib2JqZWN0c0J5TmFtZSIsImZpbmQiLCJvIiwiX2NvbGxlY3Rpb25fbmFtZSIsImdldE9iamVjdEJ5SWQiLCJvYmplY3RfaWQiLCJmaW5kV2hlcmUiLCJfaWQiLCJyZW1vdmVPYmplY3QiLCJnZXRDb2xsZWN0aW9uIiwic3BhY2VJZCIsInJlbW92ZUNvbGxlY3Rpb24iLCJpc1NwYWNlQWRtaW4iLCJ1c2VySWQiLCJmaW5kT25lIiwiYWRtaW5zIiwiaW5kZXhPZiIsImV2YWx1YXRlRm9ybXVsYSIsImZvcm11bGFyIiwiY29udGV4dCIsIm9wdGlvbnMiLCJpc1N0cmluZyIsIkZvcm11bGFyIiwiY2hlY2tGb3JtdWxhIiwiZXZhbHVhdGVGaWx0ZXJzIiwiZmlsdGVycyIsInNlbGVjdG9yIiwiZWFjaCIsImZpbHRlciIsImFjdGlvbiIsInZhbHVlIiwibGVuZ3RoIiwiaXNDb21tb25TcGFjZSIsImdldE9yZGVybHlTZXRCeUlkcyIsImRvY3MiLCJpZHMiLCJpZF9rZXkiLCJoaXRfZmlyc3QiLCJ2YWx1ZXMiLCJnZXRQcm9wZXJ0eSIsInNvcnRCeSIsImRvYyIsIl9pbmRleCIsInNvcnRpbmdNZXRob2QiLCJ2YWx1ZTEiLCJ2YWx1ZTIiLCJpc1ZhbHVlMUVtcHR5IiwiaXNWYWx1ZTJFbXB0eSIsImxvY2FsZSIsImtleSIsIkRhdGUiLCJnZXRUaW1lIiwiU3RlZWRvcyIsInRvU3RyaW5nIiwibG9jYWxlQ29tcGFyZSIsImdldE9iamVjdFJlbGF0ZWRzIiwiX29iamVjdCIsInBlcm1pc3Npb25zIiwicmVsYXRlZF9vYmplY3RzIiwiZW5hYmxlX2ZpbGVzIiwicHVzaCIsImZvcmVpZ25fa2V5IiwicmVsYXRlZF9vYmplY3QiLCJyZWxhdGVkX29iamVjdF9uYW1lIiwiZmllbGRzIiwicmVsYXRlZF9maWVsZCIsInJlbGF0ZWRfZmllbGRfbmFtZSIsInR5cGUiLCJyZWZlcmVuY2VfdG8iLCJzcGxpY2UiLCJlbmFibGVfdGFza3MiLCJlbmFibGVfbm90ZXMiLCJlbmFibGVfZXZlbnRzIiwiZW5hYmxlX2luc3RhbmNlcyIsImVuYWJsZV9hcHByb3ZhbHMiLCJnZXRQZXJtaXNzaW9ucyIsImVuYWJsZV9hdWRpdCIsIm1vZGlmeUFsbFJlY29yZHMiLCJnZXRVc2VyQ29udGV4dCIsImlzVW5TYWZlTW9kZSIsIlVTRVJfQ09OVEVYVCIsInNwYWNlX3VzZXJfb3JnIiwic3UiLCJzdUZpZWxkcyIsIkVycm9yIiwibW9iaWxlIiwicG9zaXRpb24iLCJlbWFpbCIsImNvbXBhbnkiLCJvcmdhbml6YXRpb24iLCJjb21wYW55X2lkIiwiY29tcGFueV9pZHMiLCJ1c2VyIiwiZnVsbG5hbWUiLCJnZXRSZWxhdGl2ZVVybCIsInVybCIsInRlc3QiLCJfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fIiwiUk9PVF9VUkxfUEFUSF9QUkVGSVgiLCJnZXRVc2VyQ29tcGFueUlkIiwiZ2V0VXNlckNvbXBhbnlJZHMiLCJwcm9jZXNzUGVybWlzc2lvbnMiLCJwbyIsImFsbG93Q3JlYXRlIiwiYWxsb3dSZWFkIiwiYWxsb3dFZGl0IiwiYWxsb3dEZWxldGUiLCJ2aWV3QWxsUmVjb3JkcyIsInZpZXdDb21wYW55UmVjb3JkcyIsIm1vZGlmeUNvbXBhbnlSZWNvcmRzIiwicHJvY2VzcyIsImVudiIsIlNURUVET1NfU1RPUkFHRV9ESVIiLCJzdGVlZG9zU3RvcmFnZURpciIsInJlc29sdmUiLCJqb2luIiwiX19tZXRlb3JfYm9vdHN0cmFwX18iLCJzZXJ2ZXJEaXIiLCJtZXRob2RzIiwiY29sbGVjdGlvbiIsIm5hbWVfZmllbGRfa2V5Iiwib3B0aW9uc19saW1pdCIsInF1ZXJ5IiwicXVlcnlfb3B0aW9ucyIsInJlY29yZHMiLCJyZXN1bHRzIiwic2VhcmNoVGV4dFF1ZXJ5Iiwic2VsZWN0ZWQiLCJzb3J0IiwicGFyYW1zIiwiTkFNRV9GSUVMRF9LRVkiLCJzZWFyY2hUZXh0IiwiJHJlZ2V4IiwiJG9yIiwiJGluIiwiZXh0ZW5kIiwiJG5pbiIsImZpbHRlclF1ZXJ5IiwibGltaXQiLCJpc09iamVjdCIsImZldGNoIiwicmVjb3JkIiwibGFiZWwiLCJtZXNzYWdlIiwiSlNPTiIsInN0cmluZ2lmeSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiYm94IiwiY3VycmVudF91c2VyX2lkIiwiY3VycmVudF91c2VyX2luZm8iLCJmbG93SWQiLCJoYXNoRGF0YSIsImlucyIsImluc0lkIiwicmVjb3JkX2lkIiwicmVkaXJlY3RfdXJsIiwicmVmMiIsIndvcmtmbG93VXJsIiwieF9hdXRoX3Rva2VuIiwieF91c2VyX2lkIiwidXVmbG93TWFuYWdlciIsImNoZWNrX2F1dGhvcml6YXRpb24iLCJib2R5IiwiY2hlY2siLCJpbnN0YW5jZUlkIiwic2V0dGluZ3MiLCJ3ZWJzZXJ2aWNlcyIsIndvcmtmbG93IiwiZmxvdyIsImluYm94X3VzZXJzIiwiaW5jbHVkZXMiLCJjY191c2VycyIsIm91dGJveF91c2VycyIsInN0YXRlIiwic3VibWl0dGVyIiwiYXBwbGljYW50IiwicGVybWlzc2lvbk1hbmFnZXIiLCJnZXRGbG93UGVybWlzc2lvbnMiLCJzcGFjZXMiLCJzZW5kUmVzdWx0IiwiY29kZSIsImRhdGEiLCJ1cGRhdGUiLCIkcHVsbCIsImVycm9ycyIsImVycm9yTWVzc2FnZSIsInJlYXNvbiIsImdldEluaXRXaWR0aFBlcmNlbnQiLCJjb2x1bW5zIiwiX3NjaGVtYSIsImNvbHVtbl9udW0iLCJpbml0X3dpZHRoX3BlcmNlbnQiLCJnZXRTY2hlbWEiLCJmaWVsZF9uYW1lIiwiZmllbGQiLCJpc193aWRlIiwicGljayIsImF1dG9mb3JtIiwiZ2V0RmllbGRJc1dpZGUiLCJnZXRUYWJ1bGFyT3JkZXIiLCJsaXN0X3ZpZXdfaWQiLCJzZXR0aW5nIiwibWFwIiwiY29sdW1uIiwiaGlkZGVuIiwiY29tcGFjdCIsIm9yZGVyIiwiaW5kZXgiLCJkZWZhdWx0X2V4dHJhX2NvbHVtbnMiLCJleHRyYV9jb2x1bW5zIiwiZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMiLCJnZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zIiwidW5pb24iLCJnZXRPYmplY3REZWZhdWx0U29ydCIsIlRhYnVsYXJTZWxlY3RlZElkcyIsImNvbnZlcnRMaXN0VmlldyIsImRlZmF1bHRfY29sdW1lbnMiLCJsaXN0X3ZpZXciLCJsaXN0X3ZpZXdfbmFtZSIsIm9pdGVtIiwiY2xvbmUiLCJoYXMiLCJmaWx0ZXJfc2NvcGUiLCJwYXJzZSIsImZvckVhY2giLCJpc0Z1bmN0aW9uIiwiX3ZhbHVlIiwiZ2V0UmVsYXRlZExpc3QiLCJsaXN0IiwiZ2V0UmVsYXRlZE9iamVjdHMiLCJyZWxhdGVkX29iamVjdF9pdGVtIiwicmVsYXRlZCIsInRhYnVsYXJfb3JkZXIiLCJ3aXRob3V0IiwidHJhbnNmb3JtU29ydFRvVGFidWxhciIsInJlcGxhY2UiLCJpc19maWxlIiwiZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyIsImZpcnN0IiwiZ2V0TGlzdFZpZXdzIiwiZ2V0TGlzdFZpZXciLCJleGFjIiwibGlzdFZpZXdzIiwiZ2V0TGlzdFZpZXdJc1JlY2VudCIsImxpc3RWaWV3IiwiZ2V0T2JqZWN0RGVmYXVsdFZpZXciLCJkZWZhdWx0VmlldyIsImlzQWxsVmlldyIsImlzUmVjZW50VmlldyIsInRhYnVsYXJDb2x1bW5zIiwidGFidWxhcl9zb3J0IiwiaXRlbSIsImNvbHVtbl9pbmRleCIsInRyYW5zZm9ybVNvcnRUb0RYIiwiZHhfc29ydCIsIlJlZ0V4IiwiUmVnRXhwIiwiX3JlZ0V4TWVzc2FnZXMiLCJfZ2xvYmFsTWVzc2FnZXMiLCJyZWdFeCIsImV4cCIsIm1zZyIsIm1lc3NhZ2VzIiwiZXZhbEluQ29udGV4dCIsImpzIiwiZXZhbCIsImNhbGwiLCJnZXRPcHRpb24iLCJvcHRpb24iLCJmb28iLCJzcGxpdCIsInRyaWdnZXJzIiwidHJpZ2dlciIsIl90b2RvIiwiX3RvZG9fZnJvbV9jb2RlIiwiX3RvZG9fZnJvbV9kYiIsIm9uIiwidG9kbyIsImFjdGlvbnMiLCJfdmlzaWJsZSIsImVycm9yMSIsImFjdGlvbnNCeU5hbWUiLCJ2aXNpYmxlIiwiX29wdGlvbnMiLCJfdHlwZSIsImJlZm9yZU9wZW5GdW5jdGlvbiIsImRlZmF1bHRWYWx1ZSIsImlzX2NvbXBhbnlfbGltaXRlZCIsIl9vcHRpb24iLCJ2IiwiayIsIl9yZWdFeCIsIk51bWJlciIsIkJvb2xlYW4iLCJfb3B0aW9uc0Z1bmN0aW9uIiwiX3JlZmVyZW5jZV90byIsIl9jcmVhdGVGdW5jdGlvbiIsIl9iZWZvcmVPcGVuRnVuY3Rpb24iLCJfZmlsdGVyc0Z1bmN0aW9uIiwiX2RlZmF1bHRWYWx1ZSIsIl9pc19jb21wYW55X2xpbWl0ZWQiLCJfZmlsdGVycyIsImlzRGF0ZSIsInBvcCIsIl9pc19kYXRlIiwiUFJFRklYIiwiX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhIiwicHJlZml4IiwiZmllbGRWYXJpYWJsZSIsInJlZyIsInJldiIsIm0iLCIkMSIsImZvcm11bGFfc3RyIiwiX0NPTlRFWFQiLCJfVkFMVUVTIiwiaXNCb29sZWFuIiwidG9hc3RyIiwiZm9ybWF0T2JqZWN0TmFtZSIsIl9kYiIsImRlZmF1bHRDb2x1bW5zIiwiZGVmYXVsdExpc3RWaWV3SWQiLCJkaXNhYmxlZF9saXN0X3ZpZXdzIiwicmVmMyIsInNjaGVtYSIsInNlbGYiLCJpY29uIiwiZGVzY3JpcHRpb24iLCJpc192aWV3IiwiaXNfZW5hYmxlIiwiZW5hYmxlX3NlYXJjaCIsImVuYWJsZV9hcGkiLCJjdXN0b20iLCJlbmFibGVfc2hhcmUiLCJlbmFibGVfdHJlZSIsIm9wZW5fd2luZG93IiwiZmlsdGVyX2NvbXBhbnkiLCJjYWxlbmRhciIsInNpZGViYXIiLCJlbmFibGVfY2hhdHRlciIsImVuYWJsZV90cmFzaCIsImVuYWJsZV9zcGFjZV9nbG9iYWwiLCJpZEZpZWxkTmFtZSIsImRhdGFiYXNlX25hbWUiLCJpc19uYW1lIiwicHJpbWFyeSIsImJhc2VPYmplY3QiLCJpdGVtX25hbWUiLCJjb3B5SXRlbSIsInBlcm1pc3Npb25fc2V0IiwiYWRtaW4iLCJhbGwiLCJsaXN0X3ZpZXdfaXRlbSIsIlJlYWN0aXZlVmFyIiwidW5yZWFkYWJsZV9maWVsZHMiLCJ1bmVkaXRhYmxlX2ZpZWxkcyIsInJlYWRvbmx5IiwiZGlzYWJsZWQiLCJyZXF1aXJlZCIsImNyZWF0ZUNvbGxlY3Rpb24iLCJfbmFtZSIsImdldE9iamVjdFNjaGVtYSIsImNvbnRhaW5zIiwiYXR0YWNoU2NoZW1hIiwiX3NpbXBsZVNjaGVtYSIsInByb3RvdHlwZSIsImkxOG4iLCJ0IiwiZmtleSIsImkxOG5fa2V5IiwiZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXgiLCJhdXRvcnVuIiwiYm9vdHN0cmFwTG9hZGVkIiwiZmllbGRzQXJyIiwiX3JlZl9vYmoiLCJhdXRvZm9ybV90eXBlIiwiZnMiLCJpc1VuTGltaXRlZCIsIm11bHRpcGxlIiwicm93cyIsImxhbmd1YWdlIiwiaXNNb2JpbGUiLCJpc1BhZCIsImFmRmllbGRJbnB1dCIsImRhdGVNb2JpbGVPcHRpb25zIiwib3V0Rm9ybWF0IiwidGltZXpvbmVJZCIsImR4RGF0ZUJveE9wdGlvbnMiLCJkaXNwbGF5Rm9ybWF0IiwiaGVpZ2h0IiwiZGlhbG9nc0luQm9keSIsInRvb2xiYXIiLCJmb250TmFtZXMiLCJkZXBlbmRPbiIsImRlcGVuZF9vbiIsImNyZWF0ZSIsImxvb2t1cF9maWVsZCIsIk1vZGFsIiwic2hvdyIsImZvcm1JZCIsIm9wZXJhdGlvbiIsIm9uU3VjY2VzcyIsInJlc3VsdCIsImFkZEl0ZW1zIiwicmVmZXJlbmNlX3NvcnQiLCJvcHRpb25zU29ydCIsInJlZmVyZW5jZV9saW1pdCIsIm9wdGlvbnNMaW1pdCIsIm9taXQiLCJpbmNsdWRlIiwiYmxhY2tib3giLCJvYmplY3RTd2l0Y2hlIiwib3B0aW9uc01ldGhvZCIsIm9wdGlvbnNNZXRob2RQYXJhbXMiLCJyZWZlcmVuY2VzIiwiX3JlZmVyZW5jZSIsImxpbmsiLCJkZWZhdWx0SWNvbiIsInNob3dJY29uIiwiZmlyc3RPcHRpb24iLCJwcmVjaXNpb24iLCJzY2FsZSIsImRlY2ltYWwiLCJBcnJheSIsImVkaXRhYmxlIiwiYWNjZXB0Iiwic3lzdGVtIiwiRW1haWwiLCJhbGxvd2VkVmFsdWVzIiwib3B0aW9uYWwiLCJ1bmlxdWUiLCJncm91cCIsImZpbHRlcmFibGUiLCJzZWFyY2hhYmxlIiwiaW5saW5lSGVscFRleHQiLCJpc1Byb2R1Y3Rpb24iLCJzb3J0YWJsZSIsImdldEZpZWxkRGlzcGxheVZhbHVlIiwiZmllbGRfdmFsdWUiLCJodG1sIiwibW9tZW50IiwidmFsIiwiZm9ybWF0IiwiY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5IiwiZmllbGRfdHlwZSIsInB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyIsIm9wZXJhdGlvbnMiLCJidWlsdGluVmFsdWVzIiwiZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMiLCJidWlsdGluSXRlbSIsImlzX2NoZWNrX29ubHkiLCJnZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMiLCJnZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSIsImdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uIiwiYmV0d2VlbkJ1aWx0aW5WYWx1ZXMiLCJnZXRRdWFydGVyU3RhcnRNb250aCIsIm1vbnRoIiwiZ2V0TW9udGgiLCJnZXRMYXN0UXVhcnRlckZpcnN0RGF5IiwieWVhciIsImdldEZ1bGxZZWFyIiwiZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSIsImdldE1vbnRoRGF5cyIsImRheXMiLCJlbmREYXRlIiwibWlsbGlzZWNvbmQiLCJzdGFydERhdGUiLCJnZXRMYXN0TW9udGhGaXJzdERheSIsImN1cnJlbnRNb250aCIsImN1cnJlbnRZZWFyIiwiZW5kVmFsdWUiLCJmaXJzdERheSIsImxhc3REYXkiLCJsYXN0TW9uZGF5IiwibGFzdE1vbnRoRmluYWxEYXkiLCJsYXN0TW9udGhGaXJzdERheSIsImxhc3RRdWFydGVyRW5kRGF5IiwibGFzdFF1YXJ0ZXJTdGFydERheSIsImxhc3RTdW5kYXkiLCJsYXN0XzEyMF9kYXlzIiwibGFzdF8zMF9kYXlzIiwibGFzdF82MF9kYXlzIiwibGFzdF83X2RheXMiLCJsYXN0XzkwX2RheXMiLCJtaW51c0RheSIsIm1vbmRheSIsIm5leHRNb25kYXkiLCJuZXh0TW9udGhGaW5hbERheSIsIm5leHRNb250aEZpcnN0RGF5IiwibmV4dFF1YXJ0ZXJFbmREYXkiLCJuZXh0UXVhcnRlclN0YXJ0RGF5IiwibmV4dFN1bmRheSIsIm5leHRZZWFyIiwibmV4dF8xMjBfZGF5cyIsIm5leHRfMzBfZGF5cyIsIm5leHRfNjBfZGF5cyIsIm5leHRfN19kYXlzIiwibmV4dF85MF9kYXlzIiwibm93IiwicHJldmlvdXNZZWFyIiwic3RhcnRWYWx1ZSIsInN0ckVuZERheSIsInN0ckZpcnN0RGF5Iiwic3RyTGFzdERheSIsInN0ck1vbmRheSIsInN0clN0YXJ0RGF5Iiwic3RyU3VuZGF5Iiwic3RyVG9kYXkiLCJzdHJUb21vcnJvdyIsInN0clllc3RkYXkiLCJzdW5kYXkiLCJ0aGlzUXVhcnRlckVuZERheSIsInRoaXNRdWFydGVyU3RhcnREYXkiLCJ0b21vcnJvdyIsIndlZWsiLCJ5ZXN0ZGF5IiwiZ2V0RGF5IiwiZnYiLCJzZXRIb3VycyIsImdldEhvdXJzIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJnZXRGaWVsZERlZmF1bHRPcGVyYXRpb24iLCJnZXRGaWVsZE9wZXJhdGlvbiIsIm9wdGlvbmFscyIsImVxdWFsIiwidW5lcXVhbCIsImxlc3NfdGhhbiIsImdyZWF0ZXJfdGhhbiIsImxlc3Nfb3JfZXF1YWwiLCJncmVhdGVyX29yX2VxdWFsIiwibm90X2NvbnRhaW4iLCJzdGFydHNfd2l0aCIsImJldHdlZW4iLCJnZXRPYmplY3RGaWVsZHNOYW1lIiwiZmllbGRzTmFtZSIsInNvcnRfbm8iLCJjbGVhblRyaWdnZXIiLCJpbml0VHJpZ2dlciIsIl90cmlnZ2VyX2hvb2tzIiwidG9kb1dyYXBwZXIiLCJhcHBseSIsImFyZ3VtZW50cyIsIndoZW4iLCJiZWZvcmUiLCJpbnNlcnQiLCJyZW1vdmUiLCJhZnRlciIsInJldmVyc2UiLCJfaG9vayIsInRyaWdnZXJfbmFtZSIsIl90cmlnZ2VyX2hvb2siLCJmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0IiwiZmluZF9wZXJtaXNzaW9uX29iamVjdCIsInVuaW9uUGx1cyIsImdldE9iamVjdFBlcm1pc3Npb25zIiwiZ2V0UmVjb3JkUGVybWlzc2lvbnMiLCJpc093bmVyIiwicmVjb3JkX2NvbXBhbnlfaWQiLCJ1c2VyX2NvbXBhbnlfaWRzIiwib3duZXIiLCJsb2NrZWQiLCJnZXRBbGxQZXJtaXNzaW9ucyIsIl9pIiwiaXNPcmdhbml6YXRpb25BZG1pbiIsImlzV29ya2Zsb3dBZG1pbiIsInBzZXRzIiwicHNldHNBZG1pbiIsInBzZXRzQWRtaW5fcG9zIiwicHNldHNDdXJyZW50IiwicHNldHNDdXJyZW50TmFtZXMiLCJwc2V0c0N1cnJlbnRfcG9zIiwicHNldHNHdWVzdCIsInBzZXRzR3Vlc3RfcG9zIiwicHNldHNNZW1iZXIiLCJwc2V0c01lbWJlcl9wb3MiLCJwc2V0c09yZ2FuaXphdGlvbkFkbWluIiwicHNldHNPcmdhbml6YXRpb25BZG1pbl9wb3MiLCJwc2V0c1VzZXIiLCJwc2V0c1VzZXJfcG9zIiwicHNldHNXb3JrZmxvd0FkbWluIiwicHNldHNXb3JrZmxvd0FkbWluX3BvcyIsInNldF9pZHMiLCJzcGFjZVVzZXIiLCJvYmplY3RzIiwiYXNzaWduZWRfYXBwcyIsInVzZXJzIiwicGVybWlzc2lvbl9zZXRfaWQiLCJjcmVhdGVkIiwibW9kaWZpZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWRfYnkiLCJwbHVjayIsInByb2ZpbGUiLCJnZXRBc3NpZ25lZEFwcHMiLCJiaW5kIiwiYXNzaWduZWRfbWVudXMiLCJnZXRBc3NpZ25lZE1lbnVzIiwidXNlcl9wZXJtaXNzaW9uX3NldHMiLCJhcnJheSIsIm90aGVyIiwiYXBwcyIsInBzZXRCYXNlIiwicHNldCIsInVuaXEiLCJhYm91dE1lbnUiLCJhZG1pbk1lbnVzIiwiYWxsTWVudXMiLCJjdXJyZW50UHNldE5hbWVzIiwibWVudXMiLCJvdGhlck1lbnVBcHBzIiwib3RoZXJNZW51cyIsImFkbWluX21lbnVzIiwibiIsImZsYXR0ZW4iLCJtZW51IiwicHNldHNNZW51IiwicGVybWlzc2lvbl9zZXRzIiwiaW50ZXJzZWN0aW9uIiwicGVybWlzc2lvbl9vYmplY3RzIiwiaXNOdWxsIiwicGVybWlzc2lvbl9zZXRfaWRzIiwib3BzZXRBZG1pbiIsIm9wc2V0R3Vlc3QiLCJvcHNldE1lbWJlciIsIm9wc2V0T3JnYW5pemF0aW9uQWRtaW4iLCJvcHNldFVzZXIiLCJvcHNldFdvcmtmbG93QWRtaW4iLCJwb3MiLCJwb3NBZG1pbiIsInBvc0d1ZXN0IiwicG9zTWVtYmVyIiwicG9zT3JnYW5pemF0aW9uQWRtaW4iLCJwb3NVc2VyIiwicG9zV29ya2Zsb3dBZG1pbiIsInByb2YiLCJndWVzdCIsIm1lbWJlciIsIndvcmtmbG93X2FkbWluIiwib3JnYW5pemF0aW9uX2FkbWluIiwiZGlzYWJsZWRfYWN0aW9ucyIsInVucmVsYXRlZF9vYmplY3RzIiwiY3JlYXRvcl9kYl91cmwiLCJvcGxvZ191cmwiLCJNT05HT19VUkxfQ1JFQVRPUiIsIk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SIiwiX0NSRUFUT1JfREFUQVNPVVJDRSIsIl9kcml2ZXIiLCJNb25nb0ludGVybmFscyIsIlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIiLCJvcGxvZ1VybCIsImNvbGxlY3Rpb25fa2V5IiwiQ29sbGVjdGlvbiIsImFjdGlvbl9uYW1lIiwiZXhlY3V0ZUFjdGlvbiIsIml0ZW1fZWxlbWVudCIsIm1vcmVBcmdzIiwidG9kb0FyZ3MiLCJvZGF0YSIsInNsaWNlIiwiY29uY2F0Iiwic2V0IiwiZGVmZXIiLCIkIiwiY2xpY2siLCJocmVmIiwiZ2V0T2JqZWN0VXJsIiwid2luZG93Iiwib3BlbiIsInJlY29yZF90aXRsZSIsImNhbGxfYmFjayIsInRleHQiLCJzd2FsIiwidGl0bGUiLCJzaG93Q2FuY2VsQnV0dG9uIiwiY29uZmlybUJ1dHRvblRleHQiLCJjYW5jZWxCdXR0b25UZXh0IiwiYXBwaWQiLCJkeERhdGFHcmlkSW5zdGFuY2UiLCJncmlkQ29udGFpbmVyIiwiZ3JpZE9iamVjdE5hbWVDbGFzcyIsImluZm8iLCJpc09wZW5lclJlbW92ZSIsInN1Y2Nlc3MiLCJvcGVuZXIiLCJkeFRyZWVMaXN0IiwiZHhEYXRhR3JpZCIsInJlZnJlc2giLCJUZW1wbGF0ZSIsImNyZWF0b3JfZ3JpZCIsImNsb3NlIiwiRmxvd1JvdXRlciIsImdvIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEtBQUNBLEVBQUQsR0FBTSxFQUFOOztBQUNBLElBQUksT0FBQUMsT0FBQSxvQkFBQUEsWUFBQSxJQUFKO0FBQ0MsT0FBQ0EsT0FBRCxHQUFXLEVBQVg7QUNFQTs7QUREREEsUUFBUUMsT0FBUixHQUFrQixFQUFsQjtBQUNBRCxRQUFRRSxXQUFSLEdBQXNCLEVBQXRCO0FBQ0FGLFFBQVFHLEtBQVIsR0FBZ0IsRUFBaEI7QUFDQUgsUUFBUUksSUFBUixHQUFlLEVBQWY7QUFDQUosUUFBUUssT0FBUixHQUFrQixFQUFsQjtBQUNBTCxRQUFRTSxJQUFSLEdBQWUsRUFBZjtBQUNBTixRQUFRTyxhQUFSLEdBQXdCLEVBQXhCLEM7Ozs7Ozs7Ozs7OztBRVRBLElBQUFDLENBQUEsRUFBQUMsV0FBQTs7QUFBQTtBQUNDQSxnQkFBY0MsUUFBUSxlQUFSLENBQWQ7O0FBQ0EsTUFBR0MsT0FBT0MsYUFBVjtBQUNDRCxXQUFPRSxPQUFQLENBQWU7QUFDZCxVQUFBQyxFQUFBOztBQUFBO0FDSUssZURISkwsWUFBWU0sSUFBWixFQ0dJO0FESkwsZUFBQUMsS0FBQTtBQUVNRixhQUFBRSxLQUFBO0FDS0QsZURKSkMsUUFBUUMsR0FBUixDQUFZSixFQUFaLENDSUk7QUFDRDtBRFRMO0FBSEY7QUFBQSxTQUFBRSxLQUFBO0FBUU1SLE1BQUFRLEtBQUE7QUFDTEMsVUFBUUMsR0FBUixDQUFZVixDQUFaO0FDU0EsQzs7Ozs7Ozs7Ozs7O0FDbEJELElBQUFXLEtBQUEsRUFBQUMsSUFBQTtBQUFBcEIsUUFBUXFCLElBQVIsR0FBZTtBQUNkQyxPQUFLLElBQUlDLFFBQVFDLFVBQVosRUFEUztBQUVkQyxVQUFRLElBQUlGLFFBQVFDLFVBQVo7QUFG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T0FBT3VYLFdBQVY7QUFDQ3dWLG1DQUFtQlMsT0FBbkI7QUFERDtBQUdDQyx5QkFBU0MsWUFBVCxDQUFzQkYsT0FBdEIsQ0FBOEJULGtCQUE5QjtBQUpGO0FDU007O0FESk4sZ0JBQUdJLGtCQUFrQixDQUFDSixrQkFBdEI7QUFDQyxrQkFBR0ksY0FBSDtBQUNDZix1QkFBT3VCLEtBQVA7QUFERCxxQkFFSyxJQUFHeGhCLGNBQWFqSyxRQUFRQyxHQUFSLENBQVksV0FBWixDQUFiLElBQTBDLENBQUNzRCxRQUFRNlUsUUFBUixFQUEzQyxJQUFrRXJMLGlCQUFnQixVQUFyRjtBQUNKNmQsd0JBQVE1cUIsUUFBUUMsR0FBUixDQUFZLFFBQVosQ0FBUjs7QUFDQSxxQkFBTzhNLFlBQVA7QUFDQ0EsaUNBQWUvTSxRQUFRQyxHQUFSLENBQVksY0FBWixDQUFmO0FDTU87O0FETFIscUJBQU84TSxZQUFQO0FBQ0NBLGlDQUFlLEtBQWY7QUNPTzs7QUROUjJlLDJCQUFXQyxFQUFYLENBQWMsVUFBUWYsS0FBUixHQUFjLEdBQWQsR0FBaUIvckIsV0FBakIsR0FBNkIsUUFBN0IsR0FBcUNrTyxZQUFuRDtBQVRGO0FDa0JNOztBRFJOLGdCQUFHc2QsYUFBYyxPQUFPQSxTQUFQLEtBQW9CLFVBQXJDO0FDVU8scUJEVE5BLFdDU007QUFDRDtBRDVDUCxZQ0ZJO0FBZ0REO0FEdkROLFFDRkc7QURoRUo7QUFBQSxHQUZEO0FDK0hBLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIkBkYiA9IHt9XG5pZiAhQ3JlYXRvcj9cblx0QENyZWF0b3IgPSB7fVxuQ3JlYXRvci5PYmplY3RzID0ge31cbkNyZWF0b3IuQ29sbGVjdGlvbnMgPSB7fVxuQ3JlYXRvci5NZW51cyA9IFtdXG5DcmVhdG9yLkFwcHMgPSB7fVxuQ3JlYXRvci5SZXBvcnRzID0ge31cbkNyZWF0b3Iuc3VicyA9IHt9XG5DcmVhdG9yLnN0ZWVkb3NTY2hlbWEgPSB7fSIsInRoaXMuZGIgPSB7fTtcblxuaWYgKHR5cGVvZiBDcmVhdG9yID09PSBcInVuZGVmaW5lZFwiIHx8IENyZWF0b3IgPT09IG51bGwpIHtcbiAgdGhpcy5DcmVhdG9yID0ge307XG59XG5cbkNyZWF0b3IuT2JqZWN0cyA9IHt9O1xuXG5DcmVhdG9yLkNvbGxlY3Rpb25zID0ge307XG5cbkNyZWF0b3IuTWVudXMgPSBbXTtcblxuQ3JlYXRvci5BcHBzID0ge307XG5cbkNyZWF0b3IuUmVwb3J0cyA9IHt9O1xuXG5DcmVhdG9yLnN1YnMgPSB7fTtcblxuQ3JlYXRvci5zdGVlZG9zU2NoZW1hID0ge307XG4iLCJ0cnlcblx0c3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJylcblx0aWYgTWV0ZW9yLmlzRGV2ZWxvcG1lbnRcblx0XHRNZXRlb3Iuc3RhcnR1cCAtPlxuXHRcdFx0dHJ5XG5cdFx0XHRcdHN0ZWVkb3NDb3JlLmluaXQoKVxuXHRcdFx0Y2F0Y2ggZXhcblx0XHRcdFx0Y29uc29sZS5sb2coZXgpXG5jYXRjaCBlXG5cdGNvbnNvbGUubG9nKGUpIiwidmFyIGUsIHN0ZWVkb3NDb3JlO1xuXG50cnkge1xuICBzdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKTtcbiAgaWYgKE1ldGVvci5pc0RldmVsb3BtZW50KSB7XG4gICAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZXg7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gc3RlZWRvc0NvcmUuaW5pdCgpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXggPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGV4KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSBjYXRjaCAoZXJyb3IpIHtcbiAgZSA9IGVycm9yO1xuICBjb25zb2xlLmxvZyhlKTtcbn1cbiIsIkNyZWF0b3IuZGVwcyA9IHtcblx0YXBwOiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XG5cdG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxufTtcblxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XG5cdEFwcHM6IHt9LFxuXHRPYmplY3RzOiB7fVxufVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7ZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7b3B0aW9uc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7Y3JlYXRlRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXG5cbiMgQ3JlYXRvci5maWJlckxvYWRPYmplY3RzIOS+m3N0ZWVkb3MtY2xp6aG555uu5L2/55SoXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0RmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxuXHRDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxuXHRcdEZpYmVyKCgpLT5cblx0XHRcdENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSlcblx0XHQpLnJ1bigpXG5cbkNyZWF0b3IubG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IG9iai5uYW1lXG5cblx0aWYgIW9iai5saXN0X3ZpZXdzXG5cdFx0b2JqLmxpc3Rfdmlld3MgPSB7fVxuXG5cdGlmIG9iai5zcGFjZVxuXHRcdG9iamVjdF9uYW1lID0gJ2NfJyArIG9iai5zcGFjZSArICdfJyArIG9iai5uYW1lXG5cblx0Q3JlYXRvci5jb252ZXJ0T2JqZWN0KG9iailcblx0bmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XG5cblx0Q3JlYXRvci5pbml0VHJpZ2dlcnMob2JqZWN0X25hbWUpXG5cdENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSlcblx0cmV0dXJuIG9ialxuXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSAob2JqZWN0KSAtPlxuXHRpZiBvYmplY3Quc3BhY2Vcblx0XHRyZXR1cm4gXCJjXyN7b2JqZWN0LnNwYWNlfV8je29iamVjdC5uYW1lfVwiXG5cdHJldHVybiBvYmplY3QubmFtZVxuXG5DcmVhdG9yLmdldE9iamVjdCA9IChvYmplY3RfbmFtZSwgc3BhY2VfaWQpLT5cblx0aWYgXy5pc0FycmF5KG9iamVjdF9uYW1lKVxuXHRcdHJldHVybiA7XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdENyZWF0b3IuZGVwcz8ub2JqZWN0Py5kZXBlbmQoKVxuXHRpZiAhb2JqZWN0X25hbWUgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRpZiAhc3BhY2VfaWQgJiYgb2JqZWN0X25hbWVcblx0XHRpZiBNZXRlb3IuaXNDbGllbnQgJiYgIW9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2NfJylcblx0XHRcdHNwYWNlX2lkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cblx0aWYgb2JqZWN0X25hbWVcblx0XHRpZiBzcGFjZV9pZFxuXHRcdFx0b2JqID0gQ3JlYXRvci5vYmplY3RzQnlOYW1lW1wiY18je3NwYWNlX2lkfV8je29iamVjdF9uYW1lfVwiXVxuXHRcdFx0aWYgb2JqXG5cdFx0XHRcdHJldHVybiBvYmpcblxuXHRcdG9iaiA9IF8uZmluZCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvKS0+XG5cdFx0XHRcdHJldHVybiBvLl9jb2xsZWN0aW9uX25hbWUgPT0gb2JqZWN0X25hbWVcblx0XHRpZiBvYmpcblx0XHRcdHJldHVybiBvYmpcblxuXHRcdHJldHVybiBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IuZ2V0T2JqZWN0QnlJZCA9IChvYmplY3RfaWQpLT5cblx0cmV0dXJuIF8uZmluZFdoZXJlKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwge19pZDogb2JqZWN0X2lkfSlcblxuQ3JlYXRvci5yZW1vdmVPYmplY3QgPSAob2JqZWN0X25hbWUpLT5cblx0Y29uc29sZS5sb2coXCJyZW1vdmVPYmplY3RcIiwgb2JqZWN0X25hbWUpXG5cdGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXG5cdGRlbGV0ZSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCktPlxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0aWYgb2JqZWN0X25hbWVcblx0XHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk/Ll9jb2xsZWN0aW9uX25hbWVdXG5cbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSktPlxuXHRkZWxldGUgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cblx0c3BhY2UgPSBDcmVhdG9yLmdldE9iamVjdChcInNwYWNlc1wiKT8uZGI/LmZpbmRPbmUoc3BhY2VJZClcblx0aWYgc3BhY2U/LmFkbWluc1xuXHRcdHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDBcblxuXG5DcmVhdG9yLmV2YWx1YXRlRm9ybXVsYSA9IChmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucyktPlxuXG5cdGlmICFfLmlzU3RyaW5nKGZvcm11bGFyKVxuXHRcdHJldHVybiBmb3JtdWxhclxuXG5cdGlmIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKVxuXHRcdHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucylcblxuXHRyZXR1cm4gZm9ybXVsYXJcblxuQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnMgPSAoZmlsdGVycywgY29udGV4dCktPlxuXHRzZWxlY3RvciA9IHt9XG5cdF8uZWFjaCBmaWx0ZXJzLCAoZmlsdGVyKS0+XG5cdFx0aWYgZmlsdGVyPy5sZW5ndGggPT0gM1xuXHRcdFx0bmFtZSA9IGZpbHRlclswXVxuXHRcdFx0YWN0aW9uID0gZmlsdGVyWzFdXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgY29udGV4dClcblx0XHRcdHNlbGVjdG9yW25hbWVdID0ge31cblx0XHRcdHNlbGVjdG9yW25hbWVdW2FjdGlvbl0gPSB2YWx1ZVxuXHRjb25zb2xlLmxvZyhcImV2YWx1YXRlRmlsdGVycy0tPnNlbGVjdG9yXCIsIHNlbGVjdG9yKVxuXHRyZXR1cm4gc2VsZWN0b3JcblxuQ3JlYXRvci5pc0NvbW1vblNwYWNlID0gKHNwYWNlSWQpIC0+XG5cdHJldHVybiBzcGFjZUlkID09ICdjb21tb24nXG5cbiMjI1xuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXG5cdGlkc++8ml9pZOmbhuWQiFxuXHRpZF9rZXk6IOm7mOiupOS4ul9pZFxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXG4jIyNcbkNyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzID0gKGRvY3MsIGlkcywgaWRfa2V5LCBoaXRfZmlyc3QpLT5cblxuXHRpZiAhaWRfa2V5XG5cdFx0aWRfa2V5ID0gXCJfaWRcIlxuXG5cdGlmIGhpdF9maXJzdFxuXG5cdFx0I+eUseS6juS4jeiDveS9v+eUqF8uZmluZEluZGV45Ye95pWw77yM5Zug5q2k5q2k5aSE5YWI5bCG5a+56LGh5pWw57uE6L2s5Li65pmu6YCa5pWw57uE57G75Z6L77yM5Zyo6I635Y+W5YW2aW5kZXhcblx0XHR2YWx1ZXMgPSBkb2NzLmdldFByb3BlcnR5KGlkX2tleSlcblxuXHRcdHJldHVyblx0Xy5zb3J0QnkgZG9jcywgKGRvYyktPlxuXHRcdFx0XHRcdF9pbmRleCA9IGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKVxuXHRcdFx0XHRcdGlmIF9pbmRleCA+IC0xXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2luZGV4XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIGlkcy5sZW5ndGggKyBfLmluZGV4T2YodmFsdWVzLCBkb2NbaWRfa2V5XSlcblx0ZWxzZVxuXHRcdHJldHVyblx0Xy5zb3J0QnkgZG9jcywgKGRvYyktPlxuXHRcdFx0cmV0dXJuIGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKVxuXG4jIyNcblx05oyJ55So5oi35omA5bGe5pys5Zyw5YyW6K+t6KiA6L+b6KGM5o6S5bqP77yM5pSv5oyB5Lit5paH44CB5pWw5YC844CB5pel5pyf562J5a2X5q615o6S5bqPXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xuIyMjXG5DcmVhdG9yLnNvcnRpbmdNZXRob2QgPSAodmFsdWUxLCB2YWx1ZTIpIC0+XG5cdGlmIHRoaXMua2V5XG5cdFx0dmFsdWUxID0gdmFsdWUxW3RoaXMua2V5XVxuXHRcdHZhbHVlMiA9IHZhbHVlMlt0aGlzLmtleV1cblx0aWYgdmFsdWUxIGluc3RhbmNlb2YgRGF0ZVxuXHRcdHZhbHVlMSA9IHZhbHVlMS5nZXRUaW1lKClcblx0aWYgdmFsdWUyIGluc3RhbmNlb2YgRGF0ZVxuXHRcdHZhbHVlMiA9IHZhbHVlMi5nZXRUaW1lKClcblx0aWYgdHlwZW9mIHZhbHVlMSBpcyBcIm51bWJlclwiIGFuZCB0eXBlb2YgdmFsdWUyIGlzIFwibnVtYmVyXCJcblx0XHRyZXR1cm4gdmFsdWUxIC0gdmFsdWUyXG5cdCMgSGFuZGxpbmcgbnVsbCB2YWx1ZXNcblx0aXNWYWx1ZTFFbXB0eSA9IHZhbHVlMSA9PSBudWxsIG9yIHZhbHVlMSA9PSB1bmRlZmluZWRcblx0aXNWYWx1ZTJFbXB0eSA9IHZhbHVlMiA9PSBudWxsIG9yIHZhbHVlMiA9PSB1bmRlZmluZWRcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgIWlzVmFsdWUyRW1wdHlcblx0XHRyZXR1cm4gLTFcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgaXNWYWx1ZTJFbXB0eVxuXHRcdHJldHVybiAwXG5cdGlmICFpc1ZhbHVlMUVtcHR5IGFuZCBpc1ZhbHVlMkVtcHR5XG5cdFx0cmV0dXJuIDFcblx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxuXHRyZXR1cm4gdmFsdWUxLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZSB2YWx1ZTIudG9TdHJpbmcoKSwgbG9jYWxlXG5cblxuIyDor6Xlh73mlbDlj6rlnKjliJ3lp4vljJZPYmplY3Tml7bvvIzmiornm7jlhbPlr7nosaHnmoTorqHnrpfnu5Pmnpzkv53lrZjliLBPYmplY3TnmoRyZWxhdGVkX29iamVjdHPlsZ7mgKfkuK3vvIzlkI7nu63lj6/ku6Xnm7TmjqXku45yZWxhdGVkX29iamVjdHPlsZ7mgKfkuK3lj5blvpforqHnrpfnu5PmnpzogIzkuI3nlKjlho3mrKHosIPnlKjor6Xlh73mlbDmnaXorqHnrpdcbkNyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMgPSAob2JqZWN0X25hbWUpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRyZWxhdGVkX29iamVjdHMgPSBbXVxuXHQjIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0IyDlm6BDcmVhdG9yLmdldE9iamVjdOWHveaVsOWGhemDqOimgeiwg+eUqOivpeWHveaVsO+8jOaJgOS7pei/memHjOS4jeWPr+S7peiwg+eUqENyZWF0b3IuZ2V0T2JqZWN05Y+W5a+56LGh77yM5Y+q6IO96LCD55SoQ3JlYXRvci5PYmplY3Rz5p2l5Y+W5a+56LGhXG5cdF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXG5cdGlmICFfb2JqZWN0XG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xuXG5cdGlmIF9vYmplY3QuZW5hYmxlX2ZpbGVzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiY21zX2ZpbGVzXCIsIGZvcmVpZ25fa2V5OiBcInBhcmVudFwifVxuXG5cdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSktPlxuXHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cblx0XHRcdGlmIHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lXG5cdFx0XHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJvYmplY3RfZmllbGRzXCJcblx0XHRcdFx0XHQjVE9ETyDlvoXnm7jlhbPliJfooajmlK/mjIHmjpLluo/lkI7vvIzliKDpmaTmraTliKTmlq1cblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdHMuc3BsaWNlKDAsIDAsIHtvYmplY3RfbmFtZTpyZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lfSlcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpyZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lfVxuXG5cdGlmIF9vYmplY3QuZW5hYmxlX3Rhc2tzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwidGFza3NcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9ub3Rlc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcIm5vdGVzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfZXZlbnRzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiZXZlbnRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfaW5zdGFuY2VzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiaW5zdGFuY2VzXCIsIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIn1cblx0aWYgX29iamVjdC5lbmFibGVfYXBwcm92YWxzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiYXBwcm92YWxzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0I3JlY29yZCDor6bnu4bkuIvnmoRhdWRpdF9yZWNvcmRz5LuFbW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWPr+ingVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpXG5cdFx0aWYgX29iamVjdC5lbmFibGVfYXVkaXQgJiYgcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImF1ZGl0X3JlY29yZHNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXG5cdHJldHVybiByZWxhdGVkX29iamVjdHNcblxuQ3JlYXRvci5nZXRVc2VyQ29udGV4dCA9ICh1c2VySWQsIHNwYWNlSWQsIGlzVW5TYWZlTW9kZSktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRyZXR1cm4gQ3JlYXRvci5VU0VSX0NPTlRFWFRcblx0ZWxzZVxuXHRcdGlmICEodXNlcklkIGFuZCBzcGFjZUlkKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwidGhlIHBhcmFtcyB1c2VySWQgYW5kIHNwYWNlSWQgaXMgcmVxdWlyZWQgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFVzZXJDb250ZXh0XCJcblx0XHRcdHJldHVybiBudWxsXG5cdFx0c3VGaWVsZHMgPSB7bmFtZTogMSwgbW9iaWxlOiAxLCBwb3NpdGlvbjogMSwgZW1haWw6IDEsIGNvbXBhbnk6IDEsIG9yZ2FuaXphdGlvbjogMSwgc3BhY2U6IDEsIGNvbXBhbnlfaWQ6IDEsIGNvbXBhbnlfaWRzOiAxfVxuXHRcdCMgY2hlY2sgaWYgdXNlciBpbiB0aGUgc3BhY2Vcblx0XHRzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczogc3VGaWVsZHN9KVxuXHRcdGlmICFzdVxuXHRcdFx0c3BhY2VJZCA9IG51bGxcblxuXHRcdCMgaWYgc3BhY2VJZCBub3QgZXhpc3RzLCBnZXQgdGhlIGZpcnN0IG9uZS5cblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0aWYgaXNVblNhZmVNb2RlXG5cdFx0XHRcdHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe3VzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHN1RmllbGRzfSlcblx0XHRcdFx0aWYgIXN1XG5cdFx0XHRcdFx0cmV0dXJuIG51bGxcblx0XHRcdFx0c3BhY2VJZCA9IHN1LnNwYWNlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBudWxsXG5cblx0XHRVU0VSX0NPTlRFWFQgPSB7fVxuXHRcdFVTRVJfQ09OVEVYVC51c2VySWQgPSB1c2VySWRcblx0XHRVU0VSX0NPTlRFWFQuc3BhY2VJZCA9IHNwYWNlSWRcblx0XHRVU0VSX0NPTlRFWFQudXNlciA9IHtcblx0XHRcdF9pZDogdXNlcklkXG5cdFx0XHRuYW1lOiBzdS5uYW1lLFxuXHRcdFx0bW9iaWxlOiBzdS5tb2JpbGUsXG5cdFx0XHRwb3NpdGlvbjogc3UucG9zaXRpb24sXG5cdFx0XHRlbWFpbDogc3UuZW1haWxcblx0XHRcdGNvbXBhbnk6IHN1LmNvbXBhbnlcblx0XHRcdGNvbXBhbnlfaWQ6IHN1LmNvbXBhbnlfaWRcblx0XHRcdGNvbXBhbnlfaWRzOiBzdS5jb21wYW55X2lkc1xuXHRcdH1cblx0XHRzcGFjZV91c2VyX29yZyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9yZ2FuaXphdGlvbnNcIik/LmZpbmRPbmUoc3Uub3JnYW5pemF0aW9uKVxuXHRcdGlmIHNwYWNlX3VzZXJfb3JnXG5cdFx0XHRVU0VSX0NPTlRFWFQudXNlci5vcmdhbml6YXRpb24gPSB7XG5cdFx0XHRcdF9pZDogc3BhY2VfdXNlcl9vcmcuX2lkLFxuXHRcdFx0XHRuYW1lOiBzcGFjZV91c2VyX29yZy5uYW1lLFxuXHRcdFx0XHRmdWxsbmFtZTogc3BhY2VfdXNlcl9vcmcuZnVsbG5hbWVcblx0XHRcdH1cblx0XHRyZXR1cm4gVVNFUl9DT05URVhUXG5cbkNyZWF0b3IuZ2V0UmVsYXRpdmVVcmwgPSAodXJsKS0+XG5cdGlmIHVybFxuXHRcdCMgdXJs5byA5aS05rKh5pyJXCIvXCLvvIzpnIDopoHmt7vliqBcIi9cIlxuXHRcdGlmICEvXlxcLy8udGVzdCh1cmwpXG5cdFx0XHR1cmwgPSBcIi9cIiArIHVybFxuXHRcdHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYICsgdXJsXG5cdGVsc2Vcblx0XHRyZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWFxuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWQgPSAodXNlcklkLCBzcGFjZUlkKS0+XG5cdHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKClcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0c3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKVxuXHRlbHNlXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJylcblx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtjb21wYW55X2lkOjF9fSlcblx0cmV0dXJuIHN1LmNvbXBhbnlfaWRcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyA9ICh1c2VySWQsIHNwYWNlSWQpLT5cblx0dXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpXG5cdGVsc2Vcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKVxuXHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge2NvbXBhbnlfaWRzOjF9fSlcblx0cmV0dXJuIHN1Py5jb21wYW55X2lkc1xuXG5DcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyA9IChwbyktPlxuXHRpZiBwby5hbGxvd0NyZWF0ZVxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8uYWxsb3dFZGl0XG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0RlbGV0ZVxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLnZpZXdBbGxSZWNvcmRzXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcblx0XHRwby5hbGxvd0RlbGV0ZSA9IHRydWVcblx0XHRwby52aWV3QWxsUmVjb3JkcyA9IHRydWVcblx0aWYgcG8udmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0cG8uYWxsb3dEZWxldGUgPSB0cnVlXG5cdFx0cG8udmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZVxuXHRyZXR1cm4gcG9cblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdGlmIHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVJcblx0XHRDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyID0gcHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUlxuXHRlbHNlXG5cdFx0cGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXHRcdENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwYXRoLnJlc29sdmUocGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwgJy4uLy4uLy4uL2NmcycpKVxuIiwidmFyIEZpYmVyLCBwYXRoO1xuXG5DcmVhdG9yLmRlcHMgPSB7XG4gIGFwcDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeSxcbiAgb2JqZWN0OiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XG59O1xuXG5DcmVhdG9yLl9URU1QTEFURSA9IHtcbiAgQXBwczoge30sXG4gIE9iamVjdHM6IHt9XG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIGZpbHRlcnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xuICBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgb3B0aW9uc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG4gIHJldHVybiBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgY3JlYXRlRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbn0pO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIEZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG4gIENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyA9IGZ1bmN0aW9uKG9iaiwgb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5sb2FkT2JqZWN0cyhvYmosIG9iamVjdF9uYW1lKTtcbiAgICB9KS5ydW4oKTtcbiAgfTtcbn1cblxuQ3JlYXRvci5sb2FkT2JqZWN0cyA9IGZ1bmN0aW9uKG9iaiwgb2JqZWN0X25hbWUpIHtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gb2JqLm5hbWU7XG4gIH1cbiAgaWYgKCFvYmoubGlzdF92aWV3cykge1xuICAgIG9iai5saXN0X3ZpZXdzID0ge307XG4gIH1cbiAgaWYgKG9iai5zcGFjZSkge1xuICAgIG9iamVjdF9uYW1lID0gJ2NfJyArIG9iai5zcGFjZSArICdfJyArIG9iai5uYW1lO1xuICB9XG4gIENyZWF0b3IuY29udmVydE9iamVjdChvYmopO1xuICBuZXcgQ3JlYXRvci5PYmplY3Qob2JqKTtcbiAgQ3JlYXRvci5pbml0VHJpZ2dlcnMob2JqZWN0X25hbWUpO1xuICBDcmVhdG9yLmluaXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpO1xuICByZXR1cm4gb2JqO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3ROYW1lID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3Quc3BhY2UpIHtcbiAgICByZXR1cm4gXCJjX1wiICsgb2JqZWN0LnNwYWNlICsgXCJfXCIgKyBvYmplY3QubmFtZTtcbiAgfVxuICByZXR1cm4gb2JqZWN0Lm5hbWU7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCkge1xuICB2YXIgb2JqLCByZWYsIHJlZjE7XG4gIGlmIChfLmlzQXJyYXkob2JqZWN0X25hbWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoKHJlZiA9IENyZWF0b3IuZGVwcykgIT0gbnVsbCkge1xuICAgICAgaWYgKChyZWYxID0gcmVmLm9iamVjdCkgIT0gbnVsbCkge1xuICAgICAgICByZWYxLmRlcGVuZCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAoIXNwYWNlX2lkICYmIG9iamVjdF9uYW1lKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiAhb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY18nKSkge1xuICAgICAgc3BhY2VfaWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICB9XG4gIGlmIChvYmplY3RfbmFtZSkge1xuICAgIGlmIChzcGFjZV9pZCkge1xuICAgICAgb2JqID0gQ3JlYXRvci5vYmplY3RzQnlOYW1lW1wiY19cIiArIHNwYWNlX2lkICsgXCJfXCIgKyBvYmplY3RfbmFtZV07XG4gICAgICBpZiAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG4gICAgfVxuICAgIG9iaiA9IF8uZmluZChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLl9jb2xsZWN0aW9uX25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgIH0pO1xuICAgIGlmIChvYmopIHtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEJ5SWQgPSBmdW5jdGlvbihvYmplY3RfaWQpIHtcbiAgcmV0dXJuIF8uZmluZFdoZXJlKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwge1xuICAgIF9pZDogb2JqZWN0X2lkXG4gIH0pO1xufTtcblxuQ3JlYXRvci5yZW1vdmVPYmplY3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICBjb25zb2xlLmxvZyhcInJlbW92ZU9iamVjdFwiLCBvYmplY3RfbmFtZSk7XG4gIGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICByZXR1cm4gZGVsZXRlIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV07XG59O1xuXG5DcmVhdG9yLmdldENvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zWyhyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCkpICE9IG51bGwgPyByZWYuX2NvbGxlY3Rpb25fbmFtZSA6IHZvaWQgMF07XG4gIH1cbn07XG5cbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHJldHVybiBkZWxldGUgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV07XG59O1xuXG5DcmVhdG9yLmlzU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgcmVmLCByZWYxLCBzcGFjZTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgc3BhY2UgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3QoXCJzcGFjZXNcIikpICE9IG51bGwgPyAocmVmMSA9IHJlZi5kYikgIT0gbnVsbCA/IHJlZjEuZmluZE9uZShzcGFjZUlkKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgaWYgKHNwYWNlICE9IG51bGwgPyBzcGFjZS5hZG1pbnMgOiB2b2lkIDApIHtcbiAgICByZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKSA+PSAwO1xuICB9XG59O1xuXG5DcmVhdG9yLmV2YWx1YXRlRm9ybXVsYSA9IGZ1bmN0aW9uKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gIGlmICghXy5pc1N0cmluZyhmb3JtdWxhcikpIHtcbiAgICByZXR1cm4gZm9ybXVsYXI7XG4gIH1cbiAgaWYgKENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKSkge1xuICAgIHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbiAgcmV0dXJuIGZvcm11bGFyO1xufTtcblxuQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnMgPSBmdW5jdGlvbihmaWx0ZXJzLCBjb250ZXh0KSB7XG4gIHZhciBzZWxlY3RvcjtcbiAgc2VsZWN0b3IgPSB7fTtcbiAgXy5lYWNoKGZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlcikge1xuICAgIHZhciBhY3Rpb24sIG5hbWUsIHZhbHVlO1xuICAgIGlmICgoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIubGVuZ3RoIDogdm9pZCAwKSA9PT0gMykge1xuICAgICAgbmFtZSA9IGZpbHRlclswXTtcbiAgICAgIGFjdGlvbiA9IGZpbHRlclsxXTtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBjb250ZXh0KTtcbiAgICAgIHNlbGVjdG9yW25hbWVdID0ge307XG4gICAgICByZXR1cm4gc2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlO1xuICAgIH1cbiAgfSk7XG4gIGNvbnNvbGUubG9nKFwiZXZhbHVhdGVGaWx0ZXJzLS0+c2VsZWN0b3JcIiwgc2VsZWN0b3IpO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5DcmVhdG9yLmlzQ29tbW9uU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHJldHVybiBzcGFjZUlkID09PSAnY29tbW9uJztcbn07XG5cblxuLypcblx0ZG9jc++8muW+heaOkuW6j+eahOaWh+aho+aVsOe7hFxuXHRpZHPvvJpfaWTpm4blkIhcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcblx0cmV0dXJuIOaMieeFp2lkc+eahOmhuuW6j+i/lOWbnuaWsOeahOaWh+aho+mbhuWQiFxuICovXG5cbkNyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzID0gZnVuY3Rpb24oZG9jcywgaWRzLCBpZF9rZXksIGhpdF9maXJzdCkge1xuICB2YXIgdmFsdWVzO1xuICBpZiAoIWlkX2tleSkge1xuICAgIGlkX2tleSA9IFwiX2lkXCI7XG4gIH1cbiAgaWYgKGhpdF9maXJzdCkge1xuICAgIHZhbHVlcyA9IGRvY3MuZ2V0UHJvcGVydHkoaWRfa2V5KTtcbiAgICByZXR1cm4gXy5zb3J0QnkoZG9jcywgZnVuY3Rpb24oZG9jKSB7XG4gICAgICB2YXIgX2luZGV4O1xuICAgICAgX2luZGV4ID0gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pO1xuICAgICAgaWYgKF9pbmRleCA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfaW5kZXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaWRzLmxlbmd0aCArIF8uaW5kZXhPZih2YWx1ZXMsIGRvY1tpZF9rZXldKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXy5zb3J0QnkoZG9jcywgZnVuY3Rpb24oZG9jKSB7XG4gICAgICByZXR1cm4gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5cbi8qXG5cdOaMieeUqOaIt+aJgOWxnuacrOWcsOWMluivreiogOi/m+ihjOaOkuW6j++8jOaUr+aMgeS4reaWh+OAgeaVsOWAvOOAgeaXpeacn+etieWtl+auteaOkuW6j1xuXHTlr7nkuo5PYmplY3TnsbvlnovvvIzlpoLmnpzmj5DkvpvkvZznlKjln5/kuK1rZXnlsZ7mgKfvvIzliJnlj5blgLzkuLp2YWx1ZVtrZXld6L+b6KGM5o6S5bqP5q+U6L6D77yM5Y+N5LmL5pW05LiqT2JqZWN0LnRvU3RyaW5nKCnlkI7mjpLluo/mr5TovoNcbiAqL1xuXG5DcmVhdG9yLnNvcnRpbmdNZXRob2QgPSBmdW5jdGlvbih2YWx1ZTEsIHZhbHVlMikge1xuICB2YXIgaXNWYWx1ZTFFbXB0eSwgaXNWYWx1ZTJFbXB0eSwgbG9jYWxlO1xuICBpZiAodGhpcy5rZXkpIHtcbiAgICB2YWx1ZTEgPSB2YWx1ZTFbdGhpcy5rZXldO1xuICAgIHZhbHVlMiA9IHZhbHVlMlt0aGlzLmtleV07XG4gIH1cbiAgaWYgKHZhbHVlMSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICB2YWx1ZTEgPSB2YWx1ZTEuZ2V0VGltZSgpO1xuICB9XG4gIGlmICh2YWx1ZTIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgdmFsdWUyID0gdmFsdWUyLmdldFRpbWUoKTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlMSA9PT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgdmFsdWUyID09PSBcIm51bWJlclwiKSB7XG4gICAgcmV0dXJuIHZhbHVlMSAtIHZhbHVlMjtcbiAgfVxuICBpc1ZhbHVlMUVtcHR5ID0gdmFsdWUxID09PSBudWxsIHx8IHZhbHVlMSA9PT0gdm9pZCAwO1xuICBpc1ZhbHVlMkVtcHR5ID0gdmFsdWUyID09PSBudWxsIHx8IHZhbHVlMiA9PT0gdm9pZCAwO1xuICBpZiAoaXNWYWx1ZTFFbXB0eSAmJiAhaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBpZiAoaXNWYWx1ZTFFbXB0eSAmJiBpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgaWYgKCFpc1ZhbHVlMUVtcHR5ICYmIGlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpO1xuICByZXR1cm4gdmFsdWUxLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZSh2YWx1ZTIudG9TdHJpbmcoKSwgbG9jYWxlKTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgcGVybWlzc2lvbnMsIHJlbGF0ZWRfb2JqZWN0cztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gIH1cbiAgcmVsYXRlZF9vYmplY3RzID0gW107XG4gIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICBpZiAoIV9vYmplY3QpIHtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9maWxlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImNtc19maWxlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicGFyZW50XCJcbiAgICB9KTtcbiAgfVxuICBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfLmVhY2gocmVsYXRlZF9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgIGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSkge1xuICAgICAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJvYmplY3RfZmllbGRzXCIpIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzLnNwbGljZSgwLCAwLCB7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIGlmIChfb2JqZWN0LmVuYWJsZV90YXNrcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcInRhc2tzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfbm90ZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJub3Rlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2V2ZW50cykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImV2ZW50c1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2luc3RhbmNlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2FwcHJvdmFscykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImFwcHJvdmFsc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSk7XG4gICAgaWYgKF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIChwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMCkpIHtcbiAgICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiYXVkaXRfcmVjb3Jkc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29udGV4dCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgaXNVblNhZmVNb2RlKSB7XG4gIHZhciBVU0VSX0NPTlRFWFQsIHJlZiwgc3BhY2VfdXNlcl9vcmcsIHN1LCBzdUZpZWxkcztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHJldHVybiBDcmVhdG9yLlVTRVJfQ09OVEVYVDtcbiAgfSBlbHNlIHtcbiAgICBpZiAoISh1c2VySWQgJiYgc3BhY2VJZCkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcInRoZSBwYXJhbXMgdXNlcklkIGFuZCBzcGFjZUlkIGlzIHJlcXVpcmVkIGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRVc2VyQ29udGV4dFwiKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBzdUZpZWxkcyA9IHtcbiAgICAgIG5hbWU6IDEsXG4gICAgICBtb2JpbGU6IDEsXG4gICAgICBwb3NpdGlvbjogMSxcbiAgICAgIGVtYWlsOiAxLFxuICAgICAgY29tcGFueTogMSxcbiAgICAgIG9yZ2FuaXphdGlvbjogMSxcbiAgICAgIHNwYWNlOiAxLFxuICAgICAgY29tcGFueV9pZDogMSxcbiAgICAgIGNvbXBhbnlfaWRzOiAxXG4gICAgfTtcbiAgICBzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgdXNlcjogdXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiBzdUZpZWxkc1xuICAgIH0pO1xuICAgIGlmICghc3UpIHtcbiAgICAgIHNwYWNlSWQgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIGlmIChpc1VuU2FmZU1vZGUpIHtcbiAgICAgICAgc3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHN1RmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXN1KSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3BhY2VJZCA9IHN1LnNwYWNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIFVTRVJfQ09OVEVYVCA9IHt9O1xuICAgIFVTRVJfQ09OVEVYVC51c2VySWQgPSB1c2VySWQ7XG4gICAgVVNFUl9DT05URVhULnNwYWNlSWQgPSBzcGFjZUlkO1xuICAgIFVTRVJfQ09OVEVYVC51c2VyID0ge1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBuYW1lOiBzdS5uYW1lLFxuICAgICAgbW9iaWxlOiBzdS5tb2JpbGUsXG4gICAgICBwb3NpdGlvbjogc3UucG9zaXRpb24sXG4gICAgICBlbWFpbDogc3UuZW1haWwsXG4gICAgICBjb21wYW55OiBzdS5jb21wYW55LFxuICAgICAgY29tcGFueV9pZDogc3UuY29tcGFueV9pZCxcbiAgICAgIGNvbXBhbnlfaWRzOiBzdS5jb21wYW55X2lkc1xuICAgIH07XG4gICAgc3BhY2VfdXNlcl9vcmcgPSAocmVmID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib3JnYW5pemF0aW9uc1wiKSkgIT0gbnVsbCA/IHJlZi5maW5kT25lKHN1Lm9yZ2FuaXphdGlvbikgOiB2b2lkIDA7XG4gICAgaWYgKHNwYWNlX3VzZXJfb3JnKSB7XG4gICAgICBVU0VSX0NPTlRFWFQudXNlci5vcmdhbml6YXRpb24gPSB7XG4gICAgICAgIF9pZDogc3BhY2VfdXNlcl9vcmcuX2lkLFxuICAgICAgICBuYW1lOiBzcGFjZV91c2VyX29yZy5uYW1lLFxuICAgICAgICBmdWxsbmFtZTogc3BhY2VfdXNlcl9vcmcuZnVsbG5hbWVcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBVU0VSX0NPTlRFWFQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRpdmVVcmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgaWYgKHVybCkge1xuICAgIGlmICghL15cXC8vLnRlc3QodXJsKSkge1xuICAgICAgdXJsID0gXCIvXCIgKyB1cmw7XG4gICAgfVxuICAgIHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYICsgdXJsO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWQgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIHN1O1xuICB1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJyk7XG4gICAgfVxuICB9XG4gIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjb21wYW55X2lkOiAxXG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHN1LmNvbXBhbnlfaWQ7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWRzID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBzdTtcbiAgdXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJyk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpO1xuICAgIH1cbiAgfVxuICBzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICB1c2VyOiB1c2VySWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY29tcGFueV9pZHM6IDFcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3UgIT0gbnVsbCA/IHN1LmNvbXBhbnlfaWRzIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgPSBmdW5jdGlvbihwbykge1xuICBpZiAocG8uYWxsb3dDcmVhdGUpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0VkaXQpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0RlbGV0ZSkge1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0FsbFJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93RGVsZXRlID0gdHJ1ZTtcbiAgICBwby52aWV3QWxsUmVjb3JkcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93RGVsZXRlID0gdHJ1ZTtcbiAgICBwby52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlO1xuICB9XG4gIHJldHVybiBwbztcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgaWYgKHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVIpIHtcbiAgICBDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyID0gcHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUjtcbiAgfSBlbHNlIHtcbiAgICBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICAgIENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwYXRoLnJlc29sdmUocGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwgJy4uLy4uLy4uL2NmcycpKTtcbiAgfVxufVxuIiwiTWV0ZW9yLm1ldGhvZHNcblx0IyDnlKjmiLfojrflj5Zsb29rdXAg44CBbWFzdGVyX2RldGFpbOexu+Wei+Wtl+auteeahOmAiemhueWAvFxuXHRcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjogKG9wdGlvbnMpLT5cblx0XHRpZiBvcHRpb25zPy5wYXJhbXM/LnJlZmVyZW5jZV90b1xuXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvcHRpb25zLnBhcmFtcy5yZWZlcmVuY2VfdG8sIG9wdGlvbnMucGFyYW1zLnNwYWNlKVxuXG5cdFx0XHRuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWVxuXG5cdFx0XHRxdWVyeSA9IHt9XG5cdFx0XHRpZiBvcHRpb25zLnBhcmFtcy5zcGFjZVxuXHRcdFx0XHRxdWVyeS5zcGFjZSA9IG9wdGlvbnMucGFyYW1zLnNwYWNlXG5cblx0XHRcdFx0c29ydCA9IG9wdGlvbnM/LnNvcnRcblxuXHRcdFx0XHRzZWxlY3RlZCA9IG9wdGlvbnM/LnNlbGVjdGVkIHx8IFtdXG5cblx0XHRcdFx0b3B0aW9uc19saW1pdCA9IG9wdGlvbnM/Lm9wdGlvbnNfbGltaXQgfHwgMTBcblxuXHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRzZWFyY2hUZXh0UXVlcnkgPSB7fVxuXHRcdFx0XHRcdHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7JHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHR9XG5cblx0XHRcdFx0aWYgb3B0aW9ucz8udmFsdWVzPy5sZW5ndGhcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRcdHF1ZXJ5LiRvciA9IFt7X2lkOiB7JGluOiBvcHRpb25zLnZhbHVlc319LCBzZWFyY2hUZXh0UXVlcnldXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cXVlcnkuJG9yID0gW3tfaWQ6IHskaW46IG9wdGlvbnMudmFsdWVzfX1dXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRcdF8uZXh0ZW5kKHF1ZXJ5LCBzZWFyY2hUZXh0UXVlcnkpXG5cdFx0XHRcdFx0cXVlcnkuX2lkID0geyRuaW46IHNlbGVjdGVkfVxuXG5cdFx0XHRcdGNvbGxlY3Rpb24gPSBvYmplY3QuZGJcblxuXHRcdFx0XHRpZiBvcHRpb25zLmZpbHRlclF1ZXJ5XG5cdFx0XHRcdFx0Xy5leHRlbmQgcXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnlcblxuXHRcdFx0XHRxdWVyeV9vcHRpb25zID0ge2xpbWl0OiBvcHRpb25zX2xpbWl0fVxuXG5cdFx0XHRcdGlmIHNvcnQgJiYgXy5pc09iamVjdChzb3J0KVxuXHRcdFx0XHRcdHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnRcblxuXHRcdFx0XHRpZiBjb2xsZWN0aW9uXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRyZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpXG5cdFx0XHRcdFx0XHRyZXN1bHRzID0gW11cblx0XHRcdFx0XHRcdF8uZWFjaCByZWNvcmRzLCAocmVjb3JkKS0+XG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaFxuXHRcdFx0XHRcdFx0XHRcdGxhYmVsOiByZWNvcmRbbmFtZV9maWVsZF9rZXldXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHJlY29yZC5faWRcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzXG5cdFx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIGUubWVzc2FnZSArIFwiLS0+XCIgKyBKU09OLnN0cmluZ2lmeShvcHRpb25zKVxuXHRcdHJldHVybiBbXSAiLCJNZXRlb3IubWV0aG9kcyh7XG4gIFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGUsIG5hbWVfZmllbGRfa2V5LCBvYmplY3QsIG9wdGlvbnNfbGltaXQsIHF1ZXJ5LCBxdWVyeV9vcHRpb25zLCByZWNvcmRzLCByZWYsIHJlZjEsIHJlc3VsdHMsIHNlYXJjaFRleHRRdWVyeSwgc2VsZWN0ZWQsIHNvcnQ7XG4gICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYgPSBvcHRpb25zLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5yZWZlcmVuY2VfdG8gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9wdGlvbnMucGFyYW1zLnJlZmVyZW5jZV90bywgb3B0aW9ucy5wYXJhbXMuc3BhY2UpO1xuICAgICAgbmFtZV9maWVsZF9rZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVk7XG4gICAgICBxdWVyeSA9IHt9O1xuICAgICAgaWYgKG9wdGlvbnMucGFyYW1zLnNwYWNlKSB7XG4gICAgICAgIHF1ZXJ5LnNwYWNlID0gb3B0aW9ucy5wYXJhbXMuc3BhY2U7XG4gICAgICAgIHNvcnQgPSBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNvcnQgOiB2b2lkIDA7XG4gICAgICAgIHNlbGVjdGVkID0gKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc2VsZWN0ZWQgOiB2b2lkIDApIHx8IFtdO1xuICAgICAgICBvcHRpb25zX2xpbWl0ID0gKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMub3B0aW9uc19saW1pdCA6IHZvaWQgMCkgfHwgMTA7XG4gICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICBzZWFyY2hUZXh0UXVlcnkgPSB7fTtcbiAgICAgICAgICBzZWFyY2hUZXh0UXVlcnlbbmFtZV9maWVsZF9rZXldID0ge1xuICAgICAgICAgICAgJHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zICE9IG51bGwgPyAocmVmMSA9IG9wdGlvbnMudmFsdWVzKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sIHNlYXJjaFRleHRRdWVyeVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcXVlcnkuJG9yID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAkaW46IG9wdGlvbnMudmFsdWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgc2VhcmNoVGV4dFF1ZXJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcXVlcnkuX2lkID0ge1xuICAgICAgICAgICAgJG5pbjogc2VsZWN0ZWRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbGxlY3Rpb24gPSBvYmplY3QuZGI7XG4gICAgICAgIGlmIChvcHRpb25zLmZpbHRlclF1ZXJ5KSB7XG4gICAgICAgICAgXy5leHRlbmQocXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnkpO1xuICAgICAgICB9XG4gICAgICAgIHF1ZXJ5X29wdGlvbnMgPSB7XG4gICAgICAgICAgbGltaXQ6IG9wdGlvbnNfbGltaXRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHNvcnQgJiYgXy5pc09iamVjdChzb3J0KSkge1xuICAgICAgICAgIHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVjb3JkcyA9IGNvbGxlY3Rpb24uZmluZChxdWVyeSwgcXVlcnlfb3B0aW9ucykuZmV0Y2goKTtcbiAgICAgICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgIF8uZWFjaChyZWNvcmRzLCBmdW5jdGlvbihyZWNvcmQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICAgICAgbGFiZWw6IHJlY29yZFtuYW1lX2ZpZWxkX2tleV0sXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5faWRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgZS5tZXNzYWdlICsgXCItLT5cIiArIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvd29ya2Zsb3cvdmlldy86aW5zdGFuY2VJZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0dHJ5XG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxuXHRcdGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZFxuXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxuXHRcdG9iamVjdF9uYW1lID0gaGFzaERhdGEub2JqZWN0X25hbWVcblx0XHRyZWNvcmRfaWQgPSBoYXNoRGF0YS5yZWNvcmRfaWRcblx0XHRzcGFjZV9pZCA9IGhhc2hEYXRhLnNwYWNlX2lkXG5cblx0XHRjaGVjayBvYmplY3RfbmFtZSwgU3RyaW5nXG5cdFx0Y2hlY2sgcmVjb3JkX2lkLCBTdHJpbmdcblx0XHRjaGVjayBzcGFjZV9pZCwgU3RyaW5nXG5cblx0XHRpbnNJZCA9IHJlcS5wYXJhbXMuaW5zdGFuY2VJZFxuXHRcdHhfdXNlcl9pZCA9IHJlcS5xdWVyeVsnWC1Vc2VyLUlkJ11cblx0XHR4X2F1dGhfdG9rZW4gPSByZXEucXVlcnlbJ1gtQXV0aC1Ub2tlbiddXG5cblx0XHRyZWRpcmVjdF91cmwgPSBcIi9cIlxuXHRcdGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZClcblx0XHQjIC0g5oiR55qE6I2J56i/5bCx6Lez6L2s6Iez6I2J56i/566xXG5cdFx0IyAtIOaIkeeahOW+heWuoeaguOWwsei3s+i9rOiHs+W+heWuoeaguFxuXHRcdCMgLSDkuI3mmK/miJHnmoTnlLPor7fljZXliJnot7Povazoh7PmiZPljbDpobXpnaJcblx0XHQjIC0g5aaC55Sz6K+35Y2V5LiN5a2Y5Zyo5YiZ5o+Q56S655So5oi355Sz6K+35Y2V5bey5Yig6Zmk77yM5bm25LiU5pu05pawcmVjb3Jk55qE54q25oCB77yM5L2/55So5oi35Y+v5Lul6YeN5paw5Y+R6LW35a6h5om5XG5cdFx0aWYgaW5zXG5cdFx0XHR3b3JrZmxvd1VybCA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMud29ya2Zsb3cudXJsXG5cdFx0XHRib3ggPSAnJ1xuXHRcdFx0c3BhY2VJZCA9IGlucy5zcGFjZVxuXHRcdFx0Zmxvd0lkID0gaW5zLmZsb3dcblxuXHRcdFx0aWYgKGlucy5pbmJveF91c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkKSBvciAoaW5zLmNjX3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWQpXG5cdFx0XHRcdGJveCA9ICdpbmJveCdcblx0XHRcdGVsc2UgaWYgaW5zLm91dGJveF91c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkXG5cdFx0XHRcdGJveCA9ICdvdXRib3gnXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAnZHJhZnQnIGFuZCBpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZFxuXHRcdFx0XHRib3ggPSAnZHJhZnQnXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAncGVuZGluZycgYW5kIChpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZCBvciBpbnMuYXBwbGljYW50IGlzIGN1cnJlbnRfdXNlcl9pZClcblx0XHRcdFx0Ym94ID0gJ3BlbmRpbmcnXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAnY29tcGxldGVkJyBhbmQgaW5zLnN1Ym1pdHRlciBpcyBjdXJyZW50X3VzZXJfaWRcblx0XHRcdFx0Ym94ID0gJ2NvbXBsZXRlZCdcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyDpqozor4Fsb2dpbiB1c2VyX2lk5a+56K+l5rWB56iL5pyJ566h55CG55Sz6K+35Y2V55qE5p2D6ZmQXG5cdFx0XHRcdHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dJZCwgY3VycmVudF91c2VyX2lkKVxuXHRcdFx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQsIHsgZmllbGRzOiB7IGFkbWluczogMSB9IH0pXG5cdFx0XHRcdGlmIHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRtaW5cIikgb3Igc3BhY2UuYWRtaW5zLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZClcblx0XHRcdFx0XHRib3ggPSAnbW9uaXRvcidcblxuXHRcdFx0aWYgYm94XG5cdFx0XHRcdHJlZGlyZWN0X3VybCA9IHdvcmtmbG93VXJsICsgXCJ3b3JrZmxvdy9zcGFjZS8je3NwYWNlSWR9LyN7Ym94fS8je2luc0lkfT9YLVVzZXItSWQ9I3t4X3VzZXJfaWR9JlgtQXV0aC1Ub2tlbj0je3hfYXV0aF90b2tlbn1cIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZWRpcmVjdF91cmwgPSB3b3JrZmxvd1VybCArIFwid29ya2Zsb3cvc3BhY2UvI3tzcGFjZUlkfS9wcmludC8je2luc0lkfT9ib3g9bW9uaXRvciZwcmludF9pc19zaG93X3RyYWNlcz0xJnByaW50X2lzX3Nob3dfYXR0YWNobWVudHM9MSZYLVVzZXItSWQ9I3t4X3VzZXJfaWR9JlgtQXV0aC1Ub2tlbj0je3hfYXV0aF90b2tlbn1cIlxuXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRcdGNvZGU6IDIwMFxuXHRcdFx0XHRkYXRhOiB7IHJlZGlyZWN0X3VybDogcmVkaXJlY3RfdXJsIH1cblx0XHRcdH1cblx0XHRcdHJldHVyblxuXHRcdGVsc2Vcblx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKVxuXHRcdFx0aWYgY29sbGVjdGlvblxuXHRcdFx0XHRjb2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRfaWQsIHtcblx0XHRcdFx0XHQkcHVsbDoge1xuXHRcdFx0XHRcdFx0XCJpbnN0YW5jZXNcIjoge1xuXHRcdFx0XHRcdFx0XHRcIl9pZFwiOiBpbnNJZFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvcicsICfnlLPor7fljZXlt7LliKDpmaQnKVxuXG5cdGNhdGNoIGVcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRjb2RlOiAyMDBcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbeyBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XSB9XG5cdFx0fVxuXG4iLCJKc29uUm91dGVzLmFkZCgncG9zdCcsICcvYXBpL3dvcmtmbG93L3ZpZXcvOmluc3RhbmNlSWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYm94LCBjb2xsZWN0aW9uLCBjdXJyZW50X3VzZXJfaWQsIGN1cnJlbnRfdXNlcl9pbmZvLCBlLCBmbG93SWQsIGhhc2hEYXRhLCBpbnMsIGluc0lkLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbnMsIHJlY29yZF9pZCwgcmVkaXJlY3RfdXJsLCByZWYsIHJlZjEsIHJlZjIsIHNwYWNlLCBzcGFjZUlkLCBzcGFjZV9pZCwgd29ya2Zsb3dVcmwsIHhfYXV0aF90b2tlbiwgeF91c2VyX2lkO1xuICB0cnkge1xuICAgIGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSk7XG4gICAgY3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkO1xuICAgIGhhc2hEYXRhID0gcmVxLmJvZHk7XG4gICAgb2JqZWN0X25hbWUgPSBoYXNoRGF0YS5vYmplY3RfbmFtZTtcbiAgICByZWNvcmRfaWQgPSBoYXNoRGF0YS5yZWNvcmRfaWQ7XG4gICAgc3BhY2VfaWQgPSBoYXNoRGF0YS5zcGFjZV9pZDtcbiAgICBjaGVjayhvYmplY3RfbmFtZSwgU3RyaW5nKTtcbiAgICBjaGVjayhyZWNvcmRfaWQsIFN0cmluZyk7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgaW5zSWQgPSByZXEucGFyYW1zLmluc3RhbmNlSWQ7XG4gICAgeF91c2VyX2lkID0gcmVxLnF1ZXJ5WydYLVVzZXItSWQnXTtcbiAgICB4X2F1dGhfdG9rZW4gPSByZXEucXVlcnlbJ1gtQXV0aC1Ub2tlbiddO1xuICAgIHJlZGlyZWN0X3VybCA9IFwiL1wiO1xuICAgIGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZCk7XG4gICAgaWYgKGlucykge1xuICAgICAgd29ya2Zsb3dVcmwgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMud29ya2Zsb3cudXJsO1xuICAgICAgYm94ID0gJyc7XG4gICAgICBzcGFjZUlkID0gaW5zLnNwYWNlO1xuICAgICAgZmxvd0lkID0gaW5zLmZsb3c7XG4gICAgICBpZiAoKChyZWYgPSBpbnMuaW5ib3hfdXNlcnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkgfHwgKChyZWYxID0gaW5zLmNjX3VzZXJzKSAhPSBudWxsID8gcmVmMS5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSkge1xuICAgICAgICBib3ggPSAnaW5ib3gnO1xuICAgICAgfSBlbHNlIGlmICgocmVmMiA9IGlucy5vdXRib3hfdXNlcnMpICE9IG51bGwgPyByZWYyLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApIHtcbiAgICAgICAgYm94ID0gJ291dGJveCc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ2RyYWZ0JyAmJiBpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQpIHtcbiAgICAgICAgYm94ID0gJ2RyYWZ0JztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAncGVuZGluZycgJiYgKGlucy5zdWJtaXR0ZXIgPT09IGN1cnJlbnRfdXNlcl9pZCB8fCBpbnMuYXBwbGljYW50ID09PSBjdXJyZW50X3VzZXJfaWQpKSB7XG4gICAgICAgIGJveCA9ICdwZW5kaW5nJztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQpIHtcbiAgICAgICAgYm94ID0gJ2NvbXBsZXRlZCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93SWQsIGN1cnJlbnRfdXNlcl9pZCk7XG4gICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgYWRtaW5zOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRtaW5cIikgfHwgc3BhY2UuYWRtaW5zLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkpIHtcbiAgICAgICAgICBib3ggPSAnbW9uaXRvcic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChib3gpIHtcbiAgICAgICAgcmVkaXJlY3RfdXJsID0gd29ya2Zsb3dVcmwgKyAoXCJ3b3JrZmxvdy9zcGFjZS9cIiArIHNwYWNlSWQgKyBcIi9cIiArIGJveCArIFwiL1wiICsgaW5zSWQgKyBcIj9YLVVzZXItSWQ9XCIgKyB4X3VzZXJfaWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyB4X2F1dGhfdG9rZW4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVkaXJlY3RfdXJsID0gd29ya2Zsb3dVcmwgKyAoXCJ3b3JrZmxvdy9zcGFjZS9cIiArIHNwYWNlSWQgKyBcIi9wcmludC9cIiArIGluc0lkICsgXCI/Ym94PW1vbml0b3ImcHJpbnRfaXNfc2hvd190cmFjZXM9MSZwcmludF9pc19zaG93X2F0dGFjaG1lbnRzPTEmWC1Vc2VyLUlkPVwiICsgeF91c2VyX2lkICsgXCImWC1BdXRoLVRva2VuPVwiICsgeF9hdXRoX3Rva2VuKTtcbiAgICAgIH1cbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogMjAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVkaXJlY3RfdXJsOiByZWRpcmVjdF91cmxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKTtcbiAgICAgIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgICAgIGNvbGxlY3Rpb24udXBkYXRlKHJlY29yZF9pZCwge1xuICAgICAgICAgICRwdWxsOiB7XG4gICAgICAgICAgICBcImluc3RhbmNlc1wiOiB7XG4gICAgICAgICAgICAgIFwiX2lkXCI6IGluc0lkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3InLCAn55Sz6K+35Y2V5bey5Yig6ZmkJyk7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0SW5pdFdpZHRoUGVyY2VudCA9IChvYmplY3RfbmFtZSwgY29sdW1ucykgLT5cblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKT8uX3NjaGVtYVxuXHRjb2x1bW5fbnVtID0gMFxuXHRpZiBfc2NoZW1hXG5cdFx0Xy5lYWNoIGNvbHVtbnMsIChmaWVsZF9uYW1lKSAtPlxuXHRcdFx0ZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSlcblx0XHRcdGlzX3dpZGUgPSBmaWVsZFtmaWVsZF9uYW1lXT8uYXV0b2Zvcm0/LmlzX3dpZGVcblx0XHRcdGlmIGlzX3dpZGVcblx0XHRcdFx0Y29sdW1uX251bSArPSAyXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGNvbHVtbl9udW0gKz0gMVxuXG5cdFx0aW5pdF93aWR0aF9wZXJjZW50ID0gMTAwIC8gY29sdW1uX251bVxuXHRcdHJldHVybiBpbml0X3dpZHRoX3BlcmNlbnRcblxuQ3JlYXRvci5nZXRGaWVsZElzV2lkZSA9IChvYmplY3RfbmFtZSwgZmllbGRfbmFtZSkgLT5cblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKS5fc2NoZW1hXG5cdGlmIF9zY2hlbWFcblx0XHRmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKVxuXHRcdGlzX3dpZGUgPSBmaWVsZFtmaWVsZF9uYW1lXT8uYXV0b2Zvcm0/LmlzX3dpZGVcblx0XHRyZXR1cm4gaXNfd2lkZVxuXG5DcmVhdG9yLmdldFRhYnVsYXJPcmRlciA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5zKSAtPlxuXHRzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucz8uc2V0dGluZ3M/LmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIn0pXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRjb2x1bW5zID0gXy5tYXAgY29sdW1ucywgKGNvbHVtbiktPlxuXHRcdGZpZWxkID0gb2JqLmZpZWxkc1tjb2x1bW5dXG5cdFx0aWYgZmllbGQ/LnR5cGUgYW5kICFmaWVsZC5oaWRkZW5cblx0XHRcdHJldHVybiBjb2x1bW5cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkXG5cdGNvbHVtbnMgPSBfLmNvbXBhY3QgY29sdW1uc1xuXHRpZiBzZXR0aW5nIGFuZCBzZXR0aW5nLnNldHRpbmdzXG5cdFx0c29ydCA9IHNldHRpbmcuc2V0dGluZ3NbbGlzdF92aWV3X2lkXT8uc29ydCB8fCBbXVxuXHRcdHNvcnQgPSBfLm1hcCBzb3J0LCAob3JkZXIpLT5cblx0XHRcdGtleSA9IG9yZGVyWzBdXG5cdFx0XHRpbmRleCA9IF8uaW5kZXhPZihjb2x1bW5zLCBrZXkpXG5cdFx0XHRvcmRlclswXSA9IGluZGV4ICsgMVxuXHRcdFx0cmV0dXJuIG9yZGVyXG5cdFx0cmV0dXJuIHNvcnRcblx0cmV0dXJuIFtdXG5cblxuQ3JlYXRvci5pbml0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lKS0+XG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXVxuXHRleHRyYV9jb2x1bW5zID0gW1wib3duZXJcIl1cblx0ZGVmYXVsdF9leHRyYV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJvd25lclwiXVxuXHRpZiBkZWZhdWx0X2V4dHJhX2NvbHVtbnNcblx0XHRleHRyYV9jb2x1bW5zID0gXy51bmlvbiBleHRyYV9jb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnNcblxuXHRvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQob2JqZWN0X25hbWUpIHx8IFtdXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzP1tvYmplY3RfbmFtZV0gPSBbXVxuXG5DcmVhdG9yLmNvbnZlcnRMaXN0VmlldyA9IChkZWZhdWx0X2NvbHVtZW5zLCBsaXN0X3ZpZXcsIGxpc3Rfdmlld19uYW1lKS0+XG5cdG9pdGVtID0gXy5jbG9uZShsaXN0X3ZpZXcpXG5cdGlmICFfLmhhcyhvaXRlbSwgXCJuYW1lXCIpXG5cdFx0b2l0ZW0ubmFtZSA9IGxpc3Rfdmlld19uYW1lXG5cdGlmICFvaXRlbS5jb2x1bW5zXG5cdFx0aWYgZGVmYXVsdF9jb2x1bWVuc1xuXHRcdFx0b2l0ZW0uY29sdW1ucyA9IGRlZmF1bHRfY29sdW1lbnNcblx0aWYgIW9pdGVtLmNvbHVtbnNcblx0XHRvaXRlbS5jb2x1bW5zID0gW1wibmFtZVwiXVxuXHRpZiAhb2l0ZW0uZmlsdGVyX3Njb3BlXG5cdFx0IyBsaXN0dmlld+inhuWbvueahGZpbHRlcl9zY29wZem7mOiupOWAvOaUueS4unNwYWNlICMxMzFcblx0XHRvaXRlbS5maWx0ZXJfc2NvcGUgPSBcInNwYWNlXCJcblxuXHRpZiAhXy5oYXMob2l0ZW0sIFwiX2lkXCIpXG5cdFx0b2l0ZW0uX2lkID0gbGlzdF92aWV3X25hbWVcblx0ZWxzZVxuXHRcdG9pdGVtLmxhYmVsID0gb2l0ZW0ubGFiZWwgfHwgbGlzdF92aWV3Lm5hbWVcblxuXHRpZiBfLmlzU3RyaW5nKG9pdGVtLm9wdGlvbnMpXG5cdFx0b2l0ZW0ub3B0aW9ucyA9IEpTT04ucGFyc2Uob2l0ZW0ub3B0aW9ucylcblxuXHRfLmZvckVhY2ggb2l0ZW0uZmlsdGVycywgKGZpbHRlciwgX2luZGV4KS0+XG5cdFx0aWYgIV8uaXNBcnJheShmaWx0ZXIpICYmIF8uaXNPYmplY3QoZmlsdGVyKVxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihmaWx0ZXI/LnZhbHVlKVxuXHRcdFx0XHRcdGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpbHRlcj8uX3ZhbHVlKVxuXHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlci5fdmFsdWV9KVwiKVxuXHRyZXR1cm4gb2l0ZW1cblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0Q3JlYXRvci5nZXRSZWxhdGVkTGlzdCA9IChvYmplY3RfbmFtZSktPlxuXHRcdGxpc3QgPSBbXVxuXHRcdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpXG5cblx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3RzLCAocmVsYXRlZF9vYmplY3RfaXRlbSkgLT5cblx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lXG5cdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLmZvcmVpZ25fa2V5XG5cdFx0XHRyZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXG5cdFx0XHR1bmxlc3MgcmVsYXRlZF9vYmplY3Rcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXG5cdFx0XHRjb2x1bW5zID0gXy53aXRob3V0KGNvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSlcblxuXHRcdFx0b3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXG5cdFx0XHR0YWJ1bGFyX29yZGVyID0gQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyKG9yZGVyLCBjb2x1bW5zKVxuXG5cdFx0XHRpZiAvXFx3K1xcLlxcJFxcLlxcdysvZy50ZXN0KHJlbGF0ZWRfZmllbGRfbmFtZSlcblx0XHRcdFx0IyBvYmplY3TnsbvlnovluKblrZDlsZ7mgKfnmoRyZWxhdGVkX2ZpZWxkX25hbWXopoHljrvmjonkuK3pl7TnmoTnvo7lhYPnrKblj7fvvIzlkKbliJnmmL7npLrkuI3lh7rlrZfmrrXlgLxcblx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9maWVsZF9uYW1lLnJlcGxhY2UoL1xcJFxcLi8sXCJcIilcblx0XHRcdHJlbGF0ZWQgPVxuXHRcdFx0XHRvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZVxuXHRcdFx0XHRjb2x1bW5zOiBjb2x1bW5zXG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lXG5cdFx0XHRcdGlzX2ZpbGU6IHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXG5cdFx0XHRsaXN0LnB1c2ggcmVsYXRlZFxuXG5cdFx0cmV0dXJuIGxpc3RcblxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gKG9iamVjdF9uYW1lKS0+XG5cdHJldHVybiBfLmZpcnN0KENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKSlcblxuIyMjIFxuXHTlj5blh7psaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77vvIzlpoLmnpzkuI3lrZjlnKjmiJbogIXmsqHmnInmnYPpmZDvvIzlsLHov5Tlm57nrKzkuIDkuKrop4blm75cblx0ZXhhY+S4unRydWXml7bvvIzpnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzkuI3pu5jorqTov5Tlm57nrKzkuIDkuKrop4blm75cbiMjI1xuQ3JlYXRvci5nZXRMaXN0VmlldyA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBleGFjKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIWxpc3Rfdmlld19pZFxuXHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGlmICFvYmplY3Rcblx0XHRyZXR1cm5cblx0bGlzdFZpZXdzID0gQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpXG5cdHVubGVzcyBsaXN0Vmlld3M/Lmxlbmd0aFxuXHRcdHJldHVyblxuXHRsaXN0X3ZpZXcgPSBfLmZpbmRXaGVyZShsaXN0Vmlld3Mse1wiX2lkXCI6bGlzdF92aWV3X2lkfSlcblx0dW5sZXNzIGxpc3Rfdmlld1xuXHRcdCMg5aaC5p6c5LiN6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5YiZ6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+77yM5Y+N5LmL6L+U5Zue56m6XG5cdFx0aWYgZXhhY1xuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0bGlzdF92aWV3ID0gbGlzdFZpZXdzWzBdXG5cdHJldHVybiBsaXN0X3ZpZXdcblxuI+iOt+WPlmxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvuaYr+WQpuaYr+acgOi/keafpeeci+inhuWbvlxuQ3JlYXRvci5nZXRMaXN0Vmlld0lzUmVjZW50ID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhbGlzdF92aWV3X2lkXG5cdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxuXHRpZiB0eXBlb2YobGlzdF92aWV3X2lkKSA9PSBcInN0cmluZ1wiXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgIW9iamVjdFxuXHRcdFx0cmV0dXJuXG5cdFx0bGlzdFZpZXcgPSBfLmZpbmRXaGVyZShvYmplY3QubGlzdF92aWV3cyx7X2lkOiBsaXN0X3ZpZXdfaWR9KVxuXHRlbHNlXG5cdFx0bGlzdFZpZXcgPSBsaXN0X3ZpZXdfaWRcblx0cmV0dXJuIGxpc3RWaWV3Py5uYW1lID09IFwicmVjZW50XCJcblxuXG4jIyNcbiAgICDojrflj5bpu5jorqTop4blm75cbiMjI1xuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyA9IChvYmplY3RfbmFtZSktPlxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0aWYgIW9iamVjdFxuXHRcdG9iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cblx0aWYgb2JqZWN0Py5saXN0X3ZpZXdzPy5kZWZhdWx0XG5cdFx0I1RPRE8g5q2k5Luj56CB5Y+q5piv5pqC5pe25YW85a655Lul5YmNY29kZeS4reWumuS5ieeahGRlZmF1bHTop4blm77vvIzlvoVjb2Rl5Lit55qEZGVmYXVsdOa4heeQhuWujOaIkOWQju+8jOmcgOimgeWIoOmZpOatpOS7o+eggVxuXHRcdGRlZmF1bHRWaWV3ID0gb2JqZWN0Lmxpc3Rfdmlld3MuZGVmYXVsdFxuXHRlbHNlXG5cdFx0Xy5lYWNoIG9iamVjdD8ubGlzdF92aWV3cywgKGxpc3Rfdmlldywga2V5KS0+XG5cdFx0XHRpZiBsaXN0X3ZpZXcubmFtZSA9PSBcImFsbFwiIHx8IGtleSA9PSBcImFsbFwiXG5cdFx0XHRcdGRlZmF1bHRWaWV3ID0gbGlzdF92aWV3XG5cdHJldHVybiBkZWZhdWx0VmlldztcblxuIyMjXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k5pi+56S65a2X5q61XG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMgPSAob2JqZWN0X25hbWUpLT5cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxuXHRyZXR1cm4gZGVmYXVsdFZpZXc/LmNvbHVtbnNcblxuIyMjXG5cdOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOmineWkluWKoOi9veeahOWtl+autVxuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMgPSAob2JqZWN0X25hbWUpLT5cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxuXHRyZXR1cm4gZGVmYXVsdFZpZXc/LmV4dHJhX2NvbHVtbnNcblxuIyMjXG5cdOiOt+WPluWvueixoeeahOm7mOiupOaOkuW6j1xuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0ID0gKG9iamVjdF9uYW1lKS0+XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcblx0aWYgZGVmYXVsdFZpZXdcblx0XHRpZiBkZWZhdWx0Vmlldy5zb3J0XG5cdFx0XHRyZXR1cm4gZGVmYXVsdFZpZXcuc29ydFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBbW1wiY3JlYXRlZFwiLCBcImRlc2NcIl1dXG5cblxuIyMjXG4gICAg5Yik5pat5piv5ZCmQWxsIHZpZXdcbiMjI1xuQ3JlYXRvci5pc0FsbFZpZXcgPSAobGlzdF92aWV3KS0+XG5cdHJldHVybiBsaXN0X3ZpZXc/Lm5hbWUgPT0gXCJhbGxcIlxuXG4jIyNcbiAgICDliKTmlq3mmK/lkKbmnIDov5Hmn6XnnIsgdmlld1xuIyMjXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IChsaXN0X3ZpZXcpLT5cblx0cmV0dXJuIGxpc3Rfdmlldz8ubmFtZSA9PSBcInJlY2VudFwiXG5cbiMjI1xuICAgIOWwhnNvcnTovazmjaLkuLpUYWJ1bGFy5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4jIyNcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhciA9IChzb3J0LCB0YWJ1bGFyQ29sdW1ucyktPlxuXHR0YWJ1bGFyX3NvcnQgPSBbXVxuXHRfLmVhY2ggc29ydCwgKGl0ZW0pLT5cblx0XHRpZiBfLmlzQXJyYXkoaXRlbSlcblx0XHRcdCMg5YW85a655pen55qE5pWw5o2u5qC85byPW1tcImZpZWxkX25hbWVcIiwgXCJvcmRlclwiXV1cblx0XHRcdGlmIGl0ZW0ubGVuZ3RoID09IDFcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIFwiYXNjXCJdXG5cdFx0XHRlbHNlIGlmIGl0ZW0ubGVuZ3RoID09IDJcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dXG5cdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGl0ZW0pXG5cdFx0XHQj5paw5pWw5o2u5qC85byP77yaW3tmaWVsZF9uYW1lOiAsIG9yZGVyOiB9XVxuXHRcdFx0ZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZVxuXHRcdFx0b3JkZXIgPSBpdGVtLm9yZGVyXG5cdFx0XHRpZiBmaWVsZF9uYW1lICYmIG9yZGVyXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSlcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBvcmRlcl1cblxuXHRyZXR1cm4gdGFidWxhcl9zb3J0XG5cbiMjI1xuICAgIOWwhnNvcnTovazmjaLkuLpEZXZFeHByZXNz5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4jIyNcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSAoc29ydCktPlxuXHRkeF9zb3J0ID0gW11cblx0Xy5lYWNoIHNvcnQsIChpdGVtKS0+XG5cdFx0aWYgXy5pc0FycmF5KGl0ZW0pXG5cdFx0XHQj5YW85a655pen5qC85byP77yaW1tcImZpZWxkX25hbWVcIiwgXCJvcmRlclwiXV1cblx0XHRcdGR4X3NvcnQucHVzaChpdGVtKVxuXHRcdGVsc2UgaWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0I+aWsOaVsOaNruagvOW8j++8mlt7ZmllbGRfbmFtZTogLCBvcmRlcjogfV1cblx0XHRcdGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWVcblx0XHRcdG9yZGVyID0gaXRlbS5vcmRlclxuXHRcdFx0aWYgZmllbGRfbmFtZSAmJiBvcmRlclxuXHRcdFx0XHRkeF9zb3J0LnB1c2ggW2ZpZWxkX25hbWUsIG9yZGVyXVxuXG5cdHJldHVybiBkeF9zb3J0XG4iLCJDcmVhdG9yLmdldEluaXRXaWR0aFBlcmNlbnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgY29sdW1ucykge1xuICB2YXIgX3NjaGVtYSwgY29sdW1uX251bSwgaW5pdF93aWR0aF9wZXJjZW50LCByZWY7XG4gIF9zY2hlbWEgPSAocmVmID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLl9zY2hlbWEgOiB2b2lkIDA7XG4gIGNvbHVtbl9udW0gPSAwO1xuICBpZiAoX3NjaGVtYSkge1xuICAgIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbihmaWVsZF9uYW1lKSB7XG4gICAgICB2YXIgZmllbGQsIGlzX3dpZGUsIHJlZjEsIHJlZjI7XG4gICAgICBmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKTtcbiAgICAgIGlzX3dpZGUgPSAocmVmMSA9IGZpZWxkW2ZpZWxkX25hbWVdKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMi5pc193aWRlIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGlzX3dpZGUpIHtcbiAgICAgICAgcmV0dXJuIGNvbHVtbl9udW0gKz0gMjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjb2x1bW5fbnVtICs9IDE7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaW5pdF93aWR0aF9wZXJjZW50ID0gMTAwIC8gY29sdW1uX251bTtcbiAgICByZXR1cm4gaW5pdF93aWR0aF9wZXJjZW50O1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkSXNXaWRlID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUpIHtcbiAgdmFyIF9zY2hlbWEsIGZpZWxkLCBpc193aWRlLCByZWYsIHJlZjE7XG4gIF9zY2hlbWEgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSkuX3NjaGVtYTtcbiAgaWYgKF9zY2hlbWEpIHtcbiAgICBmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKTtcbiAgICBpc193aWRlID0gKHJlZiA9IGZpZWxkW2ZpZWxkX25hbWVdKSAhPSBudWxsID8gKHJlZjEgPSByZWYuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLmlzX3dpZGUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgcmV0dXJuIGlzX3dpZGU7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0VGFidWxhck9yZGVyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1ucykge1xuICB2YXIgb2JqLCByZWYsIHJlZjEsIHJlZjIsIHNldHRpbmcsIHNvcnQ7XG4gIHNldHRpbmcgPSAocmVmID0gQ3JlYXRvci5Db2xsZWN0aW9ucykgIT0gbnVsbCA/IChyZWYxID0gcmVmLnNldHRpbmdzKSAhPSBudWxsID8gcmVmMS5maW5kT25lKHtcbiAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICB9KSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gXy5tYXAoY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG4gICAgdmFyIGZpZWxkO1xuICAgIGZpZWxkID0gb2JqLmZpZWxkc1tjb2x1bW5dO1xuICAgIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnR5cGUgOiB2b2lkIDApICYmICFmaWVsZC5oaWRkZW4pIHtcbiAgICAgIHJldHVybiBjb2x1bW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICB9KTtcbiAgY29sdW1ucyA9IF8uY29tcGFjdChjb2x1bW5zKTtcbiAgaWYgKHNldHRpbmcgJiYgc2V0dGluZy5zZXR0aW5ncykge1xuICAgIHNvcnQgPSAoKHJlZjIgPSBzZXR0aW5nLnNldHRpbmdzW2xpc3Rfdmlld19pZF0pICE9IG51bGwgPyByZWYyLnNvcnQgOiB2b2lkIDApIHx8IFtdO1xuICAgIHNvcnQgPSBfLm1hcChzb3J0LCBmdW5jdGlvbihvcmRlcikge1xuICAgICAgdmFyIGluZGV4LCBrZXk7XG4gICAgICBrZXkgPSBvcmRlclswXTtcbiAgICAgIGluZGV4ID0gXy5pbmRleE9mKGNvbHVtbnMsIGtleSk7XG4gICAgICBvcmRlclswXSA9IGluZGV4ICsgMTtcbiAgICAgIHJldHVybiBvcmRlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gc29ydDtcbiAgfVxuICByZXR1cm4gW107XG59O1xuXG5DcmVhdG9yLmluaXRMaXN0Vmlld3MgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgY29sdW1ucywgZGVmYXVsdF9leHRyYV9jb2x1bW5zLCBleHRyYV9jb2x1bW5zLCBvYmplY3QsIG9yZGVyLCByZWY7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl07XG4gIGV4dHJhX2NvbHVtbnMgPSBbXCJvd25lclwiXTtcbiAgZGVmYXVsdF9leHRyYV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJvd25lclwiXTtcbiAgaWYgKGRlZmF1bHRfZXh0cmFfY29sdW1ucykge1xuICAgIGV4dHJhX2NvbHVtbnMgPSBfLnVuaW9uKGV4dHJhX2NvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1ucyk7XG4gIH1cbiAgb3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KG9iamVjdF9uYW1lKSB8fCBbXTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHJldHVybiAocmVmID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHMpICE9IG51bGwgPyByZWZbb2JqZWN0X25hbWVdID0gW10gOiB2b2lkIDA7XG4gIH1cbn07XG5cbkNyZWF0b3IuY29udmVydExpc3RWaWV3ID0gZnVuY3Rpb24oZGVmYXVsdF9jb2x1bWVucywgbGlzdF92aWV3LCBsaXN0X3ZpZXdfbmFtZSkge1xuICB2YXIgb2l0ZW07XG4gIG9pdGVtID0gXy5jbG9uZShsaXN0X3ZpZXcpO1xuICBpZiAoIV8uaGFzKG9pdGVtLCBcIm5hbWVcIikpIHtcbiAgICBvaXRlbS5uYW1lID0gbGlzdF92aWV3X25hbWU7XG4gIH1cbiAgaWYgKCFvaXRlbS5jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRfY29sdW1lbnMpIHtcbiAgICAgIG9pdGVtLmNvbHVtbnMgPSBkZWZhdWx0X2NvbHVtZW5zO1xuICAgIH1cbiAgfVxuICBpZiAoIW9pdGVtLmNvbHVtbnMpIHtcbiAgICBvaXRlbS5jb2x1bW5zID0gW1wibmFtZVwiXTtcbiAgfVxuICBpZiAoIW9pdGVtLmZpbHRlcl9zY29wZSkge1xuICAgIG9pdGVtLmZpbHRlcl9zY29wZSA9IFwic3BhY2VcIjtcbiAgfVxuICBpZiAoIV8uaGFzKG9pdGVtLCBcIl9pZFwiKSkge1xuICAgIG9pdGVtLl9pZCA9IGxpc3Rfdmlld19uYW1lO1xuICB9IGVsc2Uge1xuICAgIG9pdGVtLmxhYmVsID0gb2l0ZW0ubGFiZWwgfHwgbGlzdF92aWV3Lm5hbWU7XG4gIH1cbiAgaWYgKF8uaXNTdHJpbmcob2l0ZW0ub3B0aW9ucykpIHtcbiAgICBvaXRlbS5vcHRpb25zID0gSlNPTi5wYXJzZShvaXRlbS5vcHRpb25zKTtcbiAgfVxuICBfLmZvckVhY2gob2l0ZW0uZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyLCBfaW5kZXgpIHtcbiAgICBpZiAoIV8uaXNBcnJheShmaWx0ZXIpICYmIF8uaXNPYmplY3QoZmlsdGVyKSkge1xuICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChfLmlzU3RyaW5nKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLl92YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXIuX3ZhbHVlICsgXCIpXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9pdGVtO1xufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBDcmVhdG9yLmdldFJlbGF0ZWRMaXN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgbGlzdCwgcmVsYXRlZF9vYmplY3RzO1xuICAgIGxpc3QgPSBbXTtcbiAgICByZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKTtcbiAgICBfLmVhY2gocmVsYXRlZF9vYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdF9pdGVtKSB7XG4gICAgICB2YXIgY29sdW1ucywgb3JkZXIsIHJlbGF0ZWQsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHRhYnVsYXJfb3JkZXI7XG4gICAgICByZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZTtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uZm9yZWlnbl9rZXk7XG4gICAgICByZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKCFyZWxhdGVkX29iamVjdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdO1xuICAgICAgY29sdW1ucyA9IF8ud2l0aG91dChjb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpO1xuICAgICAgb3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgdGFidWxhcl9vcmRlciA9IENyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhcihvcmRlciwgY29sdW1ucyk7XG4gICAgICBpZiAoL1xcdytcXC5cXCRcXC5cXHcrL2cudGVzdChyZWxhdGVkX2ZpZWxkX25hbWUpKSB7XG4gICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfZmllbGRfbmFtZS5yZXBsYWNlKC9cXCRcXC4vLCBcIlwiKTtcbiAgICAgIH1cbiAgICAgIHJlbGF0ZWQgPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zLFxuICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgaXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIlxuICAgICAgfTtcbiAgICAgIHJldHVybiBsaXN0LnB1c2gocmVsYXRlZCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH07XG59XG5cbkNyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHJldHVybiBfLmZpcnN0KENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKSk7XG59O1xuXG5cbi8qIFxuXHTlj5blh7psaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77vvIzlpoLmnpzkuI3lrZjlnKjmiJbogIXmsqHmnInmnYPpmZDvvIzlsLHov5Tlm57nrKzkuIDkuKrop4blm75cblx0ZXhhY+S4unRydWXml7bvvIzpnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzkuI3pu5jorqTov5Tlm57nrKzkuIDkuKrop4blm75cbiAqL1xuXG5DcmVhdG9yLmdldExpc3RWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZXhhYykge1xuICB2YXIgbGlzdFZpZXdzLCBsaXN0X3ZpZXcsIG9iamVjdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgIGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpO1xuICAgIH1cbiAgfVxuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxpc3RWaWV3cyA9IENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKTtcbiAgaWYgKCEobGlzdFZpZXdzICE9IG51bGwgPyBsaXN0Vmlld3MubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBsaXN0X3ZpZXcgPSBfLmZpbmRXaGVyZShsaXN0Vmlld3MsIHtcbiAgICBcIl9pZFwiOiBsaXN0X3ZpZXdfaWRcbiAgfSk7XG4gIGlmICghbGlzdF92aWV3KSB7XG4gICAgaWYgKGV4YWMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdF92aWV3ID0gbGlzdFZpZXdzWzBdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbGlzdF92aWV3O1xufTtcblxuQ3JlYXRvci5nZXRMaXN0Vmlld0lzUmVjZW50ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCkge1xuICB2YXIgbGlzdFZpZXcsIG9iamVjdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgIGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpO1xuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIGxpc3Rfdmlld19pZCA9PT0gXCJzdHJpbmdcIikge1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoIW9iamVjdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsaXN0VmlldyA9IF8uZmluZFdoZXJlKG9iamVjdC5saXN0X3ZpZXdzLCB7XG4gICAgICBfaWQ6IGxpc3Rfdmlld19pZFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGxpc3RWaWV3ID0gbGlzdF92aWV3X2lkO1xuICB9XG4gIHJldHVybiAobGlzdFZpZXcgIT0gbnVsbCA/IGxpc3RWaWV3Lm5hbWUgOiB2b2lkIDApID09PSBcInJlY2VudFwiO1xufTtcblxuXG4vKlxuICAgIOiOt+WPlum7mOiupOinhuWbvlxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXcsIG9iamVjdCwgcmVmO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgfVxuICBpZiAob2JqZWN0ICE9IG51bGwgPyAocmVmID0gb2JqZWN0Lmxpc3Rfdmlld3MpICE9IG51bGwgPyByZWZbXCJkZWZhdWx0XCJdIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgZGVmYXVsdFZpZXcgPSBvYmplY3QubGlzdF92aWV3c1tcImRlZmF1bHRcIl07XG4gIH0gZWxzZSB7XG4gICAgXy5lYWNoKG9iamVjdCAhPSBudWxsID8gb2JqZWN0Lmxpc3Rfdmlld3MgOiB2b2lkIDAsIGZ1bmN0aW9uKGxpc3Rfdmlldywga2V5KSB7XG4gICAgICBpZiAobGlzdF92aWV3Lm5hbWUgPT09IFwiYWxsXCIgfHwga2V5ID09PSBcImFsbFwiKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmlldyA9IGxpc3RfdmlldztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZpZXc7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k5pi+56S65a2X5q61XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgcmV0dXJuIGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5jb2x1bW5zIDogdm9pZCAwO1xufTtcblxuXG4vKlxuXHTojrflj5blr7nosaHnmoTliJfooajpu5jorqTpop3lpJbliqDovb3nmoTlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIHJldHVybiBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuZXh0cmFfY29sdW1ucyA6IHZvaWQgMDtcbn07XG5cblxuLypcblx06I635Y+W5a+56LGh55qE6buY6K6k5o6S5bqPXG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgaWYgKGRlZmF1bHRWaWV3KSB7XG4gICAgaWYgKGRlZmF1bHRWaWV3LnNvcnQpIHtcbiAgICAgIHJldHVybiBkZWZhdWx0Vmlldy5zb3J0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW1tcImNyZWF0ZWRcIiwgXCJkZXNjXCJdXTtcbiAgICB9XG4gIH1cbn07XG5cblxuLypcbiAgICDliKTmlq3mmK/lkKZBbGwgdmlld1xuICovXG5cbkNyZWF0b3IuaXNBbGxWaWV3ID0gZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gIHJldHVybiAobGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwiYWxsXCI7XG59O1xuXG5cbi8qXG4gICAg5Yik5pat5piv5ZCm5pyA6L+R5p+l55yLIHZpZXdcbiAqL1xuXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IGZ1bmN0aW9uKGxpc3Rfdmlldykge1xuICByZXR1cm4gKGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Lm5hbWUgOiB2b2lkIDApID09PSBcInJlY2VudFwiO1xufTtcblxuXG4vKlxuICAgIOWwhnNvcnTovazmjaLkuLpUYWJ1bGFy5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4gKi9cblxuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyID0gZnVuY3Rpb24oc29ydCwgdGFidWxhckNvbHVtbnMpIHtcbiAgdmFyIHRhYnVsYXJfc29ydDtcbiAgdGFidWxhcl9zb3J0ID0gW107XG4gIF8uZWFjaChzb3J0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGNvbHVtbl9pbmRleCwgZmllbGRfbmFtZSwgb3JkZXI7XG4gICAgaWYgKF8uaXNBcnJheShpdGVtKSkge1xuICAgICAgaWYgKGl0ZW0ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBcImFzY1wiXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXRlbS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZTtcbiAgICAgIG9yZGVyID0gaXRlbS5vcmRlcjtcbiAgICAgIGlmIChmaWVsZF9uYW1lICYmIG9yZGVyKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBvcmRlcl0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRhYnVsYXJfc29ydDtcbn07XG5cblxuLypcbiAgICDlsIZzb3J06L2s5o2i5Li6RGV2RXhwcmVzc+aOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuICovXG5cbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSBmdW5jdGlvbihzb3J0KSB7XG4gIHZhciBkeF9zb3J0O1xuICBkeF9zb3J0ID0gW107XG4gIF8uZWFjaChzb3J0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGZpZWxkX25hbWUsIG9yZGVyO1xuICAgIGlmIChfLmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIHJldHVybiBkeF9zb3J0LnB1c2goaXRlbSk7XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lO1xuICAgICAgb3JkZXIgPSBpdGVtLm9yZGVyO1xuICAgICAgaWYgKGZpZWxkX25hbWUgJiYgb3JkZXIpIHtcbiAgICAgICAgcmV0dXJuIGR4X3NvcnQucHVzaChbZmllbGRfbmFtZSwgb3JkZXJdKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZHhfc29ydDtcbn07XG4iLCJTaW1wbGVTY2hlbWEuUmVnRXguY29kZSA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11bYS16QS1aMC05X10qJCcpXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdFx0X3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdXG5cdFx0X3JlZ0V4TWVzc2FnZXMucHVzaCB7ZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZSwgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jOS4lOWPquiDveWMheWQq+Wtl+avjeOAgeaVsOWtl+OAgV9cIn1cblx0XHRTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuXHRcdFx0cmVnRXg6IF9yZWdFeE1lc3NhZ2VzLFxuXHRcdH0pIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dW2EtekEtWjAtOV9dKiQnKTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgX3JlZ0V4TWVzc2FnZXM7XG4gICAgX3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdO1xuICAgIF9yZWdFeE1lc3NhZ2VzLnB1c2goe1xuICAgICAgZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZSxcbiAgICAgIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIzkuJTlj6rog73ljIXlkKvlrZfmr43jgIHmlbDlrZfjgIFfXCJcbiAgICB9KTtcbiAgICByZXR1cm4gU2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcbiAgICAgIHJlZ0V4OiBfcmVnRXhNZXNzYWdlc1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIlNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11cXFxcdyooXFxcXC5cXFxcJFxcXFwuXFxcXHcrKT9bYS16QS1aMC05XSokJylcblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdE1ldGVvci5zdGFydHVwICgpLT5cblx0XHRfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW11cblx0XHRfcmVnRXhNZXNzYWdlcy5wdXNoIHtleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCwgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jC4kLuWJjeWQjuW/hemhu+WMheWQq+Wtl+esplwifVxuXHRcdFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG5cdFx0XHRyZWdFeDogX3JlZ0V4TWVzc2FnZXMsXG5cdFx0fSkiLCJTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dXFxcXHcqKFxcXFwuXFxcXCRcXFxcLlxcXFx3Kyk/W2EtekEtWjAtOV0qJCcpO1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHZhciBfcmVnRXhNZXNzYWdlcztcbiAgICBfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW107XG4gICAgX3JlZ0V4TWVzc2FnZXMucHVzaCh7XG4gICAgICBleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCxcbiAgICAgIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIwuJC7liY3lkI7lv4XpobvljIXlkKvlrZfnrKZcIlxuICAgIH0pO1xuICAgIHJldHVybiBTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuICAgICAgcmVnRXg6IF9yZWdFeE1lc3NhZ2VzXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiLy8g5Zug5Li6bWV0ZW9y57yW6K+RY29mZmVlc2NyaXB05Lya5a+86Ie0ZXZhbOWHveaVsOaKpemUme+8jOaJgOS7peWNleeLrOWGmeWcqOS4gOS4qmpz5paH5Lu25Lit44CCXG5DcmVhdG9yLmV2YWxJbkNvbnRleHQgPSBmdW5jdGlvbihqcywgY29udGV4dCkge1xuICAgIC8vIyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgdGhlIGluLWxpbmUgYW5vbnltb3VzIGZ1bmN0aW9uIHdlIC5jYWxsIHdpdGggdGhlIHBhc3NlZCBjb250ZXh0XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkgeyBcbiAgICBcdHJldHVybiBldmFsKGpzKTsgXG5cdH0uY2FsbChjb250ZXh0KTtcbn1cblxuXG5DcmVhdG9yLmV2YWwgPSBmdW5jdGlvbihqcyl7XG5cdHJldHVybiBldmFsKGpzKVxufSIsIlx0Z2V0T3B0aW9uID0gKG9wdGlvbiktPlxuXHRcdGZvbyA9IG9wdGlvbi5zcGxpdChcIjpcIilcblx0XHRpZiBmb28ubGVuZ3RoID4gMVxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzFdfVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1swXX1cblxuXHRDcmVhdG9yLmNvbnZlcnRPYmplY3QgPSAob2JqZWN0KS0+XG5cdFx0Xy5mb3JFYWNoIG9iamVjdC50cmlnZ2VycywgKHRyaWdnZXIsIGtleSktPlxuXG5cdFx0XHRpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT0gXCJzZXJ2ZXJcIikgfHwgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCIpXG5cdFx0XHRcdF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXI/Ll90b2RvXG5cdFx0XHRcdF90b2RvX2Zyb21fZGIgPSB0cmlnZ2VyLnRvZG9cblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKVxuXHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXG5cblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpXG5cdFx0XHRcdFx0I+WPquaciXVwZGF0ZeaXtu+8jCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyDmiY3mnInlgLxcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph4/vvIzlsKTlhbbmmK9Db2xsZWN0aW9uXG5cdFx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcblx0XHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fZGJ9KVwiKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIihmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpeyN7X3RvZG9fZnJvbV9kYn19KVwiKVxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiXG5cdFx0XHRcdF90b2RvID0gdHJpZ2dlci50b2RvXG5cdFx0XHRcdGlmIF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbylcblx0XHRcdFx0XHR0cmlnZ2VyLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKVxuXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LmFjdGlvbnMsIChhY3Rpb24sIGtleSktPlxuXHRcdFx0XHRfdG9kb19mcm9tX2NvZGUgPSBhY3Rpb24/Ll90b2RvXG5cdFx0XHRcdF90b2RvX2Zyb21fZGIgPSBhY3Rpb24/LnRvZG9cblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKVxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj1xuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2NvZGV9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwidG9kb19mcm9tX2NvZGVcIiwgX3RvZG9fZnJvbV9jb2RlXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKVxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj1xuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcblx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2RifSlcIilcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKENyZWF0b3IuYWN0aW9uc0J5TmFtZVtfdG9kb19mcm9tX2RiXSlcblx0XHRcdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IF90b2RvX2Zyb21fZGJcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKGZ1bmN0aW9uKCl7I3tfdG9kb19mcm9tX2RifX0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0b2RvX2Zyb21fZGJcIiwgX3RvZG9fZnJvbV9kYiwgZXJyb3JcblxuXHRcdFx0XHRfdmlzaWJsZSA9IGFjdGlvbj8uX3Zpc2libGVcblx0XHRcdFx0aWYgX3Zpc2libGVcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGFjdGlvbi52aXNpYmxlID0gQ3JlYXRvci5ldmFsKFwiKCN7X3Zpc2libGV9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiYWN0aW9uLnZpc2libGUgdG8gZnVuY3Rpb24gZXJyb3I6IFwiLCBlcnJvciwgX3Zpc2libGVcblx0XHRlbHNlXG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LmFjdGlvbnMsIChhY3Rpb24sIGtleSktPlxuXHRcdFx0XHRfdG9kbyA9IGFjdGlvbj8udG9kb1xuXHRcdFx0XHRpZiBfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXG5cdFx0XHRcdFx0YWN0aW9uLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKVxuXG5cdFx0XHRcdF92aXNpYmxlID0gYWN0aW9uPy52aXNpYmxlXG5cblx0XHRcdFx0aWYgX3Zpc2libGUgJiYgXy5pc0Z1bmN0aW9uKF92aXNpYmxlKVxuXHRcdFx0XHRcdGFjdGlvbi5fdmlzaWJsZSA9IF92aXNpYmxlLnRvU3RyaW5nKClcblxuXHRcdF8uZm9yRWFjaCBvYmplY3QuZmllbGRzLCAoZmllbGQsIGtleSktPlxuXHRcdFx0aWYgZmllbGQub3B0aW9ucyAmJiBfLmlzU3RyaW5nKGZpZWxkLm9wdGlvbnMpXG5cdFx0XHRcdHRyeVxuXHRcdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0XHQj5pSv5oyBXFxu5oiW6ICF6Iux5paH6YCX5Y+35YiG5YmyLFxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCAob3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRpZiBvcHRpb24uaW5kZXhPZihcIixcIilcblx0XHRcdFx0XHRcdFx0b3B0aW9ucyA9IG9wdGlvbi5zcGxpdChcIixcIilcblx0XHRcdFx0XHRcdFx0Xy5mb3JFYWNoIG9wdGlvbnMsIChfb3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24oX29wdGlvbikpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXG5cdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXG5cdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcblxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5vcHRpb25zICYmICFfLmlzRnVuY3Rpb24oZmllbGQub3B0aW9ucykgJiYgIV8uaXNBcnJheShmaWVsZC5vcHRpb25zKSAmJiBfLmlzT2JqZWN0KGZpZWxkLm9wdGlvbnMpXG5cdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0Xy5lYWNoIGZpZWxkLm9wdGlvbnMsICh2LCBrKS0+XG5cdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IHYsIHZhbHVlOiBrfVxuXHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdG9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnMpXG5cdFx0XHRcdFx0ZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0b3B0aW9ucyA9IGZpZWxkLl9vcHRpb25zXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc1N0cmluZyhvcHRpb25zKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IENyZWF0b3IuZXZhbChcIigje29wdGlvbnN9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLnJlZ0V4XG5cdFx0XHRcdGlmIHJlZ0V4XG5cdFx0XHRcdFx0ZmllbGQuX3JlZ0V4ID0gZmllbGQucmVnRXgudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLl9yZWdFeFxuXHRcdFx0XHRpZiByZWdFeFxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQucmVnRXggPSBDcmVhdG9yLmV2YWwoXCIoI3tyZWdFeH0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdGlmIGZpZWxkLmF1dG9mb3JtXG5cdFx0XHRcdFx0X3R5cGUgPSBmaWVsZC5hdXRvZm9ybS50eXBlXG5cdFx0XHRcdFx0aWYgX3R5cGUgJiYgXy5pc0Z1bmN0aW9uKF90eXBlKSAmJiBfdHlwZSAhPSBPYmplY3QgJiYgX3R5cGUgIT0gU3RyaW5nICYmIF90eXBlICE9IE51bWJlciAmJiBfdHlwZSAhPSBCb29sZWFuICYmICFfLmlzQXJyYXkoX3R5cGUpXG5cdFx0XHRcdFx0XHRmaWVsZC5hdXRvZm9ybS5fdHlwZSA9IF90eXBlLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgZmllbGQuYXV0b2Zvcm1cblx0XHRcdFx0XHRfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLl90eXBlXG5cdFx0XHRcdFx0aWYgX3R5cGUgJiYgXy5pc1N0cmluZyhfdHlwZSlcblx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRmaWVsZC5hdXRvZm9ybS50eXBlID0gQ3JlYXRvci5ldmFsKFwiKCN7X3R5cGV9KVwiKVxuXHRcdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZmllbGQgLT4gdHlwZSBlcnJvclwiLCBmaWVsZCwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cblx0XHRcdFx0b3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uXG5cdFx0XHRcdHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uXG5cdFx0XHRcdGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxuXHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5maWx0ZXJzRnVuY3Rpb25cblxuXHRcdFx0XHRpZiBvcHRpb25zRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnNGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uID0gb3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKClcblxuXHRcdFx0XHRpZiByZWZlcmVuY2VfdG8gJiYgXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRmaWVsZC5fcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvLnRvU3RyaW5nKClcblxuXHRcdFx0XHRpZiBjcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oY3JlYXRlRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX2NyZWF0ZUZ1bmN0aW9uID0gY3JlYXRlRnVuY3Rpb24udG9TdHJpbmcoKVxuXHRcdFx0XHRpZiBiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGJlZm9yZU9wZW5GdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uID0gYmVmb3JlT3BlbkZ1bmN0aW9uLnRvU3RyaW5nKClcblxuXHRcdFx0XHRpZiBmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpbHRlcnNGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uID0gZmlsdGVyc0Z1bmN0aW9uLnRvU3RyaW5nKClcblx0XHRcdGVsc2VcblxuXHRcdFx0XHRvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uIHx8IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBmaWVsZC5fcmVmZXJlbmNlX3RvXG5cdFx0XHRcdGNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuX2NyZWF0ZUZ1bmN0aW9uXG5cdFx0XHRcdGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb25cblx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuX2ZpbHRlcnNGdW5jdGlvblxuXG5cdFx0XHRcdGlmIG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKG9wdGlvbnNGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tvcHRpb25zRnVuY3Rpb259KVwiKVxuXG5cdFx0XHRcdGlmIHJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKHJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRmaWVsZC5yZWZlcmVuY2VfdG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tyZWZlcmVuY2VfdG99KVwiKVxuXG5cdFx0XHRcdGlmIGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoY3JlYXRlRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tjcmVhdGVGdW5jdGlvbn0pXCIpXG5cblx0XHRcdFx0aWYgYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoYmVmb3JlT3BlbkZ1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2JlZm9yZU9wZW5GdW5jdGlvbn0pXCIpXG5cblx0XHRcdFx0aWYgZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcoZmlsdGVyc0Z1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlcnNGdW5jdGlvbn0pXCIpXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblx0XHRcdFx0aWYgZGVmYXVsdFZhbHVlICYmIF8uaXNGdW5jdGlvbihkZWZhdWx0VmFsdWUpXG5cdFx0XHRcdFx0ZmllbGQuX2RlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZS50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLl9kZWZhdWx0VmFsdWVcblxuXHRcdFx0XHRpZiAhZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZmllbGQuZGVmYXVsdFZhbHVlKSAmJiBmaWVsZC5kZWZhdWx0VmFsdWUuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXG5cdFx0XHRcdFx0ZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlXG5cblx0XHRcdFx0aWYgZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZGVmYXVsdFZhbHVlKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQuZGVmYXVsdFZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZGVmYXVsdFZhbHVlfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXHRcdFx0XG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0aXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdGlmIGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzRnVuY3Rpb24oaXNfY29tcGFueV9saW1pdGVkKVxuXHRcdFx0XHRcdGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdGlmIGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzU3RyaW5nKGlzX2NvbXBhbnlfbGltaXRlZClcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9IENyZWF0b3IuZXZhbChcIigje2lzX2NvbXBhbnlfbGltaXRlZH0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdF8uZm9yRWFjaCBvYmplY3QubGlzdF92aWV3cywgKGxpc3Rfdmlldywga2V5KSAtPlxuXHRcdFx0IyMjXG5cdFx0XHTop4blm77ov4fomZHlmajpnIDopoHmlK/mjIFmdW5jdGlvbu+8jOWQjuWPsOi9rOaIkOWtl+espuS4su+8jOWJjeWPsGV2YWzmiJDlh73mlbBcblx0XHRcdOiuqei/h+iZkeWZqOaUr+aMgeS4pOenjWZ1bmN0aW9u5pa55byP77yaXG5cdFx0XHQxLiDmlbTkuKpmaWx0ZXJz5Li6ZnVuY3Rpb246XG5cdFx0XHTlpoLvvJpcblx0XHRcdGZpbHRlcnM6ICgpLT5cblx0XHRcdFx0cmV0dXJuIFtbW1wib2JqZWN0X25hbWVcIixcIj1cIixcInByb2plY3RfaXNzdWVzXCJdLCdvcicsW1wib2JqZWN0X25hbWVcIixcIj1cIixcInRhc2tzXCJdXV1cblx0XHRcdDIuIGZpbHRlcnPlhoXnmoRmaWx0ZXIudmFsdWXkuLpmdW5jdGlvblxuXHRcdFx05aaC77yaXG5cdFx0XHRmaWx0ZXJzOiBbW1wib2JqZWN0X25hbWVcIiwgXCI9XCIsICgpLT5cblx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuXHRcdFx0XV1cblx0XHRcdOaIllxuXHRcdFx0ZmlsdGVyczogW3tcblx0XHRcdFx0XCJmaWVsZFwiOiBcIm9iamVjdF9uYW1lXCJcblx0XHRcdFx0XCJvcGVyYXRpb25cIjogXCI9XCJcblx0XHRcdFx0XCJ2YWx1ZVwiOiAoKS0+XG5cdFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuXHRcdFx0fV1cblx0XHRcdCMjI1xuXHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGxpc3Rfdmlldy5maWx0ZXJzKVxuXHRcdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0XHRsaXN0X3ZpZXcuX2ZpbHRlcnMgPSBsaXN0X3ZpZXcuZmlsdGVycy50b1N0cmluZygpXG5cdFx0XHRlbHNlIGlmIF8uaXNTdHJpbmcobGlzdF92aWV3Ll9maWx0ZXJzKVxuXHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRsaXN0X3ZpZXcuZmlsdGVycyA9IENyZWF0b3IuZXZhbChcIigje2xpc3Rfdmlldy5fZmlsdGVyc30pXCIpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdF8uZm9yRWFjaCBsaXN0X3ZpZXcuZmlsdGVycywgKGZpbHRlciwgX2luZGV4KS0+XG5cdFx0XHRcdFx0aWYgXy5pc0FycmF5KGZpbHRlcilcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDMgYW5kIF8uaXNGdW5jdGlvbihmaWx0ZXJbMl0pXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzJdID0gZmlsdGVyWzJdLnRvU3RyaW5nKClcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkZVTkNUSU9OXCJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmaWx0ZXIubGVuZ3RoID09IDMgYW5kIF8uaXNEYXRlKGZpbHRlclsyXSlcblx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOaYr0RhdGXnsbvlnovvvIzliJlmaWx0ZXJbMl3lgLzliLDliY3nq6/kvJroh6rliqjovazmiJDlrZfnrKbkuLLvvIzmoLzlvI/vvJpcIjIwMTgtMDMtMjlUMDM6NDM6MjEuNzg3WlwiXG5cdFx0XHRcdFx0XHRcdFx0IyDljIXmi6xncmlk5YiX6KGo6K+35rGC55qE5o6l5Y+j5Zyo5YaF55qE5omA5pyJT0RhdGHmjqXlj6PvvIxEYXRl57G75Z6L5a2X5q616YO95Lya5Lul5LiK6L+w5qC85byP6L+U5ZueXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzNdID0gXCJEQVRFXCJcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgZmlsdGVyLmxlbmd0aCA9PSA0IGFuZCBfLmlzU3RyaW5nKGZpbHRlclsyXSkgYW5kIGZpbHRlclszXSA9PSBcIkZVTkNUSU9OXCJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXJbMl19KVwiKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5wb3AoKVxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDQgYW5kIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSBhbmQgZmlsdGVyWzNdID09IFwiREFURVwiXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzJdID0gbmV3IERhdGUoZmlsdGVyWzJdKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5wb3AoKVxuXHRcdFx0XHRcdGVsc2UgaWYgXy5pc09iamVjdChmaWx0ZXIpXG5cdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpbHRlcj8udmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0RhdGUoZmlsdGVyPy52YWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIuX2lzX2RhdGUgPSB0cnVlXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcoZmlsdGVyPy5fdmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyLl92YWx1ZX0pXCIpXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgZmlsdGVyLl9pc19kYXRlID09IHRydWVcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIudmFsdWUgPSBuZXcgRGF0ZShmaWx0ZXIudmFsdWUpXG5cdFx0cmV0dXJuIG9iamVjdFxuXG5cbiIsInZhciBnZXRPcHRpb247XG5cbmdldE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICB2YXIgZm9vO1xuICBmb28gPSBvcHRpb24uc3BsaXQoXCI6XCIpO1xuICBpZiAoZm9vLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMV1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1swXVxuICAgIH07XG4gIH1cbn07XG5cbkNyZWF0b3IuY29udmVydE9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICBfLmZvckVhY2gob2JqZWN0LnRyaWdnZXJzLCBmdW5jdGlvbih0cmlnZ2VyLCBrZXkpIHtcbiAgICB2YXIgX3RvZG8sIF90b2RvX2Zyb21fY29kZSwgX3RvZG9fZnJvbV9kYjtcbiAgICBpZiAoKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcInNlcnZlclwiKSB8fCAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIpKSB7XG4gICAgICBfdG9kb19mcm9tX2NvZGUgPSB0cmlnZ2VyICE9IG51bGwgPyB0cmlnZ2VyLl90b2RvIDogdm9pZCAwO1xuICAgICAgX3RvZG9fZnJvbV9kYiA9IHRyaWdnZXIudG9kbztcbiAgICAgIGlmIChfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpKSB7XG4gICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9jb2RlICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKSkge1xuICAgICAgICBpZiAoX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fZGIgKyBcIilcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKXtcIiArIF90b2RvX2Zyb21fZGIgKyBcIn0pXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIikge1xuICAgICAgX3RvZG8gPSB0cmlnZ2VyLnRvZG87XG4gICAgICBpZiAoX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKSkge1xuICAgICAgICByZXR1cm4gdHJpZ2dlci5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QuYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBrZXkpIHtcbiAgICAgIHZhciBfdG9kb19mcm9tX2NvZGUsIF90b2RvX2Zyb21fZGIsIF92aXNpYmxlLCBlcnJvcjtcbiAgICAgIF90b2RvX2Zyb21fY29kZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLl90b2RvIDogdm9pZCAwO1xuICAgICAgX3RvZG9fZnJvbV9kYiA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnRvZG8gOiB2b2lkIDA7XG4gICAgICBpZiAoX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2NvZGUgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0b2RvX2Zyb21fY29kZVwiLCBfdG9kb19mcm9tX2NvZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9kYiArIFwiKVwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihDcmVhdG9yLmFjdGlvbnNCeU5hbWVbX3RvZG9fZnJvbV9kYl0pKSB7XG4gICAgICAgICAgICAgIGFjdGlvbi50b2RvID0gX3RvZG9fZnJvbV9kYjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoZnVuY3Rpb24oKXtcIiArIF90b2RvX2Zyb21fZGIgKyBcIn0pXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcInRvZG9fZnJvbV9kYlwiLCBfdG9kb19mcm9tX2RiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIF92aXNpYmxlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24uX3Zpc2libGUgOiB2b2lkIDA7XG4gICAgICBpZiAoX3Zpc2libGUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gYWN0aW9uLnZpc2libGUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF92aXNpYmxlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImFjdGlvbi52aXNpYmxlIHRvIGZ1bmN0aW9uIGVycm9yOiBcIiwgZXJyb3IsIF92aXNpYmxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QuYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBrZXkpIHtcbiAgICAgIHZhciBfdG9kbywgX3Zpc2libGU7XG4gICAgICBfdG9kbyA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnRvZG8gOiB2b2lkIDA7XG4gICAgICBpZiAoX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKSkge1xuICAgICAgICBhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgX3Zpc2libGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi52aXNpYmxlIDogdm9pZCAwO1xuICAgICAgaWYgKF92aXNpYmxlICYmIF8uaXNGdW5jdGlvbihfdmlzaWJsZSkpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi5fdmlzaWJsZSA9IF92aXNpYmxlLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgXy5mb3JFYWNoKG9iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICB2YXIgX29wdGlvbnMsIF90eXBlLCBiZWZvcmVPcGVuRnVuY3Rpb24sIGNyZWF0ZUZ1bmN0aW9uLCBkZWZhdWx0VmFsdWUsIGVycm9yLCBmaWx0ZXJzRnVuY3Rpb24sIGlzX2NvbXBhbnlfbGltaXRlZCwgb3B0aW9ucywgb3B0aW9uc0Z1bmN0aW9uLCByZWZlcmVuY2VfdG8sIHJlZ0V4O1xuICAgIGlmIChmaWVsZC5vcHRpb25zICYmIF8uaXNTdHJpbmcoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICB2YXIgb3B0aW9ucztcbiAgICAgICAgICBpZiAob3B0aW9uLmluZGV4T2YoXCIsXCIpKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gb3B0aW9uLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgIHJldHVybiBfLmZvckVhY2gob3B0aW9ucywgZnVuY3Rpb24oX29wdGlvbikge1xuICAgICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24oX29wdGlvbikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLm9wdGlvbnMgJiYgIV8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zKSAmJiAhXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpICYmIF8uaXNPYmplY3QoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIF9vcHRpb25zID0gW107XG4gICAgICBfLmVhY2goZmllbGQub3B0aW9ucywgZnVuY3Rpb24odiwgaykge1xuICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgbGFiZWw6IHYsXG4gICAgICAgICAgdmFsdWU6IGtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzRnVuY3Rpb24ob3B0aW9ucykpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5fb3B0aW9ucztcbiAgICAgIGlmIChvcHRpb25zICYmIF8uaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBvcHRpb25zICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmVnRXggPSBmaWVsZC5yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICBmaWVsZC5fcmVnRXggPSBmaWVsZC5yZWdFeC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWdFeCA9IGZpZWxkLl9yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLnJlZ0V4ID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWdFeCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGlmIChmaWVsZC5hdXRvZm9ybSkge1xuICAgICAgICBfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLnR5cGU7XG4gICAgICAgIGlmIChfdHlwZSAmJiBfLmlzRnVuY3Rpb24oX3R5cGUpICYmIF90eXBlICE9PSBPYmplY3QgJiYgX3R5cGUgIT09IFN0cmluZyAmJiBfdHlwZSAhPT0gTnVtYmVyICYmIF90eXBlICE9PSBCb29sZWFuICYmICFfLmlzQXJyYXkoX3R5cGUpKSB7XG4gICAgICAgICAgZmllbGQuYXV0b2Zvcm0uX3R5cGUgPSBfdHlwZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChmaWVsZC5hdXRvZm9ybSkge1xuICAgICAgICBfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLl90eXBlO1xuICAgICAgICBpZiAoX3R5cGUgJiYgXy5pc1N0cmluZyhfdHlwZSkpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmllbGQuYXV0b2Zvcm0udHlwZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3R5cGUgKyBcIilcIik7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGZpZWxkIC0+IHR5cGUgZXJyb3JcIiwgZmllbGQsIGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uO1xuICAgICAgcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvbjtcbiAgICAgIGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgIGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgIGlmIChvcHRpb25zRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnNGdW5jdGlvbiA9IG9wdGlvbnNGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZmVyZW5jZV90byAmJiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICBmaWVsZC5fcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fY3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oYmVmb3JlT3BlbkZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uID0gYmVmb3JlT3BlbkZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJzRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gPSBmaWx0ZXJzRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9uc0Z1bmN0aW9uID0gZmllbGQuX29wdGlvbnNGdW5jdGlvbiB8fCBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5fcmVmZXJlbmNlX3RvO1xuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5fY3JlYXRlRnVuY3Rpb247XG4gICAgICBiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuX2ZpbHRlcnNGdW5jdGlvbjtcbiAgICAgIGlmIChvcHRpb25zRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhvcHRpb25zRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgb3B0aW9uc0Z1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgZmllbGQucmVmZXJlbmNlX3RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWZlcmVuY2VfdG8gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoY3JlYXRlRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhjcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGNyZWF0ZUZ1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGJlZm9yZU9wZW5GdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBiZWZvcmVPcGVuRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcoZmlsdGVyc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlcnNGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAmJiBfLmlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICBmaWVsZC5fZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLl9kZWZhdWx0VmFsdWU7XG4gICAgICBpZiAoIWRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGZpZWxkLmRlZmF1bHRWYWx1ZSkgJiYgZmllbGQuZGVmYXVsdFZhbHVlLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAoZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZGVmYXVsdFZhbHVlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgaWYgKGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzRnVuY3Rpb24oaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICByZXR1cm4gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgaWYgKGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzU3RyaW5nKGlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gZmllbGQuaXNfY29tcGFueV9saW1pdGVkID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBpc19jb21wYW55X2xpbWl0ZWQgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBfLmZvckVhY2gob2JqZWN0Lmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGxpc3Rfdmlldywga2V5KSB7XG5cbiAgICAvKlxuICAgIFx0XHRcdOinhuWbvui/h+iZkeWZqOmcgOimgeaUr+aMgWZ1bmN0aW9u77yM5ZCO5Y+w6L2s5oiQ5a2X56ym5Liy77yM5YmN5Y+wZXZhbOaIkOWHveaVsFxuICAgIFx0XHRcdOiuqei/h+iZkeWZqOaUr+aMgeS4pOenjWZ1bmN0aW9u5pa55byP77yaXG4gICAgXHRcdFx0MS4g5pW05LiqZmlsdGVyc+S4umZ1bmN0aW9uOlxuICAgIFx0XHRcdOWmgu+8mlxuICAgIFx0XHRcdGZpbHRlcnM6ICgpLT5cbiAgICBcdFx0XHRcdHJldHVybiBbW1tcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJwcm9qZWN0X2lzc3Vlc1wiXSwnb3InLFtcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJ0YXNrc1wiXV1dXG4gICAgXHRcdFx0Mi4gZmlsdGVyc+WGheeahGZpbHRlci52YWx1ZeS4umZ1bmN0aW9uXG4gICAgXHRcdFx05aaC77yaXG4gICAgXHRcdFx0ZmlsdGVyczogW1tcIm9iamVjdF9uYW1lXCIsIFwiPVwiLCAoKS0+XG4gICAgXHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG4gICAgXHRcdFx0XV1cbiAgICBcdFx0XHTmiJZcbiAgICBcdFx0XHRmaWx0ZXJzOiBbe1xuICAgIFx0XHRcdFx0XCJmaWVsZFwiOiBcIm9iamVjdF9uYW1lXCJcbiAgICBcdFx0XHRcdFwib3BlcmF0aW9uXCI6IFwiPVwiXG4gICAgXHRcdFx0XHRcInZhbHVlXCI6ICgpLT5cbiAgICBcdFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuICAgIFx0XHRcdH1dXG4gICAgICovXG4gICAgaWYgKF8uaXNGdW5jdGlvbihsaXN0X3ZpZXcuZmlsdGVycykpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlldy5fZmlsdGVycyA9IGxpc3Rfdmlldy5maWx0ZXJzLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKGxpc3Rfdmlldy5fZmlsdGVycykpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlldy5maWx0ZXJzID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBsaXN0X3ZpZXcuX2ZpbHRlcnMgKyBcIilcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBfLmZvckVhY2gobGlzdF92aWV3LmZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlciwgX2luZGV4KSB7XG4gICAgICAgIGlmIChfLmlzQXJyYXkoZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSAzICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJbMl0pKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IGZpbHRlclsyXS50b1N0cmluZygpO1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyWzNdID0gXCJGVU5DVElPTlwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubGVuZ3RoID09PSAzICYmIF8uaXNEYXRlKGZpbHRlclsyXSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlclszXSA9IFwiREFURVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gNCAmJiBfLmlzU3RyaW5nKGZpbHRlclsyXSkgJiYgZmlsdGVyWzNdID09PSBcIkZVTkNUSU9OXCIpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXJbMl0gKyBcIilcIik7XG4gICAgICAgICAgICAgIGZpbHRlci5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSA0ICYmIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSAmJiBmaWx0ZXJbM10gPT09IFwiREFURVwiKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IG5ldyBEYXRlKGZpbHRlclsyXSk7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNEYXRlKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLl9pc19kYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIuX3ZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXIuX3ZhbHVlICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIuX2lzX2RhdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsIkNyZWF0b3IuRm9ybXVsYXIgPSB7fVxuXG5DcmVhdG9yLkZvcm11bGFyLlBSRUZJWCA9IFwiX1ZBTFVFU1wiXG5cbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gKHByZWZpeCxmaWVsZFZhcmlhYmxlKS0+XG5cdHJlZyA9IC8oXFx7W157fV0qXFx9KS9nO1xuXG5cdHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZSByZWcsIChtLCAkMSktPlxuXHRcdHJldHVybiBwcmVmaXggKyAkMS5yZXBsYWNlKC9cXHtcXHMqLyxcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLFwiXFxcIl1cIikucmVwbGFjZSgvXFxzKlxcLlxccyovZyxcIlxcXCJdW1xcXCJcIik7XG5cblx0cmV0dXJuIHJldlxuXG5DcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYSA9IChmb3JtdWxhX3N0ciktPlxuXHRpZiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTFcblx0XHRyZXR1cm4gdHJ1ZVxuXHRyZXR1cm4gZmFsc2VcblxuQ3JlYXRvci5Gb3JtdWxhci5ydW4gPSAoZm9ybXVsYV9zdHIsIF9DT05URVhULCBvcHRpb25zKS0+XG5cdGlmIGZvcm11bGFfc3RyICYmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpXG5cblx0XHRpZiAhXy5pc0Jvb2xlYW4ob3B0aW9ucz8uZXh0ZW5kKVxuXHRcdFx0ZXh0ZW5kID0gdHJ1ZVxuXG5cdFx0X1ZBTFVFUyA9IHt9XG5cdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIF9DT05URVhUKVxuXHRcdGlmIGV4dGVuZFxuXHRcdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucz8udXNlcklkLCBvcHRpb25zPy5zcGFjZUlkKSlcblx0XHRmb3JtdWxhX3N0ciA9IENyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhKFwidGhpc1wiLCBmb3JtdWxhX3N0cilcblxuXHRcdHRyeVxuXHRcdFx0ZGF0YSA9IENyZWF0b3IuZXZhbEluQ29udGV4dChmb3JtdWxhX3N0ciwgX1ZBTFVFUykgICAjIOatpOWkhOS4jeiDveeUqHdpbmRvdy5ldmFsIO+8jOS8muWvvOiHtOWPmOmHj+S9nOeUqOWfn+W8guW4uFxuXHRcdFx0cmV0dXJuIGRhdGFcblx0XHRjYXRjaCBlXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46ICN7Zm9ybXVsYV9zdHJ9XCIsIGUpXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0dG9hc3RyPy5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46ICN7Zm9ybXVsYV9zdHJ9I3tlfVwiXG5cblx0cmV0dXJuIGZvcm11bGFfc3RyXG4iLCJDcmVhdG9yLkZvcm11bGFyID0ge307XG5cbkNyZWF0b3IuRm9ybXVsYXIuUFJFRklYID0gXCJfVkFMVUVTXCI7XG5cbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gZnVuY3Rpb24ocHJlZml4LCBmaWVsZFZhcmlhYmxlKSB7XG4gIHZhciByZWcsIHJldjtcbiAgcmVnID0gLyhcXHtbXnt9XSpcXH0pL2c7XG4gIHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZShyZWcsIGZ1bmN0aW9uKG0sICQxKSB7XG4gICAgcmV0dXJuIHByZWZpeCArICQxLnJlcGxhY2UoL1xce1xccyovLCBcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLCBcIlxcXCJdXCIpLnJlcGxhY2UoL1xccypcXC5cXHMqL2csIFwiXFxcIl1bXFxcIlwiKTtcbiAgfSk7XG4gIHJldHVybiByZXY7XG59O1xuXG5DcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYSA9IGZ1bmN0aW9uKGZvcm11bGFfc3RyKSB7XG4gIGlmIChfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTEpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5DcmVhdG9yLkZvcm11bGFyLnJ1biA9IGZ1bmN0aW9uKGZvcm11bGFfc3RyLCBfQ09OVEVYVCwgb3B0aW9ucykge1xuICB2YXIgX1ZBTFVFUywgZGF0YSwgZSwgZXh0ZW5kO1xuICBpZiAoZm9ybXVsYV9zdHIgJiYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cikpIHtcbiAgICBpZiAoIV8uaXNCb29sZWFuKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuZXh0ZW5kIDogdm9pZCAwKSkge1xuICAgICAgZXh0ZW5kID0gdHJ1ZTtcbiAgICB9XG4gICAgX1ZBTFVFUyA9IHt9O1xuICAgIF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBfQ09OVEVYVCk7XG4gICAgaWYgKGV4dGVuZCkge1xuICAgICAgX1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy51c2VySWQgOiB2b2lkIDAsIG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc3BhY2VJZCA6IHZvaWQgMCkpO1xuICAgIH1cbiAgICBmb3JtdWxhX3N0ciA9IENyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhKFwidGhpc1wiLCBmb3JtdWxhX3N0cik7XG4gICAgdHJ5IHtcbiAgICAgIGRhdGEgPSBDcmVhdG9yLmV2YWxJbkNvbnRleHQoZm9ybXVsYV9zdHIsIF9WQUxVRVMpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGUgPSBlcnJvcjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogXCIgKyBmb3JtdWxhX3N0ciwgZSk7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdG9hc3RyICE9PSBcInVuZGVmaW5lZFwiICYmIHRvYXN0ciAhPT0gbnVsbCkge1xuICAgICAgICAgIHRvYXN0ci5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46IFwiICsgZm9ybXVsYV9zdHIgKyBlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZvcm11bGFfc3RyO1xufTtcbiIsIlxuQ3JlYXRvci5vYmplY3RzQnlOYW1lID0ge30gICAjIOatpOWvueixoeWPquiDveWcqOehruS/neaJgOaciU9iamVjdOWIneWni+WMluWujOaIkOWQjuiwg+eUqO+8jCDlkKbliJnojrflj5bliLDnmoRvYmplY3TkuI3lhahcblxuQ3JlYXRvci5mb3JtYXRPYmplY3ROYW1lID0gKG9iamVjdF9uYW1lKS0+XG5cdGlmIG9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2Nmcy5maWxlcy4nKVxuXHRcdG9iamVjdF9uYW1lID0gb2JqZWN0X25hbWUucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcLicsICdnJyksICdfJylcblx0cmV0dXJuIG9iamVjdF9uYW1lXG5cbkNyZWF0b3IuT2JqZWN0ID0gKG9wdGlvbnMpLT5cblx0c2VsZiA9IHRoaXNcblx0aWYgKCFvcHRpb25zLm5hbWUpXG5cdFx0Y29uc29sZS5lcnJvcihvcHRpb25zKVxuXHRcdHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xuXG5cdHNlbGYuX2lkID0gb3B0aW9ucy5faWQgfHwgb3B0aW9ucy5uYW1lXG5cdHNlbGYuc3BhY2UgPSBvcHRpb25zLnNwYWNlXG5cdHNlbGYubmFtZSA9IG9wdGlvbnMubmFtZVxuXHRzZWxmLmxhYmVsID0gb3B0aW9ucy5sYWJlbFxuXHRzZWxmLmljb24gPSBvcHRpb25zLmljb25cblx0c2VsZi5kZXNjcmlwdGlvbiA9IG9wdGlvbnMuZGVzY3JpcHRpb25cblx0c2VsZi5pc192aWV3ID0gb3B0aW9ucy5pc192aWV3XG5cdGlmICFfLmlzQm9vbGVhbihvcHRpb25zLmlzX2VuYWJsZSkgIHx8IG9wdGlvbnMuaXNfZW5hYmxlID09IHRydWVcblx0XHRzZWxmLmlzX2VuYWJsZSA9IHRydWVcblx0ZWxzZVxuXHRcdHNlbGYuaXNfZW5hYmxlID0gZmFsc2Vcblx0c2VsZi5lbmFibGVfc2VhcmNoID0gb3B0aW9ucy5lbmFibGVfc2VhcmNoXG5cdHNlbGYuZW5hYmxlX2ZpbGVzID0gb3B0aW9ucy5lbmFibGVfZmlsZXNcblx0c2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrc1xuXHRzZWxmLmVuYWJsZV9ub3RlcyA9IG9wdGlvbnMuZW5hYmxlX25vdGVzXG5cdHNlbGYuZW5hYmxlX2F1ZGl0ID0gb3B0aW9ucy5lbmFibGVfYXVkaXRcblx0c2VsZi5oaWRkZW4gPSBvcHRpb25zLmhpZGRlblxuXHRzZWxmLmVuYWJsZV9hcGkgPSAob3B0aW9ucy5lbmFibGVfYXBpID09IHVuZGVmaW5lZCkgb3Igb3B0aW9ucy5lbmFibGVfYXBpXG5cdHNlbGYuY3VzdG9tID0gb3B0aW9ucy5jdXN0b21cblx0c2VsZi5lbmFibGVfc2hhcmUgPSBvcHRpb25zLmVuYWJsZV9zaGFyZVxuXHRzZWxmLmVuYWJsZV9pbnN0YW5jZXMgPSBvcHRpb25zLmVuYWJsZV9pbnN0YW5jZXNcblx0c2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWVcblx0c2VsZi5vcGVuX3dpbmRvdyA9IG9wdGlvbnMub3Blbl93aW5kb3dcblx0c2VsZi5maWx0ZXJfY29tcGFueSA9IG9wdGlvbnMuZmlsdGVyX2NvbXBhbnlcblx0c2VsZi5jYWxlbmRhciA9IF8uY2xvbmUob3B0aW9ucy5jYWxlbmRhcilcblx0c2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpXG5cdHNlbGYuZW5hYmxlX2NoYXR0ZXIgPSBvcHRpb25zLmVuYWJsZV9jaGF0dGVyXG5cdHNlbGYuZW5hYmxlX3RyYXNoID0gb3B0aW9ucy5lbmFibGVfdHJhc2hcblx0c2VsZi5lbmFibGVfc3BhY2VfZ2xvYmFsID0gb3B0aW9ucy5lbmFibGVfc3BhY2VfZ2xvYmFsXG5cdHNlbGYuZW5hYmxlX2FwcHJvdmFscyA9IG9wdGlvbnMuZW5hYmxlX2FwcHJvdmFsc1xuXHRzZWxmLmlkRmllbGROYW1lID0gJ19pZCdcblx0aWYgb3B0aW9ucy5kYXRhYmFzZV9uYW1lXG5cdFx0c2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lXG5cdGlmICghb3B0aW9ucy5maWVsZHMpXG5cdFx0Y29uc29sZS5lcnJvcihvcHRpb25zKVxuXHRcdHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xuXG5cdHNlbGYuZmllbGRzID0gXy5jbG9uZShvcHRpb25zLmZpZWxkcylcblxuXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdGlmIGZpZWxkX25hbWUgPT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWVcblx0XHRcdHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lXG5cdFx0aWYgZmllbGQucHJpbWFyeVxuXHRcdFx0c2VsZi5pZEZpZWxkTmFtZSA9IGZpZWxkX25hbWVcblxuXHRpZiAhb3B0aW9ucy5kYXRhYmFzZV9uYW1lIHx8IG9wdGlvbnMuZGF0YWJhc2VfbmFtZSA9PSAnbWV0ZW9yLW1vbmdvJ1xuXHRcdF8uZWFjaCBDcmVhdG9yLmJhc2VPYmplY3QuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRcdGlmICFzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXVxuXHRcdFx0XHRzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IHt9XG5cdFx0XHRzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoZmllbGQpLCBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSlcblxuXHRzZWxmLmxpc3Rfdmlld3MgPSB7fVxuXHRkZWZhdWx0Q29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMoc2VsZi5uYW1lKVxuXHRfLmVhY2ggb3B0aW9ucy5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0b2l0ZW0gPSBDcmVhdG9yLmNvbnZlcnRMaXN0VmlldyhkZWZhdWx0Q29sdW1ucywgaXRlbSwgaXRlbV9uYW1lKVxuXHRcdHNlbGYubGlzdF92aWV3c1tpdGVtX25hbWVdID0gb2l0ZW1cblxuXHRzZWxmLnRyaWdnZXJzID0gXy5jbG9uZShDcmVhdG9yLmJhc2VPYmplY3QudHJpZ2dlcnMpXG5cdF8uZWFjaCBvcHRpb25zLnRyaWdnZXJzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXVxuXHRcdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0ge31cblx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0ubmFtZSA9IGl0ZW1fbmFtZVxuXHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSlcblxuXHRzZWxmLmFjdGlvbnMgPSBfLmNsb25lKENyZWF0b3IuYmFzZU9iamVjdC5hY3Rpb25zKVxuXHRfLmVhY2ggb3B0aW9ucy5hY3Rpb25zLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYuYWN0aW9uc1tpdGVtX25hbWVdXG5cdFx0XHRzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IHt9XG5cdFx0Y29weUl0ZW0gPSBfLmNsb25lKHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKVxuXHRcdGRlbGV0ZSBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSAj5YWI5Yig6Zmk55u45YWz5bGe5oCn5YaN6YeN5bu65omN6IO95L+d6K+B5ZCO57ut6YeN5aSN5a6a5LmJ55qE5bGe5oCn6aG65bqP55Sf5pWIXG5cdFx0c2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChjb3B5SXRlbSwgaXRlbSlcblxuXHRfLmVhY2ggc2VsZi5hY3Rpb25zLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aXRlbS5uYW1lID0gaXRlbV9uYW1lXG5cblx0c2VsZi5yZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKHNlbGYubmFtZSlcblxuXHQjIOiuqeaJgOaciW9iamVjdOm7mOiupOacieaJgOaciWxpc3Rfdmlld3MvYWN0aW9ucy9yZWxhdGVkX29iamVjdHMvcmVhZGFibGVfZmllbGRzL2VkaXRhYmxlX2ZpZWxkc+WujOaVtOadg+mZkO+8jOivpeadg+mZkOWPr+iDveiiq+aVsOaNruW6k+S4reiuvue9rueahGFkbWluL3VzZXLmnYPpmZDopobnm5Zcblx0c2VsZi5wZXJtaXNzaW9uX3NldCA9IF8uY2xvbmUoQ3JlYXRvci5iYXNlT2JqZWN0LnBlcm1pc3Npb25fc2V0KVxuXHQjIGRlZmF1bHRMaXN0Vmlld3MgPSBfLmtleXMoc2VsZi5saXN0X3ZpZXdzKVxuXHQjIGRlZmF1bHRBY3Rpb25zID0gXy5rZXlzKHNlbGYuYWN0aW9ucylcblx0IyBkZWZhdWx0UmVsYXRlZE9iamVjdHMgPSBfLnBsdWNrKHNlbGYucmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcblx0IyBkZWZhdWx0UmVhZGFibGVGaWVsZHMgPSBbXVxuXHQjIGRlZmF1bHRFZGl0YWJsZUZpZWxkcyA9IFtdXG5cdCMgXy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0IyBcdGlmICEoZmllbGQuaGlkZGVuKSAgICAjMjMxIG9taXTlrZfmrrXmlK/mjIHlnKjpnZ7nvJbovpHpobXpnaLmn6XnnIssIOWboOatpOWIoOmZpOS6huatpOWkhOWvuW9taXTnmoTliKTmlq1cblx0IyBcdFx0ZGVmYXVsdFJlYWRhYmxlRmllbGRzLnB1c2ggZmllbGRfbmFtZVxuXHQjIFx0XHRpZiAhZmllbGQucmVhZG9ubHlcblx0IyBcdFx0XHRkZWZhdWx0RWRpdGFibGVGaWVsZHMucHVzaCBmaWVsZF9uYW1lXG5cblx0IyBfLmVhY2ggc2VsZi5wZXJtaXNzaW9uX3NldCwgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHQjIFx0aWYgaXRlbV9uYW1lID09IFwibm9uZVwiXG5cdCMgXHRcdHJldHVyblxuXHQjIFx0aWYgc2VsZi5saXN0X3ZpZXdzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5saXN0X3ZpZXdzID0gZGVmYXVsdExpc3RWaWV3c1xuXHQjIFx0aWYgc2VsZi5hY3Rpb25zXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5hY3Rpb25zID0gZGVmYXVsdEFjdGlvbnNcblx0IyBcdGlmIHNlbGYucmVsYXRlZF9vYmplY3RzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5yZWxhdGVkX29iamVjdHMgPSBkZWZhdWx0UmVsYXRlZE9iamVjdHNcblx0IyBcdGlmIHNlbGYuZmllbGRzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5yZWFkYWJsZV9maWVsZHMgPSBkZWZhdWx0UmVhZGFibGVGaWVsZHNcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmVkaXRhYmxlX2ZpZWxkcyA9IGRlZmF1bHRFZGl0YWJsZUZpZWxkc1xuXHR1bmxlc3Mgb3B0aW9ucy5wZXJtaXNzaW9uX3NldFxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fVxuXHRpZiAhKG9wdGlvbnMucGVybWlzc2lvbl9zZXQ/LmFkbWluKVxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQuYWRtaW4gPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJhZG1pblwiXSlcblx0aWYgIShvcHRpb25zLnBlcm1pc3Npb25fc2V0Py51c2VyKVxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQudXNlciA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcInVzZXJcIl0pXG5cdF8uZWFjaCBvcHRpb25zLnBlcm1pc3Npb25fc2V0LCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXVxuXHRcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0ge31cblx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSksIGl0ZW0pXG5cblx0IyDliY3nq6/moLnmja5wZXJtaXNzaW9uc+aUueWGmWZpZWxk55u45YWz5bGe5oCn77yM5ZCO56uv5Y+q6KaB6LWw6buY6K6k5bGe5oCn5bCx6KGM77yM5LiN6ZyA6KaB5pS55YaZXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHBlcm1pc3Npb25zID0gb3B0aW9ucy5wZXJtaXNzaW9uc1xuXHRcdGRpc2FibGVkX2xpc3Rfdmlld3MgPSBwZXJtaXNzaW9ucz8uZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdGlmIGRpc2FibGVkX2xpc3Rfdmlld3M/Lmxlbmd0aFxuXHRcdFx0ZGVmYXVsdExpc3RWaWV3SWQgPSBvcHRpb25zLmxpc3Rfdmlld3M/LmFsbD8uX2lkXG5cdFx0XHRpZiBkZWZhdWx0TGlzdFZpZXdJZFxuXHRcdFx0XHQjIOaKiuinhuWbvuadg+mZkOmFjee9ruS4rem7mOiupOeahGFsbOinhuWbvmlk6L2s5o2i5oiQYWxs5YWz6ZSu5a2XXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBfLm1hcCBkaXNhYmxlZF9saXN0X3ZpZXdzLCAobGlzdF92aWV3X2l0ZW0pIC0+XG5cdFx0XHRcdFx0cmV0dXJuIGlmIGRlZmF1bHRMaXN0Vmlld0lkID09IGxpc3Rfdmlld19pdGVtIHRoZW4gXCJhbGxcIiBlbHNlIGxpc3Rfdmlld19pdGVtXG5cdFx0c2VsZi5wZXJtaXNzaW9ucyA9IG5ldyBSZWFjdGl2ZVZhcihwZXJtaXNzaW9ucylcblx0XHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdFx0aWYgZmllbGRcblx0XHRcdFx0aWYgXy5pbmRleE9mKHBlcm1pc3Npb25zPy51bnJlYWRhYmxlX2ZpZWxkcywgZmllbGRfbmFtZSkgPCAwXG5cdFx0XHRcdFx0aWYgZmllbGQuaGlkZGVuXG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRpZiBfLmluZGV4T2YocGVybWlzc2lvbnM/LnVuZWRpdGFibGVfZmllbGRzLCBmaWVsZF9uYW1lKSA+IC0xXG5cdFx0XHRcdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcblx0XHRcdFx0XHRcdGZpZWxkLmRpc2FibGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0IyDlvZPlj6ror7vml7bvvIzlpoLmnpzkuI3ljrvmjonlv4XloavlrZfmrrXvvIxhdXRvZm9ybeaYr+S8muaKpemUmeeahFxuXHRcdFx0XHRcdFx0ZmllbGQucmVxdWlyZWQgPSBmYWxzZVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZmllbGQuaGlkZGVuID0gdHJ1ZVxuXHRlbHNlXG5cdFx0c2VsZi5wZXJtaXNzaW9ucyA9IG51bGxcblxuXHRfZGIgPSBDcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24ob3B0aW9ucylcblxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zW19kYi5fbmFtZV0gPSBfZGJcblxuXHRzZWxmLmRiID0gX2RiXG5cblx0c2VsZi5fY29sbGVjdGlvbl9uYW1lID0gX2RiLl9uYW1lXG5cblx0c2NoZW1hID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoc2VsZilcblx0c2VsZi5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHNjaGVtYSlcblx0aWYgc2VsZi5uYW1lICE9IFwidXNlcnNcIiBhbmQgc2VsZi5uYW1lICE9IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIiAmJiAhc2VsZi5pc192aWV3ICYmICFfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXG5cdFx0ZWxzZVxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxuXHRpZiBzZWxmLm5hbWUgPT0gXCJ1c2Vyc1wiXG5cdFx0X2RiLl9zaW1wbGVTY2hlbWEgPSBzZWxmLnNjaGVtYVxuXG5cdGlmIF8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSlcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtyZXBsYWNlOiB0cnVlfSlcblxuXHRDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGZcblxuXHRyZXR1cm4gc2VsZlxuXG5DcmVhdG9yLk9iamVjdC5wcm90b3R5cGUuaTE4biA9ICgpLT5cblx0IyBzZXQgb2JqZWN0IGxhYmVsXG5cdHNlbGYgPSB0aGlzXG5cblx0a2V5ID0gc2VsZi5uYW1lXG5cdGlmIHQoa2V5KSA9PSBrZXlcblx0XHRpZiAhc2VsZi5sYWJlbFxuXHRcdFx0c2VsZi5sYWJlbCA9IHNlbGYubmFtZVxuXHRlbHNlXG5cdFx0c2VsZi5sYWJlbCA9IHQoa2V5KVxuXG5cdCMgc2V0IGZpZWxkIGxhYmVsc1xuXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdGZrZXkgPSBzZWxmLm5hbWUgKyBcIl9cIiArIGZpZWxkX25hbWVcblx0XHRpZiB0KGZrZXkpID09IGZrZXlcblx0XHRcdGlmICFmaWVsZC5sYWJlbFxuXHRcdFx0XHRmaWVsZC5sYWJlbCA9IGZpZWxkX25hbWVcblx0XHRlbHNlXG5cdFx0XHRmaWVsZC5sYWJlbCA9IHQoZmtleSlcblx0XHRzZWxmLnNjaGVtYT8uX3NjaGVtYT9bZmllbGRfbmFtZV0/LmxhYmVsID0gZmllbGQubGFiZWxcblxuXG5cdCMgc2V0IGxpc3R2aWV3IGxhYmVsc1xuXHRfLmVhY2ggc2VsZi5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aTE4bl9rZXkgPSBzZWxmLm5hbWUgKyBcIl9saXN0dmlld19cIiArIGl0ZW1fbmFtZVxuXHRcdGlmIHQoaTE4bl9rZXkpID09IGkxOG5fa2V5XG5cdFx0XHRpZiAhaXRlbS5sYWJlbFxuXHRcdFx0XHRpdGVtLmxhYmVsID0gaXRlbV9uYW1lXG5cdFx0ZWxzZVxuXHRcdFx0aXRlbS5sYWJlbCA9IHQoaTE4bl9rZXkpXG5cblxuQ3JlYXRvci5nZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCA9IChvYmplY3QpLT5cblx0aWYgb2JqZWN0XG5cdFx0aWYgIW9iamVjdC5kYXRhYmFzZV9uYW1lIHx8IG9iamVjdC5kYXRhYmFzZV9uYW1lID09ICdtZXRlb3ItbW9uZ28nXG5cdFx0XHRyZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCJcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gXCIvYXBpL29kYXRhLyN7b2JqZWN0LmRhdGFiYXNlX25hbWV9XCJcblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cblx0TWV0ZW9yLnN0YXJ0dXAgLT5cblx0XHRUcmFja2VyLmF1dG9ydW4gLT5cblx0XHRcdGlmIFNlc3Npb24uZ2V0KFwic3RlZWRvcy1sb2NhbGVcIikgJiYgQ3JlYXRvci5ib290c3RyYXBMb2FkZWQ/LmdldCgpXG5cdFx0XHRcdF8uZWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvYmplY3QsIG9iamVjdF9uYW1lKS0+XG5cdFx0XHRcdFx0b2JqZWN0LmkxOG4oKVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRpZiAhQ3JlYXRvci5ib290c3RyYXBMb2FkZWQgJiYgQ3JlYXRvci5PYmplY3RzXG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKG9iamVjdCktPlxuXHRcdFx0bmV3IENyZWF0b3IuT2JqZWN0KG9iamVjdClcblxuIiwiQ3JlYXRvci5vYmplY3RzQnlOYW1lID0ge307XG5cbkNyZWF0b3IuZm9ybWF0T2JqZWN0TmFtZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGlmIChvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjZnMuZmlsZXMuJykpIHtcbiAgICBvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpO1xuICB9XG4gIHJldHVybiBvYmplY3RfbmFtZTtcbn07XG5cbkNyZWF0b3IuT2JqZWN0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICB2YXIgX2RiLCBkZWZhdWx0Q29sdW1ucywgZGVmYXVsdExpc3RWaWV3SWQsIGRpc2FibGVkX2xpc3Rfdmlld3MsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHNjaGVtYSwgc2VsZjtcbiAgc2VsZiA9IHRoaXM7XG4gIGlmICghb3B0aW9ucy5uYW1lKSB7XG4gICAgY29uc29sZS5lcnJvcihvcHRpb25zKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IG5hbWUnKTtcbiAgfVxuICBzZWxmLl9pZCA9IG9wdGlvbnMuX2lkIHx8IG9wdGlvbnMubmFtZTtcbiAgc2VsZi5zcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gIHNlbGYubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgc2VsZi5sYWJlbCA9IG9wdGlvbnMubGFiZWw7XG4gIHNlbGYuaWNvbiA9IG9wdGlvbnMuaWNvbjtcbiAgc2VsZi5kZXNjcmlwdGlvbiA9IG9wdGlvbnMuZGVzY3JpcHRpb247XG4gIHNlbGYuaXNfdmlldyA9IG9wdGlvbnMuaXNfdmlldztcbiAgaWYgKCFfLmlzQm9vbGVhbihvcHRpb25zLmlzX2VuYWJsZSkgfHwgb3B0aW9ucy5pc19lbmFibGUgPT09IHRydWUpIHtcbiAgICBzZWxmLmlzX2VuYWJsZSA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5pc19lbmFibGUgPSBmYWxzZTtcbiAgfVxuICBzZWxmLmVuYWJsZV9zZWFyY2ggPSBvcHRpb25zLmVuYWJsZV9zZWFyY2g7XG4gIHNlbGYuZW5hYmxlX2ZpbGVzID0gb3B0aW9ucy5lbmFibGVfZmlsZXM7XG4gIHNlbGYuZW5hYmxlX3Rhc2tzID0gb3B0aW9ucy5lbmFibGVfdGFza3M7XG4gIHNlbGYuZW5hYmxlX25vdGVzID0gb3B0aW9ucy5lbmFibGVfbm90ZXM7XG4gIHNlbGYuZW5hYmxlX2F1ZGl0ID0gb3B0aW9ucy5lbmFibGVfYXVkaXQ7XG4gIHNlbGYuaGlkZGVuID0gb3B0aW9ucy5oaWRkZW47XG4gIHNlbGYuZW5hYmxlX2FwaSA9IChvcHRpb25zLmVuYWJsZV9hcGkgPT09IHZvaWQgMCkgfHwgb3B0aW9ucy5lbmFibGVfYXBpO1xuICBzZWxmLmN1c3RvbSA9IG9wdGlvbnMuY3VzdG9tO1xuICBzZWxmLmVuYWJsZV9zaGFyZSA9IG9wdGlvbnMuZW5hYmxlX3NoYXJlO1xuICBzZWxmLmVuYWJsZV9pbnN0YW5jZXMgPSBvcHRpb25zLmVuYWJsZV9pbnN0YW5jZXM7XG4gIHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlO1xuICBzZWxmLm9wZW5fd2luZG93ID0gb3B0aW9ucy5vcGVuX3dpbmRvdztcbiAgc2VsZi5maWx0ZXJfY29tcGFueSA9IG9wdGlvbnMuZmlsdGVyX2NvbXBhbnk7XG4gIHNlbGYuY2FsZW5kYXIgPSBfLmNsb25lKG9wdGlvbnMuY2FsZW5kYXIpO1xuICBzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcik7XG4gIHNlbGYuZW5hYmxlX2NoYXR0ZXIgPSBvcHRpb25zLmVuYWJsZV9jaGF0dGVyO1xuICBzZWxmLmVuYWJsZV90cmFzaCA9IG9wdGlvbnMuZW5hYmxlX3RyYXNoO1xuICBzZWxmLmVuYWJsZV9zcGFjZV9nbG9iYWwgPSBvcHRpb25zLmVuYWJsZV9zcGFjZV9nbG9iYWw7XG4gIHNlbGYuZW5hYmxlX2FwcHJvdmFscyA9IG9wdGlvbnMuZW5hYmxlX2FwcHJvdmFscztcbiAgc2VsZi5pZEZpZWxkTmFtZSA9ICdfaWQnO1xuICBpZiAob3B0aW9ucy5kYXRhYmFzZV9uYW1lKSB7XG4gICAgc2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lO1xuICB9XG4gIGlmICghb3B0aW9ucy5maWVsZHMpIHtcbiAgICBjb25zb2xlLmVycm9yKG9wdGlvbnMpO1xuICAgIHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xuICB9XG4gIHNlbGYuZmllbGRzID0gXy5jbG9uZShvcHRpb25zLmZpZWxkcyk7XG4gIF8uZWFjaChzZWxmLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoZmllbGRfbmFtZSA9PT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWUpIHtcbiAgICAgIHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICBpZiAoZmllbGQucHJpbWFyeSkge1xuICAgICAgcmV0dXJuIHNlbGYuaWRGaWVsZE5hbWUgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgfSk7XG4gIGlmICghb3B0aW9ucy5kYXRhYmFzZV9uYW1lIHx8IG9wdGlvbnMuZGF0YWJhc2VfbmFtZSA9PT0gJ21ldGVvci1tb25nbycpIHtcbiAgICBfLmVhY2goQ3JlYXRvci5iYXNlT2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgIGlmICghc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pIHtcbiAgICAgICAgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoZmllbGQpLCBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSk7XG4gICAgfSk7XG4gIH1cbiAgc2VsZi5saXN0X3ZpZXdzID0ge307XG4gIGRlZmF1bHRDb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhzZWxmLm5hbWUpO1xuICBfLmVhY2gob3B0aW9ucy5saXN0X3ZpZXdzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgb2l0ZW07XG4gICAgb2l0ZW0gPSBDcmVhdG9yLmNvbnZlcnRMaXN0VmlldyhkZWZhdWx0Q29sdW1ucywgaXRlbSwgaXRlbV9uYW1lKTtcbiAgICByZXR1cm4gc2VsZi5saXN0X3ZpZXdzW2l0ZW1fbmFtZV0gPSBvaXRlbTtcbiAgfSk7XG4gIHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKENyZWF0b3IuYmFzZU9iamVjdC50cmlnZ2Vycyk7XG4gIF8uZWFjaChvcHRpb25zLnRyaWdnZXJzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICBpZiAoIXNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXS5uYW1lID0gaXRlbV9uYW1lO1xuICAgIHJldHVybiBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSksIGl0ZW0pO1xuICB9KTtcbiAgc2VsZi5hY3Rpb25zID0gXy5jbG9uZShDcmVhdG9yLmJhc2VPYmplY3QuYWN0aW9ucyk7XG4gIF8uZWFjaChvcHRpb25zLmFjdGlvbnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHZhciBjb3B5SXRlbTtcbiAgICBpZiAoIXNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICBjb3B5SXRlbSA9IF8uY2xvbmUoc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pO1xuICAgIGRlbGV0ZSBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXTtcbiAgICByZXR1cm4gc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChjb3B5SXRlbSwgaXRlbSk7XG4gIH0pO1xuICBfLmVhY2goc2VsZi5hY3Rpb25zLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICByZXR1cm4gaXRlbS5uYW1lID0gaXRlbV9uYW1lO1xuICB9KTtcbiAgc2VsZi5yZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKHNlbGYubmFtZSk7XG4gIHNlbGYucGVybWlzc2lvbl9zZXQgPSBfLmNsb25lKENyZWF0b3IuYmFzZU9iamVjdC5wZXJtaXNzaW9uX3NldCk7XG4gIGlmICghb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fTtcbiAgfVxuICBpZiAoISgocmVmID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZi5hZG1pbiA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LmFkbWluID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1wiYWRtaW5cIl0pO1xuICB9XG4gIGlmICghKChyZWYxID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZjEudXNlciA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LnVzZXIgPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJ1c2VyXCJdKTtcbiAgfVxuICBfLmVhY2gob3B0aW9ucy5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgaWYgKCFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pLCBpdGVtKTtcbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnM7XG4gICAgZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzIDogdm9pZCAwO1xuICAgIGlmIChkaXNhYmxlZF9saXN0X3ZpZXdzICE9IG51bGwgPyBkaXNhYmxlZF9saXN0X3ZpZXdzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgZGVmYXVsdExpc3RWaWV3SWQgPSAocmVmMiA9IG9wdGlvbnMubGlzdF92aWV3cykgIT0gbnVsbCA/IChyZWYzID0gcmVmMi5hbGwpICE9IG51bGwgPyByZWYzLl9pZCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChkZWZhdWx0TGlzdFZpZXdJZCkge1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAoZGlzYWJsZWRfbGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3X2l0ZW0pIHtcbiAgICAgICAgICBpZiAoZGVmYXVsdExpc3RWaWV3SWQgPT09IGxpc3Rfdmlld19pdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJhbGxcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3Rfdmlld19pdGVtO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYucGVybWlzc2lvbnMgPSBuZXcgUmVhY3RpdmVWYXIocGVybWlzc2lvbnMpO1xuICAgIF8uZWFjaChzZWxmLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgIGlmIChmaWVsZCkge1xuICAgICAgICBpZiAoXy5pbmRleE9mKHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyA6IHZvaWQgMCwgZmllbGRfbmFtZSkgPCAwKSB7XG4gICAgICAgICAgaWYgKGZpZWxkLmhpZGRlbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXy5pbmRleE9mKHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA6IHZvaWQgMCwgZmllbGRfbmFtZSkgPiAtMSkge1xuICAgICAgICAgICAgZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgICAgICAgICAgZmllbGQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLnJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmaWVsZC5oaWRkZW4gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5wZXJtaXNzaW9ucyA9IG51bGw7XG4gIH1cbiAgX2RiID0gQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uKG9wdGlvbnMpO1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zW19kYi5fbmFtZV0gPSBfZGI7XG4gIHNlbGYuZGIgPSBfZGI7XG4gIHNlbGYuX2NvbGxlY3Rpb25fbmFtZSA9IF9kYi5fbmFtZTtcbiAgc2NoZW1hID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoc2VsZik7XG4gIHNlbGYuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYShzY2hlbWEpO1xuICBpZiAoc2VsZi5uYW1lICE9PSBcInVzZXJzXCIgJiYgc2VsZi5uYW1lICE9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIgJiYgIXNlbGYuaXNfdmlldyAmJiAhXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiXSwgc2VsZi5uYW1lKSkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChzZWxmLm5hbWUgPT09IFwidXNlcnNcIikge1xuICAgIF9kYi5fc2ltcGxlU2NoZW1hID0gc2VsZi5zY2hlbWE7XG4gIH1cbiAgaWYgKF8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSkpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGY7XG4gIHJldHVybiBzZWxmO1xufTtcblxuQ3JlYXRvci5PYmplY3QucHJvdG90eXBlLmkxOG4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGtleSwgc2VsZjtcbiAgc2VsZiA9IHRoaXM7XG4gIGtleSA9IHNlbGYubmFtZTtcbiAgaWYgKHQoa2V5KSA9PT0ga2V5KSB7XG4gICAgaWYgKCFzZWxmLmxhYmVsKSB7XG4gICAgICBzZWxmLmxhYmVsID0gc2VsZi5uYW1lO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzZWxmLmxhYmVsID0gdChrZXkpO1xuICB9XG4gIF8uZWFjaChzZWxmLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICB2YXIgZmtleSwgcmVmLCByZWYxLCByZWYyO1xuICAgIGZrZXkgPSBzZWxmLm5hbWUgKyBcIl9cIiArIGZpZWxkX25hbWU7XG4gICAgaWYgKHQoZmtleSkgPT09IGZrZXkpIHtcbiAgICAgIGlmICghZmllbGQubGFiZWwpIHtcbiAgICAgICAgZmllbGQubGFiZWwgPSBmaWVsZF9uYW1lO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmaWVsZC5sYWJlbCA9IHQoZmtleSk7XG4gICAgfVxuICAgIHJldHVybiAocmVmID0gc2VsZi5zY2hlbWEpICE9IG51bGwgPyAocmVmMSA9IHJlZi5fc2NoZW1hKSAhPSBudWxsID8gKHJlZjIgPSByZWYxW2ZpZWxkX25hbWVdKSAhPSBudWxsID8gcmVmMi5sYWJlbCA9IGZpZWxkLmxhYmVsIDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwO1xuICB9KTtcbiAgcmV0dXJuIF8uZWFjaChzZWxmLmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHZhciBpMThuX2tleTtcbiAgICBpMThuX2tleSA9IHNlbGYubmFtZSArIFwiX2xpc3R2aWV3X1wiICsgaXRlbV9uYW1lO1xuICAgIGlmICh0KGkxOG5fa2V5KSA9PT0gaTE4bl9rZXkpIHtcbiAgICAgIGlmICghaXRlbS5sYWJlbCkge1xuICAgICAgICByZXR1cm4gaXRlbS5sYWJlbCA9IGl0ZW1fbmFtZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGl0ZW0ubGFiZWwgPSB0KGkxOG5fa2V5KTtcbiAgICB9XG4gIH0pO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0KSB7XG4gICAgaWYgKCFvYmplY3QuZGF0YWJhc2VfbmFtZSB8fCBvYmplY3QuZGF0YWJhc2VfbmFtZSA9PT0gJ21ldGVvci1tb25nbycpIHtcbiAgICAgIHJldHVybiBcIi9hcGkvb2RhdGEvdjRcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiL2FwaS9vZGF0YS9cIiArIG9iamVjdC5kYXRhYmFzZV9uYW1lO1xuICAgIH1cbiAgfVxufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlZjtcbiAgICAgIGlmIChTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICYmICgocmVmID0gQ3JlYXRvci5ib290c3RyYXBMb2FkZWQpICE9IG51bGwgPyByZWYuZ2V0KCkgOiB2b2lkIDApKSB7XG4gICAgICAgIHJldHVybiBfLmVhY2goQ3JlYXRvci5vYmplY3RzQnlOYW1lLCBmdW5jdGlvbihvYmplY3QsIG9iamVjdF9uYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIG9iamVjdC5pMThuKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIGlmICghQ3JlYXRvci5ib290c3RyYXBMb2FkZWQgJiYgQ3JlYXRvci5PYmplY3RzKSB7XG4gICAgcmV0dXJuIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgcmV0dXJuIG5ldyBDcmVhdG9yLk9iamVjdChvYmplY3QpO1xuICAgIH0pO1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hID0gKG9iaikgLT5cblx0c2NoZW1hID0ge31cblxuXHRmaWVsZHNBcnIgPSBbXVxuXG5cdF8uZWFjaCBvYmouZmllbGRzICwgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0aWYgIV8uaGFzKGZpZWxkLCBcIm5hbWVcIilcblx0XHRcdGZpZWxkLm5hbWUgPSBmaWVsZF9uYW1lXG5cdFx0ZmllbGRzQXJyLnB1c2ggZmllbGRcblxuXHRfLmVhY2ggXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIChmaWVsZCktPlxuXG5cdFx0ZmllbGRfbmFtZSA9IGZpZWxkLm5hbWVcblxuXHRcdGZzID0ge31cblx0XHRpZiBmaWVsZC5yZWdFeFxuXHRcdFx0ZnMucmVnRXggPSBmaWVsZC5yZWdFeFxuXHRcdGZzLmF1dG9mb3JtID0ge31cblx0XHRmcy5hdXRvZm9ybS5tdWx0aXBsZSA9IGZpZWxkLm11bHRpcGxlXG5cdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRhdXRvZm9ybV90eXBlID0gZmllbGQuYXV0b2Zvcm0/LnR5cGVcblxuXHRcdGlmIGZpZWxkLnR5cGUgPT0gXCJ0ZXh0XCIgb3IgZmllbGQudHlwZSA9PSBcInBob25lXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJbdGV4dF1cIiBvciBmaWVsZC50eXBlID09IFwiW3Bob25lXVwiXG5cdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnY29kZSdcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCJcblx0XHRcdGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDEyXG5cdFx0XHRpZiBmaWVsZC5sYW5ndWFnZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5sYW5ndWFnZSA9IGZpZWxkLmxhbmd1YWdlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidGV4dGFyZWFcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgNlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInBhc3N3b3JkXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInBhc3N3b3JkXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRlXCJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKVxuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiXG5cdFx0XHRcdFx0XHRkYXRlTW9iaWxlT3B0aW9uczpcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLm91dEZvcm1hdCA9ICd5eXl5LU1NLWRkJztcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHRcdHRpbWV6b25lSWQ6IFwidXRjXCJcblx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiXG5cblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRldGltZVwiXG5cdFx0XHRmcy50eXBlID0gRGF0ZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKClcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHR0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIlxuXHRcdFx0XHRcdFx0ZGF0ZU1vYmlsZU9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXG5cdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJbT2JqZWN0XVwiXG5cdFx0XHRmcy50eXBlID0gW09iamVjdF1cblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJodG1sXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdHR5cGU6IFwic3VtbWVybm90ZVwiXG5cdFx0XHRcdGNsYXNzOiAnZWRpdG9yJ1xuXHRcdFx0XHRzZXR0aW5nczpcblx0XHRcdFx0XHRoZWlnaHQ6IDIwMFxuXHRcdFx0XHRcdGRpYWxvZ3NJbkJvZHk6IHRydWVcblx0XHRcdFx0XHR0b29sYmFyOiAgW1xuXHRcdFx0XHRcdFx0Wydmb250MScsIFsnc3R5bGUnXV0sXG5cdFx0XHRcdFx0XHRbJ2ZvbnQyJywgWydib2xkJywgJ3VuZGVybGluZScsICdpdGFsaWMnLCAnY2xlYXInXV0sXG5cdFx0XHRcdFx0XHRbJ2ZvbnQzJywgWydmb250bmFtZSddXSxcblx0XHRcdFx0XHRcdFsnY29sb3InLCBbJ2NvbG9yJ11dLFxuXHRcdFx0XHRcdFx0WydwYXJhJywgWyd1bCcsICdvbCcsICdwYXJhZ3JhcGgnXV0sXG5cdFx0XHRcdFx0XHRbJ3RhYmxlJywgWyd0YWJsZSddXSxcblx0XHRcdFx0XHRcdFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sXG5cdFx0XHRcdFx0XHRbJ3ZpZXcnLCBbJ2NvZGV2aWV3J11dXG5cdFx0XHRcdFx0XVxuXHRcdFx0XHRcdGZvbnROYW1lczogWydBcmlhbCcsICdDb21pYyBTYW5zIE1TJywgJ0NvdXJpZXIgTmV3JywgJ0hlbHZldGljYScsICdJbXBhY3QnLCAn5a6L5L2TJywn6buR5L2TJywn5b6u6L2v6ZuF6buRJywn5Lu/5a6LJywn5qW35L2TJywn6Zq25LmmJywn5bm85ZyGJ11cblxuXHRcdGVsc2UgaWYgKGZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIiBvciBmaWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKVxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblxuXHRcdFx0aWYgIWZpZWxkLmhpZGRlblxuXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmZpbHRlcnMgPSBmaWVsZC5maWx0ZXJzXG5cblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVwZW5kT24gPSBmaWVsZC5kZXBlbmRfb25cblxuXHRcdFx0XHRpZiBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblx0XHRcdFx0XHRmcy5iZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblxuXHRcdFx0XHRmcy5maWx0ZXJzRnVuY3Rpb24gPSBpZiBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gdGhlbiBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gZWxzZSBDcmVhdG9yLmV2YWx1YXRlRmlsdGVyc1xuXG5cdFx0XHRcdGlmIGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXHRcdFx0XHRcdGZzLm9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXG5cdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRpZiBmaWVsZC5jcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmllbGQuY3JlYXRlRnVuY3Rpb24pXG5cdFx0XHRcdFx0XHRcdGZzLmNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb25cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdFx0X3JlZl9vYmogPSBDcmVhdG9yLk9iamVjdHNbZmllbGQucmVmZXJlbmNlX3RvXVxuXHRcdFx0XHRcdFx0XHRcdGlmIF9yZWZfb2JqPy5wZXJtaXNzaW9ucz8uYWxsb3dDcmVhdGVcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IHRydWVcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmNyZWF0ZUZ1bmN0aW9uID0gKGxvb2t1cF9maWVsZCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRNb2RhbC5zaG93KFwiQ3JlYXRvck9iamVjdE1vZGFsXCIsIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuI3tDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvKS5fbmFtZX1cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3JtSWQ6IFwibmV3I3tmaWVsZC5yZWZlcmVuY2VfdG8ucmVwbGFjZSgnLicsJ18nKX1cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogXCIje2ZpZWxkLnJlZmVyZW5jZV90b31cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvcGVyYXRpb246IFwiaW5zZXJ0XCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b25TdWNjZXNzOiAob3BlcmF0aW9uLCByZXN1bHQpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIHJlc3VsdC5vYmplY3RfbmFtZSA9PSBcIm9iamVjdHNcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBfZmllbGQuYWRkSXRlbXMoW3tsYWJlbDogcmVzdWx0LnZhbHVlLmxhYmVsLCB2YWx1ZTogcmVzdWx0LnZhbHVlLm5hbWUsIGljb246IHJlc3VsdC52YWx1ZS5pY29ufV0sIHJlc3VsdC52YWx1ZS5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBfZmllbGQuYWRkSXRlbXMoW3tsYWJlbDogcmVzdWx0LnZhbHVlW29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gfHwgcmVzdWx0LnZhbHVlLmxhYmVsIHx8IHJlc3VsdC52YWx1ZS5uYW1lLCB2YWx1ZTogcmVzdWx0Ll9pZH1dLCByZXN1bHQuX2lkKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZhbHNlXG5cblx0XHRcdFx0XHRpZiBfLmlzQm9vbGVhbihmaWVsZC5jcmVhdGUpXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5jcmVhdGUgPSBmaWVsZC5jcmVhdGVcblxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV9zb3J0XG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zU29ydCA9IGZpZWxkLnJlZmVyZW5jZV9zb3J0XG5cblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfbGltaXRcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNMaW1pdCA9IGZpZWxkLnJlZmVyZW5jZV9saW1pdFxuXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvID09IFwidXNlcnNcIlxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0dXNlclwiXG5cdFx0XHRcdFx0XHRpZiAhZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0XG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5Y2V5L2N5LiL55qE5pWw5o2uXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk5Y+v5Lul6KKr5pS55YaZ6KaG55uW5oiQdHJ1ZS9mYWxzZeaIluWFtuS7lmZ1bmN0aW9uXG5cdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxuXHRcdFx0XHRcdFx0XHRcdCMg5a+55b2T5YmN5a+56LGh5pyJdmlld0FsbFJlY29yZHPmnYPpmZDliJnkuI3pmZDliLbmiYDlsZ7ljZXkvY3liJfooajmn6XnnIvmnYPpmZDvvIzlkKbliJnlj6rmmL7npLrlvZPliY3miYDlsZ7ljZXkvY1cblx0XHRcdFx0XHRcdFx0XHQjIOazqOaEj+S4jeaYr3JlZmVyZW5jZV90b+WvueixoeeahHZpZXdBbGxSZWNvcmRz5p2D6ZmQ77yM6ICM5piv5b2T5YmN5a+56LGh55qEXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9ucz8uZ2V0KClcblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/LnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOWtl+auteaJgOWxnuWvueixoeaYr+eUqOaIt+aIlue7hOe7h++8jOWImeaYr+WQpumZkOWItuaYvuekuuaJgOWxnuWNleS9jemDqOmXqOS4jm1vZGlmeUFsbFJlY29yZHPmnYPpmZDlhbPogZRcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNGdW5jdGlvbiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5Y2V5L2NXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0ZWxzZSBpZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT0gXCJvcmdhbml6YXRpb25zXCJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdG9yZ1wiXG5cdFx0XHRcdFx0XHRpZiAhZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0XG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5Y2V5L2N5LiL55qE5pWw5o2uXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk5Y+v5Lul6KKr5pS55YaZ6KaG55uW5oiQdHJ1ZS9mYWxzZeaIluWFtuS7lmZ1bmN0aW9uXG5cdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxuXHRcdFx0XHRcdFx0XHRcdCMg5a+55b2T5YmN5a+56LGh5pyJdmlld0FsbFJlY29yZHPmnYPpmZDliJnkuI3pmZDliLbmiYDlsZ7ljZXkvY3liJfooajmn6XnnIvmnYPpmZDvvIzlkKbliJnlj6rmmL7npLrlvZPliY3miYDlsZ7ljZXkvY1cblx0XHRcdFx0XHRcdFx0XHQjIOazqOaEj+S4jeaYr3JlZmVyZW5jZV90b+WvueixoeeahHZpZXdBbGxSZWNvcmRz5p2D6ZmQ77yM6ICM5piv5b2T5YmN5a+56LGh55qEXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9ucz8uZ2V0KClcblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/LnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOWtl+auteaJgOWxnuWvueixoeaYr+eUqOaIt+aIlue7hOe7h++8jOWImeaYr+WQpumZkOWItuaYvuekuuaJgOWxnuWNleS9jemDqOmXqOS4jm1vZGlmeUFsbFJlY29yZHPmnYPpmZDlhbPogZRcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNGdW5jdGlvbiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5Y2V5L2NXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aWYgdHlwZW9mKGZpZWxkLnJlZmVyZW5jZV90bykgPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG8oKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShfcmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRmcy50eXBlID0gT2JqZWN0XG5cdFx0XHRcdFx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZVxuXG5cdFx0XHRcdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIub1wiXSA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBTdHJpbmdcblx0XHRcdFx0XHRcdFx0XHRhdXRvZm9ybToge29taXQ6IHRydWV9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLmlkc1wiXSA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBbU3RyaW5nXVxuXHRcdFx0XHRcdFx0XHRcdGF1dG9mb3JtOiB7b21pdDogdHJ1ZX1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBbX3JlZmVyZW5jZV90b11cblxuXHRcdFx0XHRcdFx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXVxuXHRcdFx0XHRcdFx0aWYgX29iamVjdCBhbmQgX29iamVjdC5lbmFibGVfdHJlZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RUcmVlXCJcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kID0gZmllbGQub3B0aW9uc01ldGhvZCB8fCBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIlxuXG5cdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2RQYXJhbXMgPSAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcyA9IFtdXG5cdFx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90by5mb3JFYWNoIChfcmVmZXJlbmNlKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfb2JqZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6IF9vYmplY3Q/LmxhYmVsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogX29iamVjdD8uaWNvblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpbms6ICgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIi9hcHAvI3tTZXNzaW9uLmdldCgnYXBwX2lkJyl9LyN7X3JlZmVyZW5jZX0vdmlldy9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGluazogKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiL2FwcC8je1Nlc3Npb24uZ2V0KCdhcHBfaWQnKX0vI3tfcmVmZXJlbmNlfS92aWV3L1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb25cblxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInNlbGVjdFwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZhbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFwiXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gXCJcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImN1cnJlbmN5XCJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XG5cdFx0XHRpZiBmaWVsZD8uc2NhbGVcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZVxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdFx0ZWxzZSBpZiBmaWVsZD8uc2NhbGUgIT0gMFxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IDJcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJudW1iZXJcIlxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcblx0XHRcdGlmIGZpZWxkPy5zY2FsZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYm9vbGVhblwiXG5cdFx0XHRmcy50eXBlID0gQm9vbGVhblxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLWNoZWNrYm94XCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJyZWZlcmVuY2VcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImNoZWNrYm94XCJcblx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0LWNoZWNrYm94XCJcblx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZmlsZVwiIGFuZCBmaWVsZC5jb2xsZWN0aW9uXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogZmllbGQuY29sbGVjdGlvblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9IGZpZWxkLmNvbGxlY3Rpb25cblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJmaWxlc2l6ZVwiXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVzaXplJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIk9iamVjdFwiIHx8IGZpZWxkLnR5cGUgPT0gXCJvYmplY3RcIlxuXHRcdFx0ZnMudHlwZSA9IE9iamVjdFxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImdyaWRcIlxuXHRcdFx0ZnMudHlwZSA9IEFycmF5XG5cdFx0XHRmcy5hdXRvZm9ybS5lZGl0YWJsZSA9IHRydWVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NHcmlkXCJcblxuXHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0dHlwZTogT2JqZWN0XG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiaW1hZ2VcIlxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdpbWFnZXMnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdpbWFnZS8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdpbWFnZXMnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImF2YXRhclwiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2F2YXRhcnMnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdpbWFnZS8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdmF0YXJzJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKidcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJhdWRpb1wiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2F1ZGlvcydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2F1ZGlvLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F1ZGlvcydcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2F1ZGlvLyonXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidmlkZW9cIlxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICd2aWRlb3MnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICd2aWRlby8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICd2aWRlb3MnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICd2aWRlby8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImxvY2F0aW9uXCJcblx0XHRcdGZzLnR5cGUgPSBPYmplY3Rcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcImxvY2F0aW9uXCJcblx0XHRcdGZzLmF1dG9mb3JtLnN5c3RlbSA9IGZpZWxkLnN5c3RlbSB8fCBcIndnczg0XCJcblx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIm1hcmtkb3duXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtbWFya2Rvd25cIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAndXJsJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0IyBmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5Vcmxcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc1VybCdcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2VtYWlsJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc0VtYWlsJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnYXV0b251bWJlcidcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRlbHNlXG5cdFx0XHRmcy50eXBlID0gZmllbGQudHlwZVxuXG5cdFx0aWYgZmllbGQubGFiZWxcblx0XHRcdGZzLmxhYmVsID0gZmllbGQubGFiZWxcblxuXHRcdGlmIGZpZWxkLmFsbG93ZWRWYWx1ZXNcblx0XHRcdGZzLmFsbG93ZWRWYWx1ZXMgPSBmaWVsZC5hbGxvd2VkVmFsdWVzXG5cblx0XHRpZiAhZmllbGQucmVxdWlyZWRcblx0XHRcdGZzLm9wdGlvbmFsID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQudW5pcXVlXG5cdFx0XHRmcy51bmlxdWUgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5vbWl0XG5cdFx0XHRmcy5hdXRvZm9ybS5vbWl0ID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQuZ3JvdXBcblx0XHRcdGZzLmF1dG9mb3JtLmdyb3VwID0gZmllbGQuZ3JvdXBcblxuXHRcdGlmIGZpZWxkLmlzX3dpZGVcblx0XHRcdGZzLmF1dG9mb3JtLmlzX3dpZGUgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5oaWRkZW5cblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcImhpZGRlblwiXG5cblx0XHRpZiAoZmllbGQudHlwZSA9PSBcInNlbGVjdFwiKSBvciAoZmllbGQudHlwZSA9PSBcImxvb2t1cFwiKSBvciAoZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIilcblx0XHRcdGlmIHR5cGVvZihmaWVsZC5maWx0ZXJhYmxlKSA9PSAndW5kZWZpbmVkJ1xuXHRcdFx0XHRmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZVxuXHRcdGlmIGZpZWxkLm5hbWUgPT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWVcblx0XHRcdGlmIHR5cGVvZihmaWVsZC5zZWFyY2hhYmxlKSA9PSAndW5kZWZpbmVkJ1xuXHRcdFx0XHRmaWVsZC5zZWFyY2hhYmxlID0gdHJ1ZVxuXG5cdFx0aWYgYXV0b2Zvcm1fdHlwZVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IGF1dG9mb3JtX3R5cGVcblxuXHRcdGlmIGZpZWxkLmRlZmF1bHRWYWx1ZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50IGFuZCBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmaWVsZC5kZWZhdWx0VmFsdWUpXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9ICgpLT5cblx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZmllbGQuZGVmYXVsdFZhbHVlLCB7dXNlcklkOiBNZXRlb3IudXNlcklkKCksIHNwYWNlSWQ6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKX0pXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXHRcdFx0XHRpZiAhXy5pc0Z1bmN0aW9uKGZpZWxkLmRlZmF1bHRWYWx1ZSlcblx0XHRcdFx0XHRmcy5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblxuXHRcdGlmIGZpZWxkLnJlYWRvbmx5XG5cdFx0XHRmcy5hdXRvZm9ybS5yZWFkb25seSA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmRpc2FibGVkXG5cdFx0XHRmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmlubGluZUhlbHBUZXh0XG5cdFx0XHRmcy5hdXRvZm9ybS5pbmxpbmVIZWxwVGV4dCA9IGZpZWxkLmlubGluZUhlbHBUZXh0XG5cblx0XHRpZiBmaWVsZC5ibGFja2JveFxuXHRcdFx0ZnMuYmxhY2tib3ggPSB0cnVlXG5cblx0XHQjIOWPquacieeUn+S6p+eOr+Wig+aJjemHjeW7uue0ouW8lVxuXHRcdGlmIE1ldGVvci5pc1Byb2R1Y3Rpb25cblx0XHRcdGlmIGZpZWxkLmluZGV4XG5cdFx0XHRcdGZzLmluZGV4ID0gZmllbGQuaW5kZXhcblx0XHRcdGVsc2UgaWYgZmllbGQuc29ydGFibGVcblx0XHRcdFx0ZnMuaW5kZXggPSB0cnVlXG5cblx0XHRzY2hlbWFbZmllbGRfbmFtZV0gPSBmc1xuXG5cdHJldHVybiBzY2hlbWFcblxuXG5DcmVhdG9yLmdldEZpZWxkRGlzcGxheVZhbHVlID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZF92YWx1ZSktPlxuXHRodG1sID0gZmllbGRfdmFsdWVcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGlmICFvYmplY3Rcblx0XHRyZXR1cm4gXCJcIlxuXHRmaWVsZCA9IG9iamVjdC5maWVsZHMoZmllbGRfbmFtZSlcblx0aWYgIWZpZWxkXG5cdFx0cmV0dXJuIFwiXCJcblxuXHRpZiBmaWVsZC50eXBlID09IFwiZGF0ZXRpbWVcIlxuXHRcdGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCBIOm1tJylcblx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZVwiXG5cdFx0aHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREJylcblxuXHRyZXR1cm4gaHRtbFxuXG5DcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeSA9IChmaWVsZF90eXBlKS0+XG5cdHJldHVybiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIiwgXCJjdXJyZW5jeVwiLCBcIm51bWJlclwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXG5DcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyA9IChmaWVsZF90eXBlLCBvcGVyYXRpb25zKS0+XG5cdGJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpXG5cdGlmIGJ1aWx0aW5WYWx1ZXNcblx0XHRfLmZvckVhY2ggYnVpbHRpblZhbHVlcywgKGJ1aWx0aW5JdGVtLCBrZXkpLT5cblx0XHRcdG9wZXJhdGlvbnMucHVzaCh7bGFiZWw6IGJ1aWx0aW5JdGVtLmxhYmVsLCB2YWx1ZToga2V5fSlcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyA9IChmaWVsZF90eXBlLCBpc19jaGVja19vbmx5KS0+XG5cdCMg6L+H5ruk5Zmo5a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XG5cdGlmIFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXHRcdHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyhpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKVxuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtID0gKGZpZWxkX3R5cGUsIGtleSktPlxuXHQjIOi/h+a7pOWZqOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxuXHRpZiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwga2V5KVxuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uID0gKGZpZWxkX3R5cGUsIHZhbHVlKS0+XG5cdCMg5qC55o2u6L+H5ruk5Zmo55qE6L+H5ruk5YC877yM6I635Y+W5a+55bqU55qE5YaF572u6L+Q566X56ymXG5cdCMg5q+U5aaCdmFsdWXkuLpsYXN0X3llYXLvvIzov5Tlm55iZXR3ZWVuX3RpbWVfbGFzdF95ZWFyXG5cdHVubGVzcyBfLmlzU3RyaW5nKHZhbHVlKVxuXHRcdHJldHVyblxuXHRiZXR3ZWVuQnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSlcblx0dW5sZXNzIGJldHdlZW5CdWlsdGluVmFsdWVzXG5cdFx0cmV0dXJuXG5cdHJlc3VsdCA9IG51bGxcblx0Xy5lYWNoIGJldHdlZW5CdWlsdGluVmFsdWVzLCAoaXRlbSwgb3BlcmF0aW9uKS0+XG5cdFx0aWYgaXRlbS5rZXkgPT0gdmFsdWVcblx0XHRcdHJlc3VsdCA9IG9wZXJhdGlvblxuXHRyZXR1cm4gcmVzdWx0XG5cbiMg5aaC5p6c5Y+q5piv5Li65Yik5patb3BlcmF0aW9u5piv5ZCm5a2Y5Zyo77yM5YiZ5rKh5b+F6KaB6K6h566XdmFsdWVz77yM5Lyg5YWlaXNfY2hlY2tfb25seeS4unRydWXljbPlj69cbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzID0gKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpLT5cblx0IyDov4fmu6Tlmajml7bpl7TlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcblx0cmV0dXJuIHtcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfeWVhclwiKSxcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfeWVhclwiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfeWVhclwiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfcXVhcnRlclwiKSxcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfcXVhcnRlclwiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfcXVhcnRlclwiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X21vbnRoXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfbW9udGhcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF9tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9tb250aFwiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3Rfd2Vla1wiKSxcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfd2Vla1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfd2Vla1wiKSxcblx0XHRcImJldHdlZW5fdGltZV95ZXN0ZGF5XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ5ZXN0ZGF5XCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RvZGF5XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b2RheVwiKSxcblx0XHRcImJldHdlZW5fdGltZV90b21vcnJvd1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9tb3Jyb3dcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF83X2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfN19kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfMzBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8zMF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfNjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF82MF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfOTBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF85MF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfMTIwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMTIwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF83X2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfN19kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfMzBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8zMF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfNjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF82MF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfOTBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF85MF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfMTIwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMTIwX2RheXNcIilcblx0fVxuXG5DcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoID0gKG1vbnRoKS0+XG5cdGlmICFtb250aFxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXG5cdFxuXHRpZiBtb250aCA8IDNcblx0XHRyZXR1cm4gMFxuXHRlbHNlIGlmIG1vbnRoIDwgNlxuXHRcdHJldHVybiAzXG5cdGVsc2UgaWYgbW9udGggPCA5XG5cdFx0cmV0dXJuIDZcblx0XG5cdHJldHVybiA5XG5cblxuQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5ID0gKHllYXIsbW9udGgpLT5cblx0aWYgIXllYXJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXG5cdGlmICFtb250aFxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXG5cdFxuXHRpZiBtb250aCA8IDNcblx0XHR5ZWFyLS1cblx0XHRtb250aCA9IDlcblx0ZWxzZSBpZiBtb250aCA8IDZcblx0XHRtb250aCA9IDBcblx0ZWxzZSBpZiBtb250aCA8IDlcblx0XHRtb250aCA9IDNcblx0ZWxzZSBcblx0XHRtb250aCA9IDZcblx0XG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0XG5cbkNyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSA9ICh5ZWFyLG1vbnRoKS0+XG5cdGlmICF5ZWFyXG5cdFx0eWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKVxuXHRpZiAhbW9udGhcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxuXHRcblx0aWYgbW9udGggPCAzXG5cdFx0bW9udGggPSAzXG5cdGVsc2UgaWYgbW9udGggPCA2XG5cdFx0bW9udGggPSA2XG5cdGVsc2UgaWYgbW9udGggPCA5XG5cdFx0bW9udGggPSA5XG5cdGVsc2Vcblx0XHR5ZWFyKytcblx0XHRtb250aCA9IDBcblx0XG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblxuQ3JlYXRvci5nZXRNb250aERheXMgPSAoeWVhcixtb250aCktPlxuXHRpZiBtb250aCA9PSAxMVxuXHRcdHJldHVybiAzMVxuXHRcblx0bWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0XG5cdHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRlbmREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgrMSwgMSlcblx0ZGF5cyA9IChlbmREYXRlLXN0YXJ0RGF0ZSkvbWlsbGlzZWNvbmRcblx0cmV0dXJuIGRheXNcblxuQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheSA9ICh5ZWFyLCBtb250aCktPlxuXHRpZiAheWVhclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdCMg5pyI5Lu95Li6MOS7o+ihqOacrOW5tOeahOesrOS4gOaciFxuXHRpZiBtb250aCA9PSAwXG5cdFx0bW9udGggPSAxMVxuXHRcdHllYXItLVxuXHRcdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0XG5cdCMg5ZCm5YiZLOWPquWHj+WOu+aciOS7vVxuXHRtb250aC0tO1xuXHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdFxuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0gPSAoZmllbGRfdHlwZSwga2V5KS0+XG5cdCMg6L+H5ruk5ZmoYmV0d2Vlbui/kOeul+espu+8jOeOsOeul+aXpeacny/ml6XmnJ/ml7bpl7TnsbvlnovlrZfmrrXnmoR2YWx1ZXPlgLxcblx0bm93ID0gbmV3IERhdGUoKVxuXHQjIOS4gOWkqeeahOavq+enkuaVsFxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcblx0eWVzdGRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcblx0dG9tb3Jyb3cgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpXG5cdCMg5LiA5ZGo5Lit55qE5p+Q5LiA5aSpXG5cdHdlZWsgPSBub3cuZ2V0RGF5KClcblx0IyDlh4/ljrvnmoTlpKnmlbBcblx0bWludXNEYXkgPSBpZiB3ZWVrICE9IDAgdGhlbiB3ZWVrIC0gMSBlbHNlIDZcblx0bW9uZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIChtaW51c0RheSAqIG1pbGxpc2Vjb25kKSlcblx0c3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKVxuXHQjIOS4iuWRqOaXpVxuXHRsYXN0U3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHQjIOS4iuWRqOS4gFxuXHRsYXN0TW9uZGF5ID0gbmV3IERhdGUobGFzdFN1bmRheS5nZXRUaW1lKCkgLSAobWlsbGlzZWNvbmQgKiA2KSlcblx0IyDkuIvlkajkuIBcblx0bmV4dE1vbmRheSA9IG5ldyBEYXRlKHN1bmRheS5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZClcblx0IyDkuIvlkajml6Vcblx0bmV4dFN1bmRheSA9IG5ldyBEYXRlKG5leHRNb25kYXkuZ2V0VGltZSgpICsgKG1pbGxpc2Vjb25kICogNikpXG5cdGN1cnJlbnRZZWFyID0gbm93LmdldEZ1bGxZZWFyKClcblx0cHJldmlvdXNZZWFyID0gY3VycmVudFllYXIgLSAxXG5cdG5leHRZZWFyID0gY3VycmVudFllYXIgKyAxXG5cdCMg5b2T5YmN5pyI5Lu9XG5cdGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpXG5cdCMg6K6h5pWw5bm044CB5pyIXG5cdHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuXHRtb250aCA9IG5vdy5nZXRNb250aCgpXG5cdCMg5pys5pyI56ys5LiA5aSpXG5cdGZpcnN0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsY3VycmVudE1vbnRoLDEpXG5cblx0IyDlvZPkuLoxMuaciOeahOaXtuWAmeW5tOS7vemcgOimgeWKoDFcblx0IyDmnIjku73pnIDopoHmm7TmlrDkuLowIOS5n+WwseaYr+S4i+S4gOW5tOeahOesrOS4gOS4quaciFxuXHRpZiBjdXJyZW50TW9udGggPT0gMTFcblx0XHR5ZWFyKytcblx0XHRtb250aCsrXG5cdGVsc2Vcblx0XHRtb250aCsrXG5cdFxuXHQjIOS4i+aciOesrOS4gOWkqVxuXHRuZXh0TW9udGhGaXJzdERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHQjIOS4i+aciOacgOWQjuS4gOWkqVxuXHRuZXh0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKHllYXIsbW9udGgsQ3JlYXRvci5nZXRNb250aERheXMoeWVhcixtb250aCkpXG5cdCMg5pys5pyI5pyA5ZCO5LiA5aSpXG5cdGxhc3REYXkgPSBuZXcgRGF0ZShuZXh0TW9udGhGaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcblx0IyDkuIrmnIjnrKzkuIDlpKlcblx0bGFzdE1vbnRoRmlyc3REYXkgPSBDcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5KGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aClcblx0IyDkuIrmnIjmnIDlkI7kuIDlpKlcblx0bGFzdE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZShmaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcblx0IyDmnKzlraPluqblvIDlp4vml6Vcblx0dGhpc1F1YXJ0ZXJTdGFydERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSwxKVxuXHQjIOacrOWto+W6pue7k+adn+aXpVxuXHR0aGlzUXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSsyLENyZWF0b3IuZ2V0TW9udGhEYXlzKGN1cnJlbnRZZWFyLENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSsyKSlcblx0IyDkuIrlraPluqblvIDlp4vml6Vcblx0bGFzdFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXG5cdCMg5LiK5a2j5bqm57uT5p2f5pelXG5cdGxhc3RRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyLENyZWF0b3IuZ2V0TW9udGhEYXlzKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMikpXG5cdCMg5LiL5a2j5bqm5byA5aeL5pelXG5cdG5leHRRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxuXHQjIOS4i+Wto+W6pue7k+adn+aXpVxuXHRuZXh0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIpKVxuXHQjIOi/h+WOuzflpKkgXG5cdGxhc3RfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg2ICogbWlsbGlzZWNvbmQpKVxuXHQjIOi/h+WOuzMw5aSpXG5cdGxhc3RfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMjkgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67NjDlpKlcblx0bGFzdF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg1OSAqIG1pbGxpc2Vjb25kKSlcblx0IyDov4fljrs5MOWkqVxuXHRsYXN0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDg5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOi/h+WOuzEyMOWkqVxuXHRsYXN0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgxMTkgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lN+WkqSBcblx0bmV4dF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lMzDlpKlcblx0bmV4dF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgyOSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaU2MOWkqVxuXHRuZXh0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDU5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTkw5aSpXG5cdG5leHRfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoODkgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lMTIw5aSpXG5cdG5leHRfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDExOSAqIG1pbGxpc2Vjb25kKSlcblxuXHRzd2l0Y2gga2V5XG5cdFx0d2hlbiBcImxhc3RfeWVhclwiXG5cdFx0XHQj5Y675bm0XG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3llYXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7cHJldmlvdXNZZWFyfS0wMS0wMVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3ByZXZpb3VzWWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRoaXNfeWVhclwiXG5cdFx0XHQj5LuK5bm0XG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3llYXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7Y3VycmVudFllYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7Y3VycmVudFllYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0X3llYXJcIlxuXHRcdFx0I+aYjuW5tFxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF95ZWFyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje25leHRZZWFyfS0wMS0wMVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje25leHRZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF9xdWFydGVyXCJcblx0XHRcdCPkuIrlraPluqZcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfcXVhcnRlclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc19xdWFydGVyXCJcblx0XHRcdCPmnKzlraPluqZcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfcXVhcnRlclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF9xdWFydGVyXCJcblx0XHRcdCPkuIvlraPluqZcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfcXVhcnRlclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF9tb250aFwiXG5cdFx0XHQj5LiK5pyIXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChsYXN0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9tb250aFwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc19tb250aFwiXG5cdFx0XHQj5pys5pyIXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChmaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX21vbnRoXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0X21vbnRoXCJcblx0XHRcdCPkuIvmnIhcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X21vbnRoXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0X3dlZWtcIlxuXHRcdFx0I+S4iuWRqFxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KGxhc3RNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0clN1bmRheSA9IG1vbWVudChsYXN0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3dlZWtcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTW9uZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN1bmRheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRoaXNfd2Vla1wiXG5cdFx0XHQj5pys5ZGoXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQoc3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3dlZWtcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTW9uZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN1bmRheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfd2Vla1wiXG5cdFx0XHQj5LiL5ZGoXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobmV4dE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KG5leHRTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfd2Vla1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwieWVzdGRheVwiXG5cdFx0XHQj5pio5aSpXG5cdFx0XHRzdHJZZXN0ZGF5ID0gbW9tZW50KHllc3RkYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3llc3RkYXlcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyWWVzdGRheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJZZXN0ZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidG9kYXlcIlxuXHRcdFx0I+S7iuWkqVxuXHRcdFx0c3RyVG9kYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b2RheVwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb2RheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb2RheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRvbW9ycm93XCJcblx0XHRcdCPmmI7lpKlcblx0XHRcdHN0clRvbW9ycm93ID0gbW9tZW50KHRvbW9ycm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b21vcnJvd1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb21vcnJvd31UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb21vcnJvd31UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfN19kYXlzXCJcblx0XHRcdCPov4fljrs35aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSBcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfN19kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfMzBfZGF5c1wiXG5cdFx0XHQj6L+H5Y67MzDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8zMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfNjBfZGF5c1wiXG5cdFx0XHQj6L+H5Y67NjDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF82MF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfOTBfZGF5c1wiXG5cdFx0XHQj6L+H5Y67OTDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF85MF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfMTIwX2RheXNcIlxuXHRcdFx0I+i/h+WOuzEyMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8xMjBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0XzdfZGF5c1wiXG5cdFx0XHQj5pyq5p2lN+WkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfN19kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfMzBfZGF5c1wiXG5cdFx0XHQj5pyq5p2lMzDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8zMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfNjBfZGF5c1wiXG5cdFx0XHQj5pyq5p2lNjDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF82MF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfOTBfZGF5c1wiXG5cdFx0XHQj5pyq5p2lOTDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF85MF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfMTIwX2RheXNcIlxuXHRcdFx0I+acquadpTEyMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8xMjBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcblx0dmFsdWVzID0gW3N0YXJ0VmFsdWUsIGVuZFZhbHVlXVxuXHRpZiBmaWVsZF90eXBlID09IFwiZGF0ZXRpbWVcIlxuXHRcdCMg5pe26Ze057G75Z6L5a2X5q6177yM5YaF572u5pe26Ze06IyD5Zu05bqU6K+l6ICD6JmR5YGP56e75pe25Yy65YC877yM5ZCm5YiZ6L+H5ruk5pWw5o2u5a2Y5Zyo5YGP5beuXG5cdFx0IyDpnZ7lhoXnva7ml7bpl7TojIPlm7Tml7bvvIznlKjmiLfpgJrov4fml7bpl7Tmjqfku7bpgInmi6nnmoTojIPlm7TvvIzkvJroh6rliqjlpITnkIbml7bljLrlgY/lt67mg4XlhrVcblx0XHQjIOaXpeacn+exu+Wei+Wtl+aute+8jOaVsOaNruW6k+acrOadpeWwseWtmOeahOaYr1VUQ+eahDDngrnvvIzkuI3lrZjlnKjlgY/lt65cblx0XHRfLmZvckVhY2ggdmFsdWVzLCAoZnYpLT5cblx0XHRcdGlmIGZ2XG5cdFx0XHRcdGZ2LnNldEhvdXJzKGZ2LmdldEhvdXJzKCkgKyBmdi5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjAgKVxuXHRcblx0cmV0dXJuIHtcblx0XHRsYWJlbDogbGFiZWxcblx0XHRrZXk6IGtleVxuXHRcdHZhbHVlczogdmFsdWVzXG5cdH1cblxuQ3JlYXRvci5nZXRGaWVsZERlZmF1bHRPcGVyYXRpb24gPSAoZmllbGRfdHlwZSktPlxuXHRpZiBmaWVsZF90eXBlICYmIENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpXG5cdFx0cmV0dXJuICdiZXR3ZWVuJ1xuXHRlbHNlIGlmIFtcInRleHRhcmVhXCIsIFwidGV4dFwiLCBcImNvZGVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcblx0XHRyZXR1cm4gJ2NvbnRhaW5zJ1xuXHRlbHNlXG5cdFx0cmV0dXJuIFwiPVwiXG5cbkNyZWF0b3IuZ2V0RmllbGRPcGVyYXRpb24gPSAoZmllbGRfdHlwZSkgLT5cblx0IyDml6XmnJ/nsbvlnos6IGRhdGUsIGRhdGV0aW1lICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCIsIFwiPFwiLCBcIj5cIiwgXCI8PVwiLCBcIj49XCJcblx0IyDmlofmnKznsbvlnos6IHRleHQsIHRleHRhcmVhLCBodG1sICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCIsIFwiY29udGFpbnNcIiwgXCJub3Rjb250YWluc1wiLCBcInN0YXJ0c3dpdGhcIlxuXHQjIOmAieaLqeexu+WeizogbG9va3VwLCBtYXN0ZXJfZGV0YWlsLCBzZWxlY3Qg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXG5cdCMg5pWw5YC857G75Z6LOiBjdXJyZW5jeSwgbnVtYmVyICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCIsIFwiPFwiLCBcIj5cIiwgXCI8PVwiLCBcIj49XCJcblx0IyDluIPlsJTnsbvlnos6IGJvb2xlYW4gIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIlxuXHQjIOaVsOe7hOexu+WeizogY2hlY2tib3gsIFt0ZXh0XSAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXG5cblx0b3B0aW9uYWxzID0ge1xuXHRcdGVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZXF1YWxcIiksIHZhbHVlOiBcIj1cIn0sXG5cdFx0dW5lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3VuZXF1YWxcIiksIHZhbHVlOiBcIjw+XCJ9LFxuXHRcdGxlc3NfdGhhbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3NfdGhhblwiKSwgdmFsdWU6IFwiPFwifSxcblx0XHRncmVhdGVyX3RoYW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX3RoYW5cIiksIHZhbHVlOiBcIj5cIn0sXG5cdFx0bGVzc19vcl9lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3Nfb3JfZXF1YWxcIiksIHZhbHVlOiBcIjw9XCJ9LFxuXHRcdGdyZWF0ZXJfb3JfZXF1YWw6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX29yX2VxdWFsXCIpLCB2YWx1ZTogXCI+PVwifSxcblx0XHRjb250YWluczoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2NvbnRhaW5zXCIpLCB2YWx1ZTogXCJjb250YWluc1wifSxcblx0XHRub3RfY29udGFpbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2RvZXNfbm90X2NvbnRhaW5cIiksIHZhbHVlOiBcIm5vdGNvbnRhaW5zXCJ9LFxuXHRcdHN0YXJ0c193aXRoOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fc3RhcnRzX3dpdGhcIiksIHZhbHVlOiBcInN0YXJ0c3dpdGhcIn0sXG5cdFx0YmV0d2Vlbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5cIiksIHZhbHVlOiBcImJldHdlZW5cIn0sXG5cdH1cblxuXHRpZiBmaWVsZF90eXBlID09IHVuZGVmaW5lZFxuXHRcdHJldHVybiBfLnZhbHVlcyhvcHRpb25hbHMpXG5cblx0b3BlcmF0aW9ucyA9IFtdXG5cblx0aWYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSlcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmJldHdlZW4pXG5cdFx0Q3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMoZmllbGRfdHlwZSwgb3BlcmF0aW9ucylcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwidGV4dFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJ0ZXh0YXJlYVwiIG9yIGZpZWxkX3R5cGUgPT0gXCJodG1sXCIgb3IgZmllbGRfdHlwZSA9PSBcImNvZGVcIlxuI1x0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmNvbnRhaW5zLCBvcHRpb25hbHMubm90X2NvbnRhaW4sIG9wdGlvbmFscy5zdGFydHNfd2l0aClcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmNvbnRhaW5zKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJsb29rdXBcIiBvciBmaWVsZF90eXBlID09IFwibWFzdGVyX2RldGFpbFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJzZWxlY3RcIlxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJjdXJyZW5jeVwiIG9yIGZpZWxkX3R5cGUgPT0gXCJudW1iZXJcIlxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsLCBvcHRpb25hbHMubGVzc190aGFuLCBvcHRpb25hbHMuZ3JlYXRlcl90aGFuLCBvcHRpb25hbHMubGVzc19vcl9lcXVhbCwgb3B0aW9uYWxzLmdyZWF0ZXJfb3JfZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImJvb2xlYW5cIlxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJjaGVja2JveFwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcIlt0ZXh0XVwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2Vcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblxuXHRyZXR1cm4gb3BlcmF0aW9uc1xuXG4jIyNcbiAgICDlhYjmjInnhafmnInmjpLluo/lj7fnmoTlsI/nmoTlnKjliY3vvIzlpKfnmoTlnKjlkI5cbiAgICDlho3lsIbmsqHmnInmjpLluo/lj7fnmoTmmL7npLrlnKhcbiMjI1xuQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lID0gKG9iamVjdF9uYW1lKS0+XG5cdGZpZWxkcyA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKT8uZmllbGRzXG5cdGZpZWxkc0FyciA9IFtdXG5cblx0Xy5lYWNoIGZpZWxkcywgKGZpZWxkKS0+XG5cdFx0ZmllbGRzQXJyLnB1c2gge25hbWU6IGZpZWxkLm5hbWUsIHNvcnRfbm86IGZpZWxkLnNvcnRfbm99XG5cblx0ZmllbGRzTmFtZSA9IFtdXG5cdF8uZWFjaCBfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgKGZpZWxkKS0+XG5cdFx0ZmllbGRzTmFtZS5wdXNoKGZpZWxkLm5hbWUpXG5cdHJldHVybiBmaWVsZHNOYW1lXG4iLCJDcmVhdG9yLmdldE9iamVjdFNjaGVtYSA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgZmllbGRzQXJyLCBzY2hlbWE7XG4gIHNjaGVtYSA9IHt9O1xuICBmaWVsZHNBcnIgPSBbXTtcbiAgXy5lYWNoKG9iai5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgaWYgKCFfLmhhcyhmaWVsZCwgXCJuYW1lXCIpKSB7XG4gICAgICBmaWVsZC5uYW1lID0gZmllbGRfbmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkc0Fyci5wdXNoKGZpZWxkKTtcbiAgfSk7XG4gIF8uZWFjaChfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgZnVuY3Rpb24oZmllbGQpIHtcbiAgICB2YXIgX29iamVjdCwgX3JlZl9vYmosIF9yZWZlcmVuY2VfdG8sIGF1dG9mb3JtX3R5cGUsIGZpZWxkX25hbWUsIGZzLCBpc1VuTGltaXRlZCwgcGVybWlzc2lvbnMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMztcbiAgICBmaWVsZF9uYW1lID0gZmllbGQubmFtZTtcbiAgICBmcyA9IHt9O1xuICAgIGlmIChmaWVsZC5yZWdFeCkge1xuICAgICAgZnMucmVnRXggPSBmaWVsZC5yZWdFeDtcbiAgICB9XG4gICAgZnMuYXV0b2Zvcm0gPSB7fTtcbiAgICBmcy5hdXRvZm9ybS5tdWx0aXBsZSA9IGZpZWxkLm11bHRpcGxlO1xuICAgIGZzLmF1dG9mb3JtLnJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgICBhdXRvZm9ybV90eXBlID0gKHJlZiA9IGZpZWxkLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmLnR5cGUgOiB2b2lkIDA7XG4gICAgaWYgKGZpZWxkLnR5cGUgPT09IFwidGV4dFwiIHx8IGZpZWxkLnR5cGUgPT09IFwicGhvbmVcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiW3RleHRdXCIgfHwgZmllbGQudHlwZSA9PT0gXCJbcGhvbmVdXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdjb2RlJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCI7XG4gICAgICBmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAxMjtcbiAgICAgIGlmIChmaWVsZC5sYW5ndWFnZSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5sYW5ndWFnZSA9IGZpZWxkLmxhbmd1YWdlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJ0ZXh0YXJlYVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDY7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInBhc3N3b3JkXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJwYXNzd29yZFwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRlXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBEYXRlO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKSkge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiLFxuICAgICAgICAgICAgZGF0ZU1vYmlsZU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLm91dEZvcm1hdCA9ICd5eXl5LU1NLWRkJztcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICB0aW1lem9uZUlkOiBcInV0Y1wiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGVcIixcbiAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBEYXRlO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKSkge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiLFxuICAgICAgICAgICAgZGF0ZU1vYmlsZU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJkYXRldGltZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIixcbiAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIltPYmplY3RdXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBbT2JqZWN0XTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiaHRtbFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICB0eXBlOiBcInN1bW1lcm5vdGVcIixcbiAgICAgICAgXCJjbGFzc1wiOiAnZWRpdG9yJyxcbiAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgICAgICBkaWFsb2dzSW5Cb2R5OiB0cnVlLFxuICAgICAgICAgIHRvb2xiYXI6IFtbJ2ZvbnQxJywgWydzdHlsZSddXSwgWydmb250MicsIFsnYm9sZCcsICd1bmRlcmxpbmUnLCAnaXRhbGljJywgJ2NsZWFyJ11dLCBbJ2ZvbnQzJywgWydmb250bmFtZSddXSwgWydjb2xvcicsIFsnY29sb3InXV0sIFsncGFyYScsIFsndWwnLCAnb2wnLCAncGFyYWdyYXBoJ11dLCBbJ3RhYmxlJywgWyd0YWJsZSddXSwgWydpbnNlcnQnLCBbJ2xpbmsnLCAncGljdHVyZSddXSwgWyd2aWV3JywgWydjb2RldmlldyddXV0sXG4gICAgICAgICAgZm9udE5hbWVzOiBbJ0FyaWFsJywgJ0NvbWljIFNhbnMgTVMnLCAnQ291cmllciBOZXcnLCAnSGVsdmV0aWNhJywgJ0ltcGFjdCcsICflrovkvZMnLCAn6buR5L2TJywgJ+W+rui9r+mbhem7kScsICfku7/lrosnLCAn5qW35L2TJywgJ+matuS5picsICflubzlnIYnXVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmaWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICB9XG4gICAgICBpZiAoIWZpZWxkLmhpZGRlbikge1xuICAgICAgICBmcy5hdXRvZm9ybS5maWx0ZXJzID0gZmllbGQuZmlsdGVycztcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVwZW5kT24gPSBmaWVsZC5kZXBlbmRfb247XG4gICAgICAgIGlmIChmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb24pIHtcbiAgICAgICAgICBmcy5iZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgZnMuZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uID8gZmllbGQuZmlsdGVyc0Z1bmN0aW9uIDogQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnM7XG4gICAgICAgIGlmIChmaWVsZC5vcHRpb25zRnVuY3Rpb24pIHtcbiAgICAgICAgICBmcy5vcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV90bykge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgIGlmIChmaWVsZC5jcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmllbGQuY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgICAgICAgIGZzLmNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb247XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoXy5pc1N0cmluZyhmaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgX3JlZl9vYmogPSBDcmVhdG9yLk9iamVjdHNbZmllbGQucmVmZXJlbmNlX3RvXTtcbiAgICAgICAgICAgICAgICBpZiAoX3JlZl9vYmogIT0gbnVsbCA/IChyZWYxID0gX3JlZl9vYmoucGVybWlzc2lvbnMpICE9IG51bGwgPyByZWYxLmFsbG93Q3JlYXRlIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgZnMuY3JlYXRlRnVuY3Rpb24gPSBmdW5jdGlvbihsb29rdXBfZmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1vZGFsLnNob3coXCJDcmVhdG9yT2JqZWN0TW9kYWxcIiwge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IFwiQ3JlYXRvci5Db2xsZWN0aW9ucy5cIiArIChDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvKS5fbmFtZSksXG4gICAgICAgICAgICAgICAgICAgICAgZm9ybUlkOiBcIm5ld1wiICsgKGZpZWxkLnJlZmVyZW5jZV90by5yZXBsYWNlKCcuJywgJ18nKSksXG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IFwiXCIgKyBmaWVsZC5yZWZlcmVuY2VfdG8sXG4gICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImluc2VydFwiLFxuICAgICAgICAgICAgICAgICAgICAgIG9uU3VjY2VzczogZnVuY3Rpb24ob3BlcmF0aW9uLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZXN1bHQub2JqZWN0X25hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5vYmplY3RfbmFtZSA9PT0gXCJvYmplY3RzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHJlc3VsdC52YWx1ZS5sYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQudmFsdWUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246IHJlc3VsdC52YWx1ZS5pY29uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLCByZXN1bHQudmFsdWUubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogcmVzdWx0LnZhbHVlW29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gfHwgcmVzdWx0LnZhbHVlLmxhYmVsIHx8IHJlc3VsdC52YWx1ZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC5faWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sIHJlc3VsdC5faWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKF8uaXNCb29sZWFuKGZpZWxkLmNyZWF0ZSkpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZpZWxkLmNyZWF0ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV9zb3J0KSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zU29ydCA9IGZpZWxkLnJlZmVyZW5jZV9zb3J0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX2xpbWl0KSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTGltaXQgPSBmaWVsZC5yZWZlcmVuY2VfbGltaXQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwidXNlcnNcIikge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0dXNlclwiO1xuICAgICAgICAgICAgaWYgKCFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXQpIHtcbiAgICAgICAgICAgICAgaWYgKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSAocmVmMiA9IG9iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjIuZ2V0KCkgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGlzVW5MaW1pdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwib3JnYW5pemF0aW9uc1wiKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RvcmdcIjtcbiAgICAgICAgICAgIGlmICghZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0KSB7XG4gICAgICAgICAgICAgIGlmIChmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gKHJlZjMgPSBvYmoucGVybWlzc2lvbnMpICE9IG51bGwgPyByZWYzLmdldCgpIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChpc1VuTGltaXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNGdW5jdGlvbihmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG8oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXy5pc0FycmF5KF9yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgIGZzLnR5cGUgPSBPYmplY3Q7XG4gICAgICAgICAgICAgIGZzLmJsYWNrYm94ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub2JqZWN0U3dpdGNoZSA9IHRydWU7XG4gICAgICAgICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIub1wiXSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgICAgICAgIG9taXQ6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuaWRzXCJdID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFtTdHJpbmddLFxuICAgICAgICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICAgICAgICBvbWl0OiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IFtfcmVmZXJlbmNlX3RvXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV90b1swXV07XG4gICAgICAgICAgICBpZiAoX29iamVjdCAmJiBfb2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFRyZWVcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2QgPSBmaWVsZC5vcHRpb25zTWV0aG9kIHx8IFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiO1xuICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZFBhcmFtcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvLmZvckVhY2goZnVuY3Rpb24oX3JlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlXTtcbiAgICAgICAgICAgICAgICAgIGlmIChfb2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogX3JlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogX29iamVjdCAhPSBudWxsID8gX29iamVjdC5sYWJlbCA6IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgICBpY29uOiBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIvYXBwL1wiICsgKFNlc3Npb24uZ2V0KCdhcHBfaWQnKSkgKyBcIi9cIiArIF9yZWZlcmVuY2UgKyBcIi92aWV3L1wiO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IF9yZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIvYXBwL1wiICsgKFNlc3Npb24uZ2V0KCdhcHBfaWQnKSkgKyBcIi9cIiArIF9yZWZlcmVuY2UgKyBcIi92aWV3L1wiO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0SWNvbiA9IGZpZWxkLmRlZmF1bHRJY29uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmYWxzZTtcbiAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RcIjtcbiAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICAgIGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gXCJcIjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiY3VycmVuY3lcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZTtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApICE9PSAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gMjtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4O1xuICAgICAgaWYgKGZpZWxkICE9IG51bGwgPyBmaWVsZC5zY2FsZSA6IHZvaWQgMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlO1xuICAgICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICBmcy50eXBlID0gQm9vbGVhbjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi1jaGVja2JveFwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJyZWZlcmVuY2VcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0LWNoZWNrYm94XCI7XG4gICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZmlsZVwiICYmIGZpZWxkLmNvbGxlY3Rpb24pIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogZmllbGQuY29sbGVjdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSBmaWVsZC5jb2xsZWN0aW9uO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJmaWxlc2l6ZVwiKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlc2l6ZSc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIk9iamVjdFwiIHx8IGZpZWxkLnR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBPYmplY3Q7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImdyaWRcIikge1xuICAgICAgZnMudHlwZSA9IEFycmF5O1xuICAgICAgZnMuYXV0b2Zvcm0uZWRpdGFibGUgPSB0cnVlO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0dyaWRcIjtcbiAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgdHlwZTogT2JqZWN0XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJpbWFnZVwiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICdpbWFnZXMnLFxuICAgICAgICAgICAgYWNjZXB0OiAnaW1hZ2UvKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2ltYWdlcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYXZhdGFyXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2F2YXRhcnMnLFxuICAgICAgICAgICAgYWNjZXB0OiAnaW1hZ2UvKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F2YXRhcnMnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImF1ZGlvXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2F1ZGlvcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdhdWRpby8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXVkaW9zJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2F1ZGlvLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJ2aWRlb1wiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICd2aWRlb3MnLFxuICAgICAgICAgICAgYWNjZXB0OiAndmlkZW8vKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ3ZpZGVvcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICd2aWRlby8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibG9jYXRpb25cIikge1xuICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcImxvY2F0aW9uXCI7XG4gICAgICBmcy5hdXRvZm9ybS5zeXN0ZW0gPSBmaWVsZC5zeXN0ZW0gfHwgXCJ3Z3M4NFwiO1xuICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJtYXJrZG93blwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1tYXJrZG93blwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3VybCcpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NVcmwnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2VtYWlsJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zRW1haWwnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2F1dG9udW1iZXInKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcy50eXBlID0gZmllbGQudHlwZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmxhYmVsKSB7XG4gICAgICBmcy5sYWJlbCA9IGZpZWxkLmxhYmVsO1xuICAgIH1cbiAgICBpZiAoZmllbGQuYWxsb3dlZFZhbHVlcykge1xuICAgICAgZnMuYWxsb3dlZFZhbHVlcyA9IGZpZWxkLmFsbG93ZWRWYWx1ZXM7XG4gICAgfVxuICAgIGlmICghZmllbGQucmVxdWlyZWQpIHtcbiAgICAgIGZzLm9wdGlvbmFsID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLnVuaXF1ZSkge1xuICAgICAgZnMudW5pcXVlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLm9taXQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLm9taXQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZ3JvdXApIHtcbiAgICAgIGZzLmF1dG9mb3JtLmdyb3VwID0gZmllbGQuZ3JvdXA7XG4gICAgfVxuICAgIGlmIChmaWVsZC5pc193aWRlKSB7XG4gICAgICBmcy5hdXRvZm9ybS5pc193aWRlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmhpZGRlbikge1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwiaGlkZGVuXCI7XG4gICAgfVxuICAgIGlmICgoZmllbGQudHlwZSA9PT0gXCJzZWxlY3RcIikgfHwgKGZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIpIHx8IChmaWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikpIHtcbiAgICAgIGlmICh0eXBlb2YgZmllbGQuZmlsdGVyYWJsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmllbGQuZmlsdGVyYWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmaWVsZC5uYW1lID09PSAnbmFtZScgfHwgZmllbGQuaXNfbmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiBmaWVsZC5zZWFyY2hhYmxlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmaWVsZC5zZWFyY2hhYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGF1dG9mb3JtX3R5cGUpIHtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBhdXRvZm9ybV90eXBlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZGVmYXVsdFZhbHVlKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZpZWxkLmRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZpZWxkLmRlZmF1bHRWYWx1ZSwge1xuICAgICAgICAgICAgdXNlcklkOiBNZXRlb3IudXNlcklkKCksXG4gICAgICAgICAgICBzcGFjZUlkOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgICAgaWYgKCFfLmlzRnVuY3Rpb24oZmllbGQuZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICAgIGZzLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmllbGQucmVhZG9ubHkpIHtcbiAgICAgIGZzLmF1dG9mb3JtLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmRpc2FibGVkKSB7XG4gICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5pbmxpbmVIZWxwVGV4dCkge1xuICAgICAgZnMuYXV0b2Zvcm0uaW5saW5lSGVscFRleHQgPSBmaWVsZC5pbmxpbmVIZWxwVGV4dDtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmJsYWNrYm94KSB7XG4gICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNQcm9kdWN0aW9uKSB7XG4gICAgICBpZiAoZmllbGQuaW5kZXgpIHtcbiAgICAgICAgZnMuaW5kZXggPSBmaWVsZC5pbmRleDtcbiAgICAgIH0gZWxzZSBpZiAoZmllbGQuc29ydGFibGUpIHtcbiAgICAgICAgZnMuaW5kZXggPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2NoZW1hW2ZpZWxkX25hbWVdID0gZnM7XG4gIH0pO1xuICByZXR1cm4gc2NoZW1hO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZERpc3BsYXlWYWx1ZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZF92YWx1ZSkge1xuICB2YXIgZmllbGQsIGh0bWwsIG9iamVjdDtcbiAgaHRtbCA9IGZpZWxkX3ZhbHVlO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbiAgZmllbGQgPSBvYmplY3QuZmllbGRzKGZpZWxkX25hbWUpO1xuICBpZiAoIWZpZWxkKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbiAgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgIGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCBIOm1tJyk7XG4gIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRlXCIpIHtcbiAgICBodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgfVxuICByZXR1cm4gaHRtbDtcbn07XG5cbkNyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5ID0gZnVuY3Rpb24oZmllbGRfdHlwZSkge1xuICByZXR1cm4gW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCIsIFwiY3VycmVuY3lcIiwgXCJudW1iZXJcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSk7XG59O1xuXG5DcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpIHtcbiAgdmFyIGJ1aWx0aW5WYWx1ZXM7XG4gIGJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpO1xuICBpZiAoYnVpbHRpblZhbHVlcykge1xuICAgIHJldHVybiBfLmZvckVhY2goYnVpbHRpblZhbHVlcywgZnVuY3Rpb24oYnVpbHRpbkl0ZW0sIGtleSkge1xuICAgICAgcmV0dXJuIG9wZXJhdGlvbnMucHVzaCh7XG4gICAgICAgIGxhYmVsOiBidWlsdGluSXRlbS5sYWJlbCxcbiAgICAgICAgdmFsdWU6IGtleVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBmdW5jdGlvbihmaWVsZF90eXBlLCBpc19jaGVja19vbmx5KSB7XG4gIGlmIChbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0gPSBmdW5jdGlvbihmaWVsZF90eXBlLCBrZXkpIHtcbiAgaWYgKFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBrZXkpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgdmFsdWUpIHtcbiAgdmFyIGJldHdlZW5CdWlsdGluVmFsdWVzLCByZXN1bHQ7XG4gIGlmICghXy5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgYmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpO1xuICBpZiAoIWJldHdlZW5CdWlsdGluVmFsdWVzKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJlc3VsdCA9IG51bGw7XG4gIF8uZWFjaChiZXR3ZWVuQnVpbHRpblZhbHVlcywgZnVuY3Rpb24oaXRlbSwgb3BlcmF0aW9uKSB7XG4gICAgaWYgKGl0ZW0ua2V5ID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHJlc3VsdCA9IG9wZXJhdGlvbjtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMgPSBmdW5jdGlvbihpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKSB7XG4gIHJldHVybiB7XG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF95ZWFyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3llYXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc195ZWFyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3llYXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF95ZWFyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3llYXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF9xdWFydGVyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3F1YXJ0ZXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc19xdWFydGVyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3F1YXJ0ZXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF9xdWFydGVyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3F1YXJ0ZXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF9tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF93ZWVrXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3dlZWtcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc193ZWVrXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3dlZWtcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF93ZWVrXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3dlZWtcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfeWVzdGRheVwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwieWVzdGRheVwiKSxcbiAgICBcImJldHdlZW5fdGltZV90b2RheVwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9kYXlcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdG9tb3Jyb3dcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvbW9ycm93XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfN19kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzdfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzMwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMzBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzYwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfNjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzkwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfOTBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzEyMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzEyMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfN19kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzdfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzMwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMzBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzYwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfNjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzkwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfOTBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzEyMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzEyMF9kYXlzXCIpXG4gIH07XG59O1xuXG5DcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoID0gZnVuY3Rpb24obW9udGgpIHtcbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICByZXR1cm4gMDtcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICByZXR1cm4gMztcbiAgfSBlbHNlIGlmIChtb250aCA8IDkpIHtcbiAgICByZXR1cm4gNjtcbiAgfVxuICByZXR1cm4gOTtcbn07XG5cbkNyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICB5ZWFyLS07XG4gICAgbW9udGggPSA5O1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIG1vbnRoID0gMDtcbiAgfSBlbHNlIGlmIChtb250aCA8IDkpIHtcbiAgICBtb250aCA9IDM7XG4gIH0gZWxzZSB7XG4gICAgbW9udGggPSA2O1xuICB9XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgbW9udGggPSAzO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIG1vbnRoID0gNjtcbiAgfSBlbHNlIGlmIChtb250aCA8IDkpIHtcbiAgICBtb250aCA9IDk7XG4gIH0gZWxzZSB7XG4gICAgeWVhcisrO1xuICAgIG1vbnRoID0gMDtcbiAgfVxuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXRNb250aERheXMgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICB2YXIgZGF5cywgZW5kRGF0ZSwgbWlsbGlzZWNvbmQsIHN0YXJ0RGF0ZTtcbiAgaWYgKG1vbnRoID09PSAxMSkge1xuICAgIHJldHVybiAzMTtcbiAgfVxuICBtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gIHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgZW5kRGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoICsgMSwgMSk7XG4gIGRheXMgPSAoZW5kRGF0ZSAtIHN0YXJ0RGF0ZSkgLyBtaWxsaXNlY29uZDtcbiAgcmV0dXJuIGRheXM7XG59O1xuXG5DcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoID09PSAwKSB7XG4gICAgbW9udGggPSAxMTtcbiAgICB5ZWFyLS07XG4gICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgfVxuICBtb250aC0tO1xuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0gPSBmdW5jdGlvbihmaWVsZF90eXBlLCBrZXkpIHtcbiAgdmFyIGN1cnJlbnRNb250aCwgY3VycmVudFllYXIsIGVuZFZhbHVlLCBmaXJzdERheSwgbGFiZWwsIGxhc3REYXksIGxhc3RNb25kYXksIGxhc3RNb250aEZpbmFsRGF5LCBsYXN0TW9udGhGaXJzdERheSwgbGFzdFF1YXJ0ZXJFbmREYXksIGxhc3RRdWFydGVyU3RhcnREYXksIGxhc3RTdW5kYXksIGxhc3RfMTIwX2RheXMsIGxhc3RfMzBfZGF5cywgbGFzdF82MF9kYXlzLCBsYXN0XzdfZGF5cywgbGFzdF85MF9kYXlzLCBtaWxsaXNlY29uZCwgbWludXNEYXksIG1vbmRheSwgbW9udGgsIG5leHRNb25kYXksIG5leHRNb250aEZpbmFsRGF5LCBuZXh0TW9udGhGaXJzdERheSwgbmV4dFF1YXJ0ZXJFbmREYXksIG5leHRRdWFydGVyU3RhcnREYXksIG5leHRTdW5kYXksIG5leHRZZWFyLCBuZXh0XzEyMF9kYXlzLCBuZXh0XzMwX2RheXMsIG5leHRfNjBfZGF5cywgbmV4dF83X2RheXMsIG5leHRfOTBfZGF5cywgbm93LCBwcmV2aW91c1llYXIsIHN0YXJ0VmFsdWUsIHN0ckVuZERheSwgc3RyRmlyc3REYXksIHN0ckxhc3REYXksIHN0ck1vbmRheSwgc3RyU3RhcnREYXksIHN0clN1bmRheSwgc3RyVG9kYXksIHN0clRvbW9ycm93LCBzdHJZZXN0ZGF5LCBzdW5kYXksIHRoaXNRdWFydGVyRW5kRGF5LCB0aGlzUXVhcnRlclN0YXJ0RGF5LCB0b21vcnJvdywgdmFsdWVzLCB3ZWVrLCB5ZWFyLCB5ZXN0ZGF5O1xuICBub3cgPSBuZXcgRGF0ZSgpO1xuICBtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gIHllc3RkYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICB0b21vcnJvdyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZCk7XG4gIHdlZWsgPSBub3cuZ2V0RGF5KCk7XG4gIG1pbnVzRGF5ID0gd2VlayAhPT0gMCA/IHdlZWsgLSAxIDogNjtcbiAgbW9uZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIChtaW51c0RheSAqIG1pbGxpc2Vjb25kKSk7XG4gIHN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RTdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICBsYXN0TW9uZGF5ID0gbmV3IERhdGUobGFzdFN1bmRheS5nZXRUaW1lKCkgLSAobWlsbGlzZWNvbmQgKiA2KSk7XG4gIG5leHRNb25kYXkgPSBuZXcgRGF0ZShzdW5kYXkuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpO1xuICBuZXh0U3VuZGF5ID0gbmV3IERhdGUobmV4dE1vbmRheS5nZXRUaW1lKCkgKyAobWlsbGlzZWNvbmQgKiA2KSk7XG4gIGN1cnJlbnRZZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gIHByZXZpb3VzWWVhciA9IGN1cnJlbnRZZWFyIC0gMTtcbiAgbmV4dFllYXIgPSBjdXJyZW50WWVhciArIDE7XG4gIGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpO1xuICB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gIG1vbnRoID0gbm93LmdldE1vbnRoKCk7XG4gIGZpcnN0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCwgMSk7XG4gIGlmIChjdXJyZW50TW9udGggPT09IDExKSB7XG4gICAgeWVhcisrO1xuICAgIG1vbnRoKys7XG4gIH0gZWxzZSB7XG4gICAgbW9udGgrKztcbiAgfVxuICBuZXh0TW9udGhGaXJzdERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgbmV4dE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgQ3JlYXRvci5nZXRNb250aERheXMoeWVhciwgbW9udGgpKTtcbiAgbGFzdERheSA9IG5ldyBEYXRlKG5leHRNb250aEZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgbGFzdE1vbnRoRmlyc3REYXkgPSBDcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBsYXN0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKGZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgdGhpc1F1YXJ0ZXJTdGFydERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCksIDEpO1xuICB0aGlzUXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpICsgMikpO1xuICBsYXN0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBsYXN0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyKSk7XG4gIG5leHRRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIG5leHRRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIpKTtcbiAgbGFzdF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDYgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDI5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg1OSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoODkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgxMTkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMjkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDU5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg4OSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDExOSAqIG1pbGxpc2Vjb25kKSk7XG4gIHN3aXRjaCAoa2V5KSB7XG4gICAgY2FzZSBcImxhc3RfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF95ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHByZXZpb3VzWWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUocHJldmlvdXNZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc195ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShjdXJyZW50WWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShuZXh0WWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUobmV4dFllYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF9xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChsYXN0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF9tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChmaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF9tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChsYXN0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyU3VuZGF5ID0gbW9tZW50KGxhc3RTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc193ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyU3VuZGF5ID0gbW9tZW50KHN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChuZXh0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyU3VuZGF5ID0gbW9tZW50KG5leHRTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwieWVzdGRheVwiOlxuICAgICAgc3RyWWVzdGRheSA9IG1vbWVudCh5ZXN0ZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5feWVzdGRheVwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJZZXN0ZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJZZXN0ZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRvZGF5XCI6XG4gICAgICBzdHJUb2RheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b2RheVwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJUb2RheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyVG9kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidG9tb3Jyb3dcIjpcbiAgICAgIHN0clRvbW9ycm93ID0gbW9tZW50KHRvbW9ycm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9tb3Jyb3dcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyVG9tb3Jyb3cgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvbW9ycm93ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfN19kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzdfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfMzBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMzBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfNjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfNjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfOTBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfOTBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfMTIwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8xMjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfN19kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzdfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfMzBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMzBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfNjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfNjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfOTBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfOTBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfMTIwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8xMjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICB9XG4gIHZhbHVlcyA9IFtzdGFydFZhbHVlLCBlbmRWYWx1ZV07XG4gIGlmIChmaWVsZF90eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICBfLmZvckVhY2godmFsdWVzLCBmdW5jdGlvbihmdikge1xuICAgICAgaWYgKGZ2KSB7XG4gICAgICAgIHJldHVybiBmdi5zZXRIb3Vycyhmdi5nZXRIb3VycygpICsgZnYuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGxhYmVsOiBsYWJlbCxcbiAgICBrZXk6IGtleSxcbiAgICB2YWx1ZXM6IHZhbHVlc1xuICB9O1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZERlZmF1bHRPcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIGlmIChmaWVsZF90eXBlICYmIENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuICdiZXR3ZWVuJztcbiAgfSBlbHNlIGlmIChbXCJ0ZXh0YXJlYVwiLCBcInRleHRcIiwgXCJjb2RlXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuICdjb250YWlucyc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwiPVwiO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkT3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSkge1xuICB2YXIgb3BlcmF0aW9ucywgb3B0aW9uYWxzO1xuICBvcHRpb25hbHMgPSB7XG4gICAgZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPVwiXG4gICAgfSxcbiAgICB1bmVxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl91bmVxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPD5cIlxuICAgIH0sXG4gICAgbGVzc190aGFuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX3RoYW5cIiksXG4gICAgICB2YWx1ZTogXCI8XCJcbiAgICB9LFxuICAgIGdyZWF0ZXJfdGhhbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl90aGFuXCIpLFxuICAgICAgdmFsdWU6IFwiPlwiXG4gICAgfSxcbiAgICBsZXNzX29yX2VxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX29yX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPD1cIlxuICAgIH0sXG4gICAgZ3JlYXRlcl9vcl9lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl9vcl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIj49XCJcbiAgICB9LFxuICAgIGNvbnRhaW5zOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9jb250YWluc1wiKSxcbiAgICAgIHZhbHVlOiBcImNvbnRhaW5zXCJcbiAgICB9LFxuICAgIG5vdF9jb250YWluOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9kb2VzX25vdF9jb250YWluXCIpLFxuICAgICAgdmFsdWU6IFwibm90Y29udGFpbnNcIlxuICAgIH0sXG4gICAgc3RhcnRzX3dpdGg6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3N0YXJ0c193aXRoXCIpLFxuICAgICAgdmFsdWU6IFwic3RhcnRzd2l0aFwiXG4gICAgfSxcbiAgICBiZXR3ZWVuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuXCIpLFxuICAgICAgdmFsdWU6IFwiYmV0d2VlblwiXG4gICAgfVxuICB9O1xuICBpZiAoZmllbGRfdHlwZSA9PT0gdm9pZCAwKSB7XG4gICAgcmV0dXJuIF8udmFsdWVzKG9wdGlvbmFscyk7XG4gIH1cbiAgb3BlcmF0aW9ucyA9IFtdO1xuICBpZiAoQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSkpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmJldHdlZW4pO1xuICAgIENyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwidGV4dFwiIHx8IGZpZWxkX3R5cGUgPT09IFwidGV4dGFyZWFcIiB8fCBmaWVsZF90eXBlID09PSBcImh0bWxcIiB8fCBmaWVsZF90eXBlID09PSBcImNvZGVcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuY29udGFpbnMpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwibG9va3VwXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImN1cnJlbmN5XCIgfHwgZmllbGRfdHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsLCBvcHRpb25hbHMubGVzc190aGFuLCBvcHRpb25hbHMuZ3JlYXRlcl90aGFuLCBvcHRpb25hbHMubGVzc19vcl9lcXVhbCwgb3B0aW9uYWxzLmdyZWF0ZXJfb3JfZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcIlt0ZXh0XVwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2Uge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfVxuICByZXR1cm4gb3BlcmF0aW9ucztcbn07XG5cblxuLypcbiAgICDlhYjmjInnhafmnInmjpLluo/lj7fnmoTlsI/nmoTlnKjliY3vvIzlpKfnmoTlnKjlkI5cbiAgICDlho3lsIbmsqHmnInmjpLluo/lj7fnmoTmmL7npLrlnKhcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZmllbGRzLCBmaWVsZHNBcnIsIGZpZWxkc05hbWUsIHJlZjtcbiAgZmllbGRzID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDA7XG4gIGZpZWxkc0FyciA9IFtdO1xuICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZHNBcnIucHVzaCh7XG4gICAgICBuYW1lOiBmaWVsZC5uYW1lLFxuICAgICAgc29ydF9ubzogZmllbGQuc29ydF9ub1xuICAgIH0pO1xuICB9KTtcbiAgZmllbGRzTmFtZSA9IFtdO1xuICBfLmVhY2goXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkc05hbWUucHVzaChmaWVsZC5uYW1lKTtcbiAgfSk7XG4gIHJldHVybiBmaWVsZHNOYW1lO1xufTtcbiIsIkNyZWF0b3IuX3RyaWdnZXJfaG9va3MgPSB7fVxuXG5pbml0VHJpZ2dlciA9IChvYmplY3RfbmFtZSwgdHJpZ2dlciktPlxuXHR0cnlcblx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxuXHRcdGlmICF0cmlnZ2VyLnRvZG9cblx0XHRcdHJldHVyblxuXHRcdHRvZG9XcmFwcGVyID0gKCktPlxuXHRcdFx0ICB0aGlzLm9iamVjdF9uYW1lID0gb2JqZWN0X25hbWVcblx0XHRcdCAgcmV0dXJuIHRyaWdnZXIudG9kby5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG5cdFx0aWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLmluc2VydFwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uLmJlZm9yZS5pbnNlcnQodG9kb1dyYXBwZXIpXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImJlZm9yZS51cGRhdGVcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbi5iZWZvcmUudXBkYXRlKHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUucmVtb3ZlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24uYmVmb3JlLnJlbW92ZSh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIuaW5zZXJ0XCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24uYWZ0ZXIuaW5zZXJ0KHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci51cGRhdGVcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbi5hZnRlci51cGRhdGUodG9kb1dyYXBwZXIpXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLnJlbW92ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uLmFmdGVyLnJlbW92ZSh0b2RvV3JhcHBlcilcblx0Y2F0Y2ggZXJyb3Jcblx0XHRjb25zb2xlLmVycm9yKCdpbml0VHJpZ2dlciBlcnJvcicsIGVycm9yKVxuXG5jbGVhblRyaWdnZXIgPSAob2JqZWN0X25hbWUpLT5cblx0IyMjXG4gICAgXHTnlLHkuo5jb2xsZWN0aW9uLWhvb2tzIHBhY2thZ2Ug55qEcmVtb3Zl5Ye95pWw5piv5L2/55So5LiL5qCH5Yig6Zmk5a+56LGh55qE77yM5omA5Lul5q2k5aSE5Y+N6L2saG9va3Ppm4blkIjlkI7vvIzlho3liKDpmaRcbiAgICBcdOWboOS4uuS4gOS4quaVsOe7hOWFg+e0oOWIoOmZpOWQju+8jOWFtuS7luWFg+e0oOeahOS4i+agh+S8muWPkeeUn+WPmOWMllxuXHQjIyNcbiAgICAjVE9ETyDnlLHkuo5jb2xsZWN0aW9uLWhvb2tzIHBhY2thZ2Ug55qEcmVtb3Zl5Ye95pWwYnVnXG5cdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdPy5yZXZlcnNlKCkuZm9yRWFjaCAoX2hvb2spLT5cblx0XHRfaG9vay5yZW1vdmUoKVxuXG5DcmVhdG9yLmluaXRUcmlnZ2VycyA9IChvYmplY3RfbmFtZSktPlxuI1x0Y29uc29sZS5sb2coJ0NyZWF0b3IuaW5pdFRyaWdnZXJzIG9iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdGNsZWFuVHJpZ2dlcihvYmplY3RfbmFtZSlcblxuXHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdXG5cblx0Xy5lYWNoIG9iai50cmlnZ2VycywgKHRyaWdnZXIsIHRyaWdnZXJfbmFtZSktPlxuXHRcdGlmIE1ldGVvci5pc1NlcnZlciBhbmQgdHJpZ2dlci5vbiA9PSBcInNlcnZlclwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxuXHRcdFx0X3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyIG9iamVjdF9uYW1lLCB0cmlnZ2VyXG5cdFx0XHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50IGFuZCB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCIgYW5kIHRyaWdnZXIudG9kbyBhbmQgdHJpZ2dlci53aGVuXG5cdFx0XHRfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIgb2JqZWN0X25hbWUsIHRyaWdnZXJcblx0XHRcdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vaykiLCJ2YXIgY2xlYW5UcmlnZ2VyLCBpbml0VHJpZ2dlcjtcblxuQ3JlYXRvci5fdHJpZ2dlcl9ob29rcyA9IHt9O1xuXG5pbml0VHJpZ2dlciA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCB0cmlnZ2VyKSB7XG4gIHZhciBjb2xsZWN0aW9uLCBlcnJvciwgdG9kb1dyYXBwZXI7XG4gIHRyeSB7XG4gICAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSk7XG4gICAgaWYgKCF0cmlnZ2VyLnRvZG8pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdG9kb1dyYXBwZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZTtcbiAgICAgIHJldHVybiB0cmlnZ2VyLnRvZG8uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLmluc2VydFwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbi5iZWZvcmUuaW5zZXJ0KHRvZG9XcmFwcGVyKTtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJiZWZvcmUudXBkYXRlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uLmJlZm9yZS51cGRhdGUodG9kb1dyYXBwZXIpO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS5yZW1vdmVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uYmVmb3JlLnJlbW92ZSh0b2RvV3JhcHBlcik7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYWZ0ZXIuaW5zZXJ0XCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uLmFmdGVyLmluc2VydCh0b2RvV3JhcHBlcik7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYWZ0ZXIudXBkYXRlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uLmFmdGVyLnVwZGF0ZSh0b2RvV3JhcHBlcik7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYWZ0ZXIucmVtb3ZlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uLmFmdGVyLnJlbW92ZSh0b2RvV3JhcHBlcik7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICBlcnJvciA9IGVycm9yMTtcbiAgICByZXR1cm4gY29uc29sZS5lcnJvcignaW5pdFRyaWdnZXIgZXJyb3InLCBlcnJvcik7XG4gIH1cbn07XG5cbmNsZWFuVHJpZ2dlciA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG5cbiAgLypcbiAgICAgXHTnlLHkuo5jb2xsZWN0aW9uLWhvb2tzIHBhY2thZ2Ug55qEcmVtb3Zl5Ye95pWw5piv5L2/55So5LiL5qCH5Yig6Zmk5a+56LGh55qE77yM5omA5Lul5q2k5aSE5Y+N6L2saG9va3Ppm4blkIjlkI7vvIzlho3liKDpmaRcbiAgICAgXHTlm6DkuLrkuIDkuKrmlbDnu4TlhYPntKDliKDpmaTlkI7vvIzlhbbku5blhYPntKDnmoTkuIvmoIfkvJrlj5HnlJ/lj5jljJZcbiAgICovXG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0pICE9IG51bGwgPyByZWYucmV2ZXJzZSgpLmZvckVhY2goZnVuY3Rpb24oX2hvb2spIHtcbiAgICByZXR1cm4gX2hvb2sucmVtb3ZlKCk7XG4gIH0pIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5pbml0VHJpZ2dlcnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgb2JqO1xuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNsZWFuVHJpZ2dlcihvYmplY3RfbmFtZSk7XG4gIENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdID0gW107XG4gIHJldHVybiBfLmVhY2gob2JqLnRyaWdnZXJzLCBmdW5jdGlvbih0cmlnZ2VyLCB0cmlnZ2VyX25hbWUpIHtcbiAgICB2YXIgX3RyaWdnZXJfaG9vaztcbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwic2VydmVyXCIgJiYgdHJpZ2dlci50b2RvICYmIHRyaWdnZXIud2hlbikge1xuICAgICAgX3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyKG9iamVjdF9uYW1lLCB0cmlnZ2VyKTtcbiAgICAgIENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vayk7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIiAmJiB0cmlnZ2VyLnRvZG8gJiYgdHJpZ2dlci53aGVuKSB7XG4gICAgICBfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIob2JqZWN0X25hbWUsIHRyaWdnZXIpO1xuICAgICAgcmV0dXJuIENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vayk7XG4gICAgfVxuICB9KTtcbn07XG4iLCJDcmVhdG9yLmdldFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRpZiAhb2JqXG5cdFx0XHRyZXR1cm5cblx0XHRyZXR1cm4gb2JqLnBlcm1pc3Npb25zLmdldCgpXG5cdGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0Q3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXG5DcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lLCByZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCktPlxuXHRpZiAhb2JqZWN0X25hbWUgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdHBlcm1pc3Npb25zID0gXy5jbG9uZShDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKSlcblxuXHRpZiByZWNvcmRcblx0XHRpc093bmVyID0gcmVjb3JkLm93bmVyID09IHVzZXJJZCB8fCByZWNvcmQub3duZXI/Ll9pZCA9PSB1c2VySWRcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHVzZXJfY29tcGFueV9pZHMgPSBTdGVlZG9zLmdldFVzZXJDb21wYW55SWRzKClcblx0XHRlbHNlXG5cdFx0XHR1c2VyX2NvbXBhbnlfaWRzID0gQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyh1c2VySWQsIHNwYWNlSWQpXG5cdFx0cmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmQ/LmNvbXBhbnlfaWRcblx0XHRpZiByZWNvcmRfY29tcGFueV9pZCBhbmQgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZCkgYW5kIHJlY29yZF9jb21wYW55X2lkLl9pZFxuXHRcdFx0IyDlm6ByZWNvcmRfY29tcGFueV9pZOaYr2xvb2t1cOexu+Wei++8jOacieWPr+iDvWR45o6n5Lu25Lya5oqK5a6D5pig5bCE6L2s5Li65a+55bqU55qEb2JqZWN077yM5omA5Lul6L+Z6YeM5Y+W5Ye65YW2X2lk5YC8XG5cdFx0XHRyZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZF9jb21wYW55X2lkLl9pZFxuXHRcdGlmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIGFuZCAhaXNPd25lciBhbmQgIXBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdGVsc2UgaWYgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkIGFuZCBfLmlzU3RyaW5nKHJlY29yZF9jb21wYW55X2lkKVxuXHRcdFx0XHRpZiB1c2VyX2NvbXBhbnlfaWRzIGFuZCB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aFxuXHRcdFx0XHRcdGlmICFfLmluY2x1ZGUodXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWQpXG5cdFx0XHRcdFx0XHQjIOiusOW9leeahGNvbXBhbnlfaWTlsZ7mgKfkuI3lnKjlvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz6IyD5Zu05YaF5pe277yM6K6k5Li65peg5p2D5L+u5pS5XG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0IyDorrDlvZXmnIljb21wYW55X2lk5bGe5oCn77yM5L2G5piv5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+S4uuepuuaXtu+8jOiupOS4uuaXoOadg+S/ruaUuVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFxuXHRcdGlmIHJlY29yZC5sb2NrZWQgYW5kICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXG5cdFx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCAhaXNPd25lciBhbmQgIXBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2Vcblx0XHRlbHNlIGlmIHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWQgYW5kIF8uaXNTdHJpbmcocmVjb3JkX2NvbXBhbnlfaWQpXG5cdFx0XHRcdGlmIHVzZXJfY29tcGFueV9pZHMgYW5kIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0aWYgIV8uaW5jbHVkZSh1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZClcblx0XHRcdFx0XHRcdCMg6K6w5b2V55qEY29tcGFueV9pZOWxnuaAp+S4jeWcqOW9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPojIPlm7TlhoXml7bvvIzorqTkuLrml6DmnYPmn6XnnItcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQjIOiusOW9leaciWNvbXBhbnlfaWTlsZ7mgKfvvIzkvYbmmK/lvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz5Li656m65pe277yM6K6k5Li65peg5p2D5p+l55yLXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2VcblxuXHRyZXR1cm4gcGVybWlzc2lvbnNcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cblx0Q3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyA9IChzcGFjZUlkLCB1c2VySWQpIC0+XG5cdFx0cGVybWlzc2lvbnMgPVxuXHRcdFx0b2JqZWN0czoge31cblx0XHRcdGFzc2lnbmVkX2FwcHM6IFtdXG5cdFx0cHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzTWVtYmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNHdWVzdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNXb3JrZmxvd0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd3b3JrZmxvd19hZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCB1c2VyczoxfX0pIHx8IG51bGxcblx0XHRwc2V0c09yZ2FuaXphdGlvbkFkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdvcmdhbml6YXRpb25fYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgdXNlcnM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXG5cdFx0cHNldHNBZG1pbl9wb3MgPSBudWxsXG5cdFx0cHNldHNVc2VyX3BvcyA9IG51bGxcblx0XHRwc2V0c01lbWJlcl9wb3MgPSBudWxsXG5cdFx0cHNldHNHdWVzdF9wb3MgPSBudWxsXG5cdFx0cHNldHNXb3JrZmxvd0FkbWluX3BvcyA9IG51bGxcblx0XHRwc2V0c09yZ2FuaXphdGlvbkFkbWluX3BvcyA9IG51bGxcblx0XHRwc2V0c0N1cnJlbnRfcG9zID0gbnVsbFxuXG5cdFx0aWYgcHNldHNBZG1pbj8uX2lkXG5cdFx0XHRwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c1VzZXI/Ll9pZFxuXHRcdFx0cHNldHNVc2VyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzTWVtYmVyPy5faWRcblx0XHRcdHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNHdWVzdD8uX2lkXG5cdFx0XHRwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c1dvcmtmbG93QWRtaW4/Ll9pZFxuXHRcdFx0cHNldHNXb3JrZmxvd0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNXb3JrZmxvd0FkbWluLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzT3JnYW5pemF0aW9uQWRtaW4/Ll9pZFxuXHRcdFx0cHNldHNPcmdhbml6YXRpb25BZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzT3JnYW5pemF0aW9uQWRtaW4uX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNDdXJyZW50Lmxlbmd0aCA+IDBcblx0XHRcdHNldF9pZHMgPSBfLnBsdWNrIHBzZXRzQ3VycmVudCwgXCJfaWRcIlxuXHRcdFx0cHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogc2V0X2lkc319KS5mZXRjaCgpXG5cdFx0XHRwc2V0c0N1cnJlbnROYW1lcyA9IF8ucGx1Y2sgcHNldHNDdXJyZW50LCBcIm5hbWVcIlxuXHRcdGlzU3BhY2VBZG1pbiA9IGZhbHNlXG5cdFx0c3BhY2VVc2VyID0gbnVsbFxuXHRcdGlmIHVzZXJJZFxuXHRcdFx0aXNTcGFjZUFkbWluID0gQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxuXHRcdFx0aXNXb3JrZmxvd0FkbWluID0gcHNldHNXb3JrZmxvd0FkbWluPy51c2Vycz8uaW5jbHVkZXModXNlcklkKVxuXHRcdFx0aXNPcmdhbml6YXRpb25BZG1pbiA9IHBzZXRzT3JnYW5pemF0aW9uQWRtaW4/LnVzZXJzPy5pbmNsdWRlcyh1c2VySWQpXG5cdFx0XHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcblxuXHRcdHBzZXRzID0geyBcblx0XHRcdHBzZXRzQWRtaW4sIFxuXHRcdFx0cHNldHNVc2VyLCBcblx0XHRcdHBzZXRzQ3VycmVudCwgXG5cdFx0XHRwc2V0c01lbWJlciwgXG5cdFx0XHRwc2V0c0d1ZXN0LCBcblx0XHRcdHBzZXRzV29ya2Zsb3dBZG1pbiwgXG5cdFx0XHRwc2V0c09yZ2FuaXphdGlvbkFkbWluLCBcblx0XHRcdGlzU3BhY2VBZG1pbiwgXG5cdFx0XHRpc1dvcmtmbG93QWRtaW4sXG5cdFx0XHRpc09yZ2FuaXphdGlvbkFkbWluLFxuXHRcdFx0c3BhY2VVc2VyLCBcblx0XHRcdHBzZXRzQWRtaW5fcG9zLCBcblx0XHRcdHBzZXRzVXNlcl9wb3MsIFxuXHRcdFx0cHNldHNNZW1iZXJfcG9zLCBcblx0XHRcdHBzZXRzR3Vlc3RfcG9zLCBcblx0XHRcdHBzZXRzV29ya2Zsb3dBZG1pbl9wb3MsIFxuXHRcdFx0cHNldHNPcmdhbml6YXRpb25BZG1pbl9wb3MsIFxuXHRcdFx0cHNldHNDdXJyZW50X3Bvc1xuXHRcdH1cblx0XHRwZXJtaXNzaW9ucy5hc3NpZ25lZF9hcHBzID0gQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKVxuXHRcdHBlcm1pc3Npb25zLmFzc2lnbmVkX21lbnVzID0gQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZClcblx0XHRwZXJtaXNzaW9ucy51c2VyX3Blcm1pc3Npb25fc2V0cyA9IHBzZXRzQ3VycmVudE5hbWVzXG5cdFx0X2kgPSAwXG5cdFx0Xy5lYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG9iamVjdCwgb2JqZWN0X25hbWUpLT5cblx0XHRcdF9pKytcblx0XHRcdGlmICFfLmhhcyhvYmplY3QsICdzcGFjZScpIHx8ICFvYmplY3Quc3BhY2UgfHwgb2JqZWN0LnNwYWNlID09IHNwYWNlSWRcblx0XHRcdFx0cGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV0gPSBfLmNsb25lIENyZWF0b3IuY29udmVydE9iamVjdChDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXVtcInBlcm1pc3Npb25zXCJdID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdHJldHVybiBwZXJtaXNzaW9uc1xuXG5cdHVuaW9uUGx1cyA9IChhcnJheSwgb3RoZXIpIC0+XG5cdFx0aWYgIWFycmF5IGFuZCAhb3RoZXJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcblx0XHRpZiAhYXJyYXlcblx0XHRcdGFycmF5ID0gW11cblx0XHRpZiAhb3RoZXJcblx0XHRcdG90aGVyID0gW11cblx0XHRyZXR1cm4gXy51bmlvbihhcnJheSwgb3RoZXIpXG5cblx0Q3JlYXRvci5nZXRBc3NpZ25lZEFwcHMgPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdFx0cHNldHNBZG1pbiA9IHRoaXMucHNldHNBZG1pbiB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRwc2V0c1VzZXIgPSB0aGlzLnBzZXRzVXNlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdCMgcHNldHNNZW1iZXIgPSB0aGlzLnBzZXRzTWVtYmVyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHQjIHBzZXRzR3Vlc3QgPSB0aGlzLnBzZXRzR3Vlc3QgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdndWVzdCd9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0cHNldHMgPSAgdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pLmZldGNoKClcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblx0XHRhcHBzID0gW11cblx0XHRpZiBpc1NwYWNlQWRtaW5cblx0XHRcdHJldHVybiBbXVxuXHRcdGVsc2Vcblx0XHRcdHBzZXRCYXNlID0gcHNldHNVc2VyXG5cdFx0XHRpZiBwc2V0QmFzZT8uYXNzaWduZWRfYXBwcz8ubGVuZ3RoXG5cdFx0XHRcdGFwcHMgPSBfLnVuaW9uIGFwcHMsIHBzZXRCYXNlLmFzc2lnbmVkX2FwcHNcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyB1c2Vy5p2D6ZmQ57uE5Lit55qEYXNzaWduZWRfYXBwc+ihqOekuuaJgOacieeUqOaIt+WFt+acieeahGFwcHPmnYPpmZDvvIzkuLrnqbrliJnooajnpLrmnInmiYDmnIlhcHBz5p2D6ZmQ77yM5LiN6ZyA6KaB5L2c5p2D6ZmQ5Yik5pat5LqGXG5cdFx0XHRcdHJldHVybiBbXVxuXHRcdFx0Xy5lYWNoIHBzZXRzLCAocHNldCktPlxuXHRcdFx0XHRpZiAhcHNldC5hc3NpZ25lZF9hcHBzXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdGlmIHBzZXQubmFtZSA9PSBcImFkbWluXCIgfHwgIHBzZXQubmFtZSA9PSBcInVzZXJcIlxuXHRcdFx0XHRcdCMg6L+Z6YeM5LmL5omA5Lul6KaB5o6S6ZmkYWRtaW4vdXNlcu+8jOaYr+WboOS4uui/meS4pOS4quadg+mZkOe7hOaYr+aJgOacieadg+mZkOe7hOS4rXVzZXJz5bGe5oCn5peg5pWI55qE5p2D6ZmQ57uE77yM54m55oyH5bel5L2c5Yy6566h55CG5ZGY5ZKM5omA5pyJ55So5oi3XG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdGFwcHMgPSBfLnVuaW9uIGFwcHMsIHBzZXQuYXNzaWduZWRfYXBwc1xuXHRcdFx0cmV0dXJuIF8ud2l0aG91dChfLnVuaXEoYXBwcyksdW5kZWZpbmVkLG51bGwpXG5cblx0Q3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzID0gKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRcdHBzZXRzID0gIHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cdFx0YWRtaW5NZW51cyA9IENyZWF0b3IuQXBwcy5hZG1pbj8uYWRtaW5fbWVudXNcblx0XHQjIOWmguaenOayoeaciWFkbWlu6I+c5Y2V6K+05piO5LiN6ZyA6KaB55u45YWz5Yqf6IO977yM55u05o6l6L+U5Zue56m6XG5cdFx0dW5sZXNzIGFkbWluTWVudXNcblx0XHRcdHJldHVybiBbXVxuXHRcdGFib3V0TWVudSA9IGFkbWluTWVudXMuZmluZCAobikgLT5cblx0XHRcdG4uX2lkID09ICdhYm91dCdcblx0XHRhZG1pbk1lbnVzID0gYWRtaW5NZW51cy5maWx0ZXIgKG4pIC0+XG5cdFx0XHRuLl9pZCAhPSAnYWJvdXQnXG5cdFx0b3RoZXJNZW51QXBwcyA9IF8uc29ydEJ5IF8uZmlsdGVyKF8udmFsdWVzKENyZWF0b3IuQXBwcyksIChuKSAtPlxuXHRcdFx0cmV0dXJuIG4uYWRtaW5fbWVudXMgYW5kIG4uX2lkICE9ICdhZG1pbidcblx0XHQpLCAnc29ydCdcblx0XHRvdGhlck1lbnVzID0gXy5mbGF0dGVuKF8ucGx1Y2sob3RoZXJNZW51QXBwcywgXCJhZG1pbl9tZW51c1wiKSlcblx0XHQjIOiPnOWNleacieS4iemDqOWIhue7hOaIkOiuvue9rkFQUOiPnOWNleOAgeWFtuS7lkFQUOiPnOWNleS7peWPimFib3V06I+c5Y2VXG5cdFx0YWxsTWVudXMgPSBfLnVuaW9uKGFkbWluTWVudXMsIG90aGVyTWVudXMsIFthYm91dE1lbnVdKVxuXHRcdGlmIGlzU3BhY2VBZG1pblxuXHRcdFx0IyDlt6XkvZzljLrnrqHnkIblkZjmnInlhajpg6joj5zljZXlip/og71cblx0XHRcdHJldHVybiBhbGxNZW51c1xuXHRcdGVsc2Vcblx0XHRcdGN1cnJlbnRQc2V0TmFtZXMgPSBwc2V0cy5tYXAgKG4pIC0+XG5cdFx0XHRcdHJldHVybiBuLm5hbWVcblx0XHRcdG1lbnVzID0gYWxsTWVudXMuZmlsdGVyIChtZW51KS0+XG5cdFx0XHRcdHBzZXRzTWVudSA9IG1lbnUucGVybWlzc2lvbl9zZXRzXG5cdFx0XHRcdCMg5aaC5p6c5pmu6YCa55So5oi35pyJ5p2D6ZmQ77yM5YiZ55u05o6l6L+U5ZuedHJ1ZVxuXHRcdFx0XHRpZiBwc2V0c01lbnUgJiYgcHNldHNNZW51LmluZGV4T2YoXCJ1c2VyXCIpID4gLTFcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0XHQjIOWQpuWImeWPluW9k+WJjeeUqOaIt+eahOadg+mZkOmbhuS4jm1lbnXoj5zljZXopoHmsYLnmoTmnYPpmZDpm4blr7nmr5TvvIzlpoLmnpzkuqTpm4blpKfkuo4x5Liq5YiZ6L+U5ZuedHJ1ZVxuXHRcdFx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24oY3VycmVudFBzZXROYW1lcywgcHNldHNNZW51KS5sZW5ndGhcblx0XHRcdHJldHVybiBtZW51c1xuXG5cdGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QgPSAocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQpLT5cblxuXHRcdGlmIF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBudWxsXG5cdFx0aWYgXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBfLmZpbmQgcGVybWlzc2lvbl9vYmplY3RzLCAocG8pLT5cblx0XHRcdFx0XHRyZXR1cm4gcG8ub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQ6IHBlcm1pc3Npb25fc2V0X2lkfSlcblxuXHRmaW5kX3Blcm1pc3Npb25fb2JqZWN0ID0gKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkcyktPlxuXHRcdGlmIF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBudWxsXG5cdFx0aWYgXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBfLmZpbHRlciBwZXJtaXNzaW9uX29iamVjdHMsIChwbyktPlxuXHRcdFx0XHRyZXR1cm4gcG8ub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcblx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogcGVybWlzc2lvbl9zZXRfaWRzfX0pLmZldGNoKClcblxuXHRDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zID0gKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpLT5cblx0XHRwZXJtaXNzaW9ucyA9IHt9XG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpXG5cblx0XHRpZiBzcGFjZUlkIGlzICdndWVzdCcgfHwgb2JqZWN0X25hbWUgPT0gXCJ1c2Vyc1wiXG5cdFx0XHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fVxuXHRcdFx0Q3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgcGVybWlzc2lvbnNcblx0XHRcdHJldHVybiBwZXJtaXNzaW9uc1xuXHRcdHBzZXRzQWRtaW4gPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzQWRtaW4pIG9yIHRoaXMucHNldHNBZG1pbiB0aGVuIHRoaXMucHNldHNBZG1pbiBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c1VzZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzVXNlcikgb3IgdGhpcy5wc2V0c1VzZXIgdGhlbiB0aGlzLnBzZXRzVXNlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzTWVtYmVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c01lbWJlcikgb3IgdGhpcy5wc2V0c01lbWJlciB0aGVuIHRoaXMucHNldHNNZW1iZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ21lbWJlcid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzR3Vlc3QgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzR3Vlc3QpIG9yIHRoaXMucHNldHNHdWVzdCB0aGVuIHRoaXMucHNldHNHdWVzdCBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c1dvcmtmbG93QWRtaW4gPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzV29ya2Zsb3dBZG1pbikgb3IgdGhpcy5wc2V0c1dvcmtmbG93QWRtaW4gdGhlbiB0aGlzLnBzZXRzV29ya2Zsb3dBZG1pbiBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnd29ya2Zsb3dfYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIHVzZXJzOjF9fSlcblx0XHRwc2V0c09yZ2FuaXphdGlvbkFkbWluID0gaWYgXy5pc051bGwodGhpcy5wc2V0c09yZ2FuaXphdGlvbkFkbWluKSBvciB0aGlzLnBzZXRzT3JnYW5pemF0aW9uQWRtaW4gdGhlbiB0aGlzLnBzZXRzT3JnYW5pemF0aW9uQWRtaW4gZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ29yZ2FuaXphdGlvbl9hZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgdXNlcnM6MX19KVxuXHRcdHBzZXRzID0gIHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjF9fSkuZmV0Y2goKVxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxuXHRcdGlzV29ya2Zsb3dBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNXb3JrZmxvd0FkbWluKSB0aGVuIHRoaXMuaXNXb3JrZmxvd0FkbWluIGVsc2UgcHNldHNXb3JrZmxvd0FkbWluPy51c2Vycz8uaW5jbHVkZXModXNlcklkKVxuXHRcdGlzT3JnYW5pemF0aW9uQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzT3JnYW5pemF0aW9uQWRtaW4pIHRoZW4gdGhpcy5pc09yZ2FuaXphdGlvbkFkbWluIGVsc2UgcHNldHNPcmdhbml6YXRpb25BZG1pbj8udXNlcnM/LmluY2x1ZGVzKHVzZXJJZClcblxuXHRcdHBzZXRzQWRtaW5fcG9zID0gdGhpcy5wc2V0c0FkbWluX3Bvc1xuXHRcdHBzZXRzVXNlcl9wb3MgPSB0aGlzLnBzZXRzVXNlcl9wb3Ncblx0XHRwc2V0c01lbWJlcl9wb3MgPSB0aGlzLnBzZXRzTWVtYmVyX3Bvc1xuXHRcdHBzZXRzR3Vlc3RfcG9zID0gdGhpcy5wc2V0c0d1ZXN0X3Bvc1xuXHRcdHBzZXRzV29ya2Zsb3dBZG1pbl9wb3MgPSB0aGlzLnBzZXRzV29ya2Zsb3dBZG1pbl9wb3Ncblx0XHRwc2V0c09yZ2FuaXphdGlvbkFkbWluX3BvcyA9IHRoaXMucHNldHNPcmdhbml6YXRpb25BZG1pbl9wb3Ncblx0XHRwc2V0c0N1cnJlbnRfcG9zID0gdGhpcy5wc2V0c0N1cnJlbnRfcG9zXG5cblx0XHRvcHNldEFkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuYWRtaW4pIHx8IHt9XG5cdFx0b3BzZXRVc2VyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQudXNlcikgfHwge31cblx0XHRvcHNldE1lbWJlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm1lbWJlcikgfHwge31cblx0XHRvcHNldEd1ZXN0ID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9XG5cdFx0b3BzZXRXb3JrZmxvd0FkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQud29ya2Zsb3dfYWRtaW4pIHx8IHt9XG5cdFx0b3BzZXRPcmdhbml6YXRpb25BZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm9yZ2FuaXphdGlvbl9hZG1pbikgfHwge31cblx0XHQjIHNoYXJlZExpc3RWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X2xpc3R2aWV3cycpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNoYXJlZDogdHJ1ZX0sIHtmaWVsZHM6e19pZDoxfX0pLmZldGNoKClcblx0XHQjIHNoYXJlZExpc3RWaWV3cyA9IF8ucGx1Y2soc2hhcmVkTGlzdFZpZXdzLFwiX2lkXCIpXG5cdFx0IyBpZiBzaGFyZWRMaXN0Vmlld3MubGVuZ3RoXG5cdFx0IyBcdHVubGVzcyBvcHNldEFkbWluLmxpc3Rfdmlld3Ncblx0XHQjIFx0XHRvcHNldEFkbWluLmxpc3Rfdmlld3MgPSBbXVxuXHRcdCMgXHRvcHNldEFkbWluLmxpc3Rfdmlld3MgPSBfLnVuaW9uIG9wc2V0QWRtaW4ubGlzdF92aWV3cywgc2hhcmVkTGlzdFZpZXdzXG5cdFx0IyBcdHVubGVzcyBvcHNldFVzZXIubGlzdF92aWV3c1xuXHRcdCMgXHRcdG9wc2V0VXNlci5saXN0X3ZpZXdzID0gW11cblx0XHQjIFx0b3BzZXRVc2VyLmxpc3Rfdmlld3MgPSBfLnVuaW9uIG9wc2V0VXNlci5saXN0X3ZpZXdzLCBzaGFyZWRMaXN0Vmlld3Ncblx0XHQjIOaVsOaNruW6k+S4reWmguaenOmFjee9ruS6hum7mOiupOeahGFkbWluL3VzZXLmnYPpmZDpm4borr7nva7vvIzlupTor6Xopobnm5bku6PnoIHkuK1hZG1pbi91c2Vy55qE5p2D6ZmQ6ZuG6K6+572uXG5cdFx0aWYgcHNldHNBZG1pblxuXHRcdFx0cG9zQWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNBZG1pbi5faWQpXG5cdFx0XHRpZiBwb3NBZG1pblxuXHRcdFx0XHRvcHNldEFkbWluLmFsbG93Q3JlYXRlID0gcG9zQWRtaW4uYWxsb3dDcmVhdGVcblx0XHRcdFx0b3BzZXRBZG1pbi5hbGxvd0RlbGV0ZSA9IHBvc0FkbWluLmFsbG93RGVsZXRlXG5cdFx0XHRcdG9wc2V0QWRtaW4uYWxsb3dFZGl0ID0gcG9zQWRtaW4uYWxsb3dFZGl0XG5cdFx0XHRcdG9wc2V0QWRtaW4uYWxsb3dSZWFkID0gcG9zQWRtaW4uYWxsb3dSZWFkXG5cdFx0XHRcdG9wc2V0QWRtaW4ubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0FkbWluLm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0b3BzZXRBZG1pbi52aWV3QWxsUmVjb3JkcyA9IHBvc0FkbWluLnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdG9wc2V0QWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NBZG1pbi5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRvcHNldEFkbWluLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0FkbWluLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRvcHNldEFkbWluLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzXG5cdFx0XHRcdG9wc2V0QWRtaW4uZGlzYWJsZWRfYWN0aW9ucyA9IHBvc0FkbWluLmRpc2FibGVkX2FjdGlvbnNcblx0XHRcdFx0b3BzZXRBZG1pbi51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0FkbWluLnVucmVhZGFibGVfZmllbGRzXG5cdFx0XHRcdG9wc2V0QWRtaW4udW5lZGl0YWJsZV9maWVsZHMgPSBwb3NBZG1pbi51bmVkaXRhYmxlX2ZpZWxkc1xuXHRcdFx0XHRvcHNldEFkbWluLnVucmVsYXRlZF9vYmplY3RzID0gcG9zQWRtaW4udW5yZWxhdGVkX29iamVjdHNcblx0XHRpZiBwc2V0c1VzZXJcblx0XHRcdHBvc1VzZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzVXNlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1VzZXIuX2lkKVxuXHRcdFx0aWYgcG9zVXNlclxuXHRcdFx0XHRvcHNldFVzZXIuYWxsb3dDcmVhdGUgPSBwb3NVc2VyLmFsbG93Q3JlYXRlXG5cdFx0XHRcdG9wc2V0VXNlci5hbGxvd0RlbGV0ZSA9IHBvc1VzZXIuYWxsb3dEZWxldGVcblx0XHRcdFx0b3BzZXRVc2VyLmFsbG93RWRpdCA9IHBvc1VzZXIuYWxsb3dFZGl0XG5cdFx0XHRcdG9wc2V0VXNlci5hbGxvd1JlYWQgPSBwb3NVc2VyLmFsbG93UmVhZFxuXHRcdFx0XHRvcHNldFVzZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldFVzZXIudmlld0FsbFJlY29yZHMgPSBwb3NVc2VyLnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdG9wc2V0VXNlci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0b3BzZXRVc2VyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdG9wc2V0VXNlci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zVXNlci5kaXNhYmxlZF9saXN0X3ZpZXdzXG5cdFx0XHRcdG9wc2V0VXNlci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zVXNlci5kaXNhYmxlZF9hY3Rpb25zXG5cdFx0XHRcdG9wc2V0VXNlci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1VzZXIudW5yZWFkYWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRVc2VyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zVXNlci51bmVkaXRhYmxlX2ZpZWxkc1xuXHRcdFx0XHRvcHNldFVzZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NVc2VyLnVucmVsYXRlZF9vYmplY3RzXG5cdFx0aWYgcHNldHNNZW1iZXJcblx0XHRcdHBvc01lbWJlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNNZW1iZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNNZW1iZXIuX2lkKVxuXHRcdFx0aWYgcG9zTWVtYmVyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmFsbG93Q3JlYXRlID0gcG9zTWVtYmVyLmFsbG93Q3JlYXRlXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmFsbG93RGVsZXRlID0gcG9zTWVtYmVyLmFsbG93RGVsZXRlXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmFsbG93RWRpdCA9IHBvc01lbWJlci5hbGxvd0VkaXRcblx0XHRcdFx0b3BzZXRNZW1iZXIuYWxsb3dSZWFkID0gcG9zTWVtYmVyLmFsbG93UmVhZFxuXHRcdFx0XHRvcHNldE1lbWJlci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zTWVtYmVyLm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0b3BzZXRNZW1iZXIudmlld0FsbFJlY29yZHMgPSBwb3NNZW1iZXIudmlld0FsbFJlY29yZHNcblx0XHRcdFx0b3BzZXRNZW1iZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NNZW1iZXIubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0b3BzZXRNZW1iZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zTWVtYmVyLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRvcHNldE1lbWJlci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zTWVtYmVyLmRpc2FibGVkX2xpc3Rfdmlld3Ncblx0XHRcdFx0b3BzZXRNZW1iZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc01lbWJlci5kaXNhYmxlZF9hY3Rpb25zXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnVucmVhZGFibGVfZmllbGRzID0gcG9zTWVtYmVyLnVucmVhZGFibGVfZmllbGRzXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zTWVtYmVyLnVuZWRpdGFibGVfZmllbGRzXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zTWVtYmVyLnVucmVsYXRlZF9vYmplY3RzXG5cdFx0aWYgcHNldHNHdWVzdFxuXHRcdFx0cG9zR3Vlc3QgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzR3Vlc3RfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNHdWVzdC5faWQpXG5cdFx0XHRpZiBwb3NHdWVzdFxuXHRcdFx0XHRvcHNldEd1ZXN0LmFsbG93Q3JlYXRlID0gcG9zR3Vlc3QuYWxsb3dDcmVhdGVcblx0XHRcdFx0b3BzZXRHdWVzdC5hbGxvd0RlbGV0ZSA9IHBvc0d1ZXN0LmFsbG93RGVsZXRlXG5cdFx0XHRcdG9wc2V0R3Vlc3QuYWxsb3dFZGl0ID0gcG9zR3Vlc3QuYWxsb3dFZGl0XG5cdFx0XHRcdG9wc2V0R3Vlc3QuYWxsb3dSZWFkID0gcG9zR3Vlc3QuYWxsb3dSZWFkXG5cdFx0XHRcdG9wc2V0R3Vlc3QubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0d1ZXN0Lm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0b3BzZXRHdWVzdC52aWV3QWxsUmVjb3JkcyA9IHBvc0d1ZXN0LnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdG9wc2V0R3Vlc3QubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NHdWVzdC5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRvcHNldEd1ZXN0LnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0d1ZXN0LnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRvcHNldEd1ZXN0LmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NHdWVzdC5kaXNhYmxlZF9saXN0X3ZpZXdzXG5cdFx0XHRcdG9wc2V0R3Vlc3QuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc0d1ZXN0LmRpc2FibGVkX2FjdGlvbnNcblx0XHRcdFx0b3BzZXRHdWVzdC51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0d1ZXN0LnVucmVhZGFibGVfZmllbGRzXG5cdFx0XHRcdG9wc2V0R3Vlc3QudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NHdWVzdC51bmVkaXRhYmxlX2ZpZWxkc1xuXHRcdFx0XHRvcHNldEd1ZXN0LnVucmVsYXRlZF9vYmplY3RzID0gcG9zR3Vlc3QudW5yZWxhdGVkX29iamVjdHNcblx0XHRpZiBwc2V0c1dvcmtmbG93QWRtaW5cblx0XHRcdHBvc1dvcmtmbG93QWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzV29ya2Zsb3dBZG1pbl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1dvcmtmbG93QWRtaW4uX2lkKVxuXHRcdFx0aWYgcG9zV29ya2Zsb3dBZG1pblxuXHRcdFx0XHRvcHNldFdvcmtmbG93QWRtaW4uYWxsb3dDcmVhdGUgPSBwb3NXb3JrZmxvd0FkbWluLmFsbG93Q3JlYXRlXG5cdFx0XHRcdG9wc2V0V29ya2Zsb3dBZG1pbi5hbGxvd0RlbGV0ZSA9IHBvc1dvcmtmbG93QWRtaW4uYWxsb3dEZWxldGVcblx0XHRcdFx0b3BzZXRXb3JrZmxvd0FkbWluLmFsbG93RWRpdCA9IHBvc1dvcmtmbG93QWRtaW4uYWxsb3dFZGl0XG5cdFx0XHRcdG9wc2V0V29ya2Zsb3dBZG1pbi5hbGxvd1JlYWQgPSBwb3NXb3JrZmxvd0FkbWluLmFsbG93UmVhZFxuXHRcdFx0XHRvcHNldFdvcmtmbG93QWRtaW4ubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1dvcmtmbG93QWRtaW4ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldFdvcmtmbG93QWRtaW4udmlld0FsbFJlY29yZHMgPSBwb3NXb3JrZmxvd0FkbWluLnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdG9wc2V0V29ya2Zsb3dBZG1pbi5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc1dvcmtmbG93QWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0b3BzZXRXb3JrZmxvd0FkbWluLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1dvcmtmbG93QWRtaW4udmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdG9wc2V0V29ya2Zsb3dBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zV29ya2Zsb3dBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzXG5cdFx0XHRcdG9wc2V0V29ya2Zsb3dBZG1pbi5kaXNhYmxlZF9hY3Rpb25zID0gcG9zV29ya2Zsb3dBZG1pbi5kaXNhYmxlZF9hY3Rpb25zXG5cdFx0XHRcdG9wc2V0V29ya2Zsb3dBZG1pbi51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1dvcmtmbG93QWRtaW4udW5yZWFkYWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRXb3JrZmxvd0FkbWluLnVuZWRpdGFibGVfZmllbGRzID0gcG9zV29ya2Zsb3dBZG1pbi51bmVkaXRhYmxlX2ZpZWxkc1xuXHRcdFx0XHRvcHNldFdvcmtmbG93QWRtaW4udW5yZWxhdGVkX29iamVjdHMgPSBwb3NXb3JrZmxvd0FkbWluLnVucmVsYXRlZF9vYmplY3RzXG5cdFx0aWYgcHNldHNPcmdhbml6YXRpb25BZG1pblxuXHRcdFx0cG9zT3JnYW5pemF0aW9uQWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzT3JnYW5pemF0aW9uQWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNPcmdhbml6YXRpb25BZG1pbi5faWQpXG5cdFx0XHRpZiBwb3NPcmdhbml6YXRpb25BZG1pblxuXHRcdFx0XHRvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93Q3JlYXRlID0gcG9zT3JnYW5pemF0aW9uQWRtaW4uYWxsb3dDcmVhdGVcblx0XHRcdFx0b3BzZXRPcmdhbml6YXRpb25BZG1pbi5hbGxvd0RlbGV0ZSA9IHBvc09yZ2FuaXphdGlvbkFkbWluLmFsbG93RGVsZXRlXG5cdFx0XHRcdG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uYWxsb3dFZGl0ID0gcG9zT3JnYW5pemF0aW9uQWRtaW4uYWxsb3dFZGl0XG5cdFx0XHRcdG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uYWxsb3dSZWFkID0gcG9zT3JnYW5pemF0aW9uQWRtaW4uYWxsb3dSZWFkXG5cdFx0XHRcdG9wc2V0T3JnYW5pemF0aW9uQWRtaW4ubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc09yZ2FuaXphdGlvbkFkbWluLm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0b3BzZXRPcmdhbml6YXRpb25BZG1pbi52aWV3QWxsUmVjb3JkcyA9IHBvc09yZ2FuaXphdGlvbkFkbWluLnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdG9wc2V0T3JnYW5pemF0aW9uQWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NPcmdhbml6YXRpb25BZG1pbi5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRvcHNldE9yZ2FuaXphdGlvbkFkbWluLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc09yZ2FuaXphdGlvbkFkbWluLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRvcHNldE9yZ2FuaXphdGlvbkFkbWluLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NPcmdhbml6YXRpb25BZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzXG5cdFx0XHRcdG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uZGlzYWJsZWRfYWN0aW9ucyA9IHBvc09yZ2FuaXphdGlvbkFkbWluLmRpc2FibGVkX2FjdGlvbnNcblx0XHRcdFx0b3BzZXRPcmdhbml6YXRpb25BZG1pbi51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc09yZ2FuaXphdGlvbkFkbWluLnVucmVhZGFibGVfZmllbGRzXG5cdFx0XHRcdG9wc2V0T3JnYW5pemF0aW9uQWRtaW4udW5lZGl0YWJsZV9maWVsZHMgPSBwb3NPcmdhbml6YXRpb25BZG1pbi51bmVkaXRhYmxlX2ZpZWxkc1xuXHRcdFx0XHRvcHNldE9yZ2FuaXphdGlvbkFkbWluLnVucmVsYXRlZF9vYmplY3RzID0gcG9zT3JnYW5pemF0aW9uQWRtaW4udW5yZWxhdGVkX29iamVjdHNcblx0XHRpZiAhdXNlcklkXG5cdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW5cblx0XHRlbHNlXG5cdFx0XHRpZiBpc1NwYWNlQWRtaW5cblx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEFkbWluXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIHNwYWNlSWQgaXMgJ2NvbW1vbidcblx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0c3BhY2VVc2VyID0gaWYgXy5pc051bGwodGhpcy5zcGFjZVVzZXIpIG9yIHRoaXMuc3BhY2VVc2VyIHRoZW4gdGhpcy5zcGFjZVVzZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcblx0XHRcdFx0XHRpZiBzcGFjZVVzZXJcblx0XHRcdFx0XHRcdHByb2YgPSBzcGFjZVVzZXIucHJvZmlsZVxuXHRcdFx0XHRcdFx0aWYgcHJvZlxuXHRcdFx0XHRcdFx0XHRpZiBwcm9mIGlzICd1c2VyJ1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnbWVtYmVyJ1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRNZW1iZXJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdndWVzdCdcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Rcblx0XHRcdFx0XHRcdGVsc2UgIyDmsqHmnIlwcm9maWxl5YiZ6K6k5Li65pivdXNlcuadg+mZkFxuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdFxuXG5cdFx0aWYgcHNldHMubGVuZ3RoID4gMFxuXHRcdFx0c2V0X2lkcyA9IF8ucGx1Y2sgcHNldHMsIFwiX2lkXCJcblx0XHRcdHBvcyA9IGZpbmRfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXJyZW50X3Bvcywgb2JqZWN0X25hbWUsIHNldF9pZHMpXG5cdFx0XHRfLmVhY2ggcG9zLCAocG8pLT5cblx0XHRcdFx0aWYgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNBZG1pbj8uX2lkIG9yIFxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c1VzZXI/Ll9pZCBvciBcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNNZW1iZXI/Ll9pZCBvciBcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNHdWVzdD8uX2lkIG9yIFxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c1dvcmtmbG93QWRtaW4/Ll9pZCBvciBcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNPcmdhbml6YXRpb25BZG1pbj8uX2lkXG5cdFx0XHRcdFx0IyDpu5jorqTnmoRhZG1pbi91c2Vy5p2D6ZmQ5YC85Y+q5a6e6KGM5LiK6Z2i55qE6buY6K6k5YC86KaG55uW77yM5LiN5YGa566X5rOV5Yik5patXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdGlmIHBvLmFsbG93UmVhZFxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHRydWVcblx0XHRcdFx0aWYgcG8uYWxsb3dDcmVhdGVcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHRydWVcblx0XHRcdFx0aWYgcG8uYWxsb3dFZGl0XG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdFx0XHRpZiBwby5hbGxvd0RlbGV0ZVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gdHJ1ZVxuXHRcdFx0XHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IHRydWVcblx0XHRcdFx0aWYgcG8udmlld0FsbFJlY29yZHNcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA9IHRydWVcblx0XHRcdFx0aWYgcG8ubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHRydWVcblx0XHRcdFx0aWYgcG8udmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZVxuXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSB1bmlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cywgcG8uZGlzYWJsZWRfbGlzdF92aWV3cylcblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zLCBwby5kaXNhYmxlZF9hY3Rpb25zKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgcG8udW5yZWFkYWJsZV9maWVsZHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBwby51bmVkaXRhYmxlX2ZpZWxkcylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMsIHBvLnVucmVsYXRlZF9vYmplY3RzKVxuXG5cdFx0XHRpZiBpc1dvcmtmbG93QWRtaW5cblx0XHRcdFx0aWYgb3BzZXRXb3JrZmxvd0FkbWluLmFsbG93UmVhZFxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHRydWVcblx0XHRcdFx0aWYgb3BzZXRXb3JrZmxvd0FkbWluLmFsbG93Q3JlYXRlXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSB0cnVlXG5cdFx0XHRcdGlmIG9wc2V0V29ya2Zsb3dBZG1pbi5hbGxvd0VkaXRcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0XHRcdGlmIG9wc2V0V29ya2Zsb3dBZG1pbi5hbGxvd0RlbGV0ZVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gdHJ1ZVxuXHRcdFx0XHRpZiBvcHNldFdvcmtmbG93QWRtaW4ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSB0cnVlXG5cdFx0XHRcdGlmIG9wc2V0V29ya2Zsb3dBZG1pbi52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZVxuXHRcdFx0XHRpZiBvcHNldFdvcmtmbG93QWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHRydWVcblx0XHRcdFx0aWYgb3BzZXRXb3JrZmxvd0FkbWluLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRcdHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcblxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIG9wc2V0V29ya2Zsb3dBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMsIG9wc2V0V29ya2Zsb3dBZG1pbi5kaXNhYmxlZF9hY3Rpb25zKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgb3BzZXRXb3JrZmxvd0FkbWluLnVucmVhZGFibGVfZmllbGRzKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgb3BzZXRXb3JrZmxvd0FkbWluLnVuZWRpdGFibGVfZmllbGRzKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cywgb3BzZXRXb3JrZmxvd0FkbWluLnVucmVsYXRlZF9vYmplY3RzKVxuXG5cdFx0XHRpZiBpc09yZ2FuaXphdGlvbkFkbWluXG5cdFx0XHRcdGlmIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uYWxsb3dSZWFkXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gdHJ1ZVxuXHRcdFx0XHRpZiBvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93Q3JlYXRlXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSB0cnVlXG5cdFx0XHRcdGlmIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uYWxsb3dFZGl0XG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdFx0XHRpZiBvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93RGVsZXRlXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSB0cnVlXG5cdFx0XHRcdGlmIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSB0cnVlXG5cdFx0XHRcdGlmIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4udmlld0FsbFJlY29yZHNcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA9IHRydWVcblx0XHRcdFx0aWYgb3BzZXRPcmdhbml6YXRpb25BZG1pbi5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gdHJ1ZVxuXHRcdFx0XHRpZiBvcHNldE9yZ2FuaXphdGlvbkFkbWluLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRcdHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcblxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cylcblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zLCBvcHNldE9yZ2FuaXphdGlvbkFkbWluLmRpc2FibGVkX2FjdGlvbnMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBvcHNldE9yZ2FuaXphdGlvbkFkbWluLnVucmVhZGFibGVfZmllbGRzKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgb3BzZXRPcmdhbml6YXRpb25BZG1pbi51bmVkaXRhYmxlX2ZpZWxkcylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMsIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4udW5yZWxhdGVkX29iamVjdHMpXG5cdFx0XG5cdFx0aWYgb2JqZWN0LmlzX3ZpZXdcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBbXVxuXHRcdENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zIHBlcm1pc3Npb25zXG5cdFx0cmV0dXJuIHBlcm1pc3Npb25zXG5cblxuXHQjIENyZWF0b3IuaW5pdFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lKSAtPlxuXG5cdFx0IyAjIOW6lOivpeaKiuiuoeeul+WHuuadpeeahFxuXHRcdCMgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV0uYWxsb3dcblx0XHQjIFx0aW5zZXJ0OiAodXNlcklkLCBkb2MpIC0+XG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdCAgICBcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93Q3JlYXRlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdCMgXHRcdHJldHVybiB0cnVlXG5cdFx0IyBcdHVwZGF0ZTogKHVzZXJJZCwgZG9jKSAtPlxuXHRcdCMgXHRcdGlmICF1c2VySWRcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2Vcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93RWRpdFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcblx0XHQjIFx0cmVtb3ZlOiAodXNlcklkLCBkb2MpIC0+XG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dEZWxldGVcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHJldHVybiB0cnVlXG5cblx0TWV0ZW9yLm1ldGhvZHNcblx0XHQjIENhbGN1bGF0ZSBQZXJtaXNzaW9ucyBvbiBTZXJ2ZXJcblx0XHRcImNyZWF0b3Iub2JqZWN0X3Blcm1pc3Npb25zXCI6IChzcGFjZUlkKS0+XG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB0aGlzLnVzZXJJZClcbiIsInZhciBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0LCBmaW5kX3Blcm1pc3Npb25fb2JqZWN0LCB1bmlvblBsdXM7XG5cbkNyZWF0b3IuZ2V0UGVybWlzc2lvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBvYmo7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoIW9iaikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gb2JqLnBlcm1pc3Npb25zLmdldCgpO1xuICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIHJldHVybiBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZCwgdXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBpc093bmVyLCBwZXJtaXNzaW9ucywgcmVjb3JkX2NvbXBhbnlfaWQsIHJlZiwgdXNlcl9jb21wYW55X2lkcztcbiAgaWYgKCFvYmplY3RfbmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBfLmNsb25lKENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpKTtcbiAgaWYgKHJlY29yZCkge1xuICAgIGlzT3duZXIgPSByZWNvcmQub3duZXIgPT09IHVzZXJJZCB8fCAoKHJlZiA9IHJlY29yZC5vd25lcikgIT0gbnVsbCA/IHJlZi5faWQgOiB2b2lkIDApID09PSB1c2VySWQ7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdXNlcl9jb21wYW55X2lkcyA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlcl9jb21wYW55X2lkcyA9IENyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHModXNlcklkLCBzcGFjZUlkKTtcbiAgICB9XG4gICAgcmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5jb21wYW55X2lkIDogdm9pZCAwO1xuICAgIGlmIChyZWNvcmRfY29tcGFueV9pZCAmJiBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkKSAmJiByZWNvcmRfY29tcGFueV9pZC5faWQpIHtcbiAgICAgIHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkX2NvbXBhbnlfaWQuX2lkO1xuICAgIH1cbiAgICBpZiAoIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgJiYgIWlzT3duZXIgJiYgIXBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkICYmIF8uaXNTdHJpbmcocmVjb3JkX2NvbXBhbnlfaWQpKSB7XG4gICAgICAgIGlmICh1c2VyX2NvbXBhbnlfaWRzICYmIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFfLmluY2x1ZGUodXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWQpKSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJlY29yZC5sb2NrZWQgJiYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiAhaXNPd25lciAmJiAhcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkICYmIF8uaXNTdHJpbmcocmVjb3JkX2NvbXBhbnlfaWQpKSB7XG4gICAgICAgIGlmICh1c2VyX2NvbXBhbnlfaWRzICYmIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFfLmluY2x1ZGUodXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWQpKSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBlcm1pc3Npb25zO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIF9pLCBpc09yZ2FuaXphdGlvbkFkbWluLCBpc1NwYWNlQWRtaW4sIGlzV29ya2Zsb3dBZG1pbiwgcGVybWlzc2lvbnMsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0FkbWluX3BvcywgcHNldHNDdXJyZW50LCBwc2V0c0N1cnJlbnROYW1lcywgcHNldHNDdXJyZW50X3BvcywgcHNldHNHdWVzdCwgcHNldHNHdWVzdF9wb3MsIHBzZXRzTWVtYmVyLCBwc2V0c01lbWJlcl9wb3MsIHBzZXRzT3JnYW5pemF0aW9uQWRtaW4sIHBzZXRzT3JnYW5pemF0aW9uQWRtaW5fcG9zLCBwc2V0c1VzZXIsIHBzZXRzVXNlcl9wb3MsIHBzZXRzV29ya2Zsb3dBZG1pbiwgcHNldHNXb3JrZmxvd0FkbWluX3BvcywgcmVmLCByZWYxLCBzZXRfaWRzLCBzcGFjZVVzZXI7XG4gICAgcGVybWlzc2lvbnMgPSB7XG4gICAgICBvYmplY3RzOiB7fSxcbiAgICAgIGFzc2lnbmVkX2FwcHM6IFtdXG4gICAgfTtcbiAgICBwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNNZW1iZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ21lbWJlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c0d1ZXN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdndWVzdCdcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c1dvcmtmbG93QWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3dvcmtmbG93X2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgIHVzZXJzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c09yZ2FuaXphdGlvbkFkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdvcmdhbml6YXRpb25fYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgdXNlcnM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgbmFtZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgcHNldHNBZG1pbl9wb3MgPSBudWxsO1xuICAgIHBzZXRzVXNlcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzTWVtYmVyX3BvcyA9IG51bGw7XG4gICAgcHNldHNHdWVzdF9wb3MgPSBudWxsO1xuICAgIHBzZXRzV29ya2Zsb3dBZG1pbl9wb3MgPSBudWxsO1xuICAgIHBzZXRzT3JnYW5pemF0aW9uQWRtaW5fcG9zID0gbnVsbDtcbiAgICBwc2V0c0N1cnJlbnRfcG9zID0gbnVsbDtcbiAgICBpZiAocHNldHNBZG1pbiAhPSBudWxsID8gcHNldHNBZG1pbi5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1VzZXIgIT0gbnVsbCA/IHBzZXRzVXNlci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c1VzZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNNZW1iZXIgIT0gbnVsbCA/IHBzZXRzTWVtYmVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNNZW1iZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNHdWVzdCAhPSBudWxsID8gcHNldHNHdWVzdC5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzR3Vlc3RfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1dvcmtmbG93QWRtaW4gIT0gbnVsbCA/IHBzZXRzV29ya2Zsb3dBZG1pbi5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzV29ya2Zsb3dBZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c1dvcmtmbG93QWRtaW4uX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNPcmdhbml6YXRpb25BZG1pbiAhPSBudWxsID8gcHNldHNPcmdhbml6YXRpb25BZG1pbi5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzT3JnYW5pemF0aW9uQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNPcmdhbml6YXRpb25BZG1pbi5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1cnJlbnQubGVuZ3RoID4gMCkge1xuICAgICAgc2V0X2lkcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIl9pZFwiKTtcbiAgICAgIHBzZXRzQ3VycmVudF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiB7XG4gICAgICAgICAgJGluOiBzZXRfaWRzXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBwc2V0c0N1cnJlbnROYW1lcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIm5hbWVcIik7XG4gICAgfVxuICAgIGlzU3BhY2VBZG1pbiA9IGZhbHNlO1xuICAgIHNwYWNlVXNlciA9IG51bGw7XG4gICAgaWYgKHVzZXJJZCkge1xuICAgICAgaXNTcGFjZUFkbWluID0gQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICAgIGlzV29ya2Zsb3dBZG1pbiA9IHBzZXRzV29ya2Zsb3dBZG1pbiAhPSBudWxsID8gKHJlZiA9IHBzZXRzV29ya2Zsb3dBZG1pbi51c2VycykgIT0gbnVsbCA/IHJlZi5pbmNsdWRlcyh1c2VySWQpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaXNPcmdhbml6YXRpb25BZG1pbiA9IHBzZXRzT3JnYW5pemF0aW9uQWRtaW4gIT0gbnVsbCA/IChyZWYxID0gcHNldHNPcmdhbml6YXRpb25BZG1pbi51c2VycykgIT0gbnVsbCA/IHJlZjEuaW5jbHVkZXModXNlcklkKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHBzZXRzID0ge1xuICAgICAgcHNldHNBZG1pbjogcHNldHNBZG1pbixcbiAgICAgIHBzZXRzVXNlcjogcHNldHNVc2VyLFxuICAgICAgcHNldHNDdXJyZW50OiBwc2V0c0N1cnJlbnQsXG4gICAgICBwc2V0c01lbWJlcjogcHNldHNNZW1iZXIsXG4gICAgICBwc2V0c0d1ZXN0OiBwc2V0c0d1ZXN0LFxuICAgICAgcHNldHNXb3JrZmxvd0FkbWluOiBwc2V0c1dvcmtmbG93QWRtaW4sXG4gICAgICBwc2V0c09yZ2FuaXphdGlvbkFkbWluOiBwc2V0c09yZ2FuaXphdGlvbkFkbWluLFxuICAgICAgaXNTcGFjZUFkbWluOiBpc1NwYWNlQWRtaW4sXG4gICAgICBpc1dvcmtmbG93QWRtaW46IGlzV29ya2Zsb3dBZG1pbixcbiAgICAgIGlzT3JnYW5pemF0aW9uQWRtaW46IGlzT3JnYW5pemF0aW9uQWRtaW4sXG4gICAgICBzcGFjZVVzZXI6IHNwYWNlVXNlcixcbiAgICAgIHBzZXRzQWRtaW5fcG9zOiBwc2V0c0FkbWluX3BvcyxcbiAgICAgIHBzZXRzVXNlcl9wb3M6IHBzZXRzVXNlcl9wb3MsXG4gICAgICBwc2V0c01lbWJlcl9wb3M6IHBzZXRzTWVtYmVyX3BvcyxcbiAgICAgIHBzZXRzR3Vlc3RfcG9zOiBwc2V0c0d1ZXN0X3BvcyxcbiAgICAgIHBzZXRzV29ya2Zsb3dBZG1pbl9wb3M6IHBzZXRzV29ya2Zsb3dBZG1pbl9wb3MsXG4gICAgICBwc2V0c09yZ2FuaXphdGlvbkFkbWluX3BvczogcHNldHNPcmdhbml6YXRpb25BZG1pbl9wb3MsXG4gICAgICBwc2V0c0N1cnJlbnRfcG9zOiBwc2V0c0N1cnJlbnRfcG9zXG4gICAgfTtcbiAgICBwZXJtaXNzaW9ucy5hc3NpZ25lZF9hcHBzID0gQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwZXJtaXNzaW9ucy5hc3NpZ25lZF9tZW51cyA9IENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBlcm1pc3Npb25zLnVzZXJfcGVybWlzc2lvbl9zZXRzID0gcHNldHNDdXJyZW50TmFtZXM7XG4gICAgX2kgPSAwO1xuICAgIF8uZWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKG9iamVjdCwgb2JqZWN0X25hbWUpIHtcbiAgICAgIF9pKys7XG4gICAgICBpZiAoIV8uaGFzKG9iamVjdCwgJ3NwYWNlJykgfHwgIW9iamVjdC5zcGFjZSB8fCBvYmplY3Quc3BhY2UgPT09IHNwYWNlSWQpIHtcbiAgICAgICAgcGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV0gPSBfLmNsb25lKENyZWF0b3IuY29udmVydE9iamVjdChDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdKSk7XG4gICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXVtcInBlcm1pc3Npb25zXCJdID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gIH07XG4gIHVuaW9uUGx1cyA9IGZ1bmN0aW9uKGFycmF5LCBvdGhlcikge1xuICAgIGlmICghYXJyYXkgJiYgIW90aGVyKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAoIWFycmF5KSB7XG4gICAgICBhcnJheSA9IFtdO1xuICAgIH1cbiAgICBpZiAoIW90aGVyKSB7XG4gICAgICBvdGhlciA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gXy51bmlvbihhcnJheSwgb3RoZXIpO1xuICB9O1xuICBDcmVhdG9yLmdldEFzc2lnbmVkQXBwcyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBhcHBzLCBpc1NwYWNlQWRtaW4sIHBzZXRCYXNlLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNVc2VyLCByZWY7XG4gICAgcHNldHNBZG1pbiA9IHRoaXMucHNldHNBZG1pbiB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1VzZXIgPSB0aGlzLnBzZXRzVXNlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICB1c2VyczogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgYXBwcyA9IFtdO1xuICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHNldEJhc2UgPSBwc2V0c1VzZXI7XG4gICAgICBpZiAocHNldEJhc2UgIT0gbnVsbCA/IChyZWYgPSBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzKSAhPSBudWxsID8gcmVmLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICBhcHBzID0gXy51bmlvbihhcHBzLCBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICAgIF8uZWFjaChwc2V0cywgZnVuY3Rpb24ocHNldCkge1xuICAgICAgICBpZiAoIXBzZXQuYXNzaWduZWRfYXBwcykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHNldC5uYW1lID09PSBcImFkbWluXCIgfHwgcHNldC5uYW1lID09PSBcInVzZXJcIikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXBwcyA9IF8udW5pb24oYXBwcywgcHNldC5hc3NpZ25lZF9hcHBzKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8ud2l0aG91dChfLnVuaXEoYXBwcyksIHZvaWQgMCwgbnVsbCk7XG4gICAgfVxuICB9O1xuICBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgYWJvdXRNZW51LCBhZG1pbk1lbnVzLCBhbGxNZW51cywgY3VycmVudFBzZXROYW1lcywgaXNTcGFjZUFkbWluLCBtZW51cywgb3RoZXJNZW51QXBwcywgb3RoZXJNZW51cywgcHNldHMsIHJlZjtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgbmFtZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGFkbWluTWVudXMgPSAocmVmID0gQ3JlYXRvci5BcHBzLmFkbWluKSAhPSBudWxsID8gcmVmLmFkbWluX21lbnVzIDogdm9pZCAwO1xuICAgIGlmICghYWRtaW5NZW51cykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBhYm91dE1lbnUgPSBhZG1pbk1lbnVzLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uX2lkID09PSAnYWJvdXQnO1xuICAgIH0pO1xuICAgIGFkbWluTWVudXMgPSBhZG1pbk1lbnVzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5faWQgIT09ICdhYm91dCc7XG4gICAgfSk7XG4gICAgb3RoZXJNZW51QXBwcyA9IF8uc29ydEJ5KF8uZmlsdGVyKF8udmFsdWVzKENyZWF0b3IuQXBwcyksIGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLmFkbWluX21lbnVzICYmIG4uX2lkICE9PSAnYWRtaW4nO1xuICAgIH0pLCAnc29ydCcpO1xuICAgIG90aGVyTWVudXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhvdGhlck1lbnVBcHBzLCBcImFkbWluX21lbnVzXCIpKTtcbiAgICBhbGxNZW51cyA9IF8udW5pb24oYWRtaW5NZW51cywgb3RoZXJNZW51cywgW2Fib3V0TWVudV0pO1xuICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgIHJldHVybiBhbGxNZW51cztcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudFBzZXROYW1lcyA9IHBzZXRzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLm5hbWU7XG4gICAgICB9KTtcbiAgICAgIG1lbnVzID0gYWxsTWVudXMuZmlsdGVyKGZ1bmN0aW9uKG1lbnUpIHtcbiAgICAgICAgdmFyIHBzZXRzTWVudTtcbiAgICAgICAgcHNldHNNZW51ID0gbWVudS5wZXJtaXNzaW9uX3NldHM7XG4gICAgICAgIGlmIChwc2V0c01lbnUgJiYgcHNldHNNZW51LmluZGV4T2YoXCJ1c2VyXCIpID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24oY3VycmVudFBzZXROYW1lcywgcHNldHNNZW51KS5sZW5ndGg7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBtZW51cztcbiAgICB9XG4gIH07XG4gIGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QgPSBmdW5jdGlvbihwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZCkge1xuICAgIGlmIChfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gXy5maW5kKHBlcm1pc3Npb25fb2JqZWN0cywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgcmV0dXJuIHBvLm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBlcm1pc3Npb25fc2V0X2lkXG4gICAgfSk7XG4gIH07XG4gIGZpbmRfcGVybWlzc2lvbl9vYmplY3QgPSBmdW5jdGlvbihwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZHMpIHtcbiAgICBpZiAoXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIF8uZmlsdGVyKHBlcm1pc3Npb25fb2JqZWN0cywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgcmV0dXJuIHBvLm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHtcbiAgICAgICAgJGluOiBwZXJtaXNzaW9uX3NldF9pZHNcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICB9O1xuICBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSkge1xuICAgIHZhciBpc09yZ2FuaXphdGlvbkFkbWluLCBpc1NwYWNlQWRtaW4sIGlzV29ya2Zsb3dBZG1pbiwgb2JqZWN0LCBvcHNldEFkbWluLCBvcHNldEd1ZXN0LCBvcHNldE1lbWJlciwgb3BzZXRPcmdhbml6YXRpb25BZG1pbiwgb3BzZXRVc2VyLCBvcHNldFdvcmtmbG93QWRtaW4sIHBlcm1pc3Npb25zLCBwb3MsIHBvc0FkbWluLCBwb3NHdWVzdCwgcG9zTWVtYmVyLCBwb3NPcmdhbml6YXRpb25BZG1pbiwgcG9zVXNlciwgcG9zV29ya2Zsb3dBZG1pbiwgcHJvZiwgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQWRtaW5fcG9zLCBwc2V0c0N1cnJlbnRfcG9zLCBwc2V0c0d1ZXN0LCBwc2V0c0d1ZXN0X3BvcywgcHNldHNNZW1iZXIsIHBzZXRzTWVtYmVyX3BvcywgcHNldHNPcmdhbml6YXRpb25BZG1pbiwgcHNldHNPcmdhbml6YXRpb25BZG1pbl9wb3MsIHBzZXRzVXNlciwgcHNldHNVc2VyX3BvcywgcHNldHNXb3JrZmxvd0FkbWluLCBwc2V0c1dvcmtmbG93QWRtaW5fcG9zLCByZWYsIHJlZjEsIHNldF9pZHMsIHNwYWNlVXNlcjtcbiAgICBwZXJtaXNzaW9ucyA9IHt9O1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKTtcbiAgICBpZiAoc3BhY2VJZCA9PT0gJ2d1ZXN0JyB8fCBvYmplY3RfbmFtZSA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fTtcbiAgICAgIENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zKHBlcm1pc3Npb25zKTtcbiAgICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgICB9XG4gICAgcHNldHNBZG1pbiA9IF8uaXNOdWxsKHRoaXMucHNldHNBZG1pbikgfHwgdGhpcy5wc2V0c0FkbWluID8gdGhpcy5wc2V0c0FkbWluIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gXy5pc051bGwodGhpcy5wc2V0c1VzZXIpIHx8IHRoaXMucHNldHNVc2VyID8gdGhpcy5wc2V0c1VzZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzTWVtYmVyID0gXy5pc051bGwodGhpcy5wc2V0c01lbWJlcikgfHwgdGhpcy5wc2V0c01lbWJlciA/IHRoaXMucHNldHNNZW1iZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ21lbWJlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNHdWVzdCA9IF8uaXNOdWxsKHRoaXMucHNldHNHdWVzdCkgfHwgdGhpcy5wc2V0c0d1ZXN0ID8gdGhpcy5wc2V0c0d1ZXN0IDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdndWVzdCdcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNXb3JrZmxvd0FkbWluID0gXy5pc051bGwodGhpcy5wc2V0c1dvcmtmbG93QWRtaW4pIHx8IHRoaXMucHNldHNXb3JrZmxvd0FkbWluID8gdGhpcy5wc2V0c1dvcmtmbG93QWRtaW4gOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3dvcmtmbG93X2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIHVzZXJzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNPcmdhbml6YXRpb25BZG1pbiA9IF8uaXNOdWxsKHRoaXMucHNldHNPcmdhbml6YXRpb25BZG1pbikgfHwgdGhpcy5wc2V0c09yZ2FuaXphdGlvbkFkbWluID8gdGhpcy5wc2V0c09yZ2FuaXphdGlvbkFkbWluIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdvcmdhbml6YXRpb25fYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgdXNlcnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGlzV29ya2Zsb3dBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNXb3JrZmxvd0FkbWluKSA/IHRoaXMuaXNXb3JrZmxvd0FkbWluIDogcHNldHNXb3JrZmxvd0FkbWluICE9IG51bGwgPyAocmVmID0gcHNldHNXb3JrZmxvd0FkbWluLnVzZXJzKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKHVzZXJJZCkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgaXNPcmdhbml6YXRpb25BZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNPcmdhbml6YXRpb25BZG1pbikgPyB0aGlzLmlzT3JnYW5pemF0aW9uQWRtaW4gOiBwc2V0c09yZ2FuaXphdGlvbkFkbWluICE9IG51bGwgPyAocmVmMSA9IHBzZXRzT3JnYW5pemF0aW9uQWRtaW4udXNlcnMpICE9IG51bGwgPyByZWYxLmluY2x1ZGVzKHVzZXJJZCkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgcHNldHNBZG1pbl9wb3MgPSB0aGlzLnBzZXRzQWRtaW5fcG9zO1xuICAgIHBzZXRzVXNlcl9wb3MgPSB0aGlzLnBzZXRzVXNlcl9wb3M7XG4gICAgcHNldHNNZW1iZXJfcG9zID0gdGhpcy5wc2V0c01lbWJlcl9wb3M7XG4gICAgcHNldHNHdWVzdF9wb3MgPSB0aGlzLnBzZXRzR3Vlc3RfcG9zO1xuICAgIHBzZXRzV29ya2Zsb3dBZG1pbl9wb3MgPSB0aGlzLnBzZXRzV29ya2Zsb3dBZG1pbl9wb3M7XG4gICAgcHNldHNPcmdhbml6YXRpb25BZG1pbl9wb3MgPSB0aGlzLnBzZXRzT3JnYW5pemF0aW9uQWRtaW5fcG9zO1xuICAgIHBzZXRzQ3VycmVudF9wb3MgPSB0aGlzLnBzZXRzQ3VycmVudF9wb3M7XG4gICAgb3BzZXRBZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmFkbWluKSB8fCB7fTtcbiAgICBvcHNldFVzZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC51c2VyKSB8fCB7fTtcbiAgICBvcHNldE1lbWJlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm1lbWJlcikgfHwge307XG4gICAgb3BzZXRHdWVzdCA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fTtcbiAgICBvcHNldFdvcmtmbG93QWRtaW4gPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC53b3JrZmxvd19hZG1pbikgfHwge307XG4gICAgb3BzZXRPcmdhbml6YXRpb25BZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm9yZ2FuaXphdGlvbl9hZG1pbikgfHwge307XG4gICAgaWYgKHBzZXRzQWRtaW4pIHtcbiAgICAgIHBvc0FkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0FkbWluX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQWRtaW4uX2lkKTtcbiAgICAgIGlmIChwb3NBZG1pbikge1xuICAgICAgICBvcHNldEFkbWluLmFsbG93Q3JlYXRlID0gcG9zQWRtaW4uYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0QWRtaW4uYWxsb3dEZWxldGUgPSBwb3NBZG1pbi5hbGxvd0RlbGV0ZTtcbiAgICAgICAgb3BzZXRBZG1pbi5hbGxvd0VkaXQgPSBwb3NBZG1pbi5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0QWRtaW4uYWxsb3dSZWFkID0gcG9zQWRtaW4uYWxsb3dSZWFkO1xuICAgICAgICBvcHNldEFkbWluLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NBZG1pbi5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldEFkbWluLnZpZXdBbGxSZWNvcmRzID0gcG9zQWRtaW4udmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0QWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NBZG1pbi5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRBZG1pbi52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NBZG1pbi52aWV3Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0QWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0FkbWluLmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0QWRtaW4uZGlzYWJsZWRfYWN0aW9ucyA9IHBvc0FkbWluLmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0QWRtaW4udW5yZWFkYWJsZV9maWVsZHMgPSBwb3NBZG1pbi51bnJlYWRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRBZG1pbi51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0FkbWluLnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEFkbWluLnVucmVsYXRlZF9vYmplY3RzID0gcG9zQWRtaW4udW5yZWxhdGVkX29iamVjdHM7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0c1VzZXIpIHtcbiAgICAgIHBvc1VzZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzVXNlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1VzZXIuX2lkKTtcbiAgICAgIGlmIChwb3NVc2VyKSB7XG4gICAgICAgIG9wc2V0VXNlci5hbGxvd0NyZWF0ZSA9IHBvc1VzZXIuYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0VXNlci5hbGxvd0RlbGV0ZSA9IHBvc1VzZXIuYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0VXNlci5hbGxvd0VkaXQgPSBwb3NVc2VyLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRVc2VyLmFsbG93UmVhZCA9IHBvc1VzZXIuYWxsb3dSZWFkO1xuICAgICAgICBvcHNldFVzZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRVc2VyLnZpZXdBbGxSZWNvcmRzID0gcG9zVXNlci52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRVc2VyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zVXNlci5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRVc2VyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIudmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldFVzZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc1VzZXIuZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRVc2VyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NVc2VyLmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0VXNlci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1VzZXIudW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0VXNlci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc1VzZXIudW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0VXNlci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc1VzZXIudW5yZWxhdGVkX29iamVjdHM7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0c01lbWJlcikge1xuICAgICAgcG9zTWVtYmVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c01lbWJlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c01lbWJlci5faWQpO1xuICAgICAgaWYgKHBvc01lbWJlcikge1xuICAgICAgICBvcHNldE1lbWJlci5hbGxvd0NyZWF0ZSA9IHBvc01lbWJlci5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRNZW1iZXIuYWxsb3dEZWxldGUgPSBwb3NNZW1iZXIuYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0TWVtYmVyLmFsbG93RWRpdCA9IHBvc01lbWJlci5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0TWVtYmVyLmFsbG93UmVhZCA9IHBvc01lbWJlci5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0TWVtYmVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NNZW1iZXIubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRNZW1iZXIudmlld0FsbFJlY29yZHMgPSBwb3NNZW1iZXIudmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zTWVtYmVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldE1lbWJlci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NNZW1iZXIudmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldE1lbWJlci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zTWVtYmVyLmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0TWVtYmVyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NNZW1iZXIuZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRNZW1iZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NNZW1iZXIudW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zTWVtYmVyLnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldE1lbWJlci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc01lbWJlci51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzR3Vlc3QpIHtcbiAgICAgIHBvc0d1ZXN0ID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0d1ZXN0X3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzR3Vlc3QuX2lkKTtcbiAgICAgIGlmIChwb3NHdWVzdCkge1xuICAgICAgICBvcHNldEd1ZXN0LmFsbG93Q3JlYXRlID0gcG9zR3Vlc3QuYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0R3Vlc3QuYWxsb3dEZWxldGUgPSBwb3NHdWVzdC5hbGxvd0RlbGV0ZTtcbiAgICAgICAgb3BzZXRHdWVzdC5hbGxvd0VkaXQgPSBwb3NHdWVzdC5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0R3Vlc3QuYWxsb3dSZWFkID0gcG9zR3Vlc3QuYWxsb3dSZWFkO1xuICAgICAgICBvcHNldEd1ZXN0Lm1vZGlmeUFsbFJlY29yZHMgPSBwb3NHdWVzdC5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldEd1ZXN0LnZpZXdBbGxSZWNvcmRzID0gcG9zR3Vlc3Qudmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0R3Vlc3QubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NHdWVzdC5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRHdWVzdC52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NHdWVzdC52aWV3Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0R3Vlc3QuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0d1ZXN0LmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0R3Vlc3QuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc0d1ZXN0LmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0R3Vlc3QudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NHdWVzdC51bnJlYWRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRHdWVzdC51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0d1ZXN0LnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEd1ZXN0LnVucmVsYXRlZF9vYmplY3RzID0gcG9zR3Vlc3QudW5yZWxhdGVkX29iamVjdHM7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0c1dvcmtmbG93QWRtaW4pIHtcbiAgICAgIHBvc1dvcmtmbG93QWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzV29ya2Zsb3dBZG1pbl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1dvcmtmbG93QWRtaW4uX2lkKTtcbiAgICAgIGlmIChwb3NXb3JrZmxvd0FkbWluKSB7XG4gICAgICAgIG9wc2V0V29ya2Zsb3dBZG1pbi5hbGxvd0NyZWF0ZSA9IHBvc1dvcmtmbG93QWRtaW4uYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0V29ya2Zsb3dBZG1pbi5hbGxvd0RlbGV0ZSA9IHBvc1dvcmtmbG93QWRtaW4uYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0V29ya2Zsb3dBZG1pbi5hbGxvd0VkaXQgPSBwb3NXb3JrZmxvd0FkbWluLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRXb3JrZmxvd0FkbWluLmFsbG93UmVhZCA9IHBvc1dvcmtmbG93QWRtaW4uYWxsb3dSZWFkO1xuICAgICAgICBvcHNldFdvcmtmbG93QWRtaW4ubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1dvcmtmbG93QWRtaW4ubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRXb3JrZmxvd0FkbWluLnZpZXdBbGxSZWNvcmRzID0gcG9zV29ya2Zsb3dBZG1pbi52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRXb3JrZmxvd0FkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zV29ya2Zsb3dBZG1pbi5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRXb3JrZmxvd0FkbWluLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1dvcmtmbG93QWRtaW4udmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldFdvcmtmbG93QWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc1dvcmtmbG93QWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRXb3JrZmxvd0FkbWluLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NXb3JrZmxvd0FkbWluLmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0V29ya2Zsb3dBZG1pbi51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1dvcmtmbG93QWRtaW4udW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0V29ya2Zsb3dBZG1pbi51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc1dvcmtmbG93QWRtaW4udW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0V29ya2Zsb3dBZG1pbi51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc1dvcmtmbG93QWRtaW4udW5yZWxhdGVkX29iamVjdHM7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0c09yZ2FuaXphdGlvbkFkbWluKSB7XG4gICAgICBwb3NPcmdhbml6YXRpb25BZG1pbiA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNPcmdhbml6YXRpb25BZG1pbl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c09yZ2FuaXphdGlvbkFkbWluLl9pZCk7XG4gICAgICBpZiAocG9zT3JnYW5pemF0aW9uQWRtaW4pIHtcbiAgICAgICAgb3BzZXRPcmdhbml6YXRpb25BZG1pbi5hbGxvd0NyZWF0ZSA9IHBvc09yZ2FuaXphdGlvbkFkbWluLmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93RGVsZXRlID0gcG9zT3JnYW5pemF0aW9uQWRtaW4uYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uYWxsb3dFZGl0ID0gcG9zT3JnYW5pemF0aW9uQWRtaW4uYWxsb3dFZGl0O1xuICAgICAgICBvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93UmVhZCA9IHBvc09yZ2FuaXphdGlvbkFkbWluLmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRPcmdhbml6YXRpb25BZG1pbi5tb2RpZnlBbGxSZWNvcmRzID0gcG9zT3JnYW5pemF0aW9uQWRtaW4ubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRPcmdhbml6YXRpb25BZG1pbi52aWV3QWxsUmVjb3JkcyA9IHBvc09yZ2FuaXphdGlvbkFkbWluLnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldE9yZ2FuaXphdGlvbkFkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zT3JnYW5pemF0aW9uQWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4udmlld0NvbXBhbnlSZWNvcmRzID0gcG9zT3JnYW5pemF0aW9uQWRtaW4udmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldE9yZ2FuaXphdGlvbkFkbWluLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NPcmdhbml6YXRpb25BZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldE9yZ2FuaXphdGlvbkFkbWluLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NPcmdhbml6YXRpb25BZG1pbi5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldE9yZ2FuaXphdGlvbkFkbWluLnVucmVhZGFibGVfZmllbGRzID0gcG9zT3JnYW5pemF0aW9uQWRtaW4udW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4udW5lZGl0YWJsZV9maWVsZHMgPSBwb3NPcmdhbml6YXRpb25BZG1pbi51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRPcmdhbml6YXRpb25BZG1pbi51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc09yZ2FuaXphdGlvbkFkbWluLnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEFkbWluO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRBZG1pbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzcGFjZUlkID09PSAnY29tbW9uJykge1xuICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYWNlVXNlciA9IF8uaXNOdWxsKHRoaXMuc3BhY2VVc2VyKSB8fCB0aGlzLnNwYWNlVXNlciA/IHRoaXMuc3BhY2VVc2VyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHNwYWNlVXNlcikge1xuICAgICAgICAgICAgcHJvZiA9IHNwYWNlVXNlci5wcm9maWxlO1xuICAgICAgICAgICAgaWYgKHByb2YpIHtcbiAgICAgICAgICAgICAgaWYgKHByb2YgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdtZW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldE1lbWJlcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnZ3Vlc3QnKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHMubGVuZ3RoID4gMCkge1xuICAgICAgc2V0X2lkcyA9IF8ucGx1Y2socHNldHMsIFwiX2lkXCIpO1xuICAgICAgcG9zID0gZmluZF9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1cnJlbnRfcG9zLCBvYmplY3RfbmFtZSwgc2V0X2lkcyk7XG4gICAgICBfLmVhY2gocG9zLCBmdW5jdGlvbihwbykge1xuICAgICAgICBpZiAocG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c0FkbWluICE9IG51bGwgPyBwc2V0c0FkbWluLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c1VzZXIgIT0gbnVsbCA/IHBzZXRzVXNlci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNNZW1iZXIgIT0gbnVsbCA/IHBzZXRzTWVtYmVyLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c0d1ZXN0ICE9IG51bGwgPyBwc2V0c0d1ZXN0Ll9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c1dvcmtmbG93QWRtaW4gIT0gbnVsbCA/IHBzZXRzV29ya2Zsb3dBZG1pbi5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNPcmdhbml6YXRpb25BZG1pbiAhPSBudWxsID8gcHNldHNPcmdhbml6YXRpb25BZG1pbi5faWQgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5hbGxvd1JlYWQpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5hbGxvd0NyZWF0ZSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8uYWxsb3dFZGl0KSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8uYWxsb3dEZWxldGUpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8udmlld0FsbFJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSB1bmlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cywgcG8uZGlzYWJsZWRfbGlzdF92aWV3cyk7XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgcG8uZGlzYWJsZWRfYWN0aW9ucyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBwby51bnJlYWRhYmxlX2ZpZWxkcyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBwby51bmVkaXRhYmxlX2ZpZWxkcyk7XG4gICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cywgcG8udW5yZWxhdGVkX29iamVjdHMpO1xuICAgICAgfSk7XG4gICAgICBpZiAoaXNXb3JrZmxvd0FkbWluKSB7XG4gICAgICAgIGlmIChvcHNldFdvcmtmbG93QWRtaW4uYWxsb3dSZWFkKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3BzZXRXb3JrZmxvd0FkbWluLmFsbG93Q3JlYXRlKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHNldFdvcmtmbG93QWRtaW4uYWxsb3dFZGl0KSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3BzZXRXb3JrZmxvd0FkbWluLmFsbG93RGVsZXRlKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHNldFdvcmtmbG93QWRtaW4ubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHNldFdvcmtmbG93QWRtaW4udmlld0FsbFJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wc2V0V29ya2Zsb3dBZG1pbi5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3BzZXRXb3JrZmxvd0FkbWluLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzLCBvcHNldFdvcmtmbG93QWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cyk7XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgb3BzZXRXb3JrZmxvd0FkbWluLmRpc2FibGVkX2FjdGlvbnMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgb3BzZXRXb3JrZmxvd0FkbWluLnVucmVhZGFibGVfZmllbGRzKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIG9wc2V0V29ya2Zsb3dBZG1pbi51bmVkaXRhYmxlX2ZpZWxkcyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBvcHNldFdvcmtmbG93QWRtaW4udW5yZWxhdGVkX29iamVjdHMpO1xuICAgICAgfVxuICAgICAgaWYgKGlzT3JnYW5pemF0aW9uQWRtaW4pIHtcbiAgICAgICAgaWYgKG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uYWxsb3dSZWFkKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3BzZXRPcmdhbml6YXRpb25BZG1pbi5hbGxvd0NyZWF0ZSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3BzZXRPcmdhbml6YXRpb25BZG1pbi5hbGxvd0VkaXQpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93RGVsZXRlKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHNldE9yZ2FuaXphdGlvbkFkbWluLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3BzZXRPcmdhbml6YXRpb25BZG1pbi52aWV3QWxsUmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3BzZXRPcmdhbml6YXRpb25BZG1pbi5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3BzZXRPcmdhbml6YXRpb25BZG1pbi52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSB1bmlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cywgb3BzZXRPcmdhbml6YXRpb25BZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzKTtcbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zLCBvcHNldE9yZ2FuaXphdGlvbkFkbWluLmRpc2FibGVkX2FjdGlvbnMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgb3BzZXRPcmdhbml6YXRpb25BZG1pbi51bnJlYWRhYmxlX2ZpZWxkcyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBvcHNldE9yZ2FuaXphdGlvbkFkbWluLnVuZWRpdGFibGVfZmllbGRzKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMsIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4udW5yZWxhdGVkX29iamVjdHMpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob2JqZWN0LmlzX3ZpZXcpIHtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IFtdO1xuICAgIH1cbiAgICBDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyhwZXJtaXNzaW9ucyk7XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICB9O1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgXCJjcmVhdG9yLm9iamVjdF9wZXJtaXNzaW9uc1wiOiBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB0aGlzLnVzZXJJZCk7XG4gICAgfVxuICB9KTtcbn1cbiIsIk1ldGVvci5zdGFydHVwICgpLT5cblx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0Y3JlYXRvcl9kYl91cmwgPSBwcm9jZXNzLmVudi5NT05HT19VUkxfQ1JFQVRPUlxuXHRcdG9wbG9nX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXG5cdFx0aWYgY3JlYXRvcl9kYl91cmxcblx0XHRcdGlmICFvcGxvZ191cmxcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiUGxlYXNlIGNvbmZpZ3VyZSBlbnZpcm9ubWVudCB2YXJpYWJsZXM6IE1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXCIpXG5cdFx0XHRDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UgPSB7X2RyaXZlcjogbmV3IE1vbmdvSW50ZXJuYWxzLlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoY3JlYXRvcl9kYl91cmwsIHtvcGxvZ1VybDogb3Bsb2dfdXJsfSl9XG5cbkNyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbiA9IChvYmplY3QpLT5cblx0Y29sbGVjdGlvbl9rZXkgPSBvYmplY3QubmFtZVxuXHRpZiBvYmplY3Quc3BhY2UgI29iamVjdC5jdXN0b20gJiZcblx0XHRjb2xsZWN0aW9uX2tleSA9IFwiY19cIiArIG9iamVjdC5zcGFjZSArIFwiX1wiICsgb2JqZWN0Lm5hbWVcblxuXHRpZiBkYltjb2xsZWN0aW9uX2tleV1cblx0XHRyZXR1cm4gZGJbY29sbGVjdGlvbl9rZXldXG5cdGVsc2UgaWYgb2JqZWN0LmRiXG5cdFx0cmV0dXJuIG9iamVjdC5kYlxuXG5cdGlmIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldXG5cdFx0cmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldXG5cdGVsc2Vcblx0XHRpZiBvYmplY3QuY3VzdG9tXG5cdFx0XHRyZXR1cm4gbmV3IE1ldGVvci5Db2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5LCBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UpXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG5ldyBNZXRlb3IuQ29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSlcblxuXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIGNyZWF0b3JfZGJfdXJsLCBvcGxvZ191cmw7XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBjcmVhdG9yX2RiX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSTF9DUkVBVE9SO1xuICAgIG9wbG9nX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SO1xuICAgIGlmIChjcmVhdG9yX2RiX3VybCkge1xuICAgICAgaWYgKCFvcGxvZ191cmwpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiUGxlYXNlIGNvbmZpZ3VyZSBlbnZpcm9ubWVudCB2YXJpYWJsZXM6IE1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSA9IHtcbiAgICAgICAgX2RyaXZlcjogbmV3IE1vbmdvSW50ZXJuYWxzLlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoY3JlYXRvcl9kYl91cmwsIHtcbiAgICAgICAgICBvcGxvZ1VybDogb3Bsb2dfdXJsXG4gICAgICAgIH0pXG4gICAgICB9O1xuICAgIH1cbiAgfVxufSk7XG5cbkNyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgY29sbGVjdGlvbl9rZXk7XG4gIGNvbGxlY3Rpb25fa2V5ID0gb2JqZWN0Lm5hbWU7XG4gIGlmIChvYmplY3Quc3BhY2UpIHtcbiAgICBjb2xsZWN0aW9uX2tleSA9IFwiY19cIiArIG9iamVjdC5zcGFjZSArIFwiX1wiICsgb2JqZWN0Lm5hbWU7XG4gIH1cbiAgaWYgKGRiW2NvbGxlY3Rpb25fa2V5XSkge1xuICAgIHJldHVybiBkYltjb2xsZWN0aW9uX2tleV07XG4gIH0gZWxzZSBpZiAob2JqZWN0LmRiKSB7XG4gICAgcmV0dXJuIG9iamVjdC5kYjtcbiAgfVxuICBpZiAoQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV0pIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV07XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iamVjdC5jdXN0b20pIHtcbiAgICAgIHJldHVybiBuZXcgTWV0ZW9yLkNvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXksIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgTWV0ZW9yLkNvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXkpO1xuICAgIH1cbiAgfVxufTtcbiIsIkNyZWF0b3IuYWN0aW9uc0J5TmFtZSA9IHt9XG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXG5cdCMg5a6a5LmJ5YWo5bGAIGFjdGlvbnMg5Ye95pWwXHRcblx0Q3JlYXRvci5hY3Rpb25zID0gKGFjdGlvbnMpLT5cblx0XHRfLmVhY2ggYWN0aW9ucywgKHRvZG8sIGFjdGlvbl9uYW1lKS0+XG5cdFx0XHRDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uX25hbWVdID0gdG9kbyBcblxuXHRDcmVhdG9yLmV4ZWN1dGVBY3Rpb24gPSAob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkKS0+XG5cdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgYWN0aW9uPy50b2RvXG5cdFx0XHRpZiB0eXBlb2YgYWN0aW9uLnRvZG8gPT0gXCJzdHJpbmdcIlxuXHRcdFx0XHR0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXVxuXHRcdFx0ZWxzZSBpZiB0eXBlb2YgYWN0aW9uLnRvZG8gPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdHRvZG8gPSBhY3Rpb24udG9kb1x0XG5cdFx0XHRpZiAhcmVjb3JkICYmIG9iamVjdF9uYW1lICYmIHJlY29yZF9pZFxuXHRcdFx0XHRyZWNvcmQgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0aWYgdG9kb1xuXHRcdFx0XHQjIGl0ZW1fZWxlbWVudOS4uuepuuaXtuW6lOivpeiuvue9rum7mOiupOWAvO+8iOWvueixoeeahG5hbWXlrZfmrrXvvInvvIzlkKbliJltb3JlQXJnc+aLv+WIsOeahOWQjue7reWPguaVsOS9jee9ruWwseS4jeWvuVxuXHRcdFx0XHRpdGVtX2VsZW1lbnQgPSBpZiBpdGVtX2VsZW1lbnQgdGhlbiBpdGVtX2VsZW1lbnQgZWxzZSBcIlwiXG5cdFx0XHRcdG1vcmVBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKVxuXHRcdFx0XHR0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpXG5cdFx0XHRcdHRvZG8uYXBwbHkge1xuXHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuXHRcdFx0XHRcdHJlY29yZF9pZDogcmVjb3JkX2lkXG5cdFx0XHRcdFx0b2JqZWN0OiBvYmpcblx0XHRcdFx0XHRhY3Rpb246IGFjdGlvblxuXHRcdFx0XHRcdGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50XG5cdFx0XHRcdFx0cmVjb3JkOiByZWNvcmRcblx0XHRcdFx0fSwgdG9kb0FyZ3Ncblx0XHRcdFx0XG5cblx0Q3JlYXRvci5hY3Rpb25zIFxuXHRcdCMg5Zyo5q2k5a6a5LmJ5YWo5bGAIGFjdGlvbnNcblx0XHRcInN0YW5kYXJkX3F1ZXJ5XCI6ICgpLT5cblx0XHRcdE1vZGFsLnNob3coXCJzdGFuZGFyZF9xdWVyeV9tb2RhbFwiKVxuXG5cdFx0XCJzdGFuZGFyZF9uZXdcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxuXHRcdFx0aWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbb2JqZWN0X25hbWVdXG5cdFx0XHRpZiBpZHM/Lmxlbmd0aFxuXHRcdFx0XHQjIOWIl+ihqOaciemAieS4remhueaXtu+8jOWPluesrOS4gOS4qumAieS4remhue+8jOWkjeWItuWFtuWGheWuueWIsOaWsOW7uueql+WPo+S4rVxuXHRcdFx0XHQjIOi/meeahOesrOS4gOS4quaMh+eahOaYr+esrOS4gOasoeWLvumAieeahOmAieS4remhue+8jOiAjOS4jeaYr+WIl+ihqOS4reW3suWLvumAieeahOesrOS4gOmhuVxuXHRcdFx0XHRyZWNvcmRfaWQgPSBpZHNbMF1cblx0XHRcdFx0ZG9jID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgZG9jXG5cdFx0XHRcdCMg4oCc5L+d5a2Y5bm25paw5bu64oCd5pON5L2c5Lit6Ieq5Yqo5omT5byA55qE5paw56qX5Y+j5Lit6ZyA6KaB5YaN5qyh5aSN5Yi25pyA5paw55qEZG9j5YaF5a655Yiw5paw56qX5Y+j5LitXG5cdFx0XHRcdFNlc3Npb24uc2V0ICdjbVNob3dBZ2FpbkR1cGxpY2F0ZWQnLCB0cnVlXG5cdFx0XHRNZXRlb3IuZGVmZXIgKCktPlxuXHRcdFx0XHQkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKClcblx0XHRcdHJldHVybiBcblx0XHRcdFxuXHRcdFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cblx0XHRcdGhyZWYgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0d2luZG93Lm9wZW4oXG5cdFx0XHRcdGhyZWYsXG5cdFx0XHRcdCdfYmxhbmsnLFxuXHRcdFx0XHQnd2lkdGg9ODAwLCBoZWlnaHQ9NjAwLCBsZWZ0PTUwLCB0b3A9IDUwLCB0b29sYmFyPW5vLCBzdGF0dXM9bm8sIG1lbnViYXI9bm8sIHJlc2l6YWJsZT15ZXMsIHNjcm9sbGJhcnM9eWVzJ1xuXHRcdFx0KVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRcInN0YW5kYXJkX29wZW5fdmlld1wiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XG5cdFx0XHRocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdHdpbmRvdy5vcGVuKFxuXHRcdFx0XHRocmVmLFxuXHRcdFx0XHQnX2JsYW5rJyxcblx0XHRcdFx0J3dpZHRoPTgwMCwgaGVpZ2h0PTYwMCwgbGVmdD01MCwgdG9wPSA1MCwgdG9vbGJhcj1ubywgc3RhdHVzPW5vLCBtZW51YmFyPW5vLCByZXNpemFibGU9eWVzLCBzY3JvbGxiYXJzPXllcydcblx0XHRcdClcblx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0XCJzdGFuZGFyZF9lZGl0XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cblx0XHRcdGlmIHJlY29yZF9pZFxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgJiYgZmFsc2VcbiNcdFx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcbiNcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgcmVjb3JkXG4jXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdyZWxvYWRfZHhsaXN0JywgZmFsc2Vcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZFxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdE1ldGVvci5kZWZlciAoKS0+XG5cdFx0XHRcdFx0XHQkKFwiLmJ0bi1lZGl0LXJlY29yZFwiKS5jbGljaygpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZFxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cblx0XHRcdFx0XHRcdFx0JChcIi5idG4uY3JlYXRvci1lZGl0XCIpLmNsaWNrKClcblxuXHRcdFwic3RhbmRhcmRfZGVsZXRlXCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgY2FsbF9iYWNrKS0+XG5cdFx0XHRjb25zb2xlLmxvZyhcInN0YW5kYXJkX2RlbGV0ZVwiLCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZClcblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdFx0XHRpZighXy5pc1N0cmluZyhyZWNvcmRfdGl0bGUpICYmIHJlY29yZF90aXRsZT8ubmFtZSlcblx0XHRcdFx0cmVjb3JkX3RpdGxlID0gcmVjb3JkX3RpdGxlPy5uYW1lXG5cblx0XHRcdGlmIHJlY29yZF90aXRsZVxuXHRcdFx0XHR0ZXh0ID0gXCLmmK/lkKbnoa7lrpropoHliKDpmaTmraQje29iamVjdC5sYWJlbH1cXFwiI3tyZWNvcmRfdGl0bGV9XFxcIlwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRleHQgPSBcIuaYr+WQpuehruWumuimgeWIoOmZpOatpCN7b2JqZWN0LmxhYmVsfVwiXG5cdFx0XHRzd2FsXG5cdFx0XHRcdHRpdGxlOiBcIuWIoOmZpCN7b2JqZWN0LmxhYmVsfVwiXG5cdFx0XHRcdHRleHQ6IFwiPGRpdiBjbGFzcz0nZGVsZXRlLWNyZWF0b3Itd2FybmluZyc+I3t0ZXh0fe+8nzwvZGl2PlwiXG5cdFx0XHRcdGh0bWw6IHRydWVcblx0XHRcdFx0c2hvd0NhbmNlbEJ1dHRvbjp0cnVlXG5cdFx0XHRcdGNvbmZpcm1CdXR0b25UZXh0OiB0KCdEZWxldGUnKVxuXHRcdFx0XHRjYW5jZWxCdXR0b25UZXh0OiB0KCdDYW5jZWwnKVxuXHRcdFx0XHQob3B0aW9uKSAtPlxuXHRcdFx0XHRcdGlmIG9wdGlvblxuXHRcdFx0XHRcdFx0Q3JlYXRvci5vZGF0YS5kZWxldGUgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgKCktPlxuXHRcdFx0XHRcdFx0XHRpZiByZWNvcmRfdGl0bGVcblx0XHRcdFx0XHRcdFx0XHRpbmZvID0gb2JqZWN0LmxhYmVsICsgXCJcXFwiI3tyZWNvcmRfdGl0bGV9XFxcIlwiICsgXCLlt7LliKDpmaRcIlxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0aW5mbyA9IFwi5Yig6Zmk5oiQ5YqfXCJcblx0XHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MgaW5mb1xuXHRcdFx0XHRcdFx0XHQjIOaWh+S7tueJiOacrOS4ulwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIu+8jOmcgOimgeabv+aNouS4ulwiY2ZzLWZpbGVzLWZpbGVyZWNvcmRcIlxuXHRcdFx0XHRcdFx0XHRncmlkT2JqZWN0TmFtZUNsYXNzID0gb2JqZWN0X25hbWUucmVwbGFjZSgvXFwuL2csXCItXCIpXG5cdFx0XHRcdFx0XHRcdGdyaWRDb250YWluZXIgPSAkKFwiLmdyaWRDb250YWluZXIuI3tncmlkT2JqZWN0TmFtZUNsYXNzfVwiKVxuXHRcdFx0XHRcdFx0XHR1bmxlc3MgZ3JpZENvbnRhaW5lcj8ubGVuZ3RoXG5cdFx0XHRcdFx0XHRcdFx0aWYgd2luZG93Lm9wZW5lclxuXHRcdFx0XHRcdFx0XHRcdFx0aXNPcGVuZXJSZW1vdmUgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdFx0XHRncmlkQ29udGFpbmVyID0gd2luZG93Lm9wZW5lci4kKFwiLmdyaWRDb250YWluZXIuI3tncmlkT2JqZWN0TmFtZUNsYXNzfVwiKVxuXHRcdFx0XHRcdFx0XHRpZiBncmlkQ29udGFpbmVyPy5sZW5ndGhcblx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3QuZW5hYmxlX3RyZWVcblx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhUcmVlTGlzdCgpLmR4VHJlZUxpc3QoJ2luc3RhbmNlJylcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4RGF0YUdyaWQoKS5keERhdGFHcmlkKCdpbnN0YW5jZScpXG5cdFx0XHRcdFx0XHRcdGlmIGR4RGF0YUdyaWRJbnN0YW5jZVxuXHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfdHJlZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZHhEYXRhR3JpZEluc3RhbmNlLnJlZnJlc2goKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFRlbXBsYXRlLmNyZWF0b3JfZ3JpZC5yZWZyZXNoKGR4RGF0YUdyaWRJbnN0YW5jZSlcblx0XHRcdFx0XHRcdFx0aWYgaXNPcGVuZXJSZW1vdmUgb3IgIWR4RGF0YUdyaWRJbnN0YW5jZVxuXHRcdFx0XHRcdFx0XHRcdGlmIGlzT3BlbmVyUmVtb3ZlXG5cdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cuY2xvc2UoKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgcmVjb3JkX2lkID09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpIGFuZCAhU3RlZWRvcy5pc01vYmlsZSgpIGFuZCBsaXN0X3ZpZXdfaWQgIT0gJ2NhbGVuZGFyJ1xuXHRcdFx0XHRcdFx0XHRcdFx0YXBwaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsaXN0X3ZpZXdfaWQgPSBcImFsbFwiXG5cdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLmdvIFwiL2FwcC8je2FwcGlkfS8je29iamVjdF9uYW1lfS9ncmlkLyN7bGlzdF92aWV3X2lkfVwiXG5cdFx0XHRcdFx0XHRcdGlmIGNhbGxfYmFjayBhbmQgdHlwZW9mIGNhbGxfYmFjayA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0XHRcdFx0XHRjYWxsX2JhY2soKVxuIiwiQ3JlYXRvci5hY3Rpb25zQnlOYW1lID0ge307XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5hY3Rpb25zID0gZnVuY3Rpb24oYWN0aW9ucykge1xuICAgIHJldHVybiBfLmVhY2goYWN0aW9ucywgZnVuY3Rpb24odG9kbywgYWN0aW9uX25hbWUpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uX25hbWVdID0gdG9kbztcbiAgICB9KTtcbiAgfTtcbiAgQ3JlYXRvci5leGVjdXRlQWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkKSB7XG4gICAgdmFyIG1vcmVBcmdzLCBvYmosIHRvZG8sIHRvZG9BcmdzO1xuICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMCkge1xuICAgICAgaWYgKHR5cGVvZiBhY3Rpb24udG9kbyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFjdGlvbi50b2RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdG9kbyA9IGFjdGlvbi50b2RvO1xuICAgICAgfVxuICAgICAgaWYgKCFyZWNvcmQgJiYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgICAgIHJlY29yZCA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgfVxuICAgICAgaWYgKHRvZG8pIHtcbiAgICAgICAgaXRlbV9lbGVtZW50ID0gaXRlbV9lbGVtZW50ID8gaXRlbV9lbGVtZW50IDogXCJcIjtcbiAgICAgICAgbW9yZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuICAgICAgICB0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpO1xuICAgICAgICByZXR1cm4gdG9kby5hcHBseSh7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICAgIHJlY29yZF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgIG9iamVjdDogb2JqLFxuICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgIGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50LFxuICAgICAgICAgIHJlY29yZDogcmVjb3JkXG4gICAgICAgIH0sIHRvZG9BcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIENyZWF0b3IuYWN0aW9ucyh7XG4gICAgXCJzdGFuZGFyZF9xdWVyeVwiOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBNb2RhbC5zaG93KFwic3RhbmRhcmRfcXVlcnlfbW9kYWxcIik7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX25ld1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpIHtcbiAgICAgIHZhciBkb2MsIGlkcztcbiAgICAgIGlkcyA9IENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzW29iamVjdF9uYW1lXTtcbiAgICAgIGlmIChpZHMgIT0gbnVsbCA/IGlkcy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgcmVjb3JkX2lkID0gaWRzWzBdO1xuICAgICAgICBkb2MgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgZG9jKTtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWUpO1xuICAgICAgfVxuICAgICAgTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJChcIi5jcmVhdG9yLWFkZFwiKS5jbGljaygpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX29wZW5fdmlld1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpIHtcbiAgICAgIHZhciBocmVmO1xuICAgICAgaHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgd2luZG93Lm9wZW4oaHJlZiwgJ19ibGFuaycsICd3aWR0aD04MDAsIGhlaWdodD02MDAsIGxlZnQ9NTAsIHRvcD0gNTAsIHRvb2xiYXI9bm8sIHN0YXR1cz1ubywgbWVudWJhcj1ubywgcmVzaXphYmxlPXllcywgc2Nyb2xsYmFycz15ZXMnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGhyZWY7XG4gICAgICBocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICB3aW5kb3cub3BlbihocmVmLCAnX2JsYW5rJywgJ3dpZHRoPTgwMCwgaGVpZ2h0PTYwMCwgbGVmdD01MCwgdG9wPSA1MCwgdG9vbGJhcj1ubywgc3RhdHVzPW5vLCBtZW51YmFyPW5vLCByZXNpemFibGU9eWVzLCBzY3JvbGxiYXJzPXllcycpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9lZGl0XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIGZhbHNlKSB7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZCk7XG4gICAgICAgICAgaWYgKHRoaXMucmVjb3JkKSB7XG4gICAgICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCB0aGlzLnJlY29yZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIi5idG4tZWRpdC1yZWNvcmRcIikuY2xpY2soKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIHRoaXMucmVjb3JkKTtcbiAgICAgICAgICAgIHJldHVybiBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiAkKFwiLmJ0bi5jcmVhdG9yLWVkaXRcIikuY2xpY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9kZWxldGVcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIGNhbGxfYmFjaykge1xuICAgICAgdmFyIG9iamVjdCwgdGV4dDtcbiAgICAgIGNvbnNvbGUubG9nKFwic3RhbmRhcmRfZGVsZXRlXCIsIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkKTtcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICAgIGlmICghXy5pc1N0cmluZyhyZWNvcmRfdGl0bGUpICYmIChyZWNvcmRfdGl0bGUgIT0gbnVsbCA/IHJlY29yZF90aXRsZS5uYW1lIDogdm9pZCAwKSkge1xuICAgICAgICByZWNvcmRfdGl0bGUgPSByZWNvcmRfdGl0bGUgIT0gbnVsbCA/IHJlY29yZF90aXRsZS5uYW1lIDogdm9pZCAwO1xuICAgICAgfVxuICAgICAgaWYgKHJlY29yZF90aXRsZSkge1xuICAgICAgICB0ZXh0ID0gXCLmmK/lkKbnoa7lrpropoHliKDpmaTmraRcIiArIG9iamVjdC5sYWJlbCArIFwiXFxcIlwiICsgcmVjb3JkX3RpdGxlICsgXCJcXFwiXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0ID0gXCLmmK/lkKbnoa7lrpropoHliKDpmaTmraRcIiArIG9iamVjdC5sYWJlbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzd2FsKHtcbiAgICAgICAgdGl0bGU6IFwi5Yig6ZmkXCIgKyBvYmplY3QubGFiZWwsXG4gICAgICAgIHRleHQ6IFwiPGRpdiBjbGFzcz0nZGVsZXRlLWNyZWF0b3Itd2FybmluZyc+XCIgKyB0ZXh0ICsgXCLvvJ88L2Rpdj5cIixcbiAgICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IHQoJ0RlbGV0ZScpLFxuICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiB0KCdDYW5jZWwnKVxuICAgICAgfSwgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIGlmIChvcHRpb24pIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvci5vZGF0YVtcImRlbGV0ZVwiXShvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhcHBpZCwgZHhEYXRhR3JpZEluc3RhbmNlLCBncmlkQ29udGFpbmVyLCBncmlkT2JqZWN0TmFtZUNsYXNzLCBpbmZvLCBpc09wZW5lclJlbW92ZTtcbiAgICAgICAgICAgIGlmIChyZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgICAgICAgaW5mbyA9IG9iamVjdC5sYWJlbCArIChcIlxcXCJcIiArIHJlY29yZF90aXRsZSArIFwiXFxcIlwiKSArIFwi5bey5Yig6ZmkXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpbmZvID0gXCLliKDpmaTmiJDlip9cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKGluZm8pO1xuICAgICAgICAgICAgZ3JpZE9iamVjdE5hbWVDbGFzcyA9IG9iamVjdF9uYW1lLnJlcGxhY2UoL1xcLi9nLCBcIi1cIik7XG4gICAgICAgICAgICBncmlkQ29udGFpbmVyID0gJChcIi5ncmlkQ29udGFpbmVyLlwiICsgZ3JpZE9iamVjdE5hbWVDbGFzcyk7XG4gICAgICAgICAgICBpZiAoIShncmlkQ29udGFpbmVyICE9IG51bGwgPyBncmlkQ29udGFpbmVyLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgaWYgKHdpbmRvdy5vcGVuZXIpIHtcbiAgICAgICAgICAgICAgICBpc09wZW5lclJlbW92ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgZ3JpZENvbnRhaW5lciA9IHdpbmRvdy5vcGVuZXIuJChcIi5ncmlkQ29udGFpbmVyLlwiICsgZ3JpZE9iamVjdE5hbWVDbGFzcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChncmlkQ29udGFpbmVyICE9IG51bGwgPyBncmlkQ29udGFpbmVyLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgICBpZiAob2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keFRyZWVMaXN0KCkuZHhUcmVlTGlzdCgnaW5zdGFuY2UnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4RGF0YUdyaWQoKS5keERhdGFHcmlkKCdpbnN0YW5jZScpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZHhEYXRhR3JpZEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgIGlmIChvYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UucmVmcmVzaCgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFRlbXBsYXRlLmNyZWF0b3JfZ3JpZC5yZWZyZXNoKGR4RGF0YUdyaWRJbnN0YW5jZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc09wZW5lclJlbW92ZSB8fCAhZHhEYXRhR3JpZEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgIGlmIChpc09wZW5lclJlbW92ZSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlY29yZF9pZCA9PT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBsaXN0X3ZpZXdfaWQgIT09ICdjYWxlbmRhcicpIHtcbiAgICAgICAgICAgICAgICBhcHBpZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICAgICAgICAgICAgICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICAgICAgICAgICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgICAgICAgICAgICAgIGxpc3Rfdmlld19pZCA9IFwiYWxsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvYXBwL1wiICsgYXBwaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjYWxsX2JhY2sgJiYgdHlwZW9mIGNhbGxfYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYWxsX2JhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==
