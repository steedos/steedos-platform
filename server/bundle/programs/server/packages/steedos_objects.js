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

var require = meteorInstall({"node_modules":{"meteor":{"steedos:objects":{"core.coffee":function(){

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
Creator.Dashboards = {};
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
var e, objectql, steedosCore;

try {
  if (Meteor.isDevelopment) {
    steedosCore = require('@steedos/core');
    objectql = require('@steedos/objectql');
    Meteor.startup(function () {
      var ex;

      try {
        return objectql.wrapAsync(steedosCore.init);
      } catch (error) {
        ex = error;
        return console.error("error:", ex);
      }
    });
  }
} catch (error) {
  e = error;
  console.error("error:", e);
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
    object_name = Creator.getCollectionName(obj);
  }

  if (object_name === 'cfs_files_filerecord') {
    object_name = 'cfs.files.filerecord';
    obj = _.clone(obj);
    obj.name = object_name;
    Creator.Objects[object_name] = obj;
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
  var ref, ref1;

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

  if (object_name) {
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

  space = (ref = Creator.getObject("spaces")) != null ? (ref1 = ref.db) != null ? ref1.findOne(spaceId, {
    fields: {
      admins: 1
    }
  }) : void 0 : void 0;

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
  var _object, permissions, relatedList, relatedListMap, related_objects;

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

  relatedList = _object.relatedList;

  if (Meteor.isClient && !_.isEmpty(relatedList)) {
    relatedListMap = {};

    _.each(relatedList, function (objName) {
      if (_.isObject(objName)) {
        return relatedListMap[objName.objectName] = {};
      } else {
        return relatedListMap[objName] = {};
      }
    });

    _.each(Creator.Objects, function (related_object, related_object_name) {
      return _.each(related_object.fields, function (related_field, related_field_name) {
        if ((related_field.type === "master_detail" || related_field.type === "lookup") && related_field.reference_to && related_field.reference_to === object_name && relatedListMap[related_object_name]) {
          return relatedListMap[related_object_name] = {
            object_name: related_object_name,
            foreign_key: related_field_name,
            sharing: related_field.sharing
          };
        }
      });
    });

    if (relatedListMap['cms_files']) {
      relatedListMap['cms_files'] = {
        object_name: "cms_files",
        foreign_key: "parent"
      };
    }

    if (relatedListMap['instances']) {
      relatedListMap['instances'] = {
        object_name: "instances",
        foreign_key: "record_ids"
      };
    }

    _.each(['tasks', 'notes', 'events', 'approvals'], function (enableObjName) {
      if (relatedListMap[enableObjName]) {
        return relatedListMap[enableObjName] = {
          object_name: enableObjName,
          foreign_key: "related_to"
        };
      }
    });

    if (relatedListMap['audit_records']) {
      permissions = Creator.getPermissions(object_name);

      if (_object.enable_audit && (permissions != null ? permissions.modifyAllRecords : void 0)) {
        relatedListMap['audit_records'] = {
          object_name: "audit_records",
          foreign_key: "related_to"
        };
      }
    }

    related_objects = _.values(relatedListMap);
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
      if ((related_field.type === "master_detail" || related_field.type === "lookup" && related_field.relatedList) && related_field.reference_to && related_field.reference_to === object_name) {
        if (related_object_name === "object_fields") {
          return related_objects.splice(0, 0, {
            object_name: related_object_name,
            foreign_key: related_field_name
          });
        } else {
          return related_objects.push({
            object_name: related_object_name,
            foreign_key: related_field_name,
            sharing: related_field.sharing
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

  if (_object.enable_process) {
    related_objects.push({
      object_name: "process_instance_history",
      foreign_key: "target_object"
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
  if (_.isFunction(Steedos.isCordova) && Steedos.isCordova() && ((url != null ? url.startsWith("/assets") : void 0) || (url != null ? url.startsWith("assets") : void 0) || (url != null ? url.startsWith("/packages") : void 0))) {
    if (!/^\//.test(url)) {
      url = "/" + url;
    }

    return url;
  }

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

Creator.getTemplateSpaceId = function () {
  var ref;
  return (ref = Meteor.settings["public"]) != null ? ref.templateSpaceId : void 0;
};

Creator.getCloudAdminSpaceId = function () {
  var ref;
  return (ref = Meteor.settings["public"]) != null ? ref.cloudAdminSpaceId : void 0;
};

Creator.isTemplateSpace = function (spaceId) {
  var ref;

  if (spaceId && ((ref = Meteor.settings["public"]) != null ? ref.templateSpaceId : void 0) === spaceId) {
    return true;
  }

  return false;
};

Creator.isCloudAdminSpace = function (spaceId) {
  var ref;

  if (spaceId && ((ref = Meteor.settings["public"]) != null ? ref.cloudAdminSpaceId : void 0) === spaceId) {
    return true;
  }

  return false;
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
var _templateObject = _taggedTemplateLiteralLoose(["workflow/space/", "/print/", "?box=monitor&print_is_show_traces=1&print_is_show_attachments=1&X-User-Id=", "&X-Auth-Token=", ""], ["workflow/space/", "/print/", "?box=monitor&print_is_show_traces=1&print_is_show_attachments=1&X-User-Id=", "&X-Auth-Token=", ""]);

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

JsonRoutes.add('post', '/api/workflow/view/:instanceId', function (req, res, next) {
  var box, collection, current_user_id, current_user_info, e, flowId, hashData, ins, insId, object_name, permissions, record_id, redirect_url, ref, ref1, ref2, ref3, ref4, space, spaceId, space_id, workflowUrl, x_auth_token, x_user_id;

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

      workflowUrl = (ref3 = Meteor.settings["public"].webservices) != null ? (ref4 = ref3.workflow) != null ? ref4.url : void 0 : void 0;

      if (box) {
        redirect_url = (workflowUrl || '') + ("workflow/space/" + spaceId + "/" + box + "/" + insId + "?X-User-Id=" + x_user_id + "&X-Auth-Token=" + x_auth_token);
      } else {
        redirect_url = (workflowUrl || '')(_templateObject, spaceId, insId, x_user_id, x_auth_token);
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
          $unset: {
            "instances": 1,
            "instance_state": 1
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

Creator.convertListView = function (default_view, list_view, list_view_name) {
  var default_columns, default_mobile_columns, oitem;
  default_columns = default_view != null ? default_view.columns : void 0;
  default_mobile_columns = default_view != null ? default_view.mobile_columns : void 0;

  if (!list_view) {
    return;
  }

  oitem = _.clone(list_view);

  if (!_.has(oitem, "name")) {
    oitem.name = list_view_name;
  }

  if (!oitem.columns) {
    if (default_columns) {
      oitem.columns = default_columns;
    }
  }

  if (!oitem.columns) {
    oitem.columns = ["name"];
  }

  if (!oitem.mobile_columns) {
    if (default_mobile_columns) {
      oitem.mobile_columns = default_mobile_columns;
    }
  }

  if (Meteor.isClient) {
    if (Creator.isCloudAdminSpace(Session.get("spaceId")) && !_.include(oitem.columns, 'space')) {
      oitem.columns.push('space');
    }
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
    var _object, list, mapList, permissions, relatedList, relatedListNames, relatedListObjects, related_object_names, related_objects, spaceId, unrelated_objects, userId;

    if (!object_name) {
      return;
    }

    relatedListObjects = {};
    relatedListNames = [];
    _object = Creator.Objects[object_name];

    if (_object) {
      relatedList = _object.relatedList;

      if (!_.isEmpty(relatedList)) {
        _.each(relatedList, function (objOrName) {
          var related;

          if (_.isObject(objOrName)) {
            related = {
              object_name: objOrName.objectName,
              columns: objOrName.columns,
              mobile_columns: objOrName.mobile_columns,
              is_file: objOrName.objectName === "cms_files",
              filtersFunction: objOrName.filters,
              sort: objOrName.sort,
              related_field_name: '',
              customRelatedListObject: true,
              label: objOrName.label,
              actions: objOrName.actions
            };
            relatedListObjects[objOrName.objectName] = related;
            return relatedListNames.push(objOrName.objectName);
          } else if (_.isString(objOrName)) {
            return relatedListNames.push(objOrName);
          }
        });
      }
    }

    mapList = {};
    related_objects = Creator.getRelatedObjects(object_name);

    _.each(related_objects, function (related_object_item) {
      var columns, mobile_columns, order, related, relatedObject, related_field_name, related_object, related_object_name, sharing, tabular_order;

      if (!(related_object_item != null ? related_object_item.object_name : void 0)) {
        return;
      }

      related_object_name = related_object_item.object_name;
      related_field_name = related_object_item.foreign_key;
      sharing = related_object_item.sharing;
      related_object = Creator.getObject(related_object_name);

      if (!related_object) {
        return;
      }

      columns = Creator.getObjectDefaultColumns(related_object_name) || ["name"];
      columns = _.without(columns, related_field_name);
      mobile_columns = Creator.getObjectDefaultColumns(related_object_name, true) || ["name"];
      mobile_columns = _.without(mobile_columns, related_field_name);
      order = Creator.getObjectDefaultSort(related_object_name);
      tabular_order = Creator.transformSortToTabular(order, columns);

      if (/\w+\.\$\.\w+/g.test(related_field_name)) {
        related_field_name = related_field_name.replace(/\$\./, "");
      }

      related = {
        object_name: related_object_name,
        columns: columns,
        mobile_columns: mobile_columns,
        related_field_name: related_field_name,
        is_file: related_object_name === "cms_files",
        sharing: sharing
      };
      relatedObject = relatedListObjects[related_object_name];

      if (relatedObject) {
        if (relatedObject.columns) {
          related.columns = relatedObject.columns;
        }

        if (relatedObject.mobile_columns) {
          related.mobile_columns = relatedObject.mobile_columns;
        }

        if (relatedObject.sort) {
          related.sort = relatedObject.sort;
        }

        if (relatedObject.filtersFunction) {
          related.filtersFunction = relatedObject.filtersFunction;
        }

        if (relatedObject.customRelatedListObject) {
          related.customRelatedListObject = relatedObject.customRelatedListObject;
        }

        if (relatedObject.label) {
          related.label = relatedObject.label;
        }

        delete relatedListObjects[related_object_name];
      }

      return mapList[related.object_name] = related;
    });

    spaceId = Session.get("spaceId");
    userId = Meteor.userId();
    related_object_names = _.pluck(_.values(relatedListObjects), "object_name");
    permissions = Creator.getPermissions(object_name, spaceId, userId);
    unrelated_objects = permissions.unrelated_objects;
    related_object_names = _.difference(related_object_names, unrelated_objects);

    _.each(relatedListObjects, function (v, related_object_name) {
      var allowRead, isActive, ref;
      isActive = related_object_names.indexOf(related_object_name) > -1;
      allowRead = (ref = Creator.getPermissions(related_object_name, spaceId, userId)) != null ? ref.allowRead : void 0;

      if (isActive && allowRead) {
        return mapList[related_object_name] = v;
      }
    });

    list = [];

    if (_.isEmpty(relatedListNames)) {
      list = _.values(mapList);
    } else {
      _.each(relatedListNames, function (objectName) {
        if (mapList[objectName]) {
          return list.push(mapList[objectName]);
        }
      });
    }

    if (_.has(_object, 'allow_relatedList')) {
      list = _.filter(list, function (item) {
        return _.include(_object.allow_relatedList, item.object_name);
      });
    }

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
       从columns参数中过滤出用于手机端显示的columns
   	规则：
   	1.优先把columns中的name字段排在第一个
   	2.最多只返回4个字段
   	3.考虑宽字段占用整行规则条件下，最多只返回两行
    */

Creator.pickObjectMobileColumns = function (object_name, columns) {
  var count, field, fields, getField, isNameColumn, itemCount, maxCount, maxRows, nameColumn, nameKey, object, result;
  result = [];
  maxRows = 2;
  maxCount = maxRows * 2;
  count = 0;
  object = Creator.getObject(object_name);
  fields = object.fields;

  if (!object) {
    return columns;
  }

  nameKey = object.NAME_FIELD_KEY;

  isNameColumn = function (item) {
    if (_.isObject(item)) {
      return item.field === nameKey;
    } else {
      return item === nameKey;
    }
  };

  getField = function (item) {
    if (_.isObject(item)) {
      return fields[item.field];
    } else {
      return fields[item];
    }
  };

  if (nameKey) {
    nameColumn = columns.find(function (item) {
      return isNameColumn(item);
    });
  }

  if (nameColumn) {
    field = getField(nameColumn);
    itemCount = field.is_wide ? 2 : 1;
    count += itemCount;
    result.push(nameColumn);
  }

  columns.forEach(function (item) {
    field = getField(item);

    if (!field) {
      return;
    }

    itemCount = field.is_wide ? 2 : 1;

    if (count < maxCount && result.length < maxCount && !isNameColumn(item)) {
      count += itemCount;

      if (count <= maxCount) {
        return result.push(item);
      }
    }
  });
  return result;
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

Creator.getObjectDefaultColumns = function (object_name, use_mobile_columns) {
  var columns, defaultView;
  defaultView = Creator.getObjectDefaultView(object_name);
  columns = defaultView != null ? defaultView.columns : void 0;

  if (use_mobile_columns) {
    if (defaultView != null ? defaultView.mobile_columns : void 0) {
      columns = defaultView.mobile_columns;
    } else if (columns) {
      columns = Creator.pickObjectMobileColumns(object_name, columns);
    }
  }

  return columns;
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
  try {
    return eval(js);
  } catch (e) {
    console.error(e, js);
  }
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
var convertField, getOption;

getOption = function (option) {
  var foo;
  foo = option.split(":");

  if (foo.length > 2) {
    return {
      label: foo[0],
      value: foo[1],
      color: foo[2]
    };
  } else if (foo.length > 1) {
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

convertField = function (object_name, field_name, field, spaceId) {
  var allOptions, code, options, picklist, picklistOptions, ref;

  if (Meteor.isServer && spaceId && field.type === 'select') {
    code = field.picklist || object_name + "." + field_name;

    if (code) {
      picklist = Creator.getPicklist(code, spaceId);

      if (picklist) {
        options = [];
        allOptions = [];
        picklistOptions = Creator.getPickListOptions(picklist);
        picklistOptions = (ref = _.sortBy(picklistOptions, 'sort_no')) != null ? ref.reverse() : void 0;

        _.each(picklistOptions, function (item) {
          var label, value;
          label = item.name;
          value = item.value || item.name;
          allOptions.push({
            label: label,
            value: value,
            enable: item.enable,
            color: item.color
          });

          if (item.enable) {
            options.push({
              label: label,
              value: value,
              color: item.color
            });
          }

          if (item["default"]) {
            return field.defaultValue = value;
          }
        });

        if (options.length > 0) {
          field.options = options;
        }

        if (allOptions.length > 0) {
          field.allOptions = allOptions;
        }
      }
    }
  }

  return field;
};

Creator.convertObject = function (object, spaceId) {
  if (!object) {
    return;
  }

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
    var _options, _type, beforeOpenFunction, createFunction, defaultValue, error, filtersFunction, is_company_limited, max, min, options, optionsFunction, reference_to, regEx;

    field = convertField(object.name, key, field, spaceId);

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
    } else if (field.options && _.isArray(field.options)) {
      try {
        _options = [];

        _.forEach(field.options, function (option) {
          if (_.isString(option)) {
            return _options.push(getOption(option));
          } else {
            return _options.push(option);
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
      min = field.min;

      if (_.isFunction(min)) {
        field._min = min.toString();
      }
    } else {
      min = field._min;

      if (_.isString(min)) {
        try {
          field.min = Creator["eval"]("(" + min + ")");
        } catch (error1) {
          error = error1;
          console.error("convert error " + object.name + " -> " + field.name, error);
        }
      }
    }

    if (Meteor.isServer) {
      max = field.max;

      if (_.isFunction(max)) {
        field._max = max.toString();
      }
    } else {
      max = field._max;

      if (_.isString(max)) {
        try {
          field.max = Creator["eval"]("(" + max + ")");
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
      filtersFunction = field._filtersFunction || field.filtersFunction;

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

  if (Meteor.isServer) {
    if (object.form && !_.isString(object.form)) {
      object.form = JSON.stringify(object.form, function (key, val) {
        if (_.isFunction(val)) {
          return val + '';
        } else {
          return val;
        }
      });
    }
  } else if (Meteor.isClient) {
    if (object.form) {
      object.form = JSON.parse(object.form, function (key, val) {
        if (_.isString(val) && val.startsWith('function')) {
          return Creator["eval"]("(" + val + ")");
        } else {
          return val;
        }
      });
    }
  }

  if (Meteor.isClient) {
    _.forEach(object.relatedList, function (relatedObjInfo) {
      if (_.isObject(relatedObjInfo)) {
        return _.forEach(relatedObjInfo, function (val, key) {
          var error;

          if (key === 'filters' && _.isString(val)) {
            try {
              return relatedObjInfo[key] = Creator["eval"]("(" + val + ")");
            } catch (error1) {
              error = error1;
              return console.error("filters_code", val);
            }
          }
        });
      }
    });
  } else {
    _.forEach(object.relatedList, function (relatedObjInfo) {
      if (_.isObject(relatedObjInfo)) {
        return _.forEach(relatedObjInfo, function (val, key) {
          if (key === 'filters' && _.isFunction(val)) {
            return relatedObjInfo[key] = val.toString();
          }
        });
      }
    });
  }

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

},"object.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/lib/object.coffee                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var clone;
clone = require('clone');
Creator.objectsByName = {};

Creator.formatObjectName = function (object_name) {
  if (object_name.startsWith('cfs.files.')) {
    object_name = object_name.replace(new RegExp('\\.', 'g'), '_');
  }

  return object_name;
};

Creator.Object = function (options) {
  var _baseObject, _db, defaultListViewId, defaultView, disabled_list_views, permissions, ref, ref1, ref2, ref3, schema, self;

  _baseObject = Creator.baseObject;

  if (Meteor.isClient) {
    _baseObject = {
      actions: Creator.baseObject.actions,
      fields: {},
      triggers: {},
      permission_set: {}
    };
  }

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
  self.form = options.form;
  self.relatedList = options.relatedList;

  if (!_.isBoolean(options.is_enable) || options.is_enable === true) {
    self.is_enable = true;
  } else {
    self.is_enable = false;
  }

  if (Meteor.isClient) {
    if (_.has(options, 'allow_actions')) {
      self.allow_actions = options.allow_actions;
    }

    if (_.has(options, 'allow_relatedList')) {
      self.allow_relatedList = options.allow_relatedList;
    }
  }

  self.enable_search = options.enable_search;
  self.enable_files = options.enable_files;
  self.enable_tasks = options.enable_tasks;
  self.enable_notes = options.enable_notes;
  self.enable_audit = options.enable_audit;

  if (options.paging) {
    self.paging = options.paging;
  }

  self.hidden = options.hidden;
  self.enable_api = options.enable_api === void 0 || options.enable_api;
  self.custom = options.custom;
  self.enable_share = options.enable_share;
  self.enable_instances = options.enable_instances;
  self.enable_process = options.enable_process;

  if (Meteor.isClient) {
    if (Creator.isCloudAdminSpace(Session.get("spaceId"))) {
      self.enable_tree = false;
    } else {
      self.enable_tree = options.enable_tree;
      self.sidebar = _.clone(options.sidebar);
    }
  } else {
    self.sidebar = _.clone(options.sidebar);
    self.enable_tree = options.enable_tree;
  }

  self.open_window = options.open_window;
  self.filter_company = options.filter_company;
  self.calendar = _.clone(options.calendar);
  self.enable_chatter = options.enable_chatter;
  self.enable_trash = options.enable_trash;
  self.enable_space_global = options.enable_space_global;
  self.enable_approvals = options.enable_approvals;
  self.enable_follow = options.enable_follow;
  self.enable_workflow = options.enable_workflow;
  self.enable_inline_edit = options.enable_inline_edit;

  if (_.has(options, 'in_development')) {
    self.in_development = options.in_development;
  }

  self.idFieldName = '_id';

  if (options.database_name) {
    self.database_name = options.database_name;
  }

  if (!options.fields) {
    console.error(options);
    throw new Error('Creator.Object options must specify fields');
  }

  self.fields = clone(options.fields);

  _.each(self.fields, function (field, field_name) {
    if (field.is_name) {
      self.NAME_FIELD_KEY = field_name;
    } else if (field_name === 'name' && !self.NAME_FIELD_KEY) {
      self.NAME_FIELD_KEY = field_name;
    }

    if (field.primary) {
      self.idFieldName = field_name;
    }

    if (Meteor.isClient) {
      if (Creator.isCloudAdminSpace(Session.get("spaceId"))) {
        if (field_name === 'space') {
          field.filterable = true;
          return field.hidden = false;
        }
      }
    }
  });

  if (!options.database_name || options.database_name === 'meteor-mongo') {
    _.each(_baseObject.fields, function (field, field_name) {
      if (!self.fields[field_name]) {
        self.fields[field_name] = {};
      }

      return self.fields[field_name] = _.extend(_.clone(field), self.fields[field_name]);
    });
  }

  _.each(self.fields, function (field, field_name) {
    if (field.type === 'autonumber') {
      return field.readonly = true;
    } else if (field.type === 'formula') {
      return field.readonly = true;
    } else if (field.type === 'summary') {
      return field.readonly = true;
    }
  });

  self.list_views = {};
  defaultView = Creator.getObjectDefaultView(self.name);

  _.each(options.list_views, function (item, item_name) {
    var oitem;
    oitem = Creator.convertListView(defaultView, item, item_name);
    return self.list_views[item_name] = oitem;
  });

  self.triggers = _.clone(_baseObject.triggers);

  _.each(options.triggers, function (item, item_name) {
    if (!self.triggers[item_name]) {
      self.triggers[item_name] = {};
    }

    self.triggers[item_name].name = item_name;
    return self.triggers[item_name] = _.extend(_.clone(self.triggers[item_name]), item);
  });

  self.actions = _.clone(_baseObject.actions);

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
  self.permission_set = _.clone(_baseObject.permission_set);

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
  } else {
    self.permissions = null;
  }

  _db = Creator.createCollection(options);
  Creator.Collections[_db._name] = _db;
  self.db = _db;
  self._collection_name = _db._name;
  schema = Creator.getObjectSchema(self);
  self.schema = new SimpleSchema(schema);

  if (self.name !== "users" && self.name !== "cfs.files.filerecord" && !self.is_view && !_.contains(["flows", "forms", "instances", "organizations", "action_field_updates"], self.name)) {
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

Creator.getObjectODataRouterPrefix = function (object) {
  if (object) {
    if (!object.database_name || object.database_name === 'meteor-mongo') {
      return "/api/odata/v4";
    } else {
      return "/api/odata/" + object.database_name;
    }
  }
};

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

  if (!obj) {
    return;
  }

  schema = {};
  fieldsArr = [];

  _.each(obj.fields, function (field, field_name) {
    if (!_.has(field, "name")) {
      field.name = field_name;
    }

    return fieldsArr.push(field);
  });

  _.each(_.sortBy(fieldsArr, "sort_no"), function (field) {
    var _object, _ref_obj, _reference_to, autoform_type, field_name, fs, isUnLimited, locale, permissions, ref, ref1, ref2, ref3;

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
      fs.autoform.rows = field.rows || 2;
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

      if (Meteor.isClient) {
        locale = Steedos.locale();

        if (locale === "zh-cn" || locale === "zh-CN") {
          locale = "zh-CN";
        } else {
          locale = "en-US";
        }

        fs.autoform.afFieldInput = {
          type: "summernote",
          "class": 'summernote-editor',
          settings: {
            height: 200,
            dialogsInBody: true,
            toolbar: [['font1', ['style']], ['font2', ['bold', 'underline', 'italic', 'clear']], ['font3', ['fontname']], ['color', ['color']], ['para', ['ul', 'ol', 'paragraph']], ['table', ['table']], ['insert', ['link', 'picture']], ['view', ['codeview']]],
            fontNames: ['Arial', 'Comic Sans MS', 'Courier New', 'Helvetica', 'Impact', '宋体', '黑体', '微软雅黑', '仿宋', '楷体', '隶书', '幼圆'],
            lang: locale
          }
        };
      }
    } else if (field.type === "lookup" || field.type === "master_detail") {
      fs.type = String;
      fs.autoform.showIcon = field.showIcon;

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

        if (_.has(field, 'firstOption')) {
          fs.autoform.firstOption = field.firstOption;
        } else {
          fs.autoform.firstOption = "";
        }
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

      if (field.readonly) {
        fs.autoform.disabled = true;
      }

      fs.autoform.type = "steedos-boolean-checkbox";
    } else if (field.type === "toggle") {
      fs.type = Boolean;

      if (field.readonly) {
        fs.autoform.disabled = true;
      }

      fs.autoform.type = "steedos-boolean-toggle";
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
    } else if (field.type === 'formula') {
      fs = Creator.getObjectSchema({
        fields: {
          field: Object.assign({}, field, {
            type: field.data_type
          })
        }
      })[field.name];
    } else if (field.type === 'summary') {
      fs = Creator.getObjectSchema({
        fields: {
          field: Object.assign({}, field, {
            type: field.data_type
          })
        }
      })[field.name];
    } else {
      fs.type = field.type;
    }

    if (field.label) {
      fs.label = field.label;
    }

    if (!field.required) {
      fs.optional = true;
    }

    if (!Meteor.isClient) {
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
            spaceId: Session.get("spaceId"),
            now: new Date()
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

    if (_.has(field, 'min')) {
      fs.min = field.min;
    }

    if (_.has(field, 'max')) {
      fs.max = field.max;
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
  var collection, error, ref, ref1, ref2, ref3, ref4, ref5, todoWrapper;

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
      return collection != null ? (ref = collection.before) != null ? ref.insert(todoWrapper) : void 0 : void 0;
    } else if (trigger.when === "before.update") {
      return collection != null ? (ref1 = collection.before) != null ? ref1.update(todoWrapper) : void 0 : void 0;
    } else if (trigger.when === "before.remove") {
      return collection != null ? (ref2 = collection.before) != null ? ref2.remove(todoWrapper) : void 0 : void 0;
    } else if (trigger.when === "after.insert") {
      return collection != null ? (ref3 = collection.after) != null ? ref3.insert(todoWrapper) : void 0 : void 0;
    } else if (trigger.when === "after.update") {
      return collection != null ? (ref4 = collection.after) != null ? ref4.update(todoWrapper) : void 0 : void 0;
    } else if (trigger.when === "after.remove") {
      return collection != null ? (ref5 = collection.after) != null ? ref5.remove(todoWrapper) : void 0 : void 0;
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

      if (_trigger_hook) {
        Creator._trigger_hooks[object_name].push(_trigger_hook);
      }
    }

    if (Meteor.isClient && trigger.on === "client" && trigger.todo && trigger.when) {
      _trigger_hook = initTrigger(object_name, trigger);
      return Creator._trigger_hooks[object_name].push(_trigger_hook);
    }
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"permission_sets.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/lib/permission_sets.coffee                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var clone, findOne_permission_object, find_permission_object, intersectionPlus, unionPermissionObjects, unionPlus;
clone = require('clone');

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
  var isOwner, object_fields_keys, permissions, record_company_id, record_company_ids, record_id, ref, ref1, select, user_company_ids;

  if (!object_name && Meteor.isClient) {
    object_name = Session.get("object_name");
  }

  if (!spaceId && Meteor.isClient) {
    spaceId = Session.get("spaceId");
  }

  if (record && object_name === "cms_files" && Meteor.isClient) {
    if (object_name === Session.get('object_name')) {
      object_name = record.parent['reference_to._o'];
      record_id = record.parent._id;
    } else {
      object_name = Session.get('object_name');
      record_id = Session.get("record_id");
    }

    object_fields_keys = _.keys(((ref = Creator.getObject(object_name, spaceId)) != null ? ref.fields : void 0) || {}) || [];
    select = _.intersection(object_fields_keys, ['owner', 'company_id', 'company_ids', 'locked']) || [];

    if (select.length > 0) {
      record = Creator.getObjectRecord(object_name, record_id, select.join(','));
    } else {
      record = null;
    }
  }

  permissions = _.clone(Creator.getPermissions(object_name, spaceId, userId));

  if (record) {
    if (record.record_permissions) {
      return record.record_permissions;
    }

    isOwner = record.owner === userId || ((ref1 = record.owner) != null ? ref1._id : void 0) === userId;

    if (Meteor.isClient) {
      user_company_ids = Steedos.getUserCompanyIds();
    } else {
      user_company_ids = Creator.getUserCompanyIds(userId, spaceId);
    }

    record_company_id = record != null ? record.company_id : void 0;

    if (record_company_id && _.isObject(record_company_id) && record_company_id._id) {
      record_company_id = record_company_id._id;
    }

    record_company_ids = record != null ? record.company_ids : void 0;

    if (record_company_ids && record_company_ids.length && _.isObject(record_company_ids[0])) {
      record_company_ids = record_company_ids.map(function (n) {
        return n._id;
      });
    }

    record_company_ids = _.union(record_company_ids, [record_company_id]);

    if (!permissions.modifyAllRecords && !isOwner && !permissions.modifyCompanyRecords) {
      permissions.allowEdit = false;
      permissions.allowDelete = false;
    } else if (!permissions.modifyAllRecords && permissions.modifyCompanyRecords) {
      if (record_company_ids && record_company_ids.length) {
        if (user_company_ids && user_company_ids.length) {
          if (!_.intersection(user_company_ids, record_company_ids).length) {
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
    } else if (!permissions.viewAllRecords && permissions.viewCompanyRecords) {
      if (record_company_ids && record_company_ids.length) {
        if (user_company_ids && user_company_ids.length) {
          if (!_.intersection(user_company_ids, record_company_ids).length) {
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

if (Meteor.isClient) {
  Creator.getRecordRelatedListPermissions = function (currentObjectName, relatedListItem, currentRecord, userId, spaceId) {
    var isRelateObjectUneditable, masterAllow, masterRecordPerm, relatedObjectPermissions, result, sharing, uneditable_related_list;

    if (!currentObjectName && Meteor.isClient) {
      currentObjectName = Session.get("object_name");
    }

    if (!relatedListItem) {
      console.error("relatedListItem must not be empty for the function Creator.getRecordRelatedListPermissions");
      return {};
    }

    if (!currentRecord && Meteor.isClient) {
      currentRecord = Creator.getObjectRecord();
    }

    if (!userId && Meteor.isClient) {
      userId = Meteor.userId();
    }

    if (!spaceId && Meteor.isClient) {
      spaceId = Session.get("spaceId");
    }

    sharing = relatedListItem.sharing || 'masterWrite';
    masterAllow = false;
    masterRecordPerm = Creator.getRecordPermissions(currentObjectName, currentRecord, userId, spaceId);

    if (sharing === 'masterRead') {
      masterAllow = masterRecordPerm.allowRead;
    } else if (sharing === 'masterWrite') {
      masterAllow = masterRecordPerm.allowEdit;
    }

    uneditable_related_list = Creator.getRecordSafeRelatedList(currentRecord, currentObjectName);
    relatedObjectPermissions = Creator.getPermissions(relatedListItem.object_name);
    isRelateObjectUneditable = uneditable_related_list.indexOf(relatedListItem.object_name) > -1;
    result = _.clone(relatedObjectPermissions);
    result.allowCreate = masterAllow && relatedObjectPermissions.allowCreate && !isRelateObjectUneditable;
    result.allowEdit = masterAllow && relatedObjectPermissions.allowEdit && !isRelateObjectUneditable;
    return result;
  };
}

if (Meteor.isServer) {
  Creator.getAllPermissions = function (spaceId, userId) {
    var _i, isSpaceAdmin, permissions, psets, psetsAdmin, psetsAdmin_pos, psetsCurrent, psetsCurrentNames, psetsCurrent_pos, psetsCustomer, psetsCustomer_pos, psetsGuest, psetsGuest_pos, psetsMember, psetsMember_pos, psetsSupplier, psetsSupplier_pos, psetsUser, psetsUser_pos, set_ids, spaceUser;

    permissions = {
      objects: {},
      assigned_apps: []
    }; /*
       		权限组说明:
       		内置权限组-admin,user,member,guest,workflow_admin,organization_admin
       		自定义权限组-数据库中新建的除内置权限组以外的其他权限组
       		特定用户集合权限组（即users属性不可配置）-admin,user,member,guest
       		可配置用户集合权限组（即users属性可配置）-workflow_admin,organization_admin以及自定义权限组
        */
    isSpaceAdmin = false;
    spaceUser = null;

    if (userId) {
      isSpaceAdmin = Creator.isSpaceAdmin(spaceId, userId);
      spaceUser = Creator.getCollection("space_users").findOne({
        space: spaceId,
        user: userId
      }, {
        fields: {
          profile: 1
        }
      });
    }

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
    psetsSupplier = Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'supplier'
    }, {
      fields: {
        _id: 1,
        assigned_apps: 1
      }
    }) || null;
    psetsCustomer = Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'customer'
    }, {
      fields: {
        _id: 1,
        assigned_apps: 1
      }
    }) || null;

    if (spaceUser && spaceUser.profile) {
      psetsCurrent = Creator.getCollection("permission_set").find({
        space: spaceId,
        $or: [{
          users: userId
        }, {
          name: spaceUser.profile
        }]
      }, {
        fields: {
          _id: 1,
          assigned_apps: 1,
          name: 1
        }
      }).fetch();
    } else {
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
    }

    psetsAdmin_pos = null;
    psetsUser_pos = null;
    psetsMember_pos = null;
    psetsGuest_pos = null;
    psetsCurrent_pos = null;
    psetsSupplier_pos = null;
    psetsCustomer_pos = null;

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

    if (psetsSupplier != null ? psetsSupplier._id : void 0) {
      psetsSupplier_pos = Creator.getCollection("permission_objects").find({
        permission_set_id: psetsSupplier._id
      }, {
        fields: {
          created: 0,
          modified: 0,
          created_by: 0,
          modified_by: 0
        }
      }).fetch();
    }

    if (psetsCustomer != null ? psetsCustomer._id : void 0) {
      psetsCustomer_pos = Creator.getCollection("permission_objects").find({
        permission_set_id: psetsCustomer._id
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

    psets = {
      psetsAdmin: psetsAdmin,
      psetsUser: psetsUser,
      psetsCurrent: psetsCurrent,
      psetsMember: psetsMember,
      psetsGuest: psetsGuest,
      psetsSupplier: psetsSupplier,
      psetsCustomer: psetsCustomer,
      isSpaceAdmin: isSpaceAdmin,
      spaceUser: spaceUser,
      psetsAdmin_pos: psetsAdmin_pos,
      psetsUser_pos: psetsUser_pos,
      psetsMember_pos: psetsMember_pos,
      psetsGuest_pos: psetsGuest_pos,
      psetsSupplier_pos: psetsSupplier_pos,
      psetsCustomer_pos: psetsCustomer_pos,
      psetsCurrent_pos: psetsCurrent_pos
    };
    permissions.assigned_apps = Creator.getAssignedApps.bind(psets)(spaceId, userId);
    permissions.assigned_menus = Creator.getAssignedMenus.bind(psets)(spaceId, userId);
    permissions.user_permission_sets = psetsCurrentNames;
    _i = 0;

    _.each(Creator.objectsByName, function (object, object_name) {
      _i++;

      if (!_.has(object, 'space') || !object.space || object.space === spaceId) {
        if (!_.has(object, 'in_development') || object.in_development === '0' || object.in_development !== '0' && isSpaceAdmin) {
          permissions.objects[object_name] = Creator.convertObject(clone(Creator.Objects[object_name]), spaceId);
          return permissions.objects[object_name]["permissions"] = Creator.getObjectPermissions.bind(psets)(spaceId, userId, object_name);
        }
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

  intersectionPlus = function (array, other) {
    if (!array && !other) {
      return void 0;
    }

    if (!array) {
      array = [];
    }

    if (!other) {
      other = [];
    }

    return _.intersection(array, other);
  };

  Creator.getAssignedApps = function (spaceId, userId) {
    var apps, isSpaceAdmin, psetBase, psets, psetsAdmin, psetsCustomer, psetsSupplier, psetsUser, ref, ref1, userProfile;
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
    psetsSupplier = this.psetsMember || Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'supplier'
    }, {
      fields: {
        _id: 1,
        assigned_apps: 1
      }
    });
    psetsCustomer = this.psetsGuest || Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'customer'
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
        assigned_apps: 1,
        name: 1
      }
    }).fetch();
    isSpaceAdmin = _.isBoolean(this.isSpaceAdmin) ? this.isSpaceAdmin : Creator.isSpaceAdmin(spaceId, userId);
    apps = [];

    if (isSpaceAdmin) {
      return [];
    } else {
      userProfile = (ref = Creator.getCollection("space_users").findOne({
        space: spaceId,
        user: userId
      }, {
        fields: {
          profile: 1
        }
      })) != null ? ref.profile : void 0;
      psetBase = psetsUser;

      if (userProfile) {
        if (userProfile === 'supplier') {
          psetBase = psetsSupplier;
        } else if (userProfile === 'customer') {
          psetBase = psetsCustomer;
        }
      }

      if (psetBase != null ? (ref1 = psetBase.assigned_apps) != null ? ref1.length : void 0 : void 0) {
        apps = _.union(apps, psetBase.assigned_apps);
      } else {
        return [];
      }

      _.each(psets, function (pset) {
        if (!pset.assigned_apps) {
          return;
        }

        if (pset.name === "admin" || pset.name === "user" || pset.name === 'supplier' || pset.name === 'customer') {
          return;
        }

        return apps = _.union(apps, pset.assigned_apps);
      });

      return _.without(_.uniq(apps), void 0, null);
    }
  };

  Creator.getAssignedMenus = function (spaceId, userId) {
    var aboutMenu, adminMenus, allMenus, currentPsetNames, isSpaceAdmin, menus, otherMenuApps, otherMenus, psets, ref, ref1, result, userProfile;
    psets = this.psetsCurrent || Creator.getCollection("permission_set").find({
      users: userId,
      space: spaceId
    }, {
      fields: {
        _id: 1,
        assigned_apps: 1,
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
      result = allMenus;
    } else {
      userProfile = ((ref1 = Creator.getCollection("space_users").findOne({
        space: spaceId,
        user: userId
      }, {
        fields: {
          profile: 1
        }
      })) != null ? ref1.profile : void 0) || 'user';
      currentPsetNames = psets.map(function (n) {
        return n.name;
      });
      menus = allMenus.filter(function (menu) {
        var psetsMenu;
        psetsMenu = menu.permission_sets;

        if (psetsMenu && psetsMenu.indexOf(userProfile) > -1) {
          return true;
        }

        return _.intersection(currentPsetNames, psetsMenu).length;
      });
      result = menus;
    }

    return _.sortBy(result, "sort");
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

  unionPermissionObjects = function (pos, object, psets) {
    var result;
    result = [];

    _.each(object.permission_set, function (ops, ops_key) {
      var currentPset, tempOps;

      if (["admin", "user", "member", "guest"].indexOf(ops_key) < 0) {
        currentPset = psets.find(function (pset) {
          return pset.name === ops_key;
        });

        if (currentPset) {
          tempOps = _.clone(ops) || {};
          tempOps.permission_set_id = currentPset._id;
          tempOps.object_name = object.object_name;
          return result.push(tempOps);
        }
      }
    });

    if (result.length) {
      pos.forEach(function (po) {
        var repeatIndex, repeatPo;
        repeatIndex = 0;
        repeatPo = result.find(function (item, index) {
          repeatIndex = index;
          return item.permission_set_id === po.permission_set_id;
        });

        if (repeatPo) {
          return result[repeatIndex] = po;
        } else {
          return result.push(po);
        }
      });
      return result;
    } else {
      return pos;
    }
  };

  Creator.getObjectPermissions = function (spaceId, userId, object_name) {
    var isSpaceAdmin, object, opsetAdmin, opsetCustomer, opsetGuest, opsetMember, opsetSupplier, opsetUser, permissions, pos, posAdmin, posCustomer, posGuest, posMember, posSupplier, posUser, prof, psets, psetsAdmin, psetsAdmin_pos, psetsCurrent_pos, psetsCustomer, psetsCustomer_pos, psetsGuest, psetsGuest_pos, psetsMember, psetsMember_pos, psetsSupplier, psetsSupplier_pos, psetsUser, psetsUser_pos, set_ids, spaceUser;
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
    psetsSupplier = _.isNull(this.psetsSupplier) || this.psetsSupplier ? this.psetsSupplier : Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'supplier'
    }, {
      fields: {
        _id: 1
      }
    });
    psetsCustomer = _.isNull(this.psetsCustomer) || this.psetsCustomer ? this.psetsCustomer : Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'customer'
    }, {
      fields: {
        _id: 1
      }
    });
    psets = this.psetsCurrent || Creator.getCollection("permission_set").find({
      users: userId,
      space: spaceId
    }, {
      fields: {
        _id: 1,
        assigned_apps: 1,
        name: 1
      }
    }).fetch();
    isSpaceAdmin = _.isBoolean(this.isSpaceAdmin) ? this.isSpaceAdmin : Creator.isSpaceAdmin(spaceId, userId);
    psetsAdmin_pos = this.psetsAdmin_pos;
    psetsUser_pos = this.psetsUser_pos;
    psetsMember_pos = this.psetsMember_pos;
    psetsGuest_pos = this.psetsGuest_pos;
    psetsSupplier_pos = this.psetsSupplier_pos;
    psetsCustomer_pos = this.psetsCustomer_pos;
    psetsCurrent_pos = this.psetsCurrent_pos;
    opsetAdmin = _.clone(object.permission_set.admin) || {};
    opsetUser = _.clone(object.permission_set.user) || {};
    opsetMember = _.clone(object.permission_set.member) || {};
    opsetGuest = _.clone(object.permission_set.guest) || {};
    opsetSupplier = _.clone(object.permission_set.supplier) || {};
    opsetCustomer = _.clone(object.permission_set.customer) || {};

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
        opsetAdmin.uneditable_related_list = posAdmin.uneditable_related_list;
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
        opsetUser.uneditable_related_list = posUser.uneditable_related_list;
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
        opsetMember.uneditable_related_list = posMember.uneditable_related_list;
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
        opsetGuest.uneditable_related_list = posGuest.uneditable_related_list;
      }
    }

    if (psetsSupplier) {
      posSupplier = findOne_permission_object(psetsSupplier_pos, object_name, psetsSupplier._id);

      if (posSupplier) {
        opsetSupplier.allowCreate = posSupplier.allowCreate;
        opsetSupplier.allowDelete = posSupplier.allowDelete;
        opsetSupplier.allowEdit = posSupplier.allowEdit;
        opsetSupplier.allowRead = posSupplier.allowRead;
        opsetSupplier.modifyAllRecords = posSupplier.modifyAllRecords;
        opsetSupplier.viewAllRecords = posSupplier.viewAllRecords;
        opsetSupplier.modifyCompanyRecords = posSupplier.modifyCompanyRecords;
        opsetSupplier.viewCompanyRecords = posSupplier.viewCompanyRecords;
        opsetSupplier.disabled_list_views = posSupplier.disabled_list_views;
        opsetSupplier.disabled_actions = posSupplier.disabled_actions;
        opsetSupplier.unreadable_fields = posSupplier.unreadable_fields;
        opsetSupplier.uneditable_fields = posSupplier.uneditable_fields;
        opsetSupplier.unrelated_objects = posSupplier.unrelated_objects;
        opsetSupplier.uneditable_related_list = posSupplier.uneditable_related_list;
      }
    }

    if (psetsCustomer) {
      posCustomer = findOne_permission_object(psetsCustomer_pos, object_name, psetsCustomer._id);

      if (posCustomer) {
        opsetCustomer.allowCreate = posCustomer.allowCreate;
        opsetCustomer.allowDelete = posCustomer.allowDelete;
        opsetCustomer.allowEdit = posCustomer.allowEdit;
        opsetCustomer.allowRead = posCustomer.allowRead;
        opsetCustomer.modifyAllRecords = posCustomer.modifyAllRecords;
        opsetCustomer.viewAllRecords = posCustomer.viewAllRecords;
        opsetCustomer.modifyCompanyRecords = posCustomer.modifyCompanyRecords;
        opsetCustomer.viewCompanyRecords = posCustomer.viewCompanyRecords;
        opsetCustomer.disabled_list_views = posCustomer.disabled_list_views;
        opsetCustomer.disabled_actions = posCustomer.disabled_actions;
        opsetCustomer.unreadable_fields = posCustomer.unreadable_fields;
        opsetCustomer.uneditable_fields = posCustomer.uneditable_fields;
        opsetCustomer.unrelated_objects = posCustomer.unrelated_objects;
        opsetCustomer.uneditable_related_list = posCustomer.uneditable_related_list;
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
              } else if (prof === 'supplier') {
                permissions = opsetSupplier;
              } else if (prof === 'customer') {
                permissions = opsetCustomer;
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
      pos = unionPermissionObjects(pos, object, psets);

      _.each(pos, function (po) {
        if (po.permission_set_id === (psetsAdmin != null ? psetsAdmin._id : void 0) || po.permission_set_id === (psetsUser != null ? psetsUser._id : void 0) || po.permission_set_id === (psetsMember != null ? psetsMember._id : void 0) || po.permission_set_id === (psetsGuest != null ? psetsGuest._id : void 0) || po.permission_set_id === (psetsSupplier != null ? psetsSupplier._id : void 0) || po.permission_set_id === (psetsCustomer != null ? psetsCustomer._id : void 0)) {
          return;
        }

        if (_.isEmpty(permissions)) {
          permissions = po;
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

        permissions.disabled_list_views = intersectionPlus(permissions.disabled_list_views, po.disabled_list_views);
        permissions.disabled_actions = intersectionPlus(permissions.disabled_actions, po.disabled_actions);
        permissions.unreadable_fields = intersectionPlus(permissions.unreadable_fields, po.unreadable_fields);
        permissions.uneditable_fields = intersectionPlus(permissions.uneditable_fields, po.uneditable_fields);
        permissions.unrelated_objects = intersectionPlus(permissions.unrelated_objects, po.unrelated_objects);
        return permissions.uneditable_related_list = intersectionPlus(permissions.uneditable_related_list, po.uneditable_related_list);
      });
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

    if (object.permission_set.owner) {
      permissions.owner = object.permission_set.owner;
    }

    return permissions;
  };

  Meteor.methods({
    "creator.object_permissions": function (spaceId) {
      return Creator.getAllPermissions(spaceId, this.userId);
    }
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"collections.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/lib/collections.coffee                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var steedosCore;
steedosCore = require('@steedos/core');
Meteor.startup(function () {
  var creator_db_url, oplog_url;
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
});

Creator.getCollectionName = function (object) {
  return object.name;
};

Creator.createCollection = function (object) {
  var collection_key;
  collection_key = Creator.getCollectionName(object);

  if (db[collection_key]) {
    return db[collection_key];
  } else if (object.db) {
    return object.db;
  }

  if (Creator.Collections[collection_key]) {
    return Creator.Collections[collection_key];
  } else {
    if (object.custom) {
      return steedosCore.newCollection(collection_key, Creator._CREATOR_DATASOURCE);
    } else {
      if (collection_key === '_sms_queue' && (typeof SMSQueue !== "undefined" && SMSQueue !== null ? SMSQueue.collection : void 0)) {
        return SMSQueue.collection;
      }

      return steedosCore.newCollection(collection_key);
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
      } else {
        return toastr.warning(t("_object_actions_none_todo"));
      }
    } else {
      return toastr.warning(t("_object_actions_none_todo"));
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
      } else {
        Session.set('cmDoc', FormManager.getInitialValues(object_name));
      }

      Meteor.defer(function () {
        return $(".creator-add").click();
      });
    },
    "standard_open_view": function (object_name, record_id, fields) {
      var href;
      href = Creator.getObjectUrl(object_name, record_id);
      FlowRouter.redirect(href);
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
    "standard_delete": function (object_name, record_id, record_title, list_view_id, record, call_back) {
      var beforeHook, object, text;
      console.log("standard_delete", object_name, record_id, record_title, list_view_id);
      beforeHook = FormManager.runHook(object_name, 'delete', 'before', {
        _id: record_id
      });

      if (!beforeHook) {
        return false;
      }

      object = Creator.getObject(object_name);

      if (!_.isString(record_title) && (record_title != null ? record_title.name : void 0)) {
        record_title = record_title != null ? record_title.name : void 0;
      }

      if (record_title) {
        text = t("creator_record_remove_swal_text", object.label + " \"" + record_title + "\"");
      } else {
        text = t("creator_record_remove_swal_text", "" + object.label);
      }

      return swal({
        title: t("creator_record_remove_swal_title", "" + object.label),
        text: "<div class='delete-creator-warning'>" + text + "</div>",
        html: true,
        showCancelButton: true,
        confirmButtonText: t('Delete'),
        cancelButtonText: t('Cancel')
      }, function (option) {
        var previousDoc;

        if (option) {
          previousDoc = FormManager.getPreviousDoc(object_name, record_id, 'delete');
          return Creator.odata["delete"](object_name, record_id, function () {
            var appid, dxDataGridInstance, gridContainer, gridObjectNameClass, info, isOpenerRemove, recordUrl, tempNavRemoved;

            if (record_title) {
              info = t("creator_record_remove_swal_title_suc", object.label + ("\"" + record_title + "\""));
            } else {
              info = t('creator_record_remove_swal_suc');
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
                if (object_name !== Session.get("object_name")) {
                  FlowRouter.reload();
                } else {
                  Template.creator_grid.refresh(dxDataGridInstance);
                }
              }
            }

            recordUrl = Creator.getObjectUrl(object_name, record_id);
            tempNavRemoved = Creator.removeTempNavItem(object_name, recordUrl);

            if (isOpenerRemove || !dxDataGridInstance) {
              if (isOpenerRemove) {
                window.close();
              } else if (record_id === Session.get("record_id") && list_view_id !== 'calendar') {
                appid = Session.get("app_id");

                if (!list_view_id) {
                  list_view_id = Session.get("list_view_id");
                }

                if (!list_view_id) {
                  list_view_id = "all";
                }

                if (!tempNavRemoved) {
                  FlowRouter.go("/app/" + appid + "/" + object_name + "/grid/" + list_view_id);
                }
              }
            }

            if (call_back && typeof call_back === "function") {
              call_back();
            }

            return FormManager.runHook(object_name, 'delete', 'after', {
              _id: record_id,
              previousDoc: previousDoc
            });
          }, function (error) {
            return FormManager.runHook(object_name, 'delete', 'error', {
              _id: record_id,
              error: error
            });
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
    ".coffee"
  ]
});

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJEYXNoYm9hcmRzIiwiUmVwb3J0cyIsInN1YnMiLCJzdGVlZG9zU2NoZW1hIiwiZSIsIm9iamVjdHFsIiwic3RlZWRvc0NvcmUiLCJNZXRlb3IiLCJpc0RldmVsb3BtZW50IiwicmVxdWlyZSIsInN0YXJ0dXAiLCJleCIsIndyYXBBc3luYyIsImluaXQiLCJlcnJvciIsImNvbnNvbGUiLCJGaWJlciIsInBhdGgiLCJkZXBzIiwiYXBwIiwiVHJhY2tlciIsIkRlcGVuZGVuY3kiLCJvYmplY3QiLCJfVEVNUExBVEUiLCJTaW1wbGVTY2hlbWEiLCJleHRlbmRPcHRpb25zIiwiZmlsdGVyc0Z1bmN0aW9uIiwiTWF0Y2giLCJPcHRpb25hbCIsIk9uZU9mIiwiRnVuY3Rpb24iLCJTdHJpbmciLCJvcHRpb25zRnVuY3Rpb24iLCJjcmVhdGVGdW5jdGlvbiIsImlzU2VydmVyIiwiZmliZXJMb2FkT2JqZWN0cyIsIm9iaiIsIm9iamVjdF9uYW1lIiwibG9hZE9iamVjdHMiLCJydW4iLCJuYW1lIiwibGlzdF92aWV3cyIsInNwYWNlIiwiZ2V0Q29sbGVjdGlvbk5hbWUiLCJfIiwiY2xvbmUiLCJjb252ZXJ0T2JqZWN0IiwiT2JqZWN0IiwiaW5pdFRyaWdnZXJzIiwiaW5pdExpc3RWaWV3cyIsImdldE9iamVjdE5hbWUiLCJnZXRPYmplY3QiLCJzcGFjZV9pZCIsInJlZiIsInJlZjEiLCJpc0FycmF5IiwiaXNDbGllbnQiLCJkZXBlbmQiLCJTZXNzaW9uIiwiZ2V0Iiwib2JqZWN0c0J5TmFtZSIsImdldE9iamVjdEJ5SWQiLCJvYmplY3RfaWQiLCJmaW5kV2hlcmUiLCJfaWQiLCJyZW1vdmVPYmplY3QiLCJsb2ciLCJnZXRDb2xsZWN0aW9uIiwic3BhY2VJZCIsIl9jb2xsZWN0aW9uX25hbWUiLCJyZW1vdmVDb2xsZWN0aW9uIiwiaXNTcGFjZUFkbWluIiwidXNlcklkIiwiZmluZE9uZSIsImZpZWxkcyIsImFkbWlucyIsImluZGV4T2YiLCJldmFsdWF0ZUZvcm11bGEiLCJmb3JtdWxhciIsImNvbnRleHQiLCJvcHRpb25zIiwiaXNTdHJpbmciLCJGb3JtdWxhciIsImNoZWNrRm9ybXVsYSIsImV2YWx1YXRlRmlsdGVycyIsImZpbHRlcnMiLCJzZWxlY3RvciIsImVhY2giLCJmaWx0ZXIiLCJhY3Rpb24iLCJ2YWx1ZSIsImxlbmd0aCIsImlzQ29tbW9uU3BhY2UiLCJnZXRPcmRlcmx5U2V0QnlJZHMiLCJkb2NzIiwiaWRzIiwiaWRfa2V5IiwiaGl0X2ZpcnN0IiwidmFsdWVzIiwiZ2V0UHJvcGVydHkiLCJzb3J0QnkiLCJkb2MiLCJfaW5kZXgiLCJzb3J0aW5nTWV0aG9kIiwidmFsdWUxIiwidmFsdWUyIiwiaXNWYWx1ZTFFbXB0eSIsImlzVmFsdWUyRW1wdHkiLCJsb2NhbGUiLCJrZXkiLCJEYXRlIiwiZ2V0VGltZSIsIlN0ZWVkb3MiLCJ0b1N0cmluZyIsImxvY2FsZUNvbXBhcmUiLCJnZXRPYmplY3RSZWxhdGVkcyIsIl9vYmplY3QiLCJwZXJtaXNzaW9ucyIsInJlbGF0ZWRMaXN0IiwicmVsYXRlZExpc3RNYXAiLCJyZWxhdGVkX29iamVjdHMiLCJpc0VtcHR5Iiwib2JqTmFtZSIsImlzT2JqZWN0Iiwib2JqZWN0TmFtZSIsInJlbGF0ZWRfb2JqZWN0IiwicmVsYXRlZF9vYmplY3RfbmFtZSIsInJlbGF0ZWRfZmllbGQiLCJyZWxhdGVkX2ZpZWxkX25hbWUiLCJ0eXBlIiwicmVmZXJlbmNlX3RvIiwiZm9yZWlnbl9rZXkiLCJzaGFyaW5nIiwiZW5hYmxlT2JqTmFtZSIsImdldFBlcm1pc3Npb25zIiwiZW5hYmxlX2F1ZGl0IiwibW9kaWZ5QWxsUmVjb3JkcyIsImVuYWJsZV9maWxlcyIsInB1c2giLCJzcGxpY2UiLCJlbmFibGVfdGFza3MiLCJlbmFibGVfbm90ZXMiLCJlbmFibGVfZXZlbnRzIiwiZW5hYmxlX2luc3RhbmNlcyIsImVuYWJsZV9hcHByb3ZhbHMiLCJlbmFibGVfcHJvY2VzcyIsImdldFVzZXJDb250ZXh0IiwiaXNVblNhZmVNb2RlIiwiVVNFUl9DT05URVhUIiwic3BhY2VfdXNlcl9vcmciLCJzdSIsInN1RmllbGRzIiwiRXJyb3IiLCJtb2JpbGUiLCJwb3NpdGlvbiIsImVtYWlsIiwiY29tcGFueSIsIm9yZ2FuaXphdGlvbiIsImNvbXBhbnlfaWQiLCJjb21wYW55X2lkcyIsInVzZXIiLCJmdWxsbmFtZSIsImdldFJlbGF0aXZlVXJsIiwidXJsIiwiaXNGdW5jdGlvbiIsImlzQ29yZG92YSIsInN0YXJ0c1dpdGgiLCJ0ZXN0IiwiX19tZXRlb3JfcnVudGltZV9jb25maWdfXyIsIlJPT1RfVVJMX1BBVEhfUFJFRklYIiwiZ2V0VXNlckNvbXBhbnlJZCIsImdldFVzZXJDb21wYW55SWRzIiwicHJvY2Vzc1Blcm1pc3Npb25zIiwicG8iLCJhbGxvd0NyZWF0ZSIsImFsbG93UmVhZCIsImFsbG93RWRpdCIsImFsbG93RGVsZXRlIiwidmlld0FsbFJlY29yZHMiLCJ2aWV3Q29tcGFueVJlY29yZHMiLCJtb2RpZnlDb21wYW55UmVjb3JkcyIsImdldFRlbXBsYXRlU3BhY2VJZCIsInNldHRpbmdzIiwidGVtcGxhdGVTcGFjZUlkIiwiZ2V0Q2xvdWRBZG1pblNwYWNlSWQiLCJjbG91ZEFkbWluU3BhY2VJZCIsImlzVGVtcGxhdGVTcGFjZSIsImlzQ2xvdWRBZG1pblNwYWNlIiwicHJvY2VzcyIsImVudiIsIlNURUVET1NfU1RPUkFHRV9ESVIiLCJzdGVlZG9zU3RvcmFnZURpciIsInJlc29sdmUiLCJqb2luIiwiX19tZXRlb3JfYm9vdHN0cmFwX18iLCJzZXJ2ZXJEaXIiLCJtZXRob2RzIiwiY29sbGVjdGlvbiIsIm5hbWVfZmllbGRfa2V5Iiwib3B0aW9uc19saW1pdCIsInF1ZXJ5IiwicXVlcnlfb3B0aW9ucyIsInJlY29yZHMiLCJyZXN1bHRzIiwic2VhcmNoVGV4dFF1ZXJ5Iiwic2VsZWN0ZWQiLCJzb3J0IiwicGFyYW1zIiwiTkFNRV9GSUVMRF9LRVkiLCJzZWFyY2hUZXh0IiwiJHJlZ2V4IiwiJG9yIiwiJGluIiwiZXh0ZW5kIiwiJG5pbiIsImZpbHRlclF1ZXJ5IiwibGltaXQiLCJmaW5kIiwiZmV0Y2giLCJyZWNvcmQiLCJsYWJlbCIsIm1lc3NhZ2UiLCJKU09OIiwic3RyaW5naWZ5IiwiSnNvblJvdXRlcyIsImFkZCIsInJlcSIsInJlcyIsIm5leHQiLCJib3giLCJjdXJyZW50X3VzZXJfaWQiLCJjdXJyZW50X3VzZXJfaW5mbyIsImZsb3dJZCIsImhhc2hEYXRhIiwiaW5zIiwiaW5zSWQiLCJyZWNvcmRfaWQiLCJyZWRpcmVjdF91cmwiLCJyZWYyIiwicmVmMyIsInJlZjQiLCJ3b3JrZmxvd1VybCIsInhfYXV0aF90b2tlbiIsInhfdXNlcl9pZCIsInV1Zmxvd01hbmFnZXIiLCJjaGVja19hdXRob3JpemF0aW9uIiwiYm9keSIsImNoZWNrIiwiaW5zdGFuY2VJZCIsImZsb3ciLCJpbmJveF91c2VycyIsImluY2x1ZGVzIiwiY2NfdXNlcnMiLCJvdXRib3hfdXNlcnMiLCJzdGF0ZSIsInN1Ym1pdHRlciIsImFwcGxpY2FudCIsInBlcm1pc3Npb25NYW5hZ2VyIiwiZ2V0Rmxvd1Blcm1pc3Npb25zIiwic3BhY2VzIiwid2Vic2VydmljZXMiLCJ3b3JrZmxvdyIsInNlbmRSZXN1bHQiLCJjb2RlIiwiZGF0YSIsInVwZGF0ZSIsIiR1bnNldCIsImVycm9ycyIsImVycm9yTWVzc2FnZSIsInJlYXNvbiIsImdldEluaXRXaWR0aFBlcmNlbnQiLCJjb2x1bW5zIiwiX3NjaGVtYSIsImNvbHVtbl9udW0iLCJpbml0X3dpZHRoX3BlcmNlbnQiLCJnZXRTY2hlbWEiLCJmaWVsZF9uYW1lIiwiZmllbGQiLCJpc193aWRlIiwicGljayIsImF1dG9mb3JtIiwiZ2V0RmllbGRJc1dpZGUiLCJnZXRUYWJ1bGFyT3JkZXIiLCJsaXN0X3ZpZXdfaWQiLCJzZXR0aW5nIiwibWFwIiwiY29sdW1uIiwiaGlkZGVuIiwiY29tcGFjdCIsIm9yZGVyIiwiaW5kZXgiLCJkZWZhdWx0X2V4dHJhX2NvbHVtbnMiLCJleHRyYV9jb2x1bW5zIiwiZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMiLCJnZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zIiwidW5pb24iLCJnZXRPYmplY3REZWZhdWx0U29ydCIsIlRhYnVsYXJTZWxlY3RlZElkcyIsImNvbnZlcnRMaXN0VmlldyIsImRlZmF1bHRfdmlldyIsImxpc3RfdmlldyIsImxpc3Rfdmlld19uYW1lIiwiZGVmYXVsdF9jb2x1bW5zIiwiZGVmYXVsdF9tb2JpbGVfY29sdW1ucyIsIm9pdGVtIiwibW9iaWxlX2NvbHVtbnMiLCJoYXMiLCJpbmNsdWRlIiwiZmlsdGVyX3Njb3BlIiwicGFyc2UiLCJmb3JFYWNoIiwiX3ZhbHVlIiwiZ2V0UmVsYXRlZExpc3QiLCJsaXN0IiwibWFwTGlzdCIsInJlbGF0ZWRMaXN0TmFtZXMiLCJyZWxhdGVkTGlzdE9iamVjdHMiLCJyZWxhdGVkX29iamVjdF9uYW1lcyIsInVucmVsYXRlZF9vYmplY3RzIiwib2JqT3JOYW1lIiwicmVsYXRlZCIsImlzX2ZpbGUiLCJjdXN0b21SZWxhdGVkTGlzdE9iamVjdCIsImFjdGlvbnMiLCJnZXRSZWxhdGVkT2JqZWN0cyIsInJlbGF0ZWRfb2JqZWN0X2l0ZW0iLCJyZWxhdGVkT2JqZWN0IiwidGFidWxhcl9vcmRlciIsIndpdGhvdXQiLCJ0cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyIiwicmVwbGFjZSIsInBsdWNrIiwiZGlmZmVyZW5jZSIsInYiLCJpc0FjdGl2ZSIsIml0ZW0iLCJhbGxvd19yZWxhdGVkTGlzdCIsImdldE9iamVjdEZpcnN0TGlzdFZpZXciLCJmaXJzdCIsImdldExpc3RWaWV3cyIsImdldExpc3RWaWV3IiwiZXhhYyIsImxpc3RWaWV3cyIsImdldExpc3RWaWV3SXNSZWNlbnQiLCJsaXN0VmlldyIsInBpY2tPYmplY3RNb2JpbGVDb2x1bW5zIiwiY291bnQiLCJnZXRGaWVsZCIsImlzTmFtZUNvbHVtbiIsIml0ZW1Db3VudCIsIm1heENvdW50IiwibWF4Um93cyIsIm5hbWVDb2x1bW4iLCJuYW1lS2V5IiwicmVzdWx0IiwiZ2V0T2JqZWN0RGVmYXVsdFZpZXciLCJkZWZhdWx0VmlldyIsInVzZV9tb2JpbGVfY29sdW1ucyIsImlzQWxsVmlldyIsImlzUmVjZW50VmlldyIsInRhYnVsYXJDb2x1bW5zIiwidGFidWxhcl9zb3J0IiwiY29sdW1uX2luZGV4IiwidHJhbnNmb3JtU29ydFRvRFgiLCJkeF9zb3J0IiwiUmVnRXgiLCJSZWdFeHAiLCJfcmVnRXhNZXNzYWdlcyIsIl9nbG9iYWxNZXNzYWdlcyIsInJlZ0V4IiwiZXhwIiwibXNnIiwibWVzc2FnZXMiLCJldmFsSW5Db250ZXh0IiwianMiLCJldmFsIiwiY2FsbCIsImNvbnZlcnRGaWVsZCIsImdldE9wdGlvbiIsIm9wdGlvbiIsImZvbyIsInNwbGl0IiwiY29sb3IiLCJhbGxPcHRpb25zIiwicGlja2xpc3QiLCJwaWNrbGlzdE9wdGlvbnMiLCJnZXRQaWNrbGlzdCIsImdldFBpY2tMaXN0T3B0aW9ucyIsInJldmVyc2UiLCJlbmFibGUiLCJkZWZhdWx0VmFsdWUiLCJ0cmlnZ2VycyIsInRyaWdnZXIiLCJfdG9kbyIsIl90b2RvX2Zyb21fY29kZSIsIl90b2RvX2Zyb21fZGIiLCJvbiIsInRvZG8iLCJfdmlzaWJsZSIsImVycm9yMSIsImFjdGlvbnNCeU5hbWUiLCJ2aXNpYmxlIiwiX29wdGlvbnMiLCJfdHlwZSIsImJlZm9yZU9wZW5GdW5jdGlvbiIsImlzX2NvbXBhbnlfbGltaXRlZCIsIm1heCIsIm1pbiIsIl9vcHRpb24iLCJrIiwiX3JlZ0V4IiwiX21pbiIsIl9tYXgiLCJOdW1iZXIiLCJCb29sZWFuIiwiX29wdGlvbnNGdW5jdGlvbiIsIl9yZWZlcmVuY2VfdG8iLCJfY3JlYXRlRnVuY3Rpb24iLCJfYmVmb3JlT3BlbkZ1bmN0aW9uIiwiX2ZpbHRlcnNGdW5jdGlvbiIsIl9kZWZhdWx0VmFsdWUiLCJfaXNfY29tcGFueV9saW1pdGVkIiwiX2ZpbHRlcnMiLCJpc0RhdGUiLCJwb3AiLCJfaXNfZGF0ZSIsImZvcm0iLCJ2YWwiLCJyZWxhdGVkT2JqSW5mbyIsIlBSRUZJWCIsIl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYSIsInByZWZpeCIsImZpZWxkVmFyaWFibGUiLCJyZWciLCJyZXYiLCJtIiwiJDEiLCJmb3JtdWxhX3N0ciIsIl9DT05URVhUIiwiX1ZBTFVFUyIsImlzQm9vbGVhbiIsInRvYXN0ciIsImZvcm1hdE9iamVjdE5hbWUiLCJfYmFzZU9iamVjdCIsIl9kYiIsImRlZmF1bHRMaXN0Vmlld0lkIiwiZGlzYWJsZWRfbGlzdF92aWV3cyIsInNjaGVtYSIsInNlbGYiLCJiYXNlT2JqZWN0IiwicGVybWlzc2lvbl9zZXQiLCJpY29uIiwiZGVzY3JpcHRpb24iLCJpc192aWV3IiwiaXNfZW5hYmxlIiwiYWxsb3dfYWN0aW9ucyIsImVuYWJsZV9zZWFyY2giLCJwYWdpbmciLCJlbmFibGVfYXBpIiwiY3VzdG9tIiwiZW5hYmxlX3NoYXJlIiwiZW5hYmxlX3RyZWUiLCJzaWRlYmFyIiwib3Blbl93aW5kb3ciLCJmaWx0ZXJfY29tcGFueSIsImNhbGVuZGFyIiwiZW5hYmxlX2NoYXR0ZXIiLCJlbmFibGVfdHJhc2giLCJlbmFibGVfc3BhY2VfZ2xvYmFsIiwiZW5hYmxlX2ZvbGxvdyIsImVuYWJsZV93b3JrZmxvdyIsImVuYWJsZV9pbmxpbmVfZWRpdCIsImluX2RldmVsb3BtZW50IiwiaWRGaWVsZE5hbWUiLCJkYXRhYmFzZV9uYW1lIiwiaXNfbmFtZSIsInByaW1hcnkiLCJmaWx0ZXJhYmxlIiwicmVhZG9ubHkiLCJpdGVtX25hbWUiLCJjb3B5SXRlbSIsImFkbWluIiwiYWxsIiwibGlzdF92aWV3X2l0ZW0iLCJSZWFjdGl2ZVZhciIsImNyZWF0ZUNvbGxlY3Rpb24iLCJfbmFtZSIsImdldE9iamVjdFNjaGVtYSIsImNvbnRhaW5zIiwiYXR0YWNoU2NoZW1hIiwiX3NpbXBsZVNjaGVtYSIsImdldE9iamVjdE9EYXRhUm91dGVyUHJlZml4IiwiYm9vdHN0cmFwTG9hZGVkIiwiZmllbGRzQXJyIiwiX3JlZl9vYmoiLCJhdXRvZm9ybV90eXBlIiwiZnMiLCJpc1VuTGltaXRlZCIsIm11bHRpcGxlIiwicm93cyIsImxhbmd1YWdlIiwiaXNNb2JpbGUiLCJpc1BhZCIsImFmRmllbGRJbnB1dCIsImRhdGVNb2JpbGVPcHRpb25zIiwib3V0Rm9ybWF0IiwidGltZXpvbmVJZCIsImR4RGF0ZUJveE9wdGlvbnMiLCJkaXNwbGF5Rm9ybWF0IiwiaGVpZ2h0IiwiZGlhbG9nc0luQm9keSIsInRvb2xiYXIiLCJmb250TmFtZXMiLCJsYW5nIiwic2hvd0ljb24iLCJkZXBlbmRPbiIsImRlcGVuZF9vbiIsImNyZWF0ZSIsImxvb2t1cF9maWVsZCIsIk1vZGFsIiwic2hvdyIsImZvcm1JZCIsIm9wZXJhdGlvbiIsIm9uU3VjY2VzcyIsImFkZEl0ZW1zIiwicmVmZXJlbmNlX3NvcnQiLCJvcHRpb25zU29ydCIsInJlZmVyZW5jZV9saW1pdCIsIm9wdGlvbnNMaW1pdCIsIm9taXQiLCJibGFja2JveCIsIm9iamVjdFN3aXRjaGUiLCJvcHRpb25zTWV0aG9kIiwib3B0aW9uc01ldGhvZFBhcmFtcyIsInJlZmVyZW5jZXMiLCJfcmVmZXJlbmNlIiwibGluayIsImRlZmF1bHRJY29uIiwiZmlyc3RPcHRpb24iLCJwcmVjaXNpb24iLCJzY2FsZSIsImRlY2ltYWwiLCJkaXNhYmxlZCIsIkFycmF5IiwiZWRpdGFibGUiLCJhY2NlcHQiLCJzeXN0ZW0iLCJFbWFpbCIsImFzc2lnbiIsImRhdGFfdHlwZSIsInJlcXVpcmVkIiwib3B0aW9uYWwiLCJ1bmlxdWUiLCJncm91cCIsInNlYXJjaGFibGUiLCJub3ciLCJpbmxpbmVIZWxwVGV4dCIsImlzUHJvZHVjdGlvbiIsInNvcnRhYmxlIiwiZ2V0RmllbGREaXNwbGF5VmFsdWUiLCJmaWVsZF92YWx1ZSIsImh0bWwiLCJtb21lbnQiLCJmb3JtYXQiLCJjaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkiLCJmaWVsZF90eXBlIiwicHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzIiwib3BlcmF0aW9ucyIsImJ1aWx0aW5WYWx1ZXMiLCJnZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyIsImJ1aWx0aW5JdGVtIiwiaXNfY2hlY2tfb25seSIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyIsImdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtIiwiZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtIiwiZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24iLCJiZXR3ZWVuQnVpbHRpblZhbHVlcyIsImdldFF1YXJ0ZXJTdGFydE1vbnRoIiwibW9udGgiLCJnZXRNb250aCIsImdldExhc3RRdWFydGVyRmlyc3REYXkiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJnZXROZXh0UXVhcnRlckZpcnN0RGF5IiwiZ2V0TW9udGhEYXlzIiwiZGF5cyIsImVuZERhdGUiLCJtaWxsaXNlY29uZCIsInN0YXJ0RGF0ZSIsImdldExhc3RNb250aEZpcnN0RGF5IiwiY3VycmVudE1vbnRoIiwiY3VycmVudFllYXIiLCJlbmRWYWx1ZSIsImZpcnN0RGF5IiwibGFzdERheSIsImxhc3RNb25kYXkiLCJsYXN0TW9udGhGaW5hbERheSIsImxhc3RNb250aEZpcnN0RGF5IiwibGFzdFF1YXJ0ZXJFbmREYXkiLCJsYXN0UXVhcnRlclN0YXJ0RGF5IiwibGFzdFN1bmRheSIsImxhc3RfMTIwX2RheXMiLCJsYXN0XzMwX2RheXMiLCJsYXN0XzYwX2RheXMiLCJsYXN0XzdfZGF5cyIsImxhc3RfOTBfZGF5cyIsIm1pbnVzRGF5IiwibW9uZGF5IiwibmV4dE1vbmRheSIsIm5leHRNb250aEZpbmFsRGF5IiwibmV4dE1vbnRoRmlyc3REYXkiLCJuZXh0UXVhcnRlckVuZERheSIsIm5leHRRdWFydGVyU3RhcnREYXkiLCJuZXh0U3VuZGF5IiwibmV4dFllYXIiLCJuZXh0XzEyMF9kYXlzIiwibmV4dF8zMF9kYXlzIiwibmV4dF82MF9kYXlzIiwibmV4dF83X2RheXMiLCJuZXh0XzkwX2RheXMiLCJwcmV2aW91c1llYXIiLCJzdGFydFZhbHVlIiwic3RyRW5kRGF5Iiwic3RyRmlyc3REYXkiLCJzdHJMYXN0RGF5Iiwic3RyTW9uZGF5Iiwic3RyU3RhcnREYXkiLCJzdHJTdW5kYXkiLCJzdHJUb2RheSIsInN0clRvbW9ycm93Iiwic3RyWWVzdGRheSIsInN1bmRheSIsInRoaXNRdWFydGVyRW5kRGF5IiwidGhpc1F1YXJ0ZXJTdGFydERheSIsInRvbW9ycm93Iiwid2VlayIsInllc3RkYXkiLCJnZXREYXkiLCJ0IiwiZnYiLCJzZXRIb3VycyIsImdldEhvdXJzIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJnZXRGaWVsZERlZmF1bHRPcGVyYXRpb24iLCJnZXRGaWVsZE9wZXJhdGlvbiIsIm9wdGlvbmFscyIsImVxdWFsIiwidW5lcXVhbCIsImxlc3NfdGhhbiIsImdyZWF0ZXJfdGhhbiIsImxlc3Nfb3JfZXF1YWwiLCJncmVhdGVyX29yX2VxdWFsIiwibm90X2NvbnRhaW4iLCJzdGFydHNfd2l0aCIsImJldHdlZW4iLCJnZXRPYmplY3RGaWVsZHNOYW1lIiwiZmllbGRzTmFtZSIsInNvcnRfbm8iLCJjbGVhblRyaWdnZXIiLCJpbml0VHJpZ2dlciIsIl90cmlnZ2VyX2hvb2tzIiwicmVmNSIsInRvZG9XcmFwcGVyIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJ3aGVuIiwiYmVmb3JlIiwiaW5zZXJ0IiwicmVtb3ZlIiwiYWZ0ZXIiLCJfaG9vayIsInRyaWdnZXJfbmFtZSIsIl90cmlnZ2VyX2hvb2siLCJmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0IiwiZmluZF9wZXJtaXNzaW9uX29iamVjdCIsImludGVyc2VjdGlvblBsdXMiLCJ1bmlvblBlcm1pc3Npb25PYmplY3RzIiwidW5pb25QbHVzIiwiZ2V0T2JqZWN0UGVybWlzc2lvbnMiLCJnZXRSZWNvcmRQZXJtaXNzaW9ucyIsImlzT3duZXIiLCJvYmplY3RfZmllbGRzX2tleXMiLCJyZWNvcmRfY29tcGFueV9pZCIsInJlY29yZF9jb21wYW55X2lkcyIsInNlbGVjdCIsInVzZXJfY29tcGFueV9pZHMiLCJwYXJlbnQiLCJrZXlzIiwiaW50ZXJzZWN0aW9uIiwiZ2V0T2JqZWN0UmVjb3JkIiwicmVjb3JkX3Blcm1pc3Npb25zIiwib3duZXIiLCJuIiwibG9ja2VkIiwiZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyIsImN1cnJlbnRPYmplY3ROYW1lIiwicmVsYXRlZExpc3RJdGVtIiwiY3VycmVudFJlY29yZCIsImlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSIsIm1hc3RlckFsbG93IiwibWFzdGVyUmVjb3JkUGVybSIsInJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyIsInVuZWRpdGFibGVfcmVsYXRlZF9saXN0IiwiZ2V0UmVjb3JkU2FmZVJlbGF0ZWRMaXN0IiwiZ2V0QWxsUGVybWlzc2lvbnMiLCJfaSIsInBzZXRzIiwicHNldHNBZG1pbiIsInBzZXRzQWRtaW5fcG9zIiwicHNldHNDdXJyZW50IiwicHNldHNDdXJyZW50TmFtZXMiLCJwc2V0c0N1cnJlbnRfcG9zIiwicHNldHNDdXN0b21lciIsInBzZXRzQ3VzdG9tZXJfcG9zIiwicHNldHNHdWVzdCIsInBzZXRzR3Vlc3RfcG9zIiwicHNldHNNZW1iZXIiLCJwc2V0c01lbWJlcl9wb3MiLCJwc2V0c1N1cHBsaWVyIiwicHNldHNTdXBwbGllcl9wb3MiLCJwc2V0c1VzZXIiLCJwc2V0c1VzZXJfcG9zIiwic2V0X2lkcyIsInNwYWNlVXNlciIsIm9iamVjdHMiLCJhc3NpZ25lZF9hcHBzIiwicHJvZmlsZSIsInVzZXJzIiwicGVybWlzc2lvbl9zZXRfaWQiLCJjcmVhdGVkIiwibW9kaWZpZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWRfYnkiLCJnZXRBc3NpZ25lZEFwcHMiLCJiaW5kIiwiYXNzaWduZWRfbWVudXMiLCJnZXRBc3NpZ25lZE1lbnVzIiwidXNlcl9wZXJtaXNzaW9uX3NldHMiLCJhcnJheSIsIm90aGVyIiwiYXBwcyIsInBzZXRCYXNlIiwidXNlclByb2ZpbGUiLCJwc2V0IiwidW5pcSIsImFib3V0TWVudSIsImFkbWluTWVudXMiLCJhbGxNZW51cyIsImN1cnJlbnRQc2V0TmFtZXMiLCJtZW51cyIsIm90aGVyTWVudUFwcHMiLCJvdGhlck1lbnVzIiwiYWRtaW5fbWVudXMiLCJmbGF0dGVuIiwibWVudSIsInBzZXRzTWVudSIsInBlcm1pc3Npb25fc2V0cyIsInBlcm1pc3Npb25fb2JqZWN0cyIsImlzTnVsbCIsInBlcm1pc3Npb25fc2V0X2lkcyIsInBvcyIsIm9wcyIsIm9wc19rZXkiLCJjdXJyZW50UHNldCIsInRlbXBPcHMiLCJyZXBlYXRJbmRleCIsInJlcGVhdFBvIiwib3BzZXRBZG1pbiIsIm9wc2V0Q3VzdG9tZXIiLCJvcHNldEd1ZXN0Iiwib3BzZXRNZW1iZXIiLCJvcHNldFN1cHBsaWVyIiwib3BzZXRVc2VyIiwicG9zQWRtaW4iLCJwb3NDdXN0b21lciIsInBvc0d1ZXN0IiwicG9zTWVtYmVyIiwicG9zU3VwcGxpZXIiLCJwb3NVc2VyIiwicHJvZiIsImd1ZXN0IiwibWVtYmVyIiwic3VwcGxpZXIiLCJjdXN0b21lciIsImRpc2FibGVkX2FjdGlvbnMiLCJ1bnJlYWRhYmxlX2ZpZWxkcyIsInVuZWRpdGFibGVfZmllbGRzIiwiY3JlYXRvcl9kYl91cmwiLCJvcGxvZ191cmwiLCJNT05HT19VUkxfQ1JFQVRPUiIsIk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SIiwiX0NSRUFUT1JfREFUQVNPVVJDRSIsIl9kcml2ZXIiLCJNb25nb0ludGVybmFscyIsIlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIiLCJvcGxvZ1VybCIsImNvbGxlY3Rpb25fa2V5IiwibmV3Q29sbGVjdGlvbiIsIlNNU1F1ZXVlIiwiYWN0aW9uX25hbWUiLCJleGVjdXRlQWN0aW9uIiwiaXRlbV9lbGVtZW50IiwibW9yZUFyZ3MiLCJ0b2RvQXJncyIsIm9kYXRhIiwicHJvdG90eXBlIiwic2xpY2UiLCJjb25jYXQiLCJ3YXJuaW5nIiwic2V0IiwiRm9ybU1hbmFnZXIiLCJnZXRJbml0aWFsVmFsdWVzIiwiZGVmZXIiLCIkIiwiY2xpY2siLCJocmVmIiwiZ2V0T2JqZWN0VXJsIiwiRmxvd1JvdXRlciIsInJlZGlyZWN0IiwicmVjb3JkX3RpdGxlIiwiY2FsbF9iYWNrIiwiYmVmb3JlSG9vayIsInRleHQiLCJydW5Ib29rIiwic3dhbCIsInRpdGxlIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNvbmZpcm1CdXR0b25UZXh0IiwiY2FuY2VsQnV0dG9uVGV4dCIsInByZXZpb3VzRG9jIiwiZ2V0UHJldmlvdXNEb2MiLCJhcHBpZCIsImR4RGF0YUdyaWRJbnN0YW5jZSIsImdyaWRDb250YWluZXIiLCJncmlkT2JqZWN0TmFtZUNsYXNzIiwiaW5mbyIsImlzT3BlbmVyUmVtb3ZlIiwicmVjb3JkVXJsIiwidGVtcE5hdlJlbW92ZWQiLCJzdWNjZXNzIiwid2luZG93Iiwib3BlbmVyIiwiZHhUcmVlTGlzdCIsImR4RGF0YUdyaWQiLCJyZWZyZXNoIiwicmVsb2FkIiwiVGVtcGxhdGUiLCJjcmVhdG9yX2dyaWQiLCJyZW1vdmVUZW1wTmF2SXRlbSIsImNsb3NlIiwiZ28iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxLQUFDQSxFQUFELEdBQU0sRUFBTjs7QUFDQSxJQUFJLE9BQUFDLE9BQUEsb0JBQUFBLFlBQUEsSUFBSjtBQUNDLE9BQUNBLE9BQUQsR0FBVyxFQUFYO0FDRUE7O0FERERBLFFBQVFDLE9BQVIsR0FBa0IsRUFBbEI7QUFDQUQsUUFBUUUsV0FBUixHQUFzQixFQUF0QjtBQUNBRixRQUFRRyxLQUFSLEdBQWdCLEVBQWhCO0FBQ0FILFFBQVFJLElBQVIsR0FBZSxFQUFmO0FBQ0FKLFFBQVFLLFVBQVIsR0FBcUIsRUFBckI7QUFDQUwsUUFB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SSx1QkFBT1MsS0FBUDtBQURELHFCQUVLLElBQUdybUIsY0FBYWxMLFFBQVFDLEdBQVIsQ0FBWSxXQUFaLENBQWIsSUFBMENnTyxpQkFBZ0IsVUFBN0Q7QUFDSm9pQix3QkFBUXJ3QixRQUFRQyxHQUFSLENBQVksUUFBWixDQUFSOztBQUNBLHFCQUFPZ08sWUFBUDtBQUNDQSxpQ0FBZWpPLFFBQVFDLEdBQVIsQ0FBWSxjQUFaLENBQWY7QUNnQk87O0FEZlIscUJBQU9nTyxZQUFQO0FBQ0NBLGlDQUFlLEtBQWY7QUNpQk87O0FEaEJSLHFCQUFPMmlCLGNBQVA7QUFFQ3JCLDZCQUFXaUMsRUFBWCxDQUFjLFVBQVFuQixLQUFSLEdBQWMsR0FBZCxHQUFpQjF4QixXQUFqQixHQUE2QixRQUE3QixHQUFxQ3NQLFlBQW5EO0FBUkc7QUFITjtBQzhCTTs7QURsQk4sZ0JBQUd5aEIsYUFBYyxPQUFPQSxTQUFQLEtBQW9CLFVBQXJDO0FBQ0NBO0FDb0JLOztBQUNELG1CRG5CTFYsWUFBWWEsT0FBWixDQUFvQmx4QixXQUFwQixFQUFpQyxRQUFqQyxFQUEyQyxPQUEzQyxFQUFvRDtBQUFDMkIsbUJBQUs0SyxTQUFOO0FBQWlCaWxCLDJCQUFhQTtBQUE5QixhQUFwRCxDQ21CSztBRC9ETixhQTZDRSxVQUFDL3lCLEtBQUQ7QUN1QkksbUJEdEJMNHhCLFlBQVlhLE9BQVosQ0FBb0JseEIsV0FBcEIsRUFBaUMsUUFBakMsRUFBMkMsT0FBM0MsRUFBb0Q7QUFBQzJCLG1CQUFLNEssU0FBTjtBQUFpQjlOLHFCQUFPQTtBQUF4QixhQUFwRCxDQ3NCSztBRHBFTixZQ1FJO0FBaUVEO0FEbkZOLFFDT0c7QURqRUo7QUFBQSxHQUZEO0FDbUpBLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIkBkYiA9IHt9XHJcbmlmICFDcmVhdG9yP1xyXG5cdEBDcmVhdG9yID0ge31cclxuQ3JlYXRvci5PYmplY3RzID0ge31cclxuQ3JlYXRvci5Db2xsZWN0aW9ucyA9IHt9XHJcbkNyZWF0b3IuTWVudXMgPSBbXVxyXG5DcmVhdG9yLkFwcHMgPSB7fVxyXG5DcmVhdG9yLkRhc2hib2FyZHMgPSB7fVxyXG5DcmVhdG9yLlJlcG9ydHMgPSB7fVxyXG5DcmVhdG9yLnN1YnMgPSB7fVxyXG5DcmVhdG9yLnN0ZWVkb3NTY2hlbWEgPSB7fSIsInRoaXMuZGIgPSB7fTtcblxuaWYgKHR5cGVvZiBDcmVhdG9yID09PSBcInVuZGVmaW5lZFwiIHx8IENyZWF0b3IgPT09IG51bGwpIHtcbiAgdGhpcy5DcmVhdG9yID0ge307XG59XG5cbkNyZWF0b3IuT2JqZWN0cyA9IHt9O1xuXG5DcmVhdG9yLkNvbGxlY3Rpb25zID0ge307XG5cbkNyZWF0b3IuTWVudXMgPSBbXTtcblxuQ3JlYXRvci5BcHBzID0ge307XG5cbkNyZWF0b3IuRGFzaGJvYXJkcyA9IHt9O1xuXG5DcmVhdG9yLlJlcG9ydHMgPSB7fTtcblxuQ3JlYXRvci5zdWJzID0ge307XG5cbkNyZWF0b3Iuc3RlZWRvc1NjaGVtYSA9IHt9O1xuIiwidHJ5XHJcblx0aWYgTWV0ZW9yLmlzRGV2ZWxvcG1lbnRcclxuXHRcdHN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpXHJcblx0XHRvYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJylcclxuXHRcdE1ldGVvci5zdGFydHVwIC0+XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdG9iamVjdHFsLndyYXBBc3luYyhzdGVlZG9zQ29yZS5pbml0KVxyXG5cdFx0XHRjYXRjaCBleFxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIixleClcclxuY2F0Y2ggZVxyXG5cdGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIixlKSIsInZhciBlLCBvYmplY3RxbCwgc3RlZWRvc0NvcmU7XG5cbnRyeSB7XG4gIGlmIChNZXRlb3IuaXNEZXZlbG9wbWVudCkge1xuICAgIHN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpO1xuICAgIG9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcbiAgICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBleDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBvYmplY3RxbC53cmFwQXN5bmMoc3RlZWRvc0NvcmUuaW5pdCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBleCA9IGVycm9yO1xuICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImVycm9yOlwiLCBleCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0gY2F0Y2ggKGVycm9yKSB7XG4gIGUgPSBlcnJvcjtcbiAgY29uc29sZS5lcnJvcihcImVycm9yOlwiLCBlKTtcbn1cbiIsIkNyZWF0b3IuZGVwcyA9IHtcclxuXHRhcHA6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3lcclxuXHRvYmplY3Q6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3lcclxufTtcclxuXHJcbkNyZWF0b3IuX1RFTVBMQVRFID0ge1xyXG5cdEFwcHM6IHt9LFxyXG5cdE9iamVjdHM6IHt9XHJcbn1cclxuXHJcbk1ldGVvci5zdGFydHVwIC0+XHJcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2ZpbHRlcnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpfSlcclxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7b3B0aW9uc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxyXG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtjcmVhdGVGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpfSlcclxuXHJcbiMgQ3JlYXRvci5maWJlckxvYWRPYmplY3RzIOS+m3N0ZWVkb3MtY2xp6aG555uu5L2/55SoXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdEZpYmVyID0gcmVxdWlyZSgnZmliZXJzJylcclxuXHRDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxyXG5cdFx0RmliZXIoKCktPlxyXG5cdFx0XHRDcmVhdG9yLmxvYWRPYmplY3RzKG9iaiwgb2JqZWN0X25hbWUpXHJcblx0XHQpLnJ1bigpXHJcblxyXG5DcmVhdG9yLmxvYWRPYmplY3RzID0gKG9iaiwgb2JqZWN0X25hbWUpLT5cclxuXHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdG9iamVjdF9uYW1lID0gb2JqLm5hbWVcclxuXHJcblx0aWYgIW9iai5saXN0X3ZpZXdzXHJcblx0XHRvYmoubGlzdF92aWV3cyA9IHt9XHJcblxyXG5cdGlmIG9iai5zcGFjZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iailcclxuXHRpZiBvYmplY3RfbmFtZSA9PSAnY2ZzX2ZpbGVzX2ZpbGVyZWNvcmQnXHJcblx0XHRvYmplY3RfbmFtZSA9ICdjZnMuZmlsZXMuZmlsZXJlY29yZCdcclxuXHRcdG9iaiA9IF8uY2xvbmUob2JqKVxyXG5cdFx0b2JqLm5hbWUgPSBvYmplY3RfbmFtZVxyXG5cdFx0Q3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSA9IG9ialxyXG5cclxuXHRDcmVhdG9yLmNvbnZlcnRPYmplY3Qob2JqKVxyXG5cdG5ldyBDcmVhdG9yLk9iamVjdChvYmopO1xyXG5cclxuXHRDcmVhdG9yLmluaXRUcmlnZ2VycyhvYmplY3RfbmFtZSlcclxuXHRDcmVhdG9yLmluaXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpXHJcblx0cmV0dXJuIG9ialxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3ROYW1lID0gKG9iamVjdCkgLT5cclxuXHRpZiBvYmplY3Quc3BhY2VcclxuXHRcdHJldHVybiBcImNfI3tvYmplY3Quc3BhY2V9XyN7b2JqZWN0Lm5hbWV9XCJcclxuXHRyZXR1cm4gb2JqZWN0Lm5hbWVcclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0ID0gKG9iamVjdF9uYW1lLCBzcGFjZV9pZCktPlxyXG5cdGlmIF8uaXNBcnJheShvYmplY3RfbmFtZSlcclxuXHRcdHJldHVybiA7XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRDcmVhdG9yLmRlcHM/Lm9iamVjdD8uZGVwZW5kKClcclxuXHRpZiAhb2JqZWN0X25hbWUgYW5kIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG4jXHRpZiAhc3BhY2VfaWQgJiYgb2JqZWN0X25hbWVcclxuI1x0XHRpZiBNZXRlb3IuaXNDbGllbnQgJiYgIW9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2NfJylcclxuI1x0XHRcdHNwYWNlX2lkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXHJcblxyXG5cdGlmIG9iamVjdF9uYW1lXHJcbiNcdFx0aWYgc3BhY2VfaWRcclxuI1x0XHRcdG9iaiA9IENyZWF0b3Iub2JqZWN0c0J5TmFtZVtcImNfI3tzcGFjZV9pZH1fI3tvYmplY3RfbmFtZX1cIl1cclxuI1x0XHRcdGlmIG9ialxyXG4jXHRcdFx0XHRyZXR1cm4gb2JqXHJcbiNcclxuI1x0XHRvYmogPSBfLmZpbmQgQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAobyktPlxyXG4jXHRcdFx0XHRyZXR1cm4gby5fY29sbGVjdGlvbl9uYW1lID09IG9iamVjdF9uYW1lXHJcbiNcdFx0aWYgb2JqXHJcbiNcdFx0XHRyZXR1cm4gb2JqXHJcblxyXG5cdFx0cmV0dXJuIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV1cclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0QnlJZCA9IChvYmplY3RfaWQpLT5cclxuXHRyZXR1cm4gXy5maW5kV2hlcmUoQ3JlYXRvci5vYmplY3RzQnlOYW1lLCB7X2lkOiBvYmplY3RfaWR9KVxyXG5cclxuQ3JlYXRvci5yZW1vdmVPYmplY3QgPSAob2JqZWN0X25hbWUpLT5cclxuXHRjb25zb2xlLmxvZyhcInJlbW92ZU9iamVjdFwiLCBvYmplY3RfbmFtZSlcclxuXHRkZWxldGUgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxyXG5cdGRlbGV0ZSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdXHJcblxyXG5DcmVhdG9yLmdldENvbGxlY3Rpb24gPSAob2JqZWN0X25hbWUsIHNwYWNlSWQpLT5cclxuXHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cdGlmIG9iamVjdF9uYW1lXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk/Ll9jb2xsZWN0aW9uX25hbWVdXHJcblxyXG5DcmVhdG9yLnJlbW92ZUNvbGxlY3Rpb24gPSAob2JqZWN0X25hbWUpLT5cclxuXHRkZWxldGUgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV1cclxuXHJcbkNyZWF0b3IuaXNTcGFjZUFkbWluID0gKHNwYWNlSWQsIHVzZXJJZCktPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgIXNwYWNlSWRcclxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxyXG5cdFx0aWYgIXVzZXJJZFxyXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHJcblx0c3BhY2UgPSBDcmVhdG9yLmdldE9iamVjdChcInNwYWNlc1wiKT8uZGI/LmZpbmRPbmUoc3BhY2VJZCx7ZmllbGRzOnthZG1pbnM6MX19KVxyXG5cdGlmIHNwYWNlPy5hZG1pbnNcclxuXHRcdHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDBcclxuXHJcblxyXG5DcmVhdG9yLmV2YWx1YXRlRm9ybXVsYSA9IChmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucyktPlxyXG5cclxuXHRpZiAhXy5pc1N0cmluZyhmb3JtdWxhcilcclxuXHRcdHJldHVybiBmb3JtdWxhclxyXG5cclxuXHRpZiBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmb3JtdWxhcilcclxuXHRcdHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucylcclxuXHJcblx0cmV0dXJuIGZvcm11bGFyXHJcblxyXG5DcmVhdG9yLmV2YWx1YXRlRmlsdGVycyA9IChmaWx0ZXJzLCBjb250ZXh0KS0+XHJcblx0c2VsZWN0b3IgPSB7fVxyXG5cdF8uZWFjaCBmaWx0ZXJzLCAoZmlsdGVyKS0+XHJcblx0XHRpZiBmaWx0ZXI/Lmxlbmd0aCA9PSAzXHJcblx0XHRcdG5hbWUgPSBmaWx0ZXJbMF1cclxuXHRcdFx0YWN0aW9uID0gZmlsdGVyWzFdXHJcblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBjb250ZXh0KVxyXG5cdFx0XHRzZWxlY3RvcltuYW1lXSA9IHt9XHJcblx0XHRcdHNlbGVjdG9yW25hbWVdW2FjdGlvbl0gPSB2YWx1ZVxyXG5cdCMgY29uc29sZS5sb2coXCJldmFsdWF0ZUZpbHRlcnMtLT5zZWxlY3RvclwiLCBzZWxlY3RvcilcclxuXHRyZXR1cm4gc2VsZWN0b3JcclxuXHJcbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IChzcGFjZUlkKSAtPlxyXG5cdHJldHVybiBzcGFjZUlkID09ICdjb21tb24nXHJcblxyXG4jIyNcclxuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXHJcblx0aWRz77yaX2lk6ZuG5ZCIXHJcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcclxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXHJcbiMjI1xyXG5DcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyA9IChkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KS0+XHJcblxyXG5cdGlmICFpZF9rZXlcclxuXHRcdGlkX2tleSA9IFwiX2lkXCJcclxuXHJcblx0aWYgaGl0X2ZpcnN0XHJcblxyXG5cdFx0I+eUseS6juS4jeiDveS9v+eUqF8uZmluZEluZGV45Ye95pWw77yM5Zug5q2k5q2k5aSE5YWI5bCG5a+56LGh5pWw57uE6L2s5Li65pmu6YCa5pWw57uE57G75Z6L77yM5Zyo6I635Y+W5YW2aW5kZXhcclxuXHRcdHZhbHVlcyA9IGRvY3MuZ2V0UHJvcGVydHkoaWRfa2V5KVxyXG5cclxuXHRcdHJldHVyblx0Xy5zb3J0QnkgZG9jcywgKGRvYyktPlxyXG5cdFx0XHRcdFx0X2luZGV4ID0gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pXHJcblx0XHRcdFx0XHRpZiBfaW5kZXggPiAtMVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2luZGV4XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuXHRfLnNvcnRCeSBkb2NzLCAoZG9jKS0+XHJcblx0XHRcdHJldHVybiBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSlcclxuXHJcbiMjI1xyXG5cdOaMieeUqOaIt+aJgOWxnuacrOWcsOWMluivreiogOi/m+ihjOaOkuW6j++8jOaUr+aMgeS4reaWh+OAgeaVsOWAvOOAgeaXpeacn+etieWtl+auteaOkuW6j1xyXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xyXG4jIyNcclxuQ3JlYXRvci5zb3J0aW5nTWV0aG9kID0gKHZhbHVlMSwgdmFsdWUyKSAtPlxyXG5cdGlmIHRoaXMua2V5XHJcblx0XHR2YWx1ZTEgPSB2YWx1ZTFbdGhpcy5rZXldXHJcblx0XHR2YWx1ZTIgPSB2YWx1ZTJbdGhpcy5rZXldXHJcblx0aWYgdmFsdWUxIGluc3RhbmNlb2YgRGF0ZVxyXG5cdFx0dmFsdWUxID0gdmFsdWUxLmdldFRpbWUoKVxyXG5cdGlmIHZhbHVlMiBpbnN0YW5jZW9mIERhdGVcclxuXHRcdHZhbHVlMiA9IHZhbHVlMi5nZXRUaW1lKClcclxuXHRpZiB0eXBlb2YgdmFsdWUxIGlzIFwibnVtYmVyXCIgYW5kIHR5cGVvZiB2YWx1ZTIgaXMgXCJudW1iZXJcIlxyXG5cdFx0cmV0dXJuIHZhbHVlMSAtIHZhbHVlMlxyXG5cdCMgSGFuZGxpbmcgbnVsbCB2YWx1ZXNcclxuXHRpc1ZhbHVlMUVtcHR5ID0gdmFsdWUxID09IG51bGwgb3IgdmFsdWUxID09IHVuZGVmaW5lZFxyXG5cdGlzVmFsdWUyRW1wdHkgPSB2YWx1ZTIgPT0gbnVsbCBvciB2YWx1ZTIgPT0gdW5kZWZpbmVkXHJcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgIWlzVmFsdWUyRW1wdHlcclxuXHRcdHJldHVybiAtMVxyXG5cdGlmIGlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcclxuXHRcdHJldHVybiAwXHJcblx0aWYgIWlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcclxuXHRcdHJldHVybiAxXHJcblx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxyXG5cdHJldHVybiB2YWx1ZTEudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlIHZhbHVlMi50b1N0cmluZygpLCBsb2NhbGVcclxuXHJcblxyXG4jIOivpeWHveaVsOWPquWcqOWIneWni+WMlk9iamVjdOaXtu+8jOaKiuebuOWFs+WvueixoeeahOiuoeeul+e7k+aenOS/neWtmOWIsE9iamVjdOeahHJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4re+8jOWQjue7reWPr+S7peebtOaOpeS7jnJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4reWPluW+l+iuoeeul+e7k+aenOiAjOS4jeeUqOWGjeasoeiwg+eUqOivpeWHveaVsOadpeiuoeeul1xyXG5DcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzID0gKG9iamVjdF9uYW1lKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IFtdXHJcblx0IyBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0IyDlm6BDcmVhdG9yLmdldE9iamVjdOWHveaVsOWGhemDqOimgeiwg+eUqOivpeWHveaVsO+8jOaJgOS7pei/memHjOS4jeWPr+S7peiwg+eUqENyZWF0b3IuZ2V0T2JqZWN05Y+W5a+56LGh77yM5Y+q6IO96LCD55SoQ3JlYXRvci5PYmplY3Rz5p2l5Y+W5a+56LGhXHJcblx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cclxuXHRpZiAhX29iamVjdFxyXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xyXG5cdFxyXG5cdHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdFxyXG5cdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhXy5pc0VtcHR5IHJlbGF0ZWRMaXN0XHJcblx0XHRyZWxhdGVkTGlzdE1hcCA9IHt9XHJcblx0XHRfLmVhY2ggcmVsYXRlZExpc3QsIChvYmpOYW1lKS0+XHJcblx0XHRcdGlmIF8uaXNPYmplY3Qgb2JqTmFtZVxyXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW29iak5hbWUub2JqZWN0TmFtZV0gPSB7fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbb2JqTmFtZV0gPSB7fVxyXG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XHJcblx0XHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cclxuXHRcdFx0XHRpZiAocmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcImxvb2t1cFwiKSBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lIGFuZCByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXVxyXG5cdFx0XHRcdFx0cmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB7IG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLCBzaGFyaW5nOiByZWxhdGVkX2ZpZWxkLnNoYXJpbmcgfVxyXG5cdFx0aWYgcmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddXHJcblx0XHRcdHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSA9IHsgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiIH1cclxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXVxyXG5cdFx0XHRyZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10gPSB7IG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLCBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCIgfVxyXG5cdFx0Xy5lYWNoIFsndGFza3MnLCAnbm90ZXMnLCAnZXZlbnRzJywgJ2FwcHJvdmFscyddLCAoZW5hYmxlT2JqTmFtZSktPlxyXG5cdFx0XHRpZiByZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXVxyXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdID0geyBvYmplY3RfbmFtZTogZW5hYmxlT2JqTmFtZSwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiIH1cclxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ11cclxuXHRcdFx0I3JlY29yZCDor6bnu4bkuIvnmoRhdWRpdF9yZWNvcmRz5LuFbW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWPr+ingVxyXG5cdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpXHJcblx0XHRcdGlmIF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSA9IHsgb2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIiB9XHJcblx0XHRyZWxhdGVkX29iamVjdHMgPSBfLnZhbHVlcyByZWxhdGVkTGlzdE1hcFxyXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xyXG5cclxuXHRpZiBfb2JqZWN0LmVuYWJsZV9maWxlc1xyXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiY21zX2ZpbGVzXCIsIGZvcmVpZ25fa2V5OiBcInBhcmVudFwifVxyXG5cclxuXHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cclxuXHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cclxuXHRcdFx0aWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCAocmVsYXRlZF9maWVsZC50eXBlID09IFwibG9va3VwXCIgJiYgcmVsYXRlZF9maWVsZC5yZWxhdGVkTGlzdCkpIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWVcclxuXHRcdFx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwib2JqZWN0X2ZpZWxkc1wiXHJcblx0XHRcdFx0XHQjVE9ETyDlvoXnm7jlhbPliJfooajmlK/mjIHmjpLluo/lkI7vvIzliKDpmaTmraTliKTmlq1cclxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5zcGxpY2UoMCwgMCwge29iamVjdF9uYW1lOnJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWV9KVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpyZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLCBzaGFyaW5nOiByZWxhdGVkX2ZpZWxkLnNoYXJpbmd9XHJcblxyXG5cdGlmIF9vYmplY3QuZW5hYmxlX3Rhc2tzXHJcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJ0YXNrc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XHJcblx0aWYgX29iamVjdC5lbmFibGVfbm90ZXNcclxuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcIm5vdGVzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cclxuXHRpZiBfb2JqZWN0LmVuYWJsZV9ldmVudHNcclxuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImV2ZW50c1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XHJcblx0aWYgX29iamVjdC5lbmFibGVfaW5zdGFuY2VzXHJcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJpbnN0YW5jZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wifVxyXG5cdGlmIF9vYmplY3QuZW5hYmxlX2FwcHJvdmFsc1xyXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiYXBwcm92YWxzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cclxuXHRpZiBfb2JqZWN0LmVuYWJsZV9wcm9jZXNzXHJcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJwcm9jZXNzX2luc3RhbmNlX2hpc3RvcnlcIiwgZm9yZWlnbl9rZXk6IFwidGFyZ2V0X29iamVjdFwifVxyXG5cdCNyZWNvcmQg6K+m57uG5LiL55qEYXVkaXRfcmVjb3Jkc+S7hW1vZGlmeUFsbFJlY29yZHPmnYPpmZDlj6/op4FcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSlcclxuXHRcdGlmIF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImF1ZGl0X3JlY29yZHNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxyXG5cclxuXHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXHJcblxyXG5DcmVhdG9yLmdldFVzZXJDb250ZXh0ID0gKHVzZXJJZCwgc3BhY2VJZCwgaXNVblNhZmVNb2RlKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRyZXR1cm4gQ3JlYXRvci5VU0VSX0NPTlRFWFRcclxuXHRlbHNlXHJcblx0XHRpZiAhKHVzZXJJZCBhbmQgc3BhY2VJZClcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwidGhlIHBhcmFtcyB1c2VySWQgYW5kIHNwYWNlSWQgaXMgcmVxdWlyZWQgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFVzZXJDb250ZXh0XCJcclxuXHRcdFx0cmV0dXJuIG51bGxcclxuXHRcdHN1RmllbGRzID0ge25hbWU6IDEsIG1vYmlsZTogMSwgcG9zaXRpb246IDEsIGVtYWlsOiAxLCBjb21wYW55OiAxLCBvcmdhbml6YXRpb246IDEsIHNwYWNlOiAxLCBjb21wYW55X2lkOiAxLCBjb21wYW55X2lkczogMX1cclxuXHRcdCMgY2hlY2sgaWYgdXNlciBpbiB0aGUgc3BhY2VcclxuXHRcdHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiBzdUZpZWxkc30pXHJcblx0XHRpZiAhc3VcclxuXHRcdFx0c3BhY2VJZCA9IG51bGxcclxuXHJcblx0XHQjIGlmIHNwYWNlSWQgbm90IGV4aXN0cywgZ2V0IHRoZSBmaXJzdCBvbmUuXHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHRpZiBpc1VuU2FmZU1vZGVcclxuXHRcdFx0XHRzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHt1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiBzdUZpZWxkc30pXHJcblx0XHRcdFx0aWYgIXN1XHJcblx0XHRcdFx0XHRyZXR1cm4gbnVsbFxyXG5cdFx0XHRcdHNwYWNlSWQgPSBzdS5zcGFjZVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIG51bGxcclxuXHJcblx0XHRVU0VSX0NPTlRFWFQgPSB7fVxyXG5cdFx0VVNFUl9DT05URVhULnVzZXJJZCA9IHVzZXJJZFxyXG5cdFx0VVNFUl9DT05URVhULnNwYWNlSWQgPSBzcGFjZUlkXHJcblx0XHRVU0VSX0NPTlRFWFQudXNlciA9IHtcclxuXHRcdFx0X2lkOiB1c2VySWRcclxuXHRcdFx0bmFtZTogc3UubmFtZSxcclxuXHRcdFx0bW9iaWxlOiBzdS5tb2JpbGUsXHJcblx0XHRcdHBvc2l0aW9uOiBzdS5wb3NpdGlvbixcclxuXHRcdFx0ZW1haWw6IHN1LmVtYWlsXHJcblx0XHRcdGNvbXBhbnk6IHN1LmNvbXBhbnlcclxuXHRcdFx0Y29tcGFueV9pZDogc3UuY29tcGFueV9pZFxyXG5cdFx0XHRjb21wYW55X2lkczogc3UuY29tcGFueV9pZHNcclxuXHRcdH1cclxuXHRcdHNwYWNlX3VzZXJfb3JnID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib3JnYW5pemF0aW9uc1wiKT8uZmluZE9uZShzdS5vcmdhbml6YXRpb24pXHJcblx0XHRpZiBzcGFjZV91c2VyX29yZ1xyXG5cdFx0XHRVU0VSX0NPTlRFWFQudXNlci5vcmdhbml6YXRpb24gPSB7XHJcblx0XHRcdFx0X2lkOiBzcGFjZV91c2VyX29yZy5faWQsXHJcblx0XHRcdFx0bmFtZTogc3BhY2VfdXNlcl9vcmcubmFtZSxcclxuXHRcdFx0XHRmdWxsbmFtZTogc3BhY2VfdXNlcl9vcmcuZnVsbG5hbWVcclxuXHRcdFx0fVxyXG5cdFx0cmV0dXJuIFVTRVJfQ09OVEVYVFxyXG5cclxuQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCA9ICh1cmwpLT5cclxuXHJcblx0aWYgXy5pc0Z1bmN0aW9uKFN0ZWVkb3MuaXNDb3Jkb3ZhKSAmJiBTdGVlZG9zLmlzQ29yZG92YSgpICYmICh1cmw/LnN0YXJ0c1dpdGgoXCIvYXNzZXRzXCIpIHx8IHVybD8uc3RhcnRzV2l0aChcImFzc2V0c1wiKSB8fCB1cmw/LnN0YXJ0c1dpdGgoXCIvcGFja2FnZXNcIikpXHJcblx0XHRpZiAhL15cXC8vLnRlc3QodXJsKVxyXG5cdFx0XHR1cmwgPSBcIi9cIiArIHVybFxyXG5cdFx0cmV0dXJuIHVybFxyXG5cclxuXHRpZiB1cmxcclxuXHRcdCMgdXJs5byA5aS05rKh5pyJXCIvXCLvvIzpnIDopoHmt7vliqBcIi9cIlxyXG5cdFx0aWYgIS9eXFwvLy50ZXN0KHVybClcclxuXHRcdFx0dXJsID0gXCIvXCIgKyB1cmxcclxuXHRcdHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYICsgdXJsXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVhcclxuXHJcbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZCA9ICh1c2VySWQsIHNwYWNlSWQpLT5cclxuXHR1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpXHJcblx0ZWxzZVxyXG5cdFx0aWYgIXNwYWNlSWRcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKVxyXG5cdHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7Y29tcGFueV9pZDoxfX0pXHJcblx0cmV0dXJuIHN1LmNvbXBhbnlfaWRcclxuXHJcbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHMgPSAodXNlcklkLCBzcGFjZUlkKS0+XHJcblx0dXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKVxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0c3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKVxyXG5cdGVsc2VcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJylcclxuXHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge2NvbXBhbnlfaWRzOjF9fSlcclxuXHRyZXR1cm4gc3U/LmNvbXBhbnlfaWRzXHJcblxyXG5DcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyA9IChwbyktPlxyXG5cdGlmIHBvLmFsbG93Q3JlYXRlXHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0aWYgcG8uYWxsb3dFZGl0XHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0aWYgcG8uYWxsb3dEZWxldGVcclxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcclxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcclxuXHRpZiBwby52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdGlmIHBvLm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcclxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcclxuXHRcdHBvLmFsbG93RGVsZXRlID0gdHJ1ZVxyXG5cdFx0cG8udmlld0FsbFJlY29yZHMgPSB0cnVlXHJcblx0aWYgcG8udmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0aWYgcG8ubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcclxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcclxuXHRcdHBvLmFsbG93RGVsZXRlID0gdHJ1ZVxyXG5cdFx0cG8udmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZVxyXG5cdHJldHVybiBwb1xyXG5cclxuQ3JlYXRvci5nZXRUZW1wbGF0ZVNwYWNlSWQgPSAoKS0+XHJcblx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnRlbXBsYXRlU3BhY2VJZFxyXG5cclxuQ3JlYXRvci5nZXRDbG91ZEFkbWluU3BhY2VJZCA9ICgpLT5cclxuXHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8uY2xvdWRBZG1pblNwYWNlSWRcclxuXHJcbkNyZWF0b3IuaXNUZW1wbGF0ZVNwYWNlID0gKHNwYWNlSWQpLT5cclxuXHRpZiBzcGFjZUlkICYmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnRlbXBsYXRlU3BhY2VJZCA9PSBzcGFjZUlkXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdHJldHVybiBmYWxzZVxyXG5cclxuQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZSA9IChzcGFjZUlkKS0+XHJcblx0aWYgc3BhY2VJZCAmJiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5jbG91ZEFkbWluU3BhY2VJZCA9PSBzcGFjZUlkXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdHJldHVybiBmYWxzZVxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0aWYgcHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUlxyXG5cdFx0Q3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVJcclxuXHRlbHNlXHJcblx0XHRwYXRoID0gcmVxdWlyZSgncGF0aCcpXHJcblx0XHRDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyID0gcGF0aC5yZXNvbHZlKHBhdGguam9pbihfX21ldGVvcl9ib290c3RyYXBfXy5zZXJ2ZXJEaXIsICcuLi8uLi8uLi9jZnMnKSlcclxuIiwidmFyIEZpYmVyLCBwYXRoO1xuXG5DcmVhdG9yLmRlcHMgPSB7XG4gIGFwcDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeSxcbiAgb2JqZWN0OiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XG59O1xuXG5DcmVhdG9yLl9URU1QTEFURSA9IHtcbiAgQXBwczoge30sXG4gIE9iamVjdHM6IHt9XG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIGZpbHRlcnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xuICBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgb3B0aW9uc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG4gIHJldHVybiBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgY3JlYXRlRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbn0pO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIEZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG4gIENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyA9IGZ1bmN0aW9uKG9iaiwgb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5sb2FkT2JqZWN0cyhvYmosIG9iamVjdF9uYW1lKTtcbiAgICB9KS5ydW4oKTtcbiAgfTtcbn1cblxuQ3JlYXRvci5sb2FkT2JqZWN0cyA9IGZ1bmN0aW9uKG9iaiwgb2JqZWN0X25hbWUpIHtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gb2JqLm5hbWU7XG4gIH1cbiAgaWYgKCFvYmoubGlzdF92aWV3cykge1xuICAgIG9iai5saXN0X3ZpZXdzID0ge307XG4gIH1cbiAgaWYgKG9iai5zcGFjZSkge1xuICAgIG9iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmopO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSA9PT0gJ2Nmc19maWxlc19maWxlcmVjb3JkJykge1xuICAgIG9iamVjdF9uYW1lID0gJ2Nmcy5maWxlcy5maWxlcmVjb3JkJztcbiAgICBvYmogPSBfLmNsb25lKG9iaik7XG4gICAgb2JqLm5hbWUgPSBvYmplY3RfbmFtZTtcbiAgICBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdID0gb2JqO1xuICB9XG4gIENyZWF0b3IuY29udmVydE9iamVjdChvYmopO1xuICBuZXcgQ3JlYXRvci5PYmplY3Qob2JqKTtcbiAgQ3JlYXRvci5pbml0VHJpZ2dlcnMob2JqZWN0X25hbWUpO1xuICBDcmVhdG9yLmluaXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpO1xuICByZXR1cm4gb2JqO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3ROYW1lID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3Quc3BhY2UpIHtcbiAgICByZXR1cm4gXCJjX1wiICsgb2JqZWN0LnNwYWNlICsgXCJfXCIgKyBvYmplY3QubmFtZTtcbiAgfVxuICByZXR1cm4gb2JqZWN0Lm5hbWU7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCkge1xuICB2YXIgcmVmLCByZWYxO1xuICBpZiAoXy5pc0FycmF5KG9iamVjdF9uYW1lKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKChyZWYgPSBDcmVhdG9yLmRlcHMpICE9IG51bGwpIHtcbiAgICAgIGlmICgocmVmMSA9IHJlZi5vYmplY3QpICE9IG51bGwpIHtcbiAgICAgICAgcmVmMS5kZXBlbmQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV07XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0QnlJZCA9IGZ1bmN0aW9uKG9iamVjdF9pZCkge1xuICByZXR1cm4gXy5maW5kV2hlcmUoQ3JlYXRvci5vYmplY3RzQnlOYW1lLCB7XG4gICAgX2lkOiBvYmplY3RfaWRcbiAgfSk7XG59O1xuXG5DcmVhdG9yLnJlbW92ZU9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGNvbnNvbGUubG9nKFwicmVtb3ZlT2JqZWN0XCIsIG9iamVjdF9uYW1lKTtcbiAgZGVsZXRlIENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gIHJldHVybiBkZWxldGUgQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXTtcbn07XG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkKSB7XG4gIHZhciByZWY7XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKSkgIT0gbnVsbCA/IHJlZi5fY29sbGVjdGlvbl9uYW1lIDogdm9pZCAwXTtcbiAgfVxufTtcblxuQ3JlYXRvci5yZW1vdmVDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgcmV0dXJuIGRlbGV0ZSBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXTtcbn07XG5cbkNyZWF0b3IuaXNTcGFjZUFkbWluID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciByZWYsIHJlZjEsIHNwYWNlO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBzcGFjZSA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChcInNwYWNlc1wiKSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmRiKSAhPSBudWxsID8gcmVmMS5maW5kT25lKHNwYWNlSWQsIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGFkbWluczogMVxuICAgIH1cbiAgfSkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIGlmIChzcGFjZSAhPSBudWxsID8gc3BhY2UuYWRtaW5zIDogdm9pZCAwKSB7XG4gICAgcmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMDtcbiAgfVxufTtcblxuQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEgPSBmdW5jdGlvbihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucykge1xuICBpZiAoIV8uaXNTdHJpbmcoZm9ybXVsYXIpKSB7XG4gICAgcmV0dXJuIGZvcm11bGFyO1xuICB9XG4gIGlmIChDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmb3JtdWxhcikpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG4gIHJldHVybiBmb3JtdWxhcjtcbn07XG5cbkNyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzID0gZnVuY3Rpb24oZmlsdGVycywgY29udGV4dCkge1xuICB2YXIgc2VsZWN0b3I7XG4gIHNlbGVjdG9yID0ge307XG4gIF8uZWFjaChmaWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICB2YXIgYWN0aW9uLCBuYW1lLCB2YWx1ZTtcbiAgICBpZiAoKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLmxlbmd0aCA6IHZvaWQgMCkgPT09IDMpIHtcbiAgICAgIG5hbWUgPSBmaWx0ZXJbMF07XG4gICAgICBhY3Rpb24gPSBmaWx0ZXJbMV07XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgY29udGV4dCk7XG4gICAgICBzZWxlY3RvcltuYW1lXSA9IHt9O1xuICAgICAgcmV0dXJuIHNlbGVjdG9yW25hbWVdW2FjdGlvbl0gPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5DcmVhdG9yLmlzQ29tbW9uU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHJldHVybiBzcGFjZUlkID09PSAnY29tbW9uJztcbn07XG5cblxuLypcblx0ZG9jc++8muW+heaOkuW6j+eahOaWh+aho+aVsOe7hFxuXHRpZHPvvJpfaWTpm4blkIhcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcblx0cmV0dXJuIOaMieeFp2lkc+eahOmhuuW6j+i/lOWbnuaWsOeahOaWh+aho+mbhuWQiFxuICovXG5cbkNyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzID0gZnVuY3Rpb24oZG9jcywgaWRzLCBpZF9rZXksIGhpdF9maXJzdCkge1xuICB2YXIgdmFsdWVzO1xuICBpZiAoIWlkX2tleSkge1xuICAgIGlkX2tleSA9IFwiX2lkXCI7XG4gIH1cbiAgaWYgKGhpdF9maXJzdCkge1xuICAgIHZhbHVlcyA9IGRvY3MuZ2V0UHJvcGVydHkoaWRfa2V5KTtcbiAgICByZXR1cm4gXy5zb3J0QnkoZG9jcywgZnVuY3Rpb24oZG9jKSB7XG4gICAgICB2YXIgX2luZGV4O1xuICAgICAgX2luZGV4ID0gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pO1xuICAgICAgaWYgKF9pbmRleCA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfaW5kZXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaWRzLmxlbmd0aCArIF8uaW5kZXhPZih2YWx1ZXMsIGRvY1tpZF9rZXldKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXy5zb3J0QnkoZG9jcywgZnVuY3Rpb24oZG9jKSB7XG4gICAgICByZXR1cm4gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5cbi8qXG5cdOaMieeUqOaIt+aJgOWxnuacrOWcsOWMluivreiogOi/m+ihjOaOkuW6j++8jOaUr+aMgeS4reaWh+OAgeaVsOWAvOOAgeaXpeacn+etieWtl+auteaOkuW6j1xuXHTlr7nkuo5PYmplY3TnsbvlnovvvIzlpoLmnpzmj5DkvpvkvZznlKjln5/kuK1rZXnlsZ7mgKfvvIzliJnlj5blgLzkuLp2YWx1ZVtrZXld6L+b6KGM5o6S5bqP5q+U6L6D77yM5Y+N5LmL5pW05LiqT2JqZWN0LnRvU3RyaW5nKCnlkI7mjpLluo/mr5TovoNcbiAqL1xuXG5DcmVhdG9yLnNvcnRpbmdNZXRob2QgPSBmdW5jdGlvbih2YWx1ZTEsIHZhbHVlMikge1xuICB2YXIgaXNWYWx1ZTFFbXB0eSwgaXNWYWx1ZTJFbXB0eSwgbG9jYWxlO1xuICBpZiAodGhpcy5rZXkpIHtcbiAgICB2YWx1ZTEgPSB2YWx1ZTFbdGhpcy5rZXldO1xuICAgIHZhbHVlMiA9IHZhbHVlMlt0aGlzLmtleV07XG4gIH1cbiAgaWYgKHZhbHVlMSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICB2YWx1ZTEgPSB2YWx1ZTEuZ2V0VGltZSgpO1xuICB9XG4gIGlmICh2YWx1ZTIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgdmFsdWUyID0gdmFsdWUyLmdldFRpbWUoKTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlMSA9PT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgdmFsdWUyID09PSBcIm51bWJlclwiKSB7XG4gICAgcmV0dXJuIHZhbHVlMSAtIHZhbHVlMjtcbiAgfVxuICBpc1ZhbHVlMUVtcHR5ID0gdmFsdWUxID09PSBudWxsIHx8IHZhbHVlMSA9PT0gdm9pZCAwO1xuICBpc1ZhbHVlMkVtcHR5ID0gdmFsdWUyID09PSBudWxsIHx8IHZhbHVlMiA9PT0gdm9pZCAwO1xuICBpZiAoaXNWYWx1ZTFFbXB0eSAmJiAhaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBpZiAoaXNWYWx1ZTFFbXB0eSAmJiBpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgaWYgKCFpc1ZhbHVlMUVtcHR5ICYmIGlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpO1xuICByZXR1cm4gdmFsdWUxLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZSh2YWx1ZTIudG9TdHJpbmcoKSwgbG9jYWxlKTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgcGVybWlzc2lvbnMsIHJlbGF0ZWRMaXN0LCByZWxhdGVkTGlzdE1hcCwgcmVsYXRlZF9vYmplY3RzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgfVxuICByZWxhdGVkX29iamVjdHMgPSBbXTtcbiAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gIGlmICghX29iamVjdCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdHM7XG4gIH1cbiAgcmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmICFfLmlzRW1wdHkocmVsYXRlZExpc3QpKSB7XG4gICAgcmVsYXRlZExpc3RNYXAgPSB7fTtcbiAgICBfLmVhY2gocmVsYXRlZExpc3QsIGZ1bmN0aW9uKG9iak5hbWUpIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KG9iak5hbWUpKSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtvYmpOYW1lLm9iamVjdE5hbWVdID0ge307XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbb2JqTmFtZV0gPSB7fTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgICAgcmV0dXJuIF8uZWFjaChyZWxhdGVkX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgICAgICBpZiAoKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgcmVsYXRlZF9maWVsZC50eXBlID09PSBcImxvb2t1cFwiKSAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PT0gb2JqZWN0X25hbWUgJiYgcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0pIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsXG4gICAgICAgICAgICBzaGFyaW5nOiByZWxhdGVkX2ZpZWxkLnNoYXJpbmdcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddKSB7XG4gICAgICByZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10gPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImNtc19maWxlc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJwYXJlbnRcIlxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXSkge1xuICAgICAgcmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddID0ge1xuICAgICAgICBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIixcbiAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiXG4gICAgICB9O1xuICAgIH1cbiAgICBfLmVhY2goWyd0YXNrcycsICdub3RlcycsICdldmVudHMnLCAnYXBwcm92YWxzJ10sIGZ1bmN0aW9uKGVuYWJsZU9iak5hbWUpIHtcbiAgICAgIGlmIChyZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSkge1xuICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbZW5hYmxlT2JqTmFtZV0gPSB7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IGVuYWJsZU9iak5hbWUsXG4gICAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10pIHtcbiAgICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSk7XG4gICAgICBpZiAoX29iamVjdC5lbmFibGVfYXVkaXQgJiYgKHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwKSkge1xuICAgICAgICByZWxhdGVkTGlzdE1hcFsnYXVkaXRfcmVjb3JkcyddID0ge1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBcImF1ZGl0X3JlY29yZHNcIixcbiAgICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVsYXRlZF9vYmplY3RzID0gXy52YWx1ZXMocmVsYXRlZExpc3RNYXApO1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdHM7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2ZpbGVzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJwYXJlbnRcIlxuICAgIH0pO1xuICB9XG4gIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIF8uZWFjaChyZWxhdGVkX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgICAgaWYgKChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiIHx8IChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIgJiYgcmVsYXRlZF9maWVsZC5yZWxhdGVkTGlzdCkpICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSkge1xuICAgICAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJvYmplY3RfZmllbGRzXCIpIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzLnNwbGljZSgwLCAwLCB7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICAgICAgc2hhcmluZzogcmVsYXRlZF9maWVsZC5zaGFyaW5nXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIGlmIChfb2JqZWN0LmVuYWJsZV90YXNrcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcInRhc2tzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfbm90ZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJub3Rlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2V2ZW50cykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImV2ZW50c1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2luc3RhbmNlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2FwcHJvdmFscykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImFwcHJvdmFsc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX3Byb2Nlc3MpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJwcm9jZXNzX2luc3RhbmNlX2hpc3RvcnlcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInRhcmdldF9vYmplY3RcIlxuICAgIH0pO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpO1xuICAgIGlmIChfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiAocGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDApKSB7XG4gICAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImF1ZGl0X3JlY29yZHNcIixcbiAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbnRleHQgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIGlzVW5TYWZlTW9kZSkge1xuICB2YXIgVVNFUl9DT05URVhULCByZWYsIHNwYWNlX3VzZXJfb3JnLCBzdSwgc3VGaWVsZHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5VU0VSX0NPTlRFWFQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCEodXNlcklkICYmIHNwYWNlSWQpKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJ0aGUgcGFyYW1zIHVzZXJJZCBhbmQgc3BhY2VJZCBpcyByZXF1aXJlZCBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0VXNlckNvbnRleHRcIik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgc3VGaWVsZHMgPSB7XG4gICAgICBuYW1lOiAxLFxuICAgICAgbW9iaWxlOiAxLFxuICAgICAgcG9zaXRpb246IDEsXG4gICAgICBlbWFpbDogMSxcbiAgICAgIGNvbXBhbnk6IDEsXG4gICAgICBvcmdhbml6YXRpb246IDEsXG4gICAgICBzcGFjZTogMSxcbiAgICAgIGNvbXBhbnlfaWQ6IDEsXG4gICAgICBjb21wYW55X2lkczogMVxuICAgIH07XG4gICAgc3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczogc3VGaWVsZHNcbiAgICB9KTtcbiAgICBpZiAoIXN1KSB7XG4gICAgICBzcGFjZUlkID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBpZiAoaXNVblNhZmVNb2RlKSB7XG4gICAgICAgIHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBzdUZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFzdSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHNwYWNlSWQgPSBzdS5zcGFjZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBVU0VSX0NPTlRFWFQgPSB7fTtcbiAgICBVU0VSX0NPTlRFWFQudXNlcklkID0gdXNlcklkO1xuICAgIFVTRVJfQ09OVEVYVC5zcGFjZUlkID0gc3BhY2VJZDtcbiAgICBVU0VSX0NPTlRFWFQudXNlciA9IHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgbmFtZTogc3UubmFtZSxcbiAgICAgIG1vYmlsZTogc3UubW9iaWxlLFxuICAgICAgcG9zaXRpb246IHN1LnBvc2l0aW9uLFxuICAgICAgZW1haWw6IHN1LmVtYWlsLFxuICAgICAgY29tcGFueTogc3UuY29tcGFueSxcbiAgICAgIGNvbXBhbnlfaWQ6IHN1LmNvbXBhbnlfaWQsXG4gICAgICBjb21wYW55X2lkczogc3UuY29tcGFueV9pZHNcbiAgICB9O1xuICAgIHNwYWNlX3VzZXJfb3JnID0gKHJlZiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9yZ2FuaXphdGlvbnNcIikpICE9IG51bGwgPyByZWYuZmluZE9uZShzdS5vcmdhbml6YXRpb24pIDogdm9pZCAwO1xuICAgIGlmIChzcGFjZV91c2VyX29yZykge1xuICAgICAgVVNFUl9DT05URVhULnVzZXIub3JnYW5pemF0aW9uID0ge1xuICAgICAgICBfaWQ6IHNwYWNlX3VzZXJfb3JnLl9pZCxcbiAgICAgICAgbmFtZTogc3BhY2VfdXNlcl9vcmcubmFtZSxcbiAgICAgICAgZnVsbG5hbWU6IHNwYWNlX3VzZXJfb3JnLmZ1bGxuYW1lXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gVVNFUl9DT05URVhUO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0aXZlVXJsID0gZnVuY3Rpb24odXJsKSB7XG4gIGlmIChfLmlzRnVuY3Rpb24oU3RlZWRvcy5pc0NvcmRvdmEpICYmIFN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgKCh1cmwgIT0gbnVsbCA/IHVybC5zdGFydHNXaXRoKFwiL2Fzc2V0c1wiKSA6IHZvaWQgMCkgfHwgKHVybCAhPSBudWxsID8gdXJsLnN0YXJ0c1dpdGgoXCJhc3NldHNcIikgOiB2b2lkIDApIHx8ICh1cmwgIT0gbnVsbCA/IHVybC5zdGFydHNXaXRoKFwiL3BhY2thZ2VzXCIpIDogdm9pZCAwKSkpIHtcbiAgICBpZiAoIS9eXFwvLy50ZXN0KHVybCkpIHtcbiAgICAgIHVybCA9IFwiL1wiICsgdXJsO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xuICB9XG4gIGlmICh1cmwpIHtcbiAgICBpZiAoIS9eXFwvLy50ZXN0KHVybCkpIHtcbiAgICAgIHVybCA9IFwiL1wiICsgdXJsO1xuICAgIH1cbiAgICByZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCArIHVybDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBzdTtcbiAgdXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJyk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpO1xuICAgIH1cbiAgfVxuICBzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICB1c2VyOiB1c2VySWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY29tcGFueV9pZDogMVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzdS5jb21wYW55X2lkO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgc3U7XG4gIHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKCk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpO1xuICB9IGVsc2Uge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKTtcbiAgICB9XG4gIH1cbiAgc3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNvbXBhbnlfaWRzOiAxXG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHN1ICE9IG51bGwgPyBzdS5jb21wYW55X2lkcyA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zID0gZnVuY3Rpb24ocG8pIHtcbiAgaWYgKHBvLmFsbG93Q3JlYXRlKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dFZGl0KSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dEZWxldGUpIHtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLnZpZXdBbGxSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd0RlbGV0ZSA9IHRydWU7XG4gICAgcG8udmlld0FsbFJlY29yZHMgPSB0cnVlO1xuICB9XG4gIGlmIChwby52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd0RlbGV0ZSA9IHRydWU7XG4gICAgcG8udmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcG87XG59O1xuXG5DcmVhdG9yLmdldFRlbXBsYXRlU3BhY2VJZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi50ZW1wbGF0ZVNwYWNlSWQgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmdldENsb3VkQWRtaW5TcGFjZUlkID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLmNsb3VkQWRtaW5TcGFjZUlkIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5pc1RlbXBsYXRlU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHZhciByZWY7XG4gIGlmIChzcGFjZUlkICYmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLnRlbXBsYXRlU3BhY2VJZCA6IHZvaWQgMCkgPT09IHNwYWNlSWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5DcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoc3BhY2VJZCAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi5jbG91ZEFkbWluU3BhY2VJZCA6IHZvaWQgMCkgPT09IHNwYWNlSWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIGlmIChwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSKSB7XG4gICAgQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVI7XG4gIH0gZWxzZSB7XG4gICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgICBDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyID0gcGF0aC5yZXNvbHZlKHBhdGguam9pbihfX21ldGVvcl9ib290c3RyYXBfXy5zZXJ2ZXJEaXIsICcuLi8uLi8uLi9jZnMnKSk7XG4gIH1cbn1cbiIsIk1ldGVvci5tZXRob2RzXHJcblx0IyDnlKjmiLfojrflj5Zsb29rdXAg44CBbWFzdGVyX2RldGFpbOexu+Wei+Wtl+auteeahOmAiemhueWAvFxyXG5cdFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiOiAob3B0aW9ucyktPlxyXG5cdFx0aWYgb3B0aW9ucz8ucGFyYW1zPy5yZWZlcmVuY2VfdG9cclxuXHJcblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9wdGlvbnMucGFyYW1zLnJlZmVyZW5jZV90bywgb3B0aW9ucy5wYXJhbXMuc3BhY2UpXHJcblxyXG5cdFx0XHRuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWVxyXG5cclxuXHRcdFx0cXVlcnkgPSB7fVxyXG5cdFx0XHRpZiBvcHRpb25zLnBhcmFtcy5zcGFjZVxyXG5cdFx0XHRcdHF1ZXJ5LnNwYWNlID0gb3B0aW9ucy5wYXJhbXMuc3BhY2VcclxuXHJcblx0XHRcdFx0c29ydCA9IG9wdGlvbnM/LnNvcnRcclxuXHJcblx0XHRcdFx0c2VsZWN0ZWQgPSBvcHRpb25zPy5zZWxlY3RlZCB8fCBbXVxyXG5cclxuXHRcdFx0XHRvcHRpb25zX2xpbWl0ID0gb3B0aW9ucz8ub3B0aW9uc19saW1pdCB8fCAxMFxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcclxuXHRcdFx0XHRcdHNlYXJjaFRleHRRdWVyeSA9IHt9XHJcblx0XHRcdFx0XHRzZWFyY2hUZXh0UXVlcnlbbmFtZV9maWVsZF9rZXldID0geyRyZWdleDogb3B0aW9ucy5zZWFyY2hUZXh0fVxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zPy52YWx1ZXM/Lmxlbmd0aFxyXG5cdFx0XHRcdFx0aWYgb3B0aW9ucy5zZWFyY2hUZXh0XHJcblx0XHRcdFx0XHRcdHF1ZXJ5LiRvciA9IFt7X2lkOiB7JGluOiBvcHRpb25zLnZhbHVlc319LCBzZWFyY2hUZXh0UXVlcnldXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHF1ZXJ5LiRvciA9IFt7X2lkOiB7JGluOiBvcHRpb25zLnZhbHVlc319XVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxyXG5cdFx0XHRcdFx0XHRfLmV4dGVuZChxdWVyeSwgc2VhcmNoVGV4dFF1ZXJ5KVxyXG5cdFx0XHRcdFx0cXVlcnkuX2lkID0geyRuaW46IHNlbGVjdGVkfVxyXG5cclxuXHRcdFx0XHRjb2xsZWN0aW9uID0gb2JqZWN0LmRiXHJcblxyXG5cdFx0XHRcdGlmIG9wdGlvbnMuZmlsdGVyUXVlcnlcclxuXHRcdFx0XHRcdF8uZXh0ZW5kIHF1ZXJ5LCBvcHRpb25zLmZpbHRlclF1ZXJ5XHJcblxyXG5cdFx0XHRcdHF1ZXJ5X29wdGlvbnMgPSB7bGltaXQ6IG9wdGlvbnNfbGltaXR9XHJcblxyXG5cdFx0XHRcdGlmIHNvcnQgJiYgXy5pc09iamVjdChzb3J0KVxyXG5cdFx0XHRcdFx0cXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydFxyXG5cclxuXHRcdFx0XHRpZiBjb2xsZWN0aW9uXHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0cmVjb3JkcyA9IGNvbGxlY3Rpb24uZmluZChxdWVyeSwgcXVlcnlfb3B0aW9ucykuZmV0Y2goKVxyXG5cdFx0XHRcdFx0XHRyZXN1bHRzID0gW11cclxuXHRcdFx0XHRcdFx0Xy5lYWNoIHJlY29yZHMsIChyZWNvcmQpLT5cclxuXHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2hcclxuXHRcdFx0XHRcdFx0XHRcdGxhYmVsOiByZWNvcmRbbmFtZV9maWVsZF9rZXldXHJcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogcmVjb3JkLl9pZFxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0c1xyXG5cdFx0XHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgZS5tZXNzYWdlICsgXCItLT5cIiArIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpXHJcblx0XHRyZXR1cm4gW10gIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBjb2xsZWN0aW9uLCBlLCBuYW1lX2ZpZWxkX2tleSwgb2JqZWN0LCBvcHRpb25zX2xpbWl0LCBxdWVyeSwgcXVlcnlfb3B0aW9ucywgcmVjb3JkcywgcmVmLCByZWYxLCByZXN1bHRzLCBzZWFyY2hUZXh0UXVlcnksIHNlbGVjdGVkLCBzb3J0O1xuICAgIGlmIChvcHRpb25zICE9IG51bGwgPyAocmVmID0gb3B0aW9ucy5wYXJhbXMpICE9IG51bGwgPyByZWYucmVmZXJlbmNlX3RvIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvcHRpb25zLnBhcmFtcy5yZWZlcmVuY2VfdG8sIG9wdGlvbnMucGFyYW1zLnNwYWNlKTtcbiAgICAgIG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICAgICAgcXVlcnkgPSB7fTtcbiAgICAgIGlmIChvcHRpb25zLnBhcmFtcy5zcGFjZSkge1xuICAgICAgICBxdWVyeS5zcGFjZSA9IG9wdGlvbnMucGFyYW1zLnNwYWNlO1xuICAgICAgICBzb3J0ID0gb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zb3J0IDogdm9pZCAwO1xuICAgICAgICBzZWxlY3RlZCA9IChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNlbGVjdGVkIDogdm9pZCAwKSB8fCBbXTtcbiAgICAgICAgb3B0aW9uc19saW1pdCA9IChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLm9wdGlvbnNfbGltaXQgOiB2b2lkIDApIHx8IDEwO1xuICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgc2VhcmNoVGV4dFF1ZXJ5ID0ge307XG4gICAgICAgICAgc2VhcmNoVGV4dFF1ZXJ5W25hbWVfZmllbGRfa2V5XSA9IHtcbiAgICAgICAgICAgICRyZWdleDogb3B0aW9ucy5zZWFyY2hUZXh0XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucyAhPSBudWxsID8gKHJlZjEgPSBvcHRpb25zLnZhbHVlcykgIT0gbnVsbCA/IHJlZjEubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgcXVlcnkuJG9yID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAkaW46IG9wdGlvbnMudmFsdWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LCBzZWFyY2hUZXh0UXVlcnlcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHF1ZXJ5LiRvciA9IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgJGluOiBvcHRpb25zLnZhbHVlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgXy5leHRlbmQocXVlcnksIHNlYXJjaFRleHRRdWVyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHF1ZXJ5Ll9pZCA9IHtcbiAgICAgICAgICAgICRuaW46IHNlbGVjdGVkXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBjb2xsZWN0aW9uID0gb2JqZWN0LmRiO1xuICAgICAgICBpZiAob3B0aW9ucy5maWx0ZXJRdWVyeSkge1xuICAgICAgICAgIF8uZXh0ZW5kKHF1ZXJ5LCBvcHRpb25zLmZpbHRlclF1ZXJ5KTtcbiAgICAgICAgfVxuICAgICAgICBxdWVyeV9vcHRpb25zID0ge1xuICAgICAgICAgIGxpbWl0OiBvcHRpb25zX2xpbWl0XG4gICAgICAgIH07XG4gICAgICAgIGlmIChzb3J0ICYmIF8uaXNPYmplY3Qoc29ydCkpIHtcbiAgICAgICAgICBxdWVyeV9vcHRpb25zLnNvcnQgPSBzb3J0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlY29yZHMgPSBjb2xsZWN0aW9uLmZpbmQocXVlcnksIHF1ZXJ5X29wdGlvbnMpLmZldGNoKCk7XG4gICAgICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgICAgICBfLmVhY2gocmVjb3JkcywgZnVuY3Rpb24ocmVjb3JkKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgICAgIGxhYmVsOiByZWNvcmRbbmFtZV9maWVsZF9rZXldLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuX2lkXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIGUubWVzc2FnZSArIFwiLS0+XCIgKyBKU09OLnN0cmluZ2lmeShvcHRpb25zKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxufSk7XG4iLCJKc29uUm91dGVzLmFkZCAncG9zdCcsICcvYXBpL3dvcmtmbG93L3ZpZXcvOmluc3RhbmNlSWQnLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0dHJ5XHJcblx0XHRjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpXHJcblx0XHRjdXJyZW50X3VzZXJfaWQgPSBjdXJyZW50X3VzZXJfaW5mby5faWRcclxuXHJcblx0XHRoYXNoRGF0YSA9IHJlcS5ib2R5XHJcblx0XHRvYmplY3RfbmFtZSA9IGhhc2hEYXRhLm9iamVjdF9uYW1lXHJcblx0XHRyZWNvcmRfaWQgPSBoYXNoRGF0YS5yZWNvcmRfaWRcclxuXHRcdHNwYWNlX2lkID0gaGFzaERhdGEuc3BhY2VfaWRcclxuXHJcblx0XHRjaGVjayBvYmplY3RfbmFtZSwgU3RyaW5nXHJcblx0XHRjaGVjayByZWNvcmRfaWQsIFN0cmluZ1xyXG5cdFx0Y2hlY2sgc3BhY2VfaWQsIFN0cmluZ1xyXG5cclxuXHRcdGluc0lkID0gcmVxLnBhcmFtcy5pbnN0YW5jZUlkXHJcblx0XHR4X3VzZXJfaWQgPSByZXEucXVlcnlbJ1gtVXNlci1JZCddXHJcblx0XHR4X2F1dGhfdG9rZW4gPSByZXEucXVlcnlbJ1gtQXV0aC1Ub2tlbiddXHJcblxyXG5cdFx0cmVkaXJlY3RfdXJsID0gXCIvXCJcclxuXHRcdGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZClcclxuXHRcdCMgLSDmiJHnmoTojYnnqL/lsLHot7Povazoh7PojYnnqL/nrrFcclxuXHRcdCMgLSDmiJHnmoTlvoXlrqHmoLjlsLHot7Povazoh7PlvoXlrqHmoLhcclxuXHRcdCMgLSDkuI3mmK/miJHnmoTnlLPor7fljZXliJnot7Povazoh7PmiZPljbDpobXpnaJcclxuXHRcdCMgLSDlpoLnlLPor7fljZXkuI3lrZjlnKjliJnmj5DnpLrnlKjmiLfnlLPor7fljZXlt7LliKDpmaTvvIzlubbkuJTmm7TmlrByZWNvcmTnmoTnirbmgIHvvIzkvb/nlKjmiLflj6/ku6Xph43mlrDlj5HotbflrqHmiblcclxuXHRcdGlmIGluc1xyXG5cdFx0XHRib3ggPSAnJ1xyXG5cdFx0XHRzcGFjZUlkID0gaW5zLnNwYWNlXHJcblx0XHRcdGZsb3dJZCA9IGlucy5mbG93XHJcblxyXG5cdFx0XHRpZiAoaW5zLmluYm94X3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWQpIG9yIChpbnMuY2NfdXNlcnM/LmluY2x1ZGVzIGN1cnJlbnRfdXNlcl9pZClcclxuXHRcdFx0XHRib3ggPSAnaW5ib3gnXHJcblx0XHRcdGVsc2UgaWYgaW5zLm91dGJveF91c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkXHJcblx0XHRcdFx0Ym94ID0gJ291dGJveCdcclxuXHRcdFx0ZWxzZSBpZiBpbnMuc3RhdGUgaXMgJ2RyYWZ0JyBhbmQgaW5zLnN1Ym1pdHRlciBpcyBjdXJyZW50X3VzZXJfaWRcclxuXHRcdFx0XHRib3ggPSAnZHJhZnQnXHJcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdwZW5kaW5nJyBhbmQgKGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkIG9yIGlucy5hcHBsaWNhbnQgaXMgY3VycmVudF91c2VyX2lkKVxyXG5cdFx0XHRcdGJveCA9ICdwZW5kaW5nJ1xyXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAnY29tcGxldGVkJyBhbmQgaW5zLnN1Ym1pdHRlciBpcyBjdXJyZW50X3VzZXJfaWRcclxuXHRcdFx0XHRib3ggPSAnY29tcGxldGVkJ1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0IyDpqozor4Fsb2dpbiB1c2VyX2lk5a+56K+l5rWB56iL5pyJ566h55CG55Sz6K+35Y2V55qE5p2D6ZmQXHJcblx0XHRcdFx0cGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd0lkLCBjdXJyZW50X3VzZXJfaWQpXHJcblx0XHRcdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkLCB7IGZpZWxkczogeyBhZG1pbnM6IDEgfSB9KVxyXG5cdFx0XHRcdGlmIHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRtaW5cIikgb3Igc3BhY2UuYWRtaW5zLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZClcclxuXHRcdFx0XHRcdGJveCA9ICdtb25pdG9yJ1xyXG5cdFx0XHR3b3JrZmxvd1VybCA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXM/LndvcmtmbG93Py51cmxcclxuXHRcdFx0aWYgYm94XHJcblx0XHRcdFx0cmVkaXJlY3RfdXJsID0gKHdvcmtmbG93VXJsIHx8ICcnKSArIFwid29ya2Zsb3cvc3BhY2UvI3tzcGFjZUlkfS8je2JveH0vI3tpbnNJZH0/WC1Vc2VyLUlkPSN7eF91c2VyX2lkfSZYLUF1dGgtVG9rZW49I3t4X2F1dGhfdG9rZW59XCJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJylcIndvcmtmbG93L3NwYWNlLyN7c3BhY2VJZH0vcHJpbnQvI3tpbnNJZH0/Ym94PW1vbml0b3ImcHJpbnRfaXNfc2hvd190cmFjZXM9MSZwcmludF9pc19zaG93X2F0dGFjaG1lbnRzPTEmWC1Vc2VyLUlkPSN7eF91c2VyX2lkfSZYLUF1dGgtVG9rZW49I3t4X2F1dGhfdG9rZW59XCJcclxuXHJcblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0XHRkYXRhOiB7IHJlZGlyZWN0X3VybDogcmVkaXJlY3RfdXJsIH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdGVsc2VcclxuXHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpXHJcblx0XHRcdGlmIGNvbGxlY3Rpb25cclxuXHRcdFx0XHRjb2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRfaWQsIHtcclxuXHRcdFx0XHRcdCR1bnNldDoge1xyXG5cdFx0XHRcdFx0XHRcImluc3RhbmNlc1wiOiAxLFxyXG5cdFx0XHRcdFx0XHRcImluc3RhbmNlX3N0YXRlXCI6IDFcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvcicsICfnlLPor7fljZXlt7LliKDpmaQnKVxyXG5cclxuXHRjYXRjaCBlXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3sgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfV0gfVxyXG5cdFx0fVxyXG5cclxuIiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS93b3JrZmxvdy92aWV3LzppbnN0YW5jZUlkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJveCwgY29sbGVjdGlvbiwgY3VycmVudF91c2VyX2lkLCBjdXJyZW50X3VzZXJfaW5mbywgZSwgZmxvd0lkLCBoYXNoRGF0YSwgaW5zLCBpbnNJZCwgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25zLCByZWNvcmRfaWQsIHJlZGlyZWN0X3VybCwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCBzcGFjZSwgc3BhY2VJZCwgc3BhY2VfaWQsIHdvcmtmbG93VXJsLCB4X2F1dGhfdG9rZW4sIHhfdXNlcl9pZDtcbiAgdHJ5IHtcbiAgICBjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpO1xuICAgIGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZDtcbiAgICBoYXNoRGF0YSA9IHJlcS5ib2R5O1xuICAgIG9iamVjdF9uYW1lID0gaGFzaERhdGEub2JqZWN0X25hbWU7XG4gICAgcmVjb3JkX2lkID0gaGFzaERhdGEucmVjb3JkX2lkO1xuICAgIHNwYWNlX2lkID0gaGFzaERhdGEuc3BhY2VfaWQ7XG4gICAgY2hlY2sob2JqZWN0X25hbWUsIFN0cmluZyk7XG4gICAgY2hlY2socmVjb3JkX2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIGluc0lkID0gcmVxLnBhcmFtcy5pbnN0YW5jZUlkO1xuICAgIHhfdXNlcl9pZCA9IHJlcS5xdWVyeVsnWC1Vc2VyLUlkJ107XG4gICAgeF9hdXRoX3Rva2VuID0gcmVxLnF1ZXJ5WydYLUF1dGgtVG9rZW4nXTtcbiAgICByZWRpcmVjdF91cmwgPSBcIi9cIjtcbiAgICBpbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLmZpbmRPbmUoaW5zSWQpO1xuICAgIGlmIChpbnMpIHtcbiAgICAgIGJveCA9ICcnO1xuICAgICAgc3BhY2VJZCA9IGlucy5zcGFjZTtcbiAgICAgIGZsb3dJZCA9IGlucy5mbG93O1xuICAgICAgaWYgKCgocmVmID0gaW5zLmluYm94X3VzZXJzKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApIHx8ICgocmVmMSA9IGlucy5jY191c2VycykgIT0gbnVsbCA/IHJlZjEuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgYm94ID0gJ2luYm94JztcbiAgICAgIH0gZWxzZSBpZiAoKHJlZjIgPSBpbnMub3V0Ym94X3VzZXJzKSAhPSBudWxsID8gcmVmMi5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSB7XG4gICAgICAgIGJveCA9ICdvdXRib3gnO1xuICAgICAgfSBlbHNlIGlmIChpbnMuc3RhdGUgPT09ICdkcmFmdCcgJiYgaW5zLnN1Ym1pdHRlciA9PT0gY3VycmVudF91c2VyX2lkKSB7XG4gICAgICAgIGJveCA9ICdkcmFmdCc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ3BlbmRpbmcnICYmIChpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQgfHwgaW5zLmFwcGxpY2FudCA9PT0gY3VycmVudF91c2VyX2lkKSkge1xuICAgICAgICBib3ggPSAncGVuZGluZyc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ2NvbXBsZXRlZCcgJiYgaW5zLnN1Ym1pdHRlciA9PT0gY3VycmVudF91c2VyX2lkKSB7XG4gICAgICAgIGJveCA9ICdjb21wbGV0ZWQnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd0lkLCBjdXJyZW50X3VzZXJfaWQpO1xuICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQsIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGFkbWluczogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkbWluXCIpIHx8IHNwYWNlLmFkbWlucy5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpKSB7XG4gICAgICAgICAgYm94ID0gJ21vbml0b3InO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB3b3JrZmxvd1VybCA9IChyZWYzID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzKSAhPSBudWxsID8gKHJlZjQgPSByZWYzLndvcmtmbG93KSAhPSBudWxsID8gcmVmNC51cmwgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoYm94KSB7XG4gICAgICAgIHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJykgKyAoXCJ3b3JrZmxvdy9zcGFjZS9cIiArIHNwYWNlSWQgKyBcIi9cIiArIGJveCArIFwiL1wiICsgaW5zSWQgKyBcIj9YLVVzZXItSWQ9XCIgKyB4X3VzZXJfaWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyB4X2F1dGhfdG9rZW4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVkaXJlY3RfdXJsID0gKHdvcmtmbG93VXJsIHx8ICcnKWB3b3JrZmxvdy9zcGFjZS8ke3NwYWNlSWR9L3ByaW50LyR7aW5zSWR9P2JveD1tb25pdG9yJnByaW50X2lzX3Nob3dfdHJhY2VzPTEmcHJpbnRfaXNfc2hvd19hdHRhY2htZW50cz0xJlgtVXNlci1JZD0ke3hfdXNlcl9pZH0mWC1BdXRoLVRva2VuPSR7eF9hdXRoX3Rva2VufWA7XG4gICAgICB9XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlZGlyZWN0X3VybDogcmVkaXJlY3RfdXJsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCk7XG4gICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICBjb2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRfaWQsIHtcbiAgICAgICAgICAkdW5zZXQ6IHtcbiAgICAgICAgICAgIFwiaW5zdGFuY2VzXCI6IDEsXG4gICAgICAgICAgICBcImluc3RhbmNlX3N0YXRlXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvcicsICfnlLPor7fljZXlt7LliKDpmaQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRJbml0V2lkdGhQZXJjZW50ID0gKG9iamVjdF9uYW1lLCBjb2x1bW5zKSAtPlxyXG5cdF9zY2hlbWEgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSk/Ll9zY2hlbWFcclxuXHRjb2x1bW5fbnVtID0gMFxyXG5cdGlmIF9zY2hlbWFcclxuXHRcdF8uZWFjaCBjb2x1bW5zLCAoZmllbGRfbmFtZSkgLT5cclxuXHRcdFx0ZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSlcclxuXHRcdFx0aXNfd2lkZSA9IGZpZWxkW2ZpZWxkX25hbWVdPy5hdXRvZm9ybT8uaXNfd2lkZVxyXG5cdFx0XHRpZiBpc193aWRlXHJcblx0XHRcdFx0Y29sdW1uX251bSArPSAyXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRjb2x1bW5fbnVtICs9IDFcclxuXHJcblx0XHRpbml0X3dpZHRoX3BlcmNlbnQgPSAxMDAgLyBjb2x1bW5fbnVtXHJcblx0XHRyZXR1cm4gaW5pdF93aWR0aF9wZXJjZW50XHJcblxyXG5DcmVhdG9yLmdldEZpZWxkSXNXaWRlID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lKSAtPlxyXG5cdF9zY2hlbWEgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSkuX3NjaGVtYVxyXG5cdGlmIF9zY2hlbWFcclxuXHRcdGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpXHJcblx0XHRpc193aWRlID0gZmllbGRbZmllbGRfbmFtZV0/LmF1dG9mb3JtPy5pc193aWRlXHJcblx0XHRyZXR1cm4gaXNfd2lkZVxyXG5cclxuQ3JlYXRvci5nZXRUYWJ1bGFyT3JkZXIgPSAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1ucykgLT5cclxuXHRzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucz8uc2V0dGluZ3M/LmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIn0pXHJcblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0Y29sdW1ucyA9IF8ubWFwIGNvbHVtbnMsIChjb2x1bW4pLT5cclxuXHRcdGZpZWxkID0gb2JqLmZpZWxkc1tjb2x1bW5dXHJcblx0XHRpZiBmaWVsZD8udHlwZSBhbmQgIWZpZWxkLmhpZGRlblxyXG5cdFx0XHRyZXR1cm4gY29sdW1uXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcclxuXHRjb2x1bW5zID0gXy5jb21wYWN0IGNvbHVtbnNcclxuXHRpZiBzZXR0aW5nIGFuZCBzZXR0aW5nLnNldHRpbmdzXHJcblx0XHRzb3J0ID0gc2V0dGluZy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdPy5zb3J0IHx8IFtdXHJcblx0XHRzb3J0ID0gXy5tYXAgc29ydCwgKG9yZGVyKS0+XHJcblx0XHRcdGtleSA9IG9yZGVyWzBdXHJcblx0XHRcdGluZGV4ID0gXy5pbmRleE9mKGNvbHVtbnMsIGtleSlcclxuXHRcdFx0b3JkZXJbMF0gPSBpbmRleCArIDFcclxuXHRcdFx0cmV0dXJuIG9yZGVyXHJcblx0XHRyZXR1cm4gc29ydFxyXG5cdHJldHVybiBbXVxyXG5cclxuXHJcbkNyZWF0b3IuaW5pdExpc3RWaWV3cyA9IChvYmplY3RfbmFtZSktPlxyXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXHJcblx0ZXh0cmFfY29sdW1ucyA9IFtcIm93bmVyXCJdXHJcblx0ZGVmYXVsdF9leHRyYV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJvd25lclwiXVxyXG5cdGlmIGRlZmF1bHRfZXh0cmFfY29sdW1uc1xyXG5cdFx0ZXh0cmFfY29sdW1ucyA9IF8udW5pb24gZXh0cmFfY29sdW1ucywgZGVmYXVsdF9leHRyYV9jb2x1bW5zXHJcblxyXG5cdG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChvYmplY3RfbmFtZSkgfHwgW11cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzP1tvYmplY3RfbmFtZV0gPSBbXVxyXG5cclxuQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcgPSAoZGVmYXVsdF92aWV3LCBsaXN0X3ZpZXcsIGxpc3Rfdmlld19uYW1lKS0+XHJcblx0ZGVmYXVsdF9jb2x1bW5zID0gZGVmYXVsdF92aWV3Py5jb2x1bW5zXHJcblx0ZGVmYXVsdF9tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfdmlldz8ubW9iaWxlX2NvbHVtbnNcclxuXHR1bmxlc3MgbGlzdF92aWV3XHJcblx0XHRyZXR1cm5cclxuXHRvaXRlbSA9IF8uY2xvbmUobGlzdF92aWV3KVxyXG5cdGlmICFfLmhhcyhvaXRlbSwgXCJuYW1lXCIpXHJcblx0XHRvaXRlbS5uYW1lID0gbGlzdF92aWV3X25hbWVcclxuXHRpZiAhb2l0ZW0uY29sdW1uc1xyXG5cdFx0aWYgZGVmYXVsdF9jb2x1bW5zXHJcblx0XHRcdG9pdGVtLmNvbHVtbnMgPSBkZWZhdWx0X2NvbHVtbnNcclxuXHRpZiAhb2l0ZW0uY29sdW1uc1xyXG5cdFx0b2l0ZW0uY29sdW1ucyA9IFtcIm5hbWVcIl1cclxuXHRpZiAhb2l0ZW0ubW9iaWxlX2NvbHVtbnNcclxuXHRcdGlmIGRlZmF1bHRfbW9iaWxlX2NvbHVtbnNcclxuXHRcdFx0b2l0ZW0ubW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X21vYmlsZV9jb2x1bW5zXHJcblxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpICYmICFfLmluY2x1ZGUob2l0ZW0uY29sdW1ucywgJ3NwYWNlJylcclxuXHRcdFx0b2l0ZW0uY29sdW1ucy5wdXNoKCdzcGFjZScpXHJcblxyXG5cclxuXHRpZiAhb2l0ZW0uZmlsdGVyX3Njb3BlXHJcblx0XHQjIGxpc3R2aWV36KeG5Zu+55qEZmlsdGVyX3Njb3Bl6buY6K6k5YC85pS55Li6c3BhY2UgIzEzMVxyXG5cdFx0b2l0ZW0uZmlsdGVyX3Njb3BlID0gXCJzcGFjZVwiXHJcblxyXG5cdGlmICFfLmhhcyhvaXRlbSwgXCJfaWRcIilcclxuXHRcdG9pdGVtLl9pZCA9IGxpc3Rfdmlld19uYW1lXHJcblx0ZWxzZVxyXG5cdFx0b2l0ZW0ubGFiZWwgPSBvaXRlbS5sYWJlbCB8fCBsaXN0X3ZpZXcubmFtZVxyXG5cclxuXHRpZiBfLmlzU3RyaW5nKG9pdGVtLm9wdGlvbnMpXHJcblx0XHRvaXRlbS5vcHRpb25zID0gSlNPTi5wYXJzZShvaXRlbS5vcHRpb25zKVxyXG5cclxuXHRfLmZvckVhY2ggb2l0ZW0uZmlsdGVycywgKGZpbHRlciwgX2luZGV4KS0+XHJcblx0XHRpZiAhXy5pc0FycmF5KGZpbHRlcikgJiYgXy5pc09iamVjdChmaWx0ZXIpXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihmaWx0ZXI/LnZhbHVlKVxyXG5cdFx0XHRcdFx0ZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpbHRlcj8uX3ZhbHVlKVxyXG5cdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyLl92YWx1ZX0pXCIpXHJcblx0cmV0dXJuIG9pdGVtXHJcblxyXG5cclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0Q3JlYXRvci5nZXRSZWxhdGVkTGlzdCA9IChvYmplY3RfbmFtZSktPlxyXG5cdFx0dW5sZXNzIG9iamVjdF9uYW1lXHJcblx0XHRcdHJldHVyblxyXG5cdFx0cmVsYXRlZExpc3RPYmplY3RzID0ge31cclxuXHRcdHJlbGF0ZWRMaXN0TmFtZXMgPSBbXVxyXG5cdFx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cclxuXHRcdGlmIF9vYmplY3RcclxuXHRcdFx0cmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0XHJcblx0XHRcdGlmICFfLmlzRW1wdHkgcmVsYXRlZExpc3RcclxuXHRcdFx0XHRfLmVhY2ggcmVsYXRlZExpc3QsIChvYmpPck5hbWUpLT5cclxuXHRcdFx0XHRcdGlmIF8uaXNPYmplY3Qgb2JqT3JOYW1lXHJcblx0XHRcdFx0XHRcdHJlbGF0ZWQgPVxyXG5cdFx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmpPck5hbWUub2JqZWN0TmFtZVxyXG5cdFx0XHRcdFx0XHRcdGNvbHVtbnM6IG9iak9yTmFtZS5jb2x1bW5zXHJcblx0XHRcdFx0XHRcdFx0bW9iaWxlX2NvbHVtbnM6IG9iak9yTmFtZS5tb2JpbGVfY29sdW1uc1xyXG5cdFx0XHRcdFx0XHRcdGlzX2ZpbGU6IG9iak9yTmFtZS5vYmplY3ROYW1lID09IFwiY21zX2ZpbGVzXCJcclxuXHRcdFx0XHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb246IG9iak9yTmFtZS5maWx0ZXJzXHJcblx0XHRcdFx0XHRcdFx0c29ydDogb2JqT3JOYW1lLnNvcnRcclxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWU6ICcnXHJcblx0XHRcdFx0XHRcdFx0Y3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWVcclxuXHRcdFx0XHRcdFx0XHRsYWJlbDogb2JqT3JOYW1lLmxhYmVsXHJcblx0XHRcdFx0XHRcdFx0YWN0aW9uczogb2JqT3JOYW1lLmFjdGlvbnNcclxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3RPYmplY3RzW29iak9yTmFtZS5vYmplY3ROYW1lXSA9IHJlbGF0ZWRcclxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3ROYW1lcy5wdXNoIG9iak9yTmFtZS5vYmplY3ROYW1lXHJcblx0XHRcdFx0XHRlbHNlIGlmIF8uaXNTdHJpbmcgb2JqT3JOYW1lXHJcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0TmFtZXMucHVzaCBvYmpPck5hbWVcclxuXHJcblx0XHRtYXBMaXN0ID0ge31cclxuXHRcdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpXHJcblx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3RzLCAocmVsYXRlZF9vYmplY3RfaXRlbSkgLT5cclxuXHRcdFx0aWYgIXJlbGF0ZWRfb2JqZWN0X2l0ZW0/Lm9iamVjdF9uYW1lXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lXHJcblx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uZm9yZWlnbl9rZXlcclxuXHRcdFx0c2hhcmluZyA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uc2hhcmluZ1xyXG5cdFx0XHRyZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXHJcblx0XHRcdHVubGVzcyByZWxhdGVkX29iamVjdFxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXHJcblx0XHRcdGNvbHVtbnMgPSBfLndpdGhvdXQoY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxyXG5cdFx0XHRtb2JpbGVfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgdHJ1ZSkgfHwgW1wibmFtZVwiXVxyXG5cdFx0XHRtb2JpbGVfY29sdW1ucyA9IF8ud2l0aG91dChtb2JpbGVfY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxyXG5cclxuXHRcdFx0b3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXHJcblx0XHRcdHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpXHJcblxyXG5cdFx0XHRpZiAvXFx3K1xcLlxcJFxcLlxcdysvZy50ZXN0KHJlbGF0ZWRfZmllbGRfbmFtZSlcclxuXHRcdFx0XHQjIG9iamVjdOexu+Wei+W4puWtkOWxnuaAp+eahHJlbGF0ZWRfZmllbGRfbmFtZeimgeWOu+aOieS4remXtOeahOe+juWFg+espuWPt++8jOWQpuWImeaYvuekuuS4jeWHuuWtl+auteWAvFxyXG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfZmllbGRfbmFtZS5yZXBsYWNlKC9cXCRcXC4vLFwiXCIpXHJcblx0XHRcdHJlbGF0ZWQgPVxyXG5cdFx0XHRcdG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lXHJcblx0XHRcdFx0Y29sdW1uczogY29sdW1uc1xyXG5cdFx0XHRcdG1vYmlsZV9jb2x1bW5zOiBtb2JpbGVfY29sdW1uc1xyXG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lXHJcblx0XHRcdFx0aXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXHJcblx0XHRcdFx0c2hhcmluZzogc2hhcmluZ1xyXG5cclxuXHRcdFx0cmVsYXRlZE9iamVjdCA9IHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXVxyXG5cdFx0XHRpZiByZWxhdGVkT2JqZWN0XHJcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5jb2x1bW5zXHJcblx0XHRcdFx0XHRyZWxhdGVkLmNvbHVtbnMgPSByZWxhdGVkT2JqZWN0LmNvbHVtbnNcclxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zXHJcblx0XHRcdFx0XHRyZWxhdGVkLm1vYmlsZV9jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1uc1xyXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3Quc29ydFxyXG5cdFx0XHRcdFx0cmVsYXRlZC5zb3J0ID0gcmVsYXRlZE9iamVjdC5zb3J0XHJcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb25cclxuXHRcdFx0XHRcdHJlbGF0ZWQuZmlsdGVyc0Z1bmN0aW9uID0gcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb25cclxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0XHJcblx0XHRcdFx0XHRyZWxhdGVkLmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0ID0gcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdFxyXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QubGFiZWxcclxuXHRcdFx0XHRcdHJlbGF0ZWQubGFiZWwgPSByZWxhdGVkT2JqZWN0LmxhYmVsXHJcblx0XHRcdFx0ZGVsZXRlIHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXVxyXG5cclxuXHRcdFx0bWFwTGlzdFtyZWxhdGVkLm9iamVjdF9uYW1lXSA9IHJlbGF0ZWRcclxuXHJcblxyXG5cdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxyXG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soXy52YWx1ZXMocmVsYXRlZExpc3RPYmplY3RzKSwgXCJvYmplY3RfbmFtZVwiKVxyXG5cdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXHJcblx0XHR1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZSByZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHNcclxuXHRcdF8uZWFjaCByZWxhdGVkTGlzdE9iamVjdHMsICh2LCByZWxhdGVkX29iamVjdF9uYW1lKSAtPlxyXG5cdFx0XHRpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMVxyXG5cdFx0XHRhbGxvd1JlYWQgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk/LmFsbG93UmVhZFxyXG5cdFx0XHRpZiBpc0FjdGl2ZSAmJiBhbGxvd1JlYWRcclxuXHRcdFx0XHRtYXBMaXN0W3JlbGF0ZWRfb2JqZWN0X25hbWVdID0gdlxyXG5cclxuXHRcdGxpc3QgPSBbXVxyXG5cdFx0aWYgXy5pc0VtcHR5IHJlbGF0ZWRMaXN0TmFtZXNcclxuXHRcdFx0bGlzdCA9ICBfLnZhbHVlcyBtYXBMaXN0XHJcblx0XHRlbHNlXHJcblx0XHRcdF8uZWFjaCByZWxhdGVkTGlzdE5hbWVzLCAob2JqZWN0TmFtZSkgLT5cclxuXHRcdFx0XHRpZiBtYXBMaXN0W29iamVjdE5hbWVdXHJcblx0XHRcdFx0XHRsaXN0LnB1c2ggbWFwTGlzdFtvYmplY3ROYW1lXVxyXG5cclxuXHRcdGlmIF8uaGFzKF9vYmplY3QsICdhbGxvd19yZWxhdGVkTGlzdCcpXHJcblx0XHRcdGxpc3QgPSBfLmZpbHRlciBsaXN0LCAoaXRlbSktPlxyXG5cdFx0XHRcdHJldHVybiBfLmluY2x1ZGUoX29iamVjdC5hbGxvd19yZWxhdGVkTGlzdCwgaXRlbS5vYmplY3RfbmFtZSlcclxuXHJcblx0XHRyZXR1cm4gbGlzdFxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0cmV0dXJuIF8uZmlyc3QoQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpKVxyXG5cclxuIyMjIFxyXG5cdOWPluWHumxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvu+8jOWmguaenOS4jeWtmOWcqOaIluiAheayoeacieadg+mZkO+8jOWwsei/lOWbnuesrOS4gOS4quinhuWbvlxyXG5cdGV4YWPkuLp0cnVl5pe277yM6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5LiN6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+XHJcbiMjI1xyXG5DcmVhdG9yLmdldExpc3RWaWV3ID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGV4YWMpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFsaXN0X3ZpZXdfaWRcclxuXHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcclxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRpZiAhb2JqZWN0XHJcblx0XHRyZXR1cm5cclxuXHRsaXN0Vmlld3MgPSBDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSlcclxuXHR1bmxlc3MgbGlzdFZpZXdzPy5sZW5ndGhcclxuXHRcdHJldHVyblxyXG5cdGxpc3RfdmlldyA9IF8uZmluZFdoZXJlKGxpc3RWaWV3cyx7XCJfaWRcIjpsaXN0X3ZpZXdfaWR9KVxyXG5cdHVubGVzcyBsaXN0X3ZpZXdcclxuXHRcdCMg5aaC5p6c5LiN6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5YiZ6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+77yM5Y+N5LmL6L+U5Zue56m6XHJcblx0XHRpZiBleGFjXHJcblx0XHRcdHJldHVyblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRsaXN0X3ZpZXcgPSBsaXN0Vmlld3NbMF1cclxuXHRyZXR1cm4gbGlzdF92aWV3XHJcblxyXG4j6I635Y+WbGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+5piv5ZCm5piv5pyA6L+R5p+l55yL6KeG5Zu+XHJcbkNyZWF0b3IuZ2V0TGlzdFZpZXdJc1JlY2VudCA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0XHRpZiAhbGlzdF92aWV3X2lkXHJcblx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXHJcblx0aWYgdHlwZW9mKGxpc3Rfdmlld19pZCkgPT0gXCJzdHJpbmdcIlxyXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0XHRpZiAhb2JqZWN0XHJcblx0XHRcdHJldHVyblxyXG5cdFx0bGlzdFZpZXcgPSBfLmZpbmRXaGVyZShvYmplY3QubGlzdF92aWV3cyx7X2lkOiBsaXN0X3ZpZXdfaWR9KVxyXG5cdGVsc2VcclxuXHRcdGxpc3RWaWV3ID0gbGlzdF92aWV3X2lkXHJcblx0cmV0dXJuIGxpc3RWaWV3Py5uYW1lID09IFwicmVjZW50XCJcclxuXHJcblxyXG4jIyNcclxuICAgIOS7jmNvbHVtbnPlj4LmlbDkuK3ov4fmu6Tlh7rnlKjkuo7miYvmnLrnq6/mmL7npLrnmoRjb2x1bW5zXHJcblx06KeE5YiZ77yaXHJcblx0MS7kvJjlhYjmiopjb2x1bW5z5Lit55qEbmFtZeWtl+auteaOkuWcqOesrOS4gOS4qlxyXG5cdDIu5pyA5aSa5Y+q6L+U5ZueNOS4quWtl+autVxyXG5cdDMu6ICD6JmR5a695a2X5q615Y2g55So5pW06KGM6KeE5YiZ5p2h5Lu25LiL77yM5pyA5aSa5Y+q6L+U5Zue5Lik6KGMXHJcbiMjI1xyXG5DcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zID0gKG9iamVjdF9uYW1lLCBjb2x1bW5zKS0+XHJcblx0cmVzdWx0ID0gW11cclxuXHRtYXhSb3dzID0gMiBcclxuXHRtYXhDb3VudCA9IG1heFJvd3MgKiAyXHJcblx0Y291bnQgPSAwXHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0ZmllbGRzID0gb2JqZWN0LmZpZWxkc1xyXG5cdHVubGVzcyBvYmplY3RcclxuXHRcdHJldHVybiBjb2x1bW5zXHJcblx0bmFtZUtleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWVxyXG5cdGlzTmFtZUNvbHVtbiA9IChpdGVtKS0+XHJcblx0XHRpZiBfLmlzT2JqZWN0KGl0ZW0pXHJcblx0XHRcdHJldHVybiBpdGVtLmZpZWxkID09IG5hbWVLZXlcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIGl0ZW0gPT0gbmFtZUtleVxyXG5cdGdldEZpZWxkID0gKGl0ZW0pLT5cclxuXHRcdGlmIF8uaXNPYmplY3QoaXRlbSlcclxuXHRcdFx0cmV0dXJuIGZpZWxkc1tpdGVtLmZpZWxkXVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gZmllbGRzW2l0ZW1dXHJcblx0aWYgbmFtZUtleVxyXG5cdFx0bmFtZUNvbHVtbiA9IGNvbHVtbnMuZmluZCAoaXRlbSktPlxyXG5cdFx0XHRyZXR1cm4gaXNOYW1lQ29sdW1uKGl0ZW0pXHJcblx0aWYgbmFtZUNvbHVtblxyXG5cdFx0ZmllbGQgPSBnZXRGaWVsZChuYW1lQ29sdW1uKVxyXG5cdFx0aXRlbUNvdW50ID0gaWYgZmllbGQuaXNfd2lkZSB0aGVuIDIgZWxzZSAxXHJcblx0XHRjb3VudCArPSBpdGVtQ291bnRcclxuXHRcdHJlc3VsdC5wdXNoIG5hbWVDb2x1bW5cclxuXHRjb2x1bW5zLmZvckVhY2ggKGl0ZW0pLT5cclxuXHRcdGZpZWxkID0gZ2V0RmllbGQoaXRlbSlcclxuXHRcdHVubGVzcyBmaWVsZFxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdGl0ZW1Db3VudCA9IGlmIGZpZWxkLmlzX3dpZGUgdGhlbiAyIGVsc2UgMVxyXG5cdFx0aWYgY291bnQgPCBtYXhDb3VudCBhbmQgcmVzdWx0Lmxlbmd0aCA8IG1heENvdW50IGFuZCAhaXNOYW1lQ29sdW1uKGl0ZW0pXHJcblx0XHRcdGNvdW50ICs9IGl0ZW1Db3VudFxyXG5cdFx0XHRpZiBjb3VudCA8PSBtYXhDb3VudFxyXG5cdFx0XHRcdHJlc3VsdC5wdXNoIGl0ZW1cclxuXHRcclxuXHRyZXR1cm4gcmVzdWx0XHJcblxyXG4jIyNcclxuICAgIOiOt+WPlum7mOiupOinhuWbvlxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyA9IChvYmplY3RfbmFtZSktPlxyXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGlmICFvYmplY3RcclxuXHRcdG9iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cclxuXHRpZiBvYmplY3Q/Lmxpc3Rfdmlld3M/LmRlZmF1bHRcclxuXHRcdCNUT0RPIOatpOS7o+eggeWPquaYr+aaguaXtuWFvOWuueS7peWJjWNvZGXkuK3lrprkuYnnmoRkZWZhdWx06KeG5Zu+77yM5b6FY29kZeS4reeahGRlZmF1bHTmuIXnkIblrozmiJDlkI7vvIzpnIDopoHliKDpmaTmraTku6PnoIFcclxuXHRcdGRlZmF1bHRWaWV3ID0gb2JqZWN0Lmxpc3Rfdmlld3MuZGVmYXVsdFxyXG5cdGVsc2VcclxuXHRcdF8uZWFjaCBvYmplY3Q/Lmxpc3Rfdmlld3MsIChsaXN0X3ZpZXcsIGtleSktPlxyXG5cdFx0XHRpZiBsaXN0X3ZpZXcubmFtZSA9PSBcImFsbFwiIHx8IGtleSA9PSBcImFsbFwiXHJcblx0XHRcdFx0ZGVmYXVsdFZpZXcgPSBsaXN0X3ZpZXdcclxuXHRyZXR1cm4gZGVmYXVsdFZpZXc7XHJcblxyXG4jIyNcclxuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOaYvuekuuWtl+autVxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IChvYmplY3RfbmFtZSwgdXNlX21vYmlsZV9jb2x1bW5zKS0+XHJcblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxyXG5cdGNvbHVtbnMgPSBkZWZhdWx0Vmlldz8uY29sdW1uc1xyXG5cdGlmIHVzZV9tb2JpbGVfY29sdW1uc1xyXG5cdFx0aWYgZGVmYXVsdFZpZXc/Lm1vYmlsZV9jb2x1bW5zXHJcblx0XHRcdGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1uc1xyXG5cdFx0ZWxzZSBpZiBjb2x1bW5zXHJcblx0XHRcdGNvbHVtbnMgPSBDcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zKG9iamVjdF9uYW1lLCBjb2x1bW5zKVxyXG5cdHJldHVybiBjb2x1bW5zXHJcblxyXG4jIyNcclxuXHTojrflj5blr7nosaHnmoTliJfooajpu5jorqTpop3lpJbliqDovb3nmoTlrZfmrrVcclxuIyMjXHJcbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyA9IChvYmplY3RfbmFtZSktPlxyXG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcclxuXHRyZXR1cm4gZGVmYXVsdFZpZXc/LmV4dHJhX2NvbHVtbnNcclxuXHJcbiMjI1xyXG5cdOiOt+WPluWvueixoeeahOm7mOiupOaOkuW6j1xyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydCA9IChvYmplY3RfbmFtZSktPlxyXG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcclxuXHRpZiBkZWZhdWx0Vmlld1xyXG5cdFx0aWYgZGVmYXVsdFZpZXcuc29ydFxyXG5cdFx0XHRyZXR1cm4gZGVmYXVsdFZpZXcuc29ydFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gW1tcImNyZWF0ZWRcIiwgXCJkZXNjXCJdXVxyXG5cclxuXHJcbiMjI1xyXG4gICAg5Yik5pat5piv5ZCmQWxsIHZpZXdcclxuIyMjXHJcbkNyZWF0b3IuaXNBbGxWaWV3ID0gKGxpc3RfdmlldyktPlxyXG5cdHJldHVybiBsaXN0X3ZpZXc/Lm5hbWUgPT0gXCJhbGxcIlxyXG5cclxuIyMjXHJcbiAgICDliKTmlq3mmK/lkKbmnIDov5Hmn6XnnIsgdmlld1xyXG4jIyNcclxuQ3JlYXRvci5pc1JlY2VudFZpZXcgPSAobGlzdF92aWV3KS0+XHJcblx0cmV0dXJuIGxpc3Rfdmlldz8ubmFtZSA9PSBcInJlY2VudFwiXHJcblxyXG4jIyNcclxuICAgIOWwhnNvcnTovazmjaLkuLpUYWJ1bGFy5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXHJcbiMjI1xyXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIgPSAoc29ydCwgdGFidWxhckNvbHVtbnMpLT5cclxuXHR0YWJ1bGFyX3NvcnQgPSBbXVxyXG5cdF8uZWFjaCBzb3J0LCAoaXRlbSktPlxyXG5cdFx0aWYgXy5pc0FycmF5KGl0ZW0pXHJcblx0XHRcdCMg5YW85a655pen55qE5pWw5o2u5qC85byPW1tcImZpZWxkX25hbWVcIiwgXCJvcmRlclwiXV1cclxuXHRcdFx0aWYgaXRlbS5sZW5ndGggPT0gMVxyXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSlcclxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxyXG5cdFx0XHRcdFx0dGFidWxhcl9zb3J0LnB1c2ggW2NvbHVtbl9pbmRleCwgXCJhc2NcIl1cclxuXHRcdFx0ZWxzZSBpZiBpdGVtLmxlbmd0aCA9PSAyXHJcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxyXG5cdFx0XHRcdGlmIGNvbHVtbl9pbmRleCA+IC0xXHJcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBpdGVtWzFdXVxyXG5cdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGl0ZW0pXHJcblx0XHRcdCPmlrDmlbDmja7moLzlvI/vvJpbe2ZpZWxkX25hbWU6ICwgb3JkZXI6IH1dXHJcblx0XHRcdGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWVcclxuXHRcdFx0b3JkZXIgPSBpdGVtLm9yZGVyXHJcblx0XHRcdGlmIGZpZWxkX25hbWUgJiYgb3JkZXJcclxuXHRcdFx0XHRjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGZpZWxkX25hbWUpXHJcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcclxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIG9yZGVyXVxyXG5cclxuXHRyZXR1cm4gdGFidWxhcl9zb3J0XHJcblxyXG4jIyNcclxuICAgIOWwhnNvcnTovazmjaLkuLpEZXZFeHByZXNz5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXHJcbiMjI1xyXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb0RYID0gKHNvcnQpLT5cclxuXHRkeF9zb3J0ID0gW11cclxuXHRfLmVhY2ggc29ydCwgKGl0ZW0pLT5cclxuXHRcdGlmIF8uaXNBcnJheShpdGVtKVxyXG5cdFx0XHQj5YW85a655pen5qC85byP77yaW1tcImZpZWxkX25hbWVcIiwgXCJvcmRlclwiXV1cclxuXHRcdFx0ZHhfc29ydC5wdXNoKGl0ZW0pXHJcblx0XHRlbHNlIGlmIF8uaXNPYmplY3QoaXRlbSlcclxuXHRcdFx0I+aWsOaVsOaNruagvOW8j++8mlt7ZmllbGRfbmFtZTogLCBvcmRlcjogfV1cclxuXHRcdFx0ZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZVxyXG5cdFx0XHRvcmRlciA9IGl0ZW0ub3JkZXJcclxuXHRcdFx0aWYgZmllbGRfbmFtZSAmJiBvcmRlclxyXG5cdFx0XHRcdGR4X3NvcnQucHVzaCBbZmllbGRfbmFtZSwgb3JkZXJdXHJcblxyXG5cdHJldHVybiBkeF9zb3J0XHJcbiIsIkNyZWF0b3IuZ2V0SW5pdFdpZHRoUGVyY2VudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBjb2x1bW5zKSB7XG4gIHZhciBfc2NoZW1hLCBjb2x1bW5fbnVtLCBpbml0X3dpZHRoX3BlcmNlbnQsIHJlZjtcbiAgX3NjaGVtYSA9IChyZWYgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuX3NjaGVtYSA6IHZvaWQgMDtcbiAgY29sdW1uX251bSA9IDA7XG4gIGlmIChfc2NoZW1hKSB7XG4gICAgXy5lYWNoKGNvbHVtbnMsIGZ1bmN0aW9uKGZpZWxkX25hbWUpIHtcbiAgICAgIHZhciBmaWVsZCwgaXNfd2lkZSwgcmVmMSwgcmVmMjtcbiAgICAgIGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpO1xuICAgICAgaXNfd2lkZSA9IChyZWYxID0gZmllbGRbZmllbGRfbmFtZV0pICE9IG51bGwgPyAocmVmMiA9IHJlZjEuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYyLmlzX3dpZGUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoaXNfd2lkZSkge1xuICAgICAgICByZXR1cm4gY29sdW1uX251bSArPSAyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNvbHVtbl9udW0gKz0gMTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpbml0X3dpZHRoX3BlcmNlbnQgPSAxMDAgLyBjb2x1bW5fbnVtO1xuICAgIHJldHVybiBpbml0X3dpZHRoX3BlcmNlbnQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRJc1dpZGUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSkge1xuICB2YXIgX3NjaGVtYSwgZmllbGQsIGlzX3dpZGUsIHJlZiwgcmVmMTtcbiAgX3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKS5fc2NoZW1hO1xuICBpZiAoX3NjaGVtYSkge1xuICAgIGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpO1xuICAgIGlzX3dpZGUgPSAocmVmID0gZmllbGRbZmllbGRfbmFtZV0pICE9IG51bGwgPyAocmVmMSA9IHJlZi5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjEuaXNfd2lkZSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICByZXR1cm4gaXNfd2lkZTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRUYWJ1bGFyT3JkZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5zKSB7XG4gIHZhciBvYmosIHJlZiwgcmVmMSwgcmVmMiwgc2V0dGluZywgc29ydDtcbiAgc2V0dGluZyA9IChyZWYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zKSAhPSBudWxsID8gKHJlZjEgPSByZWYuc2V0dGluZ3MpICE9IG51bGwgPyByZWYxLmZpbmRPbmUoe1xuICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiXG4gIH0pIDogdm9pZCAwIDogdm9pZCAwO1xuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBfLm1hcChjb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4pIHtcbiAgICB2YXIgZmllbGQ7XG4gICAgZmllbGQgPSBvYmouZmllbGRzW2NvbHVtbl07XG4gICAgaWYgKChmaWVsZCAhPSBudWxsID8gZmllbGQudHlwZSA6IHZvaWQgMCkgJiYgIWZpZWxkLmhpZGRlbikge1xuICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gIH0pO1xuICBjb2x1bW5zID0gXy5jb21wYWN0KGNvbHVtbnMpO1xuICBpZiAoc2V0dGluZyAmJiBzZXR0aW5nLnNldHRpbmdzKSB7XG4gICAgc29ydCA9ICgocmVmMiA9IHNldHRpbmcuc2V0dGluZ3NbbGlzdF92aWV3X2lkXSkgIT0gbnVsbCA/IHJlZjIuc29ydCA6IHZvaWQgMCkgfHwgW107XG4gICAgc29ydCA9IF8ubWFwKHNvcnQsIGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgICB2YXIgaW5kZXgsIGtleTtcbiAgICAgIGtleSA9IG9yZGVyWzBdO1xuICAgICAgaW5kZXggPSBfLmluZGV4T2YoY29sdW1ucywga2V5KTtcbiAgICAgIG9yZGVyWzBdID0gaW5kZXggKyAxO1xuICAgICAgcmV0dXJuIG9yZGVyO1xuICAgIH0pO1xuICAgIHJldHVybiBzb3J0O1xuICB9XG4gIHJldHVybiBbXTtcbn07XG5cbkNyZWF0b3IuaW5pdExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBjb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnMsIGV4dHJhX2NvbHVtbnMsIG9iamVjdCwgb3JkZXIsIHJlZjtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXTtcbiAgZXh0cmFfY29sdW1ucyA9IFtcIm93bmVyXCJdO1xuICBkZWZhdWx0X2V4dHJhX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm93bmVyXCJdO1xuICBpZiAoZGVmYXVsdF9leHRyYV9jb2x1bW5zKSB7XG4gICAgZXh0cmFfY29sdW1ucyA9IF8udW5pb24oZXh0cmFfY29sdW1ucywgZGVmYXVsdF9leHRyYV9jb2x1bW5zKTtcbiAgfVxuICBvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQob2JqZWN0X25hbWUpIHx8IFtdO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLlRhYnVsYXJTZWxlY3RlZElkcykgIT0gbnVsbCA/IHJlZltvYmplY3RfbmFtZV0gPSBbXSA6IHZvaWQgMDtcbiAgfVxufTtcblxuQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcgPSBmdW5jdGlvbihkZWZhdWx0X3ZpZXcsIGxpc3RfdmlldywgbGlzdF92aWV3X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRfY29sdW1ucywgZGVmYXVsdF9tb2JpbGVfY29sdW1ucywgb2l0ZW07XG4gIGRlZmF1bHRfY29sdW1ucyA9IGRlZmF1bHRfdmlldyAhPSBudWxsID8gZGVmYXVsdF92aWV3LmNvbHVtbnMgOiB2b2lkIDA7XG4gIGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXcgIT0gbnVsbCA/IGRlZmF1bHRfdmlldy5tb2JpbGVfY29sdW1ucyA6IHZvaWQgMDtcbiAgaWYgKCFsaXN0X3ZpZXcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgb2l0ZW0gPSBfLmNsb25lKGxpc3Rfdmlldyk7XG4gIGlmICghXy5oYXMob2l0ZW0sIFwibmFtZVwiKSkge1xuICAgIG9pdGVtLm5hbWUgPSBsaXN0X3ZpZXdfbmFtZTtcbiAgfVxuICBpZiAoIW9pdGVtLmNvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdF9jb2x1bW5zKSB7XG4gICAgICBvaXRlbS5jb2x1bW5zID0gZGVmYXVsdF9jb2x1bW5zO1xuICAgIH1cbiAgfVxuICBpZiAoIW9pdGVtLmNvbHVtbnMpIHtcbiAgICBvaXRlbS5jb2x1bW5zID0gW1wibmFtZVwiXTtcbiAgfVxuICBpZiAoIW9pdGVtLm1vYmlsZV9jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMpIHtcbiAgICAgIG9pdGVtLm1vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF9tb2JpbGVfY29sdW1ucztcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkgJiYgIV8uaW5jbHVkZShvaXRlbS5jb2x1bW5zLCAnc3BhY2UnKSkge1xuICAgICAgb2l0ZW0uY29sdW1ucy5wdXNoKCdzcGFjZScpO1xuICAgIH1cbiAgfVxuICBpZiAoIW9pdGVtLmZpbHRlcl9zY29wZSkge1xuICAgIG9pdGVtLmZpbHRlcl9zY29wZSA9IFwic3BhY2VcIjtcbiAgfVxuICBpZiAoIV8uaGFzKG9pdGVtLCBcIl9pZFwiKSkge1xuICAgIG9pdGVtLl9pZCA9IGxpc3Rfdmlld19uYW1lO1xuICB9IGVsc2Uge1xuICAgIG9pdGVtLmxhYmVsID0gb2l0ZW0ubGFiZWwgfHwgbGlzdF92aWV3Lm5hbWU7XG4gIH1cbiAgaWYgKF8uaXNTdHJpbmcob2l0ZW0ub3B0aW9ucykpIHtcbiAgICBvaXRlbS5vcHRpb25zID0gSlNPTi5wYXJzZShvaXRlbS5vcHRpb25zKTtcbiAgfVxuICBfLmZvckVhY2gob2l0ZW0uZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyLCBfaW5kZXgpIHtcbiAgICBpZiAoIV8uaXNBcnJheShmaWx0ZXIpICYmIF8uaXNPYmplY3QoZmlsdGVyKSkge1xuICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChfLmlzU3RyaW5nKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLl92YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXIuX3ZhbHVlICsgXCIpXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9pdGVtO1xufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBDcmVhdG9yLmdldFJlbGF0ZWRMaXN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgX29iamVjdCwgbGlzdCwgbWFwTGlzdCwgcGVybWlzc2lvbnMsIHJlbGF0ZWRMaXN0LCByZWxhdGVkTGlzdE5hbWVzLCByZWxhdGVkTGlzdE9iamVjdHMsIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCByZWxhdGVkX29iamVjdHMsIHNwYWNlSWQsIHVucmVsYXRlZF9vYmplY3RzLCB1c2VySWQ7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZWxhdGVkTGlzdE9iamVjdHMgPSB7fTtcbiAgICByZWxhdGVkTGlzdE5hbWVzID0gW107XG4gICAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gICAgaWYgKF9vYmplY3QpIHtcbiAgICAgIHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdDtcbiAgICAgIGlmICghXy5pc0VtcHR5KHJlbGF0ZWRMaXN0KSkge1xuICAgICAgICBfLmVhY2gocmVsYXRlZExpc3QsIGZ1bmN0aW9uKG9iak9yTmFtZSkge1xuICAgICAgICAgIHZhciByZWxhdGVkO1xuICAgICAgICAgIGlmIChfLmlzT2JqZWN0KG9iak9yTmFtZSkpIHtcbiAgICAgICAgICAgIHJlbGF0ZWQgPSB7XG4gICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmpPck5hbWUub2JqZWN0TmFtZSxcbiAgICAgICAgICAgICAgY29sdW1uczogb2JqT3JOYW1lLmNvbHVtbnMsXG4gICAgICAgICAgICAgIG1vYmlsZV9jb2x1bW5zOiBvYmpPck5hbWUubW9iaWxlX2NvbHVtbnMsXG4gICAgICAgICAgICAgIGlzX2ZpbGU6IG9iak9yTmFtZS5vYmplY3ROYW1lID09PSBcImNtc19maWxlc1wiLFxuICAgICAgICAgICAgICBmaWx0ZXJzRnVuY3Rpb246IG9iak9yTmFtZS5maWx0ZXJzLFxuICAgICAgICAgICAgICBzb3J0OiBvYmpPck5hbWUuc29ydCxcbiAgICAgICAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lOiAnJyxcbiAgICAgICAgICAgICAgY3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWUsXG4gICAgICAgICAgICAgIGxhYmVsOiBvYmpPck5hbWUubGFiZWwsXG4gICAgICAgICAgICAgIGFjdGlvbnM6IG9iak9yTmFtZS5hY3Rpb25zXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVsYXRlZExpc3RPYmplY3RzW29iak9yTmFtZS5vYmplY3ROYW1lXSA9IHJlbGF0ZWQ7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZExpc3ROYW1lcy5wdXNoKG9iak9yTmFtZS5vYmplY3ROYW1lKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNTdHJpbmcob2JqT3JOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TmFtZXMucHVzaChvYmpPck5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIG1hcExpc3QgPSB7fTtcbiAgICByZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKTtcbiAgICBfLmVhY2gocmVsYXRlZF9vYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdF9pdGVtKSB7XG4gICAgICB2YXIgY29sdW1ucywgbW9iaWxlX2NvbHVtbnMsIG9yZGVyLCByZWxhdGVkLCByZWxhdGVkT2JqZWN0LCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lLCBzaGFyaW5nLCB0YWJ1bGFyX29yZGVyO1xuICAgICAgaWYgKCEocmVsYXRlZF9vYmplY3RfaXRlbSAhPSBudWxsID8gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ub2JqZWN0X25hbWU7XG4gICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLmZvcmVpZ25fa2V5O1xuICAgICAgc2hhcmluZyA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uc2hhcmluZztcbiAgICAgIHJlbGF0ZWRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICBpZiAoIXJlbGF0ZWRfb2JqZWN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl07XG4gICAgICBjb2x1bW5zID0gXy53aXRob3V0KGNvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSk7XG4gICAgICBtb2JpbGVfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgdHJ1ZSkgfHwgW1wibmFtZVwiXTtcbiAgICAgIG1vYmlsZV9jb2x1bW5zID0gXy53aXRob3V0KG1vYmlsZV9jb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpO1xuICAgICAgb3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgdGFidWxhcl9vcmRlciA9IENyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhcihvcmRlciwgY29sdW1ucyk7XG4gICAgICBpZiAoL1xcdytcXC5cXCRcXC5cXHcrL2cudGVzdChyZWxhdGVkX2ZpZWxkX25hbWUpKSB7XG4gICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfZmllbGRfbmFtZS5yZXBsYWNlKC9cXCRcXC4vLCBcIlwiKTtcbiAgICAgIH1cbiAgICAgIHJlbGF0ZWQgPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zLFxuICAgICAgICBtb2JpbGVfY29sdW1uczogbW9iaWxlX2NvbHVtbnMsXG4gICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICBpc19maWxlOiByZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiLFxuICAgICAgICBzaGFyaW5nOiBzaGFyaW5nXG4gICAgICB9O1xuICAgICAgcmVsYXRlZE9iamVjdCA9IHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXTtcbiAgICAgIGlmIChyZWxhdGVkT2JqZWN0KSB7XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmNvbHVtbnMpIHtcbiAgICAgICAgICByZWxhdGVkLmNvbHVtbnMgPSByZWxhdGVkT2JqZWN0LmNvbHVtbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnMpIHtcbiAgICAgICAgICByZWxhdGVkLm1vYmlsZV9jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5zb3J0KSB7XG4gICAgICAgICAgcmVsYXRlZC5zb3J0ID0gcmVsYXRlZE9iamVjdC5zb3J0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvbikge1xuICAgICAgICAgIHJlbGF0ZWQuZmlsdGVyc0Z1bmN0aW9uID0gcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3QpIHtcbiAgICAgICAgICByZWxhdGVkLmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0ID0gcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5sYWJlbCkge1xuICAgICAgICAgIHJlbGF0ZWQubGFiZWwgPSByZWxhdGVkT2JqZWN0LmxhYmVsO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSByZWxhdGVkTGlzdE9iamVjdHNbcmVsYXRlZF9vYmplY3RfbmFtZV07XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFwTGlzdFtyZWxhdGVkLm9iamVjdF9uYW1lXSA9IHJlbGF0ZWQ7XG4gICAgfSk7XG4gICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKF8udmFsdWVzKHJlbGF0ZWRMaXN0T2JqZWN0cyksIFwib2JqZWN0X25hbWVcIik7XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICAgIHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHM7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLmRpZmZlcmVuY2UocmVsYXRlZF9vYmplY3RfbmFtZXMsIHVucmVsYXRlZF9vYmplY3RzKTtcbiAgICBfLmVhY2gocmVsYXRlZExpc3RPYmplY3RzLCBmdW5jdGlvbih2LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICB2YXIgYWxsb3dSZWFkLCBpc0FjdGl2ZSwgcmVmO1xuICAgICAgaXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTE7XG4gICAgICBhbGxvd1JlYWQgPSAocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKSAhPSBudWxsID8gcmVmLmFsbG93UmVhZCA6IHZvaWQgMDtcbiAgICAgIGlmIChpc0FjdGl2ZSAmJiBhbGxvd1JlYWQpIHtcbiAgICAgICAgcmV0dXJuIG1hcExpc3RbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB2O1xuICAgICAgfVxuICAgIH0pO1xuICAgIGxpc3QgPSBbXTtcbiAgICBpZiAoXy5pc0VtcHR5KHJlbGF0ZWRMaXN0TmFtZXMpKSB7XG4gICAgICBsaXN0ID0gXy52YWx1ZXMobWFwTGlzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF8uZWFjaChyZWxhdGVkTGlzdE5hbWVzLCBmdW5jdGlvbihvYmplY3ROYW1lKSB7XG4gICAgICAgIGlmIChtYXBMaXN0W29iamVjdE5hbWVdKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3QucHVzaChtYXBMaXN0W29iamVjdE5hbWVdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChfLmhhcyhfb2JqZWN0LCAnYWxsb3dfcmVsYXRlZExpc3QnKSkge1xuICAgICAgbGlzdCA9IF8uZmlsdGVyKGxpc3QsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIF8uaW5jbHVkZShfb2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0LCBpdGVtLm9iamVjdF9uYW1lKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbGlzdDtcbiAgfTtcbn1cblxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgcmV0dXJuIF8uZmlyc3QoQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpKTtcbn07XG5cblxuLyogXG5cdOWPluWHumxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvu+8jOWmguaenOS4jeWtmOWcqOaIluiAheayoeacieadg+mZkO+8jOWwsei/lOWbnuesrOS4gOS4quinhuWbvlxuXHRleGFj5Li6dHJ1ZeaXtu+8jOmcgOimgeW8uuWItuaMiWxpc3Rfdmlld19pZOeyvuehruafpeaJvu+8jOS4jem7mOiupOi/lOWbnuesrOS4gOS4quinhuWbvlxuICovXG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBleGFjKSB7XG4gIHZhciBsaXN0Vmlld3MsIGxpc3Rfdmlldywgb2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgfVxuICB9XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGlzdFZpZXdzID0gQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpO1xuICBpZiAoIShsaXN0Vmlld3MgIT0gbnVsbCA/IGxpc3RWaWV3cy5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxpc3RfdmlldyA9IF8uZmluZFdoZXJlKGxpc3RWaWV3cywge1xuICAgIFwiX2lkXCI6IGxpc3Rfdmlld19pZFxuICB9KTtcbiAgaWYgKCFsaXN0X3ZpZXcpIHtcbiAgICBpZiAoZXhhYykge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0X3ZpZXcgPSBsaXN0Vmlld3NbMF07XG4gICAgfVxuICB9XG4gIHJldHVybiBsaXN0X3ZpZXc7XG59O1xuXG5DcmVhdG9yLmdldExpc3RWaWV3SXNSZWNlbnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkKSB7XG4gIHZhciBsaXN0Vmlldywgb2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2YgbGlzdF92aWV3X2lkID09PSBcInN0cmluZ1wiKSB7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmICghb2JqZWN0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxpc3RWaWV3ID0gXy5maW5kV2hlcmUob2JqZWN0Lmxpc3Rfdmlld3MsIHtcbiAgICAgIF9pZDogbGlzdF92aWV3X2lkXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbGlzdFZpZXcgPSBsaXN0X3ZpZXdfaWQ7XG4gIH1cbiAgcmV0dXJuIChsaXN0VmlldyAhPSBudWxsID8gbGlzdFZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwicmVjZW50XCI7XG59O1xuXG5cbi8qXG4gICAg5LuOY29sdW1uc+WPguaVsOS4rei/h+a7pOWHuueUqOS6juaJi+acuuerr+aYvuekuueahGNvbHVtbnNcblx06KeE5YiZ77yaXG5cdDEu5LyY5YWI5oqKY29sdW1uc+S4reeahG5hbWXlrZfmrrXmjpLlnKjnrKzkuIDkuKpcblx0Mi7mnIDlpJrlj6rov5Tlm5405Liq5a2X5q61XG5cdDMu6ICD6JmR5a695a2X5q615Y2g55So5pW06KGM6KeE5YiZ5p2h5Lu25LiL77yM5pyA5aSa5Y+q6L+U5Zue5Lik6KGMXG4gKi9cblxuQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBjb2x1bW5zKSB7XG4gIHZhciBjb3VudCwgZmllbGQsIGZpZWxkcywgZ2V0RmllbGQsIGlzTmFtZUNvbHVtbiwgaXRlbUNvdW50LCBtYXhDb3VudCwgbWF4Um93cywgbmFtZUNvbHVtbiwgbmFtZUtleSwgb2JqZWN0LCByZXN1bHQ7XG4gIHJlc3VsdCA9IFtdO1xuICBtYXhSb3dzID0gMjtcbiAgbWF4Q291bnQgPSBtYXhSb3dzICogMjtcbiAgY291bnQgPSAwO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IG9iamVjdC5maWVsZHM7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuIGNvbHVtbnM7XG4gIH1cbiAgbmFtZUtleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgaXNOYW1lQ29sdW1uID0gZnVuY3Rpb24oaXRlbSkge1xuICAgIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gaXRlbS5maWVsZCA9PT0gbmFtZUtleTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGl0ZW0gPT09IG5hbWVLZXk7XG4gICAgfVxuICB9O1xuICBnZXRGaWVsZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgcmV0dXJuIGZpZWxkc1tpdGVtLmZpZWxkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpZWxkc1tpdGVtXTtcbiAgICB9XG4gIH07XG4gIGlmIChuYW1lS2V5KSB7XG4gICAgbmFtZUNvbHVtbiA9IGNvbHVtbnMuZmluZChmdW5jdGlvbihpdGVtKSB7XG4gICAgICByZXR1cm4gaXNOYW1lQ29sdW1uKGl0ZW0pO1xuICAgIH0pO1xuICB9XG4gIGlmIChuYW1lQ29sdW1uKSB7XG4gICAgZmllbGQgPSBnZXRGaWVsZChuYW1lQ29sdW1uKTtcbiAgICBpdGVtQ291bnQgPSBmaWVsZC5pc193aWRlID8gMiA6IDE7XG4gICAgY291bnQgKz0gaXRlbUNvdW50O1xuICAgIHJlc3VsdC5wdXNoKG5hbWVDb2x1bW4pO1xuICB9XG4gIGNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgZmllbGQgPSBnZXRGaWVsZChpdGVtKTtcbiAgICBpZiAoIWZpZWxkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGl0ZW1Db3VudCA9IGZpZWxkLmlzX3dpZGUgPyAyIDogMTtcbiAgICBpZiAoY291bnQgPCBtYXhDb3VudCAmJiByZXN1bHQubGVuZ3RoIDwgbWF4Q291bnQgJiYgIWlzTmFtZUNvbHVtbihpdGVtKSkge1xuICAgICAgY291bnQgKz0gaXRlbUNvdW50O1xuICAgICAgaWYgKGNvdW50IDw9IG1heENvdW50KSB7XG4gICAgICAgIHJldHVybiByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG4vKlxuICAgIOiOt+WPlum7mOiupOinhuWbvlxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXcsIG9iamVjdCwgcmVmO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgfVxuICBpZiAob2JqZWN0ICE9IG51bGwgPyAocmVmID0gb2JqZWN0Lmxpc3Rfdmlld3MpICE9IG51bGwgPyByZWZbXCJkZWZhdWx0XCJdIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgZGVmYXVsdFZpZXcgPSBvYmplY3QubGlzdF92aWV3c1tcImRlZmF1bHRcIl07XG4gIH0gZWxzZSB7XG4gICAgXy5lYWNoKG9iamVjdCAhPSBudWxsID8gb2JqZWN0Lmxpc3Rfdmlld3MgOiB2b2lkIDAsIGZ1bmN0aW9uKGxpc3Rfdmlldywga2V5KSB7XG4gICAgICBpZiAobGlzdF92aWV3Lm5hbWUgPT09IFwiYWxsXCIgfHwga2V5ID09PSBcImFsbFwiKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmlldyA9IGxpc3RfdmlldztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZpZXc7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k5pi+56S65a2X5q61XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCB1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgdmFyIGNvbHVtbnMsIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3LmNvbHVtbnMgOiB2b2lkIDA7XG4gIGlmICh1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zIDogdm9pZCAwKSB7XG4gICAgICBjb2x1bW5zID0gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnM7XG4gICAgfSBlbHNlIGlmIChjb2x1bW5zKSB7XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyhvYmplY3RfbmFtZSwgY29sdW1ucyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb2x1bW5zO1xufTtcblxuXG4vKlxuXHTojrflj5blr7nosaHnmoTliJfooajpu5jorqTpop3lpJbliqDovb3nmoTlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIHJldHVybiBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuZXh0cmFfY29sdW1ucyA6IHZvaWQgMDtcbn07XG5cblxuLypcblx06I635Y+W5a+56LGh55qE6buY6K6k5o6S5bqPXG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgaWYgKGRlZmF1bHRWaWV3KSB7XG4gICAgaWYgKGRlZmF1bHRWaWV3LnNvcnQpIHtcbiAgICAgIHJldHVybiBkZWZhdWx0Vmlldy5zb3J0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW1tcImNyZWF0ZWRcIiwgXCJkZXNjXCJdXTtcbiAgICB9XG4gIH1cbn07XG5cblxuLypcbiAgICDliKTmlq3mmK/lkKZBbGwgdmlld1xuICovXG5cbkNyZWF0b3IuaXNBbGxWaWV3ID0gZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gIHJldHVybiAobGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwiYWxsXCI7XG59O1xuXG5cbi8qXG4gICAg5Yik5pat5piv5ZCm5pyA6L+R5p+l55yLIHZpZXdcbiAqL1xuXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IGZ1bmN0aW9uKGxpc3Rfdmlldykge1xuICByZXR1cm4gKGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Lm5hbWUgOiB2b2lkIDApID09PSBcInJlY2VudFwiO1xufTtcblxuXG4vKlxuICAgIOWwhnNvcnTovazmjaLkuLpUYWJ1bGFy5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4gKi9cblxuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyID0gZnVuY3Rpb24oc29ydCwgdGFidWxhckNvbHVtbnMpIHtcbiAgdmFyIHRhYnVsYXJfc29ydDtcbiAgdGFidWxhcl9zb3J0ID0gW107XG4gIF8uZWFjaChzb3J0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGNvbHVtbl9pbmRleCwgZmllbGRfbmFtZSwgb3JkZXI7XG4gICAgaWYgKF8uaXNBcnJheShpdGVtKSkge1xuICAgICAgaWYgKGl0ZW0ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBcImFzY1wiXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXRlbS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZTtcbiAgICAgIG9yZGVyID0gaXRlbS5vcmRlcjtcbiAgICAgIGlmIChmaWVsZF9uYW1lICYmIG9yZGVyKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBvcmRlcl0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRhYnVsYXJfc29ydDtcbn07XG5cblxuLypcbiAgICDlsIZzb3J06L2s5o2i5Li6RGV2RXhwcmVzc+aOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuICovXG5cbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSBmdW5jdGlvbihzb3J0KSB7XG4gIHZhciBkeF9zb3J0O1xuICBkeF9zb3J0ID0gW107XG4gIF8uZWFjaChzb3J0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGZpZWxkX25hbWUsIG9yZGVyO1xuICAgIGlmIChfLmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIHJldHVybiBkeF9zb3J0LnB1c2goaXRlbSk7XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lO1xuICAgICAgb3JkZXIgPSBpdGVtLm9yZGVyO1xuICAgICAgaWYgKGZpZWxkX25hbWUgJiYgb3JkZXIpIHtcbiAgICAgICAgcmV0dXJuIGR4X3NvcnQucHVzaChbZmllbGRfbmFtZSwgb3JkZXJdKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZHhfc29ydDtcbn07XG4iLCJTaW1wbGVTY2hlbWEuUmVnRXguY29kZSA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11bYS16QS1aMC05X10qJCcpXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XHJcblx0XHRfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW11cclxuXHRcdF9yZWdFeE1lc3NhZ2VzLnB1c2gge2V4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUsIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIzkuJTlj6rog73ljIXlkKvlrZfmr43jgIHmlbDlrZfjgIFfXCJ9XHJcblx0XHRTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xyXG5cdFx0XHRyZWdFeDogX3JlZ0V4TWVzc2FnZXMsXHJcblx0XHR9KSIsIlNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVthLXpBLVowLTlfXSokJyk7XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWdFeE1lc3NhZ2VzO1xuICAgIF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXTtcbiAgICBfcmVnRXhNZXNzYWdlcy5wdXNoKHtcbiAgICAgIGV4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUsXG4gICAgICBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yM5LiU5Y+q6IO95YyF5ZCr5a2X5q+N44CB5pWw5a2X44CBX1wiXG4gICAgfSk7XG4gICAgcmV0dXJuIFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG4gICAgICByZWdFeDogX3JlZ0V4TWVzc2FnZXNcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dXFxcXHcqKFxcXFwuXFxcXCRcXFxcLlxcXFx3Kyk/W2EtekEtWjAtOV0qJCcpXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XHJcblx0XHRfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW11cclxuXHRcdF9yZWdFeE1lc3NhZ2VzLnB1c2gge2V4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkLCBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yMLiQu5YmN5ZCO5b+F6aG75YyF5ZCr5a2X56ymXCJ9XHJcblx0XHRTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xyXG5cdFx0XHRyZWdFeDogX3JlZ0V4TWVzc2FnZXMsXHJcblx0XHR9KSIsIlNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11cXFxcdyooXFxcXC5cXFxcJFxcXFwuXFxcXHcrKT9bYS16QS1aMC05XSokJyk7XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWdFeE1lc3NhZ2VzO1xuICAgIF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXTtcbiAgICBfcmVnRXhNZXNzYWdlcy5wdXNoKHtcbiAgICAgIGV4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkLFxuICAgICAgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jC4kLuWJjeWQjuW/hemhu+WMheWQq+Wtl+esplwiXG4gICAgfSk7XG4gICAgcmV0dXJuIFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG4gICAgICByZWdFeDogX3JlZ0V4TWVzc2FnZXNcbiAgICB9KTtcbiAgfSk7XG59XG4iLCIvLyDlm6DkuLptZXRlb3LnvJbor5Fjb2ZmZWVzY3JpcHTkvJrlr7zoh7RldmFs5Ye95pWw5oql6ZSZ77yM5omA5Lul5Y2V54us5YaZ5Zyo5LiA5LiqanPmlofku7bkuK3jgIJcclxuQ3JlYXRvci5ldmFsSW5Db250ZXh0ID0gZnVuY3Rpb24oanMsIGNvbnRleHQpIHtcclxuICAgIC8vIyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgdGhlIGluLWxpbmUgYW5vbnltb3VzIGZ1bmN0aW9uIHdlIC5jYWxsIHdpdGggdGhlIHBhc3NlZCBjb250ZXh0XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7IFxyXG4gICAgXHRyZXR1cm4gZXZhbChqcyk7IFxyXG5cdH0uY2FsbChjb250ZXh0KTtcclxufVxyXG5cclxuXHJcbkNyZWF0b3IuZXZhbCA9IGZ1bmN0aW9uKGpzKXtcclxuXHR0cnl7XHJcblx0XHRyZXR1cm4gZXZhbChqcylcclxuXHR9Y2F0Y2ggKGUpe1xyXG5cdFx0Y29uc29sZS5lcnJvcihlLCBqcyk7XHJcblx0fVxyXG59OyIsIlx0Z2V0T3B0aW9uID0gKG9wdGlvbiktPlxyXG5cdFx0Zm9vID0gb3B0aW9uLnNwbGl0KFwiOlwiKVxyXG5cdFx0aWYgZm9vLmxlbmd0aCA+IDJcclxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzFdLCBjb2xvcjogZm9vWzJdfVxyXG5cdFx0ZWxzZSBpZiBmb28ubGVuZ3RoID4gMVxyXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMV19XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1swXX1cclxuXHJcblx0Y29udmVydEZpZWxkID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZCwgc3BhY2VJZCktPlxyXG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyICYmIHNwYWNlSWQgJiYgZmllbGQudHlwZSA9PSAnc2VsZWN0J1xyXG5cdFx0XHRjb2RlID0gZmllbGQucGlja2xpc3QgfHwgXCIje29iamVjdF9uYW1lfS4je2ZpZWxkX25hbWV9XCI7XHJcblx0XHRcdGlmIGNvZGVcclxuXHRcdFx0XHRwaWNrbGlzdCA9IENyZWF0b3IuZ2V0UGlja2xpc3QoY29kZSwgc3BhY2VJZCk7XHJcblx0XHRcdFx0aWYgcGlja2xpc3RcclxuXHRcdFx0XHRcdG9wdGlvbnMgPSBbXTtcclxuXHRcdFx0XHRcdGFsbE9wdGlvbnMgPSBbXTtcclxuXHRcdFx0XHRcdHBpY2tsaXN0T3B0aW9ucyA9IENyZWF0b3IuZ2V0UGlja0xpc3RPcHRpb25zKHBpY2tsaXN0KVxyXG5cdFx0XHRcdFx0cGlja2xpc3RPcHRpb25zID0gXy5zb3J0QnkocGlja2xpc3RPcHRpb25zLCAnc29ydF9ubycpPy5yZXZlcnNlKCk7XHJcblx0XHRcdFx0XHRfLmVhY2ggcGlja2xpc3RPcHRpb25zLCAoaXRlbSktPlxyXG5cdFx0XHRcdFx0XHRsYWJlbCA9IGl0ZW0ubmFtZVxyXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGl0ZW0udmFsdWUgfHwgaXRlbS5uYW1lXHJcblx0XHRcdFx0XHRcdGFsbE9wdGlvbnMucHVzaCh7bGFiZWw6IGxhYmVsLCB2YWx1ZTogdmFsdWUsIGVuYWJsZTogaXRlbS5lbmFibGUsIGNvbG9yOiBpdGVtLmNvbG9yfSlcclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5lbmFibGVcclxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLnB1c2goe2xhYmVsOiBsYWJlbCwgdmFsdWU6IHZhbHVlLCBjb2xvcjogaXRlbS5jb2xvcn0pXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0uZGVmYXVsdFxyXG5cdFx0XHRcdFx0XHRcdGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlXHJcblx0XHRcdFx0XHRpZiBvcHRpb25zLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IG9wdGlvbnNcclxuXHRcdFx0XHRcdGlmIGFsbE9wdGlvbnMubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0XHRmaWVsZC5hbGxPcHRpb25zID0gYWxsT3B0aW9uc1xyXG5cdFx0cmV0dXJuIGZpZWxkO1xyXG5cclxuXHRDcmVhdG9yLmNvbnZlcnRPYmplY3QgPSAob2JqZWN0LCBzcGFjZUlkKS0+XHJcblx0XHRpZiAhb2JqZWN0XHJcblx0XHRcdHJldHVyblxyXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC50cmlnZ2VycywgKHRyaWdnZXIsIGtleSktPlxyXG5cclxuXHRcdFx0aWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09IFwic2VydmVyXCIpIHx8IChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiKVxyXG5cdFx0XHRcdF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXI/Ll90b2RvXHJcblx0XHRcdFx0X3RvZG9fZnJvbV9kYiA9IHRyaWdnZXIudG9kb1xyXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSlcclxuXHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXHJcblxyXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKVxyXG5cdFx0XHRcdFx0I+WPquaciXVwZGF0ZeaXtu+8jCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyDmiY3mnInlgLxcclxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj++8jOWwpOWFtuaYr0NvbGxlY3Rpb25cclxuXHRcdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXHJcblx0XHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fZGJ9KVwiKVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKXsje190b2RvX2Zyb21fZGJ9fSlcIilcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCJcclxuXHRcdFx0XHRfdG9kbyA9IHRyaWdnZXIudG9kb1xyXG5cdFx0XHRcdGlmIF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbylcclxuXHRcdFx0XHRcdHRyaWdnZXIuX3RvZG8gPSBfdG9kby50b1N0cmluZygpXHJcblxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XHJcblx0XHRcdFx0X3RvZG9fZnJvbV9jb2RlID0gYWN0aW9uPy5fdG9kb1xyXG5cdFx0XHRcdF90b2RvX2Zyb21fZGIgPSBhY3Rpb24/LnRvZG9cclxuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpXHJcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwidG9kb19mcm9tX2NvZGVcIiwgX3RvZG9fZnJvbV9jb2RlXHJcblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpXHJcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKVxyXG5cdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9kYn0pXCIpXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oQ3JlYXRvci5hY3Rpb25zQnlOYW1lW190b2RvX2Zyb21fZGJdKVxyXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBfdG9kb19mcm9tX2RiXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoZnVuY3Rpb24oKXsje190b2RvX2Zyb21fZGJ9fSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0b2RvX2Zyb21fZGJcIiwgX3RvZG9fZnJvbV9kYiwgZXJyb3JcclxuXHJcblx0XHRcdFx0X3Zpc2libGUgPSBhY3Rpb24/Ll92aXNpYmxlXHJcblx0XHRcdFx0aWYgX3Zpc2libGVcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRhY3Rpb24udmlzaWJsZSA9IENyZWF0b3IuZXZhbChcIigje192aXNpYmxlfSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJhY3Rpb24udmlzaWJsZSB0byBmdW5jdGlvbiBlcnJvcjogXCIsIGVycm9yLCBfdmlzaWJsZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LmFjdGlvbnMsIChhY3Rpb24sIGtleSktPlxyXG5cdFx0XHRcdF90b2RvID0gYWN0aW9uPy50b2RvXHJcblx0XHRcdFx0aWYgX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKVxyXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXHJcblx0XHRcdFx0XHRhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpXHJcblxyXG5cdFx0XHRcdF92aXNpYmxlID0gYWN0aW9uPy52aXNpYmxlXHJcblxyXG5cdFx0XHRcdGlmIF92aXNpYmxlICYmIF8uaXNGdW5jdGlvbihfdmlzaWJsZSlcclxuXHRcdFx0XHRcdGFjdGlvbi5fdmlzaWJsZSA9IF92aXNpYmxlLnRvU3RyaW5nKClcclxuXHJcblx0XHRfLmZvckVhY2ggb2JqZWN0LmZpZWxkcywgKGZpZWxkLCBrZXkpLT5cclxuXHJcblx0XHRcdGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcclxuXHJcblx0XHRcdGlmIGZpZWxkLm9wdGlvbnMgJiYgXy5pc1N0cmluZyhmaWVsZC5vcHRpb25zKVxyXG5cdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0X29wdGlvbnMgPSBbXVxyXG5cdFx0XHRcdFx0I+aUr+aMgVxcbuaIluiAheiLseaWh+mAl+WPt+WIhuWJsixcclxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCAob3B0aW9uKS0+XHJcblx0XHRcdFx0XHRcdGlmIG9wdGlvbi5pbmRleE9mKFwiLFwiKVxyXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMgPSBvcHRpb24uc3BsaXQoXCIsXCIpXHJcblx0XHRcdFx0XHRcdFx0Xy5mb3JFYWNoIG9wdGlvbnMsIChfb3B0aW9uKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihfb3B0aW9uKSlcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXHJcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcclxuXHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcclxuXHJcblx0XHRcdGVsc2UgaWYgZmllbGQub3B0aW9ucyAmJiBfLmlzQXJyYXkoZmllbGQub3B0aW9ucylcclxuXHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdF9vcHRpb25zID0gW11cclxuXHRcdFx0XHRcdCPmlK/mjIHmlbDnu4TkuK3nm7TmjqXlrprkuYnmr4/kuKrpgInpobnnmoTnroDniYjmoLzlvI/lrZfnrKbkuLJcclxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLCAob3B0aW9uKS0+XHJcblx0XHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcob3B0aW9uKVxyXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKG9wdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9uc1xyXG5cdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvclxyXG5cclxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5vcHRpb25zICYmICFfLmlzRnVuY3Rpb24oZmllbGQub3B0aW9ucykgJiYgIV8uaXNBcnJheShmaWVsZC5vcHRpb25zKSAmJiBfLmlzT2JqZWN0KGZpZWxkLm9wdGlvbnMpXHJcblx0XHRcdFx0X29wdGlvbnMgPSBbXVxyXG5cdFx0XHRcdF8uZWFjaCBmaWVsZC5vcHRpb25zLCAodiwgayktPlxyXG5cdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IHYsIHZhbHVlOiBrfVxyXG5cdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9uc1xyXG5cclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0b3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcclxuXHRcdFx0XHRpZiBvcHRpb25zICYmIF8uaXNGdW5jdGlvbihvcHRpb25zKVxyXG5cdFx0XHRcdFx0ZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdG9wdGlvbnMgPSBmaWVsZC5fb3B0aW9uc1xyXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc1N0cmluZyhvcHRpb25zKVxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBDcmVhdG9yLmV2YWwoXCIoI3tvcHRpb25zfSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdHJlZ0V4ID0gZmllbGQucmVnRXhcclxuXHRcdFx0XHRpZiByZWdFeFxyXG5cdFx0XHRcdFx0ZmllbGQuX3JlZ0V4ID0gZmllbGQucmVnRXgudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmVnRXggPSBmaWVsZC5fcmVnRXhcclxuXHRcdFx0XHRpZiByZWdFeFxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLnJlZ0V4ID0gQ3JlYXRvci5ldmFsKFwiKCN7cmVnRXh9KVwiKVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxyXG5cclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0bWluID0gZmllbGQubWluXHJcblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKG1pbilcclxuXHRcdFx0XHRcdGZpZWxkLl9taW4gPSBtaW4udG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0bWluID0gZmllbGQuX21pblxyXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcobWluKVxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLm1pbiA9IENyZWF0b3IuZXZhbChcIigje21pbn0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRtYXggPSBmaWVsZC5tYXhcclxuXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24obWF4KVxyXG5cdFx0XHRcdFx0ZmllbGQuX21heCA9IG1heC50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRtYXggPSBmaWVsZC5fbWF4XHJcblx0XHRcdFx0aWYgXy5pc1N0cmluZyhtYXgpXHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0ZmllbGQubWF4ID0gQ3JlYXRvci5ldmFsKFwiKCN7bWF4fSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdGlmIGZpZWxkLmF1dG9mb3JtXHJcblx0XHRcdFx0XHRfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLnR5cGVcclxuXHRcdFx0XHRcdGlmIF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT0gT2JqZWN0ICYmIF90eXBlICE9IFN0cmluZyAmJiBfdHlwZSAhPSBOdW1iZXIgJiYgX3R5cGUgIT0gQm9vbGVhbiAmJiAhXy5pc0FycmF5KF90eXBlKVxyXG5cdFx0XHRcdFx0XHRmaWVsZC5hdXRvZm9ybS5fdHlwZSA9IF90eXBlLnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlmIGZpZWxkLmF1dG9mb3JtXHJcblx0XHRcdFx0XHRfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLl90eXBlXHJcblx0XHRcdFx0XHRpZiBfdHlwZSAmJiBfLmlzU3RyaW5nKF90eXBlKVxyXG5cdFx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0XHRmaWVsZC5hdXRvZm9ybS50eXBlID0gQ3JlYXRvci5ldmFsKFwiKCN7X3R5cGV9KVwiKVxyXG5cdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGZpZWxkIC0+IHR5cGUgZXJyb3JcIiwgZmllbGQsIGVycm9yXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHJcblx0XHRcdFx0b3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uXHJcblx0XHRcdFx0cmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXHJcblx0XHRcdFx0Y3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvblxyXG5cdFx0XHRcdGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxyXG5cdFx0XHRcdGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvblxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnNGdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLl9vcHRpb25zRnVuY3Rpb24gPSBvcHRpb25zRnVuY3Rpb24udG9TdHJpbmcoKVxyXG5cclxuXHRcdFx0XHRpZiByZWZlcmVuY2VfdG8gJiYgXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdGZpZWxkLl9yZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8udG9TdHJpbmcoKVxyXG5cclxuXHRcdFx0XHRpZiBjcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oY3JlYXRlRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5fY3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbi50b1N0cmluZygpXHJcblx0XHRcdFx0aWYgYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uID0gYmVmb3JlT3BlbkZ1bmN0aW9uLnRvU3RyaW5nKClcclxuXHJcblx0XHRcdFx0aWYgZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJzRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uID0gZmlsdGVyc0Z1bmN0aW9uLnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cclxuXHRcdFx0XHRvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uIHx8IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxyXG5cdFx0XHRcdHJlZmVyZW5jZV90byA9IGZpZWxkLl9yZWZlcmVuY2VfdG9cclxuXHRcdFx0XHRjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvblxyXG5cdFx0XHRcdGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb25cclxuXHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uIHx8IGZpZWxkLmZpbHRlcnNGdW5jdGlvblxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhvcHRpb25zRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tvcHRpb25zRnVuY3Rpb259KVwiKVxyXG5cclxuXHRcdFx0XHRpZiByZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRmaWVsZC5yZWZlcmVuY2VfdG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tyZWZlcmVuY2VfdG99KVwiKVxyXG5cclxuXHRcdFx0XHRpZiBjcmVhdGVGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGNyZWF0ZUZ1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tjcmVhdGVGdW5jdGlvbn0pXCIpXHJcblxyXG5cdFx0XHRcdGlmIGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGJlZm9yZU9wZW5GdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2JlZm9yZU9wZW5GdW5jdGlvbn0pXCIpXHJcblxyXG5cdFx0XHRcdGlmIGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGZpbHRlcnNGdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlcnNGdW5jdGlvbn0pXCIpXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcclxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSlcclxuXHRcdFx0XHRcdGZpZWxkLl9kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWUudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZGVmYXVsdFZhbHVlID0gZmllbGQuX2RlZmF1bHRWYWx1ZVxyXG5cclxuXHRcdFx0XHRpZiAhZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZmllbGQuZGVmYXVsdFZhbHVlKSAmJiBmaWVsZC5kZWZhdWx0VmFsdWUuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXHJcblx0XHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcclxuXHJcblx0XHRcdFx0aWYgZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZGVmYXVsdFZhbHVlKVxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLmRlZmF1bHRWYWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2RlZmF1bHRWYWx1ZX0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXHJcblx0XHRcdFxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRpZiBpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc0Z1bmN0aW9uKGlzX2NvbXBhbnlfbGltaXRlZClcclxuXHRcdFx0XHRcdGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdGlmIGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzU3RyaW5nKGlzX2NvbXBhbnlfbGltaXRlZClcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPSBDcmVhdG9yLmV2YWwoXCIoI3tpc19jb21wYW55X2xpbWl0ZWR9KVwiKVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxyXG5cclxuXHRcdF8uZm9yRWFjaCBvYmplY3QubGlzdF92aWV3cywgKGxpc3Rfdmlldywga2V5KSAtPlxyXG5cdFx0XHQjIyNcclxuXHRcdFx06KeG5Zu+6L+H6JmR5Zmo6ZyA6KaB5pSv5oyBZnVuY3Rpb27vvIzlkI7lj7DovazmiJDlrZfnrKbkuLLvvIzliY3lj7BldmFs5oiQ5Ye95pWwXHJcblx0XHRcdOiuqei/h+iZkeWZqOaUr+aMgeS4pOenjWZ1bmN0aW9u5pa55byP77yaXHJcblx0XHRcdDEuIOaVtOS4qmZpbHRlcnPkuLpmdW5jdGlvbjpcclxuXHRcdFx05aaC77yaXHJcblx0XHRcdGZpbHRlcnM6ICgpLT5cclxuXHRcdFx0XHRyZXR1cm4gW1tbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwicHJvamVjdF9pc3N1ZXNcIl0sJ29yJyxbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwidGFza3NcIl1dXVxyXG5cdFx0XHQyLiBmaWx0ZXJz5YaF55qEZmlsdGVyLnZhbHVl5Li6ZnVuY3Rpb25cclxuXHRcdFx05aaC77yaXHJcblx0XHRcdGZpbHRlcnM6IFtbXCJvYmplY3RfbmFtZVwiLCBcIj1cIiwgKCktPlxyXG5cdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcclxuXHRcdFx0XV1cclxuXHRcdFx05oiWXHJcblx0XHRcdGZpbHRlcnM6IFt7XHJcblx0XHRcdFx0XCJmaWVsZFwiOiBcIm9iamVjdF9uYW1lXCJcclxuXHRcdFx0XHRcIm9wZXJhdGlvblwiOiBcIj1cIlxyXG5cdFx0XHRcdFwidmFsdWVcIjogKCktPlxyXG5cdFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxyXG5cdFx0XHR9XVxyXG5cdFx0XHQjIyNcclxuXHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGxpc3Rfdmlldy5maWx0ZXJzKVxyXG5cdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdFx0bGlzdF92aWV3Ll9maWx0ZXJzID0gbGlzdF92aWV3LmZpbHRlcnMudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlIGlmIF8uaXNTdHJpbmcobGlzdF92aWV3Ll9maWx0ZXJzKVxyXG5cdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdFx0bGlzdF92aWV3LmZpbHRlcnMgPSBDcmVhdG9yLmV2YWwoXCIoI3tsaXN0X3ZpZXcuX2ZpbHRlcnN9KVwiKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Xy5mb3JFYWNoIGxpc3Rfdmlldy5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cclxuXHRcdFx0XHRcdGlmIF8uaXNBcnJheShmaWx0ZXIpXHJcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0Z1bmN0aW9uKGZpbHRlclsyXSlcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IGZpbHRlclsyXS50b1N0cmluZygpXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkZVTkNUSU9OXCJcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0RhdGUoZmlsdGVyWzJdKVxyXG5cdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpzmmK9EYXRl57G75Z6L77yM5YiZZmlsdGVyWzJd5YC85Yiw5YmN56uv5Lya6Ieq5Yqo6L2s5oiQ5a2X56ym5Liy77yM5qC85byP77yaXCIyMDE4LTAzLTI5VDAzOjQzOjIxLjc4N1pcIlxyXG5cdFx0XHRcdFx0XHRcdFx0IyDljIXmi6xncmlk5YiX6KGo6K+35rGC55qE5o6l5Y+j5Zyo5YaF55qE5omA5pyJT0RhdGHmjqXlj6PvvIxEYXRl57G75Z6L5a2X5q616YO95Lya5Lul5LiK6L+w5qC85byP6L+U5ZueXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkRBVEVcIlxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0aWYgZmlsdGVyLmxlbmd0aCA9PSA0IGFuZCBfLmlzU3RyaW5nKGZpbHRlclsyXSkgYW5kIGZpbHRlclszXSA9PSBcIkZVTkNUSU9OXCJcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlclsyXX0pXCIpXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIucG9wKClcclxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDQgYW5kIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSBhbmQgZmlsdGVyWzNdID09IFwiREFURVwiXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBuZXcgRGF0ZShmaWx0ZXJbMl0pXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIucG9wKClcclxuXHRcdFx0XHRcdGVsc2UgaWYgXy5pc09iamVjdChmaWx0ZXIpXHJcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihmaWx0ZXI/LnZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRGF0ZShmaWx0ZXI/LnZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLl9pc19kYXRlID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWx0ZXI/Ll92YWx1ZSlcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlci5fdmFsdWV9KVwiKVxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgZmlsdGVyLl9pc19kYXRlID09IHRydWVcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSlcclxuXHJcblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0aWYgb2JqZWN0LmZvcm0gJiYgIV8uaXNTdHJpbmcob2JqZWN0LmZvcm0pXHJcblx0XHRcdFx0b2JqZWN0LmZvcm0gPSBKU09OLnN0cmluZ2lmeSBvYmplY3QuZm9ybSwgKGtleSwgdmFsKS0+XHJcblx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24odmFsKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsICsgJyc7XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHJldHVybiB2YWw7XHJcblx0XHRlbHNlIGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRpZiBvYmplY3QuZm9ybVxyXG5cdFx0XHRcdG9iamVjdC5mb3JtID0gSlNPTi5wYXJzZSBvYmplY3QuZm9ybSwgKGtleSwgdmFsKS0+XHJcblx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKHZhbCkgJiYgdmFsLnN0YXJ0c1dpdGgoJ2Z1bmN0aW9uJylcclxuXHRcdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZXZhbChcIigje3ZhbH0pXCIpXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHJldHVybiB2YWw7XHJcblxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZExpc3QsIChyZWxhdGVkT2JqSW5mbyktPlxyXG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXHJcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxyXG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKVxyXG5cdFx0XHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IENyZWF0b3IuZXZhbChcIigje3ZhbH0pXCIpXHJcblx0XHRcdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaWx0ZXJzX2NvZGVcIiwgdmFsXHJcblx0XHRlbHNlXHJcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZExpc3QsIChyZWxhdGVkT2JqSW5mbyktPlxyXG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXHJcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxyXG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpXHJcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpXHJcblxyXG5cdFx0cmV0dXJuIG9iamVjdFxyXG5cclxuXHJcbiIsInZhciBjb252ZXJ0RmllbGQsIGdldE9wdGlvbjtcblxuZ2V0T3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gIHZhciBmb287XG4gIGZvbyA9IG9wdGlvbi5zcGxpdChcIjpcIik7XG4gIGlmIChmb28ubGVuZ3RoID4gMikge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1sxXSxcbiAgICAgIGNvbG9yOiBmb29bMl1cbiAgICB9O1xuICB9IGVsc2UgaWYgKGZvby5sZW5ndGggPiAxKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzFdXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMF1cbiAgICB9O1xuICB9XG59O1xuXG5jb252ZXJ0RmllbGQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGQsIHNwYWNlSWQpIHtcbiAgdmFyIGFsbE9wdGlvbnMsIGNvZGUsIG9wdGlvbnMsIHBpY2tsaXN0LCBwaWNrbGlzdE9wdGlvbnMsIHJlZjtcbiAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiBzcGFjZUlkICYmIGZpZWxkLnR5cGUgPT09ICdzZWxlY3QnKSB7XG4gICAgY29kZSA9IGZpZWxkLnBpY2tsaXN0IHx8IChvYmplY3RfbmFtZSArIFwiLlwiICsgZmllbGRfbmFtZSk7XG4gICAgaWYgKGNvZGUpIHtcbiAgICAgIHBpY2tsaXN0ID0gQ3JlYXRvci5nZXRQaWNrbGlzdChjb2RlLCBzcGFjZUlkKTtcbiAgICAgIGlmIChwaWNrbGlzdCkge1xuICAgICAgICBvcHRpb25zID0gW107XG4gICAgICAgIGFsbE9wdGlvbnMgPSBbXTtcbiAgICAgICAgcGlja2xpc3RPcHRpb25zID0gQ3JlYXRvci5nZXRQaWNrTGlzdE9wdGlvbnMocGlja2xpc3QpO1xuICAgICAgICBwaWNrbGlzdE9wdGlvbnMgPSAocmVmID0gXy5zb3J0QnkocGlja2xpc3RPcHRpb25zLCAnc29ydF9ubycpKSAhPSBudWxsID8gcmVmLnJldmVyc2UoKSA6IHZvaWQgMDtcbiAgICAgICAgXy5lYWNoKHBpY2tsaXN0T3B0aW9ucywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgIHZhciBsYWJlbCwgdmFsdWU7XG4gICAgICAgICAgbGFiZWwgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgdmFsdWUgPSBpdGVtLnZhbHVlIHx8IGl0ZW0ubmFtZTtcbiAgICAgICAgICBhbGxPcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgZW5hYmxlOiBpdGVtLmVuYWJsZSxcbiAgICAgICAgICAgIGNvbG9yOiBpdGVtLmNvbG9yXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGl0ZW0uZW5hYmxlKSB7XG4gICAgICAgICAgICBvcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgY29sb3I6IGl0ZW0uY29sb3JcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbVtcImRlZmF1bHRcIl0pIHtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAob3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGQub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFsbE9wdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZpZWxkLmFsbE9wdGlvbnMgPSBhbGxPcHRpb25zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmaWVsZDtcbn07XG5cbkNyZWF0b3IuY29udmVydE9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdCwgc3BhY2VJZCkge1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBfLmZvckVhY2gob2JqZWN0LnRyaWdnZXJzLCBmdW5jdGlvbih0cmlnZ2VyLCBrZXkpIHtcbiAgICB2YXIgX3RvZG8sIF90b2RvX2Zyb21fY29kZSwgX3RvZG9fZnJvbV9kYjtcbiAgICBpZiAoKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcInNlcnZlclwiKSB8fCAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIpKSB7XG4gICAgICBfdG9kb19mcm9tX2NvZGUgPSB0cmlnZ2VyICE9IG51bGwgPyB0cmlnZ2VyLl90b2RvIDogdm9pZCAwO1xuICAgICAgX3RvZG9fZnJvbV9kYiA9IHRyaWdnZXIudG9kbztcbiAgICAgIGlmIChfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpKSB7XG4gICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9jb2RlICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKSkge1xuICAgICAgICBpZiAoX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fZGIgKyBcIilcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKXtcIiArIF90b2RvX2Zyb21fZGIgKyBcIn0pXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIikge1xuICAgICAgX3RvZG8gPSB0cmlnZ2VyLnRvZG87XG4gICAgICBpZiAoX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKSkge1xuICAgICAgICByZXR1cm4gdHJpZ2dlci5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QuYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBrZXkpIHtcbiAgICAgIHZhciBfdG9kb19mcm9tX2NvZGUsIF90b2RvX2Zyb21fZGIsIF92aXNpYmxlLCBlcnJvcjtcbiAgICAgIF90b2RvX2Zyb21fY29kZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLl90b2RvIDogdm9pZCAwO1xuICAgICAgX3RvZG9fZnJvbV9kYiA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnRvZG8gOiB2b2lkIDA7XG4gICAgICBpZiAoX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2NvZGUgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0b2RvX2Zyb21fY29kZVwiLCBfdG9kb19mcm9tX2NvZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9kYiArIFwiKVwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihDcmVhdG9yLmFjdGlvbnNCeU5hbWVbX3RvZG9fZnJvbV9kYl0pKSB7XG4gICAgICAgICAgICAgIGFjdGlvbi50b2RvID0gX3RvZG9fZnJvbV9kYjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoZnVuY3Rpb24oKXtcIiArIF90b2RvX2Zyb21fZGIgKyBcIn0pXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcInRvZG9fZnJvbV9kYlwiLCBfdG9kb19mcm9tX2RiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIF92aXNpYmxlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24uX3Zpc2libGUgOiB2b2lkIDA7XG4gICAgICBpZiAoX3Zpc2libGUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gYWN0aW9uLnZpc2libGUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF92aXNpYmxlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImFjdGlvbi52aXNpYmxlIHRvIGZ1bmN0aW9uIGVycm9yOiBcIiwgZXJyb3IsIF92aXNpYmxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QuYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBrZXkpIHtcbiAgICAgIHZhciBfdG9kbywgX3Zpc2libGU7XG4gICAgICBfdG9kbyA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnRvZG8gOiB2b2lkIDA7XG4gICAgICBpZiAoX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKSkge1xuICAgICAgICBhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgX3Zpc2libGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi52aXNpYmxlIDogdm9pZCAwO1xuICAgICAgaWYgKF92aXNpYmxlICYmIF8uaXNGdW5jdGlvbihfdmlzaWJsZSkpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi5fdmlzaWJsZSA9IF92aXNpYmxlLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgXy5mb3JFYWNoKG9iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICB2YXIgX29wdGlvbnMsIF90eXBlLCBiZWZvcmVPcGVuRnVuY3Rpb24sIGNyZWF0ZUZ1bmN0aW9uLCBkZWZhdWx0VmFsdWUsIGVycm9yLCBmaWx0ZXJzRnVuY3Rpb24sIGlzX2NvbXBhbnlfbGltaXRlZCwgbWF4LCBtaW4sIG9wdGlvbnMsIG9wdGlvbnNGdW5jdGlvbiwgcmVmZXJlbmNlX3RvLCByZWdFeDtcbiAgICBmaWVsZCA9IGNvbnZlcnRGaWVsZChvYmplY3QubmFtZSwga2V5LCBmaWVsZCwgc3BhY2VJZCk7XG4gICAgaWYgKGZpZWxkLm9wdGlvbnMgJiYgXy5pc1N0cmluZyhmaWVsZC5vcHRpb25zKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKGZpZWxkLm9wdGlvbnMuc3BsaXQoXCJcXG5cIiksIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgIHZhciBvcHRpb25zO1xuICAgICAgICAgIGlmIChvcHRpb24uaW5kZXhPZihcIixcIikpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb24uc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChvcHRpb25zLCBmdW5jdGlvbihfb3B0aW9uKSB7XG4gICAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihfb3B0aW9uKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3IpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQub3B0aW9ucyAmJiBfLmlzQXJyYXkoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChmaWVsZC5vcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICBpZiAoXy5pc1N0cmluZyhvcHRpb24pKSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmllbGQub3B0aW9ucyA9IF9vcHRpb25zO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC5vcHRpb25zICYmICFfLmlzRnVuY3Rpb24oZmllbGQub3B0aW9ucykgJiYgIV8uaXNBcnJheShmaWVsZC5vcHRpb25zKSAmJiBfLmlzT2JqZWN0KGZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgXy5lYWNoKGZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiB2LFxuICAgICAgICAgIHZhbHVlOiBrXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgaWYgKG9wdGlvbnMgJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnMpKSB7XG4gICAgICAgIGZpZWxkLl9vcHRpb25zID0gZmllbGQub3B0aW9ucy50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zID0gZmllbGQuX29wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzU3RyaW5nKG9wdGlvbnMpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQub3B0aW9ucyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgb3B0aW9ucyArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIHJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgICBpZiAocmVnRXgpIHtcbiAgICAgICAgZmllbGQuX3JlZ0V4ID0gZmllbGQucmVnRXgudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVnRXggPSBmaWVsZC5fcmVnRXg7XG4gICAgICBpZiAocmVnRXgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5yZWdFeCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgcmVnRXggKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBtaW4gPSBmaWVsZC5taW47XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG1pbikpIHtcbiAgICAgICAgZmllbGQuX21pbiA9IG1pbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtaW4gPSBmaWVsZC5fbWluO1xuICAgICAgaWYgKF8uaXNTdHJpbmcobWluKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLm1pbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbWluICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgbWF4ID0gZmllbGQubWF4O1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihtYXgpKSB7XG4gICAgICAgIGZpZWxkLl9tYXggPSBtYXgudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWF4ID0gZmllbGQuX21heDtcbiAgICAgIGlmIChfLmlzU3RyaW5nKG1heCkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5tYXggPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIG1heCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGlmIChmaWVsZC5hdXRvZm9ybSkge1xuICAgICAgICBfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLnR5cGU7XG4gICAgICAgIGlmIChfdHlwZSAmJiBfLmlzRnVuY3Rpb24oX3R5cGUpICYmIF90eXBlICE9PSBPYmplY3QgJiYgX3R5cGUgIT09IFN0cmluZyAmJiBfdHlwZSAhPT0gTnVtYmVyICYmIF90eXBlICE9PSBCb29sZWFuICYmICFfLmlzQXJyYXkoX3R5cGUpKSB7XG4gICAgICAgICAgZmllbGQuYXV0b2Zvcm0uX3R5cGUgPSBfdHlwZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChmaWVsZC5hdXRvZm9ybSkge1xuICAgICAgICBfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLl90eXBlO1xuICAgICAgICBpZiAoX3R5cGUgJiYgXy5pc1N0cmluZyhfdHlwZSkpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmllbGQuYXV0b2Zvcm0udHlwZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3R5cGUgKyBcIilcIik7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGZpZWxkIC0+IHR5cGUgZXJyb3JcIiwgZmllbGQsIGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uO1xuICAgICAgcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvbjtcbiAgICAgIGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgIGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgIGlmIChvcHRpb25zRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnNGdW5jdGlvbiA9IG9wdGlvbnNGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZmVyZW5jZV90byAmJiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICBmaWVsZC5fcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fY3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oYmVmb3JlT3BlbkZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uID0gYmVmb3JlT3BlbkZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJzRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gPSBmaWx0ZXJzRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9uc0Z1bmN0aW9uID0gZmllbGQuX29wdGlvbnNGdW5jdGlvbiB8fCBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5fcmVmZXJlbmNlX3RvO1xuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5fY3JlYXRlRnVuY3Rpb247XG4gICAgICBiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiB8fCBmaWVsZC5maWx0ZXJzRnVuY3Rpb247XG4gICAgICBpZiAob3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcob3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5vcHRpb25zRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIG9wdGlvbnNGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIGZpZWxkLnJlZmVyZW5jZV90byA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgcmVmZXJlbmNlX3RvICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmNyZWF0ZUZ1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBjcmVhdGVGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhiZWZvcmVPcGVuRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgYmVmb3JlT3BlbkZ1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGZpbHRlcnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuZmlsdGVyc0Z1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXJzRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgIGlmIChkZWZhdWx0VmFsdWUgJiYgXy5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgZmllbGQuX2RlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZS50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5fZGVmYXVsdFZhbHVlO1xuICAgICAgaWYgKCFkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhmaWVsZC5kZWZhdWx0VmFsdWUpICYmIGZpZWxkLmRlZmF1bHRWYWx1ZS5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGRlZmF1bHRWYWx1ZSArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgIGlmIChpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc0Z1bmN0aW9uKGlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgIGlmIChpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc1N0cmluZyhpc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgaXNfY29tcGFueV9saW1pdGVkICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgXy5mb3JFYWNoKG9iamVjdC5saXN0X3ZpZXdzLCBmdW5jdGlvbihsaXN0X3ZpZXcsIGtleSkge1xuXG4gICAgLypcbiAgICBcdFx0XHTop4blm77ov4fomZHlmajpnIDopoHmlK/mjIFmdW5jdGlvbu+8jOWQjuWPsOi9rOaIkOWtl+espuS4su+8jOWJjeWPsGV2YWzmiJDlh73mlbBcbiAgICBcdFx0XHTorqnov4fomZHlmajmlK/mjIHkuKTnp41mdW5jdGlvbuaWueW8j++8mlxuICAgIFx0XHRcdDEuIOaVtOS4qmZpbHRlcnPkuLpmdW5jdGlvbjpcbiAgICBcdFx0XHTlpoLvvJpcbiAgICBcdFx0XHRmaWx0ZXJzOiAoKS0+XG4gICAgXHRcdFx0XHRyZXR1cm4gW1tbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwicHJvamVjdF9pc3N1ZXNcIl0sJ29yJyxbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwidGFza3NcIl1dXVxuICAgIFx0XHRcdDIuIGZpbHRlcnPlhoXnmoRmaWx0ZXIudmFsdWXkuLpmdW5jdGlvblxuICAgIFx0XHRcdOWmgu+8mlxuICAgIFx0XHRcdGZpbHRlcnM6IFtbXCJvYmplY3RfbmFtZVwiLCBcIj1cIiwgKCktPlxuICAgIFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuICAgIFx0XHRcdF1dXG4gICAgXHRcdFx05oiWXG4gICAgXHRcdFx0ZmlsdGVyczogW3tcbiAgICBcdFx0XHRcdFwiZmllbGRcIjogXCJvYmplY3RfbmFtZVwiXG4gICAgXHRcdFx0XHRcIm9wZXJhdGlvblwiOiBcIj1cIlxuICAgIFx0XHRcdFx0XCJ2YWx1ZVwiOiAoKS0+XG4gICAgXHRcdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcbiAgICBcdFx0XHR9XVxuICAgICAqL1xuICAgIGlmIChfLmlzRnVuY3Rpb24obGlzdF92aWV3LmZpbHRlcnMpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXcuX2ZpbHRlcnMgPSBsaXN0X3ZpZXcuZmlsdGVycy50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXy5pc1N0cmluZyhsaXN0X3ZpZXcuX2ZpbHRlcnMpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXcuZmlsdGVycyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbGlzdF92aWV3Ll9maWx0ZXJzICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXy5mb3JFYWNoKGxpc3Rfdmlldy5maWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIsIF9pbmRleCkge1xuICAgICAgICBpZiAoXy5pc0FycmF5KGZpbHRlcikpIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gMyAmJiBfLmlzRnVuY3Rpb24oZmlsdGVyWzJdKSkge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBmaWx0ZXJbMl0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlclszXSA9IFwiRlVOQ1RJT05cIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gMyAmJiBfLmlzRGF0ZShmaWx0ZXJbMl0pKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXJbM10gPSBcIkRBVEVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZpbHRlci5sZW5ndGggPT09IDQgJiYgXy5pc1N0cmluZyhmaWx0ZXJbMl0pICYmIGZpbHRlclszXSA9PT0gXCJGVU5DVElPTlwiKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyWzJdICsgXCIpXCIpO1xuICAgICAgICAgICAgICBmaWx0ZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gNCAmJiBfLmlzU3RyaW5nKGZpbHRlclsyXSkgJiYgZmlsdGVyWzNdID09PSBcIkRBVEVcIikge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBuZXcgRGF0ZShmaWx0ZXJbMl0pO1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGZpbHRlcikpIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRGF0ZShmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci52YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5faXNfZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChfLmlzU3RyaW5nKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLl92YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyLl92YWx1ZSArIFwiKVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLl9pc19kYXRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBuZXcgRGF0ZShmaWx0ZXIudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGlmIChvYmplY3QuZm9ybSAmJiAhXy5pc1N0cmluZyhvYmplY3QuZm9ybSkpIHtcbiAgICAgIG9iamVjdC5mb3JtID0gSlNPTi5zdHJpbmdpZnkob2JqZWN0LmZvcm0sIGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgICAgIHJldHVybiB2YWwgKyAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKG9iamVjdC5mb3JtKSB7XG4gICAgICBvYmplY3QuZm9ybSA9IEpTT04ucGFyc2Uob2JqZWN0LmZvcm0sIGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gICAgICAgIGlmIChfLmlzU3RyaW5nKHZhbCkgJiYgdmFsLnN0YXJ0c1dpdGgoJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyB2YWwgKyBcIilcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LnJlbGF0ZWRMaXN0LCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAgIGlmIChrZXkgPT09ICdmaWx0ZXJzJyAmJiBfLmlzU3RyaW5nKHZhbCkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJldHVybiByZWxhdGVkT2JqSW5mb1trZXldID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyB2YWwgKyBcIilcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiZmlsdGVyc19jb2RlXCIsIHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LnJlbGF0ZWRMaXN0LCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJDcmVhdG9yLkZvcm11bGFyID0ge31cclxuXHJcbkNyZWF0b3IuRm9ybXVsYXIuUFJFRklYID0gXCJfVkFMVUVTXCJcclxuXHJcbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gKHByZWZpeCxmaWVsZFZhcmlhYmxlKS0+XHJcblx0cmVnID0gLyhcXHtbXnt9XSpcXH0pL2c7XHJcblxyXG5cdHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZSByZWcsIChtLCAkMSktPlxyXG5cdFx0cmV0dXJuIHByZWZpeCArICQxLnJlcGxhY2UoL1xce1xccyovLFwiW1xcXCJcIikucmVwbGFjZSgvXFxzKlxcfS8sXCJcXFwiXVwiKS5yZXBsYWNlKC9cXHMqXFwuXFxzKi9nLFwiXFxcIl1bXFxcIlwiKTtcclxuXHJcblx0cmV0dXJuIHJldlxyXG5cclxuQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEgPSAoZm9ybXVsYV9zdHIpLT5cclxuXHRpZiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTFcclxuXHRcdHJldHVybiB0cnVlXHJcblx0cmV0dXJuIGZhbHNlXHJcblxyXG5DcmVhdG9yLkZvcm11bGFyLnJ1biA9IChmb3JtdWxhX3N0ciwgX0NPTlRFWFQsIG9wdGlvbnMpLT5cclxuXHRpZiBmb3JtdWxhX3N0ciAmJiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKVxyXG5cclxuXHRcdGlmICFfLmlzQm9vbGVhbihvcHRpb25zPy5leHRlbmQpXHJcblx0XHRcdGV4dGVuZCA9IHRydWVcclxuXHJcblx0XHRfVkFMVUVTID0ge31cclxuXHRcdF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBfQ09OVEVYVClcclxuXHRcdGlmIGV4dGVuZFxyXG5cdFx0XHRfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgQ3JlYXRvci5nZXRVc2VyQ29udGV4dChvcHRpb25zPy51c2VySWQsIG9wdGlvbnM/LnNwYWNlSWQpKVxyXG5cdFx0Zm9ybXVsYV9zdHIgPSBDcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYShcInRoaXNcIiwgZm9ybXVsYV9zdHIpXHJcblxyXG5cdFx0dHJ5XHJcblx0XHRcdGRhdGEgPSBDcmVhdG9yLmV2YWxJbkNvbnRleHQoZm9ybXVsYV9zdHIsIF9WQUxVRVMpICAgIyDmraTlpITkuI3og73nlKh3aW5kb3cuZXZhbCDvvIzkvJrlr7zoh7Tlj5jph4/kvZznlKjln5/lvILluLhcclxuXHRcdFx0cmV0dXJuIGRhdGFcclxuXHRcdGNhdGNoIGVcclxuXHRcdFx0Y29uc29sZS5lcnJvcihcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiAje2Zvcm11bGFfc3RyfVwiLCBlKVxyXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHR0b2FzdHI/LmVycm9yKFwi5YWs5byP5omn6KGM5Ye66ZSZ5LqG77yM6K+35qOA5p+l5YWs5byP6YWN572u5piv5ZCm5q2j56Gu77yBXCIpXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiAje2Zvcm11bGFfc3RyfSN7ZX1cIlxyXG5cclxuXHRyZXR1cm4gZm9ybXVsYV9zdHJcclxuIiwiQ3JlYXRvci5Gb3JtdWxhciA9IHt9O1xuXG5DcmVhdG9yLkZvcm11bGFyLlBSRUZJWCA9IFwiX1ZBTFVFU1wiO1xuXG5DcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYSA9IGZ1bmN0aW9uKHByZWZpeCwgZmllbGRWYXJpYWJsZSkge1xuICB2YXIgcmVnLCByZXY7XG4gIHJlZyA9IC8oXFx7W157fV0qXFx9KS9nO1xuICByZXYgPSBmaWVsZFZhcmlhYmxlLnJlcGxhY2UocmVnLCBmdW5jdGlvbihtLCAkMSkge1xuICAgIHJldHVybiBwcmVmaXggKyAkMS5yZXBsYWNlKC9cXHtcXHMqLywgXCJbXFxcIlwiKS5yZXBsYWNlKC9cXHMqXFx9LywgXCJcXFwiXVwiKS5yZXBsYWNlKC9cXHMqXFwuXFxzKi9nLCBcIlxcXCJdW1xcXCJcIik7XG4gIH0pO1xuICByZXR1cm4gcmV2O1xufTtcblxuQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEgPSBmdW5jdGlvbihmb3JtdWxhX3N0cikge1xuICBpZiAoXy5pc1N0cmluZyhmb3JtdWxhX3N0cikgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIntcIikgPiAtMSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwifVwiKSA+IC0xKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5Gb3JtdWxhci5ydW4gPSBmdW5jdGlvbihmb3JtdWxhX3N0ciwgX0NPTlRFWFQsIG9wdGlvbnMpIHtcbiAgdmFyIF9WQUxVRVMsIGRhdGEsIGUsIGV4dGVuZDtcbiAgaWYgKGZvcm11bGFfc3RyICYmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpKSB7XG4gICAgaWYgKCFfLmlzQm9vbGVhbihvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLmV4dGVuZCA6IHZvaWQgMCkpIHtcbiAgICAgIGV4dGVuZCA9IHRydWU7XG4gICAgfVxuICAgIF9WQUxVRVMgPSB7fTtcbiAgICBfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgX0NPTlRFWFQpO1xuICAgIGlmIChleHRlbmQpIHtcbiAgICAgIF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBDcmVhdG9yLmdldFVzZXJDb250ZXh0KG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMudXNlcklkIDogdm9pZCAwLCBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNwYWNlSWQgOiB2b2lkIDApKTtcbiAgICB9XG4gICAgZm9ybXVsYV9zdHIgPSBDcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYShcInRoaXNcIiwgZm9ybXVsYV9zdHIpO1xuICAgIHRyeSB7XG4gICAgICBkYXRhID0gQ3JlYXRvci5ldmFsSW5Db250ZXh0KGZvcm11bGFfc3RyLCBfVkFMVUVTKTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlID0gZXJyb3I7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46IFwiICsgZm9ybXVsYV9zdHIsIGUpO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBpZiAodHlwZW9mIHRvYXN0ciAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0b2FzdHIgIT09IG51bGwpIHtcbiAgICAgICAgICB0b2FzdHIuZXJyb3IoXCLlhazlvI/miafooYzlh7rplJnkuobvvIzor7fmo4Dmn6XlhazlvI/phY3nva7mmK/lkKbmraPnoa7vvIFcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiBcIiArIGZvcm11bGFfc3RyICsgZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBmb3JtdWxhX3N0cjtcbn07XG4iLCJjbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJyk7XHJcbkNyZWF0b3Iub2JqZWN0c0J5TmFtZSA9IHt9ICAgIyDmraTlr7nosaHlj6rog73lnKjnoa7kv53miYDmnIlPYmplY3TliJ3lp4vljJblrozmiJDlkI7osIPnlKjvvIwg5ZCm5YiZ6I635Y+W5Yiw55qEb2JqZWN05LiN5YWoXHJcblxyXG5DcmVhdG9yLmZvcm1hdE9iamVjdE5hbWUgPSAob2JqZWN0X25hbWUpLT5cclxuXHRpZiBvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjZnMuZmlsZXMuJylcclxuXHRcdG9iamVjdF9uYW1lID0gb2JqZWN0X25hbWUucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcLicsICdnJyksICdfJylcclxuXHRyZXR1cm4gb2JqZWN0X25hbWVcclxuXHJcbkNyZWF0b3IuT2JqZWN0ID0gKG9wdGlvbnMpLT5cclxuXHRfYmFzZU9iamVjdCA9IENyZWF0b3IuYmFzZU9iamVjdFxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0X2Jhc2VPYmplY3QgPSB7YWN0aW9uczogQ3JlYXRvci5iYXNlT2JqZWN0LmFjdGlvbnMgLCBmaWVsZHM6IHt9LCB0cmlnZ2Vyczoge30sIHBlcm1pc3Npb25fc2V0OiB7fX1cclxuXHRzZWxmID0gdGhpc1xyXG5cdGlmICghb3B0aW9ucy5uYW1lKVxyXG5cdFx0Y29uc29sZS5lcnJvcihvcHRpb25zKVxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XHJcblxyXG5cdHNlbGYuX2lkID0gb3B0aW9ucy5faWQgfHwgb3B0aW9ucy5uYW1lXHJcblx0c2VsZi5zcGFjZSA9IG9wdGlvbnMuc3BhY2VcclxuXHRzZWxmLm5hbWUgPSBvcHRpb25zLm5hbWVcclxuXHRzZWxmLmxhYmVsID0gb3B0aW9ucy5sYWJlbFxyXG5cdHNlbGYuaWNvbiA9IG9wdGlvbnMuaWNvblxyXG5cdHNlbGYuZGVzY3JpcHRpb24gPSBvcHRpb25zLmRlc2NyaXB0aW9uXHJcblx0c2VsZi5pc192aWV3ID0gb3B0aW9ucy5pc192aWV3XHJcblx0c2VsZi5mb3JtID0gb3B0aW9ucy5mb3JtXHJcblx0c2VsZi5yZWxhdGVkTGlzdCA9IG9wdGlvbnMucmVsYXRlZExpc3RcclxuXHRpZiAhXy5pc0Jvb2xlYW4ob3B0aW9ucy5pc19lbmFibGUpICB8fCBvcHRpb25zLmlzX2VuYWJsZSA9PSB0cnVlXHJcblx0XHRzZWxmLmlzX2VuYWJsZSA9IHRydWVcclxuXHRlbHNlXHJcblx0XHRzZWxmLmlzX2VuYWJsZSA9IGZhbHNlXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnYWxsb3dfYWN0aW9ucycpXHJcblx0XHRcdHNlbGYuYWxsb3dfYWN0aW9ucyA9IG9wdGlvbnMuYWxsb3dfYWN0aW9uc1xyXG5cdFx0aWYgXy5oYXMob3B0aW9ucywgJ2FsbG93X3JlbGF0ZWRMaXN0JylcclxuXHRcdFx0c2VsZi5hbGxvd19yZWxhdGVkTGlzdCA9IG9wdGlvbnMuYWxsb3dfcmVsYXRlZExpc3RcclxuXHRzZWxmLmVuYWJsZV9zZWFyY2ggPSBvcHRpb25zLmVuYWJsZV9zZWFyY2hcclxuXHRzZWxmLmVuYWJsZV9maWxlcyA9IG9wdGlvbnMuZW5hYmxlX2ZpbGVzXHJcblx0c2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrc1xyXG5cdHNlbGYuZW5hYmxlX25vdGVzID0gb3B0aW9ucy5lbmFibGVfbm90ZXNcclxuXHRzZWxmLmVuYWJsZV9hdWRpdCA9IG9wdGlvbnMuZW5hYmxlX2F1ZGl0XHJcblx0aWYgb3B0aW9ucy5wYWdpbmdcclxuXHRcdHNlbGYucGFnaW5nID0gb3B0aW9ucy5wYWdpbmdcclxuXHRzZWxmLmhpZGRlbiA9IG9wdGlvbnMuaGlkZGVuXHJcblx0c2VsZi5lbmFibGVfYXBpID0gKG9wdGlvbnMuZW5hYmxlX2FwaSA9PSB1bmRlZmluZWQpIG9yIG9wdGlvbnMuZW5hYmxlX2FwaVxyXG5cdHNlbGYuY3VzdG9tID0gb3B0aW9ucy5jdXN0b21cclxuXHRzZWxmLmVuYWJsZV9zaGFyZSA9IG9wdGlvbnMuZW5hYmxlX3NoYXJlXHJcblx0c2VsZi5lbmFibGVfaW5zdGFuY2VzID0gb3B0aW9ucy5lbmFibGVfaW5zdGFuY2VzXHJcblx0c2VsZi5lbmFibGVfcHJvY2VzcyA9IG9wdGlvbnMuZW5hYmxlX3Byb2Nlc3NcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmIENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKVxyXG5cdFx0XHRzZWxmLmVuYWJsZV90cmVlID0gZmFsc2VcclxuXHRcdGVsc2VcclxuXHRcdFx0c2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWVcclxuXHRcdFx0c2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpXHJcblx0ZWxzZVxyXG5cdFx0c2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpXHJcblx0XHRzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZVxyXG5cdHNlbGYub3Blbl93aW5kb3cgPSBvcHRpb25zLm9wZW5fd2luZG93XHJcblx0c2VsZi5maWx0ZXJfY29tcGFueSA9IG9wdGlvbnMuZmlsdGVyX2NvbXBhbnlcclxuXHRzZWxmLmNhbGVuZGFyID0gXy5jbG9uZShvcHRpb25zLmNhbGVuZGFyKVxyXG5cdHNlbGYuZW5hYmxlX2NoYXR0ZXIgPSBvcHRpb25zLmVuYWJsZV9jaGF0dGVyXHJcblx0c2VsZi5lbmFibGVfdHJhc2ggPSBvcHRpb25zLmVuYWJsZV90cmFzaFxyXG5cdHNlbGYuZW5hYmxlX3NwYWNlX2dsb2JhbCA9IG9wdGlvbnMuZW5hYmxlX3NwYWNlX2dsb2JhbFxyXG5cdHNlbGYuZW5hYmxlX2FwcHJvdmFscyA9IG9wdGlvbnMuZW5hYmxlX2FwcHJvdmFsc1xyXG5cdHNlbGYuZW5hYmxlX2ZvbGxvdyA9IG9wdGlvbnMuZW5hYmxlX2ZvbGxvd1xyXG5cdHNlbGYuZW5hYmxlX3dvcmtmbG93ID0gb3B0aW9ucy5lbmFibGVfd29ya2Zsb3dcclxuXHRzZWxmLmVuYWJsZV9pbmxpbmVfZWRpdCA9IG9wdGlvbnMuZW5hYmxlX2lubGluZV9lZGl0XHJcblx0aWYgXy5oYXMob3B0aW9ucywgJ2luX2RldmVsb3BtZW50JylcclxuXHRcdHNlbGYuaW5fZGV2ZWxvcG1lbnQgPSBvcHRpb25zLmluX2RldmVsb3BtZW50XHJcblx0c2VsZi5pZEZpZWxkTmFtZSA9ICdfaWQnXHJcblx0aWYgb3B0aW9ucy5kYXRhYmFzZV9uYW1lXHJcblx0XHRzZWxmLmRhdGFiYXNlX25hbWUgPSBvcHRpb25zLmRhdGFiYXNlX25hbWVcclxuXHRpZiAoIW9wdGlvbnMuZmllbGRzKVxyXG5cdFx0Y29uc29sZS5lcnJvcihvcHRpb25zKVxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBmaWVsZHMnKTtcclxuXHJcblx0c2VsZi5maWVsZHMgPSBjbG9uZShvcHRpb25zLmZpZWxkcylcclxuXHJcblx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cclxuXHRcdGlmIGZpZWxkLmlzX25hbWVcclxuXHRcdFx0c2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWVcclxuXHRcdGVsc2UgaWYgZmllbGRfbmFtZSA9PSAnbmFtZScgJiYgIXNlbGYuTkFNRV9GSUVMRF9LRVlcclxuXHRcdFx0c2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWVcclxuXHRcdGlmIGZpZWxkLnByaW1hcnlcclxuXHRcdFx0c2VsZi5pZEZpZWxkTmFtZSA9IGZpZWxkX25hbWVcclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSlcclxuXHRcdFx0XHRpZiBmaWVsZF9uYW1lID09ICdzcGFjZSdcclxuXHRcdFx0XHRcdGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlXHJcblx0XHRcdFx0XHRmaWVsZC5oaWRkZW4gPSBmYWxzZVxyXG5cclxuXHRpZiAhb3B0aW9ucy5kYXRhYmFzZV9uYW1lIHx8IG9wdGlvbnMuZGF0YWJhc2VfbmFtZSA9PSAnbWV0ZW9yLW1vbmdvJ1xyXG5cdFx0Xy5lYWNoIF9iYXNlT2JqZWN0LmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblx0XHRcdGlmICFzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXVxyXG5cdFx0XHRcdHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0ge31cclxuXHRcdFx0c2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKGZpZWxkKSwgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pXHJcblxyXG5cdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblx0XHRpZiBmaWVsZC50eXBlID09ICdhdXRvbnVtYmVyJ1xyXG5cdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZm9ybXVsYSdcclxuXHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ3N1bW1hcnknXHJcblx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxyXG5cclxuXHRzZWxmLmxpc3Rfdmlld3MgPSB7fVxyXG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhzZWxmLm5hbWUpXHJcblx0Xy5lYWNoIG9wdGlvbnMubGlzdF92aWV3cywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxyXG5cdFx0b2l0ZW0gPSBDcmVhdG9yLmNvbnZlcnRMaXN0VmlldyhkZWZhdWx0VmlldywgaXRlbSwgaXRlbV9uYW1lKVxyXG5cdFx0c2VsZi5saXN0X3ZpZXdzW2l0ZW1fbmFtZV0gPSBvaXRlbVxyXG5cclxuXHRzZWxmLnRyaWdnZXJzID0gXy5jbG9uZShfYmFzZU9iamVjdC50cmlnZ2VycylcclxuXHRfLmVhY2ggb3B0aW9ucy50cmlnZ2VycywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxyXG5cdFx0aWYgIXNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXVxyXG5cdFx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSB7fVxyXG5cdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdLm5hbWUgPSBpdGVtX25hbWVcclxuXHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSlcclxuXHJcblx0c2VsZi5hY3Rpb25zID0gXy5jbG9uZShfYmFzZU9iamVjdC5hY3Rpb25zKVxyXG5cdF8uZWFjaCBvcHRpb25zLmFjdGlvbnMsIChpdGVtLCBpdGVtX25hbWUpLT5cclxuXHRcdGlmICFzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXVxyXG5cdFx0XHRzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IHt9XHJcblx0XHRjb3B5SXRlbSA9IF8uY2xvbmUoc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pXHJcblx0XHRkZWxldGUgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gI+WFiOWIoOmZpOebuOWFs+WxnuaAp+WGjemHjeW7uuaJjeiDveS/neivgeWQjue7remHjeWkjeWumuS5ieeahOWxnuaAp+mhuuW6j+eUn+aViFxyXG5cdFx0c2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChjb3B5SXRlbSwgaXRlbSlcclxuXHJcblx0Xy5lYWNoIHNlbGYuYWN0aW9ucywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxyXG5cdFx0aXRlbS5uYW1lID0gaXRlbV9uYW1lXHJcblxyXG5cdHNlbGYucmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhzZWxmLm5hbWUpXHJcblxyXG5cdCMg6K6p5omA5pyJb2JqZWN06buY6K6k5pyJ5omA5pyJbGlzdF92aWV3cy9hY3Rpb25zL3JlbGF0ZWRfb2JqZWN0cy9yZWFkYWJsZV9maWVsZHMvZWRpdGFibGVfZmllbGRz5a6M5pW05p2D6ZmQ77yM6K+l5p2D6ZmQ5Y+v6IO96KKr5pWw5o2u5bqT5Lit6K6+572u55qEYWRtaW4vdXNlcuadg+mZkOimhuebllxyXG5cdHNlbGYucGVybWlzc2lvbl9zZXQgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnBlcm1pc3Npb25fc2V0KVxyXG5cdCMgZGVmYXVsdExpc3RWaWV3cyA9IF8ua2V5cyhzZWxmLmxpc3Rfdmlld3MpXHJcblx0IyBkZWZhdWx0QWN0aW9ucyA9IF8ua2V5cyhzZWxmLmFjdGlvbnMpXHJcblx0IyBkZWZhdWx0UmVsYXRlZE9iamVjdHMgPSBfLnBsdWNrKHNlbGYucmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcclxuXHQjIGRlZmF1bHRSZWFkYWJsZUZpZWxkcyA9IFtdXHJcblx0IyBkZWZhdWx0RWRpdGFibGVGaWVsZHMgPSBbXVxyXG5cdCMgXy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cclxuXHQjIFx0aWYgIShmaWVsZC5oaWRkZW4pICAgICMyMzEgb21pdOWtl+auteaUr+aMgeWcqOmdnue8lui+kemhtemdouafpeeciywg5Zug5q2k5Yig6Zmk5LqG5q2k5aSE5a+5b21pdOeahOWIpOaWrVxyXG5cdCMgXHRcdGRlZmF1bHRSZWFkYWJsZUZpZWxkcy5wdXNoIGZpZWxkX25hbWVcclxuXHQjIFx0XHRpZiAhZmllbGQucmVhZG9ubHlcclxuXHQjIFx0XHRcdGRlZmF1bHRFZGl0YWJsZUZpZWxkcy5wdXNoIGZpZWxkX25hbWVcclxuXHJcblx0IyBfLmVhY2ggc2VsZi5wZXJtaXNzaW9uX3NldCwgKGl0ZW0sIGl0ZW1fbmFtZSktPlxyXG5cdCMgXHRpZiBpdGVtX25hbWUgPT0gXCJub25lXCJcclxuXHQjIFx0XHRyZXR1cm5cclxuXHQjIFx0aWYgc2VsZi5saXN0X3ZpZXdzXHJcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmxpc3Rfdmlld3MgPSBkZWZhdWx0TGlzdFZpZXdzXHJcblx0IyBcdGlmIHNlbGYuYWN0aW9uc1xyXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5hY3Rpb25zID0gZGVmYXVsdEFjdGlvbnNcclxuXHQjIFx0aWYgc2VsZi5yZWxhdGVkX29iamVjdHNcclxuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ucmVsYXRlZF9vYmplY3RzID0gZGVmYXVsdFJlbGF0ZWRPYmplY3RzXHJcblx0IyBcdGlmIHNlbGYuZmllbGRzXHJcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLnJlYWRhYmxlX2ZpZWxkcyA9IGRlZmF1bHRSZWFkYWJsZUZpZWxkc1xyXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5lZGl0YWJsZV9maWVsZHMgPSBkZWZhdWx0RWRpdGFibGVGaWVsZHNcclxuXHR1bmxlc3Mgb3B0aW9ucy5wZXJtaXNzaW9uX3NldFxyXG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldCA9IHt9XHJcblx0aWYgIShvcHRpb25zLnBlcm1pc3Npb25fc2V0Py5hZG1pbilcclxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQuYWRtaW4gPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJhZG1pblwiXSlcclxuXHRpZiAhKG9wdGlvbnMucGVybWlzc2lvbl9zZXQ/LnVzZXIpXHJcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0LnVzZXIgPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJ1c2VyXCJdKVxyXG5cdF8uZWFjaCBvcHRpb25zLnBlcm1pc3Npb25fc2V0LCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0XHRpZiAhc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdXHJcblx0XHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IHt9XHJcblx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSksIGl0ZW0pXHJcblxyXG5cdCMg5YmN56uv5qC55o2ucGVybWlzc2lvbnPmlLnlhplmaWVsZOebuOWFs+WxnuaAp++8jOWQjuerr+WPquimgei1sOm7mOiupOWxnuaAp+WwseihjO+8jOS4jemcgOimgeaUueWGmVxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0cGVybWlzc2lvbnMgPSBvcHRpb25zLnBlcm1pc3Npb25zXHJcblx0XHRkaXNhYmxlZF9saXN0X3ZpZXdzID0gcGVybWlzc2lvbnM/LmRpc2FibGVkX2xpc3Rfdmlld3NcclxuXHRcdGlmIGRpc2FibGVkX2xpc3Rfdmlld3M/Lmxlbmd0aFxyXG5cdFx0XHRkZWZhdWx0TGlzdFZpZXdJZCA9IG9wdGlvbnMubGlzdF92aWV3cz8uYWxsPy5faWRcclxuXHRcdFx0aWYgZGVmYXVsdExpc3RWaWV3SWRcclxuXHRcdFx0XHQjIOaKiuinhuWbvuadg+mZkOmFjee9ruS4rem7mOiupOeahGFsbOinhuWbvmlk6L2s5o2i5oiQYWxs5YWz6ZSu5a2XXHJcblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IF8ubWFwIGRpc2FibGVkX2xpc3Rfdmlld3MsIChsaXN0X3ZpZXdfaXRlbSkgLT5cclxuXHRcdFx0XHRcdHJldHVybiBpZiBkZWZhdWx0TGlzdFZpZXdJZCA9PSBsaXN0X3ZpZXdfaXRlbSB0aGVuIFwiYWxsXCIgZWxzZSBsaXN0X3ZpZXdfaXRlbVxyXG5cdFx0c2VsZi5wZXJtaXNzaW9ucyA9IG5ldyBSZWFjdGl2ZVZhcihwZXJtaXNzaW9ucylcclxuI1x0XHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG4jXHRcdFx0aWYgZmllbGRcclxuI1x0XHRcdFx0aWYgXy5pbmRleE9mKHBlcm1pc3Npb25zPy51bnJlYWRhYmxlX2ZpZWxkcywgZmllbGRfbmFtZSkgPCAwXHJcbiNcdFx0XHRcdFx0aWYgZmllbGQuaGlkZGVuXHJcbiNcdFx0XHRcdFx0XHRyZXR1cm5cclxuI1x0XHRcdFx0XHRpZiBfLmluZGV4T2YocGVybWlzc2lvbnM/LnVuZWRpdGFibGVfZmllbGRzLCBmaWVsZF9uYW1lKSA+IC0xXHJcbiNcdFx0XHRcdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcclxuI1x0XHRcdFx0XHRcdGZpZWxkLmRpc2FibGVkID0gdHJ1ZVxyXG4jXHRcdFx0XHRcdFx0IyDlvZPlj6ror7vml7bvvIzlpoLmnpzkuI3ljrvmjonlv4XloavlrZfmrrXvvIxhdXRvZm9ybeaYr+S8muaKpemUmeeahFxyXG4jXHRcdFx0XHRcdFx0ZmllbGQucmVxdWlyZWQgPSBmYWxzZVxyXG4jXHRcdFx0XHRlbHNlXHJcbiNcdFx0XHRcdFx0ZmllbGQuaGlkZGVuID0gdHJ1ZVxyXG5cdGVsc2VcclxuXHRcdHNlbGYucGVybWlzc2lvbnMgPSBudWxsXHJcblxyXG5cdF9kYiA9IENyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbihvcHRpb25zKVxyXG5cclxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zW19kYi5fbmFtZV0gPSBfZGJcclxuXHJcblx0c2VsZi5kYiA9IF9kYlxyXG5cclxuXHRzZWxmLl9jb2xsZWN0aW9uX25hbWUgPSBfZGIuX25hbWVcclxuXHJcblx0c2NoZW1hID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoc2VsZilcclxuXHRzZWxmLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoc2NoZW1hKVxyXG5cdGlmIHNlbGYubmFtZSAhPSBcInVzZXJzXCIgYW5kIHNlbGYubmFtZSAhPSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIgJiYgIXNlbGYuaXNfdmlldyAmJiAhXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiLCBcImFjdGlvbl9maWVsZF91cGRhdGVzXCJdLCBzZWxmLm5hbWUpXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXHJcblx0aWYgc2VsZi5uYW1lID09IFwidXNlcnNcIlxyXG5cdFx0X2RiLl9zaW1wbGVTY2hlbWEgPSBzZWxmLnNjaGVtYVxyXG5cclxuXHRpZiBfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxyXG5cclxuXHRDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGZcclxuXHJcblx0cmV0dXJuIHNlbGZcclxuXHJcbiMgQ3JlYXRvci5PYmplY3QucHJvdG90eXBlLmkxOG4gPSAoKS0+XHJcbiMgXHQjIHNldCBvYmplY3QgbGFiZWxcclxuIyBcdHNlbGYgPSB0aGlzXHJcblxyXG4jIFx0a2V5ID0gc2VsZi5uYW1lXHJcbiMgXHRpZiB0KGtleSkgPT0ga2V5XHJcbiMgXHRcdGlmICFzZWxmLmxhYmVsXHJcbiMgXHRcdFx0c2VsZi5sYWJlbCA9IHNlbGYubmFtZVxyXG4jIFx0ZWxzZVxyXG4jIFx0XHRzZWxmLmxhYmVsID0gdChrZXkpXHJcblxyXG4jIFx0IyBzZXQgZmllbGQgbGFiZWxzXHJcbiMgXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG4jIFx0XHRma2V5ID0gc2VsZi5uYW1lICsgXCJfXCIgKyBmaWVsZF9uYW1lXHJcbiMgXHRcdGlmIHQoZmtleSkgPT0gZmtleVxyXG4jIFx0XHRcdGlmICFmaWVsZC5sYWJlbFxyXG4jIFx0XHRcdFx0ZmllbGQubGFiZWwgPSBmaWVsZF9uYW1lXHJcbiMgXHRcdGVsc2VcclxuIyBcdFx0XHRmaWVsZC5sYWJlbCA9IHQoZmtleSlcclxuIyBcdFx0c2VsZi5zY2hlbWE/Ll9zY2hlbWE/W2ZpZWxkX25hbWVdPy5sYWJlbCA9IGZpZWxkLmxhYmVsXHJcblxyXG5cclxuIyBcdCMgc2V0IGxpc3R2aWV3IGxhYmVsc1xyXG4jIFx0Xy5lYWNoIHNlbGYubGlzdF92aWV3cywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxyXG4jIFx0XHRpMThuX2tleSA9IHNlbGYubmFtZSArIFwiX2xpc3R2aWV3X1wiICsgaXRlbV9uYW1lXHJcbiMgXHRcdGlmIHQoaTE4bl9rZXkpID09IGkxOG5fa2V5XHJcbiMgXHRcdFx0aWYgIWl0ZW0ubGFiZWxcclxuIyBcdFx0XHRcdGl0ZW0ubGFiZWwgPSBpdGVtX25hbWVcclxuIyBcdFx0ZWxzZVxyXG4jIFx0XHRcdGl0ZW0ubGFiZWwgPSB0KGkxOG5fa2V5KVxyXG5cclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXggPSAob2JqZWN0KS0+XHJcblx0aWYgb2JqZWN0XHJcblx0XHRpZiAhb2JqZWN0LmRhdGFiYXNlX25hbWUgfHwgb2JqZWN0LmRhdGFiYXNlX25hbWUgPT0gJ21ldGVvci1tb25nbydcclxuXHRcdFx0cmV0dXJuIFwiL2FwaS9vZGF0YS92NFwiXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBcIi9hcGkvb2RhdGEvI3tvYmplY3QuZGF0YWJhc2VfbmFtZX1cIlxyXG5cclxuIyBpZiBNZXRlb3IuaXNDbGllbnRcclxuXHJcbiMgXHRNZXRlb3Iuc3RhcnR1cCAtPlxyXG4jIFx0XHRUcmFja2VyLmF1dG9ydW4gLT5cclxuIyBcdFx0XHRpZiBTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICYmIENyZWF0b3IuYm9vdHN0cmFwTG9hZGVkPy5nZXQoKVxyXG4jIFx0XHRcdFx0Xy5lYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG9iamVjdCwgb2JqZWN0X25hbWUpLT5cclxuIyBcdFx0XHRcdFx0b2JqZWN0LmkxOG4oKVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRpZiAhQ3JlYXRvci5ib290c3RyYXBMb2FkZWQgJiYgQ3JlYXRvci5PYmplY3RzXHJcblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAob2JqZWN0KS0+XHJcblx0XHRcdG5ldyBDcmVhdG9yLk9iamVjdChvYmplY3QpXHJcblxyXG4iLCJ2YXIgY2xvbmU7XG5cbmNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcblxuQ3JlYXRvci5vYmplY3RzQnlOYW1lID0ge307XG5cbkNyZWF0b3IuZm9ybWF0T2JqZWN0TmFtZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGlmIChvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjZnMuZmlsZXMuJykpIHtcbiAgICBvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpO1xuICB9XG4gIHJldHVybiBvYmplY3RfbmFtZTtcbn07XG5cbkNyZWF0b3IuT2JqZWN0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICB2YXIgX2Jhc2VPYmplY3QsIF9kYiwgZGVmYXVsdExpc3RWaWV3SWQsIGRlZmF1bHRWaWV3LCBkaXNhYmxlZF9saXN0X3ZpZXdzLCBwZXJtaXNzaW9ucywgcmVmLCByZWYxLCByZWYyLCByZWYzLCBzY2hlbWEsIHNlbGY7XG4gIF9iYXNlT2JqZWN0ID0gQ3JlYXRvci5iYXNlT2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgX2Jhc2VPYmplY3QgPSB7XG4gICAgICBhY3Rpb25zOiBDcmVhdG9yLmJhc2VPYmplY3QuYWN0aW9ucyxcbiAgICAgIGZpZWxkczoge30sXG4gICAgICB0cmlnZ2Vyczoge30sXG4gICAgICBwZXJtaXNzaW9uX3NldDoge31cbiAgICB9O1xuICB9XG4gIHNlbGYgPSB0aGlzO1xuICBpZiAoIW9wdGlvbnMubmFtZSkge1xuICAgIGNvbnNvbGUuZXJyb3Iob3B0aW9ucyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XG4gIH1cbiAgc2VsZi5faWQgPSBvcHRpb25zLl9pZCB8fCBvcHRpb25zLm5hbWU7XG4gIHNlbGYuc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICBzZWxmLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gIHNlbGYubGFiZWwgPSBvcHRpb25zLmxhYmVsO1xuICBzZWxmLmljb24gPSBvcHRpb25zLmljb247XG4gIHNlbGYuZGVzY3JpcHRpb24gPSBvcHRpb25zLmRlc2NyaXB0aW9uO1xuICBzZWxmLmlzX3ZpZXcgPSBvcHRpb25zLmlzX3ZpZXc7XG4gIHNlbGYuZm9ybSA9IG9wdGlvbnMuZm9ybTtcbiAgc2VsZi5yZWxhdGVkTGlzdCA9IG9wdGlvbnMucmVsYXRlZExpc3Q7XG4gIGlmICghXy5pc0Jvb2xlYW4ob3B0aW9ucy5pc19lbmFibGUpIHx8IG9wdGlvbnMuaXNfZW5hYmxlID09PSB0cnVlKSB7XG4gICAgc2VsZi5pc19lbmFibGUgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHNlbGYuaXNfZW5hYmxlID0gZmFsc2U7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChfLmhhcyhvcHRpb25zLCAnYWxsb3dfYWN0aW9ucycpKSB7XG4gICAgICBzZWxmLmFsbG93X2FjdGlvbnMgPSBvcHRpb25zLmFsbG93X2FjdGlvbnM7XG4gICAgfVxuICAgIGlmIChfLmhhcyhvcHRpb25zLCAnYWxsb3dfcmVsYXRlZExpc3QnKSkge1xuICAgICAgc2VsZi5hbGxvd19yZWxhdGVkTGlzdCA9IG9wdGlvbnMuYWxsb3dfcmVsYXRlZExpc3Q7XG4gICAgfVxuICB9XG4gIHNlbGYuZW5hYmxlX3NlYXJjaCA9IG9wdGlvbnMuZW5hYmxlX3NlYXJjaDtcbiAgc2VsZi5lbmFibGVfZmlsZXMgPSBvcHRpb25zLmVuYWJsZV9maWxlcztcbiAgc2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrcztcbiAgc2VsZi5lbmFibGVfbm90ZXMgPSBvcHRpb25zLmVuYWJsZV9ub3RlcztcbiAgc2VsZi5lbmFibGVfYXVkaXQgPSBvcHRpb25zLmVuYWJsZV9hdWRpdDtcbiAgaWYgKG9wdGlvbnMucGFnaW5nKSB7XG4gICAgc2VsZi5wYWdpbmcgPSBvcHRpb25zLnBhZ2luZztcbiAgfVxuICBzZWxmLmhpZGRlbiA9IG9wdGlvbnMuaGlkZGVuO1xuICBzZWxmLmVuYWJsZV9hcGkgPSAob3B0aW9ucy5lbmFibGVfYXBpID09PSB2b2lkIDApIHx8IG9wdGlvbnMuZW5hYmxlX2FwaTtcbiAgc2VsZi5jdXN0b20gPSBvcHRpb25zLmN1c3RvbTtcbiAgc2VsZi5lbmFibGVfc2hhcmUgPSBvcHRpb25zLmVuYWJsZV9zaGFyZTtcbiAgc2VsZi5lbmFibGVfaW5zdGFuY2VzID0gb3B0aW9ucy5lbmFibGVfaW5zdGFuY2VzO1xuICBzZWxmLmVuYWJsZV9wcm9jZXNzID0gb3B0aW9ucy5lbmFibGVfcHJvY2VzcztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkpIHtcbiAgICAgIHNlbGYuZW5hYmxlX3RyZWUgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWU7XG4gICAgICBzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKTtcbiAgICBzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZTtcbiAgfVxuICBzZWxmLm9wZW5fd2luZG93ID0gb3B0aW9ucy5vcGVuX3dpbmRvdztcbiAgc2VsZi5maWx0ZXJfY29tcGFueSA9IG9wdGlvbnMuZmlsdGVyX2NvbXBhbnk7XG4gIHNlbGYuY2FsZW5kYXIgPSBfLmNsb25lKG9wdGlvbnMuY2FsZW5kYXIpO1xuICBzZWxmLmVuYWJsZV9jaGF0dGVyID0gb3B0aW9ucy5lbmFibGVfY2hhdHRlcjtcbiAgc2VsZi5lbmFibGVfdHJhc2ggPSBvcHRpb25zLmVuYWJsZV90cmFzaDtcbiAgc2VsZi5lbmFibGVfc3BhY2VfZ2xvYmFsID0gb3B0aW9ucy5lbmFibGVfc3BhY2VfZ2xvYmFsO1xuICBzZWxmLmVuYWJsZV9hcHByb3ZhbHMgPSBvcHRpb25zLmVuYWJsZV9hcHByb3ZhbHM7XG4gIHNlbGYuZW5hYmxlX2ZvbGxvdyA9IG9wdGlvbnMuZW5hYmxlX2ZvbGxvdztcbiAgc2VsZi5lbmFibGVfd29ya2Zsb3cgPSBvcHRpb25zLmVuYWJsZV93b3JrZmxvdztcbiAgc2VsZi5lbmFibGVfaW5saW5lX2VkaXQgPSBvcHRpb25zLmVuYWJsZV9pbmxpbmVfZWRpdDtcbiAgaWYgKF8uaGFzKG9wdGlvbnMsICdpbl9kZXZlbG9wbWVudCcpKSB7XG4gICAgc2VsZi5pbl9kZXZlbG9wbWVudCA9IG9wdGlvbnMuaW5fZGV2ZWxvcG1lbnQ7XG4gIH1cbiAgc2VsZi5pZEZpZWxkTmFtZSA9ICdfaWQnO1xuICBpZiAob3B0aW9ucy5kYXRhYmFzZV9uYW1lKSB7XG4gICAgc2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lO1xuICB9XG4gIGlmICghb3B0aW9ucy5maWVsZHMpIHtcbiAgICBjb25zb2xlLmVycm9yKG9wdGlvbnMpO1xuICAgIHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgZmllbGRzJyk7XG4gIH1cbiAgc2VsZi5maWVsZHMgPSBjbG9uZShvcHRpb25zLmZpZWxkcyk7XG4gIF8uZWFjaChzZWxmLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoZmllbGQuaXNfbmFtZSkge1xuICAgICAgc2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZF9uYW1lID09PSAnbmFtZScgJiYgIXNlbGYuTkFNRV9GSUVMRF9LRVkpIHtcbiAgICAgIHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICBpZiAoZmllbGQucHJpbWFyeSkge1xuICAgICAgc2VsZi5pZEZpZWxkTmFtZSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkpIHtcbiAgICAgICAgaWYgKGZpZWxkX25hbWUgPT09ICdzcGFjZScpIHtcbiAgICAgICAgICBmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gZmllbGQuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoIW9wdGlvbnMuZGF0YWJhc2VfbmFtZSB8fCBvcHRpb25zLmRhdGFiYXNlX25hbWUgPT09ICdtZXRlb3ItbW9uZ28nKSB7XG4gICAgXy5lYWNoKF9iYXNlT2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgIGlmICghc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pIHtcbiAgICAgICAgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoZmllbGQpLCBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSk7XG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmIChmaWVsZC50eXBlID09PSAnYXV0b251bWJlcicpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZm9ybXVsYScpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnc3VtbWFyeScpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfVxuICB9KTtcbiAgc2VsZi5saXN0X3ZpZXdzID0ge307XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhzZWxmLm5hbWUpO1xuICBfLmVhY2gob3B0aW9ucy5saXN0X3ZpZXdzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgb2l0ZW07XG4gICAgb2l0ZW0gPSBDcmVhdG9yLmNvbnZlcnRMaXN0VmlldyhkZWZhdWx0VmlldywgaXRlbSwgaXRlbV9uYW1lKTtcbiAgICByZXR1cm4gc2VsZi5saXN0X3ZpZXdzW2l0ZW1fbmFtZV0gPSBvaXRlbTtcbiAgfSk7XG4gIHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnRyaWdnZXJzKTtcbiAgXy5lYWNoKG9wdGlvbnMudHJpZ2dlcnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIGlmICghc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdLm5hbWUgPSBpdGVtX25hbWU7XG4gICAgcmV0dXJuIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSk7XG4gIH0pO1xuICBzZWxmLmFjdGlvbnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LmFjdGlvbnMpO1xuICBfLmVhY2gob3B0aW9ucy5hY3Rpb25zLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgY29weUl0ZW07XG4gICAgaWYgKCFzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgY29weUl0ZW0gPSBfLmNsb25lKHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKTtcbiAgICBkZWxldGUgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV07XG4gICAgcmV0dXJuIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0gXy5leHRlbmQoY29weUl0ZW0sIGl0ZW0pO1xuICB9KTtcbiAgXy5lYWNoKHNlbGYuYWN0aW9ucywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgcmV0dXJuIGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZTtcbiAgfSk7XG4gIHNlbGYucmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhzZWxmLm5hbWUpO1xuICBzZWxmLnBlcm1pc3Npb25fc2V0ID0gXy5jbG9uZShfYmFzZU9iamVjdC5wZXJtaXNzaW9uX3NldCk7XG4gIGlmICghb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fTtcbiAgfVxuICBpZiAoISgocmVmID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZi5hZG1pbiA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LmFkbWluID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1wiYWRtaW5cIl0pO1xuICB9XG4gIGlmICghKChyZWYxID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZjEudXNlciA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LnVzZXIgPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJ1c2VyXCJdKTtcbiAgfVxuICBfLmVhY2gob3B0aW9ucy5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgaWYgKCFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pLCBpdGVtKTtcbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnM7XG4gICAgZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzIDogdm9pZCAwO1xuICAgIGlmIChkaXNhYmxlZF9saXN0X3ZpZXdzICE9IG51bGwgPyBkaXNhYmxlZF9saXN0X3ZpZXdzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgZGVmYXVsdExpc3RWaWV3SWQgPSAocmVmMiA9IG9wdGlvbnMubGlzdF92aWV3cykgIT0gbnVsbCA/IChyZWYzID0gcmVmMi5hbGwpICE9IG51bGwgPyByZWYzLl9pZCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChkZWZhdWx0TGlzdFZpZXdJZCkge1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAoZGlzYWJsZWRfbGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3X2l0ZW0pIHtcbiAgICAgICAgICBpZiAoZGVmYXVsdExpc3RWaWV3SWQgPT09IGxpc3Rfdmlld19pdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJhbGxcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3Rfdmlld19pdGVtO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYucGVybWlzc2lvbnMgPSBuZXcgUmVhY3RpdmVWYXIocGVybWlzc2lvbnMpO1xuICB9IGVsc2Uge1xuICAgIHNlbGYucGVybWlzc2lvbnMgPSBudWxsO1xuICB9XG4gIF9kYiA9IENyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbihvcHRpb25zKTtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1tfZGIuX25hbWVdID0gX2RiO1xuICBzZWxmLmRiID0gX2RiO1xuICBzZWxmLl9jb2xsZWN0aW9uX25hbWUgPSBfZGIuX25hbWU7XG4gIHNjaGVtYSA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHNlbGYpO1xuICBzZWxmLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoc2NoZW1hKTtcbiAgaWYgKHNlbGYubmFtZSAhPT0gXCJ1c2Vyc1wiICYmIHNlbGYubmFtZSAhPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiICYmICFzZWxmLmlzX3ZpZXcgJiYgIV8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIiwgXCJhY3Rpb25fZmllbGRfdXBkYXRlc1wiXSwgc2VsZi5uYW1lKSkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChzZWxmLm5hbWUgPT09IFwidXNlcnNcIikge1xuICAgIF9kYi5fc2ltcGxlU2NoZW1hID0gc2VsZi5zY2hlbWE7XG4gIH1cbiAgaWYgKF8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSkpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGY7XG4gIHJldHVybiBzZWxmO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0KSB7XG4gICAgaWYgKCFvYmplY3QuZGF0YWJhc2VfbmFtZSB8fCBvYmplY3QuZGF0YWJhc2VfbmFtZSA9PT0gJ21ldGVvci1tb25nbycpIHtcbiAgICAgIHJldHVybiBcIi9hcGkvb2RhdGEvdjRcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiL2FwaS9vZGF0YS9cIiArIG9iamVjdC5kYXRhYmFzZV9uYW1lO1xuICAgIH1cbiAgfVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIGlmICghQ3JlYXRvci5ib290c3RyYXBMb2FkZWQgJiYgQ3JlYXRvci5PYmplY3RzKSB7XG4gICAgcmV0dXJuIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgcmV0dXJuIG5ldyBDcmVhdG9yLk9iamVjdChvYmplY3QpO1xuICAgIH0pO1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hID0gKG9iaikgLT5cclxuXHR1bmxlc3Mgb2JqXHJcblx0XHRyZXR1cm5cclxuXHRzY2hlbWEgPSB7fVxyXG5cclxuXHRmaWVsZHNBcnIgPSBbXVxyXG5cclxuXHRfLmVhY2ggb2JqLmZpZWxkcyAsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG5cdFx0aWYgIV8uaGFzKGZpZWxkLCBcIm5hbWVcIilcclxuXHRcdFx0ZmllbGQubmFtZSA9IGZpZWxkX25hbWVcclxuXHRcdGZpZWxkc0Fyci5wdXNoIGZpZWxkXHJcblxyXG5cdF8uZWFjaCBfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgKGZpZWxkKS0+XHJcblxyXG5cdFx0ZmllbGRfbmFtZSA9IGZpZWxkLm5hbWVcclxuXHJcblx0XHRmcyA9IHt9XHJcblx0XHRpZiBmaWVsZC5yZWdFeFxyXG5cdFx0XHRmcy5yZWdFeCA9IGZpZWxkLnJlZ0V4XHJcblx0XHRmcy5hdXRvZm9ybSA9IHt9XHJcblx0XHRmcy5hdXRvZm9ybS5tdWx0aXBsZSA9IGZpZWxkLm11bHRpcGxlXHJcblx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cclxuXHJcblx0XHRhdXRvZm9ybV90eXBlID0gZmllbGQuYXV0b2Zvcm0/LnR5cGVcclxuXHJcblx0XHRpZiBmaWVsZC50eXBlID09IFwidGV4dFwiIG9yIGZpZWxkLnR5cGUgPT0gXCJwaG9uZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIlt0ZXh0XVwiIG9yIGZpZWxkLnR5cGUgPT0gXCJbcGhvbmVdXCJcclxuXHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdjb2RlJ1xyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTJcclxuXHRcdFx0aWYgZmllbGQubGFuZ3VhZ2VcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5sYW5ndWFnZSA9IGZpZWxkLmxhbmd1YWdlXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ0ZXh0YXJlYVwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIlxyXG5cdFx0XHRmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAyXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJwYXNzd29yZFwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXHJcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKClcclxuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXHJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0XHR0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIlxyXG5cdFx0XHRcdFx0XHRkYXRlTW9iaWxlT3B0aW9uczpcclxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGVcIlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLm91dEZvcm1hdCA9ICd5eXl5LU1NLWRkJztcclxuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXHJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcclxuXHRcdFx0XHRcdFx0dGltZXpvbmVJZDogXCJ1dGNcIlxyXG5cdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXHJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcclxuXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRldGltZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXHJcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKClcclxuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXHJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0XHR0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIlxyXG5cdFx0XHRcdFx0XHRkYXRlTW9iaWxlT3B0aW9uczpcclxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxyXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cclxuXHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXHJcblx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XHJcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXHJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIltPYmplY3RdXCJcclxuXHRcdFx0ZnMudHlwZSA9IFtPYmplY3RdXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJodG1sXCJcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHRsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXHJcblx0XHRcdFx0aWYgbG9jYWxlID09IFwiemgtY25cIiB8fCBsb2NhbGUgPT0gXCJ6aC1DTlwiXHJcblx0XHRcdFx0XHRsb2NhbGUgPSBcInpoLUNOXCJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRsb2NhbGUgPSBcImVuLVVTXCJcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0dHlwZTogXCJzdW1tZXJub3RlXCJcclxuXHRcdFx0XHRcdGNsYXNzOiAnc3VtbWVybm90ZS1lZGl0b3InXHJcblx0XHRcdFx0XHRzZXR0aW5nczpcclxuXHRcdFx0XHRcdFx0aGVpZ2h0OiAyMDBcclxuXHRcdFx0XHRcdFx0ZGlhbG9nc0luQm9keTogdHJ1ZVxyXG5cdFx0XHRcdFx0XHR0b29sYmFyOiAgW1xyXG5cdFx0XHRcdFx0XHRcdFsnZm9udDEnLCBbJ3N0eWxlJ11dLFxyXG5cdFx0XHRcdFx0XHRcdFsnZm9udDInLCBbJ2JvbGQnLCAndW5kZXJsaW5lJywgJ2l0YWxpYycsICdjbGVhciddXSxcclxuXHRcdFx0XHRcdFx0XHRbJ2ZvbnQzJywgWydmb250bmFtZSddXSxcclxuXHRcdFx0XHRcdFx0XHRbJ2NvbG9yJywgWydjb2xvciddXSxcclxuXHRcdFx0XHRcdFx0XHRbJ3BhcmEnLCBbJ3VsJywgJ29sJywgJ3BhcmFncmFwaCddXSxcclxuXHRcdFx0XHRcdFx0XHRbJ3RhYmxlJywgWyd0YWJsZSddXSxcclxuXHRcdFx0XHRcdFx0XHRbJ2luc2VydCcsIFsnbGluaycsICdwaWN0dXJlJ11dLFxyXG5cdFx0XHRcdFx0XHRcdFsndmlldycsIFsnY29kZXZpZXcnXV1cclxuXHRcdFx0XHRcdFx0XVxyXG5cdFx0XHRcdFx0XHRmb250TmFtZXM6IFsnQXJpYWwnLCAnQ29taWMgU2FucyBNUycsICdDb3VyaWVyIE5ldycsICdIZWx2ZXRpY2EnLCAnSW1wYWN0JywgJ+Wui+S9kycsJ+m7keS9kycsJ+W+rui9r+mbhem7kScsJ+S7v+WuiycsJ+alt+S9kycsJ+matuS5picsJ+W5vOWchiddXHJcblx0XHRcdFx0XHRcdGxhbmc6IGxvY2FsZVxyXG5cclxuXHRcdGVsc2UgaWYgKGZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIiBvciBmaWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKVxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmllbGQuc2hvd0ljb25cclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHJcblx0XHRcdGlmICFmaWVsZC5oaWRkZW5cclxuXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZmlsdGVycyA9IGZpZWxkLmZpbHRlcnNcclxuXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVwZW5kT24gPSBmaWVsZC5kZXBlbmRfb25cclxuXHJcblx0XHRcdFx0aWYgZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uXHJcblx0XHRcdFx0XHRmcy5iZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cclxuXHJcblx0XHRcdFx0ZnMuZmlsdGVyc0Z1bmN0aW9uID0gaWYgZmllbGQuZmlsdGVyc0Z1bmN0aW9uIHRoZW4gZmllbGQuZmlsdGVyc0Z1bmN0aW9uIGVsc2UgQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnNcclxuXHJcblx0XHRcdFx0aWYgZmllbGQub3B0aW9uc0Z1bmN0aW9uXHJcblx0XHRcdFx0XHRmcy5vcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb25cclxuXHJcblx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvXHJcblxyXG5cdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdGlmIGZpZWxkLmNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWVsZC5jcmVhdGVGdW5jdGlvbilcclxuXHRcdFx0XHRcdFx0XHRmcy5jcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpZWxkLnJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdFx0XHRcdF9yZWZfb2JqID0gQ3JlYXRvci5PYmplY3RzW2ZpZWxkLnJlZmVyZW5jZV90b11cclxuXHRcdFx0XHRcdFx0XHRcdGlmIF9yZWZfb2JqPy5wZXJtaXNzaW9ucz8uYWxsb3dDcmVhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5jcmVhdGVGdW5jdGlvbiA9IChsb29rdXBfZmllbGQpLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRNb2RhbC5zaG93KFwiQ3JlYXRvck9iamVjdE1vZGFsXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb246IFwiQ3JlYXRvci5Db2xsZWN0aW9ucy4je0NyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8pLl9uYW1lfVwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9ybUlkOiBcIm5ldyN7ZmllbGQucmVmZXJlbmNlX3RvLnJlcGxhY2UoJy4nLCdfJyl9XCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogXCIje2ZpZWxkLnJlZmVyZW5jZV90b31cIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9wZXJhdGlvbjogXCJpbnNlcnRcIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9uU3VjY2VzczogKG9wZXJhdGlvbiwgcmVzdWx0KS0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgcmVzdWx0Lm9iamVjdF9uYW1lID09IFwib2JqZWN0c1wiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFt7bGFiZWw6IHJlc3VsdC52YWx1ZS5sYWJlbCwgdmFsdWU6IHJlc3VsdC52YWx1ZS5uYW1lLCBpY29uOiByZXN1bHQudmFsdWUuaWNvbn1dLCByZXN1bHQudmFsdWUubmFtZSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbe2xhYmVsOiByZXN1bHQudmFsdWVbb2JqZWN0Lk5BTUVfRklFTERfS0VZXSB8fCByZXN1bHQudmFsdWUubGFiZWwgfHwgcmVzdWx0LnZhbHVlLm5hbWUsIHZhbHVlOiByZXN1bHQuX2lkfV0sIHJlc3VsdC5faWQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmFsc2VcclxuXHJcblx0XHRcdFx0XHRpZiBfLmlzQm9vbGVhbihmaWVsZC5jcmVhdGUpXHJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZpZWxkLmNyZWF0ZVxyXG5cclxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV9zb3J0XHJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNTb3J0ID0gZmllbGQucmVmZXJlbmNlX3NvcnRcclxuXHJcblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfbGltaXRcclxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc0xpbWl0ID0gZmllbGQucmVmZXJlbmNlX2xpbWl0XHJcblxyXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvID09IFwidXNlcnNcIlxyXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3R1c2VyXCJcclxuXHRcdFx0XHRcdFx0aWYgIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdFxyXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5Y2V5L2N5LiL55qE5pWw5o2uXHJcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTlj6/ku6XooqvmlLnlhpnopobnm5bmiJB0cnVlL2ZhbHNl5oiW5YW25LuWZnVuY3Rpb25cclxuXHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT0gdW5kZWZpbmVkXHJcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxyXG5cdFx0XHRcdFx0XHRcdFx0IyDlr7nlvZPliY3lr7nosaHmnIl2aWV3QWxsUmVjb3Jkc+adg+mZkOWImeS4jemZkOWItuaJgOWxnuWNleS9jeWIl+ihqOafpeeci+adg+mZkO+8jOWQpuWImeWPquaYvuekuuW9k+WJjeaJgOWxnuWNleS9jVxyXG5cdFx0XHRcdFx0XHRcdFx0IyDms6jmhI/kuI3mmK9yZWZlcmVuY2VfdG/lr7nosaHnmoR2aWV3QWxsUmVjb3Jkc+adg+mZkO+8jOiAjOaYr+W9k+WJjeWvueixoeeahFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zPy5nZXQoKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5a2X5q615omA5bGe5a+56LGh5piv55So5oi35oiW57uE57uH77yM5YiZ5piv5ZCm6ZmQ5Yi25pi+56S65omA5bGe5Y2V5L2N6YOo6Zeo5LiObW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWFs+iBlFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0Z1bmN0aW9uIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5Y2V5L2NXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0ZWxzZSBpZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT0gXCJvcmdhbml6YXRpb25zXCJcclxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0b3JnXCJcclxuXHRcdFx0XHRcdFx0aWYgIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdFxyXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5Y2V5L2N5LiL55qE5pWw5o2uXHJcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTlj6/ku6XooqvmlLnlhpnopobnm5bmiJB0cnVlL2ZhbHNl5oiW5YW25LuWZnVuY3Rpb25cclxuXHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT0gdW5kZWZpbmVkXHJcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxyXG5cdFx0XHRcdFx0XHRcdFx0IyDlr7nlvZPliY3lr7nosaHmnIl2aWV3QWxsUmVjb3Jkc+adg+mZkOWImeS4jemZkOWItuaJgOWxnuWNleS9jeWIl+ihqOafpeeci+adg+mZkO+8jOWQpuWImeWPquaYvuekuuW9k+WJjeaJgOWxnuWNleS9jVxyXG5cdFx0XHRcdFx0XHRcdFx0IyDms6jmhI/kuI3mmK9yZWZlcmVuY2VfdG/lr7nosaHnmoR2aWV3QWxsUmVjb3Jkc+adg+mZkO+8jOiAjOaYr+W9k+WJjeWvueixoeeahFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zPy5nZXQoKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5a2X5q615omA5bGe5a+56LGh5piv55So5oi35oiW57uE57uH77yM5YiZ5piv5ZCm6ZmQ5Yi25pi+56S65omA5bGe5Y2V5L2N6YOo6Zeo5LiObW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWFs+iBlFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0Z1bmN0aW9uIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5Y2V5L2NXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRpZiB0eXBlb2YoZmllbGQucmVmZXJlbmNlX3RvKSA9PSBcImZ1bmN0aW9uXCJcclxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvKClcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cclxuXHJcblx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShfcmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0XHRcdGZzLnR5cGUgPSBPYmplY3RcclxuXHRcdFx0XHRcdFx0XHRmcy5ibGFja2JveCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZVxyXG5cclxuXHRcdFx0XHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLm9cIl0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBTdHJpbmdcclxuXHRcdFx0XHRcdFx0XHRcdGF1dG9mb3JtOiB7b21pdDogdHJ1ZX1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuaWRzXCJdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogW1N0cmluZ11cclxuXHRcdFx0XHRcdFx0XHRcdGF1dG9mb3JtOiB7b21pdDogdHJ1ZX1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90byA9IFtfcmVmZXJlbmNlX3RvXVxyXG5cclxuXHRcdFx0XHRcdFx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXVxyXG5cdFx0XHRcdFx0XHRpZiBfb2JqZWN0IGFuZCBfb2JqZWN0LmVuYWJsZV90cmVlXHJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0VHJlZVwiXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiXHJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZCA9IGZpZWxkLm9wdGlvbnNNZXRob2QgfHwgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCJcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kUGFyYW1zID0gKCktPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XHJcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzID0gW11cclxuXHRcdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8uZm9yRWFjaCAoX3JlZmVyZW5jZSktPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIF9vYmplY3RcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2gge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogX29iamVjdD8ubGFiZWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGljb246IF9vYmplY3Q/Lmljb25cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpbms6ICgpLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiL2FwcC8je1Nlc3Npb24uZ2V0KCdhcHBfaWQnKX0vI3tfcmVmZXJlbmNlfS92aWV3L1wiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdDogX3JlZmVyZW5jZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGluazogKCktPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCIvYXBwLyN7U2Vzc2lvbi5nZXQoJ2FwcF9pZCcpfS8je19yZWZlcmVuY2V9L3ZpZXcvXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCJcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb25cclxuXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJzZWxlY3RcIlxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmFsc2VcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0XCJcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xyXG5cdFx0XHRcdGlmIF8uaGFzKGZpZWxkLCAnZmlyc3RPcHRpb24nKVxyXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBmaWVsZC5maXJzdE9wdGlvblxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gXCJcIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiY3VycmVuY3lcIlxyXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxyXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcclxuXHRcdFx0aWYgZmllbGQ/LnNjYWxlXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZVxyXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXHJcblx0XHRcdGVsc2UgaWYgZmllbGQ/LnNjYWxlICE9IDBcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IDJcclxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibnVtYmVyXCJcclxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XHJcblx0XHRcdGlmIGZpZWxkPy5zY2FsZVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGVcclxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYm9vbGVhblwiXHJcblx0XHRcdGZzLnR5cGUgPSBCb29sZWFuXHJcblx0XHRcdGlmIGZpZWxkLnJlYWRvbmx5XHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi1jaGVja2JveFwiXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ0b2dnbGVcIlxyXG5cdFx0XHRmcy50eXBlID0gQm9vbGVhblxyXG5cdFx0XHRpZiBmaWVsZC5yZWFkb25seVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZVxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tdG9nZ2xlXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInJlZmVyZW5jZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImNoZWNrYm94XCJcclxuXHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdC1jaGVja2JveFwiXHJcblx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJmaWxlXCIgYW5kIGZpZWxkLmNvbGxlY3Rpb25cclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxyXG5cdFx0XHRcdFx0YXV0b2Zvcm06XHJcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiBmaWVsZC5jb2xsZWN0aW9uXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSBmaWVsZC5jb2xsZWN0aW9uXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJmaWxlc2l6ZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlc2l6ZSdcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIk9iamVjdFwiIHx8IGZpZWxkLnR5cGUgPT0gXCJvYmplY3RcIlxyXG5cdFx0XHRmcy50eXBlID0gT2JqZWN0XHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJncmlkXCJcclxuXHRcdFx0ZnMudHlwZSA9IEFycmF5XHJcblx0XHRcdGZzLmF1dG9mb3JtLmVkaXRhYmxlID0gdHJ1ZVxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zR3JpZFwiXHJcblxyXG5cdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxyXG5cdFx0XHRcdHR5cGU6IE9iamVjdFxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiaW1hZ2VcIlxyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XHJcblx0XHRcdFx0XHRhdXRvZm9ybTpcclxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdpbWFnZXMnXHJcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2ltYWdlLyonXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnaW1hZ2VzJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYXZhdGFyXCJcclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxyXG5cdFx0XHRcdFx0YXV0b2Zvcm06XHJcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnYXZhdGFycydcclxuXHRcdFx0XHRcdFx0YWNjZXB0OiAnaW1hZ2UvKidcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdmF0YXJzJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYXVkaW9cIlxyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XHJcblx0XHRcdFx0XHRhdXRvZm9ybTpcclxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdhdWRpb3MnXHJcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2F1ZGlvLyonXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXVkaW9zJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdhdWRpby8qJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidmlkZW9cIlxyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XHJcblx0XHRcdFx0XHRhdXRvZm9ybTpcclxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICd2aWRlb3MnXHJcblx0XHRcdFx0XHRcdGFjY2VwdDogJ3ZpZGVvLyonXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAndmlkZW9zJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICd2aWRlby8qJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibG9jYXRpb25cIlxyXG5cdFx0XHRmcy50eXBlID0gT2JqZWN0XHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcImxvY2F0aW9uXCJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uc3lzdGVtID0gZmllbGQuc3lzdGVtIHx8IFwid2dzODRcIlxyXG5cdFx0XHRmcy5ibGFja2JveCA9IHRydWVcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIm1hcmtkb3duXCJcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLW1hcmtkb3duXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAndXJsJ1xyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdCMgZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguVXJsXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc1VybCdcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZW1haWwnXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0ZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zRW1haWwnXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2F1dG9udW1iZXInXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZm9ybXVsYSdcclxuXHRcdFx0ZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7ZmllbGRzOiB7ZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7dHlwZTogZmllbGQuZGF0YV90eXBlfSl9fSlbZmllbGQubmFtZV1cclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnc3VtbWFyeSdcclxuXHRcdFx0ZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7ZmllbGRzOiB7ZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7dHlwZTogZmllbGQuZGF0YV90eXBlfSl9fSlbZmllbGQubmFtZV1cclxuXHRcdGVsc2VcclxuXHRcdFx0ZnMudHlwZSA9IGZpZWxkLnR5cGVcclxuXHJcblx0XHRpZiBmaWVsZC5sYWJlbFxyXG5cdFx0XHRmcy5sYWJlbCA9IGZpZWxkLmxhYmVsXHJcblxyXG4jXHRcdGlmIGZpZWxkLmFsbG93ZWRWYWx1ZXNcclxuI1x0XHRcdGZzLmFsbG93ZWRWYWx1ZXMgPSBmaWVsZC5hbGxvd2VkVmFsdWVzXHJcblxyXG5cdFx0aWYgIWZpZWxkLnJlcXVpcmVkXHJcblx0XHRcdGZzLm9wdGlvbmFsID0gdHJ1ZVxyXG5cclxuXHRcdCMgW+etvue6puWvueixoeWQjOaXtumFjee9ruS6hmNvbXBhbnlfaWRz5b+F5aGr5Y+KdW5lZGl0YWJsZV9maWVsZHPpgKDmiJDpg6jliIbnlKjmiLfmlrDlu7rnrb7nuqblr7nosaHml7bmiqXplJkgIzE5Ml0oaHR0cHM6Ly9naXRodWIuY29tL3N0ZWVkb3Mvc3RlZWRvcy1wcm9qZWN0LWR6dWcvaXNzdWVzLzE5MilcclxuXHRcdCMg5ZCO5Y+w5aeL57uI6K6+572ucmVxdWlyZWTkuLpmYWxzZVxyXG5cdFx0aWYgIU1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRmcy5vcHRpb25hbCA9IHRydWVcclxuXHJcblx0XHRpZiBmaWVsZC51bmlxdWVcclxuXHRcdFx0ZnMudW5pcXVlID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGZpZWxkLm9taXRcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ub21pdCA9IHRydWVcclxuXHJcblx0XHRpZiBmaWVsZC5ncm91cFxyXG5cdFx0XHRmcy5hdXRvZm9ybS5ncm91cCA9IGZpZWxkLmdyb3VwXHJcblxyXG5cdFx0aWYgZmllbGQuaXNfd2lkZVxyXG5cdFx0XHRmcy5hdXRvZm9ybS5pc193aWRlID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGZpZWxkLmhpZGRlblxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJoaWRkZW5cIlxyXG5cclxuXHRcdGlmIChmaWVsZC50eXBlID09IFwic2VsZWN0XCIpIG9yIChmaWVsZC50eXBlID09IFwibG9va3VwXCIpIG9yIChmaWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKVxyXG5cdFx0XHRpZiB0eXBlb2YoZmllbGQuZmlsdGVyYWJsZSkgPT0gJ3VuZGVmaW5lZCdcclxuXHRcdFx0XHRmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZVxyXG5cdFx0aWYgZmllbGQubmFtZSA9PSAnbmFtZScgfHwgZmllbGQuaXNfbmFtZVxyXG5cdFx0XHRpZiB0eXBlb2YoZmllbGQuc2VhcmNoYWJsZSkgPT0gJ3VuZGVmaW5lZCdcclxuXHRcdFx0XHRmaWVsZC5zZWFyY2hhYmxlID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGF1dG9mb3JtX3R5cGVcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IGF1dG9mb3JtX3R5cGVcclxuXHJcblx0XHRpZiBmaWVsZC5kZWZhdWx0VmFsdWVcclxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50IGFuZCBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmaWVsZC5kZWZhdWx0VmFsdWUpXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gKCktPlxyXG5cdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZpZWxkLmRlZmF1bHRWYWx1ZSwge3VzZXJJZDogTWV0ZW9yLnVzZXJJZCgpLCBzcGFjZUlkOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksIG5vdzogbmV3IERhdGUoKX0pXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcclxuXHRcdFx0XHRpZiAhXy5pc0Z1bmN0aW9uKGZpZWxkLmRlZmF1bHRWYWx1ZSlcclxuXHRcdFx0XHRcdGZzLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxyXG5cclxuXHRcdGlmIGZpZWxkLnJlYWRvbmx5XHJcblx0XHRcdGZzLmF1dG9mb3JtLnJlYWRvbmx5ID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGZpZWxkLmRpc2FibGVkXHJcblx0XHRcdGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGZpZWxkLmlubGluZUhlbHBUZXh0XHJcblx0XHRcdGZzLmF1dG9mb3JtLmlubGluZUhlbHBUZXh0ID0gZmllbGQuaW5saW5lSGVscFRleHRcclxuXHJcblx0XHRpZiBmaWVsZC5ibGFja2JveFxyXG5cdFx0XHRmcy5ibGFja2JveCA9IHRydWVcclxuXHJcblx0XHRpZiBfLmhhcyhmaWVsZCwgJ21pbicpXHJcblx0XHRcdGZzLm1pbiA9IGZpZWxkLm1pblxyXG5cdFx0aWYgXy5oYXMoZmllbGQsICdtYXgnKVxyXG5cdFx0XHRmcy5tYXggPSBmaWVsZC5tYXhcclxuXHJcblx0XHQjIOWPquacieeUn+S6p+eOr+Wig+aJjemHjeW7uue0ouW8lVxyXG5cdFx0aWYgTWV0ZW9yLmlzUHJvZHVjdGlvblxyXG5cdFx0XHRpZiBmaWVsZC5pbmRleFxyXG5cdFx0XHRcdGZzLmluZGV4ID0gZmllbGQuaW5kZXhcclxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5zb3J0YWJsZVxyXG5cdFx0XHRcdGZzLmluZGV4ID0gdHJ1ZVxyXG5cclxuXHRcdHNjaGVtYVtmaWVsZF9uYW1lXSA9IGZzXHJcblxyXG5cdHJldHVybiBzY2hlbWFcclxuXHJcblxyXG5DcmVhdG9yLmdldEZpZWxkRGlzcGxheVZhbHVlID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZF92YWx1ZSktPlxyXG5cdGh0bWwgPSBmaWVsZF92YWx1ZVxyXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGlmICFvYmplY3RcclxuXHRcdHJldHVybiBcIlwiXHJcblx0ZmllbGQgPSBvYmplY3QuZmllbGRzKGZpZWxkX25hbWUpXHJcblx0aWYgIWZpZWxkXHJcblx0XHRyZXR1cm4gXCJcIlxyXG5cclxuXHRpZiBmaWVsZC50eXBlID09IFwiZGF0ZXRpbWVcIlxyXG5cdFx0aHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREIEg6bW0nKVxyXG5cdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGVcIlxyXG5cdFx0aHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREJylcclxuXHJcblx0cmV0dXJuIGh0bWxcclxuXHJcbkNyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5ID0gKGZpZWxkX3R5cGUpLT5cclxuXHRyZXR1cm4gW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCIsIFwiY3VycmVuY3lcIiwgXCJudW1iZXJcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcclxuXHJcbkNyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzID0gKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpLT5cclxuXHRidWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKVxyXG5cdGlmIGJ1aWx0aW5WYWx1ZXNcclxuXHRcdF8uZm9yRWFjaCBidWlsdGluVmFsdWVzLCAoYnVpbHRpbkl0ZW0sIGtleSktPlxyXG5cdFx0XHRvcGVyYXRpb25zLnB1c2goe2xhYmVsOiBidWlsdGluSXRlbS5sYWJlbCwgdmFsdWU6IGtleX0pXHJcblxyXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzID0gKGZpZWxkX3R5cGUsIGlzX2NoZWNrX29ubHkpLT5cclxuXHQjIOi/h+a7pOWZqOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxyXG5cdGlmIFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpXHJcblxyXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtID0gKGZpZWxkX3R5cGUsIGtleSktPlxyXG5cdCMg6L+H5ruk5Zmo5a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XHJcblx0aWYgW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwga2V5KVxyXG5cclxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpbk9wZXJhdGlvbiA9IChmaWVsZF90eXBlLCB2YWx1ZSktPlxyXG5cdCMg5qC55o2u6L+H5ruk5Zmo55qE6L+H5ruk5YC877yM6I635Y+W5a+55bqU55qE5YaF572u6L+Q566X56ymXHJcblx0IyDmr5TlpoJ2YWx1ZeS4umxhc3RfeWVhcu+8jOi/lOWbnmJldHdlZW5fdGltZV9sYXN0X3llYXJcclxuXHR1bmxlc3MgXy5pc1N0cmluZyh2YWx1ZSlcclxuXHRcdHJldHVyblxyXG5cdGJldHdlZW5CdWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKVxyXG5cdHVubGVzcyBiZXR3ZWVuQnVpbHRpblZhbHVlc1xyXG5cdFx0cmV0dXJuXHJcblx0cmVzdWx0ID0gbnVsbFxyXG5cdF8uZWFjaCBiZXR3ZWVuQnVpbHRpblZhbHVlcywgKGl0ZW0sIG9wZXJhdGlvbiktPlxyXG5cdFx0aWYgaXRlbS5rZXkgPT0gdmFsdWVcclxuXHRcdFx0cmVzdWx0ID0gb3BlcmF0aW9uXHJcblx0cmV0dXJuIHJlc3VsdFxyXG5cclxuIyDlpoLmnpzlj6rmmK/kuLrliKTmlq1vcGVyYXRpb27mmK/lkKblrZjlnKjvvIzliJnmsqHlv4XopoHorqHnrpd2YWx1ZXPvvIzkvKDlhaVpc19jaGVja19vbmx55Li6dHJ1ZeWNs+WPr1xyXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyA9IChpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKS0+XHJcblx0IyDov4fmu6Tlmajml7bpl7TlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcclxuXHRyZXR1cm4ge1xyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF95ZWFyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3llYXJcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfeWVhclwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF95ZWFyXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF9xdWFydGVyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3F1YXJ0ZXJcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfcXVhcnRlclwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9xdWFydGVyXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF9tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9tb250aFwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfbW9udGhcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X21vbnRoXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF93ZWVrXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3dlZWtcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfd2Vla1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF93ZWVrXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfeWVzdGRheVwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwieWVzdGRheVwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RvZGF5XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b2RheVwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RvbW9ycm93XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b21vcnJvd1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfN19kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzdfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfMzBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8zMF9kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzYwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzkwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfOTBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfMTIwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMTIwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzdfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF83X2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzMwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMzBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfNjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF82MF9kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF85MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzkwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzEyMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzEyMF9kYXlzXCIpXHJcblx0fVxyXG5cclxuQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aCA9IChtb250aCktPlxyXG5cdGlmICFtb250aFxyXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcclxuXHRcclxuXHRpZiBtb250aCA8IDNcclxuXHRcdHJldHVybiAwXHJcblx0ZWxzZSBpZiBtb250aCA8IDZcclxuXHRcdHJldHVybiAzXHJcblx0ZWxzZSBpZiBtb250aCA8IDlcclxuXHRcdHJldHVybiA2XHJcblx0XHJcblx0cmV0dXJuIDlcclxuXHJcblxyXG5DcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkgPSAoeWVhcixtb250aCktPlxyXG5cdGlmICF5ZWFyXHJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXHJcblx0aWYgIW1vbnRoXHJcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxyXG5cdFxyXG5cdGlmIG1vbnRoIDwgM1xyXG5cdFx0eWVhci0tXHJcblx0XHRtb250aCA9IDlcclxuXHRlbHNlIGlmIG1vbnRoIDwgNlxyXG5cdFx0bW9udGggPSAwXHJcblx0ZWxzZSBpZiBtb250aCA8IDlcclxuXHRcdG1vbnRoID0gM1xyXG5cdGVsc2UgXHJcblx0XHRtb250aCA9IDZcclxuXHRcclxuXHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0XHJcblxyXG5DcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkgPSAoeWVhcixtb250aCktPlxyXG5cdGlmICF5ZWFyXHJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXHJcblx0aWYgIW1vbnRoXHJcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxyXG5cdFxyXG5cdGlmIG1vbnRoIDwgM1xyXG5cdFx0bW9udGggPSAzXHJcblx0ZWxzZSBpZiBtb250aCA8IDZcclxuXHRcdG1vbnRoID0gNlxyXG5cdGVsc2UgaWYgbW9udGggPCA5XHJcblx0XHRtb250aCA9IDlcclxuXHRlbHNlXHJcblx0XHR5ZWFyKytcclxuXHRcdG1vbnRoID0gMFxyXG5cdFxyXG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcclxuXHJcbkNyZWF0b3IuZ2V0TW9udGhEYXlzID0gKHllYXIsbW9udGgpLT5cclxuXHRpZiBtb250aCA9PSAxMVxyXG5cdFx0cmV0dXJuIDMxXHJcblx0XHJcblx0bWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0XHJcblx0c3RhcnREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0ZW5kRGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoKzEsIDEpXHJcblx0ZGF5cyA9IChlbmREYXRlLXN0YXJ0RGF0ZSkvbWlsbGlzZWNvbmRcclxuXHRyZXR1cm4gZGF5c1xyXG5cclxuQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheSA9ICh5ZWFyLCBtb250aCktPlxyXG5cdGlmICF5ZWFyXHJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXHJcblx0aWYgIW1vbnRoXHJcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxyXG5cdFxyXG5cdCMg5pyI5Lu95Li6MOS7o+ihqOacrOW5tOeahOesrOS4gOaciFxyXG5cdGlmIG1vbnRoID09IDBcclxuXHRcdG1vbnRoID0gMTFcclxuXHRcdHllYXItLVxyXG5cdFx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxyXG5cdFxyXG5cdCMg5ZCm5YiZLOWPquWHj+WOu+aciOS7vVxyXG5cdG1vbnRoLS07XHJcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxyXG5cdFxyXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSA9IChmaWVsZF90eXBlLCBrZXkpLT5cclxuXHQjIOi/h+a7pOWZqGJldHdlZW7ov5DnrpfnrKbvvIznjrDnrpfml6XmnJ8v5pel5pyf5pe26Ze057G75Z6L5a2X5q6155qEdmFsdWVz5YC8XHJcblx0bm93ID0gbmV3IERhdGUoKVxyXG5cdCMg5LiA5aSp55qE5q+r56eS5pWwXHJcblx0bWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0XHJcblx0eWVzdGRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcclxuXHR0b21vcnJvdyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZClcclxuXHQjIOS4gOWRqOS4reeahOafkOS4gOWkqVxyXG5cdHdlZWsgPSBub3cuZ2V0RGF5KClcclxuXHQjIOWHj+WOu+eahOWkqeaVsFxyXG5cdG1pbnVzRGF5ID0gaWYgd2VlayAhPSAwIHRoZW4gd2VlayAtIDEgZWxzZSA2XHJcblx0bW9uZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIChtaW51c0RheSAqIG1pbGxpc2Vjb25kKSlcclxuXHRzdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDkuIrlkajml6VcclxuXHRsYXN0U3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxyXG5cdCMg5LiK5ZGo5LiAXHJcblx0bGFzdE1vbmRheSA9IG5ldyBEYXRlKGxhc3RTdW5kYXkuZ2V0VGltZSgpIC0gKG1pbGxpc2Vjb25kICogNikpXHJcblx0IyDkuIvlkajkuIBcclxuXHRuZXh0TW9uZGF5ID0gbmV3IERhdGUoc3VuZGF5LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKVxyXG5cdCMg5LiL5ZGo5pelXHJcblx0bmV4dFN1bmRheSA9IG5ldyBEYXRlKG5leHRNb25kYXkuZ2V0VGltZSgpICsgKG1pbGxpc2Vjb25kICogNikpXHJcblx0Y3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxyXG5cdHByZXZpb3VzWWVhciA9IGN1cnJlbnRZZWFyIC0gMVxyXG5cdG5leHRZZWFyID0gY3VycmVudFllYXIgKyAxXHJcblx0IyDlvZPliY3mnIjku71cclxuXHRjdXJyZW50TW9udGggPSBub3cuZ2V0TW9udGgoKVxyXG5cdCMg6K6h5pWw5bm044CB5pyIXHJcblx0eWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXHJcblx0bW9udGggPSBub3cuZ2V0TW9udGgoKVxyXG5cdCMg5pys5pyI56ys5LiA5aSpXHJcblx0Zmlyc3REYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixjdXJyZW50TW9udGgsMSlcclxuXHJcblx0IyDlvZPkuLoxMuaciOeahOaXtuWAmeW5tOS7vemcgOimgeWKoDFcclxuXHQjIOaciOS7vemcgOimgeabtOaWsOS4ujAg5Lmf5bCx5piv5LiL5LiA5bm055qE56ys5LiA5Liq5pyIXHJcblx0aWYgY3VycmVudE1vbnRoID09IDExXHJcblx0XHR5ZWFyKytcclxuXHRcdG1vbnRoKytcclxuXHRlbHNlXHJcblx0XHRtb250aCsrXHJcblx0XHJcblx0IyDkuIvmnIjnrKzkuIDlpKlcclxuXHRuZXh0TW9udGhGaXJzdERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxyXG5cdCMg5LiL5pyI5pyA5ZCO5LiA5aSpXHJcblx0bmV4dE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZSh5ZWFyLG1vbnRoLENyZWF0b3IuZ2V0TW9udGhEYXlzKHllYXIsbW9udGgpKVxyXG5cdCMg5pys5pyI5pyA5ZCO5LiA5aSpXHJcblx0bGFzdERheSA9IG5ldyBEYXRlKG5leHRNb250aEZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxyXG5cdCMg5LiK5pyI56ys5LiA5aSpXHJcblx0bGFzdE1vbnRoRmlyc3REYXkgPSBDcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5KGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aClcclxuXHQjIOS4iuaciOacgOWQjuS4gOWkqVxyXG5cdGxhc3RNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoZmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXHJcblx0IyDmnKzlraPluqblvIDlp4vml6VcclxuXHR0aGlzUXVhcnRlclN0YXJ0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpLDEpXHJcblx0IyDmnKzlraPluqbnu5PmnZ/ml6VcclxuXHR0aGlzUXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSsyLENyZWF0b3IuZ2V0TW9udGhEYXlzKGN1cnJlbnRZZWFyLENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSsyKSlcclxuXHQjIOS4iuWto+W6puW8gOWni+aXpVxyXG5cdGxhc3RRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxyXG5cdCMg5LiK5a2j5bqm57uT5p2f5pelXHJcblx0bGFzdFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIsQ3JlYXRvci5nZXRNb250aERheXMobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyKSlcclxuXHQjIOS4i+Wto+W6puW8gOWni+aXpVxyXG5cdG5leHRRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxyXG5cdCMg5LiL5a2j5bqm57uT5p2f5pelXHJcblx0bmV4dFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIsQ3JlYXRvci5nZXRNb250aERheXMobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyKSlcclxuXHQjIOi/h+WOuzflpKkgXHJcblx0bGFzdF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDYgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDov4fljrszMOWkqVxyXG5cdGxhc3RfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMjkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDov4fljrs2MOWkqVxyXG5cdGxhc3RfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNTkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDov4fljrs5MOWkqVxyXG5cdGxhc3RfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoODkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDov4fljrsxMjDlpKlcclxuXHRsYXN0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgxMTkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaU35aSpIFxyXG5cdG5leHRfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKVxyXG5cdCMg5pyq5p2lMzDlpKlcclxuXHRuZXh0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDI5ICogbWlsbGlzZWNvbmQpKVxyXG5cdCMg5pyq5p2lNjDlpKlcclxuXHRuZXh0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDU5ICogbWlsbGlzZWNvbmQpKVxyXG5cdCMg5pyq5p2lOTDlpKlcclxuXHRuZXh0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDg5ICogbWlsbGlzZWNvbmQpKVxyXG5cdCMg5pyq5p2lMTIw5aSpXHJcblx0bmV4dF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTE5ICogbWlsbGlzZWNvbmQpKVxyXG5cclxuXHRzd2l0Y2gga2V5XHJcblx0XHR3aGVuIFwibGFzdF95ZWFyXCJcclxuXHRcdFx0I+WOu+W5tFxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3llYXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3twcmV2aW91c1llYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3twcmV2aW91c1llYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRoaXNfeWVhclwiXHJcblx0XHRcdCPku4rlubRcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc195ZWFyXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7Y3VycmVudFllYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF95ZWFyXCJcclxuXHRcdFx0I+aYjuW5tFxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3llYXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tuZXh0WWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje25leHRZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0X3F1YXJ0ZXJcIlxyXG5cdFx0XHQj5LiK5a2j5bqmXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3F1YXJ0ZXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRoaXNfcXVhcnRlclwiXHJcblx0XHRcdCPmnKzlraPluqZcclxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfcXVhcnRlclwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF9xdWFydGVyXCJcclxuXHRcdFx0I+S4i+Wto+W6plxyXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChuZXh0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9xdWFydGVyXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0X21vbnRoXCJcclxuXHRcdFx0I+S4iuaciFxyXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChsYXN0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfbW9udGhcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRoaXNfbW9udGhcIlxyXG5cdFx0XHQj5pys5pyIXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobGFzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX21vbnRoXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0X21vbnRoXCJcclxuXHRcdFx0I+S4i+aciFxyXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChuZXh0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfbW9udGhcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3Rfd2Vla1wiXHJcblx0XHRcdCPkuIrlkahcclxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KGxhc3RNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KGxhc3RTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF93ZWVrXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTW9uZGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJ0aGlzX3dlZWtcIlxyXG5cdFx0XHQj5pys5ZGoXHJcblx0XHRcdHN0ck1vbmRheSA9IG1vbWVudChtb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KHN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3dlZWtcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfd2Vla1wiXHJcblx0XHRcdCPkuIvlkahcclxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KG5leHRNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KG5leHRTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF93ZWVrXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTW9uZGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJ5ZXN0ZGF5XCJcclxuXHRcdFx0I+aYqOWkqVxyXG5cdFx0XHRzdHJZZXN0ZGF5ID0gbW9tZW50KHllc3RkYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5feWVzdGRheVwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clllc3RkYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJZZXN0ZGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJ0b2RheVwiXHJcblx0XHRcdCPku4rlpKlcclxuXHRcdFx0c3RyVG9kYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvZGF5XCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyVG9kYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb2RheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwidG9tb3Jyb3dcIlxyXG5cdFx0XHQj5piO5aSpXHJcblx0XHRcdHN0clRvbW9ycm93ID0gbW9tZW50KHRvbW9ycm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvbW9ycm93XCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyVG9tb3Jyb3d9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb21vcnJvd31UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibGFzdF83X2RheXNcIlxyXG5cdFx0XHQj6L+H5Y67N+WkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSBcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzdfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0XzMwX2RheXNcIlxyXG5cdFx0XHQj6L+H5Y67MzDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8zMF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfNjBfZGF5c1wiXHJcblx0XHRcdCPov4fljrs2MOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzYwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibGFzdF85MF9kYXlzXCJcclxuXHRcdFx0I+i/h+WOuzkw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfOTBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0XzEyMF9kYXlzXCJcclxuXHRcdFx0I+i/h+WOuzEyMOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8xMjBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0XzdfZGF5c1wiXHJcblx0XHRcdCPmnKrmnaU35aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF83X2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF8zMF9kYXlzXCJcclxuXHRcdFx0I+acquadpTMw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMzBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0XzYwX2RheXNcIlxyXG5cdFx0XHQj5pyq5p2lNjDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF82MF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfOTBfZGF5c1wiXHJcblx0XHRcdCPmnKrmnaU5MOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzkwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF8xMjBfZGF5c1wiXHJcblx0XHRcdCPmnKrmnaUxMjDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMTIwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHJcblx0dmFsdWVzID0gW3N0YXJ0VmFsdWUsIGVuZFZhbHVlXVxyXG5cdGlmIGZpZWxkX3R5cGUgPT0gXCJkYXRldGltZVwiXHJcblx0XHQjIOaXtumXtOexu+Wei+Wtl+aute+8jOWGhee9ruaXtumXtOiMg+WbtOW6lOivpeiAg+iZkeWBj+enu+aXtuWMuuWAvO+8jOWQpuWImei/h+a7pOaVsOaNruWtmOWcqOWBj+W3rlxyXG5cdFx0IyDpnZ7lhoXnva7ml7bpl7TojIPlm7Tml7bvvIznlKjmiLfpgJrov4fml7bpl7Tmjqfku7bpgInmi6nnmoTojIPlm7TvvIzkvJroh6rliqjlpITnkIbml7bljLrlgY/lt67mg4XlhrVcclxuXHRcdCMg5pel5pyf57G75Z6L5a2X5q6177yM5pWw5o2u5bqT5pys5p2l5bCx5a2Y55qE5pivVVRD55qEMOeCue+8jOS4jeWtmOWcqOWBj+W3rlxyXG5cdFx0Xy5mb3JFYWNoIHZhbHVlcywgKGZ2KS0+XHJcblx0XHRcdGlmIGZ2XHJcblx0XHRcdFx0ZnYuc2V0SG91cnMoZnYuZ2V0SG91cnMoKSArIGZ2LmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCApXHJcblx0XHJcblx0cmV0dXJuIHtcclxuXHRcdGxhYmVsOiBsYWJlbFxyXG5cdFx0a2V5OiBrZXlcclxuXHRcdHZhbHVlczogdmFsdWVzXHJcblx0fVxyXG5cclxuQ3JlYXRvci5nZXRGaWVsZERlZmF1bHRPcGVyYXRpb24gPSAoZmllbGRfdHlwZSktPlxyXG5cdGlmIGZpZWxkX3R5cGUgJiYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSlcclxuXHRcdHJldHVybiAnYmV0d2VlbidcclxuXHRlbHNlIGlmIFtcInRleHRhcmVhXCIsIFwidGV4dFwiLCBcImNvZGVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcclxuXHRcdHJldHVybiAnY29udGFpbnMnXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuIFwiPVwiXHJcblxyXG5DcmVhdG9yLmdldEZpZWxkT3BlcmF0aW9uID0gKGZpZWxkX3R5cGUpIC0+XHJcblx0IyDml6XmnJ/nsbvlnos6IGRhdGUsIGRhdGV0aW1lICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCIsIFwiPFwiLCBcIj5cIiwgXCI8PVwiLCBcIj49XCJcclxuXHQjIOaWh+acrOexu+WeizogdGV4dCwgdGV4dGFyZWEsIGh0bWwgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCJjb250YWluc1wiLCBcIm5vdGNvbnRhaW5zXCIsIFwic3RhcnRzd2l0aFwiXHJcblx0IyDpgInmi6nnsbvlnos6IGxvb2t1cCwgbWFzdGVyX2RldGFpbCwgc2VsZWN0IOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIlxyXG5cdCMg5pWw5YC857G75Z6LOiBjdXJyZW5jeSwgbnVtYmVyICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCIsIFwiPFwiLCBcIj5cIiwgXCI8PVwiLCBcIj49XCJcclxuXHQjIOW4g+WwlOexu+WeizogYm9vbGVhbiAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXHJcblx0IyDmlbDnu4Tnsbvlnos6IGNoZWNrYm94LCBbdGV4dF0gIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIlxyXG5cclxuXHRvcHRpb25hbHMgPSB7XHJcblx0XHRlcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2VxdWFsXCIpLCB2YWx1ZTogXCI9XCJ9LFxyXG5cdFx0dW5lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3VuZXF1YWxcIiksIHZhbHVlOiBcIjw+XCJ9LFxyXG5cdFx0bGVzc190aGFuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc190aGFuXCIpLCB2YWx1ZTogXCI8XCJ9LFxyXG5cdFx0Z3JlYXRlcl90aGFuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl90aGFuXCIpLCB2YWx1ZTogXCI+XCJ9LFxyXG5cdFx0bGVzc19vcl9lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3Nfb3JfZXF1YWxcIiksIHZhbHVlOiBcIjw9XCJ9LFxyXG5cdFx0Z3JlYXRlcl9vcl9lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfb3JfZXF1YWxcIiksIHZhbHVlOiBcIj49XCJ9LFxyXG5cdFx0Y29udGFpbnM6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9jb250YWluc1wiKSwgdmFsdWU6IFwiY29udGFpbnNcIn0sXHJcblx0XHRub3RfY29udGFpbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2RvZXNfbm90X2NvbnRhaW5cIiksIHZhbHVlOiBcIm5vdGNvbnRhaW5zXCJ9LFxyXG5cdFx0c3RhcnRzX3dpdGg6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9zdGFydHNfd2l0aFwiKSwgdmFsdWU6IFwic3RhcnRzd2l0aFwifSxcclxuXHRcdGJldHdlZW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuXCIpLCB2YWx1ZTogXCJiZXR3ZWVuXCJ9LFxyXG5cdH1cclxuXHJcblx0aWYgZmllbGRfdHlwZSA9PSB1bmRlZmluZWRcclxuXHRcdHJldHVybiBfLnZhbHVlcyhvcHRpb25hbHMpXHJcblxyXG5cdG9wZXJhdGlvbnMgPSBbXVxyXG5cclxuXHRpZiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKVxyXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5iZXR3ZWVuKVxyXG5cdFx0Q3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMoZmllbGRfdHlwZSwgb3BlcmF0aW9ucylcclxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJ0ZXh0XCIgb3IgZmllbGRfdHlwZSA9PSBcInRleHRhcmVhXCIgb3IgZmllbGRfdHlwZSA9PSBcImh0bWxcIiBvciBmaWVsZF90eXBlID09IFwiY29kZVwiXHJcbiNcdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5jb250YWlucywgb3B0aW9uYWxzLm5vdF9jb250YWluLCBvcHRpb25hbHMuc3RhcnRzX3dpdGgpXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmNvbnRhaW5zKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImxvb2t1cFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgb3IgZmllbGRfdHlwZSA9PSBcInNlbGVjdFwiXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcclxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJjdXJyZW5jeVwiIG9yIGZpZWxkX3R5cGUgPT0gXCJudW1iZXJcIlxyXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5sZXNzX3RoYW4sIG9wdGlvbmFscy5ncmVhdGVyX3RoYW4sIG9wdGlvbmFscy5sZXNzX29yX2VxdWFsLCBvcHRpb25hbHMuZ3JlYXRlcl9vcl9lcXVhbClcclxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJib29sZWFuXCJcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImNoZWNrYm94XCJcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcIlt0ZXh0XVwiXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcclxuXHRlbHNlXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcclxuXHJcblx0cmV0dXJuIG9wZXJhdGlvbnNcclxuXHJcbiMjI1xyXG4gICAg5YWI5oyJ54Wn5pyJ5o6S5bqP5Y+355qE5bCP55qE5Zyo5YmN77yM5aSn55qE5Zyo5ZCOXHJcbiAgICDlho3lsIbmsqHmnInmjpLluo/lj7fnmoTmmL7npLrlnKhcclxuIyMjXHJcbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZSA9IChvYmplY3RfbmFtZSktPlxyXG5cdGZpZWxkcyA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKT8uZmllbGRzXHJcblx0ZmllbGRzQXJyID0gW11cclxuXHJcblx0Xy5lYWNoIGZpZWxkcywgKGZpZWxkKS0+XHJcblx0XHRmaWVsZHNBcnIucHVzaCB7bmFtZTogZmllbGQubmFtZSwgc29ydF9ubzogZmllbGQuc29ydF9ub31cclxuXHJcblx0ZmllbGRzTmFtZSA9IFtdXHJcblx0Xy5lYWNoIF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCAoZmllbGQpLT5cclxuXHRcdGZpZWxkc05hbWUucHVzaChmaWVsZC5uYW1lKVxyXG5cdHJldHVybiBmaWVsZHNOYW1lXHJcbiIsIkNyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciBmaWVsZHNBcnIsIHNjaGVtYTtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm47XG4gIH1cbiAgc2NoZW1hID0ge307XG4gIGZpZWxkc0FyciA9IFtdO1xuICBfLmVhY2gob2JqLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoIV8uaGFzKGZpZWxkLCBcIm5hbWVcIikpIHtcbiAgICAgIGZpZWxkLm5hbWUgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzQXJyLnB1c2goZmllbGQpO1xuICB9KTtcbiAgXy5lYWNoKF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHZhciBfb2JqZWN0LCBfcmVmX29iaiwgX3JlZmVyZW5jZV90bywgYXV0b2Zvcm1fdHlwZSwgZmllbGRfbmFtZSwgZnMsIGlzVW5MaW1pdGVkLCBsb2NhbGUsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjM7XG4gICAgZmllbGRfbmFtZSA9IGZpZWxkLm5hbWU7XG4gICAgZnMgPSB7fTtcbiAgICBpZiAoZmllbGQucmVnRXgpIHtcbiAgICAgIGZzLnJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgfVxuICAgIGZzLmF1dG9mb3JtID0ge307XG4gICAgZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZTtcbiAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgYXV0b2Zvcm1fdHlwZSA9IChyZWYgPSBmaWVsZC5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwO1xuICAgIGlmIChmaWVsZC50eXBlID09PSBcInRleHRcIiB8fCBmaWVsZC50eXBlID09PSBcInBob25lXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIlt0ZXh0XVwiIHx8IGZpZWxkLnR5cGUgPT09IFwiW3Bob25lXVwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnY29kZScpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTI7XG4gICAgICBpZiAoZmllbGQubGFuZ3VhZ2UpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCI7XG4gICAgICBmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAyO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJwYXNzd29yZFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5vdXRGb3JtYXQgPSAneXl5eS1NTS1kZCc7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgdGltZXpvbmVJZDogXCJ1dGNcIixcbiAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJbT2JqZWN0XVwiKSB7XG4gICAgICBmcy50eXBlID0gW09iamVjdF07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImh0bWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgbG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKTtcbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiIHx8IGxvY2FsZSA9PT0gXCJ6aC1DTlwiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsZSA9IFwiZW4tVVNcIjtcbiAgICAgICAgfVxuICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgdHlwZTogXCJzdW1tZXJub3RlXCIsXG4gICAgICAgICAgXCJjbGFzc1wiOiAnc3VtbWVybm90ZS1lZGl0b3InLFxuICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgICAgICAgIGRpYWxvZ3NJbkJvZHk6IHRydWUsXG4gICAgICAgICAgICB0b29sYmFyOiBbWydmb250MScsIFsnc3R5bGUnXV0sIFsnZm9udDInLCBbJ2JvbGQnLCAndW5kZXJsaW5lJywgJ2l0YWxpYycsICdjbGVhciddXSwgWydmb250MycsIFsnZm9udG5hbWUnXV0sIFsnY29sb3InLCBbJ2NvbG9yJ11dLCBbJ3BhcmEnLCBbJ3VsJywgJ29sJywgJ3BhcmFncmFwaCddXSwgWyd0YWJsZScsIFsndGFibGUnXV0sIFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sIFsndmlldycsIFsnY29kZXZpZXcnXV1dLFxuICAgICAgICAgICAgZm9udE5hbWVzOiBbJ0FyaWFsJywgJ0NvbWljIFNhbnMgTVMnLCAnQ291cmllciBOZXcnLCAnSGVsdmV0aWNhJywgJ0ltcGFjdCcsICflrovkvZMnLCAn6buR5L2TJywgJ+W+rui9r+mbhem7kScsICfku7/lrosnLCAn5qW35L2TJywgJ+matuS5picsICflubzlnIYnXSxcbiAgICAgICAgICAgIGxhbmc6IGxvY2FsZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIgfHwgZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZpZWxkLnNob3dJY29uO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIH1cbiAgICAgIGlmICghZmllbGQuaGlkZGVuKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmZpbHRlcnMgPSBmaWVsZC5maWx0ZXJzO1xuICAgICAgICBmcy5hdXRvZm9ybS5kZXBlbmRPbiA9IGZpZWxkLmRlcGVuZF9vbjtcbiAgICAgICAgaWYgKGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbikge1xuICAgICAgICAgIGZzLmJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBmcy5maWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPyBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gOiBDcmVhdG9yLmV2YWx1YXRlRmlsdGVycztcbiAgICAgICAgaWYgKGZpZWxkLm9wdGlvbnNGdW5jdGlvbikge1xuICAgICAgICAgIGZzLm9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3RvKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgaWYgKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWVsZC5jcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgICAgICAgZnMuY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChfLmlzU3RyaW5nKGZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBfcmVmX29iaiA9IENyZWF0b3IuT2JqZWN0c1tmaWVsZC5yZWZlcmVuY2VfdG9dO1xuICAgICAgICAgICAgICAgIGlmIChfcmVmX29iaiAhPSBudWxsID8gKHJlZjEgPSBfcmVmX29iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjEuYWxsb3dDcmVhdGUgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICBmcy5jcmVhdGVGdW5jdGlvbiA9IGZ1bmN0aW9uKGxvb2t1cF9maWVsZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTW9kYWwuc2hvdyhcIkNyZWF0b3JPYmplY3RNb2RhbFwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbjogXCJDcmVhdG9yLkNvbGxlY3Rpb25zLlwiICsgKENyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8pLl9uYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICBmb3JtSWQ6IFwibmV3XCIgKyAoZmllbGQucmVmZXJlbmNlX3RvLnJlcGxhY2UoJy4nLCAnXycpKSxcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogXCJcIiArIGZpZWxkLnJlZmVyZW5jZV90byxcbiAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiaW5zZXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgb25TdWNjZXNzOiBmdW5jdGlvbihvcGVyYXRpb24sIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lm9iamVjdF9uYW1lID09PSBcIm9iamVjdHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogcmVzdWx0LnZhbHVlLmxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC52YWx1ZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogcmVzdWx0LnZhbHVlLmljb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sIHJlc3VsdC52YWx1ZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb29rdXBfZmllbGQuYWRkSXRlbXMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiByZXN1bHQudmFsdWVbb2JqZWN0Lk5BTUVfRklFTERfS0VZXSB8fCByZXN1bHQudmFsdWUubGFiZWwgfHwgcmVzdWx0LnZhbHVlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0Ll9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgcmVzdWx0Ll9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXy5pc0Jvb2xlYW4oZmllbGQuY3JlYXRlKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmllbGQuY3JlYXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3NvcnQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNTb3J0ID0gZmllbGQucmVmZXJlbmNlX3NvcnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfbGltaXQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNMaW1pdCA9IGZpZWxkLnJlZmVyZW5jZV9saW1pdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3R1c2VyXCI7XG4gICAgICAgICAgICBpZiAoIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdCkge1xuICAgICAgICAgICAgICBpZiAoZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IChyZWYyID0gb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMi5nZXQoKSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoaXNVbkxpbWl0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24oZmllbGQuaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJvcmdhbml6YXRpb25zXCIpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdG9yZ1wiO1xuICAgICAgICAgICAgaWYgKCFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXQpIHtcbiAgICAgICAgICAgICAgaWYgKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSAocmVmMyA9IG9iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjMuZ2V0KCkgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGlzVW5MaW1pdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZmllbGQucmVmZXJlbmNlX3RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfLmlzQXJyYXkoX3JlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICAgICAgICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5vXCJdID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgICAgICAgb21pdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5pZHNcIl0gPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogW1N0cmluZ10sXG4gICAgICAgICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgICAgICAgIG9taXQ6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gW19yZWZlcmVuY2VfdG9dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXTtcbiAgICAgICAgICAgIGlmIChfb2JqZWN0ICYmIF9vYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0VHJlZVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZCA9IGZpZWxkLm9wdGlvbnNNZXRob2QgfHwgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI7XG4gICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kUGFyYW1zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcyA9IFtdO1xuICAgICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8uZm9yRWFjaChmdW5jdGlvbihfcmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdO1xuICAgICAgICAgICAgICAgICAgaWYgKF9vYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBfcmVmZXJlbmNlLFxuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmxhYmVsIDogdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICAgIGljb246IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIi9hcHAvXCIgKyAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSArIFwiL1wiICsgX3JlZmVyZW5jZSArIFwiL3ZpZXcvXCI7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogX3JlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIi9hcHAvXCIgKyAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSArIFwiL1wiICsgX3JlZmVyZW5jZSArIFwiL3ZpZXcvXCI7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICBmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZhbHNlO1xuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFwiO1xuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgICAgaWYgKF8uaGFzKGZpZWxkLCAnZmlyc3RPcHRpb24nKSkge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gZmllbGQuZmlyc3RPcHRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBcIlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImN1cnJlbmN5XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGU7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSAhPT0gMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IDI7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZTtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgICAgZnMudHlwZSA9IEJvb2xlYW47XG4gICAgICBpZiAoZmllbGQucmVhZG9ubHkpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLWNoZWNrYm94XCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRvZ2dsZVwiKSB7XG4gICAgICBmcy50eXBlID0gQm9vbGVhbjtcbiAgICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tdG9nZ2xlXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInJlZmVyZW5jZVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3QtY2hlY2tib3hcIjtcbiAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJmaWxlXCIgJiYgZmllbGQuY29sbGVjdGlvbikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiBmaWVsZC5jb2xsZWN0aW9uXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9IGZpZWxkLmNvbGxlY3Rpb247XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImZpbGVzaXplXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVzaXplJztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiT2JqZWN0XCIgfHwgZmllbGQudHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZ3JpZFwiKSB7XG4gICAgICBmcy50eXBlID0gQXJyYXk7XG4gICAgICBmcy5hdXRvZm9ybS5lZGl0YWJsZSA9IHRydWU7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zR3JpZFwiO1xuICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICB0eXBlOiBPYmplY3RcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImltYWdlXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2ltYWdlcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdpbWFnZS8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnaW1hZ2VzJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJhdmF0YXJcIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXZhdGFycycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdpbWFnZS8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXZhdGFycyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYXVkaW9cIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXVkaW9zJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ2F1ZGlvLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdWRpb3MnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnYXVkaW8vKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInZpZGVvXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ3ZpZGVvcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICd2aWRlby8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAndmlkZW9zJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ3ZpZGVvLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJsb2NhdGlvblwiKSB7XG4gICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwibG9jYXRpb25cIjtcbiAgICAgIGZzLmF1dG9mb3JtLnN5c3RlbSA9IGZpZWxkLnN5c3RlbSB8fCBcIndnczg0XCI7XG4gICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIm1hcmtkb3duXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLW1hcmtkb3duXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAndXJsJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc1VybCc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZW1haWwnKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWw7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NFbWFpbCc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnYXV0b251bWJlcicpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZm9ybXVsYScpIHtcbiAgICAgIGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHtcbiAgICAgICAgICAgIHR5cGU6IGZpZWxkLmRhdGFfdHlwZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pW2ZpZWxkLm5hbWVdO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3N1bW1hcnknKSB7XG4gICAgICBmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7XG4gICAgICAgICAgICB0eXBlOiBmaWVsZC5kYXRhX3R5cGVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVtmaWVsZC5uYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnMudHlwZSA9IGZpZWxkLnR5cGU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5sYWJlbCkge1xuICAgICAgZnMubGFiZWwgPSBmaWVsZC5sYWJlbDtcbiAgICB9XG4gICAgaWYgKCFmaWVsZC5yZXF1aXJlZCkge1xuICAgICAgZnMub3B0aW9uYWwgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIU1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZnMub3B0aW9uYWwgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQudW5pcXVlKSB7XG4gICAgICBmcy51bmlxdWUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQub21pdCkge1xuICAgICAgZnMuYXV0b2Zvcm0ub21pdCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5ncm91cCkge1xuICAgICAgZnMuYXV0b2Zvcm0uZ3JvdXAgPSBmaWVsZC5ncm91cDtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmlzX3dpZGUpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmlzX3dpZGUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaGlkZGVuKSB7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJoaWRkZW5cIjtcbiAgICB9XG4gICAgaWYgKChmaWVsZC50eXBlID09PSBcInNlbGVjdFwiKSB8fCAoZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIikgfHwgKGZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSkge1xuICAgICAgaWYgKHR5cGVvZiBmaWVsZC5maWx0ZXJhYmxlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpZWxkLm5hbWUgPT09ICduYW1lJyB8fCBmaWVsZC5pc19uYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIGZpZWxkLnNlYXJjaGFibGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGZpZWxkLnNlYXJjaGFibGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYXV0b2Zvcm1fdHlwZSkge1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IGF1dG9mb3JtX3R5cGU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5kZWZhdWx0VmFsdWUpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZmllbGQuZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZmllbGQuZGVmYXVsdFZhbHVlLCB7XG4gICAgICAgICAgICB1c2VySWQ6IE1ldGVvci51c2VySWQoKSxcbiAgICAgICAgICAgIHNwYWNlSWQ6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSxcbiAgICAgICAgICAgIG5vdzogbmV3IERhdGUoKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgICBpZiAoIV8uaXNGdW5jdGlvbihmaWVsZC5kZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgICAgZnMuZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgZnMuYXV0b2Zvcm0ucmVhZG9ubHkgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZGlzYWJsZWQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmlubGluZUhlbHBUZXh0KSB7XG4gICAgICBmcy5hdXRvZm9ybS5pbmxpbmVIZWxwVGV4dCA9IGZpZWxkLmlubGluZUhlbHBUZXh0O1xuICAgIH1cbiAgICBpZiAoZmllbGQuYmxhY2tib3gpIHtcbiAgICAgIGZzLmJsYWNrYm94ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKF8uaGFzKGZpZWxkLCAnbWluJykpIHtcbiAgICAgIGZzLm1pbiA9IGZpZWxkLm1pbjtcbiAgICB9XG4gICAgaWYgKF8uaGFzKGZpZWxkLCAnbWF4JykpIHtcbiAgICAgIGZzLm1heCA9IGZpZWxkLm1heDtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1Byb2R1Y3Rpb24pIHtcbiAgICAgIGlmIChmaWVsZC5pbmRleCkge1xuICAgICAgICBmcy5pbmRleCA9IGZpZWxkLmluZGV4O1xuICAgICAgfSBlbHNlIGlmIChmaWVsZC5zb3J0YWJsZSkge1xuICAgICAgICBmcy5pbmRleCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzY2hlbWFbZmllbGRfbmFtZV0gPSBmcztcbiAgfSk7XG4gIHJldHVybiBzY2hlbWE7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGlzcGxheVZhbHVlID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlKSB7XG4gIHZhciBmaWVsZCwgaHRtbCwgb2JqZWN0O1xuICBodG1sID0gZmllbGRfdmFsdWU7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICBmaWVsZCA9IG9iamVjdC5maWVsZHMoZmllbGRfbmFtZSk7XG4gIGlmICghZmllbGQpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgaHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREIEg6bW0nKTtcbiAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImRhdGVcIikge1xuICAgIGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICB9XG4gIHJldHVybiBodG1sO1xufTtcblxuQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkgPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIHJldHVybiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIiwgXCJjdXJyZW5jeVwiLCBcIm51bWJlclwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKTtcbn07XG5cbkNyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgb3BlcmF0aW9ucykge1xuICB2YXIgYnVpbHRpblZhbHVlcztcbiAgYnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSk7XG4gIGlmIChidWlsdGluVmFsdWVzKSB7XG4gICAgcmV0dXJuIF8uZm9yRWFjaChidWlsdGluVmFsdWVzLCBmdW5jdGlvbihidWlsdGluSXRlbSwga2V5KSB7XG4gICAgICByZXR1cm4gb3BlcmF0aW9ucy5wdXNoKHtcbiAgICAgICAgbGFiZWw6IGJ1aWx0aW5JdGVtLmxhYmVsLFxuICAgICAgICB2YWx1ZToga2V5XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGlzX2NoZWNrX29ubHkpIHtcbiAgaWYgKFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyhpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGtleSkge1xuICBpZiAoW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIGtleSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlLCB2YWx1ZSkge1xuICB2YXIgYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIHJlc3VsdDtcbiAgaWYgKCFfLmlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBiZXR3ZWVuQnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSk7XG4gIGlmICghYmV0d2VlbkJ1aWx0aW5WYWx1ZXMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmVzdWx0ID0gbnVsbDtcbiAgXy5lYWNoKGJldHdlZW5CdWlsdGluVmFsdWVzLCBmdW5jdGlvbihpdGVtLCBvcGVyYXRpb24pIHtcbiAgICBpZiAoaXRlbS5rZXkgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gcmVzdWx0ID0gb3BlcmF0aW9uO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyA9IGZ1bmN0aW9uKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpIHtcbiAgcmV0dXJuIHtcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF9tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3Rfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV95ZXN0ZGF5XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ5ZXN0ZGF5XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RvZGF5XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b2RheVwiKSxcbiAgICBcImJldHdlZW5fdGltZV90b21vcnJvd1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9tb3Jyb3dcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF83X2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfN19kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfMzBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8zMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfNjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF82MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfOTBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF85MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfMTIwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMTIwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF83X2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfN19kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfMzBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8zMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfNjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF82MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfOTBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF85MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfMTIwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMTIwX2RheXNcIilcbiAgfTtcbn07XG5cbkNyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGggPSBmdW5jdGlvbihtb250aCkge1xuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIHJldHVybiAwO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIHJldHVybiAzO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIHJldHVybiA2O1xuICB9XG4gIHJldHVybiA5O1xufTtcblxuQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIHllYXItLTtcbiAgICBtb250aCA9IDk7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgbW9udGggPSAwO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIG1vbnRoID0gMztcbiAgfSBlbHNlIHtcbiAgICBtb250aCA9IDY7XG4gIH1cbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICBtb250aCA9IDM7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgbW9udGggPSA2O1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIG1vbnRoID0gOTtcbiAgfSBlbHNlIHtcbiAgICB5ZWFyKys7XG4gICAgbW9udGggPSAwO1xuICB9XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldE1vbnRoRGF5cyA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIHZhciBkYXlzLCBlbmREYXRlLCBtaWxsaXNlY29uZCwgc3RhcnREYXRlO1xuICBpZiAobW9udGggPT09IDExKSB7XG4gICAgcmV0dXJuIDMxO1xuICB9XG4gIG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgc3RhcnREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICBlbmREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAxKTtcbiAgZGF5cyA9IChlbmREYXRlIC0gc3RhcnREYXRlKSAvIG1pbGxpc2Vjb25kO1xuICByZXR1cm4gZGF5cztcbn07XG5cbkNyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPT09IDApIHtcbiAgICBtb250aCA9IDExO1xuICAgIHllYXItLTtcbiAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICB9XG4gIG1vbnRoLS07XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGtleSkge1xuICB2YXIgY3VycmVudE1vbnRoLCBjdXJyZW50WWVhciwgZW5kVmFsdWUsIGZpcnN0RGF5LCBsYWJlbCwgbGFzdERheSwgbGFzdE1vbmRheSwgbGFzdE1vbnRoRmluYWxEYXksIGxhc3RNb250aEZpcnN0RGF5LCBsYXN0UXVhcnRlckVuZERheSwgbGFzdFF1YXJ0ZXJTdGFydERheSwgbGFzdFN1bmRheSwgbGFzdF8xMjBfZGF5cywgbGFzdF8zMF9kYXlzLCBsYXN0XzYwX2RheXMsIGxhc3RfN19kYXlzLCBsYXN0XzkwX2RheXMsIG1pbGxpc2Vjb25kLCBtaW51c0RheSwgbW9uZGF5LCBtb250aCwgbmV4dE1vbmRheSwgbmV4dE1vbnRoRmluYWxEYXksIG5leHRNb250aEZpcnN0RGF5LCBuZXh0UXVhcnRlckVuZERheSwgbmV4dFF1YXJ0ZXJTdGFydERheSwgbmV4dFN1bmRheSwgbmV4dFllYXIsIG5leHRfMTIwX2RheXMsIG5leHRfMzBfZGF5cywgbmV4dF82MF9kYXlzLCBuZXh0XzdfZGF5cywgbmV4dF85MF9kYXlzLCBub3csIHByZXZpb3VzWWVhciwgc3RhcnRWYWx1ZSwgc3RyRW5kRGF5LCBzdHJGaXJzdERheSwgc3RyTGFzdERheSwgc3RyTW9uZGF5LCBzdHJTdGFydERheSwgc3RyU3VuZGF5LCBzdHJUb2RheSwgc3RyVG9tb3Jyb3csIHN0clllc3RkYXksIHN1bmRheSwgdGhpc1F1YXJ0ZXJFbmREYXksIHRoaXNRdWFydGVyU3RhcnREYXksIHRvbW9ycm93LCB2YWx1ZXMsIHdlZWssIHllYXIsIHllc3RkYXk7XG4gIG5vdyA9IG5ldyBEYXRlKCk7XG4gIG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgeWVzdGRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIHRvbW9ycm93ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKTtcbiAgd2VlayA9IG5vdy5nZXREYXkoKTtcbiAgbWludXNEYXkgPSB3ZWVrICE9PSAwID8gd2VlayAtIDEgOiA2O1xuICBtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKTtcbiAgc3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdFN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIGxhc3RNb25kYXkgPSBuZXcgRGF0ZShsYXN0U3VuZGF5LmdldFRpbWUoKSAtIChtaWxsaXNlY29uZCAqIDYpKTtcbiAgbmV4dE1vbmRheSA9IG5ldyBEYXRlKHN1bmRheS5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZCk7XG4gIG5leHRTdW5kYXkgPSBuZXcgRGF0ZShuZXh0TW9uZGF5LmdldFRpbWUoKSArIChtaWxsaXNlY29uZCAqIDYpKTtcbiAgY3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgcHJldmlvdXNZZWFyID0gY3VycmVudFllYXIgLSAxO1xuICBuZXh0WWVhciA9IGN1cnJlbnRZZWFyICsgMTtcbiAgY3VycmVudE1vbnRoID0gbm93LmdldE1vbnRoKCk7XG4gIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgbW9udGggPSBub3cuZ2V0TW9udGgoKTtcbiAgZmlyc3REYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoLCAxKTtcbiAgaWYgKGN1cnJlbnRNb250aCA9PT0gMTEpIHtcbiAgICB5ZWFyKys7XG4gICAgbW9udGgrKztcbiAgfSBlbHNlIHtcbiAgICBtb250aCsrO1xuICB9XG4gIG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICBuZXh0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCBDcmVhdG9yLmdldE1vbnRoRGF5cyh5ZWFyLCBtb250aCkpO1xuICBsYXN0RGF5ID0gbmV3IERhdGUobmV4dE1vbnRoRmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICBsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIGxhc3RNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoZmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICB0aGlzUXVhcnRlclN0YXJ0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSwgMSk7XG4gIHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkgKyAyKSk7XG4gIGxhc3RRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIGxhc3RRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIpKTtcbiAgbmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbmV4dFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMikpO1xuICBsYXN0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMjkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDU5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg4OSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgyOSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDg5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTE5ICogbWlsbGlzZWNvbmQpKTtcbiAgc3dpdGNoIChrZXkpIHtcbiAgICBjYXNlIFwibGFzdF95ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUocHJldmlvdXNZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShwcmV2aW91c1llYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc195ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoY3VycmVudFllYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF95ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKG5leHRZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShuZXh0WWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF9xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChuZXh0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChsYXN0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChuZXh0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3Rfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KGxhc3RNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQobGFzdFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3Rfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChtb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQoc3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc193ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KG5leHRNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ5ZXN0ZGF5XCI6XG4gICAgICBzdHJZZXN0ZGF5ID0gbW9tZW50KHllc3RkYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl95ZXN0ZGF5XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clllc3RkYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clllc3RkYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidG9kYXlcIjpcbiAgICAgIHN0clRvZGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvZGF5XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJUb2RheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0b21vcnJvd1wiOlxuICAgICAgc3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b21vcnJvd1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJUb21vcnJvdyArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyVG9tb3Jyb3cgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF83X2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfN19kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF8zMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8zMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF82MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF82MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF85MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF85MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF8xMjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF83X2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfN19kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF8zMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8zMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF82MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF82MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF85MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF85MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF8xMjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzEyMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gIH1cbiAgdmFsdWVzID0gW3N0YXJ0VmFsdWUsIGVuZFZhbHVlXTtcbiAgaWYgKGZpZWxkX3R5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgIF8uZm9yRWFjaCh2YWx1ZXMsIGZ1bmN0aW9uKGZ2KSB7XG4gICAgICBpZiAoZnYpIHtcbiAgICAgICAgcmV0dXJuIGZ2LnNldEhvdXJzKGZ2LmdldEhvdXJzKCkgKyBmdi5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgbGFiZWw6IGxhYmVsLFxuICAgIGtleToga2V5LFxuICAgIHZhbHVlczogdmFsdWVzXG4gIH07XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgaWYgKGZpZWxkX3R5cGUgJiYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gJ2JldHdlZW4nO1xuICB9IGVsc2UgaWYgKFtcInRleHRhcmVhXCIsIFwidGV4dFwiLCBcImNvZGVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gJ2NvbnRhaW5zJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXCI9XCI7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRPcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIHZhciBvcGVyYXRpb25zLCBvcHRpb25hbHM7XG4gIG9wdGlvbmFscyA9IHtcbiAgICBlcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI9XCJcbiAgICB9LFxuICAgIHVuZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3VuZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI8PlwiXG4gICAgfSxcbiAgICBsZXNzX3RoYW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3NfdGhhblwiKSxcbiAgICAgIHZhbHVlOiBcIjxcIlxuICAgIH0sXG4gICAgZ3JlYXRlcl90aGFuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX3RoYW5cIiksXG4gICAgICB2YWx1ZTogXCI+XCJcbiAgICB9LFxuICAgIGxlc3Nfb3JfZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3Nfb3JfZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI8PVwiXG4gICAgfSxcbiAgICBncmVhdGVyX29yX2VxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX29yX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPj1cIlxuICAgIH0sXG4gICAgY29udGFpbnM6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2NvbnRhaW5zXCIpLFxuICAgICAgdmFsdWU6IFwiY29udGFpbnNcIlxuICAgIH0sXG4gICAgbm90X2NvbnRhaW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2RvZXNfbm90X2NvbnRhaW5cIiksXG4gICAgICB2YWx1ZTogXCJub3Rjb250YWluc1wiXG4gICAgfSxcbiAgICBzdGFydHNfd2l0aDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fc3RhcnRzX3dpdGhcIiksXG4gICAgICB2YWx1ZTogXCJzdGFydHN3aXRoXCJcbiAgICB9LFxuICAgIGJldHdlZW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5cIiksXG4gICAgICB2YWx1ZTogXCJiZXR3ZWVuXCJcbiAgICB9XG4gIH07XG4gIGlmIChmaWVsZF90eXBlID09PSB2b2lkIDApIHtcbiAgICByZXR1cm4gXy52YWx1ZXMob3B0aW9uYWxzKTtcbiAgfVxuICBvcGVyYXRpb25zID0gW107XG4gIGlmIChDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKSkge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuYmV0d2Vlbik7XG4gICAgQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMoZmllbGRfdHlwZSwgb3BlcmF0aW9ucyk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZmllbGRfdHlwZSA9PT0gXCJ0ZXh0YXJlYVwiIHx8IGZpZWxkX3R5cGUgPT09IFwiaHRtbFwiIHx8IGZpZWxkX3R5cGUgPT09IFwiY29kZVwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5jb250YWlucyk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmaWVsZF90eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCBmaWVsZF90eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiY3VycmVuY3lcIiB8fCBmaWVsZF90eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5sZXNzX3RoYW4sIG9wdGlvbmFscy5ncmVhdGVyX3RoYW4sIG9wdGlvbmFscy5sZXNzX29yX2VxdWFsLCBvcHRpb25hbHMuZ3JlYXRlcl9vcl9lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiW3RleHRdXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9XG4gIHJldHVybiBvcGVyYXRpb25zO1xufTtcblxuXG4vKlxuICAgIOWFiOaMieeFp+acieaOkuW6j+WPt+eahOWwj+eahOWcqOWJje+8jOWkp+eahOWcqOWQjlxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBmaWVsZHMsIGZpZWxkc0FyciwgZmllbGRzTmFtZSwgcmVmO1xuICBmaWVsZHMgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMDtcbiAgZmllbGRzQXJyID0gW107XG4gIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkc0Fyci5wdXNoKHtcbiAgICAgIG5hbWU6IGZpZWxkLm5hbWUsXG4gICAgICBzb3J0X25vOiBmaWVsZC5zb3J0X25vXG4gICAgfSk7XG4gIH0pO1xuICBmaWVsZHNOYW1lID0gW107XG4gIF8uZWFjaChfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGRzTmFtZS5wdXNoKGZpZWxkLm5hbWUpO1xuICB9KTtcbiAgcmV0dXJuIGZpZWxkc05hbWU7XG59O1xuIiwiQ3JlYXRvci5fdHJpZ2dlcl9ob29rcyA9IHt9XHJcblxyXG5pbml0VHJpZ2dlciA9IChvYmplY3RfbmFtZSwgdHJpZ2dlciktPlxyXG5cdHRyeVxyXG5cdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSlcclxuXHRcdGlmICF0cmlnZ2VyLnRvZG9cclxuXHRcdFx0cmV0dXJuXHJcblx0XHR0b2RvV3JhcHBlciA9ICgpLT5cclxuXHRcdFx0ICB0aGlzLm9iamVjdF9uYW1lID0gb2JqZWN0X25hbWVcclxuXHRcdFx0ICByZXR1cm4gdHJpZ2dlci50b2RvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcclxuXHRcdGlmIHRyaWdnZXIud2hlbiA9PSBcImJlZm9yZS5pbnNlcnRcIlxyXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5iZWZvcmU/Lmluc2VydCh0b2RvV3JhcHBlcilcclxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUudXBkYXRlXCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYmVmb3JlPy51cGRhdGUodG9kb1dyYXBwZXIpXHJcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLnJlbW92ZVwiXHJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8ucmVtb3ZlKHRvZG9XcmFwcGVyKVxyXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLmluc2VydFwiXHJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmFmdGVyPy5pbnNlcnQodG9kb1dyYXBwZXIpXHJcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIudXBkYXRlXCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYWZ0ZXI/LnVwZGF0ZSh0b2RvV3JhcHBlcilcclxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci5yZW1vdmVcIlxyXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5hZnRlcj8ucmVtb3ZlKHRvZG9XcmFwcGVyKVxyXG5cdGNhdGNoIGVycm9yXHJcblx0XHRjb25zb2xlLmVycm9yKCdpbml0VHJpZ2dlciBlcnJvcicsIGVycm9yKVxyXG5cclxuY2xlYW5UcmlnZ2VyID0gKG9iamVjdF9uYW1lKS0+XHJcblx0IyMjXHJcbiAgICBcdOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbDmmK/kvb/nlKjkuIvmoIfliKDpmaTlr7nosaHnmoTvvIzmiYDku6XmraTlpITlj43ovaxob29rc+mbhuWQiOWQju+8jOWGjeWIoOmZpFxyXG4gICAgXHTlm6DkuLrkuIDkuKrmlbDnu4TlhYPntKDliKDpmaTlkI7vvIzlhbbku5blhYPntKDnmoTkuIvmoIfkvJrlj5HnlJ/lj5jljJZcclxuXHQjIyNcclxuICAgICNUT0RPIOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbBidWdcclxuXHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXT8ucmV2ZXJzZSgpLmZvckVhY2ggKF9ob29rKS0+XHJcblx0XHRfaG9vay5yZW1vdmUoKVxyXG5cclxuQ3JlYXRvci5pbml0VHJpZ2dlcnMgPSAob2JqZWN0X25hbWUpLT5cclxuI1x0Y29uc29sZS5sb2coJ0NyZWF0b3IuaW5pdFRyaWdnZXJzIG9iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpXHJcblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblxyXG5cdGNsZWFuVHJpZ2dlcihvYmplY3RfbmFtZSlcclxuXHJcblx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0gPSBbXVxyXG5cclxuXHRfLmVhY2ggb2JqLnRyaWdnZXJzLCAodHJpZ2dlciwgdHJpZ2dlcl9uYW1lKS0+XHJcblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXIgYW5kIHRyaWdnZXIub24gPT0gXCJzZXJ2ZXJcIiBhbmQgdHJpZ2dlci50b2RvIGFuZCB0cmlnZ2VyLndoZW5cclxuXHRcdFx0X3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyIG9iamVjdF9uYW1lLCB0cmlnZ2VyXHJcblx0XHRcdGlmIF90cmlnZ2VyX2hvb2tcclxuXHRcdFx0XHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnQgYW5kIHRyaWdnZXIub24gPT0gXCJjbGllbnRcIiBhbmQgdHJpZ2dlci50b2RvIGFuZCB0cmlnZ2VyLndoZW5cclxuXHRcdFx0X3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyIG9iamVjdF9uYW1lLCB0cmlnZ2VyXHJcblx0XHRcdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vaykiLCJ2YXIgY2xlYW5UcmlnZ2VyLCBpbml0VHJpZ2dlcjtcblxuQ3JlYXRvci5fdHJpZ2dlcl9ob29rcyA9IHt9O1xuXG5pbml0VHJpZ2dlciA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCB0cmlnZ2VyKSB7XG4gIHZhciBjb2xsZWN0aW9uLCBlcnJvciwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZWY1LCB0b2RvV3JhcHBlcjtcbiAgdHJ5IHtcbiAgICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKTtcbiAgICBpZiAoIXRyaWdnZXIudG9kbykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0b2RvV3JhcHBlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5vYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lO1xuICAgICAgcmV0dXJuIHRyaWdnZXIudG9kby5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gICAgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJiZWZvcmUuaW5zZXJ0XCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmID0gY29sbGVjdGlvbi5iZWZvcmUpICE9IG51bGwgPyByZWYuaW5zZXJ0KHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJiZWZvcmUudXBkYXRlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmMSA9IGNvbGxlY3Rpb24uYmVmb3JlKSAhPSBudWxsID8gcmVmMS51cGRhdGUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS5yZW1vdmVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYyID0gY29sbGVjdGlvbi5iZWZvcmUpICE9IG51bGwgPyByZWYyLnJlbW92ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYWZ0ZXIuaW5zZXJ0XCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmMyA9IGNvbGxlY3Rpb24uYWZ0ZXIpICE9IG51bGwgPyByZWYzLmluc2VydCh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYWZ0ZXIudXBkYXRlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmNCA9IGNvbGxlY3Rpb24uYWZ0ZXIpICE9IG51bGwgPyByZWY0LnVwZGF0ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYWZ0ZXIucmVtb3ZlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmNSA9IGNvbGxlY3Rpb24uYWZ0ZXIpICE9IG51bGwgPyByZWY1LnJlbW92ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICBlcnJvciA9IGVycm9yMTtcbiAgICByZXR1cm4gY29uc29sZS5lcnJvcignaW5pdFRyaWdnZXIgZXJyb3InLCBlcnJvcik7XG4gIH1cbn07XG5cbmNsZWFuVHJpZ2dlciA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG5cbiAgLypcbiAgICAgXHTnlLHkuo5jb2xsZWN0aW9uLWhvb2tzIHBhY2thZ2Ug55qEcmVtb3Zl5Ye95pWw5piv5L2/55So5LiL5qCH5Yig6Zmk5a+56LGh55qE77yM5omA5Lul5q2k5aSE5Y+N6L2saG9va3Ppm4blkIjlkI7vvIzlho3liKDpmaRcbiAgICAgXHTlm6DkuLrkuIDkuKrmlbDnu4TlhYPntKDliKDpmaTlkI7vvIzlhbbku5blhYPntKDnmoTkuIvmoIfkvJrlj5HnlJ/lj5jljJZcbiAgICovXG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0pICE9IG51bGwgPyByZWYucmV2ZXJzZSgpLmZvckVhY2goZnVuY3Rpb24oX2hvb2spIHtcbiAgICByZXR1cm4gX2hvb2sucmVtb3ZlKCk7XG4gIH0pIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5pbml0VHJpZ2dlcnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgb2JqO1xuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNsZWFuVHJpZ2dlcihvYmplY3RfbmFtZSk7XG4gIENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdID0gW107XG4gIHJldHVybiBfLmVhY2gob2JqLnRyaWdnZXJzLCBmdW5jdGlvbih0cmlnZ2VyLCB0cmlnZ2VyX25hbWUpIHtcbiAgICB2YXIgX3RyaWdnZXJfaG9vaztcbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwic2VydmVyXCIgJiYgdHJpZ2dlci50b2RvICYmIHRyaWdnZXIud2hlbikge1xuICAgICAgX3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyKG9iamVjdF9uYW1lLCB0cmlnZ2VyKTtcbiAgICAgIGlmIChfdHJpZ2dlcl9ob29rKSB7XG4gICAgICAgIENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vayk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIiAmJiB0cmlnZ2VyLnRvZG8gJiYgdHJpZ2dlci53aGVuKSB7XG4gICAgICBfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIob2JqZWN0X25hbWUsIHRyaWdnZXIpO1xuICAgICAgcmV0dXJuIENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vayk7XG4gICAgfVxuICB9KTtcbn07XG4iLCJjbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJylcclxuXHJcbkNyZWF0b3IuZ2V0UGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0XHRpZiAhb2JqXHJcblx0XHRcdHJldHVyblxyXG5cdFx0cmV0dXJuIG9iai5wZXJtaXNzaW9ucy5nZXQoKVxyXG5cdGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXHJcblxyXG5DcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lLCByZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCktPlxyXG5cdGlmICFvYmplY3RfbmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHJcblx0aWYgIXNwYWNlSWQgYW5kIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxyXG5cdFxyXG5cdGlmIHJlY29yZCBhbmQgb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIiBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHQjIOWmguaenOaYr2Ntc19maWxlc+mZhOS7tu+8jOWImeadg+mZkOWPluWFtueItuiusOW9leadg+mZkFxyXG5cdFx0aWYgb2JqZWN0X25hbWUgPT0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJylcclxuXHRcdFx0IyDlvZPliY3lpITkuo5jbXNfZmlsZXPpmYTku7bor6bnu4bnlYzpnaJcclxuXHRcdFx0b2JqZWN0X25hbWUgPSByZWNvcmQucGFyZW50WydyZWZlcmVuY2VfdG8uX28nXTtcclxuXHRcdFx0cmVjb3JkX2lkID0gcmVjb3JkLnBhcmVudC5faWQ7XHJcblx0XHRlbHNlIFxyXG5cdFx0XHQjIOW9k+WJjeWkhOS6jmNtc19maWxlc+mZhOS7tueahOeItuiusOW9leeVjOmdolxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KCdvYmplY3RfbmFtZScpO1xyXG5cdFx0XHRyZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcclxuXHRcdG9iamVjdF9maWVsZHNfa2V5cyA9IF8ua2V5cyhDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk/LmZpZWxkcyBvciB7fSkgfHwgW107XHJcblx0XHRzZWxlY3QgPSBfLmludGVyc2VjdGlvbihvYmplY3RfZmllbGRzX2tleXMsIFsnb3duZXInLCAnY29tcGFueV9pZCcsICdjb21wYW55X2lkcycsICdsb2NrZWQnXSkgfHwgW107XHJcblx0XHRpZiBzZWxlY3QubGVuZ3RoID4gMFxyXG5cdFx0XHRyZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3Quam9pbignLCcpKTtcclxuXHRcdGVsc2VcclxuXHRcdFx0cmVjb3JkID0gbnVsbDtcclxuXHJcblx0cGVybWlzc2lvbnMgPSBfLmNsb25lKENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpXHJcblxyXG5cdGlmIHJlY29yZFxyXG5cdFx0aWYgcmVjb3JkLnJlY29yZF9wZXJtaXNzaW9uc1xyXG5cdFx0XHRyZXR1cm4gcmVjb3JkLnJlY29yZF9wZXJtaXNzaW9uc1xyXG5cclxuXHRcdGlzT3duZXIgPSByZWNvcmQub3duZXIgPT0gdXNlcklkIHx8IHJlY29yZC5vd25lcj8uX2lkID09IHVzZXJJZFxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdHVzZXJfY29tcGFueV9pZHMgPSBTdGVlZG9zLmdldFVzZXJDb21wYW55SWRzKClcclxuXHRcdGVsc2VcclxuXHRcdFx0dXNlcl9jb21wYW55X2lkcyA9IENyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHModXNlcklkLCBzcGFjZUlkKVxyXG5cdFx0cmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmQ/LmNvbXBhbnlfaWRcclxuXHRcdGlmIHJlY29yZF9jb21wYW55X2lkIGFuZCBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkKSBhbmQgcmVjb3JkX2NvbXBhbnlfaWQuX2lkXHJcblx0XHRcdCMg5ZugcmVjb3JkX2NvbXBhbnlfaWTmmK9sb29rdXDnsbvlnovvvIzmnInlj6/og71keOaOp+S7tuS8muaKiuWug+aYoOWwhOi9rOS4uuWvueW6lOeahG9iamVjdO+8jOaJgOS7pei/memHjOWPluWHuuWFtl9pZOWAvFxyXG5cdFx0XHRyZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZF9jb21wYW55X2lkLl9pZFxyXG5cdFx0cmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkPy5jb21wYW55X2lkc1xyXG5cdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoIGFuZCBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkc1swXSlcclxuXHRcdFx0IyDlm6ByZWNvcmRfY29tcGFueV9pZHPmmK9sb29rdXDnsbvlnovvvIzmnInlj6/og71keOaOp+S7tuS8muaKiuWug+aYoOWwhOi9rOS4uuWvueW6lOeahFtvYmplY3Rd77yM5omA5Lul6L+Z6YeM5Y+W5Ye65YW2X2lk5YC8XHJcblx0XHRcdHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZF9jb21wYW55X2lkcy5tYXAoKG4pLT4gbi5faWQpXHJcblx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSBfLnVuaW9uKHJlY29yZF9jb21wYW55X2lkcywgW3JlY29yZF9jb21wYW55X2lkXSlcclxuXHRcdGlmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIGFuZCAhaXNPd25lciBhbmQgIXBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXHJcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2VcclxuXHRcdGVsc2UgaWYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkcyBhbmQgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aFxyXG5cdFx0XHRcdGlmIHVzZXJfY29tcGFueV9pZHMgYW5kIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoXHJcblx0XHRcdFx0XHRpZiAhXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGhcclxuXHRcdFx0XHRcdFx0IyDorrDlvZXnmoRjb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn5LiN5Zyo5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+iMg+WbtOWGheaXtu+8jOiupOS4uuaXoOadg+S/ruaUuVxyXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0IyDorrDlvZXmnIljb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn77yM5L2G5piv5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+S4uuepuuaXtu+8jOiupOS4uuaXoOadg+S/ruaUuVxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2VcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2VcclxuXHRcdFxyXG5cdFx0aWYgcmVjb3JkLmxvY2tlZCBhbmQgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2VcclxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxyXG5cclxuXHRcdGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgIWlzT3duZXIgYW5kICFwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2VcclxuXHRcdGVsc2UgaWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoXHJcblx0XHRcdFx0aWYgdXNlcl9jb21wYW55X2lkcyBhbmQgdXNlcl9jb21wYW55X2lkcy5sZW5ndGhcclxuXHRcdFx0XHRcdGlmICFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aFxyXG5cdFx0XHRcdFx0XHQjIOiusOW9leeahGNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfkuI3lnKjlvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz6IyD5Zu05YaF5pe277yM6K6k5Li65peg5p2D5p+l55yLXHJcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0IyDorrDlvZXmnIljb21wYW55X2lk5bGe5oCn77yM5L2G5piv5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+S4uuepuuaXtu+8jOiupOS4uuaXoOadg+afpeeci1xyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2VcclxuXHJcblx0cmV0dXJuIHBlcm1pc3Npb25zXHJcblxyXG5cclxuIyBjdXJyZW50T2JqZWN0TmFtZe+8muW9k+WJjeS4u+WvueixoVxyXG4jIHJlbGF0ZWRMaXN0SXRlbe+8mkNyZWF0b3IuZ2V0UmVsYXRlZExpc3QoU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSwgU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikp5Lit5Y+WcmVsYXRlZF9vYmplY3RfbmFtZeWvueW6lOeahOWAvFxyXG4jIGN1cnJlbnRSZWNvcmTlvZPliY3kuLvlr7nosaHnmoTor6bnu4borrDlvZVcclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0Q3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zID0gKGN1cnJlbnRPYmplY3ROYW1lLCByZWxhdGVkTGlzdEl0ZW0sIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCktPlxyXG5cdFx0aWYgIWN1cnJlbnRPYmplY3ROYW1lIGFuZCBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0Y3VycmVudE9iamVjdE5hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdFx0aWYgIXJlbGF0ZWRMaXN0SXRlbVxyXG5cdFx0XHRjb25zb2xlLmVycm9yKFwicmVsYXRlZExpc3RJdGVtIG11c3Qgbm90IGJlIGVtcHR5IGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zXCIpO1xyXG5cdFx0XHRyZXR1cm4ge31cclxuXHJcblx0XHRpZiAhY3VycmVudFJlY29yZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdGN1cnJlbnRSZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpXHJcblxyXG5cdFx0aWYgIXVzZXJJZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cclxuXHRcdGlmICFzcGFjZUlkIGFuZCBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxyXG5cclxuXHRcdHNoYXJpbmcgPSByZWxhdGVkTGlzdEl0ZW0uc2hhcmluZyB8fCAnbWFzdGVyV3JpdGUnXHJcblx0XHRtYXN0ZXJBbGxvdyA9IGZhbHNlXHJcblx0XHRtYXN0ZXJSZWNvcmRQZXJtID0gQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyhjdXJyZW50T2JqZWN0TmFtZSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKVxyXG5cdFx0aWYgc2hhcmluZyA9PSAnbWFzdGVyUmVhZCdcclxuXHRcdFx0bWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93UmVhZFxyXG5cdFx0ZWxzZSBpZiBzaGFyaW5nID09ICdtYXN0ZXJXcml0ZSdcclxuXHRcdFx0bWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdFxyXG5cclxuXHRcdHVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gQ3JlYXRvci5nZXRSZWNvcmRTYWZlUmVsYXRlZExpc3QoY3VycmVudFJlY29yZCwgY3VycmVudE9iamVjdE5hbWUpXHJcblx0XHRyZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSlcclxuXHRcdGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSA9IHVuZWRpdGFibGVfcmVsYXRlZF9saXN0LmluZGV4T2YocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKSA+IC0xXHJcblxyXG5cdFx0cmVzdWx0ID0gXy5jbG9uZSByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnNcclxuXHRcdHJlc3VsdC5hbGxvd0NyZWF0ZSA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlXHJcblx0XHRyZXN1bHQuYWxsb3dFZGl0ID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlXHJcblx0XHRyZXR1cm4gcmVzdWx0XHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHJcblx0Q3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyA9IChzcGFjZUlkLCB1c2VySWQpIC0+XHJcblx0XHRwZXJtaXNzaW9ucyA9XHJcblx0XHRcdG9iamVjdHM6IHt9XHJcblx0XHRcdGFzc2lnbmVkX2FwcHM6IFtdXHJcblx0XHQjIyNcclxuXHRcdOadg+mZkOe7hOivtOaYjjpcclxuXHRcdOWGhee9ruadg+mZkOe7hC1hZG1pbix1c2VyLG1lbWJlcixndWVzdCx3b3JrZmxvd19hZG1pbixvcmdhbml6YXRpb25fYWRtaW5cclxuXHRcdOiHquWumuS5ieadg+mZkOe7hC3mlbDmja7lupPkuK3mlrDlu7rnmoTpmaTlhoXnva7mnYPpmZDnu4Tku6XlpJbnmoTlhbbku5bmnYPpmZDnu4RcclxuXHRcdOeJueWumueUqOaIt+mbhuWQiOadg+mZkOe7hO+8iOWNs3VzZXJz5bGe5oCn5LiN5Y+v6YWN572u77yJLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0XHJcblx0XHTlj6/phY3nva7nlKjmiLfpm4blkIjmnYPpmZDnu4TvvIjljbN1c2Vyc+WxnuaAp+WPr+mFjee9ru+8iS13b3JrZmxvd19hZG1pbixvcmdhbml6YXRpb25fYWRtaW7ku6Xlj4roh6rlrprkuYnmnYPpmZDnu4RcclxuXHRcdCMjI1xyXG5cclxuXHRcdGlzU3BhY2VBZG1pbiA9IGZhbHNlXHJcblx0XHRzcGFjZVVzZXIgPSBudWxsXHJcblx0XHRpZiB1c2VySWRcclxuXHRcdFx0aXNTcGFjZUFkbWluID0gQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxyXG5cdFx0XHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcclxuXHJcblx0XHRwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHRcdHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHRcdHBzZXRzTWVtYmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXHJcblx0XHRwc2V0c0d1ZXN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdndWVzdCd9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHJcblx0XHRwc2V0c1N1cHBsaWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHRcdHBzZXRzQ3VzdG9tZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2N1c3RvbWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cdFx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXHJcblx0XHRcdHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCAkb3I6IFt7dXNlcnM6IHVzZXJJZH0sIHtuYW1lOiBzcGFjZVVzZXIucHJvZmlsZX1dfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcclxuXHRcdGVsc2VcclxuXHRcdFx0cHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxyXG5cclxuXHRcdHBzZXRzQWRtaW5fcG9zID0gbnVsbFxyXG5cdFx0cHNldHNVc2VyX3BvcyA9IG51bGxcclxuXHRcdHBzZXRzTWVtYmVyX3BvcyA9IG51bGxcclxuXHRcdHBzZXRzR3Vlc3RfcG9zID0gbnVsbFxyXG5cdFx0cHNldHNDdXJyZW50X3BvcyA9IG51bGxcclxuXHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gbnVsbFxyXG5cdFx0cHNldHNDdXN0b21lcl9wb3MgPSBudWxsXHJcblxyXG5cdFx0aWYgcHNldHNBZG1pbj8uX2lkXHJcblx0XHRcdHBzZXRzQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0FkbWluLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxyXG5cdFx0aWYgcHNldHNVc2VyPy5faWRcclxuXHRcdFx0cHNldHNVc2VyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxyXG5cdFx0aWYgcHNldHNNZW1iZXI/Ll9pZFxyXG5cdFx0XHRwc2V0c01lbWJlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzTWVtYmVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxyXG5cdFx0aWYgcHNldHNHdWVzdD8uX2lkXHJcblx0XHRcdHBzZXRzR3Vlc3RfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0d1ZXN0Ll9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxyXG5cdFx0aWYgcHNldHNTdXBwbGllcj8uX2lkXHJcblx0XHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c1N1cHBsaWVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxyXG5cdFx0aWYgcHNldHNDdXN0b21lcj8uX2lkXHJcblx0XHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0N1c3RvbWVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxyXG5cclxuXHRcdGlmIHBzZXRzQ3VycmVudC5sZW5ndGggPiAwXHJcblx0XHRcdHNldF9pZHMgPSBfLnBsdWNrIHBzZXRzQ3VycmVudCwgXCJfaWRcIlxyXG5cdFx0XHRwc2V0c0N1cnJlbnRfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiB7JGluOiBzZXRfaWRzfX0pLmZldGNoKClcclxuXHRcdFx0cHNldHNDdXJyZW50TmFtZXMgPSBfLnBsdWNrIHBzZXRzQ3VycmVudCwgXCJuYW1lXCJcclxuXHJcblx0XHRwc2V0cyA9IHtcclxuXHRcdFx0cHNldHNBZG1pbiwgXHJcblx0XHRcdHBzZXRzVXNlciwgXHJcblx0XHRcdHBzZXRzQ3VycmVudCwgXHJcblx0XHRcdHBzZXRzTWVtYmVyLCBcclxuXHRcdFx0cHNldHNHdWVzdCxcclxuXHRcdFx0cHNldHNTdXBwbGllcixcclxuXHRcdFx0cHNldHNDdXN0b21lcixcclxuXHRcdFx0aXNTcGFjZUFkbWluLFxyXG5cdFx0XHRzcGFjZVVzZXIsIFxyXG5cdFx0XHRwc2V0c0FkbWluX3BvcywgXHJcblx0XHRcdHBzZXRzVXNlcl9wb3MsIFxyXG5cdFx0XHRwc2V0c01lbWJlcl9wb3MsIFxyXG5cdFx0XHRwc2V0c0d1ZXN0X3BvcyxcclxuXHRcdFx0cHNldHNTdXBwbGllcl9wb3MsXHJcblx0XHRcdHBzZXRzQ3VzdG9tZXJfcG9zLFxyXG5cdFx0XHRwc2V0c0N1cnJlbnRfcG9zXHJcblx0XHR9XHJcblx0XHRwZXJtaXNzaW9ucy5hc3NpZ25lZF9hcHBzID0gQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKVxyXG5cdFx0cGVybWlzc2lvbnMuYXNzaWduZWRfbWVudXMgPSBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKVxyXG5cdFx0cGVybWlzc2lvbnMudXNlcl9wZXJtaXNzaW9uX3NldHMgPSBwc2V0c0N1cnJlbnROYW1lc1xyXG5cdFx0X2kgPSAwXHJcblx0XHRfLmVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAob2JqZWN0LCBvYmplY3RfbmFtZSktPlxyXG5cdFx0XHRfaSsrXHJcblx0XHRcdGlmICFfLmhhcyhvYmplY3QsICdzcGFjZScpIHx8ICFvYmplY3Quc3BhY2UgfHwgb2JqZWN0LnNwYWNlID09IHNwYWNlSWRcclxuXHRcdFx0XHRpZiAhXy5oYXMob2JqZWN0LCAnaW5fZGV2ZWxvcG1lbnQnKSB8fCBvYmplY3QuaW5fZGV2ZWxvcG1lbnQgPT0gJzAnIHx8IChvYmplY3QuaW5fZGV2ZWxvcG1lbnQgIT0gJzAnICYmIGlzU3BhY2VBZG1pbilcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0pLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV1bXCJwZXJtaXNzaW9uc1wiXSA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcclxuXHRcdHJldHVybiBwZXJtaXNzaW9uc1xyXG5cclxuXHR1bmlvblBsdXMgPSAoYXJyYXksIG90aGVyKSAtPlxyXG5cdFx0aWYgIWFycmF5IGFuZCAhb3RoZXJcclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxyXG5cdFx0aWYgIWFycmF5XHJcblx0XHRcdGFycmF5ID0gW11cclxuXHRcdGlmICFvdGhlclxyXG5cdFx0XHRvdGhlciA9IFtdXHJcblx0XHRyZXR1cm4gXy51bmlvbihhcnJheSwgb3RoZXIpXHJcblxyXG5cdGludGVyc2VjdGlvblBsdXMgPSAoYXJyYXksIG90aGVyKSAtPlxyXG5cdFx0aWYgIWFycmF5IGFuZCAhb3RoZXJcclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxyXG5cdFx0aWYgIWFycmF5XHJcblx0XHRcdGFycmF5ID0gW11cclxuXHRcdGlmICFvdGhlclxyXG5cdFx0XHRvdGhlciA9IFtdXHJcblx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24oYXJyYXksIG90aGVyKVxyXG5cclxuXHRDcmVhdG9yLmdldEFzc2lnbmVkQXBwcyA9IChzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRcdHBzZXRzQWRtaW4gPSB0aGlzLnBzZXRzQWRtaW4gfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXHJcblx0XHRwc2V0c1VzZXIgPSB0aGlzLnBzZXRzVXNlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0cHNldHNTdXBwbGllciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXHJcblx0XHRwc2V0c0N1c3RvbWVyID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnY3VzdG9tZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0IyBwc2V0c01lbWJlciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0IyBwc2V0c0d1ZXN0ID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0cHNldHMgPSAgdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxyXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXHJcblx0XHRhcHBzID0gW11cclxuXHRcdGlmIGlzU3BhY2VBZG1pblxyXG5cdFx0XHRyZXR1cm4gW11cclxuXHRcdGVsc2VcclxuXHRcdFx0dXNlclByb2ZpbGUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSk/LnByb2ZpbGVcclxuXHRcdFx0cHNldEJhc2UgPSBwc2V0c1VzZXJcclxuXHRcdFx0aWYgdXNlclByb2ZpbGVcclxuXHRcdFx0XHRpZiB1c2VyUHJvZmlsZSA9PSAnc3VwcGxpZXInXHJcblx0XHRcdFx0XHRwc2V0QmFzZSA9IHBzZXRzU3VwcGxpZXJcclxuXHRcdFx0XHRlbHNlIGlmIHVzZXJQcm9maWxlID09ICdjdXN0b21lcidcclxuXHRcdFx0XHRcdHBzZXRCYXNlID0gcHNldHNDdXN0b21lclxyXG5cdFx0XHRpZiBwc2V0QmFzZT8uYXNzaWduZWRfYXBwcz8ubGVuZ3RoXHJcblx0XHRcdFx0YXBwcyA9IF8udW5pb24gYXBwcywgcHNldEJhc2UuYXNzaWduZWRfYXBwc1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0IyB1c2Vy5p2D6ZmQ57uE5Lit55qEYXNzaWduZWRfYXBwc+ihqOekuuaJgOacieeUqOaIt+WFt+acieeahGFwcHPmnYPpmZDvvIzkuLrnqbrliJnooajnpLrmnInmiYDmnIlhcHBz5p2D6ZmQ77yM5LiN6ZyA6KaB5L2c5p2D6ZmQ5Yik5pat5LqGXHJcblx0XHRcdFx0cmV0dXJuIFtdXHJcblx0XHRcdF8uZWFjaCBwc2V0cywgKHBzZXQpLT5cclxuXHRcdFx0XHRpZiAhcHNldC5hc3NpZ25lZF9hcHBzXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRpZiBwc2V0Lm5hbWUgPT0gXCJhZG1pblwiIHx8ICBwc2V0Lm5hbWUgPT0gXCJ1c2VyXCIgfHwgcHNldC5uYW1lID09ICdzdXBwbGllcicgfHwgcHNldC5uYW1lID09ICdjdXN0b21lcidcclxuXHRcdFx0XHRcdCMg6L+Z6YeM5LmL5omA5Lul6KaB5o6S6ZmkYWRtaW4vdXNlcu+8jOaYr+WboOS4uui/meS4pOS4quadg+mZkOe7hOaYr+aJgOacieadg+mZkOe7hOS4rXVzZXJz5bGe5oCn5peg5pWI55qE5p2D6ZmQ57uE77yM54m55oyH5bel5L2c5Yy6566h55CG5ZGY5ZKM5omA5pyJ55So5oi3XHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRhcHBzID0gXy51bmlvbiBhcHBzLCBwc2V0LmFzc2lnbmVkX2FwcHNcclxuXHRcdFx0cmV0dXJuIF8ud2l0aG91dChfLnVuaXEoYXBwcyksdW5kZWZpbmVkLG51bGwpXHJcblxyXG5cdENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cyA9IChzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRcdHBzZXRzID0gIHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcclxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxyXG5cdFx0YWRtaW5NZW51cyA9IENyZWF0b3IuQXBwcy5hZG1pbj8uYWRtaW5fbWVudXNcclxuXHRcdCMg5aaC5p6c5rKh5pyJYWRtaW7oj5zljZXor7TmmI7kuI3pnIDopoHnm7jlhbPlip/og73vvIznm7TmjqXov5Tlm57nqbpcclxuXHRcdHVubGVzcyBhZG1pbk1lbnVzXHJcblx0XHRcdHJldHVybiBbXVxyXG5cdFx0YWJvdXRNZW51ID0gYWRtaW5NZW51cy5maW5kIChuKSAtPlxyXG5cdFx0XHRuLl9pZCA9PSAnYWJvdXQnXHJcblx0XHRhZG1pbk1lbnVzID0gYWRtaW5NZW51cy5maWx0ZXIgKG4pIC0+XHJcblx0XHRcdG4uX2lkICE9ICdhYm91dCdcclxuXHRcdG90aGVyTWVudUFwcHMgPSBfLnNvcnRCeSBfLmZpbHRlcihfLnZhbHVlcyhDcmVhdG9yLkFwcHMpLCAobikgLT5cclxuXHRcdFx0cmV0dXJuIG4uYWRtaW5fbWVudXMgYW5kIG4uX2lkICE9ICdhZG1pbidcclxuXHRcdCksICdzb3J0J1xyXG5cdFx0b3RoZXJNZW51cyA9IF8uZmxhdHRlbihfLnBsdWNrKG90aGVyTWVudUFwcHMsIFwiYWRtaW5fbWVudXNcIikpXHJcblx0XHQjIOiPnOWNleacieS4iemDqOWIhue7hOaIkO+8jOiuvue9rkFQUOiPnOWNleOAgeWFtuS7lkFQUOiPnOWNleS7peWPimFib3V06I+c5Y2VXHJcblx0XHRhbGxNZW51cyA9IF8udW5pb24oYWRtaW5NZW51cywgb3RoZXJNZW51cywgW2Fib3V0TWVudV0pXHJcblx0XHRpZiBpc1NwYWNlQWRtaW5cclxuXHRcdFx0IyDlt6XkvZzljLrnrqHnkIblkZjmnInlhajpg6joj5zljZXlip/og71cclxuXHRcdFx0cmVzdWx0ID0gYWxsTWVudXNcclxuXHRcdGVsc2VcclxuXHRcdFx0dXNlclByb2ZpbGUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSk/LnByb2ZpbGUgfHwgJ3VzZXInXHJcblx0XHRcdGN1cnJlbnRQc2V0TmFtZXMgPSBwc2V0cy5tYXAgKG4pIC0+XHJcblx0XHRcdFx0cmV0dXJuIG4ubmFtZVxyXG5cdFx0XHRtZW51cyA9IGFsbE1lbnVzLmZpbHRlciAobWVudSktPlxyXG5cdFx0XHRcdHBzZXRzTWVudSA9IG1lbnUucGVybWlzc2lvbl9zZXRzXHJcblx0XHRcdFx0IyDlpoLmnpzmma7pgJrnlKjmiLfmnInmnYPpmZDvvIzliJnnm7TmjqXov5Tlm550cnVlXHJcblx0XHRcdFx0aWYgcHNldHNNZW51ICYmIHBzZXRzTWVudS5pbmRleE9mKHVzZXJQcm9maWxlKSA+IC0xXHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHRcdCMg5ZCm5YiZ5Y+W5b2T5YmN55So5oi355qE5p2D6ZmQ6ZuG5LiObWVudeiPnOWNleimgeaxgueahOadg+mZkOmbhuWvueavlO+8jOWmguaenOS6pOmbhuWkp+S6jjHkuKrliJnov5Tlm550cnVlXHJcblx0XHRcdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKGN1cnJlbnRQc2V0TmFtZXMsIHBzZXRzTWVudSkubGVuZ3RoXHJcblx0XHRcdHJlc3VsdCA9IG1lbnVzXHJcblx0XHRcclxuXHRcdHJldHVybiBfLnNvcnRCeShyZXN1bHQsXCJzb3J0XCIpXHJcblxyXG5cdGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QgPSAocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQpLT5cclxuXHJcblx0XHRpZiBfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpXHJcblx0XHRcdHJldHVybiBudWxsXHJcblx0XHRpZiBfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKVxyXG5cdFx0XHRyZXR1cm4gXy5maW5kIHBlcm1pc3Npb25fb2JqZWN0cywgKHBvKS0+XHJcblx0XHRcdFx0XHRyZXR1cm4gcG8ub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcclxuXHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZDogcGVybWlzc2lvbl9zZXRfaWR9KVxyXG5cclxuXHRmaW5kX3Blcm1pc3Npb25fb2JqZWN0ID0gKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkcyktPlxyXG5cdFx0aWYgXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKVxyXG5cdFx0XHRyZXR1cm4gbnVsbFxyXG5cdFx0aWYgXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cylcclxuXHRcdFx0cmV0dXJuIF8uZmlsdGVyIHBlcm1pc3Npb25fb2JqZWN0cywgKHBvKS0+XHJcblx0XHRcdFx0cmV0dXJuIHBvLm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXHJcblx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogcGVybWlzc2lvbl9zZXRfaWRzfX0pLmZldGNoKClcclxuXHJcblx0dW5pb25QZXJtaXNzaW9uT2JqZWN0cyA9IChwb3MsIG9iamVjdCwgcHNldHMpLT5cclxuXHRcdCMg5oqKZGLlj4p5bWzkuK3nmoRwZXJtaXNzaW9uX29iamVjdHPlkIjlubbvvIzkvJjlhYjlj5ZkYuS4reeahFxyXG5cdFx0cmVzdWx0ID0gW11cclxuXHRcdF8uZWFjaCBvYmplY3QucGVybWlzc2lvbl9zZXQsIChvcHMsIG9wc19rZXkpLT5cclxuXHRcdFx0IyDmiop5bWzkuK3pmaTkuobnibnlrprnlKjmiLfpm4blkIjmnYPpmZDnu4RcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCLlpJbnmoTlhbbku5blr7nosaHmnYPpmZDlhYjlrZjlhaVyZXN1bHRcclxuXHRcdFx0IyBpZiBbXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwiLCBcIndvcmtmbG93X2FkbWluXCIsIFwib3JnYW5pemF0aW9uX2FkbWluXCJdLmluZGV4T2Yob3BzX2tleSkgPCAwXHJcblx0XHRcdGlmIFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCJdLmluZGV4T2Yob3BzX2tleSkgPCAwXHJcblx0XHRcdFx0Y3VycmVudFBzZXQgPSBwc2V0cy5maW5kIChwc2V0KS0+IHJldHVybiBwc2V0Lm5hbWUgPT0gb3BzX2tleVxyXG5cdFx0XHRcdGlmIGN1cnJlbnRQc2V0XHJcblx0XHRcdFx0XHR0ZW1wT3BzID0gXy5jbG9uZShvcHMpIHx8IHt9XHJcblx0XHRcdFx0XHR0ZW1wT3BzLnBlcm1pc3Npb25fc2V0X2lkID0gY3VycmVudFBzZXQuX2lkXHJcblx0XHRcdFx0XHR0ZW1wT3BzLm9iamVjdF9uYW1lID0gb2JqZWN0Lm9iamVjdF9uYW1lXHJcblx0XHRcdFx0XHRyZXN1bHQucHVzaCB0ZW1wT3BzXHJcblx0XHRpZiByZXN1bHQubGVuZ3RoXHJcblx0XHRcdHBvcy5mb3JFYWNoIChwbyktPlxyXG5cdFx0XHRcdHJlcGVhdEluZGV4ID0gMFxyXG5cdFx0XHRcdHJlcGVhdFBvID0gcmVzdWx0LmZpbmQoKGl0ZW0sIGluZGV4KS0+IHJlcGVhdEluZGV4ID0gaW5kZXg7cmV0dXJuIGl0ZW0ucGVybWlzc2lvbl9zZXRfaWQgPT0gcG8ucGVybWlzc2lvbl9zZXRfaWQpXHJcblx0XHRcdFx0IyDlpoLmnpx5bWzkuK3lt7Lnu4/lrZjlnKhwb++8jOWImeabv+aNouS4uuaVsOaNruW6k+S4reeahHBv77yM5Y+N5LmL5YiZ5oqK5pWw5o2u5bqT5Lit55qEcG/nm7TmjqXntK/liqDov5vljrtcclxuXHRcdFx0XHRpZiByZXBlYXRQb1xyXG5cdFx0XHRcdFx0cmVzdWx0W3JlcGVhdEluZGV4XSA9IHBvXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0cmVzdWx0LnB1c2ggcG9cclxuXHRcdFx0cmV0dXJuIHJlc3VsdFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gcG9zXHJcblxyXG5cdENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMgPSAoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSktPlxyXG5cdFx0cGVybWlzc2lvbnMgPSB7fVxyXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpXHJcblxyXG5cdFx0aWYgc3BhY2VJZCBpcyAnZ3Vlc3QnIHx8IG9iamVjdF9uYW1lID09IFwidXNlcnNcIlxyXG5cdFx0XHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fVxyXG5cdFx0XHRDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyBwZXJtaXNzaW9uc1xyXG5cdFx0XHRyZXR1cm4gcGVybWlzc2lvbnNcclxuXHRcdHBzZXRzQWRtaW4gPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzQWRtaW4pIG9yIHRoaXMucHNldHNBZG1pbiB0aGVuIHRoaXMucHNldHNBZG1pbiBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjF9fSlcclxuXHRcdHBzZXRzVXNlciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNVc2VyKSBvciB0aGlzLnBzZXRzVXNlciB0aGVuIHRoaXMucHNldHNVc2VyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxfX0pXHJcblx0XHRwc2V0c01lbWJlciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNNZW1iZXIpIG9yIHRoaXMucHNldHNNZW1iZXIgdGhlbiB0aGlzLnBzZXRzTWVtYmVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcclxuXHRcdHBzZXRzR3Vlc3QgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzR3Vlc3QpIG9yIHRoaXMucHNldHNHdWVzdCB0aGVuIHRoaXMucHNldHNHdWVzdCBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjF9fSlcclxuXHJcblx0XHRwc2V0c1N1cHBsaWVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c1N1cHBsaWVyKSBvciB0aGlzLnBzZXRzU3VwcGxpZXIgdGhlbiB0aGlzLnBzZXRzU3VwcGxpZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3N1cHBsaWVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXHJcblx0XHRwc2V0c0N1c3RvbWVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0N1c3RvbWVyKSBvciB0aGlzLnBzZXRzQ3VzdG9tZXIgdGhlbiB0aGlzLnBzZXRzQ3VzdG9tZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2N1c3RvbWVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXHJcblx0XHRwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcclxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxyXG5cclxuXHRcdHBzZXRzQWRtaW5fcG9zID0gdGhpcy5wc2V0c0FkbWluX3Bvc1xyXG5cdFx0cHNldHNVc2VyX3BvcyA9IHRoaXMucHNldHNVc2VyX3Bvc1xyXG5cdFx0cHNldHNNZW1iZXJfcG9zID0gdGhpcy5wc2V0c01lbWJlcl9wb3NcclxuXHRcdHBzZXRzR3Vlc3RfcG9zID0gdGhpcy5wc2V0c0d1ZXN0X3Bvc1xyXG5cclxuXHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gdGhpcy5wc2V0c1N1cHBsaWVyX3Bvc1xyXG5cdFx0cHNldHNDdXN0b21lcl9wb3MgPSB0aGlzLnBzZXRzQ3VzdG9tZXJfcG9zXHJcblxyXG5cdFx0cHNldHNDdXJyZW50X3BvcyA9IHRoaXMucHNldHNDdXJyZW50X3Bvc1xyXG5cclxuXHRcdG9wc2V0QWRtaW4gPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5hZG1pbikgfHwge31cclxuXHRcdG9wc2V0VXNlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnVzZXIpIHx8IHt9XHJcblx0XHRvcHNldE1lbWJlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm1lbWJlcikgfHwge31cclxuXHRcdG9wc2V0R3Vlc3QgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge31cclxuXHJcblx0XHRvcHNldFN1cHBsaWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuc3VwcGxpZXIpIHx8IHt9XHJcblx0XHRvcHNldEN1c3RvbWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuY3VzdG9tZXIpIHx8IHt9XHJcblxyXG5cdFx0IyBzaGFyZWRMaXN0Vmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF9saXN0dmlld3MnKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBzaGFyZWQ6IHRydWV9LCB7ZmllbGRzOntfaWQ6MX19KS5mZXRjaCgpXHJcblx0XHQjIHNoYXJlZExpc3RWaWV3cyA9IF8ucGx1Y2soc2hhcmVkTGlzdFZpZXdzLFwiX2lkXCIpXHJcblx0XHQjIGlmIHNoYXJlZExpc3RWaWV3cy5sZW5ndGhcclxuXHRcdCMgXHR1bmxlc3Mgb3BzZXRBZG1pbi5saXN0X3ZpZXdzXHJcblx0XHQjIFx0XHRvcHNldEFkbWluLmxpc3Rfdmlld3MgPSBbXVxyXG5cdFx0IyBcdG9wc2V0QWRtaW4ubGlzdF92aWV3cyA9IF8udW5pb24gb3BzZXRBZG1pbi5saXN0X3ZpZXdzLCBzaGFyZWRMaXN0Vmlld3NcclxuXHRcdCMgXHR1bmxlc3Mgb3BzZXRVc2VyLmxpc3Rfdmlld3NcclxuXHRcdCMgXHRcdG9wc2V0VXNlci5saXN0X3ZpZXdzID0gW11cclxuXHRcdCMgXHRvcHNldFVzZXIubGlzdF92aWV3cyA9IF8udW5pb24gb3BzZXRVc2VyLmxpc3Rfdmlld3MsIHNoYXJlZExpc3RWaWV3c1xyXG5cdFx0IyDmlbDmja7lupPkuK3lpoLmnpzphY3nva7kuobpu5jorqTnmoRhZG1pbi91c2Vy5p2D6ZmQ6ZuG6K6+572u77yM5bqU6K+l6KaG55uW5Luj56CB5LitYWRtaW4vdXNlcueahOadg+mZkOmbhuiuvue9rlxyXG5cdFx0aWYgcHNldHNBZG1pblxyXG5cdFx0XHRwb3NBZG1pbiA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNBZG1pbl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0FkbWluLl9pZClcclxuXHRcdFx0aWYgcG9zQWRtaW5cclxuXHRcdFx0XHRvcHNldEFkbWluLmFsbG93Q3JlYXRlID0gcG9zQWRtaW4uYWxsb3dDcmVhdGVcclxuXHRcdFx0XHRvcHNldEFkbWluLmFsbG93RGVsZXRlID0gcG9zQWRtaW4uYWxsb3dEZWxldGVcclxuXHRcdFx0XHRvcHNldEFkbWluLmFsbG93RWRpdCA9IHBvc0FkbWluLmFsbG93RWRpdFxyXG5cdFx0XHRcdG9wc2V0QWRtaW4uYWxsb3dSZWFkID0gcG9zQWRtaW4uYWxsb3dSZWFkXHJcblx0XHRcdFx0b3BzZXRBZG1pbi5tb2RpZnlBbGxSZWNvcmRzID0gcG9zQWRtaW4ubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0QWRtaW4udmlld0FsbFJlY29yZHMgPSBwb3NBZG1pbi52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0QWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NBZG1pbi5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0QWRtaW4udmlld0NvbXBhbnlSZWNvcmRzID0gcG9zQWRtaW4udmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zQWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3c1xyXG5cdFx0XHRcdG9wc2V0QWRtaW4uZGlzYWJsZWRfYWN0aW9ucyA9IHBvc0FkbWluLmRpc2FibGVkX2FjdGlvbnNcclxuXHRcdFx0XHRvcHNldEFkbWluLnVucmVhZGFibGVfZmllbGRzID0gcG9zQWRtaW4udW5yZWFkYWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldEFkbWluLnVuZWRpdGFibGVfZmllbGRzID0gcG9zQWRtaW4udW5lZGl0YWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldEFkbWluLnVucmVsYXRlZF9vYmplY3RzID0gcG9zQWRtaW4udW5yZWxhdGVkX29iamVjdHNcclxuXHRcdFx0XHRvcHNldEFkbWluLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zQWRtaW4udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcclxuXHRcdGlmIHBzZXRzVXNlclxyXG5cdFx0XHRwb3NVc2VyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1VzZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNVc2VyLl9pZClcclxuXHRcdFx0aWYgcG9zVXNlclxyXG5cdFx0XHRcdG9wc2V0VXNlci5hbGxvd0NyZWF0ZSA9IHBvc1VzZXIuYWxsb3dDcmVhdGVcclxuXHRcdFx0XHRvcHNldFVzZXIuYWxsb3dEZWxldGUgPSBwb3NVc2VyLmFsbG93RGVsZXRlXHJcblx0XHRcdFx0b3BzZXRVc2VyLmFsbG93RWRpdCA9IHBvc1VzZXIuYWxsb3dFZGl0XHJcblx0XHRcdFx0b3BzZXRVc2VyLmFsbG93UmVhZCA9IHBvc1VzZXIuYWxsb3dSZWFkXHJcblx0XHRcdFx0b3BzZXRVc2VyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NVc2VyLm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldFVzZXIudmlld0FsbFJlY29yZHMgPSBwb3NVc2VyLnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRVc2VyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zVXNlci5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0VXNlci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NVc2VyLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0VXNlci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zVXNlci5kaXNhYmxlZF9saXN0X3ZpZXdzXHJcblx0XHRcdFx0b3BzZXRVc2VyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NVc2VyLmRpc2FibGVkX2FjdGlvbnNcclxuXHRcdFx0XHRvcHNldFVzZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NVc2VyLnVucmVhZGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRVc2VyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zVXNlci51bmVkaXRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0VXNlci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc1VzZXIudW5yZWxhdGVkX29iamVjdHNcclxuXHRcdFx0XHRvcHNldFVzZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NVc2VyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0XHJcblx0XHRpZiBwc2V0c01lbWJlclxyXG5cdFx0XHRwb3NNZW1iZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzTWVtYmVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzTWVtYmVyLl9pZClcclxuXHRcdFx0aWYgcG9zTWVtYmVyXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuYWxsb3dDcmVhdGUgPSBwb3NNZW1iZXIuYWxsb3dDcmVhdGVcclxuXHRcdFx0XHRvcHNldE1lbWJlci5hbGxvd0RlbGV0ZSA9IHBvc01lbWJlci5hbGxvd0RlbGV0ZVxyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmFsbG93RWRpdCA9IHBvc01lbWJlci5hbGxvd0VkaXRcclxuXHRcdFx0XHRvcHNldE1lbWJlci5hbGxvd1JlYWQgPSBwb3NNZW1iZXIuYWxsb3dSZWFkXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc01lbWJlci5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIudmlld0FsbFJlY29yZHMgPSBwb3NNZW1iZXIudmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldE1lbWJlci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc01lbWJlci5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc01lbWJlci52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldE1lbWJlci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zTWVtYmVyLmRpc2FibGVkX2xpc3Rfdmlld3NcclxuXHRcdFx0XHRvcHNldE1lbWJlci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zTWVtYmVyLmRpc2FibGVkX2FjdGlvbnNcclxuXHRcdFx0XHRvcHNldE1lbWJlci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc01lbWJlci51bnJlYWRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zTWVtYmVyLnVuZWRpdGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NNZW1iZXIudW5yZWxhdGVkX29iamVjdHNcclxuXHRcdFx0XHRvcHNldE1lbWJlci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc01lbWJlci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFxyXG5cdFx0aWYgcHNldHNHdWVzdFxyXG5cdFx0XHRwb3NHdWVzdCA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNHdWVzdF9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0d1ZXN0Ll9pZClcclxuXHRcdFx0aWYgcG9zR3Vlc3RcclxuXHRcdFx0XHRvcHNldEd1ZXN0LmFsbG93Q3JlYXRlID0gcG9zR3Vlc3QuYWxsb3dDcmVhdGVcclxuXHRcdFx0XHRvcHNldEd1ZXN0LmFsbG93RGVsZXRlID0gcG9zR3Vlc3QuYWxsb3dEZWxldGVcclxuXHRcdFx0XHRvcHNldEd1ZXN0LmFsbG93RWRpdCA9IHBvc0d1ZXN0LmFsbG93RWRpdFxyXG5cdFx0XHRcdG9wc2V0R3Vlc3QuYWxsb3dSZWFkID0gcG9zR3Vlc3QuYWxsb3dSZWFkXHJcblx0XHRcdFx0b3BzZXRHdWVzdC5tb2RpZnlBbGxSZWNvcmRzID0gcG9zR3Vlc3QubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0R3Vlc3Qudmlld0FsbFJlY29yZHMgPSBwb3NHdWVzdC52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0R3Vlc3QubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NHdWVzdC5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0R3Vlc3Qudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zR3Vlc3Qudmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zR3Vlc3QuZGlzYWJsZWRfbGlzdF92aWV3c1xyXG5cdFx0XHRcdG9wc2V0R3Vlc3QuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc0d1ZXN0LmRpc2FibGVkX2FjdGlvbnNcclxuXHRcdFx0XHRvcHNldEd1ZXN0LnVucmVhZGFibGVfZmllbGRzID0gcG9zR3Vlc3QudW5yZWFkYWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldEd1ZXN0LnVuZWRpdGFibGVfZmllbGRzID0gcG9zR3Vlc3QudW5lZGl0YWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldEd1ZXN0LnVucmVsYXRlZF9vYmplY3RzID0gcG9zR3Vlc3QudW5yZWxhdGVkX29iamVjdHNcclxuXHRcdFx0XHRvcHNldEd1ZXN0LnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zR3Vlc3QudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcclxuXHRcdGlmIHBzZXRzU3VwcGxpZXJcclxuXHRcdFx0cG9zU3VwcGxpZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzU3VwcGxpZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNTdXBwbGllci5faWQpO1xyXG5cdFx0XHRpZiBwb3NTdXBwbGllclxyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIuYWxsb3dDcmVhdGUgPSBwb3NTdXBwbGllci5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIuYWxsb3dEZWxldGUgPSBwb3NTdXBwbGllci5hbGxvd0RlbGV0ZVxyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIuYWxsb3dFZGl0ID0gcG9zU3VwcGxpZXIuYWxsb3dFZGl0XHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci5hbGxvd1JlYWQgPSBwb3NTdXBwbGllci5hbGxvd1JlYWRcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NTdXBwbGllci5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci52aWV3QWxsUmVjb3JkcyA9IHBvc1N1cHBsaWVyLnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc1N1cHBsaWVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NTdXBwbGllci52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NTdXBwbGllci5kaXNhYmxlZF9saXN0X3ZpZXdzXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zU3VwcGxpZXIuZGlzYWJsZWRfYWN0aW9uc1xyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NTdXBwbGllci51bnJlYWRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NTdXBwbGllci51bmVkaXRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NTdXBwbGllci51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NTdXBwbGllci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFxyXG5cdFx0aWYgcHNldHNDdXN0b21lclxyXG5cdFx0XHRwb3NDdXN0b21lciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXN0b21lcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0N1c3RvbWVyLl9pZCk7XHJcblx0XHRcdGlmIHBvc0N1c3RvbWVyXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci5hbGxvd0NyZWF0ZSA9IHBvc0N1c3RvbWVyLmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci5hbGxvd0RlbGV0ZSA9IHBvc0N1c3RvbWVyLmFsbG93RGVsZXRlXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci5hbGxvd0VkaXQgPSBwb3NDdXN0b21lci5hbGxvd0VkaXRcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLmFsbG93UmVhZCA9IHBvc0N1c3RvbWVyLmFsbG93UmVhZFxyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0N1c3RvbWVyLm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLnZpZXdBbGxSZWNvcmRzID0gcG9zQ3VzdG9tZXIudmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zQ3VzdG9tZXIubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0N1c3RvbWVyLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0N1c3RvbWVyLmRpc2FibGVkX2xpc3Rfdmlld3NcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NDdXN0b21lci5kaXNhYmxlZF9hY3Rpb25zXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0N1c3RvbWVyLnVucmVhZGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0N1c3RvbWVyLnVuZWRpdGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0N1c3RvbWVyLnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc0N1c3RvbWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0XHJcblxyXG5cdFx0aWYgIXVzZXJJZFxyXG5cdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW5cclxuXHRcdGVsc2VcclxuXHRcdFx0aWYgaXNTcGFjZUFkbWluXHJcblx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEFkbWluXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiBzcGFjZUlkIGlzICdjb21tb24nXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHNwYWNlVXNlciA9IGlmIF8uaXNOdWxsKHRoaXMuc3BhY2VVc2VyKSBvciB0aGlzLnNwYWNlVXNlciB0aGVuIHRoaXMuc3BhY2VVc2VyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXHJcblx0XHRcdFx0XHRpZiBzcGFjZVVzZXJcclxuXHRcdFx0XHRcdFx0cHJvZiA9IHNwYWNlVXNlci5wcm9maWxlXHJcblx0XHRcdFx0XHRcdGlmIHByb2ZcclxuXHRcdFx0XHRcdFx0XHRpZiBwcm9mIGlzICd1c2VyJ1xyXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ21lbWJlcidcclxuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRNZW1iZXJcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ2d1ZXN0J1xyXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0XHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdzdXBwbGllcidcclxuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRTdXBwbGllclxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnY3VzdG9tZXInXHJcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0Q3VzdG9tZXJcclxuXHRcdFx0XHRcdFx0ZWxzZSAjIOayoeaciXByb2ZpbGXliJnorqTkuLrmmK91c2Vy5p2D6ZmQXHJcblx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0XHJcblx0XHRpZiBwc2V0cy5sZW5ndGggPiAwXHJcblx0XHRcdHNldF9pZHMgPSBfLnBsdWNrIHBzZXRzLCBcIl9pZFwiXHJcblx0XHRcdHBvcyA9IGZpbmRfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXJyZW50X3Bvcywgb2JqZWN0X25hbWUsIHNldF9pZHMpXHJcblx0XHRcdHBvcyA9IHVuaW9uUGVybWlzc2lvbk9iamVjdHMocG9zLCBvYmplY3QsIHBzZXRzKVxyXG5cdFx0XHRfLmVhY2ggcG9zLCAocG8pLT5cclxuXHRcdFx0XHRpZiBwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c0FkbWluPy5faWQgb3IgXHJcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNVc2VyPy5faWQgb3IgXHJcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNNZW1iZXI/Ll9pZCBvciBcclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c0d1ZXN0Py5faWQgb3JcclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c1N1cHBsaWVyPy5faWQgb3JcclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c0N1c3RvbWVyPy5faWRcclxuXHRcdFx0XHRcdCMg6buY6K6k55qEYWRtaW4vdXNlcuadg+mZkOWAvOWPquWunuihjOS4iumdoueahOm7mOiupOWAvOimhueblu+8jOS4jeWBmueul+azleWIpOaWrVxyXG5cdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdFx0aWYgXy5pc0VtcHR5KHBlcm1pc3Npb25zKVxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBwb1xyXG5cdFx0XHRcdGlmIHBvLmFsbG93UmVhZFxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIHBvLmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHRydWVcclxuXHRcdFx0XHRpZiBwby5hbGxvd0VkaXRcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHRydWVcclxuXHRcdFx0XHRpZiBwby5hbGxvd0RlbGV0ZVxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSB0cnVlXHJcblx0XHRcdFx0aWYgcG8ubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IHRydWVcclxuXHRcdFx0XHRpZiBwby52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgPSB0cnVlXHJcblx0XHRcdFx0aWYgcG8ubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIHBvLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZVxyXG5cclxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzLCBwby5kaXNhYmxlZF9saXN0X3ZpZXdzKVxyXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMsIHBvLmRpc2FibGVkX2FjdGlvbnMpXHJcblx0XHRcdFx0cGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBwby51bnJlYWRhYmxlX2ZpZWxkcylcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIHBvLnVuZWRpdGFibGVfZmllbGRzKVxyXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cywgcG8udW5yZWxhdGVkX29iamVjdHMpXHJcblx0XHRcdFx0cGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0LCBwby51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdClcclxuXHRcdFxyXG5cdFx0aWYgb2JqZWN0LmlzX3ZpZXdcclxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBmYWxzZVxyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXHJcblx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSBmYWxzZVxyXG5cdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IGZhbHNlXHJcblx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBbXVxyXG5cdFx0Q3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgcGVybWlzc2lvbnNcclxuXHJcblx0XHRpZiBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXJcclxuXHRcdFx0cGVybWlzc2lvbnMub3duZXIgPSBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXJcclxuXHRcdHJldHVybiBwZXJtaXNzaW9uc1xyXG5cclxuXHJcblx0IyBDcmVhdG9yLmluaXRQZXJtaXNzaW9ucyA9IChvYmplY3RfbmFtZSkgLT5cclxuXHJcblx0XHQjICMg5bqU6K+l5oqK6K6h566X5Ye65p2l55qEXHJcblx0XHQjIENyZWF0b3IuQ29sbGVjdGlvbnNbb2JqZWN0X25hbWVdLmFsbG93XHJcblx0XHQjIFx0aW5zZXJ0OiAodXNlcklkLCBkb2MpIC0+XHJcblx0XHQjIFx0XHRpZiAhdXNlcklkXHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHQgICAgXHQjIFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoZG9jLnNwYWNlLCB1c2VySWQsIG9iamVjdF9uYW1lKVxyXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93Q3JlYXRlXHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHRcdCMgXHRcdHJldHVybiB0cnVlXHJcblx0XHQjIFx0dXBkYXRlOiAodXNlcklkLCBkb2MpIC0+XHJcblx0XHQjIFx0XHRpZiAhdXNlcklkXHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXHJcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dFZGl0XHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcclxuXHRcdCMgXHRyZW1vdmU6ICh1c2VySWQsIGRvYykgLT5cclxuXHRcdCMgXHRcdGlmICF1c2VySWRcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQjIFx0XHRpZiAhZG9jLnNwYWNlXHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcclxuXHRcdCMgXHRcdGlmICFwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZVxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdCMgXHRcdHJldHVybiB0cnVlXHJcblxyXG5cdE1ldGVvci5tZXRob2RzXHJcblx0XHQjIENhbGN1bGF0ZSBQZXJtaXNzaW9ucyBvbiBTZXJ2ZXJcclxuXHRcdFwiY3JlYXRvci5vYmplY3RfcGVybWlzc2lvbnNcIjogKHNwYWNlSWQpLT5cclxuXHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdGhpcy51c2VySWQpXHJcbiIsInZhciBjbG9uZSwgZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCwgZmluZF9wZXJtaXNzaW9uX29iamVjdCwgaW50ZXJzZWN0aW9uUGx1cywgdW5pb25QZXJtaXNzaW9uT2JqZWN0cywgdW5pb25QbHVzO1xuXG5jbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJyk7XG5cbkNyZWF0b3IuZ2V0UGVybWlzc2lvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBvYmo7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoIW9iaikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gb2JqLnBlcm1pc3Npb25zLmdldCgpO1xuICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIHJldHVybiBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZCwgdXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBpc093bmVyLCBvYmplY3RfZmllbGRzX2tleXMsIHBlcm1pc3Npb25zLCByZWNvcmRfY29tcGFueV9pZCwgcmVjb3JkX2NvbXBhbnlfaWRzLCByZWNvcmRfaWQsIHJlZiwgcmVmMSwgc2VsZWN0LCB1c2VyX2NvbXBhbnlfaWRzO1xuICBpZiAoIW9iamVjdF9uYW1lICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAoIXNwYWNlSWQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgfVxuICBpZiAocmVjb3JkICYmIG9iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJykpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gcmVjb3JkLnBhcmVudFsncmVmZXJlbmNlX3RvLl9vJ107XG4gICAgICByZWNvcmRfaWQgPSByZWNvcmQucGFyZW50Ll9pZDtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldCgnb2JqZWN0X25hbWUnKTtcbiAgICAgIHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuICAgIH1cbiAgICBvYmplY3RfZmllbGRzX2tleXMgPSBfLmtleXMoKChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwKSB8fCB7fSkgfHwgW107XG4gICAgc2VsZWN0ID0gXy5pbnRlcnNlY3Rpb24ob2JqZWN0X2ZpZWxkc19rZXlzLCBbJ293bmVyJywgJ2NvbXBhbnlfaWQnLCAnY29tcGFueV9pZHMnLCAnbG9ja2VkJ10pIHx8IFtdO1xuICAgIGlmIChzZWxlY3QubGVuZ3RoID4gMCkge1xuICAgICAgcmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0LmpvaW4oJywnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlY29yZCA9IG51bGw7XG4gICAgfVxuICB9XG4gIHBlcm1pc3Npb25zID0gXy5jbG9uZShDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKTtcbiAgaWYgKHJlY29yZCkge1xuICAgIGlmIChyZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zKSB7XG4gICAgICByZXR1cm4gcmVjb3JkLnJlY29yZF9wZXJtaXNzaW9ucztcbiAgICB9XG4gICAgaXNPd25lciA9IHJlY29yZC5vd25lciA9PT0gdXNlcklkIHx8ICgocmVmMSA9IHJlY29yZC5vd25lcikgIT0gbnVsbCA/IHJlZjEuX2lkIDogdm9pZCAwKSA9PT0gdXNlcklkO1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHVzZXJfY29tcGFueV9pZHMgPSBTdGVlZG9zLmdldFVzZXJDb21wYW55SWRzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJfY29tcGFueV9pZHMgPSBDcmVhdG9yLmdldFVzZXJDb21wYW55SWRzKHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgfVxuICAgIHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkICE9IG51bGwgPyByZWNvcmQuY29tcGFueV9pZCA6IHZvaWQgMDtcbiAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWQgJiYgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZCkgJiYgcmVjb3JkX2NvbXBhbnlfaWQuX2lkKSB7XG4gICAgICByZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZF9jb21wYW55X2lkLl9pZDtcbiAgICB9XG4gICAgcmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkICE9IG51bGwgPyByZWNvcmQuY29tcGFueV9pZHMgOiB2b2lkIDA7XG4gICAgaWYgKHJlY29yZF9jb21wYW55X2lkcyAmJiByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoICYmIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWRzWzBdKSkge1xuICAgICAgcmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkX2NvbXBhbnlfaWRzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZWNvcmRfY29tcGFueV9pZHMgPSBfLnVuaW9uKHJlY29yZF9jb21wYW55X2lkcywgW3JlY29yZF9jb21wYW55X2lkXSk7XG4gICAgaWYgKCFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzICYmICFpc093bmVyICYmICFwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZHMgJiYgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICBpZiAodXNlcl9jb21wYW55X2lkcyAmJiB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgIGlmICghXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAocmVjb3JkLmxvY2tlZCAmJiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmICFpc093bmVyICYmICFwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkcyAmJiByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgIGlmICh1c2VyX2NvbXBhbnlfaWRzICYmIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aCkge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBwZXJtaXNzaW9ucztcbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zID0gZnVuY3Rpb24oY3VycmVudE9iamVjdE5hbWUsIHJlbGF0ZWRMaXN0SXRlbSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKSB7XG4gICAgdmFyIGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSwgbWFzdGVyQWxsb3csIG1hc3RlclJlY29yZFBlcm0sIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucywgcmVzdWx0LCBzaGFyaW5nLCB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdDtcbiAgICBpZiAoIWN1cnJlbnRPYmplY3ROYW1lICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgY3VycmVudE9iamVjdE5hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXJlbGF0ZWRMaXN0SXRlbSkge1xuICAgICAgY29uc29sZS5lcnJvcihcInJlbGF0ZWRMaXN0SXRlbSBtdXN0IG5vdCBiZSBlbXB0eSBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9uc1wiKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgaWYgKCFjdXJyZW50UmVjb3JkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgY3VycmVudFJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKCk7XG4gICAgfVxuICAgIGlmICghdXNlcklkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBzaGFyaW5nID0gcmVsYXRlZExpc3RJdGVtLnNoYXJpbmcgfHwgJ21hc3RlcldyaXRlJztcbiAgICBtYXN0ZXJBbGxvdyA9IGZhbHNlO1xuICAgIG1hc3RlclJlY29yZFBlcm0gPSBDcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zKGN1cnJlbnRPYmplY3ROYW1lLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpO1xuICAgIGlmIChzaGFyaW5nID09PSAnbWFzdGVyUmVhZCcpIHtcbiAgICAgIG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWQ7XG4gICAgfSBlbHNlIGlmIChzaGFyaW5nID09PSAnbWFzdGVyV3JpdGUnKSB7XG4gICAgICBtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0O1xuICAgIH1cbiAgICB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IENyZWF0b3IuZ2V0UmVjb3JkU2FmZVJlbGF0ZWRMaXN0KGN1cnJlbnRSZWNvcmQsIGN1cnJlbnRPYmplY3ROYW1lKTtcbiAgICByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSk7XG4gICAgaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlID0gdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QuaW5kZXhPZihyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpID4gLTE7XG4gICAgcmVzdWx0ID0gXy5jbG9uZShyZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMpO1xuICAgIHJlc3VsdC5hbGxvd0NyZWF0ZSA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlO1xuICAgIHJlc3VsdC5hbGxvd0VkaXQgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIF9pLCBpc1NwYWNlQWRtaW4sIHBlcm1pc3Npb25zLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNBZG1pbl9wb3MsIHBzZXRzQ3VycmVudCwgcHNldHNDdXJyZW50TmFtZXMsIHBzZXRzQ3VycmVudF9wb3MsIHBzZXRzQ3VzdG9tZXIsIHBzZXRzQ3VzdG9tZXJfcG9zLCBwc2V0c0d1ZXN0LCBwc2V0c0d1ZXN0X3BvcywgcHNldHNNZW1iZXIsIHBzZXRzTWVtYmVyX3BvcywgcHNldHNTdXBwbGllciwgcHNldHNTdXBwbGllcl9wb3MsIHBzZXRzVXNlciwgcHNldHNVc2VyX3Bvcywgc2V0X2lkcywgc3BhY2VVc2VyO1xuICAgIHBlcm1pc3Npb25zID0ge1xuICAgICAgb2JqZWN0czoge30sXG4gICAgICBhc3NpZ25lZF9hcHBzOiBbXVxuICAgIH07XG5cbiAgICAvKlxuICAgIFx0XHTmnYPpmZDnu4Tor7TmmI46XG4gICAgXHRcdOWGhee9ruadg+mZkOe7hC1hZG1pbix1c2VyLG1lbWJlcixndWVzdCx3b3JrZmxvd19hZG1pbixvcmdhbml6YXRpb25fYWRtaW5cbiAgICBcdFx06Ieq5a6a5LmJ5p2D6ZmQ57uELeaVsOaNruW6k+S4reaWsOW7uueahOmZpOWGhee9ruadg+mZkOe7hOS7peWklueahOWFtuS7luadg+mZkOe7hFxuICAgIFx0XHTnibnlrprnlKjmiLfpm4blkIjmnYPpmZDnu4TvvIjljbN1c2Vyc+WxnuaAp+S4jeWPr+mFjee9ru+8iS1hZG1pbix1c2VyLG1lbWJlcixndWVzdFxuICAgIFx0XHTlj6/phY3nva7nlKjmiLfpm4blkIjmnYPpmZDnu4TvvIjljbN1c2Vyc+WxnuaAp+WPr+mFjee9ru+8iS13b3JrZmxvd19hZG1pbixvcmdhbml6YXRpb25fYWRtaW7ku6Xlj4roh6rlrprkuYnmnYPpmZDnu4RcbiAgICAgKi9cbiAgICBpc1NwYWNlQWRtaW4gPSBmYWxzZTtcbiAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgIGlmICh1c2VySWQpIHtcbiAgICAgIGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNNZW1iZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ21lbWJlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c0d1ZXN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdndWVzdCdcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c1N1cHBsaWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c0N1c3RvbWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdjdXN0b21lcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICRvcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVzZXJzOiB1c2VySWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBuYW1lOiBzcGFjZVVzZXIucHJvZmlsZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIHBzZXRzQWRtaW5fcG9zID0gbnVsbDtcbiAgICBwc2V0c1VzZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c01lbWJlcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzR3Vlc3RfcG9zID0gbnVsbDtcbiAgICBwc2V0c0N1cnJlbnRfcG9zID0gbnVsbDtcbiAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IG51bGw7XG4gICAgcHNldHNDdXN0b21lcl9wb3MgPSBudWxsO1xuICAgIGlmIChwc2V0c0FkbWluICE9IG51bGwgPyBwc2V0c0FkbWluLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNBZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0FkbWluLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzVXNlciAhPSBudWxsID8gcHNldHNVc2VyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNVc2VyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzVXNlci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c01lbWJlciAhPSBudWxsID8gcHNldHNNZW1iZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c01lbWJlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c01lbWJlci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0d1ZXN0ICE9IG51bGwgPyBwc2V0c0d1ZXN0Ll9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNHdWVzdF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0d1ZXN0Ll9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzU3VwcGxpZXIgIT0gbnVsbCA/IHBzZXRzU3VwcGxpZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzU3VwcGxpZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNDdXN0b21lciAhPSBudWxsID8gcHNldHNDdXN0b21lci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzQ3VzdG9tZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNDdXN0b21lci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1cnJlbnQubGVuZ3RoID4gMCkge1xuICAgICAgc2V0X2lkcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIl9pZFwiKTtcbiAgICAgIHBzZXRzQ3VycmVudF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiB7XG4gICAgICAgICAgJGluOiBzZXRfaWRzXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBwc2V0c0N1cnJlbnROYW1lcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIm5hbWVcIik7XG4gICAgfVxuICAgIHBzZXRzID0ge1xuICAgICAgcHNldHNBZG1pbjogcHNldHNBZG1pbixcbiAgICAgIHBzZXRzVXNlcjogcHNldHNVc2VyLFxuICAgICAgcHNldHNDdXJyZW50OiBwc2V0c0N1cnJlbnQsXG4gICAgICBwc2V0c01lbWJlcjogcHNldHNNZW1iZXIsXG4gICAgICBwc2V0c0d1ZXN0OiBwc2V0c0d1ZXN0LFxuICAgICAgcHNldHNTdXBwbGllcjogcHNldHNTdXBwbGllcixcbiAgICAgIHBzZXRzQ3VzdG9tZXI6IHBzZXRzQ3VzdG9tZXIsXG4gICAgICBpc1NwYWNlQWRtaW46IGlzU3BhY2VBZG1pbixcbiAgICAgIHNwYWNlVXNlcjogc3BhY2VVc2VyLFxuICAgICAgcHNldHNBZG1pbl9wb3M6IHBzZXRzQWRtaW5fcG9zLFxuICAgICAgcHNldHNVc2VyX3BvczogcHNldHNVc2VyX3BvcyxcbiAgICAgIHBzZXRzTWVtYmVyX3BvczogcHNldHNNZW1iZXJfcG9zLFxuICAgICAgcHNldHNHdWVzdF9wb3M6IHBzZXRzR3Vlc3RfcG9zLFxuICAgICAgcHNldHNTdXBwbGllcl9wb3M6IHBzZXRzU3VwcGxpZXJfcG9zLFxuICAgICAgcHNldHNDdXN0b21lcl9wb3M6IHBzZXRzQ3VzdG9tZXJfcG9zLFxuICAgICAgcHNldHNDdXJyZW50X3BvczogcHNldHNDdXJyZW50X3Bvc1xuICAgIH07XG4gICAgcGVybWlzc2lvbnMuYXNzaWduZWRfYXBwcyA9IENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcGVybWlzc2lvbnMuYXNzaWduZWRfbWVudXMgPSBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwZXJtaXNzaW9ucy51c2VyX3Blcm1pc3Npb25fc2V0cyA9IHBzZXRzQ3VycmVudE5hbWVzO1xuICAgIF9pID0gMDtcbiAgICBfLmVhY2goQ3JlYXRvci5vYmplY3RzQnlOYW1lLCBmdW5jdGlvbihvYmplY3QsIG9iamVjdF9uYW1lKSB7XG4gICAgICBfaSsrO1xuICAgICAgaWYgKCFfLmhhcyhvYmplY3QsICdzcGFjZScpIHx8ICFvYmplY3Quc3BhY2UgfHwgb2JqZWN0LnNwYWNlID09PSBzcGFjZUlkKSB7XG4gICAgICAgIGlmICghXy5oYXMob2JqZWN0LCAnaW5fZGV2ZWxvcG1lbnQnKSB8fCBvYmplY3QuaW5fZGV2ZWxvcG1lbnQgPT09ICcwJyB8fCAob2JqZWN0LmluX2RldmVsb3BtZW50ICE9PSAnMCcgJiYgaXNTcGFjZUFkbWluKSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0pLCBzcGFjZUlkKTtcbiAgICAgICAgICByZXR1cm4gcGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV1bXCJwZXJtaXNzaW9uc1wiXSA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gIH07XG4gIHVuaW9uUGx1cyA9IGZ1bmN0aW9uKGFycmF5LCBvdGhlcikge1xuICAgIGlmICghYXJyYXkgJiYgIW90aGVyKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAoIWFycmF5KSB7XG4gICAgICBhcnJheSA9IFtdO1xuICAgIH1cbiAgICBpZiAoIW90aGVyKSB7XG4gICAgICBvdGhlciA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gXy51bmlvbihhcnJheSwgb3RoZXIpO1xuICB9O1xuICBpbnRlcnNlY3Rpb25QbHVzID0gZnVuY3Rpb24oYXJyYXksIG90aGVyKSB7XG4gICAgaWYgKCFhcnJheSAmJiAhb3RoZXIpIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICghYXJyYXkpIHtcbiAgICAgIGFycmF5ID0gW107XG4gICAgfVxuICAgIGlmICghb3RoZXIpIHtcbiAgICAgIG90aGVyID0gW107XG4gICAgfVxuICAgIHJldHVybiBfLmludGVyc2VjdGlvbihhcnJheSwgb3RoZXIpO1xuICB9O1xuICBDcmVhdG9yLmdldEFzc2lnbmVkQXBwcyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBhcHBzLCBpc1NwYWNlQWRtaW4sIHBzZXRCYXNlLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNDdXN0b21lciwgcHNldHNTdXBwbGllciwgcHNldHNVc2VyLCByZWYsIHJlZjEsIHVzZXJQcm9maWxlO1xuICAgIHBzZXRzQWRtaW4gPSB0aGlzLnBzZXRzQWRtaW4gfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gdGhpcy5wc2V0c1VzZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1N1cHBsaWVyID0gdGhpcy5wc2V0c01lbWJlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3N1cHBsaWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0N1c3RvbWVyID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnY3VzdG9tZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICB1c2VyczogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICBuYW1lOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgYXBwcyA9IFtdO1xuICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlclByb2ZpbGUgPSAocmVmID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICB9XG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZi5wcm9maWxlIDogdm9pZCAwO1xuICAgICAgcHNldEJhc2UgPSBwc2V0c1VzZXI7XG4gICAgICBpZiAodXNlclByb2ZpbGUpIHtcbiAgICAgICAgaWYgKHVzZXJQcm9maWxlID09PSAnc3VwcGxpZXInKSB7XG4gICAgICAgICAgcHNldEJhc2UgPSBwc2V0c1N1cHBsaWVyO1xuICAgICAgICB9IGVsc2UgaWYgKHVzZXJQcm9maWxlID09PSAnY3VzdG9tZXInKSB7XG4gICAgICAgICAgcHNldEJhc2UgPSBwc2V0c0N1c3RvbWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocHNldEJhc2UgIT0gbnVsbCA/IChyZWYxID0gcHNldEJhc2UuYXNzaWduZWRfYXBwcykgIT0gbnVsbCA/IHJlZjEubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgIGFwcHMgPSBfLnVuaW9uKGFwcHMsIHBzZXRCYXNlLmFzc2lnbmVkX2FwcHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgICAgXy5lYWNoKHBzZXRzLCBmdW5jdGlvbihwc2V0KSB7XG4gICAgICAgIGlmICghcHNldC5hc3NpZ25lZF9hcHBzKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwc2V0Lm5hbWUgPT09IFwiYWRtaW5cIiB8fCBwc2V0Lm5hbWUgPT09IFwidXNlclwiIHx8IHBzZXQubmFtZSA9PT0gJ3N1cHBsaWVyJyB8fCBwc2V0Lm5hbWUgPT09ICdjdXN0b21lcicpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFwcHMgPSBfLnVuaW9uKGFwcHMsIHBzZXQuYXNzaWduZWRfYXBwcyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLndpdGhvdXQoXy51bmlxKGFwcHMpLCB2b2lkIDAsIG51bGwpO1xuICAgIH1cbiAgfTtcbiAgQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGFib3V0TWVudSwgYWRtaW5NZW51cywgYWxsTWVudXMsIGN1cnJlbnRQc2V0TmFtZXMsIGlzU3BhY2VBZG1pbiwgbWVudXMsIG90aGVyTWVudUFwcHMsIG90aGVyTWVudXMsIHBzZXRzLCByZWYsIHJlZjEsIHJlc3VsdCwgdXNlclByb2ZpbGU7XG4gICAgcHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgIG5hbWU6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBhZG1pbk1lbnVzID0gKHJlZiA9IENyZWF0b3IuQXBwcy5hZG1pbikgIT0gbnVsbCA/IHJlZi5hZG1pbl9tZW51cyA6IHZvaWQgMDtcbiAgICBpZiAoIWFkbWluTWVudXMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgYWJvdXRNZW51ID0gYWRtaW5NZW51cy5maW5kKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLl9pZCA9PT0gJ2Fib3V0JztcbiAgICB9KTtcbiAgICBhZG1pbk1lbnVzID0gYWRtaW5NZW51cy5maWx0ZXIoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uX2lkICE9PSAnYWJvdXQnO1xuICAgIH0pO1xuICAgIG90aGVyTWVudUFwcHMgPSBfLnNvcnRCeShfLmZpbHRlcihfLnZhbHVlcyhDcmVhdG9yLkFwcHMpLCBmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5hZG1pbl9tZW51cyAmJiBuLl9pZCAhPT0gJ2FkbWluJztcbiAgICB9KSwgJ3NvcnQnKTtcbiAgICBvdGhlck1lbnVzID0gXy5mbGF0dGVuKF8ucGx1Y2sob3RoZXJNZW51QXBwcywgXCJhZG1pbl9tZW51c1wiKSk7XG4gICAgYWxsTWVudXMgPSBfLnVuaW9uKGFkbWluTWVudXMsIG90aGVyTWVudXMsIFthYm91dE1lbnVdKTtcbiAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICByZXN1bHQgPSBhbGxNZW51cztcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlclByb2ZpbGUgPSAoKHJlZjEgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pKSAhPSBudWxsID8gcmVmMS5wcm9maWxlIDogdm9pZCAwKSB8fCAndXNlcic7XG4gICAgICBjdXJyZW50UHNldE5hbWVzID0gcHNldHMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4ubmFtZTtcbiAgICAgIH0pO1xuICAgICAgbWVudXMgPSBhbGxNZW51cy5maWx0ZXIoZnVuY3Rpb24obWVudSkge1xuICAgICAgICB2YXIgcHNldHNNZW51O1xuICAgICAgICBwc2V0c01lbnUgPSBtZW51LnBlcm1pc3Npb25fc2V0cztcbiAgICAgICAgaWYgKHBzZXRzTWVudSAmJiBwc2V0c01lbnUuaW5kZXhPZih1c2VyUHJvZmlsZSkgPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfLmludGVyc2VjdGlvbihjdXJyZW50UHNldE5hbWVzLCBwc2V0c01lbnUpLmxlbmd0aDtcbiAgICAgIH0pO1xuICAgICAgcmVzdWx0ID0gbWVudXM7XG4gICAgfVxuICAgIHJldHVybiBfLnNvcnRCeShyZXN1bHQsIFwic29ydFwiKTtcbiAgfTtcbiAgZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCA9IGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkKSB7XG4gICAgaWYgKF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBfLmZpbmQocGVybWlzc2lvbl9vYmplY3RzLCBmdW5jdGlvbihwbykge1xuICAgICAgICByZXR1cm4gcG8ub2JqZWN0X25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICBwZXJtaXNzaW9uX3NldF9pZDogcGVybWlzc2lvbl9zZXRfaWRcbiAgICB9KTtcbiAgfTtcbiAgZmluZF9wZXJtaXNzaW9uX29iamVjdCA9IGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkcykge1xuICAgIGlmIChfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gXy5maWx0ZXIocGVybWlzc2lvbl9vYmplY3RzLCBmdW5jdGlvbihwbykge1xuICAgICAgICByZXR1cm4gcG8ub2JqZWN0X25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICBwZXJtaXNzaW9uX3NldF9pZDoge1xuICAgICAgICAkaW46IHBlcm1pc3Npb25fc2V0X2lkc1xuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gIH07XG4gIHVuaW9uUGVybWlzc2lvbk9iamVjdHMgPSBmdW5jdGlvbihwb3MsIG9iamVjdCwgcHNldHMpIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIHJlc3VsdCA9IFtdO1xuICAgIF8uZWFjaChvYmplY3QucGVybWlzc2lvbl9zZXQsIGZ1bmN0aW9uKG9wcywgb3BzX2tleSkge1xuICAgICAgdmFyIGN1cnJlbnRQc2V0LCB0ZW1wT3BzO1xuICAgICAgaWYgKFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCJdLmluZGV4T2Yob3BzX2tleSkgPCAwKSB7XG4gICAgICAgIGN1cnJlbnRQc2V0ID0gcHNldHMuZmluZChmdW5jdGlvbihwc2V0KSB7XG4gICAgICAgICAgcmV0dXJuIHBzZXQubmFtZSA9PT0gb3BzX2tleTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjdXJyZW50UHNldCkge1xuICAgICAgICAgIHRlbXBPcHMgPSBfLmNsb25lKG9wcykgfHwge307XG4gICAgICAgICAgdGVtcE9wcy5wZXJtaXNzaW9uX3NldF9pZCA9IGN1cnJlbnRQc2V0Ll9pZDtcbiAgICAgICAgICB0ZW1wT3BzLm9iamVjdF9uYW1lID0gb2JqZWN0Lm9iamVjdF9uYW1lO1xuICAgICAgICAgIHJldHVybiByZXN1bHQucHVzaCh0ZW1wT3BzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChyZXN1bHQubGVuZ3RoKSB7XG4gICAgICBwb3MuZm9yRWFjaChmdW5jdGlvbihwbykge1xuICAgICAgICB2YXIgcmVwZWF0SW5kZXgsIHJlcGVhdFBvO1xuICAgICAgICByZXBlYXRJbmRleCA9IDA7XG4gICAgICAgIHJlcGVhdFBvID0gcmVzdWx0LmZpbmQoZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICByZXBlYXRJbmRleCA9IGluZGV4O1xuICAgICAgICAgIHJldHVybiBpdGVtLnBlcm1pc3Npb25fc2V0X2lkID09PSBwby5wZXJtaXNzaW9uX3NldF9pZDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyZXBlYXRQbykge1xuICAgICAgICAgIHJldHVybiByZXN1bHRbcmVwZWF0SW5kZXhdID0gcG87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKHBvKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcG9zO1xuICAgIH1cbiAgfTtcbiAgQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgaXNTcGFjZUFkbWluLCBvYmplY3QsIG9wc2V0QWRtaW4sIG9wc2V0Q3VzdG9tZXIsIG9wc2V0R3Vlc3QsIG9wc2V0TWVtYmVyLCBvcHNldFN1cHBsaWVyLCBvcHNldFVzZXIsIHBlcm1pc3Npb25zLCBwb3MsIHBvc0FkbWluLCBwb3NDdXN0b21lciwgcG9zR3Vlc3QsIHBvc01lbWJlciwgcG9zU3VwcGxpZXIsIHBvc1VzZXIsIHByb2YsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0FkbWluX3BvcywgcHNldHNDdXJyZW50X3BvcywgcHNldHNDdXN0b21lciwgcHNldHNDdXN0b21lcl9wb3MsIHBzZXRzR3Vlc3QsIHBzZXRzR3Vlc3RfcG9zLCBwc2V0c01lbWJlciwgcHNldHNNZW1iZXJfcG9zLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1N1cHBsaWVyX3BvcywgcHNldHNVc2VyLCBwc2V0c1VzZXJfcG9zLCBzZXRfaWRzLCBzcGFjZVVzZXI7XG4gICAgcGVybWlzc2lvbnMgPSB7fTtcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk7XG4gICAgaWYgKHNwYWNlSWQgPT09ICdndWVzdCcgfHwgb2JqZWN0X25hbWUgPT09IFwidXNlcnNcIikge1xuICAgICAgcGVybWlzc2lvbnMgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge307XG4gICAgICBDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyhwZXJtaXNzaW9ucyk7XG4gICAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gICAgfVxuICAgIHBzZXRzQWRtaW4gPSBfLmlzTnVsbCh0aGlzLnBzZXRzQWRtaW4pIHx8IHRoaXMucHNldHNBZG1pbiA/IHRoaXMucHNldHNBZG1pbiA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzVXNlciA9IF8uaXNOdWxsKHRoaXMucHNldHNVc2VyKSB8fCB0aGlzLnBzZXRzVXNlciA/IHRoaXMucHNldHNVc2VyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c01lbWJlciA9IF8uaXNOdWxsKHRoaXMucHNldHNNZW1iZXIpIHx8IHRoaXMucHNldHNNZW1iZXIgPyB0aGlzLnBzZXRzTWVtYmVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdtZW1iZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzR3Vlc3QgPSBfLmlzTnVsbCh0aGlzLnBzZXRzR3Vlc3QpIHx8IHRoaXMucHNldHNHdWVzdCA/IHRoaXMucHNldHNHdWVzdCA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnZ3Vlc3QnXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzU3VwcGxpZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzU3VwcGxpZXIpIHx8IHRoaXMucHNldHNTdXBwbGllciA/IHRoaXMucHNldHNTdXBwbGllciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnc3VwcGxpZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzQ3VzdG9tZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzQ3VzdG9tZXIpIHx8IHRoaXMucHNldHNDdXN0b21lciA/IHRoaXMucHNldHNDdXN0b21lciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnY3VzdG9tZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICB1c2VyczogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICBuYW1lOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcHNldHNBZG1pbl9wb3MgPSB0aGlzLnBzZXRzQWRtaW5fcG9zO1xuICAgIHBzZXRzVXNlcl9wb3MgPSB0aGlzLnBzZXRzVXNlcl9wb3M7XG4gICAgcHNldHNNZW1iZXJfcG9zID0gdGhpcy5wc2V0c01lbWJlcl9wb3M7XG4gICAgcHNldHNHdWVzdF9wb3MgPSB0aGlzLnBzZXRzR3Vlc3RfcG9zO1xuICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gdGhpcy5wc2V0c1N1cHBsaWVyX3BvcztcbiAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IHRoaXMucHNldHNDdXN0b21lcl9wb3M7XG4gICAgcHNldHNDdXJyZW50X3BvcyA9IHRoaXMucHNldHNDdXJyZW50X3BvcztcbiAgICBvcHNldEFkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuYWRtaW4pIHx8IHt9O1xuICAgIG9wc2V0VXNlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnVzZXIpIHx8IHt9O1xuICAgIG9wc2V0TWVtYmVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQubWVtYmVyKSB8fCB7fTtcbiAgICBvcHNldEd1ZXN0ID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9O1xuICAgIG9wc2V0U3VwcGxpZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5zdXBwbGllcikgfHwge307XG4gICAgb3BzZXRDdXN0b21lciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmN1c3RvbWVyKSB8fCB7fTtcbiAgICBpZiAocHNldHNBZG1pbikge1xuICAgICAgcG9zQWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNBZG1pbi5faWQpO1xuICAgICAgaWYgKHBvc0FkbWluKSB7XG4gICAgICAgIG9wc2V0QWRtaW4uYWxsb3dDcmVhdGUgPSBwb3NBZG1pbi5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRBZG1pbi5hbGxvd0RlbGV0ZSA9IHBvc0FkbWluLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldEFkbWluLmFsbG93RWRpdCA9IHBvc0FkbWluLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRBZG1pbi5hbGxvd1JlYWQgPSBwb3NBZG1pbi5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0QWRtaW4ubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0FkbWluLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0QWRtaW4udmlld0FsbFJlY29yZHMgPSBwb3NBZG1pbi52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRBZG1pbi5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0FkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEFkbWluLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0FkbWluLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zQWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRBZG1pbi5kaXNhYmxlZF9hY3Rpb25zID0gcG9zQWRtaW4uZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRBZG1pbi51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0FkbWluLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEFkbWluLnVuZWRpdGFibGVfZmllbGRzID0gcG9zQWRtaW4udW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0QWRtaW4udW5yZWxhdGVkX29iamVjdHMgPSBwb3NBZG1pbi51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgICAgb3BzZXRBZG1pbi51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc0FkbWluLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNVc2VyKSB7XG4gICAgICBwb3NVc2VyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1VzZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNVc2VyLl9pZCk7XG4gICAgICBpZiAocG9zVXNlcikge1xuICAgICAgICBvcHNldFVzZXIuYWxsb3dDcmVhdGUgPSBwb3NVc2VyLmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldFVzZXIuYWxsb3dEZWxldGUgPSBwb3NVc2VyLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldFVzZXIuYWxsb3dFZGl0ID0gcG9zVXNlci5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0VXNlci5hbGxvd1JlYWQgPSBwb3NVc2VyLmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRVc2VyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NVc2VyLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0VXNlci52aWV3QWxsUmVjb3JkcyA9IHBvc1VzZXIudmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0VXNlci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0VXNlci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NVc2VyLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRVc2VyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NVc2VyLmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0VXNlci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zVXNlci5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldFVzZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NVc2VyLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldFVzZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NVc2VyLnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldFVzZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NVc2VyLnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgICBvcHNldFVzZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NVc2VyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNNZW1iZXIpIHtcbiAgICAgIHBvc01lbWJlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNNZW1iZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNNZW1iZXIuX2lkKTtcbiAgICAgIGlmIChwb3NNZW1iZXIpIHtcbiAgICAgICAgb3BzZXRNZW1iZXIuYWxsb3dDcmVhdGUgPSBwb3NNZW1iZXIuYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0TWVtYmVyLmFsbG93RGVsZXRlID0gcG9zTWVtYmVyLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldE1lbWJlci5hbGxvd0VkaXQgPSBwb3NNZW1iZXIuYWxsb3dFZGl0O1xuICAgICAgICBvcHNldE1lbWJlci5hbGxvd1JlYWQgPSBwb3NNZW1iZXIuYWxsb3dSZWFkO1xuICAgICAgICBvcHNldE1lbWJlci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zTWVtYmVyLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnZpZXdBbGxSZWNvcmRzID0gcG9zTWVtYmVyLnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldE1lbWJlci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc01lbWJlci5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRNZW1iZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zTWVtYmVyLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRNZW1iZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc01lbWJlci5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldE1lbWJlci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zTWVtYmVyLmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnVucmVhZGFibGVfZmllbGRzID0gcG9zTWVtYmVyLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldE1lbWJlci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc01lbWJlci51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRNZW1iZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NNZW1iZXIudW5yZWxhdGVkX29iamVjdHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zTWVtYmVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNHdWVzdCkge1xuICAgICAgcG9zR3Vlc3QgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzR3Vlc3RfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNHdWVzdC5faWQpO1xuICAgICAgaWYgKHBvc0d1ZXN0KSB7XG4gICAgICAgIG9wc2V0R3Vlc3QuYWxsb3dDcmVhdGUgPSBwb3NHdWVzdC5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRHdWVzdC5hbGxvd0RlbGV0ZSA9IHBvc0d1ZXN0LmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldEd1ZXN0LmFsbG93RWRpdCA9IHBvc0d1ZXN0LmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRHdWVzdC5hbGxvd1JlYWQgPSBwb3NHdWVzdC5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0R3Vlc3QubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0d1ZXN0Lm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0R3Vlc3Qudmlld0FsbFJlY29yZHMgPSBwb3NHdWVzdC52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRHdWVzdC5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0d1ZXN0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEd1ZXN0LnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0d1ZXN0LnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRHdWVzdC5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zR3Vlc3QuZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRHdWVzdC5kaXNhYmxlZF9hY3Rpb25zID0gcG9zR3Vlc3QuZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRHdWVzdC51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0d1ZXN0LnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEd1ZXN0LnVuZWRpdGFibGVfZmllbGRzID0gcG9zR3Vlc3QudW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0R3Vlc3QudW5yZWxhdGVkX29iamVjdHMgPSBwb3NHdWVzdC51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgICAgb3BzZXRHdWVzdC51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc0d1ZXN0LnVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNTdXBwbGllcikge1xuICAgICAgcG9zU3VwcGxpZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzU3VwcGxpZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNTdXBwbGllci5faWQpO1xuICAgICAgaWYgKHBvc1N1cHBsaWVyKSB7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIuYWxsb3dDcmVhdGUgPSBwb3NTdXBwbGllci5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRTdXBwbGllci5hbGxvd0RlbGV0ZSA9IHBvc1N1cHBsaWVyLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldFN1cHBsaWVyLmFsbG93RWRpdCA9IHBvc1N1cHBsaWVyLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRTdXBwbGllci5hbGxvd1JlYWQgPSBwb3NTdXBwbGllci5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1N1cHBsaWVyLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIudmlld0FsbFJlY29yZHMgPSBwb3NTdXBwbGllci52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRTdXBwbGllci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc1N1cHBsaWVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldFN1cHBsaWVyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1N1cHBsaWVyLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRTdXBwbGllci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zU3VwcGxpZXIuZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRTdXBwbGllci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zU3VwcGxpZXIuZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRTdXBwbGllci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1N1cHBsaWVyLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldFN1cHBsaWVyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zU3VwcGxpZXIudW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NTdXBwbGllci51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgICAgb3BzZXRTdXBwbGllci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc1N1cHBsaWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNDdXN0b21lcikge1xuICAgICAgcG9zQ3VzdG9tZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VzdG9tZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNDdXN0b21lci5faWQpO1xuICAgICAgaWYgKHBvc0N1c3RvbWVyKSB7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIuYWxsb3dDcmVhdGUgPSBwb3NDdXN0b21lci5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRDdXN0b21lci5hbGxvd0RlbGV0ZSA9IHBvc0N1c3RvbWVyLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldEN1c3RvbWVyLmFsbG93RWRpdCA9IHBvc0N1c3RvbWVyLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRDdXN0b21lci5hbGxvd1JlYWQgPSBwb3NDdXN0b21lci5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0N1c3RvbWVyLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIudmlld0FsbFJlY29yZHMgPSBwb3NDdXN0b21lci52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRDdXN0b21lci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0N1c3RvbWVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEN1c3RvbWVyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0N1c3RvbWVyLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRDdXN0b21lci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zQ3VzdG9tZXIuZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRDdXN0b21lci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zQ3VzdG9tZXIuZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRDdXN0b21lci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0N1c3RvbWVyLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEN1c3RvbWVyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zQ3VzdG9tZXIudW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NDdXN0b21lci51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgICAgb3BzZXRDdXN0b21lci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc0N1c3RvbWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEFkbWluO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRBZG1pbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzcGFjZUlkID09PSAnY29tbW9uJykge1xuICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYWNlVXNlciA9IF8uaXNOdWxsKHRoaXMuc3BhY2VVc2VyKSB8fCB0aGlzLnNwYWNlVXNlciA/IHRoaXMuc3BhY2VVc2VyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHNwYWNlVXNlcikge1xuICAgICAgICAgICAgcHJvZiA9IHNwYWNlVXNlci5wcm9maWxlO1xuICAgICAgICAgICAgaWYgKHByb2YpIHtcbiAgICAgICAgICAgICAgaWYgKHByb2YgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdtZW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldE1lbWJlcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnZ3Vlc3QnKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0O1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdzdXBwbGllcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0U3VwcGxpZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRDdXN0b21lcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHNldF9pZHMgPSBfLnBsdWNrKHBzZXRzLCBcIl9pZFwiKTtcbiAgICAgIHBvcyA9IGZpbmRfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXJyZW50X3Bvcywgb2JqZWN0X25hbWUsIHNldF9pZHMpO1xuICAgICAgcG9zID0gdW5pb25QZXJtaXNzaW9uT2JqZWN0cyhwb3MsIG9iamVjdCwgcHNldHMpO1xuICAgICAgXy5lYWNoKHBvcywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgaWYgKHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNBZG1pbiAhPSBudWxsID8gcHNldHNBZG1pbi5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNVc2VyICE9IG51bGwgPyBwc2V0c1VzZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzTWVtYmVyICE9IG51bGwgPyBwc2V0c01lbWJlci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNHdWVzdCAhPSBudWxsID8gcHNldHNHdWVzdC5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNTdXBwbGllciAhPSBudWxsID8gcHNldHNTdXBwbGllci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNDdXN0b21lciAhPSBudWxsID8gcHNldHNDdXN0b21lci5faWQgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfLmlzRW1wdHkocGVybWlzc2lvbnMpKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMgPSBwbztcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8uYWxsb3dSZWFkKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8uYWxsb3dDcmVhdGUpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLmFsbG93RWRpdCkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLmFsbG93RGVsZXRlKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLnZpZXdBbGxSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8udmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzLCBwby5kaXNhYmxlZF9saXN0X3ZpZXdzKTtcbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgcG8uZGlzYWJsZWRfYWN0aW9ucyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgcG8udW5yZWFkYWJsZV9maWVsZHMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIHBvLnVuZWRpdGFibGVfZmllbGRzKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBwby51bnJlbGF0ZWRfb2JqZWN0cyk7XG4gICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QsIHBvLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAob2JqZWN0LmlzX3ZpZXcpIHtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IFtdO1xuICAgIH1cbiAgICBDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyhwZXJtaXNzaW9ucyk7XG4gICAgaWYgKG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lcikge1xuICAgICAgcGVybWlzc2lvbnMub3duZXIgPSBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXI7XG4gICAgfVxuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfTtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIFwiY3JlYXRvci5vYmplY3RfcGVybWlzc2lvbnNcIjogZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdGhpcy51c2VySWQpO1xuICAgIH1cbiAgfSk7XG59XG4iLCJcclxuc3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJylcclxuXHJcbk1ldGVvci5zdGFydHVwICgpLT5cclxuXHRjcmVhdG9yX2RiX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSTF9DUkVBVE9SXHJcblx0b3Bsb2dfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BMT0dfVVJMX0NSRUFUT1JcclxuXHRpZiBjcmVhdG9yX2RiX3VybFxyXG5cdFx0aWYgIW9wbG9nX3VybFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJQbGVhc2UgY29uZmlndXJlIGVudmlyb25tZW50IHZhcmlhYmxlczogTU9OR09fT1BMT0dfVVJMX0NSRUFUT1JcIilcclxuXHRcdENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSA9IHtfZHJpdmVyOiBuZXcgTW9uZ29JbnRlcm5hbHMuUmVtb3RlQ29sbGVjdGlvbkRyaXZlcihjcmVhdG9yX2RiX3VybCwge29wbG9nVXJsOiBvcGxvZ191cmx9KX1cclxuXHJcbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUgPSAob2JqZWN0KS0+XHJcbiNcdGlmIG9iamVjdC50YWJsZV9uYW1lICYmIG9iamVjdC50YWJsZV9uYW1lLmVuZHNXaXRoKFwiX19jXCIpXHJcbiNcdFx0cmV0dXJuIG9iamVjdC50YWJsZV9uYW1lXHJcbiNcdGVsc2VcclxuI1x0XHRyZXR1cm4gb2JqZWN0Lm5hbWVcclxuXHRyZXR1cm4gb2JqZWN0Lm5hbWVcclxuQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uID0gKG9iamVjdCktPlxyXG5cdGNvbGxlY3Rpb25fa2V5ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmplY3QpXHJcblx0aWYgZGJbY29sbGVjdGlvbl9rZXldXHJcblx0XHRyZXR1cm4gZGJbY29sbGVjdGlvbl9rZXldXHJcblx0ZWxzZSBpZiBvYmplY3QuZGJcclxuXHRcdHJldHVybiBvYmplY3QuZGJcclxuXHJcblx0aWYgQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV1cclxuXHRcdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XVxyXG5cdGVsc2VcclxuXHRcdGlmIG9iamVjdC5jdXN0b21cclxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXksIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSlcclxuXHRcdGVsc2VcclxuXHRcdFx0aWYgY29sbGVjdGlvbl9rZXkgPT0gJ19zbXNfcXVldWUnICYmIFNNU1F1ZXVlPy5jb2xsZWN0aW9uXHJcblx0XHRcdFx0cmV0dXJuIFNNU1F1ZXVlLmNvbGxlY3Rpb25cclxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXkpXHJcblxyXG5cclxuIiwidmFyIHN0ZWVkb3NDb3JlO1xuXG5zdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBjcmVhdG9yX2RiX3VybCwgb3Bsb2dfdXJsO1xuICBjcmVhdG9yX2RiX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSTF9DUkVBVE9SO1xuICBvcGxvZ191cmwgPSBwcm9jZXNzLmVudi5NT05HT19PUExPR19VUkxfQ1JFQVRPUjtcbiAgaWYgKGNyZWF0b3JfZGJfdXJsKSB7XG4gICAgaWYgKCFvcGxvZ191cmwpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIlBsZWFzZSBjb25maWd1cmUgZW52aXJvbm1lbnQgdmFyaWFibGVzOiBNT05HT19PUExPR19VUkxfQ1JFQVRPUlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSA9IHtcbiAgICAgIF9kcml2ZXI6IG5ldyBNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyKGNyZWF0b3JfZGJfdXJsLCB7XG4gICAgICAgIG9wbG9nVXJsOiBvcGxvZ191cmxcbiAgICAgIH0pXG4gICAgfTtcbiAgfVxufSk7XG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIG9iamVjdC5uYW1lO1xufTtcblxuQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBjb2xsZWN0aW9uX2tleTtcbiAgY29sbGVjdGlvbl9rZXkgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iamVjdCk7XG4gIGlmIChkYltjb2xsZWN0aW9uX2tleV0pIHtcbiAgICByZXR1cm4gZGJbY29sbGVjdGlvbl9rZXldO1xuICB9IGVsc2UgaWYgKG9iamVjdC5kYikge1xuICAgIHJldHVybiBvYmplY3QuZGI7XG4gIH1cbiAgaWYgKENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3QuY3VzdG9tKSB7XG4gICAgICByZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSwgQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNvbGxlY3Rpb25fa2V5ID09PSAnX3Ntc19xdWV1ZScgJiYgKHR5cGVvZiBTTVNRdWV1ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBTTVNRdWV1ZSAhPT0gbnVsbCA/IFNNU1F1ZXVlLmNvbGxlY3Rpb24gOiB2b2lkIDApKSB7XG4gICAgICAgIHJldHVybiBTTVNRdWV1ZS5jb2xsZWN0aW9uO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXkpO1xuICAgIH1cbiAgfVxufTtcbiIsIkNyZWF0b3IuYWN0aW9uc0J5TmFtZSA9IHt9XHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHJcblx0IyDlrprkuYnlhajlsYAgYWN0aW9ucyDlh73mlbBcdFxyXG5cdENyZWF0b3IuYWN0aW9ucyA9IChhY3Rpb25zKS0+XHJcblx0XHRfLmVhY2ggYWN0aW9ucywgKHRvZG8sIGFjdGlvbl9uYW1lKS0+XHJcblx0XHRcdENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb25fbmFtZV0gPSB0b2RvIFxyXG5cclxuXHRDcmVhdG9yLmV4ZWN1dGVBY3Rpb24gPSAob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkKS0+XHJcblx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRcdGlmIGFjdGlvbj8udG9kb1xyXG5cdFx0XHRpZiB0eXBlb2YgYWN0aW9uLnRvZG8gPT0gXCJzdHJpbmdcIlxyXG5cdFx0XHRcdHRvZG8gPSBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uLnRvZG9dXHJcblx0XHRcdGVsc2UgaWYgdHlwZW9mIGFjdGlvbi50b2RvID09IFwiZnVuY3Rpb25cIlxyXG5cdFx0XHRcdHRvZG8gPSBhY3Rpb24udG9kb1x0XHJcblx0XHRcdGlmICFyZWNvcmQgJiYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkXHJcblx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcclxuXHRcdFx0aWYgdG9kb1xyXG5cdFx0XHRcdCMgaXRlbV9lbGVtZW505Li656m65pe25bqU6K+l6K6+572u6buY6K6k5YC877yI5a+56LGh55qEbmFtZeWtl+aute+8ie+8jOWQpuWImW1vcmVBcmdz5ou/5Yiw55qE5ZCO57ut5Y+C5pWw5L2N572u5bCx5LiN5a+5XHJcblx0XHRcdFx0aXRlbV9lbGVtZW50ID0gaWYgaXRlbV9lbGVtZW50IHRoZW4gaXRlbV9lbGVtZW50IGVsc2UgXCJcIlxyXG5cdFx0XHRcdG1vcmVBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKVxyXG5cdFx0XHRcdHRvZG9BcmdzID0gW29iamVjdF9uYW1lLCByZWNvcmRfaWRdLmNvbmNhdChtb3JlQXJncylcclxuXHRcdFx0XHR0b2RvLmFwcGx5IHtcclxuXHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxyXG5cdFx0XHRcdFx0cmVjb3JkX2lkOiByZWNvcmRfaWRcclxuXHRcdFx0XHRcdG9iamVjdDogb2JqXHJcblx0XHRcdFx0XHRhY3Rpb246IGFjdGlvblxyXG5cdFx0XHRcdFx0aXRlbV9lbGVtZW50OiBpdGVtX2VsZW1lbnRcclxuXHRcdFx0XHRcdHJlY29yZDogcmVjb3JkXHJcblx0XHRcdFx0fSwgdG9kb0FyZ3NcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHRvYXN0ci53YXJuaW5nKHQoXCJfb2JqZWN0X2FjdGlvbnNfbm9uZV90b2RvXCIpKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSlcclxuXHJcblx0XHRcdFx0XHJcblxyXG5cdENyZWF0b3IuYWN0aW9ucyBcclxuXHRcdCMg5Zyo5q2k5a6a5LmJ5YWo5bGAIGFjdGlvbnNcclxuXHRcdFwic3RhbmRhcmRfcXVlcnlcIjogKCktPlxyXG5cdFx0XHRNb2RhbC5zaG93KFwic3RhbmRhcmRfcXVlcnlfbW9kYWxcIilcclxuXHJcblx0XHRcInN0YW5kYXJkX25ld1wiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XHJcblx0XHRcdGlkcyA9IENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzW29iamVjdF9uYW1lXVxyXG5cdFx0XHRpZiBpZHM/Lmxlbmd0aFxyXG5cdFx0XHRcdCMg5YiX6KGo5pyJ6YCJ5Lit6aG55pe277yM5Y+W56ys5LiA5Liq6YCJ5Lit6aG577yM5aSN5Yi25YW25YaF5a655Yiw5paw5bu656qX5Y+j5LitXHJcblx0XHRcdFx0IyDov5nnmoTnrKzkuIDkuKrmjIfnmoTmmK/nrKzkuIDmrKHli77pgInnmoTpgInkuK3pobnvvIzogIzkuI3mmK/liJfooajkuK3lt7Lli77pgInnmoTnrKzkuIDpoblcclxuXHRcdFx0XHRyZWNvcmRfaWQgPSBpZHNbMF1cclxuXHRcdFx0XHRkb2MgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxyXG5cdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIGRvY1xyXG5cdFx0XHRcdCMg4oCc5L+d5a2Y5bm25paw5bu64oCd5pON5L2c5Lit6Ieq5Yqo5omT5byA55qE5paw56qX5Y+j5Lit6ZyA6KaB5YaN5qyh5aSN5Yi25pyA5paw55qEZG9j5YaF5a655Yiw5paw56qX5Y+j5LitXHJcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWVcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIEZvcm1NYW5hZ2VyLmdldEluaXRpYWxWYWx1ZXMob2JqZWN0X25hbWUpXHJcblx0XHRcdE1ldGVvci5kZWZlciAoKS0+XHJcblx0XHRcdFx0JChcIi5jcmVhdG9yLWFkZFwiKS5jbGljaygpXHJcblx0XHRcdHJldHVybiBcclxuXHJcblx0XHRcInN0YW5kYXJkX29wZW5fdmlld1wiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XHJcblx0XHRcdGhyZWYgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxyXG5cdFx0XHRGbG93Um91dGVyLnJlZGlyZWN0KGhyZWYpXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHRcdFwic3RhbmRhcmRfZWRpdFwiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XHJcblx0XHRcdGlmIHJlY29yZF9pZFxyXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBmYWxzZVxyXG4jXHRcdFx0XHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXHJcbiNcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgcmVjb3JkXHJcbiNcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ3JlbG9hZF9keGxpc3QnLCBmYWxzZVxyXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lXHJcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZFxyXG5cdFx0XHRcdFx0aWYgdGhpcy5yZWNvcmRcclxuXHRcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgdGhpcy5yZWNvcmRcclxuXHRcdFx0XHRcdE1ldGVvci5kZWZlciAoKS0+XHJcblx0XHRcdFx0XHRcdCQoXCIuYnRuLWVkaXQtcmVjb3JkXCIpLmNsaWNrKClcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcclxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkXHJcblx0XHRcdFx0XHRpZiB0aGlzLnJlY29yZFxyXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxyXG5cdFx0XHRcdFx0XHRNZXRlb3IuZGVmZXIgKCktPlxyXG5cdFx0XHRcdFx0XHRcdCQoXCIuYnRuLmNyZWF0b3ItZWRpdFwiKS5jbGljaygpXHJcblxyXG5cdFx0XCJzdGFuZGFyZF9kZWxldGVcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjayktPlxyXG5cdFx0XHRjb25zb2xlLmxvZyhcInN0YW5kYXJkX2RlbGV0ZVwiLCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZClcclxuXHRcdFx0YmVmb3JlSG9vayA9IEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYmVmb3JlJywge19pZDogcmVjb3JkX2lkfSlcclxuXHRcdFx0aWYgIWJlZm9yZUhvb2tcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cclxuXHRcdFx0aWYoIV8uaXNTdHJpbmcocmVjb3JkX3RpdGxlKSAmJiByZWNvcmRfdGl0bGU/Lm5hbWUpXHJcblx0XHRcdFx0cmVjb3JkX3RpdGxlID0gcmVjb3JkX3RpdGxlPy5uYW1lXHJcblxyXG5cdFx0XHRpZiByZWNvcmRfdGl0bGVcclxuXHRcdFx0XHR0ZXh0ID0gdCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIiwgXCIje29iamVjdC5sYWJlbH0gXFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIlxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGV4dCA9IHQgXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90ZXh0XCIsIFwiI3tvYmplY3QubGFiZWx9XCJcclxuXHRcdFx0c3dhbFxyXG5cdFx0XHRcdHRpdGxlOiB0IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGl0bGVcIiwgXCIje29iamVjdC5sYWJlbH1cIlxyXG5cdFx0XHRcdHRleHQ6IFwiPGRpdiBjbGFzcz0nZGVsZXRlLWNyZWF0b3Itd2FybmluZyc+I3t0ZXh0fTwvZGl2PlwiXHJcblx0XHRcdFx0aHRtbDogdHJ1ZVxyXG5cdFx0XHRcdHNob3dDYW5jZWxCdXR0b246dHJ1ZVxyXG5cdFx0XHRcdGNvbmZpcm1CdXR0b25UZXh0OiB0KCdEZWxldGUnKVxyXG5cdFx0XHRcdGNhbmNlbEJ1dHRvblRleHQ6IHQoJ0NhbmNlbCcpXHJcblx0XHRcdFx0KG9wdGlvbikgLT5cclxuXHRcdFx0XHRcdGlmIG9wdGlvblxyXG5cdFx0XHRcdFx0XHRwcmV2aW91c0RvYyA9IEZvcm1NYW5hZ2VyLmdldFByZXZpb3VzRG9jKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsICdkZWxldGUnKVxyXG5cdFx0XHRcdFx0XHRDcmVhdG9yLm9kYXRhLmRlbGV0ZSBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCAoKS0+XHJcblx0XHRcdFx0XHRcdFx0aWYgcmVjb3JkX3RpdGxlXHJcblx0XHRcdFx0XHRcdFx0XHQjIGluZm8gPSBvYmplY3QubGFiZWwgKyBcIlxcXCIje3JlY29yZF90aXRsZX1cXFwiXCIgKyBcIuW3suWIoOmZpFwiXHJcblx0XHRcdFx0XHRcdFx0XHRpbmZvID10IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGl0bGVfc3VjXCIsIG9iamVjdC5sYWJlbCArIFwiXFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIlxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGluZm8gPSB0KCdjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF9zdWMnKVxyXG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzIGluZm9cclxuXHRcdFx0XHRcdFx0XHQjIOaWh+S7tueJiOacrOS4ulwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIu+8jOmcgOimgeabv+aNouS4ulwiY2ZzLWZpbGVzLWZpbGVyZWNvcmRcIlxyXG5cdFx0XHRcdFx0XHRcdGdyaWRPYmplY3ROYW1lQ2xhc3MgPSBvYmplY3RfbmFtZS5yZXBsYWNlKC9cXC4vZyxcIi1cIilcclxuXHRcdFx0XHRcdFx0XHRncmlkQ29udGFpbmVyID0gJChcIi5ncmlkQ29udGFpbmVyLiN7Z3JpZE9iamVjdE5hbWVDbGFzc31cIilcclxuXHRcdFx0XHRcdFx0XHR1bmxlc3MgZ3JpZENvbnRhaW5lcj8ubGVuZ3RoXHJcblx0XHRcdFx0XHRcdFx0XHRpZiB3aW5kb3cub3BlbmVyXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlzT3BlbmVyUmVtb3ZlID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRncmlkQ29udGFpbmVyID0gd2luZG93Lm9wZW5lci4kKFwiLmdyaWRDb250YWluZXIuI3tncmlkT2JqZWN0TmFtZUNsYXNzfVwiKVxyXG5cdFx0XHRcdFx0XHRcdGlmIGdyaWRDb250YWluZXI/Lmxlbmd0aFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV90cmVlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhUcmVlTGlzdCgpLmR4VHJlZUxpc3QoJ2luc3RhbmNlJylcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keERhdGFHcmlkKCkuZHhEYXRhR3JpZCgnaW5zdGFuY2UnKVxyXG5cdFx0XHRcdFx0XHRcdGlmIGR4RGF0YUdyaWRJbnN0YW5jZVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV90cmVlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZS5yZWZyZXNoKClcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0X25hbWUgIT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIucmVsb2FkKCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRUZW1wbGF0ZS5jcmVhdG9yX2dyaWQucmVmcmVzaChkeERhdGFHcmlkSW5zdGFuY2UpXHJcblx0XHRcdFx0XHRcdFx0cmVjb3JkVXJsID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZClcclxuXHRcdFx0XHRcdFx0XHR0ZW1wTmF2UmVtb3ZlZCA9IENyZWF0b3IucmVtb3ZlVGVtcE5hdkl0ZW0ob2JqZWN0X25hbWUsIHJlY29yZFVybCkgI+aXoOiuuuaYr+WcqOiusOW9leivpue7hueVjOmdoui/mOaYr+WIl+ihqOeVjOmdouaJp+ihjOWIoOmZpOaTjeS9nO+8jOmDveS8muaKiuS4tOaXtuWvvOiIquWIoOmZpOaOiVxyXG5cdFx0XHRcdFx0XHRcdGlmIGlzT3BlbmVyUmVtb3ZlIG9yICFkeERhdGFHcmlkSW5zdGFuY2VcclxuXHRcdFx0XHRcdFx0XHRcdGlmIGlzT3BlbmVyUmVtb3ZlXHJcblx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5jbG9zZSgpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIHJlY29yZF9pZCA9PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSBhbmQgbGlzdF92aWV3X2lkICE9ICdjYWxlbmRhcidcclxuXHRcdFx0XHRcdFx0XHRcdFx0YXBwaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR1bmxlc3MgbGlzdF92aWV3X2lkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcclxuXHRcdFx0XHRcdFx0XHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxpc3Rfdmlld19pZCA9IFwiYWxsXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0dW5sZXNzIHRlbXBOYXZSZW1vdmVkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpznoa7lrp7liKDpmaTkuobkuLTml7blr7zoiKrvvIzlsLHlj6/og73lt7Lnu4/ph43lrprlkJHliLDkuIrkuIDkuKrpobXpnaLkuobvvIzmsqHlv4XopoHlho3ph43lrprlkJHkuIDmrKFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLmdvIFwiL2FwcC8je2FwcGlkfS8je29iamVjdF9uYW1lfS9ncmlkLyN7bGlzdF92aWV3X2lkfVwiXHJcblx0XHRcdFx0XHRcdFx0aWYgY2FsbF9iYWNrIGFuZCB0eXBlb2YgY2FsbF9iYWNrID09IFwiZnVuY3Rpb25cIlxyXG5cdFx0XHRcdFx0XHRcdFx0Y2FsbF9iYWNrKClcclxuXHJcblx0XHRcdFx0XHRcdFx0Rm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdhZnRlcicsIHtfaWQ6IHJlY29yZF9pZCwgcHJldmlvdXNEb2M6IHByZXZpb3VzRG9jfSlcclxuXHRcdFx0XHRcdFx0LCAoZXJyb3IpLT5cclxuXHRcdFx0XHRcdFx0XHRGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2Vycm9yJywge19pZDogcmVjb3JkX2lkLCBlcnJvcjogZXJyb3J9KSIsIkNyZWF0b3IuYWN0aW9uc0J5TmFtZSA9IHt9O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIENyZWF0b3IuYWN0aW9ucyA9IGZ1bmN0aW9uKGFjdGlvbnMpIHtcbiAgICByZXR1cm4gXy5lYWNoKGFjdGlvbnMsIGZ1bmN0aW9uKHRvZG8sIGFjdGlvbl9uYW1lKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbl9uYW1lXSA9IHRvZG87XG4gICAgfSk7XG4gIH07XG4gIENyZWF0b3IuZXhlY3V0ZUFjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhY3Rpb24sIHJlY29yZF9pZCwgaXRlbV9lbGVtZW50LCBsaXN0X3ZpZXdfaWQsIHJlY29yZCkge1xuICAgIHZhciBtb3JlQXJncywgb2JqLCB0b2RvLCB0b2RvQXJncztcbiAgICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnRvZG8gOiB2b2lkIDApIHtcbiAgICAgIGlmICh0eXBlb2YgYWN0aW9uLnRvZG8gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdG9kbyA9IENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb24udG9kb107XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhY3Rpb24udG9kbyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRvZG8gPSBhY3Rpb24udG9kbztcbiAgICAgIH1cbiAgICAgIGlmICghcmVjb3JkICYmIG9iamVjdF9uYW1lICYmIHJlY29yZF9pZCkge1xuICAgICAgICByZWNvcmQgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgIH1cbiAgICAgIGlmICh0b2RvKSB7XG4gICAgICAgIGl0ZW1fZWxlbWVudCA9IGl0ZW1fZWxlbWVudCA/IGl0ZW1fZWxlbWVudCA6IFwiXCI7XG4gICAgICAgIG1vcmVBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKTtcbiAgICAgICAgdG9kb0FyZ3MgPSBbb2JqZWN0X25hbWUsIHJlY29yZF9pZF0uY29uY2F0KG1vcmVBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRvZG8uYXBwbHkoe1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICByZWNvcmRfaWQ6IHJlY29yZF9pZCxcbiAgICAgICAgICBvYmplY3Q6IG9iaixcbiAgICAgICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgICAgICBpdGVtX2VsZW1lbnQ6IGl0ZW1fZWxlbWVudCxcbiAgICAgICAgICByZWNvcmQ6IHJlY29yZFxuICAgICAgICB9LCB0b2RvQXJncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpO1xuICAgIH1cbiAgfTtcbiAgQ3JlYXRvci5hY3Rpb25zKHtcbiAgICBcInN0YW5kYXJkX3F1ZXJ5XCI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIE1vZGFsLnNob3coXCJzdGFuZGFyZF9xdWVyeV9tb2RhbFwiKTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfbmV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGRvYywgaWRzO1xuICAgICAgaWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbb2JqZWN0X25hbWVdO1xuICAgICAgaWYgKGlkcyAhPSBudWxsID8gaWRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICByZWNvcmRfaWQgPSBpZHNbMF07XG4gICAgICAgIGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBkb2MpO1xuICAgICAgICBTZXNzaW9uLnNldCgnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBGb3JtTWFuYWdlci5nZXRJbml0aWFsVmFsdWVzKG9iamVjdF9uYW1lKSk7XG4gICAgICB9XG4gICAgICBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGhyZWY7XG4gICAgICBocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICBGbG93Um91dGVyLnJlZGlyZWN0KGhyZWYpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9lZGl0XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIGZhbHNlKSB7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZCk7XG4gICAgICAgICAgaWYgKHRoaXMucmVjb3JkKSB7XG4gICAgICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCB0aGlzLnJlY29yZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIi5idG4tZWRpdC1yZWNvcmRcIikuY2xpY2soKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIHRoaXMucmVjb3JkKTtcbiAgICAgICAgICAgIHJldHVybiBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiAkKFwiLmJ0bi5jcmVhdG9yLWVkaXRcIikuY2xpY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9kZWxldGVcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrKSB7XG4gICAgICB2YXIgYmVmb3JlSG9vaywgb2JqZWN0LCB0ZXh0O1xuICAgICAgY29uc29sZS5sb2coXCJzdGFuZGFyZF9kZWxldGVcIiwgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQpO1xuICAgICAgYmVmb3JlSG9vayA9IEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYmVmb3JlJywge1xuICAgICAgICBfaWQ6IHJlY29yZF9pZFxuICAgICAgfSk7XG4gICAgICBpZiAoIWJlZm9yZUhvb2spIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgICAgaWYgKCFfLmlzU3RyaW5nKHJlY29yZF90aXRsZSkgJiYgKHJlY29yZF90aXRsZSAhPSBudWxsID8gcmVjb3JkX3RpdGxlLm5hbWUgOiB2b2lkIDApKSB7XG4gICAgICAgIHJlY29yZF90aXRsZSA9IHJlY29yZF90aXRsZSAhPSBudWxsID8gcmVjb3JkX3RpdGxlLm5hbWUgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgICBpZiAocmVjb3JkX3RpdGxlKSB7XG4gICAgICAgIHRleHQgPSB0KFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGV4dFwiLCBvYmplY3QubGFiZWwgKyBcIiBcXFwiXCIgKyByZWNvcmRfdGl0bGUgKyBcIlxcXCJcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0ID0gdChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIiwgXCJcIiArIG9iamVjdC5sYWJlbCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3dhbCh7XG4gICAgICAgIHRpdGxlOiB0KFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGl0bGVcIiwgXCJcIiArIG9iamVjdC5sYWJlbCksXG4gICAgICAgIHRleHQ6IFwiPGRpdiBjbGFzcz0nZGVsZXRlLWNyZWF0b3Itd2FybmluZyc+XCIgKyB0ZXh0ICsgXCI8L2Rpdj5cIixcbiAgICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IHQoJ0RlbGV0ZScpLFxuICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiB0KCdDYW5jZWwnKVxuICAgICAgfSwgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHZhciBwcmV2aW91c0RvYztcbiAgICAgICAgaWYgKG9wdGlvbikge1xuICAgICAgICAgIHByZXZpb3VzRG9jID0gRm9ybU1hbmFnZXIuZ2V0UHJldmlvdXNEb2Mob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgJ2RlbGV0ZScpO1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLm9kYXRhW1wiZGVsZXRlXCJdKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGFwcGlkLCBkeERhdGFHcmlkSW5zdGFuY2UsIGdyaWRDb250YWluZXIsIGdyaWRPYmplY3ROYW1lQ2xhc3MsIGluZm8sIGlzT3BlbmVyUmVtb3ZlLCByZWNvcmRVcmwsIHRlbXBOYXZSZW1vdmVkO1xuICAgICAgICAgICAgaWYgKHJlY29yZF90aXRsZSkge1xuICAgICAgICAgICAgICBpbmZvID0gdChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlX3N1Y1wiLCBvYmplY3QubGFiZWwgKyAoXCJcXFwiXCIgKyByZWNvcmRfdGl0bGUgKyBcIlxcXCJcIikpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaW5mbyA9IHQoJ2NyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3N1YycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoaW5mbyk7XG4gICAgICAgICAgICBncmlkT2JqZWN0TmFtZUNsYXNzID0gb2JqZWN0X25hbWUucmVwbGFjZSgvXFwuL2csIFwiLVwiKTtcbiAgICAgICAgICAgIGdyaWRDb250YWluZXIgPSAkKFwiLmdyaWRDb250YWluZXIuXCIgKyBncmlkT2JqZWN0TmFtZUNsYXNzKTtcbiAgICAgICAgICAgIGlmICghKGdyaWRDb250YWluZXIgIT0gbnVsbCA/IGdyaWRDb250YWluZXIubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICBpZiAod2luZG93Lm9wZW5lcikge1xuICAgICAgICAgICAgICAgIGlzT3BlbmVyUmVtb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBncmlkQ29udGFpbmVyID0gd2luZG93Lm9wZW5lci4kKFwiLmdyaWRDb250YWluZXIuXCIgKyBncmlkT2JqZWN0TmFtZUNsYXNzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdyaWRDb250YWluZXIgIT0gbnVsbCA/IGdyaWRDb250YWluZXIubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgICAgICAgIGlmIChvYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4VHJlZUxpc3QoKS5keFRyZWVMaXN0KCdpbnN0YW5jZScpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhEYXRhR3JpZCgpLmR4RGF0YUdyaWQoJ2luc3RhbmNlJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkeERhdGFHcmlkSW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgaWYgKG9iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICAgIGR4RGF0YUdyaWRJbnN0YW5jZS5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdF9uYW1lICE9PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpKSB7XG4gICAgICAgICAgICAgICAgICBGbG93Um91dGVyLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBUZW1wbGF0ZS5jcmVhdG9yX2dyaWQucmVmcmVzaChkeERhdGFHcmlkSW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVjb3JkVXJsID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICAgICAgICB0ZW1wTmF2UmVtb3ZlZCA9IENyZWF0b3IucmVtb3ZlVGVtcE5hdkl0ZW0ob2JqZWN0X25hbWUsIHJlY29yZFVybCk7XG4gICAgICAgICAgICBpZiAoaXNPcGVuZXJSZW1vdmUgfHwgIWR4RGF0YUdyaWRJbnN0YW5jZSkge1xuICAgICAgICAgICAgICBpZiAoaXNPcGVuZXJSZW1vdmUpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZWNvcmRfaWQgPT09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpICYmIGxpc3Rfdmlld19pZCAhPT0gJ2NhbGVuZGFyJykge1xuICAgICAgICAgICAgICAgIGFwcGlkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gICAgICAgICAgICAgICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgICAgICAgICAgICAgIGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgICAgICAgICAgICAgbGlzdF92aWV3X2lkID0gXCJhbGxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCF0ZW1wTmF2UmVtb3ZlZCkge1xuICAgICAgICAgICAgICAgICAgRmxvd1JvdXRlci5nbyhcIi9hcHAvXCIgKyBhcHBpZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjYWxsX2JhY2sgJiYgdHlwZW9mIGNhbGxfYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIGNhbGxfYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYWZ0ZXInLCB7XG4gICAgICAgICAgICAgIF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgICAgICBwcmV2aW91c0RvYzogcHJldmlvdXNEb2NcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdlcnJvcicsIHtcbiAgICAgICAgICAgICAgX2lkOiByZWNvcmRfaWQsXG4gICAgICAgICAgICAgIGVycm9yOiBlcnJvclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=
