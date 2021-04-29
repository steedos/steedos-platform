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
var Fiber;
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
            write_requires_master_read: related_field.write_requires_master_read
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
            write_requires_master_read: related_field.write_requires_master_read
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
  Creator.steedosStorageDir = process.env.STEEDOS_STORAGE_DIR;
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

        if (permissions.includes("admin") || permissions.includes("monitor") || space.admins.includes(current_user_id)) {
          box = 'monitor';
        }
      }

      workflowUrl = (ref3 = Meteor.settings["public"].webservices) != null ? (ref4 = ref3.workflow) != null ? ref4.url : void 0 : void 0;

      if (box) {
        redirect_url = (workflowUrl || '') + ("workflow/space/" + spaceId + "/" + box + "/" + insId + "?X-User-Id=" + x_user_id + "&X-Auth-Token=" + x_auth_token);
      } else {
        redirect_url = (workflowUrl || '') + ("workflow/space/" + spaceId + "/print/" + insId + "?box=monitor&print_is_show_traces=1&print_is_show_attachments=1&X-User-Id=" + x_user_id + "&X-Auth-Token=" + x_auth_token);
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
      var columns, mobile_columns, order, related, relatedObject, related_field_name, related_object, related_object_name, tabular_order, write_requires_master_read;

      if (!(related_object_item != null ? related_object_item.object_name : void 0)) {
        return;
      }

      related_object_name = related_object_item.object_name;
      related_field_name = related_object_item.foreign_key;
      write_requires_master_read = related_object_item.write_requires_master_read;
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
        write_requires_master_read: write_requires_master_read
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
    if (_.has(options, 'allow_customActions')) {
      self.allow_customActions = options.allow_customActions;
    }

    if (_.has(options, 'exclude_actions')) {
      self.exclude_actions = options.exclude_actions;
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
  self.details = options.details;
  self.masters = options.masters;
  self.lookup_details = options.lookup_details;

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
  return "/api/odata/v4";
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
          if (Steedos.isiOS()) {
            fs.autoform.afFieldInput = {
              type: "dx-date-box",
              timezoneId: "utc",
              dxDateBoxOptions: {
                type: "date",
                displayFormat: "yyyy-MM-dd",
                pickerType: "rollers"
              }
            };
          } else {
            fs.autoform.afFieldInput = {
              type: "steedos-date-mobile",
              dateMobileOptions: {
                type: "date"
              }
            };
          }
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
          if (Steedos.isiOS()) {
            fs.autoform.afFieldInput = {
              type: "dx-date-box",
              dxDateBoxOptions: {
                type: "datetime",
                displayFormat: "yyyy-MM-dd HH:mm",
                pickerType: "rollers"
              }
            };
          } else {
            fs.autoform.afFieldInput = {
              type: "steedos-date-mobile",
              dateMobileOptions: {
                type: "datetime"
              }
            };
          }
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
    } else if (field.type === 'percent') {
      fs.type = Number;
      fs.autoform.type = "steedosNumber";
      fs.autoform.precision = field.precision || 18;

      if (!_.isNumber(field.scale)) {
        field.scale = 0;
      }

      fs.autoform.scale = field.scale + 2;
      fs.decimal = true;
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
    var isRelateObjectUneditable, masterAllow, masterRecordPerm, relatedObjectPermissions, result, uneditable_related_list, write_requires_master_read;

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

    write_requires_master_read = relatedListItem.write_requires_master_read || false;
    masterAllow = false;
    masterRecordPerm = Creator.getRecordPermissions(currentObjectName, currentRecord, userId, spaceId);

    if (write_requires_master_read === true) {
      masterAllow = masterRecordPerm.allowRead;
    } else if (write_requires_master_read === false) {
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
       		权限集说明:
       		内置权限集-admin,user,member,guest,workflow_admin,organization_admin
       		自定义权限集-数据库中新建的除内置权限集以外的其他权限集
       		特定用户集合权限集（即users属性不可配置）-admin,user,member,guest
       		可配置用户集合权限集（即users属性可配置）-workflow_admin,organization_admin以及自定义权限集
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
    var apps, isSpaceAdmin, psetBase, psets, psetsAdmin, psetsCustomer, psetsSupplier, psetsUser, ref, ref1, spaceUser, userProfile;
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
    spaceUser = null;

    if (userId) {
      spaceUser = Creator.getCollection("space_users").findOne({
        space: spaceId,
        user: userId
      }, {
        fields: {
          profile: 1
        }
      });
    }

    if (spaceUser && spaceUser.profile) {
      psets = Creator.getCollection("permission_set").find({
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
      psets = Creator.getCollection("permission_set").find({
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
    psets = this.psetsCurrent;

    if (!psets) {
      spaceUser = null;

      if (userId) {
        spaceUser = Creator.getCollection("space_users").findOne({
          space: spaceId,
          user: userId
        }, {
          fields: {
            profile: 1
          }
        });
      }

      if (spaceUser && spaceUser.profile) {
        psets = Creator.getCollection("permission_set").find({
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
        psets = Creator.getCollection("permission_set").find({
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
    }

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
      Session.set('action_object_name', object_name);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJEYXNoYm9hcmRzIiwiUmVwb3J0cyIsInN1YnMiLCJzdGVlZG9zU2NoZW1hIiwiZSIsIm9iamVjdHFsIiwic3RlZWRvc0NvcmUiLCJNZXRlb3IiLCJpc0RldmVsb3BtZW50IiwicmVxdWlyZSIsInN0YXJ0dXAiLCJleCIsIndyYXBBc3luYyIsImluaXQiLCJlcnJvciIsImNvbnNvbGUiLCJGaWJlciIsImRlcHMiLCJhcHAiLCJUcmFja2VyIiwiRGVwZW5kZW5jeSIsIm9iamVjdCIsIl9URU1QTEFURSIsIlNpbXBsZVNjaGVtYSIsImV4dGVuZE9wdGlvbnMiLCJmaWx0ZXJzRnVuY3Rpb24iLCJNYXRjaCIsIk9wdGlvbmFsIiwiT25lT2YiLCJGdW5jdGlvbiIsIlN0cmluZyIsIm9wdGlvbnNGdW5jdGlvbiIsImNyZWF0ZUZ1bmN0aW9uIiwiaXNTZXJ2ZXIiLCJmaWJlckxvYWRPYmplY3RzIiwib2JqIiwib2JqZWN0X25hbWUiLCJsb2FkT2JqZWN0cyIsInJ1biIsIm5hbWUiLCJsaXN0X3ZpZXdzIiwic3BhY2UiLCJnZXRDb2xsZWN0aW9uTmFtZSIsIl8iLCJjbG9uZSIsImNvbnZlcnRPYmplY3QiLCJPYmplY3QiLCJpbml0VHJpZ2dlcnMiLCJpbml0TGlzdFZpZXdzIiwiZ2V0T2JqZWN0TmFtZSIsImdldE9iamVjdCIsInNwYWNlX2lkIiwicmVmIiwicmVmMSIsImlzQXJyYXkiLCJpc0NsaWVudCIsImRlcGVuZCIsIlNlc3Npb24iLCJnZXQiLCJvYmplY3RzQnlOYW1lIiwiZ2V0T2JqZWN0QnlJZCIsIm9iamVjdF9pZCIsImZpbmRXaGVyZSIsIl9pZCIsInJlbW92ZU9iamVjdCIsImxvZyIsImdldENvbGxlY3Rpb24iLCJzcGFjZUlkIiwiX2NvbGxlY3Rpb25fbmFtZSIsInJlbW92ZUNvbGxlY3Rpb24iLCJpc1NwYWNlQWRtaW4iLCJ1c2VySWQiLCJmaW5kT25lIiwiZmllbGRzIiwiYWRtaW5zIiwiaW5kZXhPZiIsImV2YWx1YXRlRm9ybXVsYSIsImZvcm11bGFyIiwiY29udGV4dCIsIm9wdGlvbnMiLCJpc1N0cmluZyIsIkZvcm11bGFyIiwiY2hlY2tGb3JtdWxhIiwiZXZhbHVhdGVGaWx0ZXJzIiwiZmlsdGVycyIsInNlbGVjdG9yIiwiZWFjaCIsImZpbHRlciIsImFjdGlvbiIsInZhbHVlIiwibGVuZ3RoIiwiaXNDb21tb25TcGFjZSIsImdldE9yZGVybHlTZXRCeUlkcyIsImRvY3MiLCJpZHMiLCJpZF9rZXkiLCJoaXRfZmlyc3QiLCJ2YWx1ZXMiLCJnZXRQcm9wZXJ0eSIsInNvcnRCeSIsImRvYyIsIl9pbmRleCIsInNvcnRpbmdNZXRob2QiLCJ2YWx1ZTEiLCJ2YWx1ZTIiLCJpc1ZhbHVlMUVtcHR5IiwiaXNWYWx1ZTJFbXB0eSIsImxvY2FsZSIsImtleSIsIkRhdGUiLCJnZXRUaW1lIiwiU3RlZWRvcyIsInRvU3RyaW5nIiwibG9jYWxlQ29tcGFyZSIsImdldE9iamVjdFJlbGF0ZWRzIiwiX29iamVjdCIsInBlcm1pc3Npb25zIiwicmVsYXRlZExpc3QiLCJyZWxhdGVkTGlzdE1hcCIsInJlbGF0ZWRfb2JqZWN0cyIsImlzRW1wdHkiLCJvYmpOYW1lIiwiaXNPYmplY3QiLCJvYmplY3ROYW1lIiwicmVsYXRlZF9vYmplY3QiLCJyZWxhdGVkX29iamVjdF9uYW1lIiwicmVsYXRlZF9maWVsZCIsInJlbGF0ZWRfZmllbGRfbmFtZSIsInR5cGUiLCJyZWZlcmVuY2VfdG8iLCJmb3JlaWduX2tleSIsIndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkIiwiZW5hYmxlT2JqTmFtZSIsImdldFBlcm1pc3Npb25zIiwiZW5hYmxlX2F1ZGl0IiwibW9kaWZ5QWxsUmVjb3JkcyIsImVuYWJsZV9maWxlcyIsInB1c2giLCJzcGxpY2UiLCJlbmFibGVfdGFza3MiLCJlbmFibGVfbm90ZXMiLCJlbmFibGVfZXZlbnRzIiwiZW5hYmxlX2luc3RhbmNlcyIsImVuYWJsZV9hcHByb3ZhbHMiLCJlbmFibGVfcHJvY2VzcyIsImdldFVzZXJDb250ZXh0IiwiaXNVblNhZmVNb2RlIiwiVVNFUl9DT05URVhUIiwic3BhY2VfdXNlcl9vcmciLCJzdSIsInN1RmllbGRzIiwiRXJyb3IiLCJtb2JpbGUiLCJwb3NpdGlvbiIsImVtYWlsIiwiY29tcGFueSIsIm9yZ2FuaXphdGlvbiIsImNvbXBhbnlfaWQiLCJjb21wYW55X2lkcyIsInVzZXIiLCJmdWxsbmFtZSIsImdldFJlbGF0aXZlVXJsIiwidXJsIiwiaXNGdW5jdGlvbiIsImlzQ29yZG92YSIsInN0YXJ0c1dpdGgiLCJ0ZXN0IiwiX19tZXRlb3JfcnVudGltZV9jb25maWdfXyIsIlJPT1RfVVJMX1BBVEhfUFJFRklYIiwiZ2V0VXNlckNvbXBhbnlJZCIsImdldFVzZXJDb21wYW55SWRzIiwicHJvY2Vzc1Blcm1pc3Npb25zIiwicG8iLCJhbGxvd0NyZWF0ZSIsImFsbG93UmVhZCIsImFsbG93RWRpdCIsImFsbG93RGVsZXRlIiwidmlld0FsbFJlY29yZHMiLCJ2aWV3Q29tcGFueVJlY29yZHMiLCJtb2RpZnlDb21wYW55UmVjb3JkcyIsImdldFRlbXBsYXRlU3BhY2VJZCIsInNldHRpbmdzIiwidGVtcGxhdGVTcGFjZUlkIiwiZ2V0Q2xvdWRBZG1pblNwYWNlSWQiLCJjbG91ZEFkbWluU3BhY2VJZCIsImlzVGVtcGxhdGVTcGFjZSIsImlzQ2xvdWRBZG1pblNwYWNlIiwic3RlZWRvc1N0b3JhZ2VEaXIiLCJwcm9jZXNzIiwiZW52IiwiU1RFRURPU19TVE9SQUdFX0RJUiIsIm1ldGhvZHMiLCJjb2xsZWN0aW9uIiwibmFtZV9maWVsZF9rZXkiLCJvcHRpb25zX2xpbWl0IiwicXVlcnkiLCJxdWVyeV9vcHRpb25zIiwicmVjb3JkcyIsInJlc3VsdHMiLCJzZWFyY2hUZXh0UXVlcnkiLCJzZWxlY3RlZCIsInNvcnQiLCJwYXJhbXMiLCJOQU1FX0ZJRUxEX0tFWSIsInNlYXJjaFRleHQiLCIkcmVnZXgiLCIkb3IiLCIkaW4iLCJleHRlbmQiLCIkbmluIiwiZmlsdGVyUXVlcnkiLCJsaW1pdCIsImZpbmQiLCJmZXRjaCIsInJlY29yZCIsImxhYmVsIiwibWVzc2FnZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJKc29uUm91dGVzIiwiYWRkIiwicmVxIiwicmVzIiwibmV4dCIsImJveCIsImN1cnJlbnRfdXNlcl9pZCIsImN1cnJlbnRfdXNlcl9pbmZvIiwiZmxvd0lkIiwiaGFzaERhdGEiLCJpbnMiLCJpbnNJZCIsInJlY29yZF9pZCIsInJlZGlyZWN0X3VybCIsInJlZjIiLCJyZWYzIiwicmVmNCIsIndvcmtmbG93VXJsIiwieF9hdXRoX3Rva2VuIiwieF91c2VyX2lkIiwidXVmbG93TWFuYWdlciIsImNoZWNrX2F1dGhvcml6YXRpb24iLCJib2R5IiwiY2hlY2siLCJpbnN0YW5jZUlkIiwiZmxvdyIsImluYm94X3VzZXJzIiwiaW5jbHVkZXMiLCJjY191c2VycyIsIm91dGJveF91c2VycyIsInN0YXRlIiwic3VibWl0dGVyIiwiYXBwbGljYW50IiwicGVybWlzc2lvbk1hbmFnZXIiLCJnZXRGbG93UGVybWlzc2lvbnMiLCJzcGFjZXMiLCJ3ZWJzZXJ2aWNlcyIsIndvcmtmbG93Iiwic2VuZFJlc3VsdCIsImNvZGUiLCJkYXRhIiwidXBkYXRlIiwiJHVuc2V0IiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwicmVhc29uIiwiZ2V0SW5pdFdpZHRoUGVyY2VudCIsImNvbHVtbnMiLCJfc2NoZW1hIiwiY29sdW1uX251bSIsImluaXRfd2lkdGhfcGVyY2VudCIsImdldFNjaGVtYSIsImZpZWxkX25hbWUiLCJmaWVsZCIsImlzX3dpZGUiLCJwaWNrIiwiYXV0b2Zvcm0iLCJnZXRGaWVsZElzV2lkZSIsImdldFRhYnVsYXJPcmRlciIsImxpc3Rfdmlld19pZCIsInNldHRpbmciLCJtYXAiLCJjb2x1bW4iLCJoaWRkZW4iLCJjb21wYWN0Iiwib3JkZXIiLCJpbmRleCIsImRlZmF1bHRfZXh0cmFfY29sdW1ucyIsImV4dHJhX2NvbHVtbnMiLCJnZXRPYmplY3REZWZhdWx0Q29sdW1ucyIsImdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMiLCJ1bmlvbiIsImdldE9iamVjdERlZmF1bHRTb3J0IiwiVGFidWxhclNlbGVjdGVkSWRzIiwiY29udmVydExpc3RWaWV3IiwiZGVmYXVsdF92aWV3IiwibGlzdF92aWV3IiwibGlzdF92aWV3X25hbWUiLCJkZWZhdWx0X2NvbHVtbnMiLCJkZWZhdWx0X21vYmlsZV9jb2x1bW5zIiwib2l0ZW0iLCJtb2JpbGVfY29sdW1ucyIsImhhcyIsImluY2x1ZGUiLCJmaWx0ZXJfc2NvcGUiLCJwYXJzZSIsImZvckVhY2giLCJfdmFsdWUiLCJnZXRSZWxhdGVkTGlzdCIsImxpc3QiLCJtYXBMaXN0IiwicmVsYXRlZExpc3ROYW1lcyIsInJlbGF0ZWRMaXN0T2JqZWN0cyIsInJlbGF0ZWRfb2JqZWN0X25hbWVzIiwidW5yZWxhdGVkX29iamVjdHMiLCJvYmpPck5hbWUiLCJyZWxhdGVkIiwiaXNfZmlsZSIsImN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0IiwiYWN0aW9ucyIsImdldFJlbGF0ZWRPYmplY3RzIiwicmVsYXRlZF9vYmplY3RfaXRlbSIsInJlbGF0ZWRPYmplY3QiLCJ0YWJ1bGFyX29yZGVyIiwid2l0aG91dCIsInRyYW5zZm9ybVNvcnRUb1RhYnVsYXIiLCJyZXBsYWNlIiwicGx1Y2siLCJkaWZmZXJlbmNlIiwidiIsImlzQWN0aXZlIiwiaXRlbSIsImFsbG93X3JlbGF0ZWRMaXN0IiwiZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyIsImZpcnN0IiwiZ2V0TGlzdFZpZXdzIiwiZ2V0TGlzdFZpZXciLCJleGFjIiwibGlzdFZpZXdzIiwiZ2V0TGlzdFZpZXdJc1JlY2VudCIsImxpc3RWaWV3IiwicGlja09iamVjdE1vYmlsZUNvbHVtbnMiLCJjb3VudCIsImdldEZpZWxkIiwiaXNOYW1lQ29sdW1uIiwiaXRlbUNvdW50IiwibWF4Q291bnQiLCJtYXhSb3dzIiwibmFtZUNvbHVtbiIsIm5hbWVLZXkiLCJyZXN1bHQiLCJnZXRPYmplY3REZWZhdWx0VmlldyIsImRlZmF1bHRWaWV3IiwidXNlX21vYmlsZV9jb2x1bW5zIiwiaXNBbGxWaWV3IiwiaXNSZWNlbnRWaWV3IiwidGFidWxhckNvbHVtbnMiLCJ0YWJ1bGFyX3NvcnQiLCJjb2x1bW5faW5kZXgiLCJ0cmFuc2Zvcm1Tb3J0VG9EWCIsImR4X3NvcnQiLCJSZWdFeCIsIlJlZ0V4cCIsIl9yZWdFeE1lc3NhZ2VzIiwiX2dsb2JhbE1lc3NhZ2VzIiwicmVnRXgiLCJleHAiLCJtc2ciLCJtZXNzYWdlcyIsImV2YWxJbkNvbnRleHQiLCJqcyIsImV2YWwiLCJjYWxsIiwiY29udmVydEZpZWxkIiwiZ2V0T3B0aW9uIiwib3B0aW9uIiwiZm9vIiwic3BsaXQiLCJjb2xvciIsImFsbE9wdGlvbnMiLCJwaWNrbGlzdCIsInBpY2tsaXN0T3B0aW9ucyIsImdldFBpY2tsaXN0IiwiZ2V0UGlja0xpc3RPcHRpb25zIiwicmV2ZXJzZSIsImVuYWJsZSIsImRlZmF1bHRWYWx1ZSIsInRyaWdnZXJzIiwidHJpZ2dlciIsIl90b2RvIiwiX3RvZG9fZnJvbV9jb2RlIiwiX3RvZG9fZnJvbV9kYiIsIm9uIiwidG9kbyIsIl92aXNpYmxlIiwiZXJyb3IxIiwiYWN0aW9uc0J5TmFtZSIsInZpc2libGUiLCJfb3B0aW9ucyIsIl90eXBlIiwiYmVmb3JlT3BlbkZ1bmN0aW9uIiwiaXNfY29tcGFueV9saW1pdGVkIiwibWF4IiwibWluIiwiX29wdGlvbiIsImsiLCJfcmVnRXgiLCJfbWluIiwiX21heCIsIk51bWJlciIsIkJvb2xlYW4iLCJfb3B0aW9uc0Z1bmN0aW9uIiwiX3JlZmVyZW5jZV90byIsIl9jcmVhdGVGdW5jdGlvbiIsIl9iZWZvcmVPcGVuRnVuY3Rpb24iLCJfZmlsdGVyc0Z1bmN0aW9uIiwiX2RlZmF1bHRWYWx1ZSIsIl9pc19jb21wYW55X2xpbWl0ZWQiLCJfZmlsdGVycyIsImlzRGF0ZSIsInBvcCIsIl9pc19kYXRlIiwiZm9ybSIsInZhbCIsInJlbGF0ZWRPYmpJbmZvIiwiUFJFRklYIiwiX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhIiwicHJlZml4IiwiZmllbGRWYXJpYWJsZSIsInJlZyIsInJldiIsIm0iLCIkMSIsImZvcm11bGFfc3RyIiwiX0NPTlRFWFQiLCJfVkFMVUVTIiwiaXNCb29sZWFuIiwidG9hc3RyIiwiZm9ybWF0T2JqZWN0TmFtZSIsIl9iYXNlT2JqZWN0IiwiX2RiIiwiZGVmYXVsdExpc3RWaWV3SWQiLCJkaXNhYmxlZF9saXN0X3ZpZXdzIiwic2NoZW1hIiwic2VsZiIsImJhc2VPYmplY3QiLCJwZXJtaXNzaW9uX3NldCIsImljb24iLCJkZXNjcmlwdGlvbiIsImlzX3ZpZXciLCJpc19lbmFibGUiLCJhbGxvd19jdXN0b21BY3Rpb25zIiwiZXhjbHVkZV9hY3Rpb25zIiwiZW5hYmxlX3NlYXJjaCIsInBhZ2luZyIsImVuYWJsZV9hcGkiLCJjdXN0b20iLCJlbmFibGVfc2hhcmUiLCJlbmFibGVfdHJlZSIsInNpZGViYXIiLCJvcGVuX3dpbmRvdyIsImZpbHRlcl9jb21wYW55IiwiY2FsZW5kYXIiLCJlbmFibGVfY2hhdHRlciIsImVuYWJsZV90cmFzaCIsImVuYWJsZV9zcGFjZV9nbG9iYWwiLCJlbmFibGVfZm9sbG93IiwiZW5hYmxlX3dvcmtmbG93IiwiZW5hYmxlX2lubGluZV9lZGl0IiwiZGV0YWlscyIsIm1hc3RlcnMiLCJsb29rdXBfZGV0YWlscyIsImluX2RldmVsb3BtZW50IiwiaWRGaWVsZE5hbWUiLCJkYXRhYmFzZV9uYW1lIiwiaXNfbmFtZSIsInByaW1hcnkiLCJmaWx0ZXJhYmxlIiwicmVhZG9ubHkiLCJpdGVtX25hbWUiLCJjb3B5SXRlbSIsImFkbWluIiwiYWxsIiwibGlzdF92aWV3X2l0ZW0iLCJSZWFjdGl2ZVZhciIsImNyZWF0ZUNvbGxlY3Rpb24iLCJfbmFtZSIsImdldE9iamVjdFNjaGVtYSIsImNvbnRhaW5zIiwiYXR0YWNoU2NoZW1hIiwiX3NpbXBsZVNjaGVtYSIsImdldE9iamVjdE9EYXRhUm91dGVyUHJlZml4IiwiYm9vdHN0cmFwTG9hZGVkIiwiZmllbGRzQXJyIiwiX3JlZl9vYmoiLCJhdXRvZm9ybV90eXBlIiwiZnMiLCJpc1VuTGltaXRlZCIsIm11bHRpcGxlIiwicm93cyIsImxhbmd1YWdlIiwiaXNNb2JpbGUiLCJpc1BhZCIsImlzaU9TIiwiYWZGaWVsZElucHV0IiwidGltZXpvbmVJZCIsImR4RGF0ZUJveE9wdGlvbnMiLCJkaXNwbGF5Rm9ybWF0IiwicGlja2VyVHlwZSIsImRhdGVNb2JpbGVPcHRpb25zIiwib3V0Rm9ybWF0IiwiaGVpZ2h0IiwiZGlhbG9nc0luQm9keSIsInRvb2xiYXIiLCJmb250TmFtZXMiLCJsYW5nIiwic2hvd0ljb24iLCJkZXBlbmRPbiIsImRlcGVuZF9vbiIsImNyZWF0ZSIsImxvb2t1cF9maWVsZCIsIk1vZGFsIiwic2hvdyIsImZvcm1JZCIsIm9wZXJhdGlvbiIsIm9uU3VjY2VzcyIsImFkZEl0ZW1zIiwicmVmZXJlbmNlX3NvcnQiLCJvcHRpb25zU29ydCIsInJlZmVyZW5jZV9saW1pdCIsIm9wdGlvbnNMaW1pdCIsIm9taXQiLCJibGFja2JveCIsIm9iamVjdFN3aXRjaGUiLCJvcHRpb25zTWV0aG9kIiwib3B0aW9uc01ldGhvZFBhcmFtcyIsInJlZmVyZW5jZXMiLCJfcmVmZXJlbmNlIiwibGluayIsImRlZmF1bHRJY29uIiwiZmlyc3RPcHRpb24iLCJwcmVjaXNpb24iLCJzY2FsZSIsImRlY2ltYWwiLCJkaXNhYmxlZCIsIkFycmF5IiwiZWRpdGFibGUiLCJhY2NlcHQiLCJzeXN0ZW0iLCJFbWFpbCIsImFzc2lnbiIsImRhdGFfdHlwZSIsImlzTnVtYmVyIiwicmVxdWlyZWQiLCJvcHRpb25hbCIsInVuaXF1ZSIsImdyb3VwIiwic2VhcmNoYWJsZSIsIm5vdyIsImlubGluZUhlbHBUZXh0IiwiaXNQcm9kdWN0aW9uIiwic29ydGFibGUiLCJnZXRGaWVsZERpc3BsYXlWYWx1ZSIsImZpZWxkX3ZhbHVlIiwiaHRtbCIsIm1vbWVudCIsImZvcm1hdCIsImNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeSIsImZpZWxkX3R5cGUiLCJwdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMiLCJvcGVyYXRpb25zIiwiYnVpbHRpblZhbHVlcyIsImdldEJldHdlZW5CdWlsdGluVmFsdWVzIiwiYnVpbHRpbkl0ZW0iLCJpc19jaGVja19vbmx5IiwiZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzIiwiZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0iLCJnZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0iLCJnZXRCZXR3ZWVuQnVpbHRpbk9wZXJhdGlvbiIsImJldHdlZW5CdWlsdGluVmFsdWVzIiwiZ2V0UXVhcnRlclN0YXJ0TW9udGgiLCJtb250aCIsImdldE1vbnRoIiwiZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSIsInllYXIiLCJnZXRGdWxsWWVhciIsImdldE5leHRRdWFydGVyRmlyc3REYXkiLCJnZXRNb250aERheXMiLCJkYXlzIiwiZW5kRGF0ZSIsIm1pbGxpc2Vjb25kIiwic3RhcnREYXRlIiwiZ2V0TGFzdE1vbnRoRmlyc3REYXkiLCJjdXJyZW50TW9udGgiLCJjdXJyZW50WWVhciIsImVuZFZhbHVlIiwiZmlyc3REYXkiLCJsYXN0RGF5IiwibGFzdE1vbmRheSIsImxhc3RNb250aEZpbmFsRGF5IiwibGFzdE1vbnRoRmlyc3REYXkiLCJsYXN0UXVhcnRlckVuZERheSIsImxhc3RRdWFydGVyU3RhcnREYXkiLCJsYXN0U3VuZGF5IiwibGFzdF8xMjBfZGF5cyIsImxhc3RfMzBfZGF5cyIsImxhc3RfNjBfZGF5cyIsImxhc3RfN19kYXlzIiwibGFzdF85MF9kYXlzIiwibWludXNEYXkiLCJtb25kYXkiLCJuZXh0TW9uZGF5IiwibmV4dE1vbnRoRmluYWxEYXkiLCJuZXh0TW9udGhGaXJzdERheSIsIm5leHRRdWFydGVyRW5kRGF5IiwibmV4dFF1YXJ0ZXJTdGFydERheSIsIm5leHRTdW5kYXkiLCJuZXh0WWVhciIsIm5leHRfMTIwX2RheXMiLCJuZXh0XzMwX2RheXMiLCJuZXh0XzYwX2RheXMiLCJuZXh0XzdfZGF5cyIsIm5leHRfOTBfZGF5cyIsInByZXZpb3VzWWVhciIsInN0YXJ0VmFsdWUiLCJzdHJFbmREYXkiLCJzdHJGaXJzdERheSIsInN0ckxhc3REYXkiLCJzdHJNb25kYXkiLCJzdHJTdGFydERheSIsInN0clN1bmRheSIsInN0clRvZGF5Iiwic3RyVG9tb3Jyb3ciLCJzdHJZZXN0ZGF5Iiwic3VuZGF5IiwidGhpc1F1YXJ0ZXJFbmREYXkiLCJ0aGlzUXVhcnRlclN0YXJ0RGF5IiwidG9tb3Jyb3ciLCJ3ZWVrIiwieWVzdGRheSIsImdldERheSIsInQiLCJmdiIsInNldEhvdXJzIiwiZ2V0SG91cnMiLCJnZXRUaW1lem9uZU9mZnNldCIsImdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiIsImdldEZpZWxkT3BlcmF0aW9uIiwib3B0aW9uYWxzIiwiZXF1YWwiLCJ1bmVxdWFsIiwibGVzc190aGFuIiwiZ3JlYXRlcl90aGFuIiwibGVzc19vcl9lcXVhbCIsImdyZWF0ZXJfb3JfZXF1YWwiLCJub3RfY29udGFpbiIsInN0YXJ0c193aXRoIiwiYmV0d2VlbiIsImdldE9iamVjdEZpZWxkc05hbWUiLCJmaWVsZHNOYW1lIiwic29ydF9ubyIsImNsZWFuVHJpZ2dlciIsImluaXRUcmlnZ2VyIiwiX3RyaWdnZXJfaG9va3MiLCJyZWY1IiwidG9kb1dyYXBwZXIiLCJhcHBseSIsImFyZ3VtZW50cyIsIndoZW4iLCJiZWZvcmUiLCJpbnNlcnQiLCJyZW1vdmUiLCJhZnRlciIsIl9ob29rIiwidHJpZ2dlcl9uYW1lIiwiX3RyaWdnZXJfaG9vayIsImZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QiLCJmaW5kX3Blcm1pc3Npb25fb2JqZWN0IiwiaW50ZXJzZWN0aW9uUGx1cyIsInVuaW9uUGVybWlzc2lvbk9iamVjdHMiLCJ1bmlvblBsdXMiLCJnZXRPYmplY3RQZXJtaXNzaW9ucyIsImdldFJlY29yZFBlcm1pc3Npb25zIiwiaXNPd25lciIsIm9iamVjdF9maWVsZHNfa2V5cyIsInJlY29yZF9jb21wYW55X2lkIiwicmVjb3JkX2NvbXBhbnlfaWRzIiwic2VsZWN0IiwidXNlcl9jb21wYW55X2lkcyIsInBhcmVudCIsImtleXMiLCJpbnRlcnNlY3Rpb24iLCJnZXRPYmplY3RSZWNvcmQiLCJqb2luIiwicmVjb3JkX3Blcm1pc3Npb25zIiwib3duZXIiLCJuIiwibG9ja2VkIiwiZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyIsImN1cnJlbnRPYmplY3ROYW1lIiwicmVsYXRlZExpc3RJdGVtIiwiY3VycmVudFJlY29yZCIsImlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSIsIm1hc3RlckFsbG93IiwibWFzdGVyUmVjb3JkUGVybSIsInJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyIsInVuZWRpdGFibGVfcmVsYXRlZF9saXN0IiwiZ2V0UmVjb3JkU2FmZVJlbGF0ZWRMaXN0IiwiZ2V0QWxsUGVybWlzc2lvbnMiLCJfaSIsInBzZXRzIiwicHNldHNBZG1pbiIsInBzZXRzQWRtaW5fcG9zIiwicHNldHNDdXJyZW50IiwicHNldHNDdXJyZW50TmFtZXMiLCJwc2V0c0N1cnJlbnRfcG9zIiwicHNldHNDdXN0b21lciIsInBzZXRzQ3VzdG9tZXJfcG9zIiwicHNldHNHdWVzdCIsInBzZXRzR3Vlc3RfcG9zIiwicHNldHNNZW1iZXIiLCJwc2V0c01lbWJlcl9wb3MiLCJwc2V0c1N1cHBsaWVyIiwicHNldHNTdXBwbGllcl9wb3MiLCJwc2V0c1VzZXIiLCJwc2V0c1VzZXJfcG9zIiwic2V0X2lkcyIsInNwYWNlVXNlciIsIm9iamVjdHMiLCJhc3NpZ25lZF9hcHBzIiwicHJvZmlsZSIsInVzZXJzIiwicGVybWlzc2lvbl9zZXRfaWQiLCJjcmVhdGVkIiwibW9kaWZpZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWRfYnkiLCJnZXRBc3NpZ25lZEFwcHMiLCJiaW5kIiwiYXNzaWduZWRfbWVudXMiLCJnZXRBc3NpZ25lZE1lbnVzIiwidXNlcl9wZXJtaXNzaW9uX3NldHMiLCJhcnJheSIsIm90aGVyIiwiYXBwcyIsInBzZXRCYXNlIiwidXNlclByb2ZpbGUiLCJwc2V0IiwidW5pcSIsImFib3V0TWVudSIsImFkbWluTWVudXMiLCJhbGxNZW51cyIsImN1cnJlbnRQc2V0TmFtZXMiLCJtZW51cyIsIm90aGVyTWVudUFwcHMiLCJvdGhlck1lbnVzIiwiYWRtaW5fbWVudXMiLCJmbGF0dGVuIiwibWVudSIsInBzZXRzTWVudSIsInBlcm1pc3Npb25fc2V0cyIsInBlcm1pc3Npb25fb2JqZWN0cyIsImlzTnVsbCIsInBlcm1pc3Npb25fc2V0X2lkcyIsInBvcyIsIm9wcyIsIm9wc19rZXkiLCJjdXJyZW50UHNldCIsInRlbXBPcHMiLCJyZXBlYXRJbmRleCIsInJlcGVhdFBvIiwib3BzZXRBZG1pbiIsIm9wc2V0Q3VzdG9tZXIiLCJvcHNldEd1ZXN0Iiwib3BzZXRNZW1iZXIiLCJvcHNldFN1cHBsaWVyIiwib3BzZXRVc2VyIiwicG9zQWRtaW4iLCJwb3NDdXN0b21lciIsInBvc0d1ZXN0IiwicG9zTWVtYmVyIiwicG9zU3VwcGxpZXIiLCJwb3NVc2VyIiwicHJvZiIsImd1ZXN0IiwibWVtYmVyIiwic3VwcGxpZXIiLCJjdXN0b21lciIsImRpc2FibGVkX2FjdGlvbnMiLCJ1bnJlYWRhYmxlX2ZpZWxkcyIsInVuZWRpdGFibGVfZmllbGRzIiwiY3JlYXRvcl9kYl91cmwiLCJvcGxvZ191cmwiLCJNT05HT19VUkxfQ1JFQVRPUiIsIk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SIiwiX0NSRUFUT1JfREFUQVNPVVJDRSIsIl9kcml2ZXIiLCJNb25nb0ludGVybmFscyIsIlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIiLCJvcGxvZ1VybCIsImNvbGxlY3Rpb25fa2V5IiwibmV3Q29sbGVjdGlvbiIsIlNNU1F1ZXVlIiwiYWN0aW9uX25hbWUiLCJleGVjdXRlQWN0aW9uIiwiaXRlbV9lbGVtZW50IiwibW9yZUFyZ3MiLCJ0b2RvQXJncyIsIm9kYXRhIiwicHJvdG90eXBlIiwic2xpY2UiLCJjb25jYXQiLCJ3YXJuaW5nIiwic2V0IiwiRm9ybU1hbmFnZXIiLCJnZXRJbml0aWFsVmFsdWVzIiwiZGVmZXIiLCIkIiwiY2xpY2siLCJocmVmIiwiZ2V0T2JqZWN0VXJsIiwiRmxvd1JvdXRlciIsInJlZGlyZWN0IiwicmVjb3JkX3RpdGxlIiwiY2FsbF9iYWNrIiwiYmVmb3JlSG9vayIsInRleHQiLCJydW5Ib29rIiwic3dhbCIsInRpdGxlIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNvbmZpcm1CdXR0b25UZXh0IiwiY2FuY2VsQnV0dG9uVGV4dCIsInByZXZpb3VzRG9jIiwiZ2V0UHJldmlvdXNEb2MiLCJhcHBpZCIsImR4RGF0YUdyaWRJbnN0YW5jZSIsImdyaWRDb250YWluZXIiLCJncmlkT2JqZWN0TmFtZUNsYXNzIiwiaW5mbyIsImlzT3BlbmVyUmVtb3ZlIiwicmVjb3JkVXJsIiwidGVtcE5hdlJlbW92ZWQiLCJzdWNjZXNzIiwid2luZG93Iiwib3BlbmVyIiwiZHhUcmVlTGlzdCIsImR4RGF0YUdyaWQiLCJyZWZyZXNoIiwicmVsb2FkIiwiVGVtcGxhdGUiLCJjcmVhdG9yX2dyaWQiLCJyZW1vdmVUZW1wTmF2SXRlbSIsImNsb3NlIiwiZ28iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxLQUFDQSxFQUFELEdBQU0sRUFBTjs7QUFDQSxJQUFJLE9BQUFDLE9BQUEsb0JBQUFBLFlBQUEsSUFBSjtBQUNDLE9BQUNBLE9BQUQsR0FBVyxFQUFYO0FDRUE7O0FERERBLFFBQVFDLE9BQVIsR0FBa0IsRUFBbEI7QUFDQUQsUUFBUUUsV0FBUixHQUFzQixFQUF0QjtBQUNBRixRQUFRRyxLQUFSLEdBQWdCLEVBQWhCO0FBQ0FI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RDtBRG5GTixRQ09HO0FEbEVKO0FBQUEsR0FGRDtBQ29KQSxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJAZGIgPSB7fVxuaWYgIUNyZWF0b3I/XG5cdEBDcmVhdG9yID0ge31cbkNyZWF0b3IuT2JqZWN0cyA9IHt9XG5DcmVhdG9yLkNvbGxlY3Rpb25zID0ge31cbkNyZWF0b3IuTWVudXMgPSBbXVxuQ3JlYXRvci5BcHBzID0ge31cbkNyZWF0b3IuRGFzaGJvYXJkcyA9IHt9XG5DcmVhdG9yLlJlcG9ydHMgPSB7fVxuQ3JlYXRvci5zdWJzID0ge31cbkNyZWF0b3Iuc3RlZWRvc1NjaGVtYSA9IHt9IiwidGhpcy5kYiA9IHt9O1xuXG5pZiAodHlwZW9mIENyZWF0b3IgPT09IFwidW5kZWZpbmVkXCIgfHwgQ3JlYXRvciA9PT0gbnVsbCkge1xuICB0aGlzLkNyZWF0b3IgPSB7fTtcbn1cblxuQ3JlYXRvci5PYmplY3RzID0ge307XG5cbkNyZWF0b3IuQ29sbGVjdGlvbnMgPSB7fTtcblxuQ3JlYXRvci5NZW51cyA9IFtdO1xuXG5DcmVhdG9yLkFwcHMgPSB7fTtcblxuQ3JlYXRvci5EYXNoYm9hcmRzID0ge307XG5cbkNyZWF0b3IuUmVwb3J0cyA9IHt9O1xuXG5DcmVhdG9yLnN1YnMgPSB7fTtcblxuQ3JlYXRvci5zdGVlZG9zU2NoZW1hID0ge307XG4iLCJ0cnlcblx0aWYgTWV0ZW9yLmlzRGV2ZWxvcG1lbnRcblx0XHRzdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKVxuXHRcdG9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKVxuXHRcdE1ldGVvci5zdGFydHVwIC0+XG5cdFx0XHR0cnlcblx0XHRcdFx0b2JqZWN0cWwud3JhcEFzeW5jKHN0ZWVkb3NDb3JlLmluaXQpXG5cdFx0XHRjYXRjaCBleFxuXHRcdFx0XHRjb25zb2xlLmVycm9yKFwiZXJyb3I6XCIsZXgpXG5jYXRjaCBlXG5cdGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIixlKSIsInZhciBlLCBvYmplY3RxbCwgc3RlZWRvc0NvcmU7XG5cbnRyeSB7XG4gIGlmIChNZXRlb3IuaXNEZXZlbG9wbWVudCkge1xuICAgIHN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpO1xuICAgIG9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcbiAgICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBleDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBvYmplY3RxbC53cmFwQXN5bmMoc3RlZWRvc0NvcmUuaW5pdCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBleCA9IGVycm9yO1xuICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImVycm9yOlwiLCBleCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0gY2F0Y2ggKGVycm9yKSB7XG4gIGUgPSBlcnJvcjtcbiAgY29uc29sZS5lcnJvcihcImVycm9yOlwiLCBlKTtcbn1cbiIsIkNyZWF0b3IuZGVwcyA9IHtcblx0YXBwOiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XG5cdG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxufTtcblxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XG5cdEFwcHM6IHt9LFxuXHRPYmplY3RzOiB7fVxufVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7ZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7b3B0aW9uc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7Y3JlYXRlRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXG5cbiMgQ3JlYXRvci5maWJlckxvYWRPYmplY3RzIOS+m3N0ZWVkb3MtY2xp6aG555uu5L2/55SoXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0RmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxuXHRDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxuXHRcdEZpYmVyKCgpLT5cblx0XHRcdENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSlcblx0XHQpLnJ1bigpXG5cbkNyZWF0b3IubG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IG9iai5uYW1lXG5cblx0aWYgIW9iai5saXN0X3ZpZXdzXG5cdFx0b2JqLmxpc3Rfdmlld3MgPSB7fVxuXG5cdGlmIG9iai5zcGFjZVxuXHRcdG9iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmopXG5cdGlmIG9iamVjdF9uYW1lID09ICdjZnNfZmlsZXNfZmlsZXJlY29yZCdcblx0XHRvYmplY3RfbmFtZSA9ICdjZnMuZmlsZXMuZmlsZXJlY29yZCdcblx0XHRvYmogPSBfLmNsb25lKG9iailcblx0XHRvYmoubmFtZSA9IG9iamVjdF9uYW1lXG5cdFx0Q3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSA9IG9ialxuXG5cdENyZWF0b3IuY29udmVydE9iamVjdChvYmopXG5cdG5ldyBDcmVhdG9yLk9iamVjdChvYmopO1xuXG5cdENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKVxuXHRDcmVhdG9yLmluaXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpXG5cdHJldHVybiBvYmpcblxuQ3JlYXRvci5nZXRPYmplY3ROYW1lID0gKG9iamVjdCkgLT5cblx0aWYgb2JqZWN0LnNwYWNlXG5cdFx0cmV0dXJuIFwiY18je29iamVjdC5zcGFjZX1fI3tvYmplY3QubmFtZX1cIlxuXHRyZXR1cm4gb2JqZWN0Lm5hbWVcblxuQ3JlYXRvci5nZXRPYmplY3QgPSAob2JqZWN0X25hbWUsIHNwYWNlX2lkKS0+XG5cdGlmIF8uaXNBcnJheShvYmplY3RfbmFtZSlcblx0XHRyZXR1cm4gO1xuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRDcmVhdG9yLmRlcHM/Lm9iamVjdD8uZGVwZW5kKClcblx0aWYgIW9iamVjdF9uYW1lIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuI1x0aWYgIXNwYWNlX2lkICYmIG9iamVjdF9uYW1lXG4jXHRcdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY18nKVxuI1x0XHRcdHNwYWNlX2lkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cblx0aWYgb2JqZWN0X25hbWVcbiNcdFx0aWYgc3BhY2VfaWRcbiNcdFx0XHRvYmogPSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbXCJjXyN7c3BhY2VfaWR9XyN7b2JqZWN0X25hbWV9XCJdXG4jXHRcdFx0aWYgb2JqXG4jXHRcdFx0XHRyZXR1cm4gb2JqXG4jXG4jXHRcdG9iaiA9IF8uZmluZCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvKS0+XG4jXHRcdFx0XHRyZXR1cm4gby5fY29sbGVjdGlvbl9uYW1lID09IG9iamVjdF9uYW1lXG4jXHRcdGlmIG9ialxuI1x0XHRcdHJldHVybiBvYmpcblxuXHRcdHJldHVybiBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IuZ2V0T2JqZWN0QnlJZCA9IChvYmplY3RfaWQpLT5cblx0cmV0dXJuIF8uZmluZFdoZXJlKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwge19pZDogb2JqZWN0X2lkfSlcblxuQ3JlYXRvci5yZW1vdmVPYmplY3QgPSAob2JqZWN0X25hbWUpLT5cblx0Y29uc29sZS5sb2coXCJyZW1vdmVPYmplY3RcIiwgb2JqZWN0X25hbWUpXG5cdGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXG5cdGRlbGV0ZSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCktPlxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0aWYgb2JqZWN0X25hbWVcblx0XHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk/Ll9jb2xsZWN0aW9uX25hbWVdXG5cbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSktPlxuXHRkZWxldGUgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cblx0c3BhY2UgPSBDcmVhdG9yLmdldE9iamVjdChcInNwYWNlc1wiKT8uZGI/LmZpbmRPbmUoc3BhY2VJZCx7ZmllbGRzOnthZG1pbnM6MX19KVxuXHRpZiBzcGFjZT8uYWRtaW5zXG5cdFx0cmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMFxuXG5cbkNyZWF0b3IuZXZhbHVhdGVGb3JtdWxhID0gKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKS0+XG5cblx0aWYgIV8uaXNTdHJpbmcoZm9ybXVsYXIpXG5cdFx0cmV0dXJuIGZvcm11bGFyXG5cblx0aWYgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZm9ybXVsYXIpXG5cdFx0cmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKVxuXG5cdHJldHVybiBmb3JtdWxhclxuXG5DcmVhdG9yLmV2YWx1YXRlRmlsdGVycyA9IChmaWx0ZXJzLCBjb250ZXh0KS0+XG5cdHNlbGVjdG9yID0ge31cblx0Xy5lYWNoIGZpbHRlcnMsIChmaWx0ZXIpLT5cblx0XHRpZiBmaWx0ZXI/Lmxlbmd0aCA9PSAzXG5cdFx0XHRuYW1lID0gZmlsdGVyWzBdXG5cdFx0XHRhY3Rpb24gPSBmaWx0ZXJbMV1cblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBjb250ZXh0KVxuXHRcdFx0c2VsZWN0b3JbbmFtZV0gPSB7fVxuXHRcdFx0c2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlXG5cdCMgY29uc29sZS5sb2coXCJldmFsdWF0ZUZpbHRlcnMtLT5zZWxlY3RvclwiLCBzZWxlY3Rvcilcblx0cmV0dXJuIHNlbGVjdG9yXG5cbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IChzcGFjZUlkKSAtPlxuXHRyZXR1cm4gc3BhY2VJZCA9PSAnY29tbW9uJ1xuXG4jIyNcblx0ZG9jc++8muW+heaOkuW6j+eahOaWh+aho+aVsOe7hFxuXHRpZHPvvJpfaWTpm4blkIhcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcblx0cmV0dXJuIOaMieeFp2lkc+eahOmhuuW6j+i/lOWbnuaWsOeahOaWh+aho+mbhuWQiFxuIyMjXG5DcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyA9IChkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KS0+XG5cblx0aWYgIWlkX2tleVxuXHRcdGlkX2tleSA9IFwiX2lkXCJcblxuXHRpZiBoaXRfZmlyc3RcblxuXHRcdCPnlLHkuo7kuI3og73kvb/nlKhfLmZpbmRJbmRleOWHveaVsO+8jOWboOatpOatpOWkhOWFiOWwhuWvueixoeaVsOe7hOi9rOS4uuaZrumAmuaVsOe7hOexu+Wei++8jOWcqOiOt+WPluWFtmluZGV4XG5cdFx0dmFsdWVzID0gZG9jcy5nZXRQcm9wZXJ0eShpZF9rZXkpXG5cblx0XHRyZXR1cm5cdF8uc29ydEJ5IGRvY3MsIChkb2MpLT5cblx0XHRcdFx0XHRfaW5kZXggPSBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSlcblx0XHRcdFx0XHRpZiBfaW5kZXggPiAtMVxuXHRcdFx0XHRcdFx0cmV0dXJuIF9pbmRleFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pXG5cdGVsc2Vcblx0XHRyZXR1cm5cdF8uc29ydEJ5IGRvY3MsIChkb2MpLT5cblx0XHRcdHJldHVybiBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSlcblxuIyMjXG5cdOaMieeUqOaIt+aJgOWxnuacrOWcsOWMluivreiogOi/m+ihjOaOkuW6j++8jOaUr+aMgeS4reaWh+OAgeaVsOWAvOOAgeaXpeacn+etieWtl+auteaOkuW6j1xuXHTlr7nkuo5PYmplY3TnsbvlnovvvIzlpoLmnpzmj5DkvpvkvZznlKjln5/kuK1rZXnlsZ7mgKfvvIzliJnlj5blgLzkuLp2YWx1ZVtrZXld6L+b6KGM5o6S5bqP5q+U6L6D77yM5Y+N5LmL5pW05LiqT2JqZWN0LnRvU3RyaW5nKCnlkI7mjpLluo/mr5TovoNcbiMjI1xuQ3JlYXRvci5zb3J0aW5nTWV0aG9kID0gKHZhbHVlMSwgdmFsdWUyKSAtPlxuXHRpZiB0aGlzLmtleVxuXHRcdHZhbHVlMSA9IHZhbHVlMVt0aGlzLmtleV1cblx0XHR2YWx1ZTIgPSB2YWx1ZTJbdGhpcy5rZXldXG5cdGlmIHZhbHVlMSBpbnN0YW5jZW9mIERhdGVcblx0XHR2YWx1ZTEgPSB2YWx1ZTEuZ2V0VGltZSgpXG5cdGlmIHZhbHVlMiBpbnN0YW5jZW9mIERhdGVcblx0XHR2YWx1ZTIgPSB2YWx1ZTIuZ2V0VGltZSgpXG5cdGlmIHR5cGVvZiB2YWx1ZTEgaXMgXCJudW1iZXJcIiBhbmQgdHlwZW9mIHZhbHVlMiBpcyBcIm51bWJlclwiXG5cdFx0cmV0dXJuIHZhbHVlMSAtIHZhbHVlMlxuXHQjIEhhbmRsaW5nIG51bGwgdmFsdWVzXG5cdGlzVmFsdWUxRW1wdHkgPSB2YWx1ZTEgPT0gbnVsbCBvciB2YWx1ZTEgPT0gdW5kZWZpbmVkXG5cdGlzVmFsdWUyRW1wdHkgPSB2YWx1ZTIgPT0gbnVsbCBvciB2YWx1ZTIgPT0gdW5kZWZpbmVkXG5cdGlmIGlzVmFsdWUxRW1wdHkgYW5kICFpc1ZhbHVlMkVtcHR5XG5cdFx0cmV0dXJuIC0xXG5cdGlmIGlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcblx0XHRyZXR1cm4gMFxuXHRpZiAhaXNWYWx1ZTFFbXB0eSBhbmQgaXNWYWx1ZTJFbXB0eVxuXHRcdHJldHVybiAxXG5cdGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcblx0cmV0dXJuIHZhbHVlMS50b1N0cmluZygpLmxvY2FsZUNvbXBhcmUgdmFsdWUyLnRvU3RyaW5nKCksIGxvY2FsZVxuXG5cbiMg6K+l5Ye95pWw5Y+q5Zyo5Yid5aeL5YyWT2JqZWN05pe277yM5oqK55u45YWz5a+56LGh55qE6K6h566X57uT5p6c5L+d5a2Y5YiwT2JqZWN055qEcmVsYXRlZF9vYmplY3Rz5bGe5oCn5Lit77yM5ZCO57ut5Y+v5Lul55u05o6l5LuOcmVsYXRlZF9vYmplY3Rz5bGe5oCn5Lit5Y+W5b6X6K6h566X57uT5p6c6ICM5LiN55So5YaN5qyh6LCD55So6K+l5Ye95pWw5p2l6K6h566XXG5DcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzID0gKG9iamVjdF9uYW1lKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0cmVsYXRlZF9vYmplY3RzID0gW11cblx0IyBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdCMg5ZugQ3JlYXRvci5nZXRPYmplY3Tlh73mlbDlhoXpg6jopoHosIPnlKjor6Xlh73mlbDvvIzmiYDku6Xov5nph4zkuI3lj6/ku6XosIPnlKhDcmVhdG9yLmdldE9iamVjdOWPluWvueixoe+8jOWPquiDveiwg+eUqENyZWF0b3IuT2JqZWN0c+adpeWPluWvueixoVxuXHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxuXHRpZiAhX29iamVjdFxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdHNcblx0XG5cdHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdFxuXHRpZiBNZXRlb3IuaXNDbGllbnQgJiYgIV8uaXNFbXB0eSByZWxhdGVkTGlzdFxuXHRcdHJlbGF0ZWRMaXN0TWFwID0ge31cblx0XHRfLmVhY2ggcmVsYXRlZExpc3QsIChvYmpOYW1lKS0+XG5cdFx0XHRpZiBfLmlzT2JqZWN0IG9iak5hbWVcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbb2JqTmFtZS5vYmplY3ROYW1lXSA9IHt9XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW29iak5hbWVdID0ge31cblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cblx0XHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cblx0XHRcdFx0aWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIikgYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PSBvYmplY3RfbmFtZSBhbmQgcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV1cblx0XHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHsgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiByZWxhdGVkX2ZpZWxkLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkIH1cblx0XHRpZiByZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ11cblx0XHRcdHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSA9IHsgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiIH1cblx0XHRpZiByZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ11cblx0XHRcdHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXSA9IHsgb2JqZWN0X25hbWU6IFwiaW5zdGFuY2VzXCIsIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIiB9XG5cdFx0Xy5lYWNoIFsndGFza3MnLCAnbm90ZXMnLCAnZXZlbnRzJywgJ2FwcHJvdmFscyddLCAoZW5hYmxlT2JqTmFtZSktPlxuXHRcdFx0aWYgcmVsYXRlZExpc3RNYXBbZW5hYmxlT2JqTmFtZV1cblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbZW5hYmxlT2JqTmFtZV0gPSB7IG9iamVjdF9uYW1lOiBlbmFibGVPYmpOYW1lLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCIgfVxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ11cblx0XHRcdCNyZWNvcmQg6K+m57uG5LiL55qEYXVkaXRfcmVjb3Jkc+S7hW1vZGlmeUFsbFJlY29yZHPmnYPpmZDlj6/op4Fcblx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSlcblx0XHRcdGlmIF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10gPSB7IG9iamVjdF9uYW1lOlwiYXVkaXRfcmVjb3Jkc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCIgfVxuXHRcdHJlbGF0ZWRfb2JqZWN0cyA9IF8udmFsdWVzIHJlbGF0ZWRMaXN0TWFwXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xuXG5cdGlmIF9vYmplY3QuZW5hYmxlX2ZpbGVzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiY21zX2ZpbGVzXCIsIGZvcmVpZ25fa2V5OiBcInBhcmVudFwifVxuXG5cdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSktPlxuXHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cblx0XHRcdGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcImxvb2t1cFwiICYmIHJlbGF0ZWRfZmllbGQucmVsYXRlZExpc3QpKSBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lXG5cdFx0XHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJvYmplY3RfZmllbGRzXCJcblx0XHRcdFx0XHQjVE9ETyDlvoXnm7jlhbPliJfooajmlK/mjIHmjpLluo/lkI7vvIzliKDpmaTmraTliKTmlq1cblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdHMuc3BsaWNlKDAsIDAsIHtvYmplY3RfbmFtZTpyZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lfSlcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpyZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLCB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogcmVsYXRlZF9maWVsZC53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZH1cblxuXHRpZiBfb2JqZWN0LmVuYWJsZV90YXNrc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcInRhc2tzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfbm90ZXNcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJub3Rlc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XG5cdGlmIF9vYmplY3QuZW5hYmxlX2V2ZW50c1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImV2ZW50c1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XG5cdGlmIF9vYmplY3QuZW5hYmxlX2luc3RhbmNlc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImluc3RhbmNlc1wiLCBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJ9XG5cdGlmIF9vYmplY3QuZW5hYmxlX2FwcHJvdmFsc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImFwcHJvdmFsc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XG5cdGlmIF9vYmplY3QuZW5hYmxlX3Byb2Nlc3Ncblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJwcm9jZXNzX2luc3RhbmNlX2hpc3RvcnlcIiwgZm9yZWlnbl9rZXk6IFwidGFyZ2V0X29iamVjdFwifVxuXHQjcmVjb3JkIOivpue7huS4i+eahGF1ZGl0X3JlY29yZHPku4Vtb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5Y+v6KeBXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSlcblx0XHRpZiBfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiYXVkaXRfcmVjb3Jkc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XG5cblx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xuXG5DcmVhdG9yLmdldFVzZXJDb250ZXh0ID0gKHVzZXJJZCwgc3BhY2VJZCwgaXNVblNhZmVNb2RlKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHJldHVybiBDcmVhdG9yLlVTRVJfQ09OVEVYVFxuXHRlbHNlXG5cdFx0aWYgISh1c2VySWQgYW5kIHNwYWNlSWQpXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCJ0aGUgcGFyYW1zIHVzZXJJZCBhbmQgc3BhY2VJZCBpcyByZXF1aXJlZCBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0VXNlckNvbnRleHRcIlxuXHRcdFx0cmV0dXJuIG51bGxcblx0XHRzdUZpZWxkcyA9IHtuYW1lOiAxLCBtb2JpbGU6IDEsIHBvc2l0aW9uOiAxLCBlbWFpbDogMSwgY29tcGFueTogMSwgb3JnYW5pemF0aW9uOiAxLCBzcGFjZTogMSwgY29tcGFueV9pZDogMSwgY29tcGFueV9pZHM6IDF9XG5cdFx0IyBjaGVjayBpZiB1c2VyIGluIHRoZSBzcGFjZVxuXHRcdHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiBzdUZpZWxkc30pXG5cdFx0aWYgIXN1XG5cdFx0XHRzcGFjZUlkID0gbnVsbFxuXG5cdFx0IyBpZiBzcGFjZUlkIG5vdCBleGlzdHMsIGdldCB0aGUgZmlyc3Qgb25lLlxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRpZiBpc1VuU2FmZU1vZGVcblx0XHRcdFx0c3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7dXNlcjogdXNlcklkfSwge2ZpZWxkczogc3VGaWVsZHN9KVxuXHRcdFx0XHRpZiAhc3Vcblx0XHRcdFx0XHRyZXR1cm4gbnVsbFxuXHRcdFx0XHRzcGFjZUlkID0gc3Uuc3BhY2Vcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIG51bGxcblxuXHRcdFVTRVJfQ09OVEVYVCA9IHt9XG5cdFx0VVNFUl9DT05URVhULnVzZXJJZCA9IHVzZXJJZFxuXHRcdFVTRVJfQ09OVEVYVC5zcGFjZUlkID0gc3BhY2VJZFxuXHRcdFVTRVJfQ09OVEVYVC51c2VyID0ge1xuXHRcdFx0X2lkOiB1c2VySWRcblx0XHRcdG5hbWU6IHN1Lm5hbWUsXG5cdFx0XHRtb2JpbGU6IHN1Lm1vYmlsZSxcblx0XHRcdHBvc2l0aW9uOiBzdS5wb3NpdGlvbixcblx0XHRcdGVtYWlsOiBzdS5lbWFpbFxuXHRcdFx0Y29tcGFueTogc3UuY29tcGFueVxuXHRcdFx0Y29tcGFueV9pZDogc3UuY29tcGFueV9pZFxuXHRcdFx0Y29tcGFueV9pZHM6IHN1LmNvbXBhbnlfaWRzXG5cdFx0fVxuXHRcdHNwYWNlX3VzZXJfb3JnID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib3JnYW5pemF0aW9uc1wiKT8uZmluZE9uZShzdS5vcmdhbml6YXRpb24pXG5cdFx0aWYgc3BhY2VfdXNlcl9vcmdcblx0XHRcdFVTRVJfQ09OVEVYVC51c2VyLm9yZ2FuaXphdGlvbiA9IHtcblx0XHRcdFx0X2lkOiBzcGFjZV91c2VyX29yZy5faWQsXG5cdFx0XHRcdG5hbWU6IHNwYWNlX3VzZXJfb3JnLm5hbWUsXG5cdFx0XHRcdGZ1bGxuYW1lOiBzcGFjZV91c2VyX29yZy5mdWxsbmFtZVxuXHRcdFx0fVxuXHRcdHJldHVybiBVU0VSX0NPTlRFWFRcblxuQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCA9ICh1cmwpLT5cblxuXHRpZiBfLmlzRnVuY3Rpb24oU3RlZWRvcy5pc0NvcmRvdmEpICYmIFN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgKHVybD8uc3RhcnRzV2l0aChcIi9hc3NldHNcIikgfHwgdXJsPy5zdGFydHNXaXRoKFwiYXNzZXRzXCIpIHx8IHVybD8uc3RhcnRzV2l0aChcIi9wYWNrYWdlc1wiKSlcblx0XHRpZiAhL15cXC8vLnRlc3QodXJsKVxuXHRcdFx0dXJsID0gXCIvXCIgKyB1cmxcblx0XHRyZXR1cm4gdXJsXG5cblx0aWYgdXJsXG5cdFx0IyB1cmzlvIDlpLTmsqHmnIlcIi9cIu+8jOmcgOimgea3u+WKoFwiL1wiXG5cdFx0aWYgIS9eXFwvLy50ZXN0KHVybClcblx0XHRcdHVybCA9IFwiL1wiICsgdXJsXG5cdFx0cmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVggKyB1cmxcblx0ZWxzZVxuXHRcdHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYXG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZCA9ICh1c2VySWQsIHNwYWNlSWQpLT5cblx0dXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpXG5cdGVsc2Vcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKVxuXHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge2NvbXBhbnlfaWQ6MX19KVxuXHRyZXR1cm4gc3UuY29tcGFueV9pZFxuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWRzID0gKHVzZXJJZCwgc3BhY2VJZCktPlxuXHR1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJylcblx0ZWxzZVxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpXG5cdHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7Y29tcGFueV9pZHM6MX19KVxuXHRyZXR1cm4gc3U/LmNvbXBhbnlfaWRzXG5cbkNyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zID0gKHBvKS0+XG5cdGlmIHBvLmFsbG93Q3JlYXRlXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0VkaXRcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLmFsbG93RGVsZXRlXG5cdFx0cG8uYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8udmlld0FsbFJlY29yZHNcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLm1vZGlmeUFsbFJlY29yZHNcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdFx0cG8uYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdHBvLmFsbG93RGVsZXRlID0gdHJ1ZVxuXHRcdHBvLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZVxuXHRpZiBwby52aWV3Q29tcGFueVJlY29yZHNcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcblx0XHRwby5hbGxvd0RlbGV0ZSA9IHRydWVcblx0XHRwby52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlXG5cdHJldHVybiBwb1xuXG5DcmVhdG9yLmdldFRlbXBsYXRlU3BhY2VJZCA9ICgpLT5cblx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnRlbXBsYXRlU3BhY2VJZFxuXG5DcmVhdG9yLmdldENsb3VkQWRtaW5TcGFjZUlkID0gKCktPlxuXHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8uY2xvdWRBZG1pblNwYWNlSWRcblxuQ3JlYXRvci5pc1RlbXBsYXRlU3BhY2UgPSAoc3BhY2VJZCktPlxuXHRpZiBzcGFjZUlkICYmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnRlbXBsYXRlU3BhY2VJZCA9PSBzcGFjZUlkXG5cdFx0cmV0dXJuIHRydWVcblx0cmV0dXJuIGZhbHNlXG5cbkNyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UgPSAoc3BhY2VJZCktPlxuXHRpZiBzcGFjZUlkICYmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LmNsb3VkQWRtaW5TcGFjZUlkID09IHNwYWNlSWRcblx0XHRyZXR1cm4gdHJ1ZVxuXHRyZXR1cm4gZmFsc2VcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSXG5cdCIsInZhciBGaWJlcjtcblxuQ3JlYXRvci5kZXBzID0ge1xuICBhcHA6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3ksXG4gIG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxufTtcblxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XG4gIEFwcHM6IHt9LFxuICBPYmplY3RzOiB7fVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBmaWx0ZXJzRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbiAgU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIG9wdGlvbnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xuICByZXR1cm4gU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIGNyZWF0ZUZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG59KTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuICBDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMgPSBmdW5jdGlvbihvYmosIG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSk7XG4gICAgfSkucnVuKCk7XG4gIH07XG59XG5cbkNyZWF0b3IubG9hZE9iamVjdHMgPSBmdW5jdGlvbihvYmosIG9iamVjdF9uYW1lKSB7XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IG9iai5uYW1lO1xuICB9XG4gIGlmICghb2JqLmxpc3Rfdmlld3MpIHtcbiAgICBvYmoubGlzdF92aWV3cyA9IHt9O1xuICB9XG4gIGlmIChvYmouc3BhY2UpIHtcbiAgICBvYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUgPT09ICdjZnNfZmlsZXNfZmlsZXJlY29yZCcpIHtcbiAgICBvYmplY3RfbmFtZSA9ICdjZnMuZmlsZXMuZmlsZXJlY29yZCc7XG4gICAgb2JqID0gXy5jbG9uZShvYmopO1xuICAgIG9iai5uYW1lID0gb2JqZWN0X25hbWU7XG4gICAgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSA9IG9iajtcbiAgfVxuICBDcmVhdG9yLmNvbnZlcnRPYmplY3Qob2JqKTtcbiAgbmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XG4gIENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKTtcbiAgQ3JlYXRvci5pbml0TGlzdFZpZXdzKG9iamVjdF9uYW1lKTtcbiAgcmV0dXJuIG9iajtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0TmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0LnNwYWNlKSB7XG4gICAgcmV0dXJuIFwiY19cIiArIG9iamVjdC5zcGFjZSArIFwiX1wiICsgb2JqZWN0Lm5hbWU7XG4gIH1cbiAgcmV0dXJuIG9iamVjdC5uYW1lO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpIHtcbiAgdmFyIHJlZiwgcmVmMTtcbiAgaWYgKF8uaXNBcnJheShvYmplY3RfbmFtZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICgocmVmID0gQ3JlYXRvci5kZXBzKSAhPSBudWxsKSB7XG4gICAgICBpZiAoKHJlZjEgPSByZWYub2JqZWN0KSAhPSBudWxsKSB7XG4gICAgICAgIHJlZjEuZGVwZW5kKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICghb2JqZWN0X25hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEJ5SWQgPSBmdW5jdGlvbihvYmplY3RfaWQpIHtcbiAgcmV0dXJuIF8uZmluZFdoZXJlKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwge1xuICAgIF9pZDogb2JqZWN0X2lkXG4gIH0pO1xufTtcblxuQ3JlYXRvci5yZW1vdmVPYmplY3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICBjb25zb2xlLmxvZyhcInJlbW92ZU9iamVjdFwiLCBvYmplY3RfbmFtZSk7XG4gIGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICByZXR1cm4gZGVsZXRlIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV07XG59O1xuXG5DcmVhdG9yLmdldENvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zWyhyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCkpICE9IG51bGwgPyByZWYuX2NvbGxlY3Rpb25fbmFtZSA6IHZvaWQgMF07XG4gIH1cbn07XG5cbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHJldHVybiBkZWxldGUgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV07XG59O1xuXG5DcmVhdG9yLmlzU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgcmVmLCByZWYxLCBzcGFjZTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgc3BhY2UgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3QoXCJzcGFjZXNcIikpICE9IG51bGwgPyAocmVmMSA9IHJlZi5kYikgIT0gbnVsbCA/IHJlZjEuZmluZE9uZShzcGFjZUlkLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBhZG1pbnM6IDFcbiAgICB9XG4gIH0pIDogdm9pZCAwIDogdm9pZCAwO1xuICBpZiAoc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmFkbWlucyA6IHZvaWQgMCkge1xuICAgIHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDA7XG4gIH1cbn07XG5cbkNyZWF0b3IuZXZhbHVhdGVGb3JtdWxhID0gZnVuY3Rpb24oZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgaWYgKCFfLmlzU3RyaW5nKGZvcm11bGFyKSkge1xuICAgIHJldHVybiBmb3JtdWxhcjtcbiAgfVxuICBpZiAoQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZm9ybXVsYXIpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKTtcbiAgfVxuICByZXR1cm4gZm9ybXVsYXI7XG59O1xuXG5DcmVhdG9yLmV2YWx1YXRlRmlsdGVycyA9IGZ1bmN0aW9uKGZpbHRlcnMsIGNvbnRleHQpIHtcbiAgdmFyIHNlbGVjdG9yO1xuICBzZWxlY3RvciA9IHt9O1xuICBfLmVhY2goZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIGFjdGlvbiwgbmFtZSwgdmFsdWU7XG4gICAgaWYgKChmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci5sZW5ndGggOiB2b2lkIDApID09PSAzKSB7XG4gICAgICBuYW1lID0gZmlsdGVyWzBdO1xuICAgICAgYWN0aW9uID0gZmlsdGVyWzFdO1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIGNvbnRleHQpO1xuICAgICAgc2VsZWN0b3JbbmFtZV0gPSB7fTtcbiAgICAgIHJldHVybiBzZWxlY3RvcltuYW1lXVthY3Rpb25dID0gdmFsdWU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHNlbGVjdG9yO1xufTtcblxuQ3JlYXRvci5pc0NvbW1vblNwYWNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICByZXR1cm4gc3BhY2VJZCA9PT0gJ2NvbW1vbic7XG59O1xuXG5cbi8qXG5cdGRvY3PvvJrlvoXmjpLluo/nmoTmlofmoaPmlbDnu4Rcblx0aWRz77yaX2lk6ZuG5ZCIXG5cdGlkX2tleTog6buY6K6k5Li6X2lkXG5cdHJldHVybiDmjInnhadpZHPnmoTpobrluo/ov5Tlm57mlrDnmoTmlofmoaPpm4blkIhcbiAqL1xuXG5DcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyA9IGZ1bmN0aW9uKGRvY3MsIGlkcywgaWRfa2V5LCBoaXRfZmlyc3QpIHtcbiAgdmFyIHZhbHVlcztcbiAgaWYgKCFpZF9rZXkpIHtcbiAgICBpZF9rZXkgPSBcIl9pZFwiO1xuICB9XG4gIGlmIChoaXRfZmlyc3QpIHtcbiAgICB2YWx1ZXMgPSBkb2NzLmdldFByb3BlcnR5KGlkX2tleSk7XG4gICAgcmV0dXJuIF8uc29ydEJ5KGRvY3MsIGZ1bmN0aW9uKGRvYykge1xuICAgICAgdmFyIF9pbmRleDtcbiAgICAgIF9pbmRleCA9IGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKTtcbiAgICAgIGlmIChfaW5kZXggPiAtMSkge1xuICAgICAgICByZXR1cm4gX2luZGV4O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGlkcy5sZW5ndGggKyBfLmluZGV4T2YodmFsdWVzLCBkb2NbaWRfa2V5XSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF8uc29ydEJ5KGRvY3MsIGZ1bmN0aW9uKGRvYykge1xuICAgICAgcmV0dXJuIGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKTtcbiAgICB9KTtcbiAgfVxufTtcblxuXG4vKlxuXHTmjInnlKjmiLfmiYDlsZ7mnKzlnLDljJbor63oqIDov5vooYzmjpLluo/vvIzmlK/mjIHkuK3mlofjgIHmlbDlgLzjgIHml6XmnJ/nrYnlrZfmrrXmjpLluo9cblx05a+55LqOT2JqZWN057G75Z6L77yM5aaC5p6c5o+Q5L6b5L2c55So5Z+f5Lita2V55bGe5oCn77yM5YiZ5Y+W5YC85Li6dmFsdWVba2V5Xei/m+ihjOaOkuW6j+avlOi+g++8jOWPjeS5i+aVtOS4qk9iamVjdC50b1N0cmluZygp5ZCO5o6S5bqP5q+U6L6DXG4gKi9cblxuQ3JlYXRvci5zb3J0aW5nTWV0aG9kID0gZnVuY3Rpb24odmFsdWUxLCB2YWx1ZTIpIHtcbiAgdmFyIGlzVmFsdWUxRW1wdHksIGlzVmFsdWUyRW1wdHksIGxvY2FsZTtcbiAgaWYgKHRoaXMua2V5KSB7XG4gICAgdmFsdWUxID0gdmFsdWUxW3RoaXMua2V5XTtcbiAgICB2YWx1ZTIgPSB2YWx1ZTJbdGhpcy5rZXldO1xuICB9XG4gIGlmICh2YWx1ZTEgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgdmFsdWUxID0gdmFsdWUxLmdldFRpbWUoKTtcbiAgfVxuICBpZiAodmFsdWUyIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHZhbHVlMiA9IHZhbHVlMi5nZXRUaW1lKCk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZTEgPT09IFwibnVtYmVyXCIgJiYgdHlwZW9mIHZhbHVlMiA9PT0gXCJudW1iZXJcIikge1xuICAgIHJldHVybiB2YWx1ZTEgLSB2YWx1ZTI7XG4gIH1cbiAgaXNWYWx1ZTFFbXB0eSA9IHZhbHVlMSA9PT0gbnVsbCB8fCB2YWx1ZTEgPT09IHZvaWQgMDtcbiAgaXNWYWx1ZTJFbXB0eSA9IHZhbHVlMiA9PT0gbnVsbCB8fCB2YWx1ZTIgPT09IHZvaWQgMDtcbiAgaWYgKGlzVmFsdWUxRW1wdHkgJiYgIWlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgaWYgKGlzVmFsdWUxRW1wdHkgJiYgaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAwO1xuICB9XG4gIGlmICghaXNWYWx1ZTFFbXB0eSAmJiBpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgbG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKTtcbiAgcmV0dXJuIHZhbHVlMS50b1N0cmluZygpLmxvY2FsZUNvbXBhcmUodmFsdWUyLnRvU3RyaW5nKCksIGxvY2FsZSk7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIF9vYmplY3QsIHBlcm1pc3Npb25zLCByZWxhdGVkTGlzdCwgcmVsYXRlZExpc3RNYXAsIHJlbGF0ZWRfb2JqZWN0cztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gIH1cbiAgcmVsYXRlZF9vYmplY3RzID0gW107XG4gIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICBpZiAoIV9vYmplY3QpIHtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xuICB9XG4gIHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiAhXy5pc0VtcHR5KHJlbGF0ZWRMaXN0KSkge1xuICAgIHJlbGF0ZWRMaXN0TWFwID0ge307XG4gICAgXy5lYWNoKHJlbGF0ZWRMaXN0LCBmdW5jdGlvbihvYmpOYW1lKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChvYmpOYW1lKSkge1xuICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbb2JqTmFtZS5vYmplY3ROYW1lXSA9IHt9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW29iak5hbWVdID0ge307XG4gICAgICB9XG4gICAgfSk7XG4gICAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICAgIHJldHVybiBfLmVhY2gocmVsYXRlZF9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgICAgaWYgKChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIikgJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT09IG9iamVjdF9uYW1lICYmIHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdID0ge1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddKSB7XG4gICAgICByZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10gPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImNtc19maWxlc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJwYXJlbnRcIlxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXSkge1xuICAgICAgcmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddID0ge1xuICAgICAgICBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIixcbiAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiXG4gICAgICB9O1xuICAgIH1cbiAgICBfLmVhY2goWyd0YXNrcycsICdub3RlcycsICdldmVudHMnLCAnYXBwcm92YWxzJ10sIGZ1bmN0aW9uKGVuYWJsZU9iak5hbWUpIHtcbiAgICAgIGlmIChyZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSkge1xuICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbZW5hYmxlT2JqTmFtZV0gPSB7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IGVuYWJsZU9iak5hbWUsXG4gICAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10pIHtcbiAgICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSk7XG4gICAgICBpZiAoX29iamVjdC5lbmFibGVfYXVkaXQgJiYgKHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwKSkge1xuICAgICAgICByZWxhdGVkTGlzdE1hcFsnYXVkaXRfcmVjb3JkcyddID0ge1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBcImF1ZGl0X3JlY29yZHNcIixcbiAgICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVsYXRlZF9vYmplY3RzID0gXy52YWx1ZXMocmVsYXRlZExpc3RNYXApO1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdHM7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2ZpbGVzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJwYXJlbnRcIlxuICAgIH0pO1xuICB9XG4gIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIF8uZWFjaChyZWxhdGVkX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgICAgaWYgKChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiIHx8IChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIgJiYgcmVsYXRlZF9maWVsZC5yZWxhdGVkTGlzdCkpICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSkge1xuICAgICAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJvYmplY3RfZmllbGRzXCIpIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzLnNwbGljZSgwLCAwLCB7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgaWYgKF9vYmplY3QuZW5hYmxlX3Rhc2tzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwidGFza3NcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9ub3Rlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcIm5vdGVzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfZXZlbnRzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiZXZlbnRzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfaW5zdGFuY2VzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiaW5zdGFuY2VzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfYXBwcm92YWxzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiYXBwcm92YWxzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfcHJvY2Vzcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcInByb2Nlc3NfaW5zdGFuY2VfaGlzdG9yeVwiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwidGFyZ2V0X29iamVjdFwiXG4gICAgfSk7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSk7XG4gICAgaWYgKF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIChwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMCkpIHtcbiAgICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiYXVkaXRfcmVjb3Jkc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29udGV4dCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgaXNVblNhZmVNb2RlKSB7XG4gIHZhciBVU0VSX0NPTlRFWFQsIHJlZiwgc3BhY2VfdXNlcl9vcmcsIHN1LCBzdUZpZWxkcztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHJldHVybiBDcmVhdG9yLlVTRVJfQ09OVEVYVDtcbiAgfSBlbHNlIHtcbiAgICBpZiAoISh1c2VySWQgJiYgc3BhY2VJZCkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcInRoZSBwYXJhbXMgdXNlcklkIGFuZCBzcGFjZUlkIGlzIHJlcXVpcmVkIGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRVc2VyQ29udGV4dFwiKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBzdUZpZWxkcyA9IHtcbiAgICAgIG5hbWU6IDEsXG4gICAgICBtb2JpbGU6IDEsXG4gICAgICBwb3NpdGlvbjogMSxcbiAgICAgIGVtYWlsOiAxLFxuICAgICAgY29tcGFueTogMSxcbiAgICAgIG9yZ2FuaXphdGlvbjogMSxcbiAgICAgIHNwYWNlOiAxLFxuICAgICAgY29tcGFueV9pZDogMSxcbiAgICAgIGNvbXBhbnlfaWRzOiAxXG4gICAgfTtcbiAgICBzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgdXNlcjogdXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiBzdUZpZWxkc1xuICAgIH0pO1xuICAgIGlmICghc3UpIHtcbiAgICAgIHNwYWNlSWQgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIGlmIChpc1VuU2FmZU1vZGUpIHtcbiAgICAgICAgc3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHN1RmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXN1KSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3BhY2VJZCA9IHN1LnNwYWNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIFVTRVJfQ09OVEVYVCA9IHt9O1xuICAgIFVTRVJfQ09OVEVYVC51c2VySWQgPSB1c2VySWQ7XG4gICAgVVNFUl9DT05URVhULnNwYWNlSWQgPSBzcGFjZUlkO1xuICAgIFVTRVJfQ09OVEVYVC51c2VyID0ge1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBuYW1lOiBzdS5uYW1lLFxuICAgICAgbW9iaWxlOiBzdS5tb2JpbGUsXG4gICAgICBwb3NpdGlvbjogc3UucG9zaXRpb24sXG4gICAgICBlbWFpbDogc3UuZW1haWwsXG4gICAgICBjb21wYW55OiBzdS5jb21wYW55LFxuICAgICAgY29tcGFueV9pZDogc3UuY29tcGFueV9pZCxcbiAgICAgIGNvbXBhbnlfaWRzOiBzdS5jb21wYW55X2lkc1xuICAgIH07XG4gICAgc3BhY2VfdXNlcl9vcmcgPSAocmVmID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib3JnYW5pemF0aW9uc1wiKSkgIT0gbnVsbCA/IHJlZi5maW5kT25lKHN1Lm9yZ2FuaXphdGlvbikgOiB2b2lkIDA7XG4gICAgaWYgKHNwYWNlX3VzZXJfb3JnKSB7XG4gICAgICBVU0VSX0NPTlRFWFQudXNlci5vcmdhbml6YXRpb24gPSB7XG4gICAgICAgIF9pZDogc3BhY2VfdXNlcl9vcmcuX2lkLFxuICAgICAgICBuYW1lOiBzcGFjZV91c2VyX29yZy5uYW1lLFxuICAgICAgICBmdWxsbmFtZTogc3BhY2VfdXNlcl9vcmcuZnVsbG5hbWVcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBVU0VSX0NPTlRFWFQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRpdmVVcmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgaWYgKF8uaXNGdW5jdGlvbihTdGVlZG9zLmlzQ29yZG92YSkgJiYgU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAoKHVybCAhPSBudWxsID8gdXJsLnN0YXJ0c1dpdGgoXCIvYXNzZXRzXCIpIDogdm9pZCAwKSB8fCAodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcImFzc2V0c1wiKSA6IHZvaWQgMCkgfHwgKHVybCAhPSBudWxsID8gdXJsLnN0YXJ0c1dpdGgoXCIvcGFja2FnZXNcIikgOiB2b2lkIDApKSkge1xuICAgIGlmICghL15cXC8vLnRlc3QodXJsKSkge1xuICAgICAgdXJsID0gXCIvXCIgKyB1cmw7XG4gICAgfVxuICAgIHJldHVybiB1cmw7XG4gIH1cbiAgaWYgKHVybCkge1xuICAgIGlmICghL15cXC8vLnRlc3QodXJsKSkge1xuICAgICAgdXJsID0gXCIvXCIgKyB1cmw7XG4gICAgfVxuICAgIHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYICsgdXJsO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWQgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIHN1O1xuICB1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJyk7XG4gICAgfVxuICB9XG4gIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjb21wYW55X2lkOiAxXG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHN1LmNvbXBhbnlfaWQ7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWRzID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBzdTtcbiAgdXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJyk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpO1xuICAgIH1cbiAgfVxuICBzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICB1c2VyOiB1c2VySWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY29tcGFueV9pZHM6IDFcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3UgIT0gbnVsbCA/IHN1LmNvbXBhbnlfaWRzIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgPSBmdW5jdGlvbihwbykge1xuICBpZiAocG8uYWxsb3dDcmVhdGUpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0VkaXQpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0RlbGV0ZSkge1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0FsbFJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93RGVsZXRlID0gdHJ1ZTtcbiAgICBwby52aWV3QWxsUmVjb3JkcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93RGVsZXRlID0gdHJ1ZTtcbiAgICBwby52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlO1xuICB9XG4gIHJldHVybiBwbztcbn07XG5cbkNyZWF0b3IuZ2V0VGVtcGxhdGVTcGFjZUlkID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLnRlbXBsYXRlU3BhY2VJZCA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuZ2V0Q2xvdWRBZG1pblNwYWNlSWQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYuY2xvdWRBZG1pblNwYWNlSWQgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmlzVGVtcGxhdGVTcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKHNwYWNlSWQgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYudGVtcGxhdGVTcGFjZUlkIDogdm9pZCAwKSA9PT0gc3BhY2VJZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkNyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHZhciByZWY7XG4gIGlmIChzcGFjZUlkICYmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLmNsb3VkQWRtaW5TcGFjZUlkIDogdm9pZCAwKSA9PT0gc3BhY2VJZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVI7XG59XG4iLCJNZXRlb3IubWV0aG9kc1xuXHQjIOeUqOaIt+iOt+WPlmxvb2t1cCDjgIFtYXN0ZXJfZGV0YWls57G75Z6L5a2X5q6155qE6YCJ6aG55YC8XG5cdFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiOiAob3B0aW9ucyktPlxuXHRcdGlmIG9wdGlvbnM/LnBhcmFtcz8ucmVmZXJlbmNlX3RvXG5cblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9wdGlvbnMucGFyYW1zLnJlZmVyZW5jZV90bywgb3B0aW9ucy5wYXJhbXMuc3BhY2UpXG5cblx0XHRcdG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZXG5cblx0XHRcdHF1ZXJ5ID0ge31cblx0XHRcdGlmIG9wdGlvbnMucGFyYW1zLnNwYWNlXG5cdFx0XHRcdHF1ZXJ5LnNwYWNlID0gb3B0aW9ucy5wYXJhbXMuc3BhY2VcblxuXHRcdFx0XHRzb3J0ID0gb3B0aW9ucz8uc29ydFxuXG5cdFx0XHRcdHNlbGVjdGVkID0gb3B0aW9ucz8uc2VsZWN0ZWQgfHwgW11cblxuXHRcdFx0XHRvcHRpb25zX2xpbWl0ID0gb3B0aW9ucz8ub3B0aW9uc19saW1pdCB8fCAxMFxuXG5cdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdFx0XHRcdHNlYXJjaFRleHRRdWVyeSA9IHt9XG5cdFx0XHRcdFx0c2VhcmNoVGV4dFF1ZXJ5W25hbWVfZmllbGRfa2V5XSA9IHskcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dH1cblxuXHRcdFx0XHRpZiBvcHRpb25zPy52YWx1ZXM/Lmxlbmd0aFxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdFx0XHRcdFx0cXVlcnkuJG9yID0gW3tfaWQ6IHskaW46IG9wdGlvbnMudmFsdWVzfX0sIHNlYXJjaFRleHRRdWVyeV1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRxdWVyeS4kb3IgPSBbe19pZDogeyRpbjogb3B0aW9ucy52YWx1ZXN9fV1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdFx0XHRcdFx0Xy5leHRlbmQocXVlcnksIHNlYXJjaFRleHRRdWVyeSlcblx0XHRcdFx0XHRxdWVyeS5faWQgPSB7JG5pbjogc2VsZWN0ZWR9XG5cblx0XHRcdFx0Y29sbGVjdGlvbiA9IG9iamVjdC5kYlxuXG5cdFx0XHRcdGlmIG9wdGlvbnMuZmlsdGVyUXVlcnlcblx0XHRcdFx0XHRfLmV4dGVuZCBxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeVxuXG5cdFx0XHRcdHF1ZXJ5X29wdGlvbnMgPSB7bGltaXQ6IG9wdGlvbnNfbGltaXR9XG5cblx0XHRcdFx0aWYgc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpXG5cdFx0XHRcdFx0cXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydFxuXG5cdFx0XHRcdGlmIGNvbGxlY3Rpb25cblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdHJlY29yZHMgPSBjb2xsZWN0aW9uLmZpbmQocXVlcnksIHF1ZXJ5X29wdGlvbnMpLmZldGNoKClcblx0XHRcdFx0XHRcdHJlc3VsdHMgPSBbXVxuXHRcdFx0XHRcdFx0Xy5lYWNoIHJlY29yZHMsIChyZWNvcmQpLT5cblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoXG5cdFx0XHRcdFx0XHRcdFx0bGFiZWw6IHJlY29yZFtuYW1lX2ZpZWxkX2tleV1cblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogcmVjb3JkLl9pZFxuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHNcblx0XHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgZS5tZXNzYWdlICsgXCItLT5cIiArIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpXG5cdFx0cmV0dXJuIFtdICIsIk1ldGVvci5tZXRob2RzKHtcbiAgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZSwgbmFtZV9maWVsZF9rZXksIG9iamVjdCwgb3B0aW9uc19saW1pdCwgcXVlcnksIHF1ZXJ5X29wdGlvbnMsIHJlY29yZHMsIHJlZiwgcmVmMSwgcmVzdWx0cywgc2VhcmNoVGV4dFF1ZXJ5LCBzZWxlY3RlZCwgc29ydDtcbiAgICBpZiAob3B0aW9ucyAhPSBudWxsID8gKHJlZiA9IG9wdGlvbnMucGFyYW1zKSAhPSBudWxsID8gcmVmLnJlZmVyZW5jZV90byA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob3B0aW9ucy5wYXJhbXMucmVmZXJlbmNlX3RvLCBvcHRpb25zLnBhcmFtcy5zcGFjZSk7XG4gICAgICBuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgICAgIHF1ZXJ5ID0ge307XG4gICAgICBpZiAob3B0aW9ucy5wYXJhbXMuc3BhY2UpIHtcbiAgICAgICAgcXVlcnkuc3BhY2UgPSBvcHRpb25zLnBhcmFtcy5zcGFjZTtcbiAgICAgICAgc29ydCA9IG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc29ydCA6IHZvaWQgMDtcbiAgICAgICAgc2VsZWN0ZWQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zZWxlY3RlZCA6IHZvaWQgMCkgfHwgW107XG4gICAgICAgIG9wdGlvbnNfbGltaXQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5vcHRpb25zX2xpbWl0IDogdm9pZCAwKSB8fCAxMDtcbiAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7XG4gICAgICAgICAgICAkcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYxID0gb3B0aW9ucy52YWx1ZXMpICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIHF1ZXJ5LiRvciA9IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgJGluOiBvcHRpb25zLnZhbHVlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSwgc2VhcmNoVGV4dFF1ZXJ5XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKHF1ZXJ5LCBzZWFyY2hUZXh0UXVlcnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxdWVyeS5faWQgPSB7XG4gICAgICAgICAgICAkbmluOiBzZWxlY3RlZFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY29sbGVjdGlvbiA9IG9iamVjdC5kYjtcbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsdGVyUXVlcnkpIHtcbiAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeSk7XG4gICAgICAgIH1cbiAgICAgICAgcXVlcnlfb3B0aW9ucyA9IHtcbiAgICAgICAgICBsaW1pdDogb3B0aW9uc19saW1pdFxuICAgICAgICB9O1xuICAgICAgICBpZiAoc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpKSB7XG4gICAgICAgICAgcXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpO1xuICAgICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgXy5lYWNoKHJlY29yZHMsIGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBsYWJlbDogcmVjb3JkW25hbWVfZmllbGRfa2V5XSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVjb3JkLl9pZFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlLm1lc3NhZ2UgKyBcIi0tPlwiICsgSlNPTi5zdHJpbmdpZnkob3B0aW9ucykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgJ3Bvc3QnLCAnL2FwaS93b3JrZmxvdy92aWV3LzppbnN0YW5jZUlkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblx0XHRjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpXG5cdFx0Y3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkXG5cblx0XHRoYXNoRGF0YSA9IHJlcS5ib2R5XG5cdFx0b2JqZWN0X25hbWUgPSBoYXNoRGF0YS5vYmplY3RfbmFtZVxuXHRcdHJlY29yZF9pZCA9IGhhc2hEYXRhLnJlY29yZF9pZFxuXHRcdHNwYWNlX2lkID0gaGFzaERhdGEuc3BhY2VfaWRcblxuXHRcdGNoZWNrIG9iamVjdF9uYW1lLCBTdHJpbmdcblx0XHRjaGVjayByZWNvcmRfaWQsIFN0cmluZ1xuXHRcdGNoZWNrIHNwYWNlX2lkLCBTdHJpbmdcblxuXHRcdGluc0lkID0gcmVxLnBhcmFtcy5pbnN0YW5jZUlkXG5cdFx0eF91c2VyX2lkID0gcmVxLnF1ZXJ5WydYLVVzZXItSWQnXVxuXHRcdHhfYXV0aF90b2tlbiA9IHJlcS5xdWVyeVsnWC1BdXRoLVRva2VuJ11cblxuXHRcdHJlZGlyZWN0X3VybCA9IFwiL1wiXG5cdFx0aW5zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS5maW5kT25lKGluc0lkKVxuXHRcdCMgLSDmiJHnmoTojYnnqL/lsLHot7Povazoh7PojYnnqL/nrrFcblx0XHQjIC0g5oiR55qE5b6F5a6h5qC45bCx6Lez6L2s6Iez5b6F5a6h5qC4XG5cdFx0IyAtIOS4jeaYr+aIkeeahOeUs+ivt+WNleWImei3s+i9rOiHs+aJk+WNsOmhtemdolxuXHRcdCMgLSDlpoLnlLPor7fljZXkuI3lrZjlnKjliJnmj5DnpLrnlKjmiLfnlLPor7fljZXlt7LliKDpmaTvvIzlubbkuJTmm7TmlrByZWNvcmTnmoTnirbmgIHvvIzkvb/nlKjmiLflj6/ku6Xph43mlrDlj5HotbflrqHmiblcblx0XHRpZiBpbnNcblx0XHRcdGJveCA9ICcnXG5cdFx0XHRzcGFjZUlkID0gaW5zLnNwYWNlXG5cdFx0XHRmbG93SWQgPSBpbnMuZmxvd1xuXG5cdFx0XHRpZiAoaW5zLmluYm94X3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWQpIG9yIChpbnMuY2NfdXNlcnM/LmluY2x1ZGVzIGN1cnJlbnRfdXNlcl9pZClcblx0XHRcdFx0Ym94ID0gJ2luYm94J1xuXHRcdFx0ZWxzZSBpZiBpbnMub3V0Ym94X3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWRcblx0XHRcdFx0Ym94ID0gJ291dGJveCdcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdkcmFmdCcgYW5kIGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkXG5cdFx0XHRcdGJveCA9ICdkcmFmdCdcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdwZW5kaW5nJyBhbmQgKGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkIG9yIGlucy5hcHBsaWNhbnQgaXMgY3VycmVudF91c2VyX2lkKVxuXHRcdFx0XHRib3ggPSAncGVuZGluZydcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdjb21wbGV0ZWQnIGFuZCBpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZFxuXHRcdFx0XHRib3ggPSAnY29tcGxldGVkJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHQjIOmqjOivgWxvZ2luIHVzZXJfaWTlr7nor6XmtYHnqIvmnInnrqHnkIbjgIHop4Llr5/nlLPor7fljZXnmoTmnYPpmZBcblx0XHRcdFx0cGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd0lkLCBjdXJyZW50X3VzZXJfaWQpXG5cdFx0XHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCwgeyBmaWVsZHM6IHsgYWRtaW5zOiAxIH0gfSlcblx0XHRcdFx0aWYgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZG1pblwiKSBvciBwZXJtaXNzaW9ucy5pbmNsdWRlcyhcIm1vbml0b3JcIikgb3Igc3BhY2UuYWRtaW5zLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZClcblx0XHRcdFx0XHRib3ggPSAnbW9uaXRvcidcblx0XHRcdHdvcmtmbG93VXJsID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcz8ud29ya2Zsb3c/LnVybFxuXHRcdFx0aWYgYm94XG5cdFx0XHRcdHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJykgKyBcIndvcmtmbG93L3NwYWNlLyN7c3BhY2VJZH0vI3tib3h9LyN7aW5zSWR9P1gtVXNlci1JZD0je3hfdXNlcl9pZH0mWC1BdXRoLVRva2VuPSN7eF9hdXRoX3Rva2VufVwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJykgKyBcIndvcmtmbG93L3NwYWNlLyN7c3BhY2VJZH0vcHJpbnQvI3tpbnNJZH0/Ym94PW1vbml0b3ImcHJpbnRfaXNfc2hvd190cmFjZXM9MSZwcmludF9pc19zaG93X2F0dGFjaG1lbnRzPTEmWC1Vc2VyLUlkPSN7eF91c2VyX2lkfSZYLUF1dGgtVG9rZW49I3t4X2F1dGhfdG9rZW59XCJcblxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0XHRjb2RlOiAyMDBcblx0XHRcdFx0ZGF0YTogeyByZWRpcmVjdF91cmw6IHJlZGlyZWN0X3VybCB9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm5cblx0XHRlbHNlXG5cdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZClcblx0XHRcdGlmIGNvbGxlY3Rpb25cblx0XHRcdFx0Y29sbGVjdGlvbi51cGRhdGUocmVjb3JkX2lkLCB7XG5cdFx0XHRcdFx0JHVuc2V0OiB7XG5cdFx0XHRcdFx0XHRcImluc3RhbmNlc1wiOiAxLFxuXHRcdFx0XHRcdFx0XCJpbnN0YW5jZV9zdGF0ZVwiOiAxXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yJywgJ+eUs+ivt+WNleW3suWIoOmZpCcpXG5cblx0Y2F0Y2ggZVxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdGNvZGU6IDIwMFxuXHRcdFx0ZGF0YTogeyBlcnJvcnM6IFt7IGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlIH1dIH1cblx0XHR9XG5cbiIsIkpzb25Sb3V0ZXMuYWRkKCdwb3N0JywgJy9hcGkvd29ya2Zsb3cvdmlldy86aW5zdGFuY2VJZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBib3gsIGNvbGxlY3Rpb24sIGN1cnJlbnRfdXNlcl9pZCwgY3VycmVudF91c2VyX2luZm8sIGUsIGZsb3dJZCwgaGFzaERhdGEsIGlucywgaW5zSWQsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9ucywgcmVjb3JkX2lkLCByZWRpcmVjdF91cmwsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgc3BhY2UsIHNwYWNlSWQsIHNwYWNlX2lkLCB3b3JrZmxvd1VybCwgeF9hdXRoX3Rva2VuLCB4X3VzZXJfaWQ7XG4gIHRyeSB7XG4gICAgY3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKTtcbiAgICBjdXJyZW50X3VzZXJfaWQgPSBjdXJyZW50X3VzZXJfaW5mby5faWQ7XG4gICAgaGFzaERhdGEgPSByZXEuYm9keTtcbiAgICBvYmplY3RfbmFtZSA9IGhhc2hEYXRhLm9iamVjdF9uYW1lO1xuICAgIHJlY29yZF9pZCA9IGhhc2hEYXRhLnJlY29yZF9pZDtcbiAgICBzcGFjZV9pZCA9IGhhc2hEYXRhLnNwYWNlX2lkO1xuICAgIGNoZWNrKG9iamVjdF9uYW1lLCBTdHJpbmcpO1xuICAgIGNoZWNrKHJlY29yZF9pZCwgU3RyaW5nKTtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICBpbnNJZCA9IHJlcS5wYXJhbXMuaW5zdGFuY2VJZDtcbiAgICB4X3VzZXJfaWQgPSByZXEucXVlcnlbJ1gtVXNlci1JZCddO1xuICAgIHhfYXV0aF90b2tlbiA9IHJlcS5xdWVyeVsnWC1BdXRoLVRva2VuJ107XG4gICAgcmVkaXJlY3RfdXJsID0gXCIvXCI7XG4gICAgaW5zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS5maW5kT25lKGluc0lkKTtcbiAgICBpZiAoaW5zKSB7XG4gICAgICBib3ggPSAnJztcbiAgICAgIHNwYWNlSWQgPSBpbnMuc3BhY2U7XG4gICAgICBmbG93SWQgPSBpbnMuZmxvdztcbiAgICAgIGlmICgoKHJlZiA9IGlucy5pbmJveF91c2VycykgIT0gbnVsbCA/IHJlZi5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSB8fCAoKHJlZjEgPSBpbnMuY2NfdXNlcnMpICE9IG51bGwgPyByZWYxLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApKSB7XG4gICAgICAgIGJveCA9ICdpbmJveCc7XG4gICAgICB9IGVsc2UgaWYgKChyZWYyID0gaW5zLm91dGJveF91c2VycykgIT0gbnVsbCA/IHJlZjIuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkge1xuICAgICAgICBib3ggPSAnb3V0Ym94JztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAnZHJhZnQnICYmIGlucy5zdWJtaXR0ZXIgPT09IGN1cnJlbnRfdXNlcl9pZCkge1xuICAgICAgICBib3ggPSAnZHJhZnQnO1xuICAgICAgfSBlbHNlIGlmIChpbnMuc3RhdGUgPT09ICdwZW5kaW5nJyAmJiAoaW5zLnN1Ym1pdHRlciA9PT0gY3VycmVudF91c2VyX2lkIHx8IGlucy5hcHBsaWNhbnQgPT09IGN1cnJlbnRfdXNlcl9pZCkpIHtcbiAgICAgICAgYm94ID0gJ3BlbmRpbmcnO1xuICAgICAgfSBlbHNlIGlmIChpbnMuc3RhdGUgPT09ICdjb21wbGV0ZWQnICYmIGlucy5zdWJtaXR0ZXIgPT09IGN1cnJlbnRfdXNlcl9pZCkge1xuICAgICAgICBib3ggPSAnY29tcGxldGVkJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dJZCwgY3VycmVudF91c2VyX2lkKTtcbiAgICAgICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkLCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBhZG1pbnM6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZG1pblwiKSB8fCBwZXJtaXNzaW9ucy5pbmNsdWRlcyhcIm1vbml0b3JcIikgfHwgc3BhY2UuYWRtaW5zLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkpIHtcbiAgICAgICAgICBib3ggPSAnbW9uaXRvcic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHdvcmtmbG93VXJsID0gKHJlZjMgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMpICE9IG51bGwgPyAocmVmNCA9IHJlZjMud29ya2Zsb3cpICE9IG51bGwgPyByZWY0LnVybCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChib3gpIHtcbiAgICAgICAgcmVkaXJlY3RfdXJsID0gKHdvcmtmbG93VXJsIHx8ICcnKSArIChcIndvcmtmbG93L3NwYWNlL1wiICsgc3BhY2VJZCArIFwiL1wiICsgYm94ICsgXCIvXCIgKyBpbnNJZCArIFwiP1gtVXNlci1JZD1cIiArIHhfdXNlcl9pZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIHhfYXV0aF90b2tlbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWRpcmVjdF91cmwgPSAod29ya2Zsb3dVcmwgfHwgJycpICsgKFwid29ya2Zsb3cvc3BhY2UvXCIgKyBzcGFjZUlkICsgXCIvcHJpbnQvXCIgKyBpbnNJZCArIFwiP2JveD1tb25pdG9yJnByaW50X2lzX3Nob3dfdHJhY2VzPTEmcHJpbnRfaXNfc2hvd19hdHRhY2htZW50cz0xJlgtVXNlci1JZD1cIiArIHhfdXNlcl9pZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIHhfYXV0aF90b2tlbik7XG4gICAgICB9XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlZGlyZWN0X3VybDogcmVkaXJlY3RfdXJsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCk7XG4gICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICBjb2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRfaWQsIHtcbiAgICAgICAgICAkdW5zZXQ6IHtcbiAgICAgICAgICAgIFwiaW5zdGFuY2VzXCI6IDEsXG4gICAgICAgICAgICBcImluc3RhbmNlX3N0YXRlXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvcicsICfnlLPor7fljZXlt7LliKDpmaQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRJbml0V2lkdGhQZXJjZW50ID0gKG9iamVjdF9uYW1lLCBjb2x1bW5zKSAtPlxuXHRfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpPy5fc2NoZW1hXG5cdGNvbHVtbl9udW0gPSAwXG5cdGlmIF9zY2hlbWFcblx0XHRfLmVhY2ggY29sdW1ucywgKGZpZWxkX25hbWUpIC0+XG5cdFx0XHRmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKVxuXHRcdFx0aXNfd2lkZSA9IGZpZWxkW2ZpZWxkX25hbWVdPy5hdXRvZm9ybT8uaXNfd2lkZVxuXHRcdFx0aWYgaXNfd2lkZVxuXHRcdFx0XHRjb2x1bW5fbnVtICs9IDJcblx0XHRcdGVsc2Vcblx0XHRcdFx0Y29sdW1uX251bSArPSAxXG5cblx0XHRpbml0X3dpZHRoX3BlcmNlbnQgPSAxMDAgLyBjb2x1bW5fbnVtXG5cdFx0cmV0dXJuIGluaXRfd2lkdGhfcGVyY2VudFxuXG5DcmVhdG9yLmdldEZpZWxkSXNXaWRlID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lKSAtPlxuXHRfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpLl9zY2hlbWFcblx0aWYgX3NjaGVtYVxuXHRcdGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpXG5cdFx0aXNfd2lkZSA9IGZpZWxkW2ZpZWxkX25hbWVdPy5hdXRvZm9ybT8uaXNfd2lkZVxuXHRcdHJldHVybiBpc193aWRlXG5cbkNyZWF0b3IuZ2V0VGFidWxhck9yZGVyID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbnMpIC0+XG5cdHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zPy5zZXR0aW5ncz8uZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wifSlcblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGNvbHVtbnMgPSBfLm1hcCBjb2x1bW5zLCAoY29sdW1uKS0+XG5cdFx0ZmllbGQgPSBvYmouZmllbGRzW2NvbHVtbl1cblx0XHRpZiBmaWVsZD8udHlwZSBhbmQgIWZpZWxkLmhpZGRlblxuXHRcdFx0cmV0dXJuIGNvbHVtblxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB1bmRlZmluZWRcblx0Y29sdW1ucyA9IF8uY29tcGFjdCBjb2x1bW5zXG5cdGlmIHNldHRpbmcgYW5kIHNldHRpbmcuc2V0dGluZ3Ncblx0XHRzb3J0ID0gc2V0dGluZy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdPy5zb3J0IHx8IFtdXG5cdFx0c29ydCA9IF8ubWFwIHNvcnQsIChvcmRlciktPlxuXHRcdFx0a2V5ID0gb3JkZXJbMF1cblx0XHRcdGluZGV4ID0gXy5pbmRleE9mKGNvbHVtbnMsIGtleSlcblx0XHRcdG9yZGVyWzBdID0gaW5kZXggKyAxXG5cdFx0XHRyZXR1cm4gb3JkZXJcblx0XHRyZXR1cm4gc29ydFxuXHRyZXR1cm4gW11cblxuXG5DcmVhdG9yLmluaXRMaXN0Vmlld3MgPSAob2JqZWN0X25hbWUpLT5cblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXG5cdGV4dHJhX2NvbHVtbnMgPSBbXCJvd25lclwiXVxuXHRkZWZhdWx0X2V4dHJhX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm93bmVyXCJdXG5cdGlmIGRlZmF1bHRfZXh0cmFfY29sdW1uc1xuXHRcdGV4dHJhX2NvbHVtbnMgPSBfLnVuaW9uIGV4dHJhX2NvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1uc1xuXG5cdG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChvYmplY3RfbmFtZSkgfHwgW11cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0Q3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHM/W29iamVjdF9uYW1lXSA9IFtdXG5cbkNyZWF0b3IuY29udmVydExpc3RWaWV3ID0gKGRlZmF1bHRfdmlldywgbGlzdF92aWV3LCBsaXN0X3ZpZXdfbmFtZSktPlxuXHRkZWZhdWx0X2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXc/LmNvbHVtbnNcblx0ZGVmYXVsdF9tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfdmlldz8ubW9iaWxlX2NvbHVtbnNcblx0dW5sZXNzIGxpc3Rfdmlld1xuXHRcdHJldHVyblxuXHRvaXRlbSA9IF8uY2xvbmUobGlzdF92aWV3KVxuXHRpZiAhXy5oYXMob2l0ZW0sIFwibmFtZVwiKVxuXHRcdG9pdGVtLm5hbWUgPSBsaXN0X3ZpZXdfbmFtZVxuXHRpZiAhb2l0ZW0uY29sdW1uc1xuXHRcdGlmIGRlZmF1bHRfY29sdW1uc1xuXHRcdFx0b2l0ZW0uY29sdW1ucyA9IGRlZmF1bHRfY29sdW1uc1xuXHRpZiAhb2l0ZW0uY29sdW1uc1xuXHRcdG9pdGVtLmNvbHVtbnMgPSBbXCJuYW1lXCJdXG5cdGlmICFvaXRlbS5tb2JpbGVfY29sdW1uc1xuXHRcdGlmIGRlZmF1bHRfbW9iaWxlX2NvbHVtbnNcblx0XHRcdG9pdGVtLm1vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF9tb2JpbGVfY29sdW1uc1xuXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmIENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSAmJiAhXy5pbmNsdWRlKG9pdGVtLmNvbHVtbnMsICdzcGFjZScpXG5cdFx0XHRvaXRlbS5jb2x1bW5zLnB1c2goJ3NwYWNlJylcblxuXG5cdGlmICFvaXRlbS5maWx0ZXJfc2NvcGVcblx0XHQjIGxpc3R2aWV36KeG5Zu+55qEZmlsdGVyX3Njb3Bl6buY6K6k5YC85pS55Li6c3BhY2UgIzEzMVxuXHRcdG9pdGVtLmZpbHRlcl9zY29wZSA9IFwic3BhY2VcIlxuXG5cdGlmICFfLmhhcyhvaXRlbSwgXCJfaWRcIilcblx0XHRvaXRlbS5faWQgPSBsaXN0X3ZpZXdfbmFtZVxuXHRlbHNlXG5cdFx0b2l0ZW0ubGFiZWwgPSBvaXRlbS5sYWJlbCB8fCBsaXN0X3ZpZXcubmFtZVxuXG5cdGlmIF8uaXNTdHJpbmcob2l0ZW0ub3B0aW9ucylcblx0XHRvaXRlbS5vcHRpb25zID0gSlNPTi5wYXJzZShvaXRlbS5vcHRpb25zKVxuXG5cdF8uZm9yRWFjaCBvaXRlbS5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cblx0XHRpZiAhXy5pc0FycmF5KGZpbHRlcikgJiYgXy5pc09iamVjdChmaWx0ZXIpXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpbHRlcj8udmFsdWUpXG5cdFx0XHRcdFx0ZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcoZmlsdGVyPy5fdmFsdWUpXG5cdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyLl92YWx1ZX0pXCIpXG5cdHJldHVybiBvaXRlbVxuXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRDcmVhdG9yLmdldFJlbGF0ZWRMaXN0ID0gKG9iamVjdF9uYW1lKS0+XG5cdFx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0XHRyZXR1cm5cblx0XHRyZWxhdGVkTGlzdE9iamVjdHMgPSB7fVxuXHRcdHJlbGF0ZWRMaXN0TmFtZXMgPSBbXVxuXHRcdF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXG5cdFx0aWYgX29iamVjdFxuXHRcdFx0cmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0XG5cdFx0XHRpZiAhXy5pc0VtcHR5IHJlbGF0ZWRMaXN0XG5cdFx0XHRcdF8uZWFjaCByZWxhdGVkTGlzdCwgKG9iak9yTmFtZSktPlxuXHRcdFx0XHRcdGlmIF8uaXNPYmplY3Qgb2JqT3JOYW1lXG5cdFx0XHRcdFx0XHRyZWxhdGVkID1cblx0XHRcdFx0XHRcdFx0b2JqZWN0X25hbWU6IG9iak9yTmFtZS5vYmplY3ROYW1lXG5cdFx0XHRcdFx0XHRcdGNvbHVtbnM6IG9iak9yTmFtZS5jb2x1bW5zXG5cdFx0XHRcdFx0XHRcdG1vYmlsZV9jb2x1bW5zOiBvYmpPck5hbWUubW9iaWxlX2NvbHVtbnNcblx0XHRcdFx0XHRcdFx0aXNfZmlsZTogb2JqT3JOYW1lLm9iamVjdE5hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0XHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb246IG9iak9yTmFtZS5maWx0ZXJzXG5cdFx0XHRcdFx0XHRcdHNvcnQ6IG9iak9yTmFtZS5zb3J0XG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogJydcblx0XHRcdFx0XHRcdFx0Y3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWVcblx0XHRcdFx0XHRcdFx0bGFiZWw6IG9iak9yTmFtZS5sYWJlbFxuXHRcdFx0XHRcdFx0XHRhY3Rpb25zOiBvYmpPck5hbWUuYWN0aW9uc1xuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3RPYmplY3RzW29iak9yTmFtZS5vYmplY3ROYW1lXSA9IHJlbGF0ZWRcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0TmFtZXMucHVzaCBvYmpPck5hbWUub2JqZWN0TmFtZVxuXHRcdFx0XHRcdGVsc2UgaWYgXy5pc1N0cmluZyBvYmpPck5hbWVcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0TmFtZXMucHVzaCBvYmpPck5hbWVcblxuXHRcdG1hcExpc3QgPSB7fVxuXHRcdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpXG5cdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0X2l0ZW0pIC0+XG5cdFx0XHRpZiAhcmVsYXRlZF9vYmplY3RfaXRlbT8ub2JqZWN0X25hbWVcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZVxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5mb3JlaWduX2tleVxuXHRcdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSByZWxhdGVkX29iamVjdF9pdGVtLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG5cdFx0XHRyZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXG5cdFx0XHR1bmxlc3MgcmVsYXRlZF9vYmplY3Rcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXG5cdFx0XHRjb2x1bW5zID0gXy53aXRob3V0KGNvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSlcblx0XHRcdG1vYmlsZV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lLCB0cnVlKSB8fCBbXCJuYW1lXCJdXG5cdFx0XHRtb2JpbGVfY29sdW1ucyA9IF8ud2l0aG91dChtb2JpbGVfY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxuXG5cdFx0XHRvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQocmVsYXRlZF9vYmplY3RfbmFtZSlcblx0XHRcdHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpXG5cblx0XHRcdGlmIC9cXHcrXFwuXFwkXFwuXFx3Ky9nLnRlc3QocmVsYXRlZF9maWVsZF9uYW1lKVxuXHRcdFx0XHQjIG9iamVjdOexu+Wei+W4puWtkOWxnuaAp+eahHJlbGF0ZWRfZmllbGRfbmFtZeimgeWOu+aOieS4remXtOeahOe+juWFg+espuWPt++8jOWQpuWImeaYvuekuuS4jeWHuuWtl+auteWAvFxuXHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX2ZpZWxkX25hbWUucmVwbGFjZSgvXFwkXFwuLyxcIlwiKVxuXHRcdFx0cmVsYXRlZCA9XG5cdFx0XHRcdG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lXG5cdFx0XHRcdGNvbHVtbnM6IGNvbHVtbnNcblx0XHRcdFx0bW9iaWxlX2NvbHVtbnM6IG1vYmlsZV9jb2x1bW5zXG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lXG5cdFx0XHRcdGlzX2ZpbGU6IHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcblxuXHRcdFx0cmVsYXRlZE9iamVjdCA9IHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXVxuXHRcdFx0aWYgcmVsYXRlZE9iamVjdFxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmNvbHVtbnNcblx0XHRcdFx0XHRyZWxhdGVkLmNvbHVtbnMgPSByZWxhdGVkT2JqZWN0LmNvbHVtbnNcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1uc1xuXHRcdFx0XHRcdHJlbGF0ZWQubW9iaWxlX2NvbHVtbnMgPSByZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3Quc29ydFxuXHRcdFx0XHRcdHJlbGF0ZWQuc29ydCA9IHJlbGF0ZWRPYmplY3Quc29ydFxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvblxuXHRcdFx0XHRcdHJlbGF0ZWQuZmlsdGVyc0Z1bmN0aW9uID0gcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb25cblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdFxuXHRcdFx0XHRcdHJlbGF0ZWQuY3VzdG9tUmVsYXRlZExpc3RPYmplY3QgPSByZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0XG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QubGFiZWxcblx0XHRcdFx0XHRyZWxhdGVkLmxhYmVsID0gcmVsYXRlZE9iamVjdC5sYWJlbFxuXHRcdFx0XHRkZWxldGUgcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdXG5cblx0XHRcdG1hcExpc3RbcmVsYXRlZC5vYmplY3RfbmFtZV0gPSByZWxhdGVkXG5cblxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soXy52YWx1ZXMocmVsYXRlZExpc3RPYmplY3RzKSwgXCJvYmplY3RfbmFtZVwiKVxuXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRcdHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHNcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZSByZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHNcblx0XHRfLmVhY2ggcmVsYXRlZExpc3RPYmplY3RzLCAodiwgcmVsYXRlZF9vYmplY3RfbmFtZSkgLT5cblx0XHRcdGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xXG5cdFx0XHRhbGxvd1JlYWQgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk/LmFsbG93UmVhZFxuXHRcdFx0aWYgaXNBY3RpdmUgJiYgYWxsb3dSZWFkXG5cdFx0XHRcdG1hcExpc3RbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB2XG5cblx0XHRsaXN0ID0gW11cblx0XHRpZiBfLmlzRW1wdHkgcmVsYXRlZExpc3ROYW1lc1xuXHRcdFx0bGlzdCA9ICBfLnZhbHVlcyBtYXBMaXN0XG5cdFx0ZWxzZVxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0TmFtZXMsIChvYmplY3ROYW1lKSAtPlxuXHRcdFx0XHRpZiBtYXBMaXN0W29iamVjdE5hbWVdXG5cdFx0XHRcdFx0bGlzdC5wdXNoIG1hcExpc3Rbb2JqZWN0TmFtZV1cblxuXHRcdGlmIF8uaGFzKF9vYmplY3QsICdhbGxvd19yZWxhdGVkTGlzdCcpXG5cdFx0XHRsaXN0ID0gXy5maWx0ZXIgbGlzdCwgKGl0ZW0pLT5cblx0XHRcdFx0cmV0dXJuIF8uaW5jbHVkZShfb2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0LCBpdGVtLm9iamVjdF9uYW1lKVxuXG5cdFx0cmV0dXJuIGxpc3RcblxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gKG9iamVjdF9uYW1lKS0+XG5cdHJldHVybiBfLmZpcnN0KENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKSlcblxuIyMjIFxuXHTlj5blh7psaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77vvIzlpoLmnpzkuI3lrZjlnKjmiJbogIXmsqHmnInmnYPpmZDvvIzlsLHov5Tlm57nrKzkuIDkuKrop4blm75cblx0ZXhhY+S4unRydWXml7bvvIzpnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzkuI3pu5jorqTov5Tlm57nrKzkuIDkuKrop4blm75cbiMjI1xuQ3JlYXRvci5nZXRMaXN0VmlldyA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBleGFjKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIWxpc3Rfdmlld19pZFxuXHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGlmICFvYmplY3Rcblx0XHRyZXR1cm5cblx0bGlzdFZpZXdzID0gQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpXG5cdHVubGVzcyBsaXN0Vmlld3M/Lmxlbmd0aFxuXHRcdHJldHVyblxuXHRsaXN0X3ZpZXcgPSBfLmZpbmRXaGVyZShsaXN0Vmlld3Mse1wiX2lkXCI6bGlzdF92aWV3X2lkfSlcblx0dW5sZXNzIGxpc3Rfdmlld1xuXHRcdCMg5aaC5p6c5LiN6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5YiZ6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+77yM5Y+N5LmL6L+U5Zue56m6XG5cdFx0aWYgZXhhY1xuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0bGlzdF92aWV3ID0gbGlzdFZpZXdzWzBdXG5cdHJldHVybiBsaXN0X3ZpZXdcblxuI+iOt+WPlmxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvuaYr+WQpuaYr+acgOi/keafpeeci+inhuWbvlxuQ3JlYXRvci5nZXRMaXN0Vmlld0lzUmVjZW50ID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhbGlzdF92aWV3X2lkXG5cdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxuXHRpZiB0eXBlb2YobGlzdF92aWV3X2lkKSA9PSBcInN0cmluZ1wiXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgIW9iamVjdFxuXHRcdFx0cmV0dXJuXG5cdFx0bGlzdFZpZXcgPSBfLmZpbmRXaGVyZShvYmplY3QubGlzdF92aWV3cyx7X2lkOiBsaXN0X3ZpZXdfaWR9KVxuXHRlbHNlXG5cdFx0bGlzdFZpZXcgPSBsaXN0X3ZpZXdfaWRcblx0cmV0dXJuIGxpc3RWaWV3Py5uYW1lID09IFwicmVjZW50XCJcblxuXG4jIyNcbiAgICDku45jb2x1bW5z5Y+C5pWw5Lit6L+H5ruk5Ye655So5LqO5omL5py656uv5pi+56S655qEY29sdW1uc1xuXHTop4TliJnvvJpcblx0MS7kvJjlhYjmiopjb2x1bW5z5Lit55qEbmFtZeWtl+auteaOkuWcqOesrOS4gOS4qlxuXHQyLuacgOWkmuWPqui/lOWbnjTkuKrlrZfmrrVcblx0My7ogIPomZHlrr3lrZfmrrXljaDnlKjmlbTooYzop4TliJnmnaHku7bkuIvvvIzmnIDlpJrlj6rov5Tlm57kuKTooYxcbiMjI1xuQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyA9IChvYmplY3RfbmFtZSwgY29sdW1ucyktPlxuXHRyZXN1bHQgPSBbXVxuXHRtYXhSb3dzID0gMiBcblx0bWF4Q291bnQgPSBtYXhSb3dzICogMlxuXHRjb3VudCA9IDBcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGZpZWxkcyA9IG9iamVjdC5maWVsZHNcblx0dW5sZXNzIG9iamVjdFxuXHRcdHJldHVybiBjb2x1bW5zXG5cdG5hbWVLZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVlcblx0aXNOYW1lQ29sdW1uID0gKGl0ZW0pLT5cblx0XHRpZiBfLmlzT2JqZWN0KGl0ZW0pXG5cdFx0XHRyZXR1cm4gaXRlbS5maWVsZCA9PSBuYW1lS2V5XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGl0ZW0gPT0gbmFtZUtleVxuXHRnZXRGaWVsZCA9IChpdGVtKS0+XG5cdFx0aWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0cmV0dXJuIGZpZWxkc1tpdGVtLmZpZWxkXVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBmaWVsZHNbaXRlbV1cblx0aWYgbmFtZUtleVxuXHRcdG5hbWVDb2x1bW4gPSBjb2x1bW5zLmZpbmQgKGl0ZW0pLT5cblx0XHRcdHJldHVybiBpc05hbWVDb2x1bW4oaXRlbSlcblx0aWYgbmFtZUNvbHVtblxuXHRcdGZpZWxkID0gZ2V0RmllbGQobmFtZUNvbHVtbilcblx0XHRpdGVtQ291bnQgPSBpZiBmaWVsZC5pc193aWRlIHRoZW4gMiBlbHNlIDFcblx0XHRjb3VudCArPSBpdGVtQ291bnRcblx0XHRyZXN1bHQucHVzaCBuYW1lQ29sdW1uXG5cdGNvbHVtbnMuZm9yRWFjaCAoaXRlbSktPlxuXHRcdGZpZWxkID0gZ2V0RmllbGQoaXRlbSlcblx0XHR1bmxlc3MgZmllbGRcblx0XHRcdHJldHVyblxuXHRcdGl0ZW1Db3VudCA9IGlmIGZpZWxkLmlzX3dpZGUgdGhlbiAyIGVsc2UgMVxuXHRcdGlmIGNvdW50IDwgbWF4Q291bnQgYW5kIHJlc3VsdC5sZW5ndGggPCBtYXhDb3VudCBhbmQgIWlzTmFtZUNvbHVtbihpdGVtKVxuXHRcdFx0Y291bnQgKz0gaXRlbUNvdW50XG5cdFx0XHRpZiBjb3VudCA8PSBtYXhDb3VudFxuXHRcdFx0XHRyZXN1bHQucHVzaCBpdGVtXG5cdFxuXHRyZXR1cm4gcmVzdWx0XG5cbiMjI1xuICAgIOiOt+WPlum7mOiupOinhuWbvlxuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3ID0gKG9iamVjdF9uYW1lKS0+XG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRpZiAhb2JqZWN0XG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxuXHRpZiBvYmplY3Q/Lmxpc3Rfdmlld3M/LmRlZmF1bHRcblx0XHQjVE9ETyDmraTku6PnoIHlj6rmmK/mmoLml7blhbzlrrnku6XliY1jb2Rl5Lit5a6a5LmJ55qEZGVmYXVsdOinhuWbvu+8jOW+hWNvZGXkuK3nmoRkZWZhdWx05riF55CG5a6M5oiQ5ZCO77yM6ZyA6KaB5Yig6Zmk5q2k5Luj56CBXG5cdFx0ZGVmYXVsdFZpZXcgPSBvYmplY3QubGlzdF92aWV3cy5kZWZhdWx0XG5cdGVsc2Vcblx0XHRfLmVhY2ggb2JqZWN0Py5saXN0X3ZpZXdzLCAobGlzdF92aWV3LCBrZXkpLT5cblx0XHRcdGlmIGxpc3Rfdmlldy5uYW1lID09IFwiYWxsXCIgfHwga2V5ID09IFwiYWxsXCJcblx0XHRcdFx0ZGVmYXVsdFZpZXcgPSBsaXN0X3ZpZXdcblx0cmV0dXJuIGRlZmF1bHRWaWV3O1xuXG4jIyNcbiAgICDojrflj5blr7nosaHnmoTliJfooajpu5jorqTmmL7npLrlrZfmrrVcbiMjI1xuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IChvYmplY3RfbmFtZSwgdXNlX21vYmlsZV9jb2x1bW5zKS0+XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcblx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Py5jb2x1bW5zXG5cdGlmIHVzZV9tb2JpbGVfY29sdW1uc1xuXHRcdGlmIGRlZmF1bHRWaWV3Py5tb2JpbGVfY29sdW1uc1xuXHRcdFx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zXG5cdFx0ZWxzZSBpZiBjb2x1bW5zXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyhvYmplY3RfbmFtZSwgY29sdW1ucylcblx0cmV0dXJuIGNvbHVtbnNcblxuIyMjXG5cdOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOmineWkluWKoOi9veeahOWtl+autVxuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMgPSAob2JqZWN0X25hbWUpLT5cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxuXHRyZXR1cm4gZGVmYXVsdFZpZXc/LmV4dHJhX2NvbHVtbnNcblxuIyMjXG5cdOiOt+WPluWvueixoeeahOm7mOiupOaOkuW6j1xuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0ID0gKG9iamVjdF9uYW1lKS0+XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcblx0aWYgZGVmYXVsdFZpZXdcblx0XHRpZiBkZWZhdWx0Vmlldy5zb3J0XG5cdFx0XHRyZXR1cm4gZGVmYXVsdFZpZXcuc29ydFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBbW1wiY3JlYXRlZFwiLCBcImRlc2NcIl1dXG5cblxuIyMjXG4gICAg5Yik5pat5piv5ZCmQWxsIHZpZXdcbiMjI1xuQ3JlYXRvci5pc0FsbFZpZXcgPSAobGlzdF92aWV3KS0+XG5cdHJldHVybiBsaXN0X3ZpZXc/Lm5hbWUgPT0gXCJhbGxcIlxuXG4jIyNcbiAgICDliKTmlq3mmK/lkKbmnIDov5Hmn6XnnIsgdmlld1xuIyMjXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IChsaXN0X3ZpZXcpLT5cblx0cmV0dXJuIGxpc3Rfdmlldz8ubmFtZSA9PSBcInJlY2VudFwiXG5cbiMjI1xuICAgIOWwhnNvcnTovazmjaLkuLpUYWJ1bGFy5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4jIyNcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhciA9IChzb3J0LCB0YWJ1bGFyQ29sdW1ucyktPlxuXHR0YWJ1bGFyX3NvcnQgPSBbXVxuXHRfLmVhY2ggc29ydCwgKGl0ZW0pLT5cblx0XHRpZiBfLmlzQXJyYXkoaXRlbSlcblx0XHRcdCMg5YW85a655pen55qE5pWw5o2u5qC85byPW1tcImZpZWxkX25hbWVcIiwgXCJvcmRlclwiXV1cblx0XHRcdGlmIGl0ZW0ubGVuZ3RoID09IDFcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIFwiYXNjXCJdXG5cdFx0XHRlbHNlIGlmIGl0ZW0ubGVuZ3RoID09IDJcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dXG5cdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGl0ZW0pXG5cdFx0XHQj5paw5pWw5o2u5qC85byP77yaW3tmaWVsZF9uYW1lOiAsIG9yZGVyOiB9XVxuXHRcdFx0ZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZVxuXHRcdFx0b3JkZXIgPSBpdGVtLm9yZGVyXG5cdFx0XHRpZiBmaWVsZF9uYW1lICYmIG9yZGVyXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSlcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBvcmRlcl1cblxuXHRyZXR1cm4gdGFidWxhcl9zb3J0XG5cbiMjI1xuICAgIOWwhnNvcnTovazmjaLkuLpEZXZFeHByZXNz5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4jIyNcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSAoc29ydCktPlxuXHRkeF9zb3J0ID0gW11cblx0Xy5lYWNoIHNvcnQsIChpdGVtKS0+XG5cdFx0aWYgXy5pc0FycmF5KGl0ZW0pXG5cdFx0XHQj5YW85a655pen5qC85byP77yaW1tcImZpZWxkX25hbWVcIiwgXCJvcmRlclwiXV1cblx0XHRcdGR4X3NvcnQucHVzaChpdGVtKVxuXHRcdGVsc2UgaWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0I+aWsOaVsOaNruagvOW8j++8mlt7ZmllbGRfbmFtZTogLCBvcmRlcjogfV1cblx0XHRcdGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWVcblx0XHRcdG9yZGVyID0gaXRlbS5vcmRlclxuXHRcdFx0aWYgZmllbGRfbmFtZSAmJiBvcmRlclxuXHRcdFx0XHRkeF9zb3J0LnB1c2ggW2ZpZWxkX25hbWUsIG9yZGVyXVxuXG5cdHJldHVybiBkeF9zb3J0XG4iLCJDcmVhdG9yLmdldEluaXRXaWR0aFBlcmNlbnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgY29sdW1ucykge1xuICB2YXIgX3NjaGVtYSwgY29sdW1uX251bSwgaW5pdF93aWR0aF9wZXJjZW50LCByZWY7XG4gIF9zY2hlbWEgPSAocmVmID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLl9zY2hlbWEgOiB2b2lkIDA7XG4gIGNvbHVtbl9udW0gPSAwO1xuICBpZiAoX3NjaGVtYSkge1xuICAgIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbihmaWVsZF9uYW1lKSB7XG4gICAgICB2YXIgZmllbGQsIGlzX3dpZGUsIHJlZjEsIHJlZjI7XG4gICAgICBmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKTtcbiAgICAgIGlzX3dpZGUgPSAocmVmMSA9IGZpZWxkW2ZpZWxkX25hbWVdKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMi5pc193aWRlIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGlzX3dpZGUpIHtcbiAgICAgICAgcmV0dXJuIGNvbHVtbl9udW0gKz0gMjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjb2x1bW5fbnVtICs9IDE7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaW5pdF93aWR0aF9wZXJjZW50ID0gMTAwIC8gY29sdW1uX251bTtcbiAgICByZXR1cm4gaW5pdF93aWR0aF9wZXJjZW50O1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkSXNXaWRlID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUpIHtcbiAgdmFyIF9zY2hlbWEsIGZpZWxkLCBpc193aWRlLCByZWYsIHJlZjE7XG4gIF9zY2hlbWEgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSkuX3NjaGVtYTtcbiAgaWYgKF9zY2hlbWEpIHtcbiAgICBmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKTtcbiAgICBpc193aWRlID0gKHJlZiA9IGZpZWxkW2ZpZWxkX25hbWVdKSAhPSBudWxsID8gKHJlZjEgPSByZWYuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLmlzX3dpZGUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgcmV0dXJuIGlzX3dpZGU7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0VGFidWxhck9yZGVyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1ucykge1xuICB2YXIgb2JqLCByZWYsIHJlZjEsIHJlZjIsIHNldHRpbmcsIHNvcnQ7XG4gIHNldHRpbmcgPSAocmVmID0gQ3JlYXRvci5Db2xsZWN0aW9ucykgIT0gbnVsbCA/IChyZWYxID0gcmVmLnNldHRpbmdzKSAhPSBudWxsID8gcmVmMS5maW5kT25lKHtcbiAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICB9KSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gXy5tYXAoY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG4gICAgdmFyIGZpZWxkO1xuICAgIGZpZWxkID0gb2JqLmZpZWxkc1tjb2x1bW5dO1xuICAgIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnR5cGUgOiB2b2lkIDApICYmICFmaWVsZC5oaWRkZW4pIHtcbiAgICAgIHJldHVybiBjb2x1bW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICB9KTtcbiAgY29sdW1ucyA9IF8uY29tcGFjdChjb2x1bW5zKTtcbiAgaWYgKHNldHRpbmcgJiYgc2V0dGluZy5zZXR0aW5ncykge1xuICAgIHNvcnQgPSAoKHJlZjIgPSBzZXR0aW5nLnNldHRpbmdzW2xpc3Rfdmlld19pZF0pICE9IG51bGwgPyByZWYyLnNvcnQgOiB2b2lkIDApIHx8IFtdO1xuICAgIHNvcnQgPSBfLm1hcChzb3J0LCBmdW5jdGlvbihvcmRlcikge1xuICAgICAgdmFyIGluZGV4LCBrZXk7XG4gICAgICBrZXkgPSBvcmRlclswXTtcbiAgICAgIGluZGV4ID0gXy5pbmRleE9mKGNvbHVtbnMsIGtleSk7XG4gICAgICBvcmRlclswXSA9IGluZGV4ICsgMTtcbiAgICAgIHJldHVybiBvcmRlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gc29ydDtcbiAgfVxuICByZXR1cm4gW107XG59O1xuXG5DcmVhdG9yLmluaXRMaXN0Vmlld3MgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgY29sdW1ucywgZGVmYXVsdF9leHRyYV9jb2x1bW5zLCBleHRyYV9jb2x1bW5zLCBvYmplY3QsIG9yZGVyLCByZWY7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl07XG4gIGV4dHJhX2NvbHVtbnMgPSBbXCJvd25lclwiXTtcbiAgZGVmYXVsdF9leHRyYV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJvd25lclwiXTtcbiAgaWYgKGRlZmF1bHRfZXh0cmFfY29sdW1ucykge1xuICAgIGV4dHJhX2NvbHVtbnMgPSBfLnVuaW9uKGV4dHJhX2NvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1ucyk7XG4gIH1cbiAgb3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KG9iamVjdF9uYW1lKSB8fCBbXTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHJldHVybiAocmVmID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHMpICE9IG51bGwgPyByZWZbb2JqZWN0X25hbWVdID0gW10gOiB2b2lkIDA7XG4gIH1cbn07XG5cbkNyZWF0b3IuY29udmVydExpc3RWaWV3ID0gZnVuY3Rpb24oZGVmYXVsdF92aWV3LCBsaXN0X3ZpZXcsIGxpc3Rfdmlld19uYW1lKSB7XG4gIHZhciBkZWZhdWx0X2NvbHVtbnMsIGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMsIG9pdGVtO1xuICBkZWZhdWx0X2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXcgIT0gbnVsbCA/IGRlZmF1bHRfdmlldy5jb2x1bW5zIDogdm9pZCAwO1xuICBkZWZhdWx0X21vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF92aWV3ICE9IG51bGwgPyBkZWZhdWx0X3ZpZXcubW9iaWxlX2NvbHVtbnMgOiB2b2lkIDA7XG4gIGlmICghbGlzdF92aWV3KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG9pdGVtID0gXy5jbG9uZShsaXN0X3ZpZXcpO1xuICBpZiAoIV8uaGFzKG9pdGVtLCBcIm5hbWVcIikpIHtcbiAgICBvaXRlbS5uYW1lID0gbGlzdF92aWV3X25hbWU7XG4gIH1cbiAgaWYgKCFvaXRlbS5jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRfY29sdW1ucykge1xuICAgICAgb2l0ZW0uY29sdW1ucyA9IGRlZmF1bHRfY29sdW1ucztcbiAgICB9XG4gIH1cbiAgaWYgKCFvaXRlbS5jb2x1bW5zKSB7XG4gICAgb2l0ZW0uY29sdW1ucyA9IFtcIm5hbWVcIl07XG4gIH1cbiAgaWYgKCFvaXRlbS5tb2JpbGVfY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0X21vYmlsZV9jb2x1bW5zKSB7XG4gICAgICBvaXRlbS5tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfbW9iaWxlX2NvbHVtbnM7XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpICYmICFfLmluY2x1ZGUob2l0ZW0uY29sdW1ucywgJ3NwYWNlJykpIHtcbiAgICAgIG9pdGVtLmNvbHVtbnMucHVzaCgnc3BhY2UnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFvaXRlbS5maWx0ZXJfc2NvcGUpIHtcbiAgICBvaXRlbS5maWx0ZXJfc2NvcGUgPSBcInNwYWNlXCI7XG4gIH1cbiAgaWYgKCFfLmhhcyhvaXRlbSwgXCJfaWRcIikpIHtcbiAgICBvaXRlbS5faWQgPSBsaXN0X3ZpZXdfbmFtZTtcbiAgfSBlbHNlIHtcbiAgICBvaXRlbS5sYWJlbCA9IG9pdGVtLmxhYmVsIHx8IGxpc3Rfdmlldy5uYW1lO1xuICB9XG4gIGlmIChfLmlzU3RyaW5nKG9pdGVtLm9wdGlvbnMpKSB7XG4gICAgb2l0ZW0ub3B0aW9ucyA9IEpTT04ucGFyc2Uob2l0ZW0ub3B0aW9ucyk7XG4gIH1cbiAgXy5mb3JFYWNoKG9pdGVtLmZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlciwgX2luZGV4KSB7XG4gICAgaWYgKCFfLmlzQXJyYXkoZmlsdGVyKSAmJiBfLmlzT2JqZWN0KGZpbHRlcikpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci52YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm4gZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoXy5pc1N0cmluZyhmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci5fdmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyLl92YWx1ZSArIFwiKVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvaXRlbTtcbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5nZXRSZWxhdGVkTGlzdCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIF9vYmplY3QsIGxpc3QsIG1hcExpc3QsIHBlcm1pc3Npb25zLCByZWxhdGVkTGlzdCwgcmVsYXRlZExpc3ROYW1lcywgcmVsYXRlZExpc3RPYmplY3RzLCByZWxhdGVkX29iamVjdF9uYW1lcywgcmVsYXRlZF9vYmplY3RzLCBzcGFjZUlkLCB1bnJlbGF0ZWRfb2JqZWN0cywgdXNlcklkO1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVsYXRlZExpc3RPYmplY3RzID0ge307XG4gICAgcmVsYXRlZExpc3ROYW1lcyA9IFtdO1xuICAgIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICAgIGlmIChfb2JqZWN0KSB7XG4gICAgICByZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Q7XG4gICAgICBpZiAoIV8uaXNFbXB0eShyZWxhdGVkTGlzdCkpIHtcbiAgICAgICAgXy5lYWNoKHJlbGF0ZWRMaXN0LCBmdW5jdGlvbihvYmpPck5hbWUpIHtcbiAgICAgICAgICB2YXIgcmVsYXRlZDtcbiAgICAgICAgICBpZiAoXy5pc09iamVjdChvYmpPck5hbWUpKSB7XG4gICAgICAgICAgICByZWxhdGVkID0ge1xuICAgICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqT3JOYW1lLm9iamVjdE5hbWUsXG4gICAgICAgICAgICAgIGNvbHVtbnM6IG9iak9yTmFtZS5jb2x1bW5zLFxuICAgICAgICAgICAgICBtb2JpbGVfY29sdW1uczogb2JqT3JOYW1lLm1vYmlsZV9jb2x1bW5zLFxuICAgICAgICAgICAgICBpc19maWxlOiBvYmpPck5hbWUub2JqZWN0TmFtZSA9PT0gXCJjbXNfZmlsZXNcIixcbiAgICAgICAgICAgICAgZmlsdGVyc0Z1bmN0aW9uOiBvYmpPck5hbWUuZmlsdGVycyxcbiAgICAgICAgICAgICAgc29ydDogb2JqT3JOYW1lLnNvcnQsXG4gICAgICAgICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZTogJycsXG4gICAgICAgICAgICAgIGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlLFxuICAgICAgICAgICAgICBsYWJlbDogb2JqT3JOYW1lLmxhYmVsLFxuICAgICAgICAgICAgICBhY3Rpb25zOiBvYmpPck5hbWUuYWN0aW9uc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlbGF0ZWRMaXN0T2JqZWN0c1tvYmpPck5hbWUub2JqZWN0TmFtZV0gPSByZWxhdGVkO1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TmFtZXMucHVzaChvYmpPck5hbWUub2JqZWN0TmFtZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKG9iak9yTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE5hbWVzLnB1c2gob2JqT3JOYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBtYXBMaXN0ID0ge307XG4gICAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSk7XG4gICAgXy5lYWNoKHJlbGF0ZWRfb2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3RfaXRlbSkge1xuICAgICAgdmFyIGNvbHVtbnMsIG1vYmlsZV9jb2x1bW5zLCBvcmRlciwgcmVsYXRlZCwgcmVsYXRlZE9iamVjdCwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSwgdGFidWxhcl9vcmRlciwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgICBpZiAoIShyZWxhdGVkX29iamVjdF9pdGVtICE9IG51bGwgPyByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lIDogdm9pZCAwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZTtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uZm9yZWlnbl9rZXk7XG4gICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgICByZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKCFyZWxhdGVkX29iamVjdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdO1xuICAgICAgY29sdW1ucyA9IF8ud2l0aG91dChjb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpO1xuICAgICAgbW9iaWxlX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHRydWUpIHx8IFtcIm5hbWVcIl07XG4gICAgICBtb2JpbGVfY29sdW1ucyA9IF8ud2l0aG91dChtb2JpbGVfY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKTtcbiAgICAgIG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChyZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICAgIHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpO1xuICAgICAgaWYgKC9cXHcrXFwuXFwkXFwuXFx3Ky9nLnRlc3QocmVsYXRlZF9maWVsZF9uYW1lKSkge1xuICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX2ZpZWxkX25hbWUucmVwbGFjZSgvXFwkXFwuLywgXCJcIik7XG4gICAgICB9XG4gICAgICByZWxhdGVkID0ge1xuICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgY29sdW1uczogY29sdW1ucyxcbiAgICAgICAgbW9iaWxlX2NvbHVtbnM6IG1vYmlsZV9jb2x1bW5zLFxuICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgaXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIixcbiAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG4gICAgICB9O1xuICAgICAgcmVsYXRlZE9iamVjdCA9IHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXTtcbiAgICAgIGlmIChyZWxhdGVkT2JqZWN0KSB7XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmNvbHVtbnMpIHtcbiAgICAgICAgICByZWxhdGVkLmNvbHVtbnMgPSByZWxhdGVkT2JqZWN0LmNvbHVtbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnMpIHtcbiAgICAgICAgICByZWxhdGVkLm1vYmlsZV9jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5zb3J0KSB7XG4gICAgICAgICAgcmVsYXRlZC5zb3J0ID0gcmVsYXRlZE9iamVjdC5zb3J0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvbikge1xuICAgICAgICAgIHJlbGF0ZWQuZmlsdGVyc0Z1bmN0aW9uID0gcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3QpIHtcbiAgICAgICAgICByZWxhdGVkLmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0ID0gcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5sYWJlbCkge1xuICAgICAgICAgIHJlbGF0ZWQubGFiZWwgPSByZWxhdGVkT2JqZWN0LmxhYmVsO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSByZWxhdGVkTGlzdE9iamVjdHNbcmVsYXRlZF9vYmplY3RfbmFtZV07XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFwTGlzdFtyZWxhdGVkLm9iamVjdF9uYW1lXSA9IHJlbGF0ZWQ7XG4gICAgfSk7XG4gICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKF8udmFsdWVzKHJlbGF0ZWRMaXN0T2JqZWN0cyksIFwib2JqZWN0X25hbWVcIik7XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICAgIHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHM7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLmRpZmZlcmVuY2UocmVsYXRlZF9vYmplY3RfbmFtZXMsIHVucmVsYXRlZF9vYmplY3RzKTtcbiAgICBfLmVhY2gocmVsYXRlZExpc3RPYmplY3RzLCBmdW5jdGlvbih2LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICB2YXIgYWxsb3dSZWFkLCBpc0FjdGl2ZSwgcmVmO1xuICAgICAgaXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTE7XG4gICAgICBhbGxvd1JlYWQgPSAocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKSAhPSBudWxsID8gcmVmLmFsbG93UmVhZCA6IHZvaWQgMDtcbiAgICAgIGlmIChpc0FjdGl2ZSAmJiBhbGxvd1JlYWQpIHtcbiAgICAgICAgcmV0dXJuIG1hcExpc3RbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB2O1xuICAgICAgfVxuICAgIH0pO1xuICAgIGxpc3QgPSBbXTtcbiAgICBpZiAoXy5pc0VtcHR5KHJlbGF0ZWRMaXN0TmFtZXMpKSB7XG4gICAgICBsaXN0ID0gXy52YWx1ZXMobWFwTGlzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF8uZWFjaChyZWxhdGVkTGlzdE5hbWVzLCBmdW5jdGlvbihvYmplY3ROYW1lKSB7XG4gICAgICAgIGlmIChtYXBMaXN0W29iamVjdE5hbWVdKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3QucHVzaChtYXBMaXN0W29iamVjdE5hbWVdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChfLmhhcyhfb2JqZWN0LCAnYWxsb3dfcmVsYXRlZExpc3QnKSkge1xuICAgICAgbGlzdCA9IF8uZmlsdGVyKGxpc3QsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIF8uaW5jbHVkZShfb2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0LCBpdGVtLm9iamVjdF9uYW1lKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbGlzdDtcbiAgfTtcbn1cblxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgcmV0dXJuIF8uZmlyc3QoQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpKTtcbn07XG5cblxuLyogXG5cdOWPluWHumxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvu+8jOWmguaenOS4jeWtmOWcqOaIluiAheayoeacieadg+mZkO+8jOWwsei/lOWbnuesrOS4gOS4quinhuWbvlxuXHRleGFj5Li6dHJ1ZeaXtu+8jOmcgOimgeW8uuWItuaMiWxpc3Rfdmlld19pZOeyvuehruafpeaJvu+8jOS4jem7mOiupOi/lOWbnuesrOS4gOS4quinhuWbvlxuICovXG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBleGFjKSB7XG4gIHZhciBsaXN0Vmlld3MsIGxpc3Rfdmlldywgb2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgfVxuICB9XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGlzdFZpZXdzID0gQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpO1xuICBpZiAoIShsaXN0Vmlld3MgIT0gbnVsbCA/IGxpc3RWaWV3cy5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxpc3RfdmlldyA9IF8uZmluZFdoZXJlKGxpc3RWaWV3cywge1xuICAgIFwiX2lkXCI6IGxpc3Rfdmlld19pZFxuICB9KTtcbiAgaWYgKCFsaXN0X3ZpZXcpIHtcbiAgICBpZiAoZXhhYykge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0X3ZpZXcgPSBsaXN0Vmlld3NbMF07XG4gICAgfVxuICB9XG4gIHJldHVybiBsaXN0X3ZpZXc7XG59O1xuXG5DcmVhdG9yLmdldExpc3RWaWV3SXNSZWNlbnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkKSB7XG4gIHZhciBsaXN0Vmlldywgb2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2YgbGlzdF92aWV3X2lkID09PSBcInN0cmluZ1wiKSB7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmICghb2JqZWN0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxpc3RWaWV3ID0gXy5maW5kV2hlcmUob2JqZWN0Lmxpc3Rfdmlld3MsIHtcbiAgICAgIF9pZDogbGlzdF92aWV3X2lkXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbGlzdFZpZXcgPSBsaXN0X3ZpZXdfaWQ7XG4gIH1cbiAgcmV0dXJuIChsaXN0VmlldyAhPSBudWxsID8gbGlzdFZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwicmVjZW50XCI7XG59O1xuXG5cbi8qXG4gICAg5LuOY29sdW1uc+WPguaVsOS4rei/h+a7pOWHuueUqOS6juaJi+acuuerr+aYvuekuueahGNvbHVtbnNcblx06KeE5YiZ77yaXG5cdDEu5LyY5YWI5oqKY29sdW1uc+S4reeahG5hbWXlrZfmrrXmjpLlnKjnrKzkuIDkuKpcblx0Mi7mnIDlpJrlj6rov5Tlm5405Liq5a2X5q61XG5cdDMu6ICD6JmR5a695a2X5q615Y2g55So5pW06KGM6KeE5YiZ5p2h5Lu25LiL77yM5pyA5aSa5Y+q6L+U5Zue5Lik6KGMXG4gKi9cblxuQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBjb2x1bW5zKSB7XG4gIHZhciBjb3VudCwgZmllbGQsIGZpZWxkcywgZ2V0RmllbGQsIGlzTmFtZUNvbHVtbiwgaXRlbUNvdW50LCBtYXhDb3VudCwgbWF4Um93cywgbmFtZUNvbHVtbiwgbmFtZUtleSwgb2JqZWN0LCByZXN1bHQ7XG4gIHJlc3VsdCA9IFtdO1xuICBtYXhSb3dzID0gMjtcbiAgbWF4Q291bnQgPSBtYXhSb3dzICogMjtcbiAgY291bnQgPSAwO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IG9iamVjdC5maWVsZHM7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuIGNvbHVtbnM7XG4gIH1cbiAgbmFtZUtleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgaXNOYW1lQ29sdW1uID0gZnVuY3Rpb24oaXRlbSkge1xuICAgIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gaXRlbS5maWVsZCA9PT0gbmFtZUtleTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGl0ZW0gPT09IG5hbWVLZXk7XG4gICAgfVxuICB9O1xuICBnZXRGaWVsZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgcmV0dXJuIGZpZWxkc1tpdGVtLmZpZWxkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpZWxkc1tpdGVtXTtcbiAgICB9XG4gIH07XG4gIGlmIChuYW1lS2V5KSB7XG4gICAgbmFtZUNvbHVtbiA9IGNvbHVtbnMuZmluZChmdW5jdGlvbihpdGVtKSB7XG4gICAgICByZXR1cm4gaXNOYW1lQ29sdW1uKGl0ZW0pO1xuICAgIH0pO1xuICB9XG4gIGlmIChuYW1lQ29sdW1uKSB7XG4gICAgZmllbGQgPSBnZXRGaWVsZChuYW1lQ29sdW1uKTtcbiAgICBpdGVtQ291bnQgPSBmaWVsZC5pc193aWRlID8gMiA6IDE7XG4gICAgY291bnQgKz0gaXRlbUNvdW50O1xuICAgIHJlc3VsdC5wdXNoKG5hbWVDb2x1bW4pO1xuICB9XG4gIGNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgZmllbGQgPSBnZXRGaWVsZChpdGVtKTtcbiAgICBpZiAoIWZpZWxkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGl0ZW1Db3VudCA9IGZpZWxkLmlzX3dpZGUgPyAyIDogMTtcbiAgICBpZiAoY291bnQgPCBtYXhDb3VudCAmJiByZXN1bHQubGVuZ3RoIDwgbWF4Q291bnQgJiYgIWlzTmFtZUNvbHVtbihpdGVtKSkge1xuICAgICAgY291bnQgKz0gaXRlbUNvdW50O1xuICAgICAgaWYgKGNvdW50IDw9IG1heENvdW50KSB7XG4gICAgICAgIHJldHVybiByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG4vKlxuICAgIOiOt+WPlum7mOiupOinhuWbvlxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXcsIG9iamVjdCwgcmVmO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgfVxuICBpZiAob2JqZWN0ICE9IG51bGwgPyAocmVmID0gb2JqZWN0Lmxpc3Rfdmlld3MpICE9IG51bGwgPyByZWZbXCJkZWZhdWx0XCJdIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgZGVmYXVsdFZpZXcgPSBvYmplY3QubGlzdF92aWV3c1tcImRlZmF1bHRcIl07XG4gIH0gZWxzZSB7XG4gICAgXy5lYWNoKG9iamVjdCAhPSBudWxsID8gb2JqZWN0Lmxpc3Rfdmlld3MgOiB2b2lkIDAsIGZ1bmN0aW9uKGxpc3Rfdmlldywga2V5KSB7XG4gICAgICBpZiAobGlzdF92aWV3Lm5hbWUgPT09IFwiYWxsXCIgfHwga2V5ID09PSBcImFsbFwiKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmlldyA9IGxpc3RfdmlldztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZpZXc7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k5pi+56S65a2X5q61XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCB1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgdmFyIGNvbHVtbnMsIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3LmNvbHVtbnMgOiB2b2lkIDA7XG4gIGlmICh1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zIDogdm9pZCAwKSB7XG4gICAgICBjb2x1bW5zID0gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnM7XG4gICAgfSBlbHNlIGlmIChjb2x1bW5zKSB7XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyhvYmplY3RfbmFtZSwgY29sdW1ucyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb2x1bW5zO1xufTtcblxuXG4vKlxuXHTojrflj5blr7nosaHnmoTliJfooajpu5jorqTpop3lpJbliqDovb3nmoTlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIHJldHVybiBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuZXh0cmFfY29sdW1ucyA6IHZvaWQgMDtcbn07XG5cblxuLypcblx06I635Y+W5a+56LGh55qE6buY6K6k5o6S5bqPXG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgaWYgKGRlZmF1bHRWaWV3KSB7XG4gICAgaWYgKGRlZmF1bHRWaWV3LnNvcnQpIHtcbiAgICAgIHJldHVybiBkZWZhdWx0Vmlldy5zb3J0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW1tcImNyZWF0ZWRcIiwgXCJkZXNjXCJdXTtcbiAgICB9XG4gIH1cbn07XG5cblxuLypcbiAgICDliKTmlq3mmK/lkKZBbGwgdmlld1xuICovXG5cbkNyZWF0b3IuaXNBbGxWaWV3ID0gZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gIHJldHVybiAobGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwiYWxsXCI7XG59O1xuXG5cbi8qXG4gICAg5Yik5pat5piv5ZCm5pyA6L+R5p+l55yLIHZpZXdcbiAqL1xuXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IGZ1bmN0aW9uKGxpc3Rfdmlldykge1xuICByZXR1cm4gKGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Lm5hbWUgOiB2b2lkIDApID09PSBcInJlY2VudFwiO1xufTtcblxuXG4vKlxuICAgIOWwhnNvcnTovazmjaLkuLpUYWJ1bGFy5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4gKi9cblxuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyID0gZnVuY3Rpb24oc29ydCwgdGFidWxhckNvbHVtbnMpIHtcbiAgdmFyIHRhYnVsYXJfc29ydDtcbiAgdGFidWxhcl9zb3J0ID0gW107XG4gIF8uZWFjaChzb3J0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGNvbHVtbl9pbmRleCwgZmllbGRfbmFtZSwgb3JkZXI7XG4gICAgaWYgKF8uaXNBcnJheShpdGVtKSkge1xuICAgICAgaWYgKGl0ZW0ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBcImFzY1wiXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXRlbS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZTtcbiAgICAgIG9yZGVyID0gaXRlbS5vcmRlcjtcbiAgICAgIGlmIChmaWVsZF9uYW1lICYmIG9yZGVyKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBvcmRlcl0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRhYnVsYXJfc29ydDtcbn07XG5cblxuLypcbiAgICDlsIZzb3J06L2s5o2i5Li6RGV2RXhwcmVzc+aOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuICovXG5cbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSBmdW5jdGlvbihzb3J0KSB7XG4gIHZhciBkeF9zb3J0O1xuICBkeF9zb3J0ID0gW107XG4gIF8uZWFjaChzb3J0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGZpZWxkX25hbWUsIG9yZGVyO1xuICAgIGlmIChfLmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIHJldHVybiBkeF9zb3J0LnB1c2goaXRlbSk7XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lO1xuICAgICAgb3JkZXIgPSBpdGVtLm9yZGVyO1xuICAgICAgaWYgKGZpZWxkX25hbWUgJiYgb3JkZXIpIHtcbiAgICAgICAgcmV0dXJuIGR4X3NvcnQucHVzaChbZmllbGRfbmFtZSwgb3JkZXJdKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZHhfc29ydDtcbn07XG4iLCJTaW1wbGVTY2hlbWEuUmVnRXguY29kZSA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11bYS16QS1aMC05X10qJCcpXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdFx0X3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdXG5cdFx0X3JlZ0V4TWVzc2FnZXMucHVzaCB7ZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZSwgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jOS4lOWPquiDveWMheWQq+Wtl+avjeOAgeaVsOWtl+OAgV9cIn1cblx0XHRTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuXHRcdFx0cmVnRXg6IF9yZWdFeE1lc3NhZ2VzLFxuXHRcdH0pIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dW2EtekEtWjAtOV9dKiQnKTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgX3JlZ0V4TWVzc2FnZXM7XG4gICAgX3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdO1xuICAgIF9yZWdFeE1lc3NhZ2VzLnB1c2goe1xuICAgICAgZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZSxcbiAgICAgIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIzkuJTlj6rog73ljIXlkKvlrZfmr43jgIHmlbDlrZfjgIFfXCJcbiAgICB9KTtcbiAgICByZXR1cm4gU2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcbiAgICAgIHJlZ0V4OiBfcmVnRXhNZXNzYWdlc1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIlNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11cXFxcdyooXFxcXC5cXFxcJFxcXFwuXFxcXHcrKT9bYS16QS1aMC05XSokJylcblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdE1ldGVvci5zdGFydHVwICgpLT5cblx0XHRfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW11cblx0XHRfcmVnRXhNZXNzYWdlcy5wdXNoIHtleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCwgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jC4kLuWJjeWQjuW/hemhu+WMheWQq+Wtl+esplwifVxuXHRcdFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG5cdFx0XHRyZWdFeDogX3JlZ0V4TWVzc2FnZXMsXG5cdFx0fSkiLCJTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dXFxcXHcqKFxcXFwuXFxcXCRcXFxcLlxcXFx3Kyk/W2EtekEtWjAtOV0qJCcpO1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHZhciBfcmVnRXhNZXNzYWdlcztcbiAgICBfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW107XG4gICAgX3JlZ0V4TWVzc2FnZXMucHVzaCh7XG4gICAgICBleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCxcbiAgICAgIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIwuJC7liY3lkI7lv4XpobvljIXlkKvlrZfnrKZcIlxuICAgIH0pO1xuICAgIHJldHVybiBTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuICAgICAgcmVnRXg6IF9yZWdFeE1lc3NhZ2VzXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiLy8g5Zug5Li6bWV0ZW9y57yW6K+RY29mZmVlc2NyaXB05Lya5a+86Ie0ZXZhbOWHveaVsOaKpemUme+8jOaJgOS7peWNleeLrOWGmeWcqOS4gOS4qmpz5paH5Lu25Lit44CCXG5DcmVhdG9yLmV2YWxJbkNvbnRleHQgPSBmdW5jdGlvbihqcywgY29udGV4dCkge1xuICAgIC8vIyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgdGhlIGluLWxpbmUgYW5vbnltb3VzIGZ1bmN0aW9uIHdlIC5jYWxsIHdpdGggdGhlIHBhc3NlZCBjb250ZXh0XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkgeyBcbiAgICBcdHJldHVybiBldmFsKGpzKTsgXG5cdH0uY2FsbChjb250ZXh0KTtcbn1cblxuXG5DcmVhdG9yLmV2YWwgPSBmdW5jdGlvbihqcyl7XG5cdHRyeXtcblx0XHRyZXR1cm4gZXZhbChqcylcblx0fWNhdGNoIChlKXtcblx0XHRjb25zb2xlLmVycm9yKGUsIGpzKTtcblx0fVxufTsiLCJcdGdldE9wdGlvbiA9IChvcHRpb24pLT5cblx0XHRmb28gPSBvcHRpb24uc3BsaXQoXCI6XCIpXG5cdFx0aWYgZm9vLmxlbmd0aCA+IDJcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1sxXSwgY29sb3I6IGZvb1syXX1cblx0XHRlbHNlIGlmIGZvby5sZW5ndGggPiAxXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMV19XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzBdfVxuXG5cdGNvbnZlcnRGaWVsZCA9IChvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGQsIHNwYWNlSWQpLT5cblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXIgJiYgc3BhY2VJZCAmJiBmaWVsZC50eXBlID09ICdzZWxlY3QnXG5cdFx0XHRjb2RlID0gZmllbGQucGlja2xpc3QgfHwgXCIje29iamVjdF9uYW1lfS4je2ZpZWxkX25hbWV9XCI7XG5cdFx0XHRpZiBjb2RlXG5cdFx0XHRcdHBpY2tsaXN0ID0gQ3JlYXRvci5nZXRQaWNrbGlzdChjb2RlLCBzcGFjZUlkKTtcblx0XHRcdFx0aWYgcGlja2xpc3Rcblx0XHRcdFx0XHRvcHRpb25zID0gW107XG5cdFx0XHRcdFx0YWxsT3B0aW9ucyA9IFtdO1xuXHRcdFx0XHRcdHBpY2tsaXN0T3B0aW9ucyA9IENyZWF0b3IuZ2V0UGlja0xpc3RPcHRpb25zKHBpY2tsaXN0KVxuXHRcdFx0XHRcdHBpY2tsaXN0T3B0aW9ucyA9IF8uc29ydEJ5KHBpY2tsaXN0T3B0aW9ucywgJ3NvcnRfbm8nKT8ucmV2ZXJzZSgpO1xuXHRcdFx0XHRcdF8uZWFjaCBwaWNrbGlzdE9wdGlvbnMsIChpdGVtKS0+XG5cdFx0XHRcdFx0XHRsYWJlbCA9IGl0ZW0ubmFtZVxuXHRcdFx0XHRcdFx0dmFsdWUgPSBpdGVtLnZhbHVlIHx8IGl0ZW0ubmFtZVxuXHRcdFx0XHRcdFx0YWxsT3B0aW9ucy5wdXNoKHtsYWJlbDogbGFiZWwsIHZhbHVlOiB2YWx1ZSwgZW5hYmxlOiBpdGVtLmVuYWJsZSwgY29sb3I6IGl0ZW0uY29sb3J9KVxuXHRcdFx0XHRcdFx0aWYgaXRlbS5lbmFibGVcblx0XHRcdFx0XHRcdFx0b3B0aW9ucy5wdXNoKHtsYWJlbDogbGFiZWwsIHZhbHVlOiB2YWx1ZSwgY29sb3I6IGl0ZW0uY29sb3J9KVxuXHRcdFx0XHRcdFx0aWYgaXRlbS5kZWZhdWx0XG5cdFx0XHRcdFx0XHRcdGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlXG5cdFx0XHRcdFx0aWYgb3B0aW9ucy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gb3B0aW9uc1xuXHRcdFx0XHRcdGlmIGFsbE9wdGlvbnMubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0ZmllbGQuYWxsT3B0aW9ucyA9IGFsbE9wdGlvbnNcblx0XHRyZXR1cm4gZmllbGQ7XG5cblx0Q3JlYXRvci5jb252ZXJ0T2JqZWN0ID0gKG9iamVjdCwgc3BhY2VJZCktPlxuXHRcdGlmICFvYmplY3Rcblx0XHRcdHJldHVyblxuXHRcdF8uZm9yRWFjaCBvYmplY3QudHJpZ2dlcnMsICh0cmlnZ2VyLCBrZXkpLT5cblxuXHRcdFx0aWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09IFwic2VydmVyXCIpIHx8IChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiKVxuXHRcdFx0XHRfdG9kb19mcm9tX2NvZGUgPSB0cmlnZ2VyPy5fdG9kb1xuXHRcdFx0XHRfdG9kb19mcm9tX2RiID0gdHJpZ2dlci50b2RvXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSlcblx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2NvZGV9KVwiKVxuXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKVxuXHRcdFx0XHRcdCPlj6rmnIl1cGRhdGXml7bvvIwgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMg5omN5pyJ5YC8XG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YeP77yM5bCk5YW25pivQ29sbGVjdGlvblxuXHRcdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXG5cdFx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2RifSlcIilcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKXsje190b2RvX2Zyb21fZGJ9fSlcIilcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT0gXCJjbGllbnRcIlxuXHRcdFx0XHRfdG9kbyA9IHRyaWdnZXIudG9kb1xuXHRcdFx0XHRpZiBfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pXG5cdFx0XHRcdFx0dHJpZ2dlci5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKClcblxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5hY3Rpb25zLCAoYWN0aW9uLCBrZXkpLT5cblx0XHRcdFx0X3RvZG9fZnJvbV9jb2RlID0gYWN0aW9uPy5fdG9kb1xuXHRcdFx0XHRfdG9kb19mcm9tX2RiID0gYWN0aW9uPy50b2RvXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSlcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9jb2RlfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcInRvZG9fZnJvbV9jb2RlXCIsIF90b2RvX2Zyb21fY29kZVxuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYilcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXG5cdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9kYn0pXCIpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihDcmVhdG9yLmFjdGlvbnNCeU5hbWVbX3RvZG9fZnJvbV9kYl0pXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBfdG9kb19mcm9tX2RiXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIihmdW5jdGlvbigpeyN7X3RvZG9fZnJvbV9kYn19KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwidG9kb19mcm9tX2RiXCIsIF90b2RvX2Zyb21fZGIsIGVycm9yXG5cblx0XHRcdFx0X3Zpc2libGUgPSBhY3Rpb24/Ll92aXNpYmxlXG5cdFx0XHRcdGlmIF92aXNpYmxlXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRhY3Rpb24udmlzaWJsZSA9IENyZWF0b3IuZXZhbChcIigje192aXNpYmxlfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImFjdGlvbi52aXNpYmxlIHRvIGZ1bmN0aW9uIGVycm9yOiBcIiwgZXJyb3IsIF92aXNpYmxlXG5cdFx0ZWxzZVxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5hY3Rpb25zLCAoYWN0aW9uLCBrZXkpLT5cblx0XHRcdFx0X3RvZG8gPSBhY3Rpb24/LnRvZG9cblx0XHRcdFx0aWYgX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKVxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj1xuXHRcdFx0XHRcdGFjdGlvbi5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKClcblxuXHRcdFx0XHRfdmlzaWJsZSA9IGFjdGlvbj8udmlzaWJsZVxuXG5cdFx0XHRcdGlmIF92aXNpYmxlICYmIF8uaXNGdW5jdGlvbihfdmlzaWJsZSlcblx0XHRcdFx0XHRhY3Rpb24uX3Zpc2libGUgPSBfdmlzaWJsZS50b1N0cmluZygpXG5cblx0XHRfLmZvckVhY2ggb2JqZWN0LmZpZWxkcywgKGZpZWxkLCBrZXkpLT5cblxuXHRcdFx0ZmllbGQgPSBjb252ZXJ0RmllbGQob2JqZWN0Lm5hbWUsIGtleSwgZmllbGQsIHNwYWNlSWQpO1xuXG5cdFx0XHRpZiBmaWVsZC5vcHRpb25zICYmIF8uaXNTdHJpbmcoZmllbGQub3B0aW9ucylcblx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0X29wdGlvbnMgPSBbXVxuXHRcdFx0XHRcdCPmlK/mjIFcXG7miJbogIXoi7HmlofpgJflj7fliIblibIsXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIGZpZWxkLm9wdGlvbnMuc3BsaXQoXCJcXG5cIiksIChvcHRpb24pLT5cblx0XHRcdFx0XHRcdGlmIG9wdGlvbi5pbmRleE9mKFwiLFwiKVxuXHRcdFx0XHRcdFx0XHRvcHRpb25zID0gb3B0aW9uLnNwbGl0KFwiLFwiKVxuXHRcdFx0XHRcdFx0XHRfLmZvckVhY2ggb3B0aW9ucywgKF9vcHRpb24pLT5cblx0XHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihfb3B0aW9uKSlcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSlcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcblx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvclxuXG5cdFx0XHRlbHNlIGlmIGZpZWxkLm9wdGlvbnMgJiYgXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpXG5cdFx0XHRcdHRyeVxuXHRcdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0XHQj5pSv5oyB5pWw57uE5Lit55u05o6l5a6a5LmJ5q+P5Liq6YCJ6aG555qE566A54mI5qC85byP5a2X56ym5LiyXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIGZpZWxkLm9wdGlvbnMsIChvcHRpb24pLT5cblx0XHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcob3B0aW9uKVxuXHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKG9wdGlvbilcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcblx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvclxuXG5cdFx0XHRlbHNlIGlmIGZpZWxkLm9wdGlvbnMgJiYgIV8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zKSAmJiAhXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpICYmIF8uaXNPYmplY3QoZmllbGQub3B0aW9ucylcblx0XHRcdFx0X29wdGlvbnMgPSBbXVxuXHRcdFx0XHRfLmVhY2ggZmllbGQub3B0aW9ucywgKHYsIGspLT5cblx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogdiwgdmFsdWU6IGt9XG5cdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9uc1xuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0b3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcblx0XHRcdFx0aWYgb3B0aW9ucyAmJiBfLmlzRnVuY3Rpb24ob3B0aW9ucylcblx0XHRcdFx0XHRmaWVsZC5fb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnMudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRvcHRpb25zID0gZmllbGQuX29wdGlvbnNcblx0XHRcdFx0aWYgb3B0aW9ucyAmJiBfLmlzU3RyaW5nKG9wdGlvbnMpXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gQ3JlYXRvci5ldmFsKFwiKCN7b3B0aW9uc30pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdHJlZ0V4ID0gZmllbGQucmVnRXhcblx0XHRcdFx0aWYgcmVnRXhcblx0XHRcdFx0XHRmaWVsZC5fcmVnRXggPSBmaWVsZC5yZWdFeC50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJlZ0V4ID0gZmllbGQuX3JlZ0V4XG5cdFx0XHRcdGlmIHJlZ0V4XG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5yZWdFeCA9IENyZWF0b3IuZXZhbChcIigje3JlZ0V4fSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0bWluID0gZmllbGQubWluXG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihtaW4pXG5cdFx0XHRcdFx0ZmllbGQuX21pbiA9IG1pbi50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG1pbiA9IGZpZWxkLl9taW5cblx0XHRcdFx0aWYgXy5pc1N0cmluZyhtaW4pXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5taW4gPSBDcmVhdG9yLmV2YWwoXCIoI3ttaW59KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRtYXggPSBmaWVsZC5tYXhcblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKG1heClcblx0XHRcdFx0XHRmaWVsZC5fbWF4ID0gbWF4LnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0bWF4ID0gZmllbGQuX21heFxuXHRcdFx0XHRpZiBfLmlzU3RyaW5nKG1heClcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLm1heCA9IENyZWF0b3IuZXZhbChcIigje21heH0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdGlmIGZpZWxkLmF1dG9mb3JtXG5cdFx0XHRcdFx0X3R5cGUgPSBmaWVsZC5hdXRvZm9ybS50eXBlXG5cdFx0XHRcdFx0aWYgX3R5cGUgJiYgXy5pc0Z1bmN0aW9uKF90eXBlKSAmJiBfdHlwZSAhPSBPYmplY3QgJiYgX3R5cGUgIT0gU3RyaW5nICYmIF90eXBlICE9IE51bWJlciAmJiBfdHlwZSAhPSBCb29sZWFuICYmICFfLmlzQXJyYXkoX3R5cGUpXG5cdFx0XHRcdFx0XHRmaWVsZC5hdXRvZm9ybS5fdHlwZSA9IF90eXBlLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgZmllbGQuYXV0b2Zvcm1cblx0XHRcdFx0XHRfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLl90eXBlXG5cdFx0XHRcdFx0aWYgX3R5cGUgJiYgXy5pc1N0cmluZyhfdHlwZSlcblx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRmaWVsZC5hdXRvZm9ybS50eXBlID0gQ3JlYXRvci5ldmFsKFwiKCN7X3R5cGV9KVwiKVxuXHRcdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZmllbGQgLT4gdHlwZSBlcnJvclwiLCBmaWVsZCwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cblx0XHRcdFx0b3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uXG5cdFx0XHRcdHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uXG5cdFx0XHRcdGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxuXHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5maWx0ZXJzRnVuY3Rpb25cblxuXHRcdFx0XHRpZiBvcHRpb25zRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnNGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uID0gb3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKClcblxuXHRcdFx0XHRpZiByZWZlcmVuY2VfdG8gJiYgXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRmaWVsZC5fcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvLnRvU3RyaW5nKClcblxuXHRcdFx0XHRpZiBjcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oY3JlYXRlRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX2NyZWF0ZUZ1bmN0aW9uID0gY3JlYXRlRnVuY3Rpb24udG9TdHJpbmcoKVxuXHRcdFx0XHRpZiBiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGJlZm9yZU9wZW5GdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uID0gYmVmb3JlT3BlbkZ1bmN0aW9uLnRvU3RyaW5nKClcblxuXHRcdFx0XHRpZiBmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpbHRlcnNGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uID0gZmlsdGVyc0Z1bmN0aW9uLnRvU3RyaW5nKClcblx0XHRcdGVsc2VcblxuXHRcdFx0XHRvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uIHx8IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBmaWVsZC5fcmVmZXJlbmNlX3RvXG5cdFx0XHRcdGNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuX2NyZWF0ZUZ1bmN0aW9uXG5cdFx0XHRcdGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb25cblx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiB8fCBmaWVsZC5maWx0ZXJzRnVuY3Rpb25cblxuXHRcdFx0XHRpZiBvcHRpb25zRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhvcHRpb25zRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQub3B0aW9uc0Z1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7b3B0aW9uc0Z1bmN0aW9ufSlcIilcblxuXHRcdFx0XHRpZiByZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0ZmllbGQucmVmZXJlbmNlX3RvID0gQ3JlYXRvci5ldmFsKFwiKCN7cmVmZXJlbmNlX3RvfSlcIilcblxuXHRcdFx0XHRpZiBjcmVhdGVGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGNyZWF0ZUZ1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLmNyZWF0ZUZ1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7Y3JlYXRlRnVuY3Rpb259KVwiKVxuXG5cdFx0XHRcdGlmIGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGJlZm9yZU9wZW5GdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tiZWZvcmVPcGVuRnVuY3Rpb259KVwiKVxuXG5cdFx0XHRcdGlmIGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGZpbHRlcnNGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXJzRnVuY3Rpb259KVwiKVxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0ZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlXG5cdFx0XHRcdGlmIGRlZmF1bHRWYWx1ZSAmJiBfLmlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKVxuXHRcdFx0XHRcdGZpZWxkLl9kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWUudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5fZGVmYXVsdFZhbHVlXG5cblx0XHRcdFx0aWYgIWRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGZpZWxkLmRlZmF1bHRWYWx1ZSkgJiYgZmllbGQuZGVmYXVsdFZhbHVlLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKVxuXHRcdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXG5cdFx0XHRcdGlmIGRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGRlZmF1bHRWYWx1ZSlcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLmRlZmF1bHRWYWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2RlZmF1bHRWYWx1ZX0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3Jcblx0XHRcdFxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRpZiBpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc0Z1bmN0aW9uKGlzX2NvbXBhbnlfbGltaXRlZClcblx0XHRcdFx0XHRmaWVsZC5faXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0aXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRpZiBpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc1N0cmluZyhpc19jb21wYW55X2xpbWl0ZWQpXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPSBDcmVhdG9yLmV2YWwoXCIoI3tpc19jb21wYW55X2xpbWl0ZWR9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRfLmZvckVhY2ggb2JqZWN0Lmxpc3Rfdmlld3MsIChsaXN0X3ZpZXcsIGtleSkgLT5cblx0XHRcdCMjI1xuXHRcdFx06KeG5Zu+6L+H6JmR5Zmo6ZyA6KaB5pSv5oyBZnVuY3Rpb27vvIzlkI7lj7DovazmiJDlrZfnrKbkuLLvvIzliY3lj7BldmFs5oiQ5Ye95pWwXG5cdFx0XHTorqnov4fomZHlmajmlK/mjIHkuKTnp41mdW5jdGlvbuaWueW8j++8mlxuXHRcdFx0MS4g5pW05LiqZmlsdGVyc+S4umZ1bmN0aW9uOlxuXHRcdFx05aaC77yaXG5cdFx0XHRmaWx0ZXJzOiAoKS0+XG5cdFx0XHRcdHJldHVybiBbW1tcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJwcm9qZWN0X2lzc3Vlc1wiXSwnb3InLFtcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJ0YXNrc1wiXV1dXG5cdFx0XHQyLiBmaWx0ZXJz5YaF55qEZmlsdGVyLnZhbHVl5Li6ZnVuY3Rpb25cblx0XHRcdOWmgu+8mlxuXHRcdFx0ZmlsdGVyczogW1tcIm9iamVjdF9uYW1lXCIsIFwiPVwiLCAoKS0+XG5cdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcblx0XHRcdF1dXG5cdFx0XHTmiJZcblx0XHRcdGZpbHRlcnM6IFt7XG5cdFx0XHRcdFwiZmllbGRcIjogXCJvYmplY3RfbmFtZVwiXG5cdFx0XHRcdFwib3BlcmF0aW9uXCI6IFwiPVwiXG5cdFx0XHRcdFwidmFsdWVcIjogKCktPlxuXHRcdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcblx0XHRcdH1dXG5cdFx0XHQjIyNcblx0XHRcdGlmIF8uaXNGdW5jdGlvbihsaXN0X3ZpZXcuZmlsdGVycylcblx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdFx0bGlzdF92aWV3Ll9maWx0ZXJzID0gbGlzdF92aWV3LmZpbHRlcnMudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZSBpZiBfLmlzU3RyaW5nKGxpc3Rfdmlldy5fZmlsdGVycylcblx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0bGlzdF92aWV3LmZpbHRlcnMgPSBDcmVhdG9yLmV2YWwoXCIoI3tsaXN0X3ZpZXcuX2ZpbHRlcnN9KVwiKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRfLmZvckVhY2ggbGlzdF92aWV3LmZpbHRlcnMsIChmaWx0ZXIsIF9pbmRleCktPlxuXHRcdFx0XHRcdGlmIF8uaXNBcnJheShmaWx0ZXIpXG5cdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0XHRcdFx0aWYgZmlsdGVyLmxlbmd0aCA9PSAzIGFuZCBfLmlzRnVuY3Rpb24oZmlsdGVyWzJdKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IGZpbHRlclsyXS50b1N0cmluZygpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzNdID0gXCJGVU5DVElPTlwiXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgZmlsdGVyLmxlbmd0aCA9PSAzIGFuZCBfLmlzRGF0ZShmaWx0ZXJbMl0pXG5cdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpzmmK9EYXRl57G75Z6L77yM5YiZZmlsdGVyWzJd5YC85Yiw5YmN56uv5Lya6Ieq5Yqo6L2s5oiQ5a2X56ym5Liy77yM5qC85byP77yaXCIyMDE4LTAzLTI5VDAzOjQzOjIxLjc4N1pcIlxuXHRcdFx0XHRcdFx0XHRcdCMg5YyF5ousZ3JpZOWIl+ihqOivt+axgueahOaOpeWPo+WcqOWGheeahOaJgOaciU9EYXRh5o6l5Y+j77yMRGF0Zeexu+Wei+Wtl+autemDveS8muS7peS4iui/sOagvOW8j+i/lOWbnlxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclszXSA9IFwiREFURVwiXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gNCBhbmQgXy5pc1N0cmluZyhmaWx0ZXJbMl0pIGFuZCBmaWx0ZXJbM10gPT0gXCJGVU5DVElPTlwiXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzJdID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyWzJdfSlcIilcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIucG9wKClcblx0XHRcdFx0XHRcdFx0aWYgZmlsdGVyLmxlbmd0aCA9PSA0IGFuZCBfLmlzU3RyaW5nKGZpbHRlclsyXSkgYW5kIGZpbHRlclszXSA9PSBcIkRBVEVcIlxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IG5ldyBEYXRlKGZpbHRlclsyXSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIucG9wKClcblx0XHRcdFx0XHRlbHNlIGlmIF8uaXNPYmplY3QoZmlsdGVyKVxuXHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihmaWx0ZXI/LnZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNEYXRlKGZpbHRlcj8udmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLl9pc19kYXRlID0gdHJ1ZVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpbHRlcj8uX3ZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlci5fdmFsdWV9KVwiKVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZpbHRlci5faXNfZGF0ZSA9PSB0cnVlXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gbmV3IERhdGUoZmlsdGVyLnZhbHVlKVxuXG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRpZiBvYmplY3QuZm9ybSAmJiAhXy5pc1N0cmluZyhvYmplY3QuZm9ybSlcblx0XHRcdFx0b2JqZWN0LmZvcm0gPSBKU09OLnN0cmluZ2lmeSBvYmplY3QuZm9ybSwgKGtleSwgdmFsKS0+XG5cdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKHZhbClcblx0XHRcdFx0XHRcdHJldHVybiB2YWwgKyAnJztcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdGVsc2UgaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRpZiBvYmplY3QuZm9ybVxuXHRcdFx0XHRvYmplY3QuZm9ybSA9IEpTT04ucGFyc2Ugb2JqZWN0LmZvcm0sIChrZXksIHZhbCktPlxuXHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcodmFsKSAmJiB2YWwuc3RhcnRzV2l0aCgnZnVuY3Rpb24nKVxuXHRcdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZXZhbChcIigje3ZhbH0pXCIpXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkTGlzdCwgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpXG5cdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaWx0ZXJzX2NvZGVcIiwgdmFsXG5cdFx0ZWxzZVxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkTGlzdCwgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbClcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpXG5cblx0XHRyZXR1cm4gb2JqZWN0XG5cblxuIiwidmFyIGNvbnZlcnRGaWVsZCwgZ2V0T3B0aW9uO1xuXG5nZXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgdmFyIGZvbztcbiAgZm9vID0gb3B0aW9uLnNwbGl0KFwiOlwiKTtcbiAgaWYgKGZvby5sZW5ndGggPiAyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzFdLFxuICAgICAgY29sb3I6IGZvb1syXVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZm9vLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMV1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1swXVxuICAgIH07XG4gIH1cbn07XG5cbmNvbnZlcnRGaWVsZCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZCwgc3BhY2VJZCkge1xuICB2YXIgYWxsT3B0aW9ucywgY29kZSwgb3B0aW9ucywgcGlja2xpc3QsIHBpY2tsaXN0T3B0aW9ucywgcmVmO1xuICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHNwYWNlSWQgJiYgZmllbGQudHlwZSA9PT0gJ3NlbGVjdCcpIHtcbiAgICBjb2RlID0gZmllbGQucGlja2xpc3QgfHwgKG9iamVjdF9uYW1lICsgXCIuXCIgKyBmaWVsZF9uYW1lKTtcbiAgICBpZiAoY29kZSkge1xuICAgICAgcGlja2xpc3QgPSBDcmVhdG9yLmdldFBpY2tsaXN0KGNvZGUsIHNwYWNlSWQpO1xuICAgICAgaWYgKHBpY2tsaXN0KSB7XG4gICAgICAgIG9wdGlvbnMgPSBbXTtcbiAgICAgICAgYWxsT3B0aW9ucyA9IFtdO1xuICAgICAgICBwaWNrbGlzdE9wdGlvbnMgPSBDcmVhdG9yLmdldFBpY2tMaXN0T3B0aW9ucyhwaWNrbGlzdCk7XG4gICAgICAgIHBpY2tsaXN0T3B0aW9ucyA9IChyZWYgPSBfLnNvcnRCeShwaWNrbGlzdE9wdGlvbnMsICdzb3J0X25vJykpICE9IG51bGwgPyByZWYucmV2ZXJzZSgpIDogdm9pZCAwO1xuICAgICAgICBfLmVhY2gocGlja2xpc3RPcHRpb25zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgdmFyIGxhYmVsLCB2YWx1ZTtcbiAgICAgICAgICBsYWJlbCA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICB2YWx1ZSA9IGl0ZW0udmFsdWUgfHwgaXRlbS5uYW1lO1xuICAgICAgICAgIGFsbE9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBlbmFibGU6IGl0ZW0uZW5hYmxlLFxuICAgICAgICAgICAgY29sb3I6IGl0ZW0uY29sb3JcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaXRlbS5lbmFibGUpIHtcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICBjb2xvcjogaXRlbS5jb2xvclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtW1wiZGVmYXVsdFwiXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsT3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGQuYWxsT3B0aW9ucyA9IGFsbE9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpZWxkO1xufTtcblxuQ3JlYXRvci5jb252ZXJ0T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0LCBzcGFjZUlkKSB7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIF8uZm9yRWFjaChvYmplY3QudHJpZ2dlcnMsIGZ1bmN0aW9uKHRyaWdnZXIsIGtleSkge1xuICAgIHZhciBfdG9kbywgX3RvZG9fZnJvbV9jb2RlLCBfdG9kb19mcm9tX2RiO1xuICAgIGlmICgoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwic2VydmVyXCIpIHx8IChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIikpIHtcbiAgICAgIF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXIgIT0gbnVsbCA/IHRyaWdnZXIuX3RvZG8gOiB2b2lkIDA7XG4gICAgICBfdG9kb19mcm9tX2RiID0gdHJpZ2dlci50b2RvO1xuICAgICAgaWYgKF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSkpIHtcbiAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2NvZGUgKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpKSB7XG4gICAgICAgIGlmIChfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9kYiArIFwiKVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpe1wiICsgX3RvZG9fZnJvbV9kYiArIFwifSlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiKSB7XG4gICAgICBfdG9kbyA9IHRyaWdnZXIudG9kbztcbiAgICAgIGlmIChfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pKSB7XG4gICAgICAgIHJldHVybiB0cmlnZ2VyLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5hY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24sIGtleSkge1xuICAgICAgdmFyIF90b2RvX2Zyb21fY29kZSwgX3RvZG9fZnJvbV9kYiwgX3Zpc2libGUsIGVycm9yO1xuICAgICAgX3RvZG9fZnJvbV9jb2RlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24uX3RvZG8gOiB2b2lkIDA7XG4gICAgICBfdG9kb19mcm9tX2RiID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMDtcbiAgICAgIGlmIChfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fY29kZSArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcInRvZG9fZnJvbV9jb2RlXCIsIF90b2RvX2Zyb21fY29kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYikpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2RiICsgXCIpXCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKENyZWF0b3IuYWN0aW9uc0J5TmFtZVtfdG9kb19mcm9tX2RiXSkpIHtcbiAgICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBfdG9kb19mcm9tX2RiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihmdW5jdGlvbigpe1wiICsgX3RvZG9fZnJvbV9kYiArIFwifSlcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwidG9kb19mcm9tX2RiXCIsIF90b2RvX2Zyb21fZGIsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgX3Zpc2libGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi5fdmlzaWJsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChfdmlzaWJsZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBhY3Rpb24udmlzaWJsZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3Zpc2libGUgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiYWN0aW9uLnZpc2libGUgdG8gZnVuY3Rpb24gZXJyb3I6IFwiLCBlcnJvciwgX3Zpc2libGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5hY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24sIGtleSkge1xuICAgICAgdmFyIF90b2RvLCBfdmlzaWJsZTtcbiAgICAgIF90b2RvID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMDtcbiAgICAgIGlmIChfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pKSB7XG4gICAgICAgIGFjdGlvbi5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBfdmlzaWJsZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnZpc2libGUgOiB2b2lkIDA7XG4gICAgICBpZiAoX3Zpc2libGUgJiYgXy5pc0Z1bmN0aW9uKF92aXNpYmxlKSkge1xuICAgICAgICByZXR1cm4gYWN0aW9uLl92aXNpYmxlID0gX3Zpc2libGUudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBfLmZvckVhY2gob2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGtleSkge1xuICAgIHZhciBfb3B0aW9ucywgX3R5cGUsIGJlZm9yZU9wZW5GdW5jdGlvbiwgY3JlYXRlRnVuY3Rpb24sIGRlZmF1bHRWYWx1ZSwgZXJyb3IsIGZpbHRlcnNGdW5jdGlvbiwgaXNfY29tcGFueV9saW1pdGVkLCBtYXgsIG1pbiwgb3B0aW9ucywgb3B0aW9uc0Z1bmN0aW9uLCByZWZlcmVuY2VfdG8sIHJlZ0V4O1xuICAgIGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcbiAgICBpZiAoZmllbGQub3B0aW9ucyAmJiBfLmlzU3RyaW5nKGZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goZmllbGQub3B0aW9ucy5zcGxpdChcIlxcblwiKSwgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgdmFyIG9wdGlvbnM7XG4gICAgICAgICAgaWYgKG9wdGlvbi5pbmRleE9mKFwiLFwiKSkge1xuICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbi5zcGxpdChcIixcIik7XG4gICAgICAgICAgICByZXR1cm4gXy5mb3JFYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKF9vcHRpb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKF9vcHRpb24pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmllbGQub3B0aW9ucyA9IF9vcHRpb25zO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC5vcHRpb25zICYmIF8uaXNBcnJheShmaWVsZC5vcHRpb25zKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKGZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgIGlmIChfLmlzU3RyaW5nKG9wdGlvbikpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLm9wdGlvbnMgJiYgIV8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zKSAmJiAhXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpICYmIF8uaXNPYmplY3QoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIF9vcHRpb25zID0gW107XG4gICAgICBfLmVhY2goZmllbGQub3B0aW9ucywgZnVuY3Rpb24odiwgaykge1xuICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgbGFiZWw6IHYsXG4gICAgICAgICAgdmFsdWU6IGtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzRnVuY3Rpb24ob3B0aW9ucykpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5fb3B0aW9ucztcbiAgICAgIGlmIChvcHRpb25zICYmIF8uaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBvcHRpb25zICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmVnRXggPSBmaWVsZC5yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICBmaWVsZC5fcmVnRXggPSBmaWVsZC5yZWdFeC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWdFeCA9IGZpZWxkLl9yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLnJlZ0V4ID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWdFeCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG1pbiA9IGZpZWxkLm1pbjtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24obWluKSkge1xuICAgICAgICBmaWVsZC5fbWluID0gbWluLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1pbiA9IGZpZWxkLl9taW47XG4gICAgICBpZiAoXy5pc1N0cmluZyhtaW4pKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQubWluID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBtaW4gKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBtYXggPSBmaWVsZC5tYXg7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG1heCkpIHtcbiAgICAgICAgZmllbGQuX21heCA9IG1heC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtYXggPSBmaWVsZC5fbWF4O1xuICAgICAgaWYgKF8uaXNTdHJpbmcobWF4KSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLm1heCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbWF4ICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0udHlwZTtcbiAgICAgICAgaWYgKF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT09IE9iamVjdCAmJiBfdHlwZSAhPT0gU3RyaW5nICYmIF90eXBlICE9PSBOdW1iZXIgJiYgX3R5cGUgIT09IEJvb2xlYW4gJiYgIV8uaXNBcnJheShfdHlwZSkpIHtcbiAgICAgICAgICBmaWVsZC5hdXRvZm9ybS5fdHlwZSA9IF90eXBlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0uX3R5cGU7XG4gICAgICAgIGlmIChfdHlwZSAmJiBfLmlzU3RyaW5nKF90eXBlKSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmaWVsZC5hdXRvZm9ybS50eXBlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdHlwZSArIFwiKVwiKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZmllbGQgLT4gdHlwZSBlcnJvclwiLCBmaWVsZCwgZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uO1xuICAgICAgYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgaWYgKG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24ob3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uID0gb3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAocmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIGZpZWxkLl9yZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChjcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9jcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb24gPSBiZWZvcmVPcGVuRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpbHRlcnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uIHx8IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgIHJlZmVyZW5jZV90byA9IGZpZWxkLl9yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvbjtcbiAgICAgIGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICBmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uIHx8IGZpZWxkLmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgIGlmIChvcHRpb25zRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhvcHRpb25zRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgb3B0aW9uc0Z1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgZmllbGQucmVmZXJlbmNlX3RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWZlcmVuY2VfdG8gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoY3JlYXRlRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhjcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGNyZWF0ZUZ1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGJlZm9yZU9wZW5GdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBiZWZvcmVPcGVuRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcoZmlsdGVyc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlcnNGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAmJiBfLmlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICBmaWVsZC5fZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLl9kZWZhdWx0VmFsdWU7XG4gICAgICBpZiAoIWRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGZpZWxkLmRlZmF1bHRWYWx1ZSkgJiYgZmllbGQuZGVmYXVsdFZhbHVlLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAoZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZGVmYXVsdFZhbHVlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgaWYgKGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzRnVuY3Rpb24oaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICByZXR1cm4gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgaWYgKGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzU3RyaW5nKGlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gZmllbGQuaXNfY29tcGFueV9saW1pdGVkID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBpc19jb21wYW55X2xpbWl0ZWQgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBfLmZvckVhY2gob2JqZWN0Lmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGxpc3Rfdmlldywga2V5KSB7XG5cbiAgICAvKlxuICAgIFx0XHRcdOinhuWbvui/h+iZkeWZqOmcgOimgeaUr+aMgWZ1bmN0aW9u77yM5ZCO5Y+w6L2s5oiQ5a2X56ym5Liy77yM5YmN5Y+wZXZhbOaIkOWHveaVsFxuICAgIFx0XHRcdOiuqei/h+iZkeWZqOaUr+aMgeS4pOenjWZ1bmN0aW9u5pa55byP77yaXG4gICAgXHRcdFx0MS4g5pW05LiqZmlsdGVyc+S4umZ1bmN0aW9uOlxuICAgIFx0XHRcdOWmgu+8mlxuICAgIFx0XHRcdGZpbHRlcnM6ICgpLT5cbiAgICBcdFx0XHRcdHJldHVybiBbW1tcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJwcm9qZWN0X2lzc3Vlc1wiXSwnb3InLFtcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJ0YXNrc1wiXV1dXG4gICAgXHRcdFx0Mi4gZmlsdGVyc+WGheeahGZpbHRlci52YWx1ZeS4umZ1bmN0aW9uXG4gICAgXHRcdFx05aaC77yaXG4gICAgXHRcdFx0ZmlsdGVyczogW1tcIm9iamVjdF9uYW1lXCIsIFwiPVwiLCAoKS0+XG4gICAgXHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG4gICAgXHRcdFx0XV1cbiAgICBcdFx0XHTmiJZcbiAgICBcdFx0XHRmaWx0ZXJzOiBbe1xuICAgIFx0XHRcdFx0XCJmaWVsZFwiOiBcIm9iamVjdF9uYW1lXCJcbiAgICBcdFx0XHRcdFwib3BlcmF0aW9uXCI6IFwiPVwiXG4gICAgXHRcdFx0XHRcInZhbHVlXCI6ICgpLT5cbiAgICBcdFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuICAgIFx0XHRcdH1dXG4gICAgICovXG4gICAgaWYgKF8uaXNGdW5jdGlvbihsaXN0X3ZpZXcuZmlsdGVycykpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlldy5fZmlsdGVycyA9IGxpc3Rfdmlldy5maWx0ZXJzLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKGxpc3Rfdmlldy5fZmlsdGVycykpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlldy5maWx0ZXJzID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBsaXN0X3ZpZXcuX2ZpbHRlcnMgKyBcIilcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBfLmZvckVhY2gobGlzdF92aWV3LmZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlciwgX2luZGV4KSB7XG4gICAgICAgIGlmIChfLmlzQXJyYXkoZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSAzICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJbMl0pKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IGZpbHRlclsyXS50b1N0cmluZygpO1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyWzNdID0gXCJGVU5DVElPTlwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubGVuZ3RoID09PSAzICYmIF8uaXNEYXRlKGZpbHRlclsyXSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlclszXSA9IFwiREFURVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gNCAmJiBfLmlzU3RyaW5nKGZpbHRlclsyXSkgJiYgZmlsdGVyWzNdID09PSBcIkZVTkNUSU9OXCIpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXJbMl0gKyBcIilcIik7XG4gICAgICAgICAgICAgIGZpbHRlci5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSA0ICYmIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSAmJiBmaWx0ZXJbM10gPT09IFwiREFURVwiKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IG5ldyBEYXRlKGZpbHRlclsyXSk7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNEYXRlKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLl9pc19kYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIuX3ZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXIuX3ZhbHVlICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIuX2lzX2RhdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKG9iamVjdC5mb3JtICYmICFfLmlzU3RyaW5nKG9iamVjdC5mb3JtKSkge1xuICAgICAgb2JqZWN0LmZvcm0gPSBKU09OLnN0cmluZ2lmeShvYmplY3QuZm9ybSwgZnVuY3Rpb24oa2V5LCB2YWwpIHtcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbCArICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSBlbHNlIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAob2JqZWN0LmZvcm0pIHtcbiAgICAgIG9iamVjdC5mb3JtID0gSlNPTi5wYXJzZShvYmplY3QuZm9ybSwgZnVuY3Rpb24oa2V5LCB2YWwpIHtcbiAgICAgICAgaWYgKF8uaXNTdHJpbmcodmFsKSAmJiB2YWwuc3RhcnRzV2l0aCgnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHZhbCArIFwiKVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZExpc3QsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHZhbCArIFwiKVwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJmaWx0ZXJzX2NvZGVcIiwgdmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZExpc3QsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsIkNyZWF0b3IuRm9ybXVsYXIgPSB7fVxuXG5DcmVhdG9yLkZvcm11bGFyLlBSRUZJWCA9IFwiX1ZBTFVFU1wiXG5cbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gKHByZWZpeCxmaWVsZFZhcmlhYmxlKS0+XG5cdHJlZyA9IC8oXFx7W157fV0qXFx9KS9nO1xuXG5cdHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZSByZWcsIChtLCAkMSktPlxuXHRcdHJldHVybiBwcmVmaXggKyAkMS5yZXBsYWNlKC9cXHtcXHMqLyxcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLFwiXFxcIl1cIikucmVwbGFjZSgvXFxzKlxcLlxccyovZyxcIlxcXCJdW1xcXCJcIik7XG5cblx0cmV0dXJuIHJldlxuXG5DcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYSA9IChmb3JtdWxhX3N0ciktPlxuXHRpZiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTFcblx0XHRyZXR1cm4gdHJ1ZVxuXHRyZXR1cm4gZmFsc2VcblxuQ3JlYXRvci5Gb3JtdWxhci5ydW4gPSAoZm9ybXVsYV9zdHIsIF9DT05URVhULCBvcHRpb25zKS0+XG5cdGlmIGZvcm11bGFfc3RyICYmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpXG5cblx0XHRpZiAhXy5pc0Jvb2xlYW4ob3B0aW9ucz8uZXh0ZW5kKVxuXHRcdFx0ZXh0ZW5kID0gdHJ1ZVxuXG5cdFx0X1ZBTFVFUyA9IHt9XG5cdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIF9DT05URVhUKVxuXHRcdGlmIGV4dGVuZFxuXHRcdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucz8udXNlcklkLCBvcHRpb25zPy5zcGFjZUlkKSlcblx0XHRmb3JtdWxhX3N0ciA9IENyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhKFwidGhpc1wiLCBmb3JtdWxhX3N0cilcblxuXHRcdHRyeVxuXHRcdFx0ZGF0YSA9IENyZWF0b3IuZXZhbEluQ29udGV4dChmb3JtdWxhX3N0ciwgX1ZBTFVFUykgICAjIOatpOWkhOS4jeiDveeUqHdpbmRvdy5ldmFsIO+8jOS8muWvvOiHtOWPmOmHj+S9nOeUqOWfn+W8guW4uFxuXHRcdFx0cmV0dXJuIGRhdGFcblx0XHRjYXRjaCBlXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46ICN7Zm9ybXVsYV9zdHJ9XCIsIGUpXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0dG9hc3RyPy5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46ICN7Zm9ybXVsYV9zdHJ9I3tlfVwiXG5cblx0cmV0dXJuIGZvcm11bGFfc3RyXG4iLCJDcmVhdG9yLkZvcm11bGFyID0ge307XG5cbkNyZWF0b3IuRm9ybXVsYXIuUFJFRklYID0gXCJfVkFMVUVTXCI7XG5cbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gZnVuY3Rpb24ocHJlZml4LCBmaWVsZFZhcmlhYmxlKSB7XG4gIHZhciByZWcsIHJldjtcbiAgcmVnID0gLyhcXHtbXnt9XSpcXH0pL2c7XG4gIHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZShyZWcsIGZ1bmN0aW9uKG0sICQxKSB7XG4gICAgcmV0dXJuIHByZWZpeCArICQxLnJlcGxhY2UoL1xce1xccyovLCBcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLCBcIlxcXCJdXCIpLnJlcGxhY2UoL1xccypcXC5cXHMqL2csIFwiXFxcIl1bXFxcIlwiKTtcbiAgfSk7XG4gIHJldHVybiByZXY7XG59O1xuXG5DcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYSA9IGZ1bmN0aW9uKGZvcm11bGFfc3RyKSB7XG4gIGlmIChfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTEpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5DcmVhdG9yLkZvcm11bGFyLnJ1biA9IGZ1bmN0aW9uKGZvcm11bGFfc3RyLCBfQ09OVEVYVCwgb3B0aW9ucykge1xuICB2YXIgX1ZBTFVFUywgZGF0YSwgZSwgZXh0ZW5kO1xuICBpZiAoZm9ybXVsYV9zdHIgJiYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cikpIHtcbiAgICBpZiAoIV8uaXNCb29sZWFuKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuZXh0ZW5kIDogdm9pZCAwKSkge1xuICAgICAgZXh0ZW5kID0gdHJ1ZTtcbiAgICB9XG4gICAgX1ZBTFVFUyA9IHt9O1xuICAgIF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBfQ09OVEVYVCk7XG4gICAgaWYgKGV4dGVuZCkge1xuICAgICAgX1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy51c2VySWQgOiB2b2lkIDAsIG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc3BhY2VJZCA6IHZvaWQgMCkpO1xuICAgIH1cbiAgICBmb3JtdWxhX3N0ciA9IENyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhKFwidGhpc1wiLCBmb3JtdWxhX3N0cik7XG4gICAgdHJ5IHtcbiAgICAgIGRhdGEgPSBDcmVhdG9yLmV2YWxJbkNvbnRleHQoZm9ybXVsYV9zdHIsIF9WQUxVRVMpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGUgPSBlcnJvcjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogXCIgKyBmb3JtdWxhX3N0ciwgZSk7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdG9hc3RyICE9PSBcInVuZGVmaW5lZFwiICYmIHRvYXN0ciAhPT0gbnVsbCkge1xuICAgICAgICAgIHRvYXN0ci5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46IFwiICsgZm9ybXVsYV9zdHIgKyBlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZvcm11bGFfc3RyO1xufTtcbiIsImNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcbkNyZWF0b3Iub2JqZWN0c0J5TmFtZSA9IHt9ICAgIyDmraTlr7nosaHlj6rog73lnKjnoa7kv53miYDmnIlPYmplY3TliJ3lp4vljJblrozmiJDlkI7osIPnlKjvvIwg5ZCm5YiZ6I635Y+W5Yiw55qEb2JqZWN05LiN5YWoXG5cbkNyZWF0b3IuZm9ybWF0T2JqZWN0TmFtZSA9IChvYmplY3RfbmFtZSktPlxuXHRpZiBvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjZnMuZmlsZXMuJylcblx0XHRvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpXG5cdHJldHVybiBvYmplY3RfbmFtZVxuXG5DcmVhdG9yLk9iamVjdCA9IChvcHRpb25zKS0+XG5cdF9iYXNlT2JqZWN0ID0gQ3JlYXRvci5iYXNlT2JqZWN0XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdF9iYXNlT2JqZWN0ID0ge2FjdGlvbnM6IENyZWF0b3IuYmFzZU9iamVjdC5hY3Rpb25zICwgZmllbGRzOiB7fSwgdHJpZ2dlcnM6IHt9LCBwZXJtaXNzaW9uX3NldDoge319XG5cdHNlbGYgPSB0aGlzXG5cdGlmICghb3B0aW9ucy5uYW1lKVxuXHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucylcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IG5hbWUnKTtcblxuXHRzZWxmLl9pZCA9IG9wdGlvbnMuX2lkIHx8IG9wdGlvbnMubmFtZVxuXHRzZWxmLnNwYWNlID0gb3B0aW9ucy5zcGFjZVxuXHRzZWxmLm5hbWUgPSBvcHRpb25zLm5hbWVcblx0c2VsZi5sYWJlbCA9IG9wdGlvbnMubGFiZWxcblx0c2VsZi5pY29uID0gb3B0aW9ucy5pY29uXG5cdHNlbGYuZGVzY3JpcHRpb24gPSBvcHRpb25zLmRlc2NyaXB0aW9uXG5cdHNlbGYuaXNfdmlldyA9IG9wdGlvbnMuaXNfdmlld1xuXHRzZWxmLmZvcm0gPSBvcHRpb25zLmZvcm1cblx0c2VsZi5yZWxhdGVkTGlzdCA9IG9wdGlvbnMucmVsYXRlZExpc3Rcblx0aWYgIV8uaXNCb29sZWFuKG9wdGlvbnMuaXNfZW5hYmxlKSAgfHwgb3B0aW9ucy5pc19lbmFibGUgPT0gdHJ1ZVxuXHRcdHNlbGYuaXNfZW5hYmxlID0gdHJ1ZVxuXHRlbHNlXG5cdFx0c2VsZi5pc19lbmFibGUgPSBmYWxzZVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnYWxsb3dfY3VzdG9tQWN0aW9ucycpXG5cdFx0XHRzZWxmLmFsbG93X2N1c3RvbUFjdGlvbnMgPSBvcHRpb25zLmFsbG93X2N1c3RvbUFjdGlvbnNcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnZXhjbHVkZV9hY3Rpb25zJylcblx0XHRcdHNlbGYuZXhjbHVkZV9hY3Rpb25zID0gb3B0aW9ucy5leGNsdWRlX2FjdGlvbnNcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnYWxsb3dfcmVsYXRlZExpc3QnKVxuXHRcdFx0c2VsZi5hbGxvd19yZWxhdGVkTGlzdCA9IG9wdGlvbnMuYWxsb3dfcmVsYXRlZExpc3Rcblx0c2VsZi5lbmFibGVfc2VhcmNoID0gb3B0aW9ucy5lbmFibGVfc2VhcmNoXG5cdHNlbGYuZW5hYmxlX2ZpbGVzID0gb3B0aW9ucy5lbmFibGVfZmlsZXNcblx0c2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrc1xuXHRzZWxmLmVuYWJsZV9ub3RlcyA9IG9wdGlvbnMuZW5hYmxlX25vdGVzXG5cdHNlbGYuZW5hYmxlX2F1ZGl0ID0gb3B0aW9ucy5lbmFibGVfYXVkaXRcblx0aWYgb3B0aW9ucy5wYWdpbmdcblx0XHRzZWxmLnBhZ2luZyA9IG9wdGlvbnMucGFnaW5nXG5cdHNlbGYuaGlkZGVuID0gb3B0aW9ucy5oaWRkZW5cblx0c2VsZi5lbmFibGVfYXBpID0gKG9wdGlvbnMuZW5hYmxlX2FwaSA9PSB1bmRlZmluZWQpIG9yIG9wdGlvbnMuZW5hYmxlX2FwaVxuXHRzZWxmLmN1c3RvbSA9IG9wdGlvbnMuY3VzdG9tXG5cdHNlbGYuZW5hYmxlX3NoYXJlID0gb3B0aW9ucy5lbmFibGVfc2hhcmVcblx0c2VsZi5lbmFibGVfaW5zdGFuY2VzID0gb3B0aW9ucy5lbmFibGVfaW5zdGFuY2VzXG5cdHNlbGYuZW5hYmxlX3Byb2Nlc3MgPSBvcHRpb25zLmVuYWJsZV9wcm9jZXNzXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmIENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKVxuXHRcdFx0c2VsZi5lbmFibGVfdHJlZSA9IGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0c2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWVcblx0XHRcdHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKVxuXHRlbHNlXG5cdFx0c2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpXG5cdFx0c2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWVcblx0c2VsZi5vcGVuX3dpbmRvdyA9IG9wdGlvbnMub3Blbl93aW5kb3dcblx0c2VsZi5maWx0ZXJfY29tcGFueSA9IG9wdGlvbnMuZmlsdGVyX2NvbXBhbnlcblx0c2VsZi5jYWxlbmRhciA9IF8uY2xvbmUob3B0aW9ucy5jYWxlbmRhcilcblx0c2VsZi5lbmFibGVfY2hhdHRlciA9IG9wdGlvbnMuZW5hYmxlX2NoYXR0ZXJcblx0c2VsZi5lbmFibGVfdHJhc2ggPSBvcHRpb25zLmVuYWJsZV90cmFzaFxuXHRzZWxmLmVuYWJsZV9zcGFjZV9nbG9iYWwgPSBvcHRpb25zLmVuYWJsZV9zcGFjZV9nbG9iYWxcblx0c2VsZi5lbmFibGVfYXBwcm92YWxzID0gb3B0aW9ucy5lbmFibGVfYXBwcm92YWxzXG5cdHNlbGYuZW5hYmxlX2ZvbGxvdyA9IG9wdGlvbnMuZW5hYmxlX2ZvbGxvd1xuXHRzZWxmLmVuYWJsZV93b3JrZmxvdyA9IG9wdGlvbnMuZW5hYmxlX3dvcmtmbG93XG5cdHNlbGYuZW5hYmxlX2lubGluZV9lZGl0ID0gb3B0aW9ucy5lbmFibGVfaW5saW5lX2VkaXRcblx0c2VsZi5kZXRhaWxzID0gb3B0aW9ucy5kZXRhaWxzXG5cdHNlbGYubWFzdGVycyA9IG9wdGlvbnMubWFzdGVyc1xuXHRzZWxmLmxvb2t1cF9kZXRhaWxzID0gb3B0aW9ucy5sb29rdXBfZGV0YWlsc1xuXHRpZiBfLmhhcyhvcHRpb25zLCAnaW5fZGV2ZWxvcG1lbnQnKVxuXHRcdHNlbGYuaW5fZGV2ZWxvcG1lbnQgPSBvcHRpb25zLmluX2RldmVsb3BtZW50XG5cdHNlbGYuaWRGaWVsZE5hbWUgPSAnX2lkJ1xuXHRpZiBvcHRpb25zLmRhdGFiYXNlX25hbWVcblx0XHRzZWxmLmRhdGFiYXNlX25hbWUgPSBvcHRpb25zLmRhdGFiYXNlX25hbWVcblx0aWYgKCFvcHRpb25zLmZpZWxkcylcblx0XHRjb25zb2xlLmVycm9yKG9wdGlvbnMpXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBmaWVsZHMnKTtcblxuXHRzZWxmLmZpZWxkcyA9IGNsb25lKG9wdGlvbnMuZmllbGRzKVxuXG5cdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0aWYgZmllbGQuaXNfbmFtZVxuXHRcdFx0c2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWVcblx0XHRlbHNlIGlmIGZpZWxkX25hbWUgPT0gJ25hbWUnICYmICFzZWxmLk5BTUVfRklFTERfS0VZXG5cdFx0XHRzZWxmLk5BTUVfRklFTERfS0VZID0gZmllbGRfbmFtZVxuXHRcdGlmIGZpZWxkLnByaW1hcnlcblx0XHRcdHNlbGYuaWRGaWVsZE5hbWUgPSBmaWVsZF9uYW1lXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSlcblx0XHRcdFx0aWYgZmllbGRfbmFtZSA9PSAnc3BhY2UnXG5cdFx0XHRcdFx0ZmllbGQuZmlsdGVyYWJsZSA9IHRydWVcblx0XHRcdFx0XHRmaWVsZC5oaWRkZW4gPSBmYWxzZVxuXG5cdGlmICFvcHRpb25zLmRhdGFiYXNlX25hbWUgfHwgb3B0aW9ucy5kYXRhYmFzZV9uYW1lID09ICdtZXRlb3ItbW9uZ28nXG5cdFx0Xy5lYWNoIF9iYXNlT2JqZWN0LmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0XHRpZiAhc2VsZi5maWVsZHNbZmllbGRfbmFtZV1cblx0XHRcdFx0c2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSB7fVxuXHRcdFx0c2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKGZpZWxkKSwgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pXG5cblx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRpZiBmaWVsZC50eXBlID09ICdhdXRvbnVtYmVyJ1xuXHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdmb3JtdWxhJ1xuXHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdzdW1tYXJ5J1xuXHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXG5cblx0c2VsZi5saXN0X3ZpZXdzID0ge31cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KHNlbGYubmFtZSlcblx0Xy5lYWNoIG9wdGlvbnMubGlzdF92aWV3cywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdG9pdGVtID0gQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcoZGVmYXVsdFZpZXcsIGl0ZW0sIGl0ZW1fbmFtZSlcblx0XHRzZWxmLmxpc3Rfdmlld3NbaXRlbV9uYW1lXSA9IG9pdGVtXG5cblx0c2VsZi50cmlnZ2VycyA9IF8uY2xvbmUoX2Jhc2VPYmplY3QudHJpZ2dlcnMpXG5cdF8uZWFjaCBvcHRpb25zLnRyaWdnZXJzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXVxuXHRcdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0ge31cblx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0ubmFtZSA9IGl0ZW1fbmFtZVxuXHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSlcblxuXHRzZWxmLmFjdGlvbnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LmFjdGlvbnMpXG5cdF8uZWFjaCBvcHRpb25zLmFjdGlvbnMsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpZiAhc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV1cblx0XHRcdHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0ge31cblx0XHRjb3B5SXRlbSA9IF8uY2xvbmUoc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pXG5cdFx0ZGVsZXRlIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdICPlhYjliKDpmaTnm7jlhbPlsZ7mgKflho3ph43lu7rmiY3og73kv53or4HlkI7nu63ph43lpI3lrprkuYnnmoTlsZ7mgKfpobrluo/nlJ/mlYhcblx0XHRzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKGNvcHlJdGVtLCBpdGVtKVxuXG5cdF8uZWFjaCBzZWxmLmFjdGlvbnMsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpdGVtLm5hbWUgPSBpdGVtX25hbWVcblxuXHRzZWxmLnJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoc2VsZi5uYW1lKVxuXG5cdCMg6K6p5omA5pyJb2JqZWN06buY6K6k5pyJ5omA5pyJbGlzdF92aWV3cy9hY3Rpb25zL3JlbGF0ZWRfb2JqZWN0cy9yZWFkYWJsZV9maWVsZHMvZWRpdGFibGVfZmllbGRz5a6M5pW05p2D6ZmQ77yM6K+l5p2D6ZmQ5Y+v6IO96KKr5pWw5o2u5bqT5Lit6K6+572u55qEYWRtaW4vdXNlcuadg+mZkOimhuebllxuXHRzZWxmLnBlcm1pc3Npb25fc2V0ID0gXy5jbG9uZShfYmFzZU9iamVjdC5wZXJtaXNzaW9uX3NldClcblx0IyBkZWZhdWx0TGlzdFZpZXdzID0gXy5rZXlzKHNlbGYubGlzdF92aWV3cylcblx0IyBkZWZhdWx0QWN0aW9ucyA9IF8ua2V5cyhzZWxmLmFjdGlvbnMpXG5cdCMgZGVmYXVsdFJlbGF0ZWRPYmplY3RzID0gXy5wbHVjayhzZWxmLnJlbGF0ZWRfb2JqZWN0cyxcIm9iamVjdF9uYW1lXCIpXG5cdCMgZGVmYXVsdFJlYWRhYmxlRmllbGRzID0gW11cblx0IyBkZWZhdWx0RWRpdGFibGVGaWVsZHMgPSBbXVxuXHQjIF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdCMgXHRpZiAhKGZpZWxkLmhpZGRlbikgICAgIzIzMSBvbWl05a2X5q615pSv5oyB5Zyo6Z2e57yW6L6R6aG16Z2i5p+l55yLLCDlm6DmraTliKDpmaTkuobmraTlpITlr7lvbWl055qE5Yik5patXG5cdCMgXHRcdGRlZmF1bHRSZWFkYWJsZUZpZWxkcy5wdXNoIGZpZWxkX25hbWVcblx0IyBcdFx0aWYgIWZpZWxkLnJlYWRvbmx5XG5cdCMgXHRcdFx0ZGVmYXVsdEVkaXRhYmxlRmllbGRzLnB1c2ggZmllbGRfbmFtZVxuXG5cdCMgXy5lYWNoIHNlbGYucGVybWlzc2lvbl9zZXQsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0IyBcdGlmIGl0ZW1fbmFtZSA9PSBcIm5vbmVcIlxuXHQjIFx0XHRyZXR1cm5cblx0IyBcdGlmIHNlbGYubGlzdF92aWV3c1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ubGlzdF92aWV3cyA9IGRlZmF1bHRMaXN0Vmlld3Ncblx0IyBcdGlmIHNlbGYuYWN0aW9uc1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0uYWN0aW9ucyA9IGRlZmF1bHRBY3Rpb25zXG5cdCMgXHRpZiBzZWxmLnJlbGF0ZWRfb2JqZWN0c1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ucmVsYXRlZF9vYmplY3RzID0gZGVmYXVsdFJlbGF0ZWRPYmplY3RzXG5cdCMgXHRpZiBzZWxmLmZpZWxkc1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ucmVhZGFibGVfZmllbGRzID0gZGVmYXVsdFJlYWRhYmxlRmllbGRzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5lZGl0YWJsZV9maWVsZHMgPSBkZWZhdWx0RWRpdGFibGVGaWVsZHNcblx0dW5sZXNzIG9wdGlvbnMucGVybWlzc2lvbl9zZXRcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0ID0ge31cblx0aWYgIShvcHRpb25zLnBlcm1pc3Npb25fc2V0Py5hZG1pbilcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0LmFkbWluID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1wiYWRtaW5cIl0pXG5cdGlmICEob3B0aW9ucy5wZXJtaXNzaW9uX3NldD8udXNlcilcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0LnVzZXIgPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJ1c2VyXCJdKVxuXHRfLmVhY2ggb3B0aW9ucy5wZXJtaXNzaW9uX3NldCwgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGlmICFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV1cblx0XHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IHt9XG5cdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pLCBpdGVtKVxuXG5cdCMg5YmN56uv5qC55o2ucGVybWlzc2lvbnPmlLnlhplmaWVsZOebuOWFs+WxnuaAp++8jOWQjuerr+WPquimgei1sOm7mOiupOWxnuaAp+WwseihjO+8jOS4jemcgOimgeaUueWGmVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnNcblx0XHRkaXNhYmxlZF9saXN0X3ZpZXdzID0gcGVybWlzc2lvbnM/LmRpc2FibGVkX2xpc3Rfdmlld3Ncblx0XHRpZiBkaXNhYmxlZF9saXN0X3ZpZXdzPy5sZW5ndGhcblx0XHRcdGRlZmF1bHRMaXN0Vmlld0lkID0gb3B0aW9ucy5saXN0X3ZpZXdzPy5hbGw/Ll9pZFxuXHRcdFx0aWYgZGVmYXVsdExpc3RWaWV3SWRcblx0XHRcdFx0IyDmiorop4blm77mnYPpmZDphY3nva7kuK3pu5jorqTnmoRhbGzop4blm75pZOi9rOaNouaIkGFsbOWFs+mUruWtl1xuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAgZGlzYWJsZWRfbGlzdF92aWV3cywgKGxpc3Rfdmlld19pdGVtKSAtPlxuXHRcdFx0XHRcdHJldHVybiBpZiBkZWZhdWx0TGlzdFZpZXdJZCA9PSBsaXN0X3ZpZXdfaXRlbSB0aGVuIFwiYWxsXCIgZWxzZSBsaXN0X3ZpZXdfaXRlbVxuXHRcdHNlbGYucGVybWlzc2lvbnMgPSBuZXcgUmVhY3RpdmVWYXIocGVybWlzc2lvbnMpXG4jXHRcdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG4jXHRcdFx0aWYgZmllbGRcbiNcdFx0XHRcdGlmIF8uaW5kZXhPZihwZXJtaXNzaW9ucz8udW5yZWFkYWJsZV9maWVsZHMsIGZpZWxkX25hbWUpIDwgMFxuI1x0XHRcdFx0XHRpZiBmaWVsZC5oaWRkZW5cbiNcdFx0XHRcdFx0XHRyZXR1cm5cbiNcdFx0XHRcdFx0aWYgXy5pbmRleE9mKHBlcm1pc3Npb25zPy51bmVkaXRhYmxlX2ZpZWxkcywgZmllbGRfbmFtZSkgPiAtMVxuI1x0XHRcdFx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuI1x0XHRcdFx0XHRcdGZpZWxkLmRpc2FibGVkID0gdHJ1ZVxuI1x0XHRcdFx0XHRcdCMg5b2T5Y+q6K+75pe277yM5aaC5p6c5LiN5Y675o6J5b+F5aGr5a2X5q6177yMYXV0b2Zvcm3mmK/kvJrmiqXplJnnmoRcbiNcdFx0XHRcdFx0XHRmaWVsZC5yZXF1aXJlZCA9IGZhbHNlXG4jXHRcdFx0XHRlbHNlXG4jXHRcdFx0XHRcdGZpZWxkLmhpZGRlbiA9IHRydWVcblx0ZWxzZVxuXHRcdHNlbGYucGVybWlzc2lvbnMgPSBudWxsXG5cblx0X2RiID0gQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uKG9wdGlvbnMpXG5cblx0Q3JlYXRvci5Db2xsZWN0aW9uc1tfZGIuX25hbWVdID0gX2RiXG5cblx0c2VsZi5kYiA9IF9kYlxuXG5cdHNlbGYuX2NvbGxlY3Rpb25fbmFtZSA9IF9kYi5fbmFtZVxuXG5cdHNjaGVtYSA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHNlbGYpXG5cdHNlbGYuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYShzY2hlbWEpXG5cdGlmIHNlbGYubmFtZSAhPSBcInVzZXJzXCIgYW5kIHNlbGYubmFtZSAhPSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIgJiYgIXNlbGYuaXNfdmlldyAmJiAhXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiLCBcImFjdGlvbl9maWVsZF91cGRhdGVzXCJdLCBzZWxmLm5hbWUpXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXG5cdFx0ZWxzZVxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxuXHRpZiBzZWxmLm5hbWUgPT0gXCJ1c2Vyc1wiXG5cdFx0X2RiLl9zaW1wbGVTY2hlbWEgPSBzZWxmLnNjaGVtYVxuXG5cdGlmIF8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSlcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtyZXBsYWNlOiB0cnVlfSlcblxuXHRDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGZcblxuXHRyZXR1cm4gc2VsZlxuXG4jIENyZWF0b3IuT2JqZWN0LnByb3RvdHlwZS5pMThuID0gKCktPlxuIyBcdCMgc2V0IG9iamVjdCBsYWJlbFxuIyBcdHNlbGYgPSB0aGlzXG5cbiMgXHRrZXkgPSBzZWxmLm5hbWVcbiMgXHRpZiB0KGtleSkgPT0ga2V5XG4jIFx0XHRpZiAhc2VsZi5sYWJlbFxuIyBcdFx0XHRzZWxmLmxhYmVsID0gc2VsZi5uYW1lXG4jIFx0ZWxzZVxuIyBcdFx0c2VsZi5sYWJlbCA9IHQoa2V5KVxuXG4jIFx0IyBzZXQgZmllbGQgbGFiZWxzXG4jIFx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cbiMgXHRcdGZrZXkgPSBzZWxmLm5hbWUgKyBcIl9cIiArIGZpZWxkX25hbWVcbiMgXHRcdGlmIHQoZmtleSkgPT0gZmtleVxuIyBcdFx0XHRpZiAhZmllbGQubGFiZWxcbiMgXHRcdFx0XHRmaWVsZC5sYWJlbCA9IGZpZWxkX25hbWVcbiMgXHRcdGVsc2VcbiMgXHRcdFx0ZmllbGQubGFiZWwgPSB0KGZrZXkpXG4jIFx0XHRzZWxmLnNjaGVtYT8uX3NjaGVtYT9bZmllbGRfbmFtZV0/LmxhYmVsID0gZmllbGQubGFiZWxcblxuXG4jIFx0IyBzZXQgbGlzdHZpZXcgbGFiZWxzXG4jIFx0Xy5lYWNoIHNlbGYubGlzdF92aWV3cywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuIyBcdFx0aTE4bl9rZXkgPSBzZWxmLm5hbWUgKyBcIl9saXN0dmlld19cIiArIGl0ZW1fbmFtZVxuIyBcdFx0aWYgdChpMThuX2tleSkgPT0gaTE4bl9rZXlcbiMgXHRcdFx0aWYgIWl0ZW0ubGFiZWxcbiMgXHRcdFx0XHRpdGVtLmxhYmVsID0gaXRlbV9uYW1lXG4jIFx0XHRlbHNlXG4jIFx0XHRcdGl0ZW0ubGFiZWwgPSB0KGkxOG5fa2V5KVxuXG5cbkNyZWF0b3IuZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXggPSAob2JqZWN0KS0+XG5cdHJldHVybiBcIi9hcGkvb2RhdGEvdjRcIlxuXHQjIGlmIG9iamVjdFxuXHQjIFx0aWYgIW9iamVjdC5kYXRhYmFzZV9uYW1lIHx8IG9iamVjdC5kYXRhYmFzZV9uYW1lID09ICdtZXRlb3ItbW9uZ28nXG5cdCMgXHRcdHJldHVybiBcIi9hcGkvb2RhdGEvdjRcIlxuXHQjIFx0ZWxzZVxuXHQjIFx0XHRyZXR1cm4gXCIvYXBpL29kYXRhLyN7b2JqZWN0LmRhdGFiYXNlX25hbWV9XCJcblxuIyBpZiBNZXRlb3IuaXNDbGllbnRcblxuIyBcdE1ldGVvci5zdGFydHVwIC0+XG4jIFx0XHRUcmFja2VyLmF1dG9ydW4gLT5cbiMgXHRcdFx0aWYgU2Vzc2lvbi5nZXQoXCJzdGVlZG9zLWxvY2FsZVwiKSAmJiBDcmVhdG9yLmJvb3RzdHJhcExvYWRlZD8uZ2V0KClcbiMgXHRcdFx0XHRfLmVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAob2JqZWN0LCBvYmplY3RfbmFtZSktPlxuIyBcdFx0XHRcdFx0b2JqZWN0LmkxOG4oKVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRpZiAhQ3JlYXRvci5ib290c3RyYXBMb2FkZWQgJiYgQ3JlYXRvci5PYmplY3RzXG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKG9iamVjdCktPlxuXHRcdFx0bmV3IENyZWF0b3IuT2JqZWN0KG9iamVjdClcblxuIiwidmFyIGNsb25lO1xuXG5jbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJyk7XG5cbkNyZWF0b3Iub2JqZWN0c0J5TmFtZSA9IHt9O1xuXG5DcmVhdG9yLmZvcm1hdE9iamVjdE5hbWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICBpZiAob2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY2ZzLmZpbGVzLicpKSB7XG4gICAgb2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFwuJywgJ2cnKSwgJ18nKTtcbiAgfVxuICByZXR1cm4gb2JqZWN0X25hbWU7XG59O1xuXG5DcmVhdG9yLk9iamVjdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgdmFyIF9iYXNlT2JqZWN0LCBfZGIsIGRlZmF1bHRMaXN0Vmlld0lkLCBkZWZhdWx0VmlldywgZGlzYWJsZWRfbGlzdF92aWV3cywgcGVybWlzc2lvbnMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgc2NoZW1hLCBzZWxmO1xuICBfYmFzZU9iamVjdCA9IENyZWF0b3IuYmFzZU9iamVjdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF9iYXNlT2JqZWN0ID0ge1xuICAgICAgYWN0aW9uczogQ3JlYXRvci5iYXNlT2JqZWN0LmFjdGlvbnMsXG4gICAgICBmaWVsZHM6IHt9LFxuICAgICAgdHJpZ2dlcnM6IHt9LFxuICAgICAgcGVybWlzc2lvbl9zZXQ6IHt9XG4gICAgfTtcbiAgfVxuICBzZWxmID0gdGhpcztcbiAgaWYgKCFvcHRpb25zLm5hbWUpIHtcbiAgICBjb25zb2xlLmVycm9yKG9wdGlvbnMpO1xuICAgIHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xuICB9XG4gIHNlbGYuX2lkID0gb3B0aW9ucy5faWQgfHwgb3B0aW9ucy5uYW1lO1xuICBzZWxmLnNwYWNlID0gb3B0aW9ucy5zcGFjZTtcbiAgc2VsZi5uYW1lID0gb3B0aW9ucy5uYW1lO1xuICBzZWxmLmxhYmVsID0gb3B0aW9ucy5sYWJlbDtcbiAgc2VsZi5pY29uID0gb3B0aW9ucy5pY29uO1xuICBzZWxmLmRlc2NyaXB0aW9uID0gb3B0aW9ucy5kZXNjcmlwdGlvbjtcbiAgc2VsZi5pc192aWV3ID0gb3B0aW9ucy5pc192aWV3O1xuICBzZWxmLmZvcm0gPSBvcHRpb25zLmZvcm07XG4gIHNlbGYucmVsYXRlZExpc3QgPSBvcHRpb25zLnJlbGF0ZWRMaXN0O1xuICBpZiAoIV8uaXNCb29sZWFuKG9wdGlvbnMuaXNfZW5hYmxlKSB8fCBvcHRpb25zLmlzX2VuYWJsZSA9PT0gdHJ1ZSkge1xuICAgIHNlbGYuaXNfZW5hYmxlID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBzZWxmLmlzX2VuYWJsZSA9IGZhbHNlO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoXy5oYXMob3B0aW9ucywgJ2FsbG93X2N1c3RvbUFjdGlvbnMnKSkge1xuICAgICAgc2VsZi5hbGxvd19jdXN0b21BY3Rpb25zID0gb3B0aW9ucy5hbGxvd19jdXN0b21BY3Rpb25zO1xuICAgIH1cbiAgICBpZiAoXy5oYXMob3B0aW9ucywgJ2V4Y2x1ZGVfYWN0aW9ucycpKSB7XG4gICAgICBzZWxmLmV4Y2x1ZGVfYWN0aW9ucyA9IG9wdGlvbnMuZXhjbHVkZV9hY3Rpb25zO1xuICAgIH1cbiAgICBpZiAoXy5oYXMob3B0aW9ucywgJ2FsbG93X3JlbGF0ZWRMaXN0JykpIHtcbiAgICAgIHNlbGYuYWxsb3dfcmVsYXRlZExpc3QgPSBvcHRpb25zLmFsbG93X3JlbGF0ZWRMaXN0O1xuICAgIH1cbiAgfVxuICBzZWxmLmVuYWJsZV9zZWFyY2ggPSBvcHRpb25zLmVuYWJsZV9zZWFyY2g7XG4gIHNlbGYuZW5hYmxlX2ZpbGVzID0gb3B0aW9ucy5lbmFibGVfZmlsZXM7XG4gIHNlbGYuZW5hYmxlX3Rhc2tzID0gb3B0aW9ucy5lbmFibGVfdGFza3M7XG4gIHNlbGYuZW5hYmxlX25vdGVzID0gb3B0aW9ucy5lbmFibGVfbm90ZXM7XG4gIHNlbGYuZW5hYmxlX2F1ZGl0ID0gb3B0aW9ucy5lbmFibGVfYXVkaXQ7XG4gIGlmIChvcHRpb25zLnBhZ2luZykge1xuICAgIHNlbGYucGFnaW5nID0gb3B0aW9ucy5wYWdpbmc7XG4gIH1cbiAgc2VsZi5oaWRkZW4gPSBvcHRpb25zLmhpZGRlbjtcbiAgc2VsZi5lbmFibGVfYXBpID0gKG9wdGlvbnMuZW5hYmxlX2FwaSA9PT0gdm9pZCAwKSB8fCBvcHRpb25zLmVuYWJsZV9hcGk7XG4gIHNlbGYuY3VzdG9tID0gb3B0aW9ucy5jdXN0b207XG4gIHNlbGYuZW5hYmxlX3NoYXJlID0gb3B0aW9ucy5lbmFibGVfc2hhcmU7XG4gIHNlbGYuZW5hYmxlX2luc3RhbmNlcyA9IG9wdGlvbnMuZW5hYmxlX2luc3RhbmNlcztcbiAgc2VsZi5lbmFibGVfcHJvY2VzcyA9IG9wdGlvbnMuZW5hYmxlX3Byb2Nlc3M7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpKSB7XG4gICAgICBzZWxmLmVuYWJsZV90cmVlID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlO1xuICAgICAgc2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcik7XG4gICAgc2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWU7XG4gIH1cbiAgc2VsZi5vcGVuX3dpbmRvdyA9IG9wdGlvbnMub3Blbl93aW5kb3c7XG4gIHNlbGYuZmlsdGVyX2NvbXBhbnkgPSBvcHRpb25zLmZpbHRlcl9jb21wYW55O1xuICBzZWxmLmNhbGVuZGFyID0gXy5jbG9uZShvcHRpb25zLmNhbGVuZGFyKTtcbiAgc2VsZi5lbmFibGVfY2hhdHRlciA9IG9wdGlvbnMuZW5hYmxlX2NoYXR0ZXI7XG4gIHNlbGYuZW5hYmxlX3RyYXNoID0gb3B0aW9ucy5lbmFibGVfdHJhc2g7XG4gIHNlbGYuZW5hYmxlX3NwYWNlX2dsb2JhbCA9IG9wdGlvbnMuZW5hYmxlX3NwYWNlX2dsb2JhbDtcbiAgc2VsZi5lbmFibGVfYXBwcm92YWxzID0gb3B0aW9ucy5lbmFibGVfYXBwcm92YWxzO1xuICBzZWxmLmVuYWJsZV9mb2xsb3cgPSBvcHRpb25zLmVuYWJsZV9mb2xsb3c7XG4gIHNlbGYuZW5hYmxlX3dvcmtmbG93ID0gb3B0aW9ucy5lbmFibGVfd29ya2Zsb3c7XG4gIHNlbGYuZW5hYmxlX2lubGluZV9lZGl0ID0gb3B0aW9ucy5lbmFibGVfaW5saW5lX2VkaXQ7XG4gIHNlbGYuZGV0YWlscyA9IG9wdGlvbnMuZGV0YWlscztcbiAgc2VsZi5tYXN0ZXJzID0gb3B0aW9ucy5tYXN0ZXJzO1xuICBzZWxmLmxvb2t1cF9kZXRhaWxzID0gb3B0aW9ucy5sb29rdXBfZGV0YWlscztcbiAgaWYgKF8uaGFzKG9wdGlvbnMsICdpbl9kZXZlbG9wbWVudCcpKSB7XG4gICAgc2VsZi5pbl9kZXZlbG9wbWVudCA9IG9wdGlvbnMuaW5fZGV2ZWxvcG1lbnQ7XG4gIH1cbiAgc2VsZi5pZEZpZWxkTmFtZSA9ICdfaWQnO1xuICBpZiAob3B0aW9ucy5kYXRhYmFzZV9uYW1lKSB7XG4gICAgc2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lO1xuICB9XG4gIGlmICghb3B0aW9ucy5maWVsZHMpIHtcbiAgICBjb25zb2xlLmVycm9yKG9wdGlvbnMpO1xuICAgIHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgZmllbGRzJyk7XG4gIH1cbiAgc2VsZi5maWVsZHMgPSBjbG9uZShvcHRpb25zLmZpZWxkcyk7XG4gIF8uZWFjaChzZWxmLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoZmllbGQuaXNfbmFtZSkge1xuICAgICAgc2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZF9uYW1lID09PSAnbmFtZScgJiYgIXNlbGYuTkFNRV9GSUVMRF9LRVkpIHtcbiAgICAgIHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICBpZiAoZmllbGQucHJpbWFyeSkge1xuICAgICAgc2VsZi5pZEZpZWxkTmFtZSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkpIHtcbiAgICAgICAgaWYgKGZpZWxkX25hbWUgPT09ICdzcGFjZScpIHtcbiAgICAgICAgICBmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gZmllbGQuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoIW9wdGlvbnMuZGF0YWJhc2VfbmFtZSB8fCBvcHRpb25zLmRhdGFiYXNlX25hbWUgPT09ICdtZXRlb3ItbW9uZ28nKSB7XG4gICAgXy5lYWNoKF9iYXNlT2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgIGlmICghc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pIHtcbiAgICAgICAgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoZmllbGQpLCBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSk7XG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmIChmaWVsZC50eXBlID09PSAnYXV0b251bWJlcicpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZm9ybXVsYScpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnc3VtbWFyeScpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfVxuICB9KTtcbiAgc2VsZi5saXN0X3ZpZXdzID0ge307XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhzZWxmLm5hbWUpO1xuICBfLmVhY2gob3B0aW9ucy5saXN0X3ZpZXdzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgb2l0ZW07XG4gICAgb2l0ZW0gPSBDcmVhdG9yLmNvbnZlcnRMaXN0VmlldyhkZWZhdWx0VmlldywgaXRlbSwgaXRlbV9uYW1lKTtcbiAgICByZXR1cm4gc2VsZi5saXN0X3ZpZXdzW2l0ZW1fbmFtZV0gPSBvaXRlbTtcbiAgfSk7XG4gIHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnRyaWdnZXJzKTtcbiAgXy5lYWNoKG9wdGlvbnMudHJpZ2dlcnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIGlmICghc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdLm5hbWUgPSBpdGVtX25hbWU7XG4gICAgcmV0dXJuIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSk7XG4gIH0pO1xuICBzZWxmLmFjdGlvbnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LmFjdGlvbnMpO1xuICBfLmVhY2gob3B0aW9ucy5hY3Rpb25zLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgY29weUl0ZW07XG4gICAgaWYgKCFzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgY29weUl0ZW0gPSBfLmNsb25lKHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKTtcbiAgICBkZWxldGUgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV07XG4gICAgcmV0dXJuIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0gXy5leHRlbmQoY29weUl0ZW0sIGl0ZW0pO1xuICB9KTtcbiAgXy5lYWNoKHNlbGYuYWN0aW9ucywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgcmV0dXJuIGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZTtcbiAgfSk7XG4gIHNlbGYucmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhzZWxmLm5hbWUpO1xuICBzZWxmLnBlcm1pc3Npb25fc2V0ID0gXy5jbG9uZShfYmFzZU9iamVjdC5wZXJtaXNzaW9uX3NldCk7XG4gIGlmICghb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fTtcbiAgfVxuICBpZiAoISgocmVmID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZi5hZG1pbiA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LmFkbWluID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1wiYWRtaW5cIl0pO1xuICB9XG4gIGlmICghKChyZWYxID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZjEudXNlciA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LnVzZXIgPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJ1c2VyXCJdKTtcbiAgfVxuICBfLmVhY2gob3B0aW9ucy5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgaWYgKCFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pLCBpdGVtKTtcbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnM7XG4gICAgZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzIDogdm9pZCAwO1xuICAgIGlmIChkaXNhYmxlZF9saXN0X3ZpZXdzICE9IG51bGwgPyBkaXNhYmxlZF9saXN0X3ZpZXdzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgZGVmYXVsdExpc3RWaWV3SWQgPSAocmVmMiA9IG9wdGlvbnMubGlzdF92aWV3cykgIT0gbnVsbCA/IChyZWYzID0gcmVmMi5hbGwpICE9IG51bGwgPyByZWYzLl9pZCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChkZWZhdWx0TGlzdFZpZXdJZCkge1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAoZGlzYWJsZWRfbGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3X2l0ZW0pIHtcbiAgICAgICAgICBpZiAoZGVmYXVsdExpc3RWaWV3SWQgPT09IGxpc3Rfdmlld19pdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJhbGxcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3Rfdmlld19pdGVtO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYucGVybWlzc2lvbnMgPSBuZXcgUmVhY3RpdmVWYXIocGVybWlzc2lvbnMpO1xuICB9IGVsc2Uge1xuICAgIHNlbGYucGVybWlzc2lvbnMgPSBudWxsO1xuICB9XG4gIF9kYiA9IENyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbihvcHRpb25zKTtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1tfZGIuX25hbWVdID0gX2RiO1xuICBzZWxmLmRiID0gX2RiO1xuICBzZWxmLl9jb2xsZWN0aW9uX25hbWUgPSBfZGIuX25hbWU7XG4gIHNjaGVtYSA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHNlbGYpO1xuICBzZWxmLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoc2NoZW1hKTtcbiAgaWYgKHNlbGYubmFtZSAhPT0gXCJ1c2Vyc1wiICYmIHNlbGYubmFtZSAhPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiICYmICFzZWxmLmlzX3ZpZXcgJiYgIV8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIiwgXCJhY3Rpb25fZmllbGRfdXBkYXRlc1wiXSwgc2VsZi5uYW1lKSkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChzZWxmLm5hbWUgPT09IFwidXNlcnNcIikge1xuICAgIF9kYi5fc2ltcGxlU2NoZW1hID0gc2VsZi5zY2hlbWE7XG4gIH1cbiAgaWYgKF8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSkpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGY7XG4gIHJldHVybiBzZWxmO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCI7XG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgaWYgKCFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZCAmJiBDcmVhdG9yLk9iamVjdHMpIHtcbiAgICByZXR1cm4gXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICByZXR1cm4gbmV3IENyZWF0b3IuT2JqZWN0KG9iamVjdCk7XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEgPSAob2JqKSAtPlxuXHR1bmxlc3Mgb2JqXG5cdFx0cmV0dXJuXG5cdHNjaGVtYSA9IHt9XG5cblx0ZmllbGRzQXJyID0gW11cblxuXHRfLmVhY2ggb2JqLmZpZWxkcyAsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdGlmICFfLmhhcyhmaWVsZCwgXCJuYW1lXCIpXG5cdFx0XHRmaWVsZC5uYW1lID0gZmllbGRfbmFtZVxuXHRcdGZpZWxkc0Fyci5wdXNoIGZpZWxkXG5cblx0Xy5lYWNoIF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCAoZmllbGQpLT5cblxuXHRcdGZpZWxkX25hbWUgPSBmaWVsZC5uYW1lXG5cblx0XHRmcyA9IHt9XG5cdFx0aWYgZmllbGQucmVnRXhcblx0XHRcdGZzLnJlZ0V4ID0gZmllbGQucmVnRXhcblx0XHRmcy5hdXRvZm9ybSA9IHt9XG5cdFx0ZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZVxuXHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0YXV0b2Zvcm1fdHlwZSA9IGZpZWxkLmF1dG9mb3JtPy50eXBlXG5cblx0XHRpZiBmaWVsZC50eXBlID09IFwidGV4dFwiIG9yIGZpZWxkLnR5cGUgPT0gXCJwaG9uZVwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiW3RleHRdXCIgb3IgZmllbGQudHlwZSA9PSBcIltwaG9uZV1cIlxuXHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2NvZGUnXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiXG5cdFx0XHRmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAxMlxuXHRcdFx0aWYgZmllbGQubGFuZ3VhZ2Vcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInRleHRhcmVhXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCJcblx0XHRcdGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJwYXNzd29yZFwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJwYXNzd29yZFwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZVwiXG5cdFx0XHRmcy50eXBlID0gRGF0ZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKClcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmlzaU9TKClcblx0XHRcdFx0XHRcdCMgRml4IGlvcyAxNCwg5omL5py65a6i5oi356uv5b6F5a6h5qC45paH5Lu25pel5pyf5o6n5Lu25pi+56S65pWF6ZqcICM5OTHvvIxpb3Pnu5/kuIDnlKhQQ+err+S4gOagt+eahGpz5o6n5Lu2XG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHRcdFx0dGltZXpvbmVJZDogXCJ1dGNcIlxuXHRcdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcblx0XHRcdFx0XHRcdFx0XHRwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIlxuXHRcdFx0XHRcdFx0XHRkYXRlTW9iaWxlT3B0aW9uczpcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGVcIlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3V0Rm9ybWF0ID0gJ3l5eXktTU0tZGQnO1xuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0dGltZXpvbmVJZDogXCJ1dGNcIlxuXHRcdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcblxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGV0aW1lXCJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKVxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuaXNpT1MoKVxuXHRcdFx0XHRcdFx0IyBGaXggaW9zIDE0LCDmiYvmnLrlrqLmiLfnq6/lvoXlrqHmoLjmlofku7bml6XmnJ/mjqfku7bmmL7npLrmlYXpmpwgIzk5Me+8jGlvc+e7n+S4gOeUqFBD56uv5LiA5qC355qEanPmjqfku7Zcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG5cdFx0XHRcdFx0XHRcdFx0cGlja2VyVHlwZTogXCJyb2xsZXJzXCJcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdFx0dHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCJcblx0XHRcdFx0XHRcdFx0ZGF0ZU1vYmlsZU9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxuXHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGQgSEg6bW1cIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIltPYmplY3RdXCJcblx0XHRcdGZzLnR5cGUgPSBbT2JqZWN0XVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImh0bWxcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcblx0XHRcdFx0aWYgbG9jYWxlID09IFwiemgtY25cIiB8fCBsb2NhbGUgPT0gXCJ6aC1DTlwiXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRsb2NhbGUgPSBcImVuLVVTXCJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHR0eXBlOiBcInN1bW1lcm5vdGVcIlxuXHRcdFx0XHRcdGNsYXNzOiAnc3VtbWVybm90ZS1lZGl0b3InXG5cdFx0XHRcdFx0c2V0dGluZ3M6XG5cdFx0XHRcdFx0XHRoZWlnaHQ6IDIwMFxuXHRcdFx0XHRcdFx0ZGlhbG9nc0luQm9keTogdHJ1ZVxuXHRcdFx0XHRcdFx0dG9vbGJhcjogIFtcblx0XHRcdFx0XHRcdFx0Wydmb250MScsIFsnc3R5bGUnXV0sXG5cdFx0XHRcdFx0XHRcdFsnZm9udDInLCBbJ2JvbGQnLCAndW5kZXJsaW5lJywgJ2l0YWxpYycsICdjbGVhciddXSxcblx0XHRcdFx0XHRcdFx0Wydmb250MycsIFsnZm9udG5hbWUnXV0sXG5cdFx0XHRcdFx0XHRcdFsnY29sb3InLCBbJ2NvbG9yJ11dLFxuXHRcdFx0XHRcdFx0XHRbJ3BhcmEnLCBbJ3VsJywgJ29sJywgJ3BhcmFncmFwaCddXSxcblx0XHRcdFx0XHRcdFx0Wyd0YWJsZScsIFsndGFibGUnXV0sXG5cdFx0XHRcdFx0XHRcdFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sXG5cdFx0XHRcdFx0XHRcdFsndmlldycsIFsnY29kZXZpZXcnXV1cblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdGZvbnROYW1lczogWydBcmlhbCcsICdDb21pYyBTYW5zIE1TJywgJ0NvdXJpZXIgTmV3JywgJ0hlbHZldGljYScsICdJbXBhY3QnLCAn5a6L5L2TJywn6buR5L2TJywn5b6u6L2v6ZuF6buRJywn5Lu/5a6LJywn5qW35L2TJywn6Zq25LmmJywn5bm85ZyGJ11cblx0XHRcdFx0XHRcdGxhbmc6IGxvY2FsZVxuXG5cdFx0ZWxzZSBpZiAoZmllbGQudHlwZSA9PSBcImxvb2t1cFwiIG9yIGZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZpZWxkLnNob3dJY29uXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblxuXHRcdFx0aWYgIWZpZWxkLmhpZGRlblxuXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmZpbHRlcnMgPSBmaWVsZC5maWx0ZXJzXG5cblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVwZW5kT24gPSBmaWVsZC5kZXBlbmRfb25cblxuXHRcdFx0XHRpZiBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblx0XHRcdFx0XHRmcy5iZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblxuXHRcdFx0XHRmcy5maWx0ZXJzRnVuY3Rpb24gPSBpZiBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gdGhlbiBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gZWxzZSBDcmVhdG9yLmV2YWx1YXRlRmlsdGVyc1xuXG5cdFx0XHRcdGlmIGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXHRcdFx0XHRcdGZzLm9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXG5cdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRpZiBmaWVsZC5jcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmllbGQuY3JlYXRlRnVuY3Rpb24pXG5cdFx0XHRcdFx0XHRcdGZzLmNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb25cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdFx0X3JlZl9vYmogPSBDcmVhdG9yLk9iamVjdHNbZmllbGQucmVmZXJlbmNlX3RvXVxuXHRcdFx0XHRcdFx0XHRcdGlmIF9yZWZfb2JqPy5wZXJtaXNzaW9ucz8uYWxsb3dDcmVhdGVcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IHRydWVcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmNyZWF0ZUZ1bmN0aW9uID0gKGxvb2t1cF9maWVsZCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRNb2RhbC5zaG93KFwiQ3JlYXRvck9iamVjdE1vZGFsXCIsIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuI3tDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvKS5fbmFtZX1cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3JtSWQ6IFwibmV3I3tmaWVsZC5yZWZlcmVuY2VfdG8ucmVwbGFjZSgnLicsJ18nKX1cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogXCIje2ZpZWxkLnJlZmVyZW5jZV90b31cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvcGVyYXRpb246IFwiaW5zZXJ0XCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b25TdWNjZXNzOiAob3BlcmF0aW9uLCByZXN1bHQpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIHJlc3VsdC5vYmplY3RfbmFtZSA9PSBcIm9iamVjdHNcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBfZmllbGQuYWRkSXRlbXMoW3tsYWJlbDogcmVzdWx0LnZhbHVlLmxhYmVsLCB2YWx1ZTogcmVzdWx0LnZhbHVlLm5hbWUsIGljb246IHJlc3VsdC52YWx1ZS5pY29ufV0sIHJlc3VsdC52YWx1ZS5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBfZmllbGQuYWRkSXRlbXMoW3tsYWJlbDogcmVzdWx0LnZhbHVlW29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gfHwgcmVzdWx0LnZhbHVlLmxhYmVsIHx8IHJlc3VsdC52YWx1ZS5uYW1lLCB2YWx1ZTogcmVzdWx0Ll9pZH1dLCByZXN1bHQuX2lkKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZhbHNlXG5cblx0XHRcdFx0XHRpZiBfLmlzQm9vbGVhbihmaWVsZC5jcmVhdGUpXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5jcmVhdGUgPSBmaWVsZC5jcmVhdGVcblxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV9zb3J0XG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zU29ydCA9IGZpZWxkLnJlZmVyZW5jZV9zb3J0XG5cblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfbGltaXRcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNMaW1pdCA9IGZpZWxkLnJlZmVyZW5jZV9saW1pdFxuXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvID09IFwidXNlcnNcIlxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0dXNlclwiXG5cdFx0XHRcdFx0XHRpZiAhZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0XG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5YiG6YOo5LiL55qE5pWw5o2uXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk5Y+v5Lul6KKr5pS55YaZ6KaG55uW5oiQdHJ1ZS9mYWxzZeaIluWFtuS7lmZ1bmN0aW9uXG5cdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxuXHRcdFx0XHRcdFx0XHRcdCMg5a+55b2T5YmN5a+56LGh5pyJdmlld0FsbFJlY29yZHPmnYPpmZDliJnkuI3pmZDliLbmiYDlsZ7liIbpg6jliJfooajmn6XnnIvmnYPpmZDvvIzlkKbliJnlj6rmmL7npLrlvZPliY3miYDlsZ7liIbpg6hcblx0XHRcdFx0XHRcdFx0XHQjIOazqOaEj+S4jeaYr3JlZmVyZW5jZV90b+WvueixoeeahHZpZXdBbGxSZWNvcmRz5p2D6ZmQ77yM6ICM5piv5b2T5YmN5a+56LGh55qEXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9ucz8uZ2V0KClcblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/LnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOWtl+auteaJgOWxnuWvueixoeaYr+eUqOaIt+aIlue7hOe7h++8jOWImeaYr+WQpumZkOWItuaYvuekuuaJgOWxnuWIhumDqOmDqOmXqOS4jm1vZGlmeUFsbFJlY29yZHPmnYPpmZDlhbPogZRcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNGdW5jdGlvbiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5YiG6YOoXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0ZWxzZSBpZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT0gXCJvcmdhbml6YXRpb25zXCJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdG9yZ1wiXG5cdFx0XHRcdFx0XHRpZiAhZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0XG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5YiG6YOo5LiL55qE5pWw5o2uXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk5Y+v5Lul6KKr5pS55YaZ6KaG55uW5oiQdHJ1ZS9mYWxzZeaIluWFtuS7lmZ1bmN0aW9uXG5cdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxuXHRcdFx0XHRcdFx0XHRcdCMg5a+55b2T5YmN5a+56LGh5pyJdmlld0FsbFJlY29yZHPmnYPpmZDliJnkuI3pmZDliLbmiYDlsZ7liIbpg6jliJfooajmn6XnnIvmnYPpmZDvvIzlkKbliJnlj6rmmL7npLrlvZPliY3miYDlsZ7liIbpg6hcblx0XHRcdFx0XHRcdFx0XHQjIOazqOaEj+S4jeaYr3JlZmVyZW5jZV90b+WvueixoeeahHZpZXdBbGxSZWNvcmRz5p2D6ZmQ77yM6ICM5piv5b2T5YmN5a+56LGh55qEXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9ucz8uZ2V0KClcblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/LnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOWtl+auteaJgOWxnuWvueixoeaYr+eUqOaIt+aIlue7hOe7h++8jOWImeaYr+WQpumZkOWItuaYvuekuuaJgOWxnuWIhumDqOmDqOmXqOS4jm1vZGlmeUFsbFJlY29yZHPmnYPpmZDlhbPogZRcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNGdW5jdGlvbiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5YiG6YOoXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aWYgdHlwZW9mKGZpZWxkLnJlZmVyZW5jZV90bykgPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG8oKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShfcmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRmcy50eXBlID0gT2JqZWN0XG5cdFx0XHRcdFx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZVxuXG5cdFx0XHRcdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIub1wiXSA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBTdHJpbmdcblx0XHRcdFx0XHRcdFx0XHRhdXRvZm9ybToge29taXQ6IHRydWV9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLmlkc1wiXSA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBbU3RyaW5nXVxuXHRcdFx0XHRcdFx0XHRcdGF1dG9mb3JtOiB7b21pdDogdHJ1ZX1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBbX3JlZmVyZW5jZV90b11cblxuXHRcdFx0XHRcdFx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXVxuXHRcdFx0XHRcdFx0aWYgX29iamVjdCBhbmQgX29iamVjdC5lbmFibGVfdHJlZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RUcmVlXCJcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kID0gZmllbGQub3B0aW9uc01ldGhvZCB8fCBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIlxuXG5cdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2RQYXJhbXMgPSAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcyA9IFtdXG5cdFx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90by5mb3JFYWNoIChfcmVmZXJlbmNlKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfb2JqZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6IF9vYmplY3Q/LmxhYmVsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogX29iamVjdD8uaWNvblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpbms6ICgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIi9hcHAvI3tTZXNzaW9uLmdldCgnYXBwX2lkJyl9LyN7X3JlZmVyZW5jZX0vdmlldy9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGluazogKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiL2FwcC8je1Nlc3Npb24uZ2V0KCdhcHBfaWQnKX0vI3tfcmVmZXJlbmNlfS92aWV3L1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb25cblxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInNlbGVjdFwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZhbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFwiXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRcdGlmIF8uaGFzKGZpZWxkLCAnZmlyc3RPcHRpb24nKVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gZmllbGQuZmlyc3RPcHRpb25cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gXCJcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImN1cnJlbmN5XCJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XG5cdFx0XHRpZiBmaWVsZD8uc2NhbGVcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZVxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdFx0ZWxzZSBpZiBmaWVsZD8uc2NhbGUgIT0gMFxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IDJcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJudW1iZXJcIlxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcblx0XHRcdGlmIGZpZWxkPy5zY2FsZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYm9vbGVhblwiXG5cdFx0XHRmcy50eXBlID0gQm9vbGVhblxuXHRcdFx0aWYgZmllbGQucmVhZG9ubHlcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tY2hlY2tib3hcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInRvZ2dsZVwiXG5cdFx0XHRmcy50eXBlID0gQm9vbGVhblxuXHRcdFx0aWYgZmllbGQucmVhZG9ubHlcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tdG9nZ2xlXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJyZWZlcmVuY2VcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImNoZWNrYm94XCJcblx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0LWNoZWNrYm94XCJcblx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZmlsZVwiIGFuZCBmaWVsZC5jb2xsZWN0aW9uXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogZmllbGQuY29sbGVjdGlvblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9IGZpZWxkLmNvbGxlY3Rpb25cblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJmaWxlc2l6ZVwiXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVzaXplJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIk9iamVjdFwiIHx8IGZpZWxkLnR5cGUgPT0gXCJvYmplY3RcIlxuXHRcdFx0ZnMudHlwZSA9IE9iamVjdFxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImdyaWRcIlxuXHRcdFx0ZnMudHlwZSA9IEFycmF5XG5cdFx0XHRmcy5hdXRvZm9ybS5lZGl0YWJsZSA9IHRydWVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NHcmlkXCJcblxuXHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0dHlwZTogT2JqZWN0XG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiaW1hZ2VcIlxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdpbWFnZXMnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdpbWFnZS8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdpbWFnZXMnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImF2YXRhclwiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2F2YXRhcnMnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdpbWFnZS8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdmF0YXJzJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKidcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJhdWRpb1wiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2F1ZGlvcydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2F1ZGlvLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F1ZGlvcydcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2F1ZGlvLyonXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidmlkZW9cIlxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICd2aWRlb3MnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICd2aWRlby8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICd2aWRlb3MnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICd2aWRlby8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImxvY2F0aW9uXCJcblx0XHRcdGZzLnR5cGUgPSBPYmplY3Rcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcImxvY2F0aW9uXCJcblx0XHRcdGZzLmF1dG9mb3JtLnN5c3RlbSA9IGZpZWxkLnN5c3RlbSB8fCBcIndnczg0XCJcblx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIm1hcmtkb3duXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtbWFya2Rvd25cIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAndXJsJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0IyBmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5Vcmxcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc1VybCdcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2VtYWlsJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc0VtYWlsJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnYXV0b251bWJlcidcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2Zvcm11bGEnXG5cdFx0XHRmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtmaWVsZHM6IHtmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHt0eXBlOiBmaWVsZC5kYXRhX3R5cGV9KX19KVtmaWVsZC5uYW1lXVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnc3VtbWFyeSdcblx0XHRcdGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe2ZpZWxkczoge2ZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge3R5cGU6IGZpZWxkLmRhdGFfdHlwZX0pfX0pW2ZpZWxkLm5hbWVdXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdwZXJjZW50J1xuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcblx0XHRcdHVubGVzcyBfLmlzTnVtYmVyKGZpZWxkLnNjYWxlKVxuXHRcdFx0XHQjIOayoemFjee9ruWwj+aVsOS9jeaVsOWImeaMieWwj+aVsOS9jeaVsDDmnaXlpITnkIbvvIzljbPpu5jorqTmmL7npLrkuLrmlbTmlbDnmoTnmb7liIbmr5TvvIzmr5TlpoIyMCXvvIzmraTml7bmjqfku7blj6/ku6XovpPlhaUy5L2N5bCP5pWw77yM6L2s5oiQ55m+5YiG5q+U5bCx5piv5pW05pWwXG5cdFx0XHRcdGZpZWxkLnNjYWxlID0gMFxuXHRcdFx0IyBhdXRvZm9ybeaOp+S7tuS4reWwj+aVsOS9jeaVsOWni+e7iOavlOmFjee9rueahOS9jeaVsOWkmjLkvY1cblx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGUgKyAyXG5cdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdGZzLnR5cGUgPSBmaWVsZC50eXBlXG5cblx0XHRpZiBmaWVsZC5sYWJlbFxuXHRcdFx0ZnMubGFiZWwgPSBmaWVsZC5sYWJlbFxuXG4jXHRcdGlmIGZpZWxkLmFsbG93ZWRWYWx1ZXNcbiNcdFx0XHRmcy5hbGxvd2VkVmFsdWVzID0gZmllbGQuYWxsb3dlZFZhbHVlc1xuXG5cdFx0aWYgIWZpZWxkLnJlcXVpcmVkXG5cdFx0XHRmcy5vcHRpb25hbCA9IHRydWVcblxuXHRcdCMgW+etvue6puWvueixoeWQjOaXtumFjee9ruS6hmNvbXBhbnlfaWRz5b+F5aGr5Y+KdW5lZGl0YWJsZV9maWVsZHPpgKDmiJDpg6jliIbnlKjmiLfmlrDlu7rnrb7nuqblr7nosaHml7bmiqXplJkgIzE5Ml0oaHR0cHM6Ly9naXRodWIuY29tL3N0ZWVkb3Mvc3RlZWRvcy1wcm9qZWN0LWR6dWcvaXNzdWVzLzE5Milcblx0XHQjIOWQjuWPsOWni+e7iOiuvue9rnJlcXVpcmVk5Li6ZmFsc2Vcblx0XHRpZiAhTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRmcy5vcHRpb25hbCA9IHRydWVcblxuXHRcdGlmIGZpZWxkLnVuaXF1ZVxuXHRcdFx0ZnMudW5pcXVlID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQub21pdFxuXHRcdFx0ZnMuYXV0b2Zvcm0ub21pdCA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmdyb3VwXG5cdFx0XHRmcy5hdXRvZm9ybS5ncm91cCA9IGZpZWxkLmdyb3VwXG5cblx0XHRpZiBmaWVsZC5pc193aWRlXG5cdFx0XHRmcy5hdXRvZm9ybS5pc193aWRlID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQuaGlkZGVuXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJoaWRkZW5cIlxuXG5cdFx0aWYgKGZpZWxkLnR5cGUgPT0gXCJzZWxlY3RcIikgb3IgKGZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIikgb3IgKGZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpXG5cdFx0XHRpZiB0eXBlb2YoZmllbGQuZmlsdGVyYWJsZSkgPT0gJ3VuZGVmaW5lZCdcblx0XHRcdFx0ZmllbGQuZmlsdGVyYWJsZSA9IHRydWVcblx0XHRpZiBmaWVsZC5uYW1lID09ICduYW1lJyB8fCBmaWVsZC5pc19uYW1lXG5cdFx0XHRpZiB0eXBlb2YoZmllbGQuc2VhcmNoYWJsZSkgPT0gJ3VuZGVmaW5lZCdcblx0XHRcdFx0ZmllbGQuc2VhcmNoYWJsZSA9IHRydWVcblxuXHRcdGlmIGF1dG9mb3JtX3R5cGVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBhdXRvZm9ybV90eXBlXG5cblx0XHRpZiBmaWVsZC5kZWZhdWx0VmFsdWVcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudCBhbmQgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZmllbGQuZGVmYXVsdFZhbHVlKVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSAoKS0+XG5cdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZpZWxkLmRlZmF1bHRWYWx1ZSwge3VzZXJJZDogTWV0ZW9yLnVzZXJJZCgpLCBzcGFjZUlkOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksIG5vdzogbmV3IERhdGUoKX0pXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXHRcdFx0XHRpZiAhXy5pc0Z1bmN0aW9uKGZpZWxkLmRlZmF1bHRWYWx1ZSlcblx0XHRcdFx0XHRmcy5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblxuXHRcdGlmIGZpZWxkLnJlYWRvbmx5XG5cdFx0XHRmcy5hdXRvZm9ybS5yZWFkb25seSA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmRpc2FibGVkXG5cdFx0XHRmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmlubGluZUhlbHBUZXh0XG5cdFx0XHRmcy5hdXRvZm9ybS5pbmxpbmVIZWxwVGV4dCA9IGZpZWxkLmlubGluZUhlbHBUZXh0XG5cblx0XHRpZiBmaWVsZC5ibGFja2JveFxuXHRcdFx0ZnMuYmxhY2tib3ggPSB0cnVlXG5cblx0XHRpZiBfLmhhcyhmaWVsZCwgJ21pbicpXG5cdFx0XHRmcy5taW4gPSBmaWVsZC5taW5cblx0XHRpZiBfLmhhcyhmaWVsZCwgJ21heCcpXG5cdFx0XHRmcy5tYXggPSBmaWVsZC5tYXhcblxuXHRcdCMg5Y+q5pyJ55Sf5Lqn546v5aKD5omN6YeN5bu657Si5byVXG5cdFx0aWYgTWV0ZW9yLmlzUHJvZHVjdGlvblxuXHRcdFx0aWYgZmllbGQuaW5kZXhcblx0XHRcdFx0ZnMuaW5kZXggPSBmaWVsZC5pbmRleFxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5zb3J0YWJsZVxuXHRcdFx0XHRmcy5pbmRleCA9IHRydWVcblxuXHRcdHNjaGVtYVtmaWVsZF9uYW1lXSA9IGZzXG5cblx0cmV0dXJuIHNjaGVtYVxuXG5cbkNyZWF0b3IuZ2V0RmllbGREaXNwbGF5VmFsdWUgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlKS0+XG5cdGh0bWwgPSBmaWVsZF92YWx1ZVxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0aWYgIW9iamVjdFxuXHRcdHJldHVybiBcIlwiXG5cdGZpZWxkID0gb2JqZWN0LmZpZWxkcyhmaWVsZF9uYW1lKVxuXHRpZiAhZmllbGRcblx0XHRyZXR1cm4gXCJcIlxuXG5cdGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRldGltZVwiXG5cdFx0aHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREIEg6bW0nKVxuXHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRlXCJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQnKVxuXG5cdHJldHVybiBodG1sXG5cbkNyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5ID0gKGZpZWxkX3R5cGUpLT5cblx0cmV0dXJuIFtcImRhdGVcIiwgXCJkYXRldGltZVwiLCBcImN1cnJlbmN5XCIsIFwibnVtYmVyXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXG5cbkNyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzID0gKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpLT5cblx0YnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSlcblx0aWYgYnVpbHRpblZhbHVlc1xuXHRcdF8uZm9yRWFjaCBidWlsdGluVmFsdWVzLCAoYnVpbHRpbkl0ZW0sIGtleSktPlxuXHRcdFx0b3BlcmF0aW9ucy5wdXNoKHtsYWJlbDogYnVpbHRpbkl0ZW0ubGFiZWwsIHZhbHVlOiBrZXl9KVxuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzID0gKGZpZWxkX3R5cGUsIGlzX2NoZWNrX29ubHkpLT5cblx0IyDov4fmu6TlmajlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcblx0aWYgW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpXG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0gPSAoZmllbGRfdHlwZSwga2V5KS0+XG5cdCMg6L+H5ruk5Zmo5a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XG5cdGlmIFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXHRcdHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBrZXkpXG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24gPSAoZmllbGRfdHlwZSwgdmFsdWUpLT5cblx0IyDmoLnmja7ov4fmu6TlmajnmoTov4fmu6TlgLzvvIzojrflj5blr7nlupTnmoTlhoXnva7ov5DnrpfnrKZcblx0IyDmr5TlpoJ2YWx1ZeS4umxhc3RfeWVhcu+8jOi/lOWbnmJldHdlZW5fdGltZV9sYXN0X3llYXJcblx0dW5sZXNzIF8uaXNTdHJpbmcodmFsdWUpXG5cdFx0cmV0dXJuXG5cdGJldHdlZW5CdWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKVxuXHR1bmxlc3MgYmV0d2VlbkJ1aWx0aW5WYWx1ZXNcblx0XHRyZXR1cm5cblx0cmVzdWx0ID0gbnVsbFxuXHRfLmVhY2ggYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIChpdGVtLCBvcGVyYXRpb24pLT5cblx0XHRpZiBpdGVtLmtleSA9PSB2YWx1ZVxuXHRcdFx0cmVzdWx0ID0gb3BlcmF0aW9uXG5cdHJldHVybiByZXN1bHRcblxuIyDlpoLmnpzlj6rmmK/kuLrliKTmlq1vcGVyYXRpb27mmK/lkKblrZjlnKjvvIzliJnmsqHlv4XopoHorqHnrpd2YWx1ZXPvvIzkvKDlhaVpc19jaGVja19vbmx55Li6dHJ1ZeWNs+WPr1xuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMgPSAoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSktPlxuXHQjIOi/h+a7pOWZqOaXtumXtOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxuXHRyZXR1cm4ge1xuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF95ZWFyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc195ZWFyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF95ZWFyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9xdWFydGVyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19xdWFydGVyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9xdWFydGVyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfbW9udGhcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc19tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19tb250aFwiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X21vbnRoXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3Rfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF93ZWVrXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc193ZWVrXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF93ZWVrXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3llc3RkYXlcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInllc3RkYXlcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9kYXlcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvZGF5XCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RvbW9ycm93XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b21vcnJvd1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzdfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF83X2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8zMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzMwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzYwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF85MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzkwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8xMjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8xMjBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzdfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF83X2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF8zMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzMwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzYwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF85MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzkwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF8xMjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8xMjBfZGF5c1wiKVxuXHR9XG5cbkNyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGggPSAobW9udGgpLT5cblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdGlmIG1vbnRoIDwgM1xuXHRcdHJldHVybiAwXG5cdGVsc2UgaWYgbW9udGggPCA2XG5cdFx0cmV0dXJuIDNcblx0ZWxzZSBpZiBtb250aCA8IDlcblx0XHRyZXR1cm4gNlxuXHRcblx0cmV0dXJuIDlcblxuXG5DcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkgPSAoeWVhcixtb250aCktPlxuXHRpZiAheWVhclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdGlmIG1vbnRoIDwgM1xuXHRcdHllYXItLVxuXHRcdG1vbnRoID0gOVxuXHRlbHNlIGlmIG1vbnRoIDwgNlxuXHRcdG1vbnRoID0gMFxuXHRlbHNlIGlmIG1vbnRoIDwgOVxuXHRcdG1vbnRoID0gM1xuXHRlbHNlIFxuXHRcdG1vbnRoID0gNlxuXHRcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRcblxuQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5ID0gKHllYXIsbW9udGgpLT5cblx0aWYgIXllYXJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXG5cdGlmICFtb250aFxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXG5cdFxuXHRpZiBtb250aCA8IDNcblx0XHRtb250aCA9IDNcblx0ZWxzZSBpZiBtb250aCA8IDZcblx0XHRtb250aCA9IDZcblx0ZWxzZSBpZiBtb250aCA8IDlcblx0XHRtb250aCA9IDlcblx0ZWxzZVxuXHRcdHllYXIrK1xuXHRcdG1vbnRoID0gMFxuXHRcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXG5DcmVhdG9yLmdldE1vbnRoRGF5cyA9ICh5ZWFyLG1vbnRoKS0+XG5cdGlmIG1vbnRoID09IDExXG5cdFx0cmV0dXJuIDMxXG5cdFxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcblx0c3RhcnREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdGVuZERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCsxLCAxKVxuXHRkYXlzID0gKGVuZERhdGUtc3RhcnREYXRlKS9taWxsaXNlY29uZFxuXHRyZXR1cm4gZGF5c1xuXG5DcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5ID0gKHllYXIsIG1vbnRoKS0+XG5cdGlmICF5ZWFyXG5cdFx0eWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKVxuXHRpZiAhbW9udGhcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxuXHRcblx0IyDmnIjku73kuLow5Luj6KGo5pys5bm055qE56ys5LiA5pyIXG5cdGlmIG1vbnRoID09IDBcblx0XHRtb250aCA9IDExXG5cdFx0eWVhci0tXG5cdFx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRcblx0IyDlkKbliJks5Y+q5YeP5Y675pyI5Lu9XG5cdG1vbnRoLS07XG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0XG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSA9IChmaWVsZF90eXBlLCBrZXkpLT5cblx0IyDov4fmu6TlmahiZXR3ZWVu6L+Q566X56ym77yM546w566X5pel5pyfL+aXpeacn+aXtumXtOexu+Wei+Wtl+auteeahHZhbHVlc+WAvFxuXHRub3cgPSBuZXcgRGF0ZSgpXG5cdCMg5LiA5aSp55qE5q+r56eS5pWwXG5cdG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNFxuXHR5ZXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHR0b21vcnJvdyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZClcblx0IyDkuIDlkajkuK3nmoTmn5DkuIDlpKlcblx0d2VlayA9IG5vdy5nZXREYXkoKVxuXHQjIOWHj+WOu+eahOWkqeaVsFxuXHRtaW51c0RheSA9IGlmIHdlZWsgIT0gMCB0aGVuIHdlZWsgLSAxIGVsc2UgNlxuXHRtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKVxuXHRzdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpXG5cdCMg5LiK5ZGo5pelXG5cdGxhc3RTdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXG5cdCMg5LiK5ZGo5LiAXG5cdGxhc3RNb25kYXkgPSBuZXcgRGF0ZShsYXN0U3VuZGF5LmdldFRpbWUoKSAtIChtaWxsaXNlY29uZCAqIDYpKVxuXHQjIOS4i+WRqOS4gFxuXHRuZXh0TW9uZGF5ID0gbmV3IERhdGUoc3VuZGF5LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKVxuXHQjIOS4i+WRqOaXpVxuXHRuZXh0U3VuZGF5ID0gbmV3IERhdGUobmV4dE1vbmRheS5nZXRUaW1lKCkgKyAobWlsbGlzZWNvbmQgKiA2KSlcblx0Y3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuXHRwcmV2aW91c1llYXIgPSBjdXJyZW50WWVhciAtIDFcblx0bmV4dFllYXIgPSBjdXJyZW50WWVhciArIDFcblx0IyDlvZPliY3mnIjku71cblx0Y3VycmVudE1vbnRoID0gbm93LmdldE1vbnRoKClcblx0IyDorqHmlbDlubTjgIHmnIhcblx0eWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXG5cdG1vbnRoID0gbm93LmdldE1vbnRoKClcblx0IyDmnKzmnIjnrKzkuIDlpKlcblx0Zmlyc3REYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixjdXJyZW50TW9udGgsMSlcblxuXHQjIOW9k+S4ujEy5pyI55qE5pe25YCZ5bm05Lu96ZyA6KaB5YqgMVxuXHQjIOaciOS7vemcgOimgeabtOaWsOS4ujAg5Lmf5bCx5piv5LiL5LiA5bm055qE56ys5LiA5Liq5pyIXG5cdGlmIGN1cnJlbnRNb250aCA9PSAxMVxuXHRcdHllYXIrK1xuXHRcdG1vbnRoKytcblx0ZWxzZVxuXHRcdG1vbnRoKytcblx0XG5cdCMg5LiL5pyI56ys5LiA5aSpXG5cdG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdCMg5LiL5pyI5pyA5ZCO5LiA5aSpXG5cdG5leHRNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoeWVhcixtb250aCxDcmVhdG9yLmdldE1vbnRoRGF5cyh5ZWFyLG1vbnRoKSlcblx0IyDmnKzmnIjmnIDlkI7kuIDlpKlcblx0bGFzdERheSA9IG5ldyBEYXRlKG5leHRNb250aEZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHQjIOS4iuaciOesrOS4gOWkqVxuXHRsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxuXHQjIOS4iuaciOacgOWQjuS4gOWkqVxuXHRsYXN0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKGZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHQjIOacrOWto+W6puW8gOWni+aXpVxuXHR0aGlzUXVhcnRlclN0YXJ0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpLDEpXG5cdCMg5pys5a2j5bqm57uT5p2f5pelXG5cdHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIsQ3JlYXRvci5nZXRNb250aERheXMoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIpKVxuXHQjIOS4iuWto+W6puW8gOWni+aXpVxuXHRsYXN0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aClcblx0IyDkuIrlraPluqbnu5PmnZ/ml6Vcblx0bGFzdFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIsQ3JlYXRvci5nZXRNb250aERheXMobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyKSlcblx0IyDkuIvlraPluqblvIDlp4vml6Vcblx0bmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXG5cdCMg5LiL5a2j5bqm57uT5p2f5pelXG5cdG5leHRRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyLENyZWF0b3IuZ2V0TW9udGhEYXlzKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMikpXG5cdCMg6L+H5Y67N+WkqSBcblx0bGFzdF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDYgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67MzDlpKlcblx0bGFzdF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgyOSAqIG1pbGxpc2Vjb25kKSlcblx0IyDov4fljrs2MOWkqVxuXHRsYXN0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDU5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOi/h+WOuzkw5aSpXG5cdGxhc3RfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoODkgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67MTIw5aSpXG5cdGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaU35aSpIFxuXHRuZXh0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaUzMOWkqVxuXHRuZXh0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDI5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTYw5aSpXG5cdG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lOTDlpKlcblx0bmV4dF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg4OSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaUxMjDlpKlcblx0bmV4dF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTE5ICogbWlsbGlzZWNvbmQpKVxuXG5cdHN3aXRjaCBrZXlcblx0XHR3aGVuIFwibGFzdF95ZWFyXCJcblx0XHRcdCPljrvlubRcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfeWVhclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3twcmV2aW91c1llYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7cHJldmlvdXNZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc195ZWFyXCJcblx0XHRcdCPku4rlubRcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfeWVhclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfeWVhclwiXG5cdFx0XHQj5piO5bm0XG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3llYXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7bmV4dFllYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7bmV4dFllYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0X3F1YXJ0ZXJcIlxuXHRcdFx0I+S4iuWto+W6plxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9xdWFydGVyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0aGlzX3F1YXJ0ZXJcIlxuXHRcdFx0I+acrOWto+W6plxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19xdWFydGVyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0X3F1YXJ0ZXJcIlxuXHRcdFx0I+S4i+Wto+W6plxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9xdWFydGVyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0X21vbnRoXCJcblx0XHRcdCPkuIrmnIhcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X21vbnRoXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0aGlzX21vbnRoXCJcblx0XHRcdCPmnKzmnIhcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfbW9udGhcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfbW9udGhcIlxuXHRcdFx0I+S4i+aciFxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfbW9udGhcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3Rfd2Vla1wiXG5cdFx0XHQj5LiK5ZGoXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobGFzdE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KGxhc3RTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3Rfd2Vla1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc193ZWVrXCJcblx0XHRcdCPmnKzlkahcblx0XHRcdHN0ck1vbmRheSA9IG1vbWVudChtb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0clN1bmRheSA9IG1vbWVudChzdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfd2Vla1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF93ZWVrXCJcblx0XHRcdCPkuIvlkahcblx0XHRcdHN0ck1vbmRheSA9IG1vbWVudChuZXh0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF93ZWVrXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ck1vbmRheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ5ZXN0ZGF5XCJcblx0XHRcdCPmmKjlpKlcblx0XHRcdHN0clllc3RkYXkgPSBtb21lbnQoeWVzdGRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5feWVzdGRheVwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJZZXN0ZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clllc3RkYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0b2RheVwiXG5cdFx0XHQj5LuK5aSpXG5cdFx0XHRzdHJUb2RheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvZGF5XCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidG9tb3Jyb3dcIlxuXHRcdFx0I+aYjuWkqVxuXHRcdFx0c3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvbW9ycm93XCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvbW9ycm93fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvbW9ycm93fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF83X2RheXNcIlxuXHRcdFx0I+i/h+WOuzflpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpIFxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF83X2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF8zMF9kYXlzXCJcblx0XHRcdCPov4fljrszMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzMwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF82MF9kYXlzXCJcblx0XHRcdCPov4fljrs2MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzYwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF85MF9kYXlzXCJcblx0XHRcdCPov4fljrs5MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzkwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF8xMjBfZGF5c1wiXG5cdFx0XHQj6L+H5Y67MTIw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfN19kYXlzXCJcblx0XHRcdCPmnKrmnaU35aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF83X2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF8zMF9kYXlzXCJcblx0XHRcdCPmnKrmnaUzMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzMwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF82MF9kYXlzXCJcblx0XHRcdCPmnKrmnaU2MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzYwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF85MF9kYXlzXCJcblx0XHRcdCPmnKrmnaU5MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzkwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF8xMjBfZGF5c1wiXG5cdFx0XHQj5pyq5p2lMTIw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzEyMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFxuXHR2YWx1ZXMgPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdXG5cdGlmIGZpZWxkX3R5cGUgPT0gXCJkYXRldGltZVwiXG5cdFx0IyDml7bpl7TnsbvlnovlrZfmrrXvvIzlhoXnva7ml7bpl7TojIPlm7TlupTor6XogIPomZHlgY/np7vml7bljLrlgLzvvIzlkKbliJnov4fmu6TmlbDmja7lrZjlnKjlgY/lt65cblx0XHQjIOmdnuWGhee9ruaXtumXtOiMg+WbtOaXtu+8jOeUqOaIt+mAmui/h+aXtumXtOaOp+S7tumAieaLqeeahOiMg+WbtO+8jOS8muiHquWKqOWkhOeQhuaXtuWMuuWBj+W3ruaDheWGtVxuXHRcdCMg5pel5pyf57G75Z6L5a2X5q6177yM5pWw5o2u5bqT5pys5p2l5bCx5a2Y55qE5pivVVRD55qEMOeCue+8jOS4jeWtmOWcqOWBj+W3rlxuXHRcdF8uZm9yRWFjaCB2YWx1ZXMsIChmdiktPlxuXHRcdFx0aWYgZnZcblx0XHRcdFx0ZnYuc2V0SG91cnMoZnYuZ2V0SG91cnMoKSArIGZ2LmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCApXG5cdFxuXHRyZXR1cm4ge1xuXHRcdGxhYmVsOiBsYWJlbFxuXHRcdGtleToga2V5XG5cdFx0dmFsdWVzOiB2YWx1ZXNcblx0fVxuXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IChmaWVsZF90eXBlKS0+XG5cdGlmIGZpZWxkX3R5cGUgJiYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSlcblx0XHRyZXR1cm4gJ2JldHdlZW4nXG5cdGVsc2UgaWYgW1widGV4dGFyZWFcIiwgXCJ0ZXh0XCIsIFwiY29kZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXHRcdHJldHVybiAnY29udGFpbnMnXG5cdGVsc2Vcblx0XHRyZXR1cm4gXCI9XCJcblxuQ3JlYXRvci5nZXRGaWVsZE9wZXJhdGlvbiA9IChmaWVsZF90eXBlKSAtPlxuXHQjIOaXpeacn+exu+WeizogZGF0ZSwgZGF0ZXRpbWUgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxuXHQjIOaWh+acrOexu+WeizogdGV4dCwgdGV4dGFyZWEsIGh0bWwgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCJjb250YWluc1wiLCBcIm5vdGNvbnRhaW5zXCIsIFwic3RhcnRzd2l0aFwiXG5cdCMg6YCJ5oup57G75Z6LOiBsb29rdXAsIG1hc3Rlcl9kZXRhaWwsIHNlbGVjdCDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcblx0IyDmlbDlgLznsbvlnos6IGN1cnJlbmN5LCBudW1iZXIgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxuXHQjIOW4g+WwlOexu+WeizogYm9vbGVhbiAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXG5cdCMg5pWw57uE57G75Z6LOiBjaGVja2JveCwgW3RleHRdICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcblxuXHRvcHRpb25hbHMgPSB7XG5cdFx0ZXF1YWw6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9lcXVhbFwiKSwgdmFsdWU6IFwiPVwifSxcblx0XHR1bmVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fdW5lcXVhbFwiKSwgdmFsdWU6IFwiPD5cIn0sXG5cdFx0bGVzc190aGFuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc190aGFuXCIpLCB2YWx1ZTogXCI8XCJ9LFxuXHRcdGdyZWF0ZXJfdGhhbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfdGhhblwiKSwgdmFsdWU6IFwiPlwifSxcblx0XHRsZXNzX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc19vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPD1cIn0sXG5cdFx0Z3JlYXRlcl9vcl9lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfb3JfZXF1YWxcIiksIHZhbHVlOiBcIj49XCJ9LFxuXHRcdGNvbnRhaW5zOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fY29udGFpbnNcIiksIHZhbHVlOiBcImNvbnRhaW5zXCJ9LFxuXHRcdG5vdF9jb250YWluOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZG9lc19ub3RfY29udGFpblwiKSwgdmFsdWU6IFwibm90Y29udGFpbnNcIn0sXG5cdFx0c3RhcnRzX3dpdGg6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9zdGFydHNfd2l0aFwiKSwgdmFsdWU6IFwic3RhcnRzd2l0aFwifSxcblx0XHRiZXR3ZWVuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2VlblwiKSwgdmFsdWU6IFwiYmV0d2VlblwifSxcblx0fVxuXG5cdGlmIGZpZWxkX3R5cGUgPT0gdW5kZWZpbmVkXG5cdFx0cmV0dXJuIF8udmFsdWVzKG9wdGlvbmFscylcblxuXHRvcGVyYXRpb25zID0gW11cblxuXHRpZiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKVxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuYmV0d2Vlbilcblx0XHRDcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyhmaWVsZF90eXBlLCBvcGVyYXRpb25zKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJ0ZXh0XCIgb3IgZmllbGRfdHlwZSA9PSBcInRleHRhcmVhXCIgb3IgZmllbGRfdHlwZSA9PSBcImh0bWxcIiBvciBmaWVsZF90eXBlID09IFwiY29kZVwiXG4jXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsLCBvcHRpb25hbHMuY29udGFpbnMsIG9wdGlvbmFscy5ub3RfY29udGFpbiwgb3B0aW9uYWxzLnN0YXJ0c193aXRoKVxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuY29udGFpbnMpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImxvb2t1cFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgb3IgZmllbGRfdHlwZSA9PSBcInNlbGVjdFwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImN1cnJlbmN5XCIgb3IgZmllbGRfdHlwZSA9PSBcIm51bWJlclwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5sZXNzX3RoYW4sIG9wdGlvbmFscy5ncmVhdGVyX3RoYW4sIG9wdGlvbmFscy5sZXNzX29yX2VxdWFsLCBvcHRpb25hbHMuZ3JlYXRlcl9vcl9lcXVhbClcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiYm9vbGVhblwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImNoZWNrYm94XCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiW3RleHRdXCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblx0ZWxzZVxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXG5cdHJldHVybiBvcGVyYXRpb25zXG5cbiMjI1xuICAgIOWFiOaMieeFp+acieaOkuW6j+WPt+eahOWwj+eahOWcqOWJje+8jOWkp+eahOWcqOWQjlxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxuIyMjXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUgPSAob2JqZWN0X25hbWUpLT5cblx0ZmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5maWVsZHNcblx0ZmllbGRzQXJyID0gW11cblxuXHRfLmVhY2ggZmllbGRzLCAoZmllbGQpLT5cblx0XHRmaWVsZHNBcnIucHVzaCB7bmFtZTogZmllbGQubmFtZSwgc29ydF9ubzogZmllbGQuc29ydF9ub31cblxuXHRmaWVsZHNOYW1lID0gW11cblx0Xy5lYWNoIF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCAoZmllbGQpLT5cblx0XHRmaWVsZHNOYW1lLnB1c2goZmllbGQubmFtZSlcblx0cmV0dXJuIGZpZWxkc05hbWVcbiIsIkNyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciBmaWVsZHNBcnIsIHNjaGVtYTtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm47XG4gIH1cbiAgc2NoZW1hID0ge307XG4gIGZpZWxkc0FyciA9IFtdO1xuICBfLmVhY2gob2JqLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoIV8uaGFzKGZpZWxkLCBcIm5hbWVcIikpIHtcbiAgICAgIGZpZWxkLm5hbWUgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzQXJyLnB1c2goZmllbGQpO1xuICB9KTtcbiAgXy5lYWNoKF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHZhciBfb2JqZWN0LCBfcmVmX29iaiwgX3JlZmVyZW5jZV90bywgYXV0b2Zvcm1fdHlwZSwgZmllbGRfbmFtZSwgZnMsIGlzVW5MaW1pdGVkLCBsb2NhbGUsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjM7XG4gICAgZmllbGRfbmFtZSA9IGZpZWxkLm5hbWU7XG4gICAgZnMgPSB7fTtcbiAgICBpZiAoZmllbGQucmVnRXgpIHtcbiAgICAgIGZzLnJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgfVxuICAgIGZzLmF1dG9mb3JtID0ge307XG4gICAgZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZTtcbiAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgYXV0b2Zvcm1fdHlwZSA9IChyZWYgPSBmaWVsZC5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwO1xuICAgIGlmIChmaWVsZC50eXBlID09PSBcInRleHRcIiB8fCBmaWVsZC50eXBlID09PSBcInBob25lXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIlt0ZXh0XVwiIHx8IGZpZWxkLnR5cGUgPT09IFwiW3Bob25lXVwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnY29kZScpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTI7XG4gICAgICBpZiAoZmllbGQubGFuZ3VhZ2UpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCI7XG4gICAgICBmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAyO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJwYXNzd29yZFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5pc2lPUygpKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgICAgdGltZXpvbmVJZDogXCJ1dGNcIixcbiAgICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiLFxuICAgICAgICAgICAgICAgIHBpY2tlclR5cGU6IFwicm9sbGVyc1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCIsXG4gICAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0ub3V0Rm9ybWF0ID0gJ3l5eXktTU0tZGQnO1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgIHRpbWV6b25lSWQ6IFwidXRjXCIsXG4gICAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiLFxuICAgICAgICAgICAgICBkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgICAgZnMudHlwZSA9IERhdGU7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpKSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuaXNpT1MoKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCIsXG4gICAgICAgICAgICAgICAgcGlja2VyVHlwZTogXCJyb2xsZXJzXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgICAgZGF0ZU1vYmlsZU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJbT2JqZWN0XVwiKSB7XG4gICAgICBmcy50eXBlID0gW09iamVjdF07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImh0bWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgbG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKTtcbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiIHx8IGxvY2FsZSA9PT0gXCJ6aC1DTlwiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsZSA9IFwiZW4tVVNcIjtcbiAgICAgICAgfVxuICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgdHlwZTogXCJzdW1tZXJub3RlXCIsXG4gICAgICAgICAgXCJjbGFzc1wiOiAnc3VtbWVybm90ZS1lZGl0b3InLFxuICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgICAgICAgIGRpYWxvZ3NJbkJvZHk6IHRydWUsXG4gICAgICAgICAgICB0b29sYmFyOiBbWydmb250MScsIFsnc3R5bGUnXV0sIFsnZm9udDInLCBbJ2JvbGQnLCAndW5kZXJsaW5lJywgJ2l0YWxpYycsICdjbGVhciddXSwgWydmb250MycsIFsnZm9udG5hbWUnXV0sIFsnY29sb3InLCBbJ2NvbG9yJ11dLCBbJ3BhcmEnLCBbJ3VsJywgJ29sJywgJ3BhcmFncmFwaCddXSwgWyd0YWJsZScsIFsndGFibGUnXV0sIFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sIFsndmlldycsIFsnY29kZXZpZXcnXV1dLFxuICAgICAgICAgICAgZm9udE5hbWVzOiBbJ0FyaWFsJywgJ0NvbWljIFNhbnMgTVMnLCAnQ291cmllciBOZXcnLCAnSGVsdmV0aWNhJywgJ0ltcGFjdCcsICflrovkvZMnLCAn6buR5L2TJywgJ+W+rui9r+mbhem7kScsICfku7/lrosnLCAn5qW35L2TJywgJ+matuS5picsICflubzlnIYnXSxcbiAgICAgICAgICAgIGxhbmc6IGxvY2FsZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIgfHwgZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZpZWxkLnNob3dJY29uO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIH1cbiAgICAgIGlmICghZmllbGQuaGlkZGVuKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmZpbHRlcnMgPSBmaWVsZC5maWx0ZXJzO1xuICAgICAgICBmcy5hdXRvZm9ybS5kZXBlbmRPbiA9IGZpZWxkLmRlcGVuZF9vbjtcbiAgICAgICAgaWYgKGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbikge1xuICAgICAgICAgIGZzLmJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBmcy5maWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPyBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gOiBDcmVhdG9yLmV2YWx1YXRlRmlsdGVycztcbiAgICAgICAgaWYgKGZpZWxkLm9wdGlvbnNGdW5jdGlvbikge1xuICAgICAgICAgIGZzLm9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3RvKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgaWYgKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWVsZC5jcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgICAgICAgZnMuY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChfLmlzU3RyaW5nKGZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBfcmVmX29iaiA9IENyZWF0b3IuT2JqZWN0c1tmaWVsZC5yZWZlcmVuY2VfdG9dO1xuICAgICAgICAgICAgICAgIGlmIChfcmVmX29iaiAhPSBudWxsID8gKHJlZjEgPSBfcmVmX29iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjEuYWxsb3dDcmVhdGUgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICBmcy5jcmVhdGVGdW5jdGlvbiA9IGZ1bmN0aW9uKGxvb2t1cF9maWVsZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTW9kYWwuc2hvdyhcIkNyZWF0b3JPYmplY3RNb2RhbFwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbjogXCJDcmVhdG9yLkNvbGxlY3Rpb25zLlwiICsgKENyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8pLl9uYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICBmb3JtSWQ6IFwibmV3XCIgKyAoZmllbGQucmVmZXJlbmNlX3RvLnJlcGxhY2UoJy4nLCAnXycpKSxcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogXCJcIiArIGZpZWxkLnJlZmVyZW5jZV90byxcbiAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiaW5zZXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgb25TdWNjZXNzOiBmdW5jdGlvbihvcGVyYXRpb24sIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lm9iamVjdF9uYW1lID09PSBcIm9iamVjdHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogcmVzdWx0LnZhbHVlLmxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC52YWx1ZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogcmVzdWx0LnZhbHVlLmljb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sIHJlc3VsdC52YWx1ZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb29rdXBfZmllbGQuYWRkSXRlbXMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiByZXN1bHQudmFsdWVbb2JqZWN0Lk5BTUVfRklFTERfS0VZXSB8fCByZXN1bHQudmFsdWUubGFiZWwgfHwgcmVzdWx0LnZhbHVlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0Ll9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgcmVzdWx0Ll9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXy5pc0Jvb2xlYW4oZmllbGQuY3JlYXRlKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmllbGQuY3JlYXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3NvcnQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNTb3J0ID0gZmllbGQucmVmZXJlbmNlX3NvcnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfbGltaXQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNMaW1pdCA9IGZpZWxkLnJlZmVyZW5jZV9saW1pdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3R1c2VyXCI7XG4gICAgICAgICAgICBpZiAoIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdCkge1xuICAgICAgICAgICAgICBpZiAoZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IChyZWYyID0gb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMi5nZXQoKSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoaXNVbkxpbWl0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24oZmllbGQuaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJvcmdhbml6YXRpb25zXCIpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdG9yZ1wiO1xuICAgICAgICAgICAgaWYgKCFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXQpIHtcbiAgICAgICAgICAgICAgaWYgKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSAocmVmMyA9IG9iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjMuZ2V0KCkgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGlzVW5MaW1pdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZmllbGQucmVmZXJlbmNlX3RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfLmlzQXJyYXkoX3JlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICAgICAgICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5vXCJdID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgICAgICAgb21pdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5pZHNcIl0gPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogW1N0cmluZ10sXG4gICAgICAgICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgICAgICAgIG9taXQ6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gW19yZWZlcmVuY2VfdG9dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXTtcbiAgICAgICAgICAgIGlmIChfb2JqZWN0ICYmIF9vYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0VHJlZVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZCA9IGZpZWxkLm9wdGlvbnNNZXRob2QgfHwgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI7XG4gICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kUGFyYW1zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcyA9IFtdO1xuICAgICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8uZm9yRWFjaChmdW5jdGlvbihfcmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdO1xuICAgICAgICAgICAgICAgICAgaWYgKF9vYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBfcmVmZXJlbmNlLFxuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmxhYmVsIDogdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICAgIGljb246IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIi9hcHAvXCIgKyAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSArIFwiL1wiICsgX3JlZmVyZW5jZSArIFwiL3ZpZXcvXCI7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogX3JlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIi9hcHAvXCIgKyAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSArIFwiL1wiICsgX3JlZmVyZW5jZSArIFwiL3ZpZXcvXCI7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICBmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZhbHNlO1xuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFwiO1xuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgICAgaWYgKF8uaGFzKGZpZWxkLCAnZmlyc3RPcHRpb24nKSkge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gZmllbGQuZmlyc3RPcHRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBcIlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImN1cnJlbmN5XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGU7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSAhPT0gMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IDI7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZTtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgICAgZnMudHlwZSA9IEJvb2xlYW47XG4gICAgICBpZiAoZmllbGQucmVhZG9ubHkpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLWNoZWNrYm94XCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRvZ2dsZVwiKSB7XG4gICAgICBmcy50eXBlID0gQm9vbGVhbjtcbiAgICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tdG9nZ2xlXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInJlZmVyZW5jZVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3QtY2hlY2tib3hcIjtcbiAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJmaWxlXCIgJiYgZmllbGQuY29sbGVjdGlvbikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiBmaWVsZC5jb2xsZWN0aW9uXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9IGZpZWxkLmNvbGxlY3Rpb247XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImZpbGVzaXplXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVzaXplJztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiT2JqZWN0XCIgfHwgZmllbGQudHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZ3JpZFwiKSB7XG4gICAgICBmcy50eXBlID0gQXJyYXk7XG4gICAgICBmcy5hdXRvZm9ybS5lZGl0YWJsZSA9IHRydWU7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zR3JpZFwiO1xuICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICB0eXBlOiBPYmplY3RcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImltYWdlXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2ltYWdlcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdpbWFnZS8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnaW1hZ2VzJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJhdmF0YXJcIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXZhdGFycycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdpbWFnZS8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXZhdGFycyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYXVkaW9cIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXVkaW9zJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ2F1ZGlvLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdWRpb3MnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnYXVkaW8vKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInZpZGVvXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ3ZpZGVvcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICd2aWRlby8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAndmlkZW9zJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ3ZpZGVvLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJsb2NhdGlvblwiKSB7XG4gICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwibG9jYXRpb25cIjtcbiAgICAgIGZzLmF1dG9mb3JtLnN5c3RlbSA9IGZpZWxkLnN5c3RlbSB8fCBcIndnczg0XCI7XG4gICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIm1hcmtkb3duXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLW1hcmtkb3duXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAndXJsJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc1VybCc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZW1haWwnKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWw7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NFbWFpbCc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnYXV0b251bWJlcicpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZm9ybXVsYScpIHtcbiAgICAgIGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHtcbiAgICAgICAgICAgIHR5cGU6IGZpZWxkLmRhdGFfdHlwZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pW2ZpZWxkLm5hbWVdO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3N1bW1hcnknKSB7XG4gICAgICBmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7XG4gICAgICAgICAgICB0eXBlOiBmaWVsZC5kYXRhX3R5cGVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVtmaWVsZC5uYW1lXTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdwZXJjZW50Jykge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmICghXy5pc051bWJlcihmaWVsZC5zY2FsZSkpIHtcbiAgICAgICAgZmllbGQuc2NhbGUgPSAwO1xuICAgICAgfVxuICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZSArIDI7XG4gICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnMudHlwZSA9IGZpZWxkLnR5cGU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5sYWJlbCkge1xuICAgICAgZnMubGFiZWwgPSBmaWVsZC5sYWJlbDtcbiAgICB9XG4gICAgaWYgKCFmaWVsZC5yZXF1aXJlZCkge1xuICAgICAgZnMub3B0aW9uYWwgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIU1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZnMub3B0aW9uYWwgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQudW5pcXVlKSB7XG4gICAgICBmcy51bmlxdWUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQub21pdCkge1xuICAgICAgZnMuYXV0b2Zvcm0ub21pdCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5ncm91cCkge1xuICAgICAgZnMuYXV0b2Zvcm0uZ3JvdXAgPSBmaWVsZC5ncm91cDtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmlzX3dpZGUpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmlzX3dpZGUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaGlkZGVuKSB7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJoaWRkZW5cIjtcbiAgICB9XG4gICAgaWYgKChmaWVsZC50eXBlID09PSBcInNlbGVjdFwiKSB8fCAoZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIikgfHwgKGZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSkge1xuICAgICAgaWYgKHR5cGVvZiBmaWVsZC5maWx0ZXJhYmxlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpZWxkLm5hbWUgPT09ICduYW1lJyB8fCBmaWVsZC5pc19uYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIGZpZWxkLnNlYXJjaGFibGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGZpZWxkLnNlYXJjaGFibGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYXV0b2Zvcm1fdHlwZSkge1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IGF1dG9mb3JtX3R5cGU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5kZWZhdWx0VmFsdWUpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZmllbGQuZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZmllbGQuZGVmYXVsdFZhbHVlLCB7XG4gICAgICAgICAgICB1c2VySWQ6IE1ldGVvci51c2VySWQoKSxcbiAgICAgICAgICAgIHNwYWNlSWQ6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSxcbiAgICAgICAgICAgIG5vdzogbmV3IERhdGUoKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgICBpZiAoIV8uaXNGdW5jdGlvbihmaWVsZC5kZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgICAgZnMuZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgZnMuYXV0b2Zvcm0ucmVhZG9ubHkgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZGlzYWJsZWQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmlubGluZUhlbHBUZXh0KSB7XG4gICAgICBmcy5hdXRvZm9ybS5pbmxpbmVIZWxwVGV4dCA9IGZpZWxkLmlubGluZUhlbHBUZXh0O1xuICAgIH1cbiAgICBpZiAoZmllbGQuYmxhY2tib3gpIHtcbiAgICAgIGZzLmJsYWNrYm94ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKF8uaGFzKGZpZWxkLCAnbWluJykpIHtcbiAgICAgIGZzLm1pbiA9IGZpZWxkLm1pbjtcbiAgICB9XG4gICAgaWYgKF8uaGFzKGZpZWxkLCAnbWF4JykpIHtcbiAgICAgIGZzLm1heCA9IGZpZWxkLm1heDtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1Byb2R1Y3Rpb24pIHtcbiAgICAgIGlmIChmaWVsZC5pbmRleCkge1xuICAgICAgICBmcy5pbmRleCA9IGZpZWxkLmluZGV4O1xuICAgICAgfSBlbHNlIGlmIChmaWVsZC5zb3J0YWJsZSkge1xuICAgICAgICBmcy5pbmRleCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzY2hlbWFbZmllbGRfbmFtZV0gPSBmcztcbiAgfSk7XG4gIHJldHVybiBzY2hlbWE7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGlzcGxheVZhbHVlID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlKSB7XG4gIHZhciBmaWVsZCwgaHRtbCwgb2JqZWN0O1xuICBodG1sID0gZmllbGRfdmFsdWU7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICBmaWVsZCA9IG9iamVjdC5maWVsZHMoZmllbGRfbmFtZSk7XG4gIGlmICghZmllbGQpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgaHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREIEg6bW0nKTtcbiAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImRhdGVcIikge1xuICAgIGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICB9XG4gIHJldHVybiBodG1sO1xufTtcblxuQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkgPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIHJldHVybiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIiwgXCJjdXJyZW5jeVwiLCBcIm51bWJlclwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKTtcbn07XG5cbkNyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgb3BlcmF0aW9ucykge1xuICB2YXIgYnVpbHRpblZhbHVlcztcbiAgYnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSk7XG4gIGlmIChidWlsdGluVmFsdWVzKSB7XG4gICAgcmV0dXJuIF8uZm9yRWFjaChidWlsdGluVmFsdWVzLCBmdW5jdGlvbihidWlsdGluSXRlbSwga2V5KSB7XG4gICAgICByZXR1cm4gb3BlcmF0aW9ucy5wdXNoKHtcbiAgICAgICAgbGFiZWw6IGJ1aWx0aW5JdGVtLmxhYmVsLFxuICAgICAgICB2YWx1ZToga2V5XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGlzX2NoZWNrX29ubHkpIHtcbiAgaWYgKFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyhpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGtleSkge1xuICBpZiAoW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIGtleSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlLCB2YWx1ZSkge1xuICB2YXIgYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIHJlc3VsdDtcbiAgaWYgKCFfLmlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBiZXR3ZWVuQnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSk7XG4gIGlmICghYmV0d2VlbkJ1aWx0aW5WYWx1ZXMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmVzdWx0ID0gbnVsbDtcbiAgXy5lYWNoKGJldHdlZW5CdWlsdGluVmFsdWVzLCBmdW5jdGlvbihpdGVtLCBvcGVyYXRpb24pIHtcbiAgICBpZiAoaXRlbS5rZXkgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gcmVzdWx0ID0gb3BlcmF0aW9uO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyA9IGZ1bmN0aW9uKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpIHtcbiAgcmV0dXJuIHtcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF9tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3Rfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV95ZXN0ZGF5XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ5ZXN0ZGF5XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RvZGF5XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b2RheVwiKSxcbiAgICBcImJldHdlZW5fdGltZV90b21vcnJvd1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9tb3Jyb3dcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF83X2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfN19kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfMzBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8zMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfNjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF82MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfOTBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF85MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfMTIwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMTIwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF83X2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfN19kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfMzBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8zMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfNjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF82MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfOTBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF85MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfMTIwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMTIwX2RheXNcIilcbiAgfTtcbn07XG5cbkNyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGggPSBmdW5jdGlvbihtb250aCkge1xuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIHJldHVybiAwO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIHJldHVybiAzO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIHJldHVybiA2O1xuICB9XG4gIHJldHVybiA5O1xufTtcblxuQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIHllYXItLTtcbiAgICBtb250aCA9IDk7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgbW9udGggPSAwO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIG1vbnRoID0gMztcbiAgfSBlbHNlIHtcbiAgICBtb250aCA9IDY7XG4gIH1cbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICBtb250aCA9IDM7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgbW9udGggPSA2O1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIG1vbnRoID0gOTtcbiAgfSBlbHNlIHtcbiAgICB5ZWFyKys7XG4gICAgbW9udGggPSAwO1xuICB9XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldE1vbnRoRGF5cyA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIHZhciBkYXlzLCBlbmREYXRlLCBtaWxsaXNlY29uZCwgc3RhcnREYXRlO1xuICBpZiAobW9udGggPT09IDExKSB7XG4gICAgcmV0dXJuIDMxO1xuICB9XG4gIG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgc3RhcnREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICBlbmREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAxKTtcbiAgZGF5cyA9IChlbmREYXRlIC0gc3RhcnREYXRlKSAvIG1pbGxpc2Vjb25kO1xuICByZXR1cm4gZGF5cztcbn07XG5cbkNyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPT09IDApIHtcbiAgICBtb250aCA9IDExO1xuICAgIHllYXItLTtcbiAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICB9XG4gIG1vbnRoLS07XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGtleSkge1xuICB2YXIgY3VycmVudE1vbnRoLCBjdXJyZW50WWVhciwgZW5kVmFsdWUsIGZpcnN0RGF5LCBsYWJlbCwgbGFzdERheSwgbGFzdE1vbmRheSwgbGFzdE1vbnRoRmluYWxEYXksIGxhc3RNb250aEZpcnN0RGF5LCBsYXN0UXVhcnRlckVuZERheSwgbGFzdFF1YXJ0ZXJTdGFydERheSwgbGFzdFN1bmRheSwgbGFzdF8xMjBfZGF5cywgbGFzdF8zMF9kYXlzLCBsYXN0XzYwX2RheXMsIGxhc3RfN19kYXlzLCBsYXN0XzkwX2RheXMsIG1pbGxpc2Vjb25kLCBtaW51c0RheSwgbW9uZGF5LCBtb250aCwgbmV4dE1vbmRheSwgbmV4dE1vbnRoRmluYWxEYXksIG5leHRNb250aEZpcnN0RGF5LCBuZXh0UXVhcnRlckVuZERheSwgbmV4dFF1YXJ0ZXJTdGFydERheSwgbmV4dFN1bmRheSwgbmV4dFllYXIsIG5leHRfMTIwX2RheXMsIG5leHRfMzBfZGF5cywgbmV4dF82MF9kYXlzLCBuZXh0XzdfZGF5cywgbmV4dF85MF9kYXlzLCBub3csIHByZXZpb3VzWWVhciwgc3RhcnRWYWx1ZSwgc3RyRW5kRGF5LCBzdHJGaXJzdERheSwgc3RyTGFzdERheSwgc3RyTW9uZGF5LCBzdHJTdGFydERheSwgc3RyU3VuZGF5LCBzdHJUb2RheSwgc3RyVG9tb3Jyb3csIHN0clllc3RkYXksIHN1bmRheSwgdGhpc1F1YXJ0ZXJFbmREYXksIHRoaXNRdWFydGVyU3RhcnREYXksIHRvbW9ycm93LCB2YWx1ZXMsIHdlZWssIHllYXIsIHllc3RkYXk7XG4gIG5vdyA9IG5ldyBEYXRlKCk7XG4gIG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgeWVzdGRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIHRvbW9ycm93ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKTtcbiAgd2VlayA9IG5vdy5nZXREYXkoKTtcbiAgbWludXNEYXkgPSB3ZWVrICE9PSAwID8gd2VlayAtIDEgOiA2O1xuICBtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKTtcbiAgc3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdFN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIGxhc3RNb25kYXkgPSBuZXcgRGF0ZShsYXN0U3VuZGF5LmdldFRpbWUoKSAtIChtaWxsaXNlY29uZCAqIDYpKTtcbiAgbmV4dE1vbmRheSA9IG5ldyBEYXRlKHN1bmRheS5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZCk7XG4gIG5leHRTdW5kYXkgPSBuZXcgRGF0ZShuZXh0TW9uZGF5LmdldFRpbWUoKSArIChtaWxsaXNlY29uZCAqIDYpKTtcbiAgY3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgcHJldmlvdXNZZWFyID0gY3VycmVudFllYXIgLSAxO1xuICBuZXh0WWVhciA9IGN1cnJlbnRZZWFyICsgMTtcbiAgY3VycmVudE1vbnRoID0gbm93LmdldE1vbnRoKCk7XG4gIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgbW9udGggPSBub3cuZ2V0TW9udGgoKTtcbiAgZmlyc3REYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoLCAxKTtcbiAgaWYgKGN1cnJlbnRNb250aCA9PT0gMTEpIHtcbiAgICB5ZWFyKys7XG4gICAgbW9udGgrKztcbiAgfSBlbHNlIHtcbiAgICBtb250aCsrO1xuICB9XG4gIG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICBuZXh0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCBDcmVhdG9yLmdldE1vbnRoRGF5cyh5ZWFyLCBtb250aCkpO1xuICBsYXN0RGF5ID0gbmV3IERhdGUobmV4dE1vbnRoRmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICBsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIGxhc3RNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoZmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICB0aGlzUXVhcnRlclN0YXJ0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSwgMSk7XG4gIHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkgKyAyKSk7XG4gIGxhc3RRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIGxhc3RRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIpKTtcbiAgbmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbmV4dFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMikpO1xuICBsYXN0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMjkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDU5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg4OSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgyOSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDg5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTE5ICogbWlsbGlzZWNvbmQpKTtcbiAgc3dpdGNoIChrZXkpIHtcbiAgICBjYXNlIFwibGFzdF95ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUocHJldmlvdXNZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShwcmV2aW91c1llYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc195ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoY3VycmVudFllYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF95ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKG5leHRZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShuZXh0WWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF9xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChuZXh0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChsYXN0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChuZXh0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3Rfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KGxhc3RNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQobGFzdFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3Rfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChtb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQoc3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc193ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KG5leHRNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ5ZXN0ZGF5XCI6XG4gICAgICBzdHJZZXN0ZGF5ID0gbW9tZW50KHllc3RkYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl95ZXN0ZGF5XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clllc3RkYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clllc3RkYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidG9kYXlcIjpcbiAgICAgIHN0clRvZGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvZGF5XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJUb2RheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0b21vcnJvd1wiOlxuICAgICAgc3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b21vcnJvd1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJUb21vcnJvdyArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyVG9tb3Jyb3cgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF83X2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfN19kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF8zMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8zMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF82MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF82MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF85MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF85MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF8xMjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF83X2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfN19kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF8zMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8zMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF82MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF82MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF85MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF85MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF8xMjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzEyMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gIH1cbiAgdmFsdWVzID0gW3N0YXJ0VmFsdWUsIGVuZFZhbHVlXTtcbiAgaWYgKGZpZWxkX3R5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgIF8uZm9yRWFjaCh2YWx1ZXMsIGZ1bmN0aW9uKGZ2KSB7XG4gICAgICBpZiAoZnYpIHtcbiAgICAgICAgcmV0dXJuIGZ2LnNldEhvdXJzKGZ2LmdldEhvdXJzKCkgKyBmdi5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgbGFiZWw6IGxhYmVsLFxuICAgIGtleToga2V5LFxuICAgIHZhbHVlczogdmFsdWVzXG4gIH07XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgaWYgKGZpZWxkX3R5cGUgJiYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gJ2JldHdlZW4nO1xuICB9IGVsc2UgaWYgKFtcInRleHRhcmVhXCIsIFwidGV4dFwiLCBcImNvZGVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gJ2NvbnRhaW5zJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXCI9XCI7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRPcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIHZhciBvcGVyYXRpb25zLCBvcHRpb25hbHM7XG4gIG9wdGlvbmFscyA9IHtcbiAgICBlcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI9XCJcbiAgICB9LFxuICAgIHVuZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3VuZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI8PlwiXG4gICAgfSxcbiAgICBsZXNzX3RoYW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3NfdGhhblwiKSxcbiAgICAgIHZhbHVlOiBcIjxcIlxuICAgIH0sXG4gICAgZ3JlYXRlcl90aGFuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX3RoYW5cIiksXG4gICAgICB2YWx1ZTogXCI+XCJcbiAgICB9LFxuICAgIGxlc3Nfb3JfZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3Nfb3JfZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI8PVwiXG4gICAgfSxcbiAgICBncmVhdGVyX29yX2VxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX29yX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPj1cIlxuICAgIH0sXG4gICAgY29udGFpbnM6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2NvbnRhaW5zXCIpLFxuICAgICAgdmFsdWU6IFwiY29udGFpbnNcIlxuICAgIH0sXG4gICAgbm90X2NvbnRhaW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2RvZXNfbm90X2NvbnRhaW5cIiksXG4gICAgICB2YWx1ZTogXCJub3Rjb250YWluc1wiXG4gICAgfSxcbiAgICBzdGFydHNfd2l0aDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fc3RhcnRzX3dpdGhcIiksXG4gICAgICB2YWx1ZTogXCJzdGFydHN3aXRoXCJcbiAgICB9LFxuICAgIGJldHdlZW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5cIiksXG4gICAgICB2YWx1ZTogXCJiZXR3ZWVuXCJcbiAgICB9XG4gIH07XG4gIGlmIChmaWVsZF90eXBlID09PSB2b2lkIDApIHtcbiAgICByZXR1cm4gXy52YWx1ZXMob3B0aW9uYWxzKTtcbiAgfVxuICBvcGVyYXRpb25zID0gW107XG4gIGlmIChDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKSkge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuYmV0d2Vlbik7XG4gICAgQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMoZmllbGRfdHlwZSwgb3BlcmF0aW9ucyk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZmllbGRfdHlwZSA9PT0gXCJ0ZXh0YXJlYVwiIHx8IGZpZWxkX3R5cGUgPT09IFwiaHRtbFwiIHx8IGZpZWxkX3R5cGUgPT09IFwiY29kZVwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5jb250YWlucyk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmaWVsZF90eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCBmaWVsZF90eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiY3VycmVuY3lcIiB8fCBmaWVsZF90eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5sZXNzX3RoYW4sIG9wdGlvbmFscy5ncmVhdGVyX3RoYW4sIG9wdGlvbmFscy5sZXNzX29yX2VxdWFsLCBvcHRpb25hbHMuZ3JlYXRlcl9vcl9lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiW3RleHRdXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9XG4gIHJldHVybiBvcGVyYXRpb25zO1xufTtcblxuXG4vKlxuICAgIOWFiOaMieeFp+acieaOkuW6j+WPt+eahOWwj+eahOWcqOWJje+8jOWkp+eahOWcqOWQjlxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBmaWVsZHMsIGZpZWxkc0FyciwgZmllbGRzTmFtZSwgcmVmO1xuICBmaWVsZHMgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMDtcbiAgZmllbGRzQXJyID0gW107XG4gIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkc0Fyci5wdXNoKHtcbiAgICAgIG5hbWU6IGZpZWxkLm5hbWUsXG4gICAgICBzb3J0X25vOiBmaWVsZC5zb3J0X25vXG4gICAgfSk7XG4gIH0pO1xuICBmaWVsZHNOYW1lID0gW107XG4gIF8uZWFjaChfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGRzTmFtZS5wdXNoKGZpZWxkLm5hbWUpO1xuICB9KTtcbiAgcmV0dXJuIGZpZWxkc05hbWU7XG59O1xuIiwiQ3JlYXRvci5fdHJpZ2dlcl9ob29rcyA9IHt9XG5cbmluaXRUcmlnZ2VyID0gKG9iamVjdF9uYW1lLCB0cmlnZ2VyKS0+XG5cdHRyeVxuXHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpXG5cdFx0aWYgIXRyaWdnZXIudG9kb1xuXHRcdFx0cmV0dXJuXG5cdFx0dG9kb1dyYXBwZXIgPSAoKS0+XG5cdFx0XHQgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZVxuXHRcdFx0ICByZXR1cm4gdHJpZ2dlci50b2RvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcblx0XHRpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUuaW5zZXJ0XCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8uaW5zZXJ0KHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUudXBkYXRlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8udXBkYXRlKHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUucmVtb3ZlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8ucmVtb3ZlKHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci5pbnNlcnRcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYWZ0ZXI/Lmluc2VydCh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIudXBkYXRlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmFmdGVyPy51cGRhdGUodG9kb1dyYXBwZXIpXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLnJlbW92ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5hZnRlcj8ucmVtb3ZlKHRvZG9XcmFwcGVyKVxuXHRjYXRjaCBlcnJvclxuXHRcdGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpXG5cbmNsZWFuVHJpZ2dlciA9IChvYmplY3RfbmFtZSktPlxuXHQjIyNcbiAgICBcdOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbDmmK/kvb/nlKjkuIvmoIfliKDpmaTlr7nosaHnmoTvvIzmiYDku6XmraTlpITlj43ovaxob29rc+mbhuWQiOWQju+8jOWGjeWIoOmZpFxuICAgIFx05Zug5Li65LiA5Liq5pWw57uE5YWD57Sg5Yig6Zmk5ZCO77yM5YW25LuW5YWD57Sg55qE5LiL5qCH5Lya5Y+R55Sf5Y+Y5YyWXG5cdCMjI1xuICAgICNUT0RPIOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbBidWdcblx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0/LnJldmVyc2UoKS5mb3JFYWNoIChfaG9vayktPlxuXHRcdF9ob29rLnJlbW92ZSgpXG5cbkNyZWF0b3IuaW5pdFRyaWdnZXJzID0gKG9iamVjdF9uYW1lKS0+XG4jXHRjb25zb2xlLmxvZygnQ3JlYXRvci5pbml0VHJpZ2dlcnMgb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSlcblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0Y2xlYW5UcmlnZ2VyKG9iamVjdF9uYW1lKVxuXG5cdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdID0gW11cblxuXHRfLmVhY2ggb2JqLnRyaWdnZXJzLCAodHJpZ2dlciwgdHJpZ2dlcl9uYW1lKS0+XG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyIGFuZCB0cmlnZ2VyLm9uID09IFwic2VydmVyXCIgYW5kIHRyaWdnZXIudG9kbyBhbmQgdHJpZ2dlci53aGVuXG5cdFx0XHRfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIgb2JqZWN0X25hbWUsIHRyaWdnZXJcblx0XHRcdGlmIF90cmlnZ2VyX2hvb2tcblx0XHRcdFx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudCBhbmQgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxuXHRcdFx0X3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyIG9iamVjdF9uYW1lLCB0cmlnZ2VyXG5cdFx0XHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spIiwidmFyIGNsZWFuVHJpZ2dlciwgaW5pdFRyaWdnZXI7XG5cbkNyZWF0b3IuX3RyaWdnZXJfaG9va3MgPSB7fTtcblxuaW5pdFRyaWdnZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgdHJpZ2dlcikge1xuICB2YXIgY29sbGVjdGlvbiwgZXJyb3IsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVmNSwgdG9kb1dyYXBwZXI7XG4gIHRyeSB7XG4gICAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSk7XG4gICAgaWYgKCF0cmlnZ2VyLnRvZG8pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdG9kb1dyYXBwZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZTtcbiAgICAgIHJldHVybiB0cmlnZ2VyLnRvZG8uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLmluc2VydFwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZiA9IGNvbGxlY3Rpb24uYmVmb3JlKSAhPSBudWxsID8gcmVmLmluc2VydCh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLnVwZGF0ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjEgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZjEudXBkYXRlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJiZWZvcmUucmVtb3ZlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmMiA9IGNvbGxlY3Rpb24uYmVmb3JlKSAhPSBudWxsID8gcmVmMi5yZW1vdmUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLmluc2VydFwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjMgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmMy5pbnNlcnQodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLnVwZGF0ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjQgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmNC51cGRhdGUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLnJlbW92ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjUgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmNS5yZW1vdmUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpO1xuICB9XG59O1xuXG5jbGVhblRyaWdnZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuXG4gIC8qXG4gICAgIFx055Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsOaYr+S9v+eUqOS4i+agh+WIoOmZpOWvueixoeeahO+8jOaJgOS7peatpOWkhOWPjei9rGhvb2tz6ZuG5ZCI5ZCO77yM5YaN5Yig6ZmkXG4gICAgIFx05Zug5Li65LiA5Liq5pWw57uE5YWD57Sg5Yig6Zmk5ZCO77yM5YW25LuW5YWD57Sg55qE5LiL5qCH5Lya5Y+R55Sf5Y+Y5YyWXG4gICAqL1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdKSAhPSBudWxsID8gcmVmLnJldmVyc2UoKS5mb3JFYWNoKGZ1bmN0aW9uKF9ob29rKSB7XG4gICAgcmV0dXJuIF9ob29rLnJlbW92ZSgpO1xuICB9KSA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuaW5pdFRyaWdnZXJzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIG9iajtcbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjbGVhblRyaWdnZXIob2JqZWN0X25hbWUpO1xuICBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdO1xuICByZXR1cm4gXy5lYWNoKG9iai50cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlciwgdHJpZ2dlcl9uYW1lKSB7XG4gICAgdmFyIF90cmlnZ2VyX2hvb2s7XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcInNlcnZlclwiICYmIHRyaWdnZXIudG9kbyAmJiB0cmlnZ2VyLndoZW4pIHtcbiAgICAgIF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlcihvYmplY3RfbmFtZSwgdHJpZ2dlcik7XG4gICAgICBpZiAoX3RyaWdnZXJfaG9vaykge1xuICAgICAgICBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIgJiYgdHJpZ2dlci50b2RvICYmIHRyaWdnZXIud2hlbikge1xuICAgICAgX3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyKG9iamVjdF9uYW1lLCB0cmlnZ2VyKTtcbiAgICAgIHJldHVybiBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpXG5cbkNyZWF0b3IuZ2V0UGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdGlmICFvYmpcblx0XHRcdHJldHVyblxuXHRcdHJldHVybiBvYmoucGVybWlzc2lvbnMuZ2V0KClcblx0ZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cbkNyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUsIHJlY29yZCwgdXNlcklkLCBzcGFjZUlkKS0+XG5cdGlmICFvYmplY3RfbmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0aWYgIXNwYWNlSWQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XG5cdGlmIHJlY29yZCBhbmQgb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIiBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0IyDlpoLmnpzmmK9jbXNfZmlsZXPpmYTku7bvvIzliJnmnYPpmZDlj5blhbbniLborrDlvZXmnYPpmZBcblx0XHRpZiBvYmplY3RfbmFtZSA9PSBTZXNzaW9uLmdldCgnb2JqZWN0X25hbWUnKVxuXHRcdFx0IyDlvZPliY3lpITkuo5jbXNfZmlsZXPpmYTku7bor6bnu4bnlYzpnaJcblx0XHRcdG9iamVjdF9uYW1lID0gcmVjb3JkLnBhcmVudFsncmVmZXJlbmNlX3RvLl9vJ107XG5cdFx0XHRyZWNvcmRfaWQgPSByZWNvcmQucGFyZW50Ll9pZDtcblx0XHRlbHNlIFxuXHRcdFx0IyDlvZPliY3lpITkuo5jbXNfZmlsZXPpmYTku7bnmoTniLborrDlvZXnlYzpnaJcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJyk7XG5cdFx0XHRyZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcblx0XHRvYmplY3RfZmllbGRzX2tleXMgPSBfLmtleXMoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpPy5maWVsZHMgb3Ige30pIHx8IFtdO1xuXHRcdHNlbGVjdCA9IF8uaW50ZXJzZWN0aW9uKG9iamVjdF9maWVsZHNfa2V5cywgWydvd25lcicsICdjb21wYW55X2lkJywgJ2NvbXBhbnlfaWRzJywgJ2xvY2tlZCddKSB8fCBbXTtcblx0XHRpZiBzZWxlY3QubGVuZ3RoID4gMFxuXHRcdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0LmpvaW4oJywnKSk7XG5cdFx0ZWxzZVxuXHRcdFx0cmVjb3JkID0gbnVsbDtcblxuXHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUoQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSlcblxuXHRpZiByZWNvcmRcblx0XHRpZiByZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zXG5cdFx0XHRyZXR1cm4gcmVjb3JkLnJlY29yZF9wZXJtaXNzaW9uc1xuXG5cdFx0aXNPd25lciA9IHJlY29yZC5vd25lciA9PSB1c2VySWQgfHwgcmVjb3JkLm93bmVyPy5faWQgPT0gdXNlcklkXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHR1c2VyX2NvbXBhbnlfaWRzID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpXG5cdFx0ZWxzZVxuXHRcdFx0dXNlcl9jb21wYW55X2lkcyA9IENyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHModXNlcklkLCBzcGFjZUlkKVxuXHRcdHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkPy5jb21wYW55X2lkXG5cdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWQgYW5kIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWQpIGFuZCByZWNvcmRfY29tcGFueV9pZC5faWRcblx0XHRcdCMg5ZugcmVjb3JkX2NvbXBhbnlfaWTmmK9sb29rdXDnsbvlnovvvIzmnInlj6/og71keOaOp+S7tuS8muaKiuWug+aYoOWwhOi9rOS4uuWvueW6lOeahG9iamVjdO+8jOaJgOS7pei/memHjOWPluWHuuWFtl9pZOWAvFxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmRfY29tcGFueV9pZC5faWRcblx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmQ/LmNvbXBhbnlfaWRzXG5cdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoIGFuZCBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkc1swXSlcblx0XHRcdCMg5ZugcmVjb3JkX2NvbXBhbnlfaWRz5pivbG9va3Vw57G75Z6L77yM5pyJ5Y+v6IO9ZHjmjqfku7bkvJrmiorlroPmmKDlsITovazkuLrlr7nlupTnmoRbb2JqZWN0Xe+8jOaJgOS7pei/memHjOWPluWHuuWFtl9pZOWAvFxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkX2NvbXBhbnlfaWRzLm1hcCgobiktPiBuLl9pZClcblx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSBfLnVuaW9uKHJlY29yZF9jb21wYW55X2lkcywgW3JlY29yZF9jb21wYW55X2lkXSlcblx0XHRpZiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBhbmQgIWlzT3duZXIgYW5kICFwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRlbHNlIGlmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdGlmIHVzZXJfY29tcGFueV9pZHMgYW5kIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0aWYgIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoXG5cdFx0XHRcdFx0XHQjIOiusOW9leeahGNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfkuI3lnKjlvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz6IyD5Zu05YaF5pe277yM6K6k5Li65peg5p2D5L+u5pS5XG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0IyDorrDlvZXmnIljb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn77yM5L2G5piv5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+S4uuepuuaXtu+8jOiupOS4uuaXoOadg+S/ruaUuVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFxuXHRcdGlmIHJlY29yZC5sb2NrZWQgYW5kICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXG5cdFx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCAhaXNPd25lciBhbmQgIXBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2Vcblx0XHRlbHNlIGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRpZiByZWNvcmRfY29tcGFueV9pZHMgYW5kIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGhcblx0XHRcdFx0aWYgdXNlcl9jb21wYW55X2lkcyBhbmQgdXNlcl9jb21wYW55X2lkcy5sZW5ndGhcblx0XHRcdFx0XHRpZiAhXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGhcblx0XHRcdFx0XHRcdCMg6K6w5b2V55qEY29tcGFueV9pZC9jb21wYW55X2lkc+WxnuaAp+S4jeWcqOW9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPojIPlm7TlhoXml7bvvIzorqTkuLrml6DmnYPmn6XnnItcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQjIOiusOW9leaciWNvbXBhbnlfaWTlsZ7mgKfvvIzkvYbmmK/lvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz5Li656m65pe277yM6K6k5Li65peg5p2D5p+l55yLXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2VcblxuXHRyZXR1cm4gcGVybWlzc2lvbnNcblxuXG4jIGN1cnJlbnRPYmplY3ROYW1l77ya5b2T5YmN5Li75a+56LGhXG4jIHJlbGF0ZWRMaXN0SXRlbe+8mkNyZWF0b3IuZ2V0UmVsYXRlZExpc3QoU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSwgU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikp5Lit5Y+WcmVsYXRlZF9vYmplY3RfbmFtZeWvueW6lOeahOWAvFxuIyBjdXJyZW50UmVjb3Jk5b2T5YmN5Li75a+56LGh55qE6K+m57uG6K6w5b2VXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0Q3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zID0gKGN1cnJlbnRPYmplY3ROYW1lLCByZWxhdGVkTGlzdEl0ZW0sIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCktPlxuXHRcdGlmICFjdXJyZW50T2JqZWN0TmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRjdXJyZW50T2JqZWN0TmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRcdGlmICFyZWxhdGVkTGlzdEl0ZW1cblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJyZWxhdGVkTGlzdEl0ZW0gbXVzdCBub3QgYmUgZW1wdHkgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnNcIik7XG5cdFx0XHRyZXR1cm4ge31cblxuXHRcdGlmICFjdXJyZW50UmVjb3JkIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGN1cnJlbnRSZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpXG5cblx0XHRpZiAhdXNlcklkIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXG5cdFx0aWYgIXNwYWNlSWQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXG5cdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSByZWxhdGVkTGlzdEl0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgfHwgZmFsc2Vcblx0XHRtYXN0ZXJBbGxvdyA9IGZhbHNlXG5cdFx0bWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMoY3VycmVudE9iamVjdE5hbWUsIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZClcblx0XHRpZiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9PSB0cnVlXG5cdFx0XHRtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkXG5cdFx0ZWxzZSBpZiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9PSBmYWxzZVxuXHRcdFx0bWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdFxuXG5cdFx0dW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBDcmVhdG9yLmdldFJlY29yZFNhZmVSZWxhdGVkTGlzdChjdXJyZW50UmVjb3JkLCBjdXJyZW50T2JqZWN0TmFtZSlcblx0XHRyZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSlcblx0XHRpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUgPSB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdC5pbmRleE9mKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSkgPiAtMVxuXG5cdFx0cmVzdWx0ID0gXy5jbG9uZSByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnNcblx0XHRyZXN1bHQuYWxsb3dDcmVhdGUgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZVxuXHRcdHJlc3VsdC5hbGxvd0VkaXQgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGVcblx0XHRyZXR1cm4gcmVzdWx0XG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXG5cdENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMgPSAoc3BhY2VJZCwgdXNlcklkKSAtPlxuXHRcdHBlcm1pc3Npb25zID1cblx0XHRcdG9iamVjdHM6IHt9XG5cdFx0XHRhc3NpZ25lZF9hcHBzOiBbXVxuXHRcdCMjI1xuXHRcdOadg+mZkOmbhuivtOaYjjpcblx0XHTlhoXnva7mnYPpmZDpm4YtYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3Qsd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWluXG5cdFx06Ieq5a6a5LmJ5p2D6ZmQ6ZuGLeaVsOaNruW6k+S4reaWsOW7uueahOmZpOWGhee9ruadg+mZkOmbhuS7peWklueahOWFtuS7luadg+mZkOmbhlxuXHRcdOeJueWumueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5LiN5Y+v6YWN572u77yJLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0XG5cdFx05Y+v6YWN572u55So5oi36ZuG5ZCI5p2D6ZmQ6ZuG77yI5Y2zdXNlcnPlsZ7mgKflj6/phY3nva7vvIktd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWlu5Lul5Y+K6Ieq5a6a5LmJ5p2D6ZmQ6ZuGXG5cdFx0IyMjXG5cblx0XHRpc1NwYWNlQWRtaW4gPSBmYWxzZVxuXHRcdHNwYWNlVXNlciA9IG51bGxcblx0XHRpZiB1c2VySWRcblx0XHRcdGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblx0XHRcdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXG5cdFx0cHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzTWVtYmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNHdWVzdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cblx0XHRwc2V0c1N1cHBsaWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRwc2V0c0N1c3RvbWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCAkb3I6IFt7dXNlcnM6IHVzZXJJZH0sIHtuYW1lOiBzcGFjZVVzZXIucHJvZmlsZX1dfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRlbHNlXG5cdFx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cblx0XHRwc2V0c0FkbWluX3BvcyA9IG51bGxcblx0XHRwc2V0c1VzZXJfcG9zID0gbnVsbFxuXHRcdHBzZXRzTWVtYmVyX3BvcyA9IG51bGxcblx0XHRwc2V0c0d1ZXN0X3BvcyA9IG51bGxcblx0XHRwc2V0c0N1cnJlbnRfcG9zID0gbnVsbFxuXHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gbnVsbFxuXHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gbnVsbFxuXG5cdFx0aWYgcHNldHNBZG1pbj8uX2lkXG5cdFx0XHRwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c1VzZXI/Ll9pZFxuXHRcdFx0cHNldHNVc2VyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzTWVtYmVyPy5faWRcblx0XHRcdHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNHdWVzdD8uX2lkXG5cdFx0XHRwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c1N1cHBsaWVyPy5faWRcblx0XHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c1N1cHBsaWVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzQ3VzdG9tZXI/Ll9pZFxuXHRcdFx0cHNldHNDdXN0b21lcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQ3VzdG9tZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cblx0XHRpZiBwc2V0c0N1cnJlbnQubGVuZ3RoID4gMFxuXHRcdFx0c2V0X2lkcyA9IF8ucGx1Y2sgcHNldHNDdXJyZW50LCBcIl9pZFwiXG5cdFx0XHRwc2V0c0N1cnJlbnRfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiB7JGluOiBzZXRfaWRzfX0pLmZldGNoKClcblx0XHRcdHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwibmFtZVwiXG5cblx0XHRwc2V0cyA9IHtcblx0XHRcdHBzZXRzQWRtaW4sIFxuXHRcdFx0cHNldHNVc2VyLCBcblx0XHRcdHBzZXRzQ3VycmVudCwgXG5cdFx0XHRwc2V0c01lbWJlciwgXG5cdFx0XHRwc2V0c0d1ZXN0LFxuXHRcdFx0cHNldHNTdXBwbGllcixcblx0XHRcdHBzZXRzQ3VzdG9tZXIsXG5cdFx0XHRpc1NwYWNlQWRtaW4sXG5cdFx0XHRzcGFjZVVzZXIsIFxuXHRcdFx0cHNldHNBZG1pbl9wb3MsIFxuXHRcdFx0cHNldHNVc2VyX3BvcywgXG5cdFx0XHRwc2V0c01lbWJlcl9wb3MsIFxuXHRcdFx0cHNldHNHdWVzdF9wb3MsXG5cdFx0XHRwc2V0c1N1cHBsaWVyX3Bvcyxcblx0XHRcdHBzZXRzQ3VzdG9tZXJfcG9zLFxuXHRcdFx0cHNldHNDdXJyZW50X3Bvc1xuXHRcdH1cblx0XHRwZXJtaXNzaW9ucy5hc3NpZ25lZF9hcHBzID0gQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKVxuXHRcdHBlcm1pc3Npb25zLmFzc2lnbmVkX21lbnVzID0gQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZClcblx0XHRwZXJtaXNzaW9ucy51c2VyX3Blcm1pc3Npb25fc2V0cyA9IHBzZXRzQ3VycmVudE5hbWVzXG5cdFx0X2kgPSAwXG5cdFx0Xy5lYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG9iamVjdCwgb2JqZWN0X25hbWUpLT5cblx0XHRcdF9pKytcblx0XHRcdGlmICFfLmhhcyhvYmplY3QsICdzcGFjZScpIHx8ICFvYmplY3Quc3BhY2UgfHwgb2JqZWN0LnNwYWNlID09IHNwYWNlSWRcblx0XHRcdFx0aWYgIV8uaGFzKG9iamVjdCwgJ2luX2RldmVsb3BtZW50JykgfHwgb2JqZWN0LmluX2RldmVsb3BtZW50ID09ICcwJyB8fCAob2JqZWN0LmluX2RldmVsb3BtZW50ICE9ICcwJyAmJiBpc1NwYWNlQWRtaW4pXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV0gPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUoQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSksIHNwYWNlSWQpXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV1bXCJwZXJtaXNzaW9uc1wiXSA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHRyZXR1cm4gcGVybWlzc2lvbnNcblxuXHR1bmlvblBsdXMgPSAoYXJyYXksIG90aGVyKSAtPlxuXHRcdGlmICFhcnJheSBhbmQgIW90aGVyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkXG5cdFx0aWYgIWFycmF5XG5cdFx0XHRhcnJheSA9IFtdXG5cdFx0aWYgIW90aGVyXG5cdFx0XHRvdGhlciA9IFtdXG5cdFx0cmV0dXJuIF8udW5pb24oYXJyYXksIG90aGVyKVxuXG5cdGludGVyc2VjdGlvblBsdXMgPSAoYXJyYXksIG90aGVyKSAtPlxuXHRcdGlmICFhcnJheSBhbmQgIW90aGVyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkXG5cdFx0aWYgIWFycmF5XG5cdFx0XHRhcnJheSA9IFtdXG5cdFx0aWYgIW90aGVyXG5cdFx0XHRvdGhlciA9IFtdXG5cdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKGFycmF5LCBvdGhlcilcblxuXHRDcmVhdG9yLmdldEFzc2lnbmVkQXBwcyA9IChzcGFjZUlkLCB1c2VySWQpLT5cblx0XHRwc2V0c0FkbWluID0gdGhpcy5wc2V0c0FkbWluIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHBzZXRzVXNlciA9IHRoaXMucHNldHNVc2VyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0cHNldHNTdXBwbGllciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0cHNldHNDdXN0b21lciA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2N1c3RvbWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHQjIHBzZXRzTWVtYmVyID0gdGhpcy5wc2V0c01lbWJlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ21lbWJlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0IyBwc2V0c0d1ZXN0ID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHNwYWNlVXNlciA9IG51bGw7XG5cdFx0aWYgdXNlcklkXG5cdFx0XHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcblx0XHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7c3BhY2U6IHNwYWNlSWQsICRvcjogW3t1c2VyczogdXNlcklkfSwge25hbWU6IHNwYWNlVXNlci5wcm9maWxlfV19LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGVsc2Vcblx0XHRcdHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxuXHRcdGFwcHMgPSBbXVxuXHRcdGlmIGlzU3BhY2VBZG1pblxuXHRcdFx0cmV0dXJuIFtdXG5cdFx0ZWxzZVxuXHRcdFx0dXNlclByb2ZpbGUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSk/LnByb2ZpbGVcblx0XHRcdHBzZXRCYXNlID0gcHNldHNVc2VyXG5cdFx0XHRpZiB1c2VyUHJvZmlsZVxuXHRcdFx0XHRpZiB1c2VyUHJvZmlsZSA9PSAnc3VwcGxpZXInXG5cdFx0XHRcdFx0cHNldEJhc2UgPSBwc2V0c1N1cHBsaWVyXG5cdFx0XHRcdGVsc2UgaWYgdXNlclByb2ZpbGUgPT0gJ2N1c3RvbWVyJ1xuXHRcdFx0XHRcdHBzZXRCYXNlID0gcHNldHNDdXN0b21lclxuXHRcdFx0aWYgcHNldEJhc2U/LmFzc2lnbmVkX2FwcHM/Lmxlbmd0aFxuXHRcdFx0XHRhcHBzID0gXy51bmlvbiBhcHBzLCBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCMgdXNlcuadg+mZkOmbhuS4reeahGFzc2lnbmVkX2FwcHPooajnpLrmiYDmnInnlKjmiLflhbfmnInnmoRhcHBz5p2D6ZmQ77yM5Li656m65YiZ6KGo56S65pyJ5omA5pyJYXBwc+adg+mZkO+8jOS4jemcgOimgeS9nOadg+mZkOWIpOaWreS6hlxuXHRcdFx0XHRyZXR1cm4gW11cblx0XHRcdF8uZWFjaCBwc2V0cywgKHBzZXQpLT5cblx0XHRcdFx0aWYgIXBzZXQuYXNzaWduZWRfYXBwc1xuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRpZiBwc2V0Lm5hbWUgPT0gXCJhZG1pblwiIHx8ICBwc2V0Lm5hbWUgPT0gXCJ1c2VyXCIgfHwgcHNldC5uYW1lID09ICdzdXBwbGllcicgfHwgcHNldC5uYW1lID09ICdjdXN0b21lcidcblx0XHRcdFx0XHQjIOi/memHjOS5i+aJgOS7peimgeaOkumZpGFkbWluL3VzZXLvvIzmmK/lm6DkuLrov5nkuKTkuKrmnYPpmZDpm4bmmK/miYDmnInmnYPpmZDpm4bkuK11c2Vyc+WxnuaAp+aXoOaViOeahOadg+mZkOmbhu+8jOeJueaMh+W3peS9nOWMuueuoeeQhuWRmOWSjOaJgOacieeUqOaIt1xuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRhcHBzID0gXy51bmlvbiBhcHBzLCBwc2V0LmFzc2lnbmVkX2FwcHNcblx0XHRcdHJldHVybiBfLndpdGhvdXQoXy51bmlxKGFwcHMpLHVuZGVmaW5lZCxudWxsKVxuXG5cdENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cyA9IChzcGFjZUlkLCB1c2VySWQpLT5cblx0XHRwc2V0cyA9ICB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cdFx0YWRtaW5NZW51cyA9IENyZWF0b3IuQXBwcy5hZG1pbj8uYWRtaW5fbWVudXNcblx0XHQjIOWmguaenOayoeaciWFkbWlu6I+c5Y2V6K+05piO5LiN6ZyA6KaB55u45YWz5Yqf6IO977yM55u05o6l6L+U5Zue56m6XG5cdFx0dW5sZXNzIGFkbWluTWVudXNcblx0XHRcdHJldHVybiBbXVxuXHRcdGFib3V0TWVudSA9IGFkbWluTWVudXMuZmluZCAobikgLT5cblx0XHRcdG4uX2lkID09ICdhYm91dCdcblx0XHRhZG1pbk1lbnVzID0gYWRtaW5NZW51cy5maWx0ZXIgKG4pIC0+XG5cdFx0XHRuLl9pZCAhPSAnYWJvdXQnXG5cdFx0b3RoZXJNZW51QXBwcyA9IF8uc29ydEJ5IF8uZmlsdGVyKF8udmFsdWVzKENyZWF0b3IuQXBwcyksIChuKSAtPlxuXHRcdFx0cmV0dXJuIG4uYWRtaW5fbWVudXMgYW5kIG4uX2lkICE9ICdhZG1pbidcblx0XHQpLCAnc29ydCdcblx0XHRvdGhlck1lbnVzID0gXy5mbGF0dGVuKF8ucGx1Y2sob3RoZXJNZW51QXBwcywgXCJhZG1pbl9tZW51c1wiKSlcblx0XHQjIOiPnOWNleacieS4iemDqOWIhue7hOaIkO+8jOiuvue9rkFQUOiPnOWNleOAgeWFtuS7lkFQUOiPnOWNleS7peWPimFib3V06I+c5Y2VXG5cdFx0YWxsTWVudXMgPSBfLnVuaW9uKGFkbWluTWVudXMsIG90aGVyTWVudXMsIFthYm91dE1lbnVdKVxuXHRcdGlmIGlzU3BhY2VBZG1pblxuXHRcdFx0IyDlt6XkvZzljLrnrqHnkIblkZjmnInlhajpg6joj5zljZXlip/og71cblx0XHRcdHJlc3VsdCA9IGFsbE1lbnVzXG5cdFx0ZWxzZVxuXHRcdFx0dXNlclByb2ZpbGUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSk/LnByb2ZpbGUgfHwgJ3VzZXInXG5cdFx0XHRjdXJyZW50UHNldE5hbWVzID0gcHNldHMubWFwIChuKSAtPlxuXHRcdFx0XHRyZXR1cm4gbi5uYW1lXG5cdFx0XHRtZW51cyA9IGFsbE1lbnVzLmZpbHRlciAobWVudSktPlxuXHRcdFx0XHRwc2V0c01lbnUgPSBtZW51LnBlcm1pc3Npb25fc2V0c1xuXHRcdFx0XHQjIOWmguaenOaZrumAmueUqOaIt+acieadg+mZkO+8jOWImeebtOaOpei/lOWbnnRydWVcblx0XHRcdFx0aWYgcHNldHNNZW51ICYmIHBzZXRzTWVudS5pbmRleE9mKHVzZXJQcm9maWxlKSA+IC0xXG5cdFx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdFx0IyDlkKbliJnlj5blvZPliY3nlKjmiLfnmoTmnYPpmZDpm4bkuI5tZW516I+c5Y2V6KaB5rGC55qE5p2D6ZmQ6ZuG5a+55q+U77yM5aaC5p6c5Lqk6ZuG5aSn5LqOMeS4quWImei/lOWbnnRydWVcblx0XHRcdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKGN1cnJlbnRQc2V0TmFtZXMsIHBzZXRzTWVudSkubGVuZ3RoXG5cdFx0XHRyZXN1bHQgPSBtZW51c1xuXHRcdFxuXHRcdHJldHVybiBfLnNvcnRCeShyZXN1bHQsXCJzb3J0XCIpXG5cblx0ZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCA9IChwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZCktPlxuXG5cdFx0aWYgXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKVxuXHRcdFx0cmV0dXJuIG51bGxcblx0XHRpZiBfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKVxuXHRcdFx0cmV0dXJuIF8uZmluZCBwZXJtaXNzaW9uX29iamVjdHMsIChwbyktPlxuXHRcdFx0XHRcdHJldHVybiBwby5vYmplY3RfbmFtZSA9PSBvYmplY3RfbmFtZVxuXHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZDogcGVybWlzc2lvbl9zZXRfaWR9KVxuXG5cdGZpbmRfcGVybWlzc2lvbl9vYmplY3QgPSAocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWRzKS0+XG5cdFx0aWYgXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKVxuXHRcdFx0cmV0dXJuIG51bGxcblx0XHRpZiBfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKVxuXHRcdFx0cmV0dXJuIF8uZmlsdGVyIHBlcm1pc3Npb25fb2JqZWN0cywgKHBvKS0+XG5cdFx0XHRcdHJldHVybiBwby5vYmplY3RfbmFtZSA9PSBvYmplY3RfbmFtZVxuXHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkOiB7JGluOiBwZXJtaXNzaW9uX3NldF9pZHN9fSkuZmV0Y2goKVxuXG5cdHVuaW9uUGVybWlzc2lvbk9iamVjdHMgPSAocG9zLCBvYmplY3QsIHBzZXRzKS0+XG5cdFx0IyDmiopkYuWPinltbOS4reeahHBlcm1pc3Npb25fb2JqZWN0c+WQiOW5tu+8jOS8mOWFiOWPlmRi5Lit55qEXG5cdFx0cmVzdWx0ID0gW11cblx0XHRfLmVhY2ggb2JqZWN0LnBlcm1pc3Npb25fc2V0LCAob3BzLCBvcHNfa2V5KS0+XG5cdFx0XHQjIOaKinltbOS4remZpOS6hueJueWumueUqOaIt+mbhuWQiOadg+mZkOmbhlwiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIuWklueahOWFtuS7luWvueixoeadg+mZkOWFiOWtmOWFpXJlc3VsdFxuXHRcdFx0IyBpZiBbXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwiLCBcIndvcmtmbG93X2FkbWluXCIsIFwib3JnYW5pemF0aW9uX2FkbWluXCJdLmluZGV4T2Yob3BzX2tleSkgPCAwXG5cdFx0XHRpZiBbXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwiXS5pbmRleE9mKG9wc19rZXkpIDwgMFxuXHRcdFx0XHRjdXJyZW50UHNldCA9IHBzZXRzLmZpbmQgKHBzZXQpLT4gcmV0dXJuIHBzZXQubmFtZSA9PSBvcHNfa2V5XG5cdFx0XHRcdGlmIGN1cnJlbnRQc2V0XG5cdFx0XHRcdFx0dGVtcE9wcyA9IF8uY2xvbmUob3BzKSB8fCB7fVxuXHRcdFx0XHRcdHRlbXBPcHMucGVybWlzc2lvbl9zZXRfaWQgPSBjdXJyZW50UHNldC5faWRcblx0XHRcdFx0XHR0ZW1wT3BzLm9iamVjdF9uYW1lID0gb2JqZWN0Lm9iamVjdF9uYW1lXG5cdFx0XHRcdFx0cmVzdWx0LnB1c2ggdGVtcE9wc1xuXHRcdGlmIHJlc3VsdC5sZW5ndGhcblx0XHRcdHBvcy5mb3JFYWNoIChwbyktPlxuXHRcdFx0XHRyZXBlYXRJbmRleCA9IDBcblx0XHRcdFx0cmVwZWF0UG8gPSByZXN1bHQuZmluZCgoaXRlbSwgaW5kZXgpLT4gcmVwZWF0SW5kZXggPSBpbmRleDtyZXR1cm4gaXRlbS5wZXJtaXNzaW9uX3NldF9pZCA9PSBwby5wZXJtaXNzaW9uX3NldF9pZClcblx0XHRcdFx0IyDlpoLmnpx5bWzkuK3lt7Lnu4/lrZjlnKhwb++8jOWImeabv+aNouS4uuaVsOaNruW6k+S4reeahHBv77yM5Y+N5LmL5YiZ5oqK5pWw5o2u5bqT5Lit55qEcG/nm7TmjqXntK/liqDov5vljrtcblx0XHRcdFx0aWYgcmVwZWF0UG9cblx0XHRcdFx0XHRyZXN1bHRbcmVwZWF0SW5kZXhdID0gcG9cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJlc3VsdC5wdXNoIHBvXG5cdFx0XHRyZXR1cm4gcmVzdWx0XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHBvc1xuXG5cdENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMgPSAoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSktPlxuXHRcdHBlcm1pc3Npb25zID0ge31cblx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZClcblxuXHRcdGlmIHNwYWNlSWQgaXMgJ2d1ZXN0JyB8fCBvYmplY3RfbmFtZSA9PSBcInVzZXJzXCJcblx0XHRcdHBlcm1pc3Npb25zID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9XG5cdFx0XHRDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyBwZXJtaXNzaW9uc1xuXHRcdFx0cmV0dXJuIHBlcm1pc3Npb25zXG5cdFx0cHNldHNBZG1pbiA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNBZG1pbikgb3IgdGhpcy5wc2V0c0FkbWluIHRoZW4gdGhpcy5wc2V0c0FkbWluIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzVXNlciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNVc2VyKSBvciB0aGlzLnBzZXRzVXNlciB0aGVuIHRoaXMucHNldHNVc2VyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHNNZW1iZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzTWVtYmVyKSBvciB0aGlzLnBzZXRzTWVtYmVyIHRoZW4gdGhpcy5wc2V0c01lbWJlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHNHdWVzdCA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNHdWVzdCkgb3IgdGhpcy5wc2V0c0d1ZXN0IHRoZW4gdGhpcy5wc2V0c0d1ZXN0IGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdndWVzdCd9LCB7ZmllbGRzOntfaWQ6MX19KVxuXG5cdFx0cHNldHNTdXBwbGllciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNTdXBwbGllcikgb3IgdGhpcy5wc2V0c1N1cHBsaWVyIHRoZW4gdGhpcy5wc2V0c1N1cHBsaWVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzQ3VzdG9tZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzQ3VzdG9tZXIpIG9yIHRoaXMucHNldHNDdXN0b21lciB0aGVuIHRoaXMucHNldHNDdXN0b21lciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnY3VzdG9tZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50O1xuXHRcdGlmICFwc2V0c1xuXHRcdFx0c3BhY2VVc2VyID0gbnVsbDtcblx0XHRcdGlmIHVzZXJJZFxuXHRcdFx0XHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcblx0XHRcdGlmIHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZVxuXHRcdFx0XHRwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCAkb3I6IFt7dXNlcnM6IHVzZXJJZH0sIHtuYW1lOiBzcGFjZVVzZXIucHJvZmlsZX1dfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0cHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cblx0XHRwc2V0c0FkbWluX3BvcyA9IHRoaXMucHNldHNBZG1pbl9wb3Ncblx0XHRwc2V0c1VzZXJfcG9zID0gdGhpcy5wc2V0c1VzZXJfcG9zXG5cdFx0cHNldHNNZW1iZXJfcG9zID0gdGhpcy5wc2V0c01lbWJlcl9wb3Ncblx0XHRwc2V0c0d1ZXN0X3BvcyA9IHRoaXMucHNldHNHdWVzdF9wb3NcblxuXHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gdGhpcy5wc2V0c1N1cHBsaWVyX3Bvc1xuXHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gdGhpcy5wc2V0c0N1c3RvbWVyX3Bvc1xuXG5cdFx0cHNldHNDdXJyZW50X3BvcyA9IHRoaXMucHNldHNDdXJyZW50X3Bvc1xuXG5cdFx0b3BzZXRBZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmFkbWluKSB8fCB7fVxuXHRcdG9wc2V0VXNlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnVzZXIpIHx8IHt9XG5cdFx0b3BzZXRNZW1iZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5tZW1iZXIpIHx8IHt9XG5cdFx0b3BzZXRHdWVzdCA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fVxuXG5cdFx0b3BzZXRTdXBwbGllciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnN1cHBsaWVyKSB8fCB7fVxuXHRcdG9wc2V0Q3VzdG9tZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5jdXN0b21lcikgfHwge31cblxuXHRcdCMgc2hhcmVkTGlzdFZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3RfbGlzdHZpZXdzJykuZmluZCh7c3BhY2U6IHNwYWNlSWQsIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc2hhcmVkOiB0cnVlfSwge2ZpZWxkczp7X2lkOjF9fSkuZmV0Y2goKVxuXHRcdCMgc2hhcmVkTGlzdFZpZXdzID0gXy5wbHVjayhzaGFyZWRMaXN0Vmlld3MsXCJfaWRcIilcblx0XHQjIGlmIHNoYXJlZExpc3RWaWV3cy5sZW5ndGhcblx0XHQjIFx0dW5sZXNzIG9wc2V0QWRtaW4ubGlzdF92aWV3c1xuXHRcdCMgXHRcdG9wc2V0QWRtaW4ubGlzdF92aWV3cyA9IFtdXG5cdFx0IyBcdG9wc2V0QWRtaW4ubGlzdF92aWV3cyA9IF8udW5pb24gb3BzZXRBZG1pbi5saXN0X3ZpZXdzLCBzaGFyZWRMaXN0Vmlld3Ncblx0XHQjIFx0dW5sZXNzIG9wc2V0VXNlci5saXN0X3ZpZXdzXG5cdFx0IyBcdFx0b3BzZXRVc2VyLmxpc3Rfdmlld3MgPSBbXVxuXHRcdCMgXHRvcHNldFVzZXIubGlzdF92aWV3cyA9IF8udW5pb24gb3BzZXRVc2VyLmxpc3Rfdmlld3MsIHNoYXJlZExpc3RWaWV3c1xuXHRcdCMg5pWw5o2u5bqT5Lit5aaC5p6c6YWN572u5LqG6buY6K6k55qEYWRtaW4vdXNlcuadg+mZkOmbhuiuvue9ru+8jOW6lOivpeimhuebluS7o+eggeS4rWFkbWluL3VzZXLnmoTmnYPpmZDpm4borr7nva5cblx0XHRpZiBwc2V0c0FkbWluXG5cdFx0XHRwb3NBZG1pbiA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNBZG1pbl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0FkbWluLl9pZClcblx0XHRcdGlmIHBvc0FkbWluXG5cdFx0XHRcdG9wc2V0QWRtaW4uYWxsb3dDcmVhdGUgPSBwb3NBZG1pbi5hbGxvd0NyZWF0ZVxuXHRcdFx0XHRvcHNldEFkbWluLmFsbG93RGVsZXRlID0gcG9zQWRtaW4uYWxsb3dEZWxldGVcblx0XHRcdFx0b3BzZXRBZG1pbi5hbGxvd0VkaXQgPSBwb3NBZG1pbi5hbGxvd0VkaXRcblx0XHRcdFx0b3BzZXRBZG1pbi5hbGxvd1JlYWQgPSBwb3NBZG1pbi5hbGxvd1JlYWRcblx0XHRcdFx0b3BzZXRBZG1pbi5tb2RpZnlBbGxSZWNvcmRzID0gcG9zQWRtaW4ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldEFkbWluLnZpZXdBbGxSZWNvcmRzID0gcG9zQWRtaW4udmlld0FsbFJlY29yZHNcblx0XHRcdFx0b3BzZXRBZG1pbi5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0FkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdG9wc2V0QWRtaW4udmlld0NvbXBhbnlSZWNvcmRzID0gcG9zQWRtaW4udmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdG9wc2V0QWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0FkbWluLmRpc2FibGVkX2xpc3Rfdmlld3Ncblx0XHRcdFx0b3BzZXRBZG1pbi5kaXNhYmxlZF9hY3Rpb25zID0gcG9zQWRtaW4uZGlzYWJsZWRfYWN0aW9uc1xuXHRcdFx0XHRvcHNldEFkbWluLnVucmVhZGFibGVfZmllbGRzID0gcG9zQWRtaW4udW5yZWFkYWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRBZG1pbi51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0FkbWluLnVuZWRpdGFibGVfZmllbGRzXG5cdFx0XHRcdG9wc2V0QWRtaW4udW5yZWxhdGVkX29iamVjdHMgPSBwb3NBZG1pbi51bnJlbGF0ZWRfb2JqZWN0c1xuXHRcdFx0XHRvcHNldEFkbWluLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zQWRtaW4udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Rcblx0XHRpZiBwc2V0c1VzZXJcblx0XHRcdHBvc1VzZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzVXNlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1VzZXIuX2lkKVxuXHRcdFx0aWYgcG9zVXNlclxuXHRcdFx0XHRvcHNldFVzZXIuYWxsb3dDcmVhdGUgPSBwb3NVc2VyLmFsbG93Q3JlYXRlXG5cdFx0XHRcdG9wc2V0VXNlci5hbGxvd0RlbGV0ZSA9IHBvc1VzZXIuYWxsb3dEZWxldGVcblx0XHRcdFx0b3BzZXRVc2VyLmFsbG93RWRpdCA9IHBvc1VzZXIuYWxsb3dFZGl0XG5cdFx0XHRcdG9wc2V0VXNlci5hbGxvd1JlYWQgPSBwb3NVc2VyLmFsbG93UmVhZFxuXHRcdFx0XHRvcHNldFVzZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldFVzZXIudmlld0FsbFJlY29yZHMgPSBwb3NVc2VyLnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdG9wc2V0VXNlci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0b3BzZXRVc2VyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdG9wc2V0VXNlci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zVXNlci5kaXNhYmxlZF9saXN0X3ZpZXdzXG5cdFx0XHRcdG9wc2V0VXNlci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zVXNlci5kaXNhYmxlZF9hY3Rpb25zXG5cdFx0XHRcdG9wc2V0VXNlci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1VzZXIudW5yZWFkYWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRVc2VyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zVXNlci51bmVkaXRhYmxlX2ZpZWxkc1xuXHRcdFx0XHRvcHNldFVzZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NVc2VyLnVucmVsYXRlZF9vYmplY3RzXG5cdFx0XHRcdG9wc2V0VXNlci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc1VzZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Rcblx0XHRpZiBwc2V0c01lbWJlclxuXHRcdFx0cG9zTWVtYmVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c01lbWJlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c01lbWJlci5faWQpXG5cdFx0XHRpZiBwb3NNZW1iZXJcblx0XHRcdFx0b3BzZXRNZW1iZXIuYWxsb3dDcmVhdGUgPSBwb3NNZW1iZXIuYWxsb3dDcmVhdGVcblx0XHRcdFx0b3BzZXRNZW1iZXIuYWxsb3dEZWxldGUgPSBwb3NNZW1iZXIuYWxsb3dEZWxldGVcblx0XHRcdFx0b3BzZXRNZW1iZXIuYWxsb3dFZGl0ID0gcG9zTWVtYmVyLmFsbG93RWRpdFxuXHRcdFx0XHRvcHNldE1lbWJlci5hbGxvd1JlYWQgPSBwb3NNZW1iZXIuYWxsb3dSZWFkXG5cdFx0XHRcdG9wc2V0TWVtYmVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NNZW1iZXIubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldE1lbWJlci52aWV3QWxsUmVjb3JkcyA9IHBvc01lbWJlci52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldE1lbWJlci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc01lbWJlci5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRvcHNldE1lbWJlci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NNZW1iZXIudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NNZW1iZXIuZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdFx0XHRvcHNldE1lbWJlci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zTWVtYmVyLmRpc2FibGVkX2FjdGlvbnNcblx0XHRcdFx0b3BzZXRNZW1iZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NNZW1iZXIudW5yZWFkYWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRNZW1iZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NNZW1iZXIudW5lZGl0YWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRNZW1iZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NNZW1iZXIudW5yZWxhdGVkX29iamVjdHNcblx0XHRcdFx0b3BzZXRNZW1iZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NNZW1iZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Rcblx0XHRpZiBwc2V0c0d1ZXN0XG5cdFx0XHRwb3NHdWVzdCA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNHdWVzdF9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0d1ZXN0Ll9pZClcblx0XHRcdGlmIHBvc0d1ZXN0XG5cdFx0XHRcdG9wc2V0R3Vlc3QuYWxsb3dDcmVhdGUgPSBwb3NHdWVzdC5hbGxvd0NyZWF0ZVxuXHRcdFx0XHRvcHNldEd1ZXN0LmFsbG93RGVsZXRlID0gcG9zR3Vlc3QuYWxsb3dEZWxldGVcblx0XHRcdFx0b3BzZXRHdWVzdC5hbGxvd0VkaXQgPSBwb3NHdWVzdC5hbGxvd0VkaXRcblx0XHRcdFx0b3BzZXRHdWVzdC5hbGxvd1JlYWQgPSBwb3NHdWVzdC5hbGxvd1JlYWRcblx0XHRcdFx0b3BzZXRHdWVzdC5tb2RpZnlBbGxSZWNvcmRzID0gcG9zR3Vlc3QubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldEd1ZXN0LnZpZXdBbGxSZWNvcmRzID0gcG9zR3Vlc3Qudmlld0FsbFJlY29yZHNcblx0XHRcdFx0b3BzZXRHdWVzdC5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0d1ZXN0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdG9wc2V0R3Vlc3Qudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zR3Vlc3Qudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdG9wc2V0R3Vlc3QuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0d1ZXN0LmRpc2FibGVkX2xpc3Rfdmlld3Ncblx0XHRcdFx0b3BzZXRHdWVzdC5kaXNhYmxlZF9hY3Rpb25zID0gcG9zR3Vlc3QuZGlzYWJsZWRfYWN0aW9uc1xuXHRcdFx0XHRvcHNldEd1ZXN0LnVucmVhZGFibGVfZmllbGRzID0gcG9zR3Vlc3QudW5yZWFkYWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRHdWVzdC51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0d1ZXN0LnVuZWRpdGFibGVfZmllbGRzXG5cdFx0XHRcdG9wc2V0R3Vlc3QudW5yZWxhdGVkX29iamVjdHMgPSBwb3NHdWVzdC51bnJlbGF0ZWRfb2JqZWN0c1xuXHRcdFx0XHRvcHNldEd1ZXN0LnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zR3Vlc3QudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Rcblx0XHRpZiBwc2V0c1N1cHBsaWVyXG5cdFx0XHRwb3NTdXBwbGllciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNTdXBwbGllcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1N1cHBsaWVyLl9pZCk7XG5cdFx0XHRpZiBwb3NTdXBwbGllclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLmFsbG93Q3JlYXRlID0gcG9zU3VwcGxpZXIuYWxsb3dDcmVhdGVcblx0XHRcdFx0b3BzZXRTdXBwbGllci5hbGxvd0RlbGV0ZSA9IHBvc1N1cHBsaWVyLmFsbG93RGVsZXRlXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIuYWxsb3dFZGl0ID0gcG9zU3VwcGxpZXIuYWxsb3dFZGl0XG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIuYWxsb3dSZWFkID0gcG9zU3VwcGxpZXIuYWxsb3dSZWFkXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1N1cHBsaWVyLm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0b3BzZXRTdXBwbGllci52aWV3QWxsUmVjb3JkcyA9IHBvc1N1cHBsaWVyLnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NTdXBwbGllci5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRvcHNldFN1cHBsaWVyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1N1cHBsaWVyLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRvcHNldFN1cHBsaWVyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NTdXBwbGllci5kaXNhYmxlZF9saXN0X3ZpZXdzXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc1N1cHBsaWVyLmRpc2FibGVkX2FjdGlvbnNcblx0XHRcdFx0b3BzZXRTdXBwbGllci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1N1cHBsaWVyLnVucmVhZGFibGVfZmllbGRzXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NTdXBwbGllci51bmVkaXRhYmxlX2ZpZWxkc1xuXHRcdFx0XHRvcHNldFN1cHBsaWVyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zU3VwcGxpZXIudW5yZWxhdGVkX29iamVjdHNcblx0XHRcdFx0b3BzZXRTdXBwbGllci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc1N1cHBsaWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0XG5cdFx0aWYgcHNldHNDdXN0b21lclxuXHRcdFx0cG9zQ3VzdG9tZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VzdG9tZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNDdXN0b21lci5faWQpO1xuXHRcdFx0aWYgcG9zQ3VzdG9tZXJcblx0XHRcdFx0b3BzZXRDdXN0b21lci5hbGxvd0NyZWF0ZSA9IHBvc0N1c3RvbWVyLmFsbG93Q3JlYXRlXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIuYWxsb3dEZWxldGUgPSBwb3NDdXN0b21lci5hbGxvd0RlbGV0ZVxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLmFsbG93RWRpdCA9IHBvc0N1c3RvbWVyLmFsbG93RWRpdFxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLmFsbG93UmVhZCA9IHBvc0N1c3RvbWVyLmFsbG93UmVhZFxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NDdXN0b21lci5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIudmlld0FsbFJlY29yZHMgPSBwb3NDdXN0b21lci52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldEN1c3RvbWVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zQ3VzdG9tZXIubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0b3BzZXRDdXN0b21lci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NDdXN0b21lci52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdFx0b3BzZXRDdXN0b21lci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zQ3VzdG9tZXIuZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdFx0XHRvcHNldEN1c3RvbWVyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NDdXN0b21lci5kaXNhYmxlZF9hY3Rpb25zXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NDdXN0b21lci51bnJlYWRhYmxlX2ZpZWxkc1xuXHRcdFx0XHRvcHNldEN1c3RvbWVyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zQ3VzdG9tZXIudW5lZGl0YWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRDdXN0b21lci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0N1c3RvbWVyLnVucmVsYXRlZF9vYmplY3RzXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NDdXN0b21lci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFxuXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEFkbWluXG5cdFx0ZWxzZVxuXHRcdFx0aWYgaXNTcGFjZUFkbWluXG5cdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRBZG1pblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBzcGFjZUlkIGlzICdjb21tb24nXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHNwYWNlVXNlciA9IGlmIF8uaXNOdWxsKHRoaXMuc3BhY2VVc2VyKSBvciB0aGlzLnNwYWNlVXNlciB0aGVuIHRoaXMuc3BhY2VVc2VyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXG5cdFx0XHRcdFx0aWYgc3BhY2VVc2VyXG5cdFx0XHRcdFx0XHRwcm9mID0gc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdFx0XHRcdGlmIHByb2Zcblx0XHRcdFx0XHRcdFx0aWYgcHJvZiBpcyAndXNlcidcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ21lbWJlcidcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0TWVtYmVyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnZ3Vlc3QnXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0XG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnc3VwcGxpZXInXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFN1cHBsaWVyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnY3VzdG9tZXInXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEN1c3RvbWVyXG5cdFx0XHRcdFx0XHRlbHNlICMg5rKh5pyJcHJvZmlsZeWImeiupOS4uuaYr3VzZXLmnYPpmZBcblx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Rcblx0XHRpZiBwc2V0cy5sZW5ndGggPiAwXG5cdFx0XHRzZXRfaWRzID0gXy5wbHVjayBwc2V0cywgXCJfaWRcIlxuXHRcdFx0cG9zID0gZmluZF9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1cnJlbnRfcG9zLCBvYmplY3RfbmFtZSwgc2V0X2lkcylcblx0XHRcdHBvcyA9IHVuaW9uUGVybWlzc2lvbk9iamVjdHMocG9zLCBvYmplY3QsIHBzZXRzKVxuXHRcdFx0Xy5lYWNoIHBvcywgKHBvKS0+XG5cdFx0XHRcdGlmIHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzQWRtaW4/Ll9pZCBvciBcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNVc2VyPy5faWQgb3IgXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzTWVtYmVyPy5faWQgb3IgXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzR3Vlc3Q/Ll9pZCBvclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c1N1cHBsaWVyPy5faWQgb3Jcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNDdXN0b21lcj8uX2lkXG5cdFx0XHRcdFx0IyDpu5jorqTnmoRhZG1pbi91c2Vy5p2D6ZmQ5YC85Y+q5a6e6KGM5LiK6Z2i55qE6buY6K6k5YC86KaG55uW77yM5LiN5YGa566X5rOV5Yik5patXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdGlmIF8uaXNFbXB0eShwZXJtaXNzaW9ucylcblx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IHBvXG5cdFx0XHRcdGlmIHBvLmFsbG93UmVhZFxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHRydWVcblx0XHRcdFx0aWYgcG8uYWxsb3dDcmVhdGVcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHRydWVcblx0XHRcdFx0aWYgcG8uYWxsb3dFZGl0XG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdFx0XHRpZiBwby5hbGxvd0RlbGV0ZVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gdHJ1ZVxuXHRcdFx0XHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IHRydWVcblx0XHRcdFx0aWYgcG8udmlld0FsbFJlY29yZHNcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA9IHRydWVcblx0XHRcdFx0aWYgcG8ubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHRydWVcblx0XHRcdFx0aWYgcG8udmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZVxuXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIHBvLmRpc2FibGVkX2xpc3Rfdmlld3MpXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMsIHBvLmRpc2FibGVkX2FjdGlvbnMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgcG8udW5yZWFkYWJsZV9maWVsZHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgcG8udW5lZGl0YWJsZV9maWVsZHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cywgcG8udW5yZWxhdGVkX29iamVjdHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgcG8udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QpXG5cdFx0XG5cdFx0aWYgb2JqZWN0LmlzX3ZpZXdcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBbXVxuXHRcdENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zIHBlcm1pc3Npb25zXG5cblx0XHRpZiBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXJcblx0XHRcdHBlcm1pc3Npb25zLm93bmVyID0gb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyXG5cdFx0cmV0dXJuIHBlcm1pc3Npb25zXG5cblxuXHQjIENyZWF0b3IuaW5pdFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lKSAtPlxuXG5cdFx0IyAjIOW6lOivpeaKiuiuoeeul+WHuuadpeeahFxuXHRcdCMgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV0uYWxsb3dcblx0XHQjIFx0aW5zZXJ0OiAodXNlcklkLCBkb2MpIC0+XG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdCAgICBcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93Q3JlYXRlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdCMgXHRcdHJldHVybiB0cnVlXG5cdFx0IyBcdHVwZGF0ZTogKHVzZXJJZCwgZG9jKSAtPlxuXHRcdCMgXHRcdGlmICF1c2VySWRcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2Vcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93RWRpdFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcblx0XHQjIFx0cmVtb3ZlOiAodXNlcklkLCBkb2MpIC0+XG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dEZWxldGVcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHJldHVybiB0cnVlXG5cblx0TWV0ZW9yLm1ldGhvZHNcblx0XHQjIENhbGN1bGF0ZSBQZXJtaXNzaW9ucyBvbiBTZXJ2ZXJcblx0XHRcImNyZWF0b3Iub2JqZWN0X3Blcm1pc3Npb25zXCI6IChzcGFjZUlkKS0+XG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB0aGlzLnVzZXJJZClcbiIsInZhciBjbG9uZSwgZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCwgZmluZF9wZXJtaXNzaW9uX29iamVjdCwgaW50ZXJzZWN0aW9uUGx1cywgdW5pb25QZXJtaXNzaW9uT2JqZWN0cywgdW5pb25QbHVzO1xuXG5jbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJyk7XG5cbkNyZWF0b3IuZ2V0UGVybWlzc2lvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBvYmo7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoIW9iaikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gb2JqLnBlcm1pc3Npb25zLmdldCgpO1xuICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIHJldHVybiBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZCwgdXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBpc093bmVyLCBvYmplY3RfZmllbGRzX2tleXMsIHBlcm1pc3Npb25zLCByZWNvcmRfY29tcGFueV9pZCwgcmVjb3JkX2NvbXBhbnlfaWRzLCByZWNvcmRfaWQsIHJlZiwgcmVmMSwgc2VsZWN0LCB1c2VyX2NvbXBhbnlfaWRzO1xuICBpZiAoIW9iamVjdF9uYW1lICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAoIXNwYWNlSWQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgfVxuICBpZiAocmVjb3JkICYmIG9iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJykpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gcmVjb3JkLnBhcmVudFsncmVmZXJlbmNlX3RvLl9vJ107XG4gICAgICByZWNvcmRfaWQgPSByZWNvcmQucGFyZW50Ll9pZDtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldCgnb2JqZWN0X25hbWUnKTtcbiAgICAgIHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuICAgIH1cbiAgICBvYmplY3RfZmllbGRzX2tleXMgPSBfLmtleXMoKChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwKSB8fCB7fSkgfHwgW107XG4gICAgc2VsZWN0ID0gXy5pbnRlcnNlY3Rpb24ob2JqZWN0X2ZpZWxkc19rZXlzLCBbJ293bmVyJywgJ2NvbXBhbnlfaWQnLCAnY29tcGFueV9pZHMnLCAnbG9ja2VkJ10pIHx8IFtdO1xuICAgIGlmIChzZWxlY3QubGVuZ3RoID4gMCkge1xuICAgICAgcmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0LmpvaW4oJywnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlY29yZCA9IG51bGw7XG4gICAgfVxuICB9XG4gIHBlcm1pc3Npb25zID0gXy5jbG9uZShDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKTtcbiAgaWYgKHJlY29yZCkge1xuICAgIGlmIChyZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zKSB7XG4gICAgICByZXR1cm4gcmVjb3JkLnJlY29yZF9wZXJtaXNzaW9ucztcbiAgICB9XG4gICAgaXNPd25lciA9IHJlY29yZC5vd25lciA9PT0gdXNlcklkIHx8ICgocmVmMSA9IHJlY29yZC5vd25lcikgIT0gbnVsbCA/IHJlZjEuX2lkIDogdm9pZCAwKSA9PT0gdXNlcklkO1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHVzZXJfY29tcGFueV9pZHMgPSBTdGVlZG9zLmdldFVzZXJDb21wYW55SWRzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJfY29tcGFueV9pZHMgPSBDcmVhdG9yLmdldFVzZXJDb21wYW55SWRzKHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgfVxuICAgIHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkICE9IG51bGwgPyByZWNvcmQuY29tcGFueV9pZCA6IHZvaWQgMDtcbiAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWQgJiYgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZCkgJiYgcmVjb3JkX2NvbXBhbnlfaWQuX2lkKSB7XG4gICAgICByZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZF9jb21wYW55X2lkLl9pZDtcbiAgICB9XG4gICAgcmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkICE9IG51bGwgPyByZWNvcmQuY29tcGFueV9pZHMgOiB2b2lkIDA7XG4gICAgaWYgKHJlY29yZF9jb21wYW55X2lkcyAmJiByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoICYmIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWRzWzBdKSkge1xuICAgICAgcmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkX2NvbXBhbnlfaWRzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZWNvcmRfY29tcGFueV9pZHMgPSBfLnVuaW9uKHJlY29yZF9jb21wYW55X2lkcywgW3JlY29yZF9jb21wYW55X2lkXSk7XG4gICAgaWYgKCFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzICYmICFpc093bmVyICYmICFwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZHMgJiYgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICBpZiAodXNlcl9jb21wYW55X2lkcyAmJiB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgIGlmICghXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAocmVjb3JkLmxvY2tlZCAmJiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmICFpc093bmVyICYmICFwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkcyAmJiByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgIGlmICh1c2VyX2NvbXBhbnlfaWRzICYmIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aCkge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBwZXJtaXNzaW9ucztcbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zID0gZnVuY3Rpb24oY3VycmVudE9iamVjdE5hbWUsIHJlbGF0ZWRMaXN0SXRlbSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKSB7XG4gICAgdmFyIGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSwgbWFzdGVyQWxsb3csIG1hc3RlclJlY29yZFBlcm0sIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucywgcmVzdWx0LCB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgaWYgKCFjdXJyZW50T2JqZWN0TmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGN1cnJlbnRPYmplY3ROYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFyZWxhdGVkTGlzdEl0ZW0pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJyZWxhdGVkTGlzdEl0ZW0gbXVzdCBub3QgYmUgZW1wdHkgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnNcIik7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmICghY3VycmVudFJlY29yZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGN1cnJlbnRSZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSByZWxhdGVkTGlzdEl0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgfHwgZmFsc2U7XG4gICAgbWFzdGVyQWxsb3cgPSBmYWxzZTtcbiAgICBtYXN0ZXJSZWNvcmRQZXJtID0gQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyhjdXJyZW50T2JqZWN0TmFtZSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKTtcbiAgICBpZiAod3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT09IHRydWUpIHtcbiAgICAgIG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWQ7XG4gICAgfSBlbHNlIGlmICh3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9PT0gZmFsc2UpIHtcbiAgICAgIG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXQ7XG4gICAgfVxuICAgIHVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gQ3JlYXRvci5nZXRSZWNvcmRTYWZlUmVsYXRlZExpc3QoY3VycmVudFJlY29yZCwgY3VycmVudE9iamVjdE5hbWUpO1xuICAgIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKTtcbiAgICBpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUgPSB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdC5pbmRleE9mKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSkgPiAtMTtcbiAgICByZXN1bHQgPSBfLmNsb25lKHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyk7XG4gICAgcmVzdWx0LmFsbG93Q3JlYXRlID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGU7XG4gICAgcmVzdWx0LmFsbG93RWRpdCA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgX2ksIGlzU3BhY2VBZG1pbiwgcGVybWlzc2lvbnMsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0FkbWluX3BvcywgcHNldHNDdXJyZW50LCBwc2V0c0N1cnJlbnROYW1lcywgcHNldHNDdXJyZW50X3BvcywgcHNldHNDdXN0b21lciwgcHNldHNDdXN0b21lcl9wb3MsIHBzZXRzR3Vlc3QsIHBzZXRzR3Vlc3RfcG9zLCBwc2V0c01lbWJlciwgcHNldHNNZW1iZXJfcG9zLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1N1cHBsaWVyX3BvcywgcHNldHNVc2VyLCBwc2V0c1VzZXJfcG9zLCBzZXRfaWRzLCBzcGFjZVVzZXI7XG4gICAgcGVybWlzc2lvbnMgPSB7XG4gICAgICBvYmplY3RzOiB7fSxcbiAgICAgIGFzc2lnbmVkX2FwcHM6IFtdXG4gICAgfTtcblxuICAgIC8qXG4gICAgXHRcdOadg+mZkOmbhuivtOaYjjpcbiAgICBcdFx05YaF572u5p2D6ZmQ6ZuGLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0LHdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pblxuICAgIFx0XHToh6rlrprkuYnmnYPpmZDpm4Yt5pWw5o2u5bqT5Lit5paw5bu655qE6Zmk5YaF572u5p2D6ZmQ6ZuG5Lul5aSW55qE5YW25LuW5p2D6ZmQ6ZuGXG4gICAgXHRcdOeJueWumueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5LiN5Y+v6YWN572u77yJLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0XG4gICAgXHRcdOWPr+mFjee9rueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5Y+v6YWN572u77yJLXdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pbuS7peWPiuiHquWumuS5ieadg+mZkOmbhlxuICAgICAqL1xuICAgIGlzU3BhY2VBZG1pbiA9IGZhbHNlO1xuICAgIHNwYWNlVXNlciA9IG51bGw7XG4gICAgaWYgKHVzZXJJZCkge1xuICAgICAgaXNTcGFjZUFkbWluID0gQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c01lbWJlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnbWVtYmVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzR3Vlc3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2d1ZXN0J1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzU3VwcGxpZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3N1cHBsaWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzQ3VzdG9tZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgJG9yOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXNlcnM6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIG5hbWU6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgcHNldHNBZG1pbl9wb3MgPSBudWxsO1xuICAgIHBzZXRzVXNlcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzTWVtYmVyX3BvcyA9IG51bGw7XG4gICAgcHNldHNHdWVzdF9wb3MgPSBudWxsO1xuICAgIHBzZXRzQ3VycmVudF9wb3MgPSBudWxsO1xuICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IG51bGw7XG4gICAgaWYgKHBzZXRzQWRtaW4gIT0gbnVsbCA/IHBzZXRzQWRtaW4uX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQWRtaW4uX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNVc2VyICE9IG51bGwgPyBwc2V0c1VzZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c1VzZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzTWVtYmVyICE9IG51bGwgPyBwc2V0c01lbWJlci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzTWVtYmVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzR3Vlc3QgIT0gbnVsbCA/IHBzZXRzR3Vlc3QuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzR3Vlc3QuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNTdXBwbGllciAhPSBudWxsID8gcHNldHNTdXBwbGllci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNTdXBwbGllci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1c3RvbWVyICE9IG51bGwgPyBwc2V0c0N1c3RvbWVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNDdXN0b21lcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0N1c3RvbWVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzQ3VycmVudC5sZW5ndGggPiAwKSB7XG4gICAgICBzZXRfaWRzID0gXy5wbHVjayhwc2V0c0N1cnJlbnQsIFwiX2lkXCIpO1xuICAgICAgcHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHtcbiAgICAgICAgICAkaW46IHNldF9pZHNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayhwc2V0c0N1cnJlbnQsIFwibmFtZVwiKTtcbiAgICB9XG4gICAgcHNldHMgPSB7XG4gICAgICBwc2V0c0FkbWluOiBwc2V0c0FkbWluLFxuICAgICAgcHNldHNVc2VyOiBwc2V0c1VzZXIsXG4gICAgICBwc2V0c0N1cnJlbnQ6IHBzZXRzQ3VycmVudCxcbiAgICAgIHBzZXRzTWVtYmVyOiBwc2V0c01lbWJlcixcbiAgICAgIHBzZXRzR3Vlc3Q6IHBzZXRzR3Vlc3QsXG4gICAgICBwc2V0c1N1cHBsaWVyOiBwc2V0c1N1cHBsaWVyLFxuICAgICAgcHNldHNDdXN0b21lcjogcHNldHNDdXN0b21lcixcbiAgICAgIGlzU3BhY2VBZG1pbjogaXNTcGFjZUFkbWluLFxuICAgICAgc3BhY2VVc2VyOiBzcGFjZVVzZXIsXG4gICAgICBwc2V0c0FkbWluX3BvczogcHNldHNBZG1pbl9wb3MsXG4gICAgICBwc2V0c1VzZXJfcG9zOiBwc2V0c1VzZXJfcG9zLFxuICAgICAgcHNldHNNZW1iZXJfcG9zOiBwc2V0c01lbWJlcl9wb3MsXG4gICAgICBwc2V0c0d1ZXN0X3BvczogcHNldHNHdWVzdF9wb3MsXG4gICAgICBwc2V0c1N1cHBsaWVyX3BvczogcHNldHNTdXBwbGllcl9wb3MsXG4gICAgICBwc2V0c0N1c3RvbWVyX3BvczogcHNldHNDdXN0b21lcl9wb3MsXG4gICAgICBwc2V0c0N1cnJlbnRfcG9zOiBwc2V0c0N1cnJlbnRfcG9zXG4gICAgfTtcbiAgICBwZXJtaXNzaW9ucy5hc3NpZ25lZF9hcHBzID0gQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwZXJtaXNzaW9ucy5hc3NpZ25lZF9tZW51cyA9IENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBlcm1pc3Npb25zLnVzZXJfcGVybWlzc2lvbl9zZXRzID0gcHNldHNDdXJyZW50TmFtZXM7XG4gICAgX2kgPSAwO1xuICAgIF8uZWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKG9iamVjdCwgb2JqZWN0X25hbWUpIHtcbiAgICAgIF9pKys7XG4gICAgICBpZiAoIV8uaGFzKG9iamVjdCwgJ3NwYWNlJykgfHwgIW9iamVjdC5zcGFjZSB8fCBvYmplY3Quc3BhY2UgPT09IHNwYWNlSWQpIHtcbiAgICAgICAgaWYgKCFfLmhhcyhvYmplY3QsICdpbl9kZXZlbG9wbWVudCcpIHx8IG9iamVjdC5pbl9kZXZlbG9wbWVudCA9PT0gJzAnIHx8IChvYmplY3QuaW5fZGV2ZWxvcG1lbnQgIT09ICcwJyAmJiBpc1NwYWNlQWRtaW4pKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV0gPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUoQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSksIHNwYWNlSWQpO1xuICAgICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXVtcInBlcm1pc3Npb25zXCJdID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfTtcbiAgdW5pb25QbHVzID0gZnVuY3Rpb24oYXJyYXksIG90aGVyKSB7XG4gICAgaWYgKCFhcnJheSAmJiAhb3RoZXIpIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICghYXJyYXkpIHtcbiAgICAgIGFycmF5ID0gW107XG4gICAgfVxuICAgIGlmICghb3RoZXIpIHtcbiAgICAgIG90aGVyID0gW107XG4gICAgfVxuICAgIHJldHVybiBfLnVuaW9uKGFycmF5LCBvdGhlcik7XG4gIH07XG4gIGludGVyc2VjdGlvblBsdXMgPSBmdW5jdGlvbihhcnJheSwgb3RoZXIpIHtcbiAgICBpZiAoIWFycmF5ICYmICFvdGhlcikge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKCFhcnJheSkge1xuICAgICAgYXJyYXkgPSBbXTtcbiAgICB9XG4gICAgaWYgKCFvdGhlcikge1xuICAgICAgb3RoZXIgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKGFycmF5LCBvdGhlcik7XG4gIH07XG4gIENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGFwcHMsIGlzU3BhY2VBZG1pbiwgcHNldEJhc2UsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0N1c3RvbWVyLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1VzZXIsIHJlZiwgcmVmMSwgc3BhY2VVc2VyLCB1c2VyUHJvZmlsZTtcbiAgICBwc2V0c0FkbWluID0gdGhpcy5wc2V0c0FkbWluIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzVXNlciA9IHRoaXMucHNldHNVc2VyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNTdXBwbGllciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNDdXN0b21lciA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgIGlmICh1c2VySWQpIHtcbiAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1c2VyczogdXNlcklkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbmFtZTogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBhcHBzID0gW107XG4gICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyUHJvZmlsZSA9IChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pKSAhPSBudWxsID8gcmVmLnByb2ZpbGUgOiB2b2lkIDA7XG4gICAgICBwc2V0QmFzZSA9IHBzZXRzVXNlcjtcbiAgICAgIGlmICh1c2VyUHJvZmlsZSkge1xuICAgICAgICBpZiAodXNlclByb2ZpbGUgPT09ICdzdXBwbGllcicpIHtcbiAgICAgICAgICBwc2V0QmFzZSA9IHBzZXRzU3VwcGxpZXI7XG4gICAgICAgIH0gZWxzZSBpZiAodXNlclByb2ZpbGUgPT09ICdjdXN0b21lcicpIHtcbiAgICAgICAgICBwc2V0QmFzZSA9IHBzZXRzQ3VzdG9tZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwc2V0QmFzZSAhPSBudWxsID8gKHJlZjEgPSBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgYXBwcyA9IF8udW5pb24oYXBwcywgcHNldEJhc2UuYXNzaWduZWRfYXBwcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICBfLmVhY2gocHNldHMsIGZ1bmN0aW9uKHBzZXQpIHtcbiAgICAgICAgaWYgKCFwc2V0LmFzc2lnbmVkX2FwcHMpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBzZXQubmFtZSA9PT0gXCJhZG1pblwiIHx8IHBzZXQubmFtZSA9PT0gXCJ1c2VyXCIgfHwgcHNldC5uYW1lID09PSAnc3VwcGxpZXInIHx8IHBzZXQubmFtZSA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXBwcyA9IF8udW5pb24oYXBwcywgcHNldC5hc3NpZ25lZF9hcHBzKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8ud2l0aG91dChfLnVuaXEoYXBwcyksIHZvaWQgMCwgbnVsbCk7XG4gICAgfVxuICB9O1xuICBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgYWJvdXRNZW51LCBhZG1pbk1lbnVzLCBhbGxNZW51cywgY3VycmVudFBzZXROYW1lcywgaXNTcGFjZUFkbWluLCBtZW51cywgb3RoZXJNZW51QXBwcywgb3RoZXJNZW51cywgcHNldHMsIHJlZiwgcmVmMSwgcmVzdWx0LCB1c2VyUHJvZmlsZTtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgbmFtZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGFkbWluTWVudXMgPSAocmVmID0gQ3JlYXRvci5BcHBzLmFkbWluKSAhPSBudWxsID8gcmVmLmFkbWluX21lbnVzIDogdm9pZCAwO1xuICAgIGlmICghYWRtaW5NZW51cykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBhYm91dE1lbnUgPSBhZG1pbk1lbnVzLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uX2lkID09PSAnYWJvdXQnO1xuICAgIH0pO1xuICAgIGFkbWluTWVudXMgPSBhZG1pbk1lbnVzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5faWQgIT09ICdhYm91dCc7XG4gICAgfSk7XG4gICAgb3RoZXJNZW51QXBwcyA9IF8uc29ydEJ5KF8uZmlsdGVyKF8udmFsdWVzKENyZWF0b3IuQXBwcyksIGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLmFkbWluX21lbnVzICYmIG4uX2lkICE9PSAnYWRtaW4nO1xuICAgIH0pLCAnc29ydCcpO1xuICAgIG90aGVyTWVudXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhvdGhlck1lbnVBcHBzLCBcImFkbWluX21lbnVzXCIpKTtcbiAgICBhbGxNZW51cyA9IF8udW5pb24oYWRtaW5NZW51cywgb3RoZXJNZW51cywgW2Fib3V0TWVudV0pO1xuICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgIHJlc3VsdCA9IGFsbE1lbnVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyUHJvZmlsZSA9ICgocmVmMSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSkpICE9IG51bGwgPyByZWYxLnByb2ZpbGUgOiB2b2lkIDApIHx8ICd1c2VyJztcbiAgICAgIGN1cnJlbnRQc2V0TmFtZXMgPSBwc2V0cy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5uYW1lO1xuICAgICAgfSk7XG4gICAgICBtZW51cyA9IGFsbE1lbnVzLmZpbHRlcihmdW5jdGlvbihtZW51KSB7XG4gICAgICAgIHZhciBwc2V0c01lbnU7XG4gICAgICAgIHBzZXRzTWVudSA9IG1lbnUucGVybWlzc2lvbl9zZXRzO1xuICAgICAgICBpZiAocHNldHNNZW51ICYmIHBzZXRzTWVudS5pbmRleE9mKHVzZXJQcm9maWxlKSA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKGN1cnJlbnRQc2V0TmFtZXMsIHBzZXRzTWVudSkubGVuZ3RoO1xuICAgICAgfSk7XG4gICAgICByZXN1bHQgPSBtZW51cztcbiAgICB9XG4gICAgcmV0dXJuIF8uc29ydEJ5KHJlc3VsdCwgXCJzb3J0XCIpO1xuICB9O1xuICBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0ID0gZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQpIHtcbiAgICBpZiAoXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIF8uZmluZChwZXJtaXNzaW9uX29iamVjdHMsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHJldHVybiBwby5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwZXJtaXNzaW9uX3NldF9pZFxuICAgIH0pO1xuICB9O1xuICBmaW5kX3Blcm1pc3Npb25fb2JqZWN0ID0gZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWRzKSB7XG4gICAgaWYgKF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBfLmZpbHRlcihwZXJtaXNzaW9uX29iamVjdHMsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHJldHVybiBwby5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiB7XG4gICAgICAgICRpbjogcGVybWlzc2lvbl9zZXRfaWRzXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgfTtcbiAgdW5pb25QZXJtaXNzaW9uT2JqZWN0cyA9IGZ1bmN0aW9uKHBvcywgb2JqZWN0LCBwc2V0cykge1xuICAgIHZhciByZXN1bHQ7XG4gICAgcmVzdWx0ID0gW107XG4gICAgXy5lYWNoKG9iamVjdC5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24ob3BzLCBvcHNfa2V5KSB7XG4gICAgICB2YXIgY3VycmVudFBzZXQsIHRlbXBPcHM7XG4gICAgICBpZiAoW1wiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIl0uaW5kZXhPZihvcHNfa2V5KSA8IDApIHtcbiAgICAgICAgY3VycmVudFBzZXQgPSBwc2V0cy5maW5kKGZ1bmN0aW9uKHBzZXQpIHtcbiAgICAgICAgICByZXR1cm4gcHNldC5uYW1lID09PSBvcHNfa2V5O1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGN1cnJlbnRQc2V0KSB7XG4gICAgICAgICAgdGVtcE9wcyA9IF8uY2xvbmUob3BzKSB8fCB7fTtcbiAgICAgICAgICB0ZW1wT3BzLnBlcm1pc3Npb25fc2V0X2lkID0gY3VycmVudFBzZXQuX2lkO1xuICAgICAgICAgIHRlbXBPcHMub2JqZWN0X25hbWUgPSBvYmplY3Qub2JqZWN0X25hbWU7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKHRlbXBPcHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGgpIHtcbiAgICAgIHBvcy5mb3JFYWNoKGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHZhciByZXBlYXRJbmRleCwgcmVwZWF0UG87XG4gICAgICAgIHJlcGVhdEluZGV4ID0gMDtcbiAgICAgICAgcmVwZWF0UG8gPSByZXN1bHQuZmluZChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICAgIHJlcGVhdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0ucGVybWlzc2lvbl9zZXRfaWQgPT09IHBvLnBlcm1pc3Npb25fc2V0X2lkO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHJlcGVhdFBvKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFtyZXBlYXRJbmRleF0gPSBwbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2gocG8pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwb3M7XG4gICAgfVxuICB9O1xuICBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSkge1xuICAgIHZhciBpc1NwYWNlQWRtaW4sIG9iamVjdCwgb3BzZXRBZG1pbiwgb3BzZXRDdXN0b21lciwgb3BzZXRHdWVzdCwgb3BzZXRNZW1iZXIsIG9wc2V0U3VwcGxpZXIsIG9wc2V0VXNlciwgcGVybWlzc2lvbnMsIHBvcywgcG9zQWRtaW4sIHBvc0N1c3RvbWVyLCBwb3NHdWVzdCwgcG9zTWVtYmVyLCBwb3NTdXBwbGllciwgcG9zVXNlciwgcHJvZiwgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQWRtaW5fcG9zLCBwc2V0c0N1cnJlbnRfcG9zLCBwc2V0c0N1c3RvbWVyLCBwc2V0c0N1c3RvbWVyX3BvcywgcHNldHNHdWVzdCwgcHNldHNHdWVzdF9wb3MsIHBzZXRzTWVtYmVyLCBwc2V0c01lbWJlcl9wb3MsIHBzZXRzU3VwcGxpZXIsIHBzZXRzU3VwcGxpZXJfcG9zLCBwc2V0c1VzZXIsIHBzZXRzVXNlcl9wb3MsIHNldF9pZHMsIHNwYWNlVXNlcjtcbiAgICBwZXJtaXNzaW9ucyA9IHt9O1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKTtcbiAgICBpZiAoc3BhY2VJZCA9PT0gJ2d1ZXN0JyB8fCBvYmplY3RfbmFtZSA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fTtcbiAgICAgIENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zKHBlcm1pc3Npb25zKTtcbiAgICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgICB9XG4gICAgcHNldHNBZG1pbiA9IF8uaXNOdWxsKHRoaXMucHNldHNBZG1pbikgfHwgdGhpcy5wc2V0c0FkbWluID8gdGhpcy5wc2V0c0FkbWluIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gXy5pc051bGwodGhpcy5wc2V0c1VzZXIpIHx8IHRoaXMucHNldHNVc2VyID8gdGhpcy5wc2V0c1VzZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzTWVtYmVyID0gXy5pc051bGwodGhpcy5wc2V0c01lbWJlcikgfHwgdGhpcy5wc2V0c01lbWJlciA/IHRoaXMucHNldHNNZW1iZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ21lbWJlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNHdWVzdCA9IF8uaXNOdWxsKHRoaXMucHNldHNHdWVzdCkgfHwgdGhpcy5wc2V0c0d1ZXN0ID8gdGhpcy5wc2V0c0d1ZXN0IDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdndWVzdCdcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNTdXBwbGllciA9IF8uaXNOdWxsKHRoaXMucHNldHNTdXBwbGllcikgfHwgdGhpcy5wc2V0c1N1cHBsaWVyID8gdGhpcy5wc2V0c1N1cHBsaWVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNDdXN0b21lciA9IF8uaXNOdWxsKHRoaXMucHNldHNDdXN0b21lcikgfHwgdGhpcy5wc2V0c0N1c3RvbWVyID8gdGhpcy5wc2V0c0N1c3RvbWVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdjdXN0b21lcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudDtcbiAgICBpZiAoIXBzZXRzKSB7XG4gICAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgICAgaWYgKHVzZXJJZCkge1xuICAgICAgICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgJG9yOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHVzZXJzOiB1c2VySWRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgbmFtZTogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcHNldHNBZG1pbl9wb3MgPSB0aGlzLnBzZXRzQWRtaW5fcG9zO1xuICAgIHBzZXRzVXNlcl9wb3MgPSB0aGlzLnBzZXRzVXNlcl9wb3M7XG4gICAgcHNldHNNZW1iZXJfcG9zID0gdGhpcy5wc2V0c01lbWJlcl9wb3M7XG4gICAgcHNldHNHdWVzdF9wb3MgPSB0aGlzLnBzZXRzR3Vlc3RfcG9zO1xuICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gdGhpcy5wc2V0c1N1cHBsaWVyX3BvcztcbiAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IHRoaXMucHNldHNDdXN0b21lcl9wb3M7XG4gICAgcHNldHNDdXJyZW50X3BvcyA9IHRoaXMucHNldHNDdXJyZW50X3BvcztcbiAgICBvcHNldEFkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuYWRtaW4pIHx8IHt9O1xuICAgIG9wc2V0VXNlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnVzZXIpIHx8IHt9O1xuICAgIG9wc2V0TWVtYmVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQubWVtYmVyKSB8fCB7fTtcbiAgICBvcHNldEd1ZXN0ID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9O1xuICAgIG9wc2V0U3VwcGxpZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5zdXBwbGllcikgfHwge307XG4gICAgb3BzZXRDdXN0b21lciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmN1c3RvbWVyKSB8fCB7fTtcbiAgICBpZiAocHNldHNBZG1pbikge1xuICAgICAgcG9zQWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNBZG1pbi5faWQpO1xuICAgICAgaWYgKHBvc0FkbWluKSB7XG4gICAgICAgIG9wc2V0QWRtaW4uYWxsb3dDcmVhdGUgPSBwb3NBZG1pbi5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRBZG1pbi5hbGxvd0RlbGV0ZSA9IHBvc0FkbWluLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldEFkbWluLmFsbG93RWRpdCA9IHBvc0FkbWluLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRBZG1pbi5hbGxvd1JlYWQgPSBwb3NBZG1pbi5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0QWRtaW4ubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0FkbWluLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0QWRtaW4udmlld0FsbFJlY29yZHMgPSBwb3NBZG1pbi52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRBZG1pbi5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0FkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEFkbWluLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0FkbWluLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zQWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRBZG1pbi5kaXNhYmxlZF9hY3Rpb25zID0gcG9zQWRtaW4uZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRBZG1pbi51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0FkbWluLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEFkbWluLnVuZWRpdGFibGVfZmllbGRzID0gcG9zQWRtaW4udW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0QWRtaW4udW5yZWxhdGVkX29iamVjdHMgPSBwb3NBZG1pbi51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgICAgb3BzZXRBZG1pbi51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc0FkbWluLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNVc2VyKSB7XG4gICAgICBwb3NVc2VyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1VzZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNVc2VyLl9pZCk7XG4gICAgICBpZiAocG9zVXNlcikge1xuICAgICAgICBvcHNldFVzZXIuYWxsb3dDcmVhdGUgPSBwb3NVc2VyLmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldFVzZXIuYWxsb3dEZWxldGUgPSBwb3NVc2VyLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldFVzZXIuYWxsb3dFZGl0ID0gcG9zVXNlci5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0VXNlci5hbGxvd1JlYWQgPSBwb3NVc2VyLmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRVc2VyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NVc2VyLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0VXNlci52aWV3QWxsUmVjb3JkcyA9IHBvc1VzZXIudmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0VXNlci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0VXNlci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NVc2VyLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRVc2VyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NVc2VyLmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0VXNlci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zVXNlci5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldFVzZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NVc2VyLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldFVzZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NVc2VyLnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldFVzZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NVc2VyLnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgICBvcHNldFVzZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NVc2VyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNNZW1iZXIpIHtcbiAgICAgIHBvc01lbWJlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNNZW1iZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNNZW1iZXIuX2lkKTtcbiAgICAgIGlmIChwb3NNZW1iZXIpIHtcbiAgICAgICAgb3BzZXRNZW1iZXIuYWxsb3dDcmVhdGUgPSBwb3NNZW1iZXIuYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0TWVtYmVyLmFsbG93RGVsZXRlID0gcG9zTWVtYmVyLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldE1lbWJlci5hbGxvd0VkaXQgPSBwb3NNZW1iZXIuYWxsb3dFZGl0O1xuICAgICAgICBvcHNldE1lbWJlci5hbGxvd1JlYWQgPSBwb3NNZW1iZXIuYWxsb3dSZWFkO1xuICAgICAgICBvcHNldE1lbWJlci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zTWVtYmVyLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnZpZXdBbGxSZWNvcmRzID0gcG9zTWVtYmVyLnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldE1lbWJlci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc01lbWJlci5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRNZW1iZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zTWVtYmVyLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRNZW1iZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc01lbWJlci5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldE1lbWJlci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zTWVtYmVyLmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnVucmVhZGFibGVfZmllbGRzID0gcG9zTWVtYmVyLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldE1lbWJlci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc01lbWJlci51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRNZW1iZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NNZW1iZXIudW5yZWxhdGVkX29iamVjdHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zTWVtYmVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNHdWVzdCkge1xuICAgICAgcG9zR3Vlc3QgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzR3Vlc3RfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNHdWVzdC5faWQpO1xuICAgICAgaWYgKHBvc0d1ZXN0KSB7XG4gICAgICAgIG9wc2V0R3Vlc3QuYWxsb3dDcmVhdGUgPSBwb3NHdWVzdC5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRHdWVzdC5hbGxvd0RlbGV0ZSA9IHBvc0d1ZXN0LmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldEd1ZXN0LmFsbG93RWRpdCA9IHBvc0d1ZXN0LmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRHdWVzdC5hbGxvd1JlYWQgPSBwb3NHdWVzdC5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0R3Vlc3QubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0d1ZXN0Lm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0R3Vlc3Qudmlld0FsbFJlY29yZHMgPSBwb3NHdWVzdC52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRHdWVzdC5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0d1ZXN0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEd1ZXN0LnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0d1ZXN0LnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRHdWVzdC5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zR3Vlc3QuZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRHdWVzdC5kaXNhYmxlZF9hY3Rpb25zID0gcG9zR3Vlc3QuZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRHdWVzdC51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0d1ZXN0LnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEd1ZXN0LnVuZWRpdGFibGVfZmllbGRzID0gcG9zR3Vlc3QudW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0R3Vlc3QudW5yZWxhdGVkX29iamVjdHMgPSBwb3NHdWVzdC51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgICAgb3BzZXRHdWVzdC51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc0d1ZXN0LnVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNTdXBwbGllcikge1xuICAgICAgcG9zU3VwcGxpZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzU3VwcGxpZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNTdXBwbGllci5faWQpO1xuICAgICAgaWYgKHBvc1N1cHBsaWVyKSB7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIuYWxsb3dDcmVhdGUgPSBwb3NTdXBwbGllci5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRTdXBwbGllci5hbGxvd0RlbGV0ZSA9IHBvc1N1cHBsaWVyLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldFN1cHBsaWVyLmFsbG93RWRpdCA9IHBvc1N1cHBsaWVyLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRTdXBwbGllci5hbGxvd1JlYWQgPSBwb3NTdXBwbGllci5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1N1cHBsaWVyLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIudmlld0FsbFJlY29yZHMgPSBwb3NTdXBwbGllci52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRTdXBwbGllci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc1N1cHBsaWVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldFN1cHBsaWVyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1N1cHBsaWVyLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRTdXBwbGllci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zU3VwcGxpZXIuZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRTdXBwbGllci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zU3VwcGxpZXIuZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRTdXBwbGllci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1N1cHBsaWVyLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldFN1cHBsaWVyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zU3VwcGxpZXIudW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NTdXBwbGllci51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgICAgb3BzZXRTdXBwbGllci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc1N1cHBsaWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNDdXN0b21lcikge1xuICAgICAgcG9zQ3VzdG9tZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VzdG9tZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNDdXN0b21lci5faWQpO1xuICAgICAgaWYgKHBvc0N1c3RvbWVyKSB7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIuYWxsb3dDcmVhdGUgPSBwb3NDdXN0b21lci5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRDdXN0b21lci5hbGxvd0RlbGV0ZSA9IHBvc0N1c3RvbWVyLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldEN1c3RvbWVyLmFsbG93RWRpdCA9IHBvc0N1c3RvbWVyLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRDdXN0b21lci5hbGxvd1JlYWQgPSBwb3NDdXN0b21lci5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0N1c3RvbWVyLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIudmlld0FsbFJlY29yZHMgPSBwb3NDdXN0b21lci52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRDdXN0b21lci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0N1c3RvbWVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEN1c3RvbWVyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0N1c3RvbWVyLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRDdXN0b21lci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zQ3VzdG9tZXIuZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRDdXN0b21lci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zQ3VzdG9tZXIuZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRDdXN0b21lci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0N1c3RvbWVyLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEN1c3RvbWVyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zQ3VzdG9tZXIudW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NDdXN0b21lci51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgICAgb3BzZXRDdXN0b21lci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc0N1c3RvbWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEFkbWluO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRBZG1pbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzcGFjZUlkID09PSAnY29tbW9uJykge1xuICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYWNlVXNlciA9IF8uaXNOdWxsKHRoaXMuc3BhY2VVc2VyKSB8fCB0aGlzLnNwYWNlVXNlciA/IHRoaXMuc3BhY2VVc2VyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHNwYWNlVXNlcikge1xuICAgICAgICAgICAgcHJvZiA9IHNwYWNlVXNlci5wcm9maWxlO1xuICAgICAgICAgICAgaWYgKHByb2YpIHtcbiAgICAgICAgICAgICAgaWYgKHByb2YgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdtZW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldE1lbWJlcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnZ3Vlc3QnKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0O1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdzdXBwbGllcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0U3VwcGxpZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRDdXN0b21lcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHNldF9pZHMgPSBfLnBsdWNrKHBzZXRzLCBcIl9pZFwiKTtcbiAgICAgIHBvcyA9IGZpbmRfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXJyZW50X3Bvcywgb2JqZWN0X25hbWUsIHNldF9pZHMpO1xuICAgICAgcG9zID0gdW5pb25QZXJtaXNzaW9uT2JqZWN0cyhwb3MsIG9iamVjdCwgcHNldHMpO1xuICAgICAgXy5lYWNoKHBvcywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgaWYgKHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNBZG1pbiAhPSBudWxsID8gcHNldHNBZG1pbi5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNVc2VyICE9IG51bGwgPyBwc2V0c1VzZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzTWVtYmVyICE9IG51bGwgPyBwc2V0c01lbWJlci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNHdWVzdCAhPSBudWxsID8gcHNldHNHdWVzdC5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNTdXBwbGllciAhPSBudWxsID8gcHNldHNTdXBwbGllci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNDdXN0b21lciAhPSBudWxsID8gcHNldHNDdXN0b21lci5faWQgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfLmlzRW1wdHkocGVybWlzc2lvbnMpKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMgPSBwbztcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8uYWxsb3dSZWFkKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8uYWxsb3dDcmVhdGUpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLmFsbG93RWRpdCkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLmFsbG93RGVsZXRlKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLnZpZXdBbGxSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8udmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzLCBwby5kaXNhYmxlZF9saXN0X3ZpZXdzKTtcbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgcG8uZGlzYWJsZWRfYWN0aW9ucyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgcG8udW5yZWFkYWJsZV9maWVsZHMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIHBvLnVuZWRpdGFibGVfZmllbGRzKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBwby51bnJlbGF0ZWRfb2JqZWN0cyk7XG4gICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QsIHBvLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAob2JqZWN0LmlzX3ZpZXcpIHtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IFtdO1xuICAgIH1cbiAgICBDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyhwZXJtaXNzaW9ucyk7XG4gICAgaWYgKG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lcikge1xuICAgICAgcGVybWlzc2lvbnMub3duZXIgPSBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXI7XG4gICAgfVxuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfTtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIFwiY3JlYXRvci5vYmplY3RfcGVybWlzc2lvbnNcIjogZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdGhpcy51c2VySWQpO1xuICAgIH1cbiAgfSk7XG59XG4iLCJcbnN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpXG5cbk1ldGVvci5zdGFydHVwICgpLT5cblx0Y3JlYXRvcl9kYl91cmwgPSBwcm9jZXNzLmVudi5NT05HT19VUkxfQ1JFQVRPUlxuXHRvcGxvZ191cmwgPSBwcm9jZXNzLmVudi5NT05HT19PUExPR19VUkxfQ1JFQVRPUlxuXHRpZiBjcmVhdG9yX2RiX3VybFxuXHRcdGlmICFvcGxvZ191cmxcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIlBsZWFzZSBjb25maWd1cmUgZW52aXJvbm1lbnQgdmFyaWFibGVzOiBNT05HT19PUExPR19VUkxfQ1JFQVRPUlwiKVxuXHRcdENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSA9IHtfZHJpdmVyOiBuZXcgTW9uZ29JbnRlcm5hbHMuUmVtb3RlQ29sbGVjdGlvbkRyaXZlcihjcmVhdG9yX2RiX3VybCwge29wbG9nVXJsOiBvcGxvZ191cmx9KX1cblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZSA9IChvYmplY3QpLT5cbiNcdGlmIG9iamVjdC50YWJsZV9uYW1lICYmIG9iamVjdC50YWJsZV9uYW1lLmVuZHNXaXRoKFwiX19jXCIpXG4jXHRcdHJldHVybiBvYmplY3QudGFibGVfbmFtZVxuI1x0ZWxzZVxuI1x0XHRyZXR1cm4gb2JqZWN0Lm5hbWVcblx0cmV0dXJuIG9iamVjdC5uYW1lXG5DcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24gPSAob2JqZWN0KS0+XG5cdGNvbGxlY3Rpb25fa2V5ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmplY3QpXG5cdGlmIGRiW2NvbGxlY3Rpb25fa2V5XVxuXHRcdHJldHVybiBkYltjb2xsZWN0aW9uX2tleV1cblx0ZWxzZSBpZiBvYmplY3QuZGJcblx0XHRyZXR1cm4gb2JqZWN0LmRiXG5cblx0aWYgQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV1cblx0XHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV1cblx0ZWxzZVxuXHRcdGlmIG9iamVjdC5jdXN0b21cblx0XHRcdHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5LCBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UpXG5cdFx0ZWxzZVxuXHRcdFx0aWYgY29sbGVjdGlvbl9rZXkgPT0gJ19zbXNfcXVldWUnICYmIFNNU1F1ZXVlPy5jb2xsZWN0aW9uXG5cdFx0XHRcdHJldHVybiBTTVNRdWV1ZS5jb2xsZWN0aW9uXG5cdFx0XHRyZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSlcblxuXG4iLCJ2YXIgc3RlZWRvc0NvcmU7XG5cbnN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpO1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIGNyZWF0b3JfZGJfdXJsLCBvcGxvZ191cmw7XG4gIGNyZWF0b3JfZGJfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fVVJMX0NSRUFUT1I7XG4gIG9wbG9nX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SO1xuICBpZiAoY3JlYXRvcl9kYl91cmwpIHtcbiAgICBpZiAoIW9wbG9nX3VybCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiUGxlYXNlIGNvbmZpZ3VyZSBlbnZpcm9ubWVudCB2YXJpYWJsZXM6IE1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXCIpO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFID0ge1xuICAgICAgX2RyaXZlcjogbmV3IE1vbmdvSW50ZXJuYWxzLlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoY3JlYXRvcl9kYl91cmwsIHtcbiAgICAgICAgb3Bsb2dVcmw6IG9wbG9nX3VybFxuICAgICAgfSlcbiAgICB9O1xuICB9XG59KTtcblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gb2JqZWN0Lm5hbWU7XG59O1xuXG5DcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIGNvbGxlY3Rpb25fa2V5O1xuICBjb2xsZWN0aW9uX2tleSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqZWN0KTtcbiAgaWYgKGRiW2NvbGxlY3Rpb25fa2V5XSkge1xuICAgIHJldHVybiBkYltjb2xsZWN0aW9uX2tleV07XG4gIH0gZWxzZSBpZiAob2JqZWN0LmRiKSB7XG4gICAgcmV0dXJuIG9iamVjdC5kYjtcbiAgfVxuICBpZiAoQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV0pIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV07XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iamVjdC5jdXN0b20pIHtcbiAgICAgIHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5LCBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY29sbGVjdGlvbl9rZXkgPT09ICdfc21zX3F1ZXVlJyAmJiAodHlwZW9mIFNNU1F1ZXVlICE9PSBcInVuZGVmaW5lZFwiICYmIFNNU1F1ZXVlICE9PSBudWxsID8gU01TUXVldWUuY29sbGVjdGlvbiA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmV0dXJuIFNNU1F1ZXVlLmNvbGxlY3Rpb247XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSk7XG4gICAgfVxuICB9XG59O1xuIiwiQ3JlYXRvci5hY3Rpb25zQnlOYW1lID0ge31cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cblx0IyDlrprkuYnlhajlsYAgYWN0aW9ucyDlh73mlbBcdFxuXHRDcmVhdG9yLmFjdGlvbnMgPSAoYWN0aW9ucyktPlxuXHRcdF8uZWFjaCBhY3Rpb25zLCAodG9kbywgYWN0aW9uX25hbWUpLT5cblx0XHRcdENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb25fbmFtZV0gPSB0b2RvIFxuXG5cdENyZWF0b3IuZXhlY3V0ZUFjdGlvbiA9IChvYmplY3RfbmFtZSwgYWN0aW9uLCByZWNvcmRfaWQsIGl0ZW1fZWxlbWVudCwgbGlzdF92aWV3X2lkLCByZWNvcmQpLT5cblx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRpZiBhY3Rpb24/LnRvZG9cblx0XHRcdGlmIHR5cGVvZiBhY3Rpb24udG9kbyA9PSBcInN0cmluZ1wiXG5cdFx0XHRcdHRvZG8gPSBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uLnRvZG9dXG5cdFx0XHRlbHNlIGlmIHR5cGVvZiBhY3Rpb24udG9kbyA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0dG9kbyA9IGFjdGlvbi50b2RvXHRcblx0XHRcdGlmICFyZWNvcmQgJiYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkXG5cdFx0XHRcdHJlY29yZCA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRpZiB0b2RvXG5cdFx0XHRcdCMgaXRlbV9lbGVtZW505Li656m65pe25bqU6K+l6K6+572u6buY6K6k5YC877yI5a+56LGh55qEbmFtZeWtl+aute+8ie+8jOWQpuWImW1vcmVBcmdz5ou/5Yiw55qE5ZCO57ut5Y+C5pWw5L2N572u5bCx5LiN5a+5XG5cdFx0XHRcdGl0ZW1fZWxlbWVudCA9IGlmIGl0ZW1fZWxlbWVudCB0aGVuIGl0ZW1fZWxlbWVudCBlbHNlIFwiXCJcblx0XHRcdFx0bW9yZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpXG5cdFx0XHRcdHRvZG9BcmdzID0gW29iamVjdF9uYW1lLCByZWNvcmRfaWRdLmNvbmNhdChtb3JlQXJncylcblx0XHRcdFx0dG9kby5hcHBseSB7XG5cdFx0XHRcdFx0b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG5cdFx0XHRcdFx0cmVjb3JkX2lkOiByZWNvcmRfaWRcblx0XHRcdFx0XHRvYmplY3Q6IG9ialxuXHRcdFx0XHRcdGFjdGlvbjogYWN0aW9uXG5cdFx0XHRcdFx0aXRlbV9lbGVtZW50OiBpdGVtX2VsZW1lbnRcblx0XHRcdFx0XHRyZWNvcmQ6IHJlY29yZFxuXHRcdFx0XHR9LCB0b2RvQXJnc1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSlcblx0XHRlbHNlXG5cdFx0XHR0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSlcblxuXHRcdFx0XHRcblxuXHRDcmVhdG9yLmFjdGlvbnMgXG5cdFx0IyDlnKjmraTlrprkuYnlhajlsYAgYWN0aW9uc1xuXHRcdFwic3RhbmRhcmRfcXVlcnlcIjogKCktPlxuXHRcdFx0TW9kYWwuc2hvdyhcInN0YW5kYXJkX3F1ZXJ5X21vZGFsXCIpXG5cblx0XHRcInN0YW5kYXJkX25ld1wiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XG5cdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdGlkcyA9IENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzW29iamVjdF9uYW1lXVxuXHRcdFx0aWYgaWRzPy5sZW5ndGhcblx0XHRcdFx0IyDliJfooajmnInpgInkuK3pobnml7bvvIzlj5bnrKzkuIDkuKrpgInkuK3pobnvvIzlpI3liLblhbblhoXlrrnliLDmlrDlu7rnqpflj6PkuK1cblx0XHRcdFx0IyDov5nnmoTnrKzkuIDkuKrmjIfnmoTmmK/nrKzkuIDmrKHli77pgInnmoTpgInkuK3pobnvvIzogIzkuI3mmK/liJfooajkuK3lt7Lli77pgInnmoTnrKzkuIDpoblcblx0XHRcdFx0cmVjb3JkX2lkID0gaWRzWzBdXG5cdFx0XHRcdGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIGRvY1xuXHRcdFx0XHQjIOKAnOS/neWtmOW5tuaWsOW7uuKAneaTjeS9nOS4reiHquWKqOaJk+W8gOeahOaWsOeql+WPo+S4remcgOimgeWGjeasoeWkjeWItuacgOaWsOeahGRvY+WGheWuueWIsOaWsOeql+WPo+S4rVxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCBGb3JtTWFuYWdlci5nZXRJbml0aWFsVmFsdWVzKG9iamVjdF9uYW1lKVxuXHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cblx0XHRcdFx0JChcIi5jcmVhdG9yLWFkZFwiKS5jbGljaygpXG5cdFx0XHRyZXR1cm4gXG5cblx0XHRcInN0YW5kYXJkX29wZW5fdmlld1wiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XG5cdFx0XHRocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdEZsb3dSb3V0ZXIucmVkaXJlY3QoaHJlZilcblx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0XCJzdGFuZGFyZF9lZGl0XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cblx0XHRcdGlmIHJlY29yZF9pZFxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgJiYgZmFsc2VcbiNcdFx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcbiNcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgcmVjb3JkXG4jXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdyZWxvYWRfZHhsaXN0JywgZmFsc2Vcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZFxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdE1ldGVvci5kZWZlciAoKS0+XG5cdFx0XHRcdFx0XHQkKFwiLmJ0bi1lZGl0LXJlY29yZFwiKS5jbGljaygpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZFxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cblx0XHRcdFx0XHRcdFx0JChcIi5idG4uY3JlYXRvci1lZGl0XCIpLmNsaWNrKClcblxuXHRcdFwic3RhbmRhcmRfZGVsZXRlXCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2spLT5cblx0XHRcdGNvbnNvbGUubG9nKFwic3RhbmRhcmRfZGVsZXRlXCIsIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkKVxuXHRcdFx0YmVmb3JlSG9vayA9IEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYmVmb3JlJywge19pZDogcmVjb3JkX2lkfSlcblx0XHRcdGlmICFiZWZvcmVIb29rXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdFx0XHRpZighXy5pc1N0cmluZyhyZWNvcmRfdGl0bGUpICYmIHJlY29yZF90aXRsZT8ubmFtZSlcblx0XHRcdFx0cmVjb3JkX3RpdGxlID0gcmVjb3JkX3RpdGxlPy5uYW1lXG5cblx0XHRcdGlmIHJlY29yZF90aXRsZVxuXHRcdFx0XHR0ZXh0ID0gdCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIiwgXCIje29iamVjdC5sYWJlbH0gXFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0ZXh0ID0gdCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIiwgXCIje29iamVjdC5sYWJlbH1cIlxuXHRcdFx0c3dhbFxuXHRcdFx0XHR0aXRsZTogdCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlXCIsIFwiI3tvYmplY3QubGFiZWx9XCJcblx0XHRcdFx0dGV4dDogXCI8ZGl2IGNsYXNzPSdkZWxldGUtY3JlYXRvci13YXJuaW5nJz4je3RleHR9PC9kaXY+XCJcblx0XHRcdFx0aHRtbDogdHJ1ZVxuXHRcdFx0XHRzaG93Q2FuY2VsQnV0dG9uOnRydWVcblx0XHRcdFx0Y29uZmlybUJ1dHRvblRleHQ6IHQoJ0RlbGV0ZScpXG5cdFx0XHRcdGNhbmNlbEJ1dHRvblRleHQ6IHQoJ0NhbmNlbCcpXG5cdFx0XHRcdChvcHRpb24pIC0+XG5cdFx0XHRcdFx0aWYgb3B0aW9uXG5cdFx0XHRcdFx0XHRwcmV2aW91c0RvYyA9IEZvcm1NYW5hZ2VyLmdldFByZXZpb3VzRG9jKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsICdkZWxldGUnKVxuXHRcdFx0XHRcdFx0Q3JlYXRvci5vZGF0YS5kZWxldGUgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgKCktPlxuXHRcdFx0XHRcdFx0XHRpZiByZWNvcmRfdGl0bGVcblx0XHRcdFx0XHRcdFx0XHQjIGluZm8gPSBvYmplY3QubGFiZWwgKyBcIlxcXCIje3JlY29yZF90aXRsZX1cXFwiXCIgKyBcIuW3suWIoOmZpFwiXG5cdFx0XHRcdFx0XHRcdFx0aW5mbyA9dCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlX3N1Y1wiLCBvYmplY3QubGFiZWwgKyBcIlxcXCIje3JlY29yZF90aXRsZX1cXFwiXCJcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGluZm8gPSB0KCdjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF9zdWMnKVxuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyBpbmZvXG5cdFx0XHRcdFx0XHRcdCMg5paH5Lu254mI5pys5Li6XCJjZnMuZmlsZXMuZmlsZXJlY29yZFwi77yM6ZyA6KaB5pu/5o2i5Li6XCJjZnMtZmlsZXMtZmlsZXJlY29yZFwiXG5cdFx0XHRcdFx0XHRcdGdyaWRPYmplY3ROYW1lQ2xhc3MgPSBvYmplY3RfbmFtZS5yZXBsYWNlKC9cXC4vZyxcIi1cIilcblx0XHRcdFx0XHRcdFx0Z3JpZENvbnRhaW5lciA9ICQoXCIuZ3JpZENvbnRhaW5lci4je2dyaWRPYmplY3ROYW1lQ2xhc3N9XCIpXG5cdFx0XHRcdFx0XHRcdHVubGVzcyBncmlkQ29udGFpbmVyPy5sZW5ndGhcblx0XHRcdFx0XHRcdFx0XHRpZiB3aW5kb3cub3BlbmVyXG5cdFx0XHRcdFx0XHRcdFx0XHRpc09wZW5lclJlbW92ZSA9IHRydWVcblx0XHRcdFx0XHRcdFx0XHRcdGdyaWRDb250YWluZXIgPSB3aW5kb3cub3BlbmVyLiQoXCIuZ3JpZENvbnRhaW5lci4je2dyaWRPYmplY3ROYW1lQ2xhc3N9XCIpXG5cdFx0XHRcdFx0XHRcdGlmIGdyaWRDb250YWluZXI/Lmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfdHJlZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keFRyZWVMaXN0KCkuZHhUcmVlTGlzdCgnaW5zdGFuY2UnKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhEYXRhR3JpZCgpLmR4RGF0YUdyaWQoJ2luc3RhbmNlJylcblx0XHRcdFx0XHRcdFx0aWYgZHhEYXRhR3JpZEluc3RhbmNlXG5cdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV90cmVlXG5cdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UucmVmcmVzaCgpXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0X25hbWUgIT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLnJlbG9hZCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRUZW1wbGF0ZS5jcmVhdG9yX2dyaWQucmVmcmVzaChkeERhdGFHcmlkSW5zdGFuY2UpXG5cdFx0XHRcdFx0XHRcdHJlY29yZFVybCA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRcdFx0XHRcdHRlbXBOYXZSZW1vdmVkID0gQ3JlYXRvci5yZW1vdmVUZW1wTmF2SXRlbShvYmplY3RfbmFtZSwgcmVjb3JkVXJsKSAj5peg6K665piv5Zyo6K6w5b2V6K+m57uG55WM6Z2i6L+Y5piv5YiX6KGo55WM6Z2i5omn6KGM5Yig6Zmk5pON5L2c77yM6YO95Lya5oqK5Li05pe25a+86Iiq5Yig6Zmk5o6JXG5cdFx0XHRcdFx0XHRcdGlmIGlzT3BlbmVyUmVtb3ZlIG9yICFkeERhdGFHcmlkSW5zdGFuY2Vcblx0XHRcdFx0XHRcdFx0XHRpZiBpc09wZW5lclJlbW92ZVxuXHRcdFx0XHRcdFx0XHRcdFx0d2luZG93LmNsb3NlKClcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIHJlY29yZF9pZCA9PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSBhbmQgbGlzdF92aWV3X2lkICE9ICdjYWxlbmRhcidcblx0XHRcdFx0XHRcdFx0XHRcdGFwcGlkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcblx0XHRcdFx0XHRcdFx0XHRcdHVubGVzcyBsaXN0X3ZpZXdfaWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcblx0XHRcdFx0XHRcdFx0XHRcdHVubGVzcyBsaXN0X3ZpZXdfaWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGlzdF92aWV3X2lkID0gXCJhbGxcIlxuXHRcdFx0XHRcdFx0XHRcdFx0dW5sZXNzIHRlbXBOYXZSZW1vdmVkXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c56Gu5a6e5Yig6Zmk5LqG5Li05pe25a+86Iiq77yM5bCx5Y+v6IO95bey57uP6YeN5a6a5ZCR5Yiw5LiK5LiA5Liq6aG16Z2i5LqG77yM5rKh5b+F6KaB5YaN6YeN5a6a5ZCR5LiA5qyhXG5cdFx0XHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIuZ28gXCIvYXBwLyN7YXBwaWR9LyN7b2JqZWN0X25hbWV9L2dyaWQvI3tsaXN0X3ZpZXdfaWR9XCJcblx0XHRcdFx0XHRcdFx0aWYgY2FsbF9iYWNrIGFuZCB0eXBlb2YgY2FsbF9iYWNrID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRcdFx0XHRcdGNhbGxfYmFjaygpXG5cblx0XHRcdFx0XHRcdFx0Rm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdhZnRlcicsIHtfaWQ6IHJlY29yZF9pZCwgcHJldmlvdXNEb2M6IHByZXZpb3VzRG9jfSlcblx0XHRcdFx0XHRcdCwgKGVycm9yKS0+XG5cdFx0XHRcdFx0XHRcdEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnZXJyb3InLCB7X2lkOiByZWNvcmRfaWQsIGVycm9yOiBlcnJvcn0pIiwiQ3JlYXRvci5hY3Rpb25zQnlOYW1lID0ge307XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5hY3Rpb25zID0gZnVuY3Rpb24oYWN0aW9ucykge1xuICAgIHJldHVybiBfLmVhY2goYWN0aW9ucywgZnVuY3Rpb24odG9kbywgYWN0aW9uX25hbWUpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uX25hbWVdID0gdG9kbztcbiAgICB9KTtcbiAgfTtcbiAgQ3JlYXRvci5leGVjdXRlQWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkKSB7XG4gICAgdmFyIG1vcmVBcmdzLCBvYmosIHRvZG8sIHRvZG9BcmdzO1xuICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMCkge1xuICAgICAgaWYgKHR5cGVvZiBhY3Rpb24udG9kbyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFjdGlvbi50b2RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdG9kbyA9IGFjdGlvbi50b2RvO1xuICAgICAgfVxuICAgICAgaWYgKCFyZWNvcmQgJiYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgICAgIHJlY29yZCA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgfVxuICAgICAgaWYgKHRvZG8pIHtcbiAgICAgICAgaXRlbV9lbGVtZW50ID0gaXRlbV9lbGVtZW50ID8gaXRlbV9lbGVtZW50IDogXCJcIjtcbiAgICAgICAgbW9yZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuICAgICAgICB0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpO1xuICAgICAgICByZXR1cm4gdG9kby5hcHBseSh7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICAgIHJlY29yZF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgIG9iamVjdDogb2JqLFxuICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgIGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50LFxuICAgICAgICAgIHJlY29yZDogcmVjb3JkXG4gICAgICAgIH0sIHRvZG9BcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSk7XG4gICAgfVxuICB9O1xuICBDcmVhdG9yLmFjdGlvbnMoe1xuICAgIFwic3RhbmRhcmRfcXVlcnlcIjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gTW9kYWwuc2hvdyhcInN0YW5kYXJkX3F1ZXJ5X21vZGFsXCIpO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9uZXdcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgZG9jLCBpZHM7XG4gICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgaWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbb2JqZWN0X25hbWVdO1xuICAgICAgaWYgKGlkcyAhPSBudWxsID8gaWRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICByZWNvcmRfaWQgPSBpZHNbMF07XG4gICAgICAgIGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBkb2MpO1xuICAgICAgICBTZXNzaW9uLnNldCgnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBGb3JtTWFuYWdlci5nZXRJbml0aWFsVmFsdWVzKG9iamVjdF9uYW1lKSk7XG4gICAgICB9XG4gICAgICBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGhyZWY7XG4gICAgICBocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICBGbG93Um91dGVyLnJlZGlyZWN0KGhyZWYpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9lZGl0XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIGZhbHNlKSB7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZCk7XG4gICAgICAgICAgaWYgKHRoaXMucmVjb3JkKSB7XG4gICAgICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCB0aGlzLnJlY29yZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIi5idG4tZWRpdC1yZWNvcmRcIikuY2xpY2soKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIHRoaXMucmVjb3JkKTtcbiAgICAgICAgICAgIHJldHVybiBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiAkKFwiLmJ0bi5jcmVhdG9yLWVkaXRcIikuY2xpY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9kZWxldGVcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrKSB7XG4gICAgICB2YXIgYmVmb3JlSG9vaywgb2JqZWN0LCB0ZXh0O1xuICAgICAgY29uc29sZS5sb2coXCJzdGFuZGFyZF9kZWxldGVcIiwgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQpO1xuICAgICAgYmVmb3JlSG9vayA9IEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYmVmb3JlJywge1xuICAgICAgICBfaWQ6IHJlY29yZF9pZFxuICAgICAgfSk7XG4gICAgICBpZiAoIWJlZm9yZUhvb2spIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgICAgaWYgKCFfLmlzU3RyaW5nKHJlY29yZF90aXRsZSkgJiYgKHJlY29yZF90aXRsZSAhPSBudWxsID8gcmVjb3JkX3RpdGxlLm5hbWUgOiB2b2lkIDApKSB7XG4gICAgICAgIHJlY29yZF90aXRsZSA9IHJlY29yZF90aXRsZSAhPSBudWxsID8gcmVjb3JkX3RpdGxlLm5hbWUgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgICBpZiAocmVjb3JkX3RpdGxlKSB7XG4gICAgICAgIHRleHQgPSB0KFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGV4dFwiLCBvYmplY3QubGFiZWwgKyBcIiBcXFwiXCIgKyByZWNvcmRfdGl0bGUgKyBcIlxcXCJcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0ID0gdChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIiwgXCJcIiArIG9iamVjdC5sYWJlbCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3dhbCh7XG4gICAgICAgIHRpdGxlOiB0KFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGl0bGVcIiwgXCJcIiArIG9iamVjdC5sYWJlbCksXG4gICAgICAgIHRleHQ6IFwiPGRpdiBjbGFzcz0nZGVsZXRlLWNyZWF0b3Itd2FybmluZyc+XCIgKyB0ZXh0ICsgXCI8L2Rpdj5cIixcbiAgICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IHQoJ0RlbGV0ZScpLFxuICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiB0KCdDYW5jZWwnKVxuICAgICAgfSwgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHZhciBwcmV2aW91c0RvYztcbiAgICAgICAgaWYgKG9wdGlvbikge1xuICAgICAgICAgIHByZXZpb3VzRG9jID0gRm9ybU1hbmFnZXIuZ2V0UHJldmlvdXNEb2Mob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgJ2RlbGV0ZScpO1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLm9kYXRhW1wiZGVsZXRlXCJdKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGFwcGlkLCBkeERhdGFHcmlkSW5zdGFuY2UsIGdyaWRDb250YWluZXIsIGdyaWRPYmplY3ROYW1lQ2xhc3MsIGluZm8sIGlzT3BlbmVyUmVtb3ZlLCByZWNvcmRVcmwsIHRlbXBOYXZSZW1vdmVkO1xuICAgICAgICAgICAgaWYgKHJlY29yZF90aXRsZSkge1xuICAgICAgICAgICAgICBpbmZvID0gdChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlX3N1Y1wiLCBvYmplY3QubGFiZWwgKyAoXCJcXFwiXCIgKyByZWNvcmRfdGl0bGUgKyBcIlxcXCJcIikpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaW5mbyA9IHQoJ2NyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3N1YycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoaW5mbyk7XG4gICAgICAgICAgICBncmlkT2JqZWN0TmFtZUNsYXNzID0gb2JqZWN0X25hbWUucmVwbGFjZSgvXFwuL2csIFwiLVwiKTtcbiAgICAgICAgICAgIGdyaWRDb250YWluZXIgPSAkKFwiLmdyaWRDb250YWluZXIuXCIgKyBncmlkT2JqZWN0TmFtZUNsYXNzKTtcbiAgICAgICAgICAgIGlmICghKGdyaWRDb250YWluZXIgIT0gbnVsbCA/IGdyaWRDb250YWluZXIubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICBpZiAod2luZG93Lm9wZW5lcikge1xuICAgICAgICAgICAgICAgIGlzT3BlbmVyUmVtb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBncmlkQ29udGFpbmVyID0gd2luZG93Lm9wZW5lci4kKFwiLmdyaWRDb250YWluZXIuXCIgKyBncmlkT2JqZWN0TmFtZUNsYXNzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdyaWRDb250YWluZXIgIT0gbnVsbCA/IGdyaWRDb250YWluZXIubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgICAgICAgIGlmIChvYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4VHJlZUxpc3QoKS5keFRyZWVMaXN0KCdpbnN0YW5jZScpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhEYXRhR3JpZCgpLmR4RGF0YUdyaWQoJ2luc3RhbmNlJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkeERhdGFHcmlkSW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgaWYgKG9iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICAgIGR4RGF0YUdyaWRJbnN0YW5jZS5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdF9uYW1lICE9PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpKSB7XG4gICAgICAgICAgICAgICAgICBGbG93Um91dGVyLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBUZW1wbGF0ZS5jcmVhdG9yX2dyaWQucmVmcmVzaChkeERhdGFHcmlkSW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVjb3JkVXJsID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICAgICAgICB0ZW1wTmF2UmVtb3ZlZCA9IENyZWF0b3IucmVtb3ZlVGVtcE5hdkl0ZW0ob2JqZWN0X25hbWUsIHJlY29yZFVybCk7XG4gICAgICAgICAgICBpZiAoaXNPcGVuZXJSZW1vdmUgfHwgIWR4RGF0YUdyaWRJbnN0YW5jZSkge1xuICAgICAgICAgICAgICBpZiAoaXNPcGVuZXJSZW1vdmUpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZWNvcmRfaWQgPT09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpICYmIGxpc3Rfdmlld19pZCAhPT0gJ2NhbGVuZGFyJykge1xuICAgICAgICAgICAgICAgIGFwcGlkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gICAgICAgICAgICAgICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgICAgICAgICAgICAgIGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgICAgICAgICAgICAgbGlzdF92aWV3X2lkID0gXCJhbGxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCF0ZW1wTmF2UmVtb3ZlZCkge1xuICAgICAgICAgICAgICAgICAgRmxvd1JvdXRlci5nbyhcIi9hcHAvXCIgKyBhcHBpZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjYWxsX2JhY2sgJiYgdHlwZW9mIGNhbGxfYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIGNhbGxfYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYWZ0ZXInLCB7XG4gICAgICAgICAgICAgIF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgICAgICBwcmV2aW91c0RvYzogcHJldmlvdXNEb2NcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdlcnJvcicsIHtcbiAgICAgICAgICAgICAgX2lkOiByZWNvcmRfaWQsXG4gICAgICAgICAgICAgIGVycm9yOiBlcnJvclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=
