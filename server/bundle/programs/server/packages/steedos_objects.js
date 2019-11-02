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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJSZXBvcnRzIiwic3VicyIsInN0ZWVkb3NTY2hlbWEiLCJlIiwic3RlZWRvc0NvcmUiLCJyZXF1aXJlIiwiTWV0ZW9yIiwiaXNEZXZlbG9wbWVudCIsInN0YXJ0dXAiLCJleCIsImluaXQiLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJGaWJlciIsInBhdGgiLCJkZXBzIiwiYXBwIiwiVHJhY2tlciIsIkRlcGVuZGVuY3kiLCJvYmplY3QiLCJfVEVNUExBVEUiLCJTaW1wbGVTY2hlbWEiLCJleHRlbmRPcHRpb25zIiwiZmlsdGVyc0Z1bmN0aW9uIiwiTWF0Y2giLCJPcHRpb25hbCIsIk9uZU9mIiwiRnVuY3Rpb24iLCJTdHJpbmciLCJvcHRpb25zRnVuY3Rpb24iLCJjcmVhdGVGdW5jdGlvbiIsImlzU2VydmVyIiwiZmliZXJMb2FkT2JqZWN0cyIsIm9iaiIsIm9iamVjdF9uYW1lIiwibG9hZE9iamVjdHMiLCJydW4iLCJuYW1lIiwibGlzdF92aWV3cyIsInNwYWNlIiwiY29udmVydE9iamVjdCIsIk9iamVjdCIsImluaXRUcmlnZ2VycyIsImluaXRMaXN0Vmlld3MiLCJnZXRPYmplY3ROYW1lIiwiZ2V0T2JqZWN0Iiwic3BhY2VfaWQiLCJyZWYiLCJyZWYxIiwiXyIsImlzQXJyYXkiLCJpc0NsaWVudCIsImRlcGVuZCIsIlNlc3Npb24iLCJnZXQiLCJzdGFydHNXaXRoIiwib2JqZWN0c0J5TmFtZSIsImZpbmQiLCJvIiwiX2NvbGxlY3Rpb25fbmFtZSIsImdldE9iamVjdEJ5SWQiLCJvYmplY3RfaWQiLCJmaW5kV2hlcmUiLCJfaWQiLCJyZW1vdmVPYmplY3QiLCJnZXRDb2xsZWN0aW9uIiwic3BhY2VJZCIsInJlbW92ZUNvbGxlY3Rpb24iLCJpc1NwYWNlQWRtaW4iLCJ1c2VySWQiLCJmaW5kT25lIiwiYWRtaW5zIiwiaW5kZXhPZiIsImV2YWx1YXRlRm9ybXVsYSIsImZvcm11bGFyIiwiY29udGV4dCIsIm9wdGlvbnMiLCJpc1N0cmluZyIsIkZvcm11bGFyIiwiY2hlY2tGb3JtdWxhIiwiZXZhbHVhdGVGaWx0ZXJzIiwiZmlsdGVycyIsInNlbGVjdG9yIiwiZWFjaCIsImZpbHRlciIsImFjdGlvbiIsInZhbHVlIiwibGVuZ3RoIiwiaXNDb21tb25TcGFjZSIsImdldE9yZGVybHlTZXRCeUlkcyIsImRvY3MiLCJpZHMiLCJpZF9rZXkiLCJoaXRfZmlyc3QiLCJ2YWx1ZXMiLCJnZXRQcm9wZXJ0eSIsInNvcnRCeSIsImRvYyIsIl9pbmRleCIsInNvcnRpbmdNZXRob2QiLCJ2YWx1ZTEiLCJ2YWx1ZTIiLCJpc1ZhbHVlMUVtcHR5IiwiaXNWYWx1ZTJFbXB0eSIsImxvY2FsZSIsImtleSIsIkRhdGUiLCJnZXRUaW1lIiwiU3RlZWRvcyIsInRvU3RyaW5nIiwibG9jYWxlQ29tcGFyZSIsImdldE9iamVjdFJlbGF0ZWRzIiwiX29iamVjdCIsInBlcm1pc3Npb25zIiwicmVsYXRlZF9vYmplY3RzIiwiZW5hYmxlX2ZpbGVzIiwicHVzaCIsImZvcmVpZ25fa2V5IiwicmVsYXRlZF9vYmplY3QiLCJyZWxhdGVkX29iamVjdF9uYW1lIiwiZmllbGRzIiwicmVsYXRlZF9maWVsZCIsInJlbGF0ZWRfZmllbGRfbmFtZSIsInR5cGUiLCJyZWZlcmVuY2VfdG8iLCJzcGxpY2UiLCJlbmFibGVfdGFza3MiLCJlbmFibGVfbm90ZXMiLCJlbmFibGVfZXZlbnRzIiwiZW5hYmxlX2luc3RhbmNlcyIsImVuYWJsZV9hcHByb3ZhbHMiLCJnZXRQZXJtaXNzaW9ucyIsImVuYWJsZV9hdWRpdCIsIm1vZGlmeUFsbFJlY29yZHMiLCJnZXRVc2VyQ29udGV4dCIsImlzVW5TYWZlTW9kZSIsIlVTRVJfQ09OVEVYVCIsInNwYWNlX3VzZXJfb3JnIiwic3UiLCJzdUZpZWxkcyIsIkVycm9yIiwibW9iaWxlIiwicG9zaXRpb24iLCJlbWFpbCIsImNvbXBhbnkiLCJvcmdhbml6YXRpb24iLCJjb21wYW55X2lkIiwiY29tcGFueV9pZHMiLCJ1c2VyIiwiZnVsbG5hbWUiLCJnZXRSZWxhdGl2ZVVybCIsInVybCIsInRlc3QiLCJfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fIiwiUk9PVF9VUkxfUEFUSF9QUkVGSVgiLCJnZXRVc2VyQ29tcGFueUlkIiwiZ2V0VXNlckNvbXBhbnlJZHMiLCJwcm9jZXNzUGVybWlzc2lvbnMiLCJwbyIsImFsbG93Q3JlYXRlIiwiYWxsb3dSZWFkIiwiYWxsb3dFZGl0IiwiYWxsb3dEZWxldGUiLCJ2aWV3QWxsUmVjb3JkcyIsInZpZXdDb21wYW55UmVjb3JkcyIsIm1vZGlmeUNvbXBhbnlSZWNvcmRzIiwicHJvY2VzcyIsImVudiIsIlNURUVET1NfU1RPUkFHRV9ESVIiLCJzdGVlZG9zU3RvcmFnZURpciIsInJlc29sdmUiLCJqb2luIiwiX19tZXRlb3JfYm9vdHN0cmFwX18iLCJzZXJ2ZXJEaXIiLCJtZXRob2RzIiwiY29sbGVjdGlvbiIsIm5hbWVfZmllbGRfa2V5Iiwib3B0aW9uc19saW1pdCIsInF1ZXJ5IiwicXVlcnlfb3B0aW9ucyIsInJlY29yZHMiLCJyZXN1bHRzIiwic2VhcmNoVGV4dFF1ZXJ5Iiwic2VsZWN0ZWQiLCJzb3J0IiwicGFyYW1zIiwiTkFNRV9GSUVMRF9LRVkiLCJzZWFyY2hUZXh0IiwiJHJlZ2V4IiwiJG9yIiwiJGluIiwiZXh0ZW5kIiwiJG5pbiIsImZpbHRlclF1ZXJ5IiwibGltaXQiLCJpc09iamVjdCIsImZldGNoIiwicmVjb3JkIiwibGFiZWwiLCJtZXNzYWdlIiwiSlNPTiIsInN0cmluZ2lmeSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiYm94IiwiY3VycmVudF91c2VyX2lkIiwiY3VycmVudF91c2VyX2luZm8iLCJmbG93SWQiLCJoYXNoRGF0YSIsImlucyIsImluc0lkIiwicmVjb3JkX2lkIiwicmVkaXJlY3RfdXJsIiwicmVmMiIsIndvcmtmbG93VXJsIiwieF9hdXRoX3Rva2VuIiwieF91c2VyX2lkIiwidXVmbG93TWFuYWdlciIsImNoZWNrX2F1dGhvcml6YXRpb24iLCJib2R5IiwiY2hlY2siLCJpbnN0YW5jZUlkIiwic2V0dGluZ3MiLCJ3ZWJzZXJ2aWNlcyIsIndvcmtmbG93IiwiZmxvdyIsImluYm94X3VzZXJzIiwiaW5jbHVkZXMiLCJjY191c2VycyIsIm91dGJveF91c2VycyIsInN0YXRlIiwic3VibWl0dGVyIiwiYXBwbGljYW50IiwicGVybWlzc2lvbk1hbmFnZXIiLCJnZXRGbG93UGVybWlzc2lvbnMiLCJzcGFjZXMiLCJzZW5kUmVzdWx0IiwiY29kZSIsImRhdGEiLCJ1cGRhdGUiLCIkcHVsbCIsImVycm9ycyIsImVycm9yTWVzc2FnZSIsInJlYXNvbiIsImdldEluaXRXaWR0aFBlcmNlbnQiLCJjb2x1bW5zIiwiX3NjaGVtYSIsImNvbHVtbl9udW0iLCJpbml0X3dpZHRoX3BlcmNlbnQiLCJnZXRTY2hlbWEiLCJmaWVsZF9uYW1lIiwiZmllbGQiLCJpc193aWRlIiwicGljayIsImF1dG9mb3JtIiwiZ2V0RmllbGRJc1dpZGUiLCJnZXRUYWJ1bGFyT3JkZXIiLCJsaXN0X3ZpZXdfaWQiLCJzZXR0aW5nIiwibWFwIiwiY29sdW1uIiwiaGlkZGVuIiwiY29tcGFjdCIsIm9yZGVyIiwiaW5kZXgiLCJkZWZhdWx0X2V4dHJhX2NvbHVtbnMiLCJleHRyYV9jb2x1bW5zIiwiZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMiLCJnZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zIiwidW5pb24iLCJnZXRPYmplY3REZWZhdWx0U29ydCIsIlRhYnVsYXJTZWxlY3RlZElkcyIsImNvbnZlcnRMaXN0VmlldyIsImRlZmF1bHRfY29sdW1lbnMiLCJsaXN0X3ZpZXciLCJsaXN0X3ZpZXdfbmFtZSIsIm9pdGVtIiwiY2xvbmUiLCJoYXMiLCJmaWx0ZXJfc2NvcGUiLCJwYXJzZSIsImZvckVhY2giLCJpc0Z1bmN0aW9uIiwiX3ZhbHVlIiwiZ2V0UmVsYXRlZExpc3QiLCJsaXN0IiwiZ2V0UmVsYXRlZE9iamVjdHMiLCJyZWxhdGVkX29iamVjdF9pdGVtIiwicmVsYXRlZCIsInRhYnVsYXJfb3JkZXIiLCJ3aXRob3V0IiwidHJhbnNmb3JtU29ydFRvVGFidWxhciIsInJlcGxhY2UiLCJpc19maWxlIiwiZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyIsImZpcnN0IiwiZ2V0TGlzdFZpZXdzIiwiZ2V0TGlzdFZpZXciLCJleGFjIiwibGlzdFZpZXdzIiwiZ2V0TGlzdFZpZXdJc1JlY2VudCIsImxpc3RWaWV3IiwiZ2V0T2JqZWN0RGVmYXVsdFZpZXciLCJkZWZhdWx0VmlldyIsImlzQWxsVmlldyIsImlzUmVjZW50VmlldyIsInRhYnVsYXJDb2x1bW5zIiwidGFidWxhcl9zb3J0IiwiaXRlbSIsImNvbHVtbl9pbmRleCIsInRyYW5zZm9ybVNvcnRUb0RYIiwiZHhfc29ydCIsIlJlZ0V4IiwiUmVnRXhwIiwiX3JlZ0V4TWVzc2FnZXMiLCJfZ2xvYmFsTWVzc2FnZXMiLCJyZWdFeCIsImV4cCIsIm1zZyIsIm1lc3NhZ2VzIiwiZXZhbEluQ29udGV4dCIsImpzIiwiZXZhbCIsImNhbGwiLCJnZXRPcHRpb24iLCJvcHRpb24iLCJmb28iLCJzcGxpdCIsInRyaWdnZXJzIiwidHJpZ2dlciIsIl90b2RvIiwiX3RvZG9fZnJvbV9jb2RlIiwiX3RvZG9fZnJvbV9kYiIsIm9uIiwidG9kbyIsImFjdGlvbnMiLCJfdmlzaWJsZSIsImVycm9yMSIsImFjdGlvbnNCeU5hbWUiLCJ2aXNpYmxlIiwiX29wdGlvbnMiLCJfdHlwZSIsImJlZm9yZU9wZW5GdW5jdGlvbiIsImRlZmF1bHRWYWx1ZSIsImlzX2NvbXBhbnlfbGltaXRlZCIsIl9vcHRpb24iLCJ2IiwiayIsIl9yZWdFeCIsIk51bWJlciIsIkJvb2xlYW4iLCJfb3B0aW9uc0Z1bmN0aW9uIiwiX3JlZmVyZW5jZV90byIsIl9jcmVhdGVGdW5jdGlvbiIsIl9iZWZvcmVPcGVuRnVuY3Rpb24iLCJfZmlsdGVyc0Z1bmN0aW9uIiwiX2RlZmF1bHRWYWx1ZSIsIl9pc19jb21wYW55X2xpbWl0ZWQiLCJfZmlsdGVycyIsImlzRGF0ZSIsInBvcCIsIl9pc19kYXRlIiwiUFJFRklYIiwiX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhIiwicHJlZml4IiwiZmllbGRWYXJpYWJsZSIsInJlZyIsInJldiIsIm0iLCIkMSIsImZvcm11bGFfc3RyIiwiX0NPTlRFWFQiLCJfVkFMVUVTIiwiaXNCb29sZWFuIiwidG9hc3RyIiwiZm9ybWF0T2JqZWN0TmFtZSIsIl9kYiIsImRlZmF1bHRDb2x1bW5zIiwiZGVmYXVsdExpc3RWaWV3SWQiLCJkaXNhYmxlZF9saXN0X3ZpZXdzIiwicmVmMyIsInNjaGVtYSIsInNlbGYiLCJpY29uIiwiZGVzY3JpcHRpb24iLCJpc192aWV3IiwiaXNfZW5hYmxlIiwiZW5hYmxlX3NlYXJjaCIsImVuYWJsZV9hcGkiLCJjdXN0b20iLCJlbmFibGVfc2hhcmUiLCJlbmFibGVfdHJlZSIsIm9wZW5fd2luZG93IiwiZmlsdGVyX2NvbXBhbnkiLCJjYWxlbmRhciIsInNpZGViYXIiLCJlbmFibGVfY2hhdHRlciIsImVuYWJsZV90cmFzaCIsImVuYWJsZV9zcGFjZV9nbG9iYWwiLCJpZEZpZWxkTmFtZSIsImRhdGFiYXNlX25hbWUiLCJpc19uYW1lIiwicHJpbWFyeSIsImJhc2VPYmplY3QiLCJpdGVtX25hbWUiLCJjb3B5SXRlbSIsInBlcm1pc3Npb25fc2V0IiwiYWRtaW4iLCJhbGwiLCJsaXN0X3ZpZXdfaXRlbSIsIlJlYWN0aXZlVmFyIiwidW5yZWFkYWJsZV9maWVsZHMiLCJ1bmVkaXRhYmxlX2ZpZWxkcyIsInJlYWRvbmx5IiwiZGlzYWJsZWQiLCJyZXF1aXJlZCIsImNyZWF0ZUNvbGxlY3Rpb24iLCJfbmFtZSIsImdldE9iamVjdFNjaGVtYSIsImNvbnRhaW5zIiwiYXR0YWNoU2NoZW1hIiwiX3NpbXBsZVNjaGVtYSIsInByb3RvdHlwZSIsImkxOG4iLCJ0IiwiZmtleSIsImkxOG5fa2V5IiwiZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXgiLCJhdXRvcnVuIiwiYm9vdHN0cmFwTG9hZGVkIiwiZmllbGRzQXJyIiwiX3JlZl9vYmoiLCJhdXRvZm9ybV90eXBlIiwiZnMiLCJpc1VuTGltaXRlZCIsIm11bHRpcGxlIiwicm93cyIsImxhbmd1YWdlIiwiaXNNb2JpbGUiLCJpc1BhZCIsImFmRmllbGRJbnB1dCIsImRhdGVNb2JpbGVPcHRpb25zIiwib3V0Rm9ybWF0IiwidGltZXpvbmVJZCIsImR4RGF0ZUJveE9wdGlvbnMiLCJkaXNwbGF5Rm9ybWF0IiwiaGVpZ2h0IiwiZGlhbG9nc0luQm9keSIsInRvb2xiYXIiLCJmb250TmFtZXMiLCJkZXBlbmRPbiIsImRlcGVuZF9vbiIsImNyZWF0ZSIsImxvb2t1cF9maWVsZCIsIk1vZGFsIiwic2hvdyIsImZvcm1JZCIsIm9wZXJhdGlvbiIsIm9uU3VjY2VzcyIsInJlc3VsdCIsImFkZEl0ZW1zIiwicmVmZXJlbmNlX3NvcnQiLCJvcHRpb25zU29ydCIsInJlZmVyZW5jZV9saW1pdCIsIm9wdGlvbnNMaW1pdCIsIm9taXQiLCJpbmNsdWRlIiwiYmxhY2tib3giLCJvYmplY3RTd2l0Y2hlIiwib3B0aW9uc01ldGhvZCIsIm9wdGlvbnNNZXRob2RQYXJhbXMiLCJyZWZlcmVuY2VzIiwiX3JlZmVyZW5jZSIsImxpbmsiLCJkZWZhdWx0SWNvbiIsInNob3dJY29uIiwiZmlyc3RPcHRpb24iLCJwcmVjaXNpb24iLCJzY2FsZSIsImRlY2ltYWwiLCJBcnJheSIsImVkaXRhYmxlIiwiYWNjZXB0Iiwic3lzdGVtIiwiRW1haWwiLCJhbGxvd2VkVmFsdWVzIiwib3B0aW9uYWwiLCJ1bmlxdWUiLCJncm91cCIsImZpbHRlcmFibGUiLCJzZWFyY2hhYmxlIiwiaW5saW5lSGVscFRleHQiLCJpc1Byb2R1Y3Rpb24iLCJzb3J0YWJsZSIsImdldEZpZWxkRGlzcGxheVZhbHVlIiwiZmllbGRfdmFsdWUiLCJodG1sIiwibW9tZW50IiwidmFsIiwiZm9ybWF0IiwiY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5IiwiZmllbGRfdHlwZSIsInB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyIsIm9wZXJhdGlvbnMiLCJidWlsdGluVmFsdWVzIiwiZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMiLCJidWlsdGluSXRlbSIsImlzX2NoZWNrX29ubHkiLCJnZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMiLCJnZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSIsImdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uIiwiYmV0d2VlbkJ1aWx0aW5WYWx1ZXMiLCJnZXRRdWFydGVyU3RhcnRNb250aCIsIm1vbnRoIiwiZ2V0TW9udGgiLCJnZXRMYXN0UXVhcnRlckZpcnN0RGF5IiwieWVhciIsImdldEZ1bGxZZWFyIiwiZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSIsImdldE1vbnRoRGF5cyIsImRheXMiLCJlbmREYXRlIiwibWlsbGlzZWNvbmQiLCJzdGFydERhdGUiLCJnZXRMYXN0TW9udGhGaXJzdERheSIsImN1cnJlbnRNb250aCIsImN1cnJlbnRZZWFyIiwiZW5kVmFsdWUiLCJmaXJzdERheSIsImxhc3REYXkiLCJsYXN0TW9uZGF5IiwibGFzdE1vbnRoRmluYWxEYXkiLCJsYXN0TW9udGhGaXJzdERheSIsImxhc3RRdWFydGVyRW5kRGF5IiwibGFzdFF1YXJ0ZXJTdGFydERheSIsImxhc3RTdW5kYXkiLCJsYXN0XzEyMF9kYXlzIiwibGFzdF8zMF9kYXlzIiwibGFzdF82MF9kYXlzIiwibGFzdF83X2RheXMiLCJsYXN0XzkwX2RheXMiLCJtaW51c0RheSIsIm1vbmRheSIsIm5leHRNb25kYXkiLCJuZXh0TW9udGhGaW5hbERheSIsIm5leHRNb250aEZpcnN0RGF5IiwibmV4dFF1YXJ0ZXJFbmREYXkiLCJuZXh0UXVhcnRlclN0YXJ0RGF5IiwibmV4dFN1bmRheSIsIm5leHRZZWFyIiwibmV4dF8xMjBfZGF5cyIsIm5leHRfMzBfZGF5cyIsIm5leHRfNjBfZGF5cyIsIm5leHRfN19kYXlzIiwibmV4dF85MF9kYXlzIiwibm93IiwicHJldmlvdXNZZWFyIiwic3RhcnRWYWx1ZSIsInN0ckVuZERheSIsInN0ckZpcnN0RGF5Iiwic3RyTGFzdERheSIsInN0ck1vbmRheSIsInN0clN0YXJ0RGF5Iiwic3RyU3VuZGF5Iiwic3RyVG9kYXkiLCJzdHJUb21vcnJvdyIsInN0clllc3RkYXkiLCJzdW5kYXkiLCJ0aGlzUXVhcnRlckVuZERheSIsInRoaXNRdWFydGVyU3RhcnREYXkiLCJ0b21vcnJvdyIsIndlZWsiLCJ5ZXN0ZGF5IiwiZ2V0RGF5IiwiZnYiLCJzZXRIb3VycyIsImdldEhvdXJzIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJnZXRGaWVsZERlZmF1bHRPcGVyYXRpb24iLCJnZXRGaWVsZE9wZXJhdGlvbiIsIm9wdGlvbmFscyIsImVxdWFsIiwidW5lcXVhbCIsImxlc3NfdGhhbiIsImdyZWF0ZXJfdGhhbiIsImxlc3Nfb3JfZXF1YWwiLCJncmVhdGVyX29yX2VxdWFsIiwibm90X2NvbnRhaW4iLCJzdGFydHNfd2l0aCIsImJldHdlZW4iLCJnZXRPYmplY3RGaWVsZHNOYW1lIiwiZmllbGRzTmFtZSIsInNvcnRfbm8iLCJjbGVhblRyaWdnZXIiLCJpbml0VHJpZ2dlciIsIl90cmlnZ2VyX2hvb2tzIiwidG9kb1dyYXBwZXIiLCJhcHBseSIsImFyZ3VtZW50cyIsIndoZW4iLCJiZWZvcmUiLCJpbnNlcnQiLCJyZW1vdmUiLCJhZnRlciIsInJldmVyc2UiLCJfaG9vayIsInRyaWdnZXJfbmFtZSIsIl90cmlnZ2VyX2hvb2siLCJmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0IiwiZmluZF9wZXJtaXNzaW9uX29iamVjdCIsInVuaW9uUGx1cyIsImdldE9iamVjdFBlcm1pc3Npb25zIiwiZ2V0UmVjb3JkUGVybWlzc2lvbnMiLCJpc093bmVyIiwicmVjb3JkX2NvbXBhbnlfaWQiLCJ1c2VyX2NvbXBhbnlfaWRzIiwib3duZXIiLCJsb2NrZWQiLCJnZXRBbGxQZXJtaXNzaW9ucyIsIl9pIiwiaXNPcmdhbml6YXRpb25BZG1pbiIsImlzV29ya2Zsb3dBZG1pbiIsInBzZXRzIiwicHNldHNBZG1pbiIsInBzZXRzQWRtaW5fcG9zIiwicHNldHNDdXJyZW50IiwicHNldHNDdXJyZW50TmFtZXMiLCJwc2V0c0N1cnJlbnRfcG9zIiwicHNldHNHdWVzdCIsInBzZXRzR3Vlc3RfcG9zIiwicHNldHNNZW1iZXIiLCJwc2V0c01lbWJlcl9wb3MiLCJwc2V0c09yZ2FuaXphdGlvbkFkbWluIiwicHNldHNPcmdhbml6YXRpb25BZG1pbl9wb3MiLCJwc2V0c1VzZXIiLCJwc2V0c1VzZXJfcG9zIiwicHNldHNXb3JrZmxvd0FkbWluIiwicHNldHNXb3JrZmxvd0FkbWluX3BvcyIsInNldF9pZHMiLCJzcGFjZVVzZXIiLCJvYmplY3RzIiwiYXNzaWduZWRfYXBwcyIsInVzZXJzIiwicGVybWlzc2lvbl9zZXRfaWQiLCJjcmVhdGVkIiwibW9kaWZpZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWRfYnkiLCJwbHVjayIsInByb2ZpbGUiLCJnZXRBc3NpZ25lZEFwcHMiLCJiaW5kIiwiYXNzaWduZWRfbWVudXMiLCJnZXRBc3NpZ25lZE1lbnVzIiwidXNlcl9wZXJtaXNzaW9uX3NldHMiLCJhcnJheSIsIm90aGVyIiwiYXBwcyIsInBzZXRCYXNlIiwicHNldCIsInVuaXEiLCJhYm91dE1lbnUiLCJhZG1pbk1lbnVzIiwiYWxsTWVudXMiLCJjdXJyZW50UHNldE5hbWVzIiwibWVudXMiLCJvdGhlck1lbnVBcHBzIiwib3RoZXJNZW51cyIsImFkbWluX21lbnVzIiwibiIsImZsYXR0ZW4iLCJtZW51IiwicHNldHNNZW51IiwicGVybWlzc2lvbl9zZXRzIiwiaW50ZXJzZWN0aW9uIiwicGVybWlzc2lvbl9vYmplY3RzIiwiaXNOdWxsIiwicGVybWlzc2lvbl9zZXRfaWRzIiwib3BzZXRBZG1pbiIsIm9wc2V0R3Vlc3QiLCJvcHNldE1lbWJlciIsIm9wc2V0T3JnYW5pemF0aW9uQWRtaW4iLCJvcHNldFVzZXIiLCJvcHNldFdvcmtmbG93QWRtaW4iLCJwb3MiLCJwb3NBZG1pbiIsInBvc0d1ZXN0IiwicG9zTWVtYmVyIiwicG9zT3JnYW5pemF0aW9uQWRtaW4iLCJwb3NVc2VyIiwicG9zV29ya2Zsb3dBZG1pbiIsInByb2YiLCJndWVzdCIsIm1lbWJlciIsIndvcmtmbG93X2FkbWluIiwib3JnYW5pemF0aW9uX2FkbWluIiwiZGlzYWJsZWRfYWN0aW9ucyIsInVucmVsYXRlZF9vYmplY3RzIiwiY3JlYXRvcl9kYl91cmwiLCJvcGxvZ191cmwiLCJNT05HT19VUkxfQ1JFQVRPUiIsIk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SIiwiX0NSRUFUT1JfREFUQVNPVVJDRSIsIl9kcml2ZXIiLCJNb25nb0ludGVybmFscyIsIlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIiLCJvcGxvZ1VybCIsImNvbGxlY3Rpb25fa2V5IiwiQ29sbGVjdGlvbiIsImFjdGlvbl9uYW1lIiwiZXhlY3V0ZUFjdGlvbiIsIml0ZW1fZWxlbWVudCIsIm1vcmVBcmdzIiwidG9kb0FyZ3MiLCJvZGF0YSIsInNsaWNlIiwiY29uY2F0Iiwic2V0IiwiZGVmZXIiLCIkIiwiY2xpY2siLCJocmVmIiwiZ2V0T2JqZWN0VXJsIiwid2luZG93Iiwib3BlbiIsInJlY29yZF90aXRsZSIsImNhbGxfYmFjayIsInRleHQiLCJzd2FsIiwidGl0bGUiLCJzaG93Q2FuY2VsQnV0dG9uIiwiY29uZmlybUJ1dHRvblRleHQiLCJjYW5jZWxCdXR0b25UZXh0IiwiYXBwaWQiLCJkeERhdGFHcmlkSW5zdGFuY2UiLCJncmlkQ29udGFpbmVyIiwiZ3JpZE9iamVjdE5hbWVDbGFzcyIsImluZm8iLCJpc09wZW5lclJlbW92ZSIsInN1Y2Nlc3MiLCJvcGVuZXIiLCJkeFRyZWVMaXN0IiwiZHhEYXRhR3JpZCIsInJlZnJlc2giLCJUZW1wbGF0ZSIsImNyZWF0b3JfZ3JpZCIsImNsb3NlIiwiRmxvd1JvdXRlciIsImdvIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEtBQUNBLEVBQUQsR0FBTSxFQUFOOztBQUNBLElBQUksT0FBQUMsT0FBQSxvQkFBQUEsWUFBQSxJQUFKO0FBQ0MsT0FBQ0EsT0FBRCxHQUFXLEVBQVg7QUNFQTs7QUREREEsUUFBUUMsT0FBUixHQUFrQixFQUFsQjtBQUNBRCxRQUFRRSxXQUFSLEdBQXNCLEVBQXRCO0FBQ0FGLFFBQVFHLEtBQVIsR0FBZ0IsRUFBaEI7QUFDQUgsUUFBUUksSUFBUixHQUFlLEVBQWY7QUFDQUosUUFBUUssT0FBUixHQUFrQixFQUFsQjtBQUNBTCxRQUFRTSxJQUFSLEdBQWUsRUFBZjtBQUNBTixRQUFRTyxhQUFSLEdBQXdCLEVBQXhCLEM7Ozs7Ozs7Ozs7OztBRVRBLElBQUFDLENBQUEsRUFBQUMsV0FBQTs7QUFBQTtBQUNDQSxnQkFBY0MsUUFBUSxlQUFSLENBQWQ7O0FBQ0EsTUFBR0MsT0FBT0MsYUFBVjtBQUNDRCxXQUFPRSxPQUFQLENBQWU7QUFDZCxVQUFBQyxFQUFBOztBQUFBO0FDSUssZURISkwsWUFBWU0sSUFBWixFQ0dJO0FESkwsZUFBQUMsS0FBQTtBQUVNRixhQUFBRSxLQUFBO0FDS0QsZURKSkMsUUFBUUMsR0FBUixDQUFZSixFQUFaLENDSUk7QUFDRDtBRFRMO0FBSEY7QUFBQSxTQUFBRSxLQUFBO0FBUU1SLE1BQUFRLEtBQUE7QUFDTEMsVUFBUUMsR0FBUixDQUFZVixDQUFaO0FDU0EsQzs7Ozs7Ozs7Ozs7O0FDbEJELElBQUFXLEtBQUEsRUFBQUMsSUFBQTtBQUFBcEIsUUFBUXFCLElBQVIsR0FBZTtBQUNkQyxPQUFLLElBQUlDLFFBQVFDLFVBQVosRUFEUztBQUVkQyxVQUFRLElBQUlGLFFBQVFDLFVBQVo7QUFGTSxDQUFmO0FBS0F4QixRQUFRMEIsU0FBUixHQUFvQjtBQUNuQnRCLFFBQU0sRUFEYTtBQUVuQkgsV0FBUztBQUZVLENBQXBCO0FBS0FVLE9BQU9FLE9BQVAsQ0FBZTtBQUNkYyxlQUFhQyxhQUFiLENBQTJCO0FBQUNDLHFCQUFpQkMsTUFBTUMsUUFBTixDQUFlRCxNQUFNRSxLQUFOLENBQVlDLFFBQVosRUFBc0JDLE1BQXRCLENBQWY7QUFBbEIsR0FBM0I7QUFDQVAsZUFBYUMsYUFBYixDQUEyQjtBQUFDTyxxQkFBaUJMLE1BQU1DLFFBQU4sQ0FBZUQsTUFBTUUsS0FBTixDQUFZQyxRQUFaLEVBQXNCQyxNQUF0QixDQUFmO0FBQWxCLEdBQTNCO0FDT0MsU0RORFAsYUFBYUMsYUFBYixDQUEyQjtBQUFDUSxvQkFBZ0JOLE1BQU1DLFFBQU4sQ0FBZUQsTUFBTUUsS0FBTixDQUFZQyxRQUFaLEVBQXNCQyxNQUF0QixDQUFmO0FBQWpCLEdBQTNCLENDTUM7QURURjs7QUFNQSxJQUFHdkIsT0FBTzBCLFFBQVY7QUFDQ2xCLFVBQVFULFFBQVEsUUFBUixDQUFSOztBQUNBVixVQUFRc0MsZ0JBQVIsR0FBMkIsVUFBQ0MsR0FBRCxFQUFNQyxXQUFOO0FDU3hCLFdEUkZyQixNQUFNO0FDU0YsYURSSG5CLFFBQVF5QyxXQUFSLENBQW9CRixHQUFwQixFQUF5QkMsV0FBekIsQ0NRRztBRFRKLE9BRUVFLEdBRkYsRUNRRTtBRFR3QixHQUEzQjtBQ2FBOztBRFJEMUMsUUFBUXlDLFdBQVIsR0FBc0IsVUFBQ0YsR0FBRCxFQUFNQyxXQUFOO0FBQ3JCLE1BQUcsQ0FBQ0EsV0FBSjtBQUNDQSxrQkFBY0QsSUFBSUksSUFBbEI7QUNXQzs7QURURixNQUFHLENBQUNKLElBQUlLLFVBQVI7QUFDQ0wsUUFBSUssVUFBSixHQUFpQixFQUFqQjtBQ1dDOztBRFRGLE1BQUdMLElBQUlNLEtBQVA7QUFDQ0wsa0JBQWMsT0FBT0QsSUFBSU0sS0FBWCxHQUFtQixHQUFuQixHQUF5Qk4sSUFBSUksSUFBM0M7QUNXQzs7QURURjNDLFVBQVE4QyxhQUFSLENBQXNCUCxHQUF0QjtBQUNBLE1BQUl2QyxRQUFRK0MsTUFBWixDQUFtQlIsR0FBbkI7QUFFQXZDLFVBQVFnRCxZQUFSLENBQXFCUixXQUFyQjtBQUNBeEMsVUFBUWlELGFBQVIsQ0FBc0JULFdBQXRCO0FBQ0EsU0FBT0QsR0FBUDtBQWZxQixDQUF0Qjs7QUFpQkF2QyxRQUFRa0QsYUFBUixHQUF3QixVQUFDekIsTUFBRDtBQUN2QixNQUFHQSxPQUFPb0IsS0FBVjtBQUNDLFdBQU8sT0FBS3BCLE9BQU9vQixLQUFaLEdBQWtCLEdBQWxCLEdBQXFCcEIsT0FBT2tCLElBQW5DO0FDV0M7O0FEVkYsU0FBT2xCLE9BQU9rQixJQUFkO0FBSHVCLENBQXhCOztBQUtBM0MsUUFBUW1ELFNBQVIsR0FBb0IsVUFBQ1gsV0FBRCxFQUFjWSxRQUFkO0FBQ25CLE1BQUFiLEdBQUEsRUFBQWMsR0FBQSxFQUFBQyxJQUFBOztBQUFBLE1BQUdDLEVBQUVDLE9BQUYsQ0FBVWhCLFdBQVYsQ0FBSDtBQUNDO0FDY0M7O0FEYkYsTUFBRzdCLE9BQU84QyxRQUFWO0FDZUcsUUFBSSxDQUFDSixNQUFNckQsUUFBUXFCLElBQWYsS0FBd0IsSUFBNUIsRUFBa0M7QUFDaEMsVUFBSSxDQUFDaUMsT0FBT0QsSUFBSTVCLE1BQVosS0FBdUIsSUFBM0IsRUFBaUM7QUFDL0I2QixhRGhCZ0JJLE1DZ0JoQjtBQUNEO0FEbEJOO0FDb0JFOztBRGxCRixNQUFHLENBQUNsQixXQUFELElBQWlCN0IsT0FBTzhDLFFBQTNCO0FBQ0NqQixrQkFBY21CLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUNvQkM7O0FEbkJGLE1BQUcsQ0FBQ1IsUUFBRCxJQUFhWixXQUFoQjtBQUNDLFFBQUc3QixPQUFPOEMsUUFBUCxJQUFtQixDQUFDakIsWUFBWXFCLFVBQVosQ0FBdUIsSUFBdkIsQ0FBdkI7QUFDQ1QsaUJBQVdPLFFBQVFDLEdBQVIsQ0FBWSxTQUFaLENBQVg7QUFGRjtBQ3dCRTs7QURwQkYsTUFBR3BCLFdBQUg7QUFDQyxRQUFHWSxRQUFIO0FBQ0NiLFlBQU12QyxRQUFROEQsYUFBUixDQUFzQixPQUFLVixRQUFMLEdBQWMsR0FBZCxHQUFpQlosV0FBdkMsQ0FBTjs7QUFDQSxVQUFHRCxHQUFIO0FBQ0MsZUFBT0EsR0FBUDtBQUhGO0FDMEJHOztBRHJCSEEsVUFBTWdCLEVBQUVRLElBQUYsQ0FBTy9ELFFBQVE4RCxhQUFmLEVBQThCLFVBQUNFLENBQUQ7QUFDbEMsYUFBT0EsRUFBRUMsZ0JBQUYsS0FBc0J6QixXQUE3QjtBQURJLE1BQU47O0FBRUEsUUFBR0QsR0FBSDtBQUNDLGFBQU9BLEdBQVA7QUN3QkU7O0FEdEJILFdBQU92QyxRQUFROEQsYUFBUixDQUFzQnRCLFdBQXRCLENBQVA7QUN3QkM7QUQ5Q2lCLENBQXBCOztBQXdCQXhDLFFBQVFrRSxhQUFSLEdBQXdCLFVBQUNDLFNBQUQ7QUFDdkIsU0FBT1osRUFBRWEsU0FBRixDQUFZcEUsUUFBUThELGFBQXBCLEVBQW1DO0FBQUNPLFNBQUtGO0FBQU4sR0FBbkMsQ0FBUDtBQUR1QixDQUF4Qjs7QUFHQW5FLFFBQVFzRSxZQUFSLEdBQXVCLFVBQUM5QixXQUFEO0FBQ3RCdkIsVUFBUUMsR0FBUixDQUFZLGNBQVosRUFBNEJzQixXQUE1QjtBQUNBLFNBQU94QyxRQUFRQyxPQUFSLENBQWdCdUMsV0FBaEIsQ0FBUDtBQzZCQyxTRDVCRCxPQUFPeEMsUUFBUThELGFBQVIsQ0FBc0J0QixXQUF0QixDQzRCTjtBRC9CcUIsQ0FBdkI7O0FBS0F4QyxRQUFRdUUsYUFBUixHQUF3QixVQUFDL0IsV0FBRCxFQUFjZ0MsT0FBZDtBQUN2QixNQUFBbkIsR0FBQTs7QUFBQSxNQUFHLENBQUNiLFdBQUo7QUFDQ0Esa0JBQWNtQixRQUFRQyxHQUFSLENBQVksYUFBWixDQUFkO0FDK0JDOztBRDlCRixNQUFHcEIsV0FBSDtBQUNDLFdBQU94QyxRQUFRRSxXQUFSLENBQW9CLENBQUFtRCxNQUFBckQsUUFBQW1ELFNBQUEsQ0FBQVgsV0FBQSxFQUFBZ0MsT0FBQSxhQUFBbkIsSUFBeUNZLGdCQUF6QyxHQUF5QyxNQUE3RCxDQUFQO0FDZ0NDO0FEcENxQixDQUF4Qjs7QUFNQWpFLFFBQVF5RSxnQkFBUixHQUEyQixVQUFDakMsV0FBRDtBQ2tDekIsU0RqQ0QsT0FBT3hDLFFBQVFFLFdBQVIsQ0FBb0JzQyxXQUFwQixDQ2lDTjtBRGxDeUIsQ0FBM0I7O0FBR0F4QyxRQUFRMEUsWUFBUixHQUF1QixVQUFDRixPQUFELEVBQVVHLE1BQVY7QUFDdEIsTUFBQXRCLEdBQUEsRUFBQUMsSUFBQSxFQUFBVCxLQUFBOztBQUFBLE1BQUdsQyxPQUFPOEMsUUFBVjtBQUNDLFFBQUcsQ0FBQ2UsT0FBSjtBQUNDQSxnQkFBVWIsUUFBUUMsR0FBUixDQUFZLFNBQVosQ0FBVjtBQ29DRTs7QURuQ0gsUUFBRyxDQUFDZSxNQUFKO0FBQ0NBLGVBQVNoRSxPQUFPZ0UsTUFBUCxFQUFUO0FBSkY7QUMwQ0U7O0FEcENGOUIsVUFBQSxDQUFBUSxNQUFBckQsUUFBQW1ELFNBQUEsdUJBQUFHLE9BQUFELElBQUF0RCxFQUFBLFlBQUF1RCxLQUF5Q3NCLE9BQXpDLENBQWlESixPQUFqRCxJQUFRLE1BQVIsR0FBUSxNQUFSOztBQUNBLE1BQUEzQixTQUFBLE9BQUdBLE1BQU9nQyxNQUFWLEdBQVUsTUFBVjtBQUNDLFdBQU9oQyxNQUFNZ0MsTUFBTixDQUFhQyxPQUFiLENBQXFCSCxNQUFyQixLQUFnQyxDQUF2QztBQ3NDQztBRC9Db0IsQ0FBdkI7O0FBWUEzRSxRQUFRK0UsZUFBUixHQUEwQixVQUFDQyxRQUFELEVBQVdDLE9BQVgsRUFBb0JDLE9BQXBCO0FBRXpCLE1BQUcsQ0FBQzNCLEVBQUU0QixRQUFGLENBQVdILFFBQVgsQ0FBSjtBQUNDLFdBQU9BLFFBQVA7QUNzQ0M7O0FEcENGLE1BQUdoRixRQUFRb0YsUUFBUixDQUFpQkMsWUFBakIsQ0FBOEJMLFFBQTlCLENBQUg7QUFDQyxXQUFPaEYsUUFBUW9GLFFBQVIsQ0FBaUIxQyxHQUFqQixDQUFxQnNDLFFBQXJCLEVBQStCQyxPQUEvQixFQUF3Q0MsT0FBeEMsQ0FBUDtBQ3NDQzs7QURwQ0YsU0FBT0YsUUFBUDtBQVJ5QixDQUExQjs7QUFVQWhGLFFBQVFzRixlQUFSLEdBQTBCLFVBQUNDLE9BQUQsRUFBVU4sT0FBVjtBQUN6QixNQUFBTyxRQUFBO0FBQUFBLGFBQVcsRUFBWDs7QUFDQWpDLElBQUVrQyxJQUFGLENBQU9GLE9BQVAsRUFBZ0IsVUFBQ0csTUFBRDtBQUNmLFFBQUFDLE1BQUEsRUFBQWhELElBQUEsRUFBQWlELEtBQUE7O0FBQUEsU0FBQUYsVUFBQSxPQUFHQSxPQUFRRyxNQUFYLEdBQVcsTUFBWCxNQUFxQixDQUFyQjtBQUNDbEQsYUFBTytDLE9BQU8sQ0FBUCxDQUFQO0FBQ0FDLGVBQVNELE9BQU8sQ0FBUCxDQUFUO0FBQ0FFLGNBQVE1RixRQUFRK0UsZUFBUixDQUF3QlcsT0FBTyxDQUFQLENBQXhCLEVBQW1DVCxPQUFuQyxDQUFSO0FBQ0FPLGVBQVM3QyxJQUFULElBQWlCLEVBQWpCO0FDeUNHLGFEeENINkMsU0FBUzdDLElBQVQsRUFBZWdELE1BQWYsSUFBeUJDLEtDd0N0QjtBQUNEO0FEL0NKOztBQU9BM0UsVUFBUUMsR0FBUixDQUFZLDRCQUFaLEVBQTBDc0UsUUFBMUM7QUFDQSxTQUFPQSxRQUFQO0FBVnlCLENBQTFCOztBQVlBeEYsUUFBUThGLGFBQVIsR0FBd0IsVUFBQ3RCLE9BQUQ7QUFDdkIsU0FBT0EsWUFBVyxRQUFsQjtBQUR1QixDQUF4QixDLENBR0E7Ozs7Ozs7QUFNQXhFLFFBQVErRixrQkFBUixHQUE2QixVQUFDQyxJQUFELEVBQU9DLEdBQVAsRUFBWUMsTUFBWixFQUFvQkMsU0FBcEI7QUFFNUIsTUFBQUMsTUFBQTs7QUFBQSxNQUFHLENBQUNGLE1BQUo7QUFDQ0EsYUFBUyxLQUFUO0FDK0NDOztBRDdDRixNQUFHQyxTQUFIO0FBR0NDLGFBQVNKLEtBQUtLLFdBQUwsQ0FBaUJILE1BQWpCLENBQVQ7QUFFQSxXQUFPM0MsRUFBRStDLE1BQUYsQ0FBU04sSUFBVCxFQUFlLFVBQUNPLEdBQUQ7QUFDbkIsVUFBQUMsTUFBQTs7QUFBQUEsZUFBU1AsSUFBSW5CLE9BQUosQ0FBWXlCLElBQUlMLE1BQUosQ0FBWixDQUFUOztBQUNBLFVBQUdNLFNBQVMsQ0FBQyxDQUFiO0FBQ0MsZUFBT0EsTUFBUDtBQUREO0FBR0MsZUFBT1AsSUFBSUosTUFBSixHQUFhdEMsRUFBRXVCLE9BQUYsQ0FBVXNCLE1BQVYsRUFBa0JHLElBQUlMLE1BQUosQ0FBbEIsQ0FBcEI7QUM2Q0M7QURsREUsTUFBUDtBQUxEO0FBWUMsV0FBTzNDLEVBQUUrQyxNQUFGLENBQVNOLElBQVQsRUFBZSxVQUFDTyxHQUFEO0FBQ3JCLGFBQU9OLElBQUluQixPQUFKLENBQVl5QixJQUFJTCxNQUFKLENBQVosQ0FBUDtBQURNLE1BQVA7QUNpREM7QURsRTBCLENBQTdCLEMsQ0FvQkE7Ozs7O0FBSUFsRyxRQUFReUcsYUFBUixHQUF3QixVQUFDQyxNQUFELEVBQVNDLE1BQVQ7QUFDdkIsTUFBQUMsYUFBQSxFQUFBQyxhQUFBLEVBQUFDLE1BQUE7O0FBQUEsTUFBRyxLQUFLQyxHQUFSO0FBQ0NMLGFBQVNBLE9BQU8sS0FBS0ssR0FBWixDQUFUO0FBQ0FKLGFBQVNBLE9BQU8sS0FBS0ksR0FBWixDQUFUO0FDcURDOztBRHBERixNQUFHTCxrQkFBa0JNLElBQXJCO0FBQ0NOLGFBQVNBLE9BQU9PLE9BQVAsRUFBVDtBQ3NEQzs7QURyREYsTUFBR04sa0JBQWtCSyxJQUFyQjtBQUNDTCxhQUFTQSxPQUFPTSxPQUFQLEVBQVQ7QUN1REM7O0FEdERGLE1BQUcsT0FBT1AsTUFBUCxLQUFpQixRQUFqQixJQUE4QixPQUFPQyxNQUFQLEtBQWlCLFFBQWxEO0FBQ0MsV0FBT0QsU0FBU0MsTUFBaEI7QUN3REM7O0FEdERGQyxrQkFBZ0JGLFdBQVUsSUFBVixJQUFrQkEsV0FBVSxNQUE1QztBQUNBRyxrQkFBZ0JGLFdBQVUsSUFBVixJQUFrQkEsV0FBVSxNQUE1Qzs7QUFDQSxNQUFHQyxpQkFBa0IsQ0FBQ0MsYUFBdEI7QUFDQyxXQUFPLENBQUMsQ0FBUjtBQ3dEQzs7QUR2REYsTUFBR0QsaUJBQWtCQyxhQUFyQjtBQUNDLFdBQU8sQ0FBUDtBQ3lEQzs7QUR4REYsTUFBRyxDQUFDRCxhQUFELElBQW1CQyxhQUF0QjtBQUNDLFdBQU8sQ0FBUDtBQzBEQzs7QUR6REZDLFdBQVNJLFFBQVFKLE1BQVIsRUFBVDtBQUNBLFNBQU9KLE9BQU9TLFFBQVAsR0FBa0JDLGFBQWxCLENBQWdDVCxPQUFPUSxRQUFQLEVBQWhDLEVBQW1ETCxNQUFuRCxDQUFQO0FBcEJ1QixDQUF4Qjs7QUF3QkE5RyxRQUFRcUgsaUJBQVIsR0FBNEIsVUFBQzdFLFdBQUQ7QUFDM0IsTUFBQThFLE9BQUEsRUFBQUMsV0FBQSxFQUFBQyxlQUFBOztBQUFBLE1BQUc3RyxPQUFPOEMsUUFBVjtBQUNDLFFBQUcsQ0FBQ2pCLFdBQUo7QUFDQ0Esb0JBQWNtQixRQUFRQyxHQUFSLENBQVksYUFBWixDQUFkO0FBRkY7QUM4REU7O0FEMURGNEQsb0JBQWtCLEVBQWxCO0FBR0FGLFlBQVV0SCxRQUFRQyxPQUFSLENBQWdCdUMsV0FBaEIsQ0FBVjs7QUFDQSxNQUFHLENBQUM4RSxPQUFKO0FBQ0MsV0FBT0UsZUFBUDtBQzBEQzs7QUR4REYsTUFBR0YsUUFBUUcsWUFBWDtBQUNDRCxvQkFBZ0JFLElBQWhCLENBQXFCO0FBQUNsRixtQkFBWSxXQUFiO0FBQTBCbUYsbUJBQWE7QUFBdkMsS0FBckI7QUM2REM7O0FEM0RGcEUsSUFBRWtDLElBQUYsQ0FBT3pGLFFBQVFDLE9BQWYsRUFBd0IsVUFBQzJILGNBQUQsRUFBaUJDLG1CQUFqQjtBQzZEckIsV0Q1REZ0RSxFQUFFa0MsSUFBRixDQUFPbUMsZUFBZUUsTUFBdEIsRUFBOEIsVUFBQ0MsYUFBRCxFQUFnQkMsa0JBQWhCO0FBQzdCLFVBQUdELGNBQWNFLElBQWQsS0FBc0IsZUFBdEIsSUFBMENGLGNBQWNHLFlBQXhELElBQXlFSCxjQUFjRyxZQUFkLEtBQThCMUYsV0FBMUc7QUFDQyxZQUFHcUYsd0JBQXVCLGVBQTFCO0FDNkRNLGlCRDNETEwsZ0JBQWdCVyxNQUFoQixDQUF1QixDQUF2QixFQUEwQixDQUExQixFQUE2QjtBQUFDM0YseUJBQVlxRixtQkFBYjtBQUFrQ0YseUJBQWFLO0FBQS9DLFdBQTdCLENDMkRLO0FEN0ROO0FDa0VNLGlCRDlETFIsZ0JBQWdCRSxJQUFoQixDQUFxQjtBQUFDbEYseUJBQVlxRixtQkFBYjtBQUFrQ0YseUJBQWFLO0FBQS9DLFdBQXJCLENDOERLO0FEbkVQO0FDd0VJO0FEekVMLE1DNERFO0FEN0RIOztBQVNBLE1BQUdWLFFBQVFjLFlBQVg7QUFDQ1osb0JBQWdCRSxJQUFoQixDQUFxQjtBQUFDbEYsbUJBQVksT0FBYjtBQUFzQm1GLG1CQUFhO0FBQW5DLEtBQXJCO0FDd0VDOztBRHZFRixNQUFHTCxRQUFRZSxZQUFYO0FBQ0NiLG9CQUFnQkUsSUFBaEIsQ0FBcUI7QUFBQ2xGLG1CQUFZLE9BQWI7QUFBc0JtRixtQkFBYTtBQUFuQyxLQUFyQjtBQzRFQzs7QUQzRUYsTUFBR0wsUUFBUWdCLGFBQVg7QUFDQ2Qsb0JBQWdCRSxJQUFoQixDQUFxQjtBQUFDbEYsbUJBQVksUUFBYjtBQUF1Qm1GLG1CQUFhO0FBQXBDLEtBQXJCO0FDZ0ZDOztBRC9FRixNQUFHTCxRQUFRaUIsZ0JBQVg7QUFDQ2Ysb0JBQWdCRSxJQUFoQixDQUFxQjtBQUFDbEYsbUJBQVksV0FBYjtBQUEwQm1GLG1CQUFhO0FBQXZDLEtBQXJCO0FDb0ZDOztBRG5GRixNQUFHTCxRQUFRa0IsZ0JBQVg7QUFDQ2hCLG9CQUFnQkUsSUFBaEIsQ0FBcUI7QUFBQ2xGLG1CQUFZLFdBQWI7QUFBMEJtRixtQkFBYTtBQUF2QyxLQUFyQjtBQ3dGQzs7QUR0RkYsTUFBR2hILE9BQU84QyxRQUFWO0FBQ0M4RCxrQkFBY3ZILFFBQVF5SSxjQUFSLENBQXVCakcsV0FBdkIsQ0FBZDs7QUFDQSxRQUFHOEUsUUFBUW9CLFlBQVIsS0FBQW5CLGVBQUEsT0FBd0JBLFlBQWFvQixnQkFBckMsR0FBcUMsTUFBckMsQ0FBSDtBQUNDbkIsc0JBQWdCRSxJQUFoQixDQUFxQjtBQUFDbEYscUJBQVksZUFBYjtBQUE4Qm1GLHFCQUFhO0FBQTNDLE9BQXJCO0FBSEY7QUMrRkU7O0FEMUZGLFNBQU9ILGVBQVA7QUF4QzJCLENBQTVCOztBQTBDQXhILFFBQVE0SSxjQUFSLEdBQXlCLFVBQUNqRSxNQUFELEVBQVNILE9BQVQsRUFBa0JxRSxZQUFsQjtBQUN4QixNQUFBQyxZQUFBLEVBQUF6RixHQUFBLEVBQUEwRixjQUFBLEVBQUFDLEVBQUEsRUFBQUMsUUFBQTs7QUFBQSxNQUFHdEksT0FBTzhDLFFBQVY7QUFDQyxXQUFPekQsUUFBUThJLFlBQWY7QUFERDtBQUdDLFFBQUcsRUFBRW5FLFVBQVdILE9BQWIsQ0FBSDtBQUNDLFlBQU0sSUFBSTdELE9BQU91SSxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLG1GQUF0QixDQUFOO0FBQ0EsYUFBTyxJQUFQO0FDOEZFOztBRDdGSEQsZUFBVztBQUFDdEcsWUFBTSxDQUFQO0FBQVV3RyxjQUFRLENBQWxCO0FBQXFCQyxnQkFBVSxDQUEvQjtBQUFrQ0MsYUFBTyxDQUF6QztBQUE0Q0MsZUFBUyxDQUFyRDtBQUF3REMsb0JBQWMsQ0FBdEU7QUFBeUUxRyxhQUFPLENBQWhGO0FBQW1GMkcsa0JBQVksQ0FBL0Y7QUFBa0dDLG1CQUFhO0FBQS9HLEtBQVg7QUFFQVQsU0FBS2hKLFFBQVFFLFdBQVIsQ0FBb0IsYUFBcEIsRUFBbUMwRSxPQUFuQyxDQUEyQztBQUFDL0IsYUFBTzJCLE9BQVI7QUFBaUJrRixZQUFNL0U7QUFBdkIsS0FBM0MsRUFBMkU7QUFBQ21ELGNBQVFtQjtBQUFULEtBQTNFLENBQUw7O0FBQ0EsUUFBRyxDQUFDRCxFQUFKO0FBQ0N4RSxnQkFBVSxJQUFWO0FDNkdFOztBRDFHSCxRQUFHLENBQUNBLE9BQUo7QUFDQyxVQUFHcUUsWUFBSDtBQUNDRyxhQUFLaEosUUFBUUUsV0FBUixDQUFvQixhQUFwQixFQUFtQzBFLE9BQW5DLENBQTJDO0FBQUM4RSxnQkFBTS9FO0FBQVAsU0FBM0MsRUFBMkQ7QUFBQ21ELGtCQUFRbUI7QUFBVCxTQUEzRCxDQUFMOztBQUNBLFlBQUcsQ0FBQ0QsRUFBSjtBQUNDLGlCQUFPLElBQVA7QUNnSEk7O0FEL0dMeEUsa0JBQVV3RSxHQUFHbkcsS0FBYjtBQUpEO0FBTUMsZUFBTyxJQUFQO0FBUEY7QUN5SEc7O0FEaEhIaUcsbUJBQWUsRUFBZjtBQUNBQSxpQkFBYW5FLE1BQWIsR0FBc0JBLE1BQXRCO0FBQ0FtRSxpQkFBYXRFLE9BQWIsR0FBdUJBLE9BQXZCO0FBQ0FzRSxpQkFBYVksSUFBYixHQUFvQjtBQUNuQnJGLFdBQUtNLE1BRGM7QUFFbkJoQyxZQUFNcUcsR0FBR3JHLElBRlU7QUFHbkJ3RyxjQUFRSCxHQUFHRyxNQUhRO0FBSW5CQyxnQkFBVUosR0FBR0ksUUFKTTtBQUtuQkMsYUFBT0wsR0FBR0ssS0FMUztBQU1uQkMsZUFBU04sR0FBR00sT0FOTztBQU9uQkUsa0JBQVlSLEdBQUdRLFVBUEk7QUFRbkJDLG1CQUFhVCxHQUFHUztBQVJHLEtBQXBCO0FBVUFWLHFCQUFBLENBQUExRixNQUFBckQsUUFBQXVFLGFBQUEsNkJBQUFsQixJQUF5RHVCLE9BQXpELENBQWlFb0UsR0FBR08sWUFBcEUsSUFBaUIsTUFBakI7O0FBQ0EsUUFBR1IsY0FBSDtBQUNDRCxtQkFBYVksSUFBYixDQUFrQkgsWUFBbEIsR0FBaUM7QUFDaENsRixhQUFLMEUsZUFBZTFFLEdBRFk7QUFFaEMxQixjQUFNb0csZUFBZXBHLElBRlc7QUFHaENnSCxrQkFBVVosZUFBZVk7QUFITyxPQUFqQztBQ3NIRTs7QURqSEgsV0FBT2IsWUFBUDtBQ21IQztBRDlKc0IsQ0FBekI7O0FBNkNBOUksUUFBUTRKLGNBQVIsR0FBeUIsVUFBQ0MsR0FBRDtBQUN4QixNQUFHQSxHQUFIO0FBRUMsUUFBRyxDQUFDLE1BQU1DLElBQU4sQ0FBV0QsR0FBWCxDQUFKO0FBQ0NBLFlBQU0sTUFBTUEsR0FBWjtBQ29IRTs7QURuSEgsV0FBT0UsMEJBQTBCQyxvQkFBMUIsR0FBaURILEdBQXhEO0FBSkQ7QUFNQyxXQUFPRSwwQkFBMEJDLG9CQUFqQztBQ3FIQztBRDVIc0IsQ0FBekI7O0FBU0FoSyxRQUFRaUssZ0JBQVIsR0FBMkIsVUFBQ3RGLE1BQUQsRUFBU0gsT0FBVDtBQUMxQixNQUFBd0UsRUFBQTtBQUFBckUsV0FBU0EsVUFBVWhFLE9BQU9nRSxNQUFQLEVBQW5COztBQUNBLE1BQUdoRSxPQUFPOEMsUUFBVjtBQUNDZSxjQUFVQSxXQUFXYixRQUFRQyxHQUFSLENBQVksU0FBWixDQUFyQjtBQUREO0FBR0MsUUFBRyxDQUFDWSxPQUFKO0FBQ0MsWUFBTSxJQUFJN0QsT0FBT3VJLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsY0FBdEIsQ0FBTjtBQUpGO0FDNkhFOztBRHhIRkYsT0FBS2hKLFFBQVF1RSxhQUFSLENBQXNCLGFBQXRCLEVBQXFDSyxPQUFyQyxDQUE2QztBQUFDL0IsV0FBTzJCLE9BQVI7QUFBaUJrRixVQUFNL0U7QUFBdkIsR0FBN0MsRUFBNkU7QUFBQ21ELFlBQVE7QUFBQzBCLGtCQUFXO0FBQVo7QUFBVCxHQUE3RSxDQUFMO0FBQ0EsU0FBT1IsR0FBR1EsVUFBVjtBQVIwQixDQUEzQjs7QUFVQXhKLFFBQVFrSyxpQkFBUixHQUE0QixVQUFDdkYsTUFBRCxFQUFTSCxPQUFUO0FBQzNCLE1BQUF3RSxFQUFBO0FBQUFyRSxXQUFTQSxVQUFVaEUsT0FBT2dFLE1BQVAsRUFBbkI7O0FBQ0EsTUFBR2hFLE9BQU84QyxRQUFWO0FBQ0NlLGNBQVVBLFdBQVdiLFFBQVFDLEdBQVIsQ0FBWSxTQUFaLENBQXJCO0FBREQ7QUFHQyxRQUFHLENBQUNZLE9BQUo7QUFDQyxZQUFNLElBQUk3RCxPQUFPdUksS0FBWCxDQUFpQixHQUFqQixFQUFzQixjQUF0QixDQUFOO0FBSkY7QUN3SUU7O0FEbklGRixPQUFLaEosUUFBUXVFLGFBQVIsQ0FBc0IsYUFBdEIsRUFBcUNLLE9BQXJDLENBQTZDO0FBQUMvQixXQUFPMkIsT0FBUjtBQUFpQmtGLFVBQU0vRTtBQUF2QixHQUE3QyxFQUE2RTtBQUFDbUQsWUFBUTtBQUFDMkIsbUJBQVk7QUFBYjtBQUFULEdBQTdFLENBQUw7QUFDQSxTQUFBVCxNQUFBLE9BQU9BLEdBQUlTLFdBQVgsR0FBVyxNQUFYO0FBUjJCLENBQTVCOztBQVVBekosUUFBUW1LLGtCQUFSLEdBQTZCLFVBQUNDLEVBQUQ7QUFDNUIsTUFBR0EsR0FBR0MsV0FBTjtBQUNDRCxPQUFHRSxTQUFILEdBQWUsSUFBZjtBQzZJQzs7QUQ1SUYsTUFBR0YsR0FBR0csU0FBTjtBQUNDSCxPQUFHRSxTQUFILEdBQWUsSUFBZjtBQzhJQzs7QUQ3SUYsTUFBR0YsR0FBR0ksV0FBTjtBQUNDSixPQUFHRyxTQUFILEdBQWUsSUFBZjtBQUNBSCxPQUFHRSxTQUFILEdBQWUsSUFBZjtBQytJQzs7QUQ5SUYsTUFBR0YsR0FBR0ssY0FBTjtBQUNDTCxPQUFHRSxTQUFILEdBQWUsSUFBZjtBQ2dKQzs7QUQvSUYsTUFBR0YsR0FBR3pCLGdCQUFOO0FBQ0N5QixPQUFHRSxTQUFILEdBQWUsSUFBZjtBQUNBRixPQUFHRyxTQUFILEdBQWUsSUFBZjtBQUNBSCxPQUFHSSxXQUFILEdBQWlCLElBQWpCO0FBQ0FKLE9BQUdLLGNBQUgsR0FBb0IsSUFBcEI7QUNpSkM7O0FEaEpGLE1BQUdMLEdBQUdNLGtCQUFOO0FBQ0NOLE9BQUdFLFNBQUgsR0FBZSxJQUFmO0FDa0pDOztBRGpKRixNQUFHRixHQUFHTyxvQkFBTjtBQUNDUCxPQUFHRSxTQUFILEdBQWUsSUFBZjtBQUNBRixPQUFHRyxTQUFILEdBQWUsSUFBZjtBQUNBSCxPQUFHSSxXQUFILEdBQWlCLElBQWpCO0FBQ0FKLE9BQUdNLGtCQUFILEdBQXdCLElBQXhCO0FDbUpDOztBRGxKRixTQUFPTixFQUFQO0FBdEI0QixDQUE3Qjs7QUF3QkEsSUFBR3pKLE9BQU8wQixRQUFWO0FBQ0MsTUFBR3VJLFFBQVFDLEdBQVIsQ0FBWUMsbUJBQWY7QUFDQzlLLFlBQVErSyxpQkFBUixHQUE0QkgsUUFBUUMsR0FBUixDQUFZQyxtQkFBeEM7QUFERDtBQUdDMUosV0FBT1YsUUFBUSxNQUFSLENBQVA7QUFDQVYsWUFBUStLLGlCQUFSLEdBQTRCM0osS0FBSzRKLE9BQUwsQ0FBYTVKLEtBQUs2SixJQUFMLENBQVVDLHFCQUFxQkMsU0FBL0IsRUFBMEMsY0FBMUMsQ0FBYixDQUE1QjtBQUxGO0FDMkpDLEM7Ozs7Ozs7Ozs7OztBQ3hkRHhLLE9BQU95SyxPQUFQLENBRUM7QUFBQSw0QkFBMEIsVUFBQ2xHLE9BQUQ7QUFDekIsUUFBQW1HLFVBQUEsRUFBQTdLLENBQUEsRUFBQThLLGNBQUEsRUFBQTdKLE1BQUEsRUFBQThKLGFBQUEsRUFBQUMsS0FBQSxFQUFBQyxhQUFBLEVBQUFDLE9BQUEsRUFBQXJJLEdBQUEsRUFBQUMsSUFBQSxFQUFBcUksT0FBQSxFQUFBQyxlQUFBLEVBQUFDLFFBQUEsRUFBQUMsSUFBQTs7QUFBQSxRQUFBNUcsV0FBQSxRQUFBN0IsTUFBQTZCLFFBQUE2RyxNQUFBLFlBQUExSSxJQUFvQjZFLFlBQXBCLEdBQW9CLE1BQXBCLEdBQW9CLE1BQXBCO0FBRUN6RyxlQUFTekIsUUFBUW1ELFNBQVIsQ0FBa0IrQixRQUFRNkcsTUFBUixDQUFlN0QsWUFBakMsRUFBK0NoRCxRQUFRNkcsTUFBUixDQUFlbEosS0FBOUQsQ0FBVDtBQUVBeUksdUJBQWlCN0osT0FBT3VLLGNBQXhCO0FBRUFSLGNBQVEsRUFBUjs7QUFDQSxVQUFHdEcsUUFBUTZHLE1BQVIsQ0FBZWxKLEtBQWxCO0FBQ0MySSxjQUFNM0ksS0FBTixHQUFjcUMsUUFBUTZHLE1BQVIsQ0FBZWxKLEtBQTdCO0FBRUFpSixlQUFBNUcsV0FBQSxPQUFPQSxRQUFTNEcsSUFBaEIsR0FBZ0IsTUFBaEI7QUFFQUQsbUJBQUEsQ0FBQTNHLFdBQUEsT0FBV0EsUUFBUzJHLFFBQXBCLEdBQW9CLE1BQXBCLEtBQWdDLEVBQWhDO0FBRUFOLHdCQUFBLENBQUFyRyxXQUFBLE9BQWdCQSxRQUFTcUcsYUFBekIsR0FBeUIsTUFBekIsS0FBMEMsRUFBMUM7O0FBRUEsWUFBR3JHLFFBQVErRyxVQUFYO0FBQ0NMLDRCQUFrQixFQUFsQjtBQUNBQSwwQkFBZ0JOLGNBQWhCLElBQWtDO0FBQUNZLG9CQUFRaEgsUUFBUStHO0FBQWpCLFdBQWxDO0FDSkk7O0FETUwsWUFBQS9HLFdBQUEsUUFBQTVCLE9BQUE0QixRQUFBa0IsTUFBQSxZQUFBOUMsS0FBb0J1QyxNQUFwQixHQUFvQixNQUFwQixHQUFvQixNQUFwQjtBQUNDLGNBQUdYLFFBQVErRyxVQUFYO0FBQ0NULGtCQUFNVyxHQUFOLEdBQVksQ0FBQztBQUFDOUgsbUJBQUs7QUFBQytILHFCQUFLbEgsUUFBUWtCO0FBQWQ7QUFBTixhQUFELEVBQStCd0YsZUFBL0IsQ0FBWjtBQUREO0FBR0NKLGtCQUFNVyxHQUFOLEdBQVksQ0FBQztBQUFDOUgsbUJBQUs7QUFBQytILHFCQUFLbEgsUUFBUWtCO0FBQWQ7QUFBTixhQUFELENBQVo7QUFKRjtBQUFBO0FBTUMsY0FBR2xCLFFBQVErRyxVQUFYO0FBQ0MxSSxjQUFFOEksTUFBRixDQUFTYixLQUFULEVBQWdCSSxlQUFoQjtBQ1NLOztBRFJOSixnQkFBTW5ILEdBQU4sR0FBWTtBQUFDaUksa0JBQU1UO0FBQVAsV0FBWjtBQ1lJOztBRFZMUixxQkFBYTVKLE9BQU8xQixFQUFwQjs7QUFFQSxZQUFHbUYsUUFBUXFILFdBQVg7QUFDQ2hKLFlBQUU4SSxNQUFGLENBQVNiLEtBQVQsRUFBZ0J0RyxRQUFRcUgsV0FBeEI7QUNXSTs7QURUTGQsd0JBQWdCO0FBQUNlLGlCQUFPakI7QUFBUixTQUFoQjs7QUFFQSxZQUFHTyxRQUFRdkksRUFBRWtKLFFBQUYsQ0FBV1gsSUFBWCxDQUFYO0FBQ0NMLHdCQUFjSyxJQUFkLEdBQXFCQSxJQUFyQjtBQ1lJOztBRFZMLFlBQUdULFVBQUg7QUFDQztBQUNDSyxzQkFBVUwsV0FBV3RILElBQVgsQ0FBZ0J5SCxLQUFoQixFQUF1QkMsYUFBdkIsRUFBc0NpQixLQUF0QyxFQUFWO0FBQ0FmLHNCQUFVLEVBQVY7O0FBQ0FwSSxjQUFFa0MsSUFBRixDQUFPaUcsT0FBUCxFQUFnQixVQUFDaUIsTUFBRDtBQ1lSLHFCRFhQaEIsUUFBUWpFLElBQVIsQ0FDQztBQUFBa0YsdUJBQU9ELE9BQU9yQixjQUFQLENBQVA7QUFDQTFGLHVCQUFPK0csT0FBT3RJO0FBRGQsZUFERCxDQ1dPO0FEWlI7O0FBSUEsbUJBQU9zSCxPQUFQO0FBUEQsbUJBQUEzSyxLQUFBO0FBUU1SLGdCQUFBUSxLQUFBO0FBQ0wsa0JBQU0sSUFBSUwsT0FBT3VJLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IxSSxFQUFFcU0sT0FBRixHQUFZLEtBQVosR0FBb0JDLEtBQUtDLFNBQUwsQ0FBZTdILE9BQWYsQ0FBMUMsQ0FBTjtBQVZGO0FBakNEO0FBUEQ7QUNvRUc7O0FEakJILFdBQU8sRUFBUDtBQXBERDtBQUFBLENBRkQsRTs7Ozs7Ozs7Ozs7O0FFQUE4SCxXQUFXQyxHQUFYLENBQWUsTUFBZixFQUF1QixnQ0FBdkIsRUFBeUQsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVg7QUFDeEQsTUFBQUMsR0FBQSxFQUFBaEMsVUFBQSxFQUFBaUMsZUFBQSxFQUFBQyxpQkFBQSxFQUFBL00sQ0FBQSxFQUFBZ04sTUFBQSxFQUFBQyxRQUFBLEVBQUFDLEdBQUEsRUFBQUMsS0FBQSxFQUFBbkwsV0FBQSxFQUFBK0UsV0FBQSxFQUFBcUcsU0FBQSxFQUFBQyxZQUFBLEVBQUF4SyxHQUFBLEVBQUFDLElBQUEsRUFBQXdLLElBQUEsRUFBQWpMLEtBQUEsRUFBQTJCLE9BQUEsRUFBQXBCLFFBQUEsRUFBQTJLLFdBQUEsRUFBQUMsWUFBQSxFQUFBQyxTQUFBOztBQUFBO0FBQ0NWLHdCQUFvQlcsY0FBY0MsbUJBQWQsQ0FBa0NqQixHQUFsQyxDQUFwQjtBQUNBSSxzQkFBa0JDLGtCQUFrQmxKLEdBQXBDO0FBRUFvSixlQUFXUCxJQUFJa0IsSUFBZjtBQUNBNUwsa0JBQWNpTCxTQUFTakwsV0FBdkI7QUFDQW9MLGdCQUFZSCxTQUFTRyxTQUFyQjtBQUNBeEssZUFBV3FLLFNBQVNySyxRQUFwQjtBQUVBaUwsVUFBTTdMLFdBQU4sRUFBbUJOLE1BQW5CO0FBQ0FtTSxVQUFNVCxTQUFOLEVBQWlCMUwsTUFBakI7QUFDQW1NLFVBQU1qTCxRQUFOLEVBQWdCbEIsTUFBaEI7QUFFQXlMLFlBQVFULElBQUluQixNQUFKLENBQVd1QyxVQUFuQjtBQUNBTCxnQkFBWWYsSUFBSTFCLEtBQUosQ0FBVSxXQUFWLENBQVo7QUFDQXdDLG1CQUFlZCxJQUFJMUIsS0FBSixDQUFVLGNBQVYsQ0FBZjtBQUVBcUMsbUJBQWUsR0FBZjtBQUNBSCxVQUFNMU4sUUFBUXVFLGFBQVIsQ0FBc0IsV0FBdEIsRUFBbUNLLE9BQW5DLENBQTJDK0ksS0FBM0MsQ0FBTjs7QUFLQSxRQUFHRCxHQUFIO0FBQ0NLLG9CQUFjcE4sT0FBTzROLFFBQVAsQ0FBZSxRQUFmLEVBQXVCQyxXQUF2QixDQUFtQ0MsUUFBbkMsQ0FBNEM1RSxHQUExRDtBQUNBd0QsWUFBTSxFQUFOO0FBQ0E3SSxnQkFBVWtKLElBQUk3SyxLQUFkO0FBQ0EySyxlQUFTRSxJQUFJZ0IsSUFBYjs7QUFFQSxVQUFHLEVBQUFyTCxNQUFBcUssSUFBQWlCLFdBQUEsWUFBQXRMLElBQWtCdUwsUUFBbEIsQ0FBMkJ0QixlQUEzQixJQUFDLE1BQUQsTUFBK0MsQ0FBQWhLLE9BQUFvSyxJQUFBbUIsUUFBQSxZQUFBdkwsS0FBZXNMLFFBQWYsQ0FBd0J0QixlQUF4QixJQUFDLE1BQWhELENBQUg7QUFDQ0QsY0FBTSxPQUFOO0FBREQsYUFFSyxLQUFBUyxPQUFBSixJQUFBb0IsWUFBQSxZQUFBaEIsS0FBcUJjLFFBQXJCLENBQThCdEIsZUFBOUIsSUFBRyxNQUFIO0FBQ0pELGNBQU0sUUFBTjtBQURJLGFBRUEsSUFBR0ssSUFBSXFCLEtBQUosS0FBYSxPQUFiLElBQXlCckIsSUFBSXNCLFNBQUosS0FBaUIxQixlQUE3QztBQUNKRCxjQUFNLE9BQU47QUFESSxhQUVBLElBQUdLLElBQUlxQixLQUFKLEtBQWEsU0FBYixLQUE0QnJCLElBQUlzQixTQUFKLEtBQWlCMUIsZUFBakIsSUFBb0NJLElBQUl1QixTQUFKLEtBQWlCM0IsZUFBakYsQ0FBSDtBQUNKRCxjQUFNLFNBQU47QUFESSxhQUVBLElBQUdLLElBQUlxQixLQUFKLEtBQWEsV0FBYixJQUE2QnJCLElBQUlzQixTQUFKLEtBQWlCMUIsZUFBakQ7QUFDSkQsY0FBTSxXQUFOO0FBREk7QUFJSjlGLHNCQUFjMkgsa0JBQWtCQyxrQkFBbEIsQ0FBcUMzQixNQUFyQyxFQUE2Q0YsZUFBN0MsQ0FBZDtBQUNBekssZ0JBQVE5QyxHQUFHcVAsTUFBSCxDQUFVeEssT0FBVixDQUFrQkosT0FBbEIsRUFBMkI7QUFBRXNELGtCQUFRO0FBQUVqRCxvQkFBUTtBQUFWO0FBQVYsU0FBM0IsQ0FBUjs7QUFDQSxZQUFHMEMsWUFBWXFILFFBQVosQ0FBcUIsT0FBckIsS0FBaUMvTCxNQUFNZ0MsTUFBTixDQUFhK0osUUFBYixDQUFzQnRCLGVBQXRCLENBQXBDO0FBQ0NELGdCQUFNLFNBQU47QUFQRztBQ0lEOztBREtKLFVBQUdBLEdBQUg7QUFDQ1EsdUJBQWVFLGVBQWMsb0JBQWtCdkosT0FBbEIsR0FBMEIsR0FBMUIsR0FBNkI2SSxHQUE3QixHQUFpQyxHQUFqQyxHQUFvQ00sS0FBcEMsR0FBMEMsYUFBMUMsR0FBdURNLFNBQXZELEdBQWlFLGdCQUFqRSxHQUFpRkQsWUFBL0YsQ0FBZjtBQUREO0FBR0NILHVCQUFlRSxlQUFjLG9CQUFrQnZKLE9BQWxCLEdBQTBCLFNBQTFCLEdBQW1DbUosS0FBbkMsR0FBeUMsNEVBQXpDLEdBQXFITSxTQUFySCxHQUErSCxnQkFBL0gsR0FBK0lELFlBQTdKLENBQWY7QUNIRzs7QURLSmhCLGlCQUFXcUMsVUFBWCxDQUFzQmxDLEdBQXRCLEVBQTJCO0FBQzFCbUMsY0FBTSxHQURvQjtBQUUxQkMsY0FBTTtBQUFFMUIsd0JBQWNBO0FBQWhCO0FBRm9CLE9BQTNCO0FBNUJEO0FBa0NDeEMsbUJBQWFyTCxRQUFRdUUsYUFBUixDQUFzQi9CLFdBQXRCLEVBQW1DWSxRQUFuQyxDQUFiOztBQUNBLFVBQUdpSSxVQUFIO0FBQ0NBLG1CQUFXbUUsTUFBWCxDQUFrQjVCLFNBQWxCLEVBQTZCO0FBQzVCNkIsaUJBQU87QUFDTix5QkFBYTtBQUNaLHFCQUFPOUI7QUFESztBQURQO0FBRHFCLFNBQTdCO0FBUUEsY0FBTSxJQUFJaE4sT0FBT3VJLEtBQVgsQ0FBaUIsT0FBakIsRUFBMEIsUUFBMUIsQ0FBTjtBQTVDRjtBQXZCRDtBQUFBLFdBQUFsSSxLQUFBO0FBcUVNUixRQUFBUSxLQUFBO0FDREgsV0RFRmdNLFdBQVdxQyxVQUFYLENBQXNCbEMsR0FBdEIsRUFBMkI7QUFDMUJtQyxZQUFNLEdBRG9CO0FBRTFCQyxZQUFNO0FBQUVHLGdCQUFRLENBQUM7QUFBRUMsd0JBQWNuUCxFQUFFb1AsTUFBRixJQUFZcFAsRUFBRXFNO0FBQTlCLFNBQUQ7QUFBVjtBQUZvQixLQUEzQixDQ0ZFO0FBVUQ7QUQvRUgsRzs7Ozs7Ozs7Ozs7O0FFQUE3TSxRQUFRNlAsbUJBQVIsR0FBOEIsVUFBQ3JOLFdBQUQsRUFBY3NOLE9BQWQ7QUFDN0IsTUFBQUMsT0FBQSxFQUFBQyxVQUFBLEVBQUFDLGtCQUFBLEVBQUE1TSxHQUFBOztBQUFBME0sWUFBQSxDQUFBMU0sTUFBQXJELFFBQUFrUSxTQUFBLENBQUExTixXQUFBLGFBQUFhLElBQTBDME0sT0FBMUMsR0FBMEMsTUFBMUM7QUFDQUMsZUFBYSxDQUFiOztBQUNBLE1BQUdELE9BQUg7QUFDQ3hNLE1BQUVrQyxJQUFGLENBQU9xSyxPQUFQLEVBQWdCLFVBQUNLLFVBQUQ7QUFDZixVQUFBQyxLQUFBLEVBQUFDLE9BQUEsRUFBQS9NLElBQUEsRUFBQXdLLElBQUE7QUFBQXNDLGNBQVE3TSxFQUFFK00sSUFBRixDQUFPUCxPQUFQLEVBQWdCSSxVQUFoQixDQUFSO0FBQ0FFLGdCQUFBLENBQUEvTSxPQUFBOE0sTUFBQUQsVUFBQSxjQUFBckMsT0FBQXhLLEtBQUFpTixRQUFBLFlBQUF6QyxLQUF1Q3VDLE9BQXZDLEdBQXVDLE1BQXZDLEdBQXVDLE1BQXZDOztBQUNBLFVBQUdBLE9BQUg7QUNHSyxlREZKTCxjQUFjLENDRVY7QURITDtBQ0tLLGVERkpBLGNBQWMsQ0NFVjtBQUNEO0FEVEw7O0FBUUFDLHlCQUFxQixNQUFNRCxVQUEzQjtBQUNBLFdBQU9DLGtCQUFQO0FDSUM7QURqQjJCLENBQTlCOztBQWVBalEsUUFBUXdRLGNBQVIsR0FBeUIsVUFBQ2hPLFdBQUQsRUFBYzJOLFVBQWQ7QUFDeEIsTUFBQUosT0FBQSxFQUFBSyxLQUFBLEVBQUFDLE9BQUEsRUFBQWhOLEdBQUEsRUFBQUMsSUFBQTs7QUFBQXlNLFlBQVUvUCxRQUFRa1EsU0FBUixDQUFrQjFOLFdBQWxCLEVBQStCdU4sT0FBekM7O0FBQ0EsTUFBR0EsT0FBSDtBQUNDSyxZQUFRN00sRUFBRStNLElBQUYsQ0FBT1AsT0FBUCxFQUFnQkksVUFBaEIsQ0FBUjtBQUNBRSxjQUFBLENBQUFoTixNQUFBK00sTUFBQUQsVUFBQSxjQUFBN00sT0FBQUQsSUFBQWtOLFFBQUEsWUFBQWpOLEtBQXVDK00sT0FBdkMsR0FBdUMsTUFBdkMsR0FBdUMsTUFBdkM7QUFDQSxXQUFPQSxPQUFQO0FDT0M7QURac0IsQ0FBekI7O0FBT0FyUSxRQUFReVEsZUFBUixHQUEwQixVQUFDak8sV0FBRCxFQUFja08sWUFBZCxFQUE0QlosT0FBNUI7QUFDekIsTUFBQXZOLEdBQUEsRUFBQWMsR0FBQSxFQUFBQyxJQUFBLEVBQUF3SyxJQUFBLEVBQUE2QyxPQUFBLEVBQUE3RSxJQUFBO0FBQUE2RSxZQUFBLENBQUF0TixNQUFBckQsUUFBQUUsV0FBQSxhQUFBb0QsT0FBQUQsSUFBQWtMLFFBQUEsWUFBQWpMLEtBQXlDc0IsT0FBekMsQ0FBaUQ7QUFBQ3BDLGlCQUFhQSxXQUFkO0FBQTJCb0wsZUFBVztBQUF0QyxHQUFqRCxJQUFVLE1BQVYsR0FBVSxNQUFWO0FBQ0FyTCxRQUFNdkMsUUFBUW1ELFNBQVIsQ0FBa0JYLFdBQWxCLENBQU47QUFDQXNOLFlBQVV2TSxFQUFFcU4sR0FBRixDQUFNZCxPQUFOLEVBQWUsVUFBQ2UsTUFBRDtBQUN4QixRQUFBVCxLQUFBO0FBQUFBLFlBQVE3TixJQUFJdUYsTUFBSixDQUFXK0ksTUFBWCxDQUFSOztBQUNBLFNBQUFULFNBQUEsT0FBR0EsTUFBT25JLElBQVYsR0FBVSxNQUFWLEtBQW1CLENBQUNtSSxNQUFNVSxNQUExQjtBQUNDLGFBQU9ELE1BQVA7QUFERDtBQUdDLGFBQU8sTUFBUDtBQ2NFO0FEbkJNLElBQVY7QUFNQWYsWUFBVXZNLEVBQUV3TixPQUFGLENBQVVqQixPQUFWLENBQVY7O0FBQ0EsTUFBR2EsV0FBWUEsUUFBUXBDLFFBQXZCO0FBQ0N6QyxXQUFBLEVBQUFnQyxPQUFBNkMsUUFBQXBDLFFBQUEsQ0FBQW1DLFlBQUEsYUFBQTVDLEtBQXVDaEMsSUFBdkMsR0FBdUMsTUFBdkMsS0FBK0MsRUFBL0M7QUFDQUEsV0FBT3ZJLEVBQUVxTixHQUFGLENBQU05RSxJQUFOLEVBQVksVUFBQ2tGLEtBQUQ7QUFDbEIsVUFBQUMsS0FBQSxFQUFBbEssR0FBQTtBQUFBQSxZQUFNaUssTUFBTSxDQUFOLENBQU47QUFDQUMsY0FBUTFOLEVBQUV1QixPQUFGLENBQVVnTCxPQUFWLEVBQW1CL0ksR0FBbkIsQ0FBUjtBQUNBaUssWUFBTSxDQUFOLElBQVdDLFFBQVEsQ0FBbkI7QUFDQSxhQUFPRCxLQUFQO0FBSk0sTUFBUDtBQUtBLFdBQU9sRixJQUFQO0FDa0JDOztBRGpCRixTQUFPLEVBQVA7QUFsQnlCLENBQTFCOztBQXFCQTlMLFFBQVFpRCxhQUFSLEdBQXdCLFVBQUNULFdBQUQ7QUFDdkIsTUFBQXNOLE9BQUEsRUFBQW9CLHFCQUFBLEVBQUFDLGFBQUEsRUFBQTFQLE1BQUEsRUFBQXVQLEtBQUEsRUFBQTNOLEdBQUE7QUFBQTVCLFdBQVN6QixRQUFRbUQsU0FBUixDQUFrQlgsV0FBbEIsQ0FBVDtBQUNBc04sWUFBVTlQLFFBQVFvUix1QkFBUixDQUFnQzVPLFdBQWhDLEtBQWdELENBQUMsTUFBRCxDQUExRDtBQUNBMk8sa0JBQWdCLENBQUMsT0FBRCxDQUFoQjtBQUNBRCwwQkFBd0JsUixRQUFRcVIsNEJBQVIsQ0FBcUM3TyxXQUFyQyxLQUFxRCxDQUFDLE9BQUQsQ0FBN0U7O0FBQ0EsTUFBRzBPLHFCQUFIO0FBQ0NDLG9CQUFnQjVOLEVBQUUrTixLQUFGLENBQVFILGFBQVIsRUFBdUJELHFCQUF2QixDQUFoQjtBQ29CQzs7QURsQkZGLFVBQVFoUixRQUFRdVIsb0JBQVIsQ0FBNkIvTyxXQUE3QixLQUE2QyxFQUFyRDs7QUFDQSxNQUFHN0IsT0FBTzhDLFFBQVY7QUNvQkcsV0FBTyxDQUFDSixNQUFNckQsUUFBUXdSLGtCQUFmLEtBQXNDLElBQXRDLEdBQTZDbk8sSURuQjFCYixXQ21CMEIsSURuQlgsRUNtQmxDLEdEbkJrQyxNQ21CekM7QUFDRDtBRDlCcUIsQ0FBeEI7O0FBWUF4QyxRQUFReVIsZUFBUixHQUEwQixVQUFDQyxnQkFBRCxFQUFtQkMsU0FBbkIsRUFBOEJDLGNBQTlCO0FBQ3pCLE1BQUFDLEtBQUE7QUFBQUEsVUFBUXRPLEVBQUV1TyxLQUFGLENBQVFILFNBQVIsQ0FBUjs7QUFDQSxNQUFHLENBQUNwTyxFQUFFd08sR0FBRixDQUFNRixLQUFOLEVBQWEsTUFBYixDQUFKO0FBQ0NBLFVBQU1sUCxJQUFOLEdBQWFpUCxjQUFiO0FDdUJDOztBRHRCRixNQUFHLENBQUNDLE1BQU0vQixPQUFWO0FBQ0MsUUFBRzRCLGdCQUFIO0FBQ0NHLFlBQU0vQixPQUFOLEdBQWdCNEIsZ0JBQWhCO0FBRkY7QUMyQkU7O0FEeEJGLE1BQUcsQ0FBQ0csTUFBTS9CLE9BQVY7QUFDQytCLFVBQU0vQixPQUFOLEdBQWdCLENBQUMsTUFBRCxDQUFoQjtBQzBCQzs7QUR6QkYsTUFBRyxDQUFDK0IsTUFBTUcsWUFBVjtBQUVDSCxVQUFNRyxZQUFOLEdBQXFCLE9BQXJCO0FDMEJDOztBRHhCRixNQUFHLENBQUN6TyxFQUFFd08sR0FBRixDQUFNRixLQUFOLEVBQWEsS0FBYixDQUFKO0FBQ0NBLFVBQU14TixHQUFOLEdBQVl1TixjQUFaO0FBREQ7QUFHQ0MsVUFBTWpGLEtBQU4sR0FBY2lGLE1BQU1qRixLQUFOLElBQWUrRSxVQUFVaFAsSUFBdkM7QUMwQkM7O0FEeEJGLE1BQUdZLEVBQUU0QixRQUFGLENBQVcwTSxNQUFNM00sT0FBakIsQ0FBSDtBQUNDMk0sVUFBTTNNLE9BQU4sR0FBZ0I0SCxLQUFLbUYsS0FBTCxDQUFXSixNQUFNM00sT0FBakIsQ0FBaEI7QUMwQkM7O0FEeEJGM0IsSUFBRTJPLE9BQUYsQ0FBVUwsTUFBTXRNLE9BQWhCLEVBQXlCLFVBQUNHLE1BQUQsRUFBU2MsTUFBVDtBQUN4QixRQUFHLENBQUNqRCxFQUFFQyxPQUFGLENBQVVrQyxNQUFWLENBQUQsSUFBc0JuQyxFQUFFa0osUUFBRixDQUFXL0csTUFBWCxDQUF6QjtBQUNDLFVBQUcvRSxPQUFPMEIsUUFBVjtBQUNDLFlBQUdrQixFQUFFNE8sVUFBRixDQUFBek0sVUFBQSxPQUFhQSxPQUFRRSxLQUFyQixHQUFxQixNQUFyQixDQUFIO0FDMEJNLGlCRHpCTEYsT0FBTzBNLE1BQVAsR0FBZ0IxTSxPQUFPRSxLQUFQLENBQWF1QixRQUFiLEVDeUJYO0FEM0JQO0FBQUE7QUFJQyxZQUFHNUQsRUFBRTRCLFFBQUYsQ0FBQU8sVUFBQSxPQUFXQSxPQUFRME0sTUFBbkIsR0FBbUIsTUFBbkIsQ0FBSDtBQzJCTSxpQkQxQkwxTSxPQUFPRSxLQUFQLEdBQWU1RixRQUFPLE1BQVAsRUFBYSxNQUFJMEYsT0FBTzBNLE1BQVgsR0FBa0IsR0FBL0IsQ0MwQlY7QUQvQlA7QUFERDtBQ21DRztBRHBDSjs7QUFRQSxTQUFPUCxLQUFQO0FBN0J5QixDQUExQjs7QUFnQ0EsSUFBR2xSLE9BQU84QyxRQUFWO0FBQ0N6RCxVQUFRcVMsY0FBUixHQUF5QixVQUFDN1AsV0FBRDtBQUN4QixRQUFBOFAsSUFBQSxFQUFBOUssZUFBQTtBQUFBOEssV0FBTyxFQUFQO0FBQ0E5SyxzQkFBa0J4SCxRQUFRdVMsaUJBQVIsQ0FBMEIvUCxXQUExQixDQUFsQjs7QUFFQWUsTUFBRWtDLElBQUYsQ0FBTytCLGVBQVAsRUFBd0IsVUFBQ2dMLG1CQUFEO0FBQ3ZCLFVBQUExQyxPQUFBLEVBQUFrQixLQUFBLEVBQUF5QixPQUFBLEVBQUF6SyxrQkFBQSxFQUFBSixjQUFBLEVBQUFDLG1CQUFBLEVBQUE2SyxhQUFBO0FBQUE3Syw0QkFBc0IySyxvQkFBb0JoUSxXQUExQztBQUNBd0YsMkJBQXFCd0ssb0JBQW9CN0ssV0FBekM7QUFDQUMsdUJBQWlCNUgsUUFBUW1ELFNBQVIsQ0FBa0IwRSxtQkFBbEIsQ0FBakI7O0FBQ0EsV0FBT0QsY0FBUDtBQUNDO0FDZ0NHOztBRC9CSmtJLGdCQUFVOVAsUUFBUW9SLHVCQUFSLENBQWdDdkosbUJBQWhDLEtBQXdELENBQUMsTUFBRCxDQUFsRTtBQUNBaUksZ0JBQVV2TSxFQUFFb1AsT0FBRixDQUFVN0MsT0FBVixFQUFtQjlILGtCQUFuQixDQUFWO0FBRUFnSixjQUFRaFIsUUFBUXVSLG9CQUFSLENBQTZCMUosbUJBQTdCLENBQVI7QUFDQTZLLHNCQUFnQjFTLFFBQVE0UyxzQkFBUixDQUErQjVCLEtBQS9CLEVBQXNDbEIsT0FBdEMsQ0FBaEI7O0FBRUEsVUFBRyxnQkFBZ0JoRyxJQUFoQixDQUFxQjlCLGtCQUFyQixDQUFIO0FBRUNBLDZCQUFxQkEsbUJBQW1CNkssT0FBbkIsQ0FBMkIsTUFBM0IsRUFBa0MsRUFBbEMsQ0FBckI7QUM4Qkc7O0FEN0JKSixnQkFDQztBQUFBalEscUJBQWFxRixtQkFBYjtBQUNBaUksaUJBQVNBLE9BRFQ7QUFFQTlILDRCQUFvQkEsa0JBRnBCO0FBR0E4SyxpQkFBU2pMLHdCQUF1QjtBQUhoQyxPQUREO0FDb0NHLGFEOUJIeUssS0FBSzVLLElBQUwsQ0FBVStLLE9BQVYsQ0M4Qkc7QURuREo7O0FBdUJBLFdBQU9ILElBQVA7QUEzQndCLEdBQXpCO0FDMkRBOztBRDlCRHRTLFFBQVErUyxzQkFBUixHQUFpQyxVQUFDdlEsV0FBRDtBQUNoQyxTQUFPZSxFQUFFeVAsS0FBRixDQUFRaFQsUUFBUWlULFlBQVIsQ0FBcUJ6USxXQUFyQixDQUFSLENBQVA7QUFEZ0MsQ0FBakMsQyxDQUdBOzs7OztBQUlBeEMsUUFBUWtULFdBQVIsR0FBc0IsVUFBQzFRLFdBQUQsRUFBY2tPLFlBQWQsRUFBNEJ5QyxJQUE1QjtBQUNyQixNQUFBQyxTQUFBLEVBQUF6QixTQUFBLEVBQUFsUSxNQUFBOztBQUFBLE1BQUdkLE9BQU84QyxRQUFWO0FBQ0MsUUFBRyxDQUFDakIsV0FBSjtBQUNDQSxvQkFBY21CLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUNxQ0U7O0FEcENILFFBQUcsQ0FBQzhNLFlBQUo7QUFDQ0EscUJBQWUvTSxRQUFRQyxHQUFSLENBQVksY0FBWixDQUFmO0FBSkY7QUMyQ0U7O0FEdENGbkMsV0FBU3pCLFFBQVFtRCxTQUFSLENBQWtCWCxXQUFsQixDQUFUOztBQUNBLE1BQUcsQ0FBQ2YsTUFBSjtBQUNDO0FDd0NDOztBRHZDRjJSLGNBQVlwVCxRQUFRaVQsWUFBUixDQUFxQnpRLFdBQXJCLENBQVo7O0FBQ0EsUUFBQTRRLGFBQUEsT0FBT0EsVUFBV3ZOLE1BQWxCLEdBQWtCLE1BQWxCO0FBQ0M7QUN5Q0M7O0FEeENGOEwsY0FBWXBPLEVBQUVhLFNBQUYsQ0FBWWdQLFNBQVosRUFBc0I7QUFBQyxXQUFNMUM7QUFBUCxHQUF0QixDQUFaOztBQUNBLE9BQU9pQixTQUFQO0FBRUMsUUFBR3dCLElBQUg7QUFDQztBQUREO0FBR0N4QixrQkFBWXlCLFVBQVUsQ0FBVixDQUFaO0FBTEY7QUNpREU7O0FEM0NGLFNBQU96QixTQUFQO0FBbkJxQixDQUF0Qjs7QUFzQkEzUixRQUFRcVQsbUJBQVIsR0FBOEIsVUFBQzdRLFdBQUQsRUFBY2tPLFlBQWQ7QUFDN0IsTUFBQTRDLFFBQUEsRUFBQTdSLE1BQUE7O0FBQUEsTUFBR2QsT0FBTzhDLFFBQVY7QUFDQyxRQUFHLENBQUNqQixXQUFKO0FBQ0NBLG9CQUFjbUIsUUFBUUMsR0FBUixDQUFZLGFBQVosQ0FBZDtBQzhDRTs7QUQ3Q0gsUUFBRyxDQUFDOE0sWUFBSjtBQUNDQSxxQkFBZS9NLFFBQVFDLEdBQVIsQ0FBWSxjQUFaLENBQWY7QUFKRjtBQ29ERTs7QUQvQ0YsTUFBRyxPQUFPOE0sWUFBUCxLQUF3QixRQUEzQjtBQUNDalAsYUFBU3pCLFFBQVFtRCxTQUFSLENBQWtCWCxXQUFsQixDQUFUOztBQUNBLFFBQUcsQ0FBQ2YsTUFBSjtBQUNDO0FDaURFOztBRGhESDZSLGVBQVcvUCxFQUFFYSxTQUFGLENBQVkzQyxPQUFPbUIsVUFBbkIsRUFBOEI7QUFBQ3lCLFdBQUtxTTtBQUFOLEtBQTlCLENBQVg7QUFKRDtBQU1DNEMsZUFBVzVDLFlBQVg7QUNvREM7O0FEbkRGLFVBQUE0QyxZQUFBLE9BQU9BLFNBQVUzUSxJQUFqQixHQUFpQixNQUFqQixNQUF5QixRQUF6QjtBQWI2QixDQUE5QixDLENBZ0JBOzs7O0FBR0EzQyxRQUFRdVQsb0JBQVIsR0FBK0IsVUFBQy9RLFdBQUQ7QUFDOUIsTUFBQWdSLFdBQUEsRUFBQS9SLE1BQUEsRUFBQTRCLEdBQUE7QUFBQTVCLFdBQVN6QixRQUFRbUQsU0FBUixDQUFrQlgsV0FBbEIsQ0FBVDs7QUFDQSxNQUFHLENBQUNmLE1BQUo7QUFDQ0EsYUFBU3pCLFFBQVFDLE9BQVIsQ0FBZ0J1QyxXQUFoQixDQUFUO0FDd0RDOztBRHZERixNQUFBZixVQUFBLFFBQUE0QixNQUFBNUIsT0FBQW1CLFVBQUEsWUFBQVMsSUFBcUIsU0FBckIsSUFBcUIsTUFBckIsR0FBcUIsTUFBckI7QUFFQ21RLGtCQUFjL1IsT0FBT21CLFVBQVAsQ0FBaUIsU0FBakIsQ0FBZDtBQUZEO0FBSUNXLE1BQUVrQyxJQUFGLENBQUFoRSxVQUFBLE9BQU9BLE9BQVFtQixVQUFmLEdBQWUsTUFBZixFQUEyQixVQUFDK08sU0FBRCxFQUFZNUssR0FBWjtBQUMxQixVQUFHNEssVUFBVWhQLElBQVYsS0FBa0IsS0FBbEIsSUFBMkJvRSxRQUFPLEtBQXJDO0FDd0RLLGVEdkRKeU0sY0FBYzdCLFNDdURWO0FBQ0Q7QUQxREw7QUM0REM7O0FEekRGLFNBQU82QixXQUFQO0FBWDhCLENBQS9CLEMsQ0FhQTs7OztBQUdBeFQsUUFBUW9SLHVCQUFSLEdBQWtDLFVBQUM1TyxXQUFEO0FBQ2pDLE1BQUFnUixXQUFBO0FBQUFBLGdCQUFjeFQsUUFBUXVULG9CQUFSLENBQTZCL1EsV0FBN0IsQ0FBZDtBQUNBLFNBQUFnUixlQUFBLE9BQU9BLFlBQWExRCxPQUFwQixHQUFvQixNQUFwQjtBQUZpQyxDQUFsQyxDLENBSUE7Ozs7QUFHQTlQLFFBQVFxUiw0QkFBUixHQUF1QyxVQUFDN08sV0FBRDtBQUN0QyxNQUFBZ1IsV0FBQTtBQUFBQSxnQkFBY3hULFFBQVF1VCxvQkFBUixDQUE2Qi9RLFdBQTdCLENBQWQ7QUFDQSxTQUFBZ1IsZUFBQSxPQUFPQSxZQUFhckMsYUFBcEIsR0FBb0IsTUFBcEI7QUFGc0MsQ0FBdkMsQyxDQUlBOzs7O0FBR0FuUixRQUFRdVIsb0JBQVIsR0FBK0IsVUFBQy9PLFdBQUQ7QUFDOUIsTUFBQWdSLFdBQUE7QUFBQUEsZ0JBQWN4VCxRQUFRdVQsb0JBQVIsQ0FBNkIvUSxXQUE3QixDQUFkOztBQUNBLE1BQUdnUixXQUFIO0FBQ0MsUUFBR0EsWUFBWTFILElBQWY7QUFDQyxhQUFPMEgsWUFBWTFILElBQW5CO0FBREQ7QUFHQyxhQUFPLENBQUMsQ0FBQyxTQUFELEVBQVksTUFBWixDQUFELENBQVA7QUFKRjtBQzRFRTtBRDlFNEIsQ0FBL0IsQyxDQVNBOzs7O0FBR0E5TCxRQUFReVQsU0FBUixHQUFvQixVQUFDOUIsU0FBRDtBQUNuQixVQUFBQSxhQUFBLE9BQU9BLFVBQVdoUCxJQUFsQixHQUFrQixNQUFsQixNQUEwQixLQUExQjtBQURtQixDQUFwQixDLENBR0E7Ozs7QUFHQTNDLFFBQVEwVCxZQUFSLEdBQXVCLFVBQUMvQixTQUFEO0FBQ3RCLFVBQUFBLGFBQUEsT0FBT0EsVUFBV2hQLElBQWxCLEdBQWtCLE1BQWxCLE1BQTBCLFFBQTFCO0FBRHNCLENBQXZCLEMsQ0FHQTs7OztBQUdBM0MsUUFBUTRTLHNCQUFSLEdBQWlDLFVBQUM5RyxJQUFELEVBQU82SCxjQUFQO0FBQ2hDLE1BQUFDLFlBQUE7QUFBQUEsaUJBQWUsRUFBZjs7QUFDQXJRLElBQUVrQyxJQUFGLENBQU9xRyxJQUFQLEVBQWEsVUFBQytILElBQUQ7QUFDWixRQUFBQyxZQUFBLEVBQUEzRCxVQUFBLEVBQUFhLEtBQUE7O0FBQUEsUUFBR3pOLEVBQUVDLE9BQUYsQ0FBVXFRLElBQVYsQ0FBSDtBQUVDLFVBQUdBLEtBQUtoTyxNQUFMLEtBQWUsQ0FBbEI7QUFDQ2lPLHVCQUFlSCxlQUFlN08sT0FBZixDQUF1QitPLEtBQUssQ0FBTCxDQUF2QixDQUFmOztBQUNBLFlBQUdDLGVBQWUsQ0FBQyxDQUFuQjtBQ2tGTSxpQkRqRkxGLGFBQWFsTSxJQUFiLENBQWtCLENBQUNvTSxZQUFELEVBQWUsS0FBZixDQUFsQixDQ2lGSztBRHBGUDtBQUFBLGFBSUssSUFBR0QsS0FBS2hPLE1BQUwsS0FBZSxDQUFsQjtBQUNKaU8sdUJBQWVILGVBQWU3TyxPQUFmLENBQXVCK08sS0FBSyxDQUFMLENBQXZCLENBQWY7O0FBQ0EsWUFBR0MsZUFBZSxDQUFDLENBQW5CO0FDbUZNLGlCRGxGTEYsYUFBYWxNLElBQWIsQ0FBa0IsQ0FBQ29NLFlBQUQsRUFBZUQsS0FBSyxDQUFMLENBQWYsQ0FBbEIsQ0NrRks7QURyRkY7QUFOTjtBQUFBLFdBVUssSUFBR3RRLEVBQUVrSixRQUFGLENBQVdvSCxJQUFYLENBQUg7QUFFSjFELG1CQUFhMEQsS0FBSzFELFVBQWxCO0FBQ0FhLGNBQVE2QyxLQUFLN0MsS0FBYjs7QUFDQSxVQUFHYixjQUFjYSxLQUFqQjtBQUNDOEMsdUJBQWVILGVBQWU3TyxPQUFmLENBQXVCcUwsVUFBdkIsQ0FBZjs7QUFDQSxZQUFHMkQsZUFBZSxDQUFDLENBQW5CO0FDb0ZNLGlCRG5GTEYsYUFBYWxNLElBQWIsQ0FBa0IsQ0FBQ29NLFlBQUQsRUFBZTlDLEtBQWYsQ0FBbEIsQ0NtRks7QUR0RlA7QUFKSTtBQzZGRjtBRHhHSjs7QUFvQkEsU0FBTzRDLFlBQVA7QUF0QmdDLENBQWpDLEMsQ0F3QkE7Ozs7QUFHQTVULFFBQVErVCxpQkFBUixHQUE0QixVQUFDakksSUFBRDtBQUMzQixNQUFBa0ksT0FBQTtBQUFBQSxZQUFVLEVBQVY7O0FBQ0F6USxJQUFFa0MsSUFBRixDQUFPcUcsSUFBUCxFQUFhLFVBQUMrSCxJQUFEO0FBQ1osUUFBQTFELFVBQUEsRUFBQWEsS0FBQTs7QUFBQSxRQUFHek4sRUFBRUMsT0FBRixDQUFVcVEsSUFBVixDQUFIO0FDNEZJLGFEMUZIRyxRQUFRdE0sSUFBUixDQUFhbU0sSUFBYixDQzBGRztBRDVGSixXQUdLLElBQUd0USxFQUFFa0osUUFBRixDQUFXb0gsSUFBWCxDQUFIO0FBRUoxRCxtQkFBYTBELEtBQUsxRCxVQUFsQjtBQUNBYSxjQUFRNkMsS0FBSzdDLEtBQWI7O0FBQ0EsVUFBR2IsY0FBY2EsS0FBakI7QUMwRkssZUR6RkpnRCxRQUFRdE0sSUFBUixDQUFhLENBQUN5SSxVQUFELEVBQWFhLEtBQWIsQ0FBYixDQ3lGSTtBRDlGRDtBQ2dHRjtBRHBHSjs7QUFXQSxTQUFPZ0QsT0FBUDtBQWIyQixDQUE1QixDOzs7Ozs7Ozs7Ozs7QUV0UEFyUyxhQUFhc1MsS0FBYixDQUFtQjNFLElBQW5CLEdBQTBCLElBQUk0RSxNQUFKLENBQVcsMEJBQVgsQ0FBMUI7O0FBRUEsSUFBR3ZULE9BQU84QyxRQUFWO0FBQ0M5QyxTQUFPRSxPQUFQLENBQWU7QUFDZCxRQUFBc1QsY0FBQTs7QUFBQUEscUJBQWlCeFMsYUFBYXlTLGVBQWIsQ0FBNkJDLEtBQTdCLElBQXNDLEVBQXZEOztBQUNBRixtQkFBZXpNLElBQWYsQ0FBb0I7QUFBQzRNLFdBQUszUyxhQUFhc1MsS0FBYixDQUFtQjNFLElBQXpCO0FBQStCaUYsV0FBSztBQUFwQyxLQUFwQjs7QUNLRSxXREpGNVMsYUFBYTZTLFFBQWIsQ0FBc0I7QUFDckJILGFBQU9GO0FBRGMsS0FBdEIsQ0NJRTtBRFBIO0FDV0EsQzs7Ozs7Ozs7Ozs7O0FDZER4UyxhQUFhc1MsS0FBYixDQUFtQjdELEtBQW5CLEdBQTJCLElBQUk4RCxNQUFKLENBQVcsNkNBQVgsQ0FBM0I7O0FBRUEsSUFBR3ZULE9BQU84QyxRQUFWO0FBQ0M5QyxTQUFPRSxPQUFQLENBQWU7QUFDZCxRQUFBc1QsY0FBQTs7QUFBQUEscUJBQWlCeFMsYUFBYXlTLGVBQWIsQ0FBNkJDLEtBQTdCLElBQXNDLEVBQXZEOztBQUNBRixtQkFBZXpNLElBQWYsQ0FBb0I7QUFBQzRNLFdBQUszUyxhQUFhc1MsS0FBYixDQUFtQjdELEtBQXpCO0FBQWdDbUUsV0FBSztBQUFyQyxLQUFwQjs7QUNLRSxXREpGNVMsYUFBYTZTLFFBQWIsQ0FBc0I7QUFDckJILGFBQU9GO0FBRGMsS0FBdEIsQ0NJRTtBRFBIO0FDV0EsQzs7Ozs7Ozs7Ozs7QUNkRDtBQUNBblUsT0FBTyxDQUFDeVUsYUFBUixHQUF3QixVQUFTQyxFQUFULEVBQWF6UCxPQUFiLEVBQXNCO0FBQzFDO0FBQ0EsU0FBTyxZQUFXO0FBQ2pCLFdBQU8wUCxJQUFJLENBQUNELEVBQUQsQ0FBWDtBQUNILEdBRlMsQ0FFUkUsSUFGUSxDQUVIM1AsT0FGRyxDQUFQO0FBR0gsQ0FMRDs7QUFRQWpGLE9BQU8sQ0FBQzJVLElBQVIsR0FBZSxVQUFTRCxFQUFULEVBQVk7QUFDMUIsU0FBT0MsSUFBSSxDQUFDRCxFQUFELENBQVg7QUFDQSxDQUZELEM7Ozs7Ozs7Ozs7OztBQ1RDLElBQUFHLFNBQUE7O0FBQUFBLFlBQVksVUFBQ0MsTUFBRDtBQUNYLE1BQUFDLEdBQUE7QUFBQUEsUUFBTUQsT0FBT0UsS0FBUCxDQUFhLEdBQWIsQ0FBTjs7QUFDQSxNQUFHRCxJQUFJbFAsTUFBSixHQUFhLENBQWhCO0FBQ0MsV0FBTztBQUFDK0csYUFBT21JLElBQUksQ0FBSixDQUFSO0FBQWdCblAsYUFBT21QLElBQUksQ0FBSjtBQUF2QixLQUFQO0FBREQ7QUFHQyxXQUFPO0FBQUNuSSxhQUFPbUksSUFBSSxDQUFKLENBQVI7QUFBZ0JuUCxhQUFPbVAsSUFBSSxDQUFKO0FBQXZCLEtBQVA7QUNVQTtBRGZVLENBQVo7O0FBT0EvVSxRQUFROEMsYUFBUixHQUF3QixVQUFDckIsTUFBRDtBQUN2QjhCLElBQUUyTyxPQUFGLENBQVV6USxPQUFPd1QsUUFBakIsRUFBMkIsVUFBQ0MsT0FBRCxFQUFVbk8sR0FBVjtBQUUxQixRQUFBb08sS0FBQSxFQUFBQyxlQUFBLEVBQUFDLGFBQUE7O0FBQUEsUUFBSTFVLE9BQU8wQixRQUFQLElBQW1CNlMsUUFBUUksRUFBUixLQUFjLFFBQWxDLElBQWdEM1UsT0FBTzhDLFFBQVAsSUFBbUJ5UixRQUFRSSxFQUFSLEtBQWMsUUFBcEY7QUFDQ0Ysd0JBQUFGLFdBQUEsT0FBa0JBLFFBQVNDLEtBQTNCLEdBQTJCLE1BQTNCO0FBQ0FFLHNCQUFnQkgsUUFBUUssSUFBeEI7O0FBQ0EsVUFBR0gsbUJBQW1CN1IsRUFBRTRCLFFBQUYsQ0FBV2lRLGVBQVgsQ0FBdEI7QUFDQ0YsZ0JBQVFLLElBQVIsR0FBZXZWLFFBQU8sTUFBUCxFQUFhLE1BQUlvVixlQUFKLEdBQW9CLEdBQWpDLENBQWY7QUNZRTs7QURWSCxVQUFHQyxpQkFBaUI5UixFQUFFNEIsUUFBRixDQUFXa1EsYUFBWCxDQUFwQjtBQUdDLFlBQUdBLGNBQWN4UixVQUFkLENBQXlCLFVBQXpCLENBQUg7QUFDQ3FSLGtCQUFRSyxJQUFSLEdBQWV2VixRQUFPLE1BQVAsRUFBYSxNQUFJcVYsYUFBSixHQUFrQixHQUEvQixDQUFmO0FBREQ7QUFHQ0gsa0JBQVFLLElBQVIsR0FBZXZWLFFBQU8sTUFBUCxFQUFhLDJEQUF5RHFWLGFBQXpELEdBQXVFLElBQXBGLENBQWY7QUFORjtBQU5EO0FDd0JFOztBRFZGLFFBQUcxVSxPQUFPMEIsUUFBUCxJQUFtQjZTLFFBQVFJLEVBQVIsS0FBYyxRQUFwQztBQUNDSCxjQUFRRCxRQUFRSyxJQUFoQjs7QUFDQSxVQUFHSixTQUFTNVIsRUFBRTRPLFVBQUYsQ0FBYWdELEtBQWIsQ0FBWjtBQ1lJLGVEWEhELFFBQVFDLEtBQVIsR0FBZ0JBLE1BQU1oTyxRQUFOLEVDV2I7QURkTDtBQ2dCRTtBRGhDSDs7QUFxQkEsTUFBR3hHLE9BQU84QyxRQUFWO0FBQ0NGLE1BQUUyTyxPQUFGLENBQVV6USxPQUFPK1QsT0FBakIsRUFBMEIsVUFBQzdQLE1BQUQsRUFBU29CLEdBQVQ7QUFDekIsVUFBQXFPLGVBQUEsRUFBQUMsYUFBQSxFQUFBSSxRQUFBLEVBQUF6VSxLQUFBOztBQUFBb1Usd0JBQUF6UCxVQUFBLE9BQWtCQSxPQUFRd1AsS0FBMUIsR0FBMEIsTUFBMUI7QUFDQUUsc0JBQUExUCxVQUFBLE9BQWdCQSxPQUFRNFAsSUFBeEIsR0FBd0IsTUFBeEI7O0FBQ0EsVUFBR0gsbUJBQW1CN1IsRUFBRTRCLFFBQUYsQ0FBV2lRLGVBQVgsQ0FBdEI7QUFFQztBQUNDelAsaUJBQU80UCxJQUFQLEdBQWN2VixRQUFPLE1BQVAsRUFBYSxNQUFJb1YsZUFBSixHQUFvQixHQUFqQyxDQUFkO0FBREQsaUJBQUFNLE1BQUE7QUFFTTFVLGtCQUFBMFUsTUFBQTtBQUNMelUsa0JBQVFELEtBQVIsQ0FBYyxnQkFBZCxFQUFnQ29VLGVBQWhDO0FBTEY7QUNxQkc7O0FEZkgsVUFBR0MsaUJBQWlCOVIsRUFBRTRCLFFBQUYsQ0FBV2tRLGFBQVgsQ0FBcEI7QUFFQztBQUNDLGNBQUdBLGNBQWN4UixVQUFkLENBQXlCLFVBQXpCLENBQUg7QUFDQzhCLG1CQUFPNFAsSUFBUCxHQUFjdlYsUUFBTyxNQUFQLEVBQWEsTUFBSXFWLGFBQUosR0FBa0IsR0FBL0IsQ0FBZDtBQUREO0FBR0MsZ0JBQUc5UixFQUFFNE8sVUFBRixDQUFhblMsUUFBUTJWLGFBQVIsQ0FBc0JOLGFBQXRCLENBQWIsQ0FBSDtBQUNDMVAscUJBQU80UCxJQUFQLEdBQWNGLGFBQWQ7QUFERDtBQUdDMVAscUJBQU80UCxJQUFQLEdBQWN2VixRQUFPLE1BQVAsRUFBYSxpQkFBZXFWLGFBQWYsR0FBNkIsSUFBMUMsQ0FBZDtBQU5GO0FBREQ7QUFBQSxpQkFBQUssTUFBQTtBQVFNMVUsa0JBQUEwVSxNQUFBO0FBQ0x6VSxrQkFBUUQsS0FBUixDQUFjLGNBQWQsRUFBOEJxVSxhQUE5QixFQUE2Q3JVLEtBQTdDO0FBWEY7QUMrQkc7O0FEbEJIeVUsaUJBQUE5UCxVQUFBLE9BQVdBLE9BQVE4UCxRQUFuQixHQUFtQixNQUFuQjs7QUFDQSxVQUFHQSxRQUFIO0FBQ0M7QUNvQkssaUJEbkJKOVAsT0FBT2lRLE9BQVAsR0FBaUI1VixRQUFPLE1BQVAsRUFBYSxNQUFJeVYsUUFBSixHQUFhLEdBQTFCLENDbUJiO0FEcEJMLGlCQUFBQyxNQUFBO0FBRU0xVSxrQkFBQTBVLE1BQUE7QUNxQkQsaUJEcEJKelUsUUFBUUQsS0FBUixDQUFjLG9DQUFkLEVBQW9EQSxLQUFwRCxFQUEyRHlVLFFBQTNELENDb0JJO0FEeEJOO0FDMEJHO0FEakRKO0FBREQ7QUE4QkNsUyxNQUFFMk8sT0FBRixDQUFVelEsT0FBTytULE9BQWpCLEVBQTBCLFVBQUM3UCxNQUFELEVBQVNvQixHQUFUO0FBQ3pCLFVBQUFvTyxLQUFBLEVBQUFNLFFBQUE7O0FBQUFOLGNBQUF4UCxVQUFBLE9BQVFBLE9BQVE0UCxJQUFoQixHQUFnQixNQUFoQjs7QUFDQSxVQUFHSixTQUFTNVIsRUFBRTRPLFVBQUYsQ0FBYWdELEtBQWIsQ0FBWjtBQUVDeFAsZUFBT3dQLEtBQVAsR0FBZUEsTUFBTWhPLFFBQU4sRUFBZjtBQ3dCRTs7QUR0QkhzTyxpQkFBQTlQLFVBQUEsT0FBV0EsT0FBUWlRLE9BQW5CLEdBQW1CLE1BQW5COztBQUVBLFVBQUdILFlBQVlsUyxFQUFFNE8sVUFBRixDQUFhc0QsUUFBYixDQUFmO0FDdUJJLGVEdEJIOVAsT0FBTzhQLFFBQVAsR0FBa0JBLFNBQVN0TyxRQUFULEVDc0JmO0FBQ0Q7QURoQ0o7QUNrQ0E7O0FEdkJENUQsSUFBRTJPLE9BQUYsQ0FBVXpRLE9BQU9xRyxNQUFqQixFQUF5QixVQUFDc0ksS0FBRCxFQUFRckosR0FBUjtBQUN4QixRQUFBOE8sUUFBQSxFQUFBQyxLQUFBLEVBQUFDLGtCQUFBLEVBQUEzVCxjQUFBLEVBQUE0VCxZQUFBLEVBQUFoVixLQUFBLEVBQUFhLGVBQUEsRUFBQW9VLGtCQUFBLEVBQUEvUSxPQUFBLEVBQUEvQyxlQUFBLEVBQUErRixZQUFBLEVBQUFtTSxLQUFBOztBQUFBLFFBQUdqRSxNQUFNbEwsT0FBTixJQUFpQjNCLEVBQUU0QixRQUFGLENBQVdpTCxNQUFNbEwsT0FBakIsQ0FBcEI7QUFDQztBQUNDMlEsbUJBQVcsRUFBWDs7QUFFQXRTLFVBQUUyTyxPQUFGLENBQVU5QixNQUFNbEwsT0FBTixDQUFjOFAsS0FBZCxDQUFvQixJQUFwQixDQUFWLEVBQXFDLFVBQUNGLE1BQUQ7QUFDcEMsY0FBQTVQLE9BQUE7O0FBQUEsY0FBRzRQLE9BQU9oUSxPQUFQLENBQWUsR0FBZixDQUFIO0FBQ0NJLHNCQUFVNFAsT0FBT0UsS0FBUCxDQUFhLEdBQWIsQ0FBVjtBQzBCSyxtQkR6Qkx6UixFQUFFMk8sT0FBRixDQUFVaE4sT0FBVixFQUFtQixVQUFDZ1IsT0FBRDtBQzBCWixxQkR6Qk5MLFNBQVNuTyxJQUFULENBQWNtTixVQUFVcUIsT0FBVixDQUFkLENDeUJNO0FEMUJQLGNDeUJLO0FEM0JOO0FDK0JNLG1CRDFCTEwsU0FBU25PLElBQVQsQ0FBY21OLFVBQVVDLE1BQVYsQ0FBZCxDQzBCSztBQUNEO0FEakNOOztBQU9BMUUsY0FBTWxMLE9BQU4sR0FBZ0IyUSxRQUFoQjtBQVZELGVBQUFILE1BQUE7QUFXTTFVLGdCQUFBMFUsTUFBQTtBQUNMelUsZ0JBQVFELEtBQVIsQ0FBYyw4QkFBZCxFQUE4Q29QLE1BQU1sTCxPQUFwRCxFQUE2RGxFLEtBQTdEO0FBYkY7QUFBQSxXQWVLLElBQUdvUCxNQUFNbEwsT0FBTixJQUFpQixDQUFDM0IsRUFBRTRPLFVBQUYsQ0FBYS9CLE1BQU1sTCxPQUFuQixDQUFsQixJQUFpRCxDQUFDM0IsRUFBRUMsT0FBRixDQUFVNE0sTUFBTWxMLE9BQWhCLENBQWxELElBQThFM0IsRUFBRWtKLFFBQUYsQ0FBVzJELE1BQU1sTCxPQUFqQixDQUFqRjtBQUNKMlEsaUJBQVcsRUFBWDs7QUFDQXRTLFFBQUVrQyxJQUFGLENBQU8ySyxNQUFNbEwsT0FBYixFQUFzQixVQUFDaVIsQ0FBRCxFQUFJQyxDQUFKO0FDOEJsQixlRDdCSFAsU0FBU25PLElBQVQsQ0FBYztBQUFDa0YsaUJBQU91SixDQUFSO0FBQVd2USxpQkFBT3dRO0FBQWxCLFNBQWQsQ0M2Qkc7QUQ5Qko7O0FBRUFoRyxZQUFNbEwsT0FBTixHQUFnQjJRLFFBQWhCO0FDa0NDOztBRGhDRixRQUFHbFYsT0FBTzBCLFFBQVY7QUFDQzZDLGdCQUFVa0wsTUFBTWxMLE9BQWhCOztBQUNBLFVBQUdBLFdBQVczQixFQUFFNE8sVUFBRixDQUFhak4sT0FBYixDQUFkO0FBQ0NrTCxjQUFNeUYsUUFBTixHQUFpQnpGLE1BQU1sTCxPQUFOLENBQWNpQyxRQUFkLEVBQWpCO0FBSEY7QUFBQTtBQUtDakMsZ0JBQVVrTCxNQUFNeUYsUUFBaEI7O0FBQ0EsVUFBRzNRLFdBQVczQixFQUFFNEIsUUFBRixDQUFXRCxPQUFYLENBQWQ7QUFDQztBQUNDa0wsZ0JBQU1sTCxPQUFOLEdBQWdCbEYsUUFBTyxNQUFQLEVBQWEsTUFBSWtGLE9BQUosR0FBWSxHQUF6QixDQUFoQjtBQURELGlCQUFBd1EsTUFBQTtBQUVNMVUsa0JBQUEwVSxNQUFBO0FBQ0x6VSxrQkFBUUQsS0FBUixDQUFjLG1CQUFpQlMsT0FBT2tCLElBQXhCLEdBQTZCLE1BQTdCLEdBQW1DeU4sTUFBTXpOLElBQXZELEVBQStEM0IsS0FBL0Q7QUFKRjtBQU5EO0FDZ0RFOztBRHBDRixRQUFHTCxPQUFPMEIsUUFBVjtBQUNDZ1MsY0FBUWpFLE1BQU1pRSxLQUFkOztBQUNBLFVBQUdBLEtBQUg7QUFDQ2pFLGNBQU1pRyxNQUFOLEdBQWVqRyxNQUFNaUUsS0FBTixDQUFZbE4sUUFBWixFQUFmO0FBSEY7QUFBQTtBQUtDa04sY0FBUWpFLE1BQU1pRyxNQUFkOztBQUNBLFVBQUdoQyxLQUFIO0FBQ0M7QUFDQ2pFLGdCQUFNaUUsS0FBTixHQUFjclUsUUFBTyxNQUFQLEVBQWEsTUFBSXFVLEtBQUosR0FBVSxHQUF2QixDQUFkO0FBREQsaUJBQUFxQixNQUFBO0FBRU0xVSxrQkFBQTBVLE1BQUE7QUFDTHpVLGtCQUFRRCxLQUFSLENBQWMsbUJBQWlCUyxPQUFPa0IsSUFBeEIsR0FBNkIsTUFBN0IsR0FBbUN5TixNQUFNek4sSUFBdkQsRUFBK0QzQixLQUEvRDtBQUpGO0FBTkQ7QUNvREU7O0FEeENGLFFBQUdMLE9BQU8wQixRQUFWO0FBQ0MsVUFBRytOLE1BQU1HLFFBQVQ7QUFDQ3VGLGdCQUFRMUYsTUFBTUcsUUFBTixDQUFldEksSUFBdkI7O0FBQ0EsWUFBRzZOLFNBQVN2UyxFQUFFNE8sVUFBRixDQUFhMkQsS0FBYixDQUFULElBQWdDQSxVQUFTL1MsTUFBekMsSUFBbUQrUyxVQUFTNVQsTUFBNUQsSUFBc0U0VCxVQUFTUSxNQUEvRSxJQUF5RlIsVUFBU1MsT0FBbEcsSUFBNkcsQ0FBQ2hULEVBQUVDLE9BQUYsQ0FBVXNTLEtBQVYsQ0FBakg7QUFDQzFGLGdCQUFNRyxRQUFOLENBQWV1RixLQUFmLEdBQXVCQSxNQUFNM08sUUFBTixFQUF2QjtBQUhGO0FBREQ7QUFBQTtBQU1DLFVBQUdpSixNQUFNRyxRQUFUO0FBQ0N1RixnQkFBUTFGLE1BQU1HLFFBQU4sQ0FBZXVGLEtBQXZCOztBQUNBLFlBQUdBLFNBQVN2UyxFQUFFNEIsUUFBRixDQUFXMlEsS0FBWCxDQUFaO0FBQ0M7QUFDQzFGLGtCQUFNRyxRQUFOLENBQWV0SSxJQUFmLEdBQXNCakksUUFBTyxNQUFQLEVBQWEsTUFBSThWLEtBQUosR0FBVSxHQUF2QixDQUF0QjtBQURELG1CQUFBSixNQUFBO0FBRU0xVSxvQkFBQTBVLE1BQUE7QUFDTHpVLG9CQUFRRCxLQUFSLENBQWMsNkJBQWQsRUFBNkNvUCxLQUE3QyxFQUFvRHBQLEtBQXBEO0FBSkY7QUFGRDtBQU5EO0FDNERFOztBRDlDRixRQUFHTCxPQUFPMEIsUUFBVjtBQUVDRix3QkFBa0JpTyxNQUFNak8sZUFBeEI7QUFDQStGLHFCQUFla0ksTUFBTWxJLFlBQXJCO0FBQ0E5Rix1QkFBaUJnTyxNQUFNaE8sY0FBdkI7QUFDQTJULDJCQUFxQjNGLE1BQU0yRixrQkFBM0I7QUFDQWxVLHdCQUFrQnVPLE1BQU12TyxlQUF4Qjs7QUFFQSxVQUFHTSxtQkFBbUJvQixFQUFFNE8sVUFBRixDQUFhaFEsZUFBYixDQUF0QjtBQUNDaU8sY0FBTW9HLGdCQUFOLEdBQXlCclUsZ0JBQWdCZ0YsUUFBaEIsRUFBekI7QUM4Q0U7O0FENUNILFVBQUdlLGdCQUFnQjNFLEVBQUU0TyxVQUFGLENBQWFqSyxZQUFiLENBQW5CO0FBQ0NrSSxjQUFNcUcsYUFBTixHQUFzQnZPLGFBQWFmLFFBQWIsRUFBdEI7QUM4Q0U7O0FENUNILFVBQUcvRSxrQkFBa0JtQixFQUFFNE8sVUFBRixDQUFhL1AsY0FBYixDQUFyQjtBQUNDZ08sY0FBTXNHLGVBQU4sR0FBd0J0VSxlQUFlK0UsUUFBZixFQUF4QjtBQzhDRTs7QUQ3Q0gsVUFBRzRPLHNCQUFzQnhTLEVBQUU0TyxVQUFGLENBQWE0RCxrQkFBYixDQUF6QjtBQUNDM0YsY0FBTXVHLG1CQUFOLEdBQTRCWixtQkFBbUI1TyxRQUFuQixFQUE1QjtBQytDRTs7QUQ3Q0gsVUFBR3RGLG1CQUFtQjBCLEVBQUU0TyxVQUFGLENBQWF0USxlQUFiLENBQXRCO0FBQ0N1TyxjQUFNd0csZ0JBQU4sR0FBeUIvVSxnQkFBZ0JzRixRQUFoQixFQUF6QjtBQXBCRjtBQUFBO0FBdUJDaEYsd0JBQWtCaU8sTUFBTW9HLGdCQUFOLElBQTBCcEcsTUFBTWpPLGVBQWxEO0FBQ0ErRixxQkFBZWtJLE1BQU1xRyxhQUFyQjtBQUNBclUsdUJBQWlCZ08sTUFBTXNHLGVBQXZCO0FBQ0FYLDJCQUFxQjNGLE1BQU11RyxtQkFBM0I7QUFDQTlVLHdCQUFrQnVPLE1BQU13RyxnQkFBeEI7O0FBRUEsVUFBR3pVLG1CQUFtQm9CLEVBQUU0QixRQUFGLENBQVdoRCxlQUFYLENBQXRCO0FBQ0NpTyxjQUFNak8sZUFBTixHQUF3Qm5DLFFBQU8sTUFBUCxFQUFhLE1BQUltQyxlQUFKLEdBQW9CLEdBQWpDLENBQXhCO0FDOENFOztBRDVDSCxVQUFHK0YsZ0JBQWdCM0UsRUFBRTRCLFFBQUYsQ0FBVytDLFlBQVgsQ0FBbkI7QUFDQ2tJLGNBQU1sSSxZQUFOLEdBQXFCbEksUUFBTyxNQUFQLEVBQWEsTUFBSWtJLFlBQUosR0FBaUIsR0FBOUIsQ0FBckI7QUM4Q0U7O0FENUNILFVBQUc5RixrQkFBa0JtQixFQUFFNEIsUUFBRixDQUFXL0MsY0FBWCxDQUFyQjtBQUNDZ08sY0FBTWhPLGNBQU4sR0FBdUJwQyxRQUFPLE1BQVAsRUFBYSxNQUFJb0MsY0FBSixHQUFtQixHQUFoQyxDQUF2QjtBQzhDRTs7QUQ1Q0gsVUFBRzJULHNCQUFzQnhTLEVBQUU0QixRQUFGLENBQVc0USxrQkFBWCxDQUF6QjtBQUNDM0YsY0FBTTJGLGtCQUFOLEdBQTJCL1YsUUFBTyxNQUFQLEVBQWEsTUFBSStWLGtCQUFKLEdBQXVCLEdBQXBDLENBQTNCO0FDOENFOztBRDVDSCxVQUFHbFUsbUJBQW1CMEIsRUFBRTRCLFFBQUYsQ0FBV3RELGVBQVgsQ0FBdEI7QUFDQ3VPLGNBQU12TyxlQUFOLEdBQXdCN0IsUUFBTyxNQUFQLEVBQWEsTUFBSTZCLGVBQUosR0FBb0IsR0FBakMsQ0FBeEI7QUExQ0Y7QUN5RkU7O0FEN0NGLFFBQUdsQixPQUFPMEIsUUFBVjtBQUNDMlQscUJBQWU1RixNQUFNNEYsWUFBckI7O0FBQ0EsVUFBR0EsZ0JBQWdCelMsRUFBRTRPLFVBQUYsQ0FBYTZELFlBQWIsQ0FBbkI7QUFDQzVGLGNBQU15RyxhQUFOLEdBQXNCekcsTUFBTTRGLFlBQU4sQ0FBbUI3TyxRQUFuQixFQUF0QjtBQUhGO0FBQUE7QUFLQzZPLHFCQUFlNUYsTUFBTXlHLGFBQXJCOztBQUVBLFVBQUcsQ0FBQ2IsWUFBRCxJQUFpQnpTLEVBQUU0QixRQUFGLENBQVdpTCxNQUFNNEYsWUFBakIsQ0FBakIsSUFBbUQ1RixNQUFNNEYsWUFBTixDQUFtQm5TLFVBQW5CLENBQThCLFVBQTlCLENBQXREO0FBQ0NtUyx1QkFBZTVGLE1BQU00RixZQUFyQjtBQytDRTs7QUQ3Q0gsVUFBR0EsZ0JBQWdCelMsRUFBRTRCLFFBQUYsQ0FBVzZRLFlBQVgsQ0FBbkI7QUFDQztBQUNDNUYsZ0JBQU00RixZQUFOLEdBQXFCaFcsUUFBTyxNQUFQLEVBQWEsTUFBSWdXLFlBQUosR0FBaUIsR0FBOUIsQ0FBckI7QUFERCxpQkFBQU4sTUFBQTtBQUVNMVUsa0JBQUEwVSxNQUFBO0FBQ0x6VSxrQkFBUUQsS0FBUixDQUFjLG1CQUFpQlMsT0FBT2tCLElBQXhCLEdBQTZCLE1BQTdCLEdBQW1DeU4sTUFBTXpOLElBQXZELEVBQStEM0IsS0FBL0Q7QUFKRjtBQVZEO0FDZ0VFOztBRGhERixRQUFHTCxPQUFPMEIsUUFBVjtBQUNDNFQsMkJBQXFCN0YsTUFBTTZGLGtCQUEzQjs7QUFDQSxVQUFHQSxzQkFBc0IxUyxFQUFFNE8sVUFBRixDQUFhOEQsa0JBQWIsQ0FBekI7QUNrREksZURqREg3RixNQUFNMEcsbUJBQU4sR0FBNEIxRyxNQUFNNkYsa0JBQU4sQ0FBeUI5TyxRQUF6QixFQ2lEekI7QURwREw7QUFBQTtBQUtDOE8sMkJBQXFCN0YsTUFBTTBHLG1CQUEzQjs7QUFDQSxVQUFHYixzQkFBc0IxUyxFQUFFNEIsUUFBRixDQUFXOFEsa0JBQVgsQ0FBekI7QUFDQztBQ21ESyxpQkRsREo3RixNQUFNNkYsa0JBQU4sR0FBMkJqVyxRQUFPLE1BQVAsRUFBYSxNQUFJaVcsa0JBQUosR0FBdUIsR0FBcEMsQ0NrRHZCO0FEbkRMLGlCQUFBUCxNQUFBO0FBRU0xVSxrQkFBQTBVLE1BQUE7QUNvREQsaUJEbkRKelUsUUFBUUQsS0FBUixDQUFjLG1CQUFpQlMsT0FBT2tCLElBQXhCLEdBQTZCLE1BQTdCLEdBQW1DeU4sTUFBTXpOLElBQXZELEVBQStEM0IsS0FBL0QsQ0NtREk7QUR2RE47QUFORDtBQ2dFRTtBRHhMSDs7QUFvSUF1QyxJQUFFMk8sT0FBRixDQUFVelEsT0FBT21CLFVBQWpCLEVBQTZCLFVBQUMrTyxTQUFELEVBQVk1SyxHQUFaO0FBQzVCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bb0JBLElBQUd4RCxFQUFFNE8sVUFBRixDQUFhUixVQUFVcE0sT0FBdkIsQ0FBSDtBQUNDLFVBQUc1RSxPQUFPMEIsUUFBVjtBQ3dESSxlRHZESHNQLFVBQVVvRixRQUFWLEdBQXFCcEYsVUFBVXBNLE9BQVYsQ0FBa0I0QixRQUFsQixFQ3VEbEI7QUR6REw7QUFBQSxXQUdLLElBQUc1RCxFQUFFNEIsUUFBRixDQUFXd00sVUFBVW9GLFFBQXJCLENBQUg7QUFDSixVQUFHcFcsT0FBTzhDLFFBQVY7QUN5REksZUR4REhrTyxVQUFVcE0sT0FBVixHQUFvQnZGLFFBQU8sTUFBUCxFQUFhLE1BQUkyUixVQUFVb0YsUUFBZCxHQUF1QixHQUFwQyxDQ3dEakI7QUQxREE7QUFBQTtBQzZERixhRHpERnhULEVBQUUyTyxPQUFGLENBQVVQLFVBQVVwTSxPQUFwQixFQUE2QixVQUFDRyxNQUFELEVBQVNjLE1BQVQ7QUFDNUIsWUFBR2pELEVBQUVDLE9BQUYsQ0FBVWtDLE1BQVYsQ0FBSDtBQUNDLGNBQUcvRSxPQUFPMEIsUUFBVjtBQUNDLGdCQUFHcUQsT0FBT0csTUFBUCxLQUFpQixDQUFqQixJQUF1QnRDLEVBQUU0TyxVQUFGLENBQWF6TSxPQUFPLENBQVAsQ0FBYixDQUExQjtBQUNDQSxxQkFBTyxDQUFQLElBQVlBLE9BQU8sQ0FBUCxFQUFVeUIsUUFBVixFQUFaO0FDMERNLHFCRHpETnpCLE9BQU8sQ0FBUCxJQUFZLFVDeUROO0FEM0RQLG1CQUdLLElBQUdBLE9BQU9HLE1BQVAsS0FBaUIsQ0FBakIsSUFBdUJ0QyxFQUFFeVQsTUFBRixDQUFTdFIsT0FBTyxDQUFQLENBQVQsQ0FBMUI7QUMwREUscUJEdkROQSxPQUFPLENBQVAsSUFBWSxNQ3VETjtBRDlEUjtBQUFBO0FBU0MsZ0JBQUdBLE9BQU9HLE1BQVAsS0FBaUIsQ0FBakIsSUFBdUJ0QyxFQUFFNEIsUUFBRixDQUFXTyxPQUFPLENBQVAsQ0FBWCxDQUF2QixJQUFpREEsT0FBTyxDQUFQLE1BQWEsVUFBakU7QUFDQ0EscUJBQU8sQ0FBUCxJQUFZMUYsUUFBTyxNQUFQLEVBQWEsTUFBSTBGLE9BQU8sQ0FBUCxDQUFKLEdBQWMsR0FBM0IsQ0FBWjtBQUNBQSxxQkFBT3VSLEdBQVA7QUN5REs7O0FEeEROLGdCQUFHdlIsT0FBT0csTUFBUCxLQUFpQixDQUFqQixJQUF1QnRDLEVBQUU0QixRQUFGLENBQVdPLE9BQU8sQ0FBUCxDQUFYLENBQXZCLElBQWlEQSxPQUFPLENBQVAsTUFBYSxNQUFqRTtBQUNDQSxxQkFBTyxDQUFQLElBQVksSUFBSXNCLElBQUosQ0FBU3RCLE9BQU8sQ0FBUCxDQUFULENBQVo7QUMwRE0scUJEekROQSxPQUFPdVIsR0FBUCxFQ3lETTtBRHZFUjtBQUREO0FBQUEsZUFnQkssSUFBRzFULEVBQUVrSixRQUFGLENBQVcvRyxNQUFYLENBQUg7QUFDSixjQUFHL0UsT0FBTzBCLFFBQVY7QUFDQyxnQkFBR2tCLEVBQUU0TyxVQUFGLENBQUF6TSxVQUFBLE9BQWFBLE9BQVFFLEtBQXJCLEdBQXFCLE1BQXJCLENBQUg7QUM0RE8scUJEM0RORixPQUFPME0sTUFBUCxHQUFnQjFNLE9BQU9FLEtBQVAsQ0FBYXVCLFFBQWIsRUMyRFY7QUQ1RFAsbUJBRUssSUFBRzVELEVBQUV5VCxNQUFGLENBQUF0UixVQUFBLE9BQVNBLE9BQVFFLEtBQWpCLEdBQWlCLE1BQWpCLENBQUg7QUM0REUscUJEM0RORixPQUFPd1IsUUFBUCxHQUFrQixJQzJEWjtBRC9EUjtBQUFBO0FBTUMsZ0JBQUczVCxFQUFFNEIsUUFBRixDQUFBTyxVQUFBLE9BQVdBLE9BQVEwTSxNQUFuQixHQUFtQixNQUFuQixDQUFIO0FDNkRPLHFCRDVETjFNLE9BQU9FLEtBQVAsR0FBZTVGLFFBQU8sTUFBUCxFQUFhLE1BQUkwRixPQUFPME0sTUFBWCxHQUFrQixHQUEvQixDQzREVDtBRDdEUCxtQkFFSyxJQUFHMU0sT0FBT3dSLFFBQVAsS0FBbUIsSUFBdEI7QUM2REUscUJENUROeFIsT0FBT0UsS0FBUCxHQUFlLElBQUlvQixJQUFKLENBQVN0QixPQUFPRSxLQUFoQixDQzREVDtBRHJFUjtBQURJO0FDeUVEO0FEMUZMLFFDeURFO0FBbUNEO0FEeEhIOztBQXdEQSxTQUFPbkUsTUFBUDtBQTNQdUIsQ0FBeEIsQzs7Ozs7Ozs7Ozs7O0FFUER6QixRQUFRb0YsUUFBUixHQUFtQixFQUFuQjtBQUVBcEYsUUFBUW9GLFFBQVIsQ0FBaUIrUixNQUFqQixHQUEwQixTQUExQjs7QUFFQW5YLFFBQVFvRixRQUFSLENBQWlCZ1Msd0JBQWpCLEdBQTRDLFVBQUNDLE1BQUQsRUFBUUMsYUFBUjtBQUMzQyxNQUFBQyxHQUFBLEVBQUFDLEdBQUE7QUFBQUQsUUFBTSxlQUFOO0FBRUFDLFFBQU1GLGNBQWN6RSxPQUFkLENBQXNCMEUsR0FBdEIsRUFBMkIsVUFBQ0UsQ0FBRCxFQUFJQyxFQUFKO0FBQ2hDLFdBQU9MLFNBQVNLLEdBQUc3RSxPQUFILENBQVcsT0FBWCxFQUFtQixLQUFuQixFQUEwQkEsT0FBMUIsQ0FBa0MsT0FBbEMsRUFBMEMsS0FBMUMsRUFBaURBLE9BQWpELENBQXlELFdBQXpELEVBQXFFLFFBQXJFLENBQWhCO0FBREssSUFBTjtBQUdBLFNBQU8yRSxHQUFQO0FBTjJDLENBQTVDOztBQVFBeFgsUUFBUW9GLFFBQVIsQ0FBaUJDLFlBQWpCLEdBQWdDLFVBQUNzUyxXQUFEO0FBQy9CLE1BQUdwVSxFQUFFNEIsUUFBRixDQUFXd1MsV0FBWCxLQUEyQkEsWUFBWTdTLE9BQVosQ0FBb0IsR0FBcEIsSUFBMkIsQ0FBQyxDQUF2RCxJQUE0RDZTLFlBQVk3UyxPQUFaLENBQW9CLEdBQXBCLElBQTJCLENBQUMsQ0FBM0Y7QUFDQyxXQUFPLElBQVA7QUNFQzs7QURERixTQUFPLEtBQVA7QUFIK0IsQ0FBaEM7O0FBS0E5RSxRQUFRb0YsUUFBUixDQUFpQjFDLEdBQWpCLEdBQXVCLFVBQUNpVixXQUFELEVBQWNDLFFBQWQsRUFBd0IxUyxPQUF4QjtBQUN0QixNQUFBMlMsT0FBQSxFQUFBdEksSUFBQSxFQUFBL08sQ0FBQSxFQUFBNkwsTUFBQTs7QUFBQSxNQUFHc0wsZUFBZXBVLEVBQUU0QixRQUFGLENBQVd3UyxXQUFYLENBQWxCO0FBRUMsUUFBRyxDQUFDcFUsRUFBRXVVLFNBQUYsQ0FBQTVTLFdBQUEsT0FBWUEsUUFBU21ILE1BQXJCLEdBQXFCLE1BQXJCLENBQUo7QUFDQ0EsZUFBUyxJQUFUO0FDSUU7O0FERkh3TCxjQUFVLEVBQVY7QUFDQUEsY0FBVXRVLEVBQUU4SSxNQUFGLENBQVN3TCxPQUFULEVBQWtCRCxRQUFsQixDQUFWOztBQUNBLFFBQUd2TCxNQUFIO0FBQ0N3TCxnQkFBVXRVLEVBQUU4SSxNQUFGLENBQVN3TCxPQUFULEVBQWtCN1gsUUFBUTRJLGNBQVIsQ0FBQTFELFdBQUEsT0FBdUJBLFFBQVNQLE1BQWhDLEdBQWdDLE1BQWhDLEVBQUFPLFdBQUEsT0FBd0NBLFFBQVNWLE9BQWpELEdBQWlELE1BQWpELENBQWxCLENBQVY7QUNJRTs7QURISG1ULGtCQUFjM1gsUUFBUW9GLFFBQVIsQ0FBaUJnUyx3QkFBakIsQ0FBMEMsTUFBMUMsRUFBa0RPLFdBQWxELENBQWQ7O0FBRUE7QUFDQ3BJLGFBQU92UCxRQUFReVUsYUFBUixDQUFzQmtELFdBQXRCLEVBQW1DRSxPQUFuQyxDQUFQO0FBQ0EsYUFBT3RJLElBQVA7QUFGRCxhQUFBdk8sS0FBQTtBQUdNUixVQUFBUSxLQUFBO0FBQ0xDLGNBQVFELEtBQVIsQ0FBYywyQkFBeUIyVyxXQUF2QyxFQUFzRG5YLENBQXREOztBQUNBLFVBQUdHLE9BQU84QyxRQUFWO0FDS0ssWUFBSSxPQUFPc1UsTUFBUCxLQUFrQixXQUFsQixJQUFpQ0EsV0FBVyxJQUFoRCxFQUFzRDtBREoxREEsaUJBQVEvVyxLQUFSLENBQWMsc0JBQWQ7QUFERDtBQ1FJOztBRE5KLFlBQU0sSUFBSUwsT0FBT3VJLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsMkJBQXlCeU8sV0FBekIsR0FBdUNuWCxDQUE3RCxDQUFOO0FBbEJGO0FDMkJFOztBRFBGLFNBQU9tWCxXQUFQO0FBckJzQixDQUF2QixDOzs7Ozs7Ozs7Ozs7QUVoQkEzWCxRQUFROEQsYUFBUixHQUF3QixFQUF4Qjs7QUFFQTlELFFBQVFnWSxnQkFBUixHQUEyQixVQUFDeFYsV0FBRDtBQUMxQixNQUFHQSxZQUFZcUIsVUFBWixDQUF1QixZQUF2QixDQUFIO0FBQ0NyQixrQkFBY0EsWUFBWXFRLE9BQVosQ0FBb0IsSUFBSXFCLE1BQUosQ0FBVyxLQUFYLEVBQWtCLEdBQWxCLENBQXBCLEVBQTRDLEdBQTVDLENBQWQ7QUNBQzs7QURDRixTQUFPMVIsV0FBUDtBQUgwQixDQUEzQjs7QUFLQXhDLFFBQVErQyxNQUFSLEdBQWlCLFVBQUNtQyxPQUFEO0FBQ2hCLE1BQUErUyxHQUFBLEVBQUFDLGNBQUEsRUFBQUMsaUJBQUEsRUFBQUMsbUJBQUEsRUFBQTdRLFdBQUEsRUFBQWxFLEdBQUEsRUFBQUMsSUFBQSxFQUFBd0ssSUFBQSxFQUFBdUssSUFBQSxFQUFBQyxNQUFBLEVBQUFDLElBQUE7O0FBQUFBLFNBQU8sSUFBUDs7QUFDQSxNQUFJLENBQUNyVCxRQUFRdkMsSUFBYjtBQUNDMUIsWUFBUUQsS0FBUixDQUFja0UsT0FBZDtBQUNBLFVBQU0sSUFBSWdFLEtBQUosQ0FBVSwwQ0FBVixDQUFOO0FDR0M7O0FEREZxUCxPQUFLbFUsR0FBTCxHQUFXYSxRQUFRYixHQUFSLElBQWVhLFFBQVF2QyxJQUFsQztBQUNBNFYsT0FBSzFWLEtBQUwsR0FBYXFDLFFBQVFyQyxLQUFyQjtBQUNBMFYsT0FBSzVWLElBQUwsR0FBWXVDLFFBQVF2QyxJQUFwQjtBQUNBNFYsT0FBSzNMLEtBQUwsR0FBYTFILFFBQVEwSCxLQUFyQjtBQUNBMkwsT0FBS0MsSUFBTCxHQUFZdFQsUUFBUXNULElBQXBCO0FBQ0FELE9BQUtFLFdBQUwsR0FBbUJ2VCxRQUFRdVQsV0FBM0I7QUFDQUYsT0FBS0csT0FBTCxHQUFleFQsUUFBUXdULE9BQXZCOztBQUNBLE1BQUcsQ0FBQ25WLEVBQUV1VSxTQUFGLENBQVk1UyxRQUFReVQsU0FBcEIsQ0FBRCxJQUFvQ3pULFFBQVF5VCxTQUFSLEtBQXFCLElBQTVEO0FBQ0NKLFNBQUtJLFNBQUwsR0FBaUIsSUFBakI7QUFERDtBQUdDSixTQUFLSSxTQUFMLEdBQWlCLEtBQWpCO0FDR0M7O0FERkZKLE9BQUtLLGFBQUwsR0FBcUIxVCxRQUFRMFQsYUFBN0I7QUFDQUwsT0FBSzlRLFlBQUwsR0FBb0J2QyxRQUFRdUMsWUFBNUI7QUFDQThRLE9BQUtuUSxZQUFMLEdBQW9CbEQsUUFBUWtELFlBQTVCO0FBQ0FtUSxPQUFLbFEsWUFBTCxHQUFvQm5ELFFBQVFtRCxZQUE1QjtBQUNBa1EsT0FBSzdQLFlBQUwsR0FBb0J4RCxRQUFRd0QsWUFBNUI7QUFDQTZQLE9BQUt6SCxNQUFMLEdBQWM1TCxRQUFRNEwsTUFBdEI7QUFDQXlILE9BQUtNLFVBQUwsR0FBbUIzVCxRQUFRMlQsVUFBUixLQUFzQixNQUF2QixJQUFxQzNULFFBQVEyVCxVQUEvRDtBQUNBTixPQUFLTyxNQUFMLEdBQWM1VCxRQUFRNFQsTUFBdEI7QUFDQVAsT0FBS1EsWUFBTCxHQUFvQjdULFFBQVE2VCxZQUE1QjtBQUNBUixPQUFLaFEsZ0JBQUwsR0FBd0JyRCxRQUFRcUQsZ0JBQWhDO0FBQ0FnUSxPQUFLUyxXQUFMLEdBQW1COVQsUUFBUThULFdBQTNCO0FBQ0FULE9BQUtVLFdBQUwsR0FBbUIvVCxRQUFRK1QsV0FBM0I7QUFDQVYsT0FBS1csY0FBTCxHQUFzQmhVLFFBQVFnVSxjQUE5QjtBQUNBWCxPQUFLWSxRQUFMLEdBQWdCNVYsRUFBRXVPLEtBQUYsQ0FBUTVNLFFBQVFpVSxRQUFoQixDQUFoQjtBQUNBWixPQUFLYSxPQUFMLEdBQWU3VixFQUFFdU8sS0FBRixDQUFRNU0sUUFBUWtVLE9BQWhCLENBQWY7QUFDQWIsT0FBS2MsY0FBTCxHQUFzQm5VLFFBQVFtVSxjQUE5QjtBQUNBZCxPQUFLZSxZQUFMLEdBQW9CcFUsUUFBUW9VLFlBQTVCO0FBQ0FmLE9BQUtnQixtQkFBTCxHQUEyQnJVLFFBQVFxVSxtQkFBbkM7QUFDQWhCLE9BQUsvUCxnQkFBTCxHQUF3QnRELFFBQVFzRCxnQkFBaEM7QUFDQStQLE9BQUtpQixXQUFMLEdBQW1CLEtBQW5COztBQUNBLE1BQUd0VSxRQUFRdVUsYUFBWDtBQUNDbEIsU0FBS2tCLGFBQUwsR0FBcUJ2VSxRQUFRdVUsYUFBN0I7QUNJQzs7QURIRixNQUFJLENBQUN2VSxRQUFRNEMsTUFBYjtBQUNDN0csWUFBUUQsS0FBUixDQUFja0UsT0FBZDtBQUNBLFVBQU0sSUFBSWdFLEtBQUosQ0FBVSwwQ0FBVixDQUFOO0FDS0M7O0FESEZxUCxPQUFLelEsTUFBTCxHQUFjdkUsRUFBRXVPLEtBQUYsQ0FBUTVNLFFBQVE0QyxNQUFoQixDQUFkOztBQUVBdkUsSUFBRWtDLElBQUYsQ0FBTzhTLEtBQUt6USxNQUFaLEVBQW9CLFVBQUNzSSxLQUFELEVBQVFELFVBQVI7QUFDbkIsUUFBR0EsZUFBYyxNQUFkLElBQXdCQyxNQUFNc0osT0FBakM7QUFDQ25CLFdBQUt2TSxjQUFMLEdBQXNCbUUsVUFBdEI7QUNJRTs7QURISCxRQUFHQyxNQUFNdUosT0FBVDtBQ0tJLGFESkhwQixLQUFLaUIsV0FBTCxHQUFtQnJKLFVDSWhCO0FBQ0Q7QURUSjs7QUFNQSxNQUFHLENBQUNqTCxRQUFRdVUsYUFBVCxJQUEwQnZVLFFBQVF1VSxhQUFSLEtBQXlCLGNBQXREO0FBQ0NsVyxNQUFFa0MsSUFBRixDQUFPekYsUUFBUTRaLFVBQVIsQ0FBbUI5UixNQUExQixFQUFrQyxVQUFDc0ksS0FBRCxFQUFRRCxVQUFSO0FBQ2pDLFVBQUcsQ0FBQ29JLEtBQUt6USxNQUFMLENBQVlxSSxVQUFaLENBQUo7QUFDQ29JLGFBQUt6USxNQUFMLENBQVlxSSxVQUFaLElBQTBCLEVBQTFCO0FDTUc7O0FBQ0QsYUROSG9JLEtBQUt6USxNQUFMLENBQVlxSSxVQUFaLElBQTBCNU0sRUFBRThJLE1BQUYsQ0FBUzlJLEVBQUV1TyxLQUFGLENBQVExQixLQUFSLENBQVQsRUFBeUJtSSxLQUFLelEsTUFBTCxDQUFZcUksVUFBWixDQUF6QixDQ012QjtBRFRKO0FDV0M7O0FETkZvSSxPQUFLM1YsVUFBTCxHQUFrQixFQUFsQjtBQUNBc1YsbUJBQWlCbFksUUFBUW9SLHVCQUFSLENBQWdDbUgsS0FBSzVWLElBQXJDLENBQWpCOztBQUNBWSxJQUFFa0MsSUFBRixDQUFPUCxRQUFRdEMsVUFBZixFQUEyQixVQUFDaVIsSUFBRCxFQUFPZ0csU0FBUDtBQUMxQixRQUFBaEksS0FBQTtBQUFBQSxZQUFRN1IsUUFBUXlSLGVBQVIsQ0FBd0J5RyxjQUF4QixFQUF3Q3JFLElBQXhDLEVBQThDZ0csU0FBOUMsQ0FBUjtBQ1NFLFdEUkZ0QixLQUFLM1YsVUFBTCxDQUFnQmlYLFNBQWhCLElBQTZCaEksS0NRM0I7QURWSDs7QUFJQTBHLE9BQUt0RCxRQUFMLEdBQWdCMVIsRUFBRXVPLEtBQUYsQ0FBUTlSLFFBQVE0WixVQUFSLENBQW1CM0UsUUFBM0IsQ0FBaEI7O0FBQ0ExUixJQUFFa0MsSUFBRixDQUFPUCxRQUFRK1AsUUFBZixFQUF5QixVQUFDcEIsSUFBRCxFQUFPZ0csU0FBUDtBQUN4QixRQUFHLENBQUN0QixLQUFLdEQsUUFBTCxDQUFjNEUsU0FBZCxDQUFKO0FBQ0N0QixXQUFLdEQsUUFBTCxDQUFjNEUsU0FBZCxJQUEyQixFQUEzQjtBQ1NFOztBRFJIdEIsU0FBS3RELFFBQUwsQ0FBYzRFLFNBQWQsRUFBeUJsWCxJQUF6QixHQUFnQ2tYLFNBQWhDO0FDVUUsV0RURnRCLEtBQUt0RCxRQUFMLENBQWM0RSxTQUFkLElBQTJCdFcsRUFBRThJLE1BQUYsQ0FBUzlJLEVBQUV1TyxLQUFGLENBQVF5RyxLQUFLdEQsUUFBTCxDQUFjNEUsU0FBZCxDQUFSLENBQVQsRUFBNENoRyxJQUE1QyxDQ1N6QjtBRGJIOztBQU1BMEUsT0FBSy9DLE9BQUwsR0FBZWpTLEVBQUV1TyxLQUFGLENBQVE5UixRQUFRNFosVUFBUixDQUFtQnBFLE9BQTNCLENBQWY7O0FBQ0FqUyxJQUFFa0MsSUFBRixDQUFPUCxRQUFRc1EsT0FBZixFQUF3QixVQUFDM0IsSUFBRCxFQUFPZ0csU0FBUDtBQUN2QixRQUFBQyxRQUFBOztBQUFBLFFBQUcsQ0FBQ3ZCLEtBQUsvQyxPQUFMLENBQWFxRSxTQUFiLENBQUo7QUFDQ3RCLFdBQUsvQyxPQUFMLENBQWFxRSxTQUFiLElBQTBCLEVBQTFCO0FDV0U7O0FEVkhDLGVBQVd2VyxFQUFFdU8sS0FBRixDQUFReUcsS0FBSy9DLE9BQUwsQ0FBYXFFLFNBQWIsQ0FBUixDQUFYO0FBQ0EsV0FBT3RCLEtBQUsvQyxPQUFMLENBQWFxRSxTQUFiLENBQVA7QUNZRSxXRFhGdEIsS0FBSy9DLE9BQUwsQ0FBYXFFLFNBQWIsSUFBMEJ0VyxFQUFFOEksTUFBRixDQUFTeU4sUUFBVCxFQUFtQmpHLElBQW5CLENDV3hCO0FEaEJIOztBQU9BdFEsSUFBRWtDLElBQUYsQ0FBTzhTLEtBQUsvQyxPQUFaLEVBQXFCLFVBQUMzQixJQUFELEVBQU9nRyxTQUFQO0FDWWxCLFdEWEZoRyxLQUFLbFIsSUFBTCxHQUFZa1gsU0NXVjtBRFpIOztBQUdBdEIsT0FBSy9RLGVBQUwsR0FBdUJ4SCxRQUFRcUgsaUJBQVIsQ0FBMEJrUixLQUFLNVYsSUFBL0IsQ0FBdkI7QUFHQTRWLE9BQUt3QixjQUFMLEdBQXNCeFcsRUFBRXVPLEtBQUYsQ0FBUTlSLFFBQVE0WixVQUFSLENBQW1CRyxjQUEzQixDQUF0Qjs7QUF3QkEsT0FBTzdVLFFBQVE2VSxjQUFmO0FBQ0M3VSxZQUFRNlUsY0FBUixHQUF5QixFQUF6QjtBQ2JDOztBRGNGLE1BQUcsRUFBQyxDQUFBMVcsTUFBQTZCLFFBQUE2VSxjQUFBLFlBQUExVyxJQUF5QjJXLEtBQXpCLEdBQXlCLE1BQTFCLENBQUg7QUFDQzlVLFlBQVE2VSxjQUFSLENBQXVCQyxLQUF2QixHQUErQnpXLEVBQUV1TyxLQUFGLENBQVF5RyxLQUFLd0IsY0FBTCxDQUFvQixPQUFwQixDQUFSLENBQS9CO0FDWkM7O0FEYUYsTUFBRyxFQUFDLENBQUF6VyxPQUFBNEIsUUFBQTZVLGNBQUEsWUFBQXpXLEtBQXlCb0csSUFBekIsR0FBeUIsTUFBMUIsQ0FBSDtBQUNDeEUsWUFBUTZVLGNBQVIsQ0FBdUJyUSxJQUF2QixHQUE4Qm5HLEVBQUV1TyxLQUFGLENBQVF5RyxLQUFLd0IsY0FBTCxDQUFvQixNQUFwQixDQUFSLENBQTlCO0FDWEM7O0FEWUZ4VyxJQUFFa0MsSUFBRixDQUFPUCxRQUFRNlUsY0FBZixFQUErQixVQUFDbEcsSUFBRCxFQUFPZ0csU0FBUDtBQUM5QixRQUFHLENBQUN0QixLQUFLd0IsY0FBTCxDQUFvQkYsU0FBcEIsQ0FBSjtBQUNDdEIsV0FBS3dCLGNBQUwsQ0FBb0JGLFNBQXBCLElBQWlDLEVBQWpDO0FDVkU7O0FBQ0QsV0RVRnRCLEtBQUt3QixjQUFMLENBQW9CRixTQUFwQixJQUFpQ3RXLEVBQUU4SSxNQUFGLENBQVM5SSxFQUFFdU8sS0FBRixDQUFReUcsS0FBS3dCLGNBQUwsQ0FBb0JGLFNBQXBCLENBQVIsQ0FBVCxFQUFrRGhHLElBQWxELENDVi9CO0FET0g7O0FBTUEsTUFBR2xULE9BQU84QyxRQUFWO0FBQ0M4RCxrQkFBY3JDLFFBQVFxQyxXQUF0QjtBQUNBNlEsMEJBQUE3USxlQUFBLE9BQXNCQSxZQUFhNlEsbUJBQW5DLEdBQW1DLE1BQW5DOztBQUNBLFFBQUFBLHVCQUFBLE9BQUdBLG9CQUFxQnZTLE1BQXhCLEdBQXdCLE1BQXhCO0FBQ0NzUywwQkFBQSxDQUFBckssT0FBQTVJLFFBQUF0QyxVQUFBLGFBQUF5VixPQUFBdkssS0FBQW1NLEdBQUEsWUFBQTVCLEtBQTZDaFUsR0FBN0MsR0FBNkMsTUFBN0MsR0FBNkMsTUFBN0M7O0FBQ0EsVUFBRzhULGlCQUFIO0FBRUM1USxvQkFBWTZRLG1CQUFaLEdBQWtDN1UsRUFBRXFOLEdBQUYsQ0FBTXdILG1CQUFOLEVBQTJCLFVBQUM4QixjQUFEO0FBQ3JELGNBQUcvQixzQkFBcUIrQixjQUF4QjtBQ1hBLG1CRFc0QyxLQ1g1QztBRFdBO0FDVEEsbUJEU3VEQSxjQ1R2RDtBQUNEO0FETzJCLFVBQWxDO0FBSkY7QUNBRzs7QURNSDNCLFNBQUtoUixXQUFMLEdBQW1CLElBQUk0UyxXQUFKLENBQWdCNVMsV0FBaEIsQ0FBbkI7O0FBQ0FoRSxNQUFFa0MsSUFBRixDQUFPOFMsS0FBS3pRLE1BQVosRUFBb0IsVUFBQ3NJLEtBQUQsRUFBUUQsVUFBUjtBQUNuQixVQUFHQyxLQUFIO0FBQ0MsWUFBRzdNLEVBQUV1QixPQUFGLENBQUF5QyxlQUFBLE9BQVVBLFlBQWE2UyxpQkFBdkIsR0FBdUIsTUFBdkIsRUFBMENqSyxVQUExQyxJQUF3RCxDQUEzRDtBQUNDLGNBQUdDLE1BQU1VLE1BQVQ7QUFDQztBQ0pLOztBREtOLGNBQUd2TixFQUFFdUIsT0FBRixDQUFBeUMsZUFBQSxPQUFVQSxZQUFhOFMsaUJBQXZCLEdBQXVCLE1BQXZCLEVBQTBDbEssVUFBMUMsSUFBd0QsQ0FBQyxDQUE1RDtBQUNDQyxrQkFBTWtLLFFBQU4sR0FBaUIsSUFBakI7QUFDQWxLLGtCQUFNbUssUUFBTixHQUFpQixJQUFqQjtBQ0hNLG1CREtObkssTUFBTW9LLFFBQU4sR0FBaUIsS0NMWDtBREZSO0FBQUE7QUNLTSxpQkRJTHBLLE1BQU1VLE1BQU4sR0FBZSxJQ0pWO0FETlA7QUNRSTtBRFRMO0FBVkQ7QUF1QkN5SCxTQUFLaFIsV0FBTCxHQUFtQixJQUFuQjtBQ0FDOztBREVGMFEsUUFBTWpZLFFBQVF5YSxnQkFBUixDQUF5QnZWLE9BQXpCLENBQU47QUFFQWxGLFVBQVFFLFdBQVIsQ0FBb0IrWCxJQUFJeUMsS0FBeEIsSUFBaUN6QyxHQUFqQztBQUVBTSxPQUFLeFksRUFBTCxHQUFVa1ksR0FBVjtBQUVBTSxPQUFLdFUsZ0JBQUwsR0FBd0JnVSxJQUFJeUMsS0FBNUI7QUFFQXBDLFdBQVN0WSxRQUFRMmEsZUFBUixDQUF3QnBDLElBQXhCLENBQVQ7QUFDQUEsT0FBS0QsTUFBTCxHQUFjLElBQUkzVyxZQUFKLENBQWlCMlcsTUFBakIsQ0FBZDs7QUFDQSxNQUFHQyxLQUFLNVYsSUFBTCxLQUFhLE9BQWIsSUFBeUI0VixLQUFLNVYsSUFBTCxLQUFhLHNCQUF0QyxJQUFnRSxDQUFDNFYsS0FBS0csT0FBdEUsSUFBaUYsQ0FBQ25WLEVBQUVxWCxRQUFGLENBQVcsQ0FBQyxPQUFELEVBQVUsT0FBVixFQUFtQixXQUFuQixFQUFnQyxlQUFoQyxDQUFYLEVBQTZEckMsS0FBSzVWLElBQWxFLENBQXJGO0FBQ0MsUUFBR2hDLE9BQU84QyxRQUFWO0FBQ0N3VSxVQUFJNEMsWUFBSixDQUFpQnRDLEtBQUtELE1BQXRCLEVBQThCO0FBQUN6RixpQkFBUztBQUFWLE9BQTlCO0FBREQ7QUFHQ29GLFVBQUk0QyxZQUFKLENBQWlCdEMsS0FBS0QsTUFBdEIsRUFBOEI7QUFBQ3pGLGlCQUFTO0FBQVYsT0FBOUI7QUFKRjtBQ0tFOztBREFGLE1BQUcwRixLQUFLNVYsSUFBTCxLQUFhLE9BQWhCO0FBQ0NzVixRQUFJNkMsYUFBSixHQUFvQnZDLEtBQUtELE1BQXpCO0FDRUM7O0FEQUYsTUFBRy9VLEVBQUVxWCxRQUFGLENBQVcsQ0FBQyxPQUFELEVBQVUsT0FBVixFQUFtQixXQUFuQixFQUFnQyxlQUFoQyxDQUFYLEVBQTZEckMsS0FBSzVWLElBQWxFLENBQUg7QUFDQyxRQUFHaEMsT0FBTzhDLFFBQVY7QUFDQ3dVLFVBQUk0QyxZQUFKLENBQWlCdEMsS0FBS0QsTUFBdEIsRUFBOEI7QUFBQ3pGLGlCQUFTO0FBQVYsT0FBOUI7QUFGRjtBQ09FOztBREhGN1MsVUFBUThELGFBQVIsQ0FBc0J5VSxLQUFLdFUsZ0JBQTNCLElBQStDc1UsSUFBL0M7QUFFQSxTQUFPQSxJQUFQO0FBektnQixDQUFqQjs7QUEyS0F2WSxRQUFRK0MsTUFBUixDQUFlZ1ksU0FBZixDQUF5QkMsSUFBekIsR0FBZ0M7QUFFL0IsTUFBQWpVLEdBQUEsRUFBQXdSLElBQUE7QUFBQUEsU0FBTyxJQUFQO0FBRUF4UixRQUFNd1IsS0FBSzVWLElBQVg7O0FBQ0EsTUFBR3NZLEVBQUVsVSxHQUFGLE1BQVVBLEdBQWI7QUFDQyxRQUFHLENBQUN3UixLQUFLM0wsS0FBVDtBQUNDMkwsV0FBSzNMLEtBQUwsR0FBYTJMLEtBQUs1VixJQUFsQjtBQUZGO0FBQUE7QUFJQzRWLFNBQUszTCxLQUFMLEdBQWFxTyxFQUFFbFUsR0FBRixDQUFiO0FDS0M7O0FERkZ4RCxJQUFFa0MsSUFBRixDQUFPOFMsS0FBS3pRLE1BQVosRUFBb0IsVUFBQ3NJLEtBQUQsRUFBUUQsVUFBUjtBQUNuQixRQUFBK0ssSUFBQSxFQUFBN1gsR0FBQSxFQUFBQyxJQUFBLEVBQUF3SyxJQUFBO0FBQUFvTixXQUFPM0MsS0FBSzVWLElBQUwsR0FBWSxHQUFaLEdBQWtCd04sVUFBekI7O0FBQ0EsUUFBRzhLLEVBQUVDLElBQUYsTUFBV0EsSUFBZDtBQUNDLFVBQUcsQ0FBQzlLLE1BQU14RCxLQUFWO0FBQ0N3RCxjQUFNeEQsS0FBTixHQUFjdUQsVUFBZDtBQUZGO0FBQUE7QUFJQ0MsWUFBTXhELEtBQU4sR0FBY3FPLEVBQUVDLElBQUYsQ0FBZDtBQ01FOztBQUNELFdBQU8sQ0FBQzdYLE1BQU1rVixLQUFLRCxNQUFaLEtBQXVCLElBQXZCLEdBQThCLENBQUNoVixPQUFPRCxJQUFJME0sT0FBWixLQUF3QixJQUF4QixHQUErQixDQUFDakMsT0FBT3hLLEtBQUs2TSxVQUFMLENBQVIsS0FBNkIsSUFBN0IsR0FBb0NyQyxLRE52RWxCLEtDTXVFLEdETi9Ed0QsTUFBTXhELEtDTXFCLEdETnJCLE1DTVYsR0ROVSxNQ014QyxHRE53QyxNQ00vQztBRGJIOztBQ2VDLFNESkRySixFQUFFa0MsSUFBRixDQUFPOFMsS0FBSzNWLFVBQVosRUFBd0IsVUFBQ2lSLElBQUQsRUFBT2dHLFNBQVA7QUFDdkIsUUFBQXNCLFFBQUE7QUFBQUEsZUFBVzVDLEtBQUs1VixJQUFMLEdBQVksWUFBWixHQUEyQmtYLFNBQXRDOztBQUNBLFFBQUdvQixFQUFFRSxRQUFGLE1BQWVBLFFBQWxCO0FBQ0MsVUFBRyxDQUFDdEgsS0FBS2pILEtBQVQ7QUNNSyxlRExKaUgsS0FBS2pILEtBQUwsR0FBYWlOLFNDS1Q7QURQTjtBQUFBO0FDVUksYUROSGhHLEtBQUtqSCxLQUFMLEdBQWFxTyxFQUFFRSxRQUFGLENDTVY7QUFDRDtBRGJKLElDSUM7QUQzQjhCLENBQWhDOztBQWdDQW5iLFFBQVFvYiwwQkFBUixHQUFxQyxVQUFDM1osTUFBRDtBQUNwQyxNQUFHQSxNQUFIO0FBQ0MsUUFBRyxDQUFDQSxPQUFPZ1ksYUFBUixJQUF5QmhZLE9BQU9nWSxhQUFQLEtBQXdCLGNBQXBEO0FBQ0MsYUFBTyxlQUFQO0FBREQ7QUFHQyxhQUFPLGdCQUFjaFksT0FBT2dZLGFBQTVCO0FBSkY7QUNjRTtBRGZrQyxDQUFyQzs7QUFPQSxJQUFHOVksT0FBTzhDLFFBQVY7QUFFQzlDLFNBQU9FLE9BQVAsQ0FBZTtBQ1daLFdEVkZVLFFBQVE4WixPQUFSLENBQWdCO0FBQ2YsVUFBQWhZLEdBQUE7O0FBQUEsVUFBR00sUUFBUUMsR0FBUixDQUFZLGdCQUFaLE9BQUFQLE1BQUFyRCxRQUFBc2IsZUFBQSxZQUFBalksSUFBMERPLEdBQTFELEtBQWlDLE1BQWpDLENBQUg7QUNZSyxlRFhKTCxFQUFFa0MsSUFBRixDQUFPekYsUUFBUThELGFBQWYsRUFBOEIsVUFBQ3JDLE1BQUQsRUFBU2UsV0FBVDtBQ1l4QixpQkRYTGYsT0FBT3VaLElBQVAsRUNXSztBRFpOLFVDV0k7QUFHRDtBRGhCTCxNQ1VFO0FEWEg7QUNvQkE7O0FEZERyYSxPQUFPRSxPQUFQLENBQWU7QUFDZCxNQUFHLENBQUNiLFFBQVFzYixlQUFULElBQTRCdGIsUUFBUUMsT0FBdkM7QUNpQkcsV0RoQkZzRCxFQUFFa0MsSUFBRixDQUFPekYsUUFBUUMsT0FBZixFQUF3QixVQUFDd0IsTUFBRDtBQ2lCcEIsYURoQkgsSUFBSXpCLFFBQVErQyxNQUFaLENBQW1CdEIsTUFBbkIsQ0NnQkc7QURqQkosTUNnQkU7QUFHRDtBRHJCSCxHOzs7Ozs7Ozs7Ozs7QUVsT0F6QixRQUFRMmEsZUFBUixHQUEwQixVQUFDcFksR0FBRDtBQUN6QixNQUFBZ1osU0FBQSxFQUFBakQsTUFBQTtBQUFBQSxXQUFTLEVBQVQ7QUFFQWlELGNBQVksRUFBWjs7QUFFQWhZLElBQUVrQyxJQUFGLENBQU9sRCxJQUFJdUYsTUFBWCxFQUFvQixVQUFDc0ksS0FBRCxFQUFRRCxVQUFSO0FBQ25CLFFBQUcsQ0FBQzVNLEVBQUV3TyxHQUFGLENBQU0zQixLQUFOLEVBQWEsTUFBYixDQUFKO0FBQ0NBLFlBQU16TixJQUFOLEdBQWF3TixVQUFiO0FDQUU7O0FBQ0QsV0RBRm9MLFVBQVU3VCxJQUFWLENBQWUwSSxLQUFmLENDQUU7QURISDs7QUFLQTdNLElBQUVrQyxJQUFGLENBQU9sQyxFQUFFK0MsTUFBRixDQUFTaVYsU0FBVCxFQUFvQixTQUFwQixDQUFQLEVBQXVDLFVBQUNuTCxLQUFEO0FBRXRDLFFBQUE5SSxPQUFBLEVBQUFrVSxRQUFBLEVBQUEvRSxhQUFBLEVBQUFnRixhQUFBLEVBQUF0TCxVQUFBLEVBQUF1TCxFQUFBLEVBQUFDLFdBQUEsRUFBQXBVLFdBQUEsRUFBQWxFLEdBQUEsRUFBQUMsSUFBQSxFQUFBd0ssSUFBQSxFQUFBdUssSUFBQTs7QUFBQWxJLGlCQUFhQyxNQUFNek4sSUFBbkI7QUFFQStZLFNBQUssRUFBTDs7QUFDQSxRQUFHdEwsTUFBTWlFLEtBQVQ7QUFDQ3FILFNBQUdySCxLQUFILEdBQVdqRSxNQUFNaUUsS0FBakI7QUNBRTs7QURDSHFILE9BQUduTCxRQUFILEdBQWMsRUFBZDtBQUNBbUwsT0FBR25MLFFBQUgsQ0FBWXFMLFFBQVosR0FBdUJ4TCxNQUFNd0wsUUFBN0I7QUFDQUYsT0FBR25MLFFBQUgsQ0FBWXJJLFlBQVosR0FBMkJrSSxNQUFNbEksWUFBakM7QUFFQXVULG9CQUFBLENBQUFwWSxNQUFBK00sTUFBQUcsUUFBQSxZQUFBbE4sSUFBZ0M0RSxJQUFoQyxHQUFnQyxNQUFoQzs7QUFFQSxRQUFHbUksTUFBTW5JLElBQU4sS0FBYyxNQUFkLElBQXdCbUksTUFBTW5JLElBQU4sS0FBYyxPQUF6QztBQUNDeVQsU0FBR3pULElBQUgsR0FBVS9GLE1BQVY7O0FBQ0EsVUFBR2tPLE1BQU13TCxRQUFUO0FBQ0NGLFdBQUd6VCxJQUFILEdBQVUsQ0FBQy9GLE1BQUQsQ0FBVjtBQUNBd1osV0FBR25MLFFBQUgsQ0FBWXRJLElBQVosR0FBbUIsTUFBbkI7QUFKRjtBQUFBLFdBS0ssSUFBR21JLE1BQU1uSSxJQUFOLEtBQWMsUUFBZCxJQUEwQm1JLE1BQU1uSSxJQUFOLEtBQWMsU0FBM0M7QUFDSnlULFNBQUd6VCxJQUFILEdBQVUsQ0FBQy9GLE1BQUQsQ0FBVjtBQUNBd1osU0FBR25MLFFBQUgsQ0FBWXRJLElBQVosR0FBbUIsTUFBbkI7QUFGSSxXQUdBLElBQUdtSSxNQUFNbkksSUFBTixLQUFjLE1BQWpCO0FBQ0p5VCxTQUFHelQsSUFBSCxHQUFVL0YsTUFBVjtBQUNBd1osU0FBR25MLFFBQUgsQ0FBWXRJLElBQVosR0FBbUIsVUFBbkI7QUFDQXlULFNBQUduTCxRQUFILENBQVlzTCxJQUFaLEdBQW1CekwsTUFBTXlMLElBQU4sSUFBYyxFQUFqQzs7QUFDQSxVQUFHekwsTUFBTTBMLFFBQVQ7QUFDQ0osV0FBR25MLFFBQUgsQ0FBWXVMLFFBQVosR0FBdUIxTCxNQUFNMEwsUUFBN0I7QUFMRztBQUFBLFdBTUEsSUFBRzFMLE1BQU1uSSxJQUFOLEtBQWMsVUFBakI7QUFDSnlULFNBQUd6VCxJQUFILEdBQVUvRixNQUFWO0FBQ0F3WixTQUFHbkwsUUFBSCxDQUFZdEksSUFBWixHQUFtQixVQUFuQjtBQUNBeVQsU0FBR25MLFFBQUgsQ0FBWXNMLElBQVosR0FBbUJ6TCxNQUFNeUwsSUFBTixJQUFjLENBQWpDO0FBSEksV0FJQSxJQUFHekwsTUFBTW5JLElBQU4sS0FBYyxVQUFqQjtBQUNKeVQsU0FBR3pULElBQUgsR0FBVS9GLE1BQVY7QUFDQXdaLFNBQUduTCxRQUFILENBQVl0SSxJQUFaLEdBQW1CLFVBQW5CO0FBRkksV0FHQSxJQUFHbUksTUFBTW5JLElBQU4sS0FBYyxNQUFqQjtBQUNKeVQsU0FBR3pULElBQUgsR0FBVWpCLElBQVY7O0FBQ0EsVUFBR3JHLE9BQU84QyxRQUFWO0FBQ0MsWUFBR3lELFFBQVE2VSxRQUFSLE1BQXNCN1UsUUFBUThVLEtBQVIsRUFBekI7QUFFQ04sYUFBR25MLFFBQUgsQ0FBWTBMLFlBQVosR0FDQztBQUFBaFUsa0JBQU0scUJBQU47QUFDQWlVLCtCQUNDO0FBQUFqVSxvQkFBTTtBQUFOO0FBRkQsV0FERDtBQUZEO0FBT0N5VCxhQUFHbkwsUUFBSCxDQUFZNEwsU0FBWixHQUF3QixZQUF4QjtBQUVBVCxhQUFHbkwsUUFBSCxDQUFZMEwsWUFBWixHQUNDO0FBQUFoVSxrQkFBTSxhQUFOO0FBQ0FtVSx3QkFBWSxLQURaO0FBRUFDLDhCQUNDO0FBQUFwVSxvQkFBTSxNQUFOO0FBQ0FxVSw2QkFBZTtBQURmO0FBSEQsV0FERDtBQVZGO0FBRkk7QUFBQSxXQW1CQSxJQUFHbE0sTUFBTW5JLElBQU4sS0FBYyxVQUFqQjtBQUNKeVQsU0FBR3pULElBQUgsR0FBVWpCLElBQVY7O0FBQ0EsVUFBR3JHLE9BQU84QyxRQUFWO0FBQ0MsWUFBR3lELFFBQVE2VSxRQUFSLE1BQXNCN1UsUUFBUThVLEtBQVIsRUFBekI7QUFFQ04sYUFBR25MLFFBQUgsQ0FBWTBMLFlBQVosR0FDQztBQUFBaFUsa0JBQU0scUJBQU47QUFDQWlVLCtCQUNDO0FBQUFqVSxvQkFBTTtBQUFOO0FBRkQsV0FERDtBQUZEO0FBUUN5VCxhQUFHbkwsUUFBSCxDQUFZMEwsWUFBWixHQUNDO0FBQUFoVSxrQkFBTSxhQUFOO0FBQ0FvVSw4QkFDQztBQUFBcFUsb0JBQU0sVUFBTjtBQUNBcVUsNkJBQWU7QUFEZjtBQUZELFdBREQ7QUFURjtBQUZJO0FBQUEsV0FnQkEsSUFBR2xNLE1BQU1uSSxJQUFOLEtBQWMsVUFBakI7QUFDSnlULFNBQUd6VCxJQUFILEdBQVUsQ0FBQ2xGLE1BQUQsQ0FBVjtBQURJLFdBRUEsSUFBR3FOLE1BQU1uSSxJQUFOLEtBQWMsTUFBakI7QUFDSnlULFNBQUd6VCxJQUFILEdBQVUvRixNQUFWO0FBQ0F3WixTQUFHbkwsUUFBSCxDQUFZMEwsWUFBWixHQUNDO0FBQUFoVSxjQUFNLFlBQU47QUFDQSxpQkFBTyxRQURQO0FBRUFzRyxrQkFDQztBQUFBZ08sa0JBQVEsR0FBUjtBQUNBQyx5QkFBZSxJQURmO0FBRUFDLG1CQUFVLENBQ1QsQ0FBQyxPQUFELEVBQVUsQ0FBQyxPQUFELENBQVYsQ0FEUyxFQUVULENBQUMsT0FBRCxFQUFVLENBQUMsTUFBRCxFQUFTLFdBQVQsRUFBc0IsUUFBdEIsRUFBZ0MsT0FBaEMsQ0FBVixDQUZTLEVBR1QsQ0FBQyxPQUFELEVBQVUsQ0FBQyxVQUFELENBQVYsQ0FIUyxFQUlULENBQUMsT0FBRCxFQUFVLENBQUMsT0FBRCxDQUFWLENBSlMsRUFLVCxDQUFDLE1BQUQsRUFBUyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsV0FBYixDQUFULENBTFMsRUFNVCxDQUFDLE9BQUQsRUFBVSxDQUFDLE9BQUQsQ0FBVixDQU5TLEVBT1QsQ0FBQyxRQUFELEVBQVcsQ0FBQyxNQUFELEVBQVMsU0FBVCxDQUFYLENBUFMsRUFRVCxDQUFDLE1BQUQsRUFBUyxDQUFDLFVBQUQsQ0FBVCxDQVJTLENBRlY7QUFZQUMscUJBQVcsQ0FBQyxPQUFELEVBQVUsZUFBVixFQUEyQixhQUEzQixFQUEwQyxXQUExQyxFQUF1RCxRQUF2RCxFQUFpRSxJQUFqRSxFQUFzRSxJQUF0RSxFQUEyRSxNQUEzRSxFQUFrRixJQUFsRixFQUF1RixJQUF2RixFQUE0RixJQUE1RixFQUFpRyxJQUFqRztBQVpYO0FBSEQsT0FERDtBQUZJLFdBb0JBLElBQUl0TSxNQUFNbkksSUFBTixLQUFjLFFBQWQsSUFBMEJtSSxNQUFNbkksSUFBTixLQUFjLGVBQTVDO0FBQ0p5VCxTQUFHelQsSUFBSCxHQUFVL0YsTUFBVjs7QUFFQSxVQUFHa08sTUFBTXdMLFFBQVQ7QUFDQ0YsV0FBR3pULElBQUgsR0FBVSxDQUFDL0YsTUFBRCxDQUFWO0FDREc7O0FER0osVUFBRyxDQUFDa08sTUFBTVUsTUFBVjtBQUVDNEssV0FBR25MLFFBQUgsQ0FBWWhMLE9BQVosR0FBc0I2SyxNQUFNN0ssT0FBNUI7QUFFQW1XLFdBQUduTCxRQUFILENBQVlvTSxRQUFaLEdBQXVCdk0sTUFBTXdNLFNBQTdCOztBQUVBLFlBQUd4TSxNQUFNMkYsa0JBQVQ7QUFDQzJGLGFBQUczRixrQkFBSCxHQUF3QjNGLE1BQU0yRixrQkFBOUI7QUNKSTs7QURNTDJGLFdBQUc3WixlQUFILEdBQXdCdU8sTUFBTXZPLGVBQU4sR0FBMkJ1TyxNQUFNdk8sZUFBakMsR0FBc0Q3QixRQUFRc0YsZUFBdEY7O0FBRUEsWUFBRzhLLE1BQU1qTyxlQUFUO0FBQ0N1WixhQUFHdlosZUFBSCxHQUFxQmlPLE1BQU1qTyxlQUEzQjtBQ0xJOztBRE9MLFlBQUdpTyxNQUFNbEksWUFBVDtBQUVDLGNBQUd2SCxPQUFPOEMsUUFBVjtBQUNDLGdCQUFHMk0sTUFBTWhPLGNBQU4sSUFBd0JtQixFQUFFNE8sVUFBRixDQUFhL0IsTUFBTWhPLGNBQW5CLENBQTNCO0FBQ0NzWixpQkFBR3RaLGNBQUgsR0FBb0JnTyxNQUFNaE8sY0FBMUI7QUFERDtBQUdDLGtCQUFHbUIsRUFBRTRCLFFBQUYsQ0FBV2lMLE1BQU1sSSxZQUFqQixDQUFIO0FBQ0NzVCwyQkFBV3hiLFFBQVFDLE9BQVIsQ0FBZ0JtUSxNQUFNbEksWUFBdEIsQ0FBWDs7QUFDQSxvQkFBQXNULFlBQUEsUUFBQWxZLE9BQUFrWSxTQUFBalUsV0FBQSxZQUFBakUsS0FBMEIrRyxXQUExQixHQUEwQixNQUExQixHQUEwQixNQUExQjtBQUNDcVIscUJBQUduTCxRQUFILENBQVlzTSxNQUFaLEdBQXFCLElBQXJCOztBQUNBbkIscUJBQUd0WixjQUFILEdBQW9CLFVBQUMwYSxZQUFEO0FDTlQsMkJET1ZDLE1BQU1DLElBQU4sQ0FBVyxvQkFBWCxFQUFpQztBQUNoQzNSLGtDQUFZLHlCQUF1QnJMLFFBQVF1RSxhQUFSLENBQXNCNkwsTUFBTWxJLFlBQTVCLEVBQTBDd1MsS0FEN0M7QUFFaEN1Qyw4QkFBUSxRQUFNN00sTUFBTWxJLFlBQU4sQ0FBbUIySyxPQUFuQixDQUEyQixHQUEzQixFQUErQixHQUEvQixDQUZrQjtBQUdoQ3JRLG1DQUFhLEtBQUc0TixNQUFNbEksWUFIVTtBQUloQ2dWLGlDQUFXLFFBSnFCO0FBS2hDQyxpQ0FBVyxVQUFDRCxTQUFELEVBQVlFLE1BQVo7QUFDViw0QkFBQTNiLE1BQUE7QUFBQUEsaUNBQVN6QixRQUFRbUQsU0FBUixDQUFrQmlhLE9BQU81YSxXQUF6QixDQUFUOztBQUNBLDRCQUFHNGEsT0FBTzVhLFdBQVAsS0FBc0IsU0FBekI7QUNMYyxpQ0RNYnNhLGFBQWFPLFFBQWIsQ0FBc0IsQ0FBQztBQUFDelEsbUNBQU93USxPQUFPeFgsS0FBUCxDQUFhZ0gsS0FBckI7QUFBNEJoSCxtQ0FBT3dYLE9BQU94WCxLQUFQLENBQWFqRCxJQUFoRDtBQUFzRDZWLGtDQUFNNEUsT0FBT3hYLEtBQVAsQ0FBYTRTO0FBQXpFLDJCQUFELENBQXRCLEVBQXdHNEUsT0FBT3hYLEtBQVAsQ0FBYWpELElBQXJILENDTmE7QURLZDtBQ0djLGlDREFibWEsYUFBYU8sUUFBYixDQUFzQixDQUFDO0FBQUN6USxtQ0FBT3dRLE9BQU94WCxLQUFQLENBQWFuRSxPQUFPdUssY0FBcEIsS0FBdUNvUixPQUFPeFgsS0FBUCxDQUFhZ0gsS0FBcEQsSUFBNkR3USxPQUFPeFgsS0FBUCxDQUFhakQsSUFBbEY7QUFBd0ZpRCxtQ0FBT3dYLE9BQU8vWTtBQUF0RywyQkFBRCxDQUF0QixFQUFvSStZLE9BQU8vWSxHQUEzSSxDQ0FhO0FBTUQ7QURoQmtCO0FBQUEscUJBQWpDLENDUFU7QURNUyxtQkFBcEI7QUFGRDtBQWdCQ3FYLHFCQUFHbkwsUUFBSCxDQUFZc00sTUFBWixHQUFxQixLQUFyQjtBQWxCRjtBQUhEO0FBREQ7QUNrQ007O0FEVk4sY0FBR3RaLEVBQUV1VSxTQUFGLENBQVkxSCxNQUFNeU0sTUFBbEIsQ0FBSDtBQUNDbkIsZUFBR25MLFFBQUgsQ0FBWXNNLE1BQVosR0FBcUJ6TSxNQUFNeU0sTUFBM0I7QUNZSzs7QURWTixjQUFHek0sTUFBTWtOLGNBQVQ7QUFDQzVCLGVBQUduTCxRQUFILENBQVlnTixXQUFaLEdBQTBCbk4sTUFBTWtOLGNBQWhDO0FDWUs7O0FEVk4sY0FBR2xOLE1BQU1vTixlQUFUO0FBQ0M5QixlQUFHbkwsUUFBSCxDQUFZa04sWUFBWixHQUEyQnJOLE1BQU1vTixlQUFqQztBQ1lLOztBRFZOLGNBQUdwTixNQUFNbEksWUFBTixLQUFzQixPQUF6QjtBQUNDd1QsZUFBR25MLFFBQUgsQ0FBWXRJLElBQVosR0FBbUIsWUFBbkI7O0FBQ0EsZ0JBQUcsQ0FBQ21JLE1BQU1VLE1BQVAsSUFBaUIsQ0FBQ1YsTUFBTXNOLElBQTNCO0FBR0Msa0JBQUd0TixNQUFNNkYsa0JBQU4sS0FBNEIsTUFBL0I7QUFJQyxvQkFBR3RWLE9BQU84QyxRQUFWO0FBQ0M4RCxnQ0FBQSxDQUFBdUcsT0FBQXZMLElBQUFnRixXQUFBLFlBQUF1RyxLQUErQmxLLEdBQS9CLEtBQWMsTUFBZDtBQUNBK1gsZ0NBQUFwVSxlQUFBLE9BQWNBLFlBQWFrRCxjQUEzQixHQUEyQixNQUEzQjs7QUFDQSxzQkFBR2xILEVBQUVvYSxPQUFGLENBQVUsQ0FBQyxlQUFELEVBQWtCLE9BQWxCLEVBQTJCLGFBQTNCLENBQVYsRUFBcURwYixJQUFJSSxJQUF6RCxDQUFIO0FBRUNnWixrQ0FBQXBVLGVBQUEsT0FBY0EsWUFBYW9CLGdCQUEzQixHQUEyQixNQUEzQjtBQ01TOztBRExWLHNCQUFHZ1QsV0FBSDtBQUNDRCx1QkFBR25MLFFBQUgsQ0FBWTBGLGtCQUFaLEdBQWlDLEtBQWpDO0FBREQ7QUFHQ3lGLHVCQUFHbkwsUUFBSCxDQUFZMEYsa0JBQVosR0FBaUMsSUFBakM7QUFURjtBQUpEO0FBQUEscUJBY0ssSUFBRzFTLEVBQUU0TyxVQUFGLENBQWEvQixNQUFNNkYsa0JBQW5CLENBQUg7QUFDSixvQkFBR3RWLE9BQU84QyxRQUFWO0FBRUNpWSxxQkFBR25MLFFBQUgsQ0FBWTBGLGtCQUFaLEdBQWlDN0YsTUFBTTZGLGtCQUFOLENBQXlCMVQsSUFBSWdGLFdBQTdCLENBQWpDO0FBRkQ7QUFLQ21VLHFCQUFHbkwsUUFBSCxDQUFZMEYsa0JBQVosR0FBaUMsSUFBakM7QUFORztBQUFBO0FBUUp5RixtQkFBR25MLFFBQUgsQ0FBWTBGLGtCQUFaLEdBQWlDN0YsTUFBTTZGLGtCQUF2QztBQXpCRjtBQUFBO0FBMkJDeUYsaUJBQUduTCxRQUFILENBQVkwRixrQkFBWixHQUFpQzdGLE1BQU02RixrQkFBdkM7QUE3QkY7QUFBQSxpQkE4QkssSUFBRzdGLE1BQU1sSSxZQUFOLEtBQXNCLGVBQXpCO0FBQ0p3VCxlQUFHbkwsUUFBSCxDQUFZdEksSUFBWixHQUFtQixXQUFuQjs7QUFDQSxnQkFBRyxDQUFDbUksTUFBTVUsTUFBUCxJQUFpQixDQUFDVixNQUFNc04sSUFBM0I7QUFHQyxrQkFBR3ROLE1BQU02RixrQkFBTixLQUE0QixNQUEvQjtBQUlDLG9CQUFHdFYsT0FBTzhDLFFBQVY7QUFDQzhELGdDQUFBLENBQUE4USxPQUFBOVYsSUFBQWdGLFdBQUEsWUFBQThRLEtBQStCelUsR0FBL0IsS0FBYyxNQUFkO0FBQ0ErWCxnQ0FBQXBVLGVBQUEsT0FBY0EsWUFBYWtELGNBQTNCLEdBQTJCLE1BQTNCOztBQUNBLHNCQUFHbEgsRUFBRW9hLE9BQUYsQ0FBVSxDQUFDLGVBQUQsRUFBa0IsT0FBbEIsRUFBMkIsYUFBM0IsQ0FBVixFQUFxRHBiLElBQUlJLElBQXpELENBQUg7QUFFQ2daLGtDQUFBcFUsZUFBQSxPQUFjQSxZQUFhb0IsZ0JBQTNCLEdBQTJCLE1BQTNCO0FDSVM7O0FESFYsc0JBQUdnVCxXQUFIO0FBQ0NELHVCQUFHbkwsUUFBSCxDQUFZMEYsa0JBQVosR0FBaUMsS0FBakM7QUFERDtBQUdDeUYsdUJBQUduTCxRQUFILENBQVkwRixrQkFBWixHQUFpQyxJQUFqQztBQVRGO0FBSkQ7QUFBQSxxQkFjSyxJQUFHMVMsRUFBRTRPLFVBQUYsQ0FBYS9CLE1BQU02RixrQkFBbkIsQ0FBSDtBQUNKLG9CQUFHdFYsT0FBTzhDLFFBQVY7QUFFQ2lZLHFCQUFHbkwsUUFBSCxDQUFZMEYsa0JBQVosR0FBaUM3RixNQUFNNkYsa0JBQU4sQ0FBeUIxVCxJQUFJZ0YsV0FBN0IsQ0FBakM7QUFGRDtBQUtDbVUscUJBQUduTCxRQUFILENBQVkwRixrQkFBWixHQUFpQyxJQUFqQztBQU5HO0FBQUE7QUFRSnlGLG1CQUFHbkwsUUFBSCxDQUFZMEYsa0JBQVosR0FBaUM3RixNQUFNNkYsa0JBQXZDO0FBekJGO0FBQUE7QUEyQkN5RixpQkFBR25MLFFBQUgsQ0FBWTBGLGtCQUFaLEdBQWlDN0YsTUFBTTZGLGtCQUF2QztBQTdCRztBQUFBO0FBK0JKLGdCQUFHLE9BQU83RixNQUFNbEksWUFBYixLQUE4QixVQUFqQztBQUNDdU8sOEJBQWdCckcsTUFBTWxJLFlBQU4sRUFBaEI7QUFERDtBQUdDdU8sOEJBQWdCckcsTUFBTWxJLFlBQXRCO0FDUU07O0FETlAsZ0JBQUczRSxFQUFFQyxPQUFGLENBQVVpVCxhQUFWLENBQUg7QUFDQ2lGLGlCQUFHelQsSUFBSCxHQUFVbEYsTUFBVjtBQUNBMlksaUJBQUdrQyxRQUFILEdBQWMsSUFBZDtBQUNBbEMsaUJBQUduTCxRQUFILENBQVlzTixhQUFaLEdBQTRCLElBQTVCO0FBRUF2RixxQkFBT25JLGFBQWEsSUFBcEIsSUFBNEI7QUFDM0JsSSxzQkFBTS9GLE1BRHFCO0FBRTNCcU8sMEJBQVU7QUFBQ21OLHdCQUFNO0FBQVA7QUFGaUIsZUFBNUI7QUFLQXBGLHFCQUFPbkksYUFBYSxNQUFwQixJQUE4QjtBQUM3QmxJLHNCQUFNLENBQUMvRixNQUFELENBRHVCO0FBRTdCcU8sMEJBQVU7QUFBQ21OLHdCQUFNO0FBQVA7QUFGbUIsZUFBOUI7QUFWRDtBQWdCQ2pILDhCQUFnQixDQUFDQSxhQUFELENBQWhCO0FDU007O0FEUFBuUCxzQkFBVXRILFFBQVFDLE9BQVIsQ0FBZ0J3VyxjQUFjLENBQWQsQ0FBaEIsQ0FBVjs7QUFDQSxnQkFBR25QLFdBQVlBLFFBQVEwUixXQUF2QjtBQUNDMEMsaUJBQUduTCxRQUFILENBQVl0SSxJQUFaLEdBQW1CLFlBQW5CO0FBREQ7QUFHQ3lULGlCQUFHbkwsUUFBSCxDQUFZdEksSUFBWixHQUFtQixnQkFBbkI7QUFDQXlULGlCQUFHbkwsUUFBSCxDQUFZdU4sYUFBWixHQUE0QjFOLE1BQU0wTixhQUFOLElBQXVCLHdCQUFuRDs7QUFFQSxrQkFBR25kLE9BQU84QyxRQUFWO0FBQ0NpWSxtQkFBR25MLFFBQUgsQ0FBWXdOLG1CQUFaLEdBQWtDO0FBQ2pDLHlCQUFPO0FBQUNsYiwyQkFBT2MsUUFBUUMsR0FBUixDQUFZLFNBQVo7QUFBUixtQkFBUDtBQURpQyxpQkFBbEM7O0FBRUE4WCxtQkFBR25MLFFBQUgsQ0FBWXlOLFVBQVosR0FBeUIsRUFBekI7O0FBQ0F2SCw4QkFBY3ZFLE9BQWQsQ0FBc0IsVUFBQytMLFVBQUQ7QUFDckIzVyw0QkFBVXRILFFBQVFDLE9BQVIsQ0FBZ0JnZSxVQUFoQixDQUFWOztBQUNBLHNCQUFHM1csT0FBSDtBQ1dXLDJCRFZWb1UsR0FBR25MLFFBQUgsQ0FBWXlOLFVBQVosQ0FBdUJ0VyxJQUF2QixDQUE0QjtBQUMzQmpHLDhCQUFRd2MsVUFEbUI7QUFFM0JyUiw2QkFBQXRGLFdBQUEsT0FBT0EsUUFBU3NGLEtBQWhCLEdBQWdCLE1BRlc7QUFHM0I0TCw0QkFBQWxSLFdBQUEsT0FBTUEsUUFBU2tSLElBQWYsR0FBZSxNQUhZO0FBSTNCMEYsNEJBQU07QUFDTCwrQkFBTyxVQUFRdmEsUUFBUUMsR0FBUixDQUFZLFFBQVosQ0FBUixHQUE4QixHQUE5QixHQUFpQ3FhLFVBQWpDLEdBQTRDLFFBQW5EO0FBTDBCO0FBQUEscUJBQTVCLENDVVU7QURYWDtBQ29CVywyQkRYVnZDLEdBQUduTCxRQUFILENBQVl5TixVQUFaLENBQXVCdFcsSUFBdkIsQ0FBNEI7QUFDM0JqRyw4QkFBUXdjLFVBRG1CO0FBRTNCQyw0QkFBTTtBQUNMLCtCQUFPLFVBQVF2YSxRQUFRQyxHQUFSLENBQVksUUFBWixDQUFSLEdBQThCLEdBQTlCLEdBQWlDcWEsVUFBakMsR0FBNEMsUUFBbkQ7QUFIMEI7QUFBQSxxQkFBNUIsQ0NXVTtBQU1EO0FENUJYO0FBVkY7QUF2REk7QUFqRU47QUFBQTtBQW9KQ3ZDLGFBQUduTCxRQUFILENBQVl0SSxJQUFaLEdBQW1CLGdCQUFuQjtBQUNBeVQsYUFBR25MLFFBQUgsQ0FBWTROLFdBQVosR0FBMEIvTixNQUFNK04sV0FBaEM7QUFuS0Y7QUFOSTtBQUFBLFdBMktBLElBQUcvTixNQUFNbkksSUFBTixLQUFjLFFBQWpCO0FBQ0p5VCxTQUFHelQsSUFBSCxHQUFVL0YsTUFBVjs7QUFDQSxVQUFHa08sTUFBTXdMLFFBQVQ7QUFDQ0YsV0FBR3pULElBQUgsR0FBVSxDQUFDL0YsTUFBRCxDQUFWO0FBQ0F3WixXQUFHbkwsUUFBSCxDQUFZdEksSUFBWixHQUFtQixnQkFBbkI7QUFDQXlULFdBQUduTCxRQUFILENBQVk2TixRQUFaLEdBQXVCLEtBQXZCO0FBQ0ExQyxXQUFHbkwsUUFBSCxDQUFZckwsT0FBWixHQUFzQmtMLE1BQU1sTCxPQUE1QjtBQUpEO0FBTUN3VyxXQUFHbkwsUUFBSCxDQUFZdEksSUFBWixHQUFtQixRQUFuQjtBQUNBeVQsV0FBR25MLFFBQUgsQ0FBWXJMLE9BQVosR0FBc0JrTCxNQUFNbEwsT0FBNUI7QUFDQXdXLFdBQUduTCxRQUFILENBQVk4TixXQUFaLEdBQTBCLEVBQTFCO0FBVkc7QUFBQSxXQVdBLElBQUdqTyxNQUFNbkksSUFBTixLQUFjLFVBQWpCO0FBQ0p5VCxTQUFHelQsSUFBSCxHQUFVcU8sTUFBVjtBQUNBb0YsU0FBR25MLFFBQUgsQ0FBWXRJLElBQVosR0FBbUIsZUFBbkI7QUFDQXlULFNBQUduTCxRQUFILENBQVkrTixTQUFaLEdBQXdCbE8sTUFBTWtPLFNBQU4sSUFBbUIsRUFBM0M7O0FBQ0EsVUFBQWxPLFNBQUEsT0FBR0EsTUFBT21PLEtBQVYsR0FBVSxNQUFWO0FBQ0M3QyxXQUFHbkwsUUFBSCxDQUFZZ08sS0FBWixHQUFvQm5PLE1BQU1tTyxLQUExQjtBQUNBN0MsV0FBRzhDLE9BQUgsR0FBYSxJQUFiO0FBRkQsYUFHSyxLQUFBcE8sU0FBQSxPQUFHQSxNQUFPbU8sS0FBVixHQUFVLE1BQVYsTUFBbUIsQ0FBbkI7QUFDSjdDLFdBQUduTCxRQUFILENBQVlnTyxLQUFaLEdBQW9CLENBQXBCO0FBQ0E3QyxXQUFHOEMsT0FBSCxHQUFhLElBQWI7QUFURztBQUFBLFdBVUEsSUFBR3BPLE1BQU1uSSxJQUFOLEtBQWMsUUFBakI7QUFDSnlULFNBQUd6VCxJQUFILEdBQVVxTyxNQUFWO0FBQ0FvRixTQUFHbkwsUUFBSCxDQUFZdEksSUFBWixHQUFtQixlQUFuQjtBQUNBeVQsU0FBR25MLFFBQUgsQ0FBWStOLFNBQVosR0FBd0JsTyxNQUFNa08sU0FBTixJQUFtQixFQUEzQzs7QUFDQSxVQUFBbE8sU0FBQSxPQUFHQSxNQUFPbU8sS0FBVixHQUFVLE1BQVY7QUFDQzdDLFdBQUduTCxRQUFILENBQVlnTyxLQUFaLEdBQW9Cbk8sTUFBTW1PLEtBQTFCO0FBQ0E3QyxXQUFHOEMsT0FBSCxHQUFhLElBQWI7QUFORztBQUFBLFdBT0EsSUFBR3BPLE1BQU1uSSxJQUFOLEtBQWMsU0FBakI7QUFDSnlULFNBQUd6VCxJQUFILEdBQVVzTyxPQUFWO0FBQ0FtRixTQUFHbkwsUUFBSCxDQUFZdEksSUFBWixHQUFtQiwwQkFBbkI7QUFGSSxXQUdBLElBQUdtSSxNQUFNbkksSUFBTixLQUFjLFdBQWpCO0FBQ0p5VCxTQUFHelQsSUFBSCxHQUFVL0YsTUFBVjtBQURJLFdBRUEsSUFBR2tPLE1BQU1uSSxJQUFOLEtBQWMsVUFBakI7QUFDSnlULFNBQUd6VCxJQUFILEdBQVUsQ0FBQy9GLE1BQUQsQ0FBVjtBQUNBd1osU0FBR25MLFFBQUgsQ0FBWXRJLElBQVosR0FBbUIsaUJBQW5CO0FBQ0F5VCxTQUFHbkwsUUFBSCxDQUFZckwsT0FBWixHQUFzQmtMLE1BQU1sTCxPQUE1QjtBQUhJLFdBSUEsSUFBR2tMLE1BQU1uSSxJQUFOLEtBQWMsTUFBZCxJQUF5Qm1JLE1BQU0vRSxVQUFsQztBQUNKLFVBQUcrRSxNQUFNd0wsUUFBVDtBQUNDRixXQUFHelQsSUFBSCxHQUFVLENBQUMvRixNQUFELENBQVY7QUFDQW9XLGVBQU9uSSxhQUFhLElBQXBCLElBQ0M7QUFBQUksb0JBQ0M7QUFBQXRJLGtCQUFNLFlBQU47QUFDQW9ELHdCQUFZK0UsTUFBTS9FO0FBRGxCO0FBREQsU0FERDtBQUZEO0FBT0NxUSxXQUFHelQsSUFBSCxHQUFVL0YsTUFBVjtBQUNBd1osV0FBR25MLFFBQUgsQ0FBWXRJLElBQVosR0FBbUIsWUFBbkI7QUFDQXlULFdBQUduTCxRQUFILENBQVlsRixVQUFaLEdBQXlCK0UsTUFBTS9FLFVBQS9CO0FBVkc7QUFBQSxXQVdBLElBQUcrRSxNQUFNbkksSUFBTixLQUFjLFVBQWpCO0FBQ0p5VCxTQUFHelQsSUFBSCxHQUFVcU8sTUFBVjtBQUNBb0YsU0FBR25MLFFBQUgsQ0FBWXRJLElBQVosR0FBbUIsVUFBbkI7QUFGSSxXQUdBLElBQUdtSSxNQUFNbkksSUFBTixLQUFjLFFBQWQsSUFBMEJtSSxNQUFNbkksSUFBTixLQUFjLFFBQTNDO0FBQ0p5VCxTQUFHelQsSUFBSCxHQUFVbEYsTUFBVjtBQURJLFdBRUEsSUFBR3FOLE1BQU1uSSxJQUFOLEtBQWMsTUFBakI7QUFDSnlULFNBQUd6VCxJQUFILEdBQVV3VyxLQUFWO0FBQ0EvQyxTQUFHbkwsUUFBSCxDQUFZbU8sUUFBWixHQUF1QixJQUF2QjtBQUNBaEQsU0FBR25MLFFBQUgsQ0FBWXRJLElBQVosR0FBbUIsYUFBbkI7QUFFQXFRLGFBQU9uSSxhQUFhLElBQXBCLElBQ0M7QUFBQWxJLGNBQU1sRjtBQUFOLE9BREQ7QUFMSSxXQU9BLElBQUdxTixNQUFNbkksSUFBTixLQUFjLE9BQWpCO0FBQ0osVUFBR21JLE1BQU13TCxRQUFUO0FBQ0NGLFdBQUd6VCxJQUFILEdBQVUsQ0FBQy9GLE1BQUQsQ0FBVjtBQUNBb1csZUFBT25JLGFBQWEsSUFBcEIsSUFDQztBQUFBSSxvQkFDQztBQUFBdEksa0JBQU0sWUFBTjtBQUNBb0Qsd0JBQVksUUFEWjtBQUVBc1Qsb0JBQVE7QUFGUjtBQURELFNBREQ7QUFGRDtBQVFDakQsV0FBR3pULElBQUgsR0FBVS9GLE1BQVY7QUFDQXdaLFdBQUduTCxRQUFILENBQVl0SSxJQUFaLEdBQW1CLFlBQW5CO0FBQ0F5VCxXQUFHbkwsUUFBSCxDQUFZbEYsVUFBWixHQUF5QixRQUF6QjtBQUNBcVEsV0FBR25MLFFBQUgsQ0FBWW9PLE1BQVosR0FBcUIsU0FBckI7QUFaRztBQUFBLFdBYUEsSUFBR3ZPLE1BQU1uSSxJQUFOLEtBQWMsUUFBakI7QUFDSixVQUFHbUksTUFBTXdMLFFBQVQ7QUFDQ0YsV0FBR3pULElBQUgsR0FBVSxDQUFDL0YsTUFBRCxDQUFWO0FBQ0FvVyxlQUFPbkksYUFBYSxJQUFwQixJQUNDO0FBQUFJLG9CQUNDO0FBQUF0SSxrQkFBTSxZQUFOO0FBQ0FvRCx3QkFBWSxTQURaO0FBRUFzVCxvQkFBUTtBQUZSO0FBREQsU0FERDtBQUZEO0FBUUNqRCxXQUFHelQsSUFBSCxHQUFVL0YsTUFBVjtBQUNBd1osV0FBR25MLFFBQUgsQ0FBWXRJLElBQVosR0FBbUIsWUFBbkI7QUFDQXlULFdBQUduTCxRQUFILENBQVlsRixVQUFaLEdBQXlCLFNBQXpCO0FBQ0FxUSxXQUFHbkwsUUFBSCxDQUFZb08sTUFBWixHQUFxQixTQUFyQjtBQVpHO0FBQUEsV0FhQSxJQUFHdk8sTUFBTW5JLElBQU4sS0FBYyxPQUFqQjtBQUNKLFVBQUdtSSxNQUFNd0wsUUFBVDtBQUNDRixXQUFHelQsSUFBSCxHQUFVLENBQUMvRixNQUFELENBQVY7QUFDQW9XLGVBQU9uSSxhQUFhLElBQXBCLElBQ0M7QUFBQUksb0JBQ0M7QUFBQXRJLGtCQUFNLFlBQU47QUFDQW9ELHdCQUFZLFFBRFo7QUFFQXNULG9CQUFRO0FBRlI7QUFERCxTQUREO0FBRkQ7QUFRQ2pELFdBQUd6VCxJQUFILEdBQVUvRixNQUFWO0FBQ0F3WixXQUFHbkwsUUFBSCxDQUFZdEksSUFBWixHQUFtQixZQUFuQjtBQUNBeVQsV0FBR25MLFFBQUgsQ0FBWWxGLFVBQVosR0FBeUIsUUFBekI7QUFDQXFRLFdBQUduTCxRQUFILENBQVlvTyxNQUFaLEdBQXFCLFNBQXJCO0FBWkc7QUFBQSxXQWFBLElBQUd2TyxNQUFNbkksSUFBTixLQUFjLE9BQWpCO0FBQ0osVUFBR21JLE1BQU13TCxRQUFUO0FBQ0NGLFdBQUd6VCxJQUFILEdBQVUsQ0FBQy9GLE1BQUQsQ0FBVjtBQUNBb1csZUFBT25JLGFBQWEsSUFBcEIsSUFDQztBQUFBSSxvQkFDQztBQUFBdEksa0JBQU0sWUFBTjtBQUNBb0Qsd0JBQVksUUFEWjtBQUVBc1Qsb0JBQVE7QUFGUjtBQURELFNBREQ7QUFGRDtBQVFDakQsV0FBR3pULElBQUgsR0FBVS9GLE1BQVY7QUFDQXdaLFdBQUduTCxRQUFILENBQVl0SSxJQUFaLEdBQW1CLFlBQW5CO0FBQ0F5VCxXQUFHbkwsUUFBSCxDQUFZbEYsVUFBWixHQUF5QixRQUF6QjtBQUNBcVEsV0FBR25MLFFBQUgsQ0FBWW9PLE1BQVosR0FBcUIsU0FBckI7QUFaRztBQUFBLFdBYUEsSUFBR3ZPLE1BQU1uSSxJQUFOLEtBQWMsVUFBakI7QUFDSnlULFNBQUd6VCxJQUFILEdBQVVsRixNQUFWO0FBQ0EyWSxTQUFHbkwsUUFBSCxDQUFZdEksSUFBWixHQUFtQixVQUFuQjtBQUNBeVQsU0FBR25MLFFBQUgsQ0FBWXFPLE1BQVosR0FBcUJ4TyxNQUFNd08sTUFBTixJQUFnQixPQUFyQztBQUNBbEQsU0FBR2tDLFFBQUgsR0FBYyxJQUFkO0FBSkksV0FLQSxJQUFHeE4sTUFBTW5JLElBQU4sS0FBYyxVQUFqQjtBQUNKeVQsU0FBR3pULElBQUgsR0FBVS9GLE1BQVY7QUFDQXdaLFNBQUduTCxRQUFILENBQVl0SSxJQUFaLEdBQW1CLGtCQUFuQjtBQUZJLFdBR0EsSUFBR21JLE1BQU1uSSxJQUFOLEtBQWMsS0FBakI7QUFDSnlULFNBQUd6VCxJQUFILEdBQVUvRixNQUFWO0FBRUF3WixTQUFHbkwsUUFBSCxDQUFZdEksSUFBWixHQUFtQixZQUFuQjtBQUhJLFdBSUEsSUFBR21JLE1BQU1uSSxJQUFOLEtBQWMsT0FBakI7QUFDSnlULFNBQUd6VCxJQUFILEdBQVUvRixNQUFWO0FBQ0F3WixTQUFHckgsS0FBSCxHQUFXMVMsYUFBYXNTLEtBQWIsQ0FBbUI0SyxLQUE5QjtBQUNBbkQsU0FBR25MLFFBQUgsQ0FBWXRJLElBQVosR0FBbUIsY0FBbkI7QUFISSxXQUlBLElBQUdtSSxNQUFNbkksSUFBTixLQUFjLFlBQWpCO0FBQ0p5VCxTQUFHelQsSUFBSCxHQUFVL0YsTUFBVjtBQURJO0FBR0p3WixTQUFHelQsSUFBSCxHQUFVbUksTUFBTW5JLElBQWhCO0FDbUNFOztBRGpDSCxRQUFHbUksTUFBTXhELEtBQVQ7QUFDQzhPLFNBQUc5TyxLQUFILEdBQVd3RCxNQUFNeEQsS0FBakI7QUNtQ0U7O0FEakNILFFBQUd3RCxNQUFNME8sYUFBVDtBQUNDcEQsU0FBR29ELGFBQUgsR0FBbUIxTyxNQUFNME8sYUFBekI7QUNtQ0U7O0FEakNILFFBQUcsQ0FBQzFPLE1BQU1vSyxRQUFWO0FBQ0NrQixTQUFHcUQsUUFBSCxHQUFjLElBQWQ7QUNtQ0U7O0FEakNILFFBQUczTyxNQUFNNE8sTUFBVDtBQUNDdEQsU0FBR3NELE1BQUgsR0FBWSxJQUFaO0FDbUNFOztBRGpDSCxRQUFHNU8sTUFBTXNOLElBQVQ7QUFDQ2hDLFNBQUduTCxRQUFILENBQVltTixJQUFaLEdBQW1CLElBQW5CO0FDbUNFOztBRGpDSCxRQUFHdE4sTUFBTTZPLEtBQVQ7QUFDQ3ZELFNBQUduTCxRQUFILENBQVkwTyxLQUFaLEdBQW9CN08sTUFBTTZPLEtBQTFCO0FDbUNFOztBRGpDSCxRQUFHN08sTUFBTUMsT0FBVDtBQUNDcUwsU0FBR25MLFFBQUgsQ0FBWUYsT0FBWixHQUFzQixJQUF0QjtBQ21DRTs7QURqQ0gsUUFBR0QsTUFBTVUsTUFBVDtBQUNDNEssU0FBR25MLFFBQUgsQ0FBWXRJLElBQVosR0FBbUIsUUFBbkI7QUNtQ0U7O0FEakNILFFBQUltSSxNQUFNbkksSUFBTixLQUFjLFFBQWYsSUFBNkJtSSxNQUFNbkksSUFBTixLQUFjLFFBQTNDLElBQXlEbUksTUFBTW5JLElBQU4sS0FBYyxlQUExRTtBQUNDLFVBQUcsT0FBT21JLE1BQU04TyxVQUFiLEtBQTRCLFdBQS9CO0FBQ0M5TyxjQUFNOE8sVUFBTixHQUFtQixJQUFuQjtBQUZGO0FDc0NHOztBRG5DSCxRQUFHOU8sTUFBTXpOLElBQU4sS0FBYyxNQUFkLElBQXdCeU4sTUFBTXNKLE9BQWpDO0FBQ0MsVUFBRyxPQUFPdEosTUFBTStPLFVBQWIsS0FBNEIsV0FBL0I7QUFDQy9PLGNBQU0rTyxVQUFOLEdBQW1CLElBQW5CO0FBRkY7QUN3Q0c7O0FEcENILFFBQUcxRCxhQUFIO0FBQ0NDLFNBQUduTCxRQUFILENBQVl0SSxJQUFaLEdBQW1Cd1QsYUFBbkI7QUNzQ0U7O0FEcENILFFBQUdyTCxNQUFNNEYsWUFBVDtBQUNDLFVBQUdyVixPQUFPOEMsUUFBUCxJQUFvQnpELFFBQVFvRixRQUFSLENBQWlCQyxZQUFqQixDQUE4QitLLE1BQU00RixZQUFwQyxDQUF2QjtBQUNDMEYsV0FBR25MLFFBQUgsQ0FBWXlGLFlBQVosR0FBMkI7QUFDMUIsaUJBQU9oVyxRQUFRb0YsUUFBUixDQUFpQjFDLEdBQWpCLENBQXFCME4sTUFBTTRGLFlBQTNCLEVBQXlDO0FBQUNyUixvQkFBUWhFLE9BQU9nRSxNQUFQLEVBQVQ7QUFBMEJILHFCQUFTYixRQUFRQyxHQUFSLENBQVksU0FBWjtBQUFuQyxXQUF6QyxDQUFQO0FBRDBCLFNBQTNCO0FBREQ7QUFJQzhYLFdBQUduTCxRQUFILENBQVl5RixZQUFaLEdBQTJCNUYsTUFBTTRGLFlBQWpDOztBQUNBLFlBQUcsQ0FBQ3pTLEVBQUU0TyxVQUFGLENBQWEvQixNQUFNNEYsWUFBbkIsQ0FBSjtBQUNDMEYsYUFBRzFGLFlBQUgsR0FBa0I1RixNQUFNNEYsWUFBeEI7QUFORjtBQUREO0FDbURHOztBRDFDSCxRQUFHNUYsTUFBTWtLLFFBQVQ7QUFDQ29CLFNBQUduTCxRQUFILENBQVkrSixRQUFaLEdBQXVCLElBQXZCO0FDNENFOztBRDFDSCxRQUFHbEssTUFBTW1LLFFBQVQ7QUFDQ21CLFNBQUduTCxRQUFILENBQVlnSyxRQUFaLEdBQXVCLElBQXZCO0FDNENFOztBRDFDSCxRQUFHbkssTUFBTWdQLGNBQVQ7QUFDQzFELFNBQUduTCxRQUFILENBQVk2TyxjQUFaLEdBQTZCaFAsTUFBTWdQLGNBQW5DO0FDNENFOztBRDFDSCxRQUFHaFAsTUFBTXdOLFFBQVQ7QUFDQ2xDLFNBQUdrQyxRQUFILEdBQWMsSUFBZDtBQzRDRTs7QUR6Q0gsUUFBR2pkLE9BQU8wZSxZQUFWO0FBQ0MsVUFBR2pQLE1BQU1hLEtBQVQ7QUFDQ3lLLFdBQUd6SyxLQUFILEdBQVdiLE1BQU1hLEtBQWpCO0FBREQsYUFFSyxJQUFHYixNQUFNa1AsUUFBVDtBQUNKNUQsV0FBR3pLLEtBQUgsR0FBVyxJQUFYO0FBSkY7QUNnREc7O0FBQ0QsV0QzQ0ZxSCxPQUFPbkksVUFBUCxJQUFxQnVMLEVDMkNuQjtBRHBmSDs7QUEyY0EsU0FBT3BELE1BQVA7QUFyZHlCLENBQTFCOztBQXdkQXRZLFFBQVF1ZixvQkFBUixHQUErQixVQUFDL2MsV0FBRCxFQUFjMk4sVUFBZCxFQUEwQnFQLFdBQTFCO0FBQzlCLE1BQUFwUCxLQUFBLEVBQUFxUCxJQUFBLEVBQUFoZSxNQUFBO0FBQUFnZSxTQUFPRCxXQUFQO0FBQ0EvZCxXQUFTekIsUUFBUW1ELFNBQVIsQ0FBa0JYLFdBQWxCLENBQVQ7O0FBQ0EsTUFBRyxDQUFDZixNQUFKO0FBQ0MsV0FBTyxFQUFQO0FDNkNDOztBRDVDRjJPLFVBQVEzTyxPQUFPcUcsTUFBUCxDQUFjcUksVUFBZCxDQUFSOztBQUNBLE1BQUcsQ0FBQ0MsS0FBSjtBQUNDLFdBQU8sRUFBUDtBQzhDQzs7QUQ1Q0YsTUFBR0EsTUFBTW5JLElBQU4sS0FBYyxVQUFqQjtBQUNDd1gsV0FBT0MsT0FBTyxLQUFLQyxHQUFaLEVBQWlCQyxNQUFqQixDQUF3QixpQkFBeEIsQ0FBUDtBQURELFNBRUssSUFBR3hQLE1BQU1uSSxJQUFOLEtBQWMsTUFBakI7QUFDSndYLFdBQU9DLE9BQU8sS0FBS0MsR0FBWixFQUFpQkMsTUFBakIsQ0FBd0IsWUFBeEIsQ0FBUDtBQzhDQzs7QUQ1Q0YsU0FBT0gsSUFBUDtBQWQ4QixDQUEvQjs7QUFnQkF6ZixRQUFRNmYsaUNBQVIsR0FBNEMsVUFBQ0MsVUFBRDtBQUMzQyxTQUFPLENBQUMsTUFBRCxFQUFTLFVBQVQsRUFBcUIsVUFBckIsRUFBaUMsUUFBakMsRUFBMkNsUixRQUEzQyxDQUFvRGtSLFVBQXBELENBQVA7QUFEMkMsQ0FBNUM7O0FBR0E5ZixRQUFRK2YsMkJBQVIsR0FBc0MsVUFBQ0QsVUFBRCxFQUFhRSxVQUFiO0FBQ3JDLE1BQUFDLGFBQUE7QUFBQUEsa0JBQWdCamdCLFFBQVFrZ0IsdUJBQVIsQ0FBZ0NKLFVBQWhDLENBQWhCOztBQUNBLE1BQUdHLGFBQUg7QUNpREcsV0RoREYxYyxFQUFFMk8sT0FBRixDQUFVK04sYUFBVixFQUF5QixVQUFDRSxXQUFELEVBQWNwWixHQUFkO0FDaURyQixhRGhESGlaLFdBQVd0WSxJQUFYLENBQWdCO0FBQUNrRixlQUFPdVQsWUFBWXZULEtBQXBCO0FBQTJCaEgsZUFBT21CO0FBQWxDLE9BQWhCLENDZ0RHO0FEakRKLE1DZ0RFO0FBTUQ7QUR6RG1DLENBQXRDOztBQU1BL0csUUFBUWtnQix1QkFBUixHQUFrQyxVQUFDSixVQUFELEVBQWFNLGFBQWI7QUFFakMsTUFBRyxDQUFDLE1BQUQsRUFBUyxVQUFULEVBQXFCeFIsUUFBckIsQ0FBOEJrUixVQUE5QixDQUFIO0FBQ0MsV0FBTzlmLFFBQVFxZ0IsMkJBQVIsQ0FBb0NELGFBQXBDLEVBQW1ETixVQUFuRCxDQUFQO0FDc0RDO0FEekQrQixDQUFsQzs7QUFLQTlmLFFBQVFzZ0IsMEJBQVIsR0FBcUMsVUFBQ1IsVUFBRCxFQUFhL1ksR0FBYjtBQUVwQyxNQUFHLENBQUMsTUFBRCxFQUFTLFVBQVQsRUFBcUI2SCxRQUFyQixDQUE4QmtSLFVBQTlCLENBQUg7QUFDQyxXQUFPOWYsUUFBUXVnQiw4QkFBUixDQUF1Q1QsVUFBdkMsRUFBbUQvWSxHQUFuRCxDQUFQO0FDdURDO0FEMURrQyxDQUFyQzs7QUFLQS9HLFFBQVF3Z0IsMEJBQVIsR0FBcUMsVUFBQ1YsVUFBRCxFQUFhbGEsS0FBYjtBQUdwQyxNQUFBNmEsb0JBQUEsRUFBQXJELE1BQUE7O0FBQUEsT0FBTzdaLEVBQUU0QixRQUFGLENBQVdTLEtBQVgsQ0FBUDtBQUNDO0FDd0RDOztBRHZERjZhLHlCQUF1QnpnQixRQUFRa2dCLHVCQUFSLENBQWdDSixVQUFoQyxDQUF2Qjs7QUFDQSxPQUFPVyxvQkFBUDtBQUNDO0FDeURDOztBRHhERnJELFdBQVMsSUFBVDs7QUFDQTdaLElBQUVrQyxJQUFGLENBQU9nYixvQkFBUCxFQUE2QixVQUFDNU0sSUFBRCxFQUFPcUosU0FBUDtBQUM1QixRQUFHckosS0FBSzlNLEdBQUwsS0FBWW5CLEtBQWY7QUMwREksYUR6REh3WCxTQUFTRixTQ3lETjtBQUNEO0FENURKOztBQUdBLFNBQU9FLE1BQVA7QUFab0MsQ0FBckM7O0FBZUFwZCxRQUFRcWdCLDJCQUFSLEdBQXNDLFVBQUNELGFBQUQsRUFBZ0JOLFVBQWhCO0FBRXJDLFNBQU87QUFDTiw4QkFBNkJNLGdCQUFtQixJQUFuQixHQUE2QnBnQixRQUFRdWdCLDhCQUFSLENBQXVDVCxVQUF2QyxFQUFtRCxXQUFuRCxDQURwRDtBQUVOLDhCQUE2Qk0sZ0JBQW1CLElBQW5CLEdBQTZCcGdCLFFBQVF1Z0IsOEJBQVIsQ0FBdUNULFVBQXZDLEVBQW1ELFdBQW5ELENBRnBEO0FBR04sOEJBQTZCTSxnQkFBbUIsSUFBbkIsR0FBNkJwZ0IsUUFBUXVnQiw4QkFBUixDQUF1Q1QsVUFBdkMsRUFBbUQsV0FBbkQsQ0FIcEQ7QUFJTixpQ0FBZ0NNLGdCQUFtQixJQUFuQixHQUE2QnBnQixRQUFRdWdCLDhCQUFSLENBQXVDVCxVQUF2QyxFQUFtRCxjQUFuRCxDQUp2RDtBQUtOLGlDQUFnQ00sZ0JBQW1CLElBQW5CLEdBQTZCcGdCLFFBQVF1Z0IsOEJBQVIsQ0FBdUNULFVBQXZDLEVBQW1ELGNBQW5ELENBTHZEO0FBTU4saUNBQWdDTSxnQkFBbUIsSUFBbkIsR0FBNkJwZ0IsUUFBUXVnQiw4QkFBUixDQUF1Q1QsVUFBdkMsRUFBbUQsY0FBbkQsQ0FOdkQ7QUFPTiwrQkFBOEJNLGdCQUFtQixJQUFuQixHQUE2QnBnQixRQUFRdWdCLDhCQUFSLENBQXVDVCxVQUF2QyxFQUFtRCxZQUFuRCxDQVByRDtBQVFOLCtCQUE4Qk0sZ0JBQW1CLElBQW5CLEdBQTZCcGdCLFFBQVF1Z0IsOEJBQVIsQ0FBdUNULFVBQXZDLEVBQW1ELFlBQW5ELENBUnJEO0FBU04sK0JBQThCTSxnQkFBbUIsSUFBbkIsR0FBNkJwZ0IsUUFBUXVnQiw4QkFBUixDQUF1Q1QsVUFBdkMsRUFBbUQsWUFBbkQsQ0FUckQ7QUFVTiw4QkFBNkJNLGdCQUFtQixJQUFuQixHQUE2QnBnQixRQUFRdWdCLDhCQUFSLENBQXVDVCxVQUF2QyxFQUFtRCxXQUFuRCxDQVZwRDtBQVdOLDhCQUE2Qk0sZ0JBQW1CLElBQW5CLEdBQTZCcGdCLFFBQVF1Z0IsOEJBQVIsQ0FBdUNULFVBQXZDLEVBQW1ELFdBQW5ELENBWHBEO0FBWU4sOEJBQTZCTSxnQkFBbUIsSUFBbkIsR0FBNkJwZ0IsUUFBUXVnQiw4QkFBUixDQUF1Q1QsVUFBdkMsRUFBbUQsV0FBbkQsQ0FacEQ7QUFhTiw0QkFBMkJNLGdCQUFtQixJQUFuQixHQUE2QnBnQixRQUFRdWdCLDhCQUFSLENBQXVDVCxVQUF2QyxFQUFtRCxTQUFuRCxDQWJsRDtBQWNOLDBCQUF5Qk0sZ0JBQW1CLElBQW5CLEdBQTZCcGdCLFFBQVF1Z0IsOEJBQVIsQ0FBdUNULFVBQXZDLEVBQW1ELE9BQW5ELENBZGhEO0FBZU4sNkJBQTRCTSxnQkFBbUIsSUFBbkIsR0FBNkJwZ0IsUUFBUXVnQiw4QkFBUixDQUF1Q1QsVUFBdkMsRUFBbUQsVUFBbkQsQ0FmbkQ7QUFnQk4sZ0NBQStCTSxnQkFBbUIsSUFBbkIsR0FBNkJwZ0IsUUFBUXVnQiw4QkFBUixDQUF1Q1QsVUFBdkMsRUFBbUQsYUFBbkQsQ0FoQnREO0FBaUJOLGlDQUFnQ00sZ0JBQW1CLElBQW5CLEdBQTZCcGdCLFFBQVF1Z0IsOEJBQVIsQ0FBdUNULFVBQXZDLEVBQW1ELGNBQW5ELENBakJ2RDtBQWtCTixpQ0FBZ0NNLGdCQUFtQixJQUFuQixHQUE2QnBnQixRQUFRdWdCLDhCQUFSLENBQXVDVCxVQUF2QyxFQUFtRCxjQUFuRCxDQWxCdkQ7QUFtQk4saUNBQWdDTSxnQkFBbUIsSUFBbkIsR0FBNkJwZ0IsUUFBUXVnQiw4QkFBUixDQUF1Q1QsVUFBdkMsRUFBbUQsY0FBbkQsQ0FuQnZEO0FBb0JOLGtDQUFpQ00sZ0JBQW1CLElBQW5CLEdBQTZCcGdCLFFBQVF1Z0IsOEJBQVIsQ0FBdUNULFVBQXZDLEVBQW1ELGVBQW5ELENBcEJ4RDtBQXFCTixnQ0FBK0JNLGdCQUFtQixJQUFuQixHQUE2QnBnQixRQUFRdWdCLDhCQUFSLENBQXVDVCxVQUF2QyxFQUFtRCxhQUFuRCxDQXJCdEQ7QUFzQk4saUNBQWdDTSxnQkFBbUIsSUFBbkIsR0FBNkJwZ0IsUUFBUXVnQiw4QkFBUixDQUF1Q1QsVUFBdkMsRUFBbUQsY0FBbkQsQ0F0QnZEO0FBdUJOLGlDQUFnQ00sZ0JBQW1CLElBQW5CLEdBQTZCcGdCLFFBQVF1Z0IsOEJBQVIsQ0FBdUNULFVBQXZDLEVBQW1ELGNBQW5ELENBdkJ2RDtBQXdCTixpQ0FBZ0NNLGdCQUFtQixJQUFuQixHQUE2QnBnQixRQUFRdWdCLDhCQUFSLENBQXVDVCxVQUF2QyxFQUFtRCxjQUFuRCxDQXhCdkQ7QUF5Qk4sa0NBQWlDTSxnQkFBbUIsSUFBbkIsR0FBNkJwZ0IsUUFBUXVnQiw4QkFBUixDQUF1Q1QsVUFBdkMsRUFBbUQsZUFBbkQ7QUF6QnhELEdBQVA7QUFGcUMsQ0FBdEM7O0FBOEJBOWYsUUFBUTBnQixvQkFBUixHQUErQixVQUFDQyxLQUFEO0FBQzlCLE1BQUcsQ0FBQ0EsS0FBSjtBQUNDQSxZQUFRLElBQUkzWixJQUFKLEdBQVc0WixRQUFYLEVBQVI7QUM0REM7O0FEMURGLE1BQUdELFFBQVEsQ0FBWDtBQUNDLFdBQU8sQ0FBUDtBQURELFNBRUssSUFBR0EsUUFBUSxDQUFYO0FBQ0osV0FBTyxDQUFQO0FBREksU0FFQSxJQUFHQSxRQUFRLENBQVg7QUFDSixXQUFPLENBQVA7QUM0REM7O0FEMURGLFNBQU8sQ0FBUDtBQVg4QixDQUEvQjs7QUFjQTNnQixRQUFRNmdCLHNCQUFSLEdBQWlDLFVBQUNDLElBQUQsRUFBTUgsS0FBTjtBQUNoQyxNQUFHLENBQUNHLElBQUo7QUFDQ0EsV0FBTyxJQUFJOVosSUFBSixHQUFXK1osV0FBWCxFQUFQO0FDNERDOztBRDNERixNQUFHLENBQUNKLEtBQUo7QUFDQ0EsWUFBUSxJQUFJM1osSUFBSixHQUFXNFosUUFBWCxFQUFSO0FDNkRDOztBRDNERixNQUFHRCxRQUFRLENBQVg7QUFDQ0c7QUFDQUgsWUFBUSxDQUFSO0FBRkQsU0FHSyxJQUFHQSxRQUFRLENBQVg7QUFDSkEsWUFBUSxDQUFSO0FBREksU0FFQSxJQUFHQSxRQUFRLENBQVg7QUFDSkEsWUFBUSxDQUFSO0FBREk7QUFHSkEsWUFBUSxDQUFSO0FDNkRDOztBRDNERixTQUFPLElBQUkzWixJQUFKLENBQVM4WixJQUFULEVBQWVILEtBQWYsRUFBc0IsQ0FBdEIsQ0FBUDtBQWhCZ0MsQ0FBakM7O0FBbUJBM2dCLFFBQVFnaEIsc0JBQVIsR0FBaUMsVUFBQ0YsSUFBRCxFQUFNSCxLQUFOO0FBQ2hDLE1BQUcsQ0FBQ0csSUFBSjtBQUNDQSxXQUFPLElBQUk5WixJQUFKLEdBQVcrWixXQUFYLEVBQVA7QUM2REM7O0FENURGLE1BQUcsQ0FBQ0osS0FBSjtBQUNDQSxZQUFRLElBQUkzWixJQUFKLEdBQVc0WixRQUFYLEVBQVI7QUM4REM7O0FENURGLE1BQUdELFFBQVEsQ0FBWDtBQUNDQSxZQUFRLENBQVI7QUFERCxTQUVLLElBQUdBLFFBQVEsQ0FBWDtBQUNKQSxZQUFRLENBQVI7QUFESSxTQUVBLElBQUdBLFFBQVEsQ0FBWDtBQUNKQSxZQUFRLENBQVI7QUFESTtBQUdKRztBQUNBSCxZQUFRLENBQVI7QUM4REM7O0FENURGLFNBQU8sSUFBSTNaLElBQUosQ0FBUzhaLElBQVQsRUFBZUgsS0FBZixFQUFzQixDQUF0QixDQUFQO0FBaEJnQyxDQUFqQzs7QUFrQkEzZ0IsUUFBUWloQixZQUFSLEdBQXVCLFVBQUNILElBQUQsRUFBTUgsS0FBTjtBQUN0QixNQUFBTyxJQUFBLEVBQUFDLE9BQUEsRUFBQUMsV0FBQSxFQUFBQyxTQUFBOztBQUFBLE1BQUdWLFVBQVMsRUFBWjtBQUNDLFdBQU8sRUFBUDtBQ2dFQzs7QUQ5REZTLGdCQUFjLE9BQU8sRUFBUCxHQUFZLEVBQVosR0FBaUIsRUFBL0I7QUFDQUMsY0FBWSxJQUFJcmEsSUFBSixDQUFTOFosSUFBVCxFQUFlSCxLQUFmLEVBQXNCLENBQXRCLENBQVo7QUFDQVEsWUFBVSxJQUFJbmEsSUFBSixDQUFTOFosSUFBVCxFQUFlSCxRQUFNLENBQXJCLEVBQXdCLENBQXhCLENBQVY7QUFDQU8sU0FBTyxDQUFDQyxVQUFRRSxTQUFULElBQW9CRCxXQUEzQjtBQUNBLFNBQU9GLElBQVA7QUFSc0IsQ0FBdkI7O0FBVUFsaEIsUUFBUXNoQixvQkFBUixHQUErQixVQUFDUixJQUFELEVBQU9ILEtBQVA7QUFDOUIsTUFBRyxDQUFDRyxJQUFKO0FBQ0NBLFdBQU8sSUFBSTlaLElBQUosR0FBVytaLFdBQVgsRUFBUDtBQ2lFQzs7QURoRUYsTUFBRyxDQUFDSixLQUFKO0FBQ0NBLFlBQVEsSUFBSTNaLElBQUosR0FBVzRaLFFBQVgsRUFBUjtBQ2tFQzs7QUQvREYsTUFBR0QsVUFBUyxDQUFaO0FBQ0NBLFlBQVEsRUFBUjtBQUNBRztBQUNBLFdBQU8sSUFBSTlaLElBQUosQ0FBUzhaLElBQVQsRUFBZUgsS0FBZixFQUFzQixDQUF0QixDQUFQO0FDaUVDOztBRDlERkE7QUFDQSxTQUFPLElBQUkzWixJQUFKLENBQVM4WixJQUFULEVBQWVILEtBQWYsRUFBc0IsQ0FBdEIsQ0FBUDtBQWQ4QixDQUEvQjs7QUFnQkEzZ0IsUUFBUXVnQiw4QkFBUixHQUF5QyxVQUFDVCxVQUFELEVBQWEvWSxHQUFiO0FBRXhDLE1BQUF3YSxZQUFBLEVBQUFDLFdBQUEsRUFBQUMsUUFBQSxFQUFBQyxRQUFBLEVBQUE5VSxLQUFBLEVBQUErVSxPQUFBLEVBQUFDLFVBQUEsRUFBQUMsaUJBQUEsRUFBQUMsaUJBQUEsRUFBQUMsaUJBQUEsRUFBQUMsbUJBQUEsRUFBQUMsVUFBQSxFQUFBQyxhQUFBLEVBQUFDLFlBQUEsRUFBQUMsWUFBQSxFQUFBQyxXQUFBLEVBQUFDLFlBQUEsRUFBQWxCLFdBQUEsRUFBQW1CLFFBQUEsRUFBQUMsTUFBQSxFQUFBN0IsS0FBQSxFQUFBOEIsVUFBQSxFQUFBQyxpQkFBQSxFQUFBQyxpQkFBQSxFQUFBQyxpQkFBQSxFQUFBQyxtQkFBQSxFQUFBQyxVQUFBLEVBQUFDLFFBQUEsRUFBQUMsYUFBQSxFQUFBQyxZQUFBLEVBQUFDLFlBQUEsRUFBQUMsV0FBQSxFQUFBQyxZQUFBLEVBQUFDLEdBQUEsRUFBQUMsWUFBQSxFQUFBQyxVQUFBLEVBQUFDLFNBQUEsRUFBQUMsV0FBQSxFQUFBQyxVQUFBLEVBQUFDLFNBQUEsRUFBQUMsV0FBQSxFQUFBQyxTQUFBLEVBQUFDLFFBQUEsRUFBQUMsV0FBQSxFQUFBQyxVQUFBLEVBQUFDLE1BQUEsRUFBQUMsaUJBQUEsRUFBQUMsbUJBQUEsRUFBQUMsUUFBQSxFQUFBaGUsTUFBQSxFQUFBaWUsSUFBQSxFQUFBdkQsSUFBQSxFQUFBd0QsT0FBQTtBQUFBakIsUUFBTSxJQUFJcmMsSUFBSixFQUFOO0FBRUFvYSxnQkFBYyxPQUFPLEVBQVAsR0FBWSxFQUFaLEdBQWlCLEVBQS9CO0FBQ0FrRCxZQUFVLElBQUl0ZCxJQUFKLENBQVNxYyxJQUFJcGMsT0FBSixLQUFnQm1hLFdBQXpCLENBQVY7QUFDQWdELGFBQVcsSUFBSXBkLElBQUosQ0FBU3FjLElBQUlwYyxPQUFKLEtBQWdCbWEsV0FBekIsQ0FBWDtBQUVBaUQsU0FBT2hCLElBQUlrQixNQUFKLEVBQVA7QUFFQWhDLGFBQWM4QixTQUFRLENBQVIsR0FBZUEsT0FBTyxDQUF0QixHQUE2QixDQUEzQztBQUNBN0IsV0FBUyxJQUFJeGIsSUFBSixDQUFTcWMsSUFBSXBjLE9BQUosS0FBaUJzYixXQUFXbkIsV0FBckMsQ0FBVDtBQUNBNkMsV0FBUyxJQUFJamQsSUFBSixDQUFTd2IsT0FBT3ZiLE9BQVAsS0FBb0IsSUFBSW1hLFdBQWpDLENBQVQ7QUFFQWEsZUFBYSxJQUFJamIsSUFBSixDQUFTd2IsT0FBT3ZiLE9BQVAsS0FBbUJtYSxXQUE1QixDQUFiO0FBRUFRLGVBQWEsSUFBSTVhLElBQUosQ0FBU2liLFdBQVdoYixPQUFYLEtBQXdCbWEsY0FBYyxDQUEvQyxDQUFiO0FBRUFxQixlQUFhLElBQUl6YixJQUFKLENBQVNpZCxPQUFPaGQsT0FBUCxLQUFtQm1hLFdBQTVCLENBQWI7QUFFQTBCLGVBQWEsSUFBSTliLElBQUosQ0FBU3liLFdBQVd4YixPQUFYLEtBQXdCbWEsY0FBYyxDQUEvQyxDQUFiO0FBQ0FJLGdCQUFjNkIsSUFBSXRDLFdBQUosRUFBZDtBQUNBdUMsaUJBQWU5QixjQUFjLENBQTdCO0FBQ0F1QixhQUFXdkIsY0FBYyxDQUF6QjtBQUVBRCxpQkFBZThCLElBQUl6QyxRQUFKLEVBQWY7QUFFQUUsU0FBT3VDLElBQUl0QyxXQUFKLEVBQVA7QUFDQUosVUFBUTBDLElBQUl6QyxRQUFKLEVBQVI7QUFFQWMsYUFBVyxJQUFJMWEsSUFBSixDQUFTd2EsV0FBVCxFQUFxQkQsWUFBckIsRUFBa0MsQ0FBbEMsQ0FBWDs7QUFJQSxNQUFHQSxpQkFBZ0IsRUFBbkI7QUFDQ1Q7QUFDQUg7QUFGRDtBQUlDQTtBQ29EQzs7QURqREZnQyxzQkFBb0IsSUFBSTNiLElBQUosQ0FBUzhaLElBQVQsRUFBZUgsS0FBZixFQUFzQixDQUF0QixDQUFwQjtBQUVBK0Isc0JBQW9CLElBQUkxYixJQUFKLENBQVM4WixJQUFULEVBQWNILEtBQWQsRUFBb0IzZ0IsUUFBUWloQixZQUFSLENBQXFCSCxJQUFyQixFQUEwQkgsS0FBMUIsQ0FBcEIsQ0FBcEI7QUFFQWdCLFlBQVUsSUFBSTNhLElBQUosQ0FBUzJiLGtCQUFrQjFiLE9BQWxCLEtBQThCbWEsV0FBdkMsQ0FBVjtBQUVBVSxzQkFBb0I5aEIsUUFBUXNoQixvQkFBUixDQUE2QkUsV0FBN0IsRUFBeUNELFlBQXpDLENBQXBCO0FBRUFNLHNCQUFvQixJQUFJN2EsSUFBSixDQUFTMGEsU0FBU3phLE9BQVQsS0FBcUJtYSxXQUE5QixDQUFwQjtBQUVBK0Msd0JBQXNCLElBQUluZCxJQUFKLENBQVN3YSxXQUFULEVBQXFCeGhCLFFBQVEwZ0Isb0JBQVIsQ0FBNkJhLFlBQTdCLENBQXJCLEVBQWdFLENBQWhFLENBQXRCO0FBRUEyQyxzQkFBb0IsSUFBSWxkLElBQUosQ0FBU3dhLFdBQVQsRUFBcUJ4aEIsUUFBUTBnQixvQkFBUixDQUE2QmEsWUFBN0IsSUFBMkMsQ0FBaEUsRUFBa0V2aEIsUUFBUWloQixZQUFSLENBQXFCTyxXQUFyQixFQUFpQ3hoQixRQUFRMGdCLG9CQUFSLENBQTZCYSxZQUE3QixJQUEyQyxDQUE1RSxDQUFsRSxDQUFwQjtBQUVBUyx3QkFBc0JoaUIsUUFBUTZnQixzQkFBUixDQUErQlcsV0FBL0IsRUFBMkNELFlBQTNDLENBQXRCO0FBRUFRLHNCQUFvQixJQUFJL2EsSUFBSixDQUFTZ2Isb0JBQW9CakIsV0FBcEIsRUFBVCxFQUEyQ2lCLG9CQUFvQnBCLFFBQXBCLEtBQStCLENBQTFFLEVBQTRFNWdCLFFBQVFpaEIsWUFBUixDQUFxQmUsb0JBQW9CakIsV0FBcEIsRUFBckIsRUFBdURpQixvQkFBb0JwQixRQUFwQixLQUErQixDQUF0RixDQUE1RSxDQUFwQjtBQUVBaUMsd0JBQXNCN2lCLFFBQVFnaEIsc0JBQVIsQ0FBK0JRLFdBQS9CLEVBQTJDRCxZQUEzQyxDQUF0QjtBQUVBcUIsc0JBQW9CLElBQUk1YixJQUFKLENBQVM2YixvQkFBb0I5QixXQUFwQixFQUFULEVBQTJDOEIsb0JBQW9CakMsUUFBcEIsS0FBK0IsQ0FBMUUsRUFBNEU1Z0IsUUFBUWloQixZQUFSLENBQXFCNEIsb0JBQW9COUIsV0FBcEIsRUFBckIsRUFBdUQ4QixvQkFBb0JqQyxRQUFwQixLQUErQixDQUF0RixDQUE1RSxDQUFwQjtBQUVBeUIsZ0JBQWMsSUFBSXJiLElBQUosQ0FBU3FjLElBQUlwYyxPQUFKLEtBQWlCLElBQUltYSxXQUE5QixDQUFkO0FBRUFlLGlCQUFlLElBQUluYixJQUFKLENBQVNxYyxJQUFJcGMsT0FBSixLQUFpQixLQUFLbWEsV0FBL0IsQ0FBZjtBQUVBZ0IsaUJBQWUsSUFBSXBiLElBQUosQ0FBU3FjLElBQUlwYyxPQUFKLEtBQWlCLEtBQUttYSxXQUEvQixDQUFmO0FBRUFrQixpQkFBZSxJQUFJdGIsSUFBSixDQUFTcWMsSUFBSXBjLE9BQUosS0FBaUIsS0FBS21hLFdBQS9CLENBQWY7QUFFQWMsa0JBQWdCLElBQUlsYixJQUFKLENBQVNxYyxJQUFJcGMsT0FBSixLQUFpQixNQUFNbWEsV0FBaEMsQ0FBaEI7QUFFQStCLGdCQUFjLElBQUluYyxJQUFKLENBQVNxYyxJQUFJcGMsT0FBSixLQUFpQixJQUFJbWEsV0FBOUIsQ0FBZDtBQUVBNkIsaUJBQWUsSUFBSWpjLElBQUosQ0FBU3FjLElBQUlwYyxPQUFKLEtBQWlCLEtBQUttYSxXQUEvQixDQUFmO0FBRUE4QixpQkFBZSxJQUFJbGMsSUFBSixDQUFTcWMsSUFBSXBjLE9BQUosS0FBaUIsS0FBS21hLFdBQS9CLENBQWY7QUFFQWdDLGlCQUFlLElBQUlwYyxJQUFKLENBQVNxYyxJQUFJcGMsT0FBSixLQUFpQixLQUFLbWEsV0FBL0IsQ0FBZjtBQUVBNEIsa0JBQWdCLElBQUloYyxJQUFKLENBQVNxYyxJQUFJcGMsT0FBSixLQUFpQixNQUFNbWEsV0FBaEMsQ0FBaEI7O0FBRUEsVUFBT3JhLEdBQVA7QUFBQSxTQUNNLFdBRE47QUFHRTZGLGNBQVFxTyxFQUFFLDRDQUFGLENBQVI7QUFDQXNJLG1CQUFhLElBQUl2YyxJQUFKLENBQVlzYyxlQUFhLGtCQUF6QixDQUFiO0FBQ0E3QixpQkFBVyxJQUFJemEsSUFBSixDQUFZc2MsZUFBYSxrQkFBekIsQ0FBWDtBQUpJOztBQUROLFNBTU0sV0FOTjtBQVFFMVcsY0FBUXFPLEVBQUUsNENBQUYsQ0FBUjtBQUNBc0ksbUJBQWEsSUFBSXZjLElBQUosQ0FBWXdhLGNBQVksa0JBQXhCLENBQWI7QUFDQUMsaUJBQVcsSUFBSXphLElBQUosQ0FBWXdhLGNBQVksa0JBQXhCLENBQVg7QUFKSTs7QUFOTixTQVdNLFdBWE47QUFhRTVVLGNBQVFxTyxFQUFFLDRDQUFGLENBQVI7QUFDQXNJLG1CQUFhLElBQUl2YyxJQUFKLENBQVkrYixXQUFTLGtCQUFyQixDQUFiO0FBQ0F0QixpQkFBVyxJQUFJemEsSUFBSixDQUFZK2IsV0FBUyxrQkFBckIsQ0FBWDtBQUpJOztBQVhOLFNBZ0JNLGNBaEJOO0FBa0JFVSxvQkFBYy9ELE9BQU9zQyxtQkFBUCxFQUE0QnBDLE1BQTVCLENBQW1DLFlBQW5DLENBQWQ7QUFDQThELG1CQUFhaEUsT0FBT3FDLGlCQUFQLEVBQTBCbkMsTUFBMUIsQ0FBaUMsWUFBakMsQ0FBYjtBQUNBaFQsY0FBUXFPLEVBQUUsK0NBQUYsQ0FBUjtBQUNBc0ksbUJBQWEsSUFBSXZjLElBQUosQ0FBWXljLGNBQVksWUFBeEIsQ0FBYjtBQUNBaEMsaUJBQVcsSUFBSXphLElBQUosQ0FBWTBjLGFBQVcsWUFBdkIsQ0FBWDtBQU5JOztBQWhCTixTQXVCTSxjQXZCTjtBQXlCRUQsb0JBQWMvRCxPQUFPeUUsbUJBQVAsRUFBNEJ2RSxNQUE1QixDQUFtQyxZQUFuQyxDQUFkO0FBQ0E4RCxtQkFBYWhFLE9BQU93RSxpQkFBUCxFQUEwQnRFLE1BQTFCLENBQWlDLFlBQWpDLENBQWI7QUFDQWhULGNBQVFxTyxFQUFFLCtDQUFGLENBQVI7QUFDQXNJLG1CQUFhLElBQUl2YyxJQUFKLENBQVl5YyxjQUFZLFlBQXhCLENBQWI7QUFDQWhDLGlCQUFXLElBQUl6YSxJQUFKLENBQVkwYyxhQUFXLFlBQXZCLENBQVg7QUFOSTs7QUF2Qk4sU0E4Qk0sY0E5Qk47QUFnQ0VELG9CQUFjL0QsT0FBT21ELG1CQUFQLEVBQTRCakQsTUFBNUIsQ0FBbUMsWUFBbkMsQ0FBZDtBQUNBOEQsbUJBQWFoRSxPQUFPa0QsaUJBQVAsRUFBMEJoRCxNQUExQixDQUFpQyxZQUFqQyxDQUFiO0FBQ0FoVCxjQUFRcU8sRUFBRSwrQ0FBRixDQUFSO0FBQ0FzSSxtQkFBYSxJQUFJdmMsSUFBSixDQUFZeWMsY0FBWSxZQUF4QixDQUFiO0FBQ0FoQyxpQkFBVyxJQUFJemEsSUFBSixDQUFZMGMsYUFBVyxZQUF2QixDQUFYO0FBTkk7O0FBOUJOLFNBcUNNLFlBckNOO0FBdUNFRCxvQkFBYy9ELE9BQU9vQyxpQkFBUCxFQUEwQmxDLE1BQTFCLENBQWlDLFlBQWpDLENBQWQ7QUFDQThELG1CQUFhaEUsT0FBT21DLGlCQUFQLEVBQTBCakMsTUFBMUIsQ0FBaUMsWUFBakMsQ0FBYjtBQUNBaFQsY0FBUXFPLEVBQUUsNkNBQUYsQ0FBUjtBQUNBc0ksbUJBQWEsSUFBSXZjLElBQUosQ0FBWXljLGNBQVksWUFBeEIsQ0FBYjtBQUNBaEMsaUJBQVcsSUFBSXphLElBQUosQ0FBWTBjLGFBQVcsWUFBdkIsQ0FBWDtBQU5JOztBQXJDTixTQTRDTSxZQTVDTjtBQThDRUQsb0JBQWMvRCxPQUFPZ0MsUUFBUCxFQUFpQjlCLE1BQWpCLENBQXdCLFlBQXhCLENBQWQ7QUFDQThELG1CQUFhaEUsT0FBT2lDLE9BQVAsRUFBZ0IvQixNQUFoQixDQUF1QixZQUF2QixDQUFiO0FBQ0FoVCxjQUFRcU8sRUFBRSw2Q0FBRixDQUFSO0FBQ0FzSSxtQkFBYSxJQUFJdmMsSUFBSixDQUFZeWMsY0FBWSxZQUF4QixDQUFiO0FBQ0FoQyxpQkFBVyxJQUFJemEsSUFBSixDQUFZMGMsYUFBVyxZQUF2QixDQUFYO0FBTkk7O0FBNUNOLFNBbURNLFlBbkROO0FBcURFRCxvQkFBYy9ELE9BQU9pRCxpQkFBUCxFQUEwQi9DLE1BQTFCLENBQWlDLFlBQWpDLENBQWQ7QUFDQThELG1CQUFhaEUsT0FBT2dELGlCQUFQLEVBQTBCOUMsTUFBMUIsQ0FBaUMsWUFBakMsQ0FBYjtBQUNBaFQsY0FBUXFPLEVBQUUsNkNBQUYsQ0FBUjtBQUNBc0ksbUJBQWEsSUFBSXZjLElBQUosQ0FBWXljLGNBQVksWUFBeEIsQ0FBYjtBQUNBaEMsaUJBQVcsSUFBSXphLElBQUosQ0FBWTBjLGFBQVcsWUFBdkIsQ0FBWDtBQU5JOztBQW5ETixTQTBETSxXQTFETjtBQTRERUMsa0JBQVlqRSxPQUFPa0MsVUFBUCxFQUFtQmhDLE1BQW5CLENBQTBCLFlBQTFCLENBQVo7QUFDQWlFLGtCQUFZbkUsT0FBT3VDLFVBQVAsRUFBbUJyQyxNQUFuQixDQUEwQixZQUExQixDQUFaO0FBQ0FoVCxjQUFRcU8sRUFBRSw0Q0FBRixDQUFSO0FBQ0FzSSxtQkFBYSxJQUFJdmMsSUFBSixDQUFZMmMsWUFBVSxZQUF0QixDQUFiO0FBQ0FsQyxpQkFBVyxJQUFJemEsSUFBSixDQUFZNmMsWUFBVSxZQUF0QixDQUFYO0FBTkk7O0FBMUROLFNBaUVNLFdBakVOO0FBbUVFRixrQkFBWWpFLE9BQU84QyxNQUFQLEVBQWU1QyxNQUFmLENBQXNCLFlBQXRCLENBQVo7QUFDQWlFLGtCQUFZbkUsT0FBT3VFLE1BQVAsRUFBZXJFLE1BQWYsQ0FBc0IsWUFBdEIsQ0FBWjtBQUNBaFQsY0FBUXFPLEVBQUUsNENBQUYsQ0FBUjtBQUNBc0ksbUJBQWEsSUFBSXZjLElBQUosQ0FBWTJjLFlBQVUsWUFBdEIsQ0FBYjtBQUNBbEMsaUJBQVcsSUFBSXphLElBQUosQ0FBWTZjLFlBQVUsWUFBdEIsQ0FBWDtBQU5JOztBQWpFTixTQXdFTSxXQXhFTjtBQTBFRUYsa0JBQVlqRSxPQUFPK0MsVUFBUCxFQUFtQjdDLE1BQW5CLENBQTBCLFlBQTFCLENBQVo7QUFDQWlFLGtCQUFZbkUsT0FBT29ELFVBQVAsRUFBbUJsRCxNQUFuQixDQUEwQixZQUExQixDQUFaO0FBQ0FoVCxjQUFRcU8sRUFBRSw0Q0FBRixDQUFSO0FBQ0FzSSxtQkFBYSxJQUFJdmMsSUFBSixDQUFZMmMsWUFBVSxZQUF0QixDQUFiO0FBQ0FsQyxpQkFBVyxJQUFJemEsSUFBSixDQUFZNmMsWUFBVSxZQUF0QixDQUFYO0FBTkk7O0FBeEVOLFNBK0VNLFNBL0VOO0FBaUZFRyxtQkFBYXRFLE9BQU80RSxPQUFQLEVBQWdCMUUsTUFBaEIsQ0FBdUIsWUFBdkIsQ0FBYjtBQUNBaFQsY0FBUXFPLEVBQUUsMENBQUYsQ0FBUjtBQUNBc0ksbUJBQWEsSUFBSXZjLElBQUosQ0FBWWdkLGFBQVcsWUFBdkIsQ0FBYjtBQUNBdkMsaUJBQVcsSUFBSXphLElBQUosQ0FBWWdkLGFBQVcsWUFBdkIsQ0FBWDtBQUxJOztBQS9FTixTQXFGTSxPQXJGTjtBQXVGRUYsaUJBQVdwRSxPQUFPMkQsR0FBUCxFQUFZekQsTUFBWixDQUFtQixZQUFuQixDQUFYO0FBQ0FoVCxjQUFRcU8sRUFBRSx3Q0FBRixDQUFSO0FBQ0FzSSxtQkFBYSxJQUFJdmMsSUFBSixDQUFZOGMsV0FBUyxZQUFyQixDQUFiO0FBQ0FyQyxpQkFBVyxJQUFJemEsSUFBSixDQUFZOGMsV0FBUyxZQUFyQixDQUFYO0FBTEk7O0FBckZOLFNBMkZNLFVBM0ZOO0FBNkZFQyxvQkFBY3JFLE9BQU8wRSxRQUFQLEVBQWlCeEUsTUFBakIsQ0FBd0IsWUFBeEIsQ0FBZDtBQUNBaFQsY0FBUXFPLEVBQUUsMkNBQUYsQ0FBUjtBQUNBc0ksbUJBQWEsSUFBSXZjLElBQUosQ0FBWStjLGNBQVksWUFBeEIsQ0FBYjtBQUNBdEMsaUJBQVcsSUFBSXphLElBQUosQ0FBWStjLGNBQVksWUFBeEIsQ0FBWDtBQUxJOztBQTNGTixTQWlHTSxhQWpHTjtBQW1HRUgsb0JBQWNsRSxPQUFPMkMsV0FBUCxFQUFvQnpDLE1BQXBCLENBQTJCLFlBQTNCLENBQWQ7QUFDQTRELGtCQUFZOUQsT0FBTzJELEdBQVAsRUFBWXpELE1BQVosQ0FBbUIsWUFBbkIsQ0FBWjtBQUNBaFQsY0FBUXFPLEVBQUUsOENBQUYsQ0FBUjtBQUNBc0ksbUJBQWEsSUFBSXZjLElBQUosQ0FBWTRjLGNBQVksWUFBeEIsQ0FBYjtBQUNBbkMsaUJBQVcsSUFBSXphLElBQUosQ0FBWXdjLFlBQVUsWUFBdEIsQ0FBWDtBQU5JOztBQWpHTixTQXdHTSxjQXhHTjtBQTBHRUksb0JBQWNsRSxPQUFPeUMsWUFBUCxFQUFxQnZDLE1BQXJCLENBQTRCLFlBQTVCLENBQWQ7QUFDQTRELGtCQUFZOUQsT0FBTzJELEdBQVAsRUFBWXpELE1BQVosQ0FBbUIsWUFBbkIsQ0FBWjtBQUNBaFQsY0FBUXFPLEVBQUUsK0NBQUYsQ0FBUjtBQUNBc0ksbUJBQWEsSUFBSXZjLElBQUosQ0FBWTRjLGNBQVksWUFBeEIsQ0FBYjtBQUNBbkMsaUJBQVcsSUFBSXphLElBQUosQ0FBWXdjLFlBQVUsWUFBdEIsQ0FBWDtBQU5JOztBQXhHTixTQStHTSxjQS9HTjtBQWlIRUksb0JBQWNsRSxPQUFPMEMsWUFBUCxFQUFxQnhDLE1BQXJCLENBQTRCLFlBQTVCLENBQWQ7QUFDQTRELGtCQUFZOUQsT0FBTzJELEdBQVAsRUFBWXpELE1BQVosQ0FBbUIsWUFBbkIsQ0FBWjtBQUNBaFQsY0FBUXFPLEVBQUUsK0NBQUYsQ0FBUjtBQUNBc0ksbUJBQWEsSUFBSXZjLElBQUosQ0FBWTRjLGNBQVksWUFBeEIsQ0FBYjtBQUNBbkMsaUJBQVcsSUFBSXphLElBQUosQ0FBWXdjLFlBQVUsWUFBdEIsQ0FBWDtBQU5JOztBQS9HTixTQXNITSxjQXRITjtBQXdIRUksb0JBQWNsRSxPQUFPNEMsWUFBUCxFQUFxQjFDLE1BQXJCLENBQTRCLFlBQTVCLENBQWQ7QUFDQTRELGtCQUFZOUQsT0FBTzJELEdBQVAsRUFBWXpELE1BQVosQ0FBbUIsWUFBbkIsQ0FBWjtBQUNBaFQsY0FBUXFPLEVBQUUsK0NBQUYsQ0FBUjtBQUNBc0ksbUJBQWEsSUFBSXZjLElBQUosQ0FBWTRjLGNBQVksWUFBeEIsQ0FBYjtBQUNBbkMsaUJBQVcsSUFBSXphLElBQUosQ0FBWXdjLFlBQVUsWUFBdEIsQ0FBWDtBQU5JOztBQXRITixTQTZITSxlQTdITjtBQStIRUksb0JBQWNsRSxPQUFPd0MsYUFBUCxFQUFzQnRDLE1BQXRCLENBQTZCLFlBQTdCLENBQWQ7QUFDQTRELGtCQUFZOUQsT0FBTzJELEdBQVAsRUFBWXpELE1BQVosQ0FBbUIsWUFBbkIsQ0FBWjtBQUNBaFQsY0FBUXFPLEVBQUUsZ0RBQUYsQ0FBUjtBQUNBc0ksbUJBQWEsSUFBSXZjLElBQUosQ0FBWTRjLGNBQVksWUFBeEIsQ0FBYjtBQUNBbkMsaUJBQVcsSUFBSXphLElBQUosQ0FBWXdjLFlBQVUsWUFBdEIsQ0FBWDtBQU5JOztBQTdITixTQW9JTSxhQXBJTjtBQXNJRUksb0JBQWNsRSxPQUFPMkQsR0FBUCxFQUFZekQsTUFBWixDQUFtQixZQUFuQixDQUFkO0FBQ0E0RCxrQkFBWTlELE9BQU95RCxXQUFQLEVBQW9CdkQsTUFBcEIsQ0FBMkIsWUFBM0IsQ0FBWjtBQUNBaFQsY0FBUXFPLEVBQUUsOENBQUYsQ0FBUjtBQUNBc0ksbUJBQWEsSUFBSXZjLElBQUosQ0FBWTRjLGNBQVksWUFBeEIsQ0FBYjtBQUNBbkMsaUJBQVcsSUFBSXphLElBQUosQ0FBWXdjLFlBQVUsWUFBdEIsQ0FBWDtBQU5JOztBQXBJTixTQTJJTSxjQTNJTjtBQTZJRUksb0JBQWNsRSxPQUFPMkQsR0FBUCxFQUFZekQsTUFBWixDQUFtQixZQUFuQixDQUFkO0FBQ0E0RCxrQkFBWTlELE9BQU91RCxZQUFQLEVBQXFCckQsTUFBckIsQ0FBNEIsWUFBNUIsQ0FBWjtBQUNBaFQsY0FBUXFPLEVBQUUsK0NBQUYsQ0FBUjtBQUNBc0ksbUJBQWEsSUFBSXZjLElBQUosQ0FBWTRjLGNBQVksWUFBeEIsQ0FBYjtBQUNBbkMsaUJBQVcsSUFBSXphLElBQUosQ0FBWXdjLFlBQVUsWUFBdEIsQ0FBWDtBQU5JOztBQTNJTixTQWtKTSxjQWxKTjtBQW9KRUksb0JBQWNsRSxPQUFPMkQsR0FBUCxFQUFZekQsTUFBWixDQUFtQixZQUFuQixDQUFkO0FBQ0E0RCxrQkFBWTlELE9BQU93RCxZQUFQLEVBQXFCdEQsTUFBckIsQ0FBNEIsWUFBNUIsQ0FBWjtBQUNBaFQsY0FBUXFPLEVBQUUsK0NBQUYsQ0FBUjtBQUNBc0ksbUJBQWEsSUFBSXZjLElBQUosQ0FBWTRjLGNBQVksWUFBeEIsQ0FBYjtBQUNBbkMsaUJBQVcsSUFBSXphLElBQUosQ0FBWXdjLFlBQVUsWUFBdEIsQ0FBWDtBQU5JOztBQWxKTixTQXlKTSxjQXpKTjtBQTJKRUksb0JBQWNsRSxPQUFPMkQsR0FBUCxFQUFZekQsTUFBWixDQUFtQixZQUFuQixDQUFkO0FBQ0E0RCxrQkFBWTlELE9BQU8wRCxZQUFQLEVBQXFCeEQsTUFBckIsQ0FBNEIsWUFBNUIsQ0FBWjtBQUNBaFQsY0FBUXFPLEVBQUUsK0NBQUYsQ0FBUjtBQUNBc0ksbUJBQWEsSUFBSXZjLElBQUosQ0FBWTRjLGNBQVksWUFBeEIsQ0FBYjtBQUNBbkMsaUJBQVcsSUFBSXphLElBQUosQ0FBWXdjLFlBQVUsWUFBdEIsQ0FBWDtBQU5JOztBQXpKTixTQWdLTSxlQWhLTjtBQWtLRUksb0JBQWNsRSxPQUFPMkQsR0FBUCxFQUFZekQsTUFBWixDQUFtQixZQUFuQixDQUFkO0FBQ0E0RCxrQkFBWTlELE9BQU9zRCxhQUFQLEVBQXNCcEQsTUFBdEIsQ0FBNkIsWUFBN0IsQ0FBWjtBQUNBaFQsY0FBUXFPLEVBQUUsZ0RBQUYsQ0FBUjtBQUNBc0ksbUJBQWEsSUFBSXZjLElBQUosQ0FBWTRjLGNBQVksWUFBeEIsQ0FBYjtBQUNBbkMsaUJBQVcsSUFBSXphLElBQUosQ0FBWXdjLFlBQVUsWUFBdEIsQ0FBWDtBQXRLRjs7QUF3S0FwZCxXQUFTLENBQUNtZCxVQUFELEVBQWE5QixRQUFiLENBQVQ7O0FBQ0EsTUFBRzNCLGVBQWMsVUFBakI7QUFJQ3ZjLE1BQUUyTyxPQUFGLENBQVU5TCxNQUFWLEVBQWtCLFVBQUNvZSxFQUFEO0FBQ2pCLFVBQUdBLEVBQUg7QUMwQkssZUR6QkpBLEdBQUdDLFFBQUgsQ0FBWUQsR0FBR0UsUUFBSCxLQUFnQkYsR0FBR0csaUJBQUgsS0FBeUIsRUFBckQsQ0N5Qkk7QUFDRDtBRDVCTDtBQzhCQzs7QUQxQkYsU0FBTztBQUNOL1gsV0FBT0EsS0FERDtBQUVON0YsU0FBS0EsR0FGQztBQUdOWCxZQUFRQTtBQUhGLEdBQVA7QUFwUXdDLENBQXpDOztBQTBRQXBHLFFBQVE0a0Isd0JBQVIsR0FBbUMsVUFBQzlFLFVBQUQ7QUFDbEMsTUFBR0EsY0FBYzlmLFFBQVE2ZixpQ0FBUixDQUEwQ0MsVUFBMUMsQ0FBakI7QUFDQyxXQUFPLFNBQVA7QUFERCxTQUVLLElBQUcsQ0FBQyxVQUFELEVBQWEsTUFBYixFQUFxQixNQUFyQixFQUE2QmxSLFFBQTdCLENBQXNDa1IsVUFBdEMsQ0FBSDtBQUNKLFdBQU8sVUFBUDtBQURJO0FBR0osV0FBTyxHQUFQO0FDNkJDO0FEbkNnQyxDQUFuQzs7QUFRQTlmLFFBQVE2a0IsaUJBQVIsR0FBNEIsVUFBQy9FLFVBQUQ7QUFRM0IsTUFBQUUsVUFBQSxFQUFBOEUsU0FBQTtBQUFBQSxjQUFZO0FBQ1hDLFdBQU87QUFBQ25ZLGFBQU9xTyxFQUFFLGdDQUFGLENBQVI7QUFBNkNyVixhQUFPO0FBQXBELEtBREk7QUFFWG9mLGFBQVM7QUFBQ3BZLGFBQU9xTyxFQUFFLGtDQUFGLENBQVI7QUFBK0NyVixhQUFPO0FBQXRELEtBRkU7QUFHWHFmLGVBQVc7QUFBQ3JZLGFBQU9xTyxFQUFFLG9DQUFGLENBQVI7QUFBaURyVixhQUFPO0FBQXhELEtBSEE7QUFJWHNmLGtCQUFjO0FBQUN0WSxhQUFPcU8sRUFBRSx1Q0FBRixDQUFSO0FBQW9EclYsYUFBTztBQUEzRCxLQUpIO0FBS1h1ZixtQkFBZTtBQUFDdlksYUFBT3FPLEVBQUUsd0NBQUYsQ0FBUjtBQUFxRHJWLGFBQU87QUFBNUQsS0FMSjtBQU1Yd2Ysc0JBQWtCO0FBQUN4WSxhQUFPcU8sRUFBRSwyQ0FBRixDQUFSO0FBQXdEclYsYUFBTztBQUEvRCxLQU5QO0FBT1hnVixjQUFVO0FBQUNoTyxhQUFPcU8sRUFBRSxtQ0FBRixDQUFSO0FBQWdEclYsYUFBTztBQUF2RCxLQVBDO0FBUVh5ZixpQkFBYTtBQUFDelksYUFBT3FPLEVBQUUsMkNBQUYsQ0FBUjtBQUF3RHJWLGFBQU87QUFBL0QsS0FSRjtBQVNYMGYsaUJBQWE7QUFBQzFZLGFBQU9xTyxFQUFFLHNDQUFGLENBQVI7QUFBbURyVixhQUFPO0FBQTFELEtBVEY7QUFVWDJmLGFBQVM7QUFBQzNZLGFBQU9xTyxFQUFFLGtDQUFGLENBQVI7QUFBK0NyVixhQUFPO0FBQXREO0FBVkUsR0FBWjs7QUFhQSxNQUFHa2EsZUFBYyxNQUFqQjtBQUNDLFdBQU92YyxFQUFFNkMsTUFBRixDQUFTMGUsU0FBVCxDQUFQO0FDc0RDOztBRHBERjlFLGVBQWEsRUFBYjs7QUFFQSxNQUFHaGdCLFFBQVE2ZixpQ0FBUixDQUEwQ0MsVUFBMUMsQ0FBSDtBQUNDRSxlQUFXdFksSUFBWCxDQUFnQm9kLFVBQVVTLE9BQTFCO0FBQ0F2bEIsWUFBUStmLDJCQUFSLENBQW9DRCxVQUFwQyxFQUFnREUsVUFBaEQ7QUFGRCxTQUdLLElBQUdGLGVBQWMsTUFBZCxJQUF3QkEsZUFBYyxVQUF0QyxJQUFvREEsZUFBYyxNQUFsRSxJQUE0RUEsZUFBYyxNQUE3RjtBQUVKRSxlQUFXdFksSUFBWCxDQUFnQm9kLFVBQVVsSyxRQUExQjtBQUZJLFNBR0EsSUFBR2tGLGVBQWMsUUFBZCxJQUEwQkEsZUFBYyxlQUF4QyxJQUEyREEsZUFBYyxRQUE1RTtBQUNKRSxlQUFXdFksSUFBWCxDQUFnQm9kLFVBQVVDLEtBQTFCLEVBQWlDRCxVQUFVRSxPQUEzQztBQURJLFNBRUEsSUFBR2xGLGVBQWMsVUFBZCxJQUE0QkEsZUFBYyxRQUE3QztBQUNKRSxlQUFXdFksSUFBWCxDQUFnQm9kLFVBQVVDLEtBQTFCLEVBQWlDRCxVQUFVRSxPQUEzQyxFQUFvREYsVUFBVUcsU0FBOUQsRUFBeUVILFVBQVVJLFlBQW5GLEVBQWlHSixVQUFVSyxhQUEzRyxFQUEwSEwsVUFBVU0sZ0JBQXBJO0FBREksU0FFQSxJQUFHdEYsZUFBYyxTQUFqQjtBQUNKRSxlQUFXdFksSUFBWCxDQUFnQm9kLFVBQVVDLEtBQTFCLEVBQWlDRCxVQUFVRSxPQUEzQztBQURJLFNBRUEsSUFBR2xGLGVBQWMsVUFBakI7QUFDSkUsZUFBV3RZLElBQVgsQ0FBZ0JvZCxVQUFVQyxLQUExQixFQUFpQ0QsVUFBVUUsT0FBM0M7QUFESSxTQUVBLElBQUdsRixlQUFjLFFBQWpCO0FBQ0pFLGVBQVd0WSxJQUFYLENBQWdCb2QsVUFBVUMsS0FBMUIsRUFBaUNELFVBQVVFLE9BQTNDO0FBREk7QUFHSmhGLGVBQVd0WSxJQUFYLENBQWdCb2QsVUFBVUMsS0FBMUIsRUFBaUNELFVBQVVFLE9BQTNDO0FDb0RDOztBRGxERixTQUFPaEYsVUFBUDtBQTdDMkIsQ0FBNUIsQyxDQStDQTs7Ozs7QUFJQWhnQixRQUFRd2xCLG1CQUFSLEdBQThCLFVBQUNoakIsV0FBRDtBQUM3QixNQUFBc0YsTUFBQSxFQUFBeVQsU0FBQSxFQUFBa0ssVUFBQSxFQUFBcGlCLEdBQUE7QUFBQXlFLFdBQUEsQ0FBQXpFLE1BQUFyRCxRQUFBbUQsU0FBQSxDQUFBWCxXQUFBLGFBQUFhLElBQXlDeUUsTUFBekMsR0FBeUMsTUFBekM7QUFDQXlULGNBQVksRUFBWjs7QUFFQWhZLElBQUVrQyxJQUFGLENBQU9xQyxNQUFQLEVBQWUsVUFBQ3NJLEtBQUQ7QUN1RFosV0R0REZtTCxVQUFVN1QsSUFBVixDQUFlO0FBQUMvRSxZQUFNeU4sTUFBTXpOLElBQWI7QUFBbUIraUIsZUFBU3RWLE1BQU1zVjtBQUFsQyxLQUFmLENDc0RFO0FEdkRIOztBQUdBRCxlQUFhLEVBQWI7O0FBQ0FsaUIsSUFBRWtDLElBQUYsQ0FBT2xDLEVBQUUrQyxNQUFGLENBQVNpVixTQUFULEVBQW9CLFNBQXBCLENBQVAsRUFBdUMsVUFBQ25MLEtBQUQ7QUMwRHBDLFdEekRGcVYsV0FBVy9kLElBQVgsQ0FBZ0IwSSxNQUFNek4sSUFBdEIsQ0N5REU7QUQxREg7O0FBRUEsU0FBTzhpQixVQUFQO0FBVjZCLENBQTlCLEM7Ozs7Ozs7Ozs7OztBRTE3QkEsSUFBQUUsWUFBQSxFQUFBQyxXQUFBO0FBQUE1bEIsUUFBUTZsQixjQUFSLEdBQXlCLEVBQXpCOztBQUVBRCxjQUFjLFVBQUNwakIsV0FBRCxFQUFjMFMsT0FBZDtBQUNiLE1BQUE3SixVQUFBLEVBQUFySyxLQUFBLEVBQUE4a0IsV0FBQTs7QUFBQTtBQUNDemEsaUJBQWFyTCxRQUFRdUUsYUFBUixDQUFzQi9CLFdBQXRCLENBQWI7O0FBQ0EsUUFBRyxDQUFDMFMsUUFBUUssSUFBWjtBQUNDO0FDSUU7O0FESEh1USxrQkFBYztBQUNYLFdBQUt0akIsV0FBTCxHQUFtQkEsV0FBbkI7QUFDQSxhQUFPMFMsUUFBUUssSUFBUixDQUFhd1EsS0FBYixDQUFtQixJQUFuQixFQUF5QkMsU0FBekIsQ0FBUDtBQUZXLEtBQWQ7O0FBR0EsUUFBRzlRLFFBQVErUSxJQUFSLEtBQWdCLGVBQW5CO0FBQ0csYUFBTzVhLFdBQVc2YSxNQUFYLENBQWtCQyxNQUFsQixDQUF5QkwsV0FBekIsQ0FBUDtBQURILFdBRU8sSUFBRzVRLFFBQVErUSxJQUFSLEtBQWdCLGVBQW5CO0FBQ0osYUFBTzVhLFdBQVc2YSxNQUFYLENBQWtCMVcsTUFBbEIsQ0FBeUJzVyxXQUF6QixDQUFQO0FBREksV0FFQSxJQUFHNVEsUUFBUStRLElBQVIsS0FBZ0IsZUFBbkI7QUFDSixhQUFPNWEsV0FBVzZhLE1BQVgsQ0FBa0JFLE1BQWxCLENBQXlCTixXQUF6QixDQUFQO0FBREksV0FFQSxJQUFHNVEsUUFBUStRLElBQVIsS0FBZ0IsY0FBbkI7QUFDSixhQUFPNWEsV0FBV2diLEtBQVgsQ0FBaUJGLE1BQWpCLENBQXdCTCxXQUF4QixDQUFQO0FBREksV0FFQSxJQUFHNVEsUUFBUStRLElBQVIsS0FBZ0IsY0FBbkI7QUFDSixhQUFPNWEsV0FBV2diLEtBQVgsQ0FBaUI3VyxNQUFqQixDQUF3QnNXLFdBQXhCLENBQVA7QUFESSxXQUVBLElBQUc1USxRQUFRK1EsSUFBUixLQUFnQixjQUFuQjtBQUNKLGFBQU81YSxXQUFXZ2IsS0FBWCxDQUFpQkQsTUFBakIsQ0FBd0JOLFdBQXhCLENBQVA7QUFsQko7QUFBQSxXQUFBcFEsTUFBQTtBQW1CTTFVLFlBQUEwVSxNQUFBO0FDUUgsV0RQRnpVLFFBQVFELEtBQVIsQ0FBYyxtQkFBZCxFQUFtQ0EsS0FBbkMsQ0NPRTtBQUNEO0FEN0JXLENBQWQ7O0FBdUJBMmtCLGVBQWUsVUFBQ25qQixXQUFEO0FBQ2Q7OztLQUFBLElBQUFhLEdBQUE7QUNlQyxTQUFPLENBQUNBLE1BQU1yRCxRQUFRNmxCLGNBQVIsQ0FBdUJyakIsV0FBdkIsQ0FBUCxLQUErQyxJQUEvQyxHQUFzRGEsSURWekJpakIsT0NVeUIsR0RWZnBVLE9DVWUsQ0RWUCxVQUFDcVUsS0FBRDtBQ1dwRCxXRFZGQSxNQUFNSCxNQUFOLEVDVUU7QURYSCxHQ1U4RCxDQUF0RCxHRFZSLE1DVUM7QURoQmEsQ0FBZjs7QUFTQXBtQixRQUFRZ0QsWUFBUixHQUF1QixVQUFDUixXQUFEO0FBRXRCLE1BQUFELEdBQUE7QUFBQUEsUUFBTXZDLFFBQVFtRCxTQUFSLENBQWtCWCxXQUFsQixDQUFOO0FBRUFtakIsZUFBYW5qQixXQUFiO0FBRUF4QyxVQUFRNmxCLGNBQVIsQ0FBdUJyakIsV0FBdkIsSUFBc0MsRUFBdEM7QUNXQyxTRFREZSxFQUFFa0MsSUFBRixDQUFPbEQsSUFBSTBTLFFBQVgsRUFBcUIsVUFBQ0MsT0FBRCxFQUFVc1IsWUFBVjtBQUNwQixRQUFBQyxhQUFBOztBQUFBLFFBQUc5bEIsT0FBTzBCLFFBQVAsSUFBb0I2UyxRQUFRSSxFQUFSLEtBQWMsUUFBbEMsSUFBK0NKLFFBQVFLLElBQXZELElBQWdFTCxRQUFRK1EsSUFBM0U7QUFDQ1Esc0JBQWdCYixZQUFZcGpCLFdBQVosRUFBeUIwUyxPQUF6QixDQUFoQjs7QUFDQWxWLGNBQVE2bEIsY0FBUixDQUF1QnJqQixXQUF2QixFQUFvQ2tGLElBQXBDLENBQXlDK2UsYUFBekM7QUNXRTs7QURWSCxRQUFHOWxCLE9BQU84QyxRQUFQLElBQW9CeVIsUUFBUUksRUFBUixLQUFjLFFBQWxDLElBQStDSixRQUFRSyxJQUF2RCxJQUFnRUwsUUFBUStRLElBQTNFO0FBQ0NRLHNCQUFnQmIsWUFBWXBqQixXQUFaLEVBQXlCMFMsT0FBekIsQ0FBaEI7QUNZRyxhRFhIbFYsUUFBUTZsQixjQUFSLENBQXVCcmpCLFdBQXZCLEVBQW9Da0YsSUFBcEMsQ0FBeUMrZSxhQUF6QyxDQ1dHO0FBQ0Q7QURsQkosSUNTQztBRGpCcUIsQ0FBdkIsQzs7Ozs7Ozs7Ozs7O0FFbENBLElBQUFDLHlCQUFBLEVBQUFDLHNCQUFBLEVBQUFDLFNBQUE7O0FBQUE1bUIsUUFBUXlJLGNBQVIsR0FBeUIsVUFBQ2pHLFdBQUQsRUFBY2dDLE9BQWQsRUFBdUJHLE1BQXZCO0FBQ3hCLE1BQUFwQyxHQUFBOztBQUFBLE1BQUc1QixPQUFPOEMsUUFBVjtBQUNDLFFBQUcsQ0FBQ2pCLFdBQUo7QUFDQ0Esb0JBQWNtQixRQUFRQyxHQUFSLENBQVksYUFBWixDQUFkO0FDSUU7O0FESEhyQixVQUFNdkMsUUFBUW1ELFNBQVIsQ0FBa0JYLFdBQWxCLENBQU47O0FBQ0EsUUFBRyxDQUFDRCxHQUFKO0FBQ0M7QUNLRTs7QURKSCxXQUFPQSxJQUFJZ0YsV0FBSixDQUFnQjNELEdBQWhCLEVBQVA7QUFORCxTQU9LLElBQUdqRCxPQUFPMEIsUUFBVjtBQ01GLFdETEZyQyxRQUFRNm1CLG9CQUFSLENBQTZCcmlCLE9BQTdCLEVBQXNDRyxNQUF0QyxFQUE4Q25DLFdBQTlDLENDS0U7QUFDRDtBRGZzQixDQUF6Qjs7QUFXQXhDLFFBQVE4bUIsb0JBQVIsR0FBK0IsVUFBQ3RrQixXQUFELEVBQWNtSyxNQUFkLEVBQXNCaEksTUFBdEIsRUFBOEJILE9BQTlCO0FBQzlCLE1BQUF1aUIsT0FBQSxFQUFBeGYsV0FBQSxFQUFBeWYsaUJBQUEsRUFBQTNqQixHQUFBLEVBQUE0akIsZ0JBQUE7O0FBQUEsTUFBRyxDQUFDemtCLFdBQUQsSUFBaUI3QixPQUFPOEMsUUFBM0I7QUFDQ2pCLGtCQUFjbUIsUUFBUUMsR0FBUixDQUFZLGFBQVosQ0FBZDtBQ1NDOztBRFBGMkQsZ0JBQWNoRSxFQUFFdU8sS0FBRixDQUFROVIsUUFBUXlJLGNBQVIsQ0FBdUJqRyxXQUF2QixDQUFSLENBQWQ7O0FBRUEsTUFBR21LLE1BQUg7QUFDQ29hLGNBQVVwYSxPQUFPdWEsS0FBUCxLQUFnQnZpQixNQUFoQixNQUFBdEIsTUFBQXNKLE9BQUF1YSxLQUFBLFlBQUE3akIsSUFBd0NnQixHQUF4QyxHQUF3QyxNQUF4QyxNQUErQ00sTUFBekQ7O0FBQ0EsUUFBR2hFLE9BQU84QyxRQUFWO0FBQ0N3akIseUJBQW1CL2YsUUFBUWdELGlCQUFSLEVBQW5CO0FBREQ7QUFHQytjLHlCQUFtQmpuQixRQUFRa0ssaUJBQVIsQ0FBMEJ2RixNQUExQixFQUFrQ0gsT0FBbEMsQ0FBbkI7QUNRRTs7QURQSHdpQix3QkFBQXJhLFVBQUEsT0FBb0JBLE9BQVFuRCxVQUE1QixHQUE0QixNQUE1Qjs7QUFDQSxRQUFHd2QscUJBQXNCempCLEVBQUVrSixRQUFGLENBQVd1YSxpQkFBWCxDQUF0QixJQUF3REEsa0JBQWtCM2lCLEdBQTdFO0FBRUMyaUIsMEJBQW9CQSxrQkFBa0IzaUIsR0FBdEM7QUNRRTs7QURQSCxRQUFHLENBQUNrRCxZQUFZb0IsZ0JBQWIsSUFBa0MsQ0FBQ29lLE9BQW5DLElBQStDLENBQUN4ZixZQUFZb0Qsb0JBQS9EO0FBQ0NwRCxrQkFBWWdELFNBQVosR0FBd0IsS0FBeEI7QUFDQWhELGtCQUFZaUQsV0FBWixHQUEwQixLQUExQjtBQUZELFdBR0ssSUFBR2pELFlBQVlvRCxvQkFBZjtBQUNKLFVBQUdxYyxxQkFBc0J6akIsRUFBRTRCLFFBQUYsQ0FBVzZoQixpQkFBWCxDQUF6QjtBQUNDLFlBQUdDLG9CQUFxQkEsaUJBQWlCcGhCLE1BQXpDO0FBQ0MsY0FBRyxDQUFDdEMsRUFBRW9hLE9BQUYsQ0FBVXNKLGdCQUFWLEVBQTRCRCxpQkFBNUIsQ0FBSjtBQUVDemYsd0JBQVlnRCxTQUFaLEdBQXdCLEtBQXhCO0FBQ0FoRCx3QkFBWWlELFdBQVosR0FBMEIsS0FBMUI7QUFKRjtBQUFBO0FBT0NqRCxzQkFBWWdELFNBQVosR0FBd0IsS0FBeEI7QUFDQWhELHNCQUFZaUQsV0FBWixHQUEwQixLQUExQjtBQVRGO0FBREk7QUNvQkY7O0FEUkgsUUFBR21DLE9BQU93YSxNQUFQLElBQWtCLENBQUM1ZixZQUFZb0IsZ0JBQWxDO0FBQ0NwQixrQkFBWWdELFNBQVosR0FBd0IsS0FBeEI7QUFDQWhELGtCQUFZaUQsV0FBWixHQUEwQixLQUExQjtBQ1VFOztBRFJILFFBQUcsQ0FBQ2pELFlBQVlrRCxjQUFiLElBQWdDLENBQUNzYyxPQUFqQyxJQUE2QyxDQUFDeGYsWUFBWW1ELGtCQUE3RDtBQUNDbkQsa0JBQVkrQyxTQUFaLEdBQXdCLEtBQXhCO0FBREQsV0FFSyxJQUFHL0MsWUFBWW1ELGtCQUFmO0FBQ0osVUFBR3NjLHFCQUFzQnpqQixFQUFFNEIsUUFBRixDQUFXNmhCLGlCQUFYLENBQXpCO0FBQ0MsWUFBR0Msb0JBQXFCQSxpQkFBaUJwaEIsTUFBekM7QUFDQyxjQUFHLENBQUN0QyxFQUFFb2EsT0FBRixDQUFVc0osZ0JBQVYsRUFBNEJELGlCQUE1QixDQUFKO0FBRUN6Zix3QkFBWStDLFNBQVosR0FBd0IsS0FBeEI7QUFIRjtBQUFBO0FBTUMvQyxzQkFBWStDLFNBQVosR0FBd0IsS0FBeEI7QUFQRjtBQURJO0FBL0JOO0FDbURFOztBRFZGLFNBQU8vQyxXQUFQO0FBL0M4QixDQUEvQjs7QUFpREEsSUFBRzVHLE9BQU8wQixRQUFWO0FBRUNyQyxVQUFRb25CLGlCQUFSLEdBQTRCLFVBQUM1aUIsT0FBRCxFQUFVRyxNQUFWO0FBQzNCLFFBQUEwaUIsRUFBQSxFQUFBQyxtQkFBQSxFQUFBNWlCLFlBQUEsRUFBQTZpQixlQUFBLEVBQUFoZ0IsV0FBQSxFQUFBaWdCLEtBQUEsRUFBQUMsVUFBQSxFQUFBQyxjQUFBLEVBQUFDLFlBQUEsRUFBQUMsaUJBQUEsRUFBQUMsZ0JBQUEsRUFBQUMsVUFBQSxFQUFBQyxjQUFBLEVBQUFDLFdBQUEsRUFBQUMsZUFBQSxFQUFBQyxzQkFBQSxFQUFBQywwQkFBQSxFQUFBQyxTQUFBLEVBQUFDLGFBQUEsRUFBQUMsa0JBQUEsRUFBQUMsc0JBQUEsRUFBQWxsQixHQUFBLEVBQUFDLElBQUEsRUFBQWtsQixPQUFBLEVBQUFDLFNBQUE7O0FBQUFsaEIsa0JBQ0M7QUFBQW1oQixlQUFTLEVBQVQ7QUFDQUMscUJBQWU7QUFEZixLQUREO0FBR0FsQixpQkFBYXpuQixRQUFRdUUsYUFBUixDQUFzQixnQkFBdEIsRUFBd0NLLE9BQXhDLENBQWdEO0FBQUMvQixhQUFPMkIsT0FBUjtBQUFpQjdCLFlBQU07QUFBdkIsS0FBaEQsRUFBaUY7QUFBQ21GLGNBQU87QUFBQ3pELGFBQUksQ0FBTDtBQUFRc2tCLHVCQUFjO0FBQXRCO0FBQVIsS0FBakYsS0FBdUgsSUFBcEk7QUFDQVAsZ0JBQVlwb0IsUUFBUXVFLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDSyxPQUF4QyxDQUFnRDtBQUFDL0IsYUFBTzJCLE9BQVI7QUFBaUI3QixZQUFNO0FBQXZCLEtBQWhELEVBQWdGO0FBQUNtRixjQUFPO0FBQUN6RCxhQUFJLENBQUw7QUFBUXNrQix1QkFBYztBQUF0QjtBQUFSLEtBQWhGLEtBQXNILElBQWxJO0FBQ0FYLGtCQUFjaG9CLFFBQVF1RSxhQUFSLENBQXNCLGdCQUF0QixFQUF3Q0ssT0FBeEMsQ0FBZ0Q7QUFBQy9CLGFBQU8yQixPQUFSO0FBQWlCN0IsWUFBTTtBQUF2QixLQUFoRCxFQUFrRjtBQUFDbUYsY0FBTztBQUFDekQsYUFBSSxDQUFMO0FBQVFza0IsdUJBQWM7QUFBdEI7QUFBUixLQUFsRixLQUF3SCxJQUF0STtBQUNBYixpQkFBYTluQixRQUFRdUUsYUFBUixDQUFzQixnQkFBdEIsRUFBd0NLLE9BQXhDLENBQWdEO0FBQUMvQixhQUFPMkIsT0FBUjtBQUFpQjdCLFlBQU07QUFBdkIsS0FBaEQsRUFBaUY7QUFBQ21GLGNBQU87QUFBQ3pELGFBQUksQ0FBTDtBQUFRc2tCLHVCQUFjO0FBQXRCO0FBQVIsS0FBakYsS0FBdUgsSUFBcEk7QUFDQUwseUJBQXFCdG9CLFFBQVF1RSxhQUFSLENBQXNCLGdCQUF0QixFQUF3Q0ssT0FBeEMsQ0FBZ0Q7QUFBQy9CLGFBQU8yQixPQUFSO0FBQWlCN0IsWUFBTTtBQUF2QixLQUFoRCxFQUEwRjtBQUFDbUYsY0FBTztBQUFDekQsYUFBSSxDQUFMO0FBQVFza0IsdUJBQWMsQ0FBdEI7QUFBeUJDLGVBQU07QUFBL0I7QUFBUixLQUExRixLQUF5SSxJQUE5SjtBQUNBViw2QkFBeUJsb0IsUUFBUXVFLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDSyxPQUF4QyxDQUFnRDtBQUFDL0IsYUFBTzJCLE9BQVI7QUFBaUI3QixZQUFNO0FBQXZCLEtBQWhELEVBQThGO0FBQUNtRixjQUFPO0FBQUN6RCxhQUFJLENBQUw7QUFBUXNrQix1QkFBYyxDQUF0QjtBQUF5QkMsZUFBTTtBQUEvQjtBQUFSLEtBQTlGLEtBQTZJLElBQXRLO0FBQ0FqQixtQkFBZTNuQixRQUFRdUUsYUFBUixDQUFzQixnQkFBdEIsRUFBd0NSLElBQXhDLENBQTZDO0FBQUM2a0IsYUFBT2prQixNQUFSO0FBQWdCOUIsYUFBTzJCO0FBQXZCLEtBQTdDLEVBQThFO0FBQUNzRCxjQUFPO0FBQUN6RCxhQUFJLENBQUw7QUFBUXNrQix1QkFBYyxDQUF0QjtBQUF5QmhtQixjQUFLO0FBQTlCO0FBQVIsS0FBOUUsRUFBeUgrSixLQUF6SCxFQUFmO0FBRUFnYixxQkFBaUIsSUFBakI7QUFDQVcsb0JBQWdCLElBQWhCO0FBQ0FKLHNCQUFrQixJQUFsQjtBQUNBRixxQkFBaUIsSUFBakI7QUFDQVEsNkJBQXlCLElBQXpCO0FBQ0FKLGlDQUE2QixJQUE3QjtBQUNBTix1QkFBbUIsSUFBbkI7O0FBRUEsUUFBQUosY0FBQSxPQUFHQSxXQUFZcGpCLEdBQWYsR0FBZSxNQUFmO0FBQ0NxakIsdUJBQWlCMW5CLFFBQVF1RSxhQUFSLENBQXNCLG9CQUF0QixFQUE0Q1IsSUFBNUMsQ0FBaUQ7QUFBQzhrQiwyQkFBbUJwQixXQUFXcGpCO0FBQS9CLE9BQWpELEVBQXNGO0FBQUN5RCxnQkFBUTtBQUFDZ2hCLG1CQUFTLENBQVY7QUFBYUMsb0JBQVUsQ0FBdkI7QUFBMEJDLHNCQUFZLENBQXRDO0FBQXlDQyx1QkFBYTtBQUF0RDtBQUFULE9BQXRGLEVBQTBKdmMsS0FBMUosRUFBakI7QUNnRkU7O0FEL0VILFFBQUEwYixhQUFBLE9BQUdBLFVBQVcvakIsR0FBZCxHQUFjLE1BQWQ7QUFDQ2drQixzQkFBZ0Jyb0IsUUFBUXVFLGFBQVIsQ0FBc0Isb0JBQXRCLEVBQTRDUixJQUE1QyxDQUFpRDtBQUFDOGtCLDJCQUFtQlQsVUFBVS9qQjtBQUE5QixPQUFqRCxFQUFxRjtBQUFDeUQsZ0JBQVE7QUFBQ2doQixtQkFBUyxDQUFWO0FBQWFDLG9CQUFVLENBQXZCO0FBQTBCQyxzQkFBWSxDQUF0QztBQUF5Q0MsdUJBQWE7QUFBdEQ7QUFBVCxPQUFyRixFQUF5SnZjLEtBQXpKLEVBQWhCO0FDMEZFOztBRHpGSCxRQUFBc2IsZUFBQSxPQUFHQSxZQUFhM2pCLEdBQWhCLEdBQWdCLE1BQWhCO0FBQ0M0akIsd0JBQWtCam9CLFFBQVF1RSxhQUFSLENBQXNCLG9CQUF0QixFQUE0Q1IsSUFBNUMsQ0FBaUQ7QUFBQzhrQiwyQkFBbUJiLFlBQVkzakI7QUFBaEMsT0FBakQsRUFBdUY7QUFBQ3lELGdCQUFRO0FBQUNnaEIsbUJBQVMsQ0FBVjtBQUFhQyxvQkFBVSxDQUF2QjtBQUEwQkMsc0JBQVksQ0FBdEM7QUFBeUNDLHVCQUFhO0FBQXREO0FBQVQsT0FBdkYsRUFBMkp2YyxLQUEzSixFQUFsQjtBQ29HRTs7QURuR0gsUUFBQW9iLGNBQUEsT0FBR0EsV0FBWXpqQixHQUFmLEdBQWUsTUFBZjtBQUNDMGpCLHVCQUFpQi9uQixRQUFRdUUsYUFBUixDQUFzQixvQkFBdEIsRUFBNENSLElBQTVDLENBQWlEO0FBQUM4a0IsMkJBQW1CZixXQUFXempCO0FBQS9CLE9BQWpELEVBQXNGO0FBQUN5RCxnQkFBUTtBQUFDZ2hCLG1CQUFTLENBQVY7QUFBYUMsb0JBQVUsQ0FBdkI7QUFBMEJDLHNCQUFZLENBQXRDO0FBQXlDQyx1QkFBYTtBQUF0RDtBQUFULE9BQXRGLEVBQTBKdmMsS0FBMUosRUFBakI7QUM4R0U7O0FEN0dILFFBQUE0YixzQkFBQSxPQUFHQSxtQkFBb0Jqa0IsR0FBdkIsR0FBdUIsTUFBdkI7QUFDQ2trQiwrQkFBeUJ2b0IsUUFBUXVFLGFBQVIsQ0FBc0Isb0JBQXRCLEVBQTRDUixJQUE1QyxDQUFpRDtBQUFDOGtCLDJCQUFtQlAsbUJBQW1CamtCO0FBQXZDLE9BQWpELEVBQThGO0FBQUN5RCxnQkFBUTtBQUFDZ2hCLG1CQUFTLENBQVY7QUFBYUMsb0JBQVUsQ0FBdkI7QUFBMEJDLHNCQUFZLENBQXRDO0FBQXlDQyx1QkFBYTtBQUF0RDtBQUFULE9BQTlGLEVBQWtLdmMsS0FBbEssRUFBekI7QUN3SEU7O0FEdkhILFFBQUF3YiwwQkFBQSxPQUFHQSx1QkFBd0I3akIsR0FBM0IsR0FBMkIsTUFBM0I7QUFDQzhqQixtQ0FBNkJub0IsUUFBUXVFLGFBQVIsQ0FBc0Isb0JBQXRCLEVBQTRDUixJQUE1QyxDQUFpRDtBQUFDOGtCLDJCQUFtQlgsdUJBQXVCN2pCO0FBQTNDLE9BQWpELEVBQWtHO0FBQUN5RCxnQkFBUTtBQUFDZ2hCLG1CQUFTLENBQVY7QUFBYUMsb0JBQVUsQ0FBdkI7QUFBMEJDLHNCQUFZLENBQXRDO0FBQXlDQyx1QkFBYTtBQUF0RDtBQUFULE9BQWxHLEVBQXNLdmMsS0FBdEssRUFBN0I7QUNrSUU7O0FEaklILFFBQUdpYixhQUFhOWhCLE1BQWIsR0FBc0IsQ0FBekI7QUFDQzJpQixnQkFBVWpsQixFQUFFMmxCLEtBQUYsQ0FBUXZCLFlBQVIsRUFBc0IsS0FBdEIsQ0FBVjtBQUNBRSx5QkFBbUI3bkIsUUFBUXVFLGFBQVIsQ0FBc0Isb0JBQXRCLEVBQTRDUixJQUE1QyxDQUFpRDtBQUFDOGtCLDJCQUFtQjtBQUFDemMsZUFBS29jO0FBQU47QUFBcEIsT0FBakQsRUFBc0Y5YixLQUF0RixFQUFuQjtBQUNBa2IsMEJBQW9CcmtCLEVBQUUybEIsS0FBRixDQUFRdkIsWUFBUixFQUFzQixNQUF0QixDQUFwQjtBQ3VJRTs7QUR0SUhqakIsbUJBQWUsS0FBZjtBQUNBK2pCLGdCQUFZLElBQVo7O0FBQ0EsUUFBRzlqQixNQUFIO0FBQ0NELHFCQUFlMUUsUUFBUTBFLFlBQVIsQ0FBcUJGLE9BQXJCLEVBQThCRyxNQUE5QixDQUFmO0FBQ0E0aUIsd0JBQUFlLHNCQUFBLFFBQUFqbEIsTUFBQWlsQixtQkFBQU0sS0FBQSxZQUFBdmxCLElBQTZDdUwsUUFBN0MsQ0FBc0RqSyxNQUF0RCxJQUFrQixNQUFsQixHQUFrQixNQUFsQjtBQUNBMmlCLDRCQUFBWSwwQkFBQSxRQUFBNWtCLE9BQUE0a0IsdUJBQUFVLEtBQUEsWUFBQXRsQixLQUFxRHNMLFFBQXJELENBQThEakssTUFBOUQsSUFBc0IsTUFBdEIsR0FBc0IsTUFBdEI7QUFDQThqQixrQkFBWXpvQixRQUFRdUUsYUFBUixDQUFzQixhQUF0QixFQUFxQ0ssT0FBckMsQ0FBNkM7QUFBRS9CLGVBQU8yQixPQUFUO0FBQWtCa0YsY0FBTS9FO0FBQXhCLE9BQTdDLEVBQStFO0FBQUVtRCxnQkFBUTtBQUFFcWhCLG1CQUFTO0FBQVg7QUFBVixPQUEvRSxDQUFaO0FDK0lFOztBRDdJSDNCLFlBQVE7QUFDUEMsNEJBRE87QUFFUFcsMEJBRk87QUFHUFQsZ0NBSE87QUFJUEssOEJBSk87QUFLUEYsNEJBTE87QUFNUFEsNENBTk87QUFPUEosb0RBUE87QUFRUHhqQixnQ0FSTztBQVNQNmlCLHNDQVRPO0FBVVBELDhDQVZPO0FBV1BtQiwwQkFYTztBQVlQZixvQ0FaTztBQWFQVyxrQ0FiTztBQWNQSixzQ0FkTztBQWVQRixvQ0FmTztBQWdCUFEsb0RBaEJPO0FBaUJQSiw0REFqQk87QUFrQlBOO0FBbEJPLEtBQVI7QUFvQkF0Z0IsZ0JBQVlvaEIsYUFBWixHQUE0QjNvQixRQUFRb3BCLGVBQVIsQ0FBd0JDLElBQXhCLENBQTZCN0IsS0FBN0IsRUFBb0NoakIsT0FBcEMsRUFBNkNHLE1BQTdDLENBQTVCO0FBQ0E0QyxnQkFBWStoQixjQUFaLEdBQTZCdHBCLFFBQVF1cEIsZ0JBQVIsQ0FBeUJGLElBQXpCLENBQThCN0IsS0FBOUIsRUFBcUNoakIsT0FBckMsRUFBOENHLE1BQTlDLENBQTdCO0FBQ0E0QyxnQkFBWWlpQixvQkFBWixHQUFtQzVCLGlCQUFuQztBQUNBUCxTQUFLLENBQUw7O0FBQ0E5akIsTUFBRWtDLElBQUYsQ0FBT3pGLFFBQVE4RCxhQUFmLEVBQThCLFVBQUNyQyxNQUFELEVBQVNlLFdBQVQ7QUFDN0I2a0I7O0FBQ0EsVUFBRyxDQUFDOWpCLEVBQUV3TyxHQUFGLENBQU10USxNQUFOLEVBQWMsT0FBZCxDQUFELElBQTJCLENBQUNBLE9BQU9vQixLQUFuQyxJQUE0Q3BCLE9BQU9vQixLQUFQLEtBQWdCMkIsT0FBL0Q7QUFDQytDLG9CQUFZbWhCLE9BQVosQ0FBb0JsbUIsV0FBcEIsSUFBbUNlLEVBQUV1TyxLQUFGLENBQVE5UixRQUFROEMsYUFBUixDQUFzQjlDLFFBQVFDLE9BQVIsQ0FBZ0J1QyxXQUFoQixDQUF0QixDQUFSLENBQW5DO0FDK0lJLGVEOUlKK0UsWUFBWW1oQixPQUFaLENBQW9CbG1CLFdBQXBCLEVBQWlDLGFBQWpDLElBQWtEeEMsUUFBUTZtQixvQkFBUixDQUE2QndDLElBQTdCLENBQWtDN0IsS0FBbEMsRUFBeUNoakIsT0FBekMsRUFBa0RHLE1BQWxELEVBQTBEbkMsV0FBMUQsQ0M4STlDO0FBQ0Q7QURuSkw7O0FBS0EsV0FBTytFLFdBQVA7QUF6RTJCLEdBQTVCOztBQTJFQXFmLGNBQVksVUFBQzZDLEtBQUQsRUFBUUMsS0FBUjtBQUNYLFFBQUcsQ0FBQ0QsS0FBRCxJQUFXLENBQUNDLEtBQWY7QUFDQyxhQUFPLE1BQVA7QUNpSkU7O0FEaEpILFFBQUcsQ0FBQ0QsS0FBSjtBQUNDQSxjQUFRLEVBQVI7QUNrSkU7O0FEakpILFFBQUcsQ0FBQ0MsS0FBSjtBQUNDQSxjQUFRLEVBQVI7QUNtSkU7O0FEbEpILFdBQU9ubUIsRUFBRStOLEtBQUYsQ0FBUW1ZLEtBQVIsRUFBZUMsS0FBZixDQUFQO0FBUFcsR0FBWjs7QUFTQTFwQixVQUFRb3BCLGVBQVIsR0FBMEIsVUFBQzVrQixPQUFELEVBQVVHLE1BQVY7QUFDekIsUUFBQWdsQixJQUFBLEVBQUFqbEIsWUFBQSxFQUFBa2xCLFFBQUEsRUFBQXBDLEtBQUEsRUFBQUMsVUFBQSxFQUFBVyxTQUFBLEVBQUEva0IsR0FBQTtBQUFBb2tCLGlCQUFhLEtBQUtBLFVBQUwsSUFBbUJ6bkIsUUFBUXVFLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDSyxPQUF4QyxDQUFnRDtBQUFDL0IsYUFBTzJCLE9BQVI7QUFBaUI3QixZQUFNO0FBQXZCLEtBQWhELEVBQWlGO0FBQUNtRixjQUFPO0FBQUN6RCxhQUFJLENBQUw7QUFBUXNrQix1QkFBYztBQUF0QjtBQUFSLEtBQWpGLENBQWhDO0FBQ0FQLGdCQUFZLEtBQUtBLFNBQUwsSUFBa0Jwb0IsUUFBUXVFLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDSyxPQUF4QyxDQUFnRDtBQUFDL0IsYUFBTzJCLE9BQVI7QUFBaUI3QixZQUFNO0FBQXZCLEtBQWhELEVBQWdGO0FBQUNtRixjQUFPO0FBQUN6RCxhQUFJLENBQUw7QUFBUXNrQix1QkFBYztBQUF0QjtBQUFSLEtBQWhGLENBQTlCO0FBR0FuQixZQUFTLEtBQUtHLFlBQUwsSUFBcUIzbkIsUUFBUXVFLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDUixJQUF4QyxDQUE2QztBQUFDNmtCLGFBQU9qa0IsTUFBUjtBQUFnQjlCLGFBQU8yQjtBQUF2QixLQUE3QyxFQUE4RTtBQUFDc0QsY0FBTztBQUFDekQsYUFBSSxDQUFMO0FBQVFza0IsdUJBQWM7QUFBdEI7QUFBUixLQUE5RSxFQUFpSGpjLEtBQWpILEVBQTlCO0FBQ0FoSSxtQkFBa0JuQixFQUFFdVUsU0FBRixDQUFZLEtBQUtwVCxZQUFqQixJQUFvQyxLQUFLQSxZQUF6QyxHQUEyRDFFLFFBQVEwRSxZQUFSLENBQXFCRixPQUFyQixFQUE4QkcsTUFBOUIsQ0FBN0U7QUFDQWdsQixXQUFPLEVBQVA7O0FBQ0EsUUFBR2psQixZQUFIO0FBQ0MsYUFBTyxFQUFQO0FBREQ7QUFHQ2tsQixpQkFBV3hCLFNBQVg7O0FBQ0EsVUFBQXdCLFlBQUEsUUFBQXZtQixNQUFBdW1CLFNBQUFqQixhQUFBLFlBQUF0bEIsSUFBNEJ3QyxNQUE1QixHQUE0QixNQUE1QixHQUE0QixNQUE1QjtBQUNDOGpCLGVBQU9wbUIsRUFBRStOLEtBQUYsQ0FBUXFZLElBQVIsRUFBY0MsU0FBU2pCLGFBQXZCLENBQVA7QUFERDtBQUlDLGVBQU8sRUFBUDtBQzBLRzs7QUR6S0pwbEIsUUFBRWtDLElBQUYsQ0FBTytoQixLQUFQLEVBQWMsVUFBQ3FDLElBQUQ7QUFDYixZQUFHLENBQUNBLEtBQUtsQixhQUFUO0FBQ0M7QUMyS0k7O0FEMUtMLFlBQUdrQixLQUFLbG5CLElBQUwsS0FBYSxPQUFiLElBQXlCa25CLEtBQUtsbkIsSUFBTCxLQUFhLE1BQXpDO0FBRUM7QUMyS0k7O0FBQ0QsZUQzS0pnbkIsT0FBT3BtQixFQUFFK04sS0FBRixDQUFRcVksSUFBUixFQUFjRSxLQUFLbEIsYUFBbkIsQ0MyS0g7QURqTEw7O0FBT0EsYUFBT3BsQixFQUFFb1AsT0FBRixDQUFVcFAsRUFBRXVtQixJQUFGLENBQU9ILElBQVAsQ0FBVixFQUF1QixNQUF2QixFQUFpQyxJQUFqQyxDQUFQO0FDNktFO0FEck1zQixHQUExQjs7QUEwQkEzcEIsVUFBUXVwQixnQkFBUixHQUEyQixVQUFDL2tCLE9BQUQsRUFBVUcsTUFBVjtBQUMxQixRQUFBb2xCLFNBQUEsRUFBQUMsVUFBQSxFQUFBQyxRQUFBLEVBQUFDLGdCQUFBLEVBQUF4bEIsWUFBQSxFQUFBeWxCLEtBQUEsRUFBQUMsYUFBQSxFQUFBQyxVQUFBLEVBQUE3QyxLQUFBLEVBQUFua0IsR0FBQTtBQUFBbWtCLFlBQVMsS0FBS0csWUFBTCxJQUFxQjNuQixRQUFRdUUsYUFBUixDQUFzQixnQkFBdEIsRUFBd0NSLElBQXhDLENBQTZDO0FBQUM2a0IsYUFBT2prQixNQUFSO0FBQWdCOUIsYUFBTzJCO0FBQXZCLEtBQTdDLEVBQThFO0FBQUNzRCxjQUFPO0FBQUN6RCxhQUFJLENBQUw7QUFBUTFCLGNBQUs7QUFBYjtBQUFSLEtBQTlFLEVBQXdHK0osS0FBeEcsRUFBOUI7QUFDQWhJLG1CQUFrQm5CLEVBQUV1VSxTQUFGLENBQVksS0FBS3BULFlBQWpCLElBQW9DLEtBQUtBLFlBQXpDLEdBQTJEMUUsUUFBUTBFLFlBQVIsQ0FBcUJGLE9BQXJCLEVBQThCRyxNQUE5QixDQUE3RTtBQUNBcWxCLGlCQUFBLENBQUEzbUIsTUFBQXJELFFBQUFJLElBQUEsQ0FBQTRaLEtBQUEsWUFBQTNXLElBQWlDaW5CLFdBQWpDLEdBQWlDLE1BQWpDOztBQUVBLFNBQU9OLFVBQVA7QUFDQyxhQUFPLEVBQVA7QUNzTEU7O0FEckxIRCxnQkFBWUMsV0FBV2ptQixJQUFYLENBQWdCLFVBQUN3bUIsQ0FBRDtBQ3VMeEIsYUR0TEhBLEVBQUVsbUIsR0FBRixLQUFTLE9Dc0xOO0FEdkxRLE1BQVo7QUFFQTJsQixpQkFBYUEsV0FBV3RrQixNQUFYLENBQWtCLFVBQUM2a0IsQ0FBRDtBQ3dMM0IsYUR2TEhBLEVBQUVsbUIsR0FBRixLQUFTLE9DdUxOO0FEeExTLE1BQWI7QUFFQStsQixvQkFBZ0I3bUIsRUFBRStDLE1BQUYsQ0FBUy9DLEVBQUVtQyxNQUFGLENBQVNuQyxFQUFFNkMsTUFBRixDQUFTcEcsUUFBUUksSUFBakIsQ0FBVCxFQUFpQyxVQUFDbXFCLENBQUQ7QUFDekQsYUFBT0EsRUFBRUQsV0FBRixJQUFrQkMsRUFBRWxtQixHQUFGLEtBQVMsT0FBbEM7QUFEd0IsTUFBVCxFQUViLE1BRmEsQ0FBaEI7QUFHQWdtQixpQkFBYTltQixFQUFFaW5CLE9BQUYsQ0FBVWpuQixFQUFFMmxCLEtBQUYsQ0FBUWtCLGFBQVIsRUFBdUIsYUFBdkIsQ0FBVixDQUFiO0FBRUFILGVBQVcxbUIsRUFBRStOLEtBQUYsQ0FBUTBZLFVBQVIsRUFBb0JLLFVBQXBCLEVBQWdDLENBQUNOLFNBQUQsQ0FBaEMsQ0FBWDs7QUFDQSxRQUFHcmxCLFlBQUg7QUFFQyxhQUFPdWxCLFFBQVA7QUFGRDtBQUlDQyx5QkFBbUIxQyxNQUFNNVcsR0FBTixDQUFVLFVBQUMyWixDQUFEO0FBQzVCLGVBQU9BLEVBQUU1bkIsSUFBVDtBQURrQixRQUFuQjtBQUVBd25CLGNBQVFGLFNBQVN2a0IsTUFBVCxDQUFnQixVQUFDK2tCLElBQUQ7QUFDdkIsWUFBQUMsU0FBQTtBQUFBQSxvQkFBWUQsS0FBS0UsZUFBakI7O0FBRUEsWUFBR0QsYUFBYUEsVUFBVTVsQixPQUFWLENBQWtCLE1BQWxCLElBQTRCLENBQUMsQ0FBN0M7QUFDQyxpQkFBTyxJQUFQO0FDd0xJOztBRHRMTCxlQUFPdkIsRUFBRXFuQixZQUFGLENBQWVWLGdCQUFmLEVBQWlDUSxTQUFqQyxFQUE0QzdrQixNQUFuRDtBQU5PLFFBQVI7QUFPQSxhQUFPc2tCLEtBQVA7QUN5TEU7QUR2TnVCLEdBQTNCOztBQWdDQXpELDhCQUE0QixVQUFDbUUsa0JBQUQsRUFBcUJyb0IsV0FBckIsRUFBa0NxbUIsaUJBQWxDO0FBRTNCLFFBQUd0bEIsRUFBRXVuQixNQUFGLENBQVNELGtCQUFULENBQUg7QUFDQyxhQUFPLElBQVA7QUN5TEU7O0FEeExILFFBQUd0bkIsRUFBRUMsT0FBRixDQUFVcW5CLGtCQUFWLENBQUg7QUFDQyxhQUFPdG5CLEVBQUVRLElBQUYsQ0FBTzhtQixrQkFBUCxFQUEyQixVQUFDemdCLEVBQUQ7QUFDaEMsZUFBT0EsR0FBRzVILFdBQUgsS0FBa0JBLFdBQXpCO0FBREssUUFBUDtBQzRMRTs7QUQxTEgsV0FBT3hDLFFBQVF1RSxhQUFSLENBQXNCLG9CQUF0QixFQUE0Q0ssT0FBNUMsQ0FBb0Q7QUFBQ3BDLG1CQUFhQSxXQUFkO0FBQTJCcW1CLHlCQUFtQkE7QUFBOUMsS0FBcEQsQ0FBUDtBQVAyQixHQUE1Qjs7QUFTQWxDLDJCQUF5QixVQUFDa0Usa0JBQUQsRUFBcUJyb0IsV0FBckIsRUFBa0N1b0Isa0JBQWxDO0FBQ3hCLFFBQUd4bkIsRUFBRXVuQixNQUFGLENBQVNELGtCQUFULENBQUg7QUFDQyxhQUFPLElBQVA7QUMrTEU7O0FEOUxILFFBQUd0bkIsRUFBRUMsT0FBRixDQUFVcW5CLGtCQUFWLENBQUg7QUFDQyxhQUFPdG5CLEVBQUVtQyxNQUFGLENBQVNtbEIsa0JBQVQsRUFBNkIsVUFBQ3pnQixFQUFEO0FBQ25DLGVBQU9BLEdBQUc1SCxXQUFILEtBQWtCQSxXQUF6QjtBQURNLFFBQVA7QUNrTUU7O0FBQ0QsV0RqTUZ4QyxRQUFRdUUsYUFBUixDQUFzQixvQkFBdEIsRUFBNENSLElBQTVDLENBQWlEO0FBQUN2QixtQkFBYUEsV0FBZDtBQUEyQnFtQix5QkFBbUI7QUFBQ3pjLGFBQUsyZTtBQUFOO0FBQTlDLEtBQWpELEVBQTJIcmUsS0FBM0gsRUNpTUU7QUR2TXNCLEdBQXpCOztBQVFBMU0sVUFBUTZtQixvQkFBUixHQUErQixVQUFDcmlCLE9BQUQsRUFBVUcsTUFBVixFQUFrQm5DLFdBQWxCO0FBQzlCLFFBQUE4a0IsbUJBQUEsRUFBQTVpQixZQUFBLEVBQUE2aUIsZUFBQSxFQUFBOWxCLE1BQUEsRUFBQXVwQixVQUFBLEVBQUFDLFVBQUEsRUFBQUMsV0FBQSxFQUFBQyxzQkFBQSxFQUFBQyxTQUFBLEVBQUFDLGtCQUFBLEVBQUE5akIsV0FBQSxFQUFBK2pCLEdBQUEsRUFBQUMsUUFBQSxFQUFBQyxRQUFBLEVBQUFDLFNBQUEsRUFBQUMsb0JBQUEsRUFBQUMsT0FBQSxFQUFBQyxnQkFBQSxFQUFBQyxJQUFBLEVBQUFyRSxLQUFBLEVBQUFDLFVBQUEsRUFBQUMsY0FBQSxFQUFBRyxnQkFBQSxFQUFBQyxVQUFBLEVBQUFDLGNBQUEsRUFBQUMsV0FBQSxFQUFBQyxlQUFBLEVBQUFDLHNCQUFBLEVBQUFDLDBCQUFBLEVBQUFDLFNBQUEsRUFBQUMsYUFBQSxFQUFBQyxrQkFBQSxFQUFBQyxzQkFBQSxFQUFBbGxCLEdBQUEsRUFBQUMsSUFBQSxFQUFBa2xCLE9BQUEsRUFBQUMsU0FBQTtBQUFBbGhCLGtCQUFjLEVBQWQ7QUFDQTlGLGFBQVN6QixRQUFRbUQsU0FBUixDQUFrQlgsV0FBbEIsRUFBK0JnQyxPQUEvQixDQUFUOztBQUVBLFFBQUdBLFlBQVcsT0FBWCxJQUFzQmhDLGdCQUFlLE9BQXhDO0FBQ0MrRSxvQkFBY2hFLEVBQUV1TyxLQUFGLENBQVFyUSxPQUFPc1ksY0FBUCxDQUFzQitSLEtBQTlCLEtBQXdDLEVBQXREO0FBQ0E5ckIsY0FBUW1LLGtCQUFSLENBQTJCNUMsV0FBM0I7QUFDQSxhQUFPQSxXQUFQO0FDdU1FOztBRHRNSGtnQixpQkFBZ0Jsa0IsRUFBRXVuQixNQUFGLENBQVMsS0FBS3JELFVBQWQsS0FBNkIsS0FBS0EsVUFBbEMsR0FBa0QsS0FBS0EsVUFBdkQsR0FBdUV6bkIsUUFBUXVFLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDSyxPQUF4QyxDQUFnRDtBQUFDL0IsYUFBTzJCLE9BQVI7QUFBaUI3QixZQUFNO0FBQXZCLEtBQWhELEVBQWlGO0FBQUNtRixjQUFPO0FBQUN6RCxhQUFJO0FBQUw7QUFBUixLQUFqRixDQUF2RjtBQUNBK2pCLGdCQUFlN2tCLEVBQUV1bkIsTUFBRixDQUFTLEtBQUsxQyxTQUFkLEtBQTRCLEtBQUtBLFNBQWpDLEdBQWdELEtBQUtBLFNBQXJELEdBQW9FcG9CLFFBQVF1RSxhQUFSLENBQXNCLGdCQUF0QixFQUF3Q0ssT0FBeEMsQ0FBZ0Q7QUFBQy9CLGFBQU8yQixPQUFSO0FBQWlCN0IsWUFBTTtBQUF2QixLQUFoRCxFQUFnRjtBQUFDbUYsY0FBTztBQUFDekQsYUFBSTtBQUFMO0FBQVIsS0FBaEYsQ0FBbkY7QUFDQTJqQixrQkFBaUJ6a0IsRUFBRXVuQixNQUFGLENBQVMsS0FBSzlDLFdBQWQsS0FBOEIsS0FBS0EsV0FBbkMsR0FBb0QsS0FBS0EsV0FBekQsR0FBMEVob0IsUUFBUXVFLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDSyxPQUF4QyxDQUFnRDtBQUFDL0IsYUFBTzJCLE9BQVI7QUFBaUI3QixZQUFNO0FBQXZCLEtBQWhELEVBQWtGO0FBQUNtRixjQUFPO0FBQUN6RCxhQUFJO0FBQUw7QUFBUixLQUFsRixDQUEzRjtBQUNBeWpCLGlCQUFnQnZrQixFQUFFdW5CLE1BQUYsQ0FBUyxLQUFLaEQsVUFBZCxLQUE2QixLQUFLQSxVQUFsQyxHQUFrRCxLQUFLQSxVQUF2RCxHQUF1RTluQixRQUFRdUUsYUFBUixDQUFzQixnQkFBdEIsRUFBd0NLLE9BQXhDLENBQWdEO0FBQUMvQixhQUFPMkIsT0FBUjtBQUFpQjdCLFlBQU07QUFBdkIsS0FBaEQsRUFBaUY7QUFBQ21GLGNBQU87QUFBQ3pELGFBQUk7QUFBTDtBQUFSLEtBQWpGLENBQXZGO0FBQ0Fpa0IseUJBQXdCL2tCLEVBQUV1bkIsTUFBRixDQUFTLEtBQUt4QyxrQkFBZCxLQUFxQyxLQUFLQSxrQkFBMUMsR0FBa0UsS0FBS0Esa0JBQXZFLEdBQStGdG9CLFFBQVF1RSxhQUFSLENBQXNCLGdCQUF0QixFQUF3Q0ssT0FBeEMsQ0FBZ0Q7QUFBQy9CLGFBQU8yQixPQUFSO0FBQWlCN0IsWUFBTTtBQUF2QixLQUFoRCxFQUEwRjtBQUFDbUYsY0FBTztBQUFDekQsYUFBSSxDQUFMO0FBQVF1a0IsZUFBTTtBQUFkO0FBQVIsS0FBMUYsQ0FBdkg7QUFDQVYsNkJBQTRCM2tCLEVBQUV1bkIsTUFBRixDQUFTLEtBQUs1QyxzQkFBZCxLQUF5QyxLQUFLQSxzQkFBOUMsR0FBMEUsS0FBS0Esc0JBQS9FLEdBQTJHbG9CLFFBQVF1RSxhQUFSLENBQXNCLGdCQUF0QixFQUF3Q0ssT0FBeEMsQ0FBZ0Q7QUFBQy9CLGFBQU8yQixPQUFSO0FBQWlCN0IsWUFBTTtBQUF2QixLQUFoRCxFQUE4RjtBQUFDbUYsY0FBTztBQUFDekQsYUFBSSxDQUFMO0FBQVF1a0IsZUFBTTtBQUFkO0FBQVIsS0FBOUYsQ0FBdkk7QUFDQXBCLFlBQVMsS0FBS0csWUFBTCxJQUFxQjNuQixRQUFRdUUsYUFBUixDQUFzQixnQkFBdEIsRUFBd0NSLElBQXhDLENBQTZDO0FBQUM2a0IsYUFBT2prQixNQUFSO0FBQWdCOUIsYUFBTzJCO0FBQXZCLEtBQTdDLEVBQThFO0FBQUNzRCxjQUFPO0FBQUN6RCxhQUFJO0FBQUw7QUFBUixLQUE5RSxFQUFnR3FJLEtBQWhHLEVBQTlCO0FBQ0FoSSxtQkFBa0JuQixFQUFFdVUsU0FBRixDQUFZLEtBQUtwVCxZQUFqQixJQUFvQyxLQUFLQSxZQUF6QyxHQUEyRDFFLFFBQVEwRSxZQUFSLENBQXFCRixPQUFyQixFQUE4QkcsTUFBOUIsQ0FBN0U7QUFDQTRpQixzQkFBcUJoa0IsRUFBRXVVLFNBQUYsQ0FBWSxLQUFLeVAsZUFBakIsSUFBdUMsS0FBS0EsZUFBNUMsR0FBSGUsc0JBQUEsUUFBQWpsQixNQUFBaWxCLG1CQUFBTSxLQUFBLFlBQUF2bEIsSUFBK0Z1TCxRQUEvRixDQUF3R2pLLE1BQXhHLElBQW9FLE1BQXBFLEdBQW9FLE1BQXRGO0FBQ0EyaUIsMEJBQXlCL2pCLEVBQUV1VSxTQUFGLENBQVksS0FBS3dQLG1CQUFqQixJQUEyQyxLQUFLQSxtQkFBaEQsR0FBSFksMEJBQUEsUUFBQTVrQixPQUFBNGtCLHVCQUFBVSxLQUFBLFlBQUF0bEIsS0FBMkdzTCxRQUEzRyxDQUFvSGpLLE1BQXBILElBQTRFLE1BQTVFLEdBQTRFLE1BQWxHO0FBRUEraUIscUJBQWlCLEtBQUtBLGNBQXRCO0FBQ0FXLG9CQUFnQixLQUFLQSxhQUFyQjtBQUNBSixzQkFBa0IsS0FBS0EsZUFBdkI7QUFDQUYscUJBQWlCLEtBQUtBLGNBQXRCO0FBQ0FRLDZCQUF5QixLQUFLQSxzQkFBOUI7QUFDQUosaUNBQTZCLEtBQUtBLDBCQUFsQztBQUNBTix1QkFBbUIsS0FBS0EsZ0JBQXhCO0FBRUFtRCxpQkFBYXpuQixFQUFFdU8sS0FBRixDQUFRclEsT0FBT3NZLGNBQVAsQ0FBc0JDLEtBQTlCLEtBQXdDLEVBQXJEO0FBQ0FvUixnQkFBWTduQixFQUFFdU8sS0FBRixDQUFRclEsT0FBT3NZLGNBQVAsQ0FBc0JyUSxJQUE5QixLQUF1QyxFQUFuRDtBQUNBd2hCLGtCQUFjM25CLEVBQUV1TyxLQUFGLENBQVFyUSxPQUFPc1ksY0FBUCxDQUFzQmdTLE1BQTlCLEtBQXlDLEVBQXZEO0FBQ0FkLGlCQUFhMW5CLEVBQUV1TyxLQUFGLENBQVFyUSxPQUFPc1ksY0FBUCxDQUFzQitSLEtBQTlCLEtBQXdDLEVBQXJEO0FBQ0FULHlCQUFxQjluQixFQUFFdU8sS0FBRixDQUFRclEsT0FBT3NZLGNBQVAsQ0FBc0JpUyxjQUE5QixLQUFpRCxFQUF0RTtBQUNBYiw2QkFBeUI1bkIsRUFBRXVPLEtBQUYsQ0FBUXJRLE9BQU9zWSxjQUFQLENBQXNCa1Msa0JBQTlCLEtBQXFELEVBQTlFOztBQVdBLFFBQUd4RSxVQUFIO0FBQ0M4RCxpQkFBVzdFLDBCQUEwQmdCLGNBQTFCLEVBQTBDbGxCLFdBQTFDLEVBQXVEaWxCLFdBQVdwakIsR0FBbEUsQ0FBWDs7QUFDQSxVQUFHa25CLFFBQUg7QUFDQ1AsbUJBQVczZ0IsV0FBWCxHQUF5QmtoQixTQUFTbGhCLFdBQWxDO0FBQ0EyZ0IsbUJBQVd4Z0IsV0FBWCxHQUF5QitnQixTQUFTL2dCLFdBQWxDO0FBQ0F3Z0IsbUJBQVd6Z0IsU0FBWCxHQUF1QmdoQixTQUFTaGhCLFNBQWhDO0FBQ0F5Z0IsbUJBQVcxZ0IsU0FBWCxHQUF1QmloQixTQUFTamhCLFNBQWhDO0FBQ0EwZ0IsbUJBQVdyaUIsZ0JBQVgsR0FBOEI0aUIsU0FBUzVpQixnQkFBdkM7QUFDQXFpQixtQkFBV3ZnQixjQUFYLEdBQTRCOGdCLFNBQVM5Z0IsY0FBckM7QUFDQXVnQixtQkFBV3JnQixvQkFBWCxHQUFrQzRnQixTQUFTNWdCLG9CQUEzQztBQUNBcWdCLG1CQUFXdGdCLGtCQUFYLEdBQWdDNmdCLFNBQVM3Z0Isa0JBQXpDO0FBQ0FzZ0IsbUJBQVc1UyxtQkFBWCxHQUFpQ21ULFNBQVNuVCxtQkFBMUM7QUFDQTRTLG1CQUFXa0IsZ0JBQVgsR0FBOEJYLFNBQVNXLGdCQUF2QztBQUNBbEIsbUJBQVc1USxpQkFBWCxHQUErQm1SLFNBQVNuUixpQkFBeEM7QUFDQTRRLG1CQUFXM1EsaUJBQVgsR0FBK0JrUixTQUFTbFIsaUJBQXhDO0FBQ0EyUSxtQkFBV21CLGlCQUFYLEdBQStCWixTQUFTWSxpQkFBeEM7QUFmRjtBQytQRzs7QUQvT0gsUUFBRy9ELFNBQUg7QUFDQ3VELGdCQUFVakYsMEJBQTBCMkIsYUFBMUIsRUFBeUM3bEIsV0FBekMsRUFBc0Q0bEIsVUFBVS9qQixHQUFoRSxDQUFWOztBQUNBLFVBQUdzbkIsT0FBSDtBQUNDUCxrQkFBVS9nQixXQUFWLEdBQXdCc2hCLFFBQVF0aEIsV0FBaEM7QUFDQStnQixrQkFBVTVnQixXQUFWLEdBQXdCbWhCLFFBQVFuaEIsV0FBaEM7QUFDQTRnQixrQkFBVTdnQixTQUFWLEdBQXNCb2hCLFFBQVFwaEIsU0FBOUI7QUFDQTZnQixrQkFBVTlnQixTQUFWLEdBQXNCcWhCLFFBQVFyaEIsU0FBOUI7QUFDQThnQixrQkFBVXppQixnQkFBVixHQUE2QmdqQixRQUFRaGpCLGdCQUFyQztBQUNBeWlCLGtCQUFVM2dCLGNBQVYsR0FBMkJraEIsUUFBUWxoQixjQUFuQztBQUNBMmdCLGtCQUFVemdCLG9CQUFWLEdBQWlDZ2hCLFFBQVFoaEIsb0JBQXpDO0FBQ0F5Z0Isa0JBQVUxZ0Isa0JBQVYsR0FBK0JpaEIsUUFBUWpoQixrQkFBdkM7QUFDQTBnQixrQkFBVWhULG1CQUFWLEdBQWdDdVQsUUFBUXZULG1CQUF4QztBQUNBZ1Qsa0JBQVVjLGdCQUFWLEdBQTZCUCxRQUFRTyxnQkFBckM7QUFDQWQsa0JBQVVoUixpQkFBVixHQUE4QnVSLFFBQVF2UixpQkFBdEM7QUFDQWdSLGtCQUFVL1EsaUJBQVYsR0FBOEJzUixRQUFRdFIsaUJBQXRDO0FBQ0ErUSxrQkFBVWUsaUJBQVYsR0FBOEJSLFFBQVFRLGlCQUF0QztBQWZGO0FDaVFHOztBRGpQSCxRQUFHbkUsV0FBSDtBQUNDeUQsa0JBQVkvRSwwQkFBMEJ1QixlQUExQixFQUEyQ3psQixXQUEzQyxFQUF3RHdsQixZQUFZM2pCLEdBQXBFLENBQVo7O0FBQ0EsVUFBR29uQixTQUFIO0FBQ0NQLG9CQUFZN2dCLFdBQVosR0FBMEJvaEIsVUFBVXBoQixXQUFwQztBQUNBNmdCLG9CQUFZMWdCLFdBQVosR0FBMEJpaEIsVUFBVWpoQixXQUFwQztBQUNBMGdCLG9CQUFZM2dCLFNBQVosR0FBd0JraEIsVUFBVWxoQixTQUFsQztBQUNBMmdCLG9CQUFZNWdCLFNBQVosR0FBd0JtaEIsVUFBVW5oQixTQUFsQztBQUNBNGdCLG9CQUFZdmlCLGdCQUFaLEdBQStCOGlCLFVBQVU5aUIsZ0JBQXpDO0FBQ0F1aUIsb0JBQVl6Z0IsY0FBWixHQUE2QmdoQixVQUFVaGhCLGNBQXZDO0FBQ0F5Z0Isb0JBQVl2Z0Isb0JBQVosR0FBbUM4Z0IsVUFBVTlnQixvQkFBN0M7QUFDQXVnQixvQkFBWXhnQixrQkFBWixHQUFpQytnQixVQUFVL2dCLGtCQUEzQztBQUNBd2dCLG9CQUFZOVMsbUJBQVosR0FBa0NxVCxVQUFVclQsbUJBQTVDO0FBQ0E4UyxvQkFBWWdCLGdCQUFaLEdBQStCVCxVQUFVUyxnQkFBekM7QUFDQWhCLG9CQUFZOVEsaUJBQVosR0FBZ0NxUixVQUFVclIsaUJBQTFDO0FBQ0E4USxvQkFBWTdRLGlCQUFaLEdBQWdDb1IsVUFBVXBSLGlCQUExQztBQUNBNlEsb0JBQVlpQixpQkFBWixHQUFnQ1YsVUFBVVUsaUJBQTFDO0FBZkY7QUNtUUc7O0FEblBILFFBQUdyRSxVQUFIO0FBQ0MwRCxpQkFBVzlFLDBCQUEwQnFCLGNBQTFCLEVBQTBDdmxCLFdBQTFDLEVBQXVEc2xCLFdBQVd6akIsR0FBbEUsQ0FBWDs7QUFDQSxVQUFHbW5CLFFBQUg7QUFDQ1AsbUJBQVc1Z0IsV0FBWCxHQUF5Qm1oQixTQUFTbmhCLFdBQWxDO0FBQ0E0Z0IsbUJBQVd6Z0IsV0FBWCxHQUF5QmdoQixTQUFTaGhCLFdBQWxDO0FBQ0F5Z0IsbUJBQVcxZ0IsU0FBWCxHQUF1QmloQixTQUFTamhCLFNBQWhDO0FBQ0EwZ0IsbUJBQVczZ0IsU0FBWCxHQUF1QmtoQixTQUFTbGhCLFNBQWhDO0FBQ0EyZ0IsbUJBQVd0aUIsZ0JBQVgsR0FBOEI2aUIsU0FBUzdpQixnQkFBdkM7QUFDQXNpQixtQkFBV3hnQixjQUFYLEdBQTRCK2dCLFNBQVMvZ0IsY0FBckM7QUFDQXdnQixtQkFBV3RnQixvQkFBWCxHQUFrQzZnQixTQUFTN2dCLG9CQUEzQztBQUNBc2dCLG1CQUFXdmdCLGtCQUFYLEdBQWdDOGdCLFNBQVM5Z0Isa0JBQXpDO0FBQ0F1Z0IsbUJBQVc3UyxtQkFBWCxHQUFpQ29ULFNBQVNwVCxtQkFBMUM7QUFDQTZTLG1CQUFXaUIsZ0JBQVgsR0FBOEJWLFNBQVNVLGdCQUF2QztBQUNBakIsbUJBQVc3USxpQkFBWCxHQUErQm9SLFNBQVNwUixpQkFBeEM7QUFDQTZRLG1CQUFXNVEsaUJBQVgsR0FBK0JtUixTQUFTblIsaUJBQXhDO0FBQ0E0USxtQkFBV2tCLGlCQUFYLEdBQStCWCxTQUFTVyxpQkFBeEM7QUFmRjtBQ3FRRzs7QURyUEgsUUFBRzdELGtCQUFIO0FBQ0NzRCx5QkFBbUJsRiwwQkFBMEI2QixzQkFBMUIsRUFBa0QvbEIsV0FBbEQsRUFBK0Q4bEIsbUJBQW1CamtCLEdBQWxGLENBQW5COztBQUNBLFVBQUd1bkIsZ0JBQUg7QUFDQ1AsMkJBQW1CaGhCLFdBQW5CLEdBQWlDdWhCLGlCQUFpQnZoQixXQUFsRDtBQUNBZ2hCLDJCQUFtQjdnQixXQUFuQixHQUFpQ29oQixpQkFBaUJwaEIsV0FBbEQ7QUFDQTZnQiwyQkFBbUI5Z0IsU0FBbkIsR0FBK0JxaEIsaUJBQWlCcmhCLFNBQWhEO0FBQ0E4Z0IsMkJBQW1CL2dCLFNBQW5CLEdBQStCc2hCLGlCQUFpQnRoQixTQUFoRDtBQUNBK2dCLDJCQUFtQjFpQixnQkFBbkIsR0FBc0NpakIsaUJBQWlCampCLGdCQUF2RDtBQUNBMGlCLDJCQUFtQjVnQixjQUFuQixHQUFvQ21oQixpQkFBaUJuaEIsY0FBckQ7QUFDQTRnQiwyQkFBbUIxZ0Isb0JBQW5CLEdBQTBDaWhCLGlCQUFpQmpoQixvQkFBM0Q7QUFDQTBnQiwyQkFBbUIzZ0Isa0JBQW5CLEdBQXdDa2hCLGlCQUFpQmxoQixrQkFBekQ7QUFDQTJnQiwyQkFBbUJqVCxtQkFBbkIsR0FBeUN3VCxpQkFBaUJ4VCxtQkFBMUQ7QUFDQWlULDJCQUFtQmEsZ0JBQW5CLEdBQXNDTixpQkFBaUJNLGdCQUF2RDtBQUNBYiwyQkFBbUJqUixpQkFBbkIsR0FBdUN3UixpQkFBaUJ4UixpQkFBeEQ7QUFDQWlSLDJCQUFtQmhSLGlCQUFuQixHQUF1Q3VSLGlCQUFpQnZSLGlCQUF4RDtBQUNBZ1IsMkJBQW1CYyxpQkFBbkIsR0FBdUNQLGlCQUFpQk8saUJBQXhEO0FBZkY7QUN1UUc7O0FEdlBILFFBQUdqRSxzQkFBSDtBQUNDd0QsNkJBQXVCaEYsMEJBQTBCeUIsMEJBQTFCLEVBQXNEM2xCLFdBQXRELEVBQW1FMGxCLHVCQUF1QjdqQixHQUExRixDQUF2Qjs7QUFDQSxVQUFHcW5CLG9CQUFIO0FBQ0NQLCtCQUF1QjlnQixXQUF2QixHQUFxQ3FoQixxQkFBcUJyaEIsV0FBMUQ7QUFDQThnQiwrQkFBdUIzZ0IsV0FBdkIsR0FBcUNraEIscUJBQXFCbGhCLFdBQTFEO0FBQ0EyZ0IsK0JBQXVCNWdCLFNBQXZCLEdBQW1DbWhCLHFCQUFxQm5oQixTQUF4RDtBQUNBNGdCLCtCQUF1QjdnQixTQUF2QixHQUFtQ29oQixxQkFBcUJwaEIsU0FBeEQ7QUFDQTZnQiwrQkFBdUJ4aUIsZ0JBQXZCLEdBQTBDK2lCLHFCQUFxQi9pQixnQkFBL0Q7QUFDQXdpQiwrQkFBdUIxZ0IsY0FBdkIsR0FBd0NpaEIscUJBQXFCamhCLGNBQTdEO0FBQ0EwZ0IsK0JBQXVCeGdCLG9CQUF2QixHQUE4QytnQixxQkFBcUIvZ0Isb0JBQW5FO0FBQ0F3Z0IsK0JBQXVCemdCLGtCQUF2QixHQUE0Q2doQixxQkFBcUJoaEIsa0JBQWpFO0FBQ0F5Z0IsK0JBQXVCL1MsbUJBQXZCLEdBQTZDc1QscUJBQXFCdFQsbUJBQWxFO0FBQ0ErUywrQkFBdUJlLGdCQUF2QixHQUEwQ1IscUJBQXFCUSxnQkFBL0Q7QUFDQWYsK0JBQXVCL1EsaUJBQXZCLEdBQTJDc1IscUJBQXFCdFIsaUJBQWhFO0FBQ0ErUSwrQkFBdUI5USxpQkFBdkIsR0FBMkNxUixxQkFBcUJyUixpQkFBaEU7QUFDQThRLCtCQUF1QmdCLGlCQUF2QixHQUEyQ1QscUJBQXFCUyxpQkFBaEU7QUFmRjtBQ3lRRzs7QUR6UEgsUUFBRyxDQUFDeG5CLE1BQUo7QUFDQzRDLG9CQUFjeWpCLFVBQWQ7QUFERDtBQUdDLFVBQUd0bUIsWUFBSDtBQUNDNkMsc0JBQWN5akIsVUFBZDtBQUREO0FBR0MsWUFBR3htQixZQUFXLFFBQWQ7QUFDQytDLHdCQUFjNmpCLFNBQWQ7QUFERDtBQUdDM0Msc0JBQWVsbEIsRUFBRXVuQixNQUFGLENBQVMsS0FBS3JDLFNBQWQsS0FBNEIsS0FBS0EsU0FBakMsR0FBZ0QsS0FBS0EsU0FBckQsR0FBb0V6b0IsUUFBUXVFLGFBQVIsQ0FBc0IsYUFBdEIsRUFBcUNLLE9BQXJDLENBQTZDO0FBQUUvQixtQkFBTzJCLE9BQVQ7QUFBa0JrRixrQkFBTS9FO0FBQXhCLFdBQTdDLEVBQStFO0FBQUVtRCxvQkFBUTtBQUFFcWhCLHVCQUFTO0FBQVg7QUFBVixXQUEvRSxDQUFuRjs7QUFDQSxjQUFHVixTQUFIO0FBQ0NvRCxtQkFBT3BELFVBQVVVLE9BQWpCOztBQUNBLGdCQUFHMEMsSUFBSDtBQUNDLGtCQUFHQSxTQUFRLE1BQVg7QUFDQ3RrQiw4QkFBYzZqQixTQUFkO0FBREQscUJBRUssSUFBR1MsU0FBUSxRQUFYO0FBQ0p0a0IsOEJBQWMyakIsV0FBZDtBQURJLHFCQUVBLElBQUdXLFNBQVEsT0FBWDtBQUNKdGtCLDhCQUFjMGpCLFVBQWQ7QUFORjtBQUFBO0FBUUMxakIsNEJBQWM2akIsU0FBZDtBQVZGO0FBQUE7QUFZQzdqQiwwQkFBYzBqQixVQUFkO0FBaEJGO0FBSEQ7QUFIRDtBQzZSRzs7QURyUUgsUUFBR3pELE1BQU0zaEIsTUFBTixHQUFlLENBQWxCO0FBQ0MyaUIsZ0JBQVVqbEIsRUFBRTJsQixLQUFGLENBQVExQixLQUFSLEVBQWUsS0FBZixDQUFWO0FBQ0E4RCxZQUFNM0UsdUJBQXVCa0IsZ0JBQXZCLEVBQXlDcmxCLFdBQXpDLEVBQXNEZ21CLE9BQXRELENBQU47O0FBQ0FqbEIsUUFBRWtDLElBQUYsQ0FBTzZsQixHQUFQLEVBQVksVUFBQ2xoQixFQUFEO0FBQ1gsWUFBR0EsR0FBR3llLGlCQUFILE1BQUFwQixjQUFBLE9BQXdCQSxXQUFZcGpCLEdBQXBDLEdBQW9DLE1BQXBDLEtBQ0grRixHQUFHeWUsaUJBQUgsTUFBQVQsYUFBQSxPQUF3QkEsVUFBVy9qQixHQUFuQyxHQUFtQyxNQUFuQyxDQURHLElBRUgrRixHQUFHeWUsaUJBQUgsTUFBQWIsZUFBQSxPQUF3QkEsWUFBYTNqQixHQUFyQyxHQUFxQyxNQUFyQyxDQUZHLElBR0grRixHQUFHeWUsaUJBQUgsTUFBQWYsY0FBQSxPQUF3QkEsV0FBWXpqQixHQUFwQyxHQUFvQyxNQUFwQyxDQUhHLElBSUgrRixHQUFHeWUsaUJBQUgsTUFBQVAsc0JBQUEsT0FBd0JBLG1CQUFvQmprQixHQUE1QyxHQUE0QyxNQUE1QyxDQUpHLElBS0grRixHQUFHeWUsaUJBQUgsTUFBQVgsMEJBQUEsT0FBd0JBLHVCQUF3QjdqQixHQUFoRCxHQUFnRCxNQUFoRCxDQUxBO0FBT0M7QUNpUUk7O0FEaFFMLFlBQUcrRixHQUFHRSxTQUFOO0FBQ0MvQyxzQkFBWStDLFNBQVosR0FBd0IsSUFBeEI7QUNrUUk7O0FEalFMLFlBQUdGLEdBQUdDLFdBQU47QUFDQzlDLHNCQUFZOEMsV0FBWixHQUEwQixJQUExQjtBQ21RSTs7QURsUUwsWUFBR0QsR0FBR0csU0FBTjtBQUNDaEQsc0JBQVlnRCxTQUFaLEdBQXdCLElBQXhCO0FDb1FJOztBRG5RTCxZQUFHSCxHQUFHSSxXQUFOO0FBQ0NqRCxzQkFBWWlELFdBQVosR0FBMEIsSUFBMUI7QUNxUUk7O0FEcFFMLFlBQUdKLEdBQUd6QixnQkFBTjtBQUNDcEIsc0JBQVlvQixnQkFBWixHQUErQixJQUEvQjtBQ3NRSTs7QURyUUwsWUFBR3lCLEdBQUdLLGNBQU47QUFDQ2xELHNCQUFZa0QsY0FBWixHQUE2QixJQUE3QjtBQ3VRSTs7QUR0UUwsWUFBR0wsR0FBR08sb0JBQU47QUFDQ3BELHNCQUFZb0Qsb0JBQVosR0FBbUMsSUFBbkM7QUN3UUk7O0FEdlFMLFlBQUdQLEdBQUdNLGtCQUFOO0FBQ0NuRCxzQkFBWW1ELGtCQUFaLEdBQWlDLElBQWpDO0FDeVFJOztBRHZRTG5ELG9CQUFZNlEsbUJBQVosR0FBa0N3TyxVQUFVcmYsWUFBWTZRLG1CQUF0QixFQUEyQ2hPLEdBQUdnTyxtQkFBOUMsQ0FBbEM7QUFDQTdRLG9CQUFZMmtCLGdCQUFaLEdBQStCdEYsVUFBVXJmLFlBQVkya0IsZ0JBQXRCLEVBQXdDOWhCLEdBQUc4aEIsZ0JBQTNDLENBQS9CO0FBQ0Eza0Isb0JBQVk2UyxpQkFBWixHQUFnQ3dNLFVBQVVyZixZQUFZNlMsaUJBQXRCLEVBQXlDaFEsR0FBR2dRLGlCQUE1QyxDQUFoQztBQUNBN1Msb0JBQVk4UyxpQkFBWixHQUFnQ3VNLFVBQVVyZixZQUFZOFMsaUJBQXRCLEVBQXlDalEsR0FBR2lRLGlCQUE1QyxDQUFoQztBQ3lRSSxlRHhRSjlTLFlBQVk0a0IsaUJBQVosR0FBZ0N2RixVQUFVcmYsWUFBWTRrQixpQkFBdEIsRUFBeUMvaEIsR0FBRytoQixpQkFBNUMsQ0N3UTVCO0FEdFNMOztBQWdDQSxVQUFHNUUsZUFBSDtBQUNDLFlBQUc4RCxtQkFBbUIvZ0IsU0FBdEI7QUFDQy9DLHNCQUFZK0MsU0FBWixHQUF3QixJQUF4QjtBQ3lRSTs7QUR4UUwsWUFBRytnQixtQkFBbUJoaEIsV0FBdEI7QUFDQzlDLHNCQUFZOEMsV0FBWixHQUEwQixJQUExQjtBQzBRSTs7QUR6UUwsWUFBR2doQixtQkFBbUI5Z0IsU0FBdEI7QUFDQ2hELHNCQUFZZ0QsU0FBWixHQUF3QixJQUF4QjtBQzJRSTs7QUQxUUwsWUFBRzhnQixtQkFBbUI3Z0IsV0FBdEI7QUFDQ2pELHNCQUFZaUQsV0FBWixHQUEwQixJQUExQjtBQzRRSTs7QUQzUUwsWUFBRzZnQixtQkFBbUIxaUIsZ0JBQXRCO0FBQ0NwQixzQkFBWW9CLGdCQUFaLEdBQStCLElBQS9CO0FDNlFJOztBRDVRTCxZQUFHMGlCLG1CQUFtQjVnQixjQUF0QjtBQUNDbEQsc0JBQVlrRCxjQUFaLEdBQTZCLElBQTdCO0FDOFFJOztBRDdRTCxZQUFHNGdCLG1CQUFtQjFnQixvQkFBdEI7QUFDQ3BELHNCQUFZb0Qsb0JBQVosR0FBbUMsSUFBbkM7QUMrUUk7O0FEOVFMLFlBQUcwZ0IsbUJBQW1CM2dCLGtCQUF0QjtBQUNDbkQsc0JBQVltRCxrQkFBWixHQUFpQyxJQUFqQztBQ2dSSTs7QUQ5UUxuRCxvQkFBWTZRLG1CQUFaLEdBQWtDd08sVUFBVXJmLFlBQVk2USxtQkFBdEIsRUFBMkNpVCxtQkFBbUJqVCxtQkFBOUQsQ0FBbEM7QUFDQTdRLG9CQUFZMmtCLGdCQUFaLEdBQStCdEYsVUFBVXJmLFlBQVkya0IsZ0JBQXRCLEVBQXdDYixtQkFBbUJhLGdCQUEzRCxDQUEvQjtBQUNBM2tCLG9CQUFZNlMsaUJBQVosR0FBZ0N3TSxVQUFVcmYsWUFBWTZTLGlCQUF0QixFQUF5Q2lSLG1CQUFtQmpSLGlCQUE1RCxDQUFoQztBQUNBN1Msb0JBQVk4UyxpQkFBWixHQUFnQ3VNLFVBQVVyZixZQUFZOFMsaUJBQXRCLEVBQXlDZ1IsbUJBQW1CaFIsaUJBQTVELENBQWhDO0FBQ0E5UyxvQkFBWTRrQixpQkFBWixHQUFnQ3ZGLFVBQVVyZixZQUFZNGtCLGlCQUF0QixFQUF5Q2QsbUJBQW1CYyxpQkFBNUQsQ0FBaEM7QUNnUkc7O0FEOVFKLFVBQUc3RSxtQkFBSDtBQUNDLFlBQUc2RCx1QkFBdUI3Z0IsU0FBMUI7QUFDQy9DLHNCQUFZK0MsU0FBWixHQUF3QixJQUF4QjtBQ2dSSTs7QUQvUUwsWUFBRzZnQix1QkFBdUI5Z0IsV0FBMUI7QUFDQzlDLHNCQUFZOEMsV0FBWixHQUEwQixJQUExQjtBQ2lSSTs7QURoUkwsWUFBRzhnQix1QkFBdUI1Z0IsU0FBMUI7QUFDQ2hELHNCQUFZZ0QsU0FBWixHQUF3QixJQUF4QjtBQ2tSSTs7QURqUkwsWUFBRzRnQix1QkFBdUIzZ0IsV0FBMUI7QUFDQ2pELHNCQUFZaUQsV0FBWixHQUEwQixJQUExQjtBQ21SSTs7QURsUkwsWUFBRzJnQix1QkFBdUJ4aUIsZ0JBQTFCO0FBQ0NwQixzQkFBWW9CLGdCQUFaLEdBQStCLElBQS9CO0FDb1JJOztBRG5STCxZQUFHd2lCLHVCQUF1QjFnQixjQUExQjtBQUNDbEQsc0JBQVlrRCxjQUFaLEdBQTZCLElBQTdCO0FDcVJJOztBRHBSTCxZQUFHMGdCLHVCQUF1QnhnQixvQkFBMUI7QUFDQ3BELHNCQUFZb0Qsb0JBQVosR0FBbUMsSUFBbkM7QUNzUkk7O0FEclJMLFlBQUd3Z0IsdUJBQXVCemdCLGtCQUExQjtBQUNDbkQsc0JBQVltRCxrQkFBWixHQUFpQyxJQUFqQztBQ3VSSTs7QURyUkxuRCxvQkFBWTZRLG1CQUFaLEdBQWtDd08sVUFBVXJmLFlBQVk2USxtQkFBdEIsRUFBMkMrUyx1QkFBdUIvUyxtQkFBbEUsQ0FBbEM7QUFDQTdRLG9CQUFZMmtCLGdCQUFaLEdBQStCdEYsVUFBVXJmLFlBQVkya0IsZ0JBQXRCLEVBQXdDZix1QkFBdUJlLGdCQUEvRCxDQUEvQjtBQUNBM2tCLG9CQUFZNlMsaUJBQVosR0FBZ0N3TSxVQUFVcmYsWUFBWTZTLGlCQUF0QixFQUF5QytRLHVCQUF1Qi9RLGlCQUFoRSxDQUFoQztBQUNBN1Msb0JBQVk4UyxpQkFBWixHQUFnQ3VNLFVBQVVyZixZQUFZOFMsaUJBQXRCLEVBQXlDOFEsdUJBQXVCOVEsaUJBQWhFLENBQWhDO0FBQ0E5UyxvQkFBWTRrQixpQkFBWixHQUFnQ3ZGLFVBQVVyZixZQUFZNGtCLGlCQUF0QixFQUF5Q2hCLHVCQUF1QmdCLGlCQUFoRSxDQUFoQztBQWpGRjtBQ3lXRzs7QUR0UkgsUUFBRzFxQixPQUFPaVgsT0FBVjtBQUNDblIsa0JBQVk4QyxXQUFaLEdBQTBCLEtBQTFCO0FBQ0E5QyxrQkFBWWdELFNBQVosR0FBd0IsS0FBeEI7QUFDQWhELGtCQUFZaUQsV0FBWixHQUEwQixLQUExQjtBQUNBakQsa0JBQVlvQixnQkFBWixHQUErQixLQUEvQjtBQUNBcEIsa0JBQVlvRCxvQkFBWixHQUFtQyxLQUFuQztBQUNBcEQsa0JBQVkya0IsZ0JBQVosR0FBK0IsRUFBL0I7QUN3UkU7O0FEdlJIbHNCLFlBQVFtSyxrQkFBUixDQUEyQjVDLFdBQTNCO0FBQ0EsV0FBT0EsV0FBUDtBQTlQOEIsR0FBL0I7O0FBa1NBNUcsU0FBT3lLLE9BQVAsQ0FFQztBQUFBLGtDQUE4QixVQUFDNUcsT0FBRDtBQUM3QixhQUFPeEUsUUFBUW9uQixpQkFBUixDQUEwQjVpQixPQUExQixFQUFtQyxLQUFLRyxNQUF4QyxDQUFQO0FBREQ7QUFBQSxHQUZEO0FDMlBBLEM7Ozs7Ozs7Ozs7OztBQzF2QkRoRSxPQUFPRSxPQUFQLENBQWU7QUFDZCxNQUFBdXJCLGNBQUEsRUFBQUMsU0FBQTs7QUFBQSxNQUFHMXJCLE9BQU8wQixRQUFWO0FBQ0MrcEIscUJBQWlCeGhCLFFBQVFDLEdBQVIsQ0FBWXloQixpQkFBN0I7QUFDQUQsZ0JBQVl6aEIsUUFBUUMsR0FBUixDQUFZMGhCLHVCQUF4Qjs7QUFDQSxRQUFHSCxjQUFIO0FBQ0MsVUFBRyxDQUFDQyxTQUFKO0FBQ0MsY0FBTSxJQUFJMXJCLE9BQU91SSxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGlFQUF0QixDQUFOO0FDRUc7O0FBQ0QsYURGSGxKLFFBQVF3c0IsbUJBQVIsR0FBOEI7QUFBQ0MsaUJBQVMsSUFBSUMsZUFBZUMsc0JBQW5CLENBQTBDUCxjQUExQyxFQUEwRDtBQUFDUSxvQkFBVVA7QUFBWCxTQUExRDtBQUFWLE9DRTNCO0FEUkw7QUNjRTtBRGZIOztBQVNBcnNCLFFBQVF5YSxnQkFBUixHQUEyQixVQUFDaFosTUFBRDtBQUMxQixNQUFBb3JCLGNBQUE7QUFBQUEsbUJBQWlCcHJCLE9BQU9rQixJQUF4Qjs7QUFDQSxNQUFHbEIsT0FBT29CLEtBQVY7QUFDQ2dxQixxQkFBaUIsT0FBT3ByQixPQUFPb0IsS0FBZCxHQUFzQixHQUF0QixHQUE0QnBCLE9BQU9rQixJQUFwRDtBQ1dDOztBRFRGLE1BQUc1QyxHQUFHOHNCLGNBQUgsQ0FBSDtBQUNDLFdBQU85c0IsR0FBRzhzQixjQUFILENBQVA7QUFERCxTQUVLLElBQUdwckIsT0FBTzFCLEVBQVY7QUFDSixXQUFPMEIsT0FBTzFCLEVBQWQ7QUNXQzs7QURURixNQUFHQyxRQUFRRSxXQUFSLENBQW9CMnNCLGNBQXBCLENBQUg7QUFDQyxXQUFPN3NCLFFBQVFFLFdBQVIsQ0FBb0Iyc0IsY0FBcEIsQ0FBUDtBQUREO0FBR0MsUUFBR3ByQixPQUFPcVgsTUFBVjtBQUNDLGFBQU8sSUFBSW5ZLE9BQU9tc0IsVUFBWCxDQUFzQkQsY0FBdEIsRUFBc0M3c0IsUUFBUXdzQixtQkFBOUMsQ0FBUDtBQUREO0FBR0MsYUFBTyxJQUFJN3JCLE9BQU9tc0IsVUFBWCxDQUFzQkQsY0FBdEIsQ0FBUDtBQU5GO0FDa0JFO0FENUJ3QixDQUEzQixDOzs7Ozs7Ozs7Ozs7QUVUQTdzQixRQUFRMlYsYUFBUixHQUF3QixFQUF4Qjs7QUFFQSxJQUFHaFYsT0FBTzhDLFFBQVY7QUFHQ3pELFVBQVF3VixPQUFSLEdBQWtCLFVBQUNBLE9BQUQ7QUNEZixXREVGalMsRUFBRWtDLElBQUYsQ0FBTytQLE9BQVAsRUFBZ0IsVUFBQ0QsSUFBRCxFQUFPd1gsV0FBUDtBQ0RaLGFERUgvc0IsUUFBUTJWLGFBQVIsQ0FBc0JvWCxXQUF0QixJQUFxQ3hYLElDRmxDO0FEQ0osTUNGRTtBRENlLEdBQWxCOztBQUlBdlYsVUFBUWd0QixhQUFSLEdBQXdCLFVBQUN4cUIsV0FBRCxFQUFjbUQsTUFBZCxFQUFzQmlJLFNBQXRCLEVBQWlDcWYsWUFBakMsRUFBK0N2YyxZQUEvQyxFQUE2RC9ELE1BQTdEO0FBQ3ZCLFFBQUF1Z0IsUUFBQSxFQUFBM3FCLEdBQUEsRUFBQWdULElBQUEsRUFBQTRYLFFBQUE7QUFBQTVxQixVQUFNdkMsUUFBUW1ELFNBQVIsQ0FBa0JYLFdBQWxCLENBQU47O0FBQ0EsUUFBQW1ELFVBQUEsT0FBR0EsT0FBUTRQLElBQVgsR0FBVyxNQUFYO0FBQ0MsVUFBRyxPQUFPNVAsT0FBTzRQLElBQWQsS0FBc0IsUUFBekI7QUFDQ0EsZUFBT3ZWLFFBQVEyVixhQUFSLENBQXNCaFEsT0FBTzRQLElBQTdCLENBQVA7QUFERCxhQUVLLElBQUcsT0FBTzVQLE9BQU80UCxJQUFkLEtBQXNCLFVBQXpCO0FBQ0pBLGVBQU81UCxPQUFPNFAsSUFBZDtBQ0NHOztBREFKLFVBQUcsQ0FBQzVJLE1BQUQsSUFBV25LLFdBQVgsSUFBMEJvTCxTQUE3QjtBQUNDakIsaUJBQVMzTSxRQUFRb3RCLEtBQVIsQ0FBY3hwQixHQUFkLENBQWtCcEIsV0FBbEIsRUFBK0JvTCxTQUEvQixDQUFUO0FDRUc7O0FEREosVUFBRzJILElBQUg7QUFFQzBYLHVCQUFrQkEsZUFBa0JBLFlBQWxCLEdBQW9DLEVBQXREO0FBQ0FDLG1CQUFXek8sTUFBTTFELFNBQU4sQ0FBZ0JzUyxLQUFoQixDQUFzQnpZLElBQXRCLENBQTJCb1IsU0FBM0IsRUFBc0MsQ0FBdEMsQ0FBWDtBQUNBbUgsbUJBQVcsQ0FBQzNxQixXQUFELEVBQWNvTCxTQUFkLEVBQXlCMGYsTUFBekIsQ0FBZ0NKLFFBQWhDLENBQVg7QUNFSSxlRERKM1gsS0FBS3dRLEtBQUwsQ0FBVztBQUNWdmpCLHVCQUFhQSxXQURIO0FBRVZvTCxxQkFBV0EsU0FGRDtBQUdWbk0sa0JBQVFjLEdBSEU7QUFJVm9ELGtCQUFRQSxNQUpFO0FBS1ZzbkIsd0JBQWNBLFlBTEo7QUFNVnRnQixrQkFBUUE7QUFORSxTQUFYLEVBT0d3Z0IsUUFQSCxDQ0NJO0FEYk47QUNzQkc7QUR4Qm9CLEdBQXhCOztBQXdCQW50QixVQUFRd1YsT0FBUixDQUVDO0FBQUEsc0JBQWtCO0FDRWQsYURESHVILE1BQU1DLElBQU4sQ0FBVyxzQkFBWCxDQ0NHO0FERko7QUFHQSxvQkFBZ0IsVUFBQ3hhLFdBQUQsRUFBY29MLFNBQWQsRUFBeUI5RixNQUF6QjtBQUNmLFVBQUF2QixHQUFBLEVBQUFOLEdBQUE7QUFBQUEsWUFBTWpHLFFBQVF3UixrQkFBUixDQUEyQmhQLFdBQTNCLENBQU47O0FBQ0EsVUFBQXlELE9BQUEsT0FBR0EsSUFBS0osTUFBUixHQUFRLE1BQVI7QUFHQytILG9CQUFZM0gsSUFBSSxDQUFKLENBQVo7QUFDQU0sY0FBTXZHLFFBQVFvdEIsS0FBUixDQUFjeHBCLEdBQWQsQ0FBa0JwQixXQUFsQixFQUErQm9MLFNBQS9CLENBQU47QUFDQWpLLGdCQUFRNHBCLEdBQVIsQ0FBWSxPQUFaLEVBQXFCaG5CLEdBQXJCO0FBRUE1QyxnQkFBUTRwQixHQUFSLENBQVksdUJBQVosRUFBcUMsSUFBckM7QUNBRzs7QURDSjVzQixhQUFPNnNCLEtBQVAsQ0FBYTtBQ0NSLGVEQUpDLEVBQUUsY0FBRixFQUFrQkMsS0FBbEIsRUNBSTtBRERMO0FBYkQ7QUFpQkEsMEJBQXNCLFVBQUNsckIsV0FBRCxFQUFjb0wsU0FBZCxFQUF5QjlGLE1BQXpCO0FBQ3JCLFVBQUE2bEIsSUFBQTtBQUFBQSxhQUFPM3RCLFFBQVE0dEIsWUFBUixDQUFxQnByQixXQUFyQixFQUFrQ29MLFNBQWxDLENBQVA7QUFDQWlnQixhQUFPQyxJQUFQLENBQ0NILElBREQsRUFFQyxRQUZELEVBR0MsMkdBSEQ7QUFLQSxhQUFPLEtBQVA7QUF4QkQ7QUEwQkEsMEJBQXNCLFVBQUNuckIsV0FBRCxFQUFjb0wsU0FBZCxFQUF5QjlGLE1BQXpCO0FBQ3JCLFVBQUE2bEIsSUFBQTtBQUFBQSxhQUFPM3RCLFFBQVE0dEIsWUFBUixDQUFxQnByQixXQUFyQixFQUFrQ29MLFNBQWxDLENBQVA7QUFDQWlnQixhQUFPQyxJQUFQLENBQ0NILElBREQsRUFFQyxRQUZELEVBR0MsMkdBSEQ7QUFLQSxhQUFPLEtBQVA7QUFqQ0Q7QUFtQ0EscUJBQWlCLFVBQUNuckIsV0FBRCxFQUFjb0wsU0FBZCxFQUF5QjlGLE1BQXpCO0FBQ2hCLFVBQUc4RixTQUFIO0FBQ0MsWUFBRzFHLFFBQVE2VSxRQUFSLE1BQXNCLEtBQXpCO0FBSUNwWSxrQkFBUTRwQixHQUFSLENBQVksb0JBQVosRUFBa0MvcUIsV0FBbEM7QUFDQW1CLGtCQUFRNHBCLEdBQVIsQ0FBWSxrQkFBWixFQUFnQzNmLFNBQWhDOztBQUNBLGNBQUcsS0FBS2pCLE1BQVI7QUFDQ2hKLG9CQUFRNHBCLEdBQVIsQ0FBWSxPQUFaLEVBQXFCLEtBQUs1Z0IsTUFBMUI7QUNSSzs7QUFDRCxpQkRRTGhNLE9BQU82c0IsS0FBUCxDQUFhO0FDUE4sbUJEUU5DLEVBQUUsa0JBQUYsRUFBc0JDLEtBQXRCLEVDUk07QURPUCxZQ1JLO0FEQU47QUFXQy9wQixrQkFBUTRwQixHQUFSLENBQVksb0JBQVosRUFBa0MvcUIsV0FBbEM7QUFDQW1CLGtCQUFRNHBCLEdBQVIsQ0FBWSxrQkFBWixFQUFnQzNmLFNBQWhDOztBQUNBLGNBQUcsS0FBS2pCLE1BQVI7QUFDQ2hKLG9CQUFRNHBCLEdBQVIsQ0FBWSxPQUFaLEVBQXFCLEtBQUs1Z0IsTUFBMUI7QUNOTSxtQkRPTmhNLE9BQU82c0IsS0FBUCxDQUFhO0FDTkwscUJET1BDLEVBQUUsbUJBQUYsRUFBdUJDLEtBQXZCLEVDUE87QURNUixjQ1BNO0FEUlI7QUFERDtBQ2NJO0FEbERMO0FBdURBLHVCQUFtQixVQUFDbHJCLFdBQUQsRUFBY29MLFNBQWQsRUFBeUJtZ0IsWUFBekIsRUFBdUNyZCxZQUF2QyxFQUFxRHNkLFNBQXJEO0FBQ2xCLFVBQUF2c0IsTUFBQSxFQUFBd3NCLElBQUE7QUFBQWh0QixjQUFRQyxHQUFSLENBQVksaUJBQVosRUFBK0JzQixXQUEvQixFQUE0Q29MLFNBQTVDLEVBQXVEbWdCLFlBQXZELEVBQXFFcmQsWUFBckU7QUFDQWpQLGVBQVN6QixRQUFRbUQsU0FBUixDQUFrQlgsV0FBbEIsQ0FBVDs7QUFFQSxVQUFHLENBQUNlLEVBQUU0QixRQUFGLENBQVc0b0IsWUFBWCxDQUFELEtBQUFBLGdCQUFBLE9BQTZCQSxhQUFjcHJCLElBQTNDLEdBQTJDLE1BQTNDLENBQUg7QUFDQ29yQix1Q0FBQSxPQUFlQSxhQUFjcHJCLElBQTdCLEdBQTZCLE1BQTdCO0FDRkc7O0FESUosVUFBR29yQixZQUFIO0FBQ0NFLGVBQU8sYUFBV3hzQixPQUFPbUwsS0FBbEIsR0FBd0IsSUFBeEIsR0FBNEJtaEIsWUFBNUIsR0FBeUMsSUFBaEQ7QUFERDtBQUdDRSxlQUFPLGFBQVd4c0IsT0FBT21MLEtBQXpCO0FDRkc7O0FBQ0QsYURFSHNoQixLQUNDO0FBQUFDLGVBQU8sT0FBSzFzQixPQUFPbUwsS0FBbkI7QUFDQXFoQixjQUFNLHlDQUF1Q0EsSUFBdkMsR0FBNEMsU0FEbEQ7QUFFQXhPLGNBQU0sSUFGTjtBQUdBMk8sMEJBQWlCLElBSGpCO0FBSUFDLDJCQUFtQnBULEVBQUUsUUFBRixDQUpuQjtBQUtBcVQsMEJBQWtCclQsRUFBRSxRQUFGO0FBTGxCLE9BREQsRUFPQyxVQUFDbkcsTUFBRDtBQUNDLFlBQUdBLE1BQUg7QUNESyxpQkRFSjlVLFFBQVFvdEIsS0FBUixDQUFhLFFBQWIsRUFBcUI1cUIsV0FBckIsRUFBa0NvTCxTQUFsQyxFQUE2QztBQUM1QyxnQkFBQTJnQixLQUFBLEVBQUFDLGtCQUFBLEVBQUFDLGFBQUEsRUFBQUMsbUJBQUEsRUFBQUMsSUFBQSxFQUFBQyxjQUFBOztBQUFBLGdCQUFHYixZQUFIO0FBQ0NZLHFCQUFPbHRCLE9BQU9tTCxLQUFQLElBQWUsT0FBS21oQixZQUFMLEdBQWtCLElBQWpDLElBQXVDLEtBQTlDO0FBREQ7QUFHQ1kscUJBQU8sTUFBUDtBQ0FLOztBRENONVcsbUJBQU84VyxPQUFQLENBQWVGLElBQWY7QUFFQUQsa0NBQXNCbHNCLFlBQVlxUSxPQUFaLENBQW9CLEtBQXBCLEVBQTBCLEdBQTFCLENBQXRCO0FBQ0E0Yiw0QkFBZ0JoQixFQUFFLG9CQUFrQmlCLG1CQUFwQixDQUFoQjs7QUFDQSxrQkFBQUQsaUJBQUEsT0FBT0EsY0FBZTVvQixNQUF0QixHQUFzQixNQUF0QjtBQUNDLGtCQUFHZ29CLE9BQU9pQixNQUFWO0FBQ0NGLGlDQUFpQixJQUFqQjtBQUNBSCxnQ0FBZ0JaLE9BQU9pQixNQUFQLENBQWNyQixDQUFkLENBQWdCLG9CQUFrQmlCLG1CQUFsQyxDQUFoQjtBQUhGO0FDSU07O0FEQU4sZ0JBQUFELGlCQUFBLE9BQUdBLGNBQWU1b0IsTUFBbEIsR0FBa0IsTUFBbEI7QUFDQyxrQkFBR3BFLE9BQU91WCxXQUFWO0FBQ0N3VixxQ0FBcUJDLGNBQWNNLFVBQWQsR0FBMkJBLFVBQTNCLENBQXNDLFVBQXRDLENBQXJCO0FBREQ7QUFHQ1AscUNBQXFCQyxjQUFjTyxVQUFkLEdBQTJCQSxVQUEzQixDQUFzQyxVQUF0QyxDQUFyQjtBQUpGO0FDT007O0FERk4sZ0JBQUdSLGtCQUFIO0FBQ0Msa0JBQUcvc0IsT0FBT3VYLFdBQVY7QUFDQ3dWLG1DQUFtQlMsT0FBbkI7QUFERDtBQUdDQyx5QkFBU0MsWUFBVCxDQUFzQkYsT0FBdEIsQ0FBOEJULGtCQUE5QjtBQUpGO0FDU007O0FESk4sZ0JBQUdJLGtCQUFrQixDQUFDSixrQkFBdEI7QUFDQyxrQkFBR0ksY0FBSDtBQUNDZix1QkFBT3VCLEtBQVA7QUFERCxxQkFFSyxJQUFHeGhCLGNBQWFqSyxRQUFRQyxHQUFSLENBQVksV0FBWixDQUFiLElBQTBDLENBQUNzRCxRQUFRNlUsUUFBUixFQUEzQyxJQUFrRXJMLGlCQUFnQixVQUFyRjtBQUNKNmQsd0JBQVE1cUIsUUFBUUMsR0FBUixDQUFZLFFBQVosQ0FBUjs7QUFDQSxxQkFBTzhNLFlBQVA7QUFDQ0EsaUNBQWUvTSxRQUFRQyxHQUFSLENBQVksY0FBWixDQUFmO0FDTU87O0FETFIscUJBQU84TSxZQUFQO0FBQ0NBLGlDQUFlLEtBQWY7QUNPTzs7QUROUjJlLDJCQUFXQyxFQUFYLENBQWMsVUFBUWYsS0FBUixHQUFjLEdBQWQsR0FBaUIvckIsV0FBakIsR0FBNkIsUUFBN0IsR0FBcUNrTyxZQUFuRDtBQVRGO0FDa0JNOztBRFJOLGdCQUFHc2QsYUFBYyxPQUFPQSxTQUFQLEtBQW9CLFVBQXJDO0FDVU8scUJEVE5BLFdDU007QUFDRDtBRDVDUCxZQ0ZJO0FBZ0REO0FEdkROLFFDRkc7QURoRUo7QUFBQSxHQUZEO0FDK0hBLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIkBkYiA9IHt9XHJcbmlmICFDcmVhdG9yP1xyXG5cdEBDcmVhdG9yID0ge31cclxuQ3JlYXRvci5PYmplY3RzID0ge31cclxuQ3JlYXRvci5Db2xsZWN0aW9ucyA9IHt9XHJcbkNyZWF0b3IuTWVudXMgPSBbXVxyXG5DcmVhdG9yLkFwcHMgPSB7fVxyXG5DcmVhdG9yLlJlcG9ydHMgPSB7fVxyXG5DcmVhdG9yLnN1YnMgPSB7fVxyXG5DcmVhdG9yLnN0ZWVkb3NTY2hlbWEgPSB7fSIsInRoaXMuZGIgPSB7fTtcblxuaWYgKHR5cGVvZiBDcmVhdG9yID09PSBcInVuZGVmaW5lZFwiIHx8IENyZWF0b3IgPT09IG51bGwpIHtcbiAgdGhpcy5DcmVhdG9yID0ge307XG59XG5cbkNyZWF0b3IuT2JqZWN0cyA9IHt9O1xuXG5DcmVhdG9yLkNvbGxlY3Rpb25zID0ge307XG5cbkNyZWF0b3IuTWVudXMgPSBbXTtcblxuQ3JlYXRvci5BcHBzID0ge307XG5cbkNyZWF0b3IuUmVwb3J0cyA9IHt9O1xuXG5DcmVhdG9yLnN1YnMgPSB7fTtcblxuQ3JlYXRvci5zdGVlZG9zU2NoZW1hID0ge307XG4iLCJ0cnlcclxuXHRzdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKVxyXG5cdGlmIE1ldGVvci5pc0RldmVsb3BtZW50XHJcblx0XHRNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHRzdGVlZG9zQ29yZS5pbml0KClcclxuXHRcdFx0Y2F0Y2ggZXhcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhleClcclxuY2F0Y2ggZVxyXG5cdGNvbnNvbGUubG9nKGUpIiwidmFyIGUsIHN0ZWVkb3NDb3JlO1xuXG50cnkge1xuICBzdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKTtcbiAgaWYgKE1ldGVvci5pc0RldmVsb3BtZW50KSB7XG4gICAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZXg7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gc3RlZWRvc0NvcmUuaW5pdCgpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXggPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGV4KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSBjYXRjaCAoZXJyb3IpIHtcbiAgZSA9IGVycm9yO1xuICBjb25zb2xlLmxvZyhlKTtcbn1cbiIsIkNyZWF0b3IuZGVwcyA9IHtcblx0YXBwOiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XG5cdG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxufTtcblxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XG5cdEFwcHM6IHt9LFxuXHRPYmplY3RzOiB7fVxufVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7ZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7b3B0aW9uc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7Y3JlYXRlRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXG5cbiMgQ3JlYXRvci5maWJlckxvYWRPYmplY3RzIOS+m3N0ZWVkb3MtY2xp6aG555uu5L2/55SoXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0RmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxuXHRDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxuXHRcdEZpYmVyKCgpLT5cblx0XHRcdENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSlcblx0XHQpLnJ1bigpXG5cbkNyZWF0b3IubG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IG9iai5uYW1lXG5cblx0aWYgIW9iai5saXN0X3ZpZXdzXG5cdFx0b2JqLmxpc3Rfdmlld3MgPSB7fVxuXG5cdGlmIG9iai5zcGFjZVxuXHRcdG9iamVjdF9uYW1lID0gJ2NfJyArIG9iai5zcGFjZSArICdfJyArIG9iai5uYW1lXG5cblx0Q3JlYXRvci5jb252ZXJ0T2JqZWN0KG9iailcblx0bmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XG5cblx0Q3JlYXRvci5pbml0VHJpZ2dlcnMob2JqZWN0X25hbWUpXG5cdENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSlcblx0cmV0dXJuIG9ialxuXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSAob2JqZWN0KSAtPlxuXHRpZiBvYmplY3Quc3BhY2Vcblx0XHRyZXR1cm4gXCJjXyN7b2JqZWN0LnNwYWNlfV8je29iamVjdC5uYW1lfVwiXG5cdHJldHVybiBvYmplY3QubmFtZVxuXG5DcmVhdG9yLmdldE9iamVjdCA9IChvYmplY3RfbmFtZSwgc3BhY2VfaWQpLT5cblx0aWYgXy5pc0FycmF5KG9iamVjdF9uYW1lKVxuXHRcdHJldHVybiA7XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdENyZWF0b3IuZGVwcz8ub2JqZWN0Py5kZXBlbmQoKVxuXHRpZiAhb2JqZWN0X25hbWUgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRpZiAhc3BhY2VfaWQgJiYgb2JqZWN0X25hbWVcblx0XHRpZiBNZXRlb3IuaXNDbGllbnQgJiYgIW9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2NfJylcblx0XHRcdHNwYWNlX2lkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cblx0aWYgb2JqZWN0X25hbWVcblx0XHRpZiBzcGFjZV9pZFxuXHRcdFx0b2JqID0gQ3JlYXRvci5vYmplY3RzQnlOYW1lW1wiY18je3NwYWNlX2lkfV8je29iamVjdF9uYW1lfVwiXVxuXHRcdFx0aWYgb2JqXG5cdFx0XHRcdHJldHVybiBvYmpcblxuXHRcdG9iaiA9IF8uZmluZCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvKS0+XG5cdFx0XHRcdHJldHVybiBvLl9jb2xsZWN0aW9uX25hbWUgPT0gb2JqZWN0X25hbWVcblx0XHRpZiBvYmpcblx0XHRcdHJldHVybiBvYmpcblxuXHRcdHJldHVybiBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IuZ2V0T2JqZWN0QnlJZCA9IChvYmplY3RfaWQpLT5cblx0cmV0dXJuIF8uZmluZFdoZXJlKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwge19pZDogb2JqZWN0X2lkfSlcblxuQ3JlYXRvci5yZW1vdmVPYmplY3QgPSAob2JqZWN0X25hbWUpLT5cblx0Y29uc29sZS5sb2coXCJyZW1vdmVPYmplY3RcIiwgb2JqZWN0X25hbWUpXG5cdGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXG5cdGRlbGV0ZSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCktPlxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0aWYgb2JqZWN0X25hbWVcblx0XHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk/Ll9jb2xsZWN0aW9uX25hbWVdXG5cbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSktPlxuXHRkZWxldGUgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cblx0c3BhY2UgPSBDcmVhdG9yLmdldE9iamVjdChcInNwYWNlc1wiKT8uZGI/LmZpbmRPbmUoc3BhY2VJZClcblx0aWYgc3BhY2U/LmFkbWluc1xuXHRcdHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDBcblxuXG5DcmVhdG9yLmV2YWx1YXRlRm9ybXVsYSA9IChmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucyktPlxuXG5cdGlmICFfLmlzU3RyaW5nKGZvcm11bGFyKVxuXHRcdHJldHVybiBmb3JtdWxhclxuXG5cdGlmIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKVxuXHRcdHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucylcblxuXHRyZXR1cm4gZm9ybXVsYXJcblxuQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnMgPSAoZmlsdGVycywgY29udGV4dCktPlxuXHRzZWxlY3RvciA9IHt9XG5cdF8uZWFjaCBmaWx0ZXJzLCAoZmlsdGVyKS0+XG5cdFx0aWYgZmlsdGVyPy5sZW5ndGggPT0gM1xuXHRcdFx0bmFtZSA9IGZpbHRlclswXVxuXHRcdFx0YWN0aW9uID0gZmlsdGVyWzFdXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgY29udGV4dClcblx0XHRcdHNlbGVjdG9yW25hbWVdID0ge31cblx0XHRcdHNlbGVjdG9yW25hbWVdW2FjdGlvbl0gPSB2YWx1ZVxuXHRjb25zb2xlLmxvZyhcImV2YWx1YXRlRmlsdGVycy0tPnNlbGVjdG9yXCIsIHNlbGVjdG9yKVxuXHRyZXR1cm4gc2VsZWN0b3JcblxuQ3JlYXRvci5pc0NvbW1vblNwYWNlID0gKHNwYWNlSWQpIC0+XG5cdHJldHVybiBzcGFjZUlkID09ICdjb21tb24nXG5cbiMjI1xuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXG5cdGlkc++8ml9pZOmbhuWQiFxuXHRpZF9rZXk6IOm7mOiupOS4ul9pZFxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXG4jIyNcbkNyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzID0gKGRvY3MsIGlkcywgaWRfa2V5LCBoaXRfZmlyc3QpLT5cblxuXHRpZiAhaWRfa2V5XG5cdFx0aWRfa2V5ID0gXCJfaWRcIlxuXG5cdGlmIGhpdF9maXJzdFxuXG5cdFx0I+eUseS6juS4jeiDveS9v+eUqF8uZmluZEluZGV45Ye95pWw77yM5Zug5q2k5q2k5aSE5YWI5bCG5a+56LGh5pWw57uE6L2s5Li65pmu6YCa5pWw57uE57G75Z6L77yM5Zyo6I635Y+W5YW2aW5kZXhcblx0XHR2YWx1ZXMgPSBkb2NzLmdldFByb3BlcnR5KGlkX2tleSlcblxuXHRcdHJldHVyblx0Xy5zb3J0QnkgZG9jcywgKGRvYyktPlxuXHRcdFx0XHRcdF9pbmRleCA9IGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKVxuXHRcdFx0XHRcdGlmIF9pbmRleCA+IC0xXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2luZGV4XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIGlkcy5sZW5ndGggKyBfLmluZGV4T2YodmFsdWVzLCBkb2NbaWRfa2V5XSlcblx0ZWxzZVxuXHRcdHJldHVyblx0Xy5zb3J0QnkgZG9jcywgKGRvYyktPlxuXHRcdFx0cmV0dXJuIGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKVxuXG4jIyNcblx05oyJ55So5oi35omA5bGe5pys5Zyw5YyW6K+t6KiA6L+b6KGM5o6S5bqP77yM5pSv5oyB5Lit5paH44CB5pWw5YC844CB5pel5pyf562J5a2X5q615o6S5bqPXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xuIyMjXG5DcmVhdG9yLnNvcnRpbmdNZXRob2QgPSAodmFsdWUxLCB2YWx1ZTIpIC0+XG5cdGlmIHRoaXMua2V5XG5cdFx0dmFsdWUxID0gdmFsdWUxW3RoaXMua2V5XVxuXHRcdHZhbHVlMiA9IHZhbHVlMlt0aGlzLmtleV1cblx0aWYgdmFsdWUxIGluc3RhbmNlb2YgRGF0ZVxuXHRcdHZhbHVlMSA9IHZhbHVlMS5nZXRUaW1lKClcblx0aWYgdmFsdWUyIGluc3RhbmNlb2YgRGF0ZVxuXHRcdHZhbHVlMiA9IHZhbHVlMi5nZXRUaW1lKClcblx0aWYgdHlwZW9mIHZhbHVlMSBpcyBcIm51bWJlclwiIGFuZCB0eXBlb2YgdmFsdWUyIGlzIFwibnVtYmVyXCJcblx0XHRyZXR1cm4gdmFsdWUxIC0gdmFsdWUyXG5cdCMgSGFuZGxpbmcgbnVsbCB2YWx1ZXNcblx0aXNWYWx1ZTFFbXB0eSA9IHZhbHVlMSA9PSBudWxsIG9yIHZhbHVlMSA9PSB1bmRlZmluZWRcblx0aXNWYWx1ZTJFbXB0eSA9IHZhbHVlMiA9PSBudWxsIG9yIHZhbHVlMiA9PSB1bmRlZmluZWRcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgIWlzVmFsdWUyRW1wdHlcblx0XHRyZXR1cm4gLTFcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgaXNWYWx1ZTJFbXB0eVxuXHRcdHJldHVybiAwXG5cdGlmICFpc1ZhbHVlMUVtcHR5IGFuZCBpc1ZhbHVlMkVtcHR5XG5cdFx0cmV0dXJuIDFcblx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxuXHRyZXR1cm4gdmFsdWUxLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZSB2YWx1ZTIudG9TdHJpbmcoKSwgbG9jYWxlXG5cblxuIyDor6Xlh73mlbDlj6rlnKjliJ3lp4vljJZPYmplY3Tml7bvvIzmiornm7jlhbPlr7nosaHnmoTorqHnrpfnu5Pmnpzkv53lrZjliLBPYmplY3TnmoRyZWxhdGVkX29iamVjdHPlsZ7mgKfkuK3vvIzlkI7nu63lj6/ku6Xnm7TmjqXku45yZWxhdGVkX29iamVjdHPlsZ7mgKfkuK3lj5blvpforqHnrpfnu5PmnpzogIzkuI3nlKjlho3mrKHosIPnlKjor6Xlh73mlbDmnaXorqHnrpdcbkNyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMgPSAob2JqZWN0X25hbWUpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRyZWxhdGVkX29iamVjdHMgPSBbXVxuXHQjIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0IyDlm6BDcmVhdG9yLmdldE9iamVjdOWHveaVsOWGhemDqOimgeiwg+eUqOivpeWHveaVsO+8jOaJgOS7pei/memHjOS4jeWPr+S7peiwg+eUqENyZWF0b3IuZ2V0T2JqZWN05Y+W5a+56LGh77yM5Y+q6IO96LCD55SoQ3JlYXRvci5PYmplY3Rz5p2l5Y+W5a+56LGhXG5cdF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXG5cdGlmICFfb2JqZWN0XG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xuXG5cdGlmIF9vYmplY3QuZW5hYmxlX2ZpbGVzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiY21zX2ZpbGVzXCIsIGZvcmVpZ25fa2V5OiBcInBhcmVudFwifVxuXG5cdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSktPlxuXHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cblx0XHRcdGlmIHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lXG5cdFx0XHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJvYmplY3RfZmllbGRzXCJcblx0XHRcdFx0XHQjVE9ETyDlvoXnm7jlhbPliJfooajmlK/mjIHmjpLluo/lkI7vvIzliKDpmaTmraTliKTmlq1cblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdHMuc3BsaWNlKDAsIDAsIHtvYmplY3RfbmFtZTpyZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lfSlcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpyZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lfVxuXG5cdGlmIF9vYmplY3QuZW5hYmxlX3Rhc2tzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwidGFza3NcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9ub3Rlc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcIm5vdGVzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfZXZlbnRzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiZXZlbnRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfaW5zdGFuY2VzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiaW5zdGFuY2VzXCIsIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIn1cblx0aWYgX29iamVjdC5lbmFibGVfYXBwcm92YWxzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiYXBwcm92YWxzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0I3JlY29yZCDor6bnu4bkuIvnmoRhdWRpdF9yZWNvcmRz5LuFbW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWPr+ingVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpXG5cdFx0aWYgX29iamVjdC5lbmFibGVfYXVkaXQgJiYgcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImF1ZGl0X3JlY29yZHNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXG5cdHJldHVybiByZWxhdGVkX29iamVjdHNcblxuQ3JlYXRvci5nZXRVc2VyQ29udGV4dCA9ICh1c2VySWQsIHNwYWNlSWQsIGlzVW5TYWZlTW9kZSktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRyZXR1cm4gQ3JlYXRvci5VU0VSX0NPTlRFWFRcblx0ZWxzZVxuXHRcdGlmICEodXNlcklkIGFuZCBzcGFjZUlkKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwidGhlIHBhcmFtcyB1c2VySWQgYW5kIHNwYWNlSWQgaXMgcmVxdWlyZWQgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFVzZXJDb250ZXh0XCJcblx0XHRcdHJldHVybiBudWxsXG5cdFx0c3VGaWVsZHMgPSB7bmFtZTogMSwgbW9iaWxlOiAxLCBwb3NpdGlvbjogMSwgZW1haWw6IDEsIGNvbXBhbnk6IDEsIG9yZ2FuaXphdGlvbjogMSwgc3BhY2U6IDEsIGNvbXBhbnlfaWQ6IDEsIGNvbXBhbnlfaWRzOiAxfVxuXHRcdCMgY2hlY2sgaWYgdXNlciBpbiB0aGUgc3BhY2Vcblx0XHRzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczogc3VGaWVsZHN9KVxuXHRcdGlmICFzdVxuXHRcdFx0c3BhY2VJZCA9IG51bGxcblxuXHRcdCMgaWYgc3BhY2VJZCBub3QgZXhpc3RzLCBnZXQgdGhlIGZpcnN0IG9uZS5cblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0aWYgaXNVblNhZmVNb2RlXG5cdFx0XHRcdHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe3VzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHN1RmllbGRzfSlcblx0XHRcdFx0aWYgIXN1XG5cdFx0XHRcdFx0cmV0dXJuIG51bGxcblx0XHRcdFx0c3BhY2VJZCA9IHN1LnNwYWNlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBudWxsXG5cblx0XHRVU0VSX0NPTlRFWFQgPSB7fVxuXHRcdFVTRVJfQ09OVEVYVC51c2VySWQgPSB1c2VySWRcblx0XHRVU0VSX0NPTlRFWFQuc3BhY2VJZCA9IHNwYWNlSWRcblx0XHRVU0VSX0NPTlRFWFQudXNlciA9IHtcblx0XHRcdF9pZDogdXNlcklkXG5cdFx0XHRuYW1lOiBzdS5uYW1lLFxuXHRcdFx0bW9iaWxlOiBzdS5tb2JpbGUsXG5cdFx0XHRwb3NpdGlvbjogc3UucG9zaXRpb24sXG5cdFx0XHRlbWFpbDogc3UuZW1haWxcblx0XHRcdGNvbXBhbnk6IHN1LmNvbXBhbnlcblx0XHRcdGNvbXBhbnlfaWQ6IHN1LmNvbXBhbnlfaWRcblx0XHRcdGNvbXBhbnlfaWRzOiBzdS5jb21wYW55X2lkc1xuXHRcdH1cblx0XHRzcGFjZV91c2VyX29yZyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9yZ2FuaXphdGlvbnNcIik/LmZpbmRPbmUoc3Uub3JnYW5pemF0aW9uKVxuXHRcdGlmIHNwYWNlX3VzZXJfb3JnXG5cdFx0XHRVU0VSX0NPTlRFWFQudXNlci5vcmdhbml6YXRpb24gPSB7XG5cdFx0XHRcdF9pZDogc3BhY2VfdXNlcl9vcmcuX2lkLFxuXHRcdFx0XHRuYW1lOiBzcGFjZV91c2VyX29yZy5uYW1lLFxuXHRcdFx0XHRmdWxsbmFtZTogc3BhY2VfdXNlcl9vcmcuZnVsbG5hbWVcblx0XHRcdH1cblx0XHRyZXR1cm4gVVNFUl9DT05URVhUXG5cbkNyZWF0b3IuZ2V0UmVsYXRpdmVVcmwgPSAodXJsKS0+XG5cdGlmIHVybFxuXHRcdCMgdXJs5byA5aS05rKh5pyJXCIvXCLvvIzpnIDopoHmt7vliqBcIi9cIlxuXHRcdGlmICEvXlxcLy8udGVzdCh1cmwpXG5cdFx0XHR1cmwgPSBcIi9cIiArIHVybFxuXHRcdHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYICsgdXJsXG5cdGVsc2Vcblx0XHRyZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWFxuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWQgPSAodXNlcklkLCBzcGFjZUlkKS0+XG5cdHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKClcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0c3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKVxuXHRlbHNlXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJylcblx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtjb21wYW55X2lkOjF9fSlcblx0cmV0dXJuIHN1LmNvbXBhbnlfaWRcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyA9ICh1c2VySWQsIHNwYWNlSWQpLT5cblx0dXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpXG5cdGVsc2Vcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKVxuXHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge2NvbXBhbnlfaWRzOjF9fSlcblx0cmV0dXJuIHN1Py5jb21wYW55X2lkc1xuXG5DcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyA9IChwbyktPlxuXHRpZiBwby5hbGxvd0NyZWF0ZVxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8uYWxsb3dFZGl0XG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0RlbGV0ZVxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLnZpZXdBbGxSZWNvcmRzXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcblx0XHRwby5hbGxvd0RlbGV0ZSA9IHRydWVcblx0XHRwby52aWV3QWxsUmVjb3JkcyA9IHRydWVcblx0aWYgcG8udmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0cG8uYWxsb3dEZWxldGUgPSB0cnVlXG5cdFx0cG8udmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZVxuXHRyZXR1cm4gcG9cblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdGlmIHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVJcblx0XHRDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyID0gcHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUlxuXHRlbHNlXG5cdFx0cGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXHRcdENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwYXRoLnJlc29sdmUocGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwgJy4uLy4uLy4uL2NmcycpKVxuIiwidmFyIEZpYmVyLCBwYXRoO1xuXG5DcmVhdG9yLmRlcHMgPSB7XG4gIGFwcDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeSxcbiAgb2JqZWN0OiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XG59O1xuXG5DcmVhdG9yLl9URU1QTEFURSA9IHtcbiAgQXBwczoge30sXG4gIE9iamVjdHM6IHt9XG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIGZpbHRlcnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xuICBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgb3B0aW9uc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG4gIHJldHVybiBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgY3JlYXRlRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbn0pO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIEZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG4gIENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyA9IGZ1bmN0aW9uKG9iaiwgb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5sb2FkT2JqZWN0cyhvYmosIG9iamVjdF9uYW1lKTtcbiAgICB9KS5ydW4oKTtcbiAgfTtcbn1cblxuQ3JlYXRvci5sb2FkT2JqZWN0cyA9IGZ1bmN0aW9uKG9iaiwgb2JqZWN0X25hbWUpIHtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gb2JqLm5hbWU7XG4gIH1cbiAgaWYgKCFvYmoubGlzdF92aWV3cykge1xuICAgIG9iai5saXN0X3ZpZXdzID0ge307XG4gIH1cbiAgaWYgKG9iai5zcGFjZSkge1xuICAgIG9iamVjdF9uYW1lID0gJ2NfJyArIG9iai5zcGFjZSArICdfJyArIG9iai5uYW1lO1xuICB9XG4gIENyZWF0b3IuY29udmVydE9iamVjdChvYmopO1xuICBuZXcgQ3JlYXRvci5PYmplY3Qob2JqKTtcbiAgQ3JlYXRvci5pbml0VHJpZ2dlcnMob2JqZWN0X25hbWUpO1xuICBDcmVhdG9yLmluaXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpO1xuICByZXR1cm4gb2JqO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3ROYW1lID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3Quc3BhY2UpIHtcbiAgICByZXR1cm4gXCJjX1wiICsgb2JqZWN0LnNwYWNlICsgXCJfXCIgKyBvYmplY3QubmFtZTtcbiAgfVxuICByZXR1cm4gb2JqZWN0Lm5hbWU7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCkge1xuICB2YXIgb2JqLCByZWYsIHJlZjE7XG4gIGlmIChfLmlzQXJyYXkob2JqZWN0X25hbWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoKHJlZiA9IENyZWF0b3IuZGVwcykgIT0gbnVsbCkge1xuICAgICAgaWYgKChyZWYxID0gcmVmLm9iamVjdCkgIT0gbnVsbCkge1xuICAgICAgICByZWYxLmRlcGVuZCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAoIXNwYWNlX2lkICYmIG9iamVjdF9uYW1lKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiAhb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY18nKSkge1xuICAgICAgc3BhY2VfaWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICB9XG4gIGlmIChvYmplY3RfbmFtZSkge1xuICAgIGlmIChzcGFjZV9pZCkge1xuICAgICAgb2JqID0gQ3JlYXRvci5vYmplY3RzQnlOYW1lW1wiY19cIiArIHNwYWNlX2lkICsgXCJfXCIgKyBvYmplY3RfbmFtZV07XG4gICAgICBpZiAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG4gICAgfVxuICAgIG9iaiA9IF8uZmluZChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLl9jb2xsZWN0aW9uX25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgIH0pO1xuICAgIGlmIChvYmopIHtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEJ5SWQgPSBmdW5jdGlvbihvYmplY3RfaWQpIHtcbiAgcmV0dXJuIF8uZmluZFdoZXJlKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwge1xuICAgIF9pZDogb2JqZWN0X2lkXG4gIH0pO1xufTtcblxuQ3JlYXRvci5yZW1vdmVPYmplY3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICBjb25zb2xlLmxvZyhcInJlbW92ZU9iamVjdFwiLCBvYmplY3RfbmFtZSk7XG4gIGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICByZXR1cm4gZGVsZXRlIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV07XG59O1xuXG5DcmVhdG9yLmdldENvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zWyhyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCkpICE9IG51bGwgPyByZWYuX2NvbGxlY3Rpb25fbmFtZSA6IHZvaWQgMF07XG4gIH1cbn07XG5cbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHJldHVybiBkZWxldGUgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV07XG59O1xuXG5DcmVhdG9yLmlzU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgcmVmLCByZWYxLCBzcGFjZTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgc3BhY2UgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3QoXCJzcGFjZXNcIikpICE9IG51bGwgPyAocmVmMSA9IHJlZi5kYikgIT0gbnVsbCA/IHJlZjEuZmluZE9uZShzcGFjZUlkKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgaWYgKHNwYWNlICE9IG51bGwgPyBzcGFjZS5hZG1pbnMgOiB2b2lkIDApIHtcbiAgICByZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKSA+PSAwO1xuICB9XG59O1xuXG5DcmVhdG9yLmV2YWx1YXRlRm9ybXVsYSA9IGZ1bmN0aW9uKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gIGlmICghXy5pc1N0cmluZyhmb3JtdWxhcikpIHtcbiAgICByZXR1cm4gZm9ybXVsYXI7XG4gIH1cbiAgaWYgKENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKSkge1xuICAgIHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbiAgcmV0dXJuIGZvcm11bGFyO1xufTtcblxuQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnMgPSBmdW5jdGlvbihmaWx0ZXJzLCBjb250ZXh0KSB7XG4gIHZhciBzZWxlY3RvcjtcbiAgc2VsZWN0b3IgPSB7fTtcbiAgXy5lYWNoKGZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlcikge1xuICAgIHZhciBhY3Rpb24sIG5hbWUsIHZhbHVlO1xuICAgIGlmICgoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIubGVuZ3RoIDogdm9pZCAwKSA9PT0gMykge1xuICAgICAgbmFtZSA9IGZpbHRlclswXTtcbiAgICAgIGFjdGlvbiA9IGZpbHRlclsxXTtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBjb250ZXh0KTtcbiAgICAgIHNlbGVjdG9yW25hbWVdID0ge307XG4gICAgICByZXR1cm4gc2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlO1xuICAgIH1cbiAgfSk7XG4gIGNvbnNvbGUubG9nKFwiZXZhbHVhdGVGaWx0ZXJzLS0+c2VsZWN0b3JcIiwgc2VsZWN0b3IpO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5DcmVhdG9yLmlzQ29tbW9uU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHJldHVybiBzcGFjZUlkID09PSAnY29tbW9uJztcbn07XG5cblxuLypcblx0ZG9jc++8muW+heaOkuW6j+eahOaWh+aho+aVsOe7hFxuXHRpZHPvvJpfaWTpm4blkIhcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcblx0cmV0dXJuIOaMieeFp2lkc+eahOmhuuW6j+i/lOWbnuaWsOeahOaWh+aho+mbhuWQiFxuICovXG5cbkNyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzID0gZnVuY3Rpb24oZG9jcywgaWRzLCBpZF9rZXksIGhpdF9maXJzdCkge1xuICB2YXIgdmFsdWVzO1xuICBpZiAoIWlkX2tleSkge1xuICAgIGlkX2tleSA9IFwiX2lkXCI7XG4gIH1cbiAgaWYgKGhpdF9maXJzdCkge1xuICAgIHZhbHVlcyA9IGRvY3MuZ2V0UHJvcGVydHkoaWRfa2V5KTtcbiAgICByZXR1cm4gXy5zb3J0QnkoZG9jcywgZnVuY3Rpb24oZG9jKSB7XG4gICAgICB2YXIgX2luZGV4O1xuICAgICAgX2luZGV4ID0gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pO1xuICAgICAgaWYgKF9pbmRleCA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfaW5kZXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaWRzLmxlbmd0aCArIF8uaW5kZXhPZih2YWx1ZXMsIGRvY1tpZF9rZXldKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXy5zb3J0QnkoZG9jcywgZnVuY3Rpb24oZG9jKSB7XG4gICAgICByZXR1cm4gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5cbi8qXG5cdOaMieeUqOaIt+aJgOWxnuacrOWcsOWMluivreiogOi/m+ihjOaOkuW6j++8jOaUr+aMgeS4reaWh+OAgeaVsOWAvOOAgeaXpeacn+etieWtl+auteaOkuW6j1xuXHTlr7nkuo5PYmplY3TnsbvlnovvvIzlpoLmnpzmj5DkvpvkvZznlKjln5/kuK1rZXnlsZ7mgKfvvIzliJnlj5blgLzkuLp2YWx1ZVtrZXld6L+b6KGM5o6S5bqP5q+U6L6D77yM5Y+N5LmL5pW05LiqT2JqZWN0LnRvU3RyaW5nKCnlkI7mjpLluo/mr5TovoNcbiAqL1xuXG5DcmVhdG9yLnNvcnRpbmdNZXRob2QgPSBmdW5jdGlvbih2YWx1ZTEsIHZhbHVlMikge1xuICB2YXIgaXNWYWx1ZTFFbXB0eSwgaXNWYWx1ZTJFbXB0eSwgbG9jYWxlO1xuICBpZiAodGhpcy5rZXkpIHtcbiAgICB2YWx1ZTEgPSB2YWx1ZTFbdGhpcy5rZXldO1xuICAgIHZhbHVlMiA9IHZhbHVlMlt0aGlzLmtleV07XG4gIH1cbiAgaWYgKHZhbHVlMSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICB2YWx1ZTEgPSB2YWx1ZTEuZ2V0VGltZSgpO1xuICB9XG4gIGlmICh2YWx1ZTIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgdmFsdWUyID0gdmFsdWUyLmdldFRpbWUoKTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlMSA9PT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgdmFsdWUyID09PSBcIm51bWJlclwiKSB7XG4gICAgcmV0dXJuIHZhbHVlMSAtIHZhbHVlMjtcbiAgfVxuICBpc1ZhbHVlMUVtcHR5ID0gdmFsdWUxID09PSBudWxsIHx8IHZhbHVlMSA9PT0gdm9pZCAwO1xuICBpc1ZhbHVlMkVtcHR5ID0gdmFsdWUyID09PSBudWxsIHx8IHZhbHVlMiA9PT0gdm9pZCAwO1xuICBpZiAoaXNWYWx1ZTFFbXB0eSAmJiAhaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBpZiAoaXNWYWx1ZTFFbXB0eSAmJiBpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgaWYgKCFpc1ZhbHVlMUVtcHR5ICYmIGlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpO1xuICByZXR1cm4gdmFsdWUxLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZSh2YWx1ZTIudG9TdHJpbmcoKSwgbG9jYWxlKTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgcGVybWlzc2lvbnMsIHJlbGF0ZWRfb2JqZWN0cztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gIH1cbiAgcmVsYXRlZF9vYmplY3RzID0gW107XG4gIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICBpZiAoIV9vYmplY3QpIHtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9maWxlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImNtc19maWxlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicGFyZW50XCJcbiAgICB9KTtcbiAgfVxuICBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfLmVhY2gocmVsYXRlZF9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgIGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSkge1xuICAgICAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJvYmplY3RfZmllbGRzXCIpIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzLnNwbGljZSgwLCAwLCB7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIGlmIChfb2JqZWN0LmVuYWJsZV90YXNrcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcInRhc2tzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfbm90ZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJub3Rlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2V2ZW50cykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImV2ZW50c1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2luc3RhbmNlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2FwcHJvdmFscykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImFwcHJvdmFsc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSk7XG4gICAgaWYgKF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIChwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMCkpIHtcbiAgICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiYXVkaXRfcmVjb3Jkc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29udGV4dCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgaXNVblNhZmVNb2RlKSB7XG4gIHZhciBVU0VSX0NPTlRFWFQsIHJlZiwgc3BhY2VfdXNlcl9vcmcsIHN1LCBzdUZpZWxkcztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHJldHVybiBDcmVhdG9yLlVTRVJfQ09OVEVYVDtcbiAgfSBlbHNlIHtcbiAgICBpZiAoISh1c2VySWQgJiYgc3BhY2VJZCkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcInRoZSBwYXJhbXMgdXNlcklkIGFuZCBzcGFjZUlkIGlzIHJlcXVpcmVkIGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRVc2VyQ29udGV4dFwiKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBzdUZpZWxkcyA9IHtcbiAgICAgIG5hbWU6IDEsXG4gICAgICBtb2JpbGU6IDEsXG4gICAgICBwb3NpdGlvbjogMSxcbiAgICAgIGVtYWlsOiAxLFxuICAgICAgY29tcGFueTogMSxcbiAgICAgIG9yZ2FuaXphdGlvbjogMSxcbiAgICAgIHNwYWNlOiAxLFxuICAgICAgY29tcGFueV9pZDogMSxcbiAgICAgIGNvbXBhbnlfaWRzOiAxXG4gICAgfTtcbiAgICBzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgdXNlcjogdXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiBzdUZpZWxkc1xuICAgIH0pO1xuICAgIGlmICghc3UpIHtcbiAgICAgIHNwYWNlSWQgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIGlmIChpc1VuU2FmZU1vZGUpIHtcbiAgICAgICAgc3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHN1RmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXN1KSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3BhY2VJZCA9IHN1LnNwYWNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIFVTRVJfQ09OVEVYVCA9IHt9O1xuICAgIFVTRVJfQ09OVEVYVC51c2VySWQgPSB1c2VySWQ7XG4gICAgVVNFUl9DT05URVhULnNwYWNlSWQgPSBzcGFjZUlkO1xuICAgIFVTRVJfQ09OVEVYVC51c2VyID0ge1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBuYW1lOiBzdS5uYW1lLFxuICAgICAgbW9iaWxlOiBzdS5tb2JpbGUsXG4gICAgICBwb3NpdGlvbjogc3UucG9zaXRpb24sXG4gICAgICBlbWFpbDogc3UuZW1haWwsXG4gICAgICBjb21wYW55OiBzdS5jb21wYW55LFxuICAgICAgY29tcGFueV9pZDogc3UuY29tcGFueV9pZCxcbiAgICAgIGNvbXBhbnlfaWRzOiBzdS5jb21wYW55X2lkc1xuICAgIH07XG4gICAgc3BhY2VfdXNlcl9vcmcgPSAocmVmID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib3JnYW5pemF0aW9uc1wiKSkgIT0gbnVsbCA/IHJlZi5maW5kT25lKHN1Lm9yZ2FuaXphdGlvbikgOiB2b2lkIDA7XG4gICAgaWYgKHNwYWNlX3VzZXJfb3JnKSB7XG4gICAgICBVU0VSX0NPTlRFWFQudXNlci5vcmdhbml6YXRpb24gPSB7XG4gICAgICAgIF9pZDogc3BhY2VfdXNlcl9vcmcuX2lkLFxuICAgICAgICBuYW1lOiBzcGFjZV91c2VyX29yZy5uYW1lLFxuICAgICAgICBmdWxsbmFtZTogc3BhY2VfdXNlcl9vcmcuZnVsbG5hbWVcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBVU0VSX0NPTlRFWFQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRpdmVVcmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgaWYgKHVybCkge1xuICAgIGlmICghL15cXC8vLnRlc3QodXJsKSkge1xuICAgICAgdXJsID0gXCIvXCIgKyB1cmw7XG4gICAgfVxuICAgIHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYICsgdXJsO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWQgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIHN1O1xuICB1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJyk7XG4gICAgfVxuICB9XG4gIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjb21wYW55X2lkOiAxXG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHN1LmNvbXBhbnlfaWQ7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWRzID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBzdTtcbiAgdXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJyk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpO1xuICAgIH1cbiAgfVxuICBzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICB1c2VyOiB1c2VySWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY29tcGFueV9pZHM6IDFcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3UgIT0gbnVsbCA/IHN1LmNvbXBhbnlfaWRzIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgPSBmdW5jdGlvbihwbykge1xuICBpZiAocG8uYWxsb3dDcmVhdGUpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0VkaXQpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0RlbGV0ZSkge1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0FsbFJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93RGVsZXRlID0gdHJ1ZTtcbiAgICBwby52aWV3QWxsUmVjb3JkcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93RGVsZXRlID0gdHJ1ZTtcbiAgICBwby52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlO1xuICB9XG4gIHJldHVybiBwbztcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgaWYgKHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVIpIHtcbiAgICBDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyID0gcHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUjtcbiAgfSBlbHNlIHtcbiAgICBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICAgIENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwYXRoLnJlc29sdmUocGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwgJy4uLy4uLy4uL2NmcycpKTtcbiAgfVxufVxuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHQjIOeUqOaIt+iOt+WPlmxvb2t1cCDjgIFtYXN0ZXJfZGV0YWls57G75Z6L5a2X5q6155qE6YCJ6aG55YC8XHJcblx0XCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI6IChvcHRpb25zKS0+XHJcblx0XHRpZiBvcHRpb25zPy5wYXJhbXM/LnJlZmVyZW5jZV90b1xyXG5cclxuXHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob3B0aW9ucy5wYXJhbXMucmVmZXJlbmNlX3RvLCBvcHRpb25zLnBhcmFtcy5zcGFjZSlcclxuXHJcblx0XHRcdG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZXHJcblxyXG5cdFx0XHRxdWVyeSA9IHt9XHJcblx0XHRcdGlmIG9wdGlvbnMucGFyYW1zLnNwYWNlXHJcblx0XHRcdFx0cXVlcnkuc3BhY2UgPSBvcHRpb25zLnBhcmFtcy5zcGFjZVxyXG5cclxuXHRcdFx0XHRzb3J0ID0gb3B0aW9ucz8uc29ydFxyXG5cclxuXHRcdFx0XHRzZWxlY3RlZCA9IG9wdGlvbnM/LnNlbGVjdGVkIHx8IFtdXHJcblxyXG5cdFx0XHRcdG9wdGlvbnNfbGltaXQgPSBvcHRpb25zPy5vcHRpb25zX2xpbWl0IHx8IDEwXHJcblxyXG5cdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxyXG5cdFx0XHRcdFx0c2VhcmNoVGV4dFF1ZXJ5ID0ge31cclxuXHRcdFx0XHRcdHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7JHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHR9XHJcblxyXG5cdFx0XHRcdGlmIG9wdGlvbnM/LnZhbHVlcz8ubGVuZ3RoXHJcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcclxuXHRcdFx0XHRcdFx0cXVlcnkuJG9yID0gW3tfaWQ6IHskaW46IG9wdGlvbnMudmFsdWVzfX0sIHNlYXJjaFRleHRRdWVyeV1cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0cXVlcnkuJG9yID0gW3tfaWQ6IHskaW46IG9wdGlvbnMudmFsdWVzfX1dXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0aWYgb3B0aW9ucy5zZWFyY2hUZXh0XHJcblx0XHRcdFx0XHRcdF8uZXh0ZW5kKHF1ZXJ5LCBzZWFyY2hUZXh0UXVlcnkpXHJcblx0XHRcdFx0XHRxdWVyeS5faWQgPSB7JG5pbjogc2VsZWN0ZWR9XHJcblxyXG5cdFx0XHRcdGNvbGxlY3Rpb24gPSBvYmplY3QuZGJcclxuXHJcblx0XHRcdFx0aWYgb3B0aW9ucy5maWx0ZXJRdWVyeVxyXG5cdFx0XHRcdFx0Xy5leHRlbmQgcXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnlcclxuXHJcblx0XHRcdFx0cXVlcnlfb3B0aW9ucyA9IHtsaW1pdDogb3B0aW9uc19saW1pdH1cclxuXHJcblx0XHRcdFx0aWYgc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpXHJcblx0XHRcdFx0XHRxdWVyeV9vcHRpb25zLnNvcnQgPSBzb3J0XHJcblxyXG5cdFx0XHRcdGlmIGNvbGxlY3Rpb25cclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRyZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpXHJcblx0XHRcdFx0XHRcdHJlc3VsdHMgPSBbXVxyXG5cdFx0XHRcdFx0XHRfLmVhY2ggcmVjb3JkcywgKHJlY29yZCktPlxyXG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaFxyXG5cdFx0XHRcdFx0XHRcdFx0bGFiZWw6IHJlY29yZFtuYW1lX2ZpZWxkX2tleV1cclxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlOiByZWNvcmQuX2lkXHJcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzXHJcblx0XHRcdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBlLm1lc3NhZ2UgKyBcIi0tPlwiICsgSlNPTi5zdHJpbmdpZnkob3B0aW9ucylcclxuXHRcdHJldHVybiBbXSAiLCJNZXRlb3IubWV0aG9kcyh7XG4gIFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGUsIG5hbWVfZmllbGRfa2V5LCBvYmplY3QsIG9wdGlvbnNfbGltaXQsIHF1ZXJ5LCBxdWVyeV9vcHRpb25zLCByZWNvcmRzLCByZWYsIHJlZjEsIHJlc3VsdHMsIHNlYXJjaFRleHRRdWVyeSwgc2VsZWN0ZWQsIHNvcnQ7XG4gICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYgPSBvcHRpb25zLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5yZWZlcmVuY2VfdG8gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9wdGlvbnMucGFyYW1zLnJlZmVyZW5jZV90bywgb3B0aW9ucy5wYXJhbXMuc3BhY2UpO1xuICAgICAgbmFtZV9maWVsZF9rZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVk7XG4gICAgICBxdWVyeSA9IHt9O1xuICAgICAgaWYgKG9wdGlvbnMucGFyYW1zLnNwYWNlKSB7XG4gICAgICAgIHF1ZXJ5LnNwYWNlID0gb3B0aW9ucy5wYXJhbXMuc3BhY2U7XG4gICAgICAgIHNvcnQgPSBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNvcnQgOiB2b2lkIDA7XG4gICAgICAgIHNlbGVjdGVkID0gKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc2VsZWN0ZWQgOiB2b2lkIDApIHx8IFtdO1xuICAgICAgICBvcHRpb25zX2xpbWl0ID0gKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMub3B0aW9uc19saW1pdCA6IHZvaWQgMCkgfHwgMTA7XG4gICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICBzZWFyY2hUZXh0UXVlcnkgPSB7fTtcbiAgICAgICAgICBzZWFyY2hUZXh0UXVlcnlbbmFtZV9maWVsZF9rZXldID0ge1xuICAgICAgICAgICAgJHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zICE9IG51bGwgPyAocmVmMSA9IG9wdGlvbnMudmFsdWVzKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sIHNlYXJjaFRleHRRdWVyeVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcXVlcnkuJG9yID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAkaW46IG9wdGlvbnMudmFsdWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgc2VhcmNoVGV4dFF1ZXJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcXVlcnkuX2lkID0ge1xuICAgICAgICAgICAgJG5pbjogc2VsZWN0ZWRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbGxlY3Rpb24gPSBvYmplY3QuZGI7XG4gICAgICAgIGlmIChvcHRpb25zLmZpbHRlclF1ZXJ5KSB7XG4gICAgICAgICAgXy5leHRlbmQocXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnkpO1xuICAgICAgICB9XG4gICAgICAgIHF1ZXJ5X29wdGlvbnMgPSB7XG4gICAgICAgICAgbGltaXQ6IG9wdGlvbnNfbGltaXRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHNvcnQgJiYgXy5pc09iamVjdChzb3J0KSkge1xuICAgICAgICAgIHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVjb3JkcyA9IGNvbGxlY3Rpb24uZmluZChxdWVyeSwgcXVlcnlfb3B0aW9ucykuZmV0Y2goKTtcbiAgICAgICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgIF8uZWFjaChyZWNvcmRzLCBmdW5jdGlvbihyZWNvcmQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICAgICAgbGFiZWw6IHJlY29yZFtuYW1lX2ZpZWxkX2tleV0sXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5faWRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgZS5tZXNzYWdlICsgXCItLT5cIiArIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvd29ya2Zsb3cvdmlldy86aW5zdGFuY2VJZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHR0cnlcclxuXHRcdGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSlcclxuXHRcdGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZFxyXG5cclxuXHRcdGhhc2hEYXRhID0gcmVxLmJvZHlcclxuXHRcdG9iamVjdF9uYW1lID0gaGFzaERhdGEub2JqZWN0X25hbWVcclxuXHRcdHJlY29yZF9pZCA9IGhhc2hEYXRhLnJlY29yZF9pZFxyXG5cdFx0c3BhY2VfaWQgPSBoYXNoRGF0YS5zcGFjZV9pZFxyXG5cclxuXHRcdGNoZWNrIG9iamVjdF9uYW1lLCBTdHJpbmdcclxuXHRcdGNoZWNrIHJlY29yZF9pZCwgU3RyaW5nXHJcblx0XHRjaGVjayBzcGFjZV9pZCwgU3RyaW5nXHJcblxyXG5cdFx0aW5zSWQgPSByZXEucGFyYW1zLmluc3RhbmNlSWRcclxuXHRcdHhfdXNlcl9pZCA9IHJlcS5xdWVyeVsnWC1Vc2VyLUlkJ11cclxuXHRcdHhfYXV0aF90b2tlbiA9IHJlcS5xdWVyeVsnWC1BdXRoLVRva2VuJ11cclxuXHJcblx0XHRyZWRpcmVjdF91cmwgPSBcIi9cIlxyXG5cdFx0aW5zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS5maW5kT25lKGluc0lkKVxyXG5cdFx0IyAtIOaIkeeahOiNieeov+Wwsei3s+i9rOiHs+iNieeov+eusVxyXG5cdFx0IyAtIOaIkeeahOW+heWuoeaguOWwsei3s+i9rOiHs+W+heWuoeaguFxyXG5cdFx0IyAtIOS4jeaYr+aIkeeahOeUs+ivt+WNleWImei3s+i9rOiHs+aJk+WNsOmhtemdolxyXG5cdFx0IyAtIOWmgueUs+ivt+WNleS4jeWtmOWcqOWImeaPkOekuueUqOaIt+eUs+ivt+WNleW3suWIoOmZpO+8jOW5tuS4lOabtOaWsHJlY29yZOeahOeKtuaAge+8jOS9v+eUqOaIt+WPr+S7pemHjeaWsOWPkei1t+WuoeaJuVxyXG5cdFx0aWYgaW5zXHJcblx0XHRcdHdvcmtmbG93VXJsID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy53b3JrZmxvdy51cmxcclxuXHRcdFx0Ym94ID0gJydcclxuXHRcdFx0c3BhY2VJZCA9IGlucy5zcGFjZVxyXG5cdFx0XHRmbG93SWQgPSBpbnMuZmxvd1xyXG5cclxuXHRcdFx0aWYgKGlucy5pbmJveF91c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkKSBvciAoaW5zLmNjX3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWQpXHJcblx0XHRcdFx0Ym94ID0gJ2luYm94J1xyXG5cdFx0XHRlbHNlIGlmIGlucy5vdXRib3hfdXNlcnM/LmluY2x1ZGVzIGN1cnJlbnRfdXNlcl9pZFxyXG5cdFx0XHRcdGJveCA9ICdvdXRib3gnXHJcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdkcmFmdCcgYW5kIGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkXHJcblx0XHRcdFx0Ym94ID0gJ2RyYWZ0J1xyXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAncGVuZGluZycgYW5kIChpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZCBvciBpbnMuYXBwbGljYW50IGlzIGN1cnJlbnRfdXNlcl9pZClcclxuXHRcdFx0XHRib3ggPSAncGVuZGluZydcclxuXHRcdFx0ZWxzZSBpZiBpbnMuc3RhdGUgaXMgJ2NvbXBsZXRlZCcgYW5kIGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkXHJcblx0XHRcdFx0Ym94ID0gJ2NvbXBsZXRlZCdcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdCMg6aqM6K+BbG9naW4gdXNlcl9pZOWvueivpea1geeoi+acieeuoeeQhueUs+ivt+WNleeahOadg+mZkFxyXG5cdFx0XHRcdHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dJZCwgY3VycmVudF91c2VyX2lkKVxyXG5cdFx0XHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCwgeyBmaWVsZHM6IHsgYWRtaW5zOiAxIH0gfSlcclxuXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkbWluXCIpIG9yIHNwYWNlLmFkbWlucy5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpXHJcblx0XHRcdFx0XHRib3ggPSAnbW9uaXRvcidcclxuXHJcblx0XHRcdGlmIGJveFxyXG5cdFx0XHRcdHJlZGlyZWN0X3VybCA9IHdvcmtmbG93VXJsICsgXCJ3b3JrZmxvdy9zcGFjZS8je3NwYWNlSWR9LyN7Ym94fS8je2luc0lkfT9YLVVzZXItSWQ9I3t4X3VzZXJfaWR9JlgtQXV0aC1Ub2tlbj0je3hfYXV0aF90b2tlbn1cIlxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmVkaXJlY3RfdXJsID0gd29ya2Zsb3dVcmwgKyBcIndvcmtmbG93L3NwYWNlLyN7c3BhY2VJZH0vcHJpbnQvI3tpbnNJZH0/Ym94PW1vbml0b3ImcHJpbnRfaXNfc2hvd190cmFjZXM9MSZwcmludF9pc19zaG93X2F0dGFjaG1lbnRzPTEmWC1Vc2VyLUlkPSN7eF91c2VyX2lkfSZYLUF1dGgtVG9rZW49I3t4X2F1dGhfdG9rZW59XCJcclxuXHJcblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0XHRkYXRhOiB7IHJlZGlyZWN0X3VybDogcmVkaXJlY3RfdXJsIH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdGVsc2VcclxuXHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpXHJcblx0XHRcdGlmIGNvbGxlY3Rpb25cclxuXHRcdFx0XHRjb2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRfaWQsIHtcclxuXHRcdFx0XHRcdCRwdWxsOiB7XHJcblx0XHRcdFx0XHRcdFwiaW5zdGFuY2VzXCI6IHtcclxuXHRcdFx0XHRcdFx0XHRcIl9pZFwiOiBpbnNJZFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3InLCAn55Sz6K+35Y2V5bey5Yig6ZmkJylcclxuXHJcblx0Y2F0Y2ggZVxyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0ZGF0YTogeyBlcnJvcnM6IFt7IGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlIH1dIH1cclxuXHRcdH1cclxuXHJcbiIsIkpzb25Sb3V0ZXMuYWRkKCdwb3N0JywgJy9hcGkvd29ya2Zsb3cvdmlldy86aW5zdGFuY2VJZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBib3gsIGNvbGxlY3Rpb24sIGN1cnJlbnRfdXNlcl9pZCwgY3VycmVudF91c2VyX2luZm8sIGUsIGZsb3dJZCwgaGFzaERhdGEsIGlucywgaW5zSWQsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9ucywgcmVjb3JkX2lkLCByZWRpcmVjdF91cmwsIHJlZiwgcmVmMSwgcmVmMiwgc3BhY2UsIHNwYWNlSWQsIHNwYWNlX2lkLCB3b3JrZmxvd1VybCwgeF9hdXRoX3Rva2VuLCB4X3VzZXJfaWQ7XG4gIHRyeSB7XG4gICAgY3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKTtcbiAgICBjdXJyZW50X3VzZXJfaWQgPSBjdXJyZW50X3VzZXJfaW5mby5faWQ7XG4gICAgaGFzaERhdGEgPSByZXEuYm9keTtcbiAgICBvYmplY3RfbmFtZSA9IGhhc2hEYXRhLm9iamVjdF9uYW1lO1xuICAgIHJlY29yZF9pZCA9IGhhc2hEYXRhLnJlY29yZF9pZDtcbiAgICBzcGFjZV9pZCA9IGhhc2hEYXRhLnNwYWNlX2lkO1xuICAgIGNoZWNrKG9iamVjdF9uYW1lLCBTdHJpbmcpO1xuICAgIGNoZWNrKHJlY29yZF9pZCwgU3RyaW5nKTtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICBpbnNJZCA9IHJlcS5wYXJhbXMuaW5zdGFuY2VJZDtcbiAgICB4X3VzZXJfaWQgPSByZXEucXVlcnlbJ1gtVXNlci1JZCddO1xuICAgIHhfYXV0aF90b2tlbiA9IHJlcS5xdWVyeVsnWC1BdXRoLVRva2VuJ107XG4gICAgcmVkaXJlY3RfdXJsID0gXCIvXCI7XG4gICAgaW5zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS5maW5kT25lKGluc0lkKTtcbiAgICBpZiAoaW5zKSB7XG4gICAgICB3b3JrZmxvd1VybCA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy53b3JrZmxvdy51cmw7XG4gICAgICBib3ggPSAnJztcbiAgICAgIHNwYWNlSWQgPSBpbnMuc3BhY2U7XG4gICAgICBmbG93SWQgPSBpbnMuZmxvdztcbiAgICAgIGlmICgoKHJlZiA9IGlucy5pbmJveF91c2VycykgIT0gbnVsbCA/IHJlZi5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSB8fCAoKHJlZjEgPSBpbnMuY2NfdXNlcnMpICE9IG51bGwgPyByZWYxLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApKSB7XG4gICAgICAgIGJveCA9ICdpbmJveCc7XG4gICAgICB9IGVsc2UgaWYgKChyZWYyID0gaW5zLm91dGJveF91c2VycykgIT0gbnVsbCA/IHJlZjIuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkge1xuICAgICAgICBib3ggPSAnb3V0Ym94JztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAnZHJhZnQnICYmIGlucy5zdWJtaXR0ZXIgPT09IGN1cnJlbnRfdXNlcl9pZCkge1xuICAgICAgICBib3ggPSAnZHJhZnQnO1xuICAgICAgfSBlbHNlIGlmIChpbnMuc3RhdGUgPT09ICdwZW5kaW5nJyAmJiAoaW5zLnN1Ym1pdHRlciA9PT0gY3VycmVudF91c2VyX2lkIHx8IGlucy5hcHBsaWNhbnQgPT09IGN1cnJlbnRfdXNlcl9pZCkpIHtcbiAgICAgICAgYm94ID0gJ3BlbmRpbmcnO1xuICAgICAgfSBlbHNlIGlmIChpbnMuc3RhdGUgPT09ICdjb21wbGV0ZWQnICYmIGlucy5zdWJtaXR0ZXIgPT09IGN1cnJlbnRfdXNlcl9pZCkge1xuICAgICAgICBib3ggPSAnY29tcGxldGVkJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dJZCwgY3VycmVudF91c2VyX2lkKTtcbiAgICAgICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkLCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBhZG1pbnM6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZG1pblwiKSB8fCBzcGFjZS5hZG1pbnMuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSkge1xuICAgICAgICAgIGJveCA9ICdtb25pdG9yJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGJveCkge1xuICAgICAgICByZWRpcmVjdF91cmwgPSB3b3JrZmxvd1VybCArIChcIndvcmtmbG93L3NwYWNlL1wiICsgc3BhY2VJZCArIFwiL1wiICsgYm94ICsgXCIvXCIgKyBpbnNJZCArIFwiP1gtVXNlci1JZD1cIiArIHhfdXNlcl9pZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIHhfYXV0aF90b2tlbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWRpcmVjdF91cmwgPSB3b3JrZmxvd1VybCArIChcIndvcmtmbG93L3NwYWNlL1wiICsgc3BhY2VJZCArIFwiL3ByaW50L1wiICsgaW5zSWQgKyBcIj9ib3g9bW9uaXRvciZwcmludF9pc19zaG93X3RyYWNlcz0xJnByaW50X2lzX3Nob3dfYXR0YWNobWVudHM9MSZYLVVzZXItSWQ9XCIgKyB4X3VzZXJfaWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyB4X2F1dGhfdG9rZW4pO1xuICAgICAgfVxuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICByZWRpcmVjdF91cmw6IHJlZGlyZWN0X3VybFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpO1xuICAgICAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgY29sbGVjdGlvbi51cGRhdGUocmVjb3JkX2lkLCB7XG4gICAgICAgICAgJHB1bGw6IHtcbiAgICAgICAgICAgIFwiaW5zdGFuY2VzXCI6IHtcbiAgICAgICAgICAgICAgXCJfaWRcIjogaW5zSWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvcicsICfnlLPor7fljZXlt7LliKDpmaQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRJbml0V2lkdGhQZXJjZW50ID0gKG9iamVjdF9uYW1lLCBjb2x1bW5zKSAtPlxyXG5cdF9zY2hlbWEgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSk/Ll9zY2hlbWFcclxuXHRjb2x1bW5fbnVtID0gMFxyXG5cdGlmIF9zY2hlbWFcclxuXHRcdF8uZWFjaCBjb2x1bW5zLCAoZmllbGRfbmFtZSkgLT5cclxuXHRcdFx0ZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSlcclxuXHRcdFx0aXNfd2lkZSA9IGZpZWxkW2ZpZWxkX25hbWVdPy5hdXRvZm9ybT8uaXNfd2lkZVxyXG5cdFx0XHRpZiBpc193aWRlXHJcblx0XHRcdFx0Y29sdW1uX251bSArPSAyXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRjb2x1bW5fbnVtICs9IDFcclxuXHJcblx0XHRpbml0X3dpZHRoX3BlcmNlbnQgPSAxMDAgLyBjb2x1bW5fbnVtXHJcblx0XHRyZXR1cm4gaW5pdF93aWR0aF9wZXJjZW50XHJcblxyXG5DcmVhdG9yLmdldEZpZWxkSXNXaWRlID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lKSAtPlxyXG5cdF9zY2hlbWEgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSkuX3NjaGVtYVxyXG5cdGlmIF9zY2hlbWFcclxuXHRcdGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpXHJcblx0XHRpc193aWRlID0gZmllbGRbZmllbGRfbmFtZV0/LmF1dG9mb3JtPy5pc193aWRlXHJcblx0XHRyZXR1cm4gaXNfd2lkZVxyXG5cclxuQ3JlYXRvci5nZXRUYWJ1bGFyT3JkZXIgPSAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1ucykgLT5cclxuXHRzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucz8uc2V0dGluZ3M/LmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIn0pXHJcblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0Y29sdW1ucyA9IF8ubWFwIGNvbHVtbnMsIChjb2x1bW4pLT5cclxuXHRcdGZpZWxkID0gb2JqLmZpZWxkc1tjb2x1bW5dXHJcblx0XHRpZiBmaWVsZD8udHlwZSBhbmQgIWZpZWxkLmhpZGRlblxyXG5cdFx0XHRyZXR1cm4gY29sdW1uXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcclxuXHRjb2x1bW5zID0gXy5jb21wYWN0IGNvbHVtbnNcclxuXHRpZiBzZXR0aW5nIGFuZCBzZXR0aW5nLnNldHRpbmdzXHJcblx0XHRzb3J0ID0gc2V0dGluZy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdPy5zb3J0IHx8IFtdXHJcblx0XHRzb3J0ID0gXy5tYXAgc29ydCwgKG9yZGVyKS0+XHJcblx0XHRcdGtleSA9IG9yZGVyWzBdXHJcblx0XHRcdGluZGV4ID0gXy5pbmRleE9mKGNvbHVtbnMsIGtleSlcclxuXHRcdFx0b3JkZXJbMF0gPSBpbmRleCArIDFcclxuXHRcdFx0cmV0dXJuIG9yZGVyXHJcblx0XHRyZXR1cm4gc29ydFxyXG5cdHJldHVybiBbXVxyXG5cclxuXHJcbkNyZWF0b3IuaW5pdExpc3RWaWV3cyA9IChvYmplY3RfbmFtZSktPlxyXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXHJcblx0ZXh0cmFfY29sdW1ucyA9IFtcIm93bmVyXCJdXHJcblx0ZGVmYXVsdF9leHRyYV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJvd25lclwiXVxyXG5cdGlmIGRlZmF1bHRfZXh0cmFfY29sdW1uc1xyXG5cdFx0ZXh0cmFfY29sdW1ucyA9IF8udW5pb24gZXh0cmFfY29sdW1ucywgZGVmYXVsdF9leHRyYV9jb2x1bW5zXHJcblxyXG5cdG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChvYmplY3RfbmFtZSkgfHwgW11cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzP1tvYmplY3RfbmFtZV0gPSBbXVxyXG5cclxuQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcgPSAoZGVmYXVsdF9jb2x1bWVucywgbGlzdF92aWV3LCBsaXN0X3ZpZXdfbmFtZSktPlxyXG5cdG9pdGVtID0gXy5jbG9uZShsaXN0X3ZpZXcpXHJcblx0aWYgIV8uaGFzKG9pdGVtLCBcIm5hbWVcIilcclxuXHRcdG9pdGVtLm5hbWUgPSBsaXN0X3ZpZXdfbmFtZVxyXG5cdGlmICFvaXRlbS5jb2x1bW5zXHJcblx0XHRpZiBkZWZhdWx0X2NvbHVtZW5zXHJcblx0XHRcdG9pdGVtLmNvbHVtbnMgPSBkZWZhdWx0X2NvbHVtZW5zXHJcblx0aWYgIW9pdGVtLmNvbHVtbnNcclxuXHRcdG9pdGVtLmNvbHVtbnMgPSBbXCJuYW1lXCJdXHJcblx0aWYgIW9pdGVtLmZpbHRlcl9zY29wZVxyXG5cdFx0IyBsaXN0dmlld+inhuWbvueahGZpbHRlcl9zY29wZem7mOiupOWAvOaUueS4unNwYWNlICMxMzFcclxuXHRcdG9pdGVtLmZpbHRlcl9zY29wZSA9IFwic3BhY2VcIlxyXG5cclxuXHRpZiAhXy5oYXMob2l0ZW0sIFwiX2lkXCIpXHJcblx0XHRvaXRlbS5faWQgPSBsaXN0X3ZpZXdfbmFtZVxyXG5cdGVsc2VcclxuXHRcdG9pdGVtLmxhYmVsID0gb2l0ZW0ubGFiZWwgfHwgbGlzdF92aWV3Lm5hbWVcclxuXHJcblx0aWYgXy5pc1N0cmluZyhvaXRlbS5vcHRpb25zKVxyXG5cdFx0b2l0ZW0ub3B0aW9ucyA9IEpTT04ucGFyc2Uob2l0ZW0ub3B0aW9ucylcclxuXHJcblx0Xy5mb3JFYWNoIG9pdGVtLmZpbHRlcnMsIChmaWx0ZXIsIF9pbmRleCktPlxyXG5cdFx0aWYgIV8uaXNBcnJheShmaWx0ZXIpICYmIF8uaXNPYmplY3QoZmlsdGVyKVxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oZmlsdGVyPy52YWx1ZSlcclxuXHRcdFx0XHRcdGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWx0ZXI/Ll92YWx1ZSlcclxuXHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlci5fdmFsdWV9KVwiKVxyXG5cdHJldHVybiBvaXRlbVxyXG5cclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG5cdENyZWF0b3IuZ2V0UmVsYXRlZExpc3QgPSAob2JqZWN0X25hbWUpLT5cclxuXHRcdGxpc3QgPSBbXVxyXG5cdFx0cmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSlcclxuXHJcblx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3RzLCAocmVsYXRlZF9vYmplY3RfaXRlbSkgLT5cclxuXHRcdFx0cmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ub2JqZWN0X25hbWVcclxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5mb3JlaWduX2tleVxyXG5cdFx0XHRyZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXHJcblx0XHRcdHVubGVzcyByZWxhdGVkX29iamVjdFxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXHJcblx0XHRcdGNvbHVtbnMgPSBfLndpdGhvdXQoY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxyXG5cclxuXHRcdFx0b3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXHJcblx0XHRcdHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpXHJcblxyXG5cdFx0XHRpZiAvXFx3K1xcLlxcJFxcLlxcdysvZy50ZXN0KHJlbGF0ZWRfZmllbGRfbmFtZSlcclxuXHRcdFx0XHQjIG9iamVjdOexu+Wei+W4puWtkOWxnuaAp+eahHJlbGF0ZWRfZmllbGRfbmFtZeimgeWOu+aOieS4remXtOeahOe+juWFg+espuWPt++8jOWQpuWImeaYvuekuuS4jeWHuuWtl+auteWAvFxyXG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfZmllbGRfbmFtZS5yZXBsYWNlKC9cXCRcXC4vLFwiXCIpXHJcblx0XHRcdHJlbGF0ZWQgPVxyXG5cdFx0XHRcdG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lXHJcblx0XHRcdFx0Y29sdW1uczogY29sdW1uc1xyXG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lXHJcblx0XHRcdFx0aXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXHJcblxyXG5cdFx0XHRsaXN0LnB1c2ggcmVsYXRlZFxyXG5cclxuXHRcdHJldHVybiBsaXN0XHJcblxyXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcgPSAob2JqZWN0X25hbWUpLT5cclxuXHRyZXR1cm4gXy5maXJzdChDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSkpXHJcblxyXG4jIyMgXHJcblx05Y+W5Ye6bGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+77yM5aaC5p6c5LiN5a2Y5Zyo5oiW6ICF5rKh5pyJ5p2D6ZmQ77yM5bCx6L+U5Zue56ys5LiA5Liq6KeG5Zu+XHJcblx0ZXhhY+S4unRydWXml7bvvIzpnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzkuI3pu5jorqTov5Tlm57nrKzkuIDkuKrop4blm75cclxuIyMjXHJcbkNyZWF0b3IuZ2V0TGlzdFZpZXcgPSAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZXhhYyktPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cdFx0aWYgIWxpc3Rfdmlld19pZFxyXG5cdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxyXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGlmICFvYmplY3RcclxuXHRcdHJldHVyblxyXG5cdGxpc3RWaWV3cyA9IENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKVxyXG5cdHVubGVzcyBsaXN0Vmlld3M/Lmxlbmd0aFxyXG5cdFx0cmV0dXJuXHJcblx0bGlzdF92aWV3ID0gXy5maW5kV2hlcmUobGlzdFZpZXdzLHtcIl9pZFwiOmxpc3Rfdmlld19pZH0pXHJcblx0dW5sZXNzIGxpc3Rfdmlld1xyXG5cdFx0IyDlpoLmnpzkuI3pnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzliJnpu5jorqTov5Tlm57nrKzkuIDkuKrop4blm77vvIzlj43kuYvov5Tlm57nqbpcclxuXHRcdGlmIGV4YWNcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRlbHNlXHJcblx0XHRcdGxpc3RfdmlldyA9IGxpc3RWaWV3c1swXVxyXG5cdHJldHVybiBsaXN0X3ZpZXdcclxuXHJcbiPojrflj5ZsaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77mmK/lkKbmmK/mnIDov5Hmn6XnnIvop4blm75cclxuQ3JlYXRvci5nZXRMaXN0Vmlld0lzUmVjZW50ID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFsaXN0X3ZpZXdfaWRcclxuXHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcclxuXHRpZiB0eXBlb2YobGlzdF92aWV3X2lkKSA9PSBcInN0cmluZ1wiXHJcblx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRcdGlmICFvYmplY3RcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRsaXN0VmlldyA9IF8uZmluZFdoZXJlKG9iamVjdC5saXN0X3ZpZXdzLHtfaWQ6IGxpc3Rfdmlld19pZH0pXHJcblx0ZWxzZVxyXG5cdFx0bGlzdFZpZXcgPSBsaXN0X3ZpZXdfaWRcclxuXHRyZXR1cm4gbGlzdFZpZXc/Lm5hbWUgPT0gXCJyZWNlbnRcIlxyXG5cclxuXHJcbiMjI1xyXG4gICAg6I635Y+W6buY6K6k6KeG5Zu+XHJcbiMjI1xyXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0aWYgIW9iamVjdFxyXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxyXG5cdGlmIG9iamVjdD8ubGlzdF92aWV3cz8uZGVmYXVsdFxyXG5cdFx0I1RPRE8g5q2k5Luj56CB5Y+q5piv5pqC5pe25YW85a655Lul5YmNY29kZeS4reWumuS5ieeahGRlZmF1bHTop4blm77vvIzlvoVjb2Rl5Lit55qEZGVmYXVsdOa4heeQhuWujOaIkOWQju+8jOmcgOimgeWIoOmZpOatpOS7o+eggVxyXG5cdFx0ZGVmYXVsdFZpZXcgPSBvYmplY3QubGlzdF92aWV3cy5kZWZhdWx0XHJcblx0ZWxzZVxyXG5cdFx0Xy5lYWNoIG9iamVjdD8ubGlzdF92aWV3cywgKGxpc3Rfdmlldywga2V5KS0+XHJcblx0XHRcdGlmIGxpc3Rfdmlldy5uYW1lID09IFwiYWxsXCIgfHwga2V5ID09IFwiYWxsXCJcclxuXHRcdFx0XHRkZWZhdWx0VmlldyA9IGxpc3Rfdmlld1xyXG5cdHJldHVybiBkZWZhdWx0VmlldztcclxuXHJcbiMjI1xyXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k5pi+56S65a2X5q61XHJcbiMjI1xyXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zID0gKG9iamVjdF9uYW1lKS0+XHJcblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxyXG5cdHJldHVybiBkZWZhdWx0Vmlldz8uY29sdW1uc1xyXG5cclxuIyMjXHJcblx06I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k6aKd5aSW5Yqg6L2955qE5a2X5q61XHJcbiMjI1xyXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMgPSAob2JqZWN0X25hbWUpLT5cclxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpXHJcblx0cmV0dXJuIGRlZmF1bHRWaWV3Py5leHRyYV9jb2x1bW5zXHJcblxyXG4jIyNcclxuXHTojrflj5blr7nosaHnmoTpu5jorqTmjpLluo9cclxuIyMjXHJcbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQgPSAob2JqZWN0X25hbWUpLT5cclxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpXHJcblx0aWYgZGVmYXVsdFZpZXdcclxuXHRcdGlmIGRlZmF1bHRWaWV3LnNvcnRcclxuXHRcdFx0cmV0dXJuIGRlZmF1bHRWaWV3LnNvcnRcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIFtbXCJjcmVhdGVkXCIsIFwiZGVzY1wiXV1cclxuXHJcblxyXG4jIyNcclxuICAgIOWIpOaWreaYr+WQpkFsbCB2aWV3XHJcbiMjI1xyXG5DcmVhdG9yLmlzQWxsVmlldyA9IChsaXN0X3ZpZXcpLT5cclxuXHRyZXR1cm4gbGlzdF92aWV3Py5uYW1lID09IFwiYWxsXCJcclxuXHJcbiMjI1xyXG4gICAg5Yik5pat5piv5ZCm5pyA6L+R5p+l55yLIHZpZXdcclxuIyMjXHJcbkNyZWF0b3IuaXNSZWNlbnRWaWV3ID0gKGxpc3RfdmlldyktPlxyXG5cdHJldHVybiBsaXN0X3ZpZXc/Lm5hbWUgPT0gXCJyZWNlbnRcIlxyXG5cclxuIyMjXHJcbiAgICDlsIZzb3J06L2s5o2i5Li6VGFidWxhcuaOp+S7tuaJgOmcgOimgeeahOagvOW8j1xyXG4jIyNcclxuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyID0gKHNvcnQsIHRhYnVsYXJDb2x1bW5zKS0+XHJcblx0dGFidWxhcl9zb3J0ID0gW11cclxuXHRfLmVhY2ggc29ydCwgKGl0ZW0pLT5cclxuXHRcdGlmIF8uaXNBcnJheShpdGVtKVxyXG5cdFx0XHQjIOWFvOWuueaXp+eahOaVsOaNruagvOW8j1tbXCJmaWVsZF9uYW1lXCIsIFwib3JkZXJcIl1dXHJcblx0XHRcdGlmIGl0ZW0ubGVuZ3RoID09IDFcclxuXHRcdFx0XHRjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pXHJcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcclxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIFwiYXNjXCJdXHJcblx0XHRcdGVsc2UgaWYgaXRlbS5sZW5ndGggPT0gMlxyXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSlcclxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxyXG5cdFx0XHRcdFx0dGFidWxhcl9zb3J0LnB1c2ggW2NvbHVtbl9pbmRleCwgaXRlbVsxXV1cclxuXHRcdGVsc2UgaWYgXy5pc09iamVjdChpdGVtKVxyXG5cdFx0XHQj5paw5pWw5o2u5qC85byP77yaW3tmaWVsZF9uYW1lOiAsIG9yZGVyOiB9XVxyXG5cdFx0XHRmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lXHJcblx0XHRcdG9yZGVyID0gaXRlbS5vcmRlclxyXG5cdFx0XHRpZiBmaWVsZF9uYW1lICYmIG9yZGVyXHJcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihmaWVsZF9uYW1lKVxyXG5cdFx0XHRcdGlmIGNvbHVtbl9pbmRleCA+IC0xXHJcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBvcmRlcl1cclxuXHJcblx0cmV0dXJuIHRhYnVsYXJfc29ydFxyXG5cclxuIyMjXHJcbiAgICDlsIZzb3J06L2s5o2i5Li6RGV2RXhwcmVzc+aOp+S7tuaJgOmcgOimgeeahOagvOW8j1xyXG4jIyNcclxuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9EWCA9IChzb3J0KS0+XHJcblx0ZHhfc29ydCA9IFtdXHJcblx0Xy5lYWNoIHNvcnQsIChpdGVtKS0+XHJcblx0XHRpZiBfLmlzQXJyYXkoaXRlbSlcclxuXHRcdFx0I+WFvOWuueaXp+agvOW8j++8mltbXCJmaWVsZF9uYW1lXCIsIFwib3JkZXJcIl1dXHJcblx0XHRcdGR4X3NvcnQucHVzaChpdGVtKVxyXG5cdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGl0ZW0pXHJcblx0XHRcdCPmlrDmlbDmja7moLzlvI/vvJpbe2ZpZWxkX25hbWU6ICwgb3JkZXI6IH1dXHJcblx0XHRcdGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWVcclxuXHRcdFx0b3JkZXIgPSBpdGVtLm9yZGVyXHJcblx0XHRcdGlmIGZpZWxkX25hbWUgJiYgb3JkZXJcclxuXHRcdFx0XHRkeF9zb3J0LnB1c2ggW2ZpZWxkX25hbWUsIG9yZGVyXVxyXG5cclxuXHRyZXR1cm4gZHhfc29ydFxyXG4iLCJDcmVhdG9yLmdldEluaXRXaWR0aFBlcmNlbnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgY29sdW1ucykge1xuICB2YXIgX3NjaGVtYSwgY29sdW1uX251bSwgaW5pdF93aWR0aF9wZXJjZW50LCByZWY7XG4gIF9zY2hlbWEgPSAocmVmID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLl9zY2hlbWEgOiB2b2lkIDA7XG4gIGNvbHVtbl9udW0gPSAwO1xuICBpZiAoX3NjaGVtYSkge1xuICAgIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbihmaWVsZF9uYW1lKSB7XG4gICAgICB2YXIgZmllbGQsIGlzX3dpZGUsIHJlZjEsIHJlZjI7XG4gICAgICBmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKTtcbiAgICAgIGlzX3dpZGUgPSAocmVmMSA9IGZpZWxkW2ZpZWxkX25hbWVdKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMi5pc193aWRlIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGlzX3dpZGUpIHtcbiAgICAgICAgcmV0dXJuIGNvbHVtbl9udW0gKz0gMjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjb2x1bW5fbnVtICs9IDE7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaW5pdF93aWR0aF9wZXJjZW50ID0gMTAwIC8gY29sdW1uX251bTtcbiAgICByZXR1cm4gaW5pdF93aWR0aF9wZXJjZW50O1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkSXNXaWRlID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUpIHtcbiAgdmFyIF9zY2hlbWEsIGZpZWxkLCBpc193aWRlLCByZWYsIHJlZjE7XG4gIF9zY2hlbWEgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSkuX3NjaGVtYTtcbiAgaWYgKF9zY2hlbWEpIHtcbiAgICBmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKTtcbiAgICBpc193aWRlID0gKHJlZiA9IGZpZWxkW2ZpZWxkX25hbWVdKSAhPSBudWxsID8gKHJlZjEgPSByZWYuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLmlzX3dpZGUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgcmV0dXJuIGlzX3dpZGU7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0VGFidWxhck9yZGVyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1ucykge1xuICB2YXIgb2JqLCByZWYsIHJlZjEsIHJlZjIsIHNldHRpbmcsIHNvcnQ7XG4gIHNldHRpbmcgPSAocmVmID0gQ3JlYXRvci5Db2xsZWN0aW9ucykgIT0gbnVsbCA/IChyZWYxID0gcmVmLnNldHRpbmdzKSAhPSBudWxsID8gcmVmMS5maW5kT25lKHtcbiAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICB9KSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gXy5tYXAoY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG4gICAgdmFyIGZpZWxkO1xuICAgIGZpZWxkID0gb2JqLmZpZWxkc1tjb2x1bW5dO1xuICAgIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnR5cGUgOiB2b2lkIDApICYmICFmaWVsZC5oaWRkZW4pIHtcbiAgICAgIHJldHVybiBjb2x1bW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICB9KTtcbiAgY29sdW1ucyA9IF8uY29tcGFjdChjb2x1bW5zKTtcbiAgaWYgKHNldHRpbmcgJiYgc2V0dGluZy5zZXR0aW5ncykge1xuICAgIHNvcnQgPSAoKHJlZjIgPSBzZXR0aW5nLnNldHRpbmdzW2xpc3Rfdmlld19pZF0pICE9IG51bGwgPyByZWYyLnNvcnQgOiB2b2lkIDApIHx8IFtdO1xuICAgIHNvcnQgPSBfLm1hcChzb3J0LCBmdW5jdGlvbihvcmRlcikge1xuICAgICAgdmFyIGluZGV4LCBrZXk7XG4gICAgICBrZXkgPSBvcmRlclswXTtcbiAgICAgIGluZGV4ID0gXy5pbmRleE9mKGNvbHVtbnMsIGtleSk7XG4gICAgICBvcmRlclswXSA9IGluZGV4ICsgMTtcbiAgICAgIHJldHVybiBvcmRlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gc29ydDtcbiAgfVxuICByZXR1cm4gW107XG59O1xuXG5DcmVhdG9yLmluaXRMaXN0Vmlld3MgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgY29sdW1ucywgZGVmYXVsdF9leHRyYV9jb2x1bW5zLCBleHRyYV9jb2x1bW5zLCBvYmplY3QsIG9yZGVyLCByZWY7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl07XG4gIGV4dHJhX2NvbHVtbnMgPSBbXCJvd25lclwiXTtcbiAgZGVmYXVsdF9leHRyYV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJvd25lclwiXTtcbiAgaWYgKGRlZmF1bHRfZXh0cmFfY29sdW1ucykge1xuICAgIGV4dHJhX2NvbHVtbnMgPSBfLnVuaW9uKGV4dHJhX2NvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1ucyk7XG4gIH1cbiAgb3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KG9iamVjdF9uYW1lKSB8fCBbXTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHJldHVybiAocmVmID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHMpICE9IG51bGwgPyByZWZbb2JqZWN0X25hbWVdID0gW10gOiB2b2lkIDA7XG4gIH1cbn07XG5cbkNyZWF0b3IuY29udmVydExpc3RWaWV3ID0gZnVuY3Rpb24oZGVmYXVsdF9jb2x1bWVucywgbGlzdF92aWV3LCBsaXN0X3ZpZXdfbmFtZSkge1xuICB2YXIgb2l0ZW07XG4gIG9pdGVtID0gXy5jbG9uZShsaXN0X3ZpZXcpO1xuICBpZiAoIV8uaGFzKG9pdGVtLCBcIm5hbWVcIikpIHtcbiAgICBvaXRlbS5uYW1lID0gbGlzdF92aWV3X25hbWU7XG4gIH1cbiAgaWYgKCFvaXRlbS5jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRfY29sdW1lbnMpIHtcbiAgICAgIG9pdGVtLmNvbHVtbnMgPSBkZWZhdWx0X2NvbHVtZW5zO1xuICAgIH1cbiAgfVxuICBpZiAoIW9pdGVtLmNvbHVtbnMpIHtcbiAgICBvaXRlbS5jb2x1bW5zID0gW1wibmFtZVwiXTtcbiAgfVxuICBpZiAoIW9pdGVtLmZpbHRlcl9zY29wZSkge1xuICAgIG9pdGVtLmZpbHRlcl9zY29wZSA9IFwic3BhY2VcIjtcbiAgfVxuICBpZiAoIV8uaGFzKG9pdGVtLCBcIl9pZFwiKSkge1xuICAgIG9pdGVtLl9pZCA9IGxpc3Rfdmlld19uYW1lO1xuICB9IGVsc2Uge1xuICAgIG9pdGVtLmxhYmVsID0gb2l0ZW0ubGFiZWwgfHwgbGlzdF92aWV3Lm5hbWU7XG4gIH1cbiAgaWYgKF8uaXNTdHJpbmcob2l0ZW0ub3B0aW9ucykpIHtcbiAgICBvaXRlbS5vcHRpb25zID0gSlNPTi5wYXJzZShvaXRlbS5vcHRpb25zKTtcbiAgfVxuICBfLmZvckVhY2gob2l0ZW0uZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyLCBfaW5kZXgpIHtcbiAgICBpZiAoIV8uaXNBcnJheShmaWx0ZXIpICYmIF8uaXNPYmplY3QoZmlsdGVyKSkge1xuICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChfLmlzU3RyaW5nKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLl92YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXIuX3ZhbHVlICsgXCIpXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9pdGVtO1xufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBDcmVhdG9yLmdldFJlbGF0ZWRMaXN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgbGlzdCwgcmVsYXRlZF9vYmplY3RzO1xuICAgIGxpc3QgPSBbXTtcbiAgICByZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKTtcbiAgICBfLmVhY2gocmVsYXRlZF9vYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdF9pdGVtKSB7XG4gICAgICB2YXIgY29sdW1ucywgb3JkZXIsIHJlbGF0ZWQsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHRhYnVsYXJfb3JkZXI7XG4gICAgICByZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZTtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uZm9yZWlnbl9rZXk7XG4gICAgICByZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKCFyZWxhdGVkX29iamVjdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdO1xuICAgICAgY29sdW1ucyA9IF8ud2l0aG91dChjb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpO1xuICAgICAgb3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgdGFidWxhcl9vcmRlciA9IENyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhcihvcmRlciwgY29sdW1ucyk7XG4gICAgICBpZiAoL1xcdytcXC5cXCRcXC5cXHcrL2cudGVzdChyZWxhdGVkX2ZpZWxkX25hbWUpKSB7XG4gICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfZmllbGRfbmFtZS5yZXBsYWNlKC9cXCRcXC4vLCBcIlwiKTtcbiAgICAgIH1cbiAgICAgIHJlbGF0ZWQgPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zLFxuICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgaXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIlxuICAgICAgfTtcbiAgICAgIHJldHVybiBsaXN0LnB1c2gocmVsYXRlZCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH07XG59XG5cbkNyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHJldHVybiBfLmZpcnN0KENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKSk7XG59O1xuXG5cbi8qIFxuXHTlj5blh7psaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77vvIzlpoLmnpzkuI3lrZjlnKjmiJbogIXmsqHmnInmnYPpmZDvvIzlsLHov5Tlm57nrKzkuIDkuKrop4blm75cblx0ZXhhY+S4unRydWXml7bvvIzpnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzkuI3pu5jorqTov5Tlm57nrKzkuIDkuKrop4blm75cbiAqL1xuXG5DcmVhdG9yLmdldExpc3RWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZXhhYykge1xuICB2YXIgbGlzdFZpZXdzLCBsaXN0X3ZpZXcsIG9iamVjdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgIGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpO1xuICAgIH1cbiAgfVxuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxpc3RWaWV3cyA9IENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKTtcbiAgaWYgKCEobGlzdFZpZXdzICE9IG51bGwgPyBsaXN0Vmlld3MubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBsaXN0X3ZpZXcgPSBfLmZpbmRXaGVyZShsaXN0Vmlld3MsIHtcbiAgICBcIl9pZFwiOiBsaXN0X3ZpZXdfaWRcbiAgfSk7XG4gIGlmICghbGlzdF92aWV3KSB7XG4gICAgaWYgKGV4YWMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdF92aWV3ID0gbGlzdFZpZXdzWzBdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbGlzdF92aWV3O1xufTtcblxuQ3JlYXRvci5nZXRMaXN0Vmlld0lzUmVjZW50ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCkge1xuICB2YXIgbGlzdFZpZXcsIG9iamVjdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgIGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpO1xuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIGxpc3Rfdmlld19pZCA9PT0gXCJzdHJpbmdcIikge1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoIW9iamVjdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsaXN0VmlldyA9IF8uZmluZFdoZXJlKG9iamVjdC5saXN0X3ZpZXdzLCB7XG4gICAgICBfaWQ6IGxpc3Rfdmlld19pZFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGxpc3RWaWV3ID0gbGlzdF92aWV3X2lkO1xuICB9XG4gIHJldHVybiAobGlzdFZpZXcgIT0gbnVsbCA/IGxpc3RWaWV3Lm5hbWUgOiB2b2lkIDApID09PSBcInJlY2VudFwiO1xufTtcblxuXG4vKlxuICAgIOiOt+WPlum7mOiupOinhuWbvlxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXcsIG9iamVjdCwgcmVmO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgfVxuICBpZiAob2JqZWN0ICE9IG51bGwgPyAocmVmID0gb2JqZWN0Lmxpc3Rfdmlld3MpICE9IG51bGwgPyByZWZbXCJkZWZhdWx0XCJdIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgZGVmYXVsdFZpZXcgPSBvYmplY3QubGlzdF92aWV3c1tcImRlZmF1bHRcIl07XG4gIH0gZWxzZSB7XG4gICAgXy5lYWNoKG9iamVjdCAhPSBudWxsID8gb2JqZWN0Lmxpc3Rfdmlld3MgOiB2b2lkIDAsIGZ1bmN0aW9uKGxpc3Rfdmlldywga2V5KSB7XG4gICAgICBpZiAobGlzdF92aWV3Lm5hbWUgPT09IFwiYWxsXCIgfHwga2V5ID09PSBcImFsbFwiKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmlldyA9IGxpc3RfdmlldztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZpZXc7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k5pi+56S65a2X5q61XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgcmV0dXJuIGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5jb2x1bW5zIDogdm9pZCAwO1xufTtcblxuXG4vKlxuXHTojrflj5blr7nosaHnmoTliJfooajpu5jorqTpop3lpJbliqDovb3nmoTlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIHJldHVybiBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuZXh0cmFfY29sdW1ucyA6IHZvaWQgMDtcbn07XG5cblxuLypcblx06I635Y+W5a+56LGh55qE6buY6K6k5o6S5bqPXG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgaWYgKGRlZmF1bHRWaWV3KSB7XG4gICAgaWYgKGRlZmF1bHRWaWV3LnNvcnQpIHtcbiAgICAgIHJldHVybiBkZWZhdWx0Vmlldy5zb3J0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW1tcImNyZWF0ZWRcIiwgXCJkZXNjXCJdXTtcbiAgICB9XG4gIH1cbn07XG5cblxuLypcbiAgICDliKTmlq3mmK/lkKZBbGwgdmlld1xuICovXG5cbkNyZWF0b3IuaXNBbGxWaWV3ID0gZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gIHJldHVybiAobGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwiYWxsXCI7XG59O1xuXG5cbi8qXG4gICAg5Yik5pat5piv5ZCm5pyA6L+R5p+l55yLIHZpZXdcbiAqL1xuXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IGZ1bmN0aW9uKGxpc3Rfdmlldykge1xuICByZXR1cm4gKGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Lm5hbWUgOiB2b2lkIDApID09PSBcInJlY2VudFwiO1xufTtcblxuXG4vKlxuICAgIOWwhnNvcnTovazmjaLkuLpUYWJ1bGFy5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4gKi9cblxuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyID0gZnVuY3Rpb24oc29ydCwgdGFidWxhckNvbHVtbnMpIHtcbiAgdmFyIHRhYnVsYXJfc29ydDtcbiAgdGFidWxhcl9zb3J0ID0gW107XG4gIF8uZWFjaChzb3J0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGNvbHVtbl9pbmRleCwgZmllbGRfbmFtZSwgb3JkZXI7XG4gICAgaWYgKF8uaXNBcnJheShpdGVtKSkge1xuICAgICAgaWYgKGl0ZW0ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBcImFzY1wiXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXRlbS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZTtcbiAgICAgIG9yZGVyID0gaXRlbS5vcmRlcjtcbiAgICAgIGlmIChmaWVsZF9uYW1lICYmIG9yZGVyKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBvcmRlcl0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRhYnVsYXJfc29ydDtcbn07XG5cblxuLypcbiAgICDlsIZzb3J06L2s5o2i5Li6RGV2RXhwcmVzc+aOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuICovXG5cbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSBmdW5jdGlvbihzb3J0KSB7XG4gIHZhciBkeF9zb3J0O1xuICBkeF9zb3J0ID0gW107XG4gIF8uZWFjaChzb3J0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGZpZWxkX25hbWUsIG9yZGVyO1xuICAgIGlmIChfLmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIHJldHVybiBkeF9zb3J0LnB1c2goaXRlbSk7XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lO1xuICAgICAgb3JkZXIgPSBpdGVtLm9yZGVyO1xuICAgICAgaWYgKGZpZWxkX25hbWUgJiYgb3JkZXIpIHtcbiAgICAgICAgcmV0dXJuIGR4X3NvcnQucHVzaChbZmllbGRfbmFtZSwgb3JkZXJdKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZHhfc29ydDtcbn07XG4iLCJTaW1wbGVTY2hlbWEuUmVnRXguY29kZSA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11bYS16QS1aMC05X10qJCcpXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XHJcblx0XHRfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW11cclxuXHRcdF9yZWdFeE1lc3NhZ2VzLnB1c2gge2V4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUsIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIzkuJTlj6rog73ljIXlkKvlrZfmr43jgIHmlbDlrZfjgIFfXCJ9XHJcblx0XHRTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xyXG5cdFx0XHRyZWdFeDogX3JlZ0V4TWVzc2FnZXMsXHJcblx0XHR9KSIsIlNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVthLXpBLVowLTlfXSokJyk7XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWdFeE1lc3NhZ2VzO1xuICAgIF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXTtcbiAgICBfcmVnRXhNZXNzYWdlcy5wdXNoKHtcbiAgICAgIGV4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUsXG4gICAgICBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yM5LiU5Y+q6IO95YyF5ZCr5a2X5q+N44CB5pWw5a2X44CBX1wiXG4gICAgfSk7XG4gICAgcmV0dXJuIFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG4gICAgICByZWdFeDogX3JlZ0V4TWVzc2FnZXNcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dXFxcXHcqKFxcXFwuXFxcXCRcXFxcLlxcXFx3Kyk/W2EtekEtWjAtOV0qJCcpXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XHJcblx0XHRfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW11cclxuXHRcdF9yZWdFeE1lc3NhZ2VzLnB1c2gge2V4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkLCBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yMLiQu5YmN5ZCO5b+F6aG75YyF5ZCr5a2X56ymXCJ9XHJcblx0XHRTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xyXG5cdFx0XHRyZWdFeDogX3JlZ0V4TWVzc2FnZXMsXHJcblx0XHR9KSIsIlNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11cXFxcdyooXFxcXC5cXFxcJFxcXFwuXFxcXHcrKT9bYS16QS1aMC05XSokJyk7XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWdFeE1lc3NhZ2VzO1xuICAgIF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXTtcbiAgICBfcmVnRXhNZXNzYWdlcy5wdXNoKHtcbiAgICAgIGV4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkLFxuICAgICAgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jC4kLuWJjeWQjuW/hemhu+WMheWQq+Wtl+esplwiXG4gICAgfSk7XG4gICAgcmV0dXJuIFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG4gICAgICByZWdFeDogX3JlZ0V4TWVzc2FnZXNcbiAgICB9KTtcbiAgfSk7XG59XG4iLCIvLyDlm6DkuLptZXRlb3LnvJbor5Fjb2ZmZWVzY3JpcHTkvJrlr7zoh7RldmFs5Ye95pWw5oql6ZSZ77yM5omA5Lul5Y2V54us5YaZ5Zyo5LiA5LiqanPmlofku7bkuK3jgIJcclxuQ3JlYXRvci5ldmFsSW5Db250ZXh0ID0gZnVuY3Rpb24oanMsIGNvbnRleHQpIHtcclxuICAgIC8vIyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgdGhlIGluLWxpbmUgYW5vbnltb3VzIGZ1bmN0aW9uIHdlIC5jYWxsIHdpdGggdGhlIHBhc3NlZCBjb250ZXh0XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7IFxyXG4gICAgXHRyZXR1cm4gZXZhbChqcyk7IFxyXG5cdH0uY2FsbChjb250ZXh0KTtcclxufVxyXG5cclxuXHJcbkNyZWF0b3IuZXZhbCA9IGZ1bmN0aW9uKGpzKXtcclxuXHRyZXR1cm4gZXZhbChqcylcclxufSIsIlx0Z2V0T3B0aW9uID0gKG9wdGlvbiktPlxyXG5cdFx0Zm9vID0gb3B0aW9uLnNwbGl0KFwiOlwiKVxyXG5cdFx0aWYgZm9vLmxlbmd0aCA+IDFcclxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzFdfVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMF19XHJcblxyXG5cdENyZWF0b3IuY29udmVydE9iamVjdCA9IChvYmplY3QpLT5cclxuXHRcdF8uZm9yRWFjaCBvYmplY3QudHJpZ2dlcnMsICh0cmlnZ2VyLCBrZXkpLT5cclxuXHJcblx0XHRcdGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PSBcInNlcnZlclwiKSB8fCAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT0gXCJjbGllbnRcIilcclxuXHRcdFx0XHRfdG9kb19mcm9tX2NvZGUgPSB0cmlnZ2VyPy5fdG9kb1xyXG5cdFx0XHRcdF90b2RvX2Zyb21fZGIgPSB0cmlnZ2VyLnRvZG9cclxuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpXHJcblx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2NvZGV9KVwiKVxyXG5cclxuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYilcclxuXHRcdFx0XHRcdCPlj6rmnIl1cGRhdGXml7bvvIwgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMg5omN5pyJ5YC8XHJcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph4/vvIzlsKTlhbbmmK9Db2xsZWN0aW9uXHJcblx0XHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKVxyXG5cdFx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2RifSlcIilcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0dHJpZ2dlci50b2RvID0gQ3JlYXRvci5ldmFsKFwiKGZ1bmN0aW9uKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyl7I3tfdG9kb19mcm9tX2RifX0pXCIpXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiXHJcblx0XHRcdFx0X3RvZG8gPSB0cmlnZ2VyLnRvZG9cclxuXHRcdFx0XHRpZiBfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pXHJcblx0XHRcdFx0XHR0cmlnZ2VyLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKVxyXG5cclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LmFjdGlvbnMsIChhY3Rpb24sIGtleSktPlxyXG5cdFx0XHRcdF90b2RvX2Zyb21fY29kZSA9IGFjdGlvbj8uX3RvZG9cclxuXHRcdFx0XHRfdG9kb19mcm9tX2RiID0gYWN0aW9uPy50b2RvXHJcblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKVxyXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2NvZGV9KVwiKVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcInRvZG9fZnJvbV9jb2RlXCIsIF90b2RvX2Zyb21fY29kZVxyXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKVxyXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcclxuXHRcdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fZGJ9KVwiKVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKENyZWF0b3IuYWN0aW9uc0J5TmFtZVtfdG9kb19mcm9tX2RiXSlcclxuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gX3RvZG9fZnJvbV9kYlxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKGZ1bmN0aW9uKCl7I3tfdG9kb19mcm9tX2RifX0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwidG9kb19mcm9tX2RiXCIsIF90b2RvX2Zyb21fZGIsIGVycm9yXHJcblxyXG5cdFx0XHRcdF92aXNpYmxlID0gYWN0aW9uPy5fdmlzaWJsZVxyXG5cdFx0XHRcdGlmIF92aXNpYmxlXHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0YWN0aW9uLnZpc2libGUgPSBDcmVhdG9yLmV2YWwoXCIoI3tfdmlzaWJsZX0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiYWN0aW9uLnZpc2libGUgdG8gZnVuY3Rpb24gZXJyb3I6IFwiLCBlcnJvciwgX3Zpc2libGVcclxuXHRcdGVsc2VcclxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5hY3Rpb25zLCAoYWN0aW9uLCBrZXkpLT5cclxuXHRcdFx0XHRfdG9kbyA9IGFjdGlvbj8udG9kb1xyXG5cdFx0XHRcdGlmIF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbylcclxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj1xyXG5cdFx0XHRcdFx0YWN0aW9uLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKVxyXG5cclxuXHRcdFx0XHRfdmlzaWJsZSA9IGFjdGlvbj8udmlzaWJsZVxyXG5cclxuXHRcdFx0XHRpZiBfdmlzaWJsZSAmJiBfLmlzRnVuY3Rpb24oX3Zpc2libGUpXHJcblx0XHRcdFx0XHRhY3Rpb24uX3Zpc2libGUgPSBfdmlzaWJsZS50b1N0cmluZygpXHJcblxyXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC5maWVsZHMsIChmaWVsZCwga2V5KS0+XHJcblx0XHRcdGlmIGZpZWxkLm9wdGlvbnMgJiYgXy5pc1N0cmluZyhmaWVsZC5vcHRpb25zKVxyXG5cdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0X29wdGlvbnMgPSBbXVxyXG5cdFx0XHRcdFx0I+aUr+aMgVxcbuaIluiAheiLseaWh+mAl+WPt+WIhuWJsixcclxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCAob3B0aW9uKS0+XHJcblx0XHRcdFx0XHRcdGlmIG9wdGlvbi5pbmRleE9mKFwiLFwiKVxyXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMgPSBvcHRpb24uc3BsaXQoXCIsXCIpXHJcblx0XHRcdFx0XHRcdFx0Xy5mb3JFYWNoIG9wdGlvbnMsIChfb3B0aW9uKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihfb3B0aW9uKSlcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXHJcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcclxuXHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcclxuXHJcblx0XHRcdGVsc2UgaWYgZmllbGQub3B0aW9ucyAmJiAhXy5pc0Z1bmN0aW9uKGZpZWxkLm9wdGlvbnMpICYmICFfLmlzQXJyYXkoZmllbGQub3B0aW9ucykgJiYgXy5pc09iamVjdChmaWVsZC5vcHRpb25zKVxyXG5cdFx0XHRcdF9vcHRpb25zID0gW11cclxuXHRcdFx0XHRfLmVhY2ggZmllbGQub3B0aW9ucywgKHYsIGspLT5cclxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiB2LCB2YWx1ZToga31cclxuXHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdG9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXHJcblx0XHRcdFx0aWYgb3B0aW9ucyAmJiBfLmlzRnVuY3Rpb24ob3B0aW9ucylcclxuXHRcdFx0XHRcdGZpZWxkLl9vcHRpb25zID0gZmllbGQub3B0aW9ucy50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRvcHRpb25zID0gZmllbGQuX29wdGlvbnNcclxuXHRcdFx0XHRpZiBvcHRpb25zICYmIF8uaXNTdHJpbmcob3B0aW9ucylcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gQ3JlYXRvci5ldmFsKFwiKCN7b3B0aW9uc30pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLnJlZ0V4XHJcblx0XHRcdFx0aWYgcmVnRXhcclxuXHRcdFx0XHRcdGZpZWxkLl9yZWdFeCA9IGZpZWxkLnJlZ0V4LnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJlZ0V4ID0gZmllbGQuX3JlZ0V4XHJcblx0XHRcdFx0aWYgcmVnRXhcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRmaWVsZC5yZWdFeCA9IENyZWF0b3IuZXZhbChcIigje3JlZ0V4fSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdGlmIGZpZWxkLmF1dG9mb3JtXHJcblx0XHRcdFx0XHRfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLnR5cGVcclxuXHRcdFx0XHRcdGlmIF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT0gT2JqZWN0ICYmIF90eXBlICE9IFN0cmluZyAmJiBfdHlwZSAhPSBOdW1iZXIgJiYgX3R5cGUgIT0gQm9vbGVhbiAmJiAhXy5pc0FycmF5KF90eXBlKVxyXG5cdFx0XHRcdFx0XHRmaWVsZC5hdXRvZm9ybS5fdHlwZSA9IF90eXBlLnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlmIGZpZWxkLmF1dG9mb3JtXHJcblx0XHRcdFx0XHRfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLl90eXBlXHJcblx0XHRcdFx0XHRpZiBfdHlwZSAmJiBfLmlzU3RyaW5nKF90eXBlKVxyXG5cdFx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0XHRmaWVsZC5hdXRvZm9ybS50eXBlID0gQ3JlYXRvci5ldmFsKFwiKCN7X3R5cGV9KVwiKVxyXG5cdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGZpZWxkIC0+IHR5cGUgZXJyb3JcIiwgZmllbGQsIGVycm9yXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHJcblx0XHRcdFx0b3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uXHJcblx0XHRcdFx0cmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXHJcblx0XHRcdFx0Y3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvblxyXG5cdFx0XHRcdGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxyXG5cdFx0XHRcdGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvblxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnNGdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLl9vcHRpb25zRnVuY3Rpb24gPSBvcHRpb25zRnVuY3Rpb24udG9TdHJpbmcoKVxyXG5cclxuXHRcdFx0XHRpZiByZWZlcmVuY2VfdG8gJiYgXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdGZpZWxkLl9yZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8udG9TdHJpbmcoKVxyXG5cclxuXHRcdFx0XHRpZiBjcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oY3JlYXRlRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5fY3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbi50b1N0cmluZygpXHJcblx0XHRcdFx0aWYgYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uID0gYmVmb3JlT3BlbkZ1bmN0aW9uLnRvU3RyaW5nKClcclxuXHJcblx0XHRcdFx0aWYgZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJzRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uID0gZmlsdGVyc0Z1bmN0aW9uLnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cclxuXHRcdFx0XHRvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uIHx8IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxyXG5cdFx0XHRcdHJlZmVyZW5jZV90byA9IGZpZWxkLl9yZWZlcmVuY2VfdG9cclxuXHRcdFx0XHRjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvblxyXG5cdFx0XHRcdGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb25cclxuXHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uXHJcblxyXG5cdFx0XHRcdGlmIG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKG9wdGlvbnNGdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje29wdGlvbnNGdW5jdGlvbn0pXCIpXHJcblxyXG5cdFx0XHRcdGlmIHJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKHJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdGZpZWxkLnJlZmVyZW5jZV90byA9IENyZWF0b3IuZXZhbChcIigje3JlZmVyZW5jZV90b30pXCIpXHJcblxyXG5cdFx0XHRcdGlmIGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoY3JlYXRlRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5jcmVhdGVGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2NyZWF0ZUZ1bmN0aW9ufSlcIilcclxuXHJcblx0XHRcdFx0aWYgYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoYmVmb3JlT3BlbkZ1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7YmVmb3JlT3BlbkZ1bmN0aW9ufSlcIilcclxuXHJcblx0XHRcdFx0aWYgZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcoZmlsdGVyc0Z1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuZmlsdGVyc0Z1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyc0Z1bmN0aW9ufSlcIilcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxyXG5cdFx0XHRcdGlmIGRlZmF1bHRWYWx1ZSAmJiBfLmlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKVxyXG5cdFx0XHRcdFx0ZmllbGQuX2RlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZS50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5fZGVmYXVsdFZhbHVlXHJcblxyXG5cdFx0XHRcdGlmICFkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhmaWVsZC5kZWZhdWx0VmFsdWUpICYmIGZpZWxkLmRlZmF1bHRWYWx1ZS5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcclxuXHRcdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxyXG5cclxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhkZWZhdWx0VmFsdWUpXHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0ZmllbGQuZGVmYXVsdFZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZGVmYXVsdFZhbHVlfSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcclxuXHRcdFx0XHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdGlmIGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzRnVuY3Rpb24oaXNfY29tcGFueV9saW1pdGVkKVxyXG5cdFx0XHRcdFx0ZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZC50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0aWYgaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNTdHJpbmcoaXNfY29tcGFueV9saW1pdGVkKVxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9IENyZWF0b3IuZXZhbChcIigje2lzX2NvbXBhbnlfbGltaXRlZH0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXHJcblxyXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC5saXN0X3ZpZXdzLCAobGlzdF92aWV3LCBrZXkpIC0+XHJcblx0XHRcdCMjI1xyXG5cdFx0XHTop4blm77ov4fomZHlmajpnIDopoHmlK/mjIFmdW5jdGlvbu+8jOWQjuWPsOi9rOaIkOWtl+espuS4su+8jOWJjeWPsGV2YWzmiJDlh73mlbBcclxuXHRcdFx06K6p6L+H6JmR5Zmo5pSv5oyB5Lik56eNZnVuY3Rpb27mlrnlvI/vvJpcclxuXHRcdFx0MS4g5pW05LiqZmlsdGVyc+S4umZ1bmN0aW9uOlxyXG5cdFx0XHTlpoLvvJpcclxuXHRcdFx0ZmlsdGVyczogKCktPlxyXG5cdFx0XHRcdHJldHVybiBbW1tcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJwcm9qZWN0X2lzc3Vlc1wiXSwnb3InLFtcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJ0YXNrc1wiXV1dXHJcblx0XHRcdDIuIGZpbHRlcnPlhoXnmoRmaWx0ZXIudmFsdWXkuLpmdW5jdGlvblxyXG5cdFx0XHTlpoLvvJpcclxuXHRcdFx0ZmlsdGVyczogW1tcIm9iamVjdF9uYW1lXCIsIFwiPVwiLCAoKS0+XHJcblx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxyXG5cdFx0XHRdXVxyXG5cdFx0XHTmiJZcclxuXHRcdFx0ZmlsdGVyczogW3tcclxuXHRcdFx0XHRcImZpZWxkXCI6IFwib2JqZWN0X25hbWVcIlxyXG5cdFx0XHRcdFwib3BlcmF0aW9uXCI6IFwiPVwiXHJcblx0XHRcdFx0XCJ2YWx1ZVwiOiAoKS0+XHJcblx0XHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXHJcblx0XHRcdH1dXHJcblx0XHRcdCMjI1xyXG5cdFx0XHRpZiBfLmlzRnVuY3Rpb24obGlzdF92aWV3LmZpbHRlcnMpXHJcblx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0XHRsaXN0X3ZpZXcuX2ZpbHRlcnMgPSBsaXN0X3ZpZXcuZmlsdGVycy50b1N0cmluZygpXHJcblx0XHRcdGVsc2UgaWYgXy5pc1N0cmluZyhsaXN0X3ZpZXcuX2ZpbHRlcnMpXHJcblx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRsaXN0X3ZpZXcuZmlsdGVycyA9IENyZWF0b3IuZXZhbChcIigje2xpc3Rfdmlldy5fZmlsdGVyc30pXCIpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRfLmZvckVhY2ggbGlzdF92aWV3LmZpbHRlcnMsIChmaWx0ZXIsIF9pbmRleCktPlxyXG5cdFx0XHRcdFx0aWYgXy5pc0FycmF5KGZpbHRlcilcclxuXHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0XHRcdFx0aWYgZmlsdGVyLmxlbmd0aCA9PSAzIGFuZCBfLmlzRnVuY3Rpb24oZmlsdGVyWzJdKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzJdID0gZmlsdGVyWzJdLnRvU3RyaW5nKClcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclszXSA9IFwiRlVOQ1RJT05cIlxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgZmlsdGVyLmxlbmd0aCA9PSAzIGFuZCBfLmlzRGF0ZShmaWx0ZXJbMl0pXHJcblx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOaYr0RhdGXnsbvlnovvvIzliJlmaWx0ZXJbMl3lgLzliLDliY3nq6/kvJroh6rliqjovazmiJDlrZfnrKbkuLLvvIzmoLzlvI/vvJpcIjIwMTgtMDMtMjlUMDM6NDM6MjEuNzg3WlwiXHJcblx0XHRcdFx0XHRcdFx0XHQjIOWMheaLrGdyaWTliJfooajor7fmsYLnmoTmjqXlj6PlnKjlhoXnmoTmiYDmnIlPRGF0YeaOpeWPo++8jERhdGXnsbvlnovlrZfmrrXpg73kvJrku6XkuIrov7DmoLzlvI/ov5Tlm55cclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclszXSA9IFwiREFURVwiXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDQgYW5kIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSBhbmQgZmlsdGVyWzNdID09IFwiRlVOQ1RJT05cIlxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzJdID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyWzJdfSlcIilcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5wb3AoKVxyXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gNCBhbmQgXy5pc1N0cmluZyhmaWx0ZXJbMl0pIGFuZCBmaWx0ZXJbM10gPT0gXCJEQVRFXCJcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IG5ldyBEYXRlKGZpbHRlclsyXSlcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5wb3AoKVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGZpbHRlcilcclxuXHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpbHRlcj8udmFsdWUpXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKClcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNEYXRlKGZpbHRlcj8udmFsdWUpXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIuX2lzX2RhdGUgPSB0cnVlXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpbHRlcj8uX3ZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyLl92YWx1ZX0pXCIpXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmaWx0ZXIuX2lzX2RhdGUgPT0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gbmV3IERhdGUoZmlsdGVyLnZhbHVlKVxyXG5cdFx0cmV0dXJuIG9iamVjdFxyXG5cclxuXHJcbiIsInZhciBnZXRPcHRpb247XG5cbmdldE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICB2YXIgZm9vO1xuICBmb28gPSBvcHRpb24uc3BsaXQoXCI6XCIpO1xuICBpZiAoZm9vLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMV1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1swXVxuICAgIH07XG4gIH1cbn07XG5cbkNyZWF0b3IuY29udmVydE9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICBfLmZvckVhY2gob2JqZWN0LnRyaWdnZXJzLCBmdW5jdGlvbih0cmlnZ2VyLCBrZXkpIHtcbiAgICB2YXIgX3RvZG8sIF90b2RvX2Zyb21fY29kZSwgX3RvZG9fZnJvbV9kYjtcbiAgICBpZiAoKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcInNlcnZlclwiKSB8fCAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIpKSB7XG4gICAgICBfdG9kb19mcm9tX2NvZGUgPSB0cmlnZ2VyICE9IG51bGwgPyB0cmlnZ2VyLl90b2RvIDogdm9pZCAwO1xuICAgICAgX3RvZG9fZnJvbV9kYiA9IHRyaWdnZXIudG9kbztcbiAgICAgIGlmIChfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpKSB7XG4gICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9jb2RlICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKSkge1xuICAgICAgICBpZiAoX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fZGIgKyBcIilcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKXtcIiArIF90b2RvX2Zyb21fZGIgKyBcIn0pXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIikge1xuICAgICAgX3RvZG8gPSB0cmlnZ2VyLnRvZG87XG4gICAgICBpZiAoX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKSkge1xuICAgICAgICByZXR1cm4gdHJpZ2dlci5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QuYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBrZXkpIHtcbiAgICAgIHZhciBfdG9kb19mcm9tX2NvZGUsIF90b2RvX2Zyb21fZGIsIF92aXNpYmxlLCBlcnJvcjtcbiAgICAgIF90b2RvX2Zyb21fY29kZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLl90b2RvIDogdm9pZCAwO1xuICAgICAgX3RvZG9fZnJvbV9kYiA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnRvZG8gOiB2b2lkIDA7XG4gICAgICBpZiAoX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2NvZGUgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0b2RvX2Zyb21fY29kZVwiLCBfdG9kb19mcm9tX2NvZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9kYiArIFwiKVwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihDcmVhdG9yLmFjdGlvbnNCeU5hbWVbX3RvZG9fZnJvbV9kYl0pKSB7XG4gICAgICAgICAgICAgIGFjdGlvbi50b2RvID0gX3RvZG9fZnJvbV9kYjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoZnVuY3Rpb24oKXtcIiArIF90b2RvX2Zyb21fZGIgKyBcIn0pXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcInRvZG9fZnJvbV9kYlwiLCBfdG9kb19mcm9tX2RiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIF92aXNpYmxlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24uX3Zpc2libGUgOiB2b2lkIDA7XG4gICAgICBpZiAoX3Zpc2libGUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gYWN0aW9uLnZpc2libGUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF92aXNpYmxlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImFjdGlvbi52aXNpYmxlIHRvIGZ1bmN0aW9uIGVycm9yOiBcIiwgZXJyb3IsIF92aXNpYmxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QuYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBrZXkpIHtcbiAgICAgIHZhciBfdG9kbywgX3Zpc2libGU7XG4gICAgICBfdG9kbyA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnRvZG8gOiB2b2lkIDA7XG4gICAgICBpZiAoX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKSkge1xuICAgICAgICBhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgX3Zpc2libGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi52aXNpYmxlIDogdm9pZCAwO1xuICAgICAgaWYgKF92aXNpYmxlICYmIF8uaXNGdW5jdGlvbihfdmlzaWJsZSkpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi5fdmlzaWJsZSA9IF92aXNpYmxlLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgXy5mb3JFYWNoKG9iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICB2YXIgX29wdGlvbnMsIF90eXBlLCBiZWZvcmVPcGVuRnVuY3Rpb24sIGNyZWF0ZUZ1bmN0aW9uLCBkZWZhdWx0VmFsdWUsIGVycm9yLCBmaWx0ZXJzRnVuY3Rpb24sIGlzX2NvbXBhbnlfbGltaXRlZCwgb3B0aW9ucywgb3B0aW9uc0Z1bmN0aW9uLCByZWZlcmVuY2VfdG8sIHJlZ0V4O1xuICAgIGlmIChmaWVsZC5vcHRpb25zICYmIF8uaXNTdHJpbmcoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICB2YXIgb3B0aW9ucztcbiAgICAgICAgICBpZiAob3B0aW9uLmluZGV4T2YoXCIsXCIpKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gb3B0aW9uLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgIHJldHVybiBfLmZvckVhY2gob3B0aW9ucywgZnVuY3Rpb24oX29wdGlvbikge1xuICAgICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24oX29wdGlvbikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLm9wdGlvbnMgJiYgIV8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zKSAmJiAhXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpICYmIF8uaXNPYmplY3QoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIF9vcHRpb25zID0gW107XG4gICAgICBfLmVhY2goZmllbGQub3B0aW9ucywgZnVuY3Rpb24odiwgaykge1xuICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgbGFiZWw6IHYsXG4gICAgICAgICAgdmFsdWU6IGtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzRnVuY3Rpb24ob3B0aW9ucykpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5fb3B0aW9ucztcbiAgICAgIGlmIChvcHRpb25zICYmIF8uaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBvcHRpb25zICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmVnRXggPSBmaWVsZC5yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICBmaWVsZC5fcmVnRXggPSBmaWVsZC5yZWdFeC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWdFeCA9IGZpZWxkLl9yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLnJlZ0V4ID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWdFeCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGlmIChmaWVsZC5hdXRvZm9ybSkge1xuICAgICAgICBfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLnR5cGU7XG4gICAgICAgIGlmIChfdHlwZSAmJiBfLmlzRnVuY3Rpb24oX3R5cGUpICYmIF90eXBlICE9PSBPYmplY3QgJiYgX3R5cGUgIT09IFN0cmluZyAmJiBfdHlwZSAhPT0gTnVtYmVyICYmIF90eXBlICE9PSBCb29sZWFuICYmICFfLmlzQXJyYXkoX3R5cGUpKSB7XG4gICAgICAgICAgZmllbGQuYXV0b2Zvcm0uX3R5cGUgPSBfdHlwZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChmaWVsZC5hdXRvZm9ybSkge1xuICAgICAgICBfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLl90eXBlO1xuICAgICAgICBpZiAoX3R5cGUgJiYgXy5pc1N0cmluZyhfdHlwZSkpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmllbGQuYXV0b2Zvcm0udHlwZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3R5cGUgKyBcIilcIik7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGZpZWxkIC0+IHR5cGUgZXJyb3JcIiwgZmllbGQsIGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uO1xuICAgICAgcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvbjtcbiAgICAgIGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgIGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgIGlmIChvcHRpb25zRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnNGdW5jdGlvbiA9IG9wdGlvbnNGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZmVyZW5jZV90byAmJiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICBmaWVsZC5fcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fY3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oYmVmb3JlT3BlbkZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uID0gYmVmb3JlT3BlbkZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJzRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gPSBmaWx0ZXJzRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9uc0Z1bmN0aW9uID0gZmllbGQuX29wdGlvbnNGdW5jdGlvbiB8fCBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5fcmVmZXJlbmNlX3RvO1xuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5fY3JlYXRlRnVuY3Rpb247XG4gICAgICBiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuX2ZpbHRlcnNGdW5jdGlvbjtcbiAgICAgIGlmIChvcHRpb25zRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhvcHRpb25zRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgb3B0aW9uc0Z1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgZmllbGQucmVmZXJlbmNlX3RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWZlcmVuY2VfdG8gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoY3JlYXRlRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhjcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGNyZWF0ZUZ1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGJlZm9yZU9wZW5GdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBiZWZvcmVPcGVuRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcoZmlsdGVyc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlcnNGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAmJiBfLmlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICBmaWVsZC5fZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLl9kZWZhdWx0VmFsdWU7XG4gICAgICBpZiAoIWRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGZpZWxkLmRlZmF1bHRWYWx1ZSkgJiYgZmllbGQuZGVmYXVsdFZhbHVlLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAoZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZGVmYXVsdFZhbHVlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgaWYgKGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzRnVuY3Rpb24oaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICByZXR1cm4gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgaWYgKGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzU3RyaW5nKGlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gZmllbGQuaXNfY29tcGFueV9saW1pdGVkID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBpc19jb21wYW55X2xpbWl0ZWQgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBfLmZvckVhY2gob2JqZWN0Lmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGxpc3Rfdmlldywga2V5KSB7XG5cbiAgICAvKlxuICAgIFx0XHRcdOinhuWbvui/h+iZkeWZqOmcgOimgeaUr+aMgWZ1bmN0aW9u77yM5ZCO5Y+w6L2s5oiQ5a2X56ym5Liy77yM5YmN5Y+wZXZhbOaIkOWHveaVsFxuICAgIFx0XHRcdOiuqei/h+iZkeWZqOaUr+aMgeS4pOenjWZ1bmN0aW9u5pa55byP77yaXG4gICAgXHRcdFx0MS4g5pW05LiqZmlsdGVyc+S4umZ1bmN0aW9uOlxuICAgIFx0XHRcdOWmgu+8mlxuICAgIFx0XHRcdGZpbHRlcnM6ICgpLT5cbiAgICBcdFx0XHRcdHJldHVybiBbW1tcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJwcm9qZWN0X2lzc3Vlc1wiXSwnb3InLFtcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJ0YXNrc1wiXV1dXG4gICAgXHRcdFx0Mi4gZmlsdGVyc+WGheeahGZpbHRlci52YWx1ZeS4umZ1bmN0aW9uXG4gICAgXHRcdFx05aaC77yaXG4gICAgXHRcdFx0ZmlsdGVyczogW1tcIm9iamVjdF9uYW1lXCIsIFwiPVwiLCAoKS0+XG4gICAgXHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG4gICAgXHRcdFx0XV1cbiAgICBcdFx0XHTmiJZcbiAgICBcdFx0XHRmaWx0ZXJzOiBbe1xuICAgIFx0XHRcdFx0XCJmaWVsZFwiOiBcIm9iamVjdF9uYW1lXCJcbiAgICBcdFx0XHRcdFwib3BlcmF0aW9uXCI6IFwiPVwiXG4gICAgXHRcdFx0XHRcInZhbHVlXCI6ICgpLT5cbiAgICBcdFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuICAgIFx0XHRcdH1dXG4gICAgICovXG4gICAgaWYgKF8uaXNGdW5jdGlvbihsaXN0X3ZpZXcuZmlsdGVycykpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlldy5fZmlsdGVycyA9IGxpc3Rfdmlldy5maWx0ZXJzLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKGxpc3Rfdmlldy5fZmlsdGVycykpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlldy5maWx0ZXJzID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBsaXN0X3ZpZXcuX2ZpbHRlcnMgKyBcIilcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBfLmZvckVhY2gobGlzdF92aWV3LmZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlciwgX2luZGV4KSB7XG4gICAgICAgIGlmIChfLmlzQXJyYXkoZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSAzICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJbMl0pKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IGZpbHRlclsyXS50b1N0cmluZygpO1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyWzNdID0gXCJGVU5DVElPTlwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubGVuZ3RoID09PSAzICYmIF8uaXNEYXRlKGZpbHRlclsyXSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlclszXSA9IFwiREFURVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gNCAmJiBfLmlzU3RyaW5nKGZpbHRlclsyXSkgJiYgZmlsdGVyWzNdID09PSBcIkZVTkNUSU9OXCIpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXJbMl0gKyBcIilcIik7XG4gICAgICAgICAgICAgIGZpbHRlci5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSA0ICYmIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSAmJiBmaWx0ZXJbM10gPT09IFwiREFURVwiKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IG5ldyBEYXRlKGZpbHRlclsyXSk7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNEYXRlKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLl9pc19kYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIuX3ZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXIuX3ZhbHVlICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIuX2lzX2RhdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsIkNyZWF0b3IuRm9ybXVsYXIgPSB7fVxyXG5cclxuQ3JlYXRvci5Gb3JtdWxhci5QUkVGSVggPSBcIl9WQUxVRVNcIlxyXG5cclxuQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEgPSAocHJlZml4LGZpZWxkVmFyaWFibGUpLT5cclxuXHRyZWcgPSAvKFxce1tee31dKlxcfSkvZztcclxuXHJcblx0cmV2ID0gZmllbGRWYXJpYWJsZS5yZXBsYWNlIHJlZywgKG0sICQxKS0+XHJcblx0XHRyZXR1cm4gcHJlZml4ICsgJDEucmVwbGFjZSgvXFx7XFxzKi8sXCJbXFxcIlwiKS5yZXBsYWNlKC9cXHMqXFx9LyxcIlxcXCJdXCIpLnJlcGxhY2UoL1xccypcXC5cXHMqL2csXCJcXFwiXVtcXFwiXCIpO1xyXG5cclxuXHRyZXR1cm4gcmV2XHJcblxyXG5DcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYSA9IChmb3JtdWxhX3N0ciktPlxyXG5cdGlmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ7XCIpID4gLTEgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIn1cIikgPiAtMVxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHRyZXR1cm4gZmFsc2VcclxuXHJcbkNyZWF0b3IuRm9ybXVsYXIucnVuID0gKGZvcm11bGFfc3RyLCBfQ09OVEVYVCwgb3B0aW9ucyktPlxyXG5cdGlmIGZvcm11bGFfc3RyICYmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpXHJcblxyXG5cdFx0aWYgIV8uaXNCb29sZWFuKG9wdGlvbnM/LmV4dGVuZClcclxuXHRcdFx0ZXh0ZW5kID0gdHJ1ZVxyXG5cclxuXHRcdF9WQUxVRVMgPSB7fVxyXG5cdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIF9DT05URVhUKVxyXG5cdFx0aWYgZXh0ZW5kXHJcblx0XHRcdF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBDcmVhdG9yLmdldFVzZXJDb250ZXh0KG9wdGlvbnM/LnVzZXJJZCwgb3B0aW9ucz8uc3BhY2VJZCkpXHJcblx0XHRmb3JtdWxhX3N0ciA9IENyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhKFwidGhpc1wiLCBmb3JtdWxhX3N0cilcclxuXHJcblx0XHR0cnlcclxuXHRcdFx0ZGF0YSA9IENyZWF0b3IuZXZhbEluQ29udGV4dChmb3JtdWxhX3N0ciwgX1ZBTFVFUykgICAjIOatpOWkhOS4jeiDveeUqHdpbmRvdy5ldmFsIO+8jOS8muWvvOiHtOWPmOmHj+S9nOeUqOWfn+W8guW4uFxyXG5cdFx0XHRyZXR1cm4gZGF0YVxyXG5cdFx0Y2F0Y2ggZVxyXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46ICN7Zm9ybXVsYV9zdHJ9XCIsIGUpXHJcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdHRvYXN0cj8uZXJyb3IoXCLlhazlvI/miafooYzlh7rplJnkuobvvIzor7fmo4Dmn6XlhazlvI/phY3nva7mmK/lkKbmraPnoa7vvIFcIilcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46ICN7Zm9ybXVsYV9zdHJ9I3tlfVwiXHJcblxyXG5cdHJldHVybiBmb3JtdWxhX3N0clxyXG4iLCJDcmVhdG9yLkZvcm11bGFyID0ge307XG5cbkNyZWF0b3IuRm9ybXVsYXIuUFJFRklYID0gXCJfVkFMVUVTXCI7XG5cbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gZnVuY3Rpb24ocHJlZml4LCBmaWVsZFZhcmlhYmxlKSB7XG4gIHZhciByZWcsIHJldjtcbiAgcmVnID0gLyhcXHtbXnt9XSpcXH0pL2c7XG4gIHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZShyZWcsIGZ1bmN0aW9uKG0sICQxKSB7XG4gICAgcmV0dXJuIHByZWZpeCArICQxLnJlcGxhY2UoL1xce1xccyovLCBcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLCBcIlxcXCJdXCIpLnJlcGxhY2UoL1xccypcXC5cXHMqL2csIFwiXFxcIl1bXFxcIlwiKTtcbiAgfSk7XG4gIHJldHVybiByZXY7XG59O1xuXG5DcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYSA9IGZ1bmN0aW9uKGZvcm11bGFfc3RyKSB7XG4gIGlmIChfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTEpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5DcmVhdG9yLkZvcm11bGFyLnJ1biA9IGZ1bmN0aW9uKGZvcm11bGFfc3RyLCBfQ09OVEVYVCwgb3B0aW9ucykge1xuICB2YXIgX1ZBTFVFUywgZGF0YSwgZSwgZXh0ZW5kO1xuICBpZiAoZm9ybXVsYV9zdHIgJiYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cikpIHtcbiAgICBpZiAoIV8uaXNCb29sZWFuKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuZXh0ZW5kIDogdm9pZCAwKSkge1xuICAgICAgZXh0ZW5kID0gdHJ1ZTtcbiAgICB9XG4gICAgX1ZBTFVFUyA9IHt9O1xuICAgIF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBfQ09OVEVYVCk7XG4gICAgaWYgKGV4dGVuZCkge1xuICAgICAgX1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy51c2VySWQgOiB2b2lkIDAsIG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc3BhY2VJZCA6IHZvaWQgMCkpO1xuICAgIH1cbiAgICBmb3JtdWxhX3N0ciA9IENyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhKFwidGhpc1wiLCBmb3JtdWxhX3N0cik7XG4gICAgdHJ5IHtcbiAgICAgIGRhdGEgPSBDcmVhdG9yLmV2YWxJbkNvbnRleHQoZm9ybXVsYV9zdHIsIF9WQUxVRVMpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGUgPSBlcnJvcjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogXCIgKyBmb3JtdWxhX3N0ciwgZSk7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdG9hc3RyICE9PSBcInVuZGVmaW5lZFwiICYmIHRvYXN0ciAhPT0gbnVsbCkge1xuICAgICAgICAgIHRvYXN0ci5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46IFwiICsgZm9ybXVsYV9zdHIgKyBlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZvcm11bGFfc3RyO1xufTtcbiIsIlxuQ3JlYXRvci5vYmplY3RzQnlOYW1lID0ge30gICAjIOatpOWvueixoeWPquiDveWcqOehruS/neaJgOaciU9iamVjdOWIneWni+WMluWujOaIkOWQjuiwg+eUqO+8jCDlkKbliJnojrflj5bliLDnmoRvYmplY3TkuI3lhahcblxuQ3JlYXRvci5mb3JtYXRPYmplY3ROYW1lID0gKG9iamVjdF9uYW1lKS0+XG5cdGlmIG9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2Nmcy5maWxlcy4nKVxuXHRcdG9iamVjdF9uYW1lID0gb2JqZWN0X25hbWUucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcLicsICdnJyksICdfJylcblx0cmV0dXJuIG9iamVjdF9uYW1lXG5cbkNyZWF0b3IuT2JqZWN0ID0gKG9wdGlvbnMpLT5cblx0c2VsZiA9IHRoaXNcblx0aWYgKCFvcHRpb25zLm5hbWUpXG5cdFx0Y29uc29sZS5lcnJvcihvcHRpb25zKVxuXHRcdHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xuXG5cdHNlbGYuX2lkID0gb3B0aW9ucy5faWQgfHwgb3B0aW9ucy5uYW1lXG5cdHNlbGYuc3BhY2UgPSBvcHRpb25zLnNwYWNlXG5cdHNlbGYubmFtZSA9IG9wdGlvbnMubmFtZVxuXHRzZWxmLmxhYmVsID0gb3B0aW9ucy5sYWJlbFxuXHRzZWxmLmljb24gPSBvcHRpb25zLmljb25cblx0c2VsZi5kZXNjcmlwdGlvbiA9IG9wdGlvbnMuZGVzY3JpcHRpb25cblx0c2VsZi5pc192aWV3ID0gb3B0aW9ucy5pc192aWV3XG5cdGlmICFfLmlzQm9vbGVhbihvcHRpb25zLmlzX2VuYWJsZSkgIHx8IG9wdGlvbnMuaXNfZW5hYmxlID09IHRydWVcblx0XHRzZWxmLmlzX2VuYWJsZSA9IHRydWVcblx0ZWxzZVxuXHRcdHNlbGYuaXNfZW5hYmxlID0gZmFsc2Vcblx0c2VsZi5lbmFibGVfc2VhcmNoID0gb3B0aW9ucy5lbmFibGVfc2VhcmNoXG5cdHNlbGYuZW5hYmxlX2ZpbGVzID0gb3B0aW9ucy5lbmFibGVfZmlsZXNcblx0c2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrc1xuXHRzZWxmLmVuYWJsZV9ub3RlcyA9IG9wdGlvbnMuZW5hYmxlX25vdGVzXG5cdHNlbGYuZW5hYmxlX2F1ZGl0ID0gb3B0aW9ucy5lbmFibGVfYXVkaXRcblx0c2VsZi5oaWRkZW4gPSBvcHRpb25zLmhpZGRlblxuXHRzZWxmLmVuYWJsZV9hcGkgPSAob3B0aW9ucy5lbmFibGVfYXBpID09IHVuZGVmaW5lZCkgb3Igb3B0aW9ucy5lbmFibGVfYXBpXG5cdHNlbGYuY3VzdG9tID0gb3B0aW9ucy5jdXN0b21cblx0c2VsZi5lbmFibGVfc2hhcmUgPSBvcHRpb25zLmVuYWJsZV9zaGFyZVxuXHRzZWxmLmVuYWJsZV9pbnN0YW5jZXMgPSBvcHRpb25zLmVuYWJsZV9pbnN0YW5jZXNcblx0c2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWVcblx0c2VsZi5vcGVuX3dpbmRvdyA9IG9wdGlvbnMub3Blbl93aW5kb3dcblx0c2VsZi5maWx0ZXJfY29tcGFueSA9IG9wdGlvbnMuZmlsdGVyX2NvbXBhbnlcblx0c2VsZi5jYWxlbmRhciA9IF8uY2xvbmUob3B0aW9ucy5jYWxlbmRhcilcblx0c2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpXG5cdHNlbGYuZW5hYmxlX2NoYXR0ZXIgPSBvcHRpb25zLmVuYWJsZV9jaGF0dGVyXG5cdHNlbGYuZW5hYmxlX3RyYXNoID0gb3B0aW9ucy5lbmFibGVfdHJhc2hcblx0c2VsZi5lbmFibGVfc3BhY2VfZ2xvYmFsID0gb3B0aW9ucy5lbmFibGVfc3BhY2VfZ2xvYmFsXG5cdHNlbGYuZW5hYmxlX2FwcHJvdmFscyA9IG9wdGlvbnMuZW5hYmxlX2FwcHJvdmFsc1xuXHRzZWxmLmlkRmllbGROYW1lID0gJ19pZCdcblx0aWYgb3B0aW9ucy5kYXRhYmFzZV9uYW1lXG5cdFx0c2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lXG5cdGlmICghb3B0aW9ucy5maWVsZHMpXG5cdFx0Y29uc29sZS5lcnJvcihvcHRpb25zKVxuXHRcdHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xuXG5cdHNlbGYuZmllbGRzID0gXy5jbG9uZShvcHRpb25zLmZpZWxkcylcblxuXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdGlmIGZpZWxkX25hbWUgPT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWVcblx0XHRcdHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lXG5cdFx0aWYgZmllbGQucHJpbWFyeVxuXHRcdFx0c2VsZi5pZEZpZWxkTmFtZSA9IGZpZWxkX25hbWVcblxuXHRpZiAhb3B0aW9ucy5kYXRhYmFzZV9uYW1lIHx8IG9wdGlvbnMuZGF0YWJhc2VfbmFtZSA9PSAnbWV0ZW9yLW1vbmdvJ1xuXHRcdF8uZWFjaCBDcmVhdG9yLmJhc2VPYmplY3QuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRcdGlmICFzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXVxuXHRcdFx0XHRzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IHt9XG5cdFx0XHRzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoZmllbGQpLCBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSlcblxuXHRzZWxmLmxpc3Rfdmlld3MgPSB7fVxuXHRkZWZhdWx0Q29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMoc2VsZi5uYW1lKVxuXHRfLmVhY2ggb3B0aW9ucy5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0b2l0ZW0gPSBDcmVhdG9yLmNvbnZlcnRMaXN0VmlldyhkZWZhdWx0Q29sdW1ucywgaXRlbSwgaXRlbV9uYW1lKVxuXHRcdHNlbGYubGlzdF92aWV3c1tpdGVtX25hbWVdID0gb2l0ZW1cblxuXHRzZWxmLnRyaWdnZXJzID0gXy5jbG9uZShDcmVhdG9yLmJhc2VPYmplY3QudHJpZ2dlcnMpXG5cdF8uZWFjaCBvcHRpb25zLnRyaWdnZXJzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXVxuXHRcdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0ge31cblx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0ubmFtZSA9IGl0ZW1fbmFtZVxuXHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSlcblxuXHRzZWxmLmFjdGlvbnMgPSBfLmNsb25lKENyZWF0b3IuYmFzZU9iamVjdC5hY3Rpb25zKVxuXHRfLmVhY2ggb3B0aW9ucy5hY3Rpb25zLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYuYWN0aW9uc1tpdGVtX25hbWVdXG5cdFx0XHRzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IHt9XG5cdFx0Y29weUl0ZW0gPSBfLmNsb25lKHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKVxuXHRcdGRlbGV0ZSBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSAj5YWI5Yig6Zmk55u45YWz5bGe5oCn5YaN6YeN5bu65omN6IO95L+d6K+B5ZCO57ut6YeN5aSN5a6a5LmJ55qE5bGe5oCn6aG65bqP55Sf5pWIXG5cdFx0c2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChjb3B5SXRlbSwgaXRlbSlcblxuXHRfLmVhY2ggc2VsZi5hY3Rpb25zLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aXRlbS5uYW1lID0gaXRlbV9uYW1lXG5cblx0c2VsZi5yZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKHNlbGYubmFtZSlcblxuXHQjIOiuqeaJgOaciW9iamVjdOm7mOiupOacieaJgOaciWxpc3Rfdmlld3MvYWN0aW9ucy9yZWxhdGVkX29iamVjdHMvcmVhZGFibGVfZmllbGRzL2VkaXRhYmxlX2ZpZWxkc+WujOaVtOadg+mZkO+8jOivpeadg+mZkOWPr+iDveiiq+aVsOaNruW6k+S4reiuvue9rueahGFkbWluL3VzZXLmnYPpmZDopobnm5Zcblx0c2VsZi5wZXJtaXNzaW9uX3NldCA9IF8uY2xvbmUoQ3JlYXRvci5iYXNlT2JqZWN0LnBlcm1pc3Npb25fc2V0KVxuXHQjIGRlZmF1bHRMaXN0Vmlld3MgPSBfLmtleXMoc2VsZi5saXN0X3ZpZXdzKVxuXHQjIGRlZmF1bHRBY3Rpb25zID0gXy5rZXlzKHNlbGYuYWN0aW9ucylcblx0IyBkZWZhdWx0UmVsYXRlZE9iamVjdHMgPSBfLnBsdWNrKHNlbGYucmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcblx0IyBkZWZhdWx0UmVhZGFibGVGaWVsZHMgPSBbXVxuXHQjIGRlZmF1bHRFZGl0YWJsZUZpZWxkcyA9IFtdXG5cdCMgXy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0IyBcdGlmICEoZmllbGQuaGlkZGVuKSAgICAjMjMxIG9taXTlrZfmrrXmlK/mjIHlnKjpnZ7nvJbovpHpobXpnaLmn6XnnIssIOWboOatpOWIoOmZpOS6huatpOWkhOWvuW9taXTnmoTliKTmlq1cblx0IyBcdFx0ZGVmYXVsdFJlYWRhYmxlRmllbGRzLnB1c2ggZmllbGRfbmFtZVxuXHQjIFx0XHRpZiAhZmllbGQucmVhZG9ubHlcblx0IyBcdFx0XHRkZWZhdWx0RWRpdGFibGVGaWVsZHMucHVzaCBmaWVsZF9uYW1lXG5cblx0IyBfLmVhY2ggc2VsZi5wZXJtaXNzaW9uX3NldCwgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHQjIFx0aWYgaXRlbV9uYW1lID09IFwibm9uZVwiXG5cdCMgXHRcdHJldHVyblxuXHQjIFx0aWYgc2VsZi5saXN0X3ZpZXdzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5saXN0X3ZpZXdzID0gZGVmYXVsdExpc3RWaWV3c1xuXHQjIFx0aWYgc2VsZi5hY3Rpb25zXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5hY3Rpb25zID0gZGVmYXVsdEFjdGlvbnNcblx0IyBcdGlmIHNlbGYucmVsYXRlZF9vYmplY3RzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5yZWxhdGVkX29iamVjdHMgPSBkZWZhdWx0UmVsYXRlZE9iamVjdHNcblx0IyBcdGlmIHNlbGYuZmllbGRzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5yZWFkYWJsZV9maWVsZHMgPSBkZWZhdWx0UmVhZGFibGVGaWVsZHNcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmVkaXRhYmxlX2ZpZWxkcyA9IGRlZmF1bHRFZGl0YWJsZUZpZWxkc1xuXHR1bmxlc3Mgb3B0aW9ucy5wZXJtaXNzaW9uX3NldFxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fVxuXHRpZiAhKG9wdGlvbnMucGVybWlzc2lvbl9zZXQ/LmFkbWluKVxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQuYWRtaW4gPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJhZG1pblwiXSlcblx0aWYgIShvcHRpb25zLnBlcm1pc3Npb25fc2V0Py51c2VyKVxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQudXNlciA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcInVzZXJcIl0pXG5cdF8uZWFjaCBvcHRpb25zLnBlcm1pc3Npb25fc2V0LCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXVxuXHRcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0ge31cblx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSksIGl0ZW0pXG5cblx0IyDliY3nq6/moLnmja5wZXJtaXNzaW9uc+aUueWGmWZpZWxk55u45YWz5bGe5oCn77yM5ZCO56uv5Y+q6KaB6LWw6buY6K6k5bGe5oCn5bCx6KGM77yM5LiN6ZyA6KaB5pS55YaZXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHBlcm1pc3Npb25zID0gb3B0aW9ucy5wZXJtaXNzaW9uc1xuXHRcdGRpc2FibGVkX2xpc3Rfdmlld3MgPSBwZXJtaXNzaW9ucz8uZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdGlmIGRpc2FibGVkX2xpc3Rfdmlld3M/Lmxlbmd0aFxuXHRcdFx0ZGVmYXVsdExpc3RWaWV3SWQgPSBvcHRpb25zLmxpc3Rfdmlld3M/LmFsbD8uX2lkXG5cdFx0XHRpZiBkZWZhdWx0TGlzdFZpZXdJZFxuXHRcdFx0XHQjIOaKiuinhuWbvuadg+mZkOmFjee9ruS4rem7mOiupOeahGFsbOinhuWbvmlk6L2s5o2i5oiQYWxs5YWz6ZSu5a2XXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBfLm1hcCBkaXNhYmxlZF9saXN0X3ZpZXdzLCAobGlzdF92aWV3X2l0ZW0pIC0+XG5cdFx0XHRcdFx0cmV0dXJuIGlmIGRlZmF1bHRMaXN0Vmlld0lkID09IGxpc3Rfdmlld19pdGVtIHRoZW4gXCJhbGxcIiBlbHNlIGxpc3Rfdmlld19pdGVtXG5cdFx0c2VsZi5wZXJtaXNzaW9ucyA9IG5ldyBSZWFjdGl2ZVZhcihwZXJtaXNzaW9ucylcblx0XHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdFx0aWYgZmllbGRcblx0XHRcdFx0aWYgXy5pbmRleE9mKHBlcm1pc3Npb25zPy51bnJlYWRhYmxlX2ZpZWxkcywgZmllbGRfbmFtZSkgPCAwXG5cdFx0XHRcdFx0aWYgZmllbGQuaGlkZGVuXG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRpZiBfLmluZGV4T2YocGVybWlzc2lvbnM/LnVuZWRpdGFibGVfZmllbGRzLCBmaWVsZF9uYW1lKSA+IC0xXG5cdFx0XHRcdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcblx0XHRcdFx0XHRcdGZpZWxkLmRpc2FibGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0IyDlvZPlj6ror7vml7bvvIzlpoLmnpzkuI3ljrvmjonlv4XloavlrZfmrrXvvIxhdXRvZm9ybeaYr+S8muaKpemUmeeahFxuXHRcdFx0XHRcdFx0ZmllbGQucmVxdWlyZWQgPSBmYWxzZVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZmllbGQuaGlkZGVuID0gdHJ1ZVxuXHRlbHNlXG5cdFx0c2VsZi5wZXJtaXNzaW9ucyA9IG51bGxcblxuXHRfZGIgPSBDcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24ob3B0aW9ucylcblxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zW19kYi5fbmFtZV0gPSBfZGJcblxuXHRzZWxmLmRiID0gX2RiXG5cblx0c2VsZi5fY29sbGVjdGlvbl9uYW1lID0gX2RiLl9uYW1lXG5cblx0c2NoZW1hID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoc2VsZilcblx0c2VsZi5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHNjaGVtYSlcblx0aWYgc2VsZi5uYW1lICE9IFwidXNlcnNcIiBhbmQgc2VsZi5uYW1lICE9IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIiAmJiAhc2VsZi5pc192aWV3ICYmICFfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXG5cdFx0ZWxzZVxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxuXHRpZiBzZWxmLm5hbWUgPT0gXCJ1c2Vyc1wiXG5cdFx0X2RiLl9zaW1wbGVTY2hlbWEgPSBzZWxmLnNjaGVtYVxuXG5cdGlmIF8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSlcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtyZXBsYWNlOiB0cnVlfSlcblxuXHRDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGZcblxuXHRyZXR1cm4gc2VsZlxuXG5DcmVhdG9yLk9iamVjdC5wcm90b3R5cGUuaTE4biA9ICgpLT5cblx0IyBzZXQgb2JqZWN0IGxhYmVsXG5cdHNlbGYgPSB0aGlzXG5cblx0a2V5ID0gc2VsZi5uYW1lXG5cdGlmIHQoa2V5KSA9PSBrZXlcblx0XHRpZiAhc2VsZi5sYWJlbFxuXHRcdFx0c2VsZi5sYWJlbCA9IHNlbGYubmFtZVxuXHRlbHNlXG5cdFx0c2VsZi5sYWJlbCA9IHQoa2V5KVxuXG5cdCMgc2V0IGZpZWxkIGxhYmVsc1xuXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdGZrZXkgPSBzZWxmLm5hbWUgKyBcIl9cIiArIGZpZWxkX25hbWVcblx0XHRpZiB0KGZrZXkpID09IGZrZXlcblx0XHRcdGlmICFmaWVsZC5sYWJlbFxuXHRcdFx0XHRmaWVsZC5sYWJlbCA9IGZpZWxkX25hbWVcblx0XHRlbHNlXG5cdFx0XHRmaWVsZC5sYWJlbCA9IHQoZmtleSlcblx0XHRzZWxmLnNjaGVtYT8uX3NjaGVtYT9bZmllbGRfbmFtZV0/LmxhYmVsID0gZmllbGQubGFiZWxcblxuXG5cdCMgc2V0IGxpc3R2aWV3IGxhYmVsc1xuXHRfLmVhY2ggc2VsZi5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aTE4bl9rZXkgPSBzZWxmLm5hbWUgKyBcIl9saXN0dmlld19cIiArIGl0ZW1fbmFtZVxuXHRcdGlmIHQoaTE4bl9rZXkpID09IGkxOG5fa2V5XG5cdFx0XHRpZiAhaXRlbS5sYWJlbFxuXHRcdFx0XHRpdGVtLmxhYmVsID0gaXRlbV9uYW1lXG5cdFx0ZWxzZVxuXHRcdFx0aXRlbS5sYWJlbCA9IHQoaTE4bl9rZXkpXG5cblxuQ3JlYXRvci5nZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCA9IChvYmplY3QpLT5cblx0aWYgb2JqZWN0XG5cdFx0aWYgIW9iamVjdC5kYXRhYmFzZV9uYW1lIHx8IG9iamVjdC5kYXRhYmFzZV9uYW1lID09ICdtZXRlb3ItbW9uZ28nXG5cdFx0XHRyZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCJcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gXCIvYXBpL29kYXRhLyN7b2JqZWN0LmRhdGFiYXNlX25hbWV9XCJcblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cblx0TWV0ZW9yLnN0YXJ0dXAgLT5cblx0XHRUcmFja2VyLmF1dG9ydW4gLT5cblx0XHRcdGlmIFNlc3Npb24uZ2V0KFwic3RlZWRvcy1sb2NhbGVcIikgJiYgQ3JlYXRvci5ib290c3RyYXBMb2FkZWQ/LmdldCgpXG5cdFx0XHRcdF8uZWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvYmplY3QsIG9iamVjdF9uYW1lKS0+XG5cdFx0XHRcdFx0b2JqZWN0LmkxOG4oKVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRpZiAhQ3JlYXRvci5ib290c3RyYXBMb2FkZWQgJiYgQ3JlYXRvci5PYmplY3RzXG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKG9iamVjdCktPlxuXHRcdFx0bmV3IENyZWF0b3IuT2JqZWN0KG9iamVjdClcblxuIiwiQ3JlYXRvci5vYmplY3RzQnlOYW1lID0ge307XG5cbkNyZWF0b3IuZm9ybWF0T2JqZWN0TmFtZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGlmIChvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjZnMuZmlsZXMuJykpIHtcbiAgICBvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpO1xuICB9XG4gIHJldHVybiBvYmplY3RfbmFtZTtcbn07XG5cbkNyZWF0b3IuT2JqZWN0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICB2YXIgX2RiLCBkZWZhdWx0Q29sdW1ucywgZGVmYXVsdExpc3RWaWV3SWQsIGRpc2FibGVkX2xpc3Rfdmlld3MsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHNjaGVtYSwgc2VsZjtcbiAgc2VsZiA9IHRoaXM7XG4gIGlmICghb3B0aW9ucy5uYW1lKSB7XG4gICAgY29uc29sZS5lcnJvcihvcHRpb25zKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IG5hbWUnKTtcbiAgfVxuICBzZWxmLl9pZCA9IG9wdGlvbnMuX2lkIHx8IG9wdGlvbnMubmFtZTtcbiAgc2VsZi5zcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gIHNlbGYubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgc2VsZi5sYWJlbCA9IG9wdGlvbnMubGFiZWw7XG4gIHNlbGYuaWNvbiA9IG9wdGlvbnMuaWNvbjtcbiAgc2VsZi5kZXNjcmlwdGlvbiA9IG9wdGlvbnMuZGVzY3JpcHRpb247XG4gIHNlbGYuaXNfdmlldyA9IG9wdGlvbnMuaXNfdmlldztcbiAgaWYgKCFfLmlzQm9vbGVhbihvcHRpb25zLmlzX2VuYWJsZSkgfHwgb3B0aW9ucy5pc19lbmFibGUgPT09IHRydWUpIHtcbiAgICBzZWxmLmlzX2VuYWJsZSA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5pc19lbmFibGUgPSBmYWxzZTtcbiAgfVxuICBzZWxmLmVuYWJsZV9zZWFyY2ggPSBvcHRpb25zLmVuYWJsZV9zZWFyY2g7XG4gIHNlbGYuZW5hYmxlX2ZpbGVzID0gb3B0aW9ucy5lbmFibGVfZmlsZXM7XG4gIHNlbGYuZW5hYmxlX3Rhc2tzID0gb3B0aW9ucy5lbmFibGVfdGFza3M7XG4gIHNlbGYuZW5hYmxlX25vdGVzID0gb3B0aW9ucy5lbmFibGVfbm90ZXM7XG4gIHNlbGYuZW5hYmxlX2F1ZGl0ID0gb3B0aW9ucy5lbmFibGVfYXVkaXQ7XG4gIHNlbGYuaGlkZGVuID0gb3B0aW9ucy5oaWRkZW47XG4gIHNlbGYuZW5hYmxlX2FwaSA9IChvcHRpb25zLmVuYWJsZV9hcGkgPT09IHZvaWQgMCkgfHwgb3B0aW9ucy5lbmFibGVfYXBpO1xuICBzZWxmLmN1c3RvbSA9IG9wdGlvbnMuY3VzdG9tO1xuICBzZWxmLmVuYWJsZV9zaGFyZSA9IG9wdGlvbnMuZW5hYmxlX3NoYXJlO1xuICBzZWxmLmVuYWJsZV9pbnN0YW5jZXMgPSBvcHRpb25zLmVuYWJsZV9pbnN0YW5jZXM7XG4gIHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlO1xuICBzZWxmLm9wZW5fd2luZG93ID0gb3B0aW9ucy5vcGVuX3dpbmRvdztcbiAgc2VsZi5maWx0ZXJfY29tcGFueSA9IG9wdGlvbnMuZmlsdGVyX2NvbXBhbnk7XG4gIHNlbGYuY2FsZW5kYXIgPSBfLmNsb25lKG9wdGlvbnMuY2FsZW5kYXIpO1xuICBzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcik7XG4gIHNlbGYuZW5hYmxlX2NoYXR0ZXIgPSBvcHRpb25zLmVuYWJsZV9jaGF0dGVyO1xuICBzZWxmLmVuYWJsZV90cmFzaCA9IG9wdGlvbnMuZW5hYmxlX3RyYXNoO1xuICBzZWxmLmVuYWJsZV9zcGFjZV9nbG9iYWwgPSBvcHRpb25zLmVuYWJsZV9zcGFjZV9nbG9iYWw7XG4gIHNlbGYuZW5hYmxlX2FwcHJvdmFscyA9IG9wdGlvbnMuZW5hYmxlX2FwcHJvdmFscztcbiAgc2VsZi5pZEZpZWxkTmFtZSA9ICdfaWQnO1xuICBpZiAob3B0aW9ucy5kYXRhYmFzZV9uYW1lKSB7XG4gICAgc2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lO1xuICB9XG4gIGlmICghb3B0aW9ucy5maWVsZHMpIHtcbiAgICBjb25zb2xlLmVycm9yKG9wdGlvbnMpO1xuICAgIHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xuICB9XG4gIHNlbGYuZmllbGRzID0gXy5jbG9uZShvcHRpb25zLmZpZWxkcyk7XG4gIF8uZWFjaChzZWxmLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoZmllbGRfbmFtZSA9PT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWUpIHtcbiAgICAgIHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICBpZiAoZmllbGQucHJpbWFyeSkge1xuICAgICAgcmV0dXJuIHNlbGYuaWRGaWVsZE5hbWUgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgfSk7XG4gIGlmICghb3B0aW9ucy5kYXRhYmFzZV9uYW1lIHx8IG9wdGlvbnMuZGF0YWJhc2VfbmFtZSA9PT0gJ21ldGVvci1tb25nbycpIHtcbiAgICBfLmVhY2goQ3JlYXRvci5iYXNlT2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgIGlmICghc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pIHtcbiAgICAgICAgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoZmllbGQpLCBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSk7XG4gICAgfSk7XG4gIH1cbiAgc2VsZi5saXN0X3ZpZXdzID0ge307XG4gIGRlZmF1bHRDb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhzZWxmLm5hbWUpO1xuICBfLmVhY2gob3B0aW9ucy5saXN0X3ZpZXdzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgb2l0ZW07XG4gICAgb2l0ZW0gPSBDcmVhdG9yLmNvbnZlcnRMaXN0VmlldyhkZWZhdWx0Q29sdW1ucywgaXRlbSwgaXRlbV9uYW1lKTtcbiAgICByZXR1cm4gc2VsZi5saXN0X3ZpZXdzW2l0ZW1fbmFtZV0gPSBvaXRlbTtcbiAgfSk7XG4gIHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKENyZWF0b3IuYmFzZU9iamVjdC50cmlnZ2Vycyk7XG4gIF8uZWFjaChvcHRpb25zLnRyaWdnZXJzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICBpZiAoIXNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXS5uYW1lID0gaXRlbV9uYW1lO1xuICAgIHJldHVybiBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSksIGl0ZW0pO1xuICB9KTtcbiAgc2VsZi5hY3Rpb25zID0gXy5jbG9uZShDcmVhdG9yLmJhc2VPYmplY3QuYWN0aW9ucyk7XG4gIF8uZWFjaChvcHRpb25zLmFjdGlvbnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHZhciBjb3B5SXRlbTtcbiAgICBpZiAoIXNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICBjb3B5SXRlbSA9IF8uY2xvbmUoc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pO1xuICAgIGRlbGV0ZSBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXTtcbiAgICByZXR1cm4gc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChjb3B5SXRlbSwgaXRlbSk7XG4gIH0pO1xuICBfLmVhY2goc2VsZi5hY3Rpb25zLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICByZXR1cm4gaXRlbS5uYW1lID0gaXRlbV9uYW1lO1xuICB9KTtcbiAgc2VsZi5yZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKHNlbGYubmFtZSk7XG4gIHNlbGYucGVybWlzc2lvbl9zZXQgPSBfLmNsb25lKENyZWF0b3IuYmFzZU9iamVjdC5wZXJtaXNzaW9uX3NldCk7XG4gIGlmICghb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fTtcbiAgfVxuICBpZiAoISgocmVmID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZi5hZG1pbiA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LmFkbWluID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1wiYWRtaW5cIl0pO1xuICB9XG4gIGlmICghKChyZWYxID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZjEudXNlciA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LnVzZXIgPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJ1c2VyXCJdKTtcbiAgfVxuICBfLmVhY2gob3B0aW9ucy5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgaWYgKCFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pLCBpdGVtKTtcbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnM7XG4gICAgZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzIDogdm9pZCAwO1xuICAgIGlmIChkaXNhYmxlZF9saXN0X3ZpZXdzICE9IG51bGwgPyBkaXNhYmxlZF9saXN0X3ZpZXdzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgZGVmYXVsdExpc3RWaWV3SWQgPSAocmVmMiA9IG9wdGlvbnMubGlzdF92aWV3cykgIT0gbnVsbCA/IChyZWYzID0gcmVmMi5hbGwpICE9IG51bGwgPyByZWYzLl9pZCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChkZWZhdWx0TGlzdFZpZXdJZCkge1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAoZGlzYWJsZWRfbGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3X2l0ZW0pIHtcbiAgICAgICAgICBpZiAoZGVmYXVsdExpc3RWaWV3SWQgPT09IGxpc3Rfdmlld19pdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJhbGxcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3Rfdmlld19pdGVtO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYucGVybWlzc2lvbnMgPSBuZXcgUmVhY3RpdmVWYXIocGVybWlzc2lvbnMpO1xuICAgIF8uZWFjaChzZWxmLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgIGlmIChmaWVsZCkge1xuICAgICAgICBpZiAoXy5pbmRleE9mKHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyA6IHZvaWQgMCwgZmllbGRfbmFtZSkgPCAwKSB7XG4gICAgICAgICAgaWYgKGZpZWxkLmhpZGRlbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXy5pbmRleE9mKHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA6IHZvaWQgMCwgZmllbGRfbmFtZSkgPiAtMSkge1xuICAgICAgICAgICAgZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgICAgICAgICAgZmllbGQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLnJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmaWVsZC5oaWRkZW4gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5wZXJtaXNzaW9ucyA9IG51bGw7XG4gIH1cbiAgX2RiID0gQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uKG9wdGlvbnMpO1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zW19kYi5fbmFtZV0gPSBfZGI7XG4gIHNlbGYuZGIgPSBfZGI7XG4gIHNlbGYuX2NvbGxlY3Rpb25fbmFtZSA9IF9kYi5fbmFtZTtcbiAgc2NoZW1hID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoc2VsZik7XG4gIHNlbGYuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYShzY2hlbWEpO1xuICBpZiAoc2VsZi5uYW1lICE9PSBcInVzZXJzXCIgJiYgc2VsZi5uYW1lICE9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIgJiYgIXNlbGYuaXNfdmlldyAmJiAhXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiXSwgc2VsZi5uYW1lKSkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChzZWxmLm5hbWUgPT09IFwidXNlcnNcIikge1xuICAgIF9kYi5fc2ltcGxlU2NoZW1hID0gc2VsZi5zY2hlbWE7XG4gIH1cbiAgaWYgKF8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSkpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGY7XG4gIHJldHVybiBzZWxmO1xufTtcblxuQ3JlYXRvci5PYmplY3QucHJvdG90eXBlLmkxOG4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGtleSwgc2VsZjtcbiAgc2VsZiA9IHRoaXM7XG4gIGtleSA9IHNlbGYubmFtZTtcbiAgaWYgKHQoa2V5KSA9PT0ga2V5KSB7XG4gICAgaWYgKCFzZWxmLmxhYmVsKSB7XG4gICAgICBzZWxmLmxhYmVsID0gc2VsZi5uYW1lO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzZWxmLmxhYmVsID0gdChrZXkpO1xuICB9XG4gIF8uZWFjaChzZWxmLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICB2YXIgZmtleSwgcmVmLCByZWYxLCByZWYyO1xuICAgIGZrZXkgPSBzZWxmLm5hbWUgKyBcIl9cIiArIGZpZWxkX25hbWU7XG4gICAgaWYgKHQoZmtleSkgPT09IGZrZXkpIHtcbiAgICAgIGlmICghZmllbGQubGFiZWwpIHtcbiAgICAgICAgZmllbGQubGFiZWwgPSBmaWVsZF9uYW1lO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmaWVsZC5sYWJlbCA9IHQoZmtleSk7XG4gICAgfVxuICAgIHJldHVybiAocmVmID0gc2VsZi5zY2hlbWEpICE9IG51bGwgPyAocmVmMSA9IHJlZi5fc2NoZW1hKSAhPSBudWxsID8gKHJlZjIgPSByZWYxW2ZpZWxkX25hbWVdKSAhPSBudWxsID8gcmVmMi5sYWJlbCA9IGZpZWxkLmxhYmVsIDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwO1xuICB9KTtcbiAgcmV0dXJuIF8uZWFjaChzZWxmLmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHZhciBpMThuX2tleTtcbiAgICBpMThuX2tleSA9IHNlbGYubmFtZSArIFwiX2xpc3R2aWV3X1wiICsgaXRlbV9uYW1lO1xuICAgIGlmICh0KGkxOG5fa2V5KSA9PT0gaTE4bl9rZXkpIHtcbiAgICAgIGlmICghaXRlbS5sYWJlbCkge1xuICAgICAgICByZXR1cm4gaXRlbS5sYWJlbCA9IGl0ZW1fbmFtZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGl0ZW0ubGFiZWwgPSB0KGkxOG5fa2V5KTtcbiAgICB9XG4gIH0pO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0KSB7XG4gICAgaWYgKCFvYmplY3QuZGF0YWJhc2VfbmFtZSB8fCBvYmplY3QuZGF0YWJhc2VfbmFtZSA9PT0gJ21ldGVvci1tb25nbycpIHtcbiAgICAgIHJldHVybiBcIi9hcGkvb2RhdGEvdjRcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiL2FwaS9vZGF0YS9cIiArIG9iamVjdC5kYXRhYmFzZV9uYW1lO1xuICAgIH1cbiAgfVxufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlZjtcbiAgICAgIGlmIChTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICYmICgocmVmID0gQ3JlYXRvci5ib290c3RyYXBMb2FkZWQpICE9IG51bGwgPyByZWYuZ2V0KCkgOiB2b2lkIDApKSB7XG4gICAgICAgIHJldHVybiBfLmVhY2goQ3JlYXRvci5vYmplY3RzQnlOYW1lLCBmdW5jdGlvbihvYmplY3QsIG9iamVjdF9uYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIG9iamVjdC5pMThuKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIGlmICghQ3JlYXRvci5ib290c3RyYXBMb2FkZWQgJiYgQ3JlYXRvci5PYmplY3RzKSB7XG4gICAgcmV0dXJuIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgcmV0dXJuIG5ldyBDcmVhdG9yLk9iamVjdChvYmplY3QpO1xuICAgIH0pO1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hID0gKG9iaikgLT5cclxuXHRzY2hlbWEgPSB7fVxyXG5cclxuXHRmaWVsZHNBcnIgPSBbXVxyXG5cclxuXHRfLmVhY2ggb2JqLmZpZWxkcyAsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG5cdFx0aWYgIV8uaGFzKGZpZWxkLCBcIm5hbWVcIilcclxuXHRcdFx0ZmllbGQubmFtZSA9IGZpZWxkX25hbWVcclxuXHRcdGZpZWxkc0Fyci5wdXNoIGZpZWxkXHJcblxyXG5cdF8uZWFjaCBfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgKGZpZWxkKS0+XHJcblxyXG5cdFx0ZmllbGRfbmFtZSA9IGZpZWxkLm5hbWVcclxuXHJcblx0XHRmcyA9IHt9XHJcblx0XHRpZiBmaWVsZC5yZWdFeFxyXG5cdFx0XHRmcy5yZWdFeCA9IGZpZWxkLnJlZ0V4XHJcblx0XHRmcy5hdXRvZm9ybSA9IHt9XHJcblx0XHRmcy5hdXRvZm9ybS5tdWx0aXBsZSA9IGZpZWxkLm11bHRpcGxlXHJcblx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cclxuXHJcblx0XHRhdXRvZm9ybV90eXBlID0gZmllbGQuYXV0b2Zvcm0/LnR5cGVcclxuXHJcblx0XHRpZiBmaWVsZC50eXBlID09IFwidGV4dFwiIG9yIGZpZWxkLnR5cGUgPT0gXCJwaG9uZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIlt0ZXh0XVwiIG9yIGZpZWxkLnR5cGUgPT0gXCJbcGhvbmVdXCJcclxuXHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdjb2RlJ1xyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTJcclxuXHRcdFx0aWYgZmllbGQubGFuZ3VhZ2VcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5sYW5ndWFnZSA9IGZpZWxkLmxhbmd1YWdlXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ0ZXh0YXJlYVwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIlxyXG5cdFx0XHRmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCA2XHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJwYXNzd29yZFwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXHJcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKClcclxuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXHJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0XHR0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIlxyXG5cdFx0XHRcdFx0XHRkYXRlTW9iaWxlT3B0aW9uczpcclxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGVcIlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLm91dEZvcm1hdCA9ICd5eXl5LU1NLWRkJztcclxuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXHJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcclxuXHRcdFx0XHRcdFx0dGltZXpvbmVJZDogXCJ1dGNcIlxyXG5cdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXHJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcclxuXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRldGltZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXHJcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKClcclxuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXHJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0XHR0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIlxyXG5cdFx0XHRcdFx0XHRkYXRlTW9iaWxlT3B0aW9uczpcclxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxyXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cclxuXHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXHJcblx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XHJcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXHJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIltPYmplY3RdXCJcclxuXHRcdFx0ZnMudHlwZSA9IFtPYmplY3RdXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJodG1sXCJcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdHR5cGU6IFwic3VtbWVybm90ZVwiXHJcblx0XHRcdFx0Y2xhc3M6ICdlZGl0b3InXHJcblx0XHRcdFx0c2V0dGluZ3M6XHJcblx0XHRcdFx0XHRoZWlnaHQ6IDIwMFxyXG5cdFx0XHRcdFx0ZGlhbG9nc0luQm9keTogdHJ1ZVxyXG5cdFx0XHRcdFx0dG9vbGJhcjogIFtcclxuXHRcdFx0XHRcdFx0Wydmb250MScsIFsnc3R5bGUnXV0sXHJcblx0XHRcdFx0XHRcdFsnZm9udDInLCBbJ2JvbGQnLCAndW5kZXJsaW5lJywgJ2l0YWxpYycsICdjbGVhciddXSxcclxuXHRcdFx0XHRcdFx0Wydmb250MycsIFsnZm9udG5hbWUnXV0sXHJcblx0XHRcdFx0XHRcdFsnY29sb3InLCBbJ2NvbG9yJ11dLFxyXG5cdFx0XHRcdFx0XHRbJ3BhcmEnLCBbJ3VsJywgJ29sJywgJ3BhcmFncmFwaCddXSxcclxuXHRcdFx0XHRcdFx0Wyd0YWJsZScsIFsndGFibGUnXV0sXHJcblx0XHRcdFx0XHRcdFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sXHJcblx0XHRcdFx0XHRcdFsndmlldycsIFsnY29kZXZpZXcnXV1cclxuXHRcdFx0XHRcdF1cclxuXHRcdFx0XHRcdGZvbnROYW1lczogWydBcmlhbCcsICdDb21pYyBTYW5zIE1TJywgJ0NvdXJpZXIgTmV3JywgJ0hlbHZldGljYScsICdJbXBhY3QnLCAn5a6L5L2TJywn6buR5L2TJywn5b6u6L2v6ZuF6buRJywn5Lu/5a6LJywn5qW35L2TJywn6Zq25LmmJywn5bm85ZyGJ11cclxuXHJcblx0XHRlbHNlIGlmIChmaWVsZC50eXBlID09IFwibG9va3VwXCIgb3IgZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIilcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHJcblx0XHRcdGlmICFmaWVsZC5oaWRkZW5cclxuXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZmlsdGVycyA9IGZpZWxkLmZpbHRlcnNcclxuXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVwZW5kT24gPSBmaWVsZC5kZXBlbmRfb25cclxuXHJcblx0XHRcdFx0aWYgZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uXHJcblx0XHRcdFx0XHRmcy5iZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cclxuXHJcblx0XHRcdFx0ZnMuZmlsdGVyc0Z1bmN0aW9uID0gaWYgZmllbGQuZmlsdGVyc0Z1bmN0aW9uIHRoZW4gZmllbGQuZmlsdGVyc0Z1bmN0aW9uIGVsc2UgQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnNcclxuXHJcblx0XHRcdFx0aWYgZmllbGQub3B0aW9uc0Z1bmN0aW9uXHJcblx0XHRcdFx0XHRmcy5vcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb25cclxuXHJcblx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvXHJcblxyXG5cdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdGlmIGZpZWxkLmNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWVsZC5jcmVhdGVGdW5jdGlvbilcclxuXHRcdFx0XHRcdFx0XHRmcy5jcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpZWxkLnJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdFx0XHRcdF9yZWZfb2JqID0gQ3JlYXRvci5PYmplY3RzW2ZpZWxkLnJlZmVyZW5jZV90b11cclxuXHRcdFx0XHRcdFx0XHRcdGlmIF9yZWZfb2JqPy5wZXJtaXNzaW9ucz8uYWxsb3dDcmVhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5jcmVhdGVGdW5jdGlvbiA9IChsb29rdXBfZmllbGQpLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRNb2RhbC5zaG93KFwiQ3JlYXRvck9iamVjdE1vZGFsXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb246IFwiQ3JlYXRvci5Db2xsZWN0aW9ucy4je0NyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8pLl9uYW1lfVwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9ybUlkOiBcIm5ldyN7ZmllbGQucmVmZXJlbmNlX3RvLnJlcGxhY2UoJy4nLCdfJyl9XCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogXCIje2ZpZWxkLnJlZmVyZW5jZV90b31cIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9wZXJhdGlvbjogXCJpbnNlcnRcIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9uU3VjY2VzczogKG9wZXJhdGlvbiwgcmVzdWx0KS0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgcmVzdWx0Lm9iamVjdF9uYW1lID09IFwib2JqZWN0c1wiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFt7bGFiZWw6IHJlc3VsdC52YWx1ZS5sYWJlbCwgdmFsdWU6IHJlc3VsdC52YWx1ZS5uYW1lLCBpY29uOiByZXN1bHQudmFsdWUuaWNvbn1dLCByZXN1bHQudmFsdWUubmFtZSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbe2xhYmVsOiByZXN1bHQudmFsdWVbb2JqZWN0Lk5BTUVfRklFTERfS0VZXSB8fCByZXN1bHQudmFsdWUubGFiZWwgfHwgcmVzdWx0LnZhbHVlLm5hbWUsIHZhbHVlOiByZXN1bHQuX2lkfV0sIHJlc3VsdC5faWQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmFsc2VcclxuXHJcblx0XHRcdFx0XHRpZiBfLmlzQm9vbGVhbihmaWVsZC5jcmVhdGUpXHJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZpZWxkLmNyZWF0ZVxyXG5cclxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV9zb3J0XHJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNTb3J0ID0gZmllbGQucmVmZXJlbmNlX3NvcnRcclxuXHJcblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfbGltaXRcclxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc0xpbWl0ID0gZmllbGQucmVmZXJlbmNlX2xpbWl0XHJcblxyXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvID09IFwidXNlcnNcIlxyXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3R1c2VyXCJcclxuXHRcdFx0XHRcdFx0aWYgIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdFxyXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5Y2V5L2N5LiL55qE5pWw5o2uXHJcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTlj6/ku6XooqvmlLnlhpnopobnm5bmiJB0cnVlL2ZhbHNl5oiW5YW25LuWZnVuY3Rpb25cclxuXHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT0gdW5kZWZpbmVkXHJcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxyXG5cdFx0XHRcdFx0XHRcdFx0IyDlr7nlvZPliY3lr7nosaHmnIl2aWV3QWxsUmVjb3Jkc+adg+mZkOWImeS4jemZkOWItuaJgOWxnuWNleS9jeWIl+ihqOafpeeci+adg+mZkO+8jOWQpuWImeWPquaYvuekuuW9k+WJjeaJgOWxnuWNleS9jVxyXG5cdFx0XHRcdFx0XHRcdFx0IyDms6jmhI/kuI3mmK9yZWZlcmVuY2VfdG/lr7nosaHnmoR2aWV3QWxsUmVjb3Jkc+adg+mZkO+8jOiAjOaYr+W9k+WJjeWvueixoeeahFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zPy5nZXQoKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5a2X5q615omA5bGe5a+56LGh5piv55So5oi35oiW57uE57uH77yM5YiZ5piv5ZCm6ZmQ5Yi25pi+56S65omA5bGe5Y2V5L2N6YOo6Zeo5LiObW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWFs+iBlFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0Z1bmN0aW9uIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5Y2V5L2NXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0ZWxzZSBpZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT0gXCJvcmdhbml6YXRpb25zXCJcclxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0b3JnXCJcclxuXHRcdFx0XHRcdFx0aWYgIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdFxyXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5Y2V5L2N5LiL55qE5pWw5o2uXHJcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTlj6/ku6XooqvmlLnlhpnopobnm5bmiJB0cnVlL2ZhbHNl5oiW5YW25LuWZnVuY3Rpb25cclxuXHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT0gdW5kZWZpbmVkXHJcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxyXG5cdFx0XHRcdFx0XHRcdFx0IyDlr7nlvZPliY3lr7nosaHmnIl2aWV3QWxsUmVjb3Jkc+adg+mZkOWImeS4jemZkOWItuaJgOWxnuWNleS9jeWIl+ihqOafpeeci+adg+mZkO+8jOWQpuWImeWPquaYvuekuuW9k+WJjeaJgOWxnuWNleS9jVxyXG5cdFx0XHRcdFx0XHRcdFx0IyDms6jmhI/kuI3mmK9yZWZlcmVuY2VfdG/lr7nosaHnmoR2aWV3QWxsUmVjb3Jkc+adg+mZkO+8jOiAjOaYr+W9k+WJjeWvueixoeeahFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zPy5nZXQoKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5a2X5q615omA5bGe5a+56LGh5piv55So5oi35oiW57uE57uH77yM5YiZ5piv5ZCm6ZmQ5Yi25pi+56S65omA5bGe5Y2V5L2N6YOo6Zeo5LiObW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWFs+iBlFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0Z1bmN0aW9uIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5Y2V5L2NXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRpZiB0eXBlb2YoZmllbGQucmVmZXJlbmNlX3RvKSA9PSBcImZ1bmN0aW9uXCJcclxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvKClcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cclxuXHJcblx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShfcmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0XHRcdGZzLnR5cGUgPSBPYmplY3RcclxuXHRcdFx0XHRcdFx0XHRmcy5ibGFja2JveCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZVxyXG5cclxuXHRcdFx0XHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLm9cIl0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBTdHJpbmdcclxuXHRcdFx0XHRcdFx0XHRcdGF1dG9mb3JtOiB7b21pdDogdHJ1ZX1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuaWRzXCJdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogW1N0cmluZ11cclxuXHRcdFx0XHRcdFx0XHRcdGF1dG9mb3JtOiB7b21pdDogdHJ1ZX1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90byA9IFtfcmVmZXJlbmNlX3RvXVxyXG5cclxuXHRcdFx0XHRcdFx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXVxyXG5cdFx0XHRcdFx0XHRpZiBfb2JqZWN0IGFuZCBfb2JqZWN0LmVuYWJsZV90cmVlXHJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0VHJlZVwiXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiXHJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZCA9IGZpZWxkLm9wdGlvbnNNZXRob2QgfHwgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCJcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kUGFyYW1zID0gKCktPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XHJcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzID0gW11cclxuXHRcdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8uZm9yRWFjaCAoX3JlZmVyZW5jZSktPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIF9vYmplY3RcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2gge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogX29iamVjdD8ubGFiZWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGljb246IF9vYmplY3Q/Lmljb25cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpbms6ICgpLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiL2FwcC8je1Nlc3Npb24uZ2V0KCdhcHBfaWQnKX0vI3tfcmVmZXJlbmNlfS92aWV3L1wiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdDogX3JlZmVyZW5jZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGluazogKCktPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCIvYXBwLyN7U2Vzc2lvbi5nZXQoJ2FwcF9pZCcpfS8je19yZWZlcmVuY2V9L3ZpZXcvXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCJcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb25cclxuXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJzZWxlY3RcIlxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmFsc2VcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0XCJcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gXCJcIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiY3VycmVuY3lcIlxyXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxyXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcclxuXHRcdFx0aWYgZmllbGQ/LnNjYWxlXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZVxyXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXHJcblx0XHRcdGVsc2UgaWYgZmllbGQ/LnNjYWxlICE9IDBcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IDJcclxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibnVtYmVyXCJcclxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XHJcblx0XHRcdGlmIGZpZWxkPy5zY2FsZVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGVcclxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYm9vbGVhblwiXHJcblx0XHRcdGZzLnR5cGUgPSBCb29sZWFuXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi1jaGVja2JveFwiXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJyZWZlcmVuY2VcIlxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJjaGVja2JveFwiXHJcblx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3QtY2hlY2tib3hcIlxyXG5cdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZmlsZVwiIGFuZCBmaWVsZC5jb2xsZWN0aW9uXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cclxuXHRcdFx0XHRcdGF1dG9mb3JtOlxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogZmllbGQuY29sbGVjdGlvblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gZmllbGQuY29sbGVjdGlvblxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZmlsZXNpemVcIlxyXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZXNpemUnXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJPYmplY3RcIiB8fCBmaWVsZC50eXBlID09IFwib2JqZWN0XCJcclxuXHRcdFx0ZnMudHlwZSA9IE9iamVjdFxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZ3JpZFwiXHJcblx0XHRcdGZzLnR5cGUgPSBBcnJheVxyXG5cdFx0XHRmcy5hdXRvZm9ybS5lZGl0YWJsZSA9IHRydWVcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0dyaWRcIlxyXG5cclxuXHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cclxuXHRcdFx0XHR0eXBlOiBPYmplY3RcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImltYWdlXCJcclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxyXG5cdFx0XHRcdFx0YXV0b2Zvcm06XHJcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnaW1hZ2VzJ1xyXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdpbWFnZS8qJ1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2ltYWdlcydcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKidcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImF2YXRhclwiXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cclxuXHRcdFx0XHRcdGF1dG9mb3JtOlxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2F2YXRhcnMnXHJcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2ltYWdlLyonXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXZhdGFycydcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKidcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImF1ZGlvXCJcclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxyXG5cdFx0XHRcdFx0YXV0b2Zvcm06XHJcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnYXVkaW9zJ1xyXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdhdWRpby8qJ1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F1ZGlvcydcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnYXVkaW8vKidcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInZpZGVvXCJcclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxyXG5cdFx0XHRcdFx0YXV0b2Zvcm06XHJcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAndmlkZW9zJ1xyXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICd2aWRlby8qJ1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ3ZpZGVvcydcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAndmlkZW8vKidcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImxvY2F0aW9uXCJcclxuXHRcdFx0ZnMudHlwZSA9IE9iamVjdFxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJsb2NhdGlvblwiXHJcblx0XHRcdGZzLmF1dG9mb3JtLnN5c3RlbSA9IGZpZWxkLnN5c3RlbSB8fCBcIndnczg0XCJcclxuXHRcdFx0ZnMuYmxhY2tib3ggPSB0cnVlXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJtYXJrZG93blwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1tYXJrZG93blwiXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ3VybCdcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHQjIGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LlVybFxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NVcmwnXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2VtYWlsJ1xyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc0VtYWlsJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdhdXRvbnVtYmVyJ1xyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRlbHNlXHJcblx0XHRcdGZzLnR5cGUgPSBmaWVsZC50eXBlXHJcblxyXG5cdFx0aWYgZmllbGQubGFiZWxcclxuXHRcdFx0ZnMubGFiZWwgPSBmaWVsZC5sYWJlbFxyXG5cclxuXHRcdGlmIGZpZWxkLmFsbG93ZWRWYWx1ZXNcclxuXHRcdFx0ZnMuYWxsb3dlZFZhbHVlcyA9IGZpZWxkLmFsbG93ZWRWYWx1ZXNcclxuXHJcblx0XHRpZiAhZmllbGQucmVxdWlyZWRcclxuXHRcdFx0ZnMub3B0aW9uYWwgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQudW5pcXVlXHJcblx0XHRcdGZzLnVuaXF1ZSA9IHRydWVcclxuXHJcblx0XHRpZiBmaWVsZC5vbWl0XHJcblx0XHRcdGZzLmF1dG9mb3JtLm9taXQgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQuZ3JvdXBcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uZ3JvdXAgPSBmaWVsZC5ncm91cFxyXG5cclxuXHRcdGlmIGZpZWxkLmlzX3dpZGVcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uaXNfd2lkZSA9IHRydWVcclxuXHJcblx0XHRpZiBmaWVsZC5oaWRkZW5cclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwiaGlkZGVuXCJcclxuXHJcblx0XHRpZiAoZmllbGQudHlwZSA9PSBcInNlbGVjdFwiKSBvciAoZmllbGQudHlwZSA9PSBcImxvb2t1cFwiKSBvciAoZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIilcclxuXHRcdFx0aWYgdHlwZW9mKGZpZWxkLmZpbHRlcmFibGUpID09ICd1bmRlZmluZWQnXHJcblx0XHRcdFx0ZmllbGQuZmlsdGVyYWJsZSA9IHRydWVcclxuXHRcdGlmIGZpZWxkLm5hbWUgPT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWVcclxuXHRcdFx0aWYgdHlwZW9mKGZpZWxkLnNlYXJjaGFibGUpID09ICd1bmRlZmluZWQnXHJcblx0XHRcdFx0ZmllbGQuc2VhcmNoYWJsZSA9IHRydWVcclxuXHJcblx0XHRpZiBhdXRvZm9ybV90eXBlXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBhdXRvZm9ybV90eXBlXHJcblxyXG5cdFx0aWYgZmllbGQuZGVmYXVsdFZhbHVlXHJcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudCBhbmQgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZmllbGQuZGVmYXVsdFZhbHVlKVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9ICgpLT5cclxuXHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmaWVsZC5kZWZhdWx0VmFsdWUsIHt1c2VySWQ6IE1ldGVvci51c2VySWQoKSwgc3BhY2VJZDogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpfSlcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxyXG5cdFx0XHRcdGlmICFfLmlzRnVuY3Rpb24oZmllbGQuZGVmYXVsdFZhbHVlKVxyXG5cdFx0XHRcdFx0ZnMuZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlXHJcblxyXG5cdFx0aWYgZmllbGQucmVhZG9ubHlcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ucmVhZG9ubHkgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQuZGlzYWJsZWRcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQuaW5saW5lSGVscFRleHRcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uaW5saW5lSGVscFRleHQgPSBmaWVsZC5pbmxpbmVIZWxwVGV4dFxyXG5cclxuXHRcdGlmIGZpZWxkLmJsYWNrYm94XHJcblx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxyXG5cclxuXHRcdCMg5Y+q5pyJ55Sf5Lqn546v5aKD5omN6YeN5bu657Si5byVXHJcblx0XHRpZiBNZXRlb3IuaXNQcm9kdWN0aW9uXHJcblx0XHRcdGlmIGZpZWxkLmluZGV4XHJcblx0XHRcdFx0ZnMuaW5kZXggPSBmaWVsZC5pbmRleFxyXG5cdFx0XHRlbHNlIGlmIGZpZWxkLnNvcnRhYmxlXHJcblx0XHRcdFx0ZnMuaW5kZXggPSB0cnVlXHJcblxyXG5cdFx0c2NoZW1hW2ZpZWxkX25hbWVdID0gZnNcclxuXHJcblx0cmV0dXJuIHNjaGVtYVxyXG5cclxuXHJcbkNyZWF0b3IuZ2V0RmllbGREaXNwbGF5VmFsdWUgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlKS0+XHJcblx0aHRtbCA9IGZpZWxkX3ZhbHVlXHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0aWYgIW9iamVjdFxyXG5cdFx0cmV0dXJuIFwiXCJcclxuXHRmaWVsZCA9IG9iamVjdC5maWVsZHMoZmllbGRfbmFtZSlcclxuXHRpZiAhZmllbGRcclxuXHRcdHJldHVybiBcIlwiXHJcblxyXG5cdGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRldGltZVwiXHJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQgSDptbScpXHJcblx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZVwiXHJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQnKVxyXG5cclxuXHRyZXR1cm4gaHRtbFxyXG5cclxuQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkgPSAoZmllbGRfdHlwZSktPlxyXG5cdHJldHVybiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIiwgXCJjdXJyZW5jeVwiLCBcIm51bWJlclwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxyXG5cclxuQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMgPSAoZmllbGRfdHlwZSwgb3BlcmF0aW9ucyktPlxyXG5cdGJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpXHJcblx0aWYgYnVpbHRpblZhbHVlc1xyXG5cdFx0Xy5mb3JFYWNoIGJ1aWx0aW5WYWx1ZXMsIChidWlsdGluSXRlbSwga2V5KS0+XHJcblx0XHRcdG9wZXJhdGlvbnMucHVzaCh7bGFiZWw6IGJ1aWx0aW5JdGVtLmxhYmVsLCB2YWx1ZToga2V5fSlcclxuXHJcbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSAoZmllbGRfdHlwZSwgaXNfY2hlY2tfb25seSktPlxyXG5cdCMg6L+H5ruk5Zmo5a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XHJcblx0aWYgW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSlcclxuXHJcbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0gPSAoZmllbGRfdHlwZSwga2V5KS0+XHJcblx0IyDov4fmu6TlmajlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcclxuXHRpZiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcclxuXHRcdHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBrZXkpXHJcblxyXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uID0gKGZpZWxkX3R5cGUsIHZhbHVlKS0+XHJcblx0IyDmoLnmja7ov4fmu6TlmajnmoTov4fmu6TlgLzvvIzojrflj5blr7nlupTnmoTlhoXnva7ov5DnrpfnrKZcclxuXHQjIOavlOWmgnZhbHVl5Li6bGFzdF95ZWFy77yM6L+U5ZueYmV0d2Vlbl90aW1lX2xhc3RfeWVhclxyXG5cdHVubGVzcyBfLmlzU3RyaW5nKHZhbHVlKVxyXG5cdFx0cmV0dXJuXHJcblx0YmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpXHJcblx0dW5sZXNzIGJldHdlZW5CdWlsdGluVmFsdWVzXHJcblx0XHRyZXR1cm5cclxuXHRyZXN1bHQgPSBudWxsXHJcblx0Xy5lYWNoIGJldHdlZW5CdWlsdGluVmFsdWVzLCAoaXRlbSwgb3BlcmF0aW9uKS0+XHJcblx0XHRpZiBpdGVtLmtleSA9PSB2YWx1ZVxyXG5cdFx0XHRyZXN1bHQgPSBvcGVyYXRpb25cclxuXHRyZXR1cm4gcmVzdWx0XHJcblxyXG4jIOWmguaenOWPquaYr+S4uuWIpOaWrW9wZXJhdGlvbuaYr+WQpuWtmOWcqO+8jOWImeayoeW/heimgeiuoeeul3ZhbHVlc++8jOS8oOWFpWlzX2NoZWNrX29ubHnkuLp0cnVl5Y2z5Y+vXHJcbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzID0gKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpLT5cclxuXHQjIOi/h+a7pOWZqOaXtumXtOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxyXG5cdHJldHVybiB7XHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfeWVhclwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc195ZWFyXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF95ZWFyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3llYXJcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfcXVhcnRlclwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19xdWFydGVyXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF9xdWFydGVyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3F1YXJ0ZXJcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X21vbnRoXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc19tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19tb250aFwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfbW9udGhcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3Rfd2Vla1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc193ZWVrXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF93ZWVrXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3dlZWtcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV95ZXN0ZGF5XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ5ZXN0ZGF5XCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9kYXlcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvZGF5XCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9tb3Jyb3dcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvbW9ycm93XCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF83X2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfN19kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8zMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzMwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzYwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfNjBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfOTBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF85MF9kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8xMjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8xMjBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfN19kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzdfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfMzBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8zMF9kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzYwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzkwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfOTBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfMTIwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMTIwX2RheXNcIilcclxuXHR9XHJcblxyXG5DcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoID0gKG1vbnRoKS0+XHJcblx0aWYgIW1vbnRoXHJcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxyXG5cdFxyXG5cdGlmIG1vbnRoIDwgM1xyXG5cdFx0cmV0dXJuIDBcclxuXHRlbHNlIGlmIG1vbnRoIDwgNlxyXG5cdFx0cmV0dXJuIDNcclxuXHRlbHNlIGlmIG1vbnRoIDwgOVxyXG5cdFx0cmV0dXJuIDZcclxuXHRcclxuXHRyZXR1cm4gOVxyXG5cclxuXHJcbkNyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSA9ICh5ZWFyLG1vbnRoKS0+XHJcblx0aWYgIXllYXJcclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcclxuXHRpZiAhbW9udGhcclxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXHJcblx0XHJcblx0aWYgbW9udGggPCAzXHJcblx0XHR5ZWFyLS1cclxuXHRcdG1vbnRoID0gOVxyXG5cdGVsc2UgaWYgbW9udGggPCA2XHJcblx0XHRtb250aCA9IDBcclxuXHRlbHNlIGlmIG1vbnRoIDwgOVxyXG5cdFx0bW9udGggPSAzXHJcblx0ZWxzZSBcclxuXHRcdG1vbnRoID0gNlxyXG5cdFxyXG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcclxuXHRcclxuXHJcbkNyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSA9ICh5ZWFyLG1vbnRoKS0+XHJcblx0aWYgIXllYXJcclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcclxuXHRpZiAhbW9udGhcclxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXHJcblx0XHJcblx0aWYgbW9udGggPCAzXHJcblx0XHRtb250aCA9IDNcclxuXHRlbHNlIGlmIG1vbnRoIDwgNlxyXG5cdFx0bW9udGggPSA2XHJcblx0ZWxzZSBpZiBtb250aCA8IDlcclxuXHRcdG1vbnRoID0gOVxyXG5cdGVsc2VcclxuXHRcdHllYXIrK1xyXG5cdFx0bW9udGggPSAwXHJcblx0XHJcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxyXG5cclxuQ3JlYXRvci5nZXRNb250aERheXMgPSAoeWVhcixtb250aCktPlxyXG5cdGlmIG1vbnRoID09IDExXHJcblx0XHRyZXR1cm4gMzFcclxuXHRcclxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcclxuXHRzdGFydERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcclxuXHRlbmREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgrMSwgMSlcclxuXHRkYXlzID0gKGVuZERhdGUtc3RhcnREYXRlKS9taWxsaXNlY29uZFxyXG5cdHJldHVybiBkYXlzXHJcblxyXG5DcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5ID0gKHllYXIsIG1vbnRoKS0+XHJcblx0aWYgIXllYXJcclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcclxuXHRpZiAhbW9udGhcclxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXHJcblx0XHJcblx0IyDmnIjku73kuLow5Luj6KGo5pys5bm055qE56ys5LiA5pyIXHJcblx0aWYgbW9udGggPT0gMFxyXG5cdFx0bW9udGggPSAxMVxyXG5cdFx0eWVhci0tXHJcblx0XHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0XHJcblx0IyDlkKbliJks5Y+q5YeP5Y675pyI5Lu9XHJcblx0bW9udGgtLTtcclxuXHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0XHJcbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtID0gKGZpZWxkX3R5cGUsIGtleSktPlxyXG5cdCMg6L+H5ruk5ZmoYmV0d2Vlbui/kOeul+espu+8jOeOsOeul+aXpeacny/ml6XmnJ/ml7bpl7TnsbvlnovlrZfmrrXnmoR2YWx1ZXPlgLxcclxuXHRub3cgPSBuZXcgRGF0ZSgpXHJcblx0IyDkuIDlpKnnmoTmr6vnp5LmlbBcclxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcclxuXHR5ZXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxyXG5cdHRvbW9ycm93ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKVxyXG5cdCMg5LiA5ZGo5Lit55qE5p+Q5LiA5aSpXHJcblx0d2VlayA9IG5vdy5nZXREYXkoKVxyXG5cdCMg5YeP5Y6755qE5aSp5pWwXHJcblx0bWludXNEYXkgPSBpZiB3ZWVrICE9IDAgdGhlbiB3ZWVrIC0gMSBlbHNlIDZcclxuXHRtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKVxyXG5cdHN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOS4iuWRqOaXpVxyXG5cdGxhc3RTdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXHJcblx0IyDkuIrlkajkuIBcclxuXHRsYXN0TW9uZGF5ID0gbmV3IERhdGUobGFzdFN1bmRheS5nZXRUaW1lKCkgLSAobWlsbGlzZWNvbmQgKiA2KSlcclxuXHQjIOS4i+WRqOS4gFxyXG5cdG5leHRNb25kYXkgPSBuZXcgRGF0ZShzdW5kYXkuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpXHJcblx0IyDkuIvlkajml6VcclxuXHRuZXh0U3VuZGF5ID0gbmV3IERhdGUobmV4dE1vbmRheS5nZXRUaW1lKCkgKyAobWlsbGlzZWNvbmQgKiA2KSlcclxuXHRjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXHJcblx0cHJldmlvdXNZZWFyID0gY3VycmVudFllYXIgLSAxXHJcblx0bmV4dFllYXIgPSBjdXJyZW50WWVhciArIDFcclxuXHQjIOW9k+WJjeaciOS7vVxyXG5cdGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpXHJcblx0IyDorqHmlbDlubTjgIHmnIhcclxuXHR5ZWFyID0gbm93LmdldEZ1bGxZZWFyKClcclxuXHRtb250aCA9IG5vdy5nZXRNb250aCgpXHJcblx0IyDmnKzmnIjnrKzkuIDlpKlcclxuXHRmaXJzdERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aCwxKVxyXG5cclxuXHQjIOW9k+S4ujEy5pyI55qE5pe25YCZ5bm05Lu96ZyA6KaB5YqgMVxyXG5cdCMg5pyI5Lu96ZyA6KaB5pu05paw5Li6MCDkuZ/lsLHmmK/kuIvkuIDlubTnmoTnrKzkuIDkuKrmnIhcclxuXHRpZiBjdXJyZW50TW9udGggPT0gMTFcclxuXHRcdHllYXIrK1xyXG5cdFx0bW9udGgrK1xyXG5cdGVsc2VcclxuXHRcdG1vbnRoKytcclxuXHRcclxuXHQjIOS4i+aciOesrOS4gOWkqVxyXG5cdG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0IyDkuIvmnIjmnIDlkI7kuIDlpKlcclxuXHRuZXh0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKHllYXIsbW9udGgsQ3JlYXRvci5nZXRNb250aERheXMoeWVhcixtb250aCkpXHJcblx0IyDmnKzmnIjmnIDlkI7kuIDlpKlcclxuXHRsYXN0RGF5ID0gbmV3IERhdGUobmV4dE1vbnRoRmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXHJcblx0IyDkuIrmnIjnrKzkuIDlpKlcclxuXHRsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxyXG5cdCMg5LiK5pyI5pyA5ZCO5LiA5aSpXHJcblx0bGFzdE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZShmaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcclxuXHQjIOacrOWto+W6puW8gOWni+aXpVxyXG5cdHRoaXNRdWFydGVyU3RhcnREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCksMSlcclxuXHQjIOacrOWto+W6pue7k+adn+aXpVxyXG5cdHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIsQ3JlYXRvci5nZXRNb250aERheXMoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIpKVxyXG5cdCMg5LiK5a2j5bqm5byA5aeL5pelXHJcblx0bGFzdFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXHJcblx0IyDkuIrlraPluqbnu5PmnZ/ml6VcclxuXHRsYXN0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIpKVxyXG5cdCMg5LiL5a2j5bqm5byA5aeL5pelXHJcblx0bmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXHJcblx0IyDkuIvlraPluqbnu5PmnZ/ml6VcclxuXHRuZXh0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIpKVxyXG5cdCMg6L+H5Y67N+WkqSBcclxuXHRsYXN0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNiAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzMw5aSpXHJcblx0bGFzdF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgyOSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzYw5aSpXHJcblx0bGFzdF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg1OSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzkw5aSpXHJcblx0bGFzdF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg4OSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzEyMOWkqVxyXG5cdGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOacquadpTflpKkgXHJcblx0bmV4dF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaUzMOWkqVxyXG5cdG5leHRfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMjkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaU2MOWkqVxyXG5cdG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaU5MOWkqVxyXG5cdG5leHRfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoODkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaUxMjDlpKlcclxuXHRuZXh0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgxMTkgKiBtaWxsaXNlY29uZCkpXHJcblxyXG5cdHN3aXRjaCBrZXlcclxuXHRcdHdoZW4gXCJsYXN0X3llYXJcIlxyXG5cdFx0XHQj5Y675bm0XHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfeWVhclwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3ByZXZpb3VzWWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3ByZXZpb3VzWWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwidGhpc195ZWFyXCJcclxuXHRcdFx0I+S7iuW5tFxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3llYXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje2N1cnJlbnRZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0X3llYXJcIlxyXG5cdFx0XHQj5piO5bm0XHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfeWVhclwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje25leHRZZWFyfS0wMS0wMVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7bmV4dFllYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfcXVhcnRlclwiXHJcblx0XHRcdCPkuIrlraPluqZcclxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfcXVhcnRlclwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwidGhpc19xdWFydGVyXCJcclxuXHRcdFx0I+acrOWto+W6plxyXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19xdWFydGVyXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0X3F1YXJ0ZXJcIlxyXG5cdFx0XHQj5LiL5a2j5bqmXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3F1YXJ0ZXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfbW9udGhcIlxyXG5cdFx0XHQj5LiK5pyIXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9tb250aFwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwidGhpc19tb250aFwiXHJcblx0XHRcdCPmnKzmnIhcclxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQoZmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfbW9udGhcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfbW9udGhcIlxyXG5cdFx0XHQj5LiL5pyIXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9tb250aFwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibGFzdF93ZWVrXCJcclxuXHRcdFx0I+S4iuWRqFxyXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobGFzdE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobGFzdFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3dlZWtcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRoaXNfd2Vla1wiXHJcblx0XHRcdCPmnKzlkahcclxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KG1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQoc3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfd2Vla1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ck1vbmRheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN1bmRheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF93ZWVrXCJcclxuXHRcdFx0I+S4i+WRqFxyXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobmV4dE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3dlZWtcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInllc3RkYXlcIlxyXG5cdFx0XHQj5pio5aSpXHJcblx0XHRcdHN0clllc3RkYXkgPSBtb21lbnQoeWVzdGRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl95ZXN0ZGF5XCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyWWVzdGRheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clllc3RkYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRvZGF5XCJcclxuXHRcdFx0I+S7iuWkqVxyXG5cdFx0XHRzdHJUb2RheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9kYXlcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb2RheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvZGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJ0b21vcnJvd1wiXHJcblx0XHRcdCPmmI7lpKlcclxuXHRcdFx0c3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9tb3Jyb3dcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb21vcnJvd31UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvbW9ycm93fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0XzdfZGF5c1wiXHJcblx0XHRcdCPov4fljrs35aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpIFxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfN19kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfMzBfZGF5c1wiXHJcblx0XHRcdCPov4fljrszMOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzMwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibGFzdF82MF9kYXlzXCJcclxuXHRcdFx0I+i/h+WOuzYw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfNjBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0XzkwX2RheXNcIlxyXG5cdFx0XHQj6L+H5Y67OTDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF85MF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfMTIwX2RheXNcIlxyXG5cdFx0XHQj6L+H5Y67MTIw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfN19kYXlzXCJcclxuXHRcdFx0I+acquadpTflpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzdfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0XzMwX2RheXNcIlxyXG5cdFx0XHQj5pyq5p2lMzDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8zMF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfNjBfZGF5c1wiXHJcblx0XHRcdCPmnKrmnaU2MOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzYwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF85MF9kYXlzXCJcclxuXHRcdFx0I+acquadpTkw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfOTBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0XzEyMF9kYXlzXCJcclxuXHRcdFx0I+acquadpTEyMOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8xMjBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcclxuXHR2YWx1ZXMgPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdXHJcblx0aWYgZmllbGRfdHlwZSA9PSBcImRhdGV0aW1lXCJcclxuXHRcdCMg5pe26Ze057G75Z6L5a2X5q6177yM5YaF572u5pe26Ze06IyD5Zu05bqU6K+l6ICD6JmR5YGP56e75pe25Yy65YC877yM5ZCm5YiZ6L+H5ruk5pWw5o2u5a2Y5Zyo5YGP5beuXHJcblx0XHQjIOmdnuWGhee9ruaXtumXtOiMg+WbtOaXtu+8jOeUqOaIt+mAmui/h+aXtumXtOaOp+S7tumAieaLqeeahOiMg+WbtO+8jOS8muiHquWKqOWkhOeQhuaXtuWMuuWBj+W3ruaDheWGtVxyXG5cdFx0IyDml6XmnJ/nsbvlnovlrZfmrrXvvIzmlbDmja7lupPmnKzmnaXlsLHlrZjnmoTmmK9VVEPnmoQw54K577yM5LiN5a2Y5Zyo5YGP5beuXHJcblx0XHRfLmZvckVhY2ggdmFsdWVzLCAoZnYpLT5cclxuXHRcdFx0aWYgZnZcclxuXHRcdFx0XHRmdi5zZXRIb3Vycyhmdi5nZXRIb3VycygpICsgZnYuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwIClcclxuXHRcclxuXHRyZXR1cm4ge1xyXG5cdFx0bGFiZWw6IGxhYmVsXHJcblx0XHRrZXk6IGtleVxyXG5cdFx0dmFsdWVzOiB2YWx1ZXNcclxuXHR9XHJcblxyXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IChmaWVsZF90eXBlKS0+XHJcblx0aWYgZmllbGRfdHlwZSAmJiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKVxyXG5cdFx0cmV0dXJuICdiZXR3ZWVuJ1xyXG5cdGVsc2UgaWYgW1widGV4dGFyZWFcIiwgXCJ0ZXh0XCIsIFwiY29kZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxyXG5cdFx0cmV0dXJuICdjb250YWlucydcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gXCI9XCJcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRPcGVyYXRpb24gPSAoZmllbGRfdHlwZSkgLT5cclxuXHQjIOaXpeacn+exu+WeizogZGF0ZSwgZGF0ZXRpbWUgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxyXG5cdCMg5paH5pys57G75Z6LOiB0ZXh0LCB0ZXh0YXJlYSwgaHRtbCAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiLCBcImNvbnRhaW5zXCIsIFwibm90Y29udGFpbnNcIiwgXCJzdGFydHN3aXRoXCJcclxuXHQjIOmAieaLqeexu+WeizogbG9va3VwLCBtYXN0ZXJfZGV0YWlsLCBzZWxlY3Qg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXHJcblx0IyDmlbDlgLznsbvlnos6IGN1cnJlbmN5LCBudW1iZXIgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxyXG5cdCMg5biD5bCU57G75Z6LOiBib29sZWFuICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcclxuXHQjIOaVsOe7hOexu+WeizogY2hlY2tib3gsIFt0ZXh0XSAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXHJcblxyXG5cdG9wdGlvbmFscyA9IHtcclxuXHRcdGVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZXF1YWxcIiksIHZhbHVlOiBcIj1cIn0sXHJcblx0XHR1bmVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fdW5lcXVhbFwiKSwgdmFsdWU6IFwiPD5cIn0sXHJcblx0XHRsZXNzX3RoYW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX3RoYW5cIiksIHZhbHVlOiBcIjxcIn0sXHJcblx0XHRncmVhdGVyX3RoYW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX3RoYW5cIiksIHZhbHVlOiBcIj5cIn0sXHJcblx0XHRsZXNzX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc19vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPD1cIn0sXHJcblx0XHRncmVhdGVyX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl9vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPj1cIn0sXHJcblx0XHRjb250YWluczoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2NvbnRhaW5zXCIpLCB2YWx1ZTogXCJjb250YWluc1wifSxcclxuXHRcdG5vdF9jb250YWluOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZG9lc19ub3RfY29udGFpblwiKSwgdmFsdWU6IFwibm90Y29udGFpbnNcIn0sXHJcblx0XHRzdGFydHNfd2l0aDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3N0YXJ0c193aXRoXCIpLCB2YWx1ZTogXCJzdGFydHN3aXRoXCJ9LFxyXG5cdFx0YmV0d2Vlbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5cIiksIHZhbHVlOiBcImJldHdlZW5cIn0sXHJcblx0fVxyXG5cclxuXHRpZiBmaWVsZF90eXBlID09IHVuZGVmaW5lZFxyXG5cdFx0cmV0dXJuIF8udmFsdWVzKG9wdGlvbmFscylcclxuXHJcblx0b3BlcmF0aW9ucyA9IFtdXHJcblxyXG5cdGlmIENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmJldHdlZW4pXHJcblx0XHRDcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyhmaWVsZF90eXBlLCBvcGVyYXRpb25zKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcInRleHRcIiBvciBmaWVsZF90eXBlID09IFwidGV4dGFyZWFcIiBvciBmaWVsZF90eXBlID09IFwiaHRtbFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJjb2RlXCJcclxuI1x0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmNvbnRhaW5zLCBvcHRpb25hbHMubm90X2NvbnRhaW4sIG9wdGlvbmFscy5zdGFydHNfd2l0aClcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuY29udGFpbnMpXHJcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwibG9va3VwXCIgb3IgZmllbGRfdHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiBvciBmaWVsZF90eXBlID09IFwic2VsZWN0XCJcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImN1cnJlbmN5XCIgb3IgZmllbGRfdHlwZSA9PSBcIm51bWJlclwiXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmxlc3NfdGhhbiwgb3B0aW9uYWxzLmdyZWF0ZXJfdGhhbiwgb3B0aW9uYWxzLmxlc3Nfb3JfZXF1YWwsIG9wdGlvbmFscy5ncmVhdGVyX29yX2VxdWFsKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImJvb2xlYW5cIlxyXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXHJcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiY2hlY2tib3hcIlxyXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXHJcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiW3RleHRdXCJcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cdGVsc2VcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cclxuXHRyZXR1cm4gb3BlcmF0aW9uc1xyXG5cclxuIyMjXHJcbiAgICDlhYjmjInnhafmnInmjpLluo/lj7fnmoTlsI/nmoTlnKjliY3vvIzlpKfnmoTlnKjlkI5cclxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lID0gKG9iamVjdF9uYW1lKS0+XHJcblx0ZmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5maWVsZHNcclxuXHRmaWVsZHNBcnIgPSBbXVxyXG5cclxuXHRfLmVhY2ggZmllbGRzLCAoZmllbGQpLT5cclxuXHRcdGZpZWxkc0Fyci5wdXNoIHtuYW1lOiBmaWVsZC5uYW1lLCBzb3J0X25vOiBmaWVsZC5zb3J0X25vfVxyXG5cclxuXHRmaWVsZHNOYW1lID0gW11cclxuXHRfLmVhY2ggXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIChmaWVsZCktPlxyXG5cdFx0ZmllbGRzTmFtZS5wdXNoKGZpZWxkLm5hbWUpXHJcblx0cmV0dXJuIGZpZWxkc05hbWVcclxuIiwiQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIGZpZWxkc0Fyciwgc2NoZW1hO1xuICBzY2hlbWEgPSB7fTtcbiAgZmllbGRzQXJyID0gW107XG4gIF8uZWFjaChvYmouZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmICghXy5oYXMoZmllbGQsIFwibmFtZVwiKSkge1xuICAgICAgZmllbGQubmFtZSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHNBcnIucHVzaChmaWVsZCk7XG4gIH0pO1xuICBfLmVhY2goXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgdmFyIF9vYmplY3QsIF9yZWZfb2JqLCBfcmVmZXJlbmNlX3RvLCBhdXRvZm9ybV90eXBlLCBmaWVsZF9uYW1lLCBmcywgaXNVbkxpbWl0ZWQsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjM7XG4gICAgZmllbGRfbmFtZSA9IGZpZWxkLm5hbWU7XG4gICAgZnMgPSB7fTtcbiAgICBpZiAoZmllbGQucmVnRXgpIHtcbiAgICAgIGZzLnJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgfVxuICAgIGZzLmF1dG9mb3JtID0ge307XG4gICAgZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZTtcbiAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgYXV0b2Zvcm1fdHlwZSA9IChyZWYgPSBmaWVsZC5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwO1xuICAgIGlmIChmaWVsZC50eXBlID09PSBcInRleHRcIiB8fCBmaWVsZC50eXBlID09PSBcInBob25lXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIlt0ZXh0XVwiIHx8IGZpZWxkLnR5cGUgPT09IFwiW3Bob25lXVwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnY29kZScpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTI7XG4gICAgICBpZiAoZmllbGQubGFuZ3VhZ2UpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCI7XG4gICAgICBmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCA2O1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJwYXNzd29yZFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5vdXRGb3JtYXQgPSAneXl5eS1NTS1kZCc7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgdGltZXpvbmVJZDogXCJ1dGNcIixcbiAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJbT2JqZWN0XVwiKSB7XG4gICAgICBmcy50eXBlID0gW09iamVjdF07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImh0bWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgdHlwZTogXCJzdW1tZXJub3RlXCIsXG4gICAgICAgIFwiY2xhc3NcIjogJ2VkaXRvcicsXG4gICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICAgICAgZGlhbG9nc0luQm9keTogdHJ1ZSxcbiAgICAgICAgICB0b29sYmFyOiBbWydmb250MScsIFsnc3R5bGUnXV0sIFsnZm9udDInLCBbJ2JvbGQnLCAndW5kZXJsaW5lJywgJ2l0YWxpYycsICdjbGVhciddXSwgWydmb250MycsIFsnZm9udG5hbWUnXV0sIFsnY29sb3InLCBbJ2NvbG9yJ11dLCBbJ3BhcmEnLCBbJ3VsJywgJ29sJywgJ3BhcmFncmFwaCddXSwgWyd0YWJsZScsIFsndGFibGUnXV0sIFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sIFsndmlldycsIFsnY29kZXZpZXcnXV1dLFxuICAgICAgICAgIGZvbnROYW1lczogWydBcmlhbCcsICdDb21pYyBTYW5zIE1TJywgJ0NvdXJpZXIgTmV3JywgJ0hlbHZldGljYScsICdJbXBhY3QnLCAn5a6L5L2TJywgJ+m7keS9kycsICflvq7ova/pm4Xpu5EnLCAn5Lu/5a6LJywgJ+alt+S9kycsICfpmrbkuaYnLCAn5bm85ZyGJ11cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIgfHwgZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgfVxuICAgICAgaWYgKCFmaWVsZC5oaWRkZW4pIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZmlsdGVycyA9IGZpZWxkLmZpbHRlcnM7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlcGVuZE9uID0gZmllbGQuZGVwZW5kX29uO1xuICAgICAgICBpZiAoZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uKSB7XG4gICAgICAgICAgZnMuYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGZzLmZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA/IGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA6IENyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzO1xuICAgICAgICBpZiAoZmllbGQub3B0aW9uc0Z1bmN0aW9uKSB7XG4gICAgICAgICAgZnMub3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8pIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICBpZiAoZmllbGQuY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICAgICAgICBmcy5jcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIF9yZWZfb2JqID0gQ3JlYXRvci5PYmplY3RzW2ZpZWxkLnJlZmVyZW5jZV90b107XG4gICAgICAgICAgICAgICAgaWYgKF9yZWZfb2JqICE9IG51bGwgPyAocmVmMSA9IF9yZWZfb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMS5hbGxvd0NyZWF0ZSA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIGZzLmNyZWF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24obG9va3VwX2ZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNb2RhbC5zaG93KFwiQ3JlYXRvck9iamVjdE1vZGFsXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uOiBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuXCIgKyAoQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGZpZWxkLnJlZmVyZW5jZV90bykuX25hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgIGZvcm1JZDogXCJuZXdcIiArIChmaWVsZC5yZWZlcmVuY2VfdG8ucmVwbGFjZSgnLicsICdfJykpLFxuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBcIlwiICsgZmllbGQucmVmZXJlbmNlX3RvLFxuICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJpbnNlcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICBvblN1Y2Nlc3M6IGZ1bmN0aW9uKG9wZXJhdGlvbiwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqZWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVzdWx0Lm9iamVjdF9uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQub2JqZWN0X25hbWUgPT09IFwib2JqZWN0c1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb29rdXBfZmllbGQuYWRkSXRlbXMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiByZXN1bHQudmFsdWUubGFiZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0LnZhbHVlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiByZXN1bHQudmFsdWUuaWNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgcmVzdWx0LnZhbHVlLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHJlc3VsdC52YWx1ZVtvYmplY3QuTkFNRV9GSUVMRF9LRVldIHx8IHJlc3VsdC52YWx1ZS5sYWJlbCB8fCByZXN1bHQudmFsdWUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQuX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLCByZXN1bHQuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChfLmlzQm9vbGVhbihmaWVsZC5jcmVhdGUpKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSBmaWVsZC5jcmVhdGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2Vfc29ydCkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc1NvcnQgPSBmaWVsZC5yZWZlcmVuY2Vfc29ydDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV9saW1pdCkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc0xpbWl0ID0gZmllbGQucmVmZXJlbmNlX2xpbWl0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3RvID09PSBcInVzZXJzXCIpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdHVzZXJcIjtcbiAgICAgICAgICAgIGlmICghZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0KSB7XG4gICAgICAgICAgICAgIGlmIChmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gKHJlZjIgPSBvYmoucGVybWlzc2lvbnMpICE9IG51bGwgPyByZWYyLmdldCgpIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChpc1VuTGltaXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNGdW5jdGlvbihmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQucmVmZXJlbmNlX3RvID09PSBcIm9yZ2FuaXphdGlvbnNcIikge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0b3JnXCI7XG4gICAgICAgICAgICBpZiAoIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdCkge1xuICAgICAgICAgICAgICBpZiAoZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IChyZWYzID0gb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMy5nZXQoKSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoaXNVbkxpbWl0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24oZmllbGQuaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF8uaXNBcnJheShfcmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgICAgICAgICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9iamVjdFN3aXRjaGUgPSB0cnVlO1xuICAgICAgICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLm9cIl0gPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICAgICAgICBvbWl0OiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLmlkc1wiXSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBbU3RyaW5nXSxcbiAgICAgICAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgICAgICAgb21pdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBbX3JlZmVyZW5jZV90b107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VfdG9bMF1dO1xuICAgICAgICAgICAgaWYgKF9vYmplY3QgJiYgX29iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RUcmVlXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kID0gZmllbGQub3B0aW9uc01ldGhvZCB8fCBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjtcbiAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2RQYXJhbXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzID0gW107XG4gICAgICAgICAgICAgICAgX3JlZmVyZW5jZV90by5mb3JFYWNoKGZ1bmN0aW9uKF9yZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICAgIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV07XG4gICAgICAgICAgICAgICAgICBpZiAoX29iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IF9yZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QubGFiZWwgOiB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgICAgaWNvbjogX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIChTZXNzaW9uLmdldCgnYXBwX2lkJykpICsgXCIvXCIgKyBfcmVmZXJlbmNlICsgXCIvdmlldy9cIjtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBfcmVmZXJlbmNlLFxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIChTZXNzaW9uLmdldCgnYXBwX2lkJykpICsgXCIvXCIgKyBfcmVmZXJlbmNlICsgXCIvdmlldy9cIjtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdEljb24gPSBmaWVsZC5kZWZhdWx0SWNvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmFsc2U7XG4gICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0XCI7XG4gICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgICBmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IFwiXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImN1cnJlbmN5XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGU7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSAhPT0gMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IDI7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZTtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgICAgZnMudHlwZSA9IEJvb2xlYW47XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tY2hlY2tib3hcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwicmVmZXJlbmNlXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdC1jaGVja2JveFwiO1xuICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImZpbGVcIiAmJiBmaWVsZC5jb2xsZWN0aW9uKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246IGZpZWxkLmNvbGxlY3Rpb25cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gZmllbGQuY29sbGVjdGlvbjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZmlsZXNpemVcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZXNpemUnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJPYmplY3RcIiB8fCBmaWVsZC50eXBlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJncmlkXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBBcnJheTtcbiAgICAgIGZzLmF1dG9mb3JtLmVkaXRhYmxlID0gdHJ1ZTtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NHcmlkXCI7XG4gICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiaW1hZ2VcIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnaW1hZ2VzJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ2ltYWdlLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdpbWFnZXMnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImF2YXRhclwiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICdhdmF0YXJzJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ2ltYWdlLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdmF0YXJzJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJhdWRpb1wiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICdhdWRpb3MnLFxuICAgICAgICAgICAgYWNjZXB0OiAnYXVkaW8vKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F1ZGlvcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdhdWRpby8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidmlkZW9cIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAndmlkZW9zJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ3ZpZGVvLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICd2aWRlb3MnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAndmlkZW8vKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImxvY2F0aW9uXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBPYmplY3Q7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJsb2NhdGlvblwiO1xuICAgICAgZnMuYXV0b2Zvcm0uc3lzdGVtID0gZmllbGQuc3lzdGVtIHx8IFwid2dzODRcIjtcbiAgICAgIGZzLmJsYWNrYm94ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibWFya2Rvd25cIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtbWFya2Rvd25cIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICd1cmwnKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zVXJsJztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdlbWFpbCcpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbDtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc0VtYWlsJztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdhdXRvbnVtYmVyJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICB9IGVsc2Uge1xuICAgICAgZnMudHlwZSA9IGZpZWxkLnR5cGU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5sYWJlbCkge1xuICAgICAgZnMubGFiZWwgPSBmaWVsZC5sYWJlbDtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmFsbG93ZWRWYWx1ZXMpIHtcbiAgICAgIGZzLmFsbG93ZWRWYWx1ZXMgPSBmaWVsZC5hbGxvd2VkVmFsdWVzO1xuICAgIH1cbiAgICBpZiAoIWZpZWxkLnJlcXVpcmVkKSB7XG4gICAgICBmcy5vcHRpb25hbCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC51bmlxdWUpIHtcbiAgICAgIGZzLnVuaXF1ZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5vbWl0KSB7XG4gICAgICBmcy5hdXRvZm9ybS5vbWl0ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmdyb3VwKSB7XG4gICAgICBmcy5hdXRvZm9ybS5ncm91cCA9IGZpZWxkLmdyb3VwO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaXNfd2lkZSkge1xuICAgICAgZnMuYXV0b2Zvcm0uaXNfd2lkZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5oaWRkZW4pIHtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcImhpZGRlblwiO1xuICAgIH1cbiAgICBpZiAoKGZpZWxkLnR5cGUgPT09IFwic2VsZWN0XCIpIHx8IChmaWVsZC50eXBlID09PSBcImxvb2t1cFwiKSB8fCAoZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpKSB7XG4gICAgICBpZiAodHlwZW9mIGZpZWxkLmZpbHRlcmFibGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmllbGQubmFtZSA9PT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgZmllbGQuc2VhcmNoYWJsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmllbGQuc2VhcmNoYWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChhdXRvZm9ybV90eXBlKSB7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gYXV0b2Zvcm1fdHlwZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmRlZmF1bHRWYWx1ZSkge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmaWVsZC5kZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmaWVsZC5kZWZhdWx0VmFsdWUsIHtcbiAgICAgICAgICAgIHVzZXJJZDogTWV0ZW9yLnVzZXJJZCgpLFxuICAgICAgICAgICAgc3BhY2VJZDogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKGZpZWxkLmRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgICBmcy5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpZWxkLnJlYWRvbmx5KSB7XG4gICAgICBmcy5hdXRvZm9ybS5yZWFkb25seSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5kaXNhYmxlZCkge1xuICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaW5saW5lSGVscFRleHQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmlubGluZUhlbHBUZXh0ID0gZmllbGQuaW5saW5lSGVscFRleHQ7XG4gICAgfVxuICAgIGlmIChmaWVsZC5ibGFja2JveCkge1xuICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzUHJvZHVjdGlvbikge1xuICAgICAgaWYgKGZpZWxkLmluZGV4KSB7XG4gICAgICAgIGZzLmluZGV4ID0gZmllbGQuaW5kZXg7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkLnNvcnRhYmxlKSB7XG4gICAgICAgIGZzLmluZGV4ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNjaGVtYVtmaWVsZF9uYW1lXSA9IGZzO1xuICB9KTtcbiAgcmV0dXJuIHNjaGVtYTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGREaXNwbGF5VmFsdWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGRfdmFsdWUpIHtcbiAgdmFyIGZpZWxkLCBodG1sLCBvYmplY3Q7XG4gIGh0bWwgPSBmaWVsZF92YWx1ZTtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG4gIGZpZWxkID0gb2JqZWN0LmZpZWxkcyhmaWVsZF9uYW1lKTtcbiAgaWYgKCFmaWVsZCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG4gIGlmIChmaWVsZC50eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICBodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQgSDptbScpO1xuICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgaHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gIH1cbiAgcmV0dXJuIGh0bWw7XG59O1xuXG5DcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgcmV0dXJuIFtcImRhdGVcIiwgXCJkYXRldGltZVwiLCBcImN1cnJlbmN5XCIsIFwibnVtYmVyXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpO1xufTtcblxuQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMgPSBmdW5jdGlvbihmaWVsZF90eXBlLCBvcGVyYXRpb25zKSB7XG4gIHZhciBidWlsdGluVmFsdWVzO1xuICBidWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKTtcbiAgaWYgKGJ1aWx0aW5WYWx1ZXMpIHtcbiAgICByZXR1cm4gXy5mb3JFYWNoKGJ1aWx0aW5WYWx1ZXMsIGZ1bmN0aW9uKGJ1aWx0aW5JdGVtLCBrZXkpIHtcbiAgICAgIHJldHVybiBvcGVyYXRpb25zLnB1c2goe1xuICAgICAgICBsYWJlbDogYnVpbHRpbkl0ZW0ubGFiZWwsXG4gICAgICAgIHZhbHVlOiBrZXlcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgaXNfY2hlY2tfb25seSkge1xuICBpZiAoW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtID0gZnVuY3Rpb24oZmllbGRfdHlwZSwga2V5KSB7XG4gIGlmIChbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwga2V5KTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpbk9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIHZhbHVlKSB7XG4gIHZhciBiZXR3ZWVuQnVpbHRpblZhbHVlcywgcmVzdWx0O1xuICBpZiAoIV8uaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGJldHdlZW5CdWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKTtcbiAgaWYgKCFiZXR3ZWVuQnVpbHRpblZhbHVlcykge1xuICAgIHJldHVybjtcbiAgfVxuICByZXN1bHQgPSBudWxsO1xuICBfLmVhY2goYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIGZ1bmN0aW9uKGl0ZW0sIG9wZXJhdGlvbikge1xuICAgIGlmIChpdGVtLmtleSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiByZXN1bHQgPSBvcGVyYXRpb247XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzID0gZnVuY3Rpb24oaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSkge1xuICByZXR1cm4ge1xuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF95ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc195ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF95ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc19tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3Rfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF93ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc193ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF93ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3llc3RkYXlcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInllc3RkYXlcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdG9kYXlcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvZGF5XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RvbW9ycm93XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b21vcnJvd1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzdfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF83X2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF8zMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzMwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF82MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzYwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF85MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzkwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF8xMjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8xMjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzdfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF83X2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF8zMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzMwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF82MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzYwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF85MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzkwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF8xMjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8xMjBfZGF5c1wiKVxuICB9O1xufTtcblxuQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aCA9IGZ1bmN0aW9uKG1vbnRoKSB7XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgcmV0dXJuIDM7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgcmV0dXJuIDY7XG4gIH1cbiAgcmV0dXJuIDk7XG59O1xuXG5DcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgeWVhci0tO1xuICAgIG1vbnRoID0gOTtcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICBtb250aCA9IDA7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgbW9udGggPSAzO1xuICB9IGVsc2Uge1xuICAgIG1vbnRoID0gNjtcbiAgfVxuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIG1vbnRoID0gMztcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICBtb250aCA9IDY7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgbW9udGggPSA5O1xuICB9IGVsc2Uge1xuICAgIHllYXIrKztcbiAgICBtb250aCA9IDA7XG4gIH1cbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0TW9udGhEYXlzID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgdmFyIGRheXMsIGVuZERhdGUsIG1pbGxpc2Vjb25kLCBzdGFydERhdGU7XG4gIGlmIChtb250aCA9PT0gMTEpIHtcbiAgICByZXR1cm4gMzE7XG4gIH1cbiAgbWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuICBzdGFydERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIGVuZERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIDEpO1xuICBkYXlzID0gKGVuZERhdGUgLSBzdGFydERhdGUpIC8gbWlsbGlzZWNvbmQ7XG4gIHJldHVybiBkYXlzO1xufTtcblxuQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA9PT0gMCkge1xuICAgIG1vbnRoID0gMTE7XG4gICAgeWVhci0tO1xuICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIH1cbiAgbW9udGgtLTtcbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtID0gZnVuY3Rpb24oZmllbGRfdHlwZSwga2V5KSB7XG4gIHZhciBjdXJyZW50TW9udGgsIGN1cnJlbnRZZWFyLCBlbmRWYWx1ZSwgZmlyc3REYXksIGxhYmVsLCBsYXN0RGF5LCBsYXN0TW9uZGF5LCBsYXN0TW9udGhGaW5hbERheSwgbGFzdE1vbnRoRmlyc3REYXksIGxhc3RRdWFydGVyRW5kRGF5LCBsYXN0UXVhcnRlclN0YXJ0RGF5LCBsYXN0U3VuZGF5LCBsYXN0XzEyMF9kYXlzLCBsYXN0XzMwX2RheXMsIGxhc3RfNjBfZGF5cywgbGFzdF83X2RheXMsIGxhc3RfOTBfZGF5cywgbWlsbGlzZWNvbmQsIG1pbnVzRGF5LCBtb25kYXksIG1vbnRoLCBuZXh0TW9uZGF5LCBuZXh0TW9udGhGaW5hbERheSwgbmV4dE1vbnRoRmlyc3REYXksIG5leHRRdWFydGVyRW5kRGF5LCBuZXh0UXVhcnRlclN0YXJ0RGF5LCBuZXh0U3VuZGF5LCBuZXh0WWVhciwgbmV4dF8xMjBfZGF5cywgbmV4dF8zMF9kYXlzLCBuZXh0XzYwX2RheXMsIG5leHRfN19kYXlzLCBuZXh0XzkwX2RheXMsIG5vdywgcHJldmlvdXNZZWFyLCBzdGFydFZhbHVlLCBzdHJFbmREYXksIHN0ckZpcnN0RGF5LCBzdHJMYXN0RGF5LCBzdHJNb25kYXksIHN0clN0YXJ0RGF5LCBzdHJTdW5kYXksIHN0clRvZGF5LCBzdHJUb21vcnJvdywgc3RyWWVzdGRheSwgc3VuZGF5LCB0aGlzUXVhcnRlckVuZERheSwgdGhpc1F1YXJ0ZXJTdGFydERheSwgdG9tb3Jyb3csIHZhbHVlcywgd2VlaywgeWVhciwgeWVzdGRheTtcbiAgbm93ID0gbmV3IERhdGUoKTtcbiAgbWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuICB5ZXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgdG9tb3Jyb3cgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpO1xuICB3ZWVrID0gbm93LmdldERheSgpO1xuICBtaW51c0RheSA9IHdlZWsgIT09IDAgPyB3ZWVrIC0gMSA6IDY7XG4gIG1vbmRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAobWludXNEYXkgKiBtaWxsaXNlY29uZCkpO1xuICBzdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0U3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgbGFzdE1vbmRheSA9IG5ldyBEYXRlKGxhc3RTdW5kYXkuZ2V0VGltZSgpIC0gKG1pbGxpc2Vjb25kICogNikpO1xuICBuZXh0TW9uZGF5ID0gbmV3IERhdGUoc3VuZGF5LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKTtcbiAgbmV4dFN1bmRheSA9IG5ldyBEYXRlKG5leHRNb25kYXkuZ2V0VGltZSgpICsgKG1pbGxpc2Vjb25kICogNikpO1xuICBjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBwcmV2aW91c1llYXIgPSBjdXJyZW50WWVhciAtIDE7XG4gIG5leHRZZWFyID0gY3VycmVudFllYXIgKyAxO1xuICBjdXJyZW50TW9udGggPSBub3cuZ2V0TW9udGgoKTtcbiAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBtb250aCA9IG5vdy5nZXRNb250aCgpO1xuICBmaXJzdERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgsIDEpO1xuICBpZiAoY3VycmVudE1vbnRoID09PSAxMSkge1xuICAgIHllYXIrKztcbiAgICBtb250aCsrO1xuICB9IGVsc2Uge1xuICAgIG1vbnRoKys7XG4gIH1cbiAgbmV4dE1vbnRoRmlyc3REYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIG5leHRNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIENyZWF0b3IuZ2V0TW9udGhEYXlzKHllYXIsIG1vbnRoKSk7XG4gIGxhc3REYXkgPSBuZXcgRGF0ZShuZXh0TW9udGhGaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIGxhc3RNb250aEZpcnN0RGF5ID0gQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbGFzdE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZShmaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIHRoaXNRdWFydGVyU3RhcnREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpLCAxKTtcbiAgdGhpc1F1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSArIDIpKTtcbiAgbGFzdFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbGFzdFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMikpO1xuICBuZXh0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBuZXh0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyKSk7XG4gIGxhc3RfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgyOSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNTkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDg5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMTE5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDI5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg1OSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoODkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgxMTkgKiBtaWxsaXNlY29uZCkpO1xuICBzd2l0Y2ggKGtleSkge1xuICAgIGNhc2UgXCJsYXN0X3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShwcmV2aW91c1llYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHByZXZpb3VzWWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShjdXJyZW50WWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoY3VycmVudFllYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF95ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUobmV4dFllYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKG5leHRZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc19xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc19tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQoZmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChuZXh0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF93ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobGFzdE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChsYXN0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF93ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KG1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChzdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF93ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobmV4dE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChuZXh0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF93ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInllc3RkYXlcIjpcbiAgICAgIHN0clllc3RkYXkgPSBtb21lbnQoeWVzdGRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3llc3RkYXlcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyWWVzdGRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyWWVzdGRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0b2RheVwiOlxuICAgICAgc3RyVG9kYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9kYXlcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyVG9kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRvbW9ycm93XCI6XG4gICAgICBzdHJUb21vcnJvdyA9IG1vbWVudCh0b21vcnJvdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvbW9ycm93XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvbW9ycm93ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJUb21vcnJvdyArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzdfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF83X2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzMwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzMwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzYwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzYwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzkwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzkwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzEyMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMTIwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzdfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF83X2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzMwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzMwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzYwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzYwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzkwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzkwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzEyMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMTIwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgfVxuICB2YWx1ZXMgPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdO1xuICBpZiAoZmllbGRfdHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgXy5mb3JFYWNoKHZhbHVlcywgZnVuY3Rpb24oZnYpIHtcbiAgICAgIGlmIChmdikge1xuICAgICAgICByZXR1cm4gZnYuc2V0SG91cnMoZnYuZ2V0SG91cnMoKSArIGZ2LmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBsYWJlbDogbGFiZWwsXG4gICAga2V5OiBrZXksXG4gICAgdmFsdWVzOiB2YWx1ZXNcbiAgfTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGREZWZhdWx0T3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSkge1xuICBpZiAoZmllbGRfdHlwZSAmJiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiAnYmV0d2Vlbic7XG4gIH0gZWxzZSBpZiAoW1widGV4dGFyZWFcIiwgXCJ0ZXh0XCIsIFwiY29kZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiAnY29udGFpbnMnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBcIj1cIjtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRGaWVsZE9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgdmFyIG9wZXJhdGlvbnMsIG9wdGlvbmFscztcbiAgb3B0aW9uYWxzID0ge1xuICAgIGVxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIj1cIlxuICAgIH0sXG4gICAgdW5lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fdW5lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIjw+XCJcbiAgICB9LFxuICAgIGxlc3NfdGhhbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc190aGFuXCIpLFxuICAgICAgdmFsdWU6IFwiPFwiXG4gICAgfSxcbiAgICBncmVhdGVyX3RoYW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfdGhhblwiKSxcbiAgICAgIHZhbHVlOiBcIj5cIlxuICAgIH0sXG4gICAgbGVzc19vcl9lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc19vcl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIjw9XCJcbiAgICB9LFxuICAgIGdyZWF0ZXJfb3JfZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfb3JfZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI+PVwiXG4gICAgfSxcbiAgICBjb250YWluczoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fY29udGFpbnNcIiksXG4gICAgICB2YWx1ZTogXCJjb250YWluc1wiXG4gICAgfSxcbiAgICBub3RfY29udGFpbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZG9lc19ub3RfY29udGFpblwiKSxcbiAgICAgIHZhbHVlOiBcIm5vdGNvbnRhaW5zXCJcbiAgICB9LFxuICAgIHN0YXJ0c193aXRoOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9zdGFydHNfd2l0aFwiKSxcbiAgICAgIHZhbHVlOiBcInN0YXJ0c3dpdGhcIlxuICAgIH0sXG4gICAgYmV0d2Vlbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2VlblwiKSxcbiAgICAgIHZhbHVlOiBcImJldHdlZW5cIlxuICAgIH1cbiAgfTtcbiAgaWYgKGZpZWxkX3R5cGUgPT09IHZvaWQgMCkge1xuICAgIHJldHVybiBfLnZhbHVlcyhvcHRpb25hbHMpO1xuICB9XG4gIG9wZXJhdGlvbnMgPSBbXTtcbiAgaWYgKENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5iZXR3ZWVuKTtcbiAgICBDcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyhmaWVsZF90eXBlLCBvcGVyYXRpb25zKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcInRleHRcIiB8fCBmaWVsZF90eXBlID09PSBcInRleHRhcmVhXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJodG1sXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJjb2RlXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmNvbnRhaW5zKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImxvb2t1cFwiIHx8IGZpZWxkX3R5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiIHx8IGZpZWxkX3R5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJjdXJyZW5jeVwiIHx8IGZpZWxkX3R5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmxlc3NfdGhhbiwgb3B0aW9uYWxzLmdyZWF0ZXJfdGhhbiwgb3B0aW9uYWxzLmxlc3Nfb3JfZXF1YWwsIG9wdGlvbmFscy5ncmVhdGVyX29yX2VxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJbdGV4dF1cIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH1cbiAgcmV0dXJuIG9wZXJhdGlvbnM7XG59O1xuXG5cbi8qXG4gICAg5YWI5oyJ54Wn5pyJ5o6S5bqP5Y+355qE5bCP55qE5Zyo5YmN77yM5aSn55qE5Zyo5ZCOXG4gICAg5YaN5bCG5rKh5pyJ5o6S5bqP5Y+355qE5pi+56S65ZyoXG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGZpZWxkcywgZmllbGRzQXJyLCBmaWVsZHNOYW1lLCByZWY7XG4gIGZpZWxkcyA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwO1xuICBmaWVsZHNBcnIgPSBbXTtcbiAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGRzQXJyLnB1c2goe1xuICAgICAgbmFtZTogZmllbGQubmFtZSxcbiAgICAgIHNvcnRfbm86IGZpZWxkLnNvcnRfbm9cbiAgICB9KTtcbiAgfSk7XG4gIGZpZWxkc05hbWUgPSBbXTtcbiAgXy5lYWNoKF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZHNOYW1lLnB1c2goZmllbGQubmFtZSk7XG4gIH0pO1xuICByZXR1cm4gZmllbGRzTmFtZTtcbn07XG4iLCJDcmVhdG9yLl90cmlnZ2VyX2hvb2tzID0ge31cclxuXHJcbmluaXRUcmlnZ2VyID0gKG9iamVjdF9uYW1lLCB0cmlnZ2VyKS0+XHJcblx0dHJ5XHJcblx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxyXG5cdFx0aWYgIXRyaWdnZXIudG9kb1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdHRvZG9XcmFwcGVyID0gKCktPlxyXG5cdFx0XHQgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZVxyXG5cdFx0XHQgIHJldHVybiB0cmlnZ2VyLnRvZG8uYXBwbHkodGhpcywgYXJndW1lbnRzKVxyXG5cdFx0aWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLmluc2VydFwiXHJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24uYmVmb3JlLmluc2VydCh0b2RvV3JhcHBlcilcclxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUudXBkYXRlXCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbi5iZWZvcmUudXBkYXRlKHRvZG9XcmFwcGVyKVxyXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImJlZm9yZS5yZW1vdmVcIlxyXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uLmJlZm9yZS5yZW1vdmUodG9kb1dyYXBwZXIpXHJcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIuaW5zZXJ0XCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbi5hZnRlci5pbnNlcnQodG9kb1dyYXBwZXIpXHJcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIudXBkYXRlXCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbi5hZnRlci51cGRhdGUodG9kb1dyYXBwZXIpXHJcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIucmVtb3ZlXCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbi5hZnRlci5yZW1vdmUodG9kb1dyYXBwZXIpXHJcblx0Y2F0Y2ggZXJyb3JcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpXHJcblxyXG5jbGVhblRyaWdnZXIgPSAob2JqZWN0X25hbWUpLT5cclxuXHQjIyNcclxuICAgIFx055Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsOaYr+S9v+eUqOS4i+agh+WIoOmZpOWvueixoeeahO+8jOaJgOS7peatpOWkhOWPjei9rGhvb2tz6ZuG5ZCI5ZCO77yM5YaN5Yig6ZmkXHJcbiAgICBcdOWboOS4uuS4gOS4quaVsOe7hOWFg+e0oOWIoOmZpOWQju+8jOWFtuS7luWFg+e0oOeahOS4i+agh+S8muWPkeeUn+WPmOWMllxyXG5cdCMjI1xyXG4gICAgI1RPRE8g55Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsGJ1Z1xyXG5cdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdPy5yZXZlcnNlKCkuZm9yRWFjaCAoX2hvb2spLT5cclxuXHRcdF9ob29rLnJlbW92ZSgpXHJcblxyXG5DcmVhdG9yLmluaXRUcmlnZ2VycyA9IChvYmplY3RfbmFtZSktPlxyXG4jXHRjb25zb2xlLmxvZygnQ3JlYXRvci5pbml0VHJpZ2dlcnMgb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSlcclxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHJcblx0Y2xlYW5UcmlnZ2VyKG9iamVjdF9uYW1lKVxyXG5cclxuXHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdXHJcblxyXG5cdF8uZWFjaCBvYmoudHJpZ2dlcnMsICh0cmlnZ2VyLCB0cmlnZ2VyX25hbWUpLT5cclxuXHRcdGlmIE1ldGVvci5pc1NlcnZlciBhbmQgdHJpZ2dlci5vbiA9PSBcInNlcnZlclwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxyXG5cdFx0XHRfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIgb2JqZWN0X25hbWUsIHRyaWdnZXJcclxuXHRcdFx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKVxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50IGFuZCB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCIgYW5kIHRyaWdnZXIudG9kbyBhbmQgdHJpZ2dlci53aGVuXHJcblx0XHRcdF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlciBvYmplY3RfbmFtZSwgdHJpZ2dlclxyXG5cdFx0XHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spIiwidmFyIGNsZWFuVHJpZ2dlciwgaW5pdFRyaWdnZXI7XG5cbkNyZWF0b3IuX3RyaWdnZXJfaG9va3MgPSB7fTtcblxuaW5pdFRyaWdnZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgdHJpZ2dlcikge1xuICB2YXIgY29sbGVjdGlvbiwgZXJyb3IsIHRvZG9XcmFwcGVyO1xuICB0cnkge1xuICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpO1xuICAgIGlmICghdHJpZ2dlci50b2RvKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRvZG9XcmFwcGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm9iamVjdF9uYW1lID0gb2JqZWN0X25hbWU7XG4gICAgICByZXR1cm4gdHJpZ2dlci50b2RvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS5pbnNlcnRcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uYmVmb3JlLmluc2VydCh0b2RvV3JhcHBlcik7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLnVwZGF0ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbi5iZWZvcmUudXBkYXRlKHRvZG9XcmFwcGVyKTtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJiZWZvcmUucmVtb3ZlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uLmJlZm9yZS5yZW1vdmUodG9kb1dyYXBwZXIpO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLmluc2VydFwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbi5hZnRlci5pbnNlcnQodG9kb1dyYXBwZXIpO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLnVwZGF0ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbi5hZnRlci51cGRhdGUodG9kb1dyYXBwZXIpO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLnJlbW92ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbi5hZnRlci5yZW1vdmUodG9kb1dyYXBwZXIpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpO1xuICB9XG59O1xuXG5jbGVhblRyaWdnZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuXG4gIC8qXG4gICAgIFx055Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsOaYr+S9v+eUqOS4i+agh+WIoOmZpOWvueixoeeahO+8jOaJgOS7peatpOWkhOWPjei9rGhvb2tz6ZuG5ZCI5ZCO77yM5YaN5Yig6ZmkXG4gICAgIFx05Zug5Li65LiA5Liq5pWw57uE5YWD57Sg5Yig6Zmk5ZCO77yM5YW25LuW5YWD57Sg55qE5LiL5qCH5Lya5Y+R55Sf5Y+Y5YyWXG4gICAqL1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdKSAhPSBudWxsID8gcmVmLnJldmVyc2UoKS5mb3JFYWNoKGZ1bmN0aW9uKF9ob29rKSB7XG4gICAgcmV0dXJuIF9ob29rLnJlbW92ZSgpO1xuICB9KSA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuaW5pdFRyaWdnZXJzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIG9iajtcbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjbGVhblRyaWdnZXIob2JqZWN0X25hbWUpO1xuICBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdO1xuICByZXR1cm4gXy5lYWNoKG9iai50cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlciwgdHJpZ2dlcl9uYW1lKSB7XG4gICAgdmFyIF90cmlnZ2VyX2hvb2s7XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcInNlcnZlclwiICYmIHRyaWdnZXIudG9kbyAmJiB0cmlnZ2VyLndoZW4pIHtcbiAgICAgIF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlcihvYmplY3RfbmFtZSwgdHJpZ2dlcik7XG4gICAgICBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIgJiYgdHJpZ2dlci50b2RvICYmIHRyaWdnZXIud2hlbikge1xuICAgICAgX3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyKG9iamVjdF9uYW1lLCB0cmlnZ2VyKTtcbiAgICAgIHJldHVybiBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgIW9ialxuXHRcdFx0cmV0dXJuXG5cdFx0cmV0dXJuIG9iai5wZXJtaXNzaW9ucy5nZXQoKVxuXHRlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcblxuQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyA9IChvYmplY3RfbmFtZSwgcmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpLT5cblx0aWYgIW9iamVjdF9uYW1lIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUoQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSkpXG5cblx0aWYgcmVjb3JkXG5cdFx0aXNPd25lciA9IHJlY29yZC5vd25lciA9PSB1c2VySWQgfHwgcmVjb3JkLm93bmVyPy5faWQgPT0gdXNlcklkXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHR1c2VyX2NvbXBhbnlfaWRzID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpXG5cdFx0ZWxzZVxuXHRcdFx0dXNlcl9jb21wYW55X2lkcyA9IENyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHModXNlcklkLCBzcGFjZUlkKVxuXHRcdHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkPy5jb21wYW55X2lkXG5cdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWQgYW5kIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWQpIGFuZCByZWNvcmRfY29tcGFueV9pZC5faWRcblx0XHRcdCMg5ZugcmVjb3JkX2NvbXBhbnlfaWTmmK9sb29rdXDnsbvlnovvvIzmnInlj6/og71keOaOp+S7tuS8muaKiuWug+aYoOWwhOi9rOS4uuWvueW6lOeahG9iamVjdO+8jOaJgOS7pei/memHjOWPluWHuuWFtl9pZOWAvFxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmRfY29tcGFueV9pZC5faWRcblx0XHRpZiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBhbmQgIWlzT3duZXIgYW5kICFwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRlbHNlIGlmIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRpZiByZWNvcmRfY29tcGFueV9pZCBhbmQgXy5pc1N0cmluZyhyZWNvcmRfY29tcGFueV9pZClcblx0XHRcdFx0aWYgdXNlcl9jb21wYW55X2lkcyBhbmQgdXNlcl9jb21wYW55X2lkcy5sZW5ndGhcblx0XHRcdFx0XHRpZiAhXy5pbmNsdWRlKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkKVxuXHRcdFx0XHRcdFx0IyDorrDlvZXnmoRjb21wYW55X2lk5bGe5oCn5LiN5Zyo5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+iMg+WbtOWGheaXtu+8jOiupOS4uuaXoOadg+S/ruaUuVxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCMg6K6w5b2V5pyJY29tcGFueV9pZOWxnuaAp++8jOS9huaYr+W9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPkuLrnqbrml7bvvIzorqTkuLrml6DmnYPkv67mlLlcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcblx0XHRpZiByZWNvcmQubG9ja2VkIGFuZCAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2VcblxuXHRcdGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgIWlzT3duZXIgYW5kICFwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFx0ZWxzZSBpZiBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkIGFuZCBfLmlzU3RyaW5nKHJlY29yZF9jb21wYW55X2lkKVxuXHRcdFx0XHRpZiB1c2VyX2NvbXBhbnlfaWRzIGFuZCB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aFxuXHRcdFx0XHRcdGlmICFfLmluY2x1ZGUodXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWQpXG5cdFx0XHRcdFx0XHQjIOiusOW9leeahGNvbXBhbnlfaWTlsZ7mgKfkuI3lnKjlvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz6IyD5Zu05YaF5pe277yM6K6k5Li65peg5p2D5p+l55yLXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0IyDorrDlvZXmnIljb21wYW55X2lk5bGe5oCn77yM5L2G5piv5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+S4uuepuuaXtu+8jOiupOS4uuaXoOadg+afpeeci1xuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cblx0cmV0dXJuIHBlcm1pc3Npb25zXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXG5cdENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMgPSAoc3BhY2VJZCwgdXNlcklkKSAtPlxuXHRcdHBlcm1pc3Npb25zID1cblx0XHRcdG9iamVjdHM6IHt9XG5cdFx0XHRhc3NpZ25lZF9hcHBzOiBbXVxuXHRcdHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRwc2V0c01lbWJlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzR3Vlc3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzV29ya2Zsb3dBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnd29ya2Zsb3dfYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgdXNlcnM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNPcmdhbml6YXRpb25BZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnb3JnYW5pemF0aW9uX2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIHVzZXJzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblxuXHRcdHBzZXRzQWRtaW5fcG9zID0gbnVsbFxuXHRcdHBzZXRzVXNlcl9wb3MgPSBudWxsXG5cdFx0cHNldHNNZW1iZXJfcG9zID0gbnVsbFxuXHRcdHBzZXRzR3Vlc3RfcG9zID0gbnVsbFxuXHRcdHBzZXRzV29ya2Zsb3dBZG1pbl9wb3MgPSBudWxsXG5cdFx0cHNldHNPcmdhbml6YXRpb25BZG1pbl9wb3MgPSBudWxsXG5cdFx0cHNldHNDdXJyZW50X3BvcyA9IG51bGxcblxuXHRcdGlmIHBzZXRzQWRtaW4/Ll9pZFxuXHRcdFx0cHNldHNBZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQWRtaW4uX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNVc2VyPy5faWRcblx0XHRcdHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzVXNlci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c01lbWJlcj8uX2lkXG5cdFx0XHRwc2V0c01lbWJlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzTWVtYmVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzR3Vlc3Q/Ll9pZFxuXHRcdFx0cHNldHNHdWVzdF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzR3Vlc3QuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNXb3JrZmxvd0FkbWluPy5faWRcblx0XHRcdHBzZXRzV29ya2Zsb3dBZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzV29ya2Zsb3dBZG1pbi5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c09yZ2FuaXphdGlvbkFkbWluPy5faWRcblx0XHRcdHBzZXRzT3JnYW5pemF0aW9uQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c09yZ2FuaXphdGlvbkFkbWluLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzQ3VycmVudC5sZW5ndGggPiAwXG5cdFx0XHRzZXRfaWRzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwiX2lkXCJcblx0XHRcdHBzZXRzQ3VycmVudF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHskaW46IHNldF9pZHN9fSkuZmV0Y2goKVxuXHRcdFx0cHNldHNDdXJyZW50TmFtZXMgPSBfLnBsdWNrIHBzZXRzQ3VycmVudCwgXCJuYW1lXCJcblx0XHRpc1NwYWNlQWRtaW4gPSBmYWxzZVxuXHRcdHNwYWNlVXNlciA9IG51bGxcblx0XHRpZiB1c2VySWRcblx0XHRcdGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblx0XHRcdGlzV29ya2Zsb3dBZG1pbiA9IHBzZXRzV29ya2Zsb3dBZG1pbj8udXNlcnM/LmluY2x1ZGVzKHVzZXJJZClcblx0XHRcdGlzT3JnYW5pemF0aW9uQWRtaW4gPSBwc2V0c09yZ2FuaXphdGlvbkFkbWluPy51c2Vycz8uaW5jbHVkZXModXNlcklkKVxuXHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXG5cblx0XHRwc2V0cyA9IHsgXG5cdFx0XHRwc2V0c0FkbWluLCBcblx0XHRcdHBzZXRzVXNlciwgXG5cdFx0XHRwc2V0c0N1cnJlbnQsIFxuXHRcdFx0cHNldHNNZW1iZXIsIFxuXHRcdFx0cHNldHNHdWVzdCwgXG5cdFx0XHRwc2V0c1dvcmtmbG93QWRtaW4sIFxuXHRcdFx0cHNldHNPcmdhbml6YXRpb25BZG1pbiwgXG5cdFx0XHRpc1NwYWNlQWRtaW4sIFxuXHRcdFx0aXNXb3JrZmxvd0FkbWluLFxuXHRcdFx0aXNPcmdhbml6YXRpb25BZG1pbixcblx0XHRcdHNwYWNlVXNlciwgXG5cdFx0XHRwc2V0c0FkbWluX3BvcywgXG5cdFx0XHRwc2V0c1VzZXJfcG9zLCBcblx0XHRcdHBzZXRzTWVtYmVyX3BvcywgXG5cdFx0XHRwc2V0c0d1ZXN0X3BvcywgXG5cdFx0XHRwc2V0c1dvcmtmbG93QWRtaW5fcG9zLCBcblx0XHRcdHBzZXRzT3JnYW5pemF0aW9uQWRtaW5fcG9zLCBcblx0XHRcdHBzZXRzQ3VycmVudF9wb3Ncblx0XHR9XG5cdFx0cGVybWlzc2lvbnMuYXNzaWduZWRfYXBwcyA9IENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZClcblx0XHRwZXJtaXNzaW9ucy5hc3NpZ25lZF9tZW51cyA9IENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpXG5cdFx0cGVybWlzc2lvbnMudXNlcl9wZXJtaXNzaW9uX3NldHMgPSBwc2V0c0N1cnJlbnROYW1lc1xuXHRcdF9pID0gMFxuXHRcdF8uZWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvYmplY3QsIG9iamVjdF9uYW1lKS0+XG5cdFx0XHRfaSsrXG5cdFx0XHRpZiAhXy5oYXMob2JqZWN0LCAnc3BhY2UnKSB8fCAhb2JqZWN0LnNwYWNlIHx8IG9iamVjdC5zcGFjZSA9PSBzcGFjZUlkXG5cdFx0XHRcdHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdID0gXy5jbG9uZSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSlcblx0XHRcdFx0cGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV1bXCJwZXJtaXNzaW9uc1wiXSA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHRyZXR1cm4gcGVybWlzc2lvbnNcblxuXHR1bmlvblBsdXMgPSAoYXJyYXksIG90aGVyKSAtPlxuXHRcdGlmICFhcnJheSBhbmQgIW90aGVyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkXG5cdFx0aWYgIWFycmF5XG5cdFx0XHRhcnJheSA9IFtdXG5cdFx0aWYgIW90aGVyXG5cdFx0XHRvdGhlciA9IFtdXG5cdFx0cmV0dXJuIF8udW5pb24oYXJyYXksIG90aGVyKVxuXG5cdENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzID0gKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRcdHBzZXRzQWRtaW4gPSB0aGlzLnBzZXRzQWRtaW4gfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0cHNldHNVc2VyID0gdGhpcy5wc2V0c1VzZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHQjIHBzZXRzTWVtYmVyID0gdGhpcy5wc2V0c01lbWJlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ21lbWJlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0IyBwc2V0c0d1ZXN0ID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHBzZXRzID0gIHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KS5mZXRjaCgpXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cdFx0YXBwcyA9IFtdXG5cdFx0aWYgaXNTcGFjZUFkbWluXG5cdFx0XHRyZXR1cm4gW11cblx0XHRlbHNlXG5cdFx0XHRwc2V0QmFzZSA9IHBzZXRzVXNlclxuXHRcdFx0aWYgcHNldEJhc2U/LmFzc2lnbmVkX2FwcHM/Lmxlbmd0aFxuXHRcdFx0XHRhcHBzID0gXy51bmlvbiBhcHBzLCBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCMgdXNlcuadg+mZkOe7hOS4reeahGFzc2lnbmVkX2FwcHPooajnpLrmiYDmnInnlKjmiLflhbfmnInnmoRhcHBz5p2D6ZmQ77yM5Li656m65YiZ6KGo56S65pyJ5omA5pyJYXBwc+adg+mZkO+8jOS4jemcgOimgeS9nOadg+mZkOWIpOaWreS6hlxuXHRcdFx0XHRyZXR1cm4gW11cblx0XHRcdF8uZWFjaCBwc2V0cywgKHBzZXQpLT5cblx0XHRcdFx0aWYgIXBzZXQuYXNzaWduZWRfYXBwc1xuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRpZiBwc2V0Lm5hbWUgPT0gXCJhZG1pblwiIHx8ICBwc2V0Lm5hbWUgPT0gXCJ1c2VyXCJcblx0XHRcdFx0XHQjIOi/memHjOS5i+aJgOS7peimgeaOkumZpGFkbWluL3VzZXLvvIzmmK/lm6DkuLrov5nkuKTkuKrmnYPpmZDnu4TmmK/miYDmnInmnYPpmZDnu4TkuK11c2Vyc+WxnuaAp+aXoOaViOeahOadg+mZkOe7hO+8jOeJueaMh+W3peS9nOWMuueuoeeQhuWRmOWSjOaJgOacieeUqOaIt1xuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRhcHBzID0gXy51bmlvbiBhcHBzLCBwc2V0LmFzc2lnbmVkX2FwcHNcblx0XHRcdHJldHVybiBfLndpdGhvdXQoXy51bmlxKGFwcHMpLHVuZGVmaW5lZCxudWxsKVxuXG5cdENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cyA9IChzcGFjZUlkLCB1c2VySWQpLT5cblx0XHRwc2V0cyA9ICB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxuXHRcdGFkbWluTWVudXMgPSBDcmVhdG9yLkFwcHMuYWRtaW4/LmFkbWluX21lbnVzXG5cdFx0IyDlpoLmnpzmsqHmnIlhZG1pbuiPnOWNleivtOaYjuS4jemcgOimgeebuOWFs+WKn+iDve+8jOebtOaOpei/lOWbnuepulxuXHRcdHVubGVzcyBhZG1pbk1lbnVzXG5cdFx0XHRyZXR1cm4gW11cblx0XHRhYm91dE1lbnUgPSBhZG1pbk1lbnVzLmZpbmQgKG4pIC0+XG5cdFx0XHRuLl9pZCA9PSAnYWJvdXQnXG5cdFx0YWRtaW5NZW51cyA9IGFkbWluTWVudXMuZmlsdGVyIChuKSAtPlxuXHRcdFx0bi5faWQgIT0gJ2Fib3V0J1xuXHRcdG90aGVyTWVudUFwcHMgPSBfLnNvcnRCeSBfLmZpbHRlcihfLnZhbHVlcyhDcmVhdG9yLkFwcHMpLCAobikgLT5cblx0XHRcdHJldHVybiBuLmFkbWluX21lbnVzIGFuZCBuLl9pZCAhPSAnYWRtaW4nXG5cdFx0KSwgJ3NvcnQnXG5cdFx0b3RoZXJNZW51cyA9IF8uZmxhdHRlbihfLnBsdWNrKG90aGVyTWVudUFwcHMsIFwiYWRtaW5fbWVudXNcIikpXG5cdFx0IyDoj5zljZXmnInkuInpg6jliIbnu4TmiJDorr7nva5BUFDoj5zljZXjgIHlhbbku5ZBUFDoj5zljZXku6Xlj4phYm91dOiPnOWNlVxuXHRcdGFsbE1lbnVzID0gXy51bmlvbihhZG1pbk1lbnVzLCBvdGhlck1lbnVzLCBbYWJvdXRNZW51XSlcblx0XHRpZiBpc1NwYWNlQWRtaW5cblx0XHRcdCMg5bel5L2c5Yy6566h55CG5ZGY5pyJ5YWo6YOo6I+c5Y2V5Yqf6IO9XG5cdFx0XHRyZXR1cm4gYWxsTWVudXNcblx0XHRlbHNlXG5cdFx0XHRjdXJyZW50UHNldE5hbWVzID0gcHNldHMubWFwIChuKSAtPlxuXHRcdFx0XHRyZXR1cm4gbi5uYW1lXG5cdFx0XHRtZW51cyA9IGFsbE1lbnVzLmZpbHRlciAobWVudSktPlxuXHRcdFx0XHRwc2V0c01lbnUgPSBtZW51LnBlcm1pc3Npb25fc2V0c1xuXHRcdFx0XHQjIOWmguaenOaZrumAmueUqOaIt+acieadg+mZkO+8jOWImeebtOaOpei/lOWbnnRydWVcblx0XHRcdFx0aWYgcHNldHNNZW51ICYmIHBzZXRzTWVudS5pbmRleE9mKFwidXNlclwiKSA+IC0xXG5cdFx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdFx0IyDlkKbliJnlj5blvZPliY3nlKjmiLfnmoTmnYPpmZDpm4bkuI5tZW516I+c5Y2V6KaB5rGC55qE5p2D6ZmQ6ZuG5a+55q+U77yM5aaC5p6c5Lqk6ZuG5aSn5LqOMeS4quWImei/lOWbnnRydWVcblx0XHRcdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKGN1cnJlbnRQc2V0TmFtZXMsIHBzZXRzTWVudSkubGVuZ3RoXG5cdFx0XHRyZXR1cm4gbWVudXNcblxuXHRmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0ID0gKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkKS0+XG5cblx0XHRpZiBfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdGlmIF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gXy5maW5kIHBlcm1pc3Npb25fb2JqZWN0cywgKHBvKS0+XG5cdFx0XHRcdFx0cmV0dXJuIHBvLm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkOiBwZXJtaXNzaW9uX3NldF9pZH0pXG5cblx0ZmluZF9wZXJtaXNzaW9uX29iamVjdCA9IChwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZHMpLT5cblx0XHRpZiBfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdGlmIF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gXy5maWx0ZXIgcGVybWlzc2lvbl9vYmplY3RzLCAocG8pLT5cblx0XHRcdFx0cmV0dXJuIHBvLm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXG5cdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQ6IHskaW46IHBlcm1pc3Npb25fc2V0X2lkc319KS5mZXRjaCgpXG5cblx0Q3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyA9IChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKS0+XG5cdFx0cGVybWlzc2lvbnMgPSB7fVxuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKVxuXG5cdFx0aWYgc3BhY2VJZCBpcyAnZ3Vlc3QnIHx8IG9iamVjdF9uYW1lID09IFwidXNlcnNcIlxuXHRcdFx0cGVybWlzc2lvbnMgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge31cblx0XHRcdENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zIHBlcm1pc3Npb25zXG5cdFx0XHRyZXR1cm4gcGVybWlzc2lvbnNcblx0XHRwc2V0c0FkbWluID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0FkbWluKSBvciB0aGlzLnBzZXRzQWRtaW4gdGhlbiB0aGlzLnBzZXRzQWRtaW4gZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHNVc2VyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c1VzZXIpIG9yIHRoaXMucHNldHNVc2VyIHRoZW4gdGhpcy5wc2V0c1VzZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c01lbWJlciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNNZW1iZXIpIG9yIHRoaXMucHNldHNNZW1iZXIgdGhlbiB0aGlzLnBzZXRzTWVtYmVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c0d1ZXN0ID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0d1ZXN0KSBvciB0aGlzLnBzZXRzR3Vlc3QgdGhlbiB0aGlzLnBzZXRzR3Vlc3QgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHNXb3JrZmxvd0FkbWluID0gaWYgXy5pc051bGwodGhpcy5wc2V0c1dvcmtmbG93QWRtaW4pIG9yIHRoaXMucHNldHNXb3JrZmxvd0FkbWluIHRoZW4gdGhpcy5wc2V0c1dvcmtmbG93QWRtaW4gZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3dvcmtmbG93X2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCB1c2VyczoxfX0pXG5cdFx0cHNldHNPcmdhbml6YXRpb25BZG1pbiA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNPcmdhbml6YXRpb25BZG1pbikgb3IgdGhpcy5wc2V0c09yZ2FuaXphdGlvbkFkbWluIHRoZW4gdGhpcy5wc2V0c09yZ2FuaXphdGlvbkFkbWluIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdvcmdhbml6YXRpb25fYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIHVzZXJzOjF9fSlcblx0XHRwc2V0cyA9ICB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxfX0pLmZldGNoKClcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblx0XHRpc1dvcmtmbG93QWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzV29ya2Zsb3dBZG1pbikgdGhlbiB0aGlzLmlzV29ya2Zsb3dBZG1pbiBlbHNlIHBzZXRzV29ya2Zsb3dBZG1pbj8udXNlcnM/LmluY2x1ZGVzKHVzZXJJZClcblx0XHRpc09yZ2FuaXphdGlvbkFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc09yZ2FuaXphdGlvbkFkbWluKSB0aGVuIHRoaXMuaXNPcmdhbml6YXRpb25BZG1pbiBlbHNlIHBzZXRzT3JnYW5pemF0aW9uQWRtaW4/LnVzZXJzPy5pbmNsdWRlcyh1c2VySWQpXG5cblx0XHRwc2V0c0FkbWluX3BvcyA9IHRoaXMucHNldHNBZG1pbl9wb3Ncblx0XHRwc2V0c1VzZXJfcG9zID0gdGhpcy5wc2V0c1VzZXJfcG9zXG5cdFx0cHNldHNNZW1iZXJfcG9zID0gdGhpcy5wc2V0c01lbWJlcl9wb3Ncblx0XHRwc2V0c0d1ZXN0X3BvcyA9IHRoaXMucHNldHNHdWVzdF9wb3Ncblx0XHRwc2V0c1dvcmtmbG93QWRtaW5fcG9zID0gdGhpcy5wc2V0c1dvcmtmbG93QWRtaW5fcG9zXG5cdFx0cHNldHNPcmdhbml6YXRpb25BZG1pbl9wb3MgPSB0aGlzLnBzZXRzT3JnYW5pemF0aW9uQWRtaW5fcG9zXG5cdFx0cHNldHNDdXJyZW50X3BvcyA9IHRoaXMucHNldHNDdXJyZW50X3Bvc1xuXG5cdFx0b3BzZXRBZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmFkbWluKSB8fCB7fVxuXHRcdG9wc2V0VXNlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnVzZXIpIHx8IHt9XG5cdFx0b3BzZXRNZW1iZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5tZW1iZXIpIHx8IHt9XG5cdFx0b3BzZXRHdWVzdCA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fVxuXHRcdG9wc2V0V29ya2Zsb3dBZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LndvcmtmbG93X2FkbWluKSB8fCB7fVxuXHRcdG9wc2V0T3JnYW5pemF0aW9uQWRtaW4gPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5vcmdhbml6YXRpb25fYWRtaW4pIHx8IHt9XG5cdFx0IyBzaGFyZWRMaXN0Vmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF9saXN0dmlld3MnKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBzaGFyZWQ6IHRydWV9LCB7ZmllbGRzOntfaWQ6MX19KS5mZXRjaCgpXG5cdFx0IyBzaGFyZWRMaXN0Vmlld3MgPSBfLnBsdWNrKHNoYXJlZExpc3RWaWV3cyxcIl9pZFwiKVxuXHRcdCMgaWYgc2hhcmVkTGlzdFZpZXdzLmxlbmd0aFxuXHRcdCMgXHR1bmxlc3Mgb3BzZXRBZG1pbi5saXN0X3ZpZXdzXG5cdFx0IyBcdFx0b3BzZXRBZG1pbi5saXN0X3ZpZXdzID0gW11cblx0XHQjIFx0b3BzZXRBZG1pbi5saXN0X3ZpZXdzID0gXy51bmlvbiBvcHNldEFkbWluLmxpc3Rfdmlld3MsIHNoYXJlZExpc3RWaWV3c1xuXHRcdCMgXHR1bmxlc3Mgb3BzZXRVc2VyLmxpc3Rfdmlld3Ncblx0XHQjIFx0XHRvcHNldFVzZXIubGlzdF92aWV3cyA9IFtdXG5cdFx0IyBcdG9wc2V0VXNlci5saXN0X3ZpZXdzID0gXy51bmlvbiBvcHNldFVzZXIubGlzdF92aWV3cywgc2hhcmVkTGlzdFZpZXdzXG5cdFx0IyDmlbDmja7lupPkuK3lpoLmnpzphY3nva7kuobpu5jorqTnmoRhZG1pbi91c2Vy5p2D6ZmQ6ZuG6K6+572u77yM5bqU6K+l6KaG55uW5Luj56CB5LitYWRtaW4vdXNlcueahOadg+mZkOmbhuiuvue9rlxuXHRcdGlmIHBzZXRzQWRtaW5cblx0XHRcdHBvc0FkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0FkbWluX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQWRtaW4uX2lkKVxuXHRcdFx0aWYgcG9zQWRtaW5cblx0XHRcdFx0b3BzZXRBZG1pbi5hbGxvd0NyZWF0ZSA9IHBvc0FkbWluLmFsbG93Q3JlYXRlXG5cdFx0XHRcdG9wc2V0QWRtaW4uYWxsb3dEZWxldGUgPSBwb3NBZG1pbi5hbGxvd0RlbGV0ZVxuXHRcdFx0XHRvcHNldEFkbWluLmFsbG93RWRpdCA9IHBvc0FkbWluLmFsbG93RWRpdFxuXHRcdFx0XHRvcHNldEFkbWluLmFsbG93UmVhZCA9IHBvc0FkbWluLmFsbG93UmVhZFxuXHRcdFx0XHRvcHNldEFkbWluLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NBZG1pbi5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdG9wc2V0QWRtaW4udmlld0FsbFJlY29yZHMgPSBwb3NBZG1pbi52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldEFkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zQWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0b3BzZXRBZG1pbi52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NBZG1pbi52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdFx0b3BzZXRBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zQWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdFx0XHRvcHNldEFkbWluLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NBZG1pbi5kaXNhYmxlZF9hY3Rpb25zXG5cdFx0XHRcdG9wc2V0QWRtaW4udW5yZWFkYWJsZV9maWVsZHMgPSBwb3NBZG1pbi51bnJlYWRhYmxlX2ZpZWxkc1xuXHRcdFx0XHRvcHNldEFkbWluLnVuZWRpdGFibGVfZmllbGRzID0gcG9zQWRtaW4udW5lZGl0YWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRBZG1pbi51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0FkbWluLnVucmVsYXRlZF9vYmplY3RzXG5cdFx0aWYgcHNldHNVc2VyXG5cdFx0XHRwb3NVc2VyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1VzZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNVc2VyLl9pZClcblx0XHRcdGlmIHBvc1VzZXJcblx0XHRcdFx0b3BzZXRVc2VyLmFsbG93Q3JlYXRlID0gcG9zVXNlci5hbGxvd0NyZWF0ZVxuXHRcdFx0XHRvcHNldFVzZXIuYWxsb3dEZWxldGUgPSBwb3NVc2VyLmFsbG93RGVsZXRlXG5cdFx0XHRcdG9wc2V0VXNlci5hbGxvd0VkaXQgPSBwb3NVc2VyLmFsbG93RWRpdFxuXHRcdFx0XHRvcHNldFVzZXIuYWxsb3dSZWFkID0gcG9zVXNlci5hbGxvd1JlYWRcblx0XHRcdFx0b3BzZXRVc2VyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NVc2VyLm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0b3BzZXRVc2VyLnZpZXdBbGxSZWNvcmRzID0gcG9zVXNlci52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldFVzZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NVc2VyLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdG9wc2V0VXNlci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NVc2VyLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRvcHNldFVzZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc1VzZXIuZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdFx0XHRvcHNldFVzZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc1VzZXIuZGlzYWJsZWRfYWN0aW9uc1xuXHRcdFx0XHRvcHNldFVzZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NVc2VyLnVucmVhZGFibGVfZmllbGRzXG5cdFx0XHRcdG9wc2V0VXNlci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc1VzZXIudW5lZGl0YWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRVc2VyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zVXNlci51bnJlbGF0ZWRfb2JqZWN0c1xuXHRcdGlmIHBzZXRzTWVtYmVyXG5cdFx0XHRwb3NNZW1iZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzTWVtYmVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzTWVtYmVyLl9pZClcblx0XHRcdGlmIHBvc01lbWJlclxuXHRcdFx0XHRvcHNldE1lbWJlci5hbGxvd0NyZWF0ZSA9IHBvc01lbWJlci5hbGxvd0NyZWF0ZVxuXHRcdFx0XHRvcHNldE1lbWJlci5hbGxvd0RlbGV0ZSA9IHBvc01lbWJlci5hbGxvd0RlbGV0ZVxuXHRcdFx0XHRvcHNldE1lbWJlci5hbGxvd0VkaXQgPSBwb3NNZW1iZXIuYWxsb3dFZGl0XG5cdFx0XHRcdG9wc2V0TWVtYmVyLmFsbG93UmVhZCA9IHBvc01lbWJlci5hbGxvd1JlYWRcblx0XHRcdFx0b3BzZXRNZW1iZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc01lbWJlci5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnZpZXdBbGxSZWNvcmRzID0gcG9zTWVtYmVyLnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdG9wc2V0TWVtYmVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zTWVtYmVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc01lbWJlci52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdFx0b3BzZXRNZW1iZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc01lbWJlci5kaXNhYmxlZF9saXN0X3ZpZXdzXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NNZW1iZXIuZGlzYWJsZWRfYWN0aW9uc1xuXHRcdFx0XHRvcHNldE1lbWJlci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc01lbWJlci51bnJlYWRhYmxlX2ZpZWxkc1xuXHRcdFx0XHRvcHNldE1lbWJlci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc01lbWJlci51bmVkaXRhYmxlX2ZpZWxkc1xuXHRcdFx0XHRvcHNldE1lbWJlci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc01lbWJlci51bnJlbGF0ZWRfb2JqZWN0c1xuXHRcdGlmIHBzZXRzR3Vlc3Rcblx0XHRcdHBvc0d1ZXN0ID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0d1ZXN0X3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzR3Vlc3QuX2lkKVxuXHRcdFx0aWYgcG9zR3Vlc3Rcblx0XHRcdFx0b3BzZXRHdWVzdC5hbGxvd0NyZWF0ZSA9IHBvc0d1ZXN0LmFsbG93Q3JlYXRlXG5cdFx0XHRcdG9wc2V0R3Vlc3QuYWxsb3dEZWxldGUgPSBwb3NHdWVzdC5hbGxvd0RlbGV0ZVxuXHRcdFx0XHRvcHNldEd1ZXN0LmFsbG93RWRpdCA9IHBvc0d1ZXN0LmFsbG93RWRpdFxuXHRcdFx0XHRvcHNldEd1ZXN0LmFsbG93UmVhZCA9IHBvc0d1ZXN0LmFsbG93UmVhZFxuXHRcdFx0XHRvcHNldEd1ZXN0Lm1vZGlmeUFsbFJlY29yZHMgPSBwb3NHdWVzdC5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdG9wc2V0R3Vlc3Qudmlld0FsbFJlY29yZHMgPSBwb3NHdWVzdC52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldEd1ZXN0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zR3Vlc3QubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0b3BzZXRHdWVzdC52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NHdWVzdC52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdFx0b3BzZXRHdWVzdC5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zR3Vlc3QuZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdFx0XHRvcHNldEd1ZXN0LmRpc2FibGVkX2FjdGlvbnMgPSBwb3NHdWVzdC5kaXNhYmxlZF9hY3Rpb25zXG5cdFx0XHRcdG9wc2V0R3Vlc3QudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NHdWVzdC51bnJlYWRhYmxlX2ZpZWxkc1xuXHRcdFx0XHRvcHNldEd1ZXN0LnVuZWRpdGFibGVfZmllbGRzID0gcG9zR3Vlc3QudW5lZGl0YWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRHdWVzdC51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0d1ZXN0LnVucmVsYXRlZF9vYmplY3RzXG5cdFx0aWYgcHNldHNXb3JrZmxvd0FkbWluXG5cdFx0XHRwb3NXb3JrZmxvd0FkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1dvcmtmbG93QWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNXb3JrZmxvd0FkbWluLl9pZClcblx0XHRcdGlmIHBvc1dvcmtmbG93QWRtaW5cblx0XHRcdFx0b3BzZXRXb3JrZmxvd0FkbWluLmFsbG93Q3JlYXRlID0gcG9zV29ya2Zsb3dBZG1pbi5hbGxvd0NyZWF0ZVxuXHRcdFx0XHRvcHNldFdvcmtmbG93QWRtaW4uYWxsb3dEZWxldGUgPSBwb3NXb3JrZmxvd0FkbWluLmFsbG93RGVsZXRlXG5cdFx0XHRcdG9wc2V0V29ya2Zsb3dBZG1pbi5hbGxvd0VkaXQgPSBwb3NXb3JrZmxvd0FkbWluLmFsbG93RWRpdFxuXHRcdFx0XHRvcHNldFdvcmtmbG93QWRtaW4uYWxsb3dSZWFkID0gcG9zV29ya2Zsb3dBZG1pbi5hbGxvd1JlYWRcblx0XHRcdFx0b3BzZXRXb3JrZmxvd0FkbWluLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NXb3JrZmxvd0FkbWluLm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0b3BzZXRXb3JrZmxvd0FkbWluLnZpZXdBbGxSZWNvcmRzID0gcG9zV29ya2Zsb3dBZG1pbi52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldFdvcmtmbG93QWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NXb3JrZmxvd0FkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdG9wc2V0V29ya2Zsb3dBZG1pbi52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NXb3JrZmxvd0FkbWluLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRvcHNldFdvcmtmbG93QWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc1dvcmtmbG93QWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdFx0XHRvcHNldFdvcmtmbG93QWRtaW4uZGlzYWJsZWRfYWN0aW9ucyA9IHBvc1dvcmtmbG93QWRtaW4uZGlzYWJsZWRfYWN0aW9uc1xuXHRcdFx0XHRvcHNldFdvcmtmbG93QWRtaW4udW5yZWFkYWJsZV9maWVsZHMgPSBwb3NXb3JrZmxvd0FkbWluLnVucmVhZGFibGVfZmllbGRzXG5cdFx0XHRcdG9wc2V0V29ya2Zsb3dBZG1pbi51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc1dvcmtmbG93QWRtaW4udW5lZGl0YWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRXb3JrZmxvd0FkbWluLnVucmVsYXRlZF9vYmplY3RzID0gcG9zV29ya2Zsb3dBZG1pbi51bnJlbGF0ZWRfb2JqZWN0c1xuXHRcdGlmIHBzZXRzT3JnYW5pemF0aW9uQWRtaW5cblx0XHRcdHBvc09yZ2FuaXphdGlvbkFkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c09yZ2FuaXphdGlvbkFkbWluX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzT3JnYW5pemF0aW9uQWRtaW4uX2lkKVxuXHRcdFx0aWYgcG9zT3JnYW5pemF0aW9uQWRtaW5cblx0XHRcdFx0b3BzZXRPcmdhbml6YXRpb25BZG1pbi5hbGxvd0NyZWF0ZSA9IHBvc09yZ2FuaXphdGlvbkFkbWluLmFsbG93Q3JlYXRlXG5cdFx0XHRcdG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uYWxsb3dEZWxldGUgPSBwb3NPcmdhbml6YXRpb25BZG1pbi5hbGxvd0RlbGV0ZVxuXHRcdFx0XHRvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93RWRpdCA9IHBvc09yZ2FuaXphdGlvbkFkbWluLmFsbG93RWRpdFxuXHRcdFx0XHRvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93UmVhZCA9IHBvc09yZ2FuaXphdGlvbkFkbWluLmFsbG93UmVhZFxuXHRcdFx0XHRvcHNldE9yZ2FuaXphdGlvbkFkbWluLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NPcmdhbml6YXRpb25BZG1pbi5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdG9wc2V0T3JnYW5pemF0aW9uQWRtaW4udmlld0FsbFJlY29yZHMgPSBwb3NPcmdhbml6YXRpb25BZG1pbi52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldE9yZ2FuaXphdGlvbkFkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zT3JnYW5pemF0aW9uQWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0b3BzZXRPcmdhbml6YXRpb25BZG1pbi52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NPcmdhbml6YXRpb25BZG1pbi52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdFx0b3BzZXRPcmdhbml6YXRpb25BZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zT3JnYW5pemF0aW9uQWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdFx0XHRvcHNldE9yZ2FuaXphdGlvbkFkbWluLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NPcmdhbml6YXRpb25BZG1pbi5kaXNhYmxlZF9hY3Rpb25zXG5cdFx0XHRcdG9wc2V0T3JnYW5pemF0aW9uQWRtaW4udW5yZWFkYWJsZV9maWVsZHMgPSBwb3NPcmdhbml6YXRpb25BZG1pbi51bnJlYWRhYmxlX2ZpZWxkc1xuXHRcdFx0XHRvcHNldE9yZ2FuaXphdGlvbkFkbWluLnVuZWRpdGFibGVfZmllbGRzID0gcG9zT3JnYW5pemF0aW9uQWRtaW4udW5lZGl0YWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRPcmdhbml6YXRpb25BZG1pbi51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc09yZ2FuaXphdGlvbkFkbWluLnVucmVsYXRlZF9vYmplY3RzXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEFkbWluXG5cdFx0ZWxzZVxuXHRcdFx0aWYgaXNTcGFjZUFkbWluXG5cdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRBZG1pblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBzcGFjZUlkIGlzICdjb21tb24nXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHNwYWNlVXNlciA9IGlmIF8uaXNOdWxsKHRoaXMuc3BhY2VVc2VyKSBvciB0aGlzLnNwYWNlVXNlciB0aGVuIHRoaXMuc3BhY2VVc2VyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXG5cdFx0XHRcdFx0aWYgc3BhY2VVc2VyXG5cdFx0XHRcdFx0XHRwcm9mID0gc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdFx0XHRcdGlmIHByb2Zcblx0XHRcdFx0XHRcdFx0aWYgcHJvZiBpcyAndXNlcidcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ21lbWJlcidcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0TWVtYmVyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnZ3Vlc3QnXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0XG5cdFx0XHRcdFx0XHRlbHNlICMg5rKh5pyJcHJvZmlsZeWImeiupOS4uuaYr3VzZXLmnYPpmZBcblx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3RcblxuXHRcdGlmIHBzZXRzLmxlbmd0aCA+IDBcblx0XHRcdHNldF9pZHMgPSBfLnBsdWNrIHBzZXRzLCBcIl9pZFwiXG5cdFx0XHRwb3MgPSBmaW5kX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VycmVudF9wb3MsIG9iamVjdF9uYW1lLCBzZXRfaWRzKVxuXHRcdFx0Xy5lYWNoIHBvcywgKHBvKS0+XG5cdFx0XHRcdGlmIHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzQWRtaW4/Ll9pZCBvciBcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNVc2VyPy5faWQgb3IgXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzTWVtYmVyPy5faWQgb3IgXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzR3Vlc3Q/Ll9pZCBvciBcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNXb3JrZmxvd0FkbWluPy5faWQgb3IgXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzT3JnYW5pemF0aW9uQWRtaW4/Ll9pZFxuXHRcdFx0XHRcdCMg6buY6K6k55qEYWRtaW4vdXNlcuadg+mZkOWAvOWPquWunuihjOS4iumdoueahOm7mOiupOWAvOimhueblu+8jOS4jeWBmueul+azleWIpOaWrVxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRpZiBwby5hbGxvd1JlYWRcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSB0cnVlXG5cdFx0XHRcdGlmIHBvLmFsbG93Q3JlYXRlXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSB0cnVlXG5cdFx0XHRcdGlmIHBvLmFsbG93RWRpdFxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHRydWVcblx0XHRcdFx0aWYgcG8uYWxsb3dEZWxldGVcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHRydWVcblx0XHRcdFx0aWYgcG8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSB0cnVlXG5cdFx0XHRcdGlmIHBvLnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgPSB0cnVlXG5cdFx0XHRcdGlmIHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSB0cnVlXG5cdFx0XHRcdGlmIHBvLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRcdHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcblxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIHBvLmRpc2FibGVkX2xpc3Rfdmlld3MpXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgcG8uZGlzYWJsZWRfYWN0aW9ucylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIHBvLnVucmVhZGFibGVfZmllbGRzKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgcG8udW5lZGl0YWJsZV9maWVsZHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBwby51bnJlbGF0ZWRfb2JqZWN0cylcblxuXHRcdFx0aWYgaXNXb3JrZmxvd0FkbWluXG5cdFx0XHRcdGlmIG9wc2V0V29ya2Zsb3dBZG1pbi5hbGxvd1JlYWRcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSB0cnVlXG5cdFx0XHRcdGlmIG9wc2V0V29ya2Zsb3dBZG1pbi5hbGxvd0NyZWF0ZVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gdHJ1ZVxuXHRcdFx0XHRpZiBvcHNldFdvcmtmbG93QWRtaW4uYWxsb3dFZGl0XG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdFx0XHRpZiBvcHNldFdvcmtmbG93QWRtaW4uYWxsb3dEZWxldGVcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHRydWVcblx0XHRcdFx0aWYgb3BzZXRXb3JrZmxvd0FkbWluLm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gdHJ1ZVxuXHRcdFx0XHRpZiBvcHNldFdvcmtmbG93QWRtaW4udmlld0FsbFJlY29yZHNcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA9IHRydWVcblx0XHRcdFx0aWYgb3BzZXRXb3JrZmxvd0FkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSB0cnVlXG5cdFx0XHRcdGlmIG9wc2V0V29ya2Zsb3dBZG1pbi52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlXG5cblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzLCBvcHNldFdvcmtmbG93QWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cylcblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zLCBvcHNldFdvcmtmbG93QWRtaW4uZGlzYWJsZWRfYWN0aW9ucylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIG9wc2V0V29ya2Zsb3dBZG1pbi51bnJlYWRhYmxlX2ZpZWxkcylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIG9wc2V0V29ya2Zsb3dBZG1pbi51bmVkaXRhYmxlX2ZpZWxkcylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMsIG9wc2V0V29ya2Zsb3dBZG1pbi51bnJlbGF0ZWRfb2JqZWN0cylcblxuXHRcdFx0aWYgaXNPcmdhbml6YXRpb25BZG1pblxuXHRcdFx0XHRpZiBvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93UmVhZFxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHRydWVcblx0XHRcdFx0aWYgb3BzZXRPcmdhbml6YXRpb25BZG1pbi5hbGxvd0NyZWF0ZVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gdHJ1ZVxuXHRcdFx0XHRpZiBvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93RWRpdFxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHRydWVcblx0XHRcdFx0aWYgb3BzZXRPcmdhbml6YXRpb25BZG1pbi5hbGxvd0RlbGV0ZVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gdHJ1ZVxuXHRcdFx0XHRpZiBvcHNldE9yZ2FuaXphdGlvbkFkbWluLm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gdHJ1ZVxuXHRcdFx0XHRpZiBvcHNldE9yZ2FuaXphdGlvbkFkbWluLnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgPSB0cnVlXG5cdFx0XHRcdGlmIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHRydWVcblx0XHRcdFx0aWYgb3BzZXRPcmdhbml6YXRpb25BZG1pbi52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlXG5cblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzLCBvcHNldE9yZ2FuaXphdGlvbkFkbWluLmRpc2FibGVkX2xpc3Rfdmlld3MpXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgb3BzZXRPcmdhbml6YXRpb25BZG1pbi5kaXNhYmxlZF9hY3Rpb25zKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgb3BzZXRPcmdhbml6YXRpb25BZG1pbi51bnJlYWRhYmxlX2ZpZWxkcylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4udW5lZGl0YWJsZV9maWVsZHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBvcHNldE9yZ2FuaXphdGlvbkFkbWluLnVucmVsYXRlZF9vYmplY3RzKVxuXHRcdFxuXHRcdGlmIG9iamVjdC5pc192aWV3XG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gW11cblx0XHRDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyBwZXJtaXNzaW9uc1xuXHRcdHJldHVybiBwZXJtaXNzaW9uc1xuXG5cblx0IyBDcmVhdG9yLmluaXRQZXJtaXNzaW9ucyA9IChvYmplY3RfbmFtZSkgLT5cblxuXHRcdCMgIyDlupTor6XmiororqHnrpflh7rmnaXnmoRcblx0XHQjIENyZWF0b3IuQ29sbGVjdGlvbnNbb2JqZWN0X25hbWVdLmFsbG93XG5cdFx0IyBcdGluc2VydDogKHVzZXJJZCwgZG9jKSAtPlxuXHRcdCMgXHRcdGlmICF1c2VySWRcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2Vcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHQgICAgXHQjIFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoZG9jLnNwYWNlLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdCMgXHRcdGlmICFwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHQjIFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdCMgXHR1cGRhdGU6ICh1c2VySWQsIGRvYykgLT5cblx0XHQjIFx0XHRpZiAhdXNlcklkXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRpZiAhZG9jLnNwYWNlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoZG9jLnNwYWNlLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdCMgXHRcdGlmICFwZXJtaXNzaW9ucy5hbGxvd0VkaXRcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHJldHVybiB0cnVlXG5cdFx0IyBcdHJlbW92ZTogKHVzZXJJZCwgZG9jKSAtPlxuXHRcdCMgXHRcdGlmICF1c2VySWRcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2Vcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93RGVsZXRlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRyZXR1cm4gdHJ1ZVxuXG5cdE1ldGVvci5tZXRob2RzXG5cdFx0IyBDYWxjdWxhdGUgUGVybWlzc2lvbnMgb24gU2VydmVyXG5cdFx0XCJjcmVhdG9yLm9iamVjdF9wZXJtaXNzaW9uc1wiOiAoc3BhY2VJZCktPlxuXHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdGhpcy51c2VySWQpXG4iLCJ2YXIgZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCwgZmluZF9wZXJtaXNzaW9uX29iamVjdCwgdW5pb25QbHVzO1xuXG5DcmVhdG9yLmdldFBlcm1pc3Npb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgb2JqO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKCFvYmopIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIG9iai5wZXJtaXNzaW9ucy5nZXQoKTtcbiAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgaXNPd25lciwgcGVybWlzc2lvbnMsIHJlY29yZF9jb21wYW55X2lkLCByZWYsIHVzZXJfY29tcGFueV9pZHM7XG4gIGlmICghb2JqZWN0X25hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIHBlcm1pc3Npb25zID0gXy5jbG9uZShDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKSk7XG4gIGlmIChyZWNvcmQpIHtcbiAgICBpc093bmVyID0gcmVjb3JkLm93bmVyID09PSB1c2VySWQgfHwgKChyZWYgPSByZWNvcmQub3duZXIpICE9IG51bGwgPyByZWYuX2lkIDogdm9pZCAwKSA9PT0gdXNlcklkO1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHVzZXJfY29tcGFueV9pZHMgPSBTdGVlZG9zLmdldFVzZXJDb21wYW55SWRzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJfY29tcGFueV9pZHMgPSBDcmVhdG9yLmdldFVzZXJDb21wYW55SWRzKHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgfVxuICAgIHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkICE9IG51bGwgPyByZWNvcmQuY29tcGFueV9pZCA6IHZvaWQgMDtcbiAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWQgJiYgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZCkgJiYgcmVjb3JkX2NvbXBhbnlfaWQuX2lkKSB7XG4gICAgICByZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZF9jb21wYW55X2lkLl9pZDtcbiAgICB9XG4gICAgaWYgKCFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzICYmICFpc093bmVyICYmICFwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAocGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZCAmJiBfLmlzU3RyaW5nKHJlY29yZF9jb21wYW55X2lkKSkge1xuICAgICAgICBpZiAodXNlcl9jb21wYW55X2lkcyAmJiB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgIGlmICghXy5pbmNsdWRlKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkKSkge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChyZWNvcmQubG9ja2VkICYmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgfVxuICAgIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgIWlzT3duZXIgJiYgIXBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZCAmJiBfLmlzU3RyaW5nKHJlY29yZF9jb21wYW55X2lkKSkge1xuICAgICAgICBpZiAodXNlcl9jb21wYW55X2lkcyAmJiB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgIGlmICghXy5pbmNsdWRlKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkKSkge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBwZXJtaXNzaW9ucztcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBfaSwgaXNPcmdhbml6YXRpb25BZG1pbiwgaXNTcGFjZUFkbWluLCBpc1dvcmtmbG93QWRtaW4sIHBlcm1pc3Npb25zLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNBZG1pbl9wb3MsIHBzZXRzQ3VycmVudCwgcHNldHNDdXJyZW50TmFtZXMsIHBzZXRzQ3VycmVudF9wb3MsIHBzZXRzR3Vlc3QsIHBzZXRzR3Vlc3RfcG9zLCBwc2V0c01lbWJlciwgcHNldHNNZW1iZXJfcG9zLCBwc2V0c09yZ2FuaXphdGlvbkFkbWluLCBwc2V0c09yZ2FuaXphdGlvbkFkbWluX3BvcywgcHNldHNVc2VyLCBwc2V0c1VzZXJfcG9zLCBwc2V0c1dvcmtmbG93QWRtaW4sIHBzZXRzV29ya2Zsb3dBZG1pbl9wb3MsIHJlZiwgcmVmMSwgc2V0X2lkcywgc3BhY2VVc2VyO1xuICAgIHBlcm1pc3Npb25zID0ge1xuICAgICAgb2JqZWN0czoge30sXG4gICAgICBhc3NpZ25lZF9hcHBzOiBbXVxuICAgIH07XG4gICAgcHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzTWVtYmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdtZW1iZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNHdWVzdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnZ3Vlc3QnXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNXb3JrZmxvd0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd3b3JrZmxvd19hZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICB1c2VyczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNPcmdhbml6YXRpb25BZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnb3JnYW5pemF0aW9uX2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgIHVzZXJzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgIG5hbWU6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHBzZXRzQWRtaW5fcG9zID0gbnVsbDtcbiAgICBwc2V0c1VzZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c01lbWJlcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzR3Vlc3RfcG9zID0gbnVsbDtcbiAgICBwc2V0c1dvcmtmbG93QWRtaW5fcG9zID0gbnVsbDtcbiAgICBwc2V0c09yZ2FuaXphdGlvbkFkbWluX3BvcyA9IG51bGw7XG4gICAgcHNldHNDdXJyZW50X3BvcyA9IG51bGw7XG4gICAgaWYgKHBzZXRzQWRtaW4gIT0gbnVsbCA/IHBzZXRzQWRtaW4uX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQWRtaW4uX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNVc2VyICE9IG51bGwgPyBwc2V0c1VzZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c1VzZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzTWVtYmVyICE9IG51bGwgPyBwc2V0c01lbWJlci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzTWVtYmVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzR3Vlc3QgIT0gbnVsbCA/IHBzZXRzR3Vlc3QuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzR3Vlc3QuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNXb3JrZmxvd0FkbWluICE9IG51bGwgPyBwc2V0c1dvcmtmbG93QWRtaW4uX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c1dvcmtmbG93QWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNXb3JrZmxvd0FkbWluLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzT3JnYW5pemF0aW9uQWRtaW4gIT0gbnVsbCA/IHBzZXRzT3JnYW5pemF0aW9uQWRtaW4uX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c09yZ2FuaXphdGlvbkFkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzT3JnYW5pemF0aW9uQWRtaW4uX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNDdXJyZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgIHNldF9pZHMgPSBfLnBsdWNrKHBzZXRzQ3VycmVudCwgXCJfaWRcIik7XG4gICAgICBwc2V0c0N1cnJlbnRfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDoge1xuICAgICAgICAgICRpbjogc2V0X2lkc1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgcHNldHNDdXJyZW50TmFtZXMgPSBfLnBsdWNrKHBzZXRzQ3VycmVudCwgXCJuYW1lXCIpO1xuICAgIH1cbiAgICBpc1NwYWNlQWRtaW4gPSBmYWxzZTtcbiAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgIGlmICh1c2VySWQpIHtcbiAgICAgIGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgICBpc1dvcmtmbG93QWRtaW4gPSBwc2V0c1dvcmtmbG93QWRtaW4gIT0gbnVsbCA/IChyZWYgPSBwc2V0c1dvcmtmbG93QWRtaW4udXNlcnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXModXNlcklkKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlzT3JnYW5pemF0aW9uQWRtaW4gPSBwc2V0c09yZ2FuaXphdGlvbkFkbWluICE9IG51bGwgPyAocmVmMSA9IHBzZXRzT3JnYW5pemF0aW9uQWRtaW4udXNlcnMpICE9IG51bGwgPyByZWYxLmluY2x1ZGVzKHVzZXJJZCkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBwc2V0cyA9IHtcbiAgICAgIHBzZXRzQWRtaW46IHBzZXRzQWRtaW4sXG4gICAgICBwc2V0c1VzZXI6IHBzZXRzVXNlcixcbiAgICAgIHBzZXRzQ3VycmVudDogcHNldHNDdXJyZW50LFxuICAgICAgcHNldHNNZW1iZXI6IHBzZXRzTWVtYmVyLFxuICAgICAgcHNldHNHdWVzdDogcHNldHNHdWVzdCxcbiAgICAgIHBzZXRzV29ya2Zsb3dBZG1pbjogcHNldHNXb3JrZmxvd0FkbWluLFxuICAgICAgcHNldHNPcmdhbml6YXRpb25BZG1pbjogcHNldHNPcmdhbml6YXRpb25BZG1pbixcbiAgICAgIGlzU3BhY2VBZG1pbjogaXNTcGFjZUFkbWluLFxuICAgICAgaXNXb3JrZmxvd0FkbWluOiBpc1dvcmtmbG93QWRtaW4sXG4gICAgICBpc09yZ2FuaXphdGlvbkFkbWluOiBpc09yZ2FuaXphdGlvbkFkbWluLFxuICAgICAgc3BhY2VVc2VyOiBzcGFjZVVzZXIsXG4gICAgICBwc2V0c0FkbWluX3BvczogcHNldHNBZG1pbl9wb3MsXG4gICAgICBwc2V0c1VzZXJfcG9zOiBwc2V0c1VzZXJfcG9zLFxuICAgICAgcHNldHNNZW1iZXJfcG9zOiBwc2V0c01lbWJlcl9wb3MsXG4gICAgICBwc2V0c0d1ZXN0X3BvczogcHNldHNHdWVzdF9wb3MsXG4gICAgICBwc2V0c1dvcmtmbG93QWRtaW5fcG9zOiBwc2V0c1dvcmtmbG93QWRtaW5fcG9zLFxuICAgICAgcHNldHNPcmdhbml6YXRpb25BZG1pbl9wb3M6IHBzZXRzT3JnYW5pemF0aW9uQWRtaW5fcG9zLFxuICAgICAgcHNldHNDdXJyZW50X3BvczogcHNldHNDdXJyZW50X3Bvc1xuICAgIH07XG4gICAgcGVybWlzc2lvbnMuYXNzaWduZWRfYXBwcyA9IENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcGVybWlzc2lvbnMuYXNzaWduZWRfbWVudXMgPSBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwZXJtaXNzaW9ucy51c2VyX3Blcm1pc3Npb25fc2V0cyA9IHBzZXRzQ3VycmVudE5hbWVzO1xuICAgIF9pID0gMDtcbiAgICBfLmVhY2goQ3JlYXRvci5vYmplY3RzQnlOYW1lLCBmdW5jdGlvbihvYmplY3QsIG9iamVjdF9uYW1lKSB7XG4gICAgICBfaSsrO1xuICAgICAgaWYgKCFfLmhhcyhvYmplY3QsICdzcGFjZScpIHx8ICFvYmplY3Quc3BhY2UgfHwgb2JqZWN0LnNwYWNlID09PSBzcGFjZUlkKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdID0gXy5jbG9uZShDcmVhdG9yLmNvbnZlcnRPYmplY3QoQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSkpO1xuICAgICAgICByZXR1cm4gcGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV1bXCJwZXJtaXNzaW9uc1wiXSA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICB9O1xuICB1bmlvblBsdXMgPSBmdW5jdGlvbihhcnJheSwgb3RoZXIpIHtcbiAgICBpZiAoIWFycmF5ICYmICFvdGhlcikge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKCFhcnJheSkge1xuICAgICAgYXJyYXkgPSBbXTtcbiAgICB9XG4gICAgaWYgKCFvdGhlcikge1xuICAgICAgb3RoZXIgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIF8udW5pb24oYXJyYXksIG90aGVyKTtcbiAgfTtcbiAgQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgYXBwcywgaXNTcGFjZUFkbWluLCBwc2V0QmFzZSwgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzVXNlciwgcmVmO1xuICAgIHBzZXRzQWRtaW4gPSB0aGlzLnBzZXRzQWRtaW4gfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gdGhpcy5wc2V0c1VzZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGFwcHMgPSBbXTtcbiAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHBzZXRCYXNlID0gcHNldHNVc2VyO1xuICAgICAgaWYgKHBzZXRCYXNlICE9IG51bGwgPyAocmVmID0gcHNldEJhc2UuYXNzaWduZWRfYXBwcykgIT0gbnVsbCA/IHJlZi5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgYXBwcyA9IF8udW5pb24oYXBwcywgcHNldEJhc2UuYXNzaWduZWRfYXBwcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICBfLmVhY2gocHNldHMsIGZ1bmN0aW9uKHBzZXQpIHtcbiAgICAgICAgaWYgKCFwc2V0LmFzc2lnbmVkX2FwcHMpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBzZXQubmFtZSA9PT0gXCJhZG1pblwiIHx8IHBzZXQubmFtZSA9PT0gXCJ1c2VyXCIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFwcHMgPSBfLnVuaW9uKGFwcHMsIHBzZXQuYXNzaWduZWRfYXBwcyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLndpdGhvdXQoXy51bmlxKGFwcHMpLCB2b2lkIDAsIG51bGwpO1xuICAgIH1cbiAgfTtcbiAgQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGFib3V0TWVudSwgYWRtaW5NZW51cywgYWxsTWVudXMsIGN1cnJlbnRQc2V0TmFtZXMsIGlzU3BhY2VBZG1pbiwgbWVudXMsIG90aGVyTWVudUFwcHMsIG90aGVyTWVudXMsIHBzZXRzLCByZWY7XG4gICAgcHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIG5hbWU6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBhZG1pbk1lbnVzID0gKHJlZiA9IENyZWF0b3IuQXBwcy5hZG1pbikgIT0gbnVsbCA/IHJlZi5hZG1pbl9tZW51cyA6IHZvaWQgMDtcbiAgICBpZiAoIWFkbWluTWVudXMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgYWJvdXRNZW51ID0gYWRtaW5NZW51cy5maW5kKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLl9pZCA9PT0gJ2Fib3V0JztcbiAgICB9KTtcbiAgICBhZG1pbk1lbnVzID0gYWRtaW5NZW51cy5maWx0ZXIoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uX2lkICE9PSAnYWJvdXQnO1xuICAgIH0pO1xuICAgIG90aGVyTWVudUFwcHMgPSBfLnNvcnRCeShfLmZpbHRlcihfLnZhbHVlcyhDcmVhdG9yLkFwcHMpLCBmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5hZG1pbl9tZW51cyAmJiBuLl9pZCAhPT0gJ2FkbWluJztcbiAgICB9KSwgJ3NvcnQnKTtcbiAgICBvdGhlck1lbnVzID0gXy5mbGF0dGVuKF8ucGx1Y2sob3RoZXJNZW51QXBwcywgXCJhZG1pbl9tZW51c1wiKSk7XG4gICAgYWxsTWVudXMgPSBfLnVuaW9uKGFkbWluTWVudXMsIG90aGVyTWVudXMsIFthYm91dE1lbnVdKTtcbiAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICByZXR1cm4gYWxsTWVudXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnRQc2V0TmFtZXMgPSBwc2V0cy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5uYW1lO1xuICAgICAgfSk7XG4gICAgICBtZW51cyA9IGFsbE1lbnVzLmZpbHRlcihmdW5jdGlvbihtZW51KSB7XG4gICAgICAgIHZhciBwc2V0c01lbnU7XG4gICAgICAgIHBzZXRzTWVudSA9IG1lbnUucGVybWlzc2lvbl9zZXRzO1xuICAgICAgICBpZiAocHNldHNNZW51ICYmIHBzZXRzTWVudS5pbmRleE9mKFwidXNlclwiKSA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKGN1cnJlbnRQc2V0TmFtZXMsIHBzZXRzTWVudSkubGVuZ3RoO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbWVudXM7XG4gICAgfVxuICB9O1xuICBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0ID0gZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQpIHtcbiAgICBpZiAoXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIF8uZmluZChwZXJtaXNzaW9uX29iamVjdHMsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHJldHVybiBwby5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwZXJtaXNzaW9uX3NldF9pZFxuICAgIH0pO1xuICB9O1xuICBmaW5kX3Blcm1pc3Npb25fb2JqZWN0ID0gZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWRzKSB7XG4gICAgaWYgKF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBfLmZpbHRlcihwZXJtaXNzaW9uX29iamVjdHMsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHJldHVybiBwby5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiB7XG4gICAgICAgICRpbjogcGVybWlzc2lvbl9zZXRfaWRzXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgfTtcbiAgQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgaXNPcmdhbml6YXRpb25BZG1pbiwgaXNTcGFjZUFkbWluLCBpc1dvcmtmbG93QWRtaW4sIG9iamVjdCwgb3BzZXRBZG1pbiwgb3BzZXRHdWVzdCwgb3BzZXRNZW1iZXIsIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4sIG9wc2V0VXNlciwgb3BzZXRXb3JrZmxvd0FkbWluLCBwZXJtaXNzaW9ucywgcG9zLCBwb3NBZG1pbiwgcG9zR3Vlc3QsIHBvc01lbWJlciwgcG9zT3JnYW5pemF0aW9uQWRtaW4sIHBvc1VzZXIsIHBvc1dvcmtmbG93QWRtaW4sIHByb2YsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0FkbWluX3BvcywgcHNldHNDdXJyZW50X3BvcywgcHNldHNHdWVzdCwgcHNldHNHdWVzdF9wb3MsIHBzZXRzTWVtYmVyLCBwc2V0c01lbWJlcl9wb3MsIHBzZXRzT3JnYW5pemF0aW9uQWRtaW4sIHBzZXRzT3JnYW5pemF0aW9uQWRtaW5fcG9zLCBwc2V0c1VzZXIsIHBzZXRzVXNlcl9wb3MsIHBzZXRzV29ya2Zsb3dBZG1pbiwgcHNldHNXb3JrZmxvd0FkbWluX3BvcywgcmVmLCByZWYxLCBzZXRfaWRzLCBzcGFjZVVzZXI7XG4gICAgcGVybWlzc2lvbnMgPSB7fTtcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk7XG4gICAgaWYgKHNwYWNlSWQgPT09ICdndWVzdCcgfHwgb2JqZWN0X25hbWUgPT09IFwidXNlcnNcIikge1xuICAgICAgcGVybWlzc2lvbnMgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge307XG4gICAgICBDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyhwZXJtaXNzaW9ucyk7XG4gICAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gICAgfVxuICAgIHBzZXRzQWRtaW4gPSBfLmlzTnVsbCh0aGlzLnBzZXRzQWRtaW4pIHx8IHRoaXMucHNldHNBZG1pbiA/IHRoaXMucHNldHNBZG1pbiA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzVXNlciA9IF8uaXNOdWxsKHRoaXMucHNldHNVc2VyKSB8fCB0aGlzLnBzZXRzVXNlciA/IHRoaXMucHNldHNVc2VyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c01lbWJlciA9IF8uaXNOdWxsKHRoaXMucHNldHNNZW1iZXIpIHx8IHRoaXMucHNldHNNZW1iZXIgPyB0aGlzLnBzZXRzTWVtYmVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdtZW1iZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzR3Vlc3QgPSBfLmlzTnVsbCh0aGlzLnBzZXRzR3Vlc3QpIHx8IHRoaXMucHNldHNHdWVzdCA/IHRoaXMucHNldHNHdWVzdCA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnZ3Vlc3QnXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzV29ya2Zsb3dBZG1pbiA9IF8uaXNOdWxsKHRoaXMucHNldHNXb3JrZmxvd0FkbWluKSB8fCB0aGlzLnBzZXRzV29ya2Zsb3dBZG1pbiA/IHRoaXMucHNldHNXb3JrZmxvd0FkbWluIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd3b3JrZmxvd19hZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICB1c2VyczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzT3JnYW5pemF0aW9uQWRtaW4gPSBfLmlzTnVsbCh0aGlzLnBzZXRzT3JnYW5pemF0aW9uQWRtaW4pIHx8IHRoaXMucHNldHNPcmdhbml6YXRpb25BZG1pbiA/IHRoaXMucHNldHNPcmdhbml6YXRpb25BZG1pbiA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnb3JnYW5pemF0aW9uX2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIHVzZXJzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBpc1dvcmtmbG93QWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzV29ya2Zsb3dBZG1pbikgPyB0aGlzLmlzV29ya2Zsb3dBZG1pbiA6IHBzZXRzV29ya2Zsb3dBZG1pbiAhPSBudWxsID8gKHJlZiA9IHBzZXRzV29ya2Zsb3dBZG1pbi51c2VycykgIT0gbnVsbCA/IHJlZi5pbmNsdWRlcyh1c2VySWQpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIGlzT3JnYW5pemF0aW9uQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzT3JnYW5pemF0aW9uQWRtaW4pID8gdGhpcy5pc09yZ2FuaXphdGlvbkFkbWluIDogcHNldHNPcmdhbml6YXRpb25BZG1pbiAhPSBudWxsID8gKHJlZjEgPSBwc2V0c09yZ2FuaXphdGlvbkFkbWluLnVzZXJzKSAhPSBudWxsID8gcmVmMS5pbmNsdWRlcyh1c2VySWQpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIHBzZXRzQWRtaW5fcG9zID0gdGhpcy5wc2V0c0FkbWluX3BvcztcbiAgICBwc2V0c1VzZXJfcG9zID0gdGhpcy5wc2V0c1VzZXJfcG9zO1xuICAgIHBzZXRzTWVtYmVyX3BvcyA9IHRoaXMucHNldHNNZW1iZXJfcG9zO1xuICAgIHBzZXRzR3Vlc3RfcG9zID0gdGhpcy5wc2V0c0d1ZXN0X3BvcztcbiAgICBwc2V0c1dvcmtmbG93QWRtaW5fcG9zID0gdGhpcy5wc2V0c1dvcmtmbG93QWRtaW5fcG9zO1xuICAgIHBzZXRzT3JnYW5pemF0aW9uQWRtaW5fcG9zID0gdGhpcy5wc2V0c09yZ2FuaXphdGlvbkFkbWluX3BvcztcbiAgICBwc2V0c0N1cnJlbnRfcG9zID0gdGhpcy5wc2V0c0N1cnJlbnRfcG9zO1xuICAgIG9wc2V0QWRtaW4gPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5hZG1pbikgfHwge307XG4gICAgb3BzZXRVc2VyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQudXNlcikgfHwge307XG4gICAgb3BzZXRNZW1iZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5tZW1iZXIpIHx8IHt9O1xuICAgIG9wc2V0R3Vlc3QgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge307XG4gICAgb3BzZXRXb3JrZmxvd0FkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQud29ya2Zsb3dfYWRtaW4pIHx8IHt9O1xuICAgIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4gPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5vcmdhbml6YXRpb25fYWRtaW4pIHx8IHt9O1xuICAgIGlmIChwc2V0c0FkbWluKSB7XG4gICAgICBwb3NBZG1pbiA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNBZG1pbl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0FkbWluLl9pZCk7XG4gICAgICBpZiAocG9zQWRtaW4pIHtcbiAgICAgICAgb3BzZXRBZG1pbi5hbGxvd0NyZWF0ZSA9IHBvc0FkbWluLmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldEFkbWluLmFsbG93RGVsZXRlID0gcG9zQWRtaW4uYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0QWRtaW4uYWxsb3dFZGl0ID0gcG9zQWRtaW4uYWxsb3dFZGl0O1xuICAgICAgICBvcHNldEFkbWluLmFsbG93UmVhZCA9IHBvc0FkbWluLmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRBZG1pbi5tb2RpZnlBbGxSZWNvcmRzID0gcG9zQWRtaW4ubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRBZG1pbi52aWV3QWxsUmVjb3JkcyA9IHBvc0FkbWluLnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldEFkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zQWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0QWRtaW4udmlld0NvbXBhbnlSZWNvcmRzID0gcG9zQWRtaW4udmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEFkbWluLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldEFkbWluLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NBZG1pbi5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldEFkbWluLnVucmVhZGFibGVfZmllbGRzID0gcG9zQWRtaW4udW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0QWRtaW4udW5lZGl0YWJsZV9maWVsZHMgPSBwb3NBZG1pbi51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRBZG1pbi51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0FkbWluLnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNVc2VyKSB7XG4gICAgICBwb3NVc2VyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1VzZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNVc2VyLl9pZCk7XG4gICAgICBpZiAocG9zVXNlcikge1xuICAgICAgICBvcHNldFVzZXIuYWxsb3dDcmVhdGUgPSBwb3NVc2VyLmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldFVzZXIuYWxsb3dEZWxldGUgPSBwb3NVc2VyLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldFVzZXIuYWxsb3dFZGl0ID0gcG9zVXNlci5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0VXNlci5hbGxvd1JlYWQgPSBwb3NVc2VyLmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRVc2VyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NVc2VyLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0VXNlci52aWV3QWxsUmVjb3JkcyA9IHBvc1VzZXIudmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0VXNlci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0VXNlci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NVc2VyLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRVc2VyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NVc2VyLmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0VXNlci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zVXNlci5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldFVzZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NVc2VyLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldFVzZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NVc2VyLnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldFVzZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NVc2VyLnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNNZW1iZXIpIHtcbiAgICAgIHBvc01lbWJlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNNZW1iZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNNZW1iZXIuX2lkKTtcbiAgICAgIGlmIChwb3NNZW1iZXIpIHtcbiAgICAgICAgb3BzZXRNZW1iZXIuYWxsb3dDcmVhdGUgPSBwb3NNZW1iZXIuYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0TWVtYmVyLmFsbG93RGVsZXRlID0gcG9zTWVtYmVyLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldE1lbWJlci5hbGxvd0VkaXQgPSBwb3NNZW1iZXIuYWxsb3dFZGl0O1xuICAgICAgICBvcHNldE1lbWJlci5hbGxvd1JlYWQgPSBwb3NNZW1iZXIuYWxsb3dSZWFkO1xuICAgICAgICBvcHNldE1lbWJlci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zTWVtYmVyLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnZpZXdBbGxSZWNvcmRzID0gcG9zTWVtYmVyLnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldE1lbWJlci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc01lbWJlci5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRNZW1iZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zTWVtYmVyLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRNZW1iZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc01lbWJlci5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldE1lbWJlci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zTWVtYmVyLmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnVucmVhZGFibGVfZmllbGRzID0gcG9zTWVtYmVyLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldE1lbWJlci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc01lbWJlci51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRNZW1iZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NNZW1iZXIudW5yZWxhdGVkX29iamVjdHM7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0c0d1ZXN0KSB7XG4gICAgICBwb3NHdWVzdCA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNHdWVzdF9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0d1ZXN0Ll9pZCk7XG4gICAgICBpZiAocG9zR3Vlc3QpIHtcbiAgICAgICAgb3BzZXRHdWVzdC5hbGxvd0NyZWF0ZSA9IHBvc0d1ZXN0LmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldEd1ZXN0LmFsbG93RGVsZXRlID0gcG9zR3Vlc3QuYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0R3Vlc3QuYWxsb3dFZGl0ID0gcG9zR3Vlc3QuYWxsb3dFZGl0O1xuICAgICAgICBvcHNldEd1ZXN0LmFsbG93UmVhZCA9IHBvc0d1ZXN0LmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRHdWVzdC5tb2RpZnlBbGxSZWNvcmRzID0gcG9zR3Vlc3QubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRHdWVzdC52aWV3QWxsUmVjb3JkcyA9IHBvc0d1ZXN0LnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldEd1ZXN0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zR3Vlc3QubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0R3Vlc3Qudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zR3Vlc3Qudmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEd1ZXN0LmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NHdWVzdC5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldEd1ZXN0LmRpc2FibGVkX2FjdGlvbnMgPSBwb3NHdWVzdC5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldEd1ZXN0LnVucmVhZGFibGVfZmllbGRzID0gcG9zR3Vlc3QudW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0R3Vlc3QudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NHdWVzdC51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRHdWVzdC51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0d1ZXN0LnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNXb3JrZmxvd0FkbWluKSB7XG4gICAgICBwb3NXb3JrZmxvd0FkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1dvcmtmbG93QWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNXb3JrZmxvd0FkbWluLl9pZCk7XG4gICAgICBpZiAocG9zV29ya2Zsb3dBZG1pbikge1xuICAgICAgICBvcHNldFdvcmtmbG93QWRtaW4uYWxsb3dDcmVhdGUgPSBwb3NXb3JrZmxvd0FkbWluLmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldFdvcmtmbG93QWRtaW4uYWxsb3dEZWxldGUgPSBwb3NXb3JrZmxvd0FkbWluLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldFdvcmtmbG93QWRtaW4uYWxsb3dFZGl0ID0gcG9zV29ya2Zsb3dBZG1pbi5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0V29ya2Zsb3dBZG1pbi5hbGxvd1JlYWQgPSBwb3NXb3JrZmxvd0FkbWluLmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRXb3JrZmxvd0FkbWluLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NXb3JrZmxvd0FkbWluLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0V29ya2Zsb3dBZG1pbi52aWV3QWxsUmVjb3JkcyA9IHBvc1dvcmtmbG93QWRtaW4udmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0V29ya2Zsb3dBZG1pbi5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc1dvcmtmbG93QWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0V29ya2Zsb3dBZG1pbi52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NXb3JrZmxvd0FkbWluLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRXb3JrZmxvd0FkbWluLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NXb3JrZmxvd0FkbWluLmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0V29ya2Zsb3dBZG1pbi5kaXNhYmxlZF9hY3Rpb25zID0gcG9zV29ya2Zsb3dBZG1pbi5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldFdvcmtmbG93QWRtaW4udW5yZWFkYWJsZV9maWVsZHMgPSBwb3NXb3JrZmxvd0FkbWluLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldFdvcmtmbG93QWRtaW4udW5lZGl0YWJsZV9maWVsZHMgPSBwb3NXb3JrZmxvd0FkbWluLnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldFdvcmtmbG93QWRtaW4udW5yZWxhdGVkX29iamVjdHMgPSBwb3NXb3JrZmxvd0FkbWluLnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNPcmdhbml6YXRpb25BZG1pbikge1xuICAgICAgcG9zT3JnYW5pemF0aW9uQWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzT3JnYW5pemF0aW9uQWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNPcmdhbml6YXRpb25BZG1pbi5faWQpO1xuICAgICAgaWYgKHBvc09yZ2FuaXphdGlvbkFkbWluKSB7XG4gICAgICAgIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uYWxsb3dDcmVhdGUgPSBwb3NPcmdhbml6YXRpb25BZG1pbi5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRPcmdhbml6YXRpb25BZG1pbi5hbGxvd0RlbGV0ZSA9IHBvc09yZ2FuaXphdGlvbkFkbWluLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93RWRpdCA9IHBvc09yZ2FuaXphdGlvbkFkbWluLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRPcmdhbml6YXRpb25BZG1pbi5hbGxvd1JlYWQgPSBwb3NPcmdhbml6YXRpb25BZG1pbi5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4ubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc09yZ2FuaXphdGlvbkFkbWluLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4udmlld0FsbFJlY29yZHMgPSBwb3NPcmdhbml6YXRpb25BZG1pbi52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRPcmdhbml6YXRpb25BZG1pbi5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc09yZ2FuaXphdGlvbkFkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldE9yZ2FuaXphdGlvbkFkbWluLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc09yZ2FuaXphdGlvbkFkbWluLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRPcmdhbml6YXRpb25BZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zT3JnYW5pemF0aW9uQWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRPcmdhbml6YXRpb25BZG1pbi5kaXNhYmxlZF9hY3Rpb25zID0gcG9zT3JnYW5pemF0aW9uQWRtaW4uZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRPcmdhbml6YXRpb25BZG1pbi51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc09yZ2FuaXphdGlvbkFkbWluLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldE9yZ2FuaXphdGlvbkFkbWluLnVuZWRpdGFibGVfZmllbGRzID0gcG9zT3JnYW5pemF0aW9uQWRtaW4udW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4udW5yZWxhdGVkX29iamVjdHMgPSBwb3NPcmdhbml6YXRpb25BZG1pbi51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRBZG1pbjtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3BhY2VJZCA9PT0gJ2NvbW1vbicpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcGFjZVVzZXIgPSBfLmlzTnVsbCh0aGlzLnNwYWNlVXNlcikgfHwgdGhpcy5zcGFjZVVzZXIgPyB0aGlzLnNwYWNlVXNlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChzcGFjZVVzZXIpIHtcbiAgICAgICAgICAgIHByb2YgPSBzcGFjZVVzZXIucHJvZmlsZTtcbiAgICAgICAgICAgIGlmIChwcm9mKSB7XG4gICAgICAgICAgICAgIGlmIChwcm9mID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnbWVtYmVyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRNZW1iZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ2d1ZXN0Jykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHNldF9pZHMgPSBfLnBsdWNrKHBzZXRzLCBcIl9pZFwiKTtcbiAgICAgIHBvcyA9IGZpbmRfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXJyZW50X3Bvcywgb2JqZWN0X25hbWUsIHNldF9pZHMpO1xuICAgICAgXy5lYWNoKHBvcywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgaWYgKHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNBZG1pbiAhPSBudWxsID8gcHNldHNBZG1pbi5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNVc2VyICE9IG51bGwgPyBwc2V0c1VzZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzTWVtYmVyICE9IG51bGwgPyBwc2V0c01lbWJlci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNHdWVzdCAhPSBudWxsID8gcHNldHNHdWVzdC5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNXb3JrZmxvd0FkbWluICE9IG51bGwgPyBwc2V0c1dvcmtmbG93QWRtaW4uX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzT3JnYW5pemF0aW9uQWRtaW4gIT0gbnVsbCA/IHBzZXRzT3JnYW5pemF0aW9uQWRtaW4uX2lkIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8uYWxsb3dSZWFkKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8uYWxsb3dDcmVhdGUpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLmFsbG93RWRpdCkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLmFsbG93RGVsZXRlKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLnZpZXdBbGxSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8udmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIHBvLmRpc2FibGVkX2xpc3Rfdmlld3MpO1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMsIHBvLmRpc2FibGVkX2FjdGlvbnMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgcG8udW5yZWFkYWJsZV9maWVsZHMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgcG8udW5lZGl0YWJsZV9maWVsZHMpO1xuICAgICAgICByZXR1cm4gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMsIHBvLnVucmVsYXRlZF9vYmplY3RzKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGlzV29ya2Zsb3dBZG1pbikge1xuICAgICAgICBpZiAob3BzZXRXb3JrZmxvd0FkbWluLmFsbG93UmVhZCkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wc2V0V29ya2Zsb3dBZG1pbi5hbGxvd0NyZWF0ZSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3BzZXRXb3JrZmxvd0FkbWluLmFsbG93RWRpdCkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wc2V0V29ya2Zsb3dBZG1pbi5hbGxvd0RlbGV0ZSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3BzZXRXb3JrZmxvd0FkbWluLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3BzZXRXb3JrZmxvd0FkbWluLnZpZXdBbGxSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHNldFdvcmtmbG93QWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wc2V0V29ya2Zsb3dBZG1pbi52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSB1bmlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cywgb3BzZXRXb3JrZmxvd0FkbWluLmRpc2FibGVkX2xpc3Rfdmlld3MpO1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMsIG9wc2V0V29ya2Zsb3dBZG1pbi5kaXNhYmxlZF9hY3Rpb25zKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIG9wc2V0V29ya2Zsb3dBZG1pbi51bnJlYWRhYmxlX2ZpZWxkcyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBvcHNldFdvcmtmbG93QWRtaW4udW5lZGl0YWJsZV9maWVsZHMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cywgb3BzZXRXb3JrZmxvd0FkbWluLnVucmVsYXRlZF9vYmplY3RzKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc09yZ2FuaXphdGlvbkFkbWluKSB7XG4gICAgICAgIGlmIChvcHNldE9yZ2FuaXphdGlvbkFkbWluLmFsbG93UmVhZCkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uYWxsb3dDcmVhdGUpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uYWxsb3dFZGl0KSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3BzZXRPcmdhbml6YXRpb25BZG1pbi5hbGxvd0RlbGV0ZSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3BzZXRPcmdhbml6YXRpb25BZG1pbi5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wc2V0T3JnYW5pemF0aW9uQWRtaW4udmlld0FsbFJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wc2V0T3JnYW5pemF0aW9uQWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wc2V0T3JnYW5pemF0aW9uQWRtaW4udmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cyk7XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgb3BzZXRPcmdhbml6YXRpb25BZG1pbi5kaXNhYmxlZF9hY3Rpb25zKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgPSB1bmlvblBsdXMocGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIG9wc2V0T3JnYW5pemF0aW9uQWRtaW4udW5yZWFkYWJsZV9maWVsZHMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA9IHVuaW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgb3BzZXRPcmdhbml6YXRpb25BZG1pbi51bmVkaXRhYmxlX2ZpZWxkcyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzID0gdW5pb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBvcHNldE9yZ2FuaXphdGlvbkFkbWluLnVucmVsYXRlZF9vYmplY3RzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9iamVjdC5pc192aWV3KSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBbXTtcbiAgICB9XG4gICAgQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMocGVybWlzc2lvbnMpO1xuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfTtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIFwiY3JlYXRvci5vYmplY3RfcGVybWlzc2lvbnNcIjogZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdGhpcy51c2VySWQpO1xuICAgIH1cbiAgfSk7XG59XG4iLCJNZXRlb3Iuc3RhcnR1cCAoKS0+XHJcblx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRjcmVhdG9yX2RiX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSTF9DUkVBVE9SXHJcblx0XHRvcGxvZ191cmwgPSBwcm9jZXNzLmVudi5NT05HT19PUExPR19VUkxfQ1JFQVRPUlxyXG5cdFx0aWYgY3JlYXRvcl9kYl91cmxcclxuXHRcdFx0aWYgIW9wbG9nX3VybFxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIlBsZWFzZSBjb25maWd1cmUgZW52aXJvbm1lbnQgdmFyaWFibGVzOiBNT05HT19PUExPR19VUkxfQ1JFQVRPUlwiKVxyXG5cdFx0XHRDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UgPSB7X2RyaXZlcjogbmV3IE1vbmdvSW50ZXJuYWxzLlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoY3JlYXRvcl9kYl91cmwsIHtvcGxvZ1VybDogb3Bsb2dfdXJsfSl9XHJcblxyXG5DcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24gPSAob2JqZWN0KS0+XHJcblx0Y29sbGVjdGlvbl9rZXkgPSBvYmplY3QubmFtZVxyXG5cdGlmIG9iamVjdC5zcGFjZSAjb2JqZWN0LmN1c3RvbSAmJlxyXG5cdFx0Y29sbGVjdGlvbl9rZXkgPSBcImNfXCIgKyBvYmplY3Quc3BhY2UgKyBcIl9cIiArIG9iamVjdC5uYW1lXHJcblxyXG5cdGlmIGRiW2NvbGxlY3Rpb25fa2V5XVxyXG5cdFx0cmV0dXJuIGRiW2NvbGxlY3Rpb25fa2V5XVxyXG5cdGVsc2UgaWYgb2JqZWN0LmRiXHJcblx0XHRyZXR1cm4gb2JqZWN0LmRiXHJcblxyXG5cdGlmIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV1cclxuXHRlbHNlXHJcblx0XHRpZiBvYmplY3QuY3VzdG9tXHJcblx0XHRcdHJldHVybiBuZXcgTWV0ZW9yLkNvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXksIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSlcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIG5ldyBNZXRlb3IuQ29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSlcclxuXHJcblxyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIGNyZWF0b3JfZGJfdXJsLCBvcGxvZ191cmw7XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBjcmVhdG9yX2RiX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSTF9DUkVBVE9SO1xuICAgIG9wbG9nX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SO1xuICAgIGlmIChjcmVhdG9yX2RiX3VybCkge1xuICAgICAgaWYgKCFvcGxvZ191cmwpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiUGxlYXNlIGNvbmZpZ3VyZSBlbnZpcm9ubWVudCB2YXJpYWJsZXM6IE1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSA9IHtcbiAgICAgICAgX2RyaXZlcjogbmV3IE1vbmdvSW50ZXJuYWxzLlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoY3JlYXRvcl9kYl91cmwsIHtcbiAgICAgICAgICBvcGxvZ1VybDogb3Bsb2dfdXJsXG4gICAgICAgIH0pXG4gICAgICB9O1xuICAgIH1cbiAgfVxufSk7XG5cbkNyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgY29sbGVjdGlvbl9rZXk7XG4gIGNvbGxlY3Rpb25fa2V5ID0gb2JqZWN0Lm5hbWU7XG4gIGlmIChvYmplY3Quc3BhY2UpIHtcbiAgICBjb2xsZWN0aW9uX2tleSA9IFwiY19cIiArIG9iamVjdC5zcGFjZSArIFwiX1wiICsgb2JqZWN0Lm5hbWU7XG4gIH1cbiAgaWYgKGRiW2NvbGxlY3Rpb25fa2V5XSkge1xuICAgIHJldHVybiBkYltjb2xsZWN0aW9uX2tleV07XG4gIH0gZWxzZSBpZiAob2JqZWN0LmRiKSB7XG4gICAgcmV0dXJuIG9iamVjdC5kYjtcbiAgfVxuICBpZiAoQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV0pIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV07XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iamVjdC5jdXN0b20pIHtcbiAgICAgIHJldHVybiBuZXcgTWV0ZW9yLkNvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXksIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgTWV0ZW9yLkNvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXkpO1xuICAgIH1cbiAgfVxufTtcbiIsIkNyZWF0b3IuYWN0aW9uc0J5TmFtZSA9IHt9XHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHJcblx0IyDlrprkuYnlhajlsYAgYWN0aW9ucyDlh73mlbBcdFxyXG5cdENyZWF0b3IuYWN0aW9ucyA9IChhY3Rpb25zKS0+XHJcblx0XHRfLmVhY2ggYWN0aW9ucywgKHRvZG8sIGFjdGlvbl9uYW1lKS0+XHJcblx0XHRcdENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb25fbmFtZV0gPSB0b2RvIFxyXG5cclxuXHRDcmVhdG9yLmV4ZWN1dGVBY3Rpb24gPSAob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkKS0+XHJcblx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRcdGlmIGFjdGlvbj8udG9kb1xyXG5cdFx0XHRpZiB0eXBlb2YgYWN0aW9uLnRvZG8gPT0gXCJzdHJpbmdcIlxyXG5cdFx0XHRcdHRvZG8gPSBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uLnRvZG9dXHJcblx0XHRcdGVsc2UgaWYgdHlwZW9mIGFjdGlvbi50b2RvID09IFwiZnVuY3Rpb25cIlxyXG5cdFx0XHRcdHRvZG8gPSBhY3Rpb24udG9kb1x0XHJcblx0XHRcdGlmICFyZWNvcmQgJiYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkXHJcblx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcclxuXHRcdFx0aWYgdG9kb1xyXG5cdFx0XHRcdCMgaXRlbV9lbGVtZW505Li656m65pe25bqU6K+l6K6+572u6buY6K6k5YC877yI5a+56LGh55qEbmFtZeWtl+aute+8ie+8jOWQpuWImW1vcmVBcmdz5ou/5Yiw55qE5ZCO57ut5Y+C5pWw5L2N572u5bCx5LiN5a+5XHJcblx0XHRcdFx0aXRlbV9lbGVtZW50ID0gaWYgaXRlbV9lbGVtZW50IHRoZW4gaXRlbV9lbGVtZW50IGVsc2UgXCJcIlxyXG5cdFx0XHRcdG1vcmVBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKVxyXG5cdFx0XHRcdHRvZG9BcmdzID0gW29iamVjdF9uYW1lLCByZWNvcmRfaWRdLmNvbmNhdChtb3JlQXJncylcclxuXHRcdFx0XHR0b2RvLmFwcGx5IHtcclxuXHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxyXG5cdFx0XHRcdFx0cmVjb3JkX2lkOiByZWNvcmRfaWRcclxuXHRcdFx0XHRcdG9iamVjdDogb2JqXHJcblx0XHRcdFx0XHRhY3Rpb246IGFjdGlvblxyXG5cdFx0XHRcdFx0aXRlbV9lbGVtZW50OiBpdGVtX2VsZW1lbnRcclxuXHRcdFx0XHRcdHJlY29yZDogcmVjb3JkXHJcblx0XHRcdFx0fSwgdG9kb0FyZ3NcclxuXHRcdFx0XHRcclxuXHJcblx0Q3JlYXRvci5hY3Rpb25zIFxyXG5cdFx0IyDlnKjmraTlrprkuYnlhajlsYAgYWN0aW9uc1xyXG5cdFx0XCJzdGFuZGFyZF9xdWVyeVwiOiAoKS0+XHJcblx0XHRcdE1vZGFsLnNob3coXCJzdGFuZGFyZF9xdWVyeV9tb2RhbFwiKVxyXG5cclxuXHRcdFwic3RhbmRhcmRfbmV3XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cclxuXHRcdFx0aWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbb2JqZWN0X25hbWVdXHJcblx0XHRcdGlmIGlkcz8ubGVuZ3RoXHJcblx0XHRcdFx0IyDliJfooajmnInpgInkuK3pobnml7bvvIzlj5bnrKzkuIDkuKrpgInkuK3pobnvvIzlpI3liLblhbblhoXlrrnliLDmlrDlu7rnqpflj6PkuK1cclxuXHRcdFx0XHQjIOi/meeahOesrOS4gOS4quaMh+eahOaYr+esrOS4gOasoeWLvumAieeahOmAieS4remhue+8jOiAjOS4jeaYr+WIl+ihqOS4reW3suWLvumAieeahOesrOS4gOmhuVxyXG5cdFx0XHRcdHJlY29yZF9pZCA9IGlkc1swXVxyXG5cdFx0XHRcdGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXHJcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgZG9jXHJcblx0XHRcdFx0IyDigJzkv53lrZjlubbmlrDlu7rigJ3mk43kvZzkuK3oh6rliqjmiZPlvIDnmoTmlrDnqpflj6PkuK3pnIDopoHlho3mrKHlpI3liLbmnIDmlrDnmoRkb2PlhoXlrrnliLDmlrDnqpflj6PkuK1cclxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZVxyXG5cdFx0XHRNZXRlb3IuZGVmZXIgKCktPlxyXG5cdFx0XHRcdCQoXCIuY3JlYXRvci1hZGRcIikuY2xpY2soKVxyXG5cdFx0XHRyZXR1cm4gXHJcblx0XHRcdFxyXG5cdFx0XCJzdGFuZGFyZF9vcGVuX3ZpZXdcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxyXG5cdFx0XHRocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZClcclxuXHRcdFx0d2luZG93Lm9wZW4oXHJcblx0XHRcdFx0aHJlZixcclxuXHRcdFx0XHQnX2JsYW5rJyxcclxuXHRcdFx0XHQnd2lkdGg9ODAwLCBoZWlnaHQ9NjAwLCBsZWZ0PTUwLCB0b3A9IDUwLCB0b29sYmFyPW5vLCBzdGF0dXM9bm8sIG1lbnViYXI9bm8sIHJlc2l6YWJsZT15ZXMsIHNjcm9sbGJhcnM9eWVzJ1xyXG5cdFx0XHQpXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHRcdFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cclxuXHRcdFx0aHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXHJcblx0XHRcdHdpbmRvdy5vcGVuKFxyXG5cdFx0XHRcdGhyZWYsXHJcblx0XHRcdFx0J19ibGFuaycsXHJcblx0XHRcdFx0J3dpZHRoPTgwMCwgaGVpZ2h0PTYwMCwgbGVmdD01MCwgdG9wPSA1MCwgdG9vbGJhcj1ubywgc3RhdHVzPW5vLCBtZW51YmFyPW5vLCByZXNpemFibGU9eWVzLCBzY3JvbGxiYXJzPXllcydcclxuXHRcdFx0KVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0XHRcInN0YW5kYXJkX2VkaXRcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxyXG5cdFx0XHRpZiByZWNvcmRfaWRcclxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgJiYgZmFsc2VcclxuI1x0XHRcdFx0XHRyZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxyXG4jXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIHJlY29yZFxyXG4jXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdyZWxvYWRfZHhsaXN0JywgZmFsc2VcclxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZVxyXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWRcclxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXHJcblx0XHRcdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIHRoaXMucmVjb3JkXHJcblx0XHRcdFx0XHRNZXRlb3IuZGVmZXIgKCktPlxyXG5cdFx0XHRcdFx0XHQkKFwiLmJ0bi1lZGl0LXJlY29yZFwiKS5jbGljaygpXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lXHJcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZFxyXG5cdFx0XHRcdFx0aWYgdGhpcy5yZWNvcmRcclxuXHRcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgdGhpcy5yZWNvcmRcclxuXHRcdFx0XHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cclxuXHRcdFx0XHRcdFx0XHQkKFwiLmJ0bi5jcmVhdG9yLWVkaXRcIikuY2xpY2soKVxyXG5cclxuXHRcdFwic3RhbmRhcmRfZGVsZXRlXCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgY2FsbF9iYWNrKS0+XHJcblx0XHRcdGNvbnNvbGUubG9nKFwic3RhbmRhcmRfZGVsZXRlXCIsIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkKVxyXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHJcblx0XHRcdGlmKCFfLmlzU3RyaW5nKHJlY29yZF90aXRsZSkgJiYgcmVjb3JkX3RpdGxlPy5uYW1lKVxyXG5cdFx0XHRcdHJlY29yZF90aXRsZSA9IHJlY29yZF90aXRsZT8ubmFtZVxyXG5cclxuXHRcdFx0aWYgcmVjb3JkX3RpdGxlXHJcblx0XHRcdFx0dGV4dCA9IFwi5piv5ZCm56Gu5a6a6KaB5Yig6Zmk5q2kI3tvYmplY3QubGFiZWx9XFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIlxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGV4dCA9IFwi5piv5ZCm56Gu5a6a6KaB5Yig6Zmk5q2kI3tvYmplY3QubGFiZWx9XCJcclxuXHRcdFx0c3dhbFxyXG5cdFx0XHRcdHRpdGxlOiBcIuWIoOmZpCN7b2JqZWN0LmxhYmVsfVwiXHJcblx0XHRcdFx0dGV4dDogXCI8ZGl2IGNsYXNzPSdkZWxldGUtY3JlYXRvci13YXJuaW5nJz4je3RleHR977yfPC9kaXY+XCJcclxuXHRcdFx0XHRodG1sOiB0cnVlXHJcblx0XHRcdFx0c2hvd0NhbmNlbEJ1dHRvbjp0cnVlXHJcblx0XHRcdFx0Y29uZmlybUJ1dHRvblRleHQ6IHQoJ0RlbGV0ZScpXHJcblx0XHRcdFx0Y2FuY2VsQnV0dG9uVGV4dDogdCgnQ2FuY2VsJylcclxuXHRcdFx0XHQob3B0aW9uKSAtPlxyXG5cdFx0XHRcdFx0aWYgb3B0aW9uXHJcblx0XHRcdFx0XHRcdENyZWF0b3Iub2RhdGEuZGVsZXRlIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsICgpLT5cclxuXHRcdFx0XHRcdFx0XHRpZiByZWNvcmRfdGl0bGVcclxuXHRcdFx0XHRcdFx0XHRcdGluZm8gPSBvYmplY3QubGFiZWwgKyBcIlxcXCIje3JlY29yZF90aXRsZX1cXFwiXCIgKyBcIuW3suWIoOmZpFwiXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0aW5mbyA9IFwi5Yig6Zmk5oiQ5YqfXCJcclxuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyBpbmZvXHJcblx0XHRcdFx0XHRcdFx0IyDmlofku7bniYjmnKzkuLpcImNmcy5maWxlcy5maWxlcmVjb3JkXCLvvIzpnIDopoHmm7/mjaLkuLpcImNmcy1maWxlcy1maWxlcmVjb3JkXCJcclxuXHRcdFx0XHRcdFx0XHRncmlkT2JqZWN0TmFtZUNsYXNzID0gb2JqZWN0X25hbWUucmVwbGFjZSgvXFwuL2csXCItXCIpXHJcblx0XHRcdFx0XHRcdFx0Z3JpZENvbnRhaW5lciA9ICQoXCIuZ3JpZENvbnRhaW5lci4je2dyaWRPYmplY3ROYW1lQ2xhc3N9XCIpXHJcblx0XHRcdFx0XHRcdFx0dW5sZXNzIGdyaWRDb250YWluZXI/Lmxlbmd0aFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgd2luZG93Lm9wZW5lclxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpc09wZW5lclJlbW92ZSA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z3JpZENvbnRhaW5lciA9IHdpbmRvdy5vcGVuZXIuJChcIi5ncmlkQ29udGFpbmVyLiN7Z3JpZE9iamVjdE5hbWVDbGFzc31cIilcclxuXHRcdFx0XHRcdFx0XHRpZiBncmlkQ29udGFpbmVyPy5sZW5ndGhcclxuXHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfdHJlZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4VHJlZUxpc3QoKS5keFRyZWVMaXN0KCdpbnN0YW5jZScpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhEYXRhR3JpZCgpLmR4RGF0YUdyaWQoJ2luc3RhbmNlJylcclxuXHRcdFx0XHRcdFx0XHRpZiBkeERhdGFHcmlkSW5zdGFuY2VcclxuXHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfdHJlZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UucmVmcmVzaCgpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFRlbXBsYXRlLmNyZWF0b3JfZ3JpZC5yZWZyZXNoKGR4RGF0YUdyaWRJbnN0YW5jZSlcclxuXHRcdFx0XHRcdFx0XHRpZiBpc09wZW5lclJlbW92ZSBvciAhZHhEYXRhR3JpZEluc3RhbmNlXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBpc09wZW5lclJlbW92ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cuY2xvc2UoKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiByZWNvcmRfaWQgPT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikgYW5kICFTdGVlZG9zLmlzTW9iaWxlKCkgYW5kIGxpc3Rfdmlld19pZCAhPSAnY2FsZW5kYXInXHJcblx0XHRcdFx0XHRcdFx0XHRcdGFwcGlkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcclxuXHRcdFx0XHRcdFx0XHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXHJcblx0XHRcdFx0XHRcdFx0XHRcdHVubGVzcyBsaXN0X3ZpZXdfaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsaXN0X3ZpZXdfaWQgPSBcImFsbFwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIuZ28gXCIvYXBwLyN7YXBwaWR9LyN7b2JqZWN0X25hbWV9L2dyaWQvI3tsaXN0X3ZpZXdfaWR9XCJcclxuXHRcdFx0XHRcdFx0XHRpZiBjYWxsX2JhY2sgYW5kIHR5cGVvZiBjYWxsX2JhY2sgPT0gXCJmdW5jdGlvblwiXHJcblx0XHRcdFx0XHRcdFx0XHRjYWxsX2JhY2soKVxyXG4iLCJDcmVhdG9yLmFjdGlvbnNCeU5hbWUgPSB7fTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBDcmVhdG9yLmFjdGlvbnMgPSBmdW5jdGlvbihhY3Rpb25zKSB7XG4gICAgcmV0dXJuIF8uZWFjaChhY3Rpb25zLCBmdW5jdGlvbih0b2RvLCBhY3Rpb25fbmFtZSkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb25fbmFtZV0gPSB0b2RvO1xuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLmV4ZWN1dGVBY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYWN0aW9uLCByZWNvcmRfaWQsIGl0ZW1fZWxlbWVudCwgbGlzdF92aWV3X2lkLCByZWNvcmQpIHtcbiAgICB2YXIgbW9yZUFyZ3MsIG9iaiwgdG9kbywgdG9kb0FyZ3M7XG4gICAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmIChhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwKSB7XG4gICAgICBpZiAodHlwZW9mIGFjdGlvbi50b2RvID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRvZG8gPSBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uLnRvZG9dO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYWN0aW9uLnRvZG8gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0b2RvID0gYWN0aW9uLnRvZG87XG4gICAgICB9XG4gICAgICBpZiAoIXJlY29yZCAmJiBvYmplY3RfbmFtZSAmJiByZWNvcmRfaWQpIHtcbiAgICAgICAgcmVjb3JkID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICB9XG4gICAgICBpZiAodG9kbykge1xuICAgICAgICBpdGVtX2VsZW1lbnQgPSBpdGVtX2VsZW1lbnQgPyBpdGVtX2VsZW1lbnQgOiBcIlwiO1xuICAgICAgICBtb3JlQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMyk7XG4gICAgICAgIHRvZG9BcmdzID0gW29iamVjdF9uYW1lLCByZWNvcmRfaWRdLmNvbmNhdChtb3JlQXJncyk7XG4gICAgICAgIHJldHVybiB0b2RvLmFwcGx5KHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgICAgcmVjb3JkX2lkOiByZWNvcmRfaWQsXG4gICAgICAgICAgb2JqZWN0OiBvYmosXG4gICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgICAgaXRlbV9lbGVtZW50OiBpdGVtX2VsZW1lbnQsXG4gICAgICAgICAgcmVjb3JkOiByZWNvcmRcbiAgICAgICAgfSwgdG9kb0FyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgQ3JlYXRvci5hY3Rpb25zKHtcbiAgICBcInN0YW5kYXJkX3F1ZXJ5XCI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIE1vZGFsLnNob3coXCJzdGFuZGFyZF9xdWVyeV9tb2RhbFwiKTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfbmV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGRvYywgaWRzO1xuICAgICAgaWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbb2JqZWN0X25hbWVdO1xuICAgICAgaWYgKGlkcyAhPSBudWxsID8gaWRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICByZWNvcmRfaWQgPSBpZHNbMF07XG4gICAgICAgIGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBkb2MpO1xuICAgICAgICBTZXNzaW9uLnNldCgnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGhyZWY7XG4gICAgICBocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICB3aW5kb3cub3BlbihocmVmLCAnX2JsYW5rJywgJ3dpZHRoPTgwMCwgaGVpZ2h0PTYwMCwgbGVmdD01MCwgdG9wPSA1MCwgdG9vbGJhcj1ubywgc3RhdHVzPW5vLCBtZW51YmFyPW5vLCByZXNpemFibGU9eWVzLCBzY3JvbGxiYXJzPXllcycpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9vcGVuX3ZpZXdcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgaHJlZjtcbiAgICAgIGhyZWYgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgIHdpbmRvdy5vcGVuKGhyZWYsICdfYmxhbmsnLCAnd2lkdGg9ODAwLCBoZWlnaHQ9NjAwLCBsZWZ0PTUwLCB0b3A9IDUwLCB0b29sYmFyPW5vLCBzdGF0dXM9bm8sIG1lbnViYXI9bm8sIHJlc2l6YWJsZT15ZXMsIHNjcm9sbGJhcnM9eWVzJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX2VkaXRcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgJiYgZmFsc2UpIHtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIHRoaXMucmVjb3JkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiLmJ0bi1lZGl0LXJlY29yZFwiKS5jbGljaygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSk7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWQpO1xuICAgICAgICAgIGlmICh0aGlzLnJlY29yZCkge1xuICAgICAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgdGhpcy5yZWNvcmQpO1xuICAgICAgICAgICAgcmV0dXJuIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICQoXCIuYnRuLmNyZWF0b3ItZWRpdFwiKS5jbGljaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX2RlbGV0ZVwiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgY2FsbF9iYWNrKSB7XG4gICAgICB2YXIgb2JqZWN0LCB0ZXh0O1xuICAgICAgY29uc29sZS5sb2coXCJzdGFuZGFyZF9kZWxldGVcIiwgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQpO1xuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgICAgaWYgKCFfLmlzU3RyaW5nKHJlY29yZF90aXRsZSkgJiYgKHJlY29yZF90aXRsZSAhPSBudWxsID8gcmVjb3JkX3RpdGxlLm5hbWUgOiB2b2lkIDApKSB7XG4gICAgICAgIHJlY29yZF90aXRsZSA9IHJlY29yZF90aXRsZSAhPSBudWxsID8gcmVjb3JkX3RpdGxlLm5hbWUgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgICBpZiAocmVjb3JkX3RpdGxlKSB7XG4gICAgICAgIHRleHQgPSBcIuaYr+WQpuehruWumuimgeWIoOmZpOatpFwiICsgb2JqZWN0LmxhYmVsICsgXCJcXFwiXCIgKyByZWNvcmRfdGl0bGUgKyBcIlxcXCJcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHQgPSBcIuaYr+WQpuehruWumuimgeWIoOmZpOatpFwiICsgb2JqZWN0LmxhYmVsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN3YWwoe1xuICAgICAgICB0aXRsZTogXCLliKDpmaRcIiArIG9iamVjdC5sYWJlbCxcbiAgICAgICAgdGV4dDogXCI8ZGl2IGNsYXNzPSdkZWxldGUtY3JlYXRvci13YXJuaW5nJz5cIiArIHRleHQgKyBcIu+8nzwvZGl2PlwiLFxuICAgICAgICBodG1sOiB0cnVlLFxuICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxuICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogdCgnRGVsZXRlJyksXG4gICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IHQoJ0NhbmNlbCcpXG4gICAgICB9LCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgaWYgKG9wdGlvbikge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLm9kYXRhW1wiZGVsZXRlXCJdKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGFwcGlkLCBkeERhdGFHcmlkSW5zdGFuY2UsIGdyaWRDb250YWluZXIsIGdyaWRPYmplY3ROYW1lQ2xhc3MsIGluZm8sIGlzT3BlbmVyUmVtb3ZlO1xuICAgICAgICAgICAgaWYgKHJlY29yZF90aXRsZSkge1xuICAgICAgICAgICAgICBpbmZvID0gb2JqZWN0LmxhYmVsICsgKFwiXFxcIlwiICsgcmVjb3JkX3RpdGxlICsgXCJcXFwiXCIpICsgXCLlt7LliKDpmaRcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGluZm8gPSBcIuWIoOmZpOaIkOWKn1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoaW5mbyk7XG4gICAgICAgICAgICBncmlkT2JqZWN0TmFtZUNsYXNzID0gb2JqZWN0X25hbWUucmVwbGFjZSgvXFwuL2csIFwiLVwiKTtcbiAgICAgICAgICAgIGdyaWRDb250YWluZXIgPSAkKFwiLmdyaWRDb250YWluZXIuXCIgKyBncmlkT2JqZWN0TmFtZUNsYXNzKTtcbiAgICAgICAgICAgIGlmICghKGdyaWRDb250YWluZXIgIT0gbnVsbCA/IGdyaWRDb250YWluZXIubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICBpZiAod2luZG93Lm9wZW5lcikge1xuICAgICAgICAgICAgICAgIGlzT3BlbmVyUmVtb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBncmlkQ29udGFpbmVyID0gd2luZG93Lm9wZW5lci4kKFwiLmdyaWRDb250YWluZXIuXCIgKyBncmlkT2JqZWN0TmFtZUNsYXNzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdyaWRDb250YWluZXIgIT0gbnVsbCA/IGdyaWRDb250YWluZXIubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgICAgICAgIGlmIChvYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4VHJlZUxpc3QoKS5keFRyZWVMaXN0KCdpbnN0YW5jZScpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhEYXRhR3JpZCgpLmR4RGF0YUdyaWQoJ2luc3RhbmNlJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkeERhdGFHcmlkSW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgaWYgKG9iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICAgIGR4RGF0YUdyaWRJbnN0YW5jZS5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgVGVtcGxhdGUuY3JlYXRvcl9ncmlkLnJlZnJlc2goZHhEYXRhR3JpZEluc3RhbmNlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzT3BlbmVyUmVtb3ZlIHx8ICFkeERhdGFHcmlkSW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgaWYgKGlzT3BlbmVyUmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVjb3JkX2lkID09PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmIGxpc3Rfdmlld19pZCAhPT0gJ2NhbGVuZGFyJykge1xuICAgICAgICAgICAgICAgIGFwcGlkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gICAgICAgICAgICAgICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgICAgICAgICAgICAgIGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgICAgICAgICAgICAgbGlzdF92aWV3X2lkID0gXCJhbGxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgRmxvd1JvdXRlci5nbyhcIi9hcHAvXCIgKyBhcHBpZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhbGxfYmFjayAmJiB0eXBlb2YgY2FsbF9iYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNhbGxfYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIl19
