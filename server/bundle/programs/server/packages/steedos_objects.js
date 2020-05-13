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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_objects/core.coffee                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"loadStandardObjects.coffee":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_objects/loadStandardObjects.coffee                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"coreSupport.coffee":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_objects/coreSupport.coffee                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
      return relatedListMap[objName] = {};
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"methods":{"object_options.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_objects/server/methods/object_options.coffee                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"routes":{"api_workflow_view_instance.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_objects/server/routes/api_workflow_view_instance.coffee                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"lib":{"listviews.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_objects/lib/listviews.coffee                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    var _object, list, relatedList, related_objects;

    list = [];
    related_objects = Creator.getRelatedObjects(object_name);

    _.each(related_objects, function (related_object_item) {
      var columns, order, related, related_field_name, related_object, related_object_name, sharing, tabular_order;
      related_object_name = related_object_item.object_name;
      related_field_name = related_object_item.foreign_key;
      sharing = related_object_item.sharing;
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
        is_file: related_object_name === "cms_files",
        sharing: sharing
      };
      return list.push(related);
    });

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
              is_file: objOrName.objectName === "cms_files",
              filtersFunction: objOrName.filters,
              sort: objOrName.sort,
              related_field_name: ''
            };
            return list.push(related);
          }
        });
      }
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"add_simple_schema_validation_error.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_objects/lib/add_simple_schema_validation_error.coffee                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"field_simple_schema_validation_error.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_objects/lib/field_simple_schema_validation_error.coffee                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"eval.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_objects/lib/eval.js                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"convert.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_objects/lib/convert.coffee                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var convertField, getOption;

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
            enable: item.enable
          });

          if (item.enable) {
            options.push({
              label: label,
              value: value
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"formular.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_objects/lib/formular.coffee                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"object.coffee":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_objects/lib/object.coffee                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  self.form = options.form;

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

  if (_.has(options, 'in_development')) {
    self.in_development = options.in_development;
  }

  self.idFieldName = '_id';

  if (options.database_name) {
    self.database_name = options.database_name;
  }

  if (!options.fields) {
    console.error(options);
    throw new Error('Creator.Object options must specify name');
  }

  self.fields = clone(options.fields);

  _.each(self.fields, function (field, field_name) {
    if (field_name === 'name' || field.is_name) {
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fields.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_objects/lib/fields.coffee                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
      fs.autoform.afFieldInput = {
        type: "summernote",
        "class": 'summernote-editor',
        settings: {
          height: 200,
          dialogsInBody: true,
          toolbar: [['font1', ['style']], ['font2', ['bold', 'underline', 'italic', 'clear']], ['font3', ['fontname']], ['color', ['color']], ['para', ['ul', 'ol', 'paragraph']], ['table', ['table']], ['insert', ['link', 'picture']], ['view', ['codeview']]],
          fontNames: ['Arial', 'Comic Sans MS', 'Courier New', 'Helvetica', 'Impact', '宋体', '黑体', '微软雅黑', '仿宋', '楷体', '隶书', '幼圆'],
          lang: 'zh-CN'
        }
      };
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"triggers.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_objects/lib/triggers.coffee                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"permission_sets.coffee":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_objects/lib/permission_sets.coffee                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    var _i, isSpaceAdmin, permissions, psets, psetsAdmin, psetsAdmin_pos, psetsCurrent, psetsCurrentNames, psetsCurrent_pos, psetsGuest, psetsGuest_pos, psetsMember, psetsMember_pos, psetsUser, psetsUser_pos, set_ids, spaceUser;

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
      isSpaceAdmin: isSpaceAdmin,
      spaceUser: spaceUser,
      psetsAdmin_pos: psetsAdmin_pos,
      psetsUser_pos: psetsUser_pos,
      psetsMember_pos: psetsMember_pos,
      psetsGuest_pos: psetsGuest_pos,
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
        assigned_apps: 1,
        name: 1
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
    var aboutMenu, adminMenus, allMenus, currentPsetNames, isSpaceAdmin, menus, otherMenuApps, otherMenus, psets, ref, result;
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
    var isSpaceAdmin, object, opsetAdmin, opsetGuest, opsetMember, opsetUser, permissions, pos, posAdmin, posGuest, posMember, posUser, prof, psets, psetsAdmin, psetsAdmin_pos, psetsCurrent_pos, psetsGuest, psetsGuest_pos, psetsMember, psetsMember_pos, psetsUser, psetsUser_pos, set_ids, spaceUser;
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
    psetsCurrent_pos = this.psetsCurrent_pos;
    opsetAdmin = _.clone(object.permission_set.admin) || {};
    opsetUser = _.clone(object.permission_set.user) || {};
    opsetMember = _.clone(object.permission_set.member) || {};
    opsetGuest = _.clone(object.permission_set.guest) || {};

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
      pos = unionPermissionObjects(pos, object, psets);

      _.each(pos, function (po) {
        if (po.permission_set_id === (psetsAdmin != null ? psetsAdmin._id : void 0) || po.permission_set_id === (psetsUser != null ? psetsUser._id : void 0) || po.permission_set_id === (psetsMember != null ? psetsMember._id : void 0) || po.permission_set_id === (psetsGuest != null ? psetsGuest._id : void 0)) {
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"collections.coffee":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_objects/lib/collections.coffee                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"actions.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_objects/lib/actions.coffee                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    "standard_delete": function (object_name, record_id, record_title, list_view_id, record, call_back) {
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJEYXNoYm9hcmRzIiwiUmVwb3J0cyIsInN1YnMiLCJzdGVlZG9zU2NoZW1hIiwiZSIsInN0ZWVkb3NDb3JlIiwicmVxdWlyZSIsIk1ldGVvciIsImlzRGV2ZWxvcG1lbnQiLCJzdGFydHVwIiwiZXgiLCJpbml0IiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwiRmliZXIiLCJwYXRoIiwiZGVwcyIsImFwcCIsIlRyYWNrZXIiLCJEZXBlbmRlbmN5Iiwib2JqZWN0IiwiX1RFTVBMQVRFIiwiU2ltcGxlU2NoZW1hIiwiZXh0ZW5kT3B0aW9ucyIsImZpbHRlcnNGdW5jdGlvbiIsIk1hdGNoIiwiT3B0aW9uYWwiLCJPbmVPZiIsIkZ1bmN0aW9uIiwiU3RyaW5nIiwib3B0aW9uc0Z1bmN0aW9uIiwiY3JlYXRlRnVuY3Rpb24iLCJpc1NlcnZlciIsImZpYmVyTG9hZE9iamVjdHMiLCJvYmoiLCJvYmplY3RfbmFtZSIsImxvYWRPYmplY3RzIiwicnVuIiwibmFtZSIsImxpc3Rfdmlld3MiLCJzcGFjZSIsImdldENvbGxlY3Rpb25OYW1lIiwiXyIsImNsb25lIiwiY29udmVydE9iamVjdCIsIk9iamVjdCIsImluaXRUcmlnZ2VycyIsImluaXRMaXN0Vmlld3MiLCJnZXRPYmplY3ROYW1lIiwiZ2V0T2JqZWN0Iiwic3BhY2VfaWQiLCJyZWYiLCJyZWYxIiwiaXNBcnJheSIsImlzQ2xpZW50IiwiZGVwZW5kIiwiU2Vzc2lvbiIsImdldCIsIm9iamVjdHNCeU5hbWUiLCJnZXRPYmplY3RCeUlkIiwib2JqZWN0X2lkIiwiZmluZFdoZXJlIiwiX2lkIiwicmVtb3ZlT2JqZWN0IiwiZ2V0Q29sbGVjdGlvbiIsInNwYWNlSWQiLCJfY29sbGVjdGlvbl9uYW1lIiwicmVtb3ZlQ29sbGVjdGlvbiIsImlzU3BhY2VBZG1pbiIsInVzZXJJZCIsImZpbmRPbmUiLCJmaWVsZHMiLCJhZG1pbnMiLCJpbmRleE9mIiwiZXZhbHVhdGVGb3JtdWxhIiwiZm9ybXVsYXIiLCJjb250ZXh0Iiwib3B0aW9ucyIsImlzU3RyaW5nIiwiRm9ybXVsYXIiLCJjaGVja0Zvcm11bGEiLCJldmFsdWF0ZUZpbHRlcnMiLCJmaWx0ZXJzIiwic2VsZWN0b3IiLCJlYWNoIiwiZmlsdGVyIiwiYWN0aW9uIiwidmFsdWUiLCJsZW5ndGgiLCJpc0NvbW1vblNwYWNlIiwiZ2V0T3JkZXJseVNldEJ5SWRzIiwiZG9jcyIsImlkcyIsImlkX2tleSIsImhpdF9maXJzdCIsInZhbHVlcyIsImdldFByb3BlcnR5Iiwic29ydEJ5IiwiZG9jIiwiX2luZGV4Iiwic29ydGluZ01ldGhvZCIsInZhbHVlMSIsInZhbHVlMiIsImlzVmFsdWUxRW1wdHkiLCJpc1ZhbHVlMkVtcHR5IiwibG9jYWxlIiwia2V5IiwiRGF0ZSIsImdldFRpbWUiLCJTdGVlZG9zIiwidG9TdHJpbmciLCJsb2NhbGVDb21wYXJlIiwiZ2V0T2JqZWN0UmVsYXRlZHMiLCJfb2JqZWN0IiwicGVybWlzc2lvbnMiLCJyZWxhdGVkTGlzdCIsInJlbGF0ZWRMaXN0TWFwIiwicmVsYXRlZF9vYmplY3RzIiwiaXNFbXB0eSIsIm9iak5hbWUiLCJyZWxhdGVkX29iamVjdCIsInJlbGF0ZWRfb2JqZWN0X25hbWUiLCJyZWxhdGVkX2ZpZWxkIiwicmVsYXRlZF9maWVsZF9uYW1lIiwidHlwZSIsInJlZmVyZW5jZV90byIsImZvcmVpZ25fa2V5Iiwic2hhcmluZyIsImVuYWJsZU9iak5hbWUiLCJnZXRQZXJtaXNzaW9ucyIsImVuYWJsZV9hdWRpdCIsIm1vZGlmeUFsbFJlY29yZHMiLCJlbmFibGVfZmlsZXMiLCJwdXNoIiwic3BsaWNlIiwiZW5hYmxlX3Rhc2tzIiwiZW5hYmxlX25vdGVzIiwiZW5hYmxlX2V2ZW50cyIsImVuYWJsZV9pbnN0YW5jZXMiLCJlbmFibGVfYXBwcm92YWxzIiwiZ2V0VXNlckNvbnRleHQiLCJpc1VuU2FmZU1vZGUiLCJVU0VSX0NPTlRFWFQiLCJzcGFjZV91c2VyX29yZyIsInN1Iiwic3VGaWVsZHMiLCJFcnJvciIsIm1vYmlsZSIsInBvc2l0aW9uIiwiZW1haWwiLCJjb21wYW55Iiwib3JnYW5pemF0aW9uIiwiY29tcGFueV9pZCIsImNvbXBhbnlfaWRzIiwidXNlciIsImZ1bGxuYW1lIiwiZ2V0UmVsYXRpdmVVcmwiLCJ1cmwiLCJpc0Z1bmN0aW9uIiwiaXNDb3Jkb3ZhIiwic3RhcnRzV2l0aCIsInRlc3QiLCJfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fIiwiUk9PVF9VUkxfUEFUSF9QUkVGSVgiLCJnZXRVc2VyQ29tcGFueUlkIiwiZ2V0VXNlckNvbXBhbnlJZHMiLCJwcm9jZXNzUGVybWlzc2lvbnMiLCJwbyIsImFsbG93Q3JlYXRlIiwiYWxsb3dSZWFkIiwiYWxsb3dFZGl0IiwiYWxsb3dEZWxldGUiLCJ2aWV3QWxsUmVjb3JkcyIsInZpZXdDb21wYW55UmVjb3JkcyIsIm1vZGlmeUNvbXBhbnlSZWNvcmRzIiwiZ2V0VGVtcGxhdGVTcGFjZUlkIiwic2V0dGluZ3MiLCJ0ZW1wbGF0ZVNwYWNlSWQiLCJnZXRDbG91ZEFkbWluU3BhY2VJZCIsImNsb3VkQWRtaW5TcGFjZUlkIiwiaXNUZW1wbGF0ZVNwYWNlIiwiaXNDbG91ZEFkbWluU3BhY2UiLCJwcm9jZXNzIiwiZW52IiwiU1RFRURPU19TVE9SQUdFX0RJUiIsInN0ZWVkb3NTdG9yYWdlRGlyIiwicmVzb2x2ZSIsImpvaW4iLCJfX21ldGVvcl9ib290c3RyYXBfXyIsInNlcnZlckRpciIsIm1ldGhvZHMiLCJjb2xsZWN0aW9uIiwibmFtZV9maWVsZF9rZXkiLCJvcHRpb25zX2xpbWl0IiwicXVlcnkiLCJxdWVyeV9vcHRpb25zIiwicmVjb3JkcyIsInJlc3VsdHMiLCJzZWFyY2hUZXh0UXVlcnkiLCJzZWxlY3RlZCIsInNvcnQiLCJwYXJhbXMiLCJOQU1FX0ZJRUxEX0tFWSIsInNlYXJjaFRleHQiLCIkcmVnZXgiLCIkb3IiLCIkaW4iLCJleHRlbmQiLCIkbmluIiwiZmlsdGVyUXVlcnkiLCJsaW1pdCIsImlzT2JqZWN0IiwiZmluZCIsImZldGNoIiwicmVjb3JkIiwibGFiZWwiLCJtZXNzYWdlIiwiSlNPTiIsInN0cmluZ2lmeSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiYm94IiwiY3VycmVudF91c2VyX2lkIiwiY3VycmVudF91c2VyX2luZm8iLCJmbG93SWQiLCJoYXNoRGF0YSIsImlucyIsImluc0lkIiwicmVjb3JkX2lkIiwicmVkaXJlY3RfdXJsIiwicmVmMiIsIndvcmtmbG93VXJsIiwieF9hdXRoX3Rva2VuIiwieF91c2VyX2lkIiwidXVmbG93TWFuYWdlciIsImNoZWNrX2F1dGhvcml6YXRpb24iLCJib2R5IiwiY2hlY2siLCJpbnN0YW5jZUlkIiwid2Vic2VydmljZXMiLCJ3b3JrZmxvdyIsImZsb3ciLCJpbmJveF91c2VycyIsImluY2x1ZGVzIiwiY2NfdXNlcnMiLCJvdXRib3hfdXNlcnMiLCJzdGF0ZSIsInN1Ym1pdHRlciIsImFwcGxpY2FudCIsInBlcm1pc3Npb25NYW5hZ2VyIiwiZ2V0Rmxvd1Blcm1pc3Npb25zIiwic3BhY2VzIiwic2VuZFJlc3VsdCIsImNvZGUiLCJkYXRhIiwidXBkYXRlIiwiJHB1bGwiLCJlcnJvcnMiLCJlcnJvck1lc3NhZ2UiLCJyZWFzb24iLCJnZXRJbml0V2lkdGhQZXJjZW50IiwiY29sdW1ucyIsIl9zY2hlbWEiLCJjb2x1bW5fbnVtIiwiaW5pdF93aWR0aF9wZXJjZW50IiwiZ2V0U2NoZW1hIiwiZmllbGRfbmFtZSIsImZpZWxkIiwiaXNfd2lkZSIsInBpY2siLCJhdXRvZm9ybSIsImdldEZpZWxkSXNXaWRlIiwiZ2V0VGFidWxhck9yZGVyIiwibGlzdF92aWV3X2lkIiwic2V0dGluZyIsIm1hcCIsImNvbHVtbiIsImhpZGRlbiIsImNvbXBhY3QiLCJvcmRlciIsImluZGV4IiwiZGVmYXVsdF9leHRyYV9jb2x1bW5zIiwiZXh0cmFfY29sdW1ucyIsImdldE9iamVjdERlZmF1bHRDb2x1bW5zIiwiZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyIsInVuaW9uIiwiZ2V0T2JqZWN0RGVmYXVsdFNvcnQiLCJUYWJ1bGFyU2VsZWN0ZWRJZHMiLCJjb252ZXJ0TGlzdFZpZXciLCJkZWZhdWx0X2NvbHVtZW5zIiwibGlzdF92aWV3IiwibGlzdF92aWV3X25hbWUiLCJvaXRlbSIsImhhcyIsImluY2x1ZGUiLCJmaWx0ZXJfc2NvcGUiLCJwYXJzZSIsImZvckVhY2giLCJfdmFsdWUiLCJnZXRSZWxhdGVkTGlzdCIsImxpc3QiLCJnZXRSZWxhdGVkT2JqZWN0cyIsInJlbGF0ZWRfb2JqZWN0X2l0ZW0iLCJyZWxhdGVkIiwidGFidWxhcl9vcmRlciIsIndpdGhvdXQiLCJ0cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyIiwicmVwbGFjZSIsImlzX2ZpbGUiLCJvYmpPck5hbWUiLCJvYmplY3ROYW1lIiwiZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyIsImZpcnN0IiwiZ2V0TGlzdFZpZXdzIiwiZ2V0TGlzdFZpZXciLCJleGFjIiwibGlzdFZpZXdzIiwiZ2V0TGlzdFZpZXdJc1JlY2VudCIsImxpc3RWaWV3IiwiZ2V0T2JqZWN0RGVmYXVsdFZpZXciLCJkZWZhdWx0VmlldyIsImlzQWxsVmlldyIsImlzUmVjZW50VmlldyIsInRhYnVsYXJDb2x1bW5zIiwidGFidWxhcl9zb3J0IiwiaXRlbSIsImNvbHVtbl9pbmRleCIsInRyYW5zZm9ybVNvcnRUb0RYIiwiZHhfc29ydCIsIlJlZ0V4IiwiUmVnRXhwIiwiX3JlZ0V4TWVzc2FnZXMiLCJfZ2xvYmFsTWVzc2FnZXMiLCJyZWdFeCIsImV4cCIsIm1zZyIsIm1lc3NhZ2VzIiwiZXZhbEluQ29udGV4dCIsImpzIiwiZXZhbCIsImNhbGwiLCJjb252ZXJ0RmllbGQiLCJnZXRPcHRpb24iLCJvcHRpb24iLCJmb28iLCJzcGxpdCIsImFsbE9wdGlvbnMiLCJwaWNrbGlzdCIsInBpY2tsaXN0T3B0aW9ucyIsImdldFBpY2tsaXN0IiwiZ2V0UGlja0xpc3RPcHRpb25zIiwicmV2ZXJzZSIsImVuYWJsZSIsImRlZmF1bHRWYWx1ZSIsInRyaWdnZXJzIiwidHJpZ2dlciIsIl90b2RvIiwiX3RvZG9fZnJvbV9jb2RlIiwiX3RvZG9fZnJvbV9kYiIsIm9uIiwidG9kbyIsImFjdGlvbnMiLCJfdmlzaWJsZSIsImVycm9yMSIsImFjdGlvbnNCeU5hbWUiLCJ2aXNpYmxlIiwiX29wdGlvbnMiLCJfdHlwZSIsImJlZm9yZU9wZW5GdW5jdGlvbiIsImlzX2NvbXBhbnlfbGltaXRlZCIsIm1heCIsIm1pbiIsIl9vcHRpb24iLCJ2IiwiayIsIl9yZWdFeCIsIl9taW4iLCJfbWF4IiwiTnVtYmVyIiwiQm9vbGVhbiIsIl9vcHRpb25zRnVuY3Rpb24iLCJfcmVmZXJlbmNlX3RvIiwiX2NyZWF0ZUZ1bmN0aW9uIiwiX2JlZm9yZU9wZW5GdW5jdGlvbiIsIl9maWx0ZXJzRnVuY3Rpb24iLCJfZGVmYXVsdFZhbHVlIiwiX2lzX2NvbXBhbnlfbGltaXRlZCIsIl9maWx0ZXJzIiwiaXNEYXRlIiwicG9wIiwiX2lzX2RhdGUiLCJmb3JtIiwidmFsIiwicmVsYXRlZE9iakluZm8iLCJQUkVGSVgiLCJfcHJlcGVuZFByZWZpeEZvckZvcm11bGEiLCJwcmVmaXgiLCJmaWVsZFZhcmlhYmxlIiwicmVnIiwicmV2IiwibSIsIiQxIiwiZm9ybXVsYV9zdHIiLCJfQ09OVEVYVCIsIl9WQUxVRVMiLCJpc0Jvb2xlYW4iLCJ0b2FzdHIiLCJmb3JtYXRPYmplY3ROYW1lIiwiX2RiIiwiZGVmYXVsdENvbHVtbnMiLCJkZWZhdWx0TGlzdFZpZXdJZCIsImRpc2FibGVkX2xpc3Rfdmlld3MiLCJyZWYzIiwic2NoZW1hIiwic2VsZiIsImljb24iLCJkZXNjcmlwdGlvbiIsImlzX3ZpZXciLCJpc19lbmFibGUiLCJlbmFibGVfc2VhcmNoIiwiZW5hYmxlX2FwaSIsImN1c3RvbSIsImVuYWJsZV9zaGFyZSIsImVuYWJsZV90cmVlIiwic2lkZWJhciIsIm9wZW5fd2luZG93IiwiZmlsdGVyX2NvbXBhbnkiLCJjYWxlbmRhciIsImVuYWJsZV9jaGF0dGVyIiwiZW5hYmxlX3RyYXNoIiwiZW5hYmxlX3NwYWNlX2dsb2JhbCIsImVuYWJsZV9mb2xsb3ciLCJlbmFibGVfd29ya2Zsb3ciLCJpbl9kZXZlbG9wbWVudCIsImlkRmllbGROYW1lIiwiZGF0YWJhc2VfbmFtZSIsImlzX25hbWUiLCJwcmltYXJ5IiwiZmlsdGVyYWJsZSIsImJhc2VPYmplY3QiLCJpdGVtX25hbWUiLCJjb3B5SXRlbSIsInBlcm1pc3Npb25fc2V0IiwiYWRtaW4iLCJhbGwiLCJsaXN0X3ZpZXdfaXRlbSIsIlJlYWN0aXZlVmFyIiwiY3JlYXRlQ29sbGVjdGlvbiIsIl9uYW1lIiwiZ2V0T2JqZWN0U2NoZW1hIiwiY29udGFpbnMiLCJhdHRhY2hTY2hlbWEiLCJfc2ltcGxlU2NoZW1hIiwiZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXgiLCJib290c3RyYXBMb2FkZWQiLCJmaWVsZHNBcnIiLCJfcmVmX29iaiIsImF1dG9mb3JtX3R5cGUiLCJmcyIsImlzVW5MaW1pdGVkIiwibXVsdGlwbGUiLCJyb3dzIiwibGFuZ3VhZ2UiLCJpc01vYmlsZSIsImlzUGFkIiwiYWZGaWVsZElucHV0IiwiZGF0ZU1vYmlsZU9wdGlvbnMiLCJvdXRGb3JtYXQiLCJ0aW1lem9uZUlkIiwiZHhEYXRlQm94T3B0aW9ucyIsImRpc3BsYXlGb3JtYXQiLCJoZWlnaHQiLCJkaWFsb2dzSW5Cb2R5IiwidG9vbGJhciIsImZvbnROYW1lcyIsImxhbmciLCJzaG93SWNvbiIsImRlcGVuZE9uIiwiZGVwZW5kX29uIiwiY3JlYXRlIiwibG9va3VwX2ZpZWxkIiwiTW9kYWwiLCJzaG93IiwiZm9ybUlkIiwib3BlcmF0aW9uIiwib25TdWNjZXNzIiwicmVzdWx0IiwiYWRkSXRlbXMiLCJyZWZlcmVuY2Vfc29ydCIsIm9wdGlvbnNTb3J0IiwicmVmZXJlbmNlX2xpbWl0Iiwib3B0aW9uc0xpbWl0Iiwib21pdCIsImJsYWNrYm94Iiwib2JqZWN0U3dpdGNoZSIsIm9wdGlvbnNNZXRob2QiLCJvcHRpb25zTWV0aG9kUGFyYW1zIiwicmVmZXJlbmNlcyIsIl9yZWZlcmVuY2UiLCJsaW5rIiwiZGVmYXVsdEljb24iLCJmaXJzdE9wdGlvbiIsInByZWNpc2lvbiIsInNjYWxlIiwiZGVjaW1hbCIsIkFycmF5IiwiZWRpdGFibGUiLCJhY2NlcHQiLCJzeXN0ZW0iLCJFbWFpbCIsInJlcXVpcmVkIiwib3B0aW9uYWwiLCJ1bmlxdWUiLCJncm91cCIsInNlYXJjaGFibGUiLCJyZWFkb25seSIsImRpc2FibGVkIiwiaW5saW5lSGVscFRleHQiLCJpc1Byb2R1Y3Rpb24iLCJzb3J0YWJsZSIsImdldEZpZWxkRGlzcGxheVZhbHVlIiwiZmllbGRfdmFsdWUiLCJodG1sIiwibW9tZW50IiwiZm9ybWF0IiwiY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5IiwiZmllbGRfdHlwZSIsInB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyIsIm9wZXJhdGlvbnMiLCJidWlsdGluVmFsdWVzIiwiZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMiLCJidWlsdGluSXRlbSIsImlzX2NoZWNrX29ubHkiLCJnZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMiLCJnZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSIsImdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uIiwiYmV0d2VlbkJ1aWx0aW5WYWx1ZXMiLCJnZXRRdWFydGVyU3RhcnRNb250aCIsIm1vbnRoIiwiZ2V0TW9udGgiLCJnZXRMYXN0UXVhcnRlckZpcnN0RGF5IiwieWVhciIsImdldEZ1bGxZZWFyIiwiZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSIsImdldE1vbnRoRGF5cyIsImRheXMiLCJlbmREYXRlIiwibWlsbGlzZWNvbmQiLCJzdGFydERhdGUiLCJnZXRMYXN0TW9udGhGaXJzdERheSIsImN1cnJlbnRNb250aCIsImN1cnJlbnRZZWFyIiwiZW5kVmFsdWUiLCJmaXJzdERheSIsImxhc3REYXkiLCJsYXN0TW9uZGF5IiwibGFzdE1vbnRoRmluYWxEYXkiLCJsYXN0TW9udGhGaXJzdERheSIsImxhc3RRdWFydGVyRW5kRGF5IiwibGFzdFF1YXJ0ZXJTdGFydERheSIsImxhc3RTdW5kYXkiLCJsYXN0XzEyMF9kYXlzIiwibGFzdF8zMF9kYXlzIiwibGFzdF82MF9kYXlzIiwibGFzdF83X2RheXMiLCJsYXN0XzkwX2RheXMiLCJtaW51c0RheSIsIm1vbmRheSIsIm5leHRNb25kYXkiLCJuZXh0TW9udGhGaW5hbERheSIsIm5leHRNb250aEZpcnN0RGF5IiwibmV4dFF1YXJ0ZXJFbmREYXkiLCJuZXh0UXVhcnRlclN0YXJ0RGF5IiwibmV4dFN1bmRheSIsIm5leHRZZWFyIiwibmV4dF8xMjBfZGF5cyIsIm5leHRfMzBfZGF5cyIsIm5leHRfNjBfZGF5cyIsIm5leHRfN19kYXlzIiwibmV4dF85MF9kYXlzIiwibm93IiwicHJldmlvdXNZZWFyIiwic3RhcnRWYWx1ZSIsInN0ckVuZERheSIsInN0ckZpcnN0RGF5Iiwic3RyTGFzdERheSIsInN0ck1vbmRheSIsInN0clN0YXJ0RGF5Iiwic3RyU3VuZGF5Iiwic3RyVG9kYXkiLCJzdHJUb21vcnJvdyIsInN0clllc3RkYXkiLCJzdW5kYXkiLCJ0aGlzUXVhcnRlckVuZERheSIsInRoaXNRdWFydGVyU3RhcnREYXkiLCJ0b21vcnJvdyIsIndlZWsiLCJ5ZXN0ZGF5IiwiZ2V0RGF5IiwidCIsImZ2Iiwic2V0SG91cnMiLCJnZXRIb3VycyIsImdldFRpbWV6b25lT2Zmc2V0IiwiZ2V0RmllbGREZWZhdWx0T3BlcmF0aW9uIiwiZ2V0RmllbGRPcGVyYXRpb24iLCJvcHRpb25hbHMiLCJlcXVhbCIsInVuZXF1YWwiLCJsZXNzX3RoYW4iLCJncmVhdGVyX3RoYW4iLCJsZXNzX29yX2VxdWFsIiwiZ3JlYXRlcl9vcl9lcXVhbCIsIm5vdF9jb250YWluIiwic3RhcnRzX3dpdGgiLCJiZXR3ZWVuIiwiZ2V0T2JqZWN0RmllbGRzTmFtZSIsImZpZWxkc05hbWUiLCJzb3J0X25vIiwiY2xlYW5UcmlnZ2VyIiwiaW5pdFRyaWdnZXIiLCJfdHJpZ2dlcl9ob29rcyIsInJlZjQiLCJyZWY1IiwidG9kb1dyYXBwZXIiLCJhcHBseSIsImFyZ3VtZW50cyIsIndoZW4iLCJiZWZvcmUiLCJpbnNlcnQiLCJyZW1vdmUiLCJhZnRlciIsIl9ob29rIiwidHJpZ2dlcl9uYW1lIiwiX3RyaWdnZXJfaG9vayIsImZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QiLCJmaW5kX3Blcm1pc3Npb25fb2JqZWN0IiwiaW50ZXJzZWN0aW9uUGx1cyIsInVuaW9uUGVybWlzc2lvbk9iamVjdHMiLCJ1bmlvblBsdXMiLCJnZXRPYmplY3RQZXJtaXNzaW9ucyIsImdldFJlY29yZFBlcm1pc3Npb25zIiwiaXNPd25lciIsIm9iamVjdF9maWVsZHNfa2V5cyIsInJlY29yZF9jb21wYW55X2lkIiwicmVjb3JkX2NvbXBhbnlfaWRzIiwic2VsZWN0IiwidXNlcl9jb21wYW55X2lkcyIsInBhcmVudCIsImtleXMiLCJpbnRlcnNlY3Rpb24iLCJnZXRPYmplY3RSZWNvcmQiLCJvd25lciIsIm4iLCJsb2NrZWQiLCJnZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zIiwiY3VycmVudE9iamVjdE5hbWUiLCJyZWxhdGVkTGlzdEl0ZW0iLCJjdXJyZW50UmVjb3JkIiwiaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlIiwibWFzdGVyQWxsb3ciLCJtYXN0ZXJSZWNvcmRQZXJtIiwicmVsYXRlZE9iamVjdFBlcm1pc3Npb25zIiwidW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QiLCJnZXRSZWNvcmRTYWZlUmVsYXRlZExpc3QiLCJnZXRBbGxQZXJtaXNzaW9ucyIsIl9pIiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNBZG1pbl9wb3MiLCJwc2V0c0N1cnJlbnQiLCJwc2V0c0N1cnJlbnROYW1lcyIsInBzZXRzQ3VycmVudF9wb3MiLCJwc2V0c0d1ZXN0IiwicHNldHNHdWVzdF9wb3MiLCJwc2V0c01lbWJlciIsInBzZXRzTWVtYmVyX3BvcyIsInBzZXRzVXNlciIsInBzZXRzVXNlcl9wb3MiLCJzZXRfaWRzIiwic3BhY2VVc2VyIiwib2JqZWN0cyIsImFzc2lnbmVkX2FwcHMiLCJ1c2VycyIsInBlcm1pc3Npb25fc2V0X2lkIiwiY3JlYXRlZCIsIm1vZGlmaWVkIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkX2J5IiwicGx1Y2siLCJwcm9maWxlIiwiZ2V0QXNzaWduZWRBcHBzIiwiYmluZCIsImFzc2lnbmVkX21lbnVzIiwiZ2V0QXNzaWduZWRNZW51cyIsInVzZXJfcGVybWlzc2lvbl9zZXRzIiwiYXJyYXkiLCJvdGhlciIsImFwcHMiLCJwc2V0QmFzZSIsInBzZXQiLCJ1bmlxIiwiYWJvdXRNZW51IiwiYWRtaW5NZW51cyIsImFsbE1lbnVzIiwiY3VycmVudFBzZXROYW1lcyIsIm1lbnVzIiwib3RoZXJNZW51QXBwcyIsIm90aGVyTWVudXMiLCJhZG1pbl9tZW51cyIsImZsYXR0ZW4iLCJtZW51IiwicHNldHNNZW51IiwicGVybWlzc2lvbl9zZXRzIiwicGVybWlzc2lvbl9vYmplY3RzIiwiaXNOdWxsIiwicGVybWlzc2lvbl9zZXRfaWRzIiwicG9zIiwib3BzIiwib3BzX2tleSIsImN1cnJlbnRQc2V0IiwidGVtcE9wcyIsInJlcGVhdEluZGV4IiwicmVwZWF0UG8iLCJvcHNldEFkbWluIiwib3BzZXRHdWVzdCIsIm9wc2V0TWVtYmVyIiwib3BzZXRVc2VyIiwicG9zQWRtaW4iLCJwb3NHdWVzdCIsInBvc01lbWJlciIsInBvc1VzZXIiLCJwcm9mIiwiZ3Vlc3QiLCJtZW1iZXIiLCJkaXNhYmxlZF9hY3Rpb25zIiwidW5yZWFkYWJsZV9maWVsZHMiLCJ1bmVkaXRhYmxlX2ZpZWxkcyIsInVucmVsYXRlZF9vYmplY3RzIiwiY3JlYXRvcl9kYl91cmwiLCJvcGxvZ191cmwiLCJNT05HT19VUkxfQ1JFQVRPUiIsIk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SIiwiX0NSRUFUT1JfREFUQVNPVVJDRSIsIl9kcml2ZXIiLCJNb25nb0ludGVybmFscyIsIlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIiLCJvcGxvZ1VybCIsImNvbGxlY3Rpb25fa2V5IiwibmV3Q29sbGVjdGlvbiIsIlNNU1F1ZXVlIiwiYWN0aW9uX25hbWUiLCJleGVjdXRlQWN0aW9uIiwiaXRlbV9lbGVtZW50IiwibW9yZUFyZ3MiLCJ0b2RvQXJncyIsIm9kYXRhIiwicHJvdG90eXBlIiwic2xpY2UiLCJjb25jYXQiLCJzZXQiLCJGb3JtTWFuYWdlciIsImdldEluaXRpYWxWYWx1ZXMiLCJkZWZlciIsIiQiLCJjbGljayIsImhyZWYiLCJnZXRPYmplY3RVcmwiLCJ3aW5kb3ciLCJvcGVuIiwicmVjb3JkX3RpdGxlIiwiY2FsbF9iYWNrIiwidGV4dCIsInN3YWwiLCJ0aXRsZSIsInNob3dDYW5jZWxCdXR0b24iLCJjb25maXJtQnV0dG9uVGV4dCIsImNhbmNlbEJ1dHRvblRleHQiLCJhcHBpZCIsImR4RGF0YUdyaWRJbnN0YW5jZSIsImdyaWRDb250YWluZXIiLCJncmlkT2JqZWN0TmFtZUNsYXNzIiwiaW5mbyIsImlzT3BlbmVyUmVtb3ZlIiwic3VjY2VzcyIsIm9wZW5lciIsImR4VHJlZUxpc3QiLCJkeERhdGFHcmlkIiwicmVmcmVzaCIsIlRlbXBsYXRlIiwiY3JlYXRvcl9ncmlkIiwiY2xvc2UiLCJGbG93Um91dGVyIiwiZ28iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxLQUFDQSxFQUFELEdBQU0sRUFBTjs7QUFDQSxJQUFJLE9BQUFDLE9BQUEsb0JBQUFBLFlBQUEsSUFBSjtBQUNDLE9BQUNBLE9BQUQsR0FBVyxFQUFYO0FDRUE7O0FERERBLFFBQVFDLE9BQVIsR0FBa0IsRUFBbEI7QUFD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QUFSLENBQVksV0FBWixDQUFiLElBQTBDLENBQUNvRCxRQUFRcVcsUUFBUixFQUEzQyxJQUFrRTlMLGlCQUFnQixVQUFyRjtBQUNKMGYsd0JBQVF0dEIsUUFBUUMsR0FBUixDQUFZLFFBQVosQ0FBUjs7QUFDQSxxQkFBTzJOLFlBQVA7QUFDQ0EsaUNBQWU1TixRQUFRQyxHQUFSLENBQVksY0FBWixDQUFmO0FDTU87O0FETFIscUJBQU8yTixZQUFQO0FBQ0NBLGlDQUFlLEtBQWY7QUNPTzs7QUROUndnQiwyQkFBV0MsRUFBWCxDQUFjLFVBQVFmLEtBQVIsR0FBYyxHQUFkLEdBQWlCM3VCLFdBQWpCLEdBQTZCLFFBQTdCLEdBQXFDaVAsWUFBbkQ7QUFURjtBQ2tCTTs7QURSTixnQkFBR21mLGFBQWMsT0FBT0EsU0FBUCxLQUFvQixVQUFyQztBQ1VPLHFCRFROQSxXQ1NNO0FBQ0Q7QUQ1Q1AsWUNGSTtBQWdERDtBRHZETixRQ0ZHO0FEbEVKO0FBQUEsR0FGRDtBQ2lJQSxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJAZGIgPSB7fVxyXG5pZiAhQ3JlYXRvcj9cclxuXHRAQ3JlYXRvciA9IHt9XHJcbkNyZWF0b3IuT2JqZWN0cyA9IHt9XHJcbkNyZWF0b3IuQ29sbGVjdGlvbnMgPSB7fVxyXG5DcmVhdG9yLk1lbnVzID0gW11cclxuQ3JlYXRvci5BcHBzID0ge31cclxuQ3JlYXRvci5EYXNoYm9hcmRzID0ge31cclxuQ3JlYXRvci5SZXBvcnRzID0ge31cclxuQ3JlYXRvci5zdWJzID0ge31cclxuQ3JlYXRvci5zdGVlZG9zU2NoZW1hID0ge30iLCJ0aGlzLmRiID0ge307XG5cbmlmICh0eXBlb2YgQ3JlYXRvciA9PT0gXCJ1bmRlZmluZWRcIiB8fCBDcmVhdG9yID09PSBudWxsKSB7XG4gIHRoaXMuQ3JlYXRvciA9IHt9O1xufVxuXG5DcmVhdG9yLk9iamVjdHMgPSB7fTtcblxuQ3JlYXRvci5Db2xsZWN0aW9ucyA9IHt9O1xuXG5DcmVhdG9yLk1lbnVzID0gW107XG5cbkNyZWF0b3IuQXBwcyA9IHt9O1xuXG5DcmVhdG9yLkRhc2hib2FyZHMgPSB7fTtcblxuQ3JlYXRvci5SZXBvcnRzID0ge307XG5cbkNyZWF0b3Iuc3VicyA9IHt9O1xuXG5DcmVhdG9yLnN0ZWVkb3NTY2hlbWEgPSB7fTtcbiIsInRyeVxyXG5cdHN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpXHJcblx0aWYgTWV0ZW9yLmlzRGV2ZWxvcG1lbnRcclxuXHRcdE1ldGVvci5zdGFydHVwIC0+XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdHN0ZWVkb3NDb3JlLmluaXQoKVxyXG5cdFx0XHRjYXRjaCBleFxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGV4KVxyXG5jYXRjaCBlXHJcblx0Y29uc29sZS5sb2coZSkiLCJ2YXIgZSwgc3RlZWRvc0NvcmU7XG5cbnRyeSB7XG4gIHN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpO1xuICBpZiAoTWV0ZW9yLmlzRGV2ZWxvcG1lbnQpIHtcbiAgICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBleDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBzdGVlZG9zQ29yZS5pbml0KCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBleCA9IGVycm9yO1xuICAgICAgICByZXR1cm4gY29uc29sZS5sb2coZXgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59IGNhdGNoIChlcnJvcikge1xuICBlID0gZXJyb3I7XG4gIGNvbnNvbGUubG9nKGUpO1xufVxuIiwiQ3JlYXRvci5kZXBzID0ge1xyXG5cdGFwcDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxyXG5cdG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxyXG59O1xyXG5cclxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XHJcblx0QXBwczoge30sXHJcblx0T2JqZWN0czoge31cclxufVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7ZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxyXG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtvcHRpb25zRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXHJcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2NyZWF0ZUZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxyXG5cclxuIyBDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMg5L6bc3RlZWRvcy1jbGnpobnnm67kvb/nlKhcclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0RmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxyXG5cdENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyA9IChvYmosIG9iamVjdF9uYW1lKS0+XHJcblx0XHRGaWJlcigoKS0+XHJcblx0XHRcdENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSlcclxuXHRcdCkucnVuKClcclxuXHJcbkNyZWF0b3IubG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBvYmoubmFtZVxyXG5cclxuXHRpZiAhb2JqLmxpc3Rfdmlld3NcclxuXHRcdG9iai5saXN0X3ZpZXdzID0ge31cclxuXHJcblx0aWYgb2JqLnNwYWNlXHJcblx0XHRvYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqKVxyXG5cdGlmIG9iamVjdF9uYW1lID09ICdjZnNfZmlsZXNfZmlsZXJlY29yZCdcclxuXHRcdG9iamVjdF9uYW1lID0gJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ1xyXG5cdFx0b2JqID0gXy5jbG9uZShvYmopXHJcblx0XHRvYmoubmFtZSA9IG9iamVjdF9uYW1lXHJcblx0XHRDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdID0gb2JqXHJcblxyXG5cdENyZWF0b3IuY29udmVydE9iamVjdChvYmopXHJcblx0bmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XHJcblxyXG5cdENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKVxyXG5cdENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSlcclxuXHRyZXR1cm4gb2JqXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSAob2JqZWN0KSAtPlxyXG5cdGlmIG9iamVjdC5zcGFjZVxyXG5cdFx0cmV0dXJuIFwiY18je29iamVjdC5zcGFjZX1fI3tvYmplY3QubmFtZX1cIlxyXG5cdHJldHVybiBvYmplY3QubmFtZVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3QgPSAob2JqZWN0X25hbWUsIHNwYWNlX2lkKS0+XHJcblx0aWYgXy5pc0FycmF5KG9iamVjdF9uYW1lKVxyXG5cdFx0cmV0dXJuIDtcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdENyZWF0b3IuZGVwcz8ub2JqZWN0Py5kZXBlbmQoKVxyXG5cdGlmICFvYmplY3RfbmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHJcbiNcdGlmICFzcGFjZV9pZCAmJiBvYmplY3RfbmFtZVxyXG4jXHRcdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY18nKVxyXG4jXHRcdFx0c3BhY2VfaWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHJcblx0aWYgb2JqZWN0X25hbWVcclxuI1x0XHRpZiBzcGFjZV9pZFxyXG4jXHRcdFx0b2JqID0gQ3JlYXRvci5vYmplY3RzQnlOYW1lW1wiY18je3NwYWNlX2lkfV8je29iamVjdF9uYW1lfVwiXVxyXG4jXHRcdFx0aWYgb2JqXHJcbiNcdFx0XHRcdHJldHVybiBvYmpcclxuI1xyXG4jXHRcdG9iaiA9IF8uZmluZCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvKS0+XHJcbiNcdFx0XHRcdHJldHVybiBvLl9jb2xsZWN0aW9uX25hbWUgPT0gb2JqZWN0X25hbWVcclxuI1x0XHRpZiBvYmpcclxuI1x0XHRcdHJldHVybiBvYmpcclxuXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RCeUlkID0gKG9iamVjdF9pZCktPlxyXG5cdHJldHVybiBfLmZpbmRXaGVyZShDcmVhdG9yLm9iamVjdHNCeU5hbWUsIHtfaWQ6IG9iamVjdF9pZH0pXHJcblxyXG5DcmVhdG9yLnJlbW92ZU9iamVjdCA9IChvYmplY3RfbmFtZSktPlxyXG5cdGNvbnNvbGUubG9nKFwicmVtb3ZlT2JqZWN0XCIsIG9iamVjdF9uYW1lKVxyXG5cdGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXHJcblx0ZGVsZXRlIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV1cclxuXHJcbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCktPlxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0aWYgb2JqZWN0X25hbWVcclxuXHRcdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW0NyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKT8uX2NvbGxlY3Rpb25fbmFtZV1cclxuXHJcbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSktPlxyXG5cdGRlbGV0ZSBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXVxyXG5cclxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSAoc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cclxuXHRzcGFjZSA9IENyZWF0b3IuZ2V0T2JqZWN0KFwic3BhY2VzXCIpPy5kYj8uZmluZE9uZShzcGFjZUlkLHtmaWVsZHM6e2FkbWluczoxfX0pXHJcblx0aWYgc3BhY2U/LmFkbWluc1xyXG5cdFx0cmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMFxyXG5cclxuXHJcbkNyZWF0b3IuZXZhbHVhdGVGb3JtdWxhID0gKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKS0+XHJcblxyXG5cdGlmICFfLmlzU3RyaW5nKGZvcm11bGFyKVxyXG5cdFx0cmV0dXJuIGZvcm11bGFyXHJcblxyXG5cdGlmIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKVxyXG5cclxuXHRyZXR1cm4gZm9ybXVsYXJcclxuXHJcbkNyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzID0gKGZpbHRlcnMsIGNvbnRleHQpLT5cclxuXHRzZWxlY3RvciA9IHt9XHJcblx0Xy5lYWNoIGZpbHRlcnMsIChmaWx0ZXIpLT5cclxuXHRcdGlmIGZpbHRlcj8ubGVuZ3RoID09IDNcclxuXHRcdFx0bmFtZSA9IGZpbHRlclswXVxyXG5cdFx0XHRhY3Rpb24gPSBmaWx0ZXJbMV1cclxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIGNvbnRleHQpXHJcblx0XHRcdHNlbGVjdG9yW25hbWVdID0ge31cclxuXHRcdFx0c2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlXHJcblx0Y29uc29sZS5sb2coXCJldmFsdWF0ZUZpbHRlcnMtLT5zZWxlY3RvclwiLCBzZWxlY3RvcilcclxuXHRyZXR1cm4gc2VsZWN0b3JcclxuXHJcbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IChzcGFjZUlkKSAtPlxyXG5cdHJldHVybiBzcGFjZUlkID09ICdjb21tb24nXHJcblxyXG4jIyNcclxuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXHJcblx0aWRz77yaX2lk6ZuG5ZCIXHJcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcclxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXHJcbiMjI1xyXG5DcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyA9IChkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KS0+XHJcblxyXG5cdGlmICFpZF9rZXlcclxuXHRcdGlkX2tleSA9IFwiX2lkXCJcclxuXHJcblx0aWYgaGl0X2ZpcnN0XHJcblxyXG5cdFx0I+eUseS6juS4jeiDveS9v+eUqF8uZmluZEluZGV45Ye95pWw77yM5Zug5q2k5q2k5aSE5YWI5bCG5a+56LGh5pWw57uE6L2s5Li65pmu6YCa5pWw57uE57G75Z6L77yM5Zyo6I635Y+W5YW2aW5kZXhcclxuXHRcdHZhbHVlcyA9IGRvY3MuZ2V0UHJvcGVydHkoaWRfa2V5KVxyXG5cclxuXHRcdHJldHVyblx0Xy5zb3J0QnkgZG9jcywgKGRvYyktPlxyXG5cdFx0XHRcdFx0X2luZGV4ID0gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pXHJcblx0XHRcdFx0XHRpZiBfaW5kZXggPiAtMVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2luZGV4XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuXHRfLnNvcnRCeSBkb2NzLCAoZG9jKS0+XHJcblx0XHRcdHJldHVybiBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSlcclxuXHJcbiMjI1xyXG5cdOaMieeUqOaIt+aJgOWxnuacrOWcsOWMluivreiogOi/m+ihjOaOkuW6j++8jOaUr+aMgeS4reaWh+OAgeaVsOWAvOOAgeaXpeacn+etieWtl+auteaOkuW6j1xyXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xyXG4jIyNcclxuQ3JlYXRvci5zb3J0aW5nTWV0aG9kID0gKHZhbHVlMSwgdmFsdWUyKSAtPlxyXG5cdGlmIHRoaXMua2V5XHJcblx0XHR2YWx1ZTEgPSB2YWx1ZTFbdGhpcy5rZXldXHJcblx0XHR2YWx1ZTIgPSB2YWx1ZTJbdGhpcy5rZXldXHJcblx0aWYgdmFsdWUxIGluc3RhbmNlb2YgRGF0ZVxyXG5cdFx0dmFsdWUxID0gdmFsdWUxLmdldFRpbWUoKVxyXG5cdGlmIHZhbHVlMiBpbnN0YW5jZW9mIERhdGVcclxuXHRcdHZhbHVlMiA9IHZhbHVlMi5nZXRUaW1lKClcclxuXHRpZiB0eXBlb2YgdmFsdWUxIGlzIFwibnVtYmVyXCIgYW5kIHR5cGVvZiB2YWx1ZTIgaXMgXCJudW1iZXJcIlxyXG5cdFx0cmV0dXJuIHZhbHVlMSAtIHZhbHVlMlxyXG5cdCMgSGFuZGxpbmcgbnVsbCB2YWx1ZXNcclxuXHRpc1ZhbHVlMUVtcHR5ID0gdmFsdWUxID09IG51bGwgb3IgdmFsdWUxID09IHVuZGVmaW5lZFxyXG5cdGlzVmFsdWUyRW1wdHkgPSB2YWx1ZTIgPT0gbnVsbCBvciB2YWx1ZTIgPT0gdW5kZWZpbmVkXHJcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgIWlzVmFsdWUyRW1wdHlcclxuXHRcdHJldHVybiAtMVxyXG5cdGlmIGlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcclxuXHRcdHJldHVybiAwXHJcblx0aWYgIWlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcclxuXHRcdHJldHVybiAxXHJcblx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxyXG5cdHJldHVybiB2YWx1ZTEudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlIHZhbHVlMi50b1N0cmluZygpLCBsb2NhbGVcclxuXHJcblxyXG4jIOivpeWHveaVsOWPquWcqOWIneWni+WMlk9iamVjdOaXtu+8jOaKiuebuOWFs+WvueixoeeahOiuoeeul+e7k+aenOS/neWtmOWIsE9iamVjdOeahHJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4re+8jOWQjue7reWPr+S7peebtOaOpeS7jnJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4reWPluW+l+iuoeeul+e7k+aenOiAjOS4jeeUqOWGjeasoeiwg+eUqOivpeWHveaVsOadpeiuoeeul1xyXG5DcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzID0gKG9iamVjdF9uYW1lKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IFtdXHJcblx0IyBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0IyDlm6BDcmVhdG9yLmdldE9iamVjdOWHveaVsOWGhemDqOimgeiwg+eUqOivpeWHveaVsO+8jOaJgOS7pei/memHjOS4jeWPr+S7peiwg+eUqENyZWF0b3IuZ2V0T2JqZWN05Y+W5a+56LGh77yM5Y+q6IO96LCD55SoQ3JlYXRvci5PYmplY3Rz5p2l5Y+W5a+56LGhXHJcblx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cclxuXHRpZiAhX29iamVjdFxyXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xyXG5cdFxyXG5cdHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdFxyXG5cdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhXy5pc0VtcHR5IHJlbGF0ZWRMaXN0XHJcblx0XHRyZWxhdGVkTGlzdE1hcCA9IHt9XHJcblx0XHRfLmVhY2ggcmVsYXRlZExpc3QsIChvYmpOYW1lKS0+XHJcblx0XHRcdHJlbGF0ZWRMaXN0TWFwW29iak5hbWVdID0ge31cclxuXHRcdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSktPlxyXG5cdFx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3QuZmllbGRzLCAocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKS0+XHJcblx0XHRcdFx0aWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIikgYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PSBvYmplY3RfbmFtZSBhbmQgcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV1cclxuXHRcdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdID0geyBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSwgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSwgc2hhcmluZzogcmVsYXRlZF9maWVsZC5zaGFyaW5nIH1cclxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXVxyXG5cdFx0XHRyZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10gPSB7IG9iamVjdF9uYW1lOiBcImNtc19maWxlc1wiLCBmb3JlaWduX2tleTogXCJwYXJlbnRcIiB9XHJcblx0XHRpZiByZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ11cclxuXHRcdFx0cmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddID0geyBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiIH1cclxuXHRcdF8uZWFjaCBbJ3Rhc2tzJywgJ25vdGVzJywgJ2V2ZW50cycsICdhcHByb3ZhbHMnXSwgKGVuYWJsZU9iak5hbWUpLT5cclxuXHRcdFx0aWYgcmVsYXRlZExpc3RNYXBbZW5hYmxlT2JqTmFtZV1cclxuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSA9IHsgb2JqZWN0X25hbWU6IGVuYWJsZU9iak5hbWUsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIiB9XHJcblx0XHRpZiByZWxhdGVkTGlzdE1hcFsnYXVkaXRfcmVjb3JkcyddXHJcblx0XHRcdCNyZWNvcmQg6K+m57uG5LiL55qEYXVkaXRfcmVjb3Jkc+S7hW1vZGlmeUFsbFJlY29yZHPmnYPpmZDlj6/op4FcclxuXHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKVxyXG5cdFx0XHRpZiBfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10gPSB7IG9iamVjdF9uYW1lOlwiYXVkaXRfcmVjb3Jkc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCIgfVxyXG5cdFx0cmVsYXRlZF9vYmplY3RzID0gXy52YWx1ZXMgcmVsYXRlZExpc3RNYXBcclxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdHNcclxuXHJcblx0aWYgX29iamVjdC5lbmFibGVfZmlsZXNcclxuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImNtc19maWxlc1wiLCBmb3JlaWduX2tleTogXCJwYXJlbnRcIn1cclxuXHJcblx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XHJcblx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3QuZmllbGRzLCAocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKS0+XHJcblx0XHRcdGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcImxvb2t1cFwiICYmIHJlbGF0ZWRfZmllbGQucmVsYXRlZExpc3QpKSBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lXHJcblx0XHRcdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcIm9iamVjdF9maWVsZHNcIlxyXG5cdFx0XHRcdFx0I1RPRE8g5b6F55u45YWz5YiX6KGo5pSv5oyB5o6S5bqP5ZCO77yM5Yig6Zmk5q2k5Yik5patXHJcblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdHMuc3BsaWNlKDAsIDAsIHtvYmplY3RfbmFtZTpyZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lfSlcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6cmVsYXRlZF9vYmplY3RfbmFtZSwgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSwgc2hhcmluZzogcmVsYXRlZF9maWVsZC5zaGFyaW5nfVxyXG5cclxuXHRpZiBfb2JqZWN0LmVuYWJsZV90YXNrc1xyXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwidGFza3NcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxyXG5cdGlmIF9vYmplY3QuZW5hYmxlX25vdGVzXHJcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJub3Rlc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XHJcblx0aWYgX29iamVjdC5lbmFibGVfZXZlbnRzXHJcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJldmVudHNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxyXG5cdGlmIF9vYmplY3QuZW5hYmxlX2luc3RhbmNlc1xyXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiaW5zdGFuY2VzXCIsIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIn1cclxuXHRpZiBfb2JqZWN0LmVuYWJsZV9hcHByb3ZhbHNcclxuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImFwcHJvdmFsc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XHJcblx0I3JlY29yZCDor6bnu4bkuIvnmoRhdWRpdF9yZWNvcmRz5LuFbW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWPr+ingVxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKVxyXG5cdFx0aWYgX29iamVjdC5lbmFibGVfYXVkaXQgJiYgcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiYXVkaXRfcmVjb3Jkc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XHJcblxyXG5cdHJldHVybiByZWxhdGVkX29iamVjdHNcclxuXHJcbkNyZWF0b3IuZ2V0VXNlckNvbnRleHQgPSAodXNlcklkLCBzcGFjZUlkLCBpc1VuU2FmZU1vZGUpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdHJldHVybiBDcmVhdG9yLlVTRVJfQ09OVEVYVFxyXG5cdGVsc2VcclxuXHRcdGlmICEodXNlcklkIGFuZCBzcGFjZUlkKVxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCJ0aGUgcGFyYW1zIHVzZXJJZCBhbmQgc3BhY2VJZCBpcyByZXF1aXJlZCBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0VXNlckNvbnRleHRcIlxyXG5cdFx0XHRyZXR1cm4gbnVsbFxyXG5cdFx0c3VGaWVsZHMgPSB7bmFtZTogMSwgbW9iaWxlOiAxLCBwb3NpdGlvbjogMSwgZW1haWw6IDEsIGNvbXBhbnk6IDEsIG9yZ2FuaXphdGlvbjogMSwgc3BhY2U6IDEsIGNvbXBhbnlfaWQ6IDEsIGNvbXBhbnlfaWRzOiAxfVxyXG5cdFx0IyBjaGVjayBpZiB1c2VyIGluIHRoZSBzcGFjZVxyXG5cdFx0c3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHN1RmllbGRzfSlcclxuXHRcdGlmICFzdVxyXG5cdFx0XHRzcGFjZUlkID0gbnVsbFxyXG5cclxuXHRcdCMgaWYgc3BhY2VJZCBub3QgZXhpc3RzLCBnZXQgdGhlIGZpcnN0IG9uZS5cclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdGlmIGlzVW5TYWZlTW9kZVxyXG5cdFx0XHRcdHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe3VzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHN1RmllbGRzfSlcclxuXHRcdFx0XHRpZiAhc3VcclxuXHRcdFx0XHRcdHJldHVybiBudWxsXHJcblx0XHRcdFx0c3BhY2VJZCA9IHN1LnNwYWNlXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gbnVsbFxyXG5cclxuXHRcdFVTRVJfQ09OVEVYVCA9IHt9XHJcblx0XHRVU0VSX0NPTlRFWFQudXNlcklkID0gdXNlcklkXHJcblx0XHRVU0VSX0NPTlRFWFQuc3BhY2VJZCA9IHNwYWNlSWRcclxuXHRcdFVTRVJfQ09OVEVYVC51c2VyID0ge1xyXG5cdFx0XHRfaWQ6IHVzZXJJZFxyXG5cdFx0XHRuYW1lOiBzdS5uYW1lLFxyXG5cdFx0XHRtb2JpbGU6IHN1Lm1vYmlsZSxcclxuXHRcdFx0cG9zaXRpb246IHN1LnBvc2l0aW9uLFxyXG5cdFx0XHRlbWFpbDogc3UuZW1haWxcclxuXHRcdFx0Y29tcGFueTogc3UuY29tcGFueVxyXG5cdFx0XHRjb21wYW55X2lkOiBzdS5jb21wYW55X2lkXHJcblx0XHRcdGNvbXBhbnlfaWRzOiBzdS5jb21wYW55X2lkc1xyXG5cdFx0fVxyXG5cdFx0c3BhY2VfdXNlcl9vcmcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvcmdhbml6YXRpb25zXCIpPy5maW5kT25lKHN1Lm9yZ2FuaXphdGlvbilcclxuXHRcdGlmIHNwYWNlX3VzZXJfb3JnXHJcblx0XHRcdFVTRVJfQ09OVEVYVC51c2VyLm9yZ2FuaXphdGlvbiA9IHtcclxuXHRcdFx0XHRfaWQ6IHNwYWNlX3VzZXJfb3JnLl9pZCxcclxuXHRcdFx0XHRuYW1lOiBzcGFjZV91c2VyX29yZy5uYW1lLFxyXG5cdFx0XHRcdGZ1bGxuYW1lOiBzcGFjZV91c2VyX29yZy5mdWxsbmFtZVxyXG5cdFx0XHR9XHJcblx0XHRyZXR1cm4gVVNFUl9DT05URVhUXHJcblxyXG5DcmVhdG9yLmdldFJlbGF0aXZlVXJsID0gKHVybCktPlxyXG5cclxuXHRpZiBfLmlzRnVuY3Rpb24oU3RlZWRvcy5pc0NvcmRvdmEpICYmIFN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgKHVybD8uc3RhcnRzV2l0aChcIi9hc3NldHNcIikgfHwgdXJsPy5zdGFydHNXaXRoKFwiYXNzZXRzXCIpIHx8IHVybD8uc3RhcnRzV2l0aChcIi9wYWNrYWdlc1wiKSlcclxuXHRcdGlmICEvXlxcLy8udGVzdCh1cmwpXHJcblx0XHRcdHVybCA9IFwiL1wiICsgdXJsXHJcblx0XHRyZXR1cm4gdXJsXHJcblxyXG5cdGlmIHVybFxyXG5cdFx0IyB1cmzlvIDlpLTmsqHmnIlcIi9cIu+8jOmcgOimgea3u+WKoFwiL1wiXHJcblx0XHRpZiAhL15cXC8vLnRlc3QodXJsKVxyXG5cdFx0XHR1cmwgPSBcIi9cIiArIHVybFxyXG5cdFx0cmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVggKyB1cmxcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWFxyXG5cclxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkID0gKHVzZXJJZCwgc3BhY2VJZCktPlxyXG5cdHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKClcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJylcclxuXHRlbHNlXHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpXHJcblx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtjb21wYW55X2lkOjF9fSlcclxuXHRyZXR1cm4gc3UuY29tcGFueV9pZFxyXG5cclxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyA9ICh1c2VySWQsIHNwYWNlSWQpLT5cclxuXHR1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpXHJcblx0ZWxzZVxyXG5cdFx0aWYgIXNwYWNlSWRcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKVxyXG5cdHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7Y29tcGFueV9pZHM6MX19KVxyXG5cdHJldHVybiBzdT8uY29tcGFueV9pZHNcclxuXHJcbkNyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zID0gKHBvKS0+XHJcblx0aWYgcG8uYWxsb3dDcmVhdGVcclxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcclxuXHRpZiBwby5hbGxvd0VkaXRcclxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcclxuXHRpZiBwby5hbGxvd0RlbGV0ZVxyXG5cdFx0cG8uYWxsb3dFZGl0ID0gdHJ1ZVxyXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdGlmIHBvLnZpZXdBbGxSZWNvcmRzXHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0aWYgcG8ubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdFx0cG8uYWxsb3dFZGl0ID0gdHJ1ZVxyXG5cdFx0cG8uYWxsb3dEZWxldGUgPSB0cnVlXHJcblx0XHRwby52aWV3QWxsUmVjb3JkcyA9IHRydWVcclxuXHRpZiBwby52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcclxuXHRpZiBwby5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdFx0cG8uYWxsb3dFZGl0ID0gdHJ1ZVxyXG5cdFx0cG8uYWxsb3dEZWxldGUgPSB0cnVlXHJcblx0XHRwby52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlXHJcblx0cmV0dXJuIHBvXHJcblxyXG5DcmVhdG9yLmdldFRlbXBsYXRlU3BhY2VJZCA9ICgpLT5cclxuXHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8udGVtcGxhdGVTcGFjZUlkXHJcblxyXG5DcmVhdG9yLmdldENsb3VkQWRtaW5TcGFjZUlkID0gKCktPlxyXG5cdHJldHVybiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5jbG91ZEFkbWluU3BhY2VJZFxyXG5cclxuQ3JlYXRvci5pc1RlbXBsYXRlU3BhY2UgPSAoc3BhY2VJZCktPlxyXG5cdGlmIHNwYWNlSWQgJiYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8udGVtcGxhdGVTcGFjZUlkID09IHNwYWNlSWRcclxuXHRcdHJldHVybiB0cnVlXHJcblx0cmV0dXJuIGZhbHNlXHJcblxyXG5DcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlID0gKHNwYWNlSWQpLT5cclxuXHRpZiBzcGFjZUlkICYmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LmNsb3VkQWRtaW5TcGFjZUlkID09IHNwYWNlSWRcclxuXHRcdHJldHVybiB0cnVlXHJcblx0cmV0dXJuIGZhbHNlXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRpZiBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSXHJcblx0XHRDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyID0gcHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUlxyXG5cdGVsc2VcclxuXHRcdHBhdGggPSByZXF1aXJlKCdwYXRoJylcclxuXHRcdENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwYXRoLnJlc29sdmUocGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwgJy4uLy4uLy4uL2NmcycpKVxyXG4iLCJ2YXIgRmliZXIsIHBhdGg7XG5cbkNyZWF0b3IuZGVwcyA9IHtcbiAgYXBwOiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5LFxuICBvYmplY3Q6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3lcbn07XG5cbkNyZWF0b3IuX1RFTVBMQVRFID0ge1xuICBBcHBzOiB7fSxcbiAgT2JqZWN0czoge31cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG4gIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBvcHRpb25zRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbiAgcmV0dXJuIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBjcmVhdGVGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xufSk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcbiAgQ3JlYXRvci5maWJlckxvYWRPYmplY3RzID0gZnVuY3Rpb24ob2JqLCBvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBGaWJlcihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmxvYWRPYmplY3RzKG9iaiwgb2JqZWN0X25hbWUpO1xuICAgIH0pLnJ1bigpO1xuICB9O1xufVxuXG5DcmVhdG9yLmxvYWRPYmplY3RzID0gZnVuY3Rpb24ob2JqLCBvYmplY3RfbmFtZSkge1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBvYmoubmFtZTtcbiAgfVxuICBpZiAoIW9iai5saXN0X3ZpZXdzKSB7XG4gICAgb2JqLmxpc3Rfdmlld3MgPSB7fTtcbiAgfVxuICBpZiAob2JqLnNwYWNlKSB7XG4gICAgb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iaik7XG4gIH1cbiAgaWYgKG9iamVjdF9uYW1lID09PSAnY2ZzX2ZpbGVzX2ZpbGVyZWNvcmQnKSB7XG4gICAgb2JqZWN0X25hbWUgPSAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnO1xuICAgIG9iaiA9IF8uY2xvbmUob2JqKTtcbiAgICBvYmoubmFtZSA9IG9iamVjdF9uYW1lO1xuICAgIENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0gPSBvYmo7XG4gIH1cbiAgQ3JlYXRvci5jb252ZXJ0T2JqZWN0KG9iaik7XG4gIG5ldyBDcmVhdG9yLk9iamVjdChvYmopO1xuICBDcmVhdG9yLmluaXRUcmlnZ2VycyhvYmplY3RfbmFtZSk7XG4gIENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSk7XG4gIHJldHVybiBvYmo7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdC5zcGFjZSkge1xuICAgIHJldHVybiBcImNfXCIgKyBvYmplY3Quc3BhY2UgKyBcIl9cIiArIG9iamVjdC5uYW1lO1xuICB9XG4gIHJldHVybiBvYmplY3QubmFtZTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKSB7XG4gIHZhciByZWYsIHJlZjE7XG4gIGlmIChfLmlzQXJyYXkob2JqZWN0X25hbWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoKHJlZiA9IENyZWF0b3IuZGVwcykgIT0gbnVsbCkge1xuICAgICAgaWYgKChyZWYxID0gcmVmLm9iamVjdCkgIT0gbnVsbCkge1xuICAgICAgICByZWYxLmRlcGVuZCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RCeUlkID0gZnVuY3Rpb24ob2JqZWN0X2lkKSB7XG4gIHJldHVybiBfLmZpbmRXaGVyZShDcmVhdG9yLm9iamVjdHNCeU5hbWUsIHtcbiAgICBfaWQ6IG9iamVjdF9pZFxuICB9KTtcbn07XG5cbkNyZWF0b3IucmVtb3ZlT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgY29uc29sZS5sb2coXCJyZW1vdmVPYmplY3RcIiwgb2JqZWN0X25hbWUpO1xuICBkZWxldGUgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgcmV0dXJuIGRlbGV0ZSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdO1xufTtcblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1socmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpKSAhPSBudWxsID8gcmVmLl9jb2xsZWN0aW9uX25hbWUgOiB2b2lkIDBdO1xuICB9XG59O1xuXG5DcmVhdG9yLnJlbW92ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICByZXR1cm4gZGVsZXRlIENyZWF0b3IuQ29sbGVjdGlvbnNbb2JqZWN0X25hbWVdO1xufTtcblxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIHJlZiwgcmVmMSwgc3BhY2U7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIHNwYWNlID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KFwic3BhY2VzXCIpKSAhPSBudWxsID8gKHJlZjEgPSByZWYuZGIpICE9IG51bGwgPyByZWYxLmZpbmRPbmUoc3BhY2VJZCwge1xuICAgIGZpZWxkczoge1xuICAgICAgYWRtaW5zOiAxXG4gICAgfVxuICB9KSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgaWYgKHNwYWNlICE9IG51bGwgPyBzcGFjZS5hZG1pbnMgOiB2b2lkIDApIHtcbiAgICByZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKSA+PSAwO1xuICB9XG59O1xuXG5DcmVhdG9yLmV2YWx1YXRlRm9ybXVsYSA9IGZ1bmN0aW9uKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gIGlmICghXy5pc1N0cmluZyhmb3JtdWxhcikpIHtcbiAgICByZXR1cm4gZm9ybXVsYXI7XG4gIH1cbiAgaWYgKENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKSkge1xuICAgIHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbiAgcmV0dXJuIGZvcm11bGFyO1xufTtcblxuQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnMgPSBmdW5jdGlvbihmaWx0ZXJzLCBjb250ZXh0KSB7XG4gIHZhciBzZWxlY3RvcjtcbiAgc2VsZWN0b3IgPSB7fTtcbiAgXy5lYWNoKGZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlcikge1xuICAgIHZhciBhY3Rpb24sIG5hbWUsIHZhbHVlO1xuICAgIGlmICgoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIubGVuZ3RoIDogdm9pZCAwKSA9PT0gMykge1xuICAgICAgbmFtZSA9IGZpbHRlclswXTtcbiAgICAgIGFjdGlvbiA9IGZpbHRlclsxXTtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBjb250ZXh0KTtcbiAgICAgIHNlbGVjdG9yW25hbWVdID0ge307XG4gICAgICByZXR1cm4gc2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlO1xuICAgIH1cbiAgfSk7XG4gIGNvbnNvbGUubG9nKFwiZXZhbHVhdGVGaWx0ZXJzLS0+c2VsZWN0b3JcIiwgc2VsZWN0b3IpO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5DcmVhdG9yLmlzQ29tbW9uU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHJldHVybiBzcGFjZUlkID09PSAnY29tbW9uJztcbn07XG5cblxuLypcblx0ZG9jc++8muW+heaOkuW6j+eahOaWh+aho+aVsOe7hFxuXHRpZHPvvJpfaWTpm4blkIhcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcblx0cmV0dXJuIOaMieeFp2lkc+eahOmhuuW6j+i/lOWbnuaWsOeahOaWh+aho+mbhuWQiFxuICovXG5cbkNyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzID0gZnVuY3Rpb24oZG9jcywgaWRzLCBpZF9rZXksIGhpdF9maXJzdCkge1xuICB2YXIgdmFsdWVzO1xuICBpZiAoIWlkX2tleSkge1xuICAgIGlkX2tleSA9IFwiX2lkXCI7XG4gIH1cbiAgaWYgKGhpdF9maXJzdCkge1xuICAgIHZhbHVlcyA9IGRvY3MuZ2V0UHJvcGVydHkoaWRfa2V5KTtcbiAgICByZXR1cm4gXy5zb3J0QnkoZG9jcywgZnVuY3Rpb24oZG9jKSB7XG4gICAgICB2YXIgX2luZGV4O1xuICAgICAgX2luZGV4ID0gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pO1xuICAgICAgaWYgKF9pbmRleCA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfaW5kZXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaWRzLmxlbmd0aCArIF8uaW5kZXhPZih2YWx1ZXMsIGRvY1tpZF9rZXldKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXy5zb3J0QnkoZG9jcywgZnVuY3Rpb24oZG9jKSB7XG4gICAgICByZXR1cm4gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5cbi8qXG5cdOaMieeUqOaIt+aJgOWxnuacrOWcsOWMluivreiogOi/m+ihjOaOkuW6j++8jOaUr+aMgeS4reaWh+OAgeaVsOWAvOOAgeaXpeacn+etieWtl+auteaOkuW6j1xuXHTlr7nkuo5PYmplY3TnsbvlnovvvIzlpoLmnpzmj5DkvpvkvZznlKjln5/kuK1rZXnlsZ7mgKfvvIzliJnlj5blgLzkuLp2YWx1ZVtrZXld6L+b6KGM5o6S5bqP5q+U6L6D77yM5Y+N5LmL5pW05LiqT2JqZWN0LnRvU3RyaW5nKCnlkI7mjpLluo/mr5TovoNcbiAqL1xuXG5DcmVhdG9yLnNvcnRpbmdNZXRob2QgPSBmdW5jdGlvbih2YWx1ZTEsIHZhbHVlMikge1xuICB2YXIgaXNWYWx1ZTFFbXB0eSwgaXNWYWx1ZTJFbXB0eSwgbG9jYWxlO1xuICBpZiAodGhpcy5rZXkpIHtcbiAgICB2YWx1ZTEgPSB2YWx1ZTFbdGhpcy5rZXldO1xuICAgIHZhbHVlMiA9IHZhbHVlMlt0aGlzLmtleV07XG4gIH1cbiAgaWYgKHZhbHVlMSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICB2YWx1ZTEgPSB2YWx1ZTEuZ2V0VGltZSgpO1xuICB9XG4gIGlmICh2YWx1ZTIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgdmFsdWUyID0gdmFsdWUyLmdldFRpbWUoKTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlMSA9PT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgdmFsdWUyID09PSBcIm51bWJlclwiKSB7XG4gICAgcmV0dXJuIHZhbHVlMSAtIHZhbHVlMjtcbiAgfVxuICBpc1ZhbHVlMUVtcHR5ID0gdmFsdWUxID09PSBudWxsIHx8IHZhbHVlMSA9PT0gdm9pZCAwO1xuICBpc1ZhbHVlMkVtcHR5ID0gdmFsdWUyID09PSBudWxsIHx8IHZhbHVlMiA9PT0gdm9pZCAwO1xuICBpZiAoaXNWYWx1ZTFFbXB0eSAmJiAhaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBpZiAoaXNWYWx1ZTFFbXB0eSAmJiBpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgaWYgKCFpc1ZhbHVlMUVtcHR5ICYmIGlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpO1xuICByZXR1cm4gdmFsdWUxLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZSh2YWx1ZTIudG9TdHJpbmcoKSwgbG9jYWxlKTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgcGVybWlzc2lvbnMsIHJlbGF0ZWRMaXN0LCByZWxhdGVkTGlzdE1hcCwgcmVsYXRlZF9vYmplY3RzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgfVxuICByZWxhdGVkX29iamVjdHMgPSBbXTtcbiAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gIGlmICghX29iamVjdCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdHM7XG4gIH1cbiAgcmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmICFfLmlzRW1wdHkocmVsYXRlZExpc3QpKSB7XG4gICAgcmVsYXRlZExpc3RNYXAgPSB7fTtcbiAgICBfLmVhY2gocmVsYXRlZExpc3QsIGZ1bmN0aW9uKG9iak5hbWUpIHtcbiAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtvYmpOYW1lXSA9IHt9O1xuICAgIH0pO1xuICAgIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICAgIGlmICgocmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIpICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSAmJiByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSkge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgICAgIHNoYXJpbmc6IHJlbGF0ZWRfZmllbGQuc2hhcmluZ1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChyZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10pIHtcbiAgICAgIHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSA9IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddKSB7XG4gICAgICByZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10gPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJcbiAgICAgIH07XG4gICAgfVxuICAgIF8uZWFjaChbJ3Rhc2tzJywgJ25vdGVzJywgJ2V2ZW50cycsICdhcHByb3ZhbHMnXSwgZnVuY3Rpb24oZW5hYmxlT2JqTmFtZSkge1xuICAgICAgaWYgKHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdKSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSA9IHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogZW5hYmxlT2JqTmFtZSxcbiAgICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSkge1xuICAgICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKTtcbiAgICAgIGlmIChfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiAocGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDApKSB7XG4gICAgICAgIHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10gPSB7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IFwiYXVkaXRfcmVjb3Jkc1wiLFxuICAgICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZWxhdGVkX29iamVjdHMgPSBfLnZhbHVlcyhyZWxhdGVkTGlzdE1hcCk7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfZmlsZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiXG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICBpZiAoKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIiAmJiByZWxhdGVkX2ZpZWxkLnJlbGF0ZWRMaXN0KSkgJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT09IG9iamVjdF9uYW1lKSB7XG4gICAgICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcIm9iamVjdF9maWVsZHNcIikge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdHMuc3BsaWNlKDAsIDAsIHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsXG4gICAgICAgICAgICBzaGFyaW5nOiByZWxhdGVkX2ZpZWxkLnNoYXJpbmdcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgaWYgKF9vYmplY3QuZW5hYmxlX3Rhc2tzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwidGFza3NcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9ub3Rlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcIm5vdGVzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfZXZlbnRzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiZXZlbnRzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfaW5zdGFuY2VzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiaW5zdGFuY2VzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfYXBwcm92YWxzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiYXBwcm92YWxzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKTtcbiAgICBpZiAoX29iamVjdC5lbmFibGVfYXVkaXQgJiYgKHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwKSkge1xuICAgICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgICBvYmplY3RfbmFtZTogXCJhdWRpdF9yZWNvcmRzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZWxhdGVkX29iamVjdHM7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb250ZXh0ID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBpc1VuU2FmZU1vZGUpIHtcbiAgdmFyIFVTRVJfQ09OVEVYVCwgcmVmLCBzcGFjZV91c2VyX29yZywgc3UsIHN1RmllbGRzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcmV0dXJuIENyZWF0b3IuVVNFUl9DT05URVhUO1xuICB9IGVsc2Uge1xuICAgIGlmICghKHVzZXJJZCAmJiBzcGFjZUlkKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwidGhlIHBhcmFtcyB1c2VySWQgYW5kIHNwYWNlSWQgaXMgcmVxdWlyZWQgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFVzZXJDb250ZXh0XCIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHN1RmllbGRzID0ge1xuICAgICAgbmFtZTogMSxcbiAgICAgIG1vYmlsZTogMSxcbiAgICAgIHBvc2l0aW9uOiAxLFxuICAgICAgZW1haWw6IDEsXG4gICAgICBjb21wYW55OiAxLFxuICAgICAgb3JnYW5pemF0aW9uOiAxLFxuICAgICAgc3BhY2U6IDEsXG4gICAgICBjb21wYW55X2lkOiAxLFxuICAgICAgY29tcGFueV9pZHM6IDFcbiAgICB9O1xuICAgIHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHN1RmllbGRzXG4gICAgfSk7XG4gICAgaWYgKCFzdSkge1xuICAgICAgc3BhY2VJZCA9IG51bGw7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgaWYgKGlzVW5TYWZlTW9kZSkge1xuICAgICAgICBzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogc3VGaWVsZHNcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghc3UpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzcGFjZUlkID0gc3Uuc3BhY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgVVNFUl9DT05URVhUID0ge307XG4gICAgVVNFUl9DT05URVhULnVzZXJJZCA9IHVzZXJJZDtcbiAgICBVU0VSX0NPTlRFWFQuc3BhY2VJZCA9IHNwYWNlSWQ7XG4gICAgVVNFUl9DT05URVhULnVzZXIgPSB7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIG5hbWU6IHN1Lm5hbWUsXG4gICAgICBtb2JpbGU6IHN1Lm1vYmlsZSxcbiAgICAgIHBvc2l0aW9uOiBzdS5wb3NpdGlvbixcbiAgICAgIGVtYWlsOiBzdS5lbWFpbCxcbiAgICAgIGNvbXBhbnk6IHN1LmNvbXBhbnksXG4gICAgICBjb21wYW55X2lkOiBzdS5jb21wYW55X2lkLFxuICAgICAgY29tcGFueV9pZHM6IHN1LmNvbXBhbnlfaWRzXG4gICAgfTtcbiAgICBzcGFjZV91c2VyX29yZyA9IChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvcmdhbml6YXRpb25zXCIpKSAhPSBudWxsID8gcmVmLmZpbmRPbmUoc3Uub3JnYW5pemF0aW9uKSA6IHZvaWQgMDtcbiAgICBpZiAoc3BhY2VfdXNlcl9vcmcpIHtcbiAgICAgIFVTRVJfQ09OVEVYVC51c2VyLm9yZ2FuaXphdGlvbiA9IHtcbiAgICAgICAgX2lkOiBzcGFjZV91c2VyX29yZy5faWQsXG4gICAgICAgIG5hbWU6IHNwYWNlX3VzZXJfb3JnLm5hbWUsXG4gICAgICAgIGZ1bGxuYW1lOiBzcGFjZV91c2VyX29yZy5mdWxsbmFtZVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIFVTRVJfQ09OVEVYVDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICBpZiAoXy5pc0Z1bmN0aW9uKFN0ZWVkb3MuaXNDb3Jkb3ZhKSAmJiBTdGVlZG9zLmlzQ29yZG92YSgpICYmICgodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcIi9hc3NldHNcIikgOiB2b2lkIDApIHx8ICh1cmwgIT0gbnVsbCA/IHVybC5zdGFydHNXaXRoKFwiYXNzZXRzXCIpIDogdm9pZCAwKSB8fCAodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcIi9wYWNrYWdlc1wiKSA6IHZvaWQgMCkpKSB7XG4gICAgaWYgKCEvXlxcLy8udGVzdCh1cmwpKSB7XG4gICAgICB1cmwgPSBcIi9cIiArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICBpZiAodXJsKSB7XG4gICAgaWYgKCEvXlxcLy8udGVzdCh1cmwpKSB7XG4gICAgICB1cmwgPSBcIi9cIiArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVggKyB1cmw7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVg7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgc3U7XG4gIHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKCk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpO1xuICB9IGVsc2Uge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKTtcbiAgICB9XG4gIH1cbiAgc3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNvbXBhbnlfaWQ6IDFcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3UuY29tcGFueV9pZDtcbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHMgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIHN1O1xuICB1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJyk7XG4gICAgfVxuICB9XG4gIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjb21wYW55X2lkczogMVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzdSAhPSBudWxsID8gc3UuY29tcGFueV9pZHMgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHBvKSB7XG4gIGlmIChwby5hbGxvd0NyZWF0ZSkge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RWRpdCkge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RGVsZXRlKSB7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby52aWV3QWxsUmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgIHBvLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgIHBvLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIHBvO1xufTtcblxuQ3JlYXRvci5nZXRUZW1wbGF0ZVNwYWNlSWQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYudGVtcGxhdGVTcGFjZUlkIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5nZXRDbG91ZEFkbWluU3BhY2VJZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi5jbG91ZEFkbWluU3BhY2VJZCA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuaXNUZW1wbGF0ZVNwYWNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoc3BhY2VJZCAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi50ZW1wbGF0ZVNwYWNlSWQgOiB2b2lkIDApID09PSBzcGFjZUlkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKHNwYWNlSWQgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYuY2xvdWRBZG1pblNwYWNlSWQgOiB2b2lkIDApID09PSBzcGFjZUlkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBpZiAocHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUikge1xuICAgIENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSO1xuICB9IGVsc2Uge1xuICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHBhdGgucmVzb2x2ZShwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCAnLi4vLi4vLi4vY2ZzJykpO1xuICB9XG59XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdCMg55So5oi36I635Y+WbG9va3VwIOOAgW1hc3Rlcl9kZXRhaWznsbvlnovlrZfmrrXnmoTpgInpobnlgLxcclxuXHRcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjogKG9wdGlvbnMpLT5cclxuXHRcdGlmIG9wdGlvbnM/LnBhcmFtcz8ucmVmZXJlbmNlX3RvXHJcblxyXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvcHRpb25zLnBhcmFtcy5yZWZlcmVuY2VfdG8sIG9wdGlvbnMucGFyYW1zLnNwYWNlKVxyXG5cclxuXHRcdFx0bmFtZV9maWVsZF9rZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVlcclxuXHJcblx0XHRcdHF1ZXJ5ID0ge31cclxuXHRcdFx0aWYgb3B0aW9ucy5wYXJhbXMuc3BhY2VcclxuXHRcdFx0XHRxdWVyeS5zcGFjZSA9IG9wdGlvbnMucGFyYW1zLnNwYWNlXHJcblxyXG5cdFx0XHRcdHNvcnQgPSBvcHRpb25zPy5zb3J0XHJcblxyXG5cdFx0XHRcdHNlbGVjdGVkID0gb3B0aW9ucz8uc2VsZWN0ZWQgfHwgW11cclxuXHJcblx0XHRcdFx0b3B0aW9uc19saW1pdCA9IG9wdGlvbnM/Lm9wdGlvbnNfbGltaXQgfHwgMTBcclxuXHJcblx0XHRcdFx0aWYgb3B0aW9ucy5zZWFyY2hUZXh0XHJcblx0XHRcdFx0XHRzZWFyY2hUZXh0UXVlcnkgPSB7fVxyXG5cdFx0XHRcdFx0c2VhcmNoVGV4dFF1ZXJ5W25hbWVfZmllbGRfa2V5XSA9IHskcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dH1cclxuXHJcblx0XHRcdFx0aWYgb3B0aW9ucz8udmFsdWVzPy5sZW5ndGhcclxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxyXG5cdFx0XHRcdFx0XHRxdWVyeS4kb3IgPSBbe19pZDogeyRpbjogb3B0aW9ucy52YWx1ZXN9fSwgc2VhcmNoVGV4dFF1ZXJ5XVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRxdWVyeS4kb3IgPSBbe19pZDogeyRpbjogb3B0aW9ucy52YWx1ZXN9fV1cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcclxuXHRcdFx0XHRcdFx0Xy5leHRlbmQocXVlcnksIHNlYXJjaFRleHRRdWVyeSlcclxuXHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHskbmluOiBzZWxlY3RlZH1cclxuXHJcblx0XHRcdFx0Y29sbGVjdGlvbiA9IG9iamVjdC5kYlxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zLmZpbHRlclF1ZXJ5XHJcblx0XHRcdFx0XHRfLmV4dGVuZCBxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeVxyXG5cclxuXHRcdFx0XHRxdWVyeV9vcHRpb25zID0ge2xpbWl0OiBvcHRpb25zX2xpbWl0fVxyXG5cclxuXHRcdFx0XHRpZiBzb3J0ICYmIF8uaXNPYmplY3Qoc29ydClcclxuXHRcdFx0XHRcdHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnRcclxuXHJcblx0XHRcdFx0aWYgY29sbGVjdGlvblxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdHJlY29yZHMgPSBjb2xsZWN0aW9uLmZpbmQocXVlcnksIHF1ZXJ5X29wdGlvbnMpLmZldGNoKClcclxuXHRcdFx0XHRcdFx0cmVzdWx0cyA9IFtdXHJcblx0XHRcdFx0XHRcdF8uZWFjaCByZWNvcmRzLCAocmVjb3JkKS0+XHJcblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoXHJcblx0XHRcdFx0XHRcdFx0XHRsYWJlbDogcmVjb3JkW25hbWVfZmllbGRfa2V5XVxyXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHJlY29yZC5faWRcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHNcclxuXHRcdFx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIGUubWVzc2FnZSArIFwiLS0+XCIgKyBKU09OLnN0cmluZ2lmeShvcHRpb25zKVxyXG5cdFx0cmV0dXJuIFtdICIsIk1ldGVvci5tZXRob2RzKHtcbiAgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZSwgbmFtZV9maWVsZF9rZXksIG9iamVjdCwgb3B0aW9uc19saW1pdCwgcXVlcnksIHF1ZXJ5X29wdGlvbnMsIHJlY29yZHMsIHJlZiwgcmVmMSwgcmVzdWx0cywgc2VhcmNoVGV4dFF1ZXJ5LCBzZWxlY3RlZCwgc29ydDtcbiAgICBpZiAob3B0aW9ucyAhPSBudWxsID8gKHJlZiA9IG9wdGlvbnMucGFyYW1zKSAhPSBudWxsID8gcmVmLnJlZmVyZW5jZV90byA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob3B0aW9ucy5wYXJhbXMucmVmZXJlbmNlX3RvLCBvcHRpb25zLnBhcmFtcy5zcGFjZSk7XG4gICAgICBuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgICAgIHF1ZXJ5ID0ge307XG4gICAgICBpZiAob3B0aW9ucy5wYXJhbXMuc3BhY2UpIHtcbiAgICAgICAgcXVlcnkuc3BhY2UgPSBvcHRpb25zLnBhcmFtcy5zcGFjZTtcbiAgICAgICAgc29ydCA9IG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc29ydCA6IHZvaWQgMDtcbiAgICAgICAgc2VsZWN0ZWQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zZWxlY3RlZCA6IHZvaWQgMCkgfHwgW107XG4gICAgICAgIG9wdGlvbnNfbGltaXQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5vcHRpb25zX2xpbWl0IDogdm9pZCAwKSB8fCAxMDtcbiAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7XG4gICAgICAgICAgICAkcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYxID0gb3B0aW9ucy52YWx1ZXMpICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIHF1ZXJ5LiRvciA9IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgJGluOiBvcHRpb25zLnZhbHVlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSwgc2VhcmNoVGV4dFF1ZXJ5XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKHF1ZXJ5LCBzZWFyY2hUZXh0UXVlcnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxdWVyeS5faWQgPSB7XG4gICAgICAgICAgICAkbmluOiBzZWxlY3RlZFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY29sbGVjdGlvbiA9IG9iamVjdC5kYjtcbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsdGVyUXVlcnkpIHtcbiAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeSk7XG4gICAgICAgIH1cbiAgICAgICAgcXVlcnlfb3B0aW9ucyA9IHtcbiAgICAgICAgICBsaW1pdDogb3B0aW9uc19saW1pdFxuICAgICAgICB9O1xuICAgICAgICBpZiAoc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpKSB7XG4gICAgICAgICAgcXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpO1xuICAgICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgXy5lYWNoKHJlY29yZHMsIGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBsYWJlbDogcmVjb3JkW25hbWVfZmllbGRfa2V5XSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVjb3JkLl9pZFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlLm1lc3NhZ2UgKyBcIi0tPlwiICsgSlNPTi5zdHJpbmdpZnkob3B0aW9ucykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgJ3Bvc3QnLCAnL2FwaS93b3JrZmxvdy92aWV3LzppbnN0YW5jZUlkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxyXG5cdFx0Y3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkXHJcblxyXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxyXG5cdFx0b2JqZWN0X25hbWUgPSBoYXNoRGF0YS5vYmplY3RfbmFtZVxyXG5cdFx0cmVjb3JkX2lkID0gaGFzaERhdGEucmVjb3JkX2lkXHJcblx0XHRzcGFjZV9pZCA9IGhhc2hEYXRhLnNwYWNlX2lkXHJcblxyXG5cdFx0Y2hlY2sgb2JqZWN0X25hbWUsIFN0cmluZ1xyXG5cdFx0Y2hlY2sgcmVjb3JkX2lkLCBTdHJpbmdcclxuXHRcdGNoZWNrIHNwYWNlX2lkLCBTdHJpbmdcclxuXHJcblx0XHRpbnNJZCA9IHJlcS5wYXJhbXMuaW5zdGFuY2VJZFxyXG5cdFx0eF91c2VyX2lkID0gcmVxLnF1ZXJ5WydYLVVzZXItSWQnXVxyXG5cdFx0eF9hdXRoX3Rva2VuID0gcmVxLnF1ZXJ5WydYLUF1dGgtVG9rZW4nXVxyXG5cclxuXHRcdHJlZGlyZWN0X3VybCA9IFwiL1wiXHJcblx0XHRpbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLmZpbmRPbmUoaW5zSWQpXHJcblx0XHQjIC0g5oiR55qE6I2J56i/5bCx6Lez6L2s6Iez6I2J56i/566xXHJcblx0XHQjIC0g5oiR55qE5b6F5a6h5qC45bCx6Lez6L2s6Iez5b6F5a6h5qC4XHJcblx0XHQjIC0g5LiN5piv5oiR55qE55Sz6K+35Y2V5YiZ6Lez6L2s6Iez5omT5Y2w6aG16Z2iXHJcblx0XHQjIC0g5aaC55Sz6K+35Y2V5LiN5a2Y5Zyo5YiZ5o+Q56S655So5oi355Sz6K+35Y2V5bey5Yig6Zmk77yM5bm25LiU5pu05pawcmVjb3Jk55qE54q25oCB77yM5L2/55So5oi35Y+v5Lul6YeN5paw5Y+R6LW35a6h5om5XHJcblx0XHRpZiBpbnNcclxuXHRcdFx0d29ya2Zsb3dVcmwgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLndvcmtmbG93LnVybFxyXG5cdFx0XHRib3ggPSAnJ1xyXG5cdFx0XHRzcGFjZUlkID0gaW5zLnNwYWNlXHJcblx0XHRcdGZsb3dJZCA9IGlucy5mbG93XHJcblxyXG5cdFx0XHRpZiAoaW5zLmluYm94X3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWQpIG9yIChpbnMuY2NfdXNlcnM/LmluY2x1ZGVzIGN1cnJlbnRfdXNlcl9pZClcclxuXHRcdFx0XHRib3ggPSAnaW5ib3gnXHJcblx0XHRcdGVsc2UgaWYgaW5zLm91dGJveF91c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkXHJcblx0XHRcdFx0Ym94ID0gJ291dGJveCdcclxuXHRcdFx0ZWxzZSBpZiBpbnMuc3RhdGUgaXMgJ2RyYWZ0JyBhbmQgaW5zLnN1Ym1pdHRlciBpcyBjdXJyZW50X3VzZXJfaWRcclxuXHRcdFx0XHRib3ggPSAnZHJhZnQnXHJcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdwZW5kaW5nJyBhbmQgKGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkIG9yIGlucy5hcHBsaWNhbnQgaXMgY3VycmVudF91c2VyX2lkKVxyXG5cdFx0XHRcdGJveCA9ICdwZW5kaW5nJ1xyXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAnY29tcGxldGVkJyBhbmQgaW5zLnN1Ym1pdHRlciBpcyBjdXJyZW50X3VzZXJfaWRcclxuXHRcdFx0XHRib3ggPSAnY29tcGxldGVkJ1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0IyDpqozor4Fsb2dpbiB1c2VyX2lk5a+56K+l5rWB56iL5pyJ566h55CG55Sz6K+35Y2V55qE5p2D6ZmQXHJcblx0XHRcdFx0cGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd0lkLCBjdXJyZW50X3VzZXJfaWQpXHJcblx0XHRcdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkLCB7IGZpZWxkczogeyBhZG1pbnM6IDEgfSB9KVxyXG5cdFx0XHRcdGlmIHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRtaW5cIikgb3Igc3BhY2UuYWRtaW5zLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZClcclxuXHRcdFx0XHRcdGJveCA9ICdtb25pdG9yJ1xyXG5cclxuXHRcdFx0aWYgYm94XHJcblx0XHRcdFx0cmVkaXJlY3RfdXJsID0gd29ya2Zsb3dVcmwgKyBcIndvcmtmbG93L3NwYWNlLyN7c3BhY2VJZH0vI3tib3h9LyN7aW5zSWR9P1gtVXNlci1JZD0je3hfdXNlcl9pZH0mWC1BdXRoLVRva2VuPSN7eF9hdXRoX3Rva2VufVwiXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZWRpcmVjdF91cmwgPSB3b3JrZmxvd1VybCArIFwid29ya2Zsb3cvc3BhY2UvI3tzcGFjZUlkfS9wcmludC8je2luc0lkfT9ib3g9bW9uaXRvciZwcmludF9pc19zaG93X3RyYWNlcz0xJnByaW50X2lzX3Nob3dfYXR0YWNobWVudHM9MSZYLVVzZXItSWQ9I3t4X3VzZXJfaWR9JlgtQXV0aC1Ub2tlbj0je3hfYXV0aF90b2tlbn1cIlxyXG5cclxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRcdGRhdGE6IHsgcmVkaXJlY3RfdXJsOiByZWRpcmVjdF91cmwgfVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVyblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZClcclxuXHRcdFx0aWYgY29sbGVjdGlvblxyXG5cdFx0XHRcdGNvbGxlY3Rpb24udXBkYXRlKHJlY29yZF9pZCwge1xyXG5cdFx0XHRcdFx0JHB1bGw6IHtcclxuXHRcdFx0XHRcdFx0XCJpbnN0YW5jZXNcIjoge1xyXG5cdFx0XHRcdFx0XHRcdFwiX2lkXCI6IGluc0lkXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvcicsICfnlLPor7fljZXlt7LliKDpmaQnKVxyXG5cclxuXHRjYXRjaCBlXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3sgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfV0gfVxyXG5cdFx0fVxyXG5cclxuIiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS93b3JrZmxvdy92aWV3LzppbnN0YW5jZUlkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJveCwgY29sbGVjdGlvbiwgY3VycmVudF91c2VyX2lkLCBjdXJyZW50X3VzZXJfaW5mbywgZSwgZmxvd0lkLCBoYXNoRGF0YSwgaW5zLCBpbnNJZCwgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25zLCByZWNvcmRfaWQsIHJlZGlyZWN0X3VybCwgcmVmLCByZWYxLCByZWYyLCBzcGFjZSwgc3BhY2VJZCwgc3BhY2VfaWQsIHdvcmtmbG93VXJsLCB4X2F1dGhfdG9rZW4sIHhfdXNlcl9pZDtcbiAgdHJ5IHtcbiAgICBjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpO1xuICAgIGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZDtcbiAgICBoYXNoRGF0YSA9IHJlcS5ib2R5O1xuICAgIG9iamVjdF9uYW1lID0gaGFzaERhdGEub2JqZWN0X25hbWU7XG4gICAgcmVjb3JkX2lkID0gaGFzaERhdGEucmVjb3JkX2lkO1xuICAgIHNwYWNlX2lkID0gaGFzaERhdGEuc3BhY2VfaWQ7XG4gICAgY2hlY2sob2JqZWN0X25hbWUsIFN0cmluZyk7XG4gICAgY2hlY2socmVjb3JkX2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIGluc0lkID0gcmVxLnBhcmFtcy5pbnN0YW5jZUlkO1xuICAgIHhfdXNlcl9pZCA9IHJlcS5xdWVyeVsnWC1Vc2VyLUlkJ107XG4gICAgeF9hdXRoX3Rva2VuID0gcmVxLnF1ZXJ5WydYLUF1dGgtVG9rZW4nXTtcbiAgICByZWRpcmVjdF91cmwgPSBcIi9cIjtcbiAgICBpbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLmZpbmRPbmUoaW5zSWQpO1xuICAgIGlmIChpbnMpIHtcbiAgICAgIHdvcmtmbG93VXJsID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLndvcmtmbG93LnVybDtcbiAgICAgIGJveCA9ICcnO1xuICAgICAgc3BhY2VJZCA9IGlucy5zcGFjZTtcbiAgICAgIGZsb3dJZCA9IGlucy5mbG93O1xuICAgICAgaWYgKCgocmVmID0gaW5zLmluYm94X3VzZXJzKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApIHx8ICgocmVmMSA9IGlucy5jY191c2VycykgIT0gbnVsbCA/IHJlZjEuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgYm94ID0gJ2luYm94JztcbiAgICAgIH0gZWxzZSBpZiAoKHJlZjIgPSBpbnMub3V0Ym94X3VzZXJzKSAhPSBudWxsID8gcmVmMi5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSB7XG4gICAgICAgIGJveCA9ICdvdXRib3gnO1xuICAgICAgfSBlbHNlIGlmIChpbnMuc3RhdGUgPT09ICdkcmFmdCcgJiYgaW5zLnN1Ym1pdHRlciA9PT0gY3VycmVudF91c2VyX2lkKSB7XG4gICAgICAgIGJveCA9ICdkcmFmdCc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ3BlbmRpbmcnICYmIChpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQgfHwgaW5zLmFwcGxpY2FudCA9PT0gY3VycmVudF91c2VyX2lkKSkge1xuICAgICAgICBib3ggPSAncGVuZGluZyc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ2NvbXBsZXRlZCcgJiYgaW5zLnN1Ym1pdHRlciA9PT0gY3VycmVudF91c2VyX2lkKSB7XG4gICAgICAgIGJveCA9ICdjb21wbGV0ZWQnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd0lkLCBjdXJyZW50X3VzZXJfaWQpO1xuICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQsIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGFkbWluczogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkbWluXCIpIHx8IHNwYWNlLmFkbWlucy5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpKSB7XG4gICAgICAgICAgYm94ID0gJ21vbml0b3InO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoYm94KSB7XG4gICAgICAgIHJlZGlyZWN0X3VybCA9IHdvcmtmbG93VXJsICsgKFwid29ya2Zsb3cvc3BhY2UvXCIgKyBzcGFjZUlkICsgXCIvXCIgKyBib3ggKyBcIi9cIiArIGluc0lkICsgXCI/WC1Vc2VyLUlkPVwiICsgeF91c2VyX2lkICsgXCImWC1BdXRoLVRva2VuPVwiICsgeF9hdXRoX3Rva2VuKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZGlyZWN0X3VybCA9IHdvcmtmbG93VXJsICsgKFwid29ya2Zsb3cvc3BhY2UvXCIgKyBzcGFjZUlkICsgXCIvcHJpbnQvXCIgKyBpbnNJZCArIFwiP2JveD1tb25pdG9yJnByaW50X2lzX3Nob3dfdHJhY2VzPTEmcHJpbnRfaXNfc2hvd19hdHRhY2htZW50cz0xJlgtVXNlci1JZD1cIiArIHhfdXNlcl9pZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIHhfYXV0aF90b2tlbik7XG4gICAgICB9XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlZGlyZWN0X3VybDogcmVkaXJlY3RfdXJsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCk7XG4gICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICBjb2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRfaWQsIHtcbiAgICAgICAgICAkcHVsbDoge1xuICAgICAgICAgICAgXCJpbnN0YW5jZXNcIjoge1xuICAgICAgICAgICAgICBcIl9pZFwiOiBpbnNJZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yJywgJ+eUs+ivt+WNleW3suWIoOmZpCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldEluaXRXaWR0aFBlcmNlbnQgPSAob2JqZWN0X25hbWUsIGNvbHVtbnMpIC0+XHJcblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKT8uX3NjaGVtYVxyXG5cdGNvbHVtbl9udW0gPSAwXHJcblx0aWYgX3NjaGVtYVxyXG5cdFx0Xy5lYWNoIGNvbHVtbnMsIChmaWVsZF9uYW1lKSAtPlxyXG5cdFx0XHRmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKVxyXG5cdFx0XHRpc193aWRlID0gZmllbGRbZmllbGRfbmFtZV0/LmF1dG9mb3JtPy5pc193aWRlXHJcblx0XHRcdGlmIGlzX3dpZGVcclxuXHRcdFx0XHRjb2x1bW5fbnVtICs9IDJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGNvbHVtbl9udW0gKz0gMVxyXG5cclxuXHRcdGluaXRfd2lkdGhfcGVyY2VudCA9IDEwMCAvIGNvbHVtbl9udW1cclxuXHRcdHJldHVybiBpbml0X3dpZHRoX3BlcmNlbnRcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRJc1dpZGUgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUpIC0+XHJcblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKS5fc2NoZW1hXHJcblx0aWYgX3NjaGVtYVxyXG5cdFx0ZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSlcclxuXHRcdGlzX3dpZGUgPSBmaWVsZFtmaWVsZF9uYW1lXT8uYXV0b2Zvcm0/LmlzX3dpZGVcclxuXHRcdHJldHVybiBpc193aWRlXHJcblxyXG5DcmVhdG9yLmdldFRhYnVsYXJPcmRlciA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5zKSAtPlxyXG5cdHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zPy5zZXR0aW5ncz8uZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wifSlcclxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRjb2x1bW5zID0gXy5tYXAgY29sdW1ucywgKGNvbHVtbiktPlxyXG5cdFx0ZmllbGQgPSBvYmouZmllbGRzW2NvbHVtbl1cclxuXHRcdGlmIGZpZWxkPy50eXBlIGFuZCAhZmllbGQuaGlkZGVuXHJcblx0XHRcdHJldHVybiBjb2x1bW5cclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxyXG5cdGNvbHVtbnMgPSBfLmNvbXBhY3QgY29sdW1uc1xyXG5cdGlmIHNldHRpbmcgYW5kIHNldHRpbmcuc2V0dGluZ3NcclxuXHRcdHNvcnQgPSBzZXR0aW5nLnNldHRpbmdzW2xpc3Rfdmlld19pZF0/LnNvcnQgfHwgW11cclxuXHRcdHNvcnQgPSBfLm1hcCBzb3J0LCAob3JkZXIpLT5cclxuXHRcdFx0a2V5ID0gb3JkZXJbMF1cclxuXHRcdFx0aW5kZXggPSBfLmluZGV4T2YoY29sdW1ucywga2V5KVxyXG5cdFx0XHRvcmRlclswXSA9IGluZGV4ICsgMVxyXG5cdFx0XHRyZXR1cm4gb3JkZXJcclxuXHRcdHJldHVybiBzb3J0XHJcblx0cmV0dXJuIFtdXHJcblxyXG5cclxuQ3JlYXRvci5pbml0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lKS0+XHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0Y29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl1cclxuXHRleHRyYV9jb2x1bW5zID0gW1wib3duZXJcIl1cclxuXHRkZWZhdWx0X2V4dHJhX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm93bmVyXCJdXHJcblx0aWYgZGVmYXVsdF9leHRyYV9jb2x1bW5zXHJcblx0XHRleHRyYV9jb2x1bW5zID0gXy51bmlvbiBleHRyYV9jb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnNcclxuXHJcblx0b3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KG9iamVjdF9uYW1lKSB8fCBbXVxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0Q3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHM/W29iamVjdF9uYW1lXSA9IFtdXHJcblxyXG5DcmVhdG9yLmNvbnZlcnRMaXN0VmlldyA9IChkZWZhdWx0X2NvbHVtZW5zLCBsaXN0X3ZpZXcsIGxpc3Rfdmlld19uYW1lKS0+XHJcblx0b2l0ZW0gPSBfLmNsb25lKGxpc3RfdmlldylcclxuXHRpZiAhXy5oYXMob2l0ZW0sIFwibmFtZVwiKVxyXG5cdFx0b2l0ZW0ubmFtZSA9IGxpc3Rfdmlld19uYW1lXHJcblx0aWYgIW9pdGVtLmNvbHVtbnNcclxuXHRcdGlmIGRlZmF1bHRfY29sdW1lbnNcclxuXHRcdFx0b2l0ZW0uY29sdW1ucyA9IGRlZmF1bHRfY29sdW1lbnNcclxuXHRpZiAhb2l0ZW0uY29sdW1uc1xyXG5cdFx0b2l0ZW0uY29sdW1ucyA9IFtcIm5hbWVcIl1cclxuXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkgJiYgIV8uaW5jbHVkZShvaXRlbS5jb2x1bW5zLCAnc3BhY2UnKVxyXG5cdFx0XHRvaXRlbS5jb2x1bW5zLnB1c2goJ3NwYWNlJylcclxuXHJcblxyXG5cdGlmICFvaXRlbS5maWx0ZXJfc2NvcGVcclxuXHRcdCMgbGlzdHZpZXfop4blm77nmoRmaWx0ZXJfc2NvcGXpu5jorqTlgLzmlLnkuLpzcGFjZSAjMTMxXHJcblx0XHRvaXRlbS5maWx0ZXJfc2NvcGUgPSBcInNwYWNlXCJcclxuXHJcblx0aWYgIV8uaGFzKG9pdGVtLCBcIl9pZFwiKVxyXG5cdFx0b2l0ZW0uX2lkID0gbGlzdF92aWV3X25hbWVcclxuXHRlbHNlXHJcblx0XHRvaXRlbS5sYWJlbCA9IG9pdGVtLmxhYmVsIHx8IGxpc3Rfdmlldy5uYW1lXHJcblxyXG5cdGlmIF8uaXNTdHJpbmcob2l0ZW0ub3B0aW9ucylcclxuXHRcdG9pdGVtLm9wdGlvbnMgPSBKU09OLnBhcnNlKG9pdGVtLm9wdGlvbnMpXHJcblxyXG5cdF8uZm9yRWFjaCBvaXRlbS5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cclxuXHRcdGlmICFfLmlzQXJyYXkoZmlsdGVyKSAmJiBfLmlzT2JqZWN0KGZpbHRlcilcclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpbHRlcj8udmFsdWUpXHJcblx0XHRcdFx0XHRmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcoZmlsdGVyPy5fdmFsdWUpXHJcblx0XHRcdFx0XHRmaWx0ZXIudmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXIuX3ZhbHVlfSlcIilcclxuXHRyZXR1cm4gb2l0ZW1cclxuXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRDcmVhdG9yLmdldFJlbGF0ZWRMaXN0ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0XHRsaXN0ID0gW11cclxuXHRcdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpXHJcblx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3RzLCAocmVsYXRlZF9vYmplY3RfaXRlbSkgLT5cclxuXHRcdFx0cmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ub2JqZWN0X25hbWVcclxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5mb3JlaWduX2tleVxyXG5cdFx0XHRzaGFyaW5nID0gcmVsYXRlZF9vYmplY3RfaXRlbS5zaGFyaW5nXHJcblx0XHRcdHJlbGF0ZWRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSlcclxuXHRcdFx0dW5sZXNzIHJlbGF0ZWRfb2JqZWN0XHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl1cclxuXHRcdFx0Y29sdW1ucyA9IF8ud2l0aG91dChjb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpXHJcblxyXG5cdFx0XHRvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQocmVsYXRlZF9vYmplY3RfbmFtZSlcclxuXHRcdFx0dGFidWxhcl9vcmRlciA9IENyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhcihvcmRlciwgY29sdW1ucylcclxuXHJcblx0XHRcdGlmIC9cXHcrXFwuXFwkXFwuXFx3Ky9nLnRlc3QocmVsYXRlZF9maWVsZF9uYW1lKVxyXG5cdFx0XHRcdCMgb2JqZWN057G75Z6L5bim5a2Q5bGe5oCn55qEcmVsYXRlZF9maWVsZF9uYW1l6KaB5Y675o6J5Lit6Ze055qE576O5YWD56ym5Y+377yM5ZCm5YiZ5pi+56S65LiN5Ye65a2X5q615YC8XHJcblx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9maWVsZF9uYW1lLnJlcGxhY2UoL1xcJFxcLi8sXCJcIilcclxuXHRcdFx0cmVsYXRlZCA9XHJcblx0XHRcdFx0b2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWVcclxuXHRcdFx0XHRjb2x1bW5zOiBjb2x1bW5zXHJcblx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lOiByZWxhdGVkX2ZpZWxkX25hbWVcclxuXHRcdFx0XHRpc19maWxlOiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcclxuXHRcdFx0XHRzaGFyaW5nOiBzaGFyaW5nXHJcblxyXG5cdFx0XHRsaXN0LnB1c2ggcmVsYXRlZFxyXG5cdFx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cclxuXHRcdGlmIF9vYmplY3RcclxuXHRcdFx0cmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0XHJcblx0XHRcdGlmICFfLmlzRW1wdHkgcmVsYXRlZExpc3RcclxuXHRcdFx0XHRfLmVhY2ggcmVsYXRlZExpc3QsIChvYmpPck5hbWUpLT5cclxuXHRcdFx0XHRcdGlmIF8uaXNPYmplY3Qgb2JqT3JOYW1lXHJcblx0XHRcdFx0XHRcdHJlbGF0ZWQgPVxyXG5cdFx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmpPck5hbWUub2JqZWN0TmFtZVxyXG5cdFx0XHRcdFx0XHRcdGNvbHVtbnM6IG9iak9yTmFtZS5jb2x1bW5zXHJcblx0XHRcdFx0XHRcdFx0aXNfZmlsZTogb2JqT3JOYW1lLm9iamVjdE5hbWUgPT0gXCJjbXNfZmlsZXNcIlxyXG5cdFx0XHRcdFx0XHRcdGZpbHRlcnNGdW5jdGlvbjogb2JqT3JOYW1lLmZpbHRlcnNcclxuXHRcdFx0XHRcdFx0XHRzb3J0OiBvYmpPck5hbWUuc29ydFxyXG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogJydcclxuXHRcdFx0XHRcdFx0bGlzdC5wdXNoIHJlbGF0ZWRcclxuXHJcblx0XHRyZXR1cm4gbGlzdFxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0cmV0dXJuIF8uZmlyc3QoQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpKVxyXG5cclxuIyMjIFxyXG5cdOWPluWHumxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvu+8jOWmguaenOS4jeWtmOWcqOaIluiAheayoeacieadg+mZkO+8jOWwsei/lOWbnuesrOS4gOS4quinhuWbvlxyXG5cdGV4YWPkuLp0cnVl5pe277yM6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5LiN6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+XHJcbiMjI1xyXG5DcmVhdG9yLmdldExpc3RWaWV3ID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGV4YWMpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFsaXN0X3ZpZXdfaWRcclxuXHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcclxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRpZiAhb2JqZWN0XHJcblx0XHRyZXR1cm5cclxuXHRsaXN0Vmlld3MgPSBDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSlcclxuXHR1bmxlc3MgbGlzdFZpZXdzPy5sZW5ndGhcclxuXHRcdHJldHVyblxyXG5cdGxpc3RfdmlldyA9IF8uZmluZFdoZXJlKGxpc3RWaWV3cyx7XCJfaWRcIjpsaXN0X3ZpZXdfaWR9KVxyXG5cdHVubGVzcyBsaXN0X3ZpZXdcclxuXHRcdCMg5aaC5p6c5LiN6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5YiZ6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+77yM5Y+N5LmL6L+U5Zue56m6XHJcblx0XHRpZiBleGFjXHJcblx0XHRcdHJldHVyblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRsaXN0X3ZpZXcgPSBsaXN0Vmlld3NbMF1cclxuXHRyZXR1cm4gbGlzdF92aWV3XHJcblxyXG4j6I635Y+WbGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+5piv5ZCm5piv5pyA6L+R5p+l55yL6KeG5Zu+XHJcbkNyZWF0b3IuZ2V0TGlzdFZpZXdJc1JlY2VudCA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0XHRpZiAhbGlzdF92aWV3X2lkXHJcblx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXHJcblx0aWYgdHlwZW9mKGxpc3Rfdmlld19pZCkgPT0gXCJzdHJpbmdcIlxyXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0XHRpZiAhb2JqZWN0XHJcblx0XHRcdHJldHVyblxyXG5cdFx0bGlzdFZpZXcgPSBfLmZpbmRXaGVyZShvYmplY3QubGlzdF92aWV3cyx7X2lkOiBsaXN0X3ZpZXdfaWR9KVxyXG5cdGVsc2VcclxuXHRcdGxpc3RWaWV3ID0gbGlzdF92aWV3X2lkXHJcblx0cmV0dXJuIGxpc3RWaWV3Py5uYW1lID09IFwicmVjZW50XCJcclxuXHJcblxyXG4jIyNcclxuICAgIOiOt+WPlum7mOiupOinhuWbvlxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyA9IChvYmplY3RfbmFtZSktPlxyXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGlmICFvYmplY3RcclxuXHRcdG9iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cclxuXHRpZiBvYmplY3Q/Lmxpc3Rfdmlld3M/LmRlZmF1bHRcclxuXHRcdCNUT0RPIOatpOS7o+eggeWPquaYr+aaguaXtuWFvOWuueS7peWJjWNvZGXkuK3lrprkuYnnmoRkZWZhdWx06KeG5Zu+77yM5b6FY29kZeS4reeahGRlZmF1bHTmuIXnkIblrozmiJDlkI7vvIzpnIDopoHliKDpmaTmraTku6PnoIFcclxuXHRcdGRlZmF1bHRWaWV3ID0gb2JqZWN0Lmxpc3Rfdmlld3MuZGVmYXVsdFxyXG5cdGVsc2VcclxuXHRcdF8uZWFjaCBvYmplY3Q/Lmxpc3Rfdmlld3MsIChsaXN0X3ZpZXcsIGtleSktPlxyXG5cdFx0XHRpZiBsaXN0X3ZpZXcubmFtZSA9PSBcImFsbFwiIHx8IGtleSA9PSBcImFsbFwiXHJcblx0XHRcdFx0ZGVmYXVsdFZpZXcgPSBsaXN0X3ZpZXdcclxuXHRyZXR1cm4gZGVmYXVsdFZpZXc7XHJcblxyXG4jIyNcclxuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOaYvuekuuWtl+autVxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IChvYmplY3RfbmFtZSktPlxyXG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcclxuXHRyZXR1cm4gZGVmYXVsdFZpZXc/LmNvbHVtbnNcclxuXHJcbiMjI1xyXG5cdOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOmineWkluWKoOi9veeahOWtl+autVxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zID0gKG9iamVjdF9uYW1lKS0+XHJcblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxyXG5cdHJldHVybiBkZWZhdWx0Vmlldz8uZXh0cmFfY29sdW1uc1xyXG5cclxuIyMjXHJcblx06I635Y+W5a+56LGh55qE6buY6K6k5o6S5bqPXHJcbiMjI1xyXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxyXG5cdGlmIGRlZmF1bHRWaWV3XHJcblx0XHRpZiBkZWZhdWx0Vmlldy5zb3J0XHJcblx0XHRcdHJldHVybiBkZWZhdWx0Vmlldy5zb3J0XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBbW1wiY3JlYXRlZFwiLCBcImRlc2NcIl1dXHJcblxyXG5cclxuIyMjXHJcbiAgICDliKTmlq3mmK/lkKZBbGwgdmlld1xyXG4jIyNcclxuQ3JlYXRvci5pc0FsbFZpZXcgPSAobGlzdF92aWV3KS0+XHJcblx0cmV0dXJuIGxpc3Rfdmlldz8ubmFtZSA9PSBcImFsbFwiXHJcblxyXG4jIyNcclxuICAgIOWIpOaWreaYr+WQpuacgOi/keafpeeciyB2aWV3XHJcbiMjI1xyXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IChsaXN0X3ZpZXcpLT5cclxuXHRyZXR1cm4gbGlzdF92aWV3Py5uYW1lID09IFwicmVjZW50XCJcclxuXHJcbiMjI1xyXG4gICAg5bCGc29ydOi9rOaNouS4ulRhYnVsYXLmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cclxuIyMjXHJcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhciA9IChzb3J0LCB0YWJ1bGFyQ29sdW1ucyktPlxyXG5cdHRhYnVsYXJfc29ydCA9IFtdXHJcblx0Xy5lYWNoIHNvcnQsIChpdGVtKS0+XHJcblx0XHRpZiBfLmlzQXJyYXkoaXRlbSlcclxuXHRcdFx0IyDlhbzlrrnml6fnmoTmlbDmja7moLzlvI9bW1wiZmllbGRfbmFtZVwiLCBcIm9yZGVyXCJdXVxyXG5cdFx0XHRpZiBpdGVtLmxlbmd0aCA9PSAxXHJcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxyXG5cdFx0XHRcdGlmIGNvbHVtbl9pbmRleCA+IC0xXHJcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBcImFzY1wiXVxyXG5cdFx0XHRlbHNlIGlmIGl0ZW0ubGVuZ3RoID09IDJcclxuXHRcdFx0XHRjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pXHJcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcclxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dXHJcblx0XHRlbHNlIGlmIF8uaXNPYmplY3QoaXRlbSlcclxuXHRcdFx0I+aWsOaVsOaNruagvOW8j++8mlt7ZmllbGRfbmFtZTogLCBvcmRlcjogfV1cclxuXHRcdFx0ZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZVxyXG5cdFx0XHRvcmRlciA9IGl0ZW0ub3JkZXJcclxuXHRcdFx0aWYgZmllbGRfbmFtZSAmJiBvcmRlclxyXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSlcclxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxyXG5cdFx0XHRcdFx0dGFidWxhcl9zb3J0LnB1c2ggW2NvbHVtbl9pbmRleCwgb3JkZXJdXHJcblxyXG5cdHJldHVybiB0YWJ1bGFyX3NvcnRcclxuXHJcbiMjI1xyXG4gICAg5bCGc29ydOi9rOaNouS4ukRldkV4cHJlc3Pmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cclxuIyMjXHJcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSAoc29ydCktPlxyXG5cdGR4X3NvcnQgPSBbXVxyXG5cdF8uZWFjaCBzb3J0LCAoaXRlbSktPlxyXG5cdFx0aWYgXy5pc0FycmF5KGl0ZW0pXHJcblx0XHRcdCPlhbzlrrnml6fmoLzlvI/vvJpbW1wiZmllbGRfbmFtZVwiLCBcIm9yZGVyXCJdXVxyXG5cdFx0XHRkeF9zb3J0LnB1c2goaXRlbSlcclxuXHRcdGVsc2UgaWYgXy5pc09iamVjdChpdGVtKVxyXG5cdFx0XHQj5paw5pWw5o2u5qC85byP77yaW3tmaWVsZF9uYW1lOiAsIG9yZGVyOiB9XVxyXG5cdFx0XHRmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lXHJcblx0XHRcdG9yZGVyID0gaXRlbS5vcmRlclxyXG5cdFx0XHRpZiBmaWVsZF9uYW1lICYmIG9yZGVyXHJcblx0XHRcdFx0ZHhfc29ydC5wdXNoIFtmaWVsZF9uYW1lLCBvcmRlcl1cclxuXHJcblx0cmV0dXJuIGR4X3NvcnRcclxuIiwiQ3JlYXRvci5nZXRJbml0V2lkdGhQZXJjZW50ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGNvbHVtbnMpIHtcbiAgdmFyIF9zY2hlbWEsIGNvbHVtbl9udW0sIGluaXRfd2lkdGhfcGVyY2VudCwgcmVmO1xuICBfc2NoZW1hID0gKHJlZiA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5fc2NoZW1hIDogdm9pZCAwO1xuICBjb2x1bW5fbnVtID0gMDtcbiAgaWYgKF9zY2hlbWEpIHtcbiAgICBfLmVhY2goY29sdW1ucywgZnVuY3Rpb24oZmllbGRfbmFtZSkge1xuICAgICAgdmFyIGZpZWxkLCBpc193aWRlLCByZWYxLCByZWYyO1xuICAgICAgZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSk7XG4gICAgICBpc193aWRlID0gKHJlZjEgPSBmaWVsZFtmaWVsZF9uYW1lXSkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjIuaXNfd2lkZSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChpc193aWRlKSB7XG4gICAgICAgIHJldHVybiBjb2x1bW5fbnVtICs9IDI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY29sdW1uX251bSArPSAxO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGluaXRfd2lkdGhfcGVyY2VudCA9IDEwMCAvIGNvbHVtbl9udW07XG4gICAgcmV0dXJuIGluaXRfd2lkdGhfcGVyY2VudDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRGaWVsZElzV2lkZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lKSB7XG4gIHZhciBfc2NoZW1hLCBmaWVsZCwgaXNfd2lkZSwgcmVmLCByZWYxO1xuICBfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpLl9zY2hlbWE7XG4gIGlmIChfc2NoZW1hKSB7XG4gICAgZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSk7XG4gICAgaXNfd2lkZSA9IChyZWYgPSBmaWVsZFtmaWVsZF9uYW1lXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMS5pc193aWRlIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIHJldHVybiBpc193aWRlO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFRhYnVsYXJPcmRlciA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbnMpIHtcbiAgdmFyIG9iaiwgcmVmLCByZWYxLCByZWYyLCBzZXR0aW5nLCBzb3J0O1xuICBzZXR0aW5nID0gKHJlZiA9IENyZWF0b3IuQ29sbGVjdGlvbnMpICE9IG51bGwgPyAocmVmMSA9IHJlZi5zZXR0aW5ncykgIT0gbnVsbCA/IHJlZjEuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgfSkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IF8ubWFwKGNvbHVtbnMsIGZ1bmN0aW9uKGNvbHVtbikge1xuICAgIHZhciBmaWVsZDtcbiAgICBmaWVsZCA9IG9iai5maWVsZHNbY29sdW1uXTtcbiAgICBpZiAoKGZpZWxkICE9IG51bGwgPyBmaWVsZC50eXBlIDogdm9pZCAwKSAmJiAhZmllbGQuaGlkZGVuKSB7XG4gICAgICByZXR1cm4gY29sdW1uO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgfSk7XG4gIGNvbHVtbnMgPSBfLmNvbXBhY3QoY29sdW1ucyk7XG4gIGlmIChzZXR0aW5nICYmIHNldHRpbmcuc2V0dGluZ3MpIHtcbiAgICBzb3J0ID0gKChyZWYyID0gc2V0dGluZy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdKSAhPSBudWxsID8gcmVmMi5zb3J0IDogdm9pZCAwKSB8fCBbXTtcbiAgICBzb3J0ID0gXy5tYXAoc29ydCwgZnVuY3Rpb24ob3JkZXIpIHtcbiAgICAgIHZhciBpbmRleCwga2V5O1xuICAgICAga2V5ID0gb3JkZXJbMF07XG4gICAgICBpbmRleCA9IF8uaW5kZXhPZihjb2x1bW5zLCBrZXkpO1xuICAgICAgb3JkZXJbMF0gPSBpbmRleCArIDE7XG4gICAgICByZXR1cm4gb3JkZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNvcnQ7XG4gIH1cbiAgcmV0dXJuIFtdO1xufTtcblxuQ3JlYXRvci5pbml0TGlzdFZpZXdzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGNvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1ucywgZXh0cmFfY29sdW1ucywgb2JqZWN0LCBvcmRlciwgcmVmO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdO1xuICBleHRyYV9jb2x1bW5zID0gW1wib3duZXJcIl07XG4gIGRlZmF1bHRfZXh0cmFfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wib3duZXJcIl07XG4gIGlmIChkZWZhdWx0X2V4dHJhX2NvbHVtbnMpIHtcbiAgICBleHRyYV9jb2x1bW5zID0gXy51bmlvbihleHRyYV9jb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnMpO1xuICB9XG4gIG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChvYmplY3RfbmFtZSkgfHwgW107XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gKHJlZiA9IENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzKSAhPSBudWxsID8gcmVmW29iamVjdF9uYW1lXSA9IFtdIDogdm9pZCAwO1xuICB9XG59O1xuXG5DcmVhdG9yLmNvbnZlcnRMaXN0VmlldyA9IGZ1bmN0aW9uKGRlZmF1bHRfY29sdW1lbnMsIGxpc3RfdmlldywgbGlzdF92aWV3X25hbWUpIHtcbiAgdmFyIG9pdGVtO1xuICBvaXRlbSA9IF8uY2xvbmUobGlzdF92aWV3KTtcbiAgaWYgKCFfLmhhcyhvaXRlbSwgXCJuYW1lXCIpKSB7XG4gICAgb2l0ZW0ubmFtZSA9IGxpc3Rfdmlld19uYW1lO1xuICB9XG4gIGlmICghb2l0ZW0uY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0X2NvbHVtZW5zKSB7XG4gICAgICBvaXRlbS5jb2x1bW5zID0gZGVmYXVsdF9jb2x1bWVucztcbiAgICB9XG4gIH1cbiAgaWYgKCFvaXRlbS5jb2x1bW5zKSB7XG4gICAgb2l0ZW0uY29sdW1ucyA9IFtcIm5hbWVcIl07XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkgJiYgIV8uaW5jbHVkZShvaXRlbS5jb2x1bW5zLCAnc3BhY2UnKSkge1xuICAgICAgb2l0ZW0uY29sdW1ucy5wdXNoKCdzcGFjZScpO1xuICAgIH1cbiAgfVxuICBpZiAoIW9pdGVtLmZpbHRlcl9zY29wZSkge1xuICAgIG9pdGVtLmZpbHRlcl9zY29wZSA9IFwic3BhY2VcIjtcbiAgfVxuICBpZiAoIV8uaGFzKG9pdGVtLCBcIl9pZFwiKSkge1xuICAgIG9pdGVtLl9pZCA9IGxpc3Rfdmlld19uYW1lO1xuICB9IGVsc2Uge1xuICAgIG9pdGVtLmxhYmVsID0gb2l0ZW0ubGFiZWwgfHwgbGlzdF92aWV3Lm5hbWU7XG4gIH1cbiAgaWYgKF8uaXNTdHJpbmcob2l0ZW0ub3B0aW9ucykpIHtcbiAgICBvaXRlbS5vcHRpb25zID0gSlNPTi5wYXJzZShvaXRlbS5vcHRpb25zKTtcbiAgfVxuICBfLmZvckVhY2gob2l0ZW0uZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyLCBfaW5kZXgpIHtcbiAgICBpZiAoIV8uaXNBcnJheShmaWx0ZXIpICYmIF8uaXNPYmplY3QoZmlsdGVyKSkge1xuICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChfLmlzU3RyaW5nKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLl92YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXIuX3ZhbHVlICsgXCIpXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9pdGVtO1xufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBDcmVhdG9yLmdldFJlbGF0ZWRMaXN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgX29iamVjdCwgbGlzdCwgcmVsYXRlZExpc3QsIHJlbGF0ZWRfb2JqZWN0cztcbiAgICBsaXN0ID0gW107XG4gICAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSk7XG4gICAgXy5lYWNoKHJlbGF0ZWRfb2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3RfaXRlbSkge1xuICAgICAgdmFyIGNvbHVtbnMsIG9yZGVyLCByZWxhdGVkLCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lLCBzaGFyaW5nLCB0YWJ1bGFyX29yZGVyO1xuICAgICAgcmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ub2JqZWN0X25hbWU7XG4gICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLmZvcmVpZ25fa2V5O1xuICAgICAgc2hhcmluZyA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uc2hhcmluZztcbiAgICAgIHJlbGF0ZWRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICBpZiAoIXJlbGF0ZWRfb2JqZWN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl07XG4gICAgICBjb2x1bW5zID0gXy53aXRob3V0KGNvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSk7XG4gICAgICBvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICB0YWJ1bGFyX29yZGVyID0gQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyKG9yZGVyLCBjb2x1bW5zKTtcbiAgICAgIGlmICgvXFx3K1xcLlxcJFxcLlxcdysvZy50ZXN0KHJlbGF0ZWRfZmllbGRfbmFtZSkpIHtcbiAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9maWVsZF9uYW1lLnJlcGxhY2UoL1xcJFxcLi8sIFwiXCIpO1xuICAgICAgfVxuICAgICAgcmVsYXRlZCA9IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXG4gICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICBpc19maWxlOiByZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiLFxuICAgICAgICBzaGFyaW5nOiBzaGFyaW5nXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGxpc3QucHVzaChyZWxhdGVkKTtcbiAgICB9KTtcbiAgICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgICBpZiAoX29iamVjdCkge1xuICAgICAgcmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0O1xuICAgICAgaWYgKCFfLmlzRW1wdHkocmVsYXRlZExpc3QpKSB7XG4gICAgICAgIF8uZWFjaChyZWxhdGVkTGlzdCwgZnVuY3Rpb24ob2JqT3JOYW1lKSB7XG4gICAgICAgICAgdmFyIHJlbGF0ZWQ7XG4gICAgICAgICAgaWYgKF8uaXNPYmplY3Qob2JqT3JOYW1lKSkge1xuICAgICAgICAgICAgcmVsYXRlZCA9IHtcbiAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iak9yTmFtZS5vYmplY3ROYW1lLFxuICAgICAgICAgICAgICBjb2x1bW5zOiBvYmpPck5hbWUuY29sdW1ucyxcbiAgICAgICAgICAgICAgaXNfZmlsZTogb2JqT3JOYW1lLm9iamVjdE5hbWUgPT09IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgICAgICAgIGZpbHRlcnNGdW5jdGlvbjogb2JqT3JOYW1lLmZpbHRlcnMsXG4gICAgICAgICAgICAgIHNvcnQ6IG9iak9yTmFtZS5zb3J0LFxuICAgICAgICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6ICcnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGxpc3QucHVzaChyZWxhdGVkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGlzdDtcbiAgfTtcbn1cblxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgcmV0dXJuIF8uZmlyc3QoQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpKTtcbn07XG5cblxuLyogXG5cdOWPluWHumxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvu+8jOWmguaenOS4jeWtmOWcqOaIluiAheayoeacieadg+mZkO+8jOWwsei/lOWbnuesrOS4gOS4quinhuWbvlxuXHRleGFj5Li6dHJ1ZeaXtu+8jOmcgOimgeW8uuWItuaMiWxpc3Rfdmlld19pZOeyvuehruafpeaJvu+8jOS4jem7mOiupOi/lOWbnuesrOS4gOS4quinhuWbvlxuICovXG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBleGFjKSB7XG4gIHZhciBsaXN0Vmlld3MsIGxpc3Rfdmlldywgb2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgfVxuICB9XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGlzdFZpZXdzID0gQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpO1xuICBpZiAoIShsaXN0Vmlld3MgIT0gbnVsbCA/IGxpc3RWaWV3cy5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxpc3RfdmlldyA9IF8uZmluZFdoZXJlKGxpc3RWaWV3cywge1xuICAgIFwiX2lkXCI6IGxpc3Rfdmlld19pZFxuICB9KTtcbiAgaWYgKCFsaXN0X3ZpZXcpIHtcbiAgICBpZiAoZXhhYykge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0X3ZpZXcgPSBsaXN0Vmlld3NbMF07XG4gICAgfVxuICB9XG4gIHJldHVybiBsaXN0X3ZpZXc7XG59O1xuXG5DcmVhdG9yLmdldExpc3RWaWV3SXNSZWNlbnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkKSB7XG4gIHZhciBsaXN0Vmlldywgb2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2YgbGlzdF92aWV3X2lkID09PSBcInN0cmluZ1wiKSB7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmICghb2JqZWN0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxpc3RWaWV3ID0gXy5maW5kV2hlcmUob2JqZWN0Lmxpc3Rfdmlld3MsIHtcbiAgICAgIF9pZDogbGlzdF92aWV3X2lkXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbGlzdFZpZXcgPSBsaXN0X3ZpZXdfaWQ7XG4gIH1cbiAgcmV0dXJuIChsaXN0VmlldyAhPSBudWxsID8gbGlzdFZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwicmVjZW50XCI7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W6buY6K6k6KeG5Zu+XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0Vmlldywgb2JqZWN0LCByZWY7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICBvYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICB9XG4gIGlmIChvYmplY3QgIT0gbnVsbCA/IChyZWYgPSBvYmplY3QubGlzdF92aWV3cykgIT0gbnVsbCA/IHJlZltcImRlZmF1bHRcIl0gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICBkZWZhdWx0VmlldyA9IG9iamVjdC5saXN0X3ZpZXdzW1wiZGVmYXVsdFwiXTtcbiAgfSBlbHNlIHtcbiAgICBfLmVhY2gob2JqZWN0ICE9IG51bGwgPyBvYmplY3QubGlzdF92aWV3cyA6IHZvaWQgMCwgZnVuY3Rpb24obGlzdF92aWV3LCBrZXkpIHtcbiAgICAgIGlmIChsaXN0X3ZpZXcubmFtZSA9PT0gXCJhbGxcIiB8fCBrZXkgPT09IFwiYWxsXCIpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWaWV3ID0gbGlzdF92aWV3O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBkZWZhdWx0Vmlldztcbn07XG5cblxuLypcbiAgICDojrflj5blr7nosaHnmoTliJfooajpu5jorqTmmL7npLrlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICByZXR1cm4gZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3LmNvbHVtbnMgOiB2b2lkIDA7XG59O1xuXG5cbi8qXG5cdOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOmineWkluWKoOi9veeahOWtl+autVxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgcmV0dXJuIGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5leHRyYV9jb2x1bW5zIDogdm9pZCAwO1xufTtcblxuXG4vKlxuXHTojrflj5blr7nosaHnmoTpu5jorqTmjpLluo9cbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICBpZiAoZGVmYXVsdFZpZXcpIHtcbiAgICBpZiAoZGVmYXVsdFZpZXcuc29ydCkge1xuICAgICAgcmV0dXJuIGRlZmF1bHRWaWV3LnNvcnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbW1wiY3JlYXRlZFwiLCBcImRlc2NcIl1dO1xuICAgIH1cbiAgfVxufTtcblxuXG4vKlxuICAgIOWIpOaWreaYr+WQpkFsbCB2aWV3XG4gKi9cblxuQ3JlYXRvci5pc0FsbFZpZXcgPSBmdW5jdGlvbihsaXN0X3ZpZXcpIHtcbiAgcmV0dXJuIChsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJhbGxcIjtcbn07XG5cblxuLypcbiAgICDliKTmlq3mmK/lkKbmnIDov5Hmn6XnnIsgdmlld1xuICovXG5cbkNyZWF0b3IuaXNSZWNlbnRWaWV3ID0gZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gIHJldHVybiAobGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwicmVjZW50XCI7XG59O1xuXG5cbi8qXG4gICAg5bCGc29ydOi9rOaNouS4ulRhYnVsYXLmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cbiAqL1xuXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIgPSBmdW5jdGlvbihzb3J0LCB0YWJ1bGFyQ29sdW1ucykge1xuICB2YXIgdGFidWxhcl9zb3J0O1xuICB0YWJ1bGFyX3NvcnQgPSBbXTtcbiAgXy5lYWNoKHNvcnQsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgY29sdW1uX2luZGV4LCBmaWVsZF9uYW1lLCBvcmRlcjtcbiAgICBpZiAoXy5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICBpZiAoaXRlbS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIFwiYXNjXCJdKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpdGVtLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pO1xuICAgICAgICBpZiAoY29sdW1uX2luZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGFidWxhcl9zb3J0LnB1c2goW2NvbHVtbl9pbmRleCwgaXRlbVsxXV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lO1xuICAgICAgb3JkZXIgPSBpdGVtLm9yZGVyO1xuICAgICAgaWYgKGZpZWxkX25hbWUgJiYgb3JkZXIpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihmaWVsZF9uYW1lKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIG9yZGVyXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGFidWxhcl9zb3J0O1xufTtcblxuXG4vKlxuICAgIOWwhnNvcnTovazmjaLkuLpEZXZFeHByZXNz5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4gKi9cblxuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9EWCA9IGZ1bmN0aW9uKHNvcnQpIHtcbiAgdmFyIGR4X3NvcnQ7XG4gIGR4X3NvcnQgPSBbXTtcbiAgXy5lYWNoKHNvcnQsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgZmllbGRfbmFtZSwgb3JkZXI7XG4gICAgaWYgKF8uaXNBcnJheShpdGVtKSkge1xuICAgICAgcmV0dXJuIGR4X3NvcnQucHVzaChpdGVtKTtcbiAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWU7XG4gICAgICBvcmRlciA9IGl0ZW0ub3JkZXI7XG4gICAgICBpZiAoZmllbGRfbmFtZSAmJiBvcmRlcikge1xuICAgICAgICByZXR1cm4gZHhfc29ydC5wdXNoKFtmaWVsZF9uYW1lLCBvcmRlcl0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkeF9zb3J0O1xufTtcbiIsIlNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVthLXpBLVowLTlfXSokJylcclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG5cdE1ldGVvci5zdGFydHVwICgpLT5cclxuXHRcdF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXVxyXG5cdFx0X3JlZ0V4TWVzc2FnZXMucHVzaCB7ZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZSwgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jOS4lOWPquiDveWMheWQq+Wtl+avjeOAgeaVsOWtl+OAgV9cIn1cclxuXHRcdFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XHJcblx0XHRcdHJlZ0V4OiBfcmVnRXhNZXNzYWdlcyxcclxuXHRcdH0pIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dW2EtekEtWjAtOV9dKiQnKTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgX3JlZ0V4TWVzc2FnZXM7XG4gICAgX3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdO1xuICAgIF9yZWdFeE1lc3NhZ2VzLnB1c2goe1xuICAgICAgZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZSxcbiAgICAgIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIzkuJTlj6rog73ljIXlkKvlrZfmr43jgIHmlbDlrZfjgIFfXCJcbiAgICB9KTtcbiAgICByZXR1cm4gU2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcbiAgICAgIHJlZ0V4OiBfcmVnRXhNZXNzYWdlc1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIlNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11cXFxcdyooXFxcXC5cXFxcJFxcXFwuXFxcXHcrKT9bYS16QS1aMC05XSokJylcclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG5cdE1ldGVvci5zdGFydHVwICgpLT5cclxuXHRcdF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXVxyXG5cdFx0X3JlZ0V4TWVzc2FnZXMucHVzaCB7ZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQsIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIwuJC7liY3lkI7lv4XpobvljIXlkKvlrZfnrKZcIn1cclxuXHRcdFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XHJcblx0XHRcdHJlZ0V4OiBfcmVnRXhNZXNzYWdlcyxcclxuXHRcdH0pIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVxcXFx3KihcXFxcLlxcXFwkXFxcXC5cXFxcdyspP1thLXpBLVowLTldKiQnKTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgX3JlZ0V4TWVzc2FnZXM7XG4gICAgX3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdO1xuICAgIF9yZWdFeE1lc3NhZ2VzLnB1c2goe1xuICAgICAgZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQsXG4gICAgICBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yMLiQu5YmN5ZCO5b+F6aG75YyF5ZCr5a2X56ymXCJcbiAgICB9KTtcbiAgICByZXR1cm4gU2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcbiAgICAgIHJlZ0V4OiBfcmVnRXhNZXNzYWdlc1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIi8vIOWboOS4um1ldGVvcue8luivkWNvZmZlZXNjcmlwdOS8muWvvOiHtGV2YWzlh73mlbDmiqXplJnvvIzmiYDku6XljZXni6zlhpnlnKjkuIDkuKpqc+aWh+S7tuS4reOAglxyXG5DcmVhdG9yLmV2YWxJbkNvbnRleHQgPSBmdW5jdGlvbihqcywgY29udGV4dCkge1xyXG4gICAgLy8jIFJldHVybiB0aGUgcmVzdWx0cyBvZiB0aGUgaW4tbGluZSBhbm9ueW1vdXMgZnVuY3Rpb24gd2UgLmNhbGwgd2l0aCB0aGUgcGFzc2VkIGNvbnRleHRcclxuICAgIHJldHVybiBmdW5jdGlvbigpIHsgXHJcbiAgICBcdHJldHVybiBldmFsKGpzKTsgXHJcblx0fS5jYWxsKGNvbnRleHQpO1xyXG59XHJcblxyXG5cclxuQ3JlYXRvci5ldmFsID0gZnVuY3Rpb24oanMpe1xyXG5cdHRyeXtcclxuXHRcdHJldHVybiBldmFsKGpzKVxyXG5cdH1jYXRjaCAoZSl7XHJcblx0XHRjb25zb2xlLmVycm9yKGUsIGpzKTtcclxuXHR9XHJcbn07IiwiXHRnZXRPcHRpb24gPSAob3B0aW9uKS0+XHJcblx0XHRmb28gPSBvcHRpb24uc3BsaXQoXCI6XCIpXHJcblx0XHRpZiBmb28ubGVuZ3RoID4gMVxyXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMV19XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1swXX1cclxuXHJcblx0Y29udmVydEZpZWxkID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZCwgc3BhY2VJZCktPlxyXG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyICYmIHNwYWNlSWQgJiYgZmllbGQudHlwZSA9PSAnc2VsZWN0J1xyXG5cdFx0XHRjb2RlID0gZmllbGQucGlja2xpc3QgfHwgXCIje29iamVjdF9uYW1lfS4je2ZpZWxkX25hbWV9XCI7XHJcblx0XHRcdGlmIGNvZGVcclxuXHRcdFx0XHRwaWNrbGlzdCA9IENyZWF0b3IuZ2V0UGlja2xpc3QoY29kZSwgc3BhY2VJZCk7XHJcblx0XHRcdFx0aWYgcGlja2xpc3RcclxuXHRcdFx0XHRcdG9wdGlvbnMgPSBbXTtcclxuXHRcdFx0XHRcdGFsbE9wdGlvbnMgPSBbXTtcclxuXHRcdFx0XHRcdHBpY2tsaXN0T3B0aW9ucyA9IENyZWF0b3IuZ2V0UGlja0xpc3RPcHRpb25zKHBpY2tsaXN0KVxyXG5cdFx0XHRcdFx0cGlja2xpc3RPcHRpb25zID0gXy5zb3J0QnkocGlja2xpc3RPcHRpb25zLCAnc29ydF9ubycpPy5yZXZlcnNlKCk7XHJcblx0XHRcdFx0XHRfLmVhY2ggcGlja2xpc3RPcHRpb25zLCAoaXRlbSktPlxyXG5cdFx0XHRcdFx0XHRsYWJlbCA9IGl0ZW0ubmFtZVxyXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGl0ZW0udmFsdWUgfHwgaXRlbS5uYW1lXHJcblx0XHRcdFx0XHRcdGFsbE9wdGlvbnMucHVzaCh7bGFiZWw6IGxhYmVsLCB2YWx1ZTogdmFsdWUsIGVuYWJsZTogaXRlbS5lbmFibGV9KVxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmVuYWJsZVxyXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMucHVzaCh7bGFiZWw6IGxhYmVsLCB2YWx1ZTogdmFsdWV9KVxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmRlZmF1bHRcclxuXHRcdFx0XHRcdFx0XHRmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZVxyXG5cdFx0XHRcdFx0aWYgb3B0aW9ucy5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBvcHRpb25zXHJcblx0XHRcdFx0XHRpZiBhbGxPcHRpb25zLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdFx0ZmllbGQuYWxsT3B0aW9ucyA9IGFsbE9wdGlvbnNcclxuXHRcdHJldHVybiBmaWVsZDtcclxuXHJcblx0Q3JlYXRvci5jb252ZXJ0T2JqZWN0ID0gKG9iamVjdCwgc3BhY2VJZCktPlxyXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC50cmlnZ2VycywgKHRyaWdnZXIsIGtleSktPlxyXG5cclxuXHRcdFx0aWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09IFwic2VydmVyXCIpIHx8IChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiKVxyXG5cdFx0XHRcdF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXI/Ll90b2RvXHJcblx0XHRcdFx0X3RvZG9fZnJvbV9kYiA9IHRyaWdnZXIudG9kb1xyXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSlcclxuXHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXHJcblxyXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKVxyXG5cdFx0XHRcdFx0I+WPquaciXVwZGF0ZeaXtu+8jCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyDmiY3mnInlgLxcclxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj++8jOWwpOWFtuaYr0NvbGxlY3Rpb25cclxuXHRcdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXHJcblx0XHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fZGJ9KVwiKVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKXsje190b2RvX2Zyb21fZGJ9fSlcIilcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCJcclxuXHRcdFx0XHRfdG9kbyA9IHRyaWdnZXIudG9kb1xyXG5cdFx0XHRcdGlmIF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbylcclxuXHRcdFx0XHRcdHRyaWdnZXIuX3RvZG8gPSBfdG9kby50b1N0cmluZygpXHJcblxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XHJcblx0XHRcdFx0X3RvZG9fZnJvbV9jb2RlID0gYWN0aW9uPy5fdG9kb1xyXG5cdFx0XHRcdF90b2RvX2Zyb21fZGIgPSBhY3Rpb24/LnRvZG9cclxuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpXHJcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwidG9kb19mcm9tX2NvZGVcIiwgX3RvZG9fZnJvbV9jb2RlXHJcblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpXHJcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKVxyXG5cdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9kYn0pXCIpXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oQ3JlYXRvci5hY3Rpb25zQnlOYW1lW190b2RvX2Zyb21fZGJdKVxyXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBfdG9kb19mcm9tX2RiXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoZnVuY3Rpb24oKXsje190b2RvX2Zyb21fZGJ9fSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0b2RvX2Zyb21fZGJcIiwgX3RvZG9fZnJvbV9kYiwgZXJyb3JcclxuXHJcblx0XHRcdFx0X3Zpc2libGUgPSBhY3Rpb24/Ll92aXNpYmxlXHJcblx0XHRcdFx0aWYgX3Zpc2libGVcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRhY3Rpb24udmlzaWJsZSA9IENyZWF0b3IuZXZhbChcIigje192aXNpYmxlfSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJhY3Rpb24udmlzaWJsZSB0byBmdW5jdGlvbiBlcnJvcjogXCIsIGVycm9yLCBfdmlzaWJsZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LmFjdGlvbnMsIChhY3Rpb24sIGtleSktPlxyXG5cdFx0XHRcdF90b2RvID0gYWN0aW9uPy50b2RvXHJcblx0XHRcdFx0aWYgX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKVxyXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXHJcblx0XHRcdFx0XHRhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpXHJcblxyXG5cdFx0XHRcdF92aXNpYmxlID0gYWN0aW9uPy52aXNpYmxlXHJcblxyXG5cdFx0XHRcdGlmIF92aXNpYmxlICYmIF8uaXNGdW5jdGlvbihfdmlzaWJsZSlcclxuXHRcdFx0XHRcdGFjdGlvbi5fdmlzaWJsZSA9IF92aXNpYmxlLnRvU3RyaW5nKClcclxuXHJcblx0XHRfLmZvckVhY2ggb2JqZWN0LmZpZWxkcywgKGZpZWxkLCBrZXkpLT5cclxuXHJcblx0XHRcdGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcclxuXHJcblx0XHRcdGlmIGZpZWxkLm9wdGlvbnMgJiYgXy5pc1N0cmluZyhmaWVsZC5vcHRpb25zKVxyXG5cdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0X29wdGlvbnMgPSBbXVxyXG5cdFx0XHRcdFx0I+aUr+aMgVxcbuaIluiAheiLseaWh+mAl+WPt+WIhuWJsixcclxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCAob3B0aW9uKS0+XHJcblx0XHRcdFx0XHRcdGlmIG9wdGlvbi5pbmRleE9mKFwiLFwiKVxyXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMgPSBvcHRpb24uc3BsaXQoXCIsXCIpXHJcblx0XHRcdFx0XHRcdFx0Xy5mb3JFYWNoIG9wdGlvbnMsIChfb3B0aW9uKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihfb3B0aW9uKSlcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXHJcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcclxuXHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcclxuXHJcblx0XHRcdGVsc2UgaWYgZmllbGQub3B0aW9ucyAmJiAhXy5pc0Z1bmN0aW9uKGZpZWxkLm9wdGlvbnMpICYmICFfLmlzQXJyYXkoZmllbGQub3B0aW9ucykgJiYgXy5pc09iamVjdChmaWVsZC5vcHRpb25zKVxyXG5cdFx0XHRcdF9vcHRpb25zID0gW11cclxuXHRcdFx0XHRfLmVhY2ggZmllbGQub3B0aW9ucywgKHYsIGspLT5cclxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiB2LCB2YWx1ZToga31cclxuXHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdG9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXHJcblx0XHRcdFx0aWYgb3B0aW9ucyAmJiBfLmlzRnVuY3Rpb24ob3B0aW9ucylcclxuXHRcdFx0XHRcdGZpZWxkLl9vcHRpb25zID0gZmllbGQub3B0aW9ucy50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRvcHRpb25zID0gZmllbGQuX29wdGlvbnNcclxuXHRcdFx0XHRpZiBvcHRpb25zICYmIF8uaXNTdHJpbmcob3B0aW9ucylcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gQ3JlYXRvci5ldmFsKFwiKCN7b3B0aW9uc30pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLnJlZ0V4XHJcblx0XHRcdFx0aWYgcmVnRXhcclxuXHRcdFx0XHRcdGZpZWxkLl9yZWdFeCA9IGZpZWxkLnJlZ0V4LnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJlZ0V4ID0gZmllbGQuX3JlZ0V4XHJcblx0XHRcdFx0aWYgcmVnRXhcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRmaWVsZC5yZWdFeCA9IENyZWF0b3IuZXZhbChcIigje3JlZ0V4fSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdG1pbiA9IGZpZWxkLm1pblxyXG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihtaW4pXHJcblx0XHRcdFx0XHRmaWVsZC5fbWluID0gbWluLnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdG1pbiA9IGZpZWxkLl9taW5cclxuXHRcdFx0XHRpZiBfLmlzU3RyaW5nKG1pbilcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRmaWVsZC5taW4gPSBDcmVhdG9yLmV2YWwoXCIoI3ttaW59KVwiKVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxyXG5cclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0bWF4ID0gZmllbGQubWF4XHJcblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKG1heClcclxuXHRcdFx0XHRcdGZpZWxkLl9tYXggPSBtYXgudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0bWF4ID0gZmllbGQuX21heFxyXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcobWF4KVxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLm1heCA9IENyZWF0b3IuZXZhbChcIigje21heH0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRpZiBmaWVsZC5hdXRvZm9ybVxyXG5cdFx0XHRcdFx0X3R5cGUgPSBmaWVsZC5hdXRvZm9ybS50eXBlXHJcblx0XHRcdFx0XHRpZiBfdHlwZSAmJiBfLmlzRnVuY3Rpb24oX3R5cGUpICYmIF90eXBlICE9IE9iamVjdCAmJiBfdHlwZSAhPSBTdHJpbmcgJiYgX3R5cGUgIT0gTnVtYmVyICYmIF90eXBlICE9IEJvb2xlYW4gJiYgIV8uaXNBcnJheShfdHlwZSlcclxuXHRcdFx0XHRcdFx0ZmllbGQuYXV0b2Zvcm0uX3R5cGUgPSBfdHlwZS50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiBmaWVsZC5hdXRvZm9ybVxyXG5cdFx0XHRcdFx0X3R5cGUgPSBmaWVsZC5hdXRvZm9ybS5fdHlwZVxyXG5cdFx0XHRcdFx0aWYgX3R5cGUgJiYgXy5pc1N0cmluZyhfdHlwZSlcclxuXHRcdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdFx0ZmllbGQuYXV0b2Zvcm0udHlwZSA9IENyZWF0b3IuZXZhbChcIigje190eXBlfSlcIilcclxuXHRcdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBmaWVsZCAtPiB0eXBlIGVycm9yXCIsIGZpZWxkLCBlcnJvclxyXG5cclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblxyXG5cdFx0XHRcdG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxyXG5cdFx0XHRcdHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xyXG5cdFx0XHRcdGNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb25cclxuXHRcdFx0XHRiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cclxuXHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5maWx0ZXJzRnVuY3Rpb25cclxuXHJcblx0XHRcdFx0aWYgb3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihvcHRpb25zRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uID0gb3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKClcclxuXHJcblx0XHRcdFx0aWYgcmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRmaWVsZC5fcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvLnRvU3RyaW5nKClcclxuXHJcblx0XHRcdFx0aWYgY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGNyZWF0ZUZ1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuX2NyZWF0ZUZ1bmN0aW9uID0gY3JlYXRlRnVuY3Rpb24udG9TdHJpbmcoKVxyXG5cdFx0XHRcdGlmIGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oYmVmb3JlT3BlbkZ1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvbiA9IGJlZm9yZU9wZW5GdW5jdGlvbi50b1N0cmluZygpXHJcblxyXG5cdFx0XHRcdGlmIGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmlsdGVyc0Z1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHJcblx0XHRcdFx0b3B0aW9uc0Z1bmN0aW9uID0gZmllbGQuX29wdGlvbnNGdW5jdGlvbiB8fCBmaWVsZC5vcHRpb25zRnVuY3Rpb25cclxuXHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBmaWVsZC5fcmVmZXJlbmNlX3RvXHJcblx0XHRcdFx0Y3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5fY3JlYXRlRnVuY3Rpb25cclxuXHRcdFx0XHRiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uXHJcblx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuX2ZpbHRlcnNGdW5jdGlvblxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhvcHRpb25zRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tvcHRpb25zRnVuY3Rpb259KVwiKVxyXG5cclxuXHRcdFx0XHRpZiByZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRmaWVsZC5yZWZlcmVuY2VfdG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tyZWZlcmVuY2VfdG99KVwiKVxyXG5cclxuXHRcdFx0XHRpZiBjcmVhdGVGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGNyZWF0ZUZ1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tjcmVhdGVGdW5jdGlvbn0pXCIpXHJcblxyXG5cdFx0XHRcdGlmIGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGJlZm9yZU9wZW5GdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2JlZm9yZU9wZW5GdW5jdGlvbn0pXCIpXHJcblxyXG5cdFx0XHRcdGlmIGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGZpbHRlcnNGdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlcnNGdW5jdGlvbn0pXCIpXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcclxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSlcclxuXHRcdFx0XHRcdGZpZWxkLl9kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWUudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZGVmYXVsdFZhbHVlID0gZmllbGQuX2RlZmF1bHRWYWx1ZVxyXG5cclxuXHRcdFx0XHRpZiAhZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZmllbGQuZGVmYXVsdFZhbHVlKSAmJiBmaWVsZC5kZWZhdWx0VmFsdWUuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXHJcblx0XHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcclxuXHJcblx0XHRcdFx0aWYgZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZGVmYXVsdFZhbHVlKVxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLmRlZmF1bHRWYWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2RlZmF1bHRWYWx1ZX0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXHJcblx0XHRcdFxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRpZiBpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc0Z1bmN0aW9uKGlzX2NvbXBhbnlfbGltaXRlZClcclxuXHRcdFx0XHRcdGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdGlmIGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzU3RyaW5nKGlzX2NvbXBhbnlfbGltaXRlZClcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPSBDcmVhdG9yLmV2YWwoXCIoI3tpc19jb21wYW55X2xpbWl0ZWR9KVwiKVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxyXG5cclxuXHRcdF8uZm9yRWFjaCBvYmplY3QubGlzdF92aWV3cywgKGxpc3Rfdmlldywga2V5KSAtPlxyXG5cdFx0XHQjIyNcclxuXHRcdFx06KeG5Zu+6L+H6JmR5Zmo6ZyA6KaB5pSv5oyBZnVuY3Rpb27vvIzlkI7lj7DovazmiJDlrZfnrKbkuLLvvIzliY3lj7BldmFs5oiQ5Ye95pWwXHJcblx0XHRcdOiuqei/h+iZkeWZqOaUr+aMgeS4pOenjWZ1bmN0aW9u5pa55byP77yaXHJcblx0XHRcdDEuIOaVtOS4qmZpbHRlcnPkuLpmdW5jdGlvbjpcclxuXHRcdFx05aaC77yaXHJcblx0XHRcdGZpbHRlcnM6ICgpLT5cclxuXHRcdFx0XHRyZXR1cm4gW1tbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwicHJvamVjdF9pc3N1ZXNcIl0sJ29yJyxbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwidGFza3NcIl1dXVxyXG5cdFx0XHQyLiBmaWx0ZXJz5YaF55qEZmlsdGVyLnZhbHVl5Li6ZnVuY3Rpb25cclxuXHRcdFx05aaC77yaXHJcblx0XHRcdGZpbHRlcnM6IFtbXCJvYmplY3RfbmFtZVwiLCBcIj1cIiwgKCktPlxyXG5cdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcclxuXHRcdFx0XV1cclxuXHRcdFx05oiWXHJcblx0XHRcdGZpbHRlcnM6IFt7XHJcblx0XHRcdFx0XCJmaWVsZFwiOiBcIm9iamVjdF9uYW1lXCJcclxuXHRcdFx0XHRcIm9wZXJhdGlvblwiOiBcIj1cIlxyXG5cdFx0XHRcdFwidmFsdWVcIjogKCktPlxyXG5cdFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxyXG5cdFx0XHR9XVxyXG5cdFx0XHQjIyNcclxuXHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGxpc3Rfdmlldy5maWx0ZXJzKVxyXG5cdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdFx0bGlzdF92aWV3Ll9maWx0ZXJzID0gbGlzdF92aWV3LmZpbHRlcnMudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlIGlmIF8uaXNTdHJpbmcobGlzdF92aWV3Ll9maWx0ZXJzKVxyXG5cdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdFx0bGlzdF92aWV3LmZpbHRlcnMgPSBDcmVhdG9yLmV2YWwoXCIoI3tsaXN0X3ZpZXcuX2ZpbHRlcnN9KVwiKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Xy5mb3JFYWNoIGxpc3Rfdmlldy5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cclxuXHRcdFx0XHRcdGlmIF8uaXNBcnJheShmaWx0ZXIpXHJcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0Z1bmN0aW9uKGZpbHRlclsyXSlcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IGZpbHRlclsyXS50b1N0cmluZygpXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkZVTkNUSU9OXCJcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0RhdGUoZmlsdGVyWzJdKVxyXG5cdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpzmmK9EYXRl57G75Z6L77yM5YiZZmlsdGVyWzJd5YC85Yiw5YmN56uv5Lya6Ieq5Yqo6L2s5oiQ5a2X56ym5Liy77yM5qC85byP77yaXCIyMDE4LTAzLTI5VDAzOjQzOjIxLjc4N1pcIlxyXG5cdFx0XHRcdFx0XHRcdFx0IyDljIXmi6xncmlk5YiX6KGo6K+35rGC55qE5o6l5Y+j5Zyo5YaF55qE5omA5pyJT0RhdGHmjqXlj6PvvIxEYXRl57G75Z6L5a2X5q616YO95Lya5Lul5LiK6L+w5qC85byP6L+U5ZueXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkRBVEVcIlxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0aWYgZmlsdGVyLmxlbmd0aCA9PSA0IGFuZCBfLmlzU3RyaW5nKGZpbHRlclsyXSkgYW5kIGZpbHRlclszXSA9PSBcIkZVTkNUSU9OXCJcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlclsyXX0pXCIpXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIucG9wKClcclxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDQgYW5kIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSBhbmQgZmlsdGVyWzNdID09IFwiREFURVwiXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBuZXcgRGF0ZShmaWx0ZXJbMl0pXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIucG9wKClcclxuXHRcdFx0XHRcdGVsc2UgaWYgXy5pc09iamVjdChmaWx0ZXIpXHJcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihmaWx0ZXI/LnZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRGF0ZShmaWx0ZXI/LnZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLl9pc19kYXRlID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWx0ZXI/Ll92YWx1ZSlcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlci5fdmFsdWV9KVwiKVxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgZmlsdGVyLl9pc19kYXRlID09IHRydWVcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSlcclxuXHJcblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0aWYgb2JqZWN0LmZvcm0gJiYgIV8uaXNTdHJpbmcob2JqZWN0LmZvcm0pXHJcblx0XHRcdFx0b2JqZWN0LmZvcm0gPSBKU09OLnN0cmluZ2lmeSBvYmplY3QuZm9ybSwgKGtleSwgdmFsKS0+XHJcblx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24odmFsKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsICsgJyc7XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHJldHVybiB2YWw7XHJcblx0XHRlbHNlIGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRpZiBvYmplY3QuZm9ybVxyXG5cdFx0XHRcdG9iamVjdC5mb3JtID0gSlNPTi5wYXJzZSBvYmplY3QuZm9ybSwgKGtleSwgdmFsKS0+XHJcblx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKHZhbCkgJiYgdmFsLnN0YXJ0c1dpdGgoJ2Z1bmN0aW9uJylcclxuXHRcdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZXZhbChcIigje3ZhbH0pXCIpXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHJldHVybiB2YWw7XHJcblxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZExpc3QsIChyZWxhdGVkT2JqSW5mbyktPlxyXG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXHJcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxyXG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKVxyXG5cdFx0XHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IENyZWF0b3IuZXZhbChcIigje3ZhbH0pXCIpXHJcblx0XHRcdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaWx0ZXJzX2NvZGVcIiwgdmFsXHJcblx0XHRlbHNlXHJcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZExpc3QsIChyZWxhdGVkT2JqSW5mbyktPlxyXG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXHJcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxyXG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpXHJcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpXHJcblxyXG5cdFx0cmV0dXJuIG9iamVjdFxyXG5cclxuXHJcbiIsInZhciBjb252ZXJ0RmllbGQsIGdldE9wdGlvbjtcblxuZ2V0T3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gIHZhciBmb287XG4gIGZvbyA9IG9wdGlvbi5zcGxpdChcIjpcIik7XG4gIGlmIChmb28ubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1sxXVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzBdXG4gICAgfTtcbiAgfVxufTtcblxuY29udmVydEZpZWxkID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkLCBzcGFjZUlkKSB7XG4gIHZhciBhbGxPcHRpb25zLCBjb2RlLCBvcHRpb25zLCBwaWNrbGlzdCwgcGlja2xpc3RPcHRpb25zLCByZWY7XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgc3BhY2VJZCAmJiBmaWVsZC50eXBlID09PSAnc2VsZWN0Jykge1xuICAgIGNvZGUgPSBmaWVsZC5waWNrbGlzdCB8fCAob2JqZWN0X25hbWUgKyBcIi5cIiArIGZpZWxkX25hbWUpO1xuICAgIGlmIChjb2RlKSB7XG4gICAgICBwaWNrbGlzdCA9IENyZWF0b3IuZ2V0UGlja2xpc3QoY29kZSwgc3BhY2VJZCk7XG4gICAgICBpZiAocGlja2xpc3QpIHtcbiAgICAgICAgb3B0aW9ucyA9IFtdO1xuICAgICAgICBhbGxPcHRpb25zID0gW107XG4gICAgICAgIHBpY2tsaXN0T3B0aW9ucyA9IENyZWF0b3IuZ2V0UGlja0xpc3RPcHRpb25zKHBpY2tsaXN0KTtcbiAgICAgICAgcGlja2xpc3RPcHRpb25zID0gKHJlZiA9IF8uc29ydEJ5KHBpY2tsaXN0T3B0aW9ucywgJ3NvcnRfbm8nKSkgIT0gbnVsbCA/IHJlZi5yZXZlcnNlKCkgOiB2b2lkIDA7XG4gICAgICAgIF8uZWFjaChwaWNrbGlzdE9wdGlvbnMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICB2YXIgbGFiZWwsIHZhbHVlO1xuICAgICAgICAgIGxhYmVsID0gaXRlbS5uYW1lO1xuICAgICAgICAgIHZhbHVlID0gaXRlbS52YWx1ZSB8fCBpdGVtLm5hbWU7XG4gICAgICAgICAgYWxsT3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGVuYWJsZTogaXRlbS5lbmFibGVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaXRlbS5lbmFibGUpIHtcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW1bXCJkZWZhdWx0XCJdKSB7XG4gICAgICAgICAgICByZXR1cm4gZmllbGQuZGVmYXVsdFZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG9wdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZpZWxkLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbGxPcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmaWVsZC5hbGxPcHRpb25zID0gYWxsT3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmllbGQ7XG59O1xuXG5DcmVhdG9yLmNvbnZlcnRPYmplY3QgPSBmdW5jdGlvbihvYmplY3QsIHNwYWNlSWQpIHtcbiAgXy5mb3JFYWNoKG9iamVjdC50cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlciwga2V5KSB7XG4gICAgdmFyIF90b2RvLCBfdG9kb19mcm9tX2NvZGUsIF90b2RvX2Zyb21fZGI7XG4gICAgaWYgKChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJzZXJ2ZXJcIikgfHwgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiKSkge1xuICAgICAgX3RvZG9fZnJvbV9jb2RlID0gdHJpZ2dlciAhPSBudWxsID8gdHJpZ2dlci5fdG9kbyA6IHZvaWQgMDtcbiAgICAgIF90b2RvX2Zyb21fZGIgPSB0cmlnZ2VyLnRvZG87XG4gICAgICBpZiAoX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKSkge1xuICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fY29kZSArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYikpIHtcbiAgICAgICAgaWYgKF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2RiICsgXCIpXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKGZ1bmN0aW9uKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyl7XCIgKyBfdG9kb19mcm9tX2RiICsgXCJ9KVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIpIHtcbiAgICAgIF90b2RvID0gdHJpZ2dlci50b2RvO1xuICAgICAgaWYgKF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbykpIHtcbiAgICAgICAgcmV0dXJuIHRyaWdnZXIuX3RvZG8gPSBfdG9kby50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LmFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbiwga2V5KSB7XG4gICAgICB2YXIgX3RvZG9fZnJvbV9jb2RlLCBfdG9kb19mcm9tX2RiLCBfdmlzaWJsZSwgZXJyb3I7XG4gICAgICBfdG9kb19mcm9tX2NvZGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi5fdG9kbyA6IHZvaWQgMDtcbiAgICAgIF90b2RvX2Zyb21fZGIgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwO1xuICAgICAgaWYgKF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9jb2RlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwidG9kb19mcm9tX2NvZGVcIiwgX3RvZG9fZnJvbV9jb2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fZGIgKyBcIilcIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oQ3JlYXRvci5hY3Rpb25zQnlOYW1lW190b2RvX2Zyb21fZGJdKSkge1xuICAgICAgICAgICAgICBhY3Rpb24udG9kbyA9IF90b2RvX2Zyb21fZGI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKGZ1bmN0aW9uKCl7XCIgKyBfdG9kb19mcm9tX2RiICsgXCJ9KVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0b2RvX2Zyb21fZGJcIiwgX3RvZG9fZnJvbV9kYiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBfdmlzaWJsZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLl92aXNpYmxlIDogdm9pZCAwO1xuICAgICAgaWYgKF92aXNpYmxlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGFjdGlvbi52aXNpYmxlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdmlzaWJsZSArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJhY3Rpb24udmlzaWJsZSB0byBmdW5jdGlvbiBlcnJvcjogXCIsIGVycm9yLCBfdmlzaWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LmFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbiwga2V5KSB7XG4gICAgICB2YXIgX3RvZG8sIF92aXNpYmxlO1xuICAgICAgX3RvZG8gPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwO1xuICAgICAgaWYgKF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbykpIHtcbiAgICAgICAgYWN0aW9uLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIF92aXNpYmxlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udmlzaWJsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChfdmlzaWJsZSAmJiBfLmlzRnVuY3Rpb24oX3Zpc2libGUpKSB7XG4gICAgICAgIHJldHVybiBhY3Rpb24uX3Zpc2libGUgPSBfdmlzaWJsZS50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIF8uZm9yRWFjaChvYmplY3QuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwga2V5KSB7XG4gICAgdmFyIF9vcHRpb25zLCBfdHlwZSwgYmVmb3JlT3BlbkZ1bmN0aW9uLCBjcmVhdGVGdW5jdGlvbiwgZGVmYXVsdFZhbHVlLCBlcnJvciwgZmlsdGVyc0Z1bmN0aW9uLCBpc19jb21wYW55X2xpbWl0ZWQsIG1heCwgbWluLCBvcHRpb25zLCBvcHRpb25zRnVuY3Rpb24sIHJlZmVyZW5jZV90bywgcmVnRXg7XG4gICAgZmllbGQgPSBjb252ZXJ0RmllbGQob2JqZWN0Lm5hbWUsIGtleSwgZmllbGQsIHNwYWNlSWQpO1xuICAgIGlmIChmaWVsZC5vcHRpb25zICYmIF8uaXNTdHJpbmcoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICB2YXIgb3B0aW9ucztcbiAgICAgICAgICBpZiAob3B0aW9uLmluZGV4T2YoXCIsXCIpKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gb3B0aW9uLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgIHJldHVybiBfLmZvckVhY2gob3B0aW9ucywgZnVuY3Rpb24oX29wdGlvbikge1xuICAgICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24oX29wdGlvbikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLm9wdGlvbnMgJiYgIV8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zKSAmJiAhXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpICYmIF8uaXNPYmplY3QoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIF9vcHRpb25zID0gW107XG4gICAgICBfLmVhY2goZmllbGQub3B0aW9ucywgZnVuY3Rpb24odiwgaykge1xuICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgbGFiZWw6IHYsXG4gICAgICAgICAgdmFsdWU6IGtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzRnVuY3Rpb24ob3B0aW9ucykpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5fb3B0aW9ucztcbiAgICAgIGlmIChvcHRpb25zICYmIF8uaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBvcHRpb25zICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmVnRXggPSBmaWVsZC5yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICBmaWVsZC5fcmVnRXggPSBmaWVsZC5yZWdFeC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWdFeCA9IGZpZWxkLl9yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLnJlZ0V4ID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWdFeCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG1pbiA9IGZpZWxkLm1pbjtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24obWluKSkge1xuICAgICAgICBmaWVsZC5fbWluID0gbWluLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1pbiA9IGZpZWxkLl9taW47XG4gICAgICBpZiAoXy5pc1N0cmluZyhtaW4pKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQubWluID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBtaW4gKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBtYXggPSBmaWVsZC5tYXg7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG1heCkpIHtcbiAgICAgICAgZmllbGQuX21heCA9IG1heC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtYXggPSBmaWVsZC5fbWF4O1xuICAgICAgaWYgKF8uaXNTdHJpbmcobWF4KSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLm1heCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbWF4ICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0udHlwZTtcbiAgICAgICAgaWYgKF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT09IE9iamVjdCAmJiBfdHlwZSAhPT0gU3RyaW5nICYmIF90eXBlICE9PSBOdW1iZXIgJiYgX3R5cGUgIT09IEJvb2xlYW4gJiYgIV8uaXNBcnJheShfdHlwZSkpIHtcbiAgICAgICAgICBmaWVsZC5hdXRvZm9ybS5fdHlwZSA9IF90eXBlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0uX3R5cGU7XG4gICAgICAgIGlmIChfdHlwZSAmJiBfLmlzU3RyaW5nKF90eXBlKSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmaWVsZC5hdXRvZm9ybS50eXBlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdHlwZSArIFwiKVwiKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZmllbGQgLT4gdHlwZSBlcnJvclwiLCBmaWVsZCwgZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uO1xuICAgICAgYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgaWYgKG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24ob3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uID0gb3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAocmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIGZpZWxkLl9yZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChjcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9jcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb24gPSBiZWZvcmVPcGVuRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpbHRlcnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uIHx8IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgIHJlZmVyZW5jZV90byA9IGZpZWxkLl9yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvbjtcbiAgICAgIGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICBmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgaWYgKG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKG9wdGlvbnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQub3B0aW9uc0Z1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBvcHRpb25zRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAocmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICBmaWVsZC5yZWZlcmVuY2VfdG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHJlZmVyZW5jZV90byArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChjcmVhdGVGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5jcmVhdGVGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgY3JlYXRlRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoYmVmb3JlT3BlbkZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGJlZm9yZU9wZW5GdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhmaWx0ZXJzRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyc0Z1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICBpZiAoZGVmYXVsdFZhbHVlICYmIF8uaXNGdW5jdGlvbihkZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIGZpZWxkLl9kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWUudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuX2RlZmF1bHRWYWx1ZTtcbiAgICAgIGlmICghZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZmllbGQuZGVmYXVsdFZhbHVlKSAmJiBmaWVsZC5kZWZhdWx0VmFsdWUuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhkZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQuZGVmYXVsdFZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBkZWZhdWx0VmFsdWUgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICBpZiAoaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNGdW5jdGlvbihpc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgIHJldHVybiBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICBpZiAoaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNTdHJpbmcoaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGlzX2NvbXBhbnlfbGltaXRlZCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIF8uZm9yRWFjaChvYmplY3QubGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3LCBrZXkpIHtcblxuICAgIC8qXG4gICAgXHRcdFx06KeG5Zu+6L+H6JmR5Zmo6ZyA6KaB5pSv5oyBZnVuY3Rpb27vvIzlkI7lj7DovazmiJDlrZfnrKbkuLLvvIzliY3lj7BldmFs5oiQ5Ye95pWwXG4gICAgXHRcdFx06K6p6L+H6JmR5Zmo5pSv5oyB5Lik56eNZnVuY3Rpb27mlrnlvI/vvJpcbiAgICBcdFx0XHQxLiDmlbTkuKpmaWx0ZXJz5Li6ZnVuY3Rpb246XG4gICAgXHRcdFx05aaC77yaXG4gICAgXHRcdFx0ZmlsdGVyczogKCktPlxuICAgIFx0XHRcdFx0cmV0dXJuIFtbW1wib2JqZWN0X25hbWVcIixcIj1cIixcInByb2plY3RfaXNzdWVzXCJdLCdvcicsW1wib2JqZWN0X25hbWVcIixcIj1cIixcInRhc2tzXCJdXV1cbiAgICBcdFx0XHQyLiBmaWx0ZXJz5YaF55qEZmlsdGVyLnZhbHVl5Li6ZnVuY3Rpb25cbiAgICBcdFx0XHTlpoLvvJpcbiAgICBcdFx0XHRmaWx0ZXJzOiBbW1wib2JqZWN0X25hbWVcIiwgXCI9XCIsICgpLT5cbiAgICBcdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcbiAgICBcdFx0XHRdXVxuICAgIFx0XHRcdOaIllxuICAgIFx0XHRcdGZpbHRlcnM6IFt7XG4gICAgXHRcdFx0XHRcImZpZWxkXCI6IFwib2JqZWN0X25hbWVcIlxuICAgIFx0XHRcdFx0XCJvcGVyYXRpb25cIjogXCI9XCJcbiAgICBcdFx0XHRcdFwidmFsdWVcIjogKCktPlxuICAgIFx0XHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG4gICAgXHRcdFx0fV1cbiAgICAgKi9cbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGxpc3Rfdmlldy5maWx0ZXJzKSkge1xuICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICByZXR1cm4gbGlzdF92aWV3Ll9maWx0ZXJzID0gbGlzdF92aWV3LmZpbHRlcnMudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKF8uaXNTdHJpbmcobGlzdF92aWV3Ll9maWx0ZXJzKSkge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICByZXR1cm4gbGlzdF92aWV3LmZpbHRlcnMgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGxpc3Rfdmlldy5fZmlsdGVycyArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIF8uZm9yRWFjaChsaXN0X3ZpZXcuZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyLCBfaW5kZXgpIHtcbiAgICAgICAgaWYgKF8uaXNBcnJheShmaWx0ZXIpKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgaWYgKGZpbHRlci5sZW5ndGggPT09IDMgJiYgXy5pc0Z1bmN0aW9uKGZpbHRlclsyXSkpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gZmlsdGVyWzJdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXJbM10gPSBcIkZVTkNUSU9OXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbHRlci5sZW5ndGggPT09IDMgJiYgXy5pc0RhdGUoZmlsdGVyWzJdKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyWzNdID0gXCJEQVRFXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSA0ICYmIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSAmJiBmaWx0ZXJbM10gPT09IFwiRlVOQ1RJT05cIikge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlclsyXSArIFwiKVwiKTtcbiAgICAgICAgICAgICAgZmlsdGVyLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZpbHRlci5sZW5ndGggPT09IDQgJiYgXy5pc1N0cmluZyhmaWx0ZXJbMl0pICYmIGZpbHRlclszXSA9PT0gXCJEQVRFXCIpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gbmV3IERhdGUoZmlsdGVyWzJdKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChmaWx0ZXIpKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci52YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0RhdGUoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIuX2lzX2RhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoXy5pc1N0cmluZyhmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci5fdmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlci5fdmFsdWUgKyBcIilcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbHRlci5faXNfZGF0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gbmV3IERhdGUoZmlsdGVyLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAob2JqZWN0LmZvcm0gJiYgIV8uaXNTdHJpbmcob2JqZWN0LmZvcm0pKSB7XG4gICAgICBvYmplY3QuZm9ybSA9IEpTT04uc3RyaW5naWZ5KG9iamVjdC5mb3JtLCBmdW5jdGlvbihrZXksIHZhbCkge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgICAgICByZXR1cm4gdmFsICsgJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChvYmplY3QuZm9ybSkge1xuICAgICAgb2JqZWN0LmZvcm0gPSBKU09OLnBhcnNlKG9iamVjdC5mb3JtLCBmdW5jdGlvbihrZXksIHZhbCkge1xuICAgICAgICBpZiAoXy5pc1N0cmluZyh2YWwpICYmIHZhbC5zdGFydHNXaXRoKCdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgcmV0dXJuIENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgdmFsICsgXCIpXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5yZWxhdGVkTGlzdCwgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgdmFsICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImZpbHRlcnNfY29kZVwiLCB2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5yZWxhdGVkTGlzdCwgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIGlmIChrZXkgPT09ICdmaWx0ZXJzJyAmJiBfLmlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSB2YWwudG9TdHJpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwiQ3JlYXRvci5Gb3JtdWxhciA9IHt9XHJcblxyXG5DcmVhdG9yLkZvcm11bGFyLlBSRUZJWCA9IFwiX1ZBTFVFU1wiXHJcblxyXG5DcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYSA9IChwcmVmaXgsZmllbGRWYXJpYWJsZSktPlxyXG5cdHJlZyA9IC8oXFx7W157fV0qXFx9KS9nO1xyXG5cclxuXHRyZXYgPSBmaWVsZFZhcmlhYmxlLnJlcGxhY2UgcmVnLCAobSwgJDEpLT5cclxuXHRcdHJldHVybiBwcmVmaXggKyAkMS5yZXBsYWNlKC9cXHtcXHMqLyxcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLFwiXFxcIl1cIikucmVwbGFjZSgvXFxzKlxcLlxccyovZyxcIlxcXCJdW1xcXCJcIik7XHJcblxyXG5cdHJldHVybiByZXZcclxuXHJcbkNyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhID0gKGZvcm11bGFfc3RyKS0+XHJcblx0aWYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cikgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIntcIikgPiAtMSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwifVwiKSA+IC0xXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdHJldHVybiBmYWxzZVxyXG5cclxuQ3JlYXRvci5Gb3JtdWxhci5ydW4gPSAoZm9ybXVsYV9zdHIsIF9DT05URVhULCBvcHRpb25zKS0+XHJcblx0aWYgZm9ybXVsYV9zdHIgJiYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cilcclxuXHJcblx0XHRpZiAhXy5pc0Jvb2xlYW4ob3B0aW9ucz8uZXh0ZW5kKVxyXG5cdFx0XHRleHRlbmQgPSB0cnVlXHJcblxyXG5cdFx0X1ZBTFVFUyA9IHt9XHJcblx0XHRfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgX0NPTlRFWFQpXHJcblx0XHRpZiBleHRlbmRcclxuXHRcdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucz8udXNlcklkLCBvcHRpb25zPy5zcGFjZUlkKSlcclxuXHRcdGZvcm11bGFfc3RyID0gQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEoXCJ0aGlzXCIsIGZvcm11bGFfc3RyKVxyXG5cclxuXHRcdHRyeVxyXG5cdFx0XHRkYXRhID0gQ3JlYXRvci5ldmFsSW5Db250ZXh0KGZvcm11bGFfc3RyLCBfVkFMVUVTKSAgICMg5q2k5aSE5LiN6IO955Sod2luZG93LmV2YWwg77yM5Lya5a+86Ie05Y+Y6YeP5L2c55So5Z+f5byC5bi4XHJcblx0XHRcdHJldHVybiBkYXRhXHJcblx0XHRjYXRjaCBlXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogI3tmb3JtdWxhX3N0cn1cIiwgZSlcclxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0dG9hc3RyPy5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKVxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogI3tmb3JtdWxhX3N0cn0je2V9XCJcclxuXHJcblx0cmV0dXJuIGZvcm11bGFfc3RyXHJcbiIsIkNyZWF0b3IuRm9ybXVsYXIgPSB7fTtcblxuQ3JlYXRvci5Gb3JtdWxhci5QUkVGSVggPSBcIl9WQUxVRVNcIjtcblxuQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEgPSBmdW5jdGlvbihwcmVmaXgsIGZpZWxkVmFyaWFibGUpIHtcbiAgdmFyIHJlZywgcmV2O1xuICByZWcgPSAvKFxce1tee31dKlxcfSkvZztcbiAgcmV2ID0gZmllbGRWYXJpYWJsZS5yZXBsYWNlKHJlZywgZnVuY3Rpb24obSwgJDEpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgJDEucmVwbGFjZSgvXFx7XFxzKi8sIFwiW1xcXCJcIikucmVwbGFjZSgvXFxzKlxcfS8sIFwiXFxcIl1cIikucmVwbGFjZSgvXFxzKlxcLlxccyovZywgXCJcXFwiXVtcXFwiXCIpO1xuICB9KTtcbiAgcmV0dXJuIHJldjtcbn07XG5cbkNyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhID0gZnVuY3Rpb24oZm9ybXVsYV9zdHIpIHtcbiAgaWYgKF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ7XCIpID4gLTEgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIn1cIikgPiAtMSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkNyZWF0b3IuRm9ybXVsYXIucnVuID0gZnVuY3Rpb24oZm9ybXVsYV9zdHIsIF9DT05URVhULCBvcHRpb25zKSB7XG4gIHZhciBfVkFMVUVTLCBkYXRhLCBlLCBleHRlbmQ7XG4gIGlmIChmb3JtdWxhX3N0ciAmJiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSkge1xuICAgIGlmICghXy5pc0Jvb2xlYW4ob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5leHRlbmQgOiB2b2lkIDApKSB7XG4gICAgICBleHRlbmQgPSB0cnVlO1xuICAgIH1cbiAgICBfVkFMVUVTID0ge307XG4gICAgX1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIF9DT05URVhUKTtcbiAgICBpZiAoZXh0ZW5kKSB7XG4gICAgICBfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgQ3JlYXRvci5nZXRVc2VyQ29udGV4dChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnVzZXJJZCA6IHZvaWQgMCwgb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zcGFjZUlkIDogdm9pZCAwKSk7XG4gICAgfVxuICAgIGZvcm11bGFfc3RyID0gQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEoXCJ0aGlzXCIsIGZvcm11bGFfc3RyKTtcbiAgICB0cnkge1xuICAgICAgZGF0YSA9IENyZWF0b3IuZXZhbEluQ29udGV4dChmb3JtdWxhX3N0ciwgX1ZBTFVFUyk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgY29uc29sZS5lcnJvcihcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiBcIiArIGZvcm11bGFfc3RyLCBlKTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0b2FzdHIgIT09IFwidW5kZWZpbmVkXCIgJiYgdG9hc3RyICE9PSBudWxsKSB7XG4gICAgICAgICAgdG9hc3RyLmVycm9yKFwi5YWs5byP5omn6KGM5Ye66ZSZ5LqG77yM6K+35qOA5p+l5YWs5byP6YWN572u5piv5ZCm5q2j56Gu77yBXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogXCIgKyBmb3JtdWxhX3N0ciArIGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZm9ybXVsYV9zdHI7XG59O1xuIiwiY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xyXG5DcmVhdG9yLm9iamVjdHNCeU5hbWUgPSB7fSAgICMg5q2k5a+56LGh5Y+q6IO95Zyo56Gu5L+d5omA5pyJT2JqZWN05Yid5aeL5YyW5a6M5oiQ5ZCO6LCD55So77yMIOWQpuWImeiOt+WPluWIsOeahG9iamVjdOS4jeWFqFxyXG5cclxuQ3JlYXRvci5mb3JtYXRPYmplY3ROYW1lID0gKG9iamVjdF9uYW1lKS0+XHJcblx0aWYgb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY2ZzLmZpbGVzLicpXHJcblx0XHRvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpXHJcblx0cmV0dXJuIG9iamVjdF9uYW1lXHJcblxyXG5DcmVhdG9yLk9iamVjdCA9IChvcHRpb25zKS0+XHJcblx0c2VsZiA9IHRoaXNcclxuXHRpZiAoIW9wdGlvbnMubmFtZSlcclxuXHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucylcclxuXHRcdHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xyXG5cclxuXHRzZWxmLl9pZCA9IG9wdGlvbnMuX2lkIHx8IG9wdGlvbnMubmFtZVxyXG5cdHNlbGYuc3BhY2UgPSBvcHRpb25zLnNwYWNlXHJcblx0c2VsZi5uYW1lID0gb3B0aW9ucy5uYW1lXHJcblx0c2VsZi5sYWJlbCA9IG9wdGlvbnMubGFiZWxcclxuXHRzZWxmLmljb24gPSBvcHRpb25zLmljb25cclxuXHRzZWxmLmRlc2NyaXB0aW9uID0gb3B0aW9ucy5kZXNjcmlwdGlvblxyXG5cdHNlbGYuaXNfdmlldyA9IG9wdGlvbnMuaXNfdmlld1xyXG5cdHNlbGYuZm9ybSA9IG9wdGlvbnMuZm9ybVxyXG5cdGlmICFfLmlzQm9vbGVhbihvcHRpb25zLmlzX2VuYWJsZSkgIHx8IG9wdGlvbnMuaXNfZW5hYmxlID09IHRydWVcclxuXHRcdHNlbGYuaXNfZW5hYmxlID0gdHJ1ZVxyXG5cdGVsc2VcclxuXHRcdHNlbGYuaXNfZW5hYmxlID0gZmFsc2VcclxuXHRzZWxmLmVuYWJsZV9zZWFyY2ggPSBvcHRpb25zLmVuYWJsZV9zZWFyY2hcclxuXHRzZWxmLmVuYWJsZV9maWxlcyA9IG9wdGlvbnMuZW5hYmxlX2ZpbGVzXHJcblx0c2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrc1xyXG5cdHNlbGYuZW5hYmxlX25vdGVzID0gb3B0aW9ucy5lbmFibGVfbm90ZXNcclxuXHRzZWxmLmVuYWJsZV9hdWRpdCA9IG9wdGlvbnMuZW5hYmxlX2F1ZGl0XHJcblx0c2VsZi5oaWRkZW4gPSBvcHRpb25zLmhpZGRlblxyXG5cdHNlbGYuZW5hYmxlX2FwaSA9IChvcHRpb25zLmVuYWJsZV9hcGkgPT0gdW5kZWZpbmVkKSBvciBvcHRpb25zLmVuYWJsZV9hcGlcclxuXHRzZWxmLmN1c3RvbSA9IG9wdGlvbnMuY3VzdG9tXHJcblx0c2VsZi5lbmFibGVfc2hhcmUgPSBvcHRpb25zLmVuYWJsZV9zaGFyZVxyXG5cdHNlbGYuZW5hYmxlX2luc3RhbmNlcyA9IG9wdGlvbnMuZW5hYmxlX2luc3RhbmNlc1xyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpXHJcblx0XHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBmYWxzZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZVxyXG5cdFx0XHRzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcilcclxuXHRlbHNlXHJcblx0XHRzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcilcclxuXHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlXHJcblx0c2VsZi5vcGVuX3dpbmRvdyA9IG9wdGlvbnMub3Blbl93aW5kb3dcclxuXHRzZWxmLmZpbHRlcl9jb21wYW55ID0gb3B0aW9ucy5maWx0ZXJfY29tcGFueVxyXG5cdHNlbGYuY2FsZW5kYXIgPSBfLmNsb25lKG9wdGlvbnMuY2FsZW5kYXIpXHJcblx0c2VsZi5lbmFibGVfY2hhdHRlciA9IG9wdGlvbnMuZW5hYmxlX2NoYXR0ZXJcclxuXHRzZWxmLmVuYWJsZV90cmFzaCA9IG9wdGlvbnMuZW5hYmxlX3RyYXNoXHJcblx0c2VsZi5lbmFibGVfc3BhY2VfZ2xvYmFsID0gb3B0aW9ucy5lbmFibGVfc3BhY2VfZ2xvYmFsXHJcblx0c2VsZi5lbmFibGVfYXBwcm92YWxzID0gb3B0aW9ucy5lbmFibGVfYXBwcm92YWxzXHJcblx0c2VsZi5lbmFibGVfZm9sbG93ID0gb3B0aW9ucy5lbmFibGVfZm9sbG93XHJcblx0c2VsZi5lbmFibGVfd29ya2Zsb3cgPSBvcHRpb25zLmVuYWJsZV93b3JrZmxvd1xyXG5cdGlmIF8uaGFzKG9wdGlvbnMsICdpbl9kZXZlbG9wbWVudCcpXHJcblx0XHRzZWxmLmluX2RldmVsb3BtZW50ID0gb3B0aW9ucy5pbl9kZXZlbG9wbWVudFxyXG5cdHNlbGYuaWRGaWVsZE5hbWUgPSAnX2lkJ1xyXG5cdGlmIG9wdGlvbnMuZGF0YWJhc2VfbmFtZVxyXG5cdFx0c2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lXHJcblx0aWYgKCFvcHRpb25zLmZpZWxkcylcclxuXHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucylcclxuXHRcdHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xyXG5cclxuXHRzZWxmLmZpZWxkcyA9IGNsb25lKG9wdGlvbnMuZmllbGRzKVxyXG5cclxuXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG5cdFx0aWYgZmllbGRfbmFtZSA9PSAnbmFtZScgfHwgZmllbGQuaXNfbmFtZVxyXG5cdFx0XHRzZWxmLk5BTUVfRklFTERfS0VZID0gZmllbGRfbmFtZVxyXG5cdFx0aWYgZmllbGQucHJpbWFyeVxyXG5cdFx0XHRzZWxmLmlkRmllbGROYW1lID0gZmllbGRfbmFtZVxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdGlmIENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKVxyXG5cdFx0XHRcdGlmIGZpZWxkX25hbWUgPT0gJ3NwYWNlJ1xyXG5cdFx0XHRcdFx0ZmllbGQuZmlsdGVyYWJsZSA9IHRydWVcclxuXHRcdFx0XHRcdGZpZWxkLmhpZGRlbiA9IGZhbHNlXHJcblxyXG5cdGlmICFvcHRpb25zLmRhdGFiYXNlX25hbWUgfHwgb3B0aW9ucy5kYXRhYmFzZV9uYW1lID09ICdtZXRlb3ItbW9uZ28nXHJcblx0XHRfLmVhY2ggQ3JlYXRvci5iYXNlT2JqZWN0LmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblx0XHRcdGlmICFzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXVxyXG5cdFx0XHRcdHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0ge31cclxuXHRcdFx0c2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKGZpZWxkKSwgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pXHJcblxyXG5cdHNlbGYubGlzdF92aWV3cyA9IHt9XHJcblx0ZGVmYXVsdENvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKHNlbGYubmFtZSlcclxuXHRfLmVhY2ggb3B0aW9ucy5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0XHRvaXRlbSA9IENyZWF0b3IuY29udmVydExpc3RWaWV3KGRlZmF1bHRDb2x1bW5zLCBpdGVtLCBpdGVtX25hbWUpXHJcblx0XHRzZWxmLmxpc3Rfdmlld3NbaXRlbV9uYW1lXSA9IG9pdGVtXHJcblxyXG5cdHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKENyZWF0b3IuYmFzZU9iamVjdC50cmlnZ2VycylcclxuXHRfLmVhY2ggb3B0aW9ucy50cmlnZ2VycywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxyXG5cdFx0aWYgIXNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXVxyXG5cdFx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSB7fVxyXG5cdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdLm5hbWUgPSBpdGVtX25hbWVcclxuXHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSlcclxuXHJcblx0c2VsZi5hY3Rpb25zID0gXy5jbG9uZShDcmVhdG9yLmJhc2VPYmplY3QuYWN0aW9ucylcclxuXHRfLmVhY2ggb3B0aW9ucy5hY3Rpb25zLCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0XHRpZiAhc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV1cclxuXHRcdFx0c2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSB7fVxyXG5cdFx0Y29weUl0ZW0gPSBfLmNsb25lKHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKVxyXG5cdFx0ZGVsZXRlIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdICPlhYjliKDpmaTnm7jlhbPlsZ7mgKflho3ph43lu7rmiY3og73kv53or4HlkI7nu63ph43lpI3lrprkuYnnmoTlsZ7mgKfpobrluo/nlJ/mlYhcclxuXHRcdHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0gXy5leHRlbmQoY29weUl0ZW0sIGl0ZW0pXHJcblxyXG5cdF8uZWFjaCBzZWxmLmFjdGlvbnMsIChpdGVtLCBpdGVtX25hbWUpLT5cclxuXHRcdGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZVxyXG5cclxuXHRzZWxmLnJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoc2VsZi5uYW1lKVxyXG5cclxuXHQjIOiuqeaJgOaciW9iamVjdOm7mOiupOacieaJgOaciWxpc3Rfdmlld3MvYWN0aW9ucy9yZWxhdGVkX29iamVjdHMvcmVhZGFibGVfZmllbGRzL2VkaXRhYmxlX2ZpZWxkc+WujOaVtOadg+mZkO+8jOivpeadg+mZkOWPr+iDveiiq+aVsOaNruW6k+S4reiuvue9rueahGFkbWluL3VzZXLmnYPpmZDopobnm5ZcclxuXHRzZWxmLnBlcm1pc3Npb25fc2V0ID0gXy5jbG9uZShDcmVhdG9yLmJhc2VPYmplY3QucGVybWlzc2lvbl9zZXQpXHJcblx0IyBkZWZhdWx0TGlzdFZpZXdzID0gXy5rZXlzKHNlbGYubGlzdF92aWV3cylcclxuXHQjIGRlZmF1bHRBY3Rpb25zID0gXy5rZXlzKHNlbGYuYWN0aW9ucylcclxuXHQjIGRlZmF1bHRSZWxhdGVkT2JqZWN0cyA9IF8ucGx1Y2soc2VsZi5yZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxyXG5cdCMgZGVmYXVsdFJlYWRhYmxlRmllbGRzID0gW11cclxuXHQjIGRlZmF1bHRFZGl0YWJsZUZpZWxkcyA9IFtdXHJcblx0IyBfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG5cdCMgXHRpZiAhKGZpZWxkLmhpZGRlbikgICAgIzIzMSBvbWl05a2X5q615pSv5oyB5Zyo6Z2e57yW6L6R6aG16Z2i5p+l55yLLCDlm6DmraTliKDpmaTkuobmraTlpITlr7lvbWl055qE5Yik5patXHJcblx0IyBcdFx0ZGVmYXVsdFJlYWRhYmxlRmllbGRzLnB1c2ggZmllbGRfbmFtZVxyXG5cdCMgXHRcdGlmICFmaWVsZC5yZWFkb25seVxyXG5cdCMgXHRcdFx0ZGVmYXVsdEVkaXRhYmxlRmllbGRzLnB1c2ggZmllbGRfbmFtZVxyXG5cclxuXHQjIF8uZWFjaCBzZWxmLnBlcm1pc3Npb25fc2V0LCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0IyBcdGlmIGl0ZW1fbmFtZSA9PSBcIm5vbmVcIlxyXG5cdCMgXHRcdHJldHVyblxyXG5cdCMgXHRpZiBzZWxmLmxpc3Rfdmlld3NcclxuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ubGlzdF92aWV3cyA9IGRlZmF1bHRMaXN0Vmlld3NcclxuXHQjIFx0aWYgc2VsZi5hY3Rpb25zXHJcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmFjdGlvbnMgPSBkZWZhdWx0QWN0aW9uc1xyXG5cdCMgXHRpZiBzZWxmLnJlbGF0ZWRfb2JqZWN0c1xyXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5yZWxhdGVkX29iamVjdHMgPSBkZWZhdWx0UmVsYXRlZE9iamVjdHNcclxuXHQjIFx0aWYgc2VsZi5maWVsZHNcclxuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ucmVhZGFibGVfZmllbGRzID0gZGVmYXVsdFJlYWRhYmxlRmllbGRzXHJcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmVkaXRhYmxlX2ZpZWxkcyA9IGRlZmF1bHRFZGl0YWJsZUZpZWxkc1xyXG5cdHVubGVzcyBvcHRpb25zLnBlcm1pc3Npb25fc2V0XHJcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0ID0ge31cclxuXHRpZiAhKG9wdGlvbnMucGVybWlzc2lvbl9zZXQ/LmFkbWluKVxyXG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldC5hZG1pbiA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcImFkbWluXCJdKVxyXG5cdGlmICEob3B0aW9ucy5wZXJtaXNzaW9uX3NldD8udXNlcilcclxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQudXNlciA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcInVzZXJcIl0pXHJcblx0Xy5lYWNoIG9wdGlvbnMucGVybWlzc2lvbl9zZXQsIChpdGVtLCBpdGVtX25hbWUpLT5cclxuXHRcdGlmICFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV1cclxuXHRcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0ge31cclxuXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdKSwgaXRlbSlcclxuXHJcblx0IyDliY3nq6/moLnmja5wZXJtaXNzaW9uc+aUueWGmWZpZWxk55u45YWz5bGe5oCn77yM5ZCO56uv5Y+q6KaB6LWw6buY6K6k5bGe5oCn5bCx6KGM77yM5LiN6ZyA6KaB5pS55YaZXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnNcclxuXHRcdGRpc2FibGVkX2xpc3Rfdmlld3MgPSBwZXJtaXNzaW9ucz8uZGlzYWJsZWRfbGlzdF92aWV3c1xyXG5cdFx0aWYgZGlzYWJsZWRfbGlzdF92aWV3cz8ubGVuZ3RoXHJcblx0XHRcdGRlZmF1bHRMaXN0Vmlld0lkID0gb3B0aW9ucy5saXN0X3ZpZXdzPy5hbGw/Ll9pZFxyXG5cdFx0XHRpZiBkZWZhdWx0TGlzdFZpZXdJZFxyXG5cdFx0XHRcdCMg5oqK6KeG5Zu+5p2D6ZmQ6YWN572u5Lit6buY6K6k55qEYWxs6KeG5Zu+aWTovazmjaLmiJBhbGzlhbPplK7lrZdcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAgZGlzYWJsZWRfbGlzdF92aWV3cywgKGxpc3Rfdmlld19pdGVtKSAtPlxyXG5cdFx0XHRcdFx0cmV0dXJuIGlmIGRlZmF1bHRMaXN0Vmlld0lkID09IGxpc3Rfdmlld19pdGVtIHRoZW4gXCJhbGxcIiBlbHNlIGxpc3Rfdmlld19pdGVtXHJcblx0XHRzZWxmLnBlcm1pc3Npb25zID0gbmV3IFJlYWN0aXZlVmFyKHBlcm1pc3Npb25zKVxyXG4jXHRcdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcbiNcdFx0XHRpZiBmaWVsZFxyXG4jXHRcdFx0XHRpZiBfLmluZGV4T2YocGVybWlzc2lvbnM/LnVucmVhZGFibGVfZmllbGRzLCBmaWVsZF9uYW1lKSA8IDBcclxuI1x0XHRcdFx0XHRpZiBmaWVsZC5oaWRkZW5cclxuI1x0XHRcdFx0XHRcdHJldHVyblxyXG4jXHRcdFx0XHRcdGlmIF8uaW5kZXhPZihwZXJtaXNzaW9ucz8udW5lZGl0YWJsZV9maWVsZHMsIGZpZWxkX25hbWUpID4gLTFcclxuI1x0XHRcdFx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxyXG4jXHRcdFx0XHRcdFx0ZmllbGQuZGlzYWJsZWQgPSB0cnVlXHJcbiNcdFx0XHRcdFx0XHQjIOW9k+WPquivu+aXtu+8jOWmguaenOS4jeWOu+aOieW/heWhq+Wtl+aute+8jGF1dG9mb3Jt5piv5Lya5oql6ZSZ55qEXHJcbiNcdFx0XHRcdFx0XHRmaWVsZC5yZXF1aXJlZCA9IGZhbHNlXHJcbiNcdFx0XHRcdGVsc2VcclxuI1x0XHRcdFx0XHRmaWVsZC5oaWRkZW4gPSB0cnVlXHJcblx0ZWxzZVxyXG5cdFx0c2VsZi5wZXJtaXNzaW9ucyA9IG51bGxcclxuXHJcblx0X2RiID0gQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uKG9wdGlvbnMpXHJcblxyXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbX2RiLl9uYW1lXSA9IF9kYlxyXG5cclxuXHRzZWxmLmRiID0gX2RiXHJcblxyXG5cdHNlbGYuX2NvbGxlY3Rpb25fbmFtZSA9IF9kYi5fbmFtZVxyXG5cclxuXHRzY2hlbWEgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYShzZWxmKVxyXG5cdHNlbGYuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYShzY2hlbWEpXHJcblx0aWYgc2VsZi5uYW1lICE9IFwidXNlcnNcIiBhbmQgc2VsZi5uYW1lICE9IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIiAmJiAhc2VsZi5pc192aWV3ICYmICFfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXHJcblx0aWYgc2VsZi5uYW1lID09IFwidXNlcnNcIlxyXG5cdFx0X2RiLl9zaW1wbGVTY2hlbWEgPSBzZWxmLnNjaGVtYVxyXG5cclxuXHRpZiBfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxyXG5cclxuXHRDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGZcclxuXHJcblx0cmV0dXJuIHNlbGZcclxuXHJcbiMgQ3JlYXRvci5PYmplY3QucHJvdG90eXBlLmkxOG4gPSAoKS0+XHJcbiMgXHQjIHNldCBvYmplY3QgbGFiZWxcclxuIyBcdHNlbGYgPSB0aGlzXHJcblxyXG4jIFx0a2V5ID0gc2VsZi5uYW1lXHJcbiMgXHRpZiB0KGtleSkgPT0ga2V5XHJcbiMgXHRcdGlmICFzZWxmLmxhYmVsXHJcbiMgXHRcdFx0c2VsZi5sYWJlbCA9IHNlbGYubmFtZVxyXG4jIFx0ZWxzZVxyXG4jIFx0XHRzZWxmLmxhYmVsID0gdChrZXkpXHJcblxyXG4jIFx0IyBzZXQgZmllbGQgbGFiZWxzXHJcbiMgXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG4jIFx0XHRma2V5ID0gc2VsZi5uYW1lICsgXCJfXCIgKyBmaWVsZF9uYW1lXHJcbiMgXHRcdGlmIHQoZmtleSkgPT0gZmtleVxyXG4jIFx0XHRcdGlmICFmaWVsZC5sYWJlbFxyXG4jIFx0XHRcdFx0ZmllbGQubGFiZWwgPSBmaWVsZF9uYW1lXHJcbiMgXHRcdGVsc2VcclxuIyBcdFx0XHRmaWVsZC5sYWJlbCA9IHQoZmtleSlcclxuIyBcdFx0c2VsZi5zY2hlbWE/Ll9zY2hlbWE/W2ZpZWxkX25hbWVdPy5sYWJlbCA9IGZpZWxkLmxhYmVsXHJcblxyXG5cclxuIyBcdCMgc2V0IGxpc3R2aWV3IGxhYmVsc1xyXG4jIFx0Xy5lYWNoIHNlbGYubGlzdF92aWV3cywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxyXG4jIFx0XHRpMThuX2tleSA9IHNlbGYubmFtZSArIFwiX2xpc3R2aWV3X1wiICsgaXRlbV9uYW1lXHJcbiMgXHRcdGlmIHQoaTE4bl9rZXkpID09IGkxOG5fa2V5XHJcbiMgXHRcdFx0aWYgIWl0ZW0ubGFiZWxcclxuIyBcdFx0XHRcdGl0ZW0ubGFiZWwgPSBpdGVtX25hbWVcclxuIyBcdFx0ZWxzZVxyXG4jIFx0XHRcdGl0ZW0ubGFiZWwgPSB0KGkxOG5fa2V5KVxyXG5cclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXggPSAob2JqZWN0KS0+XHJcblx0aWYgb2JqZWN0XHJcblx0XHRpZiAhb2JqZWN0LmRhdGFiYXNlX25hbWUgfHwgb2JqZWN0LmRhdGFiYXNlX25hbWUgPT0gJ21ldGVvci1tb25nbydcclxuXHRcdFx0cmV0dXJuIFwiL2FwaS9vZGF0YS92NFwiXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBcIi9hcGkvb2RhdGEvI3tvYmplY3QuZGF0YWJhc2VfbmFtZX1cIlxyXG5cclxuIyBpZiBNZXRlb3IuaXNDbGllbnRcclxuXHJcbiMgXHRNZXRlb3Iuc3RhcnR1cCAtPlxyXG4jIFx0XHRUcmFja2VyLmF1dG9ydW4gLT5cclxuIyBcdFx0XHRpZiBTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICYmIENyZWF0b3IuYm9vdHN0cmFwTG9hZGVkPy5nZXQoKVxyXG4jIFx0XHRcdFx0Xy5lYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG9iamVjdCwgb2JqZWN0X25hbWUpLT5cclxuIyBcdFx0XHRcdFx0b2JqZWN0LmkxOG4oKVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRpZiAhQ3JlYXRvci5ib290c3RyYXBMb2FkZWQgJiYgQ3JlYXRvci5PYmplY3RzXHJcblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAob2JqZWN0KS0+XHJcblx0XHRcdG5ldyBDcmVhdG9yLk9iamVjdChvYmplY3QpXHJcblxyXG4iLCJ2YXIgY2xvbmU7XG5cbmNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcblxuQ3JlYXRvci5vYmplY3RzQnlOYW1lID0ge307XG5cbkNyZWF0b3IuZm9ybWF0T2JqZWN0TmFtZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGlmIChvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjZnMuZmlsZXMuJykpIHtcbiAgICBvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpO1xuICB9XG4gIHJldHVybiBvYmplY3RfbmFtZTtcbn07XG5cbkNyZWF0b3IuT2JqZWN0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICB2YXIgX2RiLCBkZWZhdWx0Q29sdW1ucywgZGVmYXVsdExpc3RWaWV3SWQsIGRpc2FibGVkX2xpc3Rfdmlld3MsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHNjaGVtYSwgc2VsZjtcbiAgc2VsZiA9IHRoaXM7XG4gIGlmICghb3B0aW9ucy5uYW1lKSB7XG4gICAgY29uc29sZS5lcnJvcihvcHRpb25zKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IG5hbWUnKTtcbiAgfVxuICBzZWxmLl9pZCA9IG9wdGlvbnMuX2lkIHx8IG9wdGlvbnMubmFtZTtcbiAgc2VsZi5zcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gIHNlbGYubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgc2VsZi5sYWJlbCA9IG9wdGlvbnMubGFiZWw7XG4gIHNlbGYuaWNvbiA9IG9wdGlvbnMuaWNvbjtcbiAgc2VsZi5kZXNjcmlwdGlvbiA9IG9wdGlvbnMuZGVzY3JpcHRpb247XG4gIHNlbGYuaXNfdmlldyA9IG9wdGlvbnMuaXNfdmlldztcbiAgc2VsZi5mb3JtID0gb3B0aW9ucy5mb3JtO1xuICBpZiAoIV8uaXNCb29sZWFuKG9wdGlvbnMuaXNfZW5hYmxlKSB8fCBvcHRpb25zLmlzX2VuYWJsZSA9PT0gdHJ1ZSkge1xuICAgIHNlbGYuaXNfZW5hYmxlID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBzZWxmLmlzX2VuYWJsZSA9IGZhbHNlO1xuICB9XG4gIHNlbGYuZW5hYmxlX3NlYXJjaCA9IG9wdGlvbnMuZW5hYmxlX3NlYXJjaDtcbiAgc2VsZi5lbmFibGVfZmlsZXMgPSBvcHRpb25zLmVuYWJsZV9maWxlcztcbiAgc2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrcztcbiAgc2VsZi5lbmFibGVfbm90ZXMgPSBvcHRpb25zLmVuYWJsZV9ub3RlcztcbiAgc2VsZi5lbmFibGVfYXVkaXQgPSBvcHRpb25zLmVuYWJsZV9hdWRpdDtcbiAgc2VsZi5oaWRkZW4gPSBvcHRpb25zLmhpZGRlbjtcbiAgc2VsZi5lbmFibGVfYXBpID0gKG9wdGlvbnMuZW5hYmxlX2FwaSA9PT0gdm9pZCAwKSB8fCBvcHRpb25zLmVuYWJsZV9hcGk7XG4gIHNlbGYuY3VzdG9tID0gb3B0aW9ucy5jdXN0b207XG4gIHNlbGYuZW5hYmxlX3NoYXJlID0gb3B0aW9ucy5lbmFibGVfc2hhcmU7XG4gIHNlbGYuZW5hYmxlX2luc3RhbmNlcyA9IG9wdGlvbnMuZW5hYmxlX2luc3RhbmNlcztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkpIHtcbiAgICAgIHNlbGYuZW5hYmxlX3RyZWUgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWU7XG4gICAgICBzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKTtcbiAgICBzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZTtcbiAgfVxuICBzZWxmLm9wZW5fd2luZG93ID0gb3B0aW9ucy5vcGVuX3dpbmRvdztcbiAgc2VsZi5maWx0ZXJfY29tcGFueSA9IG9wdGlvbnMuZmlsdGVyX2NvbXBhbnk7XG4gIHNlbGYuY2FsZW5kYXIgPSBfLmNsb25lKG9wdGlvbnMuY2FsZW5kYXIpO1xuICBzZWxmLmVuYWJsZV9jaGF0dGVyID0gb3B0aW9ucy5lbmFibGVfY2hhdHRlcjtcbiAgc2VsZi5lbmFibGVfdHJhc2ggPSBvcHRpb25zLmVuYWJsZV90cmFzaDtcbiAgc2VsZi5lbmFibGVfc3BhY2VfZ2xvYmFsID0gb3B0aW9ucy5lbmFibGVfc3BhY2VfZ2xvYmFsO1xuICBzZWxmLmVuYWJsZV9hcHByb3ZhbHMgPSBvcHRpb25zLmVuYWJsZV9hcHByb3ZhbHM7XG4gIHNlbGYuZW5hYmxlX2ZvbGxvdyA9IG9wdGlvbnMuZW5hYmxlX2ZvbGxvdztcbiAgc2VsZi5lbmFibGVfd29ya2Zsb3cgPSBvcHRpb25zLmVuYWJsZV93b3JrZmxvdztcbiAgaWYgKF8uaGFzKG9wdGlvbnMsICdpbl9kZXZlbG9wbWVudCcpKSB7XG4gICAgc2VsZi5pbl9kZXZlbG9wbWVudCA9IG9wdGlvbnMuaW5fZGV2ZWxvcG1lbnQ7XG4gIH1cbiAgc2VsZi5pZEZpZWxkTmFtZSA9ICdfaWQnO1xuICBpZiAob3B0aW9ucy5kYXRhYmFzZV9uYW1lKSB7XG4gICAgc2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lO1xuICB9XG4gIGlmICghb3B0aW9ucy5maWVsZHMpIHtcbiAgICBjb25zb2xlLmVycm9yKG9wdGlvbnMpO1xuICAgIHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xuICB9XG4gIHNlbGYuZmllbGRzID0gY2xvbmUob3B0aW9ucy5maWVsZHMpO1xuICBfLmVhY2goc2VsZi5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgaWYgKGZpZWxkX25hbWUgPT09ICduYW1lJyB8fCBmaWVsZC5pc19uYW1lKSB7XG4gICAgICBzZWxmLk5BTUVfRklFTERfS0VZID0gZmllbGRfbmFtZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLnByaW1hcnkpIHtcbiAgICAgIHNlbGYuaWRGaWVsZE5hbWUgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBpZiAoQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpKSB7XG4gICAgICAgIGlmIChmaWVsZF9uYW1lID09PSAnc3BhY2UnKSB7XG4gICAgICAgICAgZmllbGQuZmlsdGVyYWJsZSA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIGZpZWxkLmhpZGRlbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKCFvcHRpb25zLmRhdGFiYXNlX25hbWUgfHwgb3B0aW9ucy5kYXRhYmFzZV9uYW1lID09PSAnbWV0ZW9yLW1vbmdvJykge1xuICAgIF8uZWFjaChDcmVhdG9yLmJhc2VPYmplY3QuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgICAgaWYgKCFzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSkge1xuICAgICAgICBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IHt9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShmaWVsZCksIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdKTtcbiAgICB9KTtcbiAgfVxuICBzZWxmLmxpc3Rfdmlld3MgPSB7fTtcbiAgZGVmYXVsdENvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKHNlbGYubmFtZSk7XG4gIF8uZWFjaChvcHRpb25zLmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHZhciBvaXRlbTtcbiAgICBvaXRlbSA9IENyZWF0b3IuY29udmVydExpc3RWaWV3KGRlZmF1bHRDb2x1bW5zLCBpdGVtLCBpdGVtX25hbWUpO1xuICAgIHJldHVybiBzZWxmLmxpc3Rfdmlld3NbaXRlbV9uYW1lXSA9IG9pdGVtO1xuICB9KTtcbiAgc2VsZi50cmlnZ2VycyA9IF8uY2xvbmUoQ3JlYXRvci5iYXNlT2JqZWN0LnRyaWdnZXJzKTtcbiAgXy5lYWNoKG9wdGlvbnMudHJpZ2dlcnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIGlmICghc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdLm5hbWUgPSBpdGVtX25hbWU7XG4gICAgcmV0dXJuIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSk7XG4gIH0pO1xuICBzZWxmLmFjdGlvbnMgPSBfLmNsb25lKENyZWF0b3IuYmFzZU9iamVjdC5hY3Rpb25zKTtcbiAgXy5lYWNoKG9wdGlvbnMuYWN0aW9ucywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgdmFyIGNvcHlJdGVtO1xuICAgIGlmICghc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIGNvcHlJdGVtID0gXy5jbG9uZShzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSk7XG4gICAgZGVsZXRlIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdO1xuICAgIHJldHVybiBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKGNvcHlJdGVtLCBpdGVtKTtcbiAgfSk7XG4gIF8uZWFjaChzZWxmLmFjdGlvbnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHJldHVybiBpdGVtLm5hbWUgPSBpdGVtX25hbWU7XG4gIH0pO1xuICBzZWxmLnJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoc2VsZi5uYW1lKTtcbiAgc2VsZi5wZXJtaXNzaW9uX3NldCA9IF8uY2xvbmUoQ3JlYXRvci5iYXNlT2JqZWN0LnBlcm1pc3Npb25fc2V0KTtcbiAgaWYgKCFvcHRpb25zLnBlcm1pc3Npb25fc2V0KSB7XG4gICAgb3B0aW9ucy5wZXJtaXNzaW9uX3NldCA9IHt9O1xuICB9XG4gIGlmICghKChyZWYgPSBvcHRpb25zLnBlcm1pc3Npb25fc2V0KSAhPSBudWxsID8gcmVmLmFkbWluIDogdm9pZCAwKSkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQuYWRtaW4gPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJhZG1pblwiXSk7XG4gIH1cbiAgaWYgKCEoKHJlZjEgPSBvcHRpb25zLnBlcm1pc3Npb25fc2V0KSAhPSBudWxsID8gcmVmMS51c2VyIDogdm9pZCAwKSkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQudXNlciA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcInVzZXJcIl0pO1xuICB9XG4gIF8uZWFjaChvcHRpb25zLnBlcm1pc3Npb25fc2V0LCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICBpZiAoIXNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIHJldHVybiBzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSksIGl0ZW0pO1xuICB9KTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHBlcm1pc3Npb25zID0gb3B0aW9ucy5wZXJtaXNzaW9ucztcbiAgICBkaXNhYmxlZF9saXN0X3ZpZXdzID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgOiB2b2lkIDA7XG4gICAgaWYgKGRpc2FibGVkX2xpc3Rfdmlld3MgIT0gbnVsbCA/IGRpc2FibGVkX2xpc3Rfdmlld3MubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICBkZWZhdWx0TGlzdFZpZXdJZCA9IChyZWYyID0gb3B0aW9ucy5saXN0X3ZpZXdzKSAhPSBudWxsID8gKHJlZjMgPSByZWYyLmFsbCkgIT0gbnVsbCA/IHJlZjMuX2lkIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGRlZmF1bHRMaXN0Vmlld0lkKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBfLm1hcChkaXNhYmxlZF9saXN0X3ZpZXdzLCBmdW5jdGlvbihsaXN0X3ZpZXdfaXRlbSkge1xuICAgICAgICAgIGlmIChkZWZhdWx0TGlzdFZpZXdJZCA9PT0gbGlzdF92aWV3X2l0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBcImFsbFwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdF92aWV3X2l0ZW07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2VsZi5wZXJtaXNzaW9ucyA9IG5ldyBSZWFjdGl2ZVZhcihwZXJtaXNzaW9ucyk7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5wZXJtaXNzaW9ucyA9IG51bGw7XG4gIH1cbiAgX2RiID0gQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uKG9wdGlvbnMpO1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zW19kYi5fbmFtZV0gPSBfZGI7XG4gIHNlbGYuZGIgPSBfZGI7XG4gIHNlbGYuX2NvbGxlY3Rpb25fbmFtZSA9IF9kYi5fbmFtZTtcbiAgc2NoZW1hID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoc2VsZik7XG4gIHNlbGYuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYShzY2hlbWEpO1xuICBpZiAoc2VsZi5uYW1lICE9PSBcInVzZXJzXCIgJiYgc2VsZi5uYW1lICE9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIgJiYgIXNlbGYuaXNfdmlldyAmJiAhXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiXSwgc2VsZi5uYW1lKSkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChzZWxmLm5hbWUgPT09IFwidXNlcnNcIikge1xuICAgIF9kYi5fc2ltcGxlU2NoZW1hID0gc2VsZi5zY2hlbWE7XG4gIH1cbiAgaWYgKF8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSkpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGY7XG4gIHJldHVybiBzZWxmO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0KSB7XG4gICAgaWYgKCFvYmplY3QuZGF0YWJhc2VfbmFtZSB8fCBvYmplY3QuZGF0YWJhc2VfbmFtZSA9PT0gJ21ldGVvci1tb25nbycpIHtcbiAgICAgIHJldHVybiBcIi9hcGkvb2RhdGEvdjRcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiL2FwaS9vZGF0YS9cIiArIG9iamVjdC5kYXRhYmFzZV9uYW1lO1xuICAgIH1cbiAgfVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIGlmICghQ3JlYXRvci5ib290c3RyYXBMb2FkZWQgJiYgQ3JlYXRvci5PYmplY3RzKSB7XG4gICAgcmV0dXJuIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgcmV0dXJuIG5ldyBDcmVhdG9yLk9iamVjdChvYmplY3QpO1xuICAgIH0pO1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hID0gKG9iaikgLT5cclxuXHRzY2hlbWEgPSB7fVxyXG5cclxuXHRmaWVsZHNBcnIgPSBbXVxyXG5cclxuXHRfLmVhY2ggb2JqLmZpZWxkcyAsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG5cdFx0aWYgIV8uaGFzKGZpZWxkLCBcIm5hbWVcIilcclxuXHRcdFx0ZmllbGQubmFtZSA9IGZpZWxkX25hbWVcclxuXHRcdGZpZWxkc0Fyci5wdXNoIGZpZWxkXHJcblxyXG5cdF8uZWFjaCBfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgKGZpZWxkKS0+XHJcblxyXG5cdFx0ZmllbGRfbmFtZSA9IGZpZWxkLm5hbWVcclxuXHJcblx0XHRmcyA9IHt9XHJcblx0XHRpZiBmaWVsZC5yZWdFeFxyXG5cdFx0XHRmcy5yZWdFeCA9IGZpZWxkLnJlZ0V4XHJcblx0XHRmcy5hdXRvZm9ybSA9IHt9XHJcblx0XHRmcy5hdXRvZm9ybS5tdWx0aXBsZSA9IGZpZWxkLm11bHRpcGxlXHJcblx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cclxuXHJcblx0XHRhdXRvZm9ybV90eXBlID0gZmllbGQuYXV0b2Zvcm0/LnR5cGVcclxuXHJcblx0XHRpZiBmaWVsZC50eXBlID09IFwidGV4dFwiIG9yIGZpZWxkLnR5cGUgPT0gXCJwaG9uZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIlt0ZXh0XVwiIG9yIGZpZWxkLnR5cGUgPT0gXCJbcGhvbmVdXCJcclxuXHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdjb2RlJ1xyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTJcclxuXHRcdFx0aWYgZmllbGQubGFuZ3VhZ2VcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5sYW5ndWFnZSA9IGZpZWxkLmxhbmd1YWdlXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ0ZXh0YXJlYVwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIlxyXG5cdFx0XHRmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAyXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJwYXNzd29yZFwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXHJcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKClcclxuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXHJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0XHR0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIlxyXG5cdFx0XHRcdFx0XHRkYXRlTW9iaWxlT3B0aW9uczpcclxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGVcIlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLm91dEZvcm1hdCA9ICd5eXl5LU1NLWRkJztcclxuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXHJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcclxuXHRcdFx0XHRcdFx0dGltZXpvbmVJZDogXCJ1dGNcIlxyXG5cdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXHJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcclxuXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRldGltZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXHJcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKClcclxuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXHJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0XHR0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIlxyXG5cdFx0XHRcdFx0XHRkYXRlTW9iaWxlT3B0aW9uczpcclxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxyXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cclxuXHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXHJcblx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XHJcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXHJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIltPYmplY3RdXCJcclxuXHRcdFx0ZnMudHlwZSA9IFtPYmplY3RdXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJodG1sXCJcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdHR5cGU6IFwic3VtbWVybm90ZVwiXHJcblx0XHRcdFx0Y2xhc3M6ICdzdW1tZXJub3RlLWVkaXRvcidcclxuXHRcdFx0XHRzZXR0aW5nczpcclxuXHRcdFx0XHRcdGhlaWdodDogMjAwXHJcblx0XHRcdFx0XHRkaWFsb2dzSW5Cb2R5OiB0cnVlXHJcblx0XHRcdFx0XHR0b29sYmFyOiAgW1xyXG5cdFx0XHRcdFx0XHRbJ2ZvbnQxJywgWydzdHlsZSddXSxcclxuXHRcdFx0XHRcdFx0Wydmb250MicsIFsnYm9sZCcsICd1bmRlcmxpbmUnLCAnaXRhbGljJywgJ2NsZWFyJ11dLFxyXG5cdFx0XHRcdFx0XHRbJ2ZvbnQzJywgWydmb250bmFtZSddXSxcclxuXHRcdFx0XHRcdFx0Wydjb2xvcicsIFsnY29sb3InXV0sXHJcblx0XHRcdFx0XHRcdFsncGFyYScsIFsndWwnLCAnb2wnLCAncGFyYWdyYXBoJ11dLFxyXG5cdFx0XHRcdFx0XHRbJ3RhYmxlJywgWyd0YWJsZSddXSxcclxuXHRcdFx0XHRcdFx0WydpbnNlcnQnLCBbJ2xpbmsnLCAncGljdHVyZSddXSxcclxuXHRcdFx0XHRcdFx0Wyd2aWV3JywgWydjb2RldmlldyddXVxyXG5cdFx0XHRcdFx0XVxyXG5cdFx0XHRcdFx0Zm9udE5hbWVzOiBbJ0FyaWFsJywgJ0NvbWljIFNhbnMgTVMnLCAnQ291cmllciBOZXcnLCAnSGVsdmV0aWNhJywgJ0ltcGFjdCcsICflrovkvZMnLCfpu5HkvZMnLCflvq7ova/pm4Xpu5EnLCfku7/lrosnLCfmpbfkvZMnLCfpmrbkuaYnLCflubzlnIYnXVxyXG5cdFx0XHRcdFx0bGFuZzogJ3poLUNOJ1xyXG5cclxuXHRcdGVsc2UgaWYgKGZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIiBvciBmaWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKVxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmllbGQuc2hvd0ljb25cclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHJcblx0XHRcdGlmICFmaWVsZC5oaWRkZW5cclxuXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZmlsdGVycyA9IGZpZWxkLmZpbHRlcnNcclxuXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVwZW5kT24gPSBmaWVsZC5kZXBlbmRfb25cclxuXHJcblx0XHRcdFx0aWYgZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uXHJcblx0XHRcdFx0XHRmcy5iZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cclxuXHJcblx0XHRcdFx0ZnMuZmlsdGVyc0Z1bmN0aW9uID0gaWYgZmllbGQuZmlsdGVyc0Z1bmN0aW9uIHRoZW4gZmllbGQuZmlsdGVyc0Z1bmN0aW9uIGVsc2UgQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnNcclxuXHJcblx0XHRcdFx0aWYgZmllbGQub3B0aW9uc0Z1bmN0aW9uXHJcblx0XHRcdFx0XHRmcy5vcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb25cclxuXHJcblx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvXHJcblxyXG5cdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdGlmIGZpZWxkLmNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWVsZC5jcmVhdGVGdW5jdGlvbilcclxuXHRcdFx0XHRcdFx0XHRmcy5jcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpZWxkLnJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdFx0XHRcdF9yZWZfb2JqID0gQ3JlYXRvci5PYmplY3RzW2ZpZWxkLnJlZmVyZW5jZV90b11cclxuXHRcdFx0XHRcdFx0XHRcdGlmIF9yZWZfb2JqPy5wZXJtaXNzaW9ucz8uYWxsb3dDcmVhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5jcmVhdGVGdW5jdGlvbiA9IChsb29rdXBfZmllbGQpLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRNb2RhbC5zaG93KFwiQ3JlYXRvck9iamVjdE1vZGFsXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb246IFwiQ3JlYXRvci5Db2xsZWN0aW9ucy4je0NyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8pLl9uYW1lfVwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9ybUlkOiBcIm5ldyN7ZmllbGQucmVmZXJlbmNlX3RvLnJlcGxhY2UoJy4nLCdfJyl9XCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogXCIje2ZpZWxkLnJlZmVyZW5jZV90b31cIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9wZXJhdGlvbjogXCJpbnNlcnRcIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9uU3VjY2VzczogKG9wZXJhdGlvbiwgcmVzdWx0KS0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgcmVzdWx0Lm9iamVjdF9uYW1lID09IFwib2JqZWN0c1wiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFt7bGFiZWw6IHJlc3VsdC52YWx1ZS5sYWJlbCwgdmFsdWU6IHJlc3VsdC52YWx1ZS5uYW1lLCBpY29uOiByZXN1bHQudmFsdWUuaWNvbn1dLCByZXN1bHQudmFsdWUubmFtZSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbe2xhYmVsOiByZXN1bHQudmFsdWVbb2JqZWN0Lk5BTUVfRklFTERfS0VZXSB8fCByZXN1bHQudmFsdWUubGFiZWwgfHwgcmVzdWx0LnZhbHVlLm5hbWUsIHZhbHVlOiByZXN1bHQuX2lkfV0sIHJlc3VsdC5faWQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmFsc2VcclxuXHJcblx0XHRcdFx0XHRpZiBfLmlzQm9vbGVhbihmaWVsZC5jcmVhdGUpXHJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZpZWxkLmNyZWF0ZVxyXG5cclxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV9zb3J0XHJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNTb3J0ID0gZmllbGQucmVmZXJlbmNlX3NvcnRcclxuXHJcblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfbGltaXRcclxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc0xpbWl0ID0gZmllbGQucmVmZXJlbmNlX2xpbWl0XHJcblxyXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvID09IFwidXNlcnNcIlxyXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3R1c2VyXCJcclxuXHRcdFx0XHRcdFx0aWYgIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdFxyXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5Y2V5L2N5LiL55qE5pWw5o2uXHJcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTlj6/ku6XooqvmlLnlhpnopobnm5bmiJB0cnVlL2ZhbHNl5oiW5YW25LuWZnVuY3Rpb25cclxuXHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT0gdW5kZWZpbmVkXHJcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxyXG5cdFx0XHRcdFx0XHRcdFx0IyDlr7nlvZPliY3lr7nosaHmnIl2aWV3QWxsUmVjb3Jkc+adg+mZkOWImeS4jemZkOWItuaJgOWxnuWNleS9jeWIl+ihqOafpeeci+adg+mZkO+8jOWQpuWImeWPquaYvuekuuW9k+WJjeaJgOWxnuWNleS9jVxyXG5cdFx0XHRcdFx0XHRcdFx0IyDms6jmhI/kuI3mmK9yZWZlcmVuY2VfdG/lr7nosaHnmoR2aWV3QWxsUmVjb3Jkc+adg+mZkO+8jOiAjOaYr+W9k+WJjeWvueixoeeahFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zPy5nZXQoKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5a2X5q615omA5bGe5a+56LGh5piv55So5oi35oiW57uE57uH77yM5YiZ5piv5ZCm6ZmQ5Yi25pi+56S65omA5bGe5Y2V5L2N6YOo6Zeo5LiObW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWFs+iBlFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0Z1bmN0aW9uIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5Y2V5L2NXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0ZWxzZSBpZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT0gXCJvcmdhbml6YXRpb25zXCJcclxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0b3JnXCJcclxuXHRcdFx0XHRcdFx0aWYgIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdFxyXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5Y2V5L2N5LiL55qE5pWw5o2uXHJcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTlj6/ku6XooqvmlLnlhpnopobnm5bmiJB0cnVlL2ZhbHNl5oiW5YW25LuWZnVuY3Rpb25cclxuXHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT0gdW5kZWZpbmVkXHJcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxyXG5cdFx0XHRcdFx0XHRcdFx0IyDlr7nlvZPliY3lr7nosaHmnIl2aWV3QWxsUmVjb3Jkc+adg+mZkOWImeS4jemZkOWItuaJgOWxnuWNleS9jeWIl+ihqOafpeeci+adg+mZkO+8jOWQpuWImeWPquaYvuekuuW9k+WJjeaJgOWxnuWNleS9jVxyXG5cdFx0XHRcdFx0XHRcdFx0IyDms6jmhI/kuI3mmK9yZWZlcmVuY2VfdG/lr7nosaHnmoR2aWV3QWxsUmVjb3Jkc+adg+mZkO+8jOiAjOaYr+W9k+WJjeWvueixoeeahFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zPy5nZXQoKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5a2X5q615omA5bGe5a+56LGh5piv55So5oi35oiW57uE57uH77yM5YiZ5piv5ZCm6ZmQ5Yi25pi+56S65omA5bGe5Y2V5L2N6YOo6Zeo5LiObW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWFs+iBlFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0Z1bmN0aW9uIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5Y2V5L2NXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRpZiB0eXBlb2YoZmllbGQucmVmZXJlbmNlX3RvKSA9PSBcImZ1bmN0aW9uXCJcclxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvKClcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cclxuXHJcblx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShfcmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0XHRcdGZzLnR5cGUgPSBPYmplY3RcclxuXHRcdFx0XHRcdFx0XHRmcy5ibGFja2JveCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZVxyXG5cclxuXHRcdFx0XHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLm9cIl0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBTdHJpbmdcclxuXHRcdFx0XHRcdFx0XHRcdGF1dG9mb3JtOiB7b21pdDogdHJ1ZX1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuaWRzXCJdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogW1N0cmluZ11cclxuXHRcdFx0XHRcdFx0XHRcdGF1dG9mb3JtOiB7b21pdDogdHJ1ZX1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90byA9IFtfcmVmZXJlbmNlX3RvXVxyXG5cclxuXHRcdFx0XHRcdFx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXVxyXG5cdFx0XHRcdFx0XHRpZiBfb2JqZWN0IGFuZCBfb2JqZWN0LmVuYWJsZV90cmVlXHJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0VHJlZVwiXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiXHJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZCA9IGZpZWxkLm9wdGlvbnNNZXRob2QgfHwgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCJcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kUGFyYW1zID0gKCktPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XHJcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzID0gW11cclxuXHRcdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8uZm9yRWFjaCAoX3JlZmVyZW5jZSktPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIF9vYmplY3RcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2gge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogX29iamVjdD8ubGFiZWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGljb246IF9vYmplY3Q/Lmljb25cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpbms6ICgpLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiL2FwcC8je1Nlc3Npb24uZ2V0KCdhcHBfaWQnKX0vI3tfcmVmZXJlbmNlfS92aWV3L1wiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdDogX3JlZmVyZW5jZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGluazogKCktPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCIvYXBwLyN7U2Vzc2lvbi5nZXQoJ2FwcF9pZCcpfS8je19yZWZlcmVuY2V9L3ZpZXcvXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCJcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb25cclxuXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJzZWxlY3RcIlxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmFsc2VcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0XCJcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gXCJcIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiY3VycmVuY3lcIlxyXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxyXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcclxuXHRcdFx0aWYgZmllbGQ/LnNjYWxlXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZVxyXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXHJcblx0XHRcdGVsc2UgaWYgZmllbGQ/LnNjYWxlICE9IDBcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IDJcclxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibnVtYmVyXCJcclxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XHJcblx0XHRcdGlmIGZpZWxkPy5zY2FsZVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGVcclxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYm9vbGVhblwiXHJcblx0XHRcdGZzLnR5cGUgPSBCb29sZWFuXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi1jaGVja2JveFwiXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJyZWZlcmVuY2VcIlxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJjaGVja2JveFwiXHJcblx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3QtY2hlY2tib3hcIlxyXG5cdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZmlsZVwiIGFuZCBmaWVsZC5jb2xsZWN0aW9uXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cclxuXHRcdFx0XHRcdGF1dG9mb3JtOlxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogZmllbGQuY29sbGVjdGlvblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gZmllbGQuY29sbGVjdGlvblxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZmlsZXNpemVcIlxyXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZXNpemUnXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJPYmplY3RcIiB8fCBmaWVsZC50eXBlID09IFwib2JqZWN0XCJcclxuXHRcdFx0ZnMudHlwZSA9IE9iamVjdFxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZ3JpZFwiXHJcblx0XHRcdGZzLnR5cGUgPSBBcnJheVxyXG5cdFx0XHRmcy5hdXRvZm9ybS5lZGl0YWJsZSA9IHRydWVcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0dyaWRcIlxyXG5cclxuXHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cclxuXHRcdFx0XHR0eXBlOiBPYmplY3RcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImltYWdlXCJcclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxyXG5cdFx0XHRcdFx0YXV0b2Zvcm06XHJcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnaW1hZ2VzJ1xyXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdpbWFnZS8qJ1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2ltYWdlcydcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKidcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImF2YXRhclwiXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cclxuXHRcdFx0XHRcdGF1dG9mb3JtOlxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2F2YXRhcnMnXHJcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2ltYWdlLyonXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXZhdGFycydcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKidcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImF1ZGlvXCJcclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxyXG5cdFx0XHRcdFx0YXV0b2Zvcm06XHJcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnYXVkaW9zJ1xyXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdhdWRpby8qJ1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F1ZGlvcydcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnYXVkaW8vKidcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInZpZGVvXCJcclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxyXG5cdFx0XHRcdFx0YXV0b2Zvcm06XHJcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAndmlkZW9zJ1xyXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICd2aWRlby8qJ1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ3ZpZGVvcydcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAndmlkZW8vKidcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImxvY2F0aW9uXCJcclxuXHRcdFx0ZnMudHlwZSA9IE9iamVjdFxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJsb2NhdGlvblwiXHJcblx0XHRcdGZzLmF1dG9mb3JtLnN5c3RlbSA9IGZpZWxkLnN5c3RlbSB8fCBcIndnczg0XCJcclxuXHRcdFx0ZnMuYmxhY2tib3ggPSB0cnVlXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJtYXJrZG93blwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1tYXJrZG93blwiXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ3VybCdcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHQjIGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LlVybFxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NVcmwnXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2VtYWlsJ1xyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc0VtYWlsJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdhdXRvbnVtYmVyJ1xyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRlbHNlXHJcblx0XHRcdGZzLnR5cGUgPSBmaWVsZC50eXBlXHJcblxyXG5cdFx0aWYgZmllbGQubGFiZWxcclxuXHRcdFx0ZnMubGFiZWwgPSBmaWVsZC5sYWJlbFxyXG5cclxuI1x0XHRpZiBmaWVsZC5hbGxvd2VkVmFsdWVzXHJcbiNcdFx0XHRmcy5hbGxvd2VkVmFsdWVzID0gZmllbGQuYWxsb3dlZFZhbHVlc1xyXG5cclxuXHRcdGlmICFmaWVsZC5yZXF1aXJlZFxyXG5cdFx0XHRmcy5vcHRpb25hbCA9IHRydWVcclxuXHJcblx0XHQjIFvnrb7nuqblr7nosaHlkIzml7bphY3nva7kuoZjb21wYW55X2lkc+W/heWhq+WPinVuZWRpdGFibGVfZmllbGRz6YCg5oiQ6YOo5YiG55So5oi35paw5bu6562+57qm5a+56LGh5pe25oql6ZSZICMxOTJdKGh0dHBzOi8vZ2l0aHViLmNvbS9zdGVlZG9zL3N0ZWVkb3MtcHJvamVjdC1kenVnL2lzc3Vlcy8xOTIpXHJcblx0XHQjIOWQjuWPsOWni+e7iOiuvue9rnJlcXVpcmVk5Li6ZmFsc2VcclxuXHRcdGlmICFNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0ZnMub3B0aW9uYWwgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQudW5pcXVlXHJcblx0XHRcdGZzLnVuaXF1ZSA9IHRydWVcclxuXHJcblx0XHRpZiBmaWVsZC5vbWl0XHJcblx0XHRcdGZzLmF1dG9mb3JtLm9taXQgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQuZ3JvdXBcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uZ3JvdXAgPSBmaWVsZC5ncm91cFxyXG5cclxuXHRcdGlmIGZpZWxkLmlzX3dpZGVcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uaXNfd2lkZSA9IHRydWVcclxuXHJcblx0XHRpZiBmaWVsZC5oaWRkZW5cclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwiaGlkZGVuXCJcclxuXHJcblx0XHRpZiAoZmllbGQudHlwZSA9PSBcInNlbGVjdFwiKSBvciAoZmllbGQudHlwZSA9PSBcImxvb2t1cFwiKSBvciAoZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIilcclxuXHRcdFx0aWYgdHlwZW9mKGZpZWxkLmZpbHRlcmFibGUpID09ICd1bmRlZmluZWQnXHJcblx0XHRcdFx0ZmllbGQuZmlsdGVyYWJsZSA9IHRydWVcclxuXHRcdGlmIGZpZWxkLm5hbWUgPT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWVcclxuXHRcdFx0aWYgdHlwZW9mKGZpZWxkLnNlYXJjaGFibGUpID09ICd1bmRlZmluZWQnXHJcblx0XHRcdFx0ZmllbGQuc2VhcmNoYWJsZSA9IHRydWVcclxuXHJcblx0XHRpZiBhdXRvZm9ybV90eXBlXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBhdXRvZm9ybV90eXBlXHJcblxyXG5cdFx0aWYgZmllbGQuZGVmYXVsdFZhbHVlXHJcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudCBhbmQgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZmllbGQuZGVmYXVsdFZhbHVlKVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9ICgpLT5cclxuXHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmaWVsZC5kZWZhdWx0VmFsdWUsIHt1c2VySWQ6IE1ldGVvci51c2VySWQoKSwgc3BhY2VJZDogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpfSlcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxyXG5cdFx0XHRcdGlmICFfLmlzRnVuY3Rpb24oZmllbGQuZGVmYXVsdFZhbHVlKVxyXG5cdFx0XHRcdFx0ZnMuZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlXHJcblxyXG5cdFx0aWYgZmllbGQucmVhZG9ubHlcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ucmVhZG9ubHkgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQuZGlzYWJsZWRcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQuaW5saW5lSGVscFRleHRcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uaW5saW5lSGVscFRleHQgPSBmaWVsZC5pbmxpbmVIZWxwVGV4dFxyXG5cclxuXHRcdGlmIGZpZWxkLmJsYWNrYm94XHJcblx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxyXG5cclxuXHRcdGlmIF8uaGFzKGZpZWxkLCAnbWluJylcclxuXHRcdFx0ZnMubWluID0gZmllbGQubWluXHJcblx0XHRpZiBfLmhhcyhmaWVsZCwgJ21heCcpXHJcblx0XHRcdGZzLm1heCA9IGZpZWxkLm1heFxyXG5cclxuXHRcdCMg5Y+q5pyJ55Sf5Lqn546v5aKD5omN6YeN5bu657Si5byVXHJcblx0XHRpZiBNZXRlb3IuaXNQcm9kdWN0aW9uXHJcblx0XHRcdGlmIGZpZWxkLmluZGV4XHJcblx0XHRcdFx0ZnMuaW5kZXggPSBmaWVsZC5pbmRleFxyXG5cdFx0XHRlbHNlIGlmIGZpZWxkLnNvcnRhYmxlXHJcblx0XHRcdFx0ZnMuaW5kZXggPSB0cnVlXHJcblxyXG5cdFx0c2NoZW1hW2ZpZWxkX25hbWVdID0gZnNcclxuXHJcblx0cmV0dXJuIHNjaGVtYVxyXG5cclxuXHJcbkNyZWF0b3IuZ2V0RmllbGREaXNwbGF5VmFsdWUgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlKS0+XHJcblx0aHRtbCA9IGZpZWxkX3ZhbHVlXHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0aWYgIW9iamVjdFxyXG5cdFx0cmV0dXJuIFwiXCJcclxuXHRmaWVsZCA9IG9iamVjdC5maWVsZHMoZmllbGRfbmFtZSlcclxuXHRpZiAhZmllbGRcclxuXHRcdHJldHVybiBcIlwiXHJcblxyXG5cdGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRldGltZVwiXHJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQgSDptbScpXHJcblx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZVwiXHJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQnKVxyXG5cclxuXHRyZXR1cm4gaHRtbFxyXG5cclxuQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkgPSAoZmllbGRfdHlwZSktPlxyXG5cdHJldHVybiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIiwgXCJjdXJyZW5jeVwiLCBcIm51bWJlclwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxyXG5cclxuQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMgPSAoZmllbGRfdHlwZSwgb3BlcmF0aW9ucyktPlxyXG5cdGJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpXHJcblx0aWYgYnVpbHRpblZhbHVlc1xyXG5cdFx0Xy5mb3JFYWNoIGJ1aWx0aW5WYWx1ZXMsIChidWlsdGluSXRlbSwga2V5KS0+XHJcblx0XHRcdG9wZXJhdGlvbnMucHVzaCh7bGFiZWw6IGJ1aWx0aW5JdGVtLmxhYmVsLCB2YWx1ZToga2V5fSlcclxuXHJcbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSAoZmllbGRfdHlwZSwgaXNfY2hlY2tfb25seSktPlxyXG5cdCMg6L+H5ruk5Zmo5a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XHJcblx0aWYgW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSlcclxuXHJcbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0gPSAoZmllbGRfdHlwZSwga2V5KS0+XHJcblx0IyDov4fmu6TlmajlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcclxuXHRpZiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcclxuXHRcdHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBrZXkpXHJcblxyXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uID0gKGZpZWxkX3R5cGUsIHZhbHVlKS0+XHJcblx0IyDmoLnmja7ov4fmu6TlmajnmoTov4fmu6TlgLzvvIzojrflj5blr7nlupTnmoTlhoXnva7ov5DnrpfnrKZcclxuXHQjIOavlOWmgnZhbHVl5Li6bGFzdF95ZWFy77yM6L+U5ZueYmV0d2Vlbl90aW1lX2xhc3RfeWVhclxyXG5cdHVubGVzcyBfLmlzU3RyaW5nKHZhbHVlKVxyXG5cdFx0cmV0dXJuXHJcblx0YmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpXHJcblx0dW5sZXNzIGJldHdlZW5CdWlsdGluVmFsdWVzXHJcblx0XHRyZXR1cm5cclxuXHRyZXN1bHQgPSBudWxsXHJcblx0Xy5lYWNoIGJldHdlZW5CdWlsdGluVmFsdWVzLCAoaXRlbSwgb3BlcmF0aW9uKS0+XHJcblx0XHRpZiBpdGVtLmtleSA9PSB2YWx1ZVxyXG5cdFx0XHRyZXN1bHQgPSBvcGVyYXRpb25cclxuXHRyZXR1cm4gcmVzdWx0XHJcblxyXG4jIOWmguaenOWPquaYr+S4uuWIpOaWrW9wZXJhdGlvbuaYr+WQpuWtmOWcqO+8jOWImeayoeW/heimgeiuoeeul3ZhbHVlc++8jOS8oOWFpWlzX2NoZWNrX29ubHnkuLp0cnVl5Y2z5Y+vXHJcbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzID0gKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpLT5cclxuXHQjIOi/h+a7pOWZqOaXtumXtOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxyXG5cdHJldHVybiB7XHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfeWVhclwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc195ZWFyXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF95ZWFyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3llYXJcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfcXVhcnRlclwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19xdWFydGVyXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF9xdWFydGVyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3F1YXJ0ZXJcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X21vbnRoXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc19tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19tb250aFwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfbW9udGhcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3Rfd2Vla1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc193ZWVrXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF93ZWVrXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3dlZWtcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV95ZXN0ZGF5XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ5ZXN0ZGF5XCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9kYXlcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvZGF5XCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9tb3Jyb3dcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvbW9ycm93XCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF83X2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfN19kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8zMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzMwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzYwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfNjBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfOTBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF85MF9kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8xMjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8xMjBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfN19kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzdfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfMzBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8zMF9kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzYwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzkwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfOTBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfMTIwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMTIwX2RheXNcIilcclxuXHR9XHJcblxyXG5DcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoID0gKG1vbnRoKS0+XHJcblx0aWYgIW1vbnRoXHJcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxyXG5cdFxyXG5cdGlmIG1vbnRoIDwgM1xyXG5cdFx0cmV0dXJuIDBcclxuXHRlbHNlIGlmIG1vbnRoIDwgNlxyXG5cdFx0cmV0dXJuIDNcclxuXHRlbHNlIGlmIG1vbnRoIDwgOVxyXG5cdFx0cmV0dXJuIDZcclxuXHRcclxuXHRyZXR1cm4gOVxyXG5cclxuXHJcbkNyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSA9ICh5ZWFyLG1vbnRoKS0+XHJcblx0aWYgIXllYXJcclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcclxuXHRpZiAhbW9udGhcclxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXHJcblx0XHJcblx0aWYgbW9udGggPCAzXHJcblx0XHR5ZWFyLS1cclxuXHRcdG1vbnRoID0gOVxyXG5cdGVsc2UgaWYgbW9udGggPCA2XHJcblx0XHRtb250aCA9IDBcclxuXHRlbHNlIGlmIG1vbnRoIDwgOVxyXG5cdFx0bW9udGggPSAzXHJcblx0ZWxzZSBcclxuXHRcdG1vbnRoID0gNlxyXG5cdFxyXG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcclxuXHRcclxuXHJcbkNyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSA9ICh5ZWFyLG1vbnRoKS0+XHJcblx0aWYgIXllYXJcclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcclxuXHRpZiAhbW9udGhcclxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXHJcblx0XHJcblx0aWYgbW9udGggPCAzXHJcblx0XHRtb250aCA9IDNcclxuXHRlbHNlIGlmIG1vbnRoIDwgNlxyXG5cdFx0bW9udGggPSA2XHJcblx0ZWxzZSBpZiBtb250aCA8IDlcclxuXHRcdG1vbnRoID0gOVxyXG5cdGVsc2VcclxuXHRcdHllYXIrK1xyXG5cdFx0bW9udGggPSAwXHJcblx0XHJcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxyXG5cclxuQ3JlYXRvci5nZXRNb250aERheXMgPSAoeWVhcixtb250aCktPlxyXG5cdGlmIG1vbnRoID09IDExXHJcblx0XHRyZXR1cm4gMzFcclxuXHRcclxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcclxuXHRzdGFydERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcclxuXHRlbmREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgrMSwgMSlcclxuXHRkYXlzID0gKGVuZERhdGUtc3RhcnREYXRlKS9taWxsaXNlY29uZFxyXG5cdHJldHVybiBkYXlzXHJcblxyXG5DcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5ID0gKHllYXIsIG1vbnRoKS0+XHJcblx0aWYgIXllYXJcclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcclxuXHRpZiAhbW9udGhcclxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXHJcblx0XHJcblx0IyDmnIjku73kuLow5Luj6KGo5pys5bm055qE56ys5LiA5pyIXHJcblx0aWYgbW9udGggPT0gMFxyXG5cdFx0bW9udGggPSAxMVxyXG5cdFx0eWVhci0tXHJcblx0XHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0XHJcblx0IyDlkKbliJks5Y+q5YeP5Y675pyI5Lu9XHJcblx0bW9udGgtLTtcclxuXHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0XHJcbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtID0gKGZpZWxkX3R5cGUsIGtleSktPlxyXG5cdCMg6L+H5ruk5ZmoYmV0d2Vlbui/kOeul+espu+8jOeOsOeul+aXpeacny/ml6XmnJ/ml7bpl7TnsbvlnovlrZfmrrXnmoR2YWx1ZXPlgLxcclxuXHRub3cgPSBuZXcgRGF0ZSgpXHJcblx0IyDkuIDlpKnnmoTmr6vnp5LmlbBcclxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcclxuXHR5ZXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxyXG5cdHRvbW9ycm93ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKVxyXG5cdCMg5LiA5ZGo5Lit55qE5p+Q5LiA5aSpXHJcblx0d2VlayA9IG5vdy5nZXREYXkoKVxyXG5cdCMg5YeP5Y6755qE5aSp5pWwXHJcblx0bWludXNEYXkgPSBpZiB3ZWVrICE9IDAgdGhlbiB3ZWVrIC0gMSBlbHNlIDZcclxuXHRtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKVxyXG5cdHN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOS4iuWRqOaXpVxyXG5cdGxhc3RTdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXHJcblx0IyDkuIrlkajkuIBcclxuXHRsYXN0TW9uZGF5ID0gbmV3IERhdGUobGFzdFN1bmRheS5nZXRUaW1lKCkgLSAobWlsbGlzZWNvbmQgKiA2KSlcclxuXHQjIOS4i+WRqOS4gFxyXG5cdG5leHRNb25kYXkgPSBuZXcgRGF0ZShzdW5kYXkuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpXHJcblx0IyDkuIvlkajml6VcclxuXHRuZXh0U3VuZGF5ID0gbmV3IERhdGUobmV4dE1vbmRheS5nZXRUaW1lKCkgKyAobWlsbGlzZWNvbmQgKiA2KSlcclxuXHRjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXHJcblx0cHJldmlvdXNZZWFyID0gY3VycmVudFllYXIgLSAxXHJcblx0bmV4dFllYXIgPSBjdXJyZW50WWVhciArIDFcclxuXHQjIOW9k+WJjeaciOS7vVxyXG5cdGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpXHJcblx0IyDorqHmlbDlubTjgIHmnIhcclxuXHR5ZWFyID0gbm93LmdldEZ1bGxZZWFyKClcclxuXHRtb250aCA9IG5vdy5nZXRNb250aCgpXHJcblx0IyDmnKzmnIjnrKzkuIDlpKlcclxuXHRmaXJzdERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aCwxKVxyXG5cclxuXHQjIOW9k+S4ujEy5pyI55qE5pe25YCZ5bm05Lu96ZyA6KaB5YqgMVxyXG5cdCMg5pyI5Lu96ZyA6KaB5pu05paw5Li6MCDkuZ/lsLHmmK/kuIvkuIDlubTnmoTnrKzkuIDkuKrmnIhcclxuXHRpZiBjdXJyZW50TW9udGggPT0gMTFcclxuXHRcdHllYXIrK1xyXG5cdFx0bW9udGgrK1xyXG5cdGVsc2VcclxuXHRcdG1vbnRoKytcclxuXHRcclxuXHQjIOS4i+aciOesrOS4gOWkqVxyXG5cdG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0IyDkuIvmnIjmnIDlkI7kuIDlpKlcclxuXHRuZXh0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKHllYXIsbW9udGgsQ3JlYXRvci5nZXRNb250aERheXMoeWVhcixtb250aCkpXHJcblx0IyDmnKzmnIjmnIDlkI7kuIDlpKlcclxuXHRsYXN0RGF5ID0gbmV3IERhdGUobmV4dE1vbnRoRmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXHJcblx0IyDkuIrmnIjnrKzkuIDlpKlcclxuXHRsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxyXG5cdCMg5LiK5pyI5pyA5ZCO5LiA5aSpXHJcblx0bGFzdE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZShmaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcclxuXHQjIOacrOWto+W6puW8gOWni+aXpVxyXG5cdHRoaXNRdWFydGVyU3RhcnREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCksMSlcclxuXHQjIOacrOWto+W6pue7k+adn+aXpVxyXG5cdHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIsQ3JlYXRvci5nZXRNb250aERheXMoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIpKVxyXG5cdCMg5LiK5a2j5bqm5byA5aeL5pelXHJcblx0bGFzdFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXHJcblx0IyDkuIrlraPluqbnu5PmnZ/ml6VcclxuXHRsYXN0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIpKVxyXG5cdCMg5LiL5a2j5bqm5byA5aeL5pelXHJcblx0bmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXHJcblx0IyDkuIvlraPluqbnu5PmnZ/ml6VcclxuXHRuZXh0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIpKVxyXG5cdCMg6L+H5Y67N+WkqSBcclxuXHRsYXN0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNiAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzMw5aSpXHJcblx0bGFzdF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgyOSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzYw5aSpXHJcblx0bGFzdF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg1OSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzkw5aSpXHJcblx0bGFzdF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg4OSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzEyMOWkqVxyXG5cdGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOacquadpTflpKkgXHJcblx0bmV4dF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaUzMOWkqVxyXG5cdG5leHRfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMjkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaU2MOWkqVxyXG5cdG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaU5MOWkqVxyXG5cdG5leHRfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoODkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaUxMjDlpKlcclxuXHRuZXh0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgxMTkgKiBtaWxsaXNlY29uZCkpXHJcblxyXG5cdHN3aXRjaCBrZXlcclxuXHRcdHdoZW4gXCJsYXN0X3llYXJcIlxyXG5cdFx0XHQj5Y675bm0XHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfeWVhclwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3ByZXZpb3VzWWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3ByZXZpb3VzWWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwidGhpc195ZWFyXCJcclxuXHRcdFx0I+S7iuW5tFxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3llYXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje2N1cnJlbnRZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0X3llYXJcIlxyXG5cdFx0XHQj5piO5bm0XHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfeWVhclwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje25leHRZZWFyfS0wMS0wMVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7bmV4dFllYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfcXVhcnRlclwiXHJcblx0XHRcdCPkuIrlraPluqZcclxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfcXVhcnRlclwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwidGhpc19xdWFydGVyXCJcclxuXHRcdFx0I+acrOWto+W6plxyXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19xdWFydGVyXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0X3F1YXJ0ZXJcIlxyXG5cdFx0XHQj5LiL5a2j5bqmXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3F1YXJ0ZXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfbW9udGhcIlxyXG5cdFx0XHQj5LiK5pyIXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9tb250aFwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwidGhpc19tb250aFwiXHJcblx0XHRcdCPmnKzmnIhcclxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQoZmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfbW9udGhcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfbW9udGhcIlxyXG5cdFx0XHQj5LiL5pyIXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9tb250aFwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibGFzdF93ZWVrXCJcclxuXHRcdFx0I+S4iuWRqFxyXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobGFzdE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobGFzdFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3dlZWtcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRoaXNfd2Vla1wiXHJcblx0XHRcdCPmnKzlkahcclxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KG1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQoc3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfd2Vla1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ck1vbmRheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN1bmRheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF93ZWVrXCJcclxuXHRcdFx0I+S4i+WRqFxyXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobmV4dE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3dlZWtcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInllc3RkYXlcIlxyXG5cdFx0XHQj5pio5aSpXHJcblx0XHRcdHN0clllc3RkYXkgPSBtb21lbnQoeWVzdGRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl95ZXN0ZGF5XCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyWWVzdGRheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clllc3RkYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRvZGF5XCJcclxuXHRcdFx0I+S7iuWkqVxyXG5cdFx0XHRzdHJUb2RheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9kYXlcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb2RheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvZGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJ0b21vcnJvd1wiXHJcblx0XHRcdCPmmI7lpKlcclxuXHRcdFx0c3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9tb3Jyb3dcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb21vcnJvd31UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvbW9ycm93fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0XzdfZGF5c1wiXHJcblx0XHRcdCPov4fljrs35aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpIFxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfN19kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfMzBfZGF5c1wiXHJcblx0XHRcdCPov4fljrszMOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzMwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibGFzdF82MF9kYXlzXCJcclxuXHRcdFx0I+i/h+WOuzYw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfNjBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0XzkwX2RheXNcIlxyXG5cdFx0XHQj6L+H5Y67OTDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF85MF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfMTIwX2RheXNcIlxyXG5cdFx0XHQj6L+H5Y67MTIw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfN19kYXlzXCJcclxuXHRcdFx0I+acquadpTflpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzdfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0XzMwX2RheXNcIlxyXG5cdFx0XHQj5pyq5p2lMzDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8zMF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfNjBfZGF5c1wiXHJcblx0XHRcdCPmnKrmnaU2MOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzYwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF85MF9kYXlzXCJcclxuXHRcdFx0I+acquadpTkw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfOTBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0XzEyMF9kYXlzXCJcclxuXHRcdFx0I+acquadpTEyMOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8xMjBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcclxuXHR2YWx1ZXMgPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdXHJcblx0aWYgZmllbGRfdHlwZSA9PSBcImRhdGV0aW1lXCJcclxuXHRcdCMg5pe26Ze057G75Z6L5a2X5q6177yM5YaF572u5pe26Ze06IyD5Zu05bqU6K+l6ICD6JmR5YGP56e75pe25Yy65YC877yM5ZCm5YiZ6L+H5ruk5pWw5o2u5a2Y5Zyo5YGP5beuXHJcblx0XHQjIOmdnuWGhee9ruaXtumXtOiMg+WbtOaXtu+8jOeUqOaIt+mAmui/h+aXtumXtOaOp+S7tumAieaLqeeahOiMg+WbtO+8jOS8muiHquWKqOWkhOeQhuaXtuWMuuWBj+W3ruaDheWGtVxyXG5cdFx0IyDml6XmnJ/nsbvlnovlrZfmrrXvvIzmlbDmja7lupPmnKzmnaXlsLHlrZjnmoTmmK9VVEPnmoQw54K577yM5LiN5a2Y5Zyo5YGP5beuXHJcblx0XHRfLmZvckVhY2ggdmFsdWVzLCAoZnYpLT5cclxuXHRcdFx0aWYgZnZcclxuXHRcdFx0XHRmdi5zZXRIb3Vycyhmdi5nZXRIb3VycygpICsgZnYuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwIClcclxuXHRcclxuXHRyZXR1cm4ge1xyXG5cdFx0bGFiZWw6IGxhYmVsXHJcblx0XHRrZXk6IGtleVxyXG5cdFx0dmFsdWVzOiB2YWx1ZXNcclxuXHR9XHJcblxyXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IChmaWVsZF90eXBlKS0+XHJcblx0aWYgZmllbGRfdHlwZSAmJiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKVxyXG5cdFx0cmV0dXJuICdiZXR3ZWVuJ1xyXG5cdGVsc2UgaWYgW1widGV4dGFyZWFcIiwgXCJ0ZXh0XCIsIFwiY29kZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxyXG5cdFx0cmV0dXJuICdjb250YWlucydcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gXCI9XCJcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRPcGVyYXRpb24gPSAoZmllbGRfdHlwZSkgLT5cclxuXHQjIOaXpeacn+exu+WeizogZGF0ZSwgZGF0ZXRpbWUgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxyXG5cdCMg5paH5pys57G75Z6LOiB0ZXh0LCB0ZXh0YXJlYSwgaHRtbCAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiLCBcImNvbnRhaW5zXCIsIFwibm90Y29udGFpbnNcIiwgXCJzdGFydHN3aXRoXCJcclxuXHQjIOmAieaLqeexu+WeizogbG9va3VwLCBtYXN0ZXJfZGV0YWlsLCBzZWxlY3Qg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXHJcblx0IyDmlbDlgLznsbvlnos6IGN1cnJlbmN5LCBudW1iZXIgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxyXG5cdCMg5biD5bCU57G75Z6LOiBib29sZWFuICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcclxuXHQjIOaVsOe7hOexu+WeizogY2hlY2tib3gsIFt0ZXh0XSAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXHJcblxyXG5cdG9wdGlvbmFscyA9IHtcclxuXHRcdGVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZXF1YWxcIiksIHZhbHVlOiBcIj1cIn0sXHJcblx0XHR1bmVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fdW5lcXVhbFwiKSwgdmFsdWU6IFwiPD5cIn0sXHJcblx0XHRsZXNzX3RoYW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX3RoYW5cIiksIHZhbHVlOiBcIjxcIn0sXHJcblx0XHRncmVhdGVyX3RoYW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX3RoYW5cIiksIHZhbHVlOiBcIj5cIn0sXHJcblx0XHRsZXNzX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc19vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPD1cIn0sXHJcblx0XHRncmVhdGVyX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl9vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPj1cIn0sXHJcblx0XHRjb250YWluczoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2NvbnRhaW5zXCIpLCB2YWx1ZTogXCJjb250YWluc1wifSxcclxuXHRcdG5vdF9jb250YWluOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZG9lc19ub3RfY29udGFpblwiKSwgdmFsdWU6IFwibm90Y29udGFpbnNcIn0sXHJcblx0XHRzdGFydHNfd2l0aDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3N0YXJ0c193aXRoXCIpLCB2YWx1ZTogXCJzdGFydHN3aXRoXCJ9LFxyXG5cdFx0YmV0d2Vlbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5cIiksIHZhbHVlOiBcImJldHdlZW5cIn0sXHJcblx0fVxyXG5cclxuXHRpZiBmaWVsZF90eXBlID09IHVuZGVmaW5lZFxyXG5cdFx0cmV0dXJuIF8udmFsdWVzKG9wdGlvbmFscylcclxuXHJcblx0b3BlcmF0aW9ucyA9IFtdXHJcblxyXG5cdGlmIENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmJldHdlZW4pXHJcblx0XHRDcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyhmaWVsZF90eXBlLCBvcGVyYXRpb25zKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcInRleHRcIiBvciBmaWVsZF90eXBlID09IFwidGV4dGFyZWFcIiBvciBmaWVsZF90eXBlID09IFwiaHRtbFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJjb2RlXCJcclxuI1x0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmNvbnRhaW5zLCBvcHRpb25hbHMubm90X2NvbnRhaW4sIG9wdGlvbmFscy5zdGFydHNfd2l0aClcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuY29udGFpbnMpXHJcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwibG9va3VwXCIgb3IgZmllbGRfdHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiBvciBmaWVsZF90eXBlID09IFwic2VsZWN0XCJcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImN1cnJlbmN5XCIgb3IgZmllbGRfdHlwZSA9PSBcIm51bWJlclwiXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmxlc3NfdGhhbiwgb3B0aW9uYWxzLmdyZWF0ZXJfdGhhbiwgb3B0aW9uYWxzLmxlc3Nfb3JfZXF1YWwsIG9wdGlvbmFscy5ncmVhdGVyX29yX2VxdWFsKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImJvb2xlYW5cIlxyXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXHJcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiY2hlY2tib3hcIlxyXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXHJcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiW3RleHRdXCJcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cdGVsc2VcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cclxuXHRyZXR1cm4gb3BlcmF0aW9uc1xyXG5cclxuIyMjXHJcbiAgICDlhYjmjInnhafmnInmjpLluo/lj7fnmoTlsI/nmoTlnKjliY3vvIzlpKfnmoTlnKjlkI5cclxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lID0gKG9iamVjdF9uYW1lKS0+XHJcblx0ZmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5maWVsZHNcclxuXHRmaWVsZHNBcnIgPSBbXVxyXG5cclxuXHRfLmVhY2ggZmllbGRzLCAoZmllbGQpLT5cclxuXHRcdGZpZWxkc0Fyci5wdXNoIHtuYW1lOiBmaWVsZC5uYW1lLCBzb3J0X25vOiBmaWVsZC5zb3J0X25vfVxyXG5cclxuXHRmaWVsZHNOYW1lID0gW11cclxuXHRfLmVhY2ggXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIChmaWVsZCktPlxyXG5cdFx0ZmllbGRzTmFtZS5wdXNoKGZpZWxkLm5hbWUpXHJcblx0cmV0dXJuIGZpZWxkc05hbWVcclxuIiwiQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIGZpZWxkc0Fyciwgc2NoZW1hO1xuICBzY2hlbWEgPSB7fTtcbiAgZmllbGRzQXJyID0gW107XG4gIF8uZWFjaChvYmouZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmICghXy5oYXMoZmllbGQsIFwibmFtZVwiKSkge1xuICAgICAgZmllbGQubmFtZSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHNBcnIucHVzaChmaWVsZCk7XG4gIH0pO1xuICBfLmVhY2goXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgdmFyIF9vYmplY3QsIF9yZWZfb2JqLCBfcmVmZXJlbmNlX3RvLCBhdXRvZm9ybV90eXBlLCBmaWVsZF9uYW1lLCBmcywgaXNVbkxpbWl0ZWQsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjM7XG4gICAgZmllbGRfbmFtZSA9IGZpZWxkLm5hbWU7XG4gICAgZnMgPSB7fTtcbiAgICBpZiAoZmllbGQucmVnRXgpIHtcbiAgICAgIGZzLnJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgfVxuICAgIGZzLmF1dG9mb3JtID0ge307XG4gICAgZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZTtcbiAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgYXV0b2Zvcm1fdHlwZSA9IChyZWYgPSBmaWVsZC5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwO1xuICAgIGlmIChmaWVsZC50eXBlID09PSBcInRleHRcIiB8fCBmaWVsZC50eXBlID09PSBcInBob25lXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIlt0ZXh0XVwiIHx8IGZpZWxkLnR5cGUgPT09IFwiW3Bob25lXVwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnY29kZScpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTI7XG4gICAgICBpZiAoZmllbGQubGFuZ3VhZ2UpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCI7XG4gICAgICBmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAyO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJwYXNzd29yZFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5vdXRGb3JtYXQgPSAneXl5eS1NTS1kZCc7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgdGltZXpvbmVJZDogXCJ1dGNcIixcbiAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJbT2JqZWN0XVwiKSB7XG4gICAgICBmcy50eXBlID0gW09iamVjdF07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImh0bWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgdHlwZTogXCJzdW1tZXJub3RlXCIsXG4gICAgICAgIFwiY2xhc3NcIjogJ3N1bW1lcm5vdGUtZWRpdG9yJyxcbiAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgICAgICBkaWFsb2dzSW5Cb2R5OiB0cnVlLFxuICAgICAgICAgIHRvb2xiYXI6IFtbJ2ZvbnQxJywgWydzdHlsZSddXSwgWydmb250MicsIFsnYm9sZCcsICd1bmRlcmxpbmUnLCAnaXRhbGljJywgJ2NsZWFyJ11dLCBbJ2ZvbnQzJywgWydmb250bmFtZSddXSwgWydjb2xvcicsIFsnY29sb3InXV0sIFsncGFyYScsIFsndWwnLCAnb2wnLCAncGFyYWdyYXBoJ11dLCBbJ3RhYmxlJywgWyd0YWJsZSddXSwgWydpbnNlcnQnLCBbJ2xpbmsnLCAncGljdHVyZSddXSwgWyd2aWV3JywgWydjb2RldmlldyddXV0sXG4gICAgICAgICAgZm9udE5hbWVzOiBbJ0FyaWFsJywgJ0NvbWljIFNhbnMgTVMnLCAnQ291cmllciBOZXcnLCAnSGVsdmV0aWNhJywgJ0ltcGFjdCcsICflrovkvZMnLCAn6buR5L2TJywgJ+W+rui9r+mbhem7kScsICfku7/lrosnLCAn5qW35L2TJywgJ+matuS5picsICflubzlnIYnXSxcbiAgICAgICAgICBsYW5nOiAnemgtQ04nXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImxvb2t1cFwiIHx8IGZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmaWVsZC5zaG93SWNvbjtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICB9XG4gICAgICBpZiAoIWZpZWxkLmhpZGRlbikge1xuICAgICAgICBmcy5hdXRvZm9ybS5maWx0ZXJzID0gZmllbGQuZmlsdGVycztcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVwZW5kT24gPSBmaWVsZC5kZXBlbmRfb247XG4gICAgICAgIGlmIChmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb24pIHtcbiAgICAgICAgICBmcy5iZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgZnMuZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uID8gZmllbGQuZmlsdGVyc0Z1bmN0aW9uIDogQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnM7XG4gICAgICAgIGlmIChmaWVsZC5vcHRpb25zRnVuY3Rpb24pIHtcbiAgICAgICAgICBmcy5vcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV90bykge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgIGlmIChmaWVsZC5jcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmllbGQuY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgICAgICAgIGZzLmNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb247XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoXy5pc1N0cmluZyhmaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgX3JlZl9vYmogPSBDcmVhdG9yLk9iamVjdHNbZmllbGQucmVmZXJlbmNlX3RvXTtcbiAgICAgICAgICAgICAgICBpZiAoX3JlZl9vYmogIT0gbnVsbCA/IChyZWYxID0gX3JlZl9vYmoucGVybWlzc2lvbnMpICE9IG51bGwgPyByZWYxLmFsbG93Q3JlYXRlIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgZnMuY3JlYXRlRnVuY3Rpb24gPSBmdW5jdGlvbihsb29rdXBfZmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1vZGFsLnNob3coXCJDcmVhdG9yT2JqZWN0TW9kYWxcIiwge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IFwiQ3JlYXRvci5Db2xsZWN0aW9ucy5cIiArIChDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvKS5fbmFtZSksXG4gICAgICAgICAgICAgICAgICAgICAgZm9ybUlkOiBcIm5ld1wiICsgKGZpZWxkLnJlZmVyZW5jZV90by5yZXBsYWNlKCcuJywgJ18nKSksXG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IFwiXCIgKyBmaWVsZC5yZWZlcmVuY2VfdG8sXG4gICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImluc2VydFwiLFxuICAgICAgICAgICAgICAgICAgICAgIG9uU3VjY2VzczogZnVuY3Rpb24ob3BlcmF0aW9uLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZXN1bHQub2JqZWN0X25hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5vYmplY3RfbmFtZSA9PT0gXCJvYmplY3RzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHJlc3VsdC52YWx1ZS5sYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQudmFsdWUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246IHJlc3VsdC52YWx1ZS5pY29uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLCByZXN1bHQudmFsdWUubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogcmVzdWx0LnZhbHVlW29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gfHwgcmVzdWx0LnZhbHVlLmxhYmVsIHx8IHJlc3VsdC52YWx1ZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC5faWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sIHJlc3VsdC5faWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKF8uaXNCb29sZWFuKGZpZWxkLmNyZWF0ZSkpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZpZWxkLmNyZWF0ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV9zb3J0KSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zU29ydCA9IGZpZWxkLnJlZmVyZW5jZV9zb3J0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX2xpbWl0KSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTGltaXQgPSBmaWVsZC5yZWZlcmVuY2VfbGltaXQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwidXNlcnNcIikge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0dXNlclwiO1xuICAgICAgICAgICAgaWYgKCFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXQpIHtcbiAgICAgICAgICAgICAgaWYgKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSAocmVmMiA9IG9iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjIuZ2V0KCkgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGlzVW5MaW1pdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwib3JnYW5pemF0aW9uc1wiKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RvcmdcIjtcbiAgICAgICAgICAgIGlmICghZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0KSB7XG4gICAgICAgICAgICAgIGlmIChmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gKHJlZjMgPSBvYmoucGVybWlzc2lvbnMpICE9IG51bGwgPyByZWYzLmdldCgpIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChpc1VuTGltaXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNGdW5jdGlvbihmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG8oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXy5pc0FycmF5KF9yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgIGZzLnR5cGUgPSBPYmplY3Q7XG4gICAgICAgICAgICAgIGZzLmJsYWNrYm94ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub2JqZWN0U3dpdGNoZSA9IHRydWU7XG4gICAgICAgICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIub1wiXSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgICAgICAgIG9taXQ6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuaWRzXCJdID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFtTdHJpbmddLFxuICAgICAgICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICAgICAgICBvbWl0OiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IFtfcmVmZXJlbmNlX3RvXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV90b1swXV07XG4gICAgICAgICAgICBpZiAoX29iamVjdCAmJiBfb2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFRyZWVcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2QgPSBmaWVsZC5vcHRpb25zTWV0aG9kIHx8IFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiO1xuICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZFBhcmFtcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvLmZvckVhY2goZnVuY3Rpb24oX3JlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlXTtcbiAgICAgICAgICAgICAgICAgIGlmIChfb2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogX3JlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogX29iamVjdCAhPSBudWxsID8gX29iamVjdC5sYWJlbCA6IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgICBpY29uOiBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIvYXBwL1wiICsgKFNlc3Npb24uZ2V0KCdhcHBfaWQnKSkgKyBcIi9cIiArIF9yZWZlcmVuY2UgKyBcIi92aWV3L1wiO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IF9yZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIvYXBwL1wiICsgKFNlc3Npb24uZ2V0KCdhcHBfaWQnKSkgKyBcIi9cIiArIF9yZWZlcmVuY2UgKyBcIi92aWV3L1wiO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0SWNvbiA9IGZpZWxkLmRlZmF1bHRJY29uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmYWxzZTtcbiAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RcIjtcbiAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICAgIGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gXCJcIjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiY3VycmVuY3lcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZTtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApICE9PSAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gMjtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4O1xuICAgICAgaWYgKGZpZWxkICE9IG51bGwgPyBmaWVsZC5zY2FsZSA6IHZvaWQgMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlO1xuICAgICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICBmcy50eXBlID0gQm9vbGVhbjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi1jaGVja2JveFwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJyZWZlcmVuY2VcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0LWNoZWNrYm94XCI7XG4gICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZmlsZVwiICYmIGZpZWxkLmNvbGxlY3Rpb24pIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogZmllbGQuY29sbGVjdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSBmaWVsZC5jb2xsZWN0aW9uO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJmaWxlc2l6ZVwiKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlc2l6ZSc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIk9iamVjdFwiIHx8IGZpZWxkLnR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBPYmplY3Q7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImdyaWRcIikge1xuICAgICAgZnMudHlwZSA9IEFycmF5O1xuICAgICAgZnMuYXV0b2Zvcm0uZWRpdGFibGUgPSB0cnVlO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0dyaWRcIjtcbiAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgdHlwZTogT2JqZWN0XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJpbWFnZVwiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICdpbWFnZXMnLFxuICAgICAgICAgICAgYWNjZXB0OiAnaW1hZ2UvKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2ltYWdlcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYXZhdGFyXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2F2YXRhcnMnLFxuICAgICAgICAgICAgYWNjZXB0OiAnaW1hZ2UvKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F2YXRhcnMnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImF1ZGlvXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2F1ZGlvcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdhdWRpby8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXVkaW9zJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2F1ZGlvLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJ2aWRlb1wiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICd2aWRlb3MnLFxuICAgICAgICAgICAgYWNjZXB0OiAndmlkZW8vKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ3ZpZGVvcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICd2aWRlby8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibG9jYXRpb25cIikge1xuICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcImxvY2F0aW9uXCI7XG4gICAgICBmcy5hdXRvZm9ybS5zeXN0ZW0gPSBmaWVsZC5zeXN0ZW0gfHwgXCJ3Z3M4NFwiO1xuICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJtYXJrZG93blwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1tYXJrZG93blwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3VybCcpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NVcmwnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2VtYWlsJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zRW1haWwnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2F1dG9udW1iZXInKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcy50eXBlID0gZmllbGQudHlwZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmxhYmVsKSB7XG4gICAgICBmcy5sYWJlbCA9IGZpZWxkLmxhYmVsO1xuICAgIH1cbiAgICBpZiAoIWZpZWxkLnJlcXVpcmVkKSB7XG4gICAgICBmcy5vcHRpb25hbCA9IHRydWU7XG4gICAgfVxuICAgIGlmICghTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmcy5vcHRpb25hbCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC51bmlxdWUpIHtcbiAgICAgIGZzLnVuaXF1ZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5vbWl0KSB7XG4gICAgICBmcy5hdXRvZm9ybS5vbWl0ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmdyb3VwKSB7XG4gICAgICBmcy5hdXRvZm9ybS5ncm91cCA9IGZpZWxkLmdyb3VwO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaXNfd2lkZSkge1xuICAgICAgZnMuYXV0b2Zvcm0uaXNfd2lkZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5oaWRkZW4pIHtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcImhpZGRlblwiO1xuICAgIH1cbiAgICBpZiAoKGZpZWxkLnR5cGUgPT09IFwic2VsZWN0XCIpIHx8IChmaWVsZC50eXBlID09PSBcImxvb2t1cFwiKSB8fCAoZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpKSB7XG4gICAgICBpZiAodHlwZW9mIGZpZWxkLmZpbHRlcmFibGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmllbGQubmFtZSA9PT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgZmllbGQuc2VhcmNoYWJsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmllbGQuc2VhcmNoYWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChhdXRvZm9ybV90eXBlKSB7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gYXV0b2Zvcm1fdHlwZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmRlZmF1bHRWYWx1ZSkge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmaWVsZC5kZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmaWVsZC5kZWZhdWx0VmFsdWUsIHtcbiAgICAgICAgICAgIHVzZXJJZDogTWV0ZW9yLnVzZXJJZCgpLFxuICAgICAgICAgICAgc3BhY2VJZDogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKGZpZWxkLmRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgICBmcy5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpZWxkLnJlYWRvbmx5KSB7XG4gICAgICBmcy5hdXRvZm9ybS5yZWFkb25seSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5kaXNhYmxlZCkge1xuICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaW5saW5lSGVscFRleHQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmlubGluZUhlbHBUZXh0ID0gZmllbGQuaW5saW5lSGVscFRleHQ7XG4gICAgfVxuICAgIGlmIChmaWVsZC5ibGFja2JveCkge1xuICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoXy5oYXMoZmllbGQsICdtaW4nKSkge1xuICAgICAgZnMubWluID0gZmllbGQubWluO1xuICAgIH1cbiAgICBpZiAoXy5oYXMoZmllbGQsICdtYXgnKSkge1xuICAgICAgZnMubWF4ID0gZmllbGQubWF4O1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzUHJvZHVjdGlvbikge1xuICAgICAgaWYgKGZpZWxkLmluZGV4KSB7XG4gICAgICAgIGZzLmluZGV4ID0gZmllbGQuaW5kZXg7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkLnNvcnRhYmxlKSB7XG4gICAgICAgIGZzLmluZGV4ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNjaGVtYVtmaWVsZF9uYW1lXSA9IGZzO1xuICB9KTtcbiAgcmV0dXJuIHNjaGVtYTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGREaXNwbGF5VmFsdWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGRfdmFsdWUpIHtcbiAgdmFyIGZpZWxkLCBodG1sLCBvYmplY3Q7XG4gIGh0bWwgPSBmaWVsZF92YWx1ZTtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG4gIGZpZWxkID0gb2JqZWN0LmZpZWxkcyhmaWVsZF9uYW1lKTtcbiAgaWYgKCFmaWVsZCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG4gIGlmIChmaWVsZC50eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICBodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQgSDptbScpO1xuICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgaHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gIH1cbiAgcmV0dXJuIGh0bWw7XG59O1xuXG5DcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgcmV0dXJuIFtcImRhdGVcIiwgXCJkYXRldGltZVwiLCBcImN1cnJlbmN5XCIsIFwibnVtYmVyXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpO1xufTtcblxuQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMgPSBmdW5jdGlvbihmaWVsZF90eXBlLCBvcGVyYXRpb25zKSB7XG4gIHZhciBidWlsdGluVmFsdWVzO1xuICBidWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKTtcbiAgaWYgKGJ1aWx0aW5WYWx1ZXMpIHtcbiAgICByZXR1cm4gXy5mb3JFYWNoKGJ1aWx0aW5WYWx1ZXMsIGZ1bmN0aW9uKGJ1aWx0aW5JdGVtLCBrZXkpIHtcbiAgICAgIHJldHVybiBvcGVyYXRpb25zLnB1c2goe1xuICAgICAgICBsYWJlbDogYnVpbHRpbkl0ZW0ubGFiZWwsXG4gICAgICAgIHZhbHVlOiBrZXlcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgaXNfY2hlY2tfb25seSkge1xuICBpZiAoW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtID0gZnVuY3Rpb24oZmllbGRfdHlwZSwga2V5KSB7XG4gIGlmIChbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwga2V5KTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpbk9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIHZhbHVlKSB7XG4gIHZhciBiZXR3ZWVuQnVpbHRpblZhbHVlcywgcmVzdWx0O1xuICBpZiAoIV8uaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGJldHdlZW5CdWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKTtcbiAgaWYgKCFiZXR3ZWVuQnVpbHRpblZhbHVlcykge1xuICAgIHJldHVybjtcbiAgfVxuICByZXN1bHQgPSBudWxsO1xuICBfLmVhY2goYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIGZ1bmN0aW9uKGl0ZW0sIG9wZXJhdGlvbikge1xuICAgIGlmIChpdGVtLmtleSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiByZXN1bHQgPSBvcGVyYXRpb247XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzID0gZnVuY3Rpb24oaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSkge1xuICByZXR1cm4ge1xuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF95ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc195ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF95ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc19tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3Rfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF93ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc193ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF93ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3llc3RkYXlcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInllc3RkYXlcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdG9kYXlcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvZGF5XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RvbW9ycm93XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b21vcnJvd1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzdfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF83X2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF8zMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzMwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF82MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzYwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF85MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzkwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF8xMjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8xMjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzdfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF83X2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF8zMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzMwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF82MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzYwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF85MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzkwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF8xMjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8xMjBfZGF5c1wiKVxuICB9O1xufTtcblxuQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aCA9IGZ1bmN0aW9uKG1vbnRoKSB7XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgcmV0dXJuIDM7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgcmV0dXJuIDY7XG4gIH1cbiAgcmV0dXJuIDk7XG59O1xuXG5DcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgeWVhci0tO1xuICAgIG1vbnRoID0gOTtcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICBtb250aCA9IDA7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgbW9udGggPSAzO1xuICB9IGVsc2Uge1xuICAgIG1vbnRoID0gNjtcbiAgfVxuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIG1vbnRoID0gMztcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICBtb250aCA9IDY7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgbW9udGggPSA5O1xuICB9IGVsc2Uge1xuICAgIHllYXIrKztcbiAgICBtb250aCA9IDA7XG4gIH1cbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0TW9udGhEYXlzID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgdmFyIGRheXMsIGVuZERhdGUsIG1pbGxpc2Vjb25kLCBzdGFydERhdGU7XG4gIGlmIChtb250aCA9PT0gMTEpIHtcbiAgICByZXR1cm4gMzE7XG4gIH1cbiAgbWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuICBzdGFydERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIGVuZERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIDEpO1xuICBkYXlzID0gKGVuZERhdGUgLSBzdGFydERhdGUpIC8gbWlsbGlzZWNvbmQ7XG4gIHJldHVybiBkYXlzO1xufTtcblxuQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA9PT0gMCkge1xuICAgIG1vbnRoID0gMTE7XG4gICAgeWVhci0tO1xuICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIH1cbiAgbW9udGgtLTtcbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtID0gZnVuY3Rpb24oZmllbGRfdHlwZSwga2V5KSB7XG4gIHZhciBjdXJyZW50TW9udGgsIGN1cnJlbnRZZWFyLCBlbmRWYWx1ZSwgZmlyc3REYXksIGxhYmVsLCBsYXN0RGF5LCBsYXN0TW9uZGF5LCBsYXN0TW9udGhGaW5hbERheSwgbGFzdE1vbnRoRmlyc3REYXksIGxhc3RRdWFydGVyRW5kRGF5LCBsYXN0UXVhcnRlclN0YXJ0RGF5LCBsYXN0U3VuZGF5LCBsYXN0XzEyMF9kYXlzLCBsYXN0XzMwX2RheXMsIGxhc3RfNjBfZGF5cywgbGFzdF83X2RheXMsIGxhc3RfOTBfZGF5cywgbWlsbGlzZWNvbmQsIG1pbnVzRGF5LCBtb25kYXksIG1vbnRoLCBuZXh0TW9uZGF5LCBuZXh0TW9udGhGaW5hbERheSwgbmV4dE1vbnRoRmlyc3REYXksIG5leHRRdWFydGVyRW5kRGF5LCBuZXh0UXVhcnRlclN0YXJ0RGF5LCBuZXh0U3VuZGF5LCBuZXh0WWVhciwgbmV4dF8xMjBfZGF5cywgbmV4dF8zMF9kYXlzLCBuZXh0XzYwX2RheXMsIG5leHRfN19kYXlzLCBuZXh0XzkwX2RheXMsIG5vdywgcHJldmlvdXNZZWFyLCBzdGFydFZhbHVlLCBzdHJFbmREYXksIHN0ckZpcnN0RGF5LCBzdHJMYXN0RGF5LCBzdHJNb25kYXksIHN0clN0YXJ0RGF5LCBzdHJTdW5kYXksIHN0clRvZGF5LCBzdHJUb21vcnJvdywgc3RyWWVzdGRheSwgc3VuZGF5LCB0aGlzUXVhcnRlckVuZERheSwgdGhpc1F1YXJ0ZXJTdGFydERheSwgdG9tb3Jyb3csIHZhbHVlcywgd2VlaywgeWVhciwgeWVzdGRheTtcbiAgbm93ID0gbmV3IERhdGUoKTtcbiAgbWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuICB5ZXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgdG9tb3Jyb3cgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpO1xuICB3ZWVrID0gbm93LmdldERheSgpO1xuICBtaW51c0RheSA9IHdlZWsgIT09IDAgPyB3ZWVrIC0gMSA6IDY7XG4gIG1vbmRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAobWludXNEYXkgKiBtaWxsaXNlY29uZCkpO1xuICBzdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0U3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgbGFzdE1vbmRheSA9IG5ldyBEYXRlKGxhc3RTdW5kYXkuZ2V0VGltZSgpIC0gKG1pbGxpc2Vjb25kICogNikpO1xuICBuZXh0TW9uZGF5ID0gbmV3IERhdGUoc3VuZGF5LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKTtcbiAgbmV4dFN1bmRheSA9IG5ldyBEYXRlKG5leHRNb25kYXkuZ2V0VGltZSgpICsgKG1pbGxpc2Vjb25kICogNikpO1xuICBjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBwcmV2aW91c1llYXIgPSBjdXJyZW50WWVhciAtIDE7XG4gIG5leHRZZWFyID0gY3VycmVudFllYXIgKyAxO1xuICBjdXJyZW50TW9udGggPSBub3cuZ2V0TW9udGgoKTtcbiAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBtb250aCA9IG5vdy5nZXRNb250aCgpO1xuICBmaXJzdERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgsIDEpO1xuICBpZiAoY3VycmVudE1vbnRoID09PSAxMSkge1xuICAgIHllYXIrKztcbiAgICBtb250aCsrO1xuICB9IGVsc2Uge1xuICAgIG1vbnRoKys7XG4gIH1cbiAgbmV4dE1vbnRoRmlyc3REYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIG5leHRNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIENyZWF0b3IuZ2V0TW9udGhEYXlzKHllYXIsIG1vbnRoKSk7XG4gIGxhc3REYXkgPSBuZXcgRGF0ZShuZXh0TW9udGhGaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIGxhc3RNb250aEZpcnN0RGF5ID0gQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbGFzdE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZShmaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIHRoaXNRdWFydGVyU3RhcnREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpLCAxKTtcbiAgdGhpc1F1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSArIDIpKTtcbiAgbGFzdFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbGFzdFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMikpO1xuICBuZXh0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBuZXh0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyKSk7XG4gIGxhc3RfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgyOSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNTkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDg5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMTE5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDI5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg1OSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoODkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgxMTkgKiBtaWxsaXNlY29uZCkpO1xuICBzd2l0Y2ggKGtleSkge1xuICAgIGNhc2UgXCJsYXN0X3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShwcmV2aW91c1llYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHByZXZpb3VzWWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShjdXJyZW50WWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoY3VycmVudFllYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF95ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUobmV4dFllYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKG5leHRZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc19xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc19tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQoZmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChuZXh0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF93ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobGFzdE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChsYXN0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF93ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KG1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChzdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF93ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobmV4dE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChuZXh0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF93ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInllc3RkYXlcIjpcbiAgICAgIHN0clllc3RkYXkgPSBtb21lbnQoeWVzdGRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3llc3RkYXlcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyWWVzdGRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyWWVzdGRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0b2RheVwiOlxuICAgICAgc3RyVG9kYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9kYXlcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyVG9kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRvbW9ycm93XCI6XG4gICAgICBzdHJUb21vcnJvdyA9IG1vbWVudCh0b21vcnJvdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvbW9ycm93XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvbW9ycm93ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJUb21vcnJvdyArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzdfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF83X2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzMwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzMwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzYwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzYwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzkwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzkwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzEyMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMTIwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzdfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF83X2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzMwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzMwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzYwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzYwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzkwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzkwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzEyMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMTIwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgfVxuICB2YWx1ZXMgPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdO1xuICBpZiAoZmllbGRfdHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgXy5mb3JFYWNoKHZhbHVlcywgZnVuY3Rpb24oZnYpIHtcbiAgICAgIGlmIChmdikge1xuICAgICAgICByZXR1cm4gZnYuc2V0SG91cnMoZnYuZ2V0SG91cnMoKSArIGZ2LmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBsYWJlbDogbGFiZWwsXG4gICAga2V5OiBrZXksXG4gICAgdmFsdWVzOiB2YWx1ZXNcbiAgfTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGREZWZhdWx0T3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSkge1xuICBpZiAoZmllbGRfdHlwZSAmJiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiAnYmV0d2Vlbic7XG4gIH0gZWxzZSBpZiAoW1widGV4dGFyZWFcIiwgXCJ0ZXh0XCIsIFwiY29kZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiAnY29udGFpbnMnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBcIj1cIjtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRGaWVsZE9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgdmFyIG9wZXJhdGlvbnMsIG9wdGlvbmFscztcbiAgb3B0aW9uYWxzID0ge1xuICAgIGVxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIj1cIlxuICAgIH0sXG4gICAgdW5lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fdW5lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIjw+XCJcbiAgICB9LFxuICAgIGxlc3NfdGhhbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc190aGFuXCIpLFxuICAgICAgdmFsdWU6IFwiPFwiXG4gICAgfSxcbiAgICBncmVhdGVyX3RoYW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfdGhhblwiKSxcbiAgICAgIHZhbHVlOiBcIj5cIlxuICAgIH0sXG4gICAgbGVzc19vcl9lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc19vcl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIjw9XCJcbiAgICB9LFxuICAgIGdyZWF0ZXJfb3JfZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfb3JfZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI+PVwiXG4gICAgfSxcbiAgICBjb250YWluczoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fY29udGFpbnNcIiksXG4gICAgICB2YWx1ZTogXCJjb250YWluc1wiXG4gICAgfSxcbiAgICBub3RfY29udGFpbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZG9lc19ub3RfY29udGFpblwiKSxcbiAgICAgIHZhbHVlOiBcIm5vdGNvbnRhaW5zXCJcbiAgICB9LFxuICAgIHN0YXJ0c193aXRoOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9zdGFydHNfd2l0aFwiKSxcbiAgICAgIHZhbHVlOiBcInN0YXJ0c3dpdGhcIlxuICAgIH0sXG4gICAgYmV0d2Vlbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2VlblwiKSxcbiAgICAgIHZhbHVlOiBcImJldHdlZW5cIlxuICAgIH1cbiAgfTtcbiAgaWYgKGZpZWxkX3R5cGUgPT09IHZvaWQgMCkge1xuICAgIHJldHVybiBfLnZhbHVlcyhvcHRpb25hbHMpO1xuICB9XG4gIG9wZXJhdGlvbnMgPSBbXTtcbiAgaWYgKENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5iZXR3ZWVuKTtcbiAgICBDcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyhmaWVsZF90eXBlLCBvcGVyYXRpb25zKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcInRleHRcIiB8fCBmaWVsZF90eXBlID09PSBcInRleHRhcmVhXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJodG1sXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJjb2RlXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmNvbnRhaW5zKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImxvb2t1cFwiIHx8IGZpZWxkX3R5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiIHx8IGZpZWxkX3R5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJjdXJyZW5jeVwiIHx8IGZpZWxkX3R5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmxlc3NfdGhhbiwgb3B0aW9uYWxzLmdyZWF0ZXJfdGhhbiwgb3B0aW9uYWxzLmxlc3Nfb3JfZXF1YWwsIG9wdGlvbmFscy5ncmVhdGVyX29yX2VxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJbdGV4dF1cIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH1cbiAgcmV0dXJuIG9wZXJhdGlvbnM7XG59O1xuXG5cbi8qXG4gICAg5YWI5oyJ54Wn5pyJ5o6S5bqP5Y+355qE5bCP55qE5Zyo5YmN77yM5aSn55qE5Zyo5ZCOXG4gICAg5YaN5bCG5rKh5pyJ5o6S5bqP5Y+355qE5pi+56S65ZyoXG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGZpZWxkcywgZmllbGRzQXJyLCBmaWVsZHNOYW1lLCByZWY7XG4gIGZpZWxkcyA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwO1xuICBmaWVsZHNBcnIgPSBbXTtcbiAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGRzQXJyLnB1c2goe1xuICAgICAgbmFtZTogZmllbGQubmFtZSxcbiAgICAgIHNvcnRfbm86IGZpZWxkLnNvcnRfbm9cbiAgICB9KTtcbiAgfSk7XG4gIGZpZWxkc05hbWUgPSBbXTtcbiAgXy5lYWNoKF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZHNOYW1lLnB1c2goZmllbGQubmFtZSk7XG4gIH0pO1xuICByZXR1cm4gZmllbGRzTmFtZTtcbn07XG4iLCJDcmVhdG9yLl90cmlnZ2VyX2hvb2tzID0ge31cclxuXHJcbmluaXRUcmlnZ2VyID0gKG9iamVjdF9uYW1lLCB0cmlnZ2VyKS0+XHJcblx0dHJ5XHJcblx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxyXG5cdFx0aWYgIXRyaWdnZXIudG9kb1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdHRvZG9XcmFwcGVyID0gKCktPlxyXG5cdFx0XHQgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZVxyXG5cdFx0XHQgIHJldHVybiB0cmlnZ2VyLnRvZG8uYXBwbHkodGhpcywgYXJndW1lbnRzKVxyXG5cdFx0aWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLmluc2VydFwiXHJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8uaW5zZXJ0KHRvZG9XcmFwcGVyKVxyXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImJlZm9yZS51cGRhdGVcIlxyXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5iZWZvcmU/LnVwZGF0ZSh0b2RvV3JhcHBlcilcclxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUucmVtb3ZlXCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYmVmb3JlPy5yZW1vdmUodG9kb1dyYXBwZXIpXHJcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIuaW5zZXJ0XCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYWZ0ZXI/Lmluc2VydCh0b2RvV3JhcHBlcilcclxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci51cGRhdGVcIlxyXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5hZnRlcj8udXBkYXRlKHRvZG9XcmFwcGVyKVxyXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLnJlbW92ZVwiXHJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmFmdGVyPy5yZW1vdmUodG9kb1dyYXBwZXIpXHJcblx0Y2F0Y2ggZXJyb3JcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpXHJcblxyXG5jbGVhblRyaWdnZXIgPSAob2JqZWN0X25hbWUpLT5cclxuXHQjIyNcclxuICAgIFx055Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsOaYr+S9v+eUqOS4i+agh+WIoOmZpOWvueixoeeahO+8jOaJgOS7peatpOWkhOWPjei9rGhvb2tz6ZuG5ZCI5ZCO77yM5YaN5Yig6ZmkXHJcbiAgICBcdOWboOS4uuS4gOS4quaVsOe7hOWFg+e0oOWIoOmZpOWQju+8jOWFtuS7luWFg+e0oOeahOS4i+agh+S8muWPkeeUn+WPmOWMllxyXG5cdCMjI1xyXG4gICAgI1RPRE8g55Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsGJ1Z1xyXG5cdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdPy5yZXZlcnNlKCkuZm9yRWFjaCAoX2hvb2spLT5cclxuXHRcdF9ob29rLnJlbW92ZSgpXHJcblxyXG5DcmVhdG9yLmluaXRUcmlnZ2VycyA9IChvYmplY3RfbmFtZSktPlxyXG4jXHRjb25zb2xlLmxvZygnQ3JlYXRvci5pbml0VHJpZ2dlcnMgb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSlcclxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHJcblx0Y2xlYW5UcmlnZ2VyKG9iamVjdF9uYW1lKVxyXG5cclxuXHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdXHJcblxyXG5cdF8uZWFjaCBvYmoudHJpZ2dlcnMsICh0cmlnZ2VyLCB0cmlnZ2VyX25hbWUpLT5cclxuXHRcdGlmIE1ldGVvci5pc1NlcnZlciBhbmQgdHJpZ2dlci5vbiA9PSBcInNlcnZlclwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxyXG5cdFx0XHRfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIgb2JqZWN0X25hbWUsIHRyaWdnZXJcclxuXHRcdFx0aWYgX3RyaWdnZXJfaG9va1xyXG5cdFx0XHRcdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vaylcclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudCBhbmQgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxyXG5cdFx0XHRfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIgb2JqZWN0X25hbWUsIHRyaWdnZXJcclxuXHRcdFx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKSIsInZhciBjbGVhblRyaWdnZXIsIGluaXRUcmlnZ2VyO1xuXG5DcmVhdG9yLl90cmlnZ2VyX2hvb2tzID0ge307XG5cbmluaXRUcmlnZ2VyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHRyaWdnZXIpIHtcbiAgdmFyIGNvbGxlY3Rpb24sIGVycm9yLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHRvZG9XcmFwcGVyO1xuICB0cnkge1xuICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpO1xuICAgIGlmICghdHJpZ2dlci50b2RvKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRvZG9XcmFwcGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm9iamVjdF9uYW1lID0gb2JqZWN0X25hbWU7XG4gICAgICByZXR1cm4gdHJpZ2dlci50b2RvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS5pbnNlcnRcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZi5pbnNlcnQodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS51cGRhdGVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYxID0gY29sbGVjdGlvbi5iZWZvcmUpICE9IG51bGwgPyByZWYxLnVwZGF0ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLnJlbW92ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjIgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZjIucmVtb3ZlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci5pbnNlcnRcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYzID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjMuaW5zZXJ0KHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci51cGRhdGVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWY0ID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjQudXBkYXRlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci5yZW1vdmVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWY1ID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjUucmVtb3ZlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgIGVycm9yID0gZXJyb3IxO1xuICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdpbml0VHJpZ2dlciBlcnJvcicsIGVycm9yKTtcbiAgfVxufTtcblxuY2xlYW5UcmlnZ2VyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcblxuICAvKlxuICAgICBcdOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbDmmK/kvb/nlKjkuIvmoIfliKDpmaTlr7nosaHnmoTvvIzmiYDku6XmraTlpITlj43ovaxob29rc+mbhuWQiOWQju+8jOWGjeWIoOmZpFxuICAgICBcdOWboOS4uuS4gOS4quaVsOe7hOWFg+e0oOWIoOmZpOWQju+8jOWFtuS7luWFg+e0oOeahOS4i+agh+S8muWPkeeUn+WPmOWMllxuICAgKi9cbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSkgIT0gbnVsbCA/IHJlZi5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbihfaG9vaykge1xuICAgIHJldHVybiBfaG9vay5yZW1vdmUoKTtcbiAgfSkgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmluaXRUcmlnZ2VycyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBvYmo7XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY2xlYW5UcmlnZ2VyKG9iamVjdF9uYW1lKTtcbiAgQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0gPSBbXTtcbiAgcmV0dXJuIF8uZWFjaChvYmoudHJpZ2dlcnMsIGZ1bmN0aW9uKHRyaWdnZXIsIHRyaWdnZXJfbmFtZSkge1xuICAgIHZhciBfdHJpZ2dlcl9ob29rO1xuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJzZXJ2ZXJcIiAmJiB0cmlnZ2VyLnRvZG8gJiYgdHJpZ2dlci53aGVuKSB7XG4gICAgICBfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIob2JqZWN0X25hbWUsIHRyaWdnZXIpO1xuICAgICAgaWYgKF90cmlnZ2VyX2hvb2spIHtcbiAgICAgICAgQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiICYmIHRyaWdnZXIudG9kbyAmJiB0cmlnZ2VyLndoZW4pIHtcbiAgICAgIF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlcihvYmplY3RfbmFtZSwgdHJpZ2dlcik7XG4gICAgICByZXR1cm4gQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKTtcbiAgICB9XG4gIH0pO1xufTtcbiIsImNsb25lID0gcmVxdWlyZSgnY2xvbmUnKVxyXG5cclxuQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRcdGlmICFvYmpcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRyZXR1cm4gb2JqLnBlcm1pc3Npb25zLmdldCgpXHJcblx0ZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcclxuXHJcbkNyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUsIHJlY29yZCwgdXNlcklkLCBzcGFjZUlkKS0+XHJcblx0aWYgIW9iamVjdF9uYW1lIGFuZCBNZXRlb3IuaXNDbGllbnRcclxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cclxuXHRpZiAhc3BhY2VJZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXHJcblx0XHJcblx0aWYgcmVjb3JkIGFuZCBvYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiIGFuZCBNZXRlb3IuaXNDbGllbnRcclxuXHRcdCMg5aaC5p6c5pivY21zX2ZpbGVz6ZmE5Lu277yM5YiZ5p2D6ZmQ5Y+W5YW254i26K6w5b2V5p2D6ZmQXHJcblx0XHRpZiBvYmplY3RfbmFtZSA9PSBTZXNzaW9uLmdldCgnb2JqZWN0X25hbWUnKVxyXG5cdFx0XHQjIOW9k+WJjeWkhOS6jmNtc19maWxlc+mZhOS7tuivpue7hueVjOmdolxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IHJlY29yZC5wYXJlbnRbJ3JlZmVyZW5jZV90by5fbyddO1xyXG5cdFx0XHRyZWNvcmRfaWQgPSByZWNvcmQucGFyZW50Ll9pZDtcclxuXHRcdGVsc2UgXHJcblx0XHRcdCMg5b2T5YmN5aSE5LqOY21zX2ZpbGVz6ZmE5Lu255qE54i26K6w5b2V55WM6Z2iXHJcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJyk7XHJcblx0XHRcdHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xyXG5cdFx0b2JqZWN0X2ZpZWxkc19rZXlzID0gXy5rZXlzKENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKT8uZmllbGRzIG9yIHt9KSB8fCBbXTtcclxuXHRcdHNlbGVjdCA9IF8uaW50ZXJzZWN0aW9uKG9iamVjdF9maWVsZHNfa2V5cywgWydvd25lcicsICdjb21wYW55X2lkJywgJ2NvbXBhbnlfaWRzJywgJ2xvY2tlZCddKSB8fCBbXTtcclxuXHRcdGlmIHNlbGVjdC5sZW5ndGggPiAwXHJcblx0XHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdC5qb2luKCcsJykpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZWNvcmQgPSBudWxsO1xyXG5cclxuXHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUoQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSlcclxuXHJcblx0aWYgcmVjb3JkXHJcblx0XHRpc093bmVyID0gcmVjb3JkLm93bmVyID09IHVzZXJJZCB8fCByZWNvcmQub3duZXI/Ll9pZCA9PSB1c2VySWRcclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHR1c2VyX2NvbXBhbnlfaWRzID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpXHJcblx0XHRlbHNlXHJcblx0XHRcdHVzZXJfY29tcGFueV9pZHMgPSBDcmVhdG9yLmdldFVzZXJDb21wYW55SWRzKHVzZXJJZCwgc3BhY2VJZClcclxuXHRcdHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkPy5jb21wYW55X2lkXHJcblx0XHRpZiByZWNvcmRfY29tcGFueV9pZCBhbmQgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZCkgYW5kIHJlY29yZF9jb21wYW55X2lkLl9pZFxyXG5cdFx0XHQjIOWboHJlY29yZF9jb21wYW55X2lk5pivbG9va3Vw57G75Z6L77yM5pyJ5Y+v6IO9ZHjmjqfku7bkvJrmiorlroPmmKDlsITovazkuLrlr7nlupTnmoRvYmplY3TvvIzmiYDku6Xov5nph4zlj5blh7rlhbZfaWTlgLxcclxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmRfY29tcGFueV9pZC5faWRcclxuXHRcdHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZD8uY29tcGFueV9pZHNcclxuXHRcdGlmIHJlY29yZF9jb21wYW55X2lkcyBhbmQgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCBhbmQgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZHNbMF0pXHJcblx0XHRcdCMg5ZugcmVjb3JkX2NvbXBhbnlfaWRz5pivbG9va3Vw57G75Z6L77yM5pyJ5Y+v6IO9ZHjmjqfku7bkvJrmiorlroPmmKDlsITovazkuLrlr7nlupTnmoRbb2JqZWN0Xe+8jOaJgOS7pei/memHjOWPluWHuuWFtl9pZOWAvFxyXG5cdFx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmRfY29tcGFueV9pZHMubWFwKChuKS0+IG4uX2lkKVxyXG5cdFx0cmVjb3JkX2NvbXBhbnlfaWRzID0gXy51bmlvbihyZWNvcmRfY29tcGFueV9pZHMsIFtyZWNvcmRfY29tcGFueV9pZF0pXHJcblx0XHRpZiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBhbmQgIWlzT3duZXIgYW5kICFwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXHJcblx0XHRlbHNlIGlmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRpZiByZWNvcmRfY29tcGFueV9pZHMgYW5kIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGhcclxuXHRcdFx0XHRpZiB1c2VyX2NvbXBhbnlfaWRzIGFuZCB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aFxyXG5cdFx0XHRcdFx0aWYgIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoXHJcblx0XHRcdFx0XHRcdCMg6K6w5b2V55qEY29tcGFueV9pZC9jb21wYW55X2lkc+WxnuaAp+S4jeWcqOW9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPojIPlm7TlhoXml7bvvIzorqTkuLrml6DmnYPkv67mlLlcclxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2VcclxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCMg6K6w5b2V5pyJY29tcGFueV9pZC9jb21wYW55X2lkc+WxnuaAp++8jOS9huaYr+W9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPkuLrnqbrml7bvvIzorqTkuLrml6DmnYPkv67mlLlcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXHJcblx0XHRcclxuXHRcdGlmIHJlY29yZC5sb2NrZWQgYW5kICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXHJcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2VcclxuXHJcblx0XHRpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kICFpc093bmVyIGFuZCAhcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXHJcblx0XHRlbHNlIGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkcyBhbmQgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aFxyXG5cdFx0XHRcdGlmIHVzZXJfY29tcGFueV9pZHMgYW5kIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoXHJcblx0XHRcdFx0XHRpZiAhXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGhcclxuXHRcdFx0XHRcdFx0IyDorrDlvZXnmoRjb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn5LiN5Zyo5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+iMg+WbtOWGheaXtu+8jOiupOS4uuaXoOadg+afpeeci1xyXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCMg6K6w5b2V5pyJY29tcGFueV9pZOWxnuaAp++8jOS9huaYr+W9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPkuLrnqbrml7bvvIzorqTkuLrml6DmnYPmn6XnnItcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXHJcblxyXG5cdHJldHVybiBwZXJtaXNzaW9uc1xyXG5cclxuXHJcbiMgY3VycmVudE9iamVjdE5hbWXvvJrlvZPliY3kuLvlr7nosaFcclxuIyByZWxhdGVkTGlzdEl0ZW3vvJpDcmVhdG9yLmdldFJlbGF0ZWRMaXN0KFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIiksIFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpKeS4reWPlnJlbGF0ZWRfb2JqZWN0X25hbWXlr7nlupTnmoTlgLxcclxuIyBjdXJyZW50UmVjb3Jk5b2T5YmN5Li75a+56LGh55qE6K+m57uG6K6w5b2VXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG5cdENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyA9IChjdXJyZW50T2JqZWN0TmFtZSwgcmVsYXRlZExpc3RJdGVtLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpLT5cclxuXHRcdGlmICFjdXJyZW50T2JqZWN0TmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdGN1cnJlbnRPYmplY3ROYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cclxuXHRcdGlmICFyZWxhdGVkTGlzdEl0ZW1cclxuXHRcdFx0Y29uc29sZS5lcnJvcihcInJlbGF0ZWRMaXN0SXRlbSBtdXN0IG5vdCBiZSBlbXB0eSBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9uc1wiKTtcclxuXHRcdFx0cmV0dXJuIHt9XHJcblxyXG5cdFx0aWYgIWN1cnJlbnRSZWNvcmQgYW5kIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRjdXJyZW50UmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQoKVxyXG5cclxuXHRcdGlmICF1c2VySWQgYW5kIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHJcblx0XHRpZiAhc3BhY2VJZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHJcblx0XHRzaGFyaW5nID0gcmVsYXRlZExpc3RJdGVtLnNoYXJpbmcgfHwgJ21hc3RlcldyaXRlJ1xyXG5cdFx0bWFzdGVyQWxsb3cgPSBmYWxzZVxyXG5cdFx0bWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMoY3VycmVudE9iamVjdE5hbWUsIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZClcclxuXHRcdGlmIHNoYXJpbmcgPT0gJ21hc3RlclJlYWQnXHJcblx0XHRcdG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWRcclxuXHRcdGVsc2UgaWYgc2hhcmluZyA9PSAnbWFzdGVyV3JpdGUnXHJcblx0XHRcdG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRcclxuXHJcblx0XHR1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IENyZWF0b3IuZ2V0UmVjb3JkU2FmZVJlbGF0ZWRMaXN0KGN1cnJlbnRSZWNvcmQsIGN1cnJlbnRPYmplY3ROYW1lKVxyXG5cdFx0cmVsYXRlZE9iamVjdFBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpXHJcblx0XHRpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUgPSB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdC5pbmRleE9mKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSkgPiAtMVxyXG5cclxuXHRcdHJlc3VsdCA9IF8uY2xvbmUgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zXHJcblx0XHRyZXN1bHQuYWxsb3dDcmVhdGUgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZVxyXG5cdFx0cmVzdWx0LmFsbG93RWRpdCA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZVxyXG5cdFx0cmV0dXJuIHJlc3VsdFxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblxyXG5cdENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMgPSAoc3BhY2VJZCwgdXNlcklkKSAtPlxyXG5cdFx0cGVybWlzc2lvbnMgPVxyXG5cdFx0XHRvYmplY3RzOiB7fVxyXG5cdFx0XHRhc3NpZ25lZF9hcHBzOiBbXVxyXG5cdFx0IyMjXHJcblx0XHTmnYPpmZDnu4Tor7TmmI46XHJcblx0XHTlhoXnva7mnYPpmZDnu4QtYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3Qsd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWluXHJcblx0XHToh6rlrprkuYnmnYPpmZDnu4Qt5pWw5o2u5bqT5Lit5paw5bu655qE6Zmk5YaF572u5p2D6ZmQ57uE5Lul5aSW55qE5YW25LuW5p2D6ZmQ57uEXHJcblx0XHTnibnlrprnlKjmiLfpm4blkIjmnYPpmZDnu4TvvIjljbN1c2Vyc+WxnuaAp+S4jeWPr+mFjee9ru+8iS1hZG1pbix1c2VyLG1lbWJlcixndWVzdFxyXG5cdFx05Y+v6YWN572u55So5oi36ZuG5ZCI5p2D6ZmQ57uE77yI5Y2zdXNlcnPlsZ7mgKflj6/phY3nva7vvIktd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWlu5Lul5Y+K6Ieq5a6a5LmJ5p2D6ZmQ57uEXHJcblx0XHQjIyNcclxuXHRcdHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cdFx0cHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cdFx0cHNldHNNZW1iZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ21lbWJlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHRcdHBzZXRzR3Vlc3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cdFx0cHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxyXG5cclxuXHRcdHBzZXRzQWRtaW5fcG9zID0gbnVsbFxyXG5cdFx0cHNldHNVc2VyX3BvcyA9IG51bGxcclxuXHRcdHBzZXRzTWVtYmVyX3BvcyA9IG51bGxcclxuXHRcdHBzZXRzR3Vlc3RfcG9zID0gbnVsbFxyXG5cdFx0cHNldHNDdXJyZW50X3BvcyA9IG51bGxcclxuXHJcblx0XHRpZiBwc2V0c0FkbWluPy5faWRcclxuXHRcdFx0cHNldHNBZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQWRtaW4uX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXHJcblx0XHRpZiBwc2V0c1VzZXI/Ll9pZFxyXG5cdFx0XHRwc2V0c1VzZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c1VzZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXHJcblx0XHRpZiBwc2V0c01lbWJlcj8uX2lkXHJcblx0XHRcdHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXHJcblx0XHRpZiBwc2V0c0d1ZXN0Py5faWRcclxuXHRcdFx0cHNldHNHdWVzdF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzR3Vlc3QuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXHJcblx0XHRpZiBwc2V0c0N1cnJlbnQubGVuZ3RoID4gMFxyXG5cdFx0XHRzZXRfaWRzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwiX2lkXCJcclxuXHRcdFx0cHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogc2V0X2lkc319KS5mZXRjaCgpXHJcblx0XHRcdHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwibmFtZVwiXHJcblx0XHRpc1NwYWNlQWRtaW4gPSBmYWxzZVxyXG5cdFx0c3BhY2VVc2VyID0gbnVsbFxyXG5cdFx0aWYgdXNlcklkXHJcblx0XHRcdGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcclxuXHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXHJcblxyXG5cdFx0cHNldHMgPSB7IFxyXG5cdFx0XHRwc2V0c0FkbWluLCBcclxuXHRcdFx0cHNldHNVc2VyLCBcclxuXHRcdFx0cHNldHNDdXJyZW50LCBcclxuXHRcdFx0cHNldHNNZW1iZXIsIFxyXG5cdFx0XHRwc2V0c0d1ZXN0LCBcclxuXHRcdFx0aXNTcGFjZUFkbWluLCBcclxuXHRcdFx0c3BhY2VVc2VyLCBcclxuXHRcdFx0cHNldHNBZG1pbl9wb3MsIFxyXG5cdFx0XHRwc2V0c1VzZXJfcG9zLCBcclxuXHRcdFx0cHNldHNNZW1iZXJfcG9zLCBcclxuXHRcdFx0cHNldHNHdWVzdF9wb3MsIFxyXG5cdFx0XHRwc2V0c0N1cnJlbnRfcG9zXHJcblx0XHR9XHJcblx0XHRwZXJtaXNzaW9ucy5hc3NpZ25lZF9hcHBzID0gQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKVxyXG5cdFx0cGVybWlzc2lvbnMuYXNzaWduZWRfbWVudXMgPSBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKVxyXG5cdFx0cGVybWlzc2lvbnMudXNlcl9wZXJtaXNzaW9uX3NldHMgPSBwc2V0c0N1cnJlbnROYW1lc1xyXG5cdFx0X2kgPSAwXHJcblx0XHRfLmVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAob2JqZWN0LCBvYmplY3RfbmFtZSktPlxyXG5cdFx0XHRfaSsrXHJcblx0XHRcdGlmICFfLmhhcyhvYmplY3QsICdzcGFjZScpIHx8ICFvYmplY3Quc3BhY2UgfHwgb2JqZWN0LnNwYWNlID09IHNwYWNlSWRcclxuXHRcdFx0XHRpZiAhXy5oYXMob2JqZWN0LCAnaW5fZGV2ZWxvcG1lbnQnKSB8fCBvYmplY3QuaW5fZGV2ZWxvcG1lbnQgPT0gJzAnIHx8IChvYmplY3QuaW5fZGV2ZWxvcG1lbnQgIT0gJzAnICYmIGlzU3BhY2VBZG1pbilcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0pLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV1bXCJwZXJtaXNzaW9uc1wiXSA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcclxuXHRcdHJldHVybiBwZXJtaXNzaW9uc1xyXG5cclxuXHR1bmlvblBsdXMgPSAoYXJyYXksIG90aGVyKSAtPlxyXG5cdFx0aWYgIWFycmF5IGFuZCAhb3RoZXJcclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxyXG5cdFx0aWYgIWFycmF5XHJcblx0XHRcdGFycmF5ID0gW11cclxuXHRcdGlmICFvdGhlclxyXG5cdFx0XHRvdGhlciA9IFtdXHJcblx0XHRyZXR1cm4gXy51bmlvbihhcnJheSwgb3RoZXIpXHJcblxyXG5cdGludGVyc2VjdGlvblBsdXMgPSAoYXJyYXksIG90aGVyKSAtPlxyXG5cdFx0aWYgIWFycmF5IGFuZCAhb3RoZXJcclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxyXG5cdFx0aWYgIWFycmF5XHJcblx0XHRcdGFycmF5ID0gW11cclxuXHRcdGlmICFvdGhlclxyXG5cdFx0XHRvdGhlciA9IFtdXHJcblx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24oYXJyYXksIG90aGVyKVxyXG5cclxuXHRDcmVhdG9yLmdldEFzc2lnbmVkQXBwcyA9IChzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRcdHBzZXRzQWRtaW4gPSB0aGlzLnBzZXRzQWRtaW4gfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXHJcblx0XHRwc2V0c1VzZXIgPSB0aGlzLnBzZXRzVXNlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0IyBwc2V0c01lbWJlciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0IyBwc2V0c0d1ZXN0ID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0cHNldHMgPSAgdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxyXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXHJcblx0XHRhcHBzID0gW11cclxuXHRcdGlmIGlzU3BhY2VBZG1pblxyXG5cdFx0XHRyZXR1cm4gW11cclxuXHRcdGVsc2VcclxuXHRcdFx0cHNldEJhc2UgPSBwc2V0c1VzZXJcclxuXHRcdFx0aWYgcHNldEJhc2U/LmFzc2lnbmVkX2FwcHM/Lmxlbmd0aFxyXG5cdFx0XHRcdGFwcHMgPSBfLnVuaW9uIGFwcHMsIHBzZXRCYXNlLmFzc2lnbmVkX2FwcHNcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdCMgdXNlcuadg+mZkOe7hOS4reeahGFzc2lnbmVkX2FwcHPooajnpLrmiYDmnInnlKjmiLflhbfmnInnmoRhcHBz5p2D6ZmQ77yM5Li656m65YiZ6KGo56S65pyJ5omA5pyJYXBwc+adg+mZkO+8jOS4jemcgOimgeS9nOadg+mZkOWIpOaWreS6hlxyXG5cdFx0XHRcdHJldHVybiBbXVxyXG5cdFx0XHRfLmVhY2ggcHNldHMsIChwc2V0KS0+XHJcblx0XHRcdFx0aWYgIXBzZXQuYXNzaWduZWRfYXBwc1xyXG5cdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdFx0aWYgcHNldC5uYW1lID09IFwiYWRtaW5cIiB8fCAgcHNldC5uYW1lID09IFwidXNlclwiXHJcblx0XHRcdFx0XHQjIOi/memHjOS5i+aJgOS7peimgeaOkumZpGFkbWluL3VzZXLvvIzmmK/lm6DkuLrov5nkuKTkuKrmnYPpmZDnu4TmmK/miYDmnInmnYPpmZDnu4TkuK11c2Vyc+WxnuaAp+aXoOaViOeahOadg+mZkOe7hO+8jOeJueaMh+W3peS9nOWMuueuoeeQhuWRmOWSjOaJgOacieeUqOaIt1xyXG5cdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdFx0YXBwcyA9IF8udW5pb24gYXBwcywgcHNldC5hc3NpZ25lZF9hcHBzXHJcblx0XHRcdHJldHVybiBfLndpdGhvdXQoXy51bmlxKGFwcHMpLHVuZGVmaW5lZCxudWxsKVxyXG5cclxuXHRDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMgPSAoc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0XHRwc2V0cyA9ICB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXHJcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcclxuXHRcdGFkbWluTWVudXMgPSBDcmVhdG9yLkFwcHMuYWRtaW4/LmFkbWluX21lbnVzXHJcblx0XHQjIOWmguaenOayoeaciWFkbWlu6I+c5Y2V6K+05piO5LiN6ZyA6KaB55u45YWz5Yqf6IO977yM55u05o6l6L+U5Zue56m6XHJcblx0XHR1bmxlc3MgYWRtaW5NZW51c1xyXG5cdFx0XHRyZXR1cm4gW11cclxuXHRcdGFib3V0TWVudSA9IGFkbWluTWVudXMuZmluZCAobikgLT5cclxuXHRcdFx0bi5faWQgPT0gJ2Fib3V0J1xyXG5cdFx0YWRtaW5NZW51cyA9IGFkbWluTWVudXMuZmlsdGVyIChuKSAtPlxyXG5cdFx0XHRuLl9pZCAhPSAnYWJvdXQnXHJcblx0XHRvdGhlck1lbnVBcHBzID0gXy5zb3J0QnkgXy5maWx0ZXIoXy52YWx1ZXMoQ3JlYXRvci5BcHBzKSwgKG4pIC0+XHJcblx0XHRcdHJldHVybiBuLmFkbWluX21lbnVzIGFuZCBuLl9pZCAhPSAnYWRtaW4nXHJcblx0XHQpLCAnc29ydCdcclxuXHRcdG90aGVyTWVudXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhvdGhlck1lbnVBcHBzLCBcImFkbWluX21lbnVzXCIpKVxyXG5cdFx0IyDoj5zljZXmnInkuInpg6jliIbnu4TmiJDvvIzorr7nva5BUFDoj5zljZXjgIHlhbbku5ZBUFDoj5zljZXku6Xlj4phYm91dOiPnOWNlVxyXG5cdFx0YWxsTWVudXMgPSBfLnVuaW9uKGFkbWluTWVudXMsIG90aGVyTWVudXMsIFthYm91dE1lbnVdKVxyXG5cdFx0aWYgaXNTcGFjZUFkbWluXHJcblx0XHRcdCMg5bel5L2c5Yy6566h55CG5ZGY5pyJ5YWo6YOo6I+c5Y2V5Yqf6IO9XHJcblx0XHRcdHJlc3VsdCA9IGFsbE1lbnVzXHJcblx0XHRlbHNlXHJcblx0XHRcdGN1cnJlbnRQc2V0TmFtZXMgPSBwc2V0cy5tYXAgKG4pIC0+XHJcblx0XHRcdFx0cmV0dXJuIG4ubmFtZVxyXG5cdFx0XHRtZW51cyA9IGFsbE1lbnVzLmZpbHRlciAobWVudSktPlxyXG5cdFx0XHRcdHBzZXRzTWVudSA9IG1lbnUucGVybWlzc2lvbl9zZXRzXHJcblx0XHRcdFx0IyDlpoLmnpzmma7pgJrnlKjmiLfmnInmnYPpmZDvvIzliJnnm7TmjqXov5Tlm550cnVlXHJcblx0XHRcdFx0aWYgcHNldHNNZW51ICYmIHBzZXRzTWVudS5pbmRleE9mKFwidXNlclwiKSA+IC0xXHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHRcdCMg5ZCm5YiZ5Y+W5b2T5YmN55So5oi355qE5p2D6ZmQ6ZuG5LiObWVudeiPnOWNleimgeaxgueahOadg+mZkOmbhuWvueavlO+8jOWmguaenOS6pOmbhuWkp+S6jjHkuKrliJnov5Tlm550cnVlXHJcblx0XHRcdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKGN1cnJlbnRQc2V0TmFtZXMsIHBzZXRzTWVudSkubGVuZ3RoXHJcblx0XHRcdHJlc3VsdCA9IG1lbnVzXHJcblx0XHRcclxuXHRcdHJldHVybiBfLnNvcnRCeShyZXN1bHQsXCJzb3J0XCIpXHJcblxyXG5cdGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QgPSAocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQpLT5cclxuXHJcblx0XHRpZiBfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpXHJcblx0XHRcdHJldHVybiBudWxsXHJcblx0XHRpZiBfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKVxyXG5cdFx0XHRyZXR1cm4gXy5maW5kIHBlcm1pc3Npb25fb2JqZWN0cywgKHBvKS0+XHJcblx0XHRcdFx0XHRyZXR1cm4gcG8ub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcclxuXHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZDogcGVybWlzc2lvbl9zZXRfaWR9KVxyXG5cclxuXHRmaW5kX3Blcm1pc3Npb25fb2JqZWN0ID0gKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkcyktPlxyXG5cdFx0aWYgXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKVxyXG5cdFx0XHRyZXR1cm4gbnVsbFxyXG5cdFx0aWYgXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cylcclxuXHRcdFx0cmV0dXJuIF8uZmlsdGVyIHBlcm1pc3Npb25fb2JqZWN0cywgKHBvKS0+XHJcblx0XHRcdFx0cmV0dXJuIHBvLm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXHJcblx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogcGVybWlzc2lvbl9zZXRfaWRzfX0pLmZldGNoKClcclxuXHJcblx0dW5pb25QZXJtaXNzaW9uT2JqZWN0cyA9IChwb3MsIG9iamVjdCwgcHNldHMpLT5cclxuXHRcdCMg5oqKZGLlj4p5bWzkuK3nmoRwZXJtaXNzaW9uX29iamVjdHPlkIjlubbvvIzkvJjlhYjlj5ZkYuS4reeahFxyXG5cdFx0cmVzdWx0ID0gW11cclxuXHRcdF8uZWFjaCBvYmplY3QucGVybWlzc2lvbl9zZXQsIChvcHMsIG9wc19rZXkpLT5cclxuXHRcdFx0IyDmiop5bWzkuK3pmaTkuobnibnlrprnlKjmiLfpm4blkIjmnYPpmZDnu4RcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCLlpJbnmoTlhbbku5blr7nosaHmnYPpmZDlhYjlrZjlhaVyZXN1bHRcclxuXHRcdFx0IyBpZiBbXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwiLCBcIndvcmtmbG93X2FkbWluXCIsIFwib3JnYW5pemF0aW9uX2FkbWluXCJdLmluZGV4T2Yob3BzX2tleSkgPCAwXHJcblx0XHRcdGlmIFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCJdLmluZGV4T2Yob3BzX2tleSkgPCAwXHJcblx0XHRcdFx0Y3VycmVudFBzZXQgPSBwc2V0cy5maW5kIChwc2V0KS0+IHJldHVybiBwc2V0Lm5hbWUgPT0gb3BzX2tleVxyXG5cdFx0XHRcdGlmIGN1cnJlbnRQc2V0XHJcblx0XHRcdFx0XHR0ZW1wT3BzID0gXy5jbG9uZShvcHMpIHx8IHt9XHJcblx0XHRcdFx0XHR0ZW1wT3BzLnBlcm1pc3Npb25fc2V0X2lkID0gY3VycmVudFBzZXQuX2lkXHJcblx0XHRcdFx0XHR0ZW1wT3BzLm9iamVjdF9uYW1lID0gb2JqZWN0Lm9iamVjdF9uYW1lXHJcblx0XHRcdFx0XHRyZXN1bHQucHVzaCB0ZW1wT3BzXHJcblx0XHRpZiByZXN1bHQubGVuZ3RoXHJcblx0XHRcdHBvcy5mb3JFYWNoIChwbyktPlxyXG5cdFx0XHRcdHJlcGVhdEluZGV4ID0gMFxyXG5cdFx0XHRcdHJlcGVhdFBvID0gcmVzdWx0LmZpbmQoKGl0ZW0sIGluZGV4KS0+IHJlcGVhdEluZGV4ID0gaW5kZXg7cmV0dXJuIGl0ZW0ucGVybWlzc2lvbl9zZXRfaWQgPT0gcG8ucGVybWlzc2lvbl9zZXRfaWQpXHJcblx0XHRcdFx0IyDlpoLmnpx5bWzkuK3lt7Lnu4/lrZjlnKhwb++8jOWImeabv+aNouS4uuaVsOaNruW6k+S4reeahHBv77yM5Y+N5LmL5YiZ5oqK5pWw5o2u5bqT5Lit55qEcG/nm7TmjqXntK/liqDov5vljrtcclxuXHRcdFx0XHRpZiByZXBlYXRQb1xyXG5cdFx0XHRcdFx0cmVzdWx0W3JlcGVhdEluZGV4XSA9IHBvXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0cmVzdWx0LnB1c2ggcG9cclxuXHRcdFx0cmV0dXJuIHJlc3VsdFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gcG9zXHJcblxyXG5cdENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMgPSAoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSktPlxyXG5cdFx0cGVybWlzc2lvbnMgPSB7fVxyXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpXHJcblxyXG5cdFx0aWYgc3BhY2VJZCBpcyAnZ3Vlc3QnIHx8IG9iamVjdF9uYW1lID09IFwidXNlcnNcIlxyXG5cdFx0XHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fVxyXG5cdFx0XHRDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyBwZXJtaXNzaW9uc1xyXG5cdFx0XHRyZXR1cm4gcGVybWlzc2lvbnNcclxuXHRcdHBzZXRzQWRtaW4gPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzQWRtaW4pIG9yIHRoaXMucHNldHNBZG1pbiB0aGVuIHRoaXMucHNldHNBZG1pbiBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjF9fSlcclxuXHRcdHBzZXRzVXNlciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNVc2VyKSBvciB0aGlzLnBzZXRzVXNlciB0aGVuIHRoaXMucHNldHNVc2VyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxfX0pXHJcblx0XHRwc2V0c01lbWJlciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNNZW1iZXIpIG9yIHRoaXMucHNldHNNZW1iZXIgdGhlbiB0aGlzLnBzZXRzTWVtYmVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcclxuXHRcdHBzZXRzR3Vlc3QgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzR3Vlc3QpIG9yIHRoaXMucHNldHNHdWVzdCB0aGVuIHRoaXMucHNldHNHdWVzdCBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjF9fSlcclxuXHRcdHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxyXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXHJcblxyXG5cdFx0cHNldHNBZG1pbl9wb3MgPSB0aGlzLnBzZXRzQWRtaW5fcG9zXHJcblx0XHRwc2V0c1VzZXJfcG9zID0gdGhpcy5wc2V0c1VzZXJfcG9zXHJcblx0XHRwc2V0c01lbWJlcl9wb3MgPSB0aGlzLnBzZXRzTWVtYmVyX3Bvc1xyXG5cdFx0cHNldHNHdWVzdF9wb3MgPSB0aGlzLnBzZXRzR3Vlc3RfcG9zXHJcblx0XHRwc2V0c0N1cnJlbnRfcG9zID0gdGhpcy5wc2V0c0N1cnJlbnRfcG9zXHJcblxyXG5cdFx0b3BzZXRBZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmFkbWluKSB8fCB7fVxyXG5cdFx0b3BzZXRVc2VyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQudXNlcikgfHwge31cclxuXHRcdG9wc2V0TWVtYmVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQubWVtYmVyKSB8fCB7fVxyXG5cdFx0b3BzZXRHdWVzdCA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fVxyXG5cclxuXHRcdCMgc2hhcmVkTGlzdFZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3RfbGlzdHZpZXdzJykuZmluZCh7c3BhY2U6IHNwYWNlSWQsIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc2hhcmVkOiB0cnVlfSwge2ZpZWxkczp7X2lkOjF9fSkuZmV0Y2goKVxyXG5cdFx0IyBzaGFyZWRMaXN0Vmlld3MgPSBfLnBsdWNrKHNoYXJlZExpc3RWaWV3cyxcIl9pZFwiKVxyXG5cdFx0IyBpZiBzaGFyZWRMaXN0Vmlld3MubGVuZ3RoXHJcblx0XHQjIFx0dW5sZXNzIG9wc2V0QWRtaW4ubGlzdF92aWV3c1xyXG5cdFx0IyBcdFx0b3BzZXRBZG1pbi5saXN0X3ZpZXdzID0gW11cclxuXHRcdCMgXHRvcHNldEFkbWluLmxpc3Rfdmlld3MgPSBfLnVuaW9uIG9wc2V0QWRtaW4ubGlzdF92aWV3cywgc2hhcmVkTGlzdFZpZXdzXHJcblx0XHQjIFx0dW5sZXNzIG9wc2V0VXNlci5saXN0X3ZpZXdzXHJcblx0XHQjIFx0XHRvcHNldFVzZXIubGlzdF92aWV3cyA9IFtdXHJcblx0XHQjIFx0b3BzZXRVc2VyLmxpc3Rfdmlld3MgPSBfLnVuaW9uIG9wc2V0VXNlci5saXN0X3ZpZXdzLCBzaGFyZWRMaXN0Vmlld3NcclxuXHRcdCMg5pWw5o2u5bqT5Lit5aaC5p6c6YWN572u5LqG6buY6K6k55qEYWRtaW4vdXNlcuadg+mZkOmbhuiuvue9ru+8jOW6lOivpeimhuebluS7o+eggeS4rWFkbWluL3VzZXLnmoTmnYPpmZDpm4borr7nva5cclxuXHRcdGlmIHBzZXRzQWRtaW5cclxuXHRcdFx0cG9zQWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNBZG1pbi5faWQpXHJcblx0XHRcdGlmIHBvc0FkbWluXHJcblx0XHRcdFx0b3BzZXRBZG1pbi5hbGxvd0NyZWF0ZSA9IHBvc0FkbWluLmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0b3BzZXRBZG1pbi5hbGxvd0RlbGV0ZSA9IHBvc0FkbWluLmFsbG93RGVsZXRlXHJcblx0XHRcdFx0b3BzZXRBZG1pbi5hbGxvd0VkaXQgPSBwb3NBZG1pbi5hbGxvd0VkaXRcclxuXHRcdFx0XHRvcHNldEFkbWluLmFsbG93UmVhZCA9IHBvc0FkbWluLmFsbG93UmVhZFxyXG5cdFx0XHRcdG9wc2V0QWRtaW4ubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0FkbWluLm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldEFkbWluLnZpZXdBbGxSZWNvcmRzID0gcG9zQWRtaW4udmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldEFkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zQWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldEFkbWluLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0FkbWluLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0QWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0FkbWluLmRpc2FibGVkX2xpc3Rfdmlld3NcclxuXHRcdFx0XHRvcHNldEFkbWluLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NBZG1pbi5kaXNhYmxlZF9hY3Rpb25zXHJcblx0XHRcdFx0b3BzZXRBZG1pbi51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0FkbWluLnVucmVhZGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0FkbWluLnVuZWRpdGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0FkbWluLnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc0FkbWluLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0XHJcblx0XHRpZiBwc2V0c1VzZXJcclxuXHRcdFx0cG9zVXNlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNVc2VyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzVXNlci5faWQpXHJcblx0XHRcdGlmIHBvc1VzZXJcclxuXHRcdFx0XHRvcHNldFVzZXIuYWxsb3dDcmVhdGUgPSBwb3NVc2VyLmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0b3BzZXRVc2VyLmFsbG93RGVsZXRlID0gcG9zVXNlci5hbGxvd0RlbGV0ZVxyXG5cdFx0XHRcdG9wc2V0VXNlci5hbGxvd0VkaXQgPSBwb3NVc2VyLmFsbG93RWRpdFxyXG5cdFx0XHRcdG9wc2V0VXNlci5hbGxvd1JlYWQgPSBwb3NVc2VyLmFsbG93UmVhZFxyXG5cdFx0XHRcdG9wc2V0VXNlci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zVXNlci5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRVc2VyLnZpZXdBbGxSZWNvcmRzID0gcG9zVXNlci52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0VXNlci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldFVzZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zVXNlci52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldFVzZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc1VzZXIuZGlzYWJsZWRfbGlzdF92aWV3c1xyXG5cdFx0XHRcdG9wc2V0VXNlci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zVXNlci5kaXNhYmxlZF9hY3Rpb25zXHJcblx0XHRcdFx0b3BzZXRVc2VyLnVucmVhZGFibGVfZmllbGRzID0gcG9zVXNlci51bnJlYWRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0VXNlci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc1VzZXIudW5lZGl0YWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldFVzZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NVc2VyLnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRcdFx0b3BzZXRVc2VyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zVXNlci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFxyXG5cdFx0aWYgcHNldHNNZW1iZXJcclxuXHRcdFx0cG9zTWVtYmVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c01lbWJlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c01lbWJlci5faWQpXHJcblx0XHRcdGlmIHBvc01lbWJlclxyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmFsbG93Q3JlYXRlID0gcG9zTWVtYmVyLmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuYWxsb3dEZWxldGUgPSBwb3NNZW1iZXIuYWxsb3dEZWxldGVcclxuXHRcdFx0XHRvcHNldE1lbWJlci5hbGxvd0VkaXQgPSBwb3NNZW1iZXIuYWxsb3dFZGl0XHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuYWxsb3dSZWFkID0gcG9zTWVtYmVyLmFsbG93UmVhZFxyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NNZW1iZXIubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnZpZXdBbGxSZWNvcmRzID0gcG9zTWVtYmVyLnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NNZW1iZXIubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldE1lbWJlci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NNZW1iZXIudmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc01lbWJlci5kaXNhYmxlZF9saXN0X3ZpZXdzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc01lbWJlci5kaXNhYmxlZF9hY3Rpb25zXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NNZW1iZXIudW5yZWFkYWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldE1lbWJlci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc01lbWJlci51bmVkaXRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zTWVtYmVyLnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NNZW1iZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcclxuXHRcdGlmIHBzZXRzR3Vlc3RcclxuXHRcdFx0cG9zR3Vlc3QgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzR3Vlc3RfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNHdWVzdC5faWQpXHJcblx0XHRcdGlmIHBvc0d1ZXN0XHJcblx0XHRcdFx0b3BzZXRHdWVzdC5hbGxvd0NyZWF0ZSA9IHBvc0d1ZXN0LmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0b3BzZXRHdWVzdC5hbGxvd0RlbGV0ZSA9IHBvc0d1ZXN0LmFsbG93RGVsZXRlXHJcblx0XHRcdFx0b3BzZXRHdWVzdC5hbGxvd0VkaXQgPSBwb3NHdWVzdC5hbGxvd0VkaXRcclxuXHRcdFx0XHRvcHNldEd1ZXN0LmFsbG93UmVhZCA9IHBvc0d1ZXN0LmFsbG93UmVhZFxyXG5cdFx0XHRcdG9wc2V0R3Vlc3QubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0d1ZXN0Lm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldEd1ZXN0LnZpZXdBbGxSZWNvcmRzID0gcG9zR3Vlc3Qudmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldEd1ZXN0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zR3Vlc3QubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldEd1ZXN0LnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0d1ZXN0LnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0R3Vlc3QuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0d1ZXN0LmRpc2FibGVkX2xpc3Rfdmlld3NcclxuXHRcdFx0XHRvcHNldEd1ZXN0LmRpc2FibGVkX2FjdGlvbnMgPSBwb3NHdWVzdC5kaXNhYmxlZF9hY3Rpb25zXHJcblx0XHRcdFx0b3BzZXRHdWVzdC51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0d1ZXN0LnVucmVhZGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0d1ZXN0LnVuZWRpdGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0d1ZXN0LnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc0d1ZXN0LnVuZWRpdGFibGVfcmVsYXRlZF9saXN0XHJcblxyXG5cdFx0aWYgIXVzZXJJZFxyXG5cdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW5cclxuXHRcdGVsc2VcclxuXHRcdFx0aWYgaXNTcGFjZUFkbWluXHJcblx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEFkbWluXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiBzcGFjZUlkIGlzICdjb21tb24nXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHNwYWNlVXNlciA9IGlmIF8uaXNOdWxsKHRoaXMuc3BhY2VVc2VyKSBvciB0aGlzLnNwYWNlVXNlciB0aGVuIHRoaXMuc3BhY2VVc2VyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXHJcblx0XHRcdFx0XHRpZiBzcGFjZVVzZXJcclxuXHRcdFx0XHRcdFx0cHJvZiA9IHNwYWNlVXNlci5wcm9maWxlXHJcblx0XHRcdFx0XHRcdGlmIHByb2ZcclxuXHRcdFx0XHRcdFx0XHRpZiBwcm9mIGlzICd1c2VyJ1xyXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ21lbWJlcidcclxuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRNZW1iZXJcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ2d1ZXN0J1xyXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0XHJcblx0XHRcdFx0XHRcdGVsc2UgIyDmsqHmnIlwcm9maWxl5YiZ6K6k5Li65pivdXNlcuadg+mZkFxyXG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdFxyXG5cclxuXHRcdGlmIHBzZXRzLmxlbmd0aCA+IDBcclxuXHRcdFx0c2V0X2lkcyA9IF8ucGx1Y2sgcHNldHMsIFwiX2lkXCJcclxuXHRcdFx0cG9zID0gZmluZF9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1cnJlbnRfcG9zLCBvYmplY3RfbmFtZSwgc2V0X2lkcylcclxuXHRcdFx0cG9zID0gdW5pb25QZXJtaXNzaW9uT2JqZWN0cyhwb3MsIG9iamVjdCwgcHNldHMpXHJcblx0XHRcdF8uZWFjaCBwb3MsIChwbyktPlxyXG5cdFx0XHRcdGlmIHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzQWRtaW4/Ll9pZCBvciBcclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c1VzZXI/Ll9pZCBvciBcclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c01lbWJlcj8uX2lkIG9yIFxyXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzR3Vlc3Q/Ll9pZFxyXG5cdFx0XHRcdFx0IyDpu5jorqTnmoRhZG1pbi91c2Vy5p2D6ZmQ5YC85Y+q5a6e6KGM5LiK6Z2i55qE6buY6K6k5YC86KaG55uW77yM5LiN5YGa566X5rOV5Yik5patXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRpZiBwby5hbGxvd1JlYWRcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHRydWVcclxuXHRcdFx0XHRpZiBwby5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSB0cnVlXHJcblx0XHRcdFx0aWYgcG8uYWxsb3dFZGl0XHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSB0cnVlXHJcblx0XHRcdFx0aWYgcG8uYWxsb3dEZWxldGVcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIHBvLm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSB0cnVlXHJcblx0XHRcdFx0aWYgcG8udmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHRydWVcclxuXHRcdFx0XHRpZiBwby52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcclxuXHJcblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cywgcG8uZGlzYWJsZWRfbGlzdF92aWV3cylcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zLCBwby5kaXNhYmxlZF9hY3Rpb25zKVxyXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgcG8udW5yZWFkYWJsZV9maWVsZHMpXHJcblx0XHRcdFx0cGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBwby51bmVkaXRhYmxlX2ZpZWxkcylcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMsIHBvLnVucmVsYXRlZF9vYmplY3RzKVxyXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgcG8udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QpXHJcblx0XHRcclxuXHRcdGlmIG9iamVjdC5pc192aWV3XHJcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gZmFsc2VcclxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2VcclxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxyXG5cdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gZmFsc2VcclxuXHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBmYWxzZVxyXG5cdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gW11cclxuXHRcdENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zIHBlcm1pc3Npb25zXHJcblxyXG5cdFx0aWYgb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyXHJcblx0XHRcdHBlcm1pc3Npb25zLm93bmVyID0gb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyXHJcblx0XHRyZXR1cm4gcGVybWlzc2lvbnNcclxuXHJcblxyXG5cdCMgQ3JlYXRvci5pbml0UGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUpIC0+XHJcblxyXG5cdFx0IyAjIOW6lOivpeaKiuiuoeeul+WHuuadpeeahFxyXG5cdFx0IyBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXS5hbGxvd1xyXG5cdFx0IyBcdGluc2VydDogKHVzZXJJZCwgZG9jKSAtPlxyXG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2VcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0ICAgIFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcclxuXHRcdCMgXHRcdGlmICFwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZVxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0XHQjIFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0IyBcdHVwZGF0ZTogKHVzZXJJZCwgZG9jKSAtPlxyXG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2VcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQjIFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoZG9jLnNwYWNlLCB1c2VySWQsIG9iamVjdF9uYW1lKVxyXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93RWRpdFxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdCMgXHRcdHJldHVybiB0cnVlXHJcblx0XHQjIFx0cmVtb3ZlOiAodXNlcklkLCBkb2MpIC0+XHJcblx0XHQjIFx0XHRpZiAhdXNlcklkXHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXHJcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dEZWxldGVcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQjIFx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHRNZXRlb3IubWV0aG9kc1xyXG5cdFx0IyBDYWxjdWxhdGUgUGVybWlzc2lvbnMgb24gU2VydmVyXHJcblx0XHRcImNyZWF0b3Iub2JqZWN0X3Blcm1pc3Npb25zXCI6IChzcGFjZUlkKS0+XHJcblx0XHRcdHJldHVybiBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHRoaXMudXNlcklkKVxyXG4iLCJ2YXIgY2xvbmUsIGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QsIGZpbmRfcGVybWlzc2lvbl9vYmplY3QsIGludGVyc2VjdGlvblBsdXMsIHVuaW9uUGVybWlzc2lvbk9iamVjdHMsIHVuaW9uUGx1cztcblxuY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xuXG5DcmVhdG9yLmdldFBlcm1pc3Npb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgb2JqO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKCFvYmopIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIG9iai5wZXJtaXNzaW9ucy5nZXQoKTtcbiAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgaXNPd25lciwgb2JqZWN0X2ZpZWxkc19rZXlzLCBwZXJtaXNzaW9ucywgcmVjb3JkX2NvbXBhbnlfaWQsIHJlY29yZF9jb21wYW55X2lkcywgcmVjb3JkX2lkLCByZWYsIHJlZjEsIHNlbGVjdCwgdXNlcl9jb21wYW55X2lkcztcbiAgaWYgKCFvYmplY3RfbmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKCFzcGFjZUlkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gIH1cbiAgaWYgKHJlY29yZCAmJiBvYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIiAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFNlc3Npb24uZ2V0KCdvYmplY3RfbmFtZScpKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IHJlY29yZC5wYXJlbnRbJ3JlZmVyZW5jZV90by5fbyddO1xuICAgICAgcmVjb3JkX2lkID0gcmVjb3JkLnBhcmVudC5faWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJyk7XG4gICAgICByZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcbiAgICB9XG4gICAgb2JqZWN0X2ZpZWxkc19rZXlzID0gXy5rZXlzKCgocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMCkgfHwge30pIHx8IFtdO1xuICAgIHNlbGVjdCA9IF8uaW50ZXJzZWN0aW9uKG9iamVjdF9maWVsZHNfa2V5cywgWydvd25lcicsICdjb21wYW55X2lkJywgJ2NvbXBhbnlfaWRzJywgJ2xvY2tlZCddKSB8fCBbXTtcbiAgICBpZiAoc2VsZWN0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdC5qb2luKCcsJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWNvcmQgPSBudWxsO1xuICAgIH1cbiAgfVxuICBwZXJtaXNzaW9ucyA9IF8uY2xvbmUoQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSk7XG4gIGlmIChyZWNvcmQpIHtcbiAgICBpc093bmVyID0gcmVjb3JkLm93bmVyID09PSB1c2VySWQgfHwgKChyZWYxID0gcmVjb3JkLm93bmVyKSAhPSBudWxsID8gcmVmMS5faWQgOiB2b2lkIDApID09PSB1c2VySWQ7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdXNlcl9jb21wYW55X2lkcyA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlcl9jb21wYW55X2lkcyA9IENyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHModXNlcklkLCBzcGFjZUlkKTtcbiAgICB9XG4gICAgcmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5jb21wYW55X2lkIDogdm9pZCAwO1xuICAgIGlmIChyZWNvcmRfY29tcGFueV9pZCAmJiBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkKSAmJiByZWNvcmRfY29tcGFueV9pZC5faWQpIHtcbiAgICAgIHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkX2NvbXBhbnlfaWQuX2lkO1xuICAgIH1cbiAgICByZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5jb21wYW55X2lkcyA6IHZvaWQgMDtcbiAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGggJiYgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZHNbMF0pKSB7XG4gICAgICByZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmRfY29tcGFueV9pZHMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJlY29yZF9jb21wYW55X2lkcyA9IF8udW5pb24ocmVjb3JkX2NvbXBhbnlfaWRzLCBbcmVjb3JkX2NvbXBhbnlfaWRdKTtcbiAgICBpZiAoIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgJiYgIWlzT3duZXIgJiYgIXBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmICghcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkcyAmJiByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgIGlmICh1c2VyX2NvbXBhbnlfaWRzICYmIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aCkge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChyZWNvcmQubG9ja2VkICYmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgfVxuICAgIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgIWlzT3duZXIgJiYgIXBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHVzZXJfY29tcGFueV9pZHMgJiYgdXNlcl9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBlcm1pc3Npb25zO1xufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnMgPSBmdW5jdGlvbihjdXJyZW50T2JqZWN0TmFtZSwgcmVsYXRlZExpc3RJdGVtLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpIHtcbiAgICB2YXIgaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlLCBtYXN0ZXJBbGxvdywgbWFzdGVyUmVjb3JkUGVybSwgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLCByZXN1bHQsIHNoYXJpbmcsIHVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgIGlmICghY3VycmVudE9iamVjdE5hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBjdXJyZW50T2JqZWN0TmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghcmVsYXRlZExpc3RJdGVtKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwicmVsYXRlZExpc3RJdGVtIG11c3Qgbm90IGJlIGVtcHR5IGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zXCIpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBpZiAoIWN1cnJlbnRSZWNvcmQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBjdXJyZW50UmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQoKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIHNoYXJpbmcgPSByZWxhdGVkTGlzdEl0ZW0uc2hhcmluZyB8fCAnbWFzdGVyV3JpdGUnO1xuICAgIG1hc3RlckFsbG93ID0gZmFsc2U7XG4gICAgbWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMoY3VycmVudE9iamVjdE5hbWUsIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgaWYgKHNoYXJpbmcgPT09ICdtYXN0ZXJSZWFkJykge1xuICAgICAgbWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93UmVhZDtcbiAgICB9IGVsc2UgaWYgKHNoYXJpbmcgPT09ICdtYXN0ZXJXcml0ZScpIHtcbiAgICAgIG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXQ7XG4gICAgfVxuICAgIHVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gQ3JlYXRvci5nZXRSZWNvcmRTYWZlUmVsYXRlZExpc3QoY3VycmVudFJlY29yZCwgY3VycmVudE9iamVjdE5hbWUpO1xuICAgIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKTtcbiAgICBpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUgPSB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdC5pbmRleE9mKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSkgPiAtMTtcbiAgICByZXN1bHQgPSBfLmNsb25lKHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyk7XG4gICAgcmVzdWx0LmFsbG93Q3JlYXRlID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGU7XG4gICAgcmVzdWx0LmFsbG93RWRpdCA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgX2ksIGlzU3BhY2VBZG1pbiwgcGVybWlzc2lvbnMsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0FkbWluX3BvcywgcHNldHNDdXJyZW50LCBwc2V0c0N1cnJlbnROYW1lcywgcHNldHNDdXJyZW50X3BvcywgcHNldHNHdWVzdCwgcHNldHNHdWVzdF9wb3MsIHBzZXRzTWVtYmVyLCBwc2V0c01lbWJlcl9wb3MsIHBzZXRzVXNlciwgcHNldHNVc2VyX3Bvcywgc2V0X2lkcywgc3BhY2VVc2VyO1xuICAgIHBlcm1pc3Npb25zID0ge1xuICAgICAgb2JqZWN0czoge30sXG4gICAgICBhc3NpZ25lZF9hcHBzOiBbXVxuICAgIH07XG5cbiAgICAvKlxuICAgIFx0XHTmnYPpmZDnu4Tor7TmmI46XG4gICAgXHRcdOWGhee9ruadg+mZkOe7hC1hZG1pbix1c2VyLG1lbWJlcixndWVzdCx3b3JrZmxvd19hZG1pbixvcmdhbml6YXRpb25fYWRtaW5cbiAgICBcdFx06Ieq5a6a5LmJ5p2D6ZmQ57uELeaVsOaNruW6k+S4reaWsOW7uueahOmZpOWGhee9ruadg+mZkOe7hOS7peWklueahOWFtuS7luadg+mZkOe7hFxuICAgIFx0XHTnibnlrprnlKjmiLfpm4blkIjmnYPpmZDnu4TvvIjljbN1c2Vyc+WxnuaAp+S4jeWPr+mFjee9ru+8iS1hZG1pbix1c2VyLG1lbWJlcixndWVzdFxuICAgIFx0XHTlj6/phY3nva7nlKjmiLfpm4blkIjmnYPpmZDnu4TvvIjljbN1c2Vyc+WxnuaAp+WPr+mFjee9ru+8iS13b3JrZmxvd19hZG1pbixvcmdhbml6YXRpb25fYWRtaW7ku6Xlj4roh6rlrprkuYnmnYPpmZDnu4RcbiAgICAgKi9cbiAgICBwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNNZW1iZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ21lbWJlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c0d1ZXN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdndWVzdCdcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgIG5hbWU6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHBzZXRzQWRtaW5fcG9zID0gbnVsbDtcbiAgICBwc2V0c1VzZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c01lbWJlcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzR3Vlc3RfcG9zID0gbnVsbDtcbiAgICBwc2V0c0N1cnJlbnRfcG9zID0gbnVsbDtcbiAgICBpZiAocHNldHNBZG1pbiAhPSBudWxsID8gcHNldHNBZG1pbi5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1VzZXIgIT0gbnVsbCA/IHBzZXRzVXNlci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c1VzZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNNZW1iZXIgIT0gbnVsbCA/IHBzZXRzTWVtYmVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNNZW1iZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNHdWVzdCAhPSBudWxsID8gcHNldHNHdWVzdC5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzR3Vlc3RfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1cnJlbnQubGVuZ3RoID4gMCkge1xuICAgICAgc2V0X2lkcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIl9pZFwiKTtcbiAgICAgIHBzZXRzQ3VycmVudF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiB7XG4gICAgICAgICAgJGluOiBzZXRfaWRzXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBwc2V0c0N1cnJlbnROYW1lcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIm5hbWVcIik7XG4gICAgfVxuICAgIGlzU3BhY2VBZG1pbiA9IGZhbHNlO1xuICAgIHNwYWNlVXNlciA9IG51bGw7XG4gICAgaWYgKHVzZXJJZCkge1xuICAgICAgaXNTcGFjZUFkbWluID0gQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHBzZXRzID0ge1xuICAgICAgcHNldHNBZG1pbjogcHNldHNBZG1pbixcbiAgICAgIHBzZXRzVXNlcjogcHNldHNVc2VyLFxuICAgICAgcHNldHNDdXJyZW50OiBwc2V0c0N1cnJlbnQsXG4gICAgICBwc2V0c01lbWJlcjogcHNldHNNZW1iZXIsXG4gICAgICBwc2V0c0d1ZXN0OiBwc2V0c0d1ZXN0LFxuICAgICAgaXNTcGFjZUFkbWluOiBpc1NwYWNlQWRtaW4sXG4gICAgICBzcGFjZVVzZXI6IHNwYWNlVXNlcixcbiAgICAgIHBzZXRzQWRtaW5fcG9zOiBwc2V0c0FkbWluX3BvcyxcbiAgICAgIHBzZXRzVXNlcl9wb3M6IHBzZXRzVXNlcl9wb3MsXG4gICAgICBwc2V0c01lbWJlcl9wb3M6IHBzZXRzTWVtYmVyX3BvcyxcbiAgICAgIHBzZXRzR3Vlc3RfcG9zOiBwc2V0c0d1ZXN0X3BvcyxcbiAgICAgIHBzZXRzQ3VycmVudF9wb3M6IHBzZXRzQ3VycmVudF9wb3NcbiAgICB9O1xuICAgIHBlcm1pc3Npb25zLmFzc2lnbmVkX2FwcHMgPSBDcmVhdG9yLmdldEFzc2lnbmVkQXBwcy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBlcm1pc3Npb25zLmFzc2lnbmVkX21lbnVzID0gQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcGVybWlzc2lvbnMudXNlcl9wZXJtaXNzaW9uX3NldHMgPSBwc2V0c0N1cnJlbnROYW1lcztcbiAgICBfaSA9IDA7XG4gICAgXy5lYWNoKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgZnVuY3Rpb24ob2JqZWN0LCBvYmplY3RfbmFtZSkge1xuICAgICAgX2krKztcbiAgICAgIGlmICghXy5oYXMob2JqZWN0LCAnc3BhY2UnKSB8fCAhb2JqZWN0LnNwYWNlIHx8IG9iamVjdC5zcGFjZSA9PT0gc3BhY2VJZCkge1xuICAgICAgICBpZiAoIV8uaGFzKG9iamVjdCwgJ2luX2RldmVsb3BtZW50JykgfHwgb2JqZWN0LmluX2RldmVsb3BtZW50ID09PSAnMCcgfHwgKG9iamVjdC5pbl9kZXZlbG9wbWVudCAhPT0gJzAnICYmIGlzU3BhY2VBZG1pbikpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXSA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdKSwgc3BhY2VJZCk7XG4gICAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdW1wicGVybWlzc2lvbnNcIl0gPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICB9O1xuICB1bmlvblBsdXMgPSBmdW5jdGlvbihhcnJheSwgb3RoZXIpIHtcbiAgICBpZiAoIWFycmF5ICYmICFvdGhlcikge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKCFhcnJheSkge1xuICAgICAgYXJyYXkgPSBbXTtcbiAgICB9XG4gICAgaWYgKCFvdGhlcikge1xuICAgICAgb3RoZXIgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIF8udW5pb24oYXJyYXksIG90aGVyKTtcbiAgfTtcbiAgaW50ZXJzZWN0aW9uUGx1cyA9IGZ1bmN0aW9uKGFycmF5LCBvdGhlcikge1xuICAgIGlmICghYXJyYXkgJiYgIW90aGVyKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAoIWFycmF5KSB7XG4gICAgICBhcnJheSA9IFtdO1xuICAgIH1cbiAgICBpZiAoIW90aGVyKSB7XG4gICAgICBvdGhlciA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24oYXJyYXksIG90aGVyKTtcbiAgfTtcbiAgQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgYXBwcywgaXNTcGFjZUFkbWluLCBwc2V0QmFzZSwgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzVXNlciwgcmVmO1xuICAgIHBzZXRzQWRtaW4gPSB0aGlzLnBzZXRzQWRtaW4gfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gdGhpcy5wc2V0c1VzZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgbmFtZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGFwcHMgPSBbXTtcbiAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHBzZXRCYXNlID0gcHNldHNVc2VyO1xuICAgICAgaWYgKHBzZXRCYXNlICE9IG51bGwgPyAocmVmID0gcHNldEJhc2UuYXNzaWduZWRfYXBwcykgIT0gbnVsbCA/IHJlZi5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgYXBwcyA9IF8udW5pb24oYXBwcywgcHNldEJhc2UuYXNzaWduZWRfYXBwcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICBfLmVhY2gocHNldHMsIGZ1bmN0aW9uKHBzZXQpIHtcbiAgICAgICAgaWYgKCFwc2V0LmFzc2lnbmVkX2FwcHMpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBzZXQubmFtZSA9PT0gXCJhZG1pblwiIHx8IHBzZXQubmFtZSA9PT0gXCJ1c2VyXCIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFwcHMgPSBfLnVuaW9uKGFwcHMsIHBzZXQuYXNzaWduZWRfYXBwcyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLndpdGhvdXQoXy51bmlxKGFwcHMpLCB2b2lkIDAsIG51bGwpO1xuICAgIH1cbiAgfTtcbiAgQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGFib3V0TWVudSwgYWRtaW5NZW51cywgYWxsTWVudXMsIGN1cnJlbnRQc2V0TmFtZXMsIGlzU3BhY2VBZG1pbiwgbWVudXMsIG90aGVyTWVudUFwcHMsIG90aGVyTWVudXMsIHBzZXRzLCByZWYsIHJlc3VsdDtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgbmFtZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGFkbWluTWVudXMgPSAocmVmID0gQ3JlYXRvci5BcHBzLmFkbWluKSAhPSBudWxsID8gcmVmLmFkbWluX21lbnVzIDogdm9pZCAwO1xuICAgIGlmICghYWRtaW5NZW51cykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBhYm91dE1lbnUgPSBhZG1pbk1lbnVzLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uX2lkID09PSAnYWJvdXQnO1xuICAgIH0pO1xuICAgIGFkbWluTWVudXMgPSBhZG1pbk1lbnVzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5faWQgIT09ICdhYm91dCc7XG4gICAgfSk7XG4gICAgb3RoZXJNZW51QXBwcyA9IF8uc29ydEJ5KF8uZmlsdGVyKF8udmFsdWVzKENyZWF0b3IuQXBwcyksIGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLmFkbWluX21lbnVzICYmIG4uX2lkICE9PSAnYWRtaW4nO1xuICAgIH0pLCAnc29ydCcpO1xuICAgIG90aGVyTWVudXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhvdGhlck1lbnVBcHBzLCBcImFkbWluX21lbnVzXCIpKTtcbiAgICBhbGxNZW51cyA9IF8udW5pb24oYWRtaW5NZW51cywgb3RoZXJNZW51cywgW2Fib3V0TWVudV0pO1xuICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgIHJlc3VsdCA9IGFsbE1lbnVzO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50UHNldE5hbWVzID0gcHNldHMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4ubmFtZTtcbiAgICAgIH0pO1xuICAgICAgbWVudXMgPSBhbGxNZW51cy5maWx0ZXIoZnVuY3Rpb24obWVudSkge1xuICAgICAgICB2YXIgcHNldHNNZW51O1xuICAgICAgICBwc2V0c01lbnUgPSBtZW51LnBlcm1pc3Npb25fc2V0cztcbiAgICAgICAgaWYgKHBzZXRzTWVudSAmJiBwc2V0c01lbnUuaW5kZXhPZihcInVzZXJcIikgPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfLmludGVyc2VjdGlvbihjdXJyZW50UHNldE5hbWVzLCBwc2V0c01lbnUpLmxlbmd0aDtcbiAgICAgIH0pO1xuICAgICAgcmVzdWx0ID0gbWVudXM7XG4gICAgfVxuICAgIHJldHVybiBfLnNvcnRCeShyZXN1bHQsIFwic29ydFwiKTtcbiAgfTtcbiAgZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCA9IGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkKSB7XG4gICAgaWYgKF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBfLmZpbmQocGVybWlzc2lvbl9vYmplY3RzLCBmdW5jdGlvbihwbykge1xuICAgICAgICByZXR1cm4gcG8ub2JqZWN0X25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICBwZXJtaXNzaW9uX3NldF9pZDogcGVybWlzc2lvbl9zZXRfaWRcbiAgICB9KTtcbiAgfTtcbiAgZmluZF9wZXJtaXNzaW9uX29iamVjdCA9IGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkcykge1xuICAgIGlmIChfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gXy5maWx0ZXIocGVybWlzc2lvbl9vYmplY3RzLCBmdW5jdGlvbihwbykge1xuICAgICAgICByZXR1cm4gcG8ub2JqZWN0X25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICBwZXJtaXNzaW9uX3NldF9pZDoge1xuICAgICAgICAkaW46IHBlcm1pc3Npb25fc2V0X2lkc1xuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gIH07XG4gIHVuaW9uUGVybWlzc2lvbk9iamVjdHMgPSBmdW5jdGlvbihwb3MsIG9iamVjdCwgcHNldHMpIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIHJlc3VsdCA9IFtdO1xuICAgIF8uZWFjaChvYmplY3QucGVybWlzc2lvbl9zZXQsIGZ1bmN0aW9uKG9wcywgb3BzX2tleSkge1xuICAgICAgdmFyIGN1cnJlbnRQc2V0LCB0ZW1wT3BzO1xuICAgICAgaWYgKFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCJdLmluZGV4T2Yob3BzX2tleSkgPCAwKSB7XG4gICAgICAgIGN1cnJlbnRQc2V0ID0gcHNldHMuZmluZChmdW5jdGlvbihwc2V0KSB7XG4gICAgICAgICAgcmV0dXJuIHBzZXQubmFtZSA9PT0gb3BzX2tleTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjdXJyZW50UHNldCkge1xuICAgICAgICAgIHRlbXBPcHMgPSBfLmNsb25lKG9wcykgfHwge307XG4gICAgICAgICAgdGVtcE9wcy5wZXJtaXNzaW9uX3NldF9pZCA9IGN1cnJlbnRQc2V0Ll9pZDtcbiAgICAgICAgICB0ZW1wT3BzLm9iamVjdF9uYW1lID0gb2JqZWN0Lm9iamVjdF9uYW1lO1xuICAgICAgICAgIHJldHVybiByZXN1bHQucHVzaCh0ZW1wT3BzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChyZXN1bHQubGVuZ3RoKSB7XG4gICAgICBwb3MuZm9yRWFjaChmdW5jdGlvbihwbykge1xuICAgICAgICB2YXIgcmVwZWF0SW5kZXgsIHJlcGVhdFBvO1xuICAgICAgICByZXBlYXRJbmRleCA9IDA7XG4gICAgICAgIHJlcGVhdFBvID0gcmVzdWx0LmZpbmQoZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICByZXBlYXRJbmRleCA9IGluZGV4O1xuICAgICAgICAgIHJldHVybiBpdGVtLnBlcm1pc3Npb25fc2V0X2lkID09PSBwby5wZXJtaXNzaW9uX3NldF9pZDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyZXBlYXRQbykge1xuICAgICAgICAgIHJldHVybiByZXN1bHRbcmVwZWF0SW5kZXhdID0gcG87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKHBvKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcG9zO1xuICAgIH1cbiAgfTtcbiAgQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgaXNTcGFjZUFkbWluLCBvYmplY3QsIG9wc2V0QWRtaW4sIG9wc2V0R3Vlc3QsIG9wc2V0TWVtYmVyLCBvcHNldFVzZXIsIHBlcm1pc3Npb25zLCBwb3MsIHBvc0FkbWluLCBwb3NHdWVzdCwgcG9zTWVtYmVyLCBwb3NVc2VyLCBwcm9mLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNBZG1pbl9wb3MsIHBzZXRzQ3VycmVudF9wb3MsIHBzZXRzR3Vlc3QsIHBzZXRzR3Vlc3RfcG9zLCBwc2V0c01lbWJlciwgcHNldHNNZW1iZXJfcG9zLCBwc2V0c1VzZXIsIHBzZXRzVXNlcl9wb3MsIHNldF9pZHMsIHNwYWNlVXNlcjtcbiAgICBwZXJtaXNzaW9ucyA9IHt9O1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKTtcbiAgICBpZiAoc3BhY2VJZCA9PT0gJ2d1ZXN0JyB8fCBvYmplY3RfbmFtZSA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fTtcbiAgICAgIENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zKHBlcm1pc3Npb25zKTtcbiAgICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgICB9XG4gICAgcHNldHNBZG1pbiA9IF8uaXNOdWxsKHRoaXMucHNldHNBZG1pbikgfHwgdGhpcy5wc2V0c0FkbWluID8gdGhpcy5wc2V0c0FkbWluIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gXy5pc051bGwodGhpcy5wc2V0c1VzZXIpIHx8IHRoaXMucHNldHNVc2VyID8gdGhpcy5wc2V0c1VzZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzTWVtYmVyID0gXy5pc051bGwodGhpcy5wc2V0c01lbWJlcikgfHwgdGhpcy5wc2V0c01lbWJlciA/IHRoaXMucHNldHNNZW1iZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ21lbWJlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNHdWVzdCA9IF8uaXNOdWxsKHRoaXMucHNldHNHdWVzdCkgfHwgdGhpcy5wc2V0c0d1ZXN0ID8gdGhpcy5wc2V0c0d1ZXN0IDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdndWVzdCdcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgIG5hbWU6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwc2V0c0FkbWluX3BvcyA9IHRoaXMucHNldHNBZG1pbl9wb3M7XG4gICAgcHNldHNVc2VyX3BvcyA9IHRoaXMucHNldHNVc2VyX3BvcztcbiAgICBwc2V0c01lbWJlcl9wb3MgPSB0aGlzLnBzZXRzTWVtYmVyX3BvcztcbiAgICBwc2V0c0d1ZXN0X3BvcyA9IHRoaXMucHNldHNHdWVzdF9wb3M7XG4gICAgcHNldHNDdXJyZW50X3BvcyA9IHRoaXMucHNldHNDdXJyZW50X3BvcztcbiAgICBvcHNldEFkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuYWRtaW4pIHx8IHt9O1xuICAgIG9wc2V0VXNlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnVzZXIpIHx8IHt9O1xuICAgIG9wc2V0TWVtYmVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQubWVtYmVyKSB8fCB7fTtcbiAgICBvcHNldEd1ZXN0ID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9O1xuICAgIGlmIChwc2V0c0FkbWluKSB7XG4gICAgICBwb3NBZG1pbiA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNBZG1pbl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0FkbWluLl9pZCk7XG4gICAgICBpZiAocG9zQWRtaW4pIHtcbiAgICAgICAgb3BzZXRBZG1pbi5hbGxvd0NyZWF0ZSA9IHBvc0FkbWluLmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldEFkbWluLmFsbG93RGVsZXRlID0gcG9zQWRtaW4uYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0QWRtaW4uYWxsb3dFZGl0ID0gcG9zQWRtaW4uYWxsb3dFZGl0O1xuICAgICAgICBvcHNldEFkbWluLmFsbG93UmVhZCA9IHBvc0FkbWluLmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRBZG1pbi5tb2RpZnlBbGxSZWNvcmRzID0gcG9zQWRtaW4ubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRBZG1pbi52aWV3QWxsUmVjb3JkcyA9IHBvc0FkbWluLnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldEFkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zQWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0QWRtaW4udmlld0NvbXBhbnlSZWNvcmRzID0gcG9zQWRtaW4udmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEFkbWluLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldEFkbWluLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NBZG1pbi5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldEFkbWluLnVucmVhZGFibGVfZmllbGRzID0gcG9zQWRtaW4udW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0QWRtaW4udW5lZGl0YWJsZV9maWVsZHMgPSBwb3NBZG1pbi51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRBZG1pbi51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0FkbWluLnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgICBvcHNldEFkbWluLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zQWRtaW4udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Q7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0c1VzZXIpIHtcbiAgICAgIHBvc1VzZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzVXNlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1VzZXIuX2lkKTtcbiAgICAgIGlmIChwb3NVc2VyKSB7XG4gICAgICAgIG9wc2V0VXNlci5hbGxvd0NyZWF0ZSA9IHBvc1VzZXIuYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0VXNlci5hbGxvd0RlbGV0ZSA9IHBvc1VzZXIuYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0VXNlci5hbGxvd0VkaXQgPSBwb3NVc2VyLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRVc2VyLmFsbG93UmVhZCA9IHBvc1VzZXIuYWxsb3dSZWFkO1xuICAgICAgICBvcHNldFVzZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRVc2VyLnZpZXdBbGxSZWNvcmRzID0gcG9zVXNlci52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRVc2VyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zVXNlci5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRVc2VyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIudmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldFVzZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc1VzZXIuZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRVc2VyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NVc2VyLmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0VXNlci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1VzZXIudW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0VXNlci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc1VzZXIudW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0VXNlci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc1VzZXIudW5yZWxhdGVkX29iamVjdHM7XG4gICAgICAgIG9wc2V0VXNlci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc1VzZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Q7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0c01lbWJlcikge1xuICAgICAgcG9zTWVtYmVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c01lbWJlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c01lbWJlci5faWQpO1xuICAgICAgaWYgKHBvc01lbWJlcikge1xuICAgICAgICBvcHNldE1lbWJlci5hbGxvd0NyZWF0ZSA9IHBvc01lbWJlci5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRNZW1iZXIuYWxsb3dEZWxldGUgPSBwb3NNZW1iZXIuYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0TWVtYmVyLmFsbG93RWRpdCA9IHBvc01lbWJlci5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0TWVtYmVyLmFsbG93UmVhZCA9IHBvc01lbWJlci5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0TWVtYmVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NNZW1iZXIubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRNZW1iZXIudmlld0FsbFJlY29yZHMgPSBwb3NNZW1iZXIudmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zTWVtYmVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldE1lbWJlci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NNZW1iZXIudmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldE1lbWJlci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zTWVtYmVyLmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0TWVtYmVyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NNZW1iZXIuZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRNZW1iZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NNZW1iZXIudW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zTWVtYmVyLnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldE1lbWJlci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc01lbWJlci51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgICAgb3BzZXRNZW1iZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NNZW1iZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Q7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0c0d1ZXN0KSB7XG4gICAgICBwb3NHdWVzdCA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNHdWVzdF9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0d1ZXN0Ll9pZCk7XG4gICAgICBpZiAocG9zR3Vlc3QpIHtcbiAgICAgICAgb3BzZXRHdWVzdC5hbGxvd0NyZWF0ZSA9IHBvc0d1ZXN0LmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldEd1ZXN0LmFsbG93RGVsZXRlID0gcG9zR3Vlc3QuYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0R3Vlc3QuYWxsb3dFZGl0ID0gcG9zR3Vlc3QuYWxsb3dFZGl0O1xuICAgICAgICBvcHNldEd1ZXN0LmFsbG93UmVhZCA9IHBvc0d1ZXN0LmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRHdWVzdC5tb2RpZnlBbGxSZWNvcmRzID0gcG9zR3Vlc3QubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRHdWVzdC52aWV3QWxsUmVjb3JkcyA9IHBvc0d1ZXN0LnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldEd1ZXN0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zR3Vlc3QubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0R3Vlc3Qudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zR3Vlc3Qudmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEd1ZXN0LmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NHdWVzdC5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldEd1ZXN0LmRpc2FibGVkX2FjdGlvbnMgPSBwb3NHdWVzdC5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldEd1ZXN0LnVucmVhZGFibGVfZmllbGRzID0gcG9zR3Vlc3QudW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0R3Vlc3QudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NHdWVzdC51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRHdWVzdC51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0d1ZXN0LnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgICBvcHNldEd1ZXN0LnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zR3Vlc3QudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Q7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW47XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEFkbWluO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHNwYWNlSWQgPT09ICdjb21tb24nKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BhY2VVc2VyID0gXy5pc051bGwodGhpcy5zcGFjZVVzZXIpIHx8IHRoaXMuc3BhY2VVc2VyID8gdGhpcy5zcGFjZVVzZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoc3BhY2VVc2VyKSB7XG4gICAgICAgICAgICBwcm9mID0gc3BhY2VVc2VyLnByb2ZpbGU7XG4gICAgICAgICAgICBpZiAocHJvZikge1xuICAgICAgICAgICAgICBpZiAocHJvZiA9PT0gJ3VzZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ21lbWJlcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0TWVtYmVyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdndWVzdCcpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Q7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Q7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICBzZXRfaWRzID0gXy5wbHVjayhwc2V0cywgXCJfaWRcIik7XG4gICAgICBwb3MgPSBmaW5kX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VycmVudF9wb3MsIG9iamVjdF9uYW1lLCBzZXRfaWRzKTtcbiAgICAgIHBvcyA9IHVuaW9uUGVybWlzc2lvbk9iamVjdHMocG9zLCBvYmplY3QsIHBzZXRzKTtcbiAgICAgIF8uZWFjaChwb3MsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIGlmIChwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzQWRtaW4gIT0gbnVsbCA/IHBzZXRzQWRtaW4uX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzVXNlciAhPSBudWxsID8gcHNldHNVc2VyLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c01lbWJlciAhPSBudWxsID8gcHNldHNNZW1iZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzR3Vlc3QgIT0gbnVsbCA/IHBzZXRzR3Vlc3QuX2lkIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8uYWxsb3dSZWFkKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8uYWxsb3dDcmVhdGUpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLmFsbG93RWRpdCkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLmFsbG93RGVsZXRlKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLnZpZXdBbGxSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8udmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzLCBwby5kaXNhYmxlZF9saXN0X3ZpZXdzKTtcbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgcG8uZGlzYWJsZWRfYWN0aW9ucyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgcG8udW5yZWFkYWJsZV9maWVsZHMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIHBvLnVuZWRpdGFibGVfZmllbGRzKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBwby51bnJlbGF0ZWRfb2JqZWN0cyk7XG4gICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QsIHBvLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAob2JqZWN0LmlzX3ZpZXcpIHtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IFtdO1xuICAgIH1cbiAgICBDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyhwZXJtaXNzaW9ucyk7XG4gICAgaWYgKG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lcikge1xuICAgICAgcGVybWlzc2lvbnMub3duZXIgPSBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXI7XG4gICAgfVxuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfTtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIFwiY3JlYXRvci5vYmplY3RfcGVybWlzc2lvbnNcIjogZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdGhpcy51c2VySWQpO1xuICAgIH1cbiAgfSk7XG59XG4iLCJcclxuc3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJylcclxuXHJcbk1ldGVvci5zdGFydHVwICgpLT5cclxuXHRjcmVhdG9yX2RiX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSTF9DUkVBVE9SXHJcblx0b3Bsb2dfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BMT0dfVVJMX0NSRUFUT1JcclxuXHRpZiBjcmVhdG9yX2RiX3VybFxyXG5cdFx0aWYgIW9wbG9nX3VybFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJQbGVhc2UgY29uZmlndXJlIGVudmlyb25tZW50IHZhcmlhYmxlczogTU9OR09fT1BMT0dfVVJMX0NSRUFUT1JcIilcclxuXHRcdENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSA9IHtfZHJpdmVyOiBuZXcgTW9uZ29JbnRlcm5hbHMuUmVtb3RlQ29sbGVjdGlvbkRyaXZlcihjcmVhdG9yX2RiX3VybCwge29wbG9nVXJsOiBvcGxvZ191cmx9KX1cclxuXHJcbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUgPSAob2JqZWN0KS0+XHJcbiNcdGlmIG9iamVjdC50YWJsZV9uYW1lICYmIG9iamVjdC50YWJsZV9uYW1lLmVuZHNXaXRoKFwiX19jXCIpXHJcbiNcdFx0cmV0dXJuIG9iamVjdC50YWJsZV9uYW1lXHJcbiNcdGVsc2VcclxuI1x0XHRyZXR1cm4gb2JqZWN0Lm5hbWVcclxuXHRyZXR1cm4gb2JqZWN0Lm5hbWVcclxuQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uID0gKG9iamVjdCktPlxyXG5cdGNvbGxlY3Rpb25fa2V5ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmplY3QpXHJcblx0aWYgZGJbY29sbGVjdGlvbl9rZXldXHJcblx0XHRyZXR1cm4gZGJbY29sbGVjdGlvbl9rZXldXHJcblx0ZWxzZSBpZiBvYmplY3QuZGJcclxuXHRcdHJldHVybiBvYmplY3QuZGJcclxuXHJcblx0aWYgQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV1cclxuXHRcdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XVxyXG5cdGVsc2VcclxuXHRcdGlmIG9iamVjdC5jdXN0b21cclxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXksIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSlcclxuXHRcdGVsc2VcclxuXHRcdFx0aWYgY29sbGVjdGlvbl9rZXkgPT0gJ19zbXNfcXVldWUnICYmIFNNU1F1ZXVlPy5jb2xsZWN0aW9uXHJcblx0XHRcdFx0cmV0dXJuIFNNU1F1ZXVlLmNvbGxlY3Rpb25cclxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXkpXHJcblxyXG5cclxuIiwidmFyIHN0ZWVkb3NDb3JlO1xuXG5zdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBjcmVhdG9yX2RiX3VybCwgb3Bsb2dfdXJsO1xuICBjcmVhdG9yX2RiX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSTF9DUkVBVE9SO1xuICBvcGxvZ191cmwgPSBwcm9jZXNzLmVudi5NT05HT19PUExPR19VUkxfQ1JFQVRPUjtcbiAgaWYgKGNyZWF0b3JfZGJfdXJsKSB7XG4gICAgaWYgKCFvcGxvZ191cmwpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIlBsZWFzZSBjb25maWd1cmUgZW52aXJvbm1lbnQgdmFyaWFibGVzOiBNT05HT19PUExPR19VUkxfQ1JFQVRPUlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSA9IHtcbiAgICAgIF9kcml2ZXI6IG5ldyBNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyKGNyZWF0b3JfZGJfdXJsLCB7XG4gICAgICAgIG9wbG9nVXJsOiBvcGxvZ191cmxcbiAgICAgIH0pXG4gICAgfTtcbiAgfVxufSk7XG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIG9iamVjdC5uYW1lO1xufTtcblxuQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBjb2xsZWN0aW9uX2tleTtcbiAgY29sbGVjdGlvbl9rZXkgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iamVjdCk7XG4gIGlmIChkYltjb2xsZWN0aW9uX2tleV0pIHtcbiAgICByZXR1cm4gZGJbY29sbGVjdGlvbl9rZXldO1xuICB9IGVsc2UgaWYgKG9iamVjdC5kYikge1xuICAgIHJldHVybiBvYmplY3QuZGI7XG4gIH1cbiAgaWYgKENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3QuY3VzdG9tKSB7XG4gICAgICByZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSwgQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNvbGxlY3Rpb25fa2V5ID09PSAnX3Ntc19xdWV1ZScgJiYgKHR5cGVvZiBTTVNRdWV1ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBTTVNRdWV1ZSAhPT0gbnVsbCA/IFNNU1F1ZXVlLmNvbGxlY3Rpb24gOiB2b2lkIDApKSB7XG4gICAgICAgIHJldHVybiBTTVNRdWV1ZS5jb2xsZWN0aW9uO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXkpO1xuICAgIH1cbiAgfVxufTtcbiIsIkNyZWF0b3IuYWN0aW9uc0J5TmFtZSA9IHt9XHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHJcblx0IyDlrprkuYnlhajlsYAgYWN0aW9ucyDlh73mlbBcdFxyXG5cdENyZWF0b3IuYWN0aW9ucyA9IChhY3Rpb25zKS0+XHJcblx0XHRfLmVhY2ggYWN0aW9ucywgKHRvZG8sIGFjdGlvbl9uYW1lKS0+XHJcblx0XHRcdENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb25fbmFtZV0gPSB0b2RvIFxyXG5cclxuXHRDcmVhdG9yLmV4ZWN1dGVBY3Rpb24gPSAob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkKS0+XHJcblx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRcdGlmIGFjdGlvbj8udG9kb1xyXG5cdFx0XHRpZiB0eXBlb2YgYWN0aW9uLnRvZG8gPT0gXCJzdHJpbmdcIlxyXG5cdFx0XHRcdHRvZG8gPSBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uLnRvZG9dXHJcblx0XHRcdGVsc2UgaWYgdHlwZW9mIGFjdGlvbi50b2RvID09IFwiZnVuY3Rpb25cIlxyXG5cdFx0XHRcdHRvZG8gPSBhY3Rpb24udG9kb1x0XHJcblx0XHRcdGlmICFyZWNvcmQgJiYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkXHJcblx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcclxuXHRcdFx0aWYgdG9kb1xyXG5cdFx0XHRcdCMgaXRlbV9lbGVtZW505Li656m65pe25bqU6K+l6K6+572u6buY6K6k5YC877yI5a+56LGh55qEbmFtZeWtl+aute+8ie+8jOWQpuWImW1vcmVBcmdz5ou/5Yiw55qE5ZCO57ut5Y+C5pWw5L2N572u5bCx5LiN5a+5XHJcblx0XHRcdFx0aXRlbV9lbGVtZW50ID0gaWYgaXRlbV9lbGVtZW50IHRoZW4gaXRlbV9lbGVtZW50IGVsc2UgXCJcIlxyXG5cdFx0XHRcdG1vcmVBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKVxyXG5cdFx0XHRcdHRvZG9BcmdzID0gW29iamVjdF9uYW1lLCByZWNvcmRfaWRdLmNvbmNhdChtb3JlQXJncylcclxuXHRcdFx0XHR0b2RvLmFwcGx5IHtcclxuXHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxyXG5cdFx0XHRcdFx0cmVjb3JkX2lkOiByZWNvcmRfaWRcclxuXHRcdFx0XHRcdG9iamVjdDogb2JqXHJcblx0XHRcdFx0XHRhY3Rpb246IGFjdGlvblxyXG5cdFx0XHRcdFx0aXRlbV9lbGVtZW50OiBpdGVtX2VsZW1lbnRcclxuXHRcdFx0XHRcdHJlY29yZDogcmVjb3JkXHJcblx0XHRcdFx0fSwgdG9kb0FyZ3NcclxuXHRcdFx0XHRcclxuXHJcblx0Q3JlYXRvci5hY3Rpb25zIFxyXG5cdFx0IyDlnKjmraTlrprkuYnlhajlsYAgYWN0aW9uc1xyXG5cdFx0XCJzdGFuZGFyZF9xdWVyeVwiOiAoKS0+XHJcblx0XHRcdE1vZGFsLnNob3coXCJzdGFuZGFyZF9xdWVyeV9tb2RhbFwiKVxyXG5cclxuXHRcdFwic3RhbmRhcmRfbmV3XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cclxuXHRcdFx0aWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbb2JqZWN0X25hbWVdXHJcblx0XHRcdGlmIGlkcz8ubGVuZ3RoXHJcblx0XHRcdFx0IyDliJfooajmnInpgInkuK3pobnml7bvvIzlj5bnrKzkuIDkuKrpgInkuK3pobnvvIzlpI3liLblhbblhoXlrrnliLDmlrDlu7rnqpflj6PkuK1cclxuXHRcdFx0XHQjIOi/meeahOesrOS4gOS4quaMh+eahOaYr+esrOS4gOasoeWLvumAieeahOmAieS4remhue+8jOiAjOS4jeaYr+WIl+ihqOS4reW3suWLvumAieeahOesrOS4gOmhuVxyXG5cdFx0XHRcdHJlY29yZF9pZCA9IGlkc1swXVxyXG5cdFx0XHRcdGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXHJcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgZG9jXHJcblx0XHRcdFx0IyDigJzkv53lrZjlubbmlrDlu7rigJ3mk43kvZzkuK3oh6rliqjmiZPlvIDnmoTmlrDnqpflj6PkuK3pnIDopoHlho3mrKHlpI3liLbmnIDmlrDnmoRkb2PlhoXlrrnliLDmlrDnqpflj6PkuK1cclxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgRm9ybU1hbmFnZXIuZ2V0SW5pdGlhbFZhbHVlcyhvYmplY3RfbmFtZSlcclxuXHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cclxuXHRcdFx0XHQkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKClcclxuXHRcdFx0cmV0dXJuIFxyXG5cdFx0XHRcclxuXHRcdFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cclxuXHRcdFx0aHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXHJcblx0XHRcdHdpbmRvdy5vcGVuKFxyXG5cdFx0XHRcdGhyZWYsXHJcblx0XHRcdFx0J19ibGFuaycsXHJcblx0XHRcdFx0J3dpZHRoPTgwMCwgaGVpZ2h0PTYwMCwgbGVmdD01MCwgdG9wPSA1MCwgdG9vbGJhcj1ubywgc3RhdHVzPW5vLCBtZW51YmFyPW5vLCByZXNpemFibGU9eWVzLCBzY3JvbGxiYXJzPXllcydcclxuXHRcdFx0KVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0XHRcInN0YW5kYXJkX29wZW5fdmlld1wiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XHJcblx0XHRcdGhyZWYgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxyXG5cdFx0XHR3aW5kb3cub3BlbihcclxuXHRcdFx0XHRocmVmLFxyXG5cdFx0XHRcdCdfYmxhbmsnLFxyXG5cdFx0XHRcdCd3aWR0aD04MDAsIGhlaWdodD02MDAsIGxlZnQ9NTAsIHRvcD0gNTAsIHRvb2xiYXI9bm8sIHN0YXR1cz1ubywgbWVudWJhcj1ubywgcmVzaXphYmxlPXllcywgc2Nyb2xsYmFycz15ZXMnXHJcblx0XHRcdClcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdFx0XCJzdGFuZGFyZF9lZGl0XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cclxuXHRcdFx0aWYgcmVjb3JkX2lkXHJcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpICYmIGZhbHNlXHJcbiNcdFx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcclxuI1x0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCByZWNvcmRcclxuI1x0XHRcdFx0XHRTZXNzaW9uLnNldCAncmVsb2FkX2R4bGlzdCcsIGZhbHNlXHJcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcclxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkXHJcblx0XHRcdFx0XHRpZiB0aGlzLnJlY29yZFxyXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxyXG5cdFx0XHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cclxuXHRcdFx0XHRcdFx0JChcIi5idG4tZWRpdC1yZWNvcmRcIikuY2xpY2soKVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZVxyXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWRcclxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXHJcblx0XHRcdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIHRoaXMucmVjb3JkXHJcblx0XHRcdFx0XHRcdE1ldGVvci5kZWZlciAoKS0+XHJcblx0XHRcdFx0XHRcdFx0JChcIi5idG4uY3JlYXRvci1lZGl0XCIpLmNsaWNrKClcclxuXHJcblx0XHRcInN0YW5kYXJkX2RlbGV0ZVwiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrKS0+XHJcblx0XHRcdGNvbnNvbGUubG9nKFwic3RhbmRhcmRfZGVsZXRlXCIsIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkKVxyXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHJcblx0XHRcdGlmKCFfLmlzU3RyaW5nKHJlY29yZF90aXRsZSkgJiYgcmVjb3JkX3RpdGxlPy5uYW1lKVxyXG5cdFx0XHRcdHJlY29yZF90aXRsZSA9IHJlY29yZF90aXRsZT8ubmFtZVxyXG5cclxuXHRcdFx0aWYgcmVjb3JkX3RpdGxlXHJcblx0XHRcdFx0dGV4dCA9IFwi5piv5ZCm56Gu5a6a6KaB5Yig6Zmk5q2kI3tvYmplY3QubGFiZWx9XFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIlxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGV4dCA9IFwi5piv5ZCm56Gu5a6a6KaB5Yig6Zmk5q2kI3tvYmplY3QubGFiZWx9XCJcclxuXHRcdFx0c3dhbFxyXG5cdFx0XHRcdHRpdGxlOiBcIuWIoOmZpCN7b2JqZWN0LmxhYmVsfVwiXHJcblx0XHRcdFx0dGV4dDogXCI8ZGl2IGNsYXNzPSdkZWxldGUtY3JlYXRvci13YXJuaW5nJz4je3RleHR977yfPC9kaXY+XCJcclxuXHRcdFx0XHRodG1sOiB0cnVlXHJcblx0XHRcdFx0c2hvd0NhbmNlbEJ1dHRvbjp0cnVlXHJcblx0XHRcdFx0Y29uZmlybUJ1dHRvblRleHQ6IHQoJ0RlbGV0ZScpXHJcblx0XHRcdFx0Y2FuY2VsQnV0dG9uVGV4dDogdCgnQ2FuY2VsJylcclxuXHRcdFx0XHQob3B0aW9uKSAtPlxyXG5cdFx0XHRcdFx0aWYgb3B0aW9uXHJcblx0XHRcdFx0XHRcdENyZWF0b3Iub2RhdGEuZGVsZXRlIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsICgpLT5cclxuXHRcdFx0XHRcdFx0XHRpZiByZWNvcmRfdGl0bGVcclxuXHRcdFx0XHRcdFx0XHRcdGluZm8gPSBvYmplY3QubGFiZWwgKyBcIlxcXCIje3JlY29yZF90aXRsZX1cXFwiXCIgKyBcIuW3suWIoOmZpFwiXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0aW5mbyA9IFwi5Yig6Zmk5oiQ5YqfXCJcclxuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyBpbmZvXHJcblx0XHRcdFx0XHRcdFx0IyDmlofku7bniYjmnKzkuLpcImNmcy5maWxlcy5maWxlcmVjb3JkXCLvvIzpnIDopoHmm7/mjaLkuLpcImNmcy1maWxlcy1maWxlcmVjb3JkXCJcclxuXHRcdFx0XHRcdFx0XHRncmlkT2JqZWN0TmFtZUNsYXNzID0gb2JqZWN0X25hbWUucmVwbGFjZSgvXFwuL2csXCItXCIpXHJcblx0XHRcdFx0XHRcdFx0Z3JpZENvbnRhaW5lciA9ICQoXCIuZ3JpZENvbnRhaW5lci4je2dyaWRPYmplY3ROYW1lQ2xhc3N9XCIpXHJcblx0XHRcdFx0XHRcdFx0dW5sZXNzIGdyaWRDb250YWluZXI/Lmxlbmd0aFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgd2luZG93Lm9wZW5lclxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpc09wZW5lclJlbW92ZSA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z3JpZENvbnRhaW5lciA9IHdpbmRvdy5vcGVuZXIuJChcIi5ncmlkQ29udGFpbmVyLiN7Z3JpZE9iamVjdE5hbWVDbGFzc31cIilcclxuXHRcdFx0XHRcdFx0XHRpZiBncmlkQ29udGFpbmVyPy5sZW5ndGhcclxuXHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfdHJlZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4VHJlZUxpc3QoKS5keFRyZWVMaXN0KCdpbnN0YW5jZScpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhEYXRhR3JpZCgpLmR4RGF0YUdyaWQoJ2luc3RhbmNlJylcclxuXHRcdFx0XHRcdFx0XHRpZiBkeERhdGFHcmlkSW5zdGFuY2VcclxuXHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfdHJlZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UucmVmcmVzaCgpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFRlbXBsYXRlLmNyZWF0b3JfZ3JpZC5yZWZyZXNoKGR4RGF0YUdyaWRJbnN0YW5jZSlcclxuXHRcdFx0XHRcdFx0XHRpZiBpc09wZW5lclJlbW92ZSBvciAhZHhEYXRhR3JpZEluc3RhbmNlXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBpc09wZW5lclJlbW92ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cuY2xvc2UoKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiByZWNvcmRfaWQgPT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikgYW5kICFTdGVlZG9zLmlzTW9iaWxlKCkgYW5kIGxpc3Rfdmlld19pZCAhPSAnY2FsZW5kYXInXHJcblx0XHRcdFx0XHRcdFx0XHRcdGFwcGlkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcclxuXHRcdFx0XHRcdFx0XHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXHJcblx0XHRcdFx0XHRcdFx0XHRcdHVubGVzcyBsaXN0X3ZpZXdfaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsaXN0X3ZpZXdfaWQgPSBcImFsbFwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIuZ28gXCIvYXBwLyN7YXBwaWR9LyN7b2JqZWN0X25hbWV9L2dyaWQvI3tsaXN0X3ZpZXdfaWR9XCJcclxuXHRcdFx0XHRcdFx0XHRpZiBjYWxsX2JhY2sgYW5kIHR5cGVvZiBjYWxsX2JhY2sgPT0gXCJmdW5jdGlvblwiXHJcblx0XHRcdFx0XHRcdFx0XHRjYWxsX2JhY2soKVxyXG4iLCJDcmVhdG9yLmFjdGlvbnNCeU5hbWUgPSB7fTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBDcmVhdG9yLmFjdGlvbnMgPSBmdW5jdGlvbihhY3Rpb25zKSB7XG4gICAgcmV0dXJuIF8uZWFjaChhY3Rpb25zLCBmdW5jdGlvbih0b2RvLCBhY3Rpb25fbmFtZSkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb25fbmFtZV0gPSB0b2RvO1xuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLmV4ZWN1dGVBY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYWN0aW9uLCByZWNvcmRfaWQsIGl0ZW1fZWxlbWVudCwgbGlzdF92aWV3X2lkLCByZWNvcmQpIHtcbiAgICB2YXIgbW9yZUFyZ3MsIG9iaiwgdG9kbywgdG9kb0FyZ3M7XG4gICAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmIChhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwKSB7XG4gICAgICBpZiAodHlwZW9mIGFjdGlvbi50b2RvID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRvZG8gPSBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uLnRvZG9dO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYWN0aW9uLnRvZG8gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0b2RvID0gYWN0aW9uLnRvZG87XG4gICAgICB9XG4gICAgICBpZiAoIXJlY29yZCAmJiBvYmplY3RfbmFtZSAmJiByZWNvcmRfaWQpIHtcbiAgICAgICAgcmVjb3JkID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICB9XG4gICAgICBpZiAodG9kbykge1xuICAgICAgICBpdGVtX2VsZW1lbnQgPSBpdGVtX2VsZW1lbnQgPyBpdGVtX2VsZW1lbnQgOiBcIlwiO1xuICAgICAgICBtb3JlQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMyk7XG4gICAgICAgIHRvZG9BcmdzID0gW29iamVjdF9uYW1lLCByZWNvcmRfaWRdLmNvbmNhdChtb3JlQXJncyk7XG4gICAgICAgIHJldHVybiB0b2RvLmFwcGx5KHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgICAgcmVjb3JkX2lkOiByZWNvcmRfaWQsXG4gICAgICAgICAgb2JqZWN0OiBvYmosXG4gICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgICAgaXRlbV9lbGVtZW50OiBpdGVtX2VsZW1lbnQsXG4gICAgICAgICAgcmVjb3JkOiByZWNvcmRcbiAgICAgICAgfSwgdG9kb0FyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgQ3JlYXRvci5hY3Rpb25zKHtcbiAgICBcInN0YW5kYXJkX3F1ZXJ5XCI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIE1vZGFsLnNob3coXCJzdGFuZGFyZF9xdWVyeV9tb2RhbFwiKTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfbmV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGRvYywgaWRzO1xuICAgICAgaWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbb2JqZWN0X25hbWVdO1xuICAgICAgaWYgKGlkcyAhPSBudWxsID8gaWRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICByZWNvcmRfaWQgPSBpZHNbMF07XG4gICAgICAgIGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBkb2MpO1xuICAgICAgICBTZXNzaW9uLnNldCgnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBGb3JtTWFuYWdlci5nZXRJbml0aWFsVmFsdWVzKG9iamVjdF9uYW1lKSk7XG4gICAgICB9XG4gICAgICBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGhyZWY7XG4gICAgICBocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICB3aW5kb3cub3BlbihocmVmLCAnX2JsYW5rJywgJ3dpZHRoPTgwMCwgaGVpZ2h0PTYwMCwgbGVmdD01MCwgdG9wPSA1MCwgdG9vbGJhcj1ubywgc3RhdHVzPW5vLCBtZW51YmFyPW5vLCByZXNpemFibGU9eWVzLCBzY3JvbGxiYXJzPXllcycpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9vcGVuX3ZpZXdcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgaHJlZjtcbiAgICAgIGhyZWYgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgIHdpbmRvdy5vcGVuKGhyZWYsICdfYmxhbmsnLCAnd2lkdGg9ODAwLCBoZWlnaHQ9NjAwLCBsZWZ0PTUwLCB0b3A9IDUwLCB0b29sYmFyPW5vLCBzdGF0dXM9bm8sIG1lbnViYXI9bm8sIHJlc2l6YWJsZT15ZXMsIHNjcm9sbGJhcnM9eWVzJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX2VkaXRcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgJiYgZmFsc2UpIHtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIHRoaXMucmVjb3JkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiLmJ0bi1lZGl0LXJlY29yZFwiKS5jbGljaygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSk7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWQpO1xuICAgICAgICAgIGlmICh0aGlzLnJlY29yZCkge1xuICAgICAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgdGhpcy5yZWNvcmQpO1xuICAgICAgICAgICAgcmV0dXJuIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICQoXCIuYnRuLmNyZWF0b3ItZWRpdFwiKS5jbGljaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX2RlbGV0ZVwiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2spIHtcbiAgICAgIHZhciBvYmplY3QsIHRleHQ7XG4gICAgICBjb25zb2xlLmxvZyhcInN0YW5kYXJkX2RlbGV0ZVwiLCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCk7XG4gICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgICBpZiAoIV8uaXNTdHJpbmcocmVjb3JkX3RpdGxlKSAmJiAocmVjb3JkX3RpdGxlICE9IG51bGwgPyByZWNvcmRfdGl0bGUubmFtZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmVjb3JkX3RpdGxlID0gcmVjb3JkX3RpdGxlICE9IG51bGwgPyByZWNvcmRfdGl0bGUubmFtZSA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICAgIGlmIChyZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgdGV4dCA9IFwi5piv5ZCm56Gu5a6a6KaB5Yig6Zmk5q2kXCIgKyBvYmplY3QubGFiZWwgKyBcIlxcXCJcIiArIHJlY29yZF90aXRsZSArIFwiXFxcIlwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dCA9IFwi5piv5ZCm56Gu5a6a6KaB5Yig6Zmk5q2kXCIgKyBvYmplY3QubGFiZWw7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3dhbCh7XG4gICAgICAgIHRpdGxlOiBcIuWIoOmZpFwiICsgb2JqZWN0LmxhYmVsLFxuICAgICAgICB0ZXh0OiBcIjxkaXYgY2xhc3M9J2RlbGV0ZS1jcmVhdG9yLXdhcm5pbmcnPlwiICsgdGV4dCArIFwi77yfPC9kaXY+XCIsXG4gICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiB0KCdEZWxldGUnKSxcbiAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogdCgnQ2FuY2VsJylcbiAgICAgIH0sIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICBpZiAob3B0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIENyZWF0b3Iub2RhdGFbXCJkZWxldGVcIl0ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYXBwaWQsIGR4RGF0YUdyaWRJbnN0YW5jZSwgZ3JpZENvbnRhaW5lciwgZ3JpZE9iamVjdE5hbWVDbGFzcywgaW5mbywgaXNPcGVuZXJSZW1vdmU7XG4gICAgICAgICAgICBpZiAocmVjb3JkX3RpdGxlKSB7XG4gICAgICAgICAgICAgIGluZm8gPSBvYmplY3QubGFiZWwgKyAoXCJcXFwiXCIgKyByZWNvcmRfdGl0bGUgKyBcIlxcXCJcIikgKyBcIuW3suWIoOmZpFwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaW5mbyA9IFwi5Yig6Zmk5oiQ5YqfXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhpbmZvKTtcbiAgICAgICAgICAgIGdyaWRPYmplY3ROYW1lQ2xhc3MgPSBvYmplY3RfbmFtZS5yZXBsYWNlKC9cXC4vZywgXCItXCIpO1xuICAgICAgICAgICAgZ3JpZENvbnRhaW5lciA9ICQoXCIuZ3JpZENvbnRhaW5lci5cIiArIGdyaWRPYmplY3ROYW1lQ2xhc3MpO1xuICAgICAgICAgICAgaWYgKCEoZ3JpZENvbnRhaW5lciAhPSBudWxsID8gZ3JpZENvbnRhaW5lci5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIGlmICh3aW5kb3cub3BlbmVyKSB7XG4gICAgICAgICAgICAgICAgaXNPcGVuZXJSZW1vdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGdyaWRDb250YWluZXIgPSB3aW5kb3cub3BlbmVyLiQoXCIuZ3JpZENvbnRhaW5lci5cIiArIGdyaWRPYmplY3ROYW1lQ2xhc3MpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZ3JpZENvbnRhaW5lciAhPSBudWxsID8gZ3JpZENvbnRhaW5lci5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgaWYgKG9iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICAgIGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhUcmVlTGlzdCgpLmR4VHJlZUxpc3QoJ2luc3RhbmNlJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keERhdGFHcmlkKCkuZHhEYXRhR3JpZCgnaW5zdGFuY2UnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGR4RGF0YUdyaWRJbnN0YW5jZSkge1xuICAgICAgICAgICAgICBpZiAob2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlLnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBUZW1wbGF0ZS5jcmVhdG9yX2dyaWQucmVmcmVzaChkeERhdGFHcmlkSW5zdGFuY2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNPcGVuZXJSZW1vdmUgfHwgIWR4RGF0YUdyaWRJbnN0YW5jZSkge1xuICAgICAgICAgICAgICBpZiAoaXNPcGVuZXJSZW1vdmUpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZWNvcmRfaWQgPT09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgbGlzdF92aWV3X2lkICE9PSAnY2FsZW5kYXInKSB7XG4gICAgICAgICAgICAgICAgYXBwaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgICAgICAgICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICAgICAgICAgICAgICBsaXN0X3ZpZXdfaWQgPSBcImFsbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBGbG93Um91dGVyLmdvKFwiL2FwcC9cIiArIGFwcGlkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2FsbF9iYWNrICYmIHR5cGVvZiBjYWxsX2JhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICByZXR1cm4gY2FsbF9iYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=
